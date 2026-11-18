'use strict';
/*
 * IELTSX Guard — site-watch.js: a small "AI watchman" for the website (Admin → Site Guard, admin-guard.js).
 *
 * Every run (on a timer of the Node server, a Vercel cron job, an outside pinger, or "Check now" in the admin panel):
 *   1. runs the Website check (site-check.js): setup, tests and articles, people, broken links, heavy files, SEO
 *   2. opens the main pages and API answers of the live site and times them (a page that does not open is a problem)
 *   3. reads the errors visitors' browsers met (assets/js/loading.js sends them to POST /api/client-errors)
 *   4. compares the site with the last run: new / changed / hidden / deleted tests, new accounts and orders, settings
 *      saved in the admin panel (prices, menu, predictions, design …) and the website's own files (a new deploy)
 *   5. fixes what is safe to fix by itself (each one can be switched off): hides published tests that cannot work
 *      (no questions, no passage, Listening without audio), hides menu items whose page is gone, closes browser errors
 *      that stopped happening
 *   6. asks the AI (the same OPENAI_API_KEY as the AI check) for a short report: what is wrong, how urgent, how to fix it
 *   7. tells the admins when something NEW goes wrong (Telegram bot and / or e-mail), and once a day a short summary
 * Nothing it changes is deleted: a hidden test can be published again in its own admin page. Every fix is in the Activity log.
 *
 * Settings: "site-watch-config" (the admin's choices), "site-watch-state" (last run, history, what was already told),
 * "site-errors" (browser errors, grouped). Secrets (the Telegram bot token) never go back to a browser in full.
 *   TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID   (environment) beat the ones typed in the panel
 *   CRON_SECRET                              protects /api/cron/site-watch (Vercel sends it as "Authorization: Bearer …")
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CONFIG = 'site-watch-config';
const STATE = 'site-watch-state';
const ERRORS = 'site-errors';
const INTERVALS = [15, 30, 60, 180, 360, 720, 1440];
const MAX_HISTORY = 40;
const MAX_ERRORS = 150;
const DEFAULTS = {
  enabled: true, intervalMin: 60, lang: 'uz',
  notifyTelegram: true, notifyEmail: true, notifyLevel: 'fail', digest: true,
  telegramToken: '', telegramChat: '', emails: '',
  autoHideBroken: false, autoHideDeadMenu: true, autoCloseErrors: true, ai: true
};
/* the pages and answers opened on every run (path, name, kind) */
const PROBES = [
  ['/', 'Home', 'page'], ['/part/practice/reading', 'Reading · Part practice', 'page'], ['/part/practice/listening', 'Listening · Part practice', 'page'],
  ['/part/practice/writing', 'Writing · Part practice', 'page'], ['/full-tests/reading/', 'Full tests · Reading', 'page'], ['/Predictions', 'Predictions', 'page'],
  ['/Mock%20tests', 'Mock tests', 'page'], ['/Price', 'Price', 'page'], ['/login', 'Sign in', 'page'],
  ['/api/plans', 'Plans (API)', 'api'], ['/api/materials?type=reading&mode=part', 'Reading cards (API)', 'api'], ['/api/materials?type=listening&mode=part', 'Listening cards (API)', 'api'],
  ['/api/predictions', 'Predictions (API)', 'api'], ['/api/sidebar', 'Menu (API)', 'api'], ['/api/branding', 'Logo (API)', 'api']
];
const SKIP = new Set(['node_modules', '.git', '.npm', '.vscode', '.github', '.claude', 'data', 'uploads', '${HOME}']);
const T = {   // the fixed words of the messages (the AI report itself is written in the chosen language)
  uz: { title: 'IELTSX Guard', newP: 'Yangi muammo', resolved: 'Tuzaldi', fixed: 'Avtomatik tuzatildi', changes: 'Saytdagi o‘zgarishlar', score: 'Sayt holati', open: 'Batafsil', errors: 'Brauzer xatolari', digest: 'Kunlik hisobot', all: 'Hammasi joyida', test: 'Sinov xabari: bildirishnomalar ishlayapti ✅', ai: 'AI xulosasi' },
  en: { title: 'IELTSX Guard', newP: 'New problem', resolved: 'Resolved', fixed: 'Fixed automatically', changes: 'What changed on the site', score: 'Site health', open: 'Details', errors: 'Browser errors', digest: 'Daily summary', all: 'All good', test: 'Test message: notifications work ✅', ai: 'AI summary' },
  ru: { title: 'IELTSX Guard', newP: 'Новая проблема', resolved: 'Исправлено', fixed: 'Исправлено автоматически', changes: 'Изменения на сайте', score: 'Состояние сайта', open: 'Подробнее', errors: 'Ошибки в браузере', digest: 'Ежедневный отчёт', all: 'Всё в порядке', test: 'Тестовое сообщение: уведомления работают ✅', ai: 'Вывод ИИ' }
};
const LANG_NAME = { uz: 'Uzbek (Latin script)', en: 'English', ru: 'Russian' };

const hash = (s) => crypto.createHash('sha1').update(String(s)).digest('hex').slice(0, 12);
const oneLine = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const now = () => new Date().toISOString();
let running = null;          // the run in progress (one at a time per server)
let lastInstantAlert = 0;    // a new browser error is told at once, at most every 10 minutes

/* ───────── settings ───────── */
async function loadConfig(ctx) {
  let v = null; try { v = await ctx.store.getSetting(CONFIG); } catch (e) { v = null; }
  return { ...DEFAULTS, ...(v && typeof v === 'object' ? v : {}) };
}
function cleanConfig(b, old) {
  const c = { ...old };
  const bool = (k) => { if (k in b) c[k] = !!b[k]; };
  ['enabled', 'notifyTelegram', 'notifyEmail', 'digest', 'autoHideBroken', 'autoHideDeadMenu', 'autoCloseErrors', 'ai'].forEach(bool);
  if ('intervalMin' in b) c.intervalMin = INTERVALS.includes(Number(b.intervalMin)) ? Number(b.intervalMin) : 60;
  if ('notifyLevel' in b) c.notifyLevel = b.notifyLevel === 'warn' ? 'warn' : 'fail';
  if ('lang' in b) c.lang = T[b.lang] ? b.lang : 'uz';
  if ('telegramChat' in b) c.telegramChat = oneLine(b.telegramChat, 40).replace(/[^\-0-9@A-Za-z_]/g, '');
  // the token is only replaced when a new one is typed (the panel shows a masked copy); "-" removes it
  if (typeof b.telegramToken === 'string' && b.telegramToken.trim() && !b.telegramToken.includes('•')) {
    const t = b.telegramToken.trim();
    c.telegramToken = t === '-' ? '' : (/^\d{5,15}:[A-Za-z0-9_-]{20,80}$/.test(t) ? t : c.telegramToken);
    if (t !== '-' && c.telegramToken !== t) throw Object.assign(new Error('This does not look like a Telegram bot token (it is like 123456789:AA…, from @BotFather).'), { status: 400 });
  }
  if ('emails' in b) c.emails = String(b.emails || '').split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)).slice(0, 5).join(', ');
  c.updatedAt = now();
  return c;
}
const telegramOf = (cfg) => ({ token: String(process.env.TELEGRAM_BOT_TOKEN || cfg.telegramToken || '').trim(), chat: String(process.env.TELEGRAM_CHAT_ID || cfg.telegramChat || '').trim(), fromEnv: !!process.env.TELEGRAM_BOT_TOKEN });
function publicConfig(cfg) {
  const tg = telegramOf(cfg);
  return { ...cfg, telegramToken: tg.token ? '••••••' + tg.token.slice(-4) : '', telegramFromEnv: tg.fromEnv, telegramChatFromEnv: !!process.env.TELEGRAM_CHAT_ID, telegramReady: !!(tg.token && tg.chat), cronSecret: !!process.env.CRON_SECRET };
}
async function loadState(ctx) {
  let v = null; try { v = await ctx.store.getSetting(STATE); } catch (e) { v = null; }
  return v && typeof v === 'object' ? { history: [], known: [], ...v } : { history: [], known: [], last: null, snapshot: null };
}
async function loadErrors(ctx) {
  let v = null; try { v = await ctx.store.getSetting(ERRORS); } catch (e) { v = null; }
  return v && Array.isArray(v.groups) ? v : { groups: [] };
}

/* ───────── 2. the live pages ───────── */
async function probe(origin) {
  const out = [];
  const one = async ([p, name, kind]) => {
    const t0 = Date.now(); let status = 0, error = '';
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 12000);
      try { const r = await fetch(origin + p, { redirect: 'manual', signal: ctl.signal, headers: { 'user-agent': 'IELTSX-Guard/1.0', accept: kind === 'api' ? 'application/json' : 'text/html' } }); status = r.status; await r.arrayBuffer().catch(() => null); }
      finally { clearTimeout(t); }
    } catch (e) { error = e.name === 'AbortError' ? 'no answer in 12 s' : (e.cause && e.cause.code) || e.message; }
    out.push({ path: p, name, kind, status, ms: Date.now() - t0, ok: status > 0 && status < 400, error });
  };
  for (let i = 0; i < PROBES.length; i += 3) await Promise.all(PROBES.slice(i, i + 3).map(one));   // three at a time: no burst on the site
  return out.sort((a, b) => PROBES.findIndex((x) => x[0] === a.path) - PROBES.findIndex((x) => x[0] === b.path));
}
async function linkStatus(origin, href) {
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
    try { const r = await fetch(origin + href, { redirect: 'manual', signal: ctl.signal, headers: { 'user-agent': 'IELTSX-Guard/1.0' } }); await r.arrayBuffer().catch(() => null); return r.status; }
    finally { clearTimeout(t); }
  } catch (e) { return 0; }
}

/* ───────── 4. what changed ───────── */
function walkFiles(root, rel, out, depth) {
  if (depth > 6 || out.length > 4000) return out;
  let list = []; try { list = fs.readdirSync(path.join(root, rel), { withFileTypes: true }); } catch (e) { return out; }
  for (const e of list) {
    if (e.name.startsWith('.') || SKIP.has(e.name)) continue;
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) walkFiles(root, r, out, depth + 1);
    else if (/\.(html|js|css)$/i.test(e.name)) { try { const st = fs.statSync(path.join(root, r)); out.push([r, st.size + ':' + Math.round(st.mtimeMs)]); } catch (er) { /* gone */ } }
  }
  return out;
}
async function snapshot(ctx, mats, counts) {
  const settings = {};
  for (const k of ['predictions', 'sidebar', 'design', 'pricing-config', 'branding', 'access-rules', 'mock-tests', 'admin-packs']) {
    try { const v = await ctx.store.getSetting(k); settings[k] = v ? hash(JSON.stringify(v)) : ''; } catch (e) { settings[k] = '?'; }
  }
  const files = ctx.isVercel ? null : Object.fromEntries(walkFiles(ctx.root, '', [], 0));
  return {
    at: now(), deploy: process.env.VERCEL_GIT_COMMIT_SHA || '', settings, files, ...counts,
    mats: Object.fromEntries(mats.map((m) => [m.id, [m.type, oneLine(m.title, 80), m.published === false ? 0 : 1, hash(JSON.stringify(m.data || {}))]]))
  };
}
const SETTING_NAMES = { predictions: 'Predictions', sidebar: 'the sidebar menu', design: 'the design', 'pricing-config': 'prices / promo codes', branding: 'the logo', 'access-rules': 'Access (locks / plans)', 'mock-tests': 'Mock tests', 'admin-packs': 'Full Tests packs' };
const TYPE_NAMES = { reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking', article: 'Article', pdf: 'PDF', vocab: 'Vocabulary' };
function diff(prev, cur) {
  const ch = [];
  if (!prev) return [{ kind: 'info', text: 'First check: from now on every change of the site is listed here.' }];
  const name = (row) => `${TYPE_NAMES[row[0]] || row[0]} “${row[1]}”`;
  const added = [], removed = [], hidden = [], shown = [], edited = [];
  for (const [id, row] of Object.entries(cur.mats || {})) {
    const old = (prev.mats || {})[id];
    if (!old) added.push(name(row) + (row[2] ? '' : ' (hidden)'));
    else { if (old[2] && !row[2]) hidden.push(name(row)); else if (!old[2] && row[2]) shown.push(name(row)); if (old[3] !== row[3]) edited.push(name(row)); }
  }
  for (const [id, row] of Object.entries(prev.mats || {})) if (!(cur.mats || {})[id]) removed.push(name(row));
  const list = (arr) => arr.slice(0, 6).join(', ') + (arr.length > 6 ? ` +${arr.length - 6}` : '');
  if (added.length) ch.push({ kind: 'content', text: `New: ${list(added)}` });
  if (shown.length) ch.push({ kind: 'content', text: `Published: ${list(shown)}` });
  if (hidden.length) ch.push({ kind: 'content', text: `Hidden: ${list(hidden)}` });
  if (edited.length) ch.push({ kind: 'content', text: `Edited: ${list(edited)}` });
  if (removed.length) ch.push({ kind: 'content', text: `Deleted: ${list(removed)}` });
  for (const [k, v] of Object.entries(cur.settings || {})) if (prev.settings && prev.settings[k] !== undefined && prev.settings[k] !== v) ch.push({ kind: 'settings', text: `Admin panel: ${SETTING_NAMES[k] || k} changed` });
  if ((cur.users || 0) > (prev.users || 0)) ch.push({ kind: 'people', text: `${cur.users - prev.users} new account${cur.users - prev.users === 1 ? '' : 's'}` });
  if ((cur.orders || 0) > (prev.orders || 0)) ch.push({ kind: 'people', text: `${cur.orders - prev.orders} new order${cur.orders - prev.orders === 1 ? '' : 's'}` });
  if ((cur.results || 0) > (prev.results || 0)) ch.push({ kind: 'people', text: `${cur.results - prev.results} test${cur.results - prev.results === 1 ? '' : 's'} finished` });
  if (cur.deploy && prev.deploy && cur.deploy !== prev.deploy) ch.push({ kind: 'code', text: `New version of the website deployed (${cur.deploy.slice(0, 7)})` });
  if (cur.files && prev.files) {
    const changed = [], made = [], gone = [];
    for (const [f, sig] of Object.entries(cur.files)) { if (!(f in prev.files)) made.push(f); else if (prev.files[f] !== sig) changed.push(f); }
    for (const f of Object.keys(prev.files)) if (!(f in cur.files)) gone.push(f);
    if (changed.length) ch.push({ kind: 'code', text: `Website files changed: ${list(changed)}` });
    if (made.length) ch.push({ kind: 'code', text: `New files: ${list(made)}` });
    if (gone.length) ch.push({ kind: 'code', text: `Files removed: ${list(gone)}` });
  }
  return ch;
}

/* ───────── issues: what is wrong right now ───────── */
function issuesOf(report, probes, errors) {
  const out = [];
  for (const s of (report && report.sections) || []) {
    for (const f of s.items) {
      if (f.level !== 'fail' && f.level !== 'warn') continue;
      out.push({ id: 'sc:' + hash(s.id + '|' + f.title.replace(/^\d+\s*/, '')), level: f.level, area: s.title, title: f.title, detail: f.detail || '', fix: f.fix || '', items: (f.items || []).slice(0, 6) });
    }
  }
  for (const p of probes || []) {
    if (!p.ok) out.push({ id: 'probe:' + hash(p.path), level: 'fail', area: 'Live pages', title: `${p.name} does not open (${p.status || p.error || 'no answer'})`, detail: p.path, fix: p.status >= 500 ? 'The server failed on this page: look at the server log (Vercel → Logs) at this time.' : 'Check that the page exists and the server is running.' });
    else if (p.ms > (p.kind === 'api' ? 2500 : 4000)) out.push({ id: 'slow:' + hash(p.path), level: 'warn', area: 'Live pages', title: `${p.name} is slow: ${(p.ms / 1000).toFixed(1)} s`, detail: p.path, fix: 'If it stays slow, check the database (Supabase) and the size of the page.' });
  }
  const day = Date.now() - 86400000;
  for (const g of (errors && errors.groups) || []) {
    if (g.status !== 'open' || Date.parse(g.last) < day) continue;
    out.push({ id: 'err:' + g.id, level: g.count >= 25 ? 'fail' : 'warn', area: 'Browser errors', title: `${g.kind === 'resource' ? 'Missing file' : 'Script error'} on ${g.page}: ${g.message}`.slice(0, 220), detail: `${g.count}× · last ${new Date(g.last).toLocaleString('en-GB')}${g.source ? ' · ' + g.source + (g.line ? ':' + g.line : '') : ''}`, fix: g.kind === 'resource' ? 'Upload the file again or fix the link that points at it.' : 'Copy this error for Claude / the developer (Site Guard → Copy for Claude).' });
  }
  return out;
}

/* ───────── 5. safe fixes ───────── */
async function autofix(ctx, cfg, mats, origin, errors) {
  const fixes = [];
  if (cfg.autoHideBroken) {
    const qs = (m) => (m.data && Array.isArray(m.data.questions) ? m.data.questions : []);
    for (const m of mats) {
      if (m.published === false || (m.type !== 'reading' && m.type !== 'listening')) continue;
      const d = m.data || {};
      let why = '';
      if (!qs(m).length) why = 'no questions';
      else if (m.type === 'listening' && !d.audioUrl) why = 'no audio';
      else if (m.type === 'reading' && (d.mode === 'full' ? !(d.passages || []).some((p) => p && p.passage) : !String(d.passage || '').trim())) why = 'no passage';
      if (!why) continue;
      try {
        await ctx.store.updateMaterial(m.id, { published: false, updatedAt: now() });
        m.published = false;
        fixes.push(`Hidden ${TYPE_NAMES[m.type]} “${oneLine(m.title, 80)}” (${why}) — publish it again after fixing it`);
        await ctx.audit({ id: null, email: 'Site Guard (automatic)' }, 'guard.hide', m.title, { id: m.id, why });
      } catch (e) { /* the problem stays in the list */ }
    }
  }
  if (cfg.autoHideDeadMenu && origin) {
    try {
      const links = (await require('./sidebar').links(ctx)).filter((l) => l.custom);
      const dead = [];
      for (const l of links.slice(0, 20)) { const st = await linkStatus(origin, l.href); if (st === 404 || st === 410) dead.push(l); }
      if (dead.length) {
        const n = await require('./sidebar').hide(ctx, dead.map((l) => l.key));
        if (n) { fixes.push(`Hidden menu item${dead.length === 1 ? '' : 's'} with a page that does not exist: ${dead.map((l) => `“${l.label}” (${l.href})`).join(', ')}`); await ctx.audit({ id: null, email: 'Site Guard (automatic)' }, 'guard.menu', 'sidebar', { hidden: dead.map((l) => l.href) }); }
      }
    } catch (e) { /* the menu stays */ }
  }
  if (cfg.autoCloseErrors && errors) {
    const week = Date.now() - 7 * 86400000; let n = 0;
    errors.groups.forEach((g) => { if (g.status === 'open' && Date.parse(g.last) < week) { g.status = 'fixed'; g.closedBy = 'guard'; n++; } });
    if (n) { fixes.push(`${n} browser error${n === 1 ? '' : 's'} closed: not seen for 7 days`); errors.changed = true; }
  }
  return fixes;
}

/* ───────── 6. the AI report ───────── */
async function aiReport(cfg, issues, changes, fixes, probes) {
  if (!cfg.ai) return null;
  let ai; try { ai = require('./ai-provider'); } catch (e) { return null; }
  const c = ai.configured(); if (!c.ok) return { skipped: c.problem || 'AI is not set up.' };
  const lang = LANG_NAME[cfg.lang] || 'Uzbek (Latin script)';
  const facts = {
    problems: issues.slice(0, 25).map((i) => ({ level: i.level, area: i.area, title: i.title, detail: String(i.detail || '').slice(0, 200), hint: i.fix, examples: (i.items || []).slice(0, 3) })),
    changes: changes.slice(0, 15).map((x) => x.text), fixedAutomatically: fixes,
    slowestPages: (probes || []).slice().sort((a, b) => b.ms - a.ms).slice(0, 4).map((p) => `${p.name}: ${p.ms} ms (${p.status || p.error})`)
  };
  const schema = { type: 'object', properties: { summary: { type: 'string' }, items: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, priority: { type: 'string', enum: ['high', 'medium', 'low'] }, fix: { type: 'string' } }, required: ['title', 'priority', 'fix'], additionalProperties: false } } }, required: ['summary', 'items'], additionalProperties: false };
  try {
    const r = await ai.generateJson({
      system: `You watch the IELTS practice website IELTSX for its owner, who is not a programmer. Read the facts of the latest automatic check and answer in ${lang}. ` +
        'summary: 2-4 short sentences — is the site healthy, what matters most right now, what changed. items: at most 6 things to do, most urgent first; each fix is one or two plain sentences ' +
        'that say exactly where to click in the admin panel or what to tell the developer. Do not invent problems that are not in the facts. If there are no problems, say so and give no items.',
      parts: [{ text: JSON.stringify(facts) }], schema, maxOutputTokens: 1500,
      mock: () => ({ summary: issues.length ? `${issues.length} things need attention.` : 'Everything looks fine.', items: issues.slice(0, 3).map((i) => ({ title: i.title, priority: i.level === 'fail' ? 'high' : 'medium', fix: i.fix || 'Look at it in the admin panel.' })) })
    });
    const j = r && (r.json || r);
    if (!j || typeof j.summary !== 'string') return null;
    return { summary: oneLine(j.summary, 900), items: (Array.isArray(j.items) ? j.items : []).slice(0, 6).map((x) => ({ title: oneLine(x.title, 200), priority: ['high', 'medium', 'low'].includes(x.priority) ? x.priority : 'medium', fix: oneLine(x.fix, 500) })), model: c.model || c.provider };
  } catch (e) { return { skipped: 'The AI did not answer: ' + oneLine(e.message, 160) }; }
}

/* ───────── 7. telling the admins ───────── */
async function sendTelegram(cfg, text) {
  const tg = telegramOf(cfg); if (!tg.token || !tg.chat) return { ok: false, error: 'Telegram is not set up.' };
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 10000);
    try {
      const r = await fetch(`https://api.telegram.org/bot${tg.token}/sendMessage`, { method: 'POST', signal: ctl.signal, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chat_id: tg.chat, text: text.slice(0, 4000), disable_web_page_preview: true }) });
      const d = await r.json().catch(() => ({}));
      return r.ok && d.ok ? { ok: true } : { ok: false, error: oneLine(d.description || 'Telegram refused (' + r.status + ')', 200) };
    } finally { clearTimeout(t); }
  } catch (e) { return { ok: false, error: oneLine(e.message, 160) }; }
}
async function sendEmails(ctx, cfg, subject, text) {
  if (!ctx.mailReady) return { ok: false, error: 'E-mail is not set up on the server (SMTP_USER / SMTP_PASS or RESEND_API_KEY).' };
  const to = (cfg.emails ? cfg.emails.split(/,\s*/) : [...ctx.adminEmails]).filter(Boolean).slice(0, 5);
  if (!to.length) return { ok: false, error: 'No e-mail address: type one in Site Guard or set ADMIN_EMAILS.' };
  let ok = 0, error = '';
  for (const addr of to) { try { if (await ctx.sendMail({ to: addr, subject, text })) ok++; } catch (e) { error = oneLine(e.message, 160); } }
  return ok ? { ok: true, sent: ok } : { ok: false, error: error || 'The mail could not be sent.' };
}
async function notify(ctx, cfg, subject, text) {
  const out = {};
  if (cfg.notifyTelegram) out.telegram = await sendTelegram(cfg, text);
  if (cfg.notifyEmail) out.email = await sendEmails(ctx, cfg, subject, text);
  return out;
}
function messageOf(cfg, run, kind, origin) {
  const w = T[cfg.lang] || T.uz;
  const lines = [`🛡 ${w.title} — ${kind === 'digest' ? w.digest : kind === 'new' ? w.newP : w.score}`, `${w.score}: ${run.score}/100`];
  const icon = (l) => (l === 'fail' ? '🔴' : '🟠');
  if (kind === 'new' && run.newIssues.length) { lines.push(''); run.newIssues.slice(0, 8).forEach((i) => lines.push(`${icon(i.level)} ${i.title}${i.fix ? '\n   → ' + i.fix : ''}`)); }
  if (kind === 'digest') {
    const bad = run.issues.filter((i) => i.level === 'fail'), warn = run.issues.filter((i) => i.level === 'warn');
    lines.push(bad.length || warn.length ? `🔴 ${bad.length} · 🟠 ${warn.length}` : '✅ ' + w.all);
    run.issues.slice(0, 6).forEach((i) => lines.push(`${icon(i.level)} ${i.title}`));
  }
  if (run.resolved.length) { lines.push('', `✅ ${w.resolved}:`); run.resolved.slice(0, 5).forEach((i) => lines.push('• ' + i.title)); }
  if (run.fixes.length) { lines.push('', `🔧 ${w.fixed}:`); run.fixes.slice(0, 5).forEach((f) => lines.push('• ' + f)); }
  if (run.changes.length && kind === 'digest') { lines.push('', `📝 ${w.changes}:`); run.changes.slice(0, 6).forEach((c) => lines.push('• ' + c.text)); }
  if (run.ai && run.ai.summary) lines.push('', `🤖 ${w.ai}: ${run.ai.summary}`);
  if (origin) lines.push('', `${w.open}: ${origin}/admin#guard`);
  return lines.join('\n');
}

/* ───────── one run ───────── */
async function run(ctx, opts = {}) {
  if (running) return running;
  running = (async () => {
    const t0 = Date.now();
    const cfg = await loadConfig(ctx);
    const state = await loadState(ctx);
    const errors = await loadErrors(ctx);
    const origin = ctx.origin || '';
    const report = await ctx.siteCheck().catch((e) => ({ score: 0, sections: [{ id: 'check', title: 'Website check', items: [{ level: 'fail', title: 'The website check failed', detail: oneLine(e.message, 200) }] }] }));
    const probes = origin ? await probe(origin) : [];
    let mats = [], users = [], results = [], orders = [];
    try { [mats, users, results, orders] = await Promise.all([ctx.store.listMaterials(), ctx.store.listUsers(), ctx.store.listAllResults(5000), ctx.store.listOrders({ limit: 500 })]); } catch (e) { /* counted below as unknown */ }
    const fixes = opts.dry ? [] : await autofix(ctx, cfg, mats, origin, errors);
    if (errors.changed) { delete errors.changed; await ctx.store.setSetting(ERRORS, errors); }
    const snap = await snapshot(ctx, mats, { users: users.length, results: results.length, orders: orders.length });
    const changes = diff(state.snapshot, snap);
    const issues = issuesOf(report, probes, errors);
    const known = new Set(state.known || []);
    const newIssues = issues.filter((i) => !known.has(i.id) && (cfg.notifyLevel === 'warn' || i.level === 'fail'));
    const prevIssues = (state.last && state.last.issues) || [];
    const resolved = prevIssues.filter((i) => !issues.some((x) => x.id === i.id));
    const score = issues.some((i) => i.area === 'Live pages' && i.level === 'fail') ? Math.min(report.score || 0, 40) : (report.score || 0);
    const r = { at: now(), reason: opts.reason || 'manual', tookMs: 0, score, counts: { fail: issues.filter((i) => i.level === 'fail').length, warn: issues.filter((i) => i.level === 'warn').length },
      issues, newIssues, resolved: resolved.map((i) => ({ id: i.id, title: i.title })), fixes, changes, probes, ai: null, notified: null };
    // the AI writes its report when something is wrong or changed (and at least once a day), not on every quiet run
    const lastAi = state.last && state.last.ai && state.last.ai.at ? Date.parse(state.last.ai.at) : 0;
    if (issues.length || changes.length > 1 || Date.now() - lastAi > 20 * 3600000 || opts.reason === 'manual') {
      r.ai = await aiReport(cfg, issues, changes, fixes, probes);
      if (r.ai && !r.ai.skipped) r.ai.at = now();
    } else if (state.last && state.last.ai) r.ai = state.last.ai;
    // notifications: new problems at once; a short summary once a day
    const lastDigest = Date.parse(state.digestAt || 0) || 0;
    let kind = '';
    if (newIssues.length || (fixes.length && !opts.dry)) kind = 'new';
    else if (cfg.digest && Date.now() - lastDigest > 23 * 3600000 && opts.reason !== 'manual') kind = 'digest';
    if (kind && !opts.quiet && (cfg.notifyTelegram || cfg.notifyEmail)) {
      const w = T[cfg.lang] || T.uz;
      r.notified = await notify(ctx, cfg, `${w.title}: ${kind === 'digest' ? w.digest : w.newP} (${score}/100)`, messageOf(cfg, r, kind, origin));
      if (kind === 'digest') state.digestAt = now();
    }
    r.tookMs = Date.now() - t0;
    const slim = { ...r, probes: r.probes.map(({ path: p, name, status, ms, ok, kind: k }) => ({ path: p, name, status, ms, ok, kind: k })) };
    const history = [{ at: r.at, score, fail: r.counts.fail, warn: r.counts.warn, new: newIssues.length, resolved: resolved.length, fixes: fixes.length, changes: changes.length, reason: r.reason }].concat(state.history || []).slice(0, MAX_HISTORY);
    const changeLog = changes.filter((c) => c.kind !== 'info').map((c) => ({ ...c, at: r.at })).concat(state.changeLog || []).slice(0, 80);
    await ctx.store.setSetting(STATE, { last: slim, snapshot: snap, history, changeLog, known: issues.map((i) => i.id), digestAt: state.digestAt || null, nextAt: new Date(Date.now() + cfg.intervalMin * 60000).toISOString() });
    return slim;
  })();
  try { return await running; } finally { running = null; }
}
const due = (cfg, state) => cfg.enabled && (!state.last || Date.now() - Date.parse(state.last.at) >= cfg.intervalMin * 60000 - 30000);

/* the timer of the Node server (server.js): every few minutes, run when the interval has passed */
async function tick(ctx) {
  try { const [cfg, state] = await Promise.all([loadConfig(ctx), loadState(ctx)]); if (due(cfg, state)) await run(ctx, { reason: 'timer' }); }
  catch (e) { console.error('IELTSX Guard:', e.message); }
}

/* ───────── errors from visitors' browsers: POST /api/client-errors ───────── */
async function clientError(req, res, ctx) {
  const { send, readJson } = ctx;
  try { ctx.rateLimit('cerr:' + ctx.clientIp(req), 20, 60000); ctx.rateLimit('cerr:all', 300, 60000); } catch (e) { return send(res, 204, ''); }
  const b = await readJson(req, 8 * 1024).catch(() => ({}));
  const message = oneLine(b.message, 300), source = oneLine(String(b.source || '').replace(/[?#].*$/, ''), 300), page = oneLine(String(b.page || '').replace(/[?#].*$/, ''), 160) || '/';
  const kind = ['error', 'promise', 'resource'].includes(b.kind) ? b.kind : 'error';
  if (!message || /^(Script error\.?|ResizeObserver loop)/i.test(message) || /extension:\/\//i.test(source + ' ' + (b.stack || ''))) return send(res, 204, '');
  const id = hash(kind + '|' + message.replace(/\d+/g, '#') + '|' + source.replace(/\?.*$/, '') + '|' + (kind === 'resource' ? '' : Number(b.line) || 0));
  const errors = await loadErrors(ctx);
  let g = errors.groups.find((x) => x.id === id); const fresh = !g;
  if (!g) { g = { id, kind, message, source, line: Number(b.line) || 0, col: Number(b.col) || 0, stack: oneLine(b.stack, 1200), page, pages: [], count: 0, first: now(), status: 'open' }; errors.groups.unshift(g); }
  g.count++; g.last = now(); g.ua = oneLine(req.headers['user-agent'], 160);
  if (!g.pages.includes(page)) g.pages = g.pages.concat(page).slice(-6);
  if (g.status === 'fixed') { g.status = 'open'; g.reopened = now(); }   // it happens again: open it again
  errors.groups = errors.groups.sort((a, b) => String(b.last).localeCompare(String(a.last))).slice(0, MAX_ERRORS);
  await ctx.store.setSetting(ERRORS, errors);
  // a brand-new script error is told at once (at most every 10 minutes); missing files wait for the next run
  if (fresh && kind !== 'resource' && Date.now() - lastInstantAlert > 600000) {
    const cfg = await loadConfig(ctx);
    if (cfg.enabled && (cfg.notifyTelegram || cfg.notifyEmail)) {
      lastInstantAlert = Date.now();
      const w = T[cfg.lang] || T.uz;
      const text = `🛡 ${w.title} — ${w.errors}\n🟠 ${page}: ${message}${source ? '\n' + source + (g.line ? ':' + g.line : '') : ''}${ctx.origin ? '\n\n' + w.open + ': ' + ctx.origin + '/admin#guard' : ''}`;
      notify(ctx, cfg, `${w.title}: ${w.errors}`, text).catch(() => {});
    }
  }
  return send(res, 204, '');
}

/* ───────── the cron address: GET /api/cron/site-watch (Vercel cron, or any pinger with ?key=CRON_SECRET) ───────── */
async function cron(req, res, url, ctx) {
  const { send, HttpError } = ctx;
  const secret = String(process.env.CRON_SECRET || '');
  if (!secret) throw new HttpError(503, 'Set CRON_SECRET in the server environment to use the automatic check address.');
  const given = String((req.headers.authorization || '').replace(/^Bearer\s+/i, '') || url.searchParams.get('key') || '');
  const a = Buffer.from(given), b = Buffer.from(secret);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new HttpError(401, 'Not allowed.');
  ctx.rateLimit('cron:guard', 30, 3600000);
  const cfg = await loadConfig(ctx);
  if (!cfg.enabled) return send(res, 200, { ok: true, skipped: 'Site Guard is switched off.' }, { 'Cache-Control': 'no-store' });
  const r = await run(ctx, { reason: 'cron' });
  return send(res, 200, { ok: true, at: r.at, score: r.score, problems: r.counts, new: r.newIssues.length, fixes: r.fixes.length }, { 'Cache-Control': 'no-store' });
}

/* ───────── the admin panel: /api/admin/guard … ───────── */
async function adminRoute(req, res, p, method, ctx) {
  const { send, readJson, HttpError, admin, audit } = ctx;
  const noStore = { 'Cache-Control': 'no-store' };
  const all = async () => {
    const [cfg, state, errors] = await Promise.all([loadConfig(ctx), loadState(ctx), loadErrors(ctx)]);
    return { config: publicConfig(cfg), last: state.last || null, history: state.history || [], changeLog: state.changeLog || [], nextAt: cfg.enabled ? state.nextAt || null : null,
      errors: errors.groups, running: !!running, mailReady: !!ctx.mailReady, adminEmails: [...ctx.adminEmails], aiReady: (() => { try { return require('./ai-provider').configured().ok; } catch (e) { return false; } })(), vercel: !!ctx.isVercel, intervals: INTERVALS };
  };
  if (p === '/api/admin/guard' && method === 'GET') {
    const [cfg, state] = await Promise.all([loadConfig(ctx), loadState(ctx)]);
    if (!state.last || (ctx.isVercel && due(cfg, state))) await run(ctx, { reason: state.last ? 'opened' : 'first' }).catch(() => null);   // on Vercel there is no timer: opening the panel checks when it is time
    return send(res, 200, await all(), noStore);
  }
  if (p === '/api/admin/guard/run' && method === 'POST') {
    ctx.rateLimit('guard-run:' + admin.id, 12, 600000);
    await run(ctx, { reason: 'manual' });
    return send(res, 200, await all(), noStore);
  }
  if (p === '/api/admin/guard/config' && method === 'POST') {
    let cfg; try { cfg = cleanConfig(await readJson(req, 16 * 1024), await loadConfig(ctx)); } catch (e) { throw new HttpError(e.status || 400, e.message); }
    await ctx.store.setSetting(CONFIG, cfg);
    await audit(admin, 'guard.config', 'site-guard', { enabled: cfg.enabled, every: cfg.intervalMin, telegram: cfg.notifyTelegram, email: cfg.notifyEmail, autoHideBroken: cfg.autoHideBroken, autoHideDeadMenu: cfg.autoHideDeadMenu });
    return send(res, 200, await all(), noStore);
  }
  if (p === '/api/admin/guard/test' && method === 'POST') {
    ctx.rateLimit('guard-test:' + admin.id, 6, 600000);
    const cfg = await loadConfig(ctx); const w = T[cfg.lang] || T.uz;
    const out = await notify(ctx, { ...cfg, notifyTelegram: true, notifyEmail: true }, `${w.title}: ${w.test}`, `🛡 ${w.title}\n${w.test}${ctx.origin ? '\n' + ctx.origin + '/admin#guard' : ''}`);
    return send(res, 200, { result: out }, noStore);
  }
  let m = p.match(/^\/api\/admin\/guard\/errors\/([a-f0-9]{12})$/);
  if (m && method === 'POST') {
    const status = (await readJson(req)).status;
    if (!['open', 'fixed', 'ignored', 'delete'].includes(status)) throw new HttpError(400, 'Unknown status.');
    const errors = await loadErrors(ctx);
    const g = errors.groups.find((x) => x.id === m[1]); if (!g) throw new HttpError(404, 'This error is no longer in the list.');
    if (status === 'delete') errors.groups = errors.groups.filter((x) => x !== g); else { g.status = status; g.closedBy = admin.email; }
    await ctx.store.setSetting(ERRORS, errors);
    return send(res, 200, await all(), noStore);
  }
  if (p === '/api/admin/guard/errors/clear' && method === 'POST') {
    const errors = await loadErrors(ctx);
    errors.groups = errors.groups.filter((g) => g.status === 'open');
    await ctx.store.setSetting(ERRORS, errors);
    return send(res, 200, await all(), noStore);
  }
  throw new HttpError(404, 'API endpoint not found.');
}

module.exports = { run, tick, cron, clientError, adminRoute, diff, issuesOf, cleanConfig, messageOf, DEFAULTS, INTERVALS };
