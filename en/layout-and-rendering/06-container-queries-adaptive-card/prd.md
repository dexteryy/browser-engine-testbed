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

test case 6:container query (Container Queries)adaptive components

Test purpose: verification Chrome right CSS Support for container queries and the ability for components to adaptively layout based on the dimensions of their parent container .Different from media query pinrightentire viewport,Container queries allow within the same page,Components in different areas respond to the size of the container in which they are located.,achieve more sophisticated"Micro-responsive"design. Pass this test to ensure Chrome Correctly apply container query rules so that components can be properly laid out in various container contexts and observed in the window/Performance of style switching when container size changes.

Test Features: Use CSS Container query syntax, including setting on container elements container-type(like inline-size)and container-name,as well as@container Write conditional styles inside rules.examplelike,When the container width reaches a certain threshold,Change the arrangement or style of child elements.Testing involves modern CSS Function,likeSwitch via container query inside component Flex Layout direction, adjust font size or display/hide certain elements.Emphasis on container query phaserightIndependence from media inquiries:Multiple containers can exist on the page at the same time,Different styles are triggered when each condition is met.,To verify their non-interference working mode.

For your referencetest casedesign:The page contains twoFunctionSame but different sizescomponentsRealityexample(examplelike"card card"components),placed in containers of different sizes.A container for a wide area(ComparelikeMain content area,Larger width),The other is a narrow area(Comparelikesidebar,smaller width).eachcomponentsinternalAll layouts can be adjusted according to the container size,Comparelikeinclude an imageandsome text description:Use side-by-side layout in wide containers(pictureandText side by side),Change to top-down stacking layout in narrow containers(pictureOn top,Text below).By setting the container container-name and in the component CSS used in@container Rule detection container width,Define threshold(examplelike 400px)The above uses horizontal layout,The following uses vertical layout.In this way, under the same viewport,in large containercardWill be laid out horizontally,And in a small containercardvertical layout.

For your referencetest caseHow to use:After opening the page,Observe inside two containers at the same timecomponentspresentation:Confirm that they display different layouts based on the size of their respective containers(in large containercomponentsfor landscape layout,in small containercomponentsFor portrait layout),Meets the expected effect of container query.Then manually adjust the browser window width,Note that when the container size crosses the threshold defined by the container query,correspondingcomponentsWhether the layout of(examplelikeWhen the window becomes narrower causing the originally wide container to become smaller,internalcardSwitch from landscape to portrait).This should all be independent of the page's overall media query;That is, no needentire viewportreach a certain width,As long as a certain container size meets the conditions,ThatinternalcomponentsIt will switch the style on its own.Available at DevTools View the actual size of the container in the Elements panelandname,as well asrightShould@container Whether the rule is triggered to apply. In terms of performance observation, when resizing the window causes the container query to be triggered,Chrome Style recalculation responserightlocalization, High efficiency.use Performance The tool records the container size change process, checks the style calculation overhead, and pays attention to whether there is any obvious lag. Confirm that the container query is in Chrome The work is stable, and there is no situation where the matching style is not applied or is applied incorrectly.
