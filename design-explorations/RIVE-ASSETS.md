# Rive Asset Inventory — Tunixlabsweb Kinetic Swiss v2

Consolidated source of truth for all .riv assets.
Written 2026-04-09. Supersedes `rive-preview/RIVE-INVENTORY.md` (Sprint 1 detail retained there).

## Current Assets (Sprint 1)

13 .riv files generated via RiveMCP during Sprint 1 (2026-04-09).
All live at `public/design-explorations/rive-preview/`.

```
-rw-rw-r--  319 abr  9 22:47 brand-dot.riv
-rw-rw-r-- 91433 abr  9 22:44 brand-mark.riv
-rw-rw-r--  650 abr  9 22:38 button-glow.riv
-rw-rw-r--  298 abr  9 22:38 inline-cursor.riv
-rw-rw-r-- 91568 abr  9 22:38 metric-reveal.riv
-rw-rw-r--  306 abr  9 19:13 pulse-test.riv
-rw-rw-r--  306 abr  9 22:38 scanline.riv
-rw-rw-r--  742 abr  9 23:15 traffic-big.riv
-rw-rw-r-- 3142 abr  9 23:01 traffic-lights-physics.riv
-rw-rw-r--  427 abr  9 19:42 traffic-lights.riv
-rw-rw-r--  829 abr  9 23:05 traffic-lights-spring.riv
-rw-rw-r--  443 abr  9 20:17 typing-cursor.riv
-rw-rw-r-- 1081 abr  9 22:38 voice-waveform.riv
```

### Tier 1 — Production-ready

These assets are confirmed working in the UMD runtime with preview HTML harnesses:

| File | Size | Description | Animations | Status |
|---|---|---|---|---|
| traffic-lights.riv | 427 B | 3-circle status indicator (120x32) | LivePulse (pingPong opacity 0.4-1.0) | WORKS — pixel-verified |
| traffic-lights-spring.riv | 829 B | Spring pop-in staggered entry (120x32) | SpringEntry (elastic interp) | WORKS — elastic confirmed |
| traffic-lights-physics.riv | 3.1 KB | Physics bounce + squash entry | bake_motion gravity+bounce | WORKS — preview HTML validated |
| traffic-big.riv | 742 B | Full-width terminal chrome traffic lights | Scaled variant for TerminalChrome | WORKS |
| inline-cursor.riv | 298 B | Minimal blinking cursor bar | Blink (loop opacity) | WORKS |
| typing-cursor.riv | 443 B | Cursor with scroll state machine | Blink + ScrollSlide, CursorSM | DEGRADED — blink works, scroll scrub not renderable |
| pulse-test.riv | 306 B | Scale pulse smoke test (200x200) | Pulse (pingPong scale 1.0-1.4) | WORKS — pipeline smoke test |
| voice-waveform.riv | 1.1 KB | 5-bar audio waveform animation | Staggered bar oscillation | WORKS — shapes only, no text |
| button-glow.riv | 650 B | Hover glow effect for buttons | Glow opacity transition | WORKS — shapes only |

### Tier 2 — Experimental / Preview-only

These assets are large (90KB+, likely contain embedded fonts) or unverified in browser runtime. Not yet integrated into React. Includes experimental prototypes like preloader-dot patterns.

| File | Size | Description | Status |
|---|---|---|---|
| brand-mark.riv | 91.4 KB | Brand mark kinetic reveal with text | EXPERIMENTAL — text rendering unverified in browser (RiveMCP text bug) |
| brand-dot.riv | 319 B | Animated brand dot / preloader-dot pattern | EXPERIMENTAL — not browser-tested, candidate for preloader-dot animation |
| metric-reveal.riv | 91.6 KB | Split-flap metric counter with text | EXPERIMENTAL — text rendering unverified in browser (RiveMCP text bug) |
| scanline.riv | 306 B | CRT scanline sweep effect | EXPERIMENTAL — not browser-tested |

## Sprint 1 Learnings (2026-04-09)

Critical findings that affect Sprint 3-5 Rive strategy:

1. **RiveMCP text rendering does NOT work in @rive-app/canvas UMD runtime.**
   Shapes (rect, ellipse, paths) render fine. Text runs (add_text +
   add_text_run) produce valid .riv but text is invisible in browser.
   Sprint 3 should test @rive-app/react-canvas (bundled ESM) for text.
   The two 91KB files (brand-mark, metric-reveal) likely contain embedded
   fonts — if text works in React, these become Tier 1 immediately.

2. **Elastic interpolation (interpolationType=3) WORKS for spring pop-in
   effects.** Traffic lights spring confirmed working with staggered delay.
   This is the foundation for Sprint 4 scroll-driven state machines.

3. **bake_motion WORKS for physics** (gravity + bounce + squash) but requires
   artboard large enough to contain the full motion arc. The
   traffic-lights-physics.riv (3.1 KB) demonstrates this successfully.

4. **Rive shines at COMPONENT SCALE** (full React components) not at
   micro-garnish scale (tiny canvases in existing HTML). Sprint 3 should
   port traffic-big.riv as a full-width TerminalChrome replacement.

5. **UMD must be used for standalone HTML previews.** React apps use native ESM
   via @rive-app/react-canvas. ESM CDN imports (jsdelivr/+esm, esm.sh) are
   broken for @rive-app/canvas — `Rive` is not exposed as a named export.

6. **blend1D requires 2+ animations** — single-animation scrub does not wire.
   For scroll-driven setups, drive animation time from host app directly.

7. **Chrome blocks multi-downloads per origin** after first download. Use
   composite canvas or different origins for batch PNG evidence capture.

8. **Iteration budget**: pulse-test took 3 iterations, traffic-lights took 5
   (full budget), typing-cursor took 2. Budget 5-10 iterations per asset
   for Sprint 3-5.

## Sprint 3-5 Rive-in-React Plan

### Sprint 3 — React Foundation

- Install `@rive-app/react-canvas` as project dependency
- Build `RiveWithFallback.tsx` wrapper component:
  - Loads .riv with `useRive` hook
  - On `onLoadError`, falls back to CSS-only equivalent
  - Respects `prefers-reduced-motion` (pauses or shows static frame)
- **Test text rendering** in React context (brand-mark.riv, metric-reveal.riv)
  - If text works: promote both from Tier 2 to Tier 1
  - If text fails: file RiveMCP issue, keep CSS text with Rive shapes only
- Port `traffic-big.riv` to `TerminalChrome.tsx` (FULL WIDTH header)
- Port `inline-cursor.riv` to `TerminalPrompt.tsx` (blinking cursor)
- Port `voice-waveform.riv` to `ContactScene.tsx` (audio visualization)

### Sprint 4 — Scroll-Driven State Machines

- Wire scroll position as Rive state machine number input
- Traffic lights state changes on scene transitions (idle/active/complete)
- Metric reveal triggered on scene entry (IntersectionObserver -> SM trigger)
- Button glow hover states wired to React onMouseEnter/onMouseLeave
- Explore preloader-dot animation pattern for page transitions

### Sprint 5 — Hero Moments

- Brand mark kinetic reveal (if text works in React after Sprint 3 test)
- Split-flap metrics (digit rotation animation, if text works)
- Full terminal chrome as single Rive component (ambitious — shapes + layout)
- Scene transition spring physics between scroll states
- scanline.riv CRT effect as overlay on terminal sections

## Preview Harnesses

4 standalone HTML files for browser testing (UMD pattern):

| File | Tests |
|---|---|
| preview-pulse.html | pulse-test.riv autoplay |
| preview-traffic-lights.html | traffic-lights.riv LivePulse autoplay |
| preview-traffic-lights-physics.html | traffic-lights-physics.riv bounce |
| preview-typing-cursor.html | typing-cursor.riv Blink + scroll slider |

Served via `python3 -m http.server 8787` from `design-explorations/rive-preview/`.
Public copies mirrored to `public/design-explorations/rive-preview/` for Next.js static serving.

## Rules

1. **EVERY Rive asset has a CSS fallback that is BUILT FIRST.**
   Rive only replaces CSS AFTER it has been generated, iterated, and judged superior.
2. If a Rive asset cannot reach "as good as CSS" in 10 iterations, KEEP the CSS version.
3. Each .riv file lives at `public/design-explorations/rive/{name}.riv`
   (Sprint 1 files are at `rive-preview/` — migrate to `rive/` in Sprint 3).
4. Preview harnesses are standalone HTML under `/design-explorations/rive-preview/`.
5. All Rive assets must work with `prefers-reduced-motion` (static fallback or paused state).
6. Text-dependent assets (brand-mark, metric-reveal) stay Tier 2 until React text rendering is confirmed.
7. Assets over 50 KB should be lazy-loaded (dynamic import or IntersectionObserver trigger).
