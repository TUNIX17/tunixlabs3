/**
 * Agent Module Exports
 * Sistema de agente comercial para TunixLabs
 */

// Configuracion
export {
  type AgentConfig,
  type AgentPersonality,
  type AgentGoals,
  type ServiceInfo,
  DEFAULT_AGENT_CONFIG,
  getServiceById,
  findRelevantServices
} from './AgentConfig';

// Estado de conversacion
export {
  ConversationPhase,
  type LeadData,
  type ConversationContext,
  AgentStateTracker
} from './ConversationState';

// Cache de prompts
export {
  AgentPromptCache,
  getAgentPromptCache
} from './AgentPromptCache';

// Prompts
export {
  TUNIX_COMMERCIAL_AGENT_PROMPT_ES,
  TUNIX_COMMERCIAL_AGENT_PROMPT_EN,
  getCommercialPrompt,
  buildDynamicPrompt
} from './prompts/commercialAgent';
