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

test case 2:Grid grid with Subgrid subgrid layout

Test purpose: verification Chrome right CSS Grid Grid layout and its subgrids (Subgrid)Feature support,Ensure nested grids follow the orbit defined by the parent gridrighttogether.Pass this test,You can discover the typesetting accuracy of the browser under multi-layer grid layout,And whether the child grid correctly inherits the column width of the parent grid/Row height definition,Achieve cross-parent-child hierarchyrighttogetherlayout .

Testing Features: Using Modern CSS Grid layout (such as display: grid),The outer grid defines several columns and rows (including fixed width and adaptive fr etc.) and name the grid lines. Inner elements span multiple grid cells of the outer grid and are set to display: grid Enable subgrid properties (e.g. grid-template-columns: subgrid),Inherit column definitions from parent grid. The layout includes grid nesting, grid line naming, and grid gaps (gap)and media query adjustments (such as changing the number of columns in narrower viewports), etc.

For your referencetest casedesign:The page body contains a grid container with a three-column layout(For example, the left column, Middle main content area and right column).There is a nested container element within the main content area,Multi-column range spanning main grid(For example, a column line that spans both the middle and right columns).The nested container itself is set to Grid and enable Subgrid,Make its internal children accessible directly using the parent grid's column trackrighttogether.for example,The parent grid defines the column width ratio,Elements within nested containers pass Subgrid with parent column linerighttogether,thus visually aligning with the entire page grid.The page can contain multiple elements to test how the subgrid behaves in different scenarios(For example, an element uses Subgrid righttogetherList,Another one uses Subgrid righttogetherOK).

Reference usage: First check that the layout matches expectations: elements inside nested grids should align precisely to the parent grid's column/row boundaries with no misalignment (inner element edges should coincide with outer grid lines). In Chrome DevTools, enable Grid Overlay to show grid lines and confirm the child grid tracks overlap with the parent's. Resize the window or trigger media queries to ensure the subgrid layout stays consistent as the parent grid changes. For performance, watch layout time on first render (large grids may add some first-paint cost) and look for delays when adjusting the layout. Confirm that enabling subgrid does not introduce layout glitches or crashes (subgrid is a newer Chrome feature and should be validated for stability).
