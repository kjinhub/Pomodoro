# Tomato Pomodoro

토마토 진행 애니메이션을 제공하는 오프라인 Android 뽀모도로 타이머 앱입니다.

## 주요 기능

- 설치 후 Wi-Fi나 인터넷 없이 사용할 수 있습니다.
- `INTERNET` 권한이 없는 네이티브 Android WebView 래퍼 구조입니다.
- 시작, 일시정지, 초기화, 집중/휴식 시간 설정, 로컬 통계 기능을 제공합니다.
- 세션이 진행될수록 토마토 이미지가 시계 방향으로 사라집니다.
- Google Play Billing을 통한 프리미엄 교체 이미지 에셋 스토어를 지원합니다.
- 세션 완료 시 알람음과 진동으로 피드백을 제공합니다.
- Play Store 출시용 번들 빌드를 지원합니다.

## 프로젝트 구조

- `index.html`, `styles.css`, `script.js`: 웹 UI 소스 파일입니다.
- `assets/tomatoto.png`: 토마토 이미지 에셋입니다.
- `app/`: Android 래퍼 프로젝트입니다.
- `PLAY_STORE_RELEASE.md`: 출시 및 서명 관련 안내 문서입니다.
- `docs/ASSET_STORE_BILLING.md`: 프리미엄 에셋 스토어 구조와 출시 체크리스트 문서입니다.

## 빌드 방법

Android SDK 35와 JDK 17을 설치한 뒤, 아래 명령어를 실행합니다.

```powershell
gradle :app:bundleRelease :app:assembleRelease

빌드 결과물은 아래 경로에 생성됩니다.

app/build/outputs/bundle/release/app-release.aab
app/build/outputs/apk/release/app-release.apk
