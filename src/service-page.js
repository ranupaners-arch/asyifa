import { packageGroups } from './data/prices.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character]);

const money = value => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
}).format(value);

export function initializeServicePage() {
  const id = document.body.dataset.package;
  const group = packageGroups.find(item => item.id === id);
  if (!group) {
    window.location.replace('index.html#programs');
    return;
  }

  document.title = `${group.title} — Rumah Terapi Asy-Syifa`;
  document.querySelector('meta[name="description"]').content = group.description;
  document.getElementById('service-title').textContent = group.title;
  document.getElementById('service-description').textContent = group.description;
  document.getElementById('service-items').innerHTML = group.items.map(item => `
    <article class="service-item">
      <div class="service-item-main">
        <h2>${escapeHtml(item.name)}</h2>
        ${item.duration ? `<p>Durasi ${escapeHtml(item.duration)}</p>` : ''}
      </div>
      <div class="service-item-price">
        ${item.pricePrefix ? `<span>${escapeHtml(item.pricePrefix)}</span>` : ''}
        <strong>${money(item.price)}</strong>
      </div>
    </article>
  `).join('');

  const message = encodeURIComponent(`Halo Rumah Terapi Asy-Syifa, saya ingin bertanya tentang ${group.title}.`);
  document.getElementById('service-booking').href = `https://wa.me/6281997039213?text=${message}`;
}
