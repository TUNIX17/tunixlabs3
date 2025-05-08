// Definición de modelos disponibles en Groq
export const GROQ_MODELS = {
  // Modelos de texto a texto (conversación)
  conversation: {
    small: 'llama-3.1-8b-instant',    // Más rápido, menor calidad
    large: 'llama-3.3-70b-versatile', // Más lento, mayor calidad
  },
  // Modelos de audio a texto
  speechToText: {
    default: 'whisper-large-v3-turbo', // Más rápido
    accurate: 'whisper-large-v3',      // Más preciso
  },
  // Modelos de texto a audio
  textToSpeech: {
    default: 'playai-tts',
    arabic: 'playai-tts-arabic',
  }
};

// Configuraciones para diferentes escenarios de uso
export const MODEL_CONFIGS = {
  // Configuración para uso regular (sin alta carga)
  standard: {
    conversation: GROQ_MODELS.conversation.small,
    speechToText: GROQ_MODELS.speechToText.default,
    textToSpeech: GROQ_MODELS.textToSpeech.default,
    temperature: 0.7,
    maxResponseTokens: 500,
  },
  // Configuración para mayor calidad (sacrifica velocidad)
  highQuality: {
    conversation: GROQ_MODELS.conversation.large,
    speechToText: GROQ_MODELS.speechToText.accurate,
    textToSpeech: GROQ_MODELS.textToSpeech.default,
    temperature: 0.6,
    maxResponseTokens: 1000,
  },
  // Configuración para alto tráfico (optimiza límites de API)
  highTraffic: {
    conversation: GROQ_MODELS.conversation.small,
    speechToText: GROQ_MODELS.speechToText.default,
    textToSpeech: GROQ_MODELS.textToSpeech.default,
    // Parámetros adicionales para optimizar tokens
    maxResponseTokens: 150,
    temperature: 0.5,
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