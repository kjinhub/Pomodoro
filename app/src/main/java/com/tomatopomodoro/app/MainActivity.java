package com.tomatopomodoro.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final String APP_URL = "file:///android_asset/www/index.html";
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        configureWebView(webView);
        setContentView(webView);
        webView.loadUrl(APP_URL);
    }

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    private void configureWebView(WebView view) {
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setSupportMultipleWindows(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        view.addJavascriptInterface(new CompletionBridge(this), "TomatoAndroid");
        view.setWebViewClient(new LocalOnlyWebViewClient());
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    private static class LocalOnlyWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return shouldBlock(request.getUrl());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return shouldBlock(Uri.parse(url));
        }

        private static boolean shouldBlock(Uri uri) {
            if (uri == null) {
                return true;
            }

            String url = uri.toString();
            return !url.startsWith("file:///android_asset/www/");
        }
    }

    private static class CompletionBridge {
        private final Context appContext;
        private final Handler mainHandler = new Handler(Looper.getMainLooper());

        CompletionBridge(Context context) {
            appContext = context.getApplicationContext();
        }

        @JavascriptInterface
        public void notifySessionComplete(boolean soundEnabled, boolean vibrationEnabled) {
            if (vibrationEnabled) {
                vibrate();
            }

            if (soundEnabled) {
                playAlarmTone();
            }
        }

        @SuppressWarnings("deprecation")
        private void vibrate() {
            Vibrator vibrator = (Vibrator) appContext.getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator == null || !vibrator.hasVibrator()) {
                return;
            }

            long[] pattern = {0, 450, 120, 450};
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1));
            } else {
                vibrator.vibrate(pattern, -1);
            }
        }

        private void playAlarmTone() {
            mainHandler.post(() -> {
                ToneGenerator toneGenerator = new ToneGenerator(AudioManager.STREAM_ALARM, 85);
                toneGenerator.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 900);
                mainHandler.postDelayed(toneGenerator::release, 1100);
            });
        }
    }
}
