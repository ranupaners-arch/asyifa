// Landing page copy and display data for Rumah Terapi Asy-Syifa.
import { LOGO_IMAGE } from './assets.js';

// Hero
export const titleWords = ['Sehat', 'Alami'];
export const taglineLines = ['Rumah Terapi Asy-Syifa Surakarta', 'Terapi holistik untuk kualitas hidup'];

// Hero service carousel
export const collections = [
  { img: LOGO_IMAGE, brand: 'Asy-Syifa', title: 'Bekam & Akupunktur', cta: 'Lihat paket', alt: 'Logo Rumah Terapi Asy-Syifa' },
  { img: LOGO_IMAGE, brand: 'Asy-Syifa', title: 'Akupresur & TMD', cta: 'Lihat paket', alt: 'Logo Rumah Terapi Asy-Syifa' },
  { img: LOGO_IMAGE, brand: 'Asy-Syifa', title: 'Beauty Care', cta: 'Lihat paket', alt: 'Logo Rumah Terapi Asy-Syifa' }
];

// Dummy therapist profiles; replace with approved staff details and photos.
export const trustSlides = [
  { headline: ['Terapi', 'Holistik', 'untuk', 'Kesehatan'], initials: 'JP', name: 'Jasmine Puspa Medina', role: 'Terapis Akupuntur' },
  { headline: ['Pendekatan', 'Terarah', 'bagi', 'Keluarga'], initials: 'RP', name: 'Rizky Pratama', role: 'Terapis Akupunktur · Dummy' },
  { headline: ['Ruang', 'Nyaman', 'untuk', 'Perawatan'], initials: 'SR', name: 'Siti Rahma', role: 'Terapis Akupresur · Dummy' }
];

// Package category teasers; full prices will live on harga.html.
export const programLines = ['Paket Terapi', 'Asy-Syifa'];
export const programs = [
  { index: '01', name: 'Paket Pengobatan', desc: 'Pilihan kombinasi bekam sunnah, TMD, akupunktur, dan akupresur.', href: 'paket-pengobatan.html' },
  { index: '02', name: 'Paket Perawatan', desc: 'Rangkaian terapi untuk relaksasi, kebugaran, dan perawatan diri.', href: 'paket-perawatan.html' },
  { index: '03', name: 'Paket Spesialis', desc: 'Pilihan paket untuk kebutuhan khusus, promil, beauty care, dan lainnya.', href: 'paket-spesialis.html' },
  { index: '04', name: 'Paket Basic', desc: 'Pilihan awal untuk bekam sunnah dan terapi dasar.', href: 'paket-basic.html' }
];

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
  { value: '15+', label: 'Jenis terapi' },
  { value: '10+', label: 'Paket perawatan' },
  { value: '5+', label: 'Tahun pengalaman' }
];

// No patient quotes are fabricated; replace the empty state with approved testimonials.
export const testimonialLines = ['Cerita', 'Pasien Kami'];
export const testimonials = [];

// Contact and reservation
export const footerLines = ['Mulai', 'Konsultasi'];
export const modalLines = ['Reservasi', 'Asy-Syifa'];
