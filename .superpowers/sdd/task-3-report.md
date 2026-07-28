# Task 3 报告：静态断言测试（redesign-requirements）

## 状态

完成。

## 变更文件

- 修改：`D:\workspace\gwdbg-demo\tests\redesign-requirements.test.js`
  - 在氟机工具断言块（`fluoroInput` / `fluoroResult` / `fluoroSubmit`，原第 261-271 行）之后、末尾 `console.log` 之前，追加 Task 3 Step 1 的断言块：
    - `read('assets/app/ai-assistant.js')` 必含 `AI 智能助理`、`转人工`、`转接人工客服`、`已收到您的问题`、`aa-ball`、`aa-chat`、`GWDBG_AI_ASSISTANT`。
    - 8 个工具线页面（`tab-tools`、`tool-fluoro-input`、`tool-fluoro-result`、`tool-fluoro-submit`、`tool-wiring`、`tool-videos`、`tool-errcode`、`feedback`）均须引入 `ai-assistant.js`。
  - 复用文件已有 `read()` 帮助函数与 `node:assert/strict` 的 `assert`，风格与现有断言一致。

## 验证

- 命令：`node tests/redesign-requirements.test.js`（仓库根目录执行）
- 结果：输出 `Product data requirements passed`，退出码 0。

## 备注

- 未修改 `_base.css`、`app.css`、`interactions.js` 及任何页面 HTML，符合 Global Constraints。
- 本任务仅追加测试断言，Task 1/2 的产物（`assets/app/ai-assistant.js` 与 8 页引入行）为前置依赖，已存在且通过断言。
