/**
 * Presets de rotaciones para el Robot Tunix
 * Todas las rotaciones están en grados y se convierten a radianes en runtime
 */

import * as THREE from 'three';

// Tipo para definir rotaciones en grados
export interface RotationDegrees {
  x: number;
  y: number;
  z: number;
}

// Tipo para un conjunto de rotaciones de huesos
export type BoneRotationPreset = Record<string, RotationDegrees>;

/**
 * Convierte grados a Euler (radianes)
 */
export const degreesToEuler = (degrees: RotationDegrees): THREE.Euler => {
  return new THREE.Euler(
    THREE.MathUtils.degToRad(degrees.x),
    THREE.MathUtils.degToRad(degrees.y),
    THREE.MathUtils.degToRad(degrees.z)
  );
};

/**
 * Convierte un preset completo a Eulers
 */
export const presetToEulers = (preset: BoneRotationPreset): Record<string, THREE.Euler> => {
  const result: Record<string, THREE.Euler> = {};
  for (const [boneName, rotation] of Object.entries(preset)) {
    result[boneName] = degreesToEuler(rotation);
  }
  return result;
};

// ============================================
// POSE DE REPOSO - BRAZOS
// ============================================
export const ARM_RESTING_ROTATIONS: BoneRotationPreset = {
  shoulder_left: { x: 10, y: 10, z: -160 },
  shoulder_right: { x: 10, y: -10, z: 160 },
  arm_left_top: { x: 0, y: 0, z: 0 },
  arm_right_top: { x: 0, y: 0, z: 0 },
  arm_left_bot: { x: 25, y: 0, z: 0 },
  arm_right_bot: { x: 25, y: 0, z: 0 },
};

// ============================================
// POSE DE REPOSO - PIERNAS
// ============================================
export const LEG_RESTING_ROTATIONS: BoneRotationPreset = {
  leg_left_top: { x: 5, y: 2, z: -180 },
  leg_right_top: { x: 5, y: -2, z: -180 },
  leg_left_bot: { x: 10, y: 0, z: 0 },
  leg_right_bot: { x: 10, y: 0, z: 0 },
  leg_left_foot: { x: -5, y: 0, z: 0 },
  leg_right_foot: { x: -5, y: 0, z: 0 },
};

// ============================================
// ANIMACIÓN: SALUDO (WAVE)
// ============================================
export const WAVE_ROTATIONS: BoneRotationPreset = {
  shoulder_right: { x: -15, y: -20, z: 40 },
  arm_right_top: { x: 5, y: 5, z: 0 },
  arm_right_bot: { x: 70, y: 0, z: 0 },
};

// ============================================
// ANIMACIÓN: ASENTIR (NOD YES)
// ============================================
export const NOD_YES_ROTATIONS: BoneRotationPreset = {
  head: { x: -20, y: 0, z: 0 },
  neck: { x: -10, y: 0, z: 0 },
};

// ============================================
// ANIMACIÓN: PENSANDO (THINKING) - NUEVO
// ============================================
export const THINKING_ROTATIONS: BoneRotationPreset = {
  // Cabeza ligeramente ladeada hacia arriba y a la derecha
  head: { x: -10, y: 15, z: 5 },
  neck: { x: -5, y: 10, z: 3 },
  // Brazo derecho en posición de "mano en barbilla"
  shoulder_right: { x: 30, y: -25, z: 80 },
  arm_right_top: { x: 0, y: 0, z: 0 },
  arm_right_bot: { x: 120, y: 0, z: 0 }, // Codo muy flexionado
  // Brazo izquierdo cruzado sobre el pecho
  shoulder_left: { x: 20, y: 30, z: -100 },
  arm_left_bot: { x: 90, y: 0, z: 0 },
  // Cuerpo ligeramente inclinado
  body_top1: { x: 5, y: 0, z: -3 },
};

// ============================================
// ANIMACIÓN: BAILE (DANCE)
// ============================================
export const DANCE_ROTATIONS: BoneRotationPreset = {
  body_top1: { x: 0, y: 0, z: 5 },
  shoulder_left: { x: 15, y: 20, z: -130 },
  shoulder_right: { x: 15, y: -20, z: 130 },
  arm_left_bot: { x: 60, y: 0, z: 0 },
  arm_right_bot: { x: 60, y: 0, z: 0 },
  leg_left_top: { x: 15, y: 0, z: -180 },
  leg_right_top: { x: 5, y: 0, z: -180 },
};

// ============================================
// ANIMACIÓN: AGITAR PIERNAS (SHAKE LEGS)
// ============================================
export const SHAKE_LEGS_ROTATIONS: BoneRotationPreset = {
  leg_left_top: { x: 10, y: 0, z: -160 },
  leg_right_top: { x: 10, y: 0, z: -200 },
  leg_left_bot: { x: 45, y: 0, z: 10 },
  leg_right_bot: { x: 45, y: 0, z: -10 },
  leg_left_foot: { x: -20, y: 10, z: 0 },
  leg_right_foot: { x: -20, y: -10, z: 0 },
};

// ============================================
// ANIMACIÓN: ACERCARSE (APPROACH)
// ============================================
export const APPROACH_ROTATIONS: BoneRotationPreset = {
  head: { x: -15, y: 0, z: 0 },
  neck: { x: -10, y: 0, z: 0 },
  body_top1: { x: 15, y: 0, z: 0 },
  body_top2: { x: 5, y: 0, z: 0 },
  shoulder_left: { x: 20, y: 15, z: -130 },
  shoulder_right: { x: 20, y: -15, z: 130 },
  arm_left_bot: { x: 30, y: 0, z: 0 },
  arm_right_bot: { x: 30, y: 0, z: 0 },
};

// ============================================
// CONFIGURACIÓN DE ANIMACIONES
// ============================================
export interface AnimationConfig {
  duration: number;       // Duración en ms
  lerpFactor: number;     // Factor de interpolación (0-1)
  oscillation?: {
    frequency: number;    // Frecuencia de oscilación
    amplitude: number;    // Amplitud de oscilación
  };
}

export const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
  idle: {
    duration: Infinity,
    lerpFactor: 0.05,
  },
  wave: {
    duration: 2500,
    lerpFactor: 0.1,
    oscillation: { frequency: 5, amplitude: 0.3 },
  },
  approach: {
    duration: 2000,
    lerpFactor: 0.08,
  },
  stepBack: {
    duration: 1800,
    lerpFactor: 0.08,
  },
  dance: {
    duration: 3000,
    lerpFactor: 0.2,
    oscillation: { frequency: 5, amplitude: 0.7 },
  },
  nodYes: {
    duration: 1500,
    lerpFactor: 0.3,
    oscillation: { frequency: 6, amplitude: 0.5 },
  },
  shakeLegs: {
    duration: 2500,
    lerpFactor: 0.15,
    oscillation: { frequency: 8, amplitude: 0.6 },
  },
  thinking: {
    duration: 0, // Continua mientras esté en estado PROCESSING
    lerpFactor: 0.06,
    oscillation: { frequency: 0.8, amplitude: 0.1 },
  },
};

// ============================================
// PARÁMETROS DE IDLE
// ============================================
export const IDLE_PARAMS = {
  breath: {
    frequency: 0.7,
    amplitudeX: 0.01,
    amplitudeY: 0.005,
  },
  bodySway: {
    frequencyX: 0.3,
    frequencyZ: 0.2,
    amplitudeX: 0.005,
    amplitudeZ: 0.003,
  },
  shoulderIdle: {
    frequencyX: 0.6,
    frequencyY: 0.4,
    amplitudeX: 0.025,
    amplitudeY: 0.015,
  },
  elbowIdle: {
    frequency: 0.7,
    amplitude: 0.02,
  },
  legSway: {
    frequency: 0.4,
    amplitudeX: 0.02,
    amplitudeY: 0.01,
  },
  kneeSway: {
    frequency: 0.4,
    phaseOffset: 0.2,
    amplitude: 0.015,
  },
  footSway: {
    frequency: 0.4,
    phaseOffset: 0.4,
    amplitude: 0.01,
  },
};

// ============================================
// PARÁMETROS DE SEGUIMIENTO DE CURSOR
// ============================================
export const CURSOR_TRACKING = {
  head: {
    sensitivityX: 0.5,
    sensitivityY: 0.3,
    lerpFactor: 0.05,
  },
  neck: {
    sensitivityX: 0.3,
    sensitivityY: 0.15,
    lerpFactor: 0.07,
  },
  bodyTop2: {
    sensitivityX: 0.1,
    lerpFactor: 0.09,
  },
};

// ============================================
// PARÁMETROS DE LISTENING
// ============================================
export const LISTENING_PARAMS = {
  headTilt: {
    frequency: 1.5,
    amplitude: 0.05,
  },
  neckTilt: {
    frequency: 1.5,
    amplitude: 0.03,
  },
};
