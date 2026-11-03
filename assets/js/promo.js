/*
 * IELTSX — the promo strip at the top of some pages (assets/js/promo.js: Price, Account, PDF materials …).
 *
 * It shows the promo code an admin marked "Strip: Show" in Price control (GET /api/plans -> promo): the real code, the
 * real discount and, only when the code has an end date, a countdown to that date. No working code = no strip.
 * The code really works: the Price page takes it (the "Upgrade" link fills it in) and the server makes the order with
 * the discount. Clicking the code copies it.
 * The last answer is kept (localStorage "ix-promo"), so the next page shows the right strip at once; loading.js hides
 * the strip before the first paint when the last known code is gone.
 */
(function () {
    'use strict';
    var KEY = 'ix-promo';
    var NAMES = { standard: 'Standard', max: 'Max', ultra: 'Ultra' };
    var GIFT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>';
    var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var timer = null;
    try { localStorage.removeItem('ix-promo-end'); } catch (e) { /* the old per-visitor countdown */ }

    function live(p) { return !!(p && p.code && p.percent && (!p.endsAt || Date.parse(p.endsAt) > Date.now())); }
    function style() {
        if (document.getElementById('ix-promo-style')) return;
        var s = document.createElement('style'); s.id = 'ix-promo-style';
        s.textContent =
            '.ix-promo{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px 12px;padding:7px 14px;font:600 13px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center}' +
            '.ix-promo svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}' +
            '.ix-promo-code{display:inline-block;margin:0 2px;padding:1px 8px;border:1px dashed rgba(255,255,255,.7);border-radius:6px;background:rgba(255,255,255,.18);color:inherit;font:700 12.5px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.06em;cursor:pointer}' +
            '.ix-promo-code:hover{background:rgba(255,255,255,.28)}' +
            '.ix-promo-timer{display:inline-flex;gap:4px;align-items:baseline;font-weight:500;opacity:.95}' +
            '.ix-promo-timer b{font-variant-numeric:tabular-nums;font-weight:700;min-width:2ch;display:inline-block;text-align:center}' +
            '.ix-promo-cta{padding:3px 12px;border-radius:999px;background:rgba(255,255,255,.18);color:inherit;text-decoration:none;font-weight:700;white-space:nowrap}' +
            '.ix-promo-cta:hover{background:rgba(255,255,255,.3)}' +
            '@media (max-width:640px){.ix-promo{font-size:12px;padding:6px 10px;gap:4px 8px}.ix-promo-timer .lbl{display:none}}';
        document.head.appendChild(s);
    }
    // a strip fixed to the top (Price page) leaves room for itself through --discount-banner-height
    function offset(b) {
        var shown = b.style.display !== 'none' && document.documentElement.classList.contains('ix-promo-on');
        var fixed = getComputedStyle(b).position === 'fixed';
        document.documentElement.style.setProperty('--discount-banner-height', shown && fixed ? b.offsetHeight + 'px' : '0px');
    }
    function hide(b) {
        clearInterval(timer);
        document.documentElement.classList.remove('ix-promo-on');
        b.style.display = 'none';
        offset(b);
    }
    function show(b, p) {
        clearInterval(timer);
        if (!live(p)) return hide(b);
        style();
        var plans = p.plans && p.plans.length ? ' on ' + p.plans.map(function (x) { return NAMES[x] || x; }).join(' / ') : '';
        b.innerHTML = '<div class="ix-promo">' + GIFT +
            '<span>Use promo code <button type="button" class="ix-promo-code" title="Copy the code">' + esc(p.code) + '</button> for <b>' + esc(p.percent) + '% off</b>' + esc(plans) + '</span>' +
            (p.endsAt ? '<span class="ix-promo-timer" role="timer"><span class="lbl">ends in</span> <b data-u="d">00</b>d <b data-u="h">00</b>h <b data-u="m">00</b>m <b data-u="s">00</b>s</span>' : '') +
            '<a class="ix-promo-cta" href="/Price?promo=' + encodeURIComponent(p.code) + '">Upgrade →</a></div>';
        b.style.display = '';
        document.documentElement.classList.add('ix-promo-on');
        var btn = b.querySelector('.ix-promo-code');
        btn.addEventListener('click', function () {
            var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = p.code; }, 1400); };
            if (navigator.clipboard) navigator.clipboard.writeText(p.code).then(done, function () { /* blocked */ }); else done();
        });
        if (p.endsAt) {
            var end = Date.parse(p.endsAt), cells = {};
            ['d', 'h', 'm', 's'].forEach(function (u) { cells[u] = b.querySelector('[data-u="' + u + '"]'); });
            var pad = function (n) { return String(n).padStart(2, '0'); };
            var tick = function () {
                var r = Math.max(0, Math.round((end - Date.now()) / 1000));
                if (r <= 0) return hide(b);
                var v = { d: Math.floor(r / 86400), h: Math.floor((r % 86400) / 3600), m: Math.floor((r % 3600) / 60), s: r % 60 };
                for (var k in v) if (cells[k] && cells[k].textContent !== pad(v[k])) cells[k].textContent = pad(v[k]);
            };
            tick();
            timer = setInterval(function () { if (!document.hidden) tick(); }, 1000);
        }
        offset(b);
    }

    function init() {
        var b = document.getElementById('discount-banner');
        if (!b) return;
        var cached = null;
        try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { /* blocked */ }
        if (live(cached)) show(b, cached); else hide(b);
        if (!window.fetch) return;
        fetch('/api/plans', { credentials: 'same-origin', cache: 'no-store' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d) return;
                var p = d.promo || null;
                try { if (p) localStorage.setItem(KEY, JSON.stringify(p)); else localStorage.removeItem(KEY); } catch (e) { /* blocked */ }
                if (JSON.stringify(p) !== JSON.stringify(cached)) { if (live(p)) show(b, p); else hide(b); }
            })
            .catch(function () { /* offline: keep what is shown */ });
        window.addEventListener('resize', function () { offset(b); });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
