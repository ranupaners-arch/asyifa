// Easings (present in original module; some are reserved/unused)
export const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
export const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
export const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Spring helper
export function spring(value, target, velocity, tension, friction, dt) {
  const acceleration = -tension * (value - target) - friction * velocity;
  velocity += acceleration * dt;
  value += velocity * dt;
  return { value, velocity };
}