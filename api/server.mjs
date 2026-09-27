import { createServer } from 'node:http';
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import mysql from 'mysql2/promise';

const port = Number(process.env.API_PORT || 3001);
const scrypt = promisify(scryptCallback);
const sessionLifetimeMs = 1000 * 60 * 60 * 12;
const sessions = new Map();
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
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS'
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
const accountRoles = ['owner', 'admin', 'staff'];

const normalizeEmail = value => requiredText(value, 'Email', 190).toLowerCase();
const passwordHash = async password => {
  const salt = randomBytes(16).toString('base64url');
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${Buffer.from(derived).toString('base64url')}`;
};
const passwordMatches = async (password, encoded) => {
  const [algorithm, salt, expected] = String(encoded).split('$');
  if (algorithm !== 'scrypt' || !salt || !expected) return false;
  const actual = Buffer.from(await scrypt(password, salt, 64));
  const target = Buffer.from(expected, 'base64url');
  return target.length === actual.length && timingSafeEqual(target, actual);
};
const publicUser = user => ({ id: user.id, name: user.name, email: user.email, role: user.role, branchId: user.branch_id ?? user.branchId ?? null });
const createSession = userId => {
  const token = randomBytes(32).toString('base64url');
  sessions.set(token, { userId, expiresAt: Date.now() + sessionLifetimeMs });
  return token;
};
const sessionToken = req => {
  const authorization = req.headers.authorization || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
};
const getAuthenticatedUser = async req => {
  const token = sessionToken(req);
  const session = token && sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return null;
  }
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, branch_id FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
    [session.userId]
  );
  return rows[0] || null;
};
const requireUser = async (req, res, allowedRoles = accountRoles) => {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    sendJson(res, 401, { error: 'Silakan login terlebih dahulu.' });
    return null;
  }
  if (!allowedRoles.includes(user.role)) {
    sendJson(res, 403, { error: 'Anda tidak memiliki akses untuk tindakan ini.' });
    return null;
  }
  return user;
};

async function setupRequired() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
  return Number(rows[0].total) === 0;
}

async function ownerMetrics(branchId = null) {
  const branchFilter = branchId === null ? '' : ' AND branch_id = ?';
  const branchParams = branchId === null ? [] : [branchId];
  const [[bookingTotals], [staffTotals], [branchTotals], [cashflowTotals]] = await Promise.all([
    pool.query(`SELECT COUNT(*) AS total, SUM(status = 'pending') AS pending FROM bookings${branchId === null ? '' : ' WHERE branch_id = ?'}`, branchParams),
    pool.query(`SELECT COUNT(*) AS total FROM users WHERE role = 'staff' AND is_active = 1${branchFilter}`, branchParams),
    pool.query(`SELECT COUNT(*) AS total FROM branches WHERE is_active = 1${branchId === null ? '' : ' AND id = ?'}`, branchParams),
    pool.query(`SELECT COALESCE(SUM(CASE WHEN direction = 'in' THEN amount ELSE 0 END), 0) AS income, COALESCE(SUM(CASE WHEN direction = 'out' THEN amount ELSE 0 END), 0) AS expense FROM cashflows WHERE occurred_on = CURDATE()${branchId === null ? '' : ' AND branch_id = ?'}`, branchParams)
  ]);
  return {
    bookings: Number(bookingTotals[0].total),
    pendingBookings: Number(bookingTotals[0].pending || 0),
    activeStaff: Number(staffTotals[0].total),
    activeBranches: Number(branchTotals[0].total),
    todayIncome: Number(cashflowTotals[0].income),
    todayExpense: Number(cashflowTotals[0].expense)
  };
}

async function listBranches(actor) {
  const params = actor.role === 'admin' && actor.branch_id !== null ? [actor.branch_id] : [];
  const where = params.length ? 'WHERE b.id = ?' : '';
  const [rows] = await pool.execute(
    `SELECT b.id, b.code, b.name, b.address, b.phone, b.is_active,
            (SELECT COUNT(*) FROM users u WHERE u.branch_id = b.id AND u.is_active = 1 AND u.role IN ('admin', 'staff')) AS staff_count,
            (SELECT COUNT(*) FROM bookings bk WHERE bk.branch_id = b.id AND DATE(bk.booking_date) = CURDATE()) AS today_bookings,
            (SELECT COALESCE(SUM(CASE WHEN cf.direction = 'in' THEN cf.amount WHEN cf.direction = 'out' THEN -cf.amount ELSE 0 END), 0) FROM cashflows cf WHERE cf.branch_id = b.id) AS balance
     FROM branches b ${where} ORDER BY b.name ASC`, params
  );
  return rows;
}

async function createBooking(payload) {
  const name = requiredText(payload.name, 'Nama', 120);
  const phone = requiredText(payload.phone, 'Nomor telepon', 32);
  const serviceName = requiredText(payload.serviceName, 'Layanan', 160);
  const bookingDate = requiredText(payload.bookingDate, 'Tanggal', 10);
  const startTime = requiredText(payload.startTime, 'Jam', 8);
  const notes = typeof payload.notes === 'string' ? payload.notes.trim().slice(0, 2000) : null;
  const therapistId = payload.therapistId ? Number(payload.therapistId) : null;
  const branchId = payload.branchId ? Number(payload.branchId) : null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) throw new Error('Format tanggal harus YYYY-MM-DD.');
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(startTime)) throw new Error('Format jam tidak valid.');
  if (therapistId !== null && !Number.isInteger(therapistId)) throw new Error('Terapis tidak valid.');
  if (branchId !== null && !Number.isInteger(branchId)) throw new Error('Cabang tidak valid.');

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
       (reference, customer_id, service_name, therapist_id, branch_id, booking_date, start_time, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [reference, customer.insertId, serviceName, therapistId, branchId, bookingDate, startTime, notes]
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
  if (requestUrl.pathname === '/api/auth/setup' && req.method === 'GET') {
    try {
      return sendJson(res, 200, { setupRequired: await setupRequired() });
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }
  if (requestUrl.pathname === '/api/auth/setup' && req.method === 'POST') {
    try {
      if (!(await setupRequired())) return sendJson(res, 409, { error: 'Akun Owner sudah tersedia. Silakan login.' });
      const payload = await readJson(req);
      const name = requiredText(payload.name, 'Nama', 120);
      const email = normalizeEmail(payload.email);
      const password = requiredText(payload.password, 'Password', 128);
      if (password.length < 8) throw new Error('Password minimal 8 karakter.');
      const [result] = await pool.execute(
        "INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, 'owner', 1)",
        [name, email, await passwordHash(password)]
      );
      const user = { id: result.insertId, name, email, role: 'owner', branch_id: null };
      return sendJson(res, 201, { token: createSession(user.id), user });
    } catch (error) {
      const clientError = /wajib|terlalu panjang|minimal|Duplicate/.test(error.message);
      return sendJson(res, clientError ? 400 : 500, { error: error.message });
    }
  }
  if (requestUrl.pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const payload = await readJson(req);
      const email = normalizeEmail(payload.email);
      const password = requiredText(payload.password, 'Password', 128);
      const [rows] = await pool.execute(
        'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      const user = rows[0];
      if (!user || !user.is_active || !(await passwordMatches(password, user.password_hash))) {
        return sendJson(res, 401, { error: 'Email atau password tidak tepat.' });
      }
      if (!accountRoles.includes(user.role)) return sendJson(res, 403, { error: 'Role akun belum didukung di portal ini.' });
      return sendJson(res, 200, { token: createSession(user.id), user: publicUser(user) });
    } catch (error) {
      const clientError = /wajib|terlalu panjang/.test(error.message);
      return sendJson(res, clientError ? 400 : 500, { error: error.message });
    }
  }
  if (requestUrl.pathname === '/api/auth/session' && req.method === 'GET') {
    try {
      const user = await requireUser(req, res);
      if (!user) return;
      return sendJson(res, 200, { user: publicUser(user) });
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }
  if (requestUrl.pathname === '/api/auth/logout' && req.method === 'POST') {
    const token = sessionToken(req);
    if (token) sessions.delete(token);
    return sendJson(res, 204, {});
  }
  if (requestUrl.pathname === '/api/users' && req.method === 'GET') {
    try {
      const actor = await requireUser(req, res, ['owner', 'admin']);
      if (!actor) return;
      const userQuery = actor.role === 'owner'
        ? "SELECT u.id, u.name, u.email, u.role, u.branch_id, b.name AS branch_name, u.is_active, u.created_at FROM users u LEFT JOIN branches b ON b.id = u.branch_id WHERE u.role IN ('admin', 'staff') ORDER BY u.name ASC"
        : "SELECT u.id, u.name, u.email, u.role, u.branch_id, b.name AS branch_name, u.is_active, u.created_at FROM users u LEFT JOIN branches b ON b.id = u.branch_id WHERE u.role = 'staff' AND (u.branch_id = ? OR ? IS NULL) ORDER BY u.name ASC";
      const [rows] = await pool.execute(userQuery, actor.role === 'admin' ? [actor.branch_id, actor.branch_id] : []);
      return sendJson(res, 200, { users: rows });
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }
  if (requestUrl.pathname === '/api/users' && req.method === 'POST') {
    try {
      const actor = await requireUser(req, res, ['owner', 'admin']);
      if (!actor) return;
      const payload = await readJson(req);
      const name = requiredText(payload.name, 'Nama', 120);
      const email = normalizeEmail(payload.email);
      const password = requiredText(payload.password, 'Password', 128);
      const role = typeof payload.role === 'string' ? payload.role : 'staff';
      const branchId = payload.branchId === null || payload.branchId === undefined || payload.branchId === '' ? null : Number(payload.branchId);
      if (password.length < 8) throw new Error('Password minimal 8 karakter.');
      if (!accountRoles.includes(role) || (actor.role === 'admin' && role !== 'staff') || (actor.role === 'owner' && role === 'owner')) {
        throw new Error('Role pengguna tidak diizinkan.');
      }
      if (!['admin', 'staff'].includes(role) || !Number.isInteger(branchId)) throw new Error('Cabang wajib dipilih.');
      if (actor.role === 'admin' && actor.branch_id !== null && branchId !== actor.branch_id) throw new Error('Admin hanya dapat memilih cabangnya sendiri.');
      const [branchRows] = await pool.execute('SELECT id FROM branches WHERE id = ? AND is_active = 1 LIMIT 1', [branchId]);
      if (!branchRows.length) throw new Error('Cabang tidak ditemukan atau tidak aktif.');
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password_hash, role, branch_id, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [name, email, await passwordHash(password), role, branchId]
      );
      return sendJson(res, 201, { user: { id: result.insertId, name, email, role, branchId, is_active: true } });
    } catch (error) {
      const clientError = /wajib|terlalu panjang|minimal|Role|Duplicate/.test(error.message);
      return sendJson(res, clientError ? 400 : 500, { error: error.message });
    }
  }
  if (requestUrl.pathname === '/api/dashboard/owner' && req.method === 'GET') {
    try {
      const user = await requireUser(req, res, ['owner']);
      if (!user) return;
      const rawBranch = requestUrl.searchParams.get('branch_id');
      const branchId = rawBranch ? Number(rawBranch) : null;
      if (rawBranch && !Number.isInteger(branchId)) return sendJson(res, 400, { error: 'Filter cabang tidak valid.' });
      return sendJson(res, 200, { metrics: await ownerMetrics(branchId) });
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }
  if (requestUrl.pathname === '/api/branches' && req.method === 'GET') {
    try {
      const actor = await requireUser(req, res, ['owner', 'admin']);
      if (!actor) return;
      return sendJson(res, 200, { branches: await listBranches(actor) });
    } catch (error) { return sendJson(res, 500, { error: error.message }); }
  }
  if (requestUrl.pathname === '/api/branches' && req.method === 'POST') {
    try {
      const actor = await requireUser(req, res, ['owner']);
      if (!actor) return;
      const payload = await readJson(req);
      const code = requiredText(payload.code, 'Kode cabang', 32).toUpperCase();
      const name = requiredText(payload.name, 'Nama cabang', 160);
      const address = typeof payload.address === 'string' ? payload.address.trim().slice(0, 2000) : null;
      const phone = typeof payload.phone === 'string' ? payload.phone.trim().slice(0, 32) : null;
      const [result] = await pool.execute('INSERT INTO branches (code, name, address, phone, is_active) VALUES (?, ?, ?, ?, 1)', [code, name, address, phone]);
      return sendJson(res, 201, { branch: { id: result.insertId, code, name, address, phone, is_active: true } });
    } catch (error) { return sendJson(res, 400, { error: error.message }); }
  }
  const branchMatch = requestUrl.pathname.match(/^\/api\/branches\/(\d+)$/);
  if (branchMatch && req.method === 'PATCH') {
    try {
      const actor = await requireUser(req, res, ['owner']);
      if (!actor) return;
      const payload = await readJson(req);
      const branchId = Number(branchMatch[1]);
      const name = requiredText(payload.name, 'Nama cabang', 160);
      const address = typeof payload.address === 'string' ? payload.address.trim().slice(0, 2000) : null;
      const phone = typeof payload.phone === 'string' ? payload.phone.trim().slice(0, 32) : null;
      const isActive = payload.isActive === false ? 0 : 1;
      const [result] = await pool.execute('UPDATE branches SET name = ?, address = ?, phone = ?, is_active = ? WHERE id = ?', [name, address, phone, isActive, branchId]);
      if (!result.affectedRows) return sendJson(res, 404, { error: 'Cabang tidak ditemukan.' });
      return sendJson(res, 200, { id: branchId, name, address, phone, is_active: Boolean(isActive) });
    } catch (error) { return sendJson(res, 400, { error: error.message }); }
  }
  if (requestUrl.pathname === '/api/cashflows' && (req.method === 'GET' || req.method === 'POST')) {
    try {
      const actor = await requireUser(req, res, ['owner', 'admin']);
      if (!actor) return;
      const requestedBranch = requestUrl.searchParams.get('branch_id');
      const branchId = requestedBranch ? Number(requestedBranch) : (actor.role === 'admin' ? actor.branch_id : null);
      if (branchId !== null && !Number.isInteger(branchId)) return sendJson(res, 400, { error: 'Cabang tidak valid.' });
      if (req.method === 'POST') {
        const payload = await readJson(req);
        const direction = payload.direction === 'out' ? 'out' : payload.direction === 'in' ? 'in' : null;
        const amount = Number(payload.amount);
        const occurredOn = requiredText(payload.occurredOn, 'Tanggal', 10);
        const notes = typeof payload.notes === 'string' ? payload.notes.trim().slice(0, 500) : null;
        if (!direction || !Number.isFinite(amount) || amount <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(occurredOn) || !Number.isInteger(branchId)) throw new Error('Data cashflow dan cabang wajib diisi.');
        if (actor.role === 'admin' && actor.branch_id !== null && actor.branch_id !== branchId) throw new Error('Admin hanya dapat mencatat cashflow cabangnya.');
        const [result] = await pool.execute('INSERT INTO cashflows (branch_id, direction, amount, occurred_on, notes) VALUES (?, ?, ?, ?, ?)', [branchId, direction, amount, occurredOn, notes]);
        return sendJson(res, 201, { id: result.insertId });
      }
      const where = branchId === null ? '' : 'WHERE cf.branch_id = ?';
      const [rows] = await pool.execute(`SELECT cf.id, cf.branch_id, b.name AS branch_name, cf.direction, cf.amount, cf.occurred_on, cf.notes, cf.created_at FROM cashflows cf LEFT JOIN branches b ON b.id = cf.branch_id ${where} ORDER BY cf.occurred_on DESC, cf.id DESC`, branchId === null ? [] : [branchId]);
      return sendJson(res, 200, { cashflows: rows });
    } catch (error) { return sendJson(res, 400, { error: error.message }); }
  }
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
      const user = await requireUser(req, res);
      if (!user) return;
      const status = requestUrl.searchParams.get('status');
      const params = []; const conditions = [];
      if (status && bookingStatuses.includes(status)) { conditions.push('b.status = ?'); params.push(status); }
      if (user.role !== 'owner' && user.branch_id !== null) { conditions.push('b.branch_id = ?'); params.push(user.branch_id); }
      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
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
      const user = await requireUser(req, res, ['owner', 'admin']);
      if (!user) return;
      const payload = await readJson(req);
      if (!bookingStatuses.includes(payload.status)) throw new Error('Status booking tidak valid.');
      const [result] = await pool.execute(
        `UPDATE bookings SET status = ? WHERE reference = ?${user.role !== 'owner' && user.branch_id !== null ? ' AND branch_id = ?' : ''}`,
        user.role !== 'owner' && user.branch_id !== null ? [payload.status, statusMatch[1], user.branch_id] : [payload.status, statusMatch[1]]
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
