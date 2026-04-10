# Tunixlabsweb Redesign · Asset Inventory · Sprint 1

**Source of truth** for what real assets exist in the repo and how they map
to the v2 prototype .bg-scene divs. Written 2026-04-09 during Sprint 1 v3
execution.

## Real assets (14 case study screenshots + 1 portrait + 2 client logos)

### Portrait
- /team/alejandro-moyano.png (~980KB) — Alejandro's real portrait, PNG.
  Used in .bg-about with B&W CSS filter treatment.

### Apoderapp (4 screenshots)
- /case-studies/apoderapp-landing-hero.png
- /case-studies/apoderapp-features.png
- /case-studies/apoderapp-presidenta-dark.png  ← used in .bg-contact
- /case-studies/apoderapp-tesorera-dark.png

### Fernández ERP (6 screenshots)
- /case-studies/fernandez-erp-dashboard.png  ← used in .bg-case
- /case-studies/fernandez-erp-terminal.png
- /case-studies/fernandez-erp-crm.png
- /case-studies/fernandez-erp-projects.png
- /case-studies/fernandez-erp-kpis.png
- /case-studies/fernandez-erp-finance.png

### SGM Schwager (3 screenshots)
- /case-studies/sgm-schwager-hero.png  ← used in .bg-hero
- /case-studies/sgm-schwager-calendar.png
- /case-studies/sgm-schwager-semana.png

### Bot Gas Distribution (1 screenshot)
- /case-studies/bot-gas-distribution.png

### Speakly (1 screenshot)
- /case-studies/speakly-landing.png

### Client logos
- /logos/mindco.png
- /logos/stltda.png
- /logos/schwager.jpeg (extra file present on disk, not in original template)

### Credentials
- /credentials/mit-professional-education.jpg

## Scene mapping (Sprint 1 integration target)

| Scene | Real asset | CSS treatment | Rationale |
|---|---|---|---|
| .bg-hero | /case-studies/sgm-schwager-hero.png | existing gradient overlay + cover | Dramatic opening, regulated mining framing |
| .bg-services | (no photo) | existing tick-grid pattern, unchanged | Grid content, not a photo scene |
| .bg-case | /case-studies/fernandez-erp-dashboard.png | gradient overlay + cover | Industrial ERP dashboard, neutral |
| .bg-about | /team/alejandro-moyano.png | grayscale(1) contrast(1.15) brightness(0.95) + gradient overlay | Editorial B&W treatment via CSS filter |
| .bg-contact | /case-studies/apoderapp-presidenta-dark.png | gradient overlay + cover | Dark moody closing shot |

## Assets NOT used in Sprint 1

- /ROBOT2.glb + /potsdamer_platz_1k.hdr — Three.js assets from the old
  neumorphism version. Three.js dropped in Camino B Kinetic Swiss v2.
  Kept in public/ for backward compatibility but not referenced by the
  new prototype. Sprint 5 may do cleanup if budget allows.
- /onnx/ — ONNX ML model, unclear current use, decision deferred to Sprint 2.
- /case-studies/cv-extracted/cv-*.png — 10 CV pages as images. Potential
  use in an expanded About section, deferred to Sprint 4.

## Attribution notes (non-negotiable)

- SGM Schwager files are named "sgm-schwager-*" (not "codelco-*") which
  already implements indirect attribution. SGM is a contract mining company
  that operates on Codelco sites. Public-facing copy: "regional mining
  operation in Chile", never "Codelco".
- "bot-gas-distribution" filename is already neutral (no "RapiGas" in the
  name). Public-facing copy: "regional gas distribution operator".
