# test case10:Blend Mode Overlay Effects and Compositing Layers

This directory contains 4 independent web pages:

- `index.html`:Core demo. Interactively set blending modes, colors,Alpha and isolation; supports dragging position adjustment; provides simple approximate mixed color calculation (only multiply/screen).
- `text-image.html`:Test text and SVG Blending effects for images with toggle isolation.
- `layers.html`:Used to observe composition layer boundaries, including various layer promotion prompts (transform, will-change, filter).
- `perf-stress.html`:For stress testing (large amounts of mixed elements + animation), view FPS and fluency.

> Requirements: Only the latest Chromium Just open the test in your browser.
