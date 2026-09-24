// Hover effects (disabled on mobile)
if (window.innerWidth > 768) {
  // Program row arrows
  document.addEventListener('mouseenter', (e) => {
    if (e.target instanceof Element && e.target.closest('.program-row')) {
      const arrow = e.target instanceof Element && e.target.closest('.program-row').querySelector('.program-arrow svg');
      if (arrow) {
        arrow.style.transition = 'transform 300ms, opacity 300ms';
        arrow.style.transform = 'translateX(0.5rem)';
        arrow.style.opacity = '1';
      }
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    if (e.target instanceof Element && e.target.closest('.program-row')) {
      const arrow = e.target instanceof Element && e.target.closest('.program-row').querySelector('.program-arrow svg');
      if (arrow) {
        arrow.style.transform = 'translateX(0)';
        arrow.style.opacity = '0.55';
      }
    }
  }, true);

  // Facility card scale
  document.addEventListener('mouseenter', (e) => {
    if (e.target instanceof Element && e.target.closest('.facility-card')) {
      const card = e.target instanceof Element && e.target.closest('.facility-card');
      card.style.transition = 'transform 400ms';
      card.style.transform = 'scale(1.03)';
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    if (e.target instanceof Element && e.target.closest('.facility-card')) {
      const card = e.target instanceof Element && e.target.closest('.facility-card');
      card.style.transform = 'scale(1)';
    }
  }, true);

  // Testimonial card lift
  document.addEventListener('mouseenter', (e) => {
    if (e.target instanceof Element && e.target.closest('.testimonial-card')) {
      const card = e.target instanceof Element && e.target.closest('.testimonial-card');
      card.style.transition = 'transform 400ms';
      card.style.transform = 'translateY(-0.5rem)';
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    if (e.target instanceof Element && e.target.closest('.testimonial-card')) {
      const card = e.target instanceof Element && e.target.closest('.testimonial-card');
      card.style.transform = 'translateY(0)';
    }
  }, true);

  // Pill button arrows
  document.addEventListener('mouseenter', (e) => {
    if (e.target instanceof Element && e.target.closest('.pill-btn')) {
      const arrow = e.target instanceof Element && e.target.closest('.pill-btn').querySelector('svg');
      if (arrow) {
        arrow.style.transition = 'transform 300ms';
        arrow.style.transform = 'translateX(0.3125rem)';
      }
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    if (e.target instanceof Element && e.target.closest('.pill-btn')) {
      const arrow = e.target instanceof Element && e.target.closest('.pill-btn').querySelector('svg');
      if (arrow) {
        arrow.style.transform = 'translateX(0)';
      }
    }
  }, true);

  // Arrow button scale
  document.addEventListener('mouseenter', (e) => {
    if (e.target instanceof Element && e.target.closest('.arrow-btn')) {
      const svg = e.target instanceof Element && e.target.closest('.arrow-btn').querySelector('svg');
      if (svg) {
        svg.style.transition = 'transform 300ms';
        svg.style.transform = svg.style.transform.replace('scale(1.15)', 'scale(1)');
        setTimeout(() => {
          svg.style.transform += ' scale(1.15)';
        }, 10);
      }
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    if (e.target instanceof Element && e.target.closest('.arrow-btn')) {
      const svg = e.target instanceof Element && e.target.closest('.arrow-btn').querySelector('svg');
      if (svg) {
        const baseTransform = svg.style.transform.replace(' scale(1.15)', '');
        svg.style.transform = baseTransform + ' scale(1)';
      }
    }
  }, true);

  // Modal close rotate
  const modalClose = document.querySelector('.modal-close');
  if (modalClose) {
    modalClose.addEventListener('mouseenter', () => {
      const svg = modalClose.querySelector('svg');
      svg.style.transition = 'transform 400ms';
      svg.style.transform = 'rotate(90deg)';
    });

    modalClose.addEventListener('mouseleave', () => {
      const svg = modalClose.querySelector('svg');
      svg.style.transform = 'rotate(0)';
    });
  }

  // Menu close rotate
  const menuClose = document.querySelector('.menu-close');
  if (menuClose) {
    menuClose.addEventListener('mouseenter', () => {
      const svg = menuClose.querySelector('svg');
      svg.style.transition = 'transform 400ms';
      svg.style.transform = 'rotate(90deg)';
    });

    menuClose.addEventListener('mouseleave', () => {
      const svg = menuClose.querySelector('svg');
      svg.style.transform = 'rotate(0)';
    });
  }
}