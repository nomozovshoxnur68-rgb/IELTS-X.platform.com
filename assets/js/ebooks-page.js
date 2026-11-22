/*
 * IELTSX — the Books page as an e-book reader (books.html, <main id="panel-root" data-panel="books">). The books are made
 * in Admin → Books, their units in Admin → E-books; everything comes from /api/ebooks (ebooks.js), which decides what a
 * visitor may open (a locked book arrives without its file or units) and checks the exercises (the answers reach the page
 * only after "Check answers"). The progress is kept on the account, so the teacher sees it too.
 *   /books                    every book: the progress of each, "Continue where you stopped"
 *   /books#<book>             one book: how much is learned, what is left, its units
 *   /books#<book>/<unit>      one unit: the text, the recording, the test, the exercises; previous / next unit
 * The look is the Predictions / Grammar pages' (predictions.css, panels.css) plus assets/css/ebooks.css.
 */
(function () {
  'use strict';
  var root = document.getElementById('panel-root');
  if (!root || root.getAttribute('data-panel') !== 'books') return;

  var IC = {
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>', headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'
  };
  var KIND = { lesson: ['Lesson', '#2563eb'], reading: ['Reading', '#16a34a'], listening: ['Listening', '#0891b2'], vocabulary: ['Vocabulary', '#d97706'], grammar: ['Grammar', '#7c3aed'], writing: ['Writing', '#4f46e5'], speaking: ['Speaking', '#e11d48'], test: ['Test', '#ea580c'], review: ['Review', '#64748b'] };
  var PLAN = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  var svg = function (p, cls) { return '<svg class="' + (cls || 'i') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var plural = function (n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); };
  var safeHref = function (u) { u = String(u || ''); return /^(https:\/\/|\/(?!\/))/i.test(u) ? u : ''; };
  var list = null, query = '', cat = '', level = '', bookCache = {}, unitCache = {};

  function call(method, url, body) {
    return fetch(url, { method: method, credentials: 'same-origin', cache: 'no-store', headers: body ? { 'content-type': 'application/json', accept: 'application/json' } : { accept: 'application/json' }, body: body ? JSON.stringify(body) : undefined }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (d) {
        if (d === null) { var e = new Error('The website server is not reachable. Please try again in a moment.'); e.status = r.status; throw e; }
        if (!r.ok) { var err = new Error(d.error || 'Something went wrong.'); err.status = r.status; err.data = d; throw err; }
        return d;
      });
    });
  }
  var signInHref = function () { return '/login?next=' + encodeURIComponent(location.pathname + location.hash); };
  function planBadge(it) { return it.plan === 'free' ? '<span class="pdp-pill free">Free</span>' : '<span class="pdp-pill plan">' + svg(IC.crown) + esc(PLAN[it.plan] || it.plan) + '</span>'; }
  function lockedBtn(it, signedIn) {
    if (!signedIn) return '<a class="pdp-btn get" href="' + esc(signInHref()) + '">' + svg(IC.lock) + 'Sign in to open</a>';
    return '<a class="pdp-btn get" href="/Price?premium=required&plan=' + encodeURIComponent(it.plan) + '&next=' + encodeURIComponent('/books#' + it.id) + '">' + svg(IC.crown) + 'Get ' + esc(PLAN[it.plan]) + '</a>';
  }
  function progressBar(p, label) {
    return '<div class="pdp-progress"><div class="pdp-progress-top"><span>' + label + '</span><b>' + p + '%</b></div><div class="pdp-bar"><i style="width:' + Math.max(0, Math.min(100, p)) + '%"></i></div></div>';
  }
  function kindChip(k) { var x = KIND[k] || KIND.lesson; return '<span class="eb-kind" style="--k:' + x[1] + '">' + esc(x[0]) + '</span>'; }
  function cover(b, cls) {
    var c = safeHref(b.cover);
    return c ? '<img class="' + (cls || 'pnl-cover') + '" src="' + esc(c) + '" alt="" loading="lazy">' : '<div class="pdp-media-in">' + svg(IC.book, 'pdp-media-ic') + '<span>' + esc(b.title) + '</span></div>';
  }

  /* ───────── the text of a unit (the Grammar page's formatting) ───────── */
  function inline(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/==([^=]+)==/g, '<mark>$1</mark>');
  }
  function markup(src) {
    var lines = String(src || '').replace(/\r/g, '').split('\n'); var out = []; var i = 0;
    while (i < lines.length) {
      var t = lines[i].trim(), m;
      if (!t) { i++; continue; }
      if ((m = /^(#{2,3})\s+(.*)$/.exec(t))) { out.push(m[1].length === 2 ? '<h2>' + inline(m[2]) + '</h2>' : '<h3>' + inline(m[2]) + '</h3>'); i++; continue; }
      if (/^\|/.test(t)) {
        var rows = []; while (i < lines.length && /^\|/.test(lines[i].trim())) { var r = lines[i].trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }); if (!r.every(function (c) { return /^:?-{2,}:?$/.test(c); })) rows.push(r); i++; }
        out.push('<div class="pnl-table-wrap"><table class="pnl-table">' + rows.map(function (r, n) { var tag = n ? 'td' : 'th'; return '<tr>' + r.map(function (c) { return '<' + tag + '>' + inline(c) + '</' + tag + '>'; }).join('') + '</tr>'; }).join('') + '</table></div>');
        continue;
      }
      if (/^[-*•]\s+/.test(t) || /^\d{1,2}[.)]\s+/.test(t)) {
        var ordered = /^\d/.test(t); var items = [];
        while (i < lines.length && (ordered ? /^\d{1,2}[.)]\s+/ : /^[-*•]\s+/).test(lines[i].trim())) { items.push('<li>' + inline(lines[i].trim().replace(/^(?:[-*•]|\d{1,2}[.)])\s+/, '')) + '</li>'); i++; }
        out.push(ordered ? '<ol>' + items.join('') + '</ol>' : '<ul>' + items.join('') + '</ul>'); continue;
      }
      if (/^>\s?/.test(t)) { var ex = []; while (i < lines.length && /^>\s?/.test(lines[i].trim())) { ex.push(inline(lines[i].trim().replace(/^>\s?/, ''))); i++; } out.push('<div class="pnl-example">' + ex.join('<br>') + '</div>'); continue; }
      if (/^!\s+/.test(t)) { out.push('<div class="pnl-tip">' + inline(t.replace(/^!\s+/, '')) + '</div>'); i++; continue; }
      var para = []; while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|\||[-*•]\s|\d{1,2}[.)]\s|>|!\s)/.test(lines[i].trim())) { para.push(inline(lines[i].trim())); i++; }
      if (!para.length) { para.push(inline(t)); i++; }
      out.push('<p>' + para.join('<br>') + '</p>');
    }
    return out.join('');
  }

  /* ───────── every book ───────── */
  function headHtml() {
    var me = list.signedIn ? '<div class="pdp-me"><span>Your plan</span><b>' + esc(PLAN[list.plan] || 'Free') + '</b>' + (list.level < 3 ? '<a class="pdp-btn sm get" href="/Price">' + svg(IC.crown) + 'Upgrade</a>' : '') + '</div>'
      : '<div class="pdp-me"><span>Sign in to save your progress</span><a class="pdp-btn sm ghost" href="' + esc(signInHref()) + '">Sign in</a></div>';
    return '<div class="pdp-head"><div class="pdp-title"><span class="pdp-title-ic" style="color:#0ea5e9">' + svg(IC.book) + '</span><div><h1>Books</h1><p>IELTS books as interactive e-books: read each unit, do its exercises, and see how much you have learned and what is left.</p></div></div>' + me + '</div>';
  }
  function shown() {
    var q = query.toLowerCase();
    return list.items.filter(function (it) {
      return (!cat || it.category === cat) && (!level || it.level === level) && (!q || [it.title, it.description, it.author, it.category].join(' ').toLowerCase().indexOf(q) > -1);
    });
  }
  function cardHtml(it) {
    var chips = [];
    if (it.units) chips.push('<span class="pdp-chip">' + svg(IC.layers) + plural(it.units, 'unit') + '</span>');
    if (it.exercises) chips.push('<span class="pdp-chip">' + svg(IC.pencil) + plural(it.exercises, 'exercise') + '</span>');
    if (it.level) chips.push('<span class="pdp-chip">' + esc(it.level) + '</span>');
    if (it.category) chips.push('<span class="pdp-chip muted">' + esc(it.category) + '</span>');
    if (!it.units && it.pages) chips.push('<span class="pdp-chip muted">' + svg(IC.file) + esc(it.pages) + ' pages</span>');
    var p = it.progress; var done = p && p.total && p.done >= p.total;
    var media = '<a class="pdp-media pnl-media pnl-m-book" href="#' + esc(it.id) + '" tabindex="-1" aria-hidden="true">' + cover(it)
      + '<div class="pdp-tl">' + planBadge(it) + '</div>' + (it.units ? '<div class="pdp-tr"><span class="pdp-pill dark">E-book</span></div>' : '')
      + (it.locked ? '<span class="pdp-media-lock">' + svg(IC.lock) + '</span>' : '') + (done ? '<span class="eb-done-badge">' + svg(IC.check) + 'Finished</span>' : '') + '</a>';
    var info = (it.author ? '<div class="pdp-line">' + svg(IC.user) + '<span>' + esc(it.author) + '</span></div>' : '') + (it.description ? '<p class="pnl-desc">' + esc(it.description) + '</p>' : '');
    if (p && !it.locked) info += progressBar(p.percent, p.done + ' of ' + plural(p.total, 'unit') + ' learned');
    var file = safeHref(it.file), btns;
    if (it.locked) btns = lockedBtn(it, list.signedIn);
    else if (it.units) btns = '<a class="pdp-btn open" href="#' + esc(it.id) + '">' + svg(IC.arrow) + (done ? 'Read again' : p && p.started ? 'Continue' : 'Start reading') + '</a>' + (file ? '<a class="pdp-btn ghost eb-pdf" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer" title="Open the PDF">' + svg(IC.file) + 'PDF</a>' : '');
    else btns = file ? '<a class="pdp-btn open" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer">' + svg(IC.ext) + 'Open the book</a>' : '<span class="pdp-btn soon">Coming soon</span>';
    return '<article class="pdp-card pnl-card" id="card-' + esc(it.id) + '">' + media + '<div class="pdp-body"><h3><a class="eb-title-link" href="' + (it.units || it.locked ? '#' + esc(it.id) : esc(file || '#')) + '">' + esc(it.title) + '</a></h3>' + info
      + '<div class="pdp-chips">' + chips.join('') + '</div><div class="pdp-foot eb-foot">' + btns + '</div></div></article>';
  }
  function renderList() {
    var html = headHtml();
    var items = list.items;
    if (!items.length) { root.innerHTML = '<div class="pdp">' + html + '<div class="pdp-empty"><strong>No books yet</strong>New books are added here by our teachers. Please check back soon.</div></div>'; return; }
    var ebooks = items.filter(function (b) { return b.units && !b.locked; });
    var withP = ebooks.filter(function (b) { return b.progress && b.progress.started; });
    if (list.signedIn && ebooks.length) {
      var learned = withP.reduce(function (a, b) { return a + b.progress.done; }, 0);
      var ans = withP.reduce(function (a, b) { return a + (b.progress.answered || 0); }, 0), cor = withP.reduce(function (a, b) { return a + (b.progress.correct || 0); }, 0);
      var stat = function (label, v, ic, cls) { return '<div class="pdp-stat' + (cls ? ' ' + cls : '') + '"><div><div class="pdp-stat-label">' + label + '</div><div class="pdp-stat-value">' + v + '</div></div><span class="pdp-stat-ic">' + svg(ic) + '</span></div>'; };
      html += '<div class="pdp-stats">' + stat('E-books', ebooks.length, IC.book) + stat('Started', withP.length, IC.arrow) + stat('Units learned', learned, IC.check) + stat('Right answers', ans ? Math.round((cor / ans) * 100) + '%' : '—', IC.target) + '</div>';
      var last = withP.filter(function (b) { return b.progress.done < b.progress.total; }).sort(function (a, b) { return new Date(b.progress.lastAt || 0) - new Date(a.progress.lastAt || 0); })[0];
      if (last) {
        html += '<a class="eb-continue" href="#' + esc(last.id) + (last.progress.next ? '/' + esc(last.progress.next) : '') + '"><span class="eb-continue-cover pnl-m-book">' + cover(last, 'eb-mini-cover') + '</span><span class="eb-continue-main"><small>Continue where you stopped</small><b>' + esc(last.title) + '</b>'
          + progressBar(last.progress.percent, last.progress.done + ' of ' + plural(last.progress.total, 'unit') + ' · ' + plural(last.progress.left, 'unit') + ' left') + '</span><span class="pdp-btn open">' + svg(IC.arrow) + 'Continue</span></a>';
      }
    }
    var cats = [], levels = [];
    items.forEach(function (it) { if (it.category && cats.indexOf(it.category) < 0) cats.push(it.category); if (it.level && levels.indexOf(it.level) < 0) levels.push(it.level); });
    levels.sort();
    var tab = function (v, n, c) { return '<button class="pdp-tab' + (cat === v ? ' on' : '') + '" type="button" data-cat="' + esc(v) + '">' + esc(n) + '<span class="n">' + c + '</span></button>'; };
    var sh = shown();
    html += '<div class="pdp-filter"><div class="pdp-searchrow"><label class="pdp-search">' + svg(IC.search) + '<input type="search" id="eb-q" placeholder="Search books…" value="' + esc(query) + '" autocomplete="off"></label></div>'
      + '<div class="pdp-filterrow"><div class="pdp-tabs" role="group" aria-label="Category">' + tab('', 'All', items.length) + cats.map(function (c) { return tab(c, c, items.filter(function (x) { return x.category === c; }).length); }).join('') + '</div>'
      + (levels.length ? '<label class="pdp-select">Level <select id="eb-level"><option value="">All</option>' + levels.map(function (l) { return '<option' + (l === level ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') + '</select></label>' : '') + '</div></div>';
    html += '<p class="pdp-count">Showing ' + sh.length + ' of ' + plural(items.length, 'book') + '</p>';
    html += sh.length ? '<div class="pdp-grid pnl-grid-books">' + sh.map(cardHtml).join('') + '</div>' : '<div class="pdp-empty"><strong>Nothing found</strong>Try another word or category.</div>';
    root.innerHTML = '<div class="pdp">' + html + '</div>';
  }

  /* ───────── one book ───────── */
  function unitState(s) {
    if (!s) return { cls: '', label: 'Not started' };
    if (s.done) return { cls: 'done', label: s.total && s.attempts ? 'Learned · ' + s.best + '/' + s.total : 'Learned' };
    if (s.started) return { cls: 'started', label: s.attempts ? 'Try again · best ' + s.best + '/' + s.total : 'In progress' };
    return { cls: '', label: 'Not started' };
  }
  function renderBook(id) {
    var back = '<button class="pdp-back" type="button" data-go="">' + svg(IC.back) + 'All books</button>';
    var show = function (d) {
      var b = d.book, p = d.progress, units = d.units;
      var file = safeHref(b.file);
      var next = p && p.next ? p.next : units[0] && units[0].id;
      var head = '<div class="pdp-dhead eb-dhead"><div class="pdp-dmedia pnl-m-book eb-dcover">' + cover(b, 'eb-big-cover') + '</div><div class="pdp-dmain"><div class="pdp-pills">' + planBadge(b)
        + (b.level ? '<span class="pdp-pill soft">' + esc(b.level) + '</span>' : '') + (b.category ? '<span class="pdp-pill soft">' + esc(b.category) + '</span>' : '') + '</div><h1>' + esc(b.title) + '</h1>'
        + (b.author ? '<div class="pdp-dmeta"><span>' + svg(IC.user) + esc(b.author) + '</span><span>' + svg(IC.layers) + plural(units.length, 'unit') + '</span>' + (b.exercises ? '<span>' + svg(IC.pencil) + plural(b.exercises, 'exercise') + '</span>' : '') + (b.minutes ? '<span>' + svg(IC.clock) + 'about ' + b.minutes + ' min</span>' : '') + '</div>' : '')
        + (b.description ? '<p>' + esc(b.description) + '</p>' : '');
      if (p) {
        head += '<div class="eb-progress"><div class="eb-ring" style="--p:' + p.percent + '"><b>' + p.percent + '%</b><small>learned</small></div><div class="eb-progress-main">'
          + '<div class="eb-nums"><span><b>' + p.done + '</b> learned</span><span><b>' + p.left + '</b> left</span><span><b>' + (p.accuracy == null ? '—' : p.accuracy + '%') + '</b> right answers</span></div>'
          + '<div class="pdp-bar"><i style="width:' + p.percent + '%"></i></div></div></div>';
      } else head += '<p class="eb-note">' + svg(IC.lock) + '<span><a href="' + esc(signInHref()) + '">Sign in</a> to save your progress: you will see what you have learned, what is left, and your teacher will see it too.</span></p>';
      var btns = '';
      if (units.length) btns += '<a class="pdp-btn primary" href="#' + esc(b.id) + '/' + esc(next) + '">' + svg(IC.arrow) + (p && p.done >= p.total && p.total ? 'Read again' : p && p.started ? 'Continue' : 'Start the book') + '</a>';
      if (file) btns += '<a class="pdp-btn ghost eb-big-ghost" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer">' + svg(IC.file) + 'Open the PDF</a>';
      if (p && p.started) btns += '<button class="pdp-btn ghost eb-big-ghost" type="button" data-reset="' + esc(b.id) + '">' + svg(IC.rotate) + 'Start again</button>';
      head += (btns ? '<div class="eb-actions">' + btns + '</div>' : '') + '</div></div>';
      var items = units.map(function (u, i) {
        var s = p && p.status ? p.status[u.id] : null; var st = unitState(s);
        return '<li><a class="pdp-item eb-unit ' + st.cls + '" href="#' + esc(b.id) + '/' + esc(u.id) + '"><span class="eb-num">' + (st.cls === 'done' ? svg(IC.check) : i + 1) + '</span><span class="pdp-item-main"><span class="pdp-item-head">' + kindChip(u.kind)
          + (u.minutes ? '<span class="pdp-meta-chip">' + svg(IC.clock) + u.minutes + ' min</span>' : '') + (u.exercises ? '<span class="pdp-meta-chip">' + svg(IC.pencil) + plural(u.exercises, 'exercise') + '</span>' : '') + (u.audio ? '<span class="pdp-meta-chip">' + svg(IC.headphones) + 'audio</span>' : '') + (u.test ? '<span class="pdp-meta-chip">' + svg(IC.target) + 'test</span>' : '') + '</span>'
          + '<span class="pdp-item-title">' + esc(u.title) + '</span>' + (u.summary ? '<span class="eb-sum">' + esc(u.summary) + '</span>' : '') + '</span><span class="eb-state ' + st.cls + '">' + esc(st.label) + '</span></a></li>';
      }).join('');
      root.innerHTML = '<div class="pdp">' + back + head + (units.length ? '<h2 class="pdp-group">Units</h2><ol class="pdp-items eb-units">' + items + '</ol>' : '<div class="pdp-empty"><strong>No units yet</strong>' + (file ? 'Open the PDF meanwhile.' : 'Please check back soon.') + '</div>') + '</div>';
      window.scrollTo(0, 0);
    };
    if (bookCache[id]) show(bookCache[id]); else root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-skel"></div></div>';
    call('GET', '/api/ebooks/' + encodeURIComponent(id)).then(function (d) { bookCache[id] = d; if (location.hash.slice(1) === id) show(d); })
      .catch(function (e) {
        if (e.status === 403 && e.data && e.data.book) {
          var b = e.data.book;
          root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-dhead"><div class="pdp-dmedia pnl-m-book eb-dcover">' + cover(b, 'eb-big-cover') + '</div><div class="pdp-dmain"><div class="pdp-pills">' + planBadge(b) + '</div><h1>' + esc(b.title) + '</h1>' + (b.description ? '<p>' + esc(b.description) + '</p>' : '') + '</div></div>'
            + '<div class="pdp-locked"><div class="big">' + svg(IC.lock) + '</div><h2>This book is for ' + esc(PLAN[b.plan]) + ' members</h2><p>' + (e.data.signedIn ? 'Upgrade your plan to read the units and do the exercises.' : 'Sign in first.') + '</p>' + lockedBtn(b, e.data.signedIn) + '</div></div>';
          return;
        }
        root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-empty"><strong>Could not open this book</strong>' + esc(e.message) + '</div></div>';
      });
  }

  /* ───────── one unit ───────── */
  var current = null;   // { bookId, unitId, data }
  function exHtml(x, n) {
    var q = esc(x.q).replace(/_{2,}/g, '<span class="pnl-gap">_____</span>');
    var body = x.type === 'gap'
      ? '<input class="pnl-input" type="text" data-ex="' + esc(x.id) + '" autocomplete="off" spellcheck="false" placeholder="Your answer">'
      : '<div class="pnl-opts' + (x.type !== 'choice' ? ' eb-tf' : '') + '">' + x.options.map(function (o, k) { return '<label class="pnl-opt"><input type="radio" name="ex-' + esc(x.id) + '" value="' + esc(o) + '"><span class="pnl-opt-l">' + (x.type === 'choice' ? String.fromCharCode(65 + k) : esc(o.split(' ').map(function (w) { return w.charAt(0); }).join(''))) + '</span><span>' + esc(o) + '</span></label>'; }).join('') + '</div>';
    return '<li class="pnl-ex" data-id="' + esc(x.id) + '"><div class="pnl-ex-q"><span class="pdp-num-tag">' + (n + 1) + '</span><span>' + q + '</span></div>' + body + '<div class="pnl-ex-fb" hidden></div></li>';
  }
  function scoreBox(r) {
    if (!r) return '';
    var ok = r.passed;
    return '<div class="eb-score ' + (ok ? 'ok' : 'bad') + '">' + svg(ok ? IC.trophy : IC.target) + '<div><b>' + r.correct + ' / ' + r.total + ' correct · ' + r.percent + '%</b><span>'
      + (ok ? 'Unit learned. ' + (r.best > r.correct ? 'Your best: ' + r.best + ' / ' + r.total + '.' : '') : 'You need ' + r.pass + '% to learn this unit. Read the text again and try once more.' + (r.best ? ' Your best: ' + r.best + ' / ' + r.total + '.' : ''))
      + '</span></div></div>';
  }
  function renderUnit(bookId, unitId) {
    var back = '<button class="pdp-back" type="button" data-go="' + esc(bookId) + '">' + svg(IC.back) + 'Back to the book</button>';
    var show = function (d) {
      current = { bookId: bookId, unitId: unitId, data: d };
      var u = d.unit, nav = d.nav, mine = d.mine;
      var st = unitState(mine);
      var html = back + '<div class="eb-unit-head"><div class="eb-unit-top"><span class="eb-crumb">' + esc(d.book.title) + ' · Unit ' + (nav.index + 1) + ' of ' + d.book.units + '</span><span class="eb-state ' + st.cls + '">' + esc(st.label) + '</span></div>'
        + '<div class="pdp-item-head">' + kindChip(u.kind) + (u.minutes ? '<span class="pdp-meta-chip">' + svg(IC.clock) + u.minutes + ' min</span>' : '') + '</div><h1>' + esc(u.title) + '</h1>' + (u.summary ? '<p>' + esc(u.summary) + '</p>' : '')
        + '<div class="eb-steps">' + Array.apply(null, Array(d.book.units)).map(function (_, i) { return '<i class="' + (i < nav.index ? 'past' : i === nav.index ? 'now' : '') + '"></i>'; }).join('') + '</div></div>';
      if (u.audio && safeHref(u.audio)) html += '<div class="eb-audio">' + svg(IC.headphones) + '<audio controls preload="metadata" src="' + esc(safeHref(u.audio)) + '"></audio></div>';
      if (u.test && safeHref(u.test)) html += '<div class="eb-test">' + svg(IC.target) + '<div><b>' + esc(u.testLabel || 'Practise with a test of the website') + '</b><span>' + (u.exercises.length ? 'Do the test, then the exercises below.' : 'Finish the test and this unit counts as learned.') + (mine && mine.done && !u.exercises.length ? ' ✓ Done.' : '') + '</span></div><a class="pdp-btn open" href="' + esc(safeHref(u.test)) + '">' + svg(IC.arrow) + 'Open the test</a></div>';
      if (u.content) html += '<article class="pnl-lesson">' + markup(u.content) + '</article>';
      if (u.exercises.length) {
        html += '<section class="pnl-exercises"><h2>' + svg(IC.pencil) + 'Exercises</h2><ol class="pnl-ex-list">' + u.exercises.map(exHtml).join('') + '</ol>'
          + '<div class="pnl-ex-actions"><button class="pdp-btn primary" type="button" data-check>' + svg(IC.check) + 'Check answers</button><button class="pdp-btn ghost" type="button" data-again hidden>' + svg(IC.rotate) + 'Try again</button>'
          + (d.signedIn ? '' : '<span class="eb-signin"><a href="' + esc(signInHref()) + '">Sign in</a> to check your answers and save your progress.</span>') + '</div><div class="eb-result" aria-live="polite"></div></section>';
      } else if (!u.test) {
        html += '<div class="eb-read">' + (mine && mine.done ? '<span class="eb-state done">' + svg(IC.check) + ' You have read this unit</span>' : d.signedIn ? '<button class="pdp-btn primary" type="button" data-read>' + svg(IC.check) + 'I have read it</button><span class="muted">Marks this unit as learned.</span>' : '<span class="eb-signin"><a href="' + esc(signInHref()) + '">Sign in</a> to save your progress.</span>') + '</div>';
      }
      html += '<div class="eb-nav">' + (nav.prev ? '<a class="pdp-btn ghost eb-big-ghost" href="#' + esc(bookId) + '/' + esc(nav.prev) + '">' + svg(IC.back) + 'Previous unit</a>' : '<span></span>')
        + (nav.next ? '<a class="pdp-btn primary" href="#' + esc(bookId) + '/' + esc(nav.next) + '">Next unit' + svg(IC.arrow) + '</a>' : '<a class="pdp-btn primary" href="#' + esc(bookId) + '">' + svg(IC.check) + 'Back to the book</a>') + '</div>';
      root.innerHTML = '<div class="pdp eb-reader">' + html + '</div>';
      var au = root.querySelector('.eb-audio audio');
      if (au) au.addEventListener('play', function () { document.dispatchEvent(new CustomEvent('ix:media-play', { detail: { from: 'ebook' } })); });
      window.scrollTo(0, 0);
    };
    var key = bookId + '/' + unitId;
    root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-skel"></div></div>';
    call('GET', '/api/ebooks/' + encodeURIComponent(bookId) + '/' + encodeURIComponent(unitId)).then(function (d) { unitCache[key] = d; if (location.hash.slice(1) === key) show(d); })
      .catch(function (e) {
        if (e.status === 403) { renderBook(bookId); return; }
        root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-empty"><strong>Could not open this unit</strong>' + esc(e.message) + '</div></div>';
      });
  }
  function check() {
    if (!current) return;
    var d = current.data;
    if (!d.signedIn) { location.href = signInHref(); return; }
    var answers = {}, empty = 0;
    d.unit.exercises.forEach(function (x) {
      var li = root.querySelector('.pnl-ex[data-id="' + x.id + '"]'); if (!li) return;
      var v = x.type === 'gap' ? (li.querySelector('.pnl-input') || {}).value || '' : ((li.querySelector('input:checked') || {}).value || '');
      if (!String(v).trim()) empty++;
      answers[x.id] = v;
    });
    if (empty && !confirm(empty + ' exercise' + (empty === 1 ? ' is' : 's are') + ' not answered. Check anyway?')) return;
    var btn = root.querySelector('[data-check]'); if (btn) btn.disabled = true;
    call('POST', '/api/ebooks/' + encodeURIComponent(current.bookId) + '/' + encodeURIComponent(current.unitId) + '/check', { answers: answers }).then(function (r) {
      r.results.forEach(function (x) {
        var li = root.querySelector('.pnl-ex[data-id="' + x.id + '"]'); if (!li) return;
        li.classList.toggle('ok', x.ok); li.classList.toggle('bad', !x.ok);
        li.querySelectorAll('input').forEach(function (inp) { inp.disabled = true; });
        var fb = li.querySelector('.pnl-ex-fb'); fb.hidden = false;
        fb.innerHTML = (x.ok ? svg(IC.check) + '<b>Correct.</b>' : svg(IC.x) + '<b>Answer:</b> ' + esc(x.answers.join(' / '))) + (x.explain ? ' <span>' + esc(x.explain) + '</span>' : '');
      });
      var res = root.querySelector('.eb-result'); if (res) res.innerHTML = scoreBox(r);
      var again = root.querySelector('[data-again]'); if (again) again.hidden = false;
      if (btn) btn.hidden = true;
      var st = unitState(r.mine); var pill = root.querySelector('.eb-unit-top .eb-state'); if (pill) { pill.className = 'eb-state ' + st.cls; pill.textContent = st.label; }
      delete bookCache[current.bookId]; list = null;
      if (res) res.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).catch(function (e) { alert(e.message); if (btn) btn.disabled = false; });
  }
  function again() {
    root.querySelectorAll('.pnl-ex').forEach(function (li) { li.classList.remove('ok', 'bad'); li.querySelector('.pnl-ex-fb').hidden = true; li.querySelectorAll('input').forEach(function (x) { x.disabled = false; if (x.type === 'radio') x.checked = false; else x.value = ''; }); });
    var res = root.querySelector('.eb-result'); if (res) res.innerHTML = '';
    var btn = root.querySelector('[data-check]'); if (btn) { btn.hidden = false; btn.disabled = false; }
    var a = root.querySelector('[data-again]'); if (a) a.hidden = true;
    var ex = root.querySelector('.pnl-exercises'); if (ex) window.scrollTo({ top: ex.offsetTop - 80, behavior: 'smooth' });
  }

  /* ───────── events, start ───────── */
  root.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cat],[data-go],[data-check],[data-again],[data-read],[data-reset]'); if (!t) return;
    if (t.hasAttribute('data-cat')) { cat = t.getAttribute('data-cat'); renderList(); return; }
    if (t.hasAttribute('data-go')) { var g = t.getAttribute('data-go'); if (g) location.hash = '#' + g; else { history.pushState('', document.title, location.pathname + location.search); route(); } return; }
    if (t.hasAttribute('data-check')) { check(); return; }
    if (t.hasAttribute('data-again')) { again(); return; }
    if (t.hasAttribute('data-read') && current) {
      t.disabled = true;
      call('POST', '/api/ebooks/' + encodeURIComponent(current.bookId) + '/' + encodeURIComponent(current.unitId) + '/read').then(function () {
        delete bookCache[current.bookId]; list = null;
        var box = root.querySelector('.eb-read'); if (box) box.innerHTML = '<span class="eb-state done">' + svg(IC.check) + ' You have read this unit</span>';
        var pill = root.querySelector('.eb-unit-top .eb-state'); if (pill) { pill.className = 'eb-state done'; pill.textContent = 'Learned'; }
      }).catch(function (err) { alert(err.message); t.disabled = false; });
      return;
    }
    if (t.hasAttribute('data-reset')) {
      if (!confirm('Start this book again? Your progress in it is cleared (your test results stay).')) return;
      var id = t.getAttribute('data-reset');
      call('POST', '/api/ebooks/' + encodeURIComponent(id) + '/reset').then(function () { delete bookCache[id]; list = null; renderBook(id); }).catch(function (err) { alert(err.message); });
    }
  });
  root.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('pnl-input')) { e.preventDefault(); var all = root.querySelectorAll('.pnl-input:not([disabled])'); var i = Array.prototype.indexOf.call(all, e.target); if (all[i + 1]) all[i + 1].focus(); else check(); } });
  root.addEventListener('input', function (e) {
    if (e.target.id === 'eb-q') { query = e.target.value; var pos = e.target.selectionStart; renderList(); var q = document.getElementById('eb-q'); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (x) { /* fine */ } } }
  });
  root.addEventListener('change', function (e) { if (e.target.id === 'eb-level') { level = e.target.value; renderList(); } });
  function loadList() {
    root.innerHTML = '<div class="pdp"><div class="pdp-grid"><div class="pdp-skel"></div><div class="pdp-skel"></div><div class="pdp-skel"></div></div></div>';
    call('GET', '/api/ebooks').then(function (d) { list = d; if (!/^#b-/.test(location.hash)) renderList(); })
      .catch(function (e) { root.innerHTML = '<div class="pdp"><div class="pdp-empty"><strong>Could not load the books</strong>' + esc(e.message) + ' <button class="pdp-btn sm ghost" type="button" onclick="location.reload()">Try again</button></div></div>'; });
  }
  function route() {
    current = null;
    var h = location.hash.slice(1), m = /^(b-[a-f0-9]{8})(?:\/(u-[a-f0-9]{8}))?$/.exec(h);
    if (m && m[2]) return renderUnit(m[1], m[2]);
    if (m) return renderBook(m[1]);
    if (list) renderList(); else loadList();
  }
  window.addEventListener('hashchange', route);
  route();
})();
