# Final Fix Report — 工具线 AI 智能客服助理（2026-07-27）

Scope: 3 fixes per amended plan `docs/superpowers/plans/2026-07-27-tools-ai-assistant.md`, applied to the static prototype in `D:\workspace\gwdbg-demo`.

## Changes

### Fix 1 — `assets/app/ai-assistant.js` (STYLE string)
Inserted three lines immediately after `'.app-shell{position:relative;}' +` to suppress entry animations on the assistant UI once the page is ready:

```javascript
    'body[data-page-ready="true"] .phone-screen > .aa-ball,' +
    'body[data-page-ready="true"] .phone-screen > .aa-mask,' +
    'body[data-page-ready="true"] .phone-screen > .aa-chat{animation:none;}' +
```

### Fix 2 — `assets/app/ai-assistant.js` (`init()`)
Raised the floating ball on tabbar-less pages so it clears bottom CTAs:

```javascript
    ball.style.bottom = (hasTabbar ? 72 : 104) + 'px';   // was (hasTabbar ? 72 : 92)
```

### Fix 3 — `tests/browser-smoke.js`
Inserted the base-css tool page (`pages/tool-wiring.html`) AI assistant smoke block immediately after the existing `'ai chat layer must close'` assertion: ball renders, chat/mask hidden on load, chat opens on ball click, chat closes on back click.

**Deviation note:** after the inserted block the browser sits on `tool-wiring.html`, which is a `no-tabbar` page, so the pre-existing following line `await page.locator('.tab', { hasText: '我的' }).click();` timed out (30s). Added one navigation line between the inserted block and the untouched `.tab`/我的 lines to restore the page context those lines were written for:

```javascript
    await open(page, baseUrl, 'pages/tab-tools.html');
```

The `.tab`/我的 click lines themselves were not modified.

## Verification (run from repo root, in order)

### 1. Syntax check
Command: `node -e "new Function(require('fs').readFileSync('assets/app/ai-assistant.js','utf8')); console.log('syntax ok')"`

```
syntax ok
```

### 2. Static requirements
Command: `node tests/redesign-requirements.test.js`

```
Product data requirements passed
```

### 3. UI regression
Command: `node tests/ui-regression-check.js`

```
UI regression checks passed
```

### 4. Browser smoke (Playwright)
Command: `node tests/browser-smoke.js`

```
Browser smoke checks passed
```

All four checks passed. Exit code 0 for each.
