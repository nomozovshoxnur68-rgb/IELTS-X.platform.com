'use strict';
/*
 * IELTSX — Payme Merchant API (server-only module, required by server.js; never sent to a browser: see BLOCKED_FILES in
 * server.js and PRIVATE in middleware.js). Setup, testing and going live: PAYME_SETUP.md.
 *
 * How a payment works
 *   1. The student makes an order on the Price page (POST /api/orders, unchanged) and presses "Pay with Payme".
 *   2. POST /api/orders/<id>/payme (signed-in owner only) answers the Payme checkout form; the browser submits it.
 *   3. Payme calls this server, server to server, at POST /api/payme (JSON-RPC 2.0, Basic auth "Paycom:<key>"):
 *        CheckPerformTransaction  can this order be paid with this amount?
 *        CreateTransaction        Payme opened a payment for the order (state 1)
 *        PerformTransaction       the money was taken: the plan is switched on (state 2)
 *        CancelTransaction        cancelled before (-1) or refunded after (-2) completion
 *        CheckTransaction / GetStatement / ChangePassword
 *   4. Payme sends the student back to /payment-status?order=<code>, which only READS the order from this server.
 *      The plan is never switched on by the browser, a redirect or a URL parameter: only by PerformTransaction above.
 *
 * Safety
 *   - Every call needs the merchant key (compared in constant time); optional IP allow-list (PAYME_ALLOWED_IPS).
 *   - The amount Payme sends must equal the order total (so'm x 100 = tiyin); the order must still be unpaid.
 *   - One live (created or completed) transaction per order: a unique index in the database refuses a second one.
 *   - Perform and Cancel run in one database transaction (ieltsx_payme_perform / ieltsx_payme_cancel in
 *     supabase-schema.sql, v10): a repeated, late or parallel callback can never switch a plan on twice.
 *   - Repeated calls answer what was stored the first time (Payme retries until it gets an answer).
 *   - The key is never logged or stored; the activity log keeps the transaction, order and amount only.
 */
const crypto = require('crypto');

const TIMEOUT_MS = 43200000;   // 12 hours: a created transaction that was not completed in this time is cancelled (reason 4)
const LOGIN = 'Paycom';

/* ───────── settings (read on every call, so a changed environment needs no code change) ───────── */
function config() {
  const env = process.env;
  const testMode = /^(1|true|yes|on)$/i.test(String(env.PAYME_TEST_MODE || '').trim());
  const field = String(env.PAYME_ACCOUNT_FIELD || 'order_id').trim();
  const checkout = String(env.PAYME_CHECKOUT_URL || '').trim().replace(/\/+$/, '');
  const vat = Number(env.PAYME_VAT_PERCENT);
  return {
    merchantId: String(env.PAYME_MERCHANT_ID || '').trim(),
    key: String(env.PAYME_MERCHANT_KEY || '').trim(),
    testMode,
    checkoutUrl: /^https:\/\/[a-z0-9.-]+\.(paycom|payme)\.uz$/i.test(checkout) ? checkout : (testMode ? 'https://checkout.test.paycom.uz' : 'https://checkout.paycom.uz'),
    accountField: /^[a-z][a-z0-9_]{0,31}$/i.test(field) ? field : 'order_id',
    allowedIps: String(env.PAYME_ALLOWED_IPS || '').split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean),
    // fiscal receipt (OFD): the MXIK / IKPU code of the service and its package code from tasnif.soliq.uz
    ikpu: String(env.PAYME_IKPU || '').replace(/\s+/g, ''),
    packageCode: String(env.PAYME_PACKAGE_CODE || '').trim(),
    vatPercent: Number.isFinite(vat) && vat >= 0 && vat <= 100 ? vat : 0
  };
}
const enabled = () => { const c = config(); return !!(c.merchantId && c.key); };

/* ───────── errors (Payme shows "message" to the payer in their language) ───────── */
const T = (en, ru, uz) => ({ ru, uz, en });
const M = {
  notPost: T('Only POST is accepted.', 'Принимается только метод POST.', 'Faqat POST so‘rovi qabul qilinadi.'),
  parse: T('Invalid JSON.', 'Неверный JSON.', 'JSON noto‘g‘ri.'),
  rpc: T('Invalid JSON-RPC request.', 'Неверный запрос JSON-RPC.', 'JSON-RPC so‘rovi noto‘g‘ri.'),
  auth: T('Insufficient privilege to perform this method.', 'Недостаточно привилегий для выполнения метода.', 'Usulni bajarish uchun huquq yetarli emas.'),
  method: T('Method not found.', 'Метод не найден.', 'Usul topilmadi.'),
  system: T('System error. Please try again later.', 'Системная ошибка. Повторите попытку позже.', 'Tizim xatosi. Keyinroq qayta urinib ko‘ring.'),
  amount: T('Incorrect amount.', 'Неверная сумма.', 'Summa noto‘g‘ri.'),
  noOrder: T('Order not found.', 'Заказ не найден.', 'Buyurtma topilmadi.'),
  orderClosed: T('This order cannot be paid: it is already paid or cancelled.', 'Этот заказ нельзя оплатить: он уже оплачен или отменён.', 'Bu buyurtmani to‘lab bo‘lmaydi: u allaqachon to‘langan yoki bekor qilingan.'),
  busy: T('This order is already being paid by another transaction.', 'Заказ уже оплачивается другой транзакцией.', 'Bu buyurtma boshqa tranzaksiya orqali to‘lanmoqda.'),
  account: T('The account of this order is not available.', 'Аккаунт этого заказа недоступен.', 'Bu buyurtma hisobi mavjud emas.'),
  notFound: T('Transaction not found.', 'Транзакция не найдена.', 'Tranzaksiya topilmadi.'),
  notActive: T('Transaction is not active.', 'Транзакция не активна.', 'Tranzaksiya faol emas.'),
  expired: T('Transaction timed out and was cancelled.', 'Время транзакции истекло, она отменена.', 'Tranzaksiya vaqti tugadi va bekor qilindi.'),
  tooOld: T('The transaction was created more than 12 hours ago.', 'С момента создания транзакции прошло более 12 часов.', 'Tranzaksiya yaratilganiga 12 soatdan oshdi.'),
  perform: T('Unable to perform this operation.', 'Невозможно выполнить операцию.', 'Amalni bajarib bo‘lmaydi.'),
  cancel: T('Unable to cancel: the service has been provided.', 'Невозможно отменить: услуга оказана.', 'Bekor qilib bo‘lmaydi: xizmat ko‘rsatilgan.'),
  period: T('Incorrect period.', 'Неверный период.', 'Davr noto‘g‘ri.'),
  password: T('Incorrect new password.', 'Неверный новый пароль.', 'Yangi parol noto‘g‘ri.')
};
class PaymeError extends Error { constructor(code, message, data) { super(message.en); this.code = code; this.msg = message; this.data = data; } }
const fail = (code, message, data) => new PaymeError(code, message, data);
// -31050 … -31099 are the "account" errors: the payer typed or chose an order Payme cannot pay
const ERR = { orderNotFound: -31050, orderClosed: -31051, orderBusy: -31052, accountUnavailable: -31053 };

/* ───────── storage: Supabase (the two functions do the work in one database transaction) or the local data file ───────── */
const TX = 'ieltsx_payme_transactions';
function txStore(ctx) {
  const { USE_SUPABASE, sb, eq, jsonHeaders, isUuid } = ctx;
  const rpc = (fn, args) => sb('rpc/' + fn, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(args) });
  if (USE_SUPABASE) return {
    async byPaymeId(pid) { return ((await sb(`${TX}?paymeId=eq.${eq(pid)}&limit=1`)) || [])[0] || null; },
    async liveForOrder(orderId) { return isUuid(orderId) ? ((await sb(`${TX}?orderId=eq.${eq(orderId)}&state=in.(1,2)&limit=1`)) || [])[0] || null : null; },
    async latestForOrder(orderId) { return isUuid(orderId) ? ((await sb(`${TX}?orderId=eq.${eq(orderId)}&order=createdAt.desc&limit=1`)) || [])[0] || null : null; },
    async insert(row) {
      try { return ((await sb(TX, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(row) })) || [])[0] || row; }
      catch (e) { if (/23505/.test(String(e && e.message))) { const c = new Error('conflict'); c.conflict = true; throw c; } throw e; }
    },
    perform(pid, now) { return rpc('ieltsx_payme_perform', { p_payme_id: pid, p_now: now, p_timeout: TIMEOUT_MS }); },
    cancel(pid, reason, now, allowRefund) { return rpc('ieltsx_payme_cancel', { p_payme_id: pid, p_reason: reason, p_now: now, p_allow_refund: !!allowRefund }); },
    async statement(from, to) { return (await sb(`${TX}?and=(paymeTime.gte.${Math.floor(from)},paymeTime.lte.${Math.floor(to)})&order=paymeTime.asc&limit=10000`)) || []; },
    async ready() { try { await sb(`${TX}?select=id&limit=1`); return true; } catch (e) { return false; } }
  };
  /* local data file (npm start without Supabase): the same rules as the SQL functions. Each one reads and writes the file
     without waiting in between, so on this one Node process nothing can run in the middle of it. */
  const { loadDb, saveDb, isAdmin } = ctx;
  const all = (db) => { if (!Array.isArray(db.payme)) db.payme = []; return db.payme; };
  const copy = (o) => (o ? JSON.parse(JSON.stringify(o)) : null);
  return {
    async byPaymeId(pid) { return copy(all(loadDb()).find((t) => t.paymeId === pid)); },
    async liveForOrder(orderId) { return copy(all(loadDb()).find((t) => t.orderId === orderId && (t.state === 1 || t.state === 2))); },
    async latestForOrder(orderId) { return copy(all(loadDb()).filter((t) => t.orderId === orderId).sort((a, b) => b.createTime - a.createTime)[0]); },
    async insert(row) {
      const db = loadDb(); const list = all(db);
      if (list.some((t) => t.paymeId === row.paymeId || (t.orderId === row.orderId && (t.state === 1 || t.state === 2)))) { const c = new Error('conflict'); c.conflict = true; throw c; }
      list.unshift(row); saveDb(db); return copy(row);
    },
    async perform(pid, now) {
      const db = loadDb(); const t = all(db).find((x) => x.paymeId === pid);
      if (!t) return { code: -31003 };
      if (t.state === 2) return { tx: copy(t) };
      if (t.state !== 1) return { code: -31008, tx: copy(t) };
      if (now - t.createTime > TIMEOUT_MS) { Object.assign(t, { state: -1, reason: 4, cancelTime: now, updatedAt: new Date().toISOString() }); saveDb(db); return { code: -31008, expired: true, tx: copy(t) }; }
      const o = (db.orders || []).find((x) => x.id === t.orderId);
      if (!o || o.status !== 'pending' || Number(o.amount) * 100 !== t.amount) return { code: -31008, tx: copy(t), orderStatus: o ? o.status : 'missing' };
      const u = (db.users || []).find((x) => x.id === o.userId);
      if (!u) return { code: -31008, tx: copy(t), orderStatus: 'no-account' };
      const days = Math.max(Number(o.months) || 1, 1) * 30; const nowIso = new Date().toISOString();
      const active = u.role !== 'admin' && !isAdmin(u) && u.premiumActive && u.premiumExpiresAt && Date.parse(u.premiumExpiresAt) > Date.now();
      const exp = new Date((active ? Date.parse(u.premiumExpiresAt) : Date.now()) + days * 86400000).toISOString();
      const prev = { plan: u.plan, premiumActive: !!u.premiumActive, premiumExpiresAt: u.premiumExpiresAt || null };
      Object.assign(u, { premiumActive: true, plan: o.planName, premiumExpiresAt: exp });
      Object.assign(o, { status: 'paid', paidAt: nowIso, paidVia: 'payme' });
      Object.assign(t, { state: 2, performTime: now, updatedAt: nowIso, grantPlan: o.planName, grantDays: days, prevPlan: prev.plan, prevActive: prev.premiumActive, prevExpiresAt: prev.premiumExpiresAt, grantedExpiresAt: exp });
      saveDb(db); return { tx: copy(t), performed: true, userId: u.id, prev };
    },
    async cancel(pid, reason, now, allowRefund) {
      const db = loadDb(); const t = all(db).find((x) => x.paymeId === pid);
      if (!t) return { code: -31003 };
      if (t.state < 0) return { tx: copy(t) };
      const nowIso = new Date().toISOString();
      if (t.state === 1) { Object.assign(t, { state: -1, reason, cancelTime: now, updatedAt: nowIso }); saveDb(db); return { tx: copy(t), cancelled: true }; }
      if (!allowRefund) return { code: -31007, tx: copy(t) };
      const u = (db.users || []).find((x) => x.id === t.userId);
      if (u) {
        if ((u.premiumExpiresAt || null) === (t.grantedExpiresAt || null) && u.plan === t.grantPlan) Object.assign(u, { plan: t.prevPlan || 'Free', premiumActive: !!t.prevActive, premiumExpiresAt: t.prevExpiresAt || null });
        else if (u.premiumExpiresAt && t.grantDays > 0) {
          const exp = Date.parse(u.premiumExpiresAt) - t.grantDays * 86400000;
          if (exp > Date.now()) u.premiumExpiresAt = new Date(exp).toISOString(); else Object.assign(u, { premiumActive: false, plan: 'Free', premiumExpiresAt: null });
        }
      }
      const o = (db.orders || []).find((x) => x.id === t.orderId);
      if (o && o.status === 'paid') Object.assign(o, { status: 'refunded', refundedAt: nowIso });
      Object.assign(t, { state: -2, reason, cancelTime: now, updatedAt: nowIso });
      saveDb(db); return { tx: copy(t), refunded: true, userId: t.userId };
    },
    async statement(from, to) { return copy(all(loadDb()).filter((t) => t.paymeTime >= from && t.paymeTime <= to).sort((a, b) => a.paymeTime - b.paymeTime)); },
    async ready() { return true; }
  };
}

/* ───────── authorization: "Authorization: Basic base64(Paycom:<key>)" ───────── */
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();
/* ChangePassword (sent by Payme when the key is changed in the merchant cabinet) keeps a hash of the new key in settings.
   It is used only while PAYME_MERCHANT_KEY is still the key it replaced: once the new key is put in Vercel too, the
   environment wins again, and switching between the test and the live key never mixes them up. */
async function effectiveKeyHash(c, ctx) {
  let rec = null; try { rec = await ctx.store.getSetting('payme-key'); } catch (e) { rec = null; }
  if (rec && rec.envHash === sha(c.key).toString('hex') && /^[0-9a-f]{64}$/.test(String(rec.hash || ''))) return Buffer.from(rec.hash, 'hex');
  return sha(c.key);
}
async function keyMatches(given, c, ctx) { return crypto.timingSafeEqual(sha(given), await effectiveKeyHash(c, ctx)); }
async function authorized(req, c, ctx) {
  const m = String(req.headers.authorization || '').match(/^\s*Basic\s+([A-Za-z0-9+/=_-]{4,512})\s*$/i);
  if (!m) return false;
  let dec = ''; try { dec = Buffer.from(m[1], 'base64').toString('utf8'); } catch (e) { return false; }
  const i = dec.indexOf(':'); if (i < 0) return false;
  const loginOk = crypto.timingSafeEqual(sha(dec.slice(0, i)), sha(LOGIN));
  const keyOk = await keyMatches(dec.slice(i + 1), c, ctx);
  return loginOk && keyOk;
}
/* optional: only these addresses may call (exact IPv4 / IPv6, or IPv4 CIDR such as 185.234.113.0/28) */
function ipAllowed(ip, list) {
  if (!list.length) return true;
  ip = String(ip || '').replace(/^::ffff:/, '');
  const v4 = (s) => { const p = s.split('.').map(Number); return p.length === 4 && p.every((n) => Number.isInteger(n) && n >= 0 && n <= 255) ? ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3] : null; };
  return list.some((rule) => {
    if (!rule.includes('/')) return rule === ip;
    const [net, bits] = rule.split('/'); const b = Number(bits); const a = v4(ip), n = v4(net);
    if (a === null || n === null || !(b >= 0 && b <= 32)) return false;
    const mask = b === 0 ? 0 : (0xffffffff << (32 - b)) >>> 0;
    return ((a & mask) >>> 0) === ((n & mask) >>> 0);
  });
}

/* ───────── the methods ───────── */
const isInt = (v) => Number.isSafeInteger(v);
const pidOf = (v) => (typeof v === 'string' && v.length >= 1 && v.length <= 64 ? v : null);

const accountKey = (p, c) => {
  const acc = p.account && typeof p.account === 'object' && !Array.isArray(p.account) ? p.account : {};
  return String(acc[c.accountField] == null ? '' : acc[c.accountField]).trim();
};
/* the order named in params.account, checked against the amount (in tiyin) */
async function orderFor(p, c, ctx) {
  if (!isInt(p.amount) || p.amount <= 0) throw fail(-31001, M.amount);
  const key = accountKey(p, c);
  if (!key || key.length > 64) throw fail(ERR.orderNotFound, M.noOrder, c.accountField);
  const o = await ctx.store.findOrder(key);
  if (!o) throw fail(ERR.orderNotFound, M.noOrder, c.accountField);
  if (Math.round(Number(o.amount) * 100) !== p.amount) throw fail(-31001, M.amount);
  if (o.status !== 'pending') throw fail(ERR.orderClosed, M.orderClosed, c.accountField);
  const u = await ctx.store.findUserById(o.userId);
  if (!u || (u.blocked && !ctx.isAdmin(u))) throw fail(ERR.accountUnavailable, M.account, c.accountField);
  return o;
}
/* the fiscal receipt Payme prints (only when PAYME_IKPU and PAYME_PACKAGE_CODE are set) */
function receiptDetail(o, c) {
  if (!c.ikpu || !c.packageCode) return null;
  const price = Math.round(Number(o.amount) * 100);
  return { receipt_type: 0, items: [{ title: `IELTS X ${o.planName} — ${o.months} ${o.months === 1 ? 'month' : 'months'}`.slice(0, 120), price, count: 1, code: c.ikpu, package_code: c.packageCode, vat_percent: c.vatPercent }] };
}
const txView = (t) => ({ create_time: Number(t.createTime) || 0, perform_time: Number(t.performTime) || 0, cancel_time: Number(t.cancelTime) || 0, transaction: String(t.id), state: Number(t.state), reason: t.reason == null ? null : Number(t.reason) });
const logTx = (ctx, action, t, meta) => ctx.audit({ email: 'payme' }, action, t.orderRef || '', { payme: t.paymeId, amount: Number(t.amount) / 100, state: Number(t.state), ...(meta || {}) });

const METHODS = {
  async CheckPerformTransaction(p, c, ctx, txs) {
    const o = await orderFor(p, c, ctx);
    if (await txs.liveForOrder(o.id)) throw fail(ERR.orderBusy, M.busy, c.accountField);
    const r = { allow: true }; const d = receiptDetail(o, c); if (d) r.detail = d;
    return r;
  },
  async CreateTransaction(p, c, ctx, txs) {
    const pid = pidOf(p.id); if (!pid || !isInt(p.time) || p.time <= 0) throw fail(-32600, M.rpc);
    for (let attempt = 0; attempt < 2; attempt++) {
      const t = await txs.byPaymeId(pid);
      if (t) {     // Payme asks again for the same transaction: the same answer, as long as it is still open
        const key = accountKey(p, c);
        if ((key.toUpperCase() !== String(t.orderRef).toUpperCase() && key !== t.orderId) || Number(t.amount) !== p.amount) throw fail(-31008, M.perform);
        if (Number(t.state) !== 1) throw fail(-31008, M.notActive);
        if (Date.now() - Number(t.createTime) > TIMEOUT_MS) { const r = await txs.cancel(pid, 4, Date.now(), false); if (r && r.tx) await logTx(ctx, 'payme.timeout', r.tx); throw fail(-31008, M.expired); }
        return { create_time: Number(t.createTime), transaction: String(t.id), state: 1 };
      }
      const o = await orderFor(p, c, ctx);
      if (await txs.liveForOrder(o.id)) throw fail(ERR.orderBusy, M.busy, c.accountField);
      if (Date.now() - p.time >= TIMEOUT_MS) throw fail(-31008, M.tooOld);
      const now = Date.now();
      const row = { id: ctx.newId(), paymeId: pid, orderId: o.id, orderRef: o.ref, userId: o.userId, amount: p.amount, state: 1, reason: null,
        paymeTime: p.time, createTime: now, performTime: 0, cancelTime: 0, createdAt: new Date(now).toISOString(), updatedAt: new Date(now).toISOString() };
      try {
        const saved = await txs.insert(row);
        await logTx(ctx, 'payme.create', saved);
        return { create_time: Number(saved.createTime), transaction: String(saved.id), state: 1 };
      } catch (e) {
        if (!e || !e.conflict) throw e;
        // the same id saved a moment ago by a parallel call (answer it on the next turn), or another live transaction
        if (!(await txs.byPaymeId(pid))) throw fail(ERR.orderBusy, M.busy, c.accountField);
      }
    }
    throw fail(-31008, M.perform);
  },
  async PerformTransaction(p, c, ctx, txs) {
    const pid = pidOf(p.id); if (!pid) throw fail(-31003, M.notFound);
    const r = await txs.perform(pid, Date.now());
    if (!r || r.code === -31003) throw fail(-31003, M.notFound);
    if (r.code) {
      if (r.expired) await logTx(ctx, 'payme.timeout', r.tx);
      else if (r.orderStatus) await logTx(ctx, 'payme.perform-refused', r.tx, { order: r.orderStatus });
      throw fail(-31008, r.expired ? M.expired : M.perform);
    }
    const t = r.tx;
    if (r.performed) {
      ctx.memoClear('user:' + r.userId);
      await logTx(ctx, 'payme.paid', t, { plan: t.grantPlan, days: t.grantDays });
      // the test allowance of the plan (Price control), as an admin's "Confirm payment" does; never blocks the answer to Payme
      try {
        const u = await ctx.store.findUserById(r.userId);
        if (u) await ctx.grantQuota({ ...u, ...(r.prev || {}) }, t.grantPlan);
      } catch (e) { console.error('payme quota:', e.message); }
    }
    return { transaction: String(t.id), perform_time: Number(t.performTime), state: 2 };
  },
  async CancelTransaction(p, c, ctx, txs) {
    const pid = pidOf(p.id); if (!pid) throw fail(-31003, M.notFound);
    if (!isInt(p.reason)) throw fail(-32600, M.rpc);
    const r = await txs.cancel(pid, p.reason, Date.now(), true);
    if (!r || r.code === -31003) throw fail(-31003, M.notFound);
    if (r.code === -31007) throw fail(-31007, M.cancel);
    if (r.code) throw fail(-31008, M.perform);
    const t = r.tx;
    if (r.refunded) { if (r.userId) ctx.memoClear('user:' + r.userId); await logTx(ctx, 'payme.refund', t, { reason: p.reason }); }
    else if (r.cancelled) await logTx(ctx, 'payme.cancel', t, { reason: p.reason });
    return { transaction: String(t.id), cancel_time: Number(t.cancelTime), state: Number(t.state) };
  },
  async CheckTransaction(p, c, ctx, txs) {
    const pid = pidOf(p.id); const t = pid ? await txs.byPaymeId(pid) : null;
    if (!t) throw fail(-31003, M.notFound);
    return txView(t);
  },
  async GetStatement(p, c, ctx, txs) {
    if (!isInt(p.from) || !isInt(p.to) || p.from < 0 || p.from > p.to) throw fail(-32600, M.period);
    const rows = await txs.statement(p.from, p.to);
    return { transactions: rows.map((t) => ({ id: t.paymeId, time: Number(t.paymeTime), amount: Number(t.amount), account: { [c.accountField]: t.orderRef }, ...txView(t), receivers: null })) };
  },
  async ChangePassword(p, c, ctx) {
    const pw = typeof p.password === 'string' ? p.password.trim() : '';
    if (pw.length < 8 || pw.length > 256) throw fail(-32400, M.password, 'password');
    if (await keyMatches(pw, c, ctx)) throw fail(-32504, M.password);
    await ctx.store.setSetting('payme-key', { hash: sha(pw).toString('hex'), envHash: sha(c.key).toString('hex'), changedAt: new Date().toISOString() });
    await ctx.audit({ email: 'payme' }, 'payme.key-changed', 'payme', {});
    return { success: true };
  }
};

/* ───────── POST /api/payme ───────── */
async function route(req, res, ctx) {
  let id = null;
  const reply = (body) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...(ctx.SECURITY_HEADERS || {}) });
    res.end(JSON.stringify({ jsonrpc: '2.0', id, ...body }));
  };
  try {
    if (req.method !== 'POST') throw fail(-32300, M.notPost);
    let raw;
    try { raw = await ctx.readBody(req, 64 * 1024); } catch (e) { throw fail(-32700, M.parse); }
    let body; try { body = JSON.parse(Buffer.isBuffer(raw) ? raw.toString('utf8') : String(raw)); } catch (e) { throw fail(-32700, M.parse); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw fail(-32600, M.rpc);
    if (typeof body.id === 'number' || typeof body.id === 'string') id = body.id;
    const c = config();
    if (!c.merchantId || !c.key) throw fail(-32400, M.system);   // not set up: never answer "allowed"
    if (!ipAllowed(ctx.clientIp(req), c.allowedIps) || !(await authorized(req, c, ctx))) {
      console.warn('payme: refused a call from', ctx.clientIp(req));
      throw fail(-32504, M.auth);
    }
    if (typeof body.method !== 'string' || !body.params || typeof body.params !== 'object' || Array.isArray(body.params)) throw fail(-32600, M.rpc);
    if (!Object.prototype.hasOwnProperty.call(METHODS, body.method)) throw fail(-32601, M.method, body.method.slice(0, 64));
    const result = await METHODS[body.method](body.params, c, ctx, txStore(ctx));
    return reply({ result });
  } catch (e) {
    if (e instanceof PaymeError) return reply({ error: { code: e.code, message: e.msg, ...(e.data ? { data: e.data } : {}) } });
    console.error('payme: system error:', e && e.message);
    return reply({ error: { code: -32400, message: M.system } });
  }
}

/* ───────── for the site's own pages ───────── */
/* the Payme checkout form for one unpaid order (the browser posts it to Payme) */
function checkoutForm(o, { origin, lang }) {
  const c = config();
  const l = ['uz', 'ru', 'en'].includes(lang) ? lang : 'uz';
  return {
    action: c.checkoutUrl, method: 'POST',
    fields: {
      merchant: c.merchantId,
      amount: String(Math.round(Number(o.amount) * 100)),
      ['account[' + c.accountField + ']']: o.ref,
      lang: l,
      callback: origin + '/payment-status?order=' + encodeURIComponent(o.ref),
      description: `IELTS X ${o.planName} — ${o.months} ${o.months === 1 ? 'month' : 'months'} (${o.ref})`
    }
  };
}
/* the latest Payme transaction of an order, as the student may see it (no Payme ids, no account data) */
async function orderPayment(o, ctx) {
  const t = await txStore(ctx).latestForOrder(o.id).catch(() => null);
  if (!t) return null;
  return { provider: 'payme', state: Number(t.state), reason: t.reason == null ? null : Number(t.reason),
    createdAt: t.createTime ? new Date(Number(t.createTime)).toISOString() : null,
    performedAt: Number(t.performTime) ? new Date(Number(t.performTime)).toISOString() : null,
    cancelledAt: Number(t.cancelTime) ? new Date(Number(t.cancelTime)).toISOString() : null };
}
/* true while Payme holds an open (created, not yet completed) payment for the order: it must not be cancelled,
   replaced or confirmed by hand meanwhile */
async function busy(orderId, ctx) {
  try { const t = await txStore(ctx).liveForOrder(orderId); return !!(t && Number(t.state) === 1); } catch (e) { return false; }
}
/* Admin -> Website check */
async function status(ctx) {
  const c = config();
  return { configured: !!(c.merchantId && c.key), testMode: c.testMode, table: await txStore(ctx).ready(), fiscal: !!(c.ikpu && c.packageCode), ipList: c.allowedIps.length > 0 };
}

module.exports = { route, enabled, checkoutForm, orderPayment, busy, status, TIMEOUT_MS, _ipAllowed: ipAllowed };
