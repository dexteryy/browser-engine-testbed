// DRM / overlay video test
// Uses minimal EME setup with a public Widevine demo; falls back to clear stream when unavailable.

const dom = {
  drmSelect: document.getElementById("drmSelect"),
  clearSelect: document.getElementById("clearSelect"),
  loadBtn: document.getElementById("loadBtn"),
  playAll: document.getElementById("playAll"),
  pauseAll: document.getElementById("pauseAll"),
  toggleMute: document.getElementById("toggleMute"),
  rate: document.getElementById("rate"),
  fsProtected: document.getElementById("fsProtected"),
  fsClear: document.getElementById("fsClear"),
  pipProtected: document.getElementById("pipProtected"),
  pipClear: document.getElementById("pipClear"),
  pipBtnProtected: document.getElementById("pipBtnProtected"),
  pipBtnClear: document.getElementById("pipBtnClear"),
  emeStatus: document.getElementById("emeStatus"),
  overlayStatus: document.getElementById("overlayStatus"),
  playbackStatus: document.getElementById("playbackStatus"),
  pipStatus: document.getElementById("pipStatus"),
  videoProtected: document.getElementById("videoProtected"),
  videoClear: document.getElementById("videoClear")
};

const streams = {
  widevineMp4: {
    url: "https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/v-0576p-1400k-libx264.mp4",
    type: 'video/mp4;codecs="avc1.42c01e"',
    keySystem: "com.widevine.alpha",
    license: "https://cwip-shaka-proxy.appspot.com/no_auth",
    label: "Widevine demo (576p mp4)"
  },
  hlsFallback: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "video/mp4",
    keySystem: null,
    license: null,
    label: "Fallback MP4 (非 DRM)"
  },
  bbb: {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "video/mp4",
    label: "Big Buck Bunny 720p"
  },
  tos: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    type: "video/mp4",
    label: "Tears of Steel 1080p"
  }
};

let emeSession = null;
let muted = false;
let protectedFallbackUsed = false;

function updateStatuses() {
  const pip = document.pictureInPictureElement;
  dom.pipStatus.textContent = pip ? `PiP：${pip.id || "进行中"}` : "PiP：无";
  const playing = !dom.videoProtected.paused || !dom.videoClear.paused;
  dom.playbackStatus.textContent = playing ? "播放：进行中" : "播放：暂停";
}

function setBadge(el, text, ok = true) {
  el.textContent = text;
  el.style.color = ok ? "#065f46" : "#b91c1c";
}

async function initEME(video, config) {
  if (!config.keySystem) {
    setBadge(dom.emeStatus, "EME：使用非 DRM 流（降级）", false);
    return false;
  }
  if (!navigator.requestMediaKeySystemAccess) {
    setBadge(dom.emeStatus, "EME：不支持", false);
    return false;
  }
  try {
    const access = await navigator.requestMediaKeySystemAccess(config.keySystem, [{
      initDataTypes: ["cenc"],
      videoCapabilities: [{ contentType: config.type || 'video/mp4;codecs="avc1.42c01e"', robustness: "" }]
    }]);
    const keys = await access.createMediaKeys();
    await video.setMediaKeys(keys);
    setBadge(dom.emeStatus, `EME：${config.keySystem} 可用`, true);
    video.addEventListener("encrypted", (e) => handleEncrypted(e, config.license, keys), { once: true });
    return true;
  } catch (err) {
    console.warn("EME init failed", err);
    setBadge(dom.emeStatus, "EME：初始化失败，降级非 DRM", false);
    return false;
  }
}

async function handleEncrypted(event, licenseUrl, mediaKeys) {
  const session = mediaKeys.createSession();
  emeSession = session;
  session.addEventListener("message", async (msgEvent) => {
    try {
      if (!licenseUrl) {
        switchProtectedToFallback("缺少 License URL");
        return;
      }
      const license = await requestLicense(licenseUrl, msgEvent.message);
      await session.update(license);
      setBadge(dom.emeStatus, "EME：License OK", true);
    } catch (err) {
      console.error("License update failed", err);
      switchProtectedToFallback("License 失败");
    }
  });
  try {
    await session.generateRequest(event.initDataType, event.initData);
  } catch (err) {
    console.error("generateRequest failed", err);
    switchProtectedToFallback("EME 请求失败");
  }
}

async function requestLicense(url, message) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: message
  });
  if (!res.ok) throw new Error(`License HTTP ${res.status}`);
  return await res.arrayBuffer();
}

function loadStream(video, info) {
  video.pause();
  video.removeAttribute("src");
  if (video.canPlayType && info.type && video.canPlayType(info.type) === "") {
    console.warn("Likely unsupported type", info.type);
  }
  video.src = info.url;
  video.load();
}

function switchProtectedToFallback(reason) {
  if (protectedFallbackUsed) return;
  protectedFallbackUsed = true;
  loadStream(dom.videoProtected, streams.hlsFallback);
  dom.videoProtected.dataset.mode = "fallback";
  setBadge(dom.emeStatus, `EME：${reason}，已降级非 DRM`, false);
}

async function setupProtected() {
  const chosen = streams[dom.drmSelect.value];
  protectedFallbackUsed = false;
  const ok = await initEME(dom.videoProtected, chosen);
  if (!ok && chosen.keySystem) {
    // Fallback to non-DRM stream when EME unavailable
    loadStream(dom.videoProtected, streams.hlsFallback);
    dom.videoProtected.dataset.mode = "fallback";
  } else {
    loadStream(dom.videoProtected, chosen);
    dom.videoProtected.dataset.mode = chosen.keySystem ? "drm" : "fallback";
  }
}

function setupClear() {
  const chosen = streams[dom.clearSelect.value];
  loadStream(dom.videoClear, chosen);
}

function attachPlaybackControls() {
  dom.playAll.addEventListener("click", () => {
    dom.videoProtected.play().catch(() => {});
    dom.videoClear.play().catch(() => {});
  });
  dom.pauseAll.addEventListener("click", () => {
    dom.videoProtected.pause();
    dom.videoClear.pause();
  });
  dom.toggleMute.addEventListener("click", () => {
    muted = !muted;
    dom.videoProtected.muted = muted;
    dom.videoClear.muted = muted;
  });
  dom.rate.addEventListener("input", () => {
    const r = Number(dom.rate.value);
    dom.videoProtected.playbackRate = r;
    dom.videoClear.playbackRate = r;
  });
  dom.videoProtected.addEventListener("play", updateStatuses);
  dom.videoProtected.addEventListener("pause", updateStatuses);
  dom.videoClear.addEventListener("play", updateStatuses);
  dom.videoClear.addEventListener("pause", updateStatuses);
}

function attachFullScreen() {
  dom.fsProtected.addEventListener("click", () => toggleFullscreen(dom.videoProtected));
  dom.fsClear.addEventListener("click", () => toggleFullscreen(dom.videoClear));
}

async function toggleFullscreen(el) {
  if (!document.fullscreenElement) {
    await el.requestFullscreen().catch(() => {});
  } else {
    await document.exitFullscreen().catch(() => {});
  }
}

function attachPiP() {
  const enter = async (video) => {
    if (!document.pictureInPictureEnabled) return;
    if (document.pictureInPictureElement === video) {
      await document.exitPictureInPicture().catch(() => {});
      return;
    }
    await video.requestPictureInPicture().catch(() => {});
  };
  dom.pipProtected.addEventListener("click", () => enter(dom.videoProtected));
  dom.pipClear.addEventListener("click", () => enter(dom.videoClear));
  dom.pipBtnProtected.addEventListener("click", () => enter(dom.videoProtected));
  dom.pipBtnClear.addEventListener("click", () => enter(dom.videoClear));
  document.addEventListener("enterpictureinpicture", () => {
    dom.pipStatus.textContent = `PiP：${document.pictureInPictureElement?.id || "进行中"}`;
  });
  document.addEventListener("leavepictureinpicture", () => {
    dom.pipStatus.textContent = "PiP：--";
  });
}

function attachOverlayProbe() {
  const probe = () => {
    const protectedReady = dom.videoProtected.readyState >= 2;
    const clearReady = dom.videoClear.readyState >= 2;
    const txt = `A: ${protectedReady ? "可播放" : "未就绪"} ｜ B: ${clearReady ? "可播放" : "未就绪"}`;
    dom.overlayStatus.textContent = `Overlay：${txt}（使用 DevTools → Media / Layers 检查实际 overlay）`;
  };
  ["loadeddata", "loadedmetadata", "canplay", "playing"].forEach(evt => {
    dom.videoProtected.addEventListener(evt, probe);
    dom.videoClear.addEventListener(evt, probe);
  });
}

function attachProtectedErrorFallback() {
  dom.videoProtected.addEventListener("error", () => {
    if (dom.videoProtected.dataset.mode === "drm") {
      switchProtectedToFallback("播放错误");
    }
  });
}

function attachLoadButton() {
  dom.loadBtn.addEventListener("click", async () => {
    await setupProtected();
    setupClear();
    updateStatuses();
  });
}

function boot() {
  attachLoadButton();
  attachPlaybackControls();
  attachFullScreen();
  attachPiP();
  attachOverlayProbe();
  attachProtectedErrorFallback();
  setupClear();
  setupProtected();
  updateStatuses();
}

boot();
