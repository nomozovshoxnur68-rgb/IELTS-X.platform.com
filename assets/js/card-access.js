/*
 * IELTSX — the cards of the four practice pages (Reading, Listening, Writing, Speaking) follow the Access rules
 * set in the admin panel (admin#access): Demo (free) / Standard / Max / Ultra.
 *   - a card the visitor may open shows a normal Start button
 *   - a locked card shows "Get Access", which opens the Price page for the plan it needs
 *   - the badge and the Plan filter show the real plan of every card
 * Needs assets/js/access.js, practice-cards.js and (loaded before) app.js.
 */
(function () {
    'use strict';
    var A = window.IELTSXAccess, P = window.IELTSX_PRACTICE;
    if (!A || !P) return;
    var m = location.pathname.match(/\/part\/practice\/(reading|listening|writing|speaking)/i);
    if (!m) return;
    var SKILL = m[1].toLowerCase();
    var set = P[SKILL]; if (!set) return;
    var IX = (window.IELTSX = window.IELTSX || {});
    var byHref = {}, byTitle = {};
    var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim().toLowerCase(); };
    var path = function (h) { return String(h || '').split(/[?#]/)[0].replace(/\.html$/i, '').replace(/\/+$/, '').toLowerCase(); };

    var css = document.createElement('style');
    css.textContent =
        '.ix-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:32px;padding:0 12px;border-radius:6px;font-size:12px;font-weight:600;color:#fff;text-decoration:none;white-space:nowrap;border:0;cursor:pointer}' +
        '.ix-btn.get{background-image:linear-gradient(90deg,#dc2626,#e11d48 55%,#ea580c);box-shadow:0 6px 16px -6px rgba(225,29,72,.55)}' +
        '.ix-btn.get:hover{filter:brightness(.92)}.ix-btn.go{background:#2563eb}.ix-btn.go:hover{background:#1d4ed8}' +
        '.ix-btn svg{width:13px;height:13px}.ix-chip{position:absolute;top:12px;left:12px;z-index:10;padding:2px 10px;border-radius:6px;font-size:12px;font-weight:600;border:1px solid #fde68a;background:#fef3c7;color:#92400e}' +
        '.ix-chip.free{background:#dcfce7;color:#166534;border-color:#bbf7d0}';
    document.head.appendChild(css);
    var CROWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8l4 10h12l4-10-6 4-4-8-4 8z"/></svg>';

    function decorateCard(root, info) {
        if (!root || root.getAttribute('data-ix') === info.sig) return;
        root.setAttribute('data-ix', info.sig);
        var r = info.rule, label = r.locked ? A.label(r.plan).toUpperCase() : 'FREE';
        // badge (top left)
        var old = root.querySelector('.absolute.top-3.left-3');
        var chipHtml = '<span class="ix-chip ' + (r.locked ? '' : 'free') + '">' + (r.locked ? CROWN.replace('<svg', '<svg style="width:12px;height:12px;display:inline;vertical-align:-2px;margin-right:4px"') : '') + label + '</span>';
        var prev = root.querySelector('.ix-chip'); if (prev) prev.remove();
        if (old) { old.style.display = 'none'; }
        var media = root.querySelector('.relative') || root;
        media.insertAdjacentHTML('afterbegin', chipHtml);
        // button
        var btn = root.querySelector('[data-ix-btn]') || root.querySelector('a[href^="/pessages"], a[href^="/sections"], [data-get-access], a.inline-flex.bg-primary, a.inline-flex');
        if (!btn) return;
        var html, dest = info.go;
        if (!info.allowed) html = '<a class="ix-btn get" data-ix-btn href="' + A.priceUrl(r, location.pathname) + '">' + CROWN + 'Get Access</a>';
        else if (dest) html = '<a class="ix-btn go" data-ix-btn href="' + dest + '">' + (r.locked ? 'Start' : 'Start Free') + ' →</a>';
        else html = '<span class="ix-btn go" data-ix-btn style="opacity:.7;cursor:default">Unlocked</span>';
        btn.outerHTML = html;
    }

    function infoFor(root) {
        var a = root.querySelector('a[href^="/pessages"], a[href^="/sections"]');
        var h3 = root.querySelector('h3');
        var c = (a && byHref[path(a.getAttribute('href'))]) || (h3 && byTitle[norm(h3.textContent)]);
        return c || null;
    }
    function cardRoots(grid) { return Array.prototype.slice.call(grid.querySelectorAll(':scope > .h-full, :scope > div')); }

    function run(grid) {
        if (!grid) return;
        cardRoots(grid).forEach(function (root) { var i = infoFor(root); if (i) decorateCard(root, i); });
    }

    Promise.all([A.load(), window.IELTSX_ADMIN_CARDS_READY || Promise.resolve()]).then(function (res) {
        var st = res[0];
        var rules = st.rules || {};
        var pkey = 'pack:' + SKILL + '/practice-cards';
        set.cards.forEach(function (c) {
            var key = 'test:' + SKILL + '/practice-cards/' + c.id;
            var rule = A.rule(rules[key], rules[pkey], { locked: !c.free, plan: set.locked && c.free ? 'standard' : 'standard' });
            var info = { rule: rule, allowed: A.allows(rule, st.level), go: c.href || c.to || '', sig: rule.locked + ':' + rule.plan + ':' + A.allows(rule, st.level) };
            c.info = info;
            if (c.href) byHref[path(c.href)] = info;
            byTitle[norm(c.title)] = info;
        });
        // cards of tests made in the admin panel: the server already decided who may open them (locked / plan)
        (window.IELTSX_ADMIN_CARDS || []).forEach(function (c) {
            var rule = A.rule(null, null, { locked: !!c.premium, plan: A.planOf(c.plan) || 'standard' });
            var info = { rule: rule, allowed: !c.locked, go: c.href, sig: rule.locked + ':' + rule.plan + ':' + (!c.locked) };
            byHref[path(c.href)] = info; byTitle[norm(c.title)] = info;
        });
        // the Plan filter of app.js asks for the real plan of a card
        IX.cardPlanKey = function (item, free) {
            var i = (item && item.href && byHref[path(item.href)]) || (item && item.title && byTitle[norm(item.title)]);
            return i ? A.planKey(i.rule) : (free ? 'demo' : 'max');
        };
        var grid = document.getElementById('card-grid') || document.getElementById('cardsGrid');
        if (!grid) return;
        var busy = false;
        var obs = new MutationObserver(function () { if (busy) return; busy = true; obs.disconnect(); try { run(grid); } finally { obs.observe(grid, { childList: true, subtree: true }); busy = false; } });
        run(grid);
        obs.observe(grid, { childList: true, subtree: true });
    });
})();
