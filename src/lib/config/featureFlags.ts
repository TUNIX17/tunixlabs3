/**
 * Feature Flags Configuration
 * Allows gradual rollout and rollback of new features
 */

/**
 * Feature flags for robot animation and voice systems
 */
export const FEATURE_FLAGS = {
  /** Enable animation priority system for bone ownership resolution */
  ENABLE_ANIMATION_PRIORITY: process.env.NEXT_PUBLIC_ENABLE_ANIMATION_PRIORITY === 'true',

  /** Enable language confirmation (2-3 turns before switching) */
  ENABLE_LANGUAGE_CONFIRMATION: process.env.NEXT_PUBLIC_ENABLE_LANGUAGE_CONFIRMATION === 'true',

  /** VAD engine selection: 'rms' (current), 'silero' (new), or 'auto' (try silero, fallback to rms) */
  VAD_ENGINE: (process.env.NEXT_PUBLIC_VAD_ENGINE || 'rms') as 'rms' | 'silero' | 'auto',

  /** Enable spring-damper smoothing for animations */
  ENABLE_SMOOTH_ROTATION: process.env.NEXT_PUBLIC_ENABLE_SMOOTH_ROTATION === 'true',

  /** Enable per-bone lerp factors for more natural movement */
  ENABLE_BONE_LERP_CONFIG: process.env.NEXT_PUBLIC_ENABLE_BONE_LERP_CONFIG === 'true',
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  const value = FEATURE_FLAGS[feature];
  if (typeof value === 'boolean') {
    return value;
  }
  return false;
}

/**
 * Get VAD engine type
 */
export function getVADEngine(): 'rms' | 'silero' | 'auto' {
  return FEATURE_FLAGS.VAD_ENGINE;
}

export default FEATURE_FLAGS;
