/*
 * IELTSX — the Settings page (/settings, settings.html).
 * Light / dark / system (the same switch as the header, IELTSX.theme of app.js), the design of the website, the accent
 * colour and the background animation. Every choice shows at once and is kept by assets/js/site-design.js
 * (localStorage "ix-design", and with the account when signed in). The designs and colours the admin added
 * (Admin → Design) are read fresh from /api/design when the page opens.
 */
(function () {
    'use strict';
    var D = window.IXDesign;
    var $ = function (s) { return document.querySelector(s); };
    var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
    var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    if (!D) {   // the design script did not run (very old browser): say so instead of an empty page
        var root = $('#ixs-designs'); if (root) root.innerHTML = '<p class="ixs-muted">Settings are not available in this browser.</p>';
        return;
    }

    /* ───────── light / dark / system ───────── */
    function mode() { try { var v = localStorage.getItem('theme'); return v === 'light' || v === 'dark' ? v : 'system'; } catch (e) { return 'system'; } }
    function paintModes() {
        var m = mode();
        document.querySelectorAll('[data-ixs-mode]').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-ixs-mode') === m ? 'true' : 'false'); });
    }
    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-ixs-mode]'); if (!b) return;
        var m = b.getAttribute('data-ixs-mode');
        if (window.IELTSX && window.IELTSX.theme && window.IELTSX.theme.setMode) window.IELTSX.theme.setMode(m);
        else { try { localStorage.setItem('theme', m); } catch (er) { /* blocked */ } document.documentElement.classList.toggle('dark-mode', m === 'dark' || (m === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)); }
        paintModes(); render(); saved();
    });
    document.addEventListener('ieltsx:themechange', function () { paintModes(); render(); });

    /* ───────── a small picture of each design ───────── */
    function preview(d, dark) {
        var mini = '<span class="ixs-mini"><i class="ixs-mini-side"></i><i class="ixs-mini-head"></i><i class="ixs-mini-c"></i><i class="ixs-mini-c"></i><i class="ixs-mini-c"></i></span>';
        if (d.id === 'cosmic') return '<span class="ixs-prev ixs-prev-cosmic' + (dark ? ' is-dark' : '') + '"><i class="ixs-planet"></i><i class="ixs-ring"></i><i class="ixs-star" style="left:22%;top:18%"></i><i class="ixs-star" style="left:48%;top:10%"></i><i class="ixs-star" style="left:70%;top:72%"></i>' + mini + '</span>';
        if (d.custom) {
            var t = d.theme || {}, img = D.safeUrl(dark ? (t.bgDark || t.bgLight) : (t.bgLight || t.bgDark));
            var col = (dark ? t.colorDark : t.colorLight) || (dark ? '#0d1018' : '#eef1f8');
            return '<span class="ixs-prev ixs-prev-image' + (dark ? ' is-dark' : '') + '" style="background-color:' + esc(col) + (img ? ';background-image:url(&quot;' + esc(img) + '&quot;)' : '') + '">' + mini + '</span>';
        }
        return '<span class="ixs-prev ixs-prev-classic' + (dark ? ' is-dark' : '') + '">' + mini + '</span>';
    }
    function render() {
        var st = D.current(), cat = D.catalog(), dark = document.documentElement.classList.contains('dark-mode'), pref = D.get();
        var list = D.designs(cat), box = $('#ixs-designs');
        if (box) {
            box.innerHTML = list.map(function (d) {
                var on = d.id === st.id, isDefault = d.id === cat.default;
                var about = d.about || (d.theme && d.theme.stars ? 'A background picture with twinkling stars.' : 'A design added by IELTS-X.');
                return '<button type="button" role="radio" class="ixs-design" aria-checked="' + on + '" data-ixs-design="' + esc(d.id) + '">' + preview(d, dark) +
                    '<span class="ixs-design-text"><strong>' + esc(d.name) + (isDefault ? ' <em>Default</em>' : '') + '</strong><span>' + esc(about) + '</span></span>' +
                    '<span class="ixs-tick" aria-hidden="true">' + CHECK + '</span></button>';
            }).join('');
        }
        var acc = $('#ixs-accents');
        if (acc) {
            var cur = pref.accent, accents = cat.accents && cat.accents.length ? cat.accents : D.DEFAULT_ACCENTS;
            acc.innerHTML = '<button type="button" role="radio" class="ixs-swatch ixs-swatch-auto" aria-checked="' + !cur + '" data-ixs-accent="" title="The colour of the design"><span aria-hidden="true"></span><em>Auto</em></button>' +
                accents.map(function (a) {
                    return '<button type="button" role="radio" class="ixs-swatch" aria-checked="' + (cur === a.color) + '" data-ixs-accent="' + esc(a.color) + '" title="' + esc(a.name) + '" aria-label="' + esc(a.name) + '"><span style="background:' + esc(a.color) + '">' + CHECK + '</span><em>' + esc(a.name) + '</em></button>';
                }).join('');
        }
        var mo = $('#ixs-motion');
        if (mo) {
            mo.checked = pref.motion !== false && !D.reducedMotion();
            mo.disabled = D.reducedMotion();
            var help = $('#ixs-motion-help');
            if (help) help.textContent = D.reducedMotion() ? 'Off: your device asks for less motion.' : 'Twinkling stars and shooting stars on the designs that have them. Turn it off on a slow phone.';
        }
        paintModes();
    }
    var savedTimer = null;
    function saved(text) {
        var el = $('#ixs-saved'); if (!el) return;
        el.textContent = text || (window.IELTSXUser ? 'Saved to your account' : 'Saved on this device');
        el.classList.add('show'); clearTimeout(savedTimer); savedTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
    }

    document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-ixs-design],[data-ixs-accent],#ixs-reset');
        if (!t) return;
        if (t.id === 'ixs-reset') { D.set({ design: '', accent: '', motion: true }); render(); saved('Back to the default design'); return; }
        if (t.hasAttribute('data-ixs-design')) D.set({ design: t.getAttribute('data-ixs-design') });
        else D.set({ accent: t.getAttribute('data-ixs-accent') });
        render(); saved();
        var again = document.querySelector('[data-ixs-design="' + (t.getAttribute('data-ixs-design') || '') + '"],[data-ixs-accent="' + (t.getAttribute('data-ixs-accent') || '') + '"]');
        if (again && again.focus) again.focus({ preventScroll: true });
    });
    /* arrow keys move inside a group of choices, like the header switch */
    document.addEventListener('keydown', function (e) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) < 0) return;
        var b = e.target.closest && e.target.closest('[role="radio"]'), g = b && b.closest('[role="radiogroup"]');
        if (!g || !g.closest('#ixs-root')) return;
        var all = Array.prototype.slice.call(g.querySelectorAll('[role="radio"]')), i = all.indexOf(b);
        var next = all[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : all.length - 1)) % all.length];
        e.preventDefault(); next.focus(); next.click();
    });
    document.addEventListener('change', function (e) {
        if (e.target && e.target.id === 'ixs-motion') { D.set({ motion: !!e.target.checked }); saved(); }
    });
    D.onChange(function () { render(); });

    function start() {
        render();
        D.refresh(true).then(render);    // the newest designs of the admin panel
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
