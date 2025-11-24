// Complex script & emoji rendering test
// No external libraries; all controls are DOM-based

const dom = {
  fadeMin: document.getElementById("fadeMin"),
  duration: document.getElementById("duration"),
  animArabic: document.getElementById("animArabic"),
  animSEA: document.getElementById("animSEA"),
  animEmoji: document.getElementById("animEmoji"),
  bidiMarks: document.getElementById("bidiMarks"),
  giantEmoji: document.getElementById("giantEmoji"),
  ligatures: document.getElementById("ligatures"),
  altFont: document.getElementById("altFont"),
  scrollMode: document.getElementById("scrollMode"),
  checkerBg: document.getElementById("checkerBg"),
  resetBtn: document.getElementById("resetBtn"),
  fpsBadge: document.getElementById("fpsBadge"),
  animStatus: document.getElementById("animStatus"),
  bidiStatus: document.getElementById("bidiStatus"),
  arabicContent: document.getElementById("arabicContent"),
  seaContent: document.getElementById("seaContent"),
  emojiContent: document.getElementById("emojiContent")
};

const arabicLines = [
  { label: "连写+数字", text: "الويب 2024: اختبارات مُحرّك المتصفح 12345 مع علامات ترقيم، سرعة وسلاسة.", bidiClass: "rtl" },
  { label: "Bidi 混排", text: "RTL + LTR 混排：ابتكار WebGL و Canvas في 2024، رقم ٣٫١٤ و (Hello!)", bidiClass: "bidi-mix" },
  { label: "段落", text: "مقارنة النص العربي مع الأرقام اللاتينية، وملاحظة اتجاه الفواصل والرموز: ؟ ! ، ؛", bidiClass: "rtl" }
];

const seaLines = [
  { label: "泰语", text: "ภาษาไทยทดสอบการผสมสระและวรรณยุกต์ เช่น เก็่ง กี่ ไก่ พร้อมตัวเลข ๒๕๖๗", className: "" },
  { label: "越南语", text: "Tiếng Việt thử nghiệm dấu thanh: ắ ằ ẵ ẳ ặ, ệ ễ ể, cùng ký tự “đ” và số 123.", className: "" },
  { label: "梵文/附标", text: "संस्कृत संयोजन चिह्न परीक्षणः देवनागरी के संयुक्ताक्षर एवं मात्रा चिह्न", className: "" }
];

const emojiSets = [
  { label: "家庭 ZWJ", char: "👨‍👩‍👧‍👦", note: "family" },
  { label: "多肤色握手", char: "🧑🏾‍🤝‍🧑🏻", note: "handshake" },
  { label: "护士", char: "🧑‍⚕️", note: "health" },
  { label: "女宇航员", char: "👩🏽‍🚀", note: "astronaut" },
  { label: "男警官", char: "👮🏻‍♂️", note: "police" },
  { label: "情侣", char: "👩‍❤️‍💋‍👩", note: "kiss" },
  { label: "行走", char: "🚶🏿‍♂️", note: "walk" },
  { label: "跑步", char: "🏃‍♀️", note: "run" },
  { label: "🏳️‍🌈", char: "🏳️‍🌈", note: "flag" },
  { label: "笑哭", char: "😂", note: "face" },
  { label: "戴口罩", char: "😷", note: "mask" },
  { label: "火箭", char: "🚀", note: "rocket" }
];

const state = {
  fadeMin: 0.9,
  duration: 3,
  animArabic: true,
  animSEA: true,
  animEmoji: true,
  bidiMarks: true,
  giantEmoji: false,
  ligatures: true,
  altFont: false,
  scrollMode: "auto",
  checker: true
};

let scrollRAF = 0;
let fpsCounter = { frames: 0, last: performance.now(), value: 0 };

function createSample(label, badgeText, lines, column, isEmoji) {
  const wrap = document.createElement("div");
  wrap.className = "sample";
  const labelRow = document.createElement("div");
  labelRow.className = "label";
  const l = document.createElement("span");
  l.textContent = label;
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = badgeText;
  labelRow.appendChild(l);
  labelRow.appendChild(badge);
  wrap.appendChild(labelRow);

  if (isEmoji) {
    const grid = document.createElement("div");
    grid.className = "emoji-grid";
    emojiSets.forEach(item => {
      const tile = document.createElement("div");
      tile.className = "emoji-tile";
      const ch = document.createElement("span");
      ch.className = "emoji-char";
      ch.textContent = item.char;
      const note = document.createElement("div");
      note.className = "emoji-label";
      note.textContent = item.note;
      tile.appendChild(ch);
      tile.appendChild(note);
      grid.appendChild(tile);
    });
    wrap.appendChild(grid);
  } else {
    lines.forEach(line => {
      const p = document.createElement("div");
      p.className = `text-line ${line.className || ""}`.trim();
      if (line.bidiClass) p.classList.add(line.bidiClass);
      p.textContent = line.text;
      wrap.appendChild(p);
    });
  }
  column.appendChild(wrap);
}

function createGiantEmoji(column) {
  const sample = document.createElement("div");
  sample.className = "sample";
  const label = document.createElement("div");
  label.className = "label";
  label.innerHTML = '<span>巨型 Emoji</span><span class="badge">256px</span>';
  const big = document.createElement("div");
  big.className = "giant";
  big.textContent = "🧑🏾\u200d🚀"; // astronaut with skin tone
  sample.appendChild(label);
  sample.appendChild(big);
  column.appendChild(sample);
}

function renderColumns() {
  dom.arabicContent.innerHTML = "";
  dom.seaContent.innerHTML = "";
  dom.emojiContent.innerHTML = "";

  createSample("阿拉伯段落", "RTL/Bidi", arabicLines, dom.arabicContent, false);
  createSample("东南亚组合附标", "Combining", seaLines, dom.seaContent, false);
  createSample("Emoji ZWJ 序列", "Emoji", [], dom.emojiContent, true);
  if (state.giantEmoji) {
    createGiantEmoji(dom.emojiContent);
  }

  applyAnimations();
  applyFeatures();
  applyBackground();
}

function applyAnimations() {
  document.documentElement.style.setProperty("--fade-min", state.fadeMin);
  document.documentElement.style.setProperty("--anim-duration", `${state.duration}s`);
  const toggle = (container, enabled) => {
    container.querySelectorAll(".sample").forEach(el => {
      el.classList.toggle("pulse", enabled);
      // Desync animation start to avoid lock-step blinking
      if (enabled) {
        el.style.animationDelay = `${Math.random() * 1.5}s`;
      } else {
        el.style.animationDelay = "";
      }
    });
  };
  toggle(dom.arabicContent, state.animArabic);
  toggle(dom.seaContent, state.animSEA);
  toggle(dom.emojiContent, state.animEmoji);
  dom.animStatus.textContent = `动画：${state.animArabic || state.animSEA || state.animEmoji ? "开启" : "全部关闭"}`;
}

function applyFeatures() {
  const fontFeature = state.ligatures ? '"liga" 1, "clig" 1' : '"liga" 0, "clig" 0';
  [dom.arabicContent, dom.seaContent].forEach(container => {
    container.querySelectorAll(".text-line").forEach(el => {
      el.style.fontFeatureSettings = fontFeature;
    });
  });

  [dom.arabicContent, dom.seaContent].forEach(container => {
    container.querySelectorAll(".rtl, .bidi-mix").forEach(el => {
      el.style.unicodeBidi = state.bidiMarks ? el.classList.contains("bidi-mix") ? "isolate-override" : "isolate" : "plaintext";
    });
  });

  dom.bidiStatus.textContent = state.bidiMarks ? "Bidi：控制字符在内" : "Bidi：仅自动方向";

  const emojiFont = state.altFont ? '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' : "inherit";
  dom.emojiContent.querySelectorAll(".emoji-char, .giant").forEach(el => {
    el.style.fontFamily = emojiFont;
  });
}

function applyBackground() {
  const checker = state.checker ? "checker" : "";
  [dom.arabicContent, dom.seaContent, dom.emojiContent].forEach(container => {
    container.classList.toggle("checker", state.checker);
  });
}

function startScroll() {
  cancelAnimationFrame(scrollRAF);
  if (state.scrollMode === "none") return;
  const maxScroll = Math.max(
    dom.arabicContent.scrollHeight - dom.arabicContent.clientHeight,
    dom.seaContent.scrollHeight - dom.seaContent.clientHeight,
    dom.emojiContent.scrollHeight - dom.emojiContent.clientHeight
  );
  let dir = 1;
  let last = performance.now();
  function loop(now) {
    const dt = now - last;
    last = now;
    const delta = dt * 0.04;
    [dom.arabicContent, dom.seaContent, dom.emojiContent].forEach(panel => {
      panel.scrollTop += delta * dir;
    });
    const current = dom.arabicContent.scrollTop;
    if (current <= 0) dir = 1;
    if (current >= maxScroll) dir = -1;

    fpsCounter.frames += 1;
    const elapsed = now - fpsCounter.last;
    if (elapsed >= 500) {
      fpsCounter.value = Math.round((fpsCounter.frames * 1000) / elapsed);
      fpsCounter.frames = 0;
      fpsCounter.last = now;
      dom.fpsBadge.textContent = `滚动 FPS：${fpsCounter.value}`;
    }
    scrollRAF = requestAnimationFrame(loop);
  }
  scrollRAF = requestAnimationFrame(loop);
}

function resetSettings() {
  state.fadeMin = 0.9;
  state.duration = 3;
  state.animArabic = true;
  state.animSEA = true;
  state.animEmoji = true;
  state.bidiMarks = true;
  state.giantEmoji = false;
  state.ligatures = true;
  state.altFont = false;
  state.scrollMode = "auto";
  state.checker = true;

  dom.fadeMin.value = state.fadeMin;
  dom.duration.value = state.duration;
  dom.animArabic.checked = true;
  dom.animSEA.checked = true;
  dom.animEmoji.checked = true;
  dom.bidiMarks.checked = true;
  dom.giantEmoji.checked = false;
  dom.ligatures.checked = true;
  dom.altFont.checked = false;
  dom.scrollMode.value = "auto";
  dom.checkerBg.checked = true;

  renderColumns();
  startScroll();
}

function attachEvents() {
  dom.fadeMin.addEventListener("input", () => {
    state.fadeMin = Number(dom.fadeMin.value);
    applyAnimations();
  });
  dom.duration.addEventListener("input", () => {
    state.duration = Number(dom.duration.value);
    applyAnimations();
  });
  dom.animArabic.addEventListener("change", () => {
    state.animArabic = dom.animArabic.checked;
    applyAnimations();
  });
  dom.animSEA.addEventListener("change", () => {
    state.animSEA = dom.animSEA.checked;
    applyAnimations();
  });
  dom.animEmoji.addEventListener("change", () => {
    state.animEmoji = dom.animEmoji.checked;
    applyAnimations();
  });
  dom.bidiMarks.addEventListener("change", () => {
    state.bidiMarks = dom.bidiMarks.checked;
    applyFeatures();
  });
  dom.giantEmoji.addEventListener("change", () => {
    state.giantEmoji = dom.giantEmoji.checked;
    renderColumns();
  });
  dom.ligatures.addEventListener("change", () => {
    state.ligatures = dom.ligatures.checked;
    applyFeatures();
  });
  dom.altFont.addEventListener("change", () => {
    state.altFont = dom.altFont.checked;
    applyFeatures();
  });
  dom.scrollMode.addEventListener("change", () => {
    state.scrollMode = dom.scrollMode.value;
    startScroll();
  });
  dom.checkerBg.addEventListener("change", () => {
    state.checker = dom.checkerBg.checked;
    applyBackground();
  });
  dom.resetBtn.addEventListener("click", resetSettings);
}

function boot() {
  renderColumns();
  attachEvents();
  startScroll();
}

boot();
