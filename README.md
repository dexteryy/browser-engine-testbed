# Browser Engine Testbed

English navigation entry: `en/index.html`. Chinese navigation entry: `cn/index.html`. The project supplies a unified navigation and search across two suites of test cases. It is intended to validate a new browser engine against modern CSS layout/rendering features, cross-engine compatibility, and multimedia scenarios.

## Structure

- `en/layout-and-rendering/`: Modern CSS layout and rendering test cases.
- `en/compatibility/`: Cross-engine compatibility and media test cases.
- `cn/layout-and-rendering/`: Modern CSS layout and rendering test cases (Chinese).
- `cn/compatibility/`: Cross-engine compatibility and media test cases (Chinese).

## Access & Usage

1. Open `en/index.html` (locally or via a server). Use `?suite=layout` or `?suite=compatibility` to jump directly to a suite.
2. Suites and categories can be searched and collapsed/expanded on the navigation page. Click a card to open the corresponding test page.

## Development Notes

- No frameworks are used—pure HTML/CSS/JS.
- Test case designs are documented in each directory's `prd.md`.
