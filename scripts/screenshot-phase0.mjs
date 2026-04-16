import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const OUT = join(ROOT, 'reports', 'phase0');
mkdirSync(OUT, { recursive: true });

const pages = [
  { url: '/es/inicio', name: 'inicio', wait: 5000 },
  { url: '/es/casos', name: 'casos', wait: 2000 },
  { url: '/es/servicios', name: 'servicios', wait: 2000 },
  { url: '/es/contacto', name: 'contacto', wait: 2000 },
  { url: '/es/sobre', name: 'sobre', wait: 2000 },
];

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

// Desktop 1440
const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pageD = await ctxD.newPage();
for (const { url, name, wait } of pages) {
  await pageD.goto(`http://localhost:3000${url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await pageD.waitForTimeout(wait);
  await pageD.screenshot({ path: join(OUT, `${name}-1440w.png`), fullPage: true });
  console.log(`OK ${name} @1440`);
}
await ctxD.close();

// Mobile 375 (check hamburger)
const ctxM = await browser.newContext({ viewport: { width: 375, height: 812 } });
const pageM = await ctxM.newPage();
for (const { url, name, wait } of pages) {
  await pageM.goto(`http://localhost:3000${url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await pageM.waitForTimeout(wait);
  await pageM.screenshot({ path: join(OUT, `${name}-375w.png`), fullPage: true });
  console.log(`OK ${name} @375`);
}
await ctxM.close();

await browser.close();
console.log(`\nPhase 0 screenshots saved to ${OUT}`);
