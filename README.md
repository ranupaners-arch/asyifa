# Asyifa

Website Rumah Terapi Asy-Syifa Surakarta, dibuat dengan Vite, React, dan TypeScript.

## Jalankan lokal

```bash
npm install
npm run dev
```

Entry React/TypeScript berada di `src/main.tsx`; `src/App.tsx` me-mount enam jenis halaman. Markup lama dipertahankan di HTML sebagai jembatan agar layout, animasi, dan interaksi tetap identik selama migrasi bertahap.

Halaman utama tersedia di `/`, daftar harga di `/harga.html`, serta halaman detail Paket Pengobatan, Paket Perawatan, Paket Spesialis, dan Paket Basic di masing-masing `/paket-*.html`.

Build production:

```bash
npm run build
npm run preview
```

`npm run typecheck` menjalankan pemeriksaan TypeScript.

## Pemeriksaan build

```bash
npm run build
npm run preview
```

`npm run verify` adalah pemeriksa parity lama terhadap snapshot Tennis Club di `_backup/index.html`. Karena konten kini sengaja berubah menjadi Asy-Syifa, perbandingan visual lama tersebut bukan lagi kriteria penerimaan.

## Struktur

- `src/data/` — konten dan referensi asset.
- `src/modules/` — modul perilaku halaman.
- `src/styles/main.css` — entry point yang mengimpor stylesheet kategori.
- `src/styles/base.css` — tokens, reset, document defaults, dan utilities.
- `src/styles/hero.css` — loader, header, dan hero.
- `src/styles/sections.css` — trust, programs, facilities, stats, dan testimonials.
- `src/styles/footer.css` — footer.
- `src/styles/overlays.css` — modal dan menu overlay.
- `src/styles/motion.css` — preferensi reduced motion.
- `src/data/prices.js` dan `harga.html` — data serta halaman rincian paket dan harga.
- `src/pricing.js` — render kategori harga dengan elemen disclosure native.
- `src/main.tsx` dan `src/App.tsx` — React entry point dan mount halaman.
- `src/home-bootstrap.js` — efek dan interaksi landing page yang dipertahankan selama transisi.
- `src/pricing.js` dan `src/service-page.js` — render rincian harga dan halaman paket setelah React mount.
- `_backup/index.html` — snapshot baseline sebelum migrasi.
