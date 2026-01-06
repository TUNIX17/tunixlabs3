# TunixLabs - Setup Guide

## Requisitos Previos

- Node.js 18+ instalado
- Python 3.8+ (ya configurado via .venv compartido)
- Git
- Railway CLI (opcional, para despliegue)

---

## Quick Start

### 1. Instalar Dependencias Node.js
```bash
cd /home/tunix/Escritorio/Tunixlabsweb
npm install
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus API keys
```

### 3. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

### 4. Abrir en el Navegador
```
http://localhost:3000/inicio
```

---

## Sistema RAG (Raggy)

### Activar Entorno Virtual
El proyecto usa un .venv compartido. Para activar manualmente:
```bash
source /home/tunix/Escritorio/SchwagerDigital/.venv/bin/activate
```

### Comandos RAG
```bash
# Buscar en la documentacion
.venv/bin/python raggy.py search "robot 3d" --expand --hybrid

# Reconstruir indice (despues de agregar docs)
.venv/bin/python raggy.py rebuild

# Ver estado del sistema
.venv/bin/python raggy.py status
```

---

## Sistema Agile

### Ejecutar Planificacion Agile
```bash
# Desde Claude Code, ejecutar:
/agile ./docs/PRD.md
```

Esto generara:
- Epics con especificaciones UI/UX
- Tareas con TDD specs
- Plan de sprints
- Sistema de validacion

---

## Railway Deployment

### Instalar Railway CLI
```bash
npm i -g @railway/cli
railway login
```

### Crear Proyecto Railway
```bash
railway init
```

### Configurar Variables de Entorno
```bash
railway vars set ELEVENLABS_API_KEY=your_key
railway vars set DATABASE_URL=your_postgres_url
```

### Desplegar
```bash
railway up
```

### Ver Logs
```bash
railway logs
```

---

## Estructura del Proyecto

```
Tunixlabsweb/
├── .claude/                 # Configuracion Claude Code
│   └── commands/
│       └── agile.md         # Comando /agile
├── docs/                    # Documentacion
│   ├── DEVELOPMENT_STATE.md # Estado actual
│   ├── ARCHITECTURE.md      # Arquitectura
│   └── SETUP.md             # Esta guia
├── src/                     # Codigo fuente
│   ├── app/                 # Pages (App Router)
│   ├── components/          # Componentes React
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilidades
│   ├── styles/              # Estilos
│   ├── types/               # TypeScript types
│   └── utils/               # Helpers
├── public/                  # Assets estaticos
├── vectordb/                # Base de datos RAG
├── .venv -> ...             # Symlink al venv compartido
├── CLAUDE.md                # Configuracion Claude
├── raggy.py                 # Sistema RAG
├── raggy_config.yaml        # Config RAG
└── package.json             # Dependencias Node
```

---

## Comandos Utiles

### Desarrollo
```bash
npm run dev         # Servidor desarrollo
npm run build       # Build produccion
npm run start       # Iniciar build
npm run lint        # Verificar codigo
```

### RAG
```bash
.venv/bin/python raggy.py search "query"          # Buscar
.venv/bin/python raggy.py search "query" --expand # Buscar con expansion
.venv/bin/python raggy.py rebuild                 # Reconstruir
.venv/bin/python raggy.py status                  # Estado
```

### Git
```bash
git status          # Ver cambios
git add .           # Agregar cambios
git commit -m ""    # Commit
git push            # Push a GitHub
```

---

## Notas Importantes

### .venv Compartido
- **NO crear un nuevo .venv**
- El symlink apunta a: `/home/tunix/Escritorio/SchwagerDigital/.venv`
- Ya tiene chromadb, sentence-transformers y otras dependencias

### Railway vs Vercel
- El proyecto estaba configurado para Vercel
- Ahora se despliega en Railway para:
  - PostgreSQL integrado
  - Variables de entorno mas simples
  - Mejor control del backend

### ElevenLabs
- Requiere API key para funcionar
- Costo: ~$5/mes para uso basico
- Alternativa gratuita: Web Speech API (menor calidad)

---

## Troubleshooting

### Error: "Module not found"
```bash
npm install
```

### Error: "Database not found" (RAG)
```bash
.venv/bin/python raggy.py rebuild
```

### Error: "ELEVENLABS_API_KEY not set"
```bash
# Crear .env.local con la API key
echo "ELEVENLABS_API_KEY=your_key" >> .env.local
```

### Puerto 3000 en uso
```bash
# Matar proceso en puerto 3000
kill $(lsof -t -i:3000)
# O usar otro puerto
npm run dev -- -p 3001
```
