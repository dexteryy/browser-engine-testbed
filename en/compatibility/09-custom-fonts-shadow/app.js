// Font rendering and shadow comparison test
// Uses Web API only; no external libraries

const FONT_VAR_URL = "https://rsms.me/inter/font-files/Inter-roman.var.woff2";
const FONT_SERIF_URL = "https://rsms.me/inter/font-files/Inter-SemiBold.woff2";

const dom = {
  fontSelect: document.getElementById("fontSelect"),
  useSerif: document.getElementById("useSerif"),
  reloadFonts: document.getElementById("reloadFonts"),
  weight: document.getElementById("weight"),
  slant: document.getElementById("slant"),
  letter: document.getElementById("letter"),
  ligatures: document.getElementById("ligatures"),
  smallCaps: document.getElementById("smallCaps"),
  animateWeight: document.getElementById("animateWeight"),
  shadowOffset: document.getElementById("shadowOffset"),
  shadowBlur: document.getElementById("shadowBlur"),
  toggleShadow: document.getElementById("toggleShadow"),
  toggleDrop: document.getElementById("toggleDrop"),
  scrollMode: document.getElementById("scrollMode"),
  fontStatus: document.getElementById("fontStatus"),
  cacheStatus: document.getElementById("cacheStatus"),
  fpsBadge: document.getElementById("fpsBadge"),
  tickStatus: document.getElementById("tickStatus"),
  tickerBar: document.getElementById("tickerBar"),
  leftContent: document.getElementById("leftContent"),
  rightContent: document.getElementById("rightContent")
};

const samples = [
  {
    label: "headline",
    badge: "variable thickness/italics",
    lines: [
      { text: "clear sky streamer Typography 2024 - Custom font rasterization", size: "large" },
      { text: "Variable axis: Wght / Slnt - Slider adjustment takes effect in real time", size: "medium" }
    ]
  },
  {
    label: "Mixed text layout and ligatures",
    badge: "liga/clig",
    lines: [
      { text: "Fast brown fox jumps over lazy dog, sharp edges contrast shadows and filters.", size: "medium" },
      { text: "Office efficiently offers official affine ligatures ➜ ffi/ffl/fi/fj.", size: "medium" }
    ]
  },
  {
    label: "small caps / number",
    badge: "small-caps",
    lines: [
      { text: "Small Caps & number:0123456789,Anti-aliasing vs. hinting Contrast.", size: "small", smallcaps: true },
      { text: "Micro font size 12px:observe subpixel Anti-aliasing vs.stroke blending.", size: "mini" }
    ]
  },
  {
    label: "serif contrast (static WOFF2)",
    badge: "serif",
    lines: [
      { text: "Serif Title - Source Serif 4 control text-shadow/drop-shadow.", size: "medium", serif: true },
      { text: "Serif body text: detail sharpness, kerning, shadow blur and background blending.", size: "small", serif: true }
    ]
  },
  {
    label: "subpixel edgecontrol",
    badge: "edge",
    subpixel: true
  }
];

const state = {
  font: "InterVar",
  weight: 600,
  slant: 0,
  letter: 0,
  ligatures: true,
  smallCaps: false,
  animateWeight: false,
  shadowOffset: 4,
  shadowBlur: 8,
  enableShadow: true,
  enableDrop: true,
  scrollMode: "none",
  useSerifRight: false
};

let tickerRAF = 0;
let scrollRAF = 0;
let weightDirection = 1;
let fpsCounter = { frames: 0, last: performance.now(), value: 0 };

function renderSamples(container, applyDrop) {
  container.innerHTML = "";
  samples.forEach(sample => {
    const box = document.createElement("div");
    box.className = "sample";
    const label = document.createElement("div");
    label.className = "label";
    const left = document.createElement("span");
    left.textContent = sample.label;
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = sample.badge;
    label.appendChild(left);
    label.appendChild(badge);
    box.appendChild(label);

    if (sample.subpixel) {
      const sub = document.createElement("div");
      sub.className = "subpixel";
      ["RGB sub-pixelcontrol AAAA", "vertical strokes iiiiii / llll"].forEach(text => {
        const tile = document.createElement("div");
        tile.className = "tile";
        const t = document.createElement("div");
        t.className = "text small";
        t.textContent = text;
        tile.appendChild(t);
        sub.appendChild(tile);
      });
      box.appendChild(sub);
    } else {
      sample.lines.forEach(line => {
        const p = document.createElement("div");
        p.className = `text ${line.size || ""}`.trim();
        if (line.smallcaps) p.classList.add("smallcaps");
        if (line.serif) p.classList.add("serif");
        box.appendChild(p);
        p.textContent = line.text;
      });
    }
    container.appendChild(box);
  });

  container.querySelectorAll(".text").forEach(el => {
    el.classList.toggle("drop", applyDrop);
    el.classList.toggle("shadow", !applyDrop);
  });
}

function applyTypography(target) {
  const texts = target.querySelectorAll(".text");
  texts.forEach(el => {
    const isSerif = el.classList.contains("serif") || (state.useSerifRight && target === dom.rightContent);
    const fontFamily = isSerif ? 'var(--font-serif)' : 'var(--font-primary)';
    el.style.fontFamily = fontFamily;
    el.style.fontVariationSettings = `'wght' ${state.weight}, 'slnt' ${state.slant}`;
    el.style.fontWeight = state.weight;
    el.style.letterSpacing = `${state.letter}px`;
    const liga = state.ligatures ? '"liga" 1, "clig" 1' : '"liga" 0, "clig" 0';
    const smcp = state.smallCaps || el.classList.contains("smallcaps");
    el.style.fontFeatureSettings = smcp ? `${liga}, "smcp" 1` : liga;
    el.style.fontVariantCaps = smcp ? "small-caps" : "normal";
  });
}

function applyShadows() {
  document.documentElement.style.setProperty("--shadow-offset", `${state.shadowOffset}px`);
  document.documentElement.style.setProperty("--shadow-blur", `${state.shadowBlur}px`);
  dom.leftContent.querySelectorAll(".text").forEach(el => {
    el.classList.toggle("shadow", state.enableShadow);
  });
  dom.rightContent.querySelectorAll(".text").forEach(el => {
    el.classList.toggle("drop", state.enableDrop);
  });
}

function updateStatus(message) {
  dom.fontStatus.textContent = message;
}

function measureFonts(label) {
  const start = performance.now();
  const check = document.fonts.check('16px "InterVar"') && document.fonts.check('16px "SourceSerif4"');
  if (check) {
    const cost = Math.round(performance.now() - start);
    dom.cacheStatus.textContent = `${label}:hit (check about ${cost}ms)`;
    return;
  }
  document.fonts.ready.then(() => {
    const cost = Math.round(performance.now() - start);
    dom.cacheStatus.textContent = `${label}:Loading completed ${cost}ms`;
  });
}

async function reloadFonts() {
  const version = Date.now();
  updateStatus("Reloading...");
  const fontVar = new FontFace("InterReload", `url(${FONT_VAR_URL}?v=${version}) format("woff2-variations")`, {
    weight: "100 900",
    style: "normal",
    display: "swap"
  });
  const fontSerif = new FontFace("SourceSerifReload", `url(${FONT_SERIF_URL}?v=${version}) format("woff2")`, {
    weight: "400 700",
    style: "normal",
    display: "swap"
  });
  try {
    const [a, b] = await Promise.all([fontVar.load(), fontSerif.load()]);
    document.fonts.add(a);
    document.fonts.add(b);
    updateStatus("Font re-Loading completed(Reload family available)");
    measureFonts("Reload");
  } catch (err) {
    updateStatus("Reload failed");
    console.error(err);
  }
}

function animateTicker() {
  const speed = 80; // px per second
  const width = 1200;
  let start = performance.now();
  function step(now) {
    const dt = (now - start) / 1000;
    const pos = (dt * speed) % width;
    dom.tickerBar.style.transform = `translateX(${pos}px)`;
    tickerRAF = requestAnimationFrame(step);
  }
  tickerRAF = requestAnimationFrame(step);
}

function startScroll() {
  cancelAnimationFrame(scrollRAF);
  if (state.scrollMode === "none") return;
  const maxScroll = Math.max(dom.leftContent.scrollHeight, dom.rightContent.scrollHeight) - dom.leftContent.clientHeight;
  let dir = 1;
  let last = performance.now();
  function loop(now) {
    const dt = now - last;
    last = now;
    const delta = dt * 0.04; // scroll speed factor
    const update = (panel) => {
      panel.scrollTop += delta * dir;
      if (panel.scrollTop <= 0) dir = 1;
      if (panel.scrollTop >= maxScroll) dir = -1;
    };
    update(dom.leftContent);
    update(dom.rightContent);
    fpsCounter.frames += 1;
    const elapsed = now - fpsCounter.last;
    if (elapsed >= 500) {
      fpsCounter.value = Math.round((fpsCounter.frames * 1000) / elapsed);
      fpsCounter.frames = 0;
      fpsCounter.last = now;
      dom.fpsBadge.textContent = `scroll FPS:${fpsCounter.value}`;
    }
    scrollRAF = requestAnimationFrame(loop);
  }
  scrollRAF = requestAnimationFrame(loop);
}

function maybeAnimateWeight() {
  if (!state.animateWeight) return;
  const min = 200;
  const max = 900;
  state.weight += weightDirection * 4;
  if (state.weight >= max) { state.weight = max; weightDirection = -1; }
  if (state.weight <= min) { state.weight = min; weightDirection = 1; }
  dom.weight.value = state.weight;
  document.documentElement.style.setProperty("--var-wght", state.weight);
  applyTypography(dom.leftContent);
  applyTypography(dom.rightContent);
  requestAnimationFrame(maybeAnimateWeight);
}

function attachEvents() {
  dom.fontSelect.addEventListener("change", () => {
    state.font = dom.fontSelect.value;
    document.documentElement.style.setProperty("--font-primary", state.font === "InterVar"
      ? '"InterVar", "InterReload", "Inter", system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
      : '"SourceSerif4", "SourceSerifReload", "Source Serif", "Times New Roman", serif');
    applyTypography(dom.leftContent);
    applyTypography(dom.rightContent);
  });
  dom.useSerif.addEventListener("change", () => {
    state.useSerifRight = dom.useSerif.checked;
    applyTypography(dom.rightContent);
  });
  dom.weight.addEventListener("input", () => {
    state.weight = Number(dom.weight.value);
    document.documentElement.style.setProperty("--var-wght", state.weight);
    applyTypography(dom.leftContent);
    applyTypography(dom.rightContent);
  });
  dom.slant.addEventListener("input", () => {
    state.slant = Number(dom.slant.value);
    document.documentElement.style.setProperty("--var-slnt", state.slant);
    applyTypography(dom.leftContent);
    applyTypography(dom.rightContent);
  });
  dom.letter.addEventListener("input", () => {
    state.letter = Number(dom.letter.value);
    document.documentElement.style.setProperty("--letter-spacing", `${state.letter}px`);
    applyTypography(dom.leftContent);
    applyTypography(dom.rightContent);
  });
  dom.ligatures.addEventListener("change", () => {
    state.ligatures = dom.ligatures.checked;
    applyTypography(dom.leftContent);
    applyTypography(dom.rightContent);
  });
  dom.smallCaps.addEventListener("change", () => {
    state.smallCaps = dom.smallCaps.checked;
    applyTypography(dom.leftContent);
    applyTypography(dom.rightContent);
  });
  dom.animateWeight.addEventListener("change", () => {
    state.animateWeight = dom.animateWeight.checked;
    if (state.animateWeight) maybeAnimateWeight();
  });
  dom.shadowOffset.addEventListener("input", () => {
    state.shadowOffset = Number(dom.shadowOffset.value);
    applyShadows();
  });
  dom.shadowBlur.addEventListener("input", () => {
    state.shadowBlur = Number(dom.shadowBlur.value);
    applyShadows();
  });
  dom.toggleShadow.addEventListener("change", () => {
    state.enableShadow = dom.toggleShadow.checked;
    applyShadows();
  });
  dom.toggleDrop.addEventListener("change", () => {
    state.enableDrop = dom.toggleDrop.checked;
    applyShadows();
  });
  dom.scrollMode.addEventListener("change", () => {
    state.scrollMode = dom.scrollMode.value;
    startScroll();
  });
  dom.reloadFonts.addEventListener("click", reloadFonts);
}

function boot() {
  renderSamples(dom.leftContent, false);
  renderSamples(dom.rightContent, true);
  applyTypography(dom.leftContent);
  applyTypography(dom.rightContent);
  applyShadows();
  attachEvents();
  document.fonts.ready.then(() => {
    updateStatus("Font has been loaded (Inter Var + Source Serif 4)");
    measureFonts("initial");
  });
  animateTicker();
  startScroll();
}

boot();
