/*
 * IELTSX — Full Tests pages (assets/js/full-tests.js)
 *
 * One controller for all of:
 *   /full-tests/listening/   /full-tests/reading/   /full-tests/writing/   /full-tests/speaking/     (list of packs)
 *   /full-tests/<skill>/<pack>                                                                        (tests of one pack)
 *
 * The catalog comes from assets/js/full-tests-data.js. Tests added in the Admin panel
 * (GET /api/materials?type=<skill>) are merged in by their "pack" name.
 */
(function () {
    'use strict';

    var DATA = window.IELTSX_FULL_TESTS;
    var root = document.getElementById('ft-root');
    var A = window.IELTSXAccess;
    if (!DATA || !root || !A) return;

    var SKILL = root.getAttribute('data-skill') || '';
    var VIEW = root.getAttribute('data-view') || 'list';
    var skills = DATA.skills;

    // pack pages share one HTML file, so the skill/pack come from the address: /full-tests/<skill>/<pack>
    var pathParts = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    // fallback that needs no routing at all:  /full-tests/pack?skill=reading&pack=volume-8
    if (VIEW === 'pack' && pathParts[1] === 'pack' && window.URLSearchParams) {
        var q = new URLSearchParams(location.search);
        if (q.get('skill') && q.get('pack')) pathParts = ['full-tests', q.get('skill').toLowerCase(), q.get('pack')];
    }
    if (VIEW === 'pack') {
        SKILL = pathParts[1] || SKILL;
    }
    var info = skills[SKILL];
    if (!info) { root.innerHTML = notFound('We could not find that section.', '/'); return; }
    var packSlug = VIEW === 'pack' ? decodeURIComponent(pathParts[2] || '').toLowerCase() : '';

    /* ── tiny helpers ─────────────────────────────────────────────────────── */
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function slugify(s) {
        return String(s || '').toLowerCase().trim().replace(/[^a-z0-9_]+/g, '-').replace(/^-+|-+$/g, '');
    }
    function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ''); }
    function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
    function store(key, val) {
        try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { /* private mode */ }
        return null;
    }

    var ICON = {
        crown: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>',
        list: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
        right: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
        play: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
        book: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
        search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
        grid: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>',
        rows: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
        check: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
        skill: function (size) {
            return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + info.icon + '</svg>';
        }
    };

    function notFound(message, back) {
        return '<div class="ft-empty"><p class="ft-empty-title">' + esc(message) + '</p><a class="ft-btn ft-btn-outline" href="' + esc(back) + '">Back</a></div>';
    }

    /* ── catalog + admin tests ────────────────────────────────────────────── */
    function buildPacks() {
        var packs = (DATA.packs[SKILL] || []).map(function (p) {
            return {
                slug: p.slug, title: p.title, tier: p.tier || '', plan: p.plan || '', description: p.description || DATA.description,
                defLocked: !!p.premium, defPlan: A.planOf(p.minPlan) || 'standard',
                tests: (p.tests || []).map(function (t, i) {
                    var c = Object.assign({}, t);
                    c._i = i;
                    if (c.plan === undefined) c.plan = p.plan || '';
                    if (c.tier === undefined) c.tier = p.tier || '';
                    return c;
                }).sort(function (a, b) { return ((a.number || 0) - (b.number || 0)) || (a._i - b._i); })
            };
        }).map(function (p) { return A.assignKeys(SKILL, p); });
        return packs;
    }

    /* packs made in the admin panel: a new pack card, or the same slug as a catalog pack (then name / tier / section are taken from the admin) */
    function mergeAdminPacks(packs, adminPacks) {
        (adminPacks || []).forEach(function (ap) {
            var slug = ap.slug || slugify(ap.title);
            var pack = packs.filter(function (p) { return p.slug === slug || slugify(p.title) === slug; })[0];
            if (ap.hidden) {   // switched off in the admin panel (Packs): the card is left out, also when tests still name it
                if (pack) pack.hidden = true;
                else { pack = { slug: slug, title: slug, tests: [], extra: true, hidden: true }; A.assignKeys(SKILL, pack); packs.push(pack); }
                return;
            }
            if (!pack) {
                pack = { slug: slug, title: ap.title, tier: '', plan: '', description: DATA.description, defLocked: !!ap.premium, defPlan: 'standard', tests: [], extra: true };
                A.assignKeys(SKILL, pack);
                packs.push(pack);
            }
            pack.title = ap.title || pack.title;
            if (ap.tier) pack.tier = ap.tier;
            if (ap.plan) pack.plan = ap.plan;
            if (ap.description) pack.description = ap.description;
            if (ap.group) pack.group = ap.group;
            if (ap.order) pack.order = ap.order;
        });
        return packs;
    }

    function mergeAdminTests(packs, items) {
        (items || []).forEach(function (m) {
            if (m.mode && m.mode !== 'full') return;   // Part tests (one passage / section / task / part) live on the practice pages; only Full tests belong here
            var name = String(m.pack || '').trim() || 'Practice';
            var slug = slugify(name);
            var pack = packs.filter(function (p) { return p.slug === slug || slugify(p.title) === slug; })[0];
            if (!pack) {
                pack = { slug: slug, title: name, tier: '', plan: '', description: DATA.description, defLocked: false, defPlan: 'standard', tests: [], extra: true };
                A.assignKeys(SKILL, pack);
                packs.push(pack);
            }
            pack.tests.push({
                source: m.description || 'Added by IELTSX',
                tags: [], href: m.href || ('/test?id=' + encodeURIComponent(m.id)), premium: !!m.premium, plan: '',
                adminTitle: m.title, material: true, key: 'mat:' + m.id,
                rule: { locked: !!m.premium, plan: A.planOf(m.plan) || 'standard' }, allowed: !m.locked
            });
        });
        return packs;
    }

    /* decide, for this visitor, what is free / locked (rules from the admin panel + catalog defaults + the visitor's plan) */
    function applyAccess(packs, st) {
        var rules = st.rules || {};
        packs.forEach(function (p) {
            p.rule = A.rule(rules[p.key], null, { locked: p.defLocked, plan: p.defPlan });
            p.tests.forEach(function (t) {
                if (t.material) return;                      // admin-made tests were decided by the server
                t.rule = A.rule(rules[t.key], rules[p.key], { locked: t.premium === undefined ? p.defLocked : !!t.premium, plan: A.planOf(t.minPlan) || p.defPlan });
                t.allowed = A.allows(t.rule, st.level);
            });
            // a pack opens when the pack itself is open to this visitor or at least one of its tests is
            p.open = A.allows(p.rule, st.level) || p.tests.some(function (t) { return t.allowed; });
        });
        return packs;
    }

    function groupPacks(packs) {
        var moved = {};   // packs whose section was chosen in the admin panel
        packs.forEach(function (p) { if (p.group) moved[p.slug] = true; });
        var groups = (DATA.groups[SKILL] || []).map(function (g) {
            return { title: g.title, packs: g.packs.filter(function (slug) { return !moved[slug]; }).map(function (slug) {
                return packs.filter(function (p) { return p.slug === slug; })[0];
            }).filter(Boolean) };
        });
        packs.forEach(function (p) {
            if (!p.group) return;
            var g = groups.filter(function (x) { return x.title.toLowerCase() === p.group.toLowerCase(); })[0];
            if (!g) { g = { title: p.group, packs: [] }; groups.push(g); }
            g.packs.push(p);
        });
        var placed = {};
        groups.forEach(function (g) { g.packs.forEach(function (p) { placed[p.slug] = true; }); });
        var rest = packs.filter(function (p) { return !placed[p.slug]; });
        if (rest.length) {
            var practice = groups.filter(function (g) { return g.title === 'Practice'; })[0];
            if (practice) practice.packs = practice.packs.concat(rest);
            else groups.push({ title: 'More packs', packs: rest });
        }
        // a position set in the admin panel (Packs) puts a pack first; the others keep the catalog order
        groups.forEach(function (g) {
            g.packs = g.packs.map(function (p, i) { return { p: p, k: p.order ? p.order : 1000 + i }; })
                .sort(function (a, b) { return a.k - b.k; }).map(function (x) { return x.p; });
        });
        return groups.filter(function (g) { return g.packs.length; });
    }

    function loadAdminPacks() {
        if (!window.fetch) return Promise.resolve([]);
        return fetch('/api/packs?skill=' + encodeURIComponent(SKILL), { credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.json() : { packs: [] }; })
            .then(function (d) { return Array.isArray(d.packs) ? d.packs : []; })
            .catch(function () { return []; });
    }

    function loadAdmin() {
        if (!window.fetch) return Promise.resolve([]);
        var ctl = window.AbortController ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
        return fetch('/api/materials?type=' + encodeURIComponent(SKILL) + '&mode=full', { credentials: 'same-origin', signal: ctl ? ctl.signal : undefined })
            .then(function (r) { return r.ok ? r.json() : { items: [] }; })
            .then(function (d) { return Array.isArray(d.items) ? d.items : []; })
            .catch(function () { return []; })
            .then(function (x) { clearTimeout(timer); return x; });
    }

    /* ── page shell bits: header breadcrumb, sidebar highlight, page title ─── */
    function setCrumbs(parts) {
        var nav = document.getElementById('ft-crumbs');
        if (!nav) return;
        nav.innerHTML = parts.map(function (p, i) {
            var last = i === parts.length - 1;
            var inner = last || !p.href ? '<span class="ft-crumb-current" aria-current="page">' + esc(p.label) + '</span>'
                : '<a class="ft-crumb" href="' + esc(p.href) + '">' + esc(p.label) + '</a>';
            return (i ? '<span class="ft-crumb-sep" aria-hidden="true">' + ICON.right + '</span>' : '') + inner;
        }).join('');
    }
    function markSidebar() {
        document.querySelectorAll('[data-sidebar="menu-button"][data-active]').forEach(function (a) { a.setAttribute('data-active', 'false'); a.removeAttribute('aria-current'); });
        var a = document.querySelector('a[data-link="' + SKILL + '"]');
        if (a) { a.setAttribute('data-active', 'true'); a.setAttribute('aria-current', 'page'); }
    }

    /* ── badges ───────────────────────────────────────────────────────────── */
    function planBadge(plan) { return '<span class="ft-badge ft-badge-plan">' + ICON.crown + esc(plan) + '</span>'; }
    function tierBadge(tier) { return '<span class="ft-badge ft-badge-tier">' + esc(tier) + '</span>'; }
    function freeBadge() { return '<span class="ft-badge ft-badge-free">Free</span>'; }
    function accessBadge(rule) { return rule && rule.locked ? planBadge(A.label(rule.plan).toUpperCase()) : freeBadge(); }
    function levelBadge(rule, tier) { return (tier ? tierBadge(tier) : '') + accessBadge(rule); }
    function getAccess(href, cls) {
        return '<a class="ft-btn ft-btn-access ' + (cls || '') + '" href="' + esc(href) + '" data-get-access>' + ICON.crown + 'Get Access</a>';
    }

    /* ── LIST OF PACKS ────────────────────────────────────────────────────── */
    function packCard(p) {
        var n = p.tests.length;
        return '<article class="ft-card ft-pack">' +
            '<div class="ft-pack-top"><div class="ft-pack-name"><h3>' + esc(p.title) + '</h3><p>' + esc(info.word) + '</p></div>' +
            accessBadge(p.rule) + '</div>' +
            '<p class="ft-pack-desc">' + esc(p.description) + '</p>' +
            '<div class="ft-pack-foot"><span class="ft-count">' + ICON.list + plural(n, 'test') + '</span>' +
            (p.open ? '<a class="ft-btn ft-btn-outline" href="/full-tests/' + esc(SKILL) + '/' + esc(p.slug) + '">View Tests ' + ICON.right + '</a>'
                : getAccess(A.priceUrl(p.rule, '/full-tests/' + SKILL + '/' + p.slug))) + '</div>' +
            '</article>';
    }

    function renderList(packs) {
        var groups = groupPacks(packs);
        var total = packs.length;
        setCrumbs([{ label: 'Home', href: '/' }, { label: info.crumb }]);
        root.innerHTML =
            '<div class="ft-wrap">' +
            '<div class="ft-title"><span class="ft-icon ft-' + info.color + '">' + ICON.skill(24) + '</span>' +
            '<div><h1>' + esc(info.title) + '</h1><p>' + esc(info.subtitle) + '</p></div></div>' +
            '<p class="ft-meta">' + plural(total, 'test pack') + ' available</p>' +
            (groups.length ? groups.map(function (g) {
                return '<section class="ft-group"><div class="ft-group-head"><h2>' + esc(g.title) + '</h2><span>' + plural(g.packs.length, 'pack') + '</span></div>' +
                    '<div class="ft-grid">' + g.packs.map(packCard).join('') + '</div></section>';
            }).join('') : '<div class="ft-empty"><p class="ft-empty-title">No packs yet.</p><p>New ' + esc(info.word.toLowerCase()) + ' tests will appear here soon.</p></div>') +
            '</div>';
    }

    /* ── ONE PACK ─────────────────────────────────────────────────────────── */
    function doneSet() {
        var set = [];
        try {
            if (window.IELTSXData && window.IELTSXData.getCurrentUserResults) {
                window.IELTSXData.getCurrentUserResults().forEach(function (r) { set.push(norm(r.testKey), norm(r.pageLabel)); });
            }
        } catch (e) { /* no results yet */ }
        return set.filter(Boolean);
    }
    function isDone(t, done) {
        var keys = [norm(t.source), norm(t.adminTitle), norm((t.href || '').split('/').pop())].filter(function (k) { return k.length > 3; });
        return done.some(function (d) { return keys.some(function (k) { return d === k || d.indexOf(k) !== -1; }); });
    }

    function testCard(t, i, list, done) {
        var maxTags = 2;
        var tags = (t.tags || []);
        var shown = tags.slice(0, maxTags).map(function (x) { return '<span class="ft-tag">' + esc(x) + '</span>'; }).join('');
        var more = tags.length > maxTags ? '<span class="ft-tag ft-tag-more">+' + (tags.length - maxTags) + ' more</span>' : '';
        var title = t.adminTitle || ('Test ' + (i + 1));
        var source = (info.sourcePrefix || '') + (t.source || '');
        var badge = levelBadge(t.rule, t.tier);
        var finished = t.done ? '<span class="ft-badge ft-badge-done">' + ICON.check + 'Completed</span>' : '';
        var start = t.allowed
            ? '<a class="ft-btn ft-btn-dark ft-start" href="' + esc(t.href || '#') + '">' + ICON.play + (t.done ? 'Retake' : 'Start') + '</a>'
            : getAccess(A.priceUrl(t.rule, location.pathname), 'ft-start');
        if (list) {
            return '<article class="ft-card ft-test ft-test-row"><div class="ft-test-main">' +
                '<div class="ft-test-head"><h3>' + esc(title) + '</h3>' + badge + finished + '</div>' +
                '<p class="ft-source">' + ICON.book + '<span>' + esc(source) + '</span></p>' +
                ((shown || more) ? '<div class="ft-tags">' + shown + more + '</div>' : '') + '</div>' + start + '</article>';
        }
        return '<article class="ft-card ft-test"><div class="ft-test-head"><h3>' + esc(title) + '</h3><span class="ft-spacer"></span>' + finished + badge + '</div>' +
            '<p class="ft-source">' + ICON.book + '<span>' + esc(source) + '</span></p>' +
            '<div class="ft-test-foot"><div class="ft-tags">' + shown + more + '</div>' + start + '</div></article>';
    }

    function renderPack(packs) {
        var pack = packs.filter(function (p) { return p.slug === packSlug || slugify(p.title) === packSlug; })[0];
        if (!pack) {
            setCrumbs([{ label: 'Home', href: '/' }, { label: info.crumb, href: '/full-tests/' + SKILL + '/' }, { label: 'Not found' }]);
            root.innerHTML = '<div class="ft-wrap">' + notFound('This pack does not exist.', '/full-tests/' + SKILL + '/') + '</div>';
            return;
        }
        document.title = 'IELTSX — ' + pack.title + ' · ' + info.crumb;
        setCrumbs([{ label: 'Home', href: '/' }, { label: info.crumb, href: '/full-tests/' + SKILL + '/' }, { label: pack.title }]);

        var done = doneSet();
        pack.tests.forEach(function (t) { t.done = isDone(t, done); });

        var state = { q: '', filter: 'all', view: store('ixft-view') === 'grid' ? 'grid' : 'list' };

        root.innerHTML =
            '<div class="ft-wrap">' +
            '<div class="ft-title ft-title-pack"><span class="ft-skill-icon ft-' + (SKILL === 'listening' ? 'blue' : info.color) + '">' + ICON.skill(30) + '</span><h1>' + esc(pack.title) + '</h1></div>' +
            '<div class="ft-chips"><span class="ft-badge ft-badge-soft">' + esc(info.word) + '</span>' + levelBadge(pack.rule, pack.tier) + '</div>' +
            '<div class="ft-toolbar">' +
            '<label class="ft-search"><span class="sr-only">Search tests</span>' + ICON.search + '<input id="ft-q" type="search" placeholder="Search tests..." autocomplete="off"></label>' +
            '<div class="ft-seg" role="group" aria-label="Filter"><button type="button" data-filter="all" aria-pressed="true">All Tests</button><button type="button" data-filter="completed" aria-pressed="false">Completed</button></div>' +
            '<div class="ft-seg ft-seg-icons" role="group" aria-label="Layout"><button type="button" data-view="grid" aria-label="Grid view" title="Grid view">' + ICON.grid + '</button><button type="button" data-view="list" aria-label="List view" title="List view">' + ICON.rows + '</button></div>' +
            '</div>' +
            '<p class="ft-meta" id="ft-count" aria-live="polite"></p>' +
            '<div id="ft-tests"></div></div>';

        var box = document.getElementById('ft-tests');
        var q = document.getElementById('ft-q');

        function draw() {
            var needle = state.q.trim().toLowerCase();
            var rows = pack.tests.map(function (t, i) { return { t: t, i: i }; }).filter(function (x) {
                if (state.filter === 'completed' && !x.t.done) return false;
                if (!needle) return true;
                var hay = [x.t.adminTitle || ('Test ' + (x.i + 1)), x.t.source].concat(x.t.tags || []).join(' ').toLowerCase();
                return hay.indexOf(needle) !== -1;
            });
            var list = state.view === 'list';
            if (!rows.length) {
                var msg = !pack.tests.length ? 'No tests in this pack yet.' : state.filter === 'completed' && !needle ? 'You have not completed any test in this pack yet.' : 'No tests match your search.';
                box.className = '';
                box.innerHTML = '<div class="ft-empty"><p class="ft-empty-title">' + esc(msg) + '</p>' + (!pack.tests.length ? '<p>New tests are added regularly.</p>' : '') + '</div>';
            } else {
                box.className = list ? 'ft-list' : 'ft-grid ft-grid-tests';
                box.innerHTML = rows.map(function (x) { return testCard(x.t, x.i, list, done); }).join('');
            }
            document.getElementById('ft-count').textContent = rows.length === pack.tests.length ? plural(pack.tests.length, 'test') : 'Showing ' + rows.length + ' of ' + pack.tests.length + ' tests';
            root.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === state.view)); });
            root.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === state.filter)); });
        }

        var typing;
        q.addEventListener('input', function () { clearTimeout(typing); typing = setTimeout(function () { state.q = q.value; draw(); }, 120); });
        root.addEventListener('click', function (e) {
            var v = e.target.closest('[data-view]'); if (v) { state.view = v.getAttribute('data-view'); store('ixft-view', state.view); draw(); return; }
            var f = e.target.closest('[data-filter]'); if (f) { state.filter = f.getAttribute('data-filter'); draw(); return; }
        });
        draw();
    }

    /* ── go ───────────────────────────────────────────────────────────────── */
    markSidebar();
    document.title = 'IELTSX — ' + info.title;
    root.innerHTML = '<div class="ft-wrap"><div class="ft-skeleton" aria-busy="true"><span></span><span></span><span></span></div></div>';

    Promise.all([loadAdmin(), A.load(), loadAdminPacks()]).then(function (res) {
        var packs = applyAccess(mergeAdminTests(mergeAdminPacks(buildPacks(), res[2]), res[0]), res[1])
            .filter(function (p) { return !p.hidden; });
        if (VIEW === 'pack') renderPack(packs); else renderList(packs);
    });
})();
