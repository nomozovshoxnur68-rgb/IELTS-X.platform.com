/*
 * IELTSX — "Snowfall", a New Year animation over the page (sent by the server as /api/design/fx/snow.js, only to a visitor
 * who may use it: Admin → Design makes it free, locked for a plan or hidden).
 * Drawn on ONE canvas by the loop of assets/js/site-design.js (at most 30 frames a second, asleep in a hidden tab, never
 * with prefers-reduced-motion). The flakes are in four depths (the far ones small, dim and slow) and sway in a light wind;
 * a few near ones are slowly turning crystals. Speed: every depth is ONE path filled twice (a soft halo, then the flake)
 * and all crystals are ONE stroked path, so a frame is about ten draw calls whatever the number of flakes (a picture per
 * flake was 25 ms a frame on a weak laptop GPU; this is about 1 ms). The number follows the size of the window (fewer on
 * a phone or a slow device) and the loop halves it by itself when a frame takes too long.
 */
(function () {
    'use strict';
    var D = window.IXDesign;
    if (!D || !D.defineFx) return;

    D.defineFx('snow', {
        fps: 30,
        create: function (a) {
            var dark = a.dark(), w = 0, h = 0, flakes = [], low = a.low;
            var RAD = [1, 1.45, 2, 2.7], ALPHA = [0.5, 0.65, 0.8, 0.92];          // each depth: radius (CSS px), opacity
            var CORE = dark ? '255,255,255' : '255,255,255', HALO = dark ? '200,222,255' : '110,140,205';
            var HALO_A = dark ? 0.2 : 0.42;
            function count() { var n = Math.round(w * h / (low ? 30000 : 17000)); return Math.max(14, Math.min(low ? 50 : 110, n)); }
            function flake(top) {
                var k = Math.random(), d = k < 0.42 ? 0 : k < 0.74 ? 1 : k < 0.92 ? 2 : 3;
                return { d: d, x: Math.random() * w, y: top ? -12 - Math.random() * 60 : Math.random() * h,
                    vy: 16 + d * 13 + Math.random() * 10, amp: 4 + d * 5 + Math.random() * 8, f: 0.12 + Math.random() * 0.3, ph: Math.random() * 6.2832,
                    cr: d === 3 && Math.random() < (low ? 0.15 : 0.35), rot: Math.random() * 1.0472, vr: (Math.random() - 0.5) * 0.9, sx: 0 };
            }
            function fill() { var n = count(); while (flakes.length < n) flakes.push(flake(false)); if (flakes.length > n) flakes.length = n; }
            var R6 = [], i6; for (i6 = 0; i6 < 6; i6++) R6.push([Math.cos(i6 * Math.PI / 3), Math.sin(i6 * Math.PI / 3)]);
            function crystalPath(ctx, x, y, R, rot) {   // six arms with two small branches each
                var c = Math.cos(rot), s = Math.sin(rot);
                for (var i = 0; i < 6; i++) {
                    var ux = R6[i][0] * c - R6[i][1] * s, uy = R6[i][0] * s + R6[i][1] * c, vx = -uy, vy = ux;
                    var ex = x + ux * R, ey = y + uy * R, mx = x + ux * R * 0.55, my = y + uy * R * 0.55;
                    ctx.moveTo(x, y); ctx.lineTo(ex, ey);
                    ctx.moveTo(mx, my); ctx.lineTo(mx + (ux * 0.2 + vx * 0.22) * R, my + (uy * 0.2 + vy * 0.22) * R);
                    ctx.moveTo(mx, my); ctx.lineTo(mx + (ux * 0.2 - vx * 0.22) * R, my + (uy * 0.2 - vy * 0.22) * R);
                }
            }
            return {
                resize: function (W, H) {
                    w = W; h = H;
                    flakes.forEach(function (f) { if (f.x > w) f.x = Math.random() * w; if (f.y > h) f.y = Math.random() * h; });
                    fill();
                },
                frame: function (ctx, now, dt) {
                    var s = dt / 1000, t = now / 1000, wind = Math.sin(t * 0.13) * 14 + Math.sin(t * 0.051) * 9;   // a light wind that turns slowly
                    var i, f, d, any = false;
                    for (i = 0; i < flakes.length; i++) {   // move
                        f = flakes[i];
                        f.y += f.vy * s; f.x += wind * s * (0.4 + f.d * 0.25);
                        if (f.y > h + 12) { flakes[i] = f = flake(true); f.y = -12; }
                        if (f.x < -24) f.x += w + 48; else if (f.x > w + 24) f.x -= w + 48;
                        f.sx = f.x + Math.sin(t * f.f * 6.2832 + f.ph) * f.amp;
                        if (f.cr) { f.rot += f.vr * s; any = true; }
                    }
                    ctx.clearRect(0, 0, w, h);
                    for (d = 0; d < 4; d++) {               // draw: per depth one halo path and one flake path
                        var r = RAD[d], hr = r * 2.3;
                        ctx.beginPath();
                        for (i = 0; i < flakes.length; i++) { f = flakes[i]; if (f.d !== d || f.cr) continue; ctx.moveTo(f.sx + hr, f.y); ctx.arc(f.sx, f.y, hr, 0, 6.2832); }
                        ctx.globalAlpha = ALPHA[d] * HALO_A; ctx.fillStyle = 'rgb(' + HALO + ')'; ctx.fill();
                        ctx.beginPath();
                        for (i = 0; i < flakes.length; i++) { f = flakes[i]; if (f.d !== d || f.cr) continue; ctx.moveTo(f.sx + r, f.y); ctx.arc(f.sx, f.y, r, 0, 6.2832); }
                        ctx.globalAlpha = ALPHA[d]; ctx.fillStyle = 'rgb(' + CORE + ')'; ctx.fill();
                    }
                    if (any) {                              // the crystals: one path, stroked (with a darker edge in light mode)
                        ctx.beginPath();
                        for (i = 0; i < flakes.length; i++) { f = flakes[i]; if (f.cr) crystalPath(ctx, f.sx, f.y, 5.5, f.rot); }
                        ctx.lineCap = 'round';
                        if (!dark) { ctx.globalAlpha = 0.55; ctx.strokeStyle = 'rgb(' + HALO + ')'; ctx.lineWidth = 2.6; ctx.stroke(); }
                        ctx.globalAlpha = 0.95; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.1; ctx.stroke();
                    }
                    ctx.globalAlpha = 1;
                },
                lower: function () { low = true; flakes.length = Math.ceil(flakes.length / 2); }
            };
        }
    });
})();
