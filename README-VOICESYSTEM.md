# Sistema de Interacción por Voz para Robot Asistente AI

Este documento describe el sistema de interacción por voz implementado para el robot 3D en la aplicación web. El sistema permite a los usuarios interactuar con el robot mediante comandos de voz, obteniendo respuestas tanto auditivas como visuales.

## Características Principales

- **Reconocimiento de voz multilingual**: Detecta automáticamente el idioma hablado por el usuario (vía API Groq STT `whisper-large-v3` con `verbose_json`).
- **Respuestas LLM en idioma detectado**: El LLM (`llama-3.1-8b-instant`) adapta su idioma de respuesta.
- **Texto a Voz (TTS) con Web Speech API**: Se utiliza la API `window.speechSynthesis` del navegador para la generación de voz. Intenta seleccionar una voz masculina y aplica ajustes de tono (`pitch`) y velocidad (`rate`) para un efecto robótico. Es una alternativa gratuita y funcional al TTS de Groq.
- **TTS de Groq (playai-tts) - PROBLEMA PERSISTENTE**: La generación de voz con Groq TTS (`playai-tts`) sigue devolviendo un buffer vacío para inglés y **NO SE UTILIZA** activamente.
- **Animaciones sincronizadas**: El robot se anima en respuesta a las interacciones.
- **Interacción simplificada por voz**: Se eliminó el modal. Interacción directa mediante botón flotante de micrófono.
- **Visualización de audio**: Muestra visualmente las ondas de voz durante la grabación (usando `AudioVisualizer` autónomo).
- **Seguridad de API Key**: La clave API de Groq (`GROQ_API_KEY`) se gestiona correctamente en el backend.

## Arquitectura del Sistema

El sistema está compuesto por los siguientes módulos:

### 1. Capa de Interfaz de Usuario (UI Layer)
- **`RobotInteractionManager`**: Componente contenedor (en `src/app/inicio/components/RobotModel.tsx`) que gestiona el estado de la interacción, renderiza el robot 3D y los componentes de UI.
- **`FloatingMicButton`**: Botón flotante (FAB) para iniciar/detener la interacción por voz.
- **`AudioVisualizer`**: Se muestra condicionalmente durante la grabación.
- **~~`InteractionModal`~~**: Eliminado.
- **~~`VoiceController`~~**: Eliminado (su funcionalidad se integró o eliminó).

### 2. Capa de Lógica de Negocio (Business Logic Layer - Hooks)
- **`useRobotInteraction`**: Hook principal que coordina todo el flujo, estados, animaciones y comunicación. Ahora integra la lógica de Web Speech API para TTS.
- **`useAudioRecording`**: Hook para la grabación de audio.
- **`useSpeechRecognition`**: Hook para el reconocimiento de voz (STT) usando `SpeechRecognitionService`. Detecta idioma usando la respuesta `verbose_json` de Groq STT o fallback local.
- **`useGroqConversation`**: Hook para la comunicación con la API de Groq (LLM). La funcionalidad TTS de Groq ha sido reemplazada por una implementación de Web Speech API dentro de este hook. La llamada a Groq TTS se mantiene comentada como fallback opcional (actualmente roto).

### 3. Capa de Servicios (Service Layer)
- **`AudioRecorder`**: (Asumido dentro de `useAudioRecording`) Clase para gestionar la grabación de audio del navegador.
- **`AudioPlayer`**: Clase para gestionar la reproducción de respuestas de voz. Su uso para TTS ha sido reemplazado por Web Speech API, pero se mantiene por si se necesita para otros tipos de audio.
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
    - `generateResponseAndSpeech` llama a `textToSpeech(responseText, language, callbacks)`. 
        - `useGroqConversation` ahora utiliza `window.speechSynthesis` (Web Speech API) para generar y reproducir la voz.
        - Los `callbacks` pasados desde `useRobotInteraction` gestionan el inicio/fin de la locución y los errores.
        - La llamada al proxy de Groq para TTS está desactivada/comentada debido a fallos persistentes.
6.  **Respuesta del Robot**: 
    - Se actualiza la respuesta del robot en la UI.
    - La Web Speech API reproduce el audio directamente.
    - El estado cambia a `SPEAKING` (manejado por el callback `onStart` de la Web Speech API).
    - El robot se anima mientras habla (`startWaving`).
    - Al terminar el audio, el estado cambia a `IDLE` (manejado por el callback `onEnd` de la Web Speech API).
    - El robot regresa a su posición (`stepBackward`).

## Modelos de IA Utilizados

El sistema utiliza varios modelos de IA de Groq:

-   **Conversación**: `llama-3.1-8b-instant` (estándar), accedido vía endpoint de backend seguro.
-   **Voz a texto (STT)**: `whisper-large-v3` (con `response_format=verbose_json` para detección de idioma), accedido vía endpoint de backend seguro (`/api/transcribe-audio`).
-   **Texto a voz (TTS)**: 
    - **Principalmente `window.speechSynthesis` (Web Speech API)**: Se utiliza como la solución TTS por defecto, integrada en el frontend. Busca voces masculinas e intenta un efecto robótico.
    - **Groq `playai-tts` (NO USADO)**: (voces en inglés como `Calum-PlayAI`, `Fritz-PlayAI`). **Actualmente NO FUNCIONA** - La API de Groq devuelve un buffer de audio vacío. Su lógica está comentada en el código.

## Gestión de Límites de API

El sistema implementa estrategias para gestionar los límites de la API de Groq:

- **Seguridad de API Key**: La clave API se maneja exclusivamente en los endpoints del backend (`/api/groq-proxy`, `/api/transcribe-audio`), nunca se expone al cliente.
- **Backend como Guardián**: Los endpoints del backend son los principales responsables de interactuar con Groq y pueden manejar errores 429 (Too Many Requests).
- **Propagación de `retry-after`**: Los endpoints del backend están configurados para reenviar la cabecera `retry-after` al cliente cuando Groq devuelve un error 429.
- **`useRateLimiter` (Cliente)**: Hook simplificado en el cliente que escucha la señal `signalRateLimitHit` (activada cuando se recibe un `retry-after` del backend) para actualizar un estado de espera (`waitTime`) y prevenir envíos inmediatos.
- **Selección Dinámica de Modelos**: `useGroqConversation` aún puede usar `selectModelConfig` para ajustar parámetros como `maxResponseTokens` y `temperature` según el tráfico estimado (aunque la estimación de tráfico es ahora menos directa).
- **Fallback Local STT**: `SpeechRecognitionService` puede usar Web Speech API si la llamada al backend de transcripción falla, aumentando la resiliencia (pero con menor precisión y soporte de idiomas).
- **TTS**: 
    - **Web Speech API**: La compatibilidad de idiomas y voces depende del navegador y sistema operativo del usuario. Se intenta seleccionar una voz para el idioma detectado (priorizando voces masculinas).
    - **Groq `playai-tts` (NO USADO)**: Limitado a INGLÉS y actualmente ROTO.

Los idiomas listados previamente (francés, alemán, etc.) funcionarían en STT y LLM. Para TTS con Web Speech API, dependerá de las voces instaladas en el sistema del usuario para esos idiomas.

## Estado del Proyecto

### Implementado
- ✅ Estructura general del sistema (Frontend + Backend API Routes)
- ✅ **Seguridad de API Key (Backend)**: Corregido problema con `NEXT_PUBLIC_`.
- ✅ **Flujo STT->LLM**: Optimizado y funcionando.
- ✅ **Detección de Idioma STT**: Funcionando (usando `verbose_json`).
- ✅ **Respuesta LLM adaptada al idioma**: Funcionando.
- ✅ **Nueva UI SIN Modal**: Botón flotante controla inicio/fin de grabación.
- ✅ Grabación de audio (infraestructura base).
- ✅ Reconocimiento de voz (API Groq STT).
- ✅ Integración con API Groq LLM (vía backend seguro).
- ✅ **TTS con Web Speech API**: Implementado como solución principal. Intenta voz masculina con efecto robótico.
- ✅ Control básico de límites de API (basado en `retry-after` del backend para Groq).
- ✅ Animaciones básicas del robot sincronizadas con Web Speech API.
- ✅ Visualizador de audio durante grabación.

### Problemas Actuales / Pendiente
- ❗ **TTS de Groq ROTO**: La API de Groq (`playai-tts`) sigue devolviendo audio vacío. Se ha implementado Web Speech API como solución funcional.
- ⚠️ **Calidad y Disponibilidad de Voces Web Speech API**: La calidad de la voz y la disponibilidad de voces masculinas/robóticas pueden variar significativamente entre navegadores y sistemas operativos. Los ajustes de `pitch` y `rate` son un intento de estandarización, pero el resultado final puede variar.
- ⚠️ **Posible reproducción de voz de usuario**: Investigar si `AudioVisualizer` (al tomar control independiente del micrófono) causa que el usuario escuche su propia voz. Si es así, refactorizar manejo de audio o modificar `AudioVisualizer`.
- ⏳ Pruebas exhaustivas (funcionales, de errores, de límites).
- ⏳ Mejorar feedback de errores y estados de espera en la UI.
- ⏳ Mejora de las animaciones del robot y transiciones de estado.
- ⏳ Persistencia de conversaciones (opcional).
- ⏳ Configuración personalizada de parámetros (ej. selección de voz TTS si se implementa alternativa).
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
- El reconocimiento de voz funciona mejor en ambientes con poco ruido.
- STT y LLM requieren conexión a internet para conectar a los endpoints de backend.
- **TTS actualmente no funciona (ver Estado del Proyecto)**.
- La detección de idioma tiene una precisión variable.
- El sistema se adapta a distintos dispositivos, incluyendo móviles (asegurar que el FAB y el Modal sean responsivos).

## Créditos

- Desarrollado para Tunixlabs
- Utiliza la API de Groq para IA
- Desarrollado con React y TypeScript
- Basado en Next.js 