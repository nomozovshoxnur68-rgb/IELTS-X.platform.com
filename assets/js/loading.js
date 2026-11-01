/*
 * IELTSX — the loading bar of every page (assets/js/loading.js), in the <head> so it shows from the first moment.
 * A thin bar at the top of the window moves while the page loads, while the page waits for the server (every fetch),
 * and as soon as a link to another page is clicked, so a slow answer never looks like a frozen page.
 * No markup needed; running it twice is harmless.
 */
(function () {
    'use strict';
    if (window.__ixLoading) return;
    window.__ixLoading = true;
    var css = '#ix-load{position:fixed;top:0;left:0;right:0;height:3px;z-index:2147483646;pointer-events:none;opacity:0;transition:opacity .25s}' +
        '#ix-load.on{opacity:1}' +
        '#ix-load i{display:block;height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#db2777,#ef4444);box-shadow:0 0 8px rgba(219,39,119,.55);transition:width .35s ease}' +
        'html.ix-gating::after{content:"";position:fixed;top:50%;left:50%;width:34px;height:34px;margin:-17px 0 0 -17px;border:3px solid rgba(127,127,127,.25);border-top-color:#db2777;border-radius:50%;animation:ix-spin .8s linear infinite;visibility:visible;z-index:2147483646}' +
        '@keyframes ix-spin{to{transform:rotate(360deg)}}';
    var style = document.createElement('style'); style.textContent = css;
    (document.head || document.documentElement).appendChild(style);

    var bar = null, fill = null, busy = 0, width = 0, tick = null, hideT = null, showT = null;
    function el() {
        if (bar || !document.body) return bar;
        bar = document.createElement('div'); bar.id = 'ix-load'; bar.setAttribute('aria-hidden', 'true');
        fill = document.createElement('i'); bar.appendChild(fill); document.body.appendChild(bar);
        return bar;
    }
    function set(w) { width = w; if (fill) fill.style.width = w + '%'; }
    function start() {
        clearTimeout(hideT);
        if (!el()) return;
        if (!bar.classList.contains('on')) { set(8); bar.classList.add('on'); }
        clearInterval(tick);
        // creeps towards 90% and waits there for the real end
        tick = setInterval(function () { if (width < 90) set(width + (90 - width) * 0.08); }, 200);
    }
    function done() {
        clearInterval(tick); clearTimeout(showT);
        if (!bar) return;
        set(100);
        hideT = setTimeout(function () { bar.classList.remove('on'); setTimeout(function () { if (!bar.classList.contains('on')) set(0); }, 260); }, 220);
    }
    // the page itself
    var loaded = false;
    function pageStart() { if (!loaded) start(); }
    if (document.body) pageStart(); else document.addEventListener('DOMContentLoaded', pageStart);
    window.addEventListener('load', function () { loaded = true; if (!busy) done(); });

    // every request to the server (a quick one never shows the bar: it waits 150 ms)
    if (window.fetch) {
        var orig = window.fetch;
        window.fetch = function () {
            busy++;
            if (busy === 1 && loaded) { clearTimeout(showT); showT = setTimeout(function () { if (busy) start(); }, 150); }
            var end = function () { busy = Math.max(0, busy - 1); if (!busy && loaded) done(); };
            var p;
            try { p = orig.apply(this, arguments); } catch (e) { end(); throw e; }
            p.then(end, end);
            return p;
        };
    }
    // a click on a link to another page of the site: the bar starts at once
    document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
        var href = a.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
        try { var u = new URL(a.href, location.href); if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash)) return; } catch (x) { return; }
        loaded = true; start();
    }, false);
    // back / forward from the cache: nothing is loading
    window.addEventListener('pageshow', function (e) { if (e.persisted) done(); });
})();
