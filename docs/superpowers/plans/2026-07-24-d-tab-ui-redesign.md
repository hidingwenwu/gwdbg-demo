# 飞奕网关调试小程序 D 版改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 D 版静态 HTML 原型覆盖为三 Tab 正式交付界面，并实现按型号聚合、分产品快速配置、更多设置和 E50 远程调试主链路。

**Architecture:** 使用共享产品数据文件驱动设备聚合卡、快速配置和设备详情；FD01G 与 E50 保持独立页面交互。旧型号页面改为兼容跳转，所有新页面共用一套克制的现场工程工具视觉系统。

**Tech Stack:** 静态 HTML5、CSS3、原生 JavaScript、Node.js 静态回归测试、Playwright 浏览器验证。

## Global Constraints

- 保留“设备、工具、我的”三 Tab。
- 仅 E50 支持 4G 远程；E50 同时支持蓝牙与远程，其余型号仅支持蓝牙。
- 所有页面不显示原型说明、演示话术、教学文案和营销内容。
- 核心快速配置放首页，次要参数与高级功能放入二级“更多设置”。
- 产品图片复制到 `assets/products/`，优先选带飞奕 Logo 的 45 度产品视图。
- 不修改 E50 参考工程和产品资料源目录。
- 原型目录无 Git 仓库，不初始化 Git，也不执行提交步骤。

---

### Task 1: 产品数据与需求回归测试

**Files:**
- Create: `tests/redesign-requirements.test.js`
- Create: `assets/app/product-data.js`

**Interfaces:**
- Produces: `window.GWDBG_DATA`，包含 `products`、`bluetoothDevices`、`remoteDevices`、`toolItems`。
- Consumes: 无。

- [ ] **Step 1: 写失败测试**

测试必须断言八个目标型号齐全、只有 E50 支持远程、各产品快速配置项准确、F16G/B25LG 无服务器、S74G 无电表、工具和我的迁移正确。

- [ ] **Step 2: 运行并确认因数据文件缺失而失败**

Run: `node tests/redesign-requirements.test.js`

Expected: FAIL，提示 `assets/app/product-data.js` 缺失或产品数据未定义。

- [ ] **Step 3: 实现最小产品数据模块**

数据对象为浏览器和 Node 双环境导出：

```js
(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  root.GWDBG_DATA = data;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  return { products: [], bluetoothDevices: [], remoteDevices: [], toolItems: [] };
});
```

- [ ] **Step 4: 运行测试并确认通过**

Run: `node tests/redesign-requirements.test.js`

Expected: `Product data requirements passed`。

### Task 2: 产品图片与共享视觉系统

**Files:**
- Create: `assets/products/*`
- Create: `assets/app/app.css`

**Interfaces:**
- Consumes: 产品资料源目录内各型号渲染图。
- Produces: 产品数据中的项目内相对图片路径；所有新页面使用的 `.app-shell`、`.topbar`、`.mode-switch`、`.product-card`、`.task-card`、`.tabbar` 等样式。

- [ ] **Step 1: 核对候选图片并复制选定素材**

每个型号选择清晰、带飞奕 Logo、接近 45 度视图的图片；保留透明背景，不改源文件。

- [ ] **Step 2: 创建共享样式**

实现白色导航、浅灰蓝页面底、低阴影卡片、蓝色状态与操作、44px 以上触控高度、安全区和 402 × 874 视口适配。

- [ ] **Step 3: 运行数据测试确保图片路径存在**

Run: `node tests/redesign-requirements.test.js`

Expected: PASS，所有 `product.image` 文件存在。

### Task 3: 三 Tab 正式页面

**Files:**
- Modify: `pages/tab-device-bt.html`
- Modify: `pages/tab-device-4g.html`
- Modify: `pages/tab-tools.html`
- Modify: `pages/tab-mine.html`
- Create: `assets/app/device-list.js`

**Interfaces:**
- Consumes: `window.GWDBG_DATA`。
- Produces: `renderBluetoothProducts()`、`renderRemoteDevices()` 和页面内聚合展开交互。

- [ ] **Step 1: 扩展失败测试**

断言设备页没有横幅、型号查找和现场工具；含八个型号聚合容器；4G 页仅使用 E50 远程数据；工具页与我的页符合迁移清单。

- [ ] **Step 2: 运行并确认旧页面导致断言失败**

Run: `node tests/redesign-requirements.test.js`

Expected: FAIL，指出旧文案或缺失的新容器。

- [ ] **Step 3: 覆盖三 Tab 页面与列表交互**

设备卡点击展开当前型号设备，设备连接操作跳转到对应快速配置；`?model=` 自动展开并滚动到型号。4G 离线行禁用，在线 E50 进入远程模式。

- [ ] **Step 4: 运行测试并确认通过**

Run: `node tests/redesign-requirements.test.js`

Expected: PASS。

### Task 4: 共享快速配置、详情与更多设置

**Files:**
- Create: `pages/device-quick.html`
- Create: `pages/device-detail.html`
- Create: `pages/device-setting.html`
- Create: `assets/app/device-flow.js`

**Interfaces:**
- Consumes: URL 参数 `model`、`device`、`mode`、`setting` 与 `GWDBG_DATA.products`。
- Produces: A01/A02/A03、F16G/B25LG、S74G 的快速配置和二级设置交互。

- [ ] **Step 1: 扩展失败测试**

断言三个共享页存在；快速配置包含“跳过快速配置”和“更多设置”；服务器设置含自动通讯检测状态；产品数据能力控制入口显隐。

- [ ] **Step 2: 运行并确认共享页面缺失导致失败**

Run: `node tests/redesign-requirements.test.js`

Expected: FAIL，指出 `device-quick.html` 缺失。

- [ ] **Step 3: 实现共享调试页面**

快速配置按产品任务数据渲染状态卡；详情显示连接、固件、网络和能力摘要；设置页按 `setting` 渲染品牌、服务器、电表、控制、固件或高级参数表单。

- [ ] **Step 4: 运行测试并确认通过**

Run: `node tests/redesign-requirements.test.js`

Expected: PASS。

### Task 5: FD01G 与 E50 独立流程

**Files:**
- Create: `pages/device-fd01g.html`
- Create: `pages/device-e50.html`
- Modify: `pages/device-e50g.html`

**Interfaces:**
- Consumes: `model=FD01G|E50`、`mode=bt|4g` 和设备编号。
- Produces: FD01G 码库匹配/电流阈值快速配置；E50 连接/品牌/系统搜索与设备详情入口。

- [ ] **Step 1: 扩展失败测试**

断言 FD01G 不包含服务器，包含品牌搜索、码库测试和阈值；E50 支持 `mode`，包含品牌选择、系统搜索、室内外机详情且不含演示话术。

- [ ] **Step 2: 运行并确认独立页面缺失导致失败**

Run: `node tests/redesign-requirements.test.js`

Expected: FAIL。

- [ ] **Step 3: 实现两个独立页面**

FD01G 使用品牌筛选、热门品牌、码组切换、逐码测试和阈值滑块；E50 使用连接摘要、品牌选择、搜索进度和系统结果，远程模式显示 4G 状态。

- [ ] **Step 4: 运行测试并确认通过**

Run: `node tests/redesign-requirements.test.js`

Expected: PASS。

### Task 6: 入口、旧路由兼容与纯净文案

**Files:**
- Modify: `demo.html`
- Modify: `index.html`
- Modify: `pages/device-a01-home.html`
- Modify: `pages/device-f16g.html`
- Modify: `pages/device-b25lg.html`
- Modify: `pages/device-s74g.html`
- Create: `pages/device-fd01g-legacy.html`

**Interfaces:**
- Consumes: 新设备页 URL。
- Produces: 干净的原型入口和旧路由跳转。

- [ ] **Step 1: 扩展失败测试**

扫描所有对外入口，断言不含“演示环境、原型、阶段、顶部说明、兜底入口、暖通合伙人、企微客服”等文案，并断言旧设备页跳转参数正确。

- [ ] **Step 2: 运行并确认旧入口导致失败**

Run: `node tests/redesign-requirements.test.js`

Expected: FAIL 并列出遗留文案。

- [ ] **Step 3: 覆盖入口并添加兼容跳转**

`demo.html` 直接进入设备页；`index.html` 仅保留正式页面预览；旧设备页使用短脚本保持查询参数后跳转。

- [ ] **Step 4: 运行全部静态测试**

Run: `node tests/redesign-requirements.test.js && node tests/ui-regression-check.js`

Expected: 两组测试全部 PASS；如旧回归测试与已批准改版冲突，则更新测试为新交付行为后再次运行。

### Task 7: 浏览器与视觉验收

**Files:**
- Create: `tests/browser-smoke.js`
- Create: `assets/screenshots/redesign-*.png`

**Interfaces:**
- Consumes: 本地静态服务器 URL。
- Produces: 关键路径自动化结果与 402 × 874 截图。

- [ ] **Step 1: 编写浏览器冒烟检查**

覆盖蓝牙型号展开、A01 快速配置跳过、S74G 无电表、F16G 无服务器、FD01G 码库测试、E50 4G 进入与三 Tab 跳转。

- [ ] **Step 2: 启动本地服务器并运行冒烟检查**

Run: `node tests/browser-smoke.js`

Expected: `Browser smoke checks passed`，控制台无页面异常。

- [ ] **Step 3: 检查 402 × 874 与窄屏截图**

检查横向溢出、底部 Tab 遮挡、产品图裁切、展开列表、弹层与长内容滚动。

- [ ] **Step 4: 运行最终验证**

Run: `node tests/redesign-requirements.test.js && node tests/ui-regression-check.js && node tests/browser-smoke.js`

Expected: 全部 PASS。
