/**
 * AnimationMachine - Máquina de estados para animaciones del Robot
 * Maneja transiciones, prioridades y blending entre estados
 */

import { ANIMATION_CONFIGS, AnimationConfig } from './rotationPresets';

// Estados de animación disponibles
export enum AnimationState {
  IDLE = 'idle',
  WAVING = 'waving',
  APPROACHING = 'approaching',
  STEPPING_BACK = 'stepping_back',
  DANCING = 'dancing',
  NODDING = 'nodding',
  SHAKING_LEGS = 'shaking_legs',
  THINKING = 'thinking',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  ERROR = 'error',
}

// Prioridades de animación (mayor número = mayor prioridad)
export const ANIMATION_PRIORITIES: Record<AnimationState, number> = {
  [AnimationState.IDLE]: 0,
  [AnimationState.LISTENING]: 2,
  [AnimationState.WAVING]: 3,
  [AnimationState.NODDING]: 3,
  [AnimationState.SHAKING_LEGS]: 3,
  [AnimationState.DANCING]: 4,
  [AnimationState.APPROACHING]: 5,
  [AnimationState.STEPPING_BACK]: 5,
  [AnimationState.THINKING]: 6,
  [AnimationState.SPEAKING]: 7,
  [AnimationState.ERROR]: 10,
};

// Configuración de transiciones permitidas
export const ALLOWED_TRANSITIONS: Partial<Record<AnimationState, AnimationState[]>> = {
  [AnimationState.IDLE]: [
    AnimationState.WAVING,
    AnimationState.APPROACHING,
    AnimationState.DANCING,
    AnimationState.NODDING,
    AnimationState.SHAKING_LEGS,
    AnimationState.THINKING,
    AnimationState.LISTENING,
    AnimationState.SPEAKING,
    AnimationState.ERROR,
  ],
  [AnimationState.LISTENING]: [
    AnimationState.IDLE,
    AnimationState.THINKING,
    AnimationState.SPEAKING,
    AnimationState.ERROR,
  ],
  [AnimationState.THINKING]: [
    AnimationState.IDLE,
    AnimationState.SPEAKING,
    AnimationState.ERROR,
    AnimationState.STEPPING_BACK,
  ],
  [AnimationState.SPEAKING]: [
    AnimationState.IDLE,
    AnimationState.STEPPING_BACK,
    AnimationState.ERROR,
  ],
  [AnimationState.WAVING]: [
    AnimationState.IDLE,
    AnimationState.THINKING,
    AnimationState.ERROR,
  ],
  [AnimationState.APPROACHING]: [
    AnimationState.STEPPING_BACK,
    AnimationState.IDLE,
    AnimationState.THINKING,
  ],
  [AnimationState.STEPPING_BACK]: [
    AnimationState.IDLE,
    AnimationState.APPROACHING,
  ],
  [AnimationState.DANCING]: [
    AnimationState.IDLE,
    AnimationState.ERROR,
  ],
  [AnimationState.NODDING]: [
    AnimationState.IDLE,
    AnimationState.THINKING,
  ],
  [AnimationState.SHAKING_LEGS]: [
    AnimationState.IDLE,
  ],
  [AnimationState.ERROR]: [
    AnimationState.IDLE,
  ],
};

// Duraciones de blending para transiciones (en ms)
export const BLEND_DURATIONS: Partial<Record<AnimationState, number>> = {
  [AnimationState.IDLE]: 300,
  [AnimationState.WAVING]: 200,
  [AnimationState.APPROACHING]: 400,
  [AnimationState.STEPPING_BACK]: 350,
  [AnimationState.DANCING]: 250,
  [AnimationState.NODDING]: 150,
  [AnimationState.SHAKING_LEGS]: 200,
  [AnimationState.THINKING]: 400,
  [AnimationState.LISTENING]: 200,
  [AnimationState.SPEAKING]: 250,
  [AnimationState.ERROR]: 100,
};

// Eventos que pueden disparar transiciones
export type AnimationEvent =
  | { type: 'START_WAVE' }
  | { type: 'START_APPROACH' }
  | { type: 'START_STEP_BACK' }
  | { type: 'START_DANCE' }
  | { type: 'START_NOD' }
  | { type: 'START_SHAKE_LEGS' }
  | { type: 'START_THINKING' }
  | { type: 'START_LISTENING' }
  | { type: 'START_SPEAKING' }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'ERROR' }
  | { type: 'RESET' };

// Mapeo de eventos a estados
const EVENT_TO_STATE: Record<string, AnimationState> = {
  START_WAVE: AnimationState.WAVING,
  START_APPROACH: AnimationState.APPROACHING,
  START_STEP_BACK: AnimationState.STEPPING_BACK,
  START_DANCE: AnimationState.DANCING,
  START_NOD: AnimationState.NODDING,
  START_SHAKE_LEGS: AnimationState.SHAKING_LEGS,
  START_THINKING: AnimationState.THINKING,
  START_LISTENING: AnimationState.LISTENING,
  START_SPEAKING: AnimationState.SPEAKING,
  ERROR: AnimationState.ERROR,
  RESET: AnimationState.IDLE,
};

// Callback types
export type StateChangeCallback = (
  newState: AnimationState,
  oldState: AnimationState,
  blendDuration: number
) => void;

export type AnimationCompleteCallback = (state: AnimationState) => void;

/**
 * AnimationMachine - Controla el flujo de estados de animación
 */
export class AnimationMachine {
  private currentState: AnimationState = AnimationState.IDLE;
  private previousState: AnimationState = AnimationState.IDLE;
  private stateStartTime: number = 0;
  private isBlending: boolean = false;
  private blendProgress: number = 1; // 1 = blend completo
  private blendDuration: number = 0;
  private blendStartTime: number = 0;

  private onStateChange?: StateChangeCallback;
  private onAnimationComplete?: AnimationCompleteCallback;

  constructor(options?: {
    initialState?: AnimationState;
    onStateChange?: StateChangeCallback;
    onAnimationComplete?: AnimationCompleteCallback;
  }) {
    if (options?.initialState) {
      this.currentState = options.initialState;
    }
    this.onStateChange = options?.onStateChange;
    this.onAnimationComplete = options?.onAnimationComplete;
    this.stateStartTime = performance.now();
  }

  /**
   * Obtiene el estado actual
   */
  getState(): AnimationState {
    return this.currentState;
  }

  /**
   * Obtiene el estado anterior
   */
  getPreviousState(): AnimationState {
    return this.previousState;
  }

  /**
   * Verifica si está en proceso de blending
   */
  isInBlend(): boolean {
    return this.isBlending;
  }

  /**
   * Obtiene el progreso del blend (0-1)
   */
  getBlendProgress(): number {
    return this.blendProgress;
  }

  /**
   * Obtiene el tiempo transcurrido en el estado actual (ms)
   */
  getStateElapsedTime(): number {
    return performance.now() - this.stateStartTime;
  }

  /**
   * Obtiene la prioridad del estado actual
   */
  getCurrentPriority(): number {
    return ANIMATION_PRIORITIES[this.currentState];
  }

  /**
   * Verifica si una transición es válida
   */
  canTransitionTo(targetState: AnimationState): boolean {
    // Siempre permitir transición a ERROR
    if (targetState === AnimationState.ERROR) {
      return true;
    }

    // Verificar si la transición está permitida
    const allowedStates = ALLOWED_TRANSITIONS[this.currentState];
    if (!allowedStates) {
      return false;
    }

    return allowedStates.includes(targetState);
  }

  /**
   * Verifica si el estado objetivo tiene mayor prioridad
   */
  hasHigherPriority(targetState: AnimationState): boolean {
    return ANIMATION_PRIORITIES[targetState] > ANIMATION_PRIORITIES[this.currentState];
  }

  /**
   * Intenta transicionar a un nuevo estado
   * @returns true si la transición fue exitosa
   */
  transitionTo(targetState: AnimationState, force: boolean = false): boolean {
    // Si es el mismo estado, ignorar
    if (targetState === this.currentState) {
      return false;
    }

    // Verificar si la transición es válida
    if (!force && !this.canTransitionTo(targetState)) {
      console.warn(
        `[AnimationMachine] Transición no permitida: ${this.currentState} -> ${targetState}`
      );
      return false;
    }

    // Si no tiene mayor prioridad y no es forzado, ignorar
    if (!force && !this.hasHigherPriority(targetState) && this.currentState !== AnimationState.IDLE) {
      console.warn(
        `[AnimationMachine] Prioridad insuficiente: ${targetState} (${ANIMATION_PRIORITIES[targetState]}) vs ${this.currentState} (${ANIMATION_PRIORITIES[this.currentState]})`
      );
      return false;
    }

    // Realizar la transición
    this.previousState = this.currentState;
    this.currentState = targetState;
    this.stateStartTime = performance.now();

    // Iniciar blending
    this.blendDuration = BLEND_DURATIONS[targetState] || 200;
    this.blendStartTime = performance.now();
    this.blendProgress = 0;
    this.isBlending = true;

    // Notificar cambio de estado
    if (this.onStateChange) {
      this.onStateChange(this.currentState, this.previousState, this.blendDuration);
    }

    return true;
  }

  /**
   * Procesa un evento y realiza la transición correspondiente
   */
  send(event: AnimationEvent): boolean {
    if (event.type === 'ANIMATION_COMPLETE') {
      // Notificar que la animación terminó
      if (this.onAnimationComplete) {
        this.onAnimationComplete(this.currentState);
      }
      // Regresar a IDLE después de completar
      return this.transitionTo(AnimationState.IDLE, true);
    }

    const targetState = EVENT_TO_STATE[event.type];
    if (targetState) {
      return this.transitionTo(targetState);
    }

    return false;
  }

  /**
   * Actualiza el progreso del blend (llamar cada frame)
   */
  update(): void {
    if (!this.isBlending) {
      return;
    }

    const elapsed = performance.now() - this.blendStartTime;
    this.blendProgress = Math.min(elapsed / this.blendDuration, 1);

    if (this.blendProgress >= 1) {
      this.isBlending = false;
      this.blendProgress = 1;
    }
  }

  /**
   * Fuerza el reset al estado IDLE
   */
  reset(): void {
    this.transitionTo(AnimationState.IDLE, true);
  }

  /**
   * Verifica si el estado actual es uno específico
   */
  is(state: AnimationState): boolean {
    return this.currentState === state;
  }

  /**
   * Verifica si el estado actual es uno de los proporcionados
   */
  isOneOf(...states: AnimationState[]): boolean {
    return states.includes(this.currentState);
  }

  /**
   * Obtiene la configuración de la animación actual
   */
  getCurrentConfig(): AnimationConfig | undefined {
    const configKey = this.currentState.replace('_', '') as keyof typeof ANIMATION_CONFIGS;
    return ANIMATION_CONFIGS[configKey];
  }

  /**
   * Serializa el estado actual (útil para debugging)
   */
  toJSON(): object {
    return {
      currentState: this.currentState,
      previousState: this.previousState,
      isBlending: this.isBlending,
      blendProgress: this.blendProgress,
      stateElapsedTime: this.getStateElapsedTime(),
      priority: this.getCurrentPriority(),
    };
  }
}

/**
 * Hook-friendly factory para crear instancias de AnimationMachine
 */
export function createAnimationMachine(options?: {
  initialState?: AnimationState;
  onStateChange?: StateChangeCallback;
  onAnimationComplete?: AnimationCompleteCallback;
}): AnimationMachine {
  return new AnimationMachine(options);
}
