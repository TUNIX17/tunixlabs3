/**
 * Chatwoot ActionCable WebSocket wrapper.
 *
 * Subscribes to RoomChannel with the contact's pubsub_token and exposes
 * a small event-emitter interface. Handles reconnection with exponential
 * backoff and a 30s ping to keep the socket alive behind proxies.
 */
import { CHATWOOT } from './config';
import type { ChatwootMessage } from './client';

type CableEvents = {
  message: { message: ChatwootMessage };
  typing_on: void;
  typing_off: void;
  connected: void;
  disconnected: void;
};

type Listener<K extends keyof CableEvents> = (payload: CableEvents[K]) => void;

export class ChatwootCable {
  private ws: WebSocket | null = null;
  private pubsubToken: string;
  private listeners: Map<keyof CableEvents, Set<Listener<keyof CableEvents>>> = new Map();
  private retries = 0;
  private readonly maxRetries = 10;
  private destroyed = false;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(pubsubToken: string) {
    this.pubsubToken = pubsubToken;
  }

  connect(): void {
    if (this.destroyed || typeof WebSocket === 'undefined') return;
    try {
      this.ws = new WebSocket(CHATWOOT.cableUrl);
    } catch {
      this.scheduleReconnect();
      return;
    }
    this.ws.addEventListener('open', this.handleOpen);
    this.ws.addEventListener('message', this.handleMessage);
    this.ws.addEventListener('close', this.handleClose);
    this.ws.addEventListener('error', this.handleError);
  }

  disconnect(): void {
    this.destroyed = true;
    this.clearPing();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.removeEventListener('open', this.handleOpen);
      this.ws.removeEventListener('message', this.handleMessage);
      this.ws.removeEventListener('close', this.handleClose);
      this.ws.removeEventListener('error', this.handleError);
      try { this.ws.close(); } catch {}
      this.ws = null;
    }
    this.listeners.clear();
  }

  on<K extends keyof CableEvents>(event: K, cb: Listener<K>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(cb as Listener<keyof CableEvents>);
    return () => {
      this.listeners.get(event)?.delete(cb as Listener<keyof CableEvents>);
    };
  }

  private emit<K extends keyof CableEvents>(event: K, payload: CableEvents[K]): void {
    this.listeners.get(event)?.forEach((cb) => {
      try { (cb as Listener<K>)(payload); } catch {}
    });
  }

  private handleOpen = (): void => {
    this.retries = 0;
    this.ws?.send(
      JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'RoomChannel',
          pubsub_token: this.pubsubToken,
        }),
      })
    );
    this.emit('connected', undefined);
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify({ type: 'ping' })); } catch {}
      }
    }, 30000);
  };

  private handleMessage = (ev: MessageEvent): void => {
    let raw: { type?: string; message?: { event?: string } & ChatwootMessage } | null = null;
    try { raw = JSON.parse(ev.data); } catch { return; }
    if (!raw) return;

    // ActionCable framing messages we can ignore
    if (raw.type === 'welcome' || raw.type === 'ping' || raw.type === 'confirm_subscription' || raw.type === 'reject_subscription') {
      return;
    }

    const payload = raw.message;
    if (!payload) return;

    // Chatwoot sends multiple event shapes — inspect both `payload.event` and payload itself
    const eventName = payload.event;
    if (eventName === 'conversation.typing_on') {
      this.emit('typing_on', undefined);
      return;
    }
    if (eventName === 'conversation.typing_off') {
      this.emit('typing_off', undefined);
      return;
    }
    if (eventName === 'message.created' || typeof payload.message_type === 'number') {
      this.emit('message', { message: payload as ChatwootMessage });
    }
  };

  private handleError = (): void => {
    // onclose fires after error — delegate reconnection there
  };

  private handleClose = (): void => {
    this.clearPing();
    this.emit('disconnected', undefined);
    if (this.destroyed) return;
    this.scheduleReconnect();
  };

  private scheduleReconnect(): void {
    if (this.retries >= this.maxRetries) return;
    const delay = Math.min(1000 * Math.pow(2, this.retries), 30000);
    this.retries++;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private clearPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}
