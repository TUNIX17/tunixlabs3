# Client Logos

## Status

This directory holds the logos rendered in the "TrustedBy" social-proof row on
the home page. The current set is three direct commissioning partners:

- `stltda.png` — ST Ltda., the technical partner that built SIME
- `schwager.jpeg` — Schwager Energy
- `mindco.png` — Mindco (engages TunixLabs for SOMA)

These are the real assets provided by the founder. They are not placeholders.
Do not swap them for generic text-only SVGs without coordinating first.

**Attribution rule (critical):** only DIRECT commissioning partners live here.
End clients whose relationship is structural — through a contractor — must
NOT be added as logos to this folder or to `TrustedBy.tsx`, regardless of how
well-known they are. The indirect framing for those relationships lives in
`HomePage.caseStudies.cards.*` in the i18n messages, not on the logo row.

## Before adding a new logo

**Get written permission to use every real logo.** This is important for two
reasons:

1. **Brand guidelines.** Most companies publish a brand manual that specifies
   allowed color variants, minimum size, clear space, and forbidden uses
   (distorted, recolored, on busy backgrounds, etc.). Respect it.
2. **NDAs and engagement agreements.** Some engagements are under NDA and the
   client's name cannot be published externally without approval. Ask the
   sponsor on each account before the logo goes live.

If a client declines or withdraws permission, remove the file AND the
corresponding entry from `src/components/TrustedBy.tsx` — do not substitute a
generic icon.

## File convention

- Filename: `kebab-case.{svg,png,jpeg}` (e.g. `schwager-energy.svg`, not
  `Schwager_Energy.svg`).
- Dimensions: aim for a ~200x80 px viewBox / canvas. Real logos should be
  proportionally fitted with generous padding; do not stretch.
- Format: SVG preferred (scales cleanly). PNG/JPEG with transparent or near-
  white background is acceptable as a fallback.
- Color: monochrome dark gray or the client's brand-safe gray pairs best with
  the grayscale + hover-to-color CSS treatment, but full-color also works.

## Where they are rendered

- Component: `src/components/TrustedBy.tsx`
- Home page: inserted between the hero and the services grid.
- To add or remove a logo, edit the `logos` array in `TrustedBy.tsx` AND place
  the file here; both sides must stay in sync.
