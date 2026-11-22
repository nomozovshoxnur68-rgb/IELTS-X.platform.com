'use strict';
/*
 * IELTSX — the "book page" format of an e-book unit (ebooks.js). The admin writes a unit as text (Admin → E-books);
 * parse() turns it into BLOCKS that the Books page draws in the look of the chosen book (assets/js/ebook-render.js +
 * assets/css/ebook-book.css) and a KEY of the answers that never leaves the server (ebooks.js checks with it).
 * Server only (BLOCKED_FILES in server.js, PRIVATE in middleware.js).
 *
 *   # Reading | Section 1            a section of the unit (the words after | in the second colour of the book)
 *   # [A] What are collocations?     a lettered section (the "In Use" look)
 *   ## Heading · ### Small heading · paragraphs · - bullets · 1. numbered · > example · ! tip · | a | b | table
 *   **bold** · *italic* · __underlined__ · ==marked==
 *   ::: advice Form completion       an "Exam advice" box, closed by a line ":::"   (also: info = "Exam information",
 *                                    note <title>, passage <title> (a reading text), panel <title>, words = a box of words)
 *   ::: task [1] Match the two parts of these collocations.      a numbered exercise, closed by ":::"
 *       Questions 1-5                the exam box: the lines right after it are its (italic) instructions
 *       Box: rain, wisdom, hair      a box of words
 *       @match · @flow · @tfng · @yng · @labels F, I, N
 *       A first heading …            the options of the whole task (headings, endings, features), before the questions
 *       6 What did she …?            a question; under it: A … B … C … (the right one with *), or " = answer" at the end
 *       [answer|other answer]        a gap the student types in; [=example] a gap filled in as an example
 *       {problem|trouble*}           circle the right word
 *       Why: …                       the explanation of the question above (shown after Check)
 *
 * Every gap, circled word, question with options, label or match is one point (a question with TWO right options: two).
 */

const MAX_TASKS = 120, MAX_SLOTS = 600;
const TFNG = ['TRUE', 'FALSE', 'NOT GIVEN'], YNNG = ['YES', 'NO', 'NOT GIVEN'];
const ALIAS = { t: 'TRUE', true: 'TRUE', f: 'FALSE', false: 'FALSE', ng: 'NOT GIVEN', 'not given': 'NOT GIVEN', notgiven: 'NOT GIVEN', y: 'YES', yes: 'YES', n: 'NO', no: 'NO' };
const BOXES = { advice: 'advice', info: 'info', information: 'info', note: 'note', passage: 'passage', text: 'passage', panel: 'panel', words: 'words', box: 'words' };

const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
/* how answers are compared: case, curly quotes, a full stop at the end and double spaces do not matter */
const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/[‘’`´]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().replace(/[.!?,;:]+$/g, '').trim();
const labelOf = (v) => ALIAS[norm(v)] || '';

/* the inline formatting of a piece of text (no gaps) */
function fmt(s) {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/__([^_\s][^_]*?)__/g, '<u>$1</u>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![\w*])/g, '$1<i>$2</i>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/==([^=]+)==/g, '<mark>$1</mark>')
    .replace(/~~([^~]+)~~/g, '<s>$1</s>');
}
const plain = (s) => fmt(String(s).replace(/\\([[\]{}])/g, '$1'));
/* the cells of a table row: a | inside [a|b] or {a|b} does not end a cell */
function cellsOf(row) {
  const s = row.replace(/^\|/, '').replace(/\|\s*$/, '');
  const out = []; let cur = ''; let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\' && i + 1 < s.length) { cur += c + s[++i]; continue; }
    if (c === '[' || c === '{') depth++;
    else if ((c === ']' || c === '}') && depth) depth--;
    if (c === '|' && !depth) { out.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

function parse(src, opts) {
  opts = opts || {};
  const lines = String(src == null ? '' : src).replace(/\r/g, '').split('\n');
  const key = {}; const errors = []; let taskCount = 0; let slotCount = 0; let points = 0;
  const err = (n, msg) => { if (errors.length < 15) errors.push((n >= 0 ? 'Line ' + (n + 1) + ': ' : '') + msg); };

  /* text with gaps and circled words (inside a task) — every one becomes a slot of the key */
  function inline(s, T, n, inItem) {
    s = String(s);
    if (!T) return plain(s);
    let out = ''; let last = 0; let m;
    const re = /\\([[\]{}])|\[(=?)([^[\]]*)\]|\{([^{}|]*(?:\|[^{}|]*)+)\}/g;
    while ((m = re.exec(s))) {
      out += fmt(s.slice(last, m.index)); last = re.lastIndex;
      if (m[1]) { out += esc(m[1]); continue; }
      if (m[0][0] === '[') {
        const body = m[3].trim();
        if (m[2]) { out += '<span class="ebk-eg">' + esc(body) + '</span>'; continue; }
        const answers = body.split('|').map((a) => a.trim()).filter(Boolean);
        if (!answers.length) { err(n, 'an empty gap [ ]: write its answer inside, e.g. [most important].'); continue; }
        const id = slot(T, { k: 'gap', a: answers.slice(0, 10) }, n);
        if (!id) continue;
        const num = inItem ? 0 : T.qn++;
        out += '<span class="ebk-slot" data-k="gap" data-a="' + id + '"' + (num ? ' data-n="' + num + '"' : '') + '></span>';
      } else {
        const raw = m[4].split('|').map((o) => o.trim());
        const right = raw.filter((o) => /^\*|\*$/.test(o));
        const options = raw.map((o) => o.replace(/^\*\s*|\s*\*$/g, '').trim()).filter(Boolean);
        if (options.length < 2) { err(n, 'circle the right word: give at least two words, e.g. {problem|trouble*}.'); continue; }
        if (right.length !== 1) { err(n, 'circle the right word: mark exactly one word with *, e.g. {problem*|trouble}.'); continue; }
        const id = slot(T, { k: 'pick', a: right[0].replace(/^\*\s*|\s*\*$/g, '').trim(), o: options }, n);
        if (id) out += '<span class="ebk-slot" data-k="pick" data-a="' + id + '" data-o="' + esc(options.join('|')) + '"></span>';
      }
    }
    return out + fmt(s.slice(last));
  }
  function slot(T, entry, n) {
    if (slotCount >= MAX_SLOTS) { err(n, `keep at most ${MAX_SLOTS} questions in one unit.`); return null; }
    const id = T.id + '.' + (T.slots++);
    const pts = entry.k === 'choice' ? entry.a.length : 1;
    key[id] = { ...entry, task: T.id, p: pts };
    T.points += pts; points += pts; slotCount++;
    return id;
  }

  /* paragraphs, lists, tables … (shared by the page, the boxes and the tasks) */
  function textBlocks(list, T, top) {
    const out = []; let i = 0;
    while (i < list.length) {
      const { s: raw, n } = list[i]; const t = raw.trim(); let m;
      if (!t) { i++; continue; }
      if ((m = /^#\s+(.*)$/.exec(t)) && top) {
        let text = m[1].trim(); let letter = '';
        const lm = /^\[([A-Z0-9]{1,2})\]\s*(.*)$/.exec(text); if (lm) { letter = lm[1]; text = lm[2]; }
        const parts = text.split(/\s+\|\s+/);
        out.push({ t: 'sec', letter, html: plain(parts[0]), sub: parts[1] ? plain(parts.slice(1).join(' ')) : '' });
        i++; continue;
      }
      if ((m = /^(#{1,3})\s+(.*)$/.exec(t))) { out.push({ t: m[1].length === 3 ? 'h3' : 'h2', html: inline(m[2], null, n) }); i++; continue; }
      if (/^\|/.test(t)) {
        const rows = []; let head = !T;
        while (i < list.length && /^\|/.test(list[i].s.trim())) {
          const cells = cellsOf(list[i].s.trim());
          if (cells.every((c) => /^:?-{2,}:?$/.test(c))) { if (rows.length === 1) head = true; }
          else rows.push(cells.map((c) => inline(c, T, list[i].n, false)));
          i++;
        }
        out.push({ t: 'table', head: head && rows.length > 1, rows });
        continue;
      }
      if (/^[-*•]\s+/.test(t)) {
        const items = [];
        while (i < list.length && /^[-*•]\s+/.test(list[i].s.trim())) { items.push(inline(list[i].s.trim().replace(/^[-*•]\s+/, ''), T, list[i].n, false)); i++; }
        out.push({ t: 'ul', items }); continue;
      }
      if (!T && /^\d{1,2}[.)]\s+/.test(t)) {
        const items = []; const start = parseInt(t, 10);
        while (i < list.length && /^\d{1,2}[.)]\s+/.test(list[i].s.trim())) { items.push(plain(list[i].s.trim().replace(/^\d{1,2}[.)]\s+/, ''))); i++; }
        out.push({ t: 'ol', start, items }); continue;
      }
      if (/^>\s?/.test(t)) {
        const ex = []; while (i < list.length && /^>\s?/.test(list[i].s.trim())) { ex.push(inline(list[i].s.trim().replace(/^>\s?/, ''), T, list[i].n, false)); i++; }
        out.push({ t: 'eg', html: ex.join('<br>') }); continue;
      }
      if (/^!\s+/.test(t)) { out.push({ t: 'tip', html: inline(t.replace(/^!\s+/, ''), T, n, false) }); i++; continue; }
      const para = [];
      while (i < list.length) {
        const x = list[i].s.trim();
        if (!x || (para.length && /^(#{1,3}\s|\||[-*•]\s|>|!\s)/.test(x)) || (para.length && !T && /^\d{1,2}[.)]\s/.test(x))) break;
        para.push(inline(x, T, list[i].n, false)); i++;
      }
      out.push({ t: 'p', html: para.join('<br>') });
    }
    return out;
  }

  /* one exercise */
  function task(head, body, n0) {
    taskCount++;
    if (taskCount > MAX_TASKS) { err(n0, `keep at most ${MAX_TASKS} exercises in one unit.`); return null; }
    const T = { id: 't' + taskCount, slots: 0, points: 0, qn: 1 };
    const out = { t: 'task', id: T.id, num: '', instr: '', qtitle: '', rubric: [], words: [], options: [], mopts: [], labels: null, legend: '', layout: '', body: [], points: 0 };
    let h = head.trim(); const nm = /^(\d{1,2}(?:\.\d{1,2})?)(?:\s+|$)(.*)$/.exec(h); if (nm) { out.num = nm[1]; h = nm[2]; }
    const instr = h ? [h] : [];
    let mode = ''; let custom = null; const extras = [];
    const parts = [];          // { k: 'item' | 'text' | 'qtitle', … } in their order
    let stage = 'head';        // head → (rubric) → body
    let cur = null; let text = null; let blank = false; let lastItem = null;
    const endText = () => { if (text) { parts.push({ k: 'text', lines: text }); text = null; } };
    const endItem = () => { cur = null; };
    const hasSlot = (s) => /(^|[^\\])\[[^[\]]*\]|\{[^{}]*\|[^{}]*\}/.test(s);
    const prevLetter = () => { if (!lastItem) return ''; if (/^[a-h]$/.test(lastItem.label)) return lastItem.label; const x = /^([a-h])\s/.exec(lastItem.lines[0] || ''); return x ? x[1] : ''; };
    for (const { s: raw, n } of body) {
      const t = raw.trim(); let m;
      if (!t) { blank = true; endItem(); if (stage !== 'body' && stage !== 'head') stage = 'body'; if (text) text.push({ s: '', n }); continue; }
      const wasBlank = blank; blank = false;
      if ((m = /^@\s*(match|flow|tfng|yng|labels?)\b\s*(.*)$/i.exec(t))) {
        const k = m[1].toLowerCase();
        if (k === 'flow') out.layout = 'flow';
        else if (k === 'match') mode = 'match';
        else if (k === 'tfng' || k === 'yng') mode = k;
        else { custom = m[2].split(/[,/;]|\s{2,}/).map((x) => x.trim()).filter(Boolean).slice(0, 8); mode = 'labels'; if (custom.length < 2) err(n, '@labels needs two or more labels, e.g. @labels F, I, N.'); }
        continue;
      }
      if ((m = /^questions?\s+(\d{1,3})\b/i.exec(t)) && t.length < 60 && !hasSlot(t)) {
        endText(); endItem();
        if (!out.qtitle && !parts.some((p) => p.k !== 'qtitle')) out.qtitle = plain(t); else parts.push({ k: 'qtitle', html: plain(t), start: +m[1] });
        if (!parts.length) T.qn = +m[1];
        stage = 'rubric'; continue;
      }
      if ((m = /^(?:box|words)\s*:\s*(.+)$/i.exec(t))) { out.words.push(...m[1].split(/\s*[,;/]\s*|\s{2,}/).map((w) => w.trim()).filter(Boolean).slice(0, 60)); continue; }
      if ((m = /^extra\s*:\s*(.+)$/i.exec(t))) { extras.push(...m[1].split(/\s*[,;]\s*/).map((w) => w.trim()).filter(Boolean)); continue; }
      if ((m = /^(?:why|explain|explanation)\s*:\s*(.+)$/i.exec(t))) { if (lastItem) lastItem.why = m[1].trim(); else err(n, '"Why:" goes right under the question it explains.'); continue; }
      // the options of a question (A … B …), or of the whole task (before its first question)
      if ((m = /^\(?([A-L])[.)]?\s+(\S.*)$/.exec(t))) {
        const L = m[1];
        if (cur && !wasBlank && L === String.fromCharCode(65 + cur.opts.length)) { cur.opts.push({ l: L, s: m[2], n }); continue; }
        if (!cur && !parts.some((p) => p.k === 'item') && L === String.fromCharCode(65 + out.options.length)) { endText(); out.options.push({ l: L, s: m[2], n }); stage = 'body'; continue; }
      }
      // a question: "6 …", "6. …", or a lettered one: "a …" (a, then b …)
      if ((m = /^(\d{1,3})[.)]?\s+(\S.*)$/.exec(t)) || ((m = /^([a-h])[.)]?\s+(\S.*)$/.exec(t)) && (m[1] === 'a' || prevLetter() === String.fromCharCode(m[1].charCodeAt(0) - 1)))) {
        endText(); stage = 'body';
        cur = { k: 'item', label: m[1], lines: [m[2]], opts: [], n, why: '' }; parts.push(cur); lastItem = cur; continue;
      }
      if (cur && !wasBlank && !/^(\||[-*•]\s|>|!\s|#)/.test(t)) { cur.lines.push(t); continue; }
      endItem();
      if (stage === 'head' && !(wasBlank && instr.length) && !hasSlot(t) && !/^(\||[-*•]\s|>|!\s|#)/.test(t) && !parts.length) { instr.push(t); continue; }
      if (stage === 'rubric' && !hasSlot(t) && !/^(\||[-*•]\s|>|!\s|#)/.test(t) && !text) {
        if (parts.length && parts[parts.length - 1].k === 'qtitle') { (parts[parts.length - 1].rubric = parts[parts.length - 1].rubric || []).push(plain(t)); } else out.rubric.push(plain(t));
        continue;
      }
      stage = 'body';
      if (!text) text = [];
      text.push({ s: raw, n });
    }
    endText();
    out.instr = instr.map((x) => plain(x)).join(' ');

    // a single "option" was the start of a sentence
    if (out.options.length === 1) { const o = out.options.pop(); parts.unshift({ k: 'text', lines: [{ s: o.l + ' ' + o.s, n: o.n }] }); }
    for (const p of parts) if (p.k === 'item' && p.opts.length === 1) { p.lines.push(p.opts[0].l + ' ' + p.opts[0].s); p.opts = []; }

    // the answer written after " = "
    for (const p of parts) {
      if (p.k !== 'item') continue;
      let s = p.lines.join(' ');
      const am = /\s=\s*([^=]*?)\s*$/.exec(s);
      p.ans = null; if (am && !/\\=/.test(am[0])) { p.ans = am[1]; s = s.slice(0, am.index); }
      p.text = s;
    }
    // True / False / Not Given or Yes / No / Not Given when every answer is one of them
    const answered = parts.filter((p) => p.k === 'item' && p.ans != null && !p.opts.length);
    if (!mode && answered.length && answered.every((p) => labelOf(p.ans))) mode = answered.some((p) => /^(YES|NO)$/.test(labelOf(p.ans))) ? 'yng' : 'tfng';
    if (mode === 'tfng' || mode === 'yng') { out.labels = mode === 'tfng' ? TFNG : YNNG; out.legend = mode; }
    if (mode === 'labels' && custom && custom.length >= 2) out.labels = custom;
    // the options of a match without letters: every answer once (and the "Extra:" ones), in alphabetical order
    if (mode === 'match' && !out.options.length) {
      const seen = new Map();
      for (const x of [...parts.filter((p) => p.k === 'item' && p.ans).map((p) => p.ans), ...extras]) if (!seen.has(norm(x))) seen.set(norm(x), x.trim());
      out.mopts = [...seen.values()].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
    }
    out.options = out.options.map((o) => ({ l: o.l, html: inline(o.s, null, o.n) }));

    // now the blocks, in their order (the gaps get their numbers here)
    for (const p of parts) {
      if (p.k === 'qtitle') { T.qn = p.start; out.body.push({ t: 'qtitle', html: p.html, rubric: p.rubric || [] }); continue; }
      if (p.k === 'text') {
        if (out.layout === 'flow') p.lines.filter((x) => x.s.trim()).forEach((x) => out.body.push(...textBlocks([x], T, false)));   // a flow-chart: every line is a box
        else out.body.push(...textBlocks(p.lines, T, false));
        continue;
      }
      const n = p.n; const item = { t: 'item', label: p.label, kind: 'plain', html: '' };
      if (p.opts.length >= 2) {
        const right = new Set(p.opts.filter((o) => /^\*|\*$/.test(o.s.trim())).map((o) => o.l));
        if (p.ans) p.ans.toUpperCase().split(/[\s,;/&]+|\band\b/i).filter((x) => /^[A-L]$/.test(x)).forEach((x) => right.add(x));
        if (!right.size) err(n, `question ${p.label}: mark the right option with * (for example "B talking to her colleagues *") or write "= B".`);
        item.kind = 'choice'; item.html = inline(p.text, T, n, true);
        item.opts = p.opts.map((o) => ({ l: o.l, html: inline(o.s.trim().replace(/^\*\s*|\s*\*$/g, ''), null, o.n) }));
        if (right.size) { const id = slot(T, { k: 'choice', a: [...right].sort(), why: p.why }, n); if (id) { item.a = id; item.multi = right.size; } }
      } else if (mode === 'match' && p.ans != null) {
        item.kind = 'match'; item.html = inline(p.text, T, n, true);
        let a = p.ans.trim();
        if (out.options.length) {
          const L = a.toUpperCase();
          if (!out.options.some((o) => o.l === L)) err(n, `question ${p.label}: the answer "${a}" is not one of the options ${out.options[0].l}–${out.options[out.options.length - 1].l}.`);
          a = L;
        }
        const id = slot(T, { k: 'match', a, why: p.why }, n); if (id) item.a = id;
      } else if (p.ans != null && out.labels) {
        const want = out.legend ? labelOf(p.ans) : out.labels.find((l) => norm(l) === norm(p.ans)) || '';
        if (!want || !out.labels.includes(want)) err(n, `question ${p.label}: the answer must be one of ${out.labels.join(', ')}.`);
        item.kind = 'labels'; item.html = inline(p.text, T, n, true);
        const id = slot(T, { k: 'label', a: want || p.ans, why: p.why }, n); if (id) item.a = id;
      } else if (p.ans != null) {
        if (hasSlot(p.text)) err(n, `question ${p.label}: use either [gaps] in the sentence or "= answer" at the end, not both.`);
        const answers = p.ans.split('|').map((a) => a.trim()).filter(Boolean);
        if (!answers.length) err(n, `question ${p.label}: write the answer after "=".`);
        item.html = inline(p.text, T, n, true);
        const id = answers.length ? slot(T, { k: 'gap', a: answers.slice(0, 10), why: p.why }, n) : null;
        if (id) { item.html += ' <span class="ebk-slot" data-k="gap" data-a="' + id + '" data-w="1"></span>'; }
      } else {
        const before = T.slots;
        item.html = inline(p.text, T, n, true);
        if (p.why && T.slots > before) key[T.id + '.' + before].why = p.why;
      }
      out.body.push(item);
    }
    if (mode === 'match' && !out.options.length && out.mopts.length < 2) err(n0, 'a match (@match) needs answers: write " = answer" after every question.');
    out.points = T.points;
    if (!out.instr && !out.qtitle && !out.body.length) err(n0, 'an empty exercise.');
    return out;
  }

  /* the page: sections, text, boxes and tasks */
  const blocks = []; let i = 0; let run = [];
  const flush = () => { if (run.length) { blocks.push(...textBlocks(run, null, true)); run = []; } };
  while (i < lines.length) {
    const t = lines[i].trim(); const m = /^:::\s*([a-z]+)\b\s*(.*)$/i.exec(t);
    if (!m) { if (/^:::\s*$/.test(t)) err(i, 'a ":::" without a box or an exercise to close.'); else run.push({ s: lines[i], n: i }); i++; continue; }
    flush();
    const kind = m[1].toLowerCase(); const rest = m[2].trim(); const start = i; const body = []; i++;
    let closed = false;
    while (i < lines.length) {
      const x = lines[i].trim();
      if (/^:::\s*$/.test(x)) { closed = true; i++; break; }
      if (/^:::\s*[a-z]/i.test(x)) break;
      body.push({ s: lines[i], n: i }); i++;
    }
    if (!closed) err(start, `close "::: ${kind}" with a line ":::".`);
    if (kind === 'task' || kind === 'exercise') { const b = task(rest, body, start); if (b) blocks.push(b); continue; }
    const box = BOXES[kind];
    if (!box) { err(start, `"::: ${kind}" is not known: use task, advice, info, note, passage, panel or words.`); continue; }
    if (box === 'words') { blocks.push({ t: 'box', kind: 'words', title: plain(rest), words: body.map((x) => x.s).join(',').split(/\s*[,;]\s*/).map((w) => w.trim()).filter(Boolean).slice(0, 80) }); continue; }
    let source = '';
    if (box === 'passage') {
      let k = body.length - 1; while (k >= 0 && !body[k].s.trim()) k--;
      if (k >= 0 && /^(?:source\s*:|adapted from\b|from\b)/i.test(body[k].s.trim())) { source = plain(body[k].s.trim().replace(/^source\s*:\s*/i, '')); body.splice(k, 1); }
    }
    blocks.push({ t: 'box', kind: box, title: plain(rest), source, blocks: textBlocks(body, null, false) });
  }
  flush();
  return { blocks, key, points, tasks: taskCount, errors };
}

/* the simple exercises of a unit (Admin → E-books → Exercises) as one task at the end, with the same key */
function legacyTask(exercises, start) {
  const list = Array.isArray(exercises) ? exercises : [];
  const key = {}; let points = 0;
  if (!list.length) return { block: null, key, points };
  const body = list.map((x, n) => {
    const item = { t: 'item', label: String(n + 1), kind: 'plain', html: '' };
    const q = esc(x.q);
    if (x.type === 'choice') {
      item.kind = 'choice'; item.html = q; item.opts = (x.options || []).map((o, k) => ({ l: String.fromCharCode(65 + k), html: esc(o) }));
      const k = (x.options || []).indexOf(x.answer);
      key[x.id] = { k: 'choice', a: [String.fromCharCode(65 + Math.max(0, k))], o: x.options || [], task: 'ex', p: 1, why: x.explain || '' };
      item.a = x.id; item.multi = 1;
    } else if (x.type === 'tfng' || x.type === 'yng') {
      item.kind = 'labels'; item.html = q; item.labels = x.type === 'tfng' ? ['True', 'False', 'Not Given'] : ['Yes', 'No', 'Not Given'];
      key[x.id] = { k: 'label', a: x.answer, task: 'ex', p: 1, why: x.explain || '' }; item.a = x.id;
    } else {
      const s = '<span class="ebk-slot" data-k="gap" data-a="' + esc(x.id) + '" data-w="1"></span>';
      item.html = /_{2,}/.test(q) ? q.replace(/_{2,}/, s).replace(/_{2,}/g, '_____') : q + ' ' + s;
      key[x.id] = { k: 'gap', a: String(x.answer || '').split('|').filter(Boolean), task: 'ex', p: 1, why: x.explain || '' };
    }
    points += 1;
    return item;
  });
  return { block: { t: 'task', id: 'ex', num: '', legacy: true, instr: '', qtitle: '', rubric: [], words: [], options: [], mopts: [], labels: null, legend: '', layout: '', body, points }, key, points };
}

/* is the answer given for one slot right? */
function isRight(k, given) {
  if (given == null) return false;
  if (k.k === 'choice') {
    let v = Array.isArray(given) ? given : String(given).split(/[\s,]+/);
    v = v.map((x) => String(x).trim()).filter(Boolean);
    if (k.o && v.length === 1 && !/^[A-L]$/i.test(v[0])) { const i = k.o.findIndex((o) => norm(o) === norm(v[0])); v = i > -1 ? [String.fromCharCode(65 + i)] : []; }
    const set = new Set(v.map((x) => x.toUpperCase()));
    if (k.a.length === 1) return set.size === 1 && set.has(k.a[0]);
    // two right options: one point for each (a wrong extra option takes one away)
    return Math.max(0, k.a.filter((x) => set.has(x)).length - Math.max(0, set.size - k.a.length));
  }
  const g = norm(Array.isArray(given) ? given[0] : given);
  if (!g) return false;
  if (k.k === 'gap') return k.a.some((a) => norm(a) === g);
  if (k.k === 'label') { const want = labelOf(k.a) || k.a; return norm(labelOf(g) || g) === norm(want); }
  return norm(k.a) === g;
}
/* the answer to show after Check */
function shown(k) {
  if (k.k === 'gap') return k.a.join(' / ');
  if (k.k === 'choice') return k.a.join(', ');
  return String(k.a);
}

module.exports = { parse, legacyTask, isRight, shown, norm, TFNG, YNNG };
