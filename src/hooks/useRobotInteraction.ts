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
  
  // Reproductor de audio
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
    textToSpeech: convertTextToSpeechGroq,
  } = useGroqConversation({
    initialSystemPrompt: robotSystemPrompt,
    onStart: () => {
      setInteractionState(RobotInteractionState.PROCESSING);
      
      // Animar robot pensando
      if (robotRef.current) {
        robotRef.current.approachCamera();
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
  
  // Inicializar reproductor de audio
  useEffect(() => {
    audioPlayerRef.current = new AudioPlayer({
      autoPlay: false,
      onPlay: () => {
        setInteractionState(RobotInteractionState.SPEAKING);
        
        // Animar al robot hablando
        if (robotRef.current) {
          robotRef.current.startWaving();
        }
      },
      onEnded: () => {
        setInteractionState(RobotInteractionState.IDLE);
        
        // Regresar al robot a posición normal
        if (robotRef.current) {
          robotRef.current.stepBackward();
        }
      },
      onError: (error) => {
        console.error('Error en reproducción de audio:', error);
        setInteractionState(RobotInteractionState.ERROR);
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
  }, [onError]);
  
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
    try {
      console.log('[RobotInteraction] Intentando detener escucha...');
      await stopRecording();
      
      // Añadir log para verificar el estado de audioBlob DESPUÉS de stopRecording
      console.log('[RobotInteraction] stopRecording completado. ¿Existe audioBlob?', !!audioBlob, audioBlob ? `Tamaño: ${audioBlob.size}` : '');

      if (audioBlob && audioBlob.size > 0) { // Añadir verificación de tamaño > 0
        setInteractionState(RobotInteractionState.PROCESSING);
        if (robotRef.current) robotRef.current.nodYes();
        
        // 1. Reconocimiento de voz (STT y detección de idioma)
        const recognitionResult = await recognizeSpeech(audioBlob);
        setUserMessage(recognitionResult.text);
        
        let langToUse = currentLanguage; // Usar el idioma actual del hook (actualizado por onLanguageDetected)
        if (recognitionResult.language && recognitionResult.language !== currentLanguage) {
          // Si STT devuelve un idioma diferente y es confiable, podríamos considerarlo aquí.
          // Por ahora, nos fiamos del currentLanguage que se actualiza vía onLanguageDetected.
          // langToUse = recognitionResult.language;
          // setCurrentLanguage(recognitionResult.language); // Esto ya lo hace useSpeechRecognition -> onLanguageDetected
        }

        if (!recognitionResult.text) {
          const errorMsg = translatorRef.current.translate('voice.error.speech_recognition', langToUse);
          setRobotResponse(errorMsg); // Mostrar error en UI
          throw new Error(errorMsg);
        }
        
        // 2. Generar respuesta del LLM y audio TTS usando el texto reconocido
        // Se pasa langToUse que es el currentLanguage (actualizado por el detector de useSpeechRecognition)
        const { responseText, responseAudioBlob } = await generateResponseAndSpeech(
          recognitionResult.text, 
          langToUse
        );
        
        setRobotResponse(responseText);

        if (responseAudioBlob && audioPlayerRef.current) {
          await audioPlayerRef.current.loadFromBlob(responseAudioBlob); // Cargar primero
          await audioPlayerRef.current.play(); // Luego reproducir
        } else {
          setInteractionState(RobotInteractionState.IDLE);
          if (robotRef.current) robotRef.current.stepBackward();
        }
      } else {
        console.warn('[RobotInteraction] No se encontró audioBlob o estaba vacío después de detener la grabación. Volviendo a IDLE.');
        setInteractionState(RobotInteractionState.IDLE);
      }
    } catch (error: any) {
      console.error('Error en stopListening o procesamiento de voz:', error);
      setRobotResponse(error.message || translatorRef.current.translate('robot.error.generic', currentLanguage));
      setInteractionState(RobotInteractionState.ERROR);
      if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [audioBlob, stopRecording, recognizeSpeech, currentLanguage, generateResponseAndSpeech, robotRef, translatorRef, onError, setRobotResponse, setUserMessage, setInteractionState ]);
  
  // Método para enviar un mensaje de texto (mantiene su lógica original)
  const sendTextMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setUserMessage(text);
    setInteractionState(RobotInteractionState.PROCESSING);
    if (robotRef.current) robotRef.current.nodYes();

    try {
      // Usar la función renombrada de useGroqConversation para obtener solo el texto
      const responseText = await sendGroqMessage(text, currentLanguage);
      setRobotResponse(responseText);

      if (responseText && audioPlayerRef.current) {
        const audioResponse = await convertTextToSpeechGroq(responseText, currentLanguage);
        if (audioResponse) {
          await audioPlayerRef.current.loadFromBlob(audioResponse); // Cargar primero
          await audioPlayerRef.current.play(); // Luego reproducir
        } else {
          setInteractionState(RobotInteractionState.IDLE);
          if (robotRef.current) robotRef.current.stepBackward();
        }
      } else {
        setInteractionState(RobotInteractionState.IDLE);
        if (robotRef.current) robotRef.current.stepBackward();
      }
    } catch (error: any) {
      console.error('Error al enviar mensaje de texto:', error);
      setRobotResponse(error.message || translatorRef.current.translate('robot.error.generic', currentLanguage));
      setInteractionState(RobotInteractionState.ERROR);
      if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [currentLanguage, sendGroqMessage, convertTextToSpeechGroq, robotRef, translatorRef, onError, setRobotResponse, setUserMessage, setInteractionState ]);
  
  // Método para detener habla
  const stopSpeaking = useCallback(() => {
    if (audioPlayerRef.current && audioPlayerRef.current.getState().isPlaying) {
      audioPlayerRef.current.stop();
      setInteractionState(RobotInteractionState.IDLE);
    }
  }, []);
  
  // Método para cambiar idioma manualmente
  const changeLanguage = useCallback((language: string) => {
    if (translatorRef.current.isLanguageSupported(language)) {
      setCurrentLanguage(language);
      translatorRef.current.setDefaultLanguage(language);
    } else {
      console.warn(`Idioma no soportado: ${language}`);
    }
  }, []);
  
  // Método para registrar el robot
  const registerRobot = useCallback((robotAnimations: RobotAnimations) => {
    robotRef.current = robotAnimations;
  }, []);
  
  // Traducir mensajes de la interfaz
  const translate = useCallback((key: string): string => {
    return translatorRef.current.translate(key, currentLanguage);
  }, [currentLanguage]);

  return {
    // Estado
    interactionState,
    isRecording,
    currentLanguage,
    userMessage,
    robotResponse,
    
    // Métodos principales
    startListening,
    stopListening,
    sendTextMessage,
    stopSpeaking,
    changeLanguage,
    registerRobot,
    translate
  };
}; 