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
      { title: '空调接线', icon: '线', desc: '各品牌接线端子图文', href: 'tool-wiring.html' },
      { title: '操作指引', icon: '引', desc: '视频教程与产品文档', href: 'tool-guide.html' },
      { title: '空调故障码', icon: '码', desc: '故障代码含义与处理', href: 'tool-errcode.html' },
      { title: '远程协助', icon: '协', desc: '技术支持远程接管操作', href: 'tool-remote.html' }
    ],
    toolMenu: [
      { title: '常见问题答疑', icon: '答', href: 'tool-faq.html' },
      { title: '留言反馈', icon: '言', href: 'feedback.html' }
    ],
    faqList: [
      { q: '蓝牙搜索不到网关设备怎么办？', a: '确认网关已上电并处于配网状态（指示灯快闪）；手机蓝牙已开启并已授权小程序使用蓝牙；靠近设备 1 米内重新搜索。仍搜索不到可将网关断电重启后再试。' },
      { q: '网关配网失败怎么排查？', a: '确认 Wi-Fi 密码输入正确（注意区分大小写）；路由器需为 2.4GHz 频段（暂不支持 5GHz）；关闭路由器 AP 隔离功能；信号较弱时先将网关移至路由器附近完成配网，再安装回原位。' },
      { q: '平台显示网关离线，如何处理？', a: '先确认网关供电正常、指示灯状态正常；检查现场网络是否断网或更换过路由器；4G 版本确认流量卡未欠费、当地信号正常。网络恢复后网关会自动重连上线，无需重新配置。' },
      { q: '空调无法控制或状态不更新？', a: '确认网关与空调总线接线牢固、极性正确；在调试页重新执行「空调搜索」识别内机；确认所选空调品牌协议与现场实际一致。仍异常时可通过「远程协助」联系技术支持在线排查。' },
      { q: '远程协助功能怎么用？', a: '在工具页进入「远程协助」，开启协助码并告知飞奕技术支持；对方接入后可实时查看并代为操作你的小程序界面；协助结束后画面同步终止，对方无法再访问你的手机。' },
      { q: '集控计费平台账号如何开通？', a: '项目交付后由飞奕技术支持统一开通主账号；如需新增子账号，可在平台「系统管理-子账户」中创建并分配项目与功能权限，或联系技术支持协助开通。' }
    ],
    platformGuideCats: [
      {
        key: 'jk', title: '常用集控操作', icon: '控',
        videos: [
          ['平台访问与登录', '账号密码与手机号登录方式，以及首次登录的操作步骤'],
          ['查看项目综合监控大屏', '大屏各模块关键数据：运行状态统计、项目总览、能耗趋势及日使用详情'],
          ['查看空调详细状态', '进入空调详情页，查看单台空调运行参数、温度设定、模式及风速'],
          ['单台或批量控制空调', '单台空调开关机、调温控制，以及多台空调批量统一控制'],
          ['创建定时任务', '创建空调定时开关机任务，支持按周循环、指定时间段等灵活配置'],
          ['创建群组及群组控制', '将多台空调加入群组，通过群组一键统一控制，提升管理效率'],
          ['锁定空调状态', '锁定空调状态防止其他用户修改，适用于需保持特定运行状态的场景'],
          ['查看开关机记录', '查询空调历史开关机操作记录，了解使用情况与操作日志'],
          ['查看空调故障记录', '查看空调故障告警历史，包括故障类型、发生时间及处理状态'],
          ['查看环境感知状态', '查看各环境传感器实时数据，如温度、湿度、CO₂浓度等'],
          ['创建空调可视化布局', '使用空调可视化管理功能，在平面图上查看并控制各区域空调']
        ]
      },
      {
        key: 'ts', title: '项目调试维护', icon: '调',
        videos: [
          ['创建建筑物及绑定空调关系', '在项目设置中创建建筑物结构，将空调与楼层、区域绑定'],
          ['自定义空调名称', '修改空调显示名称，便于现场对应识别与日常管理'],
          ['添加网关设备', '在平台中添加新网关设备，完成配网并与项目绑定'],
          ['添加子账户', '创建子账户，并为其分配可管理的项目及功能权限'],
          ['添加传感器', '添加环境传感器，完成配置并与空调联动策略绑定'],
          ['添加电表', '添加电表设备，完成通信配置并与计费系统关联']
        ]
      },
      {
        key: 'jn', title: '节能策略相关', icon: '节',
        videos: [
          ['创建环境感知联动策略', '基于人体、门窗、温度、湿度四类传感器条件组合创建联动任务'],
          ['创建极致节能策略', '按设定间隔反复下发控制指令，使空调持续保持设定状态，实现刚性节能']
        ]
      },
      {
        key: 'jf', title: '分户计费相关', icon: '费',
        videos: [
          ['查询电费账单', '查询各租户月度电费账单，支持按项目、日期范围筛选查看'],
          ['查询费用明细', '查看租户用电明细，包括分时用电量、空调用电占比等详细统计'],
          ['设定电价', '为项目设置分时电价方案，支持峰谷平电价及自定义时段配置'],
          ['维护租户信息', '添加、编辑、删除租户信息，包括绑定对应空调设备和用电区域'],
          ['创建公区空调分摊规则', '配置公区房间与分摊维度、分摊方式，支持分摊明细查询'],
          ['设定欠费锁定阈值', '预付费项目设置提醒与欠费锁定阈值，余额不足自动锁定空调'],
          ['时间计费法功能说明', '逐页介绍时间计费法各页面含义，说明按运行时长的计费逻辑']
        ]
      }
    ],
    guideSeries: [
      {
        key: 'a01', title: 'A01 系列', rep: 'A01F', models: 'A01F / A01E', desc: '多通道室外机控制器 · 4/8 路',
        videos: ['A01 系列开箱安装与首次上电', '服务器参数配置与连接自检', '空调品牌批量配置实操'],
        docs: [['产品手册', 'A01 系列室外机控制器产品手册'], ['方案文档', '多联机集控改造方案（A01 系列）'], ['指导文件', 'A01 系列接线端子与拨码说明']]
      },
      {
        key: 'a02', title: 'A02 系列', rep: 'A02FG', models: 'A02FG / A02EG', desc: '第二代室外机控制器 · 4/8 路',
        videos: ['A02 系列快速上手', '分通道品牌配置演示', 'RS485 对接与设备诊断'],
        docs: [['产品手册', 'A02 系列室外机控制器产品手册'], ['方案文档', '大体量多联机集中管控方案'], ['指导文件', 'A02 系列通道配置指引']]
      },
      {
        key: 'a03fg', title: 'A03FG', rep: 'A03FG', models: 'A03FG', desc: '内置 4G 的 4 路室外机控制器',
        videos: ['A03FG 4G 版开箱与上线', '云端 MQTT 配置演示', '远程诊断与固件升级'],
        docs: [['产品手册', 'A03FG 4G 控制器产品手册'], ['方案文档', '无网络机房 4G 直连方案'], ['指导文件', 'A03FG 上线与平台绑定指引']]
      },
      {
        key: 'f16g', title: 'F16G', rep: 'F16G', models: 'F16G', desc: '风机盘管室内机控制器',
        videos: ['F16G 风机盘管接线与安装', '管制线阀类型设置', '温度传感器补偿设定'],
        docs: [['产品手册', 'F16G 风机盘管控制器产品手册'], ['方案文档', '风机盘管集中控制改造方案'], ['指导文件', 'F16G 安装接线指引']]
      },
      {
        key: 'b25lg', title: 'B25LG', rep: 'B25LG', models: 'B25LG', desc: '单路室内机控制器',
        videos: ['B25LG 线控器安装与配对指南', '品牌协议直连配置', '空调高级参数说明'],
        docs: [['产品手册', 'B25LG 室内机控制器产品手册'], ['方案文档', '存量内机按台改造方案'], ['指导文件', 'B25LG 配对与调试指引']]
      },
      {
        key: 'fd01g', title: 'FD01G', rep: 'FD01G', models: 'FD01G', desc: '分体空调红外控制器',
        videos: ['FD01G 红外码库匹配实操', '电流阈值设置与状态判定', '红外学习操作演示'],
        docs: [['产品手册', 'FD01G 分体空调控制器产品手册'], ['方案文档', '分体机红外集控方案'], ['指导文件', 'FD01G 电流检测接线指引']]
      },
      {
        key: 's74g', title: 'S74G', rep: 'S74G', models: 'S74G', desc: '单路室外网关',
        videos: ['S74G 单路网关快速接入', '服务器对接与通讯自检', '小体量项目部署案例'],
        docs: [['产品手册', 'S74G 单路室外网关产品手册'], ['方案文档', '小体量项目轻量接入方案'], ['指导文件', 'S74G 安装与网络配置指引']]
      },
      {
        key: 'e50', title: 'E50', rep: 'E50', models: 'E50', desc: '空调诊断设备 · 蓝牙 / 4G',
        videos: ['E50 蓝牙配对与设备连接', '空调系统搜索与识别', 'AI 智能诊断快速上手'],
        docs: [['产品手册', 'E50 空调诊断设备产品手册'], ['方案文档', '空调故障诊断服务方案'], ['指导文件', 'E50 现场作业指引']]
      }
    ],
    mine: { name: '飞奕工程师 · 张工', phone: '138****8203', version: '2.0.0' }
  };
});
