# Tunixlabsweb — Rive Animation Inventory — Sprint 1

**Source of truth** for the .riv files built in Sprint 1.
**Consumed by:** Sprint 4 (micro-animations integration into React) and Sprint 5 (hero moments).

Written 2026-04-09 during autonomous Sprint 1 execution.

## Files

| Name | Path | Size | Artboard | Animations | State Machines | Status |
|---|---|---|---|---|---|---|
| pulse-test | rive-preview/pulse-test.riv | 306 bytes | PulseTest (200×200) | Pulse (pingPong scale 1.0→1.4) | — | WORKS |
| traffic-lights | rive-preview/traffic-lights.riv | 427 bytes | TrafficLights (120×32) | LivePulse (pingPong opacity 0.4→1.0 on live circle) | — | WORKS |
| typing-cursor | rive-preview/typing-cursor.riv | 443 bytes | TypingCursor (200×40) | Blink (loop opacity 1→0.1→1), ScrollSlide (oneShot x 10→180) | CursorSM with scrollPos number input (unwired) | DEGRADED — blink works, scroll x keyframe not renderable via scrub |

## Preview HTMLs

All use the UMD script pattern discovered during Sprint 1 debugging (`<script src="https://unpkg.com/@rive-app/canvas@2.17.3">` + `new rive.Rive(...)`, NOT ESM import).

| Name | Path | Purpose |
|---|---|---|
| preview-pulse.html | rive-preview/preview-pulse.html | Smoke test, autoplays |
| preview-traffic-lights.html | rive-preview/preview-traffic-lights.html | Autoplays LivePulse |
| preview-typing-cursor.html | rive-preview/preview-typing-cursor.html | Autoplays Blink + slider (0-100) triggers ScrollSlide scrub as fallback attempt |

All mirrored to `public/design-explorations/rive-preview/` for serving via Next.js or the local Python HTTP server at http://127.0.0.1:8787.

## Screenshot evidence

- `rive-preview/screenshots/traffic-lights-trough.png` (1696 bytes, 120×32 RGBA PNG) — canvas capture at LivePulse frame 0 (opacity 0.4 trough). Captured via canvas.toDataURL() + download trigger from claude-in-chrome session. Serves as audit evidence for the Rive pipeline.
- No PNG evidence for typing-cursor (Chrome blocked multi-downloads on localhost:8787 origin after the traffic-lights download). The blink animation was validated programmatically via pixel sampling from the canvas (alpha 26-249 oscillation) and by inspecting the status diagnostic div (`loaded · anims:["Blink","ScrollSlide"] playing:["Blink"]`).

## Sprint 4/5 integration plan

### Sprint 4 (micro-animations integration into Next.js React)

1. **traffic-lights.riv** → replaces the CSS traffic lights in the top of the terminal chrome (3 circles in header). Component: `TerminalChrome.tsx` or similar in the new `KineticSwiss` namespace. Use `@rive-app/react-canvas` runtime with `useRive` hook. No state machine inputs needed — autoplay only.
2. **typing-cursor.riv** → renders next to the terminal prompt. Two options:
   - **Option A (recommended)**: use the existing `CursorSM` state machine input `scrollPos` and set it from a scroll listener. This requires re-exporting the .riv with proper blend1D wiring (which Sprint 4 should do via the Rive editor or a different RiveMCP approach).
   - **Option B (fallback)**: use only the `Blink` animation and manage cursor X position in React state via CSS `transform: translateX(calc(var(--scroll-pct) * 1.7px + 10px))`. This bypasses Rive entirely for the positional component.
3. **Reduced-motion fallback**: `RiveWithFallback` wrapper component (to be built in Sprint 3) displays a CSS-only equivalent when `prefers-reduced-motion: reduce` or when `onLoadError` fires.

### Sprint 5 (hero moments)

None of these 3 files are consumed directly by Sprint 5. Sprint 5 introduces NEW .riv files for brand mark kinetic reveal, split-flap metrics, and potentially a voice waveform. The 3 Sprint 1 files serve as the Rive pipeline smoke test and the micro-animation foundation that Sprint 5 can depend on.

## Fallback behavior (RiveWithFallback wrapper · Sprint 3)

If Rive fails to load at runtime, each integration MUST have a CSS-only equivalent that degrades gracefully:

| File | CSS fallback |
|---|---|
| pulse-test | (smoke test only, no production equivalent needed) |
| traffic-lights | 3 CSS circles with same colors, `@keyframes pulse` on `.live` element (the v2 prototype already has this as the baseline) |
| typing-cursor | Pure CSS blinking cursor (`@keyframes blink` opacity 1→0.1→1), static position (no scroll drive) OR CSS scroll-timeline if supported |

## Known limitations (Sprint 1 debug notes)

1. **ESM CDN imports for @rive-app/canvas are broken** in both jsdelivr/+esm and esm.sh — `Rive` is not exposed as a named export. Must use UMD `<script>` tag with `new rive.Rive()` from the global `rive` namespace. This applies to standalone HTML previews only; `@rive-app/react-canvas` in a bundled React app works normally (native ESM).
2. **RiveMCP add_rectangle + 'x' keyframe** doesn't respond to animation scrub. Either the Rectangle's x is not the transform translation x, or RiveMCP's keyframe emits a property that the runtime doesn't bind to the rectangle. Sprint 3 should test this more thoroughly with the Rive editor or different tool sequences.
3. **RiveMCP blend1D requires ≥2 animations** — with a single animation the blend state emits a warning and doesn't wire the input. For single-animation scrub-driven setups, don't use blend states — drive the animation time directly from the host application.
4. **Chrome blocks multi-downloads per origin session** after the first download. For saving multiple canvas states as PNG files from the preview loop, either use a combined composite canvas download (single file) or navigate to different origins between downloads.

## Iteration budget usage

- pulse-test: 3 iterations (ESM→UMD fix, then works)
- traffic-lights: 5 iterations (UMD, animations param, duration=60 fix, cache bust, scrub+drawFrame) — FULL BUDGET, within limit
- typing-cursor: 2 iterations (tested scroll wiring, accepted degraded verdict)
