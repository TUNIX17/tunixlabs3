# TunixLabs - Development State

**Last Updated:** 2026-01-08
**Current Phase:** Real-Time Voice Agent System Complete
**Sprint:** 1 - Voice Conversation System

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
- [x] **LLM Migration: Groq → Cerebras Llama 3.3 70B** (FREE TIER)
- [x] 3D Avatar enhancement - Phase 1-4 Complete
- [x] **Real-Time Voice Agent System** (2026-01-08)
  - [x] VAD (Voice Activity Detection) con Web Audio API
  - [x] Conversación continua hands-free
  - [x] Barge-in (interrupción del robot mientras habla)
  - [x] Sistema de agente comercial con prompts
  - [x] Manejo de sesión con timeouts
  - [x] Tracking de fase de conversación

### In Progress
- [ ] Configurar CEREBRAS_API_KEY en Railway
- [ ] Testing del sistema de voz en producción

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

### 4. LLM Migration: Groq → Cerebras (2026-01-08)
**Decision:** Migrar LLM de Groq Llama a Cerebras Llama 3.3 70B
**Rationale:**
- **Costo:** FREE TIER con 1M tokens/día (vs ~$0.0003/conv en Groq)
- **Capacidad:** ~7,500 clientes/mes sin costo en LLM
- **Velocidad:** 6x más rápido que Groq (~2100 tok/s)
- **Modelo:** Llama 3.3 70B incluido gratis (mejor que el 8B anterior)
- **API:** Compatible con OpenAI, migración trivial
**Implementation:**
- Nuevo proxy: `/api/cerebras-proxy/route.ts`
- Cliente: `src/lib/cerebras/client.ts`
- Hook actualizado: `useGroqConversation.ts` usa `cerebrasClient`
- Config: `src/lib/groq/models.ts` actualizado con `CEREBRAS_MODELS`

### 5. Voice System Stack Optimizado
**Decision:** Stack híbrido para máximo ahorro
**Stack Final:**
```
LLM:  Cerebras Llama 3.3 70B  →  $0.00/cliente (FREE TIER)
STT:  Groq Whisper Large V3   →  $0.0017/cliente ($0.04/hora)
TTS:  Web Speech API          →  $0.00/cliente (navegador)
───────────────────────────────────────────────────────────
TOTAL:                        →  ~$0.002/cliente
```
**Comparación vs Google Live API:** 65x más económico ($0.002 vs $0.13/cliente)

### 6. Real-Time Voice Agent System (2026-01-08)
**Decision:** Sistema de conversación continua hands-free con VAD básico
**Rationale:**
- Experiencia de usuario tipo asistente de voz (sin clicks repetidos)
- VAD basado en umbral de volumen (sin ML adicional)
- Barge-in para permitir interrupciones naturales
- Agente comercial enfocado en captura de leads
**Implementation:**
- VAD: Web Audio API con RMS calculation
- State Machine: IDLE → LISTENING → LISTENING_ACTIVE → PROCESSING → SPEAKING → (auto-restart)
- Barge-in: Threshold 1.5x más alto durante TTS
- Session timeouts: 60s idle, 30s listen, 10min max
- Prompts comerciales ES/EN con cache
**New Files:**
- `src/lib/audio/vad.ts` - VoiceActivityDetector class
- `src/lib/audio/vadConfig.ts` - Configuraciones VAD
- `src/hooks/useVAD.ts` - React hook para VAD
- `src/lib/agent/AgentConfig.ts` - Configuración del agente
- `src/lib/agent/ConversationState.ts` - Tracking de fases y leads
- `src/lib/agent/AgentPromptCache.ts` - Cache de prompts
- `src/lib/agent/prompts/commercialAgent.ts` - Prompts comerciales
- `src/lib/conversation/ConversationSession.ts` - Manejo de sesión
**Modified Files:**
- `src/hooks/useRobotInteraction.ts` - VAD integration, barge-in, auto-restart
- `src/hooks/useGroqConversation.ts` - Commercial prompts
- `src/components/VoiceInterface/FloatingMicButton.tsx` - Visual states
- `src/components/VoiceInterface/VoiceController.tsx` - Phase indicators
- `src/components/VoiceInterface/ControlButtons.tsx` - New states

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
  Proxies:
    - /api/cerebras-proxy  # LLM (Cerebras)
    - /api/groq-proxy      # Legacy/fallback
    - /api/transcribe-audio # STT (Groq Whisper)

AI Services:
  LLM: Cerebras Llama 3.3 70B (FREE - 1M tokens/día)
  STT: Groq Whisper Large V3 ($0.04/hora)
  TTS: Web Speech API (FREE - navegador)

Infrastructure:
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

### Pendientes de configurar en Railway
```bash
# LLM - Cerebras (REQUERIDO para conversación)
# Get key at: https://cloud.cerebras.ai/
CEREBRAS_API_KEY=

# STT - Groq Whisper (REQUERIDO para transcripción)
# Get key at: https://console.groq.com/
GROQ_API_KEY=

# Future: Database
DATABASE_URL=

# Future: Auth
AUTH_SECRET=
```

Para configurar: `railway variables --set CEREBRAS_API_KEY=your_key`

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

## RECENT CHANGES (2026-01-08)

### Real-Time Voice Agent System - Complete Implementation

1. **Voice Activity Detection (VAD)**
   - `src/lib/audio/vad.ts` - VoiceActivityDetector class using Web Audio API
   - RMS (Root Mean Square) volume calculation
   - Configurable thresholds: volumeThreshold=0.015, silenceTimeout=1500ms
   - Events: speech_start, speech_end, volume_change, listening_start/stop
   - Debounce for speech start (200ms) and silence detection (1.5s)

2. **Conversation State Machine**
   ```
   IDLE → LISTENING → LISTENING_ACTIVE → PROCESSING → SPEAKING → (auto-restart) LISTENING
                                                      ↑
                                           (barge-in) ←
   ```
   - New state: LISTENING_ACTIVE (user actively speaking)
   - Auto-restart after TTS completes
   - Barge-in cancels TTS and transitions to LISTENING_ACTIVE

3. **Session Management**
   - `src/lib/conversation/ConversationSession.ts`
   - Idle timeout: 60s without activity → IDLE
   - Listen timeout: 30s waiting for voice → IDLE
   - Max session duration: 10 minutes
   - Events: session_start, session_end, idle_timeout, listen_timeout

4. **Commercial Agent System**
   - `src/lib/agent/AgentConfig.ts` - Agent personality and services config
   - `src/lib/agent/ConversationState.ts` - Phase tracking and lead extraction
   - `src/lib/agent/AgentPromptCache.ts` - Singleton prompt cache
   - Conversation phases: GREETING → DISCOVERY → QUALIFICATION → PRESENTATION → BOOKING → FAREWELL
   - Lead data extraction: name, company, email, interest, painPoints

5. **Commercial Prompts**
   - `src/lib/agent/prompts/commercialAgent.ts`
   - ES/EN versions with strict rules:
     - Never give specific prices
     - Keep responses 2-3 sentences max
     - Always end with a question
     - No markdown formatting
   - Focus on lead capture and meeting scheduling

6. **UI Updates**
   - FloatingMicButton: volume indicator, session active indicator, color states
   - VoiceController: phase indicator, end session button, volume bars
   - ControlButtons: pulse effects, state-based colors

7. **Files Created**
   - `src/lib/audio/vad.ts` (~430 lines)
   - `src/lib/audio/vadConfig.ts` (~80 lines)
   - `src/hooks/useVAD.ts` (~160 lines)
   - `src/lib/agent/AgentConfig.ts` (~150 lines)
   - `src/lib/agent/ConversationState.ts` (~200 lines)
   - `src/lib/agent/AgentPromptCache.ts` (~80 lines)
   - `src/lib/agent/prompts/commercialAgent.ts` (~300 lines)
   - `src/lib/conversation/ConversationSession.ts` (~200 lines)
   - `src/lib/agent/index.ts` (~20 lines)
   - `src/types/agent.ts` (~80 lines)

8. **Files Modified**
   - `src/hooks/useRobotInteraction.ts` - Major rewrite with VAD, barge-in, auto-restart
   - `src/hooks/useGroqConversation.ts` - Commercial prompt integration
   - `src/components/VoiceInterface/FloatingMicButton.tsx` - Visual states
   - `src/components/VoiceInterface/VoiceController.tsx` - Phase indicators
   - `src/components/VoiceInterface/ControlButtons.tsx` - New states

---

## PREVIOUS CHANGES (2026-01-05)

### Animation System Refactor - Phase 4: Integration

1. **RobotModel.tsx Actualizado**
   - Imports de nuevos presets (EXCITED, CONFUSED, GOODBYE)
   - 3 nuevos estados: isExcited, isConfused, isGoodbye
   - Timer refs para control de duración
   - Lógica completa en useFrame para cada animación

2. **Nuevos Métodos Expuestos**
   - `startExcited()` - Animación de celebración con rebote energético
   - `startConfused()` - Animación de duda con hombros encogidos
   - `startGoodbye()` - Animación de despedida con reverencia

3. **Tipos Actualizados**
   - `RobotMethods` interface en RobotModel.tsx
   - `RobotMethods` interface en types/robot.ts

4. **Características de las Animaciones**
   - Cada animación tiene oscilación configurable
   - Transiciones suaves con lerp
   - Cancelación automática de animaciones conflictivas
   - Cleanup de timers en desmontaje

### Animation System Refactor - Phase 3: New Animations

1. **Nuevas Animaciones de Emoción**
   - `EXCITED_ROTATIONS` - Brazos arriba celebrando, rebote energético
   - `CONFUSED_ROTATIONS` - Cabeza ladeada, hombros encogidos
   - `GOODBYE_ROTATIONS` - Brazo despidiéndose, reverencia sutil

2. **Variaciones de Idle** (para más naturalidad)
   - `IDLE_VARIATION_LOOK_AROUND` - Mira alrededor
   - `IDLE_VARIATION_STRETCH` - Estiramiento
   - `IDLE_VARIATION_WEIGHT_SHIFT` - Cambio de peso entre piernas
   - `IDLE_VARIATION_HEAD_TILT` - Ladea la cabeza

3. **AnimationMachine Actualizada**
   - 7 nuevos estados: EXCITED, CONFUSED, GOODBYE, IDLE_LOOK_AROUND, IDLE_STRETCH, IDLE_WEIGHT_SHIFT, IDLE_HEAD_TILT
   - Prioridades configuradas (idle variations = 1, emociones = 3-5)
   - Transiciones permitidas actualizadas
   - Nuevos eventos de animación

4. **useRobotAnimations Actualizado**
   - Nuevos métodos: startExcited(), startConfused(), startGoodbye()
   - Variaciones idle: startIdleLookAround(), startIdleStretch(), startIdleWeightShift(), startIdleHeadTilt()
   - Funciones de aplicación para cada nueva animación

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
