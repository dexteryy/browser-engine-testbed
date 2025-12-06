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

## R&D side⽤example 04 ｜ Canvas/WebGL Internal buffer type override

### Test target

cover Canvas 2D and WebGL(1/2) under different buffer configurationsofunderlying resourcesandRaster path differences(Including whether to retain the buffer, 
alpha Premultiplication, anti-sawing⻮, multisampling).

### Features involved

- Canvas 2D:alpha: true/false, willReadFrequently(cautious)
- WebGL:preserveDrawingBuffer: true/false, premultipliedAlpha: true/false, antialias:
  true/false, WebGL2 of MSAA/FBO Variants.

### Page structureandMain points

- by 2×2 ⽹simultaneous exhibition⽰ 4 group configuration (⽰example:alpha×preserve offour combinations),system⼀Render the same primitive (half
  transparent gradient+⽂book+thin line).
- Build another⻚⾯cover WebGL2 MSAA FBO andusually backbuffer ofright⽐.

### manual observationandSuggestion tools

- Layers:Observe whether layers and buffers are synthesized separately⼤⼩.

- Performance:Check Raster and Composite;switch preserveDrawingBuffer hourrightcombinebecomeandcopy⻉becomebookof
  Influence.
- Paint flashing:verify 2D Canvas at update timeofredraw range.

### Acceptance criteria

- Visually premultipliedand⾮premultipliedofedge, Gradient transitions work as expected.
- closure antialias You can see the jigsaw⻮⽽unreliable⼊Unusual resampling or dithering.
- preserveDrawingBuffer Does not cause abnormal memory explosion.

### Optional variants

- put⼤Canvas to full screen, observe⽡⽚rasterization⼒.
- Overlay CSS filter arrive Canvas element, forcing extra render pass.
