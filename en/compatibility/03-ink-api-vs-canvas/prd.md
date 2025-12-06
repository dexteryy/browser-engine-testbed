You are a professional web front-end developer tasked with creating a series of demos for a new browser engine as test cases to evaluate its compatibility and performance in web rendering.

This document provides the requirements for these test cases. Some include reference designs (with usage); others do not. In all cases, design specifically to meet the requirements and provide working code.

Your designs and implementations must follow all of these rules:

1. Each test case consists of one or more standalone pages, each page dedicated to a single testing need.
2. Each page must use only raw HTML, CSS, JS, and Web APIs-no frameworks or libraries (e.g., React, Vite, npm).
3. Only the latest Chromium needs to be supported; ignore other browsers or older versions; no cross-platform support is needed.
4. Page code and content must stay focused on the test goals, avoiding distracting extras.
5. Pages may include visualization UI and related JS to help view and evaluate results (all UI must truly work) but should not skew test outcomes.
6. Code comments must be in English, and page copy must be in English.
7. Every page includes:
   a. Top bar: test title and one-line description
   b. Toolbar: controls, parameters, and status indicators needed during testing
   c. Test area
   d. Explanations: test goals, plan, usage, and how to view/check/evaluate results
8. Keep UI design and visual style consistent:
   a. White background
   b. Top bar spans the full width
   c. Other regions share a consistent content width
9. Each test case lives in a directory named with its index and short title, separated by dashes.

## R&D side⽤example 03 ｜ Ink API Hardware ink compositing and⽹⻚draw pairs⽐

> most⼩ JS Dependency: adjust⽤ Ink API;If not⽤,Graceful downgrade to normal Pointer Events.

### Test target

right⽐ OS/Synth layer⾯Hardware Ink (low latency, composition first) vs.⽹⻚⾃⾝pixel draw(Canvas)difference, observation
lose⼊Frame stability and redraw area when sketching⼤⼩.

### Features involved

Ink API, Pointer Events, pointerrawupdate(If necessary),CSS Hardware acceleration⽰(will-change).

### Page structure and key points

- Left canvas:Ink API path (if⽀Hold); right canvas:Canvas 2D path.
- Synchronous display⽰Same handwriting (thickness/transparency⼀), with a checkerboard or gradient background to observe the blending effect.
- Timing bar or tempo indicator⽰frame stabilization⾁Eye reference.

### Human observation and suggestion tools

- Rendering → Paint flashing:Ink path ideally⼏Hardly flickering,Canvas Paths are frequently redrawn.
- Performance:The main thread occupied by the recording fast writing (rapidly consecutive strokes) phase⽤, Dropped frames.
- Layers:Ink Whether to be laminated via synthetic⼊,Not occupying⽤Too much raster time.

### Acceptance criteria

- Ink Lower path delay, line following⼿,⼏Hardly triggered⼤⾯product Paint.
- Canvas The path can⻅Redraw increases but⽆Tear; visual result of both⼀To.

### Optional variants

- Transparent ink and blending mode overlay;⾼resolutioncanvas(HiDPI).
