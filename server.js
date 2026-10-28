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
const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID || '765308680607-798gsgusqetuaa543vgjkcc63qg8a03t.apps.googleusercontent.com').trim();
const TRUST_PROXY = IS_VERCEL || process.env.TRUST_PROXY === '1';
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '');
const MAIL_FROM = String(process.env.MAIL_FROM || '');
const PUBLIC_URL = String(process.env.PUBLIC_URL || '').replace(/\/$/, '');
const PAYMENT_WEBHOOK_SECRET = String(process.env.PAYMENT_WEBHOOK_SECRET || '');
const PAYMENT_CONTACT = String(process.env.PAYMENT_CONTACT || 'https://t.me/sh7595');
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
// (the full test pages /full-tests/<skill>/test-N.html are decided by the Access rules below: admin panel -> Access)
const PREMIUM_PATHS = ['/mock tests.html', '/premium-tests.html', '/premium-audio/*']
  .concat(String(process.env.PREMIUM_PATHS || '').split(',').map((p) => p.trim().toLowerCase()).filter(Boolean))
  .map((p) => new RegExp('^' + p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'));
const isPremiumPath = (p) => PREMIUM_PATHS.some((re) => re.test(p));

/* The session secret must be private. Locally one is generated once and kept in data/. */
let SESSION_SECRET = String(process.env.SESSION_SECRET || '');
// On Vercel the disk is read-only, so SESSION_SECRET must be set there. If it was forgotten, derive a stable private
// secret from the Supabase service key instead of making every login fail with "Server is missing SESSION_SECRET".
if (!SESSION_SECRET && IS_VERCEL && USE_SUPABASE) {
  SESSION_SECRET = crypto.createHmac('sha256', 'ieltsx-session-secret-v1').update(SUPABASE_KEY).digest('hex');
}
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
    db.settings = db.settings && typeof db.settings === 'object' && !Array.isArray(db.settings) ? db.settings : {};
    return db;
  } catch (e) { return { users: [], materials: [], results: [], orders: [], audit: [], settings: {} }; }
}
function saveDb(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

async function sb(pathname, options = {}) {
  let r;
  try {
    r = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
      ...options,
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'return=representation', ...(options.headers || {}) }
    });
  } catch (e) {
    console.error('Supabase unreachable:', e.message);
    throw new HttpError(503, 'Cannot reach the database. Check SUPABASE_URL in the Vercel environment variables (it must look like https://xxxx.supabase.co).');
  }
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { /* not json */ }
  if (!r.ok) {
    const msg = (data && (data.message || data.hint || data.error_description)) || `Supabase error ${r.status}`;
    console.error('Supabase error:', r.status, msg);
    if (r.status === 401 || r.status === 403 || /invalid api key|jwt/i.test(msg)) throw new HttpError(503, 'The database refused the key. Use the service_role key (not the anon key) as SUPABASE_SERVICE_ROLE_KEY.');
    if (/column .* does not exist|could not find the .* column/i.test(msg)) throw new HttpError(503, 'The database is out of date (a column is missing). Run the whole supabase-schema.sql again in the Supabase SQL editor.');
    if (/relation .* does not exist|could not find the table|schema cache/i.test(msg)) throw new HttpError(503, 'The database tables are missing. Run supabase-schema.sql once in the Supabase SQL editor.');
    throw new HttpError(500, 'Database error: ' + String(msg).slice(0, 160));
  }
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
  async getMaterial(id) {
    if (USE_SUPABASE) return ((await sb(`ieltsx_materials?select=*&id=eq.${eq(id)}&limit=1`)) || [])[0] || null;
    return loadDb().materials.find((m) => m.id === id) || null;
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
  },
  /* small key/value settings (the lock / plan rules of the packs and tests) */
  async getSetting(key) {
    if (USE_SUPABASE) { const row = ((await sb(`ieltsx_settings?select=value&key=eq.${eq(key)}&limit=1`)) || [])[0]; return row ? row.value : null; }
    const v = loadDb().settings[key]; return v === undefined ? null : v;
  },
  async setSetting(key, value) {
    if (USE_SUPABASE) {
      await sb('ieltsx_settings?on_conflict=key', { method: 'POST', headers: { ...jsonHeaders, Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify({ key, value, updatedAt: new Date().toISOString() }) });
      return value;
    }
    const db = loadDb(); db.settings[key] = value; saveDb(db); return value;
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
const MAIL_READY = !!(RESEND_API_KEY && MAIL_FROM);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/* On Vercel the function may be frozen as soon as the answer is sent, so a mail is awaited (for at most `ms`) before answering */
const mailWithin = (work, ms = 6000) => Promise.race([work.catch((e) => { console.error('mail failed:', e.message); return false; }), sleep(ms).then(() => false)]);
async function sendMail({ to, subject, text }) {
  if (MAIL_READY) {
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
  await grantQuota(user, planName);
  const now = Date.now();
  const base = isPremium(user) && user.premiumExpiresAt && !isAdmin(user) ? Math.max(now, new Date(user.premiumExpiresAt).getTime()) : now;
  return store.updateUser(user.id, { premiumActive: true, plan: planName, premiumExpiresAt: days > 0 ? new Date(base + days * 86400000).toISOString() : null });
}
async function sendVerification(req, user) {
  const token = purposeToken('verify', { sub: user.id, em: user.email }, 7 * 86400000);
  return sendMail({ to: user.email, subject: 'Verify your IELTS X email', text: `Hi ${user.name},\n\nConfirm your email address:\n${siteUrl(req)}/verify.html?token=${encodeURIComponent(token)}\n\nThe link works for 7 days. If you did not create an account, ignore this message.` });
}
const planById = (id) => (PLANS.plans || []).find((x) => x.id === id);

/* ---- price control: plans.json holds the defaults, the admin panel (Price control) saves its own copy in settings ---- */
const DEFAULT_FEATURES = {
  standard: ['60+ Full Listening, Reading Tests', '60+ Full Writing, Speaking Tests', '6+ Full Mock Tests', '30+ AI essay check & feedback', 'Answer Explanations, Transcripts, Vocabularies', 'Performance Dashboard', 'Weakness Analysis', 'Weekly Articles List'],
  max: ['60+ Full Listening, Reading Tests', '60+ Full Writing, Speaking Tests', '9+ Mock Tests', 'Exclusive practice materials', '60+ AI essay evaluation & feedback', '100+ Reading Predictions', '30+ Listening Predictions', '100+ Writing Predictions', '30+ Speaking Predictions'],
  ultra: ['Everything in Max', 'Priority support']
};
const DEFAULT_OLD = { standard: { 1: 66000, 3: 198000, 6: 396000 }, max: { 1: 110000, 3: 330000, 6: 660000 }, ultra: {} };
const PLAN_NAMES = { standard: 'Standard', max: 'Max', ultra: 'Ultra' };
function defaultPricing() {
  const months = (PLANS.months && PLANS.months.length ? PLANS.months : [1, 3, 6]).map(Number);
  return {
    currency: 'UZS', usdRate: 0, months,
    contact: 'https://t.me/sh7595', instructions: PAYMENT_INSTRUCTIONS,
    plans: ['standard', 'max', 'ultra'].map((id) => {
      const src = planById(id) || { prices: {} };
      return { id, name: PLAN_NAMES[id], active: id !== 'ultra', recommended: id === 'max', tag: id === 'ultra' ? 'Tier 4 Access' : 'Tier 3 Access',
        prices: { ...(src.prices || {}) }, oldPrices: { ...(DEFAULT_OLD[id] || {}) }, testsLimit: 0, features: DEFAULT_FEATURES[id].slice() };
    })
  };
}
const cleanTelegram = (v, fallback) => { const m = String(v || '').trim().match(/^(?:https?:\/\/)?(?:t\.me\/|telegram\.me\/)?@?([A-Za-z0-9_]{4,32})\/?$/); return m ? 'https://t.me/' + m[1] : fallback; };
function normalizePricing(raw) {
  const def = defaultPricing(); const r = raw && typeof raw === 'object' ? raw : {};
  let months = Array.isArray(r.months) ? r.months.map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 36) : def.months;
  months = [...new Set(months)].sort((a, b) => a - b).slice(0, 6); if (!months.length) months = def.months;
  const money = (v) => { const n = Math.round(Number(v)); return Number.isFinite(n) && n > 0 && n < 1e10 ? n : 0; };
  const plans = def.plans.map((d) => {
    const p = (Array.isArray(r.plans) ? r.plans : []).find((x) => x && x.id === d.id);
    if (!p) { const o = { ...d, prices: {}, oldPrices: {} }; months.forEach((m) => { if (d.prices[m]) o.prices[m] = d.prices[m]; if (d.oldPrices[m]) o.oldPrices[m] = d.oldPrices[m]; }); return o; }
    const prices = {}, oldPrices = {};
    months.forEach((m) => { const a = money(p.prices && p.prices[m]); if (a) prices[m] = a; const b = money(p.oldPrices && p.oldPrices[m]); if (b && a && b > a) oldPrices[m] = b; });
    const features = (Array.isArray(p.features) ? p.features : d.features).map((f) => String(f || '').replace(/\s+/g, ' ').trim().slice(0, 120)).filter(Boolean).slice(0, 20);
    const lim = Math.floor(Number(p.testsLimit)); 
    return { id: d.id, name: d.name, active: p.active !== false && Object.keys(prices).length > 0 ? !!p.active : false, recommended: !!p.recommended,
      tag: String(p.tag === undefined ? d.tag : p.tag).trim().slice(0, 40), prices, oldPrices, testsLimit: Number.isFinite(lim) && lim > 0 ? Math.min(lim, 100000) : 0, features };
  });
  const usd = Number(r.usdRate);
  return { currency: 'UZS', usdRate: Number.isFinite(usd) && usd > 0 ? Math.min(Math.round(usd), 1e6) : 0, months, plans,
    contact: cleanTelegram(r.contact, def.contact), instructions: String(r.instructions === undefined ? def.instructions : r.instructions).trim().slice(0, 500) };
}
/* ---- site logo (admin panel -> Logo): kept in settings, every page swaps its built-in logo for it (assets/js/branding.js) ---- */
const cleanBranding = (b) => ({ logoUrl: cleanUrl(b && b.logoUrl), iconUrl: cleanUrl(b && b.iconUrl) });
async function getBranding() {
  let s = null; try { s = await store.getSetting('branding'); } catch (e) { /* no logo set */ }
  return { ...cleanBranding(s), updatedAt: (s && s.updatedAt) || '' };
}
async function getPricing() {
  let s = null; try { s = await store.getSetting('pricing-config'); } catch (e) { /* defaults */ }
  return normalizePricing(s && typeof s === 'object' ? s : null);
}
/* test allowance: a plan can include a limited number of premium tests (0 = no limit). The opened tests are remembered per user. */
async function grantQuota(user, planName) {
  try {
    const cfg = await getPricing(); const plan = cfg.plans.find((p) => p.name.toLowerCase() === String(planName || '').toLowerCase());
    const key = 'quota:' + user.id; const old = await store.getSetting(key).catch(() => null);
    if (!plan || !plan.testsLimit) { if (old && old.limit) await store.setSetting(key, { limit: 0, plan: String(planName || ''), keys: [], updatedAt: new Date().toISOString() }); return; }
    const keep = isPremium(user) && old && old.limit > 0 && old.plan === plan.name;
    await store.setSetting(key, { limit: (keep ? old.limit : 0) + plan.testsLimit, plan: plan.name, keys: keep && Array.isArray(old.keys) ? old.keys : [], updatedAt: new Date().toISOString() });
  } catch (e) { console.error('quota failed:', e.message); }
}
async function quotaBlocks(u, gate, tl) {      // true when this member already used up the tests of the plan
  if (!u || isAdmin(u) || !gate || !gate.locked) return false;
  let rec = null; try { rec = await store.getSetting('quota:' + u.id); } catch (e) { return false; }
  if (!rec || !(rec.limit > 0)) return false;
  const key = hrefPath(tl); const keys = Array.isArray(rec.keys) ? rec.keys : [];
  if (keys.includes(key)) return false;
  if (keys.length >= rec.limit) return true;
  rec.keys = keys.concat(key); rec.updatedAt = new Date().toISOString();
  try { await store.setSetting('quota:' + u.id, rec); } catch (e) { /* keep going */ }
  return false;
}

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
let SUPA_ORIGIN = ''; try { SUPA_ORIGIN = SUPABASE_URL ? new URL(SUPABASE_URL).origin : ''; } catch (e) { /* bad URL is reported by /api/health */ }
const ADMIN_CSP = `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https:; font-src 'self' data:; connect-src 'self' ${SUPA_ORIGIN}; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'`;
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
  // Vercel's Node runtime reads JSON bodies before the handler runs (req.body); the stream is then already finished.
  if (req.body !== undefined && req.body !== null) {
    if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
    if (typeof req.body === 'string') return Promise.resolve(Buffer.from(req.body));
    try { return Promise.resolve(Buffer.from(JSON.stringify(req.body))); } catch (e) { return Promise.reject(new HttpError(400, 'Invalid JSON.')); }
  }
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', (c) => { size += c.length; if (size > limit) { reject(new HttpError(413, 'Request is too large.')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function readJson(req, limit) {
  const buf = await readBody(req, limit);
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
const AUDIO_EXT = ['.mp3', '.wav', '.m4a', '.ogg', '.aac'];
const IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'];
const PDF_EXT = ['.pdf'];
const UPLOAD_TYPES = {
  reading: ['.html', '.htm', '.txt', '.pdf', ...IMAGE_EXT],
  listening: [...AUDIO_EXT, ...IMAGE_EXT],
  writing: [...IMAGE_EXT],
  audio: AUDIO_EXT,
  image: IMAGE_EXT,
  pdf: PDF_EXT
};
const MEDIA_BUCKET = 'ieltsx-media';
let bucketReady = false;
async function ensureBucket() {
  if (bucketReady) return;
  const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };
  /* No file_size_limit: asking for more than the project's global limit (50 MB on the free plan) makes Supabase refuse the bucket. */
  const r = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, { method: 'POST', headers: H, body: JSON.stringify({ id: MEDIA_BUCKET, name: MEDIA_BUCKET, public: true }) }).catch(() => null);
  if (!r) throw new HttpError(503, 'Cannot reach Supabase Storage. Check SUPABASE_URL.');
  if (r.ok || r.status === 409 || r.status === 400) { bucketReady = true; return; }   // 400/409 = already exists
  if (r.status === 401 || r.status === 403) throw new HttpError(503, 'Supabase Storage rejected the key. Use the service_role key in SUPABASE_SERVICE_ROLE_KEY (not the anon key).');
  const j = await r.json().catch(() => ({}));
  console.error('ensureBucket:', r.status, JSON.stringify(j).slice(0, 200));
  /* the bucket may exist already (made by hand in the dashboard): carry on, the signed-upload call below says if it really is missing */
}

/* ───────────────────────── tests created in the admin panel ───────────────────────── */
const MATERIAL_TYPES = ['reading', 'listening', 'writing', 'speaking', 'article', 'vocab', 'pdf'];
const Q_TYPES = ['short', 'completion', 'tfng', 'ynng', 'mcq', 'mcq-multi', 'matching', 'map', 'gap', 'box'];
const OPTION_TYPES = ['mcq', 'mcq-multi', 'matching', 'map', 'box'];
const cut = (v, n) => String(v == null ? '' : v).slice(0, n);
const cleanTitle = (v) => String(v || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 200);
const cleanList = (v, max, len) => (Array.isArray(v) ? v : String(v || '').split(',')).map((x) => cleanName(x).slice(0, len)).filter(Boolean).slice(0, max);
// a line graph drawn by the writing exam page (years along the bottom, one line per series)
function cleanChart(c) {
  if (!c || typeof c !== 'object') return null;
  const years = (Array.isArray(c.years) ? c.years : []).slice(0, 12).map((y) => cleanName(y).slice(0, 16)).filter(Boolean);
  const series = (Array.isArray(c.series) ? c.series : []).slice(0, 6).map((s) => ({
    name: cleanName(s && s.name).slice(0, 40),
    values: (Array.isArray(s && s.values) ? s.values : []).slice(0, years.length).map((x) => (Number.isFinite(Number(x)) ? Number(x) : 0))
  })).filter((s) => s.name && s.values.length === years.length);
  if (years.length < 2 || !series.length) return null;
  return { type: 'line', unit: cleanName(c.unit).slice(0, 40), years, series };
}
function cleanArticleData(d) {
  const day = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? String(v) : '');
  // older admin articles kept the cover in coverUrl and the level in passageLabel
  const level = d.level || d.passageLabel;
  return {
    topic: cleanName(d.topic).slice(0, 40), level: ['Passage 1', 'Passage 2', 'Passage 3'].includes(level) ? level : 'Passage 1',
    category: cleanName(d.category).slice(0, 60) || 'Academic Reading', lead: cut(d.lead, 600), author: cleanName(d.author), date: day(d.date), testDate: day(d.testDate),
    imageUrl: cleanUrl(d.imageUrl || d.coverUrl), imageAlt: cleanName(d.imageAlt), body: cut(d.body, 80000), source: cut(d.source, 600),
    vocabulary: (Array.isArray(d.vocabulary) ? d.vocabulary : []).slice(0, 80).map((v) => { v = v || {};
      return { word: cleanName(v.word), match: cut(v.match, 140), definition: cut(v.definition, 600), definition_uz: cut(v.definition_uz, 600), definition_ru: cut(v.definition_ru, 600),
        synonyms: cleanList(v.synonyms, 8, 60), example: cut(v.example, 600), sourceContext: cut(v.sourceContext, 800) };
    }).filter((v) => v.word),
    grammar: (Array.isArray(d.grammar) ? d.grammar : []).slice(0, 40).map((g) => { g = g || {};
      return { title: cut(g.title, 160).trim(), match: cut(g.match, 200), pattern: cut(g.pattern, 200), explanation: cut(g.explanation, 1200), explanation_uz: cut(g.explanation_uz, 1200),
        explanation_ru: cut(g.explanation_ru, 1200), example: cut(g.example, 600), sourceContext: cut(g.sourceContext, 800) };
    }).filter((g) => g.title)
  };
}
function cleanUrl(v) {
  const u = String(v || '').trim().slice(0, 1000);
  if (!u) return '';
  if (/^\/api\/media\/[A-Za-z0-9_-]{8,40}$/.test(u)) return u;   // a picture kept in the database (Vercel without Storage)
  if (/^\/(uploads|assets)\//.test(u) && !u.includes('..')) return u;
  if (/^https:\/\/[^\s"'<>]+$/i.test(u)) return u;
  return '';
}
/* Reading tests get a stable number (test-22, test-23 ... for Part; test-7, test-8 ... for Full) that continues the hand-made pages. */
async function keepReadingNo(type, data, cur) {
  if (type === 'listening') {   // Listening tests get test-5, test-6 ... after the four hand-made /sections/test-N pages
    const L = require('./listening-router');
    if (cur && cur.data && Number(cur.data.no)) { data.no = Number(cur.data.no); return data; }
    data.no = L.nextNumber(ROOT, (await store.listMaterials('listening')).filter((x) => !cur || x.id !== cur.id));
    return data;
  }
  if (type !== 'reading') return data;
  const R = require('./reading-router'); const kind = R.kindOf({ data });
  if (cur && cur.data && Number(cur.data.no) && R.kindOf(cur) === kind) { data.no = Number(cur.data.no); return data; }
  data.no = R.nextNumber(ROOT, kind, (await store.listMaterials('reading')).filter((x) => !cur || x.id !== cur.id));
  return data;
}
function cleanMaterialData(type, d) {
  d = d && typeof d === 'object' ? d : {};
  if (type === 'article') return cleanArticleData(d);   // text, cover, vocabulary and grammar (the article reader at /collections/article)
  const out = { durationMin: Math.max(0, Math.min(300, Math.floor(Number(d.durationMin) || 0))), instructions: cut(d.instructions, 3000) };
  out.images = (Array.isArray(d.images) ? d.images : []).slice(0, 12).map((i) => ({ url: cleanUrl(i && i.url), caption: cut(i && i.caption, 200), passage: [1, 2, 3].includes(Number(i && i.passage)) ? Number(i.passage) : 1 })).filter((i) => i.url);
  if (type === 'reading') {
    // Reading comes in two formats: "part" = one passage (like pessages/test-19), "full" = three passages (like full-tests/reading/test-1)
    out.mode = d.mode === 'full' ? 'full' : 'part';
    out.passage = out.mode === 'full' ? '' : cut(d.passage, 60000);
    if (out.mode === 'full') out.passages = [0, 1, 2].map((i) => { const x = (Array.isArray(d.passages) ? d.passages[i] : null) || {}; return { title: cut(x.title, 200).trim(), passage: cut(x.passage, 60000) }; });
    out.no = Math.max(0, Math.floor(Number(d.no) || 0));
    // the card on the Reading practice page: picture, "Passage 1/2/3" tag, question-type chips (empty = taken from the questions)
    out.coverUrl = cleanUrl(d.coverUrl);
    out.passageLabel = ['Passage 1', 'Passage 2', 'Passage 3'].includes(d.passageLabel) ? d.passageLabel : 'Passage 1';
    out.cardTypes = (Array.isArray(d.cardTypes) ? d.cardTypes : String(d.cardTypes || '').split(/[,\n]/)).slice(0, 8).map((x) => cut(x, 40).trim()).filter(Boolean);   // the test-N number; the server sets it, see keepReadingNo()
  }
  if (type === 'listening') {
    out.audioUrl = cleanUrl(d.audioUrl); out.transcript = cut(d.transcript, 60000);
    // the part of a longer recording this test uses (seconds; 0/0 = the whole file), and the test-N number (set by keepReadingNo)
    out.audioStart = Math.max(0, Math.min(36000, Math.floor(Number(d.audioStart) || 0))); out.audioEnd = Math.max(0, Math.min(36000, Math.floor(Number(d.audioEnd) || 0)));
    out.no = Math.max(0, Math.floor(Number(d.no) || 0));
    // the card on the Listening practice page: picture, "Section N" tag, question-type chips (empty = taken from the questions)
    out.coverUrl = cleanUrl(d.coverUrl);
    out.sectionLabel = ['Section 1', 'Section 2', 'Section 3', 'Section 4'].includes(d.sectionLabel) ? d.sectionLabel : 'Section 1';
    out.cardTypes = (Array.isArray(d.cardTypes) ? d.cardTypes : String(d.cardTypes || '').split(/[,\n]/)).slice(0, 8).map((x) => cut(x, 40).trim()).filter(Boolean);
  }
  if (type === 'writing') {   // the card on the Writing practice page: picture (empty = the picture of Task 1), tier tag and type chip
    out.coverUrl = cleanUrl(d.coverUrl); out.tier = cut(d.tier, 20).trim() || 'Tier 1'; out.cardTypes = (Array.isArray(d.cardTypes) ? d.cardTypes : String(d.cardTypes || '').split(/[,\n]/)).slice(0, 4).map((x) => cut(x, 40).trim()).filter(Boolean);
  }
  if (type === 'pdf') {       // a downloadable PDF with its own card on the PDF Library page
    out.fileUrl = cleanUrl(d.fileUrl); out.coverUrl = cleanUrl(d.coverUrl);
    out.category = ['reading', 'listening', 'writing', 'speaking', 'magazine', 'other'].includes(d.category) ? d.category : 'reading';
    out.badge = cut(d.badge, 30).trim(); out.corner = cut(d.corner, 30).trim(); out.pages = Math.max(0, Math.min(5000, Math.floor(Number(d.pages) || 0)));
    out.tags = (Array.isArray(d.tags) ? d.tags : String(d.tags || '').split(/[,\n]/)).slice(0, 6).map((x) => cut(x, 40).trim()).filter(Boolean);
    delete out.images; delete out.instructions; delete out.durationMin;
  }
  if (type === 'reading' || type === 'listening') {
    out.questions = (Array.isArray(d.questions) ? d.questions : []).slice(0, 120).map((q, i) => {
      q = q || {}; const t = Q_TYPES.includes(q.type) ? q.type : (type === 'listening' ? 'gap' : 'short');
      return { id: 'q' + (i + 1), type: t, title: type === 'listening' ? cut(q.title, 200) : undefined, blockTitle: type === 'listening' ? cut(q.blockTitle, 200) : undefined, passage: [1, 2, 3].includes(Number(q.passage)) ? Number(q.passage) : 1, gi: (q.gi === undefined || q.gi === null || q.gi === '' || !Number.isFinite(Number(q.gi))) ? undefined : Math.max(0, Math.min(999, Math.floor(Number(q.gi)))), group: cut(q.group, 300), prompt: cut(q.prompt, 1000),
        options: OPTION_TYPES.includes(t) ? (Array.isArray(q.options) ? q.options : []).slice(0, 20).map((o) => cut(o, 300)).filter(Boolean) : [],
        answer: cut(q.answer, 300), explanation: cut(q.explanation, 1500), evidence: type === 'reading' ? (cut(q.evidence, 600) || undefined) : undefined };
    }).filter((q) => q.prompt);
  }
  if (type === 'vocab') {
    // a vocabulary collection (or a "study by test" word list): kind, level, source and the cards themselves
    out.kind = d.kind === 'test' ? 'test' : 'collection';
    out.level = cut(d.level, 40) || 'Intermediate';
    out.source = cut(d.source, 120);
    out.icon = d.icon === 'listening' ? 'listening' : 'reading';
    const list = (v) => (Array.isArray(v) ? v : String(v || '').split(/[,;]/)).slice(0, 12).map((x) => cut(x, 60).trim()).filter(Boolean);
    const seen = new Set();
    out.words = (Array.isArray(d.words) ? d.words : []).slice(0, 2000).map((w) => { w = w || {};
      return { word: cut(w.word, 80).trim(), pos: cut(w.pos, 30).trim(), definition: cut(w.definition, 600).trim(), example: cut(w.example, 600).trim(), synonyms: list(w.synonyms), opposites: list(w.opposites) };
    }).filter((w) => { const k = w.word.toLowerCase(); if (!w.word || !w.definition || seen.has(k)) return false; seen.add(k); return true; });
    delete out.images; delete out.instructions; delete out.durationMin;
  }
  if (type === 'speaking') {
    // Speaking: Part 1 (questions), Part 2 (cue card), Part 3 (discussion). Optional model-answer audio / text.
    out.parts = (Array.isArray(d.parts) ? d.parts : []).slice(0, 3).map((t, i) => { t = t || {};
      const qs = (Array.isArray(t.questions) ? t.questions : String(t.questions || '').split('\n')).slice(0, 40).map((x) => cut(x, 400).trim()).filter(Boolean);
      return { id: 'p' + (i + 1), title: cut(t.title, 120) || 'Part ' + (i + 1), prompt: cut(t.prompt, 2000), questions: qs, imageUrl: cleanUrl(t.imageUrl), audioUrl: cleanUrl(t.audioUrl),
        prepSeconds: Math.max(0, Math.min(600, Math.floor(Number(t.prepSeconds) || 0))), speakSeconds: Math.max(0, Math.min(1200, Math.floor(Number(t.speakSeconds) || 0))), sample: cut(t.sample, 8000) };
    }).filter((t) => t.prompt || t.questions.length || t.imageUrl);
  }
  if (type === 'writing') {
    out.tasks = (Array.isArray(d.tasks) ? d.tasks : []).slice(0, 4).map((t, i) => { t = t || {};
      return { id: 't' + (i + 1), title: cut(t.title, 120) || 'Task ' + (i + 1), kind: ['task1', 'task2'].includes(t.kind) ? t.kind : (i === 0 ? 'task1' : 'task2'),
        prompt: cut(t.prompt, 4000), imageUrl: cleanUrl(t.imageUrl), chart: cleanChart(t.chart),
        minWords: Math.max(0, Math.min(1000, Math.floor(Number(t.minWords) || 0))), minutes: Math.max(0, Math.min(180, Math.floor(Number(t.minutes) || 0))), sample: cut(t.sample, 8000) };
    }).filter((t) => t.prompt || t.imageUrl || t.chart);
  }
  return out;
}
const READING_BANDS = [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
const LISTENING_BANDS = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
function bandFor(type, correct, total) {
  const raw40 = total ? Math.round((correct / total) * 40) : 0;
  const hit = (type === 'listening' ? LISTENING_BANDS : READING_BANDS).find(([min]) => raw40 >= min);
  return hit ? hit[1] : (raw40 >= 2 ? 2 : raw40 >= 1 ? 1 : 0);
}
const norm = (v) => String(v == null ? '' : v).toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[^\p{L}\p{N}\s'/-]+/gu, ' ').replace(/\s+/g, ' ').trim();
function isCorrect(q, given) {
  const g = norm(given); if (!g) return false;
  if (q.type === 'tfng' || q.type === 'ynng') {
    const map = { t: 'true', f: 'false', y: 'yes', n: 'no', ng: 'not given', 'not given': 'not given', notgiven: 'not given' };
    return (map[g] || g) === (map[norm(q.answer)] || norm(q.answer));
  }
  if (q.type === 'mcq') return g.charAt(0) === norm(q.answer).charAt(0);
  if (q.type === 'matching' || q.type === 'map') { const tok = (v) => (norm(v).match(/^[a-z0-9]+/) || [''])[0]; return tok(given) === tok(q.answer); }
  if (q.type === 'mcq-multi') { const set = (v) => String(v || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).sort().join(','); return set(given) === set(q.answer); }
  return String(q.answer || '').split('|').some((a) => { const n = norm(a); return n && n === g; });
}
/* the question-type chips of a card: what the admin typed, or taken from the questions */
function cardTypesOf(d) {
  if (Array.isArray(d.cardTypes) && d.cardTypes.length) return d.cardTypes;
  const L = { short: 'Sentence Completion', completion: 'Completion', tfng: 'True False Not Given', ynng: 'Yes No Not Given', mcq: 'Multiple Choice', 'mcq-multi': 'Multiple Choice', map: 'Map Labelling', gap: 'Completion', box: 'Word Box Completion' };
  const out = [];
  for (const q of require('./reading-exam').inheritGroups(d.questions)) {
    let t = L[q.type];
    if (q.type === 'matching') t = (q.options || []).length && (q.options || []).every((o) => /^\s*(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)[.)]/i.test(o)) ? 'Matching Headings' : 'Matching Information';
    if (t && !out.includes(t)) out.push(t);
  }
  return out.slice(0, 6);
}
const publicMaterial = (m, withData) => {
  const d = m.data || {};
  const base = { id: m.id, type: m.type, title: m.title, pack: m.pack || '', description: m.description || '', premium: !!m.premium, published: m.published !== false, createdAt: m.createdAt,
    questionCount: (d.questions || []).length, durationMin: d.durationMin || 0, hasAudio: !!d.audioUrl, tasks: (d.tasks || []).length, parts: (d.parts || []).length };
  if (m.type === 'reading') { base.mode = d.mode === 'full' ? 'full' : 'part'; base.no = Number(d.no) || 0; base.href = require('./reading-router').hrefFor(m); base.coverUrl = d.coverUrl || ''; base.passageLabel = d.passageLabel || 'Passage 1'; base.types = cardTypesOf(d); }
  if (m.type === 'listening') { base.no = Number(d.no) || 0; base.href = require('./listening-router').hrefFor(m); base.coverUrl = d.coverUrl || ''; base.sectionLabel = d.sectionLabel || 'Section 1'; base.types = cardTypesOf(d); }
  if (m.type === 'writing') { const ts = d.tasks || []; base.coverUrl = d.coverUrl || (ts.find((t) => t.imageUrl) || {}).imageUrl || ''; base.tier = d.tier || 'Tier 1'; base.types = d.cardTypes || [];
    base.taskLabel = ts.length > 1 ? 'Task 1 & 2' : ((ts[0] && ts[0].title) || 'Task 1'); base.href = '/writing/?id=' + encodeURIComponent(m.id); }
  if (m.type === 'pdf') Object.assign(base, { coverUrl: d.coverUrl || '', category: d.category || 'reading', badge: d.badge || '', corner: d.corner || '', pages: d.pages || 0, tags: d.tags || [] });
  if (m.type === 'article') {   // older admin articles kept the cover in coverUrl and the level in passageLabel
    const imageUrl = d.imageUrl || d.coverUrl || '', level = d.level || d.passageLabel || '';
    Object.assign(base, { topic: d.topic || '', level, imageUrl, lead: d.lead || '', date: d.date || '', href: '/collections/article?id=' + encodeURIComponent(m.id),
      vocabCount: (d.vocabulary || []).length, grammarCount: (d.grammar || []).length });
    return withData ? { ...base, data: { ...d, imageUrl, level } } : base;
  }
  if (m.type === 'vocab') {   // the list never carries the cards; they are sent only by the single-item call, after the Premium check
    base.wordCount = (d.words || []).length; base.kind = d.kind || 'collection'; base.level = d.level || 'Intermediate'; base.source = d.source || ''; base.icon = d.icon || 'reading';
    return withData ? { ...base, data: { kind: base.kind, level: base.level, source: base.source, icon: base.icon, words: d.words || [] } } : base;
  }
  if (!withData) return base;
  return { ...base, data: { ...d, questions: (d.questions || []).map(({ answer, explanation, evidence, ...q }) => q), transcript: undefined,
    tasks: (d.tasks || []).map(({ sample, ...t }) => ({ ...t, hasSample: !!sample })), parts: (d.parts || []).map(({ sample, ...t }) => ({ ...t, hasSample: !!sample })) } };
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
  if (!idToken) throw new HttpError(400, 'Google did not send a sign-in token. Please try again.');
  let r, d;
  try {
    r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken));
    d = await r.json().catch(() => ({}));
  } catch (e) {
    console.error('Google tokeninfo unreachable:', e.message);
    throw new HttpError(503, 'Could not reach Google to confirm the sign-in. Please try again in a moment.');
  }
  if (!r.ok) throw new HttpError(401, 'The Google sign-in expired or is invalid. Please try again.');
  if (d.aud !== GOOGLE_CLIENT_ID) {
    console.error('Google client id mismatch. Token aud:', d.aud, '| server GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
    throw new HttpError(401, 'Google Client ID does not match the server setting. Set GOOGLE_CLIENT_ID in Vercel to the same Client ID that the login page uses, then redeploy.');
  }
  if (String(d.email_verified) !== 'true' || !d.email) throw new HttpError(401, 'This Google account has no verified email address.');
  return { email: normEmail(d.email), name: cleanName(d.name || d.given_name || d.email.split('@')[0]) };
}

/* ───────────────────────── access rules: free / locked + plan for every pack and test ─────────────────────────
 * The catalog (assets/js/full-tests-data.js) says what is locked by default. The admin panel (Access) stores overrides:
 *   rules['pack:<skill>/<slug>']            a whole pack (its tests inherit it unless they have their own rule)
 *   rules['test:<skill>/<slug>/<id>']       one test of the catalog
 *   rules['mat:<materialId>']               a test that was made in the admin panel
 * A rule is { locked: false }  (free for everybody)  or  { locked: true, plan: 'standard' | 'max' }.
 * Levels: Demo/Free 0, Standard 1, Max 2, Ultra 3 (Admin 3; any other paid plan name, e.g. "Premium", counts as Max so nobody loses access).
 */
const vm = require('vm');
const PLAN_ORDER = { standard: 1, max: 2, ultra: 3 };
const SKILL_LIST = ['reading', 'listening', 'writing', 'speaking', 'article'];
const planOf = (v) => { const s = String(v || '').toLowerCase(); return s.includes('ultra') ? 'ultra' : s.includes('max') ? 'max' : (s.includes('standard') ? 'standard' : ''); };
const slugOf = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9_]+/g, '-').replace(/^-+|-+$/g, '');
const hrefPath = (h) => String(h || '').split(/[?#]/)[0].replace(/\/+$/, '').replace(/\.html$/i, '').toLowerCase();
function userLevel(u) {
  if (!u) return 0;
  if (isAdmin(u)) return 3;
  if (!isPremium(u)) return 0;
  const n = String(u.plan || '').toLowerCase();
  if (/ultra/.test(n)) return 3;
  return /standard/.test(n) && !/max/.test(n) ? 1 : 2;
}
const levelName = (l) => (l >= 3 ? 'ultra' : l === 2 ? 'max' : l === 1 ? 'standard' : 'free');
const levelNeeded = (r) => (r.locked ? PLAN_ORDER[r.plan] || 1 : 0);
const allowsLevel = (r, level) => level >= levelNeeded(r);
function effectiveRule(own, parent, def) {
  const has = (r) => r && typeof r === 'object';
  const locked = has(own) && typeof own.locked === 'boolean' ? own.locked : (has(parent) && typeof parent.locked === 'boolean' ? parent.locked : !!def.locked);
  const plan = has(own) && PLAN_ORDER[own.plan] ? own.plan : (has(parent) && PLAN_ORDER[parent.plan] ? parent.plan : (def.plan || 'standard'));
  return { locked, plan };
}
const modeOf = (own) => (!own || typeof own !== 'object' ? 'default' : own.locked === false ? 'free' : (PLAN_ORDER[own.plan] ? own.plan : 'default'));
const ruleFromMode = (mode) => (mode === 'free' ? { locked: false } : (PLAN_ORDER[mode] ? { locked: true, plan: mode } : null));

let CATALOG = null;
function loadCatalog() {
  if (CATALOG) return CATALOG;
  const skills = [];
  try {
    const ctx = { window: {} }; vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets', 'js', 'full-tests-data.js'), 'utf8'), ctx, { timeout: 2000 });
    const D = ctx.window.IELTSX_FULL_TESTS || { packs: {}, skills: {} };
    let PRACTICE = {};
    try { const c2 = { window: {} }; vm.createContext(c2); vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets', 'js', 'practice-cards.js'), 'utf8'), c2, { timeout: 2000 }); PRACTICE = c2.window.IELTSX_PRACTICE || {}; }
    catch (e) { console.warn('practice-cards.js could not be read:', e.message); }
    for (const skill of SKILL_LIST) {
      const packs = ((D.packs || {})[skill] || []).map((p) => {
        const def = { locked: !!p.premium, plan: planOf(p.minPlan) || 'standard' };   // the old "MAX" label is only a label; access follows minPlan (default: any paid plan)
        const seen = {};
        const tests = (p.tests || []).map((t, i) => ({ t, i })).sort((a, b) => ((a.t.number || 0) - (b.t.number || 0)) || (a.i - b.i)).map((x, n) => {
          const t = x.t;
          let id = t.number != null ? String(t.number) : slugOf(String(t.href || '').split(/[?#]/)[0].split('/').filter(Boolean).pop() || ('test-' + (x.i + 1)));
          if (seen[id]) id += '-' + (x.i + 1);
          seen[id] = true;
          return { key: `test:${skill}/${p.slug}/${id}`, id, title: 'Test ' + (n + 1), source: String(t.source || ''), href: String(t.href || ''), tags: t.tags || [],
            def: { locked: t.premium === undefined ? def.locked : !!t.premium, plan: planOf(t.minPlan) || def.plan } };
        });
        return { key: `pack:${skill}/${p.slug}`, slug: p.slug, title: p.title, tier: p.tier || '', def, tests };
      });
      const pc = PRACTICE[skill];
      if (pc) {   // the cards of the practice page (part/practice/<skill>) are managed from the same panel
        const def = { locked: !pc.cards.every((c) => c.free), plan: 'standard' };
        packs.push({ key: `pack:${skill}/practice-cards`, slug: 'practice-cards', title: 'Practice cards - ' + pc.title, tier: '', practice: true, def,
          tests: pc.cards.map((c, n) => ({ key: `test:${skill}/practice-cards/${c.id}`, id: c.id, title: c.title, source: 'Practice page card ' + (n + 1), href: c.href || pc.page, practiceHref: c.href || '', tags: [], def: { locked: !c.free, plan: 'standard' } })) });
      }
      skills.push({ skill, title: ((D.skills || {})[skill] || {}).title || (skill === 'article' ? 'Articles' : skill), packs });
    }
  } catch (e) { console.warn('full-tests-data.js could not be read:', e.message); }
  return (CATALOG = { skills });
}

let rulesCache = { t: 0, v: {} };
async function accessRules(force) {
  if (!force && Date.now() - rulesCache.t < 3000) return rulesCache.v;
  let v = rulesCache.v;
  try { const s = await store.getSetting('access-rules'); v = s && typeof s === 'object' && s.rules && typeof s.rules === 'object' ? s.rules : {}; }
  catch (e) { console.warn('Access rules unavailable (defaults are used):', e.message); }
  rulesCache = { t: Date.now(), v };
  return v;
}
const KEY_RE = /^(pack|test|mat):[A-Za-z0-9_.\/-]{1,120}$/;
function cleanRules(input) {
  const out = {};
  for (const [k, r] of Object.entries(input && typeof input === 'object' ? input : {})) {
    if (!KEY_RE.test(k) || !r || typeof r !== 'object') continue;
    if (r.locked === false) out[k] = { locked: false };
    else if (r.locked === true && PLAN_ORDER[r.plan]) out[k] = { locked: true, plan: r.plan };
  }
  return out;
}
function catalogPackFor(type, packName) {
  const want = slugOf(packName || 'Practice');
  const sk = loadCatalog().skills.find((x) => x.skill === type);
  return (sk && sk.packs.find((p) => p.slug === want || slugOf(p.title) === want)) || null;
}
function materialRule(m, rules) {
  if (m.type === 'vocab') return { locked: !!m.premium, plan: 'standard' };      // vocabulary keeps its own Free / Premium switch
  const pack = catalogPackFor(m.type, m.pack);
  const parent = pack ? rules[pack.key] : rules[`pack:${m.type}/${slugOf(m.pack || 'Practice')}`];
  return effectiveRule(rules['mat:' + m.id], parent, { locked: !!m.premium, plan: 'standard' });
}
// the rule that guards one /full-tests/<skill>/test-N.html file (the most generous one when several tests point at it)
async function gateForPath(tl) {
  const isFull = /^\/full-tests\/(reading|listening|writing|speaking)\/test-[^/]+\.html$/.test(tl);
  const isPractice = /^\/(pessages|sections)\/test-\d+\.html$/.test(tl);     // practice passages / sections (Reading, Listening practice cards)
  if (!isFull && !isPractice) return null;
  const rules = await accessRules(); const want = hrefPath(tl); let best = null;
  for (const sk of loadCatalog().skills) for (const pk of sk.packs) for (const t of pk.tests) {
    if (hrefPath(t.href) !== want) continue;
    const r = effectiveRule(rules[t.key], rules[pk.key], t.def);
    if (!best || levelNeeded(r) < levelNeeded(best)) best = r;
  }
  return best || (isPractice ? null : { locked: true, plan: 'standard' });
}
const priceUrl = (plan, next) => `/Price?premium=required&plan=${plan || 'standard'}` + (next ? `&next=${encodeURIComponent(next)}` : '');

/* ---- packs made in the admin panel (cards of the Full Tests pages), kept in settings ---- */
const PACK_SKILLS = ['reading', 'listening', 'writing', 'speaking'];
async function getAdminPacks() {
  try { const v = await store.getSetting('admin-packs'); return Array.isArray(v && v.packs) ? v.packs : []; } catch (e) { return []; }
}
const savePacks = (packs) => store.setSetting('admin-packs', { packs, updatedAt: new Date().toISOString() });
function cleanPack(b, cur) {
  b = b || {}; const title = cleanName(b.title !== undefined ? b.title : (cur && cur.title)); if (!title) throw new HttpError(400, 'Pack name is required.');
  const skill = PACK_SKILLS.includes(b.skill) ? b.skill : (cur && cur.skill) || 'reading';
  const pick = (k, n) => (b[k] !== undefined ? cut(b[k], n).trim() : (cur && cur[k]) || '');
  return { id: (cur && cur.id) || newId(), skill, title, slug: slugOf(title), tier: pick('tier', 20), plan: pick('plan', 12).toUpperCase(), group: pick('group', 60), description: pick('description', 200),
    premium: b.premium !== undefined ? !!b.premium : !!(cur && cur.premium), published: b.published !== undefined ? b.published !== false : !cur || cur.published !== false, createdAt: (cur && cur.createdAt) || new Date().toISOString() };
}
async function adminAccessView() {
  const rules = await accessRules(true);
  const cat = loadCatalog();
  const view = (own, parent, def) => { const r = effectiveRule(own, parent, def); return { locked: r.locked, plan: r.plan, mode: modeOf(own) }; };
  const skills = cat.skills.map((sk) => ({
    skill: sk.skill, title: sk.title,
    packs: sk.packs.map((pk) => ({ key: pk.key, slug: pk.slug, title: pk.title, tier: pk.tier, practice: !!pk.practice, rule: view(rules[pk.key], null, pk.def), def: pk.def,
      tests: pk.tests.map((t) => ({ key: t.key, id: t.id, title: t.title, source: t.source, href: t.href, rule: view(rules[t.key], rules[pk.key], t.def), def: t.def })) }))
  }));
  for (const ap of await getAdminPacks()) {
    const sk = skills.find((x) => x.skill === ap.skill); if (!sk) continue;
    let pk = sk.packs.find((p) => p.slug === ap.slug || slugOf(p.title) === ap.slug);
    if (pk) { pk.title = ap.title; pk.tier = ap.tier || pk.tier; continue; }
    pk = { key: `pack:${ap.skill}/${ap.slug}`, slug: ap.slug, title: ap.title, tier: ap.tier, extra: true, def: { locked: !!ap.premium, plan: 'standard' }, tests: [] }; pk.rule = view(rules[pk.key], null, pk.def); sk.packs.push(pk);
  }
  const mats = (await store.listMaterials()).filter((m) => m.type !== 'vocab');
  for (const m of mats) {
    const sk = skills.find((x) => x.skill === m.type); if (!sk) continue;
    const slug = slugOf(m.pack || 'Practice');
    let pk = sk.packs.find((p) => p.slug === slug || slugOf(p.title) === slug);
    if (!pk) { pk = { key: `pack:${m.type}/${slug}`, slug, title: m.pack || 'Practice', tier: '', extra: true, def: { locked: false, plan: 'standard' }, tests: [] }; pk.rule = view(rules[pk.key], null, pk.def); sk.packs.push(pk); }
    const parent = rules[pk.key]; const def = { locked: !!m.premium, plan: 'standard' };
    pk.tests.push({ key: 'mat:' + m.id, id: m.id, title: m.title, source: m.description || '', href: (m.type === 'reading' ? require('./reading-router').hrefFor(m) : m.type === 'listening' ? require('./listening-router').hrefFor(m) : '') || '/test?id=' + m.id, material: true, published: m.published !== false, rule: view(rules['mat:' + m.id], parent, def), def });
  }
  return { skills, plans: ['standard', 'max', 'ultra'] };
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
  if (method === 'GET' && /^\/api\/media\/[A-Za-z0-9_-]{8,40}$/.test(p)) {   // a picture kept in the database (see POST /api/admin/uploads on Vercel)
    const rec = await store.getSetting('media:' + p.split('/').pop()).catch(() => null);
    if (!rec || !rec.b64 || !/^image\//.test(rec.mime || '')) return send(res, 404, 'Not found.');
    const buf = Buffer.from(rec.b64, 'base64');
    res.writeHead(200, { 'Content-Type': rec.mime, 'Content-Length': buf.length, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox" });
    return res.end(req.method === 'HEAD' ? undefined : buf);
  }
  if (method === 'GET' && p === '/api/health') {
    rateLimit('health:' + clientIp(req), 60, 60000);
    let database = USE_SUPABASE ? 'ok' : (IS_VERCEL ? 'not configured' : 'file');
    if (USE_SUPABASE) {
      try {
        await Promise.all([
          sb('ieltsx_users?select=id,emailVerified,lastLoginAt,loginCount,blocked,blockedReason,note,sessionEpoch&limit=1'),
          sb('ieltsx_results?select=id&limit=1'), sb('ieltsx_orders?select=id&limit=1'),
          sb('ieltsx_audit?select=id&limit=1'), sb('ieltsx_materials?select=id&limit=1')
        ]);
      } catch (e) { database = e instanceof HttpError ? e.message : 'Database check failed.'; }
    }
    return send(res, 200, {
      ok: true, time: new Date().toISOString(), storage: USE_SUPABASE ? 'supabase' : 'file',
      vercel: IS_VERCEL, sessionSecret: !!SESSION_SECRET, google: !!GOOGLE_CLIENT_ID, database,
      problems: [
        IS_VERCEL && !USE_SUPABASE ? 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set: accounts cannot be saved on Vercel.' : null,
        USE_SUPABASE && database !== 'ok' ? database : null,
        !SESSION_SECRET ? 'SESSION_SECRET is not set.' : null
      ].filter(Boolean)
    });
  }
  if (method !== 'GET' && method !== 'HEAD' && p !== '/api/payments/webhook') {
    if (!SESSION_SECRET && p.startsWith('/api/auth')) throw new HttpError(500, 'Server setup is incomplete: add SESSION_SECRET in Vercel > Settings > Environment Variables, then redeploy.');
    if (IS_VERCEL && !USE_SUPABASE) throw new HttpError(503, 'Database is not connected: add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel > Settings > Environment Variables (and run supabase-schema.sql), then redeploy.');
  }

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
    await mailWithin(sendVerification(req, u), 4000);
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
    const work = u ? sendMail({ to: u.email, subject: 'Reset your IELTS X password', text: `Hi ${u.name},\n\nChoose a new password:\n${siteUrl(req)}/reset.html?token=${encodeURIComponent(purposeToken('reset', { sub: u.id, sv: sessionVersion(u) }, 60 * 60000))}\n\nThe link works for 1 hour and only once. If you did not ask for this, ignore this message.` }) : Promise.resolve(false);
    // the same answer, and about the same time, whether or not the account exists
    await Promise.all([mailWithin(work), sleep(700 + crypto.randomInt(400))]);
    return send(res, 200, MAIL_READY ? { ok: true, mail: true } : { ok: true, mail: false, contact: PAYMENT_CONTACT });
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
  if (method === 'GET' && p === '/api/branding') return send(res, 200, await getBranding(), { 'Cache-Control': 'public, max-age=60' });
  if (method === 'GET' && p === '/api/plans') { const cfg = await getPricing(); return send(res, 200, { currency: cfg.currency, usdRate: cfg.usdRate, months: cfg.months, plans: cfg.plans.filter((x) => x.active), contact: cfg.contact, instructions: cfg.instructions }, { 'Cache-Control': 'no-store' }); }
  if (p === '/api/orders' && method === 'POST') {
    const u = await requireUser(req); rateLimit('order:' + u.id, 10, 60 * 60000);
    const b = await readJson(req); const cfg = await getPricing(); const plan = cfg.plans.find((x) => x.active && x.id === String(b.plan || '')); const months = Math.floor(Number(b.months));
    if (!plan || !cfg.months.includes(months) || !plan.prices[String(months)]) throw new HttpError(400, 'Choose a plan and a duration.');
    const payment = { contact: cfg.contact, instructions: cfg.instructions };
    const open = (await store.listOrders({ userId: u.id, status: 'pending', limit: 20 }));
    const same = open.find((o) => o.plan === plan.id && o.months === months);
    if (same) return send(res, 200, { order: same, payment });
    if (open.length >= 5) throw new HttpError(429, 'You already have several unpaid orders. Cancel or finish them first.');
    const ref = 'IX-' + crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
    const order = await store.insertOrder({ id: newId(), ref, userId: u.id, userEmail: u.email, plan: plan.id, planName: plan.name, months, amount: plan.prices[String(months)], currency: cfg.currency, status: 'pending', createdAt: new Date().toISOString(), paidAt: null });
    return send(res, 201, { order, payment });
  }
  if (p === '/api/orders' && method === 'GET') {
    const u = await requireUser(req);
    return send(res, 200, { orders: await store.listOrders({ userId: u.id, limit: 20 }), contact: (await getPricing()).contact });
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
    return send(res, 200, { authenticated: !!u, premium: isPremium(u), admin: isAdmin(u), level: userLevel(u), planKey: levelName(userLevel(u)), expiresAt: u ? u.premiumExpiresAt || null : null, plan: u ? publicUser(u).plan : 'Free', quota: await (async () => { try { const q = u && !isAdmin(u) ? await store.getSetting('quota:' + u.id) : null; return q && q.limit > 0 ? { limit: q.limit, used: (q.keys || []).length } : null; } catch (e) { return null; } })() });
  }

  /* ---- access rules (which packs / tests are free, locked, and for which plan) ---- */
  if (method === 'GET' && p === '/api/access') {
    const u = await currentUser(req); const level = userLevel(u);
    return send(res, 200, { rules: await accessRules(), level, planKey: levelName(level), authenticated: !!u, admin: isAdmin(u) }, { 'Cache-Control': 'no-store, private' });
  }
  if (method === 'GET' && p === '/api/access/check') {      // used by the test pages themselves (assets/js/access-gate.js)
    const u = await currentUser(req); const level = userLevel(u);
    // the page is sent as ?page=. The older ?path= clashes on Vercel: the "/api/:path*" rewrite adds its own path=access/check
    // to the query, so only a value that starts with "/" can be the page.
    let want = String(url.searchParams.get('page') || url.searchParams.getAll('path').find((v) => String(v).startsWith('/')) || ''); try { want = decodeURIComponent(want); } catch (e) { /* keep */ }
    // Mock tests and /premium-audio/ (PREMIUM_PATHS) need a paid plan too; middleware.js asks this before Vercel sends the file
    const gate = await gateForPath(hrefPath(want) + '.html') || (isPremiumPath(hrefPath(want) + '.html') || isPremiumPath(hrefPath(want)) ? { locked: true, plan: 'standard' } : { locked: false, plan: 'standard' });
    let allowed = allowsLevel(gate, level); let limited = false;
    if (allowed && gate.locked && await quotaBlocks(u, gate, hrefPath(want) + '.html')) { allowed = false; limited = true; }
    return send(res, 200, { allowed, limited, locked: gate.locked, plan: gate.plan, authenticated: !!u, price: allowed ? null : (limited ? '/Price?premium=limit&next=' + encodeURIComponent(want) : priceUrl(gate.plan, want)) }, { 'Cache-Control': 'no-store, private' });
  }

  /* ---- public materials (tests the admins added) ---- */
  if (method === 'GET' && p === '/api/packs') {   // the packs the admins made (cards of the Full Tests pages)
    const sk = url.searchParams.get('skill');
    return send(res, 200, { packs: (await getAdminPacks()).filter((x) => x.published !== false && (!sk || x.skill === sk)) }, { 'Cache-Control': 'no-store, private' });
  }
  if (method === 'GET' && p === '/api/materials') {
    const type = MATERIAL_TYPES.includes(url.searchParams.get('type')) ? url.searchParams.get('type') : '';
    const u = await currentUser(req); const level = userLevel(u); const rules = await accessRules();
    const items = (await store.listMaterials(type)).filter((m) => m.published !== false).map((m) => {
      const r = materialRule(m, rules);
      return { ...publicMaterial(m, false), premium: r.locked, plan: r.plan, locked: !allowsLevel(r, level) };
    });
    items.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));   // newest first
    return send(res, 200, { items }, { 'Cache-Control': 'no-store, private' });
  }
  let mm = p.match(/^\/api\/materials\/([^/]+)(\/grade|\/sample)?$/);
  if (mm) {
    const m = await store.getMaterial(decodeURIComponent(mm[1]));
    const u = await currentUser(req);
    if (!m || (m.published === false && !isAdmin(u))) throw new HttpError(404, 'Test not found.');
    const rule = materialRule(m, await accessRules());
    if (!allowsLevel(rule, userLevel(u))) throw new HttpError(u ? 403 : 401, u ? (rule.plan === 'max' ? 'This test is for Max members.' : 'This test is for Premium members.') : 'Please sign in to open this test.');
    const d = m.data || {};
    if (method === 'GET' && !mm[2]) {
      if (m.type === 'vocab') {   // cards are only handed to people who may see them, never cached, and not to scrapers
        rateLimit('vocab:' + (u ? u.id : clientIp(req)), 240, 60 * 60000);
        return send(res, 200, { item: publicMaterial(m, true), signedIn: !!u }, { 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex' });
      }
      return send(res, 200, { item: publicMaterial(m, true), signedIn: !!u });
    }
    if (method === 'GET' && mm[2] === '/sample') {
      return send(res, 200, { samples: (d.tasks || d.parts || []).map((t) => ({ id: t.id, sample: t.sample || '' })) });
    }
    if (method === 'POST' && mm[2] === '/grade') {
      if (m.type !== 'reading' && m.type !== 'listening') throw new HttpError(400, 'This content is not auto-graded.');
      rateLimit('grade:' + (u ? u.id : clientIp(req)), 200, 60 * 60000);
      const b = await readJson(req); const given = b.answers && typeof b.answers === 'object' ? b.answers : {};
      const qs = d.questions || []; if (!qs.length) throw new HttpError(400, 'This test has no questions yet.');
      const details = qs.map((q) => ({ id: q.id, correct: isCorrect(q, given[q.id]), given: cut(given[q.id], 300), answer: q.answer, explanation: q.explanation || '' }));
      const correct = details.filter((x) => x.correct).length; const band = bandFor(m.type, correct, qs.length);
      let saved = false;
      if (u) {
        try {
          await store.insertResult({ id: newId(), userId: u.id, testKey: '/test/' + m.id, section: m.type === 'listening' ? 'Listening' : 'Reading', bucket: 'Practice', pageLabel: cut(m.title, 120),
            scoreCorrect: correct, scoreTotal: qs.length, band, durationSec: Math.max(0, Math.min(86400, Math.floor(Number(b.durationSec) || 0))), createdAt: new Date().toISOString() });
          saved = true;
        } catch (e) { /* the score is still shown */ }
      }
      return send(res, 200, { correct, total: qs.length, band, details, saved, transcript: d.transcript || '' });
    }
    throw new HttpError(405, 'Method not allowed.');
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
    if (method === 'GET' && p === '/api/admin/pricing') return send(res, 200, { pricing: await getPricing(), defaults: defaultPricing() }, { 'Cache-Control': 'no-store' });
    if (method === 'POST' && p === '/api/admin/pricing') {
      const b = await readJson(req, 64 * 1024);
      if (b && b.reset) { await store.setSetting('pricing-config', null); await audit(admin, 'pricing.reset', 'pricing'); return send(res, 200, { pricing: await getPricing() }); }
      const cfg = normalizePricing(b && (b.pricing || b));
      if (!cfg.plans.some((x) => x.active)) throw new HttpError(400, 'Keep at least one plan switched on, with a price for at least one duration.');
      await store.setSetting('pricing-config', { ...cfg, updatedAt: new Date().toISOString() });
      await audit(admin, 'pricing.save', 'pricing', { months: cfg.months, plans: cfg.plans.map((x) => x.id + ':' + (x.active ? 'on' : 'off') + ':' + x.testsLimit) });
      return send(res, 200, { pricing: cfg });
    }
    if (method === 'GET' && p === '/api/admin/branding') return send(res, 200, { branding: await getBranding() }, { 'Cache-Control': 'no-store' });
    if (method === 'POST' && p === '/api/admin/branding') {
      const b = cleanBranding(await readJson(req, 16 * 1024));
      await store.setSetting('branding', { ...b, updatedAt: new Date().toISOString() });
      await audit(admin, 'branding.save', 'logo', { logo: !!b.logoUrl, icon: !!b.iconUrl });
      return send(res, 200, { branding: await getBranding() });
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
    if (method === 'GET' && p === '/api/admin/packs') return send(res, 200, { packs: await getAdminPacks() }, { 'Cache-Control': 'no-store' });
    if (method === 'POST' && p === '/api/admin/packs') {
      const all = await getAdminPacks(); const pk = cleanPack(await readJson(req, 64 * 1024));
      if (all.some((x) => x.skill === pk.skill && x.slug === pk.slug)) throw new HttpError(409, 'A pack with this name already exists.');
      all.push(pk); await savePacks(all); await audit(admin, 'pack.add', pk.title, { skill: pk.skill });
      return send(res, 201, { pack: pk });
    }
    m = p.match(/^\/api\/admin\/packs\/([^/]+)$/);
    if (m && (method === 'PATCH' || method === 'DELETE')) {
      const all = await getAdminPacks(); const id = decodeURIComponent(m[1]); const idx = all.findIndex((x) => x.id === id); if (idx < 0) throw new HttpError(404, 'Pack not found.');
      if (method === 'DELETE') { const [gone] = all.splice(idx, 1); await savePacks(all); await audit(admin, 'pack.delete', gone.title); return send(res, 200, { ok: true }); }
      const pk = cleanPack(await readJson(req, 64 * 1024), all[idx]);
      if (all.some((x, i) => i !== idx && x.skill === pk.skill && x.slug === pk.slug)) throw new HttpError(409, 'A pack with this name already exists.');
      all[idx] = pk; await savePacks(all); await audit(admin, 'pack.edit', pk.title); return send(res, 200, { pack: pk });
    }
    if (method === 'GET' && p === '/api/admin/access') return send(res, 200, await adminAccessView(), { 'Cache-Control': 'no-store' });
    if (method === 'POST' && p === '/api/admin/access') {
      const b = await readJson(req, 512 * 1024);
      const list = Array.isArray(b.changes) ? b.changes : [];
      if (!list.length) throw new HttpError(400, 'Nothing to change.');
      if (list.length > 800) throw new HttpError(400, 'Too many changes at once (800 max).');
      const rules = { ...(await accessRules(true)) }; const matIds = [];
      for (const c of list) {
        const key = String(c && c.key || '');
        if (!KEY_RE.test(key)) throw new HttpError(400, 'Unknown item: ' + cut(key, 60));
        const mode = String(c.mode || '');
        if (mode !== 'default' && !ruleFromMode(mode)) throw new HttpError(400, 'Mode must be default, free, standard or max.');
        if (mode === 'default') delete rules[key]; else rules[key] = ruleFromMode(mode);
        if (key.startsWith('mat:') && mode !== 'default') matIds.push([key.slice(4), mode !== 'free']);
      }
      await store.setSetting('access-rules', { rules: cleanRules(rules), updatedAt: new Date().toISOString() });
      rulesCache = { t: 0, v: {} };
      for (const [id, locked] of matIds) { try { await store.updateMaterial(id, { premium: locked, updatedAt: new Date().toISOString() }); } catch (e) { /* the rule still applies */ } }   // keeps the old Free / Premium flag in step
      await audit(admin, 'access.set', list.length === 1 ? list[0].key : list.length + ' items', { mode: list.length === 1 ? list[0].mode : 'bulk' });
      return send(res, 200, { ok: true, ...(await adminAccessView()) });
    }
    if (method === 'GET' && p === '/api/admin/materials') return send(res, 200, { items: await store.listMaterials(url.searchParams.get('type') || '') });
    if (method === 'POST' && p === '/api/admin/materials') {
      const b = await readJson(req, 2 * 1024 * 1024); const type = MATERIAL_TYPES.includes(b.type) ? b.type : 'reading';
      const title = cleanTitle(b.title); if (!title) throw new HttpError(400, 'Title is required.');
      const now = new Date().toISOString();
      const item = await store.insertMaterial({ id: newId(), type, title, pack: cleanName(b.pack), description: cut(b.description, 2000), content: '', premium: !!b.premium,
        published: b.published !== false, data: await keepReadingNo(type, cleanMaterialData(type, b.data), null), createdAt: now, updatedAt: now });
      await audit(admin, 'material.add', title, { type });
      return send(res, 201, { item });
    }
    m = p.match(/^\/api\/admin\/materials\/([^/]+)$/);
    if (m && method === 'GET') {
      const item = await store.getMaterial(decodeURIComponent(m[1])); if (!item) throw new HttpError(404, 'Material not found.');
      return send(res, 200, { item });
    }
    if (m && method === 'PATCH') {
      const id = decodeURIComponent(m[1]); const cur = await store.getMaterial(id); if (!cur) throw new HttpError(404, 'Material not found.');
      const b = await readJson(req, 2 * 1024 * 1024); const patch = { updatedAt: new Date().toISOString() };
      if (b.title !== undefined) { patch.title = cleanTitle(b.title); if (!patch.title) throw new HttpError(400, 'Title is required.'); }
      if (b.pack !== undefined) patch.pack = cleanName(b.pack);
      if (b.description !== undefined) patch.description = cut(b.description, 2000);
      if (b.premium !== undefined) { patch.premium = !!b.premium; try { const r0 = { ...(await accessRules(true)) }; if (r0['mat:' + id]) { delete r0['mat:' + id]; await store.setSetting('access-rules', { rules: cleanRules(r0), updatedAt: new Date().toISOString() }); rulesCache = { t: 0, v: {} }; } } catch (e) { /* the flag still applies */ } }
      if (b.published !== undefined) patch.published = !!b.published;
      if (b.data !== undefined) patch.data = await keepReadingNo(cur.type, cleanMaterialData(cur.type, b.data), cur);
      const item = await store.updateMaterial(id, patch); if (!item) throw new HttpError(404, 'Material not found.');
      await audit(admin, 'material.edit', item.title, b.premium !== undefined ? { premium: patch.premium } : undefined);
      return send(res, 200, { item });
    }
    if (m && method === 'DELETE') { await store.deleteMaterial(decodeURIComponent(m[1])); await audit(admin, 'material.delete', decodeURIComponent(m[1])); return send(res, 200, { ok: true }); }
    if (method === 'POST' && p === '/api/admin/upload-url') {            // big files go straight to Supabase Storage (Vercel has no disk)
      const b = await readJson(req); const ext = path.extname(String(b.filename || '')).toLowerCase();
      const kind = AUDIO_EXT.includes(ext) ? 'audio' : IMAGE_EXT.includes(ext) ? 'images' : PDF_EXT.includes(ext) ? 'pdf' : '';
      if (!kind) throw new HttpError(400, `Allowed files: ${[...AUDIO_EXT, ...IMAGE_EXT, ...PDF_EXT].join(', ')}`);
      if (!USE_SUPABASE) return send(res, 200, { local: true });
      await ensureBucket();
      const safe = path.basename(String(b.filename)).replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
      const key = `${kind}/${Date.now()}-${safe}`;
      const r = await fetch(`${SUPABASE_URL}/storage/v1/object/upload/sign/${MEDIA_BUCKET}/${key}`, { method: 'POST',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' }, body: '{}' }).catch(() => null);
      const j = r ? await r.json().catch(() => ({})) : {};
      if (!r || !r.ok || !j.url) throw new HttpError(503, 'Could not prepare the upload: ' + cut(j.message || j.error || 'Supabase Storage error', 140));
      await audit(admin, 'upload', key, { kind });
      return send(res, 200, { local: false, kind, uploadUrl: `${SUPABASE_URL}/storage/v1${j.url}`, publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${key}` });
    }
    if (method === 'POST' && p === '/api/admin/uploads' && IS_VERCEL) {   // Vercel has no disk: pictures are kept in the database (audio / PDF need Supabase Storage)
      const { file } = parseMultipart(await readBody(req, 4 * 1024 * 1024), req.headers['content-type']);
      if (!file) throw new HttpError(400, 'No file uploaded.');
      const ext = path.extname(file.filename).toLowerCase();
      if (!IMAGE_EXT.includes(ext)) throw new HttpError(501, 'Audio and PDF files go to Supabase Storage on Vercel: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Or paste a link to the file instead.');
      if (file.data.length > 3 * 1024 * 1024) throw new HttpError(413, 'This picture is larger than 3 MB. Make it smaller (for example a JPG under 1 MB) and try again.');
      const mid = crypto.randomBytes(12).toString('base64url');
      await store.setSetting('media:' + mid, { mime: { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' }[ext], b64: file.data.toString('base64'), name: cut(file.filename, 120), at: new Date().toISOString() });
      await audit(admin, 'upload', mid, { type: 'image-db' });
      return send(res, 201, { ok: true, type: 'images', filename: file.filename, url: '/api/media/' + mid });
    }
    if (method === 'POST' && p === '/api/admin/uploads') {
      if (IS_VERCEL) throw new HttpError(501, 'On Vercel files go to Supabase Storage: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (the panel then uploads directly).');
      const { fields, file } = parseMultipart(await readBody(req, MAX_UPLOAD_BYTES + 1024 * 1024), req.headers['content-type']);
      if (!file) throw new HttpError(400, 'No file uploaded.');
      const type = UPLOAD_TYPES[fields.type] ? fields.type : 'reading';
      const ext = path.extname(file.filename).toLowerCase();
      if (!UPLOAD_TYPES[type].includes(ext)) throw new HttpError(400, `Allowed ${type} files: ${UPLOAD_TYPES[type].join(', ')}`);
      if (file.data.length > MAX_UPLOAD_BYTES) throw new HttpError(413, 'File is too large (50 MB max).');
      const safe = path.basename(file.filename).replace(/[^a-zA-Z0-9._-]/g, '_');
      const folder = AUDIO_EXT.includes(ext) ? 'audio' : IMAGE_EXT.includes(ext) ? 'images' : PDF_EXT.includes(ext) ? 'pdf' : type;
      const dir = path.join(UPLOAD_DIR, folder); fs.mkdirSync(dir, { recursive: true });
      const stored = Date.now() + '-' + safe; fs.writeFileSync(path.join(dir, stored), file.data);
      await audit(admin, 'upload', stored, { type: folder });
      return send(res, 201, { ok: true, type: folder, filename: stored, originalName: file.filename, url: '/uploads/' + folder + '/' + encodeURIComponent(stored) });
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
  '/home': '/index.html', '/features': '/index.html', '/teachers': '/index.html', '/support': '/index.html',
  '/privacy-policy': '/privacy-policy.html', '/terms-of-service': '/terms-of-service.html', '/feedback': '/index.html', '/favicon.ico': '/assets/ieltsx-only-logo-BajnupZg.png',
  '/login': '/login.html', '/account': '/account.html', '/pricing': '/Price.html', '/practice/mock': '/Mock tests.html',
  '/listening.html': '/part/practice/listening.html', '/reading.html': '/part/practice/reading.html', '/writing.html': '/part/practice/writing.html', '/speaking.html': '/part/practice/speaking.html',
  '/full-tests/reading.html': '/full-tests/reading/index.html', '/full-tests/listening.html': '/full-tests/listening/index.html',
  '/full-tests/writing.html': '/full-tests/writing/index.html', '/full-tests/speaking.html': '/full-tests/speaking/index.html',
  '/full reading.html': '/full-tests/reading/index.html', '/full listening.html': '/full-tests/listening/index.html',
  '/full writing.html': '/full-tests/writing/index.html', '/full speaking.html': '/full-tests/speaking/index.html',
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
for (const [k, v] of Object.entries(ALIASES)) { if (/\.html$/i.test(k)) { const bare = k.toLowerCase().replace(/\.html$/, ''); if (!aliasMap.has(bare) && !['/listening', '/reading', '/writing', '/speaking'].includes(bare)) aliasMap.set(bare, v); } }
// clean URLs: the address bar never shows ".html" (/Price instead of /Price.html, /study/Tools/Performance ...)
function cleanUrlPath(p) { return String(p).replace(/\/index\.html$/i, '/').replace(/\.html$/i, '').replace(/^$/, '/'); }
const encPath = (p) => p.split('/').map((seg) => encodeURIComponent(decodeURIComponent(seg))).join('/');

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
  if (/^\/test\/[^/]+\/?$/.test(pathname)) pathname = '/test.html';
  // /full-tests/<skill>/<pack> (e.g. /full-tests/reading/pack-5) is one shared page; test-N.html files and index keep their own files
  if (/^\/full-tests\/(listening|reading|writing|speaking)\/(?!test-|index)[a-z0-9][a-z0-9_-]*\/?$/i.test(pathname)) pathname = '/full-tests/pack.html';   // /test/<id> shows the same player as /test?id=<id>
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
  if (!path.extname(target) && !target.endsWith('/')) {          // /Price -> /Price.html (clean URLs)
    const withHtml = path.resolve(ROOT, '.' + target + '.html');
    if (withHtml.startsWith(ROOT + path.sep) && fs.existsSync(withHtml) && fs.statSync(withHtml).isFile()) target += '.html';
  }
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
  const gate = isHtml ? await gateForPath(tl) : null;                // full test pages: free / Standard / Max, set in the admin panel
  const gateLocked = !!(gate && gate.locked);
  const needsPremium = isPremiumPath(tl) || gateLocked;
  const needLevel = gateLocked ? levelNeeded(gate) : 1;
  if (needsAdmin || needsPremium) {
    const u = await currentUser(req);
    const next = encodeURIComponent(pathname);
    if (!isHtml) { // audio, files: no page to redirect to
      if (!u) return send(res, 401, { error: 'Please sign in.' });
      if (needsPremium && userLevel(u) < needLevel) return send(res, 403, { error: 'Premium required.' });
    }
    if (!u) return redirect(res, `/login?next=${next}`);
    if (needsAdmin && !isAdmin(u)) return redirect(res, '/?admin=denied');
    if (needsPremium && userLevel(u) < needLevel) return redirect(res, priceUrl(gateLocked ? gate.plan : 'standard', pathname));
    if (gateLocked && await quotaBlocks(u, gate, tl)) return redirect(res, '/Price?premium=limit&next=' + encodeURIComponent(pathname));
  }
  const extra = needsAdmin ? { 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY', 'X-Robots-Tag': 'noindex, nofollow', 'Content-Security-Policy': ADMIN_CSP }
    : needsPremium ? { 'Cache-Control': 'no-store' } : {};
  return serveFile(req, res, file, extra);
}

/* ───────────────────────── sitemap (public pages only) ───────────────────────── */
function sitemap(origin) {
  const urls = new Set(['/', '/Price', '/Predictions', '/part/practice/listening', '/part/practice/reading', '/part/practice/writing', '/part/practice/speaking',
    '/study/Tools/Articles', '/study/Tools/Performance', '/study/Tools/Pdf%20materials', '/full-tests/reading/', '/full-tests/listening/', '/privacy-policy', '/terms-of-service']);
  for (const dir of ['pessages', 'sections']) {
    try {
      for (const f of fs.readdirSync(path.join(ROOT, dir))) {
        if (!/^test-\d+\.html$/.test(f)) continue;
        const text = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
        if (text.length < 6000 && text.includes('being prepared')) continue; // not ready yet
        urls.add(`/${dir}/${f.replace(/\.html$/, '')}`);
      }
    } catch (e) { /* folder missing */ }
  }
  const body = [...urls].map((u) => {
    let last = '';
    const rel = decodeURIComponent(u).replace(/\/$/, '/index.html');
    for (const cand of [rel, rel + '.html']) { try { last = fs.statSync(path.join(ROOT, cand)).mtime.toISOString().slice(0, 10); break; } catch (e) { /* try next */ } }
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
    if ((url.pathname === '/test' || url.pathname === '/test.html') && url.searchParams.get('id')) {   // an old /test?id= link of a Listening test -> its new page
      const lm = await store.getMaterial(url.searchParams.get('id')).catch(() => null);
      if (lm && lm.type === 'listening') { res.statusCode = 302; res.setHeader('Location', require('./listening-router').hrefFor(lm)); res.end(); return; }
    }
    if (await require('./listening-router').route(req, res, url, { root: ROOT, store, currentUser, isAdmin, materialRule, accessRules, allowsLevel, userLevel, send })) return;   // Listening tests made in the admin panel (new listening engine)
    if (await require('./reading-router').route(req, res, url, { root: ROOT, store, currentUser, isAdmin, materialRule, accessRules, allowsLevel, userLevel, send })) return;   // Reading tests made in the admin panel (Part = 1 passage, Full = 3 passages)
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
    if (/\.html$/i.test(url.pathname) && !url.pathname.toLowerCase().startsWith('/uploads/')) {
      let dec = ''; try { dec = decodeURIComponent(url.pathname); } catch (e) { /* bad url: staticFile answers 400 */ }
      const low = dec.toLowerCase();
      const aliased = aliasMap.get(low);
      const real = path.resolve(ROOT, '.' + dec);
      if (dec && (aliased || (real.startsWith(ROOT + path.sep) && fs.existsSync(real) && !isBlocked(dec)))) {
        const dest = cleanUrlPath(aliased || dec);
        res.writeHead(301, { Location: encPath(dest) + url.search, 'Cache-Control': 'public, max-age=300', ...SECURITY_HEADERS });
        return res.end();
      }
    }
    return await staticFile(req, res, url.pathname);
  } catch (e) {
    if (e instanceof HttpError) return send(res, e.status, { error: e.message });
    console.error(e);
    return send(res, 500, { error: 'Server error. Please try again.' });
  }
};

if (require.main === module) {
  if (!USE_SUPABASE) { try { fs.mkdirSync(DATA_DIR, { recursive: true }); if (!fs.existsSync(DB_FILE)) saveDb({ users: [], materials: [], results: [], orders: [], audit: [], settings: {} }); } catch (e) { /* read-only disk */ } }
  http.createServer(requestHandler).listen(PORT, () => {
    console.log(`IELTSX server running at http://localhost:${PORT}`);
    console.log(ADMIN_EMAILS.size ? `Admins: ${[...ADMIN_EMAILS].join(', ')}` : 'No ADMIN_EMAILS set: register an account, then run  node scripts/make-admin.js <email>');
    if (!GOOGLE_CLIENT_ID) console.log('Google sign-in is off (set GOOGLE_CLIENT_ID to enable it).');
  });
}
module.exports = requestHandler;
module.exports.store = store;
module.exports.hashPassword = hashPassword;
