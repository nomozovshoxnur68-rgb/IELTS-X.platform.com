'use strict';
/*
 * IELTSX — e-books: the books of the Books page (panel-books, made in Admin → Books) as interactive books.
 * Every book can get units (Admin → E-books) and a DESIGN (style): the website's own look, or the look of a course book,
 * a workbook or a vocabulary book ("In Use"). A unit is a book page written in the format of ebook-doc.js: sections,
 * "Exam advice" boxes, reading passages and numbered exercises (A/B/C, True / False / Not Given, gaps in sentences, tables
 * and forms, circling the right word, matching, flow-charts) — plus an optional recording, an optional link to a test of
 * this website and the simple exercises (choice, gap, TFNG, YNNG) of the first version. The student does the exercises
 * one by one; the SERVER checks them (the answers reach the page only after "Check"), and the result is kept on the
 * account: the student sees how much of the book is learned and how much is left, the teacher sees the same (teachers.js).
 *
 * Kept in ieltsx_settings (no Supabase change):
 *   ebook:<bookId>                 { units: [head], style, updatedAt }   the units of a book, in order (no text, no answers)
 *   ebook-unit:<bookId>:<unitId>   unit                           one unit with its text and its exercises (answers)
 *   ebook-progress:<userId>        { books: { <bookId>: { units: { <unitId>: { read, best, total, last, attempts, lastAt, doneAt, tasks } }, startedAt, lastAt, lastUnit } }, updatedAt }
 *                                  tasks: { <exercise id>: best points } — best = the best of every exercise, added up
 *
 * A unit counts as learned ("done") when
 *   - it has exercises: the best score (the best of every exercise, added up) reached PASS (60 %);
 *   - it has none but links a test of the website: the student finished that test (a result with its key);
 *   - otherwise: the student pressed "I have read it".
 * Server only (BLOCKED_FILES in server.js, PRIVATE in middleware.js).
 */
const crypto = require('crypto');
const doc = require('./ebook-doc');

const PASS = 0.6;
const LEVEL = { free: 0, standard: 1, max: 2, ultra: 3 };
const PLAN_NAME = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
const KINDS = ['lesson', 'reading', 'listening', 'vocabulary', 'grammar', 'writing', 'speaking', 'test', 'review'];
const EX_TYPES = ['choice', 'gap', 'tfng', 'yng'];
const STYLES = ['site', 'course', 'workbook', 'inuse'];
const TFNG = ['True', 'False', 'Not Given'];
const YNNG = ['Yes', 'No', 'Not Given'];
const MAX_UNITS = 150, MAX_EX = 60;
const BOOK_RE = /^b-[a-f0-9]{8}$/, UNIT_RE = /^u-[a-f0-9]{8}$/, EX_RE = /^e-[a-f0-9]{6}$/;

const line = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const text = (v, n) => String(v == null ? '' : v).replace(/\r/g, '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{4,}/g, '\n\n\n').trim().slice(0, n);
const okUrl = (v) => { const s = String(v || '').trim(); return s.length <= 800 && (/^\/(?:uploads|api\/media|assets)\/[^\s"'<>\\]+$/.test(s) || /^https:\/\/[^\s"'<>\\]{3,}$/i.test(s)) ? s : ''; };
const okHref = (v) => { const s = String(v || '').trim(); return s.length <= 300 && /^\/(?!\/)[^\s"'<>\\]*$/.test(s) && !/^\/(?:api|admin)(?:[/.?#]|$)/i.test(s) ? s : ''; };
const makeId = (prefix, bytes) => prefix + '-' + crypto.randomBytes(bytes || 4).toString('hex');
const now = () => new Date().toISOString();
/* the same test under the address of its card and the key of its saved result (testKeyOf in assets/js/app.js) */
function testKeyOf(href) {
  const h = String(href == null ? '' : href).trim();
  const id = /^\/(writing\/|test)\?(?:.*&)?id=([^&#]+)/.exec(h);
  if (id) { let v = id[2]; try { v = decodeURIComponent(v); } catch (e) { /* keep */ } return (id[1] === 'test' ? '/test/' : '/writing/') + v; }
  let p = h.split(/[?#]/)[0]; try { p = decodeURIComponent(p); } catch (e) { /* keep */ }
  return p.replace(/\.html$/i, '').replace(/\/index$/i, '').replace(/\/+$/, '').toLowerCase();
}
/* how answers are compared: case, curly quotes, a full stop at the end and double spaces do not matter */
const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/[‘’`´]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().replace(/[.!?,;:]+$/g, '').trim();
const TF_ALIASES = { t: 'True', true: 'True', f: 'False', false: 'False', ng: 'Not Given', 'not given': 'Not Given', notgiven: 'Not Given', y: 'Yes', yes: 'Yes', n: 'No', no: 'No' };

/* ───────── what the admin saves ───────── */
function cleanExercise(x, n, HttpError, unitTitle) {
  const q = text(x && x.q, 600);
  if (!q) return null;
  let type = EX_TYPES.includes(x.type) ? x.type : (Array.isArray(x.options) && x.options.filter((o) => line(o, 1)).length ? 'choice' : 'gap');
  let options = []; let answer = '';
  const where = `"${unitTitle}", exercise ${n + 1}`;
  if (type === 'tfng' || type === 'yng') {
    options = type === 'tfng' ? TFNG : YNNG;
    const a = TF_ALIASES[norm(x.answer)] || line(x.answer, 20);
    answer = options.find((o) => norm(o) === norm(a)) || '';
    if (!answer) throw new HttpError(400, `${where}: the answer must be ${options.join(', ')}.`);
  } else if (type === 'choice') {
    options = (Array.isArray(x.options) ? x.options : []).map((o) => line(o, 200)).filter(Boolean).slice(0, 8);
    if (options.length < 2) throw new HttpError(400, `${where}: a choice question needs at least two options.`);
    const k = Number.isInteger(x.answer) ? x.answer : options.findIndex((o) => norm(o) === norm(x.answer));
    answer = options[k] || '';
    if (!answer) throw new HttpError(400, `${where}: choose which option is right.`);
  } else {
    answer = String(x.answer == null ? '' : x.answer).split('|').map((a) => line(a, 120)).filter(Boolean).slice(0, 8).join('|');
    if (!answer) throw new HttpError(400, `${where}: type the right answer (several right answers: a|b).`);
  }
  return { id: EX_RE.test(String(x.id || '')) ? x.id : makeId('e', 3), type, q, options: type === 'choice' ? options : [], answer, explain: text(x.explain, 500) };
}
function cleanUnit(b, old, HttpError) {
  const title = line(b.title, 160);
  if (!title) throw new HttpError(400, 'Every unit needs a title.');
  const list = Array.isArray(b.exercises) ? b.exercises : [];
  if (list.length > MAX_EX) throw new HttpError(400, `Keep at most ${MAX_EX} exercises in one unit.`);
  const exercises = list.map((x, n) => cleanExercise(x, n, HttpError, title)).filter(Boolean);
  const seen = new Set(); exercises.forEach((x) => { while (seen.has(x.id)) x.id = makeId('e', 3); seen.add(x.id); });
  const content = text(b.content, 60000);
  const parsed = doc.parse(content);
  if (parsed.errors.length) throw new HttpError(400, `"${title}": ` + parsed.errors.slice(0, 4).join(' · ') + (parsed.errors.length > 4 ? ` (and ${parsed.errors.length - 4} more)` : ''));
  const audio = okUrl(b.audio);
  if (b.audio && !audio) throw new HttpError(400, `"${title}": the recording must be uploaded here or be an https:// link.`);
  const test = okHref(b.test);
  if (b.test && !test) throw new HttpError(400, `"${title}": the test link must be a page of this website (for example /full-tests/reading/test-3).`);
  if (!content && !exercises.length && !test) throw new HttpError(400, `"${title}": write the text of the unit, add exercises or link a test.`);
  const minutes = Math.floor(Number(b.minutes));
  return {
    id: old ? old.id : makeId('u'), title, kind: KINDS.includes(b.kind) ? b.kind : 'lesson',
    summary: text(b.summary, 300), minutes: minutes > 0 && minutes <= 600 ? minutes : 0,
    content, points: parsed.points, audio, test, testLabel: test ? line(b.testLabel, 120) : '', exercises,
    createdAt: (old && old.createdAt) || now(), updatedAt: now()
  };
}
/* exercises = the number of points of the unit: its simple exercises and every gap / question of its book page */
const headOf = (u) => ({ id: u.id, title: u.title, kind: u.kind, summary: u.summary || '', minutes: u.minutes || 0, exercises: (u.exercises || []).length + (u.points || 0), audio: !!u.audio, test: u.test || '', testLabel: u.testLabel || '', updatedAt: u.updatedAt || null });

/* ───────── storage ───────── */
const indexKey = (bookId) => 'ebook:' + bookId;
const unitKey = (bookId, unitId) => 'ebook-unit:' + bookId + ':' + unitId;
const progKey = (userId) => 'ebook-progress:' + userId;
const styleOf = (v) => (v && STYLES.includes(v.style) ? v.style : 'site');
async function loadIndex(ctx, bookId) {
  let v = null; try { v = await ctx.store.getSetting(indexKey(bookId)); } catch (e) { v = null; }
  return { units: v && Array.isArray(v.units) ? v.units.filter((h) => h && UNIT_RE.test(String(h.id))) : [], style: styleOf(v), updatedAt: (v && v.updatedAt) || null };
}
async function saveIndex(ctx, bookId, idx) { idx.updatedAt = now(); await ctx.store.setSetting(indexKey(bookId), { units: idx.units, style: styleOf(idx), updatedAt: idx.updatedAt }); return idx; }
/* the units and the design of many books in one read: { <bookId>: { units: [head], style } } */
async function loadIndexMap(ctx, bookIds) {
  const ids = [...new Set(bookIds)].filter((id) => BOOK_RE.test(id));
  const out = {}; ids.forEach((id) => { out[id] = { units: [], style: 'site' }; });
  if (!ids.length) return out;
  let map = new Map(); try { map = await ctx.store.getSettings(ids.map(indexKey)); } catch (e) { map = new Map(); }
  ids.forEach((id) => { const v = map.get(indexKey(id)); out[id] = { units: v && Array.isArray(v.units) ? v.units.filter((h) => h && UNIT_RE.test(String(h.id))) : [], style: styleOf(v) }; });
  return out;
}
/* the units of many books: { <bookId>: [head] } (teachers.js) */
async function loadIndexes(ctx, bookIds) {
  const m = await loadIndexMap(ctx, bookIds); const out = {};
  Object.keys(m).forEach((id) => { out[id] = m[id].units; });
  return out;
}
async function loadUnit(ctx, bookId, unitId) { try { return await ctx.store.getSetting(unitKey(bookId, unitId)); } catch (e) { return null; } }
async function loadBooks(ctx) {
  let v = null; try { v = await ctx.store.getSetting('panel-books'); } catch (e) { v = null; }
  return v && Array.isArray(v.items) ? v.items.filter((x) => x && BOOK_RE.test(String(x.id))) : [];
}
const emptyProg = () => ({ books: {}, updatedAt: null });
async function loadProgress(ctx, userId) {
  let v = null; try { v = await ctx.store.getSetting(progKey(userId)); } catch (e) { v = null; }
  return v && v.books && typeof v.books === 'object' ? v : emptyProg();
}
/* the progress of many students in one read: Map userId -> progress */
async function loadProgressMany(ctx, userIds) {
  const out = new Map(); const ids = [...new Set(userIds)].filter(Boolean);
  for (let i = 0; i < ids.length; i += 100) {
    const part = ids.slice(i, i + 100);
    let map = new Map(); try { map = await ctx.store.getSettings(part.map(progKey)); } catch (e) { map = new Map(); }
    part.forEach((id) => { const v = map.get(progKey(id)); out.set(id, v && v.books && typeof v.books === 'object' ? v : emptyProg()); });
  }
  return out;
}
async function saveProgress(ctx, userId, prog) { prog.updatedAt = now(); await ctx.store.setSetting(progKey(userId), prog); return prog; }

/* ───────── how much of a book is learned ───────── */
function unitStatus(h, p, keys) {
  p = p || {};
  const ex = h.exercises || 0;
  let done = false;
  if (ex) done = !!p.total && p.best / p.total >= PASS;
  else if (h.test) done = !!(keys && keys.has(testKeyOf(h.test))) || !!p.read;
  else done = !!p.read;
  const started = done || !!p.read || !!p.attempts || !!(h.test && keys && keys.has(testKeyOf(h.test)));
  return { done, started, best: p.best || 0, total: p.total || ex, last: p.last == null ? null : p.last, attempts: p.attempts || 0, lastAt: p.lastAt || null, doneAt: p.doneAt || null, tasks: p.tasks || {} };
}
/* units = the heads of the book, bp = the student's progress in this book, keys = Set of the keys of their finished tests */
function summarize(units, bp, keys) {
  bp = bp || {}; const up = bp.units || {};
  let done = 0, started = 0, correct = 0, answered = 0, exTotal = 0, exDone = 0;
  const status = {};
  for (const h of units) {
    const s = unitStatus(h, up[h.id], keys);
    status[h.id] = s;
    if (s.done) done += 1;
    if (s.started) started += 1;
    if (h.exercises) { exTotal += h.exercises; if (s.attempts) { correct += s.best; answered += s.total || h.exercises; exDone += 1; } }
  }
  const total = units.length;
  const next = units.find((h) => !status[h.id].done);
  return {
    total, done, left: total - done, started, percent: total ? Math.round((done / total) * 100) : 0,
    accuracy: answered ? Math.round((correct / answered) * 100) : null, correct, answered, exercises: exTotal,
    startedAt: bp.startedAt || null, lastAt: bp.lastAt || null, lastUnit: bp.lastUnit || null, next: next ? next.id : null, status
  };
}

/* ───────── what a visitor may see ───────── */
function bookView(b, level, units, style) {
  const locked = level < (LEVEL[b.plan] || 0);
  const out = { id: b.id, title: b.title, author: b.author || '', description: b.description || '', category: b.category || '', level: b.level || '', plan: b.plan || 'free',
    cover: b.cover || '', pages: b.pages || 0, hasFile: !!b.file, locked, units: units.length, exercises: units.reduce((a, h) => a + (h.exercises || 0), 0),
    minutes: units.reduce((a, h) => a + (h.minutes || 0), 0), style: style || 'site', updatedAt: b.updatedAt || null };
  if (!locked) out.file = b.file || '';
  return out;
}
/* the book page of a unit: its blocks (for the page) and the key of its answers (only here) — the simple exercises are
   its last exercise */
function docOf(u) {
  const p = doc.parse(u.content || '');
  const lg = doc.legacyTask(u.exercises);
  const blocks = lg.block ? p.blocks.concat([lg.block]) : p.blocks;
  return { blocks, key: { ...p.key, ...lg.key }, total: p.points + lg.points, errors: p.errors };
}
/* a unit for the student: its book page and exercises, without their answers */
function unitForStudent(u) {
  const d = docOf(u);
  return { ...headOf(u), exercises: (u.exercises || []).map((x) => ({ id: x.id, type: x.type, q: x.q, options: x.type === 'tfng' ? TFNG : x.type === 'yng' ? YNNG : x.options || [] })),
    audio: u.audio || '', doc: d.blocks, points: d.total };
}
const priceLink = (b) => '/Price?premium=required&plan=' + encodeURIComponent(b.plan) + '&next=' + encodeURIComponent('/books#' + b.id);

async function resultKeys(ctx, userId) {
  try { return new Set((await ctx.store.listResults(userId, 1000)).map((r) => testKeyOf(r.testKey))); } catch (e) { return new Set(); }
}

/* GET  /api/ebooks                          the books with their units count and my progress
   GET  /api/ebooks/<book>                   one book: its units and my progress (403 when locked)
   GET  /api/ebooks/<book>/<unit>            one unit: its text and exercises (no answers)
   POST /api/ebooks/<book>/<unit>/read       "I have read it"
   POST /api/ebooks/<book>/<unit>/check      { answers: { <exerciseId>: value } } -> checked by the server, best score kept
   POST /api/ebooks/<book>/reset             start the book again (my progress in it is cleared) */
async function route(req, res, p, method, ctx) {
  const { send, HttpError, readJson } = ctx;
  const m = /^\/api\/ebooks(?:\/(b-[a-f0-9]{8})(?:\/(u-[a-f0-9]{8})(?:\/(read|check))?|\/(reset))?)?$/.exec(p);
  if (!m) throw new HttpError(404, 'Not found.');
  const [, bookId, unitId, unitAct, bookAct] = m;
  const post = !!(unitAct || bookAct);
  if (post ? method !== 'POST' : method !== 'GET' && method !== 'HEAD') throw new HttpError(405, 'Method not allowed.');
  ctx.rateLimit('ebooks:' + ctx.clientIp(req), 400, 60000);
  const u = await ctx.currentUser(req).catch(() => null);
  const admin = ctx.isAdmin(u); const level = ctx.userLevel(u);
  const headers = { 'Cache-Control': 'no-store, private' };
  const books = (await loadBooks(ctx)).filter((b) => b.published !== false || admin);

  if (!bookId) {
    const map = await loadIndexMap(ctx, books.map((b) => b.id));
    const idx = {}; Object.keys(map).forEach((id) => { idx[id] = map[id].units; });
    const prog = u ? await loadProgress(ctx, u.id) : null;
    const keys = u ? await resultKeys(ctx, u.id) : null;
    const items = books.map((b) => {
      const v = bookView(b, level, idx[b.id] || [], (map[b.id] || {}).style);
      if (prog && idx[b.id] && idx[b.id].length) { const s = summarize(idx[b.id], prog.books[b.id], keys); delete s.status; v.progress = s; }
      return v;
    });
    return send(res, 200, { signedIn: !!u, level, plan: ['free', 'standard', 'max', 'ultra'][Math.min(3, level)], items }, headers);
  }

  const book = books.find((b) => b.id === bookId);
  if (!book) throw new HttpError(404, 'This book is not available.');
  const idx = await loadIndex(ctx, bookId);
  const view = bookView(book, level, idx.units, idx.style);
  if (view.locked) return send(res, 403, { error: u ? `This book is for ${PLAN_NAME[book.plan]} members.` : 'Sign in to open this book.', locked: true, signedIn: !!u, book: view, price: priceLink(book) }, headers);

  if (!unitId && !bookAct) {
    const prog = u ? await loadProgress(ctx, u.id) : null;
    const keys = u ? await resultKeys(ctx, u.id) : null;
    return send(res, 200, { signedIn: !!u, book: view, units: idx.units, progress: prog ? summarize(idx.units, prog.books[bookId], keys) : null }, headers);
  }
  if (bookAct === 'reset') {
    if (!u) throw new HttpError(401, 'Please sign in.');
    const prog = await loadProgress(ctx, u.id);
    delete prog.books[bookId];
    await saveProgress(ctx, u.id, prog);
    return send(res, 200, { ok: true, progress: summarize(idx.units, null, await resultKeys(ctx, u.id)) }, headers);
  }

  const head = idx.units.find((h) => h.id === unitId);
  const unit = head ? await loadUnit(ctx, bookId, unitId) : null;
  if (!head || !unit) throw new HttpError(404, 'This unit is not available.');
  const pos = idx.units.indexOf(head);
  const nav = { index: pos, prev: pos > 0 ? idx.units[pos - 1].id : null, next: pos < idx.units.length - 1 ? idx.units[pos + 1].id : null };

  if (!unitAct) {
    let mine = null;
    if (u) { const prog = await loadProgress(ctx, u.id); const keys = head.test ? await resultKeys(ctx, u.id) : null; mine = unitStatus(head, ((prog.books[bookId] || {}).units || {})[unitId], keys); }
    return send(res, 200, { signedIn: !!u, book: { id: view.id, title: view.title, units: view.units, style: view.style }, unit: unitForStudent(unit), nav, mine }, headers);
  }

  // read / check: only for a signed-in student (the result is kept on the account)
  if (!u) throw new HttpError(401, 'Sign in to save your progress.');
  ctx.rateLimit('ebook-check:' + u.id, 240, 60 * 60000);
  const prog = await loadProgress(ctx, u.id);
  const bp = prog.books[bookId] || (prog.books[bookId] = { units: {}, startedAt: now() });
  bp.units = bp.units || {};
  const up = bp.units[unitId] || (bp.units[unitId] = {});
  bp.lastAt = now(); bp.lastUnit = unitId; up.lastAt = bp.lastAt;
  let out = {};
  if (unitAct === 'read') {
    if (!up.read) up.read = bp.lastAt;
  } else {
    // { answers: { <id>: value }, task: <exercise id> } — one exercise, or the whole unit when there is no task
    const body = (await readJson(req, 128 * 1024)) || {};
    const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
    const only = typeof body.task === 'string' ? body.task.slice(0, 12) : '';
    const D = docOf(unit);
    if (!D.total) throw new HttpError(400, 'This unit has no exercises.');
    const ids = Object.keys(D.key).filter((id) => !only || D.key[id].task === only);
    if (!ids.length) throw new HttpError(400, 'This exercise has nothing to check. Reload the page.');
    const results = ids.map((id) => {
      const k = D.key[id]; let given = answers[id];
      given = Array.isArray(given) ? given.slice(0, 12).map((x) => String(x).slice(0, 20)) : String(given == null ? '' : given).slice(0, 300);
      const r = doc.isRight(k, given); const got = typeof r === 'number' ? r : r ? k.p : 0;
      return { id, task: k.task, ok: got === k.p, got, points: k.p, answer: doc.shown(k), answers: k.k === 'gap' ? k.a : [doc.shown(k)], explain: k.why || '' };
    });
    const correct = results.reduce((a, r) => a + r.got, 0), total = results.reduce((a, r) => a + r.points, 0);
    if (up.total !== D.total) { up.best = 0; up.tasks = {}; up.base = 0; }   // the unit was changed since the last try: its old best does not count
    else if (!up.tasks) { up.tasks = {}; up.base = up.best || 0; }         // kept from before the exercises were checked one by one
    const per = {}; results.forEach((r) => { per[r.task] = (per[r.task] || 0) + r.got; });
    Object.keys(per).forEach((t) => { up.tasks[t] = Math.max(up.tasks[t] || 0, per[t]); });
    const sum = Object.values(up.tasks).reduce((a, v) => a + v, 0);
    up.best = Math.min(D.total, Math.max(up.base || 0, sum)); up.total = D.total; up.last = correct; up.attempts = (up.attempts || 0) + 1;
    if (!up.read) up.read = bp.lastAt;
    const passed = up.best / D.total >= PASS;
    if (passed && !up.doneAt) up.doneAt = bp.lastAt;
    out = { results, correct, total, percent: Math.round((correct / total) * 100), best: up.best, unitTotal: D.total, task: only || null, passed, pass: Math.round(PASS * 100) };
  }
  const keys = await resultKeys(ctx, u.id);
  const s = unitStatus(head, up, keys);
  if (s.done && !up.doneAt) up.doneAt = bp.lastAt;
  await saveProgress(ctx, u.id, prog);
  const sum = summarize(idx.units, bp, keys); delete sum.status;
  return send(res, 200, { ...out, mine: unitStatus(head, up, keys), progress: sum, nav }, headers);
}

/* ───────── admin ─────────
   GET    /api/admin/ebooks                      every book with its number of units and exercises
   GET    /api/admin/ebooks/<book>               the book and all its units (with the answers)
   POST   /api/admin/ebooks/<book>/units         { unit }  make one, or change it (same id)
   POST   /api/admin/ebooks/<book>/order         { ids }
   DELETE /api/admin/ebooks/<book>/units/<unit>
   POST   /api/admin/ebooks/sample               adds the sample e-book (a new book on the Books page, with 5 units) */
async function adminRoute(req, res, p, method, ctx) {
  const { send, readJson, HttpError, admin, audit } = ctx;
  const nc = { 'Cache-Control': 'no-store' };
  if (p === '/api/admin/ebooks' && method === 'GET') {
    const books = await loadBooks(ctx); const map = await loadIndexMap(ctx, books.map((b) => b.id));
    return send(res, 200, { books: books.map((b) => { const x = map[b.id] || { units: [], style: 'site' }; return { id: b.id, title: b.title, author: b.author || '', cover: b.cover || '', plan: b.plan || 'free', published: b.published !== false, level: b.level || '', category: b.category || '', hasFile: !!b.file,
      units: x.units.length, exercises: x.units.reduce((a, h) => a + (h.exercises || 0), 0), style: x.style }; }) }, nc);
  }
  if (p === '/api/admin/ebooks/sample' && method === 'POST') {
    const samples = require('./ebooks-sample');
    const which = String(((await readJson(req)) || {}).which || 'starter');
    const sample = which !== 'starter' && samples.samples && samples.samples[which] ? samples.samples[which] : samples;
    const data = await ctx.store.getSetting('panel-books', { fresh: true }).catch(() => null) || { items: [] };
    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length >= 500) throw new HttpError(400, 'Keep at most 500 books: delete old ones first.');
    const t = now();
    const book = { id: makeId('b'), title: sample.book.title, plan: 'free', published: true, category: sample.book.category, level: sample.book.level, createdAt: t, updatedAt: t,
      author: sample.book.author, description: sample.book.description, cover: '', file: '', pages: 0 };
    const units = sample.units.map((x) => cleanUnit(x, null, HttpError));
    for (const unit of units) await ctx.store.setSetting(unitKey(book.id, unit.id), unit);
    await saveIndex(ctx, book.id, { units: units.map(headOf), style: sample.style || 'site' });
    items.unshift(book);
    await ctx.store.setSetting('panel-books', { items, updatedAt: t });
    await audit(admin, 'ebook.sample', book.title, { units: units.length });
    return send(res, 201, { book: { id: book.id, title: book.title }, units: units.length }, nc);
  }
  const m = /^\/api\/admin\/ebooks\/(b-[a-f0-9]{8})(?:\/(units|order|style|preview)(?:\/(u-[a-f0-9]{8}))?)?$/.exec(p);
  if (!m) throw new HttpError(404, 'API endpoint not found.');
  const [, bookId, what, unitId] = m;
  const book = (await loadBooks(ctx)).find((b) => b.id === bookId);
  if (!book) throw new HttpError(404, 'This book was deleted. Reload the page.');
  const idx = await loadIndex(ctx, bookId);
  const full = async () => {
    const map = idx.units.length ? await ctx.store.getSettings(idx.units.map((h) => unitKey(bookId, h.id))).catch(() => new Map()) : new Map();
    return idx.units.map((h) => map.get(unitKey(bookId, h.id))).filter(Boolean);
  };
  const out = async (status, extra) => send(res, status || 200, { book: { id: book.id, title: book.title, author: book.author || '', cover: book.cover || '', plan: book.plan || 'free', published: book.published !== false }, style: idx.style, units: await full(), updatedAt: idx.updatedAt, ...(extra || {}) }, nc);
  if (!what && method === 'GET') return out();
  if (what === 'style' && !unitId && method === 'POST') {
    const style = String(((await readJson(req)) || {}).style || '');
    if (!STYLES.includes(style)) throw new HttpError(400, 'Choose a design: ' + STYLES.join(', ') + '.');
    idx.style = style; await saveIndex(ctx, bookId, idx);
    await audit(admin, 'ebook.style', book.title, { style });
    return out();
  }
  /* the book page of a unit as the student will see it (with its answers, for the admin), before it is saved */
  if (what === 'preview' && !unitId && method === 'POST') {
    const b = (await readJson(req, 512 * 1024)) || {};
    const content = text(b.content, 60000);
    const exercises = (Array.isArray(b.exercises) ? b.exercises : []).slice(0, MAX_EX).map((x, n) => ({ id: 'p-' + n, type: EX_TYPES.includes(x && x.type) ? x.type : 'gap', q: text(x && x.q, 600), options: Array.isArray(x && x.options) ? x.options.map((o) => line(o, 200)).filter(Boolean) : [], answer: line(x && x.answer, 300), explain: text(x && x.explain, 500) })).filter((x) => x.q);
    const d = docOf({ content, exercises });
    return send(res, 200, { style: idx.style, doc: d.blocks, key: d.key, points: d.total, errors: d.errors }, nc);
  }
  if (what === 'units' && !unitId && method === 'POST') {
    const b = await readJson(req, 512 * 1024); const body = b && b.unit && typeof b.unit === 'object' ? b.unit : b || {};
    const i = body.id ? idx.units.findIndex((h) => h.id === body.id) : -1;
    if (body.id && i < 0) throw new HttpError(404, 'This unit was deleted. Reload the page.');
    if (i < 0 && idx.units.length >= MAX_UNITS) throw new HttpError(400, `Keep at most ${MAX_UNITS} units in one book.`);
    const old = i >= 0 ? await loadUnit(ctx, bookId, body.id) : null;
    const unit = cleanUnit(body, old || (i >= 0 ? { id: body.id } : null), HttpError);
    await ctx.store.setSetting(unitKey(bookId, unit.id), unit);
    if (i >= 0) idx.units[i] = headOf(unit);
    else if (Number.isInteger(body.at) && body.at >= 0 && body.at < idx.units.length) idx.units.splice(body.at, 0, headOf(unit));
    else idx.units.push(headOf(unit));
    await saveIndex(ctx, bookId, idx);
    await audit(admin, 'ebook.unit', book.title + ' — ' + unit.title, { exercises: unit.exercises.length });
    return out(i >= 0 ? 200 : 201, { unit });
  }
  if (what === 'order' && method === 'POST') {
    const ids = ((await readJson(req)).ids || []).map(String);
    const pos = new Map(ids.map((id, n) => [id, n]));
    idx.units.sort((a, b) => (pos.has(a.id) ? pos.get(a.id) : 1e6) - (pos.has(b.id) ? pos.get(b.id) : 1e6));
    await saveIndex(ctx, bookId, idx);
    return out();
  }
  if (what === 'units' && unitId && method === 'DELETE') {
    const h = idx.units.find((x) => x.id === unitId); if (!h) throw new HttpError(404, 'This unit was not found.');
    idx.units = idx.units.filter((x) => x.id !== unitId);
    await ctx.store.deleteSetting(unitKey(bookId, unitId));
    await saveIndex(ctx, bookId, idx);
    await audit(admin, 'ebook.unit.delete', book.title + ' — ' + h.title);
    return out();
  }
  throw new HttpError(405, 'Method not allowed.');
}

/* a book was deleted in Admin → Books: its units go too (the students' progress in it is simply never shown again) */
async function forgetBook(ctx, bookId) {
  if (!BOOK_RE.test(String(bookId))) return;
  await ctx.store.deleteSettings('ebook-unit:' + bookId + ':').catch(() => {});
  await ctx.store.deleteSetting(indexKey(bookId)).catch(() => {});
}

module.exports = { route, adminRoute, forgetBook, loadBooks, loadIndexes, loadIndexMap, loadProgressMany, summarize, testKeyOf, docOf, PASS, KINDS, EX_TYPES, STYLES };
