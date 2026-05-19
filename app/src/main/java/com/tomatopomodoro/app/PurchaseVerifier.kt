package com.tomatopomodoro.app

import com.android.billingclient.api.Purchase

object PurchaseVerifier {
    fun verifyClientSide(purchase: Purchase): Boolean {
        return purchase.purchaseState == Purchase.PurchaseState.PURCHASED &&
            purchase.purchaseToken.isNotBlank() &&
            purchase.products.any { AssetCatalog.isKnownProduct(it) }
    }
}
