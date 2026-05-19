package com.tomatopomodoro.app

import android.content.Context
import android.util.Base64
import java.security.MessageDigest
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

class AssetVault(private val context: Context, private val entitlementStore: SecureEntitlementStore) {
    fun loadOwnedAssetDataUrl(productId: String?): String? {
        if (productId.isNullOrBlank() || !entitlementStore.isOwned(productId)) {
            return null
        }

        val asset = AssetCatalog.find(productId) ?: return null
        val encrypted = context.assets.open(asset.vaultPath).use { it.readBytes() }
        if (encrypted.size <= GCM_IV_LENGTH_BYTES) {
            return null
        }

        val iv = encrypted.copyOfRange(0, GCM_IV_LENGTH_BYTES)
        val payload = encrypted.copyOfRange(GCM_IV_LENGTH_BYTES, encrypted.size)
        val cipher = Cipher.getInstance(AES_GCM_TRANSFORMATION)
        cipher.init(Cipher.DECRYPT_MODE, vaultKey(), GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv))
        val decoded = cipher.doFinal(payload)
        val image = Base64.encodeToString(decoded, Base64.NO_WRAP)
        return "data:image/png;base64,$image"
    }

    private fun vaultKey(): SecretKeySpec {
        val digest = MessageDigest.getInstance("SHA-256")
            .digest("TomatoPomodoro|premium-asset-vault|v1|com.tomatopomodoro.app".toByteArray(Charsets.UTF_8))
        return SecretKeySpec(digest, "AES")
    }

    companion object {
        private const val AES_GCM_TRANSFORMATION = "AES/GCM/NoPadding"
        private const val GCM_IV_LENGTH_BYTES = 12
        private const val GCM_TAG_LENGTH_BITS = 128
    }
}
