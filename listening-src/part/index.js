'use strict';
/*
 * Built-in Listening Part practice tests (one section each), written from the PDFs (October 2026). The PDFs have no audio.
 *
 * Like reading-src/part: the server adds each of them ONCE to the admin panel (Admin → Listening · Part practice) as an
 * ordinary test, opening at /sections/test-N. They are added as Hidden, because there is no recording yet: upload the audio
 * (or paste its link) in the test's form, check the answers, then make it Visible. From then on the copy in the admin panel
 * IS the test; changing a file here later does not change it, and a test removed in the panel is not added again.
 *
 * One file = one section:
 *   key       stable name of the built-in test; never change it
 *   title     the card title
 *   section   1–4 (Section 4 = Questions 31–40, Section 1 = 1–10)
 *   cardTypes question-type chips on the card
 *   groups    one block each: { type: 'gap', title: 'title above the notes', group: 'instruction (**bold**)', items }
 *     item    { q: 'text with ____ where the gap is (\n = new line)', a: 'answer|other accepted answer', sub: 'small sub-heading before the line', en: 'explanation' }
 *             a: '' = the PDF has no answer key: type the answer in the admin panel.
 */
const LIST = [
  require('./01-tinned-food'),
  require('./02-solar-water-purifier'),
  require('./03-fly-glow-worms'),
  require('./04-portraits'),
  require('./05-underwater-archaeology'),
  require('./06-otago-gold-mining'),
  require('./07-bridlington'),
  require('./08-railways'),
  require('./09-cape-breton-mining'),
  require('./10-nz-architecture-1960s'),
  require('./11-geography-field-trip'),
  require('./12-kakapo'),
  require('./13-vikings'),
  require('./14-calotype-photography'),
  require('./15-manmade-objects-in-space'),
  require('./16-ethics-in-engineering'),
  require('./17-marys-apartment'),
  require('./18-health-club'),
  require('./19-rock-art'),
  require('./20-development-of-pencil'),
  require('./21-insects-and-pest-control'),
  require('./22-beavers-in-britain'),
  require('./23-adwaita-turtles'),
  require('./24-pharmacy-notes'),
  require('./25-history-of-sneakers'),
  require('./26-women-in-us-computing'),
  require('./27-nocturnal-animals'),
  require('./28-soundscapes'),
  require('./29-beehive-discovery'),
  require('./30-male-lizards')
];

/* one file -> the test as the admin panel saves it (POST /api/admin/materials) */
function toMaterial(t) {
  const questions = [];
  (t.groups || []).forEach((g, gi) => (g.items || []).forEach((it) => questions.push({
    type: g.type || 'gap', passage: 1, gi, group: g.group || '', blockTitle: g.title || '', title: it.sub || '', prompt: it.q,
    options: g.options || [], answer: it.a || '', explanation: it.en || ''
  })));
  return {
    type: 'listening', title: t.title, pack: '', description: '', premium: false, published: false,   // Hidden until the audio is added
    data: { mode: 'part', durationMin: 10, instructions: '', images: [], audioUrl: '', audioStart: 0, audioEnd: 0, transcript: '',
      coverUrl: '', sectionLabel: 'Section ' + (t.section || 1), cardTypes: t.cardTypes || [], questions }
  };
}

module.exports = { LIST, toMaterial };
