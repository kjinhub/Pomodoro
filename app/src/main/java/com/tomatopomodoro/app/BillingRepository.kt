package com.tomatopomodoro.app

import android.app.Activity
import android.content.Context
import android.os.Handler
import android.os.Looper
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams

class BillingRepository(
    context: Context,
    private val entitlementStore: SecureEntitlementStore,
    private val activityProvider: () -> Activity?,
    private val onStateChanged: (String?) -> Unit
) : PurchasesUpdatedListener {
    private val mainHandler = Handler(Looper.getMainLooper())
    private val productDetails = mutableMapOf<String, ProductDetails>()
    private val pendingReadyCallbacks = mutableListOf<() -> Unit>()
    private var isConnecting = false
    private var lastBillingResponseCode = BillingClient.BillingResponseCode.SERVICE_DISCONNECTED

    private val billingClient: BillingClient = BillingClient.newBuilder(context.applicationContext)
        .setListener(this)
        .enablePendingPurchases(
            PendingPurchasesParams.newBuilder()
                .enableOneTimeProducts()
                .build()
        )
        .build()

    fun isReady(): Boolean = billingClient.isReady

    fun hasProductDetails(productId: String): Boolean = productDetails.containsKey(productId)

    fun formattedPrice(productId: String): String {
        return productDetails[productId]?.oneTimePurchaseOfferDetails?.formattedPrice ?: "₩1,000"
    }

    fun refresh(showRestoredMessage: Boolean = false) {
        connect {
            queryProductDetails()
            queryOwnedPurchases(showRestoredMessage)
        }
    }

    fun buy(productId: String) {
        if (!AssetCatalog.isKnownProduct(productId)) {
            return
        }

        connect {
            val details = productDetails[productId]
            if (details == null) {
                onStateChanged("Unable to purchase while offline.")
                queryProductDetails()
                return@connect
            }

            val activity = activityProvider()
            if (activity == null) {
                onStateChanged("Unable to purchase while offline.")
                return@connect
            }

            val params = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(
                    listOf(
                        BillingFlowParams.ProductDetailsParams.newBuilder()
                            .setProductDetails(details)
                            .build()
                    )
                )
                .build()

            val result = billingClient.launchBillingFlow(activity, params)
            if (result.responseCode != BillingClient.BillingResponseCode.OK) {
                onStateChanged(messageForBillingResult(result, "Unable to purchase while offline."))
            }
        }
    }

    fun destroy() {
        if (billingClient.isReady) {
            billingClient.endConnection()
        }
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: MutableList<Purchase>?) {
        when (result.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                if (purchases.isNullOrEmpty()) {
                    onStateChanged(null)
                    return
                }
                handlePurchases(purchases, "Purchase completed.")
            }

            BillingClient.BillingResponseCode.USER_CANCELED -> onStateChanged("Purchase cancelled.")
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> {
                queryOwnedPurchases(showRestoredMessage = true)
            }

            else -> onStateChanged(messageForBillingResult(result, "Unable to purchase while offline."))
        }
    }

    private fun connect(onReady: () -> Unit) {
        mainHandler.post {
            if (billingClient.isReady) {
                onReady()
                return@post
            }

            pendingReadyCallbacks.add(onReady)
            if (isConnecting) {
                return@post
            }

            isConnecting = true
            billingClient.startConnection(object : BillingClientStateListener {
                override fun onBillingSetupFinished(result: BillingResult) {
                    mainHandler.post {
                        isConnecting = false
                        lastBillingResponseCode = result.responseCode
                        if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                            val callbacks = pendingReadyCallbacks.toList()
                            pendingReadyCallbacks.clear()
                            callbacks.forEach { it.invoke() }
                        } else {
                            pendingReadyCallbacks.clear()
                            onStateChanged("Connect to the internet to purchase or restore assets.")
                        }
                    }
                }

                override fun onBillingServiceDisconnected() {
                    mainHandler.post {
                        isConnecting = false
                        lastBillingResponseCode = BillingClient.BillingResponseCode.SERVICE_DISCONNECTED
                        onStateChanged("Connect to the internet to purchase or restore assets.")
                    }
                }
            })
        }
    }

    private fun queryProductDetails() {
        val products = AssetCatalog.assets.map {
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(it.productId)
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        }

        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(products)
            .build()

        billingClient.queryProductDetailsAsync(params) { result, queryResult ->
            mainHandler.post {
                lastBillingResponseCode = result.responseCode
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    productDetails.clear()
                    queryResult.productDetailsList.forEach { productDetails[it.productId] = it }
                    onStateChanged(null)
                } else {
                    onStateChanged("Connect to the internet to purchase or restore assets.")
                }
            }
        }
    }

    private fun queryOwnedPurchases(showRestoredMessage: Boolean) {
        if (!billingClient.isReady) {
            onStateChanged("Connect to the internet to purchase or restore assets.")
            return
        }

        val params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.INAPP)
            .build()

        billingClient.queryPurchasesAsync(params) { result, purchases ->
            mainHandler.post {
                lastBillingResponseCode = result.responseCode
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    handlePurchases(
                        purchases,
                        if (showRestoredMessage) "Purchase restored." else null
                    )
                } else {
                    onStateChanged("Connect to the internet to purchase or restore assets.")
                }
            }
        }
    }

    private fun handlePurchases(purchases: List<Purchase>, successMessage: String?) {
        var granted = false
        var pending = false

        purchases.forEach { purchase ->
            when (purchase.purchaseState) {
                Purchase.PurchaseState.PURCHASED -> {
                    if (PurchaseVerifier.verifyClientSide(purchase)) {
                        purchase.products
                            .filter { AssetCatalog.isKnownProduct(it) }
                            .forEach {
                                entitlementStore.grant(it, purchase.purchaseToken, purchase.purchaseTime)
                                granted = true
                            }
                        acknowledgeIfNeeded(purchase)
                    }
                }

                Purchase.PurchaseState.PENDING -> pending = true
                else -> Unit
            }
        }

        when {
            pending -> onStateChanged("Purchase pending.")
            granted && successMessage != null -> onStateChanged(successMessage)
            else -> onStateChanged(null)
        }
    }

    private fun acknowledgeIfNeeded(purchase: Purchase) {
        if (purchase.isAcknowledged) {
            return
        }

        val params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.purchaseToken)
            .build()

        billingClient.acknowledgePurchase(params) {
            onStateChanged(null)
        }
    }

    private fun messageForBillingResult(result: BillingResult, fallback: String): String {
        return when (result.responseCode) {
            BillingClient.BillingResponseCode.USER_CANCELED -> "Purchase cancelled."
            BillingClient.BillingResponseCode.ITEM_UNAVAILABLE,
            BillingClient.BillingResponseCode.BILLING_UNAVAILABLE,
            BillingClient.BillingResponseCode.SERVICE_DISCONNECTED,
            BillingClient.BillingResponseCode.SERVICE_UNAVAILABLE -> "Unable to purchase while offline."

            else -> fallback
        }
    }
}
