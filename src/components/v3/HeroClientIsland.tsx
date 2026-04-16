'use client';

// HeroClientIsland — Rive Production Monitor island (sprint-3).
// Sprint-2 left this returning null. Sprint-3 mounts HeroMonitor, which
// picks SvgMonitor (default) or RiveWithFallback (when NEXT_PUBLIC_RIVE_HERO=1)
// and never SSRs the Rive WASM bundle.

import HeroMonitor from '@/components/HeroMonitor';

export default function HeroClientIsland() {
  return <HeroMonitor />;
}
