// Build dynamic content
import {
  titleWords,
  taglineLines,
  trustSummary,
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

  const trustPercentValue = document.querySelector('#trustPercent .trust-percent-value');
  const trustPercentCaption = document.querySelector('#trustPercent .trust-percent-caption');
  const trustBadgeChip = document.querySelector('#trustBadge .trust-badge-chip');
  const trustBadgeTitle = document.querySelector('#trustBadge h3');
  const trustBadgeBody = document.querySelector('#trustBadge p');
  if (trustPercentValue) trustPercentValue.textContent = trustSummary.serviceCount;
  if (trustPercentCaption) trustPercentCaption.textContent = trustSummary.serviceLabel;
  if (trustBadgeChip) trustBadgeChip.textContent = trustSummary.badgeNumber;
  if (trustBadgeTitle) trustBadgeTitle.textContent = trustSummary.badgeTitle;
  if (trustBadgeBody) trustBadgeBody.textContent = trustSummary.badgeBody;

  // Collection slider
  const slider = document.getElementById('collectionSlider');
  slider.innerHTML = `
    <div class="collection-card" id="collectionCard">
      <img class="collection-card-img" src="${collections[0].img}" alt="${collections[0].alt}">
      <div class="collection-card-content">
        <div class="collection-card-brand">${collections[0].brand}</div>
        <div class="collection-card-title">${collections[0].title}</div>
      <a href="${collections[0].href}" class="collection-card-cta">${collections[0].cta} →</a>
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
  const initialPortrait = document.querySelector('#trustCoach .trust-coach-img');
  if (initialPortrait && trustSlides[0].photo) {
    initialPortrait.style.backgroundImage = `url("${trustSlides[0].photo}")`;
    initialPortrait.style.backgroundSize = 'cover';
    initialPortrait.style.backgroundPosition = 'center';
    initialPortrait.textContent = '';
  }

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
      <div class="facility-card-visual ${card.tone}" aria-hidden="true">${card.initials}</div>
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

  const membershipValue = document.getElementById('membershipValue');
  const therapyStat = stats.find(stat => stat.label === 'Jenis terapi');
  if (membershipValue && therapyStat) membershipValue.textContent = therapyStat.value;

  // Testimonials title
  const testimonialsTitle = document.getElementById('testimonialsTitle');
  testimonialsTitle.innerHTML = testimonialLines.map(line =>
    `<span class="stacked-line"><span>${line}</span></span>`
  ).join('');

  // Testimonials grid
  const testimonialsGrid = document.getElementById('testimonialsGrid');
  testimonialsGrid.innerHTML = testimonials.length ? testimonials.map((t, i) => `
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
  `).join('') : `
    <li class="testimonial-empty">
      <article class="testimonial-card">
        <div class="testimonial-quote" aria-hidden="true">“</div>
        <p class="testimonial-text">Ulasan pasien akan ditampilkan setelah mendapat persetujuan untuk dipublikasikan.</p>
        <div class="testimonial-footer">
          <div class="testimonial-name">Cerita pasien</div>
          <div class="testimonial-role">Menunggu testimoni terverifikasi</div>
        </div>
      </article>
    </li>
  `;

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
