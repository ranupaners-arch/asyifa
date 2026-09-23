// Carousels
import { prefersReducedMotion } from './constants.js';
import { IMG_BASE } from '../data/assets.js';
import { collections, trustSlides } from '../data/content.js';

let trustSlideIndex = 0;
let collectionSlideIndex = 0;
let collectionInterval;

export function updateTrustTitle(words) {
  const trustTitle = document.getElementById('trustTitle');
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

  // Reveal words
  setTimeout(() => {
    const wordSpans = trustTitle.querySelectorAll('.trust-word span');
    wordSpans.forEach((span, i) => {
      setTimeout(() => {
        span.style.transition = 'transform 700ms cubic-bezier(0.33, 1, 0.68, 1), opacity 700ms';
        span.style.transform = 'translateY(0)';
        span.style.opacity = '1';
      }, i * 50);
    });
  }, 50);
}

export function updateTrustCoach(slide) {
  const coach = document.getElementById('trustCoach');
  const img = coach.querySelector('.trust-coach-img');
  const name = coach.querySelector('.trust-coach-name');
  const role = coach.querySelector('.trust-coach-role');

  // Fade out
  img.style.transition = 'opacity 300ms';
  img.style.opacity = '0';

  setTimeout(() => {
    img.src = `${IMG_BASE}/${slide.img}`;
    img.alt = slide.alt;
    name.textContent = slide.name;
    role.textContent = slide.role;

    // Fade in
    img.style.opacity = '1';
  }, 300);
}

export function setTrustSlide(index) {
  trustSlideIndex = index;
  const slide = trustSlides[index];

  updateTrustTitle(slide.headline);
  updateTrustCoach(slide);

  // Update dots
  const dots = document.querySelectorAll('#trustDots .carousel-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

export function nextTrustSlide() {
  setTrustSlide((trustSlideIndex + 1) % trustSlides.length);
}

export function prevTrustSlide() {
  setTrustSlide((trustSlideIndex - 1 + trustSlides.length) % trustSlides.length);
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
    img.src = `${IMG_BASE}/${collections[index].img}`;
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