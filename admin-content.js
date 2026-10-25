/* IELTSX admin: Reading / Listening / Writing / Speaking / Articles builder (admin.html #reading #listening #writing #speaking #articles). */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const TYPES = { reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking', article: 'Articles', pdf: 'PDF materials' };
  const TOPICS = ['General', 'History', 'Science', 'Technology', 'Environment', 'Health', 'Education', 'Society', 'Business', 'Culture', 'Nature', 'Psychology'];
  const Q_LABEL = { short: 'Short answer / sentence completion', completion: 'Note / form / table / flow-chart / summary completion', tfng: 'True / False / Not Given', ynng: 'Yes / No / Not Given', mcq: 'Multiple choice (one answer)', 'mcq-multi': 'Multiple choice (two or more answers)', matching: 'Matching: headings / information / features / sentence endings', map: 'Map / plan / diagram labelling (choose a letter)' };
  const OPT_TYPES = ['mcq', 'mcq-multi', 'matching', 'map'];
  const lists = { reading: null, listening: null, writing: null, speaking: null, article: null, pdf: null };
  const VIEW_FOR = { articles: 'article' };            // #articles in the address bar = the article list
  let draft = null, editingId = null, uploading = 0;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', ...opt, headers: { ...(opt.body && !(opt.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const fmt = (v) => (v ? new Date(v).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

  /* ───────── list views ───────── */
  async function loadType(type) {
    try { lists[type] = (await api('/api/admin/materials?type=' + type)).items.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))); } catch (e) { fail(e); lists[type] = lists[type] || []; }
    renderType(type);
  }
  const NOUN = { reading: 'test', listening: 'listening card', writing: 'writing card', speaking: 'speaking card', article: 'article card', pdf: 'PDF material' };
  const HELP = {
    reading: 'Passage, pictures and questions with answers. Graded automatically.',
    listening: 'Audio file, map/diagram pictures and questions with answers. Graded automatically.',
    writing: 'Task 1 / Task 2 prompts with an optional chart picture and model answer.',
    speaking: 'Part 1 questions, Part 2 cue card, Part 3 discussion. Timers, pictures, model-answer audio.',
    article: 'Reading articles with a cover picture, pictures inside the text, topic and source.',
    pdf: 'A PDF file with its own card (picture, title, tags) on the PDF Library page. Students download it from the card.'
  };
  const WHERE = { reading: 'the Reading practice page (Part) or the Full Reading page (Full)', listening: 'the Listening practice page', writing: 'the Writing practice page', speaking: 'the Speaking practice page', article: 'the Articles page', pdf: 'the PDF Library page' };
  function countText(type, m) {
    const d = m.data || {}; const nq = (d.questions || []).length;
    if (type === 'writing') return (d.tasks || []).length + ' task(s)';
    if (type === 'speaking') { const ps = d.parts || []; return ps.length + ' part(s) · ' + ps.reduce((n, x) => n + (x.questions || []).length, 0) + ' questions' + (ps.some((x) => x.audioUrl) ? ' · 🔊' : ''); }
    if (type === 'pdf') return (d.fileUrl ? '📄 file' : '<span class="warn-text">no file</span>') + (d.pages ? ' · ' + d.pages + ' pages' : '');
    if (type === 'article') return esc(d.passageLabel || 'Passage 1') + ' · ' + esc(d.topic || 'General') + (d.coverUrl ? ' · 🖼 cover' : ' · <span class="warn-text">no cover</span>');
    if (type === 'reading') return (d.mode === 'full' ? 'FULL · 3 passages · ' : 'PART · 1 passage · ') + nq + ' questions' + (d.no ? ' · test-' + d.no : '') + ((d.images || []).length ? ' · 🖼 ' + d.images.length : '');
    return nq + ' questions' + (type === 'listening' ? (d.audioUrl ? ' · 🔊 audio' : ' · <span class="warn-text">no audio</span>') : '') + ((d.images || []).length ? ' · 🖼 ' + d.images.length : '');
  }
  const READING_VIEWS = { reading: 'part', readingfull: 'full' };
  function renderType(type) { if (type === 'reading') Object.entries(READING_VIEWS).forEach(([v, m]) => renderList('reading', v, m)); else renderList(type, type, null); }
  function renderList(type, view, mode) {
    const mount = $('#content-' + view); if (!mount) return;
    const all = lists[type]; const items = all && mode ? all.filter((m) => ((m.data || {}).mode === 'full') === (mode === 'full')) : all;
    if (!(type === 'reading' && mode === 'full')) return renderCardGrid(type, mount, items);
    const noun = mode === 'full' ? 'full test' : mode === 'part' ? 'part practice card' : NOUN[type];
    const title = mode === 'full' ? 'Reading · Full tests' : mode === 'part' ? 'Reading · Part practice' : TYPES[type];
    const help = mode === 'full' ? 'Three passages, one 60-minute paper (like the Full Reading Test pages). Put each test in a pack with the Pack field; create the packs in “Packs”.' : mode === 'part' ? 'One passage with its own card on the Reading practice page (like pessages/test-19, 20, 21).' : HELP[type];
    const where = mode === 'full' ? 'the Full Reading pages, inside the pack' : mode === 'part' ? 'the Reading practice page, in the same card grid' : WHERE[type];
    const rows = (items || []).map((m) => {
      const hay = esc((m.title + ' ' + (m.pack || '') + ' ' + (m.description || '')).toLowerCase());
      return `<tr data-hay="${hay}" data-state="${m.published === false ? 'draft' : 'live'}${m.premium ? ' locked' : ' free'}"><td><strong>${esc(m.title)}</strong><div class="muted sm">${esc(m.pack || '')}</div></td><td>${countText(type, m)}</td>
        <td><button class="chip ${m.premium ? 'chip-premium' : ''}" data-ct="premium" data-id="${esc(m.id)}" data-type="${type}" type="button" title="Click to change">${m.premium ? '★ Premium' : 'Free'}</button></td>
        <td><button class="chip ${m.published === false ? '' : 'chip-ok'}" data-ct="publish" data-id="${esc(m.id)}" data-type="${type}" type="button" title="Click to change">${m.published === false ? 'Draft' : 'Published'}</button></td>
        <td>${fmt(m.createdAt)}</td>
        <td><div class="btn-row"><button class="btn btn-sm" data-ct="edit" data-id="${esc(m.id)}" data-type="${type}" type="button">Edit</button><button class="btn btn-sm" data-ct="dup" data-id="${esc(m.id)}" data-type="${type}" type="button" title="Make a copy (saved as Draft)">Copy</button><a class="btn btn-sm" href="/test?id=${encodeURIComponent(m.id)}" target="_blank" rel="noopener">Open ↗</a><button class="btn btn-sm btn-danger" data-ct="delete" data-id="${esc(m.id)}" data-type="${type}" data-title="${esc(m.title)}" type="button">Delete</button></div></td></tr>`;
    }).join('');
    const live = (items || []).filter((m) => m.published !== false).length;
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">${title}</div>
      <div class="muted sm">${help} Students see them on ${where}.${items ? ` <b>${items.length}</b> total · <b>${live}</b> published.` : ''}</div></div>
      <button class="btn btn-primary" data-ct="new" data-type="${type}" data-mode="${mode || ''}" type="button">+ New ${noun}</button></div>
      ${items && items.length ? `<div class="toolbar"><input class="field grow" type="search" placeholder="Search by title or pack" data-ct-search="${view}" autocomplete="off">
        <select class="field" data-ct-filter="${view}" aria-label="Filter"><option value="">All</option><option value="live">Published</option><option value="draft">Drafts</option><option value="free">Free</option><option value="locked">Premium</option></select></div>` : ''}
      ${items === null ? '<div class="empty">Loading…</div>' : items.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Title</th><th>Content</th><th>Access</th><th>Status</th><th>Added</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div><div class="muted sm" style="margin-top:8px">Lock / unlock by plan (Standard, Max, Ultra) in <a href="#access">Access</a>.</div>` : `<div class="empty">Nothing here yet. Press “+ New ${noun}” to add the first one.</div>`}</div>`;
  }
  /* Every kind of content is shown as cards (picture, tag, pack) with Edit / Copy / Open / Remove. Newest first. */
  const GRID = {
    reading: { title: 'Part practice cards', noun: 'part practice card', help: 'Each card is one passage on the Reading practice page, in the same grid as the other cards.' },
    listening: { title: 'Listening cards', noun: 'listening card', help: 'Each card is one section on the Listening practice page: audio, questions with answers and explanations, card picture.' },
    writing: { title: 'Writing cards', noun: 'writing card', help: 'Each card is a Task 1 / Task 2 set on the Writing practice page, with its chart picture and model answer.' },
    speaking: { title: 'Speaking cards', noun: 'speaking card', help: 'Each card is a speaking test: Part 1, Part 2 cue card, Part 3.' },
    article: { title: 'Article cards', noun: 'article card', help: 'Each card is an article on the Articles page, with its cover picture.' },
    pdf: { title: 'PDF material cards', noun: 'PDF material', help: 'Each card is a PDF on the PDF Library page. Upload the file and a card picture; students press Download.' }
  };
  function cardInfo(type, m) {
    const d = m.data || {}; const nq = (d.questions || []).length; const exp = (d.questions || []).filter((q) => String(q.explanation || '').trim()).length;
    const expTxt = nq ? (exp === nq ? ' · 💡 all explained' : exp ? ' · ' + exp + '/' + nq + ' explained' : '') : '';
    if (type === 'reading') return { img: d.coverUrl, tag: d.passageLabel || 'Passage 1', sub: nq + ' questions · ' + (d.durationMin ? d.durationMin + ' min' : 'no timer') + expTxt, href: d.no ? '/pessages/test-' + d.no : '/test?id=' + encodeURIComponent(m.id) };
    if (type === 'listening') return { img: d.coverUrl, tag: d.sectionLabel || 'Section 1', sub: nq + ' questions' + (d.audioUrl ? ' · 🔊 audio' : ' · ⚠ no audio') + expTxt, href: '/test?id=' + encodeURIComponent(m.id) };
    if (type === 'writing') { const ts = d.tasks || []; return { img: d.coverUrl || (ts.find((t) => t.imageUrl) || {}).imageUrl, tag: d.tier || 'Tier 1', sub: ts.length + ' task(s)' + (ts.some((t) => t.sample) ? ' · model answer' : ''), href: '/test?id=' + encodeURIComponent(m.id) }; }
    if (type === 'speaking') { const ps = d.parts || []; return { img: (ps.find((t) => t.imageUrl) || {}).imageUrl, tag: ps.length + ' part(s)', sub: ps.reduce((n, x) => n + (x.questions || []).length, 0) + ' questions' + (ps.some((x) => x.audioUrl) ? ' · 🔊' : ''), href: '/test?id=' + encodeURIComponent(m.id) }; }
    if (type === 'article') return { img: d.coverUrl, tag: d.passageLabel || 'Passage 1', sub: (d.topic || 'General') + (d.readMinutes ? ' · ' + d.readMinutes + ' min read' : ''), href: '/test?id=' + encodeURIComponent(m.id) };
    return { img: d.coverUrl, tag: ({ reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking', magazine: 'Magazine', other: 'PDF' })[d.category] || 'PDF', sub: (d.fileUrl ? '📄 PDF uploaded' : '⚠ no PDF file') + (d.pages ? ' · ' + d.pages + ' pages' : ''), href: d.fileUrl || '' };
  }
  function renderCardGrid(type, mount, items) {
    const G = GRID[type]; const live = (items || []).filter((m) => m.published !== false).length; const mode = type === 'reading' ? 'part' : '';
    const cards = (items || []).map((m, n) => {
      const c = cardInfo(type, m); const ids = `data-id="${esc(m.id)}" data-type="${type}"`;
      const hay = esc((m.title + ' ' + (m.pack || '') + ' ' + (m.description || '')).toLowerCase());
      return `<div class="pc-card" data-hay="${hay}" data-state="${m.published === false ? 'draft' : 'live'}${m.premium ? ' locked' : ' free'}">
        <div class="pc-img">${c.img ? `<img src="${esc(c.img)}" alt="" loading="lazy">` : '<div class="pc-noimg">No picture yet<br><span>Edit → upload card picture</span></div>'}<span class="pc-tag">${esc(c.tag)}</span>${n === 0 && items.length > 1 ? '<span class="pc-new">NEW</span>' : ''}${m.published === false ? '<span class="pc-draft">Hidden</span>' : ''}</div>
        <div class="pc-body"><div class="muted sm">${esc(m.pack || (type === 'reading' ? 'Starter Pack' : '—'))} · ${fmt(m.createdAt)}</div><div class="pc-title">${esc(m.title)}</div>
          <div class="muted sm">${esc(c.sub)}</div>
          <div class="btn-row" style="margin:8px 0"><button class="chip ${m.premium ? 'chip-premium' : ''}" data-ct="premium" ${ids} type="button" title="Click to change">${m.premium ? '★ Premium' : 'Free'}</button><button class="chip ${m.published === false ? '' : 'chip-ok'}" data-ct="publish" ${ids} type="button" title="Click to change">${m.published === false ? 'Hidden' : 'Visible'}</button></div>
          <div class="btn-row"><button class="btn btn-sm" data-ct="edit" ${ids} type="button">Edit</button><button class="btn btn-sm" data-ct="dup" ${ids} type="button" title="Make a copy (saved as Hidden)">Copy</button>${c.href ? `<a class="btn btn-sm" href="${esc(c.href)}" target="_blank" rel="noopener">Open ↗</a>` : ''}<button class="btn btn-sm btn-danger" data-ct="delete" ${ids} data-title="${esc(m.title)}" type="button">Remove</button></div></div></div>`;
    }).join('');
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">${G.title}</div>
      <div class="muted sm">${G.help} The newest card is shown first, here and on the website.${items ? ` <b>${items.length}</b> total · <b>${live}</b> visible.` : ''}</div></div>
      <button class="btn btn-primary" data-ct="new" data-type="${type}" data-mode="${mode}" type="button">+ New ${G.noun}</button></div>
      ${items && items.length ? `<div class="toolbar"><input class="field grow" type="search" placeholder="Search by title or pack" data-ct-search="${type}" autocomplete="off">
        <select class="field" data-ct-filter="${type}" aria-label="Filter"><option value="">All</option><option value="live">Visible</option><option value="draft">Hidden</option><option value="free">Free</option><option value="locked">Premium</option></select></div>` : ''}
      ${items === null ? '<div class="empty">Loading…</div>' : items.length ? `<div class="pc-grid">${cards}</div><div class="muted sm" style="margin-top:10px">Lock / unlock by plan (Standard, Max, Ultra) in <a href="#access">Access</a>.</div>` : `<div class="empty">No cards yet. Press “+ New ${G.noun}” to add the first one.</div>`}</div>`;
  }
  function applyFilter(type) {
    const mount = $('#content-' + type); if (!mount) return;
    const q = ($('[data-ct-search="' + type + '"]', mount) || {}).value || ''; const f = ($('[data-ct-filter="' + type + '"]', mount) || {}).value || '';
    mount.querySelectorAll('tbody tr, .pc-card').forEach((tr) => { tr.hidden = !!((q && !tr.dataset.hay.includes(q.toLowerCase())) || (f && !tr.dataset.state.split(' ').includes(f))); });
  }

  /* ───────── uploads (local disk, or straight to Supabase Storage on Vercel) ───────── */
  async function uploadFile(file) {
    const meta = await api('/api/admin/upload-url', { method: 'POST', body: JSON.stringify({ filename: file.name, size: file.size }) });
    if (meta.local) {
      const fd = new FormData(); fd.append('type', /\.(mp3|wav|m4a|ogg|aac)$/i.test(file.name) ? 'audio' : /\.pdf$/i.test(file.name) ? 'pdf' : 'image'); fd.append('file', file, file.name);
      return (await api('/api/admin/uploads', { method: 'POST', body: fd })).url;
    }
    const fd = new FormData(); fd.append('cacheControl', '3600'); fd.append('', file);
    const r = await fetch(meta.uploadUrl, { method: 'PUT', body: fd, headers: { 'x-upsert': 'false' } });
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error('Upload failed: ' + (j.message || j.error || r.status)); }
    return meta.publicUrl;
  }
  async function pickAndUpload(accept, status) {
    return new Promise((resolve) => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept;
      inp.onchange = async () => {
        const f = inp.files[0]; if (!f) return resolve(null);
        if (f.size > 100 * 1024 * 1024) { toast('File is larger than 100 MB.', true); return resolve(null); }
        uploading++; if (status) status.textContent = 'Uploading ' + f.name + ' …'; syncSave();
        try { const url = await uploadFile(f); if (status) status.textContent = ''; toast('Uploaded ' + f.name); resolve(url); }
        catch (e) { if (status) status.textContent = ''; fail(e); resolve(null); }
        finally { uploading--; syncSave(); }
      };
      inp.click();
    });
  }
  function syncSave() { const b = $('#cb-save'); if (b) { b.disabled = uploading > 0; b.textContent = uploading ? 'Uploading…' : (editingId ? 'Save changes' : 'Create'); } }

  /* ───────── builder ───────── */
  const blankQ = (type, passage) => ({ type: type || 'short', passage: passage || 1, group: '', prompt: '', options: [], answer: '', explanation: '' });
  const blankPassages = () => [{ title: '', passage: '' }, { title: '', passage: '' }, { title: '', passage: '' }];
  function blank(type, mode) {
    const data = { durationMin: type === 'writing' ? 60 : type === 'listening' ? 30 : type === 'reading' ? (mode === 'full' ? 60 : 20) : 60, instructions: '', images: [] };
    if (type === 'reading') Object.assign(data, { mode: mode === 'full' ? 'full' : 'part', coverUrl: '', passageLabel: 'Passage 1', cardTypes: [], passage: '', passages: blankPassages(), questions: [blankQ()] });
    if (type === 'listening') Object.assign(data, { audioUrl: '', transcript: '', coverUrl: '', sectionLabel: 'Section 1', cardTypes: [], questions: [blankQ()] });
    if (type === 'pdf') { Object.assign(data, { fileUrl: '', coverUrl: '', category: 'reading', badge: 'PDF', corner: '', pages: 0, tags: [] }); delete data.instructions; delete data.images; }
    if (type === 'speaking') Object.assign(data, { parts: [
      { title: 'Part 1 · Introduction and interview', prompt: '', questions: [], imageUrl: '', audioUrl: '', prepSeconds: 0, speakSeconds: 0, sample: '' },
      { title: 'Part 2 · Long turn (cue card)', prompt: '', questions: [], imageUrl: '', audioUrl: '', prepSeconds: 60, speakSeconds: 120, sample: '' },
      { title: 'Part 3 · Discussion', prompt: '', questions: [], imageUrl: '', audioUrl: '', prepSeconds: 0, speakSeconds: 0, sample: '' }] });
    if (type === 'article') Object.assign(data, { topic: 'General', passageLabel: 'Passage 1', source: '', readMinutes: 5, coverUrl: '', body: '' });
    if (type === 'writing') Object.assign(data, { coverUrl: '', tier: 'Tier 1', cardTypes: [], tasks: [{ title: 'Task 1', prompt: '', imageUrl: '', minWords: 150, minutes: 20, sample: '' }, { title: 'Task 2', prompt: '', imageUrl: '', minWords: 250, minutes: 40, sample: '' }] });
    return { type, title: '', pack: '', description: '', premium: false, published: true, data };
  }
  let PACKS = {};
  const packNames = (type) => PACKS[type] || [];
  async function loadPacks() {   // pack names that already exist on the Full Tests pages, for the Pack field
    try { const d = await api('/api/admin/access'); PACKS = {}; (d.skills || []).forEach((sk) => { PACKS[sk.skill] = (sk.packs || []).filter((p) => !p.practice).map((p) => p.title); }); } catch (e) { /* the field still accepts any name */ }
  }
  function openBuilder(type, item, mode) {
    loadPacks().then(() => { const dl = document.getElementById('ix-pack-list'); if (dl) dl.innerHTML = packNames(draft.type).map((n) => `<option value="${esc(n)}"></option>`).join(''); });
    editingId = item ? item.id : null;
    draft = item ? JSON.parse(JSON.stringify(item)) : blank(type, mode);
    draft.data = draft.data || {}; draft.data.images = draft.data.images || [];
    if (draft.type === 'reading') { draft.data.mode = draft.data.mode === 'full' ? 'full' : 'part'; const ps = Array.isArray(draft.data.passages) ? draft.data.passages : []; draft.data.passages = [0, 1, 2].map((k) => ps[k] || { title: '', passage: '' }); }
    if (draft.type === 'reading' || draft.type === 'listening') draft.data.questions = draft.data.questions && draft.data.questions.length ? draft.data.questions : [blankQ()];
    if (draft.type === 'speaking' && !(draft.data.parts || []).length) draft.data.parts = blank('speaking').data.parts;
    if (draft.type === 'writing' && !(draft.data.tasks || []).length) draft.data.tasks = blank('writing').data.tasks;
    $('#builder-title').textContent = (editingId ? 'Edit ' : 'New ') + (draft.type === 'reading' ? (draft.data.mode === 'full' ? 'full reading test' : 'part practice card') : NOUN[draft.type]);
    renderBuilder(); $('#builder').classList.add('open'); $('#builder-body').scrollTop = 0;
  }
  function closeBuilder() { if (uploading && !confirm('A file is still uploading. Close anyway?')) return; $('#builder').classList.remove('open'); draft = null; editingId = null; }

  const field = (label, path, val, extra = '') => `<label class="lbl">${label}<input class="field" data-p="${path}" value="${esc(val)}" ${extra}></label>`;
  function imagesBlock(label, help) {
    const imgs = draft.data.images || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>${label}</strong><div class="muted sm">${help}</div></div><button class="btn btn-sm" data-cb="img-add" type="button">⬆ Upload picture</button></div><div class="muted sm" id="img-status"></div>
      <div class="cb-images">${imgs.map((im, i) => `<div class="cb-img"><img src="${esc(im.url)}" alt=""><input class="field" placeholder="Caption (optional)" data-p="data.images.${i}.caption" value="${esc(im.caption)}">${draft.type === 'reading' && draft.data.mode === 'full' ? passSelect(`data.images.${i}.passage`, im.passage) : ''}<button class="btn btn-sm btn-danger" data-cb="img-del" data-i="${i}" type="button">Remove</button></div>`).join('')}</div></div>`;
  }
  function readingFormatBlock() {
    const full = draft.data.mode === 'full';
    if (full) return `<div class="cb-block"><strong>Full reading test · 3 passages · 60 minutes</strong><div class="muted sm">Shown on the Full Reading page inside the pack you choose below (create packs in “Packs”). Opens like the Full Reading Test pages, at <code>/full-tests/reading/test-${esc(draft.data.no || 'N')}</code>.</div></div>`;
    const d = draft.data;
    return `<div class="cb-block"><div class="cb-head"><div><strong>Card on the Reading practice page</strong><div class="muted sm">The card looks exactly like the other cards: picture, passage tag, question-type chips and the pack line. The test opens like pessages/test-19, 20, 21, at <code>/pessages/test-${esc(d.no || 'N')}</code>.</div></div>
      <button class="btn btn-sm" data-cb="card-img" type="button">⬆ ${d.coverUrl ? 'Replace picture' : 'Upload picture'}</button></div><div class="muted sm" id="card-img-status"></div>
      ${d.coverUrl ? `<div class="cb-images"><div class="cb-img"><img src="${esc(d.coverUrl)}" alt=""><button class="btn btn-sm btn-danger" data-cb="card-img-del" type="button">Remove</button></div></div>` : ''}
      <div class="cb-grid"><label class="lbl">Passage tag on the card<select class="field" data-p="data.passageLabel">${['Passage 1', 'Passage 2', 'Passage 3'].map((x) => `<option ${d.passageLabel === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label class="lbl">Question types on the card (comma separated; empty = taken from the questions)<input class="field" data-p="data.cardTypes" data-csv="1" value="${esc((d.cardTypes || []).join(', '))}" placeholder="True False Not Given, Sentence Completion"></label></div></div>`;
  }
  /* the card picture + chips of a Listening / Writing / PDF card (the Reading card block is readingFormatBlock) */
  function cardBlock(t, d) {
    if (t !== 'listening' && t !== 'writing' && t !== 'pdf') return '';
    const pic = `<div class="cb-head"><div><strong>Card on the ${t === 'pdf' ? 'PDF Library' : t === 'listening' ? 'Listening practice' : 'Writing practice'} page</strong><div class="muted sm">${t === 'writing' ? 'Card picture (leave empty to use the picture of Task 1). ' : 'This picture is the card image. '}png, jpg, webp, avif.</div></div>
      <button class="btn btn-sm btn-primary" data-cb="card-img" type="button">⬆ ${d.coverUrl ? 'Replace picture' : 'Upload picture'}</button></div><div class="muted sm" id="card-img-status"></div>
      ${d.coverUrl ? `<div class="cb-images"><div class="cb-img"><img src="${esc(d.coverUrl)}" alt=""><button class="btn btn-sm btn-danger" data-cb="card-img-del" type="button">Remove</button></div></div>` : ''}`;
    const sel = (path, list, cur) => `<select class="field" data-p="${path}">${list.map(([v, l]) => `<option value="${esc(v)}" ${cur === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
    let extra = '';
    if (t === 'listening') extra = `<div class="cb-grid"><label class="lbl">Section tag on the card${sel('data.sectionLabel', ['Section 1', 'Section 2', 'Section 3', 'Section 4'].map((x) => [x, x]), d.sectionLabel || 'Section 1')}</label>
      <label class="lbl">Question types on the card (comma separated; empty = taken from the questions)<input class="field" data-p="data.cardTypes" data-csv="1" value="${esc((d.cardTypes || []).join(', '))}" placeholder="Multiple choice, Table completion"></label></div>`;
    if (t === 'writing') extra = `<div class="cb-grid"><label class="lbl">Tier tag on the card${sel('data.tier', ['Tier 1', 'Tier 2', 'Tier 3'].map((x) => [x, x]), d.tier || 'Tier 1')}</label>
      <label class="lbl">Type chip on the card (e.g. Bar Chart, Agree Disagree)<input class="field" data-p="data.cardTypes" data-csv="1" value="${esc((d.cardTypes || []).join(', '))}" placeholder="Bar Chart"></label></div>`;
    if (t === 'pdf') extra = `<div class="cb-grid"><label class="lbl">Category${sel('data.category', [['reading', 'Reading'], ['listening', 'Listening'], ['writing', 'Writing'], ['speaking', 'Speaking'], ['magazine', 'Magazine'], ['other', 'Other']], d.category || 'reading')}</label>
        <label class="lbl">Number of pages (optional)<input class="field" type="number" min="0" data-p="data.pages" value="${esc(d.pages || 0)}"></label></div>
      <div class="cb-grid"><label class="lbl">Left tag on the card<input class="field" data-p="data.badge" maxlength="30" value="${esc(d.badge)}" placeholder="PDF"></label><label class="lbl">Right tag on the card<input class="field" data-p="data.corner" maxlength="30" value="${esc(d.corner)}" placeholder="Academic & GT"></label></div>
      <label class="lbl">Chips under the title (comma separated)<input class="field" data-p="data.tags" data-csv="1" value="${esc((d.tags || []).join(', '))}" placeholder="Matching Headings, True/False/NG"></label>`;
    const file = t === 'pdf' ? `<div class="cb-block"><div class="cb-head"><div><strong>PDF file *</strong><div class="muted sm">The file students download (up to 100 MB).</div></div><div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="pdf-file" type="button">⬆ ${d.fileUrl ? 'Replace PDF' : 'Upload PDF'}</button>${d.fileUrl ? '<button class="btn btn-sm btn-danger" data-cb="pdf-file-del" type="button">Remove file</button>' : ''}</div></div><div class="muted sm" id="pdf-status"></div>${d.fileUrl ? `<div class="muted sm">📄 <a href="${esc(d.fileUrl)}" target="_blank" rel="noopener">${esc(decodeURIComponent(String(d.fileUrl).split('/').pop()))}</a></div>` : ''}</div>` : '';
    return file + `<div class="cb-block">${pic}${extra}</div>`;
  }
  function passagesBlock() {
    const ps = draft.data.passages || [];
    return [0, 1, 2].map((k) => `<div class="cb-block"><div class="cb-head"><div><strong>Passage ${k + 1}${k === 0 ? ' *' : ''}</strong><div class="muted sm">${k === 0 ? 'Required.' : 'Leave empty if the test has fewer passages.'} Empty line between paragraphs. Start a line with A. / B. / C. to label paragraphs.</div></div></div>
      <input class="field" placeholder="Passage ${k + 1} title (optional)" data-p="data.passages.${k}.title" value="${esc((ps[k] || {}).title)}" maxlength="200">
      <textarea class="field cb-passage" rows="12" data-p="data.passages.${k}.passage" placeholder="Paste passage ${k + 1} here">${esc((ps[k] || {}).passage)}</textarea></div>`).join('');
  }
  const passSelect = (path, cur) => `<select class="field" style="width:auto" data-p="${path}" data-num="1" title="Which passage?">${[1, 2, 3].map((n) => `<option value="${n}" ${Number(cur || 1) === n ? 'selected' : ''}>Passage ${n}</option>`).join('')}</select>`;
  function questionsBlock() {
    const qs = draft.data.questions || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>Questions & answers (${qs.length})</strong><div class="muted sm">For several accepted answers separate them with <code>|</code> (e.g. <code>colour|color</code>). True/False/Not Given: write TRUE, FALSE or NOT GIVEN. Multiple choice: write the letter (A, B, C…) of the right option.</div></div>
      <div class="btn-row"><button class="btn btn-sm" data-cb="q-bulk" type="button">Paste many</button><button class="btn btn-sm btn-primary" data-cb="q-add" type="button">+ Question</button></div></div>
      <div id="bulk-box" class="cb-bulk" hidden><div class="muted sm"><b>Questions + answers + explanations in one go.</b> Two ways to paste:<br>
        <b>1)</b> one question per line, parts separated by <code>=&gt;</code>:<br><code>The bees live in a =&gt; hive =&gt; Paragraph B says bees live in a hive.</code><br>
        <b>2)</b> blocks with labels (the explanation line is optional):<br><code>1. Glass was first made in Egypt.<br>Answer: TRUE<br>Explanation: Paragraph A, line 2 says so.</code><br>
        For multiple choice put the options (<code>A. …</code>, <code>B. …</code>) under the question. A line like <code>Questions 1–5: Complete the notes</code> becomes the heading of the next question.</div>
      <textarea class="field" id="bulk-text" rows="12" placeholder="1. Glass was first made in Egypt.&#10;Answer: TRUE&#10;Explanation: Paragraph A, line 2 says so.&#10;&#10;2. The bees live in a ____&#10;Answer: hive&#10;Explanation: Paragraph B.&#10;&#10;or:  The bees live in a => hive => Paragraph B."></textarea>
      <div class="btn-row"><select class="field" id="bulk-type" style="width:auto"><option value="auto">Auto-detect the question type</option>${Object.entries(Q_LABEL).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>${draft.type === 'reading' && draft.data.mode === 'full' ? `<select class="field" id="bulk-pass" style="width:auto"><option value="">Passage: as the last question</option><option value="1">Passage 1</option><option value="2">Passage 2</option><option value="3">Passage 3</option></select>` : ''}<button class="btn btn-sm btn-primary" data-cb="q-bulk-do" type="button">Add them</button></div></div>
      ${qs.map((q, i) => `<div class="cb-q"><div class="cb-qn">${i + 1}</div><div class="cb-qbody">
        <div class="cb-row"><select class="field" data-p="data.questions.${i}.type" data-rerender="1">${Object.entries(Q_LABEL).map(([k, v]) => `<option value="${k}" ${q.type === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
        ${draft.type === 'reading' && draft.data.mode === 'full' ? passSelect(`data.questions.${i}.passage`, q.passage) : ''}
        <input class="field" placeholder="Heading before this question (optional), e.g. Questions 1–5: Complete the notes" data-p="data.questions.${i}.group" value="${esc(q.group)}"></div>
        <textarea class="field" rows="2" placeholder="Question text" data-p="data.questions.${i}.prompt">${esc(q.prompt)}</textarea>
        ${OPT_TYPES.includes(q.type) ? `<textarea class="field" rows="5" placeholder="${q.type === 'mcq' || q.type === 'mcq-multi' ? 'Options, one per line (A, B, C… in this order)' : 'Options, one per line, each starting with its letter or number, e.g.  A. Paragraph A   or   i. The cost of change'}" data-p="data.questions.${i}.options" data-lines="1">${esc((q.options || []).join('\n'))}</textarea>` : ''}
        <div class="cb-row"><input class="field" placeholder="${q.type === 'tfng' ? 'TRUE / FALSE / NOT GIVEN' : q.type === 'ynng' ? 'YES / NO / NOT GIVEN' : q.type === 'mcq' ? 'Correct letter, e.g. B' : q.type === 'mcq-multi' ? 'Correct letters, e.g. A,C' : q.type === 'matching' || q.type === 'map' ? 'Correct letter or number, e.g. D or iv' : 'Correct answer (use | for alternatives)'}" data-p="data.questions.${i}.answer" value="${esc(q.answer)}">
        <textarea class="field" rows="2" placeholder="Explanation shown after submitting (optional)" data-p="data.questions.${i}.explanation">${esc(q.explanation)}</textarea></div></div>
        <button class="btn btn-sm btn-danger" data-cb="q-del" data-i="${i}" type="button" title="Delete question">✕</button></div>`).join('')}</div>`;
  }
  /* "Paste many": turns pasted text into questions with answers and explanations */
  function parseBulk(text, forced, passage) {
    const src = String(text || '').replace(/\r/g, '').trim(); if (!src) return [];
    const ANS = /^(?:answer|ans|javob|correct(?: answer)?)\s*[:=\-–]\s*(.*)$/i, EXP = /^(?:explanation|explain|exp|izoh|tushuntirish)\s*[:=\-–]\s*(.*)$/i;
    const OPT = /^\(?([A-Ha-h]|[ivxIVX]{1,4})[.)]\s+(.+)$/, NUMQ = /^(?:Q\s*)?(\d{1,3})\s*[.)\-:]\s*(.+)$/i, HEAD = /^questions?\s+\d+\s*[-–—]\s*\d+/i;
    const out = []; let group = '';
    if (!src.split('\n').some((l) => ANS.test(l.trim()))) {            // one line = question => answer => explanation
      src.split('\n').map((x) => x.trim()).filter(Boolean).forEach((l) => {
        if (HEAD.test(l) && !l.includes('=>')) { group = l; return; }
        const [p, a, ...e] = l.split('=>'); if (!a || !a.trim()) return;
        out.push({ prompt: p.replace(/^\d{1,3}\s*[.)\-:]\s*/, '').trim(), options: [], answer: a.trim(), explanation: e.join('=>').trim(), group });
        group = '';
      });
    } else {                                                            // labelled blocks
      let cur = null, lastField = '';
      const push = () => { if (cur && cur.prompt && cur.answer) out.push(cur); cur = null; };
      src.split('\n').forEach((raw) => {
        const l = raw.trim(); if (!l) return;
        let m;
        if (HEAD.test(l) && (!cur || cur.answer)) { push(); group = l; return; }
        if ((m = ANS.exec(l))) { if (cur) { cur.answer = m[1].trim(); lastField = 'answer'; } return; }
        if ((m = EXP.exec(l))) { if (cur) { cur.explanation = m[1].trim(); lastField = 'explanation'; } return; }
        if (cur && !cur.answer && (m = OPT.exec(l))) { cur.options.push(m[1] + '. ' + m[2]); return; }
        const numbered = NUMQ.exec(l);
        if (cur && cur.answer && lastField === 'explanation' && !numbered) { cur.explanation += ' ' + l; return; }
        if (cur && !cur.answer) { cur.prompt += ' ' + (numbered ? numbered[2] : l); return; }
        push(); cur = { prompt: (numbered ? numbered[2] : l).trim(), options: [], answer: '', explanation: '', group }; group = ''; lastField = '';
      });
      push();
    }
    return out.map((q) => {
      let type = forced; const a = q.answer.trim(), A = a.toUpperCase();
      if (type === 'auto' || !type) {
        if (['TRUE', 'FALSE', 'T', 'F'].includes(A) || (A === 'NOT GIVEN' && !/\byes|no\b/i.test(q.prompt))) type = 'tfng';
        else if (['YES', 'NO', 'Y', 'N'].includes(A)) type = 'ynng';
        else if (q.options.length >= 2 && /^[A-H](\s*[,&/ ]\s*[A-H])+$/.test(A)) type = 'mcq-multi';
        else if (q.options.length >= 2 && /^[A-H]$/.test(A)) type = q.options.every((o) => /^(i|ii|iii|iv|v|vi|vii|viii|ix|x)\./i.test(o)) ? 'matching' : 'mcq';
        else if (q.options.length >= 2) type = 'matching';
        else type = 'short';
      }
      let ans = a;
      if (type === 'tfng') ans = ({ T: 'TRUE', F: 'FALSE', NG: 'NOT GIVEN' })[A] || A;
      if (type === 'ynng') ans = ({ Y: 'YES', N: 'NO', NG: 'NOT GIVEN' })[A] || A;
      return { ...blankQ(type, passage), group: q.group || '', prompt: q.prompt, options: OPT_TYPES.includes(type) ? q.options : [], answer: ans, explanation: q.explanation };
    });
  }
  function tasksBlock() {
    const ts = draft.data.tasks || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>Writing tasks</strong><div class="muted sm">Usually Task 1 (chart / letter) and Task 2 (essay). A picture is optional.</div></div>${ts.length < 4 ? '<button class="btn btn-sm btn-primary" data-cb="t-add" type="button">+ Task</button>' : ''}</div>
      ${ts.map((t, i) => `<div class="cb-task"><div class="cb-row">${field('Title', `data.tasks.${i}.title`, t.title)}${field('Minimum words', `data.tasks.${i}.minWords`, t.minWords, 'type="number" min="0"')}${field('Suggested minutes', `data.tasks.${i}.minutes`, t.minutes, 'type="number" min="0"')}</div>
        <label class="lbl">Question / instructions<textarea class="field" rows="5" data-p="data.tasks.${i}.prompt">${esc(t.prompt)}</textarea></label>
        <div class="cb-head"><div class="muted sm" id="timg-status-${i}"></div><div class="btn-row"><button class="btn btn-sm" data-cb="t-img" data-i="${i}" type="button">⬆ ${t.imageUrl ? 'Replace' : 'Upload'} chart / picture</button>${t.imageUrl ? `<button class="btn btn-sm btn-danger" data-cb="t-img-del" data-i="${i}" type="button">Remove picture</button>` : ''}${ts.length > 1 ? `<button class="btn btn-sm btn-danger" data-cb="t-del" data-i="${i}" type="button">Delete task</button>` : ''}</div></div>
        ${t.imageUrl ? `<img class="cb-taskimg" src="${esc(t.imageUrl)}" alt="">` : ''}
        <label class="lbl">Model answer (optional, students can reveal it after writing)<textarea class="field" rows="4" data-p="data.tasks.${i}.sample">${esc(t.sample)}</textarea></label></div>`).join('')}</div>`;
  }
  function partsBlock() {
    const ps = draft.data.parts || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>Speaking parts</strong><div class="muted sm">Part 1: short questions (one per line). Part 2: write the cue card in the big box. Part 3: discussion questions. Pictures, timers and a model answer are optional.</div></div>${ps.length < 3 ? '<button class="btn btn-sm" data-cb="p-add" type="button">+ Part</button>' : ''}</div>
      ${ps.map((t, i) => `<div class="cb-task"><div class="cb-row">${field('Title', `data.parts.${i}.title`, t.title)}${field('Preparation (seconds)', `data.parts.${i}.prepSeconds`, t.prepSeconds, 'type="number" min="0"')}${field('Speaking time (seconds)', `data.parts.${i}.speakSeconds`, t.speakSeconds, 'type="number" min="0"')}<button class="btn btn-sm btn-danger" data-cb="p-del" data-i="${i}" type="button" title="Remove this part">✕</button></div>
        <label class="lbl">Cue card / intro text (optional)<textarea class="field" rows="5" data-p="data.parts.${i}.prompt" placeholder="Describe a place you like to visit.&#10;You should say:&#10;- where it is&#10;- what you do there">${esc(t.prompt)}</textarea></label>
        <label class="lbl">Questions, one per line<textarea class="field" rows="6" data-lines="1" data-p="data.parts.${i}.questions" placeholder="What do you do in your free time?">${esc((t.questions || []).join('\n'))}</textarea></label>
        <div class="cb-head"><div class="muted sm" id="pimg-status-${i}"></div><div class="btn-row"><button class="btn btn-sm" data-cb="p-img" data-i="${i}" type="button">⬆ ${t.imageUrl ? 'Replace' : 'Upload'} picture</button>${t.imageUrl ? `<button class="btn btn-sm btn-danger" data-cb="p-img-del" data-i="${i}" type="button">Remove picture</button>` : ''}<button class="btn btn-sm" data-cb="p-audio" data-i="${i}" type="button">⬆ ${t.audioUrl ? 'Replace' : 'Upload'} model-answer audio</button>${t.audioUrl ? `<button class="btn btn-sm btn-danger" data-cb="p-audio-del" data-i="${i}" type="button">Remove audio</button>` : ''}</div></div>
        ${t.imageUrl ? `<img class="cb-taskimg" src="${esc(t.imageUrl)}" alt="">` : ''}${t.audioUrl ? `<audio controls preload="none" src="${esc(t.audioUrl)}" style="width:100%;margin-top:8px"></audio>` : ''}
        <label class="lbl">Model answer (optional, the student can reveal it)<textarea class="field" rows="4" data-p="data.parts.${i}.sample">${esc(t.sample)}</textarea></label></div>`).join('')}</div>`;
  }
  function articleBlock() {
    const d = draft.data;
    return `<div class="cb-block"><div class="cb-head"><div><strong>Cover picture</strong><div class="muted sm">Shown on the article card and at the top of the article (png, jpg, webp, avif).</div></div><div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="cover" type="button">⬆ ${d.coverUrl ? 'Replace cover' : 'Upload cover'}</button>${d.coverUrl ? '<button class="btn btn-sm btn-danger" data-cb="cover-del" type="button">Remove</button>' : ''}</div></div><div class="muted sm" id="cover-status"></div>${d.coverUrl ? `<img class="cb-taskimg" src="${esc(d.coverUrl)}" alt="">` : ''}</div>
      <div class="cb-grid"><label class="lbl">Topic<select class="field" data-p="data.topic">${TOPICS.map((x) => `<option ${d.topic === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        <label class="lbl">Passage level<select class="field" data-p="data.passageLabel">${['Passage 1', 'Passage 2', 'Passage 3'].map((x) => `<option ${d.passageLabel === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label></div>
      <div class="cb-grid">${field('Source (optional)', 'data.source', d.source, 'placeholder="e.g. National Geographic" maxlength="120"')}${field('Reading time, minutes', 'data.readMinutes', d.readMinutes, 'type="number" min="0"')}</div>
      <div class="cb-block"><div class="cb-head"><div><strong>Article text *</strong><div class="muted sm">Empty line = new paragraph. <code>## Heading</code> for a heading, <code>- item</code> for a list. Use “Insert picture” to put a picture inside the text.</div></div><button class="btn btn-sm" data-cb="body-img" type="button">⬆ Insert picture</button></div><div class="muted sm" id="body-status"></div>
        <textarea class="field cb-passage" id="body-text" rows="16" data-p="data.body">${esc(d.body)}</textarea></div>`;
  }
  function renderBuilder() {
    const t = draft.type, d = draft.data;
    $('#builder-body').innerHTML = `
      ${t === 'reading' && d.mode !== 'full' ? readingFormatBlock() : cardBlock(t, d)}
      <div class="cb-grid">${field('Title *', 'title', draft.title, 'placeholder="e.g. Cambridge 18 · Test 2 · Passage 1" maxlength="200"')}${field(t === 'reading' && d.mode !== 'full' ? 'Pack shown on the card (e.g. Starter Pack)' : 'Pack — pick one, or type a new name to create a new pack card', 'pack', draft.pack, 'list="ix-pack-list" placeholder="e.g. Pack 5" autocomplete="off"')}<datalist id="ix-pack-list">${packNames(draft.type).map((n) => `<option value="${esc(n)}"></option>`).join('')}</datalist></div>
      <label class="lbl">Short description (optional)<input class="field" data-p="description" value="${esc(draft.description)}" maxlength="500"></label>
      <div class="cb-grid">${t === 'article' || t === 'speaking' || t === 'pdf' ? '<div></div>' : `<label class="lbl">Time limit, minutes (0 = none)<input class="field" type="number" min="0" data-p="data.durationMin" value="${esc(d.durationMin)}"></label>`}
        <div class="cb-checks"><label><input type="checkbox" data-p="premium" ${draft.premium ? 'checked' : ''}> Premium only</label><label><input type="checkbox" data-p="published" ${draft.published !== false ? 'checked' : ''}> Published (visible to students)</label></div></div>
      ${t === 'reading' || t === 'listening' ? `<label class="lbl">Instructions shown above the questions (optional)<textarea class="field" rows="2" data-p="data.instructions">${esc(d.instructions)}</textarea></label>` : ''}
      ${t === 'reading' ? (d.mode === 'full' ? readingFormatBlock() : '') + (d.mode === 'full' ? passagesBlock() : `<label class="lbl">Passage text *<textarea class="field cb-passage" rows="14" data-p="data.passage" placeholder="Paste the passage. Leave an empty line between paragraphs. Tip: start a line with A. / B. / C. to label paragraphs.">${esc(d.passage)}</textarea></label>`) : ''}
      ${t === 'listening' ? `<div class="cb-block"><div class="cb-head"><div><strong>Audio file *</strong><div class="muted sm">mp3, wav, m4a, ogg (up to 100 MB).</div></div><button class="btn btn-sm btn-primary" data-cb="audio" type="button">⬆ ${d.audioUrl ? 'Replace audio' : 'Upload audio'}</button></div><div class="muted sm" id="audio-status"></div>${d.audioUrl ? `<audio controls preload="none" src="${esc(d.audioUrl)}" style="width:100%;margin-top:8px"></audio>` : ''}</div>` : ''}
      ${t === 'article' ? articleBlock() : ''}${t === 'speaking' ? partsBlock() : ''}
      ${t === 'writing' ? tasksBlock() : t === 'speaking' || t === 'pdf' ? '' : imagesBlock(t === 'listening' ? 'Pictures: maps, plans, diagrams' : t === 'article' ? 'More pictures (shown at the end of the article)' : 'Pictures for the passage (optional)', t === 'article' ? 'Optional extra pictures with captions.' : 'Shown to the student next to the questions. Add as many as needed.')}
      ${t === 'reading' || t === 'listening' ? questionsBlock() : ''}
      ${t === 'listening' ? `<label class="lbl">Transcript (optional, shown only after the student submits)<textarea class="field" rows="5" data-p="data.transcript">${esc(d.transcript)}</textarea></label>` : ''}`;
    syncSave();
  }

  function setPath(obj, path, val) {
    const keys = path.split('.'); let o = obj;
    for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
    o[keys[keys.length - 1]] = val;
  }
  function onInput(e) {
    const el = e.target;
    if (el.dataset && (el.dataset.ctSearch || el.dataset.ctFilter)) return applyFilter(el.dataset.ctSearch || el.dataset.ctFilter); const p = el.dataset && el.dataset.p; if (!p || !draft) return;
    let v = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.lines) v = v.split('\n').map((x) => x.trim()).filter(Boolean);
    if (el.type === 'number') v = Number(v) || 0;
    if (el.dataset.num) v = Number(v) || 1;
    if (el.dataset.csv) v = v.split(',').map((x) => x.trim()).filter(Boolean);
    if (p === 'data.mode' && draft.type === 'reading') {   // switching format: sensible clock + three passage slots
      const dd = draft.data; if (!Array.isArray(dd.passages) || dd.passages.length < 3) dd.passages = blankPassages();
      if (v === 'full' && (!dd.durationMin || dd.durationMin === 20)) dd.durationMin = 60; if (v === 'part' && dd.durationMin === 60) dd.durationMin = 20;
    }
    setPath(draft, p, v);
    if (el.dataset.rerender && e.type === 'change') renderBuilder();
  }

  async function save() {
    if (uploading) return;
    const d = draft.data;
    if (!draft.title.trim()) return toast('Please enter a title.', true);
    if (draft.type === 'reading' && d.mode === 'full') {
      d.passages = (d.passages || blankPassages()).map((x) => ({ title: String((x && x.title) || '').trim(), passage: String((x && x.passage) || '') }));
      if (!d.passages[0].passage.trim()) return toast('Please paste the text of Passage 1.', true);
      const used = (d.questions || []).filter((q) => String(q.prompt || '').trim()).map((q) => Number(q.passage) || 1);
      const bad = [1, 2, 3].find((n) => used.includes(n) && !d.passages[n - 1].passage.trim());
      if (bad) return toast('Passage ' + bad + ' has questions but no text.', true);
    } else if (draft.type === 'reading' && !String(d.passage || '').trim()) return toast('Please paste the passage text.', true);
    if (draft.type === 'listening' && !d.audioUrl) return toast('Please upload the audio file.', true);
    if (draft.type === 'article') {
      if (!String(d.body || '').trim()) return toast('Please paste the article text.', true);
    } else if (draft.type === 'pdf') {
      if (!d.fileUrl) return toast('Please upload the PDF file.', true);
    } else if (draft.type === 'speaking') {
      d.parts = (d.parts || []).filter((t) => String(t.prompt || '').trim() || (t.questions || []).length || t.imageUrl);
      if (!d.parts.length) return toast('Add a cue card or at least one question.', true);
    } else if (draft.type !== 'writing') {
      d.questions = (d.questions || []).filter((q) => String(q.prompt || '').trim());
      if (!d.questions.length) return toast('Add at least one question.', true);
      const noAns = d.questions.findIndex((q) => !String(q.answer || '').trim());
      if (noAns >= 0) return toast('Question ' + (noAns + 1) + ' has no correct answer.', true);
    } else {
      d.tasks = (d.tasks || []).filter((t) => String(t.prompt || '').trim() || t.imageUrl);
      if (!d.tasks.length) return toast('Write at least one task.', true);
    }
    const btn = $('#cb-save'); btn.disabled = true;
    try {
      const body = JSON.stringify({ type: draft.type, title: draft.title, pack: draft.pack, description: draft.description, premium: !!draft.premium, published: draft.published !== false, data: d });
      const type = draft.type;
      if (editingId) await api('/api/admin/materials/' + encodeURIComponent(editingId), { method: 'PATCH', body }); else await api('/api/admin/materials', { method: 'POST', body });
      toast(editingId ? 'Saved' : 'Created — students can open it now');
      $('#builder').classList.remove('open'); draft = null; editingId = null;
      await loadType(type);
    } catch (e) { fail(e); btn.disabled = false; }
  }

  /* ───────── events ───────── */
  async function onClick(e) {
    const t = e.target.closest('[data-ct],[data-cb]'); if (!t) return;
    try {
      if (t.dataset.ct) {
        const { ct, type, id } = t.dataset;
        if (ct === 'new') return openBuilder(type, null, t.dataset.mode);
        const item = (lists[type] || []).find((x) => x.id === id);
        if (ct === 'edit') { const full = await api('/api/admin/materials/' + encodeURIComponent(id)); return openBuilder(type, full.item); }
        if (ct === 'premium' && item) { await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ premium: !item.premium }) }); toast(item.premium ? 'Now free' : 'Now Premium only'); return loadType(type); }
        if (ct === 'publish' && item) { const on = item.published === false; await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ published: on }) }); toast(on ? 'Published' : 'Hidden (draft)'); return loadType(type); }
        if (ct === 'dup') {
          const full = (await api('/api/admin/materials/' + encodeURIComponent(id))).item;
          await api('/api/admin/materials', { method: 'POST', body: JSON.stringify({ type: full.type, title: full.title + ' (copy)', pack: full.pack, description: full.description, premium: !!full.premium, published: false, data: full.data }) });
          toast('Copied — the copy is a Draft'); return loadType(type);
        }
        if (ct === 'delete') { if (!confirm('Delete “' + t.dataset.title + '”? Students will no longer see it.')) return; await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'DELETE' }); toast('Deleted'); return loadType(type); }
        return;
      }
      if (!draft) return;
      const a = t.dataset.cb, i = Number(t.dataset.i);
      if (a === 'img-add') { const url = await pickAndUpload('image/*', $('#img-status')); if (url) { draft.data.images.push({ url, caption: '' }); renderBuilder(); } }
      else if (a === 'img-del') { draft.data.images.splice(i, 1); renderBuilder(); }
      else if (a === 'audio') { const url = await pickAndUpload('audio/*,.mp3,.wav,.m4a,.ogg', $('#audio-status')); if (url) { draft.data.audioUrl = url; renderBuilder(); } }
      else if (a === 'q-add') { const last = draft.data.questions[draft.data.questions.length - 1]; const nq = blankQ(last && last.type, last && last.passage); if (last && OPT_TYPES.includes(last.type)) nq.options = (last.options || []).slice(); draft.data.questions.push(nq); renderBuilder(); const qs = document.querySelectorAll('.cb-q'); qs[qs.length - 1].scrollIntoView({ block: 'center' }); }
      else if (a === 'q-del') { draft.data.questions.splice(i, 1); if (!draft.data.questions.length) draft.data.questions.push(blankQ()); renderBuilder(); }
      else if (a === 'q-bulk') { const b = $('#bulk-box'); b.hidden = !b.hidden; }
      else if (a === 'q-bulk-do') {
        const type = $('#bulk-type').value; const ps = $('#bulk-pass'); const last = draft.data.questions[draft.data.questions.length - 1] || {};
        const passage = ps && ps.value ? Number(ps.value) : (last.passage || 1);
        const add = parseBulk($('#bulk-text').value, type, passage);
        if (!add.length) return toast('Nothing to add — put at least one question and its answer.', true);
        draft.data.questions = draft.data.questions.filter((q) => q.prompt || q.answer).concat(add); renderBuilder();
        const withExp = add.filter((q) => q.explanation).length; toast(add.length + ' questions added' + (withExp ? ' · ' + withExp + ' with explanations' : ''));
      }
      else if (a === 'pdf-file') { const url = await pickAndUpload('.pdf,application/pdf', $('#pdf-status')); if (url) { draft.data.fileUrl = url; renderBuilder(); } }
      else if (a === 'pdf-file-del') { draft.data.fileUrl = ''; renderBuilder(); }
      else if (a === 'cover') { const url = await pickAndUpload('image/*', $('#cover-status')); if (url) { draft.data.coverUrl = url; renderBuilder(); } }
      else if (a === 'card-img') { const url = await pickAndUpload('image/*', $('#card-img-status')); if (url) { draft.data.coverUrl = url; renderBuilder(); } }
      else if (a === 'card-img-del') { draft.data.coverUrl = ''; renderBuilder(); }
      else if (a === 'cover-del') { draft.data.coverUrl = ''; renderBuilder(); }
      else if (a === 'body-img') {
        const url = await pickAndUpload('image/*', $('#body-status')); if (!url) return;
        const ta = $('#body-text'); const at = ta ? (ta.selectionStart ?? ta.value.length) : String(draft.data.body || '').length; const cur = String(draft.data.body || '');
        const cap = (prompt('Caption for this picture (optional):', '') || '').replace(/[\]\n]/g, ' ');
        draft.data.body = cur.slice(0, at).replace(/\s*$/, '') + '\n\n![' + cap + '](' + url + ')\n\n' + cur.slice(at).replace(/^\s*/, ''); renderBuilder();
      }
      else if (a === 'p-add') { if (draft.data.parts.length < 3) { draft.data.parts.push({ title: 'Part ' + (draft.data.parts.length + 1), prompt: '', questions: [], imageUrl: '', audioUrl: '', prepSeconds: 0, speakSeconds: 0, sample: '' }); renderBuilder(); } }
      else if (a === 'p-del') { draft.data.parts.splice(i, 1); renderBuilder(); }
      else if (a === 'p-img') { const url = await pickAndUpload('image/*', $('#pimg-status-' + i)); if (url) { draft.data.parts[i].imageUrl = url; renderBuilder(); } }
      else if (a === 'p-img-del') { draft.data.parts[i].imageUrl = ''; renderBuilder(); }
      else if (a === 'p-audio') { const url = await pickAndUpload('audio/*,.mp3,.wav,.m4a,.ogg', $('#pimg-status-' + i)); if (url) { draft.data.parts[i].audioUrl = url; renderBuilder(); } }
      else if (a === 'p-audio-del') { draft.data.parts[i].audioUrl = ''; renderBuilder(); }
      else if (a === 't-add') { draft.data.tasks.push({ title: 'Task ' + (draft.data.tasks.length + 1), prompt: '', imageUrl: '', minWords: 150, minutes: 20, sample: '' }); renderBuilder(); }
      else if (a === 't-del') { draft.data.tasks.splice(i, 1); renderBuilder(); }
      else if (a === 't-img') { const url = await pickAndUpload('image/*', $('#timg-status-' + i)); if (url) { draft.data.tasks[i].imageUrl = url; renderBuilder(); } }
      else if (a === 't-img-del') { draft.data.tasks[i].imageUrl = ''; renderBuilder(); }
    } catch (err) { fail(err); }
  }


  /* ───────── packs: the cards of the Full Tests pages ───────── */
  let packList = null, packEdit = null;
  const SK_NAME = { reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking' };
  async function loadPackList() { try { packList = (await api('/api/admin/packs')).packs; } catch (e) { fail(e); packList = packList || []; } renderPacks(); }
  function renderPacks() {
    const mount = $('#content-packs'); if (!mount) return;
    const f = packEdit || { skill: 'reading', title: '', tier: 'Tier 1', plan: 'MAX', group: 'Practice', description: '', premium: true, published: true };
    const opt = (list, cur) => list.map(([v, l]) => `<option value="${esc(v)}" ${v === cur ? 'selected' : ''}>${esc(l)}</option>`).join('');
    const rows = (packList || []).map((p) => `<tr><td><strong>${esc(p.title)}</strong><div class="muted sm">${esc(p.description || '')}</div></td><td>${esc(SK_NAME[p.skill] || p.skill)}</td><td>${esc(p.tier || '—')}</td><td>${esc(p.group || 'Practice')}</td>
      <td><span class="chip ${p.premium ? 'chip-premium' : ''}">${p.premium ? '★ ' + esc(p.plan || 'Premium') : 'Free'}</span></td>
      <td><button class="chip ${p.published === false ? '' : 'chip-ok'}" data-pk="pub" data-id="${esc(p.id)}" type="button" title="Click to change">${p.published === false ? 'Hidden' : 'Visible'}</button></td>
      <td><div class="btn-row"><button class="btn btn-sm" data-pk="edit" data-id="${esc(p.id)}" type="button">Edit</button><button class="btn btn-sm btn-danger" data-pk="del" data-id="${esc(p.id)}" type="button">Delete</button></div></td></tr>`).join('');
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">Packs · cards of the Full Tests pages</div>
      <div class="muted sm">A pack is a card on the Full Reading / Listening / Writing / Speaking page. Create it here, then choose its name in the <b>Pack</b> field of a full test and the test appears inside it. A pack with the same name as a built-in one (e.g. “Pack 4”) takes over its card.</div></div></div>
      <div class="cb-block"><strong>${packEdit ? 'Edit pack' : 'New pack'}</strong>
        <div class="cb-grid"><label class="lbl">Skill<select class="field" id="pk-skill">${opt(Object.entries(SK_NAME), f.skill)}</select></label><label class="lbl">Pack name *<input class="field" id="pk-title" maxlength="80" value="${esc(f.title)}" placeholder="e.g. Pack 7"></label></div>
        <div class="cb-grid"><label class="lbl">Tier<select class="field" id="pk-tier">${opt([['', 'No tier'], ['Tier 1', 'Tier 1'], ['Tier 2', 'Tier 2'], ['Tier 3', 'Tier 3']], f.tier || '')}</select></label>
          <label class="lbl">Plan label<select class="field" id="pk-plan">${opt([['', 'None'], ['STANDARD', 'Standard'], ['MAX', 'Max'], ['ULTRA', 'Ultra']], (f.plan || '').toUpperCase())}</select></label></div>
        <div class="cb-grid"><label class="lbl">Section on the page<input class="field" id="pk-group" list="pk-groups" maxlength="60" value="${esc(f.group)}" placeholder="Recent Exams / Practice / a new name"><datalist id="pk-groups"><option value="Recent Exams"></option><option value="Practice"></option></datalist></label>
          <label class="lbl">Short description (optional)<input class="field" id="pk-desc" maxlength="200" value="${esc(f.description)}" placeholder="Practice tests to improve your skills"></label></div>
        <div class="cb-checks"><label><input type="checkbox" id="pk-premium" ${f.premium ? 'checked' : ''}> Locked (paid plan) by default</label><label><input type="checkbox" id="pk-published" ${f.published !== false ? 'checked' : ''}> Visible to students</label></div>
        <div class="btn-row"><button class="btn btn-primary" data-pk="save" type="button">${packEdit ? 'Save changes' : 'Create pack'}</button>${packEdit ? '<button class="btn" data-pk="cancel" type="button">Cancel</button>' : ''}</div></div>
      ${packList === null ? '<div class="empty">Loading…</div>' : packList.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Pack</th><th>Skill</th><th>Tier</th><th>Section</th><th>Access</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div><div class="muted sm" style="margin-top:8px">Free / Standard / Max for a whole pack or one test: <a href="#access">Access</a>.</div>` : '<div class="empty">No packs made here yet. The built-in packs (Pack 1–6, Volume 8–9 …) are managed in <a href="#access">Access</a>.</div>'}</div>`;
  }
  async function onPackClick(e) {
    const t = e.target.closest('[data-pk]'); if (!t) return;
    try {
      const a = t.dataset.pk, id = t.dataset.id; const item = (packList || []).find((x) => x.id === id);
      if (a === 'edit' && item) { packEdit = { ...item }; renderPacks(); $('#content-packs').scrollIntoView(); }
      else if (a === 'cancel') { packEdit = null; renderPacks(); }
      else if (a === 'pub' && item) { await api('/api/admin/packs/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ published: item.published === false }) }); await loadPackList(); }
      else if (a === 'del' && item) { if (!confirm('Delete the pack “' + item.title + '”? Its tests stay, but the pack card disappears.')) return; await api('/api/admin/packs/' + encodeURIComponent(id), { method: 'DELETE' }); packEdit = null; toast('Pack deleted'); await loadPackList(); }
      else if (a === 'save') {
        const body = { skill: $('#pk-skill').value, title: $('#pk-title').value, tier: $('#pk-tier').value, plan: $('#pk-plan').value, group: $('#pk-group').value, description: $('#pk-desc').value, premium: $('#pk-premium').checked, published: $('#pk-published').checked };
        if (!body.title.trim()) return toast('Please enter the pack name.', true);
        if (packEdit) await api('/api/admin/packs/' + encodeURIComponent(packEdit.id), { method: 'PATCH', body: JSON.stringify(body) });
        else await api('/api/admin/packs', { method: 'POST', body: JSON.stringify(body) });
        toast(packEdit ? 'Pack saved' : 'Pack created'); packEdit = null; await loadPackList(); PACKS = {};
      }
    } catch (err) { fail(err); }
  }

  const NAMES = Object.keys(TYPES);
  function onHash() { let v = (location.hash || '').slice(1).split('?')[0]; v = VIEW_FOR[v] || v; if (v === 'packs' && packList === null) loadPackList(); if (v === 'readingfull') v = 'reading'; if (NAMES.includes(v) && lists[v] === null) loadType(v); }
  window.addEventListener('DOMContentLoaded', () => {
    NAMES.forEach((t) => renderType(t));
    document.addEventListener('click', onClick); document.addEventListener('click', onPackClick); renderPacks();
    document.addEventListener('input', onInput); document.addEventListener('change', onInput);
    $('#cb-save').addEventListener('click', save);
    document.querySelectorAll('[data-cb-close]').forEach((b) => b.addEventListener('click', closeBuilder));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#builder').classList.contains('open')) closeBuilder(); });
    window.addEventListener('hashchange', onHash); onHash();
    $('#refresh') && $('#refresh').addEventListener('click', () => NAMES.forEach((t) => { if (lists[t] !== null) loadType(t); }));
  });
})();
