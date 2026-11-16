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
    var LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="11" x="4" y="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
    var planName = function (p) { p = String(p || 'standard'); return p.charAt(0).toUpperCase() + p.slice(1); };
    /* a badge for what is not simply free: locked for this visitor, or (seen only by admins) hidden / locked for others */
    function badge(d) {
        if (d.access === 'hidden') return ' <em class="ixs-tag-hidden" title="Only admins see this">Hidden</em>';
        if (d.access === 'locked') return d.allowed ? ' <em class="ixs-tag-plan">' + esc(planName(d.plan)) + '</em>' : ' <em class="ixs-tag-lock">' + LOCK + esc(planName(d.plan)) + '</em>';
        return '';
    }
    /* one choice: a design or an animation (a locked one leads to the Price page instead of being chosen) */
    function card(d, attr, on, isDefault, prev, about) {
        var locked = d.allowed === false;
        return '<button type="button" role="radio" class="ixs-design' + (locked ? ' is-locked' : '') + '" aria-checked="' + (on && !locked) + '" ' + attr + '="' + esc(d.id) + '"' +
            (locked ? ' data-ixs-locked="' + esc(d.plan || 'standard') + '" aria-label="' + esc(d.name + ': for the ' + planName(d.plan) + ' plan') + '"' : '') + '>' + prev +
            (locked ? '<span class="ixs-lock" aria-hidden="true">' + LOCK + '</span>' : '') +
            '<span class="ixs-design-text"><strong>' + esc(d.name) + (isDefault ? ' <em>Default</em>' : '') + badge(d) + '</strong><span>' +
            esc(locked ? 'For the ' + planName(d.plan) + ' plan. ' + about : about) + '</span></span>' +
            '<span class="ixs-tick" aria-hidden="true">' + CHECK + '</span></button>';
    }
    function fxPreview(id, dark) {
        var mini = '<span class="ixs-mini"><i class="ixs-mini-side"></i><i class="ixs-mini-head"></i><i class="ixs-mini-c"></i><i class="ixs-mini-c"></i><i class="ixs-mini-c"></i></span>';
        var cls = 'ixs-prev ixs-prev-fx ixs-prev-' + id + (dark ? ' is-dark' : '');
        if (id === 'snow') { var f = ''; for (var i = 0; i < 18; i++) f += '<i class="ixs-flake" style="left:' + ((i * 37) % 97 + 1) + '%;top:' + ((i * 53) % 88 + 4) + '%;--s:' + (2 + (i % 3)) + 'px"></i>'; return '<span class="' + cls + '">' + mini + f + '</span>'; }
        if (id === 'garland') {   // three sagging spans of wire with bulbs, like the real one
            var C = ['#ff4d4d', '#ffd23f', '#3ddc84', '#3fa9ff', '#ff6ad5'], wire = '', bulbs = '', n = 0;
            for (var s = 0; s < 3; s++) {
                var x0 = -6 + s * 72, x1 = x0 + 72, cx = x0 + 36, cy = 30;
                wire += 'M' + x0 + ' 2Q' + cx + ' ' + cy + ' ' + x1 + ' 2';
                for (var k = 0; k < 4; k++) {
                    var t = (k + 0.5) / 4, mt = 1 - t, px = mt * mt * x0 + 2 * mt * t * cx + t * t * x1, py = mt * mt * 2 + 2 * mt * t * cy + t * t * 2;
                    bulbs += '<ellipse cx="' + px.toFixed(1) + '" cy="' + (py + 6).toFixed(1) + '" rx="3.2" ry="4.6" fill="' + C[n % 5] + '" filter="url(#ixs-glow)"/>'; n++;
                }
            }
            return '<span class="' + cls + '">' + mini + '<svg class="ixs-garland" viewBox="0 0 204 40" aria-hidden="true"><defs><filter id="ixs-glow" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="' + wire + '" fill="none" stroke="#2b4a35" stroke-width="1.6"/>' + bulbs + '</svg></span>';
        }
        return '<span class="' + cls + '">' + mini + '</span>';
    }
    function render() {
        var st = D.current(), cat = D.catalog(), dark = document.documentElement.classList.contains('dark-mode'), pref = D.get();
        var list = D.designs(cat), box = $('#ixs-designs');
        if (box) {
            box.innerHTML = list.map(function (d) {
                var about = d.about || (d.theme && d.theme.stars ? 'A background picture with twinkling stars.' : 'A design added by IELTS-X.');
                return card(d, 'data-ixs-design', d.id === st.id, d.id === cat.default, preview(d, dark), about);
            }).join('');
        }
        var fx = D.effects ? D.effects(cat) : [], fxBox = $('#ixs-effects'), fxCard = $('#ixs-fx-card');
        if (fxCard) fxCard.hidden = !fx.length;
        if (fxBox && fx.length) {
            var none = { id: 'none', name: 'None', allowed: true, access: 'free' };
            fxBox.innerHTML = card(none, 'data-ixs-effect', !st.effect, !cat.defaultEffect, fxPreview('none', dark), 'No animation.') +
                fx.map(function (e) { return card(e, 'data-ixs-effect', e.id === st.effect, e.id === cat.defaultEffect, fxPreview(e.id, dark), e.about || ''); }).join('');
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
            if (help) help.textContent = D.reducedMotion() ? 'Off: your device asks for less motion.' : 'Twinkling and shooting stars on the designs that have them (Cosmic, designs with stars). Turn it off on a slow phone.';
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
        var t = e.target.closest && e.target.closest('[data-ixs-design],[data-ixs-effect],[data-ixs-accent],#ixs-reset');
        if (!t) return;
        if (t.id === 'ixs-reset') { D.set({ design: '', effect: '', accent: '', motion: true }); render(); saved('Back to the default design'); return; }
        if (t.hasAttribute('data-ixs-locked')) {   // the server would refuse it too: show the plans instead
            var plan = t.getAttribute('data-ixs-locked');
            saved('This one is for the ' + planName(plan) + ' plan');
            location.href = D.priceUrl ? D.priceUrl(plan) : '/Price';
            return;
        }
        if (t.hasAttribute('data-ixs-design')) D.set({ design: t.getAttribute('data-ixs-design') });
        else if (t.hasAttribute('data-ixs-effect')) D.set({ effect: t.getAttribute('data-ixs-effect') });
        else D.set({ accent: t.getAttribute('data-ixs-accent') });
        render(); saved();
        var sel = ['design', 'effect', 'accent'].map(function (k) { var v = t.getAttribute('data-ixs-' + k); return v === null ? '' : '[data-ixs-' + k + '="' + v + '"]'; }).filter(Boolean).join(',');
        var again = sel && document.querySelector(sel);
        if (again && again.focus) again.focus({ preventScroll: true });
    });
    /* arrow keys move inside a group of choices, like the header switch */
    document.addEventListener('keydown', function (e) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) < 0) return;
        var b = e.target.closest && e.target.closest('[role="radio"]'), g = b && b.closest('[role="radiogroup"]');
        if (!g || !g.closest('#ixs-root')) return;
        var all = Array.prototype.slice.call(g.querySelectorAll('[role="radio"]:not([data-ixs-locked])')), i = all.indexOf(b);   // the arrows skip what is locked
        if (!all.length) return;
        var next = all[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : all.length - 1) + all.length) % all.length];
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
