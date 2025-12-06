// WebXR immersive stability test (no external libs)

const dom = {
  enterXR: document.getElementById("enterXR"),
  exitXR: document.getElementById("exitXR"),
  spaceSelect: document.getElementById("spaceSelect"),
  resolution: document.getElementById("resolution"),
  useSRGB: document.getElementById("useSRGB"),
  mirrorToggle: document.getElementById("mirrorToggle"),
  spinToggle: document.getElementById("spinToggle"),
  supportBadge: document.getElementById("supportBadge"),
  sessionBadge: document.getElementById("sessionBadge"),
  sceneBadge: document.getElementById("sceneBadge"),
  fpsBadge: document.getElementById("fpsBadge"),
  fpsDisplay: document.getElementById("fpsDisplay"),
  log: document.getElementById("log"),
  canvas: document.getElementById("glCanvas")
};

const video = document.createElement("video");
video.src = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
video.crossOrigin = "anonymous";
video.loop = true;
video.muted = true;
video.playsInline = true;
video.preload = "auto";

const state = {
  xrSupported: false,
  xrSession: null,
  xrRefSpace: null,
  gl: null,
  scene: "geometry",
  resolutionScale: 1,
  useSRGB: true,
  mirror: true,
  spin: true,
  lastTime: 0,
  fps: { frames: 0, last: performance.now(), value: 0 }
};

let programs = {};
let buffers = {};
let extSRGB = null;

function log(msg) {
  const time = new Date().toLocaleTimeString();
  const line = document.createElement("div");
  line.textContent = `[${time}] ${msg}`;
  dom.log.prepend(line);
}

function setBadge(el, text, ok = true) {
  el.textContent = text;
  el.style.color = ok ? "#065f46" : "#b91c1c";
}

async function detectXR() {
  if (navigator.xr && navigator.xr.isSessionSupported) {
    const supported = await navigator.xr.isSessionSupported("immersive-vr");
    state.xrSupported = supported;
    setBadge(dom.supportBadge, supported ? "XR Support: available" : "XR Support: Not available", supported);
  } else {
    state.xrSupported = false;
    setBadge(dom.supportBadge, "XR Support: Not supported WebXR", false);
  }
}

function createGL() {
  const gl = dom.canvas.getContext("webgl2", { alpha: false, antialias: true });
  if (!gl) throw new Error("WebGL2 not available");
  state.gl = gl;
  extSRGB = gl.getExtension("EXT_sRGB");
  resizeCanvas();
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  programs.color = createProgram(gl, VS_COLOR, FS_COLOR);
  programs.video = createProgram(gl, VS_VIDEO, FS_VIDEO);
  buffers.cube = createCube(gl);
  buffers.floor = createFloor(gl);
  buffers.sphere = createSphere(gl, 48, 64);
  buffers.videoTex = createVideoTexture(gl);
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = dom.canvas.clientWidth * dpr;
  const h = dom.canvas.clientHeight * dpr;
  if (dom.canvas.width !== w || dom.canvas.height !== h) {
    dom.canvas.width = w;
    dom.canvas.height = h;
  }
}

function createShader(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(info || "Shader compile failed");
  }
  return sh;
}

function createProgram(gl, vs, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, createShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, createShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(info || "Program link failed");
  }
  return p;
}

function createCube(gl) {
  // Position + normal per vertex (interleaved)
  const positions = new Float32Array([
    // Front
    -1, -1, 1, 0, 0, 1,
     1, -1, 1, 0, 0, 1,
     1,  1, 1, 0, 0, 1,
    -1,  1, 1, 0, 0, 1,
    // Back
    -1, -1, -1, 0, 0, -1,
    -1,  1, -1, 0, 0, -1,
     1,  1, -1, 0, 0, -1,
     1, -1, -1, 0, 0, -1,
    // Top
    -1, 1, -1, 0, 1, 0,
    -1, 1,  1, 0, 1, 0,
     1, 1,  1, 0, 1, 0,
     1, 1, -1, 0, 1, 0,
    // Bottom
    -1, -1, -1, 0, -1, 0,
     1, -1, -1, 0, -1, 0,
     1, -1,  1, 0, -1, 0,
    -1, -1,  1, 0, -1, 0,
    // Right
     1, -1, -1, 1, 0, 0,
     1,  1, -1, 1, 0, 0,
     1,  1,  1, 1, 0, 0,
     1, -1,  1, 1, 0, 0,
    // Left
    -1, -1, -1, -1, 0, 0,
    -1, -1,  1, -1, 0, 0,
    -1,  1,  1, -1, 0, 0,
    -1,  1, -1, -1, 0, 0
  ]);
  const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23
  ]);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const ebo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
  gl.bindVertexArray(null);
  return { vao, count: indices.length };
}

function createFloor(gl) {
  // Simple quad covering XZ plane at y=0 with normals up
  const positions = new Float32Array([
    -8, 0, -8, 0, 1, 0, -8, 0, 8, 0, 1, 0,
     8, 0, 8, 0, 1, 0,  8, 0, -8, 0, 1, 0
  ]);
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const ebo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
  gl.bindVertexArray(null);
  return { vao, count: indices.length };
}

function createSphere(gl, latBands, lonBands) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  for (let lat = 0; lat <= latBands; lat++) {
    const theta = lat * Math.PI / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    for (let lon = 0; lon <= lonBands; lon++) {
      const phi = lon * 2 * Math.PI / lonBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;
      positions.push(-x); // inverted to look inward
      positions.push(y);
      positions.push(-z);
      normals.push(-x, y, -z);
      uvs.push(lon / lonBands, 1 - lat / latBands);
    }
  }
  for (let lat = 0; lat < latBands; lat++) {
    for (let lon = 0; lon < lonBands; lon++) {
      const first = lat * (lonBands + 1) + lon;
      const second = first + lonBands + 1;
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vbo = gl.createBuffer();
  const stride = 32;
  const interleaved = new Float32Array((positions.length / 3) * 8);
  for (let i = 0; i < positions.length / 3; i++) {
    interleaved[i * 8 + 0] = positions[i * 3];
    interleaved[i * 8 + 1] = positions[i * 3 + 1];
    interleaved[i * 8 + 2] = positions[i * 3 + 2];
    interleaved[i * 8 + 3] = normals[i * 3];
    interleaved[i * 8 + 4] = normals[i * 3 + 1];
    interleaved[i * 8 + 5] = normals[i * 3 + 2];
    interleaved[i * 8 + 6] = uvs[i * 2];
    interleaved[i * 8 + 7] = uvs[i * 2 + 1];
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.STATIC_DRAW);
  const ebo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 12);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 24);
  gl.bindVertexArray(null);
  return { vao, count: indices.length };
}

function createVideoTexture(gl) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const pixel = new Uint8Array([0, 0, 0, 255]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  return tex;
}

function updateVideoTexture(gl) {
  if (video.readyState >= 2) {
    gl.bindTexture(gl.TEXTURE_2D, buffers.videoTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
  }
}

// Matrices
function mat4Identity() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}
function mat4Multiply(out, a, b) {
  const o = out;
  for (let i = 0; i < 4; i++) {
    const ai0 = a[i]; const ai1 = a[i + 4]; const ai2 = a[i + 8]; const ai3 = a[i + 12];
    o[i]      = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
    o[i + 4]  = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
    o[i + 8]  = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
    o[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }
  return o;
}
function mat4Perspective(out, fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
  out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
  out[8] = 0; out[9] = 0; out[10] = (far + near) / (near - far); out[11] = -1;
  out[12] = 0; out[13] = 0; out[14] = (2 * far * near) / (near - far); out[15] = 0;
  return out;
}
function mat4LookAt(out, eye, center, up) {
  const x0 = eye[0], x1 = eye[1], x2 = eye[2];
  let zx = x0 - center[0], zy = x1 - center[1], zz = x2 - center[2];
  let len = Math.hypot(zx, zy, zz);
  if (len === 0) { zz = 1; len = 1; }
  zx /= len; zy /= len; zz /= len;
  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz);
  if (len === 0) { xx = 0; xy = 0; xz = 0; }
  xx /= len; xy /= len; xz /= len;
  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;
  out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0;
  out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0;
  out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
  out[12] = -(xx * x0 + xy * x1 + xz * x2);
  out[13] = -(yx * x0 + yy * x1 + yz * x2);
  out[14] = -(zx * x0 + zy * x1 + zz * x2);
  out[15] = 1;
  return out;
}
function mat4Translate(out, a, v) {
  const x = v[0], y = v[1], z = v[2];
  out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
  out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
  out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
  out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  return out;
}
function mat4RotateY(out, a, rad) {
  const s = Math.sin(rad), c = Math.cos(rad);
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  out[0] = a00 * c + a20 * s;
  out[1] = a01 * c + a21 * s;
  out[2] = a02 * c + a22 * s;
  out[3] = a03 * c + a23 * s;
  out[8] = a20 * c - a00 * s;
  out[9] = a21 * c - a01 * s;
  out[10] = a22 * c - a02 * s;
  out[11] = a23 * c - a03 * s;
  out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
  out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
  return out;
}

function drawScene(gl, projection, view, timeSeconds) {
  gl.clearColor(0.05, 0.08, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Floor grid
  gl.useProgram(programs.color);
  gl.bindVertexArray(buffers.floor.vao);
  setUniformMat4(gl, programs.color, "uProj", projection);
  setUniformMat4(gl, programs.color, "uView", view);
  const floorModel = mat4Identity();
  setUniformMat4(gl, programs.color, "uModel", floorModel);
  gl.uniform3f(gl.getUniformLocation(programs.color, "uColor"), 0.25, 0.82, 0.75);
  gl.uniform1i(gl.getUniformLocation(programs.color, "uUseGrid"), 1);
  gl.drawElements(gl.TRIANGLES, buffers.floor.count, gl.UNSIGNED_SHORT, 0);

  // Cube
  gl.bindVertexArray(buffers.cube.vao);
  const cubeModel = mat4Identity();
  if (state.spin) mat4RotateY(cubeModel, cubeModel, timeSeconds);
  mat4Translate(cubeModel, cubeModel, [0, 1.5, 0]);
  setUniformMat4(gl, programs.color, "uModel", cubeModel);
  gl.uniform3f(gl.getUniformLocation(programs.color, "uColor"), 0.9, 0.55, 0.1);
  gl.uniform1i(gl.getUniformLocation(programs.color, "uUseGrid"), 0);
  gl.drawElements(gl.TRIANGLES, buffers.cube.count, gl.UNSIGNED_SHORT, 0);

  // Video dome
  if (state.scene === "video") {
    gl.disable(gl.CULL_FACE);
    gl.useProgram(programs.video);
    gl.bindVertexArray(buffers.sphere.vao);
    setUniformMat4(gl, programs.video, "uProj", projection);
    setUniformMat4(gl, programs.video, "uView", view);
    const model = mat4Identity();
    setUniformMat4(gl, programs.video, "uModel", model);
    updateVideoTexture(gl);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, buffers.videoTex);
    gl.uniform1i(gl.getUniformLocation(programs.video, "uTex"), 0);
    gl.drawElements(gl.TRIANGLES, buffers.sphere.count, gl.UNSIGNED_SHORT, 0);
    gl.enable(gl.CULL_FACE);
  }
  gl.bindVertexArray(null);
}

function setUniformMat4(gl, prog, name, mat) {
  const loc = gl.getUniformLocation(prog, name);
  gl.uniformMatrix4fv(loc, false, mat);
}

// Rendering loops
function startInlineLoop() {
  const loop = (t) => {
    if (state.xrSession) return; // XR loop handles rendering
    resizeCanvas();
    const gl = state.gl;
    if (extSRGB && state.useSRGB) gl.enable(gl.FRAMEBUFFER_SRGB); else gl.disable(gl.FRAMEBUFFER_SRGB);
    const aspect = gl.canvas.width / gl.canvas.height;
    const proj = mat4Perspective(new Float32Array(16), Math.PI / 3, aspect, 0.1, 100);
    const view = mat4LookAt(new Float32Array(16), [0, 1.6, 3], [0, 1.4, 0], [0, 1, 0]);
    drawScene(gl, proj, view, t * 0.001);
    updateFPS();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function updateFPS() {
  const now = performance.now();
  state.fps.frames += 1;
  if (now - state.fps.last > 500) {
    state.fps.value = Math.round((state.fps.frames * 1000) / (now - state.fps.last));
    state.fps.frames = 0;
    state.fps.last = now;
    dom.fpsBadge.textContent = `FPS:${state.fps.value}`;
    dom.fpsDisplay.textContent = `${state.fps.value} fps`;
  }
}

async function enterXR() {
  if (!state.xrSupported) {
    log("XR Unavailable, unable to enter");
    return;
  }
  try {
    await state.gl.makeXRCompatible();
    const session = await navigator.xr.requestSession("immersive-vr", {
      requiredFeatures: [dom.spaceSelect.value],
      optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking", "dom-overlay"],
      domOverlay: { root: document.body }
    });
    state.xrSession = session;
    session.addEventListener("end", onSessionEnded);
    const layer = new XRWebGLLayer(session, state.gl, { framebufferScaleFactor: state.resolutionScale });
    session.updateRenderState({ baseLayer: layer });
    state.xrRefSpace = await session.requestReferenceSpace(dom.spaceSelect.value);
    session.requestAnimationFrame(onXRFrame);
    setBadge(dom.sessionBadge, "Session:XR in progress", true);
    log("Already entered XR session");
  } catch (err) {
    log("Enter XR fail:" + err.message);
    setBadge(dom.sessionBadge, "Session:fail/Not started", false);
  }
}

function onSessionEnded() {
  state.xrSession = null;
  state.xrRefSpace = null;
  setBadge(dom.sessionBadge, "Session:ended", false);
  startInlineLoop();
  log("XR sessionFinish");
}

function onXRFrame(time, frame) {
  const session = frame.session;
  const pose = frame.getViewerPose(state.xrRefSpace);
  const gl = state.gl;
  const layer = session.renderState.baseLayer;
  gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
  if (extSRGB && state.useSRGB) {
    gl.enable(gl.FRAMEBUFFER_SRGB);
  } else {
    gl.disable(gl.FRAMEBUFFER_SRGB);
  }
  if (pose) {
    for (const view of pose.views) {
      const viewport = layer.getViewport(view);
      gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
      drawScene(gl, view.projectionMatrix, view.transform.inverse.matrix, time * 0.001);
    }
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  // Mirror to 2D canvas (single view)
  if (state.mirror) {
    resizeCanvas();
    const aspect = gl.canvas.width / gl.canvas.height;
    const proj = mat4Perspective(new Float32Array(16), Math.PI / 3, aspect, 0.1, 100);
    const view = mat4LookAt(new Float32Array(16), [0, 1.6, 3], [0, 1.4, 0], [0, 1, 0]);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    drawScene(gl, proj, view, time * 0.001);
  }
  updateFPS();
  session.requestAnimationFrame(onXRFrame);
}

function attachUI() {
  dom.enterXR.addEventListener("click", () => {
    video.play().catch(() => {});
    enterXR();
  });
  dom.exitXR.addEventListener("click", () => {
    if (state.xrSession) state.xrSession.end();
  });
  dom.spaceSelect.addEventListener("change", () => {
    if (state.xrSession) {
      state.xrSession.requestReferenceSpace(dom.spaceSelect.value).then(ref => {
        state.xrRefSpace = ref;
        log("Reference space switching:" + dom.spaceSelect.value);
      });
    }
  });
  dom.resolution.addEventListener("change", () => {
    state.resolutionScale = Number(dom.resolution.value);
    if (state.xrSession) {
      state.xrSession.updateRenderState({
        baseLayer: new XRWebGLLayer(state.xrSession, state.gl, { framebufferScaleFactor: state.resolutionScale })
      });
      log("XR framebuffer scale Adjust to " + state.resolutionScale);
    }
  });
  dom.useSRGB.addEventListener("change", () => {
    state.useSRGB = dom.useSRGB.checked;
  });
  dom.mirrorToggle.addEventListener("change", () => {
    state.mirror = dom.mirrorToggle.checked;
  });
  dom.spinToggle.addEventListener("change", () => {
    state.spin = dom.spinToggle.checked;
  });
  document.querySelectorAll('input[name="scene"]').forEach(r => {
    r.addEventListener("change", (e) => {
      state.scene = e.target.value;
      dom.sceneBadge.textContent = `Scenario:${state.scene === "geometry" ? "geometry" : "video dome"}`;
      log("switchScenario:" + state.scene);
      if (state.scene === "video") video.play().catch(() => {});
    });
  });
}

// Shaders
const VS_COLOR = `#version 300 es
layout(location=0) in vec3 position;
layout(location=1) in vec3 normal;
uniform mat4 uProj;
uniform mat4 uView;
uniform mat4 uModel;
out vec3 vNormal;
out vec3 vWorld;
void main() {
  vec4 worldPos = uModel * vec4(position, 1.0);
  vWorld = worldPos.xyz;
  vNormal = mat3(uModel) * normal;
  gl_Position = uProj * uView * worldPos;
}`;

const FS_COLOR = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vWorld;
uniform vec3 uColor;
uniform int uUseGrid;
out vec4 outColor;
void main() {
  vec3 n = normalize(vNormal);
  vec3 light = normalize(vec3(0.5, 1.0, 0.3));
  float diff = max(dot(n, light), 0.15);
  vec3 base = uColor * diff;
  if (uUseGrid == 1) {
    float line = step(0.98, abs(fract(vWorld.x) * 2.0 - 1.0)) + step(0.98, abs(fract(vWorld.z) * 2.0 - 1.0));
    float g = mix(0.08, 0.35, line);
    base = mix(vec3(0.05, 0.15, 0.18), vec3(0.1, 0.5, 0.6), g);
  }
  outColor = vec4(base, 1.0);
}`;

const VS_VIDEO = `#version 300 es
layout(location=0) in vec3 position;
layout(location=1) in vec3 normal;
layout(location=2) in vec2 uv;
uniform mat4 uProj;
uniform mat4 uView;
uniform mat4 uModel;
out vec2 vUV;
void main() {
  vec4 worldPos = uModel * vec4(position, 1.0);
  vUV = uv;
  gl_Position = uProj * uView * worldPos;
}`;

const FS_VIDEO = `#version 300 es
precision mediump float;
in vec2 vUV;
uniform sampler2D uTex;
out vec4 outColor;
void main() {
  outColor = texture(uTex, vUV);
}`;

async function boot() {
  await detectXR();
  createGL();
  attachUI();
  startInlineLoop();
  video.play().catch(() => {});
}

boot();
