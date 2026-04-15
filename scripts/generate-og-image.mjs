import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const html = `<!doctype html><html><head><meta charset="utf-8"/><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; background: #f5f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0a0a0a; overflow: hidden; }
  .canvas { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 80px 96px; }
  .accent { position: absolute; top: 72px; left: 96px; background: #ccff00; color: #0a0a0a; padding: 10px 20px; font-size: 20px; letter-spacing: 0.08em; font-weight: 600; text-transform: uppercase; }
  h1 { font-size: 118px; font-weight: 800; letter-spacing: -0.04em; line-height: 0.92; margin-bottom: 28px; }
  p.tag { font-size: 36px; font-weight: 400; color: #3a3a3a; letter-spacing: -0.01em; }
  .meta { position: absolute; bottom: 72px; left: 96px; font-size: 22px; color: #6a6a6a; letter-spacing: 0.02em; }
  .dot { display: inline-block; width: 12px; height: 12px; background: #ccff00; border-radius: 50%; margin: 0 14px 2px; vertical-align: middle; }
</style></head>
<body><div class="canvas">
  <span class="accent">AI-native agency</span>
  <h1>Tunix Labs<span class="dot"></span></h1>
  <p class="tag">Voice AI, SaaS B2B y BI industrial para LATAM</p>
  <div class="meta">tunixlabs.com · Santiago · Nearshore</div>
</div></body></html>`;

const outDir = '/home/tunix/Escritorio/Tunixlabsweb/public/og';
const outPath = path.join(outDir, 'tunixlabs-og.png');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, recordVideo: undefined });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: outPath, type: 'png', fullPage: false });
await browser.close();
const stat = await fs.stat(outPath);
console.log('OG_GENERATED:', outPath, stat.size, 'bytes');
