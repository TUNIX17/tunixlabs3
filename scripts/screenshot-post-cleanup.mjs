import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const OUT = join(ROOT, 'reports', 'post-cleanup');
mkdirSync(OUT, { recursive: true });

const pages = [
  { url: '/es/inicio', name: 'inicio', wait: 5000 },
  { url: '/es/servicios', name: 'servicios', wait: 2000 },
  { url: '/es/servicios/asistentes-ia', name: 'servicio-asistentes', wait: 2000 },
  { url: '/es/contacto', name: 'contacto', wait: 2000 },
  { url: '/es/sobre', name: 'sobre', wait: 2000 },
  { url: '/es/casos/apoderapp', name: 'caso-apoderapp', wait: 2000 },
];

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const { url, name, wait } of pages) {
  try {
    await page.goto(`http://localhost:3000${url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(wait);
    await page.screenshot({ path: join(OUT, `${name}-1440w.png`), fullPage: true });
    console.log(`OK ${name}`);
  } catch (e) {
    console.error(`FAIL ${name}: ${e.message}`);
  }
}

await ctx.close();
await browser.close();
console.log(`\nPost-cleanup screenshots saved to ${OUT}`);
