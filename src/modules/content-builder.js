// Build dynamic content
import {
  titleWords,
  taglineLines,
  collections,
  trustSlides,
  programLines,
  programs,
  facilityLines,
  facilityBody,
  facilityCards,
  statsLines,
  stats,
  testimonialLines,
  testimonials,
  footerLines,
  modalLines
} from '../data/content.js';
import { IMG_BASE } from '../data/assets.js';
import { updateTrustTitle, setupCollectionAutoplay } from './carousels.js';
import { setupInviewObservers } from './observers.js';
import { getIsReady } from './loader.js';

export function buildContent() {
  // Hero title
  const heroTitle = document.getElementById('heroTitle');
  heroTitle.innerHTML = titleWords.map(word =>
    `<span class="hero-word"><span>${word}</span></span>`
  ).join(' ');

  // Hero tagline
  const heroTagline = document.getElementById('heroTagline');
  heroTagline.innerHTML = taglineLines.map(line =>
    `<span class="tagline-line"><span>${line}</span></span>`
  ).join('');

  // Collection slider
  const slider = document.getElementById('collectionSlider');
  slider.innerHTML = `
    <div class="collection-card" id="collectionCard">
      <img class="collection-card-img" src="${IMG_BASE}/${collections[0].img}" alt="${collections[0].alt}">
      <div class="collection-card-content">
        <div class="collection-card-brand">${collections[0].brand}</div>
        <div class="collection-card-title">${collections[0].title}</div>
        <a href="#" class="collection-card-cta">${collections[0].cta} →</a>
      </div>
    </div>
    <div class="carousel-dots light" id="collectionDots"></div>
  `;

  const dots = document.getElementById('collectionDots');
  dots.innerHTML = collections.map((_, i) =>
    `<button class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="setCollectionSlide(${i})"><div class="carousel-dot-pill"></div></button>`
  ).join('');

  // Trust title
  updateTrustTitle(trustSlides[0].headline);

  // Trust dots
  const trustDots = document.getElementById('trustDots');
  trustDots.innerHTML = trustSlides.map((_, i) =>
    `<button class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="setTrustSlide(${i})"><div class="carousel-dot-pill"></div></button>`
  ).join('');

  // Programs title
  const programsTitle = document.getElementById('programsTitle');
  programsTitle.innerHTML = programLines.map(line =>
    `<span class="stacked-line"><span>${line}</span></span>`
  ).join('');

  // Programs list
  const programsList = document.getElementById('programsList');
  programsList.innerHTML = programs.map((p, i) => `
    <li>
      <a href="${p.href}" class="program-row" data-inview data-delay="${i * 90}">
        <div class="program-index">${p.index}</div>
        <div class="program-content">
          <div class="program-name">${p.name}</div>
          <div class="program-desc">${p.desc}</div>
        </div>
        <div class="program-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </div>
      </a>
    </li>
  `).join('');

  // Facilities title
  const facilitiesTitle = document.getElementById('facilitiesTitle');
  facilitiesTitle.innerHTML = facilityLines.map(line =>
    `<span class="stacked-line"><span>${line}</span></span>`
  ).join('');

  // Facilities body
  const facilitiesBody = document.getElementById('facilitiesBody');
  const facilityWords = facilityBody.split(' ');
  facilitiesBody.innerHTML = facilityWords.map(word =>
    `<span class="facilities-body-word">${word}</span>`
  ).join(' ');

  // Facilities cards
  const facilitiesCardsEl = document.getElementById('facilitiesCards');
  facilitiesCardsEl.innerHTML = facilityCards.map((card, i) => `
    <figure class="facility-card" data-inview data-delay="${i * 140}">
      <img src="${IMG_BASE}/${card.img}" alt="${card.alt}" loading="lazy">
      <figcaption class="facility-caption ${card.tone}">
        <div class="facility-name">${card.name}</div>
        <div class="facility-desc">${card.desc}</div>
      </figcaption>
    </figure>
  `).join('');

  // Stats title
  const statsTitle = document.getElementById('statsTitle');
  statsTitle.innerHTML = statsLines.map(line =>
    `<span class="stacked-line"><span>${line}</span></span>`
  ).join('');

  // Stats grid
  const statsGrid = document.getElementById('statsGrid');
  statsGrid.innerHTML = stats.map((stat, i) => `
    <div class="stat-cell" data-inview data-delay="${i * 110}">
      <dt class="sr-only">${stat.label}</dt>
      <dd>
        <div class="stat-value">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      </dd>
    </div>
  `).join('');

  // Testimonials title
  const testimonialsTitle = document.getElementById('testimonialsTitle');
  testimonialsTitle.innerHTML = testimonialLines.map(line =>
    `<span class="stacked-line"><span>${line}</span></span>`
  ).join('');

  // Testimonials grid
  const testimonialsGrid = document.getElementById('testimonialsGrid');
  testimonialsGrid.innerHTML = testimonials.map((t, i) => `
    <li>
      <article class="testimonial-card" data-inview data-delay="${i * 120}">
        <div>
          <div class="testimonial-quote">"</div>
          <blockquote class="testimonial-text">${t.quote}</blockquote>
        </div>
        <figcaption class="testimonial-footer">
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </figcaption>
      </article>
    </li>
  `).join('');

  // Footer CTA title
  const footerCtaTitle = document.getElementById('footerCtaTitle');
  footerCtaTitle.innerHTML = footerLines.map(line =>
    `<span class="stacked-line"><span>${line}</span></span>`
  ).join('');

  // Modal title
  const modalTitle = document.getElementById('modalTitle');
  modalTitle.innerHTML = modalLines.map(line =>
    `<span class="stacked-line"><span>${line}</span></span>`
  ).join('');

  // Setup inview observers
  setupInviewObservers();

  // Setup collection autoplay
  if (getIsReady()) {
    setupCollectionAutoplay();
  }
}