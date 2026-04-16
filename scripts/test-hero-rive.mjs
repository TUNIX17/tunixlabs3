// Sprint-3 test-playwright — verifies HeroMonitor renders and LCP stays under
// budget on /es/v3. Builds with NEXT_PUBLIC_RIVE_HERO=1 so the Rive island
// mounts; falls back to SvgMonitor if Rive WASM fails (test still asserts a
// canvas OR svg renders). Runs against `next start` (production), not dev.
//
// Per project lesson (lesson_playwright_anduinos_setup): use
// executablePath=/usr/bin/google-chrome + video:off on AnduinOS.

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const REPORTS = join(ROOT, 'reports');
mkdirSync(REPORTS, { recursive: true });

const LCP_BUDGET_MS = 2500;
const CANVAS_MIN_WIDTH = 400;
const READINESS_TIMEOUT_S = 60;
const PORT = 3000;
const URL = `http://localhost:${PORT}/es/v3`;

const env = { ...process.env, NEXT_PUBLIC_RIVE_HERO: '1', NODE_ENV: 'production' };

function runCmd(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', cwd: ROOT, env, ...opts });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exit ${code}`))));
    child.on('error', reject);
  });
}

async function killPort() {
  await new Promise((resolve) => {
    const child = spawn('bash', ['-c', `fuser -k ${PORT}/tcp 2>/dev/null || true`], { stdio: 'ignore' });
    child.on('exit', () => resolve());
    child.on('error', () => resolve());
  });
}

async function waitForReady(url, timeoutS) {
  for (let i = 0; i < timeoutS; i++) {
    const ok = await new Promise((resolve) => {
      const c = spawn('bash', ['-c', `curl -sf ${url} >/dev/null`], { stdio: 'ignore' });
      c.on('exit', (code) => resolve(code === 0));
      c.on('error', () => resolve(false));
    });
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

let serverProc = null;
let exitCode = 0;

async function main() {
  console.log('[1/5] Killing any stale server on port', PORT);
  await killPort();

  console.log('[2/5] Building production bundle (NEXT_PUBLIC_RIVE_HERO=1)');
  await runCmd('npm', ['run', 'build']);

  console.log('[3/5] Starting next start in background');
  serverProc = spawn('npm', ['start'], {
    cwd: ROOT,
    env,
    stdio: ['ignore', 'inherit', 'inherit'],
    detached: false,
  });

  const ready = await waitForReady(`http://localhost:${PORT}`, READINESS_TIMEOUT_S);
  if (!ready) throw new Error(`Server did not become ready on :${PORT} within ${READINESS_TIMEOUT_S}s`);

  console.log('[4/5] Launching Chromium and visiting', URL);
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: undefined,
  });
  const page = await ctx.newPage();

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });

  // Hero monitor renders either <canvas> (Rive) or <svg role="img"> (fallback).
  // V3Client keeps animations running so 'networkidle' never fires; wait for
  // the hero element directly (10s allows Rive WASM ~1.5s + safety margin).
  await page.waitForSelector('section[data-section="hero-split"] canvas, section[data-section="hero-split"] svg[role="img"]', {
    timeout: 10_000,
  });

  const heroEl = await page.evaluate(() => {
    const sec = document.querySelector('section[data-section="hero-split"]');
    if (!sec) return null;
    const c = sec.querySelector('canvas');
    if (c) return { kind: 'canvas', width: c.getBoundingClientRect().width };
    const s = sec.querySelector('svg[role="img"]');
    if (s) return { kind: 'svg', width: s.getBoundingClientRect().width };
    return null;
  });

  if (!heroEl) throw new Error('Hero element not found in [data-section="hero-split"]');
  if (heroEl.width < CANVAS_MIN_WIDTH) {
    throw new Error(`Hero ${heroEl.kind} width ${heroEl.width} < ${CANVAS_MIN_WIDTH}px`);
  }
  console.log(`Hero rendered: ${heroEl.kind} (${heroEl.width.toFixed(0)}px wide)`);

  // Capture LCP — observer pattern is most reliable across runs.
  const lcp = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let last = 0;
        const obs = new PerformanceObserver((list) => {
          for (const e of list.getEntries()) last = e.startTime;
        });
        obs.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => {
          obs.disconnect();
          resolve(last);
        }, 1500);
      }),
  );

  console.log(`LCP: ${lcp.toFixed(0)}ms (budget ${LCP_BUDGET_MS}ms)`);

  const screenshotPath = join(REPORTS, 'hero-rive.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('[5/5] Screenshot saved:', screenshotPath);

  const result = {
    url: URL,
    hero: heroEl,
    lcpMs: lcp,
    budgetMs: LCP_BUDGET_MS,
    pass: lcp <= LCP_BUDGET_MS && heroEl.width >= CANVAS_MIN_WIDTH,
    flag: 'NEXT_PUBLIC_RIVE_HERO=1',
    timestamp: new Date().toISOString(),
  };
  writeFileSync(join(REPORTS, 'hero-rive.json'), JSON.stringify(result, null, 2));

  await browser.close();

  if (lcp > LCP_BUDGET_MS) {
    console.error(`FAIL: LCP ${lcp.toFixed(0)}ms exceeds ${LCP_BUDGET_MS}ms`);
    exitCode = 1;
  } else {
    console.log('PASS: hero renders and LCP within budget');
  }
}

main()
  .catch((err) => {
    console.error('TEST_ERROR:', err.message);
    exitCode = 1;
  })
  .finally(async () => {
    if (serverProc && !serverProc.killed) {
      try { serverProc.kill('SIGTERM'); } catch {}
    }
    await killPort();
    process.exit(exitCode);
  });
