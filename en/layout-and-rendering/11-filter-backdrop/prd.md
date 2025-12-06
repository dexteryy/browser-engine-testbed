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

test case 11:Filter effects and background filter performance

Test purpose: evaluation Chrome right CSS filter(filter)and backgroundfilter(backdrop-filter)EffectofRendering accuracy,and follow theseEffectrightPage redrawandperformanceofInfluence.This test is specifically designed torightVaguefilter(blur)How high-overhead effects behave in browsers: Verify that the foreground element filter and background filter have correct visual effects, and observe whether they cause frequent redraws or frame rate drops. .

Test Features: Use CSS filter propertyrightelement application imageEffect(For example filter: blur(5px)blur), and use backdrop-filter rightAfter translucent mask elementofBackground applicationEffect(For example backdrop-filter: blur(5px)).The test scenario includes: a page with long scrollable content and a translucent bar fixed at the top, set backdrop-filter: blur(5px)Make the content passing behind it blurred when scrolling; insert a picture or color block element into the text, and apply filter: blur(5px)to blur itself. Set the filter strength to medium to see the obvious effect.

for your informationoftest casedesign:The page header has a fixed positionof,Style as translucent background(For example background: rgba(255,255,255,0.8))and add backdrop-filter: blur(5px).The body section contains a list of text paragraphs long enough to produce scrolling, with an image inserted in the middle`<img class="photo">`,pass CSS set up filter: blur(5px).When the page loads header Cover the top part of the content so users can scroll the page to pass different content header rear, so as to observe the background blur effect; at the same time, the blur filter is always applied to the picture in the main text regardless of whether it is in the viewport or not.

for your informationoftest caseHow to use:First static state check:Fixed head areas should appear clearlyofVaguebackgroundEffect(Similar to frosted glass),belowofText and pictures become blurred through it ;The pictures in the text should be visible to the naked eye and the edge details should be blurry. Verify filter Take effect. Then scroll the page and pay attention to two aspects: First, the background content is passing through header Whether the blur effect is updated in real time and smooth during masking, and there are no unblurred moments; secondly, the smoothness of page scrolling. Pay attention to whether the frame rate drops or scrolling is stuck due to the application of filters. If you need to quantify, you can turn on DevTools of"Paint Flashing"(Redraw area highlighting) :If found header The area flashes green every frame during the scrolling process, indicating that the background is redrawn every frame, indicating backdrop-filter Causes a lot of repaints. Since the image itself is always still, it will generally be lifted to GPU The layer is composited to avoid redrawing, but if it is not automatically promoted, you can observe whether it is also redrawn repeatedly when scrolling. Can be opened further"Layer Borders"Check: Ideally, use backdrop-filter of header and use filter ofThe images will each become an independent composition layer. ,In this way, background redrawing and filter calculations are performed when scrolling. GPU complete, alleviate CPU pressure. In terms of performance, in DevTools Performance Recording scroll, you can follow Paint and Composite Stage time consumption;VagueThe filter is heavierofcalculate,every increase 1px The blur radius needs to consider adjacent pixels ,May become a bottleneck on low-end devices.If you observe a significant drop in frame rate,Can tryrightThe corresponding element uses will-change: transform Tips for browser optimization. Final confirmation: the filter effect is visually correct,Chrome rightforeground filterandBackground filters all render correctly,No area appearsVagueor error maskofCondition;Under reasonable optimization,scrollandInteraction is still smooth.
