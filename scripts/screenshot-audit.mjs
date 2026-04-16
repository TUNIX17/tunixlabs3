import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const OUT = join(ROOT, 'reports', 'v3-audit');
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['/es/inicio', '01-inicio.png'],
  ['/es/v3', '02-v3.png'],
  ['/es/servicios', '03-servicios.png'],
  ['/es/contacto', '04-contacto.png'],
  ['/es/sobre', '05-sobre.png'],
  ['/es/casos/sime', '06-caso-sime.png'],
  ['/es/servicios/asistentes-ia', '07-servicio-asistentes.png'],
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
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(OUT, file), fullPage: true });
    console.log('OK', file);
  } catch (e) {
    console.log('FAIL', url, e.message.slice(0, 80));
  }
  await page.close();
}

await browser.close();
console.log('Screenshots saved to reports/v3-audit/');
