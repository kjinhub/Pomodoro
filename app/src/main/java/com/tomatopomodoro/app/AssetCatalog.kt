package com.tomatopomodoro.app

data class PremiumAsset(
    val productId: String,
    val name: String,
    val previewPath: String,
    val vaultPath: String
)

object AssetCatalog {
    val assets = listOf(
        PremiumAsset("premium_asset_001", "Kiwi Slice", "./assets/store/previews/asset_001.webp", "p/a001.vlt"),
        PremiumAsset("premium_asset_002", "Blue Gingham Button", "./assets/store/previews/asset_002.webp", "p/a002.vlt"),
        PremiumAsset("premium_asset_003", "Pink Grapefruit", "./assets/store/previews/asset_003.webp", "p/a003.vlt"),
        PremiumAsset("premium_asset_004", "Sprinkle Donut", "./assets/store/previews/asset_004.webp", "p/a004.vlt"),
        PremiumAsset("premium_asset_005", "Lemon Glow", "./assets/store/previews/asset_005.webp", "p/a005.vlt"),
        PremiumAsset("premium_asset_006", "Citrus Candy", "./assets/store/previews/asset_006.webp", "p/a006.vlt"),
        PremiumAsset("premium_asset_007", "Lime Gloss", "./assets/store/previews/asset_007.webp", "p/a007.vlt"),
        PremiumAsset("premium_asset_008", "Orange Slice", "./assets/store/previews/asset_008.webp", "p/a008.vlt"),
        PremiumAsset("premium_asset_009", "Black Button", "./assets/store/previews/asset_009.webp", "p/a009.vlt"),
        PremiumAsset("premium_asset_010", "Midnight Button", "./assets/store/previews/asset_010.webp", "p/a010.vlt"),
        PremiumAsset("premium_asset_011", "Eight Ball", "./assets/store/previews/asset_011.webp", "p/a011.vlt"),
        PremiumAsset("premium_asset_012", "Baseball", "./assets/store/previews/asset_012.webp", "p/a012.vlt")
    )

    val productIds = assets.map { it.productId }.toSet()

    fun find(productId: String): PremiumAsset? = assets.firstOrNull { it.productId == productId }

    fun isKnownProduct(productId: String): Boolean = productId in productIds
}
