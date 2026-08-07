const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'assets', 'screenshots', 'remote-assist-check');
fs.mkdirSync(outDir, { recursive: true });

function contentType(file) {
  return { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' }[path.extname(file).toLowerCase()] || 'application/octet-stream';
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

(async () => {
  const server = await startServer();
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const shot = (name) => page.screenshot({ path: path.join(outDir, name + '.png') });

  await page.goto(`${baseUrl}/pages/tab-tools.html`, { waitUntil: 'networkidle' });
  await shot('01-tools-grid');

  await page.goto(`${baseUrl}/pages/tool-remote.html`, { waitUntil: 'networkidle' });
  await shot('02-remote-home');

  await page.goto(`${baseUrl}/pages/tool-remote-assisted.html`, { waitUntil: 'networkidle' });
  await shot('03-assisted-idle');
  await page.locator('#btn-open').click();
  await page.waitForTimeout(400);
  await shot('04-assisted-waiting');
  await page.locator('#state-active').waitFor({ state: 'visible', timeout: 8000 });
  await page.waitForTimeout(2600);
  await shot('05-assisted-active');
  await page.locator('#btn-end').click();
  await page.waitForTimeout(300);
  await shot('06-assisted-end-dialog');

  await page.goto(`${baseUrl}/pages/tool-remote-assist.html`, { waitUntil: 'networkidle' });
  await shot('07-assist-input');
  await page.locator('#code-input').fill('826431');
  await page.locator('#btn-connect').click();
  await page.locator('#state-desktop').waitFor({ state: 'visible', timeout: 6000 });
  await page.waitForTimeout(2600);
  await shot('08-assist-desktop');

  await page.goto(`${baseUrl}/pages/device-quick.html?model=A01F&device=A01F-3F903E&mode=bt`, { waitUntil: 'networkidle' });
  await shot('09-hero-card');
  await page.locator('#menu-trigger').click();
  await page.waitForTimeout(500);
  await shot('10-sidebar');

    await page.goto(`${baseUrl}/pages/tab-device-bt.html`, { waitUntil: 'networkidle' });
  await shot('15-device-home');
  await page.evaluate(() => { const el = document.querySelector('.app-content'); el.scrollTop = el.scrollHeight; });
  await shot('15b-device-promo');

  await page.goto(`${baseUrl}/pages/tool-guide.html`, { waitUntil: 'networkidle' });
  await shot('16-tool-guide');

  await page.goto(`${baseUrl}/pages/platform-videos.html?cat=jk`, { waitUntil: 'networkidle' });
  await shot('20-platform-videos-jk');

  await page.goto(`${baseUrl}/pages/platform-videos.html?cat=jf`, { waitUntil: 'networkidle' });
  await shot('21-platform-videos-jf');

  await page.goto(`${baseUrl}/pages/tool-faq.html`, { waitUntil: 'networkidle' });
  await page.locator('.faq-q').nth(0).click();
  await page.locator('.faq-q').nth(2).click();
  await shot('22-tool-faq');

  await page.goto(`${baseUrl}/pages/tool-errcode.html`, { waitUntil: 'networkidle' });
  await shot('23-tool-errcode');
  await page.locator('.brand-chips .chip').first().click();
  await page.locator('#ec-input').fill('U4');
  await page.locator('#ec-input').press('Enter');
  await page.waitForTimeout(300);
  await shot('24-tool-errcode-result');

  await page.goto(`${baseUrl}/pages/tool-wiring.html`, { waitUntil: 'networkidle' });
  await shot('25-tool-wiring');

  await page.goto(`${baseUrl}/pages/product-intro.html?series=a01`, { waitUntil: 'networkidle' });
  await shot('17-series-hub');
  await page.locator('[data-tab="docs"]').click();
  await shot('18-series-docs');

  await page.goto(`${baseUrl}/pages/device-a01-ac.html?model=A01F&device=A01F-3F903E&mode=bt`, { waitUntil: 'networkidle' });
  await page.locator('.unit-check input').nth(0).check();
  await page.locator('.unit-check input').nth(1).check();
  await shot('14-ac-page');

  await page.goto(`${baseUrl}/pages/tab-mine.html`, { waitUntil: 'networkidle' });
  await shot('13-mine');

  await page.goto(`${baseUrl}/pages/mine-devices.html`, { waitUntil: 'networkidle' });
  await shot('19-mine-devices');

  await page.goto(`${baseUrl}/pages/device-setting.html?model=A01F&device=A01F-3F903E&mode=bt&setting=server`, { waitUntil: 'networkidle' });
  await shot('12-setting-header');

  await page.goto(`${baseUrl}/pages/device-e50.html?model=E50&device=FE50G-A8C4&mode=bt`, { waitUntil: 'networkidle' });
  await page.locator('#menu-trigger').click();
  await page.waitForTimeout(500);
  await shot('11-sidebar-e50');

  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  console.log('screenshots saved to', outDir);
})().catch((error) => { console.error(error); process.exitCode = 1; });
