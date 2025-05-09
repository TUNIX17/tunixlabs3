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
    let resultFromService: SpeechRecognitionResult | null = null;

    try {
      if (!canMakeRequest) {
        throw new Error(`Límite de API alcanzado. Inténtalo de nuevo en ${Math.ceil(waitTime / 1000)} segundos.`);
      }
      
      let rawApiResult: any = null; // Para inspeccionar la respuesta cruda
      try {
        trackRequest();
        console.log('[SpeechRecognition] Intentando reconocimiento con serviceRef.current.recognizeAudio...');
        resultFromService = await serviceRef.current!.recognizeAudio(audioBlob);
        // Intenta loguear la respuesta cruda si tu servicio la puede exponer o si la capturas de otra forma
        // console.log('[SpeechRecognition] Respuesta cruda de la API (si está disponible):', rawApiResult);
        console.log('[SpeechRecognition] Resultado directo de recognizeAudio (API):', resultFromService);
      } catch (apiError) {
        console.warn('[SpeechRecognition] Error en API de reconocimiento (recognizeAudio):', apiError);
        console.info('[SpeechRecognition] Intentando reconocimiento local como fallback...');
        resultFromService = await serviceRef.current!.recognizeAudioLocally(audioBlob);
        console.log('[SpeechRecognition] Resultado de recognizeAudioLocally (fallback):', resultFromService);
      }
      
      // Asegurarse de que resultFromService no sea null y tenga una estructura base
      if (!resultFromService) {
        console.error('[SpeechRecognition] Todos los intentos de reconocimiento fallaron o devolvieron null.');
        throw new Error('No se pudo obtener resultado del servicio de reconocimiento.');
      }

      // Crear una copia para modificarla si es necesario, o usarla directamente
      let finalResult: SpeechRecognitionResult = { ...resultFromService };

      setText(finalResult.text);
      
      if (!finalResult.language && finalResult.text) {
        console.log('[SpeechRecognition] Idioma no proporcionado por STT, intentando detección local para el texto:', finalResult.text.substring(0, 50) + "...");
        const detectionResult = languageDetectorRef.current!.detectLanguage(finalResult.text);
        console.log('[SpeechRecognition] Resultado de LanguageDetector local:', detectionResult);
        finalResult.language = detectionResult.detectedLanguage;
        finalResult.confidence = detectionResult.confidence; // Actualizar confianza también
      } else if (finalResult.language) {
        console.log(`[SpeechRecognition] Idioma proporcionado directamente por STT: ${finalResult.language}`);
      }
      
      if (finalResult.language) {
        setDetectedLanguage(finalResult.language);
        if (onLanguageDetected) {
          onLanguageDetected(finalResult.language);
        }
      }
      
      if (finalResult.confidence !== undefined) {
        setConfidence(finalResult.confidence);
      }
      
      console.log('[SpeechRecognition] Resultado final devuelto por recognizeSpeech:', finalResult);
      return finalResult;
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