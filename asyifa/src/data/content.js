// Landing page copy and display data for Rumah Terapi Asy-Syifa.
import { LOGO_IMAGE, JASMINE_IMAGE } from './assets.js';
import { packageGroups, priceGroups } from './prices.js';

// Hero
export const titleWords = ['Sehat', 'Alami'];
export const taglineLines = ['Rumah Terapi Asy-Syifa Surakarta', 'Terapi holistik untuk kualitas hidup'];

// Hero service carousel
export const collections = priceGroups.map(group => ({
  img: LOGO_IMAGE,
  brand: 'Asy-Syifa',
  title: group.title,
  cta: 'Lihat layanan',
  href: `harga.html#daftar-${group.id}`,
  alt: `Logo Rumah Terapi Asy-Syifa untuk layanan ${group.title}`
}));

export const trustSummary = {
  serviceCount: String(priceGroups.length),
  serviceLabel: 'Bidang layanan',
  badgeNumber: '#01',
  badgeTitle: 'Terapi holistik untuk kesehatan',
  badgeBody: 'Bekam sunnah, akupunktur, akupresur, dan beauty care tersedia dalam pilihan layanan yang dapat dikonsultasikan.'
};

// Dummy therapist profiles; replace with approved staff details and photos.
export const trustSlides = [
  { headline: ['Terapi', 'Holistik', 'untuk', 'Kesehatan'], initials: 'JP', photo: JASMINE_IMAGE, name: 'Jasmine Puspa Medina', role: 'Terapis Akupuntur' },
  { headline: ['Pendekatan', 'Terarah', 'bagi', 'Keluarga'], initials: 'RA', name: 'Ranupane Rimba Argana', role: 'Terapis Akupunktur · Dummy' },
  { headline: ['Ruang', 'Nyaman', 'untuk', 'Perawatan'], initials: 'SR', name: 'Siti Rahma', role: 'Terapis Akupresur · Dummy' }
];

// Package category teasers; full prices will live on harga.html.
export const programLines = ['Paket Terapi', 'Asy-Syifa'];
const programDescriptions = {
  'paket-pengobatan': 'Pilihan kombinasi bekam sunnah, TMD, akupunktur, dan akupresur.',
  'paket-perawatan': 'Rangkaian terapi untuk relaksasi, kebugaran, dan perawatan diri.',
  'paket-spesialis': 'Pilihan paket untuk kebutuhan khusus, promil, beauty care, dan lainnya.',
  'paket-basic': 'Pilihan awal untuk bekam sunnah dan terapi dasar.'
};
export const programs = packageGroups.map((group, index) => ({
  index: String(index + 1).padStart(2, '0'),
  name: group.title,
  desc: programDescriptions[group.id] ?? 'Pilihan layanan Rumah Terapi Asy-Syifa.',
  href: `${group.id}.html`
}));

// Clinic introduction and service highlights
export const facilityLines = ['Rumah Terapi', 'Asy-Syifa', 'Surakarta'];
export const facilityBody = 'Bekam sunnah, akupunktur, akupresur, dan perawatan holistik dalam satu tempat. Silakan hubungi kami untuk menyesuaikan layanan dengan kebutuhan Anda.';
export const facilityCards = [
  { initials: 'BS', name: 'Bekam Sunnah', desc: 'Lihat pilihan bekam dan durasinya di daftar harga.', tone: 'clay' },
  { initials: 'AA', name: 'Akupunktur & Akupresur', desc: 'Pilihan layanan untuk kesehatan, kebugaran, dan perawatan.', tone: 'blue' }
];

// Clinic highlights. Confirm operational claims before publication.
export const statsLines = ['Mengenal', 'Asy-Syifa'];
export const stats = [
  { value: '1000+', label: 'Pasien terlayani' },
  { value: '20+', label: 'Jenis terapi' },
  { value: '10+', label: 'Paket perawatan' },
  { value: '5+', label: 'Tahun pengalaman' }
];

// No patient quotes are fabricated; replace the empty state with approved testimonials.
export const testimonialLines = ['Cerita', 'Pasien Kami'];
export const testimonials = [];

// Contact and reservation
export const footerLines = ['Mulai', 'Konsultasi'];
export const modalLines = ['Reservasi', 'Asy-Syifa'];
