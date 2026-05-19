# Tomato Pomodoro

Offline Android Pomodoro timer with a tomato progress visual.

## Features

- Works without Wi-Fi or internet after installation.
- Native Android WebView wrapper with no `INTERNET` permission.
- Pomodoro timer with start, pause, reset, focus/break settings, and local stats.
- Tomato image disappears clockwise as the session progresses.
- Premium replacement image asset store through Google Play Billing.
- Completion feedback through alarm tone and vibration.
- Play Store release bundle support.

## Project Layout

- `index.html`, `styles.css`, `script.js`: web UI source.
- `assets/tomatoto.png`: tomato image asset.
- `app/`: Android wrapper project.
- `PLAY_STORE_RELEASE.md`: release and signing notes.
- `docs/ASSET_STORE_BILLING.md`: premium asset store architecture and release checklist.

## Build

Install Android SDK 35 and JDK 17, then run:

```powershell
gradle :app:bundleRelease :app:assembleRelease
```

Release outputs:

- `app/build/outputs/bundle/release/app-release.aab`
- `app/build/outputs/apk/release/app-release.apk`

Signing credentials are intentionally excluded from Git.
