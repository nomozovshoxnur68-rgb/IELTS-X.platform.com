# Reading tests from one simple file (`reading-src/`)

Every hand-made Full Reading page can be written as **one small text file** here.
`npm run build:reading` turns it into the finished page (same exam screen, timer, review mode,
explanations and passage highlights as every other test) and checks it.

```
reading-src/volume-9/test-1.js   ->   full-tests/reading/test-v9-1.html
```

## Add a new test in 4 steps

1. Copy `reading-src/volume-9/test-1.js` to a new file, e.g. `reading-src/volume-10/test-1.js`.
2. Change `out` (must start with `full-tests/reading/test-`), `title`, `no`, and paste the three passages.
3. Write the question groups (types below). Question numbers 1–40, "Questions 1–6" headings,
   the instructions and the TRUE/FALSE key are added by themselves.
4. Run `npm run build:reading`, then add the test to its pack in `assets/js/full-tests-data.js`
   and run `npm run build:packs`.

The build prints `ok` or a list of what to fix (wrong answer letters, a missing gap, a highlight that is
not in the passage, fewer than 40 questions …).

## Passages

```js
passages: [
  { title: 'Coins – the first form of money', subtitle: 'optional italic line under the title', lettered: true,
    text: `
A Few people pay much attention to coins …

B In the modern media environment …

## A bold sub-heading inside the passage

* a small footnote
` }
]
```
One blank line between paragraphs. `lettered: true` makes "A …", "B …" bold paragraph letters
(needed for matching headings / which paragraph).

## Every question has

```js
{ q: 'question text', a: 'ANSWER', en: 'English explanation with “the passage words” in quotes', uz: 'O‘zbekcha izoh' }
```
* `a` — several accepted answers with `|`: `'taste buds|taste bud'`.
* The words in “quotes” (or "quotes" / 'quotes') in `en` are lit up in the passage when the student opens
  the explanation. Put `ev: ['exact passage words']` to choose the highlight yourself.

## Group types

| type | what it is | extra fields |
|---|---|---|
| `tfng` / `ynng` | True/False/Not Given, Yes/No/Not Given | – |
| `mcq` | one correct letter | each item: `opts: ['…','…','…','…']` |
| `mcq-multi` | choose TWO / THREE | one item: `q`, `opts`, `a: 'A,C'` |
| `headings` | matching headings | `headings: ['…']` (i, ii … in order); items: `{ para: 'A', a: 'vii', en, uz }` |
| `matching-info` | which paragraph (A–?) | `count: 8` (letters A–H), `nb: true` |
| `matching-features` | people / dates / list of options | `options: ['…']`, `listTitle: 'List of Researchers'` |
| `endings` | sentence endings A–F | `endings: ['…']`; items `q` = sentence start |
| `notes` | notes completion | `lines: ['## sub-heading', '- bullet with {{}}', '-- sub-bullet']`, `title`, `limit` |
| `summary` | summary completion | `prose: 'text with {{}} gaps'`, `title`, `limit` |
| `wordbank` | summary with a box of words A–D | `bank: ['poverty', …]`, `prose`; answers are letters |
| `table` | table completion | `headers: [...]`, `rows: [['cell', 'text {{}}'], …]` |
| `sentence` | sentence completion | items `q: 'text ____ text'` |
| `short` | short-answer questions | items `q: 'Question? ____'` |

`{{}}` is a gap; gaps are numbered in order and take the answers of `items` in the same order.
`limit`: 1 = ONE WORD ONLY, 2 = NO MORE THAN TWO WORDS, 3 = THREE, `'3n'` = THREE WORDS AND/OR A NUMBER.
Any group can override the standard text with `instruction: '… boxes {R} …'` (`{R}` becomes "14–19").

## Tests made in the Admin panel

The fastest way there: Admin → Reading → **+ New test** → Full → **Paste the whole test at once** and paste the
PDF text exactly as it is, **including the ANSWERS section at the end** — answers, explanations and highlights
are filled in from it. Check the groups, then Save.
