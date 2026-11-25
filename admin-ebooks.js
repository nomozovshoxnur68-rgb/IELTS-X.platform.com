/*
 * IELTSX admin: E-books (admin.html#ebooks, #ebooks?book=<id>) — the server is ebooks.js.
 * Everything about an e-book is done here: make one (title, author, plan, cover, PDF, design — or from a file), change it, copy
 * it, export it (JSON or text), hide it, delete it; add its units one by one or many at once (Import); put them in order
 * (drag), in parts, hide or copy one. The unit editor shows the page while it is written, names the lines with mistakes (a
 * press goes to the line) and keeps an unsaved unit in this browser. A book of Admin → Books can get units here too.
 *   book      its DESIGN: the website's look, a course book, a workbook or a vocabulary book ("In Use")
 *   unit      title, kind (Lesson, Reading, Listening …), minutes, a short summary, its BOOK PAGE (the format of
 *             ebook-doc.js: sections, Exam advice boxes, passages, numbered exercises with gaps, A/B/C, TFNG, matching …,
 *             written with the snippet buttons and seen in the preview), an optional recording, an optional link to a test
 *             of this website, and simple exercises (choice · gap · True / False / Not Given · Yes / No / Not Given)
 * The answers stay on the server until the student presses Check; the student's progress (and their teacher's view of it)
 * comes from the results kept by the server.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const icon = (n) => (window.IXAdminIcon ? window.IXAdminIcon(n) : '');
  const PLANS = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  const KINDS = { lesson: 'Lesson', reading: 'Reading', listening: 'Listening', vocabulary: 'Vocabulary', grammar: 'Grammar', writing: 'Writing', speaking: 'Speaking', test: 'Test', review: 'Review' };
  const KIND_K = { reading: 'var(--c3)', listening: 'var(--c2)', writing: 'var(--c4)', speaking: 'var(--c5)', vocabulary: 'var(--c1)', grammar: 'var(--c5)', test: 'var(--c2)' };
  const TYPES = { choice: 'Choice (A, B, C …)', gap: 'Gap (typed answer)', tfng: 'True / False / Not Given', yng: 'Yes / No / Not Given' };
  const TF = { tfng: ['True', 'False', 'Not Given'], yng: ['Yes', 'No', 'Not Given'] };
  const STYLE_NAMES = { site: 'Website look', course: 'Course book', workbook: 'Workbook', inuse: 'Vocabulary book (In Use)' };
  const LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const CATS = ['Vocabulary', 'Grammar', 'Reading', 'Listening', 'Writing', 'Speaking', 'Course book', 'Workbook', 'Cambridge IELTS', 'General'];
  const STYLE_INFO = {
    site: 'The colours and cards of this website.',
    course: '"Unit 1" in a magenta circle, magenta sections with a blue second word, numbered circles, blue "Exam advice" boxes and pink "Questions 1–5" boxes — like an IELTS course book.',
    workbook: 'The same layout in the greys of a workbook.',
    inuse: 'A spread, like a vocabulary "In Use" book: the pale green page with the unit number, lettered sections A, B, C, "Common mistakes" and "Tip" boxes, and the white page of exercises 1.1, 1.2 …'
  };
  const SNIPS = {
    sec: ['Section', '# Reading | Section 1\n', 'Page'],
    letter: ['Section A, B …', '# [A] The title of part A\nThe explanation with **a collocation** …\n', 'Page'],
    exs: ['Exercises', '# Exercises\n', 'Page'],
    tablex: ['Table', '| collocation | example | meaning |\n| **take notes** | I took notes in the lecture. | write down what you hear |\n| **meet a deadline** | We met the deadline. | finish in time |\n', 'Page'],
    mistakes: ['Common mistakes', '::: mistakes\nWe **make a mistake**, NOT ~~do a mistake~~.\n:::\n', 'Boxes'],
    tip: ['Tip', '::: tip\nWrite down the whole collocation, not the single word.\n:::\n', 'Boxes'],
    help: ['Language help', '::: help\nUse *…* in formal English.\n:::\n', 'Boxes'],
    you: ['Your turn', '::: you\nWrite three sentences about yourself with collocations from this unit.\n:::\n', 'Boxes'],
    advice: ['Exam advice', '::: advice True / False / Not Given\n- If the passage expresses the same information, write TRUE.\n- If it expresses the opposite, write FALSE.\n- If it does not include the information, write NOT GIVEN.\n:::\n', 'Boxes'],
    info: ['Exam information', '::: info\n- You hear a conversation between two people.\n- You write your answers while you listen.\n:::\n', 'Boxes'],
    panel: ['Grammar panel', '::: panel Key grammar\n- one syllable: *cheap → cheaper → the cheapest*\n:::\n', 'Boxes'],
    passage: ['Reading passage', '::: passage The title of the text\n**A** The first paragraph …\n\n**B** The second paragraph …\nSource: adapted from …\n:::\n', 'Texts'],
    email: ['E-mail', '::: email The weekend\nFrom: Ann\nTo: Ben\nHi Ben,\nI **had a great time** …^1^\n:::\n', 'Texts'],
    letter2: ['Letter', '::: letter The Sports Club\nDear Ms Karimova,\n\nThank you for …\n\nYours sincerely,\n:::\n', 'Texts'],
    ad: ['Advert', '::: ad The Grand Hotel\nAre you looking for **the perfect venue**? …\n:::\n', 'Texts'],
    news: ['Newspaper', '::: news The headline\nThe text of the article …\nFrom a local paper\n:::\n', 'Texts'],
    web: ['Web page', '::: web www.example.com/blog\nToday we **set off at dawn** …\n:::\n', 'Texts'],
    chat: ['Conversation', '::: chat\nAnn: How was the party?\nBen: We **had a great time**!\n:::\n', 'Texts'],
    foot: ['Footnotes', '::: footnotes\n1 the meaning of the first word\n2 the meaning of the second word\n:::\n', 'Texts'],
    match: ['Match', '::: task Match the two parts of these collocations.\n@match\n@cols\n1 meet = the deadline\n2 take = notes\n3 pay = attention\nExtra: a mistake\n:::\n', 'Exercises'],
    pick: ['Circle the word', '::: task Circle the correct word.\n1 They had some {problems*|troubles} at first.\n2 Pollution {affects*|effects} our health.\n:::\n', 'Exercises'],
    gaps: ['Gaps in sentences', '::: task Complete the sentences with the correct form of the word in brackets.\n1 Life in the city is [more expensive] (expensive) than in my town.\n2 This is the [busiest] (busy) street in the city.\n3 Several right answers: [faster|quicker].\n:::\n', 'Exercises'],
    first: ['First letters', '::: task Complete the sentences. The first letter is given.\n1 It was b[itterly] cold last night.\n2 I v[ividly] remember my first day at school.\n:::\n', 'Exercises'],
    words: ['Box of words', '::: task Complete the sentences with words from the box.\nBox: crowded, rent, commute\n1 My daily [commute] takes an hour.\n2 The [rent] is very high.\n3 The buses are [crowded] in the morning.\n:::\n', 'Exercises'],
    correct: ['Correct the mistake', '::: task Find and correct the mistake in each sentence.\n1 The noise effects my sleep. = affects\n2 It had a bad affect on me. = effect\n:::\n', 'Exercises'],
    labels: ['F / I / N labels', '::: task Write F (formal), I (informal) or N (neutral).\n@labels F, I, N\n1 Passengers must not alight while the bus is moving. = F\n2 Let\'s grab a bite. = I\n:::\n', 'Exercises'],
    talkgap: ['Conversation gaps', '::: task Complete the conversation.\n@chat\nAnn: Did you [meet] the deadline?\nBen: Yes, I [handed] in my essay on Friday.\n:::\n', 'Exercises'],
    talk: ['Discussion', '::: task Work in pairs. Discuss these questions.\n- The first question?\n- The second question?\n:::\n', 'Exercises'],
    choice: ['A / B / C', '::: task Answer Questions 1–2.\nQuestions 1–2\nChoose the correct letter, A, B or C.\n1 The question?\nA the first option\nB the right option *\nC the third option\n2 Which TWO …? (two right options)\nA …  *\nB …\nC …  *\n:::\n', 'Exam tasks'],
    tfng: ['TRUE / FALSE / NG', '::: task Answer Questions 1–3.\nQuestions 1–3\nDo the following statements agree with the information given in the reading passage?\n1 A statement that is true. = T\n2 A statement that is false. = F\n3 A statement the text does not talk about. = NG\nWhy: the text never mentions it.\n:::\n', 'Exam tasks'],
    ynng: ['YES / NO / NG', '::: task Answer Questions 1–3.\nQuestions 1–3\nDo the following statements agree with the claims of the writer?\n1 … = Y\n2 … = N\n3 … = NG\n:::\n', 'Exam tasks'],
    notes: ['Note / summary', '::: task Complete the summary below.\nQuestions 1–3\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nRoof gardens keep buildings [cooler] in summer and hold [rainwater] for a while, so the [drains] overflow less often.\n:::\n', 'Exam tasks'],
    table: ['Form', '::: task Complete the form below.\nQuestions 1–3\nWrite ONE WORD AND/OR A NUMBER for each answer.\n### APPLICATION FORM\n| Name: | Anna [Kowalska] |\n| Age: | [=21] |\n| Phone: | [0771 845 302|0771845302] |\n| Interests: | singing and [dancing] |\n:::\n', 'Exam tasks'],
    headings: ['Headings / A–F', '::: task Choose the correct heading for each paragraph.\nQuestions 1–3\n@match\nA The first heading\nB The second heading\nC The third heading\nD A heading you do not need\n1 Paragraph A = B\n2 Paragraph B = C\n3 Paragraph C = A\n:::\n', 'Exam tasks'],
    flow: ['Flow-chart', '::: task Complete the flow-chart. Use ONE WORD for each answer.\n@flow\nThe first step with a [gap]\nThe second step with a [gap]\nThe last step\n:::\n', 'Exam tasks']
  };
  const MARKS = { b: ['B', '**', '**', 'Bold — a collocation (Ctrl+B)'], i: ['I', '*', '*', 'Italic (Ctrl+I)'], u: ['U', '__', '__', 'Underlined'], s: ['S', '~~', '~~', 'Crossed out'], m: ['▮', '==', '==', 'Marked'], sup: ['x¹', '^', '^', 'A footnote number'], gap: ['[ ]', '[', ']', 'A gap with its answer'], pick: ['{ | }', '{', '*|other}', 'Circle the word'] };
  const SAMPLE_TEXT = '== Work and study\n=== Studying\nkind: vocabulary\nminutes: 20\nsummary: take notes, meet a deadline\n---\n# [A] Verbs\nWe **take notes** and **meet a deadline**.\n\n# Exercises\n::: task Complete the sentences.\n1 I always [take] notes.\n2 You must [meet] the deadline.\n:::\n\n=== The next unit\n---\n# [A] …';
  let books = null, loading = false, book = null, units = null, draft = null, original = '', tests = null, pasteOpen = false, bookStyle = 'site', preview = null, showKey = false;
  let info = null, infoOrig = '';                       // the details of a book (a new one, or the open one)
  let imp = null;                                       // Import: { text, mode, report, busy, forNew }
  let query = '', unitQuery = '', lastHash = '', openId = 0, keptAt = '';
  const BOOK0 = { title: '', author: '', description: '', category: 'Vocabulary', level: '', plan: 'free', published: true, cover: '', file: '', pages: 0 };

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  const post = (url, body) => api(url, { method: 'POST', body: JSON.stringify(body || {}) });
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const mount = () => $('#content-ebooks');
  const wantBook = () => { const m = /[?&]book=(b-[a-f0-9]{8})/.exec(location.hash); return m ? m[1] : null; };
  const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
  const ls = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* private window */ } } };
  const field = (label, html, hint) => `<label class="lbl">${label}${html}${hint ? `<span class="muted sm" style="font-weight:400;display:block;margin-top:4px">${hint}</span>` : ''}</label>`;

  /* ───────── the books ───────── */
  async function loadBooks() {
    if (loading) return; loading = true; if (!books) render();
    try { books = (await api('/api/admin/ebooks')).books; } catch (e) { fail(e); books = books || []; } finally { loading = false; }
    render();
  }
  async function openBook(id) {
    const my = ++openId;
    book = null; units = null; draft = null; info = null; imp = null; unitQuery = ''; render();
    try { const d = await api('/api/admin/ebooks/' + encodeURIComponent(id)); if (my !== openId) return; take(d); }
    catch (e) { if (my !== openId) return; fail(e); location.hash = '#ebooks'; return; }
    render();
  }
  function take(d) { book = d.book; units = d.units; bookStyle = d.style || 'site'; }
  const planBadge = (p) => `<span class="badge badge-plan-${esc(p)}">${p === 'free' ? 'Free' : '🔒 ' + esc(PLANS[p] || p)}</span>`;
  function coverHtml(b, style) {
    if (b.cover) return `<img src="${esc(b.cover)}" alt="" loading="lazy">`;
    return `<span class="eb-acover eb-acover-${esc(style || 'site')}"><b>${esc(b.title || 'Title')}</b><i></i>${b.level ? `<em>${esc(b.level)}</em>` : ''}</span>`;
  }
  function render() {
    const m = mount(); if (!m) return;
    if (draft) return renderEditor();
    if (imp) return renderImport();
    if (info) return renderInfo();
    const bid = wantBook();
    if (bid) {
      if (!book || book.id !== bid) { m.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
      return renderUnits();
    }
    if (!books) { m.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
    const q = query.toLowerCase();
    const shown = books.filter((b) => !q || [b.title, b.author, b.category, b.level].join(' ').toLowerCase().includes(q));
    const has = (id) => books.some((b) => b.id === id);
    m.innerHTML = `
      <div class="pd-hero card">
        <div class="pd-hero-text"><div class="eyebrow">The Books page as interactive e-books</div><h2>E-books</h2>
          <p class="muted">Make a book, choose its design, add its units: the student reads them on the website and every exercise is checked. Students see how much they have learned, teachers see it too. Use only books and texts you have the right to publish.</p></div>
        <div class="btn-row"><a class="btn" href="/books" target="_blank" rel="noopener">Open the Books page ↗</a><button class="btn" data-eb="import-new" type="button">Import a file</button><button class="btn btn-primary" data-eb="new-book" type="button">+ New e-book</button></div>
      </div>
      <div class="card">
        <div class="toolbar"><div class="muted sm" style="flex:1 1 auto">${plural(books.length, 'book')} · ${books.filter((b) => b.units).length} with units · ${books.filter((b) => b.published).length} on the website</div>
          <input class="field" data-eb-search type="search" placeholder="Search books" value="${esc(query)}" style="flex:0 1 240px">
          <span class="eb-ready"><select class="field" id="eb-sample-which" aria-label="Which ready e-book">${has('b-c0110ca7') ? '' : '<option value="collocations">Advanced Collocations for IELTS (24 units)</option>'}<option value="inuse">Vocabulary book · In Use (sample)</option><option value="course">Course book (sample)</option><option value="workbook">Workbook (sample)</option><option value="starter">Starter workbook (website look)</option></select><button class="btn" data-eb="sample" type="button">+ Add a ready one</button></span></div>
        <div class="pd-list">${shown.map((b) => `<div class="pd-row${b.published ? '' : ' is-hidden'}">
          <a class="eb-thumb" href="#ebooks?book=${esc(b.id)}" tabindex="-1" aria-hidden="true">${coverHtml(b, b.style)}</a>
          <div class="pd-main"><div class="pd-title"><strong>${esc(b.title)}</strong>${planBadge(b.plan)}${b.published ? '' : '<span class="badge">Hidden</span>'}${b.style && b.style !== 'site' && b.units ? `<span class="badge badge-info">${esc(STYLE_NAMES[b.style] || b.style)}</span>` : ''}</div>
            <div class="muted sm">${b.units ? plural(b.units, 'unit') + (b.hidden ? ' (' + b.hidden + ' hidden)' : '') + ' · ' + plural(b.exercises, 'question') : '<span class="pn-warn">no units yet</span>'}${b.author ? ' · ' + esc(b.author) : ''}${b.level ? ' · ' + esc(b.level) : ''}${b.hasFile ? ' · PDF ✓' : ''}</div></div>
          <div class="actions pd-actions"><button class="btn btn-sm" data-eb="book-publish" data-id="${esc(b.id)}" type="button">${b.published ? 'Hide' : 'Publish'}</button><button class="btn btn-sm" data-eb="book-copy" data-id="${esc(b.id)}" type="button">Copy</button><a class="btn btn-sm" href="/books#${esc(b.id)}" target="_blank" rel="noopener">View ↗</a><a class="btn btn-sm btn-primary" href="#ebooks?book=${esc(b.id)}">${b.units ? 'Edit' : 'Add units'}</a><button class="btn btn-sm btn-danger btn-icon" data-eb="book-delete" data-id="${esc(b.id)}" type="button" title="Delete" aria-label="Delete">✕</button></div></div>`).join('') || `<div class="empty">${books.length ? 'Nothing matches.' : 'No books yet. Press “New e-book”, or add a ready one.'}</div>`}</div>
      </div>`;
  }

  /* ───────── the details of a book: a new one, or the open one ───────── */
  const designCards = (cur) => `<div class="eb-designs" role="radiogroup" aria-label="Design of the book">${Object.keys(STYLE_NAMES).map((k) => `<button type="button" class="eb-dcard${k === cur ? ' on' : ''}" data-eb="info-style" data-style="${k}" role="radio" aria-checked="${k === cur}"><span class="eb-dprev eb-dprev-${k}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><b>${esc(STYLE_NAMES[k])}</b></button>`).join('')}</div>`;
  function openInfo(b, style, text) {
    info = { ...BOOK0, ...(b ? JSON.parse(JSON.stringify(b)) : {}), style: style || 'inuse', text: text || '' };
    infoOrig = JSON.stringify(info); render(); window.scrollTo(0, 0);
    const t = mount().querySelector('[data-i="title"]'); if (t && !info.id) t.focus();
  }
  function readInfo() {
    const m = mount(); if (!info || !m) return;
    m.querySelectorAll('[data-i]').forEach((el) => { const k = el.getAttribute('data-i'); info[k] = el.type === 'checkbox' ? el.checked : k === 'pages' ? Number(el.value) || 0 : el.value; });
  }
  const infoDirty = () => { if (!info) return false; readInfo(); return JSON.stringify(info) !== infoOrig; };
  function renderInfo() {
    const m = mount(), d = info;
    m.innerHTML = `<div class="card pd-editor-head"><div class="btn-row" style="justify-content:space-between"><div><div class="eyebrow">E-books</div><strong style="font-size:16px">${d.id ? 'Details of the book' : 'New e-book'}</strong></div>
        <div class="btn-row"><button class="btn" data-eb="info-cancel" type="button">Cancel</button><button class="btn btn-primary" data-eb="info-save" type="button">${d.id ? 'Save' : 'Create the e-book'}</button></div></div></div>
      <div class="card pn-form eb-info">
        <div class="eb-info-cover"><div class="eb-drop" data-eb-drop="cover"><div class="eb-info-pic">${coverHtml(d, d.style)}</div><span class="muted sm">Drop a picture here</span></div>
          <div class="btn-row"><button class="btn btn-sm" type="button" data-eb="info-upload" data-k="cover" data-accept="image/*">${d.cover ? 'Change the cover' : 'Upload a cover'}</button>${d.cover ? '<button class="btn btn-sm" type="button" data-eb="info-clear" data-k="cover">Remove</button>' : ''}</div><span class="muted sm">Without a picture the book gets a cover in the colours of its design.</span></div>
        <div class="eb-info-main">
          ${field('Title *', `<input class="field" data-i="title" value="${esc(d.title)}" maxlength="160" placeholder="e.g. Collocations for Band 7">`)}
          <div class="pn-grid2">${field('Author', `<input class="field" data-i="author" value="${esc(d.author)}" maxlength="120" placeholder="e.g. IELTSX Team">`)}${field('Category', `<input class="field" data-i="category" list="eb-cats" value="${esc(d.category)}" maxlength="40"><datalist id="eb-cats">${CATS.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>`)}</div>
          <div class="pn-grid2">${field('Level (CEFR)', `<select class="field" data-i="level">${LEVELS.map((l) => `<option value="${l}"${d.level === l ? ' selected' : ''}>${l || 'Any level'}</option>`).join('')}</select>`)}${field('Who may open it', `<select class="field" data-i="plan">${Object.entries(PLANS).map(([v, n]) => `<option value="${v}"${d.plan === v ? ' selected' : ''}>${v === 'free' ? 'Free — everybody' : n + ' and higher'}</option>`).join('')}</select>`)}</div>
          ${field('Description', `<textarea class="field" data-i="description" rows="3" maxlength="1500" placeholder="What is inside the book">${esc(d.description)}</textarea>`)}
          <div class="lbl">Design${designCards(d.style)}<span class="muted sm" style="font-weight:400;display:block;margin-top:6px">${esc(STYLE_INFO[d.style] || '')}</span></div>
          <div class="pn-grid2">${field('PDF of the book (optional)', `<div class="pn-upload"><input class="field" data-i="file" value="${esc(d.file)}" placeholder="https://… or upload"><button class="btn btn-sm" type="button" data-eb="info-upload" data-k="file" data-accept=".pdf,application/pdf">Upload</button></div>`, 'Only a file you have the right to publish.')}${field('Pages of the PDF', `<input class="field" data-i="pages" type="number" min="0" max="9999" value="${esc(d.pages || '')}" placeholder="e.g. 140">`)}</div>
          ${d.id ? '' : field('Units (optional: many at once)', `<textarea class="field pn-mono" data-i="text" rows="7" spellcheck="false" placeholder="${esc(SAMPLE_TEXT)}">${esc(d.text)}</textarea>`, 'One <code>=== Title</code> line starts every unit; <code>== Part</code> starts a part of the book. You can also add the units later, one by one or from a file.')}
          <label class="pn-check"><input type="checkbox" data-i="published"${d.published !== false ? ' checked' : ''}> Shown on the website</label>
          <div id="eb-info-problems"></div>
        </div>
      </div>`;
  }
  const problemsHtml = (list) => (list && list.length ? `<div class="eb-prev-errors"><b>${plural(list.length, 'unit')} to fix:</b><ul>${list.map((x) => `<li><b>${esc(x.n)}. ${esc(x.title)}</b>${x.line ? ` (from line ${x.line} of the text)` : ''}: ${esc(x.error)}</li>`).join('')}</ul></div>` : '');
  async function saveInfo() {
    readInfo();
    const btn = mount().querySelector('[data-eb="info-save"]'); if (btn) btn.disabled = true;
    const { style, text: txt, id, ...b } = info;
    try {
      if (id) {
        let d = await post('/api/admin/ebooks/' + encodeURIComponent(id) + '/info', { book: b });
        if (style !== bookStyle) d = await post('/api/admin/ebooks/' + encodeURIComponent(id) + '/style', { style });
        take(d); info = null; books = null; toast('Saved'); return render();
      }
      const r = await fetch('/api/admin/ebooks', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ book: b, style, text: txt }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { const p = $('#eb-info-problems'); if (p) p.innerHTML = problemsHtml(d.problems); throw new Error(d.error || 'Request failed (' + r.status + ')'); }
      info = null; books = null; toast('E-book created' + (d.units ? ' · ' + plural(d.units, 'unit') : '')); location.hash = '#ebooks?book=' + d.book.id;
    } catch (e) { fail(e); if (btn) btn.disabled = false; }
  }

  /* ───────── Import: many units from a text or a file ───────── */
  function renderImport() {
    const m = mount(), d = imp, r = d.report;
    m.innerHTML = `<div class="card pd-editor-head"><div class="btn-row" style="justify-content:space-between"><div><div class="eyebrow">${esc(d.forNew ? 'E-books' : book.title)}</div><strong style="font-size:16px">Import units</strong></div>
        <div class="btn-row"><button class="btn" data-eb="imp-cancel" type="button">Cancel</button><button class="btn" data-eb="imp-check" type="button">Check</button><button class="btn btn-primary" data-eb="imp-add" type="button"${!d.forNew && r && !r.ok.length ? ' disabled' : ''}>${d.forNew ? 'Next: the details of the book' : 'Add ' + (r ? plural(r.ok.length, 'unit') : 'the units')}</button></div></div></div>
      <div class="card pn-form">
        <div class="eb-drop eb-drop-file" data-eb-drop="import"><b>Drop a file here</b> <span class="muted">.txt, .md or .json — a book exported here, or a text in the format below</span><button class="btn btn-sm" type="button" data-eb="imp-file">Choose a file</button></div>
        <textarea class="field pn-mono eb-content" data-eb-imp rows="16" spellcheck="false" placeholder="${esc(SAMPLE_TEXT)}">${esc(d.text)}</textarea>
        ${d.forNew ? '' : `<div class="btn-row"><label class="pn-check"><input type="radio" name="eb-mode" value="append"${d.mode !== 'replace' ? ' checked' : ''}> Add after the ${plural(units.length, 'unit')} of the book</label><label class="pn-check"><input type="radio" name="eb-mode" value="replace"${d.mode === 'replace' ? ' checked' : ''}> Replace all units of the book</label></div>`}
        ${r ? `<div class="eb-report"><b>${plural(r.found, 'unit')} found${r.problems.length ? ' · <span class="pn-warn">' + r.problems.length + ' to fix</span>' : ' · no mistakes'}</b>${problemsHtml(r.problems)}<ol>${r.ok.map((u) => `<li><b>${esc(u.title)}</b> <span class="muted sm">${u.group ? esc(u.group) + ' · ' : ''}${plural(u.points, 'question')} · ${u.words} words</span></li>`).join('')}</ol></div>` : ''}
        <details class="eb-help"><summary>The format of the text</summary><div class="eb-help-grid"><div><code>== Work and study</code> a part of the book (optional)<br><code>=== The title of the unit</code> starts a unit<br><code>kind:</code> <code>minutes:</code> <code>summary:</code> <code>part:</code> <code>audio:</code> <code>test:</code> <code>hidden: yes</code> (optional lines)<br><code>---</code> then the book page of the unit, as in the unit editor</div><div>The same file is made by <b>Export → text</b> on a book, so a book can be changed in any text editor and brought back. <b>Export → JSON</b> keeps the simple exercises too.</div></div></details>
      </div>`;
  }
  const readImp = () => { const t = mount() && mount().querySelector('[data-eb-imp]'); if (imp && t) { if (t.value !== imp.text) imp.report = null; imp.text = t.value; const m = mount().querySelector('input[name="eb-mode"]:checked'); if (m) imp.mode = m.value; } };
  async function checkImport() {
    readImp();
    const url = '/api/admin/ebooks/' + encodeURIComponent(imp.forNew ? (books && books[0] && books[0].id) || '' : book.id) + '/import';
    imp.report = await post(url, { text: imp.text, mode: imp.mode, dry: true });
    renderImport();
  }
  function fromFile(file) {
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) return toast('This file is larger than 3.5 MB.', true);
    if (/\.(pdf|docx?)$/i.test(file.name)) return toast('Choose a text file (.txt, .md) or a .json export. From a PDF or Word file: copy the text and paste it.', true);
    const rd = new FileReader(); rd.onload = () => { imp.text = String(rd.result || ''); imp.report = null; renderImport(); checkImport().catch(fail); }; rd.onerror = () => toast('This file could not be read.', true); rd.readAsText(file);
  }

  /* ───────── the units of one book ───────── */
  function renderUnits() {
    const m = mount();
    const qn = (u) => (u.exercises || []).length + (u.points || 0);
    const ex = units.reduce((a, u) => a + qn(u), 0), min = units.reduce((a, u) => a + (u.minutes || 0), 0), hid = units.filter((u) => u.published === false).length;
    const q = unitQuery.toLowerCase();
    const shown = units.map((u, i) => ({ u, i })).filter((x) => !q || [x.u.title, x.u.group, x.u.summary, x.u.content].join(' ').toLowerCase().includes(q));
    let group = null;
    const rows = shown.map(({ u, i }) => {
      const head = (u.group || '') !== group ? `<div class="eb-part" data-group="${esc(u.group || '')}"><strong>${esc(u.group || 'No part')}</strong><button class="link-btn" type="button" data-eb="part" data-group="${esc(u.group || '')}" data-id="${esc(u.id)}">${u.group ? 'Rename' : 'Name this part'}</button></div>` : '';
      group = u.group || '';
      return head + `<div class="pd-row eb-urow${u.published === false ? ' is-hidden' : ''}" data-id="${esc(u.id)}" draggable="${q ? 'false' : 'true'}">
          <span class="eb-grip" title="Drag to move" aria-hidden="true">⋮⋮</span>
          <div class="pn-thumb" style="--k:${KIND_K[u.kind] || 'var(--c1)'};font-weight:800">${i + 1}</div>
          <div class="pd-main"><div class="pd-title"><strong>${esc(u.title)}</strong><span class="badge">${esc(KINDS[u.kind] || u.kind)}</span>${u.published === false ? '<span class="badge">Hidden</span>' : ''}${u.audio ? '<span class="badge badge-info">🎧 audio</span>' : ''}${u.test ? '<span class="badge badge-info">test link</span>' : ''}</div>
            <div class="muted sm">${plural(qn(u), 'question')}${u.minutes ? ' · ' + u.minutes + ' min' : ''}${u.content ? ' · ' + plural(u.content.split(/\s+/).length, 'word') : ''}${u.summary ? ' · ' + esc(u.summary.slice(0, 90)) : ''}</div></div>
          <div class="actions pd-actions">
            <button class="btn btn-sm btn-icon" data-eb="up" data-id="${esc(u.id)}" type="button" title="Move up" aria-label="Move up" ${i === 0 || q ? 'disabled' : ''}>↑</button>
            <button class="btn btn-sm btn-icon" data-eb="down" data-id="${esc(u.id)}" type="button" title="Move down" aria-label="Move down" ${i === units.length - 1 || q ? 'disabled' : ''}>↓</button>
            <button class="btn btn-sm" data-eb="unit-publish" data-id="${esc(u.id)}" type="button">${u.published === false ? 'Publish' : 'Hide'}</button>
            <button class="btn btn-sm" data-eb="unit-copy" data-id="${esc(u.id)}" type="button">Copy</button>
            <a class="btn btn-sm" href="/books#${esc(book.id)}/${esc(u.id)}" target="_blank" rel="noopener">View ↗</a>
            <button class="btn btn-sm btn-primary" data-eb="edit" data-id="${esc(u.id)}" type="button">Edit</button>
            <button class="btn btn-sm btn-danger btn-icon" data-eb="delete" data-id="${esc(u.id)}" type="button" title="Delete" aria-label="Delete">✕</button>
          </div></div>`;
    }).join('');
    m.innerHTML = `
      <div class="card eb-bookhead"><div class="eb-thumb big">${coverHtml(book, bookStyle)}</div>
        <div class="eb-bookmain"><a class="link-btn" href="#ebooks">← All e-books</a><div style="margin:4px 0 2px"><strong style="font-size:18px">${esc(book.title)}</strong> ${planBadge(book.plan)}${book.published ? '' : ' <span class="badge">Hidden</span>'}</div>
          <div class="muted sm">${plural(units.length, 'unit')}${hid ? ' (' + hid + ' hidden)' : ''} · ${plural(ex, 'question')}${min ? ' · about ' + min + ' min' : ''}${book.author ? ' · ' + esc(book.author) : ''}${book.level ? ' · ' + esc(book.level) : ''}${book.file ? ' · PDF ✓' : ''}</div>
          <div class="btn-row" style="margin-top:10px"><button class="btn btn-sm" data-eb="info" type="button">Edit details</button><button class="btn btn-sm" data-eb="import" type="button">Import units</button><a class="btn btn-sm" href="/api/admin/ebooks/${esc(book.id)}/export?format=json" download>Export JSON</a><a class="btn btn-sm" href="/api/admin/ebooks/${esc(book.id)}/export?format=txt" download>Export text</a><a class="btn btn-sm" href="/books#${esc(book.id)}" target="_blank" rel="noopener">View as a student ↗</a></div></div>
        <button class="btn btn-primary" data-eb="new" type="button">+ New unit</button></div>
      <div class="card eb-design-card"><div class="eb-design-row"><div><strong>Design of the book</strong><div class="muted sm">${esc(STYLE_INFO[bookStyle] || '')}</div></div>
        <div class="eb-design-pick" role="radiogroup" aria-label="Design of the book">${Object.keys(STYLE_NAMES).map((k) => `<button type="button" class="eb-design-opt${k === bookStyle ? ' on' : ''}" data-eb="style" data-style="${k}" role="radio" aria-checked="${k === bookStyle}"><i class="eb-sw eb-sw-${k}"></i>${esc(STYLE_NAMES[k])}</button>`).join('')}</div></div></div>
      <div class="card">
        ${units.length > 4 ? `<div class="toolbar"><div class="muted sm" style="flex:1 1 auto">Drag a unit to move it. A unit moved under a part belongs to that part.</div><input class="field" data-eb-usearch type="search" placeholder="Search the units" value="${esc(unitQuery)}" style="flex:0 1 240px"></div>` : ''}
        <div class="pd-list eb-ulist">${rows || `<div class="empty">${units.length ? 'Nothing matches.' : 'No units yet. Press “New unit”, or import a file with many units.'}</div>`}</div>
        <p class="muted sm" style="margin:12px 0 0">A unit is <b>learned</b> when its exercises reach 60 %, when its test is finished (a unit with a test and no exercises) or when the student presses “I have read it” (a unit with only text). A hidden unit is not shown to students or counted.</p>
      </div>`;
  }

  /* ───────── the editor of a unit ───────── */
  const blankEx = (type) => ({ type: type || 'choice', q: '', options: [], answer: type === 'tfng' ? 'True' : type === 'yng' ? 'Yes' : '', explain: '' });
  function exHtml(x, n) {
    const answer = x.type === 'tfng' || x.type === 'yng'
      ? `<select class="field" data-x="answer">${TF[x.type].map((o) => `<option${o === x.answer ? ' selected' : ''}>${o}</option>`).join('')}</select>`
      : x.type === 'choice'
        ? `<select class="field" data-x="answer"><option value="">Which option is right?</option>${(x.options || []).map((o) => `<option${o === x.answer ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`
        : `<input class="field" data-x="answer" value="${esc(x.answer)}" placeholder="The right answer (several: has gone|’s gone)">`;
    return `<div class="pn-ex" data-ex="${n}">
      <div class="pn-ex-n">${n + 1}</div>
      <div class="pn-ex-main">
        <div class="pn-grid2" style="grid-template-columns:minmax(0,1fr) 220px"><textarea class="field" data-x="q" rows="2" placeholder="${x.type === 'gap' ? 'She ____ (live) here since 2015.' : x.type === 'choice' ? 'Which word means “very big”?' : 'A statement about the text'}">${esc(x.q)}</textarea>
          <select class="field" data-x="type" aria-label="Type">${Object.entries(TYPES).map(([v, l]) => `<option value="${v}"${x.type === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="pn-grid2">${x.type === 'choice' ? `<textarea class="field" data-x="options" rows="3" placeholder="Options, one per line">${esc((x.options || []).join('\n'))}</textarea>` : '<div class="muted sm" style="align-self:center">' + (x.type === 'gap' ? 'The student types the answer. Case and a full stop at the end do not matter.' : 'The student picks one of the three answers.') + '</div>'}
          <div style="display:grid;gap:6px;align-content:start">${answer}<input class="field" data-x="explain" value="${esc(x.explain)}" placeholder="Why (shown after Check, optional)"></div></div>
      </div>
      <button class="btn btn-sm btn-danger btn-icon" data-eb="ex-del" data-n="${n}" type="button" title="Remove">✕</button></div>`;
  }
  function testOptions(cur) {
    if (!tests) return `<option value="${esc(cur)}">${cur ? esc(cur) : 'Loading the tests…'}</option>`;
    let found = !cur; const out = ['<option value="">No test</option>'];
    for (const sk of tests) {
      out.push(`<optgroup label="${esc(sk.name)}">` + sk.tests.map((t) => { if (t.href === cur) found = true; return `<option value="${esc(t.href)}"${t.href === cur ? ' selected' : ''}>${esc(t.pack ? t.pack + ' · ' : '')}${esc(t.title)}</option>`; }).join('') + '</optgroup>');
    }
    if (!found) out.splice(1, 0, `<option value="${esc(cur)}" selected>${esc(cur)}</option>`);
    return out.join('');
  }
  async function loadTests() {
    if (tests) return;
    try {
      const d = await api('/api/admin/access');
      tests = (d.skills || []).map((sk) => ({ name: String(sk.title || sk.skill || '').replace(/^\w/, (c) => c.toUpperCase()), tests: (sk.packs || []).flatMap((p) => (p.tests || []).filter((t) => t.href).map((t) => ({ pack: p.title, title: t.title, href: t.href }))) })).filter((s) => s.tests.length);
    } catch (e) { tests = []; }
    if (draft) { const sel = mount().querySelector('[data-f="test"]'); if (sel) { readForm(); sel.innerHTML = testOptions(draft.test); } }
  }
  function renderEditor() {
    const m = mount(); const d = draft;
    const groups = [...new Set(units.map((u) => u.group).filter(Boolean))];
    const sn = {}; Object.entries(SNIPS).forEach(([k, v]) => { (sn[v[2]] = sn[v[2]] || []).push([k, v[0]]); });
    m.innerHTML = `<div class="card pd-editor-head"><div class="btn-row" style="justify-content:space-between"><div><div class="eyebrow">${esc(book.title)}</div><strong style="font-size:16px">${d.id ? 'Edit unit ' + (units.findIndex((x) => x.id === d.id) + 1) : 'New unit'}</strong> <span class="muted sm" id="eb-saved"></span></div>
        <div class="btn-row"><button class="btn" data-eb="cancel" type="button">Cancel</button>${d.id && units.findIndex((x) => x.id === d.id) < units.length - 1 ? '<button class="btn" data-eb="save-next" type="button">Save and next</button>' : ''}<button class="btn btn-primary" data-eb="save" type="button" title="Ctrl+S">Save unit</button></div></div></div>
      ${keptAt ? `<div class="card eb-restore"><span>An unsaved version of this unit from <b>${esc(keptAt)}</b> is kept in this browser.</span><button class="btn btn-sm btn-primary" data-eb="restore" type="button">Bring it back</button><button class="btn btn-sm" data-eb="forget" type="button">Delete it</button></div>` : ''}
      <div class="card pn-form">
        ${field('Title *', `<input class="field" data-f="title" value="${esc(d.title)}" maxlength="160" placeholder="e.g. Social life">`)}
        <div class="pn-grid3">
          ${field('Part of the book', `<input class="field" data-f="group" list="eb-groups" value="${esc(d.group || '')}" maxlength="80" placeholder="e.g. Topics: leisure"><datalist id="eb-groups">${groups.map((g) => `<option value="${esc(g)}">`).join('')}</datalist>`)}
          ${field('Kind', `<select class="field" data-f="kind">${Object.entries(KINDS).map(([v, l]) => `<option value="${v}"${d.kind === v ? ' selected' : ''}>${l}</option>`).join('')}</select>`)}
          ${field('Minutes (about)', `<input class="field" data-f="minutes" type="number" min="0" max="600" value="${esc(d.minutes || '')}" placeholder="e.g. 25">`)}
        </div>
        ${field('Summary', `<input class="field" data-f="summary" maxlength="300" value="${esc(d.summary)}" placeholder="Shown in the contents, e.g. take notes, meet a deadline, sit an exam">`)}
        <label class="pn-check"><input type="checkbox" data-f="published"${d.published !== false ? ' checked' : ''}> Students see this unit</label>
        <div class="eb-page-head"><strong>The book page of the unit</strong><span class="muted sm">Design: <b>${esc(STYLE_NAMES[bookStyle])}</b></span></div>
        <div class="eb-snips" role="toolbar" aria-label="Insert">${Object.entries(MARKS).map(([k, v]) => `<button class="btn btn-sm eb-mark eb-mark-${k}" type="button" data-eb="mark" data-mark="${k}" title="${esc(v[3])}">${esc(v[0])}</button>`).join('')}<span class="eb-sep"></span>${Object.entries(sn).map(([g, list]) => `<select class="field eb-ins" data-eb-ins aria-label="Insert: ${g}"><option value="">+ ${g}</option>${list.map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select>`).join('')}<span class="eb-sep"></span><button class="btn btn-sm" type="button" data-eb="join" title="Text pasted from a PDF: joins the lines of a paragraph (the selected text, or everything)">Join broken lines</button></div>
        <div class="eb-split${ls.get('ix-eb-live') === '0' ? ' off' : ''}">
          <div class="eb-split-l"><textarea class="field pn-mono eb-content" data-f="content" rows="26" spellcheck="false" placeholder="# [A] The title of part A&#10;The explanation with **a collocation** …&#10;&#10;# Exercises&#10;::: task Complete the sentences.&#10;1 I always [take] notes.&#10;:::">${esc(d.content)}</textarea>
            <div class="eb-prev-bar btn-row"><button class="btn btn-sm" data-eb="live" type="button">${ls.get('ix-eb-live') === '0' ? 'Show the page' : 'Hide the page'}</button><label class="muted sm eb-key-toggle"><input type="checkbox" data-eb-key${showKey ? ' checked' : ''}> Show the answers</label><span class="muted sm" id="eb-prev-info"></span></div><div id="eb-errors"></div></div>
          <div class="eb-split-r"><div id="eb-preview" class="eb-preview"><div class="empty">The page is drawn here while you write.</div></div></div>
        </div>
        <details class="eb-help"><summary>How to write a book page</summary><div class="eb-help-grid">
          <div><b>The page</b><code># Listening | Section 1</code> a section (after <code>|</code> in the second colour)<br><code># [A] Title</code> a lettered section (In Use) · <code># Exercises</code> the exercises page<br><code>## Heading</code> · <code>### SMALL HEADING</code><br><code>- bullet</code> · <code>1. numbered</code> · <code>&gt; example</code> · <code>! tip</code><br><code>| a | b |</code> a table · <code>**bold**</code> <code>*italic*</code> <code>__underline__</code> <code>==mark==</code> <code>~~crossed~~</code> <code>^1^</code><br>What is <b>bold</b> outside the exercises is a collocation: students can hear and keep it, and it goes into the A–Z index.</div>
          <div><b>Boxes and texts</b> — start with <code>::: name</code>, end with a line <code>:::</code><br><code>::: mistakes</code> · <code>::: tip</code> · <code>::: help</code> · <code>::: you</code><br><code>::: advice Title</code> Exam advice · <code>::: info</code> Exam information · <code>::: note Title</code> · <code>::: panel Title</code> · <code>::: words</code><br><code>::: passage Title</code> a reading text (last line <code>Source: …</code>)<br><code>::: email Subject</code> · <code>::: letter Heading</code> · <code>::: ad Title</code> · <code>::: news Headline</code> · <code>::: web address</code><br><code>::: chat</code> with <code>Name: …</code> lines · <code>::: footnotes</code> with <code>1 meaning</code> lines</div>
          <div><b>An exercise</b> — <code>::: task 1 The instruction.</code> … <code>:::</code> (the number is optional)<br><code>Questions 1–5</code> the exam box; the next lines are its instructions<br><code>1 Question?</code> then <code>A …</code> <code>B … *</code> (the right one with <code>*</code>, two with two <code>*</code>)<br><code>1 Statement. = T</code> (T, F, NG · Y, N, NG) · <code>@labels F, I, N</code> then <code>= F</code><br><code>[answer|other]</code> a gap · <code>w[age]</code> the first letters are given · <code>[=example]</code> a filled example · <code>{right*|wrong}</code> circle the word<br><code>1 Sentence with a mistake. = correction</code> · <code>@match</code> + <code>1 meet = the deadline</code> (or A–F options and <code>= B</code>)<br><code>Box: a, b, c</code> words · <code>@chat</code> a conversation · <code>@cols</code> two columns · <code>@flow</code> a flow-chart · <code>Why: …</code> the explanation of the question above</div>
        </div></details>
        <div class="pn-grid2">
          ${field('Recording (optional)', `<div class="pn-upload"><input class="field" data-f="audio" value="${esc(d.audio)}" placeholder="https://… or upload"><button class="btn btn-sm" type="button" data-eb="upload" data-accept="audio/*,.mp3,.m4a,.ogg,.wav">Upload audio</button></div>`, 'MP3 is best. Played above the exercises.')}
          ${field('A test of this website (optional)', `<select class="field" data-f="test">${testOptions(d.test)}</select>`, 'The student opens it from the unit. A unit with a test and no exercises is learned when the test is finished.')}
        </div>
        ${d.audio ? `<audio class="pn-audio" controls preload="none" src="${esc(d.audio)}"></audio>` : ''}
        <div class="pn-ex-head"><strong>Simple exercises</strong><span class="muted sm">Optional: shown at the end of the page as one more exercise. Everything is checked on the server; the best try of every exercise is kept, and 60 % of the unit = learned.</span></div>
        <div class="pn-exs">${(d.exercises || []).map(exHtml).join('')}</div>
        <div class="btn-row"><button class="btn btn-sm" data-eb="ex-add" data-type="choice" type="button">+ Choice</button><button class="btn btn-sm" data-eb="ex-add" data-type="gap" type="button">+ Gap</button><button class="btn btn-sm" data-eb="ex-add" data-type="tfng" type="button">+ True / False / NG</button><button class="btn btn-sm" data-eb="ex-add" data-type="yng" type="button">+ Yes / No / NG</button><button class="btn btn-sm" data-eb="paste" type="button">${pasteOpen ? 'Close “Paste many”' : 'Paste many…'}</button></div>
        ${pasteOpen ? `<div class="box" style="margin:0"><h4>Paste many exercises</h4><p class="muted sm" style="margin:0 0 8px">One exercise per number. <code>= answer</code> at the end of a gap (several: <code>= has lived | ’s lived</code>); <code>[TFNG]</code> or <code>[YNNG]</code> + <code>= True</code>; options on their own lines (<code>a) …</code>), the right one with <code>*</code>; <code>Why: …</code> for the explanation.</p>
          <textarea class="field pn-mono" id="eb-paste" rows="9" placeholder="1. She ____ (live) here since 2015. = has lived | 's lived&#10;2. Roof gardens are cheaper than normal roofs. [TFNG] = False&#10;Why: the owners say they cost more.&#10;3. Which word means &quot;very big&quot;?&#10;a) tiny&#10;b) huge *&#10;c) narrow"></textarea>
          <div class="btn-row" style="margin-top:8px"><button class="btn btn-sm btn-primary" data-eb="paste-add" type="button">Add these exercises</button><span class="muted sm" id="eb-paste-info"></span></div></div>` : ''}
      </div>`;
    loadTests();
    if (preview) drawPreview(); else showPreview();
  }
  function readForm() {
    const m = mount(); if (!draft || !m) return;
    m.querySelectorAll('[data-f]').forEach((el) => { const k = el.getAttribute('data-f'); draft[k] = el.type === 'checkbox' ? el.checked : k === 'minutes' ? Number(el.value) || 0 : el.value; });
    draft.exercises = Array.from(m.querySelectorAll('.pn-ex')).map((row) => {
      const v = (k) => { const el = row.querySelector(`[data-x="${k}"]`); return el ? el.value : ''; };
      const type = v('type') || 'choice';
      return { id: (draft.exercises[Number(row.getAttribute('data-ex'))] || {}).id, type, q: v('q'), options: type === 'choice' ? v('options').split('\n').map((o) => o.trim()).filter(Boolean) : [], answer: v('answer').trim(), explain: v('explain') };
    });
  }
  /* the unit as it is compared and saved (the form gives the same values as the server) */
  function blankUnit() { return { id: '', title: '', group: units.length ? units[units.length - 1].group || '' : '', published: true, kind: 'vocabulary', minutes: 0, summary: '', content: '', audio: '', test: '', testLabel: '', exercises: [] }; }
  const draftKey = () => 'ix-ebook-draft:' + book.id + ':' + ((draft && draft.id) || 'new');
  const snapshot = () => JSON.stringify(Object.keys(draft).filter((k) => !['points', 'createdAt', 'updatedAt'].includes(k)).sort().map((k) => [k, draft[k]]));
  const dirty = () => { if (!draft) return false; if (mount() && mount().querySelector('[data-f="content"]')) readForm(); return snapshot() !== original; };
  function openEditor(u) {
    draft = { ...blankUnit(), ...(u ? JSON.parse(JSON.stringify(u)) : {}) };
    if (u) { draft.group = u.group || ''; draft.published = u.published !== false; }
    draft.content = String(draft.content || '').replace(/\r/g, ''); draft.exercises = draft.exercises || [];
    pasteOpen = false; preview = null; keptAt = '';
    original = snapshot();
    let kept = null; try { kept = JSON.parse(ls.get(draftKey()) || 'null'); } catch (e) { kept = null; }
    if (kept && kept.draft) { const now = draft; draft = { ...draft, ...kept.draft, id: now.id }; const same = snapshot() === original; draft = now; if (same) ls.set(draftKey(), null); else keptAt = new Date(kept.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
    renderEditor(); readForm(); original = snapshot(); window.scrollTo(0, 0);
  }
  /* an unsaved unit is kept in this browser */
  let keepT = 0;
  function keepSoon() {
    clearTimeout(keepT);
    keepT = setTimeout(() => { if (!draft || !book) return; const d = dirty(); const el = $('#eb-saved'); if (d) { ls.set(draftKey(), JSON.stringify({ at: Date.now(), draft })); if (el) el.textContent = '· not saved yet (kept in this browser)'; } else { if (!keptAt) ls.set(draftKey(), null); if (el) el.textContent = ''; } }, 800);
  }
  function closeEditor() { if (draft && book) { clearTimeout(keepT); ls.set(draftKey(), null); } draft = null; preview = null; keptAt = ''; }
  const area = () => mount().querySelector('[data-f="content"]');
  /* **bold** … around the selected text */
  function putMark(k) {
    const ta = area(), mk = MARKS[k]; if (!ta || !mk) return;
    const a = ta.selectionStart, b = ta.selectionEnd, sel = ta.value.slice(a, b);
    if (sel && sel.startsWith(mk[1]) && sel.endsWith(mk[2]) && sel.length > mk[1].length + mk[2].length) { ta.setRangeText(sel.slice(mk[1].length, -mk[2].length), a, b, 'select'); }
    else { ta.setRangeText(mk[1] + (sel || (k === 'sup' ? '1' : k === 'gap' ? 'answer' : 'word')) + mk[2], a, b, 'select'); }
    ta.focus(); ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
  /* text pasted from a PDF: the lines of a paragraph become one line (headings, lists, boxes and empty lines stay) */
  function joinLines() {
    const ta = area(); if (!ta) return;
    const all = ta.selectionStart === ta.selectionEnd; const a = all ? 0 : ta.selectionStart, b = all ? ta.value.length : ta.selectionEnd;
    const special = /^\s*(?:#|:::|@|\||[-*•>!]\s|={2,}|\d{1,3}[.)]?\s|\(?[A-La-h][.)]\s|(?:questions?|box|words|extra|why|source|from|to|subject)\b.*:|[A-Z][\w.'’ -]{0,22}:\s)/i;
    const out = []; ta.value.slice(a, b).split('\n').forEach((l) => {
      const prev = out[out.length - 1];
      if (prev !== undefined && prev.trim() && l.trim() && !special.test(l) && !/^\s*(?:#|:::|@|\||={2,})/.test(prev) && !/[.?!:]["'”’)]?\s*$/.test(prev)) out[out.length - 1] = /[a-z]-$/.test(prev) ? prev.replace(/-$/, '') + l.trim() : prev.trimEnd() + ' ' + l.trim();
      else out.push(l);
    });
    ta.setRangeText(out.join('\n'), a, b, 'select'); ta.focus(); ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function goLine(n) {
    const ta = area(); if (!ta) return; const lines = ta.value.split('\n'); const from = lines.slice(0, n - 1).join('\n').length + (n > 1 ? 1 : 0);
    ta.focus(); ta.setSelectionRange(from, from + (lines[n - 1] || '').length);
    ta.scrollTop = Math.max(0, (n - 6) * (parseFloat(getComputedStyle(ta).lineHeight) || 19));
  }
  /* a piece of the format at the cursor */
  function insertSnip(k) {
    const ta = area(); const snip = SNIPS[k]; if (!ta || !snip) return;
    const a = ta.selectionStart ?? ta.value.length, b = ta.selectionEnd ?? a;
    const before = ta.value.slice(0, a); const pre = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    ta.value = before + pre + snip[1] + ta.value.slice(b);
    const at = (before + pre + snip[1]).length; ta.focus(); ta.setSelectionRange(at, at);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
  /* the page as the student will see it (drawn by assets/js/ebook-render.js), while it is written */
  let prevT = 0, prevN = 0;
  const previewSoon = () => { clearTimeout(prevT); prevT = setTimeout(() => showPreview(), 650); };
  function drawPreview() {
    const box = $('#eb-preview'), note = $('#eb-prev-info'), errs = $('#eb-errors'); if (!box || !preview || !draft) return;
    if (!window.IXEbook) { box.innerHTML = '<div class="empty">Reload the page: the preview is not ready.</div>'; return; }
    const d = preview, R = window.IXEbook, n = draft.id ? units.findIndex((x) => x.id === draft.id) + 1 : units.length + 1;
    const top = box.scrollTop;
    box.innerHTML = `<div class="ebk ebk-${esc(d.style)}">${R.sheet(d.doc, { style: d.style, unit: n || 1, title: draft.title || 'The title of the unit', summary: draft.summary, book: book.title })}</div>`;
    R.bind(box.querySelector('.ebk'), null);
    if (showKey) R.fill(box.querySelector('.ebk'), d.key);
    box.scrollTop = top;
    if (errs) errs.innerHTML = d.errors.length ? `<div class="eb-prev-errors"><b>Fix before saving:</b><ul>${d.errors.map((e) => { const l = /^Line (\d+):\s*(.*)$/.exec(e); return l ? `<li><button class="link-btn" type="button" data-eb="line" data-line="${l[1]}">Line ${l[1]}</button> ${esc(l[2])}</li>` : `<li>${esc(e)}</li>`; }).join('')}</ul></div>` : '';
    if (note) note.textContent = plural(d.points, 'question') + ' · ' + plural((d.terms || []).length, 'collocation') + ' · ' + (d.errors.length ? d.errors.length + ' to fix' : 'no mistakes in the format');
  }
  async function showPreview() {
    if (!draft || !book) return;
    readForm();
    const my = ++prevN, note = $('#eb-prev-info');
    try {
      const d = await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/preview', { content: draft.content, exercises: draft.exercises });
      if (my !== prevN || !draft) return;
      preview = d; drawPreview();
    } catch (e) { if (my === prevN && note) note.textContent = e.message; }
  }
  /* "Paste many" -> exercises */
  function parsePaste(src) {
    const lines = String(src || '').replace(/\r/g, '').split('\n');
    const out = []; let cur = null;
    const startRe = /^\s*(\d{1,3})\s*[.)]\s+(.*)$/;
    const numbered = lines.some((l) => startRe.test(l));
    const finish = () => { if (cur && cur.q.trim()) out.push(cur); cur = null; };
    const begin = (text) => {
      finish(); cur = { type: 'gap', q: '', options: [], answer: '', explain: '' };
      let t = text.trim();
      const tag = /\[\s*(T\s*\/?\s*F\s*\/?\s*NG|TFNG|Y\s*\/?\s*N\s*\/?\s*NG|YNNG)\s*\]/i.exec(t);
      if (tag) { cur.type = /^Y/i.test(tag[1]) ? 'yng' : 'tfng'; t = t.replace(tag[0], ' '); }
      const eq = /\s=\s*(.+)$/.exec(t);
      if (eq) { cur.answer = eq[1].split('|').map((a) => a.trim()).filter(Boolean).join('|'); t = t.slice(0, eq.index); }
      cur.q = t.replace(/\s+/g, ' ').trim();
    };
    for (const raw of lines) {
      const l = raw.trim();
      if (!l) { if (!numbered) finish(); continue; }
      let m;
      if ((m = startRe.exec(raw))) { begin(m[2]); continue; }
      if (!cur) { begin(l); continue; }
      if ((m = /^\(?([A-Ha-h])\s*[.)]\s+(.*)$/.exec(l))) {
        let o = m[2].trim(); let right = false;
        if (/\*\s*$/.test(o)) { right = true; o = o.replace(/\s*\*\s*$/, ''); }
        if (/^\*\s*/.test(o)) { right = true; o = o.replace(/^\*\s*/, ''); }
        cur.type = 'choice'; cur.options.push(o); if (right) cur.answer = o; continue;
      }
      if ((m = /^(?:why|explain|explanation)\s*:\s*(.*)$/i.exec(l))) { cur.explain = m[1].trim(); continue; }
      if ((m = /^(?:answer|ans|=)\s*:?\s*(.+)$/i.exec(l))) { cur.answer = m[1].split('|').map((a) => a.trim()).filter(Boolean).join('|'); continue; }
      cur.q += ' ' + l;
    }
    finish();
    return out.map((x) => {
      if (x.type === 'choice' && x.answer && !x.options.includes(x.answer)) { const k = 'ABCDEFGH'.indexOf(x.answer.toUpperCase()); if (k > -1 && x.options[k]) x.answer = x.options[k]; }
      if (x.type === 'choice' && /^[A-H]$/i.test(x.answer)) x.answer = x.options['ABCDEFGH'.indexOf(x.answer.toUpperCase())] || '';
      if ((x.type === 'tfng' || x.type === 'yng') && x.answer) { const a = x.answer.toLowerCase().replace(/\s+/g, ' '); x.answer = { t: 'True', true: 'True', f: 'False', false: 'False', ng: 'Not Given', 'not given': 'Not Given', y: 'Yes', yes: 'Yes', n: 'No', no: 'No' }[a] || x.answer; }
      return x;
    });
  }
  async function save(next) {
    if (save.busy) return; save.busy = true;
    readForm();
    const btns = mount().querySelectorAll('[data-eb="save"],[data-eb="save-next"]'); btns.forEach((b) => { b.disabled = true; });
    try {
      const was = draft.id;
      const d = await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/units', { unit: { ...draft, minutes: Number(draft.minutes) || 0 } });
      ls.set(draftKey(), null); clearTimeout(keepT);
      take(d); books = null; toast('Unit saved');
      draft = null; preview = null; keptAt = '';
      if (next) { const i = units.findIndex((x) => x.id === was); if (units[i + 1]) return openEditor(units[i + 1]); }
      render();
    } catch (e) { fail(e); const l = /Line (\d+)/.exec(e.message || ''); if (l) goLine(+l[1]); btns.forEach((b) => { b.disabled = false; }); }
    finally { save.busy = false; }
  }
  async function upload(f) {
    if (!window.IXAdmin || !window.IXAdmin.uploadFile) throw new Error('The uploader is not ready. Reload the page.');
    return window.IXAdmin.uploadFile(f);
  }
  function pickFile(accept) {
    return new Promise((resolve) => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept; inp.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(inp);
      const done = (v) => { try { inp.remove(); } catch (e) { /* gone */ } resolve(v); };
      inp.addEventListener('cancel', () => done(null)); inp.onchange = () => done(inp.files && inp.files[0]); inp.click();
    });
  }

  /* ───────── events ───────── */
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-eb]'); if (!t || !mount() || !mount().contains(t)) return;
    const act = t.getAttribute('data-eb'); const id = t.getAttribute('data-id');
    const u = id && units ? units.find((x) => x.id === id) : null;
    try {
      if (act === 'sample') {
        const sel = $('#eb-sample-which'); const which = sel ? sel.value : 'starter'; const name = sel ? sel.options[sel.selectedIndex].text : 'the sample e-book';
        if (!confirm('Add “' + name + '” (free, shown on the Books page)? You can change or delete it later.')) return;
        const d = await post('/api/admin/ebooks/sample', { which }); toast('Sample e-book added'); books = null; location.hash = '#ebooks?book=' + d.book.id; return;
      }
      if (act === 'new-book') return openInfo(null, 'inuse');
      if (act === 'info') return openInfo(book, bookStyle);
      if (act === 'info-cancel') { if (infoDirty() && !confirm('Leave without saving?')) return; info = null; return render(); }
      if (act === 'info-save') return saveInfo();
      if (act === 'info-style') { readInfo(); info.style = t.getAttribute('data-style'); return renderInfo(); }
      if (act === 'info-clear') { readInfo(); info[t.getAttribute('data-k')] = ''; return renderInfo(); }
      if (act === 'info-upload') {
        const f = await pickFile(t.getAttribute('data-accept')); if (!f) return;
        const k = t.getAttribute('data-k'); t.disabled = true; t.textContent = 'Uploading…';
        try { const url = await upload(f); readInfo(); info[k] = url; toast('Uploaded ' + f.name); } finally { if (info) { readInfo2(k); renderInfo(); } }
        return;
      }
      if (act === 'import-new') { imp = { text: '', mode: 'append', report: null, forNew: true }; render(); window.scrollTo(0, 0); return; }
      if (act === 'import') { imp = { text: '', mode: 'append', report: null, forNew: false }; render(); window.scrollTo(0, 0); return; }
      if (act === 'imp-cancel') { readImp(); if (imp.text.trim() && !confirm('Leave without adding these units?')) return; imp = null; return render(); }
      if (act === 'imp-file') { readImp(); return fromFile(await pickFile('.txt,.md,.json,text/plain,application/json')); }
      if (act === 'imp-check') { if (imp.forNew && !(books && books.length)) throw new Error('Press “Next”: the units are checked when the book is made.'); t.disabled = true; try { await checkImport(); } finally { t.disabled = false; } return; }
      if (act === 'imp-add') {
        readImp(); if (!imp.text.trim()) throw new Error('Paste the text of the units, or choose a file.');
        if (imp.forNew) {
          let b = null, style = 'inuse'; if (/^\s*\{/.test(imp.text)) { try { const j = JSON.parse(imp.text); b = j.book || null; style = STYLE_NAMES[j.style] ? j.style : style; } catch (e2) { throw new Error('This JSON file cannot be read: ' + e2.message); } }
          const txt = imp.text; imp = null; return openInfo(b ? { ...b, id: '' } : null, style, txt);
        }
        if (imp.mode === 'replace' && units.length && !confirm('Replace the ' + plural(units.length, 'unit') + ' of this book? The old ones are deleted.')) return;
        t.disabled = true;
        try {
          const d = await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/import', { text: imp.text, mode: imp.mode, skip: !!(imp.report && imp.report.problems.length) });
          take(d); imp = null; books = null; toast(plural(d.added, 'unit') + ' added'); render();
        } catch (err) { t.disabled = false; await checkImport().catch(() => {}); throw err; }
        return;
      }
      if (act === 'book-publish') { const b = books.find((x) => x.id === id); await post('/api/admin/ebooks/' + encodeURIComponent(id) + '/info', { book: { published: !b.published } }); toast(b.published ? 'Hidden' : 'Shown on the website'); return loadBooks(); }
      if (act === 'book-copy') { t.disabled = true; const d = await post('/api/admin/ebooks/' + encodeURIComponent(id) + '/copy'); toast('Copied: “' + d.book.title + '” (hidden)'); return loadBooks(); }
      if (act === 'book-delete') {
        const b = books.find((x) => x.id === id);
        if (b.units && prompt('Delete “' + b.title + '” and its ' + plural(b.units, 'unit') + '? This cannot be undone. Type DELETE to go on (you can export the book first).') !== 'DELETE') return;
        if (!b.units && !confirm('Delete “' + b.title + '”?')) return;
        await api('/api/admin/ebooks/' + encodeURIComponent(id), { method: 'DELETE' }); toast('Deleted'); return loadBooks();
      }
      if (act === 'unit-publish' && u) { take(await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/units/' + encodeURIComponent(id) + '/publish', { published: u.published === false })); books = null; return render(); }
      if (act === 'unit-copy' && u) { take(await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/units/' + encodeURIComponent(id) + '/copy')); books = null; toast('Copied (hidden)'); return render(); }
      if (act === 'part') {
        const old = t.getAttribute('data-group'); const name = prompt('The name of this part of the book (empty = no part):', old); if (name === null || name.trim() === old) return;
        const i = units.findIndex((x) => x.id === id); const groups = {};
        for (let k = i; k < units.length && (units[k].group || '') === old; k++) groups[units[k].id] = name.trim();
        take(await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/order', { ids: units.map((x) => x.id), groups })); books = null; return render();
      }
      if (act === 'style') {
        const style = t.getAttribute('data-style'); if (style === bookStyle) return;
        take(await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/style', { style })); books = null;
        toast('Design: ' + STYLE_NAMES[bookStyle]); return render();
      }
      if (act === 'mark') return putMark(t.getAttribute('data-mark'));
      if (act === 'join') return joinLines();
      if (act === 'line') return goLine(+t.getAttribute('data-line'));
      if (act === 'live') { const off = ls.get('ix-eb-live') !== '0'; ls.set('ix-eb-live', off ? '0' : null); mount().querySelector('.eb-split').classList.toggle('off', off); t.textContent = off ? 'Show the page' : 'Hide the page'; return; }
      if (act === 'restore') { let k = null; try { k = JSON.parse(ls.get(draftKey()) || 'null'); } catch (e2) { k = null; } if (k && k.draft) draft = { ...draft, ...k.draft, id: draft.id }; keptAt = ''; preview = null; return renderEditor(); }
      if (act === 'forget') { ls.set(draftKey(), null); keptAt = ''; const c = t.closest('.eb-restore'); if (c) c.remove(); return; }
      if (act === 'new') return openEditor(null);
      if (act === 'edit' && u) return openEditor(u);
      if (act === 'cancel') { if (dirty() && !confirm('Leave without saving?')) return; closeEditor(); return render(); }
      if (act === 'save') return save();
      if (act === 'save-next') return save(true);
      if (act === 'ex-add') { readForm(); draft.exercises.push(blankEx(t.getAttribute('data-type'))); renderEditor(); const qs = mount().querySelectorAll('[data-x="q"]'); if (qs.length) qs[qs.length - 1].focus(); return; }
      if (act === 'ex-del') { readForm(); draft.exercises.splice(Number(t.getAttribute('data-n')), 1); return renderEditor(); }
      if (act === 'paste') { readForm(); pasteOpen = !pasteOpen; renderEditor(); const p = $('#eb-paste'); if (p) p.focus(); return; }
      if (act === 'paste-add') {
        const list = parsePaste(($('#eb-paste') || {}).value);
        if (!list.length) { const i = $('#eb-paste-info'); if (i) i.textContent = 'Nothing found: start each exercise with a number (1. …).'; return; }
        readForm(); draft.exercises.push(...list); pasteOpen = false; renderEditor();
        const missing = list.filter((x) => !x.answer).length;
        return toast(`${list.length} exercise${list.length === 1 ? '' : 's'} added` + (missing ? ` · ${missing} still need an answer` : ''), !!missing);
      }
      if (act === 'upload') {
        const f = await pickFile(t.getAttribute('data-accept')); if (!f) return;
        t.disabled = true; t.textContent = 'Uploading…';
        let url = ''; try { url = await upload(f); toast('Uploaded ' + f.name); } finally { if (draft) { readForm(); if (url) draft.audio = url; renderEditor(); keepSoon(); } }   // what was typed meanwhile stays
        return;
      }
      if (act === 'delete' && u) {
        if (!confirm('Delete the unit “' + u.title + '”? Students do not see it any more.')) return;
        units = (await api('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/units/' + encodeURIComponent(u.id), { method: 'DELETE' })).units; books = null; toast('Unit deleted'); return render();
      }
      if ((act === 'up' || act === 'down') && u) { const i = units.indexOf(u); return await moveUnit(u.id, act === 'up' ? i - 1 : i + 1, act === 'up' ? 'before' : 'after'); }
    } catch (err) { fail(err); if (t.isConnected) t.disabled = false; }
  });
  function readInfo2(k) { const v = info[k]; readInfo(); info[k] = v; }   // what was typed while the file was uploaded stays
  /* a unit to another place; it joins the part of the unit it is put next to */
  async function moveUnit(id, j, side) {
    const i = units.findIndex((x) => x.id === id); if (i < 0 || j < 0 || j >= units.length || j === i) return;
    const target = units[j]; const list = units.filter((x) => x.id !== id); const at = list.findIndex((x) => x.id === target.id) + (side === 'after' ? 1 : 0);
    list.splice(at, 0, units[i]);
    const groups = {}; if ((target.group || '') !== (units[i].group || '')) groups[id] = target.group || '';
    units = list.map((x) => (groups[x.id] !== undefined ? { ...x, group: groups[x.id] } : x)); render();
    take(await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/order', { ids: list.map((x) => x.id), groups })); render();
  }
  /* drag a unit */
  let dragId = null;
  const overRow = (e) => (e.target.closest ? e.target.closest('.eb-urow') : null);
  document.addEventListener('dragstart', (e) => { const r = overRow(e); if (!r || !mount() || !mount().contains(r) || unitQuery) return; dragId = r.getAttribute('data-id'); r.classList.add('is-drag'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', dragId); } catch (x) { /* fine */ } });
  document.addEventListener('dragover', (e) => {
    const dz = e.target.closest && e.target.closest('[data-eb-drop]'); if (dz && mount() && mount().contains(dz)) { e.preventDefault(); dz.classList.add('over'); return; }
    if (!dragId) return; const r = overRow(e); if (!r) return; e.preventDefault();
    const b = r.getBoundingClientRect(); const after = e.clientY > b.top + b.height / 2;
    mount().querySelectorAll('.drop-a,.drop-b').forEach((x) => x.classList.remove('drop-a', 'drop-b')); r.classList.add(after ? 'drop-a' : 'drop-b');
  });
  document.addEventListener('dragleave', (e) => { const dz = e.target.closest && e.target.closest('[data-eb-drop]'); if (dz) dz.classList.remove('over'); });
  document.addEventListener('drop', async (e) => {
    const dz = e.target.closest && e.target.closest('[data-eb-drop]');
    if (dz && mount() && mount().contains(dz)) {
      e.preventDefault(); dz.classList.remove('over'); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return;
      if (dz.getAttribute('data-eb-drop') === 'import') { readImp(); return fromFile(f); }
      if (!/^image\//.test(f.type)) return toast('Drop a picture (PNG, JPG, WebP).', true);
      try { const url = await upload(f); if (info) { readInfo(); info.cover = url; renderInfo(); } } catch (err) { fail(err); }
      return;
    }
    if (!dragId) return; const r = overRow(e); const id = dragId; dragId = null; if (!r || r.getAttribute('data-id') === id) return; e.preventDefault();
    const after = r.classList.contains('drop-a');
    try { await moveUnit(id, units.findIndex((x) => x.id === r.getAttribute('data-id')), after ? 'after' : 'before'); } catch (err) { fail(err); openBook(book.id); }
  });
  document.addEventListener('dragend', () => { dragId = null; if (mount()) mount().querySelectorAll('.is-drag,.drop-a,.drop-b').forEach((x) => x.classList.remove('is-drag', 'drop-a', 'drop-b')); });
  /* typing: the search boxes, the live page, the unsaved copy */
  document.addEventListener('input', (e) => {
    const m = mount(); if (!m || !m.contains(e.target) || !e.target.hasAttribute) return; const el = e.target;
    const redo = (sel) => { const pos = el.selectionStart; render(); const x = m.querySelector(sel); if (x) { x.focus(); try { x.setSelectionRange(pos, pos); } catch (err) { /* fine */ } } };
    if (el.hasAttribute('data-eb-search')) { query = el.value; return redo('[data-eb-search]'); }
    if (el.hasAttribute('data-eb-usearch')) { unitQuery = el.value; return redo('[data-eb-usearch]'); }
    if (info && el.getAttribute('data-i') === 'title' && !info.cover) { const b = m.querySelector('.eb-info-pic .eb-acover b'); if (b) b.textContent = el.value || 'Title'; }
    if (draft && (el.hasAttribute('data-f') || el.hasAttribute('data-x'))) { keepSoon(); if (['content', 'title', 'summary'].includes(el.getAttribute('data-f')) || el.hasAttribute('data-x')) previewSoon(); }
  });
  document.addEventListener('keydown', (e) => {
    const m = mount(); if (!draft || !m || !m.contains(document.activeElement) && document.activeElement !== document.body) return;
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return; const k = e.key.toLowerCase();
    if (currentView() !== 'ebooks') return;
    if (k === 's') { e.preventDefault(); save(); }
    else if ((k === 'b' || k === 'i') && document.activeElement === area()) { e.preventDefault(); putMark(k); }
  });
  // the type of an exercise changes its answer field; the options of a choice fill its answer list
  document.addEventListener('change', (e) => {
    if (!draft || !mount() || !mount().contains(e.target)) return;
    if (e.target.hasAttribute('data-eb-ins')) { const k = e.target.value; e.target.value = ''; if (k) insertSnip(k); return; }
    const x = e.target.getAttribute('data-x');
    if (x === 'type') { readForm(); const row = e.target.closest('.pn-ex'); const ex = draft.exercises[Number(row.getAttribute('data-ex'))]; if (ex) { if (TF[ex.type]) ex.answer = TF[ex.type].includes(ex.answer) ? ex.answer : TF[ex.type][0]; else if (ex.type !== 'choice' && TF.tfng.concat(TF.yng).includes(ex.answer)) ex.answer = ''; } renderEditor(); }
  });
  // "Show the answers" in the preview
  document.addEventListener('change', (e) => {
    if (!e.target.hasAttribute || !e.target.hasAttribute('data-eb-key')) return;
    showKey = e.target.checked;
    if (preview) drawPreview();
  });
  document.addEventListener('focusout', (e) => {
    if (!draft || !mount() || !mount().contains(e.target) || e.target.getAttribute('data-x') !== 'options') return;
    const row = e.target.closest('.pn-ex'); const sel = row && row.querySelector('select[data-x="answer"]'); if (!sel) return;
    const cur = sel.value; const opts = e.target.value.split('\n').map((o) => o.trim()).filter(Boolean);
    sel.innerHTML = '<option value="">Which option is right?</option>' + opts.map((o) => `<option${o === cur ? ' selected' : ''}>${esc(o)}</option>`).join('');
  });
  window.addEventListener('beforeunload', (e) => { if (mount() && (dirty() || infoDirty() || (imp && (readImp(), imp.text.trim())))) { e.preventDefault(); e.returnValue = ''; } });
  const currentView = () => (location.hash || '').slice(1).split('?')[0];
  const onHash = () => {
    if (currentView() !== 'ebooks') return;               // another part of the panel: an open editor waits here, as it is
    const bid = wantBook(); const here = bid || '';
    const busy = draft || info || imp;
    if (busy && here === lastHash) { if (!mount().firstElementChild) render(); return; }   // back to the open editor
    if (busy) {                                            // another book: not over something unsaved
      if ((dirty() || infoDirty() || (imp && imp.text.trim())) && !confirm('Leave without saving?')) { history.replaceState('', '', '#ebooks' + (lastHash ? '?book=' + lastHash : '')); return; }
      if (draft) closeEditor(); info = null; imp = null;
    }
    lastHash = here;
    if (bid) { if (!book || book.id !== bid) openBook(bid); else render(); }
    else { book = null; units = null; openId++; loadBooks(); }          // always the books as they are now (Admin → Books may have changed them)
  };
  window.addEventListener('hashchange', onHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onHash); else onHash();
})();
