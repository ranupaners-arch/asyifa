// Modal
import { stopLenis, startLenis } from './smooth-scroll.js';

export function openModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('modal');
  const panel = document.getElementById('modalPanel');

  stopLenis();

  backdrop.style.transition = 'opacity 600ms';
  backdrop.style.opacity = '1';
  backdrop.style.pointerEvents = 'auto';

  panel.style.transition = 'opacity 600ms, transform 600ms';
  panel.style.opacity = '1';
  panel.style.transform = 'translateY(0) scale(1)';

  // Reveal modal title
  setTimeout(() => {
    const modalTitleSpans = document.querySelectorAll('#modalTitle .stacked-line span');
    modalTitleSpans.forEach((span, i) => {
      setTimeout(() => {
        span.style.transition = 'transform 800ms cubic-bezier(0.33, 1, 0.68, 1), opacity 800ms';
        span.style.transform = 'translateY(0)';
        span.style.opacity = '1';
      }, i * 90);
    });
  }, 100);

  // Focus name field
  setTimeout(() => {
    document.getElementById('name').focus();
  }, 120);
}

export function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const panel = document.getElementById('modalPanel');
  const form = document.getElementById('contactForm');
  const success = document.getElementById('modalSuccess');

  panel.style.opacity = '0';
  panel.style.transform = 'translateY(1.75rem) scale(0.96)';

  setTimeout(() => {
    backdrop.style.opacity = '0';
    backdrop.style.pointerEvents = 'none';
    startLenis();

    // Reset form
    setTimeout(() => {
      form.reset();
      form.style.display = 'flex';
      success.style.display = 'none';
    }, 350);
  }, 300);
}

// Form submit
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = e.target.querySelector('.form-submit');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = 'Sending…';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.5';

  setTimeout(() => {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('modalSuccess');
    const successText = document.getElementById('successText');

    const name = document.getElementById('name').value;
    const firstName = name.split(' ')[0] || 'there';
    successText.textContent = `Thanks, ${firstName} — our team will be in touch to lock in your visit.`;

    form.style.display = 'none';
    success.style.display = 'block';

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
  }, 800);
});