
// ---------- Utilities used across pages (English comments only) ----------

/** Shortcut query selector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
/** Create element helper */
const el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);
  Object.assign(node, props);
  if (Array.isArray(children)) children.forEach(c => node.appendChild(c));
  else if (children != null) node.appendChild(children);
  return node;
};

/** Bind <input type="range"> to an <output> element showing its current value. */
function bindRangeOutput(rangeEl, outputEl, map = (v) => v + "px") {
  const render = () => outputEl.textContent = map(rangeEl.value);
  rangeEl.addEventListener("input", render);
  render();
}

/** Convert "12.34px" to number 12.34 */
function pxToNumber(px) {
  return parseFloat(px || "0");
}

/** Generate Chinese-like filler text */
function makeChineseParagraph() {
  const pool = [
    "This is a Chinese paragraph used for testing to observe how the multi-column layout performs when splitting text.",
    "Text should be evenly distributed across columns as container width, number of columns, and column spacing vary.",
    "If some elements are set to avoid disconnection, the browser needs to move them as a whole to the next column.",
    "The scrolling should be smooth, with no obvious frame drops or redraw abnormalities.",
    "If cross-column headers are enabled, the header needs to span all columns.",
    "Some longer sentences are included here so you can see the details of line breaks and word spacing and rendering stability.",
    "As a block-level alternative element, images should not be split and should be reasonably spaced from adjacent paragraphs."
  ];
  // Randomly stitch 2-4 sentences
  const len = 2 + Math.floor(Math.random() * 3);
  let s = [];
  for (let i = 0; i < len; i++) s.push(pool[Math.floor(Math.random() * pool.length)]);
  return s.join("");
}

/** Create a <p> with optional class */
function createP(cls) {
  const p = document.createElement("p");
  if (cls) p.className = cls;
  p.textContent = makeChineseParagraph();
  return p;
}

/** Create a section heading that should not break across columns */
function createSectionHeading(text) {
  const h = document.createElement("h3");
  h.className = "section avoid-break";
  h.textContent = text;
  return h;
}

/** Create an inline SVG placeholder as an "image" */
function createSVGPlaceholder(width, height, label) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "ph");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");
  // Background rect
  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", "#f1f3f5");
  rect.setAttribute("stroke", "#e9ecef");
  svg.appendChild(rect);
  // Diagonal lines
  const line1 = document.createElementNS(svgNS, "line");
  line1.setAttribute("x1", "0"); line1.setAttribute("y1", "0");
  line1.setAttribute("x2", width); line1.setAttribute("y2", height);
  line1.setAttribute("stroke", "#ced4da");
  svg.appendChild(line1);
  const line2 = document.createElementNS(svgNS, "line");
  line2.setAttribute("x1", width); line2.setAttribute("y1", "0");
  line2.setAttribute("x2", "0"); line2.setAttribute("y2", height);
  line2.setAttribute("stroke", "#ced4da");
  svg.appendChild(line2);
  // Label
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", width/2);
  text.setAttribute("y", height/2);
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", Math.max(12, Math.min(22, height/6)));
  text.setAttribute("fill", "#868e96");
  text.textContent = label || `${width}x${height}`;
  svg.appendChild(text);
  return svg;
}

/** Create a figure with placeholder image and caption */
function createFigure(height, idx) {
  const fig = document.createElement("figure");
  fig.className = "avoid-break";
  const svg = createSVGPlaceholder(800, height, `image ${idx} - ${height}px`);
  const cap = document.createElement("figcaption");
  cap.textContent = "imageillustrate:This is used to test the performance of alternative elements across columns.";
  fig.appendChild(svg);
  fig.appendChild(cap);
  return fig;
}

/** Fill a multi-column container with content */
function fillContent(container, options = {}) {
  const {
    paragraphs = 30,
    insertFigureEvery = 6,
    figureHeights = [140, 220, 320, 420],
    startIndex = 1,
    withSpanningHeader = true
  } = options;

  // Optional spanning header at the top of columns
  if (withSpanningHeader) {
    const spanHeader = document.createElement("div");
    spanHeader.className = "span-all";
    spanHeader.textContent = "Column header: for testing column-span: all The rendering effect";
    container.appendChild(spanHeader);
  }

  let idx = startIndex;
  for (let i = 0; i < paragraphs; i++) {
    // Insert a section header periodically
    if (i % 5 === 0) container.appendChild(createSectionHeading("Section headers (avoid splitting across columns)"));

    // Paragraph
    container.appendChild(createP());

    // Optional figure
    if (insertFigureEvery && (i % insertFigureEvery === insertFigureEvery - 1)) {
      const h = figureHeights[i % figureHeights.length];
      container.appendChild(createFigure(h, idx++));
    }
  }
}

/** Simple performance measurement helpers */
function mark(name) { performance.mark(name); }
function measure(name, start, end) { 
  try { performance.measure(name, start, end); } catch(e) {}
  const m = performance.getEntriesByName(name).pop();
  return m ? m.duration : 0;
}

/** Auto scroll a container and report a simple FPS estimate */
function autoScroll(container, durationMs = 8000, pxPerSec = 600) {
  return new Promise((resolve) => {
    const startTop = container.scrollTop;
    const maxTop = container.scrollHeight - container.clientHeight;
    const start = performance.now();
    let last = start, frames = 0, drops = 0;

    function step(t) {
      frames++;
      const dt = t - last;
      if (dt > 26) drops++; // ~ >38fps as a simple drop heuristic
      last = t;
      const elapsed = t - start;
      const dist = Math.min(maxTop - startTop, (elapsed / 1000) * pxPerSec);
      container.scrollTop = startTop + dist;
      if (elapsed < durationMs && container.scrollTop < maxTop) {
        requestAnimationFrame(step);
      } else {
        const total = performance.now() - start;
        const fps = (frames / total) * 1000;
        resolve({ fps: Math.round(fps), frames, drops });
      }
    }
    requestAnimationFrame(step);
  });
}

/** Long Tasks observer helper */
function createLongTaskObserver() {
  const records = [];
  let observer = null;
  return {
    start() {
      records.length = 0;
      try {
        observer = new PerformanceObserver((list) => {
          list.getEntries().forEach(e => records.push(e.duration));
        });
        observer.observe({ entryTypes: ["longtask"] });
      } catch(e) {
        // Longtasks may be unavailable; ignore.
      }
    },
    stop() {
      if (observer) observer.disconnect();
    },
    summary() {
      if (!records.length) return { count: 0, max: 0, avg: 0 };
      const sum = records.reduce((a,b)=>a+b,0);
      const max = Math.max(...records);
      return { count: records.length, max: Math.round(max), avg: Math.round(sum / records.length) };
    }
  };
}

/** Compute effective column count approximation */
function computeEffectiveColumns(el) {
  const cs = getComputedStyle(el);
  const count = cs.columnCount;
  if (count && count !== "auto") return parseInt(count, 10);
  const gap = pxToNumber(cs.columnGap);
  const width = el.clientWidth;
  const cwidth = cs.columnWidth === "auto" ? 0 : pxToNumber(cs.columnWidth);
  if (!cwidth) return 1;
  // floor((containerWidth + gap) / (colWidth + gap))
  const columns = Math.max(1, Math.floor((width + gap) / (cwidth + gap)));
  return columns;
}

/** Utility to update a small metrics badge block */
function renderMetrics(el, target) {
  const cs = getComputedStyle(el);
  const columns = computeEffectiveColumns(el);
  const gap = cs.columnGap;
  const rule = `${cs.columnRuleWidth} ${cs.columnRuleStyle} ${cs.columnRuleColor}`;
  const fill = cs.columnFill;
  target.innerHTML = `
    <span class="badge">Actual number of columns:${columns}</span>
    <span class="badge">Column spacing:${gap}</span>
    <span class="badge">Column separators:${rule}</span>
    <span class="badge">column-fill:${fill}</span>
  `;
}
