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

test case 4:Vertical writing mode and text orientation

Test purpose: verification Chrome In vertical writing mode (vertical writing mode)Typesetting performance below, including the correctness of text direction, character rotation, and layout positioning. Through this test, you can check whether the rendering of different languages ​​(such as Chinese and English mixed) in vertical mode meets expectations, and find that the browser vertical-rl Are there any compatibility issues or typographical errors in other modes?

Test Features: Use CSS property writing-mode Set the container to vertical layout, e.g. writing-mode: vertical-rl(Text top to bottom, lines right to left) or vertical-lr.combine text-orientation propertyControl character direction(as defaultof mixed Makes Western characters rotated and East Asian characters upright). The page uses a mix of Chinese, Japanese and Korean characters (which should remain vertical in vertical layout) and Latin letters (which should be rotated 90 horizontal display), as well as punctuation marks, numbers, etc., to test their position and shape under vertical layout. You can also include a container in vertical writing mode with other layouts (such as the container itself in Flex or Grid layout) to test alignment between different writing modes.

for your informationoftest casedesign:A main test area is set up writing-mode: vertical-rl,It contains a text in mixed Chinese and English. For example, the paragraph contains Chinese sentences, English words, numbers, brackets and other symbols. You can add line breaks and different block-level elements (such as`<p>`paragraph and`<ul>`list) to observe the arrangement in vertical mode. Place a text area in normal horizontal writing mode next to it to facilitate comparison of the differences between the two modes. In the vertical text area, for English words, you can apply CSS property text-orientation: upright or sideways Test it to see the difference.

for your informationoftest caseHow to use:Visual inspection within vertical layout areaofIs the text flow correct?:Text should be arranged from top to bottom,Paragraph order advances from right to left(for vertical-rl model). East Asian characters such as Chinese should be displayed upright, and Latin characters such as English should be rotated vertically (unless using text-orientation: upright forced upright).Check punctuationofLocation,For example, period, The comma should be in the lower right corner of the character in vertical layoutorAfter proper rotation,Chrome These details should be handled correctly.Observe different elementsofAlign:For example, whether a multi-line paragraph is at the top vertically?Alignneat,List bullets in vertical modeofLocationIs it normal?.scroll the pageorResize window,Make sure to write verticallyofThere is no misalignment of the contentoroverlapping.If the vertical container is embedded within other layouts,examine Chrome Whether the size and position of the container are calculated correctly (Chrome of LayoutNG Provides better support for vertical writing modeofsupport,Fixed many issues in vertical modeofPositioning problem ).Confirm that the entire vertical text area can be read properly,No characters are rendered in the wrong orientationorobscured by croppingofquestion.
