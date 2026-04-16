'use client';

/**
 * React hook that drives a headless Chatwoot conversation.
 *
 * Lifecycle:
 *  1. `enabled=false` keeps the hook idle (no API calls).
 *  2. First `enabled=true` bootstraps: reads `localStorage` → either resumes
 *     a prior conversation or creates contact + conversation.
 *  3. Opens an ActionCable WebSocket subscription so agent replies appear
 *     in real time. Auto-reconnects on drop.
 *  4. `sendMessage` does an optimistic update; the server-acked bubble
 *     replaces the temp one, or the temp is marked as `status: 'error'`.
 *  5. `disconnect` on unmount.
 *
 * Direction mapping (UI convention vs Chatwoot convention):
 *   - message_type === 0 → incoming in Chatwoot (customer sent) → 'outgoing' in UI (right-aligned)
 *   - message_type === 1 → outgoing in Chatwoot (agent sent)     → 'incoming' in UI (left-aligned)
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChatwootError,
  type ChatwootMessage,
  createContact,
  createConversation,
  listMessages,
  sendMessage as apiSendMessage,
} from '@/lib/chatwoot/client';
import { ChatwootCable } from '@/lib/chatwoot/cable';
import { STORAGE_KEY } from '@/lib/chatwoot/config';

export type UIMessage = {
  id: string | number;
  content: string;
  direction: 'incoming' | 'outgoing';
  createdAt: number;
  status?: 'sending' | 'sent' | 'error';
};

type StoredState = {
  source_id: string;
  pubsub_token: string;
  conversation_id: number;
};

function readStore(): StoredState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.source_id || !parsed?.pubsub_token || typeof parsed?.conversation_id !== 'number') {
      return null;
    }
    return parsed as StoredState;
  } catch {
    return null;
  }
}

function writeStore(state: StoredState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function clearStore(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function toUIMessage(m: ChatwootMessage): UIMessage {
  return {
    id: m.id,
    content: m.content,
    direction: m.message_type === 0 ? 'outgoing' : 'incoming',
    createdAt: (m.created_at ?? Math.floor(Date.now() / 1000)) * 1000,
    status: 'sent',
  };
}

export type UseChatwootChat = {
  messages: UIMessage[];
  isConnected: boolean;
  isAgentTyping: boolean;
  isBootstrapping: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
};

export function useChatwootChat(enabled: boolean): UseChatwootChat {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stateRef = useRef<StoredState | null>(null);
  const cableRef = useRef<ChatwootCable | null>(null);
  const bootstrappedRef = useRef(false);

  const bootstrap = useCallback(async () => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    setIsBootstrapping(true);
    setError(null);
    try {
      let stored = readStore();
      if (stored) {
        try {
          const history = await listMessages(stored.source_id, stored.conversation_id);
          // Chatwoot returns newest → oldest; reverse for chronological display.
          setMessages([...history].reverse().map(toUIMessage));
        } catch (err) {
          if (err instanceof ChatwootError && (err.status === 404 || err.status === 401)) {
            clearStore();
            stored = null;
          } else {
            throw err;
          }
        }
      }
      if (!stored) {
        const contact = await createContact();
        const conv = await createConversation(contact.source_id);
        stored = {
          source_id: contact.source_id,
          pubsub_token: contact.pubsub_token,
          conversation_id: conv.id,
        };
        writeStore(stored);
      }
      stateRef.current = stored;

      const cable = new ChatwootCable(stored.pubsub_token);
      cableRef.current = cable;
      cable.on('connected', () => setIsConnected(true));
      cable.on('disconnected', () => setIsConnected(false));
      cable.on('typing_on', () => setIsAgentTyping(true));
      cable.on('typing_off', () => setIsAgentTyping(false));
      cable.on('message', ({ message }) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, toUIMessage(message)];
        });
        // Any inbound message means the agent stopped typing.
        setIsAgentTyping(false);
      });
      cable.connect();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      bootstrappedRef.current = false; // allow retry on next enable
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void bootstrap();
  }, [enabled, bootstrap]);

  useEffect(() => {
    return () => {
      cableRef.current?.disconnect();
      cableRef.current = null;
    };
  }, []);

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    const text = content.trim();
    if (!text) return;
    const state = stateRef.current;
    if (!state) {
      setError('chat not ready');
      return;
    }
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        content: text,
        direction: 'outgoing',
        createdAt: Date.now(),
        status: 'sending',
      },
    ]);
    try {
      const saved = await apiSendMessage(state.source_id, state.conversation_id, text);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...toUIMessage(saved), status: 'sent' } : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'error' } : m))
      );
    }
  }, []);

  return { messages, isConnected, isAgentTyping, isBootstrapping, error, sendMessage };
}
