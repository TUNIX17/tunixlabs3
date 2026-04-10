// Magic numbers for Kinetic Swiss v2 — these are NOT to be tweaked casually.
// They are the result of multiple iterations with visual feedback.
// If you want to change any, do it here (one place) and verify visually.

export const TIMING = {
  // Typing engine
  CHAR_DELAY_MS: 32,
  BACKSPACE_DELAY_MS: 14,
  ENTER_PAUSE_MS: 180,

  // Content reveal (initial delay before lines appear)
  REVEAL_DELAY_MS: 100,

  // Content reveal stagger (line-by-line)
  LINE_STAGGER_MS: 90,
  LINE_RISE_MS: 450,

  // Terminal morph transitions (width/height/transform)
  TERMINAL_TRANSITION_MS: 900,
  TERMINAL_EASING: 'cubic-bezier(0.2, 0.9, 0.25, 1)' as const,

  // Background crossfade
  BG_CROSSFADE_MS: 1200,

  // Hero entrance
  HERO_LINE_STAGGER_MS: 100,
  HERO_RISE_MS: 1100,
  HERO_ENTRANCE_DELAY_MS: 900,

  // Cursor parallax (mouse-following)
  PARALLAX_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)' as const,
  PARALLAX_DURATION_MS: 900,
  PARALLAX_MAX_X_PX: 12,
  PARALLAX_MAX_Y_PX: 8,

  // Cursor blink (terminal prompt cursor)
  CURSOR_BLINK_MS: 1000,

  // Preloader
  PRELOAD_PULSE_MS: 900,
  PRELOAD_DISMISS_DELAY_MS: 400,
  PRELOAD_FADE_OUT_MS: 500,

  // Scroll progress throttle
  SCROLL_RAF_THROTTLE: true,
} as const;

export type TimingKey = keyof typeof TIMING;
