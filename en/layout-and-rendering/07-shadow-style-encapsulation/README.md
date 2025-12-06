# test case7:Shadow DOM style encapsulation isolation

> Goal: Verify Chrome right Shadow DOM style encapsulation (Style Encapsulation)Is it correct to ensure that the internal styles of the component and the external page styles are isolated from each other.

## Directory structure
- `index.html`:Entrance and navigation.
- `01-basic.html`:Basic isolation.
- `02-slotted.html`:slot Distribute with `::slotted`.
- `03-host.html`:`:host` selector.
- `04-performance.html`:Multiple instances and styles isolate observations.
- `base.css`:unified UI style.
- `global.css`:simulation"global interference pattern".

## How to use
1. in the latest Chromium The browser opens any page.
2. Use the toolbar at the top of the page to switch"global interference pattern"and"Visual outline".
3. Open DevTools Expand the respective definition elements and check Shadow Root within the style scope.

> Comments in the code are all in English; page text is all in Chinese.
