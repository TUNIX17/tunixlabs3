/**
 * Global type augmentation for Plausible Analytics.
 *
 * Plausible injects `window.plausible` when its script tag loads. Declaring
 * it as optional lets TypeScript verify every call site guards against the
 * script being absent (dev local without env var, or before the deferred
 * script finishes loading).
 *
 * The trailing `export {}` turns this file into a module so the `declare
 * global` block augments the ambient `Window` interface instead of shadowing
 * it.
 */
declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: {
        props?: Record<string, string | number | boolean>;
        callback?: () => void;
      }
    ) => void;
  }
}

export {};
