/*
 * IELTSX — gate for a single test page (assets/js/access-gate.js).
 * Put it in the <head> of a full test page. The page stays hidden until the server says this visitor may open it;
 * if not, the visitor is sent to the Price page (Get Access). The Node server also refuses the file itself, this script
 * covers hosting that serves static files (Vercel) and gives the visitor a friendly redirect.
 * If the check cannot be made (offline, no API) the page is shown, the server stays the authority.
 */
(function () {
    'use strict';
    var root = document.documentElement;
    root.classList.add('ix-gating');
    var style = document.createElement('style');
    style.textContent = 'html.ix-gating body{visibility:hidden!important}';
    document.head.appendChild(style);
    function show() { root.classList.remove('ix-gating'); if (style.parentNode) style.parentNode.removeChild(style); }
    var path = location.pathname;
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); show(); }, 5000);
    // ?page=, not ?path=: on Vercel the "/api/:path*" rewrite adds its own "path" to the query string
    fetch('/api/access/check?page=' + encodeURIComponent(path), { credentials: 'same-origin', cache: 'no-store', signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
            clearTimeout(timer);
            if (d && d.allowed === false && d.price) { location.replace(d.price); return; }
            show();
        })
        .catch(function () { clearTimeout(timer); show(); });
})();
