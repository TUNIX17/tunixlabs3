/**
 * Manejo de Sesion de Conversacion
 * Controla timeouts, auto-restart y duracion de sesion
 */

/** Configuracion de sesion */
export interface ConversationSessionConfig {
  /** Auto-restart listening despues de que el robot habla */
  autoRestartListening: boolean;

  /** Timeout para salir de conversacion cuando idle (ms) */
  idleTimeoutMs: number;

  /** Timeout para salir de listening si no hay speech (ms) */
  listenTimeoutMs: number;

  /** Duracion maxima de sesion (ms) */
  maxSessionDurationMs: number;

  /** Tiempo minimo del robot hablando antes de permitir barge-in (ms) */
  minSpeakingTimeBeforeBargeIn: number;
}

/** Estado de la sesion */
export interface SessionState {
  isActive: boolean;
  sessionStartTime: number | null;
  lastActivityTime: number | null;
  turnCount: number;
  speakingStartTime: number | null;
}

/** Eventos de sesion */
export type SessionEvent =
  | 'session_start'
  | 'session_end'
  | 'idle_timeout'
  | 'listen_timeout'
  | 'max_duration_reached'
  | 'activity';

/** Callback para eventos */
export type SessionCallback = (event: SessionEvent) => void;

/** Configuracion por defecto */
export const DEFAULT_SESSION_CONFIG: ConversationSessionConfig = {
  autoRestartListening: true,
  idleTimeoutMs: 60000,           // 60s sin actividad → terminar
  listenTimeoutMs: 30000,         // 30s esperando voz → terminar
  maxSessionDurationMs: 600000,   // 10 minutos maximo
  minSpeakingTimeBeforeBargeIn: 1000 // 1s minimo antes de barge-in
};

/**
 * Clase para manejar sesion de conversacion
 */
export class ConversationSession {
  private config: ConversationSessionConfig;
  private state: SessionState;
  private callbacks: Set<SessionCallback>;

  // Timers
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private listenTimer: ReturnType<typeof setTimeout> | null = null;
  private maxDurationTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: Partial<ConversationSessionConfig> = {}) {
    this.config = { ...DEFAULT_SESSION_CONFIG, ...config };
    this.state = {
      isActive: false,
      sessionStartTime: null,
      lastActivityTime: null,
      turnCount: 0,
      speakingStartTime: null
    };
    this.callbacks = new Set();
  }

  /**
   * Iniciar sesion de conversacion
   */
  startSession(): void {
    if (this.state.isActive) {
      console.warn('[ConversationSession] Sesion ya activa');
      return;
    }

    const now = Date.now();
    this.state = {
      isActive: true,
      sessionStartTime: now,
      lastActivityTime: now,
      turnCount: 0,
      speakingStartTime: null
    };

    // Iniciar timer de duracion maxima
    this.startMaxDurationTimer();

    this.emit('session_start');
    console.log('[ConversationSession] Sesion iniciada');
  }

  /**
   * Terminar sesion de conversacion
   */
  endSession(): void {
    if (!this.state.isActive) {
      return;
    }

    this.clearAllTimers();

    this.state.isActive = false;
    this.emit('session_end');

    console.log('[ConversationSession] Sesion terminada. Turnos:', this.state.turnCount);
  }

  /**
   * Registrar actividad (resetea idle timer)
   */
  recordActivity(): void {
    if (!this.state.isActive) {
      return;
    }

    this.state.lastActivityTime = Date.now();
    this.resetIdleTimer();
    this.emit('activity');
  }

  /**
   * Registrar turno de conversacion
   */
  recordTurn(): void {
    if (!this.state.isActive) {
      return;
    }

    this.state.turnCount++;
    this.recordActivity();
    console.log('[ConversationSession] Turno:', this.state.turnCount);
  }

  /**
   * Iniciar estado de listening (inicia listen timer)
   */
  startListening(): void {
    if (!this.state.isActive) {
      return;
    }

    this.clearListenTimer();
    this.recordActivity();

    // Iniciar timer de listen timeout
    this.listenTimer = setTimeout(() => {
      console.log('[ConversationSession] Listen timeout alcanzado');
      this.emit('listen_timeout');
      this.endSession();
    }, this.config.listenTimeoutMs);
  }

  /**
   * Detener estado de listening (cancela listen timer)
   */
  stopListening(): void {
    this.clearListenTimer();
    this.recordActivity();
  }

  /**
   * Registrar inicio de habla del robot
   */
  startSpeaking(): void {
    if (!this.state.isActive) {
      return;
    }

    this.state.speakingStartTime = Date.now();
    this.recordActivity();
  }

  /**
   * Registrar fin de habla del robot
   */
  stopSpeaking(): void {
    this.state.speakingStartTime = null;
    this.recordActivity();
  }

  /**
   * Verificar si se puede hacer barge-in
   */
  canBargeIn(): boolean {
    if (!this.state.isActive || !this.state.speakingStartTime) {
      return false;
    }

    const speakingDuration = Date.now() - this.state.speakingStartTime;
    return speakingDuration >= this.config.minSpeakingTimeBeforeBargeIn;
  }

  /**
   * Verificar si se debe auto-restart listening
   */
  shouldAutoRestart(): boolean {
    if (!this.state.isActive) {
      return false;
    }

    // No auto-restart si la sesion esta por expirar
    if (this.isSessionExpiring()) {
      return false;
    }

    return this.config.autoRestartListening;
  }

  /**
   * Verificar si la sesion esta activa
   */
  isActive(): boolean {
    return this.state.isActive;
  }

  /**
   * Verificar si la sesion esta por expirar (ultimos 30s)
   */
  isSessionExpiring(): boolean {
    if (!this.state.isActive || !this.state.sessionStartTime) {
      return false;
    }

    const elapsed = Date.now() - this.state.sessionStartTime;
    const remaining = this.config.maxSessionDurationMs - elapsed;
    return remaining < 30000; // Menos de 30s
  }

  /**
   * Obtener tiempo restante de sesion (ms)
   */
  getRemainingTime(): number {
    if (!this.state.isActive || !this.state.sessionStartTime) {
      return 0;
    }

    const elapsed = Date.now() - this.state.sessionStartTime;
    return Math.max(0, this.config.maxSessionDurationMs - elapsed);
  }

  /**
   * Obtener duracion actual de sesion (ms)
   */
  getSessionDuration(): number {
    if (!this.state.sessionStartTime) {
      return 0;
    }
    return Date.now() - this.state.sessionStartTime;
  }

  /**
   * Obtener numero de turnos
   */
  getTurnCount(): number {
    return this.state.turnCount;
  }

  /**
   * Obtener estado actual
   */
  getState(): SessionState {
    return { ...this.state };
  }

  /**
   * Obtener configuracion
   */
  getConfig(): ConversationSessionConfig {
    return { ...this.config };
  }

  /**
   * Actualizar configuracion
   */
  updateConfig(config: Partial<ConversationSessionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Registrar callback para eventos
   */
  onEvent(callback: SessionCallback): void {
    this.callbacks.add(callback);
  }

  /**
   * Remover callback
   */
  offEvent(callback: SessionCallback): void {
    this.callbacks.delete(callback);
  }

  // Metodos privados

  private emit(event: SessionEvent): void {
    this.callbacks.forEach(cb => {
      try {
        cb(event);
      } catch (e) {
        console.error('[ConversationSession] Error en callback:', e);
      }
    });
  }

  private startMaxDurationTimer(): void {
    this.clearMaxDurationTimer();
    this.maxDurationTimer = setTimeout(() => {
      console.log('[ConversationSession] Duracion maxima alcanzada');
      this.emit('max_duration_reached');
      this.endSession();
    }, this.config.maxSessionDurationMs);
  }

  private resetIdleTimer(): void {
    this.clearIdleTimer();
    this.idleTimer = setTimeout(() => {
      console.log('[ConversationSession] Idle timeout alcanzado');
      this.emit('idle_timeout');
      this.endSession();
    }, this.config.idleTimeoutMs);
  }

  private clearIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  private clearListenTimer(): void {
    if (this.listenTimer) {
      clearTimeout(this.listenTimer);
      this.listenTimer = null;
    }
  }

  private clearMaxDurationTimer(): void {
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
  }

  private clearAllTimers(): void {
    this.clearIdleTimer();
    this.clearListenTimer();
    this.clearMaxDurationTimer();
  }

  /**
   * Destruir sesion y limpiar recursos
   */
  dispose(): void {
    this.endSession();
    this.callbacks.clear();
  }
}

export default ConversationSession;
