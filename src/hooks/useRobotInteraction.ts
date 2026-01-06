import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioRecording } from './useAudioRecording';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useGroqConversation } from './useGroqConversation';
import { Translator } from '../lib/language/translator';
import { AudioPlayer } from '../lib/audio/player';

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

// Estados de interacción con el robot
export enum RobotInteractionState {
  IDLE = 'idle',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  SPEAKING = 'speaking',
  ERROR = 'error'
}

// Opciones para el hook
interface UseRobotInteractionOptions {
  initialLanguage?: string;
  robotSystemPrompt?: string;
  onStateChange?: (state: RobotInteractionState) => void;
  onError?: (error: Error) => void;
}

export const useRobotInteraction = ({
  initialLanguage = 'es',
  robotSystemPrompt = "Eres Tunix, un asistente de inteligencia artificial amigable que ayuda a resolver dudas sobre tecnología e IA. Responde de manera concisa y amigable.",
  onStateChange,
  onError
}: UseRobotInteractionOptions = {}) => {
  // Estado principal de interacción
  const [interactionState, setInteractionState] = useState<RobotInteractionState>(RobotInteractionState.IDLE);
  
  // Idioma actual
  const [currentLanguage, setCurrentLanguage] = useState<string>(initialLanguage);
  
  // Estado de la conversación
  const [userMessage, setUserMessage] = useState<string>('');
  const [robotResponse, setRobotResponse] = useState<string>('');
  
  // Referencia a las funciones de animación del robot
  const robotRef = useRef<RobotAnimations | null>(null);
  
  // Servicio de traducción
  const translatorRef = useRef<Translator>(new Translator(initialLanguage));
  
  // Reproductor de audio (se mantiene por si se necesita para otros audios que no sean TTS)
  const audioPlayerRef = useRef<AudioPlayer | null>(null);
  
  // Hook para grabación de audio
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecording({
    maxDurationMs: 30000, // 30 segundos máximo
    onError: (error) => {
      console.error('Error en grabación:', error);
      setInteractionState(RobotInteractionState.ERROR);
      
      if (onError) {
        onError(error);
      }
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
      }
    },
    onError: (error) => {
      console.error('Error en reconocimiento de voz:', error);
      setInteractionState(RobotInteractionState.ERROR);
      
      if (onError) {
        onError(error);
      }
    }
  });
  
  // Hook para conversación con Groq
  const {
    generateResponseAndSpeech,
    sendMessage: sendGroqMessage,
    // textToSpeech: convertTextToSpeechGroq, // Ya no se usa directamente aquí
  } = useGroqConversation({
    initialSystemPrompt: robotSystemPrompt,
    onStart: () => {
      setInteractionState(RobotInteractionState.PROCESSING);

      // Animar robot pensando con la nueva animación
      if (robotRef.current) {
        robotRef.current.startThinking();
      }
    },
    onComplete: (response) => {
      setRobotResponse(response);
    },
    onError: (error) => {
      console.error('Error en conversación:', error);
      setInteractionState(RobotInteractionState.ERROR);
      
      if (onError) {
        onError(error);
      }
    }
  });
  
  // Inicializar reproductor de audio (para usos futuros, no para Web Speech API TTS)
  useEffect(() => {
    audioPlayerRef.current = new AudioPlayer({
      autoPlay: false,
      onPlay: () => {
        // Este onPlay podría usarse si se reproduce un audio diferente al TTS
        // setInteractionState(RobotInteractionState.SPEAKING);
        // if (robotRef.current) robotRef.current.startWaving();
      },
      onEnded: () => {
        // Este onEnded también, para audios no TTS
        // setInteractionState(RobotInteractionState.IDLE);
        // if (robotRef.current) robotRef.current.stepBackward();
      },
      onError: (error) => {
        console.error('Error en reproducción de audio (AudioPlayer):', error);
        // No cambiar el estado general a ERROR aquí directamente si el error es solo del player
        // y no de un flujo principal, a menos que sea crítico.
        if (onError) {
          if (error instanceof Error) {
            onError(error);
          } else {
            onError(new Error(String(error)));
          }
        }
      }
    });
    
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.dispose();
      }
    };
  }, [onError]); // Solo onError como dependencia, ya que los callbacks no cambian estados globales directamente.
  
  // Notificar cambios de estado
  useEffect(() => {
    if (onStateChange) {
      onStateChange(interactionState);
    }
  }, [interactionState, onStateChange]);
  
  // Actualizar idioma cuando se detecta uno nuevo
  useEffect(() => {
    if (detectedLanguage && detectedLanguage !== currentLanguage) {
      setCurrentLanguage(detectedLanguage);
    }
  }, [detectedLanguage, currentLanguage]);
  
  // Método para iniciar interacción por voz
  const startListening = useCallback(async () => {
    try {
      // Limpiar estado anterior
      setUserMessage('');
      setRobotResponse('');
      resetRecording();
      
      // Actualizar estado a escuchando
      setInteractionState(RobotInteractionState.LISTENING);
      
      // Animar al robot escuchando
      if (robotRef.current) {
        robotRef.current.approachCamera();
      }
      
      // Iniciar grabación
      await startRecording();
    } catch (error) {
      console.error('Error al iniciar escucha:', error);
      setInteractionState(RobotInteractionState.ERROR);
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [startRecording, resetRecording, onError]);
  
  // Método para detener escucha y procesar audio
  const stopListening = useCallback(async () => {
    console.log('[RobotInteraction] stopListening llamado. Estado actual de isRecording:', isRecording);
    if (!isRecording) {
      console.warn('[RobotInteraction] Se intentó detener la escucha (stopListening), pero no se estaba grabando (isRecording es false).');
      return;
    }

    try {
      console.log('[RobotInteraction] Intentando detener escucha con stopRecording()...');
      const currentAudioBlob = await stopRecording(); 
      
      console.log('[RobotInteraction] stopRecording completado. Blob recibido:', 
                  currentAudioBlob ? `Tamaño: ${currentAudioBlob.size}` : 'null');

      if (currentAudioBlob && currentAudioBlob.size > 0) {
        setInteractionState(RobotInteractionState.PROCESSING);
        if (robotRef.current) robotRef.current.nodYes();
        
        const recognitionResult = await recognizeSpeech(currentAudioBlob); 
        setUserMessage(recognitionResult.text);
        
        let langForThisInteraction = currentLanguage;
        if (recognitionResult.language) {
          if (recognitionResult.language !== currentLanguage) {
            console.log(`[RobotInteraction] STT detectó un idioma (${recognitionResult.language}) diferente al actual (${currentLanguage}). Actualizando currentLanguage.`);
            setCurrentLanguage(recognitionResult.language);
          }
          langForThisInteraction = recognitionResult.language;
        } else {
          console.warn(`[RobotInteraction] STT no devolvió un idioma. Se usará el currentLanguage del hook: ${currentLanguage}`);
        }

        console.log(`[RobotInteraction] Idioma determinado para esta interacción (LLM y TTS): ${langForThisInteraction}`);

        if (recognitionResult.text) {
          // Generar respuesta del LLM y reproducir voz (TTS)
          // Los callbacks de TTS manejarán los estados SPEAKING e IDLE y animaciones.
          /* const responseText = */ await generateResponseAndSpeech( // responseText no es necesario aquí si onComplete de useGroqConversation ya lo establece.
            recognitionResult.text,
            langForThisInteraction,
            {
              onStart: () => {
                setInteractionState(RobotInteractionState.SPEAKING);
                if (robotRef.current) {
                  robotRef.current.stopThinking(); // Detener animación de pensando
                  robotRef.current.startWaving();
                }
              },
              onEnd: () => {
                setInteractionState(RobotInteractionState.IDLE);
                if (robotRef.current) robotRef.current.stepBackward();
              },
              onError: (error) => {
                console.error('[RobotInteraction] Error durante TTS (Web Speech API):', error);
                setRobotResponse(prev => prev || 'Lo siento, tuve un problema al intentar hablar.');
                setInteractionState(RobotInteractionState.ERROR);
                if (robotRef.current) {
                  robotRef.current.stopThinking(); // Asegurar que thinking se detenga
                  robotRef.current.stepBackward();
                }
                if (onError) {
                  if (error instanceof Error) {
                    onError(error);
                  } else if (error instanceof SpeechSynthesisErrorEvent) {
                    onError(new Error(`SpeechSynthesis Error: ${error.error} - ${error.utterance?.text.substring(0,30)}`));
                  } else {
                    onError(new Error(String(error)));
                  }
                }
              }
            }
          );
        } else {
          console.log('[RobotInteraction] No se detectó texto del usuario (STT vacío). No se llamará al LLM ni TTS.');
          setRobotResponse(translatorRef.current.translate('noUserSpeechDetected', currentLanguage));
          setInteractionState(RobotInteractionState.IDLE);
          if (robotRef.current) robotRef.current.stepBackward();
        }
      } else {
        console.warn('[RobotInteraction] No se obtuvo audioBlob o estaba vacío después de detener la grabación.');
        setUserMessage(translatorRef.current.translate('noAudioRecordedError', currentLanguage));
        setInteractionState(RobotInteractionState.IDLE);
        if (robotRef.current) robotRef.current.stepBackward();
      }
    } catch (error: any) {
      console.error('[RobotInteraction] Error en stopListening:', error);
      setRobotResponse(translatorRef.current.translate('generalErrorResponse', currentLanguage));
      setInteractionState(RobotInteractionState.ERROR);
      if (robotRef.current) robotRef.current.stepBackward(); 
      if (onError) {
        if (error instanceof Error) {
          onError(error);
        } else {
          onError(new Error(String(error)));
        }
      }
    } 
  }, [
    isRecording, 
    stopRecording, 
    recognizeSpeech, 
    generateResponseAndSpeech, 
    currentLanguage, 
    setCurrentLanguage, 
    setUserMessage, 
    setRobotResponse, 
    setInteractionState, 
    onError, 
    robotRef,
    translatorRef
  ]);

  // Método para enviar un mensaje de texto directamente (sin voz)
  const sendTextMessage = useCallback(async (text: string, lang?: string) => {
    if (!text.trim()) return;

    const languageToUse = lang || currentLanguage;
    setUserMessage(text);
    setInteractionState(RobotInteractionState.PROCESSING);
    if (robotRef.current) robotRef.current.approachCamera();

    try {
      // Solo obtener respuesta de texto, sin TTS automático para esta función.
      const responseText = await sendGroqMessage(text, languageToUse);
      setRobotResponse(responseText); 
      
      // Si se quisiera que hable aquí, se llamaría a textToSpeech explícitamente.
      // Por ejemplo:
      // if (responseText) {
      //   await textToSpeech(responseText, languageToUse, {
      //     onStart: () => { /* ... */ },
      //     onEnd: () => { /* ... */ },
      //     onError: () => { /* ... */ }
      //   });
      // }
      
      // Asumimos que después de enviar texto y recibir respuesta, volvemos a IDLE
      // si no hay un flujo de voz explícito iniciado para la respuesta.
      setInteractionState(RobotInteractionState.IDLE);
      if (robotRef.current) robotRef.current.stepBackward();

    } catch (error) {
      console.error('Error en sendTextMessage:', error);
      setRobotResponse(translatorRef.current.translate('generalErrorResponse', languageToUse));
      setInteractionState(RobotInteractionState.ERROR);
      if (robotRef.current) robotRef.current.stepBackward();
      if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [
    currentLanguage, 
    sendGroqMessage, 
    // textToSpeech, // Se podría añadir si se decide que sendTextMessage también hable
    robotRef, 
    translatorRef, 
    onError, 
    setRobotResponse, 
    setUserMessage, 
    setInteractionState 
  ]);

  // Método para detener habla (si es Web Speech API)
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      console.log('[RobotInteraction] SpeechSynthesis cancelado.');
      // El evento 'onend' de la utterance actual debería dispararse y manejar el cambio de estado a IDLE.
      // Si no, forzar el estado aquí puede ser una opción, pero es mejor confiar en el evento.
      // setInteractionState(RobotInteractionState.IDLE);
      // if (robotRef.current) robotRef.current.stepBackward();
    }
    // Si se estuviera usando AudioPlayer para algo, aquí iría audioPlayerRef.current?.stop();
  }, []);

  // Asignar la referencia del robot para control de animaciones
  const assignRobotRef = useCallback((ref: RobotAnimations | null) => {
    robotRef.current = ref;
  }, []);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Cancelar cualquier habla pendiente
      }
      audioPlayerRef.current?.dispose();
    };
  }, []);

  return {
    interactionState,
    userMessage,
    robotResponse,
    currentLanguage,
    isRecording,
    assignRobotRef,
    startListening,
    stopListening,
    sendTextMessage,
    stopSpeaking, // Exponer para control externo si es necesario
    setCurrentLanguage, // Para cambiar idioma externamente si es necesario
    // No es necesario exponer audioBlob ya que se maneja internamente
  };
}; 