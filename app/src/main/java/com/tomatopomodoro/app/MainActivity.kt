package com.tomatopomodoro.app

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.media.AudioManager
import android.media.ToneGenerator
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : Activity() {
    private var webView: WebView? = null
    private var assetStoreBridge: AssetStoreBridge? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val view = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        webView = view
        assetStoreBridge = AssetStoreBridge(this, { this }, view)
        configureWebView(view)
        setContentView(view)
        view.loadUrl(APP_URL)
        assetStoreBridge?.refreshPurchasesOnLaunch()
    }

    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    private fun configureWebView(view: WebView) {
        val settings = view.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = false
        settings.allowContentAccess = false
        settings.allowFileAccess = true
        settings.allowFileAccessFromFileURLs = false
        settings.allowUniversalAccessFromFileURLs = false
        settings.setSupportMultipleWindows(false)
        settings.javaScriptCanOpenWindowsAutomatically = false
        settings.mediaPlaybackRequiresUserGesture = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW

        view.addJavascriptInterface(CompletionBridge(this), "TomatoAndroid")
        assetStoreBridge?.let { view.addJavascriptInterface(it, "TomatoAndroidAssetStore") }
        view.webViewClient = LocalOnlyWebViewClient()
    }

    override fun onBackPressed() {
        val view = webView
        if (view != null && view.canGoBack()) {
            view.goBack()
            return
        }
        super.onBackPressed()
    }

    override fun onDestroy() {
        assetStoreBridge?.destroy()
        assetStoreBridge = null
        webView?.destroy()
        webView = null
        super.onDestroy()
    }

    private class LocalOnlyWebViewClient : WebViewClient() {
        override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
            return shouldBlock(request.url)
        }

        @Deprecated("Deprecated in Java")
        override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
            return shouldBlock(Uri.parse(url))
        }

        private fun shouldBlock(uri: Uri?): Boolean {
            if (uri == null) {
                return true
            }

            return !uri.toString().startsWith(APP_URL_PREFIX)
        }
    }

    private class CompletionBridge(context: Context) {
        private val appContext = context.applicationContext
        private val mainHandler = Handler(Looper.getMainLooper())

        @JavascriptInterface
        fun notifySessionComplete(soundEnabled: Boolean, vibrationEnabled: Boolean) {
            if (vibrationEnabled) {
                vibrate()
            }

            if (soundEnabled) {
                playAlarmTone()
            }
        }

        @Suppress("DEPRECATION")
        private fun vibrate() {
            val vibrator = appContext.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator ?: return
            if (!vibrator.hasVibrator()) {
                return
            }

            val pattern = longArrayOf(0, 450, 120, 450)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
            } else {
                vibrator.vibrate(pattern, -1)
            }
        }

        private fun playAlarmTone() {
            mainHandler.post {
                val toneGenerator = ToneGenerator(AudioManager.STREAM_ALARM, 85)
                toneGenerator.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 900)
                mainHandler.postDelayed({ toneGenerator.release() }, 1100)
            }
        }
    }

    companion object {
        private const val APP_URL = "file:///android_asset/www/index.html"
        private const val APP_URL_PREFIX = "file:///android_asset/www/"
    }
}
