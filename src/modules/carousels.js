// Carousels
import { prefersReducedMotion } from './constants.js';
import { collections, trustSlides } from '../data/content.js';

let trustSlideIndex = 0;
let trustCoachTimeout;
let captionTimeout;
let trustTitleTimeout;
let collectionSlideIndex = 0;
let collectionInterval;

export function updateTrustTitle(words, direction = 0) {
  const trustTitle = document.getElementById('trustTitle');
  clearTimeout(trustTitleTimeout);

  const renderTitle = () => {
    const rows = [
      [words[0], words[1]],
      [words[2], words[3]]
    ];

    trustTitle.innerHTML = rows.map((row, rowIdx) => {
      return `<div class="trust-title-row">
        ${row.map((word, i) => {
          const isThird = rowIdx === 1 && i === 0;
          const cls = isThird ? 'ink' : 'ghost';
          return `<span class="trust-word ${cls}"><span>${word}</span></span>`;
        }).join('')}
      </div>`;
    }).join('');

    if (direction) {
      trustTitle.style.transition = 'none';
      trustTitle.style.opacity = '0';
      trustTitle.style.transform = `translateX(${direction * 1.5}rem)`;
      trustTitle.offsetHeight;
      trustTitle.style.transition = 'opacity 420ms ease, transform 620ms cubic-bezier(0.22, 1, 0.36, 1)';
      trustTitle.style.opacity = '1';
      trustTitle.style.transform = 'translateX(0)';
    }

    // Reveal each word with a short upward stagger as the new slide enters.
    trustTitleTimeout = setTimeout(() => {
      const wordSpans = trustTitle.querySelectorAll('.trust-word span');
      wordSpans.forEach((span, i) => {
        setTimeout(() => {
        span.style.transition = 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms ease';
        span.style.transform = 'translateY(0)';
          span.style.opacity = '1';
        }, i * 80);
      });
    }, 50);
  };

  if (direction && trustTitle.hasChildNodes()) {
    trustTitle.style.transition = 'opacity 180ms ease, transform 220ms ease';
    trustTitle.style.opacity = '0';
    trustTitle.style.transform = `translateX(${-direction * 1.25}rem)`;
    trustTitleTimeout = setTimeout(renderTitle, 190);
  } else {
    renderTitle();
  }
}

export function updateTrustCoach(slide, direction = 1) {
  const coach = document.getElementById('trustCoach');
  const portrait = coach.querySelector('.trust-coach-img');
  const name = coach.querySelector('.trust-coach-name');
  const role = coach.querySelector('.trust-coach-role');

  const OUT_MS = 420;
  const IN_MS = 650;
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // Fade out + slide opposite to travel direction
  clearTimeout(trustCoachTimeout);
  clearTimeout(captionTimeout);
  portrait.style.transition = `opacity ${OUT_MS}ms ease, transform ${OUT_MS}ms ${EASE}`;
  portrait.style.opacity = '0';
  portrait.style.transform = `translateX(${-direction * 0.6}rem) rotate(${-direction * 3}deg)`;

  trustCoachTimeout = setTimeout(() => {
    portrait.textContent = slide.initials;
    portrait.setAttribute('aria-label', `${slide.name}, ${slide.role}`);
    name.textContent = slide.name;
    role.textContent = slide.role;

    // Fade in from the travel side
    portrait.style.transition = 'none';
    portrait.style.transform = `translateX(${direction * 0.6}rem) rotate(${direction * 3}deg)`;
    portrait.offsetHeight; // force reflow so the new position applies
    portrait.style.transition = `opacity ${IN_MS}ms ease, transform ${IN_MS}ms ${EASE}`;
    portrait.style.opacity = '1';
    portrait.style.transform = 'translateX(0) rotate(0deg)';
  }, OUT_MS);

  // Caption follows with a slight delay
  const caption = coach.querySelector('.trust-coach-caption');
  caption.style.transition = `opacity 320ms ease, transform 320ms ${EASE}`;
  caption.style.opacity = '0';
  caption.style.transform = `translateX(${-direction * 0.4}rem)`;

  captionTimeout = setTimeout(() => {
    caption.style.transition = 'none';
    caption.style.transform = `translateX(${direction * 0.4}rem)`;
    caption.offsetHeight;
    caption.style.transition = `opacity 480ms ease, transform 480ms ${EASE}`;
    caption.style.opacity = '1';
    caption.style.transform = 'translateX(0)';
  }, 260);
}

export function setTrustSlide(index, direction = 1) {
  index = (index + trustSlides.length) % trustSlides.length;
  trustSlideIndex = index;
  const slide = trustSlides[index];

  updateTrustTitle(slide.headline, direction);
  updateTrustCoach(slide, direction);

}

export function nextTrustSlide() {
  setTrustSlide(trustSlideIndex + 1, 1);
}

export function prevTrustSlide() {
  setTrustSlide(trustSlideIndex - 1, -1);
}

export function updateCollectionSlide(index) {
  const card = document.getElementById('collectionCard');
  const img = card.querySelector('.collection-card-img');
  const brand = card.querySelector('.collection-card-brand');
  const title = card.querySelector('.collection-card-title');
  const cta = card.querySelector('.collection-card-cta');

  // Fade out
  card.style.transition = 'opacity 300ms, transform 300ms';
  card.style.opacity = '0';
  card.style.transform = 'translateY(1rem) scale(0.96)';

  setTimeout(() => {
    img.src = collections[index].img;
    img.alt = collections[index].alt;
    brand.textContent = collections[index].brand;
    title.textContent = collections[index].title;
    cta.textContent = `${collections[index].cta} →`;

    // Fade in
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
  }, 300);

  // Update dots
  const dots = document.querySelectorAll('#collectionDots .carousel-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

export function setCollectionSlide(index) {
  collectionSlideIndex = index;
  updateCollectionSlide(index);
}

export function nextCollectionSlide() {
  setCollectionSlide((collectionSlideIndex + 1) % collections.length);
}

export function setupCollectionAutoplay() {
  if (prefersReducedMotion) return;

  collectionInterval = setInterval(() => {
    nextCollectionSlide();
  }, 3800);
}
