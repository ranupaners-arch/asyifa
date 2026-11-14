// Adaptive rem scaling — runs on import, same as original module eval
import { FONT_BASE, BASE_W, COEF } from './constants.js';

export function updateFontSize() {
  const reduction = ((BASE_W - window.innerWidth) / BASE_W) * 100 * COEF;
  const size = FONT_BASE - (FONT_BASE * reduction) / 100;
  if (size > FONT_BASE) {
    document.documentElement.style.fontSize = size + 'px';
  } else {
    document.documentElement.style.removeProperty('font-size');
  }
}

updateFontSize();
window.addEventListener('resize', updateFontSize);