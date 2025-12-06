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

test case 8:Complex selector and interactive state layout

Test purpose: evaluation Chrome to complex CSS Support for selectors and their behavior in triggering style changes upon user interaction ensures that e.g.:has(), :focus-within Wait for the advanced selector to take effect correctly and observe the DOM Performance impact of style recalculation on state changes. This test verifies the browser's compatibility with relational selectors and nested selectors, as well as layout under user clicks, focus, etc./Are instant updates of styles correct and efficient.

Test Features: Using Complex CSS Selectors and pseudo-classes, including: parent selector:has()(Chrome Now supported) change the style of the parent element according to the state of the child element,:focus and:focus-within Used to apply styles when an element or its children receive focus, as well as other structural pseudo-classes such as:nth-child, :not()combination. Use pure CSS Achieve interactive effects, such as through:has(input:checked)Use hidden checkboxes to switch layouts (pure CSS accordion/folding panel), or use:focus-within Highlights the container border of the form when it has focus. All interactions are without the aid of JavaScript,completely dependent on CSS Status selector.

for your informationoftest casedesign:The page contains an interactiveofcard list.each card(`<div class="card">`)There is a hidden checkbox inside`<input type="checkbox" class="toggle">`and"Expand details"as a trigger, and a details panel`<div class="details">`.In initial state.details pass CSS set up display: none hide.CSS Use the parent selector to implement expansion logic:.card:has(.toggle:checked) .details { display: block; },When the user clicks to select the check box, the card it is on satisfies:has conditions, thus internal.details show. another definition.card:focus-within { outline: 2px solid #0066cc; },Makes the card border highlight when any element within the card receives focus. The page also contains some deep selector combination tests, such as.list >` li:nth-child(odd):hover >` .title::after,for verification Chrome to complexSelector syntaxofparseandapplication.

Reference usage: After loading the page, first verify the static styles: complex selectors should already apply (for example, odd list items have special title styles). Then interact: click each card's "Expand details" label (toggling the checkbox); the hidden details in that card should appear immediately and collapse on the next click—observe whether `.card:has()` rules take effect right away with no state desync. Use Tab to move focus between cards and confirm that when focus enters a card, the container is highlighted with a blue border and the highlight disappears after focus moves out, matching :focus-within. Quickly switch between cards to ensure layout changes are smooth and not jumbled. Performance: because :has() may add style matching cost when the DOM changes, large or fast-changing DOMs could be affected. In this test, record in DevTools Performance while rapidly toggling details to view Recalculate Style time and gauge Chrome's optimization. With few elements the impact should be negligible; if style calculation is noticeably expensive, note that overly complex selectors should be used cautiously. Overall, confirm complex selectors work correctly in Chrome and interaction-driven style/layout changes are accurate without missing or delayed styles.
