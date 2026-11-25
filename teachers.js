'use strict';
/*
 * IELTSX — teachers and their classes.
 *   Admin → Teachers (admin-teachers.js)   makes an account a teacher, sees every teacher's performance, moves students
 *   /teacher (teacher.html, teacher.js)    the teacher's own panel: their students, their tests and bands, how much of
 *                                          every e-book each student has done, adding students
 *   /join (join.html)                      a student joins a class with the teacher's code / link, or accepts an invite
 *
 * A teacher only ever sees the students of their own class. An admin can open any teacher's panel (/teacher?as=<id>).
 * Kept in ieltsx_settings (no Supabase change), one value per teacher:
 *   teacher:<userId> { userId, active, title, maxStudents, code, groups[], students: [{ userId, group, addedAt, via }],
 *                      invites: [{ email, group, at }], createdAt, updatedAt }
 * A student is in at most one class. Server only (BLOCKED_FILES in server.js, PRIVATE in middleware.js).
 */
const crypto = require('crypto');

const KEY = (id) => 'teacher:' + id;
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_RE = /^[A-Z2-9]{6}$/;
const ID_RE = /^[A-Za-z0-9-]{8,64}$/;
const DAY = 86400000;
const INVITE_DAYS = 30;
const SECTIONS = ['Reading', 'Listening', 'Writing', 'Speaking'];
const line = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const newCode = () => Array.from(crypto.randomBytes(6), (b) => CODE_ABC[b % CODE_ABC.length]).join('');
const now = () => new Date().toISOString();
const ms = (v) => (v ? new Date(v).getTime() || 0 : 0);
const round1 = (v) => Math.round(v * 10) / 10;
const avg = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : null);

/* ───────── storage ───────── */
function normTeacher(v, userId) {
  v = v && typeof v === 'object' ? v : {};
  const seen = new Set();
  const groups = [...new Set((Array.isArray(v.groups) ? v.groups : []).map((g) => line(g, 40)).filter(Boolean))].slice(0, 30);
  return {
    userId, active: v.active !== false, title: line(v.title, 80),
    maxStudents: Math.max(1, Math.min(2000, Math.floor(Number(v.maxStudents)) || 200)),
    code: CODE_RE.test(String(v.code || '')) ? v.code : newCode(), groups,
    students: (Array.isArray(v.students) ? v.students : []).filter((s) => s && ID_RE.test(String(s.userId)) && !seen.has(s.userId) && seen.add(s.userId))
      .map((s) => ({ userId: s.userId, group: line(s.group, 40), addedAt: s.addedAt || now(), via: ['admin', 'created', 'code', 'invite'].includes(s.via) ? s.via : 'admin' })),
    invites: (Array.isArray(v.invites) ? v.invites : []).filter((x) => x && x.email && Date.now() - ms(x.at) < INVITE_DAYS * DAY).slice(0, 300)
      .map((x) => ({ email: String(x.email).toLowerCase().slice(0, 254), group: line(x.group, 40), at: x.at })),
    createdAt: v.createdAt || now(), updatedAt: v.updatedAt || null
  };
}
async function loadTeacher(ctx, userId, fresh) {
  if (!ID_RE.test(String(userId || ''))) return null;
  let v = null; try { v = await ctx.store.getSetting(KEY(userId), fresh ? { fresh: true } : undefined); } catch (e) { if (fresh) throw e; v = null; }   // fresh = a change is coming: never over a class that could not be read
  return v ? normTeacher(v, userId) : null;
}
async function saveTeacher(ctx, t) { t.updatedAt = now(); await ctx.store.setSetting(KEY(t.userId), t); if (ctx.teacherChanged) ctx.teacherChanged(t.userId); return t; }
async function allTeachers(ctx) {
  let rows = []; try { rows = await ctx.store.listSettings('teacher:', { limit: 2000 }); } catch (e) { rows = []; }
  return rows.map((r) => normTeacher(r.value, String(r.key).slice('teacher:'.length))).filter((t) => ID_RE.test(t.userId));
}
async function isTeacher(ctx, u) { if (!u) return false; const t = await loadTeacher(ctx, u.id); return !!(t && t.active); }
const classOf = (teachers, studentId) => teachers.find((t) => t.students.some((s) => s.userId === studentId)) || null;
/* takes the student out of any other class (a student is in one class) */
async function leaveOthers(ctx, teachers, studentId, keepId) {
  for (const t of teachers) {
    if (t.userId === keepId || !t.students.some((s) => s.userId === studentId)) continue;
    t.students = t.students.filter((s) => s.userId !== studentId);
    await saveTeacher(ctx, t);
  }
}

/* ───────── the numbers of one student ───────── */
function bandOf(results) { const b = results.map((r) => Number(r.band)).filter((x) => x > 0); return b.length ? round1(avg(b)) : null; }
/* rs = this student's results (newest first), prog = their e-book progress, books = [{ id, title, cover }], idx = { <bookId>: [unit heads] } */
function studentStats(ctx, u, link, rs, prog, books, idx) {
  const t = Date.now();
  const by = {};
  for (const s of SECTIONS) { const list = rs.filter((r) => r.section === s); by[s] = { count: list.length, band: bandOf(list), last: list[0] ? Number(list[0].band) : null }; }
  const recent = rs.slice(0, 5), before = rs.slice(5, 10);
  const keys = new Set(rs.map((r) => ctx.ebooks.testKeyOf(r.testKey)));
  const bookList = [];
  let unitsDone = 0, correct = 0, answered = 0, bookLast = 0;
  for (const b of books) {
    const units = idx[b.id] || []; if (!units.length) continue;
    const bp = prog && prog.books ? prog.books[b.id] : null;
    const s = ctx.ebooks.summarize(units, bp, keys);
    if (!bp && !s.done) continue;
    unitsDone += s.done; correct += s.correct; answered += s.answered; bookLast = Math.max(bookLast, ms(s.lastAt));
    bookList.push({ id: b.id, title: b.title, cover: b.cover || '', percent: s.percent, done: s.done, total: s.total, left: s.left, accuracy: s.accuracy, lastAt: s.lastAt, startedAt: s.startedAt });
  }
  bookList.sort((a, b) => ms(b.lastAt) - ms(a.lastAt));
  const lastTestAt = rs[0] ? rs[0].createdAt : null;
  const lastActive = Math.max(ms(u.lastLoginAt), ms(lastTestAt), bookLast) || null;
  return {
    id: u.id, name: u.name || 'Student', email: u.email || '', plan: ctx.planOf(u), premium: ctx.isPremium(u), verified: !!u.emailVerified, blocked: !!u.blocked,
    group: link.group || '', addedAt: link.addedAt, via: link.via, createdAt: u.createdAt || null, lastLoginAt: u.lastLoginAt || null,
    tests: rs.length, tests7: rs.filter((r) => t - ms(r.createdAt) < 7 * DAY).length, tests30: rs.filter((r) => t - ms(r.createdAt) < 30 * DAY).length,
    avgBand: bandOf(rs), lastBand: rs[0] ? Number(rs[0].band) : null, lastTestAt,
    trend: recent.length && before.length ? round1(bandOf(recent) - bandOf(before)) : null, bySection: by,
    books: { started: bookList.length, completed: bookList.filter((b) => b.total && b.done >= b.total).length, avgPercent: bookList.length ? Math.round(avg(bookList.map((b) => b.percent))) : null,
      unitsDone, accuracy: answered ? Math.round((correct / answered) * 100) : null, lastAt: bookLast ? new Date(bookLast).toISOString() : null, list: bookList },
    lastActive: lastActive ? new Date(lastActive).toISOString() : null
  };
}
/* the whole class: students (rows), the numbers on top and the last 14 days */
async function classData(ctx, t, opts) {
  const ids = t.students.map((s) => s.userId);
  const [users, results, progress, books] = await Promise.all([
    ctx.store.findUsersByIds(ids), ctx.store.listResultsFor(ids, 5000),
    ctx.ebooks.loadProgressMany(ctx, ids), (opts && opts.books) || ctx.ebooks.loadBooks(ctx)
  ]);
  const idx = (opts && opts.idx) || await ctx.ebooks.loadIndexes(ctx, books.map((b) => b.id));
  const byUser = new Map(); for (const r of results) { if (!byUser.has(r.userId)) byUser.set(r.userId, []); byUser.get(r.userId).push(r); }
  for (const list of byUser.values()) list.sort((a, b) => ms(b.createdAt) - ms(a.createdAt));
  const umap = new Map(users.map((u) => [u.id, u]));
  const rows = t.students.map((link) => {
    const u = umap.get(link.userId); if (!u) return null;
    return studentStats(ctx, u, link, byUser.get(u.id) || [], progress.get(u.id), books, idx);
  }).filter(Boolean);
  const nowMs = Date.now();
  const days = []; for (let i = 13; i >= 0; i--) days.push(new Date(nowMs - i * DAY).toISOString().slice(0, 10));
  const mine = new Set(rows.map((r) => r.id));
  const classResults = results.filter((r) => mine.has(r.userId));
  const r30 = classResults.filter((r) => nowMs - ms(r.createdAt) < 30 * DAY), rPrev = classResults.filter((r) => nowMs - ms(r.createdAt) >= 30 * DAY && nowMs - ms(r.createdAt) < 60 * DAY);
  const unitDays = days.map(() => 0);
  for (const [uid, prog] of progress) {
    if (!mine.has(uid)) continue;
    for (const bp of Object.values((prog && prog.books) || {})) for (const up of Object.values((bp && bp.units) || {})) {
      if (!up || !up.doneAt) continue; const k = days.indexOf(String(up.doneAt).slice(0, 10)); if (k > -1) unitDays[k] += 1;
    }
  }
  const active7 = rows.filter((r) => r.lastActive && nowMs - ms(r.lastActive) < 7 * DAY).length;
  const withBooks = rows.filter((r) => r.books.avgPercent != null);
  const band30 = bandOf(r30), bandPrev = bandOf(rPrev);
  const ebookAvg = withBooks.length ? Math.round(avg(withBooks.map((r) => r.books.avgPercent))) : null;
  const activeRate = rows.length ? Math.round((active7 / rows.length) * 100) : 0;
  // the score of a teacher (Admin → Teachers): how active the class is, how high its bands are, how far it is in the books
  const parts = [[activeRate, 0.4], [band30 != null ? (band30 / 9) * 100 : null, 0.3], [ebookAvg, 0.3]].filter((x) => x[0] != null);
  const w = parts.reduce((a, x) => a + x[1], 0);
  const score = rows.length && w ? Math.round(parts.reduce((a, x) => a + x[0] * x[1], 0) / w) : null;
  const bySection = {}; for (const s of SECTIONS) { const list = classResults.filter((r) => r.section === s); bySection[s] = { count: list.length, band: bandOf(list) }; }
  return {
    students: rows,
    kpis: { students: rows.length, max: t.maxStudents, active7, activeRate, tests7: classResults.filter((r) => nowMs - ms(r.createdAt) < 7 * DAY).length, tests30: r30.length, testsTotal: classResults.length,
      avgBand: bandOf(classResults), band30, bandPrev, bandTrend: band30 != null && bandPrev != null ? round1(band30 - bandPrev) : null,
      ebookAvg, ebookStarted: withBooks.length, unitsDone: rows.reduce((a, r) => a + r.books.unitsDone, 0), score, invites: t.invites.length, bySection },
    chart: { days, tests: days.map((d) => classResults.filter((r) => String(r.createdAt).slice(0, 10) === d).length), units: unitDays },
    latest: classResults.slice().sort((a, b) => ms(b.createdAt) - ms(a.createdAt)).slice(0, 12).map((r) => ({ userId: r.userId, name: (umap.get(r.userId) || {}).name || 'Student', section: r.section, pageLabel: r.pageLabel, scoreCorrect: r.scoreCorrect, scoreTotal: r.scoreTotal, band: r.band, createdAt: r.createdAt }))
  };
}
/* every e-book of the website with how far each student of the class is in it */
async function booksData(ctx, t) {
  const books = await ctx.ebooks.loadBooks(ctx);
  const idx = await ctx.ebooks.loadIndexes(ctx, books.map((b) => b.id));
  const data = await classData(ctx, t, { books, idx });
  const list = books.filter((b) => (idx[b.id] || []).length).map((b) => {
    const units = idx[b.id];
    const per = data.students.map((s) => { const x = s.books.list.find((y) => y.id === b.id); return { id: s.id, name: s.name, group: s.group, percent: x ? x.percent : 0, done: x ? x.done : 0, accuracy: x ? x.accuracy : null, lastAt: x ? x.lastAt : null, started: !!x }; });
    const started = per.filter((x) => x.started);
    return { id: b.id, title: b.title, author: b.author || '', cover: b.cover || '', level: b.level || '', plan: b.plan || 'free', published: b.published !== false,
      units: units.map((h) => ({ id: h.id, title: h.title, kind: h.kind, exercises: h.exercises })), started: started.length, completed: per.filter((x) => x.done >= units.length).length,
      avgPercent: started.length ? Math.round(avg(started.map((x) => x.percent))) : 0, students: per };
  });
  return { books: list, students: data.students.map((s) => ({ id: s.id, name: s.name, group: s.group })) };
}
/* one student in full: the tests, every unit of every e-book they started */
async function studentDetail(ctx, t, studentId) {
  const link = t.students.find((s) => s.userId === studentId);
  if (!link) throw new ctx.HttpError(404, 'This student is not in your class.');
  const u = await ctx.store.findUserById(studentId);
  if (!u) throw new ctx.HttpError(404, 'This account was deleted.');
  const [results, progress, books] = await Promise.all([ctx.store.listResults(u.id, 500), ctx.ebooks.loadProgressMany(ctx, [u.id]), ctx.ebooks.loadBooks(ctx)]);
  const idx = await ctx.ebooks.loadIndexes(ctx, books.map((b) => b.id));
  results.sort((a, b) => ms(b.createdAt) - ms(a.createdAt));
  const stats = studentStats(ctx, u, link, results, progress.get(u.id), books, idx);
  const keys = new Set(results.map((r) => ctx.ebooks.testKeyOf(r.testKey)));
  const prog = progress.get(u.id);
  stats.books.list = stats.books.list.map((b) => {
    const s = ctx.ebooks.summarize(idx[b.id] || [], prog.books[b.id], keys);
    return { ...b, units: (idx[b.id] || []).map((h) => ({ id: h.id, title: h.title, kind: h.kind, exercises: h.exercises, ...s.status[h.id] })) };
  });
  return { student: stats, results: results.slice(0, 200).map(({ id, section, pageLabel, testKey, scoreCorrect, scoreTotal, band, durationSec, createdAt, bucket }) => ({ id, section, pageLabel, testKey, scoreCorrect, scoreTotal, band, durationSec, createdAt, bucket })) };
}
function teacherView(t, tu) {
  return { userId: t.userId, name: (tu && tu.name) || 'Teacher', email: (tu && tu.email) || '', title: t.title, code: t.code, groups: t.groups, maxStudents: t.maxStudents, active: t.active,
    students: t.students.length, invites: t.invites.map((x) => ({ email: x.email, group: x.group, at: x.at })), createdAt: t.createdAt, updatedAt: t.updatedAt };
}

/* adds a student to the class t (moving them out of any other class) */
async function addStudent(ctx, t, studentId, group, via, teachers) {
  if (studentId === t.userId) throw new ctx.HttpError(400, 'A teacher cannot be a student of their own class.');
  if (t.students.some((s) => s.userId === studentId)) return false;
  if (t.students.length >= t.maxStudents) throw new ctx.HttpError(400, `This class is full (${t.maxStudents} students). The administrator can raise the limit.`);
  await leaveOthers(ctx, teachers || await allTeachers(ctx), studentId, t.userId);
  t.students.push({ userId: studentId, group: t.groups.includes(group) ? group : line(group, 40), addedAt: now(), via });
  if (group && !t.groups.includes(line(group, 40)) && t.groups.length < 30) t.groups.push(line(group, 40));
  return true;
}

/* ───────── the teacher's panel: /api/teacher/… ─────────
   GET    /api/teacher/me                    am I a teacher? my class settings (an admin may add ?as=<teacherId>)
   GET    /api/teacher/overview              the numbers, the chart and every student
   GET    /api/teacher/students/<id>         one student in full
   POST   /api/teacher/students              { mode: 'create', name, email, password, group } | { mode: 'invite', email(s), group }
   POST   /api/teacher/students/<id>         { group }
   DELETE /api/teacher/students/<id>         out of the class (the account stays)
   GET    /api/teacher/books                 every e-book with each student's progress
   POST   /api/teacher/settings              { title, groups }
   POST   /api/teacher/code                  a new class code (the old link stops working)
   POST   /api/teacher/invites/cancel        { email } */
async function teacherRoute(req, res, p, method, url, ctx) {
  const { send, readJson, HttpError, audit } = ctx;
  const nc = { 'Cache-Control': 'no-store, private' };
  const u = await ctx.currentUser(req);
  if (!u) throw new HttpError(401, 'Please sign in.');
  ctx.rateLimit('teacher:' + u.id, 300, 60000);
  const admin = ctx.isAdmin(u);
  const as = url.searchParams.get('as');
  let t, tu = u;
  if (as && admin) { t = await loadTeacher(ctx, as, method !== 'GET'); if (!t) throw new HttpError(404, 'This teacher was not found.'); tu = (await ctx.store.findUserById(as)) || { id: as, name: 'Deleted account', email: '' }; }
  else t = await loadTeacher(ctx, u.id, method !== 'GET');
  if (p === '/api/teacher/me' && method === 'GET') {
    if (!t || (!t.active && !(as && admin))) return send(res, 200, { teacher: null, admin, user: { name: u.name, email: u.email } }, nc);
    return send(res, 200, { teacher: teacherView(t, tu), admin, viewAs: !!(as && admin), user: { name: u.name, email: u.email } }, nc);
  }
  if (!t || (!t.active && !(as && admin))) throw new HttpError(403, 'This page is for teachers. Ask the administrator to give your account the teacher role.');
  const actor = u;   // the activity log shows who really did it (an admin working in a teacher's panel too)

  if (p === '/api/teacher/overview' && method === 'GET') return send(res, 200, { teacher: teacherView(t, tu), ...(await classData(ctx, t)) }, nc);
  if (p === '/api/teacher/books' && method === 'GET') return send(res, 200, await booksData(ctx, t), nc);
  let m = /^\/api\/teacher\/students\/([A-Za-z0-9-]{8,64})$/.exec(p);
  if (m && method === 'GET') return send(res, 200, await studentDetail(ctx, t, m[1]), nc);
  if (m && method === 'POST') {
    const b = await readJson(req); const link = t.students.find((s) => s.userId === m[1]);
    if (!link) throw new HttpError(404, 'This student is not in your class.');
    link.group = line(b.group, 40);
    if (link.group && !t.groups.includes(link.group) && t.groups.length < 30) t.groups.push(link.group);
    await saveTeacher(ctx, t);
    return send(res, 200, { ok: true, group: link.group, groups: t.groups }, nc);
  }
  if (m && method === 'DELETE') {
    if (!t.students.some((s) => s.userId === m[1])) throw new HttpError(404, 'This student is not in your class.');
    t.students = t.students.filter((s) => s.userId !== m[1]);
    await saveTeacher(ctx, t);
    const su = await ctx.store.findUserById(m[1]).catch(() => null);
    await audit(actor, 'class.remove', (su && su.email) || m[1], { teacher: tu.email });
    return send(res, 200, { ok: true }, nc);
  }
  if (p === '/api/teacher/students' && method === 'POST') {
    const b = await readJson(req);
    const group = line(b.group, 40);
    if (b.mode === 'create') {
      ctx.rateLimit('teacher-create:' + t.userId, 60, 60 * 60000);
      const email = ctx.normEmail(b.email), name = ctx.cleanName(b.name), password = String(b.password || '');
      if (!name) throw new HttpError(400, 'Write the student\'s name.');
      if (!ctx.validEmail(email)) throw new HttpError(400, 'Write a valid e-mail address for the student.');
      if (await ctx.store.findUserByEmail(email)) throw new HttpError(409, 'An account with this e-mail already exists. Use "Invite" instead: the student accepts it on the /join page.');
      ctx.checkPassword(password, email, name);
      if (t.students.length >= t.maxStudents) throw new HttpError(400, `This class is full (${t.maxStudents} students). The administrator can raise the limit.`);
      const hp = ctx.hashPassword(password);
      const s = await ctx.createUser({ name, email, passwordHash: hp.hash, passwordSalt: hp.salt });
      const fresh = await loadTeacher(ctx, t.userId, true) || t;
      await addStudent(ctx, fresh, s.id, group, 'created');
      await saveTeacher(ctx, fresh);
      await audit(actor, 'class.create', email, { teacher: tu.email });
      return send(res, 201, { student: { id: s.id, name: s.name, email: s.email } }, nc);
    }
    if (b.mode === 'invite') {
      ctx.rateLimit('teacher-invite:' + t.userId, 200, 60 * 60000);
      const emails = [...new Set((Array.isArray(b.emails) ? b.emails : String(b.email || '').split(/[\s,;]+/)).map(ctx.normEmail).filter(Boolean))].slice(0, 100);
      if (!emails.length) throw new HttpError(400, 'Write the student\'s e-mail.');
      const bad = emails.filter((e) => !ctx.validEmail(e));
      if (bad.length) throw new HttpError(400, 'Not a valid e-mail: ' + bad.slice(0, 3).join(', '));
      const done = { invited: [], already: [] };
      for (const e of emails) {
        const su = await ctx.store.findUserByEmail(e);
        if (su && t.students.some((s) => s.userId === su.id)) { done.already.push(e); continue; }
        if (su && su.id === t.userId) throw new HttpError(400, 'You cannot invite yourself.');
        t.invites = t.invites.filter((x) => x.email !== e);
        t.invites.unshift({ email: e, group, at: now() });
        done.invited.push(e);
      }
      if (t.invites.length > 300) t.invites = t.invites.slice(0, 300);
      if (group && !t.groups.includes(group) && t.groups.length < 30) t.groups.push(group);
      await saveTeacher(ctx, t);
      if (done.invited.length) await audit(actor, 'class.invite', done.invited.slice(0, 5).join(', ') + (done.invited.length > 5 ? ' …' : ''), { teacher: tu.email, count: done.invited.length });
      return send(res, 200, { ...done, invites: t.invites }, nc);
    }
    throw new HttpError(400, 'Choose how to add the student.');
  }
  if (p === '/api/teacher/invites/cancel' && method === 'POST') {
    const e = ctx.normEmail((await readJson(req)).email);
    t.invites = t.invites.filter((x) => x.email !== e);
    await saveTeacher(ctx, t);
    return send(res, 200, { invites: t.invites }, nc);
  }
  if (p === '/api/teacher/settings' && method === 'POST') {
    const b = await readJson(req);
    if (b.title !== undefined) t.title = line(b.title, 80);
    if (Array.isArray(b.groups)) {
      t.groups = [...new Set(b.groups.map((g) => line(g, 40)).filter(Boolean))].slice(0, 30);
      t.students.forEach((s) => { if (s.group && !t.groups.includes(s.group)) s.group = ''; });
    }
    await saveTeacher(ctx, t);
    return send(res, 200, { teacher: teacherView(t, tu) }, nc);
  }
  if (p === '/api/teacher/code' && method === 'POST') {
    t.code = newCode();
    await saveTeacher(ctx, t);
    await audit(actor, 'class.code', tu.email);
    return send(res, 200, { teacher: teacherView(t, tu) }, nc);
  }
  throw new HttpError(404, 'Not found.');
}

/* ───────── the student's side: /api/class ─────────
   GET  /api/class                 my teacher (if any) and the invites waiting for me
   POST /api/class/join            { code } | { teacher: <id> }   (an invite of that teacher)
   POST /api/class/decline         { teacher: <id> }
   POST /api/class/leave */
async function classRoute(req, res, p, method, ctx) {
  const { send, readJson, HttpError, audit } = ctx;
  const nc = { 'Cache-Control': 'no-store, private' };
  const u = await ctx.currentUser(req);
  if (!u) throw new HttpError(401, 'Please sign in.');
  ctx.rateLimit('class:' + u.id, 60, 60000);
  const email = ctx.normEmail(u.email);
  const teachers = (await allTeachers(ctx)).filter((t) => t.active);
  const names = async (list) => { const us = await ctx.store.findUsersByIds(list.map((t) => t.userId)); const m = new Map(us.map((x) => [x.id, x])); return (t) => ({ id: t.userId, name: (m.get(t.userId) || {}).name || 'Teacher', title: t.title }); };
  const state = async () => {
    const mine = classOf(teachers, u.id);
    const inv = teachers.filter((t) => t.userId !== (mine && mine.userId) && t.invites.some((x) => x.email === email));
    const nm = await names([...(mine ? [mine] : []), ...inv]);
    return { teacher: mine ? { ...nm(mine), group: (mine.students.find((s) => s.userId === u.id) || {}).group || '' } : null, invites: inv.map(nm) };
  };
  if (p === '/api/class' && method === 'GET') return send(res, 200, await state(), nc);
  if (method !== 'POST') throw new HttpError(405, 'Method not allowed.');
  if (p === '/api/class/join') {
    ctx.rateLimit('class-join:' + u.id, 20, 15 * 60000);
    const b = await readJson(req);
    let t = null, via = 'code', group = '';
    if (b.code) { const code = String(b.code).trim().toUpperCase().replace(/[^A-Z0-9]/g, ''); t = teachers.find((x) => x.code === code); if (!t) throw new HttpError(404, 'No class has this code. Check it with your teacher.'); }
    else if (b.teacher) { t = teachers.find((x) => x.userId === String(b.teacher) && x.invites.some((i) => i.email === email)); if (!t) throw new HttpError(404, 'This invitation is no longer valid.'); via = 'invite'; group = (t.invites.find((i) => i.email === email) || {}).group || ''; }
    else throw new HttpError(400, 'Write the class code.');
    if (t.userId === u.id) throw new HttpError(400, 'This is your own class.');
    if (teachers.some((x) => x.userId === u.id)) throw new HttpError(400, 'A teacher account cannot join a class as a student.');
    const fresh = await loadTeacher(ctx, t.userId, true) || t;
    await addStudent(ctx, fresh, u.id, group, via, teachers);
    fresh.invites = fresh.invites.filter((i) => i.email !== email);
    await saveTeacher(ctx, fresh);
    await audit(u, 'class.join', u.email, { teacher: fresh.userId, via });
    teachers.splice(0, teachers.length, ...(await allTeachers(ctx)).filter((x) => x.active));
    return send(res, 200, await state(), nc);
  }
  if (p === '/api/class/decline') {
    const want = String((await readJson(req)).teacher || '');
    const t = teachers.find((x) => x.userId === want);
    if (t) { t.invites = t.invites.filter((i) => i.email !== email); await saveTeacher(ctx, t); }
    return send(res, 200, await state(), nc);
  }
  if (p === '/api/class/leave') {
    const t = classOf(teachers, u.id);
    if (t) { t.students = t.students.filter((s) => s.userId !== u.id); await saveTeacher(ctx, t); await audit(u, 'class.leave', u.email, { teacher: t.userId }); }
    return send(res, 200, await state(), nc);
  }
  throw new HttpError(404, 'Not found.');
}

/* ───────── admin: /api/admin/teachers… ─────────
   GET    /api/admin/teachers                     every teacher with the performance of their class
   POST   /api/admin/teachers                     { email | userId, title, maxStudents }   make an account a teacher
   GET    /api/admin/teachers/of/<userId>         is this account a teacher, and whose student is it (the user drawer)
   GET    /api/admin/teachers/<id>                one teacher: their class (the same numbers the teacher sees)
   POST   /api/admin/teachers/<id>                { title, maxStudents, active }
   DELETE /api/admin/teachers/<id>                no longer a teacher (the students stay, without a class)
   POST   /api/admin/teachers/<id>/students       { emails | userIds, group }   put students in this class (moved from another)
   DELETE /api/admin/teachers/<id>/students/<s>   take a student out */
async function adminRoute(req, res, p, method, url, ctx) {
  const { send, readJson, HttpError, admin, audit } = ctx;
  const nc = { 'Cache-Control': 'no-store' };
  if (p === '/api/admin/teachers' && method === 'GET') {
    const teachers = await allTeachers(ctx);
    const [users, books] = await Promise.all([ctx.store.findUsersByIds(teachers.map((t) => t.userId)), ctx.ebooks.loadBooks(ctx)]);
    const idx = await ctx.ebooks.loadIndexes(ctx, books.map((b) => b.id));
    const um = new Map(users.map((x) => [x.id, x]));
    const list = [];
    for (const t of teachers) {
      const d = await classData(ctx, t, { books, idx });
      const tu = um.get(t.userId);
      list.push({ ...teacherView(t, tu), deleted: !tu, kpis: d.kpis, chart: d.chart,
        top: d.students.filter((s) => s.avgBand != null).sort((a, b) => b.avgBand - a.avgBand).slice(0, 3).map((s) => ({ id: s.id, name: s.name, avgBand: s.avgBand })),
        inactive: d.students.filter((s) => !s.lastActive || Date.now() - ms(s.lastActive) > 7 * DAY).length });
    }
    list.sort((a, b) => (b.kpis.score ?? -1) - (a.kpis.score ?? -1));
    const inClass = new Set(teachers.flatMap((t) => t.students.map((s) => s.userId)));
    return send(res, 200, { teachers: list, inClass: inClass.size, ebooks: books.filter((b) => (idx[b.id] || []).length).length }, nc);
  }
  if (p === '/api/admin/teachers' && method === 'POST') {
    const b = await readJson(req);
    const u = b.userId ? await ctx.store.findUserById(String(b.userId)) : await ctx.store.findUserByEmail(ctx.normEmail(b.email));
    if (!u) throw new HttpError(404, 'No account with this e-mail. The teacher must sign up on the website first.');
    if (u.blocked) throw new HttpError(400, 'This account is suspended.');
    const old = await loadTeacher(ctx, u.id, true);
    const t = normTeacher({ ...(old || {}), active: true, title: b.title !== undefined ? b.title : old && old.title, maxStudents: b.maxStudents || (old && old.maxStudents) }, u.id);
    const teachers = await allTeachers(ctx);
    const was = classOf(teachers, u.id);
    if (was) { was.students = was.students.filter((s) => s.userId !== u.id); await saveTeacher(ctx, was); }   // a teacher is nobody's student
    await saveTeacher(ctx, t);
    await audit(admin, 'teacher.add', u.email, { title: t.title });
    return send(res, old ? 200 : 201, { teacher: teacherView(t, u) }, nc);
  }
  let m = /^\/api\/admin\/teachers\/of\/([A-Za-z0-9-]{8,64})$/.exec(p);
  if (m && method === 'GET') {
    const teachers = await allTeachers(ctx);
    const own = teachers.find((t) => t.userId === m[1]) || null;
    const cls = classOf(teachers, m[1]);
    const tu = cls ? await ctx.store.findUserById(cls.userId) : null;
    return send(res, 200, { teacher: own ? teacherView(own, null) : null, classOf: cls ? { id: cls.userId, name: (tu && tu.name) || 'Teacher', email: (tu && tu.email) || '', group: (cls.students.find((s) => s.userId === m[1]) || {}).group || '' } : null,
      teachers: (await ctx.store.findUsersByIds(teachers.filter((t) => t.active).map((t) => t.userId))).map((x) => ({ id: x.id, name: x.name, email: x.email })) }, nc);
  }
  m = /^\/api\/admin\/teachers\/([A-Za-z0-9-]{8,64})(?:\/students(?:\/([A-Za-z0-9-]{8,64}))?)?$/.exec(p);
  if (!m) throw new HttpError(404, 'API endpoint not found.');
  const id = m[1]; const sub = /\/students/.test(p);
  const t = await loadTeacher(ctx, id, method !== 'GET');
  if (!t) throw new HttpError(404, 'This teacher was not found.');
  const tu = await ctx.store.findUserById(id);
  if (!sub && method === 'GET') return send(res, 200, { teacher: teacherView(t, tu), ...(await classData(ctx, t)) }, nc);
  if (!sub && method === 'POST') {
    const b = await readJson(req);
    if (b.title !== undefined) t.title = line(b.title, 80);
    if (b.maxStudents !== undefined) t.maxStudents = Math.max(1, Math.min(2000, Math.floor(Number(b.maxStudents)) || 200));
    if (b.active !== undefined) t.active = b.active !== false;
    await saveTeacher(ctx, t);
    await audit(admin, 'teacher.edit', (tu && tu.email) || id, { title: t.title, maxStudents: t.maxStudents, active: t.active });
    return send(res, 200, { teacher: teacherView(t, tu) }, nc);
  }
  if (!sub && method === 'DELETE') {
    await ctx.store.deleteSetting(KEY(id));
    if (ctx.teacherChanged) ctx.teacherChanged(id);
    await audit(admin, 'teacher.remove', (tu && tu.email) || id, { students: t.students.length });
    return send(res, 200, { ok: true }, nc);
  }
  if (sub && !m[2] && method === 'POST') {
    const b = await readJson(req);
    const group = line(b.group, 40);
    const wanted = Array.isArray(b.userIds) ? b.userIds.map(String) : [];
    const emails = (Array.isArray(b.emails) ? b.emails : String(b.email || '').split(/[\s,;]+/)).map(ctx.normEmail).filter(Boolean).slice(0, 200);
    const teachers = await allTeachers(ctx);
    const out = { added: [], missing: [], already: [] };
    const ids = [...wanted];
    for (const e of emails) { const su = await ctx.store.findUserByEmail(e); if (su) ids.push(su.id); else out.missing.push(e); }
    for (const sid of [...new Set(ids)]) {
      const su = await ctx.store.findUserById(sid); if (!su) { out.missing.push(sid); continue; }
      if (teachers.some((x) => x.userId === sid && x.active)) throw new HttpError(400, `${su.email} is a teacher and cannot be a student.`);
      if (await addStudent(ctx, t, sid, group, 'admin', teachers)) out.added.push(su.email); else out.already.push(su.email);
    }
    await saveTeacher(ctx, t);
    if (out.added.length) await audit(admin, 'class.assign', out.added.slice(0, 5).join(', ') + (out.added.length > 5 ? ' …' : ''), { teacher: (tu && tu.email) || id, count: out.added.length });
    return send(res, 200, { ...out, teacher: teacherView(t, tu) }, nc);
  }
  if (sub && m[2] && method === 'DELETE') {
    t.students = t.students.filter((s) => s.userId !== m[2]);
    await saveTeacher(ctx, t);
    await audit(admin, 'class.remove', m[2], { teacher: (tu && tu.email) || id });
    return send(res, 200, { ok: true, teacher: teacherView(t, tu) }, nc);
  }
  throw new HttpError(405, 'Method not allowed.');
}

/* an account was deleted: it is taken out of its class, and its own class goes */
async function forgetUser(ctx, userId) {
  const teachers = await allTeachers(ctx);
  for (const t of teachers) if (t.students.some((s) => s.userId === userId)) { t.students = t.students.filter((s) => s.userId !== userId); await saveTeacher(ctx, t); }
  if (teachers.some((t) => t.userId === userId)) { await ctx.store.deleteSetting(KEY(userId)); if (ctx.teacherChanged) ctx.teacherChanged(userId); }
  await ctx.store.deleteSetting('ebook-progress:' + userId).catch(() => {});
}

module.exports = { teacherRoute, classRoute, adminRoute, isTeacher, loadTeacher, allTeachers, forgetUser };
