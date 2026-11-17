/* ============================================================
   FULL MOCK · bridge  (loaded by reading.html and listening.html)
   ------------------------------------------------------------
   The papers run inside an <iframe> of the mock shell (index.html) and talk to
   it with postMessage, so it works from http(s):// and from file://.

   shell -> paper : {mock:1, type:'start',  name, mode}
                    {mock:1, type:'review', name, ans}
   paper -> shell : {mock:1, type:'ready'}
                    {mock:1, type:'done', k, res}
                    {mock:1, type:'exit-review'}
                    {mock:1, type:'gesture'}
                    {mock:1, type:'violation', what}
                    {mock:1, type:'issue'}

   Opened on its own (no ?embed=1) the paper behaves exactly as before.
   ============================================================ */
(function () {
  'use strict';
  // the logo chosen in the admin panel replaces the placeholder mark of the header (assets/js/branding.js)
  if (location.protocol !== 'file:') { try { var bs = document.createElement('script'); bs.src = '/assets/js/branding.js'; bs.defer = true; document.head.appendChild(bs); } catch (e) { /* the placeholder stays */ } }
  var embedded = /[?&]embed=1/.test(location.search) && window.parent !== window;

  function post(msg) {
    msg.mock = 1;
    try { window.parent.postMessage(msg, '*'); } catch (e) { /* no parent */ }
  }

  var MockBridge = {
    embedded: embedded,
    mode: 'practice',
    done: function (k, res) {
      var clean; try { clean = JSON.parse(JSON.stringify(res)); } catch (e) { clean = res; }
      post({ type: 'done', k: k, res: clean });
    },
    reportIssue: function () { post({ type: 'issue' }); },
    exitButton: function () {
      if (document.getElementById('mock-exit')) return;
      var b = document.createElement('button');
      b.id = 'mock-exit'; b.type = 'button';
      b.innerHTML = '&#10005;&nbsp; Close review';
      b.onclick = function () { post({ type: 'exit-review' }); };
      document.body.appendChild(b);
    }
  };
  window.MockBridge = MockBridge;
  if (!embedded) return;

  /* ---------- one look with Writing: the shared frame of css/exam-unify.css ---------- */
  try {
    var css = document.createElement('link'); css.rel = 'stylesheet';
    css.href = location.protocol === 'file:' ? 'css/exam-unify.css' : '/full-mock/css/exam-unify.css';
    document.head.appendChild(css);
  } catch (e) { /* the paper keeps its own header */ }
  var NAMES = { listening: 'Listening', reading: 'Reading', writing: 'Writing' };
  function escHtml(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* "Reading test | Candidate" in place of the paper's own title, and Listening — Reading — Writing in the middle */
  /* some papers draw their header only once the test starts, and a paper may draw it again: wait for it, keep it */
  var unifyObs = null;
  function unifyHeader(m, review) {
    if (!NAMES[m.k]) return;
    var tries = 0;
    (function attempt() { if (!applyHeader(m, review) && ++tries < 150) setTimeout(attempt, 100); })();
    if (!unifyObs && window.MutationObserver) {
      unifyObs = new MutationObserver(function () { if (document.getElementById('hdr') && !document.getElementById('mk-title')) applyHeader(m, review); });
      unifyObs.observe(document.body, { childList: true, subtree: true });
    }
  }
  function applyHeader(m, review) {
    var hdr = document.getElementById('hdr'), k = m.k;
    if (!hdr) return false;
    document.documentElement.classList.add('mk-unified');
    var own = document.getElementById('hdr-title') || document.getElementById('hdr-name');
    var title = document.getElementById('mk-title');
    if (!title && own && own.parentNode) {
      title = document.createElement('div'); title.id = 'mk-title'; title.className = own.className + ' mk-title';
      own.parentNode.insertBefore(title, own);
    }
    if (title) title.innerHTML = escHtml(NAMES[k] + (review ? ' review' : ' test')) + (m.name ? '<span class="mk-who">' + escHtml(m.name) + '</span>' : '');
    if (review || document.getElementById('mk-steps')) return !!title;
    var done = m.done || {}, html = '';
    ['listening', 'reading', 'writing'].forEach(function (s, i) {
      var cls = done[s] ? 'done' : (s === k ? 'cur' : '');
      html += '<li class="' + cls + '"><i><b>' + (i + 1) + '</b></i><span>' + NAMES[s] + '</span></li>';
    });
    var ol = document.createElement('ol'); ol.id = 'mk-steps'; ol.className = 'mk-steps'; ol.setAttribute('aria-label', 'Mock test progress');
    ol.innerHTML = html; hdr.appendChild(ol);
    return !!title;
  }

  /* ---------- the shell keeps the browser in full screen from login to result ---------- */
  try {
    var keep = function () { return Promise.resolve(); };
    document.exitFullscreen = keep; document.webkitExitFullscreen = keep;
  } catch (e) { /* read-only in some engines */ }

  /* ---------- security: same rules as the shell ---------- */
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, true);
  document.addEventListener('dragstart', function (e) { e.preventDefault(); }, true);
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase(), c = e.ctrlKey || e.metaKey;
    var bad = e.key === 'F12' || (c && e.shiftKey && 'ijc'.indexOf(k) > -1) || (c && 'usp'.indexOf(k) > -1 && !e.shiftKey);
    if (bad) { e.preventDefault(); e.stopPropagation(); post({ type: 'violation', what: 'blocked shortcut' }); }
  }, true);

  /* ---------- Real exam mode: there is no submit button; the clock ends the paper ---------- */
  var BLOCK = '#sub-btn,#toc-next,#hdr-toc,.ex-opt-item.is-red,[onclick*="goToSubmission"],[onclick*="exGoSubmission"],[onclick*="submitConfirm"]';
  function applyMode(mode) {
    MockBridge.mode = mode === 'real' ? 'real' : 'practice';
    document.documentElement.setAttribute('data-exam-mode', MockBridge.mode);
    if (MockBridge.mode !== 'real' || document.getElementById('mock-real-style')) return;
    var st = document.createElement('style'); st.id = 'mock-real-style';
    st.textContent = 'html[data-exam-mode="real"] ' + BLOCK.split(',').join(',html[data-exam-mode="real"] ') + '{display:none!important}';
    document.head.appendChild(st);
    ['click', 'mousedown', 'touchstart'].forEach(function (t) {
      document.addEventListener(t, function (e) {
        if (e.target && e.target.closest && e.target.closest(BLOCK)) { e.preventDefault(); e.stopPropagation(); }
      }, true);
    });
  }

  window.addEventListener('message', function (ev) {
    var m = ev.data;
    if (!m || !m.mock || (ev.source && ev.source !== window.parent)) return;
    if (m.type === 'start') {
      applyMode(m.mode);
      if (typeof window.__mockStart === 'function') window.__mockStart(m.name);
      try { unifyHeader(m, false); } catch (e) { /* the paper keeps its own header */ }
    }
    if (m.type === 'review') {
      applyMode('practice');
      if (typeof window.__mockReview === 'function') window.__mockReview(m.name, m.ans);
      try { unifyHeader(m, true); } catch (e) { /* the paper keeps its own header */ }
    }
  });

  /* a click or key inside the paper counts as a user gesture for the shell */
  var last = 0;
  function gesture() { var t = Date.now(); if (t - last < 1500) return; last = t; post({ type: 'gesture' }); }
  document.addEventListener('mousedown', gesture, true);
  document.addEventListener('keydown', gesture, true);

  function ready() { post({ type: 'ready' }); }
  if (document.readyState === 'complete') setTimeout(ready, 0);
  else window.addEventListener('load', function () { setTimeout(ready, 0); });
})();
