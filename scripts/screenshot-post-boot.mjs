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

await page.goto('http://localhost:3000/es/v3', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(4000);
await page.screenshot({ path: join(OUT, 'postboot-hero.png') });
console.log('OK hero (post-boot)');

const h = await page.evaluate(() => document.body.scrollHeight);
for (const [pct, name] of [[15,'case-schwager'],[30,'case-sime'],[55,'case-soma'],[70,'services'],[85,'about'],[95,'contact']]) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.floor((pct / 100) * (h - 900)));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(OUT, `postboot-${name}.png`) });
  console.log(`OK ${name}`);
}

await browser.close();
