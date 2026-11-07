'use strict';
/* ====
   mock-tests.js -- Full Mock Tests (server only, never sent to a browser as a file).

   A mock test is Listening + Reading + Writing in one sitting (the exam shell full-mock/index.html). Each paper of a mock
   is one of:
     random    a built-in paper drawn on the server (full-mock/js/tests.js), a new one for every attempt of a student
     builtin   one fixed built-in paper                                   ( 'b:<id>' )
     material  a Full test made in the admin panel (it may be a Draft:   ( 'm:<uuid>' )
               a paper kept only for mocks)

     GET    /api/mocks                       the cards of the Mock Tests page (no paper is named), with the student's own attempts
     POST   /api/mocks/<id>/start            {mode}   -> papers + a signed attempt (cookie ieltsx_mock, 8 hours)
     POST   /api/mock/resume                 {token}  -> the same attempt again (after a reload)
     POST   /api/mock/finish                 {token, listening:{answers}, reading:{answers}, viol}  -> bands, worked out here
     GET    /full-mock/paper/<kind>/<uuid>   the page of an admin-made paper (only inside an attempt that has it)
     GET/POST/PATCH/DELETE /api/admin/mocks  the admin panel (Mock tests)

   Security
   - Papers are drawn on the server, never in the browser. The attempt is a signed token (HMAC, SESSION_SECRET) that names
     the account and its three papers; it is kept in an HttpOnly cookie, so a paper page (with its answers inside) is sent
     only to the student who was given it, during the attempt. js/tests.js (every paper and every Writing task) is never
     sent. On Vercel, middleware.js asks /api/access/check before it sends a paper file.
   - The bands are worked out here: the answers are marked again against the answer key on the server (built-in Reading:
     the paper's own data; built-in Listening: full-mock/js/listening.js; admin-made papers: the test in the database), with
     the same rule as the exam pages. A score the page claims is never trusted; a difference is kept as a flag.
   - An attempt is finished once. Who may start a mock follows its plan (Free / Standard / Max / Ultra), like every test.
   ==== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const DIR = path.join(__dirname, 'full-mock');
const KINDS = ['listening', 'reading', 'writing'];
const ACCESS = ['free', 'standard', 'max', 'ultra'];
const MODES = ['both', 'real', 'practice'];
const SOURCES = ['random', 'builtin', 'material'];
const COOKIE = 'ieltsx_mock';
const TTL_MS = 8 * 3600 * 1000;
const SETTING = 'mock-tests';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PLAN_NAME = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };

const line = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const text = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0009\u000b-\u001f\u007f<>]/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, n);
const json = (o) => JSON.parse(JSON.stringify(o));

/* ───────── the built-in papers (full-mock/js/tests.js), read once ───────── */
let POOL = null;
function pool() {
  if (POOL) return POOL;
  try {
    const c = { window: {} }; vm.createContext(c);
    vm.runInContext(fs.readFileSync(path.join(DIR, 'js', 'tests.js'), 'utf8'), c, { timeout: 2000 });
    const p = json(c.window.MOCK_POOL || {});
    const file = (e) => e && /^[\w.-]{1,40}$/.test(e.id) && /^(listening|reading)-[\w.-]+\.html$/.test(String(e.file || '')) && fs.existsSync(path.join(DIR, e.file));
    POOL = {
      listening: (p.listening || []).filter(file).map((e) => ({ id: e.id, file: e.file })),
      reading: (p.reading || []).filter(file).map((e) => ({ id: e.id, file: e.file })),
      writing: (p.writing || []).filter((e) => e && /^[\w.-]{1,40}$/.test(e.id) && e.writing && e.writing.task1 && e.writing.task2).map((e) => ({ id: e.id, writing: e.writing }))
    };
  } catch (e) { console.warn('full-mock/js/tests.js could not be read:', e.message); POOL = { listening: [], reading: [], writing: [] }; }
  return POOL;
}
const builtinOf = (kind, id) => pool()[kind].find((e) => e.id === id) || null;
/* the built-in paper a page file belongs to (/full-mock/reading-m9.html -> reading m9) */
function builtinByFile(file) {
  const name = String(file || '').toLowerCase().replace(/^\/full-mock\//, '').replace(/\.html$/, '') + '.html';
  for (const kind of ['listening', 'reading']) { const e = pool()[kind].find((x) => x.file.toLowerCase() === name); if (e) return { kind, id: e.id }; }
  return null;
}

/* ───────── answer keys and marking (the same rule as the exam pages: reading.js / listening.js normAnswer) ───────── */
function normAnswer(v) {
  return String(v == null ? '' : v).normalize('NFKC').toLowerCase()
    .replace(/[‘’ʼ`]/g, "'").replace(/[“”]/g, '"').replace(/[‐-―-]+/g, ' ')
    .replace(/^[\s.,;:!?"']+|[\s.,;:!?"']+$/g, '').replace(/\s+/g, ' ').trim();
}
function variants(correct) {
  const out = [];
  String(correct == null ? '' : correct).split('|').forEach((a) => {
    out.push(normAnswer(a.replace(/[()]/g, ' ')));
    if (a.indexOf('(') !== -1) out.push(normAnswer(a.replace(/\([^)]*\)/g, ' ')));
  });
  return out.filter(Boolean);
}
const matches = (given, correct) => { const g = normAnswer(given); return !!g && variants(correct).includes(g); };

function readingKeyOf(html) {
  const a = html.indexOf('window.READING_TEST = (function'); const b = a < 0 ? -1 : html.indexOf('</script>', a);
  if (a < 0 || b < 0) return null;
  const c = { window: {} }; vm.createContext(c);
  vm.runInContext(html.slice(a, b), c, { timeout: 2000 });
  return sectionsKey(json((c.window.READING_TEST || {}).SECTIONS || {}));
}
function sectionsKey(SECTIONS) {
  const key = {};
  Object.values(SECTIONS || {}).forEach((list) => (list || []).forEach((sec) => (sec.items || []).forEach((it) => {
    if (it && it.id != null && it.answer != null && String(it.answer).trim()) key[String(it.id)] = String(it.answer);
  })));
  return Object.keys(key).length ? key : null;
}
const keyCache = new Map();
function builtinReadingKey(id) {
  const k = 'r:' + id; if (keyCache.has(k)) return keyCache.get(k);
  const e = builtinOf('reading', id); let key = null;
  try { if (e) key = readingKeyOf(fs.readFileSync(path.join(DIR, e.file), 'utf8')); } catch (x) { console.warn('Mock reading key ' + id + ':', x.message); }
  keyCache.set(k, key); return key;
}
let LKEYS = null;
function builtinListeningKey(id) {
  if (!LKEYS) {
    LKEYS = {};
    try {
      const src = fs.readFileSync(path.join(DIR, 'js', 'listening.js'), 'utf8');
      const re = /TEST_PACKS\['([\w.-]+)'\]=\(function\(\)\{\s*const LISTENING_ANSWERS\s*=\s*(\{[\s\S]*?\});/g; let m;
      while ((m = re.exec(src))) { try { LKEYS[m[1]] = JSON.parse(m[2]); } catch (x) { /* that pack is marked by the page only */ } }
      const al = /TEST_PACKS\['([\w.-]+)'\]=TEST_PACKS\['([\w.-]+)'\];/g;
      while ((m = al.exec(src))) if (LKEYS[m[2]]) LKEYS[m[1]] = LKEYS[m[2]];
    } catch (x) { console.warn('Mock listening keys:', x.message); }
  }
  // the paper page picks its pack with <html data-test="…">
  const e = builtinOf('listening', id); if (!e) return null;
  const k = 'l:' + id; if (keyCache.has(k)) return keyCache.get(k);
  let pack = id;
  try { const m = /<html[^>]*\bdata-test="([\w.-]+)"/.exec(fs.readFileSync(path.join(DIR, e.file), 'utf8').slice(0, 600)); if (m) pack = m[1]; } catch (x) { /* the id */ }
  const key = LKEYS[pack] ? Object.fromEntries(Object.entries(LKEYS[pack]).map(([q, a]) => [String(q), String(a)])) : null;
  keyCache.set(k, key); return key;
}
async function materialKey(ctx, kind, id) {
  const m = await ctx.store.getMaterial(id); if (!m || m.type !== kind) return null;
  if (kind === 'reading') return sectionsKey(require('./reading-exam').buildData(m).SECTIONS);
  const answers = (require('./listening-exam').buildConfig(m).cfg || {}).answers || {};
  const key = {}; Object.entries(answers).forEach(([q, a]) => { if (String(a || '').trim()) key[String(q)] = String(a); });
  return Object.keys(key).length ? key : null;
}
async function keyFor(ctx, kind, ref) {
  const [src, id] = String(ref || '').split(/:(.+)/);
  if (src === 'b') return kind === 'reading' ? builtinReadingKey(id) : builtinListeningKey(id);
  if (src === 'm' && UUID.test(id)) return materialKey(ctx, kind, id);
  return null;
}
/* the answers a page sends: { "1": "river", "21-22": "B, D" } -> one per question number */
function cleanAnswers(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  Object.entries(raw).slice(0, 120).forEach(([q, v]) => {
    const val = String(v == null ? '' : v).slice(0, 200);
    const range = /^(\d{1,3})-(\d{1,3})$/.exec(String(q));
    if (range) { const vals = val.split(',').map((x) => x.trim()); for (let i = +range[1], j = 0; i <= +range[2] && i <= 120; i++, j++) out[String(i)] = vals[j] || ''; }
    else if (/^\d{1,3}$/.test(String(q))) out[String(+q)] = val;
  });
  return out;
}
function mark(key, answers) {
  const ids = Object.keys(key);
  const correct = ids.filter((q) => matches(answers[q], key[q])).length;
  return { correct, total: ids.length };
}

/* ───────── the catalog (kept in the settings: "mock-tests") ───────── */
const RANDOM_ID = 'random';
const defaultRandom = () => ({ id: RANDOM_ID, builtin: true, title: 'Full Mock Test', description: 'Listening, Reading and Writing in one sitting, timed like the real exam. Every attempt gets new papers.',
  coverUrl: '', tier: '', access: 'standard', modes: 'both', published: true, order: 0,
  papers: { listening: { src: 'random' }, reading: { src: 'random' }, writing: { src: 'random' } }, createdAt: '2026-10-20T00:00:00.000Z' });
async function getMocks(ctx, fresh) {
  let v = null;
  try { v = await ctx.store.getSetting(SETTING, { fresh: !!fresh }); }
  catch (e) { if (fresh) throw e; }   // a change must never start from an empty list (it would delete every mock)
  const list = (Array.isArray(v && v.mocks) ? v.mocks : []).filter((m) => m && m.id);
  if (!list.some((m) => m.id === RANDOM_ID)) list.push(defaultRandom());
  return list.sort((a, b) => (a.order || 999) - (b.order || 999) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}
const saveMocks = (ctx, mocks) => ctx.store.setSetting(SETTING, { mocks, updatedAt: new Date().toISOString() });
const ruleOf = (m) => (m.access === 'free' ? { locked: false, plan: 'standard' } : { locked: true, plan: ACCESS.includes(m.access) ? m.access : 'standard' });

async function cleanMock(ctx, b, cur) {
  b = b && typeof b === 'object' ? b : {};
  const pick = (k) => (b[k] !== undefined ? b[k] : cur ? cur[k] : undefined);
  const title = line(pick('title'), 90); if (!title) throw new ctx.HttpError(400, 'The mock test needs a name.');
  const papers = {};
  for (const kind of KINDS) {
    const p = (b.papers && b.papers[kind]) || (cur && cur.papers && cur.papers[kind]) || { src: 'random' };
    const src = SOURCES.includes(p.src) ? p.src : 'random';
    const name = kind.charAt(0).toUpperCase() + kind.slice(1);
    if (src === 'random') {
      if (!pool()[kind].length) throw new ctx.HttpError(400, `There are no built-in ${name} papers to draw from: choose a ${name} test.`);
      papers[kind] = { src }; continue;
    }
    if (src === 'builtin') {
      if (!builtinOf(kind, String(p.id || ''))) throw new ctx.HttpError(400, `This built-in ${name} paper does not exist.`);
      papers[kind] = { src, id: String(p.id) }; continue;
    }
    if (!UUID.test(String(p.id || ''))) throw new ctx.HttpError(400, `Choose the ${name} test.`);
    const m = await ctx.store.getMaterial(String(p.id));
    if (!m || m.type !== kind) throw new ctx.HttpError(400, `The ${name} test was not found.`);
    if (kind === 'writing') {
      const tasks = (m.data && m.data.tasks) || [];
      if (!tasks.some((t) => t.kind !== 'task2') || !tasks.some((t) => t.kind === 'task2')) throw new ctx.HttpError(400, 'The Writing test of a mock needs a Task 1 and a Task 2.');
    } else if (!(m.data && m.data.mode === 'full')) throw new ctx.HttpError(400, `Choose a Full ${name} test (a whole paper), not a Part test.`);
    else if (!(await materialKey(ctx, kind, m.id))) throw new ctx.HttpError(400, `The ${name} test "${line(m.title, 60)}" has no answers yet.`);
    papers[kind] = { src, id: m.id, title: line(m.title, 120) };
  }
  const order = pick('order'); const now = new Date().toISOString();
  return {
    id: cur ? cur.id : crypto.randomUUID(), builtin: !!(cur && cur.builtin), title,
    description: text(pick('description'), 400), coverUrl: ctx.cleanUrl(pick('coverUrl') || ''), tier: line(pick('tier'), 20),
    access: ACCESS.includes(b.access) ? b.access : (cur && cur.access) || 'standard',
    modes: MODES.includes(b.modes) ? b.modes : (cur && cur.modes) || 'both',
    published: b.published !== undefined ? b.published !== false : !cur || cur.published !== false,
    order: Math.max(0, Math.min(999, Math.floor(Number(order) || 0))), papers,
    createdAt: (cur && cur.createdAt) || now, updatedAt: now
  };
}

/* ───────── the attempts of one student (settings "mock-attempts:<user id>": the last 50, no answers, no texts) ───────── */
const attemptsKey = (u) => 'mock-attempts:' + u.id;
async function readAttempts(ctx, u) {
  let v = null; try { v = await ctx.store.getSetting(attemptsKey(u)); } catch (e) { /* a new account */ }
  v = v && typeof v === 'object' ? v : {};
  return { items: Array.isArray(v.items) ? v.items : [], bags: v.bags && typeof v.bags === 'object' ? v.bags : {} };
}
async function saveAttempts(ctx, u, rec) {
  try { await ctx.store.setSetting(attemptsKey(u), { items: rec.items.slice(0, 50), bags: rec.bags, updatedAt: new Date().toISOString() }); return true; }
  catch (e) { console.error('Mock attempts could not be saved:', e.message); return false; }
}
/* a random built-in paper: each student gets every paper once before any repeats, never the same one twice in a row */
function draw(kind, bags) {
  const all = pool()[kind].map((e) => e.id); if (!all.length) return '';
  const st = bags[kind] && typeof bags[kind] === 'object' ? bags[kind] : {};
  let bag = (Array.isArray(st.bag) ? st.bag : []).filter((id) => all.includes(id));
  if (!bag.length) {
    bag = all.slice();
    for (let i = bag.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [bag[i], bag[j]] = [bag[j], bag[i]]; }
    if (bag.length > 1 && bag[0] === st.last) { const j = 1 + crypto.randomInt(bag.length - 1); [bag[0], bag[j]] = [bag[j], bag[0]]; }
  }
  const id = bag.shift(); bags[kind] = { bag, last: id };
  return id;
}

/* what the exam shell gets for one attempt: the address of each paper and the two Writing tasks */
function linesOf(t) { return String(t || '').replace(/\r/g, '').split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 30); }
async function papersFor(ctx, pp) {
  const out = {};
  for (const kind of ['listening', 'reading']) {
    const [src, id] = String(pp[kind] || '').split(/:(.+)/);
    if (src === 'b') { const e = builtinOf(kind, id); if (!e) throw new ctx.HttpError(409, 'This mock test is being changed. Please start it again.'); out[kind] = { file: '/full-mock/' + e.file }; }
    else out[kind] = { file: `/full-mock/paper/${kind}/${id}` };
  }
  const [src, id] = String(pp.writing || '').split(/:(.+)/);
  if (src === 'b') {
    const e = builtinOf('writing', id); if (!e) throw new ctx.HttpError(409, 'This mock test is being changed. Please start it again.');
    const w = json(e.writing); ['task1', 'task2'].forEach((k) => { if (w[k] && w[k].img && !/^\//.test(w[k].img)) w[k].img = '/full-mock/' + w[k].img.replace(/^\.?\//, ''); });
    out.writing = w;
  } else {
    const m = await ctx.store.getMaterial(id); const tasks = (m && m.data && m.data.tasks) || [];
    const t1 = tasks.find((t) => t.kind !== 'task2'), t2 = tasks.find((t) => t.kind === 'task2');
    if (!t1 || !t2) throw new ctx.HttpError(409, 'The Writing test of this mock was changed. Please ask the teacher.');
    out.writing = {
      task1: { lines: linesOf(t1.prompt), img: t1.imageUrl || '', alt: '', chart: t1.chart || null, minWords: t1.minWords || 150 },
      task2: { lines: linesOf(t2.prompt), minWords: t2.minWords || 250 }
    };
  }
  return out;
}

/* ───────── the signed attempt (token + cookie) ───────── */
function readToken(ctx, token, u) {
  const t = ctx.readPurposeToken(String(token || ''), 'mock');
  if (!t || !t.aid || !t.pp || (u && t.sub !== u.id)) return null;
  return t;
}
const cookieOf = (ctx, req, token) => `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(TTL_MS / 1000)}${ctx.isHttps(req) ? '; Secure' : ''}`;
const tokenFromCookie = (ctx, req) => ctx.cookies(req)[COOKIE] || '';

/* May this request have this /full-mock/ file? null = an ordinary file; otherwise { ok, status } */
async function gateFile(ctx, req, pathname) {
  let p = String(pathname || ''); try { p = decodeURIComponent(p); } catch (e) { return { ok: false, status: 400 }; }
  p = p.toLowerCase().replace(/\/{2,}/g, '/');
  if (!p.startsWith('/full-mock/')) return null;
  if (/^\/full-mock\/js\/tests\.js$/.test(p) || /^\/full-mock\/readme/.test(p)) return { ok: false, status: 404 };   // every paper and every Writing task: server only
  const paper = /^\/full-mock\/((?:listening|reading)-[\w.-]+?)(?:\.html)?\/?$/.exec(p);
  const shared = /^\/full-mock\/(?:js\/listening\.js|assets\/audio\/.+)$/.test(p);   // the Listening answer packs and recordings
  if (!paper && !shared) return null;
  const u = await ctx.currentUser(req);
  if (!u) return { ok: false, status: 401 };
  const t = readToken(ctx, tokenFromCookie(ctx, req), u);
  if (!t) return { ok: false, status: 403 };
  if (shared) return { ok: true };
  const b = builtinByFile(paper[1]); if (!b) return { ok: false, status: 404 };
  return t.pp[b.kind] === 'b:' + b.id ? { ok: true } : { ok: false, status: 403 };
}

/* The page of an admin-made paper, built for the mock: the same engine and template as the site's own Full tests (they
   know every question type the admin panel makes), plus the bridge to the shell (full-mock/js/bridge.js), its own saved
   state, and without the site's access gate and result saving (the shell and the server do that). */
let READING_TPL = null;
const EMBED_HEAD = '<script>if(/[?&]embed=1/.test(location.search))document.documentElement.classList.add("mock-embed");</script>'
  + '<style>html.mock-embed #stage-registration{visibility:hidden!important}html.mock-embed #pace-note{display:none!important}</style>';
const dropScript = (html, src) => html.replace(new RegExp('<script[^>]*\\bsrc="' + src.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '"[^>]*><\\/script>\\s*', 'g'), '');
async function servePaper(req, res, ctx, kind, id) {
  const u = await ctx.currentUser(req);
  const t = u && readToken(ctx, tokenFromCookie(ctx, req), u);
  if (!t || t.pp[kind] !== 'm:' + id) return ctx.send(res, u ? 403 : 401, 'This paper opens only inside your mock test.');
  const m = await ctx.store.getMaterial(id); if (!m || m.type !== kind) return ctx.send(res, 404, 'Not found.');
  let html;
  if (kind === 'reading') {
    if (!READING_TPL) READING_TPL = fs.readFileSync(path.join(__dirname, 'full-tests', 'reading', 'test-1.html'), 'utf8');
    html = require('./reading-exam').buildExamHtml({ ...m, data: { ...(m.data || {}), mode: 'full' } }, { full: READING_TPL, part: READING_TPL })
      .replace('const STORAGE_KEY = "ieltsx_reading_', 'const STORAGE_KEY = "ieltsx_mock_reading_' + t.aid.slice(0, 8) + '_');
    for (const s of ['/assets/js/access-gate.js', '/assets/js/test-complete.js', '/ieltsx-data.js']) html = dropScript(html, s);
    html = html.replace('<script src="/reading.js"></script>', '<script>if (window.READING_TEST) window.READING_TEST.TITLE_PREFIX = \'\';</script>\n<script src="/full-mock/js/bridge.js"></script>\n<script src="/reading.js"></script>')
      .split('[Demo] ').join('');
  } else {
    html = require('./listening-exam').renderPage(m);
    for (const s of ['/assets/js/access-gate.js', '/assets/js/test-complete.js', '/ieltsx-data.js']) html = dropScript(html, s);
    html = html.replace('<script src="/listening/js/listening.js"></script>', '<script src="/full-mock/js/bridge.js"></script>\n<script src="/listening/js/listening.js"></script>');
  }
  html = html.replace('</head>', EMBED_HEAD + '</head>');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex, nofollow', ...ctx.SECURITY_HEADERS });
  return res.end(req.method === 'HEAD' ? undefined : html);
}

/* ───────── what a student sees on a card ───────── */
function statOf(items, mid) {
  const mine = items.filter((a) => a.mid === mid);
  const done = mine.filter((a) => a.finishedAt);
  const best = done.reduce((b, a) => (typeof a.overall === 'number' && a.overall > b ? a.overall : b), -1);
  const open = mine.find((a) => !a.finishedAt && Date.now() - Date.parse(a.startedAt) < TTL_MS);
  return { attempts: done.length, best: best >= 0 ? best : null, last: done[0] ? { band: done[0].overall, at: done[0].finishedAt } : null, inProgress: !!open };
}
function publicMock(ctx, m, level, items) {
  const rule = ruleOf(m);
  return {
    id: m.id, title: m.title, description: m.description || '', coverUrl: m.coverUrl || '', tier: m.tier || '', modes: m.modes || 'both',
    plan: rule.locked ? rule.plan : 'free', locked: !ctx.allowsLevel(rule, level),
    fresh: KINDS.filter((k) => m.papers[k].src === 'random'),     // drawn again for every attempt (the paper is never named)
    sections: KINDS, minutes: 160, questions: 80, ...(items ? statOf(items, m.id) : {})
  };
}

/* ───────── routes for students ───────── */
async function route(req, res, p, method, url, ctx) {
  const noStore = { 'Cache-Control': 'no-store, private' };
  if (method === 'GET' && p === '/api/mocks') {
    const u = await ctx.currentUser(req); const level = ctx.userLevel(u);
    const items = u ? (await readAttempts(ctx, u)).items : null;
    const mocks = (await getMocks(ctx)).filter((m) => m.published !== false || ctx.isAdmin(u)).map((m) => publicMock(ctx, m, level, items));
    return ctx.send(res, 200, { mocks, signedIn: !!u, level, plan: ctx.levelName(level) }, noStore);
  }
  const u = await ctx.currentUser(req);
  if (!u) throw new ctx.HttpError(401, 'Please sign in to take a mock test.');
  if (method !== 'POST') throw new ctx.HttpError(405, 'Method not allowed.');

  let sm = /^\/api\/mocks\/([\w-]{1,40})\/start$/.exec(p);
  if (sm) {
    ctx.rateLimit('mock-start:' + u.id, 30, 3600000);
    const b = await ctx.readJson(req, 4096);
    const m = (await getMocks(ctx)).find((x) => x.id === sm[1]);
    if (!m || (m.published === false && !ctx.isAdmin(u))) throw new ctx.HttpError(404, 'This mock test was not found.');
    const rule = ruleOf(m);
    if (!ctx.allowsLevel(rule, ctx.userLevel(u))) throw new ctx.HttpError(403, `This mock test is for ${PLAN_NAME[rule.plan]} members.`);
    const mode = m.modes === 'real' ? 'real' : m.modes === 'practice' ? 'practice' : (b.mode === 'practice' ? 'practice' : 'real');
    const rec = await readAttempts(ctx, u);
    const pp = {};
    for (const kind of KINDS) {
      const s = m.papers[kind] || { src: 'random' };
      pp[kind] = s.src === 'random' ? 'b:' + draw(kind, rec.bags) : s.src === 'builtin' ? 'b:' + s.id : 'm:' + s.id;
      if (pp[kind] === 'b:') throw new ctx.HttpError(503, 'This mock test has no papers yet.');
    }
    const papers = await papersFor(ctx, pp);
    const aid = crypto.randomUUID(); const now = new Date().toISOString();
    rec.items.unshift({ id: aid, mid: m.id, title: m.title, mode, pp, startedAt: now });
    await saveAttempts(ctx, u, rec);
    const token = ctx.purposeToken('mock', { aid, sub: u.id, mid: m.id, mode, pp }, TTL_MS);
    return ctx.send(res, 200, { attempt: { id: aid, token, mode, mockId: m.id, title: m.title, startedAt: now, papers } }, { ...noStore, 'Set-Cookie': cookieOf(ctx, req, token) });
  }
  if (p === '/api/mock/resume') {
    ctx.rateLimit('mock-resume:' + u.id, 120, 3600000);
    const t = readToken(ctx, (await ctx.readJson(req, 8192)).token, u);
    if (!t) throw new ctx.HttpError(410, 'This attempt has ended. Start the mock test again.');
    const token = ctx.purposeToken('mock', { aid: t.aid, sub: t.sub, mid: t.mid, mode: t.mode, pp: t.pp }, Math.max(60000, t.exp - Date.now()));
    return ctx.send(res, 200, { attempt: { id: t.aid, token, mode: t.mode, mockId: t.mid, papers: await papersFor(ctx, t.pp) } }, { ...noStore, 'Set-Cookie': cookieOf(ctx, req, token) });
  }
  if (p === '/api/mock/finish') {
    ctx.rateLimit('mock-finish:' + u.id, 30, 3600000);
    const b = await ctx.readJson(req, 64 * 1024);
    // an attempt is finished up to an hour after its token ends (the clock of a long Writing may run past it)
    const t = ctx.readPurposeToken(String(b.token || tokenFromCookie(ctx, req)), 'mock') || readExpired(ctx, String(b.token || ''), 3600000);
    if (!t || t.sub !== u.id || !t.pp) throw new ctx.HttpError(403, 'This attempt could not be confirmed. Please start the mock test again.');
    const rec = await readAttempts(ctx, u);
    let item = rec.items.find((a) => a.id === t.aid);
    if (item && item.finishedAt) return ctx.send(res, 200, { duplicate: true, ...summary(item) }, noStore);
    if (!item) { item = { id: t.aid, mid: t.mid, title: '', mode: t.mode, pp: t.pp, startedAt: '' }; rec.items.unshift(item); }
    const mock = (await getMocks(ctx)).find((x) => x.id === t.mid);
    const title = (mock && mock.title) || item.title || 'Full Mock Test';
    const flags = [];
    for (const kind of ['listening', 'reading']) {
      const s = b[kind] && typeof b[kind] === 'object' ? b[kind] : null;
      if (!s) continue;
      const key = await keyFor(ctx, kind, t.pp[kind]);
      const answers = cleanAnswers(s.answers);
      let correct, total;
      if (key) ({ correct, total } = mark(key, answers));
      else { total = 40; correct = 0; flags.push(kind + ': no answer key on the server'); }
      const claimed = Math.floor(Number(s.correct));
      if (Number.isFinite(claimed) && claimed !== correct) flags.push(`${kind}: the page said ${claimed}, the server marked ${correct}`);
      item[kind === 'listening' ? 'L' : 'R'] = { correct, total, band: ctx.bandFor(kind, correct, total) };
    }
    const L = item.L, R = item.R;
    item.overall = L && R ? Math.min(9, Math.floor(((L.band + R.band) / 2) * 2 + 0.5) / 2) : (L || R || { band: null }).band;
    item.viol = Math.max(0, Math.min(500, (Array.isArray(b.viol) ? b.viol.length : Math.floor(Number(b.viol) || 0))));
    item.flags = flags.slice(0, 6); item.finishedAt = new Date().toISOString(); item.title = title;
    if (flags.length) console.warn('Mock attempt ' + t.aid + ' (' + u.email + '):', flags.join('; '));
    await saveAttempts(ctx, u, rec);
    const durationSec = item.startedAt ? Math.max(0, Math.min(86400, Math.round((Date.now() - Date.parse(item.startedAt)) / 1000))) : 0;
    for (const [kind, X] of [['listening', L], ['reading', R]]) {
      if (!X) continue;
      try {
        await ctx.store.insertResult({ id: ctx.newId(), userId: u.id, testKey: `/mock/${t.mid}/${t.aid}/${kind}`, section: kind === 'listening' ? 'Listening' : 'Reading', bucket: 'Mock',
          pageLabel: line(title, 100) + ' · ' + (kind === 'listening' ? 'Listening' : 'Reading'), scoreCorrect: X.correct, scoreTotal: X.total, band: X.band, durationSec, createdAt: new Date().toISOString() });
      } catch (e) { console.error('Mock result could not be saved:', e.message); }
    }
    return ctx.send(res, 200, summary(item), noStore);
  }
  throw new ctx.HttpError(404, 'Not found.');
}
function readExpired(ctx, token, graceMs) {
  // the same signature check as readPurposeToken, but an attempt may still be handed in a little after it ends
  const [body, sig] = String(token || '').split('.'); if (!body || !sig) return null;
  const t = ctx.readPurposeToken(token, 'mock'); if (t) return t;
  try {
    const good = ctx.sign(body); const given = Buffer.from(sig, 'base64url');
    if (given.length !== good.length || !crypto.timingSafeEqual(given, good)) return null;
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    return p && p.p === 'mock' && p.exp + graceMs > Date.now() ? p : null;
  } catch (e) { return null; }
}
const summary = (a) => ({ attemptId: a.id, listening: a.L || null, reading: a.R || null, overall: a.overall == null ? null : a.overall, flagged: !!(a.flags && a.flags.length) });

/* the Writing tasks of an attempt, for the AI check (ai-examiner.js): the prompt always comes from the server */
async function writingTask(ctx, u, token, which) {
  const t = readToken(ctx, token, u) || readExpired(ctx, token, 24 * 3600000);
  if (!t || t.sub !== u.id || !t.pp) return null;
  const w = (await papersFor(ctx, t.pp)).writing; const task = w[which === 'task2' ? 'task2' : 'task1'];
  const [src, id] = String(t.pp.writing).split(/:(.+)/);
  const mock = (await getMocks(ctx)).find((x) => x.id === t.mid);
  let teacherSample = '';
  if (src === 'm') { const m = await ctx.store.getMaterial(id); const tk = ((m && m.data && m.data.tasks) || []).find((x) => (which === 'task2' ? x.kind === 'task2' : x.kind !== 'task2')); teacherSample = (tk && tk.sample) || ''; }
  return {
    kind: which === 'task2' ? 'task2' : 'task1', prompt: task.lines.join('\n') + (task.alt ? '\n(The picture: ' + task.alt + ')' : ''),
    chart: task.chart || null, imageUrl: task.img || '', minWords: task.minWords || (which === 'task2' ? 250 : 150), teacherSample,
    title: ((mock && mock.title) || 'Full Mock Test') + ' · ' + (which === 'task2' ? 'Task 2' : 'Task 1'), testKey: `/mock/${t.mid}/${t.aid}/writing`
  };
}

/* ───────── the admin panel (inside /api/admin/: requireAdmin, the cross-site check, the admin rate limit) ───────── */
async function adminRoute(req, res, p, method, url, ctx) {
  const admin = ctx.admin; const noStore = { 'Cache-Control': 'no-store' };
  if (method === 'GET' && p === '/api/admin/mocks') {
    const mats = (await ctx.store.listMaterials()).filter((m) => KINDS.includes(m.type));
    const opt = (kind) => mats.filter((m) => m.type === kind && (kind === 'writing' || (m.data && m.data.mode === 'full')))
      .map((m) => ({ id: m.id, title: m.title, published: m.published !== false, mode: (m.data && m.data.mode) || 'part' }));
    const P = pool();
    return ctx.send(res, 200, {
      mocks: await getMocks(ctx, true),
      options: {
        builtin: { listening: P.listening.map((e) => ({ id: e.id })), reading: P.reading.map((e) => ({ id: e.id })), writing: P.writing.map((e) => ({ id: e.id, title: String((e.writing.task2.lines || [])[0] || '').slice(0, 90) })) },
        material: { listening: opt('listening'), reading: opt('reading'), writing: opt('writing') }
      }
    }, noStore);
  }
  if (method === 'POST' && p === '/api/admin/mocks') {
    const all = await getMocks(ctx, true); const m = await cleanMock(ctx, await ctx.readJson(req, 32 * 1024), null);
    all.push(m); await saveMocks(ctx, all); await ctx.audit(admin, 'mock.add', m.title);
    return ctx.send(res, 201, { mock: m }, noStore);
  }
  const mm = /^\/api\/admin\/mocks\/([\w-]{1,40})$/.exec(p);
  if (mm && (method === 'PATCH' || method === 'DELETE')) {
    const all = await getMocks(ctx, true); const idx = all.findIndex((x) => x.id === mm[1]);
    if (idx < 0) throw new ctx.HttpError(404, 'Mock test not found.');
    if (method === 'DELETE') {
      const [gone] = all.splice(idx, 1);
      await saveMocks(ctx, all.filter((x) => x.id !== RANDOM_ID || !gone.builtin));   // the built-in one comes back with its first settings
      await ctx.audit(admin, gone.builtin ? 'mock.reset' : 'mock.delete', gone.title);
      return ctx.send(res, 200, { ok: true }, noStore);
    }
    all[idx] = await cleanMock(ctx, await ctx.readJson(req, 32 * 1024), all[idx]);
    await saveMocks(ctx, all); await ctx.audit(admin, 'mock.edit', all[idx].title);
    return ctx.send(res, 200, { mock: all[idx] }, noStore);
  }
  const um = /^\/api\/admin\/mocks\/attempts\/([0-9a-f-]{36})$/i.exec(p);
  if (um && method === 'GET') {   // the mock attempts of one student (admin user drawer)
    const u = await ctx.store.findUserById(um[1]); if (!u) throw new ctx.HttpError(404, 'User not found.');
    return ctx.send(res, 200, { items: (await readAttempts(ctx, u)).items.map(({ pp, ...a }) => a) }, noStore);
  }
  throw new ctx.HttpError(404, 'API endpoint not found.');
}

module.exports = { route, adminRoute, gateFile, servePaper, writingTask, readAttempts, pool, COOKIE, UUID,
  _test: { normAnswer, matches, builtinReadingKey, builtinListeningKey, cleanAnswers, mark } };
