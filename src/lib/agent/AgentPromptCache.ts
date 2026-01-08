/**
 * Cache de Prompts del Agente
 * Singleton para evitar reconstruir prompts en cada turno
 */

import { AgentConfig, DEFAULT_AGENT_CONFIG } from './AgentConfig';
import { ConversationContext } from './ConversationState';
import { getCommercialPrompt, buildDynamicPrompt } from './prompts/commercialAgent';

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
   * Cacheado por idioma
   */
  getBasePrompt(language: string): string {
    // Si el idioma cambio, invalidar cache
    if (this.cachedLanguage !== language) {
      this.cachedBasePrompt = null;
      this.cachedLanguage = language;
    }

    // Retornar cache si existe
    if (this.cachedBasePrompt) {
      return this.cachedBasePrompt;
    }

    // Construir y cachear
    this.cachedBasePrompt = getCommercialPrompt(language);
    console.log('[AgentPromptCache] Base prompt cacheado para idioma:', language);

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
    return this.cachedLanguage === language && this.cachedBasePrompt !== null;
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
