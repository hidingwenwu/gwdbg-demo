(function (root) {
  var data = root.GWDBG_DATA;
  if (!data) return;

  var params = new URLSearchParams(root.location.search);
  var model = (params.get('model') || 'A01F').toUpperCase();
  if (model === 'E50G') model = 'E50';
  var product = data.products.find(function (item) { return item.model === model; }) || data.products[0];
  var mode = product.remote && params.get('mode') === '4g' ? '4g' : 'bt';
  var device = params.get('device') || product.model + '-DEVICE';

  function query(extra) {
    var next = new URLSearchParams({ model: product.model, device: device, mode: mode });
    Object.keys(extra || {}).forEach(function (key) { next.set(key, extra[key]); });
    return next.toString();
  }

  function link(page, extra) {
    return page + '?' + query(extra);
  }

  function menuItems() {
    if (product.family === 'fd01g') {
      return [
        ['home', '快速配置', 'device-fd01g.html', '配', 'c1'],
        ['more', '更多配置', 'device-fd01g-more.html', '置', 'c3']
      ];
    }
    return [
      ['quick', '快速配置', 'device-quick.html', '配', 'c1'],
      ['detail', '设备参数详情', 'device-detail.html', '详', 'c2'],
      ['more', '更多配置', 'device-more.html', '置', 'c3']
    ];
  }

  function itemHref(item) {
    if (item[2].indexOf('tab-') === 0) return item[2];
    if (item[0] === 'more' && product.family === 'fd01g') return link(item[2], { view: 'control' });
    if (item[0] === 'home' || item[0] === 'quick' || item[0] === 'detail' || item[0] === 'more') return link(item[2]);
    return link(item[2], { view: item[0] });
  }

  function currentKey() {
    var pathname = root.location.pathname;
    if (pathname.indexOf('device-quick') >= 0) return 'quick';
    if (pathname.indexOf('device-detail') >= 0) return 'detail';
    if (pathname.indexOf('device-more') >= 0 || pathname.indexOf('device-fd01g-more') >= 0) return 'more';
    if (pathname.indexOf('device-setting') >= 0 || pathname.indexOf('device-a01-ac') >= 0) return 'more';
    if (pathname.indexOf('device-e50.html') >= 0 || pathname.indexOf('device-fd01g.html') >= 0) return 'home';
    return params.get('view') || params.get('setting') || '';
  }

  function closeMenu() {
    document.body.classList.remove('side-menu-open');
  }

  function openMenu() {
    document.body.classList.add('side-menu-open');
  }

  function renderMenu() {
    var host = document.getElementById('side-menu');
    if (!host) return;
    var active = currentKey();
    host.innerHTML = '<div class="side-menu-body">' +
      '<div class="menu-switch-wrap"><a class="menu-switch-btn" href="tab-device-bt.html"><span class="switch-icon">⇄</span>切换其他产品</a></div>' +
      '<div class="side-nav-label">设备功能</div>' +
      '<nav class="side-nav">' + menuItems().map(function (item) {
        return '<a class="side-nav-item' + (active === item[0] ? ' active' : '') + '" href="' + itemHref(item) + '"><i class="side-nav-ic ' + item[4] + '">' + item[3] + '</i><span>' + item[1] + '</span><b>›</b></a>';
      }).join('') + '</nav>' +
      '<div class="side-nav-label">应用</div>' +
      '<div class="side-app-entry">' +
      '<a class="side-app-btn" href="tab-tools.html"><span class="side-app-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span><span class="side-app-label">工具</span></a>' +
      '<a class="side-app-btn mine" href="tab-mine.html"><span class="side-app-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span class="side-app-label">我的</span></a>' +
      '</div></div>';
  }

  var confirmAction = null;
  function showConfirm(title, message, action) {
    var modal = document.getElementById('connection-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'connection-modal';
      modal.className = 'modal-layer';
      modal.innerHTML = '<div class="modal-mask" data-modal-close></div><section class="confirm-dialog"><h2 id="connection-modal-title"></h2><p id="connection-modal-message"></p><div class="dialog-actions"><button class="button" data-modal-close type="button">取消</button><button class="button primary" id="connection-confirm" type="button">确认断开</button></div></section>';
      document.querySelector('.app-shell').appendChild(modal);
    }
    document.getElementById('connection-modal-title').textContent = title;
    document.getElementById('connection-modal-message').textContent = message;
    document.getElementById('connection-confirm').textContent = title === '切换到 4G 模式' ? '断开并切换' : '确认断开';
    confirmAction = action;
    modal.classList.add('show');
  }

  function hideConfirm() {
    var modal = document.getElementById('connection-modal');
    if (modal) modal.classList.remove('show');
    confirmAction = null;
  }

  function disconnectNow() {
    if (root.GWDBG_CONNECTION) root.GWDBG_CONNECTION.disconnectBluetooth();
    root.location.href = 'tab-device-bt.html';
  }

  function confirmDisconnect() {
    showConfirm('断开蓝牙连接', '断开后将返回设备列表，当前页面中的未保存设置不会保留。', disconnectNow);
  }

  function switchTransport(nextMode) {
    if (!product.remote || nextMode === mode) return;
    function commit() {
      if (root.GWDBG_CONNECTION) root.GWDBG_CONNECTION.switchTransport(nextMode, { model: product.model, device: device });
      var next = new URL(root.location.href);
      next.searchParams.set('model', product.model);
      next.searchParams.set('device', device);
      next.searchParams.set('mode', nextMode);
      root.location.href = next.pathname.split('/').pop() + '?' + next.searchParams.toString();
    }
    if (mode === 'bt' && nextMode === '4g') {
      showConfirm('切换到 4G 模式', '切换通讯方式前需要断开当前蓝牙连接。', commit);
    } else commit();
  }

  function initialize() {
    if (root.GWDBG_CONNECTION) {
      var state = root.GWDBG_CONNECTION.get();
      if (!state || state.model !== product.model || state.device !== device || state.transport !== mode) {
        root.GWDBG_CONNECTION.connect({ model: product.model, device: device, transport: mode });
      }
    }
    renderMenu();
    var trigger = document.getElementById('menu-trigger');
    if (trigger) trigger.addEventListener('click', openMenu);
    var overlay = document.getElementById('side-menu-overlay');
    if (overlay) overlay.addEventListener('click', closeMenu);
    var navBack = document.getElementById('nav-back');
    if (navBack) {
      navBack.addEventListener('click', function () {
        if (root.history.length > 1) { root.history.back(); return; }
        var pathname = root.location.pathname;
        if (product.family === 'fd01g') {
          root.location.href = pathname.indexOf('device-fd01g-more') >= 0 ? link('device-fd01g.html') : 'tab-device-bt.html';
        } else if (pathname.indexOf('device-quick') >= 0) {
          root.location.href = 'tab-device-bt.html';
        } else {
          root.location.href = link('device-quick.html');
        }
      });
    }
    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-modal-close]')) hideConfirm();
      if (event.target.id === 'connection-confirm' && confirmAction) {
        var action = confirmAction;
        hideConfirm();
        action();
      }
    });
  }

  root.GWDBG_WORKBENCH = {
    product: product,
    model: product.model,
    device: device,
    mode: mode,
    link: link,
    openMenu: openMenu,
    closeMenu: closeMenu,
    showConfirm: showConfirm,
    confirmDisconnect: confirmDisconnect,
    switchTransport: switchTransport
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})(window);
