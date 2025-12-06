
test case12:CSS mask(Mask)Effect and performance
=====================================

Directory structure
--------
- index.html                Entrance and Navigation
- 01-basic-mask.html        Base:SVG/image/Gradient mask cropping and transparency verification
- 02-gradient-mask.html     Gradient masks and translucent edges
- 03-multi-mask.html        Multi-layer masking and compositing (regressed if the browser does not support it)
- 04-performance.html       Performance comparison and compositing layer observation in animation scenes
- assets/
  - common.css, common.js   Unified styles and tool functions
  - avatar.svg              Serves as masked content"photo"
  - circle.svg, star.svg, ring.svg, soft-circle.svg  Mask shape

Instructions for use (brief description)
--------------
1. Open index.html,Go to each page.
2. The top bar and toolbar provide controls that act on elements in the test area in real time.
3. Explanations and suggested actions are provided at the bottom of the page (e.g. in DevTools → Rendering Open Layer borders / Paint flashing).
4. exist 04-performance.html Click here"start 5 Second test"Statistical frame rates, comparing the relative differences between masked and unmasked columns.

Implementation points
--------
- Only use native HTML/CSS/JS and standards Web API,No third-party libraries.
- Visual element texts are all in Chinese, and code comments are in English.
- Unified white background style: the top bar is full width, and the remaining areas have the same maximum width.
- Toolbar parameter control is real and available, and supports copying the current CSS in order to reproduce.
