/**
 * Funciones de Easing para animaciones del Robot
 * Basadas en las curvas de Robert Penner
 */

export type EasingFunction = (t: number) => number;

// ============================================
// FUNCIONES BÁSICAS
// ============================================

/** Sin easing - movimiento lineal */
export const linear: EasingFunction = (t) => t;

// ============================================
// QUAD (CUADRÁTICA)
// ============================================

/** Aceleración cuadrática */
export const easeInQuad: EasingFunction = (t) => t * t;

/** Desaceleración cuadrática */
export const easeOutQuad: EasingFunction = (t) => t * (2 - t);

/** Aceleración y desaceleración cuadrática */
export const easeInOutQuad: EasingFunction = (t) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// ============================================
// CUBIC (CÚBICA)
// ============================================

/** Aceleración cúbica */
export const easeInCubic: EasingFunction = (t) => t * t * t;

/** Desaceleración cúbica */
export const easeOutCubic: EasingFunction = (t) => {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
};

/** Aceleración y desaceleración cúbica */
export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

// ============================================
// QUART (CUÁRTICA)
// ============================================

/** Aceleración cuártica */
export const easeInQuart: EasingFunction = (t) => t * t * t * t;

/** Desaceleración cuártica */
export const easeOutQuart: EasingFunction = (t) => {
  const t1 = t - 1;
  return 1 - t1 * t1 * t1 * t1;
};

/** Aceleración y desaceleración cuártica */
export const easeInOutQuart: EasingFunction = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (t - 1) * (t - 1) * (t - 1) * (t - 1);

// ============================================
// EXPO (EXPONENCIAL)
// ============================================

/** Aceleración exponencial */
export const easeInExpo: EasingFunction = (t) =>
  t === 0 ? 0 : Math.pow(2, 10 * (t - 1));

/** Desaceleración exponencial */
export const easeOutExpo: EasingFunction = (t) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/** Aceleración y desaceleración exponencial */
export const easeInOutExpo: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
  return (2 - Math.pow(2, -20 * t + 10)) / 2;
};

// ============================================
// BACK (RETROCESO)
// ============================================

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;

/** Retroceso antes de avanzar */
export const easeInBack: EasingFunction = (t) =>
  c3 * t * t * t - c1 * t * t;

/** Sobrepaso y retroceso al final */
export const easeOutBack: EasingFunction = (t) => {
  const t1 = t - 1;
  return 1 + c3 * t1 * t1 * t1 + c1 * t1 * t1;
};

/** Retroceso al inicio y sobrepaso al final */
export const easeInOutBack: EasingFunction = (t) =>
  t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;

// ============================================
// ELASTIC (ELÁSTICO)
// ============================================

const c4 = (2 * Math.PI) / 3;
const c5 = (2 * Math.PI) / 4.5;

/** Efecto elástico al inicio */
export const easeInElastic: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
};

/** Efecto elástico al final */
export const easeOutElastic: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

/** Efecto elástico al inicio y final */
export const easeInOutElastic: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) {
    return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2;
  }
  return (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
};

// ============================================
// BOUNCE (REBOTE)
// ============================================

const n1 = 7.5625;
const d1 = 2.75;

/** Efecto de rebote al final */
export const easeOutBounce: EasingFunction = (t) => {
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    const t1 = t - 1.5 / d1;
    return n1 * t1 * t1 + 0.75;
  } else if (t < 2.5 / d1) {
    const t1 = t - 2.25 / d1;
    return n1 * t1 * t1 + 0.9375;
  } else {
    const t1 = t - 2.625 / d1;
    return n1 * t1 * t1 + 0.984375;
  }
};

/** Efecto de rebote al inicio */
export const easeInBounce: EasingFunction = (t) =>
  1 - easeOutBounce(1 - t);

/** Efecto de rebote al inicio y final */
export const easeInOutBounce: EasingFunction = (t) =>
  t < 0.5
    ? (1 - easeOutBounce(1 - 2 * t)) / 2
    : (1 + easeOutBounce(2 * t - 1)) / 2;

// ============================================
// SINE (SINUSOIDAL)
// ============================================

/** Aceleración sinusoidal */
export const easeInSine: EasingFunction = (t) =>
  1 - Math.cos((t * Math.PI) / 2);

/** Desaceleración sinusoidal */
export const easeOutSine: EasingFunction = (t) =>
  Math.sin((t * Math.PI) / 2);

/** Aceleración y desaceleración sinusoidal */
export const easeInOutSine: EasingFunction = (t) =>
  -(Math.cos(Math.PI * t) - 1) / 2;

// ============================================
// CIRC (CIRCULAR)
// ============================================

/** Aceleración circular */
export const easeInCirc: EasingFunction = (t) =>
  1 - Math.sqrt(1 - t * t);

/** Desaceleración circular */
export const easeOutCirc: EasingFunction = (t) =>
  Math.sqrt(1 - Math.pow(t - 1, 2));

/** Aceleración y desaceleración circular */
export const easeInOutCirc: EasingFunction = (t) =>
  t < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;

// ============================================
// MAPA DE FUNCIONES PARA CONFIGURACIÓN
// ============================================

export const easingMap: Record<string, EasingFunction> = {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
};

/**
 * Obtiene una función de easing por nombre
 */
export const getEasing = (name: string): EasingFunction => {
  return easingMap[name] || easeInOutQuad;
};
