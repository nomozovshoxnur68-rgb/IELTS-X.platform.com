/*
 * IELTSX — the loading bar of every page (assets/js/loading.js), in the <head> so it shows from the first moment.
 * A thin bar in the site's blue (the --primary colour of ix-unified.css) moves at the top of the window while the page
 * loads, while the page waits for the server (every fetch) and as soon as a link to another page is clicked, so a slow
 * answer never looks like a frozen page.
 * It also makes moving between pages faster: the page a link points to is fetched while the pointer rests on the link
 * (or the finger touches it), so the click opens a page that is already there.
 * Shared skeleton style: any element with class "ix-skel" shimmers while its content loads (the cards of the practice
 * pages and the Articles page use it). No markup needed; running it twice is harmless.
 */
(function () {
    'use strict';
    if (window.__ixLoading) return;
    window.__ixLoading = true;
    var css =
        ':root{--ix-load:#2563eb;--ix-load-glow:rgba(37,99,235,.45)}' +
        'html.dark-mode,html.dark{--ix-load:#4b8df8;--ix-load-glow:rgba(75,141,248,.5)}' +
        '#ix-load{position:fixed;top:0;left:0;right:0;height:2.5px;z-index:2147483646;pointer-events:none;opacity:0;transition:opacity .3s ease}' +
        '#ix-load.on{opacity:1}' +
        '#ix-load i{position:relative;display:block;height:100%;width:0;background:var(--ix-load);border-radius:0 2px 2px 0;box-shadow:0 0 10px var(--ix-load-glow),0 0 4px var(--ix-load-glow);transition:width .4s cubic-bezier(.2,.7,.3,1)}' +
        '#ix-load i::after{content:"";position:absolute;right:0;top:0;width:90px;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55));opacity:.7;animation:ix-load-glint 1.1s ease-in-out infinite}' +
        '@keyframes ix-load-glint{0%,100%{opacity:.15}50%{opacity:.75}}' +
        // test pages: a spinner instead of a blank screen while access is checked (assets/js/access-gate.js)
        'html.ix-gating::after{content:"";position:fixed;top:50%;left:50%;width:30px;height:30px;margin:-15px 0 0 -15px;border:2.5px solid rgba(127,127,127,.22);border-top-color:var(--ix-load);border-radius:50%;animation:ix-spin .7s linear infinite;visibility:visible;z-index:2147483646}' +
        '@keyframes ix-spin{to{transform:rotate(360deg)}}' +
        // skeletons
        '.ix-skel{position:relative;overflow:hidden;background:hsl(var(--muted,210 40% 96%));border-radius:.5rem}' +
        '.ix-skel::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:ix-shimmer 1.3s ease-in-out infinite}' +
        'html.dark-mode .ix-skel::after,html.dark .ix-skel::after{background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)}' +
        '@keyframes ix-shimmer{to{transform:translateX(100%)}}' +
        '.ix-skel-card{border:1px solid hsl(var(--border,214 32% 91%)/.6);border-radius:.75rem;background:hsl(var(--card,0 0% 100%));overflow:hidden;display:flex;flex-direction:column;width:100%;height:100%;min-height:300px}' +
        '.ix-skel-card .ix-skel-body{padding:1rem;display:flex;flex-direction:column;gap:.7rem;flex:1}' +
        '.ix-fade-in{animation:ix-fade .28s ease-out both}' +
        '@keyframes ix-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}' +
        '@media (prefers-reduced-motion:reduce){.ix-skel::after,#ix-load i::after,.ix-fade-in{animation:none}}' +
        // the promo strip (assets/js/promo.js) shows only while a promo code works: hidden from the first paint otherwise
        'html:not(.ix-promo-on) #discount-banner{display:none!important}';
    var style = document.createElement('style'); style.id = 'ix-load-style'; style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    try {
        var pc = JSON.parse(localStorage.getItem('ix-promo') || 'null');
        if (pc && pc.code && (!pc.endsAt || Date.parse(pc.endsAt) > Date.now())) document.documentElement.classList.add('ix-promo-on');
    } catch (e) { /* blocked: promo.js decides after its check */ }

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
        if (!bar.classList.contains('on')) { set(10); bar.classList.add('on'); }
        clearInterval(tick);
        // creeps towards 90% and waits there for the real end
        tick = setInterval(function () { if (width < 90) set(width + (90 - width) * 0.09); }, 180);
    }
    function done() {
        clearInterval(tick); clearTimeout(showT);
        if (!bar) return;
        set(100);
        hideT = setTimeout(function () { bar.classList.remove('on'); setTimeout(function () { if (!bar.classList.contains('on')) set(0); }, 320); }, 200);
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

    // a link to another page of this site that may be opened (and fetched early)
    function pageLink(a) {
        if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-prefetch')) return null;
        var href = a.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return null;
        try {
            var u = new URL(a.href, location.href);
            if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return null;
            return u;
        } catch (x) { return null; }
    }
    // a click on a link to another page of the site: the bar starts at once
    document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        var u = pageLink(a);
        if (!u || (u.pathname === location.pathname && u.hash)) return;
        loaded = true; start();
    }, false);
    // back / forward from the cache: nothing is loading
    window.addEventListener('pageshow', function (e) { if (e.persisted) done(); });

    /* Faster page changes. Chrome / Edge: speculation rules fetch a page while the pointer rests on its link
       ("moderate" = after a short hover, or on touch). Other browsers: a <link rel="prefetch"> after 80 ms of hover.
       Never the API, the admin panel, sign-out links, files, or a test itself (opening a locked test counts towards the
       plan's allowance, so it is only fetched when it is really opened). */
    var SKIP = /^\/(api|admin|uploads|premium-audio|pessages|sections|exam|full-mock|writing|test)(\/|$|\.html)|^\/full-tests\/[^/]+\/test-|logout|signout|\.(pdf|mp3|mp4|zip|docx?)$/i;
    var conn = navigator.connection || {};
    if (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '')) return;   // the visitor saves data: no early fetching
    var supports = window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules');
    if (supports) {
        try {
            var rules = document.createElement('script'); rules.type = 'speculationrules';
            rules.textContent = JSON.stringify({ prefetch: [{
                source: 'document', eagerness: 'moderate',
                where: { and: [
                    { href_matches: '/*' },
                    { not: { href_matches: ['/api/*', '/admin', '/admin/*', '/admin.html', '/uploads/*', '/premium-audio/*', '/*logout*', '/*.pdf', '/*.mp3',
                        '/pessages/*', '/sections/*', '/exam/*', '/full-mock/*', '/writing', '/writing/*', '/test', '/test/*', '/test.html', '/full-tests/*/test-*'] } },
                    { not: { selector_matches: '[target=_blank], [download], [data-no-prefetch]' } }
                ] }
            }] });
            (document.head || document.documentElement).appendChild(rules);
        } catch (e) { supports = false; }
    }
    if (!supports) {
        var done1 = {}, hoverT = null;
        var prefetch = function (a) {
            var u = pageLink(a); if (!u || SKIP.test(u.pathname)) return;
            var key = u.pathname + u.search; if (done1[key]) return; done1[key] = true;
            var l = document.createElement('link'); l.rel = 'prefetch'; l.href = key; l.as = 'document';
            document.head.appendChild(l);
        };
        document.addEventListener('mouseover', function (e) {
            var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            clearTimeout(hoverT); if (a) hoverT = setTimeout(function () { prefetch(a); }, 80);
        }, { passive: true });
        document.addEventListener('touchstart', function (e) {
            var a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (a) prefetch(a);
        }, { passive: true });
    }
})();
