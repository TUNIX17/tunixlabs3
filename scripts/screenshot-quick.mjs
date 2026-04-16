import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const OUT = join(ROOT, 'reports', 'latest');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Nav + hero (viewport only, not fullPage)
await page.goto('http://localhost:3000/es/inicio', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(5000);
await page.screenshot({ path: join(OUT, 'hero-viewport.png') });
console.log('OK hero viewport');

// Scroll to a case section
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.5));
await page.waitForTimeout(1500);
await page.screenshot({ path: join(OUT, 'case-viewport.png') });
console.log('OK case viewport');

// Casos page
await page.goto('http://localhost:3000/es/casos', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: join(OUT, 'casos-viewport.png') });
console.log('OK casos');

// Mobile
await ctx.close();
const ctxM = await browser.newContext({ viewport: { width: 375, height: 812 } });
const pageM = await ctxM.newPage();
await pageM.goto('http://localhost:3000/es/servicios', { waitUntil: 'domcontentloaded', timeout: 15000 });
await pageM.waitForTimeout(2000);
await pageM.screenshot({ path: join(OUT, 'servicios-mobile.png') });
console.log('OK servicios mobile');

await ctxM.close();
await browser.close();
console.log(`Screenshots → ${OUT}`);
