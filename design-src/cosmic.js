/*
 * IELTSX — the picture of the Cosmic design (sent by the server as /api/design/fx/cosmic.js, only to a visitor who may
 * use Cosmic: Admin → Design can make it free, locked for a plan or hidden). assets/js/site-design.js draws it ONCE on a
 * canvas behind the page; the twinkles and the shooting star are drawn by its animation loop.
 *  - light mode: a pale sky with long orbits and a ringed planet
 *  - dark mode:  deep space, the Milky Way and the night side of the Earth with the lights of its cities
 */
(function () {
    'use strict';
    var D = window.IXDesign;
    if (!D || !D.defineFx) return;

    /* Thousands of small dots: each colour and (rounded) opacity is ONE path, filled once when flushed. One fill per dot
       took half a second on a weak laptop GPU, at every page load; this is a few dozen fills. */
    function batch() {
        var buckets = {};
        return {
            dot: function (ctx, x, y, r, color, al) {
                var k = color + '|' + Math.max(1, Math.min(10, Math.round(al * 10)));
                var b = buckets[k] || (buckets[k] = []); b.push(x, y, r);
            },
            flush: function (ctx) {
                for (var k in buckets) {
                    var p = buckets[k], i = k.indexOf('|');
                    ctx.globalAlpha = Number(k.slice(i + 1)) / 10; ctx.fillStyle = k.slice(0, i); ctx.beginPath();
                    for (var j = 0; j < p.length; j += 3) { ctx.moveTo(p[j] + p[j + 2], p[j + 1]); ctx.arc(p[j], p[j + 1], p[j + 2], 0, 6.2832); }
                    ctx.fill();
                }
                buckets = {};
            }
        };
    }
    function stars(a, B, ctx, w, h, r, dark, density) {
        var n = Math.min(dark ? 380 : 120, Math.round(w * h / density)), glows = [];
        for (var i = 0; i < n; i++) {
            var x = r() * w, y = r() * h, big = r() < 0.06, rad = big ? 1 + r() * 0.9 : 0.35 + r() * 0.75, k = r();
            var col = !dark ? '#ffffff' : k < 0.14 ? '#ffe9c4' : k < 0.3 ? '#c7d7ff' : '#ffffff';
            B.dot(ctx, x, y, rad, col, dark ? 0.35 + r() * 0.65 : 0.45 + r() * 0.5);
            if (big && dark) glows.push([x, y, rad * 6]);
        }
        glows.forEach(function (g) { a.glow(ctx, g[0], g[1], g[2], 'rgba(190,210,255,1)', 0.18); });
        B.flush(ctx);
    }
    function space(a, ctx, w, h, r) {
        var B = batch(), dot = B.dot, glow = a.glow, gauss = a.gauss;
        stars(a, B, ctx, w, h, r, true, 3800);
        // the Milky Way: a band of faint stars and light from the top left towards the middle
        var x0 = -0.05 * w, y0 = 0.02 * h, x1 = 0.8 * w, y1 = 0.42 * h, nx = -(y1 - y0), ny = x1 - x0, nl = Math.sqrt(nx * nx + ny * ny); nx /= nl; ny /= nl;
        for (var g = 0; g < 7; g++) { var t = (g + 0.5) / 7; glow(ctx, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, Math.max(w, h) * 0.12, g % 2 ? 'rgba(139,92,246,1)' : 'rgba(96,165,250,1)', 0.06); }
        var band = Math.min(380, Math.round(w * h / 5200));
        for (var i = 0; i < band; i++) {
            var s = r(), off = gauss(r) * Math.min(w, h) * 0.09;
            dot(ctx, x0 + (x1 - x0) * s + nx * off, y0 + (y1 - y0) * s + ny * off, 0.3 + r() * 0.5, '#ffffff', 0.2 + r() * 0.5);
        }
        B.flush(ctx);   // before the Earth, which hides the stars behind it
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
            var an = Math.PI + r() * Math.PI * 0.5, d = R * (0.015 + r() * r() * 0.32), px = cx + (R - d) * Math.cos(an), py = cy + (R - d) * Math.sin(an);
            if (px < 0 || py < 0 || px > w || py > h) continue;
            c++;
            var ux = Math.cos(an), uy = Math.sin(an), flat = 0.25 + 0.75 * Math.min(1, d / (R * 0.3));   // radial squeeze near the limb
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
        B.flush(ctx);   // the lights of the cities, inside the globe
        ctx.restore();
    }
    function sky(a, ctx, w, h, r) {
        var glow = a.glow;
        stars(a, batch(), ctx, w, h, r, false, 11000);
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

    D.defineFx('cosmic', {
        scene: function (ctx, w, h, dark, r, a) { (dark ? space : sky)(a, ctx, w, h, r); }
    });
})();
