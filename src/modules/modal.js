// Modal
import { stopLenis, startLenis } from './smooth-scroll.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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
  panel.style.pointerEvents = 'auto';

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
  panel.style.pointerEvents = 'none';

  setTimeout(() => {
    backdrop.style.opacity = '0';
    backdrop.style.pointerEvents = 'none';
    startLenis();

    // Reset form
    setTimeout(() => {
      form.reset();
      form.style.display = 'flex';
      success.style.display = 'none';
      document.getElementById('modalError').hidden = true;
    }, 350);
  }, 300);
}

// Form submit; attach after React has mounted the page markup.
export function setupModalForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm || contactForm.dataset.reactBound === 'true') return;
  contactForm.dataset.reactBound = 'true';
  const bookingDateInput = document.getElementById('bookingDate');
  if (bookingDateInput) bookingDateInput.min = new Date().toISOString().slice(0, 10);

  const openWhatsApp = (text) => {
    window.open(`https://wa.me/6281997039213?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  if (!form.reportValidity()) return;

  const submitBtn = e.target.querySelector('.form-submit');
  const success = document.getElementById('modalSuccess');
  const successText = document.getElementById('successText');
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const bookingDate = document.getElementById('bookingDate').value;
  const startTime = document.getElementById('startTime').value;
  const message = document.getElementById('message').value.trim();
  const error = document.getElementById('modalError');
  const text = [
    'Halo Rumah Terapi Asy-Syifa, saya ingin reservasi.',
    `Nama: ${name}`,
    `Nomor WhatsApp: ${phone}`,
    `Layanan: ${service}`,
    `Tanggal: ${bookingDate}`,
    `Jam: ${startTime}`,
    message ? `Pesan: ${message}` : ''
  ].filter(Boolean).join('\n');

  submitBtn.disabled = true;
  error.hidden = true;
  try {
    const response = await fetch(`${apiBaseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, phone, serviceName: service, bookingDate, startTime, notes: message })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Reservasi belum dapat disimpan.');
    openWhatsApp(`${text}\nNo. reservasi: ${result.reference}`);
    successText.textContent = `Reservasi ${result.reference} tersimpan. Selesaikan pengiriman konfirmasi di WhatsApp.`;
  } catch (requestError) {
    if (requestError instanceof TypeError) {
      openWhatsApp(text);
      successText.textContent = 'Server belum tersambung. Pesan reservasi sudah disiapkan di WhatsApp.';
    } else {
      error.textContent = requestError.message;
      error.hidden = false;
      submitBtn.disabled = false;
      return;
    }
  }
  form.style.display = 'none';
  success.style.display = 'block';
  submitBtn.disabled = false;
  });
}
