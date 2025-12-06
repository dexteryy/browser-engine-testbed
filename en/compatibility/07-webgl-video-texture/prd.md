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

## R&D side⽤example 07 ｜ WebGL Video texture rendering (tessellation)

### Test target

focus WebGL by `<video>` For texture stability and scaling/Sampling quality, evaluates the impact of texture updates and sampling modes on composition and bandwidth⼒.

### Features involved

WebGL TEXTURE_2D, UNPACK_FLIP_Y_WEBGL, LINEAR/NEAREST sampling,sRGB/⾮ sRGB ⽬mark
(If possible⾏).

### Page structure and key points

- Full screen quad sticker video texture, keyed or CSS switch nearest neighbor/linear sampling (⽆need JS Also possible⽤Compare the two canvases).
- supply 1:1, Downsampling,Upsampling three scales⼨.

### Human observation and suggestion tools

- Screen: Sampling Mode Difference (Saw⻮/fuzzy) as expected.
- Performance:Texture update frequency vs. GPU Synthetic stability.
- Layers:Whether the canvas remains unique⽴Composition layer.

### acceptancemarkallow

- Vision⽆Tearing and frame lag; sample switching does not cause flickering.
- ⾼The frame rate is still maintained at a stable resolution.

### Optional variants

- Multiple video textures are rendered simultaneously (2〜4 road).
