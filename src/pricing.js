import { packageGroups, priceGroups } from './data/prices.js';

const money = value => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
}).format(value);

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character]);

function renderGroups(target, groups, prefix) {
  target.innerHTML = groups.map((group, groupIndex) => `
    <details class="price-category" id="${prefix ? `${prefix}-` : ''}${group.id}" ${groupIndex === 0 ? 'open' : ''}>
      <summary>
        <span>${escapeHtml(group.title)}</span>
        <span class="price-category-count">${group.items.length} pilihan</span>
      </summary>
      <div class="price-rows">
        ${group.items.map(item => `
          <div class="price-row">
            <span class="price-row-name">${escapeHtml(item.name)}</span>
            ${item.duration ? `<span class="price-row-duration">${escapeHtml(item.duration)}</span>` : ''}
            <span class="price-row-value">${item.pricePrefix ? `${escapeHtml(item.pricePrefix)} ` : ''}${money(item.price)}</span>
          </div>
        `).join('')}
      </div>
    </details>
  `).join('');
}

export function initializePricingPage() {
  const packageTarget = document.getElementById('package-groups');
  const serviceTarget = document.getElementById('service-groups');
  if (packageTarget) renderGroups(packageTarget, packageGroups, '');
  if (serviceTarget) renderGroups(serviceTarget, priceGroups, 'daftar');
}
