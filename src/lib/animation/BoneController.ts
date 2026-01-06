/**
 * BoneController - Control centralizado de huesos del Robot
 * Maneja referencias, rotaciones y blending entre estados
 */

import * as THREE from 'three';
import { EasingFunction, easeInOutQuad } from './easingFunctions';

// Nombres de huesos disponibles
export type BoneName =
  | 'head'
  | 'neck'
  | 'body_top1'
  | 'body_top2'
  | 'shoulder_left'
  | 'shoulder_right'
  | 'arm_left_top'
  | 'arm_right_top'
  | 'arm_left_bot'
  | 'arm_right_bot'
  | 'leg_left_top'
  | 'leg_right_top'
  | 'leg_left_bot'
  | 'leg_right_bot'
  | 'leg_left_foot'
  | 'leg_right_foot';

// Lista de todos los huesos
export const ALL_BONE_NAMES: BoneName[] = [
  'head',
  'neck',
  'body_top1',
  'body_top2',
  'shoulder_left',
  'shoulder_right',
  'arm_left_top',
  'arm_right_top',
  'arm_left_bot',
  'arm_right_bot',
  'leg_left_top',
  'leg_right_top',
  'leg_left_bot',
  'leg_right_bot',
  'leg_left_foot',
  'leg_right_foot',
];

// Grupos de huesos para animaciones selectivas
export const BONE_GROUPS = {
  head: ['head', 'neck'] as BoneName[],
  torso: ['body_top1', 'body_top2'] as BoneName[],
  leftArm: ['shoulder_left', 'arm_left_top', 'arm_left_bot'] as BoneName[],
  rightArm: ['shoulder_right', 'arm_right_top', 'arm_right_bot'] as BoneName[],
  arms: [
    'shoulder_left',
    'shoulder_right',
    'arm_left_top',
    'arm_right_top',
    'arm_left_bot',
    'arm_right_bot',
  ] as BoneName[],
  leftLeg: ['leg_left_top', 'leg_left_bot', 'leg_left_foot'] as BoneName[],
  rightLeg: ['leg_right_top', 'leg_right_bot', 'leg_right_foot'] as BoneName[],
  legs: [
    'leg_left_top',
    'leg_right_top',
    'leg_left_bot',
    'leg_right_bot',
    'leg_left_foot',
    'leg_right_foot',
  ] as BoneName[],
  upper: ['head', 'neck', 'body_top1', 'body_top2', 'shoulder_left', 'shoulder_right'] as BoneName[],
  lower: [
    'leg_left_top',
    'leg_right_top',
    'leg_left_bot',
    'leg_right_bot',
    'leg_left_foot',
    'leg_right_foot',
  ] as BoneName[],
};

// Rotación objetivo con información de blending
export interface TargetRotation {
  euler: THREE.Euler;
  weight: number; // 0-1, peso del blend
  easing?: EasingFunction;
}

// Estado de un hueso
export interface BoneState {
  ref: THREE.Object3D | null;
  initialRotation: THREE.Euler;
  currentTarget: THREE.Euler;
  blendFrom: THREE.Euler;
  blendProgress: number;
  isBlending: boolean;
  lerpFactor: number;
}

/**
 * BoneController - Controlador centralizado de huesos
 */
export class BoneController {
  private bones: Map<BoneName, BoneState> = new Map();
  private defaultLerpFactor: number = 0.05;
  private globalBlendProgress: number = 1;
  private globalBlendDuration: number = 0;
  private globalBlendStartTime: number = 0;
  private isGlobalBlending: boolean = false;

  constructor(lerpFactor?: number) {
    if (lerpFactor !== undefined) {
      this.defaultLerpFactor = lerpFactor;
    }

    // Inicializar estados vacíos para todos los huesos
    ALL_BONE_NAMES.forEach(name => {
      this.bones.set(name, {
        ref: null,
        initialRotation: new THREE.Euler(),
        currentTarget: new THREE.Euler(),
        blendFrom: new THREE.Euler(),
        blendProgress: 1,
        isBlending: false,
        lerpFactor: this.defaultLerpFactor,
      });
    });
  }

  /**
   * Registra un hueso desde la escena
   */
  registerBone(name: BoneName, object: THREE.Object3D): void {
    const state = this.bones.get(name);
    if (state) {
      state.ref = object;
      state.initialRotation = object.rotation.clone();
      state.currentTarget = object.rotation.clone();
      state.blendFrom = object.rotation.clone();
    }
  }

  /**
   * Registra múltiples huesos desde una escena THREE.js
   */
  registerFromScene(scene: THREE.Object3D): void {
    scene.traverse(object => {
      if (object instanceof THREE.Bone && ALL_BONE_NAMES.includes(object.name as BoneName)) {
        this.registerBone(object.name as BoneName, object);
      }
    });
  }

  /**
   * Obtiene el estado de un hueso
   */
  getBoneState(name: BoneName): BoneState | undefined {
    return this.bones.get(name);
  }

  /**
   * Obtiene la referencia de un hueso
   */
  getBoneRef(name: BoneName): THREE.Object3D | null {
    return this.bones.get(name)?.ref || null;
  }

  /**
   * Verifica si un hueso está registrado
   */
  hasBone(name: BoneName): boolean {
    const state = this.bones.get(name);
    return state?.ref !== null;
  }

  /**
   * Obtiene la rotación inicial de un hueso
   */
  getInitialRotation(name: BoneName): THREE.Euler | null {
    return this.bones.get(name)?.initialRotation || null;
  }

  /**
   * Establece la rotación objetivo de un hueso
   */
  setTargetRotation(
    name: BoneName,
    rotation: THREE.Euler,
    options?: { lerpFactor?: number; startBlend?: boolean }
  ): void {
    const state = this.bones.get(name);
    if (!state || !state.ref) return;

    if (options?.startBlend) {
      state.blendFrom.copy(state.ref.rotation);
      state.blendProgress = 0;
      state.isBlending = true;
    }

    state.currentTarget.copy(rotation);
    if (options?.lerpFactor !== undefined) {
      state.lerpFactor = options.lerpFactor;
    }
  }

  /**
   * Establece rotaciones objetivo para múltiples huesos
   */
  setTargetRotations(
    rotations: Partial<Record<BoneName, THREE.Euler>>,
    options?: { lerpFactor?: number; startBlend?: boolean }
  ): void {
    Object.entries(rotations).forEach(([name, rotation]) => {
      if (rotation) {
        this.setTargetRotation(name as BoneName, rotation, options);
      }
    });
  }

  /**
   * Establece rotaciones para un grupo de huesos
   */
  setGroupTargetRotations(
    group: keyof typeof BONE_GROUPS,
    rotations: Partial<Record<BoneName, THREE.Euler>>,
    options?: { lerpFactor?: number; startBlend?: boolean }
  ): void {
    const boneNames = BONE_GROUPS[group];
    boneNames.forEach(name => {
      const rotation = rotations[name];
      if (rotation) {
        this.setTargetRotation(name, rotation, options);
      }
    });
  }

  /**
   * Aplica una rotación adicional (offset) a un hueso
   */
  addRotationOffset(name: BoneName, offset: { x?: number; y?: number; z?: number }): void {
    const state = this.bones.get(name);
    if (!state) return;

    if (offset.x !== undefined) state.currentTarget.x += offset.x;
    if (offset.y !== undefined) state.currentTarget.y += offset.y;
    if (offset.z !== undefined) state.currentTarget.z += offset.z;
  }

  /**
   * Inicia un blend global (afecta a todos los huesos)
   */
  startGlobalBlend(durationMs: number): void {
    this.globalBlendDuration = durationMs;
    this.globalBlendStartTime = performance.now();
    this.globalBlendProgress = 0;
    this.isGlobalBlending = true;

    // Guardar rotaciones actuales como punto de partida
    this.bones.forEach(state => {
      if (state.ref) {
        state.blendFrom.copy(state.ref.rotation);
        state.blendProgress = 0;
        state.isBlending = true;
      }
    });
  }

  /**
   * Actualiza el progreso del blend global
   */
  updateGlobalBlend(): number {
    if (!this.isGlobalBlending) {
      return 1;
    }

    const elapsed = performance.now() - this.globalBlendStartTime;
    this.globalBlendProgress = Math.min(elapsed / this.globalBlendDuration, 1);

    if (this.globalBlendProgress >= 1) {
      this.isGlobalBlending = false;
      this.bones.forEach(state => {
        state.isBlending = false;
        state.blendProgress = 1;
      });
    }

    return this.globalBlendProgress;
  }

  /**
   * Aplica las rotaciones a los huesos (llamar cada frame)
   */
  update(easing: EasingFunction = easeInOutQuad): void {
    // Actualizar blend global si está activo
    const globalProgress = this.updateGlobalBlend();

    this.bones.forEach((state, name) => {
      if (!state.ref) return;

      const target = state.currentTarget;
      const current = state.ref.rotation;

      if (state.isBlending && this.isGlobalBlending) {
        // Usar blend con easing
        const easedProgress = easing(globalProgress);
        current.x = THREE.MathUtils.lerp(state.blendFrom.x, target.x, easedProgress);
        current.y = THREE.MathUtils.lerp(state.blendFrom.y, target.y, easedProgress);
        current.z = THREE.MathUtils.lerp(state.blendFrom.z, target.z, easedProgress);
      } else {
        // Usar lerp normal
        current.x = THREE.MathUtils.lerp(current.x, target.x, state.lerpFactor);
        current.y = THREE.MathUtils.lerp(current.y, target.y, state.lerpFactor);
        current.z = THREE.MathUtils.lerp(current.z, target.z, state.lerpFactor);
      }
    });
  }

  /**
   * Actualiza solo huesos específicos
   */
  updateBones(names: BoneName[], easing: EasingFunction = easeInOutQuad): void {
    names.forEach(name => {
      const state = this.bones.get(name);
      if (!state?.ref) return;

      const target = state.currentTarget;
      const current = state.ref.rotation;

      current.x = THREE.MathUtils.lerp(current.x, target.x, state.lerpFactor);
      current.y = THREE.MathUtils.lerp(current.y, target.y, state.lerpFactor);
      current.z = THREE.MathUtils.lerp(current.z, target.z, state.lerpFactor);
    });
  }

  /**
   * Actualiza un grupo de huesos
   */
  updateGroup(group: keyof typeof BONE_GROUPS, easing?: EasingFunction): void {
    this.updateBones(BONE_GROUPS[group], easing);
  }

  /**
   * Resetea todos los huesos a su rotación inicial
   */
  resetAll(startBlend: boolean = true): void {
    this.bones.forEach((state, name) => {
      if (state.ref) {
        this.setTargetRotation(name, state.initialRotation.clone(), { startBlend });
      }
    });
  }

  /**
   * Resetea un grupo de huesos a su rotación inicial
   */
  resetGroup(group: keyof typeof BONE_GROUPS, startBlend: boolean = true): void {
    BONE_GROUPS[group].forEach(name => {
      const state = this.bones.get(name);
      if (state?.ref) {
        this.setTargetRotation(name, state.initialRotation.clone(), { startBlend });
      }
    });
  }

  /**
   * Establece el factor de lerp global
   */
  setGlobalLerpFactor(factor: number): void {
    this.defaultLerpFactor = factor;
    this.bones.forEach(state => {
      state.lerpFactor = factor;
    });
  }

  /**
   * Establece el factor de lerp para huesos específicos
   */
  setLerpFactor(names: BoneName[], factor: number): void {
    names.forEach(name => {
      const state = this.bones.get(name);
      if (state) {
        state.lerpFactor = factor;
      }
    });
  }

  /**
   * Verifica si el blend global está activo
   */
  isBlending(): boolean {
    return this.isGlobalBlending;
  }

  /**
   * Obtiene el progreso del blend global
   */
  getBlendProgress(): number {
    return this.globalBlendProgress;
  }

  /**
   * Serializa el estado del controlador (útil para debugging)
   */
  toJSON(): object {
    const bonesState: Record<string, object> = {};
    this.bones.forEach((state, name) => {
      if (state.ref) {
        bonesState[name] = {
          hasRef: true,
          isBlending: state.isBlending,
          lerpFactor: state.lerpFactor,
          currentRotation: {
            x: state.ref.rotation.x.toFixed(3),
            y: state.ref.rotation.y.toFixed(3),
            z: state.ref.rotation.z.toFixed(3),
          },
        };
      }
    });

    return {
      registeredBones: Object.keys(bonesState).length,
      isGlobalBlending: this.isGlobalBlending,
      globalBlendProgress: this.globalBlendProgress.toFixed(3),
      bones: bonesState,
    };
  }
}

/**
 * Factory para crear instancias de BoneController
 */
export function createBoneController(lerpFactor?: number): BoneController {
  return new BoneController(lerpFactor);
}
