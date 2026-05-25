# Tomato Pomodoro Android 출시 안내

## Play Store 업로드 파일

현재 출시 버전:

```text
versionCode 2
versionName 1.1.0

Google Play Console에는 아래 Android App Bundle 파일을 업로드합니다.

app/build/outputs/bundle/release/app-release.aab

로컬 기기 테스트에는 아래 APK 파일을 사용합니다.

app/build/outputs/apk/release/app-release.apk
인앱 상품

Play Console에서 아래 상품들을 1회성, 비소모성 인앱 상품으로 생성하고, 각 상품 가격을 1,000원(KRW) 으로 설정합니다.

premium_asset_001
premium_asset_002
premium_asset_003
premium_asset_004
premium_asset_005
premium_asset_006
premium_asset_007
premium_asset_008
premium_asset_009
premium_asset_010
premium_asset_011
premium_asset_012

설정 > 에셋 스토어 화면은 Google Play Billing만 사용합니다.
이미 구매한 에셋은 암호화된 로컬 구매 권한 캐시를 통해 오프라인에서도 계속 사용할 수 있습니다.

오프라인 동작 방식

이 앱은 Android의 INTERNET 권한을 요청하지 않습니다.
Pomodoro UI는 앱 내부의 assets/www 경로에 포함되어 있으며, MainActivity는 아래 파일만 로드합니다.

file:///android_asset/www/index.html

WebView 클라이언트는 file:///android_asset/www/ 외부로 이동하는 모든 탐색을 차단합니다.

이 앱은 세션 완료 알림 시 기기 진동을 제공하기 위해 android.permission.VIBRATE 권한을 요청합니다.
완료 알림은 로컬 전용 TomatoAndroid WebView 브리지를 통해 실행되며, Sound 설정이 켜져 있을 경우 네이티브 알람음을 재생합니다.

구매, 상품 상세 정보 조회, 구매 복원, 구매 권한 동기화에는 Google Play Billing 연결이 필요합니다.

권한
android.permission.VIBRATE: Pomodoro 완료 시 진동 알림에만 사용됩니다.
com.android.vending.BILLING: 프리미엄 교체 이미지 에셋 구매에만 사용됩니다.

이 앱은 인터넷, 위치, 연락처, 카메라, 마이크, 저장소, 광고 ID 권한을 요청하지 않습니다.

서명 인증 정보

출시 번들은 아래 파일을 사용해 서명됩니다.

keystore/upload-keystore.jks
keystore.properties

두 파일은 반드시 비공개로 보관해야 합니다.
이 앱이 Play App Signing에 등록되어 있다면, 이 키는 업로드 키로 사용됩니다.

재빌드 명령어

Android Studio에 포함된 JBR과 설치된 Gradle 8.4를 사용합니다.

$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:GRADLE_USER_HOME='C:\Users\82108\.gradle'
$env:ANDROID_HOME='C:\Users\82108\AppData\Local\Android\Sdk'
$env:ANDROID_SDK_ROOT=$env:ANDROID_HOME
$env:PATH="$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"
& 'C:\Users\82108\.gradle\wrapper\dists\gradle-8.4-bin\1w5dpkrfk8irigvoxmyhowfim\gradle-8.4\bin\gradle.bat' :app:bundleRelease --offline --no-daemon
