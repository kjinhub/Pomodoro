package com.tomatopomodoro.app

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import org.json.JSONArray
import org.json.JSONObject
import java.security.KeyStore
import java.security.MessageDigest
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class SecureEntitlementStore(context: Context) {
    private val appContext = context.applicationContext
    private val prefs: SharedPreferences =
        appContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun isOwned(productId: String): Boolean = getOwnedProductIds().contains(productId)

    fun getOwnedProductIds(): Set<String> {
        val state = readState()
        val entitlements = state.optJSONArray(KEY_ENTITLEMENTS) ?: return emptySet()
        val owned = mutableSetOf<String>()

        for (index in 0 until entitlements.length()) {
            val item = entitlements.optJSONObject(index) ?: continue
            val productId = item.optString(KEY_PRODUCT_ID)
            val status = item.optString(KEY_STATUS)
            if (AssetCatalog.isKnownProduct(productId) && status == STATUS_OWNED) {
                owned.add(productId)
            }
        }

        return owned
    }

    fun grant(productId: String, purchaseToken: String, purchaseTime: Long) {
        if (!AssetCatalog.isKnownProduct(productId) || purchaseToken.isBlank()) {
            return
        }

        val state = readState()
        val entitlements = state.optJSONArray(KEY_ENTITLEMENTS) ?: JSONArray()
        val tokenHash = purchaseTokenHash(purchaseToken)
        var replaced = false

        for (index in 0 until entitlements.length()) {
            val item = entitlements.optJSONObject(index) ?: continue
            if (item.optString(KEY_PRODUCT_ID) == productId) {
                item.put(KEY_TOKEN_HASH, tokenHash)
                item.put(KEY_PURCHASE_TIME, purchaseTime)
                item.put(KEY_STATUS, STATUS_OWNED)
                replaced = true
            }
        }

        if (!replaced) {
            entitlements.put(
                JSONObject()
                    .put(KEY_PRODUCT_ID, productId)
                    .put(KEY_TOKEN_HASH, tokenHash)
                    .put(KEY_PURCHASE_TIME, purchaseTime)
                    .put(KEY_STATUS, STATUS_OWNED)
            )
        }

        state.put(KEY_VERSION, 1)
        state.put(KEY_ENTITLEMENTS, entitlements)
        writeState(state)
    }

    fun getSelectedProductId(): String? {
        val selected = readState().optString(KEY_SELECTED, "")
        return selected.takeIf { AssetCatalog.isKnownProduct(it) && isOwned(it) }
    }

    fun selectProduct(productId: String?): Boolean {
        val state = readState()
        val normalized = productId?.takeIf { AssetCatalog.isKnownProduct(it) && isOwned(it) }
        if (productId != null && normalized == null) {
            return false
        }

        if (normalized == null) {
            state.remove(KEY_SELECTED)
        } else {
            state.put(KEY_SELECTED, normalized)
        }

        writeState(state)
        return true
    }

    private fun readState(): JSONObject {
        val encoded = prefs.getString(KEY_VAULT, null) ?: return emptyState()
        return try {
            val bytes = Base64.decode(encoded, Base64.NO_WRAP)
            if (bytes.size <= GCM_IV_LENGTH_BYTES) {
                return emptyState()
            }

            val iv = bytes.copyOfRange(0, GCM_IV_LENGTH_BYTES)
            val ciphertext = bytes.copyOfRange(GCM_IV_LENGTH_BYTES, bytes.size)
            val cipher = Cipher.getInstance(AES_GCM_TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, getOrCreateKey(), GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv))
            JSONObject(String(cipher.doFinal(ciphertext), Charsets.UTF_8))
        } catch (_: Exception) {
            emptyState()
        }
    }

    private fun writeState(state: JSONObject) {
        try {
            val cipher = Cipher.getInstance(AES_GCM_TRANSFORMATION)
            cipher.init(Cipher.ENCRYPT_MODE, getOrCreateKey())
            val ciphertext = cipher.doFinal(state.toString().toByteArray(Charsets.UTF_8))
            val payload = cipher.iv + ciphertext
            prefs.edit().putString(KEY_VAULT, Base64.encodeToString(payload, Base64.NO_WRAP)).apply()
        } catch (_: Exception) {
            // Entitlement cache failures should not crash the timer.
        }
    }

    private fun emptyState(): JSONObject =
        JSONObject()
            .put(KEY_VERSION, 1)
            .put(KEY_ENTITLEMENTS, JSONArray())

    private fun purchaseTokenHash(token: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(token.toByteArray(Charsets.UTF_8))
        return Base64.encodeToString(digest, Base64.NO_WRAP)
    }

    private fun getOrCreateKey(): SecretKey {
        val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }
        val existing = keyStore.getKey(KEY_ALIAS, null)
        if (existing is SecretKey) {
            return existing
        }

        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEYSTORE)
        val spec = KeyGenParameterSpec.Builder(
            KEY_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setRandomizedEncryptionRequired(true)
            .build()
        generator.init(spec)
        return generator.generateKey()
    }

    companion object {
        private const val PREFS_NAME = "premium_entitlement_store"
        private const val KEY_ALIAS = "tomato_premium_entitlement_key_v1"
        private const val ANDROID_KEYSTORE = "AndroidKeyStore"
        private const val AES_GCM_TRANSFORMATION = "AES/GCM/NoPadding"
        private const val GCM_IV_LENGTH_BYTES = 12
        private const val GCM_TAG_LENGTH_BITS = 128
        private const val KEY_VAULT = "encrypted_state"
        private const val KEY_VERSION = "version"
        private const val KEY_ENTITLEMENTS = "entitlements"
        private const val KEY_PRODUCT_ID = "productId"
        private const val KEY_TOKEN_HASH = "purchaseTokenHash"
        private const val KEY_PURCHASE_TIME = "purchaseTime"
        private const val KEY_STATUS = "status"
        private const val KEY_SELECTED = "selectedProductId"
        private const val STATUS_OWNED = "owned"
    }
}
