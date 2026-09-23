// Lenis smooth scroll
import Lenis from 'lenis';

let lenis;

export function initLenis() {
  lenis = new Lenis({ smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

export function stopLenis() {
  if (lenis) {
    lenis.stop();
    document.body.classList.add('scroll-locked');
  }
}

export function startLenis() {
  if (lenis) {
    lenis.start();
    document.body.classList.remove('scroll-locked');
  }
}