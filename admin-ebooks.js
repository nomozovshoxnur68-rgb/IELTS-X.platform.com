/*
 * IELTSX admin: E-books (admin.html#ebooks, #ebooks?book=<id>) — the server is ebooks.js.
 * A book of the Books page (Admin → Books: title, cover, PDF, plan) becomes an interactive e-book with units:
 *   unit      title, kind (Lesson, Reading, Listening …), minutes, a short summary, the text (the Grammar formatting),
 *             an optional recording, an optional link to a test of this website, and exercises
 *   exercise  choice (options, one is right) · gap (typed; several right answers: a|b) · True / False / Not Given ·
 *             Yes / No / Not Given — with an optional explanation shown after "Check answers"
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
  let books = null, loading = false, book = null, units = null, draft = null, original = '', tests = null, pasteOpen = false;

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
    try { const d = await api('/api/admin/ebooks/' + encodeURIComponent(id)); book = d.book; units = d.units; }
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
        <div class="btn-row"><a class="btn" href="/books" target="_blank" rel="noopener">Open the Books page ↗</a><a class="btn" href="#books">+ New book</a><button class="btn btn-primary" data-eb="sample" type="button">Add the sample e-book</button></div>
      </div>
      <div class="card">
        <div class="toolbar"><div class="muted sm" style="flex:1">${books.length} book${books.length === 1 ? '' : 's'} · ${books.filter((b) => b.units).length} with units</div></div>
        <div class="pd-list">${books.map((b) => `<div class="pd-row${b.published ? '' : ' is-hidden'}">
          <div class="pn-thumb pn-books" style="--k:var(--c4)">${b.cover ? `<img src="${esc(b.cover)}" alt="" loading="lazy">` : icon('book')}</div>
          <div class="pd-main"><div class="pd-title"><strong>${esc(b.title)}</strong><span class="badge badge-plan-${esc(b.plan)}">${b.plan === 'free' ? 'Free' : '🔒 ' + esc(PLANS[b.plan] || b.plan)}</span>${b.published ? '' : '<span class="badge">Hidden</span>'}${b.units ? '<span class="badge badge-ok">e-book</span>' : ''}</div>
            <div class="muted sm">${b.units} unit${b.units === 1 ? '' : 's'} · ${b.exercises} exercise${b.exercises === 1 ? '' : 's'}${b.author ? ' · ' + esc(b.author) : ''}${b.hasFile ? ' · PDF ✓' : ''}</div></div>
          <div class="actions pd-actions"><a class="btn btn-sm" href="/books#${esc(b.id)}" target="_blank" rel="noopener">View ↗</a><a class="btn btn-sm btn-primary" href="#ebooks?book=${esc(b.id)}">${b.units ? 'Edit units' : 'Add units'}</a></div></div>`).join('') || '<div class="empty">No books yet. Make one in <a class="link-btn" href="#books">Books</a>, or add the sample e-book.</div>'}</div>
      </div>`;
  }

  /* ───────── the units of one book ───────── */
  function renderUnits() {
    const m = mount();
    const ex = units.reduce((a, u) => a + (u.exercises || []).length, 0), min = units.reduce((a, u) => a + (u.minutes || 0), 0);
    m.innerHTML = `
      <div class="card pd-editor-head"><div class="btn-row" style="justify-content:space-between"><div><a class="link-btn" href="#ebooks">← All books</a><div style="margin-top:4px"><strong style="font-size:17px">${esc(book.title)}</strong> <span class="badge badge-plan-${esc(book.plan)}">${book.plan === 'free' ? 'Free' : '🔒 ' + esc(PLANS[book.plan])}</span>${book.published ? '' : ' <span class="badge">Hidden</span>'}</div>
        <div class="muted sm">${units.length} unit${units.length === 1 ? '' : 's'} · ${ex} exercise${ex === 1 ? '' : 's'}${min ? ' · about ' + min + ' min' : ''}${book.author ? ' · ' + esc(book.author) : ''}</div></div>
        <div class="btn-row"><a class="btn" href="/books#${esc(book.id)}" target="_blank" rel="noopener">View as a student ↗</a><button class="btn btn-primary" data-eb="new" type="button">+ New unit</button></div></div></div>
      <div class="card">
        <div class="pd-list">${units.map((u, i) => `<div class="pd-row">
          <div class="pn-thumb" style="--k:${KIND_K[u.kind] || 'var(--c1)'};font-weight:800">${i + 1}</div>
          <div class="pd-main"><div class="pd-title"><strong>${esc(u.title)}</strong><span class="badge">${esc(KINDS[u.kind] || u.kind)}</span>${u.audio ? '<span class="badge badge-info">🎧 audio</span>' : ''}${u.test ? '<span class="badge badge-info">test link</span>' : ''}</div>
            <div class="muted sm">${(u.exercises || []).length} exercise${(u.exercises || []).length === 1 ? '' : 's'}${u.minutes ? ' · ' + u.minutes + ' min' : ''}${u.content ? ' · ' + Math.max(1, Math.round(u.content.split(/\s+/).length)) + ' words' : ''}${u.summary ? ' · ' + esc(u.summary.slice(0, 90)) : ''}</div></div>
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
        ${field('The text of the unit', `<textarea class="field pn-mono" data-f="content" rows="14" placeholder="## What this unit is about&#10;Explain the skill, then give the reading text …&#10;&#10;- a bullet&#10;> an example&#10;! a tip&#10;| Word | Meaning |&#10;| rise | go up |">${esc(d.content)}</textarea>`,
          'Formatting: <code>## Heading</code> · <code>- bullet</code> · <code>1. numbered</code> · <code>&gt; example</code> · <code>! tip</code> · <code>| a | b |</code> table · <code>**bold**</code> · <code>*italic*</code> · <code>==marked==</code>. Empty lines separate paragraphs.')}
        <div class="pn-grid2">
          ${field('Recording (optional)', `<div class="pn-upload"><input class="field" data-f="audio" value="${esc(d.audio)}" placeholder="https://… or upload"><button class="btn btn-sm" type="button" data-eb="upload" data-accept="audio/*,.mp3,.m4a,.ogg,.wav">Upload audio</button></div>`, 'MP3 is best. Played above the exercises.')}
          ${field('A test of this website (optional)', `<select class="field" data-f="test">${testOptions(d.test)}</select>`, 'The student opens it from the unit. A unit with a test and no exercises is learned when the test is finished.')}
        </div>
        ${d.audio ? `<audio class="pn-audio" controls preload="none" src="${esc(d.audio)}"></audio>` : ''}
        <div class="pn-ex-head"><strong>Exercises</strong><span class="muted sm">Checked on the server when the student presses “Check answers”; the best score is kept. 60 % = the unit is learned.</span></div>
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
    pasteOpen = false; original = JSON.stringify(draft); renderEditor(); window.scrollTo(0, 0);
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
      units = d.units; draft = null; books = null; toast('Unit saved'); render();
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
        if (!confirm('Add the sample e-book “IELTS Starter Workbook” (5 units, free, shown on the Books page)? You can change or delete it later.')) return;
        const d = await post('/api/admin/ebooks/sample'); toast('Sample e-book added'); books = null; location.hash = '#ebooks?book=' + d.book.id; return;
      }
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
