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

## R&D side⽤example 13 ｜Panoramic video (360/180)Mapping and sampling

> Available from existing⽹⻚Select a representative sample; or the most⼩ JS control `<video>` + WebGL ball⾯stickers.

### Test target

Evaluate equirectangular Waiting for panoramaSeeFrequentball⾯/Halfballunder the stickersamplingand synthesis cost,observeSee⻆Stability and texture distortion when panning.

### Features involved

`<video>`, WebGL texture sampling,⽴⽅body/ballbody⼏Ho, linear/nearest neighbor,mipmap.

### Page structure and key points

- full screen WebGL canvas,WillSeeFrequency texture mapped toball⾯medial;
- Simple UI switch FOV, sampling mode;
- Slow low frequency⾃dynamic rotation (⽆need⽤⼾lose⼊).

### Human observation and suggestion tools

- Screen: Extreme stretch and whether the seams are obvious;
- Performance:play+sampling+Synthetic frame stability;
- Layers:Canvas composition layer and video texture update status.

### Acceptance criteria

- ⽆Tears and obvious moiré;
- See⻆The changes are stable and there is no cycle lag.

### optional variablebody

- ⾼Frame rate panoramic source;

- ⾼resolution 8K Performance records under the source.
