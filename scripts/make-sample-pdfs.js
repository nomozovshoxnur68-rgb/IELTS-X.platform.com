'use strict';
/*
 * Writes the sample test PDFs of the admin panel (assets/samples/*.pdf):  npm run build:samples
 *
 * One PDF per form of the admin panel (Reading / Listening / Writing / Speaking, Part and Full). Each is laid out like a
 * printed IELTS test, with no marks for the importer: "Questions 1–5" headings, the instructions, numbered questions,
 * options, gaps (1 ……), an ANSWERS section with explanations, an Audioscript for listening, model answers for writing.
 * "Fill from a PDF" in the admin panel reads them into the form; they show the layout a teacher's own PDF should have.
 * The texts are written for IELTSX (not taken from any book). No packages: a small PDF writer (Helvetica, WinAnsi).
 */
const fs = require('fs');
const path = require('path');

/* ───────── a tiny PDF writer ───────── */
const W = { ' ': 278, '!': 278, '"': 355, '#': 556, $: 556, '%': 889, '&': 667, "'": 191, '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278, ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556, '@': 1015, '[': 278, '\\': 278, ']': 278, '^': 469, _: 556, '`': 333, '{': 334, '|': 260, '}': 334, '~': 584,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  '–': 556, '—': 1000, '‘': 222, '’': 222, '“': 333, '”': 333, '•': 350, '…': 1000, '£': 556, '°': 400, 'é': 556 };
const WIN = { '–': 0x96, '—': 0x97, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95, '…': 0x85, '£': 0xa3, '°': 0xb0, 'é': 0xe9 };
const width = (s, size, bold) => [...String(s)].reduce((n, c) => n + (W[c] || (/\d/.test(c) ? 556 : 556)), 0) * size / 1000 * (bold ? 1.06 : 1);
const pdfStr = (s) => { let out = ''; for (const c of String(s)) { const code = WIN[c] || c.charCodeAt(0); const ch = code > 255 ? '?' : String.fromCharCode(code); out += ch === '\\' || ch === '(' || ch === ')' ? '\\' + ch : ch; } return '(' + out + ')'; };

class Doc {
  constructor() { this.pages = []; this.newPage(); }
  newPage() { this.cur = []; this.pages.push(this.cur); this.y = 790; }
  need(h) { if (this.y - h < 50) this.newPage(); }
  text(x, y, s, size = 11, bold = false) { this.cur.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)} Tm ${pdfStr(s)} Tj ET`); }
  gfx(op) { this.cur.push(op); }
  /* a line at the left margin (or x), the cursor moves down */
  line(s, { size = 11, bold = false, x = 56, gap } = {}) { this.need(size + 4); this.text(x, this.y, s, size, bold); this.y -= gap || size * 1.45; }
  space(h = 8) { this.y -= h; }
  wrap(s, size, maxW) {
    const out = []; let cur = '';
    String(s).split(/\s+/).filter(Boolean).forEach((w) => { const t = cur ? cur + ' ' + w : w; if (width(t, size) > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
    if (cur) out.push(cur); return out;
  }
  /* a paragraph (wrapped); `label` = the paragraph letter in the margin */
  para(s, { size = 11, x = 56, w = 483, label = '', after = 9 } = {}) {
    const lines = this.wrap(s, size, w);
    lines.forEach((l, i) => { this.need(size + 4); if (i === 0 && label) this.text(x - 30, this.y, label, size, true); this.text(x, this.y, l, size); this.y -= size * 1.45; });
    this.y -= after;
  }
  heading(s, size = 13) { this.space(6); this.line(s, { size, bold: true, gap: size * 1.6 }); }
  /* several short pieces on one line at fixed columns (option lists, answer keys) */
  cols(items, colW, { size = 11, x = 56 } = {}) { this.need(size + 4); items.forEach((t, i) => this.text(x + i * colW, this.y, t, size)); this.y -= size * 1.55; }
  box(lines, { size = 11, pad = 8 } = {}) {   // a framed box (list of headings, word box, cue card)
    const h = lines.length * size * 1.45 + pad * 2; this.need(h + 6);
    const top = this.y + size; this.gfx(`0.4 w 56 ${(top - h).toFixed(1)} 483 ${h.toFixed(1)} re S`);
    this.y -= pad; lines.forEach((l) => { this.text(66, this.y, l, size); this.y -= size * 1.45; }); this.y -= pad + 6;
  }
  save(file) {
    const objs = []; const add = (s) => { objs.push(s); return objs.length; };
    const f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const pagesId = objs.length + 1; objs.push(null);
    const kids = this.pages.map((ops) => {
      const body = ops.join('\n'); const c = add(`<< /Length ${Buffer.byteLength(body, 'latin1')} >>\nstream\n${body}\nendstream`);
      return add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${c} 0 R >>`);
    });
    objs[pagesId - 1] = `<< /Type /Pages /Kids [${kids.map((k) => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
    const cat = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
    let out = '%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'; const offs = [];
    objs.forEach((o, i) => { offs.push(Buffer.byteLength(out, 'latin1')); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const xref = Buffer.byteLength(out, 'latin1');
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('');
    out += `trailer\n<< /Size ${objs.length + 1} /Root ${cat} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    fs.writeFileSync(file, Buffer.from(out, 'latin1'));
  }
}
/* question helpers */
const q = (d, n, text) => d.para(text, { label: String(n), x: 80, w: 459, after: 3 });
const opts = (d, list) => list.forEach((o, i) => d.para(o, { label: String.fromCharCode(65 + i), x: 104, w: 435, after: 1 }));
const gap = (n) => n + ' ……………';
const answers = (d, rows) => {          // a row = one "N answer — explanation" line, or an array printed in columns (a key in columns)
  d.heading('ANSWERS');
  rows.forEach((r) => (Array.isArray(r) ? d.cols(r, 483 / r.length) : d.para(r, { after: 2 })));
};
const inRows = (list, n) => { const out = []; for (let i = 0; i < list.length; i += n) out.push(list.slice(i, i + n)); return out; };
const tfngKey = (d, yn) => { const w = yn ? ['YES', 'NO', 'NOT GIVEN'] : ['TRUE', 'FALSE', 'NOT GIVEN']; const m = yn ? ['if the statement agrees with the claims of the writer', 'if the statement contradicts the claims of the writer', 'if it is impossible to say what the writer thinks about this'] : ['if the statement agrees with the information', 'if the statement contradicts the information', 'if there is no information on this']; w.forEach((x, i) => d.cols([x, m[i]], 90)); d.space(4); };

/* ───────── READING ───────── */
const GLASS = [
  ['A', 'Long before people learned to make it, they used glass that nature had made. Obsidian, a black glass that forms when lava cools very quickly, was chipped into knives and arrowheads more than ten thousand years ago. Because it breaks into pieces with extremely sharp edges, it was valued so highly that it was carried and traded hundreds of kilometres from the volcanoes where it was found.'],
  ['B', 'The first glass made by people appeared in Mesopotamia around 3500 BC, probably as a by-product of metalworking or pottery. For many centuries it was used only for small objects such as beads and the shiny coating on clay pots. Making a vessel was slow and costly: workers wrapped hot glass around a core of sand and clay, and then scraped the core out once the glass had cooled.'],
  ['C', 'Everything changed in the first century BC, when craftsmen on the eastern coast of the Mediterranean discovered that glass could be blown. By blowing air through a metal pipe into a small ball of molten glass, a worker could form a thin bottle in minutes. Glass became cheap enough for ordinary households, and the Romans spread the technique to every corner of their empire.'],
  ['D', 'In medieval Europe, glassmakers were both admired and controlled. In Venice the industry was moved to the island of Murano in 1291, officially to protect the city from fire. The move also kept the secrets of the trade in one place: skilled workers were treated as important citizens, but they were not allowed to leave the republic.'],
  ['E', 'Clear window glass remained a luxury until the nineteenth century. Early panes were made by spinning a disc of glass, which left them thick in the middle and uneven at the edges. In 1959, the British engineer Alastair Pilkington introduced the float process, in which molten glass is poured onto a bath of liquid tin. The result is a perfectly flat sheet, and almost all window glass is still made this way today.'],
  ['F', 'Today glass is found in places its first makers could never have imagined. Thin strands of glass fibre carry most of the world’s internet traffic as pulses of light, and scientists are developing glass that can store data for thousands of years. Yet the basic recipe has hardly changed: sand, soda and lime, heated until they melt.']
];
function readingPart(file) {
  const d = new Doc();
  d.line('READING PASSAGE 1', { size: 13, bold: true });
  d.line('You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.', { size: 10 });
  d.space(6); d.line('A Short History of Glass', { size: 16, bold: true, gap: 26 });
  GLASS.forEach(([l, t]) => d.para(t, { label: l, x: 80, w: 459 }));
  d.newPage();
  d.heading('Questions 1–4');
  d.line('Do the following statements agree with the information given in Reading Passage 1?', { size: 11 });
  d.line('In boxes 1–4 on your answer sheet, write', { size: 11 }); tfngKey(d, false);
  q(d, 1, 'Obsidian was traded far from the places where it was found.');
  q(d, 2, 'The first man-made glass was produced deliberately by potters.');
  q(d, 3, 'Glass blowing made glass objects affordable for ordinary families.');
  q(d, 4, 'Venetian glassworkers were paid more than other craftsmen.');
  d.heading('Questions 5–8');
  d.line('Reading Passage 1 has six paragraphs, A–F.'); d.line('Which paragraph contains the following information?'); d.line('Write the correct letter, A–F, in boxes 5–8 on your answer sheet.'); d.space(4);
  q(d, 5, 'a modern use of glass that the earliest makers would not have expected');
  q(d, 6, 'a reason given for moving an industry to a new place');
  q(d, 7, 'how vessels were made before a new technique was found');
  q(d, 8, 'a method that produces completely flat glass');
  d.heading('Questions 9–10'); d.line('Choose the correct letter, A, B, C or D.'); d.space(4);
  q(d, 9, 'Why was obsidian valued?'); opts(d, ['it was easy to find near volcanoes', 'it could be melted and reshaped', 'it produced very sharp edges', 'it was the only glass that was black']);
  q(d, 10, 'What does the writer say about the float process?'); opts(d, ['it was invented in Venice', 'it is still the usual way of making windows', 'it made glass thicker in the middle', 'it replaced glass fibre']);
  d.heading('Questions 11–12'); d.line('Choose TWO letters, A–E.'); d.line('Which TWO statements about the glass industry in Venice are true?'); d.space(4);
  opts(d, ['It started in the first century BC.', 'It was moved to an island.', 'Its workers could not leave the republic.', 'It sold glass to the Romans.', 'It invented glass blowing.']);
  d.heading('Question 13'); d.line('Complete the sentence below.'); d.line('Choose ONE WORD ONLY from the passage for your answer.'); d.space(4);
  d.para('The basic recipe for glass is sand, soda and ' + gap(13) + '.');
  d.newPage();
  answers(d, ['1 TRUE — paragraph A: “traded hundreds of kilometres from the volcanoes”', '2 FALSE — paragraph B: “probably as a by-product of metalworking or pottery”', '3 TRUE — paragraph C: “cheap enough for ordinary households”', '4 NOT GIVEN — the passage does not compare their pay',
    '5 F — glass fibre carries internet traffic', '6 D — “officially to protect the city from fire”', '7 B — a core of sand and clay was used', '8 E — “a perfectly flat sheet”',
    '9 C — “extremely sharp edges”', '10 B — “almost all window glass is still made this way today”', '11–12 IN EITHER ORDER B C — paragraph D', '13 lime — paragraph F']);
  d.save(file);
}
/* the full paper: three passages, 40 questions */
function readingFull(file) {
  const d = new Doc();
  // Passage 1
  d.line('READING PASSAGE 1', { size: 13, bold: true });
  d.line('You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.', { size: 10 });
  d.space(6); d.line('A Short History of Glass', { size: 16, bold: true, gap: 26 });
  GLASS.slice(0, 5).forEach(([l, t]) => d.para(t, { label: l, x: 80, w: 459 }));
  d.newPage();
  d.heading('Questions 1–5'); d.line('Reading Passage 1 has five paragraphs, A–E.'); d.line('Choose the correct heading for each paragraph from the list of headings below.'); d.line('Write the correct number, i–vii, in boxes 1–5 on your answer sheet.'); d.space(4);
  d.line('List of Headings', { bold: true });
  d.box(['i      A secret kept on an island', 'ii     A material shaped by volcanoes', 'iii    The search for a flat surface', 'iv     Glass in the computer age', 'v      A slow and expensive beginning', 'vi     A breath that changed an industry', 'vii    Why glass breaks']);
  q(d, 1, 'Paragraph A'); q(d, 2, 'Paragraph B'); q(d, 3, 'Paragraph C'); q(d, 4, 'Paragraph D'); q(d, 5, 'Paragraph E');
  d.heading('Questions 6–9'); d.line('Do the following statements agree with the information given in Reading Passage 1?'); tfngKey(d, false);
  q(d, 6, 'Obsidian was used to make tools.'); q(d, 7, 'Glass vessels were common in Mesopotamia in 3500 BC.'); q(d, 8, 'The Romans learned glass blowing from the Venetians.'); q(d, 9, 'Pilkington’s process uses a bath of liquid tin.');
  d.heading('Questions 10–13'); d.line('Complete the notes below.'); d.line('Choose ONE WORD ONLY from the passage for each answer.'); d.space(4);
  d.line('Early glass', { bold: true });
  d.line('•  first used for beads and the coating on clay ' + gap(10));
  d.line('•  vessels made around a core of sand and ' + gap(11));
  d.line('Venice', { bold: true });
  d.line('•  industry moved to Murano to protect the city from ' + gap(12));
  d.line('•  early panes made by spinning a ' + gap(13) + ' of glass');
  d.newPage();
  // Passage 2
  d.line('READING PASSAGE 2', { size: 13, bold: true });
  d.line('You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.', { size: 10 });
  d.space(6); d.line('Why We Sleep', { size: 16, bold: true, gap: 26 });
  [
    'For most of history, sleep was seen as a time when the brain simply switched off. That view began to change in 1953, when Eugene Aserinsky, a student in Chicago, noticed that the eyes of sleeping people moved quickly behind their closed lids. These periods of rapid eye movement, or REM sleep, turned out to be the time when most dreaming happens, and they showed that the sleeping brain is far from idle.',
    'Later research has linked sleep to memory. The psychologist Matthew Walker has shown that people who sleep after learning a list of words remember up to forty per cent more than people who stay awake. According to Walker, the brain uses deep sleep to move new information from a short-term store into long-term memory, rather like saving a document before closing the computer.',
    'Sleep also seems to clean the brain. In 2013 the neuroscientist Maiken Nedergaard found that the spaces between brain cells grow larger during sleep, allowing fluid to wash away waste products. Some of these waste products are connected with illnesses that affect memory in old age, which suggests that poor sleep over many years may have serious effects.',
    'Teenagers face a particular problem. Their internal clock shifts later during adolescence, so many of them are not tired until eleven o’clock at night or later. Schools that start at eight in the morning therefore force them to wake in the middle of their natural night. Several studies in the United States found that when schools moved their start time later, attendance improved and fewer students fell asleep in class.',
    'Despite this evidence, adults in many countries now sleep less than their grandparents did. Artificial light, long working hours and the glow of phone screens all push bedtime later. Doctors recommend between seven and nine hours a night for adults, yet surveys suggest that about a third regularly get fewer than six.'
  ].forEach((t) => d.para(t));
  d.newPage();
  d.heading('Questions 14–17'); d.line('Look at the following findings (Questions 14–17) and the list of researchers below.'); d.line('Match each finding with the correct researcher, A, B or C.'); d.line('Write the correct letter, A, B or C, in boxes 14–17 on your answer sheet.'); d.space(4);
  q(d, 14, 'Sleep helps the brain to remove waste.'); q(d, 15, 'Rapid eye movements happen during sleep.'); q(d, 16, 'Sleeping after studying improves memory.'); q(d, 17, 'Brain cells move apart during sleep.');
  d.line('List of Researchers', { bold: true }); d.box(['A      Eugene Aserinsky', 'B      Matthew Walker', 'C      Maiken Nedergaard']);
  d.heading('Questions 18–21'); d.line('Complete each sentence with the correct ending, A–F, below.'); d.space(4);
  d.box(['A      when they start school later in the morning.', 'B      before they go to sleep.', 'C      in the middle of their natural night.', 'D      because they work longer hours.', 'E      during periods of REM sleep.', 'F      when they read on paper.']);
  q(d, 18, 'Most dreaming takes place'); q(d, 19, 'Teenagers who start school at eight wake up'); q(d, 20, 'Students attend school more often'); q(d, 21, 'Many adults sleep less than their grandparents');
  d.heading('Questions 22–26'); d.line('Answer the questions below.'); d.line('Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.'); d.space(4);
  q(d, 22, 'In which city did Aserinsky study?'); q(d, 23, 'By how much can sleeping after learning improve memory?'); q(d, 24, 'In which year did Nedergaard publish her finding?');
  q(d, 25, 'What liquid washes waste out of the brain?'); q(d, 26, 'What fraction of adults often sleep less than six hours?');
  d.newPage();
  // Passage 3
  d.line('READING PASSAGE 3', { size: 13, bold: true });
  d.line('You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.', { size: 10 });
  d.space(6); d.line('The Case for City Trees', { size: 16, bold: true, gap: 26 });
  [
    'City planners have long treated trees as decoration: pleasant to look at, but the first thing to be cut when a budget is reduced. I believe this attitude is a serious mistake. A growing body of research shows that trees are among the cheapest and most effective tools a city has for protecting the health of its people.',
    'The clearest benefit is shade. On a summer afternoon, a street lined with mature trees can be up to ten degrees cooler than a bare one. As heatwaves become more frequent, this difference is not a matter of comfort but of survival, especially for older residents. Air conditioning can cool a single building, but only trees can cool an entire neighbourhood without using electricity.',
    'Trees also reduce flooding. Their roots allow rainwater to soak into the ground instead of running across concrete into drains, and their leaves catch a surprising amount of rain before it reaches the ground. Some engineers argue that new drainage pipes are a better investment, but pipes must be replaced every few decades, while a well-chosen tree can live for a century or more.',
    'The effect on mental health is harder to measure, yet it may be the most important of all. Studies in several countries have found that people who can see trees from their windows report lower levels of stress. Hospital patients with a view of greenery have even been reported to recover more quickly, although I suspect the size of this effect has sometimes been exaggerated.',
    'None of this means that any tree in any place will do. A species that needs a great deal of water may die in a dry summer, and roots planted too close to buildings can damage foundations. Cities therefore need trained specialists who can choose the right tree for each street. Such experts are rare, and in my view training more of them should be a priority for every local council.'
  ].forEach((t) => d.para(t));
  d.newPage();
  d.heading('Questions 27–31'); d.line('Do the following statements agree with the claims of the writer in Reading Passage 3?'); tfngKey(d, true);
  q(d, 27, 'City trees are often removed when money is short.'); q(d, 28, 'Air conditioning is a better way of cooling a neighbourhood.'); q(d, 29, 'Drainage pipes last longer than most trees.');
  q(d, 30, 'The benefit of trees for hospital patients may have been overstated.'); q(d, 31, 'Most city councils already employ enough tree specialists.');
  d.heading('Questions 32–35'); d.line('Choose the correct letter, A, B, C or D.'); d.space(4);
  q(d, 32, 'According to the writer, why is shade important?'); opts(d, ['it makes streets more attractive', 'it can protect people’s lives during heatwaves', 'it reduces the cost of electricity for the city', 'it helps trees to grow more quickly']);
  q(d, 33, 'How do trees reduce flooding?'); opts(d, ['by storing water in their trunks', 'by blocking drains with leaves', 'by helping rain soak into the ground', 'by raising the level of the street']);
  q(d, 34, 'What do some engineers prefer to trees?'); opts(d, ['larger parks', 'new drainage pipes', 'concrete walls', 'green roofs']);
  q(d, 35, 'What is the writer’s main purpose in the passage?'); opts(d, ['to describe how trees grow in cities', 'to compare trees in different countries', 'to persuade readers that cities should invest in trees', 'to explain why trees damage buildings']);
  d.heading('Questions 36–40'); d.line('Complete the summary using the list of words, A–H, below.'); d.space(4);
  d.line('Choosing city trees', { bold: true });
  d.para('A tree that needs a lot of ' + gap(36) + ' may not survive a dry summer, and trees planted too near houses can harm their ' + gap(37) + '. For this reason cities need ' + gap(38) + ' who can select suitable trees. The writer believes that ' + gap(39) + ' councils should make the ' + gap(40) + ' of these people a priority.');
  d.cols(['A  water', 'B  foundations', 'C  specialists', 'D  local'], 120); d.cols(['E  training', 'F  sunlight', 'G  windows', 'H  national'], 120);
  d.newPage();
  answers(d, inRows(['1 ii', '2 v', '3 vi', '4 i', '5 iii', '6 TRUE', '7 FALSE', '8 NOT GIVEN', '9 TRUE', '10 pots', '11 clay', '12 fire', '13 disc',
    '14 C', '15 A', '16 B', '17 C', '18 E', '19 C', '20 A', '21 D', '22 Chicago', '23 40%|forty per cent', '24 2013', '25 fluid', '26 a third|one third',
    '27 YES', '28 NO', '29 NO', '30 YES', '31 NO', '32 B', '33 C', '34 B', '35 C', '36 A', '37 B', '38 C', '39 D', '40 E'], 4));
  d.save(file);
}

/* ───────── LISTENING ───────── */
function listeningPart(file) {
  const d = new Doc();
  d.line('SECTION 1      Questions 1–10', { size: 13, bold: true });
  d.heading('Questions 1–6'); d.line('Complete the form below.'); d.line('Write ONE WORD AND/OR A NUMBER for each answer.'); d.space(4);
  d.line('Riverside Sports Centre – Membership Form', { bold: true }); d.space(2);
  d.line('Name:  Anna ' + gap(1));
  d.line('Address:  ' + gap(2) + ' Road, Kingsford');
  d.line('Phone number:  ' + gap(3));
  d.line('Preferred activity:  ' + gap(4));
  d.line('Membership starts on:  ' + gap(5) + ' March');
  d.line('Monthly fee:  £' + gap(6));
  d.heading('Questions 7–10'); d.line('Choose the correct letter, A, B or C.'); d.space(4);
  q(d, 7, 'Why does Anna want to join the centre?'); opts(d, ['her doctor advised her to', 'she wants to meet new people', 'she is training for a race']);
  q(d, 8, 'What does the membership include?'); opts(d, ['free parking', 'one personal training session', 'a free towel every visit']);
  q(d, 9, 'When is the pool closed?'); opts(d, ['on Monday mornings', 'on Friday evenings', 'on Sunday afternoons']);
  q(d, 10, 'What must Anna bring on her first visit?'); opts(d, ['a photograph', 'a bank card', 'a letter from her doctor']);
  d.newPage();
  answers(d, inRows(['1 Morrison', '2 Elm', '3 07700 900 482', '4 swimming', '5 14', '6 32', '7 A', '8 B', '9 A', '10 A'], 4));
  d.heading('AUDIOSCRIPT');
  ['RECEPTIONIST: Good morning, Riverside Sports Centre. How can I help?', 'ANNA: Hello, I’d like to become a member, please.', 'RECEPTIONIST: Of course. Can I have your name?', 'ANNA: Anna Morrison. That’s M-O-R-R-I-S-O-N.',
    'RECEPTIONIST: And your address?', 'ANNA: 26 Elm Road, Kingsford.', 'RECEPTIONIST: What’s the best phone number for you?', 'ANNA: It’s 07700 900 482.',
    'RECEPTIONIST: Which activity are you most interested in?', 'ANNA: Mainly swimming. My doctor said it would help my back.', 'RECEPTIONIST: Your membership can start on the 14th of March, and the monthly fee is £32.',
    'RECEPTIONIST: It includes one session with a personal trainer. The pool is closed on Monday mornings for cleaning, and please bring a photograph for your card.'].forEach((l) => d.para(l, { after: 2 }));
  d.save(file);
}
function listeningFull(file) {
  const d = new Doc();
  // PART 1
  d.line('PART 1      Questions 1–10', { size: 13, bold: true });
  d.heading('Questions 1–10'); d.line('Complete the notes below.'); d.line('Write ONE WORD AND/OR A NUMBER for each answer.'); d.space(4);
  d.line('Hotel booking – Lakeside Hotel', { bold: true }); d.space(2);
  d.line('Name of guest:  David ' + gap(1));
  d.line('Number of nights:  ' + gap(2));
  d.line('Type of room:  a ' + gap(3) + ' room with a view of the lake');
  d.line('Arrival date:  ' + gap(4) + ' June');
  d.line('Price per night:  £' + gap(5));
  d.line('Breakfast is served in the ' + gap(6));
  d.line('Car parking costs £' + gap(7) + ' a day');
  d.line('Special request:  a ' + gap(8) + ' for his daughter');
  d.line('Guest will pay by ' + gap(9));
  d.line('Reference number:  ' + gap(10));
  d.newPage();
  // PART 2
  d.line('PART 2      Questions 11–20', { size: 13, bold: true });
  d.heading('Questions 11–14'); d.line('Choose the correct letter, A, B or C.'); d.space(4);
  q(d, 11, 'The town museum was originally built as'); opts(d, ['a school', 'a railway station', 'a bank']);
  q(d, 12, 'The museum’s most popular exhibit is'); opts(d, ['an old fire engine', 'a collection of coins', 'a model of the town']);
  q(d, 13, 'Visitors can take photographs'); opts(d, ['everywhere in the museum', 'only in the garden', 'without using a flash']);
  q(d, 14, 'The museum café closes at'); opts(d, ['4.00 pm', '4.30 pm', '5.00 pm']);
  d.heading('Questions 15–20'); d.line('Label the map below.'); d.line('Write the correct letter, A–H, next to Questions 15–20.'); d.space(4);
  // the map: a plan of the museum ground floor with lettered rooms
  const top = d.y; d.gfx('0.6 w 56 ' + (top - 190) + ' 300 190 re S');
  [['A', 70, top - 40], ['B', 160, top - 40], ['C', 250, top - 40], ['D', 70, top - 110], ['E', 250, top - 110], ['F', 70, top - 170], ['G', 160, top - 170], ['H', 250, top - 170]].forEach(([l, x, y]) => { d.gfx(`0.4 w ${x - 8} ${y - 10} 70 34 re S`); d.text(x + 18, y + 2, l, 13, true); });
  d.gfx(`1.5 w 196 ${top - 190} m 196 ${top - 205} l S 190 ${top - 199} m 196 ${top - 190} l 202 ${top - 199} l S`);   // the entrance arrow
  d.y = top - 210;
  q(d, 15, 'Gift shop'); q(d, 16, 'Toilets'); q(d, 17, 'Café'); q(d, 18, 'Children’s room'); q(d, 19, 'Lift'); q(d, 20, 'Cloakroom');
  d.newPage();
  // PART 3
  d.line('PART 3      Questions 21–30', { size: 13, bold: true });
  d.heading('Questions 21–22'); d.line('Choose TWO letters, A–E.'); d.line('Which TWO problems did the students have with their survey?'); d.space(4);
  opts(d, ['too few people answered', 'some questions were unclear', 'the deadline was too short', 'they lost some of the data', 'the survey was too long']);
  d.heading('Questions 23–26'); d.line('What do the students say about each source?'); d.line('Choose FOUR answers from the box and write the correct letter, A–F, next to Questions 23–26.'); d.space(4);
  d.line('Opinions', { bold: true }); d.box(['A      out of date', 'B      too difficult to understand', 'C      very useful for statistics', 'D      too expensive to access', 'E      written for children', 'F      biased']);
  q(d, 23, 'the government report'); q(d, 24, 'the university website'); q(d, 25, 'the newspaper article'); q(d, 26, 'the textbook');
  d.heading('Questions 27–30'); d.line('Choose the correct letter, A, B or C.'); d.space(4);
  q(d, 27, 'The tutor thinks the introduction should'); opts(d, ['be shorter', 'include more examples', 'explain the aim of the study']);
  q(d, 28, 'The students decide to present their results as'); opts(d, ['a table', 'a bar chart', 'a pie chart']);
  q(d, 29, 'Who will write the conclusion?'); opts(d, ['Maria', 'Tom', 'both students']);
  q(d, 30, 'When must the project be handed in?'); opts(d, ['next Monday', 'next Wednesday', 'next Friday']);
  d.newPage();
  // PART 4
  d.line('PART 4      Questions 31–40', { size: 13, bold: true });
  d.heading('Questions 31–40'); d.line('Complete the notes below.'); d.line('Write ONE WORD ONLY for each answer.'); d.space(4);
  d.line('The history of chocolate', { bold: true }); d.space(2);
  d.line('Origins', { bold: true });
  d.line('•  cacao was first grown in Central ' + gap(31));
  d.line('•  the Maya made a drink that tasted ' + gap(32));
  d.line('•  cacao beans were used as ' + gap(33) + ' by the Aztecs');
  d.line('Europe', { bold: true });
  d.line('•  Spanish traders added ' + gap(34) + ' to the drink');
  d.line('•  chocolate houses became popular in ' + gap(35) + ' in the 1650s');
  d.line('•  at first only the ' + gap(36) + ' could afford it');
  d.line('Modern chocolate', { bold: true });
  d.line('•  in 1828 a Dutch chemist invented a ' + gap(37) + ' for removing fat');
  d.line('•  the first solid bar was sold in ' + gap(38));
  d.line('•  milk chocolate was developed in ' + gap(39));
  d.line('•  today most cacao is grown in West ' + gap(40));
  d.newPage();
  answers(d, [...inRows(['1 Clarke', '2 3|three', '3 double', '4 18', '5 95', '6 garden', '7 8|eight', '8 bed', '9 card', '10 LH4521',
    '11 C', '12 A', '13 C', '14 B', '15 B', '16 F', '17 H', '18 D', '19 E', '20 G'], 5), '21–22 IN EITHER ORDER A B',
    ...inRows(['23 A', '24 C', '25 F', '26 B', '27 C', '28 B', '29 C', '30 B'], 4),
    ...inRows(['31 America', '32 bitter', '33 money', '34 sugar', '35 London', '36 rich', '37 machine', '38 1847', '39 Switzerland', '40 Africa'], 5)]);
  d.heading('AUDIOSCRIPT');
  [['PART 1', ['RECEPTIONIST: Lakeside Hotel, good afternoon.', 'DAVID: Hi, I’d like to book a room. My name is David Clarke, C-L-A-R-K-E.', 'RECEPTIONIST: How many nights, Mr Clarke?', 'DAVID: Three nights, arriving on the 18th of June. A double room with a lake view, please.',
    'RECEPTIONIST: That’s £95 a night. Breakfast is served in the garden when the weather is fine, and parking is £8 a day.', 'DAVID: Could you also put a bed in the room for my daughter? I’ll pay by card.', 'RECEPTIONIST: Of course. Your reference number is LH4521.']],
   ['PART 2', ['GUIDE: Welcome to the town museum. The building was a bank until 1960. Our favourite exhibit is the old fire engine in the main hall.', 'GUIDE: You may take photographs anywhere, but without a flash, please. The café closes at half past four.',
    'GUIDE: As you come in, the gift shop is on your left, next to the toilets. The café is in the far corner and the children’s room is next to the main hall. The lift is on the right and the cloakroom is beside the entrance.']],
   ['PART 3', ['TUTOR: How did the survey go?', 'MARIA: Not well. Too few people answered, and some of the questions were unclear.', 'TOM: The government report was out of date, but the university website was very useful for statistics.',
    'MARIA: The newspaper article was biased, and the textbook was too difficult to understand.', 'TUTOR: The introduction should explain the aim of the study. Use a bar chart for the results.', 'TOM: We’ll both write the conclusion and hand it in next Wednesday.']],
   ['PART 4', ['LECTURER: Cacao was first grown in Central America. The Maya made a bitter drink from it, and the Aztecs used the beans as money.', 'LECTURER: Spanish traders added sugar, and in the 1650s chocolate houses opened in London, although only the rich could afford them.',
    'LECTURER: In 1828 a Dutch chemist invented a machine for removing fat. The first solid bar was sold in 1847, milk chocolate came from Switzerland, and today most cacao is grown in West Africa.']]
  ].forEach(([part, lines]) => { d.line(part, { bold: true }); lines.forEach((l) => d.para(l, { after: 2 })); });
  d.save(file);
}

/* ───────── WRITING ───────── */
function barChart(d, title, labels, series, max) {   // a simple bar chart drawn in the PDF (the admin cuts it out as the Task 1 picture)
  const x0 = 90, h = 170, w = 400; d.need(h + 70); const yTop = d.y; const y0 = yTop - h;
  d.text(x0, yTop + 6, title, 11, true);
  d.gfx(`0.6 w ${x0} ${y0} m ${x0} ${yTop - 14} l S ${x0} ${y0} m ${x0 + w} ${y0} l S`);
  for (let v = 0; v <= max; v += max / 5) { const y = y0 + (v / max) * (h - 20); d.text(x0 - 26, y - 3, String(v), 8); d.gfx(`0.2 w ${x0} ${y} m ${x0 + w} ${y} l S`); }
  const colors = ['0.13 0.39 0.92', '0.93 0.42 0.13', '0.2 0.6 0.3'];
  const gw = w / labels.length;
  labels.forEach((lab, i) => {
    series.forEach((s, k) => { const bh = (s.values[i] / max) * (h - 20); d.gfx(`${colors[k]} rg ${x0 + i * gw + 8 + k * 16} ${y0} 14 ${bh.toFixed(1)} re f 0 0 0 rg`); });
    d.text(x0 + i * gw + 8, y0 - 14, lab, 9);
  });
  series.forEach((s, k) => { d.gfx(`${colors[k]} rg ${x0 + k * 120} ${y0 - 34} 10 10 re f 0 0 0 rg`); d.text(x0 + k * 120 + 14, y0 - 33, s.name, 9); });
  d.y = y0 - 52;
}
function writingPart(file) {
  const d = new Doc();
  d.line('WRITING TASK 1', { size: 13, bold: true });
  d.line('You should spend about 20 minutes on this task.');
  d.space(4);
  d.para('The chart below shows the percentage of households in one country that owned a computer, a smartphone and a tablet in 2005, 2010, 2015 and 2020.');
  d.para('Summarise the information by selecting and reporting the main features, and make comparisons where relevant.');
  d.line('Write at least 150 words.');
  d.space(16);
  barChart(d, 'Household ownership of devices (%)', ['2005', '2010', '2015', '2020'], [{ name: 'Computer', values: [55, 68, 74, 72] }, { name: 'Smartphone', values: [5, 32, 78, 94] }, { name: 'Tablet', values: [0, 8, 45, 51] }], 100);
  d.newPage();
  d.line('Model answer', { size: 13, bold: true });
  ['The bar chart compares how many households in one country owned three kinds of device between 2005 and 2020.',
    'Overall, smartphones showed the most dramatic change, rising from almost none to nearly every household, while computer ownership grew only slightly and then levelled off.',
    'In 2005, just over half of households (55%) had a computer, whereas only 5% owned a smartphone and tablets were not yet available. By 2010 the figure for computers had risen to 68%, and smartphone ownership had climbed to around a third.',
    'The following decade saw smartphones overtake computers. In 2015, 78% of homes had a smartphone, compared with 74% for computers, and by 2020 the proportion with a smartphone had reached 94%. Tablets, meanwhile, became popular after 2010, rising to 45% in 2015 and 51% in 2020. Computer ownership, in contrast, fell slightly to 72% in the final year.'].forEach((p) => d.para(p));
  d.save(file);
}
function writingFull(file) {
  const d = new Doc();
  d.line('WRITING TASK 1', { size: 13, bold: true });
  d.line('You should spend about 20 minutes on this task.');
  d.space(4);
  d.para('The chart below shows the number of visitors (in thousands) to three museums in one city in 2000, 2010 and 2020.');
  d.para('Summarise the information by selecting and reporting the main features, and make comparisons where relevant.');
  d.line('Write at least 150 words.');
  d.space(16);
  barChart(d, 'Museum visitors (thousands)', ['2000', '2010', '2020'], [{ name: 'Science Museum', values: [420, 610, 750] }, { name: 'Art Gallery', values: [380, 400, 360] }, { name: 'History Museum', values: [210, 300, 520] }], 800);
  d.newPage();
  d.line('WRITING TASK 2', { size: 13, bold: true });
  d.line('You should spend about 40 minutes on this task.');
  d.space(4);
  d.line('Write about the following topic:');
  d.space(4);
  d.para('Some people believe that university education should be free for every student. Others think that students should pay for their own studies. Discuss both these views and give your own opinion.');
  d.para('Give reasons for your answer and include any relevant examples from your own knowledge or experience.');
  d.line('Write at least 250 words.');
  d.newPage();
  d.line('Task 1 model answer', { size: 13, bold: true });
  ['The bar chart shows how many people visited a science museum, an art gallery and a history museum in one city in 2000, 2010 and 2020.',
    'Overall, the science museum was the most popular throughout the period, and the history museum grew fastest, while visits to the art gallery changed little.',
    'In 2000 the science museum received 420,000 visitors, slightly more than the art gallery with 380,000. The history museum was far less popular, with just 210,000. By 2020 the science museum had grown steadily to 750,000 visitors, and the history museum had more than doubled to 520,000. The art gallery, by contrast, rose a little to 400,000 in 2010 before falling to 360,000 in 2020.'].forEach((p) => d.para(p));
  d.line('Task 2 model answer', { size: 13, bold: true });
  ['Whether students or the state should pay for university is a question on which people feel strongly. Both views have merit, but I believe that university should be free, or very nearly so.',
    'Those who want students to pay argue that graduates usually earn more than other workers, so it is fair that they cover the cost of the education that brings them this advantage. They also point out that free education must be paid for by taxes, including the taxes of people who never went to university.',
    'On the other hand, free university gives every talented young person the same chance, whatever their family’s income. When fees are high, many able students from poorer homes decide not to apply, and the country loses their skills. A well-educated population also benefits everyone, through better doctors, engineers and teachers.',
    'In conclusion, although the argument that graduates should pay has some force, I am convinced that the wider benefits of free university education outweigh its cost.'].forEach((p) => d.para(p));
  d.save(file);
}

/* ───────── SPEAKING ───────── */
function speakingPart(file) {
  const d = new Doc();
  d.line('PART 2', { size: 13, bold: true });
  d.space(4);
  d.line('Describe a place in your city where you like to relax.');
  d.line('You should say:');
  d.line('•  where this place is');
  d.line('•  how often you go there');
  d.line('•  what you do there');
  d.line('and explain why you find it relaxing.');
  d.space(8);
  d.line('Do you think people today have enough time to relax?');
  d.line('Is it better to relax alone or with friends?');
  d.save(file);
}
function speakingFull(file) {
  const d = new Doc();
  d.line('PART 1', { size: 13, bold: true });
  d.line('Home and accommodation', { bold: true });
  ['Do you live in a house or a flat?', 'What is your favourite room in your home?', 'Would you like to move to a different home in the future?'].forEach((x) => d.line(x));
  d.space(4); d.line('Weather', { bold: true });
  ['What kind of weather do you like most?', 'Does the weather ever change your plans?', 'Is the weather in your country different in different regions?'].forEach((x) => d.line(x));
  d.space(10);
  d.line('PART 2', { size: 13, bold: true });
  d.line('Describe a skill you would like to learn.');
  d.line('You should say:');
  d.line('•  what the skill is');
  d.line('•  how you would learn it');
  d.line('•  how long it would take to learn');
  d.line('and explain why you would like to learn this skill.');
  d.space(10);
  d.line('PART 3', { size: 13, bold: true });
  d.line('Learning new skills', { bold: true });
  ['Why do some adults stop learning new skills?', 'Is it easier to learn a skill from a teacher or from the internet?', 'Which skills will be most important for young people in the future?', 'Should schools teach practical skills such as cooking and repairing things?'].forEach((x) => d.line(x));
  d.save(file);
}

const OUT = path.join(__dirname, '..', 'assets', 'samples');
fs.mkdirSync(OUT, { recursive: true });
const jobs = { 'reading-part.pdf': readingPart, 'reading-full.pdf': readingFull, 'listening-part.pdf': listeningPart, 'listening-full.pdf': listeningFull, 'writing-part.pdf': writingPart, 'writing-full.pdf': writingFull, 'speaking-part.pdf': speakingPart, 'speaking-full.pdf': speakingFull };
for (const [name, fn] of Object.entries(jobs)) { fn(path.join(OUT, name)); console.log('wrote assets/samples/' + name, fs.statSync(path.join(OUT, name)).size + ' bytes'); }
