// App bootstrap — orchestrates init in the same order as the original inline script.
import './modules/font-scale.js';
import { initLenis, stopLenis } from './modules/smooth-scroll.js';
import { startLoader } from './modules/loader.js';
import { buildContent } from './modules/content-builder.js';
import { setupFacilitiesBodyReveal, setupStackedLineReveals } from './modules/observers.js';
import { setupParallax } from './modules/parallax.js';
import './modules/modal.js';
import './modules/menu.js';
import './modules/hover-effects.js';
import './modules/globals.js';

// Init on load
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  initLenis();
  stopLenis();
  startLoader();
  buildContent();
});

setupParallax();

// Wait for content to be built
setTimeout(() => {
  setupFacilitiesBodyReveal();
  setupStackedLineReveals();
}, 100);