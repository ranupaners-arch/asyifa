// Inview observers + reveal triggers
import { setupCollectionAutoplay } from './carousels.js';

export function triggerHeroReveals() {
  // Hero title
  const heroWords = document.querySelectorAll('.hero-word span');
  heroWords.forEach((word, i) => {
    setTimeout(() => {
      word.style.transition = 'transform 1100ms cubic-bezier(0.33, 1, 0.68, 1), opacity 1100ms';
      word.style.transform = 'translateY(0)';
      word.style.opacity = '1';
    }, i * 140);
  });

  // Hero tagline
  setTimeout(() => {
    const taglineLines = document.querySelectorAll('.tagline-line span');
    taglineLines.forEach((line, i) => {
      setTimeout(() => {
        line.style.transition = 'transform 900ms cubic-bezier(0.33, 1, 0.68, 1), opacity 900ms';
        line.style.transform = 'translateY(0)';
        line.style.opacity = '1';
      }, i * 110);
    });
  }, 350);

  // Collection slider
  setTimeout(() => {
    const slider = document.getElementById('collectionSlider');
    slider.style.transition = 'opacity 600ms, transform 600ms';
    slider.style.opacity = '1';
    slider.style.transform = 'translateY(0)';
    setupCollectionAutoplay();
  }, 650);

  // Membership card
  setTimeout(() => {
    const card = document.getElementById('membershipCard');
    card.style.transition = 'opacity 600ms, transform 600ms';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 780);
}

export function setupInviewObservers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay) || 0;

        setTimeout(() => {
          el.style.transition = 'opacity 600ms, transform 600ms';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        }, delay);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-inview]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(1.75rem)';
    observer.observe(el);
  });

  // Trust percent badge
  const trustPercent = document.getElementById('trustPercent');
  if (trustPercent) {
    const trustObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            trustPercent.style.transition = 'opacity 600ms, transform 600ms';
            trustPercent.style.opacity = '1';
            trustPercent.style.transform = 'scale(1)';
          }, 0);
          trustObserver.unobserve(trustPercent);
        }
      });
    }, { threshold: 0.1 });

    trustPercent.style.opacity = '0';
    trustPercent.style.transform = 'scale(0.9)';
    trustObserver.observe(trustPercent);
  }

  // Trust badge
  const trustBadge = document.getElementById('trustBadge');
  if (trustBadge) {
    const badgeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            trustBadge.style.transition = 'opacity 600ms, transform 600ms';
            trustBadge.style.opacity = '1';
            trustBadge.style.transform = 'translateY(0)';
          }, 120);
          badgeObserver.unobserve(trustBadge);
        }
      });
    }, { threshold: 0.1 });

    trustBadge.style.opacity = '0';
    trustBadge.style.transform = 'translateY(1.5rem)';
    badgeObserver.observe(trustBadge);
  }

  // Trust coach
  const trustCoach = document.getElementById('trustCoach');
  if (trustCoach) {
    const coachObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            trustCoach.style.transition = 'opacity 600ms, transform 600ms';
            trustCoach.style.opacity = '1';
            trustCoach.style.transform = 'translate(-50%, -50%) rotate(6deg) scale(1)';
          }, 0);
          coachObserver.unobserve(trustCoach);
        }
      });
    }, { threshold: 0.1 });

    trustCoach.style.opacity = '0';
    trustCoach.style.transform = 'translate(-50%, -50%) rotate(6deg) scale(0.92)';
    coachObserver.observe(trustCoach);
  }

  // Footer CTA button
  const footerCtaBtn = document.querySelector('.footer-cta .pill-btn');
  if (footerCtaBtn) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            footerCtaBtn.style.transition = 'opacity 600ms, transform 600ms';
            footerCtaBtn.style.opacity = '1';
            footerCtaBtn.style.transform = 'translateY(0)';
          }, 150);
          ctaObserver.unobserve(footerCtaBtn);
        }
      });
    }, { threshold: 0.1 });

    footerCtaBtn.style.opacity = '0';
    footerCtaBtn.style.transform = 'translateY(1.25rem)';
    ctaObserver.observe(footerCtaBtn);
  }
}

export function setupFacilitiesBodyReveal() {
  const facilitiesBody = document.getElementById('facilitiesBody');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const words = facilitiesBody.querySelectorAll('.facilities-body-word');
          words.forEach((word, i) => {
            setTimeout(() => {
              word.style.transition = 'transform 700ms cubic-bezier(0.33, 1, 0.68, 1), opacity 700ms';
              word.style.transform = 'translateY(0)';
              word.style.opacity = '1';
            }, 250 + i * 28);
          });
        }, 0);
        observer.unobserve(facilitiesBody);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(facilitiesBody);
}

export function setupStackedLineReveals() {
  const observers = [
    { selector: '#programsTitle .stacked-line span', stagger: 120, duration: 950 },
    { selector: '#facilitiesTitle .stacked-line span', stagger: 120, duration: 950 },
    { selector: '#statsTitle .stacked-line span', stagger: 120, duration: 950 },
    { selector: '#testimonialsTitle .stacked-line span', stagger: 120, duration: 950 },
    { selector: '.footer-cta-title .stacked-line span', stagger: 120, duration: 950 }
  ];

  observers.forEach(({ selector, stagger, duration }) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          const spans = parent.querySelectorAll('span');
          spans.forEach((span, i) => {
            setTimeout(() => {
              span.style.transition = `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1), opacity ${duration}ms`;
              span.style.transform = 'translateY(0)';
              span.style.opacity = '1';
            }, i * stagger);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(elements[0].parentElement);
  });
}