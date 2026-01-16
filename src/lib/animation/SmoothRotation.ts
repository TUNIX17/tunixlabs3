/**
 * Smooth Rotation System
 * Sistema de suavizado para rotaciones usando spring-damper
 *
 * Implementa un sistema de interpolación suave que:
 * - Elimina jitter en transiciones
 * - Proporciona movimiento natural con momentum
 * - Permite configurar la "rigidez" del movimiento
 */

import * as THREE from 'three';

/**
 * Configuración para el suavizado
 */
export interface SmoothConfig {
  /** Tiempo de suavizado en segundos (menor = más rápido) */
  smoothTime: number;
  /** Velocidad máxima permitida (rad/s) */
  maxSpeed: number;
  /** Umbral para considerar que llegó al objetivo */
  arrivalThreshold: number;
}

/**
 * Configuración por defecto
 */
export const DEFAULT_SMOOTH_CONFIG: SmoothConfig = {
  smoothTime: 0.15,
  maxSpeed: 10.0,
  arrivalThreshold: 0.001
};

/**
 * Presets de configuración para diferentes tipos de movimiento
 */
export const SMOOTH_PRESETS = {
  /** Movimiento muy suave, lento */
  verySlow: {
    smoothTime: 0.3,
    maxSpeed: 5.0,
    arrivalThreshold: 0.001
  },
  /** Movimiento suave normal */
  normal: {
    smoothTime: 0.15,
    maxSpeed: 10.0,
    arrivalThreshold: 0.001
  },
  /** Movimiento rápido pero suave */
  fast: {
    smoothTime: 0.08,
    maxSpeed: 15.0,
    arrivalThreshold: 0.002
  },
  /** Movimiento muy responsivo */
  responsive: {
    smoothTime: 0.05,
    maxSpeed: 20.0,
    arrivalThreshold: 0.003
  },
  /** Para tracking del cursor */
  cursorTrack: {
    smoothTime: 0.1,
    maxSpeed: 12.0,
    arrivalThreshold: 0.001
  }
} as const;

/**
 * Clase para manejar rotación suavizada de un eje
 */
export class SmoothValue {
  private current: number = 0;
  private velocity: number = 0;
  private target: number = 0;
  private config: SmoothConfig;

  constructor(initialValue: number = 0, config: Partial<SmoothConfig> = {}) {
    this.current = initialValue;
    this.target = initialValue;
    this.config = { ...DEFAULT_SMOOTH_CONFIG, ...config };
  }

  /**
   * Establecer el valor objetivo
   */
  setTarget(value: number): void {
    this.target = value;
  }

  /**
   * Obtener el valor actual
   */
  getCurrent(): number {
    return this.current;
  }

  /**
   * Obtener la velocidad actual
   */
  getVelocity(): number {
    return this.velocity;
  }

  /**
   * Verificar si ha llegado al objetivo
   */
  hasArrived(): boolean {
    return Math.abs(this.current - this.target) < this.config.arrivalThreshold &&
           Math.abs(this.velocity) < this.config.arrivalThreshold;
  }

  /**
   * Actualizar el valor (llamar cada frame)
   * @param deltaTime Tiempo desde el último frame en segundos
   * @returns El nuevo valor actual
   */
  update(deltaTime: number): number {
    // Implementación de SmoothDamp (similar a Unity)
    const smoothTime = Math.max(0.0001, this.config.smoothTime);
    const omega = 2 / smoothTime;
    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

    let change = this.current - this.target;
    const originalTo = this.target;

    // Clamp máximo cambio
    const maxChange = this.config.maxSpeed * smoothTime;
    change = Math.max(-maxChange, Math.min(maxChange, change));

    this.target = this.current - change;

    const temp = (this.velocity + omega * change) * deltaTime;
    this.velocity = (this.velocity - omega * temp) * exp;

    let output = this.target + (change + temp) * exp;

    // Prevenir overshooting
    if ((originalTo - this.current > 0) === (output > originalTo)) {
      output = originalTo;
      this.velocity = (output - originalTo) / deltaTime;
    }

    this.current = output;
    return this.current;
  }

  /**
   * Forzar el valor actual inmediatamente
   */
  snapTo(value: number): void {
    this.current = value;
    this.target = value;
    this.velocity = 0;
  }

  /**
   * Actualizar configuración
   */
  setConfig(config: Partial<SmoothConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Clase para manejar rotación suavizada en 3D (Euler)
 */
export class SmoothRotation {
  private x: SmoothValue;
  private y: SmoothValue;
  private z: SmoothValue;

  constructor(
    initial: THREE.Euler | { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
    config: Partial<SmoothConfig> = {}
  ) {
    this.x = new SmoothValue(initial.x, config);
    this.y = new SmoothValue(initial.y, config);
    this.z = new SmoothValue(initial.z, config);
  }

  /**
   * Establecer rotación objetivo
   */
  setTarget(target: THREE.Euler | { x: number; y: number; z: number }): void {
    this.x.setTarget(target.x);
    this.y.setTarget(target.y);
    this.z.setTarget(target.z);
  }

  /**
   * Establecer un solo eje objetivo
   */
  setTargetAxis(axis: 'x' | 'y' | 'z', value: number): void {
    this[axis].setTarget(value);
  }

  /**
   * Obtener rotación actual como Euler
   */
  getCurrent(): THREE.Euler {
    return new THREE.Euler(
      this.x.getCurrent(),
      this.y.getCurrent(),
      this.z.getCurrent()
    );
  }

  /**
   * Obtener valor actual de un eje
   */
  getCurrentAxis(axis: 'x' | 'y' | 'z'): number {
    return this[axis].getCurrent();
  }

  /**
   * Verificar si ha llegado al objetivo
   */
  hasArrived(): boolean {
    return this.x.hasArrived() && this.y.hasArrived() && this.z.hasArrived();
  }

  /**
   * Actualizar la rotación (llamar cada frame)
   * @param deltaTime Tiempo desde el último frame en segundos
   * @returns La nueva rotación como Euler
   */
  update(deltaTime: number): THREE.Euler {
    this.x.update(deltaTime);
    this.y.update(deltaTime);
    this.z.update(deltaTime);
    return this.getCurrent();
  }

  /**
   * Aplicar la rotación suavizada a un objeto 3D
   */
  applyTo(object: THREE.Object3D, deltaTime: number): void {
    const rotation = this.update(deltaTime);
    object.rotation.copy(rotation);
  }

  /**
   * Forzar rotación inmediatamente
   */
  snapTo(rotation: THREE.Euler | { x: number; y: number; z: number }): void {
    this.x.snapTo(rotation.x);
    this.y.snapTo(rotation.y);
    this.z.snapTo(rotation.z);
  }

  /**
   * Actualizar configuración para todos los ejes
   */
  setConfig(config: Partial<SmoothConfig>): void {
    this.x.setConfig(config);
    this.y.setConfig(config);
    this.z.setConfig(config);
  }

  /**
   * Obtener la distancia angular al objetivo
   */
  getDistanceToTarget(): number {
    const dx = this.x.getCurrent() - this.x['target'];
    const dy = this.y.getCurrent() - this.y['target'];
    const dz = this.z.getCurrent() - this.z['target'];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

/**
 * Manager para múltiples rotaciones suavizadas (por hueso)
 */
export class SmoothRotationManager {
  private rotations: Map<string, SmoothRotation> = new Map();
  private defaultConfig: SmoothConfig;

  constructor(config: Partial<SmoothConfig> = {}) {
    this.defaultConfig = { ...DEFAULT_SMOOTH_CONFIG, ...config };
  }

  /**
   * Obtener o crear una rotación suavizada para un hueso
   */
  getOrCreate(
    boneName: string,
    initial?: THREE.Euler | { x: number; y: number; z: number },
    config?: Partial<SmoothConfig>
  ): SmoothRotation {
    if (!this.rotations.has(boneName)) {
      this.rotations.set(
        boneName,
        new SmoothRotation(initial || { x: 0, y: 0, z: 0 }, config || this.defaultConfig)
      );
    }
    return this.rotations.get(boneName)!;
  }

  /**
   * Establecer objetivo para un hueso
   */
  setTarget(boneName: string, target: THREE.Euler | { x: number; y: number; z: number }): void {
    const rotation = this.getOrCreate(boneName);
    rotation.setTarget(target);
  }

  /**
   * Actualizar todas las rotaciones
   */
  updateAll(deltaTime: number): void {
    this.rotations.forEach(rotation => {
      rotation.update(deltaTime);
    });
  }

  /**
   * Obtener rotación actual de un hueso
   */
  getCurrent(boneName: string): THREE.Euler | null {
    const rotation = this.rotations.get(boneName);
    return rotation ? rotation.getCurrent() : null;
  }

  /**
   * Verificar si un hueso ha llegado a su objetivo
   */
  hasArrived(boneName: string): boolean {
    const rotation = this.rotations.get(boneName);
    return rotation ? rotation.hasArrived() : true;
  }

  /**
   * Verificar si todos los huesos han llegado
   */
  allArrived(): boolean {
    let allDone = true;
    this.rotations.forEach(rotation => {
      if (!rotation.hasArrived()) allDone = false;
    });
    return allDone;
  }

  /**
   * Limpiar todas las rotaciones
   */
  clear(): void {
    this.rotations.clear();
  }

  /**
   * Eliminar rotación de un hueso específico
   */
  remove(boneName: string): void {
    this.rotations.delete(boneName);
  }
}

/**
 * Helper para aplicar suavizado simple a un valor
 * Útil para casos donde no necesitas la clase completa
 */
export function smoothDamp(
  current: number,
  target: number,
  velocity: { value: number },
  smoothTime: number,
  maxSpeed: number,
  deltaTime: number
): number {
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  let change = current - target;
  const originalTo = target;

  const maxChange = maxSpeed * smoothTime;
  change = Math.max(-maxChange, Math.min(maxChange, change));

  target = current - change;

  const temp = (velocity.value + omega * change) * deltaTime;
  velocity.value = (velocity.value - omega * temp) * exp;

  let output = target + (change + temp) * exp;

  if ((originalTo - current > 0) === (output > originalTo)) {
    output = originalTo;
    velocity.value = (output - originalTo) / deltaTime;
  }

  return output;
}

export default SmoothRotation;
