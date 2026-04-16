import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const OUT = join(ROOT, 'reports', 'v3-scroll');
mkdirSync(OUT, { recursive: true });

const prefix = process.argv[2] || 'pages';
const PAGES = [
  ['/es/v3', `${prefix}-v3-top.png`],
  ['/es/inicio', `${prefix}-inicio.png`],
  ['/es/servicios', `${prefix}-servicios.png`],
  ['/es/contacto', `${prefix}-contacto.png`],
  ['/es/sobre', `${prefix}-sobre.png`],
  ['/es/casos/sime', `${prefix}-caso-sime.png`],
  ['/es/servicios/asistentes-ia', `${prefix}-srv-asistentes.png`],
];

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const [url, file] of PAGES) {
  const page = await ctx.newPage();
  try {
    await page.goto('http://localhost:3000' + url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: join(OUT, file) });
    console.log('OK', file);
  } catch (e) {
    console.log('FAIL', url, e.message.slice(0, 80));
  }
  await page.close();
}

await browser.close();
