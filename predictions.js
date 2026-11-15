'use strict';
/*
 * IELTSX — Predictions (Predictions.html for students, admin.html#predictions for admins).
 *
 * A prediction collection is a list of the tests and questions that are expected in the real exam for a period
 * ("Speaking September–December", "Reading Q4" …). The admin panel makes, edits, orders, publishes and deletes them;
 * the Predictions page lists the published ones. Everything lives in one setting ("predictions").
 *
 *   collection: { id, title, skill, period, description, plan, status, published, items, createdAt, updatedAt }
 *     skill  reading | listening | writing | speaking
 *     plan   free | standard | max | ultra  (who may open it; Free = everybody, even without an account)
 *     status updating (questions are still being added) | complete
 *   item: { id, kind, title, part, text, href, image, hot }
 *     kind "test"     a link to a test of this website (href) — Reading and Listening
 *     kind "question" a question, cue card or task written out (text, optional picture) — Speaking and Writing
 *     hot  marked as "very likely" by the admin
 *
 * The server decides access: a locked collection is listed with its name and size only, never with its questions or links.
 */
const crypto = require('crypto');

const KEY = 'predictions';
const SKILLS = ['reading', 'listening', 'writing', 'speaking'];
const PLANS = ['free', 'standard', 'max', 'ultra'];
const LEVEL = { free: 0, standard: 1, max: 2, ultra: 3 };
const STATUSES = ['updating', 'complete'];
const KINDS = ['test', 'question'];
const MAX_COLLECTIONS = 120;
const MAX_ITEMS = 400;

const clean = (v, n) => String(v == null ? '' : v).replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, n);
const oneLine = (v, n) => clean(v, n * 2).replace(/\s+/g, ' ').trim().slice(0, n);
const idOk = (v) => /^[a-z][a-z0-9-]{3,40}$/i.test(String(v || ''));
const makeId = (prefix) => prefix + '-' + crypto.randomBytes(5).toString('hex');
/* links: a page of this website (/…) or https://; pictures: an uploaded file, an asset, a picture kept in the database, or https:// */
const okHref = (v) => { const s = String(v || '').trim(); return /^\/(?!\/)[^\s"'<>\\]{0,400}$/.test(s) || /^https:\/\/[^\s"'<>\\]{3,400}$/i.test(s) ? s : ''; };
const okImage = (v) => { const s = String(v || '').trim(); return /^\/(uploads|assets|api\/media)\/[^\s"'<>\\]{1,300}$/.test(s) || /^https:\/\/[^\s"'<>\\]{3,400}$/i.test(s) ? s : ''; };

/* what the page showed before the panel existed: the same four cards, now editable (they start empty, "Updating") */
function defaults() {
  const at = '2026-01-01T00:00:00.000Z';
  const c = (id, title, skill, period, description) => ({ id, title, skill, period, description, plan: 'max', status: 'updating', published: true, items: [], createdAt: at, updatedAt: at });
  return {
    collections: [
      c('pred-reading-q2', 'Reading Q2', 'reading', 'Q2', 'Reading passages that keep coming back in the real exam this quarter.'),
      c('pred-reading-apr-may', 'Reading April–May', 'reading', 'April–May', 'Frequently appearing Reading passages for April and May.'),
      c('pred-speaking-mar-apr', 'Speaking March–April', 'speaking', 'March–April', 'Part 1 topics, Part 2 cue cards and Part 3 questions examiners are asking now.'),
      c('pred-listening-apr', 'Listening April', 'listening', 'April', 'Listening tests that are expected in the exam this month.')
    ],
    updatedAt: at
  };
}

function cleanItem(it, skill) {
  if (!it || typeof it !== 'object') return null;
  const kind = KINDS.includes(it.kind) ? it.kind : (it.href ? 'test' : 'question');
  const out = {
    id: idOk(it.id) ? String(it.id) : makeId('i'), kind,
    title: oneLine(it.title, 160), part: oneLine(it.part, 24),
    text: kind === 'question' ? clean(it.text, 4000) : '',
    href: kind === 'test' ? okHref(it.href) : '',
    image: okImage(it.image), hot: !!it.hot
  };
  if (kind === 'test' && !out.href) return { error: `"${out.title || 'A test'}" needs a link (a page of this website, starting with /).` };
  if (!out.title && !out.text) return null;   // an empty row of the form
  if (!out.title) out.title = out.text.split('\n')[0].slice(0, 120);
  if (skill === 'speaking' && out.part && !/^(part )?[123]$/i.test(out.part)) out.part = out.part.slice(0, 24);
  return out;
}

function cleanCollection(b, old, HttpError) {
  const title = oneLine(b.title, 120);
  if (!title) throw new HttpError(400, 'Give the collection a name.');
  const skill = SKILLS.includes(b.skill) ? b.skill : (old && old.skill) || '';
  if (!skill) throw new HttpError(400, 'Choose the skill: Reading, Listening, Writing or Speaking.');
  const rawItems = Array.isArray(b.items) ? b.items.slice(0, MAX_ITEMS + 50) : [];
  const items = []; const seen = new Set();
  for (const raw of rawItems) {
    const it = cleanItem(raw, skill);
    if (!it) continue;
    if (it.error) throw new HttpError(400, it.error);
    if (seen.has(it.id)) it.id = makeId('i');
    seen.add(it.id); items.push(it);
  }
  if (items.length > MAX_ITEMS) throw new HttpError(400, `A collection can hold ${MAX_ITEMS} items at most. Split it in two.`);
  const now = new Date().toISOString();
  return {
    id: old ? old.id : makeId('pred'), title, skill,
    period: oneLine(b.period, 60), description: clean(b.description, 600),
    plan: PLANS.includes(b.plan) ? b.plan : 'max', status: STATUSES.includes(b.status) ? b.status : 'updating',
    published: b.published !== false, items,
    createdAt: (old && old.createdAt) || now, updatedAt: now
  };
}

async function load(ctx) {
  let v = null;
  try { v = await ctx.store.getSetting(KEY); } catch (e) { v = null; }
  if (!v || typeof v !== 'object' || !Array.isArray(v.collections)) return defaults();
  return { collections: v.collections.filter((c) => c && idOk(c.id) && SKILLS.includes(c.skill)), updatedAt: v.updatedAt || null };
}
async function save(ctx, data) {
  data.updatedAt = new Date().toISOString();
  await ctx.store.setSetting(KEY, { collections: data.collections, updatedAt: data.updatedAt });
  return data;
}

const counts = (c) => {
  const items = c.items || [];
  return { count: items.length, tests: items.filter((i) => i.kind === 'test').length, questions: items.filter((i) => i.kind === 'question').length, hot: items.filter((i) => i.hot).length };
};
/* what a visitor may see of a collection: the name and the size always; the questions and links only with the plan */
function view(c, level, full) {
  const need = LEVEL[c.plan] || 0; const locked = level < need;
  const out = { id: c.id, title: c.title, skill: c.skill, period: c.period || '', description: c.description || '', plan: c.plan, status: c.status,
    published: c.published !== false, updatedAt: c.updatedAt || null, locked, ...counts(c) };
  out.parts = [...new Set((c.items || []).map((i) => i.part).filter(Boolean))].slice(0, 12);
  if (full && !locked) out.items = (c.items || []).map(({ id, kind, title, part, text, href, image, hot }) => ({ id, kind, title, part, text, href, image, hot }));
  return out;
}
const priceLink = (c) => '/Price?premium=required&plan=' + encodeURIComponent(c.plan) + '&next=' + encodeURIComponent('/Predictions#' + c.id);

/* GET /api/predictions            the published collections (no items)
   GET /api/predictions/<id>       one collection with its items, when the visitor's plan allows it */
async function route(req, res, p, method, ctx) {
  const { send, HttpError } = ctx;
  if (method !== 'GET' && method !== 'HEAD') throw new HttpError(405, 'Method not allowed.');
  ctx.rateLimit('pred:' + ctx.clientIp(req), 300, 60000);
  const u = await ctx.currentUser(req).catch(() => null);
  const admin = ctx.isAdmin(u); const level = ctx.userLevel(u);
  const data = await load(ctx);
  const visible = data.collections.filter((c) => admin || c.published !== false);
  const headers = { 'Cache-Control': 'no-store, private' };
  if (p === '/api/predictions') {
    return send(res, 200, { signedIn: !!u, level, plan: ['free', 'standard', 'max', 'ultra'][Math.min(3, level)], updatedAt: data.updatedAt, collections: visible.map((c) => view(c, level, false)) }, headers);
  }
  const m = p.match(/^\/api\/predictions\/([a-z0-9-]{4,41})$/i);
  if (!m) throw new HttpError(404, 'Not found.');
  const c = visible.find((x) => x.id === m[1]);
  if (!c) throw new HttpError(404, 'This collection is not available.');
  const v = view(c, level, true);
  if (v.locked) return send(res, 403, { error: u ? `This collection is for ${c.plan[0].toUpperCase() + c.plan.slice(1)} members.` : 'Sign in to open this collection.', locked: true, signedIn: !!u, collection: v, price: priceLink(c) }, headers);
  return send(res, 200, { collection: v }, headers);
}

/* GET    /api/admin/predictions              every collection with its items
   POST   /api/admin/predictions              { collection }  make one, or change it (same id)
   POST   /api/admin/predictions/order        { ids: [...] }   the order on the page
   POST   /api/admin/predictions/<id>/publish { published }
   DELETE /api/admin/predictions/<id> */
async function adminRoute(req, res, p, method, ctx) {
  const { send, readJson, HttpError, admin, audit } = ctx;
  const data = await load(ctx);
  const out = () => send(res, 200, { collections: data.collections.map((c) => ({ ...c, ...counts(c) })), updatedAt: data.updatedAt }, { 'Cache-Control': 'no-store' });
  if (p === '/api/admin/predictions' && method === 'GET') return out();
  if (p === '/api/admin/predictions' && method === 'POST') {
    const b = await readJson(req, 512 * 1024); const body = b && b.collection && typeof b.collection === 'object' ? b.collection : b || {};
    const i = body.id ? data.collections.findIndex((c) => c.id === body.id) : -1;
    if (body.id && i < 0) throw new HttpError(404, 'This collection was deleted. Reload the page.');
    if (i < 0 && data.collections.length >= MAX_COLLECTIONS) throw new HttpError(400, `Keep at most ${MAX_COLLECTIONS} collections: delete old ones first.`);
    const c = cleanCollection(body, i >= 0 ? data.collections[i] : null, HttpError);
    if (i >= 0) data.collections[i] = c; else data.collections.unshift(c);
    await save(ctx, data);
    await audit(admin, 'prediction.save', c.title, { skill: c.skill, items: c.items.length, plan: c.plan, published: c.published });
    return send(res, i >= 0 ? 200 : 201, { collection: { ...c, ...counts(c) }, collections: data.collections.map((x) => ({ ...x, ...counts(x) })) }, { 'Cache-Control': 'no-store' });
  }
  if (p === '/api/admin/predictions/order' && method === 'POST') {
    const ids = ((await readJson(req)).ids || []).map(String);
    const pos = new Map(ids.map((id, n) => [id, n]));
    data.collections.sort((a, b) => (pos.has(a.id) ? pos.get(a.id) : 1e6) - (pos.has(b.id) ? pos.get(b.id) : 1e6));
    await save(ctx, data);
    return out();
  }
  let m = p.match(/^\/api\/admin\/predictions\/([a-z0-9-]{4,41})\/publish$/i);
  if (m && method === 'POST') {
    const c = data.collections.find((x) => x.id === m[1]); if (!c) throw new HttpError(404, 'Collection not found.');
    c.published = !!(await readJson(req)).published; c.updatedAt = new Date().toISOString();
    await save(ctx, data);
    await audit(admin, 'prediction.save', c.title, { published: c.published });
    return out();
  }
  m = p.match(/^\/api\/admin\/predictions\/([a-z0-9-]{4,41})$/i);
  if (m && method === 'DELETE') {
    const c = data.collections.find((x) => x.id === m[1]); if (!c) throw new HttpError(404, 'Collection not found.');
    data.collections = data.collections.filter((x) => x.id !== c.id);
    await save(ctx, data);
    await audit(admin, 'prediction.delete', c.title, { items: (c.items || []).length });
    return out();
  }
  throw new HttpError(404, 'API endpoint not found.');
}

module.exports = { route, adminRoute, defaults, cleanCollection, SKILLS, PLANS };
