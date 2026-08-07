(function () {
  var data = window.GWDBG_DATA;
  if (!data) return;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char];
    });
  }

  function query(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function signalLabel(rssi) {
    if (rssi >= -60) return '信号强';
    if (rssi >= -70) return '信号中';
    return '信号弱';
  }

  function flowHref(device) {
    var params = new URLSearchParams({ model: device.model, device: device.id, mode: 'bt' });
    if (device.model === 'FD01G') return 'device-fd01g.html?' + params;
    if (device.model === 'E50') return 'device-e50.html?' + params;
    return 'device-quick.html?' + params;
  }

  function connectHref(device) {
    return flowHref(device);
  }

  function renderBluetoothProducts() {
    var host = document.getElementById('product-list');
    if (!host) return;

    var html = '';
    data.products.forEach(function (product, index) {
      var devices = data.bluetoothDevices.filter(function (device) { return device.model === product.model; });
      var rows = devices.length ? devices.map(function (device) {
        return '<div class="device-row" data-device="' + escapeHtml(device.id) + '">' +
          '<div><div class="device-name">' + escapeHtml(device.name) + '</div>' +
          '<div class="device-id">' + escapeHtml(device.id) + '</div>' +
          '<div class="signal">' + signalLabel(device.rssi) + ' · ' + device.rssi + ' dBm</div></div>' +
          '<a class="connect-button" data-connect-model="' + device.model + '" data-connect-device="' + escapeHtml(device.id) + '" href="' + connectHref(device) + '">连接</a></div>';
      }).join('') : '<div class="empty">未发现设备</div>';

      html += '<section class="card product-card" id="model-' + product.model + '" data-model="' + product.model + '">' +
        '<button class="product-head" type="button" aria-expanded="false">' +
        '<img class="product-image" src="' + product.image + '" alt="' + product.model + '">' +
        '<span class="product-title">' + product.model + '</span></button></section>';
      if (index % 2 === 1 || index === data.products.length - 1) {
        var leftIndex = index % 2 === 1 ? index - 1 : index;
        var pair = data.products.slice(leftIndex, index + 1);
        pair.forEach(function (pairProduct) {
          var pairDevices = data.bluetoothDevices.filter(function (device) { return device.model === pairProduct.model; });
          var pairRows = pairDevices.length ? pairDevices.map(function (device) {
            return '<div class="device-row" data-device="' + escapeHtml(device.id) + '"><div><div class="device-name">' + escapeHtml(device.name) + '</div><div class="device-id">' + escapeHtml(device.id) + '</div><div class="signal">' + signalLabel(device.rssi) + ' · ' + device.rssi + ' dBm</div></div><a class="connect-button" data-connect-model="' + device.model + '" data-connect-device="' + escapeHtml(device.id) + '" href="' + connectHref(device) + '">连接</a></div>';
          }).join('') : '<div class="empty">未发现设备</div>';
          html += '<section class="card model-expansion" data-expansion-model="' + pairProduct.model + '"><div class="device-panel">' + pairRows + '</div></section>';
        });
      }
    });
    host.innerHTML = html;

    host.querySelectorAll('.product-head').forEach(function (button) {
      button.addEventListener('click', function () {
        var card = button.closest('.product-card');
        var next = !card.classList.contains('open');
        var model = card.dataset.model;
        host.querySelectorAll('.product-card.open').forEach(function (openCard) {
          openCard.classList.remove('open');
          openCard.querySelector('.product-head').setAttribute('aria-expanded', 'false');
        });
        host.querySelectorAll('.model-expansion.open').forEach(function (panel) { panel.classList.remove('open'); });
        card.classList.toggle('open', next);
        button.setAttribute('aria-expanded', String(next));
        var expansion = host.querySelector('[data-expansion-model="' + model + '"]');
        if (expansion) expansion.classList.toggle('open', next);
      });
    });

    host.querySelectorAll('.connect-button').forEach(function (link) {
      link.addEventListener('click', function () {
        if (!window.GWDBG_CONNECTION) return;
        window.GWDBG_CONNECTION.connect({ model: link.dataset.connectModel, device: link.dataset.connectDevice, transport: 'bt' });
      });
    });

    var selected = query('model').toUpperCase();
    if (selected === 'E50G') selected = 'E50';
    var target = selected && document.getElementById('model-' + selected);
    if (target) {
      target.classList.add('open');
      target.querySelector('.product-head').setAttribute('aria-expanded', 'true');
      var expansion = host.querySelector('[data-expansion-model="' + selected + '"]');
      if (expansion) expansion.classList.add('open');
      requestAnimationFrame(function () { target.scrollIntoView({ block: 'start' }); });
    }
  }

  window.renderBluetoothProducts = renderBluetoothProducts;
  renderBluetoothProducts();
})();
