# Premium Asset Store and Google Play Billing

## 1. Recommended Android Project Architecture

- `index.html`, `styles.css`, `script.js`: offline-first WebView UI and Settings > Asset Store view.
- `app/src/main/java/com/tomatopomodoro/app/MainActivity.kt`: hardened local WebView host and completion alarm bridge.
- `AssetCatalog.kt`: authoritative local catalog for premium assets and product IDs.
- `BillingRepository.kt`: Google Play Billing Client integration for one-time non-consumable products.
- `SecureEntitlementStore.kt`: encrypted local entitlement cache backed by Android Keystore AES-GCM.
- `AssetVault.kt`: decrypts packaged premium asset bundles only for locally entitled products.
- `AssetStoreBridge.kt`: safe JavaScript bridge between Settings UI and native billing/entitlement state.
- `app/src/main/assets/p/*.vlt`: encrypted offline premium asset bundles.
- `assets/store/previews/*.webp`: low-resolution previews copied into WebView assets.

## 2. Kotlin Implementation Plan

1. Keep the existing WebView UI for the timer and Settings screen.
2. Move Android host code to Kotlin so BillingClient and entitlement code stay type-safe and testable.
3. Treat Google Play as the source of truth whenever online.
4. Treat encrypted local entitlements as an offline cache only.
5. Query product details before enabling any Buy button.
6. Query existing purchases on app launch and whenever Settings > Asset Store opens.
7. Grant entitlement only after `PurchaseState.PURCHASED`, known product ID validation, and purchase token presence checks.
8. Acknowledge purchases after entitlement grant.
9. Use local encrypted asset bundles for already-purchased offline display.

## 3. Google Play Billing Integration Code Structure

- Product type: `BillingClient.ProductType.INAPP`
- Library: `com.android.billingclient:billing:8.3.0`
- Product IDs: `premium_asset_001` through `premium_asset_012`
- Flow:
  - `BillingClient.startConnection`
  - `queryProductDetailsAsync`
  - `queryPurchasesAsync`
  - `launchBillingFlow`
  - `onPurchasesUpdated`
  - local entitlement grant
  - `acknowledgePurchase`

Client-only limitation: this build performs the safest practical local-only checks. A production backend with Google Play Developer API verification is stronger and should be added before high-value monetization.

## 4. Settings > Asset Store UI Structure

- Section title: `Asset Store`
- Per-asset card:
  - Preview image
  - Asset name
  - Price: `₩1,000`
  - Status: `Owned` or `Locked`
  - Button: `Buy for ₩1,000` when locked and product details are available
  - Button: `Use this asset` when owned
- Global action: `Restore Purchases`
- Messages:
  - `Purchase completed.`
  - `Purchase pending.`
  - `Purchase cancelled.`
  - `Unable to purchase while offline.`
  - `Purchase restored.`
  - `Connect to the internet to purchase or restore assets.`

## 5. Local Entitlement Storage Approach

- Android Keystore AES-GCM key.
- Encrypted SharedPreferences payload.
- Minimal stored data:
  - `productId`
  - SHA-256 hash of purchase token
  - purchase time
  - local entitlement status
  - selected product ID
- Raw purchase tokens, user identifiers, and billing details are not logged or stored in plaintext.

## 6. Offline-First Behavior Rules

- Timer UI works offline.
- Default tomato image works offline.
- Purchased asset display works offline from encrypted local entitlements.
- Selected asset is persisted locally and falls back to default if not locally entitled.
- Locked assets show previews offline but cannot be purchased.
- Offline locked message: `Connect to the internet to purchase or restore assets.`
- Purchase, restore, product detail query, and entitlement synchronization require Google Play Billing connectivity.
- Reinstall recovery requires Restore Purchases or a purchase query from Google Play.

## 7. Security Checklist

- Uses only Google Play Billing for digital asset purchases.
- Adds `com.android.vending.BILLING`.
- Does not add internet, location, contacts, camera, microphone, or storage permissions.
- Does not use editable `isPurchased=true` flags.
- Keeps entitlements encrypted with Android Keystore.
- Stores purchase token hashes, not raw purchase tokens.
- Does not log purchase tokens or user identifiers.
- Enables R8, resource shrinking, and obfuscation for release.
- Blocks WebView navigation outside local packaged assets.
- Packages full premium assets as encrypted bundles.
- Documents that offline packaged assets cannot be made extraction-proof.

## 8. Google Play Release Checklist

- Create one-time in-app products in Play Console with exact product IDs from this document.
- Price each product at KRW 1,000.
- Add store listing copy: "Premium replacement image assets are available as optional one-time in-app purchases."
- Upload signed Android App Bundle: `app/build/outputs/bundle/release/app-release.aab`.
- Complete Data Safety form accurately.
- Publish a privacy policy, even if no personal data is collected.
- Add license testers.
- Test in closed testing before production.

## 9. Test Cases

- Successful purchase grants the selected product, acknowledges purchase, and shows `Purchase completed.`
- Cancelled purchase leaves asset locked and shows `Purchase cancelled.`
- Pending purchase leaves asset locked and shows `Purchase pending.`
- Restore Purchases recovers owned products and shows `Purchase restored.`
- App restart after purchase still shows owned status and selected image.
- Offline after purchase still displays the selected premium asset.
- Offline locked purchase attempt shows `Unable to purchase while offline.`
- Fresh reinstall starts locked until Restore Purchases or purchase query succeeds.
- Unknown or missing selected asset falls back to the default tomato image.
