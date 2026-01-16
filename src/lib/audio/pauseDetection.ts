/**
 * Pause Detection System
 * Sistema para clasificar pausas en el habla y determinar la acción apropiada
 *
 * Tipos de pausas:
 * - BREATH_PAUSE: Pausa corta para respirar, el usuario sigue hablando
 * - THOUGHT_PAUSE: Pausa para pensar, podría continuar
 * - SENTENCE_END: Pausa larga, probablemente terminó de hablar
 */

/**
 * Tipos de pausa detectados
 */
export enum PauseType {
  /** Sin pausa significativa */
  NONE = 'none',
  /** Pausa respiratoria - el usuario probablemente sigue hablando */
  BREATH = 'breath',
  /** Pausa de pensamiento - el usuario podría continuar */
  THOUGHT = 'thought',
  /** Fin de oración - el usuario probablemente terminó */
  SENTENCE_END = 'sentence_end',
  /** Pausa muy larga - definitivamente terminó */
  LONG_SILENCE = 'long_silence'
}

/**
 * Acción recomendada basada en el tipo de pausa
 */
export enum PauseAction {
  /** Continuar escuchando sin cambios */
  CONTINUE = 'continue',
  /** Esperar un poco más antes de procesar */
  WAIT = 'wait',
  /** Procesar el audio recibido */
  PROCESS = 'process',
  /** Terminar la sesión de escucha */
  END_SESSION = 'end_session'
}

/**
 * Configuración de umbrales de pausa (en ms)
 */
export interface PauseThresholds {
  /** Máximo para pausa respiratoria */
  breathMax: number;
  /** Máximo para pausa de pensamiento */
  thoughtMax: number;
  /** Máximo para fin de oración */
  sentenceEndMax: number;
  /** Más allá de esto es silencio largo */
  longSilenceMin: number;
}

/**
 * Configuración por defecto
 */
export const DEFAULT_PAUSE_THRESHOLDS: PauseThresholds = {
  breathMax: 500,        // 0-500ms = respiración
  thoughtMax: 1200,      // 500-1200ms = pensando
  sentenceEndMax: 2500,  // 1200-2500ms = fin de oración
  longSilenceMin: 2500   // >2500ms = silencio largo
};

/**
 * Resultado de la clasificación de pausa
 */
export interface PauseClassification {
  type: PauseType;
  action: PauseAction;
  duration: number;
  confidence: number;  // 0-1, qué tan seguro estamos
}

/**
 * Contexto adicional para mejorar la clasificación
 */
export interface PauseContext {
  /** Si el usuario acaba de empezar a hablar */
  justStartedSpeaking: boolean;
  /** Duración total del speech actual */
  totalSpeechDuration: number;
  /** Número de pausas previas en esta sesión */
  previousPauseCount: number;
  /** Duración promedio de pausas previas */
  averagePauseDuration: number;
  /** Si hay una pregunta pendiente del robot */
  questionPending: boolean;
}

/**
 * Contexto por defecto
 */
export const DEFAULT_PAUSE_CONTEXT: PauseContext = {
  justStartedSpeaking: false,
  totalSpeechDuration: 0,
  previousPauseCount: 0,
  averagePauseDuration: 0,
  questionPending: false
};

/**
 * Clasificar una pausa basándose en su duración
 * @param duration Duración de la pausa en ms
 * @param thresholds Umbrales de clasificación
 * @returns Tipo de pausa
 */
export function classifyPauseDuration(
  duration: number,
  thresholds: PauseThresholds = DEFAULT_PAUSE_THRESHOLDS
): PauseType {
  if (duration <= 0) return PauseType.NONE;
  if (duration <= thresholds.breathMax) return PauseType.BREATH;
  if (duration <= thresholds.thoughtMax) return PauseType.THOUGHT;
  if (duration <= thresholds.sentenceEndMax) return PauseType.SENTENCE_END;
  return PauseType.LONG_SILENCE;
}

/**
 * Determinar la acción basada en el tipo de pausa
 */
export function getActionForPauseType(pauseType: PauseType): PauseAction {
  switch (pauseType) {
    case PauseType.NONE:
    case PauseType.BREATH:
      return PauseAction.CONTINUE;
    case PauseType.THOUGHT:
      return PauseAction.WAIT;
    case PauseType.SENTENCE_END:
      return PauseAction.PROCESS;
    case PauseType.LONG_SILENCE:
      return PauseAction.END_SESSION;
    default:
      return PauseAction.CONTINUE;
  }
}

/**
 * Clasificar una pausa con contexto adicional
 * Proporciona una clasificación más inteligente considerando el contexto de la conversación
 */
export function classifyPauseWithContext(
  duration: number,
  context: Partial<PauseContext> = {},
  thresholds: PauseThresholds = DEFAULT_PAUSE_THRESHOLDS
): PauseClassification {
  const ctx = { ...DEFAULT_PAUSE_CONTEXT, ...context };

  // Clasificación base por duración
  let pauseType = classifyPauseDuration(duration, thresholds);
  let confidence = 0.7; // Confianza base

  // Ajustes basados en contexto

  // 1. Si acaba de empezar a hablar, ser más tolerante con pausas
  if (ctx.justStartedSpeaking && pauseType === PauseType.THOUGHT) {
    // Dar más tiempo si acaba de empezar
    pauseType = PauseType.BREATH;
    confidence = 0.6;
  }

  // 2. Si el speech total es muy corto (<1s), probablemente no terminó
  if (ctx.totalSpeechDuration < 1000 && pauseType === PauseType.SENTENCE_END) {
    pauseType = PauseType.THOUGHT;
    confidence = 0.5;
  }

  // 3. Si hay una pregunta pendiente, esperar más por respuesta
  if (ctx.questionPending && pauseType === PauseType.SENTENCE_END) {
    // El usuario puede estar pensando la respuesta
    pauseType = PauseType.THOUGHT;
    confidence = 0.6;
  }

  // 4. Si las pausas previas fueron más largas, ajustar expectativas
  if (ctx.averagePauseDuration > 0 && ctx.previousPauseCount > 2) {
    // El usuario tiene un patrón de pausas
    if (duration < ctx.averagePauseDuration * 0.8) {
      // Pausa más corta que su promedio, probablemente continúa
      if (pauseType === PauseType.THOUGHT) {
        pauseType = PauseType.BREATH;
        confidence = 0.65;
      }
    }
  }

  // 5. Ajuste de confianza por duración extrema
  if (duration > thresholds.longSilenceMin * 1.5) {
    confidence = 0.95; // Muy seguro de que terminó
  } else if (duration < thresholds.breathMax * 0.5) {
    confidence = 0.85; // Muy seguro de que continúa
  }

  return {
    type: pauseType,
    action: getActionForPauseType(pauseType),
    duration,
    confidence
  };
}

/**
 * Clase para trackear pausas durante una sesión de escucha
 */
export class PauseTracker {
  private thresholds: PauseThresholds;
  private pauses: number[] = [];
  private speechStartTime: number | null = null;
  private pauseStartTime: number | null = null;
  private totalSpeechDuration: number = 0;
  private questionPending: boolean = false;

  constructor(thresholds: Partial<PauseThresholds> = {}) {
    this.thresholds = { ...DEFAULT_PAUSE_THRESHOLDS, ...thresholds };
  }

  /**
   * Marcar inicio de speech
   */
  onSpeechStart(): void {
    this.speechStartTime = Date.now();
    this.pauseStartTime = null;
  }

  /**
   * Marcar fin de speech (inicio de pausa)
   */
  onSpeechEnd(): void {
    if (this.speechStartTime) {
      this.totalSpeechDuration += Date.now() - this.speechStartTime;
    }
    this.pauseStartTime = Date.now();
    this.speechStartTime = null;
  }

  /**
   * Obtener duración de la pausa actual
   */
  getCurrentPauseDuration(): number {
    if (!this.pauseStartTime) return 0;
    return Date.now() - this.pauseStartTime;
  }

  /**
   * Clasificar la pausa actual con contexto
   */
  classifyCurrentPause(): PauseClassification {
    const duration = this.getCurrentPauseDuration();

    const context: PauseContext = {
      justStartedSpeaking: this.totalSpeechDuration < 1000,
      totalSpeechDuration: this.totalSpeechDuration,
      previousPauseCount: this.pauses.length,
      averagePauseDuration: this.getAveragePauseDuration(),
      questionPending: this.questionPending
    };

    return classifyPauseWithContext(duration, context, this.thresholds);
  }

  /**
   * Confirmar una pausa (cuando se determina que terminó)
   */
  confirmPause(): void {
    if (this.pauseStartTime) {
      const duration = Date.now() - this.pauseStartTime;
      this.pauses.push(duration);
    }
  }

  /**
   * Obtener duración promedio de pausas
   */
  getAveragePauseDuration(): number {
    if (this.pauses.length === 0) return 0;
    return this.pauses.reduce((a, b) => a + b, 0) / this.pauses.length;
  }

  /**
   * Marcar que hay una pregunta pendiente
   */
  setQuestionPending(pending: boolean): void {
    this.questionPending = pending;
  }

  /**
   * Resetear tracker para nueva sesión
   */
  reset(): void {
    this.pauses = [];
    this.speechStartTime = null;
    this.pauseStartTime = null;
    this.totalSpeechDuration = 0;
    this.questionPending = false;
  }

  /**
   * Obtener estadísticas de la sesión
   */
  getStats(): {
    pauseCount: number;
    averagePauseDuration: number;
    totalSpeechDuration: number;
    longestPause: number;
  } {
    return {
      pauseCount: this.pauses.length,
      averagePauseDuration: this.getAveragePauseDuration(),
      totalSpeechDuration: this.totalSpeechDuration,
      longestPause: this.pauses.length > 0 ? Math.max(...this.pauses) : 0
    };
  }
}

export default PauseTracker;
