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
    var part = b.partHead ? '<h2 class="ix-part-head" style="margin:' + (b.first ? '0' : '36px') + ' 0 6px;padding-bottom:6px;border-bottom:2px solid currentColor;font-size:20px">' + esc(b.partHead) + '</h2>' : '';
    return part + '<div class="section-head"' + (b.first || b.partHead ? '' : ' style="margin-top:24px"') + '><div class="num">Questions ' + rng(first, last) + '</div>' +
      (title ? '<h2>' + esc(title) + '</h2>' : '') + (instr ? '<div class="instruction">' + instr + '</div>' : '') + '</div>';
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
  /* a table: the first line is the column headings, then one row per line, cells split by | (or a tab); every ____ is
     a typed gap, numbered row by row */
  function tableRows(t) {
    return String(t || '').replace(/\r/g, '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean)
      .map(function (l) { return l.replace(/^\|\s*|\s*\|$/g, '').split(/\s*\|\s*|\t+/); });
  }
  function tableBlock(h, b) {
    var rows = tableRows(b.table), k = 0;
    var cols = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 1);
    var ids = b.items.map(function (it) { return it.id; });
    var cell = function (c, isHead) {
      var parts = String(c || '').split(/_{2,}|\.{4,}|\u2026{2,}/);
      return parts.map(function (p, i) { return esc(p) + (i < parts.length - 1 ? (isHead ? '____' : (k < ids.length ? h.gapInput(ids[k++]) : '')) : ''); }).join('');
    };
    var tr = function (r, isHead) { var out = ''; for (var i = 0; i < cols; i++) out += isHead ? '<th>' + cell(r[i], true) + '</th>' : '<td>' + cell(r[i], false) + '</td>'; return '<tr>' + out + '</tr>'; };
    var table = '<div class="ix-ltable-wrap"><table class="ix-ltable">' + (rows.length ? '<thead>' + tr(rows[0], true) + '</thead>' : '') +
      '<tbody>' + rows.slice(1).map(function (r) { return tr(r, false); }).join('') + '</tbody></table></div>';
    return head(b, b.from, b.to, rich(b.instruction), b.title) + table;
  }
  var BUILD = { gap: gapBlock, table: tableBlock, mcq: mcqBlock, multi: multiBlock, matching: matchBlock, map: mapBlock, box: boxBlock };

  window.IXListeningRender = function (data, part) {
    return function (h) {
      var html = (data.blocks || []).map(function (b, i) { b.first = i === 0; var f = BUILD[b.kind]; return f ? f(h, b) : ''; }).join('');
      return '<div class="section-block" id="listening-part-' + part + '">' + html + '</div>';
    };
  };
})();
