# Asy-Syifa

Website profil dan portal operasional untuk **Rumah Terapi Asy-Syifa Surakarta** — klinik bekam sunnah, akupunktur, akupresur, dan beauty care. Ditujukan untuk calon pasien yang mencari info layanan/harga, serta untuk Owner/Admin/Staff klinik yang mengelola reservasi, pengguna, cabang, dan cashflow.

## Fitur utama

- Landing page company profile: hero, value proposition, profil terapis, daftar paket, fasilitas, statistik klinik, dan modal reservasi.
- Daftar harga per kategori layanan dengan tampilan disclosure (`harga.html`).
- Halaman detail 4 paket terapi: Pengobatan, Perawatan, Spesialis, dan Basic.
- Katalog produk madu dengan pilihan ukuran dan tautan tanya-admin via WhatsApp (`produk.html`).
- API reservasi (booking) dengan pengecekan slot yang sudah terpakai sebelum menyimpan data.
- Portal admin (`admin.html`) dengan setup akun Owner pertama, login, dan sesi berbasis token:
  - Dashboard metrik (jumlah reservasi, staff aktif, cabang aktif, cashflow harian) untuk Owner.
  - Kelola status reservasi (pending, confirmed, in_progress, completed, cancelled).
  - Kelola pengguna — Owner dapat membuat Admin/Staff, Admin hanya dapat membuat Staff di cabangnya.
  - Kelola cabang serta pencatatan cashflow masuk/keluar per cabang (khusus Owner/Admin).
  - Modul tambahan (Jadwal, Layanan, Terapis, Produk, Pesanan, Laporan, Pengaturan) sudah ada di navigasi Admin namun masih berupa kerangka UI, belum terhubung ke data.

## Tech stack

- **Frontend**: React 19 + TypeScript, Vite 7 (multi-page build), Lenis (smooth scroll).
- **Styling**: CSS modular per kategori (`src/styles/*.css`).
- **Backend**: Node.js (`http` native) + `mysql2`, autentikasi password dengan `scrypt` dan sesi token in-memory.
- **Database**: MySQL (lihat `database/schema.sql`).
- **Tooling**: TypeScript, `@vitejs/plugin-react`; `scripts/verify.mjs` memakai `puppeteer-core`, `pixelmatch`, `pngjs` untuk pemeriksaan visual.

## Cara menjalankan lokal

1. Install dependency:
   ```bash
   npm install
   ```
2. Siapkan database MySQL mengikuti `database/README.md`: jalankan MySQL (misalnya via Dbngin) di `127.0.0.1:3305`, lalu eksekusi seluruh isi `database/schema.sql`.
3. Repo ini belum menyertakan `.env.example`. Buat file `.env.local` di root dan isi variabel yang dibaca oleh `api/server.mjs` sesuai kebutuhan lokal: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `API_PORT`, `CORS_ORIGIN`. Untuk frontend, set `VITE_API_BASE_URL` bila API tidak berjalan di `http://localhost:3001`.
4. Jalankan API:
   ```bash
   npm run api
   ```
5. Jalankan frontend (mode dev):
   ```bash
   npm run dev
   ```
6. Build production lalu pratinjau:
   ```bash
   npm run build
   npm run preview
   ```
7. Pemeriksaan lain:
   ```bash
   npm run typecheck   # cek TypeScript saja
   npm run verify       # pemeriksa visual lama; sudah tidak relevan sebagai kriteria penerimaan sejak konten berubah ke Asy-Syifa
   ```

## Struktur folder

- `api/server.mjs` — REST API (auth, reservasi, pengguna, cabang, cashflow, metrik dashboard).
- `database/` — `schema.sql` dan catatan setup database lokal.
- `src/main.tsx`, `src/App.tsx` — entry point React, mount halaman berdasarkan atribut `data-page`.
- `src/components/` — `Dashboard` (portal admin), `ProductCatalog` (katalog madu), `SiteFooter`.
- `src/data/` — konten teks, data harga, dan referensi asset.
- `src/modules/` — modul perilaku halaman lama (carousel, menu, modal, parallax, dll.) yang dipertahankan selama migrasi.
- `src/styles/` — stylesheet CSS per kategori.
- `index.html`, `harga.html`, `produk.html`, `paket-*.html`, `admin.html` — entry multi-page Vite (lihat `vite.config.js`).
- `scripts/verify.mjs` — pemeriksa visual regression.
- `_backup/index.html` — snapshot baseline sebelum migrasi ke konten Asy-Syifa.

## Deploy/rilis

Tidak ada workflow CI/CD (GitHub Actions dsb.) di repo ini. Folder `.vercel` diabaikan oleh git, yang mengindikasikan deployment dilakukan secara manual melalui Vercel, namun tidak ada konfigurasi Vercel yang tersimpan di repo.

## Kredit

Dibuat oleh **Ranupane Rimba Argana**, founder [Kukerjain](https://kukerjain.dev).
Profil: [ranupane.kukerjain.dev](https://ranupane.kukerjain.dev)
