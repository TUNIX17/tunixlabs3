# TunixLabs - Development State

**Last Updated:** 2025-01-05
**Current Phase:** Initial Setup
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
- [x] Raggy RAG system configured
- [x] Agile command configured
- [x] Initial documentation structure

### In Progress
- [ ] npm dependencies installation
- [ ] Railway deployment configuration
- [ ] Voice system integration (ElevenLabs)
- [ ] 3D Avatar enhancement

### Pending
- [ ] PRD document creation
- [ ] Sprint 1 planning
- [ ] Testing setup (Jest + Playwright)
- [ ] CI/CD pipeline

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
**Decision:** Copiar raggy.py y adaptar configuracion
**Rationale:**
- Sistema probado en EnglishAI
- Soporta busquedas bilingues
- Integrado con Claude Code workflow

### 3. Railway Deployment
**Decision:** Frontend y Backend en Railway
**Rationale:**
- Integracion con PostgreSQL managed
- Deploys automaticos desde GitHub
- Variables de entorno seguras

---

## TECH STACK

```yaml
Frontend:
  Framework: Next.js 13+ (App Router)
  Language: TypeScript
  Styling: Tailwind CSS
  3D: React Three Fiber + Drei

Backend:
  API: Next.js API Routes / Express
  Database: PostgreSQL (Railway)

Services:
  Voice: ElevenLabs API
  Avatar: Ready Player Me
  Hosting: Railway
  Domain: tunixlabs.com
```

---

## ENVIRONMENT VARIABLES

Required for development:
```bash
# Voice System
ELEVENLABS_API_KEY=

# Future: Database
DATABASE_URL=

# Future: Auth
AUTH_SECRET=
```

---

## NEXT STEPS

1. **Immediate:**
   - Run `npm install` to install dependencies
   - Create `.env.local` with required variables
   - Test development server with `npm run dev`

2. **Short-term:**
   - Create PRD document for voice system
   - Run `/agile` to generate sprint plan
   - Set up Railway project

3. **Medium-term:**
   - Implement voice integration
   - Enhance 3D avatar interactions
   - Add authentication to treasury

---

## BLOCKERS

- [ ] Need ElevenLabs API key for voice testing
- [ ] Railway project needs to be created
- [ ] Domain DNS configuration pending

---

## NOTES

- El .venv compartido ya tiene las dependencias de Raggy instaladas
- Usar `.venv/bin/python raggy.py` para comandos RAG
- Railway deployment se configura via CLI o dashboard
