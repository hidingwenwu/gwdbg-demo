(function (root) {
  var params = new URLSearchParams(root.location.search);
  var device = params.get('device') || 'FE50G-A8C4';
  var mode = params.get('mode') === '4g' ? '4g' : 'bt';
  var commMode = mode === '4g' ? '4G' : '蓝牙';

  /* ── 数据：字段与 E50 小程序版 app.js globalData 对齐 ── */
  var brands = ['日立', '格力', '海信', '青岛约克', '美的家用', '模拟器'];
  var bleDevices = [
    { id: 1, name: 'FE50G-A8C4', mac: 'E8:9F:6D:A8:C4:21', signal: -52 },
    { id: 2, name: 'FE50-B3D1', mac: 'E8:9F:6D:B3:D1:44', signal: -68 },
    { id: 3, name: 'FE50-C901', mac: 'E8:9F:6D:C9:01:AA', signal: -74 },
    { id: 4, name: 'E50-91D0', mac: 'E8:9F:6D:91:D0:F4', signal: -81 },
    { id: 5, name: 'FE50-D7E2', mac: 'E8:9F:6D:D7:E2:08', signal: -89 }
  ];
  var acSystems = [
    { id: 1, title: '已识别空调系统1', indoorCount: 3 },
    { id: 2, title: '已识别空调系统2', indoorCount: 5 },
    { id: 3, title: '已识别空调系统3', indoorCount: 2 }
  ];
  var acUnits = [
    { id: 1, onOff: true, address: '1-0', setTemp: 26, returnTemp: 24, mode: '制冷', fanSpeed: '中风' },
    { id: 2, onOff: false, address: '1-1', setTemp: 26, returnTemp: 24, mode: '制冷', fanSpeed: '中风' },
    { id: 3, onOff: false, address: '1-2', setTemp: 26, returnTemp: 24, mode: '制冷', fanSpeed: '中风' },
    { id: 4, onOff: false, address: '1-3', setTemp: 26, returnTemp: 24, mode: '制冷', fanSpeed: '中风' }
  ];
  var detailDatasets = {
    outdoor: {
      fault: { reason: '高压保护', solution: '检查冷凝器散热、制冷剂量、风机转速' },
      groups: [
        { title: 'SYSTEM 系统', rows: [
          { name: 'R7与外机通讯系统号', value: '1', unit: '' },
          { name: 'R7与内机通讯系统号', value: '1', unit: '' },
          { name: '内机数量', value: '3', unit: '' },
          { name: '四通阀', value: '关', unit: '' }
        ] },
        { title: 'STATUS 状态', rows: [
          { name: '运转模式', value: '制冷', unit: '' },
          { name: '特殊模式', value: '无', unit: '' },
          { name: '外机故障代码', value: 'EL15', unit: '', abnormal: true, normalRange: '正常应为 00', faultCode: true },
          { name: '外机保护代码或停机原因', value: '高压保护', unit: '' }
        ] },
        { title: 'COMPRESSOR 压缩机', rows: [
          { name: '压缩机目标运转频率(总)', value: '70', unit: 'Hz' },
          { name: '压缩机实际运转频率(总)', value: '72', unit: 'Hz' },
          { name: '压机排气温度(平均)', value: '96', unit: '℃', abnormal: true, normalRange: '60 ~ 90 ℃' },
          { name: '压机吸气温度(平均)', value: '12', unit: '℃' }
        ] },
        { title: 'PRESSURE 压力', rows: [
          { name: '高压压力', value: '3.2', unit: 'MPa', abnormal: true, normalRange: '1.8 ~ 2.8 MPa' },
          { name: '低压压力', value: '0.48', unit: 'MPa' },
          { name: '冷凝温度', value: '48.2', unit: '℃' },
          { name: '蒸发温度', value: '6.5', unit: '℃' }
        ] },
        { title: 'TEMPERATURE 温度', rows: [
          { name: '环境温度', value: '38', unit: '℃' },
          { name: '换热器液侧温度', value: '42', unit: '℃' },
          { name: '换热器气侧温度', value: '18', unit: '℃' }
        ] },
        { title: 'ELECTRICAL 电气/阀件', rows: [
          { name: '外机总电流', value: '18.5', unit: 'A' },
          { name: '外机容量(总)', value: '560', unit: '百瓦' },
          { name: '电子膨胀阀开度', value: '350', unit: '' },
          { name: '电子膨胀阀2开度', value: '0', unit: '' },
          { name: '电子膨胀阀3开度', value: '0', unit: '' },
          { name: '风扇电机等级/转速', value: '850', unit: 'rpm' }
        ] }
      ]
    },
    indoor: {
      '1': {
        name: '客厅', groups: [
          { title: 'IDENTITY 标识', rows: [
            { name: 'R7虚拟内机地址', value: '01', unit: '' },
            { name: '实际内机地址', value: '01', unit: '' },
            { name: '内机集控地址或工程编号', value: '1', unit: '' },
            { name: '内机型号', value: 'FE50G-25', unit: '' },
            { name: '内机MAC地址', value: 'A4:C1:38:0F:01', unit: '' },
            { name: '设备类型', value: '室内机', unit: '' }
          ] },
          { title: 'STATUS 状态', rows: [
            { name: '开关', value: '开', unit: '' },
            { name: '运行模式', value: '制冷', unit: '' },
            { name: '风机档位', value: '中风', unit: '' },
            { name: '主遥控器(冷热选择权)', value: '是', unit: '' },
            { name: '内机是否有线控器', value: '是', unit: '' },
            { name: '能需开关', value: '开', unit: '' },
            { name: '回油', value: '否', unit: '' },
            { name: '实际内机停机原因', value: '无', unit: '' }
          ] },
          { title: 'TEMPERATURE 温度', rows: [
            { name: '回风温度', value: '27', unit: '℃', abnormal: true, normalRange: '与设定温度温差 8 ~ 14 ℃' },
            { name: '出风温度', value: '14', unit: '℃' },
            { name: '液管温度', value: '8', unit: '℃' },
            { name: '中管温度', value: '12', unit: '℃' },
            { name: '气管温度', value: '10', unit: '℃' },
            { name: '遥控器传感器温度', value: '25.5', unit: '℃' },
            { name: '设置温度', value: '22', unit: '℃' },
            { name: '环境湿度', value: '58', unit: '%' }
          ] },
          { title: 'CAPACITY/VALVE 容量与阀控', rows: [
            { name: '内机容量', value: '2.5', unit: 'HP' },
            { name: '需求频率', value: '80', unit: '%' },
            { name: '上下风向', value: '自动摆风', unit: '' },
            { name: '左右风向', value: '自动摆风', unit: '' },
            { name: '实际内机回读电子膨胀阀值', value: '350', unit: '' },
            { name: '外机要求内机电子膨胀阀开度(转换后)', value: '350', unit: '' },
            { name: '外机要求内机电子膨胀阀开度(转换前)', value: '350', unit: '' }
          ] },
          { title: 'FAULT 故障', rows: [
            { name: '实际内机故障码', value: '00', unit: '', faultCode: true }
          ] }
        ]
      },
      '2': {
        name: '主卧', groups: [
          { title: 'IDENTITY 标识', rows: [
            { name: 'R7虚拟内机地址', value: '02', unit: '' },
            { name: '实际内机地址', value: '02', unit: '' },
            { name: '内机集控地址或工程编号', value: '2', unit: '' },
            { name: '内机型号', value: 'FE50G-20', unit: '' },
            { name: '内机MAC地址', value: 'A4:C1:38:0F:02', unit: '' },
            { name: '设备类型', value: '室内机', unit: '' }
          ] },
          { title: 'STATUS 状态', rows: [
            { name: '开关', value: '开', unit: '' },
            { name: '运行模式', value: '制冷', unit: '' },
            { name: '风机档位', value: '自动', unit: '' },
            { name: '主遥控器(冷热选择权)', value: '否', unit: '' },
            { name: '内机是否有线控器', value: '是', unit: '' },
            { name: '能需开关', value: '开', unit: '' },
            { name: '回油', value: '否', unit: '' },
            { name: '实际内机停机原因', value: '无', unit: '' }
          ] },
          { title: 'TEMPERATURE 温度', rows: [
            { name: '回风温度', value: '26', unit: '℃' },
            { name: '出风温度', value: '13', unit: '℃' },
            { name: '液管温度', value: '7', unit: '℃' },
            { name: '中管温度', value: '11', unit: '℃' },
            { name: '气管温度', value: '9', unit: '℃' },
            { name: '遥控器传感器温度', value: '24.8', unit: '℃' },
            { name: '设置温度', value: '24', unit: '℃' },
            { name: '环境湿度', value: '55', unit: '%' }
          ] },
          { title: 'CAPACITY/VALVE 容量与阀控', rows: [
            { name: '内机容量', value: '2.0', unit: 'HP' },
            { name: '需求频率', value: '70', unit: '%' },
            { name: '上下风向', value: '自动摆风', unit: '' },
            { name: '左右风向', value: '自动摆风', unit: '' },
            { name: '实际内机回读电子膨胀阀值', value: '320', unit: '' },
            { name: '外机要求内机电子膨胀阀开度(转换后)', value: '320', unit: '' },
            { name: '外机要求内机电子膨胀阀开度(转换前)', value: '320', unit: '' }
          ] },
          { title: 'FAULT 故障', rows: [
            { name: '实际内机故障码', value: '00', unit: '', faultCode: true }
          ] }
        ]
      },
      '3': {
        name: '书房', groups: [
          { title: 'IDENTITY 标识', rows: [
            { name: 'R7虚拟内机地址', value: '03', unit: '' },
            { name: '实际内机地址', value: '03', unit: '' },
            { name: '内机集控地址或工程编号', value: '3', unit: '' },
            { name: '内机型号', value: 'FE50G-15', unit: '' },
            { name: '内机MAC地址', value: 'A4:C1:38:0F:03', unit: '' },
            { name: '设备类型', value: '室内机', unit: '' }
          ] },
          { title: 'STATUS 状态', rows: [
            { name: '开关', value: '关', unit: '' },
            { name: '运行模式', value: '送风', unit: '' },
            { name: '风机档位', value: '自动', unit: '' },
            { name: '主遥控器(冷热选择权)', value: '否', unit: '' },
            { name: '内机是否有线控器', value: '否', unit: '' },
            { name: '能需开关', value: '关', unit: '' },
            { name: '回油', value: '否', unit: '' },
            { name: '实际内机停机原因', value: '待机', unit: '' }
          ] },
          { title: 'TEMPERATURE 温度', rows: [
            { name: '回风温度', value: '25', unit: '℃' },
            { name: '出风温度', value: '25', unit: '℃' },
            { name: '液管温度', value: '0', unit: '℃' },
            { name: '中管温度', value: '0', unit: '℃' },
            { name: '气管温度', value: '0', unit: '℃' },
            { name: '遥控器传感器温度', value: '25.0', unit: '℃' },
            { name: '设置温度', value: '25', unit: '℃' },
            { name: '环境湿度', value: '52', unit: '%' }
          ] },
          { title: 'CAPACITY/VALVE 容量与阀控', rows: [
            { name: '内机容量', value: '0', unit: 'HP' },
            { name: '需求频率', value: '0', unit: '%' },
            { name: '上下风向', value: '自动摆风', unit: '' },
            { name: '左右风向', value: '自动摆风', unit: '' },
            { name: '实际内机回读电子膨胀阀值', value: '0', unit: '' },
            { name: '外机要求内机电子膨胀阀开度(转换后)', value: '0', unit: '' },
            { name: '外机要求内机电子膨胀阀开度(转换前)', value: '0', unit: '' }
          ] },
          { title: 'FAULT 故障', rows: [
            { name: '实际内机故障码', value: '00', unit: '', faultCode: true }
          ] }
        ]
      }
    }
  };
  var reportDatasets = {
    pressure: {
      title: '存在潜在故障，建议排查',
      meta: '设备 FE50G · {{brand}}多联机',
      time: '2026-05-14 14:32',
      summary: '外机1台 · 内机5台 · 异常3项',
      issues: [
        { name: '排气压力偏高', code: 'HP-01', target: '外机 #1', value: '3.2 MPa', range: '正常范围 1.8~2.8 MPa', sampleCount: 342,
          causes: [['冷凝器散热不良', '78%'], ['制冷剂过充', '15%'], ['传感器故障', '5%'], ['压缩机异常', '2%']],
          steps: ['检查室外机进出风口是否有遮挡物', '清洗室外机换热翅片', '测量室外机实际风量是否达标', '确认系统制冷剂量是否在范围内'] },
        { name: '内机温差不足', code: 'ΔT-02', target: '内机 #1 · 客厅', value: '6.1 ℃', range: '正常范围 8~14 ℃', sampleCount: 518,
          causes: [['滤网或蒸发器脏堵', '64%'], ['室内风量偏低', '24%'], ['冷媒循环不足', '10%'], ['其它', '2%']],
          steps: ['检查并清洁内机滤网', '确认内机风速设置与出风量', '观察 10 分钟后复测进出风温差'] },
        { name: '通讯波动', code: 'COM-03', target: '外机 #1', value: '2 次', range: '正常范围 0 次', sampleCount: 207,
          causes: [['现场信号弱', '58%'], ['接线端子松动', '31%'], ['设备重启记录', '9%'], ['其它', '2%']],
          steps: ['检查 E50 与空调通讯线端子', '确认 4G 信号强度', '重新上电后观察通讯状态'] }
      ]
    }
  };
  var INTRO_TEXT = '根据飞奕小蓝盒采集的空调数据信息，已为您出具AI诊断报告';
  var faultSolution = {
    code: 'EL15', reason: '高压保护',
    text: '故障码 EL15（高压保护）排查方案：\n1. 检查冷凝器散热：确认室外机进出风口无遮挡，清洗换热翅片；\n2. 检查制冷剂量：确认系统制冷剂未过充；\n3. 检查风机转速：确认冷凝风机运转正常、转速达标；\n4. 复查高压传感器与压力开关接线是否松动。\n处理完成后重新上电，观察高压压力是否回落至 1.8 ~ 2.8 MPa 正常范围。'
  };

  /* ── setup 状态（sessionStorage 持久） ── */
  var SETUP_KEY = 'gwdbg.e50.setup';
  function readSetup() {
    try {
      var raw = root.sessionStorage && root.sessionStorage.getItem(SETUP_KEY);
      var state = raw ? JSON.parse(raw) : null;
      if (state && state.device === device) return state;
    } catch (error) {}
    return null;
  }
  function writeSetup(next) {
    try { if (root.sessionStorage) root.sessionStorage.setItem(SETUP_KEY, JSON.stringify(next)); } catch (error) {}
    return next;
  }
  function setupState() {
    return readSetup() || { device: device, brand: '', setupCompleted: false, simulateMode: null, mockIndoorCount: 0 };
  }
  function patchSetup(patch) {
    var next = Object.assign(setupState(), patch, { device: device });
    return writeSetup(next);
  }

  function query(extra) {
    var next = new URLSearchParams({ model: 'E50', device: device, mode: mode });
    Object.keys(extra || {}).forEach(function (key) { next.set(key, extra[key]); });
    return next.toString();
  }
  function link(page, extra) { return page + '?' + query(extra); }

  /* ── 通用 UI ── */
  function shell() { return document.querySelector('.app-shell'); }
  function toast(message) {
    var host = shell();
    if (!host) return;
    var el = host.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      host.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.classList.remove('show'); }, 1500);
  }
  function confirmDialog(options) {
    var host = shell();
    if (!host) return;
    var layer = document.createElement('div');
    layer.className = 'modal-layer show';
    layer.innerHTML = '<div class="modal-mask"></div><section class="confirm-dialog"><h2>' + (options.title || '提示') + '</h2><p>' + (options.message || '') + '</p><div class="dialog-actions"><button class="button" data-act="cancel" type="button">' + (options.cancelText || '取消') + '</button><button class="button primary" data-act="ok" type="button">' + (options.confirmText || '确认') + '</button></div></section>';
    host.appendChild(layer);
    layer.addEventListener('click', function (event) {
      var act = event.target.dataset && event.target.dataset.act;
      if (!act && !event.target.classList.contains('modal-mask')) return;
      layer.remove();
      if (act === 'ok' && options.onConfirm) options.onConfirm();
    });
  }

  /* ── E50 侧边菜单（源码 side-menu + 用户补充的 工具/我的） ── */
  var MENU_ITEMS = [
    ['capture', '检修抓码', '', '抓', 'c4'],
    ['upgrade', '设备升级', 'device-e50-upgrade.html', '升', 'c2'],
    ['devices', '设备列表', 'device-e50-devices.html', '列', 'c1'],
    ['service', '技术&服务', 'device-e50-service.html', '服', 'c5']
  ];
  function renderMenu(active) {
    var host = document.getElementById('side-menu');
    if (!host) return;
    var nav = MENU_ITEMS.map(function (item) {
      var href = item[2] === 'feedback.html' ? 'feedback.html' : (item[2] ? link(item[2]) : '#');
      return '<a class="side-nav-item' + (active === item[0] ? ' active' : '') + '" href="' + href + '" data-menu="' + item[0] + '"><i class="side-nav-ic ' + item[4] + '">' + item[3] + '</i><span>' + item[1] + '</span><b>›</b></a>';
    }).join('');
    host.innerHTML = '<div class="side-menu-body">' +
      '<div class="menu-switch-wrap"><a class="menu-switch-btn" href="tab-device-bt.html"><span class="switch-icon">⇄</span>切换其他产品</a></div>' +
      '<div class="side-nav-label">设备功能</div>' +
      '<nav class="side-nav">' + nav + '</nav>' +
      '<div class="side-nav-label">应用</div>' +
      '<div class="side-app-entry">' +
      '<a class="side-app-btn" href="tab-tools.html"><span class="side-app-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span><span class="side-app-label">工具</span></a>' +
      '<a class="side-app-btn mine" href="tab-mine.html"><span class="side-app-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span class="side-app-label">我的</span></a>' +
      '</div></div>';
    var capture = host.querySelector('[data-menu="capture"]');
    if (capture) capture.addEventListener('click', function (event) {
      event.preventDefault();
      closeMenu();
      openCapture();
    });
    var switchBtn = host.querySelector('.menu-switch-btn');
    if (switchBtn) switchBtn.addEventListener('click', function (event) {
      if (mode !== 'bt') return;
      event.preventDefault();
      closeMenu();
      confirmDialog({
        title: '断开蓝牙连接',
        message: '切换其他产品前需要断开当前蓝牙连接，断开后将返回设备列表。',
        onConfirm: function () {
          if (root.GWDBG_CONNECTION) root.GWDBG_CONNECTION.disconnectBluetooth();
          root.location.href = 'tab-device-bt.html';
        }
      });
    });
  }
  function openMenu() { document.body.classList.add('side-menu-open'); }
  function closeMenu() { document.body.classList.remove('side-menu-open'); }
  function bindMenu(active) {
    renderMenu(active);
    var trigger = document.getElementById('menu-trigger');
    if (trigger) trigger.addEventListener('click', openMenu);
    var overlay = document.getElementById('side-menu-overlay');
    if (overlay) overlay.addEventListener('click', closeMenu);
  }

  /* ── 检修抓码浮层（源码 capture-sheet） ── */
  var captureState = null;
  function openCapture() {
    var host = shell();
    if (!host) return;
    if (document.getElementById('capture-layer')) { document.getElementById('capture-layer').remove(); }
    captureState = { step: 1, reason: '', progress: 0 };
    var layer = document.createElement('div');
    layer.id = 'capture-layer';
    layer.innerHTML = '<div class="sheet-mask show" data-cap-close></div>' +
      '<section class="picker-sheet show capture-sheet" id="capture-sheet"></section>';
    host.appendChild(layer);
    layer.addEventListener('click', function (event) {
      if (event.target.closest('[data-cap-close]')) closeCapture();
    });
    renderCapture();
  }
  function closeCapture() {
    var layer = document.getElementById('capture-layer');
    if (layer) layer.remove();
    captureState = null;
  }
  function renderCapture() {
    var sheet = document.getElementById('capture-sheet');
    if (!sheet || !captureState) return;
    if (captureState.step === 1) {
      var warn = commMode !== '蓝牙' ? '<div class="cs-warn"><span>⚠</span><span>当前为4G连接，请切换至蓝牙连接后再进行抓码</span></div>' : '';
      sheet.innerHTML = '<div class="sheet-handle"></div>' +
        '<div class="cs-header"><span class="cs-title">检修抓码</span><button class="sheet-close" data-cap-close type="button">×</button></div>' + warn +
        '<div class="cs-field"><div class="cs-label">抓码原因 <i>*</i></div>' +
        '<select class="cs-select" id="cs-reason"><option value="">请选择故障原因</option><option>不制冷 / 制冷效果差</option><option>不制热 / 制热效果差</option><option>通讯故障</option><option>故障代码报警</option><option>其他问题</option></select></div>' +
        '<div class="cs-field"><div class="cs-label">外机信息 <i>*</i><small>（型号或铭牌图片，二选一）</small></div>' +
        '<input class="cs-input" id="cs-model" placeholder="填写外机型号（如：LSQRF30M）">' +
        '<div class="cs-or"><span></span>或<span></span></div>' +
        '<button class="cs-img-add" id="cs-img" type="button">＋ 上传外机铭牌图片</button></div>' +
        '<div class="cs-field"><div class="cs-label">详细描述</div>' +
        '<textarea class="cs-textarea" id="cs-desc" placeholder="请描述现场故障情况、已排查项目等（选填）"></textarea></div>' +
        '<div class="cs-actions"><button class="button" data-cap-close type="button">取消</button><button class="button primary" id="cs-start" type="button">开始抓码</button></div>';
      document.getElementById('cs-img').onclick = function () { toast('请选择铭牌图片'); };
      document.getElementById('cs-start').onclick = function () {
        var reason = document.getElementById('cs-reason').value;
        var model = document.getElementById('cs-model').value.trim();
        if (!reason) { toast('请选择抓码原因'); return; }
        if (!model) { toast('请填写外机型号或上传铭牌图片'); return; }
        captureState.step = 2;
        captureState.progress = 0;
        renderCapture();
        var timer = setInterval(function () {
          if (!captureState) { clearInterval(timer); return; }
          captureState.progress = Math.min(100, captureState.progress + 4);
          var fill = document.getElementById('cs-fill'), pct = document.getElementById('cs-pct');
          if (fill) fill.style.width = captureState.progress + '%';
          if (pct) pct.textContent = captureState.progress + '%';
          if (captureState.progress >= 100) {
            clearInterval(timer);
            captureState.step = 3;
            renderCapture();
          }
        }, 120);
      };
    } else if (captureState.step === 2) {
      sheet.innerHTML = '<div class="sheet-handle"></div>' +
        '<div class="cs-header"><span class="cs-title">抓码进行中</span></div>' +
        '<div class="cs-progress-icon">📡</div>' +
        '<p class="cs-progress-hint">请保持设备蓝牙连接，耐心等待约 1 分钟</p>' +
        '<div class="cs-prog-track"><div class="cs-prog-fill" id="cs-fill" style="width:' + captureState.progress + '%"></div></div>' +
        '<div class="cs-prog-pct" id="cs-pct">' + captureState.progress + '%</div>' +
        '<button class="button cs-cancel-sm" data-cap-close type="button">取消抓码</button>';
    } else {
      sheet.innerHTML = '<div class="sheet-handle"></div>' +
        '<div class="cs-done"><div class="cs-done-icon">✓</div><strong>抓码完成</strong><p>感谢配合，飞奕将火速组织资源查看问题</p>' +
        '<button class="button primary" data-cap-close type="button" style="width:100%">关闭</button></div>';
    }
  }

  /* ── 通用底部浮层绑定 ── */
  function bindSheet(maskId, sheetIds) {
    var mask = document.getElementById(maskId);
    function close() {
      if (mask) mask.classList.remove('show');
      sheetIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.remove('show');
      });
    }
    function open(id) {
      if (mask) mask.classList.add('show');
      var el = document.getElementById(id);
      if (el) el.classList.add('show');
    }
    if (mask) mask.addEventListener('click', close);
    return { open: open, close: close };
  }

  root.GWDBG_E50 = {
    device: device,
    mode: mode,
    commMode: commMode,
    brands: brands,
    bleDevices: bleDevices,
    acSystems: acSystems,
    acUnits: acUnits,
    detailDatasets: detailDatasets,
    reportDatasets: reportDatasets,
    INTRO_TEXT: INTRO_TEXT,
    faultSolution: faultSolution,
    setupState: setupState,
    patchSetup: patchSetup,
    link: link,
    toast: toast,
    confirm: confirmDialog,
    bindMenu: bindMenu,
    openMenu: openMenu,
    closeMenu: closeMenu,
    openCapture: openCapture,
    bindSheet: bindSheet
  };
})(window);
