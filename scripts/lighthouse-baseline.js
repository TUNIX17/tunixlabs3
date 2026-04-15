/**
 * lighthouse-baseline.js
 *
 * Baseline performance harness for tunixlabsweb — fallback when
 * lighthouse CLI is not available. Uses Playwright + Performance API +
 * PerformanceObserver to capture:
 *   - TTFB (nav.responseStart - nav.requestStart)
 *   - FCP  (first-contentful-paint entry)
 *   - LCP  (largest-contentful-paint via PerformanceObserver)
 *   - CLS  (layout-shift via PerformanceObserver)
 *
 * Runs each target URL in two profiles: desktop (1440x900) and
 * mobile (390x844, iPhone 14 viewport). Writes JSON per profile to
 * reports/lighthouse-baseline-<profile>.json for Sprint 1 comparison.
 *
 * AnduinOS rules: executablePath=/usr/bin/google-chrome, no video capture.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TARGETS = ['/es/inicio', '/es/v3'];

const PROFILES = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false },
  { name: 'mobile',  viewport: { width: 390,  height: 844 }, deviceScaleFactor: 3, isMobile: true  },
];

async function measurePage(context, url) {
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__metrics = { lcp: 0, cls: 0, shifts: [] };
    try {
      const lcpObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__metrics.lcp = entry.renderTime || entry.loadTime || entry.startTime || 0;
        }
      });
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}
    try {
      const clsObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__metrics.cls += entry.value;
            window.__metrics.shifts.push({ value: entry.value, time: entry.startTime });
          }
        }
      });
      clsObs.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}
  });

  const started = Date.now();
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  // Let LCP observer settle (most pages emit final LCP after first paint)
  await page.waitForTimeout(1500);

  const nav = await page.evaluate(() => {
    const [n] = performance.getEntriesByType('navigation');
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return {
      ttfbMs: n ? (n.responseStart - n.requestStart) : null,
      domContentLoadedMs: n ? n.domContentLoadedEventEnd : null,
      loadEventMs: n ? n.loadEventEnd : null,
      fcpMs: fcp ? fcp.startTime : null,
      lcpMs: window.__metrics && window.__metrics.lcp ? window.__metrics.lcp : null,
      cls:   window.__metrics ? window.__metrics.cls : null,
      shiftCount: window.__metrics ? window.__metrics.shifts.length : 0,
    };
  });

  const walltimeMs = Date.now() - started;
  await page.close();

  return {
    url,
    httpStatus: response ? response.status() : null,
    walltimeMs,
    ...nav,
  };
}

async function runProfile(profile) {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: profile.deviceScaleFactor,
    isMobile: profile.isMobile,
    // video: off (AnduinOS rule) — omit recordVideo entirely
  });

  const runs = [];
  for (const t of TARGETS) {
    const url = `${BASE_URL}${t}`;
    try {
      const r = await measurePage(context, url);
      runs.push(r);
    } catch (err) {
      runs.push({ url, error: String(err && err.message || err) });
    }
  }

  await context.close();
  await browser.close();
  return runs;
}

async function main() {
  const started = new Date().toISOString();
  const results = {};
  for (const profile of PROFILES) {
    results[profile.name] = await runProfile(profile);
  }

  const reportsDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  for (const profile of PROFILES) {
    const out = {
      generatedAt: new Date().toISOString(),
      startedAt: started,
      harness: 'playwright-fallback@1',
      profile: profile.name,
      viewport: profile.viewport,
      deviceScaleFactor: profile.deviceScaleFactor,
      isMobile: profile.isMobile,
      baseUrl: BASE_URL,
      runs: results[profile.name],
    };
    const file = path.join(reportsDir, `lighthouse-baseline-${profile.name}.json`);
    fs.writeFileSync(file, JSON.stringify(out, null, 2));
    console.log(`wrote ${file}`);
  }
}

main().catch((err) => {
  console.error('FATAL', err);
  process.exit(1);
});
