/*
 * IELTSX — "Label the diagram" with typed answers (Reading and Listening): a picture with labels around and on it, every
 * label a short text with boxes to type in, and an arrow from the label to the part of the picture it names.
 * One module for the server (reading-exam.js, listening-exam.js), and the admin panel (admin-diagram.js), so the admin sees
 * exactly what the student sees. The page's styles: assets/css/diagram.css.
 *   model   { img, alt, iw, ih, pad: [top, right, bottom, left], labels: [{ x, y, w, t, line }] }
 *           iw × ih = the size of the picture; pad = free space around it, in % of its height (top, bottom) and width
 *           (right, left); x, y = the top left corner of a label and w = its width, in % of the whole area (picture and
 *           space); t = its text, ____ = a box for an answer; line = [x1, y1, x2, y2] (% of the area), the arrow, or null
 *   read(v) → model or null · write(model) → JSON · gaps(model) → the words around every box, in the order of the numbers
 *   html(model, from, gap) → the diagram; gap(n) draws the box of question n · lines(model) → its arrows
 */
(function (root, make) {
  'use strict';
  var m = make();
  if (typeof module === 'object' && module.exports) module.exports = m; else root.IXDiagram = m;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  var MAX = 40;
  var GAP = /_{2,}|\.{4,}|…{2,}/g;
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var num = function (v, lo, hi, def) { var n = Number(v); return isFinite(n) && v !== null && v !== '' ? Math.min(hi, Math.max(lo, Math.round(n * 100) / 100)) : def; };
  /* a picture of this site, or an https address */
  var okUrl = function (u) { u = String(u || '').trim(); return /^\/(?:uploads|assets)\/[^\s"'<>\\]+$/.test(u) && u.indexOf('..') < 0 || /^\/api\/media\/[A-Za-z0-9_-]{8,40}$/.test(u) || /^https:\/\/[^\s"'<>\\]{3,}$/i.test(u) ? u.slice(0, 1000) : ''; };

  function read(v) {
    var o = v;
    if (typeof v === 'string') { try { o = JSON.parse(v); } catch (e) { return null; } }
    if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
    var pad = Array.isArray(o.pad) ? o.pad : [];
    return {
      img: okUrl(o.img), alt: String(o.alt == null ? '' : o.alt).replace(/\s+/g, ' ').trim().slice(0, 200),
      iw: num(o.iw, 1, 20000, 0), ih: num(o.ih, 1, 20000, 0),
      pad: [0, 1, 2, 3].map(function (k) { return num(pad[k], 0, 150, 0); }),
      labels: (Array.isArray(o.labels) ? o.labels : []).slice(0, MAX).map(function (b) {
        b = b && typeof b === 'object' ? b : {};
        var ln = Array.isArray(b.line) && b.line.length === 4 ? b.line.map(function (x) { return num(x, 0, 100, null); }) : null;
        return { x: num(b.x, 0, 98, 2), y: num(b.y, 0, 98, 2), w: num(b.w, 5, 100, 26), t: String(b.t == null ? '' : b.t).replace(/\r/g, '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').slice(0, 400), line: ln && ln.every(function (x) { return x !== null; }) ? ln : null };
      })
    };
  }
  var write = function (model) { return JSON.stringify(read(model) || read({})); };
  /* the whole area: the picture and the space around it, in the units of the picture */
  function area(d) {
    var iw = d.iw || 1000, ih = d.ih || 700, p = d.pad;
    var W = iw * (1 + (p[1] + p[3]) / 100), H = ih * (1 + (p[0] + p[2]) / 100);
    return { W: W, H: H, x: iw * p[3] / 100 / W * 100, y: ih * p[0] / 100 / H * 100, w: iw / W * 100, h: ih / H * 100 };
  }
  var count = function (d) { return (d && d.labels || []).reduce(function (n, b) { return n + (String(b.t).match(GAP) || []).length; }, 0); };
  /* the words around every box: "A ____ (faller) was used to guide" */
  function gaps(d) {
    var out = [];
    (d && d.labels || []).forEach(function (b) {
      var parts = String(b.t).replace(/\s+/g, ' ').split(new RegExp(GAP.source, 'g'));
      for (var k = 0; k < parts.length - 1; k++) out.push((parts[k].split(' ').filter(Boolean).slice(-9).join(' ') + ' ____ ' + parts[k + 1].split(' ').filter(Boolean).slice(0, 7).join(' ')).trim());
    });
    return out;
  }
  var r2 = function (n) { return Math.round(n * 100) / 100; };
  /* the arrows: a line and its head, in the units of the area (so the head is never stretched) */
  function lines(d) {
    var A = area(d), out = '', head = Math.max(A.W, A.H) * 0.015;
    d.labels.forEach(function (b) {
      if (!b.line) return;
      var x1 = b.line[0] / 100 * A.W, y1 = b.line[1] / 100 * A.H, x2 = b.line[2] / 100 * A.W, y2 = b.line[3] / 100 * A.H;
      var len = Math.hypot ? Math.hypot(x2 - x1, y2 - y1) : Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      if (len < head) return;
      var ux = (x2 - x1) / len, uy = (y2 - y1) / len, bx = x2 - ux * head, by = y2 - uy * head, s = head * 0.36;
      out += '<line x1="' + r2(x1) + '" y1="' + r2(y1) + '" x2="' + r2(bx) + '" y2="' + r2(by) + '"/><polygon points="' + r2(x2) + ',' + r2(y2) + ' ' + r2(bx - uy * s) + ',' + r2(by + ux * s) + ' ' + r2(bx + uy * s) + ',' + r2(by - ux * s) + '"/>';
    });
    return out;
  }
  /* the text of a label: its boxes, its line breaks, **bold** */
  function labelHtml(t, next) {
    return esc(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(GAP, function () { return next(); }).replace(/\n/g, '<br>');
  }
  function html(model, from, gap) {
    var d = read(model); if (!d) return '';
    var A = area(d), n = from || 1, pins = '', boxes = '';
    d.labels.forEach(function (b, i) {
      var first = n; var body = labelHtml(b.t, function () { return gap(n++); });
      var at = n > first ? (n - 1 > first ? first + '–' + (n - 1) : String(first)) : '';
      boxes += '<div class="ix-dg-label" data-li="' + i + '" style="left:' + b.x + '%;top:' + b.y + '%;width:' + b.w + '%">' + (at ? '<b class="ix-dg-no">' + at + '</b>' : '') + '<span class="ix-dg-t">' + body + '</span></div>';
      if (at) pins += '<span class="ix-dg-pin" aria-hidden="true" style="left:' + r2(b.x + (b.line ? 0 : b.w / 2)) + '%;top:' + b.y + '%">' + at + '</span>';
    });
    return '<div class="ix-dg" style="--dg-w:' + Math.round(A.W) + ';--dg-h:' + Math.round(A.H) + '"><div class="ix-dg-in"><div class="ix-dg-stage">'
      + (d.img ? '<img class="ix-dg-img" src="' + esc(d.img) + '" alt="' + esc(d.alt || 'Diagram') + '" draggable="false" style="left:' + r2(A.x) + '%;top:' + r2(A.y) + '%;width:' + r2(A.w) + '%;height:' + r2(A.h) + '%">' : '<div class="ix-dg-empty"></div>')
      + '<svg class="ix-dg-lines" viewBox="0 0 ' + r2(A.W) + ' ' + r2(A.H) + '" aria-hidden="true" focusable="false">' + lines(d) + '</svg>' + pins + '</div><div class="ix-dg-labels">' + boxes + '</div></div></div>';
  }
  /* other space around the picture: every label and arrow stays at its place on the picture */
  function setPad(d, pad) {
    var a = area(d); d.pad = [0, 1, 2, 3].map(function (k) { return num(pad[k], 0, 150, 0); }); var b = area(d);
    var X = function (x) { return (x - a.x) / a.w * b.w + b.x; }, Y = function (y) { return (y - a.y) / a.h * b.h + b.y; };
    var c = function (v, hi) { return Math.min(hi, Math.max(0, r2(v))); };
    d.labels.forEach(function (l) { l.x = c(X(l.x), 98); l.y = c(Y(l.y), 98); l.w = Math.min(100, Math.max(5, r2(l.w / a.w * b.w))); if (l.line) l.line = [c(X(l.line[0]), 100), c(Y(l.line[1]), 100), c(X(l.line[2]), 100), c(Y(l.line[3]), 100)]; });
    return d;
  }
  /* labels made from lines of text (pasted questions, or another type of question turned into a diagram): down the left
     side, then down the right side of the picture */
  function fromLines(list) {
    var ls = (list || []).map(function (l) { return String(l || '').trim(); }).filter(Boolean).slice(0, MAX);
    var d = read({ pad: [4, 48, 4, 48], iw: 1000, ih: 760 }); var left = Math.ceil(ls.length / 2);
    ls.forEach(function (t, i) {
      var side = i < left ? 0 : 1, k = side ? i - left : i, of = side ? ls.length - left : left;
      var y = r2(6 + (k + 0.15) * (88 / Math.max(1, of)));
      d.labels.push({ x: side ? 76 : 1.5, y: y, w: 22.5, t: t, line: side ? [75, r2(y + 3), 66, r2(y + 6)] : [24.5, r2(y + 3), 34, r2(y + 6)] });
    });
    return d;
  }
  return { read: read, write: write, gaps: gaps, count: count, html: html, lines: lines, labelHtml: labelHtml, area: area, setPad: setPad, fromLines: fromLines, okUrl: okUrl, GAP: GAP, MAX: MAX };
});
