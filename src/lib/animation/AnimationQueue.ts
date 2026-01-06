/**
 * AnimationQueue - Sistema de cola para animaciones del Robot
 * Maneja secuencias de animaciones con prioridades
 */

import { AnimationState, ANIMATION_PRIORITIES } from './AnimationMachine';

// Elemento de la cola
export interface QueuedAnimation {
  id: string;
  state: AnimationState;
  priority: number;
  duration?: number; // Duración en ms, undefined = usar default
  interruptible: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onInterrupt?: () => void;
  metadata?: Record<string, unknown>;
}

// Opciones para agregar a la cola
export interface QueueOptions {
  priority?: number;
  duration?: number;
  interruptible?: boolean;
  insertAtFront?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onInterrupt?: () => void;
  metadata?: Record<string, unknown>;
}

// Callbacks de la cola
export type QueueEventCallback = (animation: QueuedAnimation) => void;

/**
 * AnimationQueue - Cola de animaciones con prioridades
 */
export class AnimationQueue {
  private queue: QueuedAnimation[] = [];
  private currentAnimation: QueuedAnimation | null = null;
  private isProcessing: boolean = false;
  private isPaused: boolean = false;
  private idCounter: number = 0;

  private onAnimationStart?: QueueEventCallback;
  private onAnimationComplete?: QueueEventCallback;
  private onAnimationInterrupt?: QueueEventCallback;
  private onQueueEmpty?: () => void;

  constructor(options?: {
    onAnimationStart?: QueueEventCallback;
    onAnimationComplete?: QueueEventCallback;
    onAnimationInterrupt?: QueueEventCallback;
    onQueueEmpty?: () => void;
  }) {
    this.onAnimationStart = options?.onAnimationStart;
    this.onAnimationComplete = options?.onAnimationComplete;
    this.onAnimationInterrupt = options?.onAnimationInterrupt;
    this.onQueueEmpty = options?.onQueueEmpty;
  }

  /**
   * Genera un ID único para cada animación
   */
  private generateId(): string {
    return `anim_${++this.idCounter}_${Date.now()}`;
  }

  /**
   * Agrega una animación a la cola
   */
  enqueue(state: AnimationState, options?: QueueOptions): string {
    const priority = options?.priority ?? ANIMATION_PRIORITIES[state];

    const animation: QueuedAnimation = {
      id: this.generateId(),
      state,
      priority,
      duration: options?.duration,
      interruptible: options?.interruptible ?? true,
      onStart: options?.onStart,
      onComplete: options?.onComplete,
      onInterrupt: options?.onInterrupt,
      metadata: options?.metadata,
    };

    if (options?.insertAtFront) {
      // Insertar al frente (después de elementos con mayor prioridad)
      const insertIndex = this.queue.findIndex(item => item.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(animation);
      } else {
        this.queue.splice(insertIndex, 0, animation);
      }
    } else {
      // Insertar manteniendo orden por prioridad (mayor primero)
      const insertIndex = this.queue.findIndex(item => item.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(animation);
      } else {
        this.queue.splice(insertIndex, 0, animation);
      }
    }

    return animation.id;
  }

  /**
   * Agrega múltiples animaciones como secuencia
   */
  enqueueSequence(
    animations: Array<{ state: AnimationState; options?: QueueOptions }>
  ): string[] {
    return animations.map(({ state, options }) => this.enqueue(state, options));
  }

  /**
   * Obtiene la siguiente animación sin removerla
   */
  peek(): QueuedAnimation | null {
    return this.queue.length > 0 ? this.queue[0] : null;
  }

  /**
   * Remueve y retorna la siguiente animación
   */
  dequeue(): QueuedAnimation | null {
    return this.queue.shift() || null;
  }

  /**
   * Obtiene la animación actual en proceso
   */
  getCurrent(): QueuedAnimation | null {
    return this.currentAnimation;
  }

  /**
   * Inicia el procesamiento de la cola
   */
  startProcessing(): QueuedAnimation | null {
    if (this.isPaused || this.queue.length === 0) {
      return null;
    }

    this.isProcessing = true;
    this.currentAnimation = this.dequeue();

    if (this.currentAnimation) {
      // Notificar inicio
      if (this.currentAnimation.onStart) {
        this.currentAnimation.onStart();
      }
      if (this.onAnimationStart) {
        this.onAnimationStart(this.currentAnimation);
      }
    }

    return this.currentAnimation;
  }

  /**
   * Marca la animación actual como completada
   */
  completeCurrentAnimation(): QueuedAnimation | null {
    if (!this.currentAnimation) {
      return null;
    }

    const completed = this.currentAnimation;

    // Notificar completado
    if (completed.onComplete) {
      completed.onComplete();
    }
    if (this.onAnimationComplete) {
      this.onAnimationComplete(completed);
    }

    this.currentAnimation = null;

    // Procesar siguiente o notificar cola vacía
    if (this.queue.length > 0) {
      return this.startProcessing();
    } else {
      this.isProcessing = false;
      if (this.onQueueEmpty) {
        this.onQueueEmpty();
      }
      return null;
    }
  }

  /**
   * Interrumpe la animación actual
   */
  interruptCurrent(): boolean {
    if (!this.currentAnimation) {
      return false;
    }

    if (!this.currentAnimation.interruptible) {
      console.warn('[AnimationQueue] Animación actual no es interrumpible');
      return false;
    }

    const interrupted = this.currentAnimation;

    // Notificar interrupción
    if (interrupted.onInterrupt) {
      interrupted.onInterrupt();
    }
    if (this.onAnimationInterrupt) {
      this.onAnimationInterrupt(interrupted);
    }

    this.currentAnimation = null;
    return true;
  }

  /**
   * Interrumpe y agrega una nueva animación prioritaria
   */
  interruptWith(state: AnimationState, options?: QueueOptions): boolean {
    const canInterrupt = !this.currentAnimation || this.currentAnimation.interruptible;

    if (!canInterrupt) {
      // Si no puede interrumpir, encolar con alta prioridad
      this.enqueue(state, { ...options, insertAtFront: true });
      return false;
    }

    this.interruptCurrent();
    this.enqueue(state, { ...options, insertAtFront: true });
    this.startProcessing();
    return true;
  }

  /**
   * Pausa el procesamiento de la cola
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Reanuda el procesamiento de la cola
   */
  resume(): void {
    this.isPaused = false;
    if (!this.currentAnimation && this.queue.length > 0) {
      this.startProcessing();
    }
  }

  /**
   * Limpia toda la cola
   */
  clear(): void {
    // Notificar interrupciones para animaciones en cola
    this.queue.forEach(anim => {
      if (anim.onInterrupt) {
        anim.onInterrupt();
      }
    });

    this.queue = [];
    this.interruptCurrent();
    this.isProcessing = false;
  }

  /**
   * Remueve una animación específica de la cola
   */
  remove(id: string): boolean {
    const index = this.queue.findIndex(anim => anim.id === id);
    if (index === -1) {
      return false;
    }

    const removed = this.queue.splice(index, 1)[0];
    if (removed.onInterrupt) {
      removed.onInterrupt();
    }
    return true;
  }

  /**
   * Obtiene el tamaño de la cola
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Verifica si la cola está vacía
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Verifica si está procesando
   */
  isActive(): boolean {
    return this.isProcessing;
  }

  /**
   * Verifica si está pausada
   */
  getIsPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Obtiene todas las animaciones en cola (para debugging)
   */
  getQueue(): readonly QueuedAnimation[] {
    return [...this.queue];
  }

  /**
   * Serializa el estado de la cola (útil para debugging)
   */
  toJSON(): object {
    return {
      queueSize: this.queue.length,
      isProcessing: this.isProcessing,
      isPaused: this.isPaused,
      currentAnimation: this.currentAnimation?.state || null,
      queue: this.queue.map(a => ({ id: a.id, state: a.state, priority: a.priority })),
    };
  }
}

/**
 * Factory para crear instancias de AnimationQueue
 */
export function createAnimationQueue(options?: {
  onAnimationStart?: QueueEventCallback;
  onAnimationComplete?: QueueEventCallback;
  onAnimationInterrupt?: QueueEventCallback;
  onQueueEmpty?: () => void;
}): AnimationQueue {
  return new AnimationQueue(options);
}
