/**
 * Next.js instrumentation hook. Runs once at server startup.
 *
 * We use it to kick off the Chatwoot polling loop as a failsafe against the
 * occasional hosted Chatwoot webhook not dispatching. The loop is a
 * same-process setInterval (not a cron job) so it only lives as long as
 * this Next.js process — Railway keeps `next start` alive persistently.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { startChatwootPolling } = await import('./lib/chatwoot/poller');
  startChatwootPolling();
}
