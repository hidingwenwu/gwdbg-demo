# 飞奕网关调试小程序原型优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在不改变小程序定位、三 Tab 导航、设备上下文分区和现有页面路由的前提下，统一原型的视觉语言、配置分组和现场调试反馈。

**Architecture:** 保留现有多页面 HTML 原型结构，以 `_base.css` 作为设计令牌与组件层，以 `interactions.js` 作为通用交互层；核心页面优先收敛设备首页、设备配置、服务器配置与自检状态，其他型号页沿用同一基础层逐步对齐。

**Tech Stack:** 原生 HTML、CSS、JavaScript，无外部依赖；目标画布 402×874，兼容微信小程序常见移动端交互。

## Global Constraints

- 保持小程序名称“飞奕网关调试”、三 Tab（设备/工具/我的）与蓝牙/4G 双模式定位。
- 第 1 批型号与 A01 模板页面继续保留，现有 HTML 文件名和主要跳转关系不删除。
- 服务器配置下发后继续进入连接自检流程；成功、失败、检测中三态均可从原型入口访问。
- 不新增外部依赖，不把公众号内容重新复制到原型内。
- 页面文案面向现场调试人员，避免直接暴露不必要的内部协议术语。

---

### Task 1: 建立统一视觉与组件基线

**Files:**
- Modify: `D:/workspace/gwdbg-demo/_base.css`
- Modify: `D:/workspace/gwdbg-demo/interactions.js`
- Modify: `D:/workspace/gwdbg-demo/index.html`

**Interfaces:**
- `interactions.js` 继续暴露 `showToast`、`confirmDialog`、`validateForm`、`initFilter` 等现有全局函数。
- 新增的状态徽标、页面入场和导航辅助类只依赖 CSS 类名，不改变页面脚本调用方式。

- [ ] 将颜色、阴影、圆角和字号令牌收敛为现场调试工作台风格：深蓝主色、青绿色成功色、琥珀色警示色，减少页面之间的紫色渐变差异。
- [ ] 补充统一的 `page-intro`、`status-card`、`quick-actions`、`notice-strip`、`sticky-action`、`skeleton` 类，并让现有卡片/按钮/底栏获得一致的 focus、active 和 disabled 状态。
- [ ] 在 `interactions.js` 增加页面入场标记、导航返回兜底、带标题的 toast 变体和 `data-loading` 状态切换，保持无依赖实现。
- [ ] 将 `index.html` 从“页面缩略图目录”优化为带功能分组、当前阶段说明和核心链路入口的原型总览，保留所有页面卡片链接。

### Task 2: 收敛 A01 核心设备调试链路

**Files:**
- Modify: `D:/workspace/gwdbg-demo/pages/tab-device-bt.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tab-device-4g.html`
- Modify: `D:/workspace/gwdbg-demo/pages/device-a01-home.html`
- Modify: `D:/workspace/gwdbg-demo/pages/device-a01-config.html`
- Modify: `D:/workspace/gwdbg-demo/pages/device-a01-debug.html`

**Interfaces:**
- 设备上下文底部四分区仍使用现有 `subtabbar` 链接。
- 设备页继续复用 `interactions.js` 的 Toast、确认弹层和搜索过滤能力。

- [ ] 重做蓝牙设备首页的信息层级：连接状态、设备摘要、常用操作、异常提醒和型号兜底入口按现场任务顺序排列。
- [ ] 让 4G 远程页明确区分在线/离线、最近连接时间和进入诊断的主操作，并保留 E50 远程调试边界。
- [ ] 删除 `device-a01-config.html` 中重复的“服务器”分组，统一为“常用配置 / 网络与通信 / 现场参数 / 维护”四组；原厂服务器和客户服务器各保留唯一入口。
- [ ] 为设备配置项增加当前值/状态摘要，区分可直接下发项与需要进入详情配置项，危险操作保留二次确认。
- [ ] 将“更多功能”改为按排障任务组织的工具入口，减少与设备配置页重复的配置项。

### Task 3: 优化配置即验证流程

**Files:**
- Modify: `D:/workspace/gwdbg-demo/pages/device-a01-server.html`
- Modify: `D:/workspace/gwdbg-demo/pages/device-a01-client-server.html`
- Modify: `D:/workspace/gwdbg-demo/pages/check-server-running.html`
- Modify: `D:/workspace/gwdbg-demo/pages/check-server-success.html`
- Modify: `D:/workspace/gwdbg-demo/pages/check-server-fail.html`
- Modify: `D:/workspace/gwdbg-demo/pages/finish-with-cta.html`

**Interfaces:**
- 保留 IP/域名分段控件和三种自检页面路由。
- 自检步骤继续使用 `data-selfcheck`、`.step-item` 和现有跳转机制。

- [ ] 统一原厂/客户服务器配置页的字段顺序、默认值、启用状态和底部下发操作，避免两套页面交互不一致。
- [ ] 在服务器配置页突出“下发后自动自检”的时机、预计耗时和可取消/重试说明。
- [ ] 在检测中页面增加当前步骤、预计剩余时间和取消入口；成功页突出“已验证可上线”与生效配置摘要；失败页将失败环节与可直接修复字段关联。
- [ ] 将调试完成页改为“现场已完成”总结：展示服务器自检、空调接入等关键结果，并提供暖通合伙人主 CTA 与反馈入口。

### Task 4: 统一工具中心与我的页面

**Files:**
- Modify: `D:/workspace/gwdbg-demo/pages/tab-tools.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-fluoro-input.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-fluoro-result.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-fluoro-submit.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-wiring.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-videos.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-errcode.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tab-mine.html`
- Modify: `D:/workspace/gwdbg-demo/pages/feedback.html`

**Interfaces:**
- 工具页继续使用现有 `data-keywords`、`initFilter`、chip/tab 组件和页面跳转。
- “我的”页保留反馈与暖通合伙人入口。

- [ ] 将工具中心整理为“现场排障 / 选型查询 / 学习资料”三类，保留全局搜索、最近使用和型号上下文推荐。
- [ ] 统一氟机选型三步流程的步骤指示、空结果处理和未收录提交，保证返回路径明确。
- [ ] 为接线、视频、故障码补充筛选条件、标签和空状态，弱网时保留最近内容提示。
- [ ] 重做“我的”页面的服务承接区、反馈入口和关于信息，避免出现已下线的旧小程序名称。

### Task 5: 页面巡检与交互验证

**Files:**
- Verify: `D:/workspace/gwdbg-demo/demo.html`
- Verify: all files under `D:/workspace/gwdbg-demo/pages/`

- [ ] 逐页检查 402×874 画布下的滚动、底部操作区、返回和 Tab 高亮。
- [ ] 验证核心链路：蓝牙搜索 → A01 首页 → 设备配置 → 服务器下发 → 自检成功/失败 → 完成页。
- [ ] 验证工具链路：工具中心 → 氟机选型输入/结果/未收录提交，及搜索/筛选交互。
- [ ] 验证所有危险操作仍需二次确认，所有下发操作都有即时反馈。
- [ ] 使用本地静态服务器打开 `demo.html`，对照需求文档复核页面命名和重复配置是否已清理。
