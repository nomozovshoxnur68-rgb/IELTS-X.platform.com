/*
 * IELTSX — promo banner countdown (assets/js/promo.js)
 *
 * One shared script for every page that shows the purple "promo code" strip.
 * Before this, Account restarted the timer on every load, Predictions did the
 * same with its own copy, and the PDF page never ticked at all.
 *
 * HOW TO SET A REAL END DATE (recommended) — put this before the script tag
 * or in site-access.js:
 *     window.IELTSX_PROMO = { endsAt: '2026-11-30T23:59:59+05:00' };
 * Without it, each visitor gets a timer that starts on their first visit
 * (2 days 12 hours) and is remembered, so it no longer resets on reload.
 * When the time is over, the banner hides itself.
 */
(function () {
    'use strict';
    var KEY = 'ix-promo-end';
    var DEFAULT_MS = (2 * 24 + 12) * 3600 * 1000;

    function banner() {
        return document.getElementById('discount-banner') ||
            document.querySelector('[class*="from-purple"][class*="to-blue"]');
    }
    function digits(b) {
        var byId = ['days', 'hours', 'minutes', 'seconds'].map(function (k) { return document.getElementById(k) || document.getElementById(k + 'Left'); });
        if (byId.every(Boolean)) return byId;
        var spans = b ? Array.prototype.slice.call(b.querySelectorAll('.tabular-nums')).filter(function (el) { return el.offsetParent !== null || el.getClientRects().length; }) : [];
        return spans.length >= 4 ? spans.slice(0, 4) : null;
    }
    function endTime() {
        var cfg = window.IELTSX_PROMO && Date.parse(window.IELTSX_PROMO.endsAt);
        if (cfg) return cfg;
        try {
            var saved = Number(localStorage.getItem(KEY));
            if (saved > 0) return saved;
            var end = Date.now() + DEFAULT_MS;
            localStorage.setItem(KEY, String(end));
            return end;
        } catch (e) { return Date.now() + DEFAULT_MS; }
    }
    function hide(b) {
        if (!b) return;
        b.style.display = 'none';
        document.documentElement.style.setProperty('--discount-banner-height', '0px');
        var wrap = b.parentElement;
        if (wrap && wrap.style.paddingTop) wrap.style.paddingTop = '0px';
    }
    function init() {
        var b = banner();
        if (!b) return;
        var end = endTime();
        var els = digits(b);
        var pad = function (n) { return String(n).padStart(2, '0'); };
        function tick() {
            var r = Math.max(0, Math.round((end - Date.now()) / 1000));
            if (r <= 0) { hide(b); clearInterval(timer); return; }
            if (!els) return;
            [Math.floor(r / 86400), Math.floor((r % 86400) / 3600), Math.floor((r % 3600) / 60), r % 60].forEach(function (v, i) {
                var t = pad(v);
                if (els[i] && els[i].textContent !== t) els[i].textContent = t;
            });
        }
        var timer = setInterval(function () { if (!document.hidden) tick(); }, 1000);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
        tick();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
