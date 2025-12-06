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

## R&D side⽤example 08 ｜ WebGL picture⽚Textures and Extreme Texture Properties

### Test target

exist WebGL Covering a variety ofpicture⽚texture combination (NPOT, mipmap, sRGB, Anisotropic, giant texture approach
MAX_TEXTURE_SIZE)Effects on rasterization and compositing.

### Features involved

NPOT texture,generateMipmap, EXT_texture_filter_anisotropic, sRGB ⽬mark,
REPEAT/CLAMP_TO_EDGE, MIN/MAG Sampling mode.

### Page structure and key points

- Jiugong format pattern: each grid⼀texture configuration;All render the same testpictureSample(sharp chessboard+slash+⽂book).
- alone⻚⾯⽤near MAX_TEXTURE_SIZE of⼤Texture (such as 4096×4096 Floating up and down) testing limits.

### Human observation and suggestion tools

- Screen: Moiré when zooming and tilting/Is it possible to flash⻅.
- Performance:⽣become mipmap, upload⼤textureof⻓frame.
- Layers:Did giant textures cause⼤combinebecomeLayers and memory usage⽤.

### Acceptance criteria

- Sampling and mipmap Visually reasonable,⽆abnormal⾊partial/seam.
- ⼤Texture loading does not result in⻚⾯⽆response or GPU Memoryabnormalsoar.

### Optional variants

- sRGB versus linear space⽐;
- gradually increase⼤to exceed limit(matchcombineR&D side⽤example 14).
