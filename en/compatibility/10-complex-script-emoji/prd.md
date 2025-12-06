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

## R&D side⽤example 10 ｜Complex scripts and Emoji(Arab/Southeast Asia/Emoji)

### Test target

Examine complex scripts shaping/Two-way⽂book/Combined subscripts and colors⾊ Emoji Raster and composite representations of; focus on giant emoji and⽂bookWhen mixingofRedrawandlayer processing.

### Features involved

RTL and Bidi control characters, Arabcontinuous writing, Southeast Asiacombination⾳mark,Emoji ZWJ sequence,font-variant-ligatures.

### Page structureandMain points

- three columns:Arabparagraph(Contains numbersandPunctuation mixed arrangement), Southeast Asiaparagraph(manycombinationAttachment), Emoji ⼤Word list (contains a variety of ZWJ sequence).
- Provided per column"static + slight transparency flicker"of CSS animation (⼩amplitude, low frequency)⽐Is it better to make progress?⼊Composition layer or trigger Paint.

### manual observationandSuggestion tools

- Screen:broken letter, continuous writingandTwo-waysorted correctly;emoji ⽪skin⾊/Gender synthesis is correct.
- Paint flashing:⽂bookDoes the slight transparency animation still trigger?⼤⾯Accumulation and redrawing (ideal progress)⼊composition layer).
- Performance:while scrolling Paint occupy⽐.

### Acceptance criteria

- ⽆Characters are lost or misplaced;Emoji The synthesis is correct and⽆⾊Block torn.
- Light animation does not cause noticeable frame drops.

### Optional variants

- pole⼤Font size emoji(>256px)andbackground blend;
- complex Bidi Paragraph interpolation⼊inline diagram⽚.
