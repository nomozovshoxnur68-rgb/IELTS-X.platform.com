/*
 * IELTSX — the site logo chosen in the admin panel (admin.html#branding), assets/js/branding.js.
 *
 * The server sends the chosen logo at fixed addresses (server.js, brandImage): /icon.png (the square mark),
 * /logo.png (the wide logo), /favicon.ico and /apple-touch-icon.png. Every page points its logo pictures at those
 * addresses in its HTML, and the test pages paint their placeholder <svg> with /icon.png in their CSS, so the logo
 * of the admin panel is what shows from the first paint. (The pages used to show the old built-in logo and swap it
 * here after asking /api/branding: the old logo flashed on every page, and every page made one more server call.)
 *
 * What is left for this file: pictures that page scripts draw later with an old built-in file name, the placeholder
 * <svg> of a test page whose CSS does not paint it, and showing a logo just saved in the admin panel at once.
 * Loaded by site-access.js (most pages) and with a <script> tag on the pages without it.
 */
(function () {
    'use strict';
    if (window.__ixBranding) return; window.__ixBranding = true;
    var MARK = /ieltsx-only-logo|ieltsx-mark/i;                     // the old built-in square mark
    var WORD = /ieltsx-logo-transparent/i;                          // the old built-in wide logo
    var FIXED = /^\/(icon|logo)\.png(?:[?#]|$)/;
    var bust = '';                                                  // "?v=…" after a logo was saved in the admin panel
    function setImg(img, url) { if (img.getAttribute('src') !== url) img.setAttribute('src', url); }
    /* the size the placeholder is drawn at: the logo takes exactly that place, whatever the size of the file */
    function markSize(el) {
        if (!el) return null;
        var r = el.getBoundingClientRect();
        if (r.width > 2 && r.height > 2) return [Math.round(r.width) + 'px', Math.round(r.height) + 'px'];
        // a hidden screen (the exam bar, the results) has no box yet: its CSS size, kept as written ("100%" stays "100%")
        var cs = getComputedStyle(el), w = cs.width, h = cs.height;
        var ok = function (v) { return /^\d+(\.\d+)?%$/.test(v) || (/px$/.test(v) && parseFloat(v) > 2); };
        return ok(w) && ok(h) ? [w, h] : null;
    }
    function sizeStyle(sz) {
        return 'display:block;object-fit:contain;flex:0 0 auto;' + (sz ? 'width:' + sz[0] + ';height:' + sz[1] : 'width:auto;height:32px;max-width:100%');
    }
    function apply() {
        var mark = '/icon.png' + bust, word = '/logo.png' + bust;
        var imgs = document.querySelectorAll('img');
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i], src = img.getAttribute('src') || '';
            if (FIXED.test(src)) { if (bust && src.indexOf(bust) < 0) setImg(img, src.replace(/[?#].*$/, '') + bust); continue; }
            // the wide logo drawn in a small square box (admin sidebar) gets the square mark
            if (WORD.test(src)) setImg(img, img.width && img.width <= 48 && Math.abs(img.width - img.height) < 8 ? mark : word);
            else if (MARK.test(src) || ((img.classList.contains('brand-logo') || img.classList.contains('brand-ref')) && !/^data:/.test(src) && src !== mark)) setImg(img, mark);
        }
        // the placeholder <svg> of the test pages: inside a box (reading, writing, the start screen) ...
        var boxes = document.querySelectorAll('.ex-logo, .ei-logo, .logo-box');
        for (var j = 0; j < boxes.length; j++) {
            var box = boxes[j], pic = box.querySelector('img[data-ix-logo]'), svg = box.querySelector('svg');
            if (!pic) { pic = document.createElement('img'); pic.setAttribute('data-ix-logo', ''); pic.alt = 'Logo'; pic.style.cssText = sizeStyle(markSize(svg) || markSize(box)); box.appendChild(pic); }
            setImg(pic, mark);
            if (svg) svg.style.display = 'none';
        }
        // ... or as the <svg> itself, which carries the size class (listening)
        var svgs = document.querySelectorAll('svg.hdr-logo, svg.xr-logo');
        for (var k = 0; k < svgs.length; k++) {
            var mk = svgs[k], prev = mk.previousElementSibling, own = prev && prev.hasAttribute('data-ix-logo') ? prev : null;
            if (!own) { own = document.createElement('img'); own.setAttribute('data-ix-logo', ''); own.alt = 'Logo'; own.setAttribute('class', mk.getAttribute('class') || ''); own.style.cssText = sizeStyle(markSize(mk)); mk.parentNode.insertBefore(own, mk); }
            setImg(own, mark);
            mk.style.display = 'none';
        }
        // the tab icon: the fixed addresses already send the chosen icon; a page with another icon address gets /icon.png
        var links = document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]');
        for (var l = 0; l < links.length; l++) {
            var href = links[l].getAttribute('href') || '';
            var fixed = /^\/(favicon\.ico|favicon\.png|icon\.png|apple-touch-icon\.png)(?:[?#]|$)/.test(href);
            var want = fixed ? href.replace(/[?#].*$/, '') + bust : mark;
            if (href !== want) links[l].setAttribute('href', want);
        }
    }
    function run() { try { apply(); } catch (e) { /* the pictures of the page stay */ } }
    // the admin panel shows a logo it has just saved at once (the fixed addresses are kept by the browser for an hour)
    window.IXBranding = { apply: function (b) { bust = '?v=' + encodeURIComponent((b && b.updatedAt) || Date.now()); run(); } };
    function start() {
        run();
        setTimeout(run, 1500);     // pictures drawn later by the page scripts (sidebars, results)
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
