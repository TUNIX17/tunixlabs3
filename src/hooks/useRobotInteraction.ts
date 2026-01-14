import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioRecording } from './useAudioRecording';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useGroqConversation } from './useGroqConversation';
import { useVAD } from './useVAD';
import { Translator } from '../lib/language/translator';
import { AudioPlayer } from '../lib/audio/player';
import { ConversationSession, DEFAULT_SESSION_CONFIG } from '../lib/conversation';
import { AgentStateTracker, ConversationPhase, getAgentPromptCache } from '../lib/agent';
import { BARGEIN_VAD_CONFIG } from '../lib/audio/vadConfig';

// Mapeo de nombres de idioma a códigos ISO para normalizar detección de STT
const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  'spanish': 'es',
  'español': 'es',
  'english': 'en',
  'inglés': 'en',
  'french': 'fr',
  'français': 'fr',
  'german': 'de',
  'deutsch': 'de',
  'portuguese': 'pt',
  'português': 'pt',
  'italian': 'it',
  'italiano': 'it',
};

// Idiomas soportados por el sistema
const SUPPORTED_LANGUAGES = ['es', 'en'];

/**
 * Normaliza el código de idioma a formato ISO (es, en)
 * SOLO acepta español e inglés - otros idiomas retornan null
 */
const normalizeLanguageCode = (lang: string): string | null => {
  if (!lang) return 'es'; // Default a español

  const langLower = lang.toLowerCase().trim();

  // Si es un nombre de idioma conocido, convertir a código
  if (LANGUAGE_NAME_TO_CODE[langLower]) {
    return LANGUAGE_NAME_TO_CODE[langLower];
  }

  // Si ya es un código ISO (ej: es-ES, en-US), extraer la base
  let langCode = langLower;
  if (langLower.includes('-')) {
    langCode = langLower.split('-')[0];
  }

  // Solo aceptar idiomas soportados (es, en)
  if (SUPPORTED_LANGUAGES.includes(langCode)) {
    return langCode;
  }

  // Idioma no soportado - retornar null para ignorarlo
  return null;
};

// Interfaz para las animaciones del robot
interface RobotAnimations {
  startWaving: () => void;
  approachCamera: () => void;
  stepBackward: () => void;
  danceMove: () => void;
  nodYes: () => void;
  shakeLegsTwist: () => void;
  startThinking: () => void;
  stopThinking: () => void;
  // Animaciones adicionales para más expresividad
  startExcited: () => void;
  startConfused: () => void;
  startGoodbye: () => void;
}

// Utilidad para seleccionar animación aleatoria con pesos
const weightedRandomChoice = <T>(choices: { item: T; weight: number }[]): T => {
  const totalWeight = choices.reduce((sum, c) => sum + c.weight, 0);
  let random = Math.random() * totalWeight;
  for (const choice of choices) {
    random -= choice.weight;
    if (random <= 0) return choice.item;
  }
  return choices[0].item;
};

// Estados de interaccion con el robot - ACTUALIZADO
export enum RobotInteractionState {
  IDLE = 'idle',                        // No en conversacion
  LISTENING = 'listening',              // VAD activo, esperando voz
  LISTENING_ACTIVE = 'listening_active', // Usuario hablando, grabando
  PROCESSING = 'processing',            // Procesando STT/LLM
  SPEAKING = 'speaking',                // Robot hablando (TTS)
  ERROR = 'error'
}

// Configuracion de conversacion continua
export interface ContinuousConversationConfig {
  /** Habilitar conversacion continua (hands-free) */
  enabled: boolean;
  /** Auto-restart listening despues de que robot habla */
  autoRestartListening: boolean;
  /** Timeout de idle para terminar sesion (ms) */
  idleTimeoutMs: number;
  /** Timeout de listening sin voz (ms) */
  listenTimeoutMs: number;
  /** Habilitar barge-in (interrumpir al robot) */
  bargeInEnabled: boolean;
  /** Tiempo minimo hablando antes de permitir barge-in (ms) */
  minSpeakingTimeBeforeBargeIn: number;
}

// Configuracion por defecto
const DEFAULT_CONTINUOUS_CONFIG: ContinuousConversationConfig = {
  enabled: true,
  autoRestartListening: true,
  idleTimeoutMs: 60000,
  listenTimeoutMs: 30000,
  bargeInEnabled: true,
  minSpeakingTimeBeforeBargeIn: 1000
};

// Opciones para el hook
interface UseRobotInteractionOptions {
  initialLanguage?: string;
  robotSystemPrompt?: string;
  onStateChange?: (state: RobotInteractionState) => void;
  onError?: (error: Error) => void;
  onSessionEnd?: () => void;
  onLeadCaptured?: (leadData: any) => void;
  continuousConfig?: Partial<ContinuousConversationConfig>;
}

export const useRobotInteraction = ({
  initialLanguage = 'es',
  robotSystemPrompt,
  onStateChange,
  onError,
  onSessionEnd,
  onLeadCaptured,
  continuousConfig = {}
}: UseRobotInteractionOptions = {}) => {
  // Merge config
  const config: ContinuousConversationConfig = {
    ...DEFAULT_CONTINUOUS_CONFIG,
    ...continuousConfig
  };

  // Estado principal de interaccion
  const [interactionState, setInteractionState] = useState<RobotInteractionState>(RobotInteractionState.IDLE);

  // Idioma actual
  const [currentLanguage, setCurrentLanguage] = useState<string>(initialLanguage);

  // Estado de la conversacion
  const [userMessage, setUserMessage] = useState<string>('');
  const [robotResponse, setRobotResponse] = useState<string>('');

  // Estado de sesion continua
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<ConversationPhase>(ConversationPhase.GREETING);

  // Referencia a las funciones de animacion del robot
  const robotRef = useRef<RobotAnimations | null>(null);

  // Servicio de traduccion
  const translatorRef = useRef<Translator>(new Translator(initialLanguage));

  // Reproductor de audio
  const audioPlayerRef = useRef<AudioPlayer | null>(null);

  // Session manager para timeouts y control de sesion
  const sessionRef = useRef<ConversationSession | null>(null);

  // Agent state tracker para fases de conversacion
  const agentStateRef = useRef<AgentStateTracker | null>(null);

  // Timestamp de inicio de speaking (para barge-in)
  const speakingStartTimeRef = useRef<number | null>(null);

  // Flag para controlar auto-restart
  const shouldAutoRestartRef = useRef<boolean>(true);

  // Flag para trackear si la grabación se inició exitosamente
  const recordingStartedRef = useRef<boolean>(false);

  // Ref para trackear el último estado notificado (evita notificaciones duplicadas)
  const lastNotifiedStateRef = useRef<RobotInteractionState>(RobotInteractionState.IDLE);

  // Ref para debounce de animaciones - previene llamadas rápidas consecutivas
  const lastAnimationTimeRef = useRef<number>(0);
  const ANIMATION_COOLDOWN_MS = 800; // Cooldown mínimo entre animaciones

  // Ref para debounce de transiciones de estado VAD - previene ciclos rápidos
  const lastSpeechTransitionRef = useRef<number>(0);
  const SPEECH_TRANSITION_COOLDOWN_MS = 500; // Cooldown mínimo entre transiciones speech_start/speech_end

  // Función helper para ejecutar animación con cooldown
  const executeAnimationWithCooldown = useCallback((
    animationFn: () => void,
    animationName: string,
    forceCooldown: boolean = true
  ) => {
    const now = Date.now();
    const timeSinceLastAnimation = now - lastAnimationTimeRef.current;

    if (forceCooldown && timeSinceLastAnimation < ANIMATION_COOLDOWN_MS) {
      console.log(`[RobotInteraction] Animación ${animationName} bloqueada - cooldown (${timeSinceLastAnimation}ms < ${ANIMATION_COOLDOWN_MS}ms)`);
      return false;
    }

    lastAnimationTimeRef.current = now;
    animationFn();
    console.log(`[RobotInteraction] Animación ${animationName} ejecutada`);
    return true;
  }, []);

  // Obtener prompt cache
  const promptCache = getAgentPromptCache();

  // Obtener system prompt (comercial o custom)
  const getSystemPrompt = useCallback(() => {
    if (robotSystemPrompt) {
      return robotSystemPrompt;
    }
    // Usar prompt comercial con contexto
    if (agentStateRef.current) {
      const context = agentStateRef.current.getContextForPrompt();
      return promptCache.getFullPrompt(currentLanguage, context);
    }
    return promptCache.getBasePrompt(currentLanguage);
  }, [robotSystemPrompt, currentLanguage, promptCache]);

  // Hook para grabacion de audio
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecording({
    maxDurationMs: 30000,
    onError: (error) => {
      console.error('Error en grabacion:', error);
      setInteractionState(RobotInteractionState.ERROR);
      if (onError) onError(error);
    }
  });

  // Hook para reconocimiento de voz
  // IMPORTANTE: Usar el idioma configurado del usuario, NO detectar automáticamente
  // Esto evita que el bot cambie a inglés si el STT detecta erróneamente el idioma
  const {
    recognizeSpeech,
    detectedLanguage
  } = useSpeechRecognition({
    preferredLanguage: currentLanguage, // Forzar el idioma configurado del usuario
    onLanguageDetected: (language) => {
      // NO cambiar automáticamente el idioma basado en STT
      // El idioma solo debe cambiarse explícitamente por el usuario
      console.log('[RobotInteraction] STT detectó idioma:', language, '- Manteniendo idioma configurado:', currentLanguage);
    },
    onError: (error) => {
      console.error('Error en reconocimiento de voz:', error);
      setInteractionState(RobotInteractionState.ERROR);
      if (onError) onError(error);
    }
  });

  // Hook para VAD (Voice Activity Detection)
  const {
    isListening: vadIsListening,
    isSpeaking: vadIsSpeaking,
    currentVolume,
    startVAD,
    stopVAD,
    setThreshold,
    updateConfig: updateVADConfig
  } = useVAD({
    preset: 'default',
    onSpeechStart: () => {
      console.log('[RobotInteraction] VAD: Speech detectado, estado actual:', interactionState);

      // Protección contra transiciones rápidas - evita ciclos por ruido
      const now = Date.now();
      const timeSinceLastTransition = now - lastSpeechTransitionRef.current;
      if (timeSinceLastTransition < SPEECH_TRANSITION_COOLDOWN_MS) {
        console.log(`[RobotInteraction] Transición onSpeechStart bloqueada - cooldown (${timeSinceLastTransition}ms < ${SPEECH_TRANSITION_COOLDOWN_MS}ms)`);
        return;
      }
      lastSpeechTransitionRef.current = now;

      // Si estamos en SPEAKING y barge-in esta habilitado
      if (interactionState === RobotInteractionState.SPEAKING && config.bargeInEnabled) {
        if (canBargeIn()) {
          handleBargeIn();
          return;
        }
      }

      // Si estamos en LISTENING, transicionar a LISTENING_ACTIVE
      if (interactionState === RobotInteractionState.LISTENING) {
        console.log('[RobotInteraction] Transicionando a LISTENING_ACTIVE e iniciando grabacion');
        setInteractionState(RobotInteractionState.LISTENING_ACTIVE);
        recordingStartedRef.current = false; // Reset flag

        // NO animar mientras el usuario habla - evita movimientos erráticos
        // El seguimiento del cursor es suficiente para mostrar atención
        // Las animaciones se reservan para cuando el robot responde

        startRecordingForVAD();
      }
    },
    onSpeechEnd: (duration) => {
      console.log('[RobotInteraction] VAD: Speech terminado, duracion:', duration, 'ms, estado:', interactionState, ', recordingStarted:', recordingStartedRef.current, ', isRecording:', isRecording);

      // Protección contra transiciones rápidas - evita ciclos por ruido
      const now = Date.now();
      const timeSinceLastTransition = now - lastSpeechTransitionRef.current;
      if (timeSinceLastTransition < SPEECH_TRANSITION_COOLDOWN_MS) {
        console.log(`[RobotInteraction] Transición onSpeechEnd bloqueada - cooldown (${timeSinceLastTransition}ms < ${SPEECH_TRANSITION_COOLDOWN_MS}ms)`);
        return;
      }
      lastSpeechTransitionRef.current = now;

      // Si estamos en LISTENING_ACTIVE y la grabacion se inicio, procesar el audio
      // Usamos recordingStartedRef porque isRecording puede no estar actualizado aun
      if (interactionState === RobotInteractionState.LISTENING_ACTIVE && (isRecording || recordingStartedRef.current)) {
        console.log('[RobotInteraction] Procesando audio grabado...');
        processRecordedAudio();
      } else if (interactionState === RobotInteractionState.LISTENING_ACTIVE) {
        // Si estamos en LISTENING_ACTIVE pero no hay grabacion, volver a escuchar
        console.warn('[RobotInteraction] LISTENING_ACTIVE pero grabacion no iniciada, volviendo a LISTENING');
        setInteractionState(RobotInteractionState.LISTENING);
      }
    },
    onError: (error) => {
      console.error('[RobotInteraction] VAD error:', error);
      if (onError) onError(error);
    }
  });

  // Hook para conversacion con LLM
  const {
    generateResponseAndSpeech,
    sendMessage: sendGroqMessage,
    updateSystemPrompt
  } = useGroqConversation({
    initialSystemPrompt: getSystemPrompt(),
    // Nota: startThinking() se llama explícitamente en processRecordedAudio()
    // No duplicar aquí para evitar animaciones redundantes
    onComplete: (response) => {
      setRobotResponse(response);
      // Actualizar estado del agente
      if (agentStateRef.current) {
        agentStateRef.current.incrementTurn();
        // Sugerir siguiente fase
        const nextPhase = agentStateRef.current.suggestNextPhase();
        if (nextPhase) {
          agentStateRef.current.updatePhase(nextPhase);
          setCurrentPhase(nextPhase);
        }
      }
    },
    onError: (error) => {
      console.error('Error en conversacion:', error);
      setInteractionState(RobotInteractionState.ERROR);
      if (onError) onError(error);
    }
  });

  // Inicializar reproductor de audio
  useEffect(() => {
    audioPlayerRef.current = new AudioPlayer({
      autoPlay: false,
      onError: (error) => {
        console.error('Error en reproduccion de audio:', error);
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    });

    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.dispose();
      }
    };
  }, [onError]);

  // Inicializar session y agent state cuando se activa conversacion continua
  useEffect(() => {
    if (config.enabled && !sessionRef.current) {
      sessionRef.current = new ConversationSession({
        autoRestartListening: config.autoRestartListening,
        idleTimeoutMs: config.idleTimeoutMs,
        listenTimeoutMs: config.listenTimeoutMs,
        minSpeakingTimeBeforeBargeIn: config.minSpeakingTimeBeforeBargeIn
      });

      sessionRef.current.onEvent((event) => {
        console.log('[RobotInteraction] Session event:', event);
        if (event === 'session_end' || event === 'idle_timeout' || event === 'listen_timeout') {
          handleSessionEnd();
        }
      });
    }

    if (!agentStateRef.current) {
      agentStateRef.current = new AgentStateTracker(currentLanguage);
    }

    return () => {
      sessionRef.current?.dispose();
      sessionRef.current = null;
    };
  }, [config.enabled]);

  // Notificar cambios de estado (solo si realmente cambió)
  useEffect(() => {
    if (onStateChange && interactionState !== lastNotifiedStateRef.current) {
      lastNotifiedStateRef.current = interactionState;
      onStateChange(interactionState);
    }
  }, [interactionState, onStateChange]);

  // Actualizar idioma cuando se detecta uno nuevo (normalizado a código ISO)
  // SOLO acepta español e inglés - otros idiomas se ignoran
  useEffect(() => {
    if (detectedLanguage) {
      const normalizedDetected = normalizeLanguageCode(detectedLanguage);

      // Si el idioma detectado no es soportado (es, en), ignorarlo
      if (!normalizedDetected) {
        console.log('[RobotInteraction] Idioma detectado no soportado:', detectedLanguage, '- Manteniendo:', currentLanguage);
        return;
      }

      const normalizedCurrent = normalizeLanguageCode(currentLanguage) || 'es';

      if (normalizedDetected !== normalizedCurrent) {
        console.log('[RobotInteraction] Actualizando idioma:', currentLanguage, '->', normalizedDetected);
        setCurrentLanguage(normalizedDetected);
        promptCache.invalidate(); // Invalidar cache cuando cambia idioma
      }
    }
  }, [detectedLanguage, currentLanguage, promptCache]);

  // Verificar si se puede hacer barge-in
  const canBargeIn = useCallback((): boolean => {
    if (!config.bargeInEnabled || !speakingStartTimeRef.current) {
      return false;
    }
    const speakingDuration = Date.now() - speakingStartTimeRef.current;
    return speakingDuration >= config.minSpeakingTimeBeforeBargeIn;
  }, [config.bargeInEnabled, config.minSpeakingTimeBeforeBargeIn]);

  // Manejar barge-in (interrupcion del usuario)
  const handleBargeIn = useCallback(() => {
    console.log('[RobotInteraction] Barge-in activado');

    // 1. Cancelar TTS inmediatamente
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // 2. Detener animaciones de hablar
    if (robotRef.current) {
      robotRef.current.stepBackward();
    }

    speakingStartTimeRef.current = null;

    // 3. Transicionar a listening_active (ya detecto voz)
    setInteractionState(RobotInteractionState.LISTENING_ACTIVE);

    // 4. Empezar a grabar la interrupcion
    startRecordingForVAD();

    // Registrar actividad
    sessionRef.current?.recordActivity();
  }, []);

  // Iniciar grabacion cuando VAD detecta voz
  const startRecordingForVAD = useCallback(async () => {
    try {
      console.log('[RobotInteraction] Iniciando grabacion para VAD...');
      resetRecording();
      await startRecording();
      recordingStartedRef.current = true; // Marcar que la grabacion se inicio
      sessionRef.current?.stopListening(); // Detener listen timer
      console.log('[RobotInteraction] Grabacion iniciada exitosamente');
    } catch (error) {
      console.error('[RobotInteraction] Error iniciando grabacion:', error);
      recordingStartedRef.current = false;
      // Volver a LISTENING si falla la grabacion
      setInteractionState(RobotInteractionState.LISTENING);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [startRecording, resetRecording, onError]);

  // Procesar audio grabado cuando VAD detecta silencio
  const processRecordedAudio = useCallback(async () => {
    // Reset flag de grabacion
    recordingStartedRef.current = false;

    try {
      console.log('[RobotInteraction] Deteniendo grabacion...');
      const currentAudioBlob = await stopRecording();

      if (!currentAudioBlob || currentAudioBlob.size === 0) {
        console.warn('[RobotInteraction] Audio blob vacio, tamaño:', currentAudioBlob?.size);
        // Volver a listening si auto-restart
        if (shouldAutoRestartRef.current && sessionRef.current?.shouldAutoRestart()) {
          setInteractionState(RobotInteractionState.LISTENING);
          sessionRef.current?.startListening();
        } else {
          setInteractionState(RobotInteractionState.IDLE);
        }
        return;
      }

      console.log('[RobotInteraction] Audio grabado, tamaño:', currentAudioBlob.size, 'bytes. Procesando...');
      setInteractionState(RobotInteractionState.PROCESSING);
      // Iniciar animación de pensando (thinking) mientras se procesa
      // Usar cooldown para evitar animaciones rápidas consecutivas
      if (robotRef.current) {
        executeAnimationWithCooldown(
          () => robotRef.current?.startThinking(),
          'startThinking'
        );
      }

      // Reconocer speech
      console.log('[RobotInteraction] Enviando audio a STT...');
      const recognitionResult = await recognizeSpeech(currentAudioBlob);
      console.log('[RobotInteraction] STT resultado:', recognitionResult);
      setUserMessage(recognitionResult.text);

      // IMPORTANTE: Usar siempre el idioma configurado del usuario, NO el detectado por STT
      // Esto evita que el bot cambie a inglés cuando Whisper detecta erróneamente el idioma
      const langForThisInteraction = currentLanguage;
      console.log('[RobotInteraction] Usando idioma configurado:', langForThisInteraction,
        '(STT detectó:', recognitionResult.language || 'no detectado', ')');

      if (recognitionResult.text) {
        console.log('[RobotInteraction] Texto reconocido:', recognitionResult.text);
        // Extraer info del lead
        if (agentStateRef.current) {
          const extractedInfo = agentStateRef.current.extractLeadInfo(recognitionResult.text);
          if (Object.keys(extractedInfo).length > 0) {
            agentStateRef.current.updateLeadData(extractedInfo);
            const leadData = agentStateRef.current.getLeadData();
            const context = agentStateRef.current.getContext();

            // Calcular duracion de sesion en segundos
            const sessionDurationSeconds = sessionRef.current
              ? Math.floor(sessionRef.current.getSessionDuration() / 1000)
              : Math.floor((Date.now() - context.sessionStartTime) / 1000);

            // Incluir metricas de sesion en los datos del lead
            onLeadCaptured?.({
              ...leadData,
              interests: leadData.interest || [],
              turnCount: context.turnCount,
              conversationPhase: context.phase,
              sessionDurationSeconds,
              sessionId: `session-${context.sessionStartTime}`
            });
          }
        }

        // Actualizar system prompt con contexto
        updateSystemPrompt(getSystemPrompt());

        // Generar respuesta y hablar
        console.log('[RobotInteraction] Generando respuesta LLM y TTS...');
        await generateResponseAndSpeech(
          recognitionResult.text,
          langForThisInteraction,
          {
            onStart: () => {
              console.log('[RobotInteraction] TTS iniciado');
              setInteractionState(RobotInteractionState.SPEAKING);
              speakingStartTimeRef.current = Date.now();
              sessionRef.current?.startSpeaking();

              if (robotRef.current) {
                robotRef.current.stopThinking();

                // Variedad de animaciones al responder para más naturalidad
                const turnCount = sessionRef.current?.getTurnCount() || 0;
                const animation = weightedRandomChoice([
                  { item: 'nod', weight: 50 },      // Más común: asentir
                  { item: 'wave', weight: 20 },    // Ocasional: gesticular
                  { item: 'excited', weight: 15 }, // Raro: emocionado
                  { item: 'none', weight: 15 },    // A veces: solo hablar
                ]);

                switch (animation) {
                  case 'nod':
                    robotRef.current.nodYes();
                    break;
                  case 'wave':
                    // Solo saludar si es un turno temprano
                    if (turnCount < 3) robotRef.current.startWaving();
                    else robotRef.current.nodYes();
                    break;
                  case 'excited':
                    robotRef.current.startExcited?.();
                    break;
                  case 'none':
                  default:
                    // Sin animación extra, solo habla
                    break;
                }
              }

              // En modo barge-in, mantener VAD activo con threshold mas alto
              if (config.bargeInEnabled) {
                updateVADConfig(BARGEIN_VAD_CONFIG);
              }
            },
            onEnd: () => {
              console.log('[RobotInteraction] TTS terminado');
              speakingStartTimeRef.current = null;
              sessionRef.current?.stopSpeaking();

              // Auto-restart listening si esta habilitado
              const willContinueListening = shouldAutoRestartRef.current &&
                config.autoRestartListening &&
                sessionRef.current?.shouldAutoRestart();

              if (robotRef.current) {
                // Si va a seguir escuchando, no hacer stepBackward completo
                // para mantener una postura más "atenta"
                if (!willContinueListening) {
                  robotRef.current.stepBackward();
                }
                // Si continúa, el robot ya está en posición neutral por stopThinking
              }

              if (willContinueListening) {
                console.log('[RobotInteraction] Auto-restart listening');
                setInteractionState(RobotInteractionState.LISTENING);
                sessionRef.current?.startListening();
                // Restaurar VAD config normal
                updateVADConfig({ volumeThreshold: 0.08 });
              } else {
                setInteractionState(RobotInteractionState.IDLE);
              }
            },
            onError: (error) => {
              console.error('[RobotInteraction] Error durante TTS:', error);
              speakingStartTimeRef.current = null;
              setRobotResponse(prev => prev || 'Lo siento, tuve un problema al hablar.');
              setInteractionState(RobotInteractionState.ERROR);

              if (robotRef.current) {
                robotRef.current.stopThinking();
                robotRef.current.stepBackward();
              }

              if (onError) {
                onError(error instanceof Error ? error : new Error(String(error)));
              }
            }
          }
        );

        // Registrar turno
        sessionRef.current?.recordTurn();
      } else {
        console.log('[RobotInteraction] No se detecto texto');
        setRobotResponse(translatorRef.current.translate('noUserSpeechDetected', currentLanguage));

        // Animación de confusión cuando no entiende - con cooldown
        if (robotRef.current) {
          robotRef.current.stopThinking();
          executeAnimationWithCooldown(
            () => robotRef.current?.startConfused?.(),
            'startConfused'
          );
        }

        // Auto-restart listening
        if (shouldAutoRestartRef.current && config.autoRestartListening) {
          setInteractionState(RobotInteractionState.LISTENING);
          sessionRef.current?.startListening();
        } else {
          setInteractionState(RobotInteractionState.IDLE);
        }
      }
    } catch (error: any) {
      console.error('[RobotInteraction] Error procesando audio:', error);
      setRobotResponse(translatorRef.current.translate('generalErrorResponse', currentLanguage));
      setInteractionState(RobotInteractionState.ERROR);

      if (robotRef.current) robotRef.current.stepBackward();
      if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [
    stopRecording,
    recognizeSpeech,
    generateResponseAndSpeech,
    updateSystemPrompt,
    getSystemPrompt,
    currentLanguage,
    config.autoRestartListening,
    config.bargeInEnabled,
    updateVADConfig,
    onError,
    onLeadCaptured,
    executeAnimationWithCooldown
  ]);

  // Manejar fin de sesion
  const handleSessionEnd = useCallback(() => {
    console.log('[RobotInteraction] Sesion terminada');

    stopVAD();

    if (isRecording) {
      stopRecording();
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setInteractionState(RobotInteractionState.IDLE);
    setIsSessionActive(false);
    shouldAutoRestartRef.current = false;

    // Animación de despedida al terminar la sesión
    if (robotRef.current) {
      robotRef.current.startGoodbye?.();
    }

    // Notificar lead capturado al final de sesion con metricas de sesion
    if (agentStateRef.current) {
      const leadData = agentStateRef.current.getLeadData();
      const context = agentStateRef.current.getContext();

      // Calcular duracion de sesion en segundos
      const sessionDurationSeconds = sessionRef.current
        ? Math.floor(sessionRef.current.getSessionDuration() / 1000)
        : Math.floor((Date.now() - context.sessionStartTime) / 1000);

      if (Object.keys(leadData).length > 0 || context.turnCount > 0) {
        // Incluir metricas de sesion en los datos del lead
        onLeadCaptured?.({
          ...leadData,
          // Convertir interest a interests para coincidir con el schema
          interests: leadData.interest || [],
          turnCount: context.turnCount,
          conversationPhase: context.phase,
          sessionDurationSeconds,
          sessionId: `session-${context.sessionStartTime}`
        });
      }
    }

    onSessionEnd?.();
  }, [stopVAD, isRecording, stopRecording, onSessionEnd, onLeadCaptured]);

  // Metodo para iniciar interaccion por voz (modo continuo)
  const startListening = useCallback(async () => {
    // Evitar inicio duplicado si ya estamos escuchando
    if (interactionState === RobotInteractionState.LISTENING ||
        interactionState === RobotInteractionState.LISTENING_ACTIVE) {
      console.log('[RobotInteraction] Ya estamos escuchando, ignorando');
      return;
    }

    try {
      // Limpiar estado anterior
      setUserMessage('');
      setRobotResponse('');
      resetRecording();

      // Iniciar sesion si no esta activa
      if (!sessionRef.current?.isActive()) {
        sessionRef.current?.startSession();
        agentStateRef.current?.reset(currentLanguage);
        setCurrentPhase(ConversationPhase.GREETING);
      }

      const isNewSession = !sessionRef.current?.isActive();
      setIsSessionActive(true);
      shouldAutoRestartRef.current = true;

      // Actualizar estado a escuchando
      setInteractionState(RobotInteractionState.LISTENING);

      // NO animar al robot al iniciar la escucha
      // Las animaciones durante la escucha causaban movimientos erráticos de la cabeza
      // El robot ya tiene seguimiento del cursor que es suficiente para mostrar atención
      // La animación de respuesta se hará cuando el robot hable

      // Pequeño delay antes de iniciar VAD para evitar capturar ruido del clic
      await new Promise(resolve => setTimeout(resolve, 300));

      // Iniciar VAD
      await startVAD();

      // Iniciar listen timer
      sessionRef.current?.startListening();

    } catch (error) {
      console.error('Error al iniciar escucha:', error);
      setInteractionState(RobotInteractionState.ERROR);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [startVAD, resetRecording, currentLanguage, onError, interactionState]);

  // Metodo para detener escucha manualmente
  const stopListening = useCallback(async () => {
    console.log('[RobotInteraction] stopListening manual');

    shouldAutoRestartRef.current = false;

    // Si estamos grabando activamente, procesar el audio
    if (interactionState === RobotInteractionState.LISTENING_ACTIVE && isRecording) {
      await processRecordedAudio();
    } else {
      // Detener VAD y volver a IDLE
      stopVAD();
      setInteractionState(RobotInteractionState.IDLE);
      if (robotRef.current) robotRef.current.stepBackward();
    }
  }, [interactionState, isRecording, processRecordedAudio, stopVAD]);

  // Metodo para terminar sesion completamente
  const endSession = useCallback(() => {
    console.log('[RobotInteraction] endSession llamado');
    sessionRef.current?.endSession();
    handleSessionEnd();
  }, [handleSessionEnd]);

  // Metodo para enviar un mensaje de texto directamente
  const sendTextMessage = useCallback(async (text: string, lang?: string) => {
    if (!text.trim()) return;

    const languageToUse = lang || currentLanguage;
    setUserMessage(text);
    setInteractionState(RobotInteractionState.PROCESSING);
    // Usar startThinking() con cooldown para evitar animaciones rápidas
    if (robotRef.current) {
      executeAnimationWithCooldown(
        () => robotRef.current?.startThinking(),
        'startThinking'
      );
    }

    try {
      // Actualizar system prompt
      updateSystemPrompt(getSystemPrompt());

      const responseText = await sendGroqMessage(text, languageToUse);
      setRobotResponse(responseText);

      // Registrar turno
      if (agentStateRef.current) {
        agentStateRef.current.incrementTurn();
        const extractedInfo = agentStateRef.current.extractLeadInfo(text);
        if (Object.keys(extractedInfo).length > 0) {
          agentStateRef.current.updateLeadData(extractedInfo);
        }
      }

      setInteractionState(RobotInteractionState.IDLE);
      if (robotRef.current) robotRef.current.stopThinking();

    } catch (error) {
      console.error('Error en sendTextMessage:', error);
      setRobotResponse(translatorRef.current.translate('generalErrorResponse', languageToUse));
      setInteractionState(RobotInteractionState.ERROR);
      if (robotRef.current) robotRef.current.stopThinking();
      if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [currentLanguage, sendGroqMessage, updateSystemPrompt, getSystemPrompt, onError, executeAnimationWithCooldown]);

  // Metodo para detener habla
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      console.log('[RobotInteraction] SpeechSynthesis cancelado');
      speakingStartTimeRef.current = null;
    }
  }, []);

  // Asignar la referencia del robot
  const assignRobotRef = useCallback((ref: RobotAnimations | null) => {
    robotRef.current = ref;
  }, []);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopVAD();
      sessionRef.current?.dispose();
      audioPlayerRef.current?.dispose();
    };
  }, [stopVAD]);

  return {
    // Estado
    interactionState,
    userMessage,
    robotResponse,
    currentLanguage,
    isRecording,

    // Estado de sesion continua
    isSessionActive,
    currentPhase,
    currentVolume,
    vadIsListening,
    vadIsSpeaking,

    // Metodos principales
    assignRobotRef,
    startListening,
    stopListening,
    endSession,
    sendTextMessage,
    stopSpeaking,
    setCurrentLanguage,

    // Metodos de configuracion
    setVADThreshold: setThreshold,

    // Acceso a datos del agente
    getLeadData: () => agentStateRef.current?.getLeadData() || {},
    getConversationPhase: () => agentStateRef.current?.getPhase() || ConversationPhase.GREETING,

    // Resumen de conversacion para botones de accion
    getConversationSummary: () => {
      const leadData = agentStateRef.current?.getLeadData() || {};
      const context = agentStateRef.current?.getContext();
      return {
        name: leadData.name,
        company: leadData.company,
        interests: leadData.interest || [],
        painPoints: leadData.painPoints || [],
        lastTopic: context?.lastTopic || ''
      };
    }
  };
};
