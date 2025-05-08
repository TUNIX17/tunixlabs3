# Sistema de Interacción por Voz para Robot Asistente AI

Este documento describe el sistema de interacción por voz implementado para el robot 3D en la aplicación web. El sistema permite a los usuarios interactuar con el robot mediante comandos de voz, obteniendo respuestas tanto auditivas como visuales.

## Características Principales

- **Reconocimiento de voz multilingual**: Detecta automáticamente el idioma hablado por el usuario (vía API Groq o fallback local).
- **Respuestas en el mismo idioma**: El robot responde en el idioma detectado.
- **Animaciones sincronizadas**: El robot se anima en respuesta a las interacciones.
- **Interacción por voz o texto**: Posible mediante botón flotante de micrófono o entrada de texto dentro de un modal.
- **Visualización de audio**: Muestra visualmente las ondas de voz durante la grabación.
- **Selección manual de idioma**: Permite cambiar manualmente el idioma de interacción.
- **Seguridad de API Key**: La clave API de Groq se gestiona en el backend para mayor seguridad.

## Arquitectura del Sistema

El sistema está compuesto por los siguientes módulos:

### 1. Capa de Interfaz de Usuario (UI Layer)
- **`RobotInteractionManager`**: Componente contenedor (en `src/app/inicio/components/RobotModel.tsx`) que gestiona el estado de la interacción, renderiza el robot 3D y los componentes de UI.
- **`FloatingMicButton`**: Botón flotante (FAB) para iniciar/detener la interacción por voz y abrir el modal.
- **`InteractionModal`**: Ventana modal que contiene el `VoiceController`.
- **`VoiceController`**: Panel principal de interacción dentro del modal. Integra:
    - **`AudioVisualizer`**: Visualización en tiempo real de las ondas de audio.
    - **`LanguageIndicator`**: Selector de idioma con detección automática.
    - **`ControlButtons`**: Controles para iniciar/detener grabación y reproducción (complementarios al FAB).
    - **Área de Conversación**: Muestra mensajes de usuario y robot.
    - **Entrada de Texto**: Para interacción escrita.

### 2. Capa de Lógica de Negocio (Business Logic Layer - Hooks)
- **`useRobotInteraction`**: Hook principal que coordina todo el flujo de interacción, estados, animaciones y comunicación entre hooks.
- **`useAudioRecording`**: Hook para la grabación de audio del usuario.
- **`useSpeechRecognition`**: Hook para el reconocimiento de voz (STT) y detección de idioma, utilizando `SpeechRecognitionService`.
- **`useGroqConversation`**: Hook para la comunicación con la API de Groq (LLM y TTS) a través de los endpoints de backend.
- **`useRateLimiter`**: Hook simplificado para gestionar el estado de espera basado en la cabecera `retry-after` del backend.

### 3. Capa de Servicios (Service Layer)
- **`AudioRecorder`**: (Asumido dentro de `useAudioRecording`) Clase para gestionar la grabación de audio del navegador.
- **`AudioPlayer`**: Clase para gestionar la reproducción de respuestas de voz.
- **`SpeechRecognitionService`**: Servicio que realiza la transcripción llamando al endpoint `/api/transcribe-audio` (Groq STT) o usando Web Speech API como fallback.
- **`LanguageDetector`**: Servicio para detectar idiomas en textos si la API STT no lo proporciona.
- **`Translator`**: Servicio de traducción para mensajes del sistema/UI.

### 4. Capa de API (Backend - Next.js API Routes)
- **`/api/groq-proxy/route.ts`**: Endpoint de backend seguro que actúa como proxy para las llamadas a la API de Groq (Chat Completions, TTS). Gestiona la `GROQ_API_KEY` en el servidor.
- **`/api/transcribe-audio/route.ts`**: Endpoint de backend dedicado y seguro para manejar la subida de archivos de audio (`multipart/form-data`) y realizar la transcripción (STT) a través de la API de Groq, usando la `GROQ_API_KEY` del servidor.

## Flujo de Funcionamiento (Interacción por Voz)

1.  **Inicio**: El usuario ve el `FloatingMicButton`.
2.  **Clic en Micrófono**: 
    - El usuario hace clic en el `FloatingMicButton`.
    - Se abre el `InteractionModal`.
    - `useRobotInteraction` llama a `startListening()`.
    - El estado cambia a `LISTENING`.
    - El robot se anima (`approachCamera`).
    - Se inicia la grabación de audio (`useAudioRecording`).
    - El `AudioVisualizer` se muestra.
    - El `FloatingMicButton` cambia a icono de "Stop".
3.  **Grabación y Detención**: 
    - El usuario habla.
    - El usuario hace clic de nuevo en el `FloatingMicButton` (o en un botón de detener dentro del modal).
    - `useRobotInteraction` llama a `stopListening()`.
    - Se detiene la grabación (`useAudioRecording`), obteniendo un `audioBlob`.
4.  **Procesamiento STT**: 
    - El estado cambia a `PROCESSING`.
    - El robot se anima (`nodYes`).
    - `stopListening` llama a `recognizeSpeech(audioBlob)` de `useSpeechRecognition`.
    - `SpeechRecognitionService.recognizeAudio` envía el `audioBlob` al endpoint `/api/transcribe-audio`.
    - El backend `/api/transcribe-audio` llama a Groq STT de forma segura.
    - Se obtiene el texto transcrito y el idioma detectado.
    - Se actualiza el mensaje del usuario en la UI.
5.  **Generación de Respuesta (LLM + TTS)**:
    - `stopListening` llama a `generateResponseAndSpeech(text, language)` de `useGroqConversation`.
    - `generateResponseAndSpeech` llama a `sendMessage(text, language)`.
        - `useGroqConversation` envía la petición al proxy `/api/groq-proxy`.
        - El proxy llama a Groq Chat Completions de forma segura.
        - Se recibe la respuesta de texto del LLM.
    - `generateResponseAndSpeech` llama a `textToSpeech(responseText, language)`.
        - `useGroqConversation` envía la petición al proxy `/api/groq-proxy`.
        - El proxy llama a Groq TTS de forma segura.
        - Se recibe el `Blob` de audio de la respuesta.
6.  **Respuesta del Robot**: 
    - Se actualiza la respuesta del robot en la UI.
    - Si se generó audio, `AudioPlayer.loadFromBlob()` y luego `AudioPlayer.play()` lo reproducen.
    - El estado cambia a `SPEAKING` (manejado por `AudioPlayer.onPlay`).
    - El robot se anima mientras habla (`startWaving`).
    - Al terminar el audio, el estado cambia a `IDLE` (manejado por `AudioPlayer.onEnded`).
    - El robot regresa a su posición (`stepBackward`).

## Modelos de IA Utilizados

El sistema utiliza varios modelos de IA de Groq:

-   **Conversación**: `llama-3.1-8b-instant` (estándar), `llama-3.3-70b-versatile` (alta calidad). El `initialSystemPrompt` está adaptado para Tunixlabs.
-   **Voz a texto**: `whisper-large-v3-turbo` (rápido), `whisper-large-v3` (preciso), accedidos vía endpoint de backend seguro.
-   **Texto a voz**: `playai-tts` (múltiples idiomas), accedido vía endpoint de backend seguro.

## Gestión de Límites de API

El sistema implementa estrategias para gestionar los límites de la API de Groq:

- **Seguridad de API Key**: La clave API se maneja exclusivamente en los endpoints del backend (`/api/groq-proxy`, `/api/transcribe-audio`), nunca se expone al cliente.
- **Backend como Guardián**: Los endpoints del backend son los principales responsables de interactuar con Groq y pueden manejar errores 429 (Too Many Requests).
- **Propagación de `retry-after`**: Los endpoints del backend están configurados para reenviar la cabecera `retry-after` al cliente cuando Groq devuelve un error 429.
- **`useRateLimiter` (Cliente)**: Hook simplificado en el cliente que escucha la señal `signalRateLimitHit` (activada cuando se recibe un `retry-after` del backend) para actualizar un estado de espera (`waitTime`) y prevenir envíos inmediatos.
- **Selección Dinámica de Modelos**: `useGroqConversation` aún puede usar `selectModelConfig` para ajustar parámetros como `maxResponseTokens` y `temperature` según el tráfico estimado (aunque la estimación de tráfico es ahora menos directa).
- **Fallback Local STT**: `SpeechRecognitionService` puede usar Web Speech API si la llamada al backend de transcripción falla, aumentando la resiliencia (pero con menor precisión y soporte de idiomas).

## Idiomas Soportados

El sistema soporta detección y respuesta en los siguientes idiomas:

- Español (es)
- Inglés (en)
- Francés (fr)
- Alemán (de)
- Italiano (it)
- Portugués (pt)
- Árabe (ar)
- Chino (zh)
- Japonés (ja)
- Coreano (ko)
- Ruso (ru)
- Holandés (nl)
- Polaco (pl)
- Turco (tr)

## Estado del Proyecto

### Implementado
- ✅ Estructura general del sistema (Frontend + Backend API Routes)
- ✅ **Seguridad de API Key (Backend)**
- ✅ **Flujo STT->LLM->TTS optimizado (sin doble transcripción)**
- ✅ **Nueva UI con Botón Flotante y Modal de Interacción**
- ✅ Grabación y reproducción de audio
- ✅ Reconocimiento de voz (API Groq + Fallback local)
- ✅ Detección de idiomas
- ✅ Integración con API Groq (vía backend seguro)
- ✅ Control de límites de API (basado en `retry-after`)
- ✅ Animaciones básicas del robot
- ✅ Interfaz de usuario (`VoiceController` dentro de modal)

### Pendiente
- ⏳ **Pruebas exhaustivas** (funcionales, de errores, de límites)
- ⏳ Revisión y posible refactorización de `useAudioRecording.ts`.
- ⏳ Resolver error persistente del linter en `useGroqConversation.ts`.
- ⏳ Mejorar feedback de errores y estados de espera en la UI.
- ⏳ Mejora de las animaciones del robot y transiciones de estado.
- ⏳ Persistencia de conversaciones (opcional).
- ⏳ Configuración personalizada de parámetros (ej. selección de voz TTS).
- ⏳ Optimización del rendimiento general.
- ⏳ Mejora de accesibilidad (A11y).

## Instalación y Configuración

1. Asegúrate de tener las dependencias instaladas:
   ```bash
   npm install
   ```

2. Crea un archivo llamado `.env.local` en la raíz del proyecto y configura tu API key de Groq **para el servidor**:
   Dentro de `.env.local`, añade la siguiente línea, reemplazando `TU_API_KEY_AQUI` con tu clave real:
   ```
   GROQ_API_KEY=TU_API_KEY_AQUI
   ```
   **Importante**: **NO uses** el prefijo `NEXT_PUBLIC_`. Esta clave solo debe ser accesible por el servidor. El archivo `.env.local` ya está incluido en el `.gitignore`, por lo que tu clave no se subirá al repositorio.

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Integración con el Robot 3D

El componente principal ahora es `RobotInteractionManager` (exportado desde `src/app/inicio/components/RobotModel.tsx`). Este componente renderiza el `Canvas` con el `AnimatedRobotModel` y también maneja la lógica de interacción (`useRobotInteraction`) y la UI asociada (`FloatingMicButton`, `InteractionModal` que contiene `VoiceController`). La referencia al modelo animado (`robotAnimatedRef`) se pasa tanto al hook de interacción como al `VoiceController` para sincronizar animaciones y lógica.

## Consideraciones Técnicas

- El sistema requiere permisos de micrófono en el navegador.
- El reconocimiento de voz (especialmente el fallback local) funciona mejor en ambientes con poco ruido.
- Todas las funciones principales (STT, LLM, TTS) requieren conexión a internet para conectar a los endpoints de backend.
- La detección de idioma tiene una precisión variable.
- El sistema se adapta a distintos dispositivos, incluyendo móviles (asegurar que el FAB y el Modal sean responsivos).

## Créditos

- Desarrollado para Tunixlabs
- Utiliza la API de Groq para IA
- Desarrollado con React y TypeScript
- Basado en Next.js 