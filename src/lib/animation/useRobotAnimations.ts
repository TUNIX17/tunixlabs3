/**
 * useRobotAnimations - Hook para manejar animaciones del Robot
 * Integra AnimationMachine, AnimationQueue y BoneController
 */

import { useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { AnimationMachine, AnimationState, createAnimationMachine } from './AnimationMachine';
import { AnimationQueue, createAnimationQueue } from './AnimationQueue';
import { BoneController, createBoneController, BoneName } from './BoneController';
import {
  presetToEulers,
  ARM_RESTING_ROTATIONS,
  LEG_RESTING_ROTATIONS,
  WAVE_ROTATIONS,
  NOD_YES_ROTATIONS,
  THINKING_ROTATIONS,
  DANCE_ROTATIONS,
  SHAKE_LEGS_ROTATIONS,
  APPROACH_ROTATIONS,
  ANIMATION_CONFIGS,
  IDLE_PARAMS,
  CURSOR_TRACKING,
  LISTENING_PARAMS,
} from './rotationPresets';
import { easeInOutQuad, easeOutBack } from './easingFunctions';

// Estado del sistema de animaciones
export interface AnimationSystemState {
  currentState: AnimationState;
  isBlending: boolean;
  blendProgress: number;
  queueSize: number;
  isProcessing: boolean;
}

// Opciones del hook
export interface UseRobotAnimationsOptions {
  onStateChange?: (state: AnimationState, prevState: AnimationState) => void;
  onAnimationComplete?: (state: AnimationState) => void;
  initialLerpFactor?: number;
}

// Retorno del hook
export interface UseRobotAnimationsReturn {
  // Referencias a los sistemas
  machine: AnimationMachine;
  queue: AnimationQueue;
  boneController: BoneController;

  // Métodos de animación
  startWaving: () => void;
  approachCamera: () => void;
  stepBackward: () => void;
  danceMove: () => void;
  nodYes: () => void;
  shakeLegsTwist: () => void;
  startThinking: () => void;
  stopThinking: () => void;
  startListening: () => void;
  stopListening: () => void;

  // Métodos de control
  reset: () => void;
  registerScene: (scene: THREE.Object3D) => void;

  // Método de actualización (llamar en useFrame)
  update: (time: number, mouseX: number, mouseY: number, isListening: boolean) => void;

  // Estado
  getState: () => AnimationSystemState;
}

/**
 * Hook para manejar las animaciones del robot
 */
export function useRobotAnimations(
  options?: UseRobotAnimationsOptions
): UseRobotAnimationsReturn {
  // Crear instancias una sola vez
  const machineRef = useRef<AnimationMachine | null>(null);
  const queueRef = useRef<AnimationQueue | null>(null);
  const boneControllerRef = useRef<BoneController | null>(null);

  // Inicializar si no existen
  if (!machineRef.current) {
    machineRef.current = createAnimationMachine({
      onStateChange: (newState, oldState, blendDuration) => {
        if (options?.onStateChange) {
          options.onStateChange(newState, oldState);
        }
        // Iniciar blend en el bone controller
        boneControllerRef.current?.startGlobalBlend(blendDuration);
      },
      onAnimationComplete: (state) => {
        if (options?.onAnimationComplete) {
          options.onAnimationComplete(state);
        }
      },
    });
  }

  if (!queueRef.current) {
    queueRef.current = createAnimationQueue({
      onAnimationStart: (anim) => {
        machineRef.current?.transitionTo(anim.state);
      },
      onAnimationComplete: () => {
        // La cola procesará automáticamente la siguiente
      },
    });
  }

  if (!boneControllerRef.current) {
    boneControllerRef.current = createBoneController(
      options?.initialLerpFactor || ANIMATION_CONFIGS.idle.lerpFactor
    );
  }

  const machine = machineRef.current;
  const queue = queueRef.current;
  const boneController = boneControllerRef.current;

  // Presets de rotación memorizados
  const rotationPresets = useMemo(
    () => ({
      armResting: presetToEulers(ARM_RESTING_ROTATIONS),
      legResting: presetToEulers(LEG_RESTING_ROTATIONS),
      wave: presetToEulers(WAVE_ROTATIONS),
      nodYes: presetToEulers(NOD_YES_ROTATIONS),
      thinking: presetToEulers(THINKING_ROTATIONS),
      dance: presetToEulers(DANCE_ROTATIONS),
      shakeLegs: presetToEulers(SHAKE_LEGS_ROTATIONS),
      approach: presetToEulers(APPROACH_ROTATIONS),
    }),
    []
  );

  // Refs para tiempos de inicio
  const animationStartTimeRef = useRef<number>(0);

  // Registrar escena
  const registerScene = useCallback(
    (scene: THREE.Object3D) => {
      boneController.registerFromScene(scene);
    },
    [boneController]
  );

  // Métodos de animación
  const startWaving = useCallback(() => {
    if (machine.transitionTo(AnimationState.WAVING)) {
      animationStartTimeRef.current = performance.now() / 1000;
      setTimeout(() => {
        machine.send({ type: 'ANIMATION_COMPLETE' });
      }, ANIMATION_CONFIGS.wave.duration);
    }
  }, [machine]);

  const approachCamera = useCallback(() => {
    if (machine.transitionTo(AnimationState.APPROACHING)) {
      animationStartTimeRef.current = performance.now() / 1000;
      setTimeout(() => {
        machine.transitionTo(AnimationState.STEPPING_BACK, true);
        setTimeout(() => {
          machine.send({ type: 'ANIMATION_COMPLETE' });
        }, ANIMATION_CONFIGS.stepBack.duration);
      }, ANIMATION_CONFIGS.approach.duration + 1000); // +1s de pausa
    }
  }, [machine]);

  const stepBackward = useCallback(() => {
    machine.transitionTo(AnimationState.STEPPING_BACK, true);
    animationStartTimeRef.current = performance.now() / 1000;
    setTimeout(() => {
      machine.send({ type: 'ANIMATION_COMPLETE' });
    }, ANIMATION_CONFIGS.stepBack.duration);
  }, [machine]);

  const danceMove = useCallback(() => {
    if (machine.transitionTo(AnimationState.DANCING)) {
      animationStartTimeRef.current = performance.now() / 1000;
      setTimeout(() => {
        machine.send({ type: 'ANIMATION_COMPLETE' });
      }, ANIMATION_CONFIGS.dance.duration);
    }
  }, [machine]);

  const nodYes = useCallback(() => {
    if (machine.transitionTo(AnimationState.NODDING)) {
      animationStartTimeRef.current = performance.now() / 1000;
      setTimeout(() => {
        machine.send({ type: 'ANIMATION_COMPLETE' });
      }, ANIMATION_CONFIGS.nodYes.duration);
    }
  }, [machine]);

  const shakeLegsTwist = useCallback(() => {
    if (machine.transitionTo(AnimationState.SHAKING_LEGS)) {
      animationStartTimeRef.current = performance.now() / 1000;
      setTimeout(() => {
        machine.send({ type: 'ANIMATION_COMPLETE' });
      }, ANIMATION_CONFIGS.shakeLegs.duration);
    }
  }, [machine]);

  const startThinking = useCallback(() => {
    machine.transitionTo(AnimationState.THINKING);
    animationStartTimeRef.current = performance.now() / 1000;
  }, [machine]);

  const stopThinking = useCallback(() => {
    if (machine.is(AnimationState.THINKING)) {
      machine.transitionTo(AnimationState.IDLE, true);
    }
  }, [machine]);

  const startListening = useCallback(() => {
    machine.transitionTo(AnimationState.LISTENING);
  }, [machine]);

  const stopListening = useCallback(() => {
    if (machine.is(AnimationState.LISTENING)) {
      machine.transitionTo(AnimationState.IDLE, true);
    }
  }, [machine]);

  const reset = useCallback(() => {
    machine.reset();
    queue.clear();
    boneController.resetAll();
  }, [machine, queue, boneController]);

  // Método de actualización principal
  const update = useCallback(
    (time: number, mouseX: number, mouseY: number, isListening: boolean) => {
      const currentState = machine.getState();
      const elapsedTime = time - animationStartTimeRef.current;

      // Actualizar máquina de estados
      machine.update();

      // Aplicar animaciones según el estado actual
      switch (currentState) {
        case AnimationState.IDLE:
          applyIdleAnimation(boneController, rotationPresets, time, mouseX, mouseY, isListening);
          break;

        case AnimationState.LISTENING:
          applyIdleAnimation(boneController, rotationPresets, time, mouseX, mouseY, true);
          break;

        case AnimationState.WAVING:
          applyWaveAnimation(boneController, rotationPresets, elapsedTime);
          applyIdleAnimation(boneController, rotationPresets, time, mouseX, mouseY, false, true);
          break;

        case AnimationState.THINKING:
          applyThinkingAnimation(boneController, rotationPresets, elapsedTime);
          break;

        case AnimationState.DANCING:
          applyDanceAnimation(boneController, rotationPresets, elapsedTime);
          break;

        case AnimationState.NODDING:
          applyNodAnimation(boneController, rotationPresets, elapsedTime);
          applyIdleAnimation(boneController, rotationPresets, time, mouseX, mouseY, false, true);
          break;

        case AnimationState.SHAKING_LEGS:
          applyShakeLegsAnimation(boneController, rotationPresets, elapsedTime);
          break;

        case AnimationState.APPROACHING:
        case AnimationState.STEPPING_BACK:
          // Estas animaciones afectan posición, manejadas externamente
          break;

        default:
          applyIdleAnimation(boneController, rotationPresets, time, mouseX, mouseY, isListening);
      }

      // Actualizar bone controller
      boneController.update(easeInOutQuad);
    },
    [machine, boneController, rotationPresets]
  );

  const getState = useCallback((): AnimationSystemState => {
    return {
      currentState: machine.getState(),
      isBlending: machine.isInBlend(),
      blendProgress: machine.getBlendProgress(),
      queueSize: queue.size(),
      isProcessing: queue.isActive(),
    };
  }, [machine, queue]);

  return {
    machine,
    queue,
    boneController,
    startWaving,
    approachCamera,
    stepBackward,
    danceMove,
    nodYes,
    shakeLegsTwist,
    startThinking,
    stopThinking,
    startListening,
    stopListening,
    reset,
    registerScene,
    update,
    getState,
  };
}

// ============================================
// FUNCIONES DE APLICACIÓN DE ANIMACIONES
// ============================================

function applyIdleAnimation(
  controller: BoneController,
  presets: ReturnType<typeof getPresets>,
  time: number,
  mouseX: number,
  mouseY: number,
  isListening: boolean,
  skipCursorTracking: boolean = false
): void {
  const { breath, bodySway, shoulderIdle, elbowIdle, legSway } = IDLE_PARAMS;

  // Respiración
  const headBone = controller.getBoneState('body_top1');
  if (headBone?.ref) {
    const breathCycle = Math.sin(time * breath.frequency) * breath.amplitudeX;
    const initial = headBone.initialRotation;
    controller.setTargetRotation('body_top1', new THREE.Euler(
      initial.x + breathCycle,
      initial.y + Math.cos(time * breath.frequency * 0.7) * breath.amplitudeY,
      initial.z
    ));
  }

  // Body sway
  const bodyTop2 = controller.getBoneState('body_top2');
  if (bodyTop2?.ref) {
    const initial = bodyTop2.initialRotation;
    const idleSway = Math.sin(time * bodySway.frequencyX) * bodySway.amplitudeX;
    const idleTwist = Math.cos(time * bodySway.frequencyZ) * bodySway.amplitudeZ;
    controller.setTargetRotation('body_top2', new THREE.Euler(
      initial.x + idleSway,
      bodyTop2.ref.rotation.y, // Mantener Y actual (cursor tracking)
      initial.z + idleTwist
    ));
  }

  // Cursor tracking
  if (!skipCursorTracking) {
    const listeningTilt = isListening
      ? Math.sin(time * LISTENING_PARAMS.headTilt.frequency) * LISTENING_PARAMS.headTilt.amplitude
      : 0;

    const headState = controller.getBoneState('head');
    if (headState?.ref) {
      const initial = headState.initialRotation;
      controller.setTargetRotation('head', new THREE.Euler(
        initial.x - mouseY * CURSOR_TRACKING.head.sensitivityY,
        initial.y + mouseX * CURSOR_TRACKING.head.sensitivityX,
        initial.z + listeningTilt
      ), { lerpFactor: CURSOR_TRACKING.head.lerpFactor });
    }

    const neckState = controller.getBoneState('neck');
    if (neckState?.ref) {
      const initial = neckState.initialRotation;
      const neckTilt = isListening
        ? Math.sin(time * LISTENING_PARAMS.neckTilt.frequency) * LISTENING_PARAMS.neckTilt.amplitude
        : 0;
      controller.setTargetRotation('neck', new THREE.Euler(
        initial.x - mouseY * CURSOR_TRACKING.neck.sensitivityY,
        initial.y + mouseX * CURSOR_TRACKING.neck.sensitivityX,
        initial.z + neckTilt
      ), { lerpFactor: CURSOR_TRACKING.neck.lerpFactor });
    }
  }

  // Brazos en reposo con movimiento idle
  const shoulderIdleX = Math.sin(time * shoulderIdle.frequencyX) * shoulderIdle.amplitudeX;
  const shoulderIdleY = Math.sin(time * shoulderIdle.frequencyY) * shoulderIdle.amplitudeY;

  Object.entries(presets.armResting).forEach(([name, euler]) => {
    const boneName = name as BoneName;
    if (boneName.includes('shoulder')) {
      controller.setTargetRotation(boneName, new THREE.Euler(
        euler.x + shoulderIdleX,
        euler.y + (boneName.includes('left') ? shoulderIdleY : -shoulderIdleY),
        euler.z
      ));
    } else if (boneName.includes('bot')) {
      const elbowIdle_ = Math.sin(time * elbowIdle.frequency) * elbowIdle.amplitude;
      controller.setTargetRotation(boneName, new THREE.Euler(
        euler.x + elbowIdle_,
        euler.y,
        euler.z
      ));
    } else {
      controller.setTargetRotation(boneName, euler);
    }
  });

  // Piernas en reposo con sway
  const legSwayX = Math.sin(time * legSway.frequency) * legSway.amplitudeX;
  Object.entries(presets.legResting).forEach(([name, euler]) => {
    const boneName = name as BoneName;
    const isLeft = boneName.includes('left');
    controller.setTargetRotation(boneName, new THREE.Euler(
      euler.x + (isLeft ? legSwayX : -legSwayX),
      euler.y,
      euler.z
    ));
  });
}

function applyWaveAnimation(
  controller: BoneController,
  presets: ReturnType<typeof getPresets>,
  elapsedTime: number
): void {
  const config = ANIMATION_CONFIGS.wave;
  const oscillation = config.oscillation!;
  const waveOscillation = Math.sin(elapsedTime * oscillation.frequency) * oscillation.amplitude;

  // Brazo derecho saludando
  Object.entries(presets.wave).forEach(([name, euler]) => {
    const boneName = name as BoneName;
    if (boneName === 'arm_right_bot') {
      controller.setTargetRotation(boneName, new THREE.Euler(
        euler.x,
        euler.y,
        waveOscillation // Movimiento de saludo
      ), { lerpFactor: config.lerpFactor * 2 });
    } else {
      controller.setTargetRotation(boneName, euler, { lerpFactor: config.lerpFactor * 2 });
    }
  });
}

function applyThinkingAnimation(
  controller: BoneController,
  presets: ReturnType<typeof getPresets>,
  elapsedTime: number
): void {
  const config = ANIMATION_CONFIGS.thinking;
  const oscillation = config.oscillation!;
  const thinkCycle = Math.sin(elapsedTime * oscillation.frequency) * oscillation.amplitude;
  const secondaryCycle = Math.cos(elapsedTime * 0.5) * 0.05;

  Object.entries(presets.thinking).forEach(([name, euler]) => {
    const boneName = name as BoneName;
    let targetEuler = euler.clone();

    if (boneName === 'head') {
      targetEuler.x += thinkCycle;
      targetEuler.y += secondaryCycle;
    } else if (boneName === 'neck') {
      targetEuler.x += thinkCycle * 0.5;
      targetEuler.y += secondaryCycle * 0.5;
    } else if (boneName === 'arm_right_bot') {
      targetEuler.x += thinkCycle * 0.2;
    } else if (boneName === 'body_top1') {
      targetEuler.z += secondaryCycle * 0.3;
    }

    controller.setTargetRotation(boneName, targetEuler, { lerpFactor: config.lerpFactor });
  });
}

function applyDanceAnimation(
  controller: BoneController,
  presets: ReturnType<typeof getPresets>,
  elapsedTime: number
): void {
  const config = ANIMATION_CONFIGS.dance;
  const oscillation = config.oscillation!;
  const mainBeat = Math.sin(elapsedTime * oscillation.frequency) * oscillation.amplitude;
  const secondaryBeat = Math.cos(elapsedTime * 3) * 0.5;

  Object.entries(presets.dance).forEach(([name, euler]) => {
    const boneName = name as BoneName;
    let targetEuler = euler.clone();
    const isLeft = boneName.includes('left');

    if (boneName === 'body_top1') {
      targetEuler.z += mainBeat * 0.15;
      targetEuler.y = secondaryBeat * 0.1;
    } else if (boneName.includes('shoulder')) {
      targetEuler.z += (isLeft ? mainBeat : -mainBeat) * 0.2;
      targetEuler.x += (isLeft ? secondaryBeat : -secondaryBeat) * 0.15;
    } else if (boneName.includes('bot')) {
      targetEuler.x += (isLeft ? mainBeat : -mainBeat) * 0.3;
    } else if (boneName.includes('leg')) {
      targetEuler.x += (isLeft ? mainBeat : -mainBeat) * 0.2;
    }

    controller.setTargetRotation(boneName, targetEuler, { lerpFactor: config.lerpFactor });
  });
}

function applyNodAnimation(
  controller: BoneController,
  presets: ReturnType<typeof getPresets>,
  elapsedTime: number
): void {
  const config = ANIMATION_CONFIGS.nodYes;
  const oscillation = config.oscillation!;
  const nodCycle = Math.sin(elapsedTime * oscillation.frequency) * oscillation.amplitude;

  Object.entries(presets.nodYes).forEach(([name, euler]) => {
    const boneName = name as BoneName;
    let targetEuler = euler.clone();

    if (boneName === 'head') {
      targetEuler.x += nodCycle;
    } else if (boneName === 'neck') {
      targetEuler.x += nodCycle * 0.6;
    }

    controller.setTargetRotation(boneName, targetEuler, { lerpFactor: config.lerpFactor });
  });
}

function applyShakeLegsAnimation(
  controller: BoneController,
  presets: ReturnType<typeof getPresets>,
  elapsedTime: number
): void {
  const config = ANIMATION_CONFIGS.shakeLegs;
  const oscillation = config.oscillation!;
  const mainShake = Math.sin(elapsedTime * oscillation.frequency) * oscillation.amplitude;
  const secondaryShake = Math.cos(elapsedTime * 5) * 0.4;

  Object.entries(presets.shakeLegs).forEach(([name, euler]) => {
    const boneName = name as BoneName;
    let targetEuler = euler.clone();
    const isLeft = boneName.includes('left');

    if (boneName.includes('top')) {
      targetEuler.z += (isLeft ? mainShake : -mainShake) * 0.2;
      targetEuler.x += (isLeft ? secondaryShake : -secondaryShake) * 0.15;
    } else if (boneName.includes('bot')) {
      targetEuler.x += (isLeft ? mainShake : -mainShake) * 0.3;
      targetEuler.z += (isLeft ? secondaryShake : -secondaryShake) * 0.2;
    } else if (boneName.includes('foot')) {
      targetEuler.x += (isLeft ? mainShake : -mainShake) * 0.25;
      targetEuler.y += (isLeft ? secondaryShake : -secondaryShake) * 0.15;
    }

    controller.setTargetRotation(boneName, targetEuler, { lerpFactor: config.lerpFactor });
  });
}

// Helper type para presets
function getPresets() {
  return {
    armResting: presetToEulers(ARM_RESTING_ROTATIONS),
    legResting: presetToEulers(LEG_RESTING_ROTATIONS),
    wave: presetToEulers(WAVE_ROTATIONS),
    nodYes: presetToEulers(NOD_YES_ROTATIONS),
    thinking: presetToEulers(THINKING_ROTATIONS),
    dance: presetToEulers(DANCE_ROTATIONS),
    shakeLegs: presetToEulers(SHAKE_LEGS_ROTATIONS),
    approach: presetToEulers(APPROACH_ROTATIONS),
  };
}
