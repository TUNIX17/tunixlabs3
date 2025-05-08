export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
  language?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  language: string;
}

export interface ConversationState {
  currentConversationId: string | null;
  conversations: Record<string, Conversation>;
  error: string | null;
  loading: boolean;
}

export interface ConversationConfig {
  maxMessagesPerConversation: number;
  maxConversations: number;
  defaultSystemPrompt: string;
  defaultLanguage: string;
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'groq' | 'anthropic' | 'openai' | 'local';
  description: string;
  maxTokens: number;
  contextWindow: number;
  temperature: number;
  capabilities: AIModelCapability[];
}

export type AIModelCapability = 
  | 'chat'
  | 'text-to-speech'
  | 'speech-to-text'
  | 'image-generation'
  | 'code-generation';

export interface AIRequest {
  id: string;
  model: string;
  messages: Message[];
  options: AIRequestOptions;
  timestamp: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  systemPrompt?: string;
  language?: string;
}

export interface AIResponse {
  id: string;
  requestId: string;
  message: Message;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: number;
  latency: number;
}

export interface ConversationEvent {
  type: 
    | 'message:sent'
    | 'message:received'
    | 'message:error'
    | 'message:stream'
    | 'conversation:started'
    | 'conversation:ended'
    | 'conversation:saved'
    | 'conversation:deleted';
  payload: any;
  timestamp: number;
} 