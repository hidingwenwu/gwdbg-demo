(function () {
  var data = window.GWDBG_DATA;
  var workbench = window.GWDBG_WORKBENCH;
  if (!data || !workbench) return;

  var product = workbench.product;
  var deviceId = workbench.device;
  var mode = workbench.mode;
  var params = new URLSearchParams(window.location.search);

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function hero(showDetailLink) {
    return '<section class="card hero-card"><div><div class="hero-model">' + product.model + '</div>' +
      '<div class="hero-name">' + product.category + '<br>' + escapeHtml(deviceId) + '</div>' +
      '<div class="hero-status-row"><span class="hero-status">已连接 · ' + (mode === '4g' ? '4G 远程' : '蓝牙') + '</span>' +
      (mode === 'bt' ? '<button class="hero-disconnect" id="hero-disconnect" type="button">断开连接</button>' : '') +
      '</div></div>' +
      '<div class="hero-side"><img class="hero-image" src="' + product.image + '" alt="' + product.model + '">' +
      (showDetailLink ? '<a class="hero-detail-link" id="detail-link" href="' + workbench.link('device-detail.html') + '">进入设备详情 ›</a>' : '') +
      '</div></section>';
  }

  function bindHeroDisconnect() {
    var button = document.getElementById('hero-disconnect');
    if (button) button.addEventListener('click', workbench.confirmDisconnect);
  }

  function renderQuick() {
    var host = document.getElementById('quick-page');
    if (!host || product.family === 'fd01g' || product.family === 'e50') return;
    setText('page-title', '快速配置');
    document.getElementById('device-hero').innerHTML = hero(true);
    bindHeroDisconnect();
    document.getElementById('quick-tasks').innerHTML = product.quickTasks.map(function (task, index) {
      var href = task.key === 'control' ? workbench.link('device-a01-ac.html') : workbench.link('device-setting.html', { setting: task.setting });
      return '<a class="task-row" data-task="' + task.key + '" href="' + href + '">' +
        '<span class="task-index">' + (index + 1) + '</span><span><span class="task-title">' + task.title + '</span>' +
        '<span class="task-meta">' + task.meta + '</span></span><span class="task-state">配置</span></a>';
    }).join('');
    document.getElementById('more-link').href = workbench.link('device-more.html');
    document.getElementById('quick-resources').innerHTML =
      '<a class="list-row" href="tool-videos.html?model=' + product.model + '"><span class="list-icon">播</span><span class="list-title">安装调试视频</span><span class="row-arrow">›</span></a>' +
      '<a class="list-row" href="product-intro.html?model=' + product.model + '"><span class="list-icon">案</span><span class="list-title">产品方案介绍</span><span class="row-arrow">›</span></a>';
  }

  function renderMore() {
    var host = document.getElementById('more-page');
    if (!host || product.family === 'fd01g' || product.family === 'e50') return;
    setText('page-title', '更多配置');
    document.getElementById('device-hero').innerHTML = hero(true);
    bindHeroDisconnect();
    document.getElementById('more-quick').innerHTML = product.quickTasks.map(function (task) {
      var href = task.key === 'control' ? workbench.link('device-a01-ac.html') : workbench.link('device-setting.html', { setting: task.setting });
      var icons = { control: '控', upgrade: '升', server: '服', meter: '表', valve: '阀', brand: '牌', 'batch-brand': '牌' };
      return '<a class="list-row" href="' + href + '"><span class="list-icon">' + (icons[task.key] || '设') + '</span><span class="list-title">' + task.title + '</span><span class="row-arrow">›</span></a>';
    }).join('');
    document.getElementById('more-settings').innerHTML = product.moreSettings.map(function (setting) {
      return '<a class="list-row" href="' + workbench.link('device-setting.html', { setting: setting.key }) + '"><span class="list-icon">设</span><span class="list-title">' + setting.title + '</span><span class="row-arrow">›</span></a>';
    }).join('');
  }

  function deviceParameters() {
    var isF16g = product.model === 'F16G';
    var rows = [
      ['设备型号', product.model], ['设备名称', deviceId], ['连接方式', mode === '4g' ? '4G 远程' : '蓝牙'],
      ['在线状态', '在线'], ['运行状态', '正常'], ['固件版本', product.family === 'indoor' ? 'V1.8.6' : 'V2.6.18'],
      ['硬件版本', 'V1.3'], ['信号强度', mode === '4g' ? '-71 dBm' : '-58 dBm'], ['设备时间', '2026-07-24 17:41:26'],
      ['累计运行时间', '2,846 小时'],
      isF16g ? ['管制线阀类型', '2管制2线阀'] : ['空调品牌', '格力'],
      ['已识别内机', (product.channels || 1) * 2 + ' 台']
    ];
    if (isF16g) rows.push(['温度传感器补偿', '正 0℃']);
    if (product.family === 'outdoor') rows.push(['通道数量', product.channels + ' 路'], ['电表通讯', '正常']);
    if (product.family === 'single-outdoor') rows.push(['通道数量', '1 路']);
    return rows;
  }

  function renderDetail() {
    var host = document.getElementById('detail-page');
    if (!host || product.family === 'fd01g' || product.family === 'e50') return;
    setText('page-title', '设备详情');
    document.getElementById('device-hero').innerHTML = hero(false);
    bindHeroDisconnect();
    document.getElementById('device-parameters').innerHTML = deviceParameters().map(function (row) {
      return '<div class="parameter-row"><span>' + row[0] + '</span><strong>' + escapeHtml(row[1]) + '</strong></div>';
    }).join('');
    document.getElementById('more-settings').innerHTML = product.moreSettings.map(function (setting) {
      return '<a class="list-row" href="' + workbench.link('device-setting.html', { setting: setting.key }) + '"><span class="list-icon">设</span><span class="list-title">' + setting.title + '</span><span class="row-arrow">›</span></a>';
    }).join('');
  }

  function switchField(label, checked) {
    return '<label class="switch-field"><span>' + label + '</span><input type="checkbox"' + (checked ? ' checked' : '') + '><i></i></label>';
  }

  function brandOptions() {
    return '<option>格力</option><option>美的</option><option>海尔</option><option>大金</option><option>日立</option><option>海信</option><option>三菱重工</option><option>模拟器</option>';
  }

  function channelCard(channel, isSingle) {
    return '<section class="card channel-card" data-channel="' + channel + '"><div class="channel-head"><strong>' + (isSingle ? '空调参数' : '通道 ' + channel) + '</strong>' + switchField('启用通道', true) + '</div>' +
      '<div class="field"><label>空调品牌</label><select class="channel-brand">' + brandOptions() + '</select></div>' +
      '<div class="field"><label>协议属性</label><select><option>主</option><option>从</option></select></div>' +
      '<div class="field simulator-count" hidden><label>模拟器数量</label><input type="number" min="1" max="160" value="1" inputmode="numeric"></div></section>';
  }

  function channelFields(setting) {
    var count = setting === 'brand-batch' || setting === 'channel' ? product.channels : 1;
    var result = '<div class="channel-stack">';
    for (var index = 1; index <= count; index += 1) result += channelCard(index, count === 1);
    return result + '</div>';
  }

  function serverFields() {
    var protocols = '<option>JSON</option><option>MODBUSTCP_V2.6</option><option>MODBUSTCPCLIENT_V2.6</option><option>MODBUSRTU_V2.6</option>';
    return '<div class="server-tabs" role="tablist"><button class="server-tab active" data-server-tab="ip" type="button">服务器 IP 配置</button><button class="server-tab" data-server-tab="domain" type="button">服务器域名配置</button></div>' +
      '<section class="card form-card server-pane active" data-server-pane="ip">' + switchField('启用服务器', true) +
      '<div class="field"><label>服务器类型</label><select><option>本地 TCP</option><option>云端 MQTT</option></select></div>' +
      '<div class="field"><label>协议类型</label><select>' + protocols + '</select></div>' +
      '<div class="field"><label>服务器 IP</label><input value="192.168.1.188" inputmode="decimal"></div>' +
      '<div class="field"><label>端口</label><input value="1883" inputmode="numeric"></div>' +
      '<div class="field"><label>用户名</label><input value="feiyi_gateway"></div><div class="field"><label>密码</label><input type="password" value="12345678"></div>' +
      '<div class="field"><label>发布主题</label><input value="fy/device/up"></div><div class="field"><label>订阅主题</label><input value="fy/device/down"></div></section>' +
      '<section class="card form-card server-pane" data-server-pane="domain">' + switchField('启用服务器', true) +
      '<div class="field"><label>服务器类型</label><select><option>云端 MQTT</option><option>本地 TCP</option></select></div>' +
      '<div class="field"><label>协议类型</label><select>' + protocols + '</select></div>' +
      '<div class="field"><label>服务器域名</label><input value="iot.feiyi-tech.com"></div>' +
      '<div class="field"><label>端口</label><input value="1883" inputmode="numeric"></div>' +
      '<div class="field"><label>用户名</label><input value="feiyi_gateway"></div><div class="field"><label>密码</label><input type="password" value="12345678"></div>' +
      '<div class="field"><label>发布主题</label><input value="fy/device/up"></div><div class="field"><label>订阅主题</label><input value="fy/device/down"></div></section>';
  }

  function fieldsFor(setting) {
    if (setting === 'brand' || setting === 'brand-batch' || setting === 'channel') return channelFields(setting);
    if (setting === 'valve') return '<section class="card form-card"><div class="field"><label>管制线阀类型</label><select><option>2管制2线阀</option><option>2管制3线阀</option><option>4管制</option></select></div></section>';
    if (setting === 'temp-comp') return '<section class="card form-card"><div class="field"><label>补偿值的正负</label><select><option>正</option><option>负</option></select></div><div class="field"><label>补偿温度值</label><input type="number" min="0" max="9" value="0" inputmode="numeric"></div></section><p class="field-note">补偿值正负：其他温度传感器显示值 - 温控器显示室内温度值</p>';
    if (setting === 'server') return serverFields();
    if (setting === 'meter') return '<section class="card form-card"><div class="field"><label>电表类型</label><select><option>三相四线</option><option>单相电表</option></select></div><div class="field"><label>电表地址</label><input value="1" inputmode="numeric"></div><div class="field"><label>波特率</label><select><option>9600</option><option>4800</option></select></div><div class="field"><label>数据位</label><select><option>8</option><option>7</option></select></div><div class="field"><label>校验位</label><select><option>无校验</option><option>偶校验</option></select></div><div class="field"><label>协议</label><select><option>DL/T 645-2007</option><option>Modbus RTU</option></select></div></section>';
    if (setting === 'upgrade') return '<section class="card form-card"><div class="field"><label>当前版本</label><input value="V2.6.18" readonly></div><div class="field"><label>最新版本</label><input value="V2.7.0" readonly></div><div class="field"><label>升级包</label><input value="正式版 2026.07" readonly></div></section>';
    if (setting === 'network') return '<section class="card form-card"><div class="field"><label>地址获取</label><select><option>DHCP</option><option>静态 IP</option></select></div><div class="field"><label>本机 IP</label><input value="192.168.1.100"></div><div class="field"><label>子网掩码</label><input value="255.255.255.0"></div><div class="field"><label>网关</label><input value="192.168.1.1"></div></section>';
    if (setting === 'rtu') return '<section class="card form-card"><div class="field"><label>从机地址</label><input value="1" inputmode="numeric"></div><div class="field"><label>波特率</label><select><option>9600</option><option>19200</option></select></div><div class="field"><label>校验位</label><select><option>无校验</option><option>奇校验</option><option>偶校验</option></select></div></section>';
    if (setting === 'diagnosis') return '<section class="card check-list"><div><span>主控通讯</span><strong class="ok">正常</strong></div><div><span>空调总线</span><strong class="ok">正常</strong></div><div><span>网络通讯</span><strong class="ok">正常</strong></div><div><span>存储器</span><strong class="ok">正常</strong></div></section>';
    if (setting === 'info') return '<section class="card parameter-card"><div class="parameter-row"><span>序列号</span><strong>FY' + product.model + '26072401</strong></div><div class="parameter-row"><span>MAC 地址</span><strong>3C:71:BF:62:B8:1C</strong></div><div class="parameter-row"><span>生产日期</span><strong>2026-06-18</strong></div></section>';
    if (setting === 'reset') return '<section class="card warning-block"><strong>恢复默认设置</strong><p>设备参数将恢复为出厂状态，连接信息保留。</p></section>';
    return '<section class="card form-card"><div class="field"><label>工作模式</label><select><option>自动</option><option>手动</option></select></div><div class="field"><label>上报周期</label><select><option>60 秒</option><option>30 秒</option><option>5 分钟</option></select></div><div class="field"><label>故障复位</label><select><option>自动</option><option>手动</option></select></div></section>';
  }

  function titleFor(setting) {
    var task = product.quickTasks.find(function (item) { return item.setting === setting || item.key === setting; });
    var more = product.moreSettings.find(function (item) { return item.key === setting; });
    return task ? task.title : more ? more.title : '设备设置';
  }

  function setupFieldInteractions() {
    document.querySelectorAll('.channel-brand').forEach(function (select) {
      function update() {
        var row = select.closest('[data-channel]').querySelector('.simulator-count');
        row.hidden = select.value !== '模拟器';
      }
      select.addEventListener('change', update);
      update();
    });
    document.querySelectorAll('[data-server-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('[data-server-tab]').forEach(function (item) { item.classList.toggle('active', item === tab); });
        document.querySelectorAll('[data-server-pane]').forEach(function (pane) { pane.classList.toggle('active', pane.dataset.serverPane === tab.dataset.serverTab); });
      });
    });
  }

  function renderSetting() {
    var host = document.getElementById('setting-page');
    if (!host || product.family === 'fd01g' || product.family === 'e50') return;
    var allowedSettings = product.quickTasks.map(function (item) { return item.setting || item.key; })
      .concat(product.moreSettings.map(function (item) { return item.key; }));
    var setting = params.get('setting') || allowedSettings[0];
    if (setting === 'control') {
      window.location.replace(workbench.link('device-a01-ac.html'));
      return;
    }
    if (allowedSettings.indexOf(setting) < 0) setting = allowedSettings[0];
    setText('page-title', titleFor(setting));
    document.getElementById('setting-content').innerHTML = fieldsFor(setting);
    setupFieldInteractions();
    var action = document.getElementById('save-setting');
    action.textContent = setting === 'server' ? '保存并检测通讯' : setting === 'upgrade' ? '开始升级' : setting === 'diagnosis' ? '重新检测' : (setting === 'valve' || setting === 'temp-comp') ? '确定' : '保存';
    action.addEventListener('click', function () {
      var result = document.getElementById('setting-result');
      result.hidden = false;
      action.disabled = true;
      if (setting === 'server') {
        result.textContent = '检测通讯中';
        result.className = 'result-box checking';
        setTimeout(function () { result.textContent = '通讯正常'; result.className = 'result-box success'; action.disabled = false; }, 900);
      } else if (setting === 'upgrade') {
        result.textContent = '固件已是最新版本'; result.className = 'result-box success'; action.disabled = false;
      } else {
        result.textContent = setting === 'diagnosis' ? '检测完成，设备通讯正常' : '已保存并下发设备';
        result.className = 'result-box success'; action.disabled = false;
      }
    });
  }

  renderQuick();
  renderDetail();
  renderMore();
  renderSetting();
})();
