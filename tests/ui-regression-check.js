const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const demo = read('demo.html');
const bluetoothPage = read('pages/tab-device-bt.html');
const remotePage = read('pages/tab-device-4g.html');
const quickPage = read('pages/device-quick.html');
const detailPage = read('pages/device-detail.html');
const e50Page = read('pages/device-e50.html');
const fd01gPage = read('pages/device-fd01g.html');
const deviceList = read('assets/app/device-list.js');
const appCss = read('assets/app/app.css');
const productData = read('assets/app/product-data.js');
const deviceFlow = read('assets/app/device-flow.js');
const workbench = read('assets/app/workbench.js');
const acPage = read('pages/device-a01-ac.html');

assert(!demo.includes('window.location.replace'), 'demo must remain a usable launch page');
assert(demo.includes('href="pages/tab-device-bt.html"'), 'demo must launch into the device tab');
assert(demo.includes('assets/logo/LOGO-彩色.png'), 'demo must show the Feiyi logo');
assert(!productData.includes("value: 'D 2.0.0'"), 'released account page must not expose the prototype edition marker');

assert(bluetoothPage.includes('id="product-list"'), 'Bluetooth tab must expose the grouped product host');
assert(deviceList.includes('product-card'), 'Bluetooth devices must render as grouped product cards');
assert(deviceList.includes("setAttribute('aria-expanded'"), 'grouped product cards must expose their expanded state');
assert(deviceList.includes("device.model === 'FD01G'"), 'FD01G must enter its dedicated Bluetooth flow');
assert(deviceList.includes("device.model === 'E50'"), 'E50 must enter its dedicated Bluetooth flow');
assert(workbench.includes("product.remote && params.get('mode') === '4g'"), 'shared non-E50 flows must reject forged 4G mode');
assert(deviceFlow.includes('allowedSettings.indexOf(setting) < 0'), 'shared settings must reject unsupported capabilities');
assert(/\.product-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/.test(appCss), 'product grid must show two models per row');
assert(!deviceList.includes('product-type'), 'product cards must hide product category');
assert(!deviceList.includes('product-count'), 'product cards must hide discovered count');
assert(deviceList.includes('model-expansion'), 'expanded Bluetooth devices must use a full-width row');
assert(appCss.includes('aspect-ratio: 430 / 932'), 'desktop prototype must use a large-phone aspect ratio');
assert(/\.app-content\s*\{[^}]*overflow-y:\s*auto/.test(appCss), 'long pages must scroll inside the phone frame');

assert(remotePage.includes('tab-mine.html') && remotePage.includes('location.replace'), 'legacy 4G tab must redirect to mine');
assert(read('pages/tab-mine.html').includes('mine-devices.html'), 'mine must expose the bound devices entry');
const mineDevicesPage = read('pages/mine-devices.html');
assert(mineDevicesPage.includes("model: 'E50'"), 'remote device links must identify E50 explicitly');
assert(mineDevicesPage.includes("mode: '4g'"), 'remote device links must enter 4G mode');

assert(!quickPage.includes('跳过快速配置'), 'shared quick flow must remove skipping configuration');
assert(quickPage.includes('更多配置'), 'shared quick flow must link the full configuration page');
assert(deviceFlow.includes('进入设备详情'), 'quick flow hero card must expose device details');
assert(detailPage.includes('id="more-settings"'), 'shared details must expose secondary settings');
assert(acPage.includes('id="ac-groups"'), 'air-conditioner management must render channel-grouped indoor units');
assert(acPage.includes('neiji.png') && acPage.includes('fancoil.svg') && acPage.includes('unit-machine'), 'air-conditioner cards must switch icons by unit type');
assert(acPage.includes('id="batch-control"') && acPage.includes('id="all-on"') && acPage.includes('id="all-off"'), 'air-conditioner management must support batch, all-on and all-off control');
assert(!acPage.includes('参数查看') && !acPage.includes('unit-detail'), 'non-E50 ac page must remove indoor parameter viewing');
assert(acPage.includes('id="channel-tabs"'), 'air-conditioner management must switch channels via top tabs');

for (const route of ['device-e50-detail.html', 'device-e50-ac.html', 'device-e50-guide.html']) {
  assert(e50Page.includes(route), `E50 setup must link to ${route}`);
}
assert(read('pages/device-e50-detail.html').includes('device-e50-ai.html'), 'E50 detail must link to the AI doctor');
assert(read('pages/device-e50-ai.html').includes('device-e50-report.html'), 'E50 ai-home must link to the diagnosis report');
assert(e50Page.includes('assets/app/e50.js'), 'E50 setup must use the shared e50 shell');
for (const view of ['control', 'learning', 'current', 'electric', 'upgrade']) {
  assert(fd01gPage.includes(`view=${view}`), `FD01G must link to ${view}`);
}
assert(!fd01gPage.includes("query.get('mode') === '4g'"), 'FD01G home must ignore forged 4G mode');
assert(!fd01gPage.includes('tab-device-4g.html'), 'FD01G home must always return to Bluetooth devices');
const fd01gMorePage = read('pages/device-fd01g-more.html');
assert(!fd01gMorePage.includes("q.get('mode')==='4g'"), 'FD01G secondary views must ignore forged 4G mode');
assert(!fd01gMorePage.includes('4G \\u8fdc\\u7a0b'), 'FD01G secondary views must never render a 4G state');

const legacyRedirects = {
  'pages/device-a01-ac-ctrl.html': 'device-setting.html?model=A01&setting=control',
  'pages/device-a01-chan-batch.html': 'device-setting.html?model=A01&setting=brand-batch',
  'pages/device-a01-client-server.html': 'device-setting.html?model=A01&setting=server',
  'pages/device-a01-config.html': 'device-detail.html?model=A01',
  'pages/device-a01-debug.html': 'device-detail.html?model=A01',
  'pages/device-a01-fw.html': 'device-setting.html?model=A01&setting=upgrade',
  'pages/device-a01-lan.html': 'device-setting.html?model=A01&setting=network',
  'pages/device-a01-meter.html': 'device-setting.html?model=A01&setting=meter',
  'pages/device-a01-rtu.html': 'device-setting.html?model=A01&setting=rtu',
  'pages/device-a01-server.html': 'device-setting.html?model=A01&setting=server',
  'pages/device-a01-wan.html': 'device-setting.html?model=A01&setting=network',
  'pages/device-basic-config.html': 'device-detail.html?model=A01',
  'pages/check-server-running.html': 'device-setting.html?model=A01&setting=server',
  'pages/check-server-success.html': 'device-setting.html?model=A01&setting=server',
  'pages/check-server-fail.html': 'device-setting.html?model=A01&setting=server',
  'pages/device-e50g-outdoor.html': 'device-e50-detail.html?model=E50&type=outdoor',
  'pages/device-e50g-indoor.html': 'device-e50-ac.html?model=E50',
  'pages/device-e50g-indoor-params.html': 'device-e50-detail.html?model=E50&type=indoor',
  'pages/device-e50g-ai.html': 'device-e50-ai.html?model=E50',
  'pages/finish-with-cta.html': 'tab-tools.html',
  'pages/partner-jump.html': 'tab-tools.html',
  'pages/tab-device-4g.html': 'tab-mine.html',
  'pages/product-catalog.html': 'tool-guide.html'
};

for (const [file, target] of Object.entries(legacyRedirects)) {
  const html = read(file);
  assert(html.includes(target), `${file} must redirect to ${target}`);
  assert(html.includes('location.replace'), `${file} must be a compatibility redirect`);
}

const publicHtmlFiles = [
  'demo.html',
  'index.html',
  ...fs.readdirSync(path.join(root, 'pages'))
    .filter((file) => file.endsWith('.html'))
    .map((file) => `pages/${file}`)
];
for (const file of publicHtmlFiles) {
  const html = read(file);
  assert(!html.includes('<!--'), `${file} must not retain HTML process comments`);
  assert(!html.includes('/*'), `${file} must not retain inline style process comments`);
  for (const phrase of ['演示环境', '原型说明', '兜底入口', '功能规划中', '合伙人', '企微客服']) {
    assert(!html.includes(phrase), `${file} must remove delivery-external copy: ${phrase}`);
  }
  for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    assert.doesNotThrow(() => new Function(script[1]), `${file} must contain valid inline JavaScript`);
  }
}

console.log('UI regression checks passed');
