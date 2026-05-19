# Tomato Pomodoro Android Release

## Play Store Upload File

Current release version:

```text
versionCode 2
versionName 1.1.0
```

Upload this Android App Bundle to Google Play Console:

```text
app/build/outputs/bundle/release/app-release.aab
```

For local device testing, use:

```text
app/build/outputs/apk/release/app-release.apk
```

## In-App Products

Create these one-time, non-consumable in-app products in Play Console and price each at KRW 1,000:

- `premium_asset_001`
- `premium_asset_002`
- `premium_asset_003`
- `premium_asset_004`
- `premium_asset_005`
- `premium_asset_006`
- `premium_asset_007`
- `premium_asset_008`
- `premium_asset_009`
- `premium_asset_010`
- `premium_asset_011`
- `premium_asset_012`

The Settings > Asset Store screen uses Google Play Billing only. Already-purchased assets remain usable offline from encrypted local entitlement cache.

## Offline Behavior

The app does not request the Android `INTERNET` permission. The Pomodoro UI is packaged inside the app under `assets/www`, and `MainActivity` only loads:

```text
file:///android_asset/www/index.html
```

Any navigation outside `file:///android_asset/www/` is blocked by the WebView client.

The app requests `android.permission.VIBRATE` so the session-complete alert can vibrate the device. Completion alerts are triggered through the local-only `TomatoAndroid` WebView bridge and play a native alarm tone when Sound is enabled.

Purchasing, product detail queries, restore purchases, and entitlement synchronization require Google Play Billing connectivity.

## Permissions

- `android.permission.VIBRATE`: used only for Pomodoro completion vibration.
- `com.android.vending.BILLING`: used only for premium replacement image asset purchases.

The app does not request internet, location, contacts, camera, microphone, storage, or advertising ID permissions.

## Signing Credentials

The release bundle is signed with:

```text
keystore/upload-keystore.jks
keystore.properties
```

Keep both files private. If this app is enrolled in Play App Signing, this key is your upload key.

## Rebuild Commands

Use Android Studio's bundled JBR and the installed Gradle 8.4:

```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:GRADLE_USER_HOME='C:\Users\82108\.gradle'
$env:ANDROID_HOME='C:\Users\82108\AppData\Local\Android\Sdk'
$env:ANDROID_SDK_ROOT=$env:ANDROID_HOME
$env:PATH="$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"
& 'C:\Users\82108\.gradle\wrapper\dists\gradle-8.4-bin\1w5dpkrfk8irigvoxmyhowfim\gradle-8.4\bin\gradle.bat' :app:bundleRelease --offline --no-daemon
```
