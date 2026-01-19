/**
 * VAD Factory
 * Creates the appropriate VAD implementation based on configuration
 * Supports automatic fallback from Silero to RMS if initialization fails
 */

import { VoiceActivityDetector, VADState, VADEvent, VADCallback } from './vad';
import { SileroVADWrapper, SileroVADConfig, DEFAULT_SILERO_CONFIG } from './sileroVAD';
import { VADConfig, DEFAULT_VAD_CONFIG } from './vadConfig';
import { getVADEngine } from '../config/featureFlags';

/** Supported VAD engine types */
export type VADEngineType = 'rms' | 'silero' | 'auto';

/** Unified VAD interface that both implementations follow */
export interface UnifiedVAD {
  start(): Promise<void>;
  stop(): void;
  dispose(): void;
  setThreshold(threshold: number): void;
  getState(): VADState;
  getCurrentThreshold(): number;
  getNoiseFloor(): number;
  isCalibrating(): boolean;
  recalibrate(): void;
  on(event: VADEvent, callback: VADCallback): void;
  off(event: VADEvent, callback?: VADCallback): void;
  updateConfig(config: Partial<VADConfig | SileroVADConfig>): void;
  getConfig(): VADConfig | SileroVADConfig;
}

/** Factory configuration */
export interface VADFactoryConfig {
  /** Which engine to use: 'rms', 'silero', or 'auto' (try silero, fallback to rms) */
  engine: VADEngineType;
  /** Configuration for RMS-based VAD */
  rmsConfig?: Partial<VADConfig>;
  /** Configuration for Silero VAD */
  sileroConfig?: Partial<SileroVADConfig>;
}

/** Factory result with metadata */
export interface VADFactoryResult {
  /** The created VAD instance */
  vad: UnifiedVAD;
  /** The actual engine type that was created */
  engineType: 'rms' | 'silero';
  /** Whether fallback was used */
  usedFallback: boolean;
}

/**
 * Create a VAD instance based on configuration
 * Supports automatic fallback from Silero to RMS
 */
export async function createVAD(config?: Partial<VADFactoryConfig>): Promise<VADFactoryResult> {
  const engineSetting = config?.engine || getVADEngine();
  const rmsConfig = config?.rmsConfig || DEFAULT_VAD_CONFIG;
  const sileroConfig = config?.sileroConfig || DEFAULT_SILERO_CONFIG;

  console.log('[VADFactory] Creating VAD with engine setting:', engineSetting);

  // If explicitly requesting RMS, return it directly
  if (engineSetting === 'rms') {
    console.log('[VADFactory] Using RMS VAD (explicit)');
    return {
      vad: new VoiceActivityDetector(rmsConfig) as UnifiedVAD,
      engineType: 'rms',
      usedFallback: false
    };
  }

  // If requesting Silero or auto, try Silero first
  if (engineSetting === 'silero' || engineSetting === 'auto') {
    // Check if Silero is supported
    if (SileroVADWrapper.isSupported()) {
      try {
        console.log('[VADFactory] Attempting to create Silero VAD...');
        const sileroVAD = new SileroVADWrapper(sileroConfig);

        // For 'silero' mode, return without testing
        // For 'auto' mode, we'll let it fail at start() if there's an issue
        console.log('[VADFactory] Silero VAD created successfully');
        return {
          vad: sileroVAD as unknown as UnifiedVAD,
          engineType: 'silero',
          usedFallback: false
        };
      } catch (error) {
        console.warn('[VADFactory] Failed to create Silero VAD:', error);

        // If explicitly requesting Silero, throw the error
        if (engineSetting === 'silero') {
          throw new Error(`Silero VAD creation failed: ${error}`);
        }

        // For 'auto', fall back to RMS
        console.log('[VADFactory] Falling back to RMS VAD');
        return {
          vad: new VoiceActivityDetector(rmsConfig) as UnifiedVAD,
          engineType: 'rms',
          usedFallback: true
        };
      }
    } else {
      console.warn('[VADFactory] Silero VAD not supported in this environment');

      // If explicitly requesting Silero, throw an error
      if (engineSetting === 'silero') {
        throw new Error('Silero VAD is not supported in this environment (WebAssembly or AudioContext missing)');
      }

      // For 'auto', fall back to RMS
      console.log('[VADFactory] Falling back to RMS VAD (Silero not supported)');
      return {
        vad: new VoiceActivityDetector(rmsConfig) as UnifiedVAD,
        engineType: 'rms',
        usedFallback: true
      };
    }
  }

  // Default to RMS
  console.log('[VADFactory] Defaulting to RMS VAD');
  return {
    vad: new VoiceActivityDetector(rmsConfig) as UnifiedVAD,
    engineType: 'rms',
    usedFallback: false
  };
}

/**
 * Synchronously create an RMS VAD (no async needed)
 */
export function createRMSVAD(config?: Partial<VADConfig>): VoiceActivityDetector {
  return new VoiceActivityDetector(config || DEFAULT_VAD_CONFIG);
}

/**
 * Create a Silero VAD wrapper
 */
export function createSileroVAD(config?: Partial<SileroVADConfig>): SileroVADWrapper {
  if (!SileroVADWrapper.isSupported()) {
    throw new Error('Silero VAD is not supported in this environment');
  }
  return new SileroVADWrapper(config || DEFAULT_SILERO_CONFIG);
}

/**
 * Check which VAD engines are available in the current environment
 */
export function getAvailableEngines(): { rms: boolean; silero: boolean } {
  return {
    rms: VoiceActivityDetector.isSupported(),
    silero: SileroVADWrapper.isSupported()
  };
}

/**
 * Get the recommended VAD engine for the current environment
 */
export function getRecommendedEngine(): VADEngineType {
  const available = getAvailableEngines();

  if (available.silero) {
    return 'silero'; // Silero is more accurate when available
  }

  if (available.rms) {
    return 'rms';
  }

  return 'rms'; // Default even if not supported, will fail at start()
}

export default createVAD;
