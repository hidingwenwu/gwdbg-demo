const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'assets', 'screenshots', 'check');
fs.mkdirSync(out, { recursive: true });

function contentType(file) {
  return { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png' }[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
  const file = path.resolve(root, `.${p}`);
  if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': `${contentType(file)}; charset=utf-8` });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  page.setDefaultTimeout(20000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const q = '?model=E50&device=FE50G-A8C4&mode=bt';
  const shots = [
    ['e50-setup-fresh', `pages/device-e50.html${q}`],
    ['e50-setup-brand', `pages/device-e50.html${q}`, async () => { await page.getByRole('button', { name: '选择品牌', exact: true }).click(); await page.waitForTimeout(350); }],
    ['e50-setup-step3', `pages/device-e50.html${q}`, async () => { await page.getByRole('button', { name: '选择品牌', exact: true }).click(); await page.locator('#brand-picker [data-brand="模拟器"]').click(); await page.waitForTimeout(250); }],
    ['e50-setup-sim', `pages/device-e50.html${q}`, async () => { await page.getByRole('button', { name: '选择品牌', exact: true }).click(); await page.locator('#brand-picker [data-brand="格力"]').click(); await page.getByRole('button', { name: '模拟内机', exact: true }).click(); await page.waitForTimeout(350); }],
    ['e50-setup-search', `pages/device-e50.html${q}`, async () => { await page.getByRole('button', { name: '选择品牌', exact: true }).click(); await page.locator('#brand-picker [data-brand="格力"]').click(); await page.getByRole('button', { name: '搜索空调', exact: true }).click(); await page.waitForTimeout(2400); }],
    ['e50-setup-found', `pages/device-e50.html${q}`, async () => { await page.getByRole('button', { name: '选择品牌', exact: true }).click(); await page.locator('#brand-picker [data-brand="格力"]').click(); await page.getByRole('button', { name: '搜索空调', exact: true }).click(); await page.waitForTimeout(6000); await page.evaluate(() => window.scrollTo(0, 0)); }],
    ['e50-deviceinfo', `pages/device-e50.html${q}`, async () => { await page.getByRole('button', { name: '选择品牌', exact: true }).click(); await page.locator('#brand-picker [data-brand="格力"]').click(); await page.getByRole('button', { name: '搜索空调', exact: true }).click(); await page.waitForTimeout(6000); await page.locator('#device-info-link').click(); await page.waitForTimeout(250); }],
    ['e50-menu', `pages/device-e50.html${q}`, async () => { await page.locator('#menu-trigger').click(); await page.waitForTimeout(350); }],
    ['e50-capture', `pages/device-e50.html${q}`, async () => { await page.locator('#menu-trigger').click(); await page.waitForTimeout(300); await page.locator('.side-nav-item', { hasText: '检修抓码' }).click(); await page.waitForTimeout(350); }],
    ['e50-detail-outdoor', `pages/device-e50-detail.html${q}&type=outdoor&role=主`],
    ['e50-detail-indoor', `pages/device-e50-detail.html${q}&type=indoor&id=1`],
    ['e50-detail-multi', `pages/device-e50-detail.html${q}&type=indoor&ids=1,2,3`],
    ['e50-ac', `pages/device-e50-ac.html${q}`],
    ['e50-ac-control', `pages/device-e50-ac.html${q}`, async () => { await page.locator('.ac-unit-card').nth(0).click(); await page.locator('#go-control').click(); await page.waitForTimeout(400); }],
    ['e50-ai-snap', `pages/device-e50-ai.html${q}&type=outdoor&role=主`, async () => { await page.waitForTimeout(2200); }],
    ['e50-ai-diag', `pages/device-e50-ai.html${q}&type=outdoor&role=主`, async () => { await page.waitForTimeout(2200); await page.locator('#diagnose-btn').click(); await page.waitForTimeout(1000); }],
    ['e50-ai-report-card', `pages/device-e50-ai.html${q}&type=outdoor&role=主`, async () => { await page.waitForTimeout(2200); await page.locator('#diagnose-btn').click(); await page.locator('.ai-diag-card').waitFor({ timeout: 15000 }); }],
    ['e50-report', `pages/device-e50-report.html${q}`],
    ['e50-upgrade', `pages/device-e50-upgrade.html${q}`],
    ['e50-upgrade-progress', `pages/device-e50-upgrade.html${q}`, async () => { await page.locator('#start-upgrade').click(); await page.waitForTimeout(2600); }],
    ['e50-devices', `pages/device-e50-devices.html${q}`],
    ['e50-service', `pages/device-e50-service.html${q}`],
    ['e50-contact', `pages/device-e50-contact.html${q}`],
    ['e50-guide', `pages/device-e50-guide.html${q}`],
    ['tools-ai-ball', 'pages/tab-tools.html'],
    ['tools-ai-chat', 'pages/tab-tools.html', async () => { await page.locator('.aa-ball').click(); await page.waitForTimeout(400); }],
    ['tools-ai-dock-left', 'pages/tab-tools.html', async () => {
      const box = await page.locator('.aa-ball').boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x - 300, box.y - 180, { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(450);
    }],
    ['tools-ai-dock-right', 'pages/tab-tools.html', async () => {
      const box = await page.locator('.aa-ball').boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x - 60, box.y - 260, { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(450);
    }]
  ];
  for (const [name, route, act] of shots) {
    await page.evaluate(() => { try { sessionStorage.clear(); } catch (e) {} });
    await page.goto(`${base}/${route}`);
    await page.waitForLoadState('networkidle');
    if (act) await act();
    await page.screenshot({ path: path.join(out, `${name}.png`) });
    console.log('shot', name);
  }
  if (errors.length) { console.error('PAGE ERRORS:\n' + errors.join('\n')); process.exitCode = 1; }
  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exitCode = 1; server.close(); });
