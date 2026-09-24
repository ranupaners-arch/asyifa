// Home-page effects are initialized only after React has mounted the preserved page markup.
import './modules/font-scale.js';
import { initLenis, stopLenis } from './modules/smooth-scroll.js';
import { startLoader } from './modules/loader.js';
import { buildContent } from './modules/content-builder.js';
import { setupFacilitiesBodyReveal, setupStackedLineReveals } from './modules/observers.js';
import { setupParallax } from './modules/parallax.js';
import { setupModalForm } from './modules/modal.js';
import './modules/modal.js';
import './modules/menu.js';
import './modules/hover-effects.js';
import './modules/globals.js';

let initialized = false;

export function initializeHome() {
  if (initialized) return;
  initialized = true;

  const targetId = window.location.hash.slice(1);
  if (!targetId) window.scrollTo(0, 0);
  initLenis();
  stopLenis();
  startLoader(() => {
    const target = targetId && document.getElementById(targetId);
    target?.scrollIntoView({ block: 'start' });
  });
  buildContent();
  setupModalForm();
  setupParallax();

  setTimeout(() => {
    setupFacilitiesBodyReveal();
    setupStackedLineReveals();
  }, 100);
}
