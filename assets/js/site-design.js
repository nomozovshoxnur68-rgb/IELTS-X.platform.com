/*
 * IELTSX — the design of the website (assets/js/site-design.js), chosen by each visitor on the Settings page (/settings).
 *
 *  - "classic": the site as it always looked (plus the colours the admin set in Admin → Design → Site colours)
 *  - "cosmic":  a space background (a pale sky with a ringed planet in light mode, deep space with the night side of
 *               the Earth in dark mode), glass cards and sidebar
 *  - designs the admin added (a background picture or colour for light and dark, an accent colour, optional stars)
 *  - an animation over any design: "snow" (Snowfall) or "garland" (New Year lights)
 *  - an accent colour of the visitor's own (the list is set in the admin panel)
 *
 * Who may use each design and animation is set in Admin → Design (free, locked for a plan, hidden) and kept by the
 * server: /api/design lists only what this visitor may see (a locked design comes without its pictures), and the drawing
 * code of Cosmic, Snowfall and New Year lights is not in this file: it comes from /api/design/fx/<id>.js, which the
 * server sends only to a visitor who may use it (design-src/ on the server).
 *
 * Loaded with ONE line at the end of <head> of the ordinary pages only (home, practice and full-test lists,
 * Predictions, Mock tests, Articles, PDF, Performance, Price, Vocabulary, Account, Settings). Test and exam pages never
 * load it, so nothing moves behind a test; the path check below is only a safety net.
 *
 * Speed: the colours are set before the first paint (no flash). The picture of Cosmic is drawn once per window size in a
 * Web Worker (never on the page's thread) and kept in Cache Storage, so the next pages only copy it; the stars of a
 * design with stars are a few batched paths. Everything that moves (twinkles, the shooting star, snow, the lights) is drawn by ONE requestAnimationFrame
 * loop, at most 30 frames a second, on a canvas each (no DOM node per particle, nothing read from the layout while it
 * runs); the loop stops while the tab is hidden, never runs with prefers-reduced-motion, draws fewer particles on a
 * small or slow device and halves them by itself when a frame takes too long. The glass of the cards has no
 * backdrop-filter (a blur under every card was what made scrolling slow over the moving background).
 *
 * Storage: the visitor's choice in localStorage "ix-design" (and with the account, /api/account/design, when signed
 * in); the list of designs in localStorage "ix-design-site", refreshed from /api/design every few minutes and whenever
 * the signed-in account changes.
 */
(function () {
    'use strict';
    if (window.IXDesign) return;
    var doc = document, html = doc.documentElement;
    var TEST_PAGE = /^\/(full-tests\/[^/]+\/test-|pessages?\/|sections\/test-|full-mock\/|exam\/|writing\/|listening\/|test(\.html)?(\/|$)|game)/i;
    if (TEST_PAGE.test(location.pathname)) return;

    var PREF_KEY = 'ix-design', SITE_KEY = 'ix-design-site', REFRESH_MS = 2 * 60 * 1000;
    var DEFAULT_ACCENTS = [{ name: 'Blue', color: '#2563eb' }, { name: 'Violet', color: '#7c3aed' }, { name: 'Emerald', color: '#059669' },
        { name: 'Rose', color: '#e11d48' }, { name: 'Amber', color: '#d97706' }, { name: 'Teal', color: '#0d9488' }];
    var BUILTIN_NAMES = { cosmic: 'Cosmic', snow: 'Snowfall', garland: 'New Year lights' };
    var EFFECTS = ['snow', 'garland'];
    var listeners = [];

    /* ───────── storage ───────── */
    function readJSON(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } }
    function writeJSON(key, v) { try { if (v == null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* blocked */ } }
    var HEX = /^#[0-9a-f]{6}$/i, ID = /^(classic|cosmic|t-[a-z0-9]{4,16})$/, FX = /^(snow|garland)$/, ACCESS = /^(free|locked|hidden)$/, PLAN = /^(standard|max|ultra)$/;
    function readPref() {
        var p = readJSON(PREF_KEY) || {};
        return { design: ID.test(p.design || '') ? p.design : '', effect: p.effect === 'none' || FX.test(p.effect || '') ? p.effect : '',
            accent: HEX.test(p.accent || '') ? p.accent.toLowerCase() : '', motion: p.motion !== false, at: Number(p.at) || 0 };
    }
    function rule(r, name) {
        return { name: String(r.name || name || ''), access: ACCESS.test(r.access || '') ? r.access : 'free', plan: PLAN.test(r.plan || '') ? r.plan : 'standard', allowed: r.allowed !== false };
    }
    function catalog() {
        var c = readJSON(SITE_KEY) || {}, builtins = {};
        // a list saved by the first version of this file (no "builtins"): Cosmic as it was, until /api/design answers
        var b = c.builtins && typeof c.builtins === 'object' ? c.builtins : (c.cosmicVisible === false ? {} : { cosmic: {} });
        Object.keys(BUILTIN_NAMES).forEach(function (id) { if (b[id] && typeof b[id] === 'object') builtins[id] = rule(b[id], BUILTIN_NAMES[id]); });
        return {
            default: ID.test(c.default || '') ? c.default : 'classic', defaultEffect: FX.test(c.defaultEffect || '') ? c.defaultEffect : '',
            builtins: builtins, colors: c.colors && typeof c.colors === 'object' ? c.colors : {},
            themes: Array.isArray(c.themes) ? c.themes.filter(function (t) { return t && ID.test(t.id || '') && t.id.indexOf('t-') === 0 && (c.builtins || t.visible !== false); })
                .map(function (t) { var o = {}; for (var k in t) o[k] = t[k]; var r = rule(t, t.name); o.access = r.access; o.plan = r.plan; o.allowed = r.allowed; return o; }) : [],
            accents: Array.isArray(c.accents) ? c.accents.filter(function (a) { return a && HEX.test(a.color || ''); }) : DEFAULT_ACCENTS,
            level: String(c.level || 'free'), uid: String(c.uid || ''), fxVersion: /^[a-z0-9]{1,20}$/.test(c.fxVersion || '') ? c.fxVersion : '',
            updatedAt: c.updatedAt || '', t: Number(c.t) || 0, fresh: !!c.builtins
        };
    }
    /* a picture address the admin saved (the same rule as the logo, assets/js/branding.js) */
    function safeUrl(u) {
        u = String(u || '');
        return /^\/(api\/media\/[A-Za-z0-9_-]{8,40}|uploads\/[^\s"'<>()\\]+|assets\/[^\s"'<>()\\]+)$/.test(u) || /^https:\/\/[^\s"'<>()\\]+$/i.test(u) ? u : '';
    }
    function priceUrl(plan) { return '/Price?premium=required&plan=' + (PLAN.test(plan || '') ? plan : 'standard') + '&next=' + encodeURIComponent('/settings'); }

    /* the designs and animations offered on the Settings page (with what is locked or hidden for this visitor) */
    function designs(cat) {
        cat = cat || catalog();
        var out = [{ id: 'classic', name: 'Classic', builtin: true, access: 'free', allowed: true, about: 'The clean IELTS-X look.' }];
        var c = cat.builtins.cosmic;
        if (c) out.push({ id: 'cosmic', name: 'Cosmic', builtin: true, access: c.access, plan: c.plan, allowed: c.allowed, about: 'Space: a ringed planet by day, the Earth at night.' });
        cat.themes.forEach(function (t) { out.push({ id: t.id, name: t.name || 'Custom design', custom: true, theme: t, access: t.access, plan: t.plan, allowed: t.allowed }); });
        return out;
    }
    function effects(cat) {
        cat = cat || catalog();
        var about = { snow: 'Gentle snow falling over the page.', garland: 'Twinkling New Year lights along the top.' };
        return EFFECTS.filter(function (id) { return cat.builtins[id]; }).map(function (id) {
            var r = cat.builtins[id]; return { id: id, name: r.name || BUILTIN_NAMES[id], access: r.access, plan: r.plan, allowed: r.allowed, about: about[id] };
        });
    }
    function resolve(pref, cat) {
        var list = designs(cat), ok = function (id) { return list.some(function (d) { return d.id === id && d.allowed; }); };
        if (pref.design && ok(pref.design)) return pref.design;
        return ok(cat.default) ? cat.default : 'classic';
    }
    function resolveEffect(pref, cat) {
        if (pref.effect === 'none') return '';
        var ok = function (id) { return !!id && !!cat.builtins[id] && cat.builtins[id].allowed; };
        if (pref.effect && ok(pref.effect)) return pref.effect;
        return ok(cat.defaultEffect) ? cat.defaultEffect : '';
    }
    var reduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
    var isDark = function () { return html.classList.contains('dark-mode'); };

    /* ───────── colours ───────── */
    function hexToHsl(hex) {
        var r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, h = 0, s = 0, d = max - min;
        if (d) {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
            h *= 60;
        }
        return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
    }
    var tri = function (h, s, l) { return h + ' ' + s + '% ' + l + '%'; };
    function rgba(hex, a) { return 'rgba(' + parseInt(hex.slice(1, 3), 16) + ',' + parseInt(hex.slice(3, 5), 16) + ',' + parseInt(hex.slice(5, 7), 16) + ',' + a + ')'; }
    function accentDecl(hex, dark) {
        var c = hexToHsl(hex), l = dark ? Math.max(56, Math.min(72, c[2])) : Math.min(c[2], 58);
        return '--primary:' + tri(c[0], c[1], l) + ';--primary-foreground:' + (l > 62 ? '222 47% 9%' : '0 0% 100%') +
            ';--sidebar-ring:' + tri(c[0], c[1], l) + ';--ix-load:' + hex + ';--ix-load-glow:' + rgba(hex, 0.45) + ';--ix-primary:hsl(' + tri(c[0], c[1], l) + ');';
    }
    function sidebarDecl(hex) {
        var c = hexToHsl(hex), light = c[2] > 55;
        return '--sidebar:' + tri(c[0], c[1], c[2]) + ';--sidebar-background:' + tri(c[0], c[1], c[2]) +
            ';--sidebar-accent:' + tri(c[0], c[1], light ? c[2] - 5 : c[2] + 7) + ';--sidebar-border:' + tri(c[0], c[1], light ? c[2] - 8 : c[2] + 9) +
            ';--sidebar-foreground:' + (light ? '240 5% 26%' : '210 16% 86%') + ';--sidebar-accent-foreground:' + (light ? '240 6% 10%' : '0 0% 98%') + ';';
    }
    function surfaceDecl(names, hex, dark) {
        var c = hexToHsl(hex), out = '';
        names.forEach(function (n) { out += '--' + n + ':' + tri(c[0], c[1], c[2]) + ';'; });
        if (dark ? c[2] > 58 : c[2] < 42) {   // a colour on the "wrong" side of the mode: the text follows it
            var fg = c[2] > 50 ? '222 47% 11%' : '210 20% 94%';
            names.forEach(function (n) { out += '--' + (n === 'background' ? 'foreground' : n + '-foreground') + ':' + fg + ';'; });
            if (names[0] === 'background') out += '--muted-foreground:' + (c[2] > 50 ? '215 16% 40%' : '215 14% 72%') + ';';
        }
        return out;
    }

    /* ───────── the styles of the designs (only added to a page that shows one) ───────── */
    var CARDS = '.test-pack-card,.bg-card,.rounded-xl.border,.rounded-lg.border.bg-card,.ft-card,.mt-card,.ixp-card,.acc-card,.pf-card,.ixs-card';
    var S = 'html[data-ix-scene]';
    var CSS = [
        /* the page itself is the background picture, the surfaces are glass (no backdrop-filter: see the top of the file) */
        S + '{background:var(--ixd-base)!important;--bg-body:transparent;--bg-card:var(--ixd-glass);--header-bg:var(--ixd-head);--sidebar-bg:var(--ixd-side)}',
        S + ' body,' + S + ' #root,' + S + ' main,' + S + ' .bg-background{background:transparent!important}',
        '#ixd-bg{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--ixd-sky);contain:strict}',
        '#ixd-bg>canvas,#ixd-bg>.ixd-img,#ixd-bg>.ixd-veil{position:absolute;inset:0;width:100%;height:100%;display:block}',
        '#ixd-bg>.ixd-img{background:var(--ixd-img,none) center/cover no-repeat}#ixd-bg>.ixd-veil{background:var(--ixd-veil,transparent)}',
        'html[data-ix-scene="cosmic"] #ixd-bg>canvas.ixd-scene{opacity:0;transition:opacity .5s ease-out}html[data-ix-scene="cosmic"] #ixd-bg>canvas.ixd-scene.is-in{opacity:1}@media (prefers-reduced-motion:reduce){#ixd-bg>canvas.ixd-scene{transition:none!important}}',
        S + ' main>header,' + S + ' header.sticky{background:var(--ixd-head)!important;border-color:var(--ixd-line)!important}',
        S + ' [data-sidebar="sidebar"],' + S + ' #sidebar-panel{background:var(--ixd-side)!important}',
        S + ' [data-sidebar="sidebar"] .bg-sidebar,' + S + ' [data-sidebar="sidebar"]>div,' + S + ' #sidebar-panel>div,' + S + ' #sidebar-panel>div>div{background:transparent!important}',
        S + ' .fixed.inset-y-0{border-color:var(--ixd-line)!important}',
        S + ' [data-sidebar="menu-button"][data-active="true"],' + S + ' #sidebar-panel .menu-item>a[aria-current="page"]{background:hsl(var(--primary)/.13)!important;color:hsl(var(--primary))!important}',
        S + ' :is(' + CARDS + '){background:var(--ixd-glass)!important;border-color:var(--ixd-line)!important;box-shadow:var(--ixd-shadow)!important}',
        S + ' .pdp{--pdp-card:var(--ixd-glass);--pdp-line:var(--ixd-line)}' + S + ' .vx-card,' + S + ' .vs-card{--vx-bg:var(--ixd-glass);--vx-bd:var(--ixd-line)}',
        S + ' .test-pack-card{border-radius:16px}',
        S + ' main section>h2.text-2xl{position:relative;padding-left:14px}',
        S + ' main section>h2.text-2xl::before{content:"";position:absolute;left:0;top:.2em;bottom:.2em;width:4px;border-radius:4px;background:linear-gradient(hsl(var(--primary)),hsl(var(--primary)/.45))}',
        S + ':not(.dark-mode) .test-pack-card a.border{border-color:hsl(var(--primary)/.45);color:hsl(var(--primary));background:rgba(255,255,255,.55)}',
        S + ':not(.dark-mode) .test-pack-card .bg-secondary{background:rgba(244,246,255,.85);border-color:hsl(var(--border))}',
        S + '.dark-mode .test-pack-card a.border{border-color:var(--ixd-line);background:rgba(255,255,255,.04)}',
        S + '.dark-mode .test-pack-card .bg-secondary{background:rgba(255,255,255,.06);border-color:var(--ixd-line)}',
        S + '.dark-mode main h1,' + S + '.dark-mode main h2{text-shadow:0 1px 12px rgba(0,0,0,.45)}',

        /* the glass of each design and mode (a little more solid than a blurred glass would need) */
        S + ':not(.dark-mode){--ixd-glass:rgba(255,255,255,.86);--ixd-line:rgba(255,255,255,.95);--ixd-side:rgba(255,255,255,.9);--ixd-head:rgba(255,255,255,.55);--ixd-shadow:0 10px 30px -14px rgba(64,76,170,.35)}',
        S + '.dark-mode{--ixd-glass:rgba(11,18,42,.76);--ixd-line:rgba(140,165,255,.17);--ixd-side:rgba(5,9,24,.86);--ixd-head:rgba(4,8,22,.55);--ixd-shadow:0 14px 34px -16px rgba(0,0,0,.7)}',
        'html[data-ix-scene="image"]:not(.dark-mode){--ixd-glass:rgba(255,255,255,.88);--ixd-side:rgba(255,255,255,.9);--ixd-head:rgba(255,255,255,.62)}',
        'html[data-ix-scene="image"].dark-mode{--ixd-glass:rgba(16,19,28,.82);--ixd-line:rgba(255,255,255,.12);--ixd-side:rgba(12,14,22,.88);--ixd-head:rgba(12,14,22,.6)}',
        '@media (max-width:767px){' + S + ':not(.dark-mode){--ixd-glass:rgba(255,255,255,.92)}' + S + '.dark-mode{--ixd-glass:rgba(11,18,42,.88)}html[data-ix-scene="image"].dark-mode{--ixd-glass:rgba(16,19,28,.9)}}',
        '@media (prefers-reduced-transparency:reduce){' + S + ':not(.dark-mode){--ixd-glass:rgba(255,255,255,.96)}' + S + '.dark-mode{--ixd-glass:rgba(11,18,42,.95)}}',

        /* Cosmic: the tokens of the whole page follow the sky */
        'html[data-ix-scene="cosmic"]:not(.dark-mode){--ixd-base:#dde3ff;--background:232 70% 97%;--secondary:230 60% 95%;--muted:230 60% 95%;--accent:230 60% 94%;--border:230 40% 87%;--input:230 40% 87%;--primary:228 80% 55%;--sidebar:0 0% 100%;--sidebar-accent:230 60% 95%;--sidebar-border:230 40% 90%;' +
            '--ixd-sky:radial-gradient(55% 48% at 80% 32%,rgba(255,255,255,.75),transparent 70%),radial-gradient(60% 55% at 12% 88%,rgba(196,181,253,.5),transparent 70%),radial-gradient(50% 40% at 35% 10%,rgba(165,180,252,.45),transparent 70%),linear-gradient(162deg,#eef0ff 0%,#dbe1ff 38%,#ccd4fb 64%,#e4e1fb 100%)}',
        'html[data-ix-scene="cosmic"].dark-mode{--ixd-base:#030716;--background:228 55% 7%;--card:226 45% 11%;--popover:226 45% 11%;--secondary:226 38% 16%;--muted:226 38% 16%;--accent:226 38% 18%;--border:225 32% 22%;--input:225 32% 22%;--muted-foreground:220 18% 72%;' +
            '--sidebar:228 55% 6%;--sidebar-accent:226 40% 15%;--sidebar-border:225 32% 18%;' +
            '--ixd-sky:radial-gradient(42% 36% at 30% 16%,rgba(124,58,237,.30),transparent 70%),radial-gradient(38% 32% at 55% 28%,rgba(59,130,246,.16),transparent 70%),radial-gradient(55% 45% at 88% 88%,rgba(37,99,235,.22),transparent 70%),linear-gradient(180deg,#020512 0%,#050b22 55%,#0a1736 100%)}'
    ].join('\n');
    /* the layer of the animations (over any design, also Classic): it never takes a click */
    var FX_CSS = '#ixd-fx{position:fixed;left:0;top:0;width:100%;height:100%;z-index:45;pointer-events:none;contain:strict}#ixd-fx[data-band]{height:var(--ixd-band)}#ixd-fx>canvas{display:block;width:100%;height:100%}';

    var baseStyle = null, varStyle = null, fxStyle = null;
    function ensureStyles(scene, effect) {
        var head = doc.head || html;
        if (scene && !baseStyle) {
            baseStyle = doc.createElement('style'); baseStyle.id = 'ix-design-css'; baseStyle.textContent = CSS;
            head.appendChild(baseStyle);
            if (varStyle) head.appendChild(varStyle);    // the colours stay after the design styles
        }
        if (effect && !fxStyle) { fxStyle = doc.createElement('style'); fxStyle.id = 'ix-design-fx-css'; fxStyle.textContent = FX_CSS; head.appendChild(fxStyle); }
        if (!varStyle) { varStyle = doc.createElement('style'); varStyle.id = 'ix-design-vars'; head.appendChild(varStyle); }
    }
    function cssVars(st) {
        var c = st.cat.colors || {}, t = st.theme, L = '', D = '';
        var accent = st.pref.accent || (t && HEX.test(t.accent || '') ? t.accent : '') || (HEX.test(c.accent || '') ? c.accent : '');
        if (accent) { L += accentDecl(accent.toLowerCase(), false); D += accentDecl(accent.toLowerCase(), true); }
        if (!st.scene) {   // the site colours of the classic design
            if (HEX.test(c.sidebarLight || '')) L += sidebarDecl(c.sidebarLight);
            if (HEX.test(c.sidebarDark || '')) D += sidebarDecl(c.sidebarDark);
            if (HEX.test(c.cardLight || '')) L += surfaceDecl(['card', 'popover'], c.cardLight, false);
            if (HEX.test(c.cardDark || '')) D += surfaceDecl(['card', 'popover'], c.cardDark, true);
            if (HEX.test(c.bgLight || '')) L += surfaceDecl(['background'], c.bgLight, false);
            if (HEX.test(c.bgDark || '')) D += surfaceDecl(['background'], c.bgDark, true);
        } else if (st.scene === 'image') {
            var il = safeUrl(t.bgLight) || safeUrl(t.bgDark), id = safeUrl(t.bgDark) || safeUrl(t.bgLight), v = Math.max(0, Math.min(80, Number(t.veil) || 0)) / 100;
            var cl = HEX.test(t.colorLight || '') ? t.colorLight : '#eef1f8', cd = HEX.test(t.colorDark || '') ? t.colorDark : '#0d1018';
            L += '--ixd-base:' + cl + ';--ixd-sky:' + cl + ';--ixd-img:' + (il ? 'url("' + il + '")' : 'none') + ';--ixd-veil:rgba(255,255,255,' + v + ');' + surfaceDecl(['background'], cl, false);
            D += '--ixd-base:' + cd + ';--ixd-sky:' + cd + ';--ixd-img:' + (id ? 'url("' + id + '")' : 'none') + ';--ixd-veil:rgba(0,0,0,' + v + ');' + surfaceDecl(['background'], cd, true);
        }
        var sel = 'html[data-ix-d][data-ix-d]';   // stronger than the page and design tokens
        return (L ? sel + ':not(.dark-mode){' + L + '}\n' : '') + (D ? sel + '.dark-mode{' + D + '}' : '');
    }

    /* ───────── helpers for the drawings (also used by the code of /api/design/fx/) ───────── */
    function rng(seed) {   // the same stars on every page and every redraw
        return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    }
    var gauss = function (r) { return (r() + r() + r() - 1.5) / 1.5; };
    function dot(ctx, x, y, r, color, a) { ctx.globalAlpha = a; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); }
    function glow(ctx, x, y, r, color, a) {
        var g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    /* the stars of a design with stars: each colour and (rounded) opacity is ONE path (one fill per star was slow on a weak GPU) */
    function stars(ctx, w, h, r, dark, density) {
        var n = Math.min(dark ? 380 : 120, Math.round(w * h / density)), buckets = {}, glows = [], k2;
        for (var i = 0; i < n; i++) {
            var x = r() * w, y = r() * h, big = r() < 0.06, rad = big ? 1 + r() * 0.9 : 0.35 + r() * 0.75, k = r();
            var col = !dark ? '#ffffff' : k < 0.14 ? '#ffe9c4' : k < 0.3 ? '#c7d7ff' : '#ffffff';
            k2 = col + '|' + Math.max(1, Math.round((dark ? 0.35 + r() * 0.65 : 0.45 + r() * 0.5) * 10));
            (buckets[k2] || (buckets[k2] = [])).push(x, y, rad);
            if (big && dark) glows.push([x, y, rad * 6]);
        }
        glows.forEach(function (g) { glow(ctx, g[0], g[1], g[2], 'rgba(190,210,255,1)', 0.18); });
        for (k2 in buckets) {
            var p = buckets[k2], j = k2.indexOf('|');
            ctx.globalAlpha = Number(k2.slice(j + 1)) / 10; ctx.fillStyle = k2.slice(0, j); ctx.beginPath();
            for (var q = 0; q < p.length; q += 3) { ctx.moveTo(p[q] + p[q + 2], p[q + 1]); ctx.arc(p[q], p[q + 1], p[q + 2], 0, 6.2832); }
            ctx.fill();
        }
    }
    function makeCanvas(w, h) { var c = doc.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
    /* a small, slow or data-saving device: fewer particles, fewer frames */
    var LOW = (function () {
        try {
            var n = navigator, c = n.connection || {};
            return !!(c.saveData || (n.deviceMemory && n.deviceMemory <= 2) || (n.hardwareConcurrency && n.hardwareConcurrency <= 4 && Math.min(screen.width, screen.height) < 768));
        } catch (e) { return false; }
    })();

    /* ───────── the code of Cosmic and of the animations (/api/design/fx/<id>.js, sent only to who may use it) ───────── */
    var fxDefs = {}, fxLoading = {}, fxFailedAt = 0;
    function needFx(id, cat) {
        if (fxDefs[id] || fxLoading[id] || !window.fetch || location.protocol === 'file:') return;
        fxLoading[id] = 1;
        var s = doc.createElement('script'); s.async = true;
        s.src = '/api/design/fx/' + id + '.js' + (cat.fxVersion ? '?v=' + cat.fxVersion : '');
        s.onerror = function () {   // refused (locked or hidden since) or offline: ask the server again what this visitor may use
            fxLoading[id] = 0; s.remove();
            if (Date.now() - fxFailedAt > 60000) { fxFailedAt = Date.now(); refresh(true); }
        };
        (doc.head || html).appendChild(s);
    }
    function defineFx(id, def) {
        if (!BUILTIN_NAMES[id] || !def || typeof def !== 'object') return;
        fxDefs[id] = def; fxLoading[id] = 0;
        if (current) { drawn = ''; layers(current); }
    }

    /* ───────── the animation engine: ONE loop for every moving canvas ───────── */
    var runners = [], raf = 0, vw = 0, vh = 0;
    /* the size of a fixed layer: the window without its scroll bar (read only on start and on resize, never in the loop) */
    function viewport() { vw = Math.max(1, html.clientWidth || window.innerWidth || 1); vh = Math.max(1, window.innerHeight || html.clientHeight || 1); }
    function sizeRunner(r) {
        var w = vw, h = r.band ? Math.min(r.band, vh) : vh;
        var dpr = Math.min(window.devicePixelRatio || 1, r.band ? 2 : LOW ? 1 : 1.5);
        if (w * h * dpr * dpr > 2.4e6) dpr = Math.max(0.75, Math.sqrt(2.4e6 / (w * h)));
        r.canvas.width = Math.round(w * dpr); r.canvas.height = Math.round(h * dpr);
        r.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        r.w = w; r.h = h;
        if (r.inst.resize) r.inst.resize(w, h);
        if (!moving()) still(r);
    }
    function still(r) { r.ctx.clearRect(0, 0, r.w, r.h); if (r.inst.still) r.inst.still(r.ctx); }
    function moving() { return !reduced.matches && !doc.hidden; }
    function tick(now) {
        raf = 0;
        if (!runners.length || !moving()) return;
        raf = requestAnimationFrame(tick);
        for (var i = 0; i < runners.length; i++) {
            var r = runners[i], iv = 1000 / r.fps;
            if (r.last && now - r.last < iv - 2) continue;          // at most r.fps frames a second
            var dt = r.last ? Math.min(now - r.last, 100) : iv; r.last = now;
            var t0 = performance.now();
            try { r.inst.frame(r.ctx, now, dt); } catch (e) { r.canvas.remove(); runners.splice(i--, 1); continue; }   // a broken animation goes, the page stays
            r.cost = r.cost * 0.92 + (performance.now() - t0) * 0.08;
            if (r.cost > 4 && !r.lowered) {                           // too slow here: half the particles, fewer frames
                r.lowered = true; r.fps = Math.min(r.fps, 24);
                if (r.inst.lower) r.inst.lower();
            }
        }
    }
    function startLoop() {
        if (raf || !runners.length) return;
        if (!moving()) { runners.forEach(still); return; }
        runners.forEach(function (r) { r.last = 0; });
        raf = requestAnimationFrame(tick);
    }
    function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
    var api = {
        dark: isDark, low: LOW, rng: rng, gauss: gauss, dot: dot, glow: glow, canvas: makeCanvas,
        reduced: function () { return !!reduced.matches; }
    };
    /* key: what the runner draws (a new key = a new runner); host: where its canvas goes; def: { fps, band, create(api, opts) } */
    function setRunner(slot, key, host, def, opts) {
        var old = null;
        runners = runners.filter(function (r) { if (r.slot !== slot) return true; old = r; return false; });
        if (old && old.key === key && old.canvas.parentNode === host) { runners.push(old); return old; }
        if (old) old.canvas.remove();
        if (!key || !host || !def) { if (!runners.length) stopLoop(); return null; }
        var inst = null; try { inst = def.create(api, opts || {}); } catch (e) { inst = null; }
        if (!inst || typeof inst.frame !== 'function') return null;
        var cv = doc.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); cv.className = 'ixd-' + slot;
        var r = { slot: slot, key: key, canvas: cv, ctx: cv.getContext('2d'), inst: inst, fps: Math.min(30, def.fps || 30) * (LOW ? 0.8 : 1), band: def.band || 0, last: 0, cost: 0, lowered: false };
        if (!r.ctx) return null;
        host.appendChild(cv);
        if (r.band) host.style.setProperty('--ixd-band', r.band + 'px');
        runners.push(r);
        sizeRunner(r);
        stopLoop(); startLoop();
        return r;
    }

    /* the twinkles of Cosmic and of the designs with stars, and the shooting star of the night sky */
    var SPARKS_LIGHT = [[41, 7, 16], [52, 15, 30], [57.5, 13.5, 11], [27, 31, 9], [75, 3, 13], [84, 83, 11], [69, 62, 8], [95, 56, 10], [36, 62, 8]];
    var twinkles = {
        fps: 30,
        create: function (a, o) {
            var dark = a.dark(), list = [], w = 0, h = 0, spr = sparkle(dark), shoot = !!o.shoot, prev = [];
            if (o.cosmic && !dark) list = SPARKS_LIGHT.map(function (s, i) { return [s[0], s[1], s[2], 3.2 + (i % 4) * 0.9, (i * 0.7) % 4]; });
            else { var r = rng(dark ? 11 : 5), n = o.cosmic ? 12 : 8; for (var i = 0; i < n; i++) list.push([4 + r() * 92, 3 + r() * (o.cosmic ? 60 : 90), 6 + r() * 9, 2.6 + r() * 3.5, r() * 5]); }
            if (LOW) list = list.slice(0, Math.ceil(list.length * 0.6));
            function sparkle(dk) {   // a four-pointed star in a soft glow, drawn once
                var S = 64, c = makeCanvas(S, S), x = c.getContext('2d'), m = S / 2, R = S * 0.21, k = R * 0.13;
                var g = x.createRadialGradient(m, m, 0, m, m, m);
                g.addColorStop(0, dk ? 'rgba(191,219,254,.55)' : 'rgba(255,255,255,.7)'); g.addColorStop(0.5, dk ? 'rgba(96,165,250,.12)' : 'rgba(199,210,254,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
                x.fillStyle = g; x.fillRect(0, 0, S, S);
                x.beginPath(); x.moveTo(m, m - R); x.lineTo(m + k, m - k); x.lineTo(m + R, m); x.lineTo(m + k, m + k); x.lineTo(m, m + R); x.lineTo(m - k, m + k); x.lineTo(m - R, m); x.lineTo(m - k, m - k); x.closePath();
                var g2 = x.createRadialGradient(m, m, 0, m, m, R); g2.addColorStop(0, '#fff'); g2.addColorStop(0.3, '#fff'); g2.addColorStop(0.65, 'rgba(255,255,255,.55)'); g2.addColorStop(1, 'rgba(255,255,255,0)');
                x.fillStyle = g2; x.fill();
                return c;
            }
            function draw(ctx, now, still) {
                var i, p;
                for (i = 0; i < prev.length; i++) ctx.clearRect(prev[i][0], prev[i][1], prev[i][2], prev[i][3]);   // only what was drawn last time
                prev = [];
                for (i = 0; i < list.length; i++) {
                    var s = list[i], cx = s[0] / 100 * w, cy = s[1] / 100 * h;
                    var e = still ? 1 : 0.5 - 0.5 * Math.cos(((now / 1000 + s[4]) / s[3]) * 6.2832);   // 0 → 1 → 0, like the CSS twinkle was
                    var size = s[2] * 2.4 * (0.62 + 0.38 * e), half = size / 2;
                    ctx.globalAlpha = 0.85 * (0.3 + 0.7 * e);
                    ctx.drawImage(spr, cx - half, cy - half, size, size);
                    var full = s[2] * 1.2 + 1; prev.push([cx - full, cy - full, full * 2, full * 2]);
                }
                if (shoot && !still) {   // every 11 s from 2.5 s: 0.9 s across the sky
                    p = ((now / 1000 - 2.5) % 11 + 11) % 11 / 11;
                    if (p < 0.08) {
                        var q = p / 0.08, ease = 1 - Math.pow(1 - q, 3), al = q < 0.15 ? q / 0.15 : 1 - (q - 0.15) / 0.85;
                        var x0 = 0.66 * w - 430 * ease, y0 = 0.08 * h + 131 * ease;
                        ctx.save(); ctx.translate(x0, y0); ctx.rotate(-17 * Math.PI / 180);
                        var g = ctx.createLinearGradient(0, 0, 170, 0); g.addColorStop(0, '#fff'); g.addColorStop(0.3, 'rgba(165,195,255,.6)'); g.addColorStop(1, 'rgba(165,195,255,0)');
                        ctx.globalAlpha = Math.max(0, al); ctx.fillStyle = g; ctx.fillRect(0, -1, 170, 2);
                        ctx.restore();
                        prev.push([x0 - 6, y0 - 60, 190, 76]);
                    }
                }
                ctx.globalAlpha = 1;
            }
            return {
                resize: function (W, H) { w = W; h = H; prev = []; },
                frame: function (ctx, now) { draw(ctx, now, false); },
                still: function () { /* nothing moves: the drawn stars stay */ },
                lower: function () { list = list.slice(0, Math.ceil(list.length / 2)); prev.push([0, 0, w, h]); }
            };
        }
    };

    /* ───────── the background layer and the animation layer ───────── */
    /* The picture of Cosmic (the planet, the Earth and its lights: big gradients and thousands of dots) took 0.3–0.7 s of
       the page's own thread on a weak laptop, at EVERY page opened. Now it is drawn once per window size and mode in a
       Web Worker (another thread: the page never waits for it), kept in the browser's Cache Storage as a WebP, and on
       the next pages only decoded (also off the page's thread) and copied. It fades in over the sky colours. */
    var SCENE_CACHE = 'ixd-scene-v1', sceneToken = 0, worker = null, jobs = {}, jobN = 0;
    var WORKER_SRC = [
        'self.window = self; var defs = {}; self.IXDesign = { defineFx: function (id, d) { defs[id] = d; } };',
        'function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }',
        'var api = { gauss: function (r) { return (r() + r() + r() - 1.5) / 1.5; }, glow: function (c, x, y, r, color, a) { var g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)"); c.globalAlpha = a; c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); } };',
        'onmessage = function (e) { var m = e.data;',
        '  try {',
        '    if (!defs.cosmic) importScripts(m.src);',
        '    var c = new OffscreenCanvas(m.pw, m.ph), x = c.getContext("2d"); x.setTransform(m.dpr, 0, 0, m.dpr, 0, 0);',
        '    defs.cosmic.scene(x, m.w, m.h, m.dark, rng(m.dark ? 7 : 3), api);',
        '    createImageBitmap(c).then(function (b) { postMessage({ id: m.id, bmp: b }, [b]); return c.convertToBlob({ type: "image/webp", quality: 0.92 }); })',
        '      .then(function (blob) { postMessage({ id: m.id, blob: blob }); }, function () { postMessage({ id: m.id, end: 1 }); });',
        '  } catch (err) { postMessage({ id: m.id, error: String(err) }); }',
        '};'
    ].join('\n');
    function cachedScene(key) {
        if (!window.caches || !window.createImageBitmap) return Promise.resolve(null);
        return caches.open(SCENE_CACHE).then(function (c) { return c.match(key); })
            .then(function (r) { return r ? r.blob() : null; })
            .then(function (b) { return b ? createImageBitmap(b) : null; })
            .catch(function () { return null; });
    }
    function storeScene(key, blob) {
        if (!window.caches || !blob) return;
        caches.open(SCENE_CACHE).then(function (c) {
            return c.keys().then(function (keys) {   // a few sizes are kept, the oldest go
                keys.slice(0, Math.max(0, keys.length - 5)).forEach(function (k) { c.delete(k); });
                return c.put(key, new Response(blob, { headers: { 'Content-Type': blob.type || 'image/webp' } }));
            });
        }).catch(function () { /* private mode, full disk: drawn again next time */ });
    }
    function sceneHere(job) {   // no Worker / OffscreenCanvas: on this thread, when it is idle, on a CPU canvas (faster for many small shapes)
        var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 50); };
        idle(function () {
            if (job.token !== sceneToken || !fxDefs.cosmic) return;
            var c = makeCanvas(job.pw, job.ph), x = c.getContext('2d', { willReadFrequently: true });
            if (!x) return;
            x.setTransform(job.dpr, 0, 0, job.dpr, 0, 0);
            try { fxDefs.cosmic.scene(x, job.w, job.h, job.dark, rng(job.dark ? 7 : 3), api); } catch (e) { return; }
            job.put(c);
            if (c.toBlob) c.toBlob(function (b) { storeScene(job.key, b); }, 'image/webp', 0.92);
        }, { timeout: 600 });
    }
    function sceneInWorker(job) {
        if (!worker) {
            if (!window.Worker || !window.OffscreenCanvas || !window.Blob || !window.URL) return sceneHere(job);
            try { worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }))); } catch (e) { worker = false; }
            if (!worker) return sceneHere(job);
            worker.onmessage = function (e) {
                var d = e.data || {}, j = jobs[d.id]; if (!j) { if (d.bmp && d.bmp.close) d.bmp.close(); return; }
                if (d.bmp) j.put(d.bmp);
                if (d.blob) storeScene(j.key, d.blob);
                if (d.blob || d.end || d.error) delete jobs[d.id];
                if (d.error) sceneHere(j);   // the worker could not draw it: here instead
            };
            worker.onerror = function () { var all = jobs; jobs = {}; worker = false; Object.keys(all).forEach(function (k) { sceneHere(all[k]); }); };
        }
        if (worker === false) return sceneHere(job);
        job.id = ++jobN; jobs[job.id] = job;
        worker.postMessage({ id: job.id, src: location.origin + '/api/design/fx/cosmic.js' + (job.v ? '?v=' + job.v : ''), w: job.w, h: job.h, dpr: job.dpr, pw: job.pw, ph: job.ph, dark: job.dark });
    }
    var layer = null, fxLayer = null, drawn = '', lastW = 0, lastH = 0;
    function drawScene(st) {
        var cv = layer && layer.querySelector('canvas.ixd-scene');
        if (!cv) return;
        viewport();
        var w = vw, h = vh, dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2);
        if (w * h * dpr * dpr > 4.5e6) dpr = Math.sqrt(4.5e6 / (w * h));
        var pw = Math.round(w * dpr), ph = Math.round(h * dpr), dark = isDark(), token = ++sceneToken;
        lastW = w; lastH = h;
        if (st.scene !== 'cosmic') {   // a design of the admin with stars: a light drawing, right here
            if (!(st.theme && st.theme.stars)) return;
            cv.width = pw; cv.height = ph;
            var ctx = cv.getContext('2d'); if (!ctx) return;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            stars(ctx, w, h, rng(dark ? 7 : 3), true, dark ? 5200 : 9000);
            ctx.globalAlpha = 1;
            return;
        }
        if (!fxDefs.cosmic || !fxDefs.cosmic.scene) return;
        var job = { token: token, key: '/__ixd-scene/' + [st.cat.fxVersion || 'x', dark ? 'd' : 'l', pw, ph].join('-') + '.webp', v: st.cat.fxVersion,
            w: w, h: h, dpr: dpr, pw: pw, ph: ph, dark: dark };
        job.put = function (src) {   // the old picture stays (stretched) until the new one is ready
            if (job.token !== sceneToken || !cv.isConnected) { if (src.close) src.close(); return; }
            if (cv.width !== pw || cv.height !== ph) { cv.width = pw; cv.height = ph; }
            var c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.clearRect(0, 0, pw, ph); c.drawImage(src, 0, 0, pw, ph);
            if (src.close) src.close();
            cv.classList.add('is-in');
        };
        cachedScene(job.key).then(function (bmp) {
            if (token !== sceneToken) { if (bmp && bmp.close) bmp.close(); return; }
            if (bmp) job.put(bmp); else sceneInWorker(job);
        });
    }
    function layers(st) {
        if (!doc.body) return;
        var dark = isDark() ? 'd' : 'l';
        if (st.scene === 'cosmic') needFx('cosmic', st.cat);
        if (st.effect) needFx(st.effect, st.cat);
        /* the background: a picture, the static drawing, the twinkles */
        if (!st.scene) { if (layer) { layer.remove(); layer = null; } setRunner('motion', '', null); }
        else {
            var withStars = st.scene === 'cosmic' || !!(st.theme && st.theme.stars);
            var key = st.id + '|' + dark + '|' + JSON.stringify(st.theme || '') + '|' + (st.scene === 'cosmic' && fxDefs.cosmic ? 'c' : '');
            if (!layer) { layer = doc.createElement('div'); layer.id = 'ixd-bg'; layer.setAttribute('aria-hidden', 'true'); }
            if (layer.parentNode !== doc.body) doc.body.insertBefore(layer, doc.body.firstChild);
            if (drawn !== key) {
                setRunner('motion', '', null);
                layer.innerHTML = (st.scene === 'image' ? '<div class="ixd-img"></div><div class="ixd-veil"></div>' : '') + (withStars ? '<canvas class="ixd-scene"></canvas>' : '');
                drawn = key;
                if (withStars) drawScene(st);
            }
            var tw = withStars && st.motion && (st.scene !== 'cosmic' || fxDefs.cosmic);
            setRunner('motion', tw ? 'tw|' + key : '', layer, twinkles, { cosmic: st.scene === 'cosmic', shoot: st.scene === 'cosmic' && isDark() });
        }
        /* the animation over the page (snow, lights): with prefers-reduced-motion only one that can stand still */
        var def = st.effect && fxDefs[st.effect], show = def && (!reduced.matches || def.still);
        if (!show) { setRunner('fx', '', null); if (fxLayer) { fxLayer.remove(); fxLayer = null; } return; }
        if (!fxLayer) { fxLayer = doc.createElement('div'); fxLayer.id = 'ixd-fx'; fxLayer.setAttribute('aria-hidden', 'true'); }
        if (def.band) fxLayer.setAttribute('data-band', ''); else fxLayer.removeAttribute('data-band');
        if (fxLayer.parentNode !== doc.body) doc.body.appendChild(fxLayer);
        setRunner('fx', 'fx|' + st.effect + '|' + dark, fxLayer, def, {});
    }

    /* ───────── apply ───────── */
    var current = null;
    function state() {
        var cat = catalog(), pref = readPref(), id = resolve(pref, cat), theme = null;
        cat.themes.forEach(function (t) { if (t.id === id) theme = t; });
        var scene = id === 'cosmic' ? 'cosmic' : theme ? 'image' : '';
        return { cat: cat, pref: pref, id: id, theme: theme, scene: scene, effect: resolveEffect(pref, cat), motion: pref.motion && !reduced.matches };
    }
    function apply() {
        var st = state(); current = st;
        html.setAttribute('data-ix-d', st.id);
        if (st.scene) html.setAttribute('data-ix-scene', st.scene); else html.removeAttribute('data-ix-scene');
        if (st.effect) html.setAttribute('data-ix-fx', st.effect); else html.removeAttribute('data-ix-fx');
        if (st.motion) html.removeAttribute('data-ix-still'); else html.setAttribute('data-ix-still', '');
        ensureStyles(st.scene, st.effect);
        varStyle.textContent = cssVars(st);
        if (st.scene === 'cosmic') needFx('cosmic', st.cat);    // asked for in <head>, so it is there by the time the page is
        if (st.effect) needFx(st.effect, st.cat);
        layers(st);
        listeners.forEach(function (fn) { try { fn(st); } catch (e) { /* a listener failed */ } });
        return st;
    }

    /* ───────── the visitor's choice (Settings) and the list of designs ───────── */
    function pushToAccount(p) {
        if (!window.IELTSXUser || !window.fetch) return;
        fetch('/api/account/design', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) }).catch(function () { /* kept here */ });
    }
    function set(patch) {
        var p = readPref();
        Object.keys(patch || {}).forEach(function (k) { p[k] = patch[k]; });
        p.at = Date.now();
        writeJSON(PREF_KEY, { design: p.design, effect: p.effect, accent: p.accent, motion: p.motion !== false, at: p.at });
        pushToAccount(readPref());
        return apply();
    }
    var refreshing = null;
    function refresh(force) {
        var cat = catalog();
        if (!window.fetch || location.protocol === 'file:' || (!force && cat.fresh && cat.t && Date.now() - cat.t < REFRESH_MS)) return Promise.resolve(cat);
        if (refreshing) return refreshing;
        refreshing = fetch('/api/design', { credentials: 'same-origin', cache: 'no-cache' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d || !d.builtins) return cat;
                var before = JSON.stringify([cat.default, cat.defaultEffect, cat.builtins, cat.themes, cat.colors, cat.accents, cat.updatedAt, cat.uid]);
                d.t = Date.now(); writeJSON(SITE_KEY, d);
                var now = catalog();
                if (JSON.stringify([now.default, now.defaultEffect, now.builtins, now.themes, now.colors, now.accents, now.updatedAt, now.uid]) !== before) { drawn = ''; apply(); }
                return now;
            })
            .catch(function () { return cat; })
            .then(function (c) { refreshing = null; return c; });
        return refreshing;
    }
    /* a choice made on another browser comes with the account (once per visit); one made here before signing in goes to it */
    function syncAccount() {
        try { if (sessionStorage.getItem('ix-design-sync')) return; sessionStorage.setItem('ix-design-sync', '1'); } catch (e) { return; }
        fetch('/api/account/design', { credentials: 'same-origin', cache: 'no-store' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                var srv = d && d.pref, here = readPref();
                if (srv && Number(srv.at) > here.at) { writeJSON(PREF_KEY, { design: srv.design, effect: srv.effect || '', accent: srv.accent, motion: srv.motion !== false, at: Number(srv.at) }); apply(); }
                else if (here.at && (!srv || here.at > Number(srv.at))) pushToAccount(here);
            })
            .catch(function () { /* offline */ });
    }

    /* ───────── the "Settings" item of the sidebar (under Study Tools, on every page that loads this file) ───────── */
    var GEAR = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    function addSettingsLink() {
        var href = (window.IELTSXLinks && window.IELTSXLinks.links && window.IELTSXLinks.links.settings) || '/settings';
        var here = /^\/settings(\.html)?\/?$/i.test(location.pathname);
        var labels = doc.querySelectorAll('[data-sidebar="group-label"], .group-label');
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].textContent.replace(/\s+/g, ' ').trim().toLowerCase() !== 'study tools') continue;
            var ul = labels[i].parentNode && labels[i].parentNode.querySelector('ul');
            if (!ul || ul.querySelector('a[data-link="settings"]')) continue;
            var items = ul.children, last = items[items.length - 1];
            if (!last || !last.querySelector('a')) continue;
            var copy = last.cloneNode(true), a = copy.querySelector('a');
            a.setAttribute('data-link', 'settings'); a.setAttribute('href', href); a.removeAttribute('id'); a.removeAttribute('target');
            a.setAttribute('data-active', here ? 'true' : 'false');
            if (here) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
            var svgs = a.querySelectorAll('svg');
            for (var k = svgs.length - 1; k > 0; k--) svgs[k].remove();   // no crown: Settings is for everybody
            var tpl = doc.createElement('div'); tpl.innerHTML = GEAR; var gear = tpl.firstChild;
            if (svgs[0]) { gear.setAttribute('class', (svgs[0].getAttribute('class') || '').replace(/lucide-[a-z0-9-]+/g, 'lucide-settings')); svgs[0].parentNode.replaceChild(gear, svgs[0]); }
            else a.insertBefore(gear, a.firstChild);
            var label = a.querySelector('span.flex-1') || a.querySelector('span');
            if (label) label.textContent = 'Settings';
            else { a.appendChild(doc.createTextNode('Settings')); }
            ul.appendChild(copy);
        }
    }

    /* ───────── start ───────── */
    window.IXDesign = {
        get: readPref, set: set, catalog: catalog, designs: designs, effects: effects, refresh: refresh, current: function () { return current || state(); },
        apply: function () { drawn = ''; return apply(); }, onChange: function (fn) { listeners.push(fn); },
        reducedMotion: function () { return !!reduced.matches; }, safeUrl: safeUrl, priceUrl: priceUrl, DEFAULT_ACCENTS: DEFAULT_ACCENTS,
        defineFx: defineFx
    };
    viewport();
    apply();
    function ready() {
        try { addSettingsLink(); } catch (e) { /* the menu still works */ }
        if (current) layers(current);
        refresh(!catalog().fresh ? true : false);
        if (window.IELTSXUser) syncAccount();
    }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', ready); else ready();
    // signed in, signed out or another account: what may be used changes with it
    doc.addEventListener('ieltsx:user', function (e) {
        var u = e.detail && e.detail.user;
        if (String((u && u.id) || '') !== catalog().uid) refresh(true);
        if (u) syncAccount();
    });
    // light / dark switched (assets/js/app.js) -> the other sky
    if (window.MutationObserver) {
        var wasDark = isDark();
        new MutationObserver(function () { if (isDark() !== wasDark) { wasDark = isDark(); if (current) { drawn = ''; runners.forEach(function (r) { r.key += '~'; }); layers(current); } } })
            .observe(html, { attributes: true, attributeFilter: ['class'] });
    }
    var rt = null;
    window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
            var w0 = vw, h0 = vh; viewport();
            // a phone's address bar showing / hiding changes the height a little: the stretched picture is fine then
            var big = Math.abs(vw - w0) > 30 || Math.abs(vh - h0) > h0 * 0.25;
            if (big && current && layer && (Math.abs(vw - lastW) > 30 || Math.abs(vh - lastH) > lastH * 0.25)) drawScene(current);
            if (big || runners.some(function (r) { return r.band; })) runners.forEach(sizeRunner);
        }, 200);
    });
    // the loop sleeps while the tab is hidden (and in the back/forward cache)
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) stopLoop(); else startLoop(); });
    window.addEventListener('pagehide', stopLoop);
    window.addEventListener('pageshow', function () { if (!doc.hidden) startLoop(); });
    if (reduced.addEventListener) reduced.addEventListener('change', function () { drawn = ''; stopLoop(); runners.forEach(function (r) { r.key += '~'; }); apply(); });
    window.addEventListener('storage', function (e) { if (e.key === PREF_KEY || e.key === SITE_KEY) { drawn = ''; apply(); } });
})();
