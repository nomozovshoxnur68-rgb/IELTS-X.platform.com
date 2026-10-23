/* IELTSX vocabulary flashcards (/vocabulary/study?id=...). The words live only in this closure. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var root = $('#study-root');
  var ICON = { exit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    redo: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
    spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>' };

  var id = new URLSearchParams(location.search).get('id');
  var uid = null, item = null, words = [], queue = [], total = 0, got = 0, learning = {}, flipped = false, over = false;

  function note(msg, extra) { root.innerHTML = '<div class="vs-in"><div class="vs-note">' + msg + (extra || '') + '</div></div>'; }
  function toLogin() { location.replace('/login?next=' + encodeURIComponent(location.pathname + location.search)); }
  function toPricing() { location.replace('/Price?premium=required&next=' + encodeURIComponent(location.pathname + location.search)); }

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function begin(all) {
    var p = window.IXVocab.get(uid, id), left = words.filter(function (w) { return !p.known[w.word.toLowerCase()]; });
    queue = (all || !left.length ? words : left).slice(); total = queue.length; got = 0; learning = {}; flipped = false; over = false;
    draw();
  }
  function head() {
    var cur = Math.min(got + 1, total), pct = total ? Math.round(got / total * 100) : 0, nl = Object.keys(learning).length;
    return '<div class="vs-top"><div><div class="l">' + esc(item.title) + '</div><div class="n"><b>' + cur + ' / ' + total + '</b> <span>· session</span></div></div>' +
      '<button class="vs-exit" type="button" data-exit>' + ICON.exit + 'Exit</button></div>' +
      '<div class="vs-prog"><i style="width:' + pct + '%"></i></div><div class="vs-stat"><span>' + got + ' got it · ' + nl + ' learning</span><span>' + pct + '%</span></div>';
  }
  function draw() {
    if (!queue.length) {
      root.innerHTML = '<div class="vs-in">' + head().replace(/<div class="vs-top">.*?<\/div><div class="vs-prog">/s, '<div class="vs-prog">') + '</div>' +
        '<div class="vs-done"><h2>Session complete 🎉</h2><p>' + got + ' of ' + total + ' words marked “Got it”.</p><div class="row"><button class="vx-btn outline" data-again type="button">Study again</button><button class="vx-btn ink" data-exit type="button">Back to vocabulary</button></div></div>';
      over = true; return;
    }
    var w = queue[0];
    var card = flipped
      ? '<div class="vs-card" data-flip><p class="vs-lab">Definition</p><p class="vs-def">' + esc(w.definition) + '</p>' +
        (w.example ? '<p class="vs-lab">Example</p><p class="vs-ex">“' + esc(w.example) + '”</p>' : '') +
        (w.synonyms.length ? '<p class="vs-lab">Synonyms</p><div class="vs-tags">' + w.synonyms.map(function (s) { return '<span class="vs-tag">' + esc(s) + '</span>'; }).join('') + '</div>' : '') +
        (w.opposites.length ? '<p class="vs-lab">Opposites</p><div class="vs-tags">' + w.opposites.map(function (s) { return '<span class="vs-tag">' + esc(s) + '</span>'; }).join('') + '</div>' : '') + '</div>'
      : '<div class="vs-card front" data-flip><button class="vs-speak" type="button" data-speak aria-label="Pronounce">' + ICON.spk + '</button><p class="vs-lab">Word</p><h2 class="vs-word">' + esc(w.word) + '</h2>' + (w.pos ? '<span class="vs-pos">' + esc(w.pos) + '</span>' : '') + '<p class="vs-flip">Tap to flip</p></div>';
    var act = flipped
      ? '<div class="vs-act"><button class="vx-btn outline" type="button" data-rate="learning">' + ICON.redo + 'Still learning <kbd>1</kbd></button><button class="vx-btn ink" type="button" data-rate="known">' + ICON.check + 'Got it <kbd>2</kbd></button></div>'
      : '<div class="vs-act"><button class="vx-btn single" type="button" data-flipbtn>Show answer</button></div><div class="vs-hint">Space flip · 1 still learning · 2 got it</div>';
    root.innerHTML = '<div class="vs-in">' + head() + card + act + '</div>';
  }
  function flip() { if (over) return; flipped = !flipped; draw(); }
  function rate(status) {
    if (over || !flipped || !queue.length) return;
    var w = queue.shift(); window.IXVocab.mark(uid, id, w.word, status);
    if (status === 'known') { got++; delete learning[w.word]; } else { learning[w.word] = 1; queue.push(w); }
    flipped = false; draw();
  }
  function speak(word) { try { var u = new SpeechSynthesisUtterance(word); u.lang = 'en-GB'; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { /* not supported */ } }
  function exit() { location.href = '/vocabulary'; }

  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-exit]')) return exit();
    if (e.target.closest('[data-again]')) return begin(true);
    if (e.target.closest('[data-speak]')) { e.stopPropagation(); return speak(queue[0].word); }
    var r = e.target.closest('[data-rate]'); if (r) return rate(r.getAttribute('data-rate'));
    if (e.target.closest('[data-flip],[data-flipbtn]')) flip();
  });
  document.addEventListener('keydown', function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); flip(); }
    else if (e.key === '1') rate('learning'); else if (e.key === '2') rate('known'); else if (e.key === 'Escape') exit();
  });

  function wipe() { words = []; queue = []; item = null; root.innerHTML = ''; }

  if (!id) return note('This collection was not found. <br><br><a class="vx-btn auto ink" style="text-decoration:none" href="/vocabulary">Back to vocabulary</a>');
  note('Loading…');
  fetch('/api/materials/' + encodeURIComponent(id), { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
    if (r.status === 401) { toLogin(); return null; }
    if (r.status === 403) { toPricing(); return null; }
    if (!r.ok) throw new Error('missing');
    return r.json();
  }).then(function (d) {
    if (!d) return;
    if (!d.item || d.item.type !== 'vocab') throw new Error('missing');
    item = d.item; words = (item.data && item.data.words) || [];
    document.title = item.title + ' · IELTSX Vocabulary';
    if (!words.length) return note('This collection has no words yet.', '<br><br><a class="vx-btn auto ink" style="text-decoration:none" href="/vocabulary">Back to vocabulary</a>');
    return window.IXVocab.me().then(function (u) {
      uid = u && u.id; begin(false);
      if (item.premium && window.IXVocabGuard) window.IXVocabGuard.start({ root: $('.vs'), email: u && u.email, onRevoke: function (s) { wipe(); if (s.authenticated) toPricing(); else toLogin(); } });
    });
  }).catch(function () { note('This collection was not found.', '<br><br><a class="vx-btn auto ink" style="text-decoration:none" href="/vocabulary">Back to vocabulary</a>'); });
})();
