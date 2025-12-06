You are a professional web front-end developer tasked with creating a series of demos for a new browser engine as test cases to evaluate its compatibility and performance in web rendering.

This document provides the requirements for these test cases. Some include reference designs (with usage); others do not. In all cases, design specifically to meet the requirements and provide working code.

Your designs and implementations must follow all of these rules:

1. Each test case consists of one or more standalone pages, each page dedicated to a single testing need.
2. Each page must use only raw HTML, CSS, JS, and Web APIs—no frameworks or libraries (e.g., React, Vite, npm).
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

Test Case 1: Flexbox layout and dynamic reflow

Test objective: Verify that Chrome parses and renders Flexbox layouts correctly, including how nested flex containers adjust layout when content changes. Focus on whether layout recalculation (reflow) remains correct without overflow or overlap when child sizes change dynamically (e.g., a hovered element expands).

Test features: Use the CSS Flexbox model (`display: flex` containers) with main-axis (`justify-content`) and cross-axis (`align-items`) alignment; nested flex containers (a flex item that itself is a flex container); use CSS pseudo-classes such as `:hover` to change child `flex` properties (e.g., `flex-grow`) to simulate dynamic size changes; no JavaScript, rely solely on CSS interactions for layout changes.

Reference test design: The page has a main container set to `display: flex` with multiple children. One child is also a `display: flex` container with its own nested elements to exercise multi-level flex layouts. Children differ in width/height (e.g., text blocks and images) and initially share space evenly or by a set ratio per Flexbox rules. Add a `:hover` style to one child so that when hovered its `flex` value changes (e.g., `flex: 1` to `flex: 2`), letting it occupy more space while siblings compress.

Reference usage: On load, confirm flex children align as expected (e.g., vertical centering or top alignment) with correct spacing. Hover each interactive child in turn to see if others smoothly reflow to fit the new size without overlap or overflow. Use Chrome DevTools “Layout Shift Regions” (repaint after enabling; shifted areas are highlighted purple) and the Performance panel to inspect computation costs triggered by hover-induced reflow (should be localized, not whole-page). Ensure rendering stays correct after each reflow without flicker or tearing.
