/**
 * Cache de Prompts del Agente
 * Singleton para evitar reconstruir prompts en cada turno
 */

import { AgentConfig, DEFAULT_AGENT_CONFIG } from './AgentConfig';
import { ConversationContext } from './ConversationState';
import { getCommercialPrompt, buildDynamicPrompt } from './prompts/commercialAgent';

// Mapeo de nombres de idioma a códigos ISO
const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  'spanish': 'es',
  'español': 'es',
  'english': 'en',
  'inglés': 'en',
};

// Idiomas soportados por el sistema
const SUPPORTED_LANGUAGES = ['es', 'en'];

/**
 * Normaliza el código de idioma a formato ISO (es, en)
 * SOLO acepta español e inglés - otros idiomas retornan 'es' por defecto
 */
const normalizeLanguageCode = (lang: string): string => {
  if (!lang) return 'es';
  const langLower = lang.toLowerCase().trim();
  if (LANGUAGE_NAME_TO_CODE[langLower]) return LANGUAGE_NAME_TO_CODE[langLower];
  let langCode = langLower;
  if (langLower.includes('-')) langCode = langLower.split('-')[0];
  if (SUPPORTED_LANGUAGES.includes(langCode)) return langCode;
  return 'es'; // Idioma no soportado - usar español por defecto
};

/**
 * Singleton para cachear y gestionar prompts del agente
 */
export class AgentPromptCache {
  private static instance: AgentPromptCache;

  private cachedBasePrompt: string | null = null;
  private cachedLanguage: string | null = null;
  private config: AgentConfig;

  private constructor() {
    this.config = DEFAULT_AGENT_CONFIG;
  }

  /**
   * Obtener instancia singleton
   */
  static getInstance(): AgentPromptCache {
    if (!AgentPromptCache.instance) {
      AgentPromptCache.instance = new AgentPromptCache();
    }
    return AgentPromptCache.instance;
  }

  /**
   * Actualizar configuracion del agente
   */
  setConfig(config: AgentConfig): void {
    this.config = config;
    this.invalidate();
  }

  /**
   * Obtener configuracion actual
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Obtener prompt base (sin contexto dinamico)
   * Cacheado por idioma (normalizado a código ISO)
   */
  getBasePrompt(language: string): string {
    // Normalizar idioma a código ISO (ej: "Spanish" -> "es")
    const normalizedLang = normalizeLanguageCode(language);

    // Si el idioma cambio, invalidar cache
    if (this.cachedLanguage !== normalizedLang) {
      this.cachedBasePrompt = null;
      this.cachedLanguage = normalizedLang;
    }

    // Retornar cache si existe
    if (this.cachedBasePrompt) {
      return this.cachedBasePrompt;
    }

    // Construir y cachear
    this.cachedBasePrompt = getCommercialPrompt(normalizedLang);
    console.log('[AgentPromptCache] Base prompt cacheado para idioma:', normalizedLang);

    return this.cachedBasePrompt;
  }

  /**
   * Obtener prompt completo con contexto de conversacion
   * El contexto se inyecta dinamicamente, pero el base se cachea
   */
  getFullPrompt(language: string, contextSection: string): string {
    const basePrompt = this.getBasePrompt(language);
    return buildDynamicPrompt(basePrompt, contextSection);
  }

  /**
   * Construir prompt con contexto completo
   */
  buildPromptWithContext(
    language: string,
    context: ConversationContext
  ): string {
    const basePrompt = this.getBasePrompt(language);

    // Construir seccion de contexto
    let contextStr = '\n## CONTEXTO DE LA CONVERSACION\n';
    contextStr += `- Fase actual: ${context.phase}\n`;
    contextStr += `- Turno: ${context.turnCount}\n`;

    if (context.leadData.name) {
      contextStr += `- Prospecto: ${context.leadData.name}\n`;
    }
    if (context.leadData.company) {
      contextStr += `- Empresa: ${context.leadData.company}\n`;
    }
    if (context.leadData.interest?.length) {
      contextStr += `- Servicios de interes: ${context.leadData.interest.join(', ')}\n`;
    }
    if (context.leadData.painPoints?.length) {
      contextStr += `- Problemas mencionados: ${context.leadData.painPoints.join('; ')}\n`;
    }
    if (context.objections.length > 0) {
      contextStr += `- Objeciones previas: ${context.objections.join('; ')}\n`;
    }
    if (context.lastTopic) {
      contextStr += `- Ultimo tema discutido: ${context.lastTopic}\n`;
    }

    return basePrompt + contextStr;
  }

  /**
   * Invalidar cache
   */
  invalidate(): void {
    this.cachedBasePrompt = null;
    this.cachedLanguage = null;
    console.log('[AgentPromptCache] Cache invalidado');
  }

  /**
   * Verificar si hay cache valido
   */
  hasCachedPrompt(language: string): boolean {
    const normalizedLang = normalizeLanguageCode(language);
    return this.cachedLanguage === normalizedLang && this.cachedBasePrompt !== null;
  }

  /**
   * Obtener estadisticas del cache
   */
  getStats(): { hasCachedPrompt: boolean; cachedLanguage: string | null; promptLength: number } {
    return {
      hasCachedPrompt: this.cachedBasePrompt !== null,
      cachedLanguage: this.cachedLanguage,
      promptLength: this.cachedBasePrompt?.length ?? 0
    };
  }
}

// Export singleton instance helper
export const getAgentPromptCache = (): AgentPromptCache => {
  return AgentPromptCache.getInstance();
};
