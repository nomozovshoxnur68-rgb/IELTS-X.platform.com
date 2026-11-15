/* IELTSX admin panel (admin.html). Everything shown here is checked and enforced by the server. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const DAY = 86400000;
  const VIEWS = { dashboard: 'Dashboard', users: 'Users', premium: 'Premium', orders: 'Orders', activity: 'Test activity', audit: 'Activity log', ai: 'AI Test Generator', reading: 'Reading · Part practice', readingfull: 'Reading · Full tests', packs: 'Packs (all Full Tests cards)', mocks: 'Mock tests', games: 'Games · live quiz',listening: 'Listening · Part practice', listeningfull: 'Listening · Full tests', writing: 'Writing · Part practice', writingfull: 'Writing · Full tests', speaking: 'Speaking · Part practice', speakingfull: 'Speaking · Full tests', articles: 'Article cards', pdf: 'PDF materials', vocab: 'Vocabulary', access: 'Access (lock / plans)', pricing: 'Price control', branding: 'Logo', design: 'Design', sitecheck: 'Website check', predictions: 'Predictions' };

  /* ───────── icons (one stroke set, drawn with currentColor so they follow light / dark) ───────── */
  const ICONS = {
    dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
    timer: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    pen: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    library: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    audio: '<path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>',
    filepen: '<path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>',
    messages: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
    gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
    newspaper: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
    filedown: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>',
    languages: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
    lock: '<circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    wallet: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>', down: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>'
  };
  const icon = (name, cls) => `<svg class="${cls || 'ico-svg'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  window.IXAdminIcon = icon;
  function paintIcons(root) { $$('[data-i]', root || document).forEach((el) => { if (!el.firstChild && ICONS[el.dataset.i]) el.innerHTML = icon(el.dataset.i); }); }

  /* ───────── light / dark (the same "theme" choice as the website) ───────── */
  const themeNow = () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  function setTheme(t, save) {
    document.body.classList.add('theme-anim');
    document.documentElement.setAttribute('data-theme', t);
    if (save) { try { localStorage.setItem('theme', t); } catch (e) { /* blocked */ } }
    const b = $('#theme-toggle'); if (b) { b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); b.title = t === 'dark' ? 'Light mode' : 'Dark mode'; }
    clearTimeout(setTheme.t); setTheme.t = setTimeout(() => document.body.classList.remove('theme-anim'), 350);
  }
  function bindTheme() {
    const b = $('#theme-toggle'); if (b) b.addEventListener('click', () => setTheme(themeNow() === 'dark' ? 'light' : 'dark', true));
    setTheme(themeNow(), false);
    try {
      // no choice saved yet: follow the system setting while the panel is open
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { let s = null; try { s = localStorage.getItem('theme'); } catch (x) { /* blocked */ } if (!s) setTheme(e.matches ? 'dark' : 'light', false); });
    } catch (e) { /* old browser */ }
    window.addEventListener('storage', (e) => { if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) setTheme(e.newValue, false); });
  }
  document.addEventListener('DOMContentLoaded', () => { paintIcons(); bindTheme(); });

  /* A test, article, pack or lock saved here makes the copies of the card lists kept by the student pages old
     (IELTSX.cachedJson in assets/js/app.js), so the change shows on the next page they open. */
  if (window.fetch && !window.__ixAdminFetch) {
    window.__ixAdminFetch = true;
    const orig = window.fetch;
    window.fetch = function (url, opt) {
      const p = orig.apply(this, arguments);
      const method = String((opt && opt.method) || 'GET').toUpperCase();
      if (method !== 'GET' && /\/api\/admin\/(materials|access|packs|ai|mocks)/.test(String(url && url.url ? url.url : url))) {
        p.then((r) => { if (r.ok) { try { localStorage.setItem('ix-materials-changed', String(Date.now())); } catch (e) { /* blocked */ } } }, () => {});
      }
      return p;
    };
  }

  let me = null, users = [], orders = [], audit = [], results = [], latest = [], stats = null, plans = [];
  let actSeries = 'both';
  let userPage = 1, orderFilter = 'all', activityFilter = '', openUserId = null;
  const PER_PAGE = 25;

  /* ───────── helpers ───────── */
  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) { const e = new Error(d.error || 'Request failed'); e.status = r.status; throw e; }
    return d;
  }
  const post = (url, body) => api(url, { method: 'POST', body: JSON.stringify(body || {}) });
  function toast(message, bad) {
    const t = $('#toast'); if (!t) return;
    t.textContent = message; t.classList.toggle('bad', !!bad); t.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), bad ? 4200 : 2600);
  }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const fmtDate = (v) => (v ? new Date(v).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
  const fmtDateTime = (v) => (v ? new Date(v).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
  function ago(v) {
    if (!v) return 'never';
    const s = Math.max(0, (Date.now() - new Date(v).getTime()) / 1000);
    if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + ' min ago'; if (s < 86400) return Math.floor(s / 3600) + ' h ago';
    if (s < 30 * 86400) return Math.floor(s / 86400) + ' d ago'; return fmtDate(v);
  }
  const money = (n, c) => `${new Intl.NumberFormat('en-US').format(Math.round(n || 0))} ${c === 'UZS' || !c ? "so'm" : c}`;
  const moneyMap = (m) => { const k = Object.keys(m || {}); return k.length ? k.map((c) => money(m[c], c)).join(' + ') : '0 so\'m'; };
  const moneyBig = (m) => { const k = Object.keys(m || {}); return k.length ? k.map((c) => `${esc(new Intl.NumberFormat('en-US').format(Math.round(m[c])))}<small>${c === 'UZS' ? 'so\'m' : esc(c)}</small>`).join(' ') : '0<small>so\'m</small>'; };
  const duration = (s) => { s = Number(s) || 0; if (!s) return '—'; const m = Math.floor(s / 60); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`; };
  const initial = (u) => esc(String(u.name || u.email || '?').trim().charAt(0).toUpperCase() || '?');
  const daysLeft = (u) => (u.premiumExpiresAt ? Math.ceil((new Date(u.premiumExpiresAt).getTime() - Date.now()) / DAY) : Infinity);
  const isExpiring = (u) => u.premiumActive && !u.isAdmin && daysLeft(u) <= 7;
  const lastActive = (u) => u.lastLoginAt || u.lastTestAt || u.createdAt;

  /* ───────── navigation (hash based, one view at a time) ───────── */
  function showView(name) {
    if (!VIEWS[name]) name = 'dashboard';
    $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + name));
    $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === name));
    $('#topbar-title').textContent = VIEWS[name];
    document.title = VIEWS[name] + ' · IELTSX Admin';
    closeMenu(); window.scrollTo(0, 0);
    if (name === 'dashboard') requestAnimationFrame(renderActivityChart);   // the chart needs the width of the card
  }
  const currentView = () => (location.hash || '#dashboard').slice(1).split('?')[0];
  function openMenu() { $('#sidebar').classList.add('open'); $('#scrim').classList.add('open'); }
  function closeMenu() { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('open'); }

  /* ───────── boot + load ───────── */
  async function boot() {
    try {
      const d = await api('/api/auth/me');
      if (!d.user) return void location.replace('/login?next=' + encodeURIComponent('/admin'));
      if (!d.user.isAdmin) return void location.replace('/?admin=denied');
      me = d.user;
    } catch (e) { return void (document.body.innerHTML = '<p style="padding:24px;font-family:system-ui">Cannot reach the server. Check the connection and reload.</p>'); }
    $('#admin-name').textContent = me.name; $('#admin-role').textContent = me.email; $('#admin-avatar').textContent = (me.name || '?').charAt(0).toUpperCase();
    bind(); showView(currentView());
    api('/api/plans').then((d) => { plans = d.plans || []; fillPlans(); }).catch(() => {});
    await load();
  }

  async function load() {
    const btn = $('#refresh'); btn.disabled = true;
    const run = (p) => p.then((v) => v, (e) => { fail(e); return null; });
    const [ud, sd, od, ad, rd] = await Promise.all([
      run(api('/api/admin/users')), run(api('/api/admin/stats')), run(api('/api/admin/orders')),
      run(api('/api/admin/audit?limit=200')), run(api('/api/admin/results?limit=150' + (activityFilter ? '&section=' + activityFilter : '')))
    ]);
    if (ud) users = ud.users; if (sd) stats = sd; if (od) orders = od.orders; if (ad) audit = ad.entries; if (rd) results = rd.results;
    if (rd && !activityFilter) latest = rd.results;
    renderAll(); btn.disabled = false;
    if (openUserId && $('#drawer-backdrop').classList.contains('open')) openUser(openUserId, true);
  }
  function renderAll() { renderDashboard(); renderUsers(); renderPremium(); renderOrders(); renderActivity(); renderAudit(); }

  /* ───────── dashboard ───────── */
  const nf = (n) => new Intl.NumberFormat('en-US').format(Math.round(Number(n) || 0));
  const sum = (a) => a.reduce((x, y) => x + (Number(y) || 0), 0);
  const tinyIcon = (n) => icon(n).replace('class="ico-svg"', 'class="ico-svg" style="width:11px;height:11px"');
  /* the last 7 days against the 7 days before */
  function deltaChip(now, before) {
    if (!before && !now) return '<span class="delta">no change</span>';
    if (!before) return `<span class="delta up" title="Nothing in the 7 days before">${tinyIcon('up')}new</span>`;
    const pct = Math.round(((now - before) / before) * 100);
    const dir = pct > 0 ? 'up' : pct < 0 ? 'down' : '';
    return `<span class="delta ${dir}" title="Last 7 days compared with the 7 days before">${dir ? tinyIcon(dir) : ''}${pct > 0 ? '+' : ''}${pct}%</span>`;
  }
  /* a tiny line of the last 14 days */
  function spark(values) {
    if (!values || !values.length) return '';
    const w = 96, h = 30, max = Math.max(1, ...values), step = w / Math.max(1, values.length - 1);
    const pts = values.map((v, i) => [i * step, h - 3 - (v / max) * (h - 6)]);
    const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path class="area" d="${line} L${w} ${h} L0 ${h} Z"/><path class="line" d="${line}"/></svg>`;
  }
  function kpi(label, value, iconName, color, sub, extra, delta) {
    return `<div class="card kpi" style="--k:${color}"><div class="kpi-top"><div class="stat-label">${esc(label)}</div><div class="kpi-ico">${icon(iconName)}</div></div>
      <div class="kpi-val"><div class="stat-value">${value}</div>${delta || ''}</div><div class="kpi-foot"><div class="stat-sub">${sub}</div>${extra || ''}</div></div>`;
  }
  /* the activity chart: smooth lines with a soft fill, a guide line and a tooltip that follows the pointer */
  function lineChart(el, days, series) {
    const W = Math.max(280, el.clientWidth || 600), H = 240, pl = 34, pr = 12, pt = 14, pb = 28;
    const iw = W - pl - pr, ih = H - pt - pb, n = days.length;
    const rawMax = Math.max(1, ...series.flatMap((s) => s.values));
    const stepY = Math.max(1, Math.ceil(rawMax / 4)); const max = stepY * 4;
    const x = (i) => pl + (n === 1 ? iw / 2 : (i * iw) / (n - 1));
    const y = (v) => pt + ih - (v / max) * ih;
    const curve = (vals) => vals.map((v, i) => {
      if (!i) return `M${x(0).toFixed(1)} ${y(v).toFixed(1)}`;
      const x0 = x(i - 1), x1 = x(i), y0 = y(vals[i - 1]), y1 = y(v), cx = (x1 - x0) / 2;
      return `C${(x0 + cx).toFixed(1)} ${y0.toFixed(1)} ${(x1 - cx).toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }).join(' ');
    const label = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    let g = '';
    for (let k = 0; k <= 4; k++) { const v = stepY * k, yy = y(v).toFixed(1); g += `<line class="grid-line" x1="${pl}" x2="${W - pr}" y1="${yy}" y2="${yy}"/><text class="axis" x="${pl - 8}" y="${yy}" text-anchor="end" dominant-baseline="middle">${v}</text>`; }
    const every = n > 10 ? (W < 480 ? 3 : 2) : 1;
    days.forEach((d, i) => { if ((n - 1 - i) % every === 0) g += `<text class="axis" x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle">${esc(label(d))}</text>`; });
    const defs = series.map((s, k) => `<linearGradient id="lg${k}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:${s.color};stop-opacity:.24"/><stop offset="1" style="stop-color:${s.color};stop-opacity:0"/></linearGradient>`).join('');
    const paths = series.map((s, k) => { const c = curve(s.values); return `<path class="s-area" d="${c} L${x(n - 1).toFixed(1)} ${pt + ih} L${x(0).toFixed(1)} ${pt + ih} Z" fill="url(#lg${k})"/><path class="s-line" d="${c}" style="stroke:${s.color}"/>`; }).join('');
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(series.map((s) => s.name + ': ' + sum(s.values)).join(', '))} in the last ${n} days"><defs>${defs}</defs>${g}${paths}
      <g class="hover" style="display:none"><line class="hover-line" y1="${pt}" y2="${pt + ih}"/>${series.map((s) => `<circle class="dot" r="4.5" style="fill:${s.color}"/>`).join('')}</g>
      <rect x="${pl}" y="${pt}" width="${iw}" height="${ih}" fill="transparent" class="hit"/></svg><div class="lc-tip"></div>`;
    const svgEl = el.querySelector('svg'), hov = el.querySelector('.hover'), tip = el.querySelector('.lc-tip');
    const show = (evt) => {
      const r = svgEl.getBoundingClientRect(); const px = ((evt.clientX - r.left) / r.width) * W;
      const i = Math.max(0, Math.min(n - 1, Math.round(((px - pl) / iw) * (n - 1))));
      hov.style.display = ''; const xx = x(i);
      hov.querySelector('line').setAttribute('x1', xx); hov.querySelector('line').setAttribute('x2', xx);
      hov.querySelectorAll('circle').forEach((c, k) => { c.setAttribute('cx', xx); c.setAttribute('cy', y(series[k].values[i])); });
      tip.innerHTML = `<b>${esc(new Date(days[i] + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }))}</b>` + series.map((s) => `<div><i style="background:${s.color}"></i>${esc(s.name)}: <strong>${s.values[i]}</strong></div>`).join('');
      tip.classList.add('show');
      const left = (xx / W) * r.width; const tw = tip.offsetWidth;
      tip.style.transform = `translate(${Math.max(0, Math.min(r.width - tw, left + (left > r.width / 2 ? -tw - 12 : 12)))}px, ${Math.max(0, (Math.min(...series.map((s) => y(s.values[i]))) / H) * r.height - 30)}px)`;
    };
    const hide = () => { hov.style.display = 'none'; tip.classList.remove('show'); };
    const hit = el.querySelector('.hit');
    hit.addEventListener('mousemove', show); hit.addEventListener('mouseleave', hide);
    hit.addEventListener('touchstart', (e) => show(e.touches[0]), { passive: true }); hit.addEventListener('touchend', () => setTimeout(hide, 1600));
  }
  function renderActivityChart() {
    if (!stats || !stats.chart) return;
    const el = $('#chart-activity'); if (!el || !el.offsetParent) return;   // drawn when the dashboard is on screen (it needs its width)
    const { days, signups, tests } = stats.chart;
    const all = [{ key: 'signups', name: 'Sign-ups', color: 'var(--c1)', values: signups }, { key: 'tests', name: 'Tests finished', color: 'var(--c2)', values: tests }];
    const series = all.filter((s) => actSeries === 'both' || s.key === actSeries);
    lineChart(el, days, series);
    $('#act-legend').innerHTML = all.map((s) => `<span style="${series.includes(s) ? '' : 'opacity:.45'}"><i style="background:${s.color}"></i>${esc(s.name)} <strong>${sum(s.values)}</strong></span>`).join('');
    $$('#act-seg button').forEach((b) => b.classList.toggle('on', b.dataset.series === actSeries));
  }
  function donut(parts, total, label) {
    const r = 58, c = 2 * Math.PI * r; let off = 0;
    const segs = parts.filter((p) => p.value > 0).map((p) => { const len = (p.value / Math.max(1, total)) * c; const s = `<circle r="${r}" cx="75" cy="75" style="stroke:${p.color}" stroke-dasharray="${Math.max(0, len - (parts.filter((x) => x.value > 0).length > 1 ? 2 : 0)).toFixed(2)} ${c.toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 75 75)"><title>${esc(p.name)}: ${p.value}</title></circle>`; off += len; return s; }).join('');
    return `<svg class="donut" viewBox="0 0 150 150" role="img" aria-label="${esc(parts.map((p) => p.name + ' ' + p.value).join(', '))}"><circle class="track" r="${r}" cx="75" cy="75"/>${segs}<text class="big" x="75" y="74" text-anchor="middle">${nf(total)}</text><text class="lbl2" x="75" y="94" text-anchor="middle">${esc(label)}</text></svg>`;
  }
  const bandClass = (b) => (Number(b) >= 7 ? 'hi' : Number(b) >= 5.5 ? 'mid' : 'lo');
  function renderDashboard() {
    if (!stats) return;
    const days = stats.chart.days, su = stats.chart.signups, te = stats.chart.tests;
    const su7 = sum(su.slice(-7)), suPrev = sum(su.slice(0, 7)), te7 = sum(te.slice(-7)), tePrev = sum(te.slice(0, 7));
    const members = stats.users - stats.admins, conv = members ? Math.round((stats.premium / members) * 100) : 0;
    const h = new Date().getHours(); const first = String((me && me.name) || 'there').trim().split(/\s+/)[0];
    $('#dash-hello').textContent = `${h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}, ${first}`;
    $('#dash-date').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $('#dash-summary').textContent = `${su7} new student${su7 === 1 ? '' : 's'} and ${te7} finished test${te7 === 1 ? '' : 's'} this week` + (stats.pendingOrders ? ` · ${stats.pendingOrders} order${stats.pendingOrders === 1 ? '' : 's'} waiting for you` : ' · nothing is waiting for you');

    $('#kpis').innerHTML =
      kpi('Total users', nf(stats.users), 'users', 'var(--c1)', `+${stats.newUsers7} this week · +${stats.newUsers30} in 30 days`, spark(su), deltaChip(su7, suPrev)) +
      kpi('Premium members', nf(stats.premium), 'crown', 'var(--c4)', `${conv}% of students · ${stats.expiringSoon} ending soon`,
        `<div style="width:96px"><div class="hbar" title="${conv}% have a paid plan"><i style="width:${Math.min(100, conv)}%;background:var(--c4)"></i></div></div>`) +
      kpi('Tests finished', nf(stats.testsTotal), 'clipboard', 'var(--c2)', `${stats.tests7} this week` + (stats.avgBand ? ` · avg band ${stats.avgBand}` : ''), spark(te), deltaChip(te7, tePrev)) +
      kpi('Revenue (confirmed)', moneyBig(stats.revenue), 'wallet', 'var(--c3)', `${esc(moneyMap(stats.revenue30))} in 30 days`,
        stats.pendingOrders ? `<a class="badge badge-pending" href="#orders" style="text-decoration:none">${stats.pendingOrders} pending</a>` : '');
    renderActivityChart();

    // audience
    const parts = [{ name: 'Premium', value: stats.premium, color: 'var(--c4)' }, { name: 'Free', value: stats.free, color: 'var(--faint)' }, { name: 'Admins', value: stats.admins, color: 'var(--c2)' }];
    const verifiedPct = stats.users ? Math.round((stats.verified / stats.users) * 100) : 0;
    $('#audience').innerHTML = `<div class="donut-wrap">${donut(parts, stats.users, 'accounts')}<div class="donut-legend">${parts.map((p) => `<div><i style="background:${p.color}"></i><span>${p.name}</span><b>${nf(p.value)}</b></div>`).join('')}</div></div>
      <div class="mini-kv"><div><small>Conversion to Premium</small><b>${conv}%</b></div><div><small>E-mail verified</small><b>${verifiedPct}%</b></div>
      <div><small>Average band</small><b>${stats.avgBand ?? '—'}</b></div><div><small>New in 30 days</small><b>${nf(stats.newUsers30)}</b></div></div>`;

    // needs attention
    const pending = orders.filter((o) => o.status === 'pending');
    const expiring = users.filter(isExpiring);
    const todo = (ico, tone, title, sub, action) => `<div class="todo"><div class="todo-ico ${tone}">${icon(ico)}</div><div class="main"><strong>${title}</strong><div class="muted sm">${sub}</div></div>${action}</div>`;
    const rows = [];
    if (pending.length) rows.push(todo('bag', 'warn', `${pending.length} unpaid order${pending.length > 1 ? 's' : ''}`, 'Confirm once the payment arrived.', '<a class="btn btn-sm btn-primary" href="#orders">Review</a>'));
    if (expiring.length) rows.push(todo('clock', 'warn', `${expiring.length} plan${expiring.length > 1 ? 's' : ''} ending in 7 days`, esc(expiring.slice(0, 3).map((u) => u.name).join(', ')) + (expiring.length > 3 ? '…' : ''), '<a class="btn btn-sm" href="#premium">Open</a>'));
    if (stats.blocked) rows.push(todo('ban', 'bad', `${stats.blocked} suspended account${stats.blocked > 1 ? 's' : ''}`, 'They cannot sign in.', '<button class="btn btn-sm" data-filter-users="blocked" type="button">Show</button>'));
    const noPw = users.filter((u) => !u.isAdmin && !u.hasPassword).length;
    if (noPw) rows.push(todo('mail', 'info', `${noPw} account${noPw > 1 ? 's' : ''} sign in only with Google`, 'If one cannot sign in, open it and set a password.', '<button class="btn btn-sm" data-filter-users="all" type="button">Users</button>'));
    $('#attention').innerHTML = rows.join('') || `<div class="all-good"><div class="todo-ico ok">${icon('check')}</div><strong style="color:var(--ink)">All clear</strong><span class="sm">No orders, plans or accounts need you now.</span></div>`;

    // tests by section
    const sec = stats.bySection || {}; const secTotal = Math.max(1, sum(Object.values(sec)));
    const SEC = [['Reading', 'book', 'var(--c3)'], ['Listening', 'headphones', 'var(--c2)'], ['Writing', 'pen', 'var(--c4)'], ['Speaking', 'mic', 'var(--c5)']];
    $('#sections').innerHTML = SEC.map(([n, ic, c]) => { const v = sec[n] || 0, p = Math.round((v / secTotal) * 100); return `<div style="--k:${c}"><div class="hbar-top"><span>${icon(ic)}${n}</span><span><b>${nf(v)}</b><em>${p}%</em></span></div><div class="hbar"><i style="width:${v ? Math.max(2, p) : 0}%"></i></div></div>`; }).join('');

    // quick actions
    const q = (href, ico, title, sub) => `<a href="${href}"><span class="todo-ico">${icon(ico)}</span><span><strong>${title}</strong><span>${sub}</span></span></a>`;
    $('#quick').innerHTML = q('#predictions', 'layers', 'Predictions', 'Exam forecasts') + q('#ai', 'sparkles', 'AI generator', 'Make a test') +
      q('#premium', 'crown', 'Give Premium', 'To a student') + q('#mocks', 'timer', 'Mock tests', 'Full exams') + q('#pricing', 'tag', 'Prices', 'Plans and promos') + q('#sitecheck', 'shield', 'Website check', 'Find problems');

    // newest students, latest results
    const newest = users.filter((u) => !u.isAdmin).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
    $('#recent-users').innerHTML = newest.map((u) => `<div class="row"><div class="avatar">${initial(u)}</div><div class="main"><strong>${esc(u.name)}</strong><span>${esc(u.email)}</span></div>
      <div class="meta">${u.premiumActive ? '<span class="badge badge-premium">★ ' + esc(u.plan) + '</span>' : '<span class="badge badge-free">Free</span>'}<div style="margin-top:3px">${esc(ago(u.createdAt))}</div></div>
      <button class="btn btn-sm" data-open-user="${esc(u.id)}" type="button">Open</button></div>`).join('') || '<div class="empty">No students yet.</div>';
    $('#recent-results').innerHTML = latest.slice(0, 6).map((r) => `<div class="row"><span class="band-chip ${bandClass(r.band)}">${esc(r.band)}</span><div class="main"><strong>${esc(r.userName)}</strong><span>${esc(r.section)} · ${esc(r.pageLabel)}</span></div>
      <div class="meta">${r.scoreCorrect}/${r.scoreTotal}<div style="margin-top:3px">${esc(ago(r.createdAt))}</div></div></div>`).join('') || '<div class="empty">No finished tests yet.</div>';

    const badge = $('#orders-count'); badge.textContent = stats.pendingOrders; badge.hidden = !stats.pendingOrders;
  }

  /* ───────── users ───────── */
  function userMatches(u, q, f) {
    if (q && !`${u.name} ${u.email} ${u.id}`.toLowerCase().includes(q)) return false;
    switch (f) {
      case 'premium': return u.premiumActive && !u.isAdmin;
      case 'free': return !u.premiumActive && !u.isAdmin;
      case 'expiring': return isExpiring(u);
      case 'admin': return u.isAdmin;
      case 'blocked': return u.blocked;
      case 'unverified': return !u.emailVerified;
      case 'inactive': return Date.now() - new Date(lastActive(u)).getTime() > 30 * DAY;
      default: return true;
    }
  }
  const sorters = {
    new: (a, b) => new Date(b.createdAt) - new Date(a.createdAt), old: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    active: (a, b) => new Date(lastActive(b)) - new Date(lastActive(a)), tests: (a, b) => b.testsCount - a.testsCount,
    name: (a, b) => String(a.name).localeCompare(String(b.name))
  };
  function statusBadges(u) {
    const out = [];
    if (u.isAdmin) out.push('<span class="badge badge-admin">Admin</span>');
    else if (u.premiumActive) out.push('<span class="badge badge-premium">★ Premium</span>');
    else out.push('<span class="badge badge-free">Free</span>');
    if (u.blocked) out.push('<span class="badge badge-blocked">Suspended</span>');
    if (!u.emailVerified) out.push('<span class="badge" title="E-mail address not verified yet">Unverified</span>');
    return out.join(' ');
  }
  function planCell(u) {
    if (u.isAdmin) return '<span class="muted">—</span>';
    if (!u.premiumActive) return '<span class="muted">Free</span>';
    const d = daysLeft(u);
    return `${esc(u.plan)}<div class="sm ${d <= 7 ? '' : 'muted'}" style="${d <= 7 ? 'color:var(--warn)' : ''}">${u.premiumExpiresAt ? (d <= 0 ? 'ends today' : `${d} day${d === 1 ? '' : 's'} left`) : 'no expiry'}</div>`;
  }
  function userCell(u) {
    return `<div class="cell-user"><div class="avatar">${initial(u)}</div><div><strong>${esc(u.name)}${u.id === me.id ? ' <span class="muted">(you)</span>' : ''}</strong><span>${esc(u.email)}</span></div></div>`;
  }
  function renderUsers() {
    const q = ($('#user-search').value || '').trim().toLowerCase(), f = $('#user-filter').value, s = $('#user-sort').value;
    const list = users.filter((u) => userMatches(u, q, f)).sort(sorters[s] || sorters.new);
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE)); userPage = Math.min(userPage, pages);
    const slice = list.slice((userPage - 1) * PER_PAGE, userPage * PER_PAGE);
    $('#users-body').innerHTML = slice.map((u) =>
      `<tr><td>${userCell(u)}</td><td class="nowrap">${planCell(u)}</td><td>${statusBadges(u)}</td><td class="right">${u.testsCount}</td><td>${u.avgBand ?? '—'}</td>` +
      `<td class="nowrap" title="${esc(fmtDateTime(lastActive(u)))}">${esc(ago(lastActive(u)))}</td><td class="nowrap">${fmtDate(u.createdAt)}</td>` +
      `<td><div class="actions"><button class="btn btn-sm btn-primary" data-open-user="${esc(u.id)}" type="button">Open</button>` +
      (u.isAdmin ? '' : `<button class="btn btn-sm" data-grant="${esc(u.id)}" type="button">${u.premiumActive ? '+ Extend' : '★ Premium'}</button>`) + '</div></td></tr>').join('')
      || '<tr><td colspan="8" class="empty">No users match.</td></tr>';
    $('#users-info').textContent = list.length ? `${(userPage - 1) * PER_PAGE + 1}–${Math.min(userPage * PER_PAGE, list.length)} of ${list.length} users` : '';
    $('#users-prev').disabled = userPage <= 1; $('#users-next').disabled = userPage >= pages;
  }

  /* ───────── premium ───────── */
  function renderPremium() {
    const list = users.filter((u) => u.premiumActive && !u.isAdmin).sort((a, b) => daysLeft(a) - daysLeft(b));
    $('#premium-body').innerHTML = list.map((u) =>
      `<tr><td>${userCell(u)}</td><td>${esc(u.plan)}</td><td>${u.premiumExpiresAt ? fmtDate(u.premiumExpiresAt) + `<div class="sm" style="color:${daysLeft(u) <= 7 ? 'var(--warn)' : 'var(--muted)'}">${daysLeft(u)} day${daysLeft(u) === 1 ? '' : 's'} left</div>` : '<span class="muted">No expiry</span>'}</td><td>${u.testsCount}</td>` +
      `<td><div class="actions"><button class="btn btn-sm" data-quick="${esc(u.id)}" data-days="30" type="button">+30d</button><button class="btn btn-sm" data-quick="${esc(u.id)}" data-days="365" type="button">+1y</button>` +
      `<button class="btn btn-sm" data-open-user="${esc(u.id)}" type="button">Open</button><button class="btn btn-sm btn-danger" data-revoke="${esc(u.id)}" type="button">Revoke</button></div></td></tr>`).join('')
      || '<tr><td colspan="5" class="empty">No premium members yet.</td></tr>';
    renderGive();
  }
  function renderGive() {
    const q = ($('#give-q').value || '').trim().toLowerCase(); const box = $('#give-results');
    if (q.length < 2) { box.innerHTML = ''; return; }
    const hits = users.filter((u) => !u.isAdmin && `${u.name} ${u.email}`.toLowerCase().includes(q)).slice(0, 6);
    box.innerHTML = hits.map((u) => `<div class="todo">${userCell(u)}<div class="actions">${statusBadges(u)}<button class="btn btn-sm btn-primary" data-grant="${esc(u.id)}" type="button">${u.premiumActive ? 'Extend' : 'Give Premium'}</button></div></div>`).join('') || '<div class="muted sm">No matching user. They must register first.</div>';
  }
  function fillPlans() {
    const names = ['Premium'].concat(plans.map((p) => p.name)).concat(['Lifetime']);
    $('#grant-plan').innerHTML = [...new Set(names)].map((n) => `<option>${esc(n)}</option>`).join('');
  }

  /* ───────── orders ───────── */
  function renderOrders() {
    const counts = { all: orders.length }; for (const o of orders) counts[o.status] = (counts[o.status] || 0) + 1;
    $('#order-tabs').innerHTML = ['all', 'pending', 'paid', 'rejected', 'cancelled'].map((s) => `<button class="tab${orderFilter === s ? ' active' : ''}" data-order-tab="${s}" type="button">${s[0].toUpperCase() + s.slice(1)}<span class="n">${counts[s] || 0}</span></button>`).join('');
    const list = orders.filter((o) => orderFilter === 'all' || o.status === orderFilter);
    $('#orders-body').innerHTML = list.map((o) =>
      `<tr><td><strong>${esc(o.ref)}</strong></td><td>${esc(o.userEmail)}</td><td>${esc(o.planName)} · ${o.months} mo</td><td class="nowrap">${money(o.amount, o.currency)}${o.promoCode ? `<div class="muted sm">${esc(o.promoCode)} · −${money(o.discount, o.currency)}</div>` : ''}</td>` +
      `<td><span class="badge badge-${esc(o.status)}">${esc(o.status)}</span></td><td class="nowrap">${fmtDateTime(o.createdAt)}</td>` +
      `<td>${o.status === 'pending' ? `<div class="actions"><button class="btn btn-sm btn-primary" data-order-approve="${esc(o.id)}" type="button">Confirm payment</button><button class="btn btn-sm btn-danger" data-order-reject="${esc(o.id)}" type="button">Reject</button></div>` : (o.paidAt ? '<span class="muted sm">paid ' + esc(fmtDate(o.paidAt)) + '</span>' : '—')}</td></tr>`).join('')
      || '<tr><td colspan="7" class="empty">No orders here.</td></tr>';
  }

  /* ───────── test activity + audit ───────── */
  function renderActivity() {
    $('#activity-tabs').innerHTML = [['', 'All'], ['Reading', 'Reading'], ['Listening', 'Listening'], ['Writing', 'Writing'], ['Speaking', 'Speaking']].map(([v, n]) => `<button class="tab${activityFilter === v ? ' active' : ''}" data-activity-tab="${v}" type="button">${n}</button>`).join('');
    $('#activity-body').innerHTML = results.map((r) =>
      `<tr><td><strong>${esc(r.userName)}</strong><div class="muted sm">${esc(r.userEmail)}</div></td><td>${esc(r.section)}${r.bucket === 'Mock' ? ' <span class="badge badge-info">Mock</span>' : ''}</td><td>${esc(r.pageLabel)}</td>` +
      `<td class="right nowrap">${r.scoreCorrect} / ${r.scoreTotal}</td><td><strong>${esc(r.band)}</strong></td><td>${duration(r.durationSec)}</td><td class="nowrap" title="${esc(fmtDateTime(r.createdAt))}">${esc(ago(r.createdAt))}</td></tr>`).join('')
      || '<tr><td colspan="7" class="empty">No finished tests yet.</td></tr>';
  }
  const ACTIONS = { 'premium.grant': 'Premium given', 'premium.revoke': 'Premium revoked', 'role.admin': 'Made admin', 'role.user': 'Admin removed', 'user.delete': 'Account deleted', 'user.block': 'Suspended', 'user.unblock': 'Unsuspended', 'user.note': 'Note edited', 'user.logout_all': 'Signed out everywhere', 'user.password': 'Password set by admin', 'prediction.save': 'Prediction saved', 'prediction.delete': 'Prediction deleted', 'order.approve': 'Payment confirmed', 'order.reject': 'Order rejected', 'order.paid': 'Order paid (webhook)', 'material.add': 'Material added', 'material.edit': 'Material edited', 'material.delete': 'Material deleted', upload: 'File uploaded', 'users.export': 'Users exported' };
  function renderAudit() {
    const q = ($('#audit-search').value || '').trim().toLowerCase();
    const list = audit.filter((e) => !q || `${e.actorEmail} ${e.action} ${ACTIONS[e.action] || ''} ${e.target}`.toLowerCase().includes(q));
    $('#audit-body').innerHTML = list.map((e) => {
      const meta = e.meta && Object.keys(e.meta).length ? Object.entries(e.meta).map(([k, v]) => `${k}: ${v}`).join(' · ') : '';
      return `<tr><td class="nowrap">${esc(fmtDateTime(e.createdAt))}</td><td>${esc(e.actorEmail || '—')}</td><td><strong>${esc(ACTIONS[e.action] || e.action)}</strong></td><td>${esc(e.target)}</td><td class="muted sm">${esc(meta)}</td></tr>`;
    }).join('') || '<tr><td colspan="5" class="empty">Nothing yet.</td></tr>';
  }

  /* ───────── user drawer ───────── */
  async function openUser(id, silent) {
    openUserId = id;
    const bd = $('#drawer-backdrop'); const dr = $('#drawer');
    if (!silent) { dr.innerHTML = '<div class="empty">Loading…</div>'; bd.classList.add('open'); document.body.style.overflow = 'hidden'; }
    try {
      const d = await api('/api/admin/users/' + encodeURIComponent(id));
      const u = d.user; const self = u.id === me.id;
      const exp = u.isAdmin ? 'Full access' : (u.premiumActive ? (u.premiumExpiresAt ? `${fmtDate(u.premiumExpiresAt)} (${daysLeft(u)} d left)` : 'No expiry') : '—');
      dr.innerHTML =
        `<div class="drawer-head"><div class="avatar lg">${initial(u)}</div><div class="grow"><h2>${esc(u.name)}</h2><div class="muted">${esc(u.email)}</div><div style="margin-top:6px">${statusBadges(u)}</div></div><button class="btn btn-sm" data-close-drawer type="button" aria-label="Close">✕</button></div>` +
        (u.blocked ? `<div class="alert"><strong>Suspended.</strong> ${esc(u.blockedReason || 'No reason given.')} This person cannot sign in.</div>` : '') +
        `<div class="kv"><div><small>Plan</small><b>${esc(u.plan)}</b></div><div><small>Premium until</small><b>${esc(exp)}</b></div>` +
        `<div><small>Joined</small><b>${esc(fmtDateTime(u.createdAt))}</b></div><div><small>Last sign-in</small><b>${u.lastLoginAt ? esc(fmtDateTime(u.lastLoginAt)) : '—'}</b></div>` +
        `<div><small>Sign-ins</small><b>${u.loginCount || 0}</b></div><div><small>Sign-in method</small><b>${u.hasPassword ? 'Password' : 'Google'}</b></div>` +
        `<div><small>Tests finished</small><b>${u.testsCount}</b></div><div><small>Average band</small><b>${u.avgBand ?? '—'}</b></div></div>` +
        (u.isAdmin ? '' : `<div class="box"><h4>Premium</h4><div class="btn-row">` +
          [[30, '+30 days'], [90, '+3 months'], [180, '+6 months'], [365, '+1 year'], [0, 'Lifetime']].map(([n, t]) => `<button class="btn btn-sm btn-primary" data-quick="${esc(u.id)}" data-days="${n}" type="button">${t}</button>`).join('') +
          `<button class="btn btn-sm" data-grant="${esc(u.id)}" type="button">Custom…</button>` +
          (u.premiumActive ? `<button class="btn btn-sm btn-danger" data-revoke="${esc(u.id)}" type="button">Take Premium away</button>` : '') + '</div></div>') +
        (self || u.isAdmin ? '' : `<div class="box"><h4>Sign-in help</h4><p class="muted sm" style="margin:0 0 8px">${u.hasPassword ? 'This person signs in with e-mail + password.' : 'This account was made with Google and has no password yet.'} If they cannot sign in, choose a new password here and send it to them privately. They are signed out on every device.</p>` +
          `<div class="btn-row"><input class="field" id="user-newpw" type="text" autocomplete="off" spellcheck="false" maxlength="200" placeholder="New password (8+ characters, a number or symbol)" style="flex:1 1 220px"><button class="btn btn-sm" data-gen-pw type="button">Generate</button><button class="btn btn-sm btn-primary" data-set-pw="${esc(u.id)}" type="button">Set password</button></div></div>`) +
        `<div class="box"><h4>Private note (only admins see it)</h4><textarea class="field" id="user-note" maxlength="500" placeholder="e.g. paid in cash on 12 Oct, Telegram @name">${esc(u.note)}</textarea><div class="btn-row" style="margin-top:8px"><button class="btn btn-sm" data-save-note="${esc(u.id)}" type="button">Save note</button></div></div>` +
        `<div class="box"><h4>Test history</h4>${testTable(d.results)}</div>` +
        `<div class="box"><h4>AI checks (Writing / Speaking)</h4>${aiTable(d.aiReports || [])}</div>` +
        `<div class="box"><h4>Mock tests</h4>${mockTable(d.mockAttempts || [])}</div>` +
        `<div class="box"><h4>Orders</h4>${orderTable(d.orders)}</div>` +
        (self ? '' : `<div class="box danger"><h4>Account control</h4><div class="btn-row">` +
          (u.isAdmin ? `<button class="btn btn-sm" data-role="user" data-id="${esc(u.id)}" type="button">Remove admin</button>` :
            `<button class="btn btn-sm" data-role="admin" data-id="${esc(u.id)}" type="button">Make admin</button>` +
            (u.blocked ? `<button class="btn btn-sm" data-block="${esc(u.id)}" data-state="0" type="button">Unsuspend</button>` : `<button class="btn btn-sm btn-danger" data-block="${esc(u.id)}" data-state="1" type="button">Suspend account</button>`) +
            `<button class="btn btn-sm" data-logout-all="${esc(u.id)}" type="button">Sign out everywhere</button><button class="btn btn-sm btn-danger" data-delete="${esc(u.id)}" data-email="${esc(u.email)}" type="button">Delete account</button>`) +
          '</div></div>');
    } catch (e) { fail(e); if (!silent) closeDrawer(); }
  }
  const testTable = (list) => list.length
    ? `<div class="table-wrap"><table class="table"><thead><tr><th>Test</th><th>Section</th><th class="right">Score</th><th>Band</th><th>Time</th><th>When</th></tr></thead><tbody>${list.slice(0, 30).map((r) => `<tr><td>${esc(r.pageLabel)}</td><td>${esc(r.section)}</td><td class="right nowrap">${r.scoreCorrect}/${r.scoreTotal}</td><td><strong>${esc(r.band)}</strong></td><td>${duration(r.durationSec)}</td><td class="nowrap">${esc(fmtDate(r.createdAt))}</td></tr>`).join('')}</tbody></table></div>${list.length > 30 ? `<div class="muted sm" style="margin-top:6px">Latest 30 of ${list.length} shown.</div>` : ''}`
    : '<div class="muted">No finished tests yet.</div>';
  /* the mock attempts of a student: bands marked on the server, how often they left the exam screen, and a mark when the
     page claimed another score than the server found (mock-tests.js) */
  const mockTable = (list) => list.length
    ? `<div class="table-wrap"><table class="table"><thead><tr><th>Mock</th><th>Mode</th><th>L</th><th>R</th><th>Overall</th><th>Integrity</th><th>When</th></tr></thead><tbody>${list.map((a) => `<tr><td>${esc(a.title || 'Mock test')}</td><td>${a.mode === 'practice' ? 'Practice' : 'Real'}</td>`
      + `<td>${a.L ? esc(Number(a.L.band).toFixed(1)) + ` <span class="muted sm">${a.L.correct}/${a.L.total}</span>` : '—'}</td><td>${a.R ? esc(Number(a.R.band).toFixed(1)) + ` <span class="muted sm">${a.R.correct}/${a.R.total}</span>` : '—'}</td>`
      + `<td><strong>${a.finishedAt ? (a.overall == null ? '—' : esc(Number(a.overall).toFixed(1))) : '<span class="muted">in progress</span>'}</strong></td>`
      + `<td>${(a.flags || []).length ? `<span class="badge badge-rejected" title="${esc(a.flags.join('\n'))}">⚠ check</span> ` : ''}${a.viol ? esc(a.viol) + ' left screen' : a.finishedAt ? '<span class="muted sm">clean</span>' : ''}</td>`
      + `<td class="nowrap">${esc(fmtDate(a.finishedAt || a.startedAt))}</td></tr>`).join('')}</tbody></table></div>`
    : '<div class="muted">No mock test taken yet.</div>';
  const AI_SHORT = { taskAchievement: 'TA', coherenceCohesion: 'CC', lexicalResource: 'LR', grammarAccuracy: 'GRA', fluencyCoherence: 'FC', pronunciation: 'P' };
  const aiTable = (list) => list.length
    ? `<div class="table-wrap"><table class="table"><thead><tr><th>Test</th><th>Section</th><th>Band</th><th>Criteria</th><th>When</th></tr></thead><tbody>${list.map((r) => `<tr><td>${esc(r.title)}</td><td>${esc(r.section)}</td><td><strong>${esc(Number(r.band).toFixed(1))}</strong></td><td class="nowrap">${Object.entries(r.criteria || {}).map(([k, v]) => `${esc(AI_SHORT[k] || k)} ${v === null ? '—' : esc(Number(v).toFixed(1))}`).join(' · ')}</td><td class="nowrap">${esc(fmtDate(r.createdAt))}</td></tr>`).join('')}</tbody></table></div><div class="muted sm" style="margin-top:6px">Latest ${list.length}. The texts and the feedback are visible only to the student.</div>`
    : '<div class="muted">No AI checks kept yet.</div>';
  const orderTable = (list) => list.length
    ? `<div class="table-wrap"><table class="table"><thead><tr><th>Code</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>${list.map((o) => `<tr><td>${esc(o.ref)}</td><td>${esc(o.planName)} · ${o.months} mo</td><td class="nowrap">${money(o.amount, o.currency)}</td><td><span class="badge badge-${esc(o.status)}">${esc(o.status)}</span></td><td class="nowrap">${esc(fmtDate(o.createdAt))}</td></tr>`).join('')}</tbody></table></div>`
    : '<div class="muted">No orders.</div>';
  function closeDrawer() { $('#drawer-backdrop').classList.remove('open'); document.body.style.overflow = ''; openUserId = null; }

  /* ───────── actions ───────── */
  const userById = (id) => users.find((x) => x.id === id);
  function openGrant(id) {
    const u = userById(id); if (!u) return;
    $('#grant-id').value = id; $('#grant-name').textContent = `${u.name} (${u.email})`;
    $('#grant-title').textContent = u.premiumActive ? 'Extend Premium access' : 'Give Premium access';
    $('#grant-modal').classList.add('open'); $('#grant-days').focus();
  }
  const closeGrant = () => $('#grant-modal').classList.remove('open');
  async function grant(id, plan, days, mode) {
    const d = await post(`/api/admin/users/${encodeURIComponent(id)}/premium`, { plan, days, mode });
    toast(days === 0 ? 'Lifetime Premium given' : `Premium active until ${fmtDate(d.user.premiumExpiresAt)}`); await load();
  }
  async function onClick(e) {
    const t = e.target.closest('button,a,[data-close-drawer]'); if (!t) { if (e.target === $('#drawer-backdrop')) closeDrawer(); return; }
    const ds = t.dataset;
    try {
      if (ds.series && t.closest('#act-seg')) { actSeries = ds.series; return renderActivityChart(); }
      if (ds.openUser) return openUser(ds.openUser);
      if (t.hasAttribute('data-close-drawer')) return closeDrawer();
      if (ds.grant) return openGrant(ds.grant);
      if (ds.quick) { const u = userById(ds.quick); return await grant(ds.quick, u && u.premiumActive && !u.isAdmin ? u.plan : 'Premium', Number(ds.days), 'extend'); }
      if (ds.revoke && confirm('Take Premium away from this user right now?')) { await api(`/api/admin/users/${encodeURIComponent(ds.revoke)}/premium`, { method: 'DELETE' }); toast('Premium removed'); return await load(); }
      if (ds.orderApprove && confirm('Confirm that this payment arrived and switch the plan on?')) { await post(`/api/admin/orders/${encodeURIComponent(ds.orderApprove)}/approve`); toast('Plan activated'); return await load(); }
      if (ds.orderReject && confirm('Reject this order?')) { await post(`/api/admin/orders/${encodeURIComponent(ds.orderReject)}/reject`); toast('Order rejected'); return await load(); }
      if (ds.orderTab) { orderFilter = ds.orderTab; return renderOrders(); }
      if (ds.activityTab !== undefined) { activityFilter = ds.activityTab; const d = await api('/api/admin/results?limit=150' + (activityFilter ? '&section=' + activityFilter : '')); results = d.results; return renderActivity(); }
      if (ds.filterUsers) { $('#user-filter').value = ds.filterUsers; userPage = 1; location.hash = '#users'; return renderUsers(); }
      if (t.hasAttribute('data-gen-pw')) {
        const abc = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'; const r = new Uint32Array(12); crypto.getRandomValues(r);
        const pw = Array.from(r, (n) => abc[n % abc.length]).join('').replace(/^(.{4})(.{4})/, '$1-$2-') + Math.floor(10 + (r[0] % 90));
        const f = $('#user-newpw'); if (f) { f.value = pw; f.select(); } return;
      }
      if (ds.setPw) {
        const f = $('#user-newpw'); const pw = f ? f.value.trim() : '';
        if (pw.length < 8) { toast('Type or generate a password of at least 8 characters.', true); if (f) f.focus(); return; }
        if (!confirm('Set this as the new password? The person is signed out everywhere and must use it next time.')) return;
        await post(`/api/admin/users/${encodeURIComponent(ds.setPw)}/password`, { password: pw });
        try { await navigator.clipboard.writeText(pw); toast('Password set and copied. Send it to the person privately.'); } catch (err) { toast('Password set. Send it to the person privately.'); }
        return await load();
      }
      if (ds.saveNote) { const d = await post(`/api/admin/users/${encodeURIComponent(ds.saveNote)}/note`, { note: $('#user-note').value }); toast('Note saved'); const u = userById(ds.saveNote); if (u) u.note = d.user.note; return; }
      if (ds.block) {
        const on = ds.state === '1'; let reason = '';
        if (on) { reason = prompt('Why is this account suspended? (optional, only admins see it)', ''); if (reason === null) return; }
        else if (!confirm('Allow this person to sign in again?')) return;
        await post(`/api/admin/users/${encodeURIComponent(ds.block)}/block`, { blocked: on, reason }); toast(on ? 'Account suspended and signed out' : 'Account restored'); return await load();
      }
      if (ds.logoutAll && confirm('Sign this user out on every device?')) { await post(`/api/admin/users/${encodeURIComponent(ds.logoutAll)}/logout-all`); toast('Signed out everywhere'); return await load(); }
      if (ds.role) {
        const makeAdmin = ds.role === 'admin';
        if (!confirm(makeAdmin ? 'Give this account FULL admin access?' : 'Remove admin access from this account?')) return;
        await post(`/api/admin/users/${encodeURIComponent(ds.id)}/role`, { role: ds.role }); toast(makeAdmin ? 'Admin access granted' : 'Admin access removed'); return await load();
      }
      if (ds.delete) {
        const typed = prompt(`This permanently deletes the account and its results.\nType the e-mail to confirm:\n${ds.email}`, '');
        if (typed === null) return;
        if (typed.trim().toLowerCase() !== String(ds.email).toLowerCase()) return toast('E-mail did not match. Nothing was deleted.', true);
        await api(`/api/admin/users/${encodeURIComponent(ds.delete)}`, { method: 'DELETE' }); closeDrawer(); toast('Account deleted'); return await load();
      }
      if (t.hasAttribute('data-logout')) { await api('/api/auth/logout', { method: 'POST' }).catch(() => {}); return void (location.href = '/login'); }
      if (t.hasAttribute('data-close-modal')) return closeGrant();
      if (t.hasAttribute('data-save-grant')) {
        t.disabled = true;
        try { await grant($('#grant-id').value, $('#grant-plan').value, Number($('#grant-days').value) || 0, $('#grant-mode').value); closeGrant(); } finally { t.disabled = false; }
      }
    } catch (err) { fail(err); }
  }

  function bind() {
    document.addEventListener('click', onClick);
    $('#menu-btn').addEventListener('click', openMenu); $('#scrim').addEventListener('click', closeMenu);
    $('#refresh').addEventListener('click', () => load().then(() => toast('Updated')));
    window.addEventListener('hashchange', () => showView(currentView()));
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(renderActivityChart, 150); });
    let timer; const debounce = (fn) => () => { clearTimeout(timer); timer = setTimeout(fn, 120); };
    $('#user-search').addEventListener('input', debounce(() => { userPage = 1; renderUsers(); }));
    $('#user-filter').addEventListener('change', () => { userPage = 1; renderUsers(); });
    $('#user-sort').addEventListener('change', () => { userPage = 1; renderUsers(); });
    $('#users-prev').addEventListener('click', () => { userPage = Math.max(1, userPage - 1); renderUsers(); });
    $('#users-next').addEventListener('click', () => { userPage += 1; renderUsers(); });
    $('#give-q').addEventListener('input', debounce(renderGive));
    $('#audit-search').addEventListener('input', debounce(renderAudit));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if ($('#grant-modal').classList.contains('open')) closeGrant(); else if ($('#drawer-backdrop').classList.contains('open')) closeDrawer(); else closeMenu(); } });
    $('#grant-modal').addEventListener('click', (e) => { if (e.target === $('#grant-modal')) closeGrant(); });
  }
  window.addEventListener('DOMContentLoaded', boot);
})();

