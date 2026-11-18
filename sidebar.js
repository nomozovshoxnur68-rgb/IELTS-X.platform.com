'use strict';
/*
 * IELTSX — the sidebar of the website, managed in the admin panel (admin.html#sidebar, admin-sidebar.js).
 *
 * The pages carry the same sidebar markup; assets/js/sidebar-links.js asks GET /api/sidebar and rebuilds the menu from it:
 * which groups and items there are, their order, names, icons, who sees them and whether they are free or locked.
 * Everything lives in one setting ("sidebar"). Nothing saved = the sidebar the pages have always had.
 *
 *   group: { id, title }                       built-in ids: full, practice, collections, tools; new ones: g-xxxxxxxx
 *   item:  { key, label, href, icon, group, visible, access, plan, newTab, badge }
 *     key      a built-in item (listening, predictions, …) or "c-xxxxxxxx" for an item made in the admin panel
 *     visible  all | signed-in | guests | paid | admins | hidden          (who sees the item in the menu)
 *     access   default (as the page shows it) | free | locked             (locked = needs `plan` or higher)
 *     plan     standard | max | ultra
 *
 * The server decides what a visitor gets: hidden items and items for other people are never sent, and `locked` is
 * worked out from the visitor's own plan (a locked item leads to the Price page; the page itself also sends a visitor
 * without the plan there).
 */
const crypto = require('crypto');

const KEY = 'sidebar';
const VISIBLE = ['all', 'signed-in', 'guests', 'paid', 'admins', 'hidden'];
const ACCESS = ['default', 'free', 'locked'];
const PLANS = ['standard', 'max', 'ultra'];
const LEVEL = { free: 0, standard: 1, max: 2, ultra: 3 };
const ICONS = ['headphones', 'book', 'pen', 'mic', 'layers', 'timer', 'gamepad', 'chart', 'file', 'newspaper', 'languages', 'settings',
  'star', 'flame', 'calendar', 'video', 'link', 'graduation', 'trophy', 'sparkles', 'message', 'gift', 'bell', 'folder', 'globe', 'lock'];
const BADGES = ['', 'new', 'hot', 'free', 'beta', 'soon'];
const MAX_ITEMS = 60;
const MAX_GROUPS = 12;

const GROUPS = [
  { id: 'full', title: 'Full Tests' },
  { id: 'practice', title: 'Part Practice' },
  { id: 'collections', title: 'Collections' },
  { id: 'tools', title: 'Study Tools' }
];
/* what the pages show out of the box (assets/js/sidebar-links.js has the same keys) */
const BUILTIN = [
  { key: 'listening', label: 'Listening', href: '/full-tests/listening/', icon: 'headphones', group: 'full' },
  { key: 'reading', label: 'Reading', href: '/full-tests/reading/', icon: 'book', group: 'full' },
  { key: 'writing', label: 'Writing', href: '/full-tests/writing/', icon: 'pen', group: 'full' },
  { key: 'speaking', label: 'Speaking', href: '/full-tests/speaking/', icon: 'mic', group: 'full' },
  { key: 'listening-sections', label: 'Listening Sections', href: '/part/practice/listening', icon: 'headphones', group: 'practice' },
  { key: 'reading-passages', label: 'Reading Passages', href: '/part/practice/reading', icon: 'book', group: 'practice' },
  { key: 'writing-tasks', label: 'Writing Tasks', href: '/part/practice/writing', icon: 'pen', group: 'practice' },
  { key: 'speaking-topics', label: 'Speaking Topics', href: '/part/practice/speaking', icon: 'message', group: 'practice' },
  { key: 'predictions', label: 'Predictions', href: '/Predictions', icon: 'layers', group: 'collections' },
  { key: 'mock-tests', label: 'Mock Tests', href: '/Mock%20tests', icon: 'timer', group: 'collections' },
  { key: 'game', label: 'Game', href: '/game', icon: 'gamepad', group: 'collections' },
  { key: 'performance', label: 'Performance', href: '/study/Tools/Performance', icon: 'chart', group: 'tools' },
  { key: 'pdf-materials', label: 'Pdf materials', href: '/study/Tools/Pdf%20materials', icon: 'file', group: 'tools' },
  { key: 'articles', label: 'Articles', href: '/study/Tools/Articles', icon: 'newspaper', group: 'tools' },
  { key: 'vocabulary', label: 'Vocabularies', href: '/vocabulary', icon: 'languages', group: 'tools' },
  { key: 'settings', label: 'Settings', href: '/settings', icon: 'settings', group: 'tools' }
];
const BUILTIN_KEYS = new Set(BUILTIN.map((b) => b.key));
const builtin = (key) => BUILTIN.find((b) => b.key === key);

const oneLine = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const makeId = (prefix) => prefix + '-' + crypto.randomBytes(4).toString('hex');
/* a page of this website (/…) or an https:// address — never javascript:, data: or another scheme */
const okHref = (v) => { const s = String(v || '').trim(); return /^\/(?!\/)[^\s"'<>\\]{0,300}$/.test(s) || /^https:\/\/[^\s"'<>\\]{3,400}$/i.test(s) ? s : ''; };

function defaults() {
  return {
    groups: GROUPS.map((g) => ({ ...g })),
    items: BUILTIN.map((b) => ({ key: b.key, label: b.label, href: b.href, icon: b.icon, group: b.group, visible: 'all', access: 'default', plan: 'max', newTab: false, badge: '' })),
    updatedAt: null
  };
}

/* a saved sidebar, checked again (and every built-in item that is missing comes back at the end of its group) */
function normalize(raw) {
  const def = defaults();
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.items)) return def;
  const groups = []; const gseen = new Set();
  for (const g of Array.isArray(raw.groups) ? raw.groups : []) {
    if (!g || typeof g !== 'object') continue;
    const id = /^(full|practice|collections|tools|g-[a-f0-9]{8})$/.test(String(g.id)) ? String(g.id) : '';
    if (!id || gseen.has(id) || groups.length >= MAX_GROUPS) continue;
    gseen.add(id); groups.push({ id, title: oneLine(g.title, 40) || (GROUPS.find((x) => x.id === id) || {}).title || 'Menu' });
  }
  if (!groups.length) groups.push(...def.groups);
  const gids = new Set(groups.map((g) => g.id));
  const items = []; const seen = new Set();
  for (const it of raw.items) {
    if (!it || typeof it !== 'object' || items.length >= MAX_ITEMS) continue;
    const key = String(it.key || '');
    const isBuiltin = BUILTIN_KEYS.has(key);
    if (!isBuiltin && !/^c-[a-f0-9]{8}$/.test(key)) continue;
    if (seen.has(key)) continue;
    const b = builtin(key);
    const href = isBuiltin ? b.href : okHref(it.href);
    if (!href) continue;
    seen.add(key);
    items.push({
      key, label: oneLine(it.label, 40) || (b ? b.label : 'Menu item'), href,
      icon: ICONS.includes(it.icon) ? it.icon : (b ? b.icon : 'link'),
      group: gids.has(it.group) ? it.group : (b && gids.has(b.group) ? b.group : groups[0].id),
      visible: VISIBLE.includes(it.visible) ? it.visible : 'all',
      access: ACCESS.includes(it.access) ? it.access : 'default',
      plan: PLANS.includes(it.plan) ? it.plan : 'max',
      newTab: !isBuiltin && !!it.newTab,
      badge: BADGES.includes(it.badge) ? it.badge : ''
    });
  }
  for (const b of BUILTIN) {
    if (seen.has(b.key)) continue;
    const g = gids.has(b.group) ? b.group : groups[groups.length - 1].id;
    let at = -1; items.forEach((x, n) => { if (x.group === g) at = n; });
    const row = { key: b.key, label: b.label, href: b.href, icon: b.icon, group: g, visible: 'all', access: 'default', plan: 'max', newTab: false, badge: '' };
    if (at < 0) items.push(row); else items.splice(at + 1, 0, row);
  }
  return { groups, items, updatedAt: raw.updatedAt || null };
}

/* the admin's form, checked: the same rules, plus clear messages */
function clean(body, HttpError) {
  const b = body && typeof body === 'object' ? body : {};
  const groups = Array.isArray(b.groups) ? b.groups.slice(0, MAX_GROUPS + 4) : [];
  if (!groups.length) throw new HttpError(400, 'Keep at least one group in the menu.');
  if (groups.length > MAX_GROUPS) throw new HttpError(400, `Keep at most ${MAX_GROUPS} groups.`);
  const gOut = groups.map((g) => {
    const id = /^(full|practice|collections|tools|g-[a-f0-9]{8})$/.test(String(g && g.id)) ? String(g.id) : makeId('g');
    const title = oneLine(g && g.title, 40);
    if (!title) throw new HttpError(400, 'Every group needs a name.');
    return { id, title, _old: g && g.id };
  });
  const remap = new Map(gOut.map((g) => [String(g._old), g.id]));
  const items = Array.isArray(b.items) ? b.items : [];
  if (items.length > MAX_ITEMS) throw new HttpError(400, `Keep at most ${MAX_ITEMS} menu items.`);
  const out = [];
  for (const it of items) {
    if (!it || typeof it !== 'object') continue;
    let key = String(it.key || '');
    if (!BUILTIN_KEYS.has(key)) {
      if (!/^c-[a-f0-9]{8}$/.test(key)) key = makeId('c');
      const label = oneLine(it.label, 40);
      if (!label) throw new HttpError(400, 'A new menu item needs a name.');
      if (!okHref(it.href)) throw new HttpError(400, `"${label}": the link must be a page of this website (starting with /) or an https:// address.`);
    }
    out.push({ ...it, key, group: remap.get(String(it.group)) || it.group });
  }
  const n = normalize({ groups: gOut.map(({ id, title }) => ({ id, title })), items: out });
  n.updatedAt = new Date().toISOString();
  return n;
}

async function load(ctx) {
  let v = null;
  try { v = await ctx.store.getSetting(KEY); } catch (e) { v = null; }
  return normalize(v);
}

/* what one visitor gets: only the items meant for them, with `locked` from their own plan */
function forViewer(data, viewer) {
  const { signedIn, admin, level } = viewer;
  const sees = (v) => v === 'all' || (v === 'signed-in' && signedIn) || (v === 'guests' && !signedIn) || (v === 'paid' && (level >= 1 || admin)) || (v === 'admins' && admin);
  const items = data.items.filter((it) => sees(it.visible)).map((it) => {
    const need = it.access === 'locked' ? LEVEL[it.plan] || 2 : 0;
    const locked = it.access === 'locked' && !admin && level < need;
    const b = builtin(it.key);
    return { key: it.key, label: it.label, href: it.href, icon: it.icon, iconSet: !b || b.icon !== it.icon, group: it.group, access: it.access, plan: it.access === 'locked' ? it.plan : '', locked, newTab: it.newTab, badge: it.badge, custom: !b };
  });
  const used = new Set(items.map((i) => i.group));
  return { v: data.updatedAt || 'default', managed: !!data.updatedAt, signedIn: !!signedIn, groups: data.groups.filter((g) => used.has(g.id)), items };
}

/* GET /api/sidebar   the menu for this visitor */
async function route(req, res, p, method, ctx) {
  const { send, HttpError } = ctx;
  if (method !== 'GET' && method !== 'HEAD') throw new HttpError(405, 'Method not allowed.');
  ctx.rateLimit('sidebar:' + ctx.clientIp(req), 240, 60000);
  const u = await ctx.currentUser(req).catch(() => null);
  const data = await load(ctx);
  return send(res, 200, forViewer(data, { signedIn: !!u, admin: ctx.isAdmin(u), level: ctx.userLevel(u) }), { 'Cache-Control': 'no-store, private' });
}

/* GET  /api/admin/sidebar          the whole menu (every item, also the hidden ones) + the lists of icons and options
   POST /api/admin/sidebar          { groups, items }   save
   POST /api/admin/sidebar/reset    back to the sidebar of the pages */
async function adminRoute(req, res, p, method, ctx) {
  const { send, readJson, HttpError, admin, audit } = ctx;
  const out = (data) => send(res, 200, { sidebar: data, builtin: BUILTIN.map((b) => ({ key: b.key, label: b.label, href: b.href, icon: b.icon, group: b.group })), icons: ICONS, badges: BADGES.filter(Boolean) }, { 'Cache-Control': 'no-store' });
  if (p === '/api/admin/sidebar' && method === 'GET') return out(await load(ctx));
  if (p === '/api/admin/sidebar' && method === 'POST') {
    const data = clean(await readJson(req, 64 * 1024), HttpError);
    await ctx.store.setSetting(KEY, data);
    await audit(admin, 'sidebar.save', 'sidebar', { groups: data.groups.length, items: data.items.length, custom: data.items.filter((i) => !BUILTIN_KEYS.has(i.key)).length,
      hidden: data.items.filter((i) => i.visible === 'hidden').map((i) => i.key).slice(0, 20), locked: data.items.filter((i) => i.access === 'locked').map((i) => i.key + ':' + i.plan).slice(0, 20) });
    return out(data);
  }
  if (p === '/api/admin/sidebar/reset' && method === 'POST') {
    await ctx.store.setSetting(KEY, { reset: new Date().toISOString() });   // no items = the sidebar of the pages
    await audit(admin, 'sidebar.reset', 'sidebar');
    return out(defaults());
  }
  throw new HttpError(404, 'API endpoint not found.');
}

/* pages the Website check should know about: a menu item that points at a page of this site that does not exist */
async function links(ctx) { const d = await load(ctx); return d.items.filter((i) => i.visible !== 'hidden' && i.href.startsWith('/')).map((i) => ({ key: i.key, label: i.label, href: i.href, custom: !BUILTIN_KEYS.has(i.key) })); }
async function hide(ctx, keys) {
  const raw = await ctx.store.getSetting(KEY).catch(() => null);
  if (!raw || !Array.isArray(raw.items)) return 0;
  const d = normalize(raw); let n = 0;
  d.items.forEach((i) => { if (keys.includes(i.key) && i.visible !== 'hidden') { i.visible = 'hidden'; n++; } });
  if (n) { d.updatedAt = new Date().toISOString(); await ctx.store.setSetting(KEY, d); }
  return n;
}

module.exports = { route, adminRoute, defaults, normalize, clean, forViewer, links, hide, BUILTIN, ICONS };
