# Demo Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the minimal `demo.html` link page with a polished mini-program launch entry.

**Architecture:** Keep the entry as a standalone static HTML page using the existing `_base.css` and logo asset. Add only page-local layout styles and one navigation link so the launch route remains explicit and testable.

**Tech Stack:** HTML5, CSS, existing static assets, Node.js assertion script

## Global Constraints

- Modify only `demo.html` and `tests/ui-regression-check.js` for the product change.
- Do not add dependencies or automatic redirects.
- Primary action text is exactly `进入小程序`.
- Primary action target is exactly `pages/tab-device-bt.html`.
- Do not show prototype explanations or internal file paths.

---

### Task 1: Mini-Program Launch Entry

**Files:**
- Modify: `demo.html`
- Modify: `tests/ui-regression-check.js`

**Interfaces:**
- Consumes: existing `_base.css` tokens and `assets/logo/LOGO-彩色.png`
- Produces: a static launch page whose primary link targets `pages/tab-device-bt.html`

- [ ] **Step 1: Write the failing regression checks**

Add assertions that `demo.html` contains the Feiyi logo, the exact `进入小程序` action, a stable `demo-launch` container, and no legacy `进入设备列表` text.

- [ ] **Step 2: Run the checks and verify failure**

Run: `node tests/ui-regression-check.js`

Expected: FAIL because the current page lacks the new launch container and action copy.

- [ ] **Step 3: Implement the static launch screen**

Replace the current inline centered link with semantic launch markup, page-local responsive styles, the existing logo asset, product name, and one primary link to `pages/tab-device-bt.html`.

- [ ] **Step 4: Run regression checks**

Run: `node tests/ui-regression-check.js`

Expected: `UI regression checks passed`.

- [ ] **Step 5: Preview at desktop and mobile sizes**

Serve the static directory locally and confirm the logo, title, and action remain visible without overlap at 390x844 and 1280x800 viewports.
