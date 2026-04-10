# Phase 0 — Decisiones congeladas

**Dirección elegida:** C · Kinetic Swiss + Terminal Window metaphor
**Referencia primaria:** jeskojets.com (2025-2026 award winner)
**Target:** Awwwards SOTD candidate
**Fecha:** 2026-04-09

---

## 1. La metáfora visual ancla

**Decisión:** Terminal window invertido (paper theme, no dark).

**Por qué esta decisión:** el terminal es el objeto universal del trabajo en software. Para un portfolio de un operador que construye software real para industrias reales, el terminal no es decoración — es literal. La ventana del terminal es el portal a través del cual un operador mira su código corriendo en producción a las 7 de la mañana.

**Reglas anti-cliché (cómo evitamos el "dev portfolio default"):**

1. **Paper theme, no dark.** Fondo `#f5f5f2`, tinta `#0a0a0a`. Invertimos la expectativa del terminal cyberpunk.
2. **Swiss typography DENTRO del terminal.** Archivo Black masivo como protagonista. Mono solo para prompts y metadata.
3. **Acid lime, no terminal green.** Cursor parpadeante `#ccff00`.
4. **El terminal es portal, no canvas.** Adentro hay fotos de faenas, código real, métricas vivas — no es una simulación de shell.
5. **Traffic lights reinventados:** gray `close`, acid lime `live` (pulsante), copper `prod`.

---

## 2. Sistema de color refinado

```css
:root {
  /* Base */
  --paper:       #f5f5f2;   /* fondo principal */
  --paper-warm:  #f0eee8;   /* variante ligeramente más cálida */
  --paper-raise: #fafaf7;   /* elevaciones dentro del terminal */

  /* Tinta */
  --ink:         #0a0a0a;   /* texto principal, bordes fuertes */
  --ink-mid:     #1a1a1a;   /* texto secundario */
  --ink-muted:   #666664;   /* labels y metadata */
  --ink-light:   #9a9a96;   /* hints sutiles */

  /* Acentos */
  --acid:        #ccff00;   /* accent principal, live cursor */
  --acid-deep:   #a8d600;   /* hover state del acid */
  --copper:      #b85c38;   /* secondary accent (prod indicator, deadline marks) */
  --copper-soft: rgba(184, 92, 56, 0.08); /* washes sutiles */

  /* Glass / overlays */
  --terminal-bg: rgba(255, 255, 255, 0.85); /* contenido del terminal con slight translucency */
  --terminal-border: rgba(10, 10, 10, 0.12);
  --terminal-shadow: 0 40px 80px -20px rgba(10, 10, 10, 0.15),
                     0 20px 40px -10px rgba(10, 10, 10, 0.08);
}
```

**Uso del copper (regla):** el copper aparece SOLO en indicadores de estado "prod" y en elementos "deadline/critical" — nunca como accent decorativo. Esto lo preserva como signal color. El acid lime es el hero accent.

---

## 3. Typography pair refinado

```
Display:    Archivo Black (900)          — hero, section heads
Body:       Archivo (400, 500, 700)      — todo el copy
Mono:       JetBrains Mono (400, 500)    — prompts, metadata, labels, system
Italic:     Instrument Serif (italic)    — pull quotes, human touches
```

**Regla de uso del Instrument Serif italic:** aparece raramente — solo en pull quotes (máximo 1-2 por página), en el subtítulo de una case study cuando hay una cita del cliente, y en el about-founder bio como "accent humano". Nunca en H2/H3. Es el contrapeso humano a toda la precisión técnica del resto.

---

## 4. La forma del terminal (visual language)

### Estructura base

```
┌─ TERMINAL FRAME ─────────────────────────────┐
│ ● ● ●   tunixlabs · ~/[section]       [meta] │  ← top bar, 44px
├──────────────────────────────────────────────┤
│                                              │
│   $ [prompt text varies per section]         │  ← content area
│                                              │
│   [CONTENT: text, images, forms, cases]      │
│                                              │
│   ▊                                          │  ← cursor siempre al final
│                                              │
└──────────────────────────────────────────────┘
```

### Dimensiones

- **Border radius:** `12px` (no 6px clásico — un poco más suave, más contemporáneo)
- **Border:** `1px solid var(--terminal-border)`
- **Shadow:** `var(--terminal-shadow)` — diffuse, direction 40° top
- **Top bar height:** `44px`
- **Top bar padding:** `16px horizontal`
- **Content padding:** `32px top, 48px horizontal, 48px bottom`

### Traffic lights reinventados

```
●         ●              ●
gray      acid-lime      copper
close     live (pulse)   prod
local     editing        deployed
```

Los tres tienen tooltip al hover con los labels. La bolita acid lime pulsa en 2s loop. La copper se ilumina solo cuando el terminal está mostrando contenido real de producción (case studies).

### Top bar right metadata

El lado derecho del top bar muestra metadata dinámica según la sección:

| Section | Right meta |
|---|---|
| Hero | `uptime 15y 03m` |
| Services | `7 practice areas` |
| Case studies | `19,778 work orders in prod` |
| About | `MSc Finance · MIT Prof Ed` |
| Contact | `reply < 24h` |

El prompt actualiza como si fuera real — da la sensación de que el terminal es un sistema vivo, no una decoración.

---

## 5. Prompts del terminal por sección

Cada sección tiene su propio prompt que aparece tipeado (typewriter animation) al entrar en viewport:

```
Hero:          $ ./production --show-portfolio
Services:      $ cat ./services.json | jq '.items[]'
Case studies:  $ ./case-studies/sime.run --metrics
About:         $ whoami && uname -a
Contact:       $ ./contact --method=any
```

**Regla importante:** cada prompt tiene que ser **técnicamente coherente** (no "sudo hire me" ni cutesy). Un desarrollador que lo lea tiene que pensar "esto podría ser real". Esa credibilidad es parte del brand.

---

## 6. El "One Wow Moment" — Terminal Morph Scroll

### Concept

El terminal window es el contenedor persistente de TODO el sitio. No solo está en el hero. Persiste durante todo el scroll, cambiando de tamaño, posición, y contenido interno según la sección en la que estás.

### Estados del terminal por sección

| Sección | Width | Height | Position | Content dominante |
|---|---|---|---|---|
| Hero | 92vw | 82vh | center | Archivo Black masivo "NOT A STUDIO. ONE OPERATOR." + foto de faena en background |
| Services | 78vw | 68vh | center | Grid asimétrico de 7 servicios |
| Case study 1 | 96vw | 88vh | center | Full-bleed photo de operario + overlay text |
| Services 2 continuation | 72vw | 62vh | center, shifted right | Case studies smaller cards |
| About | 64vw | 76vh | center, shifted left | Portrait + bio editorial |
| Contact | 56vw | 52vh | center | Minimal form + WhatsApp CTA |

### Mecánica técnica

**Librerías:**
- **Lenis** (5kb) — smooth scroll, GPU-accelerated
- **Motion One** (~10kb) — web animations API wrapper, best performance-to-DX ratio

**Estructura:**
1. `<main>` es un contenedor que NO scrollea
2. Dentro hay un `<div class="terminal-window">` fixed en el viewport
3. Las secciones son divs que definen "estados" del terminal (width, height, content)
4. Un scroll observer detecta la sección activa y dispara transitions del terminal
5. Las transitions son `cubic-bezier(0.2, 0.9, 0.25, 1)` duración 900ms
6. El contenido interno del terminal hace crossfade (opacity + slight y-transform) durante la transition

**El "primer momento wow":**
Cuando el usuario scrollea por primera vez, el terminal full-viewport se achica con un smooth transform hacia 78vw/68vh y su contenido interno cambia de hero text → services grid. Ese transform debe sentirse *satisfying* — como si un objeto físico se moviera, no como un resize de CSS.

**Preloader:**
Al cargar la página, el terminal entra con una mask-reveal: el viewport empieza en 0x0 en el center y se expande hacia su tamaño hero (92vw/82vh) en 900ms. Durante esos 900ms, el cursor parpadeante ya está visible. A los 400ms empiezan a aparecer las líneas de texto (rise animation que ya tenía C). Todo orquestado en una timeline.

### Fallback para reduced motion

Con `prefers-reduced-motion: reduce`:
- El terminal NO transforma — se queda a un tamaño fijo (85vw/80vh) durante todo el scroll
- El contenido cambia con crossfade instantáneo (150ms)
- No hay parallax
- Cursor parpadeante se detiene

---

## 7. Hero en capas (3 planos con parallax)

```
Plano 1 (atrás):  foto de faena desaturada, blurred 2px, parallax 20% del scroll
Plano 2 (medio):  terminal window frame + overlays
Plano 3 (frente): Archivo Black text "breaking out" del terminal
```

El parallax del plano 1 NO es scroll-based (el scroll es controlado por el terminal morph) — es **cursor-based**. Al mover el cursor, el plano 1 se desplaza 8px máximo en X y 12px máximo en Y, con easing. Esto da sensación de profundidad sin usar scroll.

---

## 8. Photography coherencia

Todas las imágenes tienen el MISMO tratamiento visual para que se sientan parte de una misma serie:

- **Paleta:** desaturada (25-35% saturación original), tonos azul-noche o cobre-amanecer
- **Light direction:** side-light desde la derecha, sombras profundas a la izquierda
- **Grain:** ligero film grain sobre toda la imagen
- **Vignette:** radial vignette sutil en las esquinas
- **Aspect:** preferencia por composiciones asimétricas con mucho espacio negativo en un lado

**Las 5 imágenes a generar con /imagine:**
1. Hero background — faena minera nocturna con operarios y equipos (detalle en IMAGE-PROMPTS.md)
2. Case study Schwager — operario con casco y guantes usando app móvil en faena
3. Case study SIME — pantalla de software en un monitor industrial en una oficina de faena
4. About founder — portrait editorial en blanco y negro
5. Case study Fernández — máquinas de metalurgia con iluminación dramática

Los prompts completos están en `IMAGE-PROMPTS.md`.

---

## 9. Cursor interactions

- **Default:** native cursor, no custom
- **Sobre CTAs (buttons/links):** magnetic snap — cuando el cursor entra en un radio de 60px del centro del CTA, el CTA se desplaza 8px hacia el cursor con easing, creando sensación de atracción
- **Sobre imágenes:** circular viewport (120px) que muestra una versión más nítida/saturada de la imagen debajo, como si el cursor fuera un lente de aumento
- **Sobre el texto del hero:** las letras se desplazan 4-6px siguiendo el cursor con delay progresivo (letras más cercanas al cursor más movimiento)

**Técnica:** Motion One con `animate(element, { x, y }, { duration: 0.6, easing: [0.2, 0.9, 0.25, 1] })` disparado por mousemove.

---

## 10. Micro-detalles

- **Selection color:** acid lime background, ink text
- **Scroll indicator:** línea vertical 2px acid lime a la izquierda, progresa según scroll
- **Nav underline:** se dibuja carácter por carácter on hover con `clip-path: inset()`
- **Split-flap counters:** en los números críticos (15 years, 19,778 work orders, 88 tests) — al entrar en viewport, los números giran como un panel aeropuerto
- **Favicon:** ● acid lime sobre fondo ink, 32x32
- **Meta OG image:** "NOT A STUDIO · ONE OPERATOR" en Archivo Black sobre paper, con terminal frame, para link previews
- **Grain background:** SVG filter animado muy sutil sobre todo el body

---

## 11. Accesibilidad (no negociable)

- `prefers-reduced-motion: reduce` respetado en todas las animations
- Contrast ratio AA mínimo para todo el texto (ink sobre paper es ~18:1, safe)
- Nav keyboard-accessible con focus rings en acid lime
- Terminal morph tiene fallback estático
- Screen reader: el terminal window tiene `role="presentation"` — el contenido interno usa semantic HTML
- Alt text descriptivo en todas las imágenes
- LCP target: < 2.5s
- CLS target: < 0.1 (el terminal morph NO debe causar layout shifts — uses `transform`, no `width`/`height`)

---

## 12. Performance budget

- **Total JS:** < 30kb gzipped (Motion One ~10kb + Lenis ~5kb + custom ~8kb)
- **Total CSS:** < 15kb gzipped
- **Hero images:** < 120kb total, WebP + AVIF fallback, responsive srcset
- **Fonts:** Archivo Black + Archivo + JetBrains Mono + Instrument Serif subset = ~80kb total con font-display: swap
- **LCP element:** el hero headline text (no imagen) → LCP basado en font load

---

## 13. Lo que NO vamos a hacer (guardrails)

- ❌ Dark theme — no importa qué digan los comments, el paper theme es la diferenciación
- ❌ Three.js / WebGL — Motion One + parallax CSS es suficiente
- ❌ Lottie — cualquier animación que necesitaríamos, la hacemos con Motion One
- ❌ Texto animado character-by-character en body copy — solo en hero headlines
- ❌ Sonidos — demasiado polarizante, solo si el sitio es una obsesión personal
- ❌ Mouse trails — cliché de portfolio developer
- ❌ Custom cursor que reemplaza el sistema — solo augments puntuales

---

## Checklist Fase 0

- [x] Metáfora visual decidida
- [x] Sistema de color refinado
- [x] Typography pair refinado
- [x] Terminal shape spec
- [x] Prompts por sección
- [x] Wow moment mecánica definida
- [x] Photography coherencia definida
- [x] Cursor interactions spec
- [x] Performance budget
- [x] Accesibilidad guardrails
- [ ] Image prompts detallados (IMAGE-PROMPTS.md) — siguiente
- [ ] Prototype del wow moment (wow-prototype/) — siguiente
- [ ] Research de award winners 2026 — en background, integrar cuando retorne

---

**Estado:** Spec congelado. Siguiente: redacción de prompts de imágenes + construcción del prototype minimal del wow moment.

---

## 14. Cross-reference findings (research de award-winning 2025-2026)

**Research agent:** `tunix-research` · 2026-04-09 · 6 sitios analizados

### Sitios estudiados

| # | Sitio | Award | Underlying technique | Stealable |
|---|---|---|---|---|
| 1 | [Igloo Inc](https://www.igloo.inc/) | **SOTY 2025** | Single continuous 3D scene, scroll = camera, portfolio items inside the metaphor (encased in ice crystals) | Chromatic aberration + dissolve between scroll states inside one persistent scene |
| 2 | [Lando Norris](https://landonorris.com/) | SOTY Jury Vote | Rive state machines layered on WebGL (not Lottie, not GSAP) | **Rive for terminal chrome** — scroll-driven state machines, ~10kb |
| 3 | [Terminal Industries](https://www.awwwards.com/sites/terminal-industries) | SOTM Oct 2025 | Shipping terminal as metaphor; scroll cadence mimics port flow | Domain-authentic motion language (ours should be software-executing) |
| 4 | [Renaissance Edition](https://www.awwwards.com/sites/the-renaissance-edition) | SOTM Feb 2026 | Generative imagery per visit — returning visitors see something new | Per-session variation in terminal prompts |
| 5 | [Bruno Simon](https://bruno-simon.com/) | SOTM Jan 2026 | Spatialized audio (birds, fire, horn) | Ambient audio (CRT hum + keystroke ticks) |
| 6 | [MindMarket](https://www.awwwards.com/sites/mindmarket) | SOTD | SVG thread drawing itself across homepage, persists while scenes change | `stroke-dasharray` + `scroll-timeline` CSS (closest pattern to our persistent container) |

### Patterns que 2026 premia (frecuencia en el panel)

| Pattern | Hits | Status en mi spec actual |
|---|---|---|
| Single continuous camera (not section transitions) | 5/6 | ❌ Missing — mi morph es reframing, no continuous |
| Metaphor IS navigation, not decoration | 6/6 | ⚠️ Parcial — el terminal es metáfora pero no está navegando |
| Custom motion grammar tied to business domain | 6/6 | ✅ OK — Swiss + mono encaja con regulated industries |
| Spatialized/ambient audio | 2/6 (rising) | ❌ Missing |
| Per-visit generative variation | 2/6 (rising) | ❌ Missing |
| Rive for micro-state machines | 2/6 (rising fast) | ❌ Missing |

### El insight central del research

> **"La metáfora tiene que *hacer trabajo*, no solo *existir*."**
>
> Jeskojets' window *frames*, Igloo's crystals *contain*, MindMarket's thread *connects*, Bruno's world *hosts*. En todos los casos la metáfora es un verbo, no un sustantivo.

**Mi spec actual tiene el terminal como sustantivo** (frame que reframea). El spec ganador lo convertiría en verbo: el terminal **ejecuta**. Scrollear **corre comandos**. El contenido del sitio **es el output** de esos comandos.

### 5 recomendaciones concretas del research

1. **Terminal como intérprete, no frame.** El terminal persiste, NUNCA reframea. Scroll = ejecución. Cada tick tipea un carácter o corre una línea. Contenido streamea como output.
2. **Rive state machine para el chrome del terminal** (traffic lights, cursor, prompt). Scroll-driven, 10kb, deterministic.
3. **Per-session generativity** en el prompt line. Cada visitante ve un comando diferente con data variable.
4. **Ambient audio opcional** — CRT hum <-30dB + keystroke ticks al scrollear. Toggle visible, default OFF.
5. **CSS `scroll-timeline` + `animation-timeline: scroll()`** — baseline en Chromium 2025. Orquestar el tipeo del terminal en CSS puro, sin JS.

### Naming collision a monitorear

**"Terminal Industries"** es un Awwwards SOTM Oct 2025 usando la palabra "terminal" como metáfora (shipping terminal, no software). No es un conflicto de marca pero:
- ✅ Valida que "terminal" como metáfora gana awards en 2026
- ⚠️ Requiere diferenciación sharper en la comunicación — no podemos usar "Terminal X" como brand angle
- 🎯 Nuestro ángulo distintivo: el suyo es *físico/logistics*, el nuestro es *software executing commands*. Mismo vocabulario, universos distintos.

### Implicación en el plan

Los findings sugieren una **Camino B** alternativo al prototype actual (Camino A):

| Dimensión | Camino A (actual) | Camino B (rebuild) |
|---|---|---|
| Terminal | Frame que reframea entre estados | Intérprete que ejecuta (persistente, tamaño fijo) |
| Scroll | Trigger de state changes | Ejecución de comandos |
| Contenido | Pre-renderizado, crossfade | Streamea como output character-by-character |
| Tech | Motion One + IntersectionObserver | CSS scroll-timeline + Rive + Motion One complementario |
| Audio | — | Ambient opcional (CRT + keystrokes) |
| Generatividad | — | Per-session en prompts |
| Costo adicional | 0 (ya está) | +1 sesión de trabajo |
| Ceiling | Runner-up / SOTD candidate | SOTY nominee candidate |

**Decisión pendiente:** usuario debe abrir Camino A primero (prototype actual) y reaccionar. Después decidir si el salto a B justifica el rebuild.

**Estado actualizado:** Spec + research findings incorporados. Esperando validación visual del prototype actual antes de decidir A vs B.

---

## 15. Decisión final · Camino B elegido (2026-04-09)

**Elegido:** Camino B · Kinetic Swiss v2 · Terminal as Interpreter

El usuario revisó el v2 prototype en `design-explorations/wow-prototype-v2/index.html`
(terminal persistente con scroll-ejecuta-comandos) junto con los findings de sección 14
(SOTY nominee ceiling, single continuous camera, metáfora-como-verbo, Rive state machines)
y confirmó la dirección como **frozen** para toda la implementación del redesign.

### Scope del freeze

- **Metáfora:** terminal como intérprete persistente, tamaño fijo, scroll ejecuta
  comandos, contenido streamea como output char-by-char y line-by-line.
- **Paleta:** paper theme `#f5f5f2` / ink `#0a0a0a` / acid lime `#ccff00` / copper `#b87333`.
  Nunca dark theme matrix, nunca terminal green `#00ff00`.
- **Tipografía:** Archivo Black masivo dentro del terminal (Swiss masthead), mono solo
  para prompts y metadata.
- **Traffic lights reinventados:** gray `close`, acid lime `live`, copper `prod`.
- **Audio ambient:** **DROPPED** por decisión explícita del usuario. El pattern de
  Bruno Simon queda como referencia de investigación pero NO se implementa.
- **Rive:** carved-out single exception a "no animation libraries" — state machines
  nativas para terminal chrome + hero moments. Preview loop obligatorio vía chrome/
  playwright screenshots. `RiveWithFallback` wrapper obligatorio en producción.
- **Bilingual asymmetry:** ES=LATAM (no menciona nearshore), EN=US nearshore
  (3-5× below SF/NYC, 0-2h timezone). Dos estrategias paralelas, NO traducciones.

### Artifacts que anclan la decisión

- `design-explorations/wow-prototype-v2/index.html` — el prototype Camino B, z-index
  del terminal-aside arreglado.
- Los 6 sprint YAMLs en `Agente_Tunix/.claude/workflows/tunixlabsweb-redesign-sprint-{0..5}.yaml`
  (commit `e5385d7`).
- Agente `tunix-frontend` project-local con conocimiento del Rive preview loop
  (commit `e5385d7`).
- RiveMCP instalado + license key configurado + wrapper ejecutable
  (commit `0bbdaeb`).

### Atribución indirecta (no negociable)

- Codelco → "Chile's largest copper mining operations"
- RapiGas → "regional gas distribution operator in Chile"
- Grep-enforced en los review steps de los sprints.

### Próximo paso

`/workflow run tunixlabsweb-redesign-sprint-1` — 5 imágenes Gemini + v2 prototype
integration + Rive PoC.
