import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import mysql from 'mysql2/promise';

const port = Number(process.env.API_PORT || 3001);
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3305),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'asyifa',
  waitForConnections: true,
  connectionLimit: 5,
  dateStrings: true
});

const sendJson = (res, status, body) => {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': process.env.CORS_ORIGIN || 'http://localhost:5173',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS'
  });
  res.end(JSON.stringify(body));
};

const readJson = req => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
    if (body.length > 100_000) reject(new Error('Payload terlalu besar.'));
  });
  req.on('end', () => {
    try { resolve(JSON.parse(body || '{}')); }
    catch { reject(new Error('Body JSON tidak valid.')); }
  });
  req.on('error', reject);
});

const requiredText = (value, label, maxLength) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} wajib diisi.`);
  if (value.trim().length > maxLength) throw new Error(`${label} terlalu panjang.`);
  return value.trim();
};

const createReference = () => `ASY-${randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()}`;
const bookingStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

async function createBooking(payload) {
  const name = requiredText(payload.name, 'Nama', 120);
  const phone = requiredText(payload.phone, 'Nomor telepon', 32);
  const serviceName = requiredText(payload.serviceName, 'Layanan', 160);
  const bookingDate = requiredText(payload.bookingDate, 'Tanggal', 10);
  const startTime = requiredText(payload.startTime, 'Jam', 8);
  const notes = typeof payload.notes === 'string' ? payload.notes.trim().slice(0, 2000) : null;
  const therapistId = payload.therapistId ? Number(payload.therapistId) : null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) throw new Error('Format tanggal harus YYYY-MM-DD.');
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(startTime)) throw new Error('Format jam tidak valid.');
  if (therapistId !== null && !Number.isInteger(therapistId)) throw new Error('Terapis tidak valid.');

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [existing] = await connection.execute(
      `SELECT id FROM bookings
       WHERE therapist_id <=> ? AND booking_date = ? AND start_time = ?
       AND status IN ('pending', 'confirmed', 'in_progress')
       LIMIT 1 FOR UPDATE`,
      [therapistId, bookingDate, startTime]
    );
    if (existing.length) throw new Error('Slot tersebut sudah dipesan.');

    const [customer] = await connection.execute(
      'INSERT INTO customers (name, phone) VALUES (?, ?)',
      [name, phone]
    );
    const reference = createReference();
    await connection.execute(
      `INSERT INTO bookings
       (reference, customer_id, service_name, therapist_id, booking_date, start_time, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [reference, customer.insertId, serviceName, therapistId, bookingDate, startTime, notes]
    );
    await connection.commit();
    return { reference, status: 'pending' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (requestUrl.pathname === '/api/health' && req.method === 'GET') {
    try {
      await pool.query('SELECT 1');
      return sendJson(res, 200, { ok: true, database: 'connected' });
    } catch {
      return sendJson(res, 503, { ok: false, database: 'unavailable' });
    }
  }
  if (requestUrl.pathname === '/api/bookings' && req.method === 'GET') {
    try {
      const status = requestUrl.searchParams.get('status');
      const params = [];
      const where = status && bookingStatuses.includes(status) ? 'WHERE b.status = ?' : '';
      if (where) params.push(status);
      const [rows] = await pool.execute(
        `SELECT b.reference, c.name, c.phone, b.service_name, b.booking_date,
                b.start_time, b.notes, b.status, b.created_at
         FROM bookings b
         JOIN customers c ON c.id = b.customer_id
         ${where}
         ORDER BY b.booking_date ASC, b.start_time ASC, b.id DESC`,
        params
      );
      return sendJson(res, 200, { bookings: rows });
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }
  const statusMatch = requestUrl.pathname.match(/^\/api\/bookings\/([^/]+)\/status$/);
  if (statusMatch && req.method === 'PATCH') {
    try {
      const payload = await readJson(req);
      if (!bookingStatuses.includes(payload.status)) throw new Error('Status booking tidak valid.');
      const [result] = await pool.execute(
        'UPDATE bookings SET status = ? WHERE reference = ?',
        [payload.status, statusMatch[1]]
      );
      if (!result.affectedRows) return sendJson(res, 404, { error: 'Reservasi tidak ditemukan.' });
      return sendJson(res, 200, { reference: statusMatch[1], status: payload.status });
    } catch (error) {
      const clientError = error.message.includes('tidak valid') || error.message.includes('JSON');
      return sendJson(res, clientError ? 400 : 500, { error: error.message });
    }
  }
  if (requestUrl.pathname === '/api/bookings' && req.method === 'POST') {
    try {
      const result = await createBooking(await readJson(req));
      return sendJson(res, 201, result);
    } catch (error) {
      const clientError = /wajib|terlalu panjang|Format|valid|Payload|JSON|Slot tersebut/.test(error.message);
      return sendJson(res, clientError ? 400 : 500, { error: error.message });
    }
  }
  return sendJson(res, 404, { error: 'Endpoint tidak ditemukan.' });
});

server.listen(port, () => console.log(`Asy-Syifa API listening on http://localhost:${port}`));

let shuttingDown = false;
const shutdown = async () => {
  if (shuttingDown) return;
  shuttingDown = true;
  server.close();
  await pool.end().catch(() => {});
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
