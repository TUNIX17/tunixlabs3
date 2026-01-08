import axios from 'axios';

/**
 * Cliente Axios para comunicarse con la API de Cerebras a través del proxy interno.
 * La API de Cerebras es compatible con OpenAI, facilitando la migración.
 */
export const cerebrasClient = axios.create({
  baseURL: '/api/cerebras-proxy',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Modelos disponibles en Cerebras Inference
 * Todos disponibles en el Free Tier (1M tokens/día)
 */
export const CEREBRAS_MODELS = {
  // Modelos de conversación (LLM)
  conversation: {
    small: 'llama3.1-8b',      // 8B params, ~2200 tok/s
    large: 'llama-3.3-70b',    // 70B params, ~2100 tok/s - RECOMENDADO
    xlarge: 'qwen-3-32b',      // 32B params, ~2600 tok/s
  }
};

/**
 * Configuraciones para diferentes escenarios de uso con Cerebras
 */
export const CEREBRAS_CONFIGS = {
  // Configuración estándar - usa Llama 3.3 70B (gratis y potente)
  standard: {
    model: CEREBRAS_MODELS.conversation.large,
    temperature: 0.7,
    maxTokens: 500,
  },
  // Configuración de alta calidad - misma que estándar ya que 70B es el mejor
  highQuality: {
    model: CEREBRAS_MODELS.conversation.large,
    temperature: 0.6,
    maxTokens: 1000,
  },
  // Configuración para respuestas cortas
  concise: {
    model: CEREBRAS_MODELS.conversation.large,
    temperature: 0.5,
    maxTokens: 250,
  }
};

/**
 * Seleccionar configuración de Cerebras según el escenario
 */
export const selectCerebrasConfig = (
  isHighQuality: boolean = false,
  isConcise: boolean = false
) => {
  if (isConcise) return CEREBRAS_CONFIGS.concise;
  if (isHighQuality) return CEREBRAS_CONFIGS.highQuality;
  return CEREBRAS_CONFIGS.standard;
};
