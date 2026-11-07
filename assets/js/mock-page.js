/* IELTSX — the Mock Tests page (Mock tests.html). The cards come from GET /api/mocks (made in Admin → Mock tests): a mock
   is Listening + Reading + Writing in one sitting, opened in the exam shell /full-mock/?mock=<id>. The server says which
   cards this visitor may open and keeps their attempts (mock-tests.js); no paper is ever named here. */
(function () {
  'use strict';
  var root = document.getElementById('mk-root');
  if (!root || !window.fetch) return;

  var state = { mocks: null, signedIn: false, filter: 'all', error: '' };
  var PALETTE = [['#1e3a8a', '#be185d'], ['#0f766e', '#1d4ed8'], ['#7c2d12', '#c026d3'], ['#312e81', '#0e7490'], ['#831843', '#ea580c'], ['#14532d', '#0369a1']];
  var PLAN = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  var ICON = {
    clock: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    list: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
    screen: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    crown: '<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true"><path d="M3 18h18l-1.5-10-5 4.5L12 5l-2.5 7.5-5-4.5z"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function band(v) { return typeof v === 'number' && isFinite(v) ? v.toFixed(1) : '—'; }
  function hashOf(s) { var h = 5381; s = String(s || ''); for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h; }
  function safeImg(u) { u = String(u || ''); return /^(\/(uploads|assets|api\/media)\/[^"'<>\s]+|https:\/\/[^"'<>\s]+)$/i.test(u) ? u : ''; }
  function when(iso) { var d = new Date(iso); return isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); }
  var next = encodeURIComponent('/Mock tests');

  /* ── page shell bits ── */
  (function shell() {
    var nav = document.getElementById('ft-crumbs');
    if (nav) nav.innerHTML = '<a class="ft-crumb" href="/">Home</a><span class="ft-crumb-sep" aria-hidden="true">›</span><span class="ft-crumb-current" aria-current="page">Mock Tests</span>';
    document.querySelectorAll('[data-sidebar="menu-button"][data-active]').forEach(function (a) { a.setAttribute('data-active', 'false'); a.removeAttribute('aria-current'); });
    var a = document.querySelector('a[data-link="mock-tests"]');
    if (a) { a.setAttribute('data-active', 'true'); a.setAttribute('aria-current', 'page'); }
  })();

  /* ── the parts of the page ── */
  function hero() {
    var mine = (state.mocks || []).reduce(function (o, m) { o.n += m.attempts || 0; if (typeof m.best === 'number') o.best = Math.max(o.best, m.best); if (m.last && (!o.last || m.last.at > o.last.at)) o.last = m.last; return o; }, { n: 0, best: -1, last: null });
    var me = !state.signedIn
      ? '<div class="mt-me"><h2>Your results stay with you</h2><p>Sign in to take a mock, keep every band on your Performance page and get AI feedback on your Writing.</p><a class="mt-btn mt-btn-light" href="/login?next=' + next + '">Sign in</a></div>'
      : '<div class="mt-me"><h2>Your mock results</h2><div class="mt-stats">' +
        '<div class="mt-stat"><b>' + mine.n + '</b><span>mocks taken</span></div>' +
        '<div class="mt-stat"><b>' + (mine.best >= 0 ? mine.best.toFixed(1) : '—') + '</b><span>best band</span></div>' +
        '<div class="mt-stat"><b>' + (mine.last && typeof mine.last.band === 'number' ? mine.last.band.toFixed(1) : '—') + '</b><span>last band</span></div></div>' +
        '<p>' + (mine.n ? 'Every Listening, Reading and Writing band is on your <a href="/study/Tools/Performance">Performance page</a>.' : 'Your first mock shows where you stand on all three papers at once.') + '</p></div>';
    return '<section class="mt-hero"><div style="position:relative;z-index:1"><span class="mt-kicker">' + ICON.screen + ' Computer-delivered IELTS</span>' +
      '<h1>Full Mock Tests</h1><p>The whole exam in one sitting: Listening, Reading and Writing in full screen, timed like the real test. Bands are marked on the server; Writing gets AI feedback on the four criteria.</p>' +
      '<div class="mt-papers"><span class="mt-paper" style="--c:var(--mt-l)"><i></i><b>Listening</b> 4 parts · 40 questions</span><span class="mt-paper" style="--c:var(--mt-r)"><i></i><b>Reading</b> 3 passages · 60 min</span><span class="mt-paper" style="--c:var(--mt-w)"><i></i><b>Writing</b> Task 1 + Task 2 · 60 min</span></div></div>' + me + '</section>';
  }
  function steps() {
    var list = [['Choose a mock', 'Pick a card below and press Start. Each mock opens in full screen.'], ['Watch the guides', 'A short video before each paper shows the computer test screen.'],
      ['Take the three papers', 'Listening, then Reading, then Writing. Real exam mode ends each paper by the clock.'], ['Get your bands', 'Listening and Reading at once, Writing with AI feedback. Review every mistake.']];
    return '<section class="mt-steps" aria-label="How a mock works">' + list.map(function (s, i) { return '<div class="mt-step"><span class="mt-step-n">' + (i + 1) + '</span><div><h3>' + s[0] + '</h3><p>' + s[1] + '</p></div></div>'; }).join('') + '</section>';
  }
  function cover(m, i) {
    var img = safeImg(m.coverUrl), pal = PALETTE[hashOf(m.id) % PALETTE.length];
    var plan = m.plan === 'free' ? '<span class="mt-badge mt-badge-free">Free</span>' : '<span class="mt-badge mt-badge-plan">' + ICON.crown + esc(PLAN[m.plan] || 'Premium') + '</span>';
    return '<div class="mt-cover' + (img ? ' has-img' : '') + '" style="--a:' + pal[0] + ';--b:' + pal[1] + '">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : '') +
      '<div class="mt-cover-tags">' + (m.tier ? '<span class="mt-badge mt-badge-glass">' + esc(m.tier) + '</span>' : '<span></span>') + plan + '</div>' +
      (img ? '' : '<div class="mt-mark"><b>IELTS</b><span>Full mock · ' + String(i + 1).padStart(2, '0') + '</span></div><div class="mt-bars" aria-hidden="true"><i style="height:14px"></i><i style="height:22px"></i><i style="height:30px"></i></div>') + '</div>';
  }
  function actions(m) {
    var open = '/full-mock/?mock=' + encodeURIComponent(m.id);
    if (!state.signedIn) return '<a class="mt-btn mt-btn-main" href="/login?next=' + encodeURIComponent(open) + '">Sign in to start</a>';
    if (m.locked) return '<a class="mt-btn mt-btn-access" href="/Price?premium=required&plan=' + encodeURIComponent(m.plan) + '&next=' + next + '" data-get-access>' + ICON.crown + ' Get Access · ' + esc(PLAN[m.plan] || '') + '</a>';
    var label = m.inProgress ? 'Continue' : m.attempts ? 'Take again' : 'Start mock';
    return '<a class="mt-btn mt-btn-main" href="' + open + '">' + ICON.play + ' ' + label + '</a>' + (m.attempts ? '<a class="mt-btn mt-btn-ghost" href="/study/Tools/Performance" title="Your bands on the Performance page">Results</a>' : '');
  }
  function card(m, i) {
    var fresh = (m.fresh || []).length === 3 ? 'New papers every attempt' : (m.fresh || []).length ? 'Some papers change every attempt' : 'The same papers every time';
    var status = m.inProgress ? '<span class="mt-badge mt-badge-live">In progress</span>' : m.attempts ? '<span class="mt-badge mt-badge-done">' + ICON.check + ' Done</span>' : '';
    return '<article class="mt-card">' + cover(m, i) + '<div class="mt-body">' +
      '<div class="mt-title"><h3>' + esc(m.title) + '</h3>' + status + '</div>' +
      (m.description ? '<p class="mt-desc">' + esc(m.description) + '</p>' : '') +
      '<div class="mt-sections"><div class="mt-sec" style="--c:var(--mt-l)"><b>Listening</b><span>~30 min</span></div><div class="mt-sec" style="--c:var(--mt-r)"><b>Reading</b><span>60 min</span></div><div class="mt-sec" style="--c:var(--mt-w)"><b>Writing</b><span>60 min</span></div></div>' +
      '<div class="mt-meta"><span>' + ICON.clock + ' About 2 h 40 min</span><span>' + ICON.list + ' 80 questions + 2 tasks</span><span>' + ICON.shuffle + ' ' + fresh + '</span>' +
      (m.modes === 'real' ? '<span>' + ICON.screen + ' Real exam mode</span>' : m.modes === 'practice' ? '<span>' + ICON.screen + ' Practice mode</span>' : '') + '</div>' +
      (m.attempts ? '<div class="mt-result"><span>' + m.attempts + (m.attempts === 1 ? ' attempt' : ' attempts') + (m.last && m.last.at ? ' · last ' + esc(when(m.last.at)) : '') + '</span><span>Best <b>' + band(m.best) + '</b></span></div>' : '') +
      '<div class="mt-actions">' + actions(m) + '</div></div></article>';
  }
  function filtered() {
    var f = state.filter;
    return (state.mocks || []).filter(function (m) {
      return f === 'all' || (f === 'open' && !m.locked) || (f === 'done' && m.attempts) || (f === 'new' && !m.attempts);
    });
  }
  function render() {
    var list = filtered(), body;
    if (state.mocks === null) body = '<div class="mt-grid"><div class="mt-skel"></div><div class="mt-skel"></div><div class="mt-skel"></div></div>';
    else if (state.error && !state.mocks.length) body = '<div class="mt-empty">' + esc(state.error) + ' <button type="button" class="mt-btn mt-btn-ghost" data-mt="retry">Try again</button></div>';
    else if (!list.length) body = '<div class="mt-empty">' + (state.mocks.length ? 'No mock test matches this filter.' : 'New mock tests are coming soon.') + '</div>';
    else body = '<div class="mt-grid">' + list.map(function (m) { return card(m, state.mocks.indexOf(m)); }).join('') + '</div>';
    var seg = [['all', 'All'], ['open', 'Available to me'], ['new', 'Not taken'], ['done', 'Completed']].map(function (x) { return '<button type="button" data-mt="filter" data-v="' + x[0] + '" aria-pressed="' + (state.filter === x[0]) + '">' + x[1] + '</button>'; }).join('');
    root.innerHTML = '<div class="mt">' + hero() + steps() +
      '<div class="mt-bar"><h2>Mock tests<small>' + (state.mocks ? state.mocks.length + (state.mocks.length === 1 ? ' test' : ' tests') : '') + '</small></h2>' + (state.signedIn ? '<div class="mt-seg" role="group" aria-label="Show">' + seg + '</div>' : '') + '</div>' + body +
      '<section class="mt-rules" aria-label="Rules"><div><b>Full screen, start to finish</b><span>Leaving full screen or switching tabs is recorded in the integrity log of your result.</span></div>' +
      '<div><b>Real exam or Practice</b><span>Real exam mode has no submit button: each paper ends when its time is up. Practice lets you submit early.</span></div>' +
      '<div><b>Fair marking</b><span>Your answers are marked again on our server, and each paper opens only inside your own attempt.</span></div></section></div>';
  }

  function load() {
    state.error = ''; render();
    var ctl = window.AbortController ? new AbortController() : null; var t = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    fetch('/api/mocks', { credentials: 'same-origin', cache: 'no-store', signal: ctl ? ctl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { state.mocks = Array.isArray(d.mocks) ? d.mocks : []; state.signedIn = !!d.signedIn; })
      .catch(function () { state.mocks = state.mocks || []; state.error = 'The mock tests could not be loaded.'; })
      .then(function () { clearTimeout(t); render(); });
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-mt]'); if (!b) return;
    if (b.getAttribute('data-mt') === 'filter') { state.filter = b.getAttribute('data-v'); render(); }
    if (b.getAttribute('data-mt') === 'retry') { state.mocks = null; load(); }
  });
  // back from a mock (bfcache): show the new attempt at once
  window.addEventListener('pageshow', function (e) { if (e.persisted) load(); });
  document.title = 'IELTSX — Full Mock Tests';
  load();
})();
