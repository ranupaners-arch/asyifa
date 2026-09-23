// Adaptive rem scaling constants
export const FONT_BASE = 16;
export const BASE_W = 1920;
export const COEF = 0.6666;

// Loader timings
export const MIN_VISIBLE_MS = 1400;
export const MAX_VISIBLE_MS = 2600;
export const EXIT_MS = 850;

// Motion preference
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;