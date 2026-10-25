/* IELTSX admin panel (admin.html). Everything shown here is checked and enforced by the server. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const DAY = 86400000;
  const VIEWS = { dashboard: 'Dashboard', users: 'Users', premium: 'Premium', orders: 'Orders', activity: 'Test activity', audit: 'Activity log', reading: 'Part practice cards', readingfull: 'Reading · Full tests', packs: 'Packs (Full Tests cards)', listening: 'Listening cards', writing: 'Writing cards', speaking: 'Speaking cards', articles: 'Article cards', pdf: 'PDF materials', vocab: 'Vocabulary', access: 'Access (lock / plans)' };

  let me = null, users = [], orders = [], audit = [], results = [], stats = null, plans = [];
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
    renderAll(); btn.disabled = false;
    if (openUserId && $('#drawer-backdrop').classList.contains('open')) openUser(openUserId, true);
  }
  function renderAll() { renderDashboard(); renderUsers(); renderPremium(); renderOrders(); renderActivity(); renderAudit(); }

  /* ───────── dashboard ───────── */
  function bars(el, xEl, days, values, alt) {
    const max = Math.max(1, ...values);
    el.innerHTML = values.map((v, i) => `<div class="col" title="${esc(days[i])}: ${v}"><div class="v">${v || ''}</div><div class="bar${alt ? ' alt' : ''}" style="height:${Math.max(2, Math.round((v / max) * 100))}%"></div></div>`).join('');
    xEl.innerHTML = days.map((d, i) => `<span>${(days.length - 1 - i) % 2 === 0 || days.length < 8 ? esc(d.slice(8)) : ''}</span>`).join('');
  }
  function renderDashboard() {
    if (!stats) return;
    $('#stat-users').textContent = stats.users; $('#stat-users-sub').textContent = `+${stats.newUsers7} this week · ${stats.newUsers30} in 30 days`;
    $('#stat-premium').textContent = stats.premium; $('#stat-premium-sub').textContent = `${stats.free} free · ${stats.expiringSoon} expiring soon`;
    $('#stat-tests').textContent = stats.testsTotal; $('#stat-tests-sub').textContent = `${stats.tests7} this week` + (stats.avgBand ? ` · avg band ${stats.avgBand}` : '');
    $('#stat-revenue').innerHTML = moneyBig(stats.revenue); $('#stat-revenue-sub').textContent = `${moneyMap(stats.revenue30)} in 30 days`;
    bars($('#chart-signups'), $('#chart-signups-x'), stats.chart.days, stats.chart.signups, false);
    bars($('#chart-tests'), $('#chart-tests-x'), stats.chart.days, stats.chart.tests, true);

    const pending = orders.filter((o) => o.status === 'pending');
    const expiring = users.filter(isExpiring);
    const rows = [];
    if (pending.length) rows.push(`<div class="todo"><div><strong>${pending.length} unpaid order${pending.length > 1 ? 's' : ''}</strong><div class="muted sm">Confirm once the payment arrived.</div></div><a class="btn btn-sm btn-primary" href="#orders">Review</a></div>`);
    if (expiring.length) rows.push(`<div class="todo"><div><strong>${expiring.length} Premium plan${expiring.length > 1 ? 's' : ''} ending within 7 days</strong><div class="muted sm">${esc(expiring.slice(0, 3).map((u) => u.name).join(', '))}${expiring.length > 3 ? '…' : ''}</div></div><a class="btn btn-sm" href="#premium">Open</a></div>`);
    if (stats.blocked) rows.push(`<div class="todo"><div><strong>${stats.blocked} suspended account${stats.blocked > 1 ? 's' : ''}</strong></div><button class="btn btn-sm" data-filter-users="blocked" type="button">Show</button></div>`);
    $('#attention').innerHTML = rows.join('') || '<div class="empty">Everything is in order ✓</div>';

    const members = stats.users - stats.admins; const sec = stats.bySection || {};
    const seg = [['Premium', stats.premium, '#b54708'], ['Free', stats.free, '#98a2b3'], ['Admins', stats.admins, '#175cd3']];
    const total = Math.max(1, stats.users);
    $('#audience').innerHTML = `<div class="meter">${seg.map(([n, v, c]) => `<i style="width:${(v / total) * 100}%;background:${c}" title="${n}: ${v}"></i>`).join('')}</div>
      <div class="legend">${seg.map(([n, v, c]) => `<span><b style="background:${c}"></b>${n} ${v}</span>`).join('')}</div>
      <div class="kv" style="margin-top:16px"><div><small>E-mail verified</small><b>${stats.verified} of ${stats.users}</b></div><div><small>Conversion to Premium</small><b>${members ? Math.round((stats.premium / members) * 100) : 0}%</b></div>
      <div><small>Reading tests</small><b>${sec.Reading || 0}</b></div><div><small>Listening tests</small><b>${sec.Listening || 0}</b></div>
      <div><small>Reading materials added</small><b>${stats.reading}</b></div><div><small>Listening materials added</small><b>${stats.listening}</b></div></div>`;
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
      `<tr><td><strong>${esc(o.ref)}</strong></td><td>${esc(o.userEmail)}</td><td>${esc(o.planName)} · ${o.months} mo</td><td class="nowrap">${money(o.amount, o.currency)}</td>` +
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
  const ACTIONS = { 'premium.grant': 'Premium given', 'premium.revoke': 'Premium revoked', 'role.admin': 'Made admin', 'role.user': 'Admin removed', 'user.delete': 'Account deleted', 'user.block': 'Suspended', 'user.unblock': 'Unsuspended', 'user.note': 'Note edited', 'user.logout_all': 'Signed out everywhere', 'order.approve': 'Payment confirmed', 'order.reject': 'Order rejected', 'order.paid': 'Order paid (webhook)', 'material.add': 'Material added', 'material.edit': 'Material edited', 'material.delete': 'Material deleted', upload: 'File uploaded', 'users.export': 'Users exported' };
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
        `<div class="box"><h4>Private note (only admins see it)</h4><textarea class="field" id="user-note" maxlength="500" placeholder="e.g. paid in cash on 12 Oct, Telegram @name">${esc(u.note)}</textarea><div class="btn-row" style="margin-top:8px"><button class="btn btn-sm" data-save-note="${esc(u.id)}" type="button">Save note</button></div></div>` +
        `<div class="box"><h4>Test history</h4>${testTable(d.results)}</div>` +
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

