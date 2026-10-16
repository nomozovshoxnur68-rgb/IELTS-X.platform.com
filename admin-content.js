/* IELTSX admin: Reading / Listening / Writing test builder (admin.html #reading #listening #writing). */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const TYPES = { reading: 'Reading', listening: 'Listening', writing: 'Writing' };
  const Q_LABEL = { short: 'Short answer / gap fill', tfng: 'True / False / Not Given', ynng: 'Yes / No / Not Given', mcq: 'Multiple choice' };
  const lists = { reading: null, listening: null, writing: null };
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
    try { lists[type] = (await api('/api/admin/materials?type=' + type)).items; } catch (e) { fail(e); lists[type] = lists[type] || []; }
    renderType(type);
  }
  function renderType(type) {
    const mount = $('#content-' + type); if (!mount) return;
    const items = lists[type];
    const noun = type === 'writing' ? 'task set' : 'test';
    const rows = (items || []).map((m) => {
      const d = m.data || {}; const count = type === 'writing' ? (d.tasks || []).length + ' task(s)' : (d.questions || []).length + ' questions';
      return `<tr><td><strong>${esc(m.title)}</strong><div class="muted sm">${esc(m.pack || '')}</div></td><td>${count}${type === 'listening' ? (d.audioUrl ? ' · 🔊 audio' : ' · <span class="warn-text">no audio</span>') : ''}</td>
        <td><button class="chip ${m.premium ? 'chip-premium' : ''}" data-ct="premium" data-id="${esc(m.id)}" data-type="${type}" type="button" title="Click to change">${m.premium ? '★ Premium' : 'Free'}</button></td>
        <td><button class="chip ${m.published === false ? '' : 'chip-ok'}" data-ct="publish" data-id="${esc(m.id)}" data-type="${type}" type="button" title="Click to change">${m.published === false ? 'Draft' : 'Published'}</button></td>
        <td>${fmt(m.createdAt)}</td>
        <td><div class="btn-row"><button class="btn btn-sm" data-ct="edit" data-id="${esc(m.id)}" data-type="${type}" type="button">Edit</button><a class="btn btn-sm" href="/test?id=${encodeURIComponent(m.id)}" target="_blank" rel="noopener">Open ↗</a><button class="btn btn-sm btn-danger" data-ct="delete" data-id="${esc(m.id)}" data-type="${type}" data-title="${esc(m.title)}" type="button">Delete</button></div></td></tr>`;
    }).join('');
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">${TYPES[type]} ${type === 'writing' ? 'tasks' : 'tests'}</div>
      <div class="muted sm">${type === 'reading' ? 'Passage, pictures and questions with answers.' : type === 'listening' ? 'Audio file, map/diagram pictures and questions with answers.' : 'Task 1 / Task 2 prompts with an optional chart picture.'} Students see them in the ${TYPES[type]} practice page.</div></div>
      <button class="btn btn-primary" data-ct="new" data-type="${type}" type="button">+ New ${noun}</button></div>
      ${items === null ? '<div class="empty">Loading…</div>' : items.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Title</th><th>Content</th><th>Access</th><th>Status</th><th>Added</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>` : `<div class="empty">Nothing here yet. Press “+ New ${noun}” to add the first one.</div>`}</div>`;
  }

  /* ───────── uploads (local disk, or straight to Supabase Storage on Vercel) ───────── */
  async function uploadFile(file) {
    const meta = await api('/api/admin/upload-url', { method: 'POST', body: JSON.stringify({ filename: file.name, size: file.size }) });
    if (meta.local) {
      const fd = new FormData(); fd.append('type', /\.(mp3|wav|m4a|ogg|aac)$/i.test(file.name) ? 'audio' : 'image'); fd.append('file', file, file.name);
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
  const blankQ = (type) => ({ type: type || 'short', group: '', prompt: '', options: [], answer: '', explanation: '' });
  function blank(type) {
    const data = { durationMin: type === 'writing' ? 60 : type === 'listening' ? 30 : 60, instructions: '', images: [] };
    if (type === 'reading') Object.assign(data, { passage: '', questions: [blankQ()] });
    if (type === 'listening') Object.assign(data, { audioUrl: '', transcript: '', questions: [blankQ()] });
    if (type === 'writing') Object.assign(data, { tasks: [{ title: 'Task 1', prompt: '', imageUrl: '', minWords: 150, minutes: 20, sample: '' }, { title: 'Task 2', prompt: '', imageUrl: '', minWords: 250, minutes: 40, sample: '' }] });
    return { type, title: '', pack: '', description: '', premium: false, published: true, data };
  }
  function openBuilder(type, item) {
    editingId = item ? item.id : null;
    draft = item ? JSON.parse(JSON.stringify(item)) : blank(type);
    draft.data = draft.data || {}; draft.data.images = draft.data.images || [];
    if (draft.type !== 'writing') draft.data.questions = draft.data.questions && draft.data.questions.length ? draft.data.questions : [blankQ()];
    if (draft.type === 'writing' && !(draft.data.tasks || []).length) draft.data.tasks = blank('writing').data.tasks;
    $('#builder-title').textContent = (editingId ? 'Edit ' : 'New ') + TYPES[draft.type].toLowerCase() + (draft.type === 'writing' ? ' tasks' : ' test');
    renderBuilder(); $('#builder').classList.add('open'); $('#builder-body').scrollTop = 0;
  }
  function closeBuilder() { if (uploading && !confirm('A file is still uploading. Close anyway?')) return; $('#builder').classList.remove('open'); draft = null; editingId = null; }

  const field = (label, path, val, extra = '') => `<label class="lbl">${label}<input class="field" data-p="${path}" value="${esc(val)}" ${extra}></label>`;
  function imagesBlock(label, help) {
    const imgs = draft.data.images || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>${label}</strong><div class="muted sm">${help}</div></div><button class="btn btn-sm" data-cb="img-add" type="button">⬆ Upload picture</button></div><div class="muted sm" id="img-status"></div>
      <div class="cb-images">${imgs.map((im, i) => `<div class="cb-img"><img src="${esc(im.url)}" alt=""><input class="field" placeholder="Caption (optional)" data-p="data.images.${i}.caption" value="${esc(im.caption)}"><button class="btn btn-sm btn-danger" data-cb="img-del" data-i="${i}" type="button">Remove</button></div>`).join('')}</div></div>`;
  }
  function questionsBlock() {
    const qs = draft.data.questions || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>Questions & answers (${qs.length})</strong><div class="muted sm">For several accepted answers separate them with <code>|</code> (e.g. <code>colour|color</code>). True/False/Not Given: write TRUE, FALSE or NOT GIVEN. Multiple choice: write the letter (A, B, C…) of the right option.</div></div>
      <div class="btn-row"><button class="btn btn-sm" data-cb="q-bulk" type="button">Paste many</button><button class="btn btn-sm btn-primary" data-cb="q-add" type="button">+ Question</button></div></div>
      <div id="bulk-box" class="cb-bulk" hidden><textarea class="field" id="bulk-text" rows="6" placeholder="One question per line:  question text => answer&#10;Example:  The bees live in a => hive"></textarea>
      <div class="btn-row"><select class="field" id="bulk-type" style="width:auto">${Object.entries(Q_LABEL).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select><button class="btn btn-sm btn-primary" data-cb="q-bulk-do" type="button">Add them</button></div></div>
      ${qs.map((q, i) => `<div class="cb-q"><div class="cb-qn">${i + 1}</div><div class="cb-qbody">
        <div class="cb-row"><select class="field" data-p="data.questions.${i}.type" data-rerender="1">${Object.entries(Q_LABEL).map(([k, v]) => `<option value="${k}" ${q.type === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
        <input class="field" placeholder="Heading before this question (optional), e.g. Questions 1–5: Complete the notes" data-p="data.questions.${i}.group" value="${esc(q.group)}"></div>
        <textarea class="field" rows="2" placeholder="Question text" data-p="data.questions.${i}.prompt">${esc(q.prompt)}</textarea>
        ${q.type === 'mcq' ? `<textarea class="field" rows="4" placeholder="Options, one per line (A, B, C… in this order)" data-p="data.questions.${i}.options" data-lines="1">${esc((q.options || []).join('\n'))}</textarea>` : ''}
        <div class="cb-row"><input class="field" placeholder="${q.type === 'tfng' ? 'TRUE / FALSE / NOT GIVEN' : q.type === 'ynng' ? 'YES / NO / NOT GIVEN' : q.type === 'mcq' ? 'Correct letter, e.g. B' : 'Correct answer (use | for alternatives)'}" data-p="data.questions.${i}.answer" value="${esc(q.answer)}">
        <input class="field" placeholder="Explanation shown after submitting (optional)" data-p="data.questions.${i}.explanation" value="${esc(q.explanation)}"></div></div>
        <button class="btn btn-sm btn-danger" data-cb="q-del" data-i="${i}" type="button" title="Delete question">✕</button></div>`).join('')}</div>`;
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
  function renderBuilder() {
    const t = draft.type, d = draft.data;
    $('#builder-body').innerHTML = `
      <div class="cb-grid">${field('Title *', 'title', draft.title, 'placeholder="e.g. Cambridge 18 · Test 2 · Passage 1" maxlength="200"')}${field('Pack / group (optional)', 'pack', draft.pack, 'placeholder="e.g. Cambridge 18"')}</div>
      <label class="lbl">Short description (optional)<input class="field" data-p="description" value="${esc(draft.description)}" maxlength="500"></label>
      <div class="cb-grid"><label class="lbl">Time limit, minutes (0 = none)<input class="field" type="number" min="0" data-p="data.durationMin" value="${esc(d.durationMin)}"></label>
        <div class="cb-checks"><label><input type="checkbox" data-p="premium" ${draft.premium ? 'checked' : ''}> Premium only</label><label><input type="checkbox" data-p="published" ${draft.published !== false ? 'checked' : ''}> Published (visible to students)</label></div></div>
      ${t !== 'writing' ? `<label class="lbl">Instructions shown above the questions (optional)<textarea class="field" rows="2" data-p="data.instructions">${esc(d.instructions)}</textarea></label>` : ''}
      ${t === 'reading' ? `<label class="lbl">Passage text *<textarea class="field cb-passage" rows="14" data-p="data.passage" placeholder="Paste the passage. Leave an empty line between paragraphs. Tip: start a line with A. / B. / C. to label paragraphs.">${esc(d.passage)}</textarea></label>` : ''}
      ${t === 'listening' ? `<div class="cb-block"><div class="cb-head"><div><strong>Audio file *</strong><div class="muted sm">mp3, wav, m4a, ogg (up to 100 MB).</div></div><button class="btn btn-sm btn-primary" data-cb="audio" type="button">⬆ ${d.audioUrl ? 'Replace audio' : 'Upload audio'}</button></div><div class="muted sm" id="audio-status"></div>${d.audioUrl ? `<audio controls preload="none" src="${esc(d.audioUrl)}" style="width:100%;margin-top:8px"></audio>` : ''}</div>` : ''}
      ${t === 'writing' ? tasksBlock() : imagesBlock(t === 'listening' ? 'Pictures: maps, plans, diagrams' : 'Pictures for the passage (optional)', 'Shown to the student next to the questions. Add as many as needed.')}
      ${t !== 'writing' ? questionsBlock() : ''}
      ${t === 'listening' ? `<label class="lbl">Transcript (optional, shown only after the student submits)<textarea class="field" rows="5" data-p="data.transcript">${esc(d.transcript)}</textarea></label>` : ''}`;
    syncSave();
  }

  function setPath(obj, path, val) {
    const keys = path.split('.'); let o = obj;
    for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
    o[keys[keys.length - 1]] = val;
  }
  function onInput(e) {
    const el = e.target; const p = el.dataset && el.dataset.p; if (!p || !draft) return;
    let v = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.lines) v = v.split('\n').map((x) => x.trim()).filter(Boolean);
    if (el.type === 'number') v = Number(v) || 0;
    setPath(draft, p, v);
    if (el.dataset.rerender && e.type === 'change') renderBuilder();
  }

  async function save() {
    if (uploading) return;
    const d = draft.data;
    if (!draft.title.trim()) return toast('Please enter a title.', true);
    if (draft.type === 'reading' && !String(d.passage || '').trim()) return toast('Please paste the passage text.', true);
    if (draft.type === 'listening' && !d.audioUrl) return toast('Please upload the audio file.', true);
    if (draft.type !== 'writing') {
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
        if (ct === 'new') return openBuilder(type);
        const item = (lists[type] || []).find((x) => x.id === id);
        if (ct === 'edit') { const full = await api('/api/admin/materials/' + encodeURIComponent(id)); return openBuilder(type, full.item); }
        if (ct === 'premium' && item) { await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ premium: !item.premium }) }); toast(item.premium ? 'Now free' : 'Now Premium only'); return loadType(type); }
        if (ct === 'publish' && item) { const on = item.published === false; await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ published: on }) }); toast(on ? 'Published' : 'Hidden (draft)'); return loadType(type); }
        if (ct === 'delete') { if (!confirm('Delete “' + t.dataset.title + '”? Students will no longer see it.')) return; await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'DELETE' }); toast('Deleted'); return loadType(type); }
        return;
      }
      if (!draft) return;
      const a = t.dataset.cb, i = Number(t.dataset.i);
      if (a === 'img-add') { const url = await pickAndUpload('image/*', $('#img-status')); if (url) { draft.data.images.push({ url, caption: '' }); renderBuilder(); } }
      else if (a === 'img-del') { draft.data.images.splice(i, 1); renderBuilder(); }
      else if (a === 'audio') { const url = await pickAndUpload('audio/*,.mp3,.wav,.m4a,.ogg', $('#audio-status')); if (url) { draft.data.audioUrl = url; renderBuilder(); } }
      else if (a === 'q-add') { const last = draft.data.questions[draft.data.questions.length - 1]; draft.data.questions.push(blankQ(last && last.type)); renderBuilder(); const qs = document.querySelectorAll('.cb-q'); qs[qs.length - 1].scrollIntoView({ block: 'center' }); }
      else if (a === 'q-del') { draft.data.questions.splice(i, 1); if (!draft.data.questions.length) draft.data.questions.push(blankQ()); renderBuilder(); }
      else if (a === 'q-bulk') { const b = $('#bulk-box'); b.hidden = !b.hidden; }
      else if (a === 'q-bulk-do') {
        const type = $('#bulk-type').value; const lines = $('#bulk-text').value.split('\n').map((x) => x.trim()).filter(Boolean);
        if (!lines.length) return;
        const add = lines.map((l) => { const [p, ...r] = l.split('=>'); return { ...blankQ(type), prompt: p.trim(), answer: r.join('=>').trim() }; });
        draft.data.questions = draft.data.questions.filter((q) => q.prompt || q.answer).concat(add); renderBuilder(); toast(add.length + ' questions added');
      }
      else if (a === 't-add') { draft.data.tasks.push({ title: 'Task ' + (draft.data.tasks.length + 1), prompt: '', imageUrl: '', minWords: 150, minutes: 20, sample: '' }); renderBuilder(); }
      else if (a === 't-del') { draft.data.tasks.splice(i, 1); renderBuilder(); }
      else if (a === 't-img') { const url = await pickAndUpload('image/*', $('#timg-status-' + i)); if (url) { draft.data.tasks[i].imageUrl = url; renderBuilder(); } }
      else if (a === 't-img-del') { draft.data.tasks[i].imageUrl = ''; renderBuilder(); }
    } catch (err) { fail(err); }
  }

  const NAMES = Object.keys(TYPES);
  function onHash() { const v = (location.hash || '').slice(1).split('?')[0]; if (NAMES.includes(v) && lists[v] === null) loadType(v); }
  window.addEventListener('DOMContentLoaded', () => {
    NAMES.forEach((t) => renderType(t));
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput); document.addEventListener('change', onInput);
    $('#cb-save').addEventListener('click', save);
    document.querySelectorAll('[data-cb-close]').forEach((b) => b.addEventListener('click', closeBuilder));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#builder').classList.contains('open')) closeBuilder(); });
    window.addEventListener('hashchange', onHash); onHash();
    $('#refresh') && $('#refresh').addEventListener('click', () => NAMES.forEach((t) => { if (lists[t] !== null) loadType(t); }));
  });
})();
