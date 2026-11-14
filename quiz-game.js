'use strict';
/* ====
   quiz-game.js -- live quiz games for every subject (server only, never sent to a browser as a file).

   An admin makes a quiz in the panel (Admin -> Games): a name, a subject (Huquq, Matematika, IELTS, ...) and questions
   with 2-4 answers, a time limit and points. "Host" starts a game with a 6-digit PIN in one of two game types:
     classic   the question and the answers are on the host screen only (the classroom screen); the phones show the
               four coloured shapes ▲ ◆ ● ■
     phone     the question and the answers are on every phone as well (students can play from anywhere)
   The host screen (/game-host) runs the game; the students open /game, type the PIN and a nickname and answer. A right
   answer gives up to 1000 points (x2 on a double-points question): the faster, the more. With "auto" on, the game moves
   on by itself: everybody answered (or time is up) -> the right answer -> the ranking -> the next question.

     POST /api/game/pin      {pin}           -> the game's name, subject and type (and the signed-in student's name)
     POST /api/game/join     {pin, name}     -> a signed player token (the page sends it back in X-Game-Token)
     GET  /api/game/state                    -> what the player's screen shows now
     POST /api/game/answer   {q, c}          -> the answer to question q (tile c); the points are worked out here
     POST /api/game/leave
     /api/admin/games...                     the quizzes, the host screen and the reports (admins only)

   Storage. Vercel runs many short-lived copies of the server with no shared memory, so a live game is kept in the
   database (ieltsx_settings, key / value) in small rows that each have ONE writer:
     game-live:<PIN>          the state of the game (phase, question, clock, ranks)   -- written by the host only
     game-qs:<PIN>            the questions, copied when the game is made (never changed afterwards)
     game-p:<PIN>:<player>    one player (name, score, answers)                       -- written for that player only
   so players who answer at the same moment never overwrite each other. The clock is part of the state (openAt /
   endsAt): "time is up" is worked out from the time, nothing has to run in the background. A player's poll is one
   small read (the state + the player's own row); the questions are kept in memory by game id. Locally ("npm start"
   without Supabase) the live rows are kept in memory. The quizzes (game-quiz:<id>) and the reports of finished games
   (game-report:<id>) are kept in the settings in both modes.

   Security
   - Only admins make quizzes and run the host screen. A player row is changed only with the player's signed token
     (HMAC with SESSION_SECRET; it names the game and the player), so nobody can answer for somebody else.
   - The right answer is never sent to a player before the question is closed; in a classic game the question and the
     answers are not sent to the phones at all. The points are worked out on the server with the server's own clock
     (an answer after the time is refused) and an answer counts once. While the clock runs a player's score is the
     one before the question (a jump would tell right or wrong).
   - Wrong PINs are rate limited per address (a PIN cannot be found by trying), nicknames are unique in a game, a game
     holds at most MAX_PLAYERS players, and the host can lock the game or remove a player.
   ==== */
const crypto = require('crypto');

const K = { quiz: 'game-quiz:', live: 'game-live:', qs: 'game-qs:', player: 'game-p:', report: 'game-report:' };
const MAX_QUESTIONS = 100, MAX_PLAYERS = 300, MAX_QUIZZES = 500, MAX_REPORTS = 300;
const TIMES = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240];
const MODES = ['classic', 'phone'];
const LEAD_MS = { classic: 3000, phone: 1500 };   // the question is shown this long before the answers open
const REVEAL_MS = 3500, BOARD_MS = 4500;          // auto: the right answer, then the ranking, then the next question
const GRACE_MS = 1500;             // an answer sent just before the end may arrive a moment after it
const IDLE_MS = 6 * 3600 * 1000;   // a game nobody moved on for 6 hours is removed
const TOKEN_MS = 12 * 3600 * 1000;
const PIN_RE = /^\d{6}$/;
const PID_RE = /^[a-f0-9]{12}$/;
const SID_RE = /^[a-f0-9]{16}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUBJECTS = ['IELTS', 'Ingliz tili', 'Huquq', 'Matematika', 'Ona tili va adabiyot', 'Tarix', 'Fizika', 'Kimyo', 'Biologiya', 'Geografiya', 'Informatika', 'Iqtisodiyot'];
const QUIZ_FIELDS = ['id', 'title', 'subject', 'description', 'coverUrl', 'count', 'totalTime', 'createdAt', 'updatedAt', 'createdBy', 'plays', 'lastPlayedAt'];
const REPORT_FIELDS = ['sid', 'quizId', 'title', 'subject', 'mode', 'pin', 'host', 'startedAt', 'endedAt', 'asked', 'total', 'count', 'winner', 'avgRight'];

const line = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const text = (v, n) => String(v == null ? '' : v).replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f\u200b-\u200f\u2028-\u202e\ufeff]/g, ' ')
  .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, n);
const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
const iso = () => new Date().toISOString();

/* ───────── storage ───────── */
/* the live rows: in the database on Vercel / with Supabase, in memory for "npm start" on a file database */
const mem = new Map();
const memKv = {
  async get(keys) { const m = new Map(); keys.forEach((k) => { if (mem.has(k)) m.set(k, clone(mem.get(k))); }); return m; },
  async list(prefix) { const out = []; for (const [key, value] of mem) if (key.startsWith(prefix)) out.push({ key, value: clone(value) }); return out; },
  async set(key, value) { mem.set(key, clone(value)); return value; },
  async del(key) { mem.delete(key); },
  async delPrefix(prefix) { for (const k of [...mem.keys()]) if (k.startsWith(prefix)) mem.delete(k); }
};
const dbKv = (store, minimal) => ({
  async get(keys) { const m = await store.getSettings(keys); for (const [k, v] of m) m.set(k, clone(v)); return m; },
  list: (prefix, fields) => store.listSettings(prefix, { fields }),
  set: (key, value) => store.setSetting(key, value, minimal ? { minimal: true } : undefined),   // the live rows: no copy sent back
  del: (key) => store.deleteSetting(key),
  delPrefix: (prefix) => store.deleteSettings(prefix)
});
const liveKv = (ctx) => (ctx.USE_SUPABASE ? dbKv(ctx.store, true) : memKv);
const keepKv = (ctx) => dbKv(ctx.store, false);

/* the questions of a game never change while it runs: kept here by game id, so a poll reads only the small rows */
const qsCache = new Map();
async function questionsOf(ctx, s) {
  if (qsCache.has(s.sid)) return qsCache.get(s.sid);
  const row = (await liveKv(ctx).get([K.qs + s.pin])).get(K.qs + s.pin);
  const qs = row && row.sid === s.sid && Array.isArray(row.qs) ? row.qs : [];
  if (qs.length) { if (qsCache.size >= 50) qsCache.delete(qsCache.keys().next().value); qsCache.set(s.sid, qs); }
  return qs;
}
async function liveOf(ctx, pin) {
  if (!PIN_RE.test(String(pin || ''))) return null;
  return (await liveKv(ctx).get([K.live + pin])).get(K.live + pin) || null;
}
async function playersOf(ctx, pin) {
  if (!PIN_RE.test(String(pin || ''))) return [];
  return (await liveKv(ctx).list(K.player + pin + ':')).map((r) => r.value).filter((p) => p && PID_RE.test(String(p.pid || '')));
}
async function dropGame(ctx, pin) {
  const kv = liveKv(ctx);
  await kv.delPrefix(K.player + pin + ':'); await kv.del(K.qs + pin); await kv.del(K.live + pin);
}
/* the games that are still running; one nobody moved on for IDLE_MS is removed */
async function sweep(ctx) {
  const now = Date.now(); const alive = [];
  for (const r of await liveKv(ctx).list(K.live)) {
    const s = r.value; const pin = r.key.slice(K.live.length);
    if (!s || !PIN_RE.test(pin) || now - Date.parse(s.t || s.createdAt || 0) > IDLE_MS) { await dropGame(ctx, pin).catch(() => {}); continue; }
    alive.push(s);
  }
  return alive;
}

/* ───────── the game ───────── */
/* ready = the question is shown (no answers yet), answer = the clock runs, reveal = time is up: the right answer is shown */
function phaseOf(s, now) {
  if (s.phase !== 'question') return s.phase;
  if (now < s.openAt) return 'ready';
  if (now < s.endsAt) return 'answer';
  return 'reveal';
}
/* when the phase began (the reveal begins when the clock stops) */
function phaseStart(s, ph) { return ph === 'ready' ? s.phaseAt : ph === 'answer' ? s.openAt : ph === 'reveal' ? s.endsAt : s.phaseAt; }
/* a right answer: 1000 points at once, 500 at the last moment (x2 for double points, 0 for a question without points) */
function pointsFor(q, ms) {
  if (!q.points) return 0;
  const f = Math.min(1, Math.max(0, ms / (q.time * 1000)));
  return Math.round(1000 * q.points * (1 - f / 2));
}
const ranked = (players) => players.slice().sort((a, b) => (b.score || 0) - (a.score || 0) || String(a.joinedAt).localeCompare(String(b.joinedAt)));
function standings(s, players) {
  const list = ranked(players); const ranks = {}; const behind = {};
  list.forEach((p, i) => { ranks[p.pid] = i + 1; if (i) behind[p.pid] = [(list[i - 1].score || 0) - (p.score || 0), list[i - 1].name]; });   // how far behind the player above
  const top = list.slice(0, 5).map((p) => ({ pid: p.pid, name: p.name, score: p.score || 0, gain: (p.a && p.a[s.q] && p.a[s.q].pts) || 0, streak: p.streak || 0 }));
  return { prevRanks: s.ranks || {}, ranks, behind, top, count: list.length, ranksAt: s.q };
}
function goQuestion(s, i, qs, now) {
  s.phase = 'question'; s.q = i; s.early = false; s.phaseAt = now;
  s.openAt = now + (LEAD_MS[s.mode] || LEAD_MS.classic); s.endsAt = s.openAt + qs[i].time * 1000;
}
function questionStats(q, k, players) {
  const counts = q.answers.map(() => 0); let right = 0, answered = 0;
  players.forEach((p) => { const a = p.a && p.a[k]; if (!a) return; answered++; if (counts[a.c] !== undefined) counts[a.c]++; if (a.ok) right++; });
  return { counts, right, answered };
}
async function saveReport(ctx, s, qs, players) {
  if (s.q < 0) return null;
  const list = ranked(players); const asked = Math.min(qs.length, s.q + 1);
  const rows = list.map((p, i) => {
    let right = 0, answered = 0; const a = [];
    for (let k = 0; k < asked; k++) {
      const x = p.a && p.a[k];
      if (x) { answered++; if (x.ok) right++; a.push([x.c, x.ok ? 1 : 0, x.pts || 0, x.ms || 0]); } else a.push(null);
    }
    return { rank: i + 1, name: p.name, userId: p.userId || null, score: p.score || 0, right, answered, a };   // a: [tile, right, points, ms] per question
  });
  const questions = qs.slice(0, asked).map((q, k) => ({ text: q.text, answers: q.answers, correct: q.correct, time: q.time, ...questionStats(q, k, players) }));
  const rep = {
    sid: s.sid, quizId: s.quizId, title: s.title, subject: s.subject, mode: s.mode, pin: s.pin, host: s.host,
    startedAt: s.startedAt || s.createdAt, endedAt: iso(), asked, total: qs.length, count: rows.length,
    winner: rows[0] ? { name: rows[0].name, score: rows[0].score } : null,
    avgRight: rows.length && asked ? Math.round(rows.reduce((t, r) => t + r.right, 0) / rows.length / asked * 100) : 0,
    players: rows, questions
  };
  const kv = keepKv(ctx);
  await kv.set(K.report + s.sid, rep);
  try {   // only the newest MAX_REPORTS are kept
    const all = await kv.list(K.report, ['sid', 'endedAt']);
    if (all.length > MAX_REPORTS) {
      const old = all.map((r) => r.value).sort((a, b) => String(b.endedAt).localeCompare(String(a.endedAt))).slice(MAX_REPORTS);
      for (const r of old) if (SID_RE.test(String(r.sid || ''))) await kv.del(K.report + r.sid);
    }
  } catch (e) { /* the report itself is saved */ }
  return rep;
}

/* ───────── quizzes (admin) ───────── */
function cleanQuestion(ctx, q, i) {
  const where = 'Question ' + (i + 1) + ': ';
  q = q && typeof q === 'object' ? q : {};
  const type = q.type === 'tf' ? 'tf' : 'quiz';
  const t = text(q.text, 400);
  if (!t) throw new ctx.HttpError(400, where + 'write the question.');
  const marks = new Set((Array.isArray(q.correct) ? q.correct : [q.correct]).map(Number).filter(Number.isInteger));
  const kept = [];   // an empty answer box is left out together with its mark
  (Array.isArray(q.answers) ? q.answers : []).slice(0, 4).forEach((a, k) => { const v = line(a, 160); if (v) kept.push({ v, ok: marks.has(k) }); });
  if (type === 'tf' && kept.length !== 2) throw new ctx.HttpError(400, where + 'a True / False question has exactly two answers.');
  if (kept.length < 2) throw new ctx.HttpError(400, where + 'give at least two answers.');
  if (new Set(kept.map((x) => x.v.toLowerCase())).size !== kept.length) throw new ctx.HttpError(400, where + 'two answers are the same.');
  const correct = kept.map((x, k) => (x.ok ? k : -1)).filter((k) => k >= 0);
  if (!correct.length) throw new ctx.HttpError(400, where + 'mark the right answer.');
  return {
    type, text: t, image: ctx.cleanUrl(q.image), answers: kept.map((x) => x.v), correct,
    time: TIMES.includes(Number(q.time)) ? Number(q.time) : 20,
    points: [0, 1, 2].includes(Number(q.points)) ? Number(q.points) : 1
  };
}
function cleanQuiz(ctx, b, cur, admin) {
  b = b && typeof b === 'object' ? b : {};
  const title = line(b.title, 120);
  if (!title) throw new ctx.HttpError(400, 'Please enter the name of the game.');
  const list = Array.isArray(b.questions) ? b.questions : [];
  if (!list.length) throw new ctx.HttpError(400, 'Add at least one question.');
  if (list.length > MAX_QUESTIONS) throw new ctx.HttpError(400, 'A game can have at most ' + MAX_QUESTIONS + ' questions.');
  const questions = list.map((q, i) => cleanQuestion(ctx, q, i));
  const now = iso();
  return {
    id: cur ? cur.id : crypto.randomUUID(), title, subject: line(b.subject, 40) || 'General', description: text(b.description, 400), coverUrl: ctx.cleanUrl(b.coverUrl),
    questions, count: questions.length, totalTime: questions.reduce((t, q) => t + q.time, 0),
    createdAt: cur ? cur.createdAt : now, updatedAt: now, createdBy: cur ? cur.createdBy : (admin && admin.email) || '',
    plays: cur ? cur.plays || 0 : 0, lastPlayedAt: cur ? cur.lastPlayedAt || null : null
  };
}
async function getQuiz(ctx, id) {
  if (!UUID_RE.test(String(id || ''))) return null;
  const q = (await keepKv(ctx).get([K.quiz + id])).get(K.quiz + id);
  return q && Array.isArray(q.questions) ? q : null;
}
const lightLive = (s, now) => ({ pin: s.pin, sid: s.sid, quizId: s.quizId, title: s.title, subject: s.subject, mode: s.mode || 'classic', phase: phaseOf(s, now), q: s.q, n: s.n, count: s.count || 0, host: s.host, createdAt: s.createdAt, startedAt: s.startedAt || null });

/* ───────── wrong PINs: at most 25 in 10 minutes from one address (a classroom shares one address: right PINs never count) ───────── */
const misses = new Map();
function pinGuard(ctx, req, miss) {
  const ip = ctx.clientIp(req); const now = Date.now();
  let a = misses.get(ip); if (!a || a.reset < now) a = { n: 0, reset: now + 10 * 60000 };
  if (a.n >= 25) throw new ctx.HttpError(429, 'Too many wrong PINs. Please wait a few minutes and try again.');
  if (miss) { a.n += 1; misses.set(ip, a); }
  if (misses.size > 5000) for (const [k, v] of misses) if (v.reset < now) misses.delete(k);
}

/* the player of a request (X-Game-Token), with the game and the player's own row: one read */
async function playerOf(ctx, req) {
  const t = ctx.readPurposeToken(String(req.headers['x-game-token'] || '').slice(0, 600), 'game');
  if (!t || !PIN_RE.test(String(t.pin)) || !PID_RE.test(String(t.pid)) || !SID_RE.test(String(t.sid))) throw new ctx.HttpError(401, 'Please join the game again.');
  const pkey = K.player + t.pin + ':' + t.pid;
  const m = await liveKv(ctx).get([K.live + t.pin, pkey]);
  const s = m.get(K.live + t.pin);
  if (!s || s.sid !== t.sid) return { t, s: null, p: null, pkey };
  return { t, s, p: m.get(pkey) || null, pkey };
}
const timing = (s) => ({ auto: s.auto !== false, revealMs: REVEAL_MS, boardMs: BOARD_MS });

/* what a player's screen shows now */
function playerView(s, me, qs, now) {
  const ph = phaseOf(s, now); const mode = s.mode || 'classic';
  const q = s.q >= 0 ? qs[s.q] : null; const mine = q && me.a ? me.a[s.q] || null : null;
  const open = ph === 'ready' || ph === 'answer';   // while the clock runs the score and streak are the ones before this question
  const out = {
    now, phase: ph, mode, title: s.title, subject: s.subject, q: s.q, n: s.n, openAt: s.openAt, endsAt: s.endsAt, phaseAt: phaseStart(s, ph), ...timing(s),
    you: { name: me.name, score: (me.score || 0) - (open && mine ? mine.pts || 0 : 0), streak: open ? null : me.streak || 0,
      rank: s.ranksAt === s.q || ph === 'final' ? (s.ranks || {})[me.pid] || null : null, players: s.count || null }
  };
  const bh = (s.ranksAt === s.q || ph === 'final') && s.behind ? s.behind[me.pid] : null;
  if (bh && (ph === 'scoreboard' || ph === 'final')) out.you.behind = { points: bh[0], name: bh[1] };
  if (q && (open || ph === 'reveal')) {
    out.question = { type: q.type, count: q.answers.length, time: q.time, points: q.points };
    if (mode === 'phone' || ph === 'reveal') Object.assign(out.question, { text: q.text, image: q.image, answers: q.answers });   // classic: only the shapes on the phones
  }
  if (q && open) out.answered = mine ? { c: mine.c } : null;
  if (q && (ph === 'reveal' || ph === 'scoreboard' || ph === 'final')) out.result = { answered: !!mine, c: mine ? mine.c : null, ok: !!(mine && mine.ok), pts: mine ? mine.pts : 0, correct: q.correct, correctText: q.correct.map((i) => q.answers[i]), chosenText: mine ? q.answers[mine.c] || '' : '' };
  if (ph === 'final') out.top = (s.top || []).slice(0, 3).map((x) => ({ name: x.name, score: x.score }));
  return out;
}

/* ───────── students: /api/game/* ───────── */
async function route(req, res, p, method, url, ctx) {
  const { send, readJson, HttpError } = ctx;

  if (p === '/api/game/pin' && method === 'POST') {
    ctx.rateLimit('gamepin:' + ctx.clientIp(req), 300, 5 * 60000);
    pinGuard(ctx, req, false);
    const b = await readJson(req, 2048); const pin = String(b.pin || '').replace(/\D/g, '');
    const s = await liveOf(ctx, pin);
    if (!s) { pinGuard(ctx, req, true); throw new HttpError(404, 'No game with this PIN. Check the number on the screen.'); }
    if (s.phase === 'final') throw new HttpError(410, 'This game has ended.');
    if (s.locked) throw new HttpError(423, 'The host has locked this game.');
    const u = await ctx.currentUser(req).catch(() => null);
    return send(res, 200, { pin, title: s.title, subject: s.subject, mode: s.mode || 'classic', started: s.phase !== 'lobby', name: u ? line(u.name, 20) : '' });
  }

  if (p === '/api/game/join' && method === 'POST') {
    ctx.rateLimit('gamejoin:' + ctx.clientIp(req), 300, 5 * 60000);
    pinGuard(ctx, req, false);
    const b = await readJson(req, 2048); const pin = String(b.pin || '').replace(/\D/g, '');
    const name = line(b.name, 20);
    if (!name) throw new HttpError(400, 'Please enter a nickname.');
    const [s, players, u] = await Promise.all([liveOf(ctx, pin), playersOf(ctx, pin), ctx.currentUser(req).catch(() => null)]);
    if (!s) { pinGuard(ctx, req, true); throw new HttpError(404, 'No game with this PIN. Check the number on the screen.'); }
    if (s.phase === 'final') throw new HttpError(410, 'This game has ended.');
    if (s.locked) throw new HttpError(423, 'The host has locked this game.');
    if (players.length >= MAX_PLAYERS) throw new HttpError(409, 'This game is full.');
    if (players.some((x) => String(x.name).toLowerCase() === name.toLowerCase())) throw new HttpError(409, 'Somebody already uses this nickname in this game. Try another one.');
    const pid = crypto.randomBytes(6).toString('hex');
    await liveKv(ctx).set(K.player + pin + ':' + pid, { pid, name, userId: u ? u.id : null, joinedAt: iso(), score: 0, streak: 0, a: {} });
    const token = ctx.purposeToken('game', { pin, sid: s.sid, pid }, TOKEN_MS);
    return send(res, 200, { token, pid, name, pin, title: s.title, subject: s.subject, mode: s.mode || 'classic' });
  }

  if (p === '/api/game/state' && method === 'GET') {
    const { t, s, p: me } = await playerOf(ctx, req);
    ctx.rateLimit('gamestate:' + t.pid, 400, 60000);
    if (!s) return send(res, 200, { phase: 'gone', now: Date.now() });
    if (!me) return send(res, 200, { phase: 'kicked', now: Date.now(), title: s.title });
    const qs = s.q >= 0 ? await questionsOf(ctx, s) : [];
    return send(res, 200, playerView(s, me, qs, Date.now()));
  }

  if (p === '/api/game/answer' && method === 'POST') {
    const { t, s, p: me, pkey } = await playerOf(ctx, req);
    ctx.rateLimit('gameanswer:' + t.pid, 60, 60000);
    if (!s) throw new HttpError(410, 'This game has ended.');
    if (!me) throw new HttpError(403, 'You were removed from this game.');
    const b = await readJson(req, 1024); const now = Date.now();
    const qi = Number(b.q), c = Number(b.c);
    if (s.phase !== 'question' || qi !== s.q) throw new HttpError(409, 'This question is closed.');
    const q = (await questionsOf(ctx, s))[qi];
    if (!q) throw new HttpError(409, 'This question is closed.');
    if (!Number.isInteger(c) || c < 0 || c >= q.answers.length) throw new HttpError(400, 'Choose one of the answers.');
    if (now < s.openAt - 300) throw new HttpError(409, 'Wait until the answers appear.');
    if (now > s.endsAt + (s.early ? 0 : GRACE_MS)) throw new HttpError(409, "Time's up.");
    me.a = me.a && typeof me.a === 'object' ? me.a : {};
    if (me.a[qi]) return send(res, 200, { ok: true, duplicate: true });
    const ms = Math.max(0, Math.min(now, s.endsAt) - s.openAt);
    const ok = q.correct.includes(c); const pts = ok ? pointsFor(q, ms) : 0;
    me.a[qi] = { c, ok, pts, ms };
    me.score = (me.score || 0) + pts;
    me.streak = ok ? (me.a[qi - 1] && me.a[qi - 1].ok ? (me.streak || 0) + 1 : 1) : 0;
    await liveKv(ctx).set(pkey, me);
    return send(res, 200, { ok: true });   // right or wrong is shown when the question closes
  }

  if (p === '/api/game/leave' && method === 'POST') {
    const { s, p: me, pkey } = await playerOf(ctx, req);
    if (s && me) await liveKv(ctx).del(pkey);
    return send(res, 200, { ok: true });
  }
  throw new HttpError(404, 'Not found.');
}

/* ───────── admins: /api/admin/games* ───────── */
function hostState(s, qs, players) {
  const now = Date.now(); const ph = phaseOf(s, now);
  players = ranked(players);
  const q = s.q >= 0 ? qs[s.q] : null;
  const shown = ph === 'reveal' || ph === 'scoreboard' || ph === 'final';
  const st = q ? questionStats(q, s.q, players) : { counts: [], right: 0, answered: 0 };
  const fresh = s.ranksAt === s.q;
  return {
    now, pin: s.pin, sid: s.sid, quizId: s.quizId, title: s.title, subject: s.subject, mode: s.mode || 'classic', host: s.host, phase: ph, q: s.q, n: s.n || qs.length,
    openAt: s.openAt, endsAt: s.endsAt, phaseAt: phaseStart(s, ph), ...timing(s), locked: !!s.locked, last: s.q >= qs.length - 1,
    question: q ? { type: q.type, text: q.text, image: q.image, answers: q.answers, time: q.time, points: q.points, correct: shown ? q.correct : undefined } : null,
    answered: st.answered, dist: shown ? st.counts : null, right: shown ? st.right : null,
    players: players.map((x, i) => {
      const a = q && x.a ? x.a[s.q] : null; const was = fresh ? (s.prevRanks || {})[x.pid] : null;
      return { pid: x.pid, name: x.name, score: (x.score || 0) - (!shown && a ? a.pts || 0 : 0), rank: i + 1, answered: !!a, ok: shown ? !!(a && a.ok) : undefined,
        c: shown && a ? a.c : undefined, ms: shown && a ? a.ms : undefined, gain: shown && a ? a.pts : 0, streak: shown ? x.streak || 0 : null, move: was ? was - (i + 1) : 0 };
    }),
    top: s.top || []
  };
}

async function adminRoute(req, res, p, method, url, ctx) {
  const { send, readJson, HttpError, admin } = ctx;
  const keep = keepKv(ctx);

  if (p === '/api/admin/games' && method === 'GET') {
    const now = Date.now();
    const [quizzes, live, reports] = await Promise.all([
      keep.list(K.quiz, QUIZ_FIELDS).then((rows) => rows.map((r) => r.value).filter((q) => q && q.id)),
      sweep(ctx).then((list) => list.map((s) => lightLive(s, now))),
      keep.list(K.report, REPORT_FIELDS).then((rows) => rows.map((r) => r.value).filter((r) => r && r.sid))
    ]);
    quizzes.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    reports.sort((a, b) => String(b.endedAt).localeCompare(String(a.endedAt)));
    const subjects = [...new Set(SUBJECTS.concat(quizzes.map((q) => q.subject).filter(Boolean)))];
    return send(res, 200, { quizzes, live, reports, subjects, modes: MODES, limits: { questions: MAX_QUESTIONS, players: MAX_PLAYERS, times: TIMES } });
  }
  if (p === '/api/admin/games' && method === 'POST') {
    const b = await readJson(req, 400 * 1024);
    if ((await keep.list(K.quiz, ['id'])).length >= MAX_QUIZZES) throw new HttpError(400, 'There are already ' + MAX_QUIZZES + ' games. Delete old ones first.');
    const quiz = cleanQuiz(ctx, b, null, admin);
    await keep.set(K.quiz + quiz.id, quiz);
    await ctx.audit(admin, 'game.create', quiz.title, { subject: quiz.subject, questions: quiz.count });
    return send(res, 201, { quiz });
  }

  let m = p.match(/^\/api\/admin\/games\/live\/(\d{6})$/);
  if (m) {
    const pin = m[1];
    if (method === 'GET') {
      const [s, players] = await Promise.all([liveOf(ctx, pin), playersOf(ctx, pin)]);   // one round trip
      if (!s) throw new HttpError(404, 'This game is over or was closed.');
      return send(res, 200, hostState(s, await questionsOf(ctx, s), players));
    }
    if (method !== 'POST') throw new HttpError(405, 'Method not allowed.');
    const b = await readJson(req, 4096);
    let [s, players] = await Promise.all([liveOf(ctx, pin), playersOf(ctx, pin)]);
    if (!s) { if (b.action === 'close') return send(res, 200, { closed: true }); throw new HttpError(404, 'This game is over or was closed.'); }
    const kv = liveKv(ctx); const now = Date.now(); const ph = phaseOf(s, now);
    const conflict = () => { throw new HttpError(409, 'The game has already moved on.'); };
    if (b.q !== undefined && b.q !== null && Number(b.q) !== s.q) conflict();
    const qs = await questionsOf(ctx, s);
    if (!qs.length) throw new HttpError(500, 'The questions of this game could not be read. Close it and start it again.');
    switch (b.action) {
      case 'start':
        if (s.phase !== 'lobby') conflict();
        if (!players.length) throw new HttpError(400, 'Wait until at least one player has joined.');
        s.startedAt = iso(); s.count = players.length; goQuestion(s, 0, qs, now);
        try { const quiz = await getQuiz(ctx, s.quizId); if (quiz) await keep.set(K.quiz + quiz.id, { ...quiz, plays: (quiz.plays || 0) + 1, lastPlayedAt: iso() }); } catch (e) { /* only the counter */ }
        break;
      case 'reveal':   // everybody answered, or the host skips the rest of the time
        if (ph !== 'ready' && ph !== 'answer') conflict();
        s.endsAt = now; s.openAt = Math.min(s.openAt, now); s.early = true;
        break;
      case 'next':     // the right answer -> the ranking -> the next question (or the podium after the last one)
        if (ph === 'reveal') {
          Object.assign(s, standings(s, players)); s.phaseAt = now;
          if (s.q + 1 >= qs.length) { s.phase = 'final'; await saveReport(ctx, s, qs, players); } else s.phase = 'scoreboard';
        } else if (ph === 'scoreboard') goQuestion(s, s.q + 1, qs, now);
        else conflict();
        break;
      case 'end':
        if (ph === 'final') conflict();
        if (s.q < 0) { await dropGame(ctx, pin); await ctx.audit(admin, 'game.close', s.title, { pin }); return send(res, 200, { closed: true }); }
        if (s.phase === 'question') { s.endsAt = Math.min(s.endsAt, now); s.openAt = Math.min(s.openAt, s.endsAt); s.early = true; }
        Object.assign(s, standings(s, players)); s.phase = 'final'; s.phaseAt = now;
        await saveReport(ctx, s, qs, players);
        break;
      case 'auto': s.auto = !!b.auto; break;
      case 'lock': s.locked = !!b.locked; break;
      case 'kick':
        if (!PID_RE.test(String(b.pid || ''))) throw new HttpError(400, 'Unknown player.');
        await kv.del(K.player + pin + ':' + b.pid);
        players = players.filter((x) => x.pid !== b.pid);
        return send(res, 200, hostState(s, qs, players));
      case 'close':
        await dropGame(ctx, pin);
        await ctx.audit(admin, 'game.close', s.title, { pin });
        return send(res, 200, { closed: true });
      default: throw new HttpError(400, 'Unknown action.');
    }
    s.t = iso();
    await kv.set(K.live + pin, s);
    return send(res, 200, hostState(s, qs, players));   // the screen draws the new state at once (no second request)
  }

  m = p.match(/^\/api\/admin\/games\/reports\/([a-f0-9]{16})$/);
  if (m) {
    const key = K.report + m[1];
    if (method === 'GET') { const r = (await keep.get([key])).get(key); if (!r) throw new HttpError(404, 'Report not found.'); return send(res, 200, { report: r }); }
    if (method === 'DELETE') { await keep.del(key); await ctx.audit(admin, 'game.report.delete', m[1]); return send(res, 200, { ok: true }); }
    throw new HttpError(405, 'Method not allowed.');
  }

  m = p.match(/^\/api\/admin\/games\/([0-9a-f-]{36})(?:\/(host|copy))?$/i);
  if (m) {
    const cur = await getQuiz(ctx, m[1]);
    if (!cur) throw new HttpError(404, 'Game not found.');
    if (!m[2] && method === 'GET') return send(res, 200, { quiz: cur });
    if (!m[2] && method === 'PATCH') {
      const quiz = cleanQuiz(ctx, await readJson(req, 400 * 1024), cur, admin);
      await keep.set(K.quiz + quiz.id, quiz);
      await ctx.audit(admin, 'game.update', quiz.title, { questions: quiz.count });
      return send(res, 200, { quiz });
    }
    if (!m[2] && method === 'DELETE') {
      await keep.del(K.quiz + cur.id);
      await ctx.audit(admin, 'game.delete', cur.title);
      return send(res, 200, { ok: true });
    }
    if (m[2] === 'copy' && method === 'POST') {
      if ((await keep.list(K.quiz, ['id'])).length >= MAX_QUIZZES) throw new HttpError(400, 'There are already ' + MAX_QUIZZES + ' games. Delete old ones first.');
      const quiz = cleanQuiz(ctx, { ...cur, title: (cur.title + ' (copy)').slice(0, 120) }, null, admin);
      await keep.set(K.quiz + quiz.id, quiz);
      await ctx.audit(admin, 'game.copy', quiz.title);
      return send(res, 201, { quiz });
    }
    if (m[2] === 'host' && method === 'POST') {
      ctx.rateLimit('gamehost:' + admin.id, 30, 10 * 60000);
      const b = await readJson(req, 1024);
      const mode = MODES.includes(b.mode) ? b.mode : 'classic';
      const live = await sweep(ctx); const kv = liveKv(ctx);
      let pin = '';
      for (let i = 0; i < 30 && !pin; i++) { const c = String(crypto.randomInt(100000, 1000000)); if (!live.some((s) => s.pin === c) && !(await liveOf(ctx, c))) pin = c; }
      if (!pin) throw new HttpError(503, 'Please try again.');
      const sid = crypto.randomBytes(8).toString('hex'); const now = iso();
      await kv.delPrefix(K.player + pin + ':');
      await kv.set(K.qs + pin, { sid, qs: cur.questions });
      const s = { sid, pin, quizId: cur.id, title: cur.title, subject: cur.subject, mode, auto: b.auto !== false, host: { id: admin.id, name: line(admin.name || admin.email, 60) }, n: cur.questions.length,
        phase: 'lobby', q: -1, openAt: 0, endsAt: 0, phaseAt: Date.now(), early: false, locked: false, ranks: {}, prevRanks: {}, top: [], count: 0, ranksAt: -1, createdAt: now, startedAt: null, t: now };
      await kv.set(K.live + pin, s);
      await ctx.audit(admin, 'game.host', cur.title, { pin, mode });
      return send(res, 201, { pin, sid, mode });
    }
    throw new HttpError(405, 'Method not allowed.');
  }
  throw new HttpError(404, 'Not found.');
}

module.exports = { route, adminRoute, _test: { pointsFor, phaseOf, standings, cleanQuiz, playerView, LEAD_MS, REVEAL_MS, BOARD_MS, mem } };
