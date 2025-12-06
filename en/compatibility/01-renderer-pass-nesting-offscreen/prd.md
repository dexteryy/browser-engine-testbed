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

## R&D side⽤example 01 ｜ Renderer Pass Nested and off-screen buffer links

### Test target

Verify that there are multiple layers filter/backdrop-filter/mask/In the case of mixed mode,Chrome Are the layers correctly created and replicated?
⽤Off-screen buffering (offscreen render pass),Whether the composition order and boundaries are correct; evaluate the impact of multi-level nesting on rasterization and video memory
Influence.

### Features involved

CSS filter: blur()/drop-shadow(), backdrop-filter: blur(), mask-image/-webkit-mask-image, 
mix-blend-mode, isolation: isolate, Mixing of semi-transparent overlay and opaque content; can be added⼊ SVG filter Get the version right
According to.

### Page structure and key points

- Three-layer nested container: outer layer A(filter: blur(6px)),middle level B(mix-blend-mode: multiply + translucent back
  view), inner layer C(mask-image round or SVG mask).
- extra covering O(position: fixed; backdrop-filter: blur(8px))span⻚⾯top.
- All layers⾯The product is significantly different (⼤⾯product A, ⼩⾯product C, full screen O),Make more render pass Nesting and different pixel coverage
  rate combination.
- Don't use⽤ JS(Purely static) to ensure stable layout and only examine the rendering path.

### Human observation and suggestion tools

- DevTools → Rendering:start⽤ Show composited layer borders, Paint flashing.
- DevTools → Layers ⾯board: check if A/B/C/O Create a unique⽴Layers and off-screen buffering; observing layer hierarchy and compositing
  order.

- DevTools → Performance:Record⾸frame with⼀Roll slightly and observe Paint and Composite ⽐example, GPU Inside
  Save peak value.

### Acceptance criteria

- Visually Correct: Mix/Mask/Blurred edges⽆tear,⽆⾊bring,⽆Wrong stacking order.
- Synthetically reasonable: different⾯productandThe effect's layers are assigned to the appropriate number of composition layers,There is no abnormally large amount of video memory or frequent redrawing..
- While scrolling,⽆Obvious frame drops or filter flickering.

### Optional variants

- Will filter Replace with equivalence SVG filter right⽐;
- increase⼤/reduce⼩Blur radius, observe the off-screen texture ruler⼨andRaster time consumption changes;
- remove isolation ⽐More synthetic boundary changes.
