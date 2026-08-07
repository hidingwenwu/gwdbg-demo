const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const screenshotDir = path.join(root, 'assets', 'screenshots');
fs.mkdirSync(screenshotDir, { recursive: true });

function contentType(file) {
  return { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png' }[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const file = path.resolve(root, `.${requestPath}`);
      if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        response.writeHead(404).end('Not found');
        return;
      }
      response.writeHead(200, { 'Content-Type': `${contentType(file)}; charset=utf-8` });
      fs.createReadStream(file).pipe(response);
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function open(page, baseUrl, route) {
  await page.goto(`${baseUrl}/${route}`);
  await page.waitForLoadState('networkidle');
}

async function assertNoHorizontalOverflow(page, route) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `${route} must not overflow horizontally (overflow ${overflow}px)`);
}

(async () => {
  let browser;
  let server;
  try {
    server = await startServer();
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));

    await open(page, baseUrl, 'pages/tab-device-bt.html');
    const shell = await page.locator('.app-shell').boundingBox();
    assert(shell.width <= 431 && shell.height <= 933, 'desktop prototype must use a 430 × 932 large-phone frame');
    assert(Math.abs(shell.width / shell.height - 430 / 932) < 0.01, 'desktop prototype must preserve the 430:932 phone ratio');
    assert.equal(await page.locator('.product-card').count(), 10, 'Bluetooth page must render ten independent model cards');
    assert.equal(await page.locator('.scan-tip').count(), 1, 'device page must show the nearby-scan hint');
    assert.equal(await page.locator('.scheme-entry').count(), 0, 'device page must remove the product scheme entry');
    assert.deepEqual(await page.locator('.tab').allTextContents(), ['设备', '工具', '场景', '我的'], 'tabbar must order device, tools, scene, mine');
    await page.locator('[data-model="A01F"] .product-head').click();
    assert.match(await page.locator('[data-model="A01F"]').getAttribute('class'), /open/);
    assert.equal(await page.locator('[data-model="A01F"] .product-type').count(), 0, 'model cards must only show image and model');
    await page.screenshot({ path: path.join(screenshotDir, 'final-device-groups-large-phone.png'), fullPage: false });

    await page.setViewportSize({ width: 430, height: 932 });
    await open(page, baseUrl, 'pages/tab-device-bt.html');
    await page.locator('[data-model="A01F"] .product-head').click();
    await page.locator('[data-expansion-model="A01F"] .connect-button').first().click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('#page-title').textContent(), /快速配置/, 'quick page title must drop the model name');
    assert.equal((await page.locator('#page-title').textContent()).includes('A01F'), false, 'quick page title must not contain the model');
    assert.match(await page.locator('#menu-trigger').textContent(), /更多功能/, 'debug pages must label the sidebar trigger as 更多功能');
    assert.equal(await page.locator('#nav-back').count(), 1, 'debug pages must expose a back button');
    assert.match(await page.locator('#more-link').textContent(), /更多配置/, 'quick page bottom action must be 更多配置');
    assert.match(await page.locator('#detail-link').textContent(), /进入设备详情/, 'hero card must contain the device detail entry');
    assert.equal(await page.locator('#quick-tasks .task-row').count(), 4, 'A01F must expose four quick tasks');
    assert.equal(await page.getByText('跳过快速配置').count(), 0, 'quick setup must not expose the removed skip action');

    assert.match(await page.locator('#guide-link').getAttribute('href'), /product-intro\.html\?series=a01/, 'quick guide entry must target the A01 series hub');
    await page.locator('#guide-link').click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('#intro-title').textContent(), /A01 系列/, 'series hub must render the A01 series');
    assert.equal(await page.locator('.guide-card').count(), 3, 'series hub must list intro videos');
    await page.locator('[data-tab="docs"]').click();
    assert.match(await page.locator('#res-list').textContent(), /产品手册/, 'series hub must list manuals and docs');
    await page.locator('#nav-back').click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('#page-title').textContent(), /快速配置/, 'guide hub back must return to the quick page');

    await page.locator('#detail-link').click();
    await page.waitForLoadState('networkidle');
    assert((await page.locator('#device-parameters .parameter-row').count()) >= 12, 'device details must expose full parameter rows');
    await page.locator('#menu-trigger').click();
    assert(await page.locator('body').evaluate((body) => body.classList.contains('side-menu-open')), 'menu trigger must open the left menu');
    assert.equal(await page.locator('.menu-switch-btn').count(), 1, 'sidebar must lead with 切换其他产品');
    assert.match(await page.locator('.menu-switch-btn').textContent(), /切换其他产品/);
    assert.equal(await page.locator('.side-nav-item').count(), 3, 'sidebar must merge settings into quick config, device details and more config');
    assert.equal(await page.locator('.side-nav-item', { hasText: '更多配置' }).count(), 1, 'sidebar must merge remaining settings into 更多配置');
    assert.equal(await page.locator('.side-app-btn').count(), 2, 'sidebar must expose prominent tools and mine entries');
    assert.equal(await page.getByText('断开蓝牙连接').count(), 0, 'non-E50 sidebar must not keep the Bluetooth disconnect');
    await page.locator('#side-menu-overlay').click();
    await page.locator('.hero-disconnect').click();
    assert.equal(await page.locator('#connection-modal').getByText('确认断开').count(), 1, 'disconnect must require confirmation');
    await page.locator('[data-modal-close]').last().click();

    await open(page, baseUrl, 'pages/tool-videos.html?model=A01F');
    assert.equal(await page.locator('.filter-row .chip.active').textContent(), '集控主机', 'videos must preselect the connected model category');
    assert.equal(await page.locator('.video-card:visible').count(), 2, 'videos must filter by the model category');

    await open(page, baseUrl, 'pages/device-setting.html?model=A01F&device=A01F-3F903E&mode=bt&setting=brand-batch');
    assert.equal(await page.locator('#nav-back').count(), 1, 'setting sub-page must expose a back button');
    assert.equal(await page.locator('[data-channel]').count(), 4, 'A01F must expose four independently configurable channels');
    assert.equal(await page.locator('[data-channel] input[type=checkbox]:checked').count(), 4, 'all channels must be enabled by default');
    await page.locator('[data-channel="1"] .channel-brand').selectOption({ label: '模拟器' });
    assert.equal(await page.locator('[data-channel="1"] .simulator-count').getAttribute('hidden'), null, 'simulator brand must reveal simulator quantity');
    assert.equal(await page.locator('[data-channel="1"] .simulator-count input').getAttribute('max'), '160');
    await open(page, baseUrl, 'pages/device-setting.html?model=A01E&device=A01E-8E21A7&mode=bt&setting=brand-batch');
    assert.equal(await page.locator('[data-channel]').count(), 8, 'A01E must expose eight independently configurable channels');

    await open(page, baseUrl, 'pages/device-setting.html?model=A01F&device=A01F-3F903E&mode=bt&setting=server');
    assert.equal(await page.locator('[data-server-tab]').count(), 2, 'server settings must provide IP and domain tabs');
    await page.locator('[data-server-tab="domain"]').click();
    assert(await page.locator('[data-server-pane="domain"]').evaluate((pane) => pane.classList.contains('active')));
    assert((await page.locator('[data-server-pane="domain"] option').allTextContents()).includes('MODBUSTCPCLIENT_V2.6'));
    await page.locator('#save-setting').click();
    await page.getByText('通讯正常').waitFor();

    await open(page, baseUrl, 'pages/device-a01-ac.html?model=A01F&device=A01F-3F903E&mode=bt');
    assert.equal(await page.locator('.channel-tab').count(), 4, 'A01F air-conditioner management must render channel tabs');
    assert.equal(await page.locator('.indoor-card').count(), 8, 'A01F air-conditioner management must render the active channel units');
    await page.locator('.unit-check input').nth(0).check();
    await page.locator('.unit-check input').nth(1).check();
    assert.match(await page.locator('#selection-count').textContent(), /2/);
    await page.locator('#batch-control').click();
    assert(await page.locator('#control-sheet').evaluate((sheet) => sheet.classList.contains('show')));
    await page.locator('#send-control').click();
    await page.locator('.channel-tab', { hasText: '通道 2' }).click();
    assert.equal(await page.locator('.indoor-card').count(), 8, 'switching channel must render its units');
    assert.match(await page.locator('#selection-count').textContent(), /已选 0 台/, 'switching channel must clear the selection');

    const forgedDevice = '<img src=x onerror="window.deviceInjected=true">';
    await open(page, baseUrl, `pages/device-quick.html?model=F16G&device=${encodeURIComponent(forgedDevice)}&mode=4g`);
    assert.equal(await page.locator('#quick-tasks').getByText('服务器配置').count(), 0, 'F16G must not expose server settings');
    assert.match(await page.locator('.hero-status').textContent(), /蓝牙/, 'F16G must reject forged 4G mode');
    assert.equal(await page.evaluate(() => Boolean(window.deviceInjected)), false, 'forged device IDs must not execute scripts');
    await open(page, baseUrl, 'pages/device-setting.html?model=S74G&device=S74G-A02C11&mode=bt&setting=meter');
    assert.equal(await page.getByText('电表地址').count(), 0, 'S74G must reject forged meter settings');

    await open(page, baseUrl, 'pages/device-quick.html?model=F16G&device=F16G-B7A403&mode=bt');
    assert.match(await page.locator('#quick-tasks').textContent(), /管制线阀类型/, 'F16G quick flow must lead with valve type');
    assert.equal(await page.locator('#quick-tasks').getByText('空调品牌设置').count(), 0, 'F16G must not configure air-conditioner brand');
    await open(page, baseUrl, 'pages/device-setting.html?model=F16G&device=F16G-B7A403&mode=bt&setting=valve');
    assert.match(await page.locator('#page-title').textContent(), /管制线阀类型/);
    assert((await page.locator('#setting-content option').allTextContents()).join(',').includes('2管制2线阀'), 'valve setting must offer pipe/valve types');
    await open(page, baseUrl, 'pages/device-more.html?model=F16G&device=F16G-B7A403&mode=bt');
    assert.equal(await page.getByText('温度传感器补偿设定').count(), 1, 'F16G more functions must expose temperature compensation');
    await page.locator('#menu-trigger').click();
    await page.locator('.side-app-btn', { hasText: '工具' }).first().click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('.topbar-title').textContent(), /工具/, 'sidebar tools entry must jump out to the tools tab');
    await open(page, baseUrl, 'pages/device-setting.html?model=F16G&device=F16G-B7A403&mode=bt&setting=temp-comp');
    assert.equal(await page.getByText('补偿温度值').count(), 1, 'F16G must render temperature compensation fields');

    await open(page, baseUrl, 'pages/device-e50.html?model=E50&device=FE50G-A8C4&mode=bt');
    assert.match(await page.locator('#hero-title').textContent(), /配置产品/, 'E50 entry must be the setup wizard');
    assert.match(await page.locator('#setup-body').textContent(), /已连接 FE50G-A8C4/, 'setup must show the connected device in step 1');
    await page.locator('[data-act="mode"][data-mode="4G"]').click();
    assert.match(await page.locator('.modal-layer.show .confirm-dialog').textContent(), /是否切换为4G模式/, 'transport switch must confirm first');
    await page.locator('.modal-layer.show .confirm-dialog [data-act="ok"]').click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).searchParams.get('mode'), '4g', 'E50 must switch to 4G mode');
    assert.equal((await page.locator('[data-act="mode"].active').textContent()).trim(), '4G', '4G must be the active transport');
    await page.locator('[data-act="mode"][data-mode="蓝牙"]').click();
    await page.locator('.modal-layer.show .confirm-dialog [data-act="ok"]').click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '选择品牌', exact: true }).click();
    await page.locator('#brand-picker [data-brand="格力"]').click();
    await page.getByRole('button', { name: '搜索空调', exact: true }).click();
    await page.getByText('已识别空调系统1').waitFor({ timeout: 9000 });
    assert.match(await page.locator('#hero-title').textContent(), /连接成功/, 'setup must complete with the connected hero');
    assert.equal(await page.locator('.ac-system-group').count(), 3, 'setup must render the three recognized systems');
    assert.equal(await page.locator('#device-info-link').evaluate((el) => el.hidden), false, 'Bluetooth mode must expose device info');

    await page.locator('[data-act="outdoor"][data-role="主"]').first().click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('#hero-title').textContent(), /室外机模块（主）/);
    assert((await page.locator('.param-card .param-row').count()) > 20, 'outdoor detail must render full parameter rows');
    assert((await page.locator('.param-card .param-row.abnormal').count()) >= 3, 'outdoor detail must flag abnormal rows');
    await page.locator('#ai-btn').click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('#machine-name').textContent(), /室外机模块（主）/);
    await page.locator('#diagnose-btn').click();
    await page.locator('.fb-ok').first().waitFor({ timeout: 15000 });
    assert.equal(await page.locator('.ai-diag-card').count(), 1, 'diagnosis must render the summary card');
    await page.locator('.diag-report-btn').click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('#report-body').textContent(), /FAULTS 故障分析/, 'report must render fault analysis');
    assert.equal(await page.locator('.issue-card').count(), 3, 'report must render three issues');
    await page.screenshot({ path: path.join(screenshotDir, 'final-e50-4g-indoor-list.png'), fullPage: false });

    await open(page, baseUrl, 'pages/device-e50-ac.html?model=E50&device=FE50G-A8C4&mode=bt');
    assert.equal(await page.locator('.ac-unit-card').count(), 4, 'ac page must render indoor units');
    await page.locator('.ac-unit-card').nth(0).click();
    await page.locator('.ac-unit-card').nth(1).click();
    await page.locator('#go-detail').click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('#hero-title').textContent(), /内机参数（2台）/, 'multi indoor compare must render');

    await open(page, baseUrl, 'pages/device-e50.html?model=E50&device=FE50G-A8C4&mode=bt');
    await page.locator('#menu-trigger').click();
    for (const label of ['切换其他产品', '检修抓码', '设备升级', '设备列表', '技术&服务', '工具', '我的']) {
      assert((await page.locator('#side-menu').getByText(label, { exact: false }).count()) >= 1, `E50 sidebar must include ${label}`);
    }
    assert.equal(await page.locator('#side-menu').getByText('联系我们').count(), 0, 'E50 sidebar must remove the contact entry');
    await page.locator('.side-nav-item', { hasText: '检修抓码' }).click();
    assert.match(await page.locator('#capture-sheet').textContent(), /抓码原因/, 'capture sheet must open from the sidebar');

    await open(page, baseUrl, 'pages/device-e50-upgrade.html?model=E50&device=FE50G-A8C4&mode=bt');
    await page.locator('#start-upgrade').click();
    await page.getByText('升级成功').waitFor({ timeout: 15000 });

    await open(page, baseUrl, 'pages/device-fd01g.html?model=FD01G&device=FD01G-7319E2&mode=4g');
    assert.match(await page.locator('.hero-status').textContent(), /蓝牙/, 'FD01G must reject forged 4G mode');
    await page.locator('#hero-find').click();
    assert.match(await page.locator('#hero-find').textContent(), /蜂鸣中 · 第 \d\/3 轮/, 'find device must start the three-round beeping');
    await page.getByText('寻找完成，设备已蜂鸣 3 轮').waitFor({ timeout: 8000 });
    await page.locator('[data-fd01g-view="code"]').click();
    await page.waitForLoadState('networkidle');
    await page.locator('#test-code').click();
    assert.match(await page.locator('#match-result').textContent(), /空调是否正确响应/);
    await page.locator('#match-no').click();
    assert.match(await page.locator('#code-label').textContent(), /第 2\/8 套/);
    await open(page, baseUrl, 'pages/tab-device-bt.html?pick=1');
    await page.locator('[data-model="FD01G"] .product-head').click();
    await page.locator('[data-expansion-model="FD01G"] .connect-button').first().click();
    await page.waitForLoadState('networkidle');
    await page.locator('[data-fd01g-view="current"]').click();
    await page.waitForLoadState('networkidle');
    await page.locator('#detect').click();
    await page.getByText('电流检测完成，曲线已生成').waitFor();
    await open(page, baseUrl, 'pages/device-fd01g-more.html?model=FD01G&device=FD01G-7319E2&mode=bt&view=electric');
    assert.match(page.url(), /device-fd01g-view\.html/, 'legacy more view links must redirect to the view host');
    assert.equal(await page.getByText('保存采集配置').count(), 1);
    assert.equal(await page.getByText('单独保存电流阈值').count(), 1);
    await open(page, baseUrl, 'pages/device-fd01g-more.html?model=FD01G&device=FD01G-7319E2&mode=bt');
    for (const label of ['固件升级', '红外学习', '重启设备', '恢复出厂设置']) {
      assert.equal(await page.locator('.list-row', { hasText: label }).count(), 1, `FD01G more config must list ${label}`);
    }
    await open(page, baseUrl, 'pages/device-fd01g-detail.html?model=FD01G&device=FD01G-7319E2&mode=bt');
    assert.equal(await page.getByText('服务器配置信息').count(), 1, 'FD01G detail must show the server config section');
    assert.equal(await page.getByText('设备编号（SN）').count(), 1, 'FD01G detail must show the device SN');

    await open(page, baseUrl, 'pages/tab-device-4g.html');
    await page.waitForLoadState('networkidle');
    assert.match(page.url(), /tab-mine\.html/, 'legacy 4G tab must redirect to mine');
    await page.locator('.list-row', { hasText: '我的设备' }).click();
    await page.waitForLoadState('networkidle');
    assert.equal(await page.locator('#device-list .device-cell').count(), 2, 'mine devices must render the bound device list');
    assert.equal(await page.locator('.debug-link').count(), 1, 'only the online device must expose remote debugging');
    await open(page, baseUrl, 'pages/tab-tools.html');
    assert.equal(await page.locator('#tool-hero').count(), 1, 'tools must lead with the fluoro support query hero');
    assert.match(await page.locator('#tool-hero').textContent(), /氟机支持查询/);
    assert.equal(await page.locator('#tool-cards .tool-mini').count(), 4, 'frequent tools must render as cards');
    assert.equal(await page.locator('#tool-menu .list-row').count(), 2, 'services menu must lead with tech-service then feedback');
    assert.equal(await page.getByText('专业版切换').count(), 0, 'tools must remove the pro-version switch');
    await page.locator('#tool-menu .list-row', { hasText: '技术&服务' }).click();
    await page.waitForTimeout(400);
    assert.equal(await page.locator('.aa-chat.show').count(), 1, 'tech-service entry must open the AI assistant chat directly');
    assert.ok((await page.locator('.aa-row').count()) >= 2, 'ai chat must render preset messages after opening from tech-service');
    await page.locator('.aa-back').click();
    await page.waitForTimeout(300);
    assert.equal(await page.locator('.aa-chat.show').count(), 0, 'ai chat must close after tech-service check');
    await open(page, baseUrl, 'pages/tab-scene.html');
    assert.equal(await page.locator('.scene-card').count(), 8, 'scene tab must render the eight product solutions');
    assert.equal(await page.locator('.tab.active').textContent(), '场景', 'scene tab must mark itself active');
    await page.locator('.scene-card').first().click();
    await page.waitForLoadState('networkidle');
    assert.match(page.url(), /product-manual\.html\?series=a01&doc=1/, 'scene cards must open the solution reader');
    assert.ok((await page.locator('.manual-sec').count()) >= 3, 'solution reader must render the solution sections');
    await open(page, baseUrl, 'pages/tab-tools.html');
    assert.equal(await page.locator('.aa-ball').count(), 1, 'tools page must show the ai assistant ball');
    await page.locator('.aa-ball').click();
    await page.waitForTimeout(400);
    assert.equal(await page.locator('.aa-chat.show').count(), 1, 'ai chat layer must open');
    assert.ok((await page.locator('.aa-row').count()) >= 2, 'ai chat must render preset messages');
    await page.locator('.aa-input').fill('你好');
    await page.locator('.aa-send').click();
    await page.waitForTimeout(900);
    assert.ok((await page.locator('.aa-bubble-user').count()) === 1, 'user message must render');
    assert.ok((await page.locator('.aa-bubble-agent').count()) >= 2, 'auto reply must render');
    await page.locator('.aa-human').click();
    await page.waitForTimeout(200);
    await page.locator('.aa-back').click();
    await page.waitForTimeout(400);
    assert.equal(await page.locator('.aa-chat.show').count(), 0, 'ai chat layer must close');
    await open(page, baseUrl, 'pages/tool-wiring.html');
    assert.equal(await page.locator('.aa-ball').count(), 1, 'base-css tool page must show the ai assistant ball');
    assert.equal(await page.locator('.aa-chat.show').count(), 0, 'ai chat must stay hidden on page load');
    assert.equal(await page.locator('.aa-mask.show').count(), 0, 'ai mask must stay hidden on page load');
    await page.locator('.aa-ball').click();
    await page.waitForTimeout(400);
    assert.equal(await page.locator('.aa-chat.show').count(), 1, 'ai chat must open on base-css tool pages');
    await page.locator('.aa-back').click();
    await page.waitForTimeout(400);
    assert.equal(await page.locator('.aa-chat.show').count(), 0, 'ai chat must close on base-css tool pages');
    await open(page, baseUrl, 'pages/tab-tools.html');
    await page.locator('.tool-mini', { hasText: '远程协助' }).click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('.page-body').textContent(), /请求协助/);
    assert.match(await page.locator('.page-body').textContent(), /协助他人/);
    await page.locator('.ra-role', { hasText: '请求协助' }).click();
    await page.waitForLoadState('networkidle');
    await page.locator('#btn-open').click();
    assert.match(await page.locator('#ra-code').textContent(), /\d{3} \d{3}/, 'assisted page must show a six-digit assist code');
    await page.locator('#state-active').waitFor({ state: 'visible', timeout: 8000 });
    await page.locator('#btn-end').click();
    await page.locator('.overlay .js-ok').click();
    await page.waitForTimeout(300);
    assert.equal(await page.locator('#state-idle').evaluate((el) => !el.hidden), true, 'ending assist must return the assisted page to idle');

    await open(page, baseUrl, 'pages/tool-remote-assist.html');
    await page.locator('#btn-connect').click();
    assert.equal(await page.getByText('请输入 6 位数字协助码').count(), 1, 'assist page must validate the six-digit code');
    await page.locator('#code-input').fill('826431');
    await page.locator('#btn-connect').click();
    await page.locator('#state-desktop').waitFor({ state: 'visible', timeout: 6000 });
    await page.locator('.ra-mirror-task', { hasText: '服务器配置' }).click();
    assert.equal(await page.getByText('已远程点击：服务器配置').count(), 1, 'mirror taps must feed back the remote action');
    await page.locator('#btn-end').click();
    await page.locator('.overlay .js-ok').click();
    await page.waitForTimeout(300);
    assert.equal(await page.locator('#state-input').evaluate((el) => !el.hidden), true, 'ending assist must return the assist page to code input');

    await open(page, baseUrl, 'pages/tab-tools.html');
    await page.locator('.tab', { hasText: '我的' }).click();
    await page.waitForLoadState('networkidle');
    assert.match(await page.locator('#mine-name').textContent(), /张工/, 'mine must show the authorized account name');
    assert.match(await page.locator('#mine-phone').textContent(), /138\*{4}8203/, 'mine must show the authorized phone number');
    assert.match(await page.locator('#mine-version').textContent(), /2\.0\.0/, 'mine must pin the version at the bottom');
    assert.equal(await page.getByText('关于飞奕').count(), 0, 'mine must remove About Feiyi');
    await page.locator('#logout-btn').click();
    await page.locator('#logout-confirm').click();
    await page.waitForLoadState('networkidle');
    assert.match(page.url(), /demo\.html/, 'logout must return to the launch page');

    await open(page, baseUrl, 'pages/tab-tools.html');
    assert.match(await page.locator('.aa-ball').textContent(), /奕/, 'assistant ball must use the Yi glyph');
    const ballBox = await page.locator('.aa-ball').boundingBox();
    await page.mouse.move(ballBox.x + ballBox.width / 2, ballBox.y + ballBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(ballBox.x - 300, ballBox.y - 150, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    const dockedLeft = await page.locator('.aa-ball').evaluate((el) => el.getBoundingClientRect().left);
    assert(dockedLeft < 0, `ball must half-hide at the left edge after dragging (left=${dockedLeft})`);
    await page.locator('.aa-ball').click();
    assert(await page.locator('.aa-chat').evaluate((el) => el.classList.contains('show')), 'tapping a docked ball must open the chat');
    await page.locator('.aa-back').click();
    await open(page, baseUrl, 'pages/tab-tools.html');
    const resetLeft = await page.locator('.aa-ball').evaluate((el) => el.getBoundingClientRect().left);
    assert(resetLeft > 300, `ball must restore the default right-side position on re-entry (left=${resetLeft})`);

    await page.evaluate(() => sessionStorage.clear());
    await open(page, baseUrl, 'pages/tab-device-bt.html');
    await page.locator('[data-model="A01F"] .product-head').click();
    await page.locator('[data-expansion-model="A01F"] .connect-button').first().click();
    await page.waitForLoadState('networkidle');
    assert.match(page.url(), /device-quick\.html/, 'connecting must enter the quick config page');
    await open(page, baseUrl, 'pages/tab-tools.html');
    await page.locator('.tab', { hasText: '设备' }).click();
    await page.waitForLoadState('networkidle');
    assert.match(page.url(), /device-quick\.html/, 'device tab must keep the connected quick page instead of the search list');
    assert.match(await page.locator('#page-title').textContent(), /快速配置/);
    await page.locator('#menu-trigger').click();
    await page.locator('.menu-switch-btn').click();
    assert.equal(await page.locator('#connection-modal').getByText('确认断开').count(), 1, 'switching products must confirm the bluetooth disconnect');
    await page.locator('#connection-confirm').click();
    await page.waitForLoadState('networkidle');
    assert.match(page.url(), /tab-device-bt\.html/, 'confirmed disconnect must land on the search page');
    assert.equal(await page.locator('.product-card').count(), 10, 'search page must stay once disconnected');
    await open(page, baseUrl, 'pages/tab-device-bt.html');
    assert.equal(await page.locator('.product-card').count(), 10, 'device tab must show the search list after disconnect');

    await open(page, baseUrl, 'pages/product-intro.html?series=a01');
    await page.locator('[data-tab="docs"]').click();
    await page.locator('.doc-row').first().click();
    await page.waitForLoadState('networkidle');
    assert.match(page.url(), /product-manual\.html\?series=a01&doc=0/, 'doc rows must open the in-app manual reader');
    assert.ok((await page.locator('.manual-sec').count()) >= 3, 'manual reader must render the manual sections');
    assert.ok((await page.locator('.manual-toc button').count()) >= 3, 'manual reader must render the section toc');
    assert.match(await page.locator('.manual-hero h1').textContent(), /产品手册/);

    await page.setViewportSize({ width: 320, height: 700 });
    await open(page, baseUrl, 'pages/tab-device-bt.html');
    await assertNoHorizontalOverflow(page, '320px Bluetooth devices');
    await open(page, baseUrl, 'pages/device-fd01g-view.html?model=FD01G&device=FD01G-7319E2&mode=bt&view=control');
    await assertNoHorizontalOverflow(page, '320px FD01G control');
    assert(errors.length === 0, `browser console must stay clean:\n${errors.join('\n')}`);
    console.log('Browser smoke checks passed');
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
