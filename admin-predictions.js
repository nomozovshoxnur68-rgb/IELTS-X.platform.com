/*
 * IELTSX admin: Predictions (admin.html#predictions).
 * Collections of the tests and questions expected in the real exam, shown on the Predictions page (/Predictions).
 *   - Reading / Listening: pick tests of this website (or paste any link of the site)
 *   - Writing / Speaking:  write the questions, cue cards and tasks (one by one, or paste many at once)
 * Each collection has its plan (Free / Standard / Max / Ultra), a status (Updating / Complete) and can be hidden.
 * The server (predictions.js) checks everything and never sends a locked collection's questions to a student.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const SKILLS = {
    reading: { name: 'Reading', item: 'test', icon: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>' },
    listening: { name: 'Listening', item: 'test', icon: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>' },
    writing: { name: 'Writing', item: 'question', icon: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>' },
    speaking: { name: 'Speaking', item: 'question', icon: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>' }
  };
  const PLANS = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  const PARTS = { speaking: ['Part 1', 'Part 2', 'Part 3'], writing: ['Task 1', 'Task 2'], reading: ['Passage 1', 'Passage 2', 'Passage 3'], listening: ['Part 1', 'Part 2', 'Part 3', 'Part 4'] };
  const svg = (path, cls) => `<svg class="${cls || 'ico-svg'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;

  let list = null, loading = false, busy = false;
  let skillFilter = '', query = '';
  let draft = null, original = '';      // the collection being edited and how it looked when opened
  let catalog = null;                   // { reading: [{pack, title, href, source}], ... } for "Choose a test"
  let bulkOpen = false;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body && !(opt.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const dirty = () => !!draft && JSON.stringify(draft) !== original;
  function ago(v) {
    if (!v) return '—'; const s = Math.max(0, (Date.now() - new Date(v).getTime()) / 1000);
    if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + ' min ago'; if (s < 86400) return Math.floor(s / 3600) + ' h ago';
    if (s < 30 * 86400) return Math.floor(s / 86400) + ' d ago'; return new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  const sizeText = (c) => {
    const parts = [];
    if (c.tests) parts.push(c.tests + ' test' + (c.tests === 1 ? '' : 's'));
    if (c.questions) parts.push(c.questions + ' question' + (c.questions === 1 ? '' : 's'));
    return parts.join(' · ') || 'empty';
  };

  /* ───────── the list ───────── */
  function renderList() {
    const mount = $('#content-predictions'); if (!mount) return;
    if (!list) { mount.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
    const all = list;
    const shown = all.filter((c) => (!skillFilter || c.skill === skillFilter) && (!query || `${c.title} ${c.period} ${c.description}`.toLowerCase().includes(query)));
    const total = all.reduce((a, c) => a + (c.count || 0), 0), hot = all.reduce((a, c) => a + (c.hot || 0), 0);
    const tab = (v, n) => `<button class="tab${skillFilter === v ? ' active' : ''}" data-pd="skill" data-v="${v}" type="button">${n}<span class="n">${v ? all.filter((c) => c.skill === v).length : all.length}</span></button>`;
    mount.innerHTML = `
      <div class="pd-hero card">
        <div class="pd-hero-text"><div class="eyebrow">Students see these on the Predictions page</div><h2>Exam predictions</h2>
          <p class="muted">Group the tests and questions that keep appearing in the real exam. Reading and Listening link to tests of this website, Writing and Speaking hold the questions themselves. A locked collection shows only its name and size until the student has the plan.</p></div>
        <div class="btn-row"><a class="btn" href="/Predictions" target="_blank" rel="noopener">Open the page ↗</a><button class="btn btn-primary" data-pd="new" type="button">+ New collection</button></div>
      </div>
      <div class="grid stats mini-stats">
        ${miniStat('Collections', all.length, 'layers')}${miniStat('Published', all.filter((c) => c.published !== false).length, 'eye')}
        ${miniStat('Tests and questions', total, 'list')}${miniStat('Very likely', hot, 'flame')}
      </div>
      <div class="card">
        <div class="toolbar"><div class="tabs" style="margin:0;flex:1 1 auto">${tab('', 'All')}${Object.entries(SKILLS).map(([k, s]) => tab(k, s.name)).join('')}</div>
          <input class="field" data-pd-search type="search" placeholder="Search collections" value="${esc(query)}" style="flex:0 1 260px"></div>
        <div class="pd-list">${shown.map(rowHtml).join('') || `<div class="empty">${all.length ? 'No collection matches.' : 'No collections yet. Press “New collection”.'}</div>`}</div>
      </div>`;
  }
  const ICONS = {
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'
  };
  const miniStat = (label, value, icon) => `<div class="card stat"><div><div class="stat-label">${esc(label)}</div><div class="stat-value">${esc(value)}</div></div><div class="stat-icon">${svg(ICONS[icon])}</div></div>`;
  function rowHtml(c, i) {
    const s = SKILLS[c.skill] || SKILLS.reading;
    return `<div class="pd-row${c.published === false ? ' is-hidden' : ''}" data-id="${esc(c.id)}">
      <div class="pd-skill pd-${esc(c.skill)}">${svg(s.icon)}</div>
      <div class="pd-main">
        <div class="pd-title"><strong>${esc(c.title)}</strong>
          <span class="badge badge-plan-${esc(c.plan)}">${c.plan === 'free' ? 'Free' : '🔒 ' + esc(PLANS[c.plan] || c.plan)}</span>
          <span class="badge ${c.status === 'complete' ? 'badge-ok' : 'badge-warn'}">${c.status === 'complete' ? 'Complete' : 'Updating'}</span>
          ${c.published === false ? '<span class="badge">Hidden</span>' : ''}</div>
        <div class="muted sm">${esc(s.name)}${c.period ? ' · ' + esc(c.period) : ''} · ${esc(sizeText(c))}${c.hot ? ` · <span class="pd-hot-text">${c.hot} very likely</span>` : ''} · updated ${esc(ago(c.updatedAt))}</div>
      </div>
      <div class="actions pd-actions">
        <button class="btn btn-sm btn-icon" data-pd="up" data-id="${esc(c.id)}" type="button" title="Move up" ${i === 0 || skillFilter || query ? 'disabled' : ''}>↑</button>
        <button class="btn btn-sm btn-icon" data-pd="down" data-id="${esc(c.id)}" type="button" title="Move down" ${i === list.length - 1 || skillFilter || query ? 'disabled' : ''}>↓</button>
        <button class="btn btn-sm" data-pd="publish" data-id="${esc(c.id)}" data-v="${c.published === false ? '1' : '0'}" type="button">${c.published === false ? 'Publish' : 'Hide'}</button>
        <a class="btn btn-sm" href="/Predictions#${esc(c.id)}" target="_blank" rel="noopener">Preview</a>
        <button class="btn btn-sm btn-primary" data-pd="edit" data-id="${esc(c.id)}" type="button">Edit</button>
        <button class="btn btn-sm btn-danger btn-icon" data-pd="delete" data-id="${esc(c.id)}" type="button" title="Delete">✕</button>
      </div></div>`;
  }

  /* ───────── the editor ───────── */
  const blankItem = (kind, part) => ({ id: '', kind, title: '', part: part || '', text: '', href: '', image: '', hot: false });
  function openEditor(c) {
    draft = c ? JSON.parse(JSON.stringify({ id: c.id, title: c.title, skill: c.skill, period: c.period || '', description: c.description || '', plan: c.plan, status: c.status, published: c.published !== false, items: c.items || [] }))
      : { id: '', title: '', skill: skillFilter || 'speaking', period: '', description: '', plan: 'max', status: 'updating', published: true, items: [] };
    original = JSON.stringify(draft); bulkOpen = false;
    renderEditor(); loadCatalog();
    window.scrollTo(0, 0);
  }
  function closeEditor(force) {
    if (!force && dirty() && !confirm('Leave without saving? Your changes to this collection are lost.')) return;
    draft = null; original = ''; renderList();
  }
  function testOptions(item) {
    const tests = (catalog && catalog[draft.skill]) || [];
    if (!catalog) return '<option value="">Loading the tests…</option>';
    if (!tests.length) return '<option value="">No tests for this skill yet</option>';
    const groups = new Map(); tests.forEach((t) => { if (!groups.has(t.pack)) groups.set(t.pack, []); groups.get(t.pack).push(t); });
    return '<option value="">Choose a test of the website…</option>' + [...groups].map(([pack, ts]) => `<optgroup label="${esc(pack)}">${ts.map((t) => `<option value="${esc(t.href)}" ${t.href === item.href ? 'selected' : ''}>${esc(t.title)}${t.source ? ' — ' + esc(t.source) : ''}</option>`).join('')}</optgroup>`).join('');
  }
  function itemHtml(it, n) {
    const isTest = it.kind === 'test';
    return `<div class="pd-item${it.hot ? ' is-hot' : ''}" data-i="${n}">
      <div class="pd-item-num">${n + 1}</div>
      <div class="pd-item-body">
        <div class="pd-item-top">
          <select class="field" data-f="kind" aria-label="Kind"><option value="test" ${isTest ? 'selected' : ''}>Test link</option><option value="question" ${!isTest ? 'selected' : ''}>Question / task</option></select>
          <input class="field" data-f="part" list="pd-parts" value="${esc(it.part)}" placeholder="Part" aria-label="Part" style="flex:0 0 120px">
          <input class="field" data-f="title" value="${esc(it.title)}" placeholder="${isTest ? 'Title shown to students' : 'Topic or short title'}" aria-label="Title" style="flex:1 1 220px">
          <label class="pd-hotbox" title="Mark as very likely"><input type="checkbox" data-f="hot" ${it.hot ? 'checked' : ''}> 🔥 Very likely</label>
        </div>
        ${isTest
          ? `<div class="pd-item-top"><select class="field" data-pick aria-label="Choose a test" style="flex:1 1 260px">${testOptions(it)}</select>
             <input class="field" data-f="href" value="${esc(it.href)}" placeholder="/full-tests/reading/test-3" aria-label="Link" style="flex:1 1 220px"></div>`
          : `<textarea class="field" data-f="text" rows="${Math.min(8, Math.max(2, String(it.text || '').split('\n').length + 1))}" placeholder="${draft.skill === 'speaking' ? 'The question, or the whole cue card (Describe a … You should say: …)' : 'The task as students will see it'}">${esc(it.text)}</textarea>
             <div class="pd-item-top"><input class="field" data-f="image" value="${esc(it.image)}" placeholder="Picture (optional): link or upload — e.g. a Writing Task 1 chart" style="flex:1 1 260px"><button class="btn btn-sm" data-pd="img" data-i="${n}" type="button">⬆ Upload</button></div>
             ${it.image ? `<img class="pd-item-img" src="${esc(it.image)}" alt="">` : ''}`}
      </div>
      <div class="pd-item-act">
        <button class="btn btn-sm btn-icon" data-pd="iup" data-i="${n}" type="button" title="Move up" ${n === 0 ? 'disabled' : ''}>↑</button>
        <button class="btn btn-sm btn-icon" data-pd="idown" data-i="${n}" type="button" title="Move down" ${n === draft.items.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="btn btn-sm btn-icon btn-danger" data-pd="idel" data-i="${n}" type="button" title="Remove">✕</button>
      </div></div>`;
  }
  function renderEditor() {
    const mount = $('#content-predictions'); if (!mount || !draft) return;
    const s = SKILLS[draft.skill];
    const opt = (map, v) => Object.entries(map).map(([k, n]) => `<option value="${k}" ${v === k ? 'selected' : ''}>${esc(typeof n === 'string' ? n : n.name)}</option>`).join('');
    const nTests = draft.items.filter((i) => i.kind === 'test').length, nQ = draft.items.length - nTests, nHot = draft.items.filter((i) => i.hot).length;
    mount.innerHTML = `
      <div class="card pd-editor-head">
        <div class="section-head" style="margin:0">
          <div><button class="link-btn" data-pd="back" type="button">← All collections</button>
            <div class="section-title" style="margin-top:6px">${draft.id ? 'Edit collection' : 'New collection'}</div></div>
          <div class="btn-row">${draft.id ? `<a class="btn" href="/Predictions#${esc(draft.id)}" target="_blank" rel="noopener">Preview ↗</a>` : ''}<button class="btn" data-pd="back" type="button">Cancel</button><button class="btn btn-primary" data-pd="save" type="button" ${busy ? 'disabled' : ''}>${busy ? 'Saving…' : 'Save'}</button></div>
        </div>
      </div>
      <div class="card">
        <div class="cb-grid">
          <label class="lbl">Name<input class="field" data-d="title" maxlength="120" value="${esc(draft.title)}" placeholder="e.g. Speaking September–December"></label>
          <label class="lbl">Skill<select class="field" data-d="skill">${opt(SKILLS, draft.skill)}</select></label>
          <label class="lbl">Period<input class="field" data-d="period" maxlength="60" value="${esc(draft.period)}" placeholder="e.g. Sep–Dec 2026"></label>
          <label class="lbl">Who can open it<select class="field" data-d="plan">${opt({ free: 'Free — everybody', standard: 'Standard and higher', max: 'Max and Ultra', ultra: 'Ultra only' }, draft.plan)}</select></label>
          <label class="lbl">Status<select class="field" data-d="status">${opt({ updating: 'Updating — more coming', complete: 'Complete' }, draft.status)}</select></label>
          <label class="lbl">On the page<select class="field" data-d="published">${opt({ yes: 'Published', no: 'Hidden (only admins see it)' }, draft.published ? 'yes' : 'no')}</select></label>
        </div>
        <label class="lbl" style="margin-top:12px">Short description<textarea class="field" data-d="description" maxlength="600" rows="2" placeholder="What is inside and how to use it">${esc(draft.description)}</textarea></label>
      </div>
      <div class="card">
        <div class="section-head">
          <div><div class="section-title">${esc(s.name)} items <span class="muted" style="font-weight:500">· ${nTests} test${nTests === 1 ? '' : 's'}, ${nQ} question${nQ === 1 ? '' : 's'}${nHot ? `, ${nHot} very likely` : ''}</span></div>
            <div class="muted sm">${s.item === 'test' ? 'Choose tests of this website. Students open them straight from the collection.' : 'Write each question or task. Use Part to group them (Part 1, Part 2 …). Students tick what they have practised.'}</div></div>
          <div class="btn-row"><button class="btn btn-sm" data-pd="add-test" type="button">+ Test link</button><button class="btn btn-sm" data-pd="add-q" type="button">+ Question</button><button class="btn btn-sm${bulkOpen ? ' btn-primary' : ''}" data-pd="bulk" type="button">Paste many</button></div>
        </div>
        ${bulkOpen ? bulkHtml() : ''}
        <datalist id="pd-parts">${(PARTS[draft.skill] || []).map((p) => `<option value="${esc(p)}">`).join('')}</datalist>
        <div class="pd-items">${draft.items.map(itemHtml).join('') || `<div class="empty">No items yet. Add ${s.item === 'test' ? 'a test link' : 'a question'} above.</div>`}</div>
        ${draft.items.length > 4 ? '<div class="btn-row" style="margin-top:12px"><button class="btn btn-sm" data-pd="add-test" type="button">+ Test link</button><button class="btn btn-sm" data-pd="add-q" type="button">+ Question</button><span style="flex:1"></span><button class="btn btn-primary" data-pd="save" type="button">Save</button></div>' : ''}
      </div>`;
  }
  function bulkHtml() {
    const sp = draft.skill === 'speaking';
    return `<div class="pd-bulk">
      <div class="muted sm"><strong>One question per line.</strong> A line that is only “Part 1”, “Part 2” or “Task 1” sets the part of the lines under it. To keep several lines together (a whole ${sp ? 'cue card' : 'task'}), put an empty line before and after them. A line starting with 🔥 or * is marked very likely.</div>
      <textarea class="field cb-mono" data-bulk rows="8" placeholder="${sp ? 'Part 1\nDo you work or are you a student?\n* What do you like about your hometown?\n\nPart 2\nDescribe a place you would like to visit.\nYou should say: where it is …' : 'Task 2\nSome people think … To what extent do you agree or disagree?'}"></textarea>
      <div class="btn-row"><button class="btn btn-sm btn-primary" data-pd="bulk-add" type="button">Add these</button><button class="btn btn-sm" data-pd="bulk" type="button">Close</button></div></div>`;
  }
  /* "Part 1" / "Task 2:" lines set the part of what follows. Lines that are all questions ("…?") become one item each;
     any other group of lines (a cue card, a Writing task) separated by an empty line stays one item. */
  const HEAD = /^(part|task|passage|section)\s*\d\s*:?$/i;
  const HOT = /^(🔥|\*)\s*/;
  function parseBulk(text) {
    const out = []; let part = '';
    const add = (body) => {
      body = body.trim(); if (!body) return;
      const it = blankItem('question', part); it.hot = HOT.test(body);
      it.text = body.replace(HOT, ''); it.title = it.text.split('\n')[0].slice(0, 120);
      out.push(it);
    };
    const blocks = String(text || '').replace(/\r/g, '').split(/\n\s*\n/);
    for (const block of blocks) {
      let lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      const groups = []; let cur = [];
      for (const l of lines) {   // a part heading can sit anywhere: it closes the lines above it
        if (HEAD.test(l)) { if (cur.length) groups.push({ part, lines: cur }); cur = []; part = l.replace(/:$/, '').replace(/^\w/, (c) => c.toUpperCase()); continue; }
        cur.push(l);
      }
      if (cur.length) groups.push({ part, lines: cur });
      for (const g of groups) {
        const p = part; part = g.part;
        lines = g.lines;
        if (blocks.length === 1 || lines.every((l) => /\?\s*$/.test(l))) lines.forEach(add);   // no empty lines at all, or only questions
        else add(lines.join('\n'));
        part = p;
      }
    }
    return out;
  }

  /* the tests of the website, by skill (the same list as Access) */
  async function loadCatalog() {
    if (catalog) return;
    try {
      const d = await api('/api/admin/access'); const c = {};
      for (const sk of d.skills || []) c[sk.skill] = (sk.packs || []).flatMap((p) => (p.tests || []).filter((t) => t.href).map((t) => ({ pack: p.title, title: t.title, href: t.href, source: t.source || '' })));
      catalog = c; if (draft) renderEditor();
    } catch (e) { catalog = {}; if (draft) renderEditor(); }
  }

  /* ───────── load, save ───────── */
  async function load() {
    loading = true; if (!draft) renderList();
    try { list = (await api('/api/admin/predictions')).collections || []; if (!draft) renderList(); }
    catch (e) { fail(e); const m = $('#content-predictions'); if (m && !draft) m.innerHTML = '<div class="card"><div class="empty">Could not load. Press Refresh.</div></div>'; }
    finally { loading = false; }
  }
  async function save() {
    if (!draft) return;
    if (!draft.title.trim()) { toast('Give the collection a name.', true); const f = $('[data-d="title"]'); if (f) f.focus(); return; }
    const empty = draft.items.findIndex((i) => i.kind === 'test' && !i.href);
    if (empty >= 0) { toast(`Item ${empty + 1}: choose a test or paste its link.`, true); return; }
    busy = true; renderEditor();
    try {
      const d = await api('/api/admin/predictions', { method: 'POST', body: JSON.stringify({ collection: draft }) });
      list = d.collections || list; toast('Saved — students see it on the Predictions page' + (d.collection && d.collection.published === false ? ' (hidden for now)' : ''));
      busy = false; draft = null; original = ''; renderList();
    } catch (e) { busy = false; fail(e); renderEditor(); }
  }
  async function move(id, dir) {
    const i = list.findIndex((c) => c.id === id); const j = i + dir; if (i < 0 || j < 0 || j >= list.length) return;
    const ids = list.map((c) => c.id); [ids[i], ids[j]] = [ids[j], ids[i]];
    list = (await api('/api/admin/predictions/order', { method: 'POST', body: JSON.stringify({ ids }) })).collections; renderList();
  }
  function pickImage() {
    return new Promise((resolve) => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif';
      inp.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'; document.body.appendChild(inp);
      const done = (f) => { try { inp.remove(); } catch (e) { /* gone */ } resolve(f); };
      inp.addEventListener('cancel', () => done(null)); inp.onchange = () => done(inp.files && inp.files[0]); inp.click();
    });
  }
  async function uploadImage(n) {
    const f = await pickImage(); if (!f || !draft || !draft.items[n]) return;
    if (f.size > 3 * 1024 * 1024) return toast('The picture is larger than 3 MB. Make it smaller and try again.', true);
    try {
      toast('Uploading ' + f.name + ' …');
      const fd = new FormData(); fd.append('type', 'image'); fd.append('file', f, f.name);
      draft.items[n].image = (await api('/api/admin/uploads', { method: 'POST', body: fd })).url; renderEditor(); toast('Picture added — press Save');
    } catch (e) { fail(e); }
  }

  /* ───────── events ───────── */
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-pd]'); if (!t || !$('#content-predictions') || !$('#content-predictions').contains(t)) return;
    const a = t.dataset.pd, id = t.dataset.id, n = Number(t.dataset.i);
    try {
      if (a === 'skill') { skillFilter = t.dataset.v; return renderList(); }
      if (a === 'new') return openEditor(null);
      if (a === 'edit') { const c = list.find((x) => x.id === id); if (c) openEditor(c); return; }
      if (a === 'back') return closeEditor();
      if (a === 'save') return save();
      if (a === 'up' || a === 'down') return await move(id, a === 'up' ? -1 : 1);
      if (a === 'publish') { list = (await api(`/api/admin/predictions/${encodeURIComponent(id)}/publish`, { method: 'POST', body: JSON.stringify({ published: t.dataset.v === '1' }) })).collections; toast(t.dataset.v === '1' ? 'Published' : 'Hidden from students'); return renderList(); }
      if (a === 'delete') {
        const c = list.find((x) => x.id === id); if (!c) return;
        if (!confirm(`Delete “${c.title}” and its ${c.count || 0} item(s)? This cannot be undone.`)) return;
        list = (await api(`/api/admin/predictions/${encodeURIComponent(id)}`, { method: 'DELETE' })).collections; toast('Collection deleted'); return renderList();
      }
      if (!draft) return;
      const part = (PARTS[draft.skill] || [])[0] || '';
      const lastPart = draft.items.length ? draft.items[draft.items.length - 1].part : part;
      if (a === 'add-test' || a === 'add-q') { draft.items.push(blankItem(a === 'add-test' ? 'test' : 'question', lastPart)); renderEditor(); const rows = document.querySelectorAll('.pd-item'); const last = rows[rows.length - 1]; if (last) { last.scrollIntoView({ block: 'center', behavior: 'smooth' }); const f = last.querySelector(a === 'add-test' ? '[data-pick]' : '[data-f="text"]'); if (f) f.focus(); } return; }
      if (a === 'bulk') { bulkOpen = !bulkOpen; renderEditor(); if (bulkOpen) { const b = $('[data-bulk]'); if (b) b.focus(); } return; }
      if (a === 'bulk-add') { const items = parseBulk(($('[data-bulk]') || {}).value || ''); if (!items.length) return toast('Paste at least one question.', true); draft.items.push(...items); bulkOpen = false; renderEditor(); return toast(items.length + ' item' + (items.length === 1 ? '' : 's') + ' added — press Save'); }
      if (a === 'iup' || a === 'idown') { const j = n + (a === 'iup' ? -1 : 1); if (j < 0 || j >= draft.items.length) return; [draft.items[n], draft.items[j]] = [draft.items[j], draft.items[n]]; return renderEditor(); }
      if (a === 'idel') { const it = draft.items[n]; if ((it.text || it.title || it.href) && !confirm('Remove this item?')) return; draft.items.splice(n, 1); return renderEditor(); }
      if (a === 'img') return uploadImage(n);
    } catch (err) { fail(err); }
  });
  // typing changes the draft without drawing the form again (the cursor stays where it is)
  document.addEventListener('input', (e) => {
    const el = e.target; const root = $('#content-predictions'); if (!root || !root.contains(el)) return;
    if (el.matches('[data-pd-search]')) { query = el.value.trim().toLowerCase(); clearTimeout(renderList.t); renderList.t = setTimeout(() => { renderList(); const s = $('[data-pd-search]'); if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); } }, 150); return; }
    if (!draft) return;
    if (el.dataset.d && el.tagName !== 'SELECT') { draft[el.dataset.d] = el.value; return; }
    const row = el.closest('.pd-item'); if (!row || !el.dataset.f || el.type === 'checkbox' || el.tagName === 'SELECT') return;
    const it = draft.items[Number(row.dataset.i)]; if (it) it[el.dataset.f] = el.value;
  });
  document.addEventListener('change', (e) => {
    const el = e.target; const root = $('#content-predictions'); if (!root || !root.contains(el) || !draft) return;
    if (el.dataset.d) {
      if (el.dataset.d === 'published') draft.published = el.value === 'yes';
      else draft[el.dataset.d] = el.value;
      if (el.dataset.d === 'skill') renderEditor();
      return;
    }
    const row = el.closest('.pd-item'); if (!row) return;
    const it = draft.items[Number(row.dataset.i)]; if (!it) return;
    if (el.matches('[data-pick]')) {
      if (!el.value) return;
      it.href = el.value;
      const t = ((catalog && catalog[draft.skill]) || []).find((x) => x.href === el.value);
      if (t && !it.title) it.title = t.source && !/^(practice page card|$)/i.test(t.source) ? `${t.title} (${t.source})` : t.title;
      return renderEditor();
    }
    if (el.dataset.f === 'hot') { it.hot = el.checked; row.classList.toggle('is-hot', el.checked); return; }
    if (el.dataset.f === 'kind') { it.kind = el.value; return renderEditor(); }
    if (el.dataset.f === 'image') { it.image = el.value.trim(); return renderEditor(); }
  });
  window.addEventListener('beforeunload', (e) => { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });

  const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'predictions' && !list && !loading) load(); };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('DOMContentLoaded', () => {
    renderList(); onHash();
    const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if ($('#view-predictions.active') && !dirty()) { list = null; draft = null; load(); } });
  });
})();
