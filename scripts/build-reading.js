#!/usr/bin/env node
/*
 * IELTSX — builds hand-made Reading test pages from ONE simple source file each.
 *
 *   node scripts/build-reading.js                   (every file in reading-src/)
 *   node scripts/build-reading.js reading-src/volume-9/test-3.js
 *   npm run build:reading
 *
 * A source file is a plain JS object (see reading-src/README.md for every question type):
 *
 *   module.exports = {
 *     out: 'full-tests/reading/test-v9-1.html',       // the page that is written
 *     title: 'Volume 9 · Full Test 1', no: 1,          // name on the start card; number on the certificate
 *     finish: '/full-tests/reading/volume-9',          // where "Finish" goes
 *     passages: [ { title: 'The Baobabs of Madagascar', text: `…paragraphs, one per blank line…` }, … ],
 *     groups: [
 *       { p: 1, type: 'tfng', items: [ { q: 'All of the species…', a: 'FALSE', en: 'Explanation "quoted words"', uz: 'Izoh' } ] },
 *       { p: 1, type: 'notes', title: 'Baobabs under threat', limit: 1,
 *         lines: ['## Morondava area', '- trees may be falling because of {{}} from nearby fields'],
 *         items: [ { a: 'irrigation', en: '…', uz: '…' } ] },
 *       …
 *     ]
 *   };
 *
 * Everything else is automatic: question numbers 1–40, "Questions 1–6" headings, the standard instructions
 * (with the right word limit), the TRUE/FALSE key, the explanation panels (English + O‘zbekcha) and the
 * passage highlight of every explanation — taken from `ev` or from the words "quoted" in `en`. The build
 * checks that every highlight really is in the passage, that there are 40 questions and every answer is
 * valid, and prints what to fix. The page itself is the normal reading engine (reading.js / reading.css).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEMPLATE = 'full-tests/reading/test-2.html';
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv'];
const WORDS = { 1: 'ONE WORD ONLY', 2: 'NO MORE THAN TWO WORDS', 3: 'NO MORE THAN THREE WORDS',
  '1n': 'ONE WORD AND/OR A NUMBER', '2n': 'NO MORE THAN TWO WORDS AND/OR A NUMBER', '3n': 'NO MORE THAN THREE WORDS AND/OR A NUMBER' };
const range = (a, b) => (a === b ? String(a) : a + '&ndash;' + b);
const NUMW = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const letters = (n) => 'ABCDEFGHIJKLMNOP'.slice(0, n).split('');

/* ---------- passages ---------- */
function paragraphs(p) {
  if (Array.isArray(p.paragraphs)) return p.paragraphs;
  return String(p.text || '').replace(/\r/g, '').split(/\n\s*\n/).map((x) => x.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
}
/* one passage -> the HTML the engine shows. "A text" paragraphs get the bold letter when `lettered`,
   "## Sub-heading" lines become a bold line, "* note" a small footnote. */
function passageHtml(p) {
  const out = [];
  if (p.subtitle) out.push(`<p><em>${esc(p.subtitle)}</em></p>`);
  let want = 65;
  const list = paragraphs(p);
  // lettering starts at the "A …" paragraph that is followed by a "B …" one ("A newborn baby…" is not paragraph A)
  const LET = /^([A-Z])\s+([\s\S]+)$/;
  const start = p.lettered ? list.findIndex((t, i) => /^A\s/.test(t) && list[i + 1] && /^B\s/.test(list[i + 1])) : -1;
  list.forEach((t, i) => {
    let m;
    if ((m = /^##\s*(.+)$/.exec(t))) { out.push(`<p class="pass-sub"><strong>${esc(m[1])}</strong></p>`); return; }
    if ((m = /^\*\s+(.+)$/.exec(t))) { out.push(`<p class="pass-foot"><small>* ${esc(m[1])}</small></p>`); return; }
    if (start >= 0 && i >= start && (m = LET.exec(t)) && m[1].charCodeAt(0) === want) {
      want++; out.push(`<p><strong class="para-letter">${m[1]}</strong> ${esc(m[2])}</p>`); return;
    }
    out.push(`<p>${esc(t)}</p>`);
  });
  return `<div>${out.join('')}</div>`;
}
const flatText = (p) => [p.subtitle || ''].concat(paragraphs(p)).join(' ');

/* ---------- evidence ---------- */
const norm = (t) => String(t || '').replace(/[‘’‛ʼ]/g, "'").replace(/[“”‟]/g, '"')
  .replace(/[‐-―]/g, '-').replace(/\s+/g, ' ').toLowerCase();
function quoted(text) {
  const t = String(text || '').replace(/\s+/g, ' '); const out = []; let m;
  const re = /["“”]([^"“”]{6,}?)["“”]|(?:^|[\s(—–:-])['‘]((?:[^'‘’]|['’](?=[a-z]))+?)['’](?=[\s.,;:)!?—–-]|$)/g;
  while ((m = re.exec(t))) (m[1] || m[2] || '').split(/\s*(?:…|\.\.\.)\s*/).forEach((f) => {
    f = f.replace(/^[\s,.;:—–-]+|[\s,.;:—–-]+$/g, '');
    if (f.split(/\s+/).length >= 2 && f.length >= 8) out.push(f);
  });
  return out;
}

/* ---------- one test ---------- */
function build(spec, file) {
  const problems = []; const warn = (m) => problems.push(m);
  const SECTIONS = { 1: [], 2: [], 3: [] }; const PASSAGES = {}; const VOCAB = {}; const EXPL = {};
  (spec.passages || []).forEach((p, i) => {
    PASSAGES[i + 1] = { title: esc(p.title), content: passageHtml(p) };
    VOCAB[i + 1] = { passageTitle: esc(p.title), words: [] };
  });
  let n = 0;
  const explain = (id, it, p) => {
    const en = String(it.en || '').trim(), uz = String(it.uz || '').trim();
    if (!en) warn('Q' + id + ': no explanation');
    const hay = norm(flatText(spec.passages[p - 1] || {}));
    const cand = it.ev ? [].concat(it.ev) : quoted(en);
    const hl = []; cand.forEach((c) => { c = String(c).trim(); if (!c) return; if (hay.includes(norm(c))) hl.push(c); else if (it.ev) warn('Q' + id + ': evidence not found in passage ' + p + ': "' + c.slice(0, 60) + '"'); });
    if (!hl.length && !/^not given/i.test(String(it.a || '')) && !it.noEv) warn('Q' + id + ': nothing to highlight (put the passage words in "quotes" in en, or ev)');
    EXPL[id] = {
      explanation: esc(en) + (uz ? '<div style="margin-top:9px;padding-top:8px;border-top:1px solid rgba(0,0,0,.14);"><b>Oʻzbekcha:</b> ' + esc(uz) + '</div>' : ''),
      highlights: hl, paraphraseMap: [], en: esc(en), uz: esc(uz)
    };
  };
  (spec.groups || []).forEach((g, gi) => {
    const p = g.p || 1; const from = n + 1; const items = g.items || [];
    const where = 'group ' + (gi + 1) + ' (' + g.type + ')';
    const sec = { type: g.type, num: '', title: '', instruction: '', items: [] };
    const span = g.type === 'mcq-multi' ? String((items[0] || {}).a || '').split(/[^A-Z]+/).filter(Boolean).length : items.length;
    const to = n + span;
    const R = range(from, to); const P = 'Reading Passage ' + p;
    const W = WORDS[g.limit] || WORDS[1];
    const DEF = {
      tfng: `Do the following statements agree with the information given in ${P}? In boxes ${R} on your answer sheet, write`,
      ynng: `Do the following statements agree with the claims of the writer in ${P}? In boxes ${R} on your answer sheet, write`,
      mcq: `Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>. Write the correct letter in boxes ${R} on your answer sheet.`,
      notes: `Complete the notes below. Choose <b>${W}</b> from the passage for each answer. Write your answers in boxes ${R} on your answer sheet.`,
      summary: `Complete the summary below. Choose <b>${W}</b> from the passage for each answer. Write your answers in boxes ${R} on your answer sheet.`,
      table: `Complete the table below. Choose <b>${W}</b> from the passage for each answer. Write your answers in boxes ${R} on your answer sheet.`,
      sentence: `Complete the sentences below. Choose <b>${W}</b> from the passage for each answer. Write your answers in boxes ${R} on your answer sheet.`,
      short: `Answer the questions below. Choose <b>${W}</b> from the passage for each answer. Write your answers in boxes ${R} on your answer sheet.`
    };
    sec.instruction = g.instruction ? String(g.instruction).replace(/\{R\}/g, R) : (DEF[g.type] || '');
    if (g.title) sec.noteTitle = esc(g.title);
    if (g.limit) sec.wordLimit = parseInt(g.limit, 10) || 0;

    if (g.type === 'tfng' || g.type === 'ynng') {
      const ok = g.type === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'];
      items.forEach((it) => { const id = ++n; if (!ok.includes(it.a)) warn('Q' + id + ': answer must be ' + ok.join('/')); sec.items.push({ id, answer: it.a, label: esc(it.q) }); explain(id, it, p); });
    } else if (g.type === 'mcq') {
      items.forEach((it) => { const id = ++n; const L = letters((it.opts || []).length);
        if (!L.includes(it.a)) warn('Q' + id + ': answer ' + it.a + ' is not an option');
        sec.items.push({ id, answer: it.a, label: esc(it.q), options: (it.opts || []).map((o, k) => L[k] + '. ' + esc(o)) }); explain(id, it, p); });
    } else if (g.type === 'mcq-multi') {
      const it = items[0]; const L = letters((it.opts || []).length); const ans = String(it.a).split(/[^A-Z]+/).filter(Boolean).sort();
      sec.gid = 'g' + (n + 1); sec.prompt = esc(it.q); sec.options = (it.opts || []).map((o, k) => ({ l: L[k], t: esc(o) }));
      sec.instruction = g.instruction ? sec.instruction : `Choose <b>${['', '', 'TWO', 'THREE', 'FOUR'][ans.length]}</b> letters, <b>A&ndash;${L[L.length - 1]}</b>. Write the correct letters in boxes ${R} on your answer sheet.`;
      ans.forEach((a) => { const id = ++n; if (!L.includes(a)) warn('Q' + id + ': answer ' + a + ' is not an option'); sec.items.push({ id, answer: a }); explain(id, it, p); });
    } else if (g.type === 'headings') {
      sec.type = 'matching-headings';
      const hs = (g.headings || []).map((t, k) => ({ id: ROMAN[k], text: esc(t) }));
      sec.instruction = g.instruction ? sec.instruction : `${P} has ${NUMW[items.length] || items.length} paragraphs. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, <b>i&ndash;${ROMAN[hs.length - 1]}</b>, in boxes ${R} on your answer sheet.`;
      PASSAGES[p].headings = hs; PASSAGES[p].headingSlots = [];
      items.forEach((it) => { const id = ++n; if (!hs.some((h) => h.id === it.a)) warn('Q' + id + ': heading ' + it.a + ' is not in the list');
        PASSAGES[p].headingSlots.push({ letter: it.para, qNum: id }); sec.items.push({ id, answer: it.a }); explain(id, it, p); });
    } else if (g.type === 'matching-info') {
      const L = letters(g.count || 7); sec.options = L;
      sec.instruction = g.instruction ? sec.instruction : `${P} has ${NUMW[L.length]} paragraphs, <b>A&ndash;${L[L.length - 1]}</b>. Which paragraph contains the following information? Write the correct letter, <b>A&ndash;${L[L.length - 1]}</b>, in boxes ${R} on your answer sheet.` + (g.nb ? ' <b>NB</b> You may use any letter more than once.' : '');
      items.forEach((it) => { const id = ++n; if (!L.includes(it.a)) warn('Q' + id + ': answer ' + it.a + ' out of range'); sec.items.push({ id, answer: it.a, label: esc(it.q) }); explain(id, it, p); });
    } else if (g.type === 'matching-features') {
      const L = letters((g.options || []).length); sec.bankLabel = esc(g.listTitle || 'List of options');
      sec.people = (g.options || []).map((o, k) => ({ l: L[k], name: esc(o) }));
      sec.instruction = g.instruction ? String(g.instruction).replace(/\{R\}/g, R) : `Match each statement with the correct option, <b>A&ndash;${L[L.length - 1]}</b>. Write the correct letter, <b>A&ndash;${L[L.length - 1]}</b>, in boxes ${R} on your answer sheet.` + (g.nb ? ' <b>NB</b> You may use any letter more than once.' : '');
      items.forEach((it) => { const id = ++n; if (!L.includes(it.a)) warn('Q' + id + ': answer ' + it.a + ' out of range'); sec.items.push({ id, answer: it.a, label: esc(it.q) }); explain(id, it, p); });
    } else if (g.type === 'endings') {
      sec.type = 'sentence-endings';
      const L = letters((g.endings || []).length); sec.endings = (g.endings || []).map((t, k) => ({ l: L[k], text: esc(t) }));
      sec.instruction = g.instruction ? sec.instruction : `Complete each sentence with the correct ending, <b>A&ndash;${L[L.length - 1]}</b>, below. Write the correct letter, <b>A&ndash;${L[L.length - 1]}</b>, in boxes ${R} on your answer sheet.`;
      items.forEach((it) => { const id = ++n; if (!L.includes(it.a)) warn('Q' + id + ': answer ' + it.a + ' out of range'); sec.items.push({ id, answer: it.a, stem: esc(it.q) }); explain(id, it, p); });
    } else if (g.type === 'notes' || g.type === 'summary' || g.type === 'table' || g.type === 'wordbank') {
      // {{}} in lines / prose / rows are the gaps, numbered in order
      let k = 0; const tok = (s) => esc(s).replace(/\{\{\}\}/g, () => '{{' + (from + k++) + '}}');
      if (g.lines) sec.lines = g.lines.map(tok);
      if (g.prose) sec.prose = tok(g.prose);
      if (g.type === 'table') { sec.headers = (g.headers || []).map(esc); sec.rows = (g.rows || []).map((r) => r.map(tok)); if (g.title) sec.tableTitle = esc(g.title); delete sec.noteTitle; }
      if (g.type === 'wordbank') {
        const L = letters((g.bank || []).length); sec.bank = (g.bank || []).map((w, j) => ({ id: L[j], word: esc(w) }));
        sec.instruction = g.instruction ? sec.instruction : `Complete the summary using the list of words, <b>A&ndash;${L[L.length - 1]}</b>, below. Write the correct letter, <b>A&ndash;${L[L.length - 1]}</b>, in boxes ${R} on your answer sheet.`;
      }
      if (k !== items.length) warn(where + ': ' + k + ' gaps {{}} but ' + items.length + ' answers');
      items.forEach((it) => { const id = ++n; sec.items.push({ id, answer: it.a, label: '' }); explain(id, it, p); });
    } else if (g.type === 'sentence' || g.type === 'short') {
      items.forEach((it) => { const id = ++n; const parts = String(it.q).split(/_{2,}/);
        sec.items.push({ id, answer: it.a, label: esc(parts[0].trim()), after: esc((parts[1] || '').trim()) }); explain(id, it, p); });
    } else warn(where + ': unknown type');
    if (n !== to && g.type !== 'mcq-multi') warn(where + ': numbering');
    SECTIONS[p].push(sec);
  });
  if (n !== (spec.total || 40)) warn('the test has ' + n + ' questions (expected ' + (spec.total || 40) + ')');

  const key = 'cdi_reading_v3_' + String(spec.key || path.basename(file, '.js')).replace(/[^A-Za-z0-9_]/g, '_') + '_' + (spec.no || 1);
  const json = (o) => JSON.stringify(o, null, 1).replace(/</g, '\\u003c').replace(/\u2028|\u2029/g, '');
  const script = 'window.READING_TEST = (function () {\n'
    + '/* BUILT by scripts/build-reading.js from ' + path.relative(ROOT, file).replace(/\\/g, '/') + ' — edit that file and run "npm run build:reading", not this page. */\n'
    + 'const STORAGE_KEY = ' + JSON.stringify(key) + ';\n'
    + 'const SECTIONS = ' + json(SECTIONS) + ';\n'
    + 'const PASSAGES = ' + json(PASSAGES) + ';\n'
    + 'const VOCABULARY_DATA = ' + json(VOCAB) + ';\n'
    + 'const READING_EXPLANATIONS = ' + json(EXPL) + ';\n'
    + 'return { STORAGE_KEY: STORAGE_KEY, QTOTAL: ' + n + ', MINUTES: ' + (spec.minutes || 60) + ', FINISH_URL: ' + JSON.stringify(spec.finish || '/full-tests/reading/') + ',\n'
    + '         SECTIONS: SECTIONS, PASSAGES: PASSAGES, VOCABULARY_DATA: VOCABULARY_DATA, READING_EXPLANATIONS: READING_EXPLANATIONS };\n})();\n';

  let html = fs.readFileSync(path.join(ROOT, TEMPLATE), 'utf8');
  const a = html.indexOf('window.READING_TEST = (function'); const b = html.indexOf('</script>', a);
  if (a < 0 || b < 0) throw new Error(TEMPLATE + ' has no data script');
  html = html.slice(0, a) + script + html.slice(b);
  const t = esc(spec.title || 'Full Reading Test');
  // '[Demo] Test 9 - ' is in the header (… - P1) and on the start screen (… - Academic Reading)
  html = html.split('Full Reading Test 9').join(t).split('[Demo] Test 9 - ').join('[Demo] ' + t + ' - ');
  const outFile = path.join(ROOT, spec.out);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  return { n, problems, out: spec.out };
}

/* ---------- run ---------- */
function specs(args) {
  if (args.length) return args.map((a) => path.resolve(a));
  const dir = path.join(ROOT, 'reading-src'); const out = [];
  (function walk(d) { if (!fs.existsSync(d)) return; fs.readdirSync(d).forEach((f) => { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.js$/.test(f)) out.push(p); }); })(dir);
  return out.sort();
}
let bad = 0;
specs(process.argv.slice(2)).forEach((f) => {
  delete require.cache[f];
  let r;
  try { r = build(require(f), f); } catch (e) { console.log('  FAILED ' + path.relative(ROOT, f) + ': ' + e.message); bad++; return; }
  console.log((r.problems.length ? '  check ' : '  ok    ') + path.relative(ROOT, f).padEnd(34) + ' -> ' + r.out + '  (' + r.n + ' questions)');
  r.problems.forEach((m) => console.log('          - ' + m));
  if (r.problems.some((m) => !/nothing to highlight/.test(m))) bad++;
});
process.exit(bad ? 1 : 0);
