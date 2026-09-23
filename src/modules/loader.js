// Loader + shared "ready" flag
import { MIN_VISIBLE_MS, EXIT_MS, prefersReducedMotion } from './constants.js';
import { startLenis } from './smooth-scroll.js';
import { triggerHeroReveals } from './observers.js';

let isReady = false;

export function getIsReady() {
  return isReady;
}

export function startLoader() {
  const loader = document.getElementById('loader');
  const wordmark = document.getElementById('loaderWordmark');
  const fill = document.getElementById('loaderFill');

  // Animate wordmark
  setTimeout(() => {
    wordmark.style.transition = 'opacity 600ms, transform 600ms';
    wordmark.style.opacity = '1';
    wordmark.style.transform = 'translateY(0)';
  }, 100);

  // Animate progress fill
  setTimeout(() => {
    const duration = prefersReducedMotion ? 200 : MIN_VISIBLE_MS - 120;
    fill.style.transition = `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
    fill.style.transform = 'scaleX(1)';
  }, 120);

  // Complete loader
  const visibleTime = prefersReducedMotion ? 200 : MIN_VISIBLE_MS;
  setTimeout(() => {
    isReady = true;
    startLenis();
    loader.classList.add('exiting');
    setTimeout(() => {
      loader.remove();
      triggerHeroReveals();
    }, EXIT_MS);
  }, visibleTime);
}