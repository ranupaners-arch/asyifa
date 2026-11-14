const whatsapp = 'https://wa.me/6281997039213';
const map = 'https://maps.app.goo.gl/SBG6g1cgNLTNwhm9A?g_st=aw';

export default function SiteFooter() {
  return (
    <footer id="contact">
      <div className="footer-cta">
        <div>
          <div className="eyebrow light"><div className="eyebrow-dot" />Konsultasi terapi</div>
          <p className="footer-cta-title">Mulai<br />Konsultasi</p>
        </div>
        <a className="pill-btn light" href={`${whatsapp}?text=Halo%20Rumah%20Terapi%20Asy-Syifa%2C%20saya%20ingin%20konsultasi.`}>
          Reservasi via WhatsApp
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      <div className="footer-columns">
        <div className="footer-brand">
          <div className="footer-brand-mark">
            <img src="/src/assets/logo.jpeg" alt="" width="40" height="40" />
            <span>Rumah Terapi Asy-Syifa</span>
          </div>
          <p className="footer-brand-blurb">Pusat terapi holistik yang mengombinasikan bekam sunnah, akupunktur, akupresur, dan terapi alami lainnya.</p>
          <address className="footer-brand-address">
            <a href="tel:+6281997039213">0819 9703 9213</a>
            <div className="address-line">Jl. Mliwis No.20, Kerten, Laweyan, Surakarta 57143</div>
          </address>
        </div>

        <nav className="footer-nav" aria-label="Paket terapi">
          <h4>Paket terapi</h4>
          <ul>
            <li><a href="paket-pengobatan.html">Pengobatan</a></li>
            <li><a href="paket-perawatan.html">Perawatan</a></li>
            <li><a href="paket-spesialis.html">Spesialis</a></li>
            <li><a href="paket-basic.html">Basic</a></li>
          </ul>
        </nav>

        <nav className="footer-nav" aria-label="Informasi">
          <h4>Informasi</h4>
          <ul>
            <li><a href="index.html#tentang">Tentang kami</a></li>
            <li><a href="index.html#jadwal-bekam">Jadwal bekam</a></li>
            <li><a href="index.html#madu">Madu Barokah</a></li>
            <li><a href="produk.html">Katalog produk madu</a></li>
            <li><a href="index.html#testimonials">Testimoni</a></li>
          </ul>
        </nav>

        <nav className="footer-nav" aria-label="Kontak dan lokasi">
          <h4>Kontak &amp; lokasi</h4>
          <ul>
            <li><a href={whatsapp}>WhatsApp</a></li>
            <li><a href={map}>Buka peta</a></li>
            <li><a href="tel:+6281997039213">Telepon klinik</a></li>
            <li><a href="index.html#contact">Jam 09.00–21.00</a></li>
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} Rumah Terapi Asy-Syifa Surakarta.</div>
        <nav className="footer-social" aria-label="Media sosial"><a href={whatsapp}>WhatsApp</a></nav>
        <nav className="footer-legal" aria-label="Jam buka"><span>Setiap hari</span><span>09.00–21.00 WIB</span></nav>
      </div>
    </footer>
  );
}
