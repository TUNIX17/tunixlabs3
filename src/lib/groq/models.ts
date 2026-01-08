// Definición de modelos disponibles en Groq
// NOTA: LLM migrado a Cerebras. Groq se usa solo para STT (Whisper)
export const GROQ_MODELS = {
  // Modelos de texto a texto (conversación) - DEPRECADO, usar Cerebras
  // Se mantienen por compatibilidad/fallback
  conversation: {
    small: 'llama-3.1-8b-instant',    // Más rápido, menor calidad
    large: 'llama-3.3-70b-versatile', // Más lento, mayor calidad
  },
  // Modelos de audio a texto - ACTIVO (Groq Whisper es el más económico)
  speechToText: {
    default: 'whisper-large-v3-turbo', // Más rápido - $0.04/hora
    accurate: 'whisper-large-v3',      // Más preciso - $0.11/hora
  },
  // Modelos de texto a audio - DEPRECADO (usamos Web Speech API)
  textToSpeech: {
    default: 'playai-tts',
    arabic: 'playai-tts-arabic',
  }
};

// Modelos de Cerebras para LLM (Free Tier: 1M tokens/día)
export const CEREBRAS_MODELS = {
  conversation: {
    small: 'llama3.1-8b',      // 8B params, ~2200 tok/s
    large: 'llama-3.3-70b',    // 70B params, ~2100 tok/s - PRINCIPAL
    xlarge: 'qwen-3-32b',      // 32B params, ~2600 tok/s
  }
};

// Configuraciones para diferentes escenarios de uso
// LLM: Cerebras (gratis, 6x más rápido)
// STT: Groq Whisper (más económico del mercado)
// TTS: Web Speech API (gratis)
export const MODEL_CONFIGS = {
  // Configuración para uso regular - Cerebras Llama 3.3 70B
  standard: {
    conversation: CEREBRAS_MODELS.conversation.large, // Cerebras 70B (GRATIS)
    speechToText: GROQ_MODELS.speechToText.default,   // Groq Whisper ($0.04/hr)
    textToSpeech: GROQ_MODELS.textToSpeech.default,   // No usado (Web Speech API)
    temperature: 0.7,
    maxResponseTokens: 500,
    useCerebras: true, // Flag para indicar que LLM usa Cerebras
  },
  // Configuración para mayor calidad
  highQuality: {
    conversation: CEREBRAS_MODELS.conversation.large,
    speechToText: GROQ_MODELS.speechToText.accurate,
    textToSpeech: GROQ_MODELS.textToSpeech.default,
    temperature: 0.6,
    maxResponseTokens: 1000,
    useCerebras: true,
  },
  // Configuración para respuestas concisas
  highTraffic: {
    conversation: CEREBRAS_MODELS.conversation.large,
    speechToText: GROQ_MODELS.speechToText.default,
    textToSpeech: GROQ_MODELS.textToSpeech.default,
    maxResponseTokens: 250,
    temperature: 0.5,
    useCerebras: true,
  }
};

// Función para seleccionar modelos según condiciones actuales
export const selectModelConfig = (
  currentTraffic: number = 0,  // Número estimado de usuarios concurrentes
  isHighQualityEnabled: boolean = false // Preferencia de calidad
) => {
  // Si hay más de un usuario concurrente, usar configuración de alto tráfico
  if (currentTraffic > 1) {
    return MODEL_CONFIGS.highTraffic;
  }
  
  // Si se solicita alta calidad, usar esa configuración
  if (isHighQualityEnabled) {
    return MODEL_CONFIGS.highQuality;
  }
  
  // Por defecto, usar configuración estándar
  return MODEL_CONFIGS.standard;
}; 