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

## R&D side⽤example 12 ｜ WebXR(Immersive) presentation and switching stability

> most⼩ JS rely:WebXR API;need⽀support device or emulator. like⽆Can⽤equipment as"from existing⽹⻚Select"The sampling items record the phenomenon.

### Test target

Check in⼊/quit XR Frame stability and compositing paths in session, immersive rendering; validation⻚⾯and XR Layer management when switching views.

### Features involved

WebXR session, XRLayer, sRGB output, single/pair⽬Render switch, mirror to 2D ⻚⾯synthesis.

### Page structureandMain points

- Two types of content: lightweight interactive scenarios (simple⼏what)andvideo dome scene;
- supply"Enter⼊/quit XR""scene change"controls.
- ⻚⾯side hold 2D UI(Observe the mirror).

### manual observationandRecommended workTool

- Screen:Enter⼊/quit⽆splash screen/afterimage;
- Performance:XR Frame rateandMain thread accounts for⽐(existCan⽤⼯Tool/recorded on the device);
- Layers:XR Mirror layerand 2D UI composite relationship.

### Acceptance criteria

- Stablize 72/90Hz(Equipment can⼒within the range);
- switch⽆⻓frame or stuck;
- Mirror output is clear⽆ gamma mistake.

### CanSelect variant

- XR video decoding + texture rendering;
- turn on/Turn off dynamic resolution (if the scene implements it).
