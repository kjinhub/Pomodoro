const STORAGE_KEY = "tomato-pomodoro-settings";
const STATS_KEY = "tomato-pomodoro-stats";
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

const DEFAULT_SETTINGS = {
  focus: 25,
  short: 5,
  long: 15,
  cycles: 4,
  autoStart: false,
  sound: true,
  vibration: true,
};

const MODE_LABELS = {
  focus: "Focus",
  short: "Short Break",
  long: "Long Break",
};

const SETTING_LIMITS = {
  focus: [1, 120],
  short: [1, 60],
  long: [1, 90],
  cycles: [2, 12],
};

const appShell = document.querySelector(".app-shell");
const timerDisplay = document.getElementById("timerDisplay");
const modeLabel = document.getElementById("modeLabel");
const progressRing = document.getElementById("progressRing");
const tomatoImage = document.getElementById("tomatoImage");
const playButton = document.getElementById("playButton");
const actionLabel = document.getElementById("actionLabel");
const resetButton = document.getElementById("resetButton");
const settingsButton = document.getElementById("settingsButton");
const settingsDialog = document.getElementById("settingsDialog");
const settingsForm = document.querySelector(".settings-panel");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const saveSettingsButton = document.getElementById("saveSettingsButton");
const clearStatsButton = document.getElementById("clearStatsButton");
const todayCount = document.getElementById("todayCount");
const modeTabs = Array.from(document.querySelectorAll(".mode-tab"));
const assetGrid = document.getElementById("assetGrid");
const assetStoreMessage = document.getElementById("assetStoreMessage");
const restorePurchasesButton = document.getElementById("restorePurchasesButton");

const inputs = {
  focus: document.getElementById("focusInput"),
  short: document.getElementById("shortInput"),
  long: document.getElementById("longInput"),
  cycles: document.getElementById("cyclesInput"),
  autoStart: document.getElementById("autoStartInput"),
  sound: document.getElementById("soundInput"),
  vibration: document.getElementById("vibrationInput"),
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
  };
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Some local file browser contexts block persistent storage.
  }
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

function createFallbackAssetStoreState(message = "Connect to the internet to purchase or restore assets.") {
  return {
    assets: PREMIUM_ASSETS.map(([productId, name, previewPath]) => ({
      productId,
      name,
      previewPath,
      price: "₩1,000",
      owned: false,
      locked: true,
      selected: false,
      canBuy: false,
    })),
    selectedProductId: "",
    onlineForPurchases: false,
    offlineLockedMessage: "Connect to the internet to purchase or restore assets.",
    message,
  };
}

function isNativeAssetStoreAvailable() {
  return Boolean(window.TomatoAndroidAssetStore?.getStoreState);
}

function hydrateAssetStoreFromNative() {
  if (!isNativeAssetStoreAvailable()) {
    setDefaultTomatoImage();
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
          price: typeof asset.price === "string" && asset.price ? asset.price : "₩1,000",
          owned: asset.owned === true,
          locked: asset.owned !== true,
          selected: asset.selected === true,
          canBuy: asset.canBuy === true,
        };
      }),
    selectedProductId: typeof nextState.selectedProductId === "string" ? nextState.selectedProductId : "",
    onlineForPurchases: nextState.onlineForPurchases === true,
    offlineLockedMessage: "Connect to the internet to purchase or restore assets.",
    message: typeof nextState.message === "string" ? nextState.message : "",
  };
}

function setDefaultTomatoImage() {
  tomatoImage.src = tomatoImage.dataset.defaultSrc || DEFAULT_TOMATO_SRC;
  tomatoImage.alt = "Tomato";
}

function applySelectedAssetFromNative() {
  if (!window.TomatoAndroidAssetStore?.getSelectedAssetDataUrl) {
    setDefaultTomatoImage();
    return;
  }

  try {
    const dataUrl = window.TomatoAndroidAssetStore.getSelectedAssetDataUrl();
    if (typeof dataUrl === "string" && dataUrl.startsWith("data:image/")) {
      tomatoImage.src = dataUrl;
      const selectedAsset = assetStoreState.assets.find((asset) => asset.productId === assetStoreState.selectedProductId);
      tomatoImage.alt = selectedAsset?.name || "Selected premium asset";
      return;
    }
  } catch {
    // Fall back to the free default image if the native entitlement cannot be read.
  }

  setDefaultTomatoImage();
}

function renderAssetStore() {
  if (!assetGrid || !assetStoreMessage) {
    return;
  }

  const lockedAssets = assetStoreState.assets.some((asset) => !asset.owned);
  const fallbackMessage = !assetStoreState.onlineForPurchases && lockedAssets
    ? assetStoreState.offlineLockedMessage
    : "";
  assetStoreMessage.textContent = assetStoreState.message || fallbackMessage;
  assetGrid.replaceChildren(...assetStoreState.assets.map(createAssetCard));
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
  meta.textContent = `${asset.price} · ${asset.owned ? "Owned" : "Locked"}`;

  const action = document.createElement("button");
  action.type = "button";
  action.className = asset.owned ? "secondary-button asset-action" : "primary-button asset-action";
  action.dataset.productId = asset.productId;
  action.dataset.action = asset.owned ? "use" : "buy";
  action.textContent = asset.owned ? (asset.selected ? "Using" : "Use this asset") : "Buy for ₩1,000";
  action.disabled = asset.owned ? asset.selected : !asset.canBuy;

  body.append(title, meta, action);
  card.append(previewWrap, body);
  return card;
}

function buyAsset(productId) {
  if (!window.TomatoAndroidAssetStore?.buy) {
    assetStoreState.message = "Unable to purchase while offline.";
    renderAssetStore();
    return;
  }

  const asset = assetStoreState.assets.find((item) => item.productId === productId);
  if (!asset?.canBuy) {
    assetStoreState.message = "Unable to purchase while offline.";
    renderAssetStore();
    return;
  }

  window.TomatoAndroidAssetStore.buy(productId);
}

function useAsset(productId) {
  if (!window.TomatoAndroidAssetStore?.selectAsset) {
    return;
  }

  try {
    const selected = window.TomatoAndroidAssetStore.selectAsset(productId);
    if (selected) {
      hydrateAssetStoreFromNative();
    }
  } catch {
    setDefaultTomatoImage();
  }
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
  return `${minutes} : ${seconds}`;
}

function formatDateTime(total) {
  const wholeSeconds = Math.max(0, Math.round(total));
  const minutes = Math.floor(wholeSeconds / 60);
  const seconds = Math.floor(wholeSeconds % 60);
  return `PT${minutes}M${seconds}S`;
}

function getLiveElapsedSeconds() {
  return Math.min(totalSeconds, Math.max(0, (Date.now() - startedAt) / 1000));
}

function setMode(nextMode, shouldReset = true) {
  mode = nextMode;
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
  const isActiveSession = isRunning || elapsedSeconds > 0;
  const displaySeconds = isActiveSession ? Math.ceil(Math.max(0, totalSeconds - elapsedSeconds)) : 0;

  timerDisplay.textContent = formatTime(displaySeconds);
  timerDisplay.setAttribute("datetime", formatDateTime(displaySeconds));
  modeLabel.textContent = MODE_LABELS[mode];
  progressRing.style.setProperty("--elapsed", Math.max(0, Math.min(1, elapsedRatio)).toFixed(5));
  appShell.classList.toggle("is-running", isRunning);
  playButton.setAttribute("aria-label", isRunning ? "Pause timer" : "Start timer");
  actionLabel.textContent = isRunning ? "Pause" : isPausedSession ? "Resume" : "Start";
  todayCount.textContent = stats.count.toString();
  document.title = `${formatTime(displaySeconds)} - Tomato Pomodoro`;

  modeTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.mode === mode);
  });
}

function startTimer() {
  if (timerId) {
    return;
  }

  primeCompletionAudio();
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
  updateUI();
  alertSessionComplete();

  if (mode === "focus") {
    stats.count += 1;
    completedFocusSessions += 1;
    saveStats();
  }

  const nextMode = getNextMode();
  window.setTimeout(() => {
    setMode(nextMode);
    if (settings.autoStart) {
      startTimer();
    }
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

function syncSettingsForm() {
  inputs.focus.value = settings.focus;
  inputs.short.value = settings.short;
  inputs.long.value = settings.long;
  inputs.cycles.value = settings.cycles;
  inputs.autoStart.checked = settings.autoStart;
  inputs.sound.checked = settings.sound;
  inputs.vibration.checked = settings.vibration;
  todayCount.textContent = stats.count.toString();
}

function applySettingsForm() {
  settings = sanitizeSettings({
    focus: inputs.focus.value,
    short: inputs.short.value,
    long: inputs.long.value,
    cycles: inputs.cycles.value,
    autoStart: inputs.autoStart.checked,
    sound: inputs.sound.checked,
    vibration: inputs.vibration.checked,
  });

  saveSettings();

  if (!timerId) {
    totalSeconds = getDurationSeconds(mode);
    elapsedSeconds = 0;
  }

  updateUI();
}

playButton.addEventListener("click", () => {
  if (timerId) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetButton.addEventListener("click", resetTimer);

settingsButton.addEventListener("click", () => {
  syncSettingsForm();
  refreshAssetStoreFromNative();
  if (typeof settingsDialog.showModal === "function") {
    settingsDialog.showModal();
  } else {
    settingsDialog.setAttribute("open", "");
  }
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
    applySettingsForm();
  }
});

clearStatsButton.addEventListener("click", () => {
  stats = { date: todayKey(), count: 0 };
  completedFocusSessions = 0;
  saveStats();
  updateUI();
});

restorePurchasesButton.addEventListener("click", () => {
  if (window.TomatoAndroidAssetStore?.restorePurchases) {
    window.TomatoAndroidAssetStore.restorePurchases();
  } else {
    assetStoreState.message = "Unable to purchase while offline.";
    renderAssetStore();
  }
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

modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    pauseTimer();
    setMode(tab.dataset.mode);
  });
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

syncSettingsForm();
hydrateAssetStoreFromNative();
updateUI();
