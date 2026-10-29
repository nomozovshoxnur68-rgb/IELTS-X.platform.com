'use strict'
/* listening-exam.js -- turns a Listening test made in the admin panel into a page on the NEW listening engine
   (listening/js/listening.js + listening/css/listening.css), exactly like reading-exam.js does for Reading.
   The question types match the engine's helpers: gap (typed), mcq, multi (choose TWO/THREE...), matching (drag),
   map (letter matrix over a picture), box (drag words into the text). */
const fs = require('fs')
const path = require('path')
const { inheritGroups } = require('./reading-exam')

const KINDS = ['gap', 'mcq', 'multi', 'matching', 'map', 'box']
const KIND_FROM_TYPE = { gap: 'gap', short: 'gap', completion: 'gap', tfng: 'gap', ynng: 'gap', mcq: 'mcq', 'mcq-multi': 'multi', multi: 'multi', matching: 'matching', map: 'map', box: 'box' }
const DEFAULT_INSTR = {
  gap: 'Complete the notes below. Write **ONE WORD AND/OR A NUMBER** for each answer.',
  mcq: 'Choose the correct letter, **A**, **B** or **C**.',
  multi: 'Choose the correct letters.',
  matching: 'Match each item with the correct option. Move the correct answer into the gap.',
  map: 'Label the map or plan. Choose the correct letter next to each question.',
  box: 'Complete the text using the words in the box. Move the correct answer into each gap.'
}
const TEMPLATE = path.join(__dirname, 'listening', 'exam-template.html')

const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const jsonForScript = (o) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')

function parseOptions(list) {
  const out = []
  ;(Array.isArray(list) ? list : []).forEach((raw, i) => {
    const s = String(raw == null ? '' : raw).trim()
    if (!s) return
    const m = /^([A-Za-z])\s*[.):\-]\s*(.+)$/.exec(s)
    out.push(m ? { l: m[1].toUpperCase(), t: m[2].trim() } : { l: String.fromCharCode(65 + out.length), t: s })
  })
  return out
}
const letters = (ans) => String(ans || '').toUpperCase().split(/[^A-Z]+/).filter(Boolean)

const isFull = (material) => !!(material && material.data && material.data.mode === 'full')
/* a full paper (Parts 1-4 on one page): every question carries its part in q.passage (1-4) */
const partOfQ = (q) => Math.min(4, Math.max(1, parseInt(q && q.passage, 10) || 1))

/** questions -> numbered blocks + the answer key */
function buildBlocks(material) {
  const d = material.data || {}
  const full = isFull(material)
  const part = full ? 1 : Math.min(4, Math.max(1, parseInt(d.part, 10) || parseInt(String(d.sectionLabel || '').replace(/\D+/g, ''), 10) || 1))
  let n = full ? 1 : Math.max(1, parseInt(d.from, 10) || ((part - 1) * 10 + 1))
  const from = n
  const answers = {}
  const times = {}   // the second of the recording where an answer is heard (set by the AI Test Generator)
  const blocks = []
  let cur = null
  let lastPart = 0
  // a full paper is played in the order of its parts, whatever order the groups were typed in
  const qs = inheritGroups(d.questions).map((q, i) => ({ q, i })).sort((a, b) => (full ? partOfQ(a.q) - partOfQ(b.q) : 0) || a.i - b.i).map((x) => x.q)
  // the map pictures of a full paper belong to the part chosen for them (when none was chosen, every map shows them all)
  const picsByPart = full && (d.images || []).some((im) => Number(im.passage || 1) !== 1)
  qs.forEach((q) => {
    const kind = KIND_FROM_TYPE[q.type] || 'gap'
    const opts = parseOptions(q.options)
    const gi = (q.gi === undefined || q.gi === null || q.gi === '') ? null : String(q.gi)
    const qPart = full ? partOfQ(q) : part
    const key = qPart + '|' + kind + '|' + (gi === null ? '' : gi) + '|' + (q.group || '') + (kind === 'matching' || kind === 'map' || kind === 'box' ? '|' + JSON.stringify(opts) : '')
    const grp = String(q.group || '').trim()
    const newPart = full && qPart !== lastPart
    const joinable = cur && !newPart && kind !== 'multi' && (cur.key === key || (gi === null && !grp && cur.kind === kind && (kind === 'gap' || kind === 'mcq' || JSON.stringify(cur.options) === JSON.stringify(opts))))
    if (!joinable) {
      cur = { key, kind, from: n, to: n, instruction: String(q.group || '').trim() || DEFAULT_INSTR[kind], title: String(q.blockTitle || ''), options: opts, items: [] }
      if (newPart) cur.partHead = 'Part ' + qPart
      lastPart = qPart
      if (kind === 'map') cur.images = (d.images || []).filter((im) => !picsByPart || Number(im.passage || 1) === qPart).map((im) => ({ url: im.url, caption: im.caption || '' }))
      blocks.push(cur)
    }
    if (kind === 'multi') {
      const want = letters(q.answer).sort()
      const cnt = Math.max(2, want.length)
      const ids = []
      for (let i = 0; i < cnt; i++) ids.push(n + i)
      ids.forEach((id, i) => { answers[id] = want[i] || ''; if (Number(q.at) > 0) times[id] = Number(q.at) })
      cur.items.push({ ids, prompt: q.prompt || '', options: opts, id: ids[0] })
      cur.to = n + cnt - 1
      n += cnt
      return
    }
    const id = n++
    if (Number(q.at) > 0) times[id] = Number(q.at)
    if (kind === 'gap' || kind === 'box') answers[id] = String(q.answer || '').trim()
    else answers[id] = (letters(q.answer)[0] || '')
    cur.items.push({ id, prompt: q.prompt || '', options: kind === 'mcq' ? opts : undefined, title: kind === 'gap' || kind === 'box' ? String(q.title || '') : undefined })
    cur.to = id
  })
  return { part, from, to: n - 1, blocks, answers, times }
}

/** "Speaker: text" lines -> transcript; marks the line that contains each typed answer */
function buildTranscript(text, part, from, to, answers, full) {
  const out = full ? [] : [{ type: 'break', label: 'Part ' + part + ' \u00b7 Questions ' + from + '\u2013' + to }]
  const lines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  lines.forEach((l) => {
    // a full paper: a line "PART 2" (or "Section 2") opens that part's tab of the transcript
    const pm = full && /^(?:part|section)\s*([1-4])\s*[:.\-\u2013\u2014]?\s*$/i.exec(l)
    if (pm) { out.push({ type: 'break', label: 'Part ' + pm[1] }); return }
    const m = /^([^:]{1,24}):\s+(.+)$/.exec(l)
    out.push(m ? { sp: m[1].trim(), tx: m[2].trim() } : { sp: '', tx: l })
  })
  let cursor = full ? 0 : 1
  Object.keys(answers).map(Number).sort((a, b) => a - b).forEach((id) => {
    const a = String(answers[id] || '').split('|')[0].trim()
    if (!a || /^[A-H]$/.test(a)) return
    const re = new RegExp('(^|[^\\w])' + a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^\\w])', 'i')
    for (let i = cursor; i < out.length; i++) {
      if (out[i].tx && !out[i].aw && re.test(out[i].tx)) { out[i].aw = a; out[i].answers = [id]; cursor = i; break }
    }
  })
  return out
}

function buildConfig(material) {
  const d = material.data || {}
  const { part, from, to, blocks, answers, times } = buildBlocks(material)
  const full = isFull(material)
  const rows = []
  for (let i = from; i <= to; i++) rows.push([i])
  const cfg = {
    id: 'ix-' + String(material.id || 'x').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 24),
    part, from, to,
    label: full ? 'Full test' : undefined,
    finishUrl: full ? '/full-tests/listening/' : '/part/practice/listening',   // "Finish" on the results screen goes back to the list

    minutes: Math.min(60, Math.max(1, parseInt(d.durationMin, 10) || (full ? 30 : 10))),
    name: String(material.title || 'Listening'),
    audioStart: Math.max(0, +d.audioStart || 0),
    audioEnd: Math.max(0, +d.audioEnd || 0),
    navGroups: rows, answers, answerTimes: times,
    transcript: buildTranscript(d.transcript, part, from, to, answers, full)
  }
  return { cfg, data: { blocks }, part }
}

function renderPage(material) {
  const tpl = fs.readFileSync(TEMPLATE, 'utf8')
  const { cfg, data, part } = buildConfig(material)
  const d = material.data || {}
  const audio = String(d.audioUrl || '')
  const script = 'window.LISTENING_DATA = ' + jsonForScript(data) + ';\n' +
    'window.PART_PRACTICE = ' + jsonForScript(cfg).slice(0, -1) +
    ',"build":null};\nwindow.PART_PRACTICE.build = function (h) { return window.IXListeningRender(window.LISTENING_DATA, ' + part + ')(h); };'
  return tpl
    .replace(/\{\{TITLE\}\}/g, () => esc(material.title || 'Listening'))
    .replace(/\{\{PARTNO\}\}/g, isFull(material) ? '1–4' : String(part))
    .replace(/\{\{MINUTES\}\}/g, String(cfg.minutes))
    .replace(/\{\{AUDIO\}\}/g, () => esc(audio))
    .replace('{{DATA_SCRIPT}}', () => script)
}

module.exports = { renderPage, buildConfig, buildBlocks, parseOptions, isFull, KINDS, KIND_FROM_TYPE, DEFAULT_INSTR }
