// Ink API vs Canvas 2D rendering comparison
// All comments are in English per requirements

(() => {
  /** @type {HTMLCanvasElement} */
  const leftCanvas = document.getElementById('leftCanvas');
  /** @type {HTMLCanvasElement} */
  const rightCanvas = document.getElementById('rightCanvas');
  const leftWrap = document.getElementById('leftWrap');
  const rightWrap = document.getElementById('rightWrap');
  const inputLayer = document.getElementById('inputLayer');
  const inkSupportEl = document.getElementById('inkSupport');
  const eventStatusEl = document.getElementById('eventStatus');
  const fpsEl = document.getElementById('fps');
  const lastAreaEl = document.getElementById('lastArea');
  const leftHint = document.getElementById('leftHint');
  const rightHint = document.getElementById('rightHint');
  const ticker = document.getElementById('ticker');

  // Controls
  const brushSize = document.getElementById('brushSize');
  const brushAlpha = document.getElementById('brushAlpha');
  const brushColor = document.getElementById('brushColor');
  const useRaw = document.getElementById('useRaw');
  const useCoalesced = document.getElementById('useCoalesced');
  const inkCommitOnUp = document.getElementById('inkCommitOnUp');
  const leftComposited = document.getElementById('leftComposited');
  const rightComposited = document.getElementById('rightComposited');
  const mixBlend = document.getElementById('mixBlend');
  const bgSelect = document.getElementById('bgSelect');
  const pixelRatioSel = document.getElementById('pixelRatio');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');

  // Internal state
  const state = {
    dprMode: 'dpr', // '1' or 'dpr'
    isDrawing: false,
    pointerId: null,
    lastPos: null, // {x, y} in CSS px space, relative to each canvas
    lastRightArea: null,
    rawSeen: false,
    ink: {
      supported: false,
      presenter: null,
      pendingStroke: [] // points collected during drawing for left persistence when commit-on-up enabled
    }
  };

  // Utility: configure canvas to desired pixel ratio
  function setupCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const scale = pixelRatioSel.value === 'dpr' ? (window.devicePixelRatio || 1) : 1;
    const w = Math.max(1, Math.floor(rect.width * scale));
    const h = Math.max(1, Math.floor(rect.height * scale));
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronize: true });
    // Scale so that 1 unit in canvas corresponds to 1 CSS pixel
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
    return ctx;
  }

  // Current 2D contexts (recreated on resize / pixel ratio changes)
  let leftCtx = setupCanvas(leftCanvas);
  let rightCtx = setupCanvas(rightCanvas);

  function rgbaString(hex, alpha) {
    // Convert #rrggbb to rgba(r,g,b,a)
    const v = hex.replace('#', '');
    const r = parseInt(v.slice(0, 2), 16);
    const g = parseInt(v.slice(2, 4), 16);
    const b = parseInt(v.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function currentStyle(pressure = 0.5) {
    const base = Number(brushSize.value);
    // Weight pressure so 0 pressure still draws a minimal stroke
    const diameter = Math.max(1, base * (0.25 + pressure));
    const color = rgbaString(brushColor.value, Number(brushAlpha.value));
    return { diameter, color };
  }

  // Apply compositing hint classes
  function applyCompositingHints() {
    leftWrap.classList.toggle('composited', leftComposited.checked);
    rightWrap.classList.toggle('composited', rightComposited.checked);
  }

  function applyBackgrounds() {
    const cls = bgSelect.value === 'checker' ? 'bg-checker' : 'bg-gradient';
    leftWrap.classList.toggle('bg-checker', cls === 'bg-checker');
    leftWrap.classList.toggle('bg-gradient', cls === 'bg-gradient');
    rightWrap.classList.toggle('bg-checker', cls === 'bg-checker');
    rightWrap.classList.toggle('bg-gradient', cls === 'bg-gradient');
  }

  function applyMixBlend() {
    const v = mixBlend.value;
    // Use CSS mix-blend-mode on the canvas element to observe blending with backgrounds.
    leftCanvas.style.mixBlendMode = v === 'normal' ? 'unset' : v;
    rightCanvas.style.mixBlendMode = v === 'normal' ? 'unset' : v;
  }

  function clearAll() {
    leftCtx.save(); rightCtx.save();
    leftCtx.setTransform(1,0,0,1,0,0);
    rightCtx.setTransform(1,0,0,1,0,0);
    leftCtx.clearRect(0, 0, leftCanvas.width, leftCanvas.height);
    rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
    leftCtx.restore(); rightCtx.restore();
    state.ink.pendingStroke.length = 0;
    leftHint.textContent = '等待输入…';
    rightHint.textContent = '等待输入…';
    state.lastRightArea = null;
    lastAreaEl.textContent = '右侧重绘估算：--';
  }

  function exportRightPNG() {
    const url = rightCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-output.png';
    a.click();
  }

  // Resize observer to keep canvases crisp
  const ro = new ResizeObserver(() => {
    leftCtx = setupCanvas(leftCanvas);
    rightCtx = setupCanvas(rightCanvas);
  });
  ro.observe(leftCanvas);
  ro.observe(rightCanvas);

  // Init backgrounds and compositor hints
  applyBackgrounds();
  applyCompositingHints();
  applyMixBlend();

  // Ink API detection and initialization
  async function initInk() {
    const hasInk = !!(navigator.ink && typeof navigator.ink.requestPresenter === 'function');
    state.ink.supported = hasInk;
    if (hasInk) {
      try {
        state.ink.presenter = await navigator.ink.requestPresenter({ presentationArea: leftCanvas });
        inkSupportEl.textContent = 'Ink API：已启用';
        inkSupportEl.style.background = '#eaffea';
      } catch (e) {
        console.warn('Ink presenter init failed:', e);
        state.ink.supported = false;
        state.ink.presenter = null;
        inkSupportEl.textContent = 'Ink API：初始化失败（已降级）';
        inkSupportEl.style.background = '#fff3cd';
      }
    } else {
      inkSupportEl.textContent = 'Ink API：不支持（已降级）';
      inkSupportEl.style.background = '#ffecec';
      // Ensure left side still draws live when Ink is absent
      inkCommitOnUp.checked = false;
      inkCommitOnUp.disabled = true;
    }
  }

  // Drawing helpers
  function drawSegment(ctx, from, to, style) {
    ctx.save();
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.diameter;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function handleDrawEvents(e) {
    if (!state.isDrawing || e.pointerId !== state.pointerId) return;

    // Determine the event sequence to process
    const events = (useCoalesced.checked && typeof e.getCoalescedEvents === 'function')
      ? e.getCoalescedEvents()
      : [e];

    // Event coordinates: we'll convert each to canvas-local CSS pixels
    events.forEach(ev => {
      const posLeft = clientToLocal(leftCanvas, ev);
      const posRight = clientToLocal(rightCanvas, ev);
      const pressure = typeof ev.pressure === 'number' ? ev.pressure : 0.5;
      const style = currentStyle(pressure);

      // Hardware ink trail: hint the OS compositor
      if (state.ink.supported && state.ink.presenter) {
        try {
          state.ink.presenter.updateInkTrailStartPoint(ev, { color: style.color, diameter: style.diameter });
        } catch (err) {
          // Swallow errors if any (e.g., non-trusted event)
        }
      }

      // For right canvas, draw immediately (simulate typical app drawing path)
      if (state.lastPos) {
        drawSegment(rightCtx, state.lastPos.right, posRight, style);
        // Update right paint area estimate (axis-aligned bounding box enlarged by diameter)
        const dx = Math.abs(posRight.x - state.lastPos.right.x) + style.diameter;
        const dy = Math.abs(posRight.y - state.lastPos.right.y) + style.diameter;
        state.lastRightArea = { w: Math.max(1, Math.round(dx)), h: Math.max(1, Math.round(dy)) };
      }
      // For left canvas, either draw later (commit-on-up) or mirror now
      if (!inkCommitOnUp.checked || !state.ink.supported) {
        if (state.lastPos) drawSegment(leftCtx, state.lastPos.left, posLeft, style);
      } else {
        // Buffer for later committing to left canvas
        if (state.lastPos) state.ink.pendingStroke.push({ from: state.lastPos.left, to: posLeft, style: { ...style } });
      }

      // Update last positions
      state.lastPos = { left: posLeft, right: posRight };
    });

    // UI hints
    rightHint.textContent = '绘制中…';
    leftHint.textContent = state.ink.supported ? '硬件墨迹（合成器叠加中）' : '绘制中…';

    // Update status
    if (state.lastRightArea) {
      lastAreaEl.textContent = `右侧重绘估算：${state.lastRightArea.w}×${state.lastRightArea.h} 像素（近似）`;
    }
  }

  function clientToLocal(canvas, ev) {
    const rect = canvas.getBoundingClientRect();
    // Coordinates in CSS pixel space
    return {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    };
  }

  function pointerDown(e) {
    // Only start a new stroke if not already drawing
    if (state.isDrawing) return;
    state.isDrawing = true;
    state.pointerId = e.pointerId;
    state.lastPos = null;
    state.ink.pendingStroke.length = 0;
    state.rawSeen = false;
    // Avoid setPointerCapture when Ink overlay might need OS compositor; otherwise capture to ensure up is received
    if (!state.ink.supported && inputLayer.setPointerCapture) {
      try { inputLayer.setPointerCapture(e.pointerId); } catch {}
    }
    leftHint.textContent = state.ink.supported ? '硬件墨迹（合成器叠加中）' : '绘制中…';
    rightHint.textContent = '绘制中…';
  }

  function pointerUpOrCancel(e) {
    if (!state.isDrawing || e.pointerId !== state.pointerId) return;
    state.isDrawing = false;
    state.pointerId = null;
    state.rawSeen = false;

    // On commit, persist the buffered stroke to the left canvas (if any)
    if (inkCommitOnUp.checked && state.ink.pendingStroke.length) {
      state.ink.pendingStroke.forEach(seg => drawSegment(leftCtx, seg.from, seg.to, seg.style));
      state.ink.pendingStroke.length = 0;
    }

    leftHint.textContent = state.ink.supported ? '已固化到画布' : '完成';
    rightHint.textContent = '完成';

    if (!state.ink.supported && inputLayer.releasePointerCapture) {
      try { inputLayer.releasePointerCapture(e.pointerId); } catch {}
    }
  }

  // Event wiring: we attach to the transparent input layer spanning both panes
  inputLayer.addEventListener('pointerdown', pointerDown);
  inputLayer.addEventListener('pointerup', pointerUpOrCancel);
  inputLayer.addEventListener('pointercancel', pointerUpOrCancel);
  inputLayer.addEventListener('contextmenu', e => e.preventDefault());

  // Global fallback to prevent stuck drawing if pointerup occurs off-layer
  window.addEventListener('pointerup', pointerUpOrCancel);
  window.addEventListener('pointercancel', pointerUpOrCancel);

  // We listen to both events; when useRaw is checked we just update status text accordingly
  inputLayer.addEventListener('pointerrawupdate', e => {
    if (useRaw.checked) {
      state.rawSeen = true;
      handleDrawEvents(e);
    }
  });
  inputLayer.addEventListener('pointermove', e => {
    // Fallback: if raw is enabled but never seen (platform does not emit), still handle move
    if (!useRaw.checked || !state.rawSeen) handleDrawEvents(e);
  });

  // Controls interactions
  useRaw.addEventListener('change', () => {
    eventStatusEl.textContent = '事件：' + (useRaw.checked ? 'pointerrawupdate' : 'pointermove');
  });
  mixBlend.addEventListener('change', applyMixBlend);
  bgSelect.addEventListener('change', applyBackgrounds);
  leftComposited.addEventListener('change', applyCompositingHints);
  rightComposited.addEventListener('change', applyCompositingHints);
  clearBtn.addEventListener('click', clearAll);
  exportBtn.addEventListener('click', exportRightPNG);

  pixelRatioSel.addEventListener('change', () => {
    // Recreate contexts at new scale
    leftCtx = setupCanvas(leftCanvas);
    rightCtx = setupCanvas(rightCanvas);
  });

  // FPS meter & ticker animation driven by rAF
  let lastRAF = performance.now();
  let progress = 0; // 0..1
  function raf() {
    const now = performance.now();
    const dt = now - lastRAF;
    lastRAF = now;

    const fps = 1000 / dt;
    fpsEl.textContent = 'FPS：' + Math.round(fps);

    // Move ticker horizontally; 1000px per second across the container width
    const inner = document.querySelector('.test-area .inner');
    const width = inner.getBoundingClientRect().width;
    const speedPxPerSec = 600;
    progress = (progress + dt * speedPxPerSec / width) % 1;
    ticker.style.transform = `translateX(${progress * (width - 40)}px)`; // 40px is ticker width

    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // PerformanceObserver for Long Tasks (optional lightweight hint)
  if ('PerformanceObserver' in window) {
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // If long task detected, briefly tint the ticker border as a visual cue
          if (entry.duration > 50) {
            ticker.style.borderRightColor = '#ff3b30';
            setTimeout(() => (ticker.style.borderRightColor = ''), 120);
          }
        }
      });
      po.observe({ type: 'longtask', buffered: true });
    } catch {}
  }

  // Initialize
  initInk();
  clearAll();

  // Keep canvases crisp on orientation / resize
  window.addEventListener('resize', () => {
    leftCtx = setupCanvas(leftCanvas);
    rightCtx = setupCanvas(rightCanvas);
  });
})();
