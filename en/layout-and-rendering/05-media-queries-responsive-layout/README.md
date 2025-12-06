# test case5:Media queries responsive layout

**Target**:verify Chrome right CSS Media Inquiries (Media Queries)support, and whether responsive layouts with different styles can be rendered correctly and switched smoothly under different viewport sizes.

## Breakpoint design
- move:`< 800px`
- flat:`800–1199px`
- desktop:`≥ 1200px`

## Test points
- pure CSS Media queries control layout and style: switch under different breakpoints `display`/`flex-direction`, Font size, spacing, and element visibility (e.g. `display: none`).
- Navigation: collapsible vertical list (hamburger button) on mobile, tablet/Desktop in landscape orientation `flex` menu.
- Layout: single column for mobile; tablet/The desktop is a double column (content + sidebar).
- Raster: cards from 1 → 2 → 3 Column adaptive changes.
- CLS:pass `PerformanceObserver` Dynamically display the cumulative layout offset (only observe, do not change the layout).

## How to use
1. exist Chrome Open `index.html`,Drag the window width or use DevTools Device emulator.
2. Observe whether the layout at the breakpoint switch takes effect immediately without flickering or overlapping.
3. When the screen is narrow, confirm that the sidebar is hidden, the navigation is foldable, and the list is vertical; medium/The sidebar is displayed in widescreen and the navigation is laid out horizontally.
4. Check"Show layout borders"Can assist the observation box model (does not affect layout).
5. Check the top status bar: viewport width, current breakpoint (JS andpure CSS dual instructions),CLS Accumulate; click"resetCLS"Can be cleared.

## compatibility
- TargetBrowser:up to date Chromium(Chrome).
- use `:has()` Implement debugging overlays;Chrome Already supported.likeexistProblems with older versions,Only affects debug display,Does not affect the responsive core logic.
