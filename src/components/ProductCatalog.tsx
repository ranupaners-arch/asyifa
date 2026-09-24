import { useState } from 'react';
import SiteFooter from './SiteFooter';
import randuImage from '../assets/madu-randu.jpeg';
import akasiaImage from '../assets/honey-akasia.jpg';
import maduManggaImage from '../assets/madu-mangga.jpeg';
import maduKelengkengImage from '../assets/madu-kelengkeng.jpeg';
import maduRambutanImage from '../assets/madu-rambutan.jpeg';
import multifloraImage from '../assets/honey-multiflora.jpg';
import maduHutanSuperImage from '../assets/madu-hutan-super.jpeg';

const sizes = ['250 ml', '500 ml', '1 kg'] as const;

const products = [
  { name: 'Madu Randu', note: 'Ilustrasi bunga randu', image: randuImage },
  { name: 'Madu Hutan Super', note: 'Foto produk Madu Hutan Super', image: maduHutanSuperImage },
  { name: 'Madu Mangga', note: 'Foto produk Madu Mangga', image: maduManggaImage },
  { name: 'Madu Kelengkeng', note: 'Foto produk Madu Kelengkeng', image: maduKelengkengImage },
  { name: 'Madu Rambutan', note: 'Foto produk Madu Rambutan', image: maduRambutanImage }
];

function inquiryLink(product: string, size: string) {
  const text = `Halo Asy-Syifa, saya ingin menanyakan ketersediaan ${product} ukuran ${size} dan harganya.`;
  return `https://wa.me/6281997039213?text=${encodeURIComponent(text)}`;
}

export default function ProductCatalog() {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    Object.fromEntries(products.map(({ name }) => [name, sizes[0]]))
  );

  return (
    <>
      <header className="price-header product-header">
        <div className="header-inner">
          <nav className="header-nav" aria-label="Navigasi utama">
            <a href="index.html#programs">Layanan</a>
            <a href="harga.html">Daftar Harga</a>
            <a href="index.html#jadwal-bekam">Jadwal Bekam</a>
            <a href="produk.html" aria-current="page">Produk Madu</a>
          </nav>
          <a className="header-brand" href="index.html" aria-label="Rumah Terapi Asy-Syifa, beranda">
            <img src="/src/assets/logo.jpeg" alt="" width="36" height="36" />
            <span>Asy-Syifa</span>
          </a>
          <div className="header-actions">
            <a className="btn-book-visit" href="https://wa.me/6281997039213">Hubungi admin</a>
          </div>
        </div>
      </header>

      <main className="product-page">
        <section className="product-intro" aria-labelledby="product-title">
          <div className="eyebrow light"><span className="eyebrow-dot" />Produk pilihan</div>
          <h1 id="product-title">Madu Barokah</h1>
          <p>Pilih varian dan ukuran untuk menanyakan ketersediaan serta harga kepada admin.</p>
          <a className="pill-btn light" href="#produk">Lihat pilihan madu</a>
        </section>

        <section className="product-list" id="produk" aria-label="Pilihan produk madu">
          <div className="product-section-heading">
            <div>
              <div className="eyebrow dark"><span className="eyebrow-dot" />Katalog contoh</div>
              <h2>Pilihan varian</h2>
            </div>
            <p>Ukuran dan harga dikonfirmasi langsung kepada admin.</p>
          </div>

          <div className="product-grid">
            {products.map((product, index) => {
              const selectedSize = selectedSizes[product.name] ?? sizes[0];
              return (
                <article className="product-card" key={product.name}>
                  <div className="product-image-wrap">
                    <img src={product.image} alt={`Ilustrasi dummy ${product.name} dalam toples madu`} loading="lazy" />
                    <span className="product-number">0{index + 1}</span>
                  </div>
                  <div className="product-card-content">
                    <div className="product-caption">{product.note}</div>
                    <h3>{product.name}</h3>
                    <div className="product-size-label">Contoh pilihan ukuran</div>
                    <div className="product-size-options" aria-label={`Ukuran ${product.name}`}>
                      {sizes.map((size) => (
                        <button
                          type="button"
                          key={size}
                          aria-pressed={selectedSize === size}
                          onClick={() => setSelectedSizes((current) => ({ ...current, [product.name]: size }))}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <div className="product-order-row">
                      <span>Harga tanya admin</span>
                      <a href={inquiryLink(product.name, selectedSize)} target="_blank" rel="noreferrer">
                        Tanya ukuran ini <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <div className="product-footer-shell">
        <SiteFooter />
      </div>
    </>
  );
}
