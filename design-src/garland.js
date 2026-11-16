/*
 * IELTSX — "New Year lights", a garland of coloured bulbs along the top of the window (sent by the server as
 * /api/design/fx/garland.js, only to a visitor who may use it: Admin → Design makes it free, locked for a plan or hidden).
 * Drawn on ONE thin canvas (the height of the garland, not the whole window) by the loop of assets/js/site-design.js,
 * at most 15 frames a second (the lights change slowly), asleep in a hidden tab. The wire, the sockets and the unlit
 * bulbs are drawn ONCE; each frame copies that and lights the bulbs in three slow patterns (a wave running along, all
 * breathing together, every other one). Speed: the bulbs of one colour and brightness are ONE path, so a frame is a few
 * dozen fills, not three pictures per bulb. With prefers-reduced-motion the bulbs simply stay lit.
 */
(function () {
    'use strict';
    var D = window.IXDesign;
    if (!D || !D.defineFx) return;
    var BAND = 52, LEVELS = 5;
    var COLORS = [[255, 77, 77], [255, 210, 63], [61, 220, 132], [63, 169, 255], [255, 106, 213]];
    var rgb = function (c, k) { var t = k < 0 ? 0 : 255, p = Math.abs(k || 0); return 'rgb(' + Math.round(c[0] + (t - c[0]) * p) + ',' + Math.round(c[1] + (t - c[1]) * p) + ',' + Math.round(c[2] + (t - c[2]) * p) + ')'; };

    D.defineFx('garland', {
        fps: 15, band: BAND, still: true,
        create: function (a) {
            var dark = a.dark(), w = 0, bulbs = [], base = null, groups = [];
            var RX = 3.3, RY = 5.2;
            for (var c = 0; c < COLORS.length; c++) { groups.push([]); for (var l = 0; l <= LEVELS; l++) groups[c].push([]); }
            /* the wire, the pins, the sockets and the unlit bulbs: once for this width */
            function layout() {
                var phone = w < 640, span = phone ? 150 : 210, sag = phone ? 9 : 12, per = phone ? 4 : 5;
                var n = Math.max(2, Math.round((w + 40) / span)); span = (w + 40) / n;
                var q = Math.min(window.devicePixelRatio || 1, 2);
                base = a.canvas(w * q, BAND * q);
                var b = base.getContext('2d'); b.scale(q, q); b.lineCap = 'round';
                bulbs = []; var idx = 0, i, k;
                for (i = 0; i < n; i++) {
                    var x0 = -20 + i * span, x1 = x0 + span, y0 = 1, cx = (x0 + x1) / 2, cy = y0 + 2 * sag;   // a quadratic curve sags by (cy - y0) / 2
                    [[dark ? '#22382a' : '#1d3325', 2.2, 0], [dark ? '#4f7a5c' : '#3d6b4b', 1, -0.6]].forEach(function (s) {   // two twisted strands
                        b.strokeStyle = s[0]; b.lineWidth = s[1]; b.beginPath(); b.moveTo(x0, y0 + s[2]); b.quadraticCurveTo(cx, cy + s[2], x1, y0 + s[2]); b.stroke();
                    });
                    b.fillStyle = dark ? '#c9b37a' : '#a88b45'; b.beginPath(); b.arc(x0, y0 + 0.5, 2.1, 0, 6.2832); b.fill();   // the pin
                    for (k = 0; k < per; k++) {
                        var t = (k + 0.5) / per, mt = 1 - t;
                        var px = mt * mt * x0 + 2 * mt * t * cx + t * t * x1, py = mt * mt * y0 + 2 * mt * t * cy + t * t * y0;
                        var tx = 2 * mt * (cx - x0) + 2 * t * (x1 - cx), ty = 2 * mt * (cy - y0) + 2 * t * (y0 - cy);
                        var rot = Math.atan2(ty, tx) * 0.55, sn = Math.sin(rot), cs = Math.cos(rot), dy = 3.6 + RY;
                        b.save(); b.translate(px, py); b.rotate(rot); b.fillStyle = dark ? '#2b2f36' : '#3a3f47'; b.fillRect(-2, 0, 4, 4.2); b.restore();   // the socket
                        bulbs.push({ x: px - sn * dy, y: py + cs * dy, rot: rot, c: idx % COLORS.length, i: idx }); idx++;
                    }
                }
                for (i = 0; i < bulbs.length; i++) {   // the unlit glass
                    var u = bulbs[i]; b.fillStyle = rgb(COLORS[u.c], -0.55); b.beginPath(); b.ellipse(u.x, u.y, RX, RY, u.rot, 0, 6.2832); b.fill();
                }
            }
            function level(b, t) {   // how bright a bulb is now (0 … 1), in three slow patterns that blend into each other
                var P = 9, k = t / P, cur = Math.floor(k) % 3, fade = Math.min(1, Math.max(0, (k % 1 - 0.85) / 0.15));
                function at(p) {
                    if (p === 0) { var v = 0.5 + 0.5 * Math.sin(t * 2.4 - b.i * 0.55); return v * v; }            // a wave running along
                    if (p === 1) return 0.5 + 0.5 * Math.sin(t * 1.6);                                              // all together
                    return 0.5 + 0.5 * Math.sin(t * 2.2 + (b.i % 2 ? Math.PI : 0));                                  // every other one
                }
                return 0.25 + 0.75 * (at(cur) * (1 - fade) + at((cur + 1) % 3) * fade);
            }
            function draw(ctx, t, still) {
                var c, l, i, list, g;
                ctx.clearRect(0, 0, w, BAND);
                if (base) ctx.drawImage(base, 0, 0, w, BAND);
                for (c = 0; c < groups.length; c++) for (l = 0; l <= LEVELS; l++) groups[c][l].length = 0;
                for (i = 0; i < bulbs.length; i++) { var b = bulbs[i]; groups[b.c][Math.round((still ? 0.9 : level(b, t)) * LEVELS)].push(b); }
                for (c = 0; c < groups.length; c++) {
                    for (l = 1; l <= LEVELS; l++) {
                        list = groups[c][l]; if (!list.length) continue;
                        var lv = l / LEVELS;
                        ctx.fillStyle = rgb(COLORS[c], 0);
                        ctx.globalAlpha = lv * (dark ? 0.16 : 0.12); ctx.beginPath();   // the glow: two soft rings
                        for (i = 0; i < list.length; i++) { g = list[i]; ctx.moveTo(g.x + 11, g.y); ctx.arc(g.x, g.y, 11, 0, 6.2832); }
                        ctx.fill();
                        ctx.globalAlpha = lv * (dark ? 0.26 : 0.2); ctx.beginPath();
                        for (i = 0; i < list.length; i++) { g = list[i]; ctx.moveTo(g.x + 6.5, g.y); ctx.arc(g.x, g.y, 6.5, 0, 6.2832); }
                        ctx.fill();
                        ctx.globalAlpha = lv; ctx.fillStyle = rgb(COLORS[c], 0.18); ctx.beginPath();   // the lit glass
                        for (i = 0; i < list.length; i++) { g = list[i]; ctx.moveTo(g.x + RX, g.y); ctx.ellipse(g.x, g.y, RX, RY, g.rot, 0, 6.2832); }
                        ctx.fill();
                    }
                }
                ctx.globalAlpha = 0.7; ctx.fillStyle = '#fff'; ctx.beginPath();   // a little shine on the bright ones
                for (c = 0; c < groups.length; c++) for (l = 4; l <= LEVELS; l++) for (i = 0; i < groups[c][l].length; i++) { g = groups[c][l][i]; ctx.moveTo(g.x - 0.6, g.y - 1.8); ctx.arc(g.x - 1.4, g.y - 1.8, 0.9, 0, 6.2832); }
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            return {
                resize: function (W) { w = W; layout(); },
                frame: function (ctx, now) { draw(ctx, now / 1000, false); },
                still: function (ctx) { draw(ctx, 0, true); },
                lower: function () { /* already light: a thin canvas and a few dozen fills */ }
            };
        }
    });
})();
