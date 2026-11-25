/*
 * IELTSX — the two looks of a Reading test.
 *
 *   "classic"  reading.css as it always was
 *   "modern"   assets/css/reading-modern.css on top of it, and the answer review drawn here: "Questions Review" with an
 *              explanation card under every question, and the "Vocabulary" tab
 *
 * The engine (reading.js) is the same for both: timer, answers, highlights, notes, settings, submitting, marking and the
 * results page do not change. This file only (1) decides which look the page has and (2) adds what the modern look needs.
 *
 * Who decides, the first one that is set:
 *   1. ?ui=modern | ?ui=classic in the address   one page view only (the "Preview" links of the admin panel)
 *   2. the student's own choice                  Account -> Interface, kept with the account (/api/account/reading-ui)
 *   3. the test                                  Admin -> Reading, "Interface" of a test (<html data-rui-test>), or
 *                                                Admin -> Reading interface for the built-in tests
 *   4. the website                               Admin -> Reading interface, the default
 * The last answer of the server is remembered in this browser, so the right look is there from the first paint.
 * A paper of a Full Mock is always classic.
 */
(function () {
  'use strict';
  if (window.ReadingUI) return;
  const root = document.documentElement;
  const KEY = 'ix-reading-ui';
  const UIS = ['classic', 'modern'];
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
    const own = root.getAttribute('data-rui-test') || (cfg.pages || {})[page];
    if (known(own)) return own;
    return known(cfg.default) ? cfg.default : 'classic';
  }
  let current = ''; let engine = null;
  const inReview = () => !!(document.body && document.body.classList.contains('review-mode'));
  const isModern = () => current === 'modern';
  // never in the middle of a test: an answer of the server that comes after Start counts from the next test
  const started = () => !!(engine && engine.state.stage === 'reading') || inReview();
  function apply(next) {
    if (next === current || started()) return;
    current = next;
    root.classList.toggle('rui-modern', next === 'modern');
    root.setAttribute('data-reading-ui', next);
  }
  apply(decide(remembered()));
  if (!MOCK && window.fetch && /^https?:$/.test(location.protocol)) {
    fetch('/api/reading-ui', { credentials: 'same-origin', cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((cfg) => {
      if (!cfg) return;
      remember({ default: cfg.default, choice: cfg.choice, pages: cfg.pages, pref: cfg.pref });
      apply(decide(cfg));
    }).catch(() => { /* offline: the remembered look stays */ });
  }

  /* ───────── small parts of the modern screen that the page does not have ───────── */
  const svg = (inner, cls) => '<svg class="' + (cls || 'rm-ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + inner + '</svg>';
  const IC = {
    menu: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    move: svg('<path d="m18 8 4 4-4 4M2 12h20M6 8l-4 4 4 4"/>'),
    dots: svg('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>', 'rm-ic rm-dots'),
    note: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    x: svg('<path d="M18 6 6 18M6 6l12 12"/>', 'rm-ic rm-ic-x'),
    check: svg('<path d="M20 6 9 17l-5-5"/>', 'rm-ic rm-ic-ok'),
    arrow: svg('<path d="M5 12h14M12 5l7 7-7 7"/>', 'rm-ic rm-ic-arr'),
    chev: svg('<path d="m9 18 6-6-6-6"/>', 'rm-ic rm-ic-chev'),
    pin: svg('<path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>')
  };
  function decorate() {
    const right = $('#hdr-right'); if (!right) return;
    if (!$('#rm-submit')) {
      const b = document.createElement('button');
      b.type = 'button'; b.id = 'rm-submit'; b.className = 'rm-only';
      // the same actions as the ✓ of the classic bar and the Finish button of the results page
      b.addEventListener('click', () => { if (inReview()) window.exFinish(); else window.ReadingUI.submit(b); });
      right.appendChild(b);
      const put = (sel, html) => { const el = $(sel); if (el && !$('.rm-only', el)) el.insertAdjacentHTML('beforeend', '<span class="rm-only">' + html + '</span>'); };
      put('#menu-btn', IC.menu); put('#notes-btn', IC.note); put('#div-btn', IC.move + IC.dots);
      const st = $('#hdr .ex-status');
      if (st) st.insertAdjacentHTML('beforeend', '<div class="rm-only rm-ttid" id="rm-ttid"></div>');
    }
    $('#rm-submit').textContent = inReview() ? 'Finish' : 'Submit';
    const id = $('#rm-ttid');
    if (id) { const u = window.IELTSXUser; id.textContent = 'Test taker ID: ' + (u && u.id ? String(u.id).replace(/[^a-z0-9]/gi, '').slice(-8).toUpperCase() : 'Guest'); }
  }
  document.addEventListener('ieltsx:user', () => { if (isModern() && $('#rm-submit')) decorate(); });

  /* ───────── after the engine has drawn a passage ───────── */
  function drawn(n) {
    decorate();
    const r = engine.range(n) || [0, 0], rev = inReview();
    const set = (sel, t) => { const el = $(sel); if (el) el.textContent = t; };
    set('#pbar-title', rev ? 'Reading Passage ' + n + ' Review' : 'Reading Part ' + n);
    set('#pbar-desc', rev ? 'Review your answers for questions ' + r[0] + '–' + r[1] + '.' : 'Read the passage and answer questions ' + r[0] + '–' + r[1] + '.');
    // "[Demo] Test 5 - P2: Solving the problem of waste disposal"
    const T = window.READING_TEST || {}, p = engine.passages[String(n)] || {}, title = $('#hdr-title');
    if (title) {
      const prefix = typeof T.TITLE_PREFIX === 'string' ? T.TITLE_PREFIX : '[Demo]', no = /\/test-(?:[a-z]\d+-)?(\d+)$/.exec(page);
      title.innerHTML = (prefix ? esc(prefix) + ' ' : '') + (no ? 'Test ' + no[1] + ' - ' : '') + 'P' + n + ': ' + (p.title || '');
      title.title = title.textContent;
    }
    // the number of a heading gap stands for the paragraph letter, unless another block asks for the letters
    const pane = $('#passage-pane'), secs = engine.sections[n] || [];
    if (pane) pane.classList.toggle('rm-noletters', !rev && secs.some((s) => s.type === 'matching-headings') && !secs.some((s) => s.type === 'matching-info'));
    const q = $('#questions-pane'); if (q && !rev) { q.classList.remove('rm-rev'); q.scrollTop = 0; }
  }

  /* ═════════ the answer review ═════════ */
  let D = {};                    // question number -> the marked row of the engine
  let tab = 'questions';         // 'questions' | 'vocabulary'
  const open = new Set();        // the explanation cards that are open
  const looked = [];             // the words looked up with a double click in this review
  const plain = (h) => engine.text(h).replace(/\s+/g, ' ').trim();
  const answerText = (v) => esc(String(v == null ? '' : v).replace(/\s*\|\s*/g, ' / '));
  const headingOf = (p, id) => ((p.headings || []).find((h) => String(h.id).toLowerCase() === String(id).toLowerCase()) || {}).text || '';
  /* what an answer looks like in the review: a letter with its name, a heading, a word of the list */
  function shown(sec, v) {
    if (v == null || v === '') return '';
    const p = engine.passages[String(sec._p)] || {};
    if (sec.type === 'matching-headings') return headingOf(p, v) || answerText(v);
    if (sec.type === 'matching-features') { const o = (sec.people || []).find((x) => x.l === v); return answerText(v) + (o ? ' <span class="rm-soft">' + (o.name || o.text || '') + '</span>' : ''); }
    if (sec.type === 'sentence-endings') { const o = (sec.endings || []).find((x) => x.l === v); return answerText(v) + (o ? ' <span class="rm-soft">' + o.text + '</span>' : ''); }
    if (sec.bank) { const o = sec.bank.find((x) => x.id === v || x.l === v); if (o) return o.word || o.text || answerText(v); }
    return answerText(v);
  }
  const stateOf = (id) => ((D[id] || {}).status === 'correct' ? 'ok' : 'bad');
  const num = (id, label) => '<button type="button" class="rm-n ' + stateOf(id) + '" data-rm="open" data-q="' + id + '" aria-label="Question ' + esc(label || id) + '">' + esc(label || id) + '</button>';
  function hasMore(id) {
    const e = engine.explanations[id];
    return !!(e && (e.en || e.uz || e.explanation || (e.paraphraseMap || []).length)) || !!evidenceOf(id).length;
  }
  const more = (id) => (hasMore(id) ? '<button type="button" class="rm-more" data-rm="toggle" data-q="' + id + '" aria-expanded="' + open.has(id) + '">Explain More' + IC.chev + '</button>' : '');
  const given = (id, sec) => { const d = D[id] || {}; return d.ua ? shown(sec, d.ua) : ''; };
  const arrow = (id, sec) => '<span class="rm-key">' + IC.arrow + '<b>' + shown(sec, (D[id] || {}).ca) + '</b></span>';
  /* ✓ the answer   |   ✕ the answer that was given → the right one */
  function verdict(id, sec) {
    if (stateOf(id) === 'ok') return ' <span class="rm-verdict">' + IC.check + '<b class="rm-right">' + shown(sec, (D[id] || {}).ua) + '</b></span>';
    const g = given(id, sec);
    return ' <span class="rm-verdict">' + IC.x + (g ? '<s>' + g + '</s>' : '') + '</span> ' + arrow(id, sec);
  }
  const zone = (ids) => '<div class="rm-zone">' + ids.filter((id) => open.has(id)).map(card).join('') + '</div>';
  const row = (id, body, extra) => '<div class="rm-row q-card" id="rq-card-' + id + '" data-ids="' + id + '"><div class="rm-line">' + num(id) + '<div class="rm-q">' + body + ' ' + more(id) + '</div></div>' + (extra || '') + zone([id]) + '</div>';
  /* a gap inside running text: its number, what was written and the right answer */
  function chip(id, sec, link) {
    const ok = stateOf(id) === 'ok', g = given(id, sec);
    return '<span class="rm-chip"' + (link ? ' id="rq-card-' + id + '"' : '') + '>' + num(id) + (ok ? IC.check + '<b class="rm-right">' + g + '</b>' : IC.x + (g ? '<s>' + g + '</s>' : '') + arrow(id, sec)) + (link ? more(id) : '') + '</span>';
  }
  const TOKEN = /\{\{\s*(\d+)\s*\}\}/g;
  const tokens = (t) => { const out = []; String(t || '').replace(TOKEN, (m, id) => { out.push(Number(id)); return m; }); return out; };
  const fill = (t, fn) => String(t || '').replace(TOKEN, (m, id) => fn(Number(id)));
  /* one sentence with one gap: "19 Farmers was set up as a ✕ business before it became a chain. → mail order  Explain More" */
  function gapLine(id, sec, before, after) {
    const ok = stateOf(id) === 'ok', g = given(id, sec);
    const gap = ok ? '<span class="rm-verdict">' + IC.check + '<b class="rm-right">' + g + '</b></span>' : '<span class="rm-verdict">' + IC.x + (g ? '<s>' + g + '</s>' : '') + '</span>';
    return row(id, (before || '') + ' ' + gap + ' ' + (after || '') + (ok ? '' : ' ' + arrow(id, sec)));
  }
  function itemParts(q) {   // the text before and after the gap of a question
    if (q.after !== undefined) return [String(q.label || '').replace(/^\s*(?:&bull;|•|&#8226;|-)\s*/, ''), q.after || ''];
    const parts = String(q.label || '').split(new RegExp(q.id + '\\s*_+')); return parts.length > 1 ? [parts[0], parts.slice(1).join(' ')] : [q.label || '', ''];
  }
  const noteTitle = (sec) => (sec.noteTitle ? '<h4 class="rm-note-title">' + sec.noteTitle + '</h4>' : '');
  function textLines(sec) {
    let html = '', lvl = 0;
    const close = (to) => { while (lvl > to) { html += '</ul>'; lvl--; } };
    (sec.lines || []).forEach((raw) => {
      const l = String(raw); let m;
      if ((m = /^##\s*(.*)$/.exec(l))) { close(0); html += '<div class="rm-sub">' + fill(m[1], (id) => chip(id, sec, true)) + '</div>'; return; }
      const b = /^(-{1,2})\s+(.*)$/.exec(l), want = b ? b[1].length : 0, text = b ? b[2] : l, ids = tokens(text);
      while (lvl < want) { html += '<ul class="rm-ul">'; lvl++; }
      close(want);
      let body;
      if (ids.length === 1) { const p = text.split(TOKEN); body = gapLine(ids[0], sec, p[0], p[2]); }
      else body = ids.length ? '<div class="rm-text">' + fill(text, (id) => chip(id, sec, true)) + '</div>' + zone(ids) : text;
      html += want ? '<li' + (ids.length > 1 ? ' data-ids="' + ids.join(' ') + '"' : '') + '>' + body + '</li>' : '<div class="rm-plain"' + (ids.length > 1 ? ' data-ids="' + ids.join(' ') + '"' : '') + '>' + body + '</div>';
    });
    close(0);
    return html;
  }
  /* a block of text with several gaps: the text, then one line per question with its Explain More */
  function block(sec, html, listed) {
    const ids = (sec.items || []).map((q) => q.id);
    return '<div class="rm-text-block" data-ids="' + (listed ? '' : ids.join(' ')) + '">' + html + (listed ? '' : zone(ids)) + '</div>'
      + (listed ? '<div class="rm-list">' + ids.map((id) => row(id, '<span class="rm-only-answer">' + verdict(id, sec) + '</span>')).join('') + '</div>' : '');
  }
  const listBox = (title, rows) => (rows.length ? '<div class="rm-box"><div class="rm-box-t">' + title + '</div>' + rows.map((r) => '<div class="rm-box-r"><b>' + r[0] + '</b><span>' + r[1] + '</span></div>').join('') + '</div>' : '');
  const R = {
    tfng: (sec) => sec.items.map((q) => row(q.id, (q.label || '') + verdict(q.id, sec))).join(''),
    'matching-info': (sec) => sec.items.map((q) => row(q.id, (q.label || '') + verdict(q.id, sec))).join(''),
    'matching-features': (sec) => sec.items.map((q) => row(q.id, (q.label || '') + verdict(q.id, sec))).join('') + listBox(sec.bankLabel || 'List of people', (sec.people || []).map((x) => [x.l, x.name || x.text || ''])),
    'sentence-endings': (sec) => sec.items.map((q) => row(q.id, (q.stem || q.label || '') + verdict(q.id, sec))).join(''),
    'matching-headings': (sec) => {
      const p = engine.passages[String(sec._p)] || {}, letter = {}; (p.headingSlots || []).forEach((x) => { letter[x.qNum] = x.letter; });
      return sec.items.map((q) => row(q.id, 'Paragraph ' + (letter[q.id] || '') + verdict(q.id, sec))).join('') + listBox('List of Headings', (p.headings || []).map((h) => [h.id, h.text]));
    },
    mcq: (sec) => sec.items.map((q) => {
      const d = D[q.id] || {};
      const opts = (q.options || []).map((o) => { const l = o.charAt(0), right = l === String(d.ca).toUpperCase(), mine = l === d.ua;
        return '<li class="' + (right ? 'is-right' : mine ? 'is-wrong' : '') + '"><b>' + l + '</b><span>' + o.substring(3) + '</span>' + (right ? IC.check : mine ? IC.x : '') + '</li>'; }).join('');
      return row(q.id, (q.label || '') + verdict(q.id, sec), '<ul class="rm-opts">' + opts + '</ul>');
    }).join(''),
    'mcq-multi': (sec) => {
      const ids = sec.items.map((q) => q.id), right = sec.items.map((q) => String(q.answer)), mine = ids.map((id) => (D[id] || {}).ua).filter(Boolean);
      const opts = (sec.options || []).map((o) => { const r = right.indexOf(o.l) >= 0, m = mine.indexOf(o.l) >= 0;
        return '<li class="' + (r ? 'is-right' : m ? 'is-wrong' : '') + '"><b>' + o.l + '</b><span>' + o.t + '</span>' + (r ? IC.check : m ? IC.x : '') + '</li>'; }).join('');
      const same = ids.every((id) => (engine.explanations[id] || {}).explanation === (engine.explanations[ids[0]] || {}).explanation);
      const links = (same ? ids.slice(0, 1) : ids).map((id) => more(id)).join(' ');
      return '<div class="rm-row q-card" id="rq-multi-' + sec.gid + '" data-ids="' + ids.join(' ') + '"><div class="rm-line">' + ids.map((id) => '<span id="rq-card-' + id + '">' + num(id) + '</span>').join('') + '<div class="rm-q">' + (sec.prompt || '') + ' '
        + ids.map((id) => verdict(id, sec)).join(' ') + ' ' + links + '</div></div><ul class="rm-opts">' + opts + '</ul>' + zone(ids) + '</div>';
    },
    short: (sec) => sec.items.map((q) => { const p = itemParts(q); return gapLine(q.id, sec, p[0], p[1]); }).join(''),
    sentence: (sec) => (sec.lines ? textLines(sec) : R.short(sec)),
    notes: (sec) => noteTitle(sec) + (sec.prose ? block(sec, fill(sec.prose, (id) => chip(id, sec, true))) : sec.lines ? textLines(sec)
      : '<ul class="rm-ul">' + sec.items.map((q) => { const p = itemParts(q); return '<li>' + gapLine(q.id, sec, p[0], p[1]) + '</li>'; }).join('') + '</ul>'),
    summary: (sec) => noteTitle(sec) + (sec.prose ? block(sec, fill(sec.prose, (id) => chip(id, sec, true))) : sec.lines ? textLines(sec)
      : block(sec, sec.items.map((q) => { const p = itemParts(q); return p[0] + ' ' + chip(q.id, sec, true) + ' ' + p[1]; }).join(' '))),
    wordbank: (sec) => noteTitle(sec) + block(sec, fill(sec.prose, (id) => chip(id, sec, true))) + listBox('List of words', (sec.bank || []).map((w) => [w.id, w.word])),
    table: (sec) => {
      const cols = (sec.headers || (sec.rows || [])[0] || []).length, cell = (c) => fill(c, (id) => chip(id, sec));
      return noteTitle(sec) + block(sec, '<div class="rm-scroll"><table class="rt-table">' + (sec.tableTitle ? '<tr><th class="tbl-title" colspan="' + cols + '">' + sec.tableTitle + '</th></tr>' : '')
        + (sec.headers ? '<tr>' + sec.headers.map((h) => '<th>' + h + '</th>').join('') + '</tr>' : '')
        + (sec.rows || []).map((r) => (r.length === 1 ? '<tr><th colspan="' + cols + '">' + cell(r[0]) + '</th></tr>' : '<tr>' + r.map((c, i) => (i === 0 && sec.rowHeaders ? '<th>' + cell(c) + '</th>' : '<td>' + cell(c) + '</td>')).join('') + '</tr>')).join('') + '</table></div>', true);
    },
    flowchart: (sec) => noteTitle(sec) + block(sec, (sec.flowTitle ? '<div class="rm-note-title">' + sec.flowTitle + '</div>' : '') + '<div class="rm-flow">' + (sec.boxes || []).map((b) => '<div class="rm-flow-box">' + fill(b, (id) => chip(id, sec)) + '</div>').join('') + '</div>', true),
    diagram: (sec) => noteTitle(sec) + block(sec, sec.dg ? fill(sec.dg, (id) => num(id))
      : '<div class="map-wrap"><img class="map-img" src="' + esc(sec.image) + '" alt="">' + (sec.labels || []).map((L) => '<span class="map-label" style="left:' + L.x + '%;top:' + L.y + '%">' + num(L.id) + '</span>').join('') + '</div>', true)
  };
  R.ynng = R.tfng; R.map = R.diagram;
  function sectionHTML(sec) {
    const ids = (sec.items || []).map((q) => q.id); if (!ids.length) return '';
    const a = Math.min.apply(null, ids), b = Math.max.apply(null, ids);
    const draw = R[sec.type] || ((s) => s.items.map((q) => row(q.id, (q.label || q.stem || '') + verdict(q.id, s))).join(''));
    return '<section class="rm-sec"><h3>' + (a === b ? 'Question ' + a : 'Questions ' + a + ' - ' + b) + '</h3>' + (sec.instruction ? '<p class="rm-instr">' + sec.instruction + '</p>' : '') + draw(sec) + '</section>';
  }

  /* ───────── the explanation card ───────── */
  const EV = {};
  function evidenceOf(id) { if (!EV[id]) EV[id] = (engine.evidence(id) || []).map((t) => plain(t)).filter(Boolean); return EV[id]; }
  function secOf(id) { const p = engine.passageOf(id); return (engine.sections[p] || []).find((s) => (s.items || []).some((q) => q.id === id)) || { items: [], _p: p }; }
  function card(id) {
    const e = engine.explanations[id] || {}, d = D[id] || {}, sec = secOf(id), ok = stateOf(id) === 'ok';
    const ev = evidenceOf(id); let quotes = ev, label = 'In the passage';
    const notGiven = /^not given$/i.test(String(d.ca || ''));
    if (!quotes.length && !notGiven) { const s = engine.sentence(id, $('#passage-pane .passage-text') || document.createElement('div')); if (s) { quotes = [s]; label = 'Closest sentence in the passage'; } }
    const pairs = (e.paraphraseMap || []).map((x) => [x.q, x.p]).concat((e.synonyms || []).map((x) => [x[0], x[1]])).filter((x) => x[0] && x[1]);
    const why = e.en || String(e.explanation || '');
    return '<article class="rm-card" data-card="' + id + '"><header class="rm-card-h"><span class="rm-n ' + (ok ? 'ok' : 'bad') + '">' + id + '</span><strong>Explanation</strong>'
      + '<button type="button" class="rm-card-x" data-rm="toggle" data-q="' + id + '" aria-label="Close the explanation">' + svg('<path d="M18 6 6 18M6 6l12 12"/>') + '</button></header>'
      + '<div class="rm-card-ans"><div><span>Your answer</span><b class="' + (ok ? 'ok' : 'bad') + '">' + (given(id, sec) || 'Not answered') + '</b></div><div><span>Correct answer</span><b class="ok">' + shown(sec, d.ca) + '</b></div></div>'
      + (why ? '<div class="rm-card-b"><h5>Why</h5><div class="rm-card-why">' + why + '</div></div>' : '')
      + (quotes.length ? '<div class="rm-card-b"><h5>' + label + '</h5>' + quotes.slice(0, 3).map((t) => '<blockquote>' + esc(t) + '</blockquote>').join('') + '<button type="button" class="rm-find" data-rm="find" data-q="' + id + '">' + IC.pin + 'Show in the passage</button></div>' : '')
      + (pairs.length ? '<div class="rm-card-b"><h5>Synonyms</h5><ul class="rm-pairs">' + pairs.map((x) => '<li><span>' + x[0] + '</span>' + IC.arrow + '<span>' + x[1] + '</span></li>').join('') + '</ul></div>' : '')
      + (e.uz ? '<div class="rm-card-b rm-card-uz"><h5>O‘zbekcha</h5><div>' + e.uz + '</div></div>' : '') + '</article>';
  }
  const hostOf = (id) => $$('#questions-pane [data-ids]').find((el) => el.getAttribute('data-ids').split(' ').indexOf(String(id)) >= 0);
  /* a card that does not fit is scrolled up, but its question stays in sight under the tabs */
  function reveal(id, z) {
    const c = $('[data-card="' + id + '"]', z), pane = $('#questions-pane'); if (!c || !pane) return;
    const p = pane.getBoundingClientRect(), r = c.getBoundingClientRect(), q = ($('#rq-card-' + id) || c).getBoundingClientRect();
    const over = r.bottom + 14 - p.bottom, room = Math.min(q.top, r.top) - p.top - 62;
    if (over > 0 && room > 0) pane.scrollBy({ top: Math.min(over, room), behavior: 'smooth' });
  }
  function setCard(id, on, quiet) {
    if (!hasMore(id)) return;
    const host = hostOf(id), z = host && $$('.rm-zone', host).find((x) => x.closest('[data-ids]') === host); if (!z) return;
    if (on === open.has(id)) { if (on && !quiet) reveal(id, z); return; }
    if (on) {
      open.add(id);
      const after = $$('[data-card]', z).find((c) => Number(c.getAttribute('data-card')) > id);   // the cards of one block stay in order
      const tmp = document.createElement('div'); tmp.innerHTML = card(id); z.insertBefore(tmp.firstChild, after || null);
      if (!quiet) { showEvidence(id); reveal(id, z); }
    } else { open.delete(id); const c = $('[data-card="' + id + '"]', z); if (c) c.remove(); }
    $$('#questions-pane .rm-more[data-q="' + id + '"]').forEach((b) => b.setAttribute('aria-expanded', String(on)));
  }

  /* ───────── the passage: the words behind every answer, with the number of the question ───────── */
  function textMap(rootEl) {
    const w = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, { acceptNode: (t) => (t.parentElement && t.parentElement.closest('.para-heading-slot,.para-letter,input,select,textarea,button') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    const nodes = []; let flat = '', t;
    while ((t = w.nextNode())) { nodes.push({ node: t, at: flat.length }); flat += t.nodeValue; }
    return { nodes, flat: engine.norm(flat) };
  }
  function findIn(flat, phrase, wholeWord) {
    const body = engine.norm(String(phrase).trim()).split(/\s+/).map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+'); if (!body) return null;
    let m; try { m = new RegExp(wholeWord ? '(?:^|[^a-z0-9])(' + body + ')' : body, 'i').exec(flat); } catch (e) { return null; }
    return m ? (wholeWord ? { s: m.index + m[0].length - m[1].length, e: m.index + m[0].length } : { s: m.index, e: m.index + m[0].length }) : null;
  }
  /* wraps [s, e) of the text: one element per piece of text it crosses; returns them in order */
  function wrap(map, s, e, make) {
    const out = [];
    for (let i = map.nodes.length - 1; i >= 0; i--) {
      const x = map.nodes[i], len = x.node.nodeValue.length, a = Math.max(s, x.at), b = Math.min(e, x.at + len);
      if (a >= b) continue;
      let t = x.node; if (a > x.at) t = t.splitText(a - x.at);
      if (t.nodeValue.length > b - a) t.splitText(b - a);
      const el = make(); t.parentNode.insertBefore(el, t); el.appendChild(t); out.unshift(el);
    }
    return out;
  }
  function paint(n) {
    const box = $('#passage-pane .passage-text'); if (!box || box.getAttribute('data-rm-painted')) return;
    box.setAttribute('data-rm-painted', '1');
    const map = textMap(box), hits = [];
    (engine.sections[n] || []).forEach((sec) => (sec.items || []).forEach((q) => evidenceOf(q.id).slice(0, 3).forEach((t, k) => {
      const h = findIn(map.flat, t); if (h) hits.push({ s: h.s, e: h.e, ids: [q.id], first: k === 0 ? [q.id] : [] });
    })));
    hits.sort((a, b) => a.s - b.s || b.e - a.e);
    const groups = [];
    hits.forEach((h) => {   // two questions that rest on the same words share one mark
      const g = groups[groups.length - 1];
      if (g && h.s < g.e) { g.e = Math.max(g.e, h.e); h.ids.forEach((i) => { if (g.ids.indexOf(i) < 0) g.ids.push(i); }); h.first.forEach((i) => { if (g.first.indexOf(i) < 0) g.first.push(i); }); }
      else groups.push(h);
    });
    const badged = {};
    groups.forEach((g) => { g.badges = (g.first.length ? g.first : g.ids).filter((i) => !badged[i]); g.badges.forEach((i) => { badged[i] = 1; }); });
    for (let i = groups.length - 1; i >= 0; i--) {
      const g = groups[i]; g.ids.sort((a, b) => a - b); g.badges.sort((a, b) => a - b);
      const parts = wrap(map, g.s, g.e, () => { const m = document.createElement('mark'); m.className = 'rm-ev'; m.setAttribute('data-qs', g.ids.join(' ')); return m; });
      // the label is drawn by the style sheet (data-label), so the text of the passage stays as it is
      if (parts[0]) g.badges.slice().reverse().forEach((id) => { const b = document.createElement('span'); b.className = 'rm-qb'; b.setAttribute('role', 'button'); b.tabIndex = 0; b.setAttribute('data-rm', 'open'); b.setAttribute('data-q', id); b.setAttribute('data-label', 'Q' + id); b.setAttribute('aria-label', 'Question ' + id); parts[0].insertBefore(b, parts[0].firstChild); });
    }
  }
  function flash(els) {
    if (!els.length) return false;
    $$('#passage-pane .is-hit').forEach((m) => m.classList.remove('is-hit'));
    els.forEach((m) => { m.classList.remove('is-hit'); void m.offsetWidth; m.classList.add('is-hit'); });
    const pane = $('#passage-pane'), a = pane.getBoundingClientRect(), b = els[0].getBoundingClientRect();
    pane.scrollTo({ top: pane.scrollTop + (b.top - a.top) - Math.max(40, a.height / 3), behavior: 'smooth' });
    return true;
  }
  function dropTemp() { $$('#passage-pane mark.rm-temp').forEach((m) => { const p = m.parentNode; while (m.firstChild) p.insertBefore(m.firstChild, m); m.remove(); p.normalize(); }); }
  function showPhrase(t, wholeWord) {
    const box = $('#passage-pane .passage-text'); if (!box || !t) return false;
    dropTemp();
    const map = textMap(box), h = findIn(map.flat, t, wholeWord); if (!h) return false;
    return flash(wrap(map, h.s, h.e, () => { const m = document.createElement('mark'); m.className = 'rm-temp'; return m; }));
  }
  function showEvidence(id) {
    dropTemp();
    const els = $$('#passage-pane mark.rm-ev').filter((m) => m.getAttribute('data-qs').split(' ').indexOf(String(id)) >= 0);
    if (flash(els)) return true;
    const slot = $('#hslot-' + id); if (slot) { slot.scrollIntoView({ block: 'center', behavior: 'smooth' }); return true; }
    if (/^not given$/i.test(String((D[id] || {}).ca || ''))) return false;
    return showPhrase(engine.sentence(id, $('#passage-pane .passage-text') || document.createElement('div')));
  }
  /* the heading gaps of the passage show the right heading */
  function slots(n) {
    const p = engine.passages[String(n)] || {};
    (p.headingSlots || []).forEach((x) => {
      const el = $('#hslot-' + x.qNum); if (!el || el.getAttribute('data-rm')) return;
      el.setAttribute('data-rm', 'open'); el.setAttribute('data-q', x.qNum); el.removeAttribute('onclick');
      el.classList.add('filled', stateOf(x.qNum) === 'ok' ? 'correct' : 'wrong');
      el.innerHTML = '<span class="rm-n ' + stateOf(x.qNum) + '">' + x.qNum + '</span><span class="slot-text">' + headingOf(p, (D[x.qNum] || {}).ca) + '</span>';
    });
  }

  /* ───────── the Vocabulary tab ───────── */
  const wordsOf = (n) => ((engine.vocabulary || {})[n] || {}).words || [];
  const wordCount = (n) => wordsOf(n).length + looked.length;
  function wordCard(w) {
    return '<article class="rm-word"><div class="rm-word-h"><b>' + esc(w.label || w.word) + '</b>' + (w.pos ? '<i>' + esc(w.pos) + '</i>' : '') + (w.cefr ? '<span class="rm-cefr">' + esc(w.cefr) + '</span>' : '')
      + '<button type="button" class="rm-find" data-rm="word" data-word="' + esc(w.word) + '">' + IC.pin + 'Show in the passage</button></div>'
      + (w.def ? '<p class="rm-word-def">' + esc(w.def) + '</p>' : '') + (w.uz ? '<p class="rm-word-uz">' + esc(w.uz) + '</p>' : '') + (w.model ? '<p class="rm-word-ex">' + esc(w.model) + '</p>' : '') + '</article>';
  }
  function vocabularyHTML(n) {
    const list = wordsOf(n), syn = (engine.synonyms || {})[n] || [];
    let html = list.length ? '<div class="rm-words">' + list.map(wordCard).join('') + '</div>' : '';
    if (syn.length) html += '<h3 class="rm-voc-h">Synonyms in this passage</h3><ul class="rm-pairs rm-voc-pairs">' + syn.map((r) => '<li><em>' + esc(r.id) + '</em><span>' + r.q + '</span>' + IC.arrow + '<span>' + r.p + '</span></li>').join('') + '</ul>';
    if (looked.length) html += '<h3 class="rm-voc-h">Words you looked up</h3><div class="rm-words">' + looked.map((w) => wordCard({ word: w.word, uz: w.uz })).join('') + '</div>';
    if (!list.length && !syn.length && !looked.length) html = '<div class="rm-empty"><b>No word list for this passage yet</b><span>Double-click any word in the passage to see its translation. The words you look up are collected here.</span></div>';
    else html += '<p class="rm-tip">Double-click any word in the passage to see its translation.</p>';
    return html;
  }
  function refreshVocabulary() {
    const box = $('#rm-vocabulary'), n = engine.state.currentPassage; if (!box) return;
    box.innerHTML = vocabularyHTML(n);
    const c = $('#rm-tab-vocabulary'); if (c) c.textContent = 'Vocabulary (' + wordCount(n) + ')';
  }
  function setTab(t, keepScroll) {
    const pane = $('#questions-pane'), changed = t !== tab; tab = t;
    ['questions', 'vocabulary'].forEach((k) => {
      const b = $('#rm-tab-' + k), box = $('#rm-' + k), on = k === t;
      if (b) { b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; }
      if (box) box.hidden = !on;
    });
    if (changed && pane && !keepScroll) pane.scrollTop = 0;
  }
  function review(n) {
    drawn(n);
    const pane = $('#questions-pane'); if (!pane) return false;
    const have = $('.rm-review', pane);
    if (!have || have.getAttribute('data-p') !== String(n)) {
      D = {}; engine.grade().detail.forEach((d) => { D[d.id] = d; });
      pane.classList.add('rm-rev');
      pane.innerHTML = '<div class="rm-review" data-p="' + n + '"><div class="rm-tabs" role="tablist" aria-label="Review">'
        + '<button type="button" role="tab" id="rm-tab-questions" data-rm="tab" data-tab="questions" aria-controls="rm-questions">Questions Review</button>'
        + '<button type="button" role="tab" id="rm-tab-vocabulary" data-rm="tab" data-tab="vocabulary" aria-controls="rm-vocabulary">Vocabulary (' + wordCount(n) + ')</button></div>'
        + '<div id="rm-questions" role="tabpanel" aria-labelledby="rm-tab-questions">' + (engine.sections[n] || []).map(sectionHTML).join('') + '</div>'
        + '<div id="rm-vocabulary" role="tabpanel" aria-labelledby="rm-tab-vocabulary">' + vocabularyHTML(n) + '</div></div>';
      pane.scrollTop = 0;
      setTab(tab, true);
    }
    slots(n); paint(n); markNav();
    return true;
  }
  /* the bar of the review: green = right, red = wrong, grey = not answered */
  function markNav() {
    $$('#reading-nav .qpill').forEach((b) => {
      const ids = (b.textContent.match(/\d+/g) || []).map(Number), all = []; if (!ids.length) return;
      for (let i = ids[0]; i <= ids[ids.length - 1]; i++) all.push((D[i] || {}).status);
      const right = all.every((x) => x === 'correct');
      b.classList.remove('on');
      b.classList.toggle('is-right', right);
      b.classList.toggle('is-wrong', !right && all.some((x) => x === 'wrong' || x === 'correct'));
    });
  }
  function act(el) {
    const a = el.getAttribute('data-rm'), id = Number(el.getAttribute('data-q'));
    if (a === 'tab') return setTab(el.getAttribute('data-tab'));
    if (a === 'toggle') return setCard(id, !open.has(id));
    if (a === 'find') return showEvidence(id);
    if (a === 'word') { if (!showPhrase(el.getAttribute('data-word'), true)) { el.classList.add('is-missing'); el.lastChild.textContent = 'Not in this passage in this form'; } return; }
    if (a === 'open') {   // a number: in the list it opens the card, in the passage it goes to the question
      setTab('questions', true);
      if (el.closest('#passage-pane')) { engine.jump(id); setCard(id, true, true); } else setCard(id, !open.has(id));
    }
  }
  document.addEventListener('click', (e) => {
    if (!isModern() || !inReview()) return;
    const el = e.target.closest && e.target.closest('#stage-reading [data-rm]');
    if (el) { e.preventDefault(); return act(el); }
    const m = e.target.closest && e.target.closest('#passage-pane mark.rm-ev');
    if (m && !String(window.getSelection() || '').trim()) { const id = Number(m.getAttribute('data-qs').split(' ')[0]); setTab('questions', true); engine.jump(id); setCard(id, true, true); }
  });
  document.addEventListener('keydown', (e) => {
    if (!isModern() || !inReview() || !e.target.closest) return;
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.rm-qb')) { e.preventDefault(); act(e.target); }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && e.target.matches('.rm-tabs [role=tab]')) { const t = tab === 'questions' ? 'vocabulary' : 'questions'; setTab(t); const b = $('#rm-tab-' + t); if (b) b.focus(); }
  });

  /* ───────── what the engine reports ───────── */
  function on(name, data, api) {
    engine = api || engine;
    if (!isModern()) return false;
    if (name === 'passage') { drawn(data); return true; }
    if (name === 'review') return review(data);
    if (name === 'question') { if (inReview()) setTimeout(() => { setTab('questions', true); setCard(data, true, true); showEvidence(data); }, 380); return true; }
    if (name === 'jump') { if (inReview()) setTab('questions', true); return true; }
    if (name === 'gap') {   // a sentence ending that was moved into its gap: the whole ending, not only its letter
      const zone = $('#wdrop-' + data), sec = secOf(data), v = engine.state.readingAnswers[data];
      const o = zone && sec.type === 'sentence-endings' && (sec.endings || []).find((x) => x.l === v);
      if (o) zone.innerHTML = '<span><b>' + esc(o.l) + '</b> ' + o.text + '</span>';
      return true;
    }
    if (name === 'nav') { const st = $('#stage-reading'); if (st) st.classList.toggle('rm-idle', !engine.state.activeQuestion); if (inReview()) markNav(); return true; }   // nothing chosen yet: no ring on the first question
    if (name === 'notes') { const b = $('#notes-btn'); if (b) b.classList.toggle('rm-has', data > 0); return true; }
    if (name === 'lookup' && inReview()) {
      const w = String(data && data.word || '').trim(); if (!w || looked.some((x) => x.word === w)) return true;
      looked.unshift({ word: w, uz: String(data.uz || '') }); if (looked.length > 60) looked.pop();
      refreshVocabulary(); return true;
    }
    return false;
  }
  window.ReadingUI = {
    on, apply, submit: () => {},
    get current() { return current; }
  };
  // ExamApp is a top-level const of reading.js: not on window, but reachable from any script that runs after it
  window.ReadingUI.submit = (btn) => { /* global ExamApp */ ExamApp.confirmSubmit(btn); };
})();
