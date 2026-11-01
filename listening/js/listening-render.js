/* listening-render.js -- builds the question markup of a Listening test that was made in the admin panel.
   The page defines window.LISTENING_DATA = { blocks: [...], images: [...] } (made by listening-exam.js);
   this file turns every block into the same markup the hand-made pages (sections/test-1 ... 4) produce, using the
   helpers of listening.js (gapInput, mcqCard, dragGroup, mapMatrix, ...). It must be loaded BEFORE listening.js. */
(function () {
  'use strict';
  var esc = function (v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var rng = function (a, b) { return a === b ? '' + a : a + '&ndash;' + b; };
  var NUM = { 2: 'TWO', 3: 'THREE', 4: 'FOUR', 5: 'FIVE', 6: 'SIX' };

  function head(b, first, last, instr, title) {
    // a full paper (Parts 1-4 on one page): a "Part N" heading opens each part
    var part = b.partHead && !b.paged ? '<h2 class="ix-part-head" style="margin:' + (b.first ? '0' : '36px') + ' 0 6px;padding-bottom:6px;border-bottom:2px solid currentColor;font-size:20px">' + esc(b.partHead) + '</h2>' : '';
    return part + '<div class="section-head"' + (b.first || b.partHead ? '' : ' style="margin-top:24px"') + '><div class="num">Questions ' + rng(first, last) + '</div>' +
      (instr ? '<div class="instruction">' + instr + '</div>' : '') + (title ? '<h2>' + esc(title) + '</h2>' : '') + '</div>';   // as printed: the instruction, then the title of the notes
  }
  /* **bold** and _italic_ are the only markup an admin can use in instructions */
  function rich(t) { return esc(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:]|$)/g, '$1<em>$2</em>'); }

  function gapBlock(h, b) {
    var out = '', lines = '';
    b.items.forEach(function (it) {
      var parts = String(it.prompt).split(/_{2,}|\.{4,}|\u2026{2,}/);
      var line = '';
      parts.forEach(function (p, i) {
        line += esc(p).replace(/\n/g, '<br>');
        if (i < parts.length - 1) line += h.gapInput(it.id);
      });
      if (parts.length < 2) line += ' ' + h.gapInput(it.id);
      if (it.title) lines += '<div class="subhead"><br>' + esc(it.title) + '</div>';
      lines += (it.bullet === false ? '' : '-' + h.nb(1)) + line + '<br>\n<br>';
    });
    lines = lines.replace(/<br>\n<br>$/, '');
    return head(b, b.from, b.to, rich(b.instruction), b.title) + '<div class="note-flow">' + lines + '</div>';
  }
  function mcqBlock(h, b) {
    return head(b, b.from, b.to, rich(b.instruction), b.title) + b.items.map(function (it) {
      return h.mcqCard(it.id, esc(it.prompt), it.options.map(function (o) { return { letter: o.l, text: esc(o.t) }; }));
    }).join('');
  }
  function multiBlock(h, b) {
    var it = b.items[0], ids = it.ids;
    var opts = it.options.map(function (o) { return '<label class="option ms-option"><input type="checkbox" class="ms-box" value="' + esc(o.l) + '"><span class="opt-letter" aria-hidden="true">' + esc(o.l) + '</span><span>' + esc(o.t) + '</span></label>'; }).join('');
    var card = '<div class="q-card ms-group" id="lq-card-' + ids[0] + '" data-ms-ids="' + ids.join(',') + '"><div class="q-row"><span class="q-pill" data-qnum="' + ids[0] + '">' + ids[0] + '&ndash;' + ids[ids.length - 1] + '</span><div class="q-text">' + esc(it.prompt) + '</div><span class="feedback-pill" id="lfb-' + ids[0] + '"></span></div>' +
      '<div class="ms-hint">Choose ' + (NUM[ids.length] || ids.length) + ' letters.</div><div class="options ms-options">' + opts + '</div></div>';
    return head(b, b.from, b.to, rich(b.instruction), b.title) + card;
  }
  function matchBlock(h, b) {
    var opts = b.options.map(function (o) { return [o.l, esc(o.t)]; });
    var items = b.items.map(function (it) { return [it.id, esc(it.prompt)]; });
    return head(b, b.from, b.to, rich(b.instruction), b.title) + h.kbHelp() + h.dragGroup('m' + b.from, items, opts);
  }
  function mapBlock(h, b) {
    var letters = b.options.map(function (o) { return o.l; });
    var pics = (b.images || []).map(function (im) { return '<img src="' + esc(im.url) + '" alt="' + esc(im.caption || 'Map / plan') + '">' + (im.caption ? '<div class="mx-title">' + esc(im.caption) + '</div>' : ''); }).join('');
    var items = b.items.map(function (it) { return [it.id, esc(it.prompt)]; });
    return head(b, b.from, b.to, rich(b.instruction), b.title) + '<div class="eh-row mx-row-wrap">' + (pics ? '<div class="mx-map">' + pics + '</div>' : '') + h.mapMatrix(items, letters) + '</div>';
  }
  function boxBlock(h, b) {
    var words = b.options.map(function (o) { return esc(o.t); });
    var pool = '<div class="opt-box drag-pool" id="pool-bx' + b.from + '" data-pool="pool-bx' + b.from + '">' + h.poolChips('bx' + b.from, words) + '</div>';
    var lines = b.items.map(function (it) {
      var parts = String(it.prompt).split(/_{2,}|\.{4,}|\u2026{2,}/), line = '';
      parts.forEach(function (p, i) { line += esc(p).replace(/\n/g, '<br>'); if (i < parts.length - 1) line += h.dropInline(it.id); });
      if (parts.length < 2) line += ' ' + h.dropInline(it.id);
      return (it.title ? '<div class="subhead"><br>' + esc(it.title) + '</div>' : '') + '-' + h.nb(1) + line;
    }).join('<br>\n<br>');
    return head(b, b.from, b.to, rich(b.instruction), b.title) + pool + h.kbHelp() + '<div class="note-flow">' + lines + '</div>';
  }
  var GAP = /_{2,}|\.{4,}|\u2026{2,}/g, BUL = /^\s*[-\u2013\u2022\u25cf\u25aa\u25e6\u00b7*]\s*/;
  /* a table: { rows, head, rowHead } saved as JSON (a cell may have several lines, "- " = a bullet), or, in older tests,
     "a | b" rows with the headings first. Every ____ is a typed gap, numbered row by row; the title is the first row. */
  function tableOf(t) {
    var s = String(t || '').trim();
    if (s.charAt(0) === '{') { try { var o = JSON.parse(s); if (Array.isArray(o.rows)) return { rows: o.rows, head: o.head !== false, rowHead: !!o.rowHead }; } catch (e) { /* old rows */ } }
    return { rows: s.replace(/\r/g, '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean)
      .map(function (l) { return l.replace(/^\|\s*|\s*\|$/g, '').split(/\s*\|\s*|\t+/); }), head: true, rowHead: false };
  }
  function tableBlock(h, b) {
    var tb = tableOf(b.table), k = 0, ids = b.items.map(function (it) { return it.id; });
    var cols = tb.rows.reduce(function (m, r) { return Math.max(m, r.length); }, 1);
    var cell = function (c, isHead) {
      var html = '', ul = false;
      String(c == null ? '' : c).split('\n').map(function (l) { return l.trim(); }).filter(Boolean).forEach(function (l) {
        var bullet = BUL.test(l), t = esc(bullet ? l.replace(BUL, '') : l).replace(GAP, function () { return isHead ? '____' : (k < ids.length ? h.gapInput(ids[k++]) : ''); });
        if (bullet) { if (!ul) { html += '<ul class="ix-tul">'; ul = true; } html += '<li>' + t + '</li>'; }
        else { if (ul) { html += '</ul>'; ul = false; } html += '<div class="ix-tline">' + t + '</div>'; }
      });
      return html + (ul ? '</ul>' : '');
    };
    var tr = function (r, i) {
      var out = '';
      for (var c = 0; c < cols; c++) { var th = (i === 0 && tb.head) || (c === 0 && tb.rowHead); out += (th ? '<th>' : '<td>') + cell(r[c], i === 0 && tb.head) + (th ? '</th>' : '</td>'); }
      return '<tr>' + out + '</tr>';
    };
    var title = b.title ? '<tr><th class="ix-ttitle" colspan="' + cols + '">' + esc(b.title) + '</th></tr>' : '';
    return head(b, b.from, b.to, rich(b.instruction), '') + '<div class="ix-ltable-wrap"><table class="ix-ltable">' + title + tb.rows.map(tr).join('') + '</table></div>';
  }
  /* a block typed as text: notes ("- " bullet, "## " sub-heading, other lines as they are), sentences (one per line),
     a summary (running text, an empty line = a new paragraph) or a flow-chart (one box per line). Every ____ is a gap,
     numbered in order: typed (text) or a drop zone for a word of the box (textbox). */
  function textBody(h, b, drop) {
    var ids = b.items.map(function (it) { return it.id; }), k = 0;
    var fill = function (s) { return esc(s).replace(GAP, function () { return k < ids.length ? (drop ? h.dropInline(ids[k++]) : h.gapInput(ids[k++])) : ''; }); };
    var text = String(b.text || '').replace(/\r/g, ''), style = b.style;
    var prose = style === 'summary' || (style === 'box' && !/^\s*[-\u2022]\s/m.test(text));
    if (prose) return '<div class="note-flow ix-summary">' + text.split(/\n\s*\n/).map(function (p) { return '<p>' + fill(p.replace(/\s*\n\s*/g, ' ').trim()) + '</p>'; }).join('') + '</div>';
    var lines = text.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    if (style === 'flowchart') return h.flowChart('', lines.map(function (l) { return fill(l.replace(BUL, '')); }));
    return '<div class="note-flow ix-notes">' + lines.map(function (l) {
      var m = /^##\s*(.*)$/.exec(l);
      if (m) return '<div class="subhead">' + fill(m[1]) + '</div>';
      if (BUL.test(l)) return '<div class="ix-li">' + fill(l.replace(BUL, '')) + '</div>';
      return '<div class="ix-line">' + fill(l) + '</div>';
    }).join('') + '</div>';
  }
  function textBlock(h, b) { return '<div class="ix-textblock">' + head(b, b.from, b.to, rich(b.instruction), b.title) + textBody(h, b, false) + '</div>'; }
  function textBoxBlock(h, b) {
    var words = b.options.map(function (o) { return esc(o.t); });
    var pool = '<div class="opt-box drag-pool ix-pool-below" id="pool-bx' + b.from + '" data-pool="pool-bx' + b.from + '">' + h.poolChips('bx' + b.from, words) + '</div>';
    return '<div class="ix-textblock">' + head(b, b.from, b.to, rich(b.instruction), b.title) + h.kbHelp() + textBody(h, b, true) + pool + '</div>';
  }
  var BUILD = { gap: gapBlock, table: tableBlock, text: textBlock, textbox: textBoxBlock, mcq: mcqBlock, multi: multiBlock, matching: matchBlock, map: mapBlock, box: boxBlock };

  window.IXListeningRender = function (data, part) {
    return function (h) {
      // a full paper shown part by part: each part in its own container (listening.js shows one at a time)
      var html = '', open = 0;
      (data.blocks || []).forEach(function (b, i) {
        b.first = i === 0; b.paged = !!data.paged;
        if (data.paged && b.part !== open) { html += (open ? '</div>' : '') + '<div class="ix-part" data-ix-part="' + b.part + '">'; open = b.part; b.first = true; }
        var f = BUILD[b.kind]; html += f ? f(h, b) : '';
      });
      if (open) html += '</div>';
      return '<div class="section-block" id="listening-part-' + part + '">' + html + '</div>';
    };
  };
})();
