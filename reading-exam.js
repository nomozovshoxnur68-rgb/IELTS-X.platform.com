'use strict';
/* ====
   reading-exam.js -- turns a Reading test made in the admin panel into the same
   real-exam page that pessages/test-19, 20 and 21 use (reading.js + reading.css).

   buildExamHtml(material, templateHtml) -> full HTML string.
   The template is pessages/test-19.html; only its data script, its titles and
   its relative paths are replaced. Every question type below is understood by
   reading.js: tfng, ynng, mcq, mcq-multi, notes, matching-info,
   matching-features, matching-headings.
   ==== */

const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const safeUrl = (u) => (/^(\/(uploads|assets)\/[^"'<>\s]*|https:\/\/[^"'<>\s]+)$/i.test(String(u || '')) ? String(u) : '');
const ROMAN = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i;
/* "Questions 1–5" is printed by the player itself, so it is cut off a typed / pasted instruction */
const cleanInstr = (g) => String(g || '').replace(/^\s*(?:questions?|savollar)\s+\d+\s*(?:[-\u2013\u2014]|to|dan)\s*\d+\s*[:.\-\u2013\u2014]?\s*/i, '').trim();

/* ── Evidence for the passage highlight ──
   Each explanation gets `highlights`: the words the student should see lit up in the passage.
   Taken from the question's own "evidence" field, else from the words quoted in the explanation
   ("..." or '...', cut at ellipses). Only phrases really found in the passage are kept, so a typo
   never breaks anything; with none found, the player falls back to the best-matching sentence. */
const normTxt = (t) => String(t || '').replace(/[\u2018\u2019\u201b\u02bc]/g, "'").replace(/[\u201c\u201d\u201f]/g, '"').replace(/[\u2010-\u2015]/g, '-').replace(/\s+/g, ' ').toLowerCase();
function quotedPhrases(text) {
  const t = String(text || '').replace(/\s+/g, ' '); const out = [];
  const re = /["\u201c\u201d]([^"\u201c\u201d]{6,}?)["\u201c\u201d]|(?:^|[\s(\u2014\u2013:-])['\u2018]((?:[^'\u2018\u2019]|['\u2019](?=[a-z]))+?)['\u2019](?=[\s.,;:)!?\u2014\u2013-]|$)/g;
  let m;
  while ((m = re.exec(t))) (m[1] || m[2] || '').split(/\s*(?:\u2026|\.\.\.)\s*/).forEach((f) => {
    f = f.replace(/^[\s,.;:\u2014\u2013-]+|[\s,.;:\u2014\u2013-]+$/g, '');
    if (f.split(/\s+/).length >= 2 && f.length >= 8) out.push(f);
  });
  return out;
}
function evidenceOf(q, passageText) {
  const hay = normTxt(passageText);
  const raw = [].concat(String(q.evidence || '').split(/\n|\s*\|\|\s*/)).map((x) => x.trim()).filter(Boolean);
  const cands = raw.length ? raw.reduce((a, x) => a.concat(x.split(/\s*(?:\u2026|\.\.\.)\s*/)), []) : quotedPhrases(q.explanation);
  return cands.map((x) => x.replace(/^["'\u201c\u2018]+|["'\u201d\u2019]+$/g, '').trim()).filter((x) => x.length >= 4 && hay.includes(normTxt(x)));
}

/* A block of questions ("Questions 1-5 ...") is typed once in the admin panel. Older tests repeated the heading and the option list on every
   question; newer ones carry a group number (gi). Either way: a question that has no heading / no options of its own continues the block above
   when it is the same type, so one block never falls apart into several. */
function inheritGroups(list) {
  const SHARED = ['matching', 'map', 'box'];
  const out = []; let prev = null;
  (Array.isArray(list) ? list : []).forEach((q0) => {
    const q = Object.assign({}, q0 || {});
    const hasGi = q.gi !== undefined && q.gi !== null && q.gi !== '';
    if (prev && prev.type === q.type && (!hasGi || prev.gi === q.gi)) {
      if (!String(q.group || '').trim()) q.group = prev.group || '';
      if (!String(q.blockTitle || '').trim()) q.blockTitle = prev.blockTitle || '';
      if (SHARED.includes(q.type) && !(Array.isArray(q.options) && q.options.length)) q.options = (prev.options || []).slice();
    }
    out.push(q); prev = q;
  });
  return out;
}

/* Paragraphs of a pasted passage. Text copied from a PDF has a line break at the end of every printed
   line (and often no blank line between paragraphs): wrapped lines are joined back into one paragraph,
   and without blank lines a paragraph ends at a clearly short line that ends a sentence. */
function splitParas(text) {
  const src = String(text || '').replace(/\r/g, '').replace(/\f/g, '\n').trim();
  if (!src) return [];
  const ls = src.split('\n').map((l) => l.trim());
  // the printed line width: a high percentile, not the maximum (one very long line must not make every line look short)
  const lens = ls.map((l) => l.length).filter((n) => n > 0).sort((x, y) => x - y);
  const L = Math.max(40, lens.length ? lens[Math.floor(lens.length * 0.9)] : 40);
  const END = /[.!?:"\u201d\u2019)]$/;
  const full = ls.filter(Boolean);
  // typed in by hand: (almost) every line is a whole paragraph
  if (full.length && full.filter((l) => END.test(l)).length / full.length > 0.6) return full.map((l) => l.replace(/\s+/g, ' '));
  // copied from a PDF: wrapped lines. A paragraph ends at a blank line or a clearly short line that ends a
  // sentence; a blank line in the middle of a sentence is a page break and is ignored.
  const paras = []; let cur = [];
  const close = () => { if (cur.length) paras.push(cur); cur = []; };
  ls.forEach((t) => {
    if (!t) { if (cur.length && END.test(cur[cur.length - 1])) close(); return; }
    if (!cur.length && t.length < 0.6 * L && !END.test(t)) { paras.push([t]); return; }          // a title / sub-heading line
    if (cur.length && /^[A-Z][.)]?\s+[A-Z\u201c"\u2018']/.test(t) && END.test(cur[cur.length - 1])) close();
    cur.push(t);
    if (t.length < 0.75 * L && END.test(t)) close();
  });
  close();
  // join wrapped lines with a space; keep a real line break only after a short line (lists, addresses)
  return paras.map((lines) => lines.filter(Boolean).reduce((acc, l, i, arr) => acc + (i ? (arr[i - 1].length < 0.6 * L ? '\n' : ' ') : '') + l, '').trim()).filter(Boolean);
}

function passageHtml(d, title) {
  const imgs = (d.images || []).map((i) => safeUrl(i.url)).filter(Boolean)
    .map((u) => `<p><img class='pass-img' alt='' src='${esc(u)}'></p>`).join('');
  const list = splitParas(d.passage).filter((p, i) => !(i === 0 && p.toLowerCase() === String(title || '').trim().toLowerCase()));
  // Paragraph letters: "A. text", "A) text" or, as printed in PDFs, "A Text". A bare "A " only counts as a
  // letter where a run A, B, C … really starts (so "A newborn baby…" is not taken for paragraph A).
  const LET = /^([A-Z])(?:[.)]\s+|\s+(?=[A-Z0-9\u201c"\u2018'(]))([\s\S]*)$/;
  const lettered = new Set();
  let start = list.findIndex((p, i) => { const a = LET.exec(p), b = list[i + 1] && LET.exec(list[i + 1]); return a && a[1] === 'A' && b && b[1] === 'B'; });
  if (start < 0) start = list.findIndex((p) => /^A[.)]\s+/.test(p));
  if (start >= 0) { let want = 65; for (let i = start; i < list.length; i++) { const m = LET.exec(list[i]); if (m && m[1].charCodeAt(0) === want) { lettered.add(i); want++; } } }
  const paras = list.map((p, i) => {
    const m = lettered.has(i) ? LET.exec(p) : null;
    if (m) return `<p><strong class="para-letter">${m[1]}</strong> ${esc(m[2]).replace(/\n/g, '<br>')}</p>`;
    return i === 0 && p.length < 160 && !/[.!?]$/.test(p) ? `<p><em>${esc(p)}</em></p>` : `<p>${esc(p).replace(/\n/g, '<br>')}</p>`;
  }).join('');
  return `<div>${imgs}${paras}</div>`;
}

const tfWord = (v, yn) => {
  const g = String(v || '').trim().toLowerCase();
  if (/^n(ot)?\s*g|^ng$|not\s*given/.test(g)) return 'NOT GIVEN';
  if (yn) return /^y/.test(g) ? 'YES' : 'NO';
  return /^t/.test(g) ? 'TRUE' : 'FALSE';
};
const optTok = (o, i) => { const m = /^\s*([A-Za-z0-9]{1,5})[.):]\s+([\s\S]*)$/.exec(String(o || '')); return m ? { l: m[1], t: m[2] } : { l: String.fromCharCode(65 + i), t: String(o || '') }; };

function buildSections(questions, startN) {
  questions = inheritGroups(questions);
  const sections = []; let n = startN || 1; let cur = null; let key = '';
  const headings = []; const slots = [];
  const defaultTitle = { notes: 'Completion', tfng: 'True / False / Not Given', ynng: 'Yes / No / Not Given', mcq: 'Multiple Choice', 'matching-info': 'Matching Information', 'matching-features': 'Matching', 'matching-headings': 'Matching Headings' };
  const defaultInstr = {
    notes: 'Complete the answers below. Write <b>NO MORE THAN THREE WORDS</b> from the passage for each answer.',
    tfng: 'Do the following statements agree with the information given in the passage? Choose <b>TRUE</b>, <b>FALSE</b> or <b>NOT GIVEN</b>.',
    ynng: 'Do the following statements agree with the views of the writer? Choose <b>YES</b>, <b>NO</b> or <b>NOT GIVEN</b>.',
    mcq: 'Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.',
    'matching-info': 'Which paragraph contains the following information? Write the correct letter in the boxes.',
    'matching-features': 'Match each statement with the correct option. Write the correct letter in the boxes.',
    'matching-headings': 'Choose the correct heading for each paragraph from the list of headings below.'
  };
  const open = (type, q, extra) => {
    const gi = (q.gi === undefined || q.gi === null || q.gi === '') ? '' : String(q.gi);
    const k = type + '|' + gi + '|' + (q.group || '') + '|' + (extra || '');
    if (cur && k === key) return cur;
    cur = { type, num: '', title: defaultTitle[type] || 'Questions', instruction: cleanInstr(q.group) ? esc(cleanInstr(q.group)) : (defaultInstr[type] || ''), items: [] };
    key = k; sections.push(cur); return cur;
  };
  for (const q of questions) {
    const t = q.type;
    if (t === 'tfng' || t === 'ynng') {
      open(t, q).items.push({ id: n, answer: tfWord(q.answer, t === 'ynng'), label: esc(q.prompt) }); n += 1;
    } else if (t === 'mcq') {
      open('mcq', q).items.push({ id: n, answer: String(q.answer || 'A').trim().charAt(0).toUpperCase(), label: esc(q.prompt), options: (q.options || []).map((o, i) => { const k = optTok(o, i); return k.l + '. ' + esc(k.t); }) }); n += 1;
    } else if (t === 'mcq-multi') {
      const letters = String(q.answer || '').toUpperCase().split(/[^A-Z]+/).filter(Boolean);
      const sec = { type: 'mcq-multi', gid: 'g' + n, num: '', title: 'Choose ' + (letters.length === 2 ? 'TWO' : letters.length) + ' answers', instruction: cleanInstr(q.group) ? esc(cleanInstr(q.group)) : 'Choose the correct letters.', prompt: esc(q.prompt),
        options: (q.options || []).map((o, i) => { const k = optTok(o, i); return { l: String.fromCharCode(65 + i), t: esc(k.t) }; }), items: [] };
      (letters.length ? letters : ['A']).forEach((l) => { sec.items.push({ id: n, answer: l }); n += 1; });
      sections.push(sec); cur = null; key = '';
    } else if (t === 'matching' || t === 'map') {
      const toks = (q.options || []).map(optTok);
      if (toks.length && toks.every((k) => ROMAN.test(k.l)) && t === 'matching') {
        if (!headings.length) toks.forEach((k) => headings.push({ id: k.l.toLowerCase(), text: esc(k.t) }));
        const m = /^(?:paragraph\s*)?([A-Z])\b/i.exec(String(q.prompt || '').trim());
        slots.push({ letter: m ? m[1].toUpperCase() : String.fromCharCode(64 + slots.length + 1), qNum: n });
        open('matching-headings', q).items.push({ id: n, answer: String(q.answer || '').trim().toLowerCase() }); n += 1;
      } else if (toks.length && toks.every((k) => k.t.length <= 1 || k.t === k.l)) {
        const sec = open('matching-info', q, JSON.stringify(toks.map((k) => k.l)));
        sec.options = toks.map((k) => k.l);
        sec.items.push({ id: n, answer: String(q.answer || '').trim().toUpperCase(), label: esc(q.prompt) }); n += 1;
      } else {
        const sec = open('matching-features', q, JSON.stringify(toks));
        sec.bankLabel = sec.bankLabel || 'List of options'; sec.people = toks.map((k) => ({ l: k.l, name: esc(k.t) }));
        sec.items.push({ id: n, answer: String(q.answer || '').trim().toUpperCase(), label: esc(q.prompt) }); n += 1;
      }
    } else {   // short / completion
      const parts = String(q.prompt || '').split(/_{2,}|\.{4,}|…{2,}/);
      const sec = open('notes', q); sec.wordLimit = sec.wordLimit || 3;
      sec.items.push({ id: n, answer: String(q.answer || ''), label: esc((parts[0] || '').trim()), after: esc(parts.slice(1).join(' ').trim()) }); n += 1;
    }
  }
  return { sections, headings, slots, total: n - 1 };
}

const isFull = (material) => !!(material && material.data && material.data.mode === 'full');

/* The passages of a test: one for a "part" test, three for a "full" test. Pictures and questions
   carry the number of the passage they belong to (default 1). */
function passagesOf(material) {
  const d = material.data || {};
  const imgs = Array.isArray(d.images) ? d.images : [];
  if (!isFull(material)) return [{ no: 1, title: material.title, text: d.passage, images: imgs }];
  const ps = Array.isArray(d.passages) ? d.passages : [];
  return [1, 2, 3].map((i) => {
    const p = ps[i - 1] || {};
    return { no: i, title: String(p.title || '').trim() || (String(p.passage || '').trim() ? material.title + ' \u2014 Passage ' + i : ''),
      text: p.passage, images: imgs.filter((im) => (Number(im && im.passage) || 1) === i) };
  });
}

function buildData(material) {
  const d = material.data || {};
  const full = isFull(material);
  const qs = Array.isArray(d.questions) ? d.questions : [];
  const SECTIONS = { 1: [], 2: [], 3: [] }; const PASSAGES = {}; const VOCAB = {}; const ordered = []; const passText = {};
  let last = 0;
  passagesOf(material).forEach((ps) => {
    const mine = qs.filter((q) => (full ? (Number(q.passage) || 1) : 1) === ps.no);
    mine.forEach((q) => { passText[ordered.length + mine.indexOf(q)] = String(ps.text || ''); });
    if (full && !mine.length && !String(ps.text || '').trim()) return;           // an empty passage is simply left out
    const b = buildSections(mine, last + 1); last = b.total;
    SECTIONS[ps.no] = b.sections; ordered.push(...mine);
    const passage = { title: esc(ps.title || material.title), content: passageHtml({ images: ps.images, passage: ps.text }, ps.title || material.title) };
    if (b.headings.length) { passage.headings = b.headings; passage.headingSlots = b.slots; }
    PASSAGES[ps.no] = passage;
    VOCAB[ps.no] = { passageTitle: passage.title, words: [] };
  });
  // explanation per question number (numbers follow passage order, exactly as the sections above)
  const expl = {}; let n = 1;
  ordered.forEach((q, k) => {
    const span = q.type === 'mcq-multi' ? Math.max(1, String(q.answer || '').split(/[^A-Za-z]+/).filter(Boolean).length) : 1;
    const hl = (q.explanation || q.evidence) ? evidenceOf(q, passText[k]) : [];
    for (let i = 0; i < span; i++, n++) if (q.explanation || hl.length) expl[n] = { explanation: esc(q.explanation || ''), highlights: hl, paraphraseMap: [], en: esc(q.explanation || ''), uz: '' };
  });
  const dflt = full ? 60 : 20;
  return { full, SECTIONS, PASSAGES, VOCAB, expl, total: last || 1, minutes: Math.max(1, Math.min(180, Number(d.durationMin) || dflt)) };
}

function buildExamHtml(material, templates) {
  const b = buildData(material);
  const tpl = typeof templates === 'string' ? { part: templates, full: templates } : (templates || {});
  const template = b.full ? tpl.full : tpl.part;
  if (!template) throw new Error('Reading template is missing (' + (b.full ? 'full' : 'part') + ').');
  const key = 'ieltsx_reading_' + String(material.id).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);
  const json = (o) => JSON.stringify(o, null, 1).replace(/</g, '\\u003c').replace(/\u2028|\u2029/g, '');
  const script = 'window.READING_TEST = (function () {\n'
    + 'const STORAGE_KEY = ' + JSON.stringify(key) + ';\nconst QTOTAL = ' + b.total + ';\nconst PONLY = 1;\n'
    + 'const SECTIONS = ' + json(b.SECTIONS) + ';\n'
    + 'const PASSAGES = ' + json(b.PASSAGES) + ';\n'
    + 'const VOCABULARY_DATA = ' + json(b.VOCAB) + ';\n'
    + 'const READING_EXPLANATIONS = ' + json(b.expl) + ';\n'
    + 'return { STORAGE_KEY: STORAGE_KEY, QTOTAL: QTOTAL, PONLY: PONLY, MINUTES: ' + b.minutes + ', FINISH_URL: ' + JSON.stringify(b.full ? '/full-tests/reading/' : '/part/practice/reading') + ', SECTIONS: SECTIONS, PASSAGES: PASSAGES, VOCABULARY_DATA: VOCABULARY_DATA,\n'
    + '         READING_EXPLANATIONS: READING_EXPLANATIONS };\n})();\n';
  let html = String(template);
  const start = html.indexOf('window.READING_TEST = (function');
  const end = html.indexOf('</script>', start);
  if (start < 0 || end < 0) throw new Error('Reading template is missing its data script.');
  html = html.slice(0, start) + script + html.slice(end);
  const title = esc(material.title);
  if (b.full) {   // pessages-style full paper (template: full-tests/reading/test-1.html)
    html = html.split('Full Reading Test 8').join(title).split('[Demo] Test 8 - ').join('[Demo] ' + title + ' - ');
  } else {        // single passage (template: pessages/test-19.html)
    html = html.split('Dark Chocolate&rsquo;s Health-giving Benefits - P2').join(title + ' - P1')
      .split('Dark Chocolate&rsquo;s Health-giving Benefits').join(title).split('Dark Chocolate\u2019s Health-giving Benefits').join(title);
  }
  html = html.replace(/(href|src)="(?:\.\.\/)+/g, '$1="/');
  return html;
}

module.exports = { buildExamHtml, buildData, isFull, inheritGroups };
