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

test case 9:SVG Image embedding and citation methods

Test purpose: verification Chrome right SVG Graphics are embedded in different ways (inline, external reference,CSS background) and compare their differences in style control and performance. Through this test, ensure that various SVG Both usages can correctly display vector images, and their respective characteristics are such as CSS Controllability, zoom clarity, etc. are as expected.

Test characteristics: covering three common SVG How to use:

- inline SVG:directly in HTML embedded in`<svg>`and its child elements. This makes SVG become DOM part of the page CSS Can be selected SVG Internal elements are styled,SVG You can also define your own styles internally.
- external SVG Quote: via`<img src="image.svg">`loadexternal SVG file, or use`<object>`/`<embed>`Label. In this way SVG will not expand to DOM Nodes, internal elements cannot be paged CSS Select directly.
- CSS background SVG:exist CSS used in background-image: url(image.svg)Will SVG dobackgroundImage applied to an element.This is similar to,SVG does not appear directlyexist DOM , presented only as an image resource.

for your informationoftest casedesign:The page is divided into three parts to display the above three types of SVG Embedding means:

1. inline SVG:HTML directly contains a`<svg>`Graphics (such as a simple drawing of a red circle and black rectangle SVG),and add to one of the elements class(If given a circle class="dot").existpage CSS in definitionrightShould class selector style(For example.dot { fill: green; })Change the fill color of this element.
2. external SVG Quote: use`<img src="example.svg" alt="ExampleSVG">`insert oneexternal SVG document(content andinline SVG resemblance). No special ones CSS,make it press SVG its own width and height or viewBox Rendered at default sizes.
3. CSS background SVG:There is an element,existThat CSS used in background-image: url(example.svg)Set up the same as above SVG doforbackground.pass width/height or background-size controlbackgroundFigure shows size.

three ways SVG imageexistVisually should be basically the same,Side-by-side display for easy comparison.inline SVG The round shape due to the page CSS The role should appear green, while the referenced SVG Keep the original red color (unless SVG Internal style modification),background SVG then according tobackgroundProperty rendering.

for your informationoftest caseHow to use:Check three types at the same time SVG rendering:Make sure they are all clearly displayed and completeofgraphics.inline SVG Internal elements are affected by the page CSS Influence,should happen expectedofstyle change(Like a circle changing from red to green),andexternalof SVG Content is not covered by the page CSS interference,Color should be left as is,Realize the difference between the tworightCompare.background SVG should appear correctlyexistelementbackgroundarea,no croppingorstretch deformity,If set background-size,Check if its scaling is proportional. available DevTools verify:existelementYou can see it directly in the panelinline SVG of DOM Structural and element properties, while only one node can be seen (internally SVG invisible),backgroundplansdofor CSS Property display.enlargepageorCheck high DPI Next, confirm SVG imageexistMaintain vector graphics in all modesofclarity(No pixel blur).Performance,if needed,CanComparecompareinline SVG andexternal SVG ofdifference:For examplereuse same SVG hour,externalReferences can be cached by browsers,andrepeatedlyinlinewill increase HTML size.existThis test usesofSmall SVG The following differences can be ignored, but still verify Chrome rightEach methodofloadrenderingNo abnormality.Make sure there are no occurrences such asexternal SVG Unableload, background SVG Problems such as not showing up.
