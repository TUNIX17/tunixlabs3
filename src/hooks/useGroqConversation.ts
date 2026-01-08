import { useState, useCallback, useRef } from 'react';
import { apiClient } from '../lib/groq/client';
import { cerebrasClient } from '../lib/cerebras/client';
import { selectModelConfig } from '../lib/groq/models';
import { useRateLimiter } from '../lib/groq/rate-limiter';
import { getCommercialPrompt } from '../lib/agent';
import axios from 'axios';

// Definición de tipos para la respuesta de Groq (Chat Completions)
interface GroqChatCompletionChoice {
  message: {
    role: 'assistant';
    content: string;
  };
  // Pueden existir otros campos como logprobs, finish_reason, etc.
  index?: number;
  finish_reason?: string;
}

interface GroqChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: GroqChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  // Otros campos posibles como system_fingerprint, x_groq, etc.
}

// Tipo para la respuesta de transcripción de Groq
interface GroqTranscriptionResponse {
  text: string;
  language?: string; // Opcional, dependiendo de la respuesta de Groq
}

// Tipos para los mensajes de conversación
interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Tipos para las opciones de la conversación
interface UseGroqConversationOptions {
  initialSystemPrompt?: string;
  maxHistoryLength?: number;
  onStart?: () => void;
  onComplete?: (response: string) => void;
  onError?: (error: Error) => void;
}

export const useGroqConversation = ({
  initialSystemPrompt,
  maxHistoryLength = 10,
  onStart,
  onComplete,
  onError
}: UseGroqConversationOptions = {}) => {
  // Usar prompt comercial por defecto si no se proporciona uno
  const defaultPrompt = initialSystemPrompt || getCommercialPrompt('es');
  // Estados principales
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Historial de mensajes
  const [history, setHistory] = useState<ConversationMessage[]>([
    { role: 'system', content: defaultPrompt }
  ]);

  // Mantener referencia al system prompt actual
  const systemPromptRef = useRef<string>(defaultPrompt);
  
  // Límites de API
  const { canMakeRequest, waitTime, trackRequest, signalRateLimitHit } = useRateLimiter();
  
  // Seleccionar configuración de modelo adecuada
  const configRef = useRef(selectModelConfig());
  
  // Método para enviar un mensaje y obtener respuesta
  const sendMessage = useCallback(async (message: string, language?: string): Promise<string> => {
    // Validar mensaje
    if (!message.trim()) {
      return '';
    }
    
    // Verificar si podemos hacer la petición
    if (!canMakeRequest) {
      const errorMsg = `Límite de API alcanzado. Por favor, espera ${Math.ceil(waitTime / 1000)} segundos.`;
      setError(errorMsg);
      
      if (onError) {
        onError(new Error(errorMsg));
      }
      
      return '';
    }
    
    // Marcar inicio de procesamiento
    setIsProcessing(true);
    setError(null);
    setCurrentResponse('');
    
    if (onStart) {
      onStart();
    }
    
    try {
      // Registrar la petición para límites
      trackRequest();
      
      // Actualizar configuración del modelo en caso de alto tráfico
      configRef.current = selectModelConfig(0, false);
      
      // Actualizar system prompt basado en el idioma detectado
      // Usar el sistema de prompts comerciales
      if (language) {
        systemPromptRef.current = getCommercialPrompt(language);
      } else {
        systemPromptRef.current = defaultPrompt;
      }
      
      // Crear mensajes para la conversación
      const newUserMessage: ConversationMessage = { role: 'user', content: message };
      
      // Obtener historial limitado
      const recentMessages = [...history];
      
      // Asegurar que el primer mensaje sea el system prompt actualizado
      if (recentMessages[0].role === 'system') {
        recentMessages[0] = { role: 'system', content: systemPromptRef.current };
      } else {
        recentMessages.unshift({ role: 'system', content: systemPromptRef.current });
      }
      
      // Añadir el nuevo mensaje
      recentMessages.push(newUserMessage);
      
      // Limitar cantidad de mensajes para no exceder tokens
      const limitedMessages = recentMessages.slice(-maxHistoryLength);
      
      // Realizar petición a Cerebras para LLM (gratis, 6x más rápido que Groq)
      // La API de Cerebras es compatible con OpenAI
      const response = await cerebrasClient.post<GroqChatCompletionResponse>('', {
        endpoint: '/chat/completions',
        payload: {
          model: configRef.current.conversation, // llama-3.3-70b
          messages: limitedMessages,
          temperature: configRef.current.temperature,
          max_tokens: configRef.current.maxResponseTokens,
          stream: false
        }
      });
      
      // Extraer respuesta
      const assistantResponse = response.data.choices[0]?.message.content || '';
      
      // Añadir respuesta al historial
      const newAssistantMessage: ConversationMessage = {
        role: 'assistant',
        content: assistantResponse
      };
      
      // Actualizar historial
      setHistory(prev => [...prev, newUserMessage, newAssistantMessage].slice(-maxHistoryLength));
      
      // Actualizar respuesta actual
      setCurrentResponse(assistantResponse);
      
      // Notificar finalización
      if (onComplete) {
        onComplete(assistantResponse);
      }
      
      return assistantResponse;
    } catch (error: any) {
      let errorMessage = 'Error desconocido al procesar mensaje';
      if (error && error.response) {
        const errorData = error.response.data;
        const status = error.response.status;
        errorMessage = errorData?.error?.message || errorData?.error || errorData?.message || error.message || 'Error al enviar mensaje';

        const retryAfterHeader = error.response.headers?.['retry-after'];
        if (status === 429 && retryAfterHeader) {
          const retrySeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(retrySeconds)) {
            signalRateLimitHit(retrySeconds);
            errorMessage = `Demasiadas peticiones. Intenta de nuevo en ${retrySeconds} segundos. (Mensaje original: ${errorMessage})`;
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      if (onError) onError(new Error(errorMessage));
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [
    canMakeRequest,
    waitTime,
    trackRequest,
    signalRateLimitHit,
    history,
    maxHistoryLength,
    defaultPrompt,
    onStart,
    onComplete,
    onError
  ]);

  const speakWithWebSpeech = useCallback(async (
    text: string, 
    language: string,
    callbacks: { onStart?: () => void; onEnd?: () => void; onError?: (e: SpeechSynthesisErrorEvent) => void }
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn('[TTS-WebSpeech] Web Speech API no está disponible.');
        reject(new Error('Web Speech API no disponible'));
        return;
      }

      if (!text.trim()) {
        console.warn('[TTS-WebSpeech] Texto vacío, no se reproducirá.');
        resolve(); // Resuelve inmediatamente si no hay texto
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;

      // Lógica de selección de voz refinada:
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice: SpeechSynthesisVoice | undefined = undefined;

      if (voices.length > 0) {
        // 1. Filtrar voces por el idioma base (ej. 'en' para 'en-US', 'en-GB')
        const languageBase = language.split('-')[0];
        const voicesForLanguage = voices.filter(voice => voice.lang.startsWith(languageBase));

        if (voicesForLanguage.length > 0) {
          // 2. De las voces del idioma, intentar encontrar una masculina
          selectedVoice = voicesForLanguage.find(voice => voice.name.toLowerCase().includes('male'));
          
          // 3. Si no hay masculina para ese idioma, usar la primera voz disponible para ese idioma
          if (!selectedVoice) {
            selectedVoice = voicesForLanguage[0];
            console.log(`[TTS-WebSpeech] No se encontró voz masculina para ${languageBase}, usando la primera disponible: ${selectedVoice.name}`);
          }
        } else {
          console.warn(`[TTS-WebSpeech] No se encontraron voces para el idioma base ${languageBase}.`);
          // 4. Fallback MUY genérico: intentar encontrar una voz que contenga el código de idioma (menos preciso)
          // O simplemente confiar en que utterance.lang hará lo mejor posible.
          // selectedVoice = voices.find(voice => voice.lang === language);
          // if (!selectedVoice) {
          //   selectedVoice = voices[0]; // Fallback a la primera voz del sistema si todo lo demás falla
          //   if(selectedVoice) console.warn(`[TTS-WebSpeech] Usando voz por defecto del sistema: ${selectedVoice.name}`);
          // }
        }
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`[TTS-WebSpeech] Usando voz: ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
        console.warn(`[TTS-WebSpeech] No se encontró voz específica para ${language}. Se usará la voz por defecto del navegador para el lang: ${utterance.lang}.`);
      }
      
      // Ajustes para efecto robótico (Feedback: más rápida y aguda)
      // Valores anteriores: pitch = 1.1, rate = 0.6
      utterance.pitch = 1.3; // Más agudo.
      utterance.rate = 0.8;  // Más rápido que 0.6, pero aún por debajo de lo normal.
      utterance.volume = 1;  // Volumen máximo

      utterance.onstart = () => {
        console.log('[TTS-WebSpeech] Reproducción iniciada.');
        if (callbacks.onStart) callbacks.onStart();
      };

      utterance.onend = () => {
        console.log('[TTS-WebSpeech] Reproducción finalizada.');
        if (callbacks.onEnd) callbacks.onEnd();
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('[TTS-WebSpeech] Error en la reproducción:', event);
        if (callbacks.onError) callbacks.onError(event);
        reject(event.error || new Error(`Error en SpeechSynthesis: ${event.error}`));
      };
      
      // Asegurarse de que las voces estén cargadas (especialmente en algunos navegadores)
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          // Reintentar la selección de voz una vez que se carguen
          const updatedVoices = window.speechSynthesis.getVoices();
          selectedVoice = updatedVoices.find(voice => voice.lang.startsWith(language) && voice.name.toLowerCase().includes('male')) ||
                          updatedVoices.find(voice => voice.lang.startsWith(language)) || 
                          updatedVoices[0];
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log(`[TTS-WebSpeech] (Voces cargadas) Usando voz: ${selectedVoice.name} (${selectedVoice.lang})`);
          }
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    });
  }, []);

  // Método para convertir texto a voz
  // Prioriza Web Speech API, luego podría intentar Groq (actualmente roto)
  const textToSpeech = useCallback(async (
    text: string, 
    language: string = 'es',
    callbacks: { onStart?: () => void; onEnd?: () => void; onError?: (e: any) => void }
  ): Promise<void> => {
    if (!text.trim()) {
      if (callbacks.onEnd) callbacks.onEnd(); // Considerar si llamar onEnd o nada
      return Promise.resolve();
    }

    try {
      console.log(`[TTS] Intentando generar voz para: "${text.substring(0,50)}..." en idioma ${language} usando Web Speech API.`);
      await speakWithWebSpeech(text, language, callbacks);
      // Si speakWithWebSpeech se resuelve, significa que la reproducción se completó (o no se pudo iniciar pero se manejó).
    } catch (webSpeechError) {
      console.warn('[TTS] Web Speech API falló o no está disponible:', webSpeechError);
      // Aquí podríamos intentar el fallback a Groq TTS si quisiéramos y si el idioma es inglés.
      // Por ahora, como Groq TTS está roto, simplemente registramos el error y no hacemos más.
      if (callbacks.onError) callbacks.onError(webSpeechError);
      
      // Opcional: Lógica de fallback a Groq TTS (actualmente deshabilitada porque está rota)
      /*
      if (language.toLowerCase().startsWith('en')) {
        console.log('[TTS] Web Speech API falló. Intentando fallback a Groq TTS para inglés (actualmente roto)...');
        setIsProcessing(true); // Asegurar que el estado de procesamiento se active para Groq
        setError(null);
        try {
          trackRequest();
          const modelToUse = 'playai-tts';
          const selectedVoice = 'Fritz-PlayAI';
          
          const response = await apiClient.post<ArrayBuffer>('', {
            endpoint: '/audio/speech',
            payload: { model: modelToUse, voice: selectedVoice, input: text, response_format: "wav", speed: 1.0 },
            isBlob: true
          });

          if (!response.data || response.data.byteLength === 0) {
            throw new Error('Groq TTS devolvió audio vacío.');
          }
          
          const audioBlob = new Blob([response.data], { type: 'audio/wav' });
          // Aquí necesitaríamos una forma de reproducir este blob.
          // Esta parte es compleja porque el AudioPlayer está en useRobotInteraction.
          // Por simplicidad, y dado que está roto, no se implementa la reproducción del blob aquí.
          console.log('[TTS] Groq TTS (fallback) generó un blob:', audioBlob);
          // Idealmente, aquí se llamaría a una función que pueda reproducir el blob y disparar onStart/onEnd
          if (callbacks.onStart) callbacks.onStart(); // Simulación
          // ... lógica para reproducir y luego ...
          if (callbacks.onEnd) callbacks.onEnd(); // Simulación
          
        } catch (groqError: any) {
          console.error('[TTS] Fallback a Groq TTS también falló:', groqError);
          if (callbacks.onError) callbacks.onError(groqError);
        } finally {
          setIsProcessing(false);
        }
      } else {
        if (callbacks.onError) callbacks.onError(webSpeechError); // Llama a onError si no hay fallback
      }
      */
    }
  }, [speakWithWebSpeech /*, canMakeRequest, waitTime, trackRequest, signalRateLimitHit, apiClient */]); // Dependencias de Groq comentadas

  // Método para procesar audio para transcripción vía el proxy
  const processAudio = useCallback(async (audioBlob: Blob): Promise<{text: string, detectedLanguage: string | null}> => {
    if (!audioBlob) {
      throw new Error('No se proporcionó audio para procesar');
    }
    
    if (!canMakeRequest) {
      // Considera usar los valores de las cabeceras `retry-after` si el backend las propaga
      const waitMessage = waitTime > 0 ? ` Por favor, espera ${Math.ceil(waitTime / 1000)} segundos.` : '';
      throw new Error(`Límite de API alcanzado.${waitMessage}`);
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      trackRequest();
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', configRef.current.speechToText);

      const response = await axios.post<GroqTranscriptionResponse>('/api/transcribe-audio', formData);

      const transcribedText = response.data.text;
      const languageDetected = response.data.language || null;

      if (typeof transcribedText !== 'string' || transcribedText.trim() === '') {
        console.warn('La transcripción devolvió un texto vacío o inválido.');
        return { text: "[No se entendió el audio]", detectedLanguage: null };
      }
      return { text: transcribedText, detectedLanguage: languageDetected };

    } catch (error: any) {
      let errorMessage = 'Error desconocido al procesar audio';
      if (error && error.response) {
        const errorData = error.response.data;
        const status = error.response.status;
        errorMessage = errorData?.error?.message || errorData?.error || errorData?.details || error.message || 'Error al procesar audio';

        const retryAfterHeader = error.response.headers?.['retry-after'];
        if (status === 429 && retryAfterHeader) {
          const retrySeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(retrySeconds)) {
            signalRateLimitHit(retrySeconds);
            errorMessage = `Demasiadas peticiones de transcripción. Intenta de nuevo en ${retrySeconds} segundos. (Mensaje original: ${errorMessage})`;
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      if (onError) onError(new Error(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [canMakeRequest, waitTime, trackRequest, signalRateLimitHit, configRef, onError]);

  // Método combinado para generar respuesta y luego reproducirla
  const generateResponseAndSpeech = useCallback(async (
    message: string, 
    language: string,
    ttsCallbacks: { onStart?: () => void; onEnd?: () => void; onError?: (e: any) => void }
  ): Promise<string> => {
    const responseText = await sendMessage(message, language);
    
    if (responseText) {
      try {
        await textToSpeech(responseText, language, ttsCallbacks);
      } catch (ttsError) {
        console.error("[RobotInteraction] Error durante TTS en generateResponseAndSpeech:", ttsError);
        // El error ya debería haber sido manejado por textToSpeech o speakWithWebSpeech a través de ttsCallbacks.onError
        // No es necesario propagarlo más a menos que se quiera un manejo de error adicional aquí.
      }
    }
    return responseText;
  }, [sendMessage, textToSpeech]);

  // Método para limpiar el historial
  const clearHistory = useCallback(() => {
    setHistory([{ role: 'system', content: systemPromptRef.current }]);
    setCurrentResponse('');
    setError(null);
  }, [systemPromptRef]); // systemPromptRef es un ref, no necesita estar en dependencias si no cambia su .current

  // Actualizar el system prompt
  const updateSystemPrompt = useCallback((newPrompt: string) => {
    systemPromptRef.current = newPrompt;
    
    setHistory(prev => {
      const newHistory = [...prev];
      if (newHistory.length > 0 && newHistory[0].role === 'system') {
        newHistory[0] = { role: 'system', content: newPrompt };
      } else {
        newHistory.unshift({ role: 'system', content: newPrompt });
      }
      // Asegurar que no crezca indefinidamente si se llama múltiples veces
      return newHistory.slice(-maxHistoryLength -1); // Mantener espacio para el prompt y maxHistoryLength mensajes
    });
  }, [maxHistoryLength]); // Incluir maxHistoryLength

  return {
    // Estado
    isProcessing,
    currentResponse,
    error,
    history,
    waitTime,
    
    // Métodos para conversar
    sendMessage,
    clearHistory,
    updateSystemPrompt,
    
    // Métodos para voz
    processAudio,
    textToSpeech,
    generateResponseAndSpeech
  };
}; 