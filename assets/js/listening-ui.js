/*
 * IELTSX — the two looks of a Listening test.
 *
 *   "classic"  listening.css as it always was
 *   "modern"   assets/css/listening-modern.css on top of it, and the answer review drawn here: the transcript on the left
 *              (with the words behind every answer marked Q1, Q2 …), "Questions Review" and "Vocabulary" on the right, and
 *              an explanation card under every question
 *
 * The engine (listening/js/listening.js, and listening/js/exam-app.js for the oldest full test) is the same for both: audio,
 * clock, answers, highlights, notes, settings, the submission page, marking and the results page do not change. This file
 * only (1) decides which look the page has and (2) adds what the modern look needs. reading-ui.js does the same for Reading.
 *
 * Who decides, the first one that is set:
 *   1. ?ui=modern | ?ui=classic in the address   one page view only (the "Preview" links of the admin panel)
 *   2. the student's own choice                  Account -> Interface, kept with the account (/api/account/listening-ui)
 *   3. the test                                  Admin -> Listening, "Interface" of a test (<html data-lui-test>), or
 *                                                Admin -> Listening interface for the built-in tests
 *   4. the website                               Admin -> Listening interface, the default
 * The last answer of the server is remembered in this browser, so the right look is there from the first paint.
 * A paper of a Full Mock is always classic.
 */
(function () {
  'use strict';
  if (window.ListeningUI) return;
  const root = document.documentElement;
  const KEY = 'ix-listening-ui';
  const UIS = ['classic', 'modern'];
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (html) => { const d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; };
  const page = location.pathname.toLowerCase().replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  const MOCK = /^\/full-mock\//.test(page) || /[?&]embed=1\b/.test(location.search);

  /* ───────── which look ───────── */
  function remembered() { try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; } }
  function remember(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* blocked: asked again on the next page */ } }
  const known = (v) => UIS.indexOf(v) >= 0;
  function decide(cfg) {
    if (MOCK) return 'classic';
    const q = /[?&]ui=(classic|modern)\b/.exec(location.search); if (q) return q[1];
    if (cfg.choice !== false && known(cfg.pref)) return cfg.pref;
    const own = root.getAttribute('data-lui-test') || (cfg.pages || {})[page];
    if (known(own)) return own;
    return known(cfg.default) ? cfg.default : 'classic';
  }
  let current = ''; let engine = null;
  const inReview = () => !!(document.body && document.body.classList.contains('review-mode'));
  const isModern = () => current === 'modern';
  // never in the middle of a test: an answer of the server that comes after Start counts from the next test
  const started = () => !!(engine && document.body && !document.body.classList.contains('pre-entry'));
  function apply(next) {
    if (next === current || started()) return;
    current = next;
    root.classList.toggle('lui-modern', next === 'modern');
    root.setAttribute('data-listening-ui', next);
    if (engine) engine.redraw();   // the paper is already drawn behind the start card: draw it again in this look
  }
  apply(decide(remembered()));
  if (!MOCK && window.fetch && /^https?:$/.test(location.protocol)) {
    fetch('/api/listening-ui', { credentials: 'same-origin', cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((cfg) => {
      if (!cfg) return;
      remember({ default: cfg.default, choice: cfg.choice, pages: cfg.pages, pref: cfg.pref });
      apply(decide(cfg));
    }).catch(() => { /* offline: the remembered look stays */ });
  }

  /* ───────── small parts of the modern screen that the page does not have ───────── */
  const svg = (inner, cls) => '<svg class="' + (cls || 'lm-ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + inner + '</svg>';
  const IC = {
    menu: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    full: svg('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>', 'lm-ic lm-fs-in'),
    unfull: svg('<path d="M20 10h-6V4M4 14h6v6M14 10l7-7M3 21l7-7"/>', 'lm-ic lm-fs-out'),
    volume: svg('<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path class="lm-wave" d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'),
    note: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    dots: svg('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>'),
    x: svg('<path d="M18 6 6 18M6 6l12 12"/>', 'lm-ic lm-ic-x'),
    check: svg('<path d="M20 6 9 17l-5-5"/>', 'lm-ic lm-ic-ok'),
    arrow: svg('<path d="M5 12h14M12 5l7 7-7 7"/>', 'lm-ic lm-ic-arr'),
    chev: svg('<path d="m9 18 6-6-6-6"/>', 'lm-ic lm-ic-chev'),
    pin: svg('<path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    play: '<svg class="lm-ic lm-fill lm-i-play" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 4.6v14.8c0 .8.9 1.3 1.6.8l11-7.4a1 1 0 0 0 0-1.6l-11-7.4c-.7-.5-1.6 0-1.6.8Z"/></svg>',
    pause: '<svg class="lm-ic lm-fill lm-i-pause" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    speaker: '<svg class="lm-ic lm-fill" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 9v6h4l5 5V4L7 9H3Z"/><path class="lm-wave" d="M16.5 12A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4ZM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z"/></svg>'
  };
  const setVolume = (v) => { try { ExamApp.setVolume(v); } catch (e) { /* no engine */ } };
  let lastVolume = 1;
  function toggleMute(slider) {
    const a = engine.audio(), cur = slider ? Number(slider.value) : a ? a.volume : 1;
    if (cur > 0) lastVolume = cur;
    const next = cur > 0 ? 0 : lastVolume || 1;
    if (slider) slider.value = next;
    setVolume(next); volumeLook();
  }
  function volumeLook() { const a = engine && engine.audio(); document.body.classList.toggle('lm-muted', !!a && (a.muted || a.volume === 0)); }
  const finishedLabel = () => (inReview() ? 'Finish' : engine.submitting() ? 'Back to test' : 'Submit');
  function decorate() {
    const right = $('#hdr-right'), left = $('#hdr-left'); if (!right || !left) return;
    if (!$('#lm-submit')) {
      const b = document.createElement('button');
      b.type = 'button'; b.id = 'lm-submit'; b.className = 'lm-only';
      // the same actions as the ✓ of the classic bar (the submission page) and the Finish button of the results page
      b.addEventListener('click', () => { if (inReview()) engine.finish(); else window.LSN.deliverClick(); });
      right.appendChild(b);
      const put = (sel, html) => { const x = $(sel); if (x && !$('.lm-only', x)) x.insertAdjacentHTML('beforeend', '<span class="lm-only">' + html + '</span>'); };
      put('#menu-btn', IC.menu); put('#notes-btn', IC.note); put('#fs-btn', IC.full + IC.unfull); put('#vol-btn', IC.volume);
      // the volume: the slider of the classic popover stands in the header; the oldest page has none, so it gets one
      const slider = $('#vol-slider-hdr');
      if (slider) { $('#vol-btn').addEventListener('click', () => { if (isModern()) toggleMute(slider); }); slider.addEventListener('input', volumeLook); }
      else {
        const v = el('<div id="lm-vol" class="lm-only"><button type="button" aria-label="Volume" title="Volume">' + IC.volume + '</button><input type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume"></div>'), r = $('input', v);
        r.addEventListener('input', () => { setVolume(r.value); volumeLook(); }); $('button', v).addEventListener('click', () => toggleMute(r));
        right.insertBefore(v, right.firstChild);
      }
      left.insertBefore(el('<span class="lm-only lm-brand"><img src="/icon.png" alt="" width="28" height="28"><b>IELTSX</b></span>'), left.firstChild);
      left.appendChild(el('<div class="lm-only" id="lm-title"></div>'));
      left.appendChild(el('<div class="lm-only" id="lm-ttid"></div>'));
    }
    $('#lm-submit').textContent = finishedLabel();
    const u = window.IELTSXUser;
    $('#lm-ttid').textContent = 'Test taker ID: ' + (u && u.id ? String(u.id).replace(/[^a-z0-9]/gi, '').slice(-8).toUpperCase() : 'Guest');
    document.body.classList.toggle('lm-paper', !!engine.paged);   // a full paper shows the test taker, a section its title
    const nb = $('#notes-btn'); if (nb && document.body.classList.contains('notes-typed')) nb.classList.add('lm-has');   // notes typed earlier: the pencil is there
  }
  document.addEventListener('ieltsx:user', () => { if (isModern() && $('#lm-submit')) decorate(); });

  /* ───────── after the engine has drawn a part ───────── */
  const rangeOf = (p) => engine.parts.find((x) => x.part === p) || engine.parts[0];
  const partOfQ = (id) => (engine.parts.find((x) => id >= x.from && id <= x.to) || engine.parts[0]).part;
  // a single block that is no Part (Pre-test) keeps its own name
  const partName = (p) => (engine.label && !engine.paged ? engine.label : 'Part ' + p);
  function drawn(p) {
    decorate();
    const r = rangeOf(p), rev = inReview(), a = engine.paged && !rev ? engine.from : r.from, b = engine.paged && !rev ? engine.to : r.to;
    const set = (sel, t) => { const x = $(sel); if (x) x.textContent = t; };
    set('#pbar-title', 'Listening ' + partName(p) + (rev ? ' Review' : ''));
    set('#pbar-desc', (rev ? 'Review your answers for questions ' : 'Listen to the audio and answer questions ') + a + '–' + b + '.');
    // "[Pack 6] Test 8 - P3: Condenser"
    const c = engine.cfg || {}, t = $('#lm-title');
    if (t) {
      const h2 = $('#listening-render .section-head h2'), name = c.title || (h2 && h2.textContent.trim()) || c.name || document.title;
      const no = c.no || (/\/test-(\d+)$/.exec(page) || [])[1] || '', numbered = no && !engine.paged && !/\btest\s*\d/i.test(name);
      t.textContent = (c.pack ? '[' + c.pack + '] ' : '') + (numbered ? 'Test ' + no + ' - ' : '') + (engine.paged || engine.label ? '' : 'P' + p + ': ') + name;
      t.title = t.textContent;
    }
  }

  /* ───────── the paper: the same fields, set as the modern sheet (lists instead of dashes, the title in the map grid) ───────── */
  const isBlank = (n) => n.nodeType === 8 || (n.nodeType === 3 && !n.nodeValue.replace(/[\s ]+/g, ''));
  const DASH = /^[\s ]*[-–—•●▪◦·]\s* *\s*/;
  /* a run of text with <br>s -> its lines: { kind: 'li' | 'plain' | 'sub', lvl, nodes } */
  function linesOf(flow) {
    const lines = []; let cur = null, brs = 0;
    const firstText = (nodes) => { for (const n of nodes) { if (n.nodeType === 3) { if (n.nodeValue.replace(/\s+/g, '')) return n; } else if (n.nodeType === 1) return null; } return null; };
    const close = () => { if (cur && cur.some((n) => !isBlank(n))) lines.push(cur); cur = null; };
    Array.prototype.slice.call(flow.childNodes).forEach((n) => {
      if (n.nodeName === 'BR') { brs++; if (cur) cur.push(n); return; }
      if (n.nodeType === 1 && n.classList.contains('subhead')) { close(); brs = 0; lines.push(n); return; }
      if (isBlank(n) && (!cur || brs)) { if (cur && n.nodeType === 3 && / /.test(n.nodeValue)) { /* the spaces that push a line in */ } else return; }
      // an empty line, or a dash after one line break, opens the next line; one line break alone stays inside the line
      if (cur && brs && (brs > 1 || (n.nodeType === 3 && DASH.test(n.nodeValue) && n.nodeValue.trim().length > 0 && /^[\s ]*[-–—•]/.test(n.nodeValue)))) close();
      brs = 0; (cur = cur || []).push(n);
    });
    close();
    return lines.map((x) => {
      if (!Array.isArray(x)) return { kind: 'sub', node: x };
      while (x.length && (x[x.length - 1].nodeName === 'BR' || isBlank(x[x.length - 1]))) x.pop();
      while (x.length && x[0].nodeName === 'BR') x.shift();
      const t = firstText(x), m = t && DASH.exec(t.nodeValue);
      if (!m) { if (t && x[0] === t) t.nodeValue = t.nodeValue.replace(/^[ \t\r\n]+/, ''); return { kind: 'plain', nodes: x }; }
      const pad = (/^[\s ]*/.exec(t.nodeValue)[0].match(/ /g) || []).length;
      t.nodeValue = t.nodeValue.slice(m[0].length);
      return { kind: 'li', lvl: pad >= 4 ? 2 : 1, nodes: x };
    });
  }
  function listFlow(flow) {
    const lines = linesOf(flow); if (!lines.length) return;
    const out = document.createDocumentFragment(); let ul = null, sub = null;
    lines.forEach((l) => {
      if (l.kind === 'sub') { ul = sub = null; $$('br', l.node).forEach((b, i) => { if (!i && !b.previousSibling) b.remove(); }); out.appendChild(l.node); return; }
      if (l.kind === 'plain') { ul = sub = null; const d = document.createElement('div'); d.className = 'lm-plain'; l.nodes.forEach((n) => d.appendChild(n)); out.appendChild(d); return; }
      if (!ul) { ul = document.createElement('ul'); ul.className = 'lm-ul'; out.appendChild(ul); sub = null; }
      const li = document.createElement('li'); l.nodes.forEach((n) => li.appendChild(n));
      if (l.lvl === 2 && ul.lastElementChild) { if (!sub) { sub = document.createElement('ul'); sub.className = 'lm-ul'; ul.lastElementChild.appendChild(sub); } sub.appendChild(li); }
      else { sub = null; ul.appendChild(li); }
    });
    flow.textContent = ''; flow.appendChild(out); flow.classList.add('lm-flow');
  }
  function modernise(rootEl) {
    $$('.note-flow', rootEl).forEach((f) => { if (!/\bix-(notes|summary|dg-flow)\b/.test(f.className) && !f.querySelector('table')) listFlow(f); });
    $$('.section-head .num', rootEl).forEach((n) => { if (/^Questions \d+$/.test(n.textContent.trim())) n.textContent = n.textContent.trim().replace('Questions', 'Question'); });
    // map / plan / diagram: the title stands in the corner of the letter grid
    $$('.mx-table', rootEl).forEach((t) => {
      const corner = $('.mx-corner', t), wrap = t.closest('.mx-row-wrap, .eh-row') || t.parentElement; if (!corner || corner.textContent.trim()) return;
      let h = wrap.previousElementSibling; while (h && !h.classList.contains('section-head')) h = h.previousElementSibling;
      const h2 = h && $('h2', h), own = $('.mx-title', wrap), src = h2 || own;
      corner.textContent = src ? src.textContent.trim() : 'Map';
      if (src && (h2 || $('.mx-map svg', wrap))) src.classList.add('lm-moved');
    });
  }

  /* ═════════ the answer review ═════════ */
  let D = {}, OPT = {}, QTX = {}, EV = {};   // question -> its marked row, its options, its text, the words behind its answer
  let tab = 'questions';                     // 'questions' | 'vocabulary'
  let active = 0;                            // the question whose words are green in the transcript
  let find = '';                             // the search of the Vocabulary tab
  const open = new Set();                    // the explanation cards that are open
  const stateOf = (id) => ((D[id] || {}).status === 'correct' ? 'ok' : 'bad');
  const num = (id, label) => '<button type="button" class="lm-n ' + stateOf(id) + '" data-lm="open" data-q="' + id + '" aria-label="Question ' + esc(label || id) + '">' + esc(label || id) + '</button>';
  const answerText = (v) => esc(String(v == null ? '' : v).replace(/\s*\|\s*/g, ' / '));
  /* what an answer looks like: the word that was written, or a letter with what it stands for */
  function shown(id, v, short) {
    if (v == null || v === '') return '';
    const o = OPT[id] && OPT[id][String(v)];
    return answerText(v) + (o && !short && o.toLowerCase() !== String(v).toLowerCase() ? ' <span class="lm-soft">' + esc(o) + '</span>' : '');
  }
  const expl = (id) => ((engine.cfg || {}).explanations || {})[id] || {};
  const hasMore = (id) => !!(expl(id).en || evidenceOf(id).length);
  const more = (id) => (hasMore(id) ? '<button type="button" class="lm-more" data-lm="toggle" data-q="' + id + '" aria-expanded="' + open.has(id) + '">Explain More' + IC.chev + '</button>' : '');
  /* ✓ the answer   |   ✕ the answer that was given */
  function verdict(id, short) {
    const g = (D[id] || {}).ua;
    if (stateOf(id) === 'ok') return '<span class="lm-verdict">' + IC.check + '<b class="lm-yes">' + shown(id, g, short) + '</b></span>';
    return '<span class="lm-verdict">' + IC.x + (g ? '<s>' + shown(id, g, short) + '</s>' : '') + '</span>';
  }
  const answer = (id, short) => (stateOf(id) === 'ok' ? '' : '<b class="lm-answer">Answer: ' + shown(id, (D[id] || {}).ca, short) + '</b>');
  const ends = (id, short) => ' ' + answer(id, short) + ' ' + more(id);
  const zone = (ids) => '<div class="lm-zone">' + ids.filter((id) => open.has(id)).map(card).join('') + '</div>';
  const row = (id, body, extra) => '<div class="lm-row" id="lm-q-' + id + '" data-ids="' + id + '"><div class="lm-line-q">' + num(id) + '<div class="lm-q">' + body + '</div></div>' + (extra || '') + zone([id]) + '</div>';
  const letterOnly = (id) => /^[A-Z]$/i.test(String(engine.answers[id] || '').trim());
  const plain = (n) => { const c = n.cloneNode(true); $$('input,.opt-letter,.feedback-pill,.drag-num-hint,.drag-chip,svg', c).forEach((x) => x.remove()); return c.innerHTML.replace(/^(?:&nbsp;|\s)+|(?:&nbsp;|\s)+$/g, ''); };
  const textOf = (html) => el('<div>' + html + '</div>').textContent.replace(/\s+/g, ' ').trim();
  function readOptions(box) {
    const fields = $$('.drag-pool, .drag-drop[data-q]', box); let last = null;
    const pools = $$('.drag-pool', box), words = (p) => { const m = {}; $$('.drag-chip', p).forEach((c) => { const b = $('b, .eh-opt-l', c), t = c.cloneNode(true), l = $('b, .eh-opt-l', t); if (l && b.textContent.trim() === c.dataset.val) l.remove(); m[c.dataset.val] = t.textContent.replace(/\s+/g, ' ').trim(); }); return m; };
    const wordsOf = new Map(); pools.forEach((p) => wordsOf.set(p, words(p)));
    fields.forEach((f) => {
      if (f.classList.contains('drag-pool')) { last = f; return; }
      const layout = f.closest('.drag-match-layout'), own = (layout && $('.drag-pool', layout)) || last || pools.find((p) => f.compareDocumentPosition(p) & 4);
      if (own) OPT[+f.dataset.q] = wordsOf.get(own);
      const r = f.closest('.drag-item-row'); QTX[+f.dataset.q] = r ? textOf(plain($('.drag-item-label', r) || r)) : lineText(f);
    });
    $$('.q-card', box).forEach((c) => {
      const ids = c.dataset.msIds ? c.dataset.msIds.split(',').map(Number) : [Number(($('.q-pill', c) || {}).dataset ? $('.q-pill', c).dataset.qnum : 0)], o = {};
      $$('.option', c).forEach((x) => { const i = $('input', x); if (i) o[i.value] = textOf(plain(x)); });
      ids.forEach((id) => { OPT[id] = o; QTX[id] = textOf(plain($('.q-text', c) || c)); });
    });
    $$('.mx-row', box).forEach((r) => { QTX[+r.dataset.q] = textOf(plain($('.mx-t', r) || r)); });
    $$('.gap-field input.gap-input', box).forEach((i) => { QTX[+i.dataset.lq] = lineText(i); });
  }
  function lineText(n) { const h = n.closest('li,p,td,th,.lm-plain,.ix-li,.ix-line,.flow-box,.gap-line') || n.parentElement; return h ? textOf(plain(h)) : ''; }
  const listBox = (pool) => {
    const rows = $$('.drag-chip', pool).map((c) => { const m = OPTROW(c); return '<div class="lm-box-r">' + (m[0] ? '<b>' + esc(m[0]) + '</b>' : '') + '<span>' + m[1] + '</span></div>'; });
    return rows.length ? el('<div class="lm-box"><div class="lm-box-t">Answers</div>' + rows.join('') + '</div>') : null;
  };
  function OPTROW(c) { const l = $('b, .eh-opt-l', c), t = c.cloneNode(true), x = $('b, .eh-opt-l', t); if (l && l.textContent.trim() === c.dataset.val && x) { x.remove(); return [c.dataset.val, t.innerHTML.replace(/^(?:&nbsp;|\s)+/, '')]; } return ['', t.innerHTML]; }
  const chip = (id) => '<span class="lm-chip" id="lm-q-' + id + '">' + num(id) + verdict(id) + ends(id) + '</span>';
  const ROWHOST = 'li,.lm-plain,.ix-li,.ix-line,.gap-line';
  /* the paper of one part with every field replaced by its mark, the right answer and "Explain More" */
  function reviewPaper(p) {
    const box = document.createElement('div');
    box.innerHTML = engine.sheet(p); modernise(box);
    const src = $('[data-ix-part="' + p + '"]', box) || box;
    OPT = {}; QTX = {}; EV = {}; readOptions(src);
    $$('.kb-help,.feedback-pill,.ms-hint,.q-jump-btn,.drag-col-hdr', src).forEach((x) => x.remove());
    // map / plan: the picture and, beside it, one line per place
    $$('.mx-table', src).forEach((t) => {
      const ids = $$('.mx-row', t).map((r) => +r.dataset.q), holder = t.closest('.mx-box') || t;
      holder.replaceWith(el('<div class="lm-map-rows">' + ids.map((id) => row(id, esc(QTX[id]) + ' ' + verdict(id) + ends(id))).join('') + '</div>'));
    });
    // multiple choice
    $$('.q-card', src).forEach((c) => {
      const multi = !!c.dataset.msIds, ids = multi ? c.dataset.msIds.split(',').map(Number) : [+$('.q-pill', c).dataset.qnum];
      const right = ids.map((id) => String((D[id] || {}).ca || '').toUpperCase()), mine = ids.map((id) => String((D[id] || {}).ua || '').toUpperCase()).filter(Boolean);
      const opts = '<ul class="lm-opts">' + $$('.option', c).map((o) => { const v = $('input', o).value.toUpperCase(), r = right.indexOf(v) >= 0, m = mine.indexOf(v) >= 0;
        return '<li class="' + (r ? 'is-right' : m ? 'is-wrong' : '') + '"><b>' + esc(v) + '</b><span>' + plain(o) + '</span>' + (r ? IC.check : m ? IC.x : '') + '</li>'; }).join('') + '</ul>';
      const q = plain($('.q-text', c));
      if (!multi) { c.replaceWith(el(row(ids[0], q + ' ' + verdict(ids[0], true) + ends(ids[0], true), opts))); return; }
      const same = ids.every((id) => (expl(id).en || '') === (expl(ids[0]).en || '')), links = (same && expl(ids[0]).en ? ids.slice(0, 1) : ids).map(more).join(' ');
      c.replaceWith(el('<div class="lm-row" data-ids="' + ids.join(' ') + '"><div class="lm-line-q">' + ids.map((id) => '<span id="lm-q-' + id + '">' + num(id) + '</span>').join('') + '<div class="lm-q">' + q + ' '
        + (mine.length ? ids.filter((id) => (D[id] || {}).ua).map((id) => verdict(id, true)).join(' ') : IC.x)
        + (ids.every((id) => stateOf(id) === 'ok') ? '' : ' <b class="lm-answer">Answer: ' + right.filter((v, i) => right.indexOf(v) === i).join(', ') + '</b>') + ' ' + links + '</div></div>' + opts + zone(ids) + '</div>'));
    });
    // matching: one line per item, the list of answers under it
    $$('.drag-item-row', src).forEach((r) => { const z = $('.drag-drop', r); if (!z) return; const id = +z.dataset.q; r.replaceWith(el(row(id, plain($('.drag-item-label', r) || r) + ' ' + verdict(id) + ends(id)))); });
    $$('.drag-pool', src).forEach((pl) => { const b = listBox(pl); if (b) pl.replaceWith(b); else pl.remove(); });
    // boxes on a picture: the number on the picture, the answers under it
    $$('.map-zone', src).forEach((z) => { const d = $('[data-q]', z), id = d ? +d.dataset.q : 0; z.classList.add('lm-zone-n'); z.innerHTML = id ? num(id) : ''; });
    const under = (host, ids) => { if (ids.length) host.insertAdjacentElement('afterend', el('<div class="lm-list">' + ids.map((id) => row(id, verdict(id) + ends(id))).join('') + '</div>')); };
    $$('.ix-dg-flow', src).forEach((f) => { const ids = $$('input[data-lq]', f).map((i) => +i.dataset.lq); $$('.gap-field', f).forEach((g) => { const i = $('input[data-lq]', g); g.replaceWith(el(num(+i.dataset.lq))); }); under(f, ids); });
    $$('.eh-diagram, .dg-stage', src).forEach((f) => { const ids = $$('.lm-zone-n [data-q]', f).map((b) => +b.dataset.q); under(f, ids); });
    // gaps in running text
    const hosts = []; const gapsOf = new Map();
    $$('.gap-field', src).forEach((g) => { const h = g.closest('li,p,td,th,.lm-plain,.ix-li,.ix-line,.flow-box,.gap-line,.subhead') || g.parentElement; if (!gapsOf.has(h)) { gapsOf.set(h, []); hosts.push(h); } gapsOf.get(h).push(g); });
    hosts.forEach((h) => {
      const gs = gapsOf.get(h), ids = gs.map((g) => +$('input[data-lq]', g).dataset.lq);
      if (gs.length === 1 && h.matches(ROWHOST) && !h.closest('table,.flow-chart')) {
        // "31 also known as water bears (due to how they ✕ ) …   Answer: move   Explain More"
        const id = ids[0], subs = $$(':scope > ul', h);
        gs[0].replaceWith(el(verdict(id)));
        const line = document.createElement('span'); line.className = 'lm-inline'; line.id = 'lm-q-' + id;
        while (h.firstChild && subs.indexOf(h.firstChild) < 0) line.appendChild(h.firstChild);
        // "21 Their work could be delayed by the …": the number printed in the line is the badge now
        const w = document.createTreeWalker(line, NodeFilter.SHOW_TEXT); let t0; while ((t0 = w.nextNode()) && !t0.nodeValue.replace(/[\s\u00a0]+/g, '')) { /* blank */ }
        if (t0) { const p = t0.parentElement; const m = /^[\s\u00a0]*(\d{1,2})[\s\u00a0.)]+/.exec(t0.nodeValue); if (m && Number(m[1]) === id) t0.nodeValue = t0.nodeValue.slice(m[0].length); else if (p !== line && /^(B|STRONG)$/.test(p.tagName) && Number(p.textContent.trim()) === id) p.remove(); }
        line.insertAdjacentHTML('afterbegin', num(id) + ' '); line.insertAdjacentHTML('beforeend', ends(id));
        h.insertBefore(line, h.firstChild); line.insertAdjacentHTML('afterend', zone([id])); h.setAttribute('data-ids', id); h.classList.add('lm-has-q');
        return;
      }
      gs.forEach((g, i) => g.replaceWith(el(chip(ids[i]))));
      const outer = h.closest('.ix-ltable-wrap, table, .flow-chart') || h;
      const had = (outer.getAttribute('data-ids') || '').split(' ').filter(Boolean);
      outer.setAttribute('data-ids', had.concat(ids).join(' ')); outer.classList.add('lm-chips');
    });
    $$('.lm-chips', src).forEach((o) => { const ids = o.getAttribute('data-ids').split(' ').map(Number); o.removeAttribute('data-ids'); const w = document.createElement('div'); w.className = 'lm-block'; w.setAttribute('data-ids', ids.join(' ')); if (o.tagName === 'LI') { while (o.firstChild) w.appendChild(o.firstChild); o.appendChild(w); } else { o.replaceWith(w); w.appendChild(o); } w.insertAdjacentHTML('beforeend', zone(ids)); });
    $$('[id]', src).forEach((x) => { if (!/^lm-q-/.test(x.id)) x.removeAttribute('id'); });
    const out = document.createDocumentFragment(); while (src.firstChild) out.appendChild(src.firstChild);
    return out;
  }

  /* ───────── the transcript: the words behind every answer, with the number of the question ───────── */
  const same = (t) => String(t).replace(/[‘’‛ʼ`]/g, "'").replace(/[“”‟]/g, '"').replace(/[‐-―]/g, '-').replace(/ /g, ' ');   // the same length as the text
  const rx = (t) => same(t).trim().split(/[\s-]+/).filter(Boolean).map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s-]+');
  function findIn(text, phrase, whole) {
    const body = rx(phrase); if (!body) return null;
    // whole: a word of its own; 'start': the beginning of a word ("demolish" in "demolished")
    let m; try { m = new RegExp(whole ? '(^|[^a-z0-9])(' + body + ')' + (whole === 'start' ? '' : '(?![a-z0-9])') : '()(' + body + ')', 'i').exec(same(text)); } catch (e) { return null; }
    return m ? { s: m.index + m[1].length, e: m.index + m[0].length } : null;
  }
  function sentences(tx) {
    const out = [], re = /[.!?…]+["'”’)\]]*(?=\s|$)/g; let at = 0, m;
    while ((m = re.exec(tx))) { const e = m.index + m[0].length; if (e - at > 3) { out.push({ s: at, e }); at = e; } }
    if (tx.length - at > 1 && tx.slice(at).trim()) out.push({ s: at, e: tx.length });
    return out.map((x) => { const lead = /^\s*/.exec(tx.slice(x.s, x.e))[0].length; return { s: x.s + lead, e: x.e }; });
  }
  const STOP = ' the and for are was were that this with have has had not but you your they them their from into will would can could what which who when where why how all any one out about there here than then also some more most very just been being does did its his her she our each does per next such ';
  const stems = (t) => (same(t).toLowerCase().match(/[a-z0-9']{3,}/g) || []).filter((w) => STOP.indexOf(' ' + w + ' ') < 0).map((w) => w.slice(0, 5));
  // a word counts when one starts with the other (rent / rentals); the words of the right option count twice
  const meets = (have, w) => have.some((h) => h === w || (Math.min(h.length, w.length) >= 4 && (h.indexOf(w) === 0 || w.indexOf(h) === 0)));
  function score(text, want, want2) { const have = stems(text); let n = 0; want.forEach((w) => { if (meets(have, w)) n++; }); want2.forEach((w) => { if (meets(have, w)) n += 2; }); return n; }
  /* the lines of one part: [{ i, e }] */
  function linesOfPart(p) {
    const T = engine.transcript || [], out = [], hasParts = T.some((e) => e.type === 'break' && /part|section/i.test(e.label || '')); let cur = engine.paged && hasParts ? 0 : p, n = 0;
    T.forEach((e, i) => {
      if (e.type === 'break') { n++; if (engine.paged) { const m = /(?:part|section)\s*(\d)/i.exec(e.label || ''); cur = m ? +m[1] : n; } return; }
      if (!engine.paged || !hasParts || (cur || 1) === p) out.push({ i, e });
    });
    return out;
  }
  const bestSentence = (tx, id) => {
    const o = (OPT[id] || {})[String((D[id] || {}).ca || '')] || (letterOnly(id) ? '' : (D[id] || {}).ca || ''), a = stems(QTX[id] || ''), b = stems(o); let best = null, top = 0;
    let next = 0; sentences(tx).forEach((s) => { const v = score(tx.slice(s.s, s.e), a, b); if (v > top) { next = top; top = v; best = s; } else if (v > next) next = v; });
    // only a clear winner: when two sentences fit almost as well, the whole line is shown rather than a guess
    return best && top - next >= 2 ? { s: best.s, e: best.e, v: top } : null;
  };
  const around = (tx, at) => sentences(tx).find((s) => at.s >= s.s && at.s < s.e) || at;
  function evidenceOf(id) {
    if (EV[id]) return EV[id];
    const lines = linesOfPart(partOfQ(id)), out = [];
    (expl(id).evidence || []).slice(0, 3).forEach((t) => { for (const l of lines) { const h = findIn(l.e.tx, t); if (h) { out.push({ i: l.i, s: h.s, e: h.e }); break; } } });
    if (!out.length) {
      const vars = letterOnly(id) ? [] : engine.variants(engine.answers[id]); let l = lines.find((x) => (x.e.answers || []).indexOf(id) >= 0), at = null;
      const hit = (tx) => { for (const v of vars) { const h = findIn(tx, v, true); if (h) return h; } return null; };
      if (l) { at = hit(l.e.tx) || (l.e.aw && (l.e.answers || []).length === 1 ? findIn(l.e.tx, l.e.aw) : null); }
      else if (vars.length && vars[0].length > 1) {   // two answers in one line: the line of the question before it, or a later one
        const prev = lines.findIndex((x) => (x.e.answers || []).some((q) => q < id && q >= id - 3)), next = lines.findIndex((x) => (x.e.answers || []).some((q) => q > id));
        for (let k = Math.max(0, prev); k < lines.length && (next < 0 || k <= next); k++) { const h = hit(lines[k].e.tx); if (h) { l = lines[k]; at = h; break; } }
      }
      if (l) {
        const s = at ? around(l.e.tx, at) : bestSentence(l.e.tx, id) || { s: 0, e: l.e.tx.length };
        out.push({ i: l.i, s: s.s, e: s.e });
      }
    }
    return (EV[id] = out);
  }
  /* the line that fits best, when nothing in the test says where the answer is: only shown in the card, as a guess */
  function guessOf(id) {
    let best = null;
    linesOfPart(partOfQ(id)).forEach((l) => { const b = bestSentence(l.e.tx, id); if (b && b.v >= 3 && (!best || b.v > best.v)) best = { i: l.i, s: b.s, e: b.e, v: b.v }; });
    return best;
  }
  const clock = (t) => { t = Math.max(0, Math.round(+t || 0)); const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = String(t % 60).padStart(2, '0'); return (h ? h + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + s; };
  function timeOf(id) { const a = engine.times && engine.times[id]; if (a != null && a !== '') return +a; const ev = evidenceOf(id)[0], l = ev && engine.transcript[ev.i]; return l && l.t != null ? +l.t : null; }
  function lineHTML(tx, hits) {
    hits.sort((a, b) => a.s - b.s || b.e - a.e);
    const groups = [];
    hits.forEach((h) => {   // two questions that rest on the same words share one mark
      const g = groups[groups.length - 1];
      if (g && h.s < g.e) { g.e = Math.max(g.e, h.e); h.ids.concat(h.first).forEach((i) => { if (g.ids.indexOf(i) < 0) g.ids.push(i); }); h.first.forEach((i) => { if (g.first.indexOf(i) < 0) g.first.push(i); }); }
      else groups.push({ s: h.s, e: h.e, ids: h.ids.slice(), first: h.first.slice() });
    });
    let out = '', at = 0;
    groups.forEach((g) => {
      out += esc(tx.slice(at, g.s)) + '<mark class="lm-ev" data-qs="' + g.ids.sort((a, b) => a - b).join(' ') + '">'
        + g.first.sort((a, b) => a - b).map((id) => '<span class="lm-qb" role="button" tabindex="0" data-lm="goto" data-q="' + id + '" data-label="Q' + id + '" aria-label="Question ' + id + '"></span>').join('')
        + esc(tx.slice(g.s, g.e)) + '</mark>';
      at = g.e;
    });
    return out + esc(tx.slice(at));
  }
  function transcriptHTML(p) {
    const lines = linesOfPart(p), r = rangeOf(p), hits = {};
    for (let id = r.from; id <= r.to; id++) evidenceOf(id).forEach((h, k) => { (hits[h.i] = hits[h.i] || []).push({ s: h.s, e: h.e, ids: [id], first: k === 0 ? [id] : [] }); });
    const head = '<h3 class="lm-t-title">Listening Transcript</h3><h4 class="lm-t-part">' + esc(partName(p)) + '</h4>';
    if (!lines.length) return head + '<div class="lm-empty"><b>No transcript for this recording yet</b><span>The answers and the explanations are on the right.</span></div>';
    const timed = lines.some((l) => l.e.t != null);
    return head + '<div class="lm-lines' + (timed ? ' is-timed' : '') + '">' + lines.map((l) => {
      const t = l.e.t;
      return '<div class="lm-tl" data-i="' + l.i + '"' + (t != null ? ' data-t="' + t + '"' : '') + '>'
        + (timed ? (t != null ? '<button type="button" class="lm-time" data-lm="play" data-t="' + t + '" title="Play from here">' + clock(t) + '</button>' : '<span class="lm-time"></span>') : '')
        + '<div class="lm-tb">' + (l.e.sp ? '<div class="lm-sp">' + esc(l.e.sp) + '</div>' : '') + '<p class="lm-tx">' + lineHTML(String(l.e.tx || ''), hits[l.i] || []) + '</p></div></div>';
    }).join('') + '</div>';
  }
  const pane = (side) => $('#lm-review .lm-' + side);
  function setActive(id) {
    active = id || 0;
    $$('#lm-review .lm-ev').forEach((m) => m.classList.toggle('is-on', m.getAttribute('data-qs').split(' ').indexOf(String(id)) >= 0));
  }
  function bringUp(box, target, third) {
    if (!box || !target) return;
    const a = box.getBoundingClientRect(), b = target.getBoundingClientRect();
    box.scrollTo({ top: box.scrollTop + (b.top - a.top) - (third ? Math.max(40, a.height / 3) : 70), behavior: 'smooth' });
  }
  const dropTemp = () => $$('#lm-review mark.lm-temp').forEach((m) => { const q = m.parentNode; while (m.firstChild) q.insertBefore(m.firstChild, m); m.remove(); q.normalize(); });
  function flash(els) { els.forEach((m) => { m.classList.remove('is-hit'); void m.offsetWidth; m.classList.add('is-hit'); }); bringUp(pane('left'), els[0], true); }
  function showEvidence(id, quiet) {
    dropTemp(); setActive(id);
    const els = $$('#lm-review mark.lm-ev').filter((m) => m.getAttribute('data-qs').split(' ').indexOf(String(id)) >= 0);
    if (els.length) { flash(els); return true; }
    const g = !quiet && guessOf(id); if (!g) return false;
    return showAt(g.i, g.s, g.e);
  }
  /* marks [s, e) of a line for a moment (a guess, a word of the vocabulary) */
  function showAt(i, s, e) {
    const p = $('#lm-review .lm-tl[data-i="' + i + '"] .lm-tx'); if (!p) return false;
    const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), nodes = []; let t, at = 0;
    while ((t = w.nextNode())) { nodes.push({ t, at }); at += t.nodeValue.length; }
    const els = [];
    nodes.reverse().forEach((x) => {
      const a = Math.max(s, x.at), b = Math.min(e, x.at + x.t.nodeValue.length); if (a >= b) return;
      let n = x.t; if (a > x.at) n = n.splitText(a - x.at); if (n.nodeValue.length > b - a) n.splitText(b - a);
      const m = document.createElement('mark'); m.className = 'lm-temp'; n.parentNode.insertBefore(m, n); m.appendChild(n); els.unshift(m);
    });
    if (!els.length) return false;
    flash(els); return true;
  }

  /* ───────── the explanation card ───────── */
  function card(id) {
    const x = expl(id), d = D[id] || {}, ok = stateOf(id) === 'ok', ev = evidenceOf(id), t = timeOf(id), g = ev.length ? null : guessOf(id);
    const quotes = (ev.length ? ev : g ? [g] : []).map((h) => ({ sp: engine.transcript[h.i].sp, tx: String(engine.transcript[h.i].tx).slice(h.s, h.e) }));
    return '<article class="lm-card" data-card="' + id + '"><header class="lm-card-h"><span class="lm-n ' + (ok ? 'ok' : 'bad') + '">' + id + '</span><strong>Explanation</strong>'
      + '<button type="button" class="lm-card-x" data-lm="toggle" data-q="' + id + '" aria-label="Close the explanation">' + svg('<path d="M18 6 6 18M6 6l12 12"/>') + '</button></header>'
      + '<div class="lm-card-ans"><div><span>Your answer</span><b class="' + (ok ? 'ok' : 'bad') + '">' + (shown(id, d.ua) || 'Not answered') + '</b></div><div><span>Correct answer</span><b class="ok">' + shown(id, d.ca) + '</b></div></div>'
      + (x.en ? '<div class="lm-card-b"><h5>Why</h5><div>' + x.en + '</div></div>' : '')
      + (quotes.length ? '<div class="lm-card-b"><h5>' + (ev.length ? 'In the recording' : 'Closest words in the transcript') + '</h5>' + quotes.slice(0, 3).map((q) => '<blockquote>' + (q.sp ? '<i>' + esc(q.sp) + ':</i> ' : '') + esc(q.tx) + '</blockquote>').join('')
        + '<div class="lm-card-act"><button type="button" class="lm-find" data-lm="find" data-q="' + id + '">' + IC.pin + 'Show in the transcript</button>' : '<div class="lm-card-b"><div class="lm-card-act">')
      + (t != null ? '<button type="button" class="lm-find" data-lm="play" data-t="' + t + '" data-from="3">' + IC.play + 'Listen from ' + clock(t) + '</button>' : '') + '</div></div>'
      + (x.uz ? '<div class="lm-card-b lm-card-uz"><h5>O‘zbekcha</h5><div>' + x.uz + '</div></div>' : '') + '</article>';
  }
  const hostOf = (id) => $$('#lm-review .lm-right [data-ids]').find((x) => x.getAttribute('data-ids').split(' ').indexOf(String(id)) >= 0);
  /* a card that does not fit is scrolled up, but its question stays in sight under the tabs */
  function reveal(id, z) {
    const c = $('[data-card="' + id + '"]', z), box = pane('right'); if (!c || !box) return;
    const p = box.getBoundingClientRect(), r = c.getBoundingClientRect(), q = ($('#lm-q-' + id) || c).getBoundingClientRect();
    const over = r.bottom + 14 - p.bottom, room = Math.min(q.top, r.top) - p.top - 62;
    if (over > 0 && room > 0) box.scrollBy({ top: Math.min(over, room), behavior: 'smooth' });
  }
  function setCard(id, on, quiet) {
    if (!hasMore(id)) { if (on && !quiet) showEvidence(id, true); return; }
    const host = hostOf(id), z = host && $$('.lm-zone', host).find((x) => x.closest('[data-ids]') === host); if (!z) return;
    if (on === open.has(id)) { if (on && !quiet) reveal(id, z); return; }
    if (on) {
      open.add(id);
      const after = $$('[data-card]', z).find((c) => Number(c.getAttribute('data-card')) > id);   // the cards of one block stay in order
      z.insertBefore(el(card(id)), after || null);
      if (!quiet) { showEvidence(id, true); reveal(id, z); }
    } else { open.delete(id); const c = $('[data-card="' + id + '"]', z); if (c) c.remove(); }
    $$('#lm-review .lm-more[data-q="' + id + '"]').forEach((b) => b.setAttribute('aria-expanded', String(on)));
  }
  function goTo(id) {
    setTab('questions', true);
    const r = $('#lm-q-' + id); if (!r) return;
    bringUp(pane('right'), r); r.classList.remove('is-at'); void r.offsetWidth; r.classList.add('is-at');
    showEvidence(id, true);
  }

  /* ───────── the Vocabulary tab ───────── */
  const POS = { n: 'noun', v: 'verb', adj: 'adjective', a: 'adjective', adv: 'adverb', prep: 'preposition', conj: 'conjunction', pron: 'pronoun', phr: 'phrase', 'phr v': 'phrasal verb', 'phr.v': 'phrasal verb', pv: 'phrasal verb', idm: 'idiom', det: 'determiner' };
  const posName = (p) => { const k = String(p || '').trim().toLowerCase().replace(/\.$/, ''); return POS[k] || String(p || '').trim(); };
  const wordsOf = (p) => ((engine.cfg || {}).vocab || {})[p] || [];
  const wordHTML = (w) => '<article class="lm-word" data-find="' + esc((w.word + ' ' + w.def + ' ' + w.uz).toLowerCase()) + '"><div class="lm-word-h"><button type="button" class="lm-word-w" data-lm="word" data-word="' + esc(w.word) + '" title="Find it in the transcript">' + esc(w.word) + '</button>' + (w.pos ? '<span class="lm-pos">' + esc(posName(w.pos)) + '</span>' : '') + '</div>'
    + (w.def ? '<p class="lm-word-def">' + esc(w.def) + '</p>' : '') + (w.uz ? '<p class="lm-word-uz">' + esc(w.uz) + '</p>' : '') + (w.model ? '<p class="lm-word-ex">Example: “' + esc(w.model.replace(/^["“]|["”]$/g, '')) + '”</p>' : '') + '</article>';
  function vocabularyHTML(p) {
    const list = wordsOf(p);
    if (!list.length) return '<div class="lm-empty"><b>No word list for this part yet</b><span>The words of this recording will show here.</span></div>';
    return '<div class="lm-voc"><div class="lm-voc-h"><strong>Vocabulary (' + list.length + (list.length === 1 ? ' word)' : ' words)') + '</strong><label class="lm-search">' + IC.search + '<input type="search" placeholder="Search vocabulary..." aria-label="Search vocabulary" data-lm-search autocomplete="off" value="' + esc(find) + '"></label></div>'
      + '<div class="lm-words">' + list.map(wordHTML).join('') + '</div><div class="lm-none" hidden>No word found.</div></div>';
  }
  function filterWords() {
    const q = find.trim().toLowerCase(); let n = 0;
    $$('#lm-vocabulary .lm-word').forEach((w) => { const on = !q || w.getAttribute('data-find').indexOf(q) >= 0; w.hidden = !on; if (on) n++; });
    const none = $('#lm-vocabulary .lm-none'); if (none) none.hidden = n > 0;
  }
  function showWord(btn) {
    const w = btn.getAttribute('data-word'), forms = [[w, true], [w.length > 4 ? w.replace(/(e|y)$/i, '') : w, 'start']]; dropTemp();
    for (const f of forms) for (const l of linesOfPart(engine.part())) {   // the word itself, else a word that starts with it ("nestled")
      const h = findIn(l.e.tx, f[0], f[1]); if (h) { const end = /^[a-z]*/i.exec(l.e.tx.slice(h.e))[0].length; return showAt(l.i, h.s, h.e + (f[1] === 'start' ? end : 0)); }
    }
    btn.classList.add('is-missing'); btn.title = 'Not in this transcript in this form'; return false;
  }
  function setTab(t, keepScroll) {
    const box = pane('right'), changed = t !== tab; tab = t;
    ['questions', 'vocabulary'].forEach((k) => {
      const b = $('#lm-tab-' + k), x = $('#lm-' + k), on = k === t;
      if (b) { b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; }
      if (x) x.hidden = !on;
    });
    if (changed && box && !keepScroll) box.scrollTop = 0;
  }

  /* ───────── the player of the review (the part card) ───────── */
  const RATES = [0.75, 1, 1.25, 1.5, 2];
  function player() {
    const bar = $('#pbar-inner'); if (!bar) return;
    if (!$('#lm-player')) {
      bar.appendChild(el('<div id="lm-player" class="lm-only"><button type="button" class="lm-pb" data-lm="pp" aria-label="Play">' + IC.play + IC.pause + '</button><span class="lm-ptime">0:00 / 0:00</span>'
        + '<input type="range" class="lm-seek" min="0" max="1000" step="1" value="0" aria-label="Position in the recording"><button type="button" class="lm-pb" data-lm="mute" aria-label="Mute">' + IC.speaker + '</button>'
        + '<button type="button" class="lm-pb" data-lm="dots" aria-label="Playback options" aria-expanded="false">' + IC.dots + '</button><div class="lm-pmenu" hidden><div class="lm-pm-t">Playback speed</div>'
        + RATES.map((r) => '<button type="button" data-lm="rate" data-rate="' + r + '">' + (r === 1 ? 'Normal' : r + 'x') + '</button>').join('') + '<hr><button type="button" data-lm="skip" data-by="-10">Back 10 seconds</button><button type="button" data-lm="skip" data-by="10">Forward 10 seconds</button></div></div>'));
      const seek = $('#lm-player .lm-seek');
      seek.addEventListener('input', () => { const a = engine.audio(), len = a && engine.audioLength(a); if (!len) return; a._partDone = false; try { a.currentTime = engine.audioStart + seek.value / 1000 * len; } catch (e) { /* not loaded yet */ } tick(); });
    }
    const a = engine.audio();
    if (a && !a._lmWired) { a._lmWired = 1; ['timeupdate', 'play', 'pause', 'ended', 'loadedmetadata', 'durationchange', 'seeking', 'volumechange', 'ratechange', 'error'].forEach((n) => a.addEventListener(n, tick)); }
    tick();
  }
  const short = (t) => { t = Math.max(0, Math.floor(+t || 0)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
  function tick() {
    const box = $('#lm-player'), a = engine && engine.audio(); if (!box || !a || !inReview()) return;
    const len = engine.audioLength(a) || 0, at = Math.max(0, Math.min(len, a.currentTime - engine.audioStart)), playing = !a.paused && !a.ended;
    box.classList.toggle('is-playing', playing); box.classList.toggle('is-off', !!a.error || (a.networkState === 3 && a.readyState < 1));
    $('[data-lm="pp"]', box).setAttribute('aria-label', playing ? 'Pause' : 'Play');
    $('.lm-ptime', box).textContent = short(at) + ' / ' + short(len);
    const s = $('.lm-seek', box), v = len ? at / len * 1000 : 0; s.value = v; s.style.setProperty('--at', (v / 10) + '%');
    $$('[data-rate]', box).forEach((b) => b.classList.toggle('is-on', Number(b.getAttribute('data-rate')) === a.playbackRate));
    volumeLook();
    // the line that is being said
    let now = null; $$('#lm-review .lm-tl[data-t]').forEach((l) => { if (+l.getAttribute('data-t') <= a.currentTime + 0.05) now = l; });
    const was = $('#lm-review .lm-tl.is-now'); if (was !== now) { if (was) was.classList.remove('is-now'); if (now && (playing || a.currentTime > engine.audioStart + 0.5)) now.classList.add('is-now'); }
  }
  const pmenu = (on) => { const m = $('#lm-player .lm-pmenu'), b = $('#lm-player [data-lm="dots"]'); if (!m) return; m.hidden = !on; b.setAttribute('aria-expanded', String(on)); };

  /* ───────── the review screen ───────── */
  let drawnKey = '';
  function review(p) {
    p = p || engine.part();
    drawn(p); player();
    const content = $('#listening-area .listening-content') || $('#listening-area'); if (!content) return false;
    let box = $('#lm-review');
    if (!box) {
      box = el('<div id="lm-review" class="lm-only"><section class="lm-left" tabindex="0" aria-label="Transcript"></section>'
        + '<div class="lm-divider"><button type="button" class="lm-handle" role="separator" aria-orientation="vertical" aria-label="Move the line between the transcript and the questions">' + IC.dots + '</button></div>'
        + '<section class="lm-right" tabindex="0" aria-label="Review"></section></div>');
      content.appendChild(box); divider(box);
    }
    const key = p + '|' + (engine.state.finishedAt || '');
    if (key !== drawnKey) {
      if (drawnKey.split('|')[1] !== key.split('|')[1]) { open.clear(); tab = 'questions'; }
      drawnKey = key; active = 0; find = '';
      D = {}; engine.grade().detail.forEach((d) => { D[d.id] = d; });
      const paper = reviewPaper(p);   // reads the options of this part first: the transcript needs them
      pane('left').innerHTML = '<div class="lm-in lm-t-card">' + transcriptHTML(p) + '</div>';
      pane('right').innerHTML = '<div class="lm-tabs" role="tablist" aria-label="Review"><button type="button" role="tab" id="lm-tab-questions" data-lm="tab" data-tab="questions" aria-controls="lm-questions">Questions Review</button>'
        + '<button type="button" role="tab" id="lm-tab-vocabulary" data-lm="tab" data-tab="vocabulary" aria-controls="lm-vocabulary">Vocabulary (' + wordsOf(p).length + ')</button></div>'
        + '<div class="lm-in"><div id="lm-questions" role="tabpanel" aria-labelledby="lm-tab-questions"></div><div id="lm-vocabulary" role="tabpanel" aria-labelledby="lm-tab-vocabulary">' + vocabularyHTML(p) + '</div></div>';
      $('#lm-questions').appendChild(paper);
      pane('left').scrollTop = 0; pane('right').scrollTop = 0;
      setTab(tab, true);
    }
    markNav(); tick();
    return true;
  }
  function divider(box) {
    const h = $('.lm-handle', box); let on = false;
    const set = (v) => { v = Math.max(26, Math.min(74, v)); box.style.setProperty('--lm-left', v + '%'); h.setAttribute('aria-valuenow', Math.round(v)); };
    set(49);
    h.addEventListener('pointerdown', (e) => { on = true; h.setPointerCapture(e.pointerId); e.preventDefault(); box.classList.add('is-moving'); });
    h.addEventListener('pointermove', (e) => { if (!on) return; const r = box.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); });
    const end = () => { on = false; box.classList.remove('is-moving'); };
    h.addEventListener('pointerup', end); h.addEventListener('pointercancel', end);
    h.addEventListener('keydown', (e) => { const step = { ArrowLeft: -3, ArrowRight: 3 }[e.key]; if (step) { e.preventDefault(); set((parseFloat(box.style.getPropertyValue('--lm-left')) || 49) + step); } });
  }
  /* the bar: "n/10" in every part; in the review green = right, red = wrong, grey = not answered */
  function markNav() {
    const rev = inReview();
    $$('#listening-nav .bnav-pscore').forEach((s) => {
      s.textContent = s.textContent.replace(/\s+of\s+/, '/');
      const n = $('.sectionNr', s.closest('.bnav-part')), r = n && engine.paged && rangeOf(Number(n.textContent));
      if (rev && r) { let c = 0; for (let i = r.from; i <= r.to; i++) if ((D[i] || {}).status === 'correct') c++; s.textContent = c + '/' + (r.to - r.from + 1); }
    });
    if (!rev) return;
    $$('#listening-nav .qpill-wrap').forEach((w) => {
      const st = (D[Number(w.textContent)] || {}).status;
      w.classList.remove('answered'); w.classList.toggle('is-right', st === 'correct'); w.classList.toggle('is-wrong', st === 'wrong');
      const pill = $('.qpill', w); if (pill) pill.classList.toggle('current', Number(w.textContent) === active);
    });
  }
  function act(x) {
    const a = x.getAttribute('data-lm'), id = Number(x.getAttribute('data-q')), au = engine.audio();
    if (a === 'tab') return setTab(x.getAttribute('data-tab'));
    if (a === 'toggle') return setCard(id, !open.has(id));
    if (a === 'find') return showEvidence(id);
    if (a === 'open') return setCard(id, !open.has(id));          // a number in the list opens its card
    if (a === 'goto') { goTo(id); setCard(id, true, true); return; }  // a number in the transcript goes to its question
    if (a === 'word') return showWord(x);
    if (a === 'play') return engine.play(Number(x.getAttribute('data-t')), { runup: Number(x.getAttribute('data-from')) || 0 });
    if (a === 'pp') return ExamApp.togglePlayPause();
    if (a === 'mute') return toggleMute(null);
    if (a === 'dots') return pmenu($('#lm-player .lm-pmenu').hidden);
    if (a === 'rate') { pmenu(false); const r = Number(x.getAttribute('data-rate')); try { if (window.LSN.setRate) window.LSN.setRate(r); else ExamApp.setPlaybackRate(r); } catch (e) { /* no engine */ } if (au) tick(); return; }
    if (a === 'skip') { ExamApp.seekAudio(Number(x.getAttribute('data-by'))); tick(); }
  }
  document.addEventListener('click', (e) => {
    if (!isModern() || !inReview() || !e.target.closest) return;
    if (!e.target.closest('#lm-player [data-lm="dots"], .lm-pmenu')) pmenu(false);
    const x = e.target.closest('#stage-listening [data-lm]');
    if (x) { e.preventDefault(); return act(x); }
    const m = e.target.closest('#lm-review mark.lm-ev');
    if (m && !String(window.getSelection() || '').trim()) { const id = Number(m.getAttribute('data-qs').split(' ')[0]); goTo(id); setCard(id, true, true); }
  });
  document.addEventListener('input', (e) => { if (e.target.matches && e.target.matches('[data-lm-search]')) { find = e.target.value; filterWords(); } });
  document.addEventListener('keydown', (e) => {
    if (!isModern() || !inReview() || !e.target.closest) return;
    if (e.key === 'Escape') pmenu(false);
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.lm-qb')) { e.preventDefault(); act(e.target); }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && e.target.matches('.lm-tabs [role=tab]')) { const t = tab === 'questions' ? 'vocabulary' : 'questions'; setTab(t); const b = $('#lm-tab-' + t); if (b) b.focus(); }
  });

  /* ───────── what the engine reports ───────── */
  function on(name, data, api) {
    engine = api || engine;
    if (!isModern()) return false;
    if (name === 'sheet') { modernise(data); return true; }
    if (name === 'part') { if (inReview()) review(data); else drawn(data); return true; }
    if (name === 'review') return review();
    if (name === 'transport') return true;                       // the player of the review stands in the part card
    if (name === 'jump') { if (!inReview()) return false; const id = Number(data); if (!$('#lm-q-' + id)) review(partOfQ(id)); goTo(id); setTimeout(markNav, 0); return true; }
    if (name === 'nav') {                                        // nothing chosen yet: no ring on the first question
      const st = $('#stage-listening'); if (st) st.classList.toggle('lm-idle', !engine.state.activeQuestion);
      const b = $('#lm-submit'); if (b) b.textContent = finishedLabel();
      markNav(); return true;
    }
    if (name === 'notes') { const b = $('#notes-btn'); if (b) b.classList.toggle('lm-has', data > 0 || document.body.classList.contains('notes-typed')); return true; }
    return false;
  }
  window.ListeningUI = { on, apply, get current() { return current; } };
})();
