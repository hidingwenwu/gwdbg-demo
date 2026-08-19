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
      '<div class="hero-name">' + escapeHtml(deviceId) + '</div>' +
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
    var series = data.guideSeries.find(function (item) { return item.rep === product.model || item.models.split(' / ').indexOf(product.model) >= 0; }) || data.guideSeries[0];
    document.getElementById('guide-link').href = 'product-intro.html?series=' + series.key;
  }

  function renderMore() {
    var host = document.getElementById('more-page');
    if (!host || product.family === 'fd01g' || product.family === 'e50') return;
    setText('page-title', '更多配置');
    document.getElementById('device-hero').innerHTML = hero(true);
    bindHeroDisconnect();
    document.getElementById('more-quick').innerHTML = product.quickTasks.map(function (task) {
      var href = task.key === 'control' ? workbench.link('device-a01-ac.html') : workbench.link('device-setting.html', { setting: task.setting });
      var icons = { control: '控', upgrade: '升', server: '服', meter: '表', valve: '阀', brand: '牌', 'batch-brand': '牌', rtu: '串', name: '名', u0x: '前', 'temp-comp': '补', 'group-addr': '群', 'rtu-sensor': '传', 'temp-source': '温', 'sensor-list': '感', capacity: '容', eev: '阀', 'ac-indoor': '内', 'ac-outdoor': '外', 'ir-library': '码', current: '流', reboot: '启', 'reset-factory': '厂', onekey: '键', wan: 'W', lan: 'L', 'time-calib': '时', index: '号', resistor: '阻', 'log-upload': '志', bacnet: 'B', dlt645: '表', sn: 'SN', net4g: '4G', hardware: '硬', 'debug-auto': '连', 'debug-sniffer': '抓', 'debug-param': '参', 'ac-down': '下', 'quick-program': '程', 'modbus-offline': '离', 'port1-modbus': '端', threeway: '三', 'temp-limit': '限', 'vpp-addr': 'V', 'vpp-collector': 'V', 'modbus-sub': '子', 'resistor-param': '阻', 'power-judge': '判', simulator: '模', 'threeway-time': '三', 'channel-config': '通', 'g4-basic': 'G', 'g4-signal': 'G', 'unit-upload': '传', 'attr-config': '属', 'net-config': '配', 'iface-config': '接', 'jog-control': '点', 'up-iface': '对', rs485: '串', jog485: '点', desc: '描', 'tbf-upload': '传', 'vfd-debug': '调', 'vfd-params': '频', ethernet: 'E' };
      return '<a class="list-row" href="' + href + '"><span class="list-icon">' + (icons[task.key] || '设') + '</span><span class="list-title">' + task.title + '</span><span class="row-arrow">›</span></a>';
    }).join('');
    document.getElementById('more-settings').innerHTML = product.moreSettings.map(function (setting) {
      return '<a class="list-row" href="' + workbench.link('device-setting.html', { setting: setting.key }) + '"><span class="list-icon">设</span><span class="list-title">' + setting.title + '</span><span class="row-arrow">›</span></a>';
    }).join('');
  }

  function deviceParameters() {
    var isF16g = product.model === 'F16G';
    var isMeter = product.family === 'meter';
    var isFq = product.family === 'fq';
    var rows = [
      ['设备型号', product.model], ['设备名称', deviceId], ['连接方式', mode === '4g' ? '4G 远程' : '蓝牙'],
      ['在线状态', '在线'], ['运行状态', '正常'], ['固件版本', product.family === 'indoor' ? 'V1.8.6' : 'V2.6.18'],
      ['硬件版本', 'V1.3'], ['信号强度', mode === '4g' ? '-71 dBm' : '-58 dBm'], ['设备时间', '2026-08-19 10:26:18'],
      ['累计运行时间', '2,846 小时'],
      isF16g ? ['管制线阀类型', '2管制2线阀'] : isMeter ? ['电表协议', 'DL/T 645-2007'] : isFq ? ['群控系统', '冷水机房'] : ['空调品牌', '格力'],
      isMeter ? ['已抄读电表', '32 台'] : isFq ? ['已接入设备', '5 台'] : ['已识别内机', (product.family === 'indoor' ? 1 : (product.channels || 1) * 8) + ' 台']
    ];
    if (isF16g) rows.push(['温度传感器补偿', '正 0℃']);
    if (product.family === 'outdoor' || product.family === 'water') {
      rows.push(['通道数量', product.channels + ' 路']);
      if (product.quickTasks.some(function (task) { return task.key === 'meter'; })) rows.push(['电表通讯', '正常']);
    }
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
    if (setting === 'server' || setting === 'server-factory') return serverFields();
    if (setting === 'meter') return '<section class="card form-card"><div class="field"><label>电表类型</label><select><option>三相四线</option><option>单相电表</option></select></div><div class="field"><label>电表地址</label><input value="1" inputmode="numeric"></div><div class="field"><label>波特率</label><select><option>9600</option><option>4800</option></select></div><div class="field"><label>数据位</label><select><option>8</option><option>7</option></select></div><div class="field"><label>校验位</label><select><option>无校验</option><option>偶校验</option></select></div><div class="field"><label>协议</label><select><option>DL/T 645-2007</option><option>Modbus RTU</option></select></div></section>';
    if (setting === 'upgrade') return '<section class="card form-card"><div class="field"><label>当前版本</label><input value="V2.6.18" readonly></div><div class="field"><label>最新版本</label><input value="V2.7.0" readonly></div><div class="field"><label>升级包</label><input value="正式版 2026.07" readonly></div></section>';
    if (setting === 'network') return '<section class="card form-card"><div class="field"><label>地址获取</label><select><option>DHCP</option><option>静态 IP</option></select></div><div class="field"><label>本机 IP</label><input value="192.168.1.100"></div><div class="field"><label>子网掩码</label><input value="255.255.255.0"></div><div class="field"><label>网关</label><input value="192.168.1.1"></div></section>';
    if (setting === 'rtu') return '<section class="card form-card"><div class="field"><label>从机地址</label><input value="1" inputmode="numeric"></div><div class="field"><label>波特率</label><select><option>9600</option><option>19200</option></select></div><div class="field"><label>校验位</label><select><option>无校验</option><option>奇校验</option><option>偶校验</option></select></div></section>';
    if (setting === 'diagnosis') return '<section class="card check-list"><div><span>主控通讯</span><strong class="ok">正常</strong></div><div><span>空调总线</span><strong class="ok">正常</strong></div><div><span>网络通讯</span><strong class="ok">正常</strong></div><div><span>存储器</span><strong class="ok">正常</strong></div></section>';
    if (setting === 'info') return '<section class="card parameter-card"><div class="parameter-row"><span>序列号</span><strong>FY' + product.model + '26072401</strong></div><div class="parameter-row"><span>MAC 地址</span><strong>3C:71:BF:62:B8:1C</strong></div><div class="parameter-row"><span>生产日期</span><strong>2026-06-18</strong></div></section>';
    if (setting === 'reset') return '<section class="card warning-block"><strong>恢复默认设置</strong><p>设备参数将恢复为出厂状态，连接信息保留。</p></section>';
    if (setting === 'onekey') return '<section class="card form-card"><p class="field-note">一键完成网络、服务器与协议参数的批量下发，适合新设备首次部署。</p></section>';
    if (setting === 'wan') return '<section class="card form-card"><div class="field"><label>连接方式</label><select><option>4G 网络</option><option>以太网</option><option>PPPoE 拨号</option></select></div><div class="field"><label>WAN IP</label><input value="10.20.1.35"></div><div class="field"><label>子网掩码</label><input value="255.255.255.0"></div><div class="field"><label>网关</label><input value="10.20.1.1"></div></section>';
    if (setting === 'lan') return '<section class="card form-card"><div class="field"><label>地址获取</label><select><option>DHCP</option><option>静态 IP</option></select></div><div class="field"><label>LAN IP</label><input value="192.168.1.1"></div><div class="field"><label>子网掩码</label><input value="255.255.255.0"></div></section>';
    if (setting === 'net4g') return '<section class="card form-card"><div class="field"><label>APN</label><input value="ctnet"></div><div class="field"><label>用户名</label><input value="card"></div><div class="field"><label>密码</label><input type="password" value="card123"></div><div class="field"><label>拨号方式</label><select><option>自动拨号</option><option>手动拨号</option></select></div></section>';
    if (setting === 'time-calib') return '<section class="card form-card"><div class="field"><label>设备当前时间</label><input value="2026-08-19 10:26:18" readonly></div><div class="field"><label>手机当前时间</label><input value="2026-08-19 10:26:32" readonly></div></section>';
    if (setting === 'index') return '<section class="card form-card"><div class="field"><label>设备索引号</label><input type="number" min="1" max="255" value="1" inputmode="numeric"></div></section>';
    if (setting === 'resistor') return '<section class="card form-card">' + switchField('终端电阻（120Ω）', true) + switchField('上拉电阻', false) + switchField('下拉电阻', false) + '</section>';
    if (setting === 'log-upload') return '<section class="card form-card">' + switchField('启用日志上传', true) + '<div class="field"><label>日志级别</label><select><option>常规</option><option>详细</option></select></div></section>';
    if (setting === 'reset-factory') return '<section class="card warning-block"><strong>恢复出厂设置</strong><p>设备参数将全部恢复为出厂状态（含服务器、协议与码库配置），恢复后需重新调试。</p></section>';
    if (setting === 'bacnet') return '<section class="card form-card">' + switchField('启用 BACnet', false) + '<div class="field"><label>设备实例号</label><input type="number" min="0" max="4194303" value="77" inputmode="numeric"></div><div class="field"><label>波特率</label><select><option>9600</option><option>19200</option><option>38400</option><option>76800</option></select></div></section>';
    if (setting === 'dlt645') return '<section class="card form-card"><div class="field"><label>表地址</label><input value="000000000001" inputmode="numeric"></div><div class="field"><label>波特率</label><select><option>2400</option><option>9600</option></select></div><div class="field"><label>校验位</label><select><option>偶校验</option><option>无校验</option></select></div></section>';
    if (setting === 'sn') return '<section class="card form-card"><div class="field"><label>客户 SN</label><input value="FY-' + product.model + '-20260701"></div></section>';
    if (setting === 'debug-auto') return '<section class="card form-card">' + switchField('自动连接上一次设备', true) + '</section>';
    if (setting === 'debug-sniffer') return '<section class="card parameter-card"><div class="parameter-row"><span>抓码状态</span><strong>待开始</strong></div><div class="parameter-row"><span>已抓取报文</span><strong>0 帧</strong></div></section>';
    if (setting === 'debug-param') return '<section class="card parameter-card"><div class="parameter-row"><span>协议版本</span><strong>V2.6</strong></div><div class="parameter-row"><span>参数校验</span><strong class="ok">正常</strong></div></section>';
    if (setting === 'u0x') return '<section class="card form-card"><div class="field"><label>前导符</label><input value="U0X"></div></section>';
    if (setting === 'group-addr') return '<section class="card form-card"><div class="field"><label>群控地址</label><input type="number" min="1" max="255" value="1" inputmode="numeric"></div></section>';
    if (setting === 'rtu-sensor') return '<section class="card form-card"><div class="field"><label>传感器地址</label><input type="number" min="1" max="247" value="1" inputmode="numeric"></div><div class="field"><label>寄存器地址</label><input type="number" value="0" inputmode="numeric"></div><div class="field"><label>数据类型</label><select><option>有符号 16 位</option><option>无符号 16 位</option></select></div></section>';
    if (setting === 'temp-source') return '<section class="card form-card"><div class="field"><label>屏幕室内温度来源</label><select><option>本机温度传感器</option><option>ModbusRTU 传感器</option><option>空调回风温度</option></select></div></section>';
    if (setting === 'sensor-list') return '<section class="card parameter-card"><div class="parameter-row"><span>温度传感器</span><strong>26.4 ℃ · 在线</strong></div><div class="parameter-row"><span>湿度传感器</span><strong>61 % · 在线</strong></div></section>';
    if (setting === 'capacity') return '<section class="card parameter-card"><div class="parameter-row"><span>码库容量</span><strong>256 KB / 512 KB</strong></div><div class="parameter-row"><span>配置容量</span><strong>12 / 64 条</strong></div></section>';
    if (setting === 'eev') return '<section class="card form-card"><div class="field"><label>控制模式</label><select><option>自动</option><option>手动</option></select></div><div class="field"><label>手动开度</label><input type="number" min="0" max="480" value="200" inputmode="numeric"></div></section>';
    if (setting === 'ac-indoor' || setting === 'ac-outdoor') return channelFields(setting);
    if (setting === 'ac-down') return '<section class="card form-card"><div class="field"><label>温度下限</label><input type="number" value="16" inputmode="numeric"></div><div class="field"><label>温度上限</label><input type="number" value="30" inputmode="numeric"></div>' + switchField('锁定控制', false) + '</section>';
    if (setting === 'quick-program') return '<section class="card form-card"><div class="field"><label>快速配置程序</label><select><option>通用集控程序</option><option>计费专用程序</option></select></div></section>';
    if (setting === 'modbus-offline') return '<section class="card form-card"><div class="field"><label>离线配置文件</label><input value="Modbus 离线配置包 V1.2" readonly></div></section>';
    if (setting === 'port1-modbus') return '<section class="card form-card"><div class="field"><label>从机地址</label><input value="1" inputmode="numeric"></div><div class="field"><label>波特率</label><select><option>9600</option><option>19200</option></select></div><div class="field"><label>校验位</label><select><option>无校验</option><option>奇校验</option><option>偶校验</option></select></div></section>';
    if (setting === 'threeway') {
      var threewayRows = '';
      for (var tw = 1; tw <= (product.channels || 1); tw += 1) threewayRows += '<div class="parameter-row"><span>三通阀 · 通道 ' + tw + '</span><strong>开启</strong></div>';
      return '<section class="card form-card"><div class="field"><label>三通状态</label><select><option>开启</option><option>关闭</option></select></div></section><section class="card parameter-card">' + threewayRows + '</section>';
    }
    if (setting === 'temp-limit') return '<section class="card form-card"><div class="field"><label>温度下限</label><input type="number" value="16" inputmode="numeric"></div><div class="field"><label>温度上限</label><input type="number" value="30" inputmode="numeric"></div></section>';
    if (setting === 'vpp-addr' || setting === 'vpp-collector') return '<section class="card form-card"><div class="field"><label>' + (setting === 'vpp-addr' ? '上海VPP通信地址' : '上海VPP采集器地址') + '</label><input value="vpp.feiyi-tech.com:1883"></div></section>';
    if (setting === 'modbus-sub') return '<section class="card form-card"><div class="field"><label>Modbus 子地址</label><input type="number" min="1" max="247" value="1" inputmode="numeric"></div></section>';
    if (setting === 'resistor-param') return '<section class="card form-card"><div class="field"><label>上拉电阻值</label><input type="number" value="10000" inputmode="numeric"></div><div class="field"><label>下拉电阻值</label><input type="number" value="10000" inputmode="numeric"></div></section>';
    if (setting === 'power-judge') return '<section class="card form-card"><div class="field"><label>开关机判断方式</label><select><option>电流阈值判断</option><option>通讯状态判断</option></select></div><div class="field"><label>电流阈值</label><input type="number" value="50" inputmode="numeric"></div></section>';
    if (setting === 'simulator') return '<section class="card form-card"><div class="field"><label>模拟内机数量</label><input type="number" min="1" max="160" value="1" inputmode="numeric"></div></section>';
    if (setting === 'threeway-time') return '<section class="card form-card"><div class="field"><label>三通查询时间</label><select><option>5 分钟</option><option>15 分钟</option><option>30 分钟</option><option>1 小时</option></select></div></section>';
    if (setting === 'hardware') return '<section class="card form-card">' + switchField('硬件看门狗', true) + '<div class="field"><label>通讯口模式</label><select><option>RS485</option><option>TTL</option></select></div></section>';
    if (setting === 'name') return '<section class="card form-card"><div class="field"><label>设备名称</label><input value="' + escapeHtml(deviceId) + '"></div><p class="field-note">自定义设备名称将显示在设备列表与平台端。</p></section>';
    if (setting === 'ir-library') return '<section class="card form-card"><div class="field"><label>空调品牌</label><select>' + brandOptions() + '</select></div><div class="field"><label>码库套数</label><select><option>第 1/8 套</option><option>第 2/8 套</option><option>第 3/8 套</option><option>第 4/8 套</option><option>第 5/8 套</option><option>第 6/8 套</option><option>第 7/8 套</option><option>第 8/8 套</option></select></div></section>';
    if (setting === 'current') return '<section class="card current-panel"><div class="current-value"><span>318</span><small>mA</small></div><p>设备实时电流</p><div class="current-chart"><i style="height:30%"></i><i style="height:36%"></i><i style="height:42%"></i><i style="height:46%"></i><i style="height:44%"></i><i style="height:51%"></i><i style="height:48%"></i><i style="height:54%"></i></div></section><section class="card parameter-card"><div class="parameter-row"><span>关机电流</span><strong>42 mA</strong></div><div class="parameter-row"><span>运行电流</span><strong>318 mA</strong></div><div class="parameter-row"><span>电流阈值</span><strong>50 mA</strong></div><div class="parameter-row"><span>运行判定</span><strong>待机</strong></div></section>';
    if (setting === 'reboot') return '<section class="card form-card"><div class="field"><label>设备重启</label><p class="field-note" style="margin:0">重启过程中设备将短暂离线，约 30 秒后自动恢复连接，已保存的配置不受影响。</p></div></section>';
    if (setting === 'channel-config') return '<section class="card form-card"><div class="field"><label>通道数量</label><select><option>1 路</option><option>4 路</option><option>8 路</option></select></div>' + switchField('启用通道 1', true) + switchField('启用通道 2', false) + switchField('启用通道 3', false) + switchField('启用通道 4', false) + '</section>';
    if (setting === 'g4-basic') return '<section class="card parameter-card"><div class="parameter-row"><span>IMEI</span><strong>860123045678901</strong></div><div class="parameter-row"><span>ICCID</span><strong>8986012345678901234</strong></div><div class="parameter-row"><span>运营商</span><strong>中国电信</strong></div><div class="parameter-row"><span>APN</span><strong>ctnet</strong></div></section>';
    if (setting === 'g4-signal') return '<section class="card parameter-card"><div class="parameter-row"><span>4G 信号强度</span><strong>-65 dBm · 强</strong></div><div class="parameter-row"><span>网络注册状态</span><strong class="ok">已注册</strong></div></section>';
    if (setting === 'unit-upload') return '<section class="card form-card"><div class="field"><label>上传周期</label><select><option>30 秒</option><option>60 秒</option><option>5 分钟</option></select></div><div class="field"><label>重传次数</label><input type="number" min="0" max="5" value="3" inputmode="numeric"></div></section>';
    if (setting === 'attr-config') return '<section class="card form-card"><div class="field"><label>属性名称</label><input value="设备位置"></div><div class="field"><label>属性值</label><input value="1F 机房"></div></section>';
    if (setting === 'net-config') return '<section class="card form-card"><div class="field"><label>配网方式</label><select><option>DHCP</option><option>静态 IP</option></select></div><div class="field"><label>模块 IP</label><input value="192.168.10.20"></div><div class="field"><label>子网掩码</label><input value="255.255.255.0"></div><div class="field"><label>网关</label><input value="192.168.10.1"></div></section>';
    if (setting === 'iface-config') return '<section class="card form-card"><div class="field"><label>接口类型</label><select><option>RS485</option><option>RS232</option><option>以太网</option></select></div><div class="field"><label>波特率</label><select><option>9600</option><option>19200</option></select></div><div class="field"><label>校验位</label><select><option>无校验</option><option>奇校验</option><option>偶校验</option></select></div></section>';
    if (setting === 'jog-control') return '<section class="card form-card"><div class="field"><label>点动对象</label><select><option>冷冻水泵 1</option><option>冷却水泵 1</option><option>冷却塔风机</option><option>电动阀</option></select></div><div class="field"><label>点动时长</label><input type="number" min="1" max="60" value="5" inputmode="numeric"></div></section>';
    if (setting === 'up-iface') return '<section class="card form-card"><div class="field"><label>对上接口协议</label><select><option>Modbus TCP</option><option>Modbus RTU</option><option>JSON</option></select></div><div class="field"><label>端口</label><input type="number" value="502" inputmode="numeric"></div></section>';
    if (setting === 'rs485') return '<section class="card form-card"><div class="field"><label>从机地址</label><input value="1" inputmode="numeric"></div><div class="field"><label>波特率</label><select><option>9600</option><option>19200</option></select></div><div class="field"><label>校验位</label><select><option>无校验</option><option>奇校验</option><option>偶校验</option></select></div></section>';
    if (setting === 'jog485') return '<section class="card form-card"><div class="field"><label>485 从机地址</label><input type="number" min="1" max="247" value="1" inputmode="numeric"></div><div class="field"><label>点动时长</label><input type="number" min="1" max="60" value="5" inputmode="numeric"></div></section>';
    if (setting === 'desc') return '<section class="card form-card"><div class="field"><label>设备描述</label><input value="1F 机房 · 塔泵阀控制器"></div><p class="field-note">设备描述将显示在设备列表与平台端。</p></section>';
    if (setting === 'tbf-upload') return '<section class="card form-card"><div class="field"><label>上传周期</label><select><option>30 秒</option><option>60 秒</option><option>5 分钟</option></select></div><div class="field"><label>上传内容</label><select><option>塔泵阀运行状态</option><option>状态 + 故障信息</option></select></div></section>';
    if (setting === 'vfd-debug') return '<section class="card form-card"><div class="field"><label>目标频率</label><input type="number" min="0" max="50" value="38" inputmode="numeric"></div><div class="field"><label>加速时间</label><input type="number" value="10" inputmode="numeric"></div><div class="field"><label>减速时间</label><input type="number" value="10" inputmode="numeric"></div></section>';
    if (setting === 'vfd-params') return '<section class="card parameter-card"><div class="parameter-row"><span>运行频率</span><strong>38.5 Hz</strong></div><div class="parameter-row"><span>输出电压</span><strong>385 V</strong></div><div class="parameter-row"><span>输出电流</span><strong>12.4 A</strong></div><div class="parameter-row"><span>母线电压</span><strong>540 V</strong></div></section>';
    if (setting === 'ethernet') return '<section class="card form-card"><div class="field"><label>地址获取</label><select><option>DHCP</option><option>静态 IP</option></select></div><div class="field"><label>以太网 IP</label><input value="192.168.1.50"></div><div class="field"><label>子网掩码</label><input value="255.255.255.0"></div><div class="field"><label>网关</label><input value="192.168.1.1"></div></section>';
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
    var isServer = setting === 'server' || setting === 'server-factory';
    var specialLabels = { 'ir-library': '下发码库测试指令', current: '一键电流检测', 'time-calib': '立即校准', 'log-upload': '上传日志', onekey: '开始一键配置', 'reset-factory': '恢复出厂设置', 'debug-sniffer': '开始抓码', name: '保存名称', reboot: '重启设备', 'jog-control': '执行点动', jog485: '执行点动', 'vfd-debug': '下发调试参数' };
    action.textContent = isServer ? '保存并检测通讯' : specialLabels[setting] || (setting === 'upgrade' ? '开始升级' : setting === 'diagnosis' ? '重新检测' : (setting === 'valve' || setting === 'temp-comp') ? '确定' : '保存');
    action.addEventListener('click', function () {
      var result = document.getElementById('setting-result');
      result.hidden = false;
      action.disabled = true;
      if (isServer) {
        result.textContent = '检测通讯中';
        result.className = 'result-box checking';
        setTimeout(function () { result.textContent = '通讯正常'; result.className = 'result-box success'; action.disabled = false; }, 900);
      } else if (setting === 'upgrade') {
        result.textContent = '固件已是最新版本'; result.className = 'result-box success'; action.disabled = false;
      } else if (setting === 'reset-factory') {
        result.textContent = '已恢复出厂设置，设备重启中'; result.className = 'result-box success'; action.disabled = false;
      } else if (setting === 'current') {
        result.textContent = '电流检测完成，曲线已生成'; result.className = 'result-box success'; action.disabled = false;
      } else if (setting === 'debug-sniffer') {
        result.textContent = '抓码完成，共抓取 12 帧报文'; result.className = 'result-box success'; action.disabled = false;
      } else if (setting === 'reboot') {
        result.textContent = '设备重启中，约 30 秒后自动恢复连接'; result.className = 'result-box success'; action.disabled = false;
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
