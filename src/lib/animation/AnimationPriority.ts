/**
 * Animation Priority System
 * Sistema de prioridades para gestionar conflictos entre animaciones
 *
 * Cuando múltiples animaciones quieren controlar los mismos huesos,
 * este sistema determina cuál tiene precedencia
 */

import * as THREE from 'three';

/**
 * Niveles de prioridad para animaciones
 * Mayor número = mayor prioridad
 */
export enum AnimationPriority {
  IDLE = 0,           // Respiración, balanceo sutil
  LISTENING = 1,      // Animaciones sutiles mientras escucha
  CURSOR_TRACK = 2,   // Seguimiento del cursor
  EMOTE = 3,          // Emociones (confused, excited)
  SPEAKING = 4,       // Gestos mientras habla
  THINKING = 5,       // Animación de pensando
  GESTURE = 6,        // Gestos activos (wave, nod)
  INTERRUPT = 7,      // Interrupciones (barge-in)
  FORCED = 10         // Prioridad máxima, ignora todo
}

/**
 * Definición de una animación gestionada
 */
export interface ManagedAnimation {
  id: string;
  priority: AnimationPriority;
  targetBones: string[];        // Lista de huesos que controla
  isInterruptible: boolean;     // Si puede ser interrumpida
  blendWeight: number;          // Peso de blend (0-1)
  startTime: number;            // Timestamp de inicio
  duration?: number;            // Duración opcional (ms), undefined = infinita
  onInterrupt?: () => void;     // Callback al ser interrumpida
  onComplete?: () => void;      // Callback al completar
}

/**
 * Estado de un hueso gestionado
 */
interface BoneState {
  currentAnimation: string | null;
  priority: AnimationPriority;
  blendWeight: number;
}

/**
 * Gestor de prioridades de animación
 * Controla qué animación tiene acceso a qué huesos
 */
export class AnimationPriorityManager {
  private animations: Map<string, ManagedAnimation> = new Map();
  private boneStates: Map<string, BoneState> = new Map();
  private activeAnimationIds: Set<string> = new Set();

  constructor() {
    // Inicializar
  }

  /**
   * Registrar una nueva animación
   * @returns true si la animación fue aceptada, false si fue rechazada
   */
  registerAnimation(animation: ManagedAnimation): boolean {
    // Verificar si puede tomar control de los huesos requeridos
    const canTakeControl = this.canAnimationTakeControl(animation);

    if (!canTakeControl) {
      console.log(`[AnimPriority] Animación ${animation.id} rechazada - prioridad insuficiente`);
      return false;
    }

    // Interrumpir animaciones existentes en los huesos afectados
    this.interruptAnimationsOnBones(animation.targetBones, animation.priority);

    // Registrar la animación
    this.animations.set(animation.id, animation);
    this.activeAnimationIds.add(animation.id);

    // Actualizar estados de huesos
    for (const bone of animation.targetBones) {
      this.boneStates.set(bone, {
        currentAnimation: animation.id,
        priority: animation.priority,
        blendWeight: animation.blendWeight
      });
    }

    console.log(`[AnimPriority] Animación ${animation.id} registrada con prioridad ${animation.priority}`);
    return true;
  }

  /**
   * Verificar si una animación puede tomar control de sus huesos objetivo
   */
  private canAnimationTakeControl(animation: ManagedAnimation): boolean {
    for (const bone of animation.targetBones) {
      const boneState = this.boneStates.get(bone);

      if (boneState && boneState.currentAnimation) {
        const existingAnim = this.animations.get(boneState.currentAnimation);

        if (existingAnim) {
          // Si la animación existente tiene mayor o igual prioridad y no es interruptible
          if (existingAnim.priority >= animation.priority && !existingAnim.isInterruptible) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Interrumpir animaciones en huesos específicos
   */
  private interruptAnimationsOnBones(bones: string[], newPriority: AnimationPriority): void {
    const animationsToInterrupt = new Set<string>();

    for (const bone of bones) {
      const boneState = this.boneStates.get(bone);

      if (boneState && boneState.currentAnimation) {
        const existingAnim = this.animations.get(boneState.currentAnimation);

        if (existingAnim && existingAnim.priority < newPriority) {
          animationsToInterrupt.add(boneState.currentAnimation);
        }
      }
    }

    Array.from(animationsToInterrupt).forEach(animId => {
      this.interruptAnimation(animId);
    });
  }

  /**
   * Interrumpir una animación específica
   */
  interruptAnimation(animationId: string): void {
    const animation = this.animations.get(animationId);

    if (!animation) return;

    console.log(`[AnimPriority] Interrumpiendo animación ${animationId}`);

    // Llamar callback de interrupción
    if (animation.onInterrupt) {
      animation.onInterrupt();
    }

    // Liberar huesos
    for (const bone of animation.targetBones) {
      const boneState = this.boneStates.get(bone);
      if (boneState && boneState.currentAnimation === animationId) {
        this.boneStates.delete(bone);
      }
    }

    // Remover animación
    this.animations.delete(animationId);
    this.activeAnimationIds.delete(animationId);
  }

  /**
   * Completar una animación normalmente
   */
  completeAnimation(animationId: string): void {
    const animation = this.animations.get(animationId);

    if (!animation) return;

    console.log(`[AnimPriority] Animación ${animationId} completada`);

    // Llamar callback de completado
    if (animation.onComplete) {
      animation.onComplete();
    }

    // Liberar huesos
    for (const bone of animation.targetBones) {
      const boneState = this.boneStates.get(bone);
      if (boneState && boneState.currentAnimation === animationId) {
        this.boneStates.delete(bone);
      }
    }

    // Remover animación
    this.animations.delete(animationId);
    this.activeAnimationIds.delete(animationId);
  }

  /**
   * Verificar si un hueso está disponible para una prioridad dada
   */
  isBoneAvailable(boneName: string, priority: AnimationPriority): boolean {
    const boneState = this.boneStates.get(boneName);

    if (!boneState || !boneState.currentAnimation) {
      return true;
    }

    const existingAnim = this.animations.get(boneState.currentAnimation);

    if (!existingAnim) {
      return true;
    }

    // Disponible si la nueva prioridad es mayor
    return priority > existingAnim.priority;
  }

  /**
   * Obtener la animación activa para un hueso
   */
  getActiveAnimationForBone(boneName: string): ManagedAnimation | null {
    const boneState = this.boneStates.get(boneName);

    if (!boneState || !boneState.currentAnimation) {
      return null;
    }

    return this.animations.get(boneState.currentAnimation) || null;
  }

  /**
   * Obtener el peso de blend para un hueso
   */
  getBlendWeightForBone(boneName: string): number {
    const boneState = this.boneStates.get(boneName);
    return boneState?.blendWeight ?? 0;
  }

  /**
   * Obtener todas las animaciones activas
   */
  getActiveAnimations(): ManagedAnimation[] {
    return Array.from(this.activeAnimationIds)
      .map(id => this.animations.get(id))
      .filter((anim): anim is ManagedAnimation => anim !== undefined);
  }

  /**
   * Verificar si una animación específica está activa
   */
  isAnimationActive(animationId: string): boolean {
    return this.activeAnimationIds.has(animationId);
  }

  /**
   * Actualizar el sistema (llamar cada frame)
   * Verifica duraciones y completa animaciones expiradas
   */
  update(): void {
    const now = Date.now();
    const animationsToComplete: string[] = [];

    this.animations.forEach((animation, id) => {
      if (animation.duration !== undefined) {
        const elapsed = now - animation.startTime;

        if (elapsed >= animation.duration) {
          animationsToComplete.push(id);
        }
      }
    });

    animationsToComplete.forEach(id => this.completeAnimation(id));
  }

  /**
   * Limpiar todas las animaciones
   */
  clear(): void {
    this.activeAnimationIds.forEach(id => {
      const animation = this.animations.get(id);
      if (animation?.onInterrupt) {
        animation.onInterrupt();
      }
    });

    this.animations.clear();
    this.boneStates.clear();
    this.activeAnimationIds.clear();
  }

  /**
   * Debug: obtener estado actual
   */
  getDebugState(): {
    activeAnimations: string[];
    boneStates: Record<string, { animation: string; priority: number }>;
  } {
    const boneStatesObj: Record<string, { animation: string; priority: number }> = {};

    this.boneStates.forEach((state, bone) => {
      if (state.currentAnimation) {
        boneStatesObj[bone] = {
          animation: state.currentAnimation,
          priority: state.priority
        };
      }
    });

    return {
      activeAnimations: Array.from(this.activeAnimationIds),
      boneStates: boneStatesObj
    };
  }
}

/**
 * Lista de huesos comunes para diferentes tipos de animaciones
 */
export const ANIMATION_BONE_SETS = {
  headOnly: ['head'],
  headAndNeck: ['head', 'neck'],
  upperBody: ['head', 'neck', 'body_top1', 'body_top2'],
  leftArm: ['shoulder_left', 'arm_left_top', 'arm_left_bot'],
  rightArm: ['shoulder_right', 'arm_right_top', 'arm_right_bot'],
  bothArms: ['shoulder_left', 'arm_left_top', 'arm_left_bot', 'shoulder_right', 'arm_right_top', 'arm_right_bot'],
  legs: ['leg_left_top', 'leg_right_top', 'leg_left_bot', 'leg_right_bot', 'leg_left_foot', 'leg_right_foot'],
  fullBody: [
    'head', 'neck', 'body_top1', 'body_top2',
    'shoulder_left', 'arm_left_top', 'arm_left_bot',
    'shoulder_right', 'arm_right_top', 'arm_right_bot',
    'leg_left_top', 'leg_right_top', 'leg_left_bot', 'leg_right_bot',
    'leg_left_foot', 'leg_right_foot'
  ]
};

/**
 * Helper para crear una animación con valores por defecto
 */
export function createAnimation(
  id: string,
  priority: AnimationPriority,
  targetBones: string[],
  options: Partial<Omit<ManagedAnimation, 'id' | 'priority' | 'targetBones'>> = {}
): ManagedAnimation {
  return {
    id,
    priority,
    targetBones,
    isInterruptible: options.isInterruptible ?? true,
    blendWeight: options.blendWeight ?? 1.0,
    startTime: options.startTime ?? Date.now(),
    duration: options.duration,
    onInterrupt: options.onInterrupt,
    onComplete: options.onComplete
  };
}

export default AnimationPriorityManager;
