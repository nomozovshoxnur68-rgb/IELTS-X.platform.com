'use strict';
/*
 * Built-in Reading Part practice tests (one passage each), written from the PDFs (October 2026).
 *
 * They are not pages. The server adds each of them ONCE to the admin panel (Admin → Reading · Part practice) as an
 * ordinary test: its card is on /part/practice/reading and it opens at /pessages/test-N like every admin test. From then
 * on the copy in the admin panel IS the test – edit, lock, hide or remove it there. Changing a file here later does not
 * change that copy, and a test removed in the panel is not added again (seedReadingParts() in server.js remembers the keys).
 * A new file here (and its line in LIST) is added on the next start.
 *
 * One file = one passage:
 *   key           stable name of the built-in test; never change it (it is how the server knows the test was added)
 *   title         the card title and the title above the passage
 *   passageLabel  'Passage 1' | 'Passage 2' | 'Passage 3' — the card tag and the numbering (P2 = Questions 14–26, P3 = 27–40)
 *   cardTypes     question-type chips on the card
 *   passage       first line = the italic line under the title; one paragraph per line, a blank line between;
 *                 "A …", "B …" make lettered paragraphs
 *   groups        one block of the paper each ("Questions 1–6 …"):
 *     { type, group: 'the instruction', title: 'title above the notes / summary, or of the option list', options, items }
 *     type  tfng | ynng | mcq (each item has opts) | mcq-multi (one item, a: 'B,D') | completion (q has ____ where the gap is)
 *           | matching (options: 'A. …' features / word list, 'i. …' headings with q 'Paragraph A', or 'A'…'G' paragraph letters)
 *     item  { q: question, a: answer ('|' between accepted answers), en: explanation, ev: passage words to light up (string or list) }
 */
const LIST = [
  require('./01-ambergris'),
  require('./02-dark-chocolate'),
  require('./03-asteroid'),
  require('./04-growing-more-for-less'),
  require('./05-marketing-information-age'),
  require('./06-headphones'),
  require('./07-termite-mounds'),
  require('./08-clipper-races'),
  require('./09-walking-and-shoes'),
  require('./10-the-pearl'),
  require('./11-ahead-of-its-time'),
  require('./12-roller-coaster'),
  require('./13-science-and-filmmaking')
];

/* one file -> the test as the admin panel saves it (POST /api/admin/materials) */
function toMaterial(t) {
  const questions = [];
  (t.groups || []).forEach((g, gi) => (g.items || []).forEach((it) => questions.push({
    type: g.type, passage: 1, gi, group: g.group || '', blockTitle: g.title || '', prompt: it.q,
    options: g.type === 'matching' ? (g.options || []) : (it.opts || []), answer: it.a,
    explanation: it.en || '', evidence: [].concat(it.ev || []).join('\n')
  })));
  return {
    type: 'reading', title: t.title, pack: '', description: '', premium: false, published: true,
    data: { mode: 'part', durationMin: 20, instructions: '', images: [], coverUrl: '', passageLabel: t.passageLabel || 'Passage 1',
      cardTypes: t.cardTypes || [], passage: String(t.passage || '').trim(), questions }
  };
}

module.exports = { LIST, toMaterial };
