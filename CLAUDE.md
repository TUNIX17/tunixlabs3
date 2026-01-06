# MODO AUTONOMO (AUTOPILOT)

Si estas ejecutando en **modo autonomo** (detectado por el prompt que contiene "CRITICO: Modo Autonomo"):

1. **El contexto RAG ya esta incluido** en el prompt - No ejecutes queries adicionales
2. **NO hagas preguntas** - Toma decisiones basandote en este archivo
3. **NO ejecutes `raggy.py rebuild`** - El orquestador lo hara al final del sprint
4. **SI actualiza** `./docs/DEVELOPMENT_STATE.md` al final de la task
5. **SI sigue** todas las convenciones de codigo de este archivo
6. **SI usa mocks** para tests que requieran APIs externas
7. **El commit se hara automaticamente** - No necesitas hacer git commit

Si NO estas en modo autonomo, sigue el protocolo completo abajo.

---

# STOP! MANDATORY PRE-TASK PROTOCOL

## YOU MUST COMPLETE THIS CHECKLIST BEFORE ANY CODE/TASK:

```
MANDATORY INITIALIZATION SEQUENCE:
===============================================
[ ] Step 1: READ ./docs/DEVELOPMENT_STATE.md
[ ] Step 2: EXECUTE ALL 4 RAG QUERIES:
  [ ] .venv/bin/python raggy.py search "[user's task keywords]" --expand
  [ ] .venv/bin/python raggy.py search "architecture patterns" --hybrid
  [ ] .venv/bin/python raggy.py search "coding standards"
  [ ] .venv/bin/python raggy.py search "[relevant tech]" --expand --hybrid
[ ] Step 3: STATE: "I have completed RAG context gathering"
===============================================

IF YOU SKIP THIS = TASK WILL FAIL = USER WILL BE UNHAPPY
```

## ENFORCEMENT RULES:

1. **BEFORE writing ANY code**: You MUST show the 4 RAG query results
2. **BEFORE modifying ANY file**: You MUST query RAG for that component
3. **BEFORE making decisions**: You MUST cite RAG search results
4. **IF you haven't run RAG**: STOP and run it immediately

## QUICK REFERENCE - CORRECT RAG COMMANDS:
```bash
# NOTA: RAG es opcional. Si raggy.py no existe, continua sin el.
# En modo autonomo (autopilot), NO ejecutes estos comandos.

# Comandos RAG (solo si esta configurado):
.venv/bin/python raggy.py search "term" --expand        # Domain terms
.venv/bin/python raggy.py search "term" --hybrid        # Technical search
.venv/bin/python raggy.py search "term" --expand --hybrid  # Best results
.venv/bin/python raggy.py rebuild                       # After adding docs
.venv/bin/python raggy.py status                        # Check index
```

---

# MANDATORY: Knowledge-Driven Development Workflow

You are a senior development partner for the TunixLabs Platform. For EVERY task, you MUST follow this exact workflow:

## PHASE 1: CONTEXT GATHERING (MANDATORY)
Before starting ANY development work, you MUST:

1. **Read Development State**:
   - ALWAYS read `./docs/DEVELOPMENT_STATE.md` first to understand:
     - What was accomplished in the previous task
     - Current project status and active features
     - Next planned steps and priorities
     - Any blockers or decisions pending

2. **Query Project Knowledge**:
   - Run: `.venv/bin/python raggy.py search "[current task/feature keywords]" --expand`
   - Run: `.venv/bin/python raggy.py search "architecture patterns" --hybrid`
   - Run: `.venv/bin/python raggy.py search "coding standards"`
   - Run: `.venv/bin/python raggy.py search "[relevant tech stack/framework]" --expand --hybrid`

   **RAG Search Recommendations:**
   - Use `--expand` for domain terms (robot, dashboard, tesoreria, servicios)
   - Use `--hybrid` for technical searches (combines semantic + keyword)
   - Use `--expand --hybrid` for best results on complex queries
   - System supports bilingual Spanish/English searches

3. **Synthesize Context**:
   - Combine user request + development state + RAG knowledge
   - Identify gaps in understanding before proceeding
   - In interactive mode: Ask clarifying questions if context is incomplete
   - In autonomous mode: Make reasonable decisions and document them

## PHASE 2: DEVELOPMENT APPROACH (MANDATORY)
Think step-by-step using this pattern:

1. **Problem Analysis**:
   - Break down the task into specific technical requirements
   - Identify dependencies and potential conflicts
   - Consider how this fits into the overall system architecture

2. **Design Decisions**:
   - Justify architectural choices based on existing patterns
   - Consider alternatives and explain trade-offs
   - Ensure consistency with established code patterns

3. **Implementation Plan**:
   - Create concrete steps with clear success criteria
   - Identify testing approach and validation methods (TDD FIRST!)
   - Plan for error handling and edge cases

## PHASE 3: EXECUTION WITH VERIFICATION
During development:
1. **Follow Established Patterns**: Use existing code patterns from RAG knowledge
2. **TDD Approach**: Write tests BEFORE implementation
3. **Progressive Validation**: Test each step before moving to the next
4. **Self-Review**: After each significant change, ask yourself:
   - Does this align with the project architecture?
   - Am I following the established coding standards?
   - Have I handled error cases appropriately?
   - Is this solution maintainable and extensible?

## PHASE 4: DOCUMENTATION (MANDATORY)
After EVERY task completion, you MUST:

1. **Update Development State**:
   Update `./docs/DEVELOPMENT_STATE.md` with:
   - **COMPLETED**: Detailed description of what was implemented
   - **DECISIONS**: All architectural and technical decisions made
   - **CHANGES**: Files modified, new dependencies, configuration changes
   - **TESTING**: What was tested and validation results
   - **NEXT STEPS**: Immediate follow-up tasks and long-term considerations
   - **BLOCKERS**: Any issues discovered or decisions needed

2. **Log to RAG Database** (skip in autonomous mode):
   Create `./docs/dev_log_[timestamp].md` with:
   - Technical decisions and rationale
   - Code patterns used and why
   - Integration points and dependencies
   - Performance considerations
   - Security implications

3. **Rebuild RAG** (skip in autonomous mode):
   Run: `.venv/bin/python raggy.py rebuild`
   Note: In autonomous mode, RAG rebuild will be done manually after sprint completion.

---

## CRITICAL SUCCESS BEHAVIORS:

- ALWAYS start with `./docs/DEVELOPMENT_STATE.md` - NO EXCEPTIONS
- ALWAYS query RAG for relevant context before coding
- NEVER make architectural decisions without understanding existing patterns
- ALWAYS document decisions immediately, not later
- ALWAYS think step-by-step and show your reasoning
- ALWAYS validate your work against existing standards
- ALWAYS update both `./docs/DEVELOPMENT_STATE.md` and create dev logs
- ALWAYS use TDD - write tests FIRST

## FAILURE CONDITIONS:
- Starting development without reading `./docs/DEVELOPMENT_STATE.md`
- Making changes without querying relevant RAG context
- Completing tasks without proper documentation updates
- Ignoring established patterns or architectural decisions
- Skipping the knowledge update cycle
- Writing code without tests

---

# PROJECT CONTEXT: TunixLabs Platform

## Product Vision
**Plataforma web de consultoria en IA con interfaz interactiva:**
- **Sitio Web Principal:** Presentacion de servicios de consultoria IA
- **Robot Interactivo:** Avatar 3D con sistema de voz (Ready Player Me + ElevenLabs)
- **Sistema de Tesoreria:** Panel administrativo para Curso 7i
- **Despliegue:** Frontend y Backend en Railway

## Stack Tecnologico
```yaml
Frontend (Next.js 13+):
  - Framework: Next.js 13+ App Router + TypeScript
  - Estado: React hooks / Zustand (si es necesario)
  - Validacion: Zod (runtime validation recomendado)
  - UI: Tailwind CSS + componentes personalizados
  - 3D Avatar: React Three Fiber + Drei + Ready Player Me
  - Voice: ElevenLabs API para TTS

Backend (Railway):
  - API: Express/Next.js API Routes
  - Base de datos: PostgreSQL (Railway)
  - Auth: Sistema personalizado (preparado para Auth.js)

AI Services:
  - TTS: ElevenLabs API
  - Avatar: Ready Player Me GLB models
  - Futuro: OpenAI GPT para conversaciones

Infrastructure (Railway):
  - Frontend: Next.js service
  - Backend: API service
  - Database: PostgreSQL managed
  - Dominio: tunixlabs.com (BanaHosting)
```

## Critical Requirements

### NON-NEGOTIABLE STANDARDS:
1. **TypeScript Strict Mode** - No `any` types, all props must be typed
2. **Error Handling** - Every API call MUST have try-catch with user feedback
3. **Runtime Validation** - Use Zod for all external data (API responses, webhooks)
4. **Testing** - Generate Jest unit tests + Playwright E2E tests after each phase
5. **Environment Variables** - Document ALL required vars in `.env.example`
6. **Code Comments** - Add JSDoc comments for all functions/components
7. **Git Commits** - Commit after each logical unit with descriptive messages
8. **Performance Budget** - LCP <2.5s, FID <100ms, CLS <0.1

### Target Metrics:
- Avatar voice latency: <2s total
- Page load: <3s on 4G
- Test coverage: >80%

## Key Features to Implement

### Site Flow:
- Homepage with AI consulting services
- Interactive 3D robot/avatar
- Voice interaction system
- Contact and demo requests

### Admin Flow:
- Treasury system for Curso 7i
- Transaction management
- User authentication
- Dashboard and reports

---

## Comandos del Proyecto

```bash
# RAG Knowledge Base (usar .venv/bin/python, NO python3)
.venv/bin/python raggy.py search "query" --expand --hybrid  # Search docs
.venv/bin/python raggy.py rebuild                           # Rebuild index
.venv/bin/python raggy.py status                            # Check status

# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # ESLint

# Railway Deployment
railway up            # Deploy to Railway
railway logs          # View logs
```

---

## NAMING CONVENTIONS (OBLIGATORIO)

### Estructura de Archivos y Carpetas
```
src/
├── app/                          # App Router pages (kebab-case)
│   ├── inicio/                   # Homepage
│   ├── servicios/                # Service pages
│   │   └── [service]/            # Individual services
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # React components (PascalCase)
│   ├── ui/                       # UI primitives
│   ├── VoiceInterface/           # Voice components
│   ├── Robot3D.tsx               # 3D Avatar component
│   ├── Navbar.tsx
│   └── Footer.tsx
├── hooks/                        # Custom hooks (camelCase con use prefix)
│   └── useVoice.ts
├── lib/                          # Utilities and services
│   ├── api/                      # API clients
│   └── elevenlabs/               # Voice service
├── styles/                       # Global styles
│   └── globals.css
├── types/                        # TypeScript types (PascalCase)
│   └── index.ts
└── utils/                        # Helper functions
```

### Convenciones de Nombres

| Elemento | Convencion | Ejemplo |
|----------|------------|---------|
| **Archivos React** | PascalCase.tsx | `Robot3D.tsx`, `Navbar.tsx` |
| **Archivos hooks** | camelCase con `use` prefix | `useVoice.ts` |
| **Archivos utils** | camelCase.ts | `formatDate.ts` |
| **Archivos tests** | [nombre].test.ts(x) | `Robot3D.test.tsx` |
| **Archivos types** | PascalCase o index.ts | `User.ts`, `index.ts` |
| **Carpetas routes** | kebab-case | `servicios/`, `inicio/` |
| **Variables/funciones** | camelCase | `getUserById`, `isLoading` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| **Interfaces/Types** | PascalCase | `UserProfile`, `Transaction` |
| **Environment vars** | UPPER_SNAKE_CASE | `DATABASE_URL`, `ELEVENLABS_API_KEY` |
| **API endpoints** | kebab-case | `/api/voice/speak`, `/api/transactions` |

### Reglas Estrictas

1. **NO usar `I` prefix para interfaces** - TypeScript convention moderna
   ```typescript
   // MAL
   interface IUser { ... }

   // BIEN
   interface User { ... }
   type UserProps = { ... }
   ```

2. **Archivos un solo export = nombre del export**
   ```typescript
   // Robot3D.tsx exports Robot3D component
   // useVoice.ts exports useVoice hook
   ```

3. **Index files para re-exports**
   ```typescript
   // components/index.ts
   export { Robot3D } from './Robot3D';
   export { Navbar } from './Navbar';
   ```

---

## RAILWAY DEPLOYMENT

### Variables de Entorno Necesarias
```bash
# API Keys
ELEVENLABS_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here  # Futuro

# Database
DATABASE_URL=postgresql://...

# App Config
NEXT_PUBLIC_APP_URL=https://tunixlabs.com
NODE_ENV=production
```

### Railway Config
El proyecto debe tener configurado `railway.json` o usar el UI de Railway para:
- Build command: `npm run build`
- Start command: `npm run start`
- Root directory: `/`

---

## VIRTUAL ENVIRONMENT (IMPORTANTE)

Este proyecto usa el .venv compartido ubicado en:
```
/home/tunix/Escritorio/SchwagerDigital/.venv
```

Para activar manualmente:
```bash
source /home/tunix/Escritorio/SchwagerDigital/.venv/bin/activate
```

El symlink `.venv` en el proyecto apunta a esta ubicacion.
**NO crear un nuevo entorno virtual.**

---

## RECORDATORIO FINAL:

Este archivo es tu contrato con el proyecto. Seguir estas reglas garantiza:
- Codigo consistente y mantenible
- Desarrollo sin fricciones
- Contexto preservado entre sesiones
- Calidad garantizada
- TDD desde el inicio

**Documentacion adicional en:** `./docs/`
