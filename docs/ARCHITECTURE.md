# TunixLabs - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Browser   │  │   Mobile    │  │      Tablet         │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼───────────────────┬┼─────────────┘
          │                │                   ││
          └────────────────┼───────────────────┘│
                           │                    │
┌──────────────────────────┼────────────────────┼─────────────┐
│                     FRONTEND (Next.js)        │             │
│  ┌───────────────────────┴────────────────────┴──────────┐  │
│  │                    App Router                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │  │
│  │  │ /inicio  │  │ /servicios/* │  │ /contacto         │ │  │
│  │  │ Homepage │  │ Services     │  │ Contact           │ │  │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Components                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │  │
│  │  │ Robot3D  │  │  Navbar  │  │ TransactionTable     │ │  │
│  │  │ (R3F)    │  │  Footer  │  │ TransactionForm      │ │  │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────┐
│                     API LAYER                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 Next.js API Routes                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ /api/voice   │  │ /api/trans   │  │ /api/auth   │  │  │
│  │  │   speak      │  │   actions    │  │             │  │  │
│  │  └───────┬──────┘  └───────┬──────┘  └─────────────┘  │  │
│  └──────────┼─────────────────┼──────────────────────────┘  │
└─────────────┼─────────────────┼─────────────────────────────┘
              │                 │
┌─────────────┼─────────────────┼─────────────────────────────┐
│         EXTERNAL SERVICES     │                              │
│  ┌──────────┴──────┐  ┌───────┴──────┐                      │
│  │   ElevenLabs   │  │  PostgreSQL  │                       │
│  │   (Voice TTS)  │  │  (Railway)   │                       │
│  └─────────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 3D Robot System
```
Robot3D/
├── Scene Setup
│   ├── Canvas (R3F)
│   ├── Lighting
│   └── Camera Controls
├── Avatar
│   ├── GLB Model (Ready Player Me)
│   ├── Animations
│   └── Expressions
└── Voice Integration
    ├── Audio Player
    ├── Lip Sync (future)
    └── ElevenLabs API
```

### Voice System
```
Voice/
├── Recording (useAudioRecording)
├── Recognition (Groq Whisper)
├── Conversation (Groq LLM)
└── Synthesis (Web Speech API)
```

## Data Flow

### Voice Interaction Flow
```
1. User clicks "Speak" button
2. Text is sent to /api/voice/speak
3. API calls ElevenLabs TTS
4. Audio stream is returned
5. Browser plays audio
6. (Future) Avatar animates mouth
```

### Transaction Flow
```
1. Admin logs in
2. Fills transaction form
3. Form validates with Zod
4. POST to /api/transactions
5. Data saved to PostgreSQL
6. UI updates with new data
```

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── inicio/             # Homepage
│   ├── servicios/          # Service pages
│   │   └── [service]/      # Individual services
│   ├── api/                # API routes
│   │   ├── voice/          # Voice endpoints
│   │   └── transactions/   # Treasury endpoints
│   ├── layout.tsx
│   └── page.tsx
├── components/             # React components
│   ├── ui/                 # Base UI components
│   ├── VoiceInterface/     # Voice components
│   ├── Robot3D.tsx         # 3D Avatar
│   ├── Navbar.tsx
│   └── Footer.tsx
├── hooks/                  # Custom React hooks
│   ├── useVoice.ts
│   └── useAuth.ts
├── lib/                    # Utilities & services
│   ├── api/                # API clients
│   ├── elevenlabs/         # Voice service
│   └── db/                 # Database client
├── styles/                 # Global styles
├── types/                  # TypeScript types
└── utils/                  # Helper functions
```

## Technology Decisions

| Category | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 13+ | App Router, API Routes, SSR |
| 3D | React Three Fiber | React integration, performance |
| Styling | Tailwind CSS | Utility-first, responsive |
| Voice | ElevenLabs | High-quality TTS, Spanish support |
| Database | PostgreSQL | Railway integration, reliability |
| Hosting | Railway | Easy deployment, managed services |

## Security Considerations

1. **API Keys**: Store in environment variables, never in client code
2. **Authentication**: Implement proper session management
3. **CORS**: Configure for production domain
4. **Input Validation**: Use Zod for all external data
5. **Rate Limiting**: Protect voice API from abuse
