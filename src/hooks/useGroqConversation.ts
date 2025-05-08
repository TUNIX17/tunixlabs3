import { useState, useCallback, useRef } from 'react';
import { apiClient } from '../lib/groq/client';
import { selectModelConfig } from '../lib/groq/models';
import { useRateLimiter } from '../lib/groq/rate-limiter';
import axios, { isAxiosError, AxiosError } from 'axios';

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
  initialSystemPrompt = "Eres Tunix, un asistente virtual experto de Tunixlabs, una consultora líder en Inteligencia Artificial. Tu principal objetivo es ayudar a los usuarios a comprender cómo la IA puede transformar sus negocios y resolver sus desafíos. Proporciona información clara, precisa y útil sobre nuestros servicios de consultoría, que incluyen desarrollo de estrategias de IA, implementación de modelos de Machine Learning, LLMs, Computer Vision, procesamiento de lenguaje natural, y automatización inteligente. Responde profesionalmente, enfócate en soluciones y casos de uso relevantes para empresas. No inventes servicios ni capacidades que Tunixlabs no ofrece. Si la pregunta del usuario es ambigua o muy general, puedes hacer preguntas para clarificar sus necesidades y así ofrecer una respuesta más valiosa. Evita respuestas genéricas; adapta tus explicaciones a cómo la IA puede impactar positivamente los objetivos del usuario.",
  maxHistoryLength = 10,
  onStart,
  onComplete,
  onError
}: UseGroqConversationOptions = {}) => {
  // Estados principales
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Historial de mensajes
  const [history, setHistory] = useState<ConversationMessage[]>([
    { role: 'system', content: initialSystemPrompt }
  ]);
  
  // Mantener referencia al system prompt actual
  const systemPromptRef = useRef<string>(initialSystemPrompt);
  
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
      
      // Actualizar system prompt si el lenguaje es diferente del español
      if (language && language !== 'es' && language !== 'auto') {
        systemPromptRef.current = `Eres un asistente de IA amigable llamado Tunix. Debes responder en ${language}. Tus respuestas deben ser concisas y útiles.`;
      } else {
        systemPromptRef.current = initialSystemPrompt;
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
      
      // Realizar petición a Groq vía el proxy, especificando el tipo de respuesta esperado
      const response = await apiClient.post<GroqChatCompletionResponse>('', {
        endpoint: '/chat/completions',
        payload: {
          model: configRef.current.conversation,
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
    initialSystemPrompt,
    onStart,
    onComplete,
    onError
  ]);

  // Método para convertir texto a voz usando Groq vía el proxy
  const textToSpeech = useCallback(async (text: string, language: string = 'es'): Promise<Blob | null> => {
    if (!text.trim()) {
      return null;
    }
    
    // Verificar límites
    if (!canMakeRequest) {
      const errorMsg = `Límite de API alcanzado. Por favor, espera ${Math.ceil(waitTime / 1000)} segundos.`;
      setError(errorMsg);
      
      if (onError) {
        onError(new Error(errorMsg));
      }
      
      return null;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Registrar petición
      trackRequest();
      
      // Seleccionar voz según idioma
      let voice = 'es-male-1'; // Voz por defecto en español
      
      // Mapeo básico de idiomas a voces
      if (language === 'en') {
        voice = 'en-female-1';
      } else if (language === 'ar') {
        voice = 'ar-male-1';
      }
      
      // Realizar petición a Groq para TTS vía el proxy
      const response = await apiClient.post<ArrayBuffer>('', {
        endpoint: '/audio/speech',
        payload: {
          model: configRef.current.textToSpeech,
          input: text,
          voice: voice,
          response_format: 'mp3'
        },
        responseType: 'arraybuffer'
      });
      
      // response.data ahora es de tipo ArrayBuffer
      if (response.data && response.data.byteLength > 0) {
        return new Blob([response.data], { type: 'audio/mpeg' });
      } else {
        setError('La respuesta de Text-to-Speech no contenía datos de audio válidos.');
        if (onError) {
          onError(new Error('La respuesta de Text-to-Speech no contenía datos de audio válidos.'));
        }
        return null;
      }
    } catch (error: any) {
      let errorMessage = 'Error desconocido al convertir texto a voz';
      if (error && error.response) {
        const errorData = error.response.data;
        const status = error.response.status;
        errorMessage = errorData?.error?.message || errorData?.error || errorData?.message || error.message || 'Error en Text-to-Speech';

        const retryAfterHeader = error.response.headers?.['retry-after'];
        if (status === 429 && retryAfterHeader) {
          const retrySeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(retrySeconds)) {
            signalRateLimitHit(retrySeconds);
            errorMessage = `Demasiadas peticiones a TTS. Intenta de nuevo en ${retrySeconds} segundos. (Mensaje original: ${errorMessage})`;
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      if (onError) onError(new Error(errorMessage));
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [canMakeRequest, waitTime, trackRequest, signalRateLimitHit, onError]);

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

  // Nueva función para obtener respuesta del LLM y el audio TTS, dado un texto de entrada.
  const generateResponseAndSpeech = useCallback(async (
    inputText: string, 
    language: string
  ): Promise<{ responseText: string, responseAudioBlob: Blob | null }> => {
    if (!inputText.trim()) {
      throw new Error('El texto de entrada está vacío.');
    }

    // Marcar inicio de procesamiento para esta secuencia (LLM + TTS)
    // El estado general de isProcessing ya podría estar activo por la transcripción.
    // Se puede refinar esto si se necesita un control de estado más granular.
    // setIsProcessing(true); // Comentado por ahora, ya que el flujo mayor lo controla.
    // setError(null);

    try {
      // 1. Generar respuesta del LLM
      const responseText = await sendMessage(inputText, language);
      if (!responseText) {
        throw new Error('No se pudo generar una respuesta de texto del LLM.');
      }

      // 2. Convertir respuesta a voz
      const responseAudioBlob = await textToSpeech(responseText, language);
      // No es un error crítico si TTS falla, el texto aún puede mostrarse.
      if (!responseAudioBlob) {
        console.warn('No se pudo generar audio para la respuesta del robot.');
      }

      return {
        responseText,
        responseAudioBlob
      };
    } catch (error) {
      // El manejo de error ya se hace en sendMessage y textToSpeech, 
      // que llaman a setError y onError.
      // Aquí solo relanzamos para que el llamador (useRobotInteraction) sepa.
      console.error('Error en generateResponseAndSpeech:', error);
      throw error; // Relanzar para que useRobotInteraction lo maneje.
    } finally {
      // setIsProcessing(false); // Comentado por ahora.
    }
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