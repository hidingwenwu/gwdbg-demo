# Debug Workbench Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 D 版原型升级为大屏手机画布、10 型号独立分组、E50 风格持续连接调试工作台，并补齐 A 系列、服务器、空调管理和 FD01G 专属交互。

**Architecture:** 以 `product-data.js` 描述型号能力，以 `connection-state.js` 统一会话连接状态，以 `workbench.js` 驱动快速配置、设备详情、侧栏、设置和空调管理。E50 与 FD01G 保留独立页面内容，但复用统一画布、连接和导航组件。

**Tech Stack:** 静态 HTML5、CSS3、原生 JavaScript、Node.js 静态断言、Playwright Chromium。

## Global Constraints

- 原型目标目录为 `D:\workspace\gwdbg-demo`，不修改参考工程。
- 预览画布采用 430 x 932 大屏手机比例，长页面在画布内滚动。
- 只有 E50 支持 4G；E50 4G 模式不显示退出远程调试。
- 蓝牙返回不自动断开，只有明确确认断开才清除会话。
- 不显示原型说明、教学文字或过程注释。
- 目录不是 Git 仓库，不初始化 Git、不提交。

---

### Task 1: 需求回归与产品能力数据

**Files:**
- Modify: `tests/redesign-requirements.test.js`
- Modify: `assets/app/product-data.js`
- Create: `assets/app/connection-state.js`

**Interfaces:**
- Produces: `GWDBG_DATA.products` 十型号数据；`GWDBG_CONNECTION.get/set/disconnect/switchTransport`。
- Consumes: 浏览器 `sessionStorage`。

- [ ] 先扩展测试，断言十型号、图片映射、能力边界、无跳过入口、E50 模式和连接状态 API。
- [ ] 运行 `node tests/redesign-requirements.test.js`，确认因十型号和连接模块缺失而失败。
- [ ] 更新产品能力数据并实现连接状态模块。
- [ ] 再次运行测试，确认该任务断言通过。

### Task 2: 大屏手机画布与设备两列分组

**Files:**
- Modify: `assets/app/app.css`
- Modify: `assets/app/device-list.js`
- Modify: `pages/tab-device-bt.html`
- Add/replace: `assets/products/a01f.*`, `a01e.*`, `a02fg.*`, `a02eg.*`, `a03fg.*`

**Interfaces:**
- Produces: `.app-shell` 固定比例布局、`.product-grid` 两列卡片和 `.device-panel` 通栏展开列表。
- Consumes: `GWDBG_DATA.products`、产品资料源图。

- [ ] 增加静态测试，断言两列结构、卡片无类别/数量文字、画布比例和内容滚动。
- [ ] 运行测试并确认旧布局失败。
- [ ] 复制对应产品图，重写设备分组渲染和画布 CSS。
- [ ] 运行静态测试确认通过。

### Task 3: 快速配置、持续连接和左侧菜单

**Files:**
- Modify: `pages/device-quick.html`
- Modify: `pages/device-detail.html`
- Modify: `assets/app/device-flow.js`
- Create: `assets/app/workbench.js`

**Interfaces:**
- Produces: `GWDBG_WORKBENCH.mountQuick/mountDetail/openMenu/disconnect`。
- Consumes: 产品能力、URL 参数和 `GWDBG_CONNECTION`。

- [ ] 增加测试，断言快速配置只有“进入设备详情”，详情有完整参数和侧栏，蓝牙断开需要确认。
- [ ] 运行测试并确认旧页面失败。
- [ ] 实现快速配置、详情参数、侧栏和连接持久化。
- [ ] 运行静态与 UI 回归测试。

### Task 4: A 系列逐通道与服务器配置

**Files:**
- Modify: `pages/device-setting.html`
- Modify: `assets/app/device-flow.js`

**Interfaces:**
- Produces: `renderChannelConfiguration(product)`、`renderServerConfiguration(product)`。
- Consumes: `setting=brand-batch|server` 和产品通道数。

- [ ] 增加测试，断言每通道启停/品牌/主从/模拟器数量以及服务器 IP/域名双页签完整字段。
- [ ] 运行测试并确认缺失交互失败。
- [ ] 实现逐通道表单、模拟器条件字段、服务器选项与通讯检测状态。
- [ ] 运行测试确认通过。

### Task 5: 空调管理工作台

**Files:**
- Rewrite: `pages/device-a01-ac.html`
- Create: `assets/app/ac-management.js`

**Interfaces:**
- Produces: 单机选择、多选、全选、批量控制、全开、全关和控制底部面板。
- Consumes: `model`、`channels`、`GWDBG_CONNECTION`。

- [ ] 增加浏览器行为测试，覆盖选择、批量、全开、全关和侧栏导航。
- [ ] 运行冒烟测试并确认旧页面失败。
- [ ] 实现通道分组内机卡片和控制交互。
- [ ] 运行浏览器测试确认通过。

### Task 6: E50 严格还原

**Files:**
- Rewrite: `pages/device-e50.html`
- Rewrite: `pages/device-e50-detail.html`
- Modify: `assets/app/workbench.js`

**Interfaces:**
- Produces: E50 首页、通讯模式底部面板、品牌面板、室外机参数、内机列表、控制、诊断、升级和侧栏。
- Consumes: `mode=bt|4g` 与 E50 参考工程页面结构。

- [ ] 增加测试，断言 E50 核心入口、底部面板和模式规则。
- [ ] 运行测试并确认当前简化页失败。
- [ ] 依据参考工程重写 E50 页面；蓝牙转 4G 先确认断开，4G 不显示退出入口。
- [ ] 运行静态和浏览器测试确认通过。

### Task 7: FD01G 专属流程

**Files:**
- Rewrite: `pages/device-fd01g.html`
- Rewrite: `pages/device-fd01g-more.html`
- Create: `assets/app/fd01g.js`

**Interfaces:**
- Produces: 红外匹配、空调管理、电流检测、电量采集配置和红外学习交互。
- Consumes: FD01G 原型结构和通用连接状态。

- [ ] 增加测试，断言五项专属功能和无服务器配置。
- [ ] 运行测试并确认当前简化实现失败。
- [ ] 实现 FD01G 专属页面和控制交互。
- [ ] 运行静态与浏览器测试确认通过。

### Task 8: 全量验证与视觉验收

**Files:**
- Modify: `tests/ui-regression-check.js`
- Modify: `tests/browser-smoke.js`
- Update: `assets/screenshots/redesign-*.png`

**Interfaces:**
- Produces: 桌面大屏手机、430 x 932 和窄屏截图及全流程通过记录。
- Consumes: 全部页面与本地静态服务器。

- [ ] 更新回归测试和 Playwright 流程，覆盖十型号、滚动、展开、断开、模式切换、A 系列、E50、FD01G。
- [ ] 运行 `node tests/redesign-requirements.test.js`、`node tests/ui-regression-check.js` 和 `node tests/browser-smoke.js`。
- [ ] 用 Chromium 截取桌面和移动视口，检查画布比例、内容滚动、无重叠和素材渲染。
- [ ] 修复发现的问题并重新运行三组完整验证。
