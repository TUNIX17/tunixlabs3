import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(dirname(__dirname), 'reports', 'latest');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('http://localhost:3000/es/inicio', { waitUntil: 'domcontentloaded', timeout: 15000 });
// Capture boot screen at 1.5s (before it fades at 2.2s)
await page.waitForTimeout(1500);
await page.screenshot({ path: join(OUT, 'boot-screen.png') });
console.log('OK boot screen');

// Wait for boot to finish, then capture hero
await page.waitForTimeout(3000);
await page.screenshot({ path: join(OUT, 'hero-post-boot.png') });
console.log('OK hero post boot');

// Scroll through cases
const scrollPositions = [
  { pct: 15, name: 'case-apoderapp' },
  { pct: 25, name: 'case-fernandez' },
  { pct: 40, name: 'case-schwager' },
  { pct: 55, name: 'case-sime' },
  { pct: 75, name: 'services' },
  { pct: 85, name: 'about' },
];
const h = await page.evaluate(() => document.body.scrollHeight);
for (const { pct, name } of scrollPositions) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.floor((pct / 100) * h));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  console.log(`OK ${name}`);
}

await ctx.close();
await browser.close();
console.log(`All screenshots → ${OUT}`);
