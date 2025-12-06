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

test case 10:Blend Mode Overlay Effects and Compositing Layers

Test purpose: verification Chrome right CSS Blend Mode (mix-blend-mode)ofRendering support and layer handling,Includes elements and background contentofIs the mixed display correct?,and blending modesrightpage composition layerofInfluence .pass this test,Can confirm differentBlend Mode (like Multiply, Screen etc.) as expected, and observe whether the browser creates appropriate composite layers for blended elements to ensure performance.

Test Features: Use CSS mix-blend-mode This property overlays an element's content with its background in a specific blending mode. For example test mix-blend-mode: multiply(Multiply) or screen(Color filter) and other typical modes. The page contains overlapping elements to produce a mixed effect: the underlying element has a solid color background, and the upper element has a semi-transparent color or contains a graphic, and applies a non- normal of blend model. May also involve isolation Properties to test isolationrightmixed resultsofInfluence(Optional).through differentBlend Mode (righttext, images etc.)ofCombinatorial testing Chrome Whether each mixing formula is implemented correctly.

for your informationoftest casedesign:The page has a large background element(examplelike`<div class="bg">`)Fill solid blue.A smaller area is placed above itof,Background set translucent red(examplelike background: rgba(255,0,0,0.5)),and apply mix-blend-mode: multiply.In this way, the overlapping area between the two should appear blue and red after multiplication.ofcolor(Expect a purple tint),non-overlapping portion blend-box Still showing translucent red superimposed on the background color of the page. Available at blend-box Place some more text inside to observe the text and backgroundofmix(likewhite text in multiply mode will change color and blend into the base color). If necessary, you can also add an element setting isolation: isolate to verify the hybrid isolation effect.

for your informationoftest caseHow to use:First confirm the visualmixEffect:blend-box overlap with bottom layercolorshould be expectedofmixcolor,The non-superimposed part still maintains its own translucent red color.mixBorders should be smooth,No exception occurredofRibboning or flickering.Then use DevTools ofrendering tools,enable"Layer Borders"options, observations blend-box Whether the element is promoted to individualofComposition layer(Its border should appear orange/olive edge ),because of abnormalmixmodelofelements will create newofDraw layer .Then keep an eye on performance: since hybrid computing is typically performed by GPU Completed during the synthesis stage,singlemixelementrightFrame rateInfluencevery small.Available at Performance Panel recording when scrolling or content changesofFrame rate,Verify that even if it existsmixmodel,Page redraw overhead is not significantly increased.likeNeed to test extreme cases,Can be increased blend-box Area or number and observe whether frame rate drops occur. Overall verification Chrome right mix-blend-mode The support is good, the overlay is rendered correctly, there is no misalignment or sequence error, and there is no obvious loss in performance.
