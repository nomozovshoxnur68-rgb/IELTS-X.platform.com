/* IELTSX — the Teacher Panel (teacher.html). A teacher sees only the students of their own class; every number comes
   from /api/teacher/… (teachers.js), which checks the teacher role. An admin can open any teacher's panel with
   /teacher?as=<teacherId> (Admin → Teachers → Open panel). The look is the admin panel's (admin.css) + teacher.css. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const DAY = 86400000;
  const VIEWS = { dashboard: 'Dashboard', students: 'Students', books: 'Books progress', add: 'Add students', settings: 'Class settings', none: 'Teacher Panel' };
  const AS = (new URLSearchParams(location.search).get('as') || '').replace(/[^A-Za-z0-9-]/g, '');

  /* ───────── icons (the admin panel's stroke set) ───────── */
  const ICONS = {
    dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    userplus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    library: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    graduation: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    pen: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'
  };
  const icon = (name, cls) => `<svg class="${cls || 'ico-svg'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  const paintIcons = (root) => $$('[data-i]', root || document).forEach((el) => { if (!el.firstChild && ICONS[el.dataset.i]) el.innerHTML = icon(el.dataset.i); });

  /* ───────── light / dark (the website's "theme" choice) ───────── */
  const themeNow = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  function setTheme(t, save) {
    document.body.classList.add('theme-anim'); document.documentElement.setAttribute('data-theme', t);
    if (save) { try { localStorage.setItem('theme', t); } catch (e) { /* blocked */ } }
    clearTimeout(setTheme.t); setTheme.t = setTimeout(() => document.body.classList.remove('theme-anim'), 350);
  }

  /* ───────── helpers ───────── */
  let me = null, teacher = null, data = null, books = null, booksLoading = false, openId = null, openBook = null, isAdmin = false;
  const withAs = (url) => (AS ? url + (url.includes('?') ? '&' : '?') + 'as=' + encodeURIComponent(AS) : url);
  async function api(url, opt = {}) {
    const r = await fetch(withAs(url), { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/teacher' + location.search)); throw new Error('Please sign in.'); }
    if (!r.ok) { const e = new Error(d.error || 'Request failed (' + r.status + ')'); e.status = r.status; throw e; }
    return d;
  }
  const post = (url, body) => api(url, { method: 'POST', body: JSON.stringify(body || {}) });
  function toast(m, bad) { const t = $('#toast'); t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const nf = (n) => new Intl.NumberFormat('en-US').format(n || 0);
  const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
  const fmtDateTime = (v) => (v ? new Date(v).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
  function ago(v) {
    if (!v) return 'never';
    const s = Math.max(0, (Date.now() - new Date(v).getTime()) / 1000);
    if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + ' min ago'; if (s < 86400) return Math.floor(s / 3600) + ' h ago';
    if (s < 30 * 86400) return Math.floor(s / 86400) + ' d ago'; return fmtDate(v);
  }
  const initial = (n) => esc(String(n || '?').trim().charAt(0).toUpperCase() || '?');
  const bandClass = (b) => (Number(b) >= 7 ? 'hi' : Number(b) >= 5.5 ? 'mid' : 'lo');
  const band = (b) => (b == null || b === '' || Number.isNaN(Number(b)) ? '<span class="muted">—</span>' : `<span class="band-chip ${bandClass(b)}">${esc(Number(b).toFixed(1))}</span>`);
  const trendChip = (t) => (t == null || !t ? '' : `<span class="delta ${t > 0 ? 'up' : 'down'}" title="Last 5 tests compared with the 5 before">${t > 0 ? '▲' : '▼'} ${esc(Math.abs(t).toFixed(1))}</span>`);
  const bar = (pct, k) => `<div class="tp-bar" style="--k:${k || 'var(--c3)'}" title="${pct}%"><i style="width:${Math.max(0, Math.min(100, pct || 0))}%"></i></div>`;
  const inactive = (s) => !s.lastActive || Date.now() - new Date(s.lastActive).getTime() > 7 * DAY;
  const KIND = { lesson: 'Lesson', reading: 'Reading', listening: 'Listening', vocabulary: 'Vocabulary', grammar: 'Grammar', writing: 'Writing', speaking: 'Speaking', test: 'Test', review: 'Review' };

  /* ───────── navigation ───────── */
  const currentView = () => (location.hash || '#dashboard').slice(1).split('?')[0];
  function showView(name) {
    if (!teacher) name = 'none'; else if (!VIEWS[name] || name === 'none') name = 'dashboard';
    $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + name));
    $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === name));
    $('#topbar-title').textContent = VIEWS[name];
    document.title = VIEWS[name] + ' · IELTSX Teacher';
    closeMenu(); window.scrollTo(0, 0);
    if (name === 'books' && !books && !booksLoading) loadBooks();
    if (name === 'dashboard') requestAnimationFrame(renderChart);   // the chart needs the width of its card
  }
  const openMenu = () => { $('#sidebar').classList.add('open'); $('#scrim').classList.add('open'); };
  const closeMenu = () => { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('open'); };

  /* ───────── boot + load ───────── */
  async function boot() {
    paintIcons();
    setTheme(themeNow(), false);
    $('#theme-toggle').addEventListener('click', () => setTheme(themeNow() === 'dark' ? 'light' : 'dark', true));
    $('#menu-btn').addEventListener('click', openMenu); $('#scrim').addEventListener('click', closeMenu);
    try {
      const d = await api('/api/teacher/me');
      me = d.user; isAdmin = !!d.admin; teacher = d.teacher;
      $('#me-name').textContent = me.name || 'Teacher'; $('#me-avatar').textContent = String(me.name || 'T').charAt(0).toUpperCase();
      $('#me-role').textContent = d.viewAs ? 'Admin · viewing a teacher' : (teacher ? (teacher.title || 'Teacher') : me.email);
      $('#nav-admin').hidden = !isAdmin; $('#none-admin').hidden = !isAdmin;
      if (!teacher && isAdmin) $('#none-text').textContent = 'Your account is an admin, not a teacher. Make teachers in Admin → Teachers; from there you can open the panel of any teacher.';
      if (d.viewAs && teacher) {
        const b = $('#viewas'); b.hidden = false;
        b.innerHTML = `${icon('shield')}<span>You are looking at <b>${esc(teacher.name)}</b>’s panel as an administrator. What you change here changes their class.</span><a class="btn btn-sm" href="/admin#teachers">Back to Admin → Teachers</a>`;
      }
    } catch (e) { document.querySelector('.page').innerHTML = `<div class="card"><div class="empty">Cannot reach the server. Check the connection and reload.<br><span class="sm">${esc(e.message)}</span></div></div>`; return; }
    bind(); showView(currentView());
    if (teacher) await load();
  }
  async function load() {
    const btn = $('#refresh'); btn.disabled = true;
    try { data = await api('/api/teacher/overview'); teacher = data.teacher; renderAll(); }
    catch (e) { fail(e); }
    finally { btn.disabled = false; }
    if (openId && $('#drawer-backdrop').classList.contains('open')) openStudent(openId, true);
  }
  async function loadBooks() {
    booksLoading = true; renderBooks();
    try { books = await api('/api/teacher/books'); } catch (e) { fail(e); books = books || { books: [], students: [] }; }
    finally { booksLoading = false; }
    renderBooks();
  }
  function renderAll() { renderDashboard(); renderGroups(); renderStudents(); renderAdd(); renderSettings(); if (books) loadBooks(); }

  /* ───────── dashboard ───────── */
  const kpi = (label, value, ico, k, sub, extra) => `<div class="card kpi" style="--k:${k}"><div class="kpi-top"><span class="stat-label">${label}</span><span class="kpi-ico">${icon(ico)}</span></div>
    <div class="kpi-val"><div class="stat-value">${value}</div>${extra || ''}</div><div class="kpi-foot"><p class="stat-sub">${sub}</p></div></div>`;
  function renderChart() {
    const el = $('#chart'); if (!el || !data) return;
    const w = el.clientWidth; if (!w && el.innerHTML) return;   // a hidden view: drawn when it is shown
    el.innerHTML = chartSvg(data.chart.days, data.chart.tests, data.chart.units, Math.max(300, w || 640));
  }
  function chartSvg(days, tests, units, width) {
    const W = width || 640, H = 220, pl = 28, pb = 26, pt = 12, n = days.length;
    const max = Math.max(4, ...tests, ...units); const step = (W - pl) / n; const bw = Math.min(14, step / 3);
    const y = (v) => pt + (H - pt - pb) * (1 - v / max);
    let g = '';
    for (let i = 0; i <= 4; i++) { const v = Math.round((max / 4) * i); g += `<line class="grid-line" x1="${pl}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text class="axis" x="${pl - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`; }
    const bars = days.map((d, i) => {
      const x = pl + step * i + step / 2;
      const lbl = i % 2 === n % 2 ? `<text class="axis" x="${x}" y="${H - 8}" text-anchor="middle">${esc(new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))}</text>` : '';
      return `<g><title>${esc(new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }))}: ${tests[i]} test${tests[i] === 1 ? '' : 's'}, ${units[i]} unit${units[i] === 1 ? '' : 's'} learned</title>
        <rect x="${x - bw - 1}" y="${y(tests[i])}" width="${bw}" height="${Math.max(0, H - pb - y(tests[i]))}" rx="3" fill="var(--c2)"/>
        <rect x="${x + 1}" y="${y(units[i])}" width="${bw}" height="${Math.max(0, H - pb - y(units[i]))}" rx="3" fill="var(--c3)"/>${lbl}</g>`;
    }).join('');
    return `<div class="lc"><svg viewBox="0 0 ${W} ${H}" style="height:auto" role="img" aria-label="Tests and learned units in the last 14 days">${g}${bars}</svg></div>
      <div class="lc-legend"><span><i style="background:var(--c2)"></i>Tests <strong>${tests.reduce((a, b) => a + b, 0)}</strong></span><span><i style="background:var(--c3)"></i>E-book units learned <strong>${units.reduce((a, b) => a + b, 0)}</strong></span></div>`;
  }
  function renderDashboard() {
    const k = data.kpis; const st = data.students;
    const h = new Date().getHours(); const first = String((AS ? teacher.name : me.name) || 'there').trim().split(/\s+/)[0];
    $('#dash-hello').textContent = `${h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}, ${first}`;
    $('#dash-date').textContent = (teacher.title ? teacher.title + ' · ' : '') + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    $('#dash-summary').textContent = st.length
      ? `${k.active7} of ${st.length} student${st.length === 1 ? '' : 's'} active this week · ${k.tests7} test${k.tests7 === 1 ? '' : 's'} finished` + (k.ebookAvg != null ? ` · e-books ${k.ebookAvg}% done on average` : '')
      : 'Your class is empty. Add your first students to start following their progress.';
    const nav = $('#nav-students'); nav.textContent = st.length; nav.hidden = !st.length;
    const inv = $('#nav-invites'); inv.textContent = teacher.invites.length; inv.hidden = !teacher.invites.length;
    $('#kpis').innerHTML =
      kpi('Students', `${nf(k.students)}<small>/ ${nf(k.max)}</small>`, 'users', 'var(--c1)', `${k.invites} invitation${k.invites === 1 ? '' : 's'} waiting`) +
      kpi('Active this week', `${k.activeRate}<small>%</small>`, 'activity', 'var(--c3)', `${k.active7} student${k.active7 === 1 ? '' : 's'} did a test or a unit, or signed in`, `<div style="width:96px">${bar(k.activeRate, 'var(--c3)')}</div>`) +
      kpi('Tests finished', nf(k.testsTotal), 'clipboard', 'var(--c2)', `${k.tests7} this week · ${k.tests30} in 30 days`, k.avgBand != null ? `<span class="band-chip ${bandClass(k.avgBand)}" title="Average band">${esc(k.avgBand.toFixed(1))}</span>${trendChip(k.bandTrend)}` : '') +
      kpi('E-books', k.ebookAvg == null ? '—' : `${k.ebookAvg}<small>%</small>`, 'book', 'var(--c4)', `${k.ebookStarted} student${k.ebookStarted === 1 ? '' : 's'} reading · ${k.unitsDone} unit${k.unitsDone === 1 ? '' : 's'} learned`, k.ebookAvg == null ? '' : `<div style="width:96px">${bar(k.ebookAvg, 'var(--c4)')}</div>`);
    renderChart();
    const SEC = [['Reading', 'book', 'var(--c3)'], ['Listening', 'headphones', 'var(--c2)'], ['Writing', 'pen', 'var(--c4)'], ['Speaking', 'mic', 'var(--c5)']];
    $('#sections').innerHTML = SEC.map(([n, ic, c]) => { const s = k.bySection[n] || {}; const p = s.band ? Math.round((s.band / 9) * 100) : 0;
      return `<div style="--k:${c}"><div class="hbar-top"><span>${icon(ic)}${n}</span><span><b>${s.band != null ? esc(s.band.toFixed(1)) : '—'}</b><em>${nf(s.count || 0)} test${s.count === 1 ? '' : 's'}</em></span></div><div class="hbar"><i style="width:${p}%"></i></div></div>`; }).join('');
    const todo = (ico, tone, title, sub, action) => `<div class="todo"><div class="todo-ico ${tone}">${icon(ico)}</div><div class="main"><strong>${title}</strong><div class="muted sm">${sub}</div></div>${action || ''}</div>`;
    const rows = [];
    const lazy = st.filter(inactive);
    if (lazy.length) rows.push(todo('clock', 'warn', `${lazy.length} student${lazy.length > 1 ? 's' : ''} inactive for 7+ days`, esc(lazy.slice(0, 3).map((s) => s.name).join(', ')) + (lazy.length > 3 ? '…' : ''), '<button class="btn btn-sm" data-filter="inactive" type="button">Show</button>'));
    const nob = st.filter((s) => !s.books.started);
    if (nob.length && data.kpis.ebookStarted !== undefined) rows.push(todo('book', 'info', `${nob.length} not started an e-book`, 'Send them the link of the Books page.', '<button class="btn btn-sm" data-filter="nobooks" type="button">Show</button>'));
    const low = st.filter((s) => s.avgBand != null && s.avgBand < 5.5);
    if (low.length) rows.push(todo('alert', 'bad', `${low.length} with an average band below 5.5`, esc(low.slice(0, 3).map((s) => s.name).join(', ')), '<button class="btn btn-sm" data-filter="low" type="button">Show</button>'));
    if (teacher.invites.length) rows.push(todo('mail', 'info', `${teacher.invites.length} invitation${teacher.invites.length > 1 ? 's' : ''} not accepted yet`, 'They accept on the /join page.', '<a class="btn btn-sm" href="#add">Open</a>'));
    if (!st.length) rows.push(todo('userplus', 'info', 'No students yet', 'Create accounts, invite by e-mail or share your class link.', '<a class="btn btn-sm btn-primary" href="#add">Add</a>'));
    $('#attention').innerHTML = rows.join('') || `<div class="all-good"><div class="todo-ico ok">${icon('check')}</div><strong style="color:var(--ink)">All clear</strong><span class="sm">Everybody is working this week.</span></div>`;
    const top = st.filter((s) => s.avgBand != null).sort((a, b) => b.avgBand - a.avgBand).slice(0, 6);
    $('#top').innerHTML = top.map((s) => `<div class="row"><div class="avatar">${initial(s.name)}</div><div class="main"><strong>${esc(s.name)}</strong><span>${s.tests} test${s.tests === 1 ? '' : 's'}${s.group ? ' · ' + esc(s.group) : ''}</span></div><div class="meta">${band(s.avgBand)} ${trendChip(s.trend)}</div><button class="btn btn-sm" data-open="${esc(s.id)}" type="button">Open</button></div>`).join('') || '<div class="empty">No finished tests yet.</div>';
    $('#latest').innerHTML = data.latest.slice(0, 6).map((r) => `<div class="row"><span class="band-chip ${bandClass(r.band)}">${esc(r.band)}</span><div class="main"><strong>${esc(r.name)}</strong><span>${esc(r.section)} · ${esc(r.pageLabel)}</span></div><div class="meta">${r.scoreCorrect}/${r.scoreTotal}<div style="margin-top:3px">${esc(ago(r.createdAt))}</div></div></div>`).join('') || '<div class="empty">No finished tests yet.</div>';
  }

  /* ───────── students ───────── */
  function renderGroups() {
    const groups = [...new Set([...(teacher.groups || []), ...data.students.map((s) => s.group).filter(Boolean)])];
    const sel = $('#st-group'); const cur = sel.value;
    sel.innerHTML = '<option value="">All groups</option>' + groups.map((g) => `<option${g === cur ? ' selected' : ''}>${esc(g)}</option>`).join('') + (data.students.some((s) => !s.group) && groups.length ? `<option value="-"${cur === '-' ? ' selected' : ''}>No group</option>` : '');
    $('#dl-groups').innerHTML = groups.map((g) => `<option value="${esc(g)}">`).join('');
  }
  function shownStudents() {
    const q = $('#st-search').value.trim().toLowerCase(), g = $('#st-group').value, f = $('#st-filter').value, s = $('#st-sort').value;
    const list = data.students.filter((x) => (!q || `${x.name} ${x.email}`.toLowerCase().includes(q)) && (!g || (g === '-' ? !x.group : x.group === g))
      && (f === 'all' || (f === 'active' && !inactive(x)) || (f === 'inactive' && inactive(x)) || (f === 'nobooks' && !x.books.started) || (f === 'low' && x.avgBand != null && x.avgBand < 5.5)));
    const t = (v) => (v ? new Date(v).getTime() : 0);
    const by = { name: (a, b) => a.name.localeCompare(b.name), active: (a, b) => t(b.lastActive) - t(a.lastActive), band: (a, b) => (b.avgBand ?? -1) - (a.avgBand ?? -1),
      books: (a, b) => (b.books.avgPercent ?? -1) - (a.books.avgPercent ?? -1), tests: (a, b) => b.tests - a.tests, new: (a, b) => t(b.addedAt) - t(a.addedAt) };
    return list.sort(by[s] || by.active);
  }
  function renderStudents() {
    const list = shownStudents();
    $('#st-body').innerHTML = list.map((s) => `<tr>
      <td><div class="tp-who"><div class="avatar">${initial(s.name)}</div><div><strong>${esc(s.name)}</strong><div class="muted sm">${esc(s.email)}</div></div></div></td>
      <td>${s.group ? `<span class="badge">${esc(s.group)}</span>` : '<span class="muted sm">—</span>'}</td>
      <td class="right"><b>${s.tests}</b>${s.tests7 ? `<div class="muted sm nowrap">+${s.tests7} this week</div>` : ''}</td>
      <td class="nowrap">${band(s.avgBand)} ${trendChip(s.trend)}</td>
      <td style="min-width:150px">${s.books.started ? `<div class="tp-pct"><b>${s.books.avgPercent}%</b><span class="muted sm">${s.books.unitsDone} unit${s.books.unitsDone === 1 ? '' : 's'} · ${s.books.started} book${s.books.started === 1 ? '' : 's'}</span></div>${bar(s.books.avgPercent)}` : '<span class="muted sm">not started</span>'}</td>
      <td class="nowrap"><span class="${inactive(s) ? 'tp-late' : ''}">${esc(ago(s.lastActive))}</span></td>
      <td class="right"><button class="btn btn-sm btn-primary" data-open="${esc(s.id)}" type="button">Open</button></td></tr>`).join('')
      || `<tr><td colspan="7"><div class="empty">${data.students.length ? 'Nobody matches.' : 'No students yet. <a class="link-btn" href="#add">Add students</a>'}</div></td></tr>`;
    $('#st-info').textContent = `Showing ${list.length} of ${data.students.length} student${data.students.length === 1 ? '' : 's'}`;
  }
  function csv() {
    const cell = (v) => { let s = String(v ?? ''); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const head = ['name', 'email', 'group', 'tests', 'tests_7_days', 'avg_band', 'last_band', 'reading', 'listening', 'writing', 'speaking', 'ebooks_started', 'ebook_percent', 'units_learned', 'ebook_accuracy', 'last_active'];
    const rows = shownStudents().map((s) => [s.name, s.email, s.group, s.tests, s.tests7, s.avgBand ?? '', s.lastBand ?? '', ...['Reading', 'Listening', 'Writing', 'Speaking'].map((k) => (s.bySection[k] || {}).band ?? ''), s.books.started, s.books.avgPercent ?? '', s.books.unitsDone, s.books.accuracy ?? '', s.lastActive || '']);
    const blob = new Blob(['﻿' + [head, ...rows].map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ieltsx-class-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ───────── one student (drawer) ───────── */
  async function openStudent(id, silent) {
    openId = id;
    const bd = $('#drawer-backdrop'), dr = $('#drawer');
    if (!silent) { dr.innerHTML = '<div class="empty">Loading…</div>'; bd.classList.add('open'); document.body.style.overflow = 'hidden'; }
    try {
      const d = await api('/api/teacher/students/' + encodeURIComponent(id));
      const s = d.student; const groups = [...new Set([...(teacher.groups || []), s.group].filter(Boolean))];
      const SEC = [['Reading', 'var(--c3)'], ['Listening', 'var(--c2)'], ['Writing', 'var(--c4)'], ['Speaking', 'var(--c5)']];
      dr.innerHTML = `<div class="drawer-head"><div class="avatar lg">${initial(s.name)}</div><div class="grow"><h2>${esc(s.name)}</h2><div class="muted">${esc(s.email)}</div>
          <div style="margin-top:6px">${s.premium ? `<span class="badge badge-premium">★ ${esc(s.plan)}</span>` : '<span class="badge badge-free">Free</span>'} ${inactive(s) ? '<span class="badge badge-warn">inactive 7+ days</span>' : '<span class="badge badge-ok">active this week</span>'}</div></div>
          <button class="btn btn-sm" data-close-drawer type="button" aria-label="Close">✕</button></div>
        <div class="kv"><div><small>In your class since</small><b>${esc(fmtDate(s.addedAt))}</b></div><div><small>Last active</small><b>${esc(ago(s.lastActive))}</b></div>
          <div><small>Tests finished</small><b>${s.tests} <span class="muted sm">(${s.tests7} this week)</span></b></div><div><small>Average band</small><b>${s.avgBand ?? '—'} ${trendChip(s.trend)}</b></div>
          <div><small>E-book units learned</small><b>${s.books.unitsDone}</b></div><div><small>Right answers in e-books</small><b>${s.books.accuracy == null ? '—' : s.books.accuracy + '%'}</b></div></div>
        <div class="box"><h4>Group</h4><div class="btn-row"><input class="field" id="dr-group" list="dl-groups" value="${esc(s.group)}" maxlength="40" placeholder="No group" style="flex:1 1 200px"><button class="btn btn-sm btn-primary" data-save-group="${esc(s.id)}" type="button">Save group</button></div>${groups.length ? `<div class="tp-chips">${groups.map((g) => `<button class="tp-chip" type="button" data-pick-group="${esc(g)}">${esc(g)}</button>`).join('')}</div>` : ''}</div>
        <div class="box"><h4>Bands by section</h4><div class="hbars">${SEC.map(([n, c]) => { const x = s.bySection[n] || {}; return `<div style="--k:${c}"><div class="hbar-top"><span>${n}</span><span><b>${x.band != null ? esc(Number(x.band).toFixed(1)) : '—'}</b><em>${x.count || 0} test${x.count === 1 ? '' : 's'}${x.last != null ? ' · last ' + esc(Number(x.last).toFixed(1)) : ''}</em></span></div><div class="hbar"><i style="width:${x.band ? Math.round((x.band / 9) * 100) : 0}%"></i></div></div>`; }).join('')}</div></div>
        <div class="box"><h4>E-books</h4>${s.books.list.length ? s.books.list.map((b) => `<div class="tp-bk">
            <div class="tp-bk-top"><strong>${esc(b.title)}</strong><span class="muted sm">${b.done} of ${b.total} units · ${b.left} left${b.accuracy != null ? ' · ' + b.accuracy + '% right' : ''} · ${esc(ago(b.lastAt))}</span></div>
            <div class="tp-pct"><b>${b.percent}%</b>${bar(b.percent)}</div>
            <ol class="tp-units">${(b.units || []).map((u) => `<li class="${u.done ? 'done' : u.started ? 'started' : ''}" title="${esc(u.title)}"><span class="tp-u-dot">${u.done ? icon('check') : ''}</span><span class="tp-u-t">${esc(u.title)}</span><span class="muted sm">${esc(KIND[u.kind] || '')}${u.exercises ? ` · ${u.attempts ? u.best + '/' + u.total : '—'}` : ''}</span></li>`).join('')}</ol></div>`).join('') : '<div class="muted">Has not opened an e-book yet.</div>'}</div>
        <div class="box"><h4>Test history</h4>${d.results.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Test</th><th>Section</th><th class="right">Score</th><th>Band</th><th>When</th></tr></thead><tbody>${d.results.slice(0, 60).map((r) => `<tr><td>${esc(r.pageLabel)}</td><td>${esc(r.section)}</td><td class="right nowrap">${r.scoreCorrect}/${r.scoreTotal}</td><td>${band(r.band)}</td><td class="nowrap">${esc(fmtDateTime(r.createdAt))}</td></tr>`).join('')}</tbody></table></div>` : '<div class="muted">No finished tests yet.</div>'}</div>
        <div class="box danger"><h4>Class</h4><p class="muted sm" style="margin:0 0 8px">Taking ${esc(s.name)} out of your class keeps their account and results; you just stop seeing them.</p><button class="btn btn-sm btn-danger" data-remove="${esc(s.id)}" type="button">Remove from my class</button></div>`;
    } catch (e) { fail(e); if (!silent) closeDrawer(); }
  }
  function closeDrawer() { $('#drawer-backdrop').classList.remove('open'); document.body.style.overflow = ''; openId = null; }

  /* ───────── books progress ───────── */
  function renderBooks() {
    const m = $('#books-body');
    if (!books) { m.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
    if (!books.books.length) { m.innerHTML = '<div class="card"><div class="empty">No e-book has units yet. The administrator adds them in Admin → E-books.</div></div>'; return; }
    const total = books.students.length;
    m.innerHTML = books.books.map((b) => {
      const open = openBook === b.id;
      const list = b.students.slice().sort((x, y) => y.percent - x.percent || x.name.localeCompare(y.name));
      return `<div class="card tp-book${open ? ' open' : ''}">
        <div class="tp-book-head">
          <div class="tp-cover">${b.cover ? `<img src="${esc(b.cover)}" alt="" loading="lazy">` : icon('book')}</div>
          <div class="tp-book-main"><div class="pd-title"><strong>${esc(b.title)}</strong>${b.level ? `<span class="badge">${esc(b.level)}</span>` : ''}${b.published ? '' : '<span class="badge">Hidden</span>'}</div>
            <div class="muted sm">${b.units.length} unit${b.units.length === 1 ? '' : 's'}${b.author ? ' · ' + esc(b.author) : ''}</div>
            <div class="tp-book-stats"><span><b>${b.started}</b> of ${total} started</span><span><b>${b.completed}</b> finished</span><span><b>${b.avgPercent}%</b> average</span></div>
            ${bar(b.avgPercent, 'var(--c4)')}</div>
          <button class="btn btn-sm" data-book="${esc(b.id)}" type="button">${open ? 'Hide students' : 'Show students'}</button>
        </div>
        ${open ? `<div class="table-wrap" style="margin-top:14px"><table class="table"><thead><tr><th>Student</th><th>Group</th><th style="min-width:180px">Learned</th><th class="right">Units</th><th>Right answers</th><th>Last</th><th></th></tr></thead><tbody>
          ${list.map((s) => `<tr><td><strong>${esc(s.name)}</strong></td><td>${s.group ? `<span class="badge">${esc(s.group)}</span>` : '<span class="muted sm">—</span>'}</td>
            <td>${s.started ? `<div class="tp-pct"><b>${s.percent}%</b>${bar(s.percent)}</div>` : '<span class="muted sm">not started</span>'}</td>
            <td class="right nowrap">${s.done} / ${b.units.length}</td><td>${s.accuracy == null ? '<span class="muted">—</span>' : s.accuracy + '%'}</td><td class="nowrap">${esc(s.lastAt ? ago(s.lastAt) : '—')}</td>
            <td class="right"><button class="btn btn-sm" data-open="${esc(s.id)}" type="button">Open</button></td></tr>`).join('') || '<tr><td colspan="7"><div class="empty">No students in your class yet.</div></td></tr>'}
          </tbody></table></div>
          <div class="tp-unitlist"><div class="muted sm" style="margin:12px 0 6px">Units</div>${b.units.map((u, i) => `<span class="tp-chip static"><b>${i + 1}</b> ${esc(u.title)}<em>${esc(KIND[u.kind] || '')}${u.exercises ? ' · ' + u.exercises + ' ex.' : ''}</em></span>`).join('')}</div>` : ''}
      </div>`;
    }).join('');
  }

  /* ───────── add students ───────── */
  function joinLink() { return location.origin + '/join?code=' + encodeURIComponent(teacher.code); }
  function renderAdd() {
    $('#code').textContent = teacher.code; $('#join-link').value = joinLink(); $('#join-path').textContent = location.host + '/join';
    $('#invites').innerHTML = teacher.invites.length ? `<div class="muted sm" style="margin:14px 0 6px">Waiting for an answer (${teacher.invites.length})</div>` + teacher.invites.map((x) => `<div class="tp-inv"><span>${icon('mail')}<b>${esc(x.email)}</b>${x.group ? ` <span class="badge">${esc(x.group)}</span>` : ''}</span><span class="muted sm">${esc(ago(x.at))}</span><button class="btn btn-sm" data-cancel-invite="${esc(x.email)}" type="button">Cancel</button></div>`).join('') : '';
  }
  function genPw() {
    const abc = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'; const r = new Uint32Array(10); crypto.getRandomValues(r);
    return Array.from(r, (n) => abc[n % abc.length]).join('').replace(/^(.{5})/, '$1-') + (10 + (r[0] % 90));
  }
  async function copy(text, msg) { try { await navigator.clipboard.writeText(text); toast(msg || 'Copied'); } catch (e) { toast('Copy did not work: select the text and copy it yourself.', true); } }

  /* ───────── settings ───────── */
  let groupsDraft = null;
  function renderSettings() {
    if (!groupsDraft) groupsDraft = (teacher.groups || []).slice();
    if (document.activeElement !== $('#set-title')) $('#set-title').value = teacher.title || '';
    $('#set-groups').innerHTML = groupsDraft.map((g, i) => `<span class="tp-chip">${esc(g)}<button type="button" data-del-group="${i}" aria-label="Remove ${esc(g)}">✕</button></span>`).join('') || '<span class="muted sm">No groups yet. Groups help you filter your students (Morning, Evening, B2 …).</span>';
    $('#set-count').textContent = data ? data.students.length : teacher.students; $('#set-max').textContent = teacher.maxStudents;
  }

  /* ───────── events ───────── */
  async function onClick(e) {
    const t = e.target.closest('button,a,[data-close-drawer]');
    if (!t) { if (e.target === $('#drawer-backdrop')) closeDrawer(); return; }
    const ds = t.dataset;
    try {
      if (ds.open) return openStudent(ds.open);
      if (t.hasAttribute('data-close-drawer')) return closeDrawer();
      if (ds.filter) { $('#st-filter').value = ds.filter; location.hash = '#students'; return renderStudents(); }
      if (ds.book) { openBook = openBook === ds.book ? null : ds.book; return renderBooks(); }
      if (ds.pickGroup !== undefined) { $('#dr-group').value = ds.pickGroup; return; }
      if (ds.saveGroup) { const d = await post('/api/teacher/students/' + encodeURIComponent(ds.saveGroup), { group: $('#dr-group').value }); teacher.groups = d.groups; toast(d.group ? 'Group saved' : 'Group removed'); groupsDraft = null; return await load(); }
      if (ds.remove) {
        if (!confirm('Remove this student from your class? Their account and results stay.')) return;
        await api('/api/teacher/students/' + encodeURIComponent(ds.remove), { method: 'DELETE' }); closeDrawer(); toast('Removed from your class'); return await load();
      }
      if (t.hasAttribute('data-gen-pw')) { const f = $('#f-create [name="password"]'); f.value = genPw(); f.select(); return; }
      if (ds.copy) return copy(ds.copy === 'code' ? teacher.code : joinLink(), ds.copy === 'code' ? 'Code copied' : 'Link copied');
      if (ds.copyText !== undefined) return copy(t.closest('.tp-created').getAttribute('data-text'), 'Copied — send it to the student privately');
      if (ds.cancelInvite) { const d = await post('/api/teacher/invites/cancel', { email: ds.cancelInvite }); teacher.invites = d.invites; renderAdd(); renderDashboard(); return toast('Invitation cancelled'); }
      if (t.id === 'new-code') {
        if (!confirm('Make a new class code? The old link and code stop working.')) return;
        const d = await post('/api/teacher/code'); teacher = { ...teacher, ...d.teacher }; renderAdd(); return toast('New code: ' + teacher.code);
      }
      if (ds.delGroup !== undefined) { groupsDraft.splice(Number(ds.delGroup), 1); return renderSettings(); }
      if (t.id === 'set-addgroup') { const v = $('#set-newgroup').value.trim(); if (v && !groupsDraft.includes(v)) groupsDraft.push(v); $('#set-newgroup').value = ''; return renderSettings(); }
      if (t.id === 'set-save') { const d = await post('/api/teacher/settings', { title: $('#set-title').value, groups: groupsDraft }); teacher = { ...teacher, ...d.teacher }; groupsDraft = null; toast('Saved'); return await load(); }
      if (t.hasAttribute('data-logout')) { await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {}); location.href = '/login'; }
    } catch (err) { fail(err); }
  }
  function bind() {
    document.addEventListener('click', onClick);
    $('#refresh').addEventListener('click', () => { books = null; load().then(() => { if (currentView() === 'books') loadBooks(); toast('Updated'); }); });
    window.addEventListener('hashchange', () => showView(currentView()));
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(renderChart, 150); });
    let tm; const later = (fn) => () => { clearTimeout(tm); tm = setTimeout(fn, 120); };
    $('#st-search').addEventListener('input', later(() => data && renderStudents()));
    ['#st-group', '#st-filter', '#st-sort'].forEach((s) => $(s).addEventListener('change', () => data && renderStudents()));
    $('#csv').addEventListener('click', () => data && csv());
    $('#set-newgroup').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#set-addgroup').click(); } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if ($('#drawer-backdrop').classList.contains('open')) closeDrawer(); else closeMenu(); } });
    $('#f-create').addEventListener('submit', async (e) => {
      e.preventDefault(); const f = e.target; const b = f.querySelector('button[type="submit"]'); b.disabled = true;
      const v = Object.fromEntries(new FormData(f).entries());
      try {
        const d = await post('/api/teacher/students', { mode: 'create', ...v });
        const text = `IELTSX — your account\nWebsite: ${location.origin}/login\nE-mail: ${d.student.email}\nPassword: ${v.password}`;
        const box = $('#created'); box.hidden = false; box.setAttribute('data-text', text);
        box.innerHTML = `<div><strong>${esc(d.student.name)}</strong> is in your class. Send these details to the student privately:</div><pre>${esc(text)}</pre><button class="btn btn-sm btn-primary" data-copy-text type="button">${icon('copy')}Copy</button>`;
        f.reset(); toast('Account created'); await load();
      } catch (err) { fail(err); } finally { b.disabled = false; }
    });
    $('#f-invite').addEventListener('submit', async (e) => {
      e.preventDefault(); const f = e.target; const b = f.querySelector('button[type="submit"]'); b.disabled = true;
      try {
        const d = await post('/api/teacher/students', { mode: 'invite', email: f.emails.value, group: f.group.value });
        teacher.invites = d.invites; renderAdd(); renderDashboard();
        toast(d.invited.length ? `${d.invited.length} invitation${d.invited.length > 1 ? 's' : ''} sent` + (d.already.length ? ` · ${d.already.length} already in your class` : '') : 'They are already in your class');
        f.reset();
      } catch (err) { fail(err); } finally { b.disabled = false; }
    });
  }
  window.addEventListener('DOMContentLoaded', boot);
})();
