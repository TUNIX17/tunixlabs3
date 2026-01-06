# TunixLabs

Portfolio profesional de consultoria en Inteligencia Artificial con robot 3D interactivo.

## Caracteristicas

- **Robot 3D Interactivo**: Avatar animado con sistema de voz integrado
- **Sistema de Voz**: Grabacion → Transcripcion (Groq) → LLM → Sintesis de voz
- **9 Paginas de Servicios**: Consultoria IA, ML, RPA, Vision Artificial, etc.
- **Diseno Responsive**: Optimizado para mobile, tablet y desktop

## Tecnologias

- **Next.js 13+** - Framework React con App Router
- **React Three Fiber** - Renderizado 3D con Three.js
- **Groq API** - LLM y transcripcion de audio
- **Tailwind CSS** - Estilos utilitarios
- **TypeScript** - Tipado estatico

## Instalacion

```bash
# Clonar repositorio
git clone https://github.com/TUNIX17/tunixlabs3.git
cd tunixlabs3

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu GROQ_API_KEY

# Iniciar servidor de desarrollo
npm run dev
```

## Estructura

```
src/
├── app/                    # Pages (App Router)
│   ├── inicio/             # Landing page con robot
│   ├── servicios/          # 9 paginas de servicios
│   └── api/                # API routes (groq-proxy, transcribe)
├── components/
│   ├── VoiceInterface/     # Sistema de voz
│   └── Navbar, Footer
├── hooks/                  # useRobotInteraction, useGroqConversation
├── lib/                    # Audio, Groq client, Language detection
└── types/                  # TypeScript types
```

## Variables de Entorno

```bash
GROQ_API_KEY=gsk_...        # Requerida para voz
NEXT_PUBLIC_APP_URL=...     # URL de la aplicacion
```

## Comandos

```bash
npm run dev      # Desarrollo
npm run build    # Build produccion
npm run start    # Iniciar produccion
npm run lint     # Verificar codigo
```

## Despliegue

Configurado para Railway:
```bash
railway login
railway up
```

## Contacto

- Web: [tunixlabs.com](https://tunixlabs.com)
- Email: contacto@tunixlabs.com

---

Desarrollado por TunixLabs
