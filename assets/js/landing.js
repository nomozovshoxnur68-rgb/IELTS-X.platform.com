/*
 * IELTSX — landing page (index.html), assets/js/landing.js
 *  - a visitor who is signed in goes on to the dashboard (or to ?next=, the page that sent a first-time visitor here)
 *  - the Sign in / Get started buttons carry that page along, so the student lands where they wanted after signing in
 *  - light / dark switch (the same "theme" key and html.dark-mode class as the rest of the site)
 *  - the menu of small screens, the shadow of the bar once the page scrolls, cards that fade in as they scroll in
 *  - the plans and their prices come from /api/plans (the same numbers as the Price page)
 */
(function () {
    'use strict';
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    document.documentElement.classList.add('lp-js');

    /* ── where to go after signing in ── */
    var params = new URLSearchParams(location.search);
    function safe(v) {
        v = String(v || '');
        if (!/^\/(?!\/)/.test(v) || /[\r\n\\]/.test(v) || /^\/(login|admin-login)(\.html)?(\?|$)/i.test(v) || v === '/') return '';
        return v;
    }
    var next = safe(params.get('next')) || '/dashboard';
    function authHref(kind, to) {
        return '/login?' + (kind === 'register' ? 'mode=register&' : '') + 'next=' + encodeURIComponent(to);
    }
    $$('[data-auth]').forEach(function (a) {
        var to = safe(a.getAttribute('data-next')) || next;
        a.setAttribute('href', authHref(a.getAttribute('data-auth'), to));
    });

    /* this visitor has now seen the front door: site-access.js must not send them here again */
    try { localStorage.setItem('ix-first-visit-done', String(Date.now())); } catch (e) { /* storage blocked */ }

    /* signed in (the session cookie is HttpOnly, so ask the server) -> the dashboard */
    if (!params.has('stay')) {
        fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store', headers: { accept: 'application/json' } })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (d && d.user) {
                    try { localStorage.setItem('ieltsx_logged_in_email', d.user.email || '1'); } catch (e) { /* ignore */ }
                    location.replace(next);
                }
            })
            .catch(function () { /* offline: stay here */ });
    }

    /* ── theme ── */
    var themeBtn = $('#lp-theme');
    function paintTheme() {
        var dark = document.documentElement.classList.contains('dark-mode');
        if (themeBtn) themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (themeBtn) themeBtn.addEventListener('click', function () {
        var dark = !document.documentElement.classList.contains('dark-mode');
        document.documentElement.classList.toggle('dark-mode', dark);
        try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { /* ignore */ }
        paintTheme();
    });
    paintTheme();

    /* ── the menu of small screens ── */
    var menuBtn = $('#lp-menu-btn'), sheet = $('#lp-sheet');
    function setMenu(open) {
        if (!menuBtn || !sheet) return;
        sheet.hidden = !open;
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        var use = menuBtn.querySelector('use'); if (use) use.setAttribute('href', open ? '#i-x' : '#i-menu');
    }
    if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(sheet.hidden); });
    if (sheet) sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

    /* ── the bar gets its line once the page scrolls ── */
    var nav = $('#lp-nav');
    function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    /* ── fade in on scroll ── */
    var items = $$('.lp-reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                var el = en.target, sib = el.parentNode ? $$('.lp-reveal', el.parentNode).indexOf(el) : 0;
                el.style.transitionDelay = Math.min(Math.max(sib, 0), 5) * 60 + 'ms';
                el.classList.add('is-in'); io.unobserve(el);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        items.forEach(function (el) { io.observe(el); });
    } else items.forEach(function (el) { el.classList.add('is-in'); });

    var year = $('#lp-year'); if (year) year.textContent = String(new Date().getFullYear());

    /* ── plans ── */
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var money = function (n) { return Number(n || 0).toLocaleString('en-US').replace(/,/g, ' '); };
    var CHECK = '<svg class="ic"><use href="#i-check"/></svg>';
    function planCard(p, cur) {
        var price = p.prices && p.prices['1'], old = p.oldPrices && p.oldPrices['1'];
        var feats = (p.features || []).slice(0, 5);
        return '<div class="lp-card lp-plan lp-reveal is-in' + (p.recommended ? ' is-rec' : '') + '">' +
            '<div class="lp-plan-h"><b>' + esc(p.name) + '</b>' + (p.recommended ? '<span class="lp-plan-tag">Most popular</span>' : '') + '</div>' +
            '<div class="lp-price"><b>' + esc(money(price)) + '</b><span>' + esc(cur) + ' / month</span>' + (old && old > price ? '<s>' + esc(money(old)) + '</s>' : '') + '</div>' +
            '<ul>' + feats.map(function (f) { return '<li>' + CHECK + '<span>' + esc(f) + '</span></li>'; }).join('') + '</ul>' +
            '<a class="lp-btn ' + (p.recommended ? 'lp-btn-primary' : 'lp-btn-outline') + '" href="/Price?plan=' + encodeURIComponent(p.id) + '">Choose ' + esc(p.name) + '</a>' +
            '</div>';
    }
    var box = $('#lp-plans');
    if (box) {
        fetch('/api/plans', { credentials: 'same-origin', headers: { accept: 'application/json' } })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                var plans = d && Array.isArray(d.plans) ? d.plans.filter(function (p) { return p && p.active !== false && p.prices && p.prices['1']; }) : [];
                if (!plans.length) return;
                box.insertAdjacentHTML('beforeend', plans.slice(0, 3).map(function (p) { return planCard(p, d.currency || 'UZS'); }).join(''));
                box.style.setProperty('--n', String(Math.min(plans.length, 3) + 1));
                var free = box.firstElementChild; if (free) free.classList.add('is-in');
            })
            .catch(function () { /* the Free card and "Compare all plans" stay */ });
    }
})();
