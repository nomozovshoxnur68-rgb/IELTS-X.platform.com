'use strict';
/* ====
   ai-generator.js -- the AI Test Generator of the admin panel (admin.html#ai, admin-ai.js).

     GET  /api/admin/ai/status       is the AI set up?  { configured, provider, model, problem, storage, limits }
     POST /api/admin/ai/transcribe   a recording uploaded in the panel -> transcript segments with times (Listening)
     POST /api/admin/ai/generate     passage(s) / transcript (+ the questions found in the source) -> question groups

   Nothing is saved here. The answer is the question-group format of the admin form (admin-content.js: the same groups the
   PDF import fills), so the admin reviews it in the normal form and saves it as a Draft or publishes it from there; the
   server's cleanMaterialData() checks it again on saving.

   What the AI may do, and how it is checked:
     * the passage text is NOT rewritten: it is the text the panel read from the PDF (only a scanned PDF is read by the AI);
     * questions that came with the source are kept word for word ("source"); the AI writes answers / explanations for them
       and checks the answers that the answer key already gives (a disagreement is a warning, the key is not changed);
     * questions the AI writes itself are marked "ai";
     * every answer must come with the words of the source that prove it ("evidence"): they are looked up in the
       passage / transcript here, and a question whose evidence is not found is marked "check";
     * an answer the source does not decide is left empty (the form will not save it until the admin fills it in).
   Listening questions are checked against the transcript (the AI's own transcript, unless one was pasted), never
   "against the audio".
   ==== */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const provider = require('./ai-provider');
const { AiError } = provider;

const TYPES = {
  reading: { tfng: 'True / False / Not Given', ynng: 'Yes / No / Not Given', mcq: 'Multiple choice (one answer, options A–D)', 'mcq-multi': 'Multiple choice, choose TWO (options A–E)', matching: 'Matching (headings with i, ii, iii… / information / features / sentence endings, options with letters or roman numerals)', short: 'Sentence completion / short answer (words from the passage)', completion: 'Summary / notes / table completion (words from the passage)' },
  listening: { gap: 'Form / notes / sentence completion (words heard, ____ marks the gap)', mcq: 'Multiple choice (one answer, options A–C)', 'mcq-multi': 'Multiple choice, choose TWO (options A–E)', matching: 'Matching (a list of options A–F, each question is an item)', box: 'Completion from a word box (options are the words)' }
};
const DIFFICULTY = { 'band-5': 'IELTS band 5–5.5 (easier)', 'band-6': 'IELTS band 6–6.5', 'band-7': 'IELTS band 7–7.5', 'band-8': 'IELTS band 8–9 (hardest)' };
const SHARED = ['matching', 'box', 'map'];
const AUDIO_MIME = { '.mp3': 'audio/mp3', '.wav': 'audio/wav', '.m4a': 'audio/m4a', '.aac': 'audio/aac', '.ogg': 'audio/ogg' };   // the audio types of https://ai.google.dev/gemini-api/docs/audio
const MAX_AUDIO = () => Math.max(1, Number(process.env.AI_MAX_AUDIO_MB) || 60) * 1024 * 1024;
const MAX_PDF = 30 * 1024 * 1024;

const cut = (v, n) => String(v == null ? '' : v).slice(0, n);
const str = (v, n) => cut(v, n).replace(/\u0000/g, '').trim();
const norm = (s) => String(s || '').toLowerCase().replace(/[‘’ʼ`]/g, "'").replace(/[“”]/g, '"').replace(/[^\p{L}\p{N}']+/gu, ' ').replace(/\s+/g, ' ').trim();
const letters = (a) => String(a || '').toUpperCase().split(/[^A-Z]+/).filter(Boolean);
const ROMAN = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i;

/* ───────── what the model must answer (Gemini responseSchema) ───────── */
const Q_ITEM = { type: 'object', properties: {
  prompt: { type: 'string', description: 'the question / statement / item; ____ marks the gap of a completion question' },
  options: { type: 'array', items: { type: 'string' }, description: 'multiple choice only: the options, each starting with its letter, e.g. "A. the price"' },
  answer: { type: 'string', description: 'the correct answer; empty if the source does not decide it' },
  explanation: { type: 'string', description: 'one or two sentences: why, and where in the text' },
  evidence: { type: 'string', description: 'the exact words of the source that prove the answer (copied, at most 30 words)' },
  origin: { type: 'string', enum: ['source', 'ai'], description: '"source" if the question is printed in the source, "ai" if you wrote it' },
  time: { type: 'number', description: 'listening only: second of the recording where the answer is heard, if known' }
}, required: ['prompt', 'answer', 'explanation', 'evidence', 'origin'] };
const GROUP = (types) => ({ type: 'object', properties: {
  type: { type: 'string', enum: types },
  section: { type: 'integer', description: 'reading: passage number (1–3); listening: part number (1–4)' },
  instruction: { type: 'string', description: 'the instruction of this block, as in an IELTS paper' },
  options: { type: 'array', items: { type: 'string' }, description: 'matching / word box: the list of options, each with its letter or roman numeral, e.g. "A. teachers" or "iv. A new approach"' },
  questions: { type: 'array', items: Q_ITEM }
}, required: ['type', 'section', 'instruction', 'questions'] });
const SCHEMA = {
  generate: (skill) => ({ type: 'object', properties: { groups: { type: 'array', items: GROUP(Object.keys(TYPES[skill])) }, warnings: { type: 'array', items: { type: 'string' } } }, required: ['groups'] }),
  scanned: { type: 'object', properties: { passages: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, text: { type: 'string' } }, required: ['text'] } }, groups: { type: 'array', items: GROUP(Object.keys(TYPES.reading)) }, warnings: { type: 'array', items: { type: 'string' } } }, required: ['passages', 'groups'] },
  complete: { type: 'object', properties: { answers: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, answer: { type: 'string' }, explanation: { type: 'string' }, evidence: { type: 'string' }, time: { type: 'number' } }, required: ['id', 'answer', 'explanation', 'evidence'] } }, warnings: { type: 'array', items: { type: 'string' } } }, required: ['answers'] },
  transcribe: { type: 'object', properties: { segments: { type: 'array', items: { type: 'object', properties: { start: { type: 'number', description: 'seconds from the start of the file' }, part: { type: 'integer', description: 'IELTS part 1–4 if the recording says so, else 0' }, speaker: { type: 'string' }, text: { type: 'string' } }, required: ['start', 'speaker', 'text'] } }, warnings: { type: 'array', items: { type: 'string' } } }, required: ['segments'] }
};

const SYSTEM = [
  'You are an experienced IELTS examiner and test writer. You work ONLY from the source material you are given.',
  'Rules:',
  '1. Every answer must be supported by the source. Put the exact words of the source that prove it in "evidence" (copied character for character, at most 30 words).',
  '2. If the source does not clearly decide an answer, leave "answer" empty and say why in "explanation". Never guess.',
  '3. Questions, options and instructions printed in the source are copied word for word and marked origin "source". Questions you write yourself are marked origin "ai".',
  '4. Completion / short-answer answers are words copied from the source and respect the word limit of the instruction (write "NO MORE THAN TWO WORDS" etc. in the instruction). Put ____ where the gap is.',
  '5. True/False/Not Given answers are TRUE, FALSE or NOT GIVEN; Yes/No/Not Given answers are YES, NO or NOT GIVEN. Use NOT GIVEN only when the source really says nothing about it.',
  '6. Multiple choice: options start with their letter ("A. ..."), the answer is the letter. Choose TWO: the answer is two letters, e.g. "A,C". Matching: the answer is the letter or roman numeral of an option in the group\'s option list.',
  '7. Explanations: one or two short sentences in plain English that say why and where (paragraph / speaker).',
  '8. Questions follow the order of the information in the source, the way an IELTS paper does. Do not reveal answers in the questions.',
  '9. Answer with JSON only, exactly in the requested schema.'
].join('\n');

/* ───────── input checks ───────── */
const clampInt = (v, lo, hi, d) => { const n = Math.floor(Number(v)); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
function cleanInput(b) {
  b = b && typeof b === 'object' ? b : {};
  const skill = b.skill === 'listening' ? 'listening' : b.skill === 'reading' ? 'reading' : null;
  if (!skill) throw new AiError(400, 'Choose Reading or Listening.', 'input');
  const mode = b.mode === 'full' ? 'full' : 'part';
  const maxQ = mode === 'full' ? 40 : skill === 'listening' ? 10 : 20;
  const out = {
    skill, mode, title: str(b.title, 200), difficulty: DIFFICULTY[b.difficulty] ? b.difficulty : 'band-6',
    count: clampInt(b.count, 1, maxQ, mode === 'full' ? 40 : skill === 'listening' ? 10 : 13),
    types: (Array.isArray(b.types) ? b.types : []).filter((t) => TYPES[skill][t]).slice(0, 10),
    task: ['generate', 'complete'].includes(b.task) ? b.task : 'generate'
  };
  if (!out.types.length) out.types = skill === 'reading' ? ['tfng', 'mcq', 'matching', 'short'] : ['gap', 'mcq'];
  const sections = mode === 'full' ? (skill === 'listening' ? 4 : 3) : 1;
  out.passages = (Array.isArray(b.passages) ? b.passages : []).slice(0, 3).map((p) => ({ title: str(p && p.title, 200), text: str(p && p.text, 25000) })).filter((p) => p.text);
  if (out.passages.reduce((n, p) => n + p.text.length, 0) > 60000) throw new AiError(413, 'The passages are too long (60,000 characters at most).', 'size');
  out.transcript = (Array.isArray(b.transcript) ? b.transcript : []).slice(0, 1500).map((s) => ({ start: Math.max(0, Number(s && s.start) || 0), part: clampInt(s && s.part, 0, 4, 0), speaker: str(s && s.speaker, 40), text: str(s && s.text, 1000) })).filter((s) => s.text);
  out.transcriptText = str(b.transcriptText, 60000);
  out.groups = (Array.isArray(b.groups) ? b.groups : []).slice(0, 60).map((g) => ({
    type: str(g && g.type, 20), section: clampInt(g && (g.section || g.passage), 1, sections, 1), instruction: str(g && (g.instruction || g.group), 400),
    options: (Array.isArray(g && g.options) ? g.options : []).slice(0, 20).map((o) => str(o, 300)).filter(Boolean),
    items: (Array.isArray(g && g.items) ? g.items : []).slice(0, 60).map((it) => ({ prompt: str(it && it.prompt, 1000), options: (Array.isArray(it && it.options) ? it.options : []).slice(0, 10).map((o) => str(o, 300)).filter(Boolean), answer: str(it && it.answer, 300), explanation: str(it && it.explanation, 1500), evidence: str(it && it.evidence, 600) })).filter((it) => it.prompt)
  })).filter((g) => g.items.length);
  out.pdfUrl = str(b.pdfUrl, 1000);
  if (skill === 'reading' && !out.passages.length && !out.pdfUrl) throw new AiError(400, 'Upload the PDF or paste the passage first.', 'input');
  if (skill === 'listening' && !out.transcript.length && !out.transcriptText) throw new AiError(400, 'Transcribe the recording (or paste its transcript) first.', 'input');
  if (out.task === 'complete' && !out.groups.length) out.task = 'generate';
  return out;
}

/* a file the admin uploaded in this panel (local uploads/ or the site's Supabase Storage bucket); never any other address */
async function ownFile(url, kind, ctx) {
  const u = String(url || '').trim(); const ext = path.extname(u.split(/[?#]/)[0]).toLowerCase();
  const okExt = kind === 'audio' ? ctx.AUDIO_EXT.includes(ext) : ctx.PDF_EXT.includes(ext);
  if (!okExt) throw new AiError(400, kind === 'audio' ? 'Use an MP3, WAV, M4A, AAC or OGG recording.' : 'Use a PDF file.', 'input');
  const max = kind === 'audio' ? MAX_AUDIO() : MAX_PDF;
  const big = () => new AiError(413, `The file is larger than ${Math.round(max / 1048576)} MB. ${kind === 'audio' ? 'Upload one section of the recording.' : 'Use a smaller PDF.'}`, 'size');
  let m = /^\/uploads\/(audio|pdf)\/([^/?#]+)$/.exec(u);
  if (m && m[1] === kind) {
    const f = path.resolve(ctx.UPLOAD_DIR, m[1], decodeURIComponent(m[2]));
    if (!f.startsWith(path.resolve(ctx.UPLOAD_DIR) + path.sep) || !fs.existsSync(f)) throw new AiError(404, 'The uploaded file was not found. Upload it again.', 'input');
    if (fs.statSync(f).size > max) throw big();
    return { data: fs.readFileSync(f), ext, name: path.basename(f) };
  }
  const base = ctx.SUPABASE_URL ? `${ctx.SUPABASE_URL}/storage/v1/object/public/${ctx.MEDIA_BUCKET}/${kind}/` : '';
  if (base && u.startsWith(base) && !u.slice(base.length).includes('..')) {
    let r; try { r = await fetch(u); } catch (e) { throw new AiError(502, 'The uploaded file could not be read from storage.', 'storage'); }
    if (!r.ok) throw new AiError(404, 'The uploaded file was not found in storage. Upload it again.', 'storage');
    if (Number(r.headers.get('content-length') || 0) > max) throw big();
    const data = Buffer.from(await r.arrayBuffer()); if (data.length > max) throw big();
    return { data, ext, name: decodeURIComponent(u.slice(base.length)).slice(0, 100) };
  }
  throw new AiError(400, 'Upload the file in this panel first: links to other websites are not fetched.', 'input');
}

/* ───────── prompts ───────── */
const mmss = (s) => { s = Math.max(0, Math.round(Number(s) || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const transcriptText = (inp) => (inp.transcript.length ? inp.transcript.map((s) => `[${mmss(s.start)}]${s.part ? ' (Part ' + s.part + ')' : ''} ${s.speaker ? s.speaker + ': ' : ''}${s.text}`).join('\n') : inp.transcriptText);
function sourceBlock(inp) {
  if (inp.skill === 'listening') return 'TRANSCRIPT OF THE RECORDING' + (inp.transcript.length ? ' ([m:ss] = time in the recording)' : '') + ':\n' + transcriptText(inp);
  return inp.passages.map((p, i) => `READING PASSAGE ${i + 1}${p.title ? ': ' + p.title : ''}\n${p.text}`).join('\n\n');
}
function generatePrompt(inp) {
  const R = inp.skill === 'reading'; const sections = inp.mode === 'full' ? (R ? 3 : 4) : 1;
  const types = inp.types.map((t) => `- ${t}: ${TYPES[inp.skill][t]}`).join('\n');
  return [
    `Write exactly ${inp.count} IELTS ${R ? 'Academic Reading' : 'Listening'} questions for the ${R ? 'passage' + (sections > 1 ? 's' : '') : 'recording'} below.`,
    `Difficulty: ${DIFFICULTY[inp.difficulty]}.`,
    `Use these question types, in blocks (groups) of 2–6 consecutive questions of one type, the way a real IELTS paper does:\n${types}`,
    sections > 1 ? (R ? 'There are three passages: write about a third of the questions for each passage and set "section" to the passage number.' : 'The recording has four parts: write about ten questions per part and set "section" to the part number (1–4).') : 'Set "section" to 1.',
    R ? 'Matching headings need paragraphs labelled A, B, C… in the passage; if the paragraphs have no letters, use another type.' : 'Listening answers to completion questions are at most three words or a number, exactly as heard; add "time" (seconds) when the transcript gives times.',
    'All questions are written by you: origin "ai".',
    '', sourceBlock(inp)
  ].join('\n');
}
function completePrompt(inp, ids) {
  const qs = inp.groups.map((g, gi) => `GROUP ${gi + 1} — type ${g.type}, ${inp.skill === 'reading' ? 'passage' : 'part'} ${g.section}${g.instruction ? '\nInstruction: ' + g.instruction : ''}${g.options.length ? '\nOptions: ' + g.options.join(' | ') : ''}\n` +
    g.items.map((it, ii) => `${ids[gi][ii]}: ${it.prompt}${it.options.length ? '\n   ' + it.options.join('\n   ') : ''}${it.answer ? '\n   (answer key says: ' + it.answer + ')' : ''}`).join('\n')).join('\n\n');
  return [
    'Below are the questions printed in the source and the source itself. Do NOT change, add or remove questions.',
    'For every question id give: the correct answer, a short explanation and the evidence (exact words of the source).',
    'Where the answer key already gives an answer, check it against the source: give the answer you find, and if it differs say so in the explanation.',
    'If the source does not decide an answer, leave it empty and say why.',
    '', 'QUESTIONS:', qs, '', sourceBlock(inp)
  ].join('\n');
}

/* ───────── checking the answer against the source, and turning it into the form's groups ───────── */
function normAnswer(type, a) {
  a = String(a == null ? '' : a).trim(); const A = a.toUpperCase().replace(/[\s_-]+/g, ' ');
  if (type === 'tfng') return ({ T: 'TRUE', TRUE: 'TRUE', F: 'FALSE', FALSE: 'FALSE', NG: 'NOT GIVEN', 'NOT GIVEN': 'NOT GIVEN' })[A] || A;
  if (type === 'ynng') return ({ Y: 'YES', YES: 'YES', N: 'NO', NO: 'NO', NG: 'NOT GIVEN', 'NOT GIVEN': 'NOT GIVEN' })[A] || A;
  if (type === 'mcq') return letters(a)[0] || '';
  if (type === 'mcq-multi') return letters(a).join(',');
  if (type === 'matching' || type === 'map') return ROMAN.test(a) ? a.toLowerCase() : (/^[A-Za-z]$/.test(a) ? a.toUpperCase() : a);
  return a;
}
const optLetter = (o, i) => { const m = /^\s*([A-Za-z]{1,4})\s*[.)]\s+/.exec(o); return m ? m[1] : String.fromCharCode(65 + i); };
const withLetters = (opts) => opts.map((o, i) => (/^\s*[A-Za-z]{1,4}\s*[.)]\s+/.test(o) ? o.trim() : String.fromCharCode(65 + i) + '. ' + o.trim()));
function wordLimit(instr) {
  const t = String(instr || '').toUpperCase(); const W = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4 };
  let m = /\b(ONE|TWO|THREE|FOUR) WORDS? ONLY\b/.exec(t) || /NO MORE THAN (ONE|TWO|THREE|FOUR) WORDS?/.exec(t);
  return m ? W[m[1]] : 0;
}
/* checks one question; returns the warnings (and sets it.verified) */
function check(type, it, group, src, num) {
  const w = []; const q = 'Q' + num;
  const a = it.answer;
  if (!a) { w.push(`${q}: no answer — the source does not decide it; fill it in or remove the question.`); it.verified = false; return w; }
  if (type === 'tfng' && !['TRUE', 'FALSE', 'NOT GIVEN'].includes(a)) w.push(`${q}: the answer must be TRUE, FALSE or NOT GIVEN.`);
  if (type === 'ynng' && !['YES', 'NO', 'NOT GIVEN'].includes(a)) w.push(`${q}: the answer must be YES, NO or NOT GIVEN.`);
  if (type === 'mcq' || type === 'mcq-multi') {
    const ls = it.options.map(optLetter).map((x) => x.toUpperCase());
    if (it.options.length < 2) w.push(`${q}: multiple choice without options.`);
    else if (letters(a).some((x) => !ls.includes(x))) w.push(`${q}: answer ${a} is not one of the options.`);
    if (type === 'mcq-multi' && letters(a).length < 2) w.push(`${q}: "choose TWO" needs two letters.`);
  }
  if (SHARED.includes(type) && group.options.length) {
    const toks = group.options.map(optLetter).map((x) => x.toLowerCase());
    if (type === 'box') { if (!group.options.some((o) => norm(o).endsWith(norm(a)))) w.push(`${q}: answer “${a}” is not one of the words of the box.`); }
    else if (!toks.includes(a.toLowerCase())) w.push(`${q}: answer “${a}” is not in the option list.`);
  }
  const typed = ['short', 'completion', 'gap'].includes(type);
  if (typed) {
    const lim = wordLimit(group.instruction); const words = a.split('|')[0].trim().split(/\s+/).filter(Boolean).length;
    if (lim && words > lim) w.push(`${q}: “${a}” has ${words} words; the instruction allows ${lim}.`);
    if (!a.split('|').some((x) => norm(x) && src.includes(norm(x)))) w.push(`${q}: the answer “${a}” is not in the ${src.kind || 'source'} word for word.`);
  }
  // the proof: the quoted words must really be in the passage / transcript
  const ev = norm(it.evidence);
  it.verified = !!ev && ev.length >= 3 && src.includes(ev) && !(typed && w.some((x) => x.includes('word for word')));
  if (!ev) w.push(`${q}: no evidence quoted — check the answer.`);
  else if (!src.includes(ev)) w.push(`${q}: the quoted evidence was not found in the ${src.kind || 'source'} — check the answer.`);
  return w;
}
/* model groups -> the form's groups, checked */
function adaptGroups(inp, groups, srcText) {
  const allowed = TYPES[inp.skill]; const sections = inp.mode === 'full' ? (inp.skill === 'listening' ? 4 : 3) : 1;
  const src = norm(srcText); const S = { includes: (x) => src.includes(x), kind: inp.skill === 'listening' ? 'transcript' : 'passage' };
  const warnings = []; const out = []; let num = inp.skill === 'listening' && inp.mode !== 'full' ? 1 : 1;
  (Array.isArray(groups) ? groups : []).forEach((g) => {
    if (!g || typeof g !== 'object') return;
    let type = String(g.type || '').trim();
    if (inp.skill === 'listening' && (type === 'short' || type === 'completion')) type = 'gap';
    if (inp.skill === 'reading' && type === 'gap') type = 'short';
    if (!allowed[type]) { warnings.push(`A group of type “${cut(type, 30)}” was left out (not a ${inp.skill} question type).`); return; }
    const shared = SHARED.includes(type);
    const grp = { type, passage: clampInt(g.section, 1, sections, 1), group: str(g.instruction, 300), blockTitle: '', options: shared ? withLetters((Array.isArray(g.options) ? g.options : []).map((o) => str(o, 300)).filter(Boolean)).slice(0, 20) : [], items: [] };
    if (type === 'box') grp.options = (Array.isArray(g.options) ? g.options : []).map((o) => str(o, 120).replace(/^\s*[A-Za-z]\s*[.)]\s+/, '')).filter(Boolean).slice(0, 20);
    (Array.isArray(g.questions) ? g.questions : []).slice(0, 60).forEach((q) => {
      if (!q || typeof q !== 'object' || !str(q.prompt, 1000)) return;
      const it = { prompt: str(q.prompt, 1000), options: (type === 'mcq' || type === 'mcq-multi') ? withLetters((Array.isArray(q.options) ? q.options : []).map((o) => str(o, 300)).filter(Boolean)).slice(0, 10) : [],
        answer: normAnswer(type, str(q.answer, 300)), explanation: str(q.explanation, 1500), evidence: str(q.evidence, 600), title: '', origin: q.origin === 'source' ? 'source' : 'ai' };
      if (inp.skill === 'listening' && Number.isFinite(Number(q.time)) && Number(q.time) > 0) it.at = Math.round(Number(q.time));
      check(type, it, { options: grp.options, instruction: grp.group }, S, num).forEach((x) => warnings.push(x));
      num += type === 'mcq-multi' ? Math.max(2, letters(it.answer).length) : 1;
      grp.items.push(it);
    });
    if (grp.items.length) out.push(grp);
  });
  return { groups: out, warnings };
}
/* the questions of the source + the model's answers -> the form's groups (questions unchanged) */
function mergeComplete(inp, ans, ids, srcText) {
  const src = norm(srcText); const S = { includes: (x) => src.includes(x), kind: inp.skill === 'listening' ? 'transcript' : 'passage' };
  const byId = {}; (Array.isArray(ans) ? ans : []).forEach((a) => { if (a && a.id) byId[String(a.id)] = a; });
  const warnings = []; let num = 1;
  const groups = inp.groups.map((g, gi) => {
    const type = (TYPES[inp.skill][g.type] || g.type === 'map') ? g.type : (inp.skill === 'listening' ? 'gap' : 'short');
    const grp = { type, passage: g.section, group: g.instruction, blockTitle: '', options: g.options, items: [] };
    g.items.forEach((it0, ii) => {
      const a = byId[ids[gi][ii]] || {};
      const key = normAnswer(type, it0.answer); const ai = normAnswer(type, str(a.answer, 300));
      const it = { prompt: it0.prompt, options: it0.options, answer: key || ai, explanation: it0.explanation || str(a.explanation, 1500), evidence: it0.evidence || str(a.evidence, 600), title: '', origin: 'source' };
      if (inp.skill === 'listening' && Number(a.time) > 0) it.at = Math.round(Number(a.time));
      if (key && ai && key.toLowerCase() !== ai.toLowerCase()) warnings.push(`Q${num}: the answer key says “${key}”, the AI found “${ai}” — check it (the key's answer is kept).`);
      if (!byId[ids[gi][ii]]) warnings.push(`Q${num}: the AI did not answer this question.`);
      check(type, it, { options: g.options, instruction: g.instruction }, S, num).forEach((x) => warnings.push(x));
      num += type === 'mcq-multi' ? Math.max(2, letters(it.answer).length) : 1;
      grp.items.push(it);
    });
    return grp;
  });
  return { groups, warnings };
}

/* ───────── the mock provider's answers (AI_PROVIDER=mock): placeholder questions with the right shape ───────── */
function sentences(text) { return String(text || '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-Z])/).map((s) => s.trim()).filter((s) => s.split(' ').length >= 6 && s.length < 300); }
const MOCK = {
  generate: (inp) => () => {
    const src = inp.skill === 'listening' ? (inp.transcript.length ? inp.transcript.map((s) => s.text).join(' ') : inp.transcriptText) : inp.passages.map((p) => p.text).join(' ');
    const ss = sentences(src); const qs = [];
    for (let i = 0; i < inp.count && ss.length; i++) { const s = ss[i % ss.length]; const w = s.replace(/[.!?]$/, '').split(' '); const k = Math.max(1, w.length - 2);
      qs.push(inp.skill === 'listening' ? { prompt: w.slice(0, k).join(' ') + ' ____', answer: w.slice(k).join(' ').replace(/[^\p{L}\p{N}' -]/gu, '').split(' ').slice(0, 2).join(' '), explanation: 'Placeholder (mock AI).', evidence: s.slice(0, 120), origin: 'ai' }
        : { prompt: s, answer: 'TRUE', explanation: 'Placeholder (mock AI): the passage says this.', evidence: s.slice(0, 160), origin: 'ai' }); }
    return { groups: qs.length ? [{ type: inp.skill === 'listening' ? 'gap' : 'tfng', section: 1, instruction: inp.skill === 'listening' ? 'Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.' : 'Do the following statements agree with the information given in the passage?', questions: qs }] : [],
      warnings: ['Mock AI provider: these are placeholder questions, not real AI output. Set AI_PROVIDER=gemini and GEMINI_API_KEY for real generation.'] };
  },
  complete: (inp, ids) => () => ({ answers: inp.groups.flatMap((g, gi) => g.items.map((it, ii) => ({ id: ids[gi][ii], answer: it.answer || '', explanation: it.answer ? 'Placeholder (mock AI): the answer key says so.' : 'Placeholder (mock AI): not decided.', evidence: '' }))),
    warnings: ['Mock AI provider: answers were not checked by an AI.'] }),
  transcribe: () => () => ({ segments: [{ start: 0, part: 0, speaker: 'MOCK', text: 'This is a placeholder transcript from the mock AI provider. The real recording was not listened to.' }], warnings: ['Mock AI provider: no real transcription.'] })
};

/* ───────── one run at a time per admin, the same request answered from the cache ───────── */
const cache = new Map(); const running = new Set(); const HOUR = 3600000;
const keyOf = (o) => crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');
function cached(k) { const v = cache.get(k); if (v && v.at > Date.now() - HOUR) return v.value; cache.delete(k); return null; }
function remember(k, value) { cache.set(k, { at: Date.now(), value }); while (cache.size > 40) cache.delete(cache.keys().next().value); }
async function exclusive(adminId, fn) {
  if (running.has(adminId)) throw new AiError(409, 'A generation is already running. Wait for it to finish.', 'busy');
  running.add(adminId);
  try { return await fn(); } finally { running.delete(adminId); }
}
const limit = (ctx, admin) => { const n = Math.max(1, Number(process.env.AI_HOURLY_LIMIT) || 30); ctx.rateLimit('ai:' + admin.id, n, HOUR); };

/* ───────── the routes (inside the admin block of server.js: the admin is already checked) ───────── */
async function route(req, res, p, method, ctx) {
  const { admin, send } = ctx;
  try {
    if (method === 'GET' && p === '/api/admin/ai/status') {
      const c = provider.configured();
      return send(res, 200, { configured: c.ok, provider: c.provider, model: c.model, mock: !!c.mock, problem: c.problem || '', storage: ctx.USE_SUPABASE ? 'supabase' : ctx.IS_VERCEL ? 'none' : 'disk',
        limits: { maxAudioMb: Math.round(MAX_AUDIO() / 1048576), maxPdfMb: Math.round(MAX_PDF / 1048576), perHour: Math.max(1, Number(process.env.AI_HOURLY_LIMIT) || 30) }, types: TYPES, difficulty: DIFFICULTY }, { 'Cache-Control': 'no-store' });
    }
    if (method === 'POST' && p === '/api/admin/ai/transcribe') {
      const b = await ctx.readJson(req, 64 * 1024);
      const start = Math.max(0, Math.floor(Number(b.audioStart) || 0)), end = Math.max(0, Math.floor(Number(b.audioEnd) || 0));
      const c = provider.configured(); if (!c.ok) throw new AiError(503, c.problem, 'config');
      const f = await ownFile(b.audioUrl, 'audio', ctx);
      const k = keyOf({ t: 'transcribe', model: c.model, h: crypto.createHash('sha256').update(f.data).digest('hex'), start, end });
      const hit = cached(k); if (hit) return send(res, 200, { ...hit, cached: true });
      limit(ctx, admin);
      const result = await exclusive(admin.id, async () => {
        const handle = await provider.uploadFile({ data: f.data, mimeType: AUDIO_MIME[f.ext] || 'audio/mp3', name: f.name });
        try {
          const range = start || end ? ` Transcribe only the part from ${mmss(start)} to ${end ? mmss(end) : 'the end'}.` : '';
          const r = await provider.generateJson({ system: SYSTEM, schema: SCHEMA.transcribe, mock: MOCK.transcribe(), maxOutputTokens: 32768,
            parts: [{ file: handle }, { text: 'Transcribe this IELTS Listening recording word for word, in segments of one speaker turn. Give the start time of each segment in seconds from the beginning of the file, the speaker (e.g. MAN, WOMAN, or a name) and, when the recording announces it, the IELTS part number (1–4).' + range + ' Do not add, correct or summarise anything.' }] });
          const segs = (Array.isArray(r.json.segments) ? r.json.segments : []).slice(0, 1500).map((s) => ({ start: Math.max(0, Math.round(Number(s && s.start) || 0)), part: clampInt(s && s.part, 0, 4, 0), speaker: str(s && s.speaker, 40), text: str(s && s.text, 1000) })).filter((s) => s.text);
          if (!segs.length) throw new AiError(422, 'The AI found no speech in this recording.', 'empty');
          return { segments: segs, warnings: (r.json.warnings || []).map((x) => str(x, 300)).slice(0, 20), note: 'Transcript written by the AI from the audio — read it through before using it.', model: r.model || c.model };
        } finally { await provider.deleteFile(handle); }   // the copy at the AI service is not kept
      });
      remember(k, result);
      await ctx.audit(admin, 'ai.transcribe', cut(f.name, 80), { segments: result.segments.length, model: c.model });
      return send(res, 200, result);
    }
    if (method === 'POST' && p === '/api/admin/ai/generate') {
      const inp = cleanInput(await ctx.readJson(req, 1024 * 1024));
      const c = provider.configured(); if (!c.ok) throw new AiError(503, c.problem, 'config');
      let pdf = null;
      if (inp.skill === 'reading' && !inp.passages.length) pdf = await ownFile(inp.pdfUrl, 'pdf', ctx);   // a scanned PDF: the AI reads it
      const k = keyOf({ t: 'generate', model: c.model, inp: { ...inp, pdfUrl: undefined }, pdf: pdf ? crypto.createHash('sha256').update(pdf.data).digest('hex') : '' });
      const hit = cached(k); if (hit) return send(res, 200, { ...hit, cached: true });
      limit(ctx, admin);
      const result = await exclusive(admin.id, async () => {
        if (pdf) {   // scanned PDF: passages, questions and answers all read by the AI (and marked so)
          const handle = await provider.uploadFile({ data: pdf.data, mimeType: 'application/pdf', name: pdf.name });
          try {
            const r = await provider.generateJson({ system: SYSTEM, schema: SCHEMA.scanned, mock: () => ({ passages: [], groups: [], warnings: ['Mock AI provider: scanned PDFs are not read.'] }), maxOutputTokens: 32768,
              parts: [{ file: handle }, { text: `This PDF is a scanned IELTS ${inp.mode === 'full' ? 'Academic Reading test (up to three passages)' : 'reading passage'}. Copy the passage text exactly as printed (keep paragraph letters A, B, C…; do not shorten). Copy the printed questions, options and instructions word for word (origin "source") and take the answers from the answer key if the PDF has one; otherwise find them in the passage. If the PDF has no questions, write ${inp.count} questions (origin "ai") of these types: ${inp.types.join(', ')}. Difficulty: ${DIFFICULTY[inp.difficulty]}.` }] });
            const passages = (Array.isArray(r.json.passages) ? r.json.passages : []).slice(0, 3).map((x) => ({ title: str(x && x.title, 200), passage: str(x && x.text, 25000) })).filter((x) => x.passage);
            if (!passages.length) throw new AiError(422, 'The AI could not read a passage in this PDF.', 'empty');
            const a = adaptGroups({ ...inp, passages: passages.map((x) => ({ text: x.passage })) }, r.json.groups, passages.map((x) => x.passage).join('\n'));
            return { task: 'scanned', passages, passagesFrom: 'ai', groups: a.groups, warnings: ['The passage text was read from a scanned PDF by the AI: compare it with the original before publishing.'].concat(a.warnings, (r.json.warnings || []).map((x) => str(x, 300))).slice(0, 80), model: r.model || c.model };
          } finally { await provider.deleteFile(handle); }
        }
        const srcText = inp.skill === 'listening' ? (inp.transcript.length ? inp.transcript.map((s) => s.text).join('\n') : inp.transcriptText) : inp.passages.map((x) => x.text).join('\n');
        if (inp.task === 'complete') {
          const ids = inp.groups.map((g, gi) => g.items.map((_, ii) => `g${gi + 1}q${ii + 1}`));
          const r = await provider.generateJson({ system: SYSTEM, schema: SCHEMA.complete, mock: MOCK.complete(inp, ids), parts: [{ text: completePrompt(inp, ids) }] });
          const m = mergeComplete(inp, r.json.answers, ids, srcText);
          return { task: 'complete', groups: m.groups, warnings: m.warnings.concat((r.json.warnings || []).map((x) => str(x, 300))).slice(0, 80), model: r.model || c.model };
        }
        const r = await provider.generateJson({ system: SYSTEM, schema: SCHEMA.generate(inp.skill), mock: MOCK.generate(inp), parts: [{ text: generatePrompt(inp) }] });
        const a = adaptGroups(inp, r.json.groups, srcText);
        if (!a.groups.length) throw new AiError(422, 'The AI did not write any usable question. Try again, or choose other question types.', 'empty');
        return { task: 'generate', groups: a.groups, warnings: a.warnings.concat((r.json.warnings || []).map((x) => str(x, 300))).slice(0, 80), model: r.model || c.model };
      });
      result.stats = stats(result.groups);
      remember(k, result);
      await ctx.audit(admin, 'ai.generate', inp.title || inp.skill, { skill: inp.skill, mode: inp.mode, task: result.task, questions: result.stats.questions, model: c.model });
      return send(res, 200, result);
    }
    throw new ctx.HttpError(404, 'API endpoint not found.');
  } catch (e) {
    if (e instanceof AiError) throw new ctx.HttpError(e.status, e.message);
    throw e;
  }
}
function stats(groups) {
  const its = groups.flatMap((g) => g.items.map((it) => ({ it, w: g.type === 'mcq-multi' ? Math.max(2, letters(it.answer).length) : 1 })));
  const sum = (f) => its.filter((x) => f(x.it)).reduce((n, x) => n + x.w, 0);
  return { questions: sum(() => true), fromSource: sum((it) => it.origin === 'source'), byAi: sum((it) => it.origin === 'ai'), verified: sum((it) => it.verified), noAnswer: sum((it) => !it.answer) };
}

module.exports = { route, cleanInput, adaptGroups, mergeComplete, check, normAnswer, TYPES, SCHEMA };
