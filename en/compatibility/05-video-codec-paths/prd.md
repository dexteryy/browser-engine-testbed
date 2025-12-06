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

## R&D side⽤example 05 ｜ Video Codec and rendering path coverage

> most⼩ JS Dependencies: Select/Switch between different encoding sources; you can use⽤Same domain static resources.

### Test target

in different encodings/encapsulation (H.264/H.265/VP9/AV1 etc.) and resolution/Under the frame rate, observe the hardware decoding,⾊color conversion
(YUV→RGB), Zoom with overlay of presentation path differences.

### Features involved

`<video>`, playsinline, preload;Multiple encodings and resolutions; colors⾊space/⾊degree sampling difference (4:2:0/4:2:2).

### Page structure and key points

- list⻚exhibition⽰like⼲ `<video>` ⼩window (quiet⾳, ⾃(automatic playback, looping), covering multiple encodings and multiple resolutions.
- Details⻚Full screen playback same as⼀source,testZoom with overlay.
- UI only CSS(Choose a different source).

### Human observation and suggestion tools

- DevTools → Media ⾯Board: View decoder type (hardware/software),⾊colorspace.
- Performance:Record and play 10s,Observe the main thread load vs. GPU synthesis.
- Screen observation: Whether sharpening occurs when zooming/Fuzzy exception,⾊partial or⾊bring.

### Acceptance criteria

- Can stabilize hardware decoding (can⽤ Media ⾯Board confirmation), playback is smooth⽆Dropped frames.
- Zoom/full screen⽆⾊Color and verticality⽐mistake.
- How realexampleSimultaneous playback does not cause obvious frame drops.

### Optional variants

- HDR Source and SDR source pair⽐(likeequipment/system link⽀hold).
- ⾼Frame rate (60/120fps)The rendering stability of the source.
