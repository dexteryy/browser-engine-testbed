
# test case2:Gridgrid withSubgridsubgrid layout

- Table of contents:`02-grid-subgrid/`
- Contains pages:
  - `index.html` -- 2A:**Column direction** Subgrid Align
  - `rows-subgrid.html` -- 2B:**row direction** Subgrid Align
  - `both-axes.html` -- 2C:**dual axis (column + OK)** Subgrid Align
- Shared resources:`assets/style.css`, `assets/app.js`

## How to use
1. Use the latest Chromium Open any of these pages.
2. Adjustable top toolbar `gap`,show/Hide parent gridlines and child gridlines; available on some pages"One rearrangement takes time"test.
3. Scale window width to trigger media queries,observesubgridWhether always withparent gridtrackAlign.

## illustrate
- All pages use only native HTML/CSS/JS/Web API;The text on the page is in Chinese, and the code comments are in English; white background, uniform width layout.
- Overrides the following features: named grid lines,`fr`/fixed length/`minmax`, `gap`, `subgrid`(List/OK/dual axis), nested grids, media queries.
- Gridline visualization does not depend on DevTools:The script creates an overlay that does not interfere with the layout,and dashed lineshow**parent grid**and**subgrid**track boundaries.
- Aligncheck(2A)Will automatically comparesubgridListLine andparent gridListDo the lines overlap?,and check whether the left and right sides of the subitem fall withinsubgridline position(±1px tolerance).

