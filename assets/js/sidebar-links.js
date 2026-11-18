/*
 * IELTSX — sidebar links (assets/js/sidebar-links.js)
 *
 * Every link of the sidebar is defined HERE, once, for all pages.
 * To change a link, edit its value below and save — nothing else. Links are written WITHOUT ".html" (clean URLs).
 *
 * How it works: each <a> in the sidebar markup has a data-link="key" attribute,
 * and this file sets that link's href from the table. (The href written inside
 * the HTML is only a fallback for when JavaScript is off.)
 *
 * Admin → Sidebar (admin.html#sidebar, sidebar.js on the server) can change the whole menu: groups, order, names, icons,
 * new items, who sees each item and whether it is free or locked. This file asks /api/sidebar (only the items meant for
 * this visitor arrive) and rebuilds the menu of the page from it. The last answer is kept (localStorage "ix-sidebar-cfg"),
 * so the next page shows the right menu from the first paint (assets/js/loading.js hides removed items even earlier).
 * As long as nothing was saved in the admin panel, the menu stays exactly as the pages have it.
 */
(function () {
    'use strict';

    var LINKS = {
        // ── brand (logo, top of the sidebar) ──
        "brand": "/dashboard",

        // ── full tests ──
        "listening": "/full-tests/listening/",
        "reading": "/full-tests/reading/",
        "writing": "/full-tests/writing/",
        "speaking": "/full-tests/speaking/",

        // ── part practice ──
        "listening-sections": "/part/practice/listening",
        "reading-passages": "/part/practice/reading",
        "writing-tasks": "/part/practice/writing",
        "speaking-topics": "/part/practice/speaking",

        // ── more ──
        "predictions": "/Predictions",
        "mock-tests": "/Mock%20tests",
        "game": "/game",

        // ── study tools ──
        "performance": "/study/Tools/Performance",
        "pdf-materials": "/study/Tools/Pdf%20materials",
        "articles": "/study/Tools/Articles",
        "vocabulary": "/vocabulary",
        "settings": "/settings",        // added under Study Tools by assets/js/site-design.js

        // ── account ──
        "pricing": "/Price",
        "admin-panel": "/admin"
    };

    /* the icons an item can have (Lucide, the set the sidebar already uses); the admin panel shows the same list */
    var ICONS = {
        headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
        book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
        pen: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
        mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
        layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
        timer: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
        gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
        chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
        file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
        newspaper: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
        languages: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
        settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
        star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
        flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
        calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
        video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
        link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
        graduation: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
        trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
        sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
        message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
        bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
        folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
        globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
        lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
    };
    var CROWN = '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>';
    function svg(name, inner, cls) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + (cls || 'lucide lucide-' + name) + '">' + inner + '</svg>';
    }
    function node(html) { var t = document.createElement('div'); t.innerHTML = html; return t.firstChild; }

    function apply(root) {
        var anchors = (root || document).querySelectorAll('a[data-link]');
        for (var i = 0; i < anchors.length; i++) {
            var key = anchors[i].getAttribute('data-link');
            if (Object.prototype.hasOwnProperty.call(LINKS, key) && anchors[i].getAttribute('data-ix-locked') !== '1') {
                anchors[i].setAttribute('href', LINKS[key]);
            }
        }
    }

    /* The "Game" item (live quiz games, /game) is added here once for every page, right under "Mock Tests":
       a copy of that item with its own link, icon and name (so it always looks like the rest of the menu). */
    function addGame(root) {
        var mocks = (root || document).querySelectorAll('a[data-link="mock-tests"]');
        for (var i = 0; i < mocks.length; i++) {
            var li = mocks[i].closest('li');
            if (!li || !li.parentNode || li.parentNode.querySelector('a[data-link="game"]')) continue;
            var copy = li.cloneNode(true); var a = copy.querySelector('a');
            if (!a) continue;
            a.setAttribute('data-link', 'game'); a.setAttribute('href', LINKS.game);
            a.setAttribute('data-active', /^\/game\/?$/i.test(location.pathname) ? 'true' : 'false'); a.removeAttribute('aria-current');
            var old = a.querySelector('svg');
            if (old) old.parentNode.replaceChild(node(svg('gamepad-2', ICONS.gamepad)), old);
            var label = a.querySelector('span.flex-1') || a.querySelector('span:last-of-type');
            if (label) label.textContent = 'Game';
            li.parentNode.insertBefore(copy, li.nextSibling);
        }
    }

    /* ───────── the menu made in Admin → Sidebar ───────── */
    var CACHE = 'ix-sidebar-cfg';
    var drawn = '';
    var norm = function (p) { try { p = decodeURIComponent(p); } catch (e) { /* keep */ } return String(p || '').split(/[?#]/)[0].replace(/\.html$/i, '').replace(/\/index$/i, '/').replace(/\/+$/, '').toLowerCase() || '/'; };
    var here = norm(location.pathname);
    function readCache() { try { var c = JSON.parse(localStorage.getItem(CACHE) || 'null'); return c && c.items ? c : null; } catch (e) { return null; } }
    function writeCache(c) { try { localStorage.setItem(CACHE, JSON.stringify(c)); } catch (e) { /* blocked */ } }
    function lockedHref(it, signedIn) {
        return signedIn ? '/Price?premium=required&plan=' + encodeURIComponent(it.plan || 'max') + '&next=' + encodeURIComponent(it.href)
            : '/login?next=' + encodeURIComponent(it.href);
    }
    function style() {
        if (document.getElementById('ix-sb-style')) return;
        var s = document.createElement('style'); s.id = 'ix-sb-style';
        s.textContent = '.ix-sb-badge{margin-left:auto;padding:1px 6px;border-radius:99px;font-size:9.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;line-height:1.5;background:hsl(var(--primary,221 83% 53%)/.12);color:hsl(var(--primary,221 83% 53%))}' +
            '.ix-sb-badge.hot{background:rgba(234,88,12,.12);color:#ea580c}.ix-sb-badge.free{background:rgba(22,163,74,.12);color:#16a34a}.ix-sb-badge.soon{background:hsl(var(--muted,210 40% 96%));color:hsl(var(--muted-foreground,215 16% 47%))}' +
            '[data-collapsible=icon] .ix-sb-badge{display:none}a[data-ix-locked="1"]{opacity:.85}';
        (document.head || document.documentElement).appendChild(s);
    }

    function buildOne(content, cfg) {
        var groups = [];
        for (var c = content.firstElementChild; c; c = c.nextElementSibling) {
            if (c.getAttribute('data-sidebar') === 'group' && c.querySelector('[data-sidebar="group-label"]')) groups.push(c);
        }
        if (!groups.length) return;
        // the items the page has, by key (Pricing and the Admin link stay where they are)
        var have = {}, any = null;
        groups.forEach(function (g) {
            var as = g.querySelectorAll('a[data-link]');
            for (var i = 0; i < as.length; i++) { var li = as[i].closest('li'); if (li && !have[as[i].getAttribute('data-link')]) { have[as[i].getAttribute('data-link')] = li; any = any || li; } }
        });
        if (!any) return;
        var tplLi = have.vocabulary || have.listening || any;
        var tplGroup = groups[0].cloneNode(true);
        var tplUl = tplGroup.querySelector('ul'); if (!tplUl) return;
        while (tplUl.firstChild) tplUl.removeChild(tplUl.firstChild);
        var made = [];
        cfg.groups.forEach(function (g) {
            var list = cfg.items.filter(function (it) { return it.group === g.id; });
            if (!list.length) return;
            var el = tplGroup.cloneNode(true);
            el.setAttribute('data-ix-group', g.id);
            var label = el.querySelector('[data-sidebar="group-label"]'); if (label) label.textContent = g.title;
            var ul = el.querySelector('ul');
            list.forEach(function (it) {
                var isNew = !have[it.key];   // an item the page does not have: made from a copy of another one
                var li = isNew ? tplLi.cloneNode(true) : have[it.key];
                delete have[it.key];
                var a = li.querySelector('a'); if (!a) return;
                a.setAttribute('data-link', it.key); a.removeAttribute('id');
                var lab = a.querySelector('span.flex-1') || a.querySelector('span');
                if (lab) lab.textContent = it.label;
                var svgs = a.querySelectorAll('svg');
                if (it.iconSet || isNew || !svgs.length) {
                    var ic = node(svg(it.icon, ICONS[it.icon] || ICONS.link));
                    if (svgs[0]) svgs[0].parentNode.replaceChild(ic, svgs[0]); else a.insertBefore(ic, a.firstChild);
                }
                // crowns: kept as the page has them ("default"), none for a free item, and a locked item shows one only to who lacks the plan
                var crowns = a.querySelectorAll('svg.lucide-crown');
                if (it.access !== 'default' || isNew) for (var k = 0; k < crowns.length; k++) crowns[k].remove();
                if (it.locked) a.appendChild(node(svg('crown', CROWN, 'lucide lucide-crown size-4')));
                var badge = a.querySelector('.ix-sb-badge'); if (badge) badge.remove();
                if (it.badge) { var b = document.createElement('span'); b.className = 'ix-sb-badge ' + it.badge; b.textContent = it.badge; a.insertBefore(b, a.querySelector('svg.lucide-crown')); }
                var href = it.locked ? lockedHref(it, cfg.signedIn) : (LINKS[it.key] || it.href);
                a.setAttribute('href', href);
                if (it.locked) { a.setAttribute('data-ix-locked', '1'); a.setAttribute('title', 'Needs the ' + (it.plan || 'Max').replace(/^\w/, function (x) { return x.toUpperCase(); }) + ' plan'); }
                else { a.removeAttribute('data-ix-locked'); a.removeAttribute('title'); }
                if (it.newTab && !it.locked) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); } else { a.removeAttribute('target'); a.removeAttribute('rel'); }
                if (isNew || it.custom) {
                    var on = it.href.charAt(0) === '/' && norm(it.href) === here;
                    a.setAttribute('data-active', on ? 'true' : 'false');
                    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
                }
                ul.appendChild(li);
            });
            made.push(el);
        });
        // the new groups take the place of the old ones; whatever was not asked for (hidden, or for other people) goes
        var at = groups[0];
        made.forEach(function (el) { content.insertBefore(el, at); });
        groups.forEach(function (g) { g.remove(); });
    }
    function build(cfg) {
        if (!cfg || !cfg.items || !cfg.groups) return;
        var key = JSON.stringify([cfg.groups, cfg.items, cfg.signedIn]);
        if (key === drawn) return;
        var contents = document.querySelectorAll('[data-sidebar="content"]');
        if (!contents.length) return;
        style();
        var pre = document.getElementById('ix-sb-pre'); if (pre) pre.remove();   // loading.js hid the left-out items until now
        for (var i = 0; i < contents.length; i++) { try { buildOne(contents[i], cfg); } catch (e) { /* the menu of the page stays */ } }
        drawn = key;
        api.managed = true;
    }
    /* a page that a locked item points at: a visitor without the plan goes to the Price page (or signs in first) */
    function gate(cfg) {
        if (/^\/(price|login|admin|account|settings)$/i.test(here)) return;
        for (var i = 0; i < cfg.items.length; i++) {
            var it = cfg.items[i];
            if (it.locked && it.href.charAt(0) === '/' && norm(it.href) === here) { location.replace(lockedHref(it, cfg.signedIn)); return; }
        }
    }

    var api = { links: LINKS, icons: ICONS, apply: apply, addGame: addGame, build: build, managed: false };
    window.IELTSXLinks = api;

    var hasSidebar = !!document.querySelector('[data-sidebar="content"]');
    var cached = hasSidebar ? readCache() : null;
    try { if (cached && cached.managed) build(cached); else addGame(); } catch (e) { /* the menu still works without it */ }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { apply(); });
    } else {
        apply();
    }

    // Speed: the menu asked less than a minute ago is used as it is (moving between pages asks the server once a minute at most)
    var fresh = cached && cached.t && Date.now() - cached.t < 60000 && Date.now() >= cached.t;
    if (fresh && cached.managed) gate(cached);
    if (hasSidebar && window.fetch && !fresh) {
        fetch('/api/sidebar', { credentials: 'same-origin', cache: 'no-store', headers: { accept: 'application/json' } })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d || !d.items) return;
                d.t = Date.now();
                writeCache(d);
                if (d.managed || (cached && cached.managed)) { if (!d.managed) location.reload(); else { build(d); gate(d); } }
            })
            .catch(function () { /* offline: the menu of the page stays */ });
    }
})();
