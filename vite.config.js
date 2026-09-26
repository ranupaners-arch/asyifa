import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        admin: resolve(import.meta.dirname, 'admin.html'),
        pricing: resolve(import.meta.dirname, 'harga.html'),
        products: resolve(import.meta.dirname, 'produk.html'),
        packageTreatment: resolve(import.meta.dirname, 'paket-pengobatan.html'),
        packageCare: resolve(import.meta.dirname, 'paket-perawatan.html'),
        packageSpecialist: resolve(import.meta.dirname, 'paket-spesialis.html'),
        packageBasic: resolve(import.meta.dirname, 'paket-basic.html')
      }
    }
  }
});
