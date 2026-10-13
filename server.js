'use strict';
/*
 * IELTSX server — static site + JSON API (no npm dependencies, Node 18+).
 *
 *   npm start                      run locally on http://localhost:3000
 *   node scripts/make-admin.js you@mail.com     make an existing account an admin
 *
 * Accounts: everybody signs in with their OWN account (email + password, or Google).
 * Admin is a role, not a special login: set ADMIN_EMAILS (comma separated) and those
 * accounts become admins automatically, or promote a user with scripts/make-admin.js
 * (or from the Admin panel by another admin).
 *
 * Also exported as a request handler for Vercel (api/[...route].js).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

/* ───────────────────────── configuration ───────────────────────── */
const ROOT = __dirname;

// Load .env (KEY=value per line) without any package; real environment variables win.
try {
  fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith('#')) return;
    const v = m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  });
} catch (e) { /* no .env file: fine */ }
const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(ROOT, 'uploads');
const PORT = Number(process.env.PORT || 3000);
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const SUPABASE_URL = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);
const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID || '').trim();
const TRUST_PROXY = IS_VERCEL || process.env.TRUST_PROXY === '1';
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '');
const MAIL_FROM = String(process.env.MAIL_FROM || '');
const PUBLIC_URL = String(process.env.PUBLIC_URL || '').replace(/\/$/, '');
const PAYMENT_WEBHOOK_SECRET = String(process.env.PAYMENT_WEBHOOK_SECRET || '');
const PAYMENT_CONTACT = String(process.env.PAYMENT_CONTACT || 'https://t.me/ieltsx_admin');
const PAYMENT_INSTRUCTIONS = String(process.env.PAYMENT_INSTRUCTIONS || 'Pay with Uzcard / Humo, then send the receipt and your order code to our Telegram. Your plan is activated as soon as we confirm the payment.');
let PLANS = { currency: 'UZS', months: [1, 3, 6], plans: [] };
try { PLANS = JSON.parse(process.env.PLANS_JSON || fs.readFileSync(path.join(ROOT, 'plans.json'), 'utf8')); } catch (e) { console.warn('plans.json could not be read:', e.message); }

const normEmail = (v) => String(v || '').trim().toLowerCase();
const ADMIN_EMAILS = new Set(
  String(process.env.ADMIN_EMAILS || process.env.ADMIN_OWNER_EMAIL || '')
    .split(/[,;\s]+/).map(normEmail).filter((e) => e.includes('@'))
);
// pages that need an active Premium plan (lower-case paths); extend with PREMIUM_PATHS=/a.html,/b.html
// (a * matches anything; put premium-only audio / files under /premium-audio/ to protect them too)
const PREMIUM_PATHS = ['/mock tests.html', '/premium-tests.html', '/full-tests/reading/test-*.html', '/full-tests/listening/test-*.html', '/listening/index.html', '/premium-audio/*']
  .concat(String(process.env.PREMIUM_PATHS || '').split(',').map((p) => p.trim().toLowerCase()).filter(Boolean))
  .map((p) => new RegExp('^' + p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'));
const isPremiumPath = (p) => PREMIUM_PATHS.some((re) => re.test(p));

/* The session secret must be private. Locally one is generated once and kept in data/. */
let SESSION_SECRET = String(process.env.SESSION_SECRET || '');
if (!SESSION_SECRET && !IS_VERCEL) {
  try {
    const f = path.join(DATA_DIR, '.session-secret');
    fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(f)) SESSION_SECRET = fs.readFileSync(f, 'utf8').trim();
    if (!SESSION_SECRET) { SESSION_SECRET = crypto.randomBytes(48).toString('hex'); fs.writeFileSync(f, SESSION_SECRET, { mode: 0o600 }); }
  } catch (e) { SESSION_SECRET = crypto.randomBytes(48).toString('hex'); }
}

/* ───────────────────────── storage (local JSON or Supabase) ───────────────────────── */
function newId() { return crypto.randomUUID(); }

function loadDb() {
  try {
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    db.users = Array.isArray(db.users) ? db.users : [];
    for (const k of ['materials', 'results', 'orders', 'audit']) db[k] = Array.isArray(db[k]) ? db[k] : [];
    return db;
  } catch (e) { return { users: [], materials: [], results: [], orders: [], audit: [] }; }
}
function saveDb(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

async function sb(pathname, options = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    ...options,
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'return=representation', ...(options.headers || {}) }
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { /* not json */ }
  if (!r.ok) throw new Error((data && (data.message || data.hint)) || `Supabase error ${r.status}`);
  return data;
}
const eq = (v) => encodeURIComponent(String(v));
const jsonHeaders = { 'Content-Type': 'application/json' };

const store = {
  async listUsers() { return USE_SUPABASE ? ((await sb('ieltsx_users?select=*&order=createdAt.desc')) || []) : loadDb().users; },
  async findUserByEmail(email) {
    if (USE_SUPABASE) return ((await sb(`ieltsx_users?email=eq.${eq(email)}&limit=1`)) || [])[0] || null;
    return loadDb().users.find((u) => u.email === email) || null;
  },
  async findUserById(id) {
    if (!id) return null;
    if (USE_SUPABASE) return ((await sb(`ieltsx_users?id=eq.${eq(id)}&limit=1`)) || [])[0] || null;
    return loadDb().users.find((u) => u.id === id) || null;
  },
  async insertUser(u) {
    if (USE_SUPABASE) return ((await sb('ieltsx_users', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(u) })) || [])[0] || u;
    const db = loadDb(); db.users.push(u); saveDb(db); return u;
  },
  async updateUser(id, patch) {
    if (USE_SUPABASE) return ((await sb(`ieltsx_users?id=eq.${eq(id)}`, { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify(patch) })) || [])[0] || store.findUserById(id);
    const db = loadDb(); const u = db.users.find((x) => x.id === id);
    if (!u) return null; Object.assign(u, patch); saveDb(db); return u;
  },
  async deleteUser(id) {
    if (USE_SUPABASE) { await sb(`ieltsx_users?id=eq.${eq(id)}`, { method: 'DELETE' }); return true; }
    const db = loadDb(); const n = db.users.length; db.users = db.users.filter((u) => u.id !== id); saveDb(db); return db.users.length < n;
  },
  async listMaterials(type) {
    if (USE_SUPABASE) return (await sb(`ieltsx_materials?select=*${type ? `&type=eq.${eq(type)}` : ''}&order=createdAt.desc`)) || [];
    return loadDb().materials.filter((m) => !type || m.type === type);
  },
  async insertMaterial(m) {
    if (USE_SUPABASE) return ((await sb('ieltsx_materials', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(m) })) || [])[0] || m;
    const db = loadDb(); db.materials.unshift(m); saveDb(db); return m;
  },
  async updateMaterial(id, patch) {
    if (USE_SUPABASE) return ((await sb(`ieltsx_materials?id=eq.${eq(id)}`, { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify(patch) })) || [])[0] || null;
    const db = loadDb(); const m = db.materials.find((x) => x.id === id); if (!m) return null; Object.assign(m, patch); saveDb(db); return m;
  },
  async deleteMaterial(id) {
    if (USE_SUPABASE) { await sb(`ieltsx_materials?id=eq.${eq(id)}`, { method: 'DELETE' }); return true; }
    const db = loadDb(); const n = db.materials.length; db.materials = db.materials.filter((m) => m.id !== id); saveDb(db); return db.materials.length < n;
  },
  /* test results (one row per finished test) */
  async insertResult(r) {
    if (USE_SUPABASE) return ((await sb('ieltsx_results', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(r) })) || [])[0] || r;
    const db = loadDb(); db.results.unshift(r); db.results = db.results.slice(0, 20000); saveDb(db); return r;
  },
  async listAllResults(limit = 20000) {
    if (USE_SUPABASE) return (await sb(`ieltsx_results?select=*&order=createdAt.desc&limit=${limit}`)) || [];
    return loadDb().results.slice(0, limit);
  },
  async deleteResultsByUser(userId) {
    if (USE_SUPABASE) { await sb(`ieltsx_results?userId=eq.${eq(userId)}`, { method: 'DELETE' }); return true; }
    const db = loadDb(); db.results = db.results.filter((r) => r.userId !== userId); saveDb(db); return true;
  },
  async listResults(userId, limit = 500) {
    if (USE_SUPABASE) return (await sb(`ieltsx_results?userId=eq.${eq(userId)}&order=createdAt.desc&limit=${limit}`)) || [];
    return loadDb().results.filter((r) => r.userId === userId).slice(0, limit);
  },
  /* orders */
  async insertOrder(o) {
    if (USE_SUPABASE) return ((await sb('ieltsx_orders', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(o) })) || [])[0] || o;
    const db = loadDb(); db.orders.unshift(o); saveDb(db); return o;
  },
  async listOrders({ userId, status, limit = 200 } = {}) {
    if (USE_SUPABASE) return (await sb(`ieltsx_orders?select=*${userId ? `&userId=eq.${eq(userId)}` : ''}${status ? `&status=eq.${eq(status)}` : ''}&order=createdAt.desc&limit=${limit}`)) || [];
    return loadDb().orders.filter((o) => (!userId || o.userId === userId) && (!status || o.status === status)).slice(0, limit);
  },
  async findOrder(key) {
    if (USE_SUPABASE) return ((await sb(`ieltsx_orders?or=(id.eq.${eq(key)},ref.eq.${eq(key)})&limit=1`)) || [])[0] || null;
    return loadDb().orders.find((o) => o.id === key || o.ref === key) || null;
  },
  async updateOrder(id, patch) {
    if (USE_SUPABASE) return ((await sb(`ieltsx_orders?id=eq.${eq(id)}`, { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify(patch) })) || [])[0] || null;
    const db = loadDb(); const o = db.orders.find((x) => x.id === id); if (!o) return null; Object.assign(o, patch); saveDb(db); return o;
  },
  /* admin audit log */
  async insertAudit(a) {
    if (USE_SUPABASE) { await sb('ieltsx_audit', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(a) }); return a; }
    const db = loadDb(); db.audit.unshift(a); db.audit = db.audit.slice(0, 5000); saveDb(db); return a;
  },
  async listAudit(limit = 200) {
    if (USE_SUPABASE) return (await sb(`ieltsx_audit?order=createdAt.desc&limit=${limit}`)) || [];
    return loadDb().audit.slice(0, limit);
  }
};

/* ───────────────────────── passwords, sessions ───────────────────────── */
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return { salt, hash: crypto.scryptSync(String(password), salt, 64).toString('hex') };
}
function verifyPassword(password, salt, hash) {
  if (!salt || !hash) return false;
  try {
    const a = crypto.scryptSync(String(password), salt, 64);
    const b = Buffer.from(hash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch (e) { return false; }
}
const DUMMY = hashPassword('dummy-password-for-timing');

const sessionVersion = (u) => crypto.createHash('sha256').update(String(u.passwordHash || '') + String(u.id) + ':' + String(u.sessionEpoch || 0)).digest('hex').slice(0, 10);
function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return body + '.' + sig;
}
function readToken(token) {
  if (!token || !SESSION_SECRET) return null;
  const [body, sig] = String(token).split('.');
  if (!body || !sig) return null;
  const good = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest();
  let given; try { given = Buffer.from(sig, 'base64url'); } catch (e) { return null; }
  if (given.length !== good.length || !crypto.timingSafeEqual(given, good)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    return p && p.exp > Date.now() ? p : null;
  } catch (e) { return null; }
}
function purposeToken(purpose, payload, ttlMs) { return signToken({ ...payload, p: purpose, exp: Date.now() + ttlMs }); }
function readPurposeToken(token, purpose) { const t = readToken(token); return t && t.p === purpose ? t : null; }
function cookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    try { out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim()); } catch (e) { /* bad cookie */ }
  }
  return out;
}
function isHttps(req) {
  return !!(req.socket && req.socket.encrypted) || (TRUST_PROXY && String(req.headers['x-forwarded-proto'] || '').split(',')[0] === 'https');
}
function sessionCookie(req, user) {
  const token = signToken({ sub: user.id, sv: sessionVersion(user), iat: Date.now(), exp: Date.now() + SESSION_TTL_MS });
  return `ieltsx_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_MS / 1000}${isHttps(req) ? '; Secure' : ''}`;
}
const clearCookie = (req) => `ieltsx_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${isHttps(req) ? '; Secure' : ''}`;

async function currentUser(req) {
  const t = readToken(cookies(req).ieltsx_session);
  if (!t || t.p) return null;
  const u = await store.findUserById(t.sub);
  if (!u || t.sv !== sessionVersion(u)) return null;
  if (u.blocked && !isAdmin(u)) return null; // suspended accounts cannot use any session
  return syncAdminRole(u);
}

/* ───────────────────────── users, roles, premium ───────────────────────── */
function isAdmin(u) { return !!u && (u.role === 'admin' || ADMIN_EMAILS.has(u.email)); }
function isPremium(u) {
  if (!u) return false;
  if (isAdmin(u)) return true;
  return !!u.premiumActive && (!u.premiumExpiresAt || new Date(u.premiumExpiresAt) > new Date());
}
async function syncAdminRole(u) {
  if (ADMIN_EMAILS.has(u.email) && u.role !== 'admin') {
    return (await store.updateUser(u.id, { role: 'admin', plan: 'Admin', premiumActive: true, premiumExpiresAt: null })) || u;
  }
  return u;
}
function publicUser(u) {
  return {
    id: u.id, name: u.name, email: u.email, emailVerified: !!u.emailVerified,
    role: isAdmin(u) ? 'admin' : 'user', isAdmin: isAdmin(u),
    plan: isAdmin(u) ? 'Admin' : (isPremium(u) ? (u.plan || 'Premium') : 'Free'),
    premiumActive: isPremium(u), premiumExpiresAt: u.premiumExpiresAt || null, createdAt: u.createdAt
  };
}
function adminUser(u, stats) {
  const s = stats || {};
  return {
    ...publicUser(u), lastLoginAt: u.lastLoginAt || null, loginCount: u.loginCount || 0,
    blocked: !!u.blocked, blockedReason: u.blockedReason || '', note: u.note || '',
    hasPassword: !!u.passwordHash, testsCount: s.count || 0, avgBand: s.count ? Math.round((s.bandSum / s.count) * 10) / 10 : null, lastTestAt: s.last || null
  };
}
function resultStats(results) {
  const by = new Map();
  for (const r of results) {
    const s = by.get(r.userId) || { count: 0, bandSum: 0, last: null };
    s.count += 1; s.bandSum += Number(r.band) || 0; if (!s.last || r.createdAt > s.last) s.last = r.createdAt;
    by.set(r.userId, s);
  }
  return by;
}
const dayKey = (v) => new Date(v).toISOString().slice(0, 10);
function lastDays(n) { const out = []; for (let i = n - 1; i >= 0; i--) out.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)); return out; }
const csvCell = (v) => { let t = String(v ?? ''); if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; return /[",\n\r]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; }; // leading = + - @ neutralised (CSV injection)
const COMMON_PASSWORDS = new Set(['12345678', '123456789', '1234567890', '11111111', '00000000', 'password', 'password1', 'password12', 'password123', 'passw0rd', 'qwertyui', 'qwerty123', 'qwertyuiop', 'abc12345', 'iloveyou', 'admin123', 'letmein1', 'welcome1', '987654321', 'uzbekistan', 'ielts1234', 'ieltsx123']);
function checkPassword(password, email, name) {
  if (password.length < 8 || password.length > 200) throw new HttpError(400, 'Password must be 8-200 characters.');
  const low = password.toLowerCase();
  if (COMMON_PASSWORDS.has(low) || /^(.)\1+$/.test(password)) throw new HttpError(400, 'This password is too common. Choose a less predictable one.');
  const local = String(email || '').split('@')[0].toLowerCase();
  if ((local.length >= 4 && low.includes(local)) || low === String(email || '').toLowerCase()) throw new HttpError(400, 'Your password must not contain your e-mail address.');
  if (!/[a-zA-Z]/.test(password) || !/[0-9\W_]/.test(password)) throw new HttpError(400, 'Use letters and at least one number or symbol.');
}
const cleanName = (v) => String(v || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
const validEmail = (e) => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// remembers when somebody last signed in (never blocks a login if the column does not exist yet)
async function touchLogin(u) {
  try { return (await store.updateUser(u.id, { lastLoginAt: new Date().toISOString(), loginCount: (Number(u.loginCount) || 0) + 1 })) || u; }
  catch (e) { return u; }
}
async function createUser({ name, email, passwordHash = '', passwordSalt = '', emailVerified = false }) {
  const u = {
    emailVerified,
    id: newId(), name, email, role: ADMIN_EMAILS.has(email) ? 'admin' : 'user',
    plan: ADMIN_EMAILS.has(email) ? 'Admin' : 'Free', premiumActive: ADMIN_EMAILS.has(email),
    premiumExpiresAt: null, passwordHash, passwordSalt, createdAt: new Date().toISOString()
  };
  return store.insertUser(u);
}

/* ───────────────────────── mail, audit, premium grants ───────────────────────── */
function siteUrl(req) {
  if (PUBLIC_URL) return PUBLIC_URL;
  return `${isHttps(req) ? 'https' : 'http'}://${req.headers.host || 'localhost:' + PORT}`;
}
// Sends through Resend (https://resend.com) when RESEND_API_KEY + MAIL_FROM are set; otherwise prints the mail
// to the server console so the links can still be used while developing.
async function sendMail({ to, subject, text }) {
  if (RESEND_API_KEY && MAIL_FROM) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: MAIL_FROM, to: [to], subject, text })
    });
    if (!r.ok) throw new Error('Mail provider error ' + r.status);
    return true;
  }
  console.log(`\n[mail not configured] To: ${to}\nSubject: ${subject}\n${text}\n`);
  return false;
}
async function audit(actor, action, target, meta) {
  try { await store.insertAudit({ id: newId(), actorId: actor && actor.id, actorEmail: actor && actor.email, action, target: String(target || ''), meta: meta || {}, createdAt: new Date().toISOString() }); }
  catch (e) { console.error('audit failed:', e.message); }
}
async function grantPremium(user, planName, days) {
  const now = Date.now();
  const base = isPremium(user) && user.premiumExpiresAt && !isAdmin(user) ? Math.max(now, new Date(user.premiumExpiresAt).getTime()) : now;
  return store.updateUser(user.id, { premiumActive: true, plan: planName, premiumExpiresAt: days > 0 ? new Date(base + days * 86400000).toISOString() : null });
}
async function sendVerification(req, user) {
  const token = purposeToken('verify', { sub: user.id, em: user.email }, 7 * 86400000);
  return sendMail({ to: user.email, subject: 'Verify your IELTS X email', text: `Hi ${user.name},\n\nConfirm your email address:\n${siteUrl(req)}/verify.html?token=${encodeURIComponent(token)}\n\nThe link works for 7 days. If you did not create an account, ignore this message.` });
}
const planById = (id) => (PLANS.plans || []).find((x) => x.id === id);

/* ───────────────────────── helpers: http ───────────────────────── */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), geolocation=(), payment=(), usb=()',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Content-Security-Policy': "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'"
};
// admin pages may only load their own scripts/styles and talk to this server
const ADMIN_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'";
function send(res, status, data, headers = {}) {
  const isText = typeof data === 'string';
  res.writeHead(status, {
    'Content-Type': isText ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Cache-Control': 'no-store', ...SECURITY_HEADERS, ...headers
  });
  res.end(isText ? data : JSON.stringify(data));
}
function redirect(res, location) { res.writeHead(302, { Location: location, 'Cache-Control': 'no-store', ...SECURITY_HEADERS }); res.end(); }
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

function readBody(req, limit = 100 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', (c) => { size += c.length; if (size > limit) { reject(new HttpError(413, 'Request is too large.')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function readJson(req) {
  const buf = await readBody(req);
  if (!buf.length) return {};
  try { return JSON.parse(buf.toString('utf8')); } catch (e) { throw new HttpError(400, 'Invalid JSON.'); }
}
function clientIp(req) {
  if (TRUST_PROXY) { const f = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim(); if (f) return f; }
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

const attempts = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now(); let a = attempts.get(key);
  if (!a || a.reset < now) a = { count: 0, reset: now + windowMs };
  a.count += 1; attempts.set(key, a);
  if (a.count > max) throw new HttpError(429, 'Too many attempts. Please wait a few minutes and try again.');
}
function rateBlocked(key, max) { const a = attempts.get(key); return !!a && a.reset > Date.now() && a.count >= max; }
function rateHit(key, windowMs) { const now = Date.now(); let a = attempts.get(key); if (!a || a.reset < now) a = { count: 0, reset: now + windowMs }; a.count += 1; attempts.set(key, a); }
setInterval(() => { const n = Date.now(); for (const [k, v] of attempts) if (v.reset < n) attempts.delete(k); }, 60000).unref();

/* ───────────────────────── multipart upload (admin) ───────────────────────── */
const UPLOAD_TYPES = {
  reading: ['.html', '.htm', '.txt', '.pdf'],
  listening: ['.mp3', '.wav', '.m4a', '.ogg']
};
function parseMultipart(buf, contentType) {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || '');
  if (!m) throw new HttpError(400, 'Not a multipart upload.');
  const boundary = Buffer.from('--' + (m[1] || m[2]));
  const fields = {}; let file = null; let pos = buf.indexOf(boundary);
  while (pos !== -1) {
    pos += boundary.length;
    if (buf.slice(pos, pos + 2).toString() === '--') break;
    pos += 2; // CRLF
    const headEnd = buf.indexOf('\r\n\r\n', pos);
    if (headEnd === -1) break;
    const head = buf.slice(pos, headEnd).toString('utf8');
    const next = buf.indexOf(boundary, headEnd + 4);
    if (next === -1) break;
    const data = buf.slice(headEnd + 4, next - 2);
    const name = /name="([^"]*)"/i.exec(head); const fn = /filename="([^"]*)"/i.exec(head);
    if (name && fn) { if (fn[1]) file = { field: name[1], filename: fn[1], data }; }
    else if (name) fields[name[1]] = data.toString('utf8');
    pos = next;
  }
  return { fields, file };
}

/* ───────────────────────── API ───────────────────────── */
async function requireUser(req) {
  const u = await currentUser(req);
  if (!u) throw new HttpError(401, 'Please sign in.');
  return u;
}
async function requireAdmin(req) {
  const u = await requireUser(req);
  if (!isAdmin(u)) throw new HttpError(403, 'Admin access required.');
  return u;
}
async function verifyGoogleToken(idToken) {
  if (!GOOGLE_CLIENT_ID) throw new HttpError(501, 'Google sign-in is not configured.');
  const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken));
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.aud !== GOOGLE_CLIENT_ID || String(d.email_verified) !== 'true' || !d.email) throw new HttpError(401, 'Google sign-in failed.');
  return { email: normEmail(d.email), name: cleanName(d.name || d.given_name || d.email.split('@')[0]) };
}

async function api(req, res, url) {
  const p = url.pathname.replace(/\/+$/, '') || '/';
  const method = req.method;
  const secureHeaders = (u) => ({ 'Set-Cookie': sessionCookie(req, u) });

  if (method !== 'GET' && method !== 'HEAD' && req.headers.origin) {
    let ok = false;
    try { ok = new URL(req.headers.origin).host === req.headers.host || (PUBLIC_URL && req.headers.origin === PUBLIC_URL); } catch (e) { /* bad origin */ }
    if (!ok && !(p === '/api/payments/webhook')) throw new HttpError(403, 'Cross-site request blocked.');
  } else if (method !== 'GET' && method !== 'HEAD' && p !== '/api/payments/webhook') {
    const site = String(req.headers['sec-fetch-site'] || '');
    if (site && site !== 'same-origin' && site !== 'none') throw new HttpError(403, 'Cross-site request blocked.');
  }
  if (!SESSION_SECRET && p.startsWith('/api/auth') && method === 'POST') throw new HttpError(500, 'Server is missing SESSION_SECRET.');
  if (method === 'GET' && p === '/api/health') return send(res, 200, { ok: true, time: new Date().toISOString(), storage: USE_SUPABASE ? 'supabase' : 'file' });

  /* ---- auth ---- */
  if (method === 'GET' && p === '/api/auth/config') return send(res, 200, { googleClientId: GOOGLE_CLIENT_ID || null });

  if (method === 'POST' && p === '/api/auth/register') {
    rateLimit('reg:' + clientIp(req), 10, 15 * 60000);
    const b = await readJson(req);
    const email = normEmail(b.email), name = cleanName(b.name), password = String(b.password || '');
    if (!name) throw new HttpError(400, 'Please enter your name.');
    if (!validEmail(email)) throw new HttpError(400, 'Please enter a valid email address.');
    checkPassword(password, email, name);
    if (await store.findUserByEmail(email)) throw new HttpError(409, 'An account with this email already exists. Try signing in.');
    const hp = hashPassword(password);
    const u = await createUser({ name, email, passwordHash: hp.hash, passwordSalt: hp.salt });
    sendVerification(req, u).catch((e) => console.error('verification mail failed:', e.message));
    return send(res, 201, { user: publicUser(u) }, secureHeaders(u));
  }
  if (method === 'POST' && p === '/api/auth/login') {
    const b = await readJson(req); const email = normEmail(b.email);
    rateLimit('login:' + clientIp(req) + ':' + email, 8, 15 * 60000);
    if (rateBlocked('loginfail:' + email, 15)) throw new HttpError(429, 'Too many failed attempts for this account. Please wait 15 minutes or reset your password.');
    const found = await store.findUserByEmail(email);
    const ok = found ? verifyPassword(String(b.password || ''), found.passwordSalt, found.passwordHash) : (verifyPassword('x', DUMMY.salt, DUMMY.hash), false);
    if (!ok) { rateHit('loginfail:' + email, 15 * 60000); throw new HttpError(401, 'Incorrect email or password.'); }
    attempts.delete('loginfail:' + email);
    if (found.blocked && !isAdmin(found)) throw new HttpError(403, 'This account has been suspended. Please contact support.');
    const u = await touchLogin(await syncAdminRole(found));
    return send(res, 200, { user: publicUser(u) }, secureHeaders(u));
  }
  if (method === 'POST' && p === '/api/auth/google') {
    rateLimit('google:' + clientIp(req), 20, 15 * 60000);
    const b = await readJson(req);
    const g = await verifyGoogleToken(String(b.credential || ''));
    let u = await store.findUserByEmail(g.email);
    if (!u) u = await createUser({ name: g.name, email: g.email, emailVerified: true });
    else if (!u.emailVerified) u = (await store.updateUser(u.id, { emailVerified: true })) || u;
    if (u.blocked && !isAdmin(u)) throw new HttpError(403, 'This account has been suspended. Please contact support.');
    u = await touchLogin(await syncAdminRole(u));
    return send(res, 200, { user: publicUser(u) }, secureHeaders(u));
  }
  if (method === 'POST' && p === '/api/auth/logout') return send(res, 200, { ok: true }, { 'Set-Cookie': clearCookie(req) });
  if (method === 'GET' && p === '/api/auth/me') {
    const u = await currentUser(req);
    return send(res, 200, { user: u ? publicUser(u) : null });
  }
  if (method === 'POST' && p === '/api/auth/profile') {
    const u = await requireUser(req); const b = await readJson(req); const name = cleanName(b.name);
    if (!name) throw new HttpError(400, 'Please enter your name.');
    return send(res, 200, { user: publicUser(await store.updateUser(u.id, { name })) });
  }
  if (method === 'POST' && p === '/api/auth/password') {
    const u = await requireUser(req); const b = await readJson(req);
    rateLimit('pwd:' + u.id, 10, 15 * 60000);
    const next = String(b.newPassword || '');
    if (u.passwordHash && !verifyPassword(String(b.currentPassword || ''), u.passwordSalt, u.passwordHash)) throw new HttpError(401, 'Current password is incorrect.');
    checkPassword(next, u.email, u.name);
    const hp = hashPassword(next);
    const updated = await store.updateUser(u.id, { passwordHash: hp.hash, passwordSalt: hp.salt });
    return send(res, 200, { user: publicUser(updated) }, secureHeaders(updated)); // other devices are signed out
  }

  /* ---- forgot / reset password, verify email ---- */
  if (method === 'POST' && p === '/api/auth/forgot') {
    const email = normEmail((await readJson(req)).email);
    rateLimit('forgot:' + clientIp(req), 5, 15 * 60000);
    const u = validEmail(email) ? await store.findUserByEmail(email) : null;
    if (u) {
      const token = purposeToken('reset', { sub: u.id, sv: sessionVersion(u) }, 60 * 60000);
      sendMail({ to: u.email, subject: 'Reset your IELTS X password', text: `Hi ${u.name},\n\nChoose a new password:\n${siteUrl(req)}/reset.html?token=${encodeURIComponent(token)}\n\nThe link works for 1 hour and only once. If you did not ask for this, ignore this message.` })
        .catch((e) => console.error('reset mail failed:', e.message));
    }
    return send(res, 200, { ok: true }); // same answer whether or not the account exists
  }
  if (method === 'POST' && p === '/api/auth/reset') {
    rateLimit('reset:' + clientIp(req), 10, 15 * 60000);
    const b = await readJson(req); const t = readPurposeToken(String(b.token || ''), 'reset');
    const next = String(b.newPassword || '');
    if (next.length < 8 || next.length > 200) throw new HttpError(400, 'Password must be 8-200 characters.');
    const u = t ? await store.findUserById(t.sub) : null;
    if (!u || sessionVersion(u) !== t.sv) throw new HttpError(400, 'This reset link is invalid or has already been used. Request a new one.');
    checkPassword(next, u.email, u.name);
    const hp = hashPassword(next);
    const updated = await store.updateUser(u.id, { passwordHash: hp.hash, passwordSalt: hp.salt, emailVerified: true });
    return send(res, 200, { user: publicUser(updated) }, secureHeaders(updated));
  }
  if (method === 'POST' && p === '/api/auth/verify/send') {
    const u = await requireUser(req); rateLimit('vsend:' + u.id, 3, 60 * 60000);
    if (u.emailVerified) return send(res, 200, { ok: true, alreadyVerified: true });
    const sent = await sendVerification(req, u).catch(() => false);
    return send(res, 200, { ok: true, sent });
  }
  if (method === 'POST' && p === '/api/auth/verify') {
    rateLimit('verify:' + clientIp(req), 20, 15 * 60000);
    const t = readPurposeToken(String((await readJson(req)).token || ''), 'verify');
    const u = t ? await store.findUserById(t.sub) : null;
    if (!u || u.email !== t.em) throw new HttpError(400, 'This verification link is invalid or has expired.');
    if (!u.emailVerified) await store.updateUser(u.id, { emailVerified: true });
    return send(res, 200, { ok: true });
  }

  /* ---- test results + progress (per account, any device) ---- */
  if (p === '/api/results' && method === 'POST') {
    const u = await requireUser(req); rateLimit('result:' + u.id, 120, 60 * 60000);
    const b = await readJson(req);
    const testKey = String(b.testKey || '').slice(0, 200);
    const section = ['Reading', 'Listening', 'Writing', 'Speaking'].includes(b.section) ? b.section : null;
    const total = Math.floor(Number(b.scoreTotal)), correct = Math.floor(Number(b.scoreCorrect));
    if (!testKey.startsWith('/') || !section) throw new HttpError(400, 'testKey and section are required.');
    if (!(total >= 1 && total <= 1000) || !(correct >= 0 && correct <= total)) throw new HttpError(400, 'Invalid score.');
    let band = Number(b.band); if (!(band >= 0 && band <= 9)) band = Math.round((correct / total) * 90) / 10;
    const recent = (await store.listResults(u.id, 20)).find((r) => r.testKey === testKey && r.scoreCorrect === correct && r.scoreTotal === total && Date.now() - new Date(r.createdAt).getTime() < 60000);
    if (recent) return send(res, 200, { result: recent, duplicate: true });
    const row = await store.insertResult({ id: newId(), userId: u.id, testKey, section, bucket: b.bucket === 'Mock' ? 'Mock' : 'Practice', pageLabel: cleanName(b.pageLabel).slice(0, 120) || 'Practice test',
      scoreCorrect: correct, scoreTotal: total, band, durationSec: Math.max(0, Math.min(86400, Math.floor(Number(b.durationSec) || 0))), createdAt: new Date().toISOString() });
    return send(res, 201, { result: row });
  }
  if (p === '/api/results' && method === 'GET') {
    const u = await requireUser(req);
    return send(res, 200, { results: await store.listResults(u.id, 500) });
  }
  if (p === '/api/progress' && method === 'GET') {
    const u = await requireUser(req);
    return send(res, 200, { completed: [...new Set((await store.listResults(u.id, 1000)).map((r) => r.testKey))] });
  }

  /* ---- plans + orders (manual payment confirmed by an admin, or by a signed webhook) ---- */
  if (method === 'GET' && p === '/api/plans') return send(res, 200, { currency: PLANS.currency, months: PLANS.months, plans: PLANS.plans, contact: PAYMENT_CONTACT, instructions: PAYMENT_INSTRUCTIONS });
  if (p === '/api/orders' && method === 'POST') {
    const u = await requireUser(req); rateLimit('order:' + u.id, 10, 60 * 60000);
    const b = await readJson(req); const plan = planById(String(b.plan || '')); const months = Math.floor(Number(b.months));
    if (!plan || !plan.prices[String(months)]) throw new HttpError(400, 'Choose a plan and a duration.');
    const open = (await store.listOrders({ userId: u.id, status: 'pending', limit: 20 }));
    const same = open.find((o) => o.plan === plan.id && o.months === months);
    if (same) return send(res, 200, { order: same, payment: { contact: PAYMENT_CONTACT, instructions: PAYMENT_INSTRUCTIONS } });
    if (open.length >= 5) throw new HttpError(429, 'You already have several unpaid orders. Cancel or finish them first.');
    const ref = 'IX-' + crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
    const order = await store.insertOrder({ id: newId(), ref, userId: u.id, userEmail: u.email, plan: plan.id, planName: plan.name, months, amount: plan.prices[String(months)], currency: PLANS.currency, status: 'pending', createdAt: new Date().toISOString(), paidAt: null });
    return send(res, 201, { order, payment: { contact: PAYMENT_CONTACT, instructions: PAYMENT_INSTRUCTIONS } });
  }
  if (p === '/api/orders' && method === 'GET') {
    const u = await requireUser(req);
    return send(res, 200, { orders: await store.listOrders({ userId: u.id, limit: 20 }), contact: PAYMENT_CONTACT });
  }
  let om = p.match(/^\/api\/orders\/([^/]+)\/cancel$/);
  if (om && method === 'POST') {
    const u = await requireUser(req); const o = await store.findOrder(decodeURIComponent(om[1]));
    if (!o || o.userId !== u.id) throw new HttpError(404, 'Order not found.');
    if (o.status !== 'pending') throw new HttpError(400, 'Only unpaid orders can be cancelled.');
    return send(res, 200, { order: await store.updateOrder(o.id, { status: 'cancelled' }) });
  }
  if (method === 'POST' && p === '/api/payments/webhook') {
    if (!PAYMENT_WEBHOOK_SECRET) throw new HttpError(501, 'Payment webhook is not configured.');
    const raw = await readBody(req);
    const given = Buffer.from(String(req.headers['x-signature'] || ''), 'hex');
    const good = crypto.createHmac('sha256', PAYMENT_WEBHOOK_SECRET).update(raw).digest();
    if (given.length !== good.length || !crypto.timingSafeEqual(given, good)) throw new HttpError(401, 'Bad signature.');
    let b; try { b = JSON.parse(raw.toString('utf8')); } catch (e) { throw new HttpError(400, 'Invalid JSON.'); }
    const o = await store.findOrder(String(b.reference || b.orderId || ''));
    if (!o) throw new HttpError(404, 'Order not found.');
    if (b.status === 'paid' && o.status === 'pending') {
      if (b.amount !== undefined && Number(b.amount) < o.amount) throw new HttpError(400, 'Amount is lower than the order total.');
      const u = await store.findUserById(o.userId);
      if (u) await grantPremium(u, o.planName, o.months * 30);
      await store.updateOrder(o.id, { status: 'paid', paidAt: new Date().toISOString() });
      await audit({ email: 'webhook' }, 'order.paid', o.ref, { amount: o.amount });
    }
    return send(res, 200, { ok: true, status: (await store.findOrder(o.id)).status });
  }

  /* ---- premium ---- */
  if (method === 'GET' && p === '/api/premium/status') {
    const u = await currentUser(req);
    return send(res, 200, { authenticated: !!u, premium: isPremium(u), admin: isAdmin(u), expiresAt: u ? u.premiumExpiresAt || null : null, plan: u ? publicUser(u).plan : 'Free' });
  }

  /* ---- public materials (what admins added) ---- */
  if (method === 'GET' && p === '/api/materials') {
    const type = url.searchParams.get('type') || '';
    const u = await currentUser(req); const prem = isPremium(u);
    const items = (await store.listMaterials(type)).map((m) => ({ id: m.id, type: m.type, title: m.title, pack: m.pack, description: m.description, premium: !!m.premium, locked: !!m.premium && !prem, content: m.premium && !prem ? null : m.content }));
    return send(res, 200, { items });
  }

  /* ---- admin ---- */
  if (p.startsWith('/api/admin/')) {
    const admin = await requireAdmin(req);
    rateLimit('admin:' + admin.id, 600, 60000);
    if (method === 'GET' && p === '/api/admin/orders') return send(res, 200, { orders: await store.listOrders({ status: url.searchParams.get('status') || '', limit: 300 }) });
    let am = p.match(/^\/api\/admin\/orders\/([^/]+)\/(approve|reject)$/);
    if (am && method === 'POST') {
      const o = await store.findOrder(decodeURIComponent(am[1])); if (!o) throw new HttpError(404, 'Order not found.');
      if (o.status !== 'pending') throw new HttpError(400, 'This order is already ' + o.status + '.');
      if (am[2] === 'approve') {
        const u = await store.findUserById(o.userId); if (!u) throw new HttpError(404, 'The buyer account no longer exists.');
        const updatedUser = await grantPremium(u, o.planName, o.months * 30);
        const order = await store.updateOrder(o.id, { status: 'paid', paidAt: new Date().toISOString() });
        await audit(admin, 'order.approve', o.ref, { user: u.email, plan: o.planName, months: o.months });
        return send(res, 200, { order, user: publicUser(updatedUser) });
      }
      const order = await store.updateOrder(o.id, { status: 'rejected' });
      await audit(admin, 'order.reject', o.ref, { user: o.userEmail });
      return send(res, 200, { order });
    }
    if (method === 'GET' && p === '/api/admin/audit') return send(res, 200, { entries: await store.listAudit(Math.min(500, Number(url.searchParams.get('limit')) || 100)) });
    if (method === 'GET' && p === '/api/admin/users') {
      const [users, results] = await Promise.all([store.listUsers(), store.listAllResults()]);
      const st = resultStats(results);
      return send(res, 200, { users: users.map((u) => adminUser(u, st.get(u.id))), me: admin.id });
    }
    if (method === 'GET' && p === '/api/admin/users.csv') {
      const [users, results] = await Promise.all([store.listUsers(), store.listAllResults()]);
      const st = resultStats(results);
      const head = ['name', 'email', 'verified', 'plan', 'premium', 'premium_until', 'role', 'blocked', 'tests_taken', 'avg_band', 'last_login', 'joined'];
      const rows = users.map((u) => { const a = adminUser(u, st.get(u.id)); return [a.name, a.email, a.emailVerified ? 'yes' : 'no', a.plan, a.premiumActive ? 'yes' : 'no', a.premiumExpiresAt || '', a.role, a.blocked ? 'yes' : 'no', a.testsCount, a.avgBand ?? '', a.lastLoginAt || '', a.createdAt || '']; });
      await audit(admin, 'users.export', String(users.length));
      return send(res, 200, '\uFEFF' + [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n'),
        { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="ieltsx-users-${dayKey(Date.now())}.csv"` });
    }
    if (method === 'GET' && p === '/api/admin/results') {
      const sec = url.searchParams.get('section') || '';
      const [users, results] = await Promise.all([store.listUsers(), store.listAllResults(2000)]);
      const names = new Map(users.map((u) => [u.id, u]));
      const list = results.filter((r) => !sec || r.section === sec).slice(0, Math.min(300, Number(url.searchParams.get('limit')) || 100))
        .map((r) => ({ ...r, userName: (names.get(r.userId) || {}).name || 'Deleted user', userEmail: (names.get(r.userId) || {}).email || '' }));
      return send(res, 200, { results: list });
    }
    if (method === 'GET' && p === '/api/admin/stats') {
      const [users, results, orders] = await Promise.all([store.listUsers(), store.listAllResults(), store.listOrders({ limit: 5000 })]);
      const now = Date.now(), day = 86400000;
      const members = users.filter((u) => !isAdmin(u));
      const premium = members.filter(isPremium).length;
      const expiring = members.filter((u) => isPremium(u) && u.premiumExpiresAt && new Date(u.premiumExpiresAt).getTime() - now < 7 * day).length;
      const paid = orders.filter((o) => o.status === 'paid');
      const sum = (list) => list.reduce((a, o) => { a[o.currency || 'UZS'] = (a[o.currency || 'UZS'] || 0) + Number(o.amount || 0); return a; }, {});
      const days = lastDays(14);
      const count = (list, key) => days.map((d) => list.filter((x) => dayKey(x[key]) === d).length);
      const bySection = {}; let bandSum = 0;
      for (const r of results) { bySection[r.section] = (bySection[r.section] || 0) + 1; bandSum += Number(r.band) || 0; }
      return send(res, 200, { users: users.length, admins: users.filter(isAdmin).length, premium, free: members.length - premium,
        reading: (await store.listMaterials('reading')).length, listening: (await store.listMaterials('listening')).length,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        newUsers7: users.filter((u) => now - new Date(u.createdAt).getTime() < 7 * day).length,
        newUsers30: users.filter((u) => now - new Date(u.createdAt).getTime() < 30 * day).length,
        verified: users.filter((u) => u.emailVerified).length, blocked: users.filter((u) => u.blocked).length, expiringSoon: expiring,
        testsTotal: results.length, tests7: results.filter((r) => now - new Date(r.createdAt).getTime() < 7 * day).length,
        avgBand: results.length ? Math.round((bandSum / results.length) * 10) / 10 : null, bySection,
        revenue: sum(paid), revenue30: sum(paid.filter((o) => now - new Date(o.paidAt || o.createdAt).getTime() < 30 * day)),
        chart: { days, signups: count(users, 'createdAt'), tests: count(results, 'createdAt') } });
    }
    let dm = p.match(/^\/api\/admin\/users\/([^/]+)$/);
    if (dm && method === 'GET') {
      const u = await store.findUserById(decodeURIComponent(dm[1])); if (!u) throw new HttpError(404, 'User not found.');
      const results = await store.listResults(u.id, 1000);
      return send(res, 200, { user: adminUser(u, resultStats(results).get(u.id)), results: results.slice(0, 100), orders: await store.listOrders({ userId: u.id, limit: 50 }) });
    }
    dm = p.match(/^\/api\/admin\/users\/([^/]+)\/(block|note|logout-all)$/);
    if (dm && method === 'POST') {
      const u = await store.findUserById(decodeURIComponent(dm[1])); if (!u) throw new HttpError(404, 'User not found.');
      const b = await readJson(req);
      if (dm[2] === 'note') {
        const note = String(b.note || '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').slice(0, 500);
        await audit(admin, 'user.note', u.email);
        return send(res, 200, { user: adminUser(await store.updateUser(u.id, { note })) });
      }
      if (u.id === admin.id) throw new HttpError(400, 'You cannot do this to your own account.');
      if (isAdmin(u)) throw new HttpError(400, 'Remove the admin role first.');
      if (dm[2] === 'logout-all') {
        await audit(admin, 'user.logout_all', u.email);
        return send(res, 200, { user: adminUser(await store.updateUser(u.id, { sessionEpoch: (Number(u.sessionEpoch) || 0) + 1 })) });
      }
      const blocked = !!b.blocked; const reason = cleanName(b.reason).slice(0, 200);
      await audit(admin, blocked ? 'user.block' : 'user.unblock', u.email, reason ? { reason } : undefined);
      return send(res, 200, { user: adminUser(await store.updateUser(u.id, { blocked, blockedReason: blocked ? reason : '', sessionEpoch: (Number(u.sessionEpoch) || 0) + 1 })) });
    }
    let m = p.match(/^\/api\/admin\/users\/([^/]+)\/premium$/);
    if (m && method === 'POST') {
      const u = await store.findUserById(decodeURIComponent(m[1])); if (!u) throw new HttpError(404, 'User not found.');
      const b = await readJson(req); const days = Math.max(0, Math.min(3650, Math.floor(Number(b.days) || 0)));
      const plan = cleanName(b.plan) || 'Premium';
      // default: an active plan is extended (never shortened); {mode:'set'} restarts the clock from today
      const cur = isPremium(u) && !isAdmin(u) ? (u.premiumExpiresAt ? new Date(u.premiumExpiresAt).getTime() : Infinity) : 0;
      const keepLifetime = days > 0 && b.mode !== 'set' && cur === Infinity;
      const from = b.mode === 'set' ? Date.now() : Math.max(Date.now(), cur === Infinity ? 0 : cur);
      const updated = await store.updateUser(u.id, { premiumActive: true, plan, premiumExpiresAt: days > 0 && !keepLifetime ? new Date(from + days * 86400000).toISOString() : null });
      await audit(admin, 'premium.grant', u.email, { plan, days, mode: b.mode === 'set' ? 'set' : 'extend' });
      return send(res, 200, { user: adminUser(updated) });
    }
    if (m && method === 'DELETE') {
      const u = await store.findUserById(decodeURIComponent(m[1])); if (!u) throw new HttpError(404, 'User not found.');
      if (isAdmin(u)) throw new HttpError(400, 'Admins always have full access.');
      await audit(admin, 'premium.revoke', u.email);
      return send(res, 200, { user: adminUser(await store.updateUser(u.id, { premiumActive: false, plan: 'Free', premiumExpiresAt: null })) });
    }
    m = p.match(/^\/api\/admin\/users\/([^/]+)\/role$/);
    if (m && method === 'POST') {
      const u = await store.findUserById(decodeURIComponent(m[1])); if (!u) throw new HttpError(404, 'User not found.');
      const role = (await readJson(req)).role === 'admin' ? 'admin' : 'user';
      if (role === 'user') {
        if (u.id === admin.id) throw new HttpError(400, 'You cannot remove your own admin role.');
        if (ADMIN_EMAILS.has(u.email)) throw new HttpError(400, 'This account is listed in ADMIN_EMAILS. Remove it there first.');
        const admins = (await store.listUsers()).filter(isAdmin);
        if (admins.length <= 1) throw new HttpError(400, 'There must be at least one admin.');
      }
      const patch = role === 'admin' ? { role: 'admin', plan: 'Admin', premiumActive: true, premiumExpiresAt: null } : { role: 'user', plan: 'Free', premiumActive: false, premiumExpiresAt: null };
      await audit(admin, 'role.' + role, u.email);
      return send(res, 200, { user: publicUser(await store.updateUser(u.id, patch)) });
    }
    m = p.match(/^\/api\/admin\/users\/([^/]+)$/);
    if (m && method === 'DELETE') {
      const u = await store.findUserById(decodeURIComponent(m[1])); if (!u) throw new HttpError(404, 'User not found.');
      if (u.id === admin.id) throw new HttpError(400, 'You cannot delete your own account here.');
      await store.deleteResultsByUser(u.id);
      await store.deleteUser(u.id);
      await audit(admin, 'user.delete', u.email);
      return send(res, 200, { ok: true });
    }
    if (method === 'GET' && p === '/api/admin/materials') return send(res, 200, { items: await store.listMaterials(url.searchParams.get('type') || '') });
    if (method === 'POST' && p === '/api/admin/materials') {
      const b = await readJson(req); const type = b.type === 'listening' ? 'listening' : 'reading';
      const title = cleanName(b.title); if (!title) throw new HttpError(400, 'Title is required.');
      const item = await store.insertMaterial({ id: newId(), type, title, pack: cleanName(b.pack), description: String(b.description || '').slice(0, 2000), content: String(b.content || '').slice(0, 500), premium: !!b.premium, createdAt: new Date().toISOString() });
      await audit(admin, 'material.add', title, { type });
      return send(res, 201, { item });
    }
    m = p.match(/^\/api\/admin\/materials\/([^/]+)$/);
    if (m && method === 'PATCH') {
      const b = await readJson(req); const patch = {};
      if (b.title !== undefined) { patch.title = cleanName(b.title); if (!patch.title) throw new HttpError(400, 'Title is required.'); }
      if (b.pack !== undefined) patch.pack = cleanName(b.pack);
      if (b.description !== undefined) patch.description = String(b.description).slice(0, 2000);
      if (b.content !== undefined) patch.content = String(b.content).slice(0, 500);
      if (b.premium !== undefined) patch.premium = !!b.premium;
      const item = await store.updateMaterial(decodeURIComponent(m[1]), patch); if (!item) throw new HttpError(404, 'Material not found.');
      await audit(admin, 'material.edit', item.title, patch.premium !== undefined ? { premium: patch.premium } : undefined);
      return send(res, 200, { item });
    }
    if (m && method === 'DELETE') { await store.deleteMaterial(decodeURIComponent(m[1])); await audit(admin, 'material.delete', decodeURIComponent(m[1])); return send(res, 200, { ok: true }); }
    if (method === 'POST' && p === '/api/admin/uploads') {
      if (IS_VERCEL) throw new HttpError(501, 'File uploads need persistent storage. Run the server on a host with a disk (or add Supabase Storage).');
      const { fields, file } = parseMultipart(await readBody(req, MAX_UPLOAD_BYTES + 1024 * 1024), req.headers['content-type']);
      if (!file) throw new HttpError(400, 'No file uploaded.');
      const type = fields.type === 'listening' ? 'listening' : 'reading';
      const ext = path.extname(file.filename).toLowerCase();
      if (!UPLOAD_TYPES[type].includes(ext)) throw new HttpError(400, `Allowed ${type} files: ${UPLOAD_TYPES[type].join(', ')}`);
      if (file.data.length > MAX_UPLOAD_BYTES) throw new HttpError(413, 'File is too large (50 MB max).');
      const safe = path.basename(file.filename).replace(/[^a-zA-Z0-9._-]/g, '_');
      const dir = path.join(UPLOAD_DIR, type); fs.mkdirSync(dir, { recursive: true });
      const stored = Date.now() + '-' + safe; fs.writeFileSync(path.join(dir, stored), file.data);
      await audit(admin, 'upload', stored, { type });
      return send(res, 201, { ok: true, type, filename: stored, originalName: file.filename, url: '/uploads/' + type + '/' + encodeURIComponent(stored) });
    }
  }
  throw new HttpError(404, 'API endpoint not found.');
}

/* ───────────────────────── static files ───────────────────────── */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.map': 'application/json'
};
// never served: server code, data, docs, secrets, config
const BLOCKED_DIRS = new Set(['node_modules', 'data', 'api', 'scripts', '.git', '.vscode', '.github']);
const BLOCKED_FILES = new Set(['server.js', 'package.json', 'package-lock.json', 'vercel.json', 'supabase-schema.sql', '.env', '.env.example']);
function isBlocked(rel) {
  const parts = rel.split('/').filter(Boolean).map((s) => s.toLowerCase());
  if (!parts.length) return false;
  if (parts.some((s) => (s.startsWith('.') && s !== '.well-known') || BLOCKED_DIRS.has(s))) return true;
  const name = parts[parts.length - 1];
  if (BLOCKED_FILES.has(name) || /^(readme|license|changelog)/.test(name) || /\.(md|sql|env|log|bak|sh)$/.test(name)) return true;
  return !MIME[path.extname(name)];
}
// old links that still exist in saved pages -> the real file
const ALIASES = {
  '/home': '/index.html', '/features': '/index.html', '/teachers': '/index.html', '/vocabulary': '/index.html', '/support': '/index.html',
  '/privacy-policy': '/index.html', '/terms-of-service': '/index.html', '/feedback': '/index.html',
  '/login': '/login.html', '/account': '/account.html', '/pricing': '/Price.html', '/practice/mock': '/Mock tests.html',
  '/listening.html': '/part/practice/listening.html', '/reading.html': '/part/practice/reading.html', '/writing.html': '/part/practice/writing.html', '/speaking.html': '/part/practice/speaking.html',
  '/full-tests/reading.html': '/full-tests/reading/index.html', '/full-tests/listening.html': '/full-tests/listening/index.html',
  '/full-tests/writing.html': '/part/practice/writing.html', '/full-tests/speaking.html': '/part/practice/speaking.html',
  '/full reading.html': '/full-tests/reading/index.html', '/full listening.html': '/full-tests/listening/index.html',
  '/full writing.html': '/part/practice/writing.html', '/full speaking.html': '/part/practice/speaking.html',
  '/performance.html': '/study/Tools/Performance.html', '/pdf materials.html': '/study/Tools/Pdf materials.html', '/materials.html': '/study/Tools/Pdf materials.html', '/articles.html': '/study/Tools/Articles.html',
  '/study/tools/articles.html': '/study/Tools/Articles.html', '/study/tools/performance.html': '/study/Tools/Performance.html', '/study/tools/pdf materials.html': '/study/Tools/Pdf materials.html',
  // links that existed before the tests were numbered test-1, test-2, ... in listing order
  '/pessage6.html': '/pessages/test-3.html', '/pessage5.html': '/pessages/test-4.html', '/pessage4.html': '/pessages/test-5.html', '/pessage14.html': '/pessages/test-6.html',
  '/pessage16.html': '/pessages/test-7.html', '/pessage17.html': '/pessages/test-8.html', '/pessage18.html': '/pessages/test-9.html', '/pessage19.html': '/pessages/test-10.html',
  '/pessage20.html': '/pessages/test-11.html', '/pessage21.html': '/pessages/test-12.html', '/pessage22.html': '/pessages/test-13.html', '/pessage23.html': '/pessages/test-14.html',
  '/pessage24.html': '/pessages/test-15.html', '/pessage25.html': '/pessages/test-16.html',
  '/free/section-2/library-services': '/sections/test-2.html', '/free/section-3/recycling-discussion': '/sections/test-3.html', '/free/section-4/ancient-civilizations': '/sections/test-4.html',
  '/full_reading_test_8.html': '/full-tests/reading/test-1.html', '/full_reading_test_9.html': '/full-tests/reading/test-2.html', '/full_reading_test_11.html': '/full-tests/reading/test-3.html', '/full_reading_test_14.html': '/full-tests/reading/test-4.html',
  '/dark_chocolate_passage_2.html': '/pessages/test-19.html', '/growing_more_for_less_passsage_2.html': '/pessages/test-20.html', '/in_deep_water_p1_v3.html': '/pessages/test-21.html',
  '/admin': '/admin.html', '/admin-login.html': '/admin.html', '/admin/': '/admin/admin.html'
};
const aliasMap = new Map(Object.entries(ALIASES).map(([k, v]) => [k.toLowerCase(), v]));

function serveFile(req, res, file, extraHeaders = {}) {
  const st = fs.statSync(file); const ext = path.extname(file).toLowerCase();
  const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
  const hashed = /-[A-Za-z0-9_-]{8}\.(js|css|png|avif)$/.test(file) && file.includes(path.sep + 'assets' + path.sep);
  const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream', ETag: etag, 'Last-Modified': st.mtime.toUTCString(), 'Accept-Ranges': 'bytes',
    'Cache-Control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache', ...SECURITY_HEADERS, ...extraHeaders };
  if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers); return res.end(); }
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range && (range[1] || range[2])) {
    let start = range[1] ? parseInt(range[1], 10) : st.size - parseInt(range[2], 10);
    let end = range[1] && range[2] ? parseInt(range[2], 10) : st.size - 1;
    start = Math.max(0, start); end = Math.min(end, st.size - 1);
    if (start > end || start >= st.size) { res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }); return res.end(); }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Content-Length': end - start + 1 });
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...headers, 'Content-Length': st.size });
  return req.method === 'HEAD' ? res.end() : fs.createReadStream(file).pipe(res);
}
function notFound(req, res) {
  const page = path.join(ROOT, '404.html');
  if (fs.existsSync(page) && /text\/html/.test(String(req.headers.accept || ''))) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY_HEADERS });
    return res.end(fs.readFileSync(page));
  }
  return send(res, 404, 'Not found');
}

async function staticFile(req, res, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch (e) { return send(res, 400, 'Bad URL'); }
  if (decoded.includes('\0')) return send(res, 400, 'Bad URL');
  decoded = '/' + decoded.replace(/\\/g, '/').replace(/^\/+/, '');
  const lower = decoded.toLowerCase();

  // user uploads (served sandboxed so an uploaded page can never act as a signed-in user)
  if (lower.startsWith('/uploads/')) {
    const f = path.resolve(UPLOAD_DIR, decoded.slice('/uploads/'.length));
    if (!f.startsWith(path.resolve(UPLOAD_DIR) + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) return notFound(req, res);
    return serveFile(req, res, f, { 'Content-Security-Policy': 'sandbox allow-scripts allow-forms allow-popups' });
  }

  let target = aliasMap.get(lower) || decoded;
  if (target === '/') target = '/index.html';
  const probe = path.resolve(ROOT, '.' + target);          // /folder/ -> /folder/index.html (checked for blocking below)
  if ((probe === ROOT || probe.startsWith(ROOT + path.sep)) && fs.existsSync(probe) && fs.statSync(probe).isDirectory()) target = target.replace(/\/$/, '') + '/index.html';
  if (isBlocked(target)) return notFound(req, res);
  let file = path.resolve(ROOT, '.' + target);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return send(res, 403, 'Forbidden');
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) { file = path.join(file, 'index.html'); target = target.replace(/\/$/, '') + '/index.html'; }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    // saved pages ask for files like /auth-bridge.js from any folder: fall back to the real copy
    const name = path.basename(target).toLowerCase();
    const legacy = { 'filters.js': 'assets/filters.js', 'unlock-cards.js': 'assets/unlock-cards.js', 'unlock-cards.css': 'assets/unlock-cards.css' }[name];
    const alt = legacy ? path.join(ROOT, legacy) : path.join(ROOT, name);
    if (fs.existsSync(alt) && fs.statSync(alt).isFile() && !isBlocked('/' + path.relative(ROOT, alt).replace(/\\/g, '/'))) file = alt; else return notFound(req, res);
  }

  const tl = target.toLowerCase();
  const isHtml = tl.endsWith('.html');
  const needsAdmin = isHtml && (tl === '/admin.html' || tl.startsWith('/admin/'));
  const needsPremium = isPremiumPath(tl);
  if (needsAdmin || needsPremium) {
    const u = await currentUser(req);
    const next = encodeURIComponent(pathname);
    if (!isHtml) { // audio, files: no page to redirect to
      if (!u) return send(res, 401, { error: 'Please sign in.' });
      if (needsPremium && !isPremium(u)) return send(res, 403, { error: 'Premium required.' });
    }
    if (!u) return redirect(res, `/login.html?next=${next}`);
    if (needsAdmin && !isAdmin(u)) return redirect(res, '/index.html?admin=denied');
    if (needsPremium && !isPremium(u)) return redirect(res, `/Price.html?premium=required&next=${next}`);
  }
  const extra = needsAdmin ? { 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY', 'X-Robots-Tag': 'noindex, nofollow', 'Content-Security-Policy': ADMIN_CSP }
    : needsPremium ? { 'Cache-Control': 'no-store' } : {};
  return serveFile(req, res, file, extra);
}

/* ───────────────────────── sitemap (public pages only) ───────────────────────── */
function sitemap(origin) {
  const urls = new Set(['/index.html', '/Price.html', '/Predictions.html', '/part/practice/listening.html', '/part/practice/reading.html', '/part/practice/writing.html', '/part/practice/speaking.html',
    '/study/Tools/Articles.html', '/study/Tools/Performance.html', '/study/Tools/Pdf%20materials.html', '/full-tests/reading/', '/full-tests/listening/']);
  for (const dir of ['pessages', 'sections']) {
    try {
      for (const f of fs.readdirSync(path.join(ROOT, dir))) {
        if (!/^test-\d+\.html$/.test(f)) continue;
        const text = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
        if (text.length < 6000 && text.includes('being prepared')) continue; // not ready yet
        urls.add(`/${dir}/${f}`);
      }
    } catch (e) { /* folder missing */ }
  }
  const body = [...urls].map((u) => {
    let last = '';
    try { last = fs.statSync(path.join(ROOT, decodeURIComponent(u).replace(/\/$/, '/index.html'))).mtime.toISOString().slice(0, 10); } catch (e) { /* ignore */ }
    return `  <url><loc>${origin}${u}</loc>${last ? `<lastmod>${last}</lastmod>` : ''}</url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/* ───────────────────────── server ───────────────────────── */
const requestHandler = async (req, res) => {
  try {
    if (isHttps(req)) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname === '/robots.txt' || url.pathname === '/api/robots') {
      return send(res, 200, `User-agent: *\nDisallow: /admin\nDisallow: /api/\nDisallow: /account.html\nDisallow: /login.html\nDisallow: /uploads/\nAllow: /\n\nSitemap: ${siteUrl(req)}/sitemap.xml\n`, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' });
    }
    if (url.pathname === '/sitemap.xml' || url.pathname === '/api/sitemap') {
      return send(res, 200, sitemap(siteUrl(req)), { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' });
    }
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
    return await staticFile(req, res, url.pathname);
  } catch (e) {
    if (e instanceof HttpError) return send(res, e.status, { error: e.message });
    console.error(e);
    return send(res, 500, { error: 'Server error. Please try again.' });
  }
};

if (require.main === module) {
  if (!USE_SUPABASE) { try { fs.mkdirSync(DATA_DIR, { recursive: true }); if (!fs.existsSync(DB_FILE)) saveDb({ users: [], materials: [], results: [], orders: [], audit: [] }); } catch (e) { /* read-only disk */ } }
  http.createServer(requestHandler).listen(PORT, () => {
    console.log(`IELTSX server running at http://localhost:${PORT}`);
    console.log(ADMIN_EMAILS.size ? `Admins: ${[...ADMIN_EMAILS].join(', ')}` : 'No ADMIN_EMAILS set: register an account, then run  node scripts/make-admin.js <email>');
    if (!GOOGLE_CLIENT_ID) console.log('Google sign-in is off (set GOOGLE_CLIENT_ID to enable it).');
  });
}
module.exports = requestHandler;
module.exports.store = store;
module.exports.hashPassword = hashPassword;
