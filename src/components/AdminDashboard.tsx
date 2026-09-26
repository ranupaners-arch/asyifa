import { useCallback, useEffect, useMemo, useState } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const;
type BookingStatus = (typeof statuses)[number];

type Booking = {
  reference: string;
  name: string;
  phone: string;
  service_name: string;
  booking_date: string;
  start_time: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
};

const statusLabels: Record<BookingStatus, string> = {
  pending: 'Menunggu',
  confirmed: 'Dikonfirmasi',
  in_progress: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan'
};

const navItems = [
  ['Dashboard', 'grid', 'dashboard'], ['Reservasi', 'calendar', 'reservations'], ['Jadwal', 'clock', 'schedules'], ['Layanan', 'layers', 'services'],
  ['Terapis', 'users', 'therapists'], ['Produk', 'package', 'products'], ['Pesanan', 'receipt', 'orders'], ['Pelanggan', 'user', 'customers'],
  ['Laporan', 'chart', 'reports'], ['Pengaturan', 'settings', 'settings']
] as const;
type AdminSection = (typeof navItems)[number][2];

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    calendar: 'M6 3v3M18 3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
    clock: 'M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    layers: 'M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5',
    users: 'M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a4 4 0 100-8 4 4 0 000 8zM17 11a3 3 0 100-6M17 15h1a4 4 0 014 4v1',
    package: 'M4 7l8-4 8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10M8 5l8 4',
    receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6',
    user: 'M19 21a7 7 0 00-14 0M12 11a4 4 0 100-8 4 4 0 000 8z',
    chart: 'M4 19V5M4 19h16M8 16v-5M12 16V7M16 16v-3',
    settings: 'M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.7 1.7 0 00.3 1.9l.1.1-1.4 1.4-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5v.2h-2v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1L9 17l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H7v-2h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9L8.3 9 9.7 7.6l.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.5v-.2h2v.2a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1L19 9l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.5 1h.2v2h-.2a1.7 1.7 0 00-.7 1z'
  };
  return <svg className="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

function dateKey(value: string) { return value.slice(0, 10); }
function localDateKey(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${dateKey(value)}T00:00:00`));
}
function formatRelative(value: string) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function TrendChart({ bookings }: { bookings: Booking[] }) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (6 - index));
    return localDateKey(day);
  });
  const values = days.map(day => bookings.filter(booking => dateKey(booking.booking_date) === day).length);
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${index * 50 + 10},${104 - (value / max) * 84}`).join(' ');
  return <div className="trend-chart">
    <svg viewBox="0 0 320 128" role="img" aria-label="Tren reservasi tujuh hari terakhir">
      {[20, 62, 104].map(y => <line key={y} x1="10" x2="310" y1={y} y2={y} className="chart-grid" />)}
      <polyline points={points} className="chart-line" />
      {values.map((value, index) => <circle key={days[index]} cx={index * 50 + 10} cy={104 - (value / max) * 84} r="3" className="chart-dot"><title>{value} reservasi</title></circle>)}
    </svg>
    <div className="chart-labels">{days.map(day => <span key={day}>{new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(new Date(`${day}T00:00:00`))}</span>)}</div>
  </div>;
}

function PopularServices({ bookings }: { bookings: Booking[] }) {
  const services = [...bookings.reduce((counts, booking) => counts.set(booking.service_name, (counts.get(booking.service_name) || 0) + 1), new Map<string, number>())]
    .sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = services[0]?.[1] || 1;
  if (!services.length) return <p className="admin-state">Belum ada data layanan.</p>;
  return <div className="popular-list">{services.map(([name, count]) => <div className="popular-row" key={name}><div><span>{name}</span><strong>{count}</strong></div><div className="bar-track"><i style={{ width: `${(count / max) * 100}%` }} /></div></div>)}</div>;
}

function EmptyModule({ title, description }: { title: string; description: string }) {
  return <section className="admin-card module-empty"><div className="module-empty-mark">—</div><h2>{title}</h2><p>{description}</p><small>Modul ini belum terhubung ke data aplikasi.</small></section>;
}

function CustomerList({ bookings }: { bookings: Booking[] }) {
  const customers = [...bookings.reduce((items, booking) => items.set(booking.phone, booking), new Map<string, Booking>()).values()];
  if (!customers.length) return <EmptyModule title="Pelanggan" description="Belum ada pelanggan dari reservasi yang tersimpan." />;
  return <section className="admin-card module-table-card"><div className="admin-card-heading"><div><h2>Pelanggan</h2><p>Kontak yang pernah membuat reservasi.</p></div><span className="admin-card-meta">{customers.length} kontak</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nama</th><th>Nomor WhatsApp</th><th>Reservasi terakhir</th><th>Status</th></tr></thead><tbody>{customers.map(customer => <tr key={customer.phone}><td><strong>{customer.name}</strong></td><td>{customer.phone}</td><td>{formatDate(customer.booking_date)}<small>{customer.service_name}</small></td><td><span className={`status-text status-${customer.status}`}>{statusLabels[customer.status]}</span></td></tr>)}</tbody></table></div></section>;
}

function ReservationList({ bookings, filter, setFilter, loading, error, updateStatus }: { bookings: Booking[]; filter: 'all' | BookingStatus; setFilter: (value: 'all' | BookingStatus) => void; loading: boolean; error: string; updateStatus: (reference: string, status: BookingStatus) => Promise<void> }) {
  const visibleBookings = (filter === 'all' ? bookings : bookings.filter(booking => booking.status === filter)).slice(0, 30);
  return <section className="admin-card module-table-card"><div className="admin-card-heading"><div><h2>Reservasi</h2><p>Kelola semua booking yang masuk.</p></div><label className="admin-filter">Filter<select value={filter} onChange={event => setFilter(event.target.value as 'all' | BookingStatus)}><option value="all">Semua status</option>{statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label></div>{error && <p className="admin-error" role="alert">{error}</p>}{loading ? <p className="admin-state">Memuat reservasi…</p> : null}{!loading && !visibleBookings.length ? <p className="admin-state">Belum ada reservasi pada filter ini.</p> : null}{!loading && visibleBookings.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Pelanggan</th><th>Layanan</th><th>Jadwal</th><th>Status</th></tr></thead><tbody>{visibleBookings.map(booking => <tr key={booking.reference}><td><strong>{booking.name}</strong><small>{booking.reference} · {booking.phone}</small></td><td>{booking.service_name}<small>{booking.notes || 'Tanpa catatan'}</small></td><td>{formatDate(booking.booking_date)}<small>{booking.start_time.slice(0, 5)} WIB</small></td><td><select className={`status-select status-${booking.status}`} value={booking.status} onChange={event => void updateStatus(booking.reference, event.target.value as BookingStatus)} aria-label={`Status ${booking.reference}`}>{statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td></tr>)}</tbody></table></div> : null}</section>;
}

function ReportsPage({ bookings }: { bookings: Booking[] }) {
  const completed = bookings.filter(booking => booking.status === 'completed').length;
  const cancelled = bookings.filter(booking => booking.status === 'cancelled').length;
  return <><div className="module-summary"><article className="metric-card"><span>Total reservasi</span><strong>{bookings.length}</strong></article><article className="metric-card"><span>Selesai</span><strong>{completed}</strong></article><article className="metric-card"><span>Dibatalkan</span><strong>{cancelled}</strong></article></div><section className="admin-chart-grid"><article className="admin-card"><div className="admin-card-heading"><div><h2>Tren reservasi</h2><p>Data booking tujuh hari terakhir.</p></div></div><TrendChart bookings={bookings} /></article><article className="admin-card"><div className="admin-card-heading"><div><h2>Layanan terpopuler</h2><p>Distribusi dari data reservasi.</p></div></div><PopularServices bookings={bookings} /></article></section></>;
}

export default function AdminDashboard() {
  const requestedSection = new URLSearchParams(window.location.search).get('page') as AdminSection | null;
  const activeSection: AdminSection = navItems.some(item => item[2] === requestedSection) ? requestedSection as AdminSection : 'dashboard';
  const activeLabel = navItems.find(item => item[2] === activeSection)?.[0] || 'Dashboard';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings`, { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Data reservasi belum dapat dimuat.');
      setBookings(result.bookings);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Data reservasi belum dapat dimuat.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadBookings(); }, [loadBookings]);

  const updateStatus = async (reference: string, status: BookingStatus) => {
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings/${reference}/status`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Status belum dapat diubah.');
      setBookings(current => current.map(booking => booking.reference === reference ? { ...booking, status } : booking));
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Status belum dapat diubah.'); }
  };

  const today = localDateKey();
  const todayBookings = bookings.filter(booking => dateKey(booking.booking_date) === today);
  const visibleBookings = (filter === 'all' ? bookings : bookings.filter(booking => booking.status === filter)).slice(0, 12);
  const pendingCount = bookings.filter(booking => booking.status === 'pending').length;

  return <div className="admin-app">
    {sidebarOpen && <button className="admin-drawer-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Tutup menu" />}
    <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}>
      <div className="admin-brand"><span className="admin-brand-mark">AS</span><span><strong>Asy-Syifa</strong><small>Admin workspace</small></span></div>
      <div className="admin-nav-label">Workspace</div>
      <nav className="admin-nav" aria-label="Navigasi admin">
        {navItems.map(([label, icon, slug]) => <a className={`admin-nav-item${activeSection === slug ? ' is-active' : ''}`} href={`admin.html${slug === 'dashboard' ? '' : `?page=${slug}`}`} key={label}><Icon name={icon} />{label}</a>)}
      </nav>
      <div className="admin-sidebar-footer"><span className="admin-avatar">AS</span><span><strong>Administrator</strong><small>Local workspace</small></span></div>
    </aside>

    <div className="admin-main">
      <header className="admin-topbar"><button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Buka menu"><Icon name="grid" /></button><div className="admin-breadcrumb"><span>Workspace</span><b>/</b><strong>{activeLabel}</strong></div><div className="admin-topbar-actions"><span className="admin-live-dot" />Data lokal<a href="index.html" className="admin-public-link">Website publik</a></div></header>
      <main className="admin-content">
        <div className="admin-page-heading"><div><h1>{activeLabel}</h1><p>{activeSection === 'dashboard' ? 'Ringkasan operasional reservasi Rumah Terapi Asy-Syifa.' : `Kelola modul ${activeLabel.toLowerCase()} Rumah Terapi Asy-Syifa.`}</p></div><button type="button" className="admin-refresh" onClick={() => void loadBookings()}>Muat ulang</button></div>

        {activeSection !== 'dashboard' && activeSection === 'reservations' ? <ReservationList bookings={bookings} filter={filter} setFilter={setFilter} loading={loading} error={error} updateStatus={updateStatus} /> : null}
        {activeSection !== 'dashboard' && activeSection === 'customers' ? <CustomerList bookings={bookings} /> : null}
        {activeSection !== 'dashboard' && activeSection === 'reports' ? <ReportsPage bookings={bookings} /> : null}
        {activeSection !== 'dashboard' && activeSection !== 'reservations' && activeSection !== 'customers' && activeSection !== 'reports' ? <EmptyModule title={activeLabel} description={`Halaman ${activeLabel.toLowerCase()} siap menjadi ruang kerja admin.`} /> : null}

        {activeSection === 'dashboard' ? <>
        <section className="admin-metrics" aria-label="Ringkasan utama">
          <article className="metric-card"><div className="metric-card-top"><span>Reservasi hari ini</span><Icon name="calendar" /></div><strong>{todayBookings.length}</strong><small>{todayBookings.length ? 'Ada jadwal hari ini' : 'Belum ada jadwal hari ini'}</small></article>
          <article className="metric-card"><div className="metric-card-top"><span>Reservasi pending</span><Icon name="clock" /></div><strong>{pendingCount}</strong><small>Perlu ditinjau admin</small></article>
          <article className="metric-card"><div className="metric-card-top"><span>Order aktif</span><Icon name="package" /></div><strong>—</strong><small>Modul order belum terhubung</small></article>
          <article className="metric-card"><div className="metric-card-top"><span>Pendapatan hari ini</span><Icon name="chart" /></div><strong>—</strong><small>Belum ada data transaksi</small></article>
        </section>

        <section className="admin-chart-grid"><article className="admin-card chart-card"><div className="admin-card-heading"><div><h2>Tren reservasi</h2><p>Jumlah booking tujuh hari terakhir</p></div><span className="admin-card-meta">7 hari</span></div><TrendChart bookings={bookings} /></article><article className="admin-card"><div className="admin-card-heading"><div><h2>Layanan terpopuler</h2><p>Berdasarkan reservasi tersimpan</p></div></div><PopularServices bookings={bookings} /></article></section>

        <section className="admin-card reservation-card"><div className="admin-card-heading"><div><h2>Reservasi terbaru</h2><p>Kelola status dari booking yang masuk.</p></div><label className="admin-filter">Filter<select value={filter} onChange={event => setFilter(event.target.value as 'all' | BookingStatus)}><option value="all">Semua status</option>{statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label></div>
          {error && <p className="admin-error" role="alert">{error}</p>}{loading ? <p className="admin-state">Memuat reservasi…</p> : null}{!loading && !visibleBookings.length ? <p className="admin-state">Belum ada reservasi pada filter ini.</p> : null}
          {!loading && visibleBookings.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Pelanggan</th><th>Layanan</th><th>Jadwal</th><th>Status</th></tr></thead><tbody>{visibleBookings.map(booking => <tr key={booking.reference}><td><strong>{booking.name}</strong><small>{booking.reference} · {booking.phone}</small></td><td>{booking.service_name}<small>{booking.notes || 'Tanpa catatan'}</small></td><td>{formatDate(booking.booking_date)}<small>{booking.start_time.slice(0, 5)} WIB</small></td><td><select className={`status-select status-${booking.status}`} value={booking.status} onChange={event => void updateStatus(booking.reference, event.target.value as BookingStatus)} aria-label={`Status ${booking.reference}`}>{statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td></tr>)}</tbody></table></div> : null}
        </section>

        <section className="admin-card activity-card"><div className="admin-card-heading"><div><h2>Aktivitas terbaru</h2><p>Reservasi yang terakhir dibuat.</p></div></div>{bookings.length ? <div className="activity-list">{[...bookings].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 4).map(booking => <div className="activity-row" key={booking.reference}><span className={`activity-dot status-${booking.status}`} /><div><strong>{booking.name}</strong><p>Membuat reservasi {booking.service_name}</p></div><time>{formatRelative(booking.created_at)}</time></div>)}</div> : <p className="admin-state">Belum ada aktivitas.</p>}</section>
        </> : null}
      </main>
    </div>
  </div>;
}
