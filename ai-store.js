'use strict';
/* ====
   ai-store.js -- the store of AI checks (server only, never sent to a browser as a file).

   Every Writing task and every Speaking attempt the AI examiner marks is kept on the student's account: the band, the four
   criteria with their comments, grammar corrections, vocabulary upgrades, strengths, next steps, the model answer(s), and
   what the student wrote or said (the text, or the transcripts; recordings are never stored).

     list(userId, { section, testKey, limit, before })   the light rows of one account, newest first (no feedback texts)
     get(userId, id)                                      one full check
     save(userId, rec)                                    a new check -> its id (null when it could not be saved)
     remove(userId, id) / removeByUser(userId)

   Fast on purpose:
   - Supabase: one table, indexed by ("userId", "createdAt" desc) and ("userId", "testKey", "createdAt" desc), so a list is
     one indexed read of at most 50 rows. A list asks only for the small columns; the feedback itself (column "report")
     is read only when one check is opened. Paging goes by date ("before"), not by offset.
   - Local file mode: one file per account in data/ai-reports/<userId>.json, kept in memory (the last 200 accounts used)
     and read again only when it changed on disk. A new check rewrites that one account's file, never data/db.json, so
     the main data file stays small and quick to save.
   - Only the owner reads a check: every query has the user id in it (Supabase: plus RLS with no policies, so the browser
     key sees nothing). Ids are checked before they reach the database.
   ==== */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECTIONS = ['Writing', 'Speaking'];
const LIGHT_COLS = ['id', 'section', 'kind', 'title', 'testKey', 'materialId', 'band', 'criteria', 'words', 'lang', 'createdAt'];
const LOCAL_MAX_PER_USER = 300;     // the newest checks of one account in local file mode
const LOCAL_CACHE_USERS = 200;
const MAX_REPORT_CHARS = 120000;    // one stored check (the biggest real one is about 40 000)

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v) => UUID.test(String(v || ''));
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:?\d{2})$/;
const TEST_KEY = /^\/[A-Za-z0-9._~\/-]{1,200}$/;
const str = (v, n) => String(v == null ? '' : v).slice(0, n);
const bandOf = (v) => { const n = Number(v); return Number.isFinite(n) ? Math.min(9, Math.max(0, Math.round(n * 2) / 2)) : 0; };
const light = (r) => { const o = {}; LIGHT_COLS.forEach((k) => { o[k] = r[k] === undefined ? null : r[k]; }); o.band = Number(o.band) || 0; return o; };

function createAiStore({ USE_SUPABASE, sb, eq, DATA_DIR, HttpError }) {
  let warned = false;
  const warnOnce = (msg) => { if (!warned) { warned = true; console.warn('AI reports store:', msg); } };

  /* ---------- one check, made safe before it is stored ---------- */
  function clean(userId, rec) {
    const section = SECTIONS.includes(rec.section) ? rec.section : null;
    if (!section) throw new Error('section');
    const criteria = {};
    Object.entries(rec.criteria && typeof rec.criteria === 'object' ? rec.criteria : {}).slice(0, 6).forEach(([k, v]) => {
      if (/^[a-zA-Z]{2,40}$/.test(k)) criteria[k] = v === null ? null : bandOf(v);
    });
    let report = rec.report && typeof rec.report === 'object' ? rec.report : {};
    if (JSON.stringify(report).length > MAX_REPORT_CHARS) {   // never more than one big check: the student's text is shortened first
      report = { ...report, answer: str(report.answer, 12000) };
      if (Array.isArray(report.answers)) report.answers = report.answers.slice(0, 30);
      if (JSON.stringify(report).length > MAX_REPORT_CHARS) report = { ...report, sampleAnswer: str(report.sampleAnswer, 3000), answers: (report.answers || []).map((a) => ({ ...a, modelAnswer: str(a.modelAnswer, 800) })) };
    }
    return {
      id: crypto.randomUUID(), userId: String(userId), section,
      kind: str(rec.kind, 20), testKey: TEST_KEY.test(String(rec.testKey || '')) ? String(rec.testKey) : '',
      materialId: isUuid(rec.materialId) ? String(rec.materialId) : '', title: str(rec.title, 160),
      band: bandOf(rec.band), criteria, words: Math.max(0, Math.min(100000, Math.floor(Number(rec.words) || 0))),
      lang: ['en', 'uz', 'ru'].includes(rec.lang) ? rec.lang : 'en', model: str(rec.model, 60),
      report, createdAt: new Date().toISOString()
    };
  }
  function query(o) {
    const limit = Math.max(1, Math.min(50, Math.floor(Number(o && o.limit)) || 20));
    const section = o && SECTIONS.includes(o.section) ? o.section : '';
    const testKey = o && TEST_KEY.test(String(o.testKey || '')) ? String(o.testKey) : '';
    const before = o && ISO.test(String(o.before || '')) && !Number.isNaN(Date.parse(o.before)) ? new Date(o.before).toISOString() : '';
    return { limit, section, testKey, before };
  }

  /* ---------- local file mode ---------- */
  const DIR = path.join(DATA_DIR, 'ai-reports');
  const cache = new Map();   // userId -> { stamp, list }   (a Map keeps the order: the oldest used is dropped first)
  const fileOf = (uid) => {
    if (!/^[A-Za-z0-9_-]{6,64}$/.test(String(uid))) throw new Error('bad user id');   // the id becomes a file name: nothing else gets in
    return path.join(DIR, uid + '.json');
  };
  const stampOf = (f) => { try { const st = fs.statSync(f); return st.size + ':' + st.mtimeMs; } catch (e) { return 'none'; } };
  function readLocal(uid) {
    const f = fileOf(uid); const stamp = stampOf(f); const hit = cache.get(uid);
    if (hit && hit.stamp === stamp) { cache.delete(uid); cache.set(uid, hit); return hit.list; }
    let list = [];
    if (stamp !== 'none') { try { const v = JSON.parse(fs.readFileSync(f, 'utf8')); list = Array.isArray(v) ? v : []; } catch (e) { list = []; } }
    cache.set(uid, { stamp, list });
    while (cache.size > LOCAL_CACHE_USERS) cache.delete(cache.keys().next().value);
    return list;
  }
  function writeLocal(uid, list) {
    const f = fileOf(uid);
    fs.mkdirSync(DIR, { recursive: true });
    if (!list.length) { try { fs.unlinkSync(f); } catch (e) { /* already gone */ } cache.set(uid, { stamp: 'none', list }); return; }
    const tmp = f + '.' + process.pid + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(list), { mode: 0o600 });
    fs.renameSync(tmp, f);
    cache.set(uid, { stamp: stampOf(f), list });
  }

  /* ---------- the store ---------- */
  return {
    SECTIONS,
    isUuid,
    async save(userId, rec) {
      let row;
      try { row = clean(userId, rec); } catch (e) { return null; }
      try {
        if (USE_SUPABASE) {
          if (!isUuid(userId)) return null;
          await sb('ieltsx_ai_reports', { method: 'POST', headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(row) });
          return row.id;
        }
        const list = readLocal(userId);
        writeLocal(userId, [row].concat(list).slice(0, LOCAL_MAX_PER_USER));
        return row.id;
      } catch (e) {
        // the student still gets the feedback on screen; the check is only not kept (e.g. supabase-schema.sql v9 not run yet)
        warnOnce((e && e.message) || String(e));
        return null;
      }
    },
    async list(userId, opts) {
      const q = query(opts);
      if (USE_SUPABASE) {
        if (!isUuid(userId)) return [];
        const rows = await sb(`ieltsx_ai_reports?select=${LIGHT_COLS.join(',')}&userId=eq.${eq(userId)}` +
          (q.section ? `&section=eq.${eq(q.section)}` : '') + (q.testKey ? `&testKey=eq.${eq(q.testKey)}` : '') + (q.before ? `&createdAt=lt.${eq(q.before)}` : '') +
          `&order=createdAt.desc&limit=${q.limit}`);
        return (rows || []).map(light);
      }
      return readLocal(userId).filter((r) => (!q.section || r.section === q.section) && (!q.testKey || r.testKey === q.testKey) && (!q.before || r.createdAt < q.before))
        .slice(0, q.limit).map(light);
    },
    async get(userId, id) {
      if (!isUuid(id)) return null;
      if (USE_SUPABASE) {
        if (!isUuid(userId)) return null;
        return ((await sb(`ieltsx_ai_reports?select=*&id=eq.${eq(id)}&userId=eq.${eq(userId)}&limit=1`)) || [])[0] || null;
      }
      return readLocal(userId).find((r) => r.id === id) || null;
    },
    async remove(userId, id) {
      if (!isUuid(id)) return false;
      if (USE_SUPABASE) {
        if (!isUuid(userId)) return false;
        const gone = await sb(`ieltsx_ai_reports?id=eq.${eq(id)}&userId=eq.${eq(userId)}`, { method: 'DELETE', headers: { Prefer: 'return=representation' } });
        return Array.isArray(gone) && gone.length > 0;
      }
      const list = readLocal(userId); const next = list.filter((r) => r.id !== id);
      if (next.length === list.length) return false;
      writeLocal(userId, next); return true;
    },
    async removeByUser(userId) {
      if (USE_SUPABASE) { if (isUuid(userId)) await sb(`ieltsx_ai_reports?userId=eq.${eq(userId)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } }); return true; }   // also "on delete cascade"
      try { writeLocal(userId, []); } catch (e) { /* nothing stored */ }
      return true;
    },
    /* for the Website check: is the table there? (Supabase) */
    async ready() {
      if (!USE_SUPABASE) return true;
      try { await sb('ieltsx_ai_reports?select=id&limit=1'); return true; } catch (e) { return false; }
    },
    HttpError
  };
}

module.exports = { createAiStore, isUuid, SECTIONS };
