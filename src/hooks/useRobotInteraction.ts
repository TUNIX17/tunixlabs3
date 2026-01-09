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
}

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
  const {
    recognizeSpeech,
    detectedLanguage
  } = useSpeechRecognition({
    preferredLanguage: 'auto',
    onLanguageDetected: (language) => {
      if (language && language !== currentLanguage) {
        setCurrentLanguage(language);
        agentStateRef.current?.setLanguage(language);
      }
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
        startRecordingForVAD();
      }
    },
    onSpeechEnd: (duration) => {
      console.log('[RobotInteraction] VAD: Speech terminado, duracion:', duration, 'ms, estado:', interactionState, ', recordingStarted:', recordingStartedRef.current, ', isRecording:', isRecording);

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
    onStart: () => {
      setInteractionState(RobotInteractionState.PROCESSING);
      if (robotRef.current) {
        robotRef.current.startThinking();
      }
    },
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

  // Actualizar idioma cuando se detecta uno nuevo
  useEffect(() => {
    if (detectedLanguage && detectedLanguage !== currentLanguage) {
      setCurrentLanguage(detectedLanguage);
      promptCache.invalidate(); // Invalidar cache cuando cambia idioma
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
      if (robotRef.current) robotRef.current.nodYes();

      // Reconocer speech
      console.log('[RobotInteraction] Enviando audio a STT...');
      const recognitionResult = await recognizeSpeech(currentAudioBlob);
      console.log('[RobotInteraction] STT resultado:', recognitionResult);
      setUserMessage(recognitionResult.text);

      // Actualizar idioma
      let langForThisInteraction = currentLanguage;
      if (recognitionResult.language) {
        if (recognitionResult.language !== currentLanguage) {
          console.log('[RobotInteraction] Idioma detectado:', recognitionResult.language);
          setCurrentLanguage(recognitionResult.language);
          agentStateRef.current?.setLanguage(recognitionResult.language);
        }
        langForThisInteraction = recognitionResult.language;
      }

      if (recognitionResult.text) {
        console.log('[RobotInteraction] Texto reconocido:', recognitionResult.text);
        // Extraer info del lead
        if (agentStateRef.current) {
          const extractedInfo = agentStateRef.current.extractLeadInfo(recognitionResult.text);
          if (Object.keys(extractedInfo).length > 0) {
            agentStateRef.current.updateLeadData(extractedInfo);
            onLeadCaptured?.(agentStateRef.current.getLeadData());
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
                robotRef.current.startWaving();
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

              if (robotRef.current) robotRef.current.stepBackward();

              // Auto-restart listening si esta habilitado
              if (shouldAutoRestartRef.current && config.autoRestartListening && sessionRef.current?.shouldAutoRestart()) {
                console.log('[RobotInteraction] Auto-restart listening');
                setInteractionState(RobotInteractionState.LISTENING);
                sessionRef.current?.startListening();
                // Restaurar VAD config normal
                updateVADConfig({ volumeThreshold: 0.08 }); // Restaurar al threshold por defecto
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
    onLeadCaptured
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

    if (robotRef.current) robotRef.current.stepBackward();

    // Notificar lead capturado al final de sesion
    if (agentStateRef.current) {
      const leadData = agentStateRef.current.getLeadData();
      if (Object.keys(leadData).length > 0) {
        onLeadCaptured?.(leadData);
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

      setIsSessionActive(true);
      shouldAutoRestartRef.current = true;

      // Actualizar estado a escuchando
      setInteractionState(RobotInteractionState.LISTENING);

      // Animar al robot (después de un pequeño delay para evitar conflictos)
      if (robotRef.current) {
        setTimeout(() => {
          if (robotRef.current) {
            robotRef.current.approachCamera();
          }
        }, 100);
      }

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
    if (robotRef.current) robotRef.current.approachCamera();

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
      if (robotRef.current) robotRef.current.stepBackward();

    } catch (error) {
      console.error('Error en sendTextMessage:', error);
      setRobotResponse(translatorRef.current.translate('generalErrorResponse', languageToUse));
      setInteractionState(RobotInteractionState.ERROR);
      if (robotRef.current) robotRef.current.stepBackward();
      if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [currentLanguage, sendGroqMessage, updateSystemPrompt, getSystemPrompt, onError]);

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
    getConversationPhase: () => agentStateRef.current?.getPhase() || ConversationPhase.GREETING
  };
};
