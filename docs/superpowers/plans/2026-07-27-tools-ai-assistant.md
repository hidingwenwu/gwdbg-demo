# 工具线 AI 智能客服助理实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在工具页及全部工具子页增加 AI 智能客服助理悬浮球，点击后页面内滑出全屏聊天层，演示交互 1:1 复刻 E50 技术支持。

**Architecture:** 新增自包含共享脚本 `assets/app/ai-assistant.js`（样式注入 + DOM 构建 + 聊天逻辑，类名 `.aa-` 前缀），8 个工具线页面各加一行 `<script>` 引入即生效；聊天消息复刻 `device-e50-service.html` 的预置欢迎语 / 转人工卡片 / 固定自动回复。

**Tech Stack:** 原生 HTML/CSS/JS（无依赖），页面模板为 `_base.css` + `interactions.js`；测试为 Node `node:assert` 静态断言 + Playwright 冒烟。

## Global Constraints

- 不改 `_base.css`、`app.css`、`interactions.js`（避免影响设备调试页）。
- 聊天层定位范围在手机画布 `.phone-screen` 内（`position:absolute; inset:0`），不超出画布。
- 所有页面 HTML 不得含 `<!--` HTML 注释与 `/*` CSS 注释（`tests/ui-regression-check.js` 强制）；`.js` 源文件不受此限。
- 交付外文案禁令：页面不得出现"演示环境""原型说明"等字样。
- 悬浮球避开各页底部固定 CTA：有 tabbar 的 `tab-tools.html` 距底 `72px`，无 tabbar 子页（`has-footer-btn` 或无底部按钮）距底 `104px`（通过脚本按页面类自动判断，覆盖 feedback 的 `btn-xl` 高底栏）。

---

### Task 1: 新建 `assets/app/ai-assistant.js`

**Files:**
- Create: `D:/workspace/gwdbg-demo/assets/app/ai-assistant.js`

**Interfaces:**
- Produces: 全局 `window.GWDBG_AI_ASSISTANT = { open, close }`；页面引入脚本后自动渲染悬浮球与聊天层。

- [ ] **Step 1: 创建脚本（完整代码）**

```javascript
/* 工具线 AI 智能客服助理：悬浮球 + 全屏聊天层（演示交互对齐 E50 技术支持） */
(function () {
  'use strict';
  if (window.GWDBG_AI_ASSISTANT) return;

  var AUTO_REPLY = '已收到您的问题，技术工程师会尽快回复。如需更及时的响应，可点击「转人工」。';
  var WELCOME = '您好，我是飞奕技术支持助手。请问有什么可以帮您？';

  var STYLE = '' +
    '.app-shell{position:relative;}' +
    'body[data-page-ready="true"] .phone-screen > .aa-ball,' +
    'body[data-page-ready="true"] .phone-screen > .aa-mask,' +
    'body[data-page-ready="true"] .phone-screen > .aa-chat{animation:none;}' +
    '.aa-ball{position:absolute;right:14px;z-index:400;width:56px;height:56px;border-radius:50%;' +
    'border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
    'background:linear-gradient(180deg,#2D6BE4 0%,#2457D6 100%);color:#fff;font-size:15px;font-weight:700;' +
    'box-shadow:0 8px 20px rgba(36,87,214,.32);transition:transform .15s ease,box-shadow .15s ease;}' +
    '.aa-ball:active{transform:scale(.92);box-shadow:0 4px 12px rgba(36,87,214,.28);}' +
    '.aa-ball .aa-dot{position:absolute;top:4px;right:4px;width:9px;height:9px;border-radius:50%;background:#FF3B30;border:2px solid #fff;}' +
    '.aa-mask{position:absolute;inset:0;z-index:700;background:rgba(0,0,0,.42);opacity:0;pointer-events:none;transition:opacity .22s;}' +
    '.aa-mask.show{opacity:1;pointer-events:auto;}' +
    '.aa-chat{position:absolute;inset:0;z-index:800;background:var(--bg-app,#F2F2F7);display:flex;flex-direction:column;' +
    'transform:translateX(100%);transition:transform .28s cubic-bezier(.22,.61,.36,1);}' +
    '.aa-chat.show{transform:translateX(0);}' +
    '.aa-header{display:flex;align-items:center;gap:6px;padding:0 14px;height:44px;flex:0 0 auto;background:rgba(255,255,255,.92);' +
    'border-bottom:.5px solid var(--line,rgba(60,60,67,.12));}' +
    '.aa-back{width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--text-primary,#000);}' +
    '.aa-title{flex:1;text-align:center;font-size:17px;font-weight:600;color:var(--text-primary,#000);}' +
    '.aa-header-spacer{width:32px;}' +
    '.aa-messages{flex:1 1 auto;min-height:0;overflow-y:auto;padding:12px 14px 14px;scrollbar-width:none;}' +
    '.aa-messages::-webkit-scrollbar{display:none;}' +
    '.aa-time{margin:2px 0 12px;color:var(--text-secondary,#8E8E93);font-size:10px;text-align:center;}' +
    '.aa-row{display:flex;gap:8px;align-items:flex-start;margin-bottom:12px;}' +
    '.aa-row.user{justify-content:flex-end;}' +
    '.aa-avatar{flex:0 0 auto;width:32px;height:32px;display:grid;place-items:center;border-radius:50%;font-size:12px;}' +
    '.aa-avatar-agent{background:var(--fy-blue-light,#E8EEFB);color:var(--fy-blue,#2C5CDC);}' +
    '.aa-avatar-user{background:#e8f0e9;color:#1F7D53;}' +
    '.aa-bubble{max-width:70%;padding:10px 12px;font-size:13px;line-height:1.55;color:var(--text-primary,#000);}' +
    '.aa-bubble-agent{border-radius:4px 12px 12px 12px;background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.04);}' +
    '.aa-bubble-user{border-radius:12px 12px 4px 12px;background:var(--fy-blue,#2C5CDC);color:#fff;}' +
    '.aa-card{max-width:74%;display:grid;gap:9px;padding:12px;border-radius:4px 12px 12px 12px;background:#fff;' +
    'box-shadow:0 4px 20px rgba(0,0,0,.04);font-size:12px;color:var(--text-primary,#000);}' +
    '.aa-card-btn{min-height:32px;display:flex;align-items:center;justify-content:center;border:0;border-radius:7px;' +
    'background:var(--fy-blue,#2C5CDC);color:#fff;font-size:12px;font-weight:650;cursor:pointer;}' +
    '.aa-inputbar{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:8px 12px max(10px,env(safe-area-inset-bottom));' +
    'background:rgba(255,255,255,.96);border-top:.5px solid var(--line,rgba(60,60,67,.12));}' +
    '.aa-human{flex:0 0 auto;min-height:36px;padding:0 12px;border:1px solid var(--fy-blue,#2C5CDC);border-radius:18px;' +
    'background:#fff;color:var(--fy-blue,#2C5CDC);font-size:12px;font-weight:650;cursor:pointer;}' +
    '.aa-input{flex:1;min-width:0;min-height:38px;padding:0 13px;border:0;border-radius:19px;background:#f1f4f8;outline:0;' +
    'font-size:13px;color:var(--text-primary,#000);}' +
    '.aa-send{flex:0 0 auto;min-height:36px;padding:0 14px;border:0;border-radius:18px;background:var(--fy-blue,#2C5CDC);' +
    'color:#fff;font-size:12px;font-weight:650;cursor:pointer;}';

  function injectStyle() {
    var tag = document.createElement('style');
    tag.id = 'aa-style';
    tag.textContent = STYLE;
    document.head.appendChild(tag);
  }

  function esc(value) {
    return String(value).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function fallbackToast(message) {
    var el = document.querySelector('.aa-fallback-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'aa-fallback-toast';
      el.style.cssText = 'position:absolute;left:50%;top:45%;transform:translateX(-50%);z-index:900;' +
        'background:rgba(31,36,48,.88);color:#fff;padding:10px 16px;border-radius:10px;font-size:13px;' +
        'opacity:0;transition:opacity .2s;pointer-events:none;';
      document.querySelector('.phone-screen') ? document.querySelector('.phone-screen').appendChild(el) : document.querySelector('.app-shell').appendChild(el);
    }
    el.textContent = message;
    requestAnimationFrame(function () { el.style.opacity = '1'; });
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.opacity = '0'; }, 1800);
  }

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else fallbackToast(message);
  }

  var seq = 0;
  var messages = [
    { id: ++seq, type: 'time', text: '今天 14:30' },
    { id: ++seq, type: 'agent', text: WELCOME },
    { id: ++seq, type: 'action', text: '如需人工专家支持，可随时转接。' }
  ];

  function render(area) {
    area.innerHTML = messages.map(function (m) {
      if (m.type === 'time') return '<div class="aa-time">' + m.text + '</div>';
      if (m.type === 'agent') {
        return '<div class="aa-row"><span class="aa-avatar aa-avatar-agent">客</span>' +
          '<div class="aa-bubble aa-bubble-agent">' + esc(m.text) + '</div></div>';
      }
      if (m.type === 'user') {
        return '<div class="aa-row user"><div class="aa-bubble aa-bubble-user">' + esc(m.text) + '</div>' +
          '<span class="aa-avatar aa-avatar-user">我</span></div>';
      }
      return '<div class="aa-row"><span class="aa-avatar aa-avatar-agent">客</span>' +
        '<div class="aa-card"><span>' + esc(m.text) + '</span>' +
        '<button class="aa-card-btn" type="button">转接人工客服</button></div></div>';
    }).join('');
    area.scrollTop = area.scrollHeight;
  }

  function init() {
    var screen = document.querySelector('.phone-screen') || document.querySelector('.app-shell');
    if (!screen) return;
    if (window.GWDBG_AI_ASSISTANT) return;
    window.GWDBG_AI_ASSISTANT = { open: function () {}, close: function () {} };
    injectStyle();

    var hasTabbar = !!screen.querySelector('.tabbar');
    var ball = document.createElement('button');
    ball.className = 'aa-ball';
    ball.type = 'button';
    ball.setAttribute('aria-label', 'AI 智能助理');
    ball.style.bottom = (hasTabbar ? 72 : 104) + 'px';
    ball.innerHTML = 'AI<span class="aa-dot"></span>';

    var mask = document.createElement('div');
    mask.className = 'aa-mask';

    var chat = document.createElement('section');
    chat.className = 'aa-chat';
    chat.setAttribute('aria-label', 'AI 智能助理');
    chat.innerHTML = '<div class="aa-header">' +
      '<button class="aa-back" type="button" aria-label="返回">‹</button>' +
      '<div class="aa-title">AI 智能助理</div><span class="aa-header-spacer"></span></div>' +
      '<div class="aa-messages"></div>' +
      '<div class="aa-inputbar">' +
      '<button class="aa-human" type="button">转人工</button>' +
      '<input class="aa-input" placeholder="发送消息...">' +
      '<button class="aa-send" type="button">发送</button></div>';

    screen.appendChild(ball);
    screen.appendChild(mask);
    screen.appendChild(chat);

    var area = chat.querySelector('.aa-messages');
    var input = chat.querySelector('.aa-input');

    function open() {
      render(area);
      mask.classList.add('show');
      chat.classList.add('show');
      ball.style.display = 'none';
    }
    function close() {
      mask.classList.remove('show');
      chat.classList.remove('show');
      ball.style.display = '';
    }
    function requestHuman() { toast('正在为您转接人工客服'); }
    function sendMsg() {
      var text = input.value.trim();
      if (!text) return;
      messages.push({ id: ++seq, type: 'user', text: text });
      input.value = '';
      render(area);
      setTimeout(function () {
        messages.push({ id: ++seq, type: 'agent', text: AUTO_REPLY });
        render(area);
      }, 700);
    }

    ball.addEventListener('click', open);
    mask.addEventListener('click', close);
    chat.querySelector('.aa-back').addEventListener('click', close);
    chat.querySelector('.aa-human').addEventListener('click', requestHuman);
    area.addEventListener('click', function (event) {
      if (event.target.closest('.aa-card-btn')) requestHuman();
    });
    chat.querySelector('.aa-send').addEventListener('click', sendMsg);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.isComposing) sendMsg();
    });

    window.GWDBG_AI_ASSISTANT = { open: open, close: close };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
```

- [ ] **Step 2: 语法校验**

Run: `node -e "new Function(require('fs').readFileSync('assets/app/ai-assistant.js','utf8')); console.log('syntax ok')"`
Expected: `syntax ok`

---

### Task 2: 8 个工具线页面引入脚本

**Files:**
- Modify: `D:/workspace/gwdbg-demo/pages/tab-tools.html`（在 `product-data.js` 引入后追加）
- Modify: `D:/workspace/gwdbg-demo/pages/tool-fluoro-input.html`（在 `interactions.js` 引入后追加）
- Modify: `D:/workspace/gwdbg-demo/pages/tool-fluoro-result.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-fluoro-submit.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-wiring.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-videos.html`
- Modify: `D:/workspace/gwdbg-demo/pages/tool-errcode.html`
- Modify: `D:/workspace/gwdbg-demo/pages/feedback.html`

**Interfaces:**
- Consumes: Task 1 的 `assets/app/ai-assistant.js`。

每个页面在最后一个 `<script src=...>` 之后追加一行（各文件已有内容不变）：

```html
  <script src="../assets/app/ai-assistant.js"></script>
```

注意：`tab-tools.html` 与另 7 页的基础脚本不同——`tab-tools.html` 已有 `../assets/app/product-data.js`，其余 7 页已有 `../interactions.js`；追加位置均在对应文件已有的最后一个 `</script>` 收尾标签之后、`</body>` 之前。

- [ ] **Step 1: 逐页追加引入行（8 个文件）**

对 7 个 `_base.css` 页面统一模式：

```html
  <script src="../interactions.js"></script>
  <script src="../assets/app/ai-assistant.js"></script>
```

`tab-tools.html`：

```html
  <script src="../assets/app/product-data.js"></script>
  <script src="../assets/app/ai-assistant.js"></script>
```

- [ ] **Step 2: 校验 8 页均已引入**

Run: `node -e "['tab-tools','tool-fluoro-input','tool-fluoro-result','tool-fluoro-submit','tool-wiring','tool-videos','tool-errcode','feedback'].forEach(p=>{const h=require('fs').readFileSync('pages/'+p+'.html','utf8');if(!h.includes('ai-assistant.js'))throw new Error(p+' missing')});console.log('all pages linked')"`
Expected: `all pages linked`

---

### Task 3: 静态断言测试（redesign-requirements）

**Files:**
- Modify: `D:/workspace/gwdbg-demo/tests/redesign-requirements.test.js`（在氟机工具断言块之后追加）

**Interfaces:**
- Consumes: Task 1、2 的文件。

- [ ] **Step 1: 追加断言**

```javascript
const aiAssistant = read('assets/app/ai-assistant.js');
for (const text of ['AI 智能助理', '转人工', '转接人工客服', '已收到您的问题', 'aa-ball', 'aa-chat', 'GWDBG_AI_ASSISTANT']) {
  assert(aiAssistant.includes(text), `ai assistant must include ${text}`);
}
for (const page of ['tab-tools', 'tool-fluoro-input', 'tool-fluoro-result', 'tool-fluoro-submit', 'tool-wiring', 'tool-videos', 'tool-errcode', 'feedback']) {
  assert(read(`pages/${page}.html`).includes('ai-assistant.js'), `${page} must load the ai assistant`);
}
```

- [ ] **Step 2: 跑测试**

Run: `node tests/redesign-requirements.test.js`
Expected: `Product data requirements passed`（进程退出码 0）

---

### Task 4: UI 回归通过（无注释/无禁语/语法）

**Files:**
- Verify: `D:/workspace/gwdbg-demo/tests/ui-regression-check.js`（无需修改，自动覆盖新页面断言）

- [ ] **Step 1: 跑 UI 回归**

Run: `node tests/ui-regression-check.js`
Expected: `UI regression checks passed`

注意：本任务不修改 `ui-regression-check.js`——该文件已自动遍历 `pages/` 全部 HTML，Task 2 的改动需满足其"无 HTML/CSS 注释、无交付外文案、内联脚本可解析"规则；若失败，回到对应页面删除注释/禁语。

---

### Task 5: 浏览器冒烟测试

**Files:**
- Modify: `D:/workspace/gwdbg-demo/tests/browser-smoke.js`（在工具页检查块后追加 AI 助理用例）

**Interfaces:**
- Consumes: Task 1-4 全部产物。

- [ ] **Step 1: 追加冒烟用例**

```javascript
await open(page, baseUrl, 'pages/tab-tools.html');
assert.equal(await page.locator('.aa-ball').count(), 1, 'tools page must show the ai assistant ball');
await page.locator('.aa-ball').click();
await page.waitForTimeout(400);
assert.equal(await page.locator('.aa-chat.show').count(), 1, 'ai chat layer must open');
assert.ok((await page.locator('.aa-row').count()) >= 2, 'ai chat must render preset messages');
await page.locator('.aa-input').fill('你好');
await page.locator('.aa-send').click();
await page.waitForTimeout(900);
assert.ok((await page.locator('.aa-bubble-user').count()) === 1, 'user message must render');
assert.ok((await page.locator('.aa-bubble-agent').count()) >= 2, 'auto reply must render');
await page.locator('.aa-human').click();
await page.waitForTimeout(200);
await page.locator('.aa-back').click();
await page.waitForTimeout(400);
assert.equal(await page.locator('.aa-chat.show').count(), 0, 'ai chat layer must close');

await open(page, baseUrl, 'pages/tool-wiring.html');
assert.equal(await page.locator('.aa-ball').count(), 1, 'base-css tool page must show the ai assistant ball');
assert.equal(await page.locator('.aa-chat.show').count(), 0, 'ai chat must stay hidden on page load');
assert.equal(await page.locator('.aa-mask.show').count(), 0, 'ai mask must stay hidden on page load');
await page.locator('.aa-ball').click();
await page.waitForTimeout(400);
assert.equal(await page.locator('.aa-chat.show').count(), 1, 'ai chat must open on base-css tool pages');
await page.locator('.aa-back').click();
await page.waitForTimeout(400);
assert.equal(await page.locator('.aa-chat.show').count(), 0, 'ai chat must close on base-css tool pages');
```

- [ ] **Step 2: 跑冒烟**

Run: `node tests/browser-smoke.js`
Expected: `Browser smoke checks passed`

---

### Task 6: 截图位（visual-check）与人工视觉核对

**Files:**
- Modify: `D:/workspace/gwdbg-demo/tests/visual-check.js`（shots 数组追加两项）

- [ ] **Step 1: 追加截图位**

```javascript
['tools-ai-ball', 'pages/tab-tools.html'],
['tools-ai-chat', 'pages/tab-tools.html', async () => { await page.locator('.aa-ball').click(); await page.waitForTimeout(400); }],
```

- [ ] **Step 2: 跑截图并人工核对**

Run: `node tests/visual-check.js`
Expected: 控制台逐行 `shot ...`、无 `PAGE ERRORS`；人工打开 `assets/screenshots/check/tools-ai-ball.png` 与 `tools-ai-chat.png` 核对悬浮球位置、聊天层布局与 E50 技术支持一致性。

---

### Task 7: 需求说明文档同步（V1.7）

**Files:**
- Modify: `D:/workspace/丁文武/00-projects/小程序梳理/飞奕网关调试小程序二期功能需求说明.md`
- Create: `D:/workspace/丁文武/00-projects/小程序梳理/飞奕网关调试小程序二期功能需求说明_备份_20260727_V1.6.md`（修改前先复制备份）

- [ ] **Step 1: 备份**

```bash
cp "D:/workspace/丁文武/00-projects/小程序梳理/飞奕网关调试小程序二期功能需求说明.md" "D:/workspace/丁文武/00-projects/小程序梳理/飞奕网关调试小程序二期功能需求说明_备份_20260727_V1.6.md"
```

- [ ] **Step 2: 更新文档（3 处 + 版本头 + 修订记录）**

1. 4.4.1 元素清单表"留言反馈"行之后新增一行：

```markdown
| **P0** | AI 智能客服助理 | 工具页及全部工具子页右下角悬浮球常驻；点击在页面内滑出全屏聊天层（不跳转页面），演示交互对齐 E50"技术&服务"：欢迎语 + 转人工卡片 + 固定自动回复；真实 AI 后端后续另行立项接入 |
```

2. 3.1 信息架构图中"工具"列末尾追加一行：

```
│   （含 AI 智能客服助理悬浮球）
```

3. 版本头改为 `文档日期：2026-07-27`、`版本：V1.7`；修订记录表追加：

```markdown
| V1.7 | 2026-07-27 | 原型迭代对齐：工具页及全部工具子页新增 AI 智能客服助理悬浮球，页面内全屏聊天层，演示交互对齐 E50 技术支持 |
```

- [ ] **Step 3: 校验文档**

Run: `node -e "const h=require('fs').readFileSync('D:/workspace/丁文武/00-projects/小程序梳理/飞奕网关调试小程序二期功能需求说明.md','utf8');for(const t of ['AI 智能客服助理','V1.7','悬浮球']) if(!h.includes(t)) throw new Error(t+' missing');console.log('doc updated')"`
Expected: `doc updated`

---

## 自检结论

- **Spec 覆盖**：§3 组件架构 → Task 1；§4 悬浮球 → Task 1（位置/避让）+ Task 6；§5 聊天层 → Task 1 + Task 5/6；§6 数据流 → Task 1；§7 错误处理 → Task 1（esc/幂等/降级 toast）；§8 测试 → Task 3/4/5/6；§10 实施要点 1-5 → Task 1/2/3-6/7。
- **占位符扫描**：无 TBD/TODO；每步含完整代码或确切命令。
- **类型一致**：`GWDBG_AI_ASSISTANT`、`.aa-ball/.aa-chat/.aa-back/.aa-human/.aa-input/.aa-send` 等命名在 Task 1 定义、Task 5/6 消费，前后一致。
