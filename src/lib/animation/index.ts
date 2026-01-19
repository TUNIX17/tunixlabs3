/**
 * Sistema de animaciones para Robot Tunix
 * Exportaciones centralizadas
 */

// Configuración y presets
export * from './rotationPresets';
export * from './easingFunctions';
export * from './boneLerpConfig';

// Sistemas de animación
export * from './AnimationMachine';
export * from './AnimationQueue';
// BoneController - exclude BONE_GROUPS to avoid conflict with boneLerpConfig
export {
  BoneController,
  createBoneController,
  type BoneName,
  type TargetRotation,
  type BoneState,
  ALL_BONE_NAMES
} from './BoneController';
export * from './AnimationPriority';
export * from './SmoothRotation';

// Hook integrado
export * from './useRobotAnimations';
