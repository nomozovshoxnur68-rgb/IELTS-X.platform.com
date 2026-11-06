/*
 * IELTSX — records a finished test on the signed-in account (assets/js/test-complete.js).
 * Loaded by the reading / listening test pages together with ieltsx-data.js. It listens for the
 * "ieltsx:test-finished" event that the exam engines send when the results are shown.
 * The result is stored on the server (so it follows the account to any device) and the test is
 * marked "Completed" on the practice pages. Signed-out visitors can still take every free test.
 */
(function () {
  'use strict';
  var path = decodeURIComponent(location.pathname).replace(/\/index(\.html)?$/, '/');
  // tests made in the admin panel can also live at /exam/<skill>/<id> (every Full Listening test does)
  var exam = /^\/exam\/(reading|listening)(?:-part|-full)?\//.exec(path);
  // clean URLs (no .html in the address bar): keep the stored key identical to the real file name
  if (!exam && !/\/$/.test(path) && !/\.[a-z0-9]+$/i.test(path)) path += '.html';
  var isReading = exam ? exam[1] === 'reading' : /^\/(pessages|full-tests\/reading)\//.test(path);
  var isListening = exam ? exam[1] === 'listening' : /^\/(sections|listening|full-tests\/listening)\//.test(path);
  if (!isReading && !isListening) return;
  var section = isReading ? 'Reading' : 'Listening';

  // the official IELTS tables for 40 questions; a shorter or longer paper is scaled to 40, as in the exam engines
  var TABLES = {
    Reading: [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [2, 2], [1, 1]],
    Listening: [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [2, 2], [1, 1]]
  };
  function bandFor(correct, total) {
    var scaled = Math.round((correct / total) * 40);
    var t = TABLES[section];
    for (var i = 0; i < t.length; i++) if (scaled >= t[i][0]) return t[i][1];
    return 0;
  }
  function label() {   // the name of the test, not a heading that happens to be first on the page ("Preparing your test…")
    var h = document.getElementById('hdr-title');
    var name = (window.PART_PRACTICE && window.PART_PRACTICE.name) || (h && h.textContent) || document.title || 'Practice test';
    return String(name).replace(/\s+/g, ' ').trim().replace(/^\[Demo\]\s*/i, '').replace(/\s+-\s+P[123]$/, '').slice(0, 120);
  }

  /* One attempt is saved once: opening its results page again must not add it again. */
  var REPORTED = 'ieltsx_reported_v1', last = '';
  function seen(attempt) {
    if (!attempt) return false;
    try { return (JSON.parse(localStorage.getItem(REPORTED) || '{}'))[path] === attempt; } catch (e) { return false; }
  }
  function remember(attempt) {
    if (!attempt) return;
    try {
      var map = JSON.parse(localStorage.getItem(REPORTED) || '{}');
      map[path] = attempt;
      var keys = Object.keys(map);
      if (keys.length > 200) delete map[keys[0]];
      localStorage.setItem(REPORTED, JSON.stringify(map));
    } catch (e) { /* blocked */ }
  }
  function report(d) {
    var correct = Number(d.correct), total = Number(d.total);
    if (!(total >= 1) || !(correct >= 0) || correct > total) return;
    var sig = d.attempt || (correct + '/' + total);
    if (sig === last || seen(d.attempt)) return;
    last = sig;
    remember(d.attempt);
    var entry = {
      testKey: path, section: section, bucket: 'Practice', pageLabel: label(),
      scoreCorrect: correct, scoreTotal: total,
      band: Number(d.band) >= 0 && d.band !== null && d.band !== '' ? Number(d.band) : bandFor(correct, total),
      durationSec: Number(d.durationSec) > 0 ? Math.round(Number(d.durationSec)) : 0
    };
    if (window.IELTSXData && window.IELTSXData.saveResult) window.IELTSXData.saveResult(entry);   // the server decides who is signed in
    document.dispatchEvent(new CustomEvent('ieltsx:completed', { detail: entry }));
  }

  window.addEventListener('ieltsx:test-finished', function (e) { report(e.detail || {}); });
})();
