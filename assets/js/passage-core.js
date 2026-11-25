/*
 * IELTSX — the paragraphs of a Reading passage and their letters. One module for the server (reading-exam.js draws the
 * passage) and for the admin panel (admin-passage.js edits it paragraph by paragraph), so both always see the same thing.
 *   split(text)    [{ l, k, t }]   l = the letter of the paragraph ('' = none), k = p (a paragraph), sub (a sub-heading,
 *                                  "## …"), foot (a footnote, "* …"), t = its text
 *   join(rows)     the text that is saved: "[A] The first paragraph …", an empty line between paragraphs
 *   letters(text)  ['A', 'B', …]
 * Two ways of writing the letters:
 *   "[A] text"     the admin's own choice: exactly these paragraphs have exactly these letters, nothing is guessed
 *   "A. text", "A) text", "A Text" (as printed in PDFs): found only where a run A, B, C … really starts
 */
(function (root, make) {
  'use strict';
  var m = make();
  if (typeof module === 'object' && module.exports) module.exports = m; else root.IXPassage = m;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  var MARK = /^\[([A-Z]{1,2})\]\s*/;
  var END = /[.!?:"”’)]$/;
  var LET = /^([A-Z])(?:[.)]\s+|\s+(?=[A-Z0-9“"‘'(]))([\s\S]*)$/;

  /* Paragraphs of a pasted passage. Text copied from a PDF has a line break at the end of every printed line (and often no
     blank line between paragraphs): wrapped lines are joined back into one paragraph, and without blank lines a paragraph
     ends at a clearly short line that ends a sentence. */
  function paragraphs(text) {
    var src = String(text || '').replace(/\r/g, '').replace(/\f/g, '\n').trim();
    if (!src) return [];
    var ls = src.split('\n').map(function (l) { return l.trim(); });
    // the printed line width: a high percentile, not the maximum (one very long line must not make every line look short)
    var lens = ls.map(function (l) { return l.length; }).filter(function (n) { return n > 0; }).sort(function (x, y) { return x - y; });
    var L = Math.max(40, lens.length ? lens[Math.floor(lens.length * 0.9)] : 40);
    var full = ls.filter(Boolean);
    // typed in by hand: (almost) every line is a whole paragraph
    if (full.length && full.filter(function (l) { return END.test(l); }).length / full.length > 0.6) return full.map(function (l) { return l.replace(/\s+/g, ' '); });
    // copied from a PDF: wrapped lines. A paragraph ends at a blank line or a clearly short line that ends a sentence;
    // a blank line in the middle of a sentence is a page break and is ignored.
    var paras = [], cur = [];
    var close = function () { if (cur.length) paras.push(cur); cur = []; };
    ls.forEach(function (t) {
      if (!t) { if (cur.length && END.test(cur[cur.length - 1])) close(); return; }
      if (!cur.length && t.length < 0.6 * L && !END.test(t)) { paras.push([t]); return; }          // a title / sub-heading line
      if (cur.length && /^[A-Z][.)]?\s+[A-Z“"‘']/.test(t) && END.test(cur[cur.length - 1])) close();
      cur.push(t);
      if (t.length < 0.75 * L && END.test(t)) close();
    });
    close();
    // join wrapped lines with a space; keep a real line break only after a short line (lists, addresses)
    return paras.map(function (lines) {
      return lines.filter(Boolean).reduce(function (acc, l, i, arr) { return acc + (i ? (arr[i - 1].length < 0.6 * L ? '\n' : ' ') : '') + l; }, '').trim();
    }).filter(Boolean);
  }
  var kindOf = function (p) {
    var sub = /^##\s+([\s\S]+)$/.exec(p); if (sub) return { l: '', k: 'sub', t: sub[1].trim() };
    var foot = /^\*\s+([\s\S]+)$/.exec(p); if (foot) return { l: '', k: 'foot', t: foot[1].trim() };
    return { l: '', k: 'p', t: p };
  };
  var isMarked = function (text) { return /^\s*\[[A-Z]{1,2}\]/m.test(String(text || '')); };

  /* the admin's own letters: a "[A]" line starts a paragraph, an empty line ends it, the lines between are one paragraph */
  function marked(text) {
    var rows = [], cur = null;
    String(text || '').replace(/\r/g, '').split('\n').forEach(function (raw) {
      var t = raw.trim();
      if (!t) { cur = null; return; }
      var m = MARK.exec(t);
      if (m) { cur = { l: m[1], k: 'p', t: t.slice(m[0].length).trim() }; rows.push(cur); return; }
      var one = kindOf(t);
      if (one.k !== 'p') { rows.push(one); cur = null; return; }
      if (cur) cur.t = (cur.t + ' ' + t).trim(); else { cur = { l: '', k: 'p', t: t }; rows.push(cur); }
    });
    return rows.filter(function (r) { return r.t || r.l; });
  }
  function split(text) {
    if (isMarked(text)) return marked(text);
    var list = paragraphs(text); var lettered = {};
    // a section may have more than one paragraph ("A …", two plain paragraphs, "B …"): look a few paragraphs ahead for the "B"
    var nextLetter = function (i) { for (var j = i + 1; j < list.length && j <= i + 4; j++) { var m = LET.exec(list[j]); if (m) return m[1]; } return ''; };
    var start = -1, i;
    for (i = 0; i < list.length && start < 0; i++) { var a = LET.exec(list[i]); if (a && a[1] === 'A' && nextLetter(i) === 'B') start = i; }
    for (i = 0; i < list.length && start < 0; i++) if (/^A[.)]\s+/.test(list[i])) start = i;
    if (start >= 0) { var want = 65; for (i = start; i < list.length; i++) { var x = LET.exec(list[i]); if (x && x[1].charCodeAt(0) === want) { lettered[i] = x; want++; } } }
    return list.map(function (p, n) { return lettered[n] ? { l: lettered[n][1], k: 'p', t: lettered[n][2] } : kindOf(p); });
  }
  function join(rows) {
    return (rows || []).map(function (r) {
      var t = String((r && r.t) || '').replace(/\r/g, '').replace(/[ \t]*\n+[ \t]*/g, ' ').trim();
      if (!t && !(r && r.l)) return '';
      if (r.k === 'sub') return '## ' + t;
      if (r.k === 'foot') return '* ' + t;
      return (r.l ? '[' + r.l + '] ' : '') + t;
    }).filter(Boolean).join('\n\n');
  }
  var cleanLetter = function (v) { return String(v || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2); };
  /* A, B … Z, AA, AB … */
  var letterAt = function (n) { return n < 26 ? String.fromCharCode(65 + n) : 'A' + String.fromCharCode(65 + (n % 26)); };
  var letters = function (text) { return split(text).map(function (r) { return r.l; }).filter(Boolean); };
  /* the text without its marks, as a reader sees it ("A. The first …") — for the places that print it as it is */
  var plain = function (text) { return isMarked(text) ? marked(text).map(function (r) { return (r.l ? r.l + '. ' : r.k === 'sub' ? '' : r.k === 'foot' ? '* ' : '') + r.t; }).join('\n\n') : String(text || ''); };

  return { split: split, join: join, letters: letters, letterAt: letterAt, cleanLetter: cleanLetter, isMarked: isMarked, plain: plain, paragraphs: paragraphs };
});
