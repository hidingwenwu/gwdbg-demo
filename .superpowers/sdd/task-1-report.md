# Task 1 报告：新建 `assets/app/ai-assistant.js`

计划文件：`D:\workspace\gwdbg-demo\docs\superpowers\plans\2026-07-27-tools-ai-assistant.md`（仅 Task 1 与 Global Constraints）

## 创建内容

- 新建 `D:\workspace\gwdbg-demo\assets\app\ai-assistant.js`，内容为 Task 1 Step 1 的完整代码（含首行注释 `/* 工具线 AI 智能客服助理：悬浮球 + 全屏聊天层（演示交互对齐 E50 技术支持） */`）。
- 已用 `diff` 比对计划文件中代码块（第 32–216 行）与落盘文件，结果 **IDENTICAL**（逐字符一致）。
- 未修改任何其他文件，未添加计划外功能。

## 接口产出

- 全局 `window.GWDBG_AI_ASSISTANT = { open, close }`；页面引入脚本后自动在 `.phone-screen` 内渲染悬浮球（`.aa-ball`，按有无 `.tabbar` 自动取 72px/92px 距底）、遮罩（`.aa-mask`）与全屏聊天层（`.aa-chat`，`position:absolute; inset:0`）。
- 预置消息：时间条「今天 14:30」+ 欢迎语 + 转人工卡片；发送后 700ms 固定自动回复；转人工走 `window.showToast`（缺失时降级为内置 toast）。
- 幂等守卫：若 `window.GWDBG_AI_ASSISTANT` 已存在则直接返回；无 `.phone-screen` 时 init 静默返回。

## 执行的命令与输出

Step 2 语法校验（仓库根目录执行）：

```
$ node -e "new Function(require('fs').readFileSync('assets/app/ai-assistant.js','utf8')); console.log('syntax ok')"
syntax ok
```

退出码 0，符合预期输出 `syntax ok`。

## 与 Global Constraints 的对照

- 未触碰 `_base.css`、`app.css`、`interactions.js`。
- 聊天层与悬浮球均为 `position:absolute`，挂载在 `.phone-screen` 内，不超出手机画布。
- 本任务只新增 `.js` 文件，HTML 注释禁令不适用于 `.js` 源文件（首行 `/* */` 注释合规）。
- 脚本内文案无「演示环境」「原型说明」等交付外字样。

## 关注点

- 无阻塞、无偏差。唯一说明：文件中 `今天 14:30` 时间条为计划原文的硬编码演示文案，按计划逐字保留，未做改动。

## Fix report（2026-07-27 评审修复）

修复 `assets/app/ai-assistant.js` 三处评审发现，使其与已更新的计划文件 Task 1 完全一致：

1. **STYLE 首条规则**：在 `var STYLE = '' +` 之后新增 `'.app-shell{position:relative;}' +`（`tab-tools.html` 使用 `.app-shell` 而非 `.phone-screen`，需保证聊天层绝对定位锚点）。
2. **`init()` 屏幕查找与守卫**：改为 `var screen = document.querySelector('.phone-screen') || document.querySelector('.app-shell');`，并在 `if (!screen) return;` 之后追加幂等占位 `if (window.GWDBG_AI_ASSISTANT) return; window.GWDBG_AI_ASSISTANT = { open: function () {}, close: function () {} };`，随后 `injectStyle();`（删除原紧随其后的旧 `injectStyle();` 行的多余位置关系，现仅一处）。IIFE 起始处的顶层守卫 `if (window.GWDBG_AI_ASSISTANT) return;` 保持不变。
3. **Enter 键处理**：输入框 keydown 处理改为 `if (event.key === 'Enter' && !event.isComposing) sendMsg();`，避免中文输入法组词期间误发送。

### 验证输出（仓库根目录执行）

```
$ node -e "new Function(require('fs').readFileSync('assets/app/ai-assistant.js','utf8')); console.log('syntax ok')"
syntax ok
```

```
$ node -e "const s=require('fs').readFileSync('assets/app/ai-assistant.js','utf8'); ...三处模式断言..."
all 3 patterns present
top-level guard occurrences: 2
```

- 三处目标模式（`.app-shell` 首条样式规则、`.phone-screen || .app-shell` 查找 + 幂等占位守卫、`Enter && !event.isComposing`）均已确认存在。
- `if (window.GWDBG_AI_ASSISTANT) return;` 共出现 2 次：IIFE 起始处顶层守卫（保留）+ `init()` 内幂等占位（计划要求），与计划文件逐字一致。
- 追加修复（2026-07-27）：`fallbackToast` 挂载行改为 `document.querySelector('.phone-screen') ? document.querySelector('.phone-screen').appendChild(el) : document.querySelector('.app-shell').appendChild(el);`（对齐更新后计划 Task 1），复验 `node -e "new Function(...)"` 输出 `syntax ok`。
