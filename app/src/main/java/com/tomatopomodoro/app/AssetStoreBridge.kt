package com.tomatopomodoro.app

import android.app.Activity
import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView
import org.json.JSONArray
import org.json.JSONObject
import java.lang.ref.WeakReference

class AssetStoreBridge(
    private val context: Context,
    activityProvider: () -> Activity?,
    webView: WebView
) {
    private val webViewRef = WeakReference(webView)
    private val entitlementStore = SecureEntitlementStore(context)
    private val assetVault = AssetVault(context, entitlementStore)
    private val billingRepository = BillingRepository(
        context = context,
        entitlementStore = entitlementStore,
        activityProvider = activityProvider,
        onStateChanged = { message -> emitState(message) }
    )

    @JavascriptInterface
    fun getStoreState(): String = buildState(null).toString()

    @JavascriptInterface
    fun refreshStore() {
        billingRepository.refresh(showRestoredMessage = false)
        emitState(null)
    }

    @JavascriptInterface
    fun restorePurchases() {
        billingRepository.refresh(showRestoredMessage = true)
        emitState(null)
    }

    @JavascriptInterface
    fun buy(productId: String) {
        if (!billingRepository.isReady() || !billingRepository.hasProductDetails(productId)) {
            billingRepository.refresh(showRestoredMessage = false)
            emitState("Unable to purchase while offline.")
            return
        }

        billingRepository.buy(productId)
    }

    @JavascriptInterface
    fun selectAsset(productId: String): Boolean {
        val selected = entitlementStore.selectProduct(productId)
        emitState(null)
        return selected
    }

    @JavascriptInterface
    fun clearSelectedAsset(): Boolean {
        val cleared = entitlementStore.selectProduct(null)
        emitState(null)
        return cleared
    }

    @JavascriptInterface
    fun getSelectedAssetDataUrl(): String {
        return assetVault.loadOwnedAssetDataUrl(entitlementStore.getSelectedProductId()).orEmpty()
    }

    @JavascriptInterface
    fun getSelectedProductId(): String = entitlementStore.getSelectedProductId().orEmpty()

    fun refreshPurchasesOnLaunch() {
        billingRepository.refresh(showRestoredMessage = false)
    }

    fun destroy() {
        billingRepository.destroy()
    }

    private fun emitState(message: String?) {
        val json = buildState(message).toString()
        val script = "window.AssetStoreNative && window.AssetStoreNative.onNativeState(${JSONObject.quote(json)});"
        webViewRef.get()?.post {
            webViewRef.get()?.evaluateJavascript(script, null)
        }
    }

    private fun buildState(message: String?): JSONObject {
        val owned = entitlementStore.getOwnedProductIds()
        val selected = entitlementStore.getSelectedProductId()
        val onlineForPurchases = billingRepository.isReady()
        val assets = JSONArray()

        AssetCatalog.assets.forEach { asset ->
            val isOwned = asset.productId in owned
            assets.put(
                JSONObject()
                    .put("productId", asset.productId)
                    .put("name", asset.name)
                    .put("previewPath", asset.previewPath)
                    .put("price", billingRepository.formattedPrice(asset.productId))
                    .put("owned", isOwned)
                    .put("locked", !isOwned)
                    .put("selected", asset.productId == selected)
                    .put("canBuy", !isOwned && onlineForPurchases && billingRepository.hasProductDetails(asset.productId))
            )
        }

        return JSONObject()
            .put("assets", assets)
            .put("selectedProductId", selected ?: "")
            .put("onlineForPurchases", onlineForPurchases)
            .put("offlineLockedMessage", "Connect to the internet to purchase or restore assets.")
            .put("message", message ?: "")
    }
}
