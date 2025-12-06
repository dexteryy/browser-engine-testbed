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

## R&D side⽤example 14 ｜overtake⼤Resources and MAX_TEXTURE_SIZE boundary

### Test target

Verify the diagram⽚/Sprite ruler⼨close to orovertakePass GPU MAX_TEXTURE_SIZE(Chromium often⻅ 4096 or more⾼)loading time, minutes⽚/⽡⽚Grating strategies and synthetic stability.

### Features involved

⼤mold background-image, CSS image-set()(Optional), multiple cuts⽚Splicing(If need to avoidovertakePassUpper limit situation), ⼤⾯product image-rendering right⽐.

### Page structure and key points

- ⻚⾯ A:The single sheet is close to the upper limit⼤Figure as background (e.g. 4096×4096,Try again later⼤).
- ⻚⾯ B:Will update⼤The sprite image is divided into equal parts⽚for many `<div>` Background stitching restoration.
- Provides scrolling and zooming viewpoints (pure CSS).

### Human observation and suggestion tools

- Layers:Observe whether the product is produced⽣overtake⼤Compositing layer, video memory usage⽤peak.
- Performance:⾸occurrences⼤Picture time⻓Frame; whether to synthesize only displacement when scrolling⽽⾮Redraw.
- Paint flashing:⼤Tujin⼊See⼝redraw area.

### Acceptance criteria

- legal ruler⼨The next rendering is correct⽆dislocation;overtakePasstime limit,Identify failure modes(null⽩/downgrade),⻚⾯not collapse;
- cut⽚SplicingSeeSleep⽆seam; seam
- Increase video memory⻓Controllable, no rendering process occurs OOM.

### Optional variants

- Different pixel formats (with transparency/without transparency);
- ⾼ DPI ⽐example(device pixels⽐ 2×/3×).
