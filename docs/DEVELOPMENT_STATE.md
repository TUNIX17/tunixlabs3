# TunixLabs - Development State

**Last Updated:** 2026-01-06
**Current Phase:** Deployment Complete
**Sprint:** 0 - Configuration

---

## CURRENT STATUS

### Project Overview
TunixLabs es una plataforma web de consultoria en IA con:
- Sitio web principal con servicios de consultoria
- Robot/Avatar 3D interactivo con sistema de voz
- Sistema de tesoreria para Curso 7i
- Despliegue en Railway

### Completed
- [x] Repository cloned from GitHub
- [x] Claude Code configuration adapted
- [x] .venv symlink configured (shared with SchwagerDigital)
- [x] Raggy RAG system configured (moved to scripts/)
- [x] Agile command configured
- [x] Initial documentation structure
- [x] **Railway deployment successful**
- [x] Fix tipos de axios en groq-proxy
- [x] Configuración nixpacks.toml para Node.js
- [x] railway.json configurado

### In Progress
- [ ] Voice system integration (ElevenLabs/Groq)
- [x] 3D Avatar enhancement - Phase 1 Quick Wins completado
- [ ] Configurar variables de entorno en Railway

### Pending
- [ ] PRD document creation
- [ ] Sprint 1 planning
- [ ] Testing setup (Jest + Playwright)
- [ ] CI/CD pipeline
- [ ] Conectar dominio tunixlabs.com

---

## DEPLOYMENT INFO

### Railway Production
- **URL:** https://tunixlabs3-production.up.railway.app
- **Project:** TunixWEB
- **Service:** tunixlabs3
- **Environment:** production
- **Status:** ✅ Online

### Deploy Commands
```bash
railway up --detach    # Deploy manual
railway logs -n 50     # Ver logs
railway variables      # Ver variables
railway domain         # Configurar dominio
```

---

## ARCHITECTURE DECISIONS

### 1. Shared Virtual Environment
**Decision:** Reutilizar .venv de SchwagerDigital
**Rationale:**
- Evitar duplicacion de dependencias (chromadb, sentence-transformers)
- Mantener consistencia entre proyectos
- Ahorrar espacio en disco (~2GB)
**Implementation:** Symlink `.venv -> /home/tunix/Escritorio/SchwagerDigital/.venv`

### 2. RAG System (Raggy)
**Decision:** Mover raggy.py a scripts/ para evitar detección de Python en Railway
**Rationale:**
- Railway detectaba Python y fallaba el build
- Mantener archivos de desarrollo separados
**Implementation:** `scripts/raggy.py`, `scripts/raggy_config.yaml`

### 3. Railway Deployment
**Decision:** Frontend y Backend en Railway con Nixpacks
**Rationale:**
- Integracion con PostgreSQL managed
- Deploys automaticos desde GitHub
- Variables de entorno seguras
**Implementation:** `nixpacks.toml` + `railway.json`

---

## TECH STACK

```yaml
Frontend:
  Framework: Next.js 13.5.11 (App Router)
  Language: TypeScript
  Styling: Tailwind CSS
  3D: React Three Fiber + Drei

Backend:
  API: Next.js API Routes
  Database: PostgreSQL (Railway) - pendiente
  Proxy: /api/groq-proxy para TTS

Services:
  Voice: Groq API (vía proxy)
  Avatar: Ready Player Me
  Hosting: Railway
  Domain: tunixlabs.com (pendiente DNS)
```

---

## ENVIRONMENT VARIABLES

### Configuradas (Railway auto)
- RAILWAY_ENVIRONMENT
- RAILWAY_PUBLIC_DOMAIN
- PORT (auto)

### Pendientes de configurar
```bash
# Voice System (para /api/groq-proxy)
GROQ_API_KEY=

# Future: Database
DATABASE_URL=

# Future: Auth
AUTH_SECRET=
```

Para configurar: `railway variables --set KEY=value`

---

## NEXT STEPS

1. **Immediate:**
   - Configurar GROQ_API_KEY en Railway para sistema de voz
   - Probar interacción con robot 3D en producción

2. **Short-term:**
   - Conectar dominio tunixlabs.com
   - Agregar PostgreSQL en Railway
   - Implementar sistema de autenticación

3. **Medium-term:**
   - Enhance 3D avatar interactions
   - Treasury system for Curso 7i
   - Testing setup

---

## BLOCKERS

- [x] ~~Railway project needs to be created~~ ✅ Completado
- [ ] Need GROQ_API_KEY for voice testing in production
- [ ] Domain DNS configuration pending

---

## RECENT CHANGES (2026-01-05)

### Animation System Refactor - Phase 2: Architecture

1. **AnimationMachine** - Máquina de estados (`src/lib/animation/AnimationMachine.ts`)
   - 11 estados de animación definidos (IDLE, WAVING, THINKING, etc.)
   - Sistema de prioridades (0-10)
   - Transiciones permitidas configurables
   - Blending automático entre estados
   - Métodos: `transitionTo()`, `send()`, `update()`

2. **AnimationQueue** - Cola de animaciones (`src/lib/animation/AnimationQueue.ts`)
   - Cola con prioridades (mayor primero)
   - Soporte para animaciones interrumpibles
   - Secuencias de animaciones
   - Callbacks: onStart, onComplete, onInterrupt
   - Métodos: `enqueue()`, `interruptWith()`, `pause()`, `resume()`

3. **BoneController** - Control de huesos (`src/lib/animation/BoneController.ts`)
   - Registro centralizado de huesos
   - Grupos de huesos predefinidos (head, torso, arms, legs, etc.)
   - Blending global y por hueso
   - Rotaciones objetivo con lerp configurable
   - Métodos: `setTargetRotation()`, `updateGroup()`, `resetAll()`

4. **useRobotAnimations Hook** - Integración (`src/lib/animation/useRobotAnimations.ts`)
   - Integra Machine + Queue + BoneController
   - API simplificada para animaciones
   - Funciones de aplicación de animaciones modulares
   - Método `update()` para useFrame

### Files Created in Phase 2
- `src/lib/animation/AnimationMachine.ts` (~320 líneas)
- `src/lib/animation/AnimationQueue.ts` (~280 líneas)
- `src/lib/animation/BoneController.ts` (~350 líneas)
- `src/lib/animation/useRobotAnimations.ts` (~450 líneas)

---

### Animation System Refactor - Quick Wins Phase 1
1. **Rotation Presets Extracted** - Creado `src/lib/animation/rotationPresets.ts`
   - Todas las rotaciones de animaciones externalizadas
   - Configuraciones de idle, wave, dance, nodYes, shakeLegs, approach
   - Parámetros de cursor tracking y listening configurables
   - `ANIMATION_CONFIGS` para duraciones y lerp factors

2. **Easing Functions Library** - Creado `src/lib/animation/easingFunctions.ts`
   - 28 funciones de easing disponibles (linear, quad, cubic, expo, back, elastic, bounce, sine, circ)
   - `easingMap` para selección dinámica por nombre

3. **New Thinking Animation** - Agregada animación de "pensando"
   - Robot pone mano en barbilla, cabeza ladeada mirando arriba
   - Brazo izquierdo cruzado, cuerpo ligeramente inclinado
   - Oscilación sutil para efecto natural
   - `startThinking()` y `stopThinking()` métodos expuestos

4. **useFrame Optimization**
   - Early returns para evitar cálculos innecesarios
   - Mouse delta check para updates selectivos
   - Skip de animaciones idle cuando thinking activo
   - Parámetros de configuración centralizados (no hardcoded)

5. **Integration with useRobotInteraction**
   - `startThinking()` se llama en estado PROCESSING
   - `stopThinking()` se llama al iniciar SPEAKING o en ERROR
   - Tipos actualizados en `robot.ts`

### Files Modified/Created
- `src/lib/animation/rotationPresets.ts` (NEW)
- `src/lib/animation/easingFunctions.ts` (NEW)
- `src/lib/animation/index.ts` (NEW)
- `src/app/inicio/components/RobotModel.tsx` (MODIFIED)
- `src/hooks/useRobotInteraction.ts` (MODIFIED)
- `src/types/robot.ts` (MODIFIED)

### Previous Changes (2026-01-06)
1. **Fix axios types** - Corregido import de AxiosRequestConfig
2. **Railway config** - Agregado nixpacks.toml y railway.json
3. **Moved Python files** - raggy.py y configs movidos a scripts/
4. **Successful deploy** - Sitio online en Railway

---

## NOTES

- El .venv compartido ya tiene las dependencias de Raggy instaladas
- Usar `.venv/bin/python scripts/raggy.py` para comandos RAG
- Railway hace deploy automático al push a main
- Para deploy manual: `railway up --detach`
