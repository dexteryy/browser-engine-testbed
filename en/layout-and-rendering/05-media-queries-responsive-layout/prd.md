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

test case 5:Media queries responsive layout

Test purpose: verification Chrome for CSS Media Inquiries (Media Queries)support, and whether responsive layouts applying different styles can be rendered correctly under different viewport sizes. Through this test, you can ensure that there is no layout confusion or flickering when the page switches layout based on breakpoints on wide-screen and narrow-screen devices, and observe the performance when switching layouts.

Test Features: Use@media Media queries define multiple breakpoint styles. For example, for different window widths (such as min-width or max-width condition) switch CSS:Use multi-column layout, larger spacing, and horizontal navigation for desktop width; use single-column stacked layout, larger fonts, and vertical navigation for mobile width. Involved CSS Features include layout adjustments (such as changing display typeor flex-direction), Make elements visible (using display: none Hide certain elements at specific breakpoints), typography adjustments (such as font size changes), etc. Completely dependent on pure CSS Media queries are made responsive without JavaScript participate.

For your referencetest casedesign:The page contains header navigation, Three parts: main content area and sidebar.pass CSS Media queries, when viewport width is greater than 1200px When , set the page to a two-column layout (sidebar and main content side by side, navigation menu expanded horizontally); when the width is smaller than 800px hour,Switch to single column layout(Move sidebar downorhide,Navigation becomes vertical list).The middle width range can set another style(For example, on a tablet device, the sidebar is displayed but the navigation remains horizontal.).Page elements will adjust layout and style under different breakpoints,For example, narrow screenhourhidecertain secondary sectors, The navigation menu collapses into a hamburger button, etc..

For your referencetest caseHow to use:exist Chrome Gradually scale the window width inoruse DevTools device emulator,Observe page layoutexistWhether the expected change occurs at the preset breakpoint.Pay attention to whether the breakpoint switching moment is smooth:Style changes should take effect immediately,There is no obvious flickering during layout reflow.orOverlapping content.Verify layout details under each breakpoint:For example, is the sidebar in narrow screen status correct?hideorMove below content,Whether the navigation menu switches to vertical list display.Check pictures, Whether text, etc. are automatically resized according to the new container widthornewline.Performance,recordable window resize Browser performance during the process: When dragging the window frequently,Chrome Media query styles should be applied efficiently,There should be no lagorcollapse.Also possiblepassmonitor CLS(Cumulative layout offset)Metrics ensure layout switching has minimal impact on visual stability.Confirm that the page layout is normal under different screen sizes,No element misalignment, overfloworinvisible situation.
