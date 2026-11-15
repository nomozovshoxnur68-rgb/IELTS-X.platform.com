/*
 * IELTSX — the design of the website (assets/js/site-design.js), chosen by each visitor on the Settings page (/settings).
 *
 *  - "classic": the site as it always looked (plus the colours the admin set in Admin → Design → Site colours)
 *  - "cosmic":  an animated space background (a pale sky with a ringed planet in light mode, deep space with the
 *               night side of the Earth in dark mode), glass cards and sidebar
 *  - designs the admin added (a background picture or colour for light and dark, an accent colour, optional stars)
 *  - an accent colour of the visitor's own (the list is set in the admin panel)
 *
 * Loaded with ONE line at the end of <head> of the ordinary pages only (home, practice and full-test lists,
 * Predictions, Mock tests, Articles, PDF, Performance, Price, Vocabulary, Account, Settings). Test and exam pages never
 * load it, so nothing moves behind a test; the path check below is only a safety net.
 * It runs before the first paint (the colours are there at once, no flash); the background is drawn once on a
 * <canvas> (no animation loop): only a few twinkles and a shooting star move, with CSS, and only when motion is allowed
 * (prefers-reduced-motion and the "Animate the background" switch of Settings turn them off).
 * Storage: the visitor's choice in localStorage "ix-design" (and with the account, /api/account/design, when signed
 * in); the admin's designs in localStorage "ix-design-site", refreshed from /api/design every few minutes.
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
    var listeners = [];

    /* ───────── storage ───────── */
    function readJSON(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } }
    function writeJSON(key, v) { try { if (v == null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* blocked */ } }
    var HEX = /^#[0-9a-f]{6}$/i, ID = /^(classic|cosmic|t-[a-z0-9]{4,16})$/;
    function readPref() {
        var p = readJSON(PREF_KEY) || {};
        return { design: ID.test(p.design || '') ? p.design : '', accent: HEX.test(p.accent || '') ? p.accent.toLowerCase() : '', motion: p.motion !== false, at: Number(p.at) || 0 };
    }
    function catalog() {
        var c = readJSON(SITE_KEY) || {};
        return {
            default: ID.test(c.default || '') ? c.default : 'classic', cosmicVisible: c.cosmicVisible !== false,
            colors: c.colors && typeof c.colors === 'object' ? c.colors : {},
            themes: Array.isArray(c.themes) ? c.themes.filter(function (t) { return t && ID.test(t.id || '') && t.id.indexOf('t-') === 0; }) : [],
            accents: Array.isArray(c.accents) ? c.accents.filter(function (a) { return a && HEX.test(a.color || ''); }) : DEFAULT_ACCENTS,
            updatedAt: c.updatedAt || '', t: Number(c.t) || 0
        };
    }
    /* a picture address the admin saved (the same rule as the logo, assets/js/branding.js) */
    function safeUrl(u) {
        u = String(u || '');
        return /^\/(api\/media\/[A-Za-z0-9_-]{8,40}|uploads\/[^\s"'<>()\\]+|assets\/[^\s"'<>()\\]+)$/.test(u) || /^https:\/\/[^\s"'<>()\\]+$/i.test(u) ? u : '';
    }

    /* the designs offered on the Settings page */
    function designs(cat) {
        cat = cat || catalog();
        var out = [{ id: 'classic', name: 'Classic', builtin: true, about: 'The clean IELTS-X look.' }];
        if (cat.cosmicVisible) out.push({ id: 'cosmic', name: 'Cosmic', builtin: true, about: 'Animated space: a ringed planet by day, the Earth at night.' });
        cat.themes.forEach(function (t) { if (t.visible !== false) out.push({ id: t.id, name: t.name || 'Custom design', custom: true, theme: t }); });
        return out;
    }
    function resolve(pref, cat) {
        var list = designs(cat), has = function (id) { return list.some(function (d) { return d.id === id; }); };
        if (pref.design && has(pref.design)) return pref.design;
        return has(cat.default) ? cat.default : 'classic';
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
        /* the page itself is the background picture, the surfaces are glass */
        S + '{background:var(--ixd-base)!important;--bg-body:transparent;--bg-card:var(--ixd-glass);--header-bg:var(--ixd-head);--sidebar-bg:var(--ixd-side)}',
        S + ' body,' + S + ' #root,' + S + ' main,' + S + ' .bg-background{background:transparent!important}',
        '#ixd-bg{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--ixd-sky);contain:layout paint}',
        '#ixd-bg>canvas,#ixd-bg>.ixd-img,#ixd-bg>.ixd-veil{position:absolute;inset:0;width:100%;height:100%;display:block}',
        '#ixd-bg>.ixd-img{background:var(--ixd-img,none) center/cover no-repeat}#ixd-bg>.ixd-veil{background:var(--ixd-veil,transparent)}',
        S + ' main>header,' + S + ' header.sticky{background:var(--ixd-head)!important;border-color:var(--ixd-line)!important}',
        S + ' [data-sidebar="sidebar"],' + S + ' #sidebar-panel{background:var(--ixd-side)!important;-webkit-backdrop-filter:var(--ixd-blur);backdrop-filter:var(--ixd-blur)}',
        S + ' [data-sidebar="sidebar"] .bg-sidebar,' + S + ' [data-sidebar="sidebar"]>div,' + S + ' #sidebar-panel>div,' + S + ' #sidebar-panel>div>div{background:transparent!important}',
        S + ' .fixed.inset-y-0{border-color:var(--ixd-line)!important}',
        S + ' [data-sidebar="menu-button"][data-active="true"],' + S + ' #sidebar-panel .menu-item>a[aria-current="page"]{background:hsl(var(--primary)/.13)!important;color:hsl(var(--primary))!important}',
        S + ' :is(' + CARDS + '){background:var(--ixd-glass)!important;border-color:var(--ixd-line)!important;box-shadow:var(--ixd-shadow)!important}',
        S + ' .pdp{--pdp-card:var(--ixd-glass);--pdp-line:var(--ixd-line)}' + S + ' .vx-card,' + S + ' .vs-card{--vx-bg:var(--ixd-glass);--vx-bd:var(--ixd-line)}',
        '@media (min-width:768px){' + S + ' :is(' + CARDS + ',.pdp-card,.pdp-item){-webkit-backdrop-filter:var(--ixd-blur);backdrop-filter:var(--ixd-blur)}}',
        S + ' .test-pack-card{border-radius:16px}',
        S + ' main section>h2.text-2xl{position:relative;padding-left:14px}',
        S + ' main section>h2.text-2xl::before{content:"";position:absolute;left:0;top:.2em;bottom:.2em;width:4px;border-radius:4px;background:linear-gradient(hsl(var(--primary)),hsl(var(--primary)/.45))}',
        S + ':not(.dark-mode) .test-pack-card a.border{border-color:hsl(var(--primary)/.45);color:hsl(var(--primary));background:rgba(255,255,255,.55)}',
        S + ':not(.dark-mode) .test-pack-card .bg-secondary{background:rgba(244,246,255,.85);border-color:hsl(var(--border))}',
        S + '.dark-mode .test-pack-card a.border{border-color:var(--ixd-line);background:rgba(255,255,255,.04)}',
        S + '.dark-mode .test-pack-card .bg-secondary{background:rgba(255,255,255,.06);border-color:var(--ixd-line)}',
        S + '.dark-mode main h1,' + S + '.dark-mode main h2{text-shadow:0 1px 12px rgba(0,0,0,.45)}',

        /* the glass of each design and mode */
        S + ':not(.dark-mode){--ixd-glass:rgba(255,255,255,.76);--ixd-line:rgba(255,255,255,.9);--ixd-side:rgba(255,255,255,.82);--ixd-head:rgba(255,255,255,.35);--ixd-shadow:0 10px 30px -14px rgba(64,76,170,.35);--ixd-blur:blur(14px) saturate(140%)}',
        S + '.dark-mode{--ixd-glass:rgba(11,18,42,.58);--ixd-line:rgba(140,165,255,.17);--ixd-side:rgba(5,9,24,.72);--ixd-head:rgba(4,8,22,.35);--ixd-shadow:0 14px 34px -16px rgba(0,0,0,.7);--ixd-blur:blur(14px) saturate(130%)}',
        'html[data-ix-scene="image"]:not(.dark-mode){--ixd-glass:rgba(255,255,255,.8);--ixd-side:rgba(255,255,255,.84);--ixd-head:rgba(255,255,255,.55)}',
        'html[data-ix-scene="image"].dark-mode{--ixd-glass:rgba(16,19,28,.72);--ixd-line:rgba(255,255,255,.12);--ixd-side:rgba(12,14,22,.8);--ixd-head:rgba(12,14,22,.5)}',
        /* phones: no blur (slow on small devices), a little more solid instead */
        '@media (max-width:767px){' + S + ':not(.dark-mode){--ixd-glass:rgba(255,255,255,.9);--ixd-blur:none}' + S + '.dark-mode{--ixd-glass:rgba(11,18,42,.86);--ixd-blur:none}html[data-ix-scene="image"].dark-mode{--ixd-glass:rgba(16,19,28,.88)}}',
        '@media (prefers-reduced-transparency:reduce){' + S + ':not(.dark-mode){--ixd-glass:rgba(255,255,255,.95)}' + S + '.dark-mode{--ixd-glass:rgba(11,18,42,.94)}}',

        /* Cosmic: the tokens of the whole page follow the sky */
        'html[data-ix-scene="cosmic"]:not(.dark-mode){--ixd-base:#dde3ff;--background:232 70% 97%;--secondary:230 60% 95%;--muted:230 60% 95%;--accent:230 60% 94%;--border:230 40% 87%;--input:230 40% 87%;--primary:228 80% 55%;--sidebar:0 0% 100%;--sidebar-accent:230 60% 95%;--sidebar-border:230 40% 90%;' +
            '--ixd-sky:radial-gradient(55% 48% at 80% 32%,rgba(255,255,255,.75),transparent 70%),radial-gradient(60% 55% at 12% 88%,rgba(196,181,253,.5),transparent 70%),radial-gradient(50% 40% at 35% 10%,rgba(165,180,252,.45),transparent 70%),linear-gradient(162deg,#eef0ff 0%,#dbe1ff 38%,#ccd4fb 64%,#e4e1fb 100%)}',
        'html[data-ix-scene="cosmic"].dark-mode{--ixd-base:#030716;--background:228 55% 7%;--card:226 45% 11%;--popover:226 45% 11%;--secondary:226 38% 16%;--muted:226 38% 16%;--accent:226 38% 18%;--border:225 32% 22%;--input:225 32% 22%;--muted-foreground:220 18% 72%;' +
            '--sidebar:228 55% 6%;--sidebar-accent:226 40% 15%;--sidebar-border:225 32% 18%;' +
            '--ixd-sky:radial-gradient(42% 36% at 30% 16%,rgba(124,58,237,.30),transparent 70%),radial-gradient(38% 32% at 55% 28%,rgba(59,130,246,.16),transparent 70%),radial-gradient(55% 45% at 88% 88%,rgba(37,99,235,.22),transparent 70%),linear-gradient(180deg,#020512 0%,#050b22 55%,#0a1736 100%)}',

        /* twinkles and the shooting star */
        '#ixd-bg .ixd-sp{position:absolute;left:var(--x);top:var(--y);width:var(--s);height:var(--s);margin:calc(var(--s)/-2) 0 0 calc(var(--s)/-2);opacity:.85;animation:ixd-tw var(--d) ease-in-out var(--dl) infinite}',
        '#ixd-bg .ixd-sp::before{content:"";position:absolute;inset:-70%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.7),rgba(199,210,254,.22) 50%,transparent)}',
        '#ixd-bg .ixd-sp::after{content:"";position:absolute;inset:0;background:radial-gradient(closest-side,#fff 25%,rgba(255,255,255,.55) 60%,transparent);clip-path:polygon(50% 0,56% 44%,100% 50%,56% 56%,50% 100%,44% 56%,0 50%,44% 44%)}',
        'html.dark-mode #ixd-bg .ixd-sp::before{background:radial-gradient(closest-side,rgba(191,219,254,.55),rgba(96,165,250,.12) 50%,transparent)}',
        '@keyframes ixd-tw{0%,100%{opacity:.3;transform:scale(.62)}50%{opacity:1;transform:scale(1)}}',
        '#ixd-bg .ixd-shoot{position:absolute;left:66%;top:8%;width:170px;height:2px;border-radius:2px;opacity:0;background:linear-gradient(90deg,#fff,rgba(165,195,255,.6) 30%,transparent);box-shadow:0 0 8px rgba(255,255,255,.55);transform:rotate(-17deg);animation:ixd-shoot 11s ease-out 2.5s infinite}',
        '@keyframes ixd-shoot{0%{opacity:0;transform:translate(0,0) rotate(-17deg)}1.2%{opacity:1}8%{opacity:0;transform:translate(-430px,131px) rotate(-17deg)}100%{opacity:0;transform:translate(-430px,131px) rotate(-17deg)}}',
        'html[data-ix-still] #ixd-bg *{animation:none!important}html[data-ix-still] #ixd-bg .ixd-shoot{display:none}'
    ].join('\n');

    var baseStyle = null, varStyle = null;
    function ensureStyles(scene) {
        if (scene && !baseStyle) {
            baseStyle = doc.createElement('style'); baseStyle.id = 'ix-design-css'; baseStyle.textContent = CSS;
            (doc.head || html).appendChild(baseStyle);
            if (varStyle) (doc.head || html).appendChild(varStyle);    // the colours stay after the design styles
        }
        if (!varStyle) { varStyle = doc.createElement('style'); varStyle.id = 'ix-design-vars'; (doc.head || html).appendChild(varStyle); }
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

    /* ───────── the background layer ───────── */
    function rng(seed) {   // the same stars on every page and every redraw
        return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    }
    var gauss = function (r) { return (r() + r() + r() - 1.5) / 1.5; };
    function dot(ctx, x, y, r, color, a) { ctx.globalAlpha = a; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); }
    function glow(ctx, x, y, r, color, a) {
        var g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    function stars(ctx, w, h, r, dark, density) {
        var n = Math.min(dark ? 380 : 120, Math.round(w * h / density));
        for (var i = 0; i < n; i++) {
            var x = r() * w, y = r() * h, big = r() < 0.06, rad = big ? 1 + r() * 0.9 : 0.35 + r() * 0.75, k = r();
            var col = !dark ? '#ffffff' : k < 0.14 ? '#ffe9c4' : k < 0.3 ? '#c7d7ff' : '#ffffff';
            dot(ctx, x, y, rad, col, dark ? 0.35 + r() * 0.65 : 0.45 + r() * 0.5);
            if (big && dark) glow(ctx, x, y, rad * 6, 'rgba(190,210,255,1)', 0.18);
        }
    }
    function space(ctx, w, h, r) {
        stars(ctx, w, h, r, true, 3800);
        // the Milky Way: a band of faint stars and light from the top left towards the middle
        var x0 = -0.05 * w, y0 = 0.02 * h, x1 = 0.8 * w, y1 = 0.42 * h, nx = -(y1 - y0), ny = x1 - x0, nl = Math.sqrt(nx * nx + ny * ny); nx /= nl; ny /= nl;
        for (var g = 0; g < 7; g++) { var t = (g + 0.5) / 7; glow(ctx, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, Math.max(w, h) * 0.12, g % 2 ? 'rgba(139,92,246,1)' : 'rgba(96,165,250,1)', 0.06); }
        var band = Math.min(380, Math.round(w * h / 5200));
        for (var i = 0; i < band; i++) {
            var s = r(), off = gauss(r) * Math.min(w, h) * 0.09;
            dot(ctx, x0 + (x1 - x0) * s + nx * off, y0 + (y1 - y0) * s + ny * off, 0.3 + r() * 0.5, '#ffffff', 0.2 + r() * 0.5);
        }
        // the night side of the Earth, low on the right, with its blue air and the lights of the cities
        var R = Math.max(w * 0.7, h * 0.62), cx = w * 1.02 + (h > w ? R * 0.25 : 0), cy = h + R * 0.27;
        var air = ctx.createRadialGradient(cx, cy, R * 0.985, cx, cy, R * 1.1);
        air.addColorStop(0, 'rgba(96,165,250,0.75)'); air.addColorStop(0.18, 'rgba(59,130,246,0.38)'); air.addColorStop(0.5, 'rgba(37,99,235,0.12)'); air.addColorStop(1, 'rgba(30,64,175,0)');
        ctx.globalAlpha = 1; ctx.fillStyle = air; ctx.beginPath(); ctx.arc(cx, cy, R * 1.1, 0, 6.2832); ctx.fill();
        var body = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R);
        body.addColorStop(0, '#020817'); body.addColorStop(0.82, '#041029'); body.addColorStop(0.95, '#0b2556'); body.addColorStop(1, '#2563eb');
        ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 0.9; ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
        // cities: small clusters, flattened towards the edge of the globe (seen from the side), and lights between them
        var clusters = 18 + Math.round(26 * Math.min(1, w / 1400)), tries = 0;
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R - 3, 0, 6.2832); ctx.clip();
        for (var c = 0; c < clusters && tries < 600; tries++) {
            var a = Math.PI + r() * Math.PI * 0.5, d = R * (0.015 + r() * r() * 0.32), px = cx + (R - d) * Math.cos(a), py = cy + (R - d) * Math.sin(a);
            if (px < 0 || py < 0 || px > w || py > h) continue;
            c++;
            var ux = Math.cos(a), uy = Math.sin(a), flat = 0.25 + 0.75 * Math.min(1, d / (R * 0.3));   // radial squeeze near the limb
            var spread = 4 + r() * 16, count = 10 + Math.round(r() * 42), big = r() < 0.25;
            glow(ctx, px, py, spread * (big ? 2.6 : 1.8), 'rgba(255,168,72,1)', big ? 0.14 : 0.08);
            for (var k = 0; k < count; k++) {
                var tg = gauss(r) * spread * (big ? 1.4 : 1), rd = gauss(r) * spread * flat;
                dot(ctx, px - uy * tg + ux * rd, py + ux * tg + uy * rd, 0.35 + r() * (big ? 0.9 : 0.6), r() < 0.72 ? '#ffc46e' : '#fff0c2', 0.4 + r() * 0.6);
            }
        }
        for (var m = 0; m < Math.round(260 * Math.min(1, w / 1400)); m++) {   // single towns along the coasts
            var a2 = Math.PI + r() * Math.PI * 0.5, d2 = R * (0.01 + r() * 0.3);
            dot(ctx, cx + (R - d2) * Math.cos(a2), cy + (R - d2) * Math.sin(a2), 0.3 + r() * 0.45, '#ffcf87', 0.25 + r() * 0.5);
        }
        ctx.restore();
    }
    function sky(ctx, w, h, r) {
        stars(ctx, w, h, r, false, 11000);
        var phone = w < 768, pr = phone ? w * 0.3 : Math.min(w, h) * 0.3, pcx = phone ? w * 0.86 : w * 0.85, pcy = phone ? h * 0.17 : h * 0.4;
        ctx.lineCap = 'round';
        // long orbits
        ctx.globalAlpha = 0.55; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(w * 0.6, h * 0.1, w * 0.36, h * 0.2, -0.3, 0.12 * Math.PI, 1.02 * Math.PI); ctx.stroke();
        ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.ellipse(w * 0.55, h * 1.05, w * 0.75, h * 0.42, -0.18, 1.08 * Math.PI, 1.92 * Math.PI); ctx.stroke();
        glow(ctx, pcx, pcy, pr * 1.75, 'rgba(255,255,255,1)', 0.55);
        function ring(from, to) {
            [[1.95, 0.5, 0.05], [1.72, 0.32, 0.025], [2.12, 0.28, 0.018]].forEach(function (q) {
                ctx.globalAlpha = q[1]; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(1, pr * q[2]);
                ctx.beginPath(); ctx.ellipse(pcx, pcy, pr * q[0], pr * q[0] * 0.22, -0.36, from, to); ctx.stroke();
            });
        }
        ring(Math.PI, 2 * Math.PI);                       // the half of the ring behind the planet
        var g = ctx.createRadialGradient(pcx - pr * 0.38, pcy - pr * 0.42, pr * 0.08, pcx, pcy, pr);
        g.addColorStop(0, '#ffffff'); g.addColorStop(0.4, '#eef0ff'); g.addColorStop(0.82, '#cdd5fb'); g.addColorStop(1, '#b4bff3');
        ctx.globalAlpha = 0.96; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pcx, pcy, pr, 0, 6.2832); ctx.fill();
        ring(0, Math.PI);                                 // and the half in front of it
        ctx.globalAlpha = 1;
    }

    var layer = null, drawn = '', lastW = 0, lastH = 0;
    var SPARKS_LIGHT = [[41, 7, 16], [52, 15, 30], [57.5, 13.5, 11], [27, 31, 9], [75, 3, 13], [84, 83, 11], [69, 62, 8], [95, 56, 10], [36, 62, 8]];
    function sparks(st) {
        var out = [], dark = isDark();
        if (st.scene === 'cosmic' && !dark) out = SPARKS_LIGHT.map(function (s, i) { return [s[0], s[1], s[2], 3.2 + (i % 4) * 0.9, (i * 0.7) % 4]; });
        else {
            var r = rng(dark ? 11 : 5), n = st.scene === 'cosmic' ? 12 : 8;
            for (var i = 0; i < n; i++) out.push([4 + r() * 92, 3 + r() * (st.scene === 'cosmic' ? 60 : 90), 6 + r() * 9, 2.6 + r() * 3.5, r() * 5]);
        }
        return out.map(function (s) { return '<i class="ixd-sp" style="--x:' + s[0].toFixed(1) + '%;--y:' + s[1].toFixed(1) + '%;--s:' + Math.round(s[2]) + 'px;--d:' + s[3].toFixed(1) + 's;--dl:-' + s[4].toFixed(1) + 's"></i>'; }).join('');
    }
    function draw(st) {
        var cv = layer && layer.querySelector('canvas');
        if (!cv) return;
        var w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight), dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2);
        if (w * h * dpr * dpr > 5e6) dpr = Math.sqrt(5e6 / (w * h));
        cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); lastW = w; lastH = h;
        var ctx = cv.getContext('2d'); if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
        var r = rng(isDark() ? 7 : 3);
        if (st.scene === 'cosmic') (isDark() ? space : sky)(ctx, w, h, r);
        else if (st.theme && st.theme.stars) stars(ctx, w, h, r, true, isDark() ? 5200 : 9000);
        ctx.globalAlpha = 1;
    }
    function buildLayer(st) {
        if (!doc.body) return;
        var key = st.scene ? st.id + '|' + (isDark() ? 'd' : 'l') + '|' + (st.motion ? 'm' : 's') + '|' + JSON.stringify(st.theme || '') : '';
        if (!st.scene) { if (layer) { layer.remove(); layer = null; drawn = ''; } return; }
        if (layer && drawn === key && layer.parentNode) return;
        if (!layer) { layer = doc.createElement('div'); layer.id = 'ixd-bg'; layer.setAttribute('aria-hidden', 'true'); }
        if (layer.parentNode !== doc.body) doc.body.insertBefore(layer, doc.body.firstChild);
        var withStars = st.scene === 'cosmic' || (st.theme && st.theme.stars);
        layer.innerHTML = (st.scene === 'image' ? '<div class="ixd-img"></div><div class="ixd-veil"></div>' : '') + (withStars ? '<canvas></canvas>' : '') +
            (withStars && st.motion ? sparks(st) + (st.scene === 'cosmic' && isDark() ? '<i class="ixd-shoot"></i>' : '') : '');
        drawn = key;
        if (withStars) draw(st);
    }

    /* ───────── apply ───────── */
    var current = null;
    function state() {
        var cat = catalog(), pref = readPref(), id = resolve(pref, cat), theme = null;
        cat.themes.forEach(function (t) { if (t.id === id) theme = t; });
        var scene = id === 'cosmic' ? 'cosmic' : theme ? 'image' : '';
        return { cat: cat, pref: pref, id: id, theme: theme, scene: scene, motion: pref.motion && !reduced.matches };
    }
    function apply() {
        var st = state(); current = st;
        html.setAttribute('data-ix-d', st.id);
        if (st.scene) html.setAttribute('data-ix-scene', st.scene); else html.removeAttribute('data-ix-scene');
        if (st.motion) html.removeAttribute('data-ix-still'); else html.setAttribute('data-ix-still', '');
        ensureStyles(st.scene);
        varStyle.textContent = cssVars(st);
        buildLayer(st);
        listeners.forEach(function (fn) { try { fn(st); } catch (e) { /* a listener failed */ } });
        return st;
    }

    /* ───────── the visitor's choice (Settings) and the admin's designs ───────── */
    function pushToAccount(p) {
        if (!window.IELTSXUser || !window.fetch) return;
        fetch('/api/account/design', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) }).catch(function () { /* kept here */ });
    }
    function set(patch) {
        var p = readPref();
        Object.keys(patch || {}).forEach(function (k) { p[k] = patch[k]; });
        p.at = Date.now();
        writeJSON(PREF_KEY, { design: p.design, accent: p.accent, motion: p.motion !== false, at: p.at });
        pushToAccount(readPref());
        return apply();
    }
    function refresh(force) {
        var cat = catalog();
        if (!window.fetch || location.protocol === 'file:' || (!force && cat.t && Date.now() - cat.t < REFRESH_MS)) return Promise.resolve(cat);
        return fetch('/api/design', { credentials: 'same-origin', cache: 'no-cache' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d) return cat;
                var changed = (d.updatedAt || '') !== cat.updatedAt || !cat.t;
                d.t = Date.now(); writeJSON(SITE_KEY, d);
                if (changed) apply();
                return catalog();
            })
            .catch(function () { return cat; });
    }
    /* a choice made on another browser comes with the account (once per visit); one made here before signing in goes to it */
    function syncAccount() {
        try { if (sessionStorage.getItem('ix-design-sync')) return; sessionStorage.setItem('ix-design-sync', '1'); } catch (e) { return; }
        fetch('/api/account/design', { credentials: 'same-origin', cache: 'no-store' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                var srv = d && d.pref, here = readPref();
                if (srv && Number(srv.at) > here.at) { writeJSON(PREF_KEY, { design: srv.design, accent: srv.accent, motion: srv.motion !== false, at: Number(srv.at) }); apply(); }
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
    apply();
    function ready() {
        try { addSettingsLink(); } catch (e) { /* the menu still works */ }
        if (current) buildLayer(current);
        refresh(false);
        if (window.IELTSXUser) syncAccount();
    }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', ready); else ready();
    doc.addEventListener('ieltsx:user', function (e) { if (e.detail && e.detail.user) syncAccount(); });
    // light / dark switched (assets/js/app.js) -> the other sky
    if (window.MutationObserver) {
        var wasDark = isDark();
        new MutationObserver(function () { if (isDark() !== wasDark) { wasDark = isDark(); if (current && current.scene) buildLayer(current); } })
            .observe(html, { attributes: true, attributeFilter: ['class'] });
    }
    var rt = null;
    window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
            // a phone's address bar showing / hiding changes the height a little: the stretched picture is fine then
            if (current && layer && (Math.abs(window.innerWidth - lastW) > 30 || Math.abs(window.innerHeight - lastH) > lastH * 0.25)) draw(current);
        }, 200);
    });
    if (reduced.addEventListener) reduced.addEventListener('change', function () { drawn = ''; apply(); });
    window.addEventListener('storage', function (e) { if (e.key === PREF_KEY || e.key === SITE_KEY) { drawn = ''; apply(); } });

    window.IXDesign = {
        get: readPref, set: set, catalog: catalog, designs: designs, refresh: refresh, current: function () { return current || state(); },
        apply: function () { drawn = ''; return apply(); }, onChange: function (fn) { listeners.push(fn); },
        reducedMotion: function () { return !!reduced.matches; }, safeUrl: safeUrl, DEFAULT_ACCENTS: DEFAULT_ACCENTS
    };
})();
