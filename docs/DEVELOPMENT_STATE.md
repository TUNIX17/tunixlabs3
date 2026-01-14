# TunixLabs - Development State

**Last Updated:** 2026-01-14
**Current Phase:** VAD Animation Bug Fix
**Sprint:** 3.1 - Robot Animation Stability

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
- [x] **CRM & Lead Management System** (2026-01-08)
  - [x] PostgreSQL database (Railway) with Prisma ORM
  - [x] Lead, Message, Activity models
  - [x] API endpoints: CRUD, capture, export CSV
  - [x] Email notifications with Resend
  - [x] Calendly webhook integration
  - [x] Admin dashboard with authentication
  - [x] Voice agent lead persistence
- [x] **Email Sequences & Lead Nurturing** (2026-01-09)
  - [x] 3-email nurturing sequence (welcome, case-study, offer)
  - [x] Railway Cron endpoint (/api/cron/email-sequences)
  - [x] Email templates with professional HTML design
  - [x] Case study selection based on lead interests
  - [x] Unsubscribe functionality
- [x] **Enhanced Lead Scoring** (2026-01-09)
  - [x] Engagement factors: turn count, session duration
  - [x] Multiple interests/painPoints bonus
  - [x] Business hours bonus
  - [x] Session duration tracking in voice agent
- [x] **Dashboard Analytics** (2026-01-09)
  - [x] Recharts integration (open source)
  - [x] Status pie chart (leads by status)
  - [x] Leads line chart (daily trends)
  - [x] Score bar chart (score distribution)
  - [x] Analytics API (/api/leads/analytics)
- [x] **VAD-Animation Bug Fix** (2026-01-14)
  - [x] Fixed erratic robot animations when microphone activates
  - [x] Added animation cooldown mechanism (800ms between animations)
  - [x] Added VAD speech transition protection (500ms debounce)
  - [x] Increased VAD volumeThreshold from 0.08 to 0.12 (reduces false positives)
  - [x] Increased speechStartDelay from 250ms to 350ms
  - [x] Increased minSpeechDuration from 500ms to 600ms
  - [x] Files modified:
    - `src/hooks/useRobotInteraction.ts` - Animation cooldown + transition protection
    - `src/lib/audio/vadConfig.ts` - More conservative VAD settings

### In Progress
- [ ] Configurar variables de entorno en Railway:
  - [ ] RESEND_API_KEY
  - [ ] CRON_SECRET (para secuencias de email)
  - [ ] CALENDLY_LINK
  - [ ] CALENDLY_WEBHOOK_SECRET
  - [ ] ADMIN_PASSWORD
  - [ ] NEXT_PUBLIC_ADMIN_PASSWORD

### Pending
- [ ] Testing del sistema completo en producción
- [ ] Conectar dominio tunixlabs.com
- [ ] Testing setup (Jest + Playwright)
- [ ] CI/CD pipeline

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

### 7. CRM & Lead Management System (2026-01-08)
**Decision:** Sistema CRM propio con persistencia PostgreSQL
**Rationale:**
- Capturar y gestionar leads del voice agent
- Notificaciones en tiempo real por email
- Integración con Calendly para agendar reuniones
- Dashboard simple para gestión interna
**Stack:**
```
Database:    PostgreSQL (Railway) + Prisma ORM
Email:       Resend (transaccional)
Calendar:    Calendly webhooks
Auth:        Password simple (sessionStorage)
```
**Data Flow:**
```
Voice Agent → /api/leads/capture → PostgreSQL → Email Notification
                                            ↓
                          Admin Dashboard (/admin/leads)
                                            ↓
              Calendly Webhook → Update Lead → Email Notification
```
**Lead Scoring Algorithm:**
- name: +15 pts, company: +15 pts, email: +20 pts
- phone: +10 pts, role: +5 pts
- Each interest: +10 pts (max 3)
- Each painPoint: +10 pts (max 3)
- budget/timeline/companySize: +5 pts each

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
  Database: PostgreSQL (Railway) + Prisma 5.22.0
  ORM: Prisma
  Proxies:
    - /api/cerebras-proxy   # LLM (Cerebras)
    - /api/groq-proxy       # Legacy/fallback
    - /api/transcribe-audio # STT (Groq Whisper)
    - /api/leads/*          # CRM CRUD
    - /api/webhooks/*       # External webhooks

AI Services:
  LLM: Cerebras Llama 3.3 70B (FREE - 1M tokens/día)
  STT: Groq Whisper Large V3 ($0.04/hora)
  TTS: Web Speech API (FREE - navegador)

CRM Services:
  Email: Resend (transaccional)
  Calendar: Calendly (webhooks)
  Auth: Password simple (sessionStorage)

Infrastructure:
  Avatar: Ready Player Me
  Hosting: Railway
  Database: Railway PostgreSQL
  Domain: tunixlabs.com (pendiente DNS)
```

---

## ENVIRONMENT VARIABLES

### Configuradas (Railway auto)
- RAILWAY_ENVIRONMENT
- RAILWAY_PUBLIC_DOMAIN
- PORT (auto)

### Configuradas (PostgreSQL Railway)
```bash
# Database - PostgreSQL (Railway)
DATABASE_URL=postgresql://postgres:***@shortline.proxy.rlwy.net:44455/railway
```

### Pendientes de configurar en Railway
```bash
# LLM - Cerebras (REQUERIDO para conversación)
# Get key at: https://cloud.cerebras.ai/
CEREBRAS_API_KEY=

# STT - Groq Whisper (REQUERIDO para transcripción)
# Get key at: https://console.groq.com/
GROQ_API_KEY=

# Email Notifications - Resend (para notificar nuevos leads)
# Get key at: https://resend.com/
RESEND_API_KEY=
NOTIFICATION_EMAIL=contacto@tunixlabs.com

# Calendly Integration (para agendar reuniones)
CALENDLY_LINK=https://calendly.com/tunixlabs/discovery
CALENDLY_WEBHOOK_SECRET=

# Admin Dashboard Auth
ADMIN_PASSWORD=tu_password_seguro
NEXT_PUBLIC_ADMIN_PASSWORD=tu_password_seguro  # Para client-side
```

Para configurar: `railway variables --set VARIABLE_NAME=value`

---

## NEXT STEPS

1. **Immediate:**
   - Configurar RESEND_API_KEY en Railway (crear cuenta en resend.com)
   - Configurar ADMIN_PASSWORD para acceder al CRM
   - Configurar CALENDLY_LINK con tu link de Calendly
   - Deploy a Railway con `railway up`

2. **Short-term:**
   - Conectar dominio tunixlabs.com
   - Testing E2E: voz → captura → email → calendario
   - Probar CRM en /admin

3. **Medium-term:**
   - Treasury system for Curso 7i
   - Testing setup (Jest + Playwright)
   - CI/CD pipeline

---

## BLOCKERS

- [x] ~~Railway project needs to be created~~ ✅ Completado
- [x] ~~Need PostgreSQL database~~ ✅ Railway PostgreSQL conectado
- [ ] Need RESEND_API_KEY for email notifications
- [ ] Need CALENDLY_LINK for meeting scheduling
- [ ] Domain DNS configuration pending

---

## RECENT CHANGES (2026-01-09) - Email Sequences & Analytics

### Mejoras Implementadas (Costo $0)

1. **Email Sequences - Lead Nurturing Automatico**
   - Secuencia de 3 emails: Bienvenida → Caso de Exito → Oferta Llamada
   - Tiempos: Inmediato → 24h → 48h
   - Templates HTML profesionales con branding TunixLabs
   - Seleccion inteligente de caso de exito segun intereses del lead
   - Funcion de unsubscribe

2. **Railway Cron Job**
   - Endpoint: `/api/cron/email-sequences`
   - Configurar en Railway: `0 * * * * curl -H "Authorization: Bearer $CRON_SECRET" https://tunixlabs.com/api/cron/email-sequences`
   - Autorizacion con CRON_SECRET
   - Procesa leads pendientes cada hora

3. **Lead Scoring Mejorado**
   - Engagement: turnCount >=5 (+5), >=10 (+5)
   - Duracion sesion: >=2min (+5), >=5min (+5)
   - Multiples intereses: +5 bonus
   - Multiples painPoints: +5 bonus
   - Horario laboral (9-18h Chile): +3

4. **Dashboard con Graficos (Recharts)**
   - StatusPieChart: Distribucion de leads por estado
   - LeadsLineChart: Tendencia de leads ultimos 30 dias
   - ScoreBarChart: Distribucion de scores (0-25, 26-50, 51-75, 76-100)
   - API Analytics: `/api/leads/analytics`

### Files Created
```
src/lib/email/templates/welcome.tsx      - Template email bienvenida
src/lib/email/templates/case-study.tsx   - Template caso de exito
src/lib/email/templates/offer-call.tsx   - Template oferta llamada
src/lib/email/sequences.ts               - Servicio de secuencias
src/app/api/cron/email-sequences/route.ts - Endpoint cron
src/app/api/leads/analytics/route.ts     - API analytics
src/components/admin/charts/StatusPieChart.tsx
src/components/admin/charts/LeadsLineChart.tsx
src/components/admin/charts/ScoreBarChart.tsx
src/components/admin/charts/index.ts
```

### Files Modified
```
prisma/schema.prisma                     - +lastEmailSent, +lastEmailSentAt, +emailSequenceActive, +sessionDurationSeconds
src/app/api/leads/capture/route.ts       - Lead scoring mejorado
src/app/admin/page.tsx                   - Integracion graficos
src/hooks/useRobotInteraction.ts         - Captura sessionDurationSeconds
package.json                             - +recharts
```

### Environment Variables Nuevas
```bash
CRON_SECRET=<generar con: openssl rand -base64 32>
```

### Configurar Railway Cron
En Railway → Settings → Cron Jobs:
```
0 * * * *  curl -H "Authorization: Bearer $CRON_SECRET" https://tunixlabs.com/api/cron/email-sequences
```

---

## RECENT CHANGES (2026-01-08) - CRM & Lead Management

### Sistema CRM Completo Implementado

1. **Base de Datos PostgreSQL + Prisma**
   - Prisma 5.22.0 (downgraded de 7.x por incompatibilidades)
   - Modelos: Lead, Message, Activity
   - LeadStatus enum: NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST
   - Lead scoring algorithm integrado

2. **API Endpoints**
   ```
   /api/leads           GET  - Lista con filtros y paginación
   /api/leads           POST - Crear lead manual
   /api/leads/[id]      GET  - Obtener lead por ID
   /api/leads/[id]      PUT  - Actualizar lead
   /api/leads/[id]      DELETE - Eliminar lead
   /api/leads/capture   POST - Captura desde voice agent
   /api/leads/export    GET  - Exportar CSV
   /api/webhooks/calendly POST - Webhook Calendly
   ```

3. **Notificaciones Email (Resend)**
   - `sendLeadNotification()` - Notifica nuevos leads
   - `sendMeetingNotification()` - Notifica reuniones agendadas
   - Templates HTML estilizados

4. **Integración Calendly**
   - Webhook handler para eventos
   - Actualiza lead cuando se agenda reunión
   - Crea lead nuevo si email no existe

5. **Admin Dashboard**
   - `/admin` - Dashboard con stats y leads recientes
   - `/admin/leads` - Lista con filtros y paginación
   - `/admin/leads/[id]` - Detalle completo con edición
   - Autenticación por password (sessionStorage)
   - Sidebar con navegación

6. **Voice Agent → Lead Persistence**
   - `RobotModel.tsx` modificado con onLeadCaptured callback
   - Guarda leads automáticamente durante conversación
   - Lead scoring basado en datos capturados

### Files Created
```
prisma/schema.prisma                      - Database schema
src/lib/prisma.ts                         - Prisma client singleton
src/lib/email/resend.ts                   - Email service
src/app/api/leads/route.ts                - CRUD endpoints
src/app/api/leads/[id]/route.ts           - Individual lead endpoints
src/app/api/leads/capture/route.ts        - Voice capture endpoint
src/app/api/leads/export/route.ts         - CSV export
src/app/api/webhooks/calendly/route.ts    - Calendly webhook
src/app/admin/layout.tsx                  - Admin layout + auth
src/app/admin/page.tsx                    - Dashboard
src/app/admin/leads/page.tsx              - Leads list
src/app/admin/leads/[id]/page.tsx         - Lead detail
```

### Files Modified
```
package.json                              - +prisma, +resend, +@react-email/render
.env.example                              - +CRM variables
src/app/inicio/components/RobotModel.tsx  - +onLeadCaptured callback
```

### Dependencies Added
```json
{
  "@prisma/client": "5.22.0",
  "resend": "^4.x",
  "@react-email/render": "^1.x"
}
```

---

## PREVIOUS CHANGES (2026-01-08) - Voice Agent

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

## RECENT CHANGES (2026-01-14) - Animation System Fix

### Problema Resuelto
Robot presentaba movimientos bruscos e incoherentes al iniciar conversación, especialmente en brazos. Causado por múltiples animaciones que modificaban los mismos huesos simultáneamente sin coordinación.

### Fase 1: Corrección Inmediata (RobotModel.tsx)
1. **Guard Conditions Expandidas**
   - `hasActiveShoulderAnimation`: incluye wave, approach, stepBack, dance, thinking, excited, confused, goodbye
   - `hasActiveHeadAnimation`: incluye thinking, nodding, confused, goodbye, excited
   - `hasActiveLegAnimation`: incluye dance, shakeLegs, approach, stepBack

2. **Factor idleIntensity**
   - Reduce animaciones idle al 15% durante LISTENING
   - Aplicado a: respiración, body sway, shoulder idle, elbow idle, leg sway

3. **Bloqueo de Animaciones Conflictivas**
   - Arm resting solo se aplica si `!hasActiveShoulderAnimation`
   - Leg resting solo se aplica si `!hasActiveLegAnimation`

### Fase 2: Estabilización (rotationPresets.ts)
1. **ANIMATION_CONFIGS Optimizados**
   - `idle.lerpFactor`: 0.05 → 0.08 (transiciones más rápidas)
   - `wave`: duración reducida, intensidad reducida
   - `nodYes`: duración 1200→1000ms, amplitude 0.35→0.25
   - `thinking.lerpFactor`: 0.06 → 0.10 (entrada más rápida)
   - Todas las oscilaciones reducidas para menos brusquedad

2. **IDLE_PARAMS Reducidos**
   - `breath`: frequency 0.7→0.5, amplitudes reducidas ~20%
   - `bodySway`: frequencies y amplitudes reducidas ~25%
   - `shoulderIdle`: amplitudes reducidas ~40%
   - `elbowIdle`: amplitude 0.02→0.012
   - `legSway`: amplitudes reducidas ~40%

3. **LISTENING_PARAMS Minimizados**
   - `headTilt`: frequency 0.3→0.2, amplitude 0.005→0.003
   - `neckTilt`: frequency 0.25→0.15, amplitude 0.003→0.002
   - Casi imperceptibles para evitar conflictos con cursor tracking

### Files Modified
```
src/app/inicio/components/RobotModel.tsx
- Guard conditions expandidas
- Factor idleIntensity para listening
- Bloqueo condicional de arm/leg resting

src/lib/animation/rotationPresets.ts
- ANIMATION_CONFIGS optimizados
- IDLE_PARAMS reducidos
- LISTENING_PARAMS minimizados
```

### TODAS LAS FASES REVERTIDAS (2026-01-14)

**Estado: REVERTIDO A VERSIÓN ORIGINAL (commit a678bb3)**

Todas las modificaciones de animación fueron revertidas porque:
1. Las "mejoras" introducían comportamientos inesperados al presionar el micrófono
2. El `idleIntensity` causaba saltos en la animación al cambiar de estado
3. Los guard conditions expandidos bloqueaban animaciones que deberían seguir corriendo
4. Los LISTENING_PARAMS modificados (de 0.05 a 0.003) cambiaban el comportamiento esperado

**Decisión de Arquitectura:**
- El código original (a678bb3) es estable y funciona correctamente
- Los intentos de "mejorar" las animaciones introdujeron regresiones
- Keep It Simple: el sistema de animación directo con bone refs funciona bien

**Valores restaurados de LISTENING_PARAMS:**
```typescript
headTilt: { frequency: 1.5, amplitude: 0.05 }
neckTilt: { frequency: 1.5, amplitude: 0.03 }
```

### Verificación
- ✅ Build exitoso
- ✅ Código restaurado a versión funcional
- ✅ Listo para testing

---

## NOTES

- El .venv compartido ya tiene las dependencias de Raggy instaladas
- Usar `.venv/bin/python scripts/raggy.py` para comandos RAG
- Railway hace deploy automático al push a main
- Para deploy manual: `railway up --detach`
