/* IELTSX vocabulary list page (/vocabulary): collections, study-by-test, Premium unlock dialog. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var I = {
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    crown: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11.56 3.27a.5.5 0 0 1 .88 0l2.95 5.6a1 1 0 0 0 1.52.29l4.28-3.67a.5.5 0 0 1 .8.52l-2.83 10.25a1 1 0 0 1-.96.73H5.81a1 1 0 0 1-.96-.73L2.02 6.02a.5.5 0 0 1 .8-.52l4.28 3.67a1 1 0 0 0 1.52-.29z"/><path d="M5 21h14"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    book: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/></svg>',
    head: '<svg class="vx-test-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>',
    rd: '<svg class="vx-test-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>'
  };
  var state = { items: [], uid: null, prog: {}, showAllCols: false, showSources: false, status: { authenticated: false, premium: false } };
  var root;

  function added(m) { var e = state.prog[m.id]; return Math.min(e ? Object.keys(e.known || {}).length : 0, m.wordCount); }

  function cardCollection(m) {
    var a = added(m), n = m.wordCount, pct = n ? Math.round(a / n * 100) : 0, locked = m.locked;
    var label = locked ? 'Unlock' : a >= n && n ? 'Study collection' : a ? 'Continue collection' : 'Start collection';
    var icon = locked ? I.lock : a >= n && n ? I.check : I.play;
    return '<div class="vx-card' + (locked ? ' locked' : '') + '" data-id="' + esc(m.id) + '">' +
      '<div class="vx-row"><h3 class="vx-title">' + esc(m.title) + '</h3><span class="vx-badge">' + esc(m.level) + '</span></div>' +
      '<div class="vx-small">' + esc(m.source || m.description || '') + (m.premium ? ' <span class="vx-crown">' + I.crown + 'Premium</span>' : '') + '</div>' +
      '<div class="vx-meta"><span>' + n + ' words</span><span>' + a + ' added</span></div>' +
      '<div class="vx-bar"><i style="width:' + pct + '%"></i></div>' +
      '<button class="vx-btn ' + (a >= n && n && !locked ? 'outline' : '') + '" type="button" data-open="' + esc(m.id) + '" ' + (n ? '' : 'disabled') + '>' + icon + label + '</button></div>';
  }
  function cardTest(m) {
    var a = added(m), n = m.wordCount, pct = n ? Math.round(a / n * 100) : 0, left = Math.max(0, n - a), locked = m.locked;
    return '<div class="vx-card' + (locked ? ' locked' : '') + '" data-id="' + esc(m.id) + '">' +
      '<div class="vx-row"><span class="vx-small">' + esc(m.source || m.title) + (m.premium ? ' <span class="vx-crown">' + I.crown + 'Premium</span>' : '') + '</span>' + (m.icon === 'listening' ? I.head : I.rd) + '</div>' +
      '<h3 class="vx-title" style="font-size:20px">' + esc(m.title) + '</h3>' +
      '<div class="vx-chips"><span class="vx-chip">' + n + ' words</span><span class="vx-chip">' + left + ' to learn</span></div>' +
      '<div class="vx-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div><button class="vx-btn auto" type="button" data-open="' + esc(m.id) + '" ' + (n ? '' : 'disabled') + '>' + (locked ? I.lock + 'Unlock' : I.play + 'Study these') + '</button></div></div>';
  }

  function render() {
    var cols = state.items.filter(function (m) { return m.kind !== 'test'; });
    var tests = state.items.filter(function (m) { return m.kind === 'test'; });
    var needs = tests.filter(function (m) { return added(m) < m.wordCount; });
    var totalAdded = state.items.reduce(function (s, m) { return s + added(m); }, 0);
    var totalWords = cols.reduce(function (s, m) { return s + m.wordCount; }, 0);
    var shownCols = state.showAllCols ? cols : cols.slice(0, 3), hidden = cols.length - 3;
    var h = '<div class="vx-wrap"><h1 class="vx-h1">Vocabulary</h1><p class="vx-sub">Study IELTS words as flashcards: flip, then mark each word as “Got it” or “Still learning”.</p>' +
      '<div class="vx-stats"><div class="vx-stat"><b>' + totalAdded + '</b><span>words added</span></div><div class="vx-stat"><b>' + cols.length + '</b><span>collections</span></div><div class="vx-stat"><b>' + totalWords + '</b><span>words in collections</span></div></div>';
    h += '<section class="vx-sec"><div class="vx-sec-h"><h2>' + I.book + 'Vocabulary collections</h2></div><p class="vx-sec-d">Curated IELTS vocabulary studied as a complete collection.</p>';
    h += cols.length ? '<div class="vx-grid">' + shownCols.map(cardCollection).join('') + '</div>' : '<div class="vx-empty">No collections yet. Please check back soon.</div>';
    if (hidden > 0) h += '<div class="vx-more"><button class="vx-btn" type="button" data-toggle="cols">' + (state.showAllCols ? I.up + 'Show fewer collections' : I.down + 'View ' + hidden + ' more collections') + '</button></div>';
    h += '</section>';
    if (tests.length) {
      h += '<section class="vx-sec"><div class="vx-sec-h"><span class="vx-small" style="font-size:15px">Study by test</span><button class="vx-link" type="button" data-toggle="src">' + (state.showSources ? 'Hide all sources' : 'Show all sources') + '</button></div>';
      if (state.showSources) h += '<h2 style="font-size:20px;font-weight:700;margin:18px 0 12px">All sources <span class="vx-small" style="font-weight:400;float:right">' + tests.length + ' test(s)</span></h2><div class="vx-grid two">' + tests.map(cardTest).join('') + '</div>';
      h += '<div class="vx-sec-h" style="margin-top:26px"><h2>Needs practice</h2><span class="vx-small">' + needs.length + ' test(s)</span></div>';
      h += needs.length ? '<div class="vx-grid two" style="margin-top:12px">' + needs.map(cardTest).join('') + '</div>' : '<div class="vx-empty" style="margin-top:12px">Everything is learned. Nice work!</div>';
      h += '</section>';
    }
    root.innerHTML = h + '</div>';
  }

  function dialog(authenticated) {
    var d = document.createElement('div'); d.className = 'vx-modal vx'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = '<div class="vx-dialog"><span class="lock">' + I.lock + '</span><h3>' + (authenticated ? 'Premium collection' : 'Sign in to continue') + '</h3>' +
      '<p>' + (authenticated ? 'This collection is locked. Upgrade to Premium to study every word.' : 'Sign in to your account to open this collection.') + '</p>' +
      '<a class="vx-btn ink" style="text-decoration:none" href="' + (authenticated ? '/Price?premium=required' : '/login?next=' + encodeURIComponent('/vocabulary')) + '">' + (authenticated ? 'Unlock Premium' : 'Sign in') + '</a>' +
      '<button class="vx-btn outline" type="button" data-x>Not now</button></div>';
    d.addEventListener('click', function (e) { if (e.target === d || e.target.hasAttribute('data-x')) d.remove(); });
    document.addEventListener('keydown', function esc2(e) { if (e.key === 'Escape') { d.remove(); document.removeEventListener('keydown', esc2); } });
    document.body.appendChild(d);
  }

  function open(id) {
    var m = state.items.filter(function (x) { return x.id === id; })[0]; if (!m) return;
    if (!m.premium) { location.href = '/vocabulary/study?id=' + encodeURIComponent(id); return; }
    // Premium card: ask the server again (never trust the page); the study page and the API check it once more
    (window.IELTSXPremium ? window.IELTSXPremium.status(true) : Promise.resolve({ premium: false })).then(function (s) {
      if (s && s.premium) location.href = '/vocabulary/study?id=' + encodeURIComponent(id); else dialog(!!(s && s.authenticated));
    });
  }

  function init() {
    root = $('#vocab-root'); if (!root) return;
    root.innerHTML = '<div class="vx-wrap"><div class="vx-empty">Loading…</div></div>';
    root.addEventListener('click', function (e) {
      var o = e.target.closest('[data-open]'); if (o) return open(o.getAttribute('data-open'));
      var t = e.target.closest('[data-toggle]'); if (!t) return;
      if (t.getAttribute('data-toggle') === 'cols') state.showAllCols = !state.showAllCols; else state.showSources = !state.showSources;
      render();
    });
    Promise.all([window.IXVocab.me(), fetch('/api/materials?type=vocab', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : { items: [] }; }).catch(function () { return { items: [] }; })])
      .then(function (a) {
        state.uid = a[0] && a[0].id; state.prog = window.IXVocab.all(state.uid);
        state.items = (a[1].items || []).sort(function (x, y) { return String(x.title).localeCompare(String(y.title), undefined, { numeric: true }); });
        render();
      });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
