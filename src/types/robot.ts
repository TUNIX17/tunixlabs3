export interface RobotPosition {
  x: number;
  y: number;
  z: number;
}

export interface RobotRotation {
  x: number; // En radianes
  y: number; // En radianes
  z: number; // En radianes
}

export interface RobotScale {
  x: number;
  y: number;
  z: number;
}

export interface RobotTransform {
  position: RobotPosition;
  rotation: RobotRotation;
  scale: RobotScale;
}

export enum RobotPart {
  HEAD = 'head',
  BODY = 'body',
  LEFT_ARM = 'leftArm',
  RIGHT_ARM = 'rightArm',
  LEFT_LEG = 'leftLeg',
  RIGHT_LEG = 'rightLeg',
  EYES = 'eyes'
}

export interface RobotPartTransform {
  part: RobotPart;
  transform: Partial<RobotTransform>;
}

export interface RobotAnimation {
  name: string;
  duration: number; // En milisegundos
  loop?: boolean;
  easing?: string; // Tipo de interpolación
  keyframes: RobotAnimationKeyframe[];
}

export interface RobotAnimationKeyframe {
  time: number; // Porcentaje de progreso (0-1)
  transforms: RobotPartTransform[];
}

export interface RobotMethods {
  // Métodos de animación
  startWaving: () => void;
  approachCamera: () => void;
  stepBackward: () => void;
  danceMove: () => void;
  nodYes: () => void;
  shakeLegsTwist: () => void;
  startThinking: () => void;
  stopThinking: () => void;
  
  // // Métodos de control (Eliminados temporalmente para coincidir con la implementación actual)
  // setPosition: (position: Partial<RobotPosition>) => void;
  // setRotation: (rotation: Partial<RobotRotation>) => void;
  // setScale: (scale: Partial<RobotScale>) => void;
  // resetTransform: () => void;
  
  // // Métodos de estado (Eliminados temporalmente)
  // setActive: (active: boolean) => void;
  // isActive: () => boolean;
  
  // // Métodos de partes (Eliminados temporalmente)
  // movePart: (part: RobotPart, transform: Partial<RobotTransform>) => void;
  // resetPart: (part: RobotPart) => void;
}

export enum RobotMood {
  HAPPY = 'happy',
  SAD = 'sad',
  SURPRISED = 'surprised',
  THINKING = 'thinking',
  NEUTRAL = 'neutral',
  EXCITED = 'excited',
  CONFUSED = 'confused'
}

export interface RobotState {
  mood: RobotMood;
  speaking: boolean;
  listening: boolean;
  active: boolean;
}

export interface RobotConfig {
  initialPosition?: Partial<RobotPosition>;
  initialRotation?: Partial<RobotRotation>;
  initialScale?: Partial<RobotScale>;
  initialMood?: RobotMood;
  autoAnimate?: boolean;
  idleAnimation?: boolean;
} 