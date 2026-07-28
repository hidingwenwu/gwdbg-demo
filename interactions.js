/**
 * 飞奕网关调试小程序 · 通用交互脚本
 * 说明：无外部依赖，所有页面通过 <script src="../interactions.js"></script> 引入
 */
(function () {
  'use strict';

  /* ========== 工具函数 ========== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function throttle(fn, wait = 200) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last > wait) { last = now; fn.apply(this, args); }
    };
  }

  /* ========== Toast 轻提示 ========== */
  function ensureToastContainer() {
    let c = $('.toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    return c;
  }

  window.showToast = function (msg, duration = 2200) {
    const c = ensureToastContainer();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = String(msg).replace(/^演示环境：/, '');
    t.style.animationDuration = '0.25s, 0.25s';
    t.style.animationDelay = `0s, ${duration / 1000 - 0.25}s`;
    c.appendChild(t);
    setTimeout(() => t.remove(), duration);
  };

  /* ========== 对话框 ========== */
  window.confirmDialog = function (opts) {
    return new Promise((resolve) => {
      const { title = '提示', message = '', confirmText = '确认', cancelText = '取消', danger = false } = opts;
      let ov = $('.overlay');
      if (!ov) {
        ov = document.createElement('div');
        ov.className = 'overlay';
        document.body.appendChild(ov);
      }
      ov.innerHTML = `
        <div class="dialog">
          <div class="dg-title">${title}</div>
          <div class="dg-msg">${message}</div>
          <div class="dg-actions">
            <button class="btn btn-ghost js-cancel" style="flex:1;">${cancelText}</button>
            <button class="btn ${danger ? 'btn-danger' : 'btn-primary-solid'} js-ok" style="flex:1;">${confirmText}</button>
          </div>
        </div>
      `;
      requestAnimationFrame(() => ov.classList.add('show'));

      const close = (ok) => {
        ov.classList.remove('show');
        setTimeout(() => { ov.innerHTML = ''; resolve(ok); }, 200);
      };
      $('.js-cancel', ov).addEventListener('click', () => close(false));
      $('.js-ok', ov).addEventListener('click', () => close(true));
    });
  };

  /* ========== 通用：chip 组单选/多选 ========== */
  function initChipGroups() {
    $$('.chip-group[data-select]').forEach(g => {
      const mode = g.dataset.select || 'single';
      const chips = $$('.chip', g);
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          if (mode === 'single') {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
          } else {
            chip.classList.toggle('active');
          }
          g.dispatchEvent(new CustomEvent('chip:change', { bubbles: true, detail: { group: g, chip } }));
        });
      });
    });
  }

  /* ========== 通用：tab 切换（非导航型，用于内容切换） ========== */
  function initTabs() {
    $$('.tab-switch[data-tab]').forEach(switchEl => {
      const target = switchEl.dataset.tab;
      const items = $$('.tab-item', switchEl);
      const panels = target ? $$(`[data-tab-panel="${target}"]`) : [];
      items.forEach((item, idx) => {
        item.addEventListener('click', () => {
          items.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          panels.forEach((p, pidx) => p.classList.toggle('hidden', pidx !== idx));
          switchEl.dispatchEvent(new CustomEvent('tab:change', { bubbles: true, detail: { index: idx } }));
        });
      });
    });
  }

  /* ========== 模式切换高亮保持 ========== */
  function initModeSwitch() {
    $$('.mode-switch').forEach(ms => {
      const items = $$('.mode-item', ms);
      items.forEach(item => {
        item.addEventListener('click', function () {
          items.forEach(i => i.classList.remove('active'));
          this.classList.add('active');
        });
      });
    });
  }

  /* ========== 开关 ========== */
  function initSwitches() {
    $$('.switch[data-toggle]').forEach(sw => {
      sw.addEventListener('click', () => {
        sw.classList.toggle('on');
        const on = sw.classList.contains('on');
        showToast(on ? (sw.dataset.on || '已开启') : (sw.dataset.off || '已关闭'));
      });
    });
  }

  /* ========== 表单校验 ========== */
  window.validateForm = function (form) {
    let ok = true;
    $$('[required]', form).forEach(field => {
      const val = field.value.trim();
      if (!val) {
        ok = false;
        field.classList.add('is-error');
      } else {
        field.classList.remove('is-error');
      }
    });
    return ok;
  };

  function initForms() {
    $$('form[data-validate]').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (validateForm(form)) {
          form.dispatchEvent(new CustomEvent('form:valid', { bubbles: true }));
        } else {
          showToast('请填写必填项');
        }
      });
    });
    $$('input, textarea').forEach(el => {
      el.addEventListener('input', () => el.classList.remove('is-error'));
    });
  }

  /* ========== 计数器（温度步进等） ========== */
  function initSteppers() {
    $$('[data-stepper]').forEach(box => {
      const input = $('.stepper-value', box);
      const min = parseFloat(box.dataset.min) ?? -Infinity;
      const max = parseFloat(box.dataset.max) ?? Infinity;
      const step = parseFloat(box.dataset.step) || 1;
      $$('.stepper-minus', box).forEach(btn => btn.addEventListener('click', () => {
        let v = parseFloat(input.textContent) || 0;
        v = Math.max(min, +(v - step).toFixed(1));
        input.textContent = v;
        box.dispatchEvent(new CustomEvent('stepper:change', { detail: { value: v } }));
      }));
      $$('.stepper-plus', box).forEach(btn => btn.addEventListener('click', () => {
        let v = parseFloat(input.textContent) || 0;
        v = Math.min(max, +(v + step).toFixed(1));
        input.textContent = v;
        box.dispatchEvent(new CustomEvent('stepper:change', { detail: { value: v } }));
      }));
    });
  }

  /* ========== 字符计数 ========== */
  function initCharCount() {
    $$('textarea[data-max]').forEach(ta => {
      const max = parseInt(ta.dataset.max, 10);
      const out = $(ta.dataset.counter);
      const update = () => {
        const len = ta.value.length;
        if (out) out.textContent = `${len} / ${max}`;
        if (len > max) { ta.value = ta.value.slice(0, max); }
      };
      ta.addEventListener('input', update);
      update();
    });
  }

  /* ========== 搜索过滤 ========== */
  window.initFilter = function (inputSelector, itemSelector, getText) {
    const input = $(inputSelector);
    if (!input) return;
    input.addEventListener('input', throttle(() => {
      const kw = input.value.trim().toLowerCase();
      $$(itemSelector).forEach(item => {
        const text = (getText ? getText(item) : item.textContent).toLowerCase();
        item.style.display = text.includes(kw) ? '' : 'none';
      });
    }, 150));
  };

  /* ========== 删除二次确认 ========== */
  function initDangerActions() {
    $$('[data-confirm]').forEach(el => {
      el.addEventListener('click', async e => {
        e.preventDefault();
        const ok = await confirmDialog({
          title: el.dataset.title || '确认操作',
          message: el.dataset.confirm,
          confirmText: el.dataset.ok || '确认',
          cancelText: el.dataset.cancel || '取消',
          danger: el.dataset.danger === 'true'
        });
        if (ok) {
          showToast(el.dataset.success || '操作已执行');
          const href = el.getAttribute('href');
          if (href && href !== '#') setTimeout(() => location.href = href, 400);
        }
      });
    });
  }

  /* ========== 自检流程模拟 ========== */
  function initSelfCheck() {
    const runningPage = $('[data-selfcheck="running"]');
    if (!runningPage) return;

    const steps = $$('.step-item', runningPage);
    const demoSuccess = $('[data-demo="success"]');
    const demoFail = $('[data-demo="fail"]');
    const duration = parseInt(runningPage.dataset.duration, 10) || 3500;
    const failStep = parseInt(runningPage.dataset.failStep, 10) || 0;

    let current = 2; // 前两步已完成
    const total = steps.length;

    const timer = setInterval(() => {
      if (current < total) {
        steps[current].classList.remove('doing');
        if (failStep && current + 1 === failStep) {
          steps[current].classList.add('fail');
          steps[current].querySelector('.step-dot').textContent = '✕';
          clearInterval(timer);
          setTimeout(() => location.href = demoFail?.getAttribute('href') || 'check-server-fail.html', 600);
          return;
        }
        steps[current].classList.add('done');
        steps[current].querySelector('.step-dot').textContent = '✓';
        current++;
        if (current < total) steps[current].classList.add('doing');
      }
      if (current >= total) {
        clearInterval(timer);
        setTimeout(() => location.href = demoSuccess?.getAttribute('href') || 'check-server-success.html', 500);
      }
    }, duration / total);

    if (demoSuccess) demoSuccess.addEventListener('click', () => { clearInterval(timer); });
    if (demoFail) demoFail.addEventListener('click', () => { clearInterval(timer); });
  }

  /* ========== 演示悬浮导航（原型串联所有页面） ========== */
  function initDemoNavigator() {
    const screen = $('.phone-screen');
    if (!screen || $('[data-demo-nav]')) return;

    const nav = document.createElement('div');
    nav.dataset.demoNav = 'true';
    nav.innerHTML = `
      <style>
        .demo-nav { position: absolute; right: 10px; top: calc(var(--status-h) + var(--nav-h) + 8px); z-index: 999; }
        .demo-nav-btn {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(31,36,48,0.85); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          cursor: pointer; backdrop-filter: blur(4px);
        }
        .demo-nav-panel {
          position: absolute; right: 0; top: 54px;
          width: 220px; max-height: 70vh; overflow-y: auto;
          background: #fff; border-radius: 16px;
          padding: 14px; box-shadow: 0 8px 28px rgba(0,0,0,0.18);
          transform: scale(0.92); opacity: 0; pointer-events: none;
          transform-origin: right top;
          transition: all 0.2s ease;
        }
        .demo-nav-panel.show { transform: scale(1); opacity: 1; pointer-events: auto; }
        .demo-nav-panel .dn-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 10px; }
        .demo-nav-panel .dn-group { margin-bottom: 12px; }
        .demo-nav-panel .dn-group:last-child { margin-bottom: 0; }
        .demo-nav-panel .dn-label { font-size: 11px; color: var(--text-secondary); margin-bottom: 6px; }
        .demo-nav-panel .dn-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .demo-nav-panel .dn-list a {
          padding: 5px 10px; background: var(--bg-app); border-radius: 6px;
          font-size: 12px; color: var(--text-primary); text-decoration: none;
        }
        .demo-nav-panel .dn-list a:hover { background: var(--fy-blue-light); color: var(--fy-blue); }
      </style>
      <div class="demo-nav">
        <div class="demo-nav-btn">导航</div>
        <div class="demo-nav-panel">
          <div class="dn-title">演示导航</div>
          <div class="dn-group">
            <div class="dn-label">入口</div>
            <div class="dn-list">
              <a href="../demo.html">demo首页</a>
              <a href="../index.html">index总览</a>
            </div>
          </div>
          <div class="dn-group">
            <div class="dn-label">全局三 Tab</div>
            <div class="dn-list">
              <a href="tab-device-bt.html">设备·蓝牙</a>
              <a href="tab-device-4g.html">设备·4G</a>
              <a href="tab-tools.html">工具</a>
              <a href="tab-mine.html">我的</a>
              <a href="product-catalog.html">型号目录</a>
            </div>
          </div>
          <div class="dn-group">
            <div class="dn-label">模板 A（A01）</div>
            <div class="dn-list">
              <a href="device-a01-home.html">智能主机</a>
              <a href="device-a01-ac.html">空调管理</a>
              <a href="device-a01-ac-ctrl.html">空调控制</a>
              <a href="device-a01-config.html">设备配置</a>
              <a href="device-a01-server.html">原厂服务器</a>
              <a href="device-a01-client-server.html">客户服务器</a>
              <a href="device-a01-fw.html">固件升级</a>
              <a href="device-a01-debug.html">更多功能</a>
            </div>
          </div>
          <div class="dn-group">
            <div class="dn-label">E50G 空调诊断医生</div>
            <div class="dn-list">
              <a href="device-e50g.html">连接配置</a>
              <a href="device-e50g.html?brand=模拟器">模拟器连接</a>
              <a href="device-e50g-outdoor.html">室外机参数</a>
              <a href="device-e50g-indoor.html">内机列表</a>
              <a href="device-e50g-indoor-params.html">内机参数</a>
              <a href="device-e50g-ai.html">AI 诊断</a>
            </div>
          </div>
          <div class="dn-group">
            <div class="dn-label">其他机型调试</div>
            <div class="dn-list">
              <a href="device-e50g.html">E50G 空调诊断医生</a>
              <a href="device-f16g.html">F16G 线控器</a>
              <a href="device-b25lg.html">B25LG 线控器</a>
            </div>
          </div>
          <div class="dn-group">
            <div class="dn-label">自检与转化</div>
            <div class="dn-list">
              <a href="check-server-running.html">自检中</a>
              <a href="check-server-success.html">自检成功</a>
              <a href="check-server-fail.html">自检失败</a>
              <a href="finish-with-cta.html">调试完成</a>
              <a href="partner-jump.html?scene=gwdebug&entry=demo">合伙人</a>
              <a href="feedback.html">留言反馈</a>
            </div>
          </div>
          <div class="dn-group">
            <div class="dn-label">工具中心</div>
            <div class="dn-list">
              <a href="tool-fluoro-input.html">氟机选型</a>
              <a href="tool-fluoro-result.html">选型结果</a>
              <a href="tool-fluoro-submit.html">未收录提交</a>
              <a href="tool-wiring.html">接线指导</a>
              <a href="tool-videos.html">安装视频</a>
              <a href="tool-errcode.html">故障码</a>
            </div>
          </div>
        </div>
      </div>
    `;
    screen.appendChild(nav);

    const btn = nav.querySelector('.demo-nav-btn');
    const panel = nav.querySelector('.demo-nav-panel');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) panel.classList.remove('show');
    });
  }

  /* ========== 轮播与横滑指示器 ========== */
  function initCarousels() {
    // Banner 轮播：data-carousel 容器内 .promo-title 与 .promo-dots
    $$('[data-carousel]').forEach(box => {
      const titles = JSON.parse(box.dataset.carousel || '[]');
      if (!titles.length) return;
      const titleEl = $('.promo-title', box);
      const dots = $$('.promo-dots span', box);
      let idx = 0;
      setInterval(() => {
        idx = (idx + 1) % titles.length;
        if (titleEl) titleEl.textContent = titles[idx];
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }, 3000);
    });

    // 横滑卡片指示器：.chan-scroll 与 .chan-dots 同级
    $$('.chan-scroll').forEach(scroll => {
      const dots = scroll.nextElementSibling;
      if (!dots || !dots.classList.contains('chan-dots')) return;
      const dotItems = $$('span', dots);
      scroll.addEventListener('scroll', throttle(() => {
        const idx = Math.round(scroll.scrollLeft / (scroll.offsetWidth * 0.8));
        dotItems.forEach((d, i) => d.classList.toggle('active', i === idx));
      }, 100));
    });
  }

  /* ========== AC 批量操作 ========== */
  function initAcBatch() {
    const page = $('[data-ac-batch]');
    if (!page) return;
    const cells = $$('.ac-cell');

    const setAll = (on) => {
      cells.forEach(cell => {
        cell.classList.toggle('off', !on);
        const power = cell.querySelector('.ac-power');
        if (power) power.textContent = on ? '⏻' : '○';
      });
    };

    const allOnBtn = $('[data-batch="on"]');
    const allOffBtn = $('[data-batch="off"]');
    const batchSetBtn = $('[data-batch="set"]');

    if (allOnBtn) allOnBtn.addEventListener('click', (e) => { e.preventDefault(); setAll(true); showToast('已下发全开指令'); });
    if (allOffBtn) allOffBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const ok = await confirmDialog({ title: '全部关机', message: '确认关闭通道 1 全部空调？', confirmText: '确认全关', danger: true });
      if (ok) { setAll(false); showToast('已下发全关指令'); }
    });
    if (batchSetBtn) batchSetBtn.addEventListener('click', (e) => { e.preventDefault(); showToast('演示环境：批量设置弹层'); });
  }

  /* ========== 自检结果页：重试/返回 ========== */
  function initCheckResult() {
    $$('[data-check-retry]').forEach(btn => {
      btn.addEventListener('click', () => { location.href = 'check-server-running.html'; });
    });
  }

  function initPagePolish() {
    document.body.dataset.pageReady = 'true';

    $$('[data-toast]').forEach(el => {
      el.addEventListener('click', () => showToast(el.dataset.toast));
    });

    $$('[data-loading]').forEach(el => {
      el.addEventListener('click', () => {
        const label = el.dataset.loading || '处理中…';
        const original = el.textContent;
        el.disabled = true;
        el.classList.add('is-loading');
        el.textContent = label;
        setTimeout(() => {
          el.disabled = false;
          el.classList.remove('is-loading');
          el.textContent = original;
        }, parseInt(el.dataset.loadingDuration, 10) || 1200);
      });
    });

    $$('[data-back]').forEach(el => {
      el.addEventListener('click', (event) => {
        if (window.history.length > 1 && el.dataset.back !== 'link') {
          event.preventDefault();
          window.history.back();
        }
      });
    });

    $$('[data-copy]').forEach(el => {
      el.addEventListener('click', async () => {
        const value = el.dataset.copy;
        try {
          await navigator.clipboard.writeText(value);
          showToast('已复制到剪贴板');
        } catch (err) {
          showToast(value);
        }
      });
    });
  }
  function initAcControl() {
    const panel = $('[data-ac-ctrl]');
    if (!panel) return;

    const powerBtn = $('[data-ac-power]');
    const modeChips = $$('[data-ac-mode]');
    const fanChips = $$('[data-ac-fan]');
    const tempBox = $('[data-ac-temp]');

    if (powerBtn) {
      powerBtn.addEventListener('click', () => {
        const on = powerBtn.dataset.state !== 'on';
        powerBtn.dataset.state = on ? 'on' : 'off';
        powerBtn.textContent = on ? '关机' : '开机';
        powerBtn.classList.toggle('btn-danger', on);
        powerBtn.classList.toggle('btn-ghost', !on);
        showToast(on ? '空调已开机' : '空调已关机');
      });
    }

    modeChips.forEach(chip => chip.addEventListener('click', () => {
      modeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    }));

    fanChips.forEach(chip => chip.addEventListener('click', () => {
      fanChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    }));

    if (tempBox) {
      const display = $('.ac-temp-display', tempBox);
      $$('.stepper-minus, .stepper-plus', tempBox).forEach(btn => {
        btn.addEventListener('click', () => {
          let v = parseInt(display.textContent, 10) || 26;
          v += btn.classList.contains('stepper-plus') ? 1 : -1;
          v = Math.max(16, Math.min(30, v));
          display.textContent = v;
        });
      });
    }

    $$('[data-ac-submit]').forEach(btn => btn.addEventListener('click', () => {
      showToast('下发设置成功');
      setTimeout(() => history.back(), 400);
    }));
  }

  /* ========== 初始化入口 ========== */
  document.addEventListener('DOMContentLoaded', () => {
    initPagePolish();
    initChipGroups();
    initTabs();
    initModeSwitch();
    initSwitches();
    initForms();
    initSteppers();
    initCharCount();
    initDangerActions();
    initSelfCheck();
    initAcControl();
    initCarousels();
    initAcBatch();
    initCheckResult();
  });
})();
