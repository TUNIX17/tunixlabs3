import { useState, useCallback, useRef, useEffect } from 'react';
import { SpeechRecognitionService, SpeechRecognitionOptions, SpeechRecognitionResult } from '../lib/audio/speech-recognition';
import { LanguageDetector } from '../lib/language/detector';
import { useRateLimiter } from '../lib/groq/rate-limiter';

interface UseSpeechRecognitionProps {
  preferredLanguage?: string;
  onLanguageDetected?: (language: string) => void;
  onError?: (error: Error) => void;
}

export const useSpeechRecognition = ({
  preferredLanguage = 'auto',
  onLanguageDetected,
  onError
}: UseSpeechRecognitionProps = {}) => {
  // Estados
  const [isProcessing, setIsProcessing] = useState(false);
  const [text, setText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>(undefined);
  const [confidence, setConfidence] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  
  // Referencias
  const serviceRef = useRef<SpeechRecognitionService | null>(null);
  const languageDetectorRef = useRef<LanguageDetector | null>(null);
  
  // Verificar límites de API
  const { canMakeRequest, waitTime, trackRequest } = useRateLimiter();
  
  // Inicializar servicios si no existen
  const initServices = useCallback(() => {
    if (!serviceRef.current) {
      const options: SpeechRecognitionOptions = {
        language: preferredLanguage !== 'auto' ? preferredLanguage : undefined,
      };
      serviceRef.current = new SpeechRecognitionService(options);
    }
    
    if (!languageDetectorRef.current) {
      languageDetectorRef.current = new LanguageDetector();
    }
  }, [preferredLanguage]);
  
  // Método principal para reconocer voz desde audio blob
  const recognizeSpeech = useCallback(async (audioBlob: Blob): Promise<SpeechRecognitionResult> => {
    initServices();
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Verificar si podemos hacer la petición a la API
      if (!canMakeRequest) {
        throw new Error(`Límite de API alcanzado. Inténtalo de nuevo en ${Math.ceil(waitTime / 1000)} segundos.`);
      }
      
      // Usar reconocimiento basado en API
      let result: SpeechRecognitionResult;
      
      try {
        // Registrar petición para el control de límites
        trackRequest();
        
        // Llamar al servicio de reconocimiento
        result = await serviceRef.current!.recognizeAudio(audioBlob);
      } catch (apiError) {
        console.warn('Error en API de reconocimiento:', apiError);
        
        // Si falla la API, intentar reconocimiento local como fallback
        console.info('Intentando reconocimiento local como fallback...');
        result = await serviceRef.current!.recognizeAudioLocally(audioBlob);
      }
      
      // Guardar resultado
      setText(result.text);
      
      // Detectar idioma si no lo proporcionó la API
      if (!result.language && result.text) {
        const detectionResult = languageDetectorRef.current!.detectLanguage(result.text);
        result.language = detectionResult.detectedLanguage;
        result.confidence = detectionResult.confidence;
      }
      
      // Actualizar idioma detectado
      if (result.language) {
        setDetectedLanguage(result.language);
        
        // Notificar idioma detectado
        if (onLanguageDetected) {
          onLanguageDetected(result.language);
        }
      }
      
      // Actualizar confianza
      if (result.confidence !== undefined) {
        setConfidence(result.confidence);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido en reconocimiento de voz';
      
      setError(errorMessage);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      }
      
      // Devolver objeto vacío en caso de error
      return {
        text: '',
        language: preferredLanguage !== 'auto' ? preferredLanguage : undefined,
        confidence: 0
      };
    } finally {
      setIsProcessing(false);
    }
  }, [canMakeRequest, waitTime, trackRequest, preferredLanguage, onLanguageDetected, onError, initServices]);
  
  // Cambiar idioma preferido
  const setPreferredLanguage = useCallback((language: string) => {
    initServices();
    
    if (serviceRef.current) {
      serviceRef.current.setLanguage(language);
    }
  }, [initServices]);
  
  // Limpiar resultado
  const resetRecognition = useCallback(() => {
    setText('');
    setDetectedLanguage(undefined);
    setConfidence(undefined);
    setError(null);
  }, []);

  return {
    // Estados
    isProcessing,
    text,
    detectedLanguage,
    confidence,
    error,
    waitTime,
    
    // Métodos
    recognizeSpeech,
    setPreferredLanguage,
    resetRecognition
  };
}; 