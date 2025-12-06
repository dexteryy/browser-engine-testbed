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

## R&D side⽤example 11 ｜ DRM/Protected video with Overlay render path

> most⼩ JS Dependencies: pass EME Play protected content (or use⽤Protected content placeholder/Simulation flow); subject to many environmental restrictions,⻚⾯Should be downgraded⽅case.

### Test target

Verify that protected video is available⽤Whether on the platform⾛ overlay/Protect the link and evaluate the difference in synthesis and memory compared with ordinary video; observe
check in⼊/Performance when exiting full screen and picture-in-picture.

### Features involved

Encrypted Media Extensions(EME), Protected decoding, video overlay flat⾯, full screen/Picture within picture.

### Page structure and key points

- same⻚show⽰:protected video A, ⾮protected video B,resolution⼀To.
- supplyfull screen/Exit button, switch if⼲Second-rate.
- UI Mention clearly⽰Current status (protected/⾮protected).

### Human observation and suggestion tools

- DevTools → Media:View decoding and encryption status.
- Performance:observe overlay Whether to reduce synthesis/copy⻉.
  Screen: When switching⽆⿊screen/flash; window⼝move/Zooming is stable.
-

## Screen: When switching⽆⿊screen/flash; window⼝move/Zooming is stable.

### Acceptance criteria

- protected videoRenders correctly, ⽆cutscreenAfterimage;
- Enter⼊/quitfull screen/picture within pictureflatslip;
- Resources accounted for⽤reasonable (right⽐⾮protected stream).

### Optional variants

- Nosameresolutionwith frame rate;
- How realexamplesameplay when(When the system is licensed).
