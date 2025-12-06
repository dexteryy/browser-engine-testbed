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

test case 12:CSS mask(Mask)Effect and performance

Test purpose: verification Chrome right CSS mask attribute (mask/mask-image wait)support,and maskrightThe impact of element visible area and rendering performance.pass this test,Check if the element's shape clipping is as expected after using a mask(Only the specified shape area is visible,The rest is transparent),and observe Chrome Whether to create separate composition layers for masked elements to optimize drawing .

Test Features: Use CSS mask-image or abbreviation mask Property applies a vector or image mask to an element. For example using a SVG shape as a mask pattern, or use CSS Gradient as mask,Implement non-rectangular element visible area.Test content includes:Mask cropping accuracy(Elements are only displayed within the mask shape), Masked transparent gradient effect, and maskCombined display with background.Follow the maskrightPotential impact on performance,For example, whether the mask element is triggered GPU Speed ​​up or increase redraw burden.

For your referencetest casedesign:There is a block-level element with a background on the page(For example`<div class="avatar">`,A photo or solid color filling can be placed inside), by CSS set its mask-image attribute reference SVG Mask the image (e.g. a white circular pattern) and use mask-mode: alpha(Default) Press alpha Apply mask to channel.CSS Adjustment mask-size is the same size as the element,mask-position: center Center the mask pattern overlay.so,This element finally appears as a circular avatar effect:Circular area to display photos,The corners are hidden by masks.forrightCompare,An unmasked element of the same size can be placed next to it as a reference.The background at the bottom of the page is a significantly different color,In order to clearly see that the hidden part of the mask is truly transparent(Can reveal the background behind).

For your referencetest caseHow to use:After the page loads,Check the appearance of masked elements:Only content within the circle should be displayed,The outer area is completely transparent,Reveal the underlying color behind.Rounded edges should be smooth,No jagged or hard edges(SVG Masking makes edges anti-aliased).If the mask pattern contains a semi-transparent gradient,Observe whether the gradient fade effect on the edge of the element is correct..rightCompareUnmasked reference elements,Confirm that the mask only affects the target element and not the surrounding layout.Then in DevTools Element panel to view the element's CSS properties, confirm mask-image etc. have taken effect, and the element may be promoted to a compositing layer on the rendering hierarchy (using"Layer Borders"Check whether there is an orange border logo ),because Chrome rightElements with masks are usually composited separately .Scroll or trigger other animations on the page (if any), and pay attention to whether abnormal redrawing occurs in the mask element part. Generally, static masks will not continue to consume performance, but the first drawing of the mask may be slightly slower than that of ordinary elements. You can Performance Panel views the element for the first time Paint time consuming,If it is within the acceptable range, it means that the performance is normal.Finally, verify various browser behaviors:For exampleAdjustmentwindow size or in different DPI Off-screen, the masking effect maintains the correct proportions; on Chrome There is no misalignment of the mask area, content leakage (content exposed outside the mask), etc. bug,Everything performed as expected.
