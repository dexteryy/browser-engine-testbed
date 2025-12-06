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

## R&D side⽤example 06 ｜ Canvas/Video Interop: PixelCopy⻉Upload with textures

### Test target

verify `<video>` frame copy⻉arrive Canvas 2D and WebGL textureofpath cost, Upload costand⾊Color accuracy (YUV→RGB change
Change+texture sampling).

### Features involved

`<video>`, Canvas 2D of drawImage(video, ...), WebGL texImage2D/texSubImage2D(video);CSS
image-rendering Sampling difference control.

### Page structureandMain points

- Left column:Canvas 2D from `<video>` Keep drawing.
- Right column:WebGL by `<video>` fortexturerenderingarrivequadrilateral.
- Superimpose two columns⽹gridandtest pattern(⽅Check zoomand⾊color).

### ArtificialobserveandSuggestion tools

- Performance:continuous 10s recording,⽐Main thread on both sidesand GPU load.
- Layers:confirm WebGL Is the canvas unique?⽴Whether synthesis and upload bandwidth cause lag (indirect observation).
- Screen observation:⾊color/Is the sharpnessanddirect `<video>` present⼀To;⽆tear.

### Acceptance criteria

- two path vision⼀To (⾊colorandThe accuracy deviation is⾁Eye acceptable range).
- 30/60fps painting⾯⽆Frame drops periodically.
- Texture upload does not cause main thread⻓Jitter.

### Optional variants

- ⾼resolution 4K source;
- Will WebGL Texture overlay CSS filter observe⼆Secondary synthesis cost.
