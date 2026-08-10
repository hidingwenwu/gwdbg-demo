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
    '.aa-ball{position:absolute;z-index:400;width:56px;height:56px;border-radius:50%;' +
    'border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;touch-action:none;user-select:none;' +
    'background:linear-gradient(180deg,#2D6BE4 0%,#2457D6 100%);color:#fff;font-size:19px;font-weight:800;' +
    'box-shadow:0 8px 20px rgba(36,87,214,.32);transition:left .22s ease,top .22s ease,transform .15s ease,box-shadow .15s ease,opacity .22s ease;}' +
    '.aa-ball:active{transform:scale(.92);box-shadow:0 4px 12px rgba(36,87,214,.28);}' +
    '.aa-ball.dragging{transition:none;transform:scale(1.06);opacity:.96;}' +
    '.aa-ball.docked{opacity:.8;box-shadow:0 4px 12px rgba(36,87,214,.22);}' +
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
    { id: ++seq, type: 'agent', text: WELCOME }
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
    ball.innerHTML = '奕<span class="aa-dot"></span>';

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

    var BALL = 56, HALF = 28, EDGE_GAP = 14;
    function bottomGap() { return hasTabbar ? 80 : 104; }
    function topMin() { return 92; }
    function topMax() {
      var h = screen.getBoundingClientRect().height;
      return h - bottomGap() - BALL;
    }
    function placeDefault() {
      var rect = screen.getBoundingClientRect();
      ball.classList.remove('docked');
      ball.style.left = (rect.width - BALL - EDGE_GAP) + 'px';
      ball.style.top = topMax() + 'px';
    }
    requestAnimationFrame(placeDefault);

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

    var drag = null;
    ball.addEventListener('pointerdown', function (event) {
      drag = { x0: event.clientX, y0: event.clientY, left: ball.offsetLeft, top: ball.offsetTop, moved: false };
      if (ball.setPointerCapture) ball.setPointerCapture(event.pointerId);
      ball.classList.add('dragging');
      ball.classList.remove('docked');
      event.preventDefault();
    });
    ball.addEventListener('pointermove', function (event) {
      if (!drag) return;
      var dx = event.clientX - drag.x0, dy = event.clientY - drag.y0;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
      if (!drag.moved) return;
      var rect = screen.getBoundingClientRect();
      ball.style.left = Math.max(-HALF, Math.min(rect.width - HALF, drag.left + dx)) + 'px';
      ball.style.top = Math.max(topMin(), Math.min(topMax(), drag.top + dy)) + 'px';
    });
    ball.addEventListener('pointerup', function () {
      if (!drag) return;
      ball.classList.remove('dragging');
      var moved = drag.moved;
      drag = null;
      if (!moved) { open(); return; }
      var rect = screen.getBoundingClientRect();
      var dockRight = (ball.offsetLeft + HALF) >= rect.width / 2;
      ball.classList.add('docked');
      ball.style.left = (dockRight ? rect.width - HALF : -HALF) + 'px';
    });
    ball.addEventListener('pointercancel', function () {
      if (!drag) return;
      ball.classList.remove('dragging');
      drag = null;
      placeDefault();
    });
    mask.addEventListener('click', close);
    chat.querySelector('.aa-back').addEventListener('click', close);
    chat.querySelector('.aa-human').addEventListener('click', requestHuman);
    chat.querySelector('.aa-send').addEventListener('click', sendMsg);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.isComposing) sendMsg();
    });

    window.GWDBG_AI_ASSISTANT = { open: open, close: close };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
