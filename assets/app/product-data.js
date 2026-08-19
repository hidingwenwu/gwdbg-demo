(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  root.GWDBG_DATA = data;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  // ===== 快速配置任务组（按 PRD V2.1 逐型号定义） =====
  var a01Tasks = [
    { key: 'batch-brand', title: '空调品牌批量配置', meta: '按通道统一设置', setting: 'brand-batch' },
    { key: 'server', title: '客户服务器设定', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机与运行模式', setting: 'control' },
    { key: 'rtu', title: 'Modbus-RTU设定', meta: '从机地址与波特率', setting: 'rtu' },
    { key: 'upgrade', title: '设备固件升级', meta: '检查并更新设备固件', setting: 'upgrade' }
  ];
  var a02Tasks = [
    { key: 'batch-brand', title: '空调品牌批量配置', meta: '按通道统一设置', setting: 'brand-batch' },
    { key: 'server', title: '客户服务器设定', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机与运行模式', setting: 'control' },
    { key: 'upgrade', title: '设备固件升级', meta: '检查并更新设备固件', setting: 'upgrade' }
  ];
  var s74gTasks = [
    { key: 'brand', title: '空调品牌设定', meta: '设置当前空调品牌', setting: 'brand' },
    { key: 'server', title: '客户服务器设定', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机与运行模式', setting: 'control' },
    { key: 'upgrade', title: '设备固件升级', meta: '检查并更新设备固件', setting: 'upgrade' }
  ];
  var s74lTasks = [
    { key: 'upgrade', title: '设备固件升级', meta: '检查并更新设备固件', setting: 'upgrade' }
  ];
  var f16gTasks = [
    { key: 'server', title: '客户服务器设定', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'valve', title: '管制线阀类型', meta: '设定风机盘管管制与线阀类型', setting: 'valve' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机、模式与温度', setting: 'control' },
    { key: 'upgrade', title: '固件升级', meta: '检查并更新设备固件', setting: 'upgrade' }
  ];
  var indoorTasks = [
    { key: 'server', title: '客户服务器设定', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机、模式与温度', setting: 'control' },
    { key: 'upgrade', title: '固件升级', meta: '选择品牌后检查更新', setting: 'upgrade' }
  ];
  var fp17Tasks = [
    { key: 'control', title: '空调控制验证', meta: '验证开关机、模式与温度', setting: 'control' },
    { key: 'upgrade', title: '固件升级', meta: '选择品牌后检查更新', setting: 'upgrade' }
  ];
  var r7Tasks = [
    { key: 'ac-indoor', title: '空调内机设定', meta: '内机品牌与协议属性', setting: 'ac-indoor' },
    { key: 'ac-outdoor', title: '空调外机设定', meta: '外机品牌与协议属性', setting: 'ac-outdoor' },
    { key: 'server', title: '客户服务器设定', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机与运行模式', setting: 'control' },
    { key: 'upgrade', title: '设备固件升级', meta: '检查并更新设备固件', setting: 'upgrade' }
  ];
  var fd01gDataTasks = [
    { key: 'ir-library', title: '码库匹配', meta: '红外码库选型与下发测试', setting: 'ir-library' },
    { key: 'server', title: '客户服务器设定', meta: 'IP / 域名与协议配置', setting: 'server' },
    { key: 'current', title: '电流检测', meta: '一键检测运行电流', setting: 'current' },
    { key: 'electric', title: '电量采集设置', meta: '采集周期与校准系数', setting: 'electric' },
    { key: 'control', title: '空调控制验证', meta: '开关 · 温度 · 模式 · 风速', setting: 'control' }
  ];
  var fd02gTasks = [
    { key: 'ir-library', title: '码库匹配', meta: '在线码库选型与下发测试', setting: 'ir-library' },
    { key: 'server', title: '客户服务器设定', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'current', title: '电流检测', meta: '一键检测运行电流', setting: 'current' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机、模式与风速', setting: 'control' }
  ];
  var e74gTasks = [
    { key: 'meter', title: '电表参数', meta: '电表类型与通信参数', setting: 'meter' },
    { key: 'server', title: '客户服务器设定', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'info', title: '设备信息', meta: '序列号与 MAC 地址', setting: 'info' }
  ];
  var w01Tasks = [
    { key: 'brand', title: '特殊程序设置', meta: '即空调品牌设定', setting: 'brand' },
    { key: 'server', title: '客户服务器设定', meta: '保存后自动检测通讯', setting: 'server' },
    { key: 'control', title: '空调控制验证', meta: '验证开关机与运行模式', setting: 'control' },
    { key: 'upgrade', title: '设备固件升级', meta: '检查并更新设备固件', setting: 'upgrade' }
  ];

  // ===== 更多配置项（按 PRD V2.1 逐型号定义） =====
  var debugItems = [
    { key: 'debug-auto', title: '自动连接' },
    { key: 'debug-sniffer', title: '抓码调试' },
    { key: 'debug-param', title: '参数' }
  ];
  var a01More = [
    { key: 'network', title: '网络参数' },
    { key: 'server-factory', title: '原厂服务器设定' },
    { key: 'onekey', title: '一键配置' },
    { key: 'wan', title: 'WAN设定' },
    { key: 'lan', title: 'LAN设定' },
    { key: 'time-calib', title: '本地时间校准' },
    { key: 'index', title: '设备索引号设定' },
    { key: 'resistor', title: '终端电阻和上下拉电阻的配置' },
    { key: 'log-upload', title: '日志上传' },
    { key: 'reset-factory', title: '恢复出厂设置' },
    { key: 'bacnet', title: 'BACnet配置' },
    { key: 'dlt645', title: '本机DLT645设定' },
    { key: 'sn', title: '客户 SN 设定' }
  ].concat(debugItems);
  var a02gMore = [
    { key: 'network', title: '网络参数' },
    { key: 'server-factory', title: '原厂服务器设定' },
    { key: 'onekey', title: '一键配置' },
    { key: 'wan', title: 'WAN设定' },
    { key: 'lan', title: 'LAN设定' },
    { key: 'rtu', title: 'Modbus-RTU设定' },
    { key: 'time-calib', title: '本地时间校准' },
    { key: 'index', title: '设备索引号设定' },
    { key: 'net4g', title: '4G版本网络配置' },
    { key: 'hardware', title: '硬件配置' },
    { key: 'name', title: '自定义设备名称' },
    { key: 'resistor', title: '终端电阻和上下拉电阻的配置' },
    { key: 'log-upload', title: '日志上传' },
    { key: 'reset-factory', title: '恢复出厂设置' },
    { key: 'bacnet', title: 'BACnet配置' },
    { key: 'dlt645', title: '本机DLT645设定' },
    { key: 'sn', title: '客户 SN 设定' }
  ].concat(debugItems);
  var a02NoGMore = a02gMore.filter(function (item) { return item.key !== 'net4g'; });
  var s74gMore = [
    { key: 'u0x', title: 'U0X前导符设置' },
    { key: 'resistor', title: '终端电阻和上下拉电阻的配置' },
    { key: 'name', title: '自定义设备名称' }
  ];
  var s74lMore = [
    { key: 'u0x', title: 'U0X前导符设置' },
    { key: 'resistor', title: '终端电阻和上下拉电阻的配置' }
  ];
  var f16gMore = [
    { key: 'temp-comp', title: '温度传感器补偿设定' },
    { key: 'group-addr', title: '群控地址设定' },
    { key: 'name', title: '自定义设备名称' }
  ];
  var indoorMore = [
    { key: 'temp-comp', title: '温度传感器补偿设定' },
    { key: 'rtu-sensor', title: 'ModbusRTU自定义传感器' },
    { key: 'temp-source', title: '屏幕室内温度来源' },
    { key: 'u0x', title: 'U0X前导符设置' },
    { key: 'sensor-list', title: '传感器列表' },
    { key: 'capacity', title: '容量界面' },
    { key: 'name', title: '自定义设备名称' }
  ];
  var r7More = [
    { key: 'eev', title: '电子膨胀阀控制' },
    { key: 'resistor', title: '终端电阻和上下拉电阻的配置' },
    { key: 'name', title: '自定义设备名称' }
  ];
  var fdMore = [
    { key: 'upgrade', title: '设备固件升级' },
    { key: 'name', title: '自定义设备名称' },
    { key: 'reboot', title: '重启设备' },
    { key: 'reset-factory', title: '恢复出厂设置' }
  ];
  var e74gMore = [
    { key: 'upgrade', title: '固件升级' },
    { key: 'diagnosis', title: '设备诊断' }
  ];
  var w01More = [
    { key: 'rtu', title: 'Modbus-RTU设定' },
    { key: 'server-factory', title: '原厂服务器设定' },
    { key: 'onekey', title: '一键配置' },
    { key: 'wan', title: 'WAN设定' },
    { key: 'lan', title: 'LAN设定' },
    { key: 'time-calib', title: '本地时间校准' },
    { key: 'index', title: '设备索引号设定' },
    { key: 'net4g', title: '4G版本网络配置' },
    { key: 'hardware', title: '硬件配置' },
    { key: 'name', title: '自定义设备名称' },
    { key: 'resistor', title: '终端电阻和上下拉电阻的配置' },
    { key: 'ac-down', title: '空调下行参数设置' },
    { key: 'quick-program', title: '快速配置程序设置' },
    { key: 'modbus-offline', title: 'Modbus离线文件配置设定' },
    { key: 'port1-modbus', title: '设备1端口Modbus配置' },
    { key: 'meter', title: '电表参数设定' },
    { key: 'threeway', title: '三通状态' },
    { key: 'bacnet', title: 'BACnet配置' },
    { key: 'temp-limit', title: '温度限制范围设定' },
    { key: 'vpp-addr', title: '上海VPP通信地址' },
    { key: 'vpp-collector', title: '上海VPP采集器地址' },
    { key: 'modbus-sub', title: 'Modbus子地址设置' },
    { key: 'resistor-param', title: '电阻参数配置' },
    { key: 'power-judge', title: '开关机判断条件设定' },
    { key: 'simulator', title: '设置模拟器参数' },
    { key: 'threeway-time', title: '三通查询时间设置' }
  ];

  // ===== 机房群控产品（FQ 系列） =====
  var fq31Tasks = [
    { key: 'channel-config', title: '通道配置', meta: '配置通信单元通道', setting: 'channel-config' },
    { key: 'lan', title: 'LAN设定', meta: '局域网地址与网关', setting: 'lan' },
    { key: 'g4-basic', title: '4G基本信息', meta: 'IMEI / ICCID 与运营商', setting: 'g4-basic' },
    { key: 'g4-signal', title: '4G信号强度', meta: '当前 4G 网络信号', setting: 'g4-signal' }
  ];
  var fq31More = [
    { key: 'unit-upload', title: '通信单元上传配置' },
    { key: 'reset-factory', title: '恢复出厂设置' },
    { key: 'attr-config', title: '设备属性值配置' }
  ];
  var fq22Tasks = [
    { key: 'net-config', title: '配网模块配置', meta: '配网方式与地址', setting: 'net-config' },
    { key: 'iface-config', title: '接口配置', meta: '接口类型与波特率', setting: 'iface-config' },
    { key: 'jog-control', title: '点动控制', meta: '泵阀点动测试', setting: 'jog-control' },
    { key: 'up-iface', title: '对上接口配置', meta: '与上位机通讯协议', setting: 'up-iface' }
  ];
  var fq22More = [
    { key: 'rs485', title: '485接口配置' },
    { key: 'jog485', title: '点动控制485' },
    { key: 'desc', title: '设置设备描述' },
    { key: 'tbf-upload', title: '塔泵阀上传配置' }
  ];
  var fq23Tasks = fq22Tasks.concat([
    { key: 'lan', title: 'LAN设定', meta: '局域网地址与网关', setting: 'lan' },
    { key: 'ethernet', title: 'Ethernet配置', meta: '以太网地址参数', setting: 'ethernet' }
  ]);
  var fq23More = [
    { key: 'desc', title: '设置设备描述' },
    { key: 'tbf-upload', title: '塔泵阀上传配置' },
    { key: 'vfd-debug', title: '变频器调试' },
    { key: 'vfd-params', title: '变频器运行参数' }
  ];
  var fq24Tasks = fq23Tasks.concat([
    { key: 'vfd-debug', title: '变频器调试', meta: '调试变频器参数', setting: 'vfd-debug' }
  ]);
  var fq24More = [
    { key: 'rs485', title: '485接口配置' },
    { key: 'jog485', title: '点动控制485' },
    { key: 'desc', title: '设置设备描述' },
    { key: 'tbf-upload', title: '塔泵阀上传配置' },
    { key: 'vfd-params', title: '变频器运行参数' }
  ];

  var products = [
    {
      model: 'A03FG', name: 'A03FG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a03fg.png', remote: false, family: 'outdoor',
      variant: '4 路 4G 版', channels: 4, quickTasks: a02Tasks, moreSettings: a02gMore
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
      model: 'FP17', name: 'FP17 氟机智能温控器', category: '氟机通用智能温控器',
      image: '../assets/products/f16g.png', remote: false, family: 'indoor',
      variant: '氟机通用', channels: 1, quickTasks: fp17Tasks, moreSettings: indoorMore
    },
    {
      model: 'FD01G', name: 'FD01G 分体机控制器', category: '分体空调控制器',
      image: '../assets/products/fd01g.png', remote: false, family: 'fd01g',
      variant: '红外控制', channels: 1, quickTasks: fd01gDataTasks, moreSettings: fdMore
    },
    {
      model: 'FD02G', name: 'FD02G 分体机控制器', category: '分体空调控制器',
      image: '../assets/products/fd01g.png', remote: false, family: 'fd02g',
      variant: '内置红外即插即用', channels: 1, quickTasks: fd02gTasks, moreSettings: fdMore
    },
    {
      model: 'S74G', name: 'S74G 单路室外网关', category: '单路室外网关',
      image: '../assets/products/s74g.png', remote: false, family: 'single-outdoor',
      variant: '单路集控', channels: 1, quickTasks: s74gTasks, moreSettings: s74gMore
    },
    {
      model: 'S74L', name: 'S74L 主从扩展模块', category: '单路室外网关',
      image: '../assets/products/s74g.png', remote: false, family: 'single-outdoor',
      variant: '主从模式版', channels: 1, quickTasks: s74lTasks, moreSettings: s74lMore
    },
    {
      model: 'E74G', name: 'E74G 抄表器', category: '抄表器',
      image: '../assets/products/e74g.png', remote: false, family: 'meter',
      variant: '单路最多 32 只电表', channels: 1, quickTasks: e74gTasks, moreSettings: e74gMore
    },
    {
      model: 'R7', name: 'R7 空调焕新模块', category: '空调焕新模块',
      image: '../assets/products/r7.png', remote: false, family: 'r7',
      variant: '氟机工具类', channels: 1, quickTasks: r7Tasks, moreSettings: r7More
    },
    {
      model: 'W01G', name: 'W01G 冷水主机控制器', category: '冷水主机控制器',
      image: '../assets/products/w01.png', remote: false, family: 'water', contentOnly: true,
      variant: '主机通讯口直连', channels: 1, quickTasks: [], moreSettings: []
    },
    {
      model: 'W01P', name: 'W01P 冷水主机控制器', category: '冷水主机控制器',
      image: '../assets/products/w02.png', remote: false, family: 'water', contentOnly: true,
      variant: '主机线控器接入', channels: 1, quickTasks: [], moreSettings: []
    },
    {
      model: 'A01F', name: 'A01F 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a01f.png', remote: false, family: 'outdoor',
      variant: '4 路 F 版', channels: 4, quickTasks: a01Tasks, moreSettings: a01More
    },
    {
      model: 'A01E', name: 'A01E 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a01e.png', remote: false, family: 'outdoor',
      variant: '8 路 E 版', channels: 8, quickTasks: a01Tasks, moreSettings: a01More
    },
    {
      model: 'A01FG', name: 'A01FG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a01f.png', remote: false, family: 'outdoor',
      variant: '4 路（与 A02FG 功能一致）', channels: 4, quickTasks: a02Tasks, moreSettings: a02gMore
    },
    {
      model: 'A01EG', name: 'A01EG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a01e.png', remote: false, family: 'outdoor',
      variant: '8 路（与 A02EG 功能一致）', channels: 8, quickTasks: a02Tasks, moreSettings: a02gMore
    },
    {
      model: 'A02S', name: 'A02S 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a02.png', remote: false, family: 'outdoor',
      variant: '1 路（非 4G）', channels: 1, quickTasks: a02Tasks, moreSettings: a02NoGMore
    },
    {
      model: 'A02F', name: 'A02F 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a02.png', remote: false, family: 'outdoor',
      variant: '4 路（非 4G）', channels: 4, quickTasks: a02Tasks, moreSettings: a02NoGMore
    },
    {
      model: 'A02E', name: 'A02E 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a02.png', remote: false, family: 'outdoor',
      variant: '8 路（非 4G）', channels: 8, quickTasks: a02Tasks, moreSettings: a02NoGMore
    },
    {
      model: 'A02SG', name: 'A02SG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a02.png', remote: false, family: 'outdoor',
      variant: '1 路（4G）', channels: 1, quickTasks: a02Tasks, moreSettings: a02gMore
    },
    {
      model: 'A02FG', name: 'A02FG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a02fg.png', remote: false, family: 'outdoor',
      variant: '4 路（4G）', channels: 4, quickTasks: a02Tasks, moreSettings: a02gMore
    },
    {
      model: 'A02EG', name: 'A02EG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a02eg.png', remote: false, family: 'outdoor',
      variant: '8 路（4G）', channels: 8, quickTasks: a02Tasks, moreSettings: a02gMore
    },
    {
      model: 'A02MG', name: 'A02MG 室外机控制器', category: '多通道室外机控制器',
      image: '../assets/products/a02.png', remote: false, family: 'outdoor',
      variant: '主从扩展 · 最多 16 路', channels: 16, quickTasks: a02Tasks, moreSettings: a02gMore
    },
    {
      model: 'W01', name: 'W01 水机主机控制器', category: '水机主机控制器',
      image: '../assets/products/w01.png', remote: false, family: 'water',
      variant: '1 路空调通道', channels: 1, quickTasks: w01Tasks, moreSettings: w01More
    },
    {
      model: 'W02', name: 'W02 水机主机控制器', category: '水机主机控制器',
      image: '../assets/products/w02.png', remote: false, family: 'water',
      variant: '4 路空调通道', channels: 4, quickTasks: w01Tasks, moreSettings: w01More
    },
    {
      model: 'FQ11', name: 'FQ11 主机控制器', category: '机房群控产品',
      image: '../assets/products/fq11.png', remote: false, family: 'fq', contentOnly: true,
      variant: '主机控制器', channels: 1, quickTasks: [], moreSettings: []
    },
    {
      model: 'FQ22', name: 'FQ22 塔泵阀控制器', category: '机房群控产品',
      image: '../assets/products/fq22.png', remote: false, family: 'fq',
      variant: '塔泵阀控制器', channels: 1, quickTasks: fq22Tasks, moreSettings: fq22More
    },
    {
      model: 'FQ23', name: 'FQ23 塔泵阀控制器', category: '机房群控产品',
      image: '../assets/products/fq23.png', remote: false, family: 'fq',
      variant: '塔泵阀控制器（FQ22 迭代版）', channels: 1, quickTasks: fq23Tasks, moreSettings: fq23More
    },
    {
      model: 'FQ24', name: 'FQ24 塔泵阀控制器', category: '机房群控产品',
      image: '../assets/products/fq24.png', remote: false, family: 'fq',
      variant: '塔泵阀控制器（FQ22 迭代版）', channels: 1, quickTasks: fq24Tasks, moreSettings: fq24More
    },
    {
      model: 'FQ31', name: 'FQ31 通信单元', category: '机房群控产品',
      image: '../assets/products/fq31.png', remote: false, family: 'fq',
      variant: '通信单元', channels: 1, quickTasks: fq31Tasks, moreSettings: fq31More
    }
  ];

  var productIntros = {
    A01F: {
      intro: '多通道室外机控制器，面向电网调峰多联机批量接入场景。单台可同时接入 4 套品牌外机系统，通过外机通讯总线完成协议解析，将空调运行数据与调度控制指令接入电网主站与云端管理平台。',
      features: ['4 路外机通道，一台覆盖多套系统', '主流品牌多联机协议解析', '电网主站调度指令下发与执行反馈', '服务器对接与通讯自动检测']
    },
    A01E: {
      intro: '多通道室外机控制器的 8 路版本，面向全省整转的大体量多联机批量接入项目。单台可同时接入 8 套品牌外机系统，减少设备数量与布线成本，统一接入电网主站与云端管理平台。',
      features: ['8 路外机通道，适合批量整转项目', '主流品牌多联机协议解析', '电网主站调度指令下发与执行反馈', '服务器对接与通讯自动检测']
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
    },
    W01G: {
      intro: '冷水主机控制器，直连螺杆机、离心机、风冷模块等冷水主机通讯口，将主机运行状态、水温与故障信息接入集控平台，实现远程监控与群控启停。',
      features: ['主机通讯口直连（RS485）', '螺杆离心 / 风冷模块两大类适配', '运行状态与水温水压采集', '远程启停与群控联动']
    },
    W01P: {
      intro: '冷水主机控制器（线控器接入型），通过主机线控器通讯链路接入冷水主机，适用于主机通讯口已被占用或不开放的项目，改造更轻量。',
      features: ['主机线控器通讯链路接入', '免动主机主控板，改造量小', '状态采集与远程启停', '螺杆离心 / 风冷模块两大类适配']
    },
    A01FG: {
      intro: '多通道室外机控制器的 4 路版本，功能与 A02FG 完全一致、仅外观不同，单台接入 4 套品牌外机系统并直连云端。',
      features: ['4 路外机通道，按通道独立配置品牌', '与 A02FG 功能一致', '空调品牌批量配置', '服务器对接与通讯自动检测']
    },
    A01EG: {
      intro: '多通道室外机控制器的 8 路版本，功能与 A02EG 完全一致、仅外观不同，单台覆盖更多外机系统，适合集中部署。',
      features: ['8 路外机通道，按通道独立配置品牌', '与 A02EG 功能一致', '空调品牌批量配置', '服务器对接与通讯自动检测']
    },
    A02S: {
      intro: '第二代单路直连室外机控制器（非 4G 版），单路接入一套品牌外机系统，适合小体量项目，需现场布网接入平台。',
      features: ['单路外机接入', '空调品牌批量配置', 'RS485 / RTU 对接', 'BACnet 与 DLT645 扩展']
    },
    A02F: {
      intro: '第二代 4 路室外机控制器（非 4G 版），硬件平台升级，支持品牌批量配置，适合已布网项目的高效部署。',
      features: ['4 路外机通道，按通道独立配置品牌', '空调品牌批量配置', 'RS485 / RTU 对接', 'BACnet 与 DLT645 扩展']
    },
    A02E: {
      intro: '第二代 8 路室外机控制器（非 4G 版），单台覆盖更多系统，适合机房集中部署。',
      features: ['8 路外机通道，按通道独立配置品牌', '空调品牌批量配置', 'RS485 / RTU 对接', 'BACnet 与 DLT645 扩展']
    },
    A02SG: {
      intro: '第二代单路直连室外机控制器（4G 版），内置 4G 通讯免布网直连云端，适合无网络机房与分散点位。',
      features: ['单路外机接入', '内置 4G，免布网直连云端', '空调品牌批量配置', '4G 版本网络配置']
    },
    A02MG: {
      intro: '主从扩展模式主机，最多搭配 16 个 S74L 扩展模块，每个模块对应一路空调通道，适合点位分散的大体量项目。',
      features: ['主从扩展主机，最多 16 路', '每路对应 1 个 S74L 模块', '与 A02EG 相同的功能项配置', '空调品牌批量配置']
    },
    S74L: {
      intro: '单路主从模式扩展模块，作为 A02MG 的从模块使用，每个模块对应一路空调通道，支持固件升级与前导符、电阻配置。',
      features: ['A02MG 主从模式从模块', '每模块一路空调通道', 'U0X 前导符设置', '固件在线升级']
    },
    E74G: {
      intro: '抄表器，单路最多串接 32 只电表，通过 DL/T 645 或 Modbus RTU 协议抄读电量数据并上传平台。',
      features: ['单路最多 32 只电表', 'DL/T 645 / Modbus RTU 抄读', '电表参数一键配置', '设备诊断']
    },
    FP17: {
      intro: '氟机通用智能温控器，适配主流氟机内机，支持温度传感器补偿、自定义传感器与屏幕温度来源设定，实现单台内机的智能温控。',
      features: ['氟机通用温控', '温度传感器补偿设定', 'ModbusRTU 自定义传感器', '屏幕室内温度来源可选']
    },
    R7: {
      intro: '空调焕新模块（氟机工具类），适配老旧氟机焕新改造，支持内外机独立设定、电子膨胀阀控制与固件升级。',
      features: ['空调内机 / 外机独立设定', '电子膨胀阀控制', '客户服务器设定', '固件在线升级']
    },
    FD02G: {
      intro: '新一代分体空调控制器，内置红外即插即用，支持码库在线下载自动匹配，配合电流检测判定真实运行状态。',
      features: ['内置红外即插即用', '码库在线下载，自动 / 手动匹配', '电流检测判定运行状态', '双服务器设定']
    },
    W01: {
      intro: '水机主机控制器，直连螺杆机、离心机、风冷模块等冷水主机通讯口，单台覆盖 1 路空调通道，将主机运行状态与故障信息接入平台。',
      features: ['1 路空调通道', '主机通讯口直连（RS485）', '特殊程序设置（空调品牌设定）', '三通状态与 VPP 对接']
    },
    W02: {
      intro: '水机主机控制器的 4 路升级版，单台覆盖 4 路空调通道，三通相关选项与空调通道一一对应，适合多主机集中部署。',
      features: ['4 路空调通道', '三通选项与通道一一对应', '特殊程序设置（空调品牌设定）', '三通状态与 VPP 对接']
    },
    FQ11: {
      intro: '机房群控主机控制器，负责冷水机房群控系统的整体协调与联动控制，不使用蓝牙小程序调试。',
      features: ['机房群控主机', '系统级联动控制', '不使用蓝牙小程序', '内容层展示']
    },
    FQ22: {
      intro: '机房群控塔泵阀控制器，负责冷却塔、水泵与阀件的控制与状态采集，支持配网模块配置、接口配置与点动控制。',
      features: ['塔泵阀控制', '配网模块配置', '点动控制测试', '485 接口配置']
    },
    FQ23: {
      intro: '塔泵阀控制器（FQ22 迭代版），在 FQ22 基础上增加 LAN / Ethernet 网络接入与变频器调试能力，适配带变频器的泵组控制。',
      features: ['FQ22 迭代版', 'LAN / Ethernet 接入', '变频器调试', '变频器运行参数查看']
    },
    FQ24: {
      intro: '塔泵阀控制器（FQ22 迭代版），支持 LAN / Ethernet 网络接入，快速配置即含变频器调试，支持 485 接口与点动控制。',
      features: ['FQ22 迭代版', 'LAN / Ethernet 接入', '快速配置含变频器调试', '变频器运行参数查看']
    },
    FQ31: {
      intro: '机房群控通信单元，承担群控系统对上的 4G 通讯，支持通道配置、LAN 设定与 4G 信号查看。',
      features: ['4G 通讯单元', '通道配置', '4G 基本信息与信号强度', '通信单元上传配置']
    }
  };
  products.forEach(function (p) {
    var extra = productIntros[p.model];
    if (extra) { p.intro = extra.intro; p.features = extra.features; }
  });

  var bluetoothDevices = [
    { model: 'A01F', name: 'A01F-3F903E', id: '3C:71:BF:3F:90:3E', rssi: -52 },
    { model: 'A01F', name: 'A01F-62B81C', id: '3C:71:BF:62:B8:1C', rssi: -66 },
    { model: 'A01F', name: 'A01F-1D4A90', id: '3C:71:BF:1D:4A:90', rssi: -71 },
    { model: 'A01F', name: 'A01F-77C2E5', id: '3C:71:BF:77:C2:E5', rssi: -60 },
    { model: 'A01E', name: 'A01E-8E21A7', id: '3C:71:BF:8E:21:A7', rssi: -61 },
    { model: 'A01E', name: 'A01E-4B930D', id: '3C:71:BF:4B:93:0D', rssi: -68 },
    { model: 'A01E', name: 'A01E-0F6C22', id: '3C:71:BF:0F:6C:22', rssi: -55 },
    { model: 'A01FG', name: 'A01FG-3B88E1', id: '3C:71:BF:3B:88:E1', rssi: -63 },
    { model: 'A01FG', name: 'A01FG-9D14C7', id: '3C:71:BF:9D:14:C7', rssi: -72 },
    { model: 'A01FG', name: 'A01FG-51A032', id: '3C:71:BF:51:A0:32', rssi: -58 },
    { model: 'A01EG', name: 'A01EG-2E7B44', id: '3C:71:BF:2E:7B:44', rssi: -65 },
    { model: 'A01EG', name: 'A01EG-C816F9', id: '3C:71:BF:C8:16:F9', rssi: -69 },
    { model: 'A01EG', name: 'A01EG-7A25D1', id: '3C:71:BF:7A:25:D1', rssi: -54 },
    { model: 'A02S', name: 'A02S-0B3E57', id: '7C:DF:A1:0B:3E:57', rssi: -66 },
    { model: 'A02S', name: 'A02S-4D81A2', id: '7C:DF:A1:4D:81:A2', rssi: -73 },
    { model: 'A02S', name: 'A02S-91C6E8', id: '7C:DF:A1:91:C6:E8', rssi: -59 },
    { model: 'A02F', name: 'A02F-3A7D05', id: '7C:DF:A1:3A:7D:05', rssi: -62 },
    { model: 'A02F', name: 'A02F-6E12B4', id: '7C:DF:A1:6E:12:B4', rssi: -70 },
    { model: 'A02F', name: 'A02F-D5483C', id: '7C:DF:A1:D5:48:3C', rssi: -57 },
    { model: 'A02E', name: 'A02E-8A140C', id: '7C:DF:A1:8A:14:0C', rssi: -64 },
    { model: 'A02E', name: 'A02E-2C7F91', id: '7C:DF:A1:2C:7F:91', rssi: -71 },
    { model: 'A02E', name: 'A02E-B03E62', id: '7C:DF:A1:B0:3E:62', rssi: -56 },
    { model: 'A02SG', name: 'A02SG-1F4C80', id: '7C:DF:A1:1F:4C:80', rssi: -60 },
    { model: 'A02SG', name: 'A02SG-83A5D6', id: '7C:DF:A1:83:A5:D6', rssi: -67 },
    { model: 'A02SG', name: 'A02SG-45E91B', id: '7C:DF:A1:45:E9:1B', rssi: -74 },
    { model: 'A02FG', name: 'A02FG-0D72F1', id: '7C:DF:A1:0D:72:F1', rssi: -70 },
    { model: 'A02FG', name: 'A02FG-6B38A9', id: '7C:DF:A1:6B:38:A9', rssi: -53 },
    { model: 'A02FG', name: 'A02FG-E124C5', id: '7C:DF:A1:E1:24:C5', rssi: -65 },
    { model: 'A02FG', name: 'A02FG-9A7D03', id: '7C:DF:A1:9A:7D:03', rssi: -72 },
    { model: 'A02EG', name: 'A02EG-5C1E47', id: '7C:DF:A1:5C:1E:47', rssi: -61 },
    { model: 'A02EG', name: 'A02EG-F863A0', id: '7C:DF:A1:F8:63:A0', rssi: -68 },
    { model: 'A02EG', name: 'A02EG-3D90B2', id: '7C:DF:A1:3D:90:B2', rssi: -55 },
    { model: 'A02MG', name: 'A02MG-7E4B18', id: '7C:DF:A1:7E:4B:18', rssi: -63 },
    { model: 'A02MG', name: 'A02MG-C2A8F4', id: '7C:DF:A1:C2:A8:F4', rssi: -69 },
    { model: 'A02MG', name: 'A02MG-5D67E0', id: '7C:DF:A1:5D:67:E0', rssi: -58 },
    { model: 'A03FG', name: 'A03FG-4G-46B2D0', id: 'D8:3A:DD:46:B2:D0', rssi: -59 },
    { model: 'A03FG', name: 'A03FG-4G-7C15A8', id: 'D8:3A:DD:7C:15:A8', rssi: -66 },
    { model: 'A03FG', name: 'A03FG-4G-B38E52', id: 'D8:3A:DD:B3:8E:52', rssi: -72 },
    { model: 'S74G', name: 'S74G-A02C11', id: '5E:12:88:A0:2C:11', rssi: -67 },
    { model: 'S74G', name: 'S74G-4D9F73', id: '5E:12:88:4D:9F:73', rssi: -56 },
    { model: 'S74G', name: 'S74G-81E6C4', id: '5E:12:88:81:E6:C4', rssi: -71 },
    { model: 'S74L', name: 'S74L-0C5A96', id: '5E:12:88:0C:5A:96', rssi: -62 },
    { model: 'S74L', name: 'S74L-67D30B', id: '5E:12:88:67:D3:0B', rssi: -69 },
    { model: 'S74L', name: 'S74L-E2B148', id: '5E:12:88:E2:B1:48', rssi: -57 },
    { model: 'E74G', name: 'E74G-3B6D91', id: '9A:3F:6C:3B:6D:91', rssi: -60 },
    { model: 'E74G', name: 'E74G-8C20A7', id: '9A:3F:6C:8C:20:A7', rssi: -66 },
    { model: 'E74G', name: 'E74G-1F94E3', id: '9A:3F:6C:1F:94:E3', rssi: -73 },
    { model: 'F16G', name: 'F16G-B7A403', id: '44:6E:1B:B7:A4:03', rssi: -74 },
    { model: 'F16G', name: 'F16G-3D6E92', id: '44:6E:1B:3D:6E:92', rssi: -58 },
    { model: 'F16G', name: 'F16G-91C8B5', id: '44:6E:1B:91:C8:B5', rssi: -64 },
    { model: 'B25LG', name: 'B25LG-9C2D01', id: 'A4:CF:12:9C:2D:01', rssi: -63 },
    { model: 'B25LG', name: 'B25LG-7E14A6', id: 'A4:CF:12:7E:14:A6', rssi: -70 },
    { model: 'B25LG', name: 'B25LG-0D58F2', id: 'A4:CF:12:0D:58:F2', rssi: -55 },
    { model: 'FP17', name: 'FP17-6A3D84', id: 'A4:CF:12:6A:3D:84', rssi: -61 },
    { model: 'FP17', name: 'FP17-C97E20', id: 'A4:CF:12:C9:7E:20', rssi: -68 },
    { model: 'FP17', name: 'FP17-5B01D7', id: 'A4:CF:12:5B:01:D7', rssi: -74 },
    { model: 'FD01G', name: 'FD01G-7319E2', id: 'B8:27:EB:73:19:E2', rssi: -57 },
    { model: 'FD01G', name: 'FD01G-4A8C15', id: 'B8:27:EB:4A:8C:15', rssi: -65 },
    { model: 'FD01G', name: 'FD01G-92E7B0', id: 'B8:27:EB:92:E7:B0', rssi: -71 },
    { model: 'FD02G', name: 'FD02G-6C3F08', id: 'B8:27:EB:6C:3F:08', rssi: -59 },
    { model: 'FD02G', name: 'FD02G-1E75D4', id: 'B8:27:EB:1E:75:D4', rssi: -66 },
    { model: 'FD02G', name: 'FD02G-A920E6', id: 'B8:27:EB:A9:20:E6', rssi: -72 },
    { model: 'E50', name: 'E50-A1B2C3', id: '88:6B:0F:A1:B2:C3', rssi: -58 },
    { model: 'E50', name: 'E50-7D4E12', id: '88:6B:0F:7D:4E:12', rssi: -64 },
    { model: 'E50', name: 'E50-36C8A9', id: '88:6B:0F:36:C8:A9', rssi: -70 },
    { model: 'R7', name: 'R7-5A0E63', id: '62:0A:44:5A:0E:63', rssi: -62 },
    { model: 'R7', name: 'R7-8B27F1', id: '62:0A:44:8B:27:F1', rssi: -69 },
    { model: 'R7', name: 'R7-0C94D5', id: '62:0A:44:0C:94:D5', rssi: -56 },
    { model: 'W01', name: 'W01-4F7A28', id: '2C:54:91:4F:7A:28', rssi: -60 },
    { model: 'W01', name: 'W01-93C5E0', id: '2C:54:91:93:C5:E0', rssi: -67 },
    { model: 'W01', name: 'W01-2B86D4', id: '2C:54:91:2B:86:D4', rssi: -73 },
    { model: 'W02', name: 'W02-6E39C1', id: '2C:54:91:6E:39:C1', rssi: -58 },
    { model: 'W02', name: 'W02-C8A570', id: '2C:54:91:C8:A5:70', rssi: -65 },
    { model: 'W02', name: 'W02-0D2B9E', id: '2C:54:91:0D:2B:9E', rssi: -71 },
    { model: 'FQ22', name: 'FQ22-1A4C90', id: '48:E7:DA:1A:4C:90', rssi: -61 },
    { model: 'FQ22', name: 'FQ22-6B2E73', id: '48:E7:DA:6B:2E:73', rssi: -68 },
    { model: 'FQ22', name: 'FQ22-D85F1C', id: '48:E7:DA:D8:5F:1C', rssi: -74 },
    { model: 'FQ23', name: 'FQ23-3C9A58', id: '48:E7:DA:3C:9A:58', rssi: -59 },
    { model: 'FQ23', name: 'FQ23-8F07D2', id: '48:E7:DA:8F:07:D2', rssi: -66 },
    { model: 'FQ23', name: 'FQ23-14B6E9', id: '48:E7:DA:14:B6:E9', rssi: -72 },
    { model: 'FQ24', name: 'FQ24-5E2D47', id: '48:E7:DA:5E:2D:47', rssi: -63 },
    { model: 'FQ24', name: 'FQ24-B09A61', id: '48:E7:DA:B0:9A:61', rssi: -70 },
    { model: 'FQ24', name: 'FQ24-27C4F3', id: '48:E7:DA:27:C4:F3', rssi: -57 },
    { model: 'FQ31', name: 'FQ31-9D5E12', id: '48:E7:DA:9D:5E:12', rssi: -60 },
    { model: 'FQ31', name: 'FQ31-46A8C0', id: '48:E7:DA:46:A8:C0', rssi: -67 },
    { model: 'FQ31', name: 'FQ31-E31B75', id: '48:E7:DA:E3:1B:75', rssi: -73 }
  ];

  return {
    products: products,
    bluetoothDevices: bluetoothDevices,
    remoteDevices: [
      { model: 'E50', name: '东区机房 E50', id: 'E50-250701-0186', online: true, updatedAt: '刚刚' },
      { model: 'E50', name: '研发实验室 E50', id: 'E50-250624-0062', online: false, updatedAt: '07-23 18:42' }
    ],
    toolHero: { title: '支持查询', icon: '查', desc: '氟机与水机（螺杆离心/风冷模块）接入支持查询', href: 'tool-fluoro-input.html' },
    toolCards: [
      { title: '空调接线', icon: '线', desc: '各品牌接线端子图文', href: 'tool-wiring.html' },
      { title: '操作指引', icon: '引', desc: '视频教程与产品文档', href: 'tool-guide.html' },
      { title: '空调故障码', icon: '码', desc: '故障代码含义与处理', href: 'tool-errcode.html' },
      { title: '远程协助', icon: '协', desc: '技术支持远程接管操作', href: 'tool-remote.html' }
    ],
    toolMenu: [
      { title: '技术&服务', icon: '服', action: 'ai-service' },
      { title: '留言反馈', icon: '言', href: 'feedback.html' }
    ],
    scenes: [
      {
        title: '办公楼多联机节能场景', video: '办公楼多联机节能场景介绍视频', ac: '多联机（氟机）', products: 'A01 / A02 系列网关', items: ['a01', 'a02'],
        pain: '楼层多联机品牌杂、分布散，下班忘关、温度过低，能耗浪费严重且无法考核',
        solution: '全品牌多联机统一接入，分区温控、定时启停、人走关空调等节能策略批量下发',
        value: '节能率 15% 以上，空调能耗可计量、可考核，物业运维人力减半'
      },
      {
        title: '校园场景空调管理', video: '校园场景空调管理介绍视频', ac: '教室/宿舍分体机为主', products: 'FD01G 红外控制器 + A03FG', items: ['fd01g', 'a03fg'],
        pain: '分体机数量多，学生随意开关调温，教室宿舍无人常开，后勤管理不过来',
        solution: '红外码库统一集控，按课表定时开关、温度上下限锁定，远程一键管控',
        value: '杜绝无效运行能耗直降，后勤从挨个楼层关空调变一屏统管'
      },
      {
        title: '娱乐场所 · 酒店场景', video: '娱乐场所 · 酒店场景介绍视频', ac: '风机盘管（水机末端）', products: 'F16G 风机盘管控制器', items: ['f16g'],
        pain: '客房空调退房后空转、入住温度投诉多，传统线控器无法集中管理',
        solution: '风机盘管集中控制，远程预设温度、退房联动关闭、入住前提前开启',
        value: '客房能耗明显下降、投诉减少，前台一屏掌握全部房态空调'
      },
      {
        title: '娱乐场所 · 网吧场景', video: '娱乐场所 · 网吧场景介绍视频', ac: '分体柜机 / 挂机', products: 'FD01G + A03FG（4G 直连）', items: ['fd01g', 'a03fg'],
        pain: '24 小时营业空调常开，包间无人空转，多门店分散无统一监管',
        solution: '红外集控按区域定时启停、温度下限锁定，4G 直连云端多店一平台',
        value: '节能 15%+，老板手机端随时掌握各店空调状态，不再巡店关空调'
      },
      {
        title: '公共建筑场景', video: '公共建筑场景介绍视频', ac: '多联机 + 水机系统', products: 'A03FG / B25LG / W01 系列 + 机房群控', items: ['a03fg', 'b25lg', 'w01', 'jqf'],
        pain: '节能降碳合规压力大（能耗限额、能碳双控考核），设备分散、人工巡检挨个关空调',
        solution: '全域集中管控（多品牌兼容、分区调温、统一启停）+ 场景节能策略 + 24 小时故障预警',
        value: '节能率承诺不低于 15%；落地案例烟台税务局节能率超 40%、萧山机关事务服务中心 18%，满足合规考核'
      }
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
        key: 'a01', title: 'A01 系列', rep: 'A01F', models: 'A01F / A01E / A01FG / A01EG', desc: '多通道室外机控制器 · 4/8 路',
        videos: ['A01 系列开箱安装与首次上电', '服务器参数配置与连接自检', '空调品牌批量配置实操'],
        docs: [['产品手册', 'A01 系列室外机控制器产品手册'], ['方案文档', '电网调峰多联机批量接入方案'], ['指导文件', 'A01 系列接线端子与拨码说明']]
      },
      {
        key: 'a02', title: 'A02 系列', rep: 'A02FG', models: 'A02S / A02F / A02E / A02SG / A02FG / A02EG / A02MG', desc: '第二代室外机控制器 · 1/4/8/16 路',
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
        key: 'fd01g', title: 'FD01G', rep: 'FD01G', models: 'FD01G / FD02G', desc: '分体空调红外控制器',
        videos: ['FD01G 红外码库匹配实操', '电流阈值设置与状态判定', '红外学习操作演示'],
        docs: [['产品手册', 'FD01G 分体空调控制器产品手册'], ['方案文档', '分体机红外集控方案'], ['指导文件', 'FD01G 电流检测接线指引']]
      },
      {
        key: 's74g', title: 'S74G', rep: 'S74G', models: 'S74G / S74L', desc: '单路室外网关 / 主从扩展模块',
        videos: ['S74G 单路网关快速接入', '服务器对接与通讯自检', '小体量项目部署案例'],
        docs: [['产品手册', 'S74G 单路室外网关产品手册'], ['方案文档', '小体量项目轻量接入方案'], ['指导文件', 'S74G 安装与网络配置指引']]
      },
      {
        key: 'fp17', title: 'FP17', rep: 'FP17', models: 'FP17', desc: '氟机通用智能温控器',
        videos: ['FP17 温控器安装接线', '温度传感器补偿设定', 'ModbusRTU 自定义传感器配置'],
        docs: [['产品手册', 'FP17 氟机智能温控器产品手册'], ['方案文档', '氟机末端智能温控方案'], ['指导文件', 'FP17 安装与调试指引']]
      },
      {
        key: 'r7', title: 'R7', rep: 'R7', models: 'R7', desc: '空调焕新模块（氟机工具类）',
        videos: ['R7 焕新模块开箱与安装', '空调内外机设定', '电子膨胀阀控制说明'],
        docs: [['产品手册', 'R7 空调焕新模块产品手册'], ['方案文档', '老旧氟机焕新改造方案'], ['指导文件', 'R7 现场作业指引']]
      },
      {
        key: 'e74g', title: 'E74G', rep: 'E74G', models: 'E74G', desc: '抄表器 · 单路最多 32 只电表',
        videos: ['E74G 抄表器接线与安装', '电表参数配置', '电表抄读数据核验'],
        docs: [['产品手册', 'E74G 抄表器产品手册'], ['方案文档', '分户计费抄表接入方案'], ['指导文件', 'E74G 电表接线指引']]
      },
      {
        key: 'e50', title: 'E50', rep: 'E50', models: 'E50', desc: '空调诊断设备 · 蓝牙 / 4G',
        videos: ['E50 蓝牙配对与设备连接', '空调系统搜索与识别', 'AI 智能诊断快速上手'],
        docs: [['产品手册', 'E50 空调诊断设备产品手册'], ['方案文档', '空调故障诊断服务方案'], ['指导文件', 'E50 现场作业指引']]
      },
      {
        key: 'w01', title: 'W01 系列', rep: 'W01G', models: 'W01 / W02 / W01G / W01P', desc: '水机主机控制器 · 螺杆离心/风冷模块',
        videos: ['W01G 接线与上线演示', '水机品牌与协议配置', '主机线控器对接实操'],
        docs: [['产品手册', 'W01 系列冷水主机控制器产品手册'], ['方案文档', '冷水主机集控方案（W01 系列）'], ['指导文件', 'W01 系列主机通讯口接线指引']]
      },
      {
        key: 'jqf', title: '机房群控', rep: 'FQ22', models: 'FQ22 / FQ23 / FQ24 / FQ31', desc: '冷水机房设备群控系统',
        intro: '机房群控是一整套冷水机房设备控制系统，覆盖冷水主机、水泵、冷却塔与阀件的联动控制与能效管理，并非单一控制器产品。',
        videos: ['机房群控系统组成与架构', '群控策略与联动逻辑', '机房群控项目交付案例'],
        docs: [['产品手册', '机房群控系统概述'], ['方案文档', '冷水机房群控解决方案'], ['指导文件', '机房群控实施与验收指引']]
      }
    ],
    mine: { name: '飞奕工程师 · 张工', phone: '138****8203', version: '2.0.0' }
  };
});
