// Common helpers for all pages (comments in English).
// Classic script (non-module) to avoid file:// CORS issues; attaches to window.MaskUtils.
(function (root) {
  function qs(sel, rootEl) { return (rootEl || document).querySelector(sel); }
  function qsa(sel, rootEl) { return Array.from((rootEl || document).querySelectorAll(sel)); }
  function on(el, type, fn) { el.addEventListener(type, fn); return () => el.removeEventListener(type, fn); }
  function byId(id) { return document.getElementById(id); }

  function toast(msg) {
    const n = document.createElement('div');
    n.textContent = msg;
    Object.assign(n.style, {
      position: 'fixed', left: '50%', top: '20px', transform: 'translateX(-50%)',
      background: '#111', color: '#fff', padding: '8px 12px', borderRadius: '8px',
      fontSize: '12px', zIndex: 9999, opacity: '0'
    });
    document.body.appendChild(n);
    requestAnimationFrame(() => {
      n.style.transition = 'opacity .2s ease, transform .2s ease';
      n.style.opacity = '1';
      n.style.transform = 'translateX(-50%) translateY(8px)';
    });
    setTimeout(() => {
      n.style.opacity = '0';
      n.style.transform = 'translateX(-50%)';
      setTimeout(() => n.remove(), 300);
    }, 1200);
  }

  function copy(text) {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      toast('Copied CSS');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast('Copied CSS')).catch(fallback);
    } else fallback();
  }

  function cssSupports(prop, value) {
    return !!(window.CSS && CSS.supports && CSS.supports(prop, value));
  }

  // Simple FPS meter using rAF.
  class FpsMeter {
    constructor() { this._running = false; this._frames = 0; this.samples = []; this.last = 0; }
    start() {
      this._running = true; this._frames = 0; this.samples = []; this.last = performance.now();
      const loop = (t) => {
        if (!this._running) return;
        const dt = t - this.last;
        if (dt > 0 && dt < 1000) this.samples.push(dt);
        this.last = t; this._frames++;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
    stop() {
      this._running = false;
      const avg = this.samples.length ? this.samples.reduce((a, b) => a + b, 0) / this.samples.length : 0;
      const fps = avg ? (1000 / avg) : 0;
      const p95 = this.samples.length ? quantile(this.samples, 0.95) : 0;
      const p99 = this.samples.length ? quantile(this.samples, 0.99) : 0;
      return { frames: this._frames, samples: this.samples.length, avg, fps, p95, p99 };
    }
  }
  function quantile(arr, q) {
    const a = arr.slice().sort((x, y) => x - y);
    const pos = (a.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    return a[base + 1] !== undefined ? a[base] + rest * (a[base + 1] - a[base]) : a[base];
  }

  function setBar(el, ratio) {
    ratio = Math.max(0, Math.min(1, ratio));
    const bar = el.querySelector('i');
    if (bar) bar.style.width = (ratio * 100).toFixed(1) + '%';
  }

  function number(n, digits = 2) { return Number(n).toFixed(digits); }

  // Build CSS string from mask-related computed values.
  function extractMaskCSS(target) {
    const cs = getComputedStyle(target);
    const props = ['mask-image', 'mask-mode', 'mask-size', 'mask-position', 'mask-repeat', 'mask-origin', 'mask-clip', 'mask-type', 'mask'];
    return props.map(p => `${p}: ${cs.getPropertyValue(p)};`).join('\n');
  }

  // Apply mask-related styles with WebKit-prefixed fallback to cover older/blink-style engines.
  function applyMaskStyles(el, styles) {
    const set = (suffix, value) => {
      if (value === undefined) return;
      el.style['mask' + suffix] = value;
      el.style['webkitMask' + suffix] = value;
    };
    if ('mask' in styles) set('', styles.mask);
    if ('image' in styles) set('Image', styles.image);
    if ('mode' in styles) set('Mode', styles.mode);
    if ('size' in styles) set('Size', styles.size);
    if ('position' in styles) set('Position', styles.position);
    if ('repeat' in styles) set('Repeat', styles.repeat);
    if ('composite' in styles) {
      el.style.maskComposite = styles.composite;
      el.style.webkitMaskComposite = styles.composite;
    }
  }

  // Inline SVG mask sources to avoid file:// CORS issues.
  const rawSvgs = {
    circle: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="50" fill="white"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" preserveAspectRatio="none"><polygon points="60,5 73,43 113,43 79,66 92,104 60,81 28,104 41,66 7,43 47,43" fill="white"/></svg>`,
    ring: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" preserveAspectRatio="none"><circle cx="60" cy="60" r="45" fill="none" stroke="white" stroke-width="18" stroke-linecap="round"/></svg>`,
    soft: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><radialGradient id="fade" cx="50%" cy="50%" r="50%"><stop offset="70%" stop-color="white" stop-opacity="1"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient></defs><rect x="0" y="0" width="100" height="100" fill="url(#fade)"/></svg>`
  };
  const maskSources = Object.fromEntries(Object.entries(rawSvgs).map(([k,v]) => [k, 'data:image/svg+xml;utf8,' + encodeURIComponent(v)]));

  root.MaskUtils = { qs, qsa, on, byId, copy, toast, cssSupports, FpsMeter, setBar, number, extractMaskCSS, applyMaskStyles, maskSources };
})(window);
