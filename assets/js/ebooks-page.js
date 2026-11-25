/*
 * IELTSX — the Books page as an e-book reader (books.html, <main id="panel-root" data-panel="books">). The books are made
 * in Admin → Books, their units in Admin → E-books; everything comes from /api/ebooks (ebooks.js), which decides what a
 * visitor may open (a locked book arrives without its file or units) and checks the exercises (the answers reach the page
 * only after "Check answers"). The progress is kept on the account, so the teacher sees it too.
 *   /books                    every book: the progress of each, "Continue where you stopped"
 *   /books#<book>             one book: how much is learned, what is left, its units
 *   /books#<book>/<unit>      one unit: its book page (assets/js/ebook-render.js) in the design of the book — the website's,
 *                             a course book, a workbook or a vocabulary book (assets/css/ebook-book.css) — with the recording,
 *                             the test, the exercises (each checked on its own, or all at once); previous / next unit (also
 *                             ← →), the contents, one or two pages, the size of the text, full screen, print. Answers that are
 *                             not checked yet are kept in this browser. A bold collocation can be heard and kept
 *   /books#<book>/index       the A–Z index of the book: every collocation and its units
 *   /books#notebook           the collocations the student kept, and the cards to revise them
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
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>', az: '<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M20 8h-5"/><path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10"/><path d="M15 14h5l-5 6h5"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    sound: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    two: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>', full: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    print: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
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
  var list = null, query = '', cat = '', level = '', bookCache = {};
  var turn = 0;            // every new address: an answer that comes after the student has gone on is not shown
  var notes = null;        // the notebook: [{ w, s, book, unit, box, due }], null = not read yet
  var norm = function (v) { return String(v || '').toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?,;:]+$/g, ''); };
  var pref = function (k, def) { try { var v = localStorage.getItem('ixeb-' + k); return v === null ? def : v; } catch (e) { return def; } };
  var setPref = function (k, v) { try { if (v === null) localStorage.removeItem('ixeb-' + k); else localStorage.setItem('ixeb-' + k, v); } catch (e) { /* private window */ } };
  var go = function (h) { if (location.hash === h) route(); else location.hash = h; };
  function say(w) {
    try { if (!window.speechSynthesis) return; var u = new SpeechSynthesisUtterance(w); u.lang = 'en-GB'; u.rate = 0.92; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { /* no voice on this device */ }
  }
  function note(msg, bad) {   // a short message at the bottom
    var t = document.getElementById('eb-toast'); if (!t) { t = document.createElement('div'); t.id = 'eb-toast'; t.className = 'eb-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(note.t); note.t = setTimeout(function () { t.classList.remove('show'); }, bad ? 4500 : 2400);
  }
  function loadNotes() { return notes ? Promise.resolve(notes) : call('GET', '/api/ebooks/notebook').then(function (d) { notes = d.items; return notes; }); }
  function saveNote(body) { return call('POST', '/api/ebooks/notebook', body).then(function (d) { notes = d.items; list = null; return notes; }); }
  var kept = function (w) { return !!notes && notes.some(function (n) { return norm(n.w) === norm(w); }); };

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
    if (c) return '<img class="' + (cls || 'pnl-cover') + '" src="' + esc(c) + '" alt="" loading="lazy">';
    if (!b.units || !b.style) return '<div class="pdp-media-in">' + svg(IC.book, 'pdp-media-ic') + '<span>' + esc(b.title) + '</span></div>';
    // no picture: a cover in the colours of the design of the book
    return '<div class="eb-cover eb-cover-' + esc(b.style) + ' ' + (cls || '') + '" aria-hidden="true"><span class="eb-cover-top">IELTSX</span><b>' + esc(b.title) + '</b><i></i>' + (b.level ? '<em>' + esc(b.level) + '</em>' : '') + (b.author ? '<small>' + esc(b.author) + '</small>' : '') + '</div>';
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
    if (it.exercises) chips.push('<span class="pdp-chip">' + svg(IC.pencil) + plural(it.exercises, 'question') + '</span>');
    if (it.level) chips.push('<span class="pdp-chip">' + esc(it.level) + '</span>');
    if (it.category) chips.push('<span class="pdp-chip muted">' + esc(it.category) + '</span>');
    if (!it.units && it.pages) chips.push('<span class="pdp-chip muted">' + svg(IC.file) + esc(it.pages) + ' pages</span>');
    var p = it.progress; var done = p && p.total && p.done >= p.total;
    var media = '<a class="pdp-media pnl-media pnl-m-book' + (!it.cover && it.units && it.style ? ' eb-m-' + esc(it.style) : '') + '" href="#' + esc(it.id) + '" tabindex="-1" aria-hidden="true">' + cover(it)
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
      var nb = list.notebook || { total: 0, due: 0 };
      html += '<a class="eb-nb" href="#notebook">' + svg(IC.star) + '<span><b>My notebook</b> ' + (nb.total ? plural(nb.total, 'collocation') + (nb.due ? ' · <em>' + nb.due + ' to revise today</em>' : ' · nothing to revise today') : 'Keep collocations while you read and revise them as cards.') + '</span>' + svg(IC.arrow) + '</a>';
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
  function groupsOf(units) {   // the parts of the book, in the order of its units
    var out = []; units.forEach(function (u, i) { var g = u.group || ''; var last = out[out.length - 1]; if (!last || last.name !== g) out.push(last = { name: g, items: [] }); last.items.push({ u: u, i: i }); });
    return out;
  }
  function renderBook(id, my) {
    var back = '<button class="pdp-back" type="button" data-go="">' + svg(IC.back) + 'All books</button>';
    var show = function (d) {
      var b = d.book, p = d.progress, units = d.units;
      var file = safeHref(b.file);
      var next = p && p.next ? p.next : units[0] && units[0].id;
      var meta = (b.author ? '<span>' + svg(IC.user) + esc(b.author) + '</span>' : '') + (units.length ? '<span>' + svg(IC.layers) + plural(units.length, 'unit') + '</span>' : '') + (b.exercises ? '<span>' + svg(IC.pencil) + plural(b.exercises, 'question') + '</span>' : '') + (b.minutes ? '<span>' + svg(IC.clock) + 'about ' + (b.minutes >= 90 ? Math.round(b.minutes / 60) + ' h' : b.minutes + ' min') + '</span>' : '');
      var head = '<div class="pdp-dhead eb-dhead"><div class="pdp-dmedia pnl-m-book eb-dcover' + (!b.cover && b.units ? ' eb-m-' + esc(b.style) : '') + '">' + cover(b, 'eb-big-cover') + '</div><div class="pdp-dmain"><div class="pdp-pills">' + planBadge(b)
        + (b.style && b.style !== 'site' && window.IXEbook ? '<span class="pdp-pill soft eb-style-pill eb-style-' + esc(b.style) + '"><i></i>' + esc(window.IXEbook.STYLES[b.style] || '') + '</span>' : '')
        + (b.level ? '<span class="pdp-pill soft">' + esc(b.level) + '</span>' : '') + (b.category ? '<span class="pdp-pill soft">' + esc(b.category) + '</span>' : '') + '</div><h1>' + esc(b.title) + '</h1>'
        + (meta ? '<div class="pdp-dmeta">' + meta + '</div>' : '')
        + (b.description ? '<p>' + esc(b.description) + '</p>' : '');
      if (p && units.length) {
        head += '<div class="eb-progress"><div class="eb-ring" style="--p:' + p.percent + '"><b>' + p.percent + '%</b><small>learned</small></div><div class="eb-progress-main">'
          + '<div class="eb-nums"><span><b>' + p.done + '</b> learned</span><span><b>' + p.left + '</b> left</span><span><b>' + (p.accuracy == null ? '—' : p.accuracy + '%') + '</b> right answers</span></div>'
          + '<div class="pdp-bar"><i style="width:' + p.percent + '%"></i></div></div></div>';
      } else if (!d.signedIn && units.length) head += '<p class="eb-note">' + svg(IC.lock) + '<span><a href="' + esc(signInHref()) + '">Sign in</a> to save your progress: you will see what you have learned, what is left, and your teacher will see it too.</span></p>';
      var btns = '';
      if (units.length) btns += '<a class="pdp-btn primary" href="#' + esc(b.id) + '/' + esc(next) + '">' + svg(IC.arrow) + (p && p.done >= p.total && p.total ? 'Read again' : p && p.started ? 'Continue' : 'Start the book') + '</a>';
      if (file) btns += '<a class="pdp-btn ghost eb-big-ghost" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer">' + svg(IC.file) + 'Open the PDF</a>';
      if (units.length && b.style === 'inuse') btns += '<a class="pdp-btn ghost eb-big-ghost" href="#' + esc(b.id) + '/index">' + svg(IC.az) + 'A–Z index</a>';
      if (d.signedIn && units.length) btns += '<a class="pdp-btn ghost eb-big-ghost" href="#notebook">' + svg(IC.star) + 'My notebook</a>';
      if (p && p.started) btns += '<button class="pdp-btn ghost eb-big-ghost" type="button" data-reset="' + esc(b.id) + '">' + svg(IC.rotate) + 'Start again</button>';
      head += (btns ? '<div class="eb-actions">' + btns + '</div>' : '') + '</div></div>';
      var row = function (x) {
        var u = x.u, i = x.i, s = p && p.status ? p.status[u.id] : null; var st = unitState(s);
        return '<li><a class="pdp-item eb-unit ' + st.cls + '" href="#' + esc(b.id) + '/' + esc(u.id) + '"><span class="eb-num">' + (st.cls === 'done' ? svg(IC.check) : (b.style && b.style !== 'site' ? '<small>Unit</small>' : '') + (i + 1)) + '</span><span class="pdp-item-main"><span class="pdp-item-head">' + kindChip(u.kind)
          + (u.minutes ? '<span class="pdp-meta-chip">' + svg(IC.clock) + u.minutes + ' min</span>' : '') + (u.exercises ? '<span class="pdp-meta-chip">' + svg(IC.pencil) + plural(u.exercises, 'question') + '</span>' : '') + (u.audio ? '<span class="pdp-meta-chip">' + svg(IC.headphones) + 'audio</span>' : '') + (u.test ? '<span class="pdp-meta-chip">' + svg(IC.target) + 'test</span>' : '') + '</span>'
          + '<span class="pdp-item-title">' + esc(u.title) + '</span>' + (u.summary ? '<span class="eb-sum">' + esc(u.summary) + '</span>' : '') + '</span><span class="eb-state ' + st.cls + '">' + esc(st.label) + '</span></a></li>';
      };
      var groups = groupsOf(units);
      var body = groups.map(function (g) { return '<h2 class="pdp-group">' + esc(g.name || (groups.length > 1 ? 'More units' : 'Units')) + '</h2><ol class="pdp-items eb-units">' + g.items.map(row).join('') + '</ol>'; }).join('');
      var find = units.length > 3 ? '<label class="pdp-search eb-find">' + svg(IC.search) + '<input type="search" id="eb-find" data-book="' + esc(b.id) + '" placeholder="Search in this book…" autocomplete="off"></label><div class="eb-found" id="eb-found" aria-live="polite"></div>' : '';
      root.innerHTML = '<div class="pdp">' + back + head + (units.length ? find + '<div class="eb-contents eb-style-' + esc(b.style || 'site') + '" id="eb-contents">' + body + '</div>' : '<div class="pdp-empty"><strong>No units yet</strong>' + (file ? 'Open the PDF meanwhile.' : 'Please check back soon.') + '</div>') + '</div>';
      window.scrollTo(0, 0);
    };
    if (bookCache[id]) show(bookCache[id]); else root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-skel"></div></div>';
    var had = !!bookCache[id];
    call('GET', '/api/ebooks/' + encodeURIComponent(id)).then(function (d) {
      var same = had && JSON.stringify(bookCache[id]) === JSON.stringify(d); bookCache[id] = d;
      if (my === turn && !same) show(d);
    }).catch(function (e) {
      if (my !== turn) return;
      if (e.status === 403 && e.data && e.data.book) {
        var b = e.data.book; delete bookCache[id];
        root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-dhead"><div class="pdp-dmedia pnl-m-book eb-dcover' + (!b.cover && b.units ? ' eb-m-' + esc(b.style) : '') + '">' + cover(b, 'eb-big-cover') + '</div><div class="pdp-dmain"><div class="pdp-pills">' + planBadge(b) + '</div><h1>' + esc(b.title) + '</h1>' + (b.description ? '<p>' + esc(b.description) + '</p>' : '') + '</div></div>'
          + '<div class="pdp-locked"><div class="big">' + svg(IC.lock) + '</div><h2>This book is for ' + esc(PLAN[b.plan]) + ' members</h2><p>' + (e.data.signedIn ? 'Upgrade your plan to read the units and do the exercises.' : 'Sign in first.') + '</p>' + lockedBtn(b, e.data.signedIn) + '</div></div>';
        return;
      }
      if (had) return note(e.message, true);
      root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-empty"><strong>Could not open this book</strong>' + esc(e.message) + '</div></div>';
    });
  }

  /* search in one book */
  var findT = 0, findN = 0;
  function findIn(bookId, q) {
    var box = document.getElementById('eb-found'), all = document.getElementById('eb-contents'); if (!box) return;
    clearTimeout(findT); var my = ++findN;
    if (norm(q).length < 2) { box.innerHTML = ''; if (all) all.hidden = false; return; }
    findT = setTimeout(function () {
      call('GET', '/api/ebooks/' + encodeURIComponent(bookId) + '/search?q=' + encodeURIComponent(q)).then(function (d) {
        if (my !== findN) return;
        if (all) all.hidden = true;
        var mark = function (t) { var i = t.toLowerCase().indexOf(q.trim().toLowerCase()); return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + q.trim().length)) + '</mark>' + esc(t.slice(i + q.trim().length)); };
        box.innerHTML = d.results.length ? '<ol class="pdp-items">' + d.results.map(function (r) { return '<li><a class="pdp-item eb-hit" href="#' + esc(bookId) + '/' + esc(r.id) + '"><span class="eb-num">' + r.n + '</span><span class="pdp-item-main"><span class="pdp-item-title">' + mark(r.title) + '</span>' + r.hits.map(function (h) { return '<span class="eb-sum">' + mark(h) + '</span>'; }).join('') + '</span></a></li>'; }).join('') + '</ol>'
          : '<div class="pdp-empty"><strong>Nothing found</strong>Try another word.</div>';
      }).catch(function (e) { if (my === findN) box.innerHTML = '<div class="pdp-empty">' + esc(e.message) + '</div>'; });
    }, 260);
  }

  /* the A–Z index of a book */
  function renderIndex(id, my) {
    var back = '<button class="pdp-back" type="button" data-go="' + esc(id) + '">' + svg(IC.back) + 'Back to the book</button>';
    root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-skel"></div></div>';
    Promise.all([call('GET', '/api/ebooks/' + encodeURIComponent(id) + '/index'), loadNotes().catch(function () { return null; })]).then(function (r) {
      if (my !== turn) return;
      var d = r[0]; var first = function (w) { var c = norm(w).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/^(?:an?|the)\s+/, '').charAt(0).toUpperCase(); return /[A-Z]/.test(c) ? c : '#'; };
      var by = {}; d.terms.forEach(function (t) { var c = first(t.w); (by[c] = by[c] || []).push(t); });
      var letters = Object.keys(by).sort();
      var row = function (t) {
        return '<li data-w="' + esc(norm(t.w)) + '"><span class="eb-ix-w">' + esc(t.w) + '</span><span class="eb-ix-u">' + t.units.map(function (u) { return '<a href="#' + esc(id) + '/' + esc(u.id) + '" title="Unit ' + u.n + '">' + u.n + '</a>'; }).join('') + '</span>'
          + '<button class="eb-ic" type="button" data-say="' + esc(t.w) + '" title="Listen" aria-label="Listen">' + svg(IC.sound) + '</button>'
          + (notes ? '<button class="eb-ic eb-star' + (kept(t.w) ? ' on' : '') + '" type="button" data-keep="' + esc(t.w) + '" data-s="' + esc(t.s || '') + '" data-book="' + esc(id) + '" data-unit="' + esc(t.units[0] ? t.units[0].id : '') + '" title="Keep in my notebook" aria-label="Keep in my notebook" aria-pressed="' + kept(t.w) + '">' + svg(IC.star) + '</button>' : '') + '</li>';
      };
      root.innerHTML = '<div class="pdp eb-ixpage eb-style-' + esc(d.book.style) + '">' + back + '<div class="pdp-head"><div class="pdp-title"><span class="pdp-title-ic" style="color:#05552f">' + svg(IC.az) + '</span><div><h1>A–Z index</h1><p>' + esc(d.book.title) + ' · ' + plural(d.terms.length, 'collocation') + '. The numbers are the units.</p></div></div></div>'
        + (d.terms.length ? '<div class="eb-ixbar"><label class="pdp-search">' + svg(IC.search) + '<input type="search" id="eb-ixq" placeholder="Find a collocation…" autocomplete="off"></label><nav class="eb-letters" aria-label="Letters">' + letters.map(function (c) { return '<button type="button" data-letter="' + c + '">' + c + '</button>'; }).join('') + '</nav></div>'
          + letters.map(function (c) { return '<section class="eb-ixs" id="eb-l-' + (c === '#' ? 'x' : c) + '"><h2>' + c + '</h2><ul class="eb-ix">' + by[c].map(row).join('') + '</ul></section>'; }).join('') + '<div class="pdp-empty" id="eb-ix0" hidden><strong>Nothing found</strong>Try another word.</div>'
          : '<div class="pdp-empty"><strong>No collocations yet</strong>The words written in bold in the units of this book are listed here.</div>') + '</div>';
      window.scrollTo(0, 0);
    }).catch(function (e) {
      if (my !== turn) return;
      if (e.status === 403) return renderBook(id, my);
      root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-empty"><strong>Could not open the index</strong>' + esc(e.message) + '</div></div>';
    });
  }

  /* the notebook and its cards */
  var deck = null;   // { cards, i, open, right }
  var dueNow = function (n) { return !n.due || new Date(n.due) <= new Date(); };
  function renderNotebook(my) {
    deck = null;
    var back = '<button class="pdp-back" type="button" data-go="">' + svg(IC.back) + 'All books</button>';
    root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-skel"></div></div>';
    call('GET', '/api/ebooks/notebook').then(function (d) {
      if (my !== turn) return;
      notes = d.items; showNotebook(back, d.books || []);
    }).catch(function (e) {
      if (my !== turn) return;
      root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-empty"><strong>' + (e.status === 401 ? 'Sign in to keep a notebook' : 'Could not open your notebook') + '</strong>' + (e.status === 401 ? 'Keep collocations while you read and revise them as cards. <a class="pdp-btn sm open" href="' + esc(signInHref()) + '">Sign in</a>' : esc(e.message)) + '</div></div>';
    });
  }
  function showNotebook(back, books) {
    showNotebook.args = [back, books];
    var titles = {}; books.forEach(function (b) { titles[b.id] = b.title; });
    var due = notes.filter(dueNow).length;
    var rows = notes.map(function (n) {
      return '<li data-w="' + esc(norm(n.w + ' ' + n.s)) + '"><div class="eb-nt-main"><b>' + esc(n.w) + '</b>' + (n.s && norm(n.s) !== norm(n.w) ? '<span>' + esc(n.s) + '</span>' : '') + '<small>' + (titles[n.book] ? (n.unit ? '<a href="#' + esc(n.book) + '/' + esc(n.unit) + '">' + esc(titles[n.book]) + '</a>' : esc(titles[n.book])) : 'A book that is not here any more') + ' · ' + (n.box ? 'step ' + n.box + ' of 5' : 'new') + '</small></div>'
        + '<button class="eb-ic" type="button" data-say="' + esc(n.w) + '" title="Listen" aria-label="Listen">' + svg(IC.sound) + '</button><button class="eb-ic" type="button" data-drop="' + esc(n.w) + '" title="Take out of the notebook" aria-label="Take out of the notebook">' + svg(IC.x) + '</button></li>';
    }).join('');
    root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-head"><div class="pdp-title"><span class="pdp-title-ic" style="color:#f59e0b">' + svg(IC.star) + '</span><div><h1>My notebook</h1><p>The collocations you kept from your books. What you know comes back later and later; what you do not know comes back at once.</p></div></div></div>'
      + (notes.length ? '<div class="eb-deckbar"><span><b>' + notes.length + '</b> kept · <b>' + due + '</b> to revise today</span><button class="pdp-btn primary" type="button" data-deck="due"' + (due ? '' : ' disabled') + '>' + svg(IC.layers) + 'Revise ' + (due ? due : '') + '</button><button class="pdp-btn ghost eb-big-ghost" type="button" data-deck="all">All cards</button></div>'
        + '<label class="pdp-search eb-find">' + svg(IC.search) + '<input type="search" id="eb-nq" placeholder="Search my notebook…" autocomplete="off"></label><ul class="eb-notes">' + rows + '</ul>'
        : '<div class="pdp-empty"><strong>Your notebook is empty</strong>Open a unit of a book, press a collocation in bold and choose “Keep”.</div>') + '</div>';
    window.scrollTo(0, 0);
  }
  function showCard() {
    var c = deck.cards[deck.i];
    if (!c) {
      root.innerHTML = '<div class="pdp eb-cards"><div class="pdp-empty"><strong>' + deck.right + ' of ' + deck.cards.length + ' known</strong>' + (deck.right === deck.cards.length ? 'Very good. They come back in a few days.' : 'The others are waiting for you in the notebook.') + '<div class="eb-cardb"><button class="pdp-btn primary" type="button" data-deck="end">Back to the notebook</button></div></div></div>';
      return;
    }
    var s = c.s || ''; var at = s.toLowerCase().indexOf(c.w.toLowerCase());
    var gap = at > -1 && norm(s) !== norm(c.w);
    var blank = c.w.split(/\s+/).map(function (x) { return '<u>' + esc(x.charAt(0)) + '</u>'; }).join(' ');
    var front = gap ? esc(s.slice(0, at)) + '<span class="eb-blank">' + (deck.open ? '<b>' + esc(c.w) + '</b>' : blank) + '</span>' + esc(s.slice(at + c.w.length)) : deck.open ? '<b>' + esc(c.w) + '</b>' + (s && norm(s) !== norm(c.w) ? '<br><small>' + esc(s) + '</small>' : '') : 'Say a sentence with: <b>' + esc(c.w) + '</b>';
    root.innerHTML = '<div class="pdp eb-cards"><button class="pdp-back" type="button" data-deck="end">' + svg(IC.back) + 'My notebook</button><div class="pdp-bar"><i style="width:' + Math.round((deck.i / deck.cards.length) * 100) + '%"></i></div><p class="pdp-count">Card ' + (deck.i + 1) + ' of ' + deck.cards.length + '</p>'
      + '<div class="eb-card"><p>' + front + '</p>' + (deck.open ? '<button class="eb-ic" type="button" data-say="' + esc(c.w) + '" aria-label="Listen">' + svg(IC.sound) + '</button>' : '') + '</div>'
      + '<div class="eb-cardb">' + (deck.open ? '<button class="pdp-btn ghost eb-big-ghost" type="button" data-know="0">Not yet</button><button class="pdp-btn primary" type="button" data-know="1">' + svg(IC.check) + 'I knew it</button>' : '<button class="pdp-btn primary" type="button" data-know="show">Show the answer</button>') + '</div></div>';
    var b = root.querySelector(deck.open ? '[data-know="1"]' : '[data-know="show"]'); if (b) b.focus({ preventScroll: true });
  }

  /* ───────── one unit: the book page (assets/js/ebook-render.js), its exercises checked one by one ───────── */
  var current = null;   // { bookId, unitId, data, page }
  function unitBox(r) {
    if (!r) return '';
    var ok = r.passed; var pct = r.unitTotal ? Math.round((r.best / r.unitTotal) * 100) : 0;
    return '<div class="eb-score ' + (ok ? 'ok' : 'bad') + '">' + svg(ok ? IC.trophy : IC.target) + '<div><b>' + (r.task ? 'This unit so far: ' : '') + r.best + ' / ' + r.unitTotal + ' · ' + pct + '%</b><span>'
      + (ok ? 'Unit learned.' + (r.task ? ' Keep going with the other exercises.' : '') : 'You need ' + r.pass + '% of the unit to learn it. Every exercise counts with its best try.')
      + '</span></div></div>';
  }
  function taskScore(page, taskId, got, total) {
    var sec = page.querySelector('.ebk-task[data-task="' + taskId + '"]'); if (!sec) return;
    var s = sec.querySelector('.ebk-tscore'); if (s) { s.textContent = got + ' / ' + total; s.className = 'ebk-tscore ' + (got / total >= 0.6 ? 'ok' : 'bad'); }
    var c = sec.querySelector('[data-check-task]'); if (c) { c.hidden = true; c.disabled = false; }
    var a = sec.querySelector('[data-again-task]'); if (a) a.hidden = false;
  }
  function showBest(page, tasks) {
    Object.keys(tasks || {}).forEach(function (t) {
      var sec = page.querySelector('.ebk-task[data-task="' + t + '"]'); if (!sec) return;
      var b = sec.querySelector('.ebk-tbest'); if (b) b.textContent = 'Your best: ' + tasks[t] + ' / ' + sec.getAttribute('data-points');
    });
  }
  var SIZES = ['s', 'm', 'l'];
  function look() {   // one or two pages, the size of the text
    var rd = root.querySelector('.eb-reader'); if (!rd) return;
    var sh = rd.querySelector('.ebk-spread:not(.one)');
    var room = (rd.classList.contains('is-full') ? window.innerWidth : rd.parentNode.clientWidth) >= 1080;
    var two = !!sh && room && pref('two', '1') === '1';
    rd.classList.toggle('is-two', two);
    SIZES.forEach(function (z) { rd.classList.toggle('sz-' + z, pref('size', 'm') === z); });
    var b = rd.querySelector('[data-tool="two"]'); if (b) { b.hidden = !sh; b.disabled = !room; b.classList.toggle('on', two); b.setAttribute('aria-pressed', String(two)); b.title = room ? (two ? 'One page' : 'Two pages') : 'Two pages need a wider window (try full screen)'; }
  }
  /* the answers that are not checked yet stay in this browser */
  var draftKey = function () { return 'd:' + current.bookId + '/' + current.unitId; };
  function keepDraft() {
    if (!current || !window.IXEbook) return;
    var out = {}, n = 0;
    current.page.querySelectorAll('.ebk-task').forEach(function (t) {
      if (t.querySelector('.done')) return;
      var a = window.IXEbook.collect(current.page, t.getAttribute('data-task')).answers;
      Object.keys(a).forEach(function (k) { if (a[k]) { out[k] = a[k]; n++; } });
    });
    setPref(draftKey(), n ? JSON.stringify(out) : null);
  }
  var draftT = 0;
  function draftSoon() { clearTimeout(draftT); var c = current; draftT = setTimeout(function () { if (c === current) keepDraft(); }, 350); }

  /* a collocation of the page: hear it, keep it */
  function sentenceOf(b) {
    var block = b.closest('p,li,td,.ebk-egl,.ebk-tip,.ebk-say span') || b.parentNode;
    var all = block.textContent.replace(/\s+/g, ' ').trim(); var w = b.textContent.replace(/\s+/g, ' ').trim();
    if (block.tagName === 'TD' && norm(all) === norm(w)) { var ex = block.nextElementSibling; if (ex && ex.textContent.toLowerCase().indexOf(w.toLowerCase().split(' ')[0]) > -1) return ex.textContent.trim(); }
    var at = 0; try { var r = document.createRange(); r.setStart(block, 0); r.setEnd(b, 0); at = r.toString().replace(/\s+/g, ' ').length; } catch (e) { at = all.indexOf(w); }
    var from = Math.max(all.lastIndexOf('. ', at), all.lastIndexOf('? ', at), all.lastIndexOf('! ', at)); from = from < 0 ? 0 : from + 2;
    var z = all.slice(at).search(/[.?!](?:\s|$)/); return all.slice(from, z < 0 ? all.length : at + z + 1).trim().slice(0, 240);
  }
  function closePop() { var p = document.querySelector('.eb-pop'); if (p) p.remove(); }
  function openPop(b) {
    closePop();
    var w = b.textContent.replace(/\s+/g, ' ').trim().replace(/[.,;:]+$/, ''); if (norm(w).length < 2) return;
    var p = document.createElement('div'); p.className = 'eb-pop'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', w);
    p.innerHTML = '<b>' + esc(w) + '</b><button type="button" data-say="' + esc(w) + '">' + svg(IC.sound) + 'Listen</button>'
      + (current && current.data.signedIn ? '<button type="button" class="' + (kept(w) ? 'on' : '') + '" data-pop-keep>' + svg(IC.star) + (kept(w) ? 'Kept' : 'Keep') + '</button>' : '<a href="' + esc(signInHref()) + '">' + svg(IC.star) + 'Sign in to keep</a>');
    document.body.appendChild(p);
    var r = b.getBoundingClientRect(); var pw = p.offsetWidth, ph = p.offsetHeight;
    p.style.left = Math.max(8, Math.min(window.innerWidth - pw - 8, r.left + r.width / 2 - pw / 2)) + 'px';
    p.style.top = (r.top > ph + 12 ? r.top - ph - 8 : r.bottom + 8) + 'px';
    p.addEventListener('click', function (e) {
      var k = e.target.closest('[data-pop-keep]'); if (!k) return;
      k.disabled = true; var was = kept(w);
      saveNote(was ? { remove: w } : { add: { w: w, s: sentenceOf(b), book: current.bookId, unit: current.unitId } }).then(function () { markKept(); note(was ? 'Taken out of your notebook' : 'Kept in your notebook'); closePop(); }).catch(function (err) { k.disabled = false; note(err.message, true); });
    });
  }
  function markKept() {
    if (!current || !current.page) return;
    current.page.querySelectorAll('.ebk-left b,.ebk-part b').forEach(function (b) { if (isTerm(b)) b.classList.toggle('is-kept', kept(b.textContent.replace(/[.,;:]+$/, ''))); });
  }
  var isTerm = function (b) { return b && b.tagName === 'B' && !!b.closest('.ebk-live') && !/:\s*$/.test(b.textContent) && !b.closest('.ebk-task,.ebk-foot,.ebk-sec,.ebk-uh') && !b.classList.contains('ebk-who') && !b.classList.contains('ebk-notes-t') && !b.classList.contains('ebk-words-t') && !b.closest('.ebk-mail-m'); };

  function renderUnit(bookId, unitId, my) {
    var back = '<button class="pdp-back" type="button" data-go="' + esc(bookId) + '">' + svg(IC.back) + 'Back to the book</button>';
    var show = function (d) {
      var R = window.IXEbook;
      var u = d.unit, nav = d.nav, mine = d.mine; var st = unitState(mine);
      var style = (d.book && d.book.style) || 'site';
      var tool = function (id, ic, label, cls) { return '<button class="eb-tool' + (cls || '') + '" type="button" data-tool="' + id + '" title="' + label + '" aria-label="' + label + '">' + svg(ic) + '</button>'; };
      var toc = groupsOf(d.contents || []);
      var tools = '<div class="eb-tools">' + '<button class="eb-tool eb-tool-t" type="button" data-tool="toc" aria-expanded="false">' + svg(IC.list) + 'Contents</button>' + (style === 'inuse' ? '<a class="eb-tool eb-tool-t" href="#' + esc(bookId) + '/index">' + svg(IC.az) + 'Index</a>' : '') + (d.signedIn ? '<a class="eb-tool eb-tool-t" href="#notebook">' + svg(IC.star) + 'Notebook</a>' : '')
        + '<span class="eb-tools-r">' + tool('two', IC.two, 'Two pages') + '<button class="eb-tool eb-tool-a" type="button" data-tool="smaller" aria-label="Smaller text" title="Smaller text">A<small>−</small></button><button class="eb-tool eb-tool-a" type="button" data-tool="bigger" aria-label="Bigger text" title="Bigger text">A<small>+</small></button>' + tool('full', IC.full, 'Full screen') + tool('print', IC.print, 'Print this unit') + '</span></div>'
        + '<nav class="eb-toc" hidden aria-label="Contents">' + toc.map(function (g) { return (g.name ? '<h3>' + esc(g.name) + '</h3>' : '') + '<ol>' + g.items.map(function (x) { return '<li><a href="#' + esc(bookId) + '/' + esc(x.u.id) + '"' + (x.u.id === unitId ? ' aria-current="page"' : '') + '><b>' + (x.i + 1) + '</b>' + esc(x.u.title) + (x.u.hidden ? ' <i>hidden</i>' : '') + '</a></li>'; }).join('') + '</ol>'; }).join('') + '</nav>';
      var steps = '<div class="eb-steps' + (d.book.units > 40 ? ' many' : '') + '">' + Array.apply(null, Array(d.book.units)).map(function (_, i) { return '<i class="' + (i < nav.index ? 'past' : i === nav.index ? 'now' : '') + '"></i>'; }).join('') + '</div>';
      var html = back;
      if (style === 'site') {
        html += '<div class="eb-unit-head"><div class="eb-unit-top"><span class="eb-crumb">' + esc(d.book.title) + ' · Unit ' + (nav.index + 1) + ' of ' + d.book.units + '</span><span class="eb-state ' + st.cls + '">' + esc(st.label) + '</span></div>'
          + '<div class="pdp-item-head">' + kindChip(u.kind) + (u.minutes ? '<span class="pdp-meta-chip">' + svg(IC.clock) + u.minutes + ' min</span>' : '') + '</div><h1>' + esc(u.title) + '</h1>' + (u.summary ? '<p>' + esc(u.summary) + '</p>' : '') + steps + '</div>';
      } else {
        html += '<div class="eb-unit-head eb-unit-bar"><div class="eb-unit-top"><span class="eb-crumb">' + esc(d.book.title) + ' · Unit ' + (nav.index + 1) + ' of ' + d.book.units + (u.group ? ' · ' + esc(u.group) : '') + (u.minutes ? ' · about ' + u.minutes + ' min' : '') + '</span><span class="eb-state ' + st.cls + '">' + esc(st.label) + '</span></div>' + steps + '</div>';
      }
      html += tools;
      if (u.audio && safeHref(u.audio)) html += '<div class="eb-audio">' + svg(IC.headphones) + '<audio controls preload="metadata" src="' + esc(safeHref(u.audio)) + '"></audio></div>';
      if (u.test && safeHref(u.test)) html += '<div class="eb-test">' + svg(IC.target) + '<div><b>' + esc(u.testLabel || 'Practise with a test of the website') + '</b><span>' + (u.points ? 'Do the test, then the exercises below.' : 'Finish the test and this unit counts as learned.') + (mine && mine.done && !u.points ? ' ✓ Done.' : '') + '</span></div><a class="pdp-btn open" href="' + esc(safeHref(u.test)) + '">' + svg(IC.arrow) + 'Open the test</a></div>';
      html += '<div class="ebk' + (style === 'inuse' ? ' ebk-live' : '') + ' ebk-' + esc(style) + '">' + (R ? R.sheet(u.doc || [], { style: style, unit: nav.index + 1, title: u.title, summary: u.summary, book: d.book.title }) : '<div class="ebk-page"><p>Reload the page to open this unit.</p></div>') + '</div>';
      if (u.points) {
        html += '<div class="eb-unit-foot"><div class="pnl-ex-actions"><button class="pdp-btn primary" type="button" data-check-all>' + svg(IC.check) + 'Check all answers</button>'
          + (d.signedIn ? '<span class="eb-signin">Or check each exercise with its own button. Your best try of every exercise is kept.</span>' : '<span class="eb-signin"><a href="' + esc(signInHref()) + '">Sign in</a> to check your answers and save your progress.</span>') + '</div>'
          + '<div class="eb-result" aria-live="polite">' + (mine && mine.attempts ? unitBox({ best: mine.best, unitTotal: u.points, passed: mine.done, pass: 60, task: 'x' }) : '') + '</div></div>';
      } else if (!u.test) {
        html += '<div class="eb-read">' + (mine && mine.done ? '<span class="eb-state done">' + svg(IC.check) + ' You have read this unit</span>' : d.signedIn ? '<button class="pdp-btn primary" type="button" data-read>' + svg(IC.check) + 'I have read it</button><span class="muted">Marks this unit as learned.</span>' : '<span class="eb-signin"><a href="' + esc(signInHref()) + '">Sign in</a> to save your progress.</span>') + '</div>';
      }
      html += '<div class="eb-nav">' + (nav.prev ? '<a class="pdp-btn ghost eb-big-ghost" href="#' + esc(bookId) + '/' + esc(nav.prev) + '">' + svg(IC.back) + 'Previous unit</a>' : '<span></span>')
        + (nav.next ? '<a class="pdp-btn primary" href="#' + esc(bookId) + '/' + esc(nav.next) + '">Next unit' + svg(IC.arrow) + '</a>' : '<a class="pdp-btn primary" href="#' + esc(bookId) + '">' + svg(IC.check) + 'Back to the book</a>') + '</div>';
      root.innerHTML = '<div class="pdp eb-reader' + (style === 'site' ? '' : ' eb-reader-book') + '">' + html + '</div>';
      var page = root.querySelector('.ebk');
      current = { bookId: bookId, unitId: unitId, data: d, page: page };
      if (R && page) {
        R.bind(page, onTask); if (mine) showBest(page, mine.tasks);
        var saved = null; try { saved = JSON.parse(pref(draftKey(), 'null')); } catch (e) { saved = null; }
        if (saved && R.restore(page, saved)) note('Your unfinished answers are back.');
        page.addEventListener('input', draftSoon); page.addEventListener('change', draftSoon); page.addEventListener('click', function (e) { if (e.target.closest('.ebk-pk')) draftSoon(); else { var b = e.target.closest('b'); if (isTerm(b)) { e.stopPropagation(); openPop(b); } } });
        if (d.signedIn) loadNotes().then(function () { if (my === turn) markKept(); }).catch(function () { /* the notebook opens later */ });
      }
      look();
      if (pref('full', '') === '1') full(true);
      var au = root.querySelector('.eb-audio audio');
      if (au) au.addEventListener('play', function () { document.dispatchEvent(new CustomEvent('ix:media-play', { detail: { from: 'ebook' } })); });
      window.scrollTo(0, 0);
    };
    root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-skel"></div></div>';
    call('GET', '/api/ebooks/' + encodeURIComponent(bookId) + '/' + encodeURIComponent(unitId)).then(function (d) { if (my === turn) show(d); })
      .catch(function (e) {
        if (my !== turn) return;
        full(false);
        if (e.status === 403) { renderBook(bookId, my); return; }
        root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-empty"><strong>Could not open this unit</strong>' + esc(e.message) + '</div></div>';
      });
  }
  /* Check one exercise (task) or all of them (no task) */
  function check(taskId, btn) {
    if (!current || !window.IXEbook) return;
    var d = current.data, page = current.page, R = window.IXEbook;
    if (!d.signedIn) { keepDraft(); location.href = signInHref(); return; }
    var mineNow = current, bookId = current.bookId;
    var got = R.collect(page, taskId);
    if (!got.count) return;
    if (got.empty && !confirm(got.empty + (got.empty === 1 ? ' answer is' : ' answers are') + ' still empty. Check anyway?')) return;
    if (btn) btn.disabled = true;
    var all = root.querySelector('[data-check-all]'); if (!taskId && all) all.disabled = true;
    call('POST', '/api/ebooks/' + encodeURIComponent(current.bookId) + '/' + encodeURIComponent(current.unitId) + '/check', taskId ? { answers: got.answers, task: taskId } : { answers: got.answers }).then(function (r) {
      if (current !== mineNow) { delete bookCache[bookId]; list = null; return; }   // the student has gone on to another page: the result is saved
      R.mark(page, r.results);
      var per = {};
      r.results.forEach(function (x) { var t = per[x.task] || (per[x.task] = { got: 0, total: 0 }); t.got += x.got; t.total += x.points; });
      Object.keys(per).forEach(function (t) { taskScore(page, t, per[t].got, per[t].total); });
      showBest(page, r.mine && r.mine.tasks);
      var res = root.querySelector('.eb-result'); if (res) res.innerHTML = unitBox(r);
      if (all) { all.disabled = false; if (!taskId) all.hidden = true; }
      var st = unitState(r.mine); var pill = root.querySelector('.eb-unit-top .eb-state'); if (pill) { pill.className = 'eb-state ' + st.cls; pill.textContent = st.label; }
      delete bookCache[bookId]; list = null;
      if (current !== mineNow) return;
      keepDraft();
      if (!taskId && res) res.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).catch(function (e) { note(e.message, true); if (btn) btn.disabled = false; if (all) all.disabled = false; });
  }
  function onTask(action, taskId, btn) {
    if (action === 'check') return check(taskId, btn);
    if (!current) return;
    window.IXEbook.reset(current.page, taskId);
    var sec = current.page.querySelector('.ebk-task[data-task="' + taskId + '"]'); if (!sec) return;
    var c = sec.querySelector('[data-check-task]'); if (c) { c.hidden = false; c.disabled = false; }
    var a = sec.querySelector('[data-again-task]'); if (a) a.hidden = true;
    var s = sec.querySelector('.ebk-tscore'); if (s) { s.textContent = ''; s.className = 'ebk-tscore'; }
    var all = root.querySelector('[data-check-all]'); if (all) all.hidden = false;
    keepDraft();
    var first = sec.querySelector('input:not([type=radio]):not([type=checkbox]),select,button.ebk-pk,input'); if (first) first.focus({ preventScroll: true });
  }

  /* full screen: the book over the whole window */
  function full(on) {
    var rd = root.querySelector('.eb-reader'); if (!rd) { document.documentElement.classList.remove('eb-isfull'); return; }
    rd.classList.toggle('is-full', on); document.documentElement.classList.toggle('eb-isfull', on);
    var b = rd.querySelector('[data-tool="full"]'); if (b) { b.classList.toggle('on', on); b.title = on ? 'Leave full screen (Esc)' : 'Full screen'; }
    look();
  }
  function tool(id, t) {
    var toc = root.querySelector('.eb-toc');
    if (id === 'toc' && toc) { toc.hidden = !toc.hidden; t.setAttribute('aria-expanded', String(!toc.hidden)); t.classList.toggle('on', !toc.hidden); if (!toc.hidden) { var cur = toc.querySelector('[aria-current]'); if (cur) toc.scrollTop = Math.max(0, cur.offsetTop - 120); } return; }
    if (id === 'two') { setPref('two', pref('two', '1') === '1' ? '0' : '1'); return look(); }
    if (id === 'smaller' || id === 'bigger') { var i = SIZES.indexOf(pref('size', 'm')); setPref('size', SIZES[Math.max(0, Math.min(2, i + (id === 'bigger' ? 1 : -1)))]); return look(); }
    if (id === 'full') { var on = !root.querySelector('.eb-reader.is-full'); setPref('full', on ? '1' : null); return full(on); }
    if (id === 'print') window.print();
  }

  /* ───────── events, start ───────── */
  document.addEventListener('click', function (e) {
    var sayBtn = e.target.closest && e.target.closest('[data-say]'); if (sayBtn) { say(sayBtn.getAttribute('data-say')); return; }
    if (!e.target.closest || !e.target.closest('.eb-pop')) closePop();
  });
  root.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cat],[data-go],[data-check-all],[data-read],[data-reset],[data-tool],[data-letter],[data-keep],[data-drop],[data-deck],[data-know]'); if (!t) return;
    if (t.hasAttribute('data-cat')) { cat = t.getAttribute('data-cat'); renderList(); return; }
    if (t.hasAttribute('data-go')) { var g = t.getAttribute('data-go'); if (g) location.hash = '#' + g; else { history.pushState('', document.title, location.pathname + location.search); route(); } return; }
    if (t.hasAttribute('data-tool')) { tool(t.getAttribute('data-tool'), t); return; }
    if (t.hasAttribute('data-letter')) { var l = t.getAttribute('data-letter'); var sec = document.getElementById('eb-l-' + (l === '#' ? 'x' : l)); if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (t.hasAttribute('data-keep')) {
      var w = t.getAttribute('data-keep'); t.disabled = true;
      saveNote(kept(w) ? { remove: w } : { add: { w: w, s: t.getAttribute('data-s'), book: t.getAttribute('data-book'), unit: t.getAttribute('data-unit') } }).then(function () { t.classList.toggle('on', kept(w)); t.setAttribute('aria-pressed', String(kept(w))); }).catch(function (err) { note(err.message, true); }).then(function () { t.disabled = false; });
      return;
    }
    if (t.hasAttribute('data-drop')) {
      t.disabled = true;
      saveNote({ remove: t.getAttribute('data-drop') }).then(function () { showNotebook.apply(null, showNotebook.args); }).catch(function (err) { t.disabled = false; note(err.message, true); });
      return;
    }
    if (t.hasAttribute('data-deck')) {
      var k = t.getAttribute('data-deck');
      if (k === 'end') return renderNotebook(turn);
      var cards = notes.filter(function (n) { return k === 'all' || dueNow(n); }).slice();
      for (var i = cards.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = cards[i]; cards[i] = cards[j]; cards[j] = x; }
      deck = { cards: cards.slice(0, 40), i: 0, open: false, right: 0 }; showCard(); return;
    }
    if (t.hasAttribute('data-know') && deck) {
      var v = t.getAttribute('data-know');
      if (v === 'show') { deck.open = true; return showCard(); }
      var card = deck.cards[deck.i]; if (v === '1') deck.right++;
      saveNote({ result: { w: card.w, ok: v === '1' } }).catch(function (err) { note(err.message, true); });
      deck.i++; deck.open = false; showCard(); return;
    }
    if (t.hasAttribute('data-check-all')) { check('', t); return; }
    if (t.hasAttribute('data-read') && current) {
      t.disabled = true; var bid = current.bookId, was = current;
      call('POST', '/api/ebooks/' + encodeURIComponent(bid) + '/' + encodeURIComponent(current.unitId) + '/read').then(function () {
        delete bookCache[bid]; list = null;
        if (current !== was) return;
        var box = root.querySelector('.eb-read'); if (box) box.innerHTML = '<span class="eb-state done">' + svg(IC.check) + ' You have read this unit</span>';
        var pill = root.querySelector('.eb-unit-top .eb-state'); if (pill) { pill.className = 'eb-state done'; pill.textContent = 'Learned'; }
      }).catch(function (err) { note(err.message, true); t.disabled = false; });
      return;
    }
    if (t.hasAttribute('data-reset')) {
      if (!confirm('Start this book again? Your progress in it is cleared (your test results and your notebook stay).')) return;
      var id = t.getAttribute('data-reset');
      call('POST', '/api/ebooks/' + encodeURIComponent(id) + '/reset').then(function () { delete bookCache[id]; list = null; route(); }).catch(function (err) { note(err.message, true); });
    }
  });
  root.addEventListener('input', function (e) {
    var id = e.target.id;
    if (id === 'eb-q') { query = e.target.value; var pos = e.target.selectionStart; renderList(); var q = document.getElementById('eb-q'); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (x) { /* fine */ } } }
    if (id === 'eb-find') findIn(e.target.getAttribute('data-book'), e.target.value);
    if (id === 'eb-ixq' || id === 'eb-nq') {
      var v = norm(e.target.value); var any = false;
      root.querySelectorAll(id === 'eb-ixq' ? '.eb-ix li' : '.eb-notes li').forEach(function (li) { var on = !v || li.getAttribute('data-w').indexOf(v) > -1; li.hidden = !on; if (on) any = true; });
      root.querySelectorAll('.eb-ixs').forEach(function (s) { s.hidden = !s.querySelector('li:not([hidden])'); });
      var none = document.getElementById('eb-ix0'); if (none) none.hidden = any;
    }
  });
  root.addEventListener('change', function (e) { if (e.target.id === 'eb-level') { level = e.target.value; renderList(); } });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePop(); var toc = root.querySelector('.eb-toc'); if (toc && !toc.hidden) { toc.hidden = true; var tb = root.querySelector('[data-tool="toc"]'); if (tb) { tb.classList.remove('on'); tb.setAttribute('aria-expanded', 'false'); } return; } if (root.querySelector('.eb-reader.is-full')) { setPref('full', null); full(false); } return; }
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !current || /^(?:INPUT|TEXTAREA|SELECT|AUDIO|VIDEO)$/.test((e.target && e.target.tagName) || '') || (e.target && e.target.isContentEditable)) return;
    var nav = current.data.nav; var to = e.key === 'ArrowRight' ? nav.next : e.key === 'ArrowLeft' ? nav.prev : null;
    if (to) { e.preventDefault(); location.hash = '#' + current.bookId + '/' + to; }
  });
  var lookT = 0; window.addEventListener('resize', function () { closePop(); clearTimeout(lookT); lookT = setTimeout(look, 120); });
  window.addEventListener('scroll', closePop, true);
  window.addEventListener('pagehide', function () { if (current) keepDraft(); });
  function loadList() {
    root.innerHTML = '<div class="pdp"><div class="pdp-grid"><div class="pdp-skel"></div><div class="pdp-skel"></div><div class="pdp-skel"></div></div></div>';
    var my = turn;
    call('GET', '/api/ebooks').then(function (d) { list = d; if (my === turn) renderList(); })
      .catch(function (e) { if (my === turn) root.innerHTML = '<div class="pdp"><div class="pdp-empty"><strong>Could not load the books</strong>' + esc(e.message) + ' <button class="pdp-btn sm ghost" type="button" onclick="location.reload()">Try again</button></div></div>'; });
  }
  function route() {
    if (current) keepDraft();
    current = null; deck = null; turn++; closePop();
    document.documentElement.classList.remove('eb-isfull');
    var h = location.hash.slice(1), m = /^(b-[a-f0-9]{8})(?:\/(u-[a-f0-9]{8}|index))?$/.exec(h);
    if (h === 'notebook') return renderNotebook(turn);
    if (m && m[2] === 'index') return renderIndex(m[1], turn);
    if (m && m[2]) return renderUnit(m[1], m[2], turn);
    if (m) return renderBook(m[1], turn);
    if (list) renderList(); else loadList();
  }
  window.addEventListener('hashchange', route);
  route();
})();
