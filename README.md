# Asyifa

Landing page tennis club yang dimigrasikan ke Vite dengan parity terhadap snapshot HTML awal.

## Jalankan lokal

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## Verifikasi parity

```bash
npm run verify
```

Script ini menjalankan baseline `_backup/index.html` dan build Vite secara berdampingan, lalu memeriksa:

- parity konten desktop dan mobile;
- modal, form submit, menu, dan carousel;
- autoplay collection;
- screenshot pixel diff;
- console errors.

Hasil terbaru: PASS, pixel diff desktop/mobile `0`, dan tidak ada console error. Artefak laporan tersimpan di `_compare/`.

## Struktur

- `src/data/` — konten dan referensi asset.
- `src/modules/` — modul perilaku halaman.
- `src/styles/main.css` — CSS hasil ekstraksi verbatim.
- `src/main.js` — bootstrap dengan urutan inisialisasi asli.
- `_backup/index.html` — snapshot baseline sebelum migrasi.
