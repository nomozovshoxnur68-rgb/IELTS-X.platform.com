/*
 * IELTSX — access rules in the browser (assets/js/access.js, classic script).
 *
 * The server decides (GET /api/access gives the admin's rules + the visitor's plan level). This file only turns that into
 * "is this card locked for me?" and "where does Get Access go?" (the Price page).
 *
 *   IELTSXAccess.load()                         -> Promise<{rules, level, authenticated, admin, ok}>
 *   IELTSXAccess.assignKeys(skill, pack)        -> puts .key on the pack and on each of its tests (same keys as the server)
 *   IELTSXAccess.rule(own, parent, def)         -> { locked, plan }   (own/parent = rules[...] entries, def = catalog default)
 *   IELTSXAccess.allows(rule, level)            -> true when the visitor may open it
 *   IELTSXAccess.priceUrl(rule, next)           -> '/Price?premium=required&plan=max&next=...'
 *
 * Plans: Demo/Free 0 < Standard 1 < Max 2 < Ultra 3. A rule is { locked:false } (free) or { locked:true, plan:'standard'|'max' }.
 */
(function () {
    'use strict';

    var ORDER = { standard: 1, max: 2, ultra: 3 };
    var LABEL = { standard: 'Standard', max: 'Max', ultra: 'Ultra' };
    var state = null, pending = null;

    function slugify(s) { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9_]+/g, '-').replace(/^-+|-+$/g, ''); }
    function planOf(v) { var s = String(v || '').toLowerCase(); return s.indexOf('ultra') !== -1 ? 'ultra' : s.indexOf('max') !== -1 ? 'max' : (s.indexOf('standard') !== -1 ? 'standard' : ''); }
    function planKey(r) { return r && r.locked ? (ORDER[r.plan] ? r.plan : 'standard') : 'demo'; }

    function load() {
        if (state) return Promise.resolve(state);
        if (pending) return pending;
        var ctl = window.AbortController ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
        pending = fetch('/api/access', { credentials: 'same-origin', cache: 'no-store', signal: ctl ? ctl.signal : undefined })
            .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('access ' + r.status)); })
            .then(function (d) { return { rules: d.rules || {}, level: Number(d.level) || 0, authenticated: !!d.authenticated, admin: !!d.admin, ok: true }; })
            .catch(function () { return { rules: {}, level: 0, authenticated: false, admin: false, ok: false }; })
            .then(function (s) { clearTimeout(timer); state = s; pending = null; return s; });
        return pending;
    }

    /* keys: pack:<skill>/<slug>   test:<skill>/<slug>/<number or file name>   (admin-made tests: mat:<id>) */
    function assignKeys(skill, pack) {
        pack.key = 'pack:' + skill + '/' + pack.slug;
        var seen = {};
        (pack.tests || []).forEach(function (t, n) {
            if (t.material) return;
            var i = t._i != null ? t._i : n;
            var id = t.number != null ? String(t.number)
                : slugify(String(t.href || '').split(/[?#]/)[0].split('/').filter(Boolean).pop() || ('test-' + (i + 1)));
            if (seen[id]) id += '-' + (i + 1);
            seen[id] = true;
            t.key = 'test:' + skill + '/' + pack.slug + '/' + id;
        });
        return pack;
    }

    function has(r) { return r && typeof r === 'object'; }
    function rule(own, parent, def) {
        def = def || {};
        return {
            locked: has(own) && typeof own.locked === 'boolean' ? own.locked : (has(parent) && typeof parent.locked === 'boolean' ? parent.locked : !!def.locked),
            plan: has(own) && ORDER[own.plan] ? own.plan : (has(parent) && ORDER[parent.plan] ? parent.plan : (def.plan || 'standard'))
        };
    }
    function needed(r) { return r.locked ? (ORDER[r.plan] || 1) : 0; }
    function allows(r, level) { return (Number(level) || 0) >= needed(r); }
    function priceUrl(r, next) {
        return '/Price?premium=required&plan=' + (r && ORDER[r.plan] ? r.plan : 'standard') + (next ? '&next=' + encodeURIComponent(next) : '');
    }

    window.IELTSXAccess = { load: load, assignKeys: assignKeys, rule: rule, allows: allows, needed: needed, priceUrl: priceUrl, planOf: planOf, planKey: planKey, label: function (p) { return LABEL[p] || 'Premium'; } };
})();
