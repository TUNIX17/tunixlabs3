/**
 * Bone-specific Lerp Configuration
 * Configuración de factores de interpolación por hueso para animaciones más naturales
 *
 * Los huesos más pesados (torso) se mueven más lento que los ligeros (cabeza, manos)
 * Cada hueso tiene factores separados para entrada y salida de animaciones
 */

export interface BoneLerpFactors {
  /** Factor de interpolación al entrar a una animación */
  enter: number;
  /** Factor de interpolación al salir de una animación */
  exit: number;
  /** Factor para movimientos sutiles/idle */
  idle: number;
  /** Factor máximo permitido (para limitar velocidad) */
  max: number;
}

/**
 * Configuración de lerp factors por hueso
 * Valores más bajos = movimiento más suave/lento
 * Valores más altos = movimiento más rápido/responsivo
 */
export const BONE_LERP_FACTORS: Record<string, BoneLerpFactors> = {
  // === CABEZA Y CUELLO (ligeros, responsivos) ===
  head: {
    enter: 0.08,
    exit: 0.12,
    idle: 0.06,
    max: 0.20
  },
  neck: {
    enter: 0.07,
    exit: 0.10,
    idle: 0.05,
    max: 0.18
  },

  // === TORSO (pesado, movimiento lento) ===
  body_top1: {
    enter: 0.03,
    exit: 0.05,
    idle: 0.02,
    max: 0.10
  },
  body_top2: {
    enter: 0.04,
    exit: 0.06,
    idle: 0.03,
    max: 0.12
  },

  // === HOMBROS (masa media) ===
  shoulder_left: {
    enter: 0.06,
    exit: 0.08,
    idle: 0.04,
    max: 0.15
  },
  shoulder_right: {
    enter: 0.06,
    exit: 0.08,
    idle: 0.04,
    max: 0.15
  },

  // === BRAZOS SUPERIORES ===
  arm_left_top: {
    enter: 0.07,
    exit: 0.09,
    idle: 0.04,
    max: 0.16
  },
  arm_right_top: {
    enter: 0.07,
    exit: 0.09,
    idle: 0.04,
    max: 0.16
  },

  // === ANTEBRAZOS (más ligeros, más rápidos) ===
  arm_left_bot: {
    enter: 0.10,
    exit: 0.15,
    idle: 0.06,
    max: 0.22
  },
  arm_right_bot: {
    enter: 0.10,
    exit: 0.15,
    idle: 0.06,
    max: 0.22
  },

  // === PIERNAS SUPERIORES ===
  leg_left_top: {
    enter: 0.05,
    exit: 0.07,
    idle: 0.03,
    max: 0.12
  },
  leg_right_top: {
    enter: 0.05,
    exit: 0.07,
    idle: 0.03,
    max: 0.12
  },

  // === PIERNAS INFERIORES (rodillas) ===
  leg_left_bot: {
    enter: 0.06,
    exit: 0.08,
    idle: 0.04,
    max: 0.14
  },
  leg_right_bot: {
    enter: 0.06,
    exit: 0.08,
    idle: 0.04,
    max: 0.14
  },

  // === PIES ===
  leg_left_foot: {
    enter: 0.07,
    exit: 0.10,
    idle: 0.05,
    max: 0.16
  },
  leg_right_foot: {
    enter: 0.07,
    exit: 0.10,
    idle: 0.05,
    max: 0.16
  }
};

/**
 * Valores por defecto para huesos no configurados
 */
export const DEFAULT_BONE_LERP: BoneLerpFactors = {
  enter: 0.06,
  exit: 0.08,
  idle: 0.04,
  max: 0.15
};

/**
 * Obtener el factor de lerp para un hueso específico
 * @param boneName Nombre del hueso
 * @param mode Modo de interpolación: 'enter', 'exit', 'idle'
 * @returns Factor de lerp apropiado
 */
export function getBoneLerpFactor(
  boneName: string,
  mode: 'enter' | 'exit' | 'idle' = 'enter'
): number {
  const config = BONE_LERP_FACTORS[boneName] || DEFAULT_BONE_LERP;
  return config[mode];
}

/**
 * Obtener factor de lerp con ajuste por distancia
 * Movimientos más largos usan un factor menor para suavidad
 * @param boneName Nombre del hueso
 * @param distance Distancia angular al objetivo (radianes)
 * @param mode Modo de interpolación
 * @returns Factor de lerp ajustado
 */
export function getAdaptiveLerpFactor(
  boneName: string,
  distance: number,
  mode: 'enter' | 'exit' | 'idle' = 'enter'
): number {
  const config = BONE_LERP_FACTORS[boneName] || DEFAULT_BONE_LERP;
  const baseFactor = config[mode];

  // Para distancias grandes (>0.5 rad ~= 30°), reducir el factor
  // Para distancias pequeñas, usar factor base o ligeramente mayor
  if (distance > 0.5) {
    return Math.max(baseFactor * 0.6, 0.02);
  } else if (distance < 0.1) {
    return Math.min(baseFactor * 1.3, config.max);
  }

  return baseFactor;
}

/**
 * Grupos de huesos para aplicar configuraciones en conjunto
 */
export const BONE_GROUPS = {
  head: ['head', 'neck'],
  torso: ['body_top1', 'body_top2'],
  leftArm: ['shoulder_left', 'arm_left_top', 'arm_left_bot'],
  rightArm: ['shoulder_right', 'arm_right_top', 'arm_right_bot'],
  leftLeg: ['leg_left_top', 'leg_left_bot', 'leg_left_foot'],
  rightLeg: ['leg_right_top', 'leg_right_bot', 'leg_right_foot'],
  arms: ['shoulder_left', 'shoulder_right', 'arm_left_top', 'arm_right_top', 'arm_left_bot', 'arm_right_bot'],
  legs: ['leg_left_top', 'leg_right_top', 'leg_left_bot', 'leg_right_bot', 'leg_left_foot', 'leg_right_foot'],
  upperBody: ['head', 'neck', 'body_top1', 'body_top2', 'shoulder_left', 'shoulder_right'],
  all: Object.keys(BONE_LERP_FACTORS)
};

/**
 * Verificar si un hueso pertenece a un grupo
 */
export function isBoneInGroup(boneName: string, groupName: keyof typeof BONE_GROUPS): boolean {
  return BONE_GROUPS[groupName].includes(boneName);
}

export default BONE_LERP_FACTORS;
