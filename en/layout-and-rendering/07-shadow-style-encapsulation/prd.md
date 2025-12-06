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

Test Case 7: Shadow DOM style encapsulation

Test objective: Verify Chrome's Shadow DOM style encapsulation so that styles inside a component are isolated from page-level CSS. Confirm that shadow content is unaffected by global CSS and that styles defined inside the shadow root do not leak into the rest of the page, keeping components rendering as expected in any environment.

Testing features: Use native Web Components (custom elements) to create a Shadow DOM. Define a custom element and attachShadow({ mode: "open" }) in the constructor; insert HTML markup into the shadow root along with a `<style>` block defining internal styles. The outer page also defines global CSS that attempts to target nodes inside the custom element (e.g., tag selectors inside the component) to test whether Shadow DOM blocks those rules. Also cover slot distribution (using `<slot>` to project external children) and selectors such as :host and ::slotted to observe scope and isolation.

Reference design: Add a custom element (e.g., `<my-element>`) whose shadow DOM contains simple markup such as `<p class="inside">Shadow text</p>` with a shadow style `.inside { color: red; }`. The page defines global CSS like `.inside { color: blue; }` and selectors such as `my-element p { color: blue; }` to test whether global styles affect shadow content. A normal `<p class="inside">Regular text</p>` in the light DOM serves as a comparison for external styles. A small JavaScript snippet registers the custom element class and attaches the structure to its shadow root (purely for test content, no extra interaction logic).

Reference usage: After loading the page, inspect the custom element's internal styles. The shadow paragraph should render red (from the shadow styles) rather than inheriting the global blue, showing that page CSS does not affect shadow internals. The normal paragraph should render blue, showing global styles apply to light DOM and shadow styles do not leak out. In Chrome DevTools, expand `<my-element>` to inspect the shadow root and confirm styles are scoped to shadow elements. If the custom element uses `<slot>` to project external content, verify slotted nodes inherit external styles, not shadow styles. For performance, place many instances on the page to confirm style calculations remain isolated and conflict-free; Chrome's Shadow DOM encapsulation should stay efficient with many components. The goal is to confirm correct style isolation with no unintended leakage or overrides between internal and external styles.
