/*
 * IELTSX — the site logo chosen in the admin panel (admin.html#branding), assets/js/branding.js.
 * GET /api/branding -> { logoUrl, iconUrl }. Swaps the IELTSX logo pictures of the page, the red placeholder mark in the
 * header of the test pages (.ex-logo) and the browser-tab icon. Nothing set = the built-in logos stay.
 * The last answer is kept in localStorage, so the next page shows the new logo straight away.
 * Loaded by site-access.js (most pages) and with a <script> tag on the pages without it.
 */
(function () {
    'use strict';
    if (window.__ixBranding) return; window.__ixBranding = true;
    var KEY = 'ix-branding';
    var MARK = /ieltsx-only-logo/i;                                 // the small square mark (sidebars, headers)
    var WORD = /ieltsx-logo-transparent/i;                          // the wide logo (sign-in and legal pages)
    function safe(u) {
        u = String(u || '');
        return /^\/(api\/media\/[A-Za-z0-9_-]{8,40}|uploads\/[^\s"'<>]+|assets\/[^\s"'<>]+)$/.test(u) || /^https:\/\/[^\s"'<>]+$/i.test(u) ? u : '';
    }
    function setImg(img, url) {
        if (!img.hasAttribute('data-ix-orig')) img.setAttribute('data-ix-orig', img.getAttribute('src') || '');
        var want = url || img.getAttribute('data-ix-orig');
        if (want && img.getAttribute('src') !== want) img.setAttribute('src', want);
    }
    function apply(b) {
        var logo = safe(b && b.logoUrl), icon = safe(b && b.iconUrl);
        var mark = icon || logo, word = logo || icon;
        var imgs = document.querySelectorAll('img');
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i], src = img.getAttribute('data-ix-orig') || img.getAttribute('src') || '';
            // the wide logo drawn in a small square box (admin sidebar) gets the square icon
            if (WORD.test(src)) setImg(img, img.width && img.width <= 48 && Math.abs(img.width - img.height) < 8 ? mark : word);
            else if (MARK.test(src) || img.classList.contains('brand-logo') || img.classList.contains('brand-ref')) setImg(img, mark);
        }
        // the test pages draw a placeholder <svg>: inside a box (reading, writing, the start screen) ...
        var boxes = document.querySelectorAll('.ex-logo, .ei-logo, .logo-box');
        for (var j = 0; j < boxes.length; j++) {
            var box = boxes[j], pic = box.querySelector('img[data-ix-logo]'), svg = box.querySelector('svg');
            if (mark) {
                if (!pic) { pic = document.createElement('img'); pic.setAttribute('data-ix-logo', ''); pic.alt = 'Logo'; pic.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block'; box.appendChild(pic); }
                if (pic.getAttribute('src') !== mark) pic.setAttribute('src', mark);
                if (svg) svg.style.display = 'none';
            } else { if (pic) pic.remove(); if (svg) svg.style.display = ''; }
        }
        // ... or as the <svg> itself, which carries the size class (listening)
        var svgs = document.querySelectorAll('svg.hdr-logo, svg.xr-logo');
        for (var k = 0; k < svgs.length; k++) {
            var mk = svgs[k], prev = mk.previousElementSibling, own = prev && prev.hasAttribute('data-ix-logo') ? prev : null;
            if (mark) {
                if (!own) { own = document.createElement('img'); own.setAttribute('data-ix-logo', ''); own.alt = 'Logo'; own.setAttribute('class', mk.getAttribute('class') || ''); own.style.objectFit = 'contain'; mk.parentNode.insertBefore(own, mk); }
                if (own.getAttribute('src') !== mark) own.setAttribute('src', mark);
                mk.style.display = 'none';
            } else { if (own) own.remove(); mk.style.display = ''; }
        }
        var link = document.querySelector('link[rel~="icon"]');
        if (mark) {
            if (!link) { link = document.createElement('link'); link.rel = 'icon'; link.setAttribute('data-ix-added', ''); document.head.appendChild(link); }
            if (!link.hasAttribute('data-ix-orig')) link.setAttribute('data-ix-orig', link.getAttribute('href') || '');
            if (link.getAttribute('href') !== mark) link.setAttribute('href', mark);
        } else if (link && link.hasAttribute('data-ix-orig')) {
            if (link.hasAttribute('data-ix-added')) link.remove(); else link.setAttribute('href', link.getAttribute('data-ix-orig'));
        }
    }
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { /* blocked or broken */ }
    function run(b) { try { apply(b); } catch (e) { /* the built-in logos stay */ } }
    window.IXBranding = { apply: function (b) { cached = b; run(b); } };   // the admin panel shows a saved logo at once
    function start() {
        if (cached) run(cached);
        if (!window.fetch || location.protocol === 'file:') return;
        fetch('/api/branding', { credentials: 'same-origin', cache: 'no-cache' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d) return;
                var b = { logoUrl: d.logoUrl || '', iconUrl: d.iconUrl || '' };
                try { if (b.logoUrl || b.iconUrl) localStorage.setItem(KEY, JSON.stringify(b)); else localStorage.removeItem(KEY); } catch (e) { /* blocked */ }
                cached = b; run(b);
                setTimeout(function () { run(b); }, 1500);     // pictures drawn later by the page scripts (sidebars, results)
            })
            .catch(function () { /* offline: keep what is shown */ });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
