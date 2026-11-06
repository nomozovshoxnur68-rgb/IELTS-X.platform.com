'use strict';
/* ====
   site-check.js -- the "Website check" of the admin panel (admin.html#sitecheck, admin-sitecheck.js).

   GET /api/admin/site-check looks at the whole website and returns one report:
     setup      server, database, e-mail, Google sign-in, AI, secrets
     content    tests and articles: drafts, Listening without audio, tests without questions or answers, missing covers
     people     accounts, activity, Premium, orders waiting for payment
     pages      links to pages / files that do not exist, heavy files, titles and descriptions of the public pages
   Every finding is { level: 'ok' | 'info' | 'warn' | 'fail', title, detail, fix?, items? }. Read only: nothing is changed.
   The speed of the pages is measured in the admin's own browser (admin-sitecheck.js), where visitors feel it.
   ==== */
const fs = require('fs');
const path = require('path');

const SKIP_DIRS = new Set(['node_modules', '.git', '.npm', '.vscode', '.github', '.claude', 'data', 'uploads', 'scripts', 'reading-src', 'listening-src', 'api', '${HOME}', 'reading with Answers']);
const DAY = 86400000;
let cache = null;   // { t, report } — the page scan is kept for a minute

function walk(root, rel, out, depth) {
  if (depth > 6) return out;
  let list = [];
  try { list = fs.readdirSync(path.join(root, rel), { withFileTypes: true }); } catch (e) { return out; }
  for (const e of list) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) walk(root, r, out, depth + 1);
    else out.push(r);
  }
  return out;
}

/* local links of a page: href / src values that point at this website (not other sites, not code inside scripts) */
function localLinks(html) {
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  const out = new Set();
  const re = /\s(?:href|src)\s*=\s*(["'])([^"']*)\1/gi; let m;
  while ((m = re.exec(body))) {
    const v = m[2].trim();
    if (!v || /^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(v) || /\$\{|\{\{|'\s*\+|\+\s*'/.test(v)) continue;
    out.add(v);
  }
  return [...out];
}

function makeExists(root, ctx) {
  const memo = new Map();
  const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } };
  const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch (e) { return false; } };
  return function exists(urlPath) {
    if (memo.has(urlPath)) return memo.get(urlPath);
    let ok = false;
    const low = urlPath.toLowerCase();
    if (urlPath === '/' || ctx.aliasMap.has(low) || ctx.aliasMap.has(low.replace(/\/$/, ''))) ok = true;
    // pages made on the fly by the server
    else if (/^\/(api|exam|test|premium-audio)(\/|$)/i.test(urlPath) || /^\/test(\.html)?$/i.test(urlPath)) ok = true;
    else if (/^\/full-tests\/(listening|reading|writing|speaking)\/(?!test-|index)[a-z0-9][a-z0-9_-]*\/?$/i.test(urlPath)) ok = true;
    else if (/^\/(pessages|sections)\/test-\d+(\.html)?$/i.test(urlPath) || /^\/full-tests\/reading\/test-\d+(\.html)?$/i.test(urlPath)) ok = true;   // tests made in the admin panel
    else if (/^\/uploads\//i.test(urlPath)) ok = isFile(path.join(ctx.uploadDir, urlPath.slice('/uploads/'.length)));
    else {
      const f = path.join(root, urlPath);
      if (!f.startsWith(root)) ok = false;
      else ok = isFile(f) || isFile(f + '.html') || (isDir(f) && isFile(path.join(f, 'index.html'))) ||
        isFile(path.join(root, path.basename(urlPath)));   // the server finds a missing helper file by its name at the top
    }
    memo.set(urlPath, ok);
    return ok;
  };
}

const breathe = () => new Promise((r) => setImmediate(r));   // let the server answer visitors between files
async function scanPages(root, ctx) {
  const files = walk(root, '', [], 0);
  const html = files.filter((f) => /\.html?$/i.test(f) && !/(^|\/)(1|test)\.html$/i.test(f));
  const exists = makeExists(root, ctx);
  const broken = new Map();   // url -> Set(pages)
  let links = 0, n = 0;
  for (const rel of html) {
    if (++n % 4 === 0) await breathe();
    let text = '';
    try { text = await fs.promises.readFile(path.join(root, rel), 'utf8'); } catch (e) { continue; }
    const dir = '/' + path.posix.dirname(rel).replace(/^\.$/, '');
    for (const v of localLinks(text)) {
      let p = v.split(/[?#]/)[0];
      if (!p) continue;
      try { p = decodeURIComponent(p); } catch (e) { /* keep it */ }
      p = p.startsWith('/') ? path.posix.normalize(p) : path.posix.normalize(path.posix.join(dir === '/' ? '/' : dir + '/', p));
      links++;
      if (!exists(p)) { if (!broken.has(p)) broken.set(p, new Set()); broken.get(p).add('/' + rel); }
    }
  }
  const heavy = files.filter((f) => /\.(html|css|js|png|jpe?g|webp|gif|svg|avif)$/i.test(f))
    .map((f) => { try { return { file: '/' + f, size: fs.statSync(path.join(root, f)).size }; } catch (e) { return null; } })
    .filter((x) => x && x.size > (/\.(html|css|js)$/i.test(x.file) ? 600 * 1024 : 400 * 1024))
    .sort((a, b) => b.size - a.size);
  return { pages: html.length, links, broken, heavy };
}

function seo(root, publicPages) {
  const missing = { title: [], description: [], viewport: [], lang: [] };
  let checked = 0;
  for (const u of publicPages) {
    const rel = decodeURIComponent(u).replace(/\/$/, '/index.html');
    let text = null;
    for (const cand of [rel, rel + '.html']) { try { text = fs.readFileSync(path.join(root, cand), 'utf8'); break; } catch (e) { /* next */ } }
    if (text == null) continue;
    checked++;
    const head = text.slice(0, 20000);
    const title = (head.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1];
    if (!title || !title.trim()) missing.title.push(u);
    if (!/<meta[^>]+name=["']description["'][^>]*content=["'][^"']{20,}/i.test(head)) missing.description.push(u);
    if (!/<meta[^>]+name=["']viewport["']/i.test(head)) missing.viewport.push(u);
    if (!/<html[^>]+lang=/i.test(head)) missing.lang.push(u);
  }
  return { checked, missing };
}

const kb = (n) => (n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB');
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));

/* ctx: { root, uploadDir, aliasMap, store, publicPages, config: {...}, isPremium(u), isAdmin(u), aiConfigured() } */
async function run(ctx, opts = {}) {
  if (!opts.fresh && cache && Date.now() - cache.t < 60000) return cache.report;
  const t0 = Date.now();
  const c = ctx.config;
  const sections = [];

  /* ---- setup and security ---- */
  const setup = [];
  setup.push(c.storage === 'supabase'
    ? { level: 'ok', title: 'Database: Supabase', detail: 'Accounts, results and tests are kept in Supabase.' }
    : c.vercel ? { level: 'fail', title: 'No database on Vercel', detail: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set: accounts cannot be saved.', fix: 'Add both keys in Vercel → Settings → Environment Variables, run supabase-schema.sql, redeploy.' }
      : { level: 'info', title: 'Database: local file (data/db.json)', detail: 'Fine for one server. ' + (c.dbSize ? 'Size: ' + kb(c.dbSize) + '.' : ''), fix: c.dbSize > 50 * 1048576 ? 'The file is large: move to Supabase for speed and safety.' : '' });
  setup.push(c.sessionSecretFromEnv ? { level: 'ok', title: 'Session secret is set', detail: 'SESSION_SECRET comes from the environment.' }
    : { level: c.production ? 'warn' : 'info', title: 'Session secret is made by the server', detail: 'SESSION_SECRET is not set; a random one is kept in data/.session-secret. Everybody is signed out if that file is lost.', fix: 'Set SESSION_SECRET (48+ random characters) in the environment.' });
  setup.push(c.adminEmails ? { level: 'ok', title: 'Admin e-mails are set', detail: plural(c.adminEmails, 'address') + ' in ADMIN_EMAILS.' }
    : { level: 'info', title: 'ADMIN_EMAILS is empty', detail: 'Admins come only from the role saved in the database.' });
  setup.push(c.mail ? { level: 'ok', title: 'E-mail works', detail: 'Password reset and e-mail confirmation are sent through Resend.' }
    : { level: 'warn', title: 'E-mail is not set up', detail: 'Students cannot reset a forgotten password or confirm their e-mail by themselves.', fix: 'Set RESEND_API_KEY and MAIL_FROM.' });
  setup.push(c.publicUrl ? { level: /^https:\/\//.test(c.publicUrl) ? 'ok' : 'warn', title: 'Public address', detail: c.publicUrl + (/^https:\/\//.test(c.publicUrl) ? '' : ' — not https'), fix: /^https:\/\//.test(c.publicUrl) ? '' : 'Use the https:// address.' }
    : { level: c.production ? 'warn' : 'info', title: 'PUBLIC_URL is not set', detail: 'Links in e-mails and the sitemap use the address of each request.', fix: 'Set PUBLIC_URL=https://your-domain' });
  setup.push(c.google ? { level: 'ok', title: 'Google sign-in is on', detail: 'GOOGLE_CLIENT_ID is set.' } : { level: 'info', title: 'Google sign-in is off', detail: 'Only e-mail + password sign-in.', fix: 'Set GOOGLE_CLIENT_ID (see GOOGLE_SETUP.md).' });
  setup.push(c.ai ? { level: 'ok', title: 'AI is set up', detail: 'The AI Test Generator and the writing grader can be used.' } : { level: 'info', title: 'AI is not set up', detail: 'The AI Test Generator and the AI check of Writing and Speaking need OPENAI_API_KEY.' });
  if (!c.promoColumns) setup.push({ level: 'warn', title: 'Orders cannot keep their promo code', detail: 'The orders table in Supabase has no promoCode / discount / fullAmount columns. Orders with a code still get the lower price; the code is only in the activity log.', fix: 'Run the v8 part of supabase-schema.sql once in the Supabase SQL editor.' });
  const promos = (c.pricing && c.pricing.promos) || [];
  const now0 = Date.now(), live = promos.filter((p) => p.active && (!p.endsAt || Date.parse(p.endsAt) > now0));
  const strip = live.find((p) => p.banner);
  setup.push(live.length
    ? { level: 'ok', title: plural(live.length, 'promo code') + ' working', detail: live.map((p) => `${p.code} −${p.percent}%${p.endsAt ? ' until ' + new Date(p.endsAt).toLocaleDateString('en-GB') : ''}${p.banner ? ' (in the promo strip)' : ''}`).join(' · ') + (strip ? '' : ' · no code is shown in the promo strip, so the strip is hidden.') }
    : { level: 'info', title: 'No promo code is active', detail: 'The promo strip at the top of the pages is hidden.' + (promos.length ? ' ' + plural(promos.length, 'code') + ' switched off or ended.' : ''), fix: 'Add one in Price control → Promo codes.' });
  setup.push(c.paymentWebhook ? { level: 'ok', title: 'Payment webhook secret is set', detail: 'Payments can be confirmed automatically.' } : { level: 'info', title: 'Payments are confirmed by hand', detail: 'PAYMENT_WEBHOOK_SECRET is not set: an admin confirms every order.' });
  setup.push({ level: 'info', title: 'Server', detail: `Node ${process.version} · up ${Math.round(process.uptime() / 3600 * 10) / 10} h · memory ${kb(process.memoryUsage().rss)}${c.workers > 1 ? ' · ' + c.workers + ' workers' : ''}` });
  sections.push({ id: 'setup', title: 'Setup and security', items: setup });

  /* ---- content ---- */
  const content = [];
  let mats = [];
  try { mats = await ctx.store.listMaterials(); } catch (e) { content.push({ level: 'fail', title: 'Tests could not be read', detail: e.message }); }
  const byType = {};
  mats.forEach((m) => { const t = byType[m.type] || (byType[m.type] = { all: 0, live: 0 }); t.all++; if (m.published !== false) t.live++; });
  const names = { reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking', article: 'Articles', pdf: 'PDF', vocab: 'Vocabulary' };
  content.push({ level: 'info', title: 'Content made in the admin panel', detail: Object.keys(byType).length ? Object.entries(byType).map(([k, v]) => `${names[k] || k}: ${v.live} published${v.all > v.live ? ', ' + (v.all - v.live) + ' hidden' : ''}`).join(' · ') : 'Nothing yet.' });
  const qs = (m) => (m.data && Array.isArray(m.data.questions) ? m.data.questions : []);
  const label = (m) => `${names[m.type] || m.type}: ${m.title || m.id}`;
  const liveNoAudio = mats.filter((m) => m.type === 'listening' && m.published !== false && !(m.data && m.data.audioUrl));
  const hiddenNoAudio = mats.filter((m) => m.type === 'listening' && m.published === false && !(m.data && m.data.audioUrl));
  if (liveNoAudio.length) content.push({ level: 'fail', title: plural(liveNoAudio.length, 'published Listening test') + ' without audio', detail: 'Students open them and hear nothing.', fix: 'Upload the audio or hide these tests.', items: liveNoAudio.slice(0, 20).map(label) });
  if (hiddenNoAudio.length) content.push({ level: 'info', title: plural(hiddenNoAudio.length, 'hidden Listening test') + ' waiting for audio', detail: 'They stay hidden until the audio is added in Listening · Part.', items: hiddenNoAudio.slice(0, 12).map(label) });
  const noQ = mats.filter((m) => (m.type === 'reading' || m.type === 'listening') && m.published !== false && !qs(m).length);
  if (noQ.length) content.push({ level: 'fail', title: plural(noQ.length, 'published test') + ' without questions', detail: 'The test opens with nothing to answer.', items: noQ.slice(0, 20).map(label) });
  const noAns = mats.filter((m) => (m.type === 'reading' || m.type === 'listening') && m.published !== false && qs(m).some((q) => !String(q.answer == null ? '' : q.answer).trim()));
  if (noAns.length) content.push({ level: 'warn', title: plural(noAns.length, 'published test') + ' with questions that have no answer', detail: 'Those questions are always marked wrong.', items: noAns.slice(0, 20).map((m) => label(m) + ' — ' + qs(m).filter((q) => !String(q.answer == null ? '' : q.answer).trim()).length + ' without answer') });
  const noPassage = mats.filter((m) => m.type === 'reading' && m.published !== false && m.data && (m.data.mode === 'full' ? !(m.data.passages || []).some((p) => p && p.passage) : !String(m.data.passage || '').trim()));
  if (noPassage.length) content.push({ level: 'fail', title: plural(noPassage.length, 'published Reading test') + ' without a passage', items: noPassage.slice(0, 20).map(label) });
  const arts = mats.filter((m) => m.type === 'article' && m.published !== false);
  const artNoCover = arts.filter((m) => !(m.data && (m.data.imageUrl || m.data.coverUrl)));
  if (artNoCover.length) content.push({ level: 'warn', title: plural(artNoCover.length, 'article') + ' without a cover picture', detail: 'Their cards on the Articles page show an empty picture.', items: artNoCover.slice(0, 20).map(label) });
  if (!arts.length) content.push({ level: 'warn', title: 'No published articles', detail: 'The Articles page says “coming soon”.', fix: 'Add articles in Article cards.' });
  for (const [t, n] of [['reading', 'Reading'], ['listening', 'Listening'], ['writing', 'Writing']]) {
    const live = mats.filter((m) => m.type === t && m.published !== false && (!m.data || m.data.mode !== 'full'));
    if (!live.length) content.push({ level: 'warn', title: `No published ${n} Part practice`, detail: `The ${n} practice page has no cards for students.` });
  }
  const missingUploads = [];
  if (ctx.uploadDir && !c.vercel) {
    for (const m of mats) {
      const d = m.data || {};
      for (const u of [d.coverUrl, d.imageUrl, d.audioUrl, d.fileUrl, ...(Array.isArray(d.images) ? d.images.map((i) => i && i.url) : [])]) {
        if (typeof u === 'string' && u.startsWith('/uploads/')) {
          let ok = false; try { ok = fs.statSync(path.join(ctx.uploadDir, decodeURIComponent(u.slice(9)))).isFile(); } catch (e) { ok = false; }
          if (!ok) missingUploads.push(label(m) + ' — ' + u);
        }
      }
    }
  }
  if (missingUploads.length) content.push({ level: 'fail', title: plural(missingUploads.length, 'uploaded file') + ' missing', detail: 'A test or article points at a picture / audio that is not on the server.', fix: 'Upload the file again in the test.', items: missingUploads.slice(0, 20) });
  if (!content.some((x) => x.level === 'warn' || x.level === 'fail')) content.push({ level: 'ok', title: 'Content looks complete', detail: 'Every published test has questions, answers and (Listening) audio.' });
  sections.push({ id: 'content', title: 'Tests and articles', items: content });

  /* ---- people and activity ---- */
  const people = [];
  let users = [], results = [], orders = [];
  try { [users, results, orders] = await Promise.all([ctx.store.listUsers(), ctx.store.listAllResults(5000), ctx.store.listOrders({ limit: 500 })]); }
  catch (e) { people.push({ level: 'fail', title: 'Accounts could not be read', detail: e.message }); }
  const now = Date.now(), ago = (d) => now - new Date(d || 0).getTime();
  const newWeek = users.filter((u) => ago(u.createdAt) < 7 * DAY).length;
  const activeWeek = users.filter((u) => ago(u.lastLoginAt) < 7 * DAY).length;
  const unverified = users.filter((u) => !u.emailVerified).length;
  const premium = users.filter((u) => ctx.isPremium(u) && !ctx.isAdmin(u)).length;
  const ending = users.filter((u) => ctx.isPremium(u) && !ctx.isAdmin(u) && u.premiumExpiresAt && new Date(u.premiumExpiresAt).getTime() - now < 7 * DAY).length;
  const testsWeek = results.filter((r) => ago(r.createdAt) < 7 * DAY).length;
  const pending = orders.filter((o) => o.status === 'pending');
  const blocked = users.filter((u) => u.blocked).length;
  people.push({ level: 'info', title: plural(users.length, 'account'), detail: `${newWeek} new and ${activeWeek} signed in during the last 7 days · ${premium} with a paid plan${blocked ? ' · ' + blocked + ' suspended' : ''}` });
  people.push({ level: testsWeek ? 'ok' : 'info', title: plural(testsWeek, 'test') + ' finished this week', detail: plural(results.length, 'result') + ' kept in all.' });
  if (users.length && unverified / users.length > 0.4) people.push({ level: c.mail ? 'info' : 'warn', title: Math.round(unverified / users.length * 100) + '% of accounts have not confirmed their e-mail', detail: c.mail ? 'They got a link when they signed up.' : 'E-mail is not set up, so they cannot confirm it.' });
  if (pending.length) people.push({ level: 'warn', title: plural(pending.length, 'order') + ' waiting for payment', detail: 'Oldest: ' + new Date(pending[pending.length - 1].createdAt).toLocaleDateString('en-GB'), fix: 'Open Orders and confirm or reject them.' });
  if (ending) people.push({ level: 'info', title: plural(ending, 'plan') + ' ending within 7 days', detail: 'A good moment to remind those students.' });
  sections.push({ id: 'people', title: 'People and activity', items: people });

  /* ---- pages, links, files ---- */
  const pages = [];
  const scan = await scanPages(ctx.root, ctx);
  if (scan.pages < 20) pages.push({ level: 'info', title: 'Page files are not on this server', detail: 'On Vercel the pages are served by Vercel itself, so links can only be checked where the site runs with npm start.' });
  else {
    const broken = [...scan.broken.entries()].sort((a, b) => b[1].size - a[1].size);
    pages.push(broken.length
      ? { level: broken.length > 15 ? 'fail' : 'warn', title: plural(broken.length, 'broken link') + ` in ${scan.pages} pages`, detail: 'Links or pictures that point at a file that does not exist (out of ' + scan.links + ' links).', fix: 'Fix or remove these links.',
        items: broken.slice(0, 40).map(([u, set]) => `${u}  ←  ${[...set].slice(0, 3).join(', ')}${set.size > 3 ? ' +' + (set.size - 3) : ''}`) }
      : { level: 'ok', title: 'No broken links', detail: `${scan.links} links in ${scan.pages} pages checked.` });
    pages.push(scan.heavy.length
      ? { level: scan.heavy.some((h) => h.size > 2 * 1048576) ? 'warn' : 'info', title: plural(scan.heavy.length, 'heavy file'), detail: 'Big pictures and pages load slowly on phones.', fix: 'Compress pictures (WebP, ≤ 300 KB).', items: scan.heavy.slice(0, 15).map((h) => `${h.file} — ${kb(h.size)}`) }
      : { level: 'ok', title: 'No heavy files', detail: 'Every page, picture and script is a reasonable size.' });
    const s = seo(ctx.root, ctx.publicPages);
    const seoIssues = [['title', 'a title', 'no title'], ['description', 'a description for Google', 'no description for Google'], ['viewport', 'the phone (viewport) setting', 'no phone (viewport) setting'], ['lang', 'a language (lang)', 'no language (lang)']].filter(([k]) => s.missing[k].length);
    pages.push(seoIssues.length
      ? { level: 'warn', title: 'Search engines: ' + plural(new Set(seoIssues.flatMap(([k]) => s.missing[k])).size, 'public page') + ' to improve', detail: seoIssues.map(([k, n]) => `${s.missing[k].length} without ${n}`).join(' · '), items: seoIssues.flatMap(([k, , short]) => s.missing[k].slice(0, 6).map((u) => `${u} — ${short}`)).slice(0, 24) }
      : { level: 'ok', title: 'Search engines: the public pages are ready', detail: `${s.checked} pages have a title, a description, the phone setting and a language.` });
  }
  pages.push({ level: 'ok', title: 'Sitemap and robots.txt', detail: '/sitemap.xml lists ' + plural(ctx.publicPages.length, 'public page') + '; /robots.txt keeps the admin, API and account pages out of search engines.' });
  sections.push({ id: 'pages', title: 'Pages, links and files', items: pages });

  /* ---- score ---- */
  const weight = { ok: 1, info: 1, warn: 0.55, fail: 0 };
  const all = sections.flatMap((x) => x.items).filter((x) => x.level !== 'info');
  const score = all.length ? Math.round(all.reduce((a, x) => a + weight[x.level], 0) / all.length * 100) : 100;
  const counts = { fail: 0, warn: 0, ok: 0, info: 0 };
  sections.forEach((x) => x.items.forEach((i) => { counts[i.level]++; }));
  const report = { generatedAt: new Date().toISOString(), tookMs: Date.now() - t0, score, counts, sections };
  cache = { t: Date.now(), report };
  return report;
}

module.exports = { run };
