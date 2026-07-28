(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  root.GWDBG_DATA = data;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  var outdoorTasks = [
    { key: 'batch-brand', title: '空调品牌批量配置', meta: '按通道统一设置', setting: 'brand-batch' },
    { key: 'server', title: '服务器配置', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'meter', title: '电表参数', meta: '地址与通信参数下发', setting: 'meter' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机与运行模式', setting: 'control' }
  ];
  var outdoorMore = [
    { key: 'channel', title: '空调品牌设置' },
    { key: 'network', title: '网络参数' },
    { key: 'rtu', title: 'RS485 / RTU' },
    { key: 'diagnosis', title: '设备诊断' },
    { key: 'upgrade', title: '固件升级' },
    { key: 'info', title: '设备信息' }
  ];
  var indoorTasks = [
    { key: 'brand', title: '空调品牌设置', meta: '设置当前空调品牌', setting: 'brand' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机、模式与温度', setting: 'control' },
    { key: 'upgrade', title: '固件升级', meta: '检查并更新设备固件', setting: 'upgrade' }
  ];
  var indoorMore = [
    { key: 'ac-advanced', title: '空调高级参数' },
    { key: 'diagnosis', title: '通信诊断' },
    { key: 'reset', title: '恢复默认设置' },
    { key: 'info', title: '设备信息' }
  ];
  var f16gTasks = [
    { key: 'valve', title: '管制线阀类型', meta: '设定风机盘管管制与线阀类型', setting: 'valve' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机、模式与温度', setting: 'control' },
    { key: 'upgrade', title: '固件升级', meta: '检查并更新设备固件', setting: 'upgrade' }
  ];
  var f16gMore = [
    { key: 'temp-comp', title: '温度传感器补偿设定' },
    { key: 'ac-advanced', title: '空调高级参数' },
    { key: 'diagnosis', title: '通信诊断' },
    { key: 'reset', title: '恢复默认设置' },
    { key: 'info', title: '设备信息' }
  ];

  var products = [
    {
      model: 'A01F', name: 'A01F 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a01f.png', remote: false, family: 'outdoor',
      variant: '4 路 F 版', channels: 4, quickTasks: outdoorTasks, moreSettings: outdoorMore
    },
    {
      model: 'A01E', name: 'A01E 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a01e.png', remote: false, family: 'outdoor',
      variant: '8 路 E 版', channels: 8, quickTasks: outdoorTasks, moreSettings: outdoorMore
    },
    {
      model: 'A02FG', name: 'A02FG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a02fg.png', remote: false, family: 'outdoor',
      variant: '4 路 F 版', channels: 4, quickTasks: outdoorTasks, moreSettings: outdoorMore
    },
    {
      model: 'A02EG', name: 'A02EG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a02eg.png', remote: false, family: 'outdoor',
      variant: '8 路 E 版', channels: 8, quickTasks: outdoorTasks, moreSettings: outdoorMore
    },
    {
      model: 'A03FG', name: 'A03FG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a03fg.png', remote: false, family: 'outdoor',
      variant: '4 路 4G 版', channels: 4, quickTasks: outdoorTasks, moreSettings: outdoorMore
    },
    {
      model: 'F16G', name: 'F16G 室内机控制器', category: '室内机控制器',
      image: '../assets/products/f16g.png', remote: false, family: 'indoor',
      variant: '风机盘管控制', channels: 1, quickTasks: f16gTasks, moreSettings: f16gMore
    },
    {
      model: 'B25LG', name: 'B25LG 室内机控制器', category: '室内机控制器',
      image: '../assets/products/b25lg.jpg', remote: false, family: 'indoor',
      variant: '单路', channels: 1, quickTasks: indoorTasks, moreSettings: indoorMore
    },
    {
      model: 'FD01G', name: 'FD01G 分体机控制器', category: '分体空调控制器',
      image: '../assets/products/fd01g.png', remote: false, family: 'fd01g',
      variant: '红外控制', channels: 1,
      quickTasks: [
        { key: 'ir-library', title: '红外码库选型匹配', meta: '选择品牌并测试红外码组', setting: 'ir-library' },
        { key: 'current-threshold', title: '电流阈值设置', meta: '设置运行状态判定阈值', setting: 'current-threshold' }
      ],
      moreSettings: [
        { key: 'control', title: '空调控制验证' },
        { key: 'ir-learning', title: '红外学习' },
        { key: 'current-chart', title: '电流检测' },
        { key: 'electric', title: '电气参数' },
        { key: 'upgrade', title: '固件升级' },
        { key: 'info', title: '设备信息' }
      ]
    },
    {
      model: 'S74G', name: 'S74G 单路室外网关', category: '单路室外网关',
      image: '../assets/products/s74g.png', remote: false, family: 'single-outdoor',
      variant: '单路', channels: 1,
      quickTasks: [
        { key: 'brand', title: '空调品牌配置', meta: '设置当前空调品牌', setting: 'brand' },
        { key: 'server', title: '服务器配置', meta: '保存后自动检测通讯', setting: 'server' },
        { key: 'control', title: '空调控制验证', meta: '验证开关机与运行模式', setting: 'control' }
      ],
      moreSettings: [
        { key: 'network', title: '网络参数' },
        { key: 'ac-advanced', title: '空调高级参数' },
        { key: 'diagnosis', title: '设备诊断' },
        { key: 'upgrade', title: '固件升级' },
        { key: 'info', title: '设备信息' }
      ]
    },
    {
      model: 'E50', name: 'E50 空调诊断设备', category: '空调诊断设备',
      image: '../assets/products/e50.png', remote: true, family: 'e50',
      variant: '蓝牙 / 4G', channels: 1,
      quickTasks: [
        { key: 'brand', title: '空调品牌', meta: '选择当前空调品牌' },
        { key: 'system-search', title: '空调系统搜索', meta: '识别室内机与室外机' }
      ],
      moreSettings: [
        { key: 'outdoor', title: '室外机参数' },
        { key: 'indoor', title: '室内机列表' },
        { key: 'control', title: '空调控制' },
        { key: 'diagnosis', title: '一键诊断' },
        { key: 'upgrade', title: '固件升级' }
      ]
    }
  ];

  var productIntros = {
    A01F: {
      intro: '多通道室外机控制器，面向多联机集中管控场景。单台可同时接入 4 套品牌外机系统，通过外机通讯总线完成协议解析，将空调运行数据与控制指令接入云端管理平台。',
      features: ['4 路外机通道，一台覆盖多套系统', '主流品牌多联机协议解析', '服务器对接与通讯自动检测', '电表参数下发，支持用电计量']
    },
    A01E: {
      intro: '多通道室外机控制器的 8 路版本，面向大体量多联机项目。单台可同时接入 8 套品牌外机系统，减少设备数量与布线成本，统一接入云端管理平台。',
      features: ['8 路外机通道，适合大体量项目', '主流品牌多联机协议解析', '服务器对接与通讯自动检测', '电表参数下发，支持用电计量']
    },
    A02FG: {
      intro: '第二代 4 路室外机控制器，硬件平台升级，协议兼容性与运行稳定性进一步增强，支持品牌批量配置，现场部署更高效。',
      features: ['4 路外机通道，按通道独立配置品牌', '空调品牌批量配置', 'RS485 / RTU 对接', '设备诊断与固件在线升级']
    },
    A02EG: {
      intro: '第二代 8 路室外机控制器，硬件平台升级，协议兼容性与运行稳定性进一步增强，单台覆盖更多系统，适合机房集中部署。',
      features: ['8 路外机通道，按通道独立配置品牌', '空调品牌批量配置', 'RS485 / RTU 对接', '设备诊断与固件在线升级']
    },
    A03FG: {
      intro: '内置 4G 通讯的 4 路室外机控制器，无需现场布网即可接入云端平台，适合无网络机房与分散点位的快速部署。',
      features: ['4 路外机通道', '内置 4G，免布网直连云端', '远程诊断与固件升级', '网络参数灵活配置']
    },
    F16G: {
      intro: '风机盘管（水机）室内机控制器，支持管制与线阀类型设定、温度传感器补偿，替代传统线控器实现集中控制与远程管理。',
      features: ['两管制 / 四管制与线阀类型设定', '温度传感器补偿设定', '开关机、模式与温度远程控制', '固件在线升级']
    },
    B25LG: {
      intro: '单路室内机控制器，直连品牌内机通讯接口，实现单台内机的状态采集与远程控制，适合按台改造的存量项目。',
      features: ['品牌协议直连内机', '开关机、模式与温度控制', '空调高级参数配置', '固件在线升级']
    },
    FD01G: {
      intro: '分体空调红外控制器，内置主流品牌红外码库，配合电流检测判定真实运行状态，适配无通讯接口的分体机与柜机。',
      features: ['红外码库选型匹配', '红外学习，兼容小众遥控器', '电流阈值判定开关机状态', '电气参数监测']
    },
    S74G: {
      intro: '单路室外网关，将单套多联机系统接入云端平台，体积小、安装简单，是小体量项目的轻量接入方案。',
      features: ['单路外机接入', '品牌协议解析', '服务器对接与通讯自检', '网络参数灵活配置']
    },
    E50: {
      intro: '空调诊断设备，蓝牙 / 4G 双模式连接，自动搜索空调系统并读取室内外机运行参数，辅助现场工程师快速定位故障。',
      features: ['空调系统自动搜索识别', '室外机 / 室内机参数读取', '一键诊断与 AI 分析', '蓝牙近场 + 4G 远程双模式']
    }
  };
  products.forEach(function (p) {
    var extra = productIntros[p.model];
    if (extra) { p.intro = extra.intro; p.features = extra.features; }
  });

  var bluetoothDevices = [
    { model: 'A01F', name: 'A01F-3F903E', id: '3C:71:BF:3F:90:3E', rssi: -52 },
    { model: 'A01F', name: 'A01F-62B81C', id: '3C:71:BF:62:B8:1C', rssi: -66 },
    { model: 'A01E', name: 'A01E-8E21A7', id: '18:7A:93:8E:21:A7', rssi: -61 },
    { model: 'A02FG', name: 'A02FG-0D72F1', id: '7C:DF:A1:0D:72:F1', rssi: -70 },
    { model: 'A02EG', name: 'A02EG-8A140C', id: '7C:DF:A1:8A:14:0C', rssi: -64 },
    { model: 'A03FG', name: 'A03FG-4G-46B2D0', id: 'D8:3A:DD:46:B2:D0', rssi: -59 },
    { model: 'F16G', name: 'F16G-B7A403', id: '44:6E:1B:B7:A4:03', rssi: -74 },
    { model: 'B25LG', name: 'B25LG-9C2D01', id: 'A4:CF:12:9C:2D:01', rssi: -63 },
    { model: 'FD01G', name: 'FD01G-7319E2', id: 'B8:27:EB:73:19:E2', rssi: -57 },
    { model: 'S74G', name: 'S74G-A02C11', id: '5E:12:88:A0:2C:11', rssi: -67 },
    { model: 'E50', name: 'E50-A1B2C3', id: '88:6B:0F:A1:B2:C3', rssi: -58 }
  ];

  return {
    products: products,
    bluetoothDevices: bluetoothDevices,
    remoteDevices: [
      { model: 'E50', name: '东区机房 E50', id: 'E50-250701-0186', online: true, updatedAt: '刚刚' },
      { model: 'E50', name: '研发实验室 E50', id: 'E50-250624-0062', online: false, updatedAt: '07-23 18:42' }
    ],
    toolHero: { title: '氟机支持查询', icon: '查', desc: '输入空调品牌与完整型号，查询外机是否支持接入', href: 'tool-fluoro-input.html' },
    toolCards: [
      { title: '接线指导', icon: '线', desc: '各品牌接线端子图文', href: 'tool-wiring.html' },
      { title: '安装调试视频', icon: '播', desc: '现场安装调试演示', href: 'tool-videos.html' },
      { title: '故障码查询', icon: '码', desc: '故障代码含义与处理', href: 'tool-errcode.html' }
    ],
    toolMenu: [
      { title: '产品方案', icon: '案', href: 'product-catalog.html' },
      { title: '留言反馈', icon: '言', href: 'feedback.html' },
      { title: '飞奕公众号', icon: '号', action: 'wechat' },
      { title: '使用说明', icon: '用', action: 'guide' }
    ],
    mineItems: [
      { title: '账号', value: '飞奕工程师 · 张工' },
      { title: '版本', value: '2.0.0' }
    ]
  };
});
