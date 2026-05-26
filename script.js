const STORAGE_KEY = "tomato-pomodoro-settings";
const STATS_KEY = "tomato-pomodoro-stats";
const ASSET_SELECTION_KEY = "tomato-pomodoro-selected-asset";
const DEFAULT_TOMATO_SRC = "./assets/tomatoto.png";

const PREMIUM_ASSETS = [
  ["premium_asset_001", "Kiwi Slice", "./assets/store/previews/asset_001.webp"],
  ["premium_asset_002", "Blue Gingham Button", "./assets/store/previews/asset_002.webp"],
  ["premium_asset_003", "Pink Grapefruit", "./assets/store/previews/asset_003.webp"],
  ["premium_asset_004", "Sprinkle Donut", "./assets/store/previews/asset_004.webp"],
  ["premium_asset_005", "Lemon Glow", "./assets/store/previews/asset_005.webp"],
  ["premium_asset_006", "Citrus Candy", "./assets/store/previews/asset_006.webp"],
  ["premium_asset_007", "Lime Gloss", "./assets/store/previews/asset_007.webp"],
  ["premium_asset_008", "Orange Slice", "./assets/store/previews/asset_008.webp"],
  ["premium_asset_009", "Black Button", "./assets/store/previews/asset_009.webp"],
  ["premium_asset_010", "Midnight Button", "./assets/store/previews/asset_010.webp"],
  ["premium_asset_011", "Eight Ball", "./assets/store/previews/asset_011.webp"],
  ["premium_asset_012", "Baseball", "./assets/store/previews/asset_012.webp"],
];

const ASSET_THEMES = {
  default: {
    accent: "#ff2630",
    accentDark: "#d81920",
    accentLight: "#ff6a4d",
    accentRgb: "255, 38, 48",
    success: "#17863a",
    successDark: "#62c980",
  },
  premium_asset_001: {
    accent: "#8bcf3f",
    accentDark: "#4f9a23",
    accentLight: "#d5f66e",
    accentRgb: "139, 207, 63",
    success: "#228b52",
    successDark: "#78d899",
  },
  premium_asset_002: {
    accent: "#4f8fcf",
    accentDark: "#27649d",
    accentLight: "#8fc5f2",
    accentRgb: "79, 143, 207",
    success: "#2f7f62",
    successDark: "#72d4aa",
  },
  premium_asset_003: {
    accent: "#ff6b8d",
    accentDark: "#d84066",
    accentLight: "#ff9fb6",
    accentRgb: "255, 107, 141",
    success: "#3f9b74",
    successDark: "#7edab2",
  },
  premium_asset_004: {
    accent: "#f26aa8",
    accentDark: "#c83d7d",
    accentLight: "#ffb1d0",
    accentRgb: "242, 106, 168",
    success: "#4b9b83",
    successDark: "#85ddc0",
  },
  premium_asset_005: {
    accent: "#f8c537",
    accentDark: "#d99a10",
    accentLight: "#ffe27a",
    accentRgb: "248, 197, 55",
    success: "#478c42",
    successDark: "#8fd887",
  },
  premium_asset_006: {
    accent: "#ff8a22",
    accentDark: "#d65e0d",
    accentLight: "#ffc15c",
    accentRgb: "255, 138, 34",
    success: "#4a9345",
    successDark: "#8ada82",
  },
  premium_asset_007: {
    accent: "#45bf56",
    accentDark: "#228a35",
    accentLight: "#91e878",
    accentRgb: "69, 191, 86",
    success: "#2b9652",
    successDark: "#76d999",
  },
  premium_asset_008: {
    accent: "#ff7a1a",
    accentDark: "#d8580f",
    accentLight: "#ffb24f",
    accentRgb: "255, 122, 26",
    success: "#55923f",
    successDark: "#98d57a",
  },
  premium_asset_009: {
    accent: "#2f2f31",
    accentDark: "#111113",
    accentLight: "#727276",
    accentRgb: "47, 47, 49",
    success: "#5fba7a",
    successDark: "#8ddca4",
  },
  premium_asset_010: {
    accent: "#2f557f",
    accentDark: "#172d49",
    accentLight: "#668db8",
    accentRgb: "47, 85, 127",
    success: "#5fba93",
    successDark: "#8ddcc0",
  },
  premium_asset_011: {
    accent: "#303236",
    accentDark: "#101114",
    accentLight: "#777a82",
    accentRgb: "48, 50, 54",
    success: "#5cb878",
    successDark: "#8cdba3",
  },
  premium_asset_012: {
    accent: "#e73d3d",
    accentDark: "#b51f25",
    accentLight: "#ffffff",
    accentRgb: "231, 61, 61",
    success: "#1f7fb8",
    successDark: "#76c8ef",
  },
};

const DEFAULT_SETTINGS = {
  focus: 25,
  short: 5,
  long: 15,
  cycles: 4,
  autoStart: false,
  sound: true,
  vibration: true,
  language: "ko",
  theme: "dark",
  showTodaySummary: true,
};

const TRANSLATIONS = {
  en: {
    appLabel: "Tomato Pomodoro timer",
    reset: "Reset",
    resetTimer: "Reset timer",
    settings: "Settings",
    openSettings: "Open settings",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    chooseLanguage: "Choose language",
    close: "Close",
    closeSettings: "Close settings",
    progress: "Progress",
    timerMode: "Timer mode",
    startTimer: "Start timer",
    pauseTimer: "Pause timer",
    start: "Start",
    startInitial: "Start",
    startSession: "Start session",
    startNextSession: "Start next session",
    pause: "Pause",
    resume: "Resume",
    focusMode: "Focus",
    shortMode: "Short Break",
    longMode: "Long Break",
    focusActive: "Focusing",
    shortActive: "Short break",
    longActive: "Long break",
    setProgress: "{current} / {total} sets",
    todaySummary: "Today {count}",
    focusTab: "Focus",
    shortTab: "Short",
    longTab: "Long",
    timeSettings: "Time settings",
    focusDuration: "Focus",
    shortBreak: "Short break",
    longBreak: "Long break",
    longAfter: "Long after",
    minutesUnit: "min",
    sessionsUnit: "times",
    countUnit: " times",
    longAfterHelp: "A long break starts after {cycles} focus sessions.",
    language: "Language",
    theme: "Theme",
    themeHelp: "Choose dark or white mode.",
    darkMode: "Dark mode",
    lightMode: "White mode",
    autoStart: "Auto start",
    autoStartHelp: "The next focus or break session starts automatically.",
    sound: "Sound",
    soundHelp: "Play an alert sound when a session starts or ends.",
    vibration: "Vibration",
    vibrationHelp: "Vibrate the device when a session ends.",
    today: "Today",
    todayStats: "Completed focus sessions today",
    todayStatsHelp: "Show today's completed focus count on the timer screen.",
    tomatoAlt: "Tomato",
    selectedAssetAlt: "Selected premium asset",
    assetStore: "Asset Store",
    openAssetStore: "Open asset store",
    closeAssetStore: "Close asset store",
    restorePurchases: "Restore Purchases",
    freeAssetsMessage: "All themes are free to use.",
    clear: "Clear",
    resetDefaults: "Reset",
    save: "Save",
    saving: "Saving...",
    saveComplete: "Saved",
    cancel: "Cancel",
    settingsSaved: "Settings saved.",
    settingsReset: "Settings reset to defaults.",
    resetConfirmTitle: "Reset settings to defaults?",
    resetConfirmDescription: "All timer settings will return to their default values.",
    focusValidation: "Focus time must be at least 1 minute.",
    shortValidation: "Short break must be at least 1 minute.",
    longValidation: "Long break must be at least 1 minute.",
    cyclesValidation: "Long break cycle must be at least 1 time.",
    owned: "Owned",
    locked: "Locked",
    free: "Free",
    using: "Using",
    useThisAsset: "Use this asset",
    buyForPrice: "Buy for ₩1,000",
    offlineMessage: "Connect to the internet to purchase or restore assets.",
    unableOffline: "Unable to purchase while offline.",
    purchaseCompleted: "Purchase completed.",
    purchasePending: "Purchase pending.",
    purchaseCancelled: "Purchase cancelled.",
    purchaseRestored: "Purchase restored.",
  },
  ko: {
    appLabel: "토마토 포모도로 타이머",
    reset: "초기화",
    resetTimer: "타이머 초기화",
    settings: "설정",
    openSettings: "설정 열기",
    menu: "메뉴",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    chooseLanguage: "언어 선택",
    close: "닫기",
    closeSettings: "설정 닫기",
    progress: "진행률",
    timerMode: "타이머 모드",
    startTimer: "타이머 시작",
    pauseTimer: "타이머 일시정지",
    start: "시작",
    startInitial: "시작하기",
    startSession: "시작하기",
    startNextSession: "다음 세션 시작",
    pause: "일시정지",
    resume: "다시 시작",
    focusMode: "집중",
    shortMode: "짧은 휴식",
    longMode: "긴 휴식",
    focusActive: "집중 중",
    shortActive: "짧은 휴식 중",
    longActive: "긴 휴식 중",
    setProgress: "{current} / {total} 세트",
    todaySummary: "오늘 완료 {count}회",
    focusTab: "집중",
    shortTab: "짧은 휴식",
    longTab: "긴 휴식",
    timeSettings: "시간 설정",
    focusDuration: "집중 시간",
    shortBreak: "짧은 휴식",
    longBreak: "긴 휴식",
    longAfter: "긴 휴식 주기",
    minutesUnit: "분",
    sessionsUnit: "회",
    countUnit: "회",
    longAfterHelp: "집중을 {cycles}번 완료하면 긴 휴식이 시작됩니다.",
    language: "언어",
    theme: "테마",
    themeHelp: "다크 모드 또는 화이트 모드를 선택하세요.",
    darkMode: "다크 모드",
    lightMode: "화이트 모드",
    autoStart: "자동 시작",
    autoStartHelp: "세션이 끝나면 다음 집중/휴식이 자동으로 시작됩니다.",
    sound: "소리",
    soundHelp: "세션 시작과 종료 시 알림음을 재생합니다.",
    vibration: "진동",
    vibrationHelp: "세션 종료 시 기기가 진동합니다.",
    today: "오늘 완료",
    todayStats: "오늘 완료한 집중 세션",
    todayStatsHelp: "타이머 화면에 오늘 완료 횟수 문구를 표시합니다.",
    tomatoAlt: "토마토",
    selectedAssetAlt: "선택한 프리미엄 에셋",
    assetStore: "에셋 스토어",
    openAssetStore: "에셋 스토어 열기",
    closeAssetStore: "에셋 스토어 닫기",
    restorePurchases: "구매 복원",
    freeAssetsMessage: "모든 테마를 무료로 사용할 수 있습니다.",
    clear: "초기화",
    resetDefaults: "초기화",
    save: "저장",
    saving: "저장 중...",
    saveComplete: "저장 완료",
    cancel: "취소",
    settingsSaved: "설정이 저장되었습니다.",
    settingsReset: "설정이 기본값으로 초기화되었습니다.",
    resetConfirmTitle: "설정을 기본값으로 초기화할까요?",
    resetConfirmDescription: "초기화하면 현재 설정값이 모두 기본값으로 돌아갑니다.",
    focusValidation: "집중 시간은 1분 이상이어야 합니다.",
    shortValidation: "짧은 휴식은 1분 이상이어야 합니다.",
    longValidation: "긴 휴식은 1분 이상이어야 합니다.",
    cyclesValidation: "긴 휴식 주기는 1회 이상이어야 합니다.",
    owned: "보유",
    locked: "잠김",
    free: "무료",
    using: "사용 중",
    useThisAsset: "이 에셋 사용",
    buyForPrice: "₩1,000에 구매",
    offlineMessage: "에셋을 구매하거나 복원하려면 인터넷에 연결하세요.",
    unableOffline: "오프라인에서는 구매할 수 없습니다.",
    purchaseCompleted: "구매가 완료되었습니다.",
    purchasePending: "구매가 대기 중입니다.",
    purchaseCancelled: "구매가 취소되었습니다.",
    purchaseRestored: "구매가 복원되었습니다.",
  },
};

const MESSAGE_KEYS = {
  "Connect to the internet to purchase or restore assets.": "offlineMessage",
  "Unable to purchase while offline.": "unableOffline",
  "Purchase completed.": "purchaseCompleted",
  "Purchase pending.": "purchasePending",
  "Purchase cancelled.": "purchaseCancelled",
  "Purchase restored.": "purchaseRestored",
  "All assets are free.": "freeAssetsMessage",
  "에셋을 구매하거나 복원하려면 인터넷에 연결하세요.": "offlineMessage",
  "오프라인에서는 구매할 수 없습니다.": "unableOffline",
  "구매가 완료되었습니다.": "purchaseCompleted",
  "구매가 대기 중입니다.": "purchasePending",
  "구매가 취소되었습니다.": "purchaseCancelled",
  "구매가 복원되었습니다.": "purchaseRestored",
};

const SETTING_LIMITS = {
  focus: [1, 120],
  short: [1, 60],
  long: [1, 90],
  cycles: [1, 12],
};

const SUPPORTED_THEMES = new Set(["dark", "light"]);
const LANGUAGE_LABELS = {
  en: "English",
  ko: "한국어",
};

const appShell = document.querySelector(".app-shell");
const timerDisplay = document.getElementById("timerDisplay");
const modeLabel = document.getElementById("modeLabel");
const setLabel = document.getElementById("setLabel");
const todaySummary = document.getElementById("todaySummary");
const progressRing = document.getElementById("progressRing");
const tomatoCanvas = document.getElementById("tomatoCanvas");
const tomatoImage = document.getElementById("tomatoImage");
const playButton = document.getElementById("playButton");
const actionLabel = document.getElementById("actionLabel");
const timerMenu = document.getElementById("timerMenu");
const menuButton = document.getElementById("menuButton");
const resetButton = document.getElementById("resetButton");
const settingsButton = document.getElementById("settingsButton");
const settingsDialog = document.getElementById("settingsDialog");
const settingsForm = document.querySelector(".settings-panel");
const themeChoice = document.querySelector(".theme-choice");
const languageSelectButton = document.getElementById("languageSelectButton");
const languageSelectLabel = document.getElementById("languageSelectLabel");
const languageDialog = document.getElementById("languageDialog");
const closeLanguageButton = document.getElementById("closeLanguageButton");
const languageOptions = document.querySelectorAll("[data-language-option]");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const saveSettingsButton = document.getElementById("saveSettingsButton");
const saveFeedbackToast = document.getElementById("saveFeedbackToast");
const resetSettingsButton = document.getElementById("resetSettingsButton");
const confirmResetDialog = document.getElementById("confirmResetDialog");
const confirmResetButton = document.getElementById("confirmResetButton");
const formMessage = document.getElementById("formMessage");
const toast = document.getElementById("toast");
const assetStore = document.getElementById("assetStore");
const assetStoreToggle = document.getElementById("assetStoreToggle");
const assetGrid = document.getElementById("assetGrid");
const assetStoreMessage = document.getElementById("assetStoreMessage");
const restorePurchasesButton = document.getElementById("restorePurchasesButton");

const inputs = {
  focus: document.getElementById("focusInput"),
  short: document.getElementById("shortInput"),
  long: document.getElementById("longInput"),
  cycles: document.getElementById("cyclesInput"),
  language: document.getElementById("languageInput"),
  darkTheme: document.getElementById("darkThemeInput"),
  lightTheme: document.getElementById("lightThemeInput"),
  autoStart: document.getElementById("autoStartInput"),
  sound: document.getElementById("soundInput"),
  vibration: document.getElementById("vibrationInput"),
  showTodaySummary: document.getElementById("showTodaySummaryInput"),
};

let settings = loadSettings();
let stats = loadStats();
let mode = "focus";
let totalSeconds = settings.focus * 60;
let elapsedSeconds = 0;
let completedFocusSessions = 0;
let timerId = null;
let startedAt = 0;
let completionAudioContext = null;
let assetStoreState = createFallbackAssetStoreState();
let isAssetStoreExpanded = false;
let pendingNextMode = null;
let toastTimerId = null;
let saveFeedbackTimerId = null;
let isSavingSettings = false;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function syncViewportMetrics() {
  if (!appShell) {
    return;
  }

  const viewport = window.visualViewport;
  const width = Math.round(viewport?.width || window.innerWidth || document.documentElement.clientWidth || 430);
  const height = Math.round(viewport?.height || window.innerHeight || document.documentElement.clientHeight || 932);
  const isLandscape = width > height;

  const edgeGutter = clamp(width * (isLandscape ? 0.04 : 0.055), 16, isLandscape ? 42 : 48);
  const iconSize = clamp(width * 0.105, 44, 64);
  const playSize = clamp(height * (isLandscape ? 0.09 : 0.075), 56, isLandscape ? 78 : 86);
  const tomatoSize = isLandscape
    ? Math.min(width * 0.22, height * 0.28, 250)
    : Math.min(width * 0.68, height * 0.32, 360);
  const timerTop = clamp(height * (isLandscape ? 0.15 : 0.15), isLandscape ? 70 : 96, isLandscape ? 124 : 170);
  const tomatoBaseTop = clamp(height * (isLandscape ? 0.3 : 0.36), isLandscape ? 160 : 286, isLandscape ? 250 : 370);
  const tomatoTop = Math.max(tomatoBaseTop, timerTop + (isLandscape ? 224 : 188));
  const bottomOffset = clamp(height * (isLandscape ? 0.045 : 0.048), isLandscape ? 28 : 24, isLandscape ? 42 : 52);

  appShell.style.setProperty("--app-width", `${width}px`);
  appShell.style.setProperty("--app-height", `${height}px`);
  appShell.style.setProperty("--edge-gutter", `${edgeGutter}px`);
  appShell.style.setProperty("--icon-size", `${iconSize}px`);
  appShell.style.setProperty("--play-size", `${playSize}px`);
  appShell.style.setProperty("--tomato-size", `${tomatoSize}px`);
  appShell.style.setProperty("--timer-top", `${timerTop}px`);
  appShell.style.setProperty("--tomato-top", `${tomatoTop}px`);
  appShell.style.setProperty("--bottom-offset", `max(${bottomOffset}px, calc(env(safe-area-inset-bottom) + ${bottomOffset}px))`);
  drawTomatoProgress();
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return sanitizeSettings(saved);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function sanitizeSettings(value) {
  const source = value && typeof value === "object" ? value : {};

  return {
    focus: clampNumber(source.focus, SETTING_LIMITS.focus[0], SETTING_LIMITS.focus[1], DEFAULT_SETTINGS.focus),
    short: clampNumber(source.short, SETTING_LIMITS.short[0], SETTING_LIMITS.short[1], DEFAULT_SETTINGS.short),
    long: clampNumber(source.long, SETTING_LIMITS.long[0], SETTING_LIMITS.long[1], DEFAULT_SETTINGS.long),
    cycles: clampNumber(source.cycles, SETTING_LIMITS.cycles[0], SETTING_LIMITS.cycles[1], DEFAULT_SETTINGS.cycles),
    autoStart: typeof source.autoStart === "boolean" ? source.autoStart : DEFAULT_SETTINGS.autoStart,
    sound: typeof source.sound === "boolean" ? source.sound : DEFAULT_SETTINGS.sound,
    vibration: typeof source.vibration === "boolean" ? source.vibration : DEFAULT_SETTINGS.vibration,
    language: isSupportedLanguage(source.language) ? source.language : DEFAULT_SETTINGS.language,
    theme: isSupportedTheme(source.theme) ? source.theme : DEFAULT_SETTINGS.theme,
    showTodaySummary: typeof source.showTodaySummary === "boolean" ? source.showTodaySummary : DEFAULT_SETTINGS.showTodaySummary,
  };
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Some local file browser contexts block persistent storage.
  }
}

function isSupportedLanguage(language) {
  return typeof language === "string" && Object.prototype.hasOwnProperty.call(TRANSLATIONS, language);
}

function isSupportedTheme(theme) {
  return typeof theme === "string" && SUPPORTED_THEMES.has(theme);
}

function t(key) {
  const language = isSupportedLanguage(settings.language) ? settings.language : DEFAULT_SETTINGS.language;
  return TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || key;
}

function formatText(key, values = {}) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    t(key),
  );
}

function translateMessage(message) {
  if (!message) {
    return "";
  }

  return t(MESSAGE_KEYS[message] || message);
}

function modeLabelFor(nextMode) {
  return t(`${nextMode}Mode`);
}

function activeModeLabelFor(nextMode) {
  return t(`${nextMode}Active`);
}

function getCurrentSetNumber() {
  const cycleCount = Math.max(1, settings.cycles);
  return (completedFocusSessions % cycleCount) + 1;
}

function applyLanguage() {
  const language = isSupportedLanguage(settings.language) ? settings.language : DEFAULT_SETTINGS.language;
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.setAttribute("title", t(element.dataset.i18nTitle));
  });

  const longAfterHelp = document.querySelector("[data-i18n='longAfterHelp']");
  if (longAfterHelp) {
    longAfterHelp.textContent = formatText("longAfterHelp", { cycles: settings.cycles });
  }

  if (tomatoImage.alt === "Tomato" || tomatoImage.alt === "토마토") {
    tomatoImage.alt = t("tomatoAlt");
  }

  setAssetStoreExpanded(isAssetStoreExpanded);
  renderAssetStore();
  updateLanguageControl();
  updateUI();
  updateMenuButtonState();
}

function updateLanguageControl() {
  const language = isSupportedLanguage(settings.language) ? settings.language : DEFAULT_SETTINGS.language;
  if (inputs.language) {
    inputs.language.value = language;
  }

  if (languageSelectLabel) {
    languageSelectLabel.textContent = LANGUAGE_LABELS[language] || language;
  }

  languageOptions.forEach((option) => {
    const isSelected = option.dataset.languageOption === language;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-checked", isSelected.toString());
  });
}

function applyTheme() {
  const theme = isSupportedTheme(settings.theme) ? settings.theme : DEFAULT_SETTINGS.theme;
  document.documentElement.dataset.theme = theme;
  themeChoice?.classList.toggle("is-dark", theme === "dark");
  themeChoice?.classList.toggle("is-light", theme === "light");
  applyAssetTheme(assetStoreState.selectedProductId);
}

function todayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadStats() {
  try {
    const saved = JSON.parse(localStorage.getItem(STATS_KEY));
    if (saved?.date === todayKey() && Number.isSafeInteger(saved.count)) {
      return {
        date: saved.date,
        count: Math.min(999, Math.max(0, saved.count)),
      };
    }
  } catch {
    // Ignore malformed storage and start fresh.
  }

  return { date: todayKey(), count: 0 };
}

function saveStats() {
  stats.date = todayKey();
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Keep the in-memory count even when storage is unavailable.
  }
}

function createFallbackAssetStoreState(message = t("freeAssetsMessage")) {
  const selectedProductId = loadSelectedAssetId();
  return {
    assets: PREMIUM_ASSETS.map(([productId, name, previewPath]) => ({
      productId,
      name,
      previewPath,
      price: t("free"),
      owned: true,
      locked: false,
      selected: productId === selectedProductId,
      canBuy: false,
    })),
    selectedProductId,
    onlineForPurchases: true,
    offlineLockedMessage: "",
    message,
  };
}

function loadSelectedAssetId() {
  try {
    const saved = localStorage.getItem(ASSET_SELECTION_KEY);
    return PREMIUM_ASSETS.some(([productId]) => productId === saved) ? saved : "";
  } catch {
    return "";
  }
}

function saveSelectedAssetId(productId) {
  try {
    if (productId) {
      localStorage.setItem(ASSET_SELECTION_KEY, productId);
    } else {
      localStorage.removeItem(ASSET_SELECTION_KEY);
    }
  } catch {
    // Keep the in-memory selection if local storage is unavailable.
  }
}

function isNativeAssetStoreAvailable() {
  return Boolean(window.TomatoAndroidAssetStore?.getStoreState);
}

function hydrateAssetStoreFromNative() {
  if (!isNativeAssetStoreAvailable()) {
    applySelectedAssetFromWebState();
    renderAssetStore();
    return;
  }

  try {
    const nativeState = JSON.parse(window.TomatoAndroidAssetStore.getStoreState());
    applyAssetStoreState(nativeState);
  } catch {
    assetStoreState = createFallbackAssetStoreState();
  }

  applySelectedAssetFromNative();
  renderAssetStore();
}

function refreshAssetStoreFromNative() {
  hydrateAssetStoreFromNative();
  if (window.TomatoAndroidAssetStore?.refreshStore) {
    window.TomatoAndroidAssetStore.refreshStore();
  }
}

function applyAssetStoreState(nextState) {
  if (!nextState || !Array.isArray(nextState.assets)) {
    assetStoreState = createFallbackAssetStoreState();
    return;
  }

  const known = new Map(PREMIUM_ASSETS.map(([productId, name, previewPath]) => [productId, { name, previewPath }]));
  assetStoreState = {
    assets: nextState.assets
      .filter((asset) => known.has(asset.productId))
      .map((asset) => {
        const fallback = known.get(asset.productId);
        return {
          productId: asset.productId,
          name: typeof asset.name === "string" ? asset.name : fallback.name,
          previewPath: typeof asset.previewPath === "string" ? asset.previewPath : fallback.previewPath,
          price: t("free"),
          owned: true,
          locked: false,
          selected: asset.selected === true,
          canBuy: false,
        };
      }),
    selectedProductId: typeof nextState.selectedProductId === "string" ? nextState.selectedProductId : "",
    onlineForPurchases: true,
    offlineLockedMessage: "",
    message: translateMessage(typeof nextState.message === "string" ? nextState.message : ""),
  };
  saveSelectedAssetId(assetStoreState.selectedProductId);
}

function setDefaultTomatoImage() {
  tomatoImage.src = tomatoImage.dataset.defaultSrc || DEFAULT_TOMATO_SRC;
  tomatoImage.alt = t("tomatoAlt");
  applyAssetTheme("");
  drawTomatoProgress();
}

function applySelectedAssetFromNative() {
  if (!window.TomatoAndroidAssetStore?.getSelectedAssetDataUrl) {
    applySelectedAssetFromWebState();
    return;
  }

  try {
    const dataUrl = window.TomatoAndroidAssetStore.getSelectedAssetDataUrl();
    if (typeof dataUrl === "string" && dataUrl.startsWith("data:image/")) {
      tomatoImage.src = dataUrl;
      const selectedAsset = assetStoreState.assets.find((asset) => asset.productId === assetStoreState.selectedProductId);
      tomatoImage.alt = selectedAsset?.name || t("selectedAssetAlt");
      applyAssetTheme(assetStoreState.selectedProductId);
      drawTomatoProgress();
      return;
    }
  } catch {
    // Fall back to the free default image if the native entitlement cannot be read.
  }

  setDefaultTomatoImage();
}

function applySelectedAssetFromWebState() {
  const selectedAsset = assetStoreState.assets.find((asset) => asset.productId === assetStoreState.selectedProductId);
  if (!selectedAsset) {
    setDefaultTomatoImage();
    return;
  }

  tomatoImage.src = selectedAsset.previewPath;
  tomatoImage.alt = selectedAsset.name || t("selectedAssetAlt");
  applyAssetTheme(selectedAsset.productId);
  drawTomatoProgress();
}

function applyAssetTheme(productId) {
  const theme = ASSET_THEMES[productId] || ASSET_THEMES.default;
  const root = document.documentElement;
  root.dataset.assetTheme = productId || "default";
  root.style.setProperty("--tomato", theme.accent);
  root.style.setProperty("--tomato-dark", theme.accentDark);
  root.style.setProperty("--theme-accent-light", theme.accentLight);
  root.style.setProperty("--theme-accent-rgb", theme.accentRgb);
  root.style.setProperty("--leaf", root.dataset.theme === "dark" ? theme.successDark : theme.success);
}

function renderAssetStore() {
  if (!assetGrid || !assetStoreMessage) {
    return;
  }

  assetStoreMessage.textContent = translateMessage(assetStoreState.message) || t("freeAssetsMessage");
  if (restorePurchasesButton) {
    restorePurchasesButton.hidden = true;
  }
  assetGrid.replaceChildren(...assetStoreState.assets.map(createAssetCard));
}

function setAssetStoreExpanded(expanded) {
  isAssetStoreExpanded = expanded;
  assetStore?.classList.toggle("is-collapsed", !expanded);
  assetStoreToggle?.setAttribute("aria-expanded", expanded.toString());
  assetStoreToggle?.setAttribute("aria-label", expanded ? t("closeAssetStore") : t("openAssetStore"));
  assetStoreToggle?.setAttribute("title", t("assetStore"));
}

function createAssetCard(asset) {
  const card = document.createElement("article");
  card.className = "asset-card";
  card.classList.toggle("is-owned", asset.owned);
  card.classList.toggle("is-selected", asset.selected);

  const previewWrap = document.createElement("div");
  previewWrap.className = "asset-preview";

  const preview = document.createElement("img");
  preview.src = asset.previewPath;
  preview.alt = asset.name;
  preview.loading = "lazy";
  previewWrap.append(preview);

  const body = document.createElement("div");
  body.className = "asset-card-body";

  const title = document.createElement("h4");
  title.textContent = asset.name;

  const meta = document.createElement("p");
  meta.className = "asset-meta";
  meta.textContent = `${t("free")} · ${asset.selected ? t("using") : t("useThisAsset")}`;

  const action = document.createElement("button");
  action.type = "button";
  action.className = asset.selected ? "secondary-button asset-action" : "primary-button asset-action";
  action.dataset.productId = asset.productId;
  action.dataset.action = "use";
  action.textContent = asset.selected ? t("using") : t("useThisAsset");
  action.disabled = asset.selected;

  body.append(title, meta, action);
  card.append(previewWrap, body);
  return card;
}

function buyAsset(productId) {
  useAsset(productId);
}

function useAsset(productId) {
  if (!window.TomatoAndroidAssetStore?.selectAsset) {
    selectAssetInWebState(productId);
    return;
  }

  try {
    const selected = window.TomatoAndroidAssetStore.selectAsset(productId);
    if (selected) {
      hydrateAssetStoreFromNative();
    } else {
      selectAssetInWebState(productId);
    }
  } catch {
    selectAssetInWebState(productId);
  }
}

function selectAssetInWebState(productId) {
  if (!PREMIUM_ASSETS.some(([knownProductId]) => knownProductId === productId)) {
    return;
  }

  saveSelectedAssetId(productId);
  assetStoreState = {
    ...assetStoreState,
    selectedProductId: productId,
    assets: assetStoreState.assets.map((asset) => ({
      ...asset,
      owned: true,
      locked: false,
      selected: asset.productId === productId,
      canBuy: false,
    })),
  };
  applySelectedAssetFromWebState();
  renderAssetStore();
}

window.AssetStoreNative = {
  onNativeState(serializedState) {
    try {
      applyAssetStoreState(JSON.parse(serializedState));
      applySelectedAssetFromNative();
      renderAssetStore();
    } catch {
      assetStoreState = createFallbackAssetStoreState();
      setDefaultTomatoImage();
      renderAssetStore();
    }
  },
};

function getDurationSeconds(nextMode = mode) {
  const duration = settings[nextMode] * 60;
  return Number.isFinite(duration) && duration > 0 ? duration : DEFAULT_SETTINGS[nextMode] * 60;
}

function clampNumber(value, min, max, fallback) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, number));
}

function formatTime(total) {
  const wholeSeconds = Math.max(0, Math.round(total));
  const minutes = Math.floor(wholeSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.floor(wholeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatDateTime(total) {
  const wholeSeconds = Math.max(0, Math.round(total));
  const minutes = Math.floor(wholeSeconds / 60);
  const seconds = Math.floor(wholeSeconds % 60);
  return `PT${minutes}M${seconds}S`;
}

function drawTomatoProgress() {
  // The tomato is rendered by the image element. Keeping this as a no-op
  // preserves existing update calls without resizing a canvas during layout.
}

function getLiveElapsedSeconds() {
  return Math.min(totalSeconds, Math.max(0, (Date.now() - startedAt) / 1000));
}

function setMode(nextMode, shouldReset = true) {
  mode = nextMode;
  pendingNextMode = null;
  totalSeconds = getDurationSeconds(nextMode);
  if (shouldReset) {
    elapsedSeconds = 0;
  }
  updateUI();
}

function updateUI() {
  const isRunning = Boolean(timerId);
  const elapsedRatio = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0;
  const isPausedSession = !isRunning && elapsedSeconds > 0 && elapsedSeconds < totalSeconds;
  const isCompleteSession = !isRunning && elapsedSeconds >= totalSeconds && Boolean(pendingNextMode);
  const isActiveSession = isRunning || elapsedSeconds > 0;
  const displaySeconds = isActiveSession ? Math.ceil(Math.max(0, totalSeconds - elapsedSeconds)) : 0;

  timerDisplay.textContent = formatTime(displaySeconds);
  timerDisplay.setAttribute("datetime", formatDateTime(displaySeconds));
  modeLabel.textContent = activeModeLabelFor(mode);
  setLabel.textContent = formatText("setProgress", {
    current: getCurrentSetNumber().toString(),
    total: Math.max(1, settings.cycles).toString(),
  });
  todaySummary.textContent = formatText("todaySummary", { count: stats.count.toString() });
  todaySummary.hidden = !settings.showTodaySummary;
  const normalizedElapsedRatio = Math.max(0, Math.min(1, elapsedRatio));
  progressRing.style.setProperty("--elapsed", normalizedElapsedRatio.toFixed(5));
  progressRing.classList.toggle("is-progressing", normalizedElapsedRatio > 0.0001);
  drawTomatoProgress();
  appShell.classList.toggle("is-running", isRunning);
  playButton.setAttribute("aria-label", isRunning ? t("pauseTimer") : t("startTimer"));
  actionLabel.textContent = isRunning
    ? t("pause")
    : isCompleteSession
      ? t("startNextSession")
      : isPausedSession
        ? t("resume")
        : t("startInitial");
  document.title = `${formatTime(displaySeconds)} - Tomato Pomodoro`;
}

function startTimer() {
  if (timerId) {
    return;
  }

  if (pendingNextMode) {
    setMode(pendingNextMode);
  }

  primeCompletionAudio();
  playStartTone();
  startedAt = Date.now() - elapsedSeconds * 1000;
  timerId = window.setInterval(tick, 250);
  tick();
}

function pauseTimer() {
  if (!timerId) {
    return;
  }

  elapsedSeconds = getLiveElapsedSeconds();
  window.clearInterval(timerId);
  timerId = null;
  updateUI();
}

function resetTimer() {
  pauseTimer();
  pendingNextMode = null;
  totalSeconds = getDurationSeconds(mode);
  elapsedSeconds = 0;
  updateUI();
}

function tick() {
  elapsedSeconds = getLiveElapsedSeconds();
  updateUI();

  if (elapsedSeconds >= totalSeconds) {
    completeSession();
  }
}

function completeSession() {
  window.clearInterval(timerId);
  timerId = null;
  alertSessionComplete();

  if (mode === "focus") {
    stats.count += 1;
    completedFocusSessions += 1;
    saveStats();
  }

  const nextMode = getNextMode();
  if (!settings.autoStart) {
    pendingNextMode = nextMode;
    elapsedSeconds = totalSeconds;
    updateUI();
    return;
  }

  window.setTimeout(() => {
    setMode(nextMode);
    startTimer();
  }, 650);
}

function getNextMode() {
  if (mode !== "focus") {
    return "focus";
  }

  return completedFocusSessions > 0 && completedFocusSessions % settings.cycles === 0
    ? "long"
    : "short";
}

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return null;
  }

  if (!completionAudioContext) {
    completionAudioContext = new AudioContext();
  }

  return completionAudioContext;
}

function primeCompletionAudio() {
  if (!settings.sound) {
    return;
  }

  const audioContext = getAudioContext();
  if (audioContext?.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
}

function alertSessionComplete() {
  let handledByNative = false;

  if (window.TomatoAndroid?.notifySessionComplete) {
    try {
      window.TomatoAndroid.notifySessionComplete(settings.sound, settings.vibration);
      handledByNative = true;
    } catch {
      handledByNative = false;
    }
  }

  if (handledByNative) {
    return;
  }

  if (settings.vibration && navigator.vibrate) {
    navigator.vibrate([450, 120, 450]);
  }

  playCompletionTone();
}

function playCompletionTone() {
  if (!settings.sound) {
    return;
  }

  const audioContext = getAudioContext();
  if (!audioContext) {
    return;
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.12);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.28);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}

function playStartTone() {
  if (!settings.sound) {
    return;
  }

  const audioContext = getAudioContext();
  if (!audioContext) {
    return;
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.11, audioContext.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.14);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.16);
}

function syncSettingsForm() {
  inputs.focus.value = settings.focus;
  inputs.short.value = settings.short;
  inputs.long.value = settings.long;
  inputs.cycles.value = settings.cycles;
  inputs.language.value = settings.language;
  updateLanguageControl();
  inputs.darkTheme.checked = settings.theme === "dark";
  inputs.lightTheme.checked = settings.theme === "light";
  inputs.autoStart.checked = settings.autoStart;
  inputs.sound.checked = settings.sound;
  inputs.vibration.checked = settings.vibration;
  inputs.showTodaySummary.checked = settings.showTodaySummary;
  clearFormMessage();
}

function getSettingsFormValues() {
  return {
    focus: inputs.focus.value,
    short: inputs.short.value,
    long: inputs.long.value,
    cycles: inputs.cycles.value,
    language: inputs.language.value,
    theme: inputs.lightTheme.checked ? "light" : "dark",
    autoStart: inputs.autoStart.checked,
    sound: inputs.sound.checked,
    vibration: inputs.vibration.checked,
    showTodaySummary: inputs.showTodaySummary.checked,
  };
}

function validateSettingsForm() {
  const checks = [
    ["focus", "focusValidation"],
    ["short", "shortValidation"],
    ["long", "longValidation"],
    ["cycles", "cyclesValidation"],
  ];

  for (const [key, messageKey] of checks) {
    const value = Number.parseInt(inputs[key].value, 10);
    if (!Number.isInteger(value) || value < SETTING_LIMITS[key][0]) {
      return { input: inputs[key], message: t(messageKey) };
    }
  }

  return null;
}

function showFormMessage(message, type = "error") {
  formMessage.textContent = message;
  formMessage.classList.toggle("is-success", type === "success");
  formMessage.hidden = false;
}

function clearFormMessage() {
  formMessage.textContent = "";
  formMessage.classList.remove("is-success");
  formMessage.hidden = true;
}

function showToast(message) {
  window.clearTimeout(toastTimerId);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimerId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function checkIcon() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "m5 12 4 4 10-10");
  icon.append(path);
  return icon;
}

function setSaveButtonState(state) {
  saveSettingsButton.classList.toggle("is-saving", state === "saving");
  saveSettingsButton.classList.toggle("is-complete", state === "complete");
  saveSettingsButton.disabled = state === "saving" || state === "complete";

  if (state === "saving") {
    saveSettingsButton.textContent = t("saving");
    return;
  }

  if (state === "complete") {
    saveSettingsButton.replaceChildren(checkIcon(), document.createTextNode(t("saveComplete")));
    return;
  }

  saveSettingsButton.textContent = t("save");
}

function showSaveFeedback(message) {
  window.clearTimeout(saveFeedbackTimerId);
  saveFeedbackToast.replaceChildren(checkIcon(), document.createTextNode(message));
  saveFeedbackToast.classList.add("is-visible");

  saveFeedbackTimerId = window.setTimeout(() => {
    saveFeedbackToast.classList.remove("is-visible");
  }, 2000);
}

function applySettingsForm() {
  if (isSavingSettings) {
    return false;
  }

  const validation = validateSettingsForm();
  if (validation) {
    showFormMessage(validation.message);
    validation.input.focus();
    return false;
  }

  isSavingSettings = true;
  setSaveButtonState("saving");

  window.setTimeout(() => {
    settings = sanitizeSettings(getSettingsFormValues());

    saveSettings();
    applyTheme();
    applyLanguage();

    if (!timerId) {
      totalSeconds = getDurationSeconds(mode);
      elapsedSeconds = 0;
    }

    updateUI();
    clearFormMessage();
    setSaveButtonState("complete");
    showSaveFeedback(t("settingsSaved"));

    window.setTimeout(() => {
      isSavingSettings = false;
      setSaveButtonState("idle");
    }, 1200);
  }, 280);

  return true;
}

function resetSettingsToDefaults() {
  settings = { ...DEFAULT_SETTINGS };
  saveSettings();
  syncSettingsForm();
  applyTheme();
  applyLanguage();

  if (!timerId) {
    pendingNextMode = null;
    totalSeconds = getDurationSeconds(mode);
    elapsedSeconds = 0;
  }

  updateUI();
  showFormMessage(t("settingsReset"), "success");
  showToast(t("settingsReset"));
}

function updateMenuButtonState() {
  const isOpen = timerMenu?.classList.contains("is-open") || false;
  menuButton?.setAttribute("aria-expanded", isOpen.toString());
  menuButton?.setAttribute("aria-label", t(isOpen ? "closeMenu" : "openMenu"));
}

function setTimerMenuOpen(isOpen) {
  if (isOpen) {
    refreshAssetStoreFromNative();
    renderAssetStore();
  }

  timerMenu?.classList.toggle("is-open", isOpen);
  updateMenuButtonState();
}

function closeTimerMenu() {
  setTimerMenuOpen(false);
}

function openSettingsDialog() {
  syncSettingsForm();
  refreshAssetStoreFromNative();
  if (typeof settingsDialog.showModal === "function") {
    settingsDialog.showModal();
  } else {
    settingsDialog.setAttribute("open", "");
  }
}

playButton.addEventListener("click", () => {
  if (timerId) {
    pauseTimer();
  } else {
    startTimer();
  }
});

menuButton.addEventListener("click", () => {
  setTimerMenuOpen(!timerMenu.classList.contains("is-open"));
});

document.addEventListener("pointerdown", (event) => {
  if (timerMenu?.classList.contains("is-open") && !timerMenu.contains(event.target)) {
    closeTimerMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeTimerMenu();
  }
});

resetButton.addEventListener("click", () => {
  resetTimer();
  closeTimerMenu();
});

settingsButton.addEventListener("click", () => {
  closeTimerMenu();
  openSettingsDialog();
});

languageSelectButton.addEventListener("click", () => {
  updateLanguageControl();
  try {
    if (typeof languageDialog.showModal === "function") {
      languageDialog.showModal();
      return;
    }
  } catch {
    // Fall back to non-modal display if the host WebView disallows stacked modals.
  }

  if (typeof languageDialog.show === "function") {
    languageDialog.show();
  } else {
    languageDialog.setAttribute("open", "");
  }
});

languageDialog.addEventListener("click", (event) => {
  if (event.target === languageDialog) {
    if (typeof languageDialog.close === "function") {
      languageDialog.close();
    } else {
      languageDialog.removeAttribute("open");
    }
  }
});

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const language = option.dataset.languageOption;
    if (!isSupportedLanguage(language)) {
      return;
    }

    settings = sanitizeSettings({ ...settings, language });
    saveSettings();
    applyLanguage();

    if (typeof languageDialog.close === "function") {
      languageDialog.close();
    } else {
      languageDialog.removeAttribute("open");
    }
  });
});

closeSettingsButton.addEventListener("click", () => {
  if (typeof settingsDialog.close === "function") {
    settingsDialog.close();
  } else {
    settingsDialog.removeAttribute("open");
  }
});

settingsForm.addEventListener("submit", (event) => {
  if (event.submitter === saveSettingsButton) {
    event.preventDefault();
    applySettingsForm();
  }
});

resetSettingsButton.addEventListener("click", () => {
  if (typeof confirmResetDialog.showModal === "function") {
    confirmResetDialog.showModal();
  } else {
    confirmResetDialog.setAttribute("open", "");
  }
});

confirmResetButton.addEventListener("click", () => {
  resetSettingsToDefaults();
  if (typeof confirmResetDialog.close === "function") {
    confirmResetDialog.close();
  } else {
    confirmResetDialog.removeAttribute("open");
  }
});

inputs.language.addEventListener("change", () => {
  settings = sanitizeSettings({ ...settings, language: inputs.language.value });
  saveSettings();
  applyLanguage();
});

[inputs.darkTheme, inputs.lightTheme].forEach((input) => {
  input.addEventListener("change", () => {
    if (!input.checked) {
      return;
    }

    settings = sanitizeSettings({ ...settings, theme: input.value });
    saveSettings();
    applyTheme();
  });
});

inputs.showTodaySummary.addEventListener("change", () => {
  settings = sanitizeSettings({ ...settings, showTodaySummary: inputs.showTodaySummary.checked });
  saveSettings();
  updateUI();
});

restorePurchasesButton.addEventListener("click", () => {
  if (window.TomatoAndroidAssetStore?.restorePurchases) {
    window.TomatoAndroidAssetStore.restorePurchases();
  } else {
    assetStoreState.message = t("unableOffline");
    renderAssetStore();
  }
});

assetStoreToggle.addEventListener("click", () => {
  setAssetStoreExpanded(!isAssetStoreExpanded);
});

assetGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action][data-product-id]");
  if (!button) {
    return;
  }

  if (button.dataset.action === "buy") {
    buyAsset(button.dataset.productId);
    return;
  }

  useAsset(button.dataset.productId);
});

Object.values(inputs).forEach((input) => {
  if (input instanceof HTMLInputElement && input.type === "number") {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
      clearFormMessage();
    });
  }
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && timerId) {
    tick();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && document.activeElement === document.body) {
    event.preventDefault();
    playButton.click();
  }
});

window.addEventListener("resize", syncViewportMetrics);
window.visualViewport?.addEventListener("resize", syncViewportMetrics);
window.visualViewport?.addEventListener("scroll", syncViewportMetrics);

syncViewportMetrics();
applyTheme();
syncSettingsForm();
setAssetStoreExpanded(false);
hydrateAssetStoreFromNative();
applyLanguage();
