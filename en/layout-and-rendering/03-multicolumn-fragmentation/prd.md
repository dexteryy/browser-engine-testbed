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

test case 3:Multi-column layout (Multicolumn)Column with content

Test purpose: evaluation Chrome right CSS Support for multi-column layouts, as well as rendering correctness and performance when a large amount of content is divided into columns. This test focuses on automatic separation of text and elements in multiple columns (fragmentation)Check whether page breaks, column spacing, etc. are as expected, and observe the browser's first rendering time and scrolling performance in complex column scenarios.

Test Features: Use CSS Multi-column layout properties such as column-count and column-width Define a fixed number of columns or column widths,column-gap Set column spacing, and rules to avoid splitting elements across columns (e.g. break-inside: avoid prevent elements from breaking between columns). Contain block-level content such as paragraphs of text and images, as well as elements that need to be maintained as a whole (such as entire phrases or complete pictures) for testing Chrome rightContent segmentationandavoidofdeal with.optionally contains column-span Attributed elements (such as headers that span all columns) to test the layout of cross-column elements.

for your informationoftest casedesign:There is a multi-column container in the page(For example, the width is fixedof<div>`),Applications such as column-count: 3 or column-width: 200px of CSS,Make its internal text content automatically divided into three columns for display.Place long continuous text in the container, some picturesandsubtitle.for some elements(Such as the beginning of each paragraphofsubtitleorwhole picture)set up CSS property break-inside: avoid,to ensure they are not split into different columns.Also add a span across multiple columns at the top of the containeroftitle element,use column-span: all(if Chrome Supported) so that it occupies the entire width of the multi-column container.

for your informationoftest caseusemethod:After loading the page,Check if text is distributed across multiple columns as expected,The heights of each column are roughly balanced and there is no missing content..special attentionset upTo avoid disconnectionofelement:Make sure they all appear in a single column(If a picture is too long and cannot fit into the current column,should automatically move to the top of the next column),No half of the content is cut offofCondition.Confirm column spacing(column-gap)Consistent and equal to the set value,between columnsofdivider(ifuse column-rule oftalk)Render correctly.scroll page,Observe if there is any noticeable delay when entering new column contentorStuck and stopped.rightfor performance,Available at DevTools of Performance Record the first rendering time in the panel,Especially in long text columnsofscene,observe Chrome The typesetting engine spends time splitting paragraphs into multiple columnsoftime.if needed,Draw flicker can be enabled by(Paint Flashing)View the contents of each column as you scrollofRedrawCondition,to evaluate multi-column layout on scrollofPerformance .Confirm that there are no typographical errors in the entire multi-column layout,The columns are in the correct order(Generally from left to right,oraccording to writing-mode direction), visually coherent and smooth.
