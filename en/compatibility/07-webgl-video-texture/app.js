// WebGL video texture sampling test
// Focus: LINEAR/NEAREST, UNPACK_FLIP_Y_WEBGL, scaling (1:1 / down / up), rAF vs rVFC sync

const dom = {
  sourceSelect: document.getElementById("sourceSelect"),
  fileInput: document.getElementById("fileInput"),
  loadBtn: document.getElementById("loadBtn"),
  playToggle: document.getElementById("playToggle"),
  flipY: document.getElementById("flipY"),
  useSRGB: document.getElementById("useSRGB"),
  frameDriver: document.getElementById("frameDriver"),
  dprMode: document.getElementById("dprMode"),
  videoInfo: document.getElementById("videoInfo"),
  canvasInfo: document.getElementById("canvasInfo"),
  fpsBadge: document.getElementById("fpsBadge"),
  srgbInfo: document.getElementById("srgbInfo"),
  leftLabel: document.getElementById("leftLabel"),
  rightLabel: document.getElementById("rightLabel"),
  fpsLeft: document.getElementById("fpsLeft"),
  fpsRight: document.getElementById("fpsRight")
};

const sources = {
  bunny720: {
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "video/mp4",
    label: "Big Buck Bunny 720p",
    fps: 30
  },
  tos1080: {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    type: "video/mp4",
    label: "Tears of Steel 1080p",
    fps: 24
  },
  sintel4k: {
    src: "https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4",
    type: "video/mp4",
    label: "Sintel 720p(Can be used for upsampling observations)",
    fps: 24
  }
};

const video = document.createElement("video");
video.crossOrigin = "anonymous";
video.muted = true;
video.loop = true;
video.playsInline = true;
video.preload = "auto";

const state = {
  scale: 1,
  flipY: true,
  dprMode: "1",
  frameDriver: "rvfc",
  leftFilter: "linear",
  rightFilter: "nearest",
  useSRGB: false
};

let fileURL = null;
let rafId = 0;
let rvfcId = 0;
let playing = false;
let useFileSource = false;
let fpsCounter = { frames: 0, last: performance.now(), value: 0 };
let ctxLeft = null;
let ctxRight = null;

function assertWebGL(canvasId) {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext("webgl", { alpha: false });
  if (!gl) {
    throw new Error("WebGL not available");
  }
  const program = createProgram(gl, VERT_SRC, FRAG_SRC);
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, "position");
  const uvLoc = gl.getAttribLocation(program, "uv");
  gl.enableVertexAttribArray(posLoc);
  gl.enableVertexAttribArray(uvLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const gammaLoc = gl.getUniformLocation(program, "gammaEncode");
  const extSRGB = gl.getExtension("EXT_sRGB");
  return { canvas, gl, program, tex, gammaLoc, extSRGB };
}

const QUAD = new Float32Array([
  // position xy, uv
  -1, -1, 0, 0,
  1, -1, 1, 0,
  -1, 1, 0, 1,
  1, 1, 1, 1
]);

const VERT_SRC = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Gamma toggle is a lightweight approximation for sRGB vs non-sRGB output.
const FRAG_SRC = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D tex;
uniform float gammaEncode;
void main() {
  vec4 c = texture2D(tex, vUV);
  if (gammaEncode > 0.0) {
    c.rgb = pow(c.rgb, vec3(1.0 / gammaEncode));
  }
  gl_FragColor = c;
}
`;

function createShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log || "unknown error"}`);
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${log || "unknown error"}`);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

function setFilter(ctx, mode) {
  const { gl, tex } = ctx;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  const filter = mode === "nearest" ? gl.NEAREST : gl.LINEAR;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
}

function resizeCanvases() {
  if (!video.videoWidth || !video.videoHeight) return;
  const dpr = state.dprMode === "device" ? window.devicePixelRatio || 1 : 1;
  const targetW = Math.max(1, Math.round(video.videoWidth * state.scale));
  const targetH = Math.max(1, Math.round(video.videoHeight * state.scale));
  [ctxLeft, ctxRight].forEach(ctx => {
    if (!ctx) return;
    ctx.canvas.width = Math.round(targetW * dpr);
    ctx.canvas.height = Math.round(targetH * dpr);
    ctx.canvas.style.width = `${targetW}px`;
    ctx.canvas.style.height = `${targetH}px`;
    ctx.gl.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
  });
  dom.canvasInfo.textContent = `canvas:${targetW}×${targetH} @${dpr} DPR`;
}

function updateVideoInfo() {
  const fpsHint = useFileSource ? "local source" : `${sources[dom.sourceSelect.value]?.fps || "--"}fps`;
  const info = video.videoWidth
    ? `video:${video.videoWidth}×${video.videoHeight} ｜ ~${fpsHint}`
    : "video:-- × --";
  dom.videoInfo.textContent = info;
}

function updateLabels() {
  dom.leftLabel.textContent = state.leftFilter.toUpperCase();
  dom.rightLabel.textContent = state.rightFilter.toUpperCase();
}

function updateSRGBStatus() {
  const supported = (ctxLeft && ctxLeft.extSRGB) || (ctxRight && ctxRight.extSRGB);
  if (supported) {
    dom.srgbInfo.textContent = state.useSRGB ? "sRGB:Already turned on (gamma 2.2)" : "sRGB:Available";
  } else {
    dom.srgbInfo.textContent = "sRGB:Not supported EXT_sRGB";
  }
}

function drawContext(ctx, filter) {
  const { gl, tex, gammaLoc } = ctx;
  if (!video.videoWidth || !video.videoHeight) return;
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, state.flipY);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
  setFilter(ctx, filter);
  const gamma = state.useSRGB ? 2.2 : 0.0;
  gl.uniform1f(gammaLoc, gamma);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function renderFrame() {
  drawContext(ctxLeft, state.leftFilter);
  drawContext(ctxRight, state.rightFilter);
  fpsCounter.frames += 1;
  const now = performance.now();
  if (now - fpsCounter.last > 500) {
    fpsCounter.value = Math.round((fpsCounter.frames * 1000) / (now - fpsCounter.last));
    fpsCounter.frames = 0;
    fpsCounter.last = now;
    dom.fpsBadge.textContent = `FPS:${fpsCounter.value}`;
    dom.fpsLeft.textContent = `${fpsCounter.value} fps`;
    dom.fpsRight.textContent = `${fpsCounter.value} fps`;
  }
}

function startRenderLoop() {
  stopRenderLoop();
  playing = true;
  if (state.frameDriver === "rvfc" && "requestVideoFrameCallback" in HTMLVideoElement.prototype) {
    const loop = () => {
      if (!playing) return;
      renderFrame();
      rvfcId = video.requestVideoFrameCallback(loop);
    };
    rvfcId = video.requestVideoFrameCallback(loop);
  } else {
    const rafLoop = () => {
      if (!playing) return;
      renderFrame();
      rafId = requestAnimationFrame(rafLoop);
    };
    rafId = requestAnimationFrame(rafLoop);
  }
}

function stopRenderLoop() {
  playing = false;
  if (rafId) cancelAnimationFrame(rafId);
  if (rvfcId && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(rvfcId);
  rafId = 0;
  rvfcId = 0;
}

function loadSelectedSource() {
  const key = dom.sourceSelect.value;
  const src = sources[key];
  if (!src && !fileURL) return;
  stopRenderLoop();
  if (useFileSource && fileURL) {
    video.src = fileURL;
    video.removeAttribute("type");
  } else {
    useFileSource = false;
    video.src = src.src;
    if (src.type) {
      video.type = src.type;
    } else {
      video.removeAttribute("type");
    }
  }
  video.play().then(() => startRenderLoop()).catch(() => {
    dom.playToggle.disabled = false;
  });
}

function handleFileInput(file) {
  if (!file) return;
  if (fileURL) URL.revokeObjectURL(fileURL);
  fileURL = URL.createObjectURL(file);
  dom.sourceSelect.value = "bunny720";
  useFileSource = true;
  loadSelectedSource();
}

function attachEvents() {
  dom.sourceSelect.addEventListener("change", () => {
    useFileSource = false;
  });
  dom.loadBtn.addEventListener("click", () => {
    loadSelectedSource();
  });
  dom.playToggle.addEventListener("click", () => {
    if (video.paused) {
      video.play().then(() => startRenderLoop()).catch(() => {});
    } else {
      video.pause();
      stopRenderLoop();
    }
  });
  dom.fileInput.addEventListener("change", e => {
    const file = e.target.files?.[0];
    handleFileInput(file);
  });
  document.querySelectorAll('input[name="scale"]').forEach(r => {
    r.addEventListener("change", e => {
      state.scale = parseFloat(e.target.value);
      resizeCanvases();
    });
  });
  document.querySelectorAll('input[name="leftFilter"]').forEach(r => {
    r.addEventListener("change", e => {
      state.leftFilter = e.target.value;
      updateLabels();
    });
  });
  document.querySelectorAll('input[name="rightFilter"]').forEach(r => {
    r.addEventListener("change", e => {
      state.rightFilter = e.target.value;
      updateLabels();
    });
  });
  dom.flipY.addEventListener("change", e => {
    state.flipY = e.target.checked;
  });
  dom.useSRGB.addEventListener("change", e => {
    state.useSRGB = e.target.checked;
    updateSRGBStatus();
  });
  dom.frameDriver.addEventListener("change", e => {
    state.frameDriver = e.target.value;
    if (!video.paused) startRenderLoop();
  });
  dom.dprMode.addEventListener("change", e => {
    state.dprMode = e.target.value;
    resizeCanvases();
  });
  document.addEventListener("keydown", e => {
    if (e.code === "Space") {
      e.preventDefault();
      dom.playToggle.click();
    } else if (e.key === "n" || e.key === "N") {
      state.leftFilter = state.leftFilter === "nearest" ? "linear" : "nearest";
      document.querySelector(`input[name="leftFilter"][value="${state.leftFilter}"]`).checked = true;
      updateLabels();
    } else if (e.key === "m" || e.key === "M") {
      state.rightFilter = state.rightFilter === "nearest" ? "linear" : "nearest";
      document.querySelector(`input[name="rightFilter"][value="${state.rightFilter}"]`).checked = true;
      updateLabels();
    } else if (e.key === "f" || e.key === "F") {
      state.flipY = !state.flipY;
      dom.flipY.checked = state.flipY;
    }
  });
  video.addEventListener("loadedmetadata", () => {
    updateVideoInfo();
    resizeCanvases();
  });
  video.addEventListener("loadeddata", () => {
    renderFrame();
  });
  video.addEventListener("play", () => {
    dom.playToggle.textContent = "pause";
    startRenderLoop();
  });
  video.addEventListener("pause", () => {
    dom.playToggle.textContent = "play";
    stopRenderLoop();
  });
}

function boot() {
  try {
    ctxLeft = assertWebGL("canvasLeft");
    ctxRight = assertWebGL("canvasRight");
  } catch (err) {
    alert(err.message);
    throw err;
  }
  updateLabels();
  attachEvents();
  updateSRGBStatus();
  dom.videoInfo.textContent = "video:loading...";
  loadSelectedSource();
}

boot();
