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
- [ ] 3D Avatar enhancement
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

## RECENT CHANGES (2026-01-06)

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
