/*
 * IELTSX — Predictions page (Predictions.html). The collections are made in the admin panel (admin.html#predictions)
 * and come from /api/predictions; the server decides what a visitor may open (a locked collection arrives without its
 * questions or links). Students tick what they have practised: the ticks stay on this device (localStorage).
 * The page has the look of the other pages of the website (the Part Practice pages): a title with its icon, one filter
 * card, "Showing …", and cards with a picture on top.
 *   /Predictions            every published collection, filter by skill, search
 *   /Predictions#<id>       one collection: its tests and questions, grouped by part, with the day and the place each
 *                           one came up in the real exam (filter by place and month)
 */
(function () {
  'use strict';
  var root = document.getElementById('pred-root');
  if (!root) return;

  var SK = {
    reading: { name: 'Reading', unit: 'test', icon: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>' },
    listening: { name: 'Listening', unit: 'test', icon: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>' },
    writing: { name: 'Writing', unit: 'task', icon: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>' },
    speaking: { name: 'Speaking', unit: 'question', icon: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>' }
  };
  var IC = {
    crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    cal: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    note: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
  };
  var svg = function (p, cls) { return '<svg class="' + (cls || 'i') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var PLAN = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  var plural = function (n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); };
  var fmtDate = function (v) { try { return new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; } };
  var fmtDay = function (v) { if (!v) return ''; var d = new Date(v + 'T00:00:00'); return isNaN(d) ? v : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  var monthKey = function (v) { return v ? v.slice(0, 7) : ''; };
  var fmtMonth = function (k) { var d = new Date(k + '-01T00:00:00'); return isNaN(d) ? k : d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); };

  var data = null, skill = '', query = '', onlyHot = false, partFilter = '', placeFilter = '', monthFilter = '', sortBy = 'order';
  var detailCache = {};

  /* what this device has practised */
  var DONE_KEY = 'ix-pred-done:';
  function doneSet(id) { try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY + id) || '[]')); } catch (e) { return new Set(); } }
  function saveDone(id, set) { try { localStorage.setItem(DONE_KEY + id, JSON.stringify(Array.from(set))); } catch (e) { /* private mode */ } }

  function getJson(url) {
    return fetch(url, { credentials: 'same-origin', cache: 'no-store', headers: { accept: 'application/json' } }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (d) {
        if (d === null) { var e = new Error('The website server is not reachable. Please try again in a moment.'); e.status = r.status; throw e; }
        if (!r.ok) { var err = new Error(d.error || 'Something went wrong.'); err.status = r.status; err.data = d; throw err; }
        return d;
      });
    });
  }

  /* ───────── list ───────── */
  function sizeText(c) {
    var p = [];
    if (c.tests) p.push(plural(c.tests, 'test'));
    if (c.questions) p.push(plural(c.questions, (SK[c.skill] || {}).unit === 'task' ? 'task' : 'question'));
    return p.join(' · ');
  }
  function planBadge(c) {
    return c.plan === 'free' ? '<span class="pdp-pill free">Free</span>' : '<span class="pdp-pill plan">' + svg(IC.crown) + esc(PLAN[c.plan] || c.plan) + '</span>';
  }
  function cardHtml(c) {
    var s = SK[c.skill] || SK.reading;
    var done = c.locked ? 0 : Math.min(c.count, doneSet(c.id).size);
    var pct = c.count ? Math.round((done / c.count) * 100) : 0;
    var btn;
    if (!c.count) btn = '<span class="pdp-btn soon">' + svg(IC.clock) + 'Coming soon</span>';
    else if (c.locked) btn = '<a class="pdp-btn get" href="' + (data.signedIn ? '/Price?premium=required&plan=' + encodeURIComponent(c.plan) + '&next=' + encodeURIComponent('/Predictions#' + c.id) : '/login?next=' + encodeURIComponent('/Predictions#' + c.id)) + '">' + svg(IC.crown) + (data.signedIn ? 'Get Access' : 'Sign in to open') + '</a>';
    else btn = '<a class="pdp-btn open" href="#' + esc(c.id) + '">' + (done ? 'Continue' : 'Open') + svg(IC.arrow) + '</a>';
    var where = (c.places || []).slice(0, 3).join(', ');
    return '<article class="pdp-card">' +
      '<div class="pdp-media pdp-m-' + esc(c.skill) + '">' +
        '<div class="pdp-media-in">' + svg(s.icon, 'pdp-media-ic') + '<span>' + esc(c.period || s.name) + '</span></div>' +
        '<div class="pdp-tl">' + planBadge(c) + '</div>' +
        '<div class="pdp-tr"><span class="pdp-pill dark">' + (c.status === 'complete' ? 'Complete' : 'Updating') + '</span></div>' +
        (c.locked && c.count ? '<div class="pdp-media-lock">' + svg(IC.lock) + '</div>' : '') +
      '</div>' +
      '<div class="pdp-body">' +
        '<h3 title="' + esc(c.title) + '">' + esc(c.title) + '</h3>' +
        '<div class="pdp-line">' + svg(s.icon) + '<span>' + s.name + ' · ' + (c.count ? esc(sizeText(c)) : 'Being prepared') + '</span></div>' +
        (c.lastSeen || where ? '<div class="pdp-line">' + svg(c.lastSeen ? IC.cal : IC.pin) + '<span>' + (c.lastSeen ? 'Last seen ' + esc(fmtDay(c.lastSeen)) : '') + (c.lastSeen && where ? ' · ' : '') + esc(where) + '</span></div>' : '') +
        '<div class="pdp-chips">' + (c.hot ? '<span class="pdp-chip hot">' + svg(IC.flame) + c.hot + ' very likely</span>' : '') +
          (c.parts || []).slice(0, 3).map(function (p) { return '<span class="pdp-chip">' + esc(p) + '</span>'; }).join('') +
          ((c.parts || []).length > 3 ? '<span class="pdp-chip muted">+' + (c.parts.length - 3) + ' more</span>' : '') + '</div>' +
        (!c.locked && c.count ? '<div class="pdp-progress"><div class="pdp-progress-top"><span>Your progress</span><b>' + done + ' / ' + c.count + '</b></div><div class="pdp-bar"><i style="width:' + pct + '%"></i></div></div>' : '') +
        '<div class="pdp-foot">' + btn + '</div>' +
      '</div></article>';
  }
  function statCard(label, value, icon, cls) {
    return '<div class="pdp-stat ' + (cls || '') + '"><div><div class="pdp-stat-label">' + label + '</div><div class="pdp-stat-value">' + value + '</div></div><span class="pdp-stat-ic">' + svg(icon) + '</span></div>';
  }
  function renderList() {
    if (!data) {
      root.innerHTML = '<div class="pdp">' + pageHead() + '<div class="pdp-grid">' + (window.IELTSX && IELTSX.skeletonCards ? IELTSX.skeletonCards(3) : '<div class="pdp-skel"></div><div class="pdp-skel"></div><div class="pdp-skel"></div>') + '</div></div>';
      return;
    }
    var all = data.collections || [];
    var shown = all.filter(function (c) { return (!skill || c.skill === skill) && (!query || (c.title + ' ' + c.period + ' ' + c.description + ' ' + (c.places || []).join(' ')).toLowerCase().indexOf(query) >= 0); });
    if (sortBy === 'recent') shown = shown.slice().sort(function (a, b) { return String(b.lastSeen || b.updatedAt || '').localeCompare(String(a.lastSeen || a.updatedAt || '')); });
    var tests = 0, qs = 0, hot = 0; all.forEach(function (c) { tests += c.tests || 0; qs += c.questions || 0; hot += c.hot || 0; });
    var tab = function (v, n) {
      var cnt = v ? all.filter(function (c) { return c.skill === v; }).length : all.length;
      return '<button class="pdp-tab' + (skill === v ? ' on' : '') + '" data-skill="' + v + '" type="button">' + n + '<span class="n">' + cnt + '</span></button>';
    };
    root.innerHTML = '<div class="pdp">' + pageHead() +
      '<div class="pdp-stats">' + statCard('Collections', all.length, IC.layers) + statCard('Tests', tests, IC.list) + statCard('Questions &amp; tasks', qs, IC.note) + statCard('Very likely', hot, IC.flame, 'hot') + '</div>' +
      '<div class="pdp-filter">' +
        '<form class="pdp-searchrow" data-search-form><label class="pdp-search">' + svg(IC.search) + '<input type="search" placeholder="Search predictions, months or places…" aria-label="Search predictions" value="' + esc(query) + '"></label><button class="pdp-btn primary" type="submit">' + svg(IC.search) + 'Search</button></form>' +
        '<div class="pdp-filterrow"><div class="pdp-tabs" role="tablist">' + tab('', 'All') + tab('reading', 'Reading') + tab('listening', 'Listening') + tab('writing', 'Writing') + tab('speaking', 'Speaking') + '</div>' +
          '<label class="pdp-select">Sort<select data-sort><option value="order"' + (sortBy === 'order' ? ' selected' : '') + '>Recommended</option><option value="recent"' + (sortBy === 'recent' ? ' selected' : '') + '>Most recent exam</option></select></label></div>' +
      '</div>' +
      '<div class="pdp-count">Showing ' + shown.length + ' of ' + plural(all.length, 'collection') + '</div>' +
      (shown.length ? '<div class="pdp-grid">' + shown.map(cardHtml).join('') + '</div>'
        : '<div class="pdp-empty"><strong>' + (all.length ? 'Nothing matches' : 'Predictions are on the way') + '</strong>' + (all.length ? 'Try another skill or search word.' : 'New collections appear here as soon as they are ready.') + '</div>') +
      '</div>';
  }
  function pageHead() {
    var planName = data ? (PLAN[data.plan] || 'Free') : '';
    var last = data ? (data.collections || []).reduce(function (m, c) { return c.updatedAt && (!m || c.updatedAt > m) ? c.updatedAt : m; }, '') : '';
    var side = !data ? '' : data.signedIn
      ? '<div class="pdp-me"><span>Your plan</span><b>' + esc(planName) + '</b>' + (data.level >= 2 ? '' : '<a class="pdp-btn get sm" href="/Price?next=%2FPredictions">' + svg(IC.crown) + 'Upgrade</a>') + '</div>'
      : '<div class="pdp-me"><span>Not signed in</span><a class="pdp-btn primary sm" href="/login?next=%2FPredictions">Sign in</a></div>';
    return '<header class="pdp-head"><div class="pdp-title"><span class="pdp-title-ic">' + svg(IC.flame) + '</span><div><h1>Exam Predictions</h1>' +
      '<p>Questions and tests that keep coming up in the real IELTS exam — with the day and the place they were seen.' + (last ? ' Updated ' + esc(fmtDate(last)) + '.' : '') + '</p></div></div>' + side + '</header>';
  }

  /* ───────── one collection ───────── */
  function metaChips(it) {
    var out = [];
    if (it.date) out.push('<span class="pdp-meta-chip">' + svg(IC.cal) + esc(fmtDay(it.date)) + '</span>');
    if (it.place) out.push('<span class="pdp-meta-chip">' + svg(IC.pin) + esc(it.place) + '</span>');
    if (it.module) out.push('<span class="pdp-meta-chip">' + (it.module === 'academic' ? 'Academic' : 'General Training') + '</span>');
    if (it.format) out.push('<span class="pdp-meta-chip">' + svg(IC.monitor) + (it.format === 'computer' ? 'Computer test' : 'Paper test') + '</span>');
    if (it.seen) out.push('<span class="pdp-meta-chip">' + svg(IC.users) + 'Reported ' + it.seen + '×</span>');
    return out.length || it.note ? '<div class="pdp-meta-row">' + out.join('') + (it.note ? '<span class="pdp-note">' + esc(it.note) + '</span>' : '') + '</div>' : '';
  }
  function itemHtml(c, it, n, done, grouped) {
    var isDone = done.has(it.id);
    var head = '<div class="pdp-item-head"><span class="pdp-num-tag">' + (n + 1) + '</span>' + (it.part && !grouped ? '<span class="pdp-part">' + esc(it.part) + '</span>' : '') + (it.hot ? '<span class="pdp-hot">' + svg(IC.flame) + 'Very likely</span>' : '') + '</div>';
    var body = it.kind === 'test'
      ? '<div class="pdp-item-title">' + esc(it.title) + '</div>'
      : (it.title && it.text && it.text.indexOf(it.title) !== 0 ? '<div class="pdp-item-title">' + esc(it.title) + '</div>' : '') + '<p class="pdp-q">' + esc(it.text || it.title) + '</p>' + (it.image ? '<img class="pdp-q-img" src="' + esc(it.image) + '" alt="" loading="lazy">' : '');
    var go = it.kind === 'test' && it.href ? '<a class="pdp-btn open" href="' + esc(it.href) + '">Start' + svg(IC.arrow) + '</a>' : '';
    return '<li class="pdp-item' + (it.hot ? ' is-hot' : '') + (isDone ? ' is-done' : '') + '" data-id="' + esc(it.id) + '">' +
      '<label class="pdp-check" title="Mark as practised"><input type="checkbox" data-done="' + esc(it.id) + '"' + (isDone ? ' checked' : '') + ' aria-label="Practised"><span>' + svg(IC.check) + '</span></label>' +
      '<div class="pdp-item-main">' + head + body + metaChips(it) + '</div>' + go + '</li>';
  }
  function backBtn() { return '<button class="pdp-back" data-back type="button">' + svg(IC.back) + 'All predictions</button>'; }
  function renderDetail(id) {
    var entry = detailCache[id];
    var s0 = data && (data.collections || []).find(function (c) { return c.id === id; });
    if (!entry) {
      root.innerHTML = '<div class="pdp">' + backBtn() + '<div class="pdp-skel" style="height:180px"></div></div>';
      getJson('/api/predictions/' + encodeURIComponent(id)).then(function (d) { detailCache[id] = { c: d.collection }; if (location.hash.slice(1) === id) renderDetail(id); })
        .catch(function (e) { detailCache[id] = { c: (e.data && e.data.collection) || s0 || null, locked: e.status === 403, error: e.message, price: e.data && e.data.price, signedIn: e.data && e.data.signedIn }; if (location.hash.slice(1) === id) renderDetail(id); });
      return;
    }
    var c = entry.c;
    if (!c) { root.innerHTML = '<div class="pdp">' + backBtn() + '<div class="pdp-empty"><strong>This collection is not available</strong>' + esc(entry.error || 'It may have been removed.') + '</div></div>'; return; }
    var s = SK[c.skill] || SK.reading;
    var head = backBtn() +
      '<header class="pdp-dhead"><div class="pdp-dmedia pdp-m-' + esc(c.skill) + '">' + svg(s.icon, 'pdp-media-ic') + '</div><div class="pdp-dmain">' +
        '<div class="pdp-pills">' + planBadge(c) + '<span class="pdp-pill ' + (c.status === 'complete' ? 'ok' : 'upd') + '">' + (c.status === 'complete' ? 'Complete' : 'Updating') + '</span><span class="pdp-pill soft">' + s.name + (c.period ? ' · ' + esc(c.period) : '') + '</span></div>' +
        '<h1>' + esc(c.title) + '</h1>' + (c.description ? '<p>' + esc(c.description) + '</p>' : '') +
        '<div class="pdp-dmeta"><span>' + svg(IC.list) + (c.count ? esc(sizeText(c)) : 'Being prepared') + '</span>' + (c.hot ? '<span class="hot">' + svg(IC.flame) + c.hot + ' very likely</span>' : '') +
          (c.lastSeen ? '<span>' + svg(IC.cal) + 'Seen ' + (c.firstSeen && c.firstSeen !== c.lastSeen ? esc(fmtDay(c.firstSeen)) + ' – ' : '') + esc(fmtDay(c.lastSeen)) + '</span>' : '') +
          ((c.places || []).length ? '<span>' + svg(IC.pin) + esc(c.places.slice(0, 4).join(', ')) + '</span>' : '') +
          (c.updatedAt ? '<span>' + svg(IC.clock) + 'Updated ' + esc(fmtDate(c.updatedAt)) + '</span>' : '') + '</div>' +
        '<div id="pdp-prog"></div></div></header>';
    if (entry.locked || !c.items) {
      var signed = entry.signedIn !== undefined ? entry.signedIn : data && data.signedIn;
      var price = entry.price || '/Price?next=' + encodeURIComponent('/Predictions#' + c.id);
      root.innerHTML = '<div class="pdp">' + head + '<div class="pdp-locked"><div class="big">' + svg(IC.lock) + '</div><h2>' + (signed ? 'Unlock this collection' : 'Sign in to open it') + '</h2>' +
        '<p>' + (c.count ? esc(sizeText(c)) + ' are waiting inside. ' : '') + (signed ? 'It is part of the ' + esc(PLAN[c.plan] || c.plan) + ' plan.' : 'Sign in, then choose a plan that includes ' + esc(PLAN[c.plan] || c.plan) + ' predictions.') + '</p>' +
        '<a class="pdp-btn get" href="' + esc(signed ? price : '/login?next=' + encodeURIComponent('/Predictions#' + c.id)) + '">' + svg(IC.crown) + (signed ? 'Get Access' : 'Sign in') + '</a></div></div>';
      return;
    }
    var done = doneSet(c.id);
    var parts = [], places = [], months = [];
    c.items.forEach(function (it) {
      if (it.part && parts.indexOf(it.part) < 0) parts.push(it.part);
      if (it.place && places.indexOf(it.place) < 0) places.push(it.place);
      var mk = monthKey(it.date); if (mk && months.indexOf(mk) < 0) months.push(mk);
    });
    months.sort().reverse(); places.sort();
    if (partFilter && parts.indexOf(partFilter) < 0) partFilter = '';
    if (placeFilter && places.indexOf(placeFilter) < 0) placeFilter = '';
    if (monthFilter && months.indexOf(monthFilter) < 0) monthFilter = '';
    var list = c.items.map(function (it, n) { return { it: it, n: n }; }).filter(function (x) {
      return (!onlyHot || x.it.hot) && (!partFilter || x.it.part === partFilter) && (!placeFilter || x.it.place === placeFilter) && (!monthFilter || monthKey(x.it.date) === monthFilter);
    });
    var byDate = sortBy === 'recent';
    if (byDate) list.sort(function (a, b) { return String(b.it.date || '').localeCompare(String(a.it.date || '')) || a.n - b.n; });
    var chips = parts.length > 1 ? '<div class="pdp-tabs">' + '<button class="pdp-tab' + (!partFilter ? ' on' : '') + '" data-part="" type="button">All parts</button>' + parts.map(function (p) { return '<button class="pdp-tab' + (partFilter === p ? ' on' : '') + '" data-part="' + esc(p) + '" type="button">' + esc(p) + '<span class="n">' + c.items.filter(function (i) { return i.part === p; }).length + '</span></button>'; }).join('') + '</div>' : '';
    var selects = (places.length ? '<label class="pdp-select">' + svg(IC.pin) + '<select data-place><option value="">Every place</option>' + places.map(function (p) { return '<option value="' + esc(p) + '"' + (placeFilter === p ? ' selected' : '') + '>' + esc(p) + '</option>'; }).join('') + '</select></label>' : '') +
      (months.length ? '<label class="pdp-select">' + svg(IC.cal) + '<select data-month><option value="">Every month</option>' + months.map(function (m) { return '<option value="' + m + '"' + (monthFilter === m ? ' selected' : '') + '>' + esc(fmtMonth(m)) + '</option>'; }).join('') + '</select></label>' : '') +
      (months.length ? '<label class="pdp-select">Sort<select data-sort><option value="order"' + (!byDate ? ' selected' : '') + '>By part</option><option value="recent"' + (byDate ? ' selected' : '') + '>Newest exam first</option></select></label>' : '') +
      (c.hot ? '<label class="pdp-switch"><input type="checkbox" data-hot' + (onlyHot ? ' checked' : '') + '>' + svg(IC.flame) + 'Only very likely</label>' : '');
    var body = '';
    if (!c.items.length) body = '<div class="pdp-empty"><strong>Questions are being added</strong>Come back soon: this collection is updated as new exam reports arrive.</div>';
    else if (!list.length) body = '<div class="pdp-empty"><strong>Nothing here</strong>No item matches these filters.</div>';
    else {
      var grouped = !partFilter && !byDate && parts.length > 1;
      var lastPart = null; var html = '';
      list.forEach(function (x) {
        if (grouped && x.it.part !== lastPart) { if (lastPart !== null) html += '</ol>'; html += '<div class="pdp-group">' + esc(x.it.part || 'Other') + '</div><ol class="pdp-items">'; lastPart = x.it.part; }
        else if (lastPart === null) { html += '<ol class="pdp-items">'; lastPart = x.it.part || ''; }
        html += itemHtml(c, x.it, x.n, done, grouped);
      });
      body = html + '</ol>';
    }
    root.innerHTML = '<div class="pdp">' + head +
      (chips || selects ? '<div class="pdp-filter pdp-dfilter">' + chips + (selects ? '<div class="pdp-filterrow">' + selects + '</div>' : '') + '</div>' : '') +
      (c.items.length ? '<div class="pdp-count">Showing ' + list.length + ' of ' + c.items.length + '</div>' : '') +
      body + '</div>';
    paintProgress(c);
  }
  function paintProgress(c) {
    var box = document.getElementById('pdp-prog'); if (!box || !c.items) return;
    var done = doneSet(c.id), n = c.items.filter(function (i) { return done.has(i.id); }).length, pct = c.items.length ? Math.round((n / c.items.length) * 100) : 0;
    box.innerHTML = c.items.length ? '<div class="pdp-progress"><div class="pdp-progress-top"><span>' + (n === c.items.length ? 'All practised — well done!' : 'Your progress') + '</span><b>' + n + ' / ' + c.items.length + ' · ' + pct + '%</b></div><div class="pdp-bar"><i style="width:' + pct + '%"></i></div></div>' : '';
  }

  /* ───────── routing, events ───────── */
  function route() {
    var id = decodeURIComponent((location.hash || '').slice(1));
    if (id && /^[a-z0-9-]{4,41}$/i.test(id)) { renderDetail(id); window.scrollTo(0, 0); }
    else renderList();
  }
  function resetDetailFilters() { partFilter = ''; onlyHot = false; placeFilter = ''; monthFilter = ''; }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('button,a'); if (!t) return;
    if (t.hasAttribute('data-back')) {
      e.preventDefault();
      if (openedFromList) history.back();   // the list is the page before: keep the browser's Back button in step
      else { history.pushState(null, '', location.pathname + location.search); resetDetailFilters(); route(); }
      return;
    }
    if (t.hasAttribute('data-skill')) { skill = t.getAttribute('data-skill'); renderList(); return; }
    if (t.hasAttribute('data-part')) { partFilter = t.getAttribute('data-part'); route(); }
  });
  root.addEventListener('submit', function (e) {
    if (!e.target.hasAttribute('data-search-form')) return;
    e.preventDefault(); var inp = e.target.querySelector('input'); query = inp ? inp.value.trim().toLowerCase() : ''; renderList();
  });
  root.addEventListener('change', function (e) {
    var el = e.target;
    if (el.hasAttribute('data-hot')) { onlyHot = el.checked; route(); return; }
    if (el.hasAttribute('data-place')) { placeFilter = el.value; route(); return; }
    if (el.hasAttribute('data-month')) { monthFilter = el.value; route(); return; }
    if (el.hasAttribute('data-sort')) { sortBy = el.value; route(); return; }
    var id = el.getAttribute('data-done'); if (!id) return;
    var cid = decodeURIComponent(location.hash.slice(1)); var set = doneSet(cid);
    if (el.checked) set.add(id); else set.delete(id);
    saveDone(cid, set);
    var li = el.closest('.pdp-item'); if (li) li.classList.toggle('is-done', el.checked);
    var entry = detailCache[cid]; if (entry && entry.c) paintProgress(entry.c);
  });
  root.addEventListener('input', function (e) {
    if (!e.target.closest('.pdp-search')) return;
    query = e.target.value.trim().toLowerCase();
    clearTimeout(route.t); route.t = setTimeout(function () { renderList(); var s = root.querySelector('.pdp-search input'); if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); } }, 180);
  });
  var openedFromList = false, onList = !location.hash;
  window.addEventListener('hashchange', function () { openedFromList = onList; onList = !location.hash || location.hash === '#'; resetDetailFilters(); route(); });
  window.addEventListener('popstate', function () { onList = !location.hash || location.hash === '#'; });

  route();
  getJson('/api/predictions').then(function (d) { data = d; route(); }).catch(function (e) {
    root.innerHTML = '<div class="pdp">' + pageHead() + '<div class="pdp-empty"><strong>Could not load the predictions</strong>' + esc(e.message) + ' <br><br><a class="pdp-btn ghost" href="/Predictions">Try again</a></div></div>';
  });
})();
