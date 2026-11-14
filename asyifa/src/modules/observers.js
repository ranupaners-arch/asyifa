// Inview observers + reveal triggers
import { setupCollectionAutoplay } from './carousels.js';

function observeRepeat(target, { threshold = 0.1, delay = 0, show, hide }) {
  if (!target) return;

  let timer;
  hide(false);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      clearTimeout(timer);

      if (entry.isIntersecting) {
        timer = setTimeout(show, delay);
      } else {
        hide(true);
      }
    });
  }, { threshold });

  observer.observe(target);
}

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
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const el = entry.target;
      clearTimeout(el.__revealTimer);

      if (entry.isIntersecting) {
        const delay = parseInt(el.dataset.delay) || 0;
        el.__revealTimer = setTimeout(() => {
          el.style.transition = 'opacity 600ms, transform 600ms';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        }, delay);
      } else {
        el.style.transition = 'opacity 600ms, transform 600ms';
        el.style.opacity = '0';
        el.style.transform = 'translateY(1.75rem)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-inview]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(1.75rem)';
    observer.observe(el);
  });

  const trustPercent = document.getElementById('trustPercent');
  observeRepeat(trustPercent, {
    show: () => {
      trustPercent.style.transition = 'opacity 600ms, transform 600ms';
      trustPercent.style.opacity = '1';
      trustPercent.style.transform = 'scale(1)';
    },
    hide: animate => {
      trustPercent.style.transition = animate ? 'opacity 600ms, transform 600ms' : '';
      trustPercent.style.opacity = '0';
      trustPercent.style.transform = 'scale(0.9)';
    }
  });

  const trustBadge = document.getElementById('trustBadge');
  observeRepeat(trustBadge, {
    delay: 120,
    show: () => {
      trustBadge.style.transition = 'opacity 600ms, transform 600ms';
      trustBadge.style.opacity = '1';
      trustBadge.style.transform = 'translateY(0)';
    },
    hide: animate => {
      trustBadge.style.transition = animate ? 'opacity 600ms, transform 600ms' : '';
      trustBadge.style.opacity = '0';
      trustBadge.style.transform = 'translateY(1.5rem)';
    }
  });

  const trustCoach = document.getElementById('trustCoach');
  observeRepeat(trustCoach, {
    show: () => {
      trustCoach.style.transition = 'opacity 600ms, transform 600ms';
      trustCoach.style.opacity = '1';
      trustCoach.style.transform = 'translate(-50%, -50%) rotate(6deg) scale(1)';
    },
    hide: animate => {
      trustCoach.style.transition = animate ? 'opacity 600ms, transform 600ms' : '';
      trustCoach.style.opacity = '0';
      trustCoach.style.transform = 'translate(-50%, -50%) rotate(6deg) scale(0.92)';
    }
  });

  const footerCtaBtn = document.querySelector('.footer-cta .pill-btn');
  observeRepeat(footerCtaBtn, {
    delay: 150,
    show: () => {
      footerCtaBtn.style.transition = 'opacity 600ms, transform 600ms';
      footerCtaBtn.style.opacity = '1';
      footerCtaBtn.style.transform = 'translateY(0)';
    },
    hide: animate => {
      footerCtaBtn.style.transition = animate ? 'opacity 600ms, transform 600ms' : '';
      footerCtaBtn.style.opacity = '0';
      footerCtaBtn.style.transform = 'translateY(1.25rem)';
    }
  });
}

export function setupFacilitiesBodyReveal() {
  const facilitiesBody = document.getElementById('facilitiesBody');
  if (!facilitiesBody) return;

  const words = [...facilitiesBody.querySelectorAll('.facilities-body-word')];
  let timers = [];
  const resetTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };
  const hideWords = animate => words.forEach(word => {
    word.style.transition = animate
      ? 'transform 700ms cubic-bezier(0.33, 1, 0.68, 1), opacity 700ms'
      : '';
    word.style.transform = 'translateY(1.125rem)';
    word.style.opacity = '0';
  });

  hideWords(false);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      resetTimers();
      if (entry.isIntersecting) {
        words.forEach((word, i) => {
          timers.push(setTimeout(() => {
            word.style.transition = 'transform 700ms cubic-bezier(0.33, 1, 0.68, 1), opacity 700ms';
            word.style.transform = 'translateY(0)';
            word.style.opacity = '1';
          }, 250 + i * 28));
        });
      } else {
        hideWords(true);
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

    const title = elements[0].parentElement.parentElement;
    const spans = [...title.querySelectorAll('.stacked-line span')];
    let timers = [];
    const resetTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };
    const hideSpans = animate => spans.forEach(span => {
      span.style.transition = animate
        ? `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1), opacity ${duration}ms`
        : '';
      span.style.transform = 'translateY(115%)';
      span.style.opacity = '0';
    });

    hideSpans(false);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        resetTimers();
        if (entry.isIntersecting) {
          spans.forEach((span, i) => {
            timers.push(setTimeout(() => {
              span.style.transition = `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1), opacity ${duration}ms`;
              span.style.transform = 'translateY(0)';
              span.style.opacity = '1';
            }, i * stagger));
          });
        } else {
          hideSpans(true);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(elements[0].parentElement);
  });
}
