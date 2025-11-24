# Browser Engine Testbed

中文导航入口位于 `cn/index.html`，提供两套测试用例的统一导航与搜索。项目定位是为新浏览器引擎验证现代 CSS 布局与渲染特性、跨引擎兼容性与多媒体场景。

## 目录结构

- `cn/layout-and-rendering/`：现代 CSS 布局与渲染测试用例。
- `cn/compatibility/`：跨引擎兼容性与媒体测试用例。

## 访问与使用

1. 打开 `cn/index.html`（本地或经服务器），可通过 `?suite=layout` 或 `?suite=compatibility` 直接定位套件。
2. 套件与分类在导航页可搜索与展开/收起，点击卡片直达对应测试页面。

## 开发说明

- 不依赖任何框架，纯 HTML/CSS/JS。
- 测试用例设计参见各目录里的 `prd.md`
