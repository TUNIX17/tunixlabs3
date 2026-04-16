// Sprint-4 test-cta — smoke-tests the OpenShellCta sticky CTA:
//   1. Builds a production bundle with NEXT_PUBLIC_CTA_AUDIO=1 so the Rive
//      version mounts (we still can't actually PLAY audio in headless
//      Chromium without user gesture APIs, but the visual branch is what we
//      need to verify here).
//   2. Loads /es/v3, scrolls past 200px, waits for the CTA to appear.
//   3. Clicks it and asserts no exception reaches the page.
//   4. Writes a screenshot + a JSON verdict to reports/.
//
// Follows the AnduinOS lesson baked into sprint-3's test-hero-rive.mjs:
// executablePath=/usr/bin/google-chrome, video:off, domcontentloaded +
// explicit waitForSelector (networkidle never fires on animated pages).
//
// Teardown is wrapped in try/finally so the spawned `npm start` gets killed
// even when the assertions throw (otherwise port 3000 stays bound and the
// next run fails at build time).

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const REPORTS = join(ROOT, 'reports');
mkdirSync(REPORTS, { recursive: true });

const READINESS_TIMEOUT_S = 60;
const CLICK_TIMEOUT_MS = 10000;
const PORT = 3000;
const URL = `http://localhost:${PORT}/es/v3`;

// NEXT_PUBLIC_CTA_AUDIO=1 mounts the Rive pill; but we don't need real audio
// playback — the test asserts the click path does not throw, which covers
// both branches (Rive-loaded and Rive-errored → fallback anchor).
const env = {
  ...process.env,
  NEXT_PUBLIC_RIVE_HERO: '1',
  NEXT_PUBLIC_CTA_AUDIO: '1',
  NODE_ENV: 'production',
};

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
  console.log('[1/6] Killing any stale server on port', PORT);
  await killPort();

  console.log('[2/6] Building production bundle (NEXT_PUBLIC_CTA_AUDIO=1)');
  await runCmd('npm', ['run', 'build']);

  console.log('[3/6] Starting next start in background');
  serverProc = spawn('npm', ['start'], {
    cwd: ROOT,
    env,
    stdio: ['ignore', 'inherit', 'inherit'],
    detached: false,
  });

  const ready = await waitForReady(`http://localhost:${PORT}`, READINESS_TIMEOUT_S);
  if (!ready) throw new Error(`Server did not become ready on :${PORT} within ${READINESS_TIMEOUT_S}s`);

  console.log('[4/6] Launching Chromium and visiting', URL);
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: undefined,
  });
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

  console.log('[5/6] Scrolling past reveal threshold and asserting CTA mounts');
  await page.evaluate(() => window.scrollTo(0, 500));
  // Give the scroll listener a tick + the dynamic import a moment.
  await page.waitForTimeout(500);

  await page.waitForSelector('[data-testid="open-shell-cta"]', { timeout: CLICK_TIMEOUT_MS, state: 'visible' });

  const ctaInfo = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="open-shell-cta"]');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      ariaLabel: el.getAttribute('aria-label'),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  });

  await page.click('[data-testid="open-shell-cta"]');
  // Let any smooth-scroll or async handlers flush.
  await page.waitForTimeout(600);

  const screenshotPath = join(REPORTS, 'cta-flow.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });

  const verdict = {
    url: URL,
    cta: ctaInfo,
    clicked: true,
    pageErrors,
    pass: !!ctaInfo && pageErrors.length === 0,
    flag: 'NEXT_PUBLIC_CTA_AUDIO=1',
    screenshot: screenshotPath,
    timestamp: new Date().toISOString(),
  };
  writeFileSync(join(REPORTS, 'cta-flow.json'), JSON.stringify(verdict, null, 2));

  console.log('[6/6] Verdict', verdict);

  await context.close();
  await browser.close();

  if (!verdict.pass) throw new Error('CTA flow verdict=false');
}

main()
  .catch((err) => {
    console.error('test-cta failed:', err);
    exitCode = 1;
  })
  .finally(async () => {
    if (serverProc && !serverProc.killed) {
      try {
        serverProc.kill('SIGTERM');
      } catch {
        /* noop */
      }
    }
    await killPort();
    process.exit(exitCode);
  });
