/*
 * IELTSX — Premium security for vocabulary cards (assets/js/vocab-security.js).
 *
 * REAL protection is on the server: a locked collection answers 403 to anybody without Premium and its words are never
 * sent (see /api/materials/:id). This script adds the browser-side layer for Premium members' sessions:
 *   1. re-checks the membership with the server every minute and when the tab gets focus; if it ended, the cards are
 *      wiped from memory and the page leaves (so an expired / revoked plan stops working in an open tab);
 *   2. blocks right-click, copy, cut, drag, select, save, print, view-source shortcuts on the cards;
 *   3. blurs the cards while developer tools are docked open (heuristic) and hides them when printing;
 *   4. draws a faint watermark with the member's e-mail, so leaked screenshots can be traced.
 * Browser-side rules can always be bypassed by a determined person; they are a deterrent, not the lock.
 *
 *   IXVocabGuard.start({ root: element, email: 'a@b.c', onRevoke: function () {} })
 */
(function () {
  'use strict';
  var started = false, timer = null;

  function watermark(email) {
    var txt = String(email || 'IELTSX Premium').replace(/[<>&"']/g, '');
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><text x="20" y="110" transform="rotate(-24 160 100)" font-family="Arial,sans-serif" font-size="15" fill="#000">' + txt + '</text></svg>';
    var d = document.createElement('div'); d.className = 'ix-wm'; d.setAttribute('aria-hidden', 'true');
    d.style.background = 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
    document.body.appendChild(d); return d;
  }

  function start(opt) {
    if (started) return; started = true;
    opt = opt || {}; var root = opt.root || document.body;
    root.classList.add('ix-guard');
    var wm = watermark(opt.email);

    function stop(e) { e.preventDefault(); e.stopPropagation(); return false; }
    ['contextmenu', 'copy', 'cut', 'dragstart', 'selectstart'].forEach(function (ev) {
      document.addEventListener(ev, function (e) { if (root.contains(e.target) || e.target === document.body) return stop(e); }, true);
    });
    document.addEventListener('keydown', function (e) {
      var k = String(e.key || '').toLowerCase(), mod = e.ctrlKey || e.metaKey;
      if (e.key === 'F12' || (mod && e.shiftKey && 'ijc'.indexOf(k) > -1) || (mod && 'suap'.indexOf(k) > -1 && k.length === 1) || (e.metaKey && e.altKey && 'ijcu'.indexOf(k) > -1)) return stop(e);
    }, true);
    window.addEventListener('beforeprint', function () { root.style.visibility = 'hidden'; });
    window.addEventListener('afterprint', function () { root.style.visibility = ''; });

    // developer tools docked to the side or bottom make the window noticeably smaller than its outer frame
    function devtools() {
      var open = (window.outerWidth - window.innerWidth > 260) || (window.outerHeight - window.innerHeight > 260);
      root.classList.toggle('ix-blur', open);
    }
    window.addEventListener('resize', devtools); devtools();

    // the watermark must stay: put it back if somebody removes or hides it
    new MutationObserver(function () {
      if (!document.body.contains(wm)) { wm = watermark(opt.email); }
      else if (getComputedStyle(wm).display === 'none' || getComputedStyle(wm).visibility === 'hidden') { wm.style.cssText += ';display:block!important;visibility:visible!important'; }
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    function recheck() {
      var P = window.IELTSXPremium; if (!P) return;
      P.status(true).then(function (s) {
        if (s && s.error) return;                         // offline: try again later
        if (!s || !s.premium) { clearInterval(timer); if (opt.onRevoke) opt.onRevoke(s || {}); }
      });
    }
    timer = setInterval(recheck, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) recheck(); });
    window.addEventListener('focus', recheck);
  }
  window.IXVocabGuard = { start: start };
})();
