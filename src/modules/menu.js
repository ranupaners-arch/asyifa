// Menu
import { stopLenis, startLenis } from './smooth-scroll.js';
import { closeModal } from './modal.js';

export function openMenu() {
  const backdrop = document.getElementById('menuBackdrop');
  const overlay = document.getElementById('menuOverlay');
  const panel = document.getElementById('menuPanel');
  const links = document.querySelectorAll('#menuNav a');

  stopLenis();

  backdrop.style.transition = 'opacity 600ms';
  backdrop.style.opacity = '1';
  backdrop.style.pointerEvents = 'auto';

  panel.style.transition = 'opacity 600ms, transform 600ms';
  panel.style.opacity = '1';
  panel.style.transform = 'translateY(0)';
  panel.style.pointerEvents = 'auto';

  // Animate links
  links.forEach((link, i) => {
    setTimeout(() => {
      link.style.transition = 'opacity 600ms, transform 600ms';
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    }, 120 + i * 70);
  });
}

export function closeMenu() {
  const backdrop = document.getElementById('menuBackdrop');
  const panel = document.getElementById('menuPanel');
  const links = document.querySelectorAll('#menuNav a');

  links.forEach(link => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(1.75rem)';
  });

  panel.style.opacity = '0';
  panel.style.transform = 'translateY(-1.5rem)';
  panel.style.pointerEvents = 'none';

  setTimeout(() => {
    backdrop.style.opacity = '0';
    backdrop.style.pointerEvents = 'none';
    startLenis();
  }, 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('modal');
    const menuOverlay = document.getElementById('menuOverlay');

    if (modal.style.pointerEvents !== 'none' && modal.style.display !== 'none') {
      closeModal();
    }

    if (menuOverlay.style.pointerEvents !== 'none' && menuOverlay.style.display !== 'none') {
      closeMenu();
    }
  }
});