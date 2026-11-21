'use strict';
/*
 * IELTSX — Videos, Books, Grammar, Music and Links: managed in the admin panel (admin-panels.js), shown on
 * /videos, /books, /grammar (assets/js/panels-page.js), the music player of the Settings page and the ordinary pages
 * (assets/js/site-music.js) and every page's links (assets/js/site-links.js). Server only (BLOCKED_FILES, middleware.js).
 *
 * Each list lives in ONE setting (like Predictions): panel-videos, panel-books, panel-grammar, panel-music, link-rules.
 *   video   { id, title, description, category, level, plan, published, provider: youtube|vimeo, videoId, duration, cover }
 *   book    { id, title, author, description, category, level, plan, published, cover, file, pages }
 *   grammar { id, title, summary, category, level, plan, published, content, exercises: [{ q, options[], answer, explain }] }
 *   track   { id, title, artist, plan, published, url, cover }
 *   link    { id, from, to, note, active }      from: a page of the site (/Price) or an address (https://t.me/…, mailto:…)
 *
 * The server decides access, as for Predictions: a locked item (its plan is above the visitor's) is listed with its name
 * only — never with its video id, book file, grammar text or music file.
 */
const crypto = require('crypto');

const PLANS = ['free', 'standard', 'max', 'ultra'];
const LEVEL = { free: 0, standard: 1, max: 2, ultra: 3 };
const LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const KINDS = {
  videos: { key: 'panel-videos', max: 500, prefix: 'v', noun: 'video' },
  books: { key: 'panel-books', max: 500, prefix: 'b', noun: 'book' },
  grammar: { key: 'panel-grammar', max: 400, prefix: 'g', noun: 'topic' },
  music: { key: 'panel-music', max: 100, prefix: 'm', noun: 'track' }
};
const LINKS_KEY = 'link-rules';
const MAX_LINKS = 200;
const ID_RE = /^[vbgm]-[a-f0-9]{8}$/;
const LINK_ID_RE = /^l-[a-f0-9]{8}$/;

const line = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const text = (v, n) => String(v == null ? '' : v).replace(/\r/g, '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{4,}/g, '\n\n\n').trim().slice(0, n);
const makeId = (prefix) => prefix + '-' + crypto.randomBytes(4).toString('hex');
/* a file of this site (/uploads/…, /api/media/…, /assets/…) or an https:// address — never javascript:, data: or http: */
const okUrl = (v, n) => { const s = String(v || '').trim(); return s.length <= (n || 600) && (/^\/(?:uploads|api\/media|assets)\/[^\s"'<>\\]+$/.test(s) || /^https:\/\/[^\s"'<>\\]{3,}$/i.test(s)) ? s : ''; };
/* a link of a rule: a page of the site, an https address, mailto: or tel: */
const okLink = (v) => {
  const s = String(v || '').trim();
  if (s.length > 500) return '';
  if (/^\/(?!\/)[^\s"'<>\\]*$/.test(s)) return s;
  if (/^https?:\/\/[^\s"'<>\\]{3,}$/i.test(s)) return s;
  if (/^mailto:[^\s"'<>\\@]+@[^\s"'<>\\]+$/i.test(s) || /^tel:\+?[0-9 ()-]{5,20}$/i.test(s)) return s;
  return '';
};

/* YouTube (watch, youtu.be, shorts, embed, live) or Vimeo address -> { provider, videoId } */
function parseVideo(url) {
  const s = String(url || '').trim();
  let m = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})(?:[?&#/].*)?$/i.exec(s);
  if (m) return { provider: 'youtube', videoId: m[1] };
  m = /^(?:https?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:video\/)?(\d{5,12})(?:[?#/].*)?$/i.exec(s);
  if (m) return { provider: 'vimeo', videoId: m[1] };
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return { provider: 'youtube', videoId: s };
  return null;
}
const videoUrl = (it) => (it.provider === 'vimeo' ? 'https://vimeo.com/' + it.videoId : 'https://www.youtube.com/watch?v=' + it.videoId);

/* ───────── checking what the admin saves ───────── */
function base(b, old, prefix, HttpError) {
  const title = line(b.title, 160);
  if (!title) throw new HttpError(400, 'Every item needs a title.');
  const now = new Date().toISOString();
  return {
    id: old ? old.id : makeId(prefix), title,
    plan: PLANS.includes(b.plan) ? b.plan : 'free',
    published: b.published !== false,
    category: line(b.category, 40),
    level: LEVELS.includes(String(b.level || '').toUpperCase()) ? String(b.level || '').toUpperCase() : '',
    createdAt: (old && old.createdAt) || now, updatedAt: now
  };
}
const CLEAN = {
  videos(b, old, HttpError) {
    const v = parseVideo(b.url || (b.videoId && (b.provider === 'vimeo' ? 'https://vimeo.com/' + b.videoId : b.videoId)));
    if (!v) throw new HttpError(400, 'Paste a YouTube or Vimeo link (for example https://www.youtube.com/watch?v=…).');
    return { ...base(b, old, 'v', HttpError), description: text(b.description, 1200), provider: v.provider, videoId: v.videoId, duration: line(b.duration, 12), cover: okUrl(b.cover) };
  },
  books(b, old, HttpError) {
    const file = okUrl(b.file, 800);
    if (b.file && !file) throw new HttpError(400, 'The book file must be uploaded here, or be an https:// link.');
    const pages = Math.floor(Number(b.pages));
    return { ...base(b, old, 'b', HttpError), author: line(b.author, 120), description: text(b.description, 1500), cover: okUrl(b.cover), file, pages: pages > 0 && pages < 10000 ? pages : 0 };
  },
  grammar(b, old, HttpError) {
    const exercises = (Array.isArray(b.exercises) ? b.exercises : []).slice(0, 40).map((x) => {
      const q = text(x && x.q, 400); if (!q) return null;
      const options = (Array.isArray(x.options) ? x.options : []).map((o) => line(o, 160)).filter(Boolean).slice(0, 6);
      let answer = line(x.answer, 200);
      if (options.length) { const k = Number.isInteger(x.answer) ? x.answer : options.findIndex((o) => o.toLowerCase() === answer.toLowerCase()); answer = options[k] ? options[k] : ''; }
      if (!answer) throw new HttpError(400, 'Every exercise needs its answer (for a choice question: one of its options).');
      return { q, options, answer, explain: text(x.explain, 400) };
    }).filter(Boolean);
    const content = text(b.content, 30000);
    if (!content && !exercises.length) throw new HttpError(400, 'Write the explanation of the topic (or add exercises).');
    return { ...base(b, old, 'g', HttpError), summary: text(b.summary, 400), content, exercises };
  },
  music(b, old, HttpError) {
    const url = okUrl(b.url, 800);
    if (!url) throw new HttpError(400, 'Upload the music file (MP3, M4A, OGG, WAV) or paste an https:// link to it.');
    return { ...base(b, old, 'm', HttpError), artist: line(b.artist, 80), url, cover: okUrl(b.cover) };
  }
};

/* ───────── storage ───────── */
async function load(ctx, kind) {
  let v = null; try { v = await ctx.store.getSetting(KINDS[kind].key); } catch (e) { v = null; }
  return { items: v && Array.isArray(v.items) ? v.items.filter((x) => x && ID_RE.test(String(x.id))) : [], updatedAt: (v && v.updatedAt) || null };
}
async function save(ctx, kind, data) {
  data.updatedAt = new Date().toISOString();
  await ctx.store.setSetting(KINDS[kind].key, { items: data.items, updatedAt: data.updatedAt });
  return data;
}
async function loadLinks(ctx) {
  let v = null; try { v = await ctx.store.getSetting(LINKS_KEY); } catch (e) { v = null; }
  return { rules: v && Array.isArray(v.rules) ? v.rules.filter((r) => r && LINK_ID_RE.test(String(r.id))) : [], updatedAt: (v && v.updatedAt) || null };
}
function cleanLinks(list, HttpError) {
  if (!Array.isArray(list)) throw new HttpError(400, 'Send the list of links.');
  if (list.length > MAX_LINKS) throw new HttpError(400, `Keep at most ${MAX_LINKS} links.`);
  const seen = new Set();
  return list.map((r, n) => {
    const from = okLink(r && r.from), to = okLink(r && r.to);
    if (!from && !to && !line(r && r.note, 1)) return null;   // an empty row
    if (!from) throw new HttpError(400, `Row ${n + 1}: the old link must be a page of this site (/…) or an https://, mailto: or tel: address.`);
    if (!to) throw new HttpError(400, `Row ${n + 1}: the new link must be a page of this site (/…) or an https://, mailto: or tel: address.`);
    if (/^\/(?:api|admin)(?:[/.?#]|$)/i.test(from)) throw new HttpError(400, `Row ${n + 1}: the admin panel and /api addresses cannot be changed.`);
    const k = from.toLowerCase().replace(/\/+$/, '');
    if (k === to.toLowerCase().replace(/\/+$/, '')) throw new HttpError(400, `Row ${n + 1}: the old and the new link are the same.`);
    if (seen.has(k)) throw new HttpError(400, `Row ${n + 1}: ${from} is in the list twice.`);
    seen.add(k);
    return { id: LINK_ID_RE.test(String(r.id)) ? r.id : makeId('l'), from, to, note: line(r.note, 120), active: r.active !== false };
  }).filter(Boolean);
}

/* ───────── what a visitor may see ───────── */
function view(kind, it, level, full) {
  const locked = level < (LEVEL[it.plan] || 0);
  const out = { id: it.id, title: it.title, category: it.category || '', level: it.level || '', plan: it.plan, locked, updatedAt: it.updatedAt || null };
  if (kind === 'videos') {
    Object.assign(out, { description: it.description || '', duration: it.duration || '', provider: it.provider });
    if (!locked) Object.assign(out, { videoId: it.videoId, cover: it.cover || (it.provider === 'youtube' ? 'https://i.ytimg.com/vi/' + it.videoId + '/hqdefault.jpg' : '') });
    else if (it.cover) out.cover = it.cover;   // the admin's own picture shows nothing of the video
  } else if (kind === 'books') {
    Object.assign(out, { author: it.author || '', description: it.description || '', cover: it.cover || '', pages: it.pages || 0, hasFile: !!it.file });
    if (!locked) out.file = it.file || '';
  } else if (kind === 'grammar') {
    Object.assign(out, { summary: it.summary || '', exercises: (it.exercises || []).length });
    if (full && !locked) Object.assign(out, { content: it.content || '', exercises: it.exercises || [] });
  } else if (kind === 'music') {
    Object.assign(out, { artist: it.artist || '', cover: it.cover || '' });
    if (!locked) out.url = it.url;
  }
  return out;
}
const planName = (p) => p.charAt(0).toUpperCase() + p.slice(1);
const pageOf = { videos: '/videos', books: '/books', grammar: '/grammar', music: '/settings' };
const priceLink = (kind, it) => '/Price?premium=required&plan=' + encodeURIComponent(it.plan) + '&next=' + encodeURIComponent(pageOf[kind] + (kind === 'grammar' ? '#' + it.id : ''));

/* GET /api/panels/<kind>          the published items (grammar: without the text)
   GET /api/panels/grammar/<id>    one grammar topic with its text and exercises, when the plan allows it
   GET /api/links                  the active link rules (every page: assets/js/site-links.js) */
async function route(req, res, p, method, ctx) {
  const { send, HttpError } = ctx;
  if (method !== 'GET' && method !== 'HEAD') throw new HttpError(405, 'Method not allowed.');
  ctx.rateLimit('panels:' + ctx.clientIp(req), 300, 60000);
  if (p === '/api/links') {
    const data = await loadLinks(ctx);
    // the same for everybody: kept a minute by the browser and by Vercel's CDN
    return send(res, 200, { rules: data.rules.filter((r) => r.active).map((r) => ({ from: r.from, to: r.to })), updatedAt: data.updatedAt }, { 'Cache-Control': 'public, max-age=60, s-maxage=60' });
  }
  const m = /^\/api\/panels\/(videos|books|grammar|music)(?:\/([a-z]-[a-f0-9]{8}))?$/.exec(p);
  if (!m) throw new HttpError(404, 'Not found.');
  const kind = m[1];
  const u = await ctx.currentUser(req).catch(() => null);
  const level = ctx.userLevel(u);
  const items = (await load(ctx, kind)).items.filter((x) => x.published !== false);
  const headers = { 'Cache-Control': 'no-store, private' };
  if (!m[2]) return send(res, 200, { kind, signedIn: !!u, level, plan: PLANS[Math.min(3, level)], items: items.map((x) => view(kind, x, level, false)) }, headers);
  if (kind !== 'grammar') throw new HttpError(404, 'Not found.');
  const it = items.find((x) => x.id === m[2]);
  if (!it) throw new HttpError(404, 'This topic is not available.');
  const v = view(kind, it, level, true);
  if (v.locked) return send(res, 403, { error: u ? `This topic is for ${planName(it.plan)} members.` : 'Sign in to open this topic.', locked: true, signedIn: !!u, item: v, price: priceLink(kind, it) }, headers);
  return send(res, 200, { item: v }, headers);
}

/* GET    /api/admin/panels/<kind>              every item (also the hidden ones)
   POST   /api/admin/panels/<kind>              { item }  make one, or change it (same id)
   POST   /api/admin/panels/<kind>/order        { ids }   the order on the page
   DELETE /api/admin/panels/<kind>/<id>
   GET    /api/admin/links  ·  POST /api/admin/links { rules }   the whole list of link rules */
async function adminRoute(req, res, p, method, ctx) {
  const { send, readJson, HttpError, admin, audit } = ctx;
  const nc = { 'Cache-Control': 'no-store' };
  if (p === '/api/admin/links') {
    if (method === 'GET') return send(res, 200, await loadLinks(ctx), nc);
    if (method !== 'POST') throw new HttpError(405, 'Method not allowed.');
    const rules = cleanLinks((await readJson(req, 256 * 1024)).rules, HttpError);
    const data = { rules, updatedAt: new Date().toISOString() };
    await ctx.store.setSetting(LINKS_KEY, data);
    await audit(admin, 'links.save', 'links', { rules: rules.length, active: rules.filter((r) => r.active).length });
    return send(res, 200, data, nc);
  }
  const m = /^\/api\/admin\/panels\/(videos|books|grammar|music)(?:\/(order|[a-z]-[a-f0-9]{8}))?$/.exec(p);
  if (!m) throw new HttpError(404, 'API endpoint not found.');
  const kind = m[1]; const K = KINDS[kind];
  const data = await load(ctx, kind);
  const out = (status, extra) => send(res, status || 200, { kind, items: data.items, updatedAt: data.updatedAt, ...(extra || {}) }, nc);
  if (!m[2] && method === 'GET') return out();
  if (!m[2] && method === 'POST') {
    const b = await readJson(req, 512 * 1024); const body = b && b.item && typeof b.item === 'object' ? b.item : b || {};
    const i = body.id ? data.items.findIndex((x) => x.id === body.id) : -1;
    if (body.id && i < 0) throw new HttpError(404, `This ${K.noun} was deleted. Reload the page.`);
    if (i < 0 && data.items.length >= K.max) throw new HttpError(400, `Keep at most ${K.max} items here: delete old ones first.`);
    const it = CLEAN[kind](body, i >= 0 ? data.items[i] : null, HttpError);
    if (i >= 0) data.items[i] = it; else data.items.unshift(it);
    await save(ctx, kind, data);
    await audit(admin, 'panel.save', it.title, { kind, plan: it.plan, published: it.published });
    return out(i >= 0 ? 200 : 201, { item: it });
  }
  if (m[2] === 'order' && method === 'POST') {
    const ids = ((await readJson(req)).ids || []).map(String);
    const pos = new Map(ids.map((id, n) => [id, n]));
    data.items.sort((a, b) => (pos.has(a.id) ? pos.get(a.id) : 1e6) - (pos.has(b.id) ? pos.get(b.id) : 1e6));
    await save(ctx, kind, data);
    return out();
  }
  if (m[2] && m[2] !== 'order' && method === 'DELETE') {
    const it = data.items.find((x) => x.id === m[2]); if (!it) throw new HttpError(404, `This ${K.noun} was not found.`);
    data.items = data.items.filter((x) => x.id !== it.id);
    await save(ctx, kind, data);
    await audit(admin, 'panel.delete', it.title, { kind });
    return out();
  }
  throw new HttpError(405, 'Method not allowed.');
}

module.exports = { route, adminRoute, parseVideo, videoUrl, cleanLinks, KINDS, LINKS_KEY };
