const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const data = require(path.join(root, 'assets/app/product-data.js'));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const byModel = Object.fromEntries(data.products.map((product) => [product.model, product]));
const expectedModels = ['A01F', 'A01E', 'A02FG', 'A02EG', 'A03FG', 'F16G', 'B25LG', 'FD01G', 'S74G', 'E50'];

assert.deepEqual(Object.keys(byModel).sort(), expectedModels.slice().sort(), 'must expose the ten supported models');
assert.deepEqual(
  data.products.filter((product) => product.remote).map((product) => product.model),
  ['E50'],
  'only E50 supports 4G remote debugging'
);

for (const model of expectedModels) {
  const product = byModel[model];
  assert(product.image.startsWith('../assets/products/'), `${model} must use a local product image`);
  assert(
    fs.existsSync(path.join(root, 'pages', product.image)),
    `${model} product image must exist in assets/products`
  );
  assert(Array.isArray(product.quickTasks) && product.quickTasks.length > 0, `${model} must define quick tasks`);
  assert(Array.isArray(product.moreSettings), `${model} must define more settings`);
}

for (const model of ['A01F', 'A01E', 'A02FG', 'A02EG', 'A03FG']) {
  assert.deepEqual(
    byModel[model].quickTasks.map((task) => task.key),
    ['batch-brand', 'server', 'meter', 'control'],
    `${model} must use the outdoor-controller quick flow`
  );
  assert.deepEqual(
    byModel[model].moreSettings.map((setting) => setting.key),
    byModel.A01F.moreSettings.map((setting) => setting.key),
    `${model} must use the same outdoor-controller secondary flow`
  );
}

for (const model of ['F16G', 'B25LG']) {
  const keys = byModel[model].quickTasks.map((task) => task.key);
  const expected = model === 'F16G' ? ['valve', 'control', 'upgrade'] : ['brand', 'control', 'upgrade'];
  assert.deepEqual(keys, expected, `${model} must use the indoor-controller quick flow`);
  assert(!JSON.stringify(byModel[model]).includes('server'), `${model} must not expose server settings`);
}
assert.equal(
  byModel.F16G.quickTasks[0].title,
  '管制线阀类型',
  'F16G is a fan-coil controller and must configure valve type instead of air-conditioner brand'
);
assert(
  byModel.F16G.moreSettings.some((setting) => setting.key === 'temp-comp' && setting.title === '温度传感器补偿设定'),
  'F16G must expose temperature sensor compensation in more settings'
);
assert.equal(
  byModel.A01F.moreSettings.find((setting) => setting.key === 'channel').title,
  '空调品牌设置',
  'per-channel settings must be renamed to air-conditioner brand settings'
);

assert.deepEqual(
  byModel.FD01G.quickTasks.map((task) => task.key),
  ['ir-library', 'current-threshold'],
  'FD01G must use infrared matching and current threshold'
);
assert(!JSON.stringify(byModel.FD01G).includes('server'), 'FD01G must not expose server settings');

assert.deepEqual(
  byModel.S74G.quickTasks.map((task) => task.key),
  ['brand', 'server', 'control'],
  'S74G must use brand, server check and control validation'
);
assert(!JSON.stringify(byModel.S74G).includes('meter'), 'S74G must not expose meter settings');

assert.equal(data.remoteDevices.length, 2, 'remote page must have a concise E50 device list');
assert(data.remoteDevices.every((device) => device.model === 'E50'), 'remote list must contain E50 only');
assert(data.bluetoothDevices.every((device) => expectedModels.includes(device.model)), 'Bluetooth devices must use supported models');

assert.equal(data.toolHero.title, '氟机支持查询', 'fluorine support query must be the top hero tool');
assert(data.toolHero.href === 'tool-fluoro-input.html', 'fluorine support query must enter the query flow');
assert.deepEqual(
  data.toolCards.map((item) => item.title),
  ['接线指导', '安装调试视频', '故障码查询', '远程协助'],
  'frequent tools must render as cards'
);
assert(data.toolCards.find((item) => item.title === '远程协助').href === 'tool-remote.html', 'remote assist tool must enter the remote assist flow');
assert.deepEqual(
  data.toolMenu.map((item) => item.title),
  ['产品方案', '留言反馈', '飞奕公众号', '使用说明'],
  'remaining services must collapse into a menu list'
);
assert(!JSON.stringify([data.toolHero, data.toolCards, data.toolMenu]).includes('专业版切换'), 'pro-version switch must be removed');
assert(data.mine.name.includes('张工') && /1\d{2}\*{4}\d{4}/.test(data.mine.phone) && data.mine.version === '2.0.0', 'mine must expose the authorized name, masked phone and version');
assert(!JSON.stringify(data.mine).includes('关于飞奕'), 'mine must remove the About Feiyi entry');

const bluetoothPage = read('pages/tab-device-bt.html');
const remotePage = read('pages/tab-device-4g.html');
const toolsPage = read('pages/tab-tools.html');
const minePage = read('pages/tab-mine.html');

assert(bluetoothPage.includes('id="product-list"'), 'Bluetooth page must render the grouped product list');
assert(bluetoothPage.includes('device-list.js'), 'Bluetooth page must use shared device-list behavior');
for (const forbidden of ['promo-banner', '按型号查找', '现场工具', '型号目录', 'page-intro']) {
  assert(!bluetoothPage.includes(forbidden), `Bluetooth page must remove ${forbidden}`);
}
assert(remotePage.includes('id="remote-list"'), 'remote page must render the E50 remote list');
assert(remotePage.includes('device-list.js'), 'remote page must use shared remote-list behavior');
for (const forbidden of ['绑定新设备', '运行日志', '使用说明']) {
  assert(!remotePage.includes(forbidden), `remote page must remove ${forbidden}`);
}
assert(toolsPage.includes('id="tool-hero"') && toolsPage.includes('id="tool-cards"') && toolsPage.includes('id="tool-menu"'), 'tools page must combine hero card, tool cards and a menu list');
assert(!toolsPage.includes('产品手册'), 'tools page must rename product manuals to product solutions');
assert(toolsPage.includes('ai-assistant.js'), 'tools page must load the AI assistant');
for (const text of ['id="mine-profile"', 'id="mine-name"', 'id="mine-phone"', '退出登录', 'id="mine-version"']) {
  assert(minePage.includes(text), `mine page must include ${text}`);
}
for (const forbidden of ['暖通合伙人', '企微客服', '语言', '留言反馈', '专业版切换', '飞奕公众号', '使用说明', '关于飞奕']) {
  assert(!minePage.includes(forbidden), `mine page must remove ${forbidden}`);
}

const quickPage = read('pages/device-quick.html');
const detailPage = read('pages/device-detail.html');
const settingPage = read('pages/device-setting.html');
const morePage = read('pages/device-more.html');
const deviceFlow = read('assets/app/device-flow.js');
const workbench = read('assets/app/workbench.js');
assert(quickPage.includes('id="quick-tasks"'), 'quick page must render product-driven tasks');
assert(!quickPage.includes('跳过快速配置'), 'quick page must remove skip quick configuration');
assert(deviceFlow.includes('进入设备详情') && deviceFlow.includes('hero-detail-link'), 'hero card must contain the device detail entry');
assert(quickPage.includes('id="more-link"') && quickPage.includes('更多配置'), 'quick page bottom action must be 更多配置');
assert(quickPage.includes('id="quick-resources"'), 'quick page must expose model resource links');
assert(deviceFlow.includes('安装调试视频') && deviceFlow.includes('产品方案介绍') && deviceFlow.includes('tool-videos.html') && deviceFlow.includes('product-intro.html'), 'quick resources must link model videos and product intro');
assert(morePage.includes('更多配置'), 'more page must be titled 更多配置');
assert(detailPage.includes('id="more-settings"'), 'device details must expose more settings');
assert(detailPage.includes('id="device-parameters"'), 'device details must expose full device parameters');
assert(detailPage.includes('id="menu-trigger"') && detailPage.includes('id="side-menu"'), 'device details must use a left sidebar menu');
assert(morePage.includes('id="more-page"') && morePage.includes('id="more-quick"') && morePage.includes('id="more-settings"'), 'more page must aggregate remaining settings');
assert(morePage.includes('device-flow.js') && morePage.includes('workbench.js') && morePage.includes('connection-state.js'), 'more page must use the shared workbench shell');
assert(deviceFlow.includes('renderMore'), 'device flow must render the more-functions page');
for (const text of ['快速配置', '设备参数详情', '更多配置', '切换其他产品', 'menu-switch-btn', 'side-app-btn', 'side-app-label">工具', 'side-app-label">我的', 'tab-tools.html', 'tab-mine.html', 'tab-device-bt.html']) {
  assert(workbench.includes(text), `sidebar must include ${text}`);
}
assert(workbench.includes('side-nav-label">应用'), 'sidebar must separate device functions from app entries');
assert(deviceFlow.includes('hero-disconnect') && deviceFlow.includes('断开连接'), 'Bluetooth products must move disconnect next to the connected status');
assert(settingPage.includes('id="setting-content"'), 'setting page must render capability-aware settings');
assert(deviceFlow.includes('保存并检测通讯') && deviceFlow.includes('检测通讯中') && deviceFlow.includes('通讯正常'), 'server settings must support automatic communication checks');
assert(quickPage.includes('device-flow.js') && detailPage.includes('device-flow.js') && settingPage.includes('device-flow.js'), 'shared pages must use device-flow behavior');
for (const page of [quickPage, detailPage, settingPage]) {
  assert(page.includes('connection-state.js'), 'shared debugging pages must load persistent connection state');
  assert(page.includes('workbench.js'), 'shared debugging pages must load the workbench shell');
}
for (const text of ['断开蓝牙连接', '确认断开', 'side-menu-open']) {
  assert(workbench.includes(text), `workbench must include ${text}`);
}
for (const text of ['服务器 IP 配置', '服务器域名配置', '本地 TCP', '云端 MQTT', 'MODBUSTCP_V2.6', 'MODBUSTCPCLIENT_V2.6', 'MODBUSRTU_V2.6']) {
  assert(deviceFlow.includes(text), `server settings must include ${text}`);
}
for (const text of ['启用通道', '协议属性', '模拟器数量', 'data-channel']) {
  assert(deviceFlow.includes(text), `channel settings must include ${text}`);
}
for (const text of ['管制线阀类型', '2管制2线阀', '2管制3线阀', '4管制', '补偿值的正负', '补偿温度值']) {
  assert(deviceFlow.includes(text), `F16G fan-coil settings must include ${text}`);
}

const connectionState = read('assets/app/connection-state.js');
for (const api of ['get', 'connect', 'disconnect', 'switchTransport']) {
  assert(connectionState.includes(`${api}:`), `connection state must expose ${api}`);
}
assert(connectionState.includes('sessionStorage'), 'Bluetooth connection must persist across page navigation');
assert(connectionState.includes('disconnectBluetooth'), 'switching E50 from Bluetooth to 4G must disconnect Bluetooth explicitly');

const fd01gPage = read('pages/device-fd01g.html');
const e50Page = read('pages/device-e50.html');
for (const text of ['品牌搜索', '热门品牌', '码库测试', '电流阈值', '红外学习', '电流检测']) {
  assert(fd01gPage.includes(text), `FD01G must include ${text}`);
}
assert(!fd01gPage.includes('服务器'), 'FD01G page must not expose server settings');
const e50Shared = read('assets/app/e50.js');
for (const text of ['连接设备', '选择空调品牌', '搜索空调', '模拟内机数量', '模拟内机', '模拟外机', '搜索附近设备', '重新搜索', '重新选择', '设备信息', '查看接线图', '选择品牌', '操作指引', '更多功能', '室外机模块（主）', '室外机模块（从）', '室内机数量', 'device-e50-detail.html', 'device-e50-ac.html', 'device-e50-guide.html']) {
  assert(e50Page.includes(text), `E50 setup must include ${text}`);
}
for (const text of ['日立', '格力', '海信', '青岛约克', '美的家用', '模拟器', 'FE50G-A8C4', '已识别空调系统', 'detailDatasets', 'reportDatasets', 'EL15']) {
  assert(e50Shared.includes(text), `E50 shared data must include ${text}`);
}
for (const text of ['切换其他产品', '检修抓码', '设备升级', '设备列表', '技术&服务', '联系我们', '>工具<', '>我的<', 'tab-tools.html', 'tab-mine.html']) {
  assert(e50Shared.includes(text), `E50 sidebar must include ${text}`);
}
for (const forbidden of ['演示环境', '暖通合伙人']) {
  assert(!e50Page.includes(forbidden), `E50 must remove ${forbidden}`);
}
const e50DetailPage = read('pages/device-e50-detail.html');
for (const text of ['导出文件', 'AI 诊断', '选择诊断机器', '室外机模块', '内机 · ', "'outdoor'", "'indoor'", 'ids', '内机模拟状态无法AI诊断']) {
  assert(e50DetailPage.includes(text), `E50 detail must include ${text}`);
}
const e50AiPage = read('pages/device-e50-ai.html');
for (const text of ['飞奕AI空调医生', 'AI 智能诊断', '查看完整报告', '对话历史', '按住说话', '已解决', '未解决', 'gwdbg.e50.chat']) {
  assert(e50AiPage.includes(text), `E50 ai-home must include ${text}`);
}
const e50AcPage = read('pages/device-e50-ac.html');
for (const text of ['内机列表', '空调控制', '参数查看', '全选', '请先选择内机', '回风温度']) {
  assert(e50AcPage.includes(text), `E50 ac page must include ${text}`);
}
const e50ReportPage = read('pages/device-e50-report.html');
for (const text of ['诊断报告', '故障分析', '可能原因', '排查步骤', '保存报告为图片', '设备参数']) {
  assert(e50ReportPage.includes(text), `E50 report must include ${text}`);
}
const e50UpgradePage = read('pages/device-e50-upgrade.html');
for (const text of ['固件升级', '发现新版本', '立即升级', '升级成功', '重新检测', 'V1.3.2', 'V1.4.0']) {
  assert(e50UpgradePage.includes(text), `E50 upgrade must include ${text}`);
}
const e50DevicesPage = read('pages/device-e50-devices.html');
for (const text of ['我的设备', '解绑', '在线', '离线', 'FE50G-A8C4', 'E50-91D0F4']) {
  assert(e50DevicesPage.includes(text), `E50 devices must include ${text}`);
}
const e50ServicePage = read('pages/device-e50-service.html');
for (const text of ['技术支持', '转人工', '转接人工客服', '发送消息']) {
  assert(e50ServicePage.includes(text), `E50 service must include ${text}`);
}
const e50ContactPage = read('pages/device-e50-contact.html');
for (const text of ['联系我们', '问题描述', '请输入姓名', '请输入手机号']) {
  assert(e50ContactPage.includes(text), `E50 contact must include ${text}`);
}
const e50GuidePage = read('pages/device-e50-guide.html');
for (const text of ['操作指引', '暂无视频']) {
  assert(e50GuidePage.includes(text), `E50 guide must include ${text}`);
}
for (const page of [e50Page, e50DetailPage, e50AiPage, e50AcPage, e50ReportPage, e50UpgradePage, e50DevicesPage, e50ServicePage, e50ContactPage, e50GuidePage]) {
  assert(page.includes('e50.js'), 'E50 pages must use the shared e50 shell');
  assert(page.includes('connection-state.js'), 'E50 pages must load persistent connection state');
}
const fd01gMorePage = read('pages/device-fd01g-more.html');
for (const view of ['control', 'learning', 'current', 'electric', 'upgrade']) {
  assert(fd01gMorePage.includes(`'${view}'`), `FD01G more page must support ${view}`);
  assert(fd01gPage.includes(`view=${view}`), `FD01G home must link to ${view}`);
}

const legacyRoutes = {
  'pages/device-a01-home.html': 'device-quick.html?model=A01F',
  'pages/device-f16g.html': 'device-quick.html?model=F16G',
  'pages/device-b25lg.html': 'device-quick.html?model=B25LG',
  'pages/device-s74g.html': 'device-quick.html?model=S74G',
  'pages/device-e50g.html': 'device-e50.html?model=E50'
};
for (const [file, target] of Object.entries(legacyRoutes)) {
  assert(read(file).includes(target), `${file} must preserve its legacy route through ${target}`);
}
assert(read('pages/product-catalog.html').includes('产品方案'), 'product catalog must become product solutions');

const publicPages = [
  'index.html', 'demo.html', 'pages/tab-device-bt.html', 'pages/tab-device-4g.html', 'pages/tab-tools.html',
  'pages/tab-mine.html', 'pages/device-quick.html', 'pages/device-detail.html', 'pages/device-setting.html',
  'pages/device-more.html', 'pages/device-fd01g.html', 'pages/device-e50.html', 'pages/device-e50-detail.html',
  'pages/device-e50-ai.html', 'pages/device-e50-ac.html', 'pages/device-e50-report.html', 'pages/device-e50-upgrade.html',
  'pages/device-e50-devices.html', 'pages/device-e50-service.html', 'pages/device-e50-contact.html', 'pages/device-e50-guide.html',
  'pages/product-catalog.html', 'pages/tool-wiring.html',
  'pages/tool-videos.html', 'pages/tool-errcode.html', 'pages/tool-fluoro-input.html', 'pages/tool-fluoro-result.html',
  'pages/tool-fluoro-submit.html', 'pages/feedback.html',
  'pages/tool-remote.html', 'pages/tool-remote-assisted.html', 'pages/tool-remote-assist.html'
];
for (const file of publicPages) {
  const html = read(file);
  for (const phrase of ['演示环境', '兜底入口', '功能规划中', '不再重复制作']) {
    assert(!html.includes(phrase), `${file} must remove delivery-external phrase: ${phrase}`);
  }
}

const fluoroInput = read('pages/tool-fluoro-input.html');
const fluoroResult = read('pages/tool-fluoro-result.html');
const fluoroSubmit = read('pages/tool-fluoro-submit.html');
assert(fluoroInput.includes('氟机支持查询') && fluoroInput.includes('空调品牌') && fluoroInput.includes('外机完整型号'), 'fluoro query must take brand and full model');
for (const text of ['支持接入', '接线指导', '主从判断', '安装调试视频']) {
  assert(fluoroResult.includes(text), `supported result must include ${text}`);
}
for (const text of ['暂未收录', '留言反馈', '铭牌照片', '电路图']) {
  assert(fluoroSubmit.includes(text), `unsupported result must guide to feedback with ${text}`);
}
assert(!fluoroInput.includes('氟机选型') && !fluoroResult.includes('氟机选型') && !fluoroSubmit.includes('氟机选型'), 'fluoro pages must drop the old naming');

const remoteHome = read('pages/tool-remote.html');
const remoteAssisted = read('pages/tool-remote-assisted.html');
const remoteAssist = read('pages/tool-remote-assist.html');
for (const text of ['请求协助', '协助他人', 'tool-remote-assisted.html', 'tool-remote-assist.html']) {
  assert(remoteHome.includes(text), `remote assist home must include ${text}`);
}
for (const text of ['开启远程协助', '协助码', '等待技术支持接入', '远程协助中', '结束协助', '无法访问您手机的其他应用']) {
  assert(remoteAssisted.includes(text), `assisted page must include ${text}`);
}
for (const text of ['协助码', '连接', '远程点击', '结束协助', '无法访问其手机其他应用']) {
  assert(remoteAssist.includes(text), `assist page must include ${text}`);
}
assert(!remoteHome.includes('PC 端') && !remoteAssisted.includes('PC 端') && !remoteAssist.includes('PC 端'), 'prototype pages must defer PC-side assist details to the feature manual');

const aiAssistant = read('assets/app/ai-assistant.js');
for (const text of ['AI 智能助理', '转人工', '转接人工客服', '已收到您的问题', 'aa-ball', 'aa-chat', 'GWDBG_AI_ASSISTANT']) {
  assert(aiAssistant.includes(text), `ai assistant must include ${text}`);
}
for (const text of ['奕', 'pointermove', 'docked', 'placeDefault']) {
  assert(aiAssistant.includes(text), `assistant ball must include ${text}`);
}
assert(!aiAssistant.includes("innerHTML = 'AI"), 'assistant ball must not keep the old AI glyph');
for (const page of ['tab-tools', 'tool-fluoro-input', 'tool-fluoro-result', 'tool-fluoro-submit', 'tool-wiring', 'tool-videos', 'tool-errcode', 'feedback',
  'tool-remote', 'tool-remote-assisted', 'tool-remote-assist',
  'tab-device-bt', 'tab-device-4g', 'tab-mine', 'product-catalog', 'product-intro',
  'device-quick', 'device-detail', 'device-more', 'device-setting', 'device-a01-ac', 'device-fd01g', 'device-fd01g-more',
  'device-e50', 'device-e50-detail', 'device-e50-ai', 'device-e50-ac', 'device-e50-report', 'device-e50-upgrade',
  'device-e50-devices', 'device-e50-service', 'device-e50-contact', 'device-e50-guide']) {
  assert(read(`pages/${page}.html`).includes('ai-assistant.js'), `${page} must load the ai assistant globally`);
}

console.log('Product data requirements passed');
