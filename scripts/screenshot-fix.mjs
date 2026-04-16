import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const OUT = join(ROOT, 'reports', 'v3-scroll');
mkdirSync(OUT, { recursive: true });

const prefix = process.argv[2] || 'fix';

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('http://localhost:3000/es/v3', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: join(OUT, `${prefix}-v3-top.png`) });
console.log('OK v3-top');

const h = await page.evaluate(() => document.body.scrollHeight);
for (const pct of [25, 55, 85]) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.floor((pct / 100) * (h - 900)));
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(OUT, `${prefix}-v3-${pct}pct.png`) });
  console.log(`OK v3-${pct}pct`);
}

await page.goto('http://localhost:3000/es/inicio', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: join(OUT, `${prefix}-inicio.png`) });
console.log('OK inicio');

await page.goto('http://localhost:3000/es/servicios', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: join(OUT, `${prefix}-servicios.png`) });
console.log('OK servicios');

await browser.close();
console.log('Done.');
