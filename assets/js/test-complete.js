/*
 * IELTSX — records a finished test on the signed-in account (assets/js/test-complete.js).
 * Loaded by the reading / listening test pages together with ieltsx-data.js. It listens for
 *   1) the "ieltsx:test-finished" event (sent by reading.js), and
 *   2) the results screen text "(X/Y correct)" that the saved test pages show.
 * The result is stored on the server (so it follows the account to any device) and the test is
 * marked "Completed" on the practice pages. Signed-out visitors can still take every free test.
 */
(function () {
  'use strict';
  var path = decodeURIComponent(location.pathname).replace(/\/index\.html$/, '/');
  if (path === '/listening/') path = '/full-tests/listening/test-1.html';        // same paper, one key
  var isReading = /^\/(pessages|full-tests\/reading)\//.test(path);
  var isListening = /^\/(sections|listening|full-tests\/listening)\//.test(path);
  if (!isReading && !isListening) return;
  var section = isReading ? 'Reading' : 'Listening';
  var bucket = /^\/full-tests\//.test(path) ? 'Mock' : 'Practice';

  // official-style band tables for 40 questions (the passage tests are scaled to 40 like reading.js does)
  var TABLES = {
    Reading: [[40, 9], [39, 8.5], [37, 8], [35, 7.5], [33, 7], [30, 6.5], [27, 6], [23, 5.5], [19, 5], [15, 4.5], [13, 4], [10, 3.5], [8, 3], [6, 2.5], [1, 1]],
    Listening: [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [1, 1]]
  };
  function bandFor(correct, total) {
    var scaled = Math.round((correct / total) * 40);
    var t = TABLES[section];
    for (var i = 0; i < t.length; i++) if (scaled >= t[i][0]) return t[i][1];
    return 0;
  }
  function label() {
    var h = document.getElementById('hdr-title') || document.querySelector('h1');
    return String((h && h.textContent) || document.title || 'Practice test').replace(/\s+/g, ' ').trim().slice(0, 120);
  }

  var last = '';
  function report(correct, total, band) {
    correct = Number(correct); total = Number(total);
    if (!(total >= 1) || !(correct >= 0) || correct > total) return;
    var sig = correct + '/' + total;
    if (sig === last) return;
    last = sig;
    var entry = {
      testKey: path, section: section, bucket: bucket, pageLabel: label(),
      scoreCorrect: correct, scoreTotal: total, band: Number(band) > 0 ? Number(band) : bandFor(correct, total)
    };
    if (window.IELTSXData && window.IELTSXData.saveResult) {
      var email = (window.IELTSXData.getCurrentUser() || {}).email;
      if (email) window.IELTSXData.saveResult(entry);        // saves locally and on the server
    }
    document.dispatchEvent(new CustomEvent('ieltsx:completed', { detail: entry }));
  }

  window.addEventListener('ieltsx:test-finished', function (e) {
    var d = e.detail || {};
    report(d.correct, d.total, d.band);
  });

  var re = /\((\d+)\s*\/\s*(\d+)\s*correct\)/i, timer = null;
  function scan() {
    timer = null;
    var m = re.exec(document.body ? document.body.textContent : '');
    if (m) report(m[1], m[2]);
  }
  if (window.MutationObserver) {
    new MutationObserver(function () { if (!timer) timer = setTimeout(scan, 500); })
      .observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  }
})();
