/*
 * IELTSX — draws the book page of an e-book unit (the blocks of ebook-doc.js, sent by /api/ebooks) in the look of its
 * book: the website's own, a course book (magenta), a workbook (grey) or a vocabulary book "In Use" (green) — the styles
 * are in assets/css/ebook-book.css. Used by the Books page (assets/js/ebooks-page.js) and by the preview of Admin → E-books.
 *   IXEbook.head(style, n, title)    the "Unit 1  Title" header of the book
 *   IXEbook.page(blocks, opts)       the HTML of the page: sections, boxes, passages, exercises with their inputs
 *   IXEbook.bind(root, onCheck)      makes the inputs work (circle a word, two options at most …), once per root
 *   IXEbook.collect(root, task)      { answers: { <id>: value }, empty, count } of one exercise (or of the whole page)
 *   IXEbook.mark(root, results)      shows what was right, the right answers and the explanations after Check
 *   IXEbook.reset(root, task)        clears one exercise to try it again
 *   IXEbook.fill(root, key)          writes the answers in (the admin's preview)
 * The answers are never part of the blocks: they come back only from the server's check.
 */
(function () {
  'use strict';
  var STYLES = { site: 'Website', course: 'Course book', workbook: 'Workbook', inuse: 'Vocabulary book (In Use)' };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var unesc = function (v) { return String(v).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'); };
  var LEGEND = {
    tfng: [['TRUE', 'if the statement agrees with the information'], ['FALSE', 'if the statement contradicts the information'], ['NOT GIVEN', 'if there is no information on this']],
    yng: [['YES', 'if the statement agrees with the claims of the writer'], ['NO', 'if the statement contradicts the claims of the writer'], ['NOT GIVEN', 'if it is impossible to say what the writer thinks about this']]
  };
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  var AGAIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';

  /* a gap, or the words to circle, inside a sentence */
  function slots(html) {
    return String(html || '').replace(/<span class="ebk-slot" data-k="(gap|pick)" data-a="([^"]+)"(?: data-n="(\d+)")?(?: data-o="([^"]*)")?(?: data-w="1")?><\/span>/g, function (_, k, id, n, o) {
      if (k === 'gap') {
        return '<span class="ebk-gapw" data-for="' + id + '">' + (n ? '<b class="ebk-gn">' + n + '</b>' : '') + '<input class="ebk-gap" type="text" data-a="' + id + '" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="' + (n ? 'Answer ' + n : 'Answer') + '"><span class="ebk-key" hidden></span></span>';
      }
      var opts = unesc(o || '').split('|');
      return '<span class="ebk-pick" data-a="' + id + '" role="group">' + opts.map(function (x) { return '<button type="button" class="ebk-pk" data-v="' + esc(x) + '">' + esc(x) + '</button>'; }).join('<i aria-hidden="true">/</i>') + '</span>';
    });
  }
  function textBlock(b) {
    switch (b.t) {
      case 'h2': return '<h3 class="ebk-h2">' + slots(b.html) + '</h3>';
      case 'h3': return '<h4 class="ebk-h3">' + slots(b.html) + '</h4>';
      case 'p': return '<p>' + slots(b.html) + '</p>';
      case 'ul': return '<ul>' + b.items.map(function (x) { return '<li>' + slots(x) + '</li>'; }).join('') + '</ul>';
      case 'ol': return '<ol' + (b.start > 1 ? ' start="' + b.start + '"' : '') + '>' + b.items.map(function (x) { return '<li>' + slots(x) + '</li>'; }).join('') + '</ol>';
      case 'eg': return '<div class="ebk-egl">' + slots(b.html) + '</div>';
      case 'tip': return '<div class="ebk-tip">' + slots(b.html) + '</div>';
      case 'table': return '<div class="ebk-tw"><table class="ebk-table' + (b.head ? '' : ' nohead') + '">' + b.rows.map(function (r, i) { var tag = b.head && !i ? 'th' : 'td'; return '<tr>' + r.map(function (c) { return '<' + tag + '>' + slots(c) + '</' + tag + '>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
      case 'qtitle': return '<div class="ebk-qtitle ebk-qtitle-2">' + b.html + '</div>' + (b.rubric && b.rubric.length ? '<div class="ebk-rubric">' + b.rubric.map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div>' : '');
      default: return '';
    }
  }
  function box(b) {
    if (b.kind === 'words') return '<div class="ebk-words">' + (b.title ? '<b class="ebk-words-t">' + b.title + '</b>' : '') + b.words.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('') + '</div>';
    var inner = (b.blocks || []).map(textBlock).join('');
    if (b.kind === 'advice' || b.kind === 'info') return '<aside class="ebk-adv"><div class="ebk-adv-h"><span class="ebk-adv-tag">' + (b.kind === 'info' ? 'Exam information' : 'Exam advice') + '</span>' + (b.title ? '<span class="ebk-adv-t">' + b.title + '</span>' : '') + '</div>' + inner + '</aside>';
    if (b.kind === 'passage') return '<article class="ebk-passage">' + (b.title ? '<h3 class="ebk-pass-t">' + b.title + '</h3>' : '') + '<div class="ebk-pass-body">' + inner + '</div>' + (b.source ? '<p class="ebk-src">' + b.source + '</p>' : '') + '</article>';
    if (b.kind === 'panel') return '<div class="ebk-panel">' + (b.title ? '<h3 class="ebk-panel-t">' + b.title + '</h3>' : '') + inner + '</div>';
    return '<div class="ebk-note">' + (b.title ? '<div class="ebk-note-t">' + b.title + '</div>' : '') + inner + '</div>';
  }
  function item(x, task) {
    var ctl = '';
    if (x.kind === 'choice') {
      var multi = x.multi > 1;
      ctl = '<div class="ebk-opts" data-a="' + esc(x.a || '') + '" data-multi="' + (x.multi || 1) + '">' + x.opts.map(function (o) {
        return '<label class="ebk-opt" data-v="' + o.l + '"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="' + esc(x.a || '') + '" value="' + o.l + '"><b>' + o.l + '</b><span>' + o.html + '</span></label>';
      }).join('') + '</div>';
    } else if (x.kind === 'labels') {
      var labels = x.labels || task.labels || [];
      ctl = '<div class="ebk-labs" data-a="' + esc(x.a || '') + '">' + labels.map(function (l) { return '<label class="ebk-lab" data-v="' + esc(l) + '"><input type="radio" name="' + esc(x.a || '') + '" value="' + esc(l) + '"><span>' + esc(l) + '</span></label>'; }).join('') + '</div>';
    } else if (x.kind === 'match') {
      var opts = task.options && task.options.length
        ? task.options.map(function (o) { var t = o.html.replace(/<[^>]+>/g, ''); t = unesc(t); return '<option value="' + o.l + '">' + o.l + ' — ' + esc(t.length > 58 ? t.slice(0, 56) + '…' : t) + '</option>'; })
        : (task.mopts || []).map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + '</option>'; });
      ctl = '<span class="ebk-selw"><select class="ebk-sel" data-a="' + esc(x.a || '') + '" aria-label="Answer"><option value="">' + (task.options && task.options.length ? 'Choose…' : 'Choose the match…') + '</option>' + opts.join('') + '</select><span class="ebk-key" hidden></span></span>';
    }
    var inline = x.kind === 'labels' || x.kind === 'match';
    return '<div class="ebk-item k-' + x.kind + (inline ? ' is-inline' : '') + (/^[a-h]$/.test(x.label) ? ' is-letter' : '') + '">'
      + '<span class="ebk-in">' + esc(x.label) + '</span><div class="ebk-im"><div class="ebk-it">' + slots(x.html) + (x.kind === 'match' ? ' ' + ctl : '') + '</div>'
      + (x.kind === 'match' ? '' : ctl) + '<div class="ebk-fb" hidden></div></div></div>';
  }
  function task(b, label, style) {
    var body = b.body.map(function (x) { return x.t === 'item' ? item(x, b) : textBlock(x); }).join('');
    if (b.layout === 'flow') body = '<div class="ebk-flow">' + b.body.map(function (x) { return '<div class="ebk-step">' + (x.t === 'item' ? item(x, b) : textBlock(x)) + '</div>'; }).join('') + '</div>';
    var legend = b.legend ? '<dl class="ebk-legend">' + LEGEND[b.legend].map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('') + '</dl>' : '';
    var options = b.options && b.options.length ? '<div class="ebk-olist">' + b.options.map(function (o) { return '<div><b>' + o.l + '</b><span>' + o.html + '</span></div>'; }).join('') + '</div>' : '';
    var words = b.words && b.words.length ? '<div class="ebk-words">' + b.words.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('') + '</div>' : '';
    var rubric = b.rubric && b.rubric.length ? '<div class="ebk-rubric">' + b.rubric.map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div>' : '';
    var inner = rubric + legend + options + words + body;
    var head = b.legacy
      ? '<header class="ebk-th"><span class="ebk-tn">' + esc(label) + '</span><div class="ebk-instr">' + (style === 'inuse' ? 'More practice' : 'Exercises') + '</div></header>'
      : (b.instr || label ? '<header class="ebk-th"><span class="ebk-tn">' + esc(label) + '</span><div class="ebk-instr">' + (b.instr || '') + '</div></header>' : '');
    var foot = b.points ? '<div class="ebk-tf"><button class="ebk-btn ebk-check" type="button" data-check-task="' + esc(b.id) + '">' + CHECK + 'Check</button><button class="ebk-btn ghost ebk-again" type="button" data-again-task="' + esc(b.id) + '" hidden>' + AGAIN + 'Try again</button><span class="ebk-tscore" aria-live="polite"></span><span class="ebk-tbest"></span></div>' : '';
    return '<section class="ebk-task' + (b.points ? '' : ' no-check') + '" data-task="' + esc(b.id) + '" data-points="' + (b.points || 0) + '">' + head
      + (b.qtitle ? '<div class="ebk-qbox"><div class="ebk-qtitle">' + b.qtitle + '</div>' + inner + '</div>' : '<div class="ebk-tbody">' + inner + '</div>') + foot + '</section>';
  }
  /* the page: blocks grouped into the sections of the unit; exercises numbered like the book (per section, or 1.1, 1.2 …) */
  function page(blocks, opts) {
    opts = opts || {}; var style = opts.style || 'site'; var unitNo = opts.unit || 1;
    var out = []; var open = false; var seq = 0; var useq = 0; var cur = [];
    var close = function () { if (!open && !cur.length) return; var hasTask = cur.some(function (h) { return h.indexOf('class="ebk-task') > -1; }); var onlyTask = hasTask && cur.every(function (h) { return h.indexOf('class="ebk-task') > -1 || h.indexOf('class="ebk-sec') > -1; }); out.push('<div class="ebk-part' + (hasTask ? ' has-task' : '') + (onlyTask ? ' only-task' : '') + '">' + cur.join('') + '</div>'); cur = []; open = false; };
    (blocks || []).forEach(function (b) {
      if (b.t === 'sec') {
        close(); open = true; seq = 0;
        cur.push('<h2 class="ebk-sec' + (b.letter ? ' has-letter' : '') + '">' + (b.letter ? '<span class="ebk-let">' + esc(b.letter) + '</span>' : '') + '<span class="ebk-sec-t">' + b.html + (b.sub ? ' <em>' + b.sub + '</em>' : '') + '</span></h2>');
        return;
      }
      if (b.t === 'task') {
        seq++; useq++;
        var label = b.num || (style === 'inuse' ? unitNo + '.' + useq : String(seq));
        cur.push(task(b, label, style)); return;
      }
      if (b.t === 'box') { cur.push(box(b)); return; }
      cur.push(textBlock(b));
    });
    close();
    return out.join('');
  }
  function head(style, n, title, summary) {
    if (style === 'site') return '';
    if (style === 'inuse') return '<header class="ebk-uh"><span class="ebk-uc">' + esc(n) + '</span><h1>' + esc(title) + '</h1></header>' + (summary ? '<p class="ebk-sum">' + esc(summary) + '</p>' : '');
    return '<header class="ebk-uh"><span class="ebk-uc"><small>Unit</small> ' + esc(n) + '</span><h1>' + esc(title) + '</h1></header>' + (summary ? '<p class="ebk-sum">' + esc(summary) + '</p>' : '');
  }

  /* ───────── the inputs ───────── */
  function scope(root, t) { return t ? root.querySelector('.ebk-task[data-task="' + t + '"]') : root; }
  function bind(root, onCheck) {
    if (!root || root.__ebk) return; root.__ebk = true;
    root.addEventListener('click', function (e) {
      var pk = e.target.closest && e.target.closest('.ebk-pk');
      if (pk && root.contains(pk)) {
        var g = pk.parentNode; if (g.classList.contains('done')) return;
        var on = pk.classList.contains('on');
        g.querySelectorAll('.ebk-pk').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
        if (!on) { pk.classList.add('on'); pk.setAttribute('aria-pressed', 'true'); }
        return;
      }
      var c = e.target.closest && e.target.closest('[data-check-task],[data-again-task]');
      if (c && root.contains(c) && onCheck) { e.preventDefault(); onCheck(c.hasAttribute('data-check-task') ? 'check' : 'again', c.getAttribute(c.hasAttribute('data-check-task') ? 'data-check-task' : 'data-again-task'), c); }
    });
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.type === 'checkbox' && t.closest('.ebk-opts')) {   // "Choose TWO letters": no more than two
        var g = t.closest('.ebk-opts'); var max = +g.getAttribute('data-multi') || 1;
        var on = g.querySelectorAll('input:checked');
        if (on.length > max) { t.checked = false; }
      }
    });
    root.addEventListener('input', function (e) {
      var t = e.target; if (!t.classList || !t.classList.contains('ebk-gap')) return;
      t.style.width = Math.min(24, Math.max(7, t.value.length + 2)) + 'ch';
    });
    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || !e.target.classList || !e.target.classList.contains('ebk-gap')) return;
      e.preventDefault();
      var sec = e.target.closest('.ebk-task'); var all = sec ? sec.querySelectorAll('.ebk-gap:not([disabled])') : [];
      var i = Array.prototype.indexOf.call(all, e.target);
      if (all[i + 1]) all[i + 1].focus(); else if (sec && onCheck) onCheck('check', sec.getAttribute('data-task'), sec.querySelector('[data-check-task]'));
    });
  }
  function collect(root, t) {
    var s = scope(root, t); var answers = {}; var empty = 0; var count = 0;
    if (!s) return { answers: answers, empty: 0, count: 0 };
    var put = function (id, v, blank) { if (!id) return; answers[id] = v; count++; if (blank) empty++; };
    s.querySelectorAll('.ebk-gap').forEach(function (x) { put(x.getAttribute('data-a'), x.value, !x.value.trim()); });
    s.querySelectorAll('.ebk-pick').forEach(function (x) { var on = x.querySelector('.ebk-pk.on'); put(x.getAttribute('data-a'), on ? on.getAttribute('data-v') : '', !on); });
    s.querySelectorAll('.ebk-opts').forEach(function (x) { var v = Array.prototype.map.call(x.querySelectorAll('input:checked'), function (i) { return i.value; }); put(x.getAttribute('data-a'), v.join(','), !v.length); });
    s.querySelectorAll('.ebk-labs').forEach(function (x) { var on = x.querySelector('input:checked'); put(x.getAttribute('data-a'), on ? on.value : '', !on); });
    s.querySelectorAll('.ebk-sel').forEach(function (x) { put(x.getAttribute('data-a'), x.value, !x.value); });
    return { answers: answers, empty: empty, count: count };
  }
  function find(root, id) { return root.querySelector('[data-a="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]'); }
  function mark(root, results) {
    (results || []).forEach(function (r) {
      var el = find(root, r.id); if (!el) return;
      var cls = r.ok ? 'ok' : r.got ? 'part' : 'bad';
      var box = el.closest('.ebk-gapw,.ebk-pick,.ebk-opts,.ebk-labs,.ebk-selw') || el;
      box.classList.remove('ok', 'bad', 'part'); box.classList.add(cls, 'done');
      if (el.classList.contains('ebk-gap') || el.classList.contains('ebk-sel')) {
        el.disabled = true; el.classList.add(cls);
        var k = box.querySelector('.ebk-key'); if (k && !r.ok) { k.hidden = false; k.textContent = r.answers.join(' / '); }
      } else if (el.classList.contains('ebk-pick')) {
        el.querySelectorAll('.ebk-pk').forEach(function (b) { b.disabled = true; if (b.getAttribute('data-v') === r.answer) b.classList.add('right'); });
      } else {
        var right = String(r.answer).split(/\s*,\s*/);
        el.querySelectorAll('input').forEach(function (i) { i.disabled = true; });
        el.querySelectorAll('[data-v]').forEach(function (o) { var v = o.getAttribute('data-v'); if (right.indexOf(v) > -1 || right.map(function (x) { return x.toLowerCase(); }).indexOf(v.toLowerCase()) > -1) o.classList.add('right'); });
      }
      var it = el.closest('.ebk-item');
      if (it) {
        it.classList.remove('ok', 'bad'); it.classList.add(r.ok ? 'ok' : 'bad');
        var fb = it.querySelector('.ebk-fb');
        if (fb && r.explain) { fb.hidden = false; fb.textContent = r.explain; }
      }
    });
  }
  function reset(root, t) {
    var s = scope(root, t); if (!s) return;
    s.querySelectorAll('.ok,.bad,.part,.done,.right,.on').forEach(function (x) { x.classList.remove('ok', 'bad', 'part', 'done', 'right', 'on'); });
    s.querySelectorAll('input,select,button.ebk-pk').forEach(function (x) { x.disabled = false; if (x.type === 'radio' || x.type === 'checkbox') x.checked = false; else if (x.tagName === 'INPUT') { x.value = ''; x.style.width = ''; } else if (x.tagName === 'SELECT') x.value = ''; });
    s.querySelectorAll('.ebk-key,.ebk-fb').forEach(function (x) { x.hidden = true; x.textContent = ''; });
  }
  /* the admin's preview: the answers written in */
  function fill(root, key) {
    Object.keys(key || {}).forEach(function (id) {
      var k = key[id]; var el = find(root, id); if (!el) return;
      if (k.k === 'gap') { el.value = k.a[0]; el.style.width = Math.min(24, Math.max(7, el.value.length + 2)) + 'ch'; }
      else if (k.k === 'pick') el.querySelectorAll('.ebk-pk').forEach(function (b) { if (b.getAttribute('data-v') === k.a) b.classList.add('on'); });
      else if (k.k === 'choice') el.querySelectorAll('input').forEach(function (i) { i.checked = k.a.indexOf(i.value) > -1; });
      else if (k.k === 'label') el.querySelectorAll('input').forEach(function (i) { i.checked = i.value.toLowerCase() === String(k.a).toLowerCase() || (i.value === 'TRUE' && k.a === 'True') || (i.value === 'FALSE' && k.a === 'False'); });
      else if (k.k === 'match') el.value = k.a;
    });
  }
  window.IXEbook = { STYLES: STYLES, head: head, page: page, bind: bind, collect: collect, mark: mark, reset: reset, fill: fill };
})();
