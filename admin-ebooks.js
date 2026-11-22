/*
 * IELTSX admin: E-books (admin.html#ebooks, #ebooks?book=<id>) — the server is ebooks.js.
 * A book of the Books page (Admin → Books: title, cover, PDF, plan) becomes an interactive e-book with units:
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
  const STYLE_INFO = {
    site: 'The colours and cards of this website.',
    course: '"Unit 1" in a magenta circle, magenta sections with a blue second word, numbered circles, blue "Exam advice" boxes and pink "Questions 1–5" boxes — like an IELTS course book.',
    workbook: 'The same layout in the greys of a workbook.',
    inuse: 'A dark green unit number, lettered sections A, B, C on a pale green page and exercises 1.1, 1.2 … — like a vocabulary "In Use" book.'
  };
  const SNIPS = {
    sec: ['Section', '# Reading | Section 1\n'],
    letter: ['Section A, B …', '# [A] The title of part A\nThe explanation …\n'],
    advice: ['Exam advice', '::: advice True / False / Not Given\n- If the passage expresses the same information, write TRUE.\n- If it expresses the opposite, write FALSE.\n- If it does not include the information, write NOT GIVEN.\n:::\n'],
    info: ['Exam information', '::: info\n- You hear a conversation between two people.\n- You write your answers while you listen.\n:::\n'],
    passage: ['Reading passage', '::: passage The title of the text\n**A** The first paragraph …\n\n**B** The second paragraph …\nSource: adapted from …\n:::\n'],
    choice: ['A / B / C', '::: task Answer Questions 1–2.\nQuestions 1–2\nChoose the correct letter, A, B or C.\n1 The question?\nA the first option\nB the right option *\nC the third option\n2 Which TWO …? (two right options)\nA …  *\nB …\nC …  *\n:::\n'],
    tfng: ['TRUE / FALSE / NG', '::: task Answer Questions 1–3.\nQuestions 1–3\nDo the following statements agree with the information given in the reading passage?\n1 A statement that is true. = T\n2 A statement that is false. = F\n3 A statement the text does not talk about. = NG\nWhy: the text never mentions it.\n:::\n'],
    ynng: ['YES / NO / NG', '::: task Answer Questions 1–3.\nQuestions 1–3\nDo the following statements agree with the claims of the writer?\n1 … = Y\n2 … = N\n3 … = NG\n:::\n'],
    gaps: ['Gaps in sentences', '::: task Complete the sentences with the correct form of the word in brackets.\n1 Life in the city is [more expensive] (expensive) than in my town.\n2 This is the [busiest] (busy) street in the city.\n3 Several right answers: [faster|quicker].\n:::\n'],
    notes: ['Note / summary', '::: task Complete the summary below.\nQuestions 1–3\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nRoof gardens keep buildings [cooler] in summer and hold [rainwater] for a while, so the [drains] overflow less often.\n:::\n'],
    table: ['Table / form', '::: task Complete the form below.\nQuestions 1–3\nWrite ONE WORD AND/OR A NUMBER for each answer.\n### APPLICATION FORM\n| Name: | Anna [Kowalska] |\n| Age: | [=21] |\n| Phone: | [0771 845 302|0771845302] |\n| Interests: | singing and [dancing] |\n:::\n'],
    pick: ['Circle the word', '::: task Circle the correct word.\n1 They had some {problems*|troubles} at first.\n2 Pollution {affects*|effects} our health.\n:::\n'],
    correct: ['Correct the mistake', '::: task Find and correct the mistake in each sentence.\n1 The noise effects my sleep. = affects\n2 It had a bad affect on me. = effect\n:::\n'],
    match: ['Match', '::: task Match the two parts of these collocations.\n@match\n1 meet = the deadline\n2 take = notes\n3 pay = attention\nExtra: a mistake\n:::\n'],
    headings: ['Headings / A–F', '::: task Choose the correct heading for each paragraph.\nQuestions 1–3\n@match\nA The first heading\nB The second heading\nC The third heading\nD A heading you do not need\n1 Paragraph A = B\n2 Paragraph B = C\n3 Paragraph C = A\n:::\n'],
    words: ['Box of words', '::: task Complete the sentences with words from the box.\nBox: crowded, rent, commute\n1 My daily [commute] takes an hour.\n2 The [rent] is very high.\n3 The buses are [crowded] in the morning.\n:::\n'],
    labels: ['F / I / N labels', '::: task Write F (formal), I (informal) or N (neutral).\n@labels F, I, N\n1 Passengers must not alight while the bus is moving. = F\n2 Let\'s grab a bite. = I\n:::\n'],
    flow: ['Flow-chart', '::: task Complete the flow-chart. Use ONE WORD for each answer.\n@flow\nThe first step with a [gap]\nThe second step with a [gap]\nThe last step\n:::\n'],
    talk: ['Discussion', '::: task Work in pairs. Discuss these questions.\n- The first question?\n- The second question?\n:::\n'],
    panel: ['Grammar panel', '::: panel Key grammar\n- one syllable: *cheap → cheaper → the cheapest*\n:::\n']
  };
  let books = null, loading = false, book = null, units = null, draft = null, original = '', tests = null, pasteOpen = false, bookStyle = 'site', preview = null, showKey = false;

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
  const field = (label, html, hint) => `<label class="lbl">${label}${html}${hint ? `<span class="muted sm" style="font-weight:400;display:block;margin-top:4px">${hint}</span>` : ''}</label>`;

  /* ───────── the books ───────── */
  async function loadBooks() {
    if (loading) return; loading = true; render();
    try { books = (await api('/api/admin/ebooks')).books; } catch (e) { fail(e); books = books || []; } finally { loading = false; }
    render();
  }
  async function openBook(id) {
    book = null; units = null; draft = null; render();
    try { const d = await api('/api/admin/ebooks/' + encodeURIComponent(id)); book = d.book; units = d.units; bookStyle = d.style || 'site'; }
    catch (e) { fail(e); location.hash = '#ebooks'; return; }
    render();
  }
  function render() {
    const m = mount(); if (!m) return;
    if (draft) return renderEditor();
    const bid = wantBook();
    if (bid) {
      if (!book || book.id !== bid) { m.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
      return renderUnits();
    }
    if (!books) { m.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
    m.innerHTML = `
      <div class="pd-hero card">
        <div class="pd-hero-text"><div class="eyebrow">The Books page as interactive e-books</div><h2>E-books</h2>
          <p class="muted">Turn every book into units the student reads and practises on the website: a lesson or a reading text, a recording, a test of this website, and exercises that are checked for them. Students see how much of the book they have learned and what is left; their teachers see it too. Make the book itself (title, cover, PDF, plan) in <a class="link-btn" href="#books">Books</a>, then add its units here. Use only books and texts you have the right to publish.</p></div>
        <div class="btn-row"><a class="btn" href="/books" target="_blank" rel="noopener">Open the Books page ↗</a><a class="btn" href="#books">+ New book</a><select class="field" id="eb-sample-which" style="width:auto" aria-label="Which sample"><option value="course">Course book (sample)</option><option value="workbook">Workbook (sample)</option><option value="inuse">Vocabulary book · In Use (sample)</option><option value="starter">Starter workbook (website look)</option></select><button class="btn btn-primary" data-eb="sample" type="button">Add a sample e-book</button></div>
      </div>
      <div class="card">
        <div class="toolbar"><div class="muted sm" style="flex:1">${books.length} book${books.length === 1 ? '' : 's'} · ${books.filter((b) => b.units).length} with units</div></div>
        <div class="pd-list">${books.map((b) => `<div class="pd-row${b.published ? '' : ' is-hidden'}">
          <div class="pn-thumb pn-books" style="--k:var(--c4)">${b.cover ? `<img src="${esc(b.cover)}" alt="" loading="lazy">` : icon('book')}</div>
          <div class="pd-main"><div class="pd-title"><strong>${esc(b.title)}</strong><span class="badge badge-plan-${esc(b.plan)}">${b.plan === 'free' ? 'Free' : '🔒 ' + esc(PLANS[b.plan] || b.plan)}</span>${b.published ? '' : '<span class="badge">Hidden</span>'}${b.units ? '<span class="badge badge-ok">e-book</span>' : ''}${b.style && b.style !== 'site' ? `<span class="badge badge-info">${esc(STYLE_NAMES[b.style] || b.style)}</span>` : ''}</div>
            <div class="muted sm">${b.units} unit${b.units === 1 ? '' : 's'} · ${b.exercises} exercise${b.exercises === 1 ? '' : 's'}${b.author ? ' · ' + esc(b.author) : ''}${b.hasFile ? ' · PDF ✓' : ''}</div></div>
          <div class="actions pd-actions"><a class="btn btn-sm" href="/books#${esc(b.id)}" target="_blank" rel="noopener">View ↗</a><a class="btn btn-sm btn-primary" href="#ebooks?book=${esc(b.id)}">${b.units ? 'Edit units' : 'Add units'}</a></div></div>`).join('') || '<div class="empty">No books yet. Make one in <a class="link-btn" href="#books">Books</a>, or add the sample e-book.</div>'}</div>
      </div>`;
  }

  /* ───────── the units of one book ───────── */
  function renderUnits() {
    const m = mount();
    const ex = units.reduce((a, u) => a + (u.exercises || []).length + (u.points || 0), 0), min = units.reduce((a, u) => a + (u.minutes || 0), 0);
    m.innerHTML = `
      <div class="card pd-editor-head"><div class="btn-row" style="justify-content:space-between"><div><a class="link-btn" href="#ebooks">← All books</a><div style="margin-top:4px"><strong style="font-size:17px">${esc(book.title)}</strong> <span class="badge badge-plan-${esc(book.plan)}">${book.plan === 'free' ? 'Free' : '🔒 ' + esc(PLANS[book.plan])}</span>${book.published ? '' : ' <span class="badge">Hidden</span>'}</div>
        <div class="muted sm">${units.length} unit${units.length === 1 ? '' : 's'} · ${ex} question${ex === 1 ? '' : 's'}${min ? ' · about ' + min + ' min' : ''}${book.author ? ' · ' + esc(book.author) : ''}</div></div>
        <div class="btn-row"><a class="btn" href="/books#${esc(book.id)}" target="_blank" rel="noopener">View as a student ↗</a><button class="btn btn-primary" data-eb="new" type="button">+ New unit</button></div></div></div>
      <div class="card eb-design-card"><div class="eb-design-row"><div><strong>Design of the book</strong><div class="muted sm">${esc(STYLE_INFO[bookStyle] || '')}</div></div>
        <div class="eb-design-pick" role="radiogroup" aria-label="Design of the book">${Object.keys(STYLE_NAMES).map((k) => `<button type="button" class="eb-design-opt${k === bookStyle ? ' on' : ''}" data-eb="style" data-style="${k}" aria-pressed="${k === bookStyle}"><i class="eb-sw eb-sw-${k}"></i>${esc(STYLE_NAMES[k])}</button>`).join('')}</div></div></div>
      <div class="card">
        <div class="pd-list">${units.map((u, i) => `<div class="pd-row">
          <div class="pn-thumb" style="--k:${KIND_K[u.kind] || 'var(--c1)'};font-weight:800">${i + 1}</div>
          <div class="pd-main"><div class="pd-title"><strong>${esc(u.title)}</strong><span class="badge">${esc(KINDS[u.kind] || u.kind)}</span>${u.audio ? '<span class="badge badge-info">🎧 audio</span>' : ''}${u.test ? '<span class="badge badge-info">test link</span>' : ''}</div>
            <div class="muted sm">${(u.exercises || []).length + (u.points || 0)} question${(u.exercises || []).length + (u.points || 0) === 1 ? '' : 's'}${u.minutes ? ' · ' + u.minutes + ' min' : ''}${u.content ? ' · ' + Math.max(1, Math.round(u.content.split(/\s+/).length)) + ' words' : ''}${u.summary ? ' · ' + esc(u.summary.slice(0, 90)) : ''}</div></div>
          <div class="actions pd-actions">
            <button class="btn btn-sm btn-icon" data-eb="up" data-id="${esc(u.id)}" type="button" title="Move up" ${i === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn btn-sm btn-icon" data-eb="down" data-id="${esc(u.id)}" type="button" title="Move down" ${i === units.length - 1 ? 'disabled' : ''}>↓</button>
            <a class="btn btn-sm" href="/books#${esc(book.id)}/${esc(u.id)}" target="_blank" rel="noopener">View ↗</a>
            <button class="btn btn-sm btn-primary" data-eb="edit" data-id="${esc(u.id)}" type="button">Edit</button>
            <button class="btn btn-sm btn-danger btn-icon" data-eb="delete" data-id="${esc(u.id)}" type="button" title="Delete">✕</button>
          </div></div>`).join('') || '<div class="empty">No units yet. Press “New unit”: write the text, add a recording or a test, and the exercises.</div>'}</div>
        <p class="muted sm" style="margin:12px 0 0">A unit is <b>learned</b> when its exercises reach 60 %, when its test is finished (a unit with a test and no exercises) or when the student presses “I have read it” (a unit with only text).</p>
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
    m.innerHTML = `<div class="card pd-editor-head"><div class="btn-row" style="justify-content:space-between"><div><div class="eyebrow">${esc(book.title)}</div><strong style="font-size:16px">${d.id ? 'Edit unit' : 'New unit'}</strong></div>
        <div class="btn-row"><button class="btn" data-eb="cancel" type="button">Cancel</button><button class="btn btn-primary" data-eb="save" type="button">Save unit</button></div></div></div>
      <div class="card pn-form">
        ${field('Title *', `<input class="field" data-f="title" value="${esc(d.title)}" maxlength="160" placeholder="e.g. Test 1 · Listening Part 1 — booking a hotel">`)}
        <div class="pn-grid3">
          ${field('Kind', `<select class="field" data-f="kind">${Object.entries(KINDS).map(([v, l]) => `<option value="${v}"${d.kind === v ? ' selected' : ''}>${l}</option>`).join('')}</select>`)}
          ${field('Minutes (about)', `<input class="field" data-f="minutes" type="number" min="0" max="600" value="${esc(d.minutes || '')}" placeholder="e.g. 15">`)}
          ${field('Summary', `<input class="field" data-f="summary" maxlength="300" value="${esc(d.summary)}" placeholder="One line shown in the list of units">`)}
        </div>
        <div class="eb-page-head"><strong>The book page of the unit</strong><span class="muted sm">Design: <b>${esc(STYLE_NAMES[bookStyle])}</b> (change it on the list of units)</span></div>
        <div class="eb-snips" role="toolbar" aria-label="Insert">${Object.entries(SNIPS).map(([k, v]) => `<button class="btn btn-sm" type="button" data-eb="snip" data-snip="${k}">+ ${esc(v[0])}</button>`).join('')}</div>
        <textarea class="field pn-mono eb-content" data-f="content" rows="22" spellcheck="false" placeholder="# Reading | Section 1&#10;::: passage The title&#10;The text …&#10;:::&#10;::: task Answer Questions 1–3.&#10;Questions 1–3&#10;Do the following statements agree with the information given in the passage?&#10;1 A statement. = T&#10;:::">${esc(d.content)}</textarea>
        <details class="eb-help"><summary>How to write a book page</summary><div class="eb-help-grid">
          <div><b>The page</b><code># Listening | Section 1</code> a section (after <code>|</code> in the second colour)<br><code># [A] Title</code> a lettered section (In Use)<br><code>## Heading</code> · <code>### SMALL HEADING</code><br><code>- bullet</code> · <code>1. numbered</code> · <code>&gt; example</code> · <code>! tip</code><br><code>| a | b |</code> a table · <code>**bold**</code> <code>*italic*</code> <code>__underline__</code> <code>==mark==</code> <code>~~crossed~~</code></div>
          <div><b>Boxes</b> — start with <code>::: name</code>, end with a line <code>:::</code><br><code>::: advice Title</code> Exam advice · <code>::: info</code> Exam information<br><code>::: passage Title</code> a reading text (last line <code>Source: …</code>)<br><code>::: note Title</code> · <code>::: panel Title</code> · <code>::: words</code> a box of words</div>
          <div><b>An exercise</b> — <code>::: task 1 The instruction.</code> … <code>:::</code> (the number is optional)<br><code>Questions 1–5</code> the exam box; the next lines are its instructions<br><code>1 Question?</code> then <code>A …</code> <code>B … *</code> (the right one with <code>*</code>, two with two <code>*</code>)<br><code>1 Statement. = T</code> (T, F, NG · Y, N, NG) · <code>@labels F, I, N</code> then <code>= F</code><br><code>[answer|other]</code> a gap · <code>[=example]</code> a filled example · <code>{right*|wrong}</code> circle the word<br><code>1 Sentence with a mistake. = correction</code> · <code>@match</code> + <code>1 meet = the deadline</code> (or A–F options and <code>= B</code>)<br><code>Box: a, b, c</code> words · <code>@flow</code> a flow-chart · <code>Why: …</code> the explanation of the question above</div>
        </div></details>
        <div class="btn-row eb-prev-bar"><button class="btn btn-primary btn-sm" data-eb="preview" type="button">Preview the page</button><label class="muted sm eb-key-toggle"><input type="checkbox" data-eb-key${showKey ? ' checked' : ''}> Show the answers</label><span class="muted sm" id="eb-prev-info"></span></div>
        <div id="eb-preview" class="eb-preview" hidden></div>
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
  }
  function readForm() {
    const m = mount(); if (!draft || !m) return;
    m.querySelectorAll('[data-f]').forEach((el) => { draft[el.getAttribute('data-f')] = el.value; });
    draft.exercises = Array.from(m.querySelectorAll('.pn-ex')).map((row) => {
      const v = (k) => { const el = row.querySelector(`[data-x="${k}"]`); return el ? el.value : ''; };
      const type = v('type') || 'choice';
      return { id: (draft.exercises[Number(row.getAttribute('data-ex'))] || {}).id, type, q: v('q'), options: type === 'choice' ? v('options').split('\n').map((o) => o.trim()).filter(Boolean) : [], answer: v('answer').trim(), explain: v('explain') };
    });
  }
  function openEditor(u) {
    draft = u ? JSON.parse(JSON.stringify(u)) : { id: '', title: '', kind: 'lesson', minutes: '', summary: '', content: '', audio: '', test: '', exercises: [] };
    delete draft.points;
    pasteOpen = false; preview = null; original = JSON.stringify(draft); renderEditor(); window.scrollTo(0, 0);
  }
  /* a piece of the format at the cursor */
  function insertSnip(k) {
    const ta = mount().querySelector('[data-f="content"]'); const snip = SNIPS[k]; if (!ta || !snip) return;
    const a = ta.selectionStart ?? ta.value.length, b = ta.selectionEnd ?? a;
    const before = ta.value.slice(0, a); const pre = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    ta.value = before + pre + snip[1] + ta.value.slice(b);
    const at = (before + pre + snip[1]).length; ta.focus(); ta.setSelectionRange(at, at);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
  /* the page as the student will see it (drawn by assets/js/ebook-render.js) */
  async function showPreview() {
    readForm();
    const box = $('#eb-preview'); const info = $('#eb-prev-info'); if (!box) return;
    if (!window.IXEbook) { box.hidden = false; box.innerHTML = '<div class="empty">Reload the page: the preview is not ready.</div>'; return; }
    if (info) info.textContent = 'Drawing…';
    try {
      const d = await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/preview', { content: draft.content, exercises: draft.exercises });
      preview = d;
      const n = draft.id ? units.findIndex((x) => x.id === draft.id) + 1 : units.length + 1;
      const R = window.IXEbook;
      box.hidden = false;
      box.innerHTML = (d.errors.length ? `<div class="eb-prev-errors"><b>Fix these lines before saving:</b><ul>${d.errors.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></div>` : '')
        + `<div class="ebk ebk-${esc(d.style)}"><div class="ebk-page">${R.head(d.style, n || 1, draft.title || 'Unit title', draft.summary)}${R.page(d.doc, { style: d.style, unit: n || 1 })}</div></div>`;
      R.bind(box.querySelector('.ebk'), null);
      if (showKey) R.fill(box.querySelector('.ebk'), d.key);
      if (info) info.textContent = d.points + ' question' + (d.points === 1 ? '' : 's') + ' · ' + (d.errors.length ? d.errors.length + ' to fix' : 'no mistakes in the format');
    } catch (e) { if (info) info.textContent = ''; fail(e); }
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
  async function save() {
    readForm();
    const btn = mount().querySelector('[data-eb="save"]'); if (btn) btn.disabled = true;
    try {
      const d = await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/units', { unit: { ...draft, minutes: Number(draft.minutes) || 0 } });
      units = d.units; bookStyle = d.style || bookStyle; draft = null; preview = null; books = null; toast('Unit saved'); render();
    } catch (e) { fail(e); if (btn) btn.disabled = false; }
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
      if (act === 'style') {
        const style = t.getAttribute('data-style'); if (style === bookStyle) return;
        const d = await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/style', { style }); bookStyle = d.style; units = d.units; books = null;
        toast('Design: ' + STYLE_NAMES[bookStyle]); return render();
      }
      if (act === 'snip') return insertSnip(t.getAttribute('data-snip'));
      if (act === 'preview') return showPreview();
      if (act === 'new') return openEditor(null);
      if (act === 'edit' && u) return openEditor(u);
      if (act === 'cancel') { readForm(); if (JSON.stringify(draft) !== original && !confirm('Leave without saving?')) return; draft = null; return render(); }
      if (act === 'save') return save();
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
        if (!window.IXAdmin || !window.IXAdmin.uploadFile) throw new Error('The uploader is not ready. Reload the page.');
        t.disabled = true; t.textContent = 'Uploading…';
        try { readForm(); draft.audio = await window.IXAdmin.uploadFile(f); toast('Uploaded ' + f.name); } finally { renderEditor(); }
        return;
      }
      if (act === 'delete' && u) {
        if (!confirm('Delete the unit “' + u.title + '”? Students do not see it any more.')) return;
        units = (await api('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/units/' + encodeURIComponent(u.id), { method: 'DELETE' })).units; books = null; toast('Unit deleted'); return render();
      }
      if ((act === 'up' || act === 'down') && u) {
        const ids = units.map((x) => x.id); const i = ids.indexOf(u.id); const j = act === 'up' ? i - 1 : i + 1;
        if (j < 0 || j >= ids.length) return; [ids[i], ids[j]] = [ids[j], ids[i]];
        units = (await post('/api/admin/ebooks/' + encodeURIComponent(book.id) + '/order', { ids })).units; return render();
      }
    } catch (err) { fail(err); }
  });
  // the type of an exercise changes its answer field; the options of a choice fill its answer list
  document.addEventListener('change', (e) => {
    if (!draft || !mount() || !mount().contains(e.target)) return;
    const x = e.target.getAttribute('data-x');
    if (x === 'type') { readForm(); const row = e.target.closest('.pn-ex'); const ex = draft.exercises[Number(row.getAttribute('data-ex'))]; if (ex) { if (TF[ex.type]) ex.answer = TF[ex.type].includes(ex.answer) ? ex.answer : TF[ex.type][0]; else if (ex.type !== 'choice' && TF.tfng.concat(TF.yng).includes(ex.answer)) ex.answer = ''; } renderEditor(); }
  });
  // "Show the answers" in the preview
  document.addEventListener('change', (e) => {
    if (!e.target.hasAttribute || !e.target.hasAttribute('data-eb-key')) return;
    showKey = e.target.checked;
    if (preview) showPreview();
  });
  document.addEventListener('focusout', (e) => {
    if (!draft || !mount() || !mount().contains(e.target) || e.target.getAttribute('data-x') !== 'options') return;
    const row = e.target.closest('.pn-ex'); const sel = row && row.querySelector('select[data-x="answer"]'); if (!sel) return;
    const cur = sel.value; const opts = e.target.value.split('\n').map((o) => o.trim()).filter(Boolean);
    sel.innerHTML = '<option value="">Which option is right?</option>' + opts.map((o) => `<option${o === cur ? ' selected' : ''}>${esc(o)}</option>`).join('');
  });
  window.addEventListener('beforeunload', (e) => { if (draft && mount() && (readForm(), JSON.stringify(draft) !== original)) { e.preventDefault(); e.returnValue = ''; } });
  const onHash = () => {
    const v = (location.hash || '').slice(1).split('?')[0];
    if (v !== 'ebooks') return;
    const bid = wantBook();
    if (draft && (!book || bid !== book.id)) draft = null;
    if (bid) { if (!book || book.id !== bid) openBook(bid); else render(); }
    else { book = null; units = null; if (!books) loadBooks(); else render(); }
  };
  window.addEventListener('hashchange', onHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onHash); else onHash();
})();
