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

## R&D side⽤example 09 ｜⽹⻚⾃define font (WOFF2/Variable fonts) rendering and caching

### Test target

View⾃define font (Containsvariable font)Glyph rasterization of, cache hitandSynthetic performance;observing shadows/Stroke and other effects Paint influence.

### Features involved

@font-face(WOFF2/WOFF/OTF), variable font font-variation-settings, CSS text-shadow/filter:
drop-shadow(), font-feature-settings.

### Page structure and key points

- Multiple paragraphs⽂Book: Ordinary/Thickness changes/italics/⼩mold⼤Write/Ligature.
- ⼀envoys⽤ text-shadow,⼀envoys⽤ filter: drop-shadow()(right⽐ render pass).
- ⼤Font size and⼩Mixed font sizes, add⼊subpixel edgeright⽐picture.

### Human observation and suggestion tools

- Paint flashing:Whether the shaded version is redrawn frequently.
- Performance:⾸Frame loading (font download+⾸times drawn) and when scrolling Paint occupy⽐.
- Layers:Whether filter shadow triggers independent⽴Composition layer.

### Acceptance criteria

- The fonts are clear,hinting normal,⽆wrong cut fallback;
- variable fontParameter changes remain unchanged⻓frame;
- filter shadow with text-shadow Vision⼀Sincerely⽆Abnormal performance crash.

### Optional variants

- Yan⾊font (COLR/CPAL, CBDT/CBLC, SBIX)and emoji rightAccording to.
- closure/Turn on subpixel anti-aliasing⻮systemright⽐(⼈⼯Record).
