/*
 * IELTSX — the Videos, Books and Grammar pages (videos.html, books.html, grammar.html; the root says which:
 * <main id="panel-root" data-panel="videos|books|grammar">). The items are made in the admin panel (admin.html#videos,
 * #books, #grammar) and come from /api/panels/<kind>; the server decides what a visitor may open (a locked item arrives
 * without its video, file or text). The look is the one of the Predictions page (assets/css/predictions.css: a title
 * with its icon, one filter card, "Showing …", cards with a picture on top) plus assets/css/panels.css.
 *   /videos              the videos; a card opens the player (YouTube / Vimeo, in a window over the page)
 *   /books               the books; "Open the book" opens its PDF / page in a new tab
 *   /grammar             the topics;  /grammar#<id>  one topic: the explanation and its exercises (checked here)
 */
(function () {
  'use strict';
  var root = document.getElementById('panel-root');
  if (!root) return;
  var KIND = root.getAttribute('data-panel');

  var IC = {
    video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    grammar: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>'
  };
  var PAGE = {
    videos: { title: 'Videos', icon: IC.video, sub: 'Video lessons for every part of the IELTS exam: tips, strategies and full walkthroughs.', unit: 'video', empty: 'No videos yet', color: '#ef4444' },
    books: { title: 'Books', icon: IC.book, sub: 'IELTS books and study guides to read online or download.', unit: 'book', empty: 'No books yet', color: '#0ea5e9' },
    grammar: { title: 'Grammar', icon: IC.grammar, sub: 'Grammar topics explained step by step, with examples and short exercises to check yourself.', unit: 'topic', empty: 'No grammar topics yet', color: '#8b5cf6' }
  }[KIND];
  if (!PAGE) return;
  var svg = function (p, cls) { return '<svg class="' + (cls || 'i') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var PLAN = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  var plural = function (n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); };
  var safeHref = function (u) { u = String(u || ''); return /^(https:\/\/|\/(?!\/))/i.test(u) ? u : ''; };

  var data = null, query = '', cat = '', level = '';
  var topicCache = {};

  function getJson(url) {
    return fetch(url, { credentials: 'same-origin', cache: 'no-store', headers: { accept: 'application/json' } }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (d) {
        if (d === null) { var e = new Error('The website server is not reachable. Please try again in a moment.'); e.status = r.status; throw e; }
        if (!r.ok) { var err = new Error(d.error || 'Something went wrong.'); err.status = r.status; err.data = d; throw err; }
        return d;
      });
    });
  }
  function priceHref(it) { return '/Price?premium=required&plan=' + encodeURIComponent(it.plan) + '&next=' + encodeURIComponent(location.pathname + (KIND === 'grammar' ? '#' + it.id : '')); }
  function planBadge(it) { return it.plan === 'free' ? '<span class="pdp-pill free">Free</span>' : '<span class="pdp-pill plan">' + svg(IC.crown) + esc(PLAN[it.plan] || it.plan) + '</span>'; }
  function lockedBtn(it) {
    if (!data.signedIn) return '<a class="pdp-btn get" href="/login?next=' + encodeURIComponent(location.pathname + location.hash) + '">' + svg(IC.lock) + 'Sign in to open</a>';
    return '<a class="pdp-btn get" href="' + esc(priceHref(it)) + '">' + svg(IC.crown) + 'Get ' + esc(PLAN[it.plan]) + '</a>';
  }

  /* ───────── the list ───────── */
  function shown() {
    var q = query.toLowerCase();
    return data.items.filter(function (it) {
      return (!cat || it.category === cat) && (!level || it.level === level)
        && (!q || [it.title, it.description, it.summary, it.author, it.category].join(' ').toLowerCase().indexOf(q) > -1);
    });
  }
  function cardHtml(it) {
    var chips = [];
    if (it.level) chips.push('<span class="pdp-chip">' + esc(it.level) + '</span>');
    if (it.category) chips.push('<span class="pdp-chip muted">' + esc(it.category) + '</span>');
    var media, info = '', btn;
    if (KIND === 'videos') {
      var cover = !it.locked || it.cover ? safeHref(it.cover) : '';
      media = '<div class="pdp-media pnl-media pnl-m-video">' + (cover ? '<img class="pnl-thumb" src="' + esc(cover) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '<div class="pdp-media-in">' + svg(IC.video, 'pdp-media-ic') + '</div>')
        + '<div class="pdp-tl">' + planBadge(it) + '</div>' + (it.duration ? '<div class="pdp-tr"><span class="pdp-pill dark">' + svg(IC.clock) + esc(it.duration) + '</span></div>' : '')
        + (it.locked ? '<span class="pdp-media-lock">' + svg(IC.lock) + '</span>' : '<span class="pnl-play">' + svg(IC.play) + '</span>') + '</div>';
      if (it.description) info = '<p class="pnl-desc">' + esc(it.description) + '</p>';
      btn = it.locked ? lockedBtn(it) : '<button class="pdp-btn open" type="button" data-play="' + esc(it.id) + '">' + svg(IC.play) + 'Watch</button>';
    } else if (KIND === 'books') {
      var bc = safeHref(it.cover);
      media = '<div class="pdp-media pnl-media pnl-m-book">' + (bc ? '<img class="pnl-cover" src="' + esc(bc) + '" alt="" loading="lazy">' : '<div class="pdp-media-in">' + svg(IC.book, 'pdp-media-ic') + '<span>' + esc(it.title) + '</span></div>')
        + '<div class="pdp-tl">' + planBadge(it) + '</div>' + (it.locked ? '<span class="pdp-media-lock">' + svg(IC.lock) + '</span>' : '') + '</div>';
      if (it.author) info += '<div class="pdp-line">' + svg(IC.user) + '<span>' + esc(it.author) + '</span></div>';
      if (it.pages) chips.push('<span class="pdp-chip muted">' + svg(IC.file) + esc(it.pages) + ' pages</span>');
      if (it.description) info += '<p class="pnl-desc">' + esc(it.description) + '</p>';
      var file = safeHref(it.file);
      btn = it.locked ? lockedBtn(it) : file ? '<a class="pdp-btn open" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer">' + svg(IC.ext) + 'Open the book</a>' : '<span class="pdp-btn soon">Coming soon</span>';
    } else {
      media = '<div class="pdp-media pnl-media pnl-m-grammar"><div class="pdp-media-in">' + svg(IC.grammar, 'pdp-media-ic') + '<span>' + esc(it.level ? it.level + ' · ' : '') + esc(it.category || 'Grammar') + '</span></div>'
        + '<div class="pdp-tl">' + planBadge(it) + '</div>' + (it.locked ? '<span class="pdp-media-lock">' + svg(IC.lock) + '</span>' : '') + '</div>';
      if (it.summary) info = '<p class="pnl-desc">' + esc(it.summary) + '</p>';
      if (it.exercises) chips.push('<span class="pdp-chip">' + svg(IC.pencil) + plural(it.exercises, 'exercise') + '</span>');
      btn = it.locked ? lockedBtn(it) : '<a class="pdp-btn open" href="#' + esc(it.id) + '">' + svg(IC.arrow) + 'Open the lesson</a>';
    }
    return '<article class="pdp-card pnl-card" id="card-' + esc(it.id) + '">' + media + '<div class="pdp-body"><h3>' + esc(it.title) + '</h3>' + info
      + '<div class="pdp-chips">' + chips.join('') + '</div><div class="pdp-foot">' + btn + '</div></div></article>';
  }
  function headHtml() {
    var me = data.signedIn ? '<div class="pdp-me"><span>Your plan</span><b>' + esc(PLAN[data.plan] || 'Free') + '</b>' + (data.level < 3 ? '<a class="pdp-btn sm get" href="/Price">' + svg(IC.crown) + 'Upgrade</a>' : '') + '</div>'
      : '<div class="pdp-me"><span>Not signed in</span><a class="pdp-btn sm ghost" href="/login?next=' + encodeURIComponent(location.pathname) + '">Sign in</a></div>';
    return '<div class="pdp-head"><div class="pdp-title"><span class="pdp-title-ic" style="color:' + PAGE.color + '">' + svg(PAGE.icon) + '</span><div><h1>' + esc(PAGE.title) + '</h1><p>' + esc(PAGE.sub) + '</p></div></div>' + me + '</div>';
  }
  function renderList() {
    var cats = []; var levels = [];
    data.items.forEach(function (it) { if (it.category && cats.indexOf(it.category) < 0) cats.push(it.category); if (it.level && levels.indexOf(it.level) < 0) levels.push(it.level); });
    levels.sort();
    var tab = function (v, n, count) { return '<button class="pdp-tab' + (cat === v ? ' on' : '') + '" type="button" data-cat="' + esc(v) + '">' + esc(n) + '<span class="n">' + count + '</span></button>'; };
    var list = shown();
    var html = headHtml();
    if (!data.items.length) {
      html += '<div class="pdp-empty"><strong>' + esc(PAGE.empty) + '</strong>New ' + esc(PAGE.unit) + 's are added here by our teachers. Please check back soon.</div>';
      root.innerHTML = '<div class="pdp">' + html + '</div>'; return;
    }
    html += '<div class="pdp-filter"><div class="pdp-searchrow"><label class="pdp-search">' + svg(IC.search) + '<input type="search" id="pnl-q" placeholder="Search ' + esc(PAGE.unit) + 's…" value="' + esc(query) + '" autocomplete="off"></label></div>'
      + '<div class="pdp-filterrow"><div class="pdp-tabs" role="group" aria-label="Category">' + tab('', 'All', data.items.length) + cats.map(function (c) { return tab(c, c, data.items.filter(function (x) { return x.category === c; }).length); }).join('') + '</div>'
      + (levels.length ? '<label class="pdp-select">Level <select id="pnl-level"><option value="">All</option>' + levels.map(function (l) { return '<option' + (l === level ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') + '</select></label>' : '') + '</div></div>';
    html += '<p class="pdp-count">Showing ' + list.length + ' of ' + plural(data.items.length, PAGE.unit) + '</p>';
    html += list.length ? '<div class="pdp-grid pnl-grid-' + KIND + '">' + list.map(cardHtml).join('') + '</div>' : '<div class="pdp-empty"><strong>Nothing found</strong>Try another word or category.</div>';
    root.innerHTML = '<div class="pdp">' + html + '</div>';
  }

  /* ───────── the video player (a window over the page) ───────── */
  function embedUrl(it) {
    return it.provider === 'vimeo' ? 'https://player.vimeo.com/video/' + encodeURIComponent(it.videoId) + '?autoplay=1&dnt=1'
      : 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(it.videoId) + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
  }
  function openPlayer(it) {
    if (!it || it.locked || !/^[A-Za-z0-9_-]{5,20}$/.test(String(it.videoId || ''))) return;
    document.dispatchEvent(new CustomEvent('ix:media-play', { detail: { from: 'video' } }));   // the site music pauses (site-music.js)
    var prev = document.activeElement;
    var ov = document.createElement('div'); ov.className = 'pnl-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', it.title);
    ov.innerHTML = '<div class="pnl-player"><div class="pnl-player-top"><h2>' + esc(it.title) + '</h2><button class="pnl-x" type="button" aria-label="Close">' + svg(IC.x) + '</button></div>'
      + '<div class="pnl-frame"><iframe src="' + esc(embedUrl(it)) + '" title="' + esc(it.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>'
      + (it.description ? '<p class="pnl-player-desc">' + esc(it.description) + '</p>' : '') + '</div>';
    document.body.appendChild(ov); document.body.style.overflow = 'hidden';
    var close = function () { ov.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', key); if (prev && prev.focus) prev.focus(); };
    var key = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) close(); });
    ov.querySelector('.pnl-x').onclick = close; ov.querySelector('.pnl-x').focus();
  }

  /* ───────── a grammar topic ───────── */
  /* the admin's text -> HTML, everything escaped first: "## " / "### " headings, "- " bullets, "1. " numbered, "> " an
     example, "! " a tip, "| a | b |" a table (first row = headings), **bold**, *italic*, `code`, ==marked== */
  function inline(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/==([^=]+)==/g, '<mark>$1</mark>');
  }
  function markup(src) {
    var lines = String(src || '').replace(/\r/g, '').split('\n'); var out = []; var i = 0;
    while (i < lines.length) {
      var l = lines[i], t = l.trim(), m;
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
  var norm = function (s) { return String(s || '').toLowerCase().replace(/[‘’]/g, "'").replace(/[.!?,;:]+$/g, '').replace(/\s+/g, ' ').trim(); };
  function exerciseHtml(ex, n) {
    var q = esc(ex.q).replace(/_{2,}/g, '<span class="pnl-gap">_____</span>');
    var body = ex.options && ex.options.length
      ? '<div class="pnl-opts">' + ex.options.map(function (o, k) { return '<label class="pnl-opt"><input type="radio" name="ex' + n + '" value="' + esc(o) + '"><span class="pnl-opt-l">' + String.fromCharCode(65 + k) + '</span><span>' + esc(o) + '</span></label>'; }).join('') + '</div>'
      : '<input class="pnl-input" type="text" data-ex="' + n + '" autocomplete="off" spellcheck="false" placeholder="Your answer">';
    return '<li class="pnl-ex" data-n="' + n + '"><div class="pnl-ex-q"><span class="pdp-num-tag">' + (n + 1) + '</span><span>' + q + '</span></div>' + body + '<div class="pnl-ex-fb" hidden></div></li>';
  }
  function renderTopic(id) {
    var it = data && data.items.filter(function (x) { return x.id === id; })[0];
    var back = '<button class="pdp-back" type="button" data-back>' + svg(IC.back) + 'All topics</button>';
    if (!it) { root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-empty"><strong>This topic is not available</strong>It may have been removed.</div></div>'; return; }
    var head = '<div class="pdp-dhead"><div class="pdp-dmedia pnl-m-grammar">' + svg(IC.grammar, 'pdp-media-ic') + '</div><div class="pdp-dmain"><div class="pdp-pills">' + planBadge(it)
      + (it.level ? '<span class="pdp-pill soft">' + esc(it.level) + '</span>' : '') + (it.category ? '<span class="pdp-pill soft">' + esc(it.category) + '</span>' : '') + '</div><h1>' + esc(it.title) + '</h1>'
      + (it.summary ? '<p>' + esc(it.summary) + '</p>' : '') + '</div></div>';
    if (it.locked) {
      root.innerHTML = '<div class="pdp">' + back + head + '<div class="pdp-locked"><div class="big">' + svg(IC.lock) + '</div><h2>This lesson is for ' + esc(PLAN[it.plan]) + ' members</h2><p>Upgrade your plan to read the explanation and do the exercises.</p>' + lockedBtn(it) + '</div></div>';
      return;
    }
    var show = function (t) {
      var exs = t.exercises || [];
      root.innerHTML = '<div class="pdp">' + back + head
        + (t.content ? '<article class="pnl-lesson">' + markup(t.content) + '</article>' : '')
        + (exs.length ? '<section class="pnl-exercises"><h2>' + svg(IC.pencil) + 'Practice</h2><ol class="pnl-ex-list">' + exs.map(exerciseHtml).join('') + '</ol>'
          + '<div class="pnl-ex-actions"><button class="pdp-btn primary" type="button" data-check>' + svg(IC.check) + 'Check answers</button><button class="pdp-btn ghost" type="button" data-reset>Try again</button><span class="pnl-score" aria-live="polite"></span></div></section>' : '')
        + '</div>';
      root.__topic = t;
      window.scrollTo(0, 0);
    };
    if (topicCache[id]) return show(topicCache[id]);
    root.innerHTML = '<div class="pdp">' + back + head + '<div class="pdp-skel"></div></div>';
    getJson('/api/panels/grammar/' + encodeURIComponent(id)).then(function (d) { topicCache[id] = d.item; if (location.hash.slice(1) === id) show(d.item); })
      .catch(function (e) {
        if (e.status === 403 && e.data && e.data.item) { it.locked = true; it.plan = e.data.item.plan; return renderTopic(id); }
        root.innerHTML = '<div class="pdp">' + back + '<div class="pdp-empty"><strong>Could not open this topic</strong>' + esc(e.message) + '</div></div>';
      });
  }
  function checkAnswers(reset) {
    var t = root.__topic; if (!t) return;
    var right = 0;
    (t.exercises || []).forEach(function (ex, n) {
      var li = root.querySelector('.pnl-ex[data-n="' + n + '"]'); if (!li) return;
      var fb = li.querySelector('.pnl-ex-fb');
      if (reset) { li.classList.remove('ok', 'bad'); fb.hidden = true; li.querySelectorAll('input').forEach(function (x) { if (x.type === 'radio') x.checked = false; else x.value = ''; x.disabled = false; }); return; }
      var given = ex.options && ex.options.length ? ((li.querySelector('input:checked') || {}).value || '') : (li.querySelector('.pnl-input') || {}).value || '';
      var ok = String(ex.answer).split('|').some(function (a) { return norm(a) === norm(given) && norm(given) !== ''; });
      if (ok) right++;
      li.classList.toggle('ok', ok); li.classList.toggle('bad', !ok);
      fb.hidden = false;
      fb.innerHTML = (ok ? svg(IC.check) + '<b>Correct.</b>' : svg(IC.x) + '<b>Answer:</b> ' + esc(String(ex.answer).split('|')[0])) + (ex.explain ? ' <span>' + esc(ex.explain) + '</span>' : '');
    });
    var sc = root.querySelector('.pnl-score');
    if (sc) sc.textContent = reset ? '' : right + ' / ' + (t.exercises || []).length + ' correct';
    if (reset) window.scrollTo({ top: (root.querySelector('.pnl-exercises') || root).offsetTop - 80, behavior: 'smooth' });
  }

  /* ───────── events, start ───────── */
  root.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cat],[data-play],[data-back],[data-check],[data-reset]'); if (!t) return;
    if (t.hasAttribute('data-cat')) { cat = t.getAttribute('data-cat'); renderList(); return; }
    if (t.hasAttribute('data-play')) { openPlayer(data.items.filter(function (x) { return x.id === t.getAttribute('data-play'); })[0]); return; }
    if (t.hasAttribute('data-back')) { history.pushState('', document.title, location.pathname + location.search); route(); return; }
    if (t.hasAttribute('data-check')) { checkAnswers(false); return; }
    if (t.hasAttribute('data-reset')) checkAnswers(true);
  });
  root.addEventListener('input', function (e) {
    if (e.target.id === 'pnl-q') { query = e.target.value; var pos = e.target.selectionStart; renderList(); var q = document.getElementById('pnl-q'); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (x) { /* fine */ } } }
  });
  root.addEventListener('change', function (e) { if (e.target.id === 'pnl-level') { level = e.target.value; renderList(); } });
  function route() {
    if (!data) return;
    var id = location.hash.slice(1);
    if (KIND === 'grammar' && /^g-[a-f0-9]{8}$/.test(id)) renderTopic(id); else renderList();
  }
  window.addEventListener('hashchange', route);
  root.innerHTML = '<div class="pdp"><div class="pdp-grid"><div class="pdp-skel"></div><div class="pdp-skel"></div><div class="pdp-skel"></div></div></div>';
  getJson('/api/panels/' + KIND).then(function (d) { data = d; route(); })
    .catch(function (e) { root.innerHTML = '<div class="pdp"><div class="pdp-empty"><strong>Could not load the ' + esc(PAGE.unit) + 's</strong>' + esc(e.message) + ' <button class="pdp-btn sm ghost" type="button" onclick="location.reload()">Try again</button></div></div>'; });
})();
