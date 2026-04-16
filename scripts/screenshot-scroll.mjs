import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const OUT = join(ROOT, 'reports', 'v3-scroll');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('http://localhost:3000/es/v3', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForTimeout(3000);

const totalHeight = await page.evaluate(() => document.body.scrollHeight);
console.log('Total scroll height:', totalHeight);

const positions = [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1.0];

for (let i = 0; i < positions.length; i++) {
  const scrollY = Math.floor(positions[i] * (totalHeight - 900));
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(800);
  const file = `v3-scroll-${String(i).padStart(2, '0')}-${Math.round(positions[i] * 100)}pct.png`;
  await page.screenshot({ path: join(OUT, file), fullPage: false });
  console.log(`OK ${file} (scrollY=${scrollY})`);
}

// Also screenshot /inicio at two positions
await page.goto('http://localhost:3000/es/inicio', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: join(OUT, 'inicio-top.png'), fullPage: false });
console.log('OK inicio-top.png');

const inicioHeight = await page.evaluate(() => document.body.scrollHeight);
await page.evaluate((y) => window.scrollTo(0, y), Math.floor(inicioHeight * 0.3));
await page.waitForTimeout(800);
await page.screenshot({ path: join(OUT, 'inicio-30pct.png'), fullPage: false });
console.log('OK inicio-30pct.png');

await browser.close();
console.log('Done. Screenshots in reports/v3-scroll/');
