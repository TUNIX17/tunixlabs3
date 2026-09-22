# TunixLabs Web

Sitio de marketing de Tunix Labs (consultoria IA/dev): landing con avatar 3D interactivo
(voz + robot), paginas de servicios y casos, y panel admin de tesoreria/leads para Curso 7i.
Next.js 13.4 App Router, deploy en Railway (proyecto TunixWEB).

## Stack (verificado en `package.json`)
- Next.js `^13.4.0` — App Router con `params` **sincronico** (`{ params: { locale } }`), NO
  el patron async de Next 15 (`await params`). No mezclar ejemplos de docs de Next 15.
- next-intl `^4.7.0` — locales ES/EN via `src/messages/{es,en}.json` + `useTranslations()`.
  Soporta `useExtracted` (confirmado en `node_modules/next-intl/dist/types/react-client/index.d.ts`)
  — preferirlo sobre extraccion manual de strings al tocar ese flujo.
- Prisma `^5.22.0` (`prisma/schema.prisma`, sin `output` custom → cliente en
  `node_modules/.prisma/client`) — CRM de leads (Lead/Message/Activity).
- React Three Fiber + Ready Player Me (avatar), ElevenLabs/Groq/Cerebras (voz), Resend (email).
- TypeScript `strict: true` (`tsconfig.json`).

## Comandos (existen en `package.json`)
```bash
npm run dev      # next dev
npm run build    # next build — requiere prisma client generado, ver abajo
npm run start    # next start
npm run lint     # next lint
```
No hay script `test`; Playwright es devDependency pero solo se usa para scripts de screenshot
(`scripts/screenshot-*.mjs`), no hay `playwright.config` ni specs.

## Convenciones criticas
- **Cuatro footers distintos, no uno solo**: `src/components/v3/V3Client.tsx` (inline, landing),
  `src/components/ServiceLayout.tsx` (paginas de servicio, via `useTranslations('Footer')`),
  `src/components/AboutPage.tsx` y `src/components/cases/CaseDetail.tsx` (footer de firma).
  `src/components/Footer.tsx` es codigo muerto — no lo importa nada; no "consolidar" ahi sin
  antes revisar si sigue sin uso.
- **Home (`src/app/[locale]/inicio/page.tsx`)** monta `V3Client` con `dynamic(..., { ssr: false })`,
  asi que el HTML servido no trae el contenido del avatar. El SEO vive en dos capas: un bloque
  `<noscript>` en esa misma pagina (fallback para crawlers) y JSON-LD en
  `src/components/seo/schemas.ts` + `src/components/seo/JsonLd.tsx`, inyectado desde
  `src/app/[locale]/layout.tsx`. Tocar el copy de home implica tocar el `<noscript>`, no solo
  el componente 3D.
- **Prisma client no se auto-genera en install**: ni `package.json` ni los paquetes `prisma`/
  `@prisma/client` traen un `postinstall`. Despues de `npm ci` hay que correr
  `npx prisma generate` a mano antes de `npm run build` (el gate de build de abajo ya lo hace).
- Deploy real es Railway via `nixpacks.toml` (`railway.json` apunta a el); `vercel.json` es
  config muerta, no se usa — no asumir Vercel por su presencia.

## Reglas de contenido
- ES: voz directa, WhatsApp como canal primario de contacto.
- EN: tono profesional, Calendly como CTA primario, mensaje nearshore/LATAM (ver
  `src/app/[locale]/layout.tsx` metadata keywords y las FAQ de
  `src/app/[locale]/servicios/page.tsx`).
- Todo string visible va por `useTranslations()` / `src/messages/{es,en}.json`, no hardcodeado.
- NO nombrar Codelco ni RapiGas en copy publico: son clientes finales de proyectos subcontratados
  (SIME, distribuidora de gas) que no saben que Tunix Labs existe en la cadena — ver el comentario
  en `src/components/CaseStudies.tsx` antes de tocar esos casos.

## Quality Mode
medium

## Closing Pipeline
```bash
# Run from project root. Must exit 0. In order.
# No test infra configured — the test gate is a stub until vitest/playwright get wired.
type_check: npx tsc --noEmit
lint: npm run lint
build: npx prisma generate && npm run build
test: echo "GAP: no test infra (playwright aqui es solo tooling de screenshots)" && true
```

## CI
```yaml
# Medium mode: watch_ci is SKIPPED per the canonical mode table in
# ../Agente-Tunix/docs/closing-pipeline.md.
workflow: NOT_CONFIGURED
watch_timeout_seconds: 0
expect_conclusion: skipped
deploy_convention: direct-push  # Railway auto-deploys, public marketing site
```

## Notes
- `test` gate is a placeholder until vitest or a real Playwright suite is set up; promote to
  strict mode once it exists.
- `npx tsc --noEmit` is the type-check gate (no `type-check` script in package.json).
- Contract format follows `../Agente-Tunix/docs/closing-pipeline.md`.
- Estado vivo, decisiones e historial de sesiones: `docs/DEVELOPMENT_STATE.md`, no aqui.

**Documentacion adicional:** `docs/ARCHITECTURE.md`, `docs/PRD.md`, `docs/SETUP.md`,
`docs/ANALYTICS.md`.
