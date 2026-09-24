import { setupInviewObservers } from './observers.js';

const revealSelectors = [
  '.price-header',
  '.price-intro',
  '.price-jump-links',
  '.price-category',
  '.service-detail-intro',
  '.service-items-section',
  '.service-item',
  '.product-intro',
  '.product-section-heading',
  '.product-card',
  'footer#contact'
];

export function initializePageEffects() {
  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.inview = '';
      element.dataset.delay = String(Math.min(index * 70, 280));
    });
  });

  setupInviewObservers();
}
