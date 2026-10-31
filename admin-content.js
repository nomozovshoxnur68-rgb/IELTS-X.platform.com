/* IELTSX admin: Reading / Listening / Writing / Speaking / PDF builder and the Article builder (admin.html #reading #listening #writing #speaking #articles #pdf). */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const TYPES = { reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking', article: 'Articles', pdf: 'PDF materials' };
  const TOPICS = ['General', 'History', 'Science', 'Technology', 'Environment', 'Health', 'Education', 'Society', 'Business', 'Culture', 'Nature', 'Psychology'];
  const Q_LABEL = { short: 'Short answer / sentence completion', completion: 'Note / form / flow-chart / summary completion', table: 'Table completion (rows and columns)', tfng: 'True / False / Not Given', ynng: 'Yes / No / Not Given', mcq: 'Multiple choice (one answer)', 'mcq-multi': 'Multiple choice (two or more answers)', matching: 'Matching: headings / information / features / sentence endings', map: 'Map / plan / diagram labelling (choose a letter)' };
  /* Listening has its own question types: they are the types of the listening engine (listening/js/listening.js) */
  const LQ_LABEL = { gap: 'Completion, typed: notes / form / sentence / flow-chart', table: 'Table completion, typed (rows and columns)', mcq: 'Multiple choice (one answer)', 'mcq-multi': 'Multiple choice, choose TWO / THREE letters', matching: 'Matching: drag the lettered option into the gap', map: 'Map / plan / diagram labelling (tick one letter)', box: 'Completion with a word box (drag a word into the text)' };
  const qLabels = () => (draft && draft.type === 'listening' ? LQ_LABEL : Q_LABEL);
  const OPT_TYPES = ['mcq', 'mcq-multi', 'matching', 'map', 'box'];
  const lists = { reading: null, listening: null, writing: null, speaking: null, article: null, pdf: null };
  /* Reading, Listening, Writing and Speaking each have two lists: Part practice (#reading) and Full tests (#readingfull) */
  const MODE_TYPES = ['reading', 'listening', 'writing', 'speaking'];
  const VIEW_FOR = { articles: 'article', readingfull: 'reading', listeningfull: 'listening', writingfull: 'writing', speakingfull: 'speaking' };
  const modeOf = (m) => ((m && m.data && m.data.mode) === 'full' ? 'full' : 'part');
  let draft = null, editingId = null, uploading = 0;
  let matRules = {};                                   // access rule of every admin-made test (from /api/admin/access): id -> { locked, plan, mode }
  const selected = new Set();                          // cards ticked for a bulk action

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
  const today = () => { const d = new Date(); return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-'); };

  /* ───────── list views ───────── */
  async function loadType(type) {
    try { lists[type] = (await api('/api/admin/materials?type=' + type)).items.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))); } catch (e) { fail(e); lists[type] = lists[type] || []; }
    await loadRules();
    renderType(type);
  }
  /* the Free / Standard / Max / Ultra setting of every admin-made test, shown on its card */
  async function loadRules() {
    try {
      const d = await api('/api/admin/access'); matRules = {}; PACKS = {};
      (d.skills || []).forEach((sk) => { PACKS[sk.skill] = []; (sk.packs || []).forEach((p) => {
        if (!p.practice && !p.hidden && (p.builtIn || p.adminId || p.tests.some((t) => t.mode === 'full'))) PACKS[sk.skill].push(p.title);
        p.tests.forEach((t) => { if (t.material) matRules[t.id] = t.rule; });
      }); });
    } catch (e) { /* the cards still show Free / Premium */ }
  }
  const NOUN = { reading: 'test', listening: 'listening card', writing: 'writing card', speaking: 'speaking card', article: 'article card', pdf: 'PDF material' };
  /* Every kind of content is shown as cards (picture, tag, pack) with Edit / Copy / Open / Remove. Newest first. */
  const GRID = {
    reading: { title: 'Reading · Part practice', noun: 'part practice card', help: 'Each card is one passage on the Reading practice page (like pessages/test-19, 20, 21).' },
    readingfull: { title: 'Reading · Full tests', noun: 'full reading test', help: 'Three passages, 40 questions, one 60-minute paper. It is listed on the Full Reading page inside its pack.' },
    listening: { title: 'Listening · Part practice', noun: 'listening section', help: 'Each card is one section (10 questions) on the Listening practice page: audio, questions with answers and explanations, card picture.' },
    listeningfull: { title: 'Listening · Full tests', noun: 'full listening test', help: 'Parts 1–4, 40 questions, one recording, 30 minutes. It is listed on the Full Listening page inside its pack.' },
    writing: { title: 'Writing · Part practice', noun: 'writing task', help: 'Each card is one task (Task 1 or Task 2) on the Writing practice page, with its chart and model answer. It opens in the IELTS writing exam screen.' },
    writingfull: { title: 'Writing · Full tests', noun: 'full writing test', help: 'Task 1 + Task 2, 60 minutes, in the IELTS writing exam screen. It is listed on the Full Writing page inside its pack.' },
    speaking: { title: 'Speaking · Part practice', noun: 'speaking card', help: 'Each card is one speaking part (Part 1 questions, a Part 2 cue card or Part 3 discussion) on the Speaking practice page.' },
    speakingfull: { title: 'Speaking · Full tests', noun: 'full speaking test', help: 'Parts 1, 2 and 3 in one test. It is listed on the Full Speaking page inside its pack.' },
    article: { title: 'Article cards', noun: 'article card', help: 'Each card is an article on the Articles page: text, cover picture and the vocabulary / grammar students tap on.' },
    pdf: { title: 'PDF material cards', noun: 'PDF material', help: 'Each card is a PDF on the PDF Library page. Upload the file and a card picture; students press Download.' }
  };
  function renderType(type) {
    if (MODE_TYPES.includes(type)) { ['part', 'full'].forEach((mode) => renderCardGrid(type, mode)); return; }
    renderCardGrid(type, '');
  }
  const viewOf = (type, mode) => (mode === 'full' ? type + 'full' : type);
  function cardInfo(type, m) {
    const d = m.data || {}; const nq = (d.questions || []).length; const exp = (d.questions || []).filter((q) => String(q.explanation || '').trim()).length;
    const expTxt = nq ? (exp === nq ? ' · 💡 all explained' : exp ? ' · ' + exp + '/' + nq + ' explained' : '') : '';
    const full = modeOf(m) === 'full';
    if (type === 'reading') return { img: d.coverUrl, tag: full ? 'Full · 3 passages' : d.passageLabel || 'Passage 1', sub: nq + ' questions · ' + (d.durationMin ? d.durationMin + ' min' : 'no timer') + expTxt, href: d.no ? (full ? '/full-tests/reading/test-' : '/pessages/test-') + d.no : '/exam/reading/' + encodeURIComponent(m.id) };
    if (type === 'listening') return { img: d.coverUrl, tag: full ? 'Full · Parts 1–4' : d.sectionLabel || 'Section 1', sub: nq + ' questions' + (d.audioUrl ? ' · 🔊 audio' : ' · ⚠ no audio') + expTxt, href: !full && d.no ? '/sections/test-' + d.no : '/exam/listening/' + encodeURIComponent(m.id) };
    if (type === 'writing') { const ts = d.tasks || []; return { img: d.coverUrl || (ts.find((t) => t.imageUrl) || {}).imageUrl, tag: full ? 'Full · Task 1 + 2' : (ts[0] && ts[0].kind === 'task2' ? 'Task 2' : 'Task 1') + ' · ' + (d.tier || 'Tier 1'), sub: ts.length + ' task(s)' + (ts.some((t) => t.chart) ? ' · chart' : '') + (ts.some((t) => t.sample) ? ' · model answer' : ''), href: '/writing/?id=' + encodeURIComponent(m.id) }; }
    if (type === 'speaking') { const ps = d.parts || []; return { img: (ps.find((t) => t.imageUrl) || {}).imageUrl, tag: full ? 'Full · Parts 1–3' : ps.map((p) => String(p.title || '').split('·')[0].trim()).join(' + ') || 'Part', sub: ps.reduce((n, x) => n + (x.questions || []).length, 0) + ' questions' + (ps.some((x) => x.audioUrl) ? ' · 🔊' : ''), href: '/test?id=' + encodeURIComponent(m.id) }; }
    if (type === 'article') return { img: d.imageUrl || d.coverUrl, tag: d.level || d.passageLabel || 'Passage 1', sub: (d.topic || 'General') + ` · ${(d.vocabulary || []).length} words · ${(d.grammar || []).length} grammar`, href: '/collections/article?id=' + encodeURIComponent(m.id) };
    return { img: d.coverUrl, tag: ({ reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking', magazine: 'Magazine', other: 'PDF' })[d.category] || 'PDF', sub: (d.fileUrl ? '📄 PDF uploaded' : '⚠ no PDF file') + (d.pages ? ' · ' + d.pages + ' pages' : ''), href: d.fileUrl || '' };
  }
  const ACCESS = [['free', '🔓 Free'], ['standard', '🔒 Standard'], ['max', '🔒 Max'], ['ultra', '🔒 Ultra']];
  const accessOf = (m) => { const r = matRules[m.id]; if (r) return r.mode && r.mode !== 'default' ? r.mode : r.locked ? r.plan || 'standard' : 'free'; return m.premium ? 'standard' : 'free'; };
  const accessSelect = (m, type) => `<select class="field pc-access" data-ct-access="${esc(m.id)}" data-type="${type}" title="Who can open it (more plans in Access)">${ACCESS.map(([v, l]) => `<option value="${v}" ${accessOf(m) === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  function renderCardGrid(type, mode) {
    const view = viewOf(type, mode); const mount = $('#content-' + view); if (!mount) return;
    const all = lists[type]; const items = all && mode ? all.filter((m) => modeOf(m) === mode) : all;
    const G = GRID[view]; const live = (items || []).filter((m) => m.published !== false).length;
    const other = mode === 'full' ? 'part' : 'full'; const otherName = mode ? GRID[viewOf(type, other)].title.split('·')[1].trim() : '';
    const cards = (items || []).map((m, n) => {
      const c = cardInfo(type, m); const ids = `data-id="${esc(m.id)}" data-type="${type}"`;
      const hay = esc((m.title + ' ' + (m.pack || '') + ' ' + (m.description || '')).toLowerCase());
      return `<div class="pc-card${selected.has(m.id) ? ' is-sel' : ''}" data-hay="${hay}" data-state="${m.published === false ? 'draft' : 'live'} ${accessOf(m) === 'free' ? 'free' : 'locked'}">
        <div class="pc-img">${c.img ? `<img src="${esc(c.img)}" alt="" loading="lazy">` : `<div class="pc-noimg">${mode === 'full' ? 'Full test' : 'No picture yet<br><span>Edit → upload card picture</span>'}</div>`}<label class="pc-sel" title="Select for a bulk action"><input type="checkbox" data-ct-sel="${esc(m.id)}" data-type="${type}" ${selected.has(m.id) ? 'checked' : ''}></label><span class="pc-tag">${esc(c.tag)}</span>${n === 0 && items.length > 1 ? '<span class="pc-new">NEW</span>' : ''}${m.published === false ? '<span class="pc-draft">Hidden</span>' : ''}</div>
        <div class="pc-body"><div class="muted sm">${mode === 'full' ? '📦 ' : ''}${esc(m.pack || (mode === 'full' ? 'Practice' : type === 'reading' ? 'Starter Pack' : '—'))} · ${fmt(m.createdAt)}</div><div class="pc-title">${esc(m.title)}</div>
          <div class="muted sm">${esc(c.sub)}</div>
          <div class="btn-row" style="margin:8px 0">${accessSelect(m, type)}<button class="chip ${m.published === false ? '' : 'chip-ok'}" data-ct="publish" ${ids} type="button" title="Click to change">${m.published === false ? 'Hidden' : 'Visible'}</button></div>
          <div class="btn-row"><button class="btn btn-sm" data-ct="edit" ${ids} type="button">Edit</button><button class="btn btn-sm" data-ct="dup" ${ids} type="button" title="Make a copy (saved as Hidden)">Copy</button>${c.href ? `<a class="btn btn-sm" href="${esc(c.href)}" target="_blank" rel="noopener">Open ↗</a>` : ''}${mode ? `<button class="btn btn-sm" data-ct="move" ${ids} data-to="${other}" type="button" title="Move this test to ${esc(otherName)}">→ ${other === 'full' ? 'Full' : 'Part'}</button>` : ''}<button class="btn btn-sm btn-danger" data-ct="delete" ${ids} data-title="${esc(m.title)}" type="button">Remove</button></div></div></div>`;
    }).join('');
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">${G.title}</div>
      <div class="muted sm">${G.help} The newest card is shown first, here and on the website.${items ? ` <b>${items.length}</b> total · <b>${live}</b> visible.` : ''}</div></div>
      <button class="btn btn-primary" data-ct="new" data-type="${type}" data-mode="${mode}" type="button">+ New ${G.noun}</button></div>
      ${items && items.length ? `<div class="toolbar"><label class="pc-selall"><input type="checkbox" data-ct-selall="${view}"> All</label><input class="field grow" type="search" placeholder="Search by title or pack" data-ct-search="${view}" autocomplete="off">
        <select class="field" data-ct-filter="${view}" aria-label="Filter"><option value="">All</option><option value="live">Visible</option><option value="draft">Hidden</option><option value="free">Free</option><option value="locked">Locked (paid plan)</option></select></div>
        <div class="pc-bulk" data-bulk="${view}" hidden><strong data-bulk-count></strong>
          <button class="btn btn-sm" data-bulk-do="show" type="button">Make visible</button><button class="btn btn-sm" data-bulk-do="hide" type="button">Hide</button>
          <select class="field" data-bulk-access style="width:auto"><option value="">Access…</option>${ACCESS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>
          <button class="btn btn-sm" data-bulk-do="pack" type="button">${mode === 'full' ? 'Move to pack…' : 'Set pack…'}</button>
          ${mode ? `<button class="btn btn-sm" data-bulk-do="move" data-to="${other}" type="button">Move to ${esc(otherName)}</button>` : ''}
          <button class="btn btn-sm btn-danger" data-bulk-do="delete" type="button">Remove</button><button class="btn btn-sm" data-bulk-do="clear" type="button">Clear</button></div>` : ''}
      ${items === null ? '<div class="empty">Loading…</div>' : items.length ? `<div class="pc-grid">${cards}</div><div class="muted sm" style="margin-top:10px">${mode === 'full' ? 'Packs (name, section, order, hide) are managed in <a href="#packs">Packs</a>. ' : ''}Lock / unlock whole packs in <a href="#access">Access</a>.</div>` : `<div class="empty">No cards yet. Press “+ New ${G.noun}” to add the first one.</div>`}</div>`;
    syncBulk(view);
  }
  function applyFilter(view) {
    const mount = $('#content-' + view); if (!mount) return;
    const q = ($('[data-ct-search="' + view + '"]', mount) || {}).value || ''; const f = ($('[data-ct-filter="' + view + '"]', mount) || {}).value || '';
    mount.querySelectorAll('tbody tr, .pc-card').forEach((tr) => { tr.hidden = !!((q && !tr.dataset.hay.includes(q.toLowerCase())) || (f && !tr.dataset.state.split(' ').includes(f))); });
  }
  /* ticked cards of one list -> the bulk bar shows how many and what can be done with them */
  function syncBulk(view) {
    const mount = $('#content-' + view); if (!mount) return; const bar = $('[data-bulk]', mount); if (!bar) return;
    const ids = [...mount.querySelectorAll('[data-ct-sel]')].filter((x) => x.checked).map((x) => x.dataset.ctSel);
    bar.hidden = !ids.length; $('[data-bulk-count]', bar).textContent = ids.length + ' selected';
    mount.querySelectorAll('[data-ct-sel]').forEach((x) => x.closest('.pc-card').classList.toggle('is-sel', x.checked));
    const all = $('[data-ct-selall]', mount); if (all) { const shown = [...mount.querySelectorAll('.pc-card:not([hidden]) [data-ct-sel]')]; all.checked = !!shown.length && shown.every((x) => x.checked); }
  }
  const viewOfEl = (el) => { const sec = el.closest('[id^="content-"]'); return sec ? sec.id.slice(8) : ''; };
  async function setAccess(ids, mode) {
    await api('/api/admin/access', { method: 'POST', body: JSON.stringify({ changes: ids.map((id) => ({ key: 'mat:' + id, mode })) }) });
  }
  /* Part <-> Full: the same test, moved to the other list (Reading also moves its passage text) */
  function switchMode(item, to) {
    const d = JSON.parse(JSON.stringify(item.data || {})); d.mode = to;
    if (item.type === 'reading') {
      if (to === 'full') { const ps = Array.isArray(d.passages) && d.passages.length ? d.passages : [{}, {}, {}]; if (!String((ps[0] || {}).passage || '').trim()) ps[0] = { title: item.title, passage: d.passage || '' }; d.passages = [0, 1, 2].map((k) => ps[k] || { title: '', passage: '' }); if (!d.durationMin || d.durationMin === 20) d.durationMin = 60; }
      else { if (!String(d.passage || '').trim()) d.passage = ((d.passages || [])[0] || {}).passage || ''; if (d.durationMin === 60) d.durationMin = 20; }
    }
    if (item.type === 'listening') { if (to === 'full' && (!d.durationMin || d.durationMin === 10)) d.durationMin = 30; if (to === 'part' && d.durationMin === 30) d.durationMin = 10; }
    return d;
  }
  async function bulk(view, action, value) {
    const mount = $('#content-' + view); const type = VIEW_FOR[view] || view;
    const ids = [...mount.querySelectorAll('[data-ct-sel]')].filter((x) => x.checked).map((x) => x.dataset.ctSel);
    if (!ids.length) return;
    if (action === 'clear') { ids.forEach((id) => selected.delete(id)); return renderType(type); }
    if (action === 'delete' && !confirm('Remove ' + ids.length + ' test(s)? Students will no longer see them.')) return;
    let pack = null;
    if (action === 'pack') { pack = prompt('Pack name for the ' + ids.length + ' selected test(s) (an existing pack, or a new name):\n' + packNames(type).join(', '), ''); if (pack === null) return; }
    if (action === 'access') { await setAccess(ids, value); toast(ids.length + ' test(s): ' + (ACCESS.find((x) => x[0] === value) || ['', value])[1]); }
    else {
      let done = 0;
      for (const id of ids) {
        toast((action === 'delete' ? 'Removing' : 'Saving') + ' ' + (done + 1) + ' / ' + ids.length + ' …');
        if (action === 'delete') await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'DELETE' });
        else if (action === 'show' || action === 'hide') await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ published: action === 'show' }) });
        else if (action === 'pack') await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ pack }) });
        else if (action === 'move') { const it = (await api('/api/admin/materials/' + encodeURIComponent(id))).item; await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ data: switchMode(it, value) }) }); }
        done++;
      }
      toast(done + ' test(s) ' + ({ delete: 'removed', show: 'visible now', hide: 'hidden', pack: 'moved to “' + pack + '”', move: 'moved' })[action]);
    }
    ids.forEach((id) => selected.delete(id));
    await loadType(type);
  }

  /* ───────── uploads (local disk, or straight to Supabase Storage on Vercel) ───────── */
  const isImg = (f) => /\.(png|jpe?g|webp|gif|avif)$/i.test(f.name);
  /* big photos are shrunk in the browser first: a 6 MB phone photo becomes a ~300 KB JPG, which uploads fast everywhere */
  async function shrinkImage(file) {
    if (!/\.(png|jpe?g|webp)$/i.test(file.name) || file.size < 900 * 1024 || !window.createImageBitmap) return file;
    try {
      const bmp = await createImageBitmap(file); const k = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp, 0, 0, c.width, c.height);
      const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.86));
      return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
    } catch (e) { return file; }
  }
  async function uploadToServer(file) {   // local disk, or (on Vercel) the database for pictures
    const fd = new FormData(); fd.append('type', /\.(mp3|wav|m4a|ogg|aac)$/i.test(file.name) ? 'audio' : /\.pdf$/i.test(file.name) ? 'pdf' : 'image'); fd.append('file', file, file.name);
    return (await api('/api/admin/uploads', { method: 'POST', body: fd })).url;
  }
  async function uploadFile(file) {
    if (isImg(file)) file = await shrinkImage(file);
    let meta;
    try { meta = await api('/api/admin/upload-url', { method: 'POST', body: JSON.stringify({ filename: file.name, size: file.size }) }); }
    catch (e) { if (isImg(file)) return uploadToServer(file); throw e; }   // storage not ready: pictures still work
    if (meta.local) return uploadToServer(file);
    const fd = new FormData(); fd.append('cacheControl', '3600'); fd.append('', file);
    let r = null, msg = '';
    try { r = await fetch(meta.uploadUrl, { method: 'PUT', body: fd, headers: { 'x-upsert': 'false' } }); if (!r.ok) { const j = await r.json().catch(() => ({})); msg = j.message || j.error || ('HTTP ' + r.status); } }
    catch (e) { msg = 'the browser could not reach Supabase Storage (' + (e.message || 'network') + ')'; }
    if (r && r.ok) return meta.publicUrl;
    if (isImg(file)) return uploadToServer(file);                         // fall back to the database
    throw new Error('Upload failed: ' + msg + '. You can also paste a link to the file instead.');
  }
  function pickAndUpload(accept, status) {
    return new Promise((resolve) => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept; inp.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(inp);                                      // a detached input can lose its change event in some browsers
      const done = (v) => { try { inp.remove(); } catch (e) { /* gone */ } resolve(v); };
      inp.addEventListener('cancel', () => done(null));
      inp.onchange = async () => {
        const f = inp.files && inp.files[0]; if (!f) return done(null);
        if (f.size > 100 * 1024 * 1024) { toast('File is larger than 100 MB.', true); return done(null); }
        uploading++; if (status) status.textContent = 'Uploading ' + f.name + ' …'; syncSave();
        try { const url = await uploadFile(f); if (status) status.textContent = ''; toast('Uploaded ' + f.name); done(url); }
        catch (e) { if (status) status.textContent = ''; fail(e); done(null); }
        finally { uploading--; syncSave(); }
      };
      inp.click();
    });
  }
  function syncSave() {
    const b = $('#cb-save'), pb = $('#cb-publish'); const ai = !!(draft && draft._ai);
    // a test made with the AI is saved as a Draft; publishing it is a separate, confirmed step
    if (b) { b.disabled = uploading > 0; b.textContent = uploading ? 'Uploading…' : ai ? 'Save draft' : (editingId ? 'Save changes' : 'Create'); b.classList.toggle('btn-primary', !ai); }
    if (pb) { pb.hidden = !ai; pb.disabled = uploading > 0; }
  }

  /* ───────── writing chart: "Years: 1961, 1971 …" + one "Name: 10, 30 …" line per series ───────── */
  const chartToText = (c) => (c && c.years ? ['Years: ' + c.years.join(', ')].concat(c.series.map((s) => s.name + ': ' + s.values.join(', '))).join('\n') : '');
  function parseChart(text, unit) {
    const rows = String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);
    if (!rows.length) return { chart: null };
    const parsed = rows.map((l) => { const i = l.indexOf(':'); return i < 0 ? null : [l.slice(0, i).trim(), l.slice(i + 1).split(/[,;\t]/).map((x) => x.trim()).filter((x) => x !== '')]; });
    if (parsed.some((r) => !r)) return { error: 'Every chart line needs a colon, e.g. "No car: 70, 39, 30".' };
    const [, years] = parsed[0];
    if (years.length < 2 || parsed.length < 2) return { error: 'The chart needs a Years line and at least one data line.' };
    const series = parsed.slice(1).map(([name, vals]) => ({ name, values: vals.map(Number) }));
    const bad = series.find((s) => s.values.length !== years.length || s.values.some((v) => !Number.isFinite(v)));
    if (bad) return { error: `"${bad.name}" must have ${years.length} numbers, one per year.` };
    return { chart: { type: 'line', unit: unit || '', years, series } };
  }

  /* ───────── article words: find them in the text the same way the article page does ───────── */
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function inText(phrase) {
    phrase = String(phrase || '').replace(/^["“]|["”]$/g, '').trim(); if (phrase.length < 2 || !draft) return false;
    const body = reEsc(phrase).replace(/\s+/g, '\\s+').replace(/['’‘]/g, "['’‘]").replace(/["“”]/g, '["“”]');
    try { return new RegExp('(^|[^\\p{L}\\p{N}])' + body + '(?![\\p{L}\\p{N}])', 'iu').test(String(draft.data.body || '')); } catch (e) { return false; }
  }
  const vFound = (v) => inText(v.match) || inText(v.word);
  const gFound = (g) => inText(g.match) || (String(g.sourceContext || '').length <= 140 && inText(g.sourceContext));
  const foundPill = (ok, missing) => `<span class="cb-found ${ok ? 'ok' : 'miss'}">${ok ? '✓ underlined in the text' : missing}</span>`;
  function refreshFound() {
    if (!draft || draft.type !== 'article') return;
    (draft.data.vocabulary || []).forEach((v, i) => { const el = document.getElementById('vf-' + i); if (el) el.outerHTML = foundPill(vFound(v), '⚠ not in the text — fill “Underline”').replace('<span', `<span id="vf-${i}"`); });
    (draft.data.grammar || []).forEach((g, i) => { const el = document.getElementById('gf-' + i); if (el) el.outerHTML = foundPill(gFound(g), 'not underlined (still in the list)').replace('<span', `<span id="gf-${i}"`); });
  }
  const blankV = () => ({ word: '', match: '', definition: '', definition_uz: '', definition_ru: '', synonyms: '', example: '', sourceContext: '' });
  const blankG = () => ({ title: '', match: '', pattern: '', explanation: '', explanation_uz: '', explanation_ru: '', example: '', sourceContext: '' });
  const splitRow = (l) => l.split(l.includes('\t') ? '\t' : '|').map((x) => x.trim());
  // one word per line: word | definition | o'zbekcha | русский | synonyms | example   (or a JSON list, e.g. the reviewItems of an old article)
  function parseBulk(text, kind) {
    text = text.trim(); if (!text) return { vocab: [], grammar: [] };
    if (/^[[{]/.test(text)) {
      let arr = JSON.parse(text); if (!Array.isArray(arr)) arr = arr.reviewItems || arr.vocabulary || [];
      const vocab = [], grammar = [];
      arr.forEach((x) => {
        if (!x || typeof x !== 'object') return;
        const syn = Array.isArray(x.synonyms) ? x.synonyms.join(', ') : x.synonyms || '';
        if (x.type === 'grammar' || (!x.word && (x.pattern || x.explanation))) grammar.push({ ...blankG(), ...pick(x, blankG()) });
        else vocab.push({ ...blankV(), ...pick(x, blankV()), word: x.word || x.title || '', synonyms: syn });
      });
      return { vocab, grammar };
    }
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (kind === 'grammar') {
      return { vocab: [], grammar: lines.map(splitRow).map(([title, pattern, explanation, uz, ru, example, match]) =>
        ({ ...blankG(), title: title || '', pattern: pattern || '', explanation: explanation || '', explanation_uz: uz || '', explanation_ru: ru || '', example: example || '', match: match || '' })) };
    }
    return { grammar: [], vocab: lines.map(splitRow).map(([word, definition, uz, ru, synonyms, example]) =>
      ({ ...blankV(), word: word || '', definition: definition || '', definition_uz: uz || '', definition_ru: ru || '', synonyms: synonyms || '', example: example || '' })) };
  }
  const pick = (src, shape) => Object.keys(shape).reduce((o, k) => { if (src[k] != null) o[k] = String(src[k]); return o; }, {});

  /* ───────── builder ───────── */
  const blankQ = (type, passage) => ({ type: type || (draft && draft.type === 'listening' ? 'gap' : 'short'), passage: passage || 1, group: '', blockTitle: '', title: '', prompt: '', options: [], answer: '', explanation: '' });
  const blankPassages = () => [{ title: '', passage: '' }, { title: '', passage: '' }, { title: '', passage: '' }];
  const blankTask = (n) => ({ title: 'Task ' + n, kind: n === 1 ? 'task1' : 'task2', prompt: '', imageUrl: '', chartText: '', chartUnit: '', minWords: n === 1 ? 150 : 250, minutes: n === 1 ? 20 : 40, sample: '' });
  /* the three speaking parts: title, preparation and speaking time (a Part practice card usually has only one of them) */
  const SPEAK_PARTS = {
    1: { title: 'Part 1 · Introduction and interview', prepSeconds: 0, speakSeconds: 0 },
    2: { title: 'Part 2 · Long turn (cue card)', prepSeconds: 60, speakSeconds: 120 },
    3: { title: 'Part 3 · Discussion', prepSeconds: 0, speakSeconds: 0 }
  };
  const blankPart = (n) => ({ ...SPEAK_PARTS[n], prompt: '', questions: [], imageUrl: '', audioUrl: '', sample: '' });
  const speakNo = (t) => { const m = /part\s*([123])/i.exec(String((t && t.title) || '')); return m ? Number(m[1]) : 0; };
  function blank(type, mode) {
    if (type === 'article') {
      return { type, title: '', pack: '', description: '', premium: false, published: true,
        data: { topic: '', level: 'Passage 1', category: 'Academic Reading', lead: '', author: 'IELTSX Reading Team', date: today(), testDate: '', imageUrl: '', imageAlt: '', body: '', source: '', vocabulary: [blankV()], grammar: [] } };
    }
    const full = mode === 'full';
    const data = { durationMin: type === 'writing' ? (full ? 60 : 20) : type === 'listening' ? (full ? 30 : 10) : type === 'reading' ? (full ? 60 : 20) : 60, instructions: '', images: [] };
    if (MODE_TYPES.includes(type)) data.mode = full ? 'full' : 'part';
    if (type === 'reading') Object.assign(data, { coverUrl: '', passageLabel: 'Passage 1', cardTypes: [], passage: '', passages: blankPassages(), questions: [blankQ()] });
    if (type === 'listening') Object.assign(data, { audioUrl: '', audioStart: 0, audioEnd: 0, transcript: '', coverUrl: '', sectionLabel: 'Section 1', cardTypes: [], questions: [blankQ('gap')] });
    if (type === 'pdf') { Object.assign(data, { fileUrl: '', coverUrl: '', category: 'reading', badge: 'PDF', corner: '', pages: 0, tags: [] }); delete data.instructions; delete data.images; }
    if (type === 'speaking') data.parts = full ? [blankPart(1), blankPart(2), blankPart(3)] : [blankPart(1)];
    if (type === 'writing') Object.assign(data, { coverUrl: '', tier: 'Tier 1', cardTypes: [], tasks: full ? [blankTask(1), blankTask(2)] : [blankTask(1)] });
    return { type, title: '', pack: '', description: '', premium: false, published: true, data };
  }
  let PACKS = {};                                       // pack names of the Full Tests pages, per skill (filled by loadRules)
  const packNames = (type) => PACKS[type] || [];
  /* ───────── unsaved work is kept in this browser: a closed tab, a lost connection or a failed save never loses a test ───────── */
  const AUTOSAVE = 'ixadmin-draft-v1';
  const draftKey = () => (editingId ? 'edit:' + editingId : 'new:' + draft.type + ':' + (draft.data.mode || ''));
  function autosave() {
    if (!draft) return; clearTimeout(autosave.t);
    autosave.t = setTimeout(() => { try { if (draft) localStorage.setItem(AUTOSAVE, JSON.stringify({ key: draftKey(), at: Date.now(), draft })); } catch (e) { /* storage full or blocked */ } }, 500);
  }
  function savedDraft(key) {
    try { const s = JSON.parse(localStorage.getItem(AUTOSAVE) || 'null'); return s && s.key === key && Date.now() - s.at < 14 * 86400000 ? s : null; } catch (e) { return null; }
  }
  function dropAutosave() { clearTimeout(autosave.t); try { localStorage.removeItem(AUTOSAVE); } catch (e) { /* blocked */ } }
  function openBuilder(type, item, mode, opts) {
    opts = opts || {};
    loadRules().then(() => { const dl = document.getElementById('ix-pack-list'); if (dl && draft) dl.innerHTML = packNames(draft.type).map((n) => `<option value="${esc(n)}"></option>`).join(''); const pk = document.getElementById('cb-pack-picks'); if (pk && draft) pk.outerHTML = packPicks(); });
    editingId = item ? item.id : null;
    if (impDoc) { impDoc.close(); impDoc = null; }
    draft = item ? JSON.parse(JSON.stringify(item)) : blank(type, mode);
    draft.data = draft.data || {};
    if (MODE_TYPES.includes(draft.type)) draft.data.mode = draft.data.mode === 'full' ? 'full' : 'part';
    if (!draft._access) draft._access = item ? accessOf(item) : 'free';   // Free / Standard / Max / Ultra (saving re-applies it)
    const old = opts.fresh ? null : savedDraft(draftKey());   // a test handed over by the AI Test Generator starts clean
    if (old && old.draft && old.draft.type === draft.type && confirm('You have unsaved work on “' + (old.draft.title || 'Untitled') + '” from ' + new Date(old.at).toLocaleString() + '.\n\nOK = continue it    Cancel = start ' + (editingId ? 'from the saved version' : 'a new one'))) {
      draft = old.draft; draft.data = draft.data || {};
    } else if (old) dropAutosave();
    if (draft.type === 'article') {
      const d = draft.data;
      // older admin articles kept the cover in coverUrl, the level in passageLabel and the lead in the description
      if (!d.imageUrl && d.coverUrl) d.imageUrl = d.coverUrl;
      if (!d.level && d.passageLabel) d.level = d.passageLabel;
      if (!d.lead && draft.description) d.lead = draft.description;
      d.vocabulary = (d.vocabulary || []).map((v) => ({ ...blankV(), ...v, synonyms: Array.isArray(v.synonyms) ? v.synonyms.join(', ') : v.synonyms || '' }));
      d.grammar = (d.grammar || []).map((g) => ({ ...blankG(), ...g }));
      if (!d.vocabulary.length) d.vocabulary.push(blankV());
    } else draft.data.images = draft.data.images || [];
    if (draft.type === 'reading') { draft.data.mode = draft.data.mode === 'full' ? 'full' : 'part'; const ps = Array.isArray(draft.data.passages) ? draft.data.passages : []; draft.data.passages = [0, 1, 2].map((k) => ps[k] || { title: '', passage: '' }); }
    if ((draft.type === 'reading' || draft.type === 'listening') && !Array.isArray(draft.groups)) { draft.groups = toGroups(draft.data.questions || []); }   // a restored draft keeps its groups
    if (draft.type === 'speaking' && !(draft.data.parts || []).length) draft.data.parts = blank('speaking', draft.data.mode).data.parts;
    if (draft.type === 'writing') {
      if (!(draft.data.tasks || []).length) draft.data.tasks = blank('writing', draft.data.mode).data.tasks;
      draft.data.tasks.forEach((t, i) => { t.kind = t.kind || (i === 0 ? 'task1' : 'task2'); if (t.chartText === undefined) t.chartText = chartToText(t.chart); if (t.chartUnit === undefined) t.chartUnit = (t.chart && t.chart.unit) || ''; });
    }
    $('#builder-title').textContent = (editingId ? 'Edit ' : 'New ') + (MODE_TYPES.includes(draft.type) ? GRID[viewOf(draft.type, draft.data.mode)].noun : NOUN[draft.type]);
    renderBuilder(); $('#builder').classList.add('open'); $('#builder-body').scrollTop = 0;
  }
  function closeBuilder() {
    if (uploading && !confirm('A file is still uploading. Close anyway?')) return;
    if (draft && savedDraft(draftKey())) toast('Not saved yet — your work is kept in this browser and offered the next time you open this form.');
    $('#builder').classList.remove('open'); draft = null; editingId = null;
    if (impDoc) { impDoc.close(); impDoc = null; }
  }

  const field = (label, path, val, extra = '') => `<label class="lbl">${label}<input class="field" data-p="${path}" value="${esc(val)}" ${extra}></label>`;
  const area = (label, path, val, rows, extra = '') => `<label class="lbl">${label}<textarea class="field" rows="${rows}" data-p="${path}" ${extra}>${esc(val)}</textarea></label>`;
  function imagesBlock(label, help) {
    const imgs = draft.data.images || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>${label}</strong><div class="muted sm">${help}</div></div><button class="btn btn-sm" data-cb="img-add" type="button">⬆ Upload picture</button></div><div class="muted sm" id="img-status"></div>
      <div class="cb-images">${imgs.map((im, i) => `<div class="cb-img"><img src="${esc(im.url)}" alt=""><input class="field" placeholder="Caption (optional)" data-p="data.images.${i}.caption" value="${esc(im.caption)}">${isMultiSection() ? passSelect(`data.images.${i}.passage`, im.passage) : ''}<button class="btn btn-sm btn-danger" data-cb="img-del" data-i="${i}" type="button">Remove</button></div>`).join('')}</div></div>`;
  }
  /* what a Full test is and where students find it (all four skills) */
  const FULL_INFO = {
    reading: ['Full reading test · 3 passages · 40 questions · 60 minutes', () => `Opens like the Full Reading Test pages, at <code>/full-tests/reading/test-${esc(draft.data.no || 'N')}</code>.`],
    listening: ['Full listening test · Parts 1–4 · 40 questions · 30 minutes', () => 'One recording for the whole paper. Give every question group its <b>Part</b> (1–4); the numbers run 1–40. Opens at <code>/exam/listening/…</code> on the same listening screen as the sections.'],
    writing: ['Full writing test · Task 1 + Task 2 · 60 minutes', () => 'Both tasks in one exam screen (Part 1, Part 2 in the bottom bar), one timer, the overall Writing band at the end.'],
    speaking: ['Full speaking test · Parts 1, 2 and 3', () => 'Part 1 questions, the Part 2 cue card with its timers, Part 3 discussion — one after another.']
  };
  function fullBlock(t) {
    const [head, more] = FULL_INFO[t] || FULL_INFO.reading;
    return `<div class="cb-block cb-fullinfo"><strong>${head}</strong><div class="muted sm">Listed on the <b>Full ${esc(TYPES[t])}</b> page inside the pack you choose in <b>Pack</b> below. ${more()}</div></div>`;
  }
  /* existing packs as one-click chips under the Pack field (a new name creates a new pack card) */
  function packPicks() {
    const names = packNames(draft.type); if (!names.length) return '<div id="cb-pack-picks"></div>';
    return `<div id="cb-pack-picks" class="cb-picks"><span class="muted sm">Packs:</span>${names.map((n) => `<button class="chip${String(draft.pack || '').toLowerCase() === n.toLowerCase() ? ' chip-ok' : ''}" data-cb="pack-pick" data-name="${esc(n)}" type="button">${esc(n)}</button>`).join('')}</div>`;
  }
  function readingFormatBlock() {
    const full = draft.data.mode === 'full';
    if (full) return fullBlock('reading');
    const d = draft.data;
    return `<div class="cb-block"><div class="cb-head"><div><strong>Card on the Reading practice page</strong><div class="muted sm">The card looks exactly like the other cards: picture, passage tag, question-type chips and the pack line. The test opens like pessages/test-19, 20, 21, at <code>/pessages/test-${esc(d.no || 'N')}</code>.</div></div>
      <button class="btn btn-sm" data-cb="card-img" type="button">⬆ ${d.coverUrl ? 'Replace picture' : 'Upload picture'}</button></div><div class="muted sm" id="card-img-status"></div>
      ${d.coverUrl ? `<div class="cb-images"><div class="cb-img"><img src="${esc(d.coverUrl)}" alt=""><button class="btn btn-sm btn-danger" data-cb="card-img-del" type="button">Remove</button></div></div>` : ''}
      <div class="cb-grid"><label class="lbl">Passage (card tag; Passage 2 = Questions 14–26, Passage 3 = 27–40)<select class="field" data-p="data.passageLabel" data-rerender="1">${['Passage 1', 'Passage 2', 'Passage 3'].map((x) => `<option ${d.passageLabel === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label class="lbl">Question types on the card (comma separated; empty = taken from the questions)<input class="field" data-p="data.cardTypes" data-csv="1" value="${esc((d.cardTypes || []).join(', '))}" placeholder="True False Not Given, Sentence Completion"></label></div></div>`;
  }
  /* the card picture + chips of a Listening / Writing / PDF card (the Reading card block is readingFormatBlock) */
  function cardBlock(t, d) {
    if (t !== 'listening' && t !== 'writing' && t !== 'pdf') return '';
    if (d.mode === 'full') return fullBlock(t);   // a full test has no card on the practice page: it is listed in its pack
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
  /* which passage (full reading, 1-3) or which part (full listening, 1-4) a group / picture belongs to */
  const passSelect = (path, cur) => { const L = draft.type === 'listening'; return `<select class="field" style="width:auto" data-p="${path}" data-num="1" data-rerender="1" title="${L ? 'Which part?' : 'Which passage?'}">${(L ? [1, 2, 3, 4] : [1, 2, 3]).map((n) => `<option value="${n}" ${Number(cur || 1) === n ? 'selected' : ''}>${L ? 'Part' : 'Passage'} ${n}</option>`).join('')}</select>`; };
  /* ═════════ Question GROUPS ═════════
     A group = one block of the paper ("Questions 1–5 …"): ONE type, ONE heading, ONE option list (for matching / map / word box) and its questions.
     The data saved on the server stays a flat list of questions (each carries its group heading, its options and a group number "gi"),
     so the player and the old tests do not change. toGroups() / flatten() convert between the two. */
  const SHARED_OPTS = ['matching', 'map', 'box'];                 // option list typed ONCE per group
  const isFullReading = () => !!draft && draft.type === 'reading' && draft.data.mode === 'full';
  const isFullListening = () => !!draft && draft.type === 'listening' && draft.data.mode === 'full';
  const isMultiSection = () => isFullReading() || isFullListening();   // groups carry a Passage 1-3 / Part 1-4 and are numbered in that order
  const gLetters = (a) => String(a || '').toUpperCase().split(/[^A-Z]+/).filter(Boolean);
  const ROMANS = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i;
  const optToken = (o, i) => { const m = /^\s*([A-Za-z0-9]{1,5})\s*[.):]\s+([\s\S]*)$/.exec(String(o || '')); return m ? { l: m[1], t: m[2] } : { l: /^[A-Za-z]$/.test(String(o || '').trim()) ? String(o).trim() : String.fromCharCode(65 + i), t: String(o || '').trim() }; };
  const newItem = () => ({ prompt: '', answer: '', explanation: '', evidence: '', title: '', options: [] });
  const newGroup = (type, passage) => ({ type, passage: passage || 1, group: '', blockTitle: '', table: '', options: [], items: type === 'table' ? [] : [newItem()] });
  const normType = (t) => (draft && draft.type === 'listening' ? (LQ_LABEL[t] ? t : 'gap') : (Q_LABEL[t] ? t : 'short'));
  /* how many numbers of the paper one question uses: a "choose TWO" question uses two. Before its answer is in, the
     width comes from the block it was pasted with (w: "Choose TWO letters" / Questions 21–22). */
  const itemWidth = (g, it) => (g.type === 'mcq-multi' ? Math.max(draft.type === 'listening' ? 2 : 1, gLetters(it.answer).length, Number(it.w) || 1) : 1);

  /* ═════════ Table completion ═════════
     The table is typed ONCE for the group: the first line is the column headings, then one row per line, cells split
     by | (or a tab), and ____ for each gap. The questions of the group are its gaps, in reading order (row by row,
     left to right); each one only needs its answer (and explanation). */
  const TABLE_GAP = /_{2,}|\.{4,}|…{2,}/;
  const tableRows = (t) => String(t || '').replace(/\r/g, '').split('\n').map((l) => l.trim()).filter(Boolean)
    .map((l) => l.replace(/^\|\s*|\s*\|$/g, '').split(/\s*\|\s*|\t+/).map((c) => c.trim()));
  /* the cell text of every gap below the heading line: "Rapid ____" */
  function tableGaps(t) {
    const out = [];
    tableRows(t).slice(1).forEach((row) => row.forEach((c) => {
      const parts = c.split(new RegExp(TABLE_GAP.source, 'g'));
      for (let k = 0; k < parts.length - 1; k++) out.push(parts.map((p, j) => p + (j < parts.length - 1 ? (j === k ? '____' : '…') : '')).join('').trim());
    }));
    return out;
  }
  /* one question per gap: answers stay with their gap; the question text is the gap's cell (so it is never empty) */
  function syncTable(g) {
    const gaps = tableGaps(g.table);
    while (g.items.length < gaps.length) g.items.push(newItem());
    if (g.items.length > gaps.length) g.items.length = gaps.length;
    g.items.forEach((it, k) => { it.prompt = gaps[k]; it.options = []; });
  }
  /* a table pasted from a PDF / Word: "32 ………", "(32) ____" become ____; cells split by |, tabs or (no other sign) 2+ spaces */
  function tableFromText(lines) {
    const raw = lines.map((l) => String(l || '').replace(/\(?\b\d{1,2}\b\)?\s*(?:\.{3,}|…+|_{2,})|(?:\.{3,}|…+|_{2,})\s*\(?\b\d{1,2}\b\)?|_{2,}|\.{4,}|…{2,}/g, '____').trim()).filter(Boolean);
    const marked = raw.some((l) => /\||\t/.test(l));
    return raw.map((l) => (marked ? l.replace(/\t+/g, ' | ') : l.split(/\s{2,}/).join(' | '))).join('\n');
  }

  function toGroups(qs) {
    const gs = []; let cur = null;
    (qs || []).forEach((q) => {
      const type = normType(q.type); const hasGi = q.gi !== undefined && q.gi !== null && q.gi !== '';
      const g = String(q.group || '').trim(); const shared = SHARED_OPTS.includes(type); const opts = Array.isArray(q.options) ? q.options : [];
      const pass = Number(q.passage) || 1;
      const same = cur && cur.type === type && pass === cur.passage && (hasGi ? q.gi === cur._gi : (!g || g === cur.group)) && (!shared || !opts.length || !cur.options.length || JSON.stringify(opts) === JSON.stringify(cur.options));
      if (!same) { cur = { type, passage: pass, group: g, blockTitle: q.blockTitle || '', table: String(q.table || ''), options: [], items: [], _gi: hasGi ? q.gi : undefined }; gs.push(cur); }
      if (shared && !cur.options.length && opts.length) cur.options = opts.slice();
      if (!cur.group && g) cur.group = g; if (!cur.blockTitle && q.blockTitle) cur.blockTitle = q.blockTitle;
      cur.items.push({ prompt: q.prompt || '', answer: q.answer || '', explanation: q.explanation || '', evidence: q.evidence || '', title: q.title || '', options: shared ? [] : opts.slice(), origin: q.origin, at: q.at });
    });
    return gs;
  }
  function normAnswer(type, a) {
    a = String(a == null ? '' : a).trim(); const A = a.toUpperCase().replace(/[\s_-]+/g, ' ');
    if (type === 'tfng') return ({ T: 'TRUE', TRUE: 'TRUE', F: 'FALSE', FALSE: 'FALSE', NG: 'NOT GIVEN', N: 'NOT GIVEN', 'NOT GIVEN': 'NOT GIVEN', NOTGIVEN: 'NOT GIVEN' })[A] || A;
    if (type === 'ynng') return ({ Y: 'YES', YES: 'YES', N: 'NO', NO: 'NO', NG: 'NOT GIVEN', 'NOT GIVEN': 'NOT GIVEN', NOTGIVEN: 'NOT GIVEN' })[A] || A;
    if (type === 'mcq') return (gLetters(a)[0] || '');
    if (type === 'mcq-multi') return gLetters(a).join(',');
    if (type === 'matching' || type === 'map') return ROMANS.test(a) ? a.toLowerCase() : (/^[A-Za-z]$/.test(a) ? a.toUpperCase() : a);
    return a;
  }
  const orderedGroups = () => { const gs = draft.groups || []; const idx = gs.map((_, i) => i); if (isMultiSection()) idx.sort((a, b) => (gs[a].passage - gs[b].passage) || (a - b)); return idx; };
  function flatten(gs) {
    const out = []; const idx = (gs || []).map((_, i) => i);
    if (isMultiSection()) idx.sort((a, b) => (gs[a].passage - gs[b].passage) || (a - b));
    idx.forEach((i, n) => { const g = gs[i]; const shared = SHARED_OPTS.includes(g.type);
      g.items.forEach((it) => out.push({ type: g.type, passage: g.passage || 1, gi: n, group: String(g.group || '').trim(), blockTitle: String(g.blockTitle || '').trim(), table: g.type === 'table' ? String(g.table || '').trim() : undefined, title: String(it.title || '').trim(), prompt: String(it.prompt || '').trim(),
        options: (shared ? g.options : it.options || []).map((o) => String(o).trim()).filter(Boolean), answer: normAnswer(g.type, it.answer), explanation: String(it.explanation || '').trim(), evidence: String(it.evidence || '').trim(),
        origin: it.origin === 'ai' || it.origin === 'source' ? it.origin : undefined, at: Number(it.at) > 0 ? Number(it.at) : undefined })); });   // where an AI-made question came from, when an answer is heard
    return out;
  }
  function numbering() {
    const gs = draft.groups || []; const map = {}; let n = 1;
    if (draft.type === 'listening' && !isFullListening()) { const part = parseInt(String(draft.data.sectionLabel || '').replace(/\D+/g, ''), 10) || 1; n = (part - 1) * 10 + 1; }
    // a Reading Part test is numbered like its passage in the paper: Passage 2 = Questions 14–26, Passage 3 = 27–40 (reading-exam.js does the same)
    if (draft.type === 'reading' && !isFullReading()) n = ({ 2: 14, 3: 27 })[parseInt(String(draft.data.passageLabel || '').replace(/\D+/g, ''), 10)] || 1;
    // a group added by its numbers ("Questions 14–26" before 1–13 is in) keeps them: the numbers before it stay free
    orderedGroups().forEach((i) => { const g = gs[i]; if (Number(g.start) > n) n = Number(g.start); const from = n;
      g.items.forEach((it) => { n += itemWidth(g, it); });
      map[i] = { from, to: Math.max(from, n - 1) }; });
    return map;
  }
  /* every question with its number: [{ gi, ii, g, it, n, w }] in the order of the paper */
  function numberedItems() {
    const gs = draft.groups || []; const num = numbering(); const out = [];
    orderedGroups().forEach((gi) => { const g = gs[gi]; let n = num[gi].from; g.items.forEach((it, ii) => { const w = itemWidth(g, it); out.push({ gi, ii, g, it, n, w }); n += w; }); });
    return out;
  }

  /* ───────── checks before saving: every problem listed at once ───────── */
  function validate() {
    const out = []; const gs = draft.groups || []; const num = numbering(); const L = draft.type === 'listening';
    const err = (m, g) => out.push({ level: 'error', msg: m, g }); const warn = (m, g) => out.push({ level: 'warn', msg: m, g });
    let total = 0; const perPass = { 1: 0, 2: 0, 3: 0, 4: 0 };
    gs.forEach((g, gi) => {
      const where = 'Group ' + (gi + 1) + ' (' + (qLabels()[g.type] || g.type).split(':')[0] + ')'; const shared = SHARED_OPTS.includes(g.type);
      const filled = g.items.filter((it) => String(it.prompt || '').trim() || String(it.answer || '').trim());
      if (!filled.length) { warn(where + ' is empty and will be left out.', gi); return; }
      if (g.type === 'table') {
        const rows = tableRows(g.table);
        if (rows.length < 2) err(where + ': type the table — the column headings on the first line, then one row per line, cells split by |.', gi);
        else if (!tableGaps(g.table).length) err(where + ': the table has no gap. Write ____ in each cell where an answer goes.', gi);
        if (rows.length && rows[0].some((c) => TABLE_GAP.test(c))) warn(where + ': the first line of the table is its column headings; a ____ there is not a question.', gi);
      }
      if (shared) {
        const ot = (g.options || []).filter(Boolean);
        if (ot.length < 2) err(where + ': type the option list (at least 2 lines) once, at the top of the group.', gi);
      }
      let n = num[gi] ? num[gi].from : 1;
      g.items.forEach((it) => {
        const has = String(it.prompt || '').trim(), ans = String(it.answer || '').trim(); const q = 'Question ' + n;
        if (!has && !ans) return;
        // a "choose TWO" question uses two numbers of the paper
        const width = itemWidth(g, it);
        total += width; perPass[g.passage || 1] += width;
        if (!has) err(q + ' (' + where + '): the question text is empty.', gi);
        else if (!ans) err(q + ' (' + where + '): no correct answer.', gi);
        else {
          const A = normAnswer(g.type, ans);
          if (g.type === 'tfng' && !['TRUE', 'FALSE', 'NOT GIVEN'].includes(A)) err(q + ': the answer must be TRUE, FALSE or NOT GIVEN (now “' + ans + '”).', gi);
          if (g.type === 'ynng' && !['YES', 'NO', 'NOT GIVEN'].includes(A)) err(q + ': the answer must be YES, NO or NOT GIVEN (now “' + ans + '”).', gi);
          if (g.type === 'mcq' || g.type === 'mcq-multi') {
            const ot = (it.options || []).filter(Boolean); const need = ot.length;
            if (need < 2) err(q + ': multiple choice needs the options (one per line).', gi);
            else { const lt = gLetters(A); const maxL = String.fromCharCode(64 + need);
              if (!lt.length) err(q + ': write the letter of the right option (A, B, C…).', gi);
              else if (lt.some((x) => x > maxL)) err(q + ': answer ' + lt.join(',') + ' is not among the ' + need + ' options.', gi);
              if (g.type === 'mcq-multi' && lt.length < 2) err(q + ': “choose two” needs two letters, e.g. A,C.', gi); }
          }
          if (shared && (g.options || []).length >= 2) {
            const toks = (g.options || []).map(optToken).map((k) => k.l.toLowerCase());
            if (g.type !== 'box' && !toks.includes(String(A).toLowerCase())) warn(q + ' (' + where + '): answer “' + ans + '” is not in the option list.', gi);
            if (g.type === 'box' && !(g.options || []).some((o) => String(o).trim().toLowerCase() === ans.toLowerCase())) warn(q + ' (' + where + '): answer “' + ans + '” is not one of the words of the box.', gi);
          }
          if (L && (g.type === 'gap' || g.type === 'box') && !/_{2,}|\.{4,}|…/.test(has)) warn(q + ' (' + where + '): write ____ where the answer goes, so the student sees the gap.', gi);
        }
        n += itemWidth(g, it);
      });
      if (isFullReading() && !String(((draft.data.passages || [])[(g.passage || 1) - 1] || {}).passage || '').trim()) err(where + ' belongs to Passage ' + (g.passage || 1) + ', but that passage has no text.', gi);
    });
    // numbers still missing: a block added by its numbers while the one before it is not in yet
    let expect = null;
    orderedGroups().forEach((gi) => {
      const g = gs[gi]; if (!g.items.some((it) => String(it.prompt || '').trim() || String(it.answer || '').trim())) return; const r = num[gi];
      if (expect !== null && r.from > expect) err('Questions ' + expect + (r.from - 1 > expect ? '–' + (r.from - 1) : '') + ' are missing: add them in “1 · Questions” (saved as it is, the numbers after them would move up).', gi);
      expect = r.to + 1;
    });
    if (!total) err('Add at least one question with its answer.');
    if (isFullReading() && total && total !== 40) warn('A full reading paper normally has 40 questions; this one has ' + total + ' (Passage 1: ' + perPass[1] + ', 2: ' + perPass[2] + ', 3: ' + perPass[3] + ').');
    if (isFullListening() && total && total !== 40) warn('A full listening paper normally has 40 questions (10 in each part); this one has ' + total + ' (Part 1: ' + perPass[1] + ', 2: ' + perPass[2] + ', 3: ' + perPass[3] + ', 4: ' + perPass[4] + ').');
    if (L && !isFullListening() && total && total !== 10 && total <= 40 && (draft.data.sectionLabel || '').startsWith('Section')) warn('A listening section normally has 10 questions; this one has ' + total + '.');
    return out;
  }
  function issuesHtml(list) {
    if (!list) return '';
    if (!list.length) return '<div class="cb-issues ok">✓ No problems found. Everything is ready to save.</div>';
    const er = list.filter((x) => x.level === 'error'), wr = list.filter((x) => x.level === 'warn');
    return `<div class="cb-issues ${er.length ? 'bad' : 'warn'}"><strong>${er.length ? er.length + ' thing(s) to fix before saving' : 'Saved is possible, but please look at this'}${er.length && wr.length ? ' · ' + wr.length + ' note(s)' : ''}</strong><ul>${list.map((x) => `<li class="${x.level}">${x.level === 'error' ? '✕' : '!'} ${esc(x.msg)}</li>`).join('')}</ul></div>`;
  }
  function showIssues(list, scroll) { const box = $('#cb-issues'); if (!box) return; box.innerHTML = issuesHtml(list); if (scroll) box.scrollIntoView({ block: 'center', behavior: 'smooth' }); }

  /* ───────── the builder block ───────── */
  const GROUP_HINT = {
    short: 'Question text with ____ where the answer goes. Answer = the word(s). Several accepted answers: colour|color.',
    completion: 'One line of the notes / table / flow-chart with ____ where the answer goes.',
    tfng: 'The statement. Answer: TRUE, FALSE or NOT GIVEN (T / F / NG also work).',
    ynng: 'The statement. Answer: YES, NO or NOT GIVEN (Y / N / NG also work).',
    mcq: 'The question, then its options (one per line) and the letter of the right one.',
    'mcq-multi': 'The question, its options, and the letters of ALL right answers, e.g. A,C.',
    matching: 'List the options / headings ONCE above. Each question is only the item (e.g. Paragraph A) and its letter / number.',
    map: 'List the letters of the map ONCE above (A, B, C…). Each question is the place name and its letter.',
    gap: 'One line of the notes with ____ where the answer goes.',
    box: 'List the words of the box ONCE above. Each question is a line with ____ and the right word.',
    table: 'Type the table ONCE above (cells split by |, ____ for each gap). Every gap is one question: only its answer is needed.'
  };
  const SHARED_LABEL = { matching: 'Options / headings of this group (typed ONCE, one per line, each with its letter or number)', map: 'Letters on the map (typed ONCE, one per line: A, B, C…)', box: 'Words of the box (typed ONCE, one per line)' };
  const SHARED_PH = { matching: 'A. Paragraph A\nB. Paragraph B\n…   or   i. The cost of change\nii. A new approach', map: 'A\nB\nC\nD\nE\nF\nG\nH', box: 'bridge\ngarden\nmuseum' };
  function answerCell(g, gi, it, ii) {
    const p = `groups.${gi}.items.${ii}.answer`; const v = it.answer || '';
    const sel = (list) => `<select class="field" data-p="${p}"><option value="">Answer…</option>${list.map((x) => `<option ${String(x).toUpperCase() === String(v).toUpperCase() ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
    if (g.type === 'tfng') return sel(['TRUE', 'FALSE', 'NOT GIVEN']);
    if (g.type === 'ynng') return sel(['YES', 'NO', 'NOT GIVEN']);
    if (g.type === 'matching' || g.type === 'map') { const toks = (g.options || []).map(optToken).map((k) => k.l); if (toks.length >= 2) return sel(toks); }
    if (g.type === 'box') { const ws = (g.options || []).map((o) => String(o).trim()).filter(Boolean); if (ws.length >= 2) return sel(ws); }
    return `<input class="field" data-p="${p}" value="${esc(v)}" placeholder="${g.type === 'mcq' ? 'Letter, e.g. B' : g.type === 'mcq-multi' ? 'Letters, e.g. A,C' : g.type === 'matching' || g.type === 'map' ? 'Letter / number' : 'Correct answer (| = alternatives)'}">`;
  }
  const qNum = (g, ii, from) => { let n = from; for (let k = 0; k < ii; k++) n += itemWidth(g, g.items[k]); return n; };
  function groupBlock(g, gi, range, total, mode) {
    const L = draft.type === 'listening'; const shared = SHARED_OPTS.includes(g.type); const full = isMultiSection();
    const qOnly = mode === 'q'; const isTable = g.type === 'table';
    const items = g.items.map((it, ii) => {
      const p = `groups.${gi}.items.${ii}`; const multi = g.type === 'mcq' || g.type === 'mcq-multi';
      const prompt = isTable ? `<div class="field gi-cell" title="The cell of this gap (edit the table above)">${esc(it.prompt)}</div>`
        : `<textarea class="field gi-prompt" rows="${multi ? 2 : 1}" data-p="${p}.prompt" placeholder="${esc(GROUP_HINT[g.type] ? (g.type === 'tfng' || g.type === 'ynng' ? 'Statement' : multi ? 'Question' : g.type === 'matching' || g.type === 'map' ? 'Item, e.g. Paragraph A' : g.type === 'short' || g.type === 'completion' || g.type === 'gap' || g.type === 'box' ? 'Text with ____ for the gap' : 'Question') : 'Question')}">${esc(it.prompt)}</textarea>`;
      // made by the AI Test Generator: "AI" = written by the AI, "check" = its proof was not found in the passage / transcript
      const tags = (it.origin === 'ai' ? '<span class="cb-ai-tag" title="Written by the AI">AI</span>' : '') + (it.verified === false ? '<span class="cb-ai-tag warn" title="The AI\'s evidence was not found in the source">check</span>' : '');
      // a "choose TWO / THREE" question uses that many numbers of the paper (until its answer says so itself)
      const width = g.type === 'mcq-multi' ? `<label class="lbl sm gi-width">Numbers it uses<select class="field" data-p="${p}.w" data-num="1" data-rerender="1">${[2, 3, 4].map((k) => `<option value="${k}" ${itemWidth(g, it) === k ? 'selected' : ''}>${k} (choose ${['', '', 'TWO', 'THREE', 'FOUR'][k]})</option>`).join('')}</select></label>` : '';
      return `<div class="gi-row"><div class="cb-qn">${qNum(g, ii, range.from)}</div>${tags ? `<div class="cb-ai-tags">${tags}</div>` : ''}<div class="gi-main">
        <div class="gi-line${qOnly ? ' gi-qonly' : ''}">${prompt}${qOnly ? '' : answerCell(g, gi, it, ii)}</div>
        ${multi ? `<textarea class="field" rows="4" data-lines="1" data-p="${p}.options" placeholder="Options, one per line (A, B, C… in this order)">${esc((it.options || []).join('\n'))}</textarea>` : ''}${width}
        ${L && (g.type === 'gap' || g.type === 'box') ? `<input class="field" data-p="${p}.title" value="${esc(it.title)}" placeholder="Small sub-heading before this line (optional), e.g. Prices">` : ''}
        ${qOnly ? '' : `<input class="field gi-exp" data-p="${p}.explanation" value="${esc(it.explanation)}" placeholder="Explanation shown after submitting (optional). Words in &quot;quotes&quot; are lit up in the passage">`}
        ${qOnly || L ? '' : `<input class="field gi-exp gi-ev" data-p="${p}.evidence" value="${esc(it.evidence || '')}" placeholder="Passage words to highlight (optional — copy them exactly; quotes in the explanation are used if empty)">`}</div>
        ${isTable ? '' : `<button class="btn btn-sm btn-danger" data-cb="i-del" data-g="${gi}" data-i="${ii}" type="button" title="Delete this question">✕</button>`}</div>`;
    }).join('');
    const mcqLike = g.type === 'mcq' || g.type === 'mcq-multi';
    return `<div class="cb-group" id="cb-group-${gi}"><div class="cb-ghead"><div class="cb-gtitle"><span class="cb-gno">Group ${gi + 1}</span><span class="cb-grange">Questions ${range.from}–${range.to} · ${g.items.length} question${g.items.length === 1 ? '' : 's'}</span></div>
        <div class="btn-row"><button class="btn btn-sm" data-cb="g-up" data-g="${gi}" type="button" title="Move up">↑</button><button class="btn btn-sm" data-cb="g-down" data-g="${gi}" type="button" title="Move down">↓</button><button class="btn btn-sm" data-cb="g-dup" data-g="${gi}" type="button" title="Copy this group">Copy</button><button class="btn btn-sm btn-danger" data-cb="g-del" data-g="${gi}" type="button">Remove group</button></div></div>
      <div class="cb-row"><select class="field" data-p="groups.${gi}.type" data-rerender="1" title="Type of this group">${Object.entries(qLabels()).map(([k, v]) => `<option value="${k}" ${g.type === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>${full ? passSelect(`groups.${gi}.passage`, g.passage) : ''}</div>
      <input class="field" data-p="groups.${gi}.group" value="${esc(g.group)}" placeholder="${L ? 'Instruction of this block, e.g. Complete the notes below. Write ONE WORD for each answer.' : 'Instruction of this group, e.g. Complete the notes. Write NO MORE THAN TWO WORDS. (“Questions 1–5” is added by itself. Empty = the standard instruction)'}">
      ${L ? `<input class="field" data-p="groups.${gi}.blockTitle" value="${esc(g.blockTitle)}" placeholder="Title above the ${isTable ? 'table' : 'block'} (optional), e.g. Barrington Historical Buildings Tours">`
        : (g.type === 'completion' || g.type === 'short' || g.type === 'matching' || isTable) ? `<input class="field" data-p="groups.${gi}.blockTitle" value="${esc(g.blockTitle)}" placeholder="${g.type === 'matching' ? 'Title of the option list (optional), e.g. List of Categories (not used for headings / paragraph letters)' : isTable ? 'Title above the table (optional), e.g. Specialisation' : 'Title above the notes / summary / table (optional), e.g. How ambergris is formed'}">` : ''}
      ${isTable ? `<label class="lbl cb-shared">The table, typed ONCE: the column headings on the first line, then one row per line. Split the cells with <code>|</code> and write <code>____</code> in each cell where an answer goes. Every gap is one question, numbered row by row.<textarea class="field cb-table" rows="7" data-p="groups.${gi}.table" placeholder="Specialised ability | Example fish species&#10;Maintains the same ____ over long distances | Swordfish&#10;Rapid ____ | Barracuda&#10;Rapid changes of direction | ____">${esc(g.table)}</textarea></label>${tablePreview(g, range.from)}` : ''}
      ${shared ? `<label class="lbl cb-shared">${SHARED_LABEL[g.type]}<textarea class="field" rows="${g.type === 'matching' ? 6 : 4}" data-lines="1" data-p="groups.${gi}.options" placeholder="${esc(SHARED_PH[g.type])}">${esc((g.options || []).join('\n'))}</textarea></label>
        ${g.type === 'matching' && !L ? `<div class="btn-row"><button class="btn btn-sm" data-cb="g-letters" data-g="${gi}" type="button">Fill paragraph letters A–G</button><button class="btn btn-sm" data-cb="g-letters-9" data-g="${gi}" type="button">A–I</button></div>` : ''}` : ''}
      <div class="gi-list">${items}</div>
      ${isTable ? '' : `<div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="i-add" data-g="${gi}" type="button">+ Question</button>${qOnly ? '' : `<button class="btn btn-sm" data-cb="g-paste" data-g="${gi}" type="button">Paste many into this group</button>`}</div>`}
      ${isTable || qOnly ? '' : `<div class="cb-bulk" id="gpaste-${gi}" hidden><div class="muted sm"><b>${esc(GROUP_HINT[g.type] || '')}</b><br>One question per line: <code>question =&gt; answer =&gt; explanation</code> (explanation optional). Or blocks: <code>1. text</code> / <code>Answer: …</code> / <code>Explanation: …</code>.${mcqLike ? ' Put the options (<code>A. …</code>) under each question.' : ''}</div>
        <textarea class="field" id="gpaste-text-${gi}" rows="8" placeholder="${g.type === 'tfng' ? 'Glass was first made in Egypt. => TRUE => Paragraph A says so.\nThe factory closed in 1990. => NOT GIVEN' : 'The tour starts in ____ Street => Mill => Speaker says Mill Street.'}"></textarea>
        <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="g-paste-do" data-g="${gi}" type="button">Add to this group</button></div></div>`}
    </div>`;
  }
  /* the table as the student will see it, with the numbers of its gaps */
  function tablePreview(g, from) {
    const rows = tableRows(g.table); if (rows.length < 2) return '';
    let n = from; const cols = Math.max(...rows.map((r) => r.length));
    const cell = (c, head) => { const parts = String(c).split(new RegExp(TABLE_GAP.source, 'g')); return parts.map((x, k) => esc(x) + (k < parts.length - 1 ? (head ? '____' : `<span class="cb-tgap">${n++}</span>`) : '')).join(''); };
    const tr = (r, head) => '<tr>' + Array.from({ length: cols }, (_, k) => `<${head ? 'th' : 'td'}>${cell(r[k] || '', head)}</${head ? 'th' : 'td'}>`).join('') + '</tr>';
    return `<div class="cb-tprev"><div class="muted sm">Preview</div><table>${tr(rows[0], true)}${rows.slice(1).map((r) => tr(r, false)).join('')}</table></div>`;
  }

  /* ═════════ The questions in three steps, by number ═════════
     1 · Questions: one block of the paper at a time ("Questions 1–6", then 7–13 …), pasted as printed, without answers.
     2 · Answers: the answer key by question number.  3 · Explanations: by question number.
     "Everything together" is the form with every field of every question (and the old "Paste many groups"). */
  const STEPS = [['q', '1 · Questions'], ['a', '2 · Answers'], ['e', '3 · Explanations'], ['all', 'Everything together']];
  /* the first number of this test: a Reading Part of Passage 2 starts at 14, a Listening Part 3 at 21 */
  function firstNo() {
    if (draft.type === 'listening' && !isFullListening()) return ((parseInt(String(draft.data.sectionLabel || '').replace(/\D+/g, ''), 10) || 1) - 1) * 10 + 1;
    if (draft.type === 'reading' && !isFullReading()) return ({ 2: 14, 3: 27 })[parseInt(String(draft.data.passageLabel || '').replace(/\D+/g, ''), 10)] || 1;
    return 1;
  }
  function lastNo() {
    if (isFullReading() || isFullListening()) return 40;
    if (draft.type === 'listening') return firstNo() + 9;
    return ({ 1: 13, 14: 26, 27: 40 })[firstNo()] || 13;
  }
  const hasQ = (g, it) => !!(String(it.prompt || '').trim() || String(it.answer || '').trim());
  /* 1 2 3 … 40: which numbers have their question, answer and explanation */
  function numStrip() {
    const list = numberedItems().filter((x) => hasQ(x.g, x.it)); const by = {};
    list.forEach((x) => { for (let k = 0; k < x.w; k++) by[x.n + k] = x; });
    const nums = Object.keys(by).map(Number); const from = Math.min(firstNo(), ...nums), to = Math.max(lastNo(), ...nums);
    let chips = '';
    for (let n = from; n <= to; n++) {
      const x = by[n]; const a = x && String(x.it.answer || '').trim(), e = x && String(x.it.explanation || '').trim();
      chips += `<span class="cb-num ${!x ? 'miss' : a ? 'ans' : 'q'}${e ? ' exp' : ''}" title="${!x ? 'Question ' + n + ': not added yet' : 'Question ' + n + (a ? ' · answer: ' + esc(x.it.answer) : ' · no answer yet') + (e ? ' · has an explanation' : '')}">${n}</span>`;
    }
    const nq = list.reduce((s, x) => s + x.w, 0), na = list.filter((x) => String(x.it.answer || '').trim()).reduce((s, x) => s + x.w, 0), ne = list.filter((x) => String(x.it.explanation || '').trim()).reduce((s, x) => s + x.w, 0);
    return `<div id="cb-nums" class="cb-nums">${chips}<div class="muted sm cb-nums-sum">${nq} question${nq === 1 ? '' : 's'} · ${na} answer${na === 1 ? '' : 's'} · ${ne} explanation${ne === 1 ? '' : 's'} <span class="cb-legend"><span class="cb-num miss">·</span> not added <span class="cb-num q">·</span> no answer <span class="cb-num ans">·</span> answered <span class="cb-num ans exp">·</span> with explanation</span></div></div>`;
  }
  function refreshNums() { const el = $('#cb-nums'); if (el && draft) el.outerHTML = numStrip(); }
  const typeOptions = (withAuto) => (withAuto ? '<option value="auto">Type: read from the instruction</option>' : '') + Object.entries(qLabels()).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
  function stepQuestions() {
    const gs = draft.groups || []; const num = numbering(); const total = gs.reduce((n, g) => n + g.items.length, 0); const L = draft.type === 'listening';
    const list = numberedItems().filter((x) => hasQ(x.g, x.it)); const next = list.length ? list[list.length - 1].n + list[list.length - 1].w : firstNo();
    const pass = isMultiSection() ? `<label class="lbl">${L ? 'Part' : 'Passage'}<select class="field" id="rq-pass"><option value="auto">from the numbers (${L ? '1–10 = Part 1 …' : '1–13 = 1, 14–26 = 2, 27–40 = 3'})</option>${(L ? [1, 2, 3, 4] : [1, 2, 3]).map((n) => `<option value="${n}">${L ? 'Part' : 'Passage'} ${n}</option>`).join('')}</select></label>` : '';
    return `<div class="cb-bulk cb-stepbox"><div class="muted sm"><b>Step 1 — the questions, one block at a time.</b> Paste a block of the paper as it is printed: its instruction, the option list or list of headings (if it has one) and the numbered questions. For notes, summaries and tables the numbered gaps (<code>7 ………</code>) are enough. <b>No answers here</b> — they come in step 2. Pasting the same numbers again replaces that block.</div>
      <div class="cb-range"><label class="lbl">From question<input class="field" type="number" id="rq-from" min="1" max="60" value="${Math.min(60, next)}"></label><label class="lbl">To (optional)<input class="field" type="number" id="rq-to" min="1" max="60" placeholder="from the text"></label><label class="lbl">Type<select class="field" id="rq-type">${typeOptions(true)}</select></label>${pass}</div>
      <textarea class="field" id="rq-text" rows="10" placeholder="Questions 1–6&#10;Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.&#10;Beatrix Potter&#10;• She received lessons at home from a 1 ……………&#10;• She wrote in her 2 …………… in code.&#10;&#10;— or —&#10;&#10;Questions 7–13&#10;Do the following statements agree with the information given in Reading Passage 1?&#10;7 Potter's first book was published by her family.&#10;8 …"></textarea>
      <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="rq-add" type="button">Add these questions</button></div></div>
      ${orderedGroups().map((gi) => groupBlock(gs[gi], gi, num[gi] || { from: 1, to: 1 }, total, 'q')).join('')}
      <div class="cb-addgroup"><span class="muted sm">Or an empty group to fill by hand:</span><select class="field" id="g-newtype" style="width:auto;max-width:100%">${Object.entries(qLabels()).map(([k, v]) => `<option value="${k}" ${(gs.length && gs[gs.length - 1].type === k) ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select><button class="btn btn-sm btn-primary" data-cb="g-add" type="button">+ Add group</button></div>`;
  }
  const shortText = (t, k) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > k ? t.slice(0, k - 1) + '…' : t; };
  const typeShort = (t) => String(qLabels()[t] || t).split(/[:(]/)[0].trim();
  function stepAnswers() {
    const list = numberedItems().filter((x) => hasQ(x.g, x.it));
    const rows = list.map(({ gi, ii, g, it, n, w }) => `<tr><td class="cb-n">${n}${w > 1 ? '–' + (n + w - 1) : ''}</td><td class="cb-qp">${esc(shortText(it.prompt, 110)) || '<span class="muted">(no text)</span>'}<div class="muted sm">${esc(typeShort(g.type))}</div></td><td class="cb-ac">${answerCell(g, gi, it, ii)}</td></tr>`).join('');
    return `<div class="cb-bulk cb-stepbox"><div class="muted sm"><b>Step 2 — the answer key.</b> Paste it with the question numbers, as printed: <code>1 governess</code>, <code>7 FALSE</code>, <code>14 iv</code>, <code>21–22 B, D</code> — a key in two columns is fine. Or one answer per line <b>without</b> numbers, starting at question <input class="field cb-inline" type="number" id="ra-from" min="1" max="60" value="${firstNo()}">. Several accepted answers: <code>colour|color</code> (or <code>colour / color</code>).</div>
      <textarea class="field" id="ra-text" rows="8" placeholder="1 governess&#10;2 diary&#10;7 FALSE&#10;8 NOT GIVEN&#10;14 iv&#10;21-22 B, D"></textarea>
      <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="ra-add" type="button">Put the answers in</button></div></div>
      ${list.length ? `<table class="cb-ntable"><thead><tr><th>No.</th><th>Question</th><th>Answer</th></tr></thead><tbody>${rows}</tbody></table>` : '<div class="muted sm">Add the questions first (step 1).</div>'}`;
  }
  function stepExplanations() {
    const list = numberedItems().filter((x) => hasQ(x.g, x.it)); const L = draft.type === 'listening';
    const rows = list.map(({ gi, ii, it, n, w }) => { const p = `groups.${gi}.items.${ii}`;
      return `<tr><td class="cb-n">${n}${w > 1 ? '–' + (n + w - 1) : ''}</td><td class="cb-qp"><b>${esc(it.answer || '—')}</b><div class="muted sm">${esc(shortText(it.prompt, 70))}</div></td><td><textarea class="field" rows="2" data-p="${p}.explanation" placeholder="Why this is the answer (words in &quot;quotes&quot; are lit up in the passage)">${esc(it.explanation)}</textarea>${L ? '' : `<input class="field gi-ev" data-p="${p}.evidence" value="${esc(it.evidence || '')}" placeholder="Passage words to highlight (optional)">`}</td></tr>`; }).join('');
    return `<div class="cb-bulk cb-stepbox"><div class="muted sm"><b>Step 3 — the explanations</b> (optional), by question number: <code>1. The passage says “…” — so the answer is …</code>. Lines without a number continue the one above. ${L ? '' : 'An <code>Evidence: …</code> line under it sets the words to light up in the passage; otherwise the words in “quotes” are used.'}</div>
      <textarea class="field" id="re-text" rows="9" placeholder="1. Her parents hired a governess: “She was educated in her parents' house by a governess”.&#10;2. “she began to keep a diary written in a secret code”.${L ? '' : '&#10;Evidence: keep a diary written in a secret code'}"></textarea>
      <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="re-add" type="button">Put the explanations in</button></div></div>
      ${list.length ? `<table class="cb-ntable"><thead><tr><th>No.</th><th>Answer</th><th>Explanation</th></tr></thead><tbody>${rows}</tbody></table>` : '<div class="muted sm">Add the questions first (step 1).</div>'}`;
  }
  function stepAll() {
    const gs = draft.groups || []; const num = numbering(); const total = gs.reduce((n, g) => n + g.items.length, 0);
    const types = Object.entries(qLabels());
    return `<div class="btn-row"><button class="btn btn-sm" data-cb="q-bulk" type="button">Paste many groups (questions with their answers)</button></div>
      <div id="bulk-box" class="cb-bulk" hidden><div class="muted sm"><b>Several groups in one go.</b> A line like <code>Questions 1–5 …</code> starts a new group (everything after it up to the next such line). Under it you may put the instruction line, the option list (<code>A. …</code> / <code>i. …</code>) once, then the questions:<br>
        <code>Questions 1–3 Do the following statements agree…</code><br><code>1. Glass was first made in Egypt. =&gt; TRUE =&gt; Paragraph A</code> &nbsp; or &nbsp; <code>1. text</code> + <code>Answer: TRUE</code> + <code>Explanation: …</code><br>The type of each group is detected from the answers; or pick it below.<br>No answers next to the questions? Paste the <b>ANSWERS</b> section (<code>1. TRUE — …</code>, <code>7 irrigation</code>, <code>Q21/Q22. A and C</code>) under them: it is matched by question number. A 4th part <code>=&gt; words to highlight</code> or an <code>Evidence: …</code> line sets the passage highlight; otherwise the words in “quotes” in the explanation are used.</div>
        <textarea class="field" id="bulk-text" rows="14" placeholder="Questions 1–3 Do the following statements agree with the information in the passage?&#10;1. Glass was first made in Egypt. => TRUE => Paragraph A, line 2.&#10;2. The factory closed in 1990. => NOT GIVEN&#10;&#10;Questions 4–6 Complete the notes. Write ONE WORD.&#10;4. The bees live in a ____ => hive"></textarea>
        <div class="btn-row"><select class="field" id="bulk-type" style="width:auto"><option value="auto">Auto-detect the type of each group</option>${types.map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select>${isFullReading() ? `<select class="field" id="bulk-pass" style="width:auto"><option value="">Passage: as the last group</option><option value="1">Passage 1</option><option value="2">Passage 2</option><option value="3">Passage 3</option></select>` : ''}${isFullListening() ? `<select class="field" id="bulk-pass" style="width:auto"><option value="auto">Part: from the question numbers (1–10 = Part 1 …)</option><option value="1">Part 1</option><option value="2">Part 2</option><option value="3">Part 3</option><option value="4">Part 4</option></select>` : ''}<button class="btn btn-sm btn-primary" data-cb="q-bulk-do" type="button">Add the groups</button></div></div>
      ${orderedGroups().map((gi) => groupBlock(gs[gi], gi, num[gi] || { from: 1, to: 1 }, total, 'all')).join('')}
      <div class="cb-addgroup"><span class="muted sm">New group:</span><select class="field" id="g-newtype" style="width:auto;max-width:100%">${types.map(([k, v]) => `<option value="${k}" ${(gs.length && gs[gs.length - 1].type === k) ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select><button class="btn btn-sm btn-primary" data-cb="g-add" type="button">+ Add group</button></div>`;
  }
  function questionsInner() {
    const step = STEPS.some(([k]) => k === draft._step) ? draft._step : 'q';
    const body = step === 'a' ? stepAnswers() : step === 'e' ? stepExplanations() : step === 'all' ? stepAll() : stepQuestions();
    return `<div class="cb-block"><div class="cb-head"><div><strong>Questions, answers and explanations</strong>
      <div class="muted sm">Three steps, each by question number: <b>1</b> the questions of each block (1–6, then 7–13 …), <b>2</b> the answer key, <b>3</b> the explanations. <b>Everything together</b> shows every field of every question at once.</div></div>
      <div class="btn-row"><button class="btn btn-sm" data-cb="check" type="button">✓ Check</button></div></div>
      <div class="cb-steps" role="tablist">${STEPS.map(([k, label]) => `<button class="cb-step${k === step ? ' on' : ''}" data-cb="step" data-step="${k}" type="button" role="tab" aria-selected="${k === step}">${label}</button>`).join('')}</div>
      ${numStrip()}
      <div id="cb-issues"></div>
      ${body}</div>`;
  }

  /* ───────── Step 1: a block of questions, by its numbers ───────── */
  const cleanHeadText = (h) => String(h || '').replace(/^\s*(?:questions?|savollar)\s+\d+\s*(?:(?:[-–—]|to|dan)\s*\d+)?\s*[:.\-–—]?\s*/i, '').trim();
  /* the type of a block, read from its instruction (and its questions) */
  function typeFromText(head, b) {
    const h = String(head || ''); const L = draft.type === 'listening';
    const opts = b.qs.some((q) => (q.options || []).length >= 2);
    let t;
    if (/\bclaims?\b|\bviews?\b.{0,20}\bwriter|writer'?s?\s+(?:views|claims|opinion)|\bYES\b/i.test(h)) t = 'ynng';
    else if (/agree with the information|\bTRUE\b/i.test(h)) t = 'tfng';
    else if (/\blabel\b.{0,30}\b(?:map|plan)\b|\b(?:map|plan)\b.{0,40}\bletters?\b/i.test(h) && !opts) t = 'map';
    else if (/\bchoose\s+(?:two|three|four)\b|\bwhich\s+(?:two|three)\b|\b(?:two|three)\s+letters\b/i.test(h)) t = 'mcq-multi';
    else if (/heading|which paragraph|which section|correct ending|list of|match each|look at the following|classify|from the box|correct letter,?\s*[A-L]\s*[–—-]\s*[A-L]/i.test(h) || b.shared.length >= 2) t = 'matching';
    else if (opts || /choose the correct (?:letter|answer)/i.test(h)) t = 'mcq';
    else if (/complete the (?:notes|summary|flow-?chart|diagram|form|text)/i.test(h)) t = 'completion';
    else t = 'short';
    if (L) t = ({ short: 'gap', completion: 'gap', tfng: 'gap', ynng: 'gap' })[t] || t;
    return t;
  }
  /* "Questions 32–35  Complete the table below …" + the table -> one table group */
  function tableGroupFrom(lines) {
    const g = newGroup('table'); const rows = []; let instr = '';
    lines.forEach((l) => {
      const t = l.trim(); if (!t) return;
      if (!rows.length && (P_HEAD.test(t) || P_INSTR.test(t) || /^(?:choose|write|use|nb\b|answer|in boxes|from the)/i.test(t))) { instr += (instr ? ' ' : '') + t; return; }
      if (!rows.length && !g.blockTitle && t.length < 60 && !/\||\t|\s{2,}/.test(t) && !TABLE_GAP.test(t) && !/\b\d{1,2}\b/.test(t)) { g.blockTitle = t; return; }   // the table's own title
      rows.push(t);
    });
    g.group = cleanHeadText(instr); g.table = tableFromText(rows); syncTable(g);
    return g;
  }
  /* the questions of a pasted block, without answers -> { groups, skipped } */
  function questionsOnly(text, forced) {
    const src = String(text || '').replace(/\r/g, '');
    if (forced === 'table' || (forced === 'auto' && /\bcomplete the table\b|\btable below\b/i.test(src))) { const g = tableGroupFrom(src.split('\n')); return { groups: g.items.length ? [g] : [], skipped: [] }; }
    const raw = parseRaw(src, null, true); const groups = []; const L = draft.type === 'listening';
    raw.blocks.forEach((b) => {
      let type = forced && forced !== 'auto' ? forced : typeFromText(b.head, b);
      if (L) type = ({ short: 'gap', completion: 'gap', tfng: 'gap', ynng: 'gap' })[type] || type;
      if (!L && type === 'gap') type = 'completion';
      const shared = SHARED_OPTS.includes(type);
      let opts = b.shared.slice();
      const last = b.qs[b.qs.length - 1];
      // a list of endings / words printed after the questions was read as the options of the last one
      if (shared && !opts.length && last && (last.options || []).length >= 2) { opts = last.options; last.options = []; }
      if (shared && opts.length < 2 && type !== 'box') { const hm = /\bA\s*[–—-]\s*([B-L])\b/.exec(b.head); if (hm) opts = 'ABCDEFGHIJKL'.slice(0, hm[1].charCodeAt(0) - 64).split(''); }
      const w = type === 'mcq-multi' ? (/\bthree\b/i.test(b.head) ? 3 : /\bfour\b/i.test(b.head) ? 4 : 2) : 1;
      groups.push({ type, passage: 1, group: b.head, blockTitle: '', table: '', options: shared ? opts : [],
        items: b.qs.map((q) => ({ prompt: q.prompt, answer: q.answer ? normAnswer(type, q.answer) : '', explanation: q.explanation || '', evidence: q.evidence || '', title: '', options: shared ? [] : (q.options || []).slice(), w: w > 1 ? w : undefined })) });
    });
    return { groups, skipped: raw.skipped };
  }
  /* take out the questions numbered from..to (a table goes as a whole); empty groups go too */
  function dropRange(from, to) {
    draft.groups = draft.groups.filter((g) => (g.type === 'table' ? String(g.table || '').trim() : g.items.some((it) => hasQ(g, it))));
    const kill = new Set(numberedItems().filter((x) => x.n <= to && x.n + x.w - 1 >= from).map((x) => x.gi + ':' + x.ii));
    draft.groups.forEach((g, gi) => { g.items = g.type === 'table' && g.items.some((it, ii) => kill.has(gi + ':' + ii)) ? [] : g.items.filter((it, ii) => !kill.has(gi + ':' + ii)); });
    draft.groups = draft.groups.filter((g) => g.items.length);
    return kill.size;
  }
  function addQuestionsByRange() {
    const text = $('#rq-text').value; if (!text.trim()) return toast('Paste the questions of the block first.', true);
    const from = Math.max(1, parseInt($('#rq-from').value, 10) || firstNo()); const toWant = parseInt($('#rq-to').value, 10) || 0;
    const r = questionsOnly(text, $('#rq-type').value);
    if (!r.groups.length) return toast('No questions found. Number them (1 …, 2 …), or write ____ / “7 ………” where each answer goes.', true);
    const L = draft.type === 'listening'; const ps = $('#rq-pass');
    const pass = !isMultiSection() ? 1 : ps && ps.value !== 'auto' ? Number(ps.value) : L ? Math.min(4, Math.ceil(from / 10)) : from <= 13 ? 1 : from <= 26 ? 2 : 3;
    const count = r.groups.reduce((s, g) => s + g.items.reduce((m, it) => m + itemWidth(g, it), 0), 0);
    const to = Math.max(from + count - 1, toWant || 0);
    const replaced = dropRange(from, to);
    r.groups.forEach((g, k) => { g.passage = pass; if (!k) g.start = from; });
    const num = numbering(); let at = draft.groups.length;
    for (const gi of orderedGroups()) { const g = draft.groups[gi]; if ((!isMultiSection() || g.passage === pass) && num[gi].from > from) { at = gi; break; } }
    draft.groups.splice(at, 0, ...r.groups);
    refreshQuestions(); autosave();
    const f = $('#rq-from'); if (f) f.value = Math.min(60, from + count);
    toast('Questions ' + from + '–' + (from + count - 1) + ' added' + (replaced ? ' (replacing ' + replaced + ')' : '') + ' · ' + r.groups.map((g) => typeShort(g.type)).join(', ')
      + (toWant && toWant !== from + count - 1 ? ' · NOTE: you wrote “to ' + toWant + '”, the text has ' + count + ' question(s)' : '')
      + (r.skipped.length ? ' · ' + r.skipped.length + ' line(s) NOT understood: “' + r.skipped[0].slice(0, 40) + '…”' : ''), !!(r.skipped.length || (toWant && toWant !== from + count - 1)));
  }

  /* ───────── Step 2: the answer key, by number ───────── */
  const KEY_ENTRY = /^(?:Q\s*)?(\d{1,2})(?:\s*(?:\/|&|and|,|[-–—])\s*(?:Q\s*)?(\d{1,2}))?\s*[.):]?\s+(.+)$/i;
  function answerKeyFrom(text, from) {
    const lines = String(text || '').replace(/\r/g, '').split('\n').map((l) => l.trim()).filter(Boolean)
      // "1 governess    21 C" / "1 governess 21 C": two columns of a key read across
      .reduce((out, l) => out.concat(l.split(/\t+|\s{3,}/)), []).map((l) => l.trim()).filter(Boolean)
      .reduce((out, l) => { const first = Number((/^(?:Q\s*)?(\d{1,2})\b/i.exec(l) || [])[1] || 0); if (!first) return out.concat(l);
        const parts = l.split(/\s+(?=(?:Q\s*)?\d{1,2}\s*[.):]?\s+\S)/i); const keep = []; parts.forEach((p) => { const n = Number((/^(?:Q\s*)?(\d{1,2})\b/i.exec(p) || [])[1] || 0); if (keep.length && n > first && n <= 40) keep.push(p); else if (keep.length) keep[keep.length - 1] += ' ' + p; else keep.push(p); }); return out.concat(keep); }, []);
    const key = {};
    if (lines.filter((l) => KEY_ENTRY.test(l)).length * 2 >= lines.length) {
      // raw: the whole answer as typed (a written answer such as "A mental image" is not the letter A)
      lines.forEach((l) => { const m = KEY_ENTRY.exec(l); if (!m) return; const a = keyAnswer(m[3]); a.raw = m[3].replace(/\s+[—–]\s+.*$/, '').trim(); const n1 = Number(m[1]), n2 = Number(m[2] || m[1]); for (let k = n1; k <= Math.max(n1, n2) && k <= n1 + 4; k++) key[k] = a; });
    } else lines.forEach((l, i) => { key[from + i] = { ans: l, exp: '', raw: l }; });
    return key;
  }
  function putAnswers(key) {
    let put = 0; const missing = [];
    numberedItems().forEach(({ g, it, n, w }) => {
      if (!hasQ(g, it)) return;
      let a = '';
      if (g.type === 'mcq-multi') { const got = []; for (let k = n; k < n + Math.max(1, w); k++) if (key[k]) gLetters(key[k].ans).forEach((x) => { if (!got.includes(x)) got.push(x); }); a = got.join(','); }
      else if (key[n]) { const typed = ['short', 'completion', 'table', 'gap'].includes(g.type); a = String((typed && key[n].raw) || key[n].ans || '').trim(); if (typed) a = a.replace(/\s*\/\s*|\s+OR\s+/g, '|'); }
      if (a) { it.answer = normAnswer(g.type, a); put++; } else if (!String(it.answer || '').trim()) missing.push(n);
    });
    return { put, missing };
  }

  /* ───────── Step 3: explanations, by number ───────── */
  function explanationsFrom(text) {
    const by = {}; let cur = null;
    String(text || '').replace(/\r/g, '').split('\n').forEach((l) => {
      const t = l.trim(); if (!t) return; let m;
      if ((m = P_EVI.exec(t))) { if (cur) cur.ev = m[1].trim(); return; }
      if ((m = /^(?:Q(?:uestion)?\s*)?(\d{1,2})(?:\s*(?:[-–—/&,]|and)\s*(?:Q\s*)?(\d{1,2}))?\s*[.):\-–—]?\s+(.+)$/i.exec(t))) {
        cur = { text: m[3].replace(P_EXP, '$1').trim(), ev: '' }; const n1 = Number(m[1]), n2 = Number(m[2] || m[1]);
        for (let k = n1; k <= Math.max(n1, n2) && k <= n1 + 4; k++) by[k] = cur; return;
      }
      if (cur) cur.text += ' ' + t.replace(P_EXP, '$1');
    });
    return by;
  }
  function putExplanations(by) {
    let put = 0; const L = draft.type === 'listening';
    numberedItems().forEach(({ g, it, n, w }) => {
      if (!hasQ(g, it)) return; let e = null; for (let k = n; k < n + Math.max(1, w) && !e; k++) e = by[k];
      if (!e) return; it.explanation = e.text; if (e.ev && !L) it.evidence = e.ev; put++;
    });
    return put;
  }
  function questionsBlock() { return `<div id="cb-qwrap">${questionsInner()}</div>`; }
  function refreshQuestions(keepOpen) {
    const w = $('#cb-qwrap'); if (!w) return renderBuilder();
    const bulkOpen = !!$('#bulk-box') && !$('#bulk-box').hidden; const bt = ($('#bulk-text') || {}).value || '';
    const st = $('#builder-body').scrollTop; w.innerHTML = questionsInner(); $('#builder-body').scrollTop = st;
    if (bulkOpen) { $('#bulk-box').hidden = false; $('#bulk-text').value = bt; }
  }

  /* ───────── "Paste many": text -> groups ───────── */
  const P_ANS = /^(?:answer|ans|javob|correct(?: answer)?)\s*[:=\-–]\s*(.*)$/i, P_EXP = /^(?:explanation|explain|exp|izoh|tushuntirish)\s*[:=\-–]\s*(.*)$/i, P_EVI = /^(?:evidence|highlight|dalil)\s*[:=\-–]\s*(.*)$/i;
  /* options: "A. text", "A) text" and, as printed in PDFs, "A text" / "iv text" */
  const P_OPT = /^\(?([A-J]|[ivx]{1,4})(?:[.)]\s+|\s+(?=[^\s.]))(.+)$/;
  /* numbered questions: "1. text", "Q1) text" and, as printed in PDFs, "1 Text" */
  const P_NUM = /^(?:Q\s*)?(\d{1,2})(?:\s*[-–—]\s*\d{1,2}(?=[\s.)]))?(?:\s*[.)\-:]\s*|\s+(?=[A-Za-z"“‘'(]|\d{3,4}\b))(.+)$/i, P_HEAD = /^(?:questions?|savollar)\s+\d+\s*(?:(?:[-–—]|to|dan)\s*\d+)?\b/i;
  /* ───────── Smart paste: an answer key at the end, numbered gaps inside notes / summaries ─────────
     A test copied straight from a PDF usually has the questions WITHOUT answers and an "ANSWERS" /
     "Answer key" section at the very end ("1. TRUE — Para 1: …", "Q7. irrigation — …", "14 iv",
     "Q21 / Q22. A and C"). splitKey() cuts that section off and reads it into { 7: { ans, exp } };
     parseRaw() then fills every question that has no "=> answer" of its own from it, by number.
     expandGaps() turns notes / summaries / tables where the number sits inside the text
     ("… because of 7 ………… from nearby fields") into one question line per gap. */
  const P_INSTR = /^(?:do the following statements|complete the (?:notes|table|summary|sentences|flow-?chart|diagram|form)|complete each sentence|choose the correct (?:letter|heading)|choose (?:two|three|four)\b|which paragraph contains|look at the following|reading passage \d+ has|answer the questions|label the (?:diagram|map|plan|flow)|match each|classify the following)/i;
  const KEY_HEAD = /^(?:answers?|answer\s*key|javoblar|kalit(?:lar)?)(?:\s*[:.]?\s*$|\s+(?:key|with|and|&|for|\u2014|-)\b.*$)/i;   // not "Answer the questions below"
  function keyAnswer(rest) {
    // "IN EITHER ORDER B C" (the key of a "choose TWO" question): only the letters count
    const r = String(rest || '').replace(/[✓✔]/g, ' ').replace(/\(?\b(?:in\s+)?(?:either|any)\s+order\b\)?[:,]?/ig, ' ').replace(/\s+/g, ' ').trim(); let m;
    if ((m = /^([A-J](?:\s*(?:,|&|and|\s)\s*[A-J])+)(?:\s*[—–:-]\s*(.*))?$/.exec(r))) return { ans: m[1].match(/[A-J]/g).join(','), exp: m[2] || '' };   // "B C — paragraph D"
    if ((m = /^paragraph\s+[A-Z]\s*(?:→|->|=>)\s*(\S+)\s*[—–:-]?\s*(.*)$/i.exec(r))) return { ans: m[1], exp: m[2] };
    if ((m = /^paragraph\s+([A-Z])\b\s*[—–:-]?\s*(.*)$/i.exec(r))) return { ans: m[1], exp: m[2] };
    if ((m = /^(not\s+given|true|false|yes|no)\b\s*[—–:-]?\s*(.*)$/i.exec(r))) return { ans: m[1].toUpperCase().replace(/\s+/, ' '), exp: m[2] };
    if ((m = /^([A-J])((?:\s*(?:,|&|and)\s*[A-J]\b)+)\s*(?:\([^)]*\))?\s*[—–:-]?\s*(.*)$/.exec(r))) return { ans: (m[1] + m[2]).match(/[A-J]/g).join(','), exp: m[3] };
    if ((m = /^([A-J]|i{1,3}|iv|vi{0,3}|ix|xi{0,2}|x)\b\s*(?:\([^)]*\))?\s*[—–:-]?\s*(.*)$/.exec(r))) return { ans: m[1], exp: m[2] };
    if ((m = /^(.+?)(?:\s[—–-]\s|\s\(|:\s|\s{2,})(.*)$/.exec(r)) && m[1].split(/\s+/).length <= 5) return { ans: m[1].replace(/\s*\/\s*/g, '|'), exp: m[2] };
    const w = r.split(' ');
    if (w.length <= 4) return { ans: r, exp: '' };   // a short typed answer with no explanation: "0781 554 210", "black skirt"
    return { ans: w[0], exp: w.slice(1).join(' ') };
  }
  function splitKey(text) {
    const lines = String(text || '').replace(/\r/g, '').replace(/\f/g, '\n').split('\n'); let at = -1;
    for (let i = 0; i < lines.length; i++) { const l = lines[i].trim(); if (KEY_HEAD.test(l) && l.length < 80 && !/write|boxes|choose|sheet/i.test(l)) { at = i; break; } }
    if (at < 0) return { text: lines.join('\n'), key: {} };
    const key = {}; let last = 0, cur = null;
    const ENTRY = /^\s*(?:Q\s*)?(\d{1,2})(?:\s*(?:\/|&|and|,|[-–])\s*(?:Q\s*)?(\d{1,2}))?\s*[.):]?\s+(.+)$/i;
    let pend = 0;   // a table copied from a PDF puts the number and the answer on separate lines
    lines.slice(at + 1).forEach((l) => {
      const t = l.trim(); if (!t) return;
      const lone = /^(?:Q\s*)?(\d{1,2})\s*[.):]?$/i.exec(t);
      if (lone && (Number(lone[1]) > last && Number(lone[1]) <= last + 3 || !last)) { pend = Number(lone[1]); return; }
      if (pend) { const a = keyAnswer(t); cur = { ans: a.ans, exp: a.exp }; key[pend] = cur; last = pend; pend = 0; return; }
      const m = ENTRY.exec(t);
      // the next number (a short "11 north" may skip a few: a key that leaves out questions, or two columns read across)
      if (m && (Number(m[1]) > last && (Number(m[1]) <= last + 3 || (Number(m[1]) <= last + 30 && m[3].split(/\s+/).length <= 4)) || !last)) {
        const a = keyAnswer(m[3]); cur = { ans: a.ans, exp: a.exp }; last = Number(m[2] || m[1]);
        key[Number(m[1])] = cur; if (m[2]) for (let k = Number(m[1]) + 1; k <= Number(m[2]); k++) key[k] = cur;
      } else if (cur && !/^(?:passage|questions?|q\s+answer|#\s*answer)\b/i.test(t)) cur.exp = (cur.exp + ' ' + t).trim();
    });
    return { text: lines.slice(0, at).join('\n'), key };
  }
  /* repeated watermark / page lines ("Revised by @someone", "Page 3") */
  function dropWatermarks(text) {
    const lines = String(text || '').replace(/\r/g, '').replace(/\f/g, '\n').split('\n'); const cnt = {};
    lines.forEach((l) => { const t = l.trim(); if (t) cnt[t] = (cnt[t] || 0) + 1; });
    return lines.filter((l) => { const t = l.trim(); return !(t && cnt[t] >= 3 && t.length < 60 && (/@|^page\s*\d+|^\d+$/i.test(t))); }).join('\n');
  }
  const GAP_RE = /(^|[^\d])(\d{1,2})\s*(?:\.{3,}|…+|_{3,})(?:\s*\.(?=\s|$))?/g;
  function expandGaps(text) {
    const src = String(text || '').replace(/(\d{1,2})[ \t]*\n[ \t]*(\.{3,}|…{2,}|_{3,})/g, '$1 $2');
    const lines = src.split('\n'); const out = []; let run = [];
    const isHead = (l) => P_HEAD.test(l.trim()) || (P_INSTR.test(l.trim()));
    const flush = () => {
      if (!run.length) return;
      // a short line (title, sub-heading, year) ends a sentence: "\n\n" makes it a boundary
      const body = run.map((l) => (l.trim().length && l.trim().length < 50 && !GAP_RE.test(l) && !/[,;]$/.test(l.trim()) ? l + '\n' : l)).join('\n'); GAP_RE.lastIndex = 0; const gaps = []; let m;
      while ((m = GAP_RE.exec(body))) { const s = m.index + m[1].length; if (s > 0 && !/^\s*$/.test(body.slice(body.lastIndexOf('\n', s - 1) + 1, s))) gaps.push({ n: Number(m[2]), s, e: m.index + m[0].length }); }
      if (!gaps.length) { out.push(...run); run = []; return; }
      // keep the instruction lines in front of the gapped text (the group heading)
      let k = 0; while (k < run.length && (!run[k].trim() || /^(?:complete|choose|write|use|answer|nb\b|using)/i.test(run[k].trim()))) out.push(run[k++]);
      // and the list of words / endings of the group ("A  water   B  foundations"), printed before or after the text:
      // before the gap lines, so the questions read it as the group's option list
      const isOpt = (l) => { const t = l.trim(); return P_OPT.test(t) && (t.length < 60 || /\s{3,}(?:[A-J]|[ivx]{1,4})\s+\S/.test(t)) && !GAP_LINE.test(t); };
      run.slice(k).forEach((l) => { if (isOpt(l)) out.push(l.trim()); });
      const B = /[.!?;]\s|•|\n\s*\n|\n\s*o\s|\s{3,}/g;
      gaps.forEach((g, i) => {
        const from = i ? gaps[i - 1].e : 0, to = i + 1 < gaps.length ? gaps[i + 1].s : body.length;
        let left = body.slice(from, g.s); let b, lastB = -1; B.lastIndex = 0; while ((b = B.exec(left))) lastB = b.index + b[0].length; if (lastB >= 0) left = left.slice(lastB);
        let right = body.slice(g.e, to); B.lastIndex = 0; b = B.exec(right); if (b) right = right.slice(0, b.index + 1);
        // a form / notes line ("Phone: 3 ……", "Address: 2 …… Street") is one question: the next line belongs to it only
        // when the sentence clearly goes on there (it starts in lower case), the line before only when the gap opens this line
        const nl = right.indexOf('\n'); if (nl >= 0) { const head = right.slice(0, nl), tail = right.slice(nl + 1); right = /^\s*[a-z(]/.test(tail) && !/[.;:!?]\s*$/.test(head) ? head + ' ' + tail.split('\n')[0] : head; }
        const pl = left.lastIndexOf('\n'); if (pl >= 0) { const own = left.slice(pl + 1), prev = left.slice(0, pl).split('\n').pop(); left = own.trim() || /[.;:!?]\s*$/.test(prev) ? own : prev + ' ' + own; }
        const clip = (t, end) => { const w = t.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean); return end ? w.slice(-14).join(' ') : w.slice(0, 14).join(' '); };
        out.push(g.n + '. ' + (clip(left, true) + ' ____ ' + clip(right, false)).replace(/^[•●▪\-\s]+/, '').replace(/\s*[•●▪]+\s*$/, '').trim());
      });
      run = [];
    };
    lines.forEach((l) => { if (isHead(l)) { flush(); out.push(l); } else run.push(l); });
    flush();
    return out.join('\n');
  }

  /* -> { blocks: [{ head, shared: [], qs: [{ prompt, options, answer, explanation }] }], skipped: [lines] } */
  function parseRaw(text, key, free) {
    key = key || {};
    if (!Object.keys(key).length) { const sk = splitKey(text); text = sk.text; key = sk.key; }
    text = expandGaps(dropWatermarks(text));
    // two option columns on one line ("A poverty        C boats") -> two lines
    // a word box printed in columns may come out with single spaces: "A water B foundations C specialists" -> one per line
    // (split only at the NEXT letter of the list, so an "I" or "A" inside an option stays)
    const seqSplit = (t) => {
      const m = /^([A-I])[.)]?\s+\S/.exec(t); if (!m) return [t];
      const out = []; let rest = t, want = String.fromCharCode(m[1].charCodeAt(0) + 1);
      for (;;) { const at = rest.search(new RegExp('\\s' + want + '[.)]?\\s+(?=\\S)')); if (at < 0) break; out.push(rest.slice(0, at).trim()); rest = rest.slice(at + 1); want = String.fromCharCode(want.charCodeAt(0) + 1); }
      out.push(rest.trim());
      return out.length > 1 && out.every((x) => x.split(/\s+/).length <= 6) ? out : [t];
    };
    const lines = String(text || '').replace(/\r/g, '').split('\n').reduce((acc, x) => { const parts = x.trim().split(/\s{3,}/); return acc.concat(parts.length > 1 && parts.every((y) => /^(?:[A-J]|[ivx]{1,4})\s+\S/.test(y)) ? parts : [x.trim()]); }, [])
      .reduce((acc, x) => acc.concat(P_NUM.test(x) ? [x] : seqSplit(x)), [])
      .filter((l) => l && !/^[A-L](?:\s+[A-L])+$/.test(l));   // "A   B   C": the letters printed on a map / plan, not options
    let expect = 0;
    const blocks = []; const skipped = []; let blk = null, cur = null, lastField = '';
    const newBlock = (head) => { blk = { head: head || '', shared: [], qs: [] }; blocks.push(blk); return blk; };
    const fromKey = (q) => {
      // "Choose TWO letters": one question uses two numbers, and the key may give them one per line (21 B / 22 C)
      const many = q.options.length >= 2 && !q.answer && (/\bchoose\s+(two|three)\b|\b(two|three)\s+(?:letters|answers|correct)\b/i.exec(blk.head + ' ' + q.prompt) || [])[0];
      if (many) {
        const k = /three/i.test(many) ? 3 : 2; const got = [];
        for (let n = q.num; n < q.num + k; n++) if (key[n]) String(key[n].ans).split(/[^A-J]+/).filter(Boolean).forEach((x) => { if (!got.includes(x)) got.push(x); });
        if (got.length > 1) { q.answer = got.slice(0, k).join(','); q.explanation = q.explanation || (key[q.num] && key[q.num].exp) || ''; expect = Math.max(expect, q.num + k - 1); return; }
      }
      const k = key[q.num]; if (!k) return; if (!q.answer) q.answer = k.ans; if (!q.explanation && k.exp) q.explanation = k.exp;
    };
    const push = () => { if (cur && cur.prompt) { fromKey(cur); if (cur.answer || free) blk.qs.push(cur); else skipped.push(cur.prompt); } cur = null; lastField = ''; };
    lines.forEach((l) => {
      let m;
      if (P_HEAD.test(l) && !l.includes('=>') && (!cur || free || cur.answer || key[cur.num])) { push(); newBlock(l); return; }
      // an instruction line with no "Questions 1–5" above it still starts a new group
      if (P_INSTR.test(l) && !l.includes('=>') && blk && (blk.qs.length || cur) && (!cur || free || cur.answer || key[cur.num])) { push(); newBlock(l); return; }
      if (!blk) newBlock('');
      if (l.includes('=>')) {                                            // question => answer => explanation
        push(); const [pr, an, ex, ...ev] = l.split('=>');
        if (!an || !an.trim() || !pr.trim()) { skipped.push(l); return; }
        const nm = /^(?:Q\s*)?(\d{1,2})\s*[.)\-:]/i.exec(pr.trim()); const num = nm ? Number(nm[1]) : expect + 1; expect = num;
        blk.qs.push({ num, prompt: pr.replace(/^(?:Q\s*)?\d{1,3}\s*[.)\-:]\s*/i, '').trim(), options: [], answer: an.trim(), explanation: String(ex || '').trim(), evidence: ev.join('=>').trim() }); return;
      }
      if ((m = P_ANS.exec(l))) { if (cur) { cur.answer = m[1].trim(); lastField = 'answer'; } else skipped.push(l); return; }
      if ((m = P_EVI.exec(l))) { const t = cur || blk.qs[blk.qs.length - 1]; if (t) t.evidence = m[1].trim(); else skipped.push(l); return; }
      if ((m = P_EXP.exec(l))) { const t = cur || blk.qs[blk.qs.length - 1]; if (t) { t.explanation = m[1].trim(); lastField = 'explanation'; if (!cur) cur = t, cur._done = true; } else skipped.push(l); return; }
      const numbered = P_NUM.exec(l);
      if (!numbered && (m = P_OPT.exec(l))) {
        if (cur && !cur.answer && !cur._done) { cur.options.push(m[1] + '. ' + m[2]); return; }          // option of a multiple-choice question
        if (!blk.qs.length && !cur) { blk.shared.push(m[1] + '. ' + m[2]); return; }                     // the option list of the group, typed once
        skipped.push(l); return;
      }
      if (cur && cur._done) { if (lastField === 'explanation' && !numbered) { cur.explanation += ' ' + l; return; } cur = null; }
      if (cur && cur.answer && lastField === 'explanation' && !numbered) { cur.explanation += ' ' + l; return; }
      if (cur && !cur.answer && !numbered) { cur.prompt += ' ' + l; return; }
      // instruction lines under the heading join it ("What do the students say about EACH source?" is one, a question is not)
      if (!cur && !numbered && !blk.qs.length && blk.head && !(/\?\s*$/.test(l) && !/^(?:which paragraph|do the following|which section)/i.test(l) && !/\b(?:each|following)\b/i.test(l)) && !/_{2,}/.test(l) && !/^[A-Za-z]/.test(l.slice(0, 1) === '(' ? 'x' : '') ) { blk.head += ' ' + l; return; }
      push();
      const num = numbered ? Number(numbered[1]) : expect + 1;
      cur = { num, prompt: (numbered ? numbered[2] : l).trim(), options: [], answer: '', explanation: '', evidence: '' }; lastField = '';
      expect = num + Math.max(0, ((key[num] && /^[A-J](,[A-J])+$/.test(key[num].ans)) ? key[num].ans.split(',').length : 1) - 1);
    });
    push();
    blocks.forEach((b) => b.qs.forEach((q) => { delete q._done; }));
    // a list of endings / words / features printed AFTER the questions was read as the options of the last one: it is the
    // group's list (every question is answered with a letter or a roman number)
    blocks.forEach((b) => {
      const last = b.qs[b.qs.length - 1];
      if (b.shared.length || b.qs.length < 2 || !last || last.options.length < 2 || b.qs.slice(0, -1).some((q) => q.options.length)) return;
      if (b.qs.every((q) => /^[A-Za-z]$/.test(String(q.answer || '').trim()) || ROMANS.test(String(q.answer || '').trim()))) { b.shared = last.options; last.options = []; }
    });
    const cleanHead = (h) => String(h || '').replace(/^(?:questions?|savollar)\s+\d+\s*(?:(?:[-–—]|to|dan)\s*\d+)?\s*[:.\-–—]?\s*/i, '').replace(/\s*\b(?:TRUE|YES)\s+if the statement[\s\S]*$/i, '').replace(/\s*\b(?:List of (?:Headings|\w+))\s*$/i, '').trim().replace(/^.{0,11}$/, '');   // the player writes “Questions 1–5” and the TRUE/FALSE key itself
    blocks.forEach((b) => { const nm = /(\d+)/.exec(b.head); b.num = nm ? nm[1] : ''; b.head = cleanHead(b.head); });
    return { blocks: blocks.filter((b) => b.qs.length), skipped };
  }
  function detectType(q, shared) {
    const a = String(q.answer || '').trim(), A = a.toUpperCase().replace(/[\s_-]+/g, ' ');
    if (['TRUE', 'FALSE', 'T', 'F'].includes(A) || (A === 'NOT GIVEN' && !/\b(yes|no)\b/i.test(q.prompt))) return 'tfng';
    if (['YES', 'NO', 'Y', 'N'].includes(A)) return 'ynng';
    if (q.options.length >= 2) return /^[A-H](\s*[,&/ ]\s*[A-H])+$/.test(A) ? 'mcq-multi' : 'mcq';
    if (shared.length >= 2 && (/^[A-Za-z]$/.test(a) || ROMANS.test(a))) return 'matching';
    return 'short';
  }
  /* -> { groups, skipped } ; forced = 'auto' or a type */
  function parseGroups(text, forced, passage, keepNum, key) {
    const raw = parseRaw(text, key); const L = draft && draft.type === 'listening'; const groups = [];
    raw.blocks.forEach((b) => {
      let cur = null, first = true;
      // a YES / NO block keeps its NOT GIVEN answers as YES/NO/NG (and TRUE/FALSE likewise)
      const yn = b.qs.some((q) => /^(yes|no|y|n)$/i.test(String(q.answer || '').trim())), tf = b.qs.some((q) => /^(true|false)$/i.test(String(q.answer || '').trim()));
      if (yn !== tf && b.qs.every((q) => /^(yes|no|y|n|true|false|t|f|not\s*given|ng)$/i.test(String(q.answer || '').trim()))) b.forceType = yn ? 'ynng' : 'tfng';
      const allLetters = b.qs.length && b.qs.every((q) => /^[A-J]$/.test(String(q.answer || '').trim()) && !(q.options || []).length);
      if (allLetters && (!forced || forced === 'auto') && (b.shared.length >= 2 || /paragraph|section|letter|list of|[A-J]\s*[\u2013\u2014-]\s*[A-J]/i.test(b.head))) {
        if (b.shared.length < 2) { const hm = /\bA\s*[\u2013\u2014-]\s*([B-L])\b/.exec(b.head); const last = hm ? hm[1] : b.qs.reduce((mx, q) => (q.answer > mx ? q.answer : mx), 'D'); b.shared = 'ABCDEFGHIJKL'.slice(0, last.charCodeAt(0) - 64).split(''); }
        // "Label the map / plan / diagram": letters on a picture
        b.forceType = /\blabel\b.{0,30}\b(?:map|plan|diagram)\b|\b(?:map|plan)\b.{0,40}\bletter/i.test(b.head) && b.shared.every((o) => /^[A-L]\.?$/.test(String(o).trim())) ? 'map' : 'matching';
      }
      b.qs.forEach((q) => {
        let type = forced && forced !== 'auto' ? forced : (b.forceType || detectType(q, b.shared));
        if (L) type = ({ short: 'gap', completion: 'gap', tfng: 'gap', ynng: 'gap' })[type] || type;
        if (!(cur && cur.type === type)) { cur = { type, passage: passage || 1, group: first ? b.head : '', blockTitle: '', options: [], items: [], _num: b.num, _first: q.num }; first = false; groups.push(cur); }
        if (SHARED_OPTS.includes(type) && !cur.options.length) cur.options = (b.shared.length ? b.shared : q.options).slice();
        cur.items.push({ prompt: q.prompt, answer: normAnswer(type, q.answer), explanation: q.explanation, evidence: q.evidence || '', title: '', options: SHARED_OPTS.includes(type) ? [] : (q.options || []).slice() });
      });
    });
    if (!keepNum) groups.forEach((g) => { delete g._num; delete g._first; });
    return { groups, skipped: raw.skipped };
  }
  /* ═════════ Fill the form from a PDF (or its text), no marks needed ═════════
     The text of a test is cut into its parts the way a person reads it:
       * the tail sections: ANSWERS / Answer key (answers + explanations, by question number), Transcript / Audioscript,
         Model answer;
       * the passage = the long runs of running text (long lines that are not questions, options or instructions);
       * everything else = the questions, read by parseGroups() ("Questions 1–5" blocks, numbered questions, options,
         numbered gaps inside notes), each group put into its passage / part by its question numbers. */
  const TRANS_HEAD = /^(?:audio\s*-?\s*scripts?|tape\s*-?\s*scripts?|transcripts?|recording\s*scripts?|listening\s*scripts?)\b[\s:.\-–—]*(?:for\b.*|test\s*\d.*|\d.*)?$/i;
  const MODEL_HEAD = /^(?:(?:model|sample|example|suggested)\s+(?:answers?|essays?|responses?|reports?|letters?)|band\s*[5-9](?:\.5)?\s+(?:answers?|samples?|essays?|responses?))\b.{0,40}$/i;
  const PASS_MARK = /^(?:READING\s+)?PASSAGE\s*([123])\b(?:\s*[:.\-–—]\s*(.*))?$/i;
  const SPEND = /^you should spend about \d+ minutes on questions?\s*(\d+)\s*[-–—]\s*(\d+)[^\n]*?passage\s*([123])/i;
  const INTRO = /^(?:you should spend about \d+ minutes\b|reading passage\s*[123]\b.{0,40}$|(?:READING\s+)?PASSAGE\s*[123]\b.{0,60}$|(?:IELTS\s+)?(?:academic\s+)?(?:reading|listening|writing|speaking)(?:\s+test\s*\d*)?\s*$|test\s*\d+\s*$)/i;
  const PART_MARK = /^(?:part|section)\s*([1-4])\b\s*[:.\-–—]?\s*(.{0,60})$/i;
  const keyHeadAt = (l) => KEY_HEAD.test(l) && l.length < 80 && !/write|boxes|choose|sheet/i.test(l);
  /* "1 TRUE   2 FALSE   3 C" (an answer key printed in columns) -> one answer per line */
  function keyLines(text) {
    return String(text || '').split('\n').reduce((out, line) => {
      line.split(/\s{3,}|\t+/).forEach((piece) => {
        const p = piece.trim(); if (!p) return;
        const parts = p.split(/\s+(?=(?:Q\s*)?\d{1,2}\s*[.):]?\s+\S)/i); let acc = '', last = 0;
        parts.forEach((x) => { const n = Number((/^(?:Q\s*)?(\d{1,2})/i.exec(x) || [])[1] || 0); if (acc && n && n > last && n <= last + 3) { out.push(acc); acc = x; last = n; } else { acc = acc ? acc + ' ' + x : x; if (!last && n) last = n; } });
        if (acc) out.push(acc);
      });
      return out;
    }, []).join('\n');
  }
  /* the tail sections of the text: answer key, transcript, model answers (each runs to the next one) */
  function cutSections(text) {
    const lines = dropWatermarks(text).split('\n'); const heads = [];
    lines.forEach((l, i) => { const t = l.trim(); if (!t) return; if (keyHeadAt(t)) heads.push({ i, kind: 'key' }); else if (TRANS_HEAD.test(t) && t.length < 70) heads.push({ i, kind: 'transcript' }); });
    const out = { main: '', key: {}, keyText: '', transcript: '' };
    const firstAt = heads.length ? heads[0].i : lines.length; out.main = lines.slice(0, firstAt).join('\n');
    heads.forEach((h, k) => {
      const body = lines.slice(h.i + 1, k + 1 < heads.length ? heads[k + 1].i : lines.length).join('\n');
      if (h.kind === 'key') out.keyText += '\n' + body; else out.transcript += (out.transcript ? '\n' : '') + body.trim();
    });
    if (out.keyText.trim()) out.key = splitKey('ANSWERS\n' + keyLines(out.keyText)).key;
    return out;
  }
  const GAP_LINE = /\d{1,2}\s*(?:\.{3,}|…+|_{3,})|(?:\.{3,}|…+|_{3,})\s*\d{1,2}\b|_{3,}/;
  const isQLine = (t) => P_HEAD.test(t) || P_INSTR.test(t) || P_NUM.test(t) || GAP_LINE.test(t) || /^(?:TRUE|FALSE|NOT GIVEN|YES|NO)\b/.test(t) || /^(?:list of\b|nb\b|write\b|choose\b|in boxes\b|answer the\b|look at\b|use no more\b)/i.test(t) || P_ANS.test(t) || P_EXP.test(t);
  /* a line of the passage: long running text, not a question / instruction (a long "A …" is a paragraph, a short one an option) */
  const proseLine = (t) => t.length >= 52 && !isQLine(t) && !INTRO.test(t) && !(P_OPT.test(t) && t.length < 78 && !/^[A-J]\s{2,}/.test(t));
  /* -> { runs: [{ from, to, chars }], lines } ; a run is a stretch of passage text (it ends at the first question line) */
  function proseRuns(lines) {
    const runs = []; let cur = null;
    lines.forEach((l, i) => {
      const t = l.trim();
      if (t && (INTRO.test(t) || (isQLine(t) && !proseLine(t)))) { if (cur) { runs.push(cur); cur = null; } return; }
      if (proseLine(t)) { if (!cur) cur = { from: i, to: i, chars: 0, n: 0 }; cur.to = i; cur.chars += t.length; cur.n += 1; }
      else if (cur && t && t.length >= 52) { runs.push(cur); cur = null; }   // a long line that is not text (an instruction) ends it too
    });
    if (cur) runs.push(cur);
    // a real passage is long: when there is one, the short runs (a long instruction, an example) are questions;
    // a short text (one extract, a sample) still gets its longest run as the passage
    const ok = runs.filter((r) => r.n >= 2 && r.chars >= 160); const big = ok.filter((r) => r.n >= 3 && r.chars >= 450);
    return big.length ? big : ok.sort((a, b) => b.chars - a.chars).slice(0, 1);
  }
  /* PDF lines of a passage -> paragraphs (empty line between) and "A. " paragraph letters, words split at a line end joined */
  function reflow(lines) {
    const ts = lines.map((l) => l.replace(/\s+$/, ''));
    const lens = ts.map((l) => l.trim().length).filter((n) => n > 30).sort((a, b) => a - b); const med = lens[Math.floor(lens.length / 2)] || 80;
    const paras = []; let cur = '', next = 'A', prevLen = 0;
    const flush = () => { if (cur.trim()) paras.push(cur.trim()); cur = ''; };
    ts.forEach((raw) => {
      const t = raw.trim();
      if (!t) { flush(); prevLen = 0; return; }
      if (t === next || t === next + '.') { flush(); cur = next + '. '; next = String.fromCharCode(next.charCodeAt(0) + 1); prevLen = 0; return; }   // a paragraph letter on its own line
      const m = /^([A-J])(?:\s{2,}|\t|[.)]\s+)(\S.*)$/.exec(t);
      if (m && m[1] === next && (!cur || /[.!?"”’)]$/.test(cur.trim()))) { flush(); cur = m[1] + '. ' + m[2]; next = String.fromCharCode(next.charCodeAt(0) + 1); prevLen = t.length; return; }
      const endsSentence = /[.!?"”’:)]$/.test(cur.trim());
      if (cur && endsSentence && prevLen && prevLen < med * 0.72) flush();          // the short last line of a paragraph
      if (!cur || /\.\s$/.test(cur)) cur += t;
      else if (/[a-z]-$/.test(cur) && /^[a-z]/.test(t)) cur = cur.slice(0, -1) + t;  // a word split at the end of a line
      else cur += ' ' + t;
      prevLen = t.length;
    });
    flush();
    return paras.join('\n\n');
  }
  /* the title right above a passage: a short line that is not an instruction (and not the paragraph letter A) */
  function titleAbove(lines, at) {
    for (let i = at - 1; i >= 0 && i >= at - 4; i--) {
      const t = lines[i].trim(); if (!t) continue;
      if (INTRO.test(t) || isQLine(t) || t.length > 110 || /^[A-J]$/.test(t)) return null;
      return { i, text: t.replace(/\s{2,}/g, ' ') };
    }
    return null;
  }
  const groupNo = (g) => { const m = /(\d+)/.exec(g._num || ''); return m ? Number(m[1]) : Number(g._first) || 0; };
  /* the question part of a chunk: intro lines left out, and anything before the first question / heading (a book
     title, a running header) is not a question either */
  const cleanQText = (lines) => {
    const ls = lines.filter((l) => !INTRO.test(l.trim()));
    const first = ls.findIndex((l) => { const t = l.trim(); return P_HEAD.test(t) || P_INSTR.test(t) || P_NUM.test(t) || GAP_LINE.test(t); });
    return (first > 0 ? ls.slice(first) : first < 0 ? [] : ls).join('\n');
  };

  /* Reading: part (one passage) or full (three) */
  function smartReading(text, full) {
    const sec = cutSections(text); const all = sec.main.split('\n');
    // passage markers ("READING PASSAGE 2") and "You should spend … Questions 14–26 … Reading Passage 2" give the ranges
    const ranges = {}; all.forEach((l) => { const m = SPEND.exec(l.trim()); if (m) ranges[m[3]] = [Number(m[1]), Number(m[2])]; });
    const chunks = [];
    if (full) {
      let cur = { n: 1, lines: [], title: '' };
      all.forEach((l) => { const t = l.trim(); const m = PASS_MARK.exec(t) || (SPEND.exec(t) && [null, SPEND.exec(t)[3], '']);
        if (m && Number(m[1]) !== cur.n && (cur.lines.some((x) => x.trim()) || Number(m[1]) > 1)) { chunks.push(cur); cur = { n: Number(m[1]), lines: [], title: '' }; }
        if (m && m[2] && !cur.title) cur.title = m[2].trim();
        cur.lines.push(l); });
      chunks.push(cur);
    } else chunks.push({ n: 1, lines: all, title: '' });
    const marked = chunks.length > 1;
    const passages = [{ title: '', passage: '' }, { title: '', passage: '' }, { title: '', passage: '' }]; const qparts = []; let pn = 0;
    chunks.forEach((ch) => {
      const runs = proseRuns(ch.lines); const used = new Set();
      // with markers (or a Part test) all long runs of the chunk are its passage; without markers every run is the next
      // passage (the three longest when there are more)
      let sets = [runs];
      if (full && !marked) sets = (runs.length > 3 ? runs.map((r, i) => ({ r, i })).sort((a, b) => b.r.chars - a.r.chars).slice(0, 3).sort((a, b) => a.i - b.i).map((x) => x.r) : runs).map((r) => [r]);
      sets.forEach((rs) => {
        if (!rs.length) return;
        const k = marked ? ch.n - 1 : full ? Math.min(2, pn++) : 0;
        const title = titleAbove(ch.lines, rs[0].from); if (title) used.add(title.i);
        const body = []; rs.forEach((r) => { for (let i = r.from; i <= r.to; i++) { used.add(i); body.push(ch.lines[i]); } body.push(''); });
        passages[k] = { title: (ch.title || (title && title.text) || '').slice(0, 200), passage: reflow(body) };
      });
      qparts.push({ n: marked ? ch.n : 0, text: cleanQText(ch.lines.filter((_, i) => !used.has(i))) });
    });
    const groups = []; const skipped = [];
    qparts.forEach((q) => {
      if (!q.text.trim()) return;
      const r = parseGroups(q.text, 'auto', q.n || 1, true, sec.key); r.skipped.forEach((x) => skipped.push(x));
      r.groups.forEach((g) => {
        const n = groupNo(g);
        if (full && n) { const hit = Object.entries(ranges).find(([, [a, b]]) => n >= a && n <= b); g.passage = hit ? Number(hit[0]) : n <= 13 ? 1 : n <= 26 ? 2 : 3; }
        else if (full && !q.n) g.passage = groups.length ? groups[groups.length - 1].passage : 1;
        delete g._num; delete g._first; groups.push(g);
      });
    });
    return { passages, groups, skipped, keyCount: Object.keys(sec.key).length };
  }

  /* Listening: questions (parts by their numbers), answer key, transcript */
  function smartListening(text, full) {
    const sec = cutSections(text);
    const lines = sec.main.split('\n').map((l) => { const t = l.trim(); const m = PART_MARK.exec(t); if (!m) return l; return P_HEAD.test(m[2]) ? m[2] : ''; });   // "SECTION 1" lines are not questions
    const r = parseGroups(cleanQText(lines), 'auto', 1, true, sec.key);
    let firstNo = 0;
    r.groups.forEach((g) => { const n = groupNo(g); if (!firstNo && n) firstNo = n; if (full) g.passage = n ? Math.min(4, Math.max(1, Math.ceil(n / 10))) : 1; delete g._num; delete g._first; });
    // a full transcript keeps "PART 2" lines: the results page makes one tab per part from them
    const transcript = sec.transcript.split('\n').map((l) => { const m = PART_MARK.exec(l.trim()); return m ? 'PART ' + m[1] : l.trim(); }).filter(Boolean).join('\n');
    return { groups: r.groups, skipped: r.skipped, transcript, section: firstNo ? 'Section ' + Math.min(4, Math.ceil(firstNo / 10)) : '', keyCount: Object.keys(sec.key).length };
  }

  /* Writing: "WRITING TASK 1 / 2", the time and word limits, model answers after each task */
  function smartWriting(text) {
    const lines = dropWatermarks(text).split('\n'); const tasks = {}; let cur = null, mode = 'prompt';
    lines.forEach((l) => {
      const t = l.trim(); let m;
      if ((m = /^(?:writing\s+)?task\s*([12])\b\s*[:.\-–—]?\s*(.*)$/i.exec(t)) && t.length < 60 && !/model|sample/i.test(t)) { cur = tasks[m[1]] = tasks[m[1]] || { n: Number(m[1]), prompt: [], sample: [] }; mode = 'prompt'; if (m[2]) cur.prompt.push(m[2]); return; }
      if (MODEL_HEAD.test(t) || /^(?:task\s*[12]\s+)?(?:model|sample)\s+answer/i.test(t)) { const tm = /task\s*([12])/i.exec(t); if (tm) cur = tasks[tm[1]] = tasks[tm[1]] || { n: Number(tm[1]), prompt: [], sample: [] }; if (!cur) cur = tasks[1] = { n: 1, prompt: [], sample: [] }; mode = 'sample'; return; }
      if (!cur) { if (t) { cur = tasks[1] = { n: 1, prompt: [], sample: [] }; } else return; }
      if (mode === 'prompt') {
        if ((m = /you should spend about (\d+) minutes on this task/i.exec(t))) { cur.minutes = Number(m[1]); const rest = t.replace(m[0], '').replace(/^[.\s]+/, ''); if (rest) cur.prompt.push(rest); return; }
        // "Write at least 150 words." ends the task: what follows (a chart's labels and numbers) is not part of the question
        if ((m = /^write at least (\d+) words\.?$/i.exec(t))) { cur.minWords = Number(m[1]); mode = 'done'; return; }
        cur.prompt.push(l);
      } else if (mode === 'sample') cur.sample.push(l);
    });
    // a chart drawn in the PDF leaves short labels and numbers in the text: a paragraph with no full stop and few words is one
    const tidy = (ls, prompt) => reflow(ls).split('\n\n').filter((p) => !prompt || /[.?!:]/.test(p) || p.split(/\s+/).length >= 12).join('\n\n').replace(/^\s+|\s+$/g, '');
    return Object.values(tasks).sort((a, b) => a.n - b.n).map((x) => ({ n: x.n, prompt: tidy(x.prompt, true), sample: tidy(x.sample), minutes: x.minutes, minWords: x.minWords })).filter((x) => x.prompt || x.sample);
  }

  /* Speaking: PART 1 questions, PART 2 cue card, PART 3 questions */
  function smartSpeaking(text) {
    const lines = dropWatermarks(text).split('\n'); const parts = {}; let cur = null;
    lines.forEach((l) => {
      const t = l.trim(); if (!t) return; let m;
      if ((m = /^part\s*([123])\b\s*[:.\-–—]?\s*(.{0,80})$/i.exec(t))) { cur = parts[m[1]] = parts[m[1]] || { n: Number(m[1]), topic: m[2] || '', lines: [] }; return; }
      if (!cur) cur = parts[1] = { n: 1, topic: '', lines: [] };
      cur.lines.push(t);
    });
    const qOf = (ls) => ls.map((x) => x.replace(/^(?:[-•●▪*]|\d{1,2}[.)])\s*/, '').trim()).filter((x) => /\?$/.test(x));
    return Object.values(parts).sort((a, b) => a.n - b.n).map((p) => {
      if (p.n === 2) {   // the cue card is the whole text; follow-up questions after it stay questions
        const qs = []; const card = p.lines.filter((x) => { if (/\?$/.test(x) && !/^describe\b/i.test(x)) { qs.push(x.replace(/^(?:[-•●▪*]|\d{1,2}[.)])\s*/, '')); return false; } return true; });
        return { n: 2, prompt: card.map((x) => x.replace(/^[•●▪*]\s*/, '- ')).join('\n'), questions: qs, topic: p.topic };
      }
      const qs = qOf(p.lines); const intro = p.lines.filter((x) => !/\?$/.test(x) && x.length < 80 && !/^(?:[-•●▪*]|\d{1,2}[.)])/.test(x));
      return { n: p.n, prompt: p.topic || (intro.length && intro.length <= 2 ? intro.join(' · ') : ''), questions: qs, topic: p.topic };
    }).filter((p) => p.prompt || p.questions.length);
  }

  /* run the right reader and put the result into the form; returns the lines of the report shown under the import box */
  function fillFromText(text) {
    const t = draft.type, d = draft.data, full = d.mode === 'full'; const rep = []; let skipped = [];
    const qCount = (gs) => gs.reduce((n, g) => n + g.items.reduce((k, it) => k + (g.type === 'mcq-multi' ? Math.max(t === 'listening' ? 2 : 1, gLetters(it.answer).length) : 1), 0), 0), withAns = (gs) => qCount(gs.map((g) => ({ ...g, items: g.items.filter((it) => String(it.answer || '').trim()) }))), withExp = (gs) => gs.reduce((n, g) => n + g.items.filter((it) => String(it.explanation || '').trim()).length, 0);
    const words = (s) => String(s || '').split(/\s+/).filter(Boolean).length;
    if (t === 'reading') {
      const r = smartReading(text, full); skipped = r.skipped;
      if (full) { d.passages = r.passages; r.passages.forEach((p, k) => { if (p.passage) rep.push('Passage ' + (k + 1) + (p.title ? ' “' + p.title + '”' : '') + ': ' + words(p.passage) + ' words'); }); }
      else { d.passage = r.passages[0].passage; if (r.passages[0].passage) rep.push('Passage' + (r.passages[0].title ? ' “' + r.passages[0].title + '”' : '') + ': ' + words(d.passage) + ' words'); if (!draft.title && r.passages[0].title) draft.title = r.passages[0].title; }
      if (!rep.length) rep.push('⚠ No passage text found (no long paragraphs). Paste it into the passage box yourself.');
      draft.groups = r.groups.length ? r.groups : [newGroup('short')];
      rep.push(qCount(r.groups) + ' questions in ' + r.groups.length + ' group(s)', withAns(r.groups) + ' with an answer' + (r.keyCount ? ' (answer key: ' + r.keyCount + ')' : ''), withExp(r.groups) + ' with an explanation');
    } else if (t === 'listening') {
      const r = smartListening(text, full); skipped = r.skipped;
      draft.groups = r.groups.length ? r.groups : [newGroup('gap')];
      if (r.transcript) { d.transcript = r.transcript; rep.push('Transcript: ' + words(r.transcript) + ' words'); }
      if (!full && r.section) { d.sectionLabel = r.section; rep.push('Card tag: ' + r.section + ' (from the question numbers)'); }
      rep.push(qCount(r.groups) + ' questions in ' + r.groups.length + ' group(s)' + (full ? ' · Parts: ' + [1, 2, 3, 4].map((p) => qCount(r.groups.filter((g) => g.passage === p))).join(' / ') : ''), withAns(r.groups) + ' with an answer' + (r.keyCount ? ' (answer key: ' + r.keyCount + ')' : ''), withExp(r.groups) + ' with an explanation');
    } else if (t === 'writing') {
      const ts = smartWriting(text); if (!ts.length) return ['⚠ No “Task 1” / “Task 2” text found.'];
      d.tasks = ts.map((x) => { const b = blankTask(x.n); return { ...b, prompt: x.prompt, sample: x.sample, minutes: x.minutes || b.minutes, minWords: x.minWords || b.minWords }; });
      ts.forEach((x) => rep.push('Task ' + x.n + ': ' + words(x.prompt) + ' words of question' + (x.sample ? ' · model answer ' + words(x.sample) + ' words' : '')));
      if (!full && ts.length > 1) rep.push('Two tasks found: this is a full test. Use “→ Full” on its card after saving, or remove one task.');
      if (ts.some((x) => x.n === 1)) rep.push('Task 1 chart: pick its page below and add it as the Task 1 picture.');
    } else if (t === 'speaking') {
      const ps = smartSpeaking(text); if (!ps.length) return ['⚠ No “Part 1 / Part 2 / Part 3” text found.'];
      d.parts = ps.map((x) => ({ ...blankPart(x.n), prompt: x.prompt, questions: x.questions }));
      ps.forEach((x) => rep.push('Part ' + x.n + ': ' + (x.n === 2 ? 'cue card' + (x.questions.length ? ' + ' + x.questions.length + ' questions' : '') : x.questions.length + ' questions')));
    }
    if (skipped.length) rep.push('⚠ ' + skipped.length + ' line(s) not understood, e.g. “' + String(skipped[0]).slice(0, 60) + '…” — check the groups');
    return rep;
  }
  let impDoc = null;                                   // the PDF opened in the import block (its pages can be cut into pictures)
  function importBlock() {
    const t = draft.type; const what = { reading: 'the passage' + (draft.data.mode === 'full' ? 's' : '') + ', every question group with its answer and explanation', listening: 'every question group (Parts by their numbers), the answers and explanations from the answer key, the transcript', writing: 'the Task 1 / Task 2 questions, time and word limits, model answers', speaking: 'Part 1 questions, the Part 2 cue card, Part 3 questions' }[t];
    return `<div class="cb-block cb-import"><div class="cb-head"><div><strong>⚡ Fill from a PDF — or paste the whole text</strong><div class="muted sm">Upload the test as it is (no marks needed): ${what} are put into their places. The PDF is read in this browser. Then look through the form and fix what the checker shows.</div></div>
      <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="imp-pdf" type="button">⬆ Upload PDF</button><button class="btn btn-sm" data-cb="imp-toggle" type="button">Paste text</button><a class="btn btn-sm" href="/assets/samples/${t}-${draft.data.mode === 'full' ? 'full' : 'part'}.pdf" target="_blank" rel="noopener" title="A sample test laid out the way this form reads it — try it, or copy its layout">📄 Sample PDF</a></div></div>
      <div class="muted sm" id="imp-status"></div>
      <div id="imp-box" ${draft._import ? '' : 'hidden'}><textarea class="field cb-mono" id="imp-text" rows="10" placeholder="Paste everything here: the passage, the questions, the ANSWERS / answer key with explanations${t === 'listening' ? ', the transcript' : ''}…">${esc(draft._import || '')}</textarea>
        <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="imp-do" type="button">Fill the form from this text</button><span class="muted sm">Replaces what is in the form now.</span></div></div>
      <div id="imp-report">${draft._report ? `<ul class="cb-report">${draft._report.map((x) => `<li class="${/^⚠/.test(x) ? 'warn' : ''}">${esc(x)}</li>`).join('')}</ul>` : ''}</div>
      <div id="imp-pages">${impDoc ? pagesStrip() : ''}</div></div>`;
  }
  function pagesStrip() {
    return `<div class="cb-pages"><span class="muted sm">PDF pages — open one to cut a chart / map / diagram out of it:</span>${Array.from({ length: impDoc.pages }, (_, i) => `<button class="chip" data-cb="imp-page" data-n="${i + 1}" type="button">${i + 1}</button>`).join('')}</div><div id="imp-crop"></div>`;
  }
  /* where a picture cut from the PDF can go, for this kind of test */
  function picTargets() {
    const t = draft.type, d = draft.data; const out = [];
    if (t === 'writing') (d.tasks || []).forEach((x, i) => out.push(['task:' + i, (x.title || 'Task ' + (i + 1)) + ' picture']));
    if (t === 'speaking') (d.parts || []).forEach((x, i) => out.push(['part:' + i, String(x.title || 'Part ' + (i + 1)).split('·')[0].trim() + ' picture']));
    if (t === 'reading' || t === 'listening') out.push(['images', t === 'listening' ? 'Pictures (map / plan / diagram)' : 'Pictures for the passage']);
    if (d.mode !== 'full' && (t === 'reading' || t === 'listening' || t === 'writing')) out.push(['cover', 'Card picture']);
    return out;
  }
  async function showPage(n) {
    const box = $('#imp-crop'); if (!box || !impDoc) return;
    box.innerHTML = '<div class="muted sm">Drawing page ' + n + ' …</div>';
    const c = await impDoc.render(n, 2); c.className = 'cb-crop-canvas'; c.dataset.n = n;
    box.innerHTML = `<div class="muted sm">Page ${n}. Drag over the picture to select it (or use the whole page).</div><div class="cb-crop" id="imp-crop-area"><div class="cb-crop-sel" id="imp-sel" hidden></div></div>
      <div class="btn-row"><select class="field" id="imp-target" style="width:auto">${picTargets().map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select><button class="btn btn-sm btn-primary" data-cb="imp-cut" type="button">Add selected area</button><button class="btn btn-sm" data-cb="imp-cut" data-whole="1" type="button">Add whole page</button></div>`;
    $('#imp-crop-area').prepend(c);
    const area = $('#imp-crop-area'), sel = $('#imp-sel'); let start = null;
    const pos = (e) => { const r = c.getBoundingClientRect(); return { x: Math.max(0, Math.min(r.width, e.clientX - r.left)), y: Math.max(0, Math.min(r.height, e.clientY - r.top)) }; };
    area.onpointerdown = (e) => { start = pos(e); area.setPointerCapture(e.pointerId); sel.hidden = false; Object.assign(sel.style, { left: start.x + 'px', top: start.y + 'px', width: '0px', height: '0px' }); e.preventDefault(); };
    area.onpointermove = (e) => { if (!start) return; const p = pos(e); Object.assign(sel.style, { left: Math.min(p.x, start.x) + 'px', top: Math.min(p.y, start.y) + 'px', width: Math.abs(p.x - start.x) + 'px', height: Math.abs(p.y - start.y) + 'px' }); };
    area.onpointerup = () => { start = null; if (parseFloat(sel.style.width) < 8 || parseFloat(sel.style.height) < 8) sel.hidden = true; };
  }
  async function cutPicture(whole) {
    const c = $('#imp-crop-area canvas'), sel = $('#imp-sel'); if (!c) return;
    const r = c.getBoundingClientRect(); const k = c.width / r.width;
    const box = whole || sel.hidden ? { x: 0, y: 0, w: c.width, h: c.height } : { x: parseFloat(sel.style.left) * k, y: parseFloat(sel.style.top) * k, w: parseFloat(sel.style.width) * k, h: parseFloat(sel.style.height) * k };
    const out = document.createElement('canvas'); out.width = Math.round(box.w); out.height = Math.round(box.h);
    out.getContext('2d').drawImage(c, box.x, box.y, box.w, box.h, 0, 0, out.width, out.height);
    const blob = await new Promise((res) => out.toBlob(res, 'image/jpeg', 0.9)); if (!blob) return toast('Could not make the picture.', true);
    const file = new File([blob], 'pdf-page-' + c.dataset.n + '.jpg', { type: 'image/jpeg' });
    const status = $('#imp-status'); uploading++; syncSave(); if (status) status.textContent = 'Uploading the picture …';
    try {
      const url = await uploadFile(file); const target = ($('#imp-target') || {}).value || 'images'; const d = draft.data;
      if (target === 'images') (d.images = d.images || []).push({ url, caption: '', passage: 1 });
      else if (target === 'cover') d.coverUrl = url;
      else if (target.startsWith('task:')) d.tasks[Number(target.slice(5))].imageUrl = url;
      else if (target.startsWith('part:')) d.parts[Number(target.slice(5))].imageUrl = url;
      toast('Picture added'); renderBuilder(); autosave();
    } catch (e) { fail(e); } finally { uploading--; syncSave(); if (status) status.textContent = ''; }
  }
  async function importPdf() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.pdf,application/pdf'; inp.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'; document.body.appendChild(inp);
    const file = await new Promise((res) => { inp.onchange = () => res(inp.files && inp.files[0]); inp.addEventListener('cancel', () => res(null)); inp.click(); });
    inp.remove(); if (!file) return;
    const status = $('#imp-status'); if (status) status.textContent = 'Reading ' + file.name + ' …';
    try {
      if (impDoc) impDoc.close();
      impDoc = await window.IXImport.open(file);
      if (impDoc.scanned) { if (status) status.textContent = ''; draft._report = ['⚠ This PDF has no text in it (it is a scanned picture). Copy the text with an OCR tool (e.g. Google Drive → Open with Google Docs) and paste it with “Paste text”. The pages can still be used as pictures below.']; renderBuilder(); return; }
      runImport(impDoc.text, file.name);
    } catch (e) { if (status) status.textContent = ''; fail(e); }
  }
  function runImport(text, from) {
    if (!String(text || '').trim()) return toast('Nothing to read: the text is empty.', true);
    const hasWork = draft.type === 'reading' || draft.type === 'listening' ? (draft.groups || []).some((g) => g.items.some((it) => it.prompt || it.answer)) : false;
    if (hasWork && !confirm('This replaces the passage(s) and questions already in the form. Continue?')) return;
    draft._import = text; draft._report = fillFromText(text);
    if (!String(draft.title || '').trim() && from) draft.title = from.replace(/\.pdf$/i, '').replace(/[_]+/g, ' ').trim().slice(0, 200);   // no title in the text: the file name
    renderBuilder(); autosave();
    toast((from ? from + ': ' : '') + draft._report[0]);
    if (draft.type === 'reading' || draft.type === 'listening') showIssues(validate());
  }

  function tasksBlock() {
    const ts = draft.data.tasks || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>Writing tasks</strong><div class="muted sm">Usually Task 1 (chart / letter) and Task 2 (essay). Each task is one Part of the exam screen. For a line graph type the numbers and the page draws the chart; otherwise upload a picture.</div></div>${ts.length < 4 ? '<button class="btn btn-sm btn-primary" data-cb="t-add" type="button">+ Task</button>' : ''}</div>
      ${ts.map((t, i) => `<div class="cb-task"><div class="cb-row">${field('Title', `data.tasks.${i}.title`, t.title)}
        <label class="lbl">Type<select class="field" data-p="data.tasks.${i}.kind"><option value="task1" ${t.kind !== 'task2' ? 'selected' : ''}>Task 1 (report / letter)</option><option value="task2" ${t.kind === 'task2' ? 'selected' : ''}>Task 2 (essay)</option></select></label>
        ${field('Minimum words', `data.tasks.${i}.minWords`, t.minWords, 'type="number" min="0"')}${field('Suggested minutes', `data.tasks.${i}.minutes`, t.minutes, 'type="number" min="0"')}</div>
        ${area('Question / instructions', `data.tasks.${i}.prompt`, t.prompt, 5, 'placeholder="The graph below shows … Summarise the information by selecting and reporting the main features, and make comparisons where relevant."')}
        <details class="cb-chart" ${t.chartText ? 'open' : ''}><summary>Line graph from numbers (optional, instead of a picture)</summary>
          <div class="cb-row">${area('Data', `data.tasks.${i}.chartText`, t.chartText, 5, 'class="field cb-mono" placeholder="Years: 1961, 1971, 1981, 1991, 2001&#10;2 + cars: 10, 30, 35, 40, 49&#10;1 car: 30, 39, 39, 37, 39&#10;No car: 70, 39, 30, 20, 10"').replace('class="field" rows', 'rows')}
          ${field('Unit (shown to the examiner)', `data.tasks.${i}.chartUnit`, t.chartUnit, 'placeholder="% of households"')}</div></details>
        <div class="cb-head"><div class="muted sm" id="timg-status-${i}"></div><div class="btn-row"><button class="btn btn-sm" data-cb="t-img" data-i="${i}" type="button">⬆ ${t.imageUrl ? 'Replace' : 'Upload'} chart / picture</button>${t.imageUrl ? `<button class="btn btn-sm btn-danger" data-cb="t-img-del" data-i="${i}" type="button">Remove picture</button>` : ''}${ts.length > 1 ? `<button class="btn btn-sm btn-danger" data-cb="t-del" data-i="${i}" type="button">Delete task</button>` : ''}</div></div>
        ${t.imageUrl ? `<img class="cb-taskimg" src="${esc(t.imageUrl)}" alt="">` : ''}
        ${area('Model answer (optional — shown on the results screen as the sample answer)', `data.tasks.${i}.sample`, t.sample, 4)}</div>`).join('')}</div>`;
  }

  function vocabBlock() {
    const vs = draft.data.vocabulary || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>Vocabulary (${vs.length})</strong><div class="muted sm">Each word is underlined in yellow where it first appears in the text; students tap it to see the meaning. Use “Underline” when the text has another form (e.g. word <em>persist</em>, text <em>persisted</em>).</div></div>
      <div class="btn-row"><button class="btn btn-sm" data-cb="v-bulk" type="button">Paste many</button><button class="btn btn-sm btn-primary" data-cb="v-add" type="button">+ Word</button></div></div>
      <div id="vbulk-box" class="cb-bulk" hidden><div class="muted sm">One word per line, parts separated by <code>|</code> (or columns copied from Excel):<br><code>word | definition | o‘zbekcha | русский | synonym, synonym | example</code><br>You can also paste a JSON list (for example the <code>reviewItems</code> of an old article) — grammar items in it go to the Grammar list.</div>
        <textarea class="field cb-mono" id="vbulk-text" rows="6" placeholder="bioremediation | the use of bacteria to clean polluted land | bakteriyalar yordamida tozalash | биоремедиация | biological clean-up, biotreatment | A gentler option is bioremediation."></textarea>
        <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="v-bulk-do" type="button">Add them</button></div></div>
      ${vs.map((v, i) => `<div class="cb-word"><div class="cb-qn cb-qn-v">V${i + 1}</div><div class="cb-qbody">
        <div class="cb-row">${field('Word / phrase *', `data.vocabulary.${i}.word`, v.word, 'placeholder="bioremediation"')}${field('Underline (if the text uses another form)', `data.vocabulary.${i}.match`, v.match, 'placeholder="optional"')}</div>
        <div>${foundPill(vFound(v), '⚠ not in the text — fill “Underline”').replace('<span', `<span id="vf-${i}"`)}</div>
        ${area('Definition (English) *', `data.vocabulary.${i}.definition`, v.definition, 2)}
        <div class="cb-row">${area('🇺🇿 O‘zbekcha', `data.vocabulary.${i}.definition_uz`, v.definition_uz, 2)}${area('🇷🇺 Русский', `data.vocabulary.${i}.definition_ru`, v.definition_ru, 2)}</div>
        <div class="cb-row">${field('Synonyms (comma separated)', `data.vocabulary.${i}.synonyms`, v.synonyms)}${field('Example sentence', `data.vocabulary.${i}.example`, v.example)}</div>
        ${field('Sentence from the text (optional — taken from the text automatically)', `data.vocabulary.${i}.sourceContext`, v.sourceContext)}</div>
        <div class="cb-side"><button class="btn btn-sm" data-cb="v-up" data-i="${i}" type="button" title="Move up" ${i ? '' : 'disabled'}>↑</button><button class="btn btn-sm btn-danger" data-cb="v-del" data-i="${i}" type="button" title="Delete word">✕</button></div></div>`).join('')}</div>`;
  }
  function grammarBlock() {
    const gs = draft.data.grammar || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>Grammar (${gs.length})</strong><div class="muted sm">Underlined in blue. In “Underline” paste the phrase exactly as it is in the text.</div></div>
      <div class="btn-row"><button class="btn btn-sm" data-cb="gr-bulk" type="button">Paste many</button><button class="btn btn-sm btn-primary" data-cb="gr-add" type="button">+ Grammar point</button></div></div>
      <div id="gbulk-box" class="cb-bulk" hidden><div class="muted sm">One per line: <code>title | pattern | explanation | o‘zbekcha | русский | example | phrase to underline</code></div>
        <textarea class="field cb-mono" id="gbulk-text" rows="4" placeholder="Result clause “such … that” | such + adjective + noun + that | Shows the result of something extreme. | … | … | It was such a hot day that … | such delicate terrain that"></textarea>
        <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="gr-bulk-do" type="button">Add them</button></div></div>
      ${gs.map((g, i) => `<div class="cb-word"><div class="cb-qn cb-qn-g">G${i + 1}</div><div class="cb-qbody">
        <div class="cb-row">${field('Title *', `data.grammar.${i}.title`, g.title, 'placeholder="Conditional inversion"')}${field('Pattern', `data.grammar.${i}.pattern`, g.pattern, 'placeholder="Should + subject + verb"')}</div>
        ${field('Underline (phrase from the text)', `data.grammar.${i}.match`, g.match, 'placeholder="should another spill occur"')}
        <div>${foundPill(gFound(g), 'not underlined (still in the list)').replace('<span', `<span id="gf-${i}"`)}</div>
        ${area('Explanation (English)', `data.grammar.${i}.explanation`, g.explanation, 2)}
        <div class="cb-row">${area('🇺🇿 O‘zbekcha', `data.grammar.${i}.explanation_uz`, g.explanation_uz, 2)}${area('🇷🇺 Русский', `data.grammar.${i}.explanation_ru`, g.explanation_ru, 2)}</div>
        ${field('Example sentence', `data.grammar.${i}.example`, g.example)}</div>
        <div class="cb-side"><button class="btn btn-sm btn-danger" data-cb="gr-del" data-i="${i}" type="button" title="Delete">✕</button></div></div>`).join('')}</div>`;
  }
  function articleForm() {
    const d = draft.data;
    return `
      ${field('Title *', 'title', draft.title, 'placeholder="e.g. How to clean a beach" maxlength="200"')}
      <div class="cb-grid"><label class="lbl">Topic<input class="field" data-p="data.topic" value="${esc(d.topic)}" list="cb-topics" placeholder="History, Science …"></label><datalist id="cb-topics">${TOPICS.map((t) => `<option value="${t}">`).join('')}</datalist>
        <label class="lbl">Level<select class="field" data-p="data.level">${['Passage 1', 'Passage 2', 'Passage 3'].map((p) => `<option ${d.level === p ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
        ${field('Author', 'data.author', d.author)}${field('Date', 'data.date', d.date, 'type="date"')}${field('Test date (optional)', 'data.testDate', d.testDate, 'type="date"')}</div>
      ${area('Lead (short description under the title and on the card) *', 'data.lead', d.lead, 2, 'maxlength="600"')}
      <div class="cb-block"><div class="cb-head"><div><strong>Cover picture</strong><div class="muted sm">Shown on the Articles card and next to the text.</div></div><div class="btn-row"><button class="btn btn-sm" data-cb="a-img" type="button">⬆ ${d.imageUrl ? 'Replace' : 'Upload'} picture</button>${d.imageUrl ? '<button class="btn btn-sm btn-danger" data-cb="a-img-del" type="button">Remove</button>' : ''}</div></div>
        <div class="muted sm" id="aimg-status"></div>${d.imageUrl ? `<div class="cb-row"><img class="cb-taskimg" src="${esc(d.imageUrl)}" alt="">${field('Picture description (alt text)', 'data.imageAlt', d.imageAlt)}</div>` : ''}</div>
      <div class="cb-block"><div class="cb-head"><div><strong>Article text *</strong><div class="muted sm">Empty line = new paragraph. <code>## Heading</code> for a heading. Use “Insert picture” to put a picture inside the text.</div></div><button class="btn btn-sm" data-cb="body-img" type="button">⬆ Insert picture</button></div><div class="muted sm" id="body-status"></div>
        <textarea class="field cb-passage" id="body-text" rows="16" data-p="data.body" placeholder="Paste the article. Leave an empty line between paragraphs.&#10;Start a line with ## for a heading, e.g.&#10;## The human touch">${esc(d.body)}</textarea></div>
      ${field('Source / reference', 'data.source', d.source, 'placeholder="How to clean a beach. Nature 422, 464-466 (2003)."')}
      <div class="cb-grid"><label class="lbl">Who can read it<select class="field" data-p="_access">${ACCESS.map(([v, l]) => `<option value="${v}" ${draft._access === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <div class="cb-checks"><label><input type="checkbox" data-p="published" ${draft.published !== false ? 'checked' : ''}> Published (visible to students)</label></div></div>
      ${vocabBlock()}
      ${grammarBlock()}`;
  }
  function partsBlock() {
    const ps = draft.data.parts || [];
    return `<div class="cb-block"><div class="cb-head"><div><strong>Speaking parts</strong><div class="muted sm">${draft.data.mode === 'full' ? 'A full test has all three parts.' : 'A Part practice card is usually one part: choose which one.'} Part 1: short questions (one per line). Part 2: write the cue card in the big box. Part 3: discussion questions. Pictures, timers and a model answer are optional.</div></div>${ps.length < 3 ? '<button class="btn btn-sm" data-cb="p-add" type="button">+ Part</button>' : ''}</div>
      ${ps.map((t, i) => `<div class="cb-task"><div class="cb-row"><label class="lbl">Which part<select class="field" data-sp-kind="${i}">${[1, 2, 3].map((n) => `<option value="${n}" ${speakNo(t) === n ? 'selected' : ''}>Part ${n}</option>`).join('')}${speakNo(t) ? '' : '<option selected value="0">Other</option>'}</select></label>${field('Title', `data.parts.${i}.title`, t.title)}${field('Preparation (seconds)', `data.parts.${i}.prepSeconds`, t.prepSeconds, 'type="number" min="0"')}${field('Speaking time (seconds)', `data.parts.${i}.speakSeconds`, t.speakSeconds, 'type="number" min="0"')}<button class="btn btn-sm btn-danger" data-cb="p-del" data-i="${i}" type="button" title="Remove this part">✕</button></div>
        <label class="lbl">Cue card / intro text (optional)<textarea class="field" rows="5" data-p="data.parts.${i}.prompt" placeholder="Describe a place you like to visit.&#10;You should say:&#10;- where it is&#10;- what you do there">${esc(t.prompt)}</textarea></label>
        <label class="lbl">Questions, one per line<textarea class="field" rows="6" data-lines="1" data-p="data.parts.${i}.questions" placeholder="What do you do in your free time?">${esc((t.questions || []).join('\n'))}</textarea></label>
        <div class="cb-head"><div class="muted sm" id="pimg-status-${i}"></div><div class="btn-row"><button class="btn btn-sm" data-cb="p-img" data-i="${i}" type="button">⬆ ${t.imageUrl ? 'Replace' : 'Upload'} picture</button>${t.imageUrl ? `<button class="btn btn-sm btn-danger" data-cb="p-img-del" data-i="${i}" type="button">Remove picture</button>` : ''}<button class="btn btn-sm" data-cb="p-audio" data-i="${i}" type="button">⬆ ${t.audioUrl ? 'Replace' : 'Upload'} model-answer audio</button>${t.audioUrl ? `<button class="btn btn-sm btn-danger" data-cb="p-audio-del" data-i="${i}" type="button">Remove audio</button>` : ''}</div></div>
        ${t.imageUrl ? `<img class="cb-taskimg" src="${esc(t.imageUrl)}" alt="">` : ''}${t.audioUrl ? `<audio controls preload="none" src="${esc(t.audioUrl)}" style="width:100%;margin-top:8px"></audio>` : ''}
        <label class="lbl">Model answer (optional, the student can reveal it)<textarea class="field" rows="4" data-p="data.parts.${i}.sample">${esc(t.sample)}</textarea></label></div>`).join('')}</div>`;
  }
  function renderBuilder() {
    const t = draft.type, d = draft.data;
    if (t === 'article') { $('#builder-body').innerHTML = articleForm(); return syncSave(); }
    $('#builder-body').innerHTML = `
      ${draft._ai ? aiBanner() : ''}
      ${t === 'reading' ? readingFormatBlock() : t === 'speaking' && d.mode === 'full' ? fullBlock('speaking') : cardBlock(t, d)}
      ${MODE_TYPES.includes(t) && !draft._ai ? importBlock() : ''}
      <div class="cb-grid">${field('Title *', 'title', draft.title, 'placeholder="e.g. Cambridge 18 · Test 2 · Passage 1" maxlength="200"')}${field(d.mode === 'full' ? 'Pack on the Full Tests page — pick one below, or type a new name for a new pack card' : 'Pack line shown on the card (optional, e.g. Starter Pack)', 'pack', draft.pack, 'list="ix-pack-list" placeholder="' + (d.mode === 'full' ? 'e.g. Pack 5 (empty = Practice)' : 'e.g. Starter Pack') + '" autocomplete="off"')}<datalist id="ix-pack-list">${packNames(draft.type).map((n) => `<option value="${esc(n)}"></option>`).join('')}</datalist></div>${d.mode === 'full' ? packPicks() : ''}
      <label class="lbl">Short description (optional)<input class="field" data-p="description" value="${esc(draft.description)}" maxlength="500"></label>
      <div class="cb-grid">${t === 'article' || t === 'speaking' || t === 'pdf' ? '<div></div>' : `<label class="lbl">Time limit, minutes (0 = none)<input class="field" type="number" min="0" data-p="data.durationMin" value="${esc(d.durationMin)}"></label>`}
        <label class="lbl">Who can open it<select class="field" data-p="_access">${ACCESS.map(([v, l]) => `<option value="${v}" ${(draft._access || (draft.premium ? 'standard' : 'free')) === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        ${draft._ai ? '<div class="muted sm">Saved as a <b>Draft</b> (students do not see it) until you press <b>Publish</b>.</div>' : `<div class="cb-checks"><label><input type="checkbox" data-p="published" ${draft.published !== false ? 'checked' : ''}> Published (visible to students)</label></div>`}</div>
      ${t === 'reading' || t === 'listening' ? `<label class="lbl">Instructions shown above the questions (optional)<textarea class="field" rows="2" data-p="data.instructions">${esc(d.instructions)}</textarea></label>` : ''}
      ${t === 'reading' ? (d.mode === 'full' ? passagesBlock() : `<label class="lbl">Passage text *<textarea class="field cb-passage" rows="14" data-p="data.passage" placeholder="Paste the passage. Leave an empty line between paragraphs. Tip: start a line with A. / B. / C. to label paragraphs, ## for a sub-heading, * for a footnote.">${esc(d.passage)}</textarea></label>`) : ''}
      ${t === 'listening' ? `<div class="cb-block"><div class="cb-head"><div><strong>Audio file *</strong><div class="muted sm">mp3, wav, m4a, ogg (up to 100 MB). Or paste a link to the audio below.</div></div><button class="btn btn-sm btn-primary" data-cb="audio" type="button">⬆ ${d.audioUrl ? 'Replace audio' : 'Upload audio'}</button></div><div class="muted sm" id="audio-status"></div>${d.audioUrl ? `<audio controls preload="none" src="${esc(d.audioUrl)}" style="width:100%;margin-top:8px"></audio>` : ''}
        <label class="lbl">Audio link (https://… or /uploads/…)<input class="field" data-p="data.audioUrl" value="${esc(d.audioUrl)}" placeholder="https://…/recording.mp3"></label>
        <div class="cb-grid"><label class="lbl">Starts at (seconds, 0 = from the beginning)<input class="field" type="number" min="0" data-p="data.audioStart" data-num="1" value="${esc(d.audioStart || 0)}"></label><label class="lbl">Ends at (seconds, 0 = until the end)<input class="field" type="number" min="0" data-p="data.audioEnd" data-num="1" value="${esc(d.audioEnd || 0)}"></label></div>
        <div class="muted sm">Use these two numbers when one long recording holds all four sections and this test is only one of them.</div></div>` : ''}
      ${t === 'speaking' ? partsBlock() : ''}
      ${t === 'writing' ? tasksBlock() : t === 'speaking' || t === 'pdf' ? '' : imagesBlock(t === 'listening' ? 'Pictures: maps, plans, diagrams' : t === 'article' ? 'More pictures (shown at the end of the article)' : 'Pictures for the passage (optional)', t === 'article' ? 'Optional extra pictures with captions.' : 'Shown to the student next to the questions. Add as many as needed.')}
      ${t === 'reading' || t === 'listening' ? questionsBlock() : ''}
      ${t === 'listening' ? `<label class="lbl">Transcript (optional, shown only after the student submits). One line per speaker turn, e.g. <code>Tom: Good morning…</code>. The line that contains an answer is highlighted automatically<textarea class="field" rows="8" data-p="data.transcript">${esc(d.transcript)}</textarea></label>` : ''}`;
    syncSave();
  }

  function setPath(obj, path, val) {
    const keys = path.split('.'); let o = obj;
    for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
    o[keys[keys.length - 1]] = val;
  }
  async function onListChange(e) {   // the controls of the card lists (not the builder)
    const el = e.target, ds = el.dataset || {};
    if (ds.ctSearch || ds.ctFilter) { applyFilter(ds.ctSearch || ds.ctFilter); syncBulk(ds.ctSearch || ds.ctFilter); return true; }
    if (e.type !== 'change') return false;
    try {
      if (ds.ctSel) { if (el.checked) selected.add(ds.ctSel); else selected.delete(ds.ctSel); syncBulk(viewOfEl(el)); return true; }
      if (ds.ctSelall) {
        const mount = $('#content-' + ds.ctSelall);
        mount.querySelectorAll('.pc-card:not([hidden]) [data-ct-sel]').forEach((x) => { x.checked = el.checked; if (el.checked) selected.add(x.dataset.ctSel); else selected.delete(x.dataset.ctSel); });
        syncBulk(ds.ctSelall); return true;
      }
      if (ds.ctAccess) { await setAccess([ds.ctAccess], el.value); toast('Access: ' + el.options[el.selectedIndex].text); await loadType(ds.type); return true; }
      if (el.matches('[data-bulk-access]')) { const v = el.value; el.value = ''; if (v) await bulk(viewOfEl(el), 'access', v); return true; }
    } catch (err) { fail(err); return true; }
    return false;
  }
  function onInput(e) {
    const el = e.target;
    if (!el.closest('#builder')) { onListChange(e); return; }
    if (el.dataset && el.dataset.spKind && draft) {   // speaking: "Which part" fills the title and the timers of that part
      const t = draft.data.parts[Number(el.dataset.spKind)]; const n = Number(el.value);
      if (t && SPEAK_PARTS[n]) Object.assign(t, SPEAK_PARTS[n]);
      renderBuilder(); autosave(); return;
    }
    const p = el.dataset && el.dataset.p; if (!p || !draft) return;
    autosave();
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
    const gt = /^groups\.(\d+)\.type$/.exec(p);
    if (gt) {   // another type: the option list moves between the group (matching / map / box) and the questions (multiple choice)
      const g = draft.groups[Number(gt[1])]; const shared = SHARED_OPTS.includes(g.type);
      if (shared && !(g.options || []).length) { const src = g.items.find((it) => (it.options || []).length); if (src) g.options = src.options.slice(); }
      if (!shared) g.items.forEach((it) => { if (!(it.options || []).length && (g.options || []).length && (g.type === 'mcq' || g.type === 'mcq-multi')) it.options = g.options.slice(); });
      g.items.forEach((it) => { it.answer = normAnswer(g.type, it.answer); });
    }
    if (gt && draft.groups[Number(gt[1])].type === 'table') {
      const g = draft.groups[Number(gt[1])];
      if (!String(g.table || '').trim() && g.items.some((it) => String(it.prompt || '').trim())) g.table = (g.blockTitle || 'Notes') + '\n' + g.items.filter((it) => String(it.prompt || '').trim()).map((it) => (TABLE_GAP.test(it.prompt) ? it.prompt : it.prompt + ' ____')).join('\n');
      syncTable(g);
    }
    const tb = /^groups\.(\d+)\.table$/.exec(p);
    if (tb && e.type === 'change') { syncTable(draft.groups[Number(tb[1])]); refreshQuestions(); return; }
    if (/\.(answer|explanation)$/.test(p) && e.type === 'change') refreshNums();
    if (el.dataset.rerender && e.type === 'change') { if (p.startsWith('groups.')) refreshQuestions(); else renderBuilder(); }
    else if (/^groups\.\d+\.options$/.test(p) && e.type === 'change') refreshQuestions();   // the answer menus follow the option list
    if (draft.type === 'article' && /^data\.(body|vocabulary\.\d+\.(word|match)|grammar\.\d+\.(match|sourceContext))$/.test(p)) { clearTimeout(onInput.t); onInput.t = setTimeout(refreshFound, 250); }
  }

  function checkArticle(d) {
    if (!String(d.lead || '').trim()) return 'Please write the lead (short description).';
    if (!String(d.body || '').trim()) return 'Please paste the article text.';
    d.vocabulary = (d.vocabulary || []).filter((v) => Object.values(v).some((x) => String(x || '').trim()));
    d.grammar = (d.grammar || []).filter((g) => Object.values(g).some((x) => String(x || '').trim()));
    const nv = d.vocabulary.findIndex((v) => !String(v.word || '').trim() || !String(v.definition || '').trim());
    if (nv >= 0) return `Word V${nv + 1} needs the word and its English definition.`;
    const ng = d.grammar.findIndex((g) => !String(g.title || '').trim());
    if (ng >= 0) return `Grammar point G${ng + 1} needs a title.`;
    return '';
  }
  /* the banner of a test made by the AI Test Generator: where its parts came from and what to check */
  function aiBanner() {
    const a = draft._ai; const s = a.stats || {};
    const what = { complete: 'The questions are the ones printed in your source; the AI added answers and explanations where the key had none, and checked the key.', generate: 'The questions were written by the AI from the ' + (draft.type === 'listening' ? 'transcript' : 'passage') + '.', scanned: 'The passage and the questions were read from a scanned PDF by the AI.' }[a.task] || '';
    return `<div class="cb-block cb-ai"><div><strong>🤖 Made with the AI Test Generator</strong> <span class="muted sm">(${esc(a.model || 'AI')})</span></div>
      <div class="sm">${esc(what)} ${draft.type === 'listening' ? 'Answers were checked against the transcript, not against the audio itself.' : 'Answers were checked against the passage text.'}</div>
      <div class="sm"><b>${s.questions || 0}</b> questions · ${s.fromSource || 0} from the source · ${s.byAi || 0} written by the AI · <b>${s.verified || 0}</b> with their proof found${s.noAnswer ? ` · <b class="warn-text">${s.noAnswer} without an answer</b>` : ''}</div>
      ${(a.warnings || []).length ? `<details ${a.warnings.length < 6 ? 'open' : ''}><summary class="sm"><b>${a.warnings.length} thing(s) to check</b></summary><ul class="cb-report">${a.warnings.map((w) => `<li class="warn">${esc(w)}</li>`).join('')}</ul></details>` : ''}
      <div class="muted sm">Read every question before publishing. “AI” = written by the AI; “check” = its proof was not found in the ${draft.type === 'listening' ? 'transcript' : 'passage'}.</div></div>`;
  }
  async function save(opts) {
    if (uploading) return;
    opts = opts && opts.publish !== undefined ? opts : {};
    if (draft._ai) draft.published = !!opts.publish;   // an AI-made test is never published by saving it
    const d = draft.data;
    if (draft.type === 'reading' || draft.type === 'listening') {
      const issues = validate(); showIssues(issues);
      if (issues.some((x) => x.level === 'error')) { toast(issues.filter((x) => x.level === 'error').length + ' problem(s) to fix first — see the red list above the questions.', true); const bx = $('#cb-issues'); if (bx) bx.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      d.questions = flatten(draft.groups).filter((q) => q.prompt);
    }
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
      const err = checkArticle(d); if (err) { if (!d.vocabulary.length) d.vocabulary.push(blankV()); renderBuilder(); return toast(err, true); }
      draft.description = d.lead;
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
    } else if (draft.type === 'writing') {
      for (const [i, t] of (d.tasks || []).entries()) {
        const c = parseChart(t.chartText, t.chartUnit);
        if (c.error) return toast(`${t.title || 'Task ' + (i + 1)}: ${c.error}`, true);
        t.chart = c.chart;
      }
      d.tasks = (d.tasks || []).filter((t) => String(t.prompt || '').trim() || t.imageUrl || t.chart);
      if (!d.tasks.length) return toast('Write at least one task.', true);
    }
    const btn = $('#cb-save'); btn.disabled = true;
    const access = draft._access;   // Free / Standard / Max / Ultra (articles keep their own Premium tick)
    try {
      const body = JSON.stringify({ type: draft.type, title: draft.title, pack: draft.pack, description: draft.description, premium: access ? access !== 'free' : !!draft.premium, published: draft.published !== false, data: d });
      const type = draft.type; const wasEdit = !!editingId; const aiDraft = !!draft._ai && draft.published === false;
      const r = editingId ? await api('/api/admin/materials/' + encodeURIComponent(editingId), { method: 'PATCH', body }) : await api('/api/admin/materials', { method: 'POST', body });
      const id = r && r.item && r.item.id;
      // Standard / Max / Ultra are access rules of their own (saving the Free/Premium flag above clears an older rule)
      if (id && access && access !== 'free') { try { await setAccess([id], access); } catch (e) { toast('Saved, but the access level could not be set: ' + e.message, true); } }
      dropAutosave();
      toast(aiDraft ? 'Saved as a Draft — students do not see it yet' : wasEdit ? 'Saved' : 'Created — students can open it now');
      $('#builder').classList.remove('open'); draft = null; editingId = null;
      await loadType(type);
    } catch (e) {
      fail(e); btn.disabled = false; syncSave();
      // the reason stays on screen (the toast goes away); the work is still in the form and in this browser
      showIssues([{ level: 'error', msg: 'Not saved: ' + ((e && e.message) || 'the server did not answer') + ' — nothing is lost, fix it and press Save again.' }], true);
      if (!$('#cb-issues')) { const box = document.createElement('div'); box.id = 'cb-issues'; $('#builder-body').prepend(box); showIssues([{ level: 'error', msg: 'Not saved: ' + ((e && e.message) || 'the server did not answer') + ' — nothing is lost, fix it and press Save again.' }], true); }
    }
  }

  /* ───────── events ───────── */
  async function onClick(e) {
    const bd = e.target.closest('[data-bulk-do]');
    if (bd) { try { await bulk(viewOfEl(bd), bd.dataset.bulkDo, bd.dataset.to); } catch (err) { fail(err); const v = viewOfEl(bd); loadType(VIEW_FOR[v] || v); } return; }
    const t = e.target.closest('[data-ct],[data-cb]'); if (!t) return;
    try {
      if (t.dataset.ct) {
        const { ct, type, id } = t.dataset;
        if (ct === 'new') return openBuilder(type, null, t.dataset.mode);
        const item = (lists[type] || []).find((x) => x.id === id);
        if (ct === 'edit') { const full = await api('/api/admin/materials/' + encodeURIComponent(id)); return openBuilder(type, full.item); }
        if (ct === 'move' && item) {   // Part practice <-> Full tests
          const to = t.dataset.to; if (!confirm('Move “' + item.title + '” to ' + GRID[viewOf(type, to)].title + '?')) return;
          const full = (await api('/api/admin/materials/' + encodeURIComponent(id))).item;
          await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ data: switchMode(full, to) }) });
          toast('Moved to ' + GRID[viewOf(type, to)].title); return loadType(type);
        }
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
      const a = t.dataset.cb, i = Number(t.dataset.i), d = draft.data;
      const scrollToLast = (sel) => { const all = document.querySelectorAll(sel); if (all.length) all[all.length - 1].scrollIntoView({ block: 'center' }); };
      if (a === 'img-add') { const url = await pickAndUpload('image/*', $('#img-status')); if (url) { draft.data.images.push({ url, caption: '' }); renderBuilder(); } }
      else if (a === 'img-del') { draft.data.images.splice(i, 1); renderBuilder(); }
      else if (a === 'audio') { const url = await pickAndUpload('audio/*,.mp3,.wav,.m4a,.ogg', $('#audio-status')); if (url) { draft.data.audioUrl = url; renderBuilder(); } }
      else if (a === 'check') showIssues(validate(), true);
      else if (a === 'step') { draft._step = t.dataset.step; refreshQuestions(); autosave(); const w = $('#cb-qwrap'); if (w) w.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
      else if (a === 'rq-add') addQuestionsByRange();
      else if (a === 'ra-add') {
        const text = $('#ra-text').value; if (!text.trim()) return toast('Paste the answer key first.', true);
        const r = putAnswers(answerKeyFrom(text, parseInt($('#ra-from').value, 10) || firstNo()));
        refreshQuestions(); autosave();
        toast(r.put + ' answer(s) put in' + (r.missing.length ? ' · still without an answer: ' + r.missing.slice(0, 12).join(', ') + (r.missing.length > 12 ? '…' : '') : ' · every question has its answer'), !r.put || !!r.missing.length);
      }
      else if (a === 're-add') {
        const text = $('#re-text').value; if (!text.trim()) return toast('Paste the explanations first.', true);
        const put = putExplanations(explanationsFrom(text)); refreshQuestions(); autosave();
        toast(put ? put + ' explanation(s) put in' : 'No numbered explanations found. Start each one with its question number: 1. …', !put);
      }
      else if (a === 'q-bulk') { const b = $('#bulk-box'); b.hidden = !b.hidden; }
      else if (a === 'q-bulk-do') {
        const type = $('#bulk-type').value; const ps = $('#bulk-pass'); const last = draft.groups[draft.groups.length - 1];
        const byNum = isFullListening() && ps && ps.value === 'auto';   // a whole listening paper pasted at once: Questions 1-10 = Part 1, 11-20 = Part 2 …
        const passage = ps && ps.value && !byNum ? Number(ps.value) : (last ? last.passage : 1);
        const r = parseGroups($('#bulk-text').value, type, passage, byNum);
        if (byNum) { let lastN = 0; r.groups.forEach((g) => { const n = groupNo(g) || lastN; if (n) { g.passage = Math.min(4, Math.max(1, Math.ceil(n / 10))); lastN = n; } else g.passage = 1; delete g._num; delete g._first; }); }
        if (!r.groups.length) return toast('Nothing to add. Write each question as:  question => answer => explanation  (or with “Answer:” lines).', true);
        draft.groups = draft.groups.filter((g) => g.items.some((it) => it.prompt || it.answer)).concat(r.groups);
        $('#bulk-text').value = ''; $('#bulk-box').hidden = true; refreshQuestions();
        const nq = r.groups.reduce((n, g) => n + g.items.length, 0), ex = r.groups.reduce((n, g) => n + g.items.filter((it) => it.explanation).length, 0);
        toast(nq + ' questions in ' + r.groups.length + ' group(s) added' + (ex ? ' · ' + ex + ' with explanations' : '') + (r.skipped.length ? ' · ' + r.skipped.length + ' line(s) NOT understood: “' + r.skipped[0].slice(0, 40) + '…”' : ''), !!r.skipped.length);
        showIssues(validate());
      }
      else if (a === 'g-add') { const last = draft.groups[draft.groups.length - 1]; draft.groups.push(newGroup($('#g-newtype').value, last ? last.passage : 1)); refreshQuestions(); const gs = document.querySelectorAll('.cb-group'); if (gs.length) gs[gs.length - 1].scrollIntoView({ block: 'start', behavior: 'smooth' }); }
      else if (a === 'g-del') { const g = Number(t.dataset.g); if (draft.groups[g].items.some((it) => it.prompt || it.answer) && !confirm('Remove group ' + (g + 1) + ' with all its questions?')) return; draft.groups.splice(g, 1); if (!draft.groups.length) draft.groups.push(newGroup(draft.type === 'listening' ? 'gap' : 'short')); refreshQuestions(); }
      else if (a === 'g-up' || a === 'g-down') { const g = Number(t.dataset.g), h = a === 'g-up' ? g - 1 : g + 1; if (h < 0 || h >= draft.groups.length) return; [draft.groups[g], draft.groups[h]] = [draft.groups[h], draft.groups[g]]; refreshQuestions(); const el = document.getElementById('cb-group-' + h); if (el) el.scrollIntoView({ block: 'nearest' }); }
      else if (a === 'g-dup') { const g = Number(t.dataset.g); draft.groups.splice(g + 1, 0, JSON.parse(JSON.stringify(draft.groups[g]))); refreshQuestions(); }
      else if (a === 'i-add') { const g = draft.groups[Number(t.dataset.g)]; g.items.push(newItem()); refreshQuestions(); const rows = document.querySelectorAll('#cb-group-' + t.dataset.g + ' .gi-prompt'); if (rows.length) rows[rows.length - 1].focus(); }
      else if (a === 'i-del') { const g = draft.groups[Number(t.dataset.g)]; g.items.splice(i, 1); if (!g.items.length) g.items.push(newItem()); refreshQuestions(); }
      else if (a === 'g-letters' || a === 'g-letters-9') { const g = draft.groups[Number(t.dataset.g)]; g.options = 'ABCDEFGHI'.slice(0, a === 'g-letters' ? 7 : 9).split(''); refreshQuestions(); }
      else if (a === 'g-paste') { const b = $('#gpaste-' + t.dataset.g); b.hidden = !b.hidden; if (!b.hidden) $('#gpaste-text-' + t.dataset.g).focus(); }
      else if (a === 'g-paste-do') {
        const gi = Number(t.dataset.g), g = draft.groups[gi]; const raw = parseRaw($('#gpaste-text-' + gi).value); const qs = raw.blocks.reduce((x, b) => x.concat(b.qs), []);
        if (!qs.length) return toast('Nothing to add. Write each question as:  question => answer => explanation', true);
        const shared = SHARED_OPTS.includes(g.type);
        if (shared && !(g.options || []).length) { const sh = raw.blocks.map((b) => b.shared).find((x) => x.length); if (sh) g.options = sh.slice(); else if (qs[0].options.length) g.options = qs[0].options.slice(); }
        if (!g.group) { const h = raw.blocks.map((b) => b.head).find(Boolean); if (h) g.group = h; }
        g.items = g.items.filter((it) => it.prompt || it.answer).concat(qs.map((q) => ({ prompt: q.prompt, answer: normAnswer(g.type, q.answer), explanation: q.explanation, evidence: q.evidence || '', title: '', options: shared ? [] : (q.options || []).slice() })));
        refreshQuestions(); toast(qs.length + ' questions added to group ' + (gi + 1) + (raw.skipped.length ? ' · ' + raw.skipped.length + ' line(s) NOT understood: “' + raw.skipped[0].slice(0, 40) + '…”' : ''), !!raw.skipped.length);
      }
      else if (a === 'imp-pdf') await importPdf();
      else if (a === 'imp-toggle') { const b = $('#imp-box'); b.hidden = !b.hidden; if (!b.hidden) $('#imp-text').focus(); }
      else if (a === 'imp-do') runImport($('#imp-text').value);
      else if (a === 'imp-page') await showPage(Number(t.dataset.n));
      else if (a === 'imp-cut') await cutPicture(!!t.dataset.whole);
      else if (a === 'pdf-file') { const url = await pickAndUpload('.pdf,application/pdf', $('#pdf-status')); if (url) { draft.data.fileUrl = url; renderBuilder(); } }
      else if (a === 'pdf-file-del') { draft.data.fileUrl = ''; renderBuilder(); }
      else if (a === 'card-img') { const url = await pickAndUpload('image/*', $('#card-img-status')); if (url) { draft.data.coverUrl = url; renderBuilder(); } }
      else if (a === 'card-img-del') { draft.data.coverUrl = ''; renderBuilder(); }
      else if (a === 'body-img') {
        const url = await pickAndUpload('image/*', $('#body-status')); if (!url) return;
        const ta = $('#body-text'); const at = ta ? (ta.selectionStart ?? ta.value.length) : String(draft.data.body || '').length; const cur = String(draft.data.body || '');
        const cap = (prompt('Caption for this picture (optional):', '') || '').replace(/[\]\n]/g, ' ');
        draft.data.body = cur.slice(0, at).replace(/\s*$/, '') + '\n\n![' + cap + '](' + url + ')\n\n' + cur.slice(at).replace(/^\s*/, ''); renderBuilder();
      }
      else if (a === 'p-add') { if (draft.data.parts.length < 3) { const used = draft.data.parts.map(speakNo); draft.data.parts.push(blankPart([1, 2, 3].find((n) => !used.includes(n)) || 3)); renderBuilder(); } }
      else if (a === 'pack-pick') { draft.pack = t.dataset.name; const f = $('#builder [data-p="pack"]'); if (f) f.value = draft.pack; const pk = $('#cb-pack-picks'); if (pk) pk.outerHTML = packPicks(); autosave(); }
      else if (a === 'p-del') { draft.data.parts.splice(i, 1); renderBuilder(); }
      else if (a === 'p-img') { const url = await pickAndUpload('image/*', $('#pimg-status-' + i)); if (url) { draft.data.parts[i].imageUrl = url; renderBuilder(); } }
      else if (a === 'p-img-del') { draft.data.parts[i].imageUrl = ''; renderBuilder(); }
      else if (a === 'p-audio') { const url = await pickAndUpload('audio/*,.mp3,.wav,.m4a,.ogg', $('#pimg-status-' + i)); if (url) { draft.data.parts[i].audioUrl = url; renderBuilder(); } }
      else if (a === 'p-audio-del') { draft.data.parts[i].audioUrl = ''; renderBuilder(); }
      else if (a === 't-add') { draft.data.tasks.push(blankTask(draft.data.tasks.length + 1)); renderBuilder(); }
      else if (a === 't-del') { draft.data.tasks.splice(i, 1); renderBuilder(); }
      else if (a === 't-img') { const url = await pickAndUpload('image/*', $('#timg-status-' + i)); if (url) { draft.data.tasks[i].imageUrl = url; renderBuilder(); } }
      else if (a === 't-img-del') { draft.data.tasks[i].imageUrl = ''; renderBuilder(); }
      // article
      else if (a === 'a-img') { const url = await pickAndUpload('image/*', $('#aimg-status')); if (url) { d.imageUrl = url; if (!d.imageAlt) d.imageAlt = draft.title; renderBuilder(); } }
      else if (a === 'a-img-del') { d.imageUrl = ''; renderBuilder(); }
      else if (a === 'v-add') { d.vocabulary.push(blankV()); renderBuilder(); scrollToLast('.cb-qn-v'); }
      else if (a === 'v-del') { d.vocabulary.splice(i, 1); renderBuilder(); }
      else if (a === 'v-up' && i > 0) { d.vocabulary.splice(i - 1, 0, d.vocabulary.splice(i, 1)[0]); renderBuilder(); }
      else if (a === 'gr-add') { d.grammar.push(blankG()); renderBuilder(); scrollToLast('.cb-qn-g'); }
      else if (a === 'gr-del') { d.grammar.splice(i, 1); renderBuilder(); }
      else if (a === 'v-bulk' || a === 'gr-bulk') { const b = $(a === 'v-bulk' ? '#vbulk-box' : '#gbulk-box'); b.hidden = !b.hidden; }
      else if (a === 'v-bulk-do' || a === 'gr-bulk-do') {
        let got;
        try { got = parseBulk($(a === 'v-bulk-do' ? '#vbulk-text' : '#gbulk-text').value, a === 'gr-bulk-do' ? 'grammar' : 'vocab'); }
        catch (err) { return toast('Could not read that list: ' + err.message, true); }
        const filled = (x) => Object.values(x).some((y) => String(y || '').trim());
        d.vocabulary = d.vocabulary.filter(filled).concat(got.vocab.filter((v) => v.word));
        d.grammar = d.grammar.filter(filled).concat(got.grammar.filter((g) => g.title));
        if (!d.vocabulary.length) d.vocabulary.push(blankV());
        renderBuilder();
        const notFound = got.vocab.filter((v) => v.word && !vFound(v)).length;
        toast(`${got.vocab.length} words, ${got.grammar.length} grammar points added` + (notFound ? ` · ${notFound} not found in the text yet` : ''));
      }
      if (draft) autosave();
    } catch (err) { fail(err); }
  }


  /* ───────── packs: the cards of the Full Tests pages ─────────
     Every pack of the four Full Tests pages is listed here: the built-in ones (assets/js/full-tests-data.js), the ones made
     here and the ones a test named in its Pack field. A built-in pack is changed by saving an override with the same address
     (slug) in the settings; "Reset" removes the override. Access (Free / Standard / Max / Ultra) is the same rule as in Access. */
  let packList = null, packView = null, packEdit = null, packSkill = 'reading', packQuery = '';
  const openPacks = new Set();
  const SK_NAME = { reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking' };
  const PACK_ACCESS = [['default', 'Default'], ...ACCESS];
  async function loadPackList() {
    try { const [a, b] = await Promise.all([api('/api/admin/access'), api('/api/admin/packs')]); packView = a; packList = b.packs || []; }
    catch (e) { fail(e); packList = packList || []; packView = packView || { skills: [] }; }
    renderPacks();
  }
  /* the packs of one skill as the Full Tests page shows them (practice-page cards and Part-only names left out) */
  function packsOf(skill) {
    const sk = ((packView && packView.skills) || []).find((x) => x.skill === skill); if (!sk) return [];
    return sk.packs.filter((p) => !p.practice && (p.builtIn || p.adminId || p.tests.some((t) => !t.material || t.mode === 'full')))
      .map((p) => ({ ...p, tests: p.tests.filter((t) => !t.material || t.mode === 'full'), admin: (packList || []).find((x) => x.id === p.adminId) || null }))
      .map((p, i) => ({ p, k: p.order || 1000 + i })).sort((a, b) => a.k - b.k).map((x) => x.p);
  }
  const ruleText = (r) => (r.locked ? '🔒 ' + (ACCESS.find((x) => x[0] === r.plan) || ['', r.plan])[1].replace('🔒 ', '') : '🔓 Free');
  function packForm(f) {
    const opt = (list, cur) => list.map(([v, l]) => `<option value="${esc(v)}" ${v === cur ? 'selected' : ''}>${esc(l)}</option>`).join('');
    const groups = [...new Set(packsOf(f.skill).map((p) => p.group).filter(Boolean).concat(['Recent Exams', 'Practice']))];
    return `<div class="cb-block pk-form"><strong>${f.slug && f.builtIn ? 'Edit built-in pack “' + esc(f.title) + '”' : packEdit && packEdit.id ? 'Edit pack' : 'New pack'}</strong>
        ${f.builtIn ? '<div class="muted sm">Its tests and its address stay the same; only the card changes. “Reset” brings back the original.</div>' : ''}
        <div class="cb-grid"><label class="lbl">Skill<select class="field" id="pk-skill" ${f.slug ? 'disabled' : ''}>${opt(Object.entries(SK_NAME), f.skill)}</select></label><label class="lbl">Pack name *<input class="field" id="pk-title" maxlength="80" value="${esc(f.title)}" placeholder="e.g. Pack 7"></label></div>
        <div class="cb-grid"><label class="lbl">Tier<select class="field" id="pk-tier">${opt([['', 'No tier'], ['Tier 1', 'Tier 1'], ['Tier 2', 'Tier 2'], ['Tier 3', 'Tier 3']], f.tier || '')}</select></label>
          <label class="lbl">Plan label on the card<select class="field" id="pk-plan">${opt([['', 'None'], ['STANDARD', 'Standard'], ['MAX', 'Max'], ['ULTRA', 'Ultra']], (f.plan || '').toUpperCase())}</select></label></div>
        <div class="cb-grid"><label class="lbl">Section on the page<input class="field" id="pk-group" list="pk-groups" maxlength="60" value="${esc(f.group)}" placeholder="Recent Exams / Practice / a new name"><datalist id="pk-groups">${groups.map((g) => `<option value="${esc(g)}"></option>`).join('')}</datalist></label>
          <label class="lbl">Position (1 = first, empty = default order)<input class="field" id="pk-order" type="number" min="0" max="999" value="${esc(f.order || '')}"></label></div>
        <label class="lbl">Short description (optional)<input class="field" id="pk-desc" maxlength="200" value="${esc(f.description)}" placeholder="Practice tests to improve your skills"></label>
        <div class="cb-checks">${f.builtIn ? '' : `<label><input type="checkbox" id="pk-premium" ${f.premium ? 'checked' : ''}> Locked (paid plan) by default</label>`}<label><input type="checkbox" id="pk-published" ${f.published !== false ? 'checked' : ''}> Visible to students</label></div>
        <div class="btn-row"><button class="btn btn-primary" data-pk="save" type="button">${packEdit ? 'Save changes' : 'Create pack'}</button>${packEdit ? '<button class="btn" data-pk="cancel" type="button">Cancel</button>' : ''}</div></div>`;
  }
  function packRow(p) {
    const open = openPacks.has(p.key) || !!packQuery;
    const tests = p.tests.filter((t) => !packQuery || (p.title + ' ' + t.title + ' ' + (t.source || '')).toLowerCase().includes(packQuery));
    const badge = p.builtIn ? (p.adminId ? '<span class="chip">built-in · changed</span>' : '<span class="chip">built-in</span>') : '<span class="chip chip-ok">made here</span>';
    const sel = (key, rule) => `<select class="field pk-access" data-pk-access="${esc(key)}">${PACK_ACCESS.map(([v, l]) => `<option value="${v}" ${(rule.mode || 'default') === v ? 'selected' : ''}>${v === 'default' ? 'Default · ' + ruleText(rule) : l}</option>`).join('')}</select>`;
    const rows = tests.map((t) => `<tr><td><strong>${esc(t.title)}</strong><div class="muted sm">${esc(t.source || '')}${t.material ? ' · made in admin' + (t.published === false ? ' · <b>Hidden</b>' : '') : ''}</div></td>
      <td>${sel(t.key, t.rule)}</td><td><div class="btn-row">${t.material ? `<button class="btn btn-sm" data-pk="edit-test" data-id="${esc(t.id)}" data-type="${esc(t.type || p.skill)}" type="button">Edit</button>` : ''}${t.href ? `<a class="btn btn-sm" href="${esc(t.href)}" target="_blank" rel="noopener">Open ↗</a>` : ''}</div></td></tr>`).join('');
    return `<div class="pk-row${p.hidden ? ' is-hidden' : ''}"><div class="pk-head">
        <button class="pk-toggle" data-pk="toggle" data-key="${esc(p.key)}" type="button" aria-expanded="${open}">${open ? '▾' : '▸'}</button>
        <div class="pk-name"><strong>${esc(p.title)}</strong> ${badge}${p.hidden ? ' <span class="chip">Hidden</span>' : ''}<div class="muted sm">${esc([p.tier, p.group || 'Practice', p.order ? 'position ' + p.order : '', p.tests.length + ' test(s)'].filter(Boolean).join(' · '))}</div></div>
        ${sel(p.key, p.rule)}
        <div class="btn-row"><button class="btn btn-sm" data-pk="edit" data-key="${esc(p.key)}" type="button">Edit</button>
          <button class="btn btn-sm" data-pk="pub" data-key="${esc(p.key)}" type="button">${p.hidden ? 'Show' : 'Hide'}</button>
          <a class="btn btn-sm" href="/full-tests/${esc(p.key.split(':')[1] || '')}" target="_blank" rel="noopener">Open ↗</a>
          ${p.builtIn ? (p.adminId ? `<button class="btn btn-sm" data-pk="del" data-key="${esc(p.key)}" type="button" title="Back to the original card">Reset</button>` : '') : p.adminId ? `<button class="btn btn-sm btn-danger" data-pk="del" data-key="${esc(p.key)}" type="button">Delete</button>` : ''}
          <button class="btn btn-sm btn-primary" data-pk="add-test" data-key="${esc(p.key)}" type="button" title="New full test in this pack">+ Test</button></div></div>
      ${open ? (rows ? `<div class="table-wrap"><table class="table"><thead><tr><th>Test</th><th>Access</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` : '<div class="empty" style="padding:12px">No tests in this pack yet. Press “+ Test”.</div>') : ''}</div>`;
  }
  function renderPacks() {
    const mount = $('#content-packs'); if (!mount) return;
    const list = packView ? packsOf(packSkill).filter((p) => !packQuery || (p.title + ' ' + p.tests.map((t) => t.title + ' ' + (t.source || '')).join(' ')).toLowerCase().includes(packQuery)) : null;
    const f = packEdit || { skill: packSkill, title: '', tier: 'Tier 1', plan: 'MAX', group: 'Practice', description: '', premium: true, published: true, order: 0 };
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">Packs · cards of the Full Tests pages</div>
      <div class="muted sm">Every pack of the Full Reading / Listening / Writing / Speaking pages — built-in ones too. Rename, move to another section, change the order, hide, lock by plan, and see the tests inside. Full tests join a pack through their <b>Pack</b> field.</div></div>
      ${packEdit ? '' : '<button class="btn btn-primary" data-pk="new" type="button">+ New pack</button>'}</div>
      ${packEdit ? packForm(f) : ''}
      <div class="tabs pk-tabs">${Object.entries(SK_NAME).map(([k, v]) => `<button class="tab${k === packSkill ? ' active' : ''}" data-pk="skill" data-skill="${k}" type="button">${v}${packView ? ' (' + packsOf(k).length + ')' : ''}</button>`).join('')}</div>
      <div class="toolbar"><input class="field grow" type="search" id="pk-q" placeholder="Search packs and tests" value="${esc(packQuery)}" autocomplete="off"></div>
      ${list === null ? '<div class="empty">Loading…</div>' : list.length ? `<div class="pk-list">${list.map(packRow).join('')}</div>` : '<div class="empty">No packs here yet. Press “+ New pack”.</div>'}</div>`;
  }
  const packByKey = (key) => packsOf(packSkill).find((p) => p.key === key);
  async function onPackClick(e) {
    const t = e.target.closest('[data-pk]'); if (!t) return;
    try {
      const a = t.dataset.pk; const p = t.dataset.key ? packByKey(t.dataset.key) : null;
      if (a === 'skill') { packSkill = t.dataset.skill; packEdit = null; renderPacks(); }
      else if (a === 'toggle') { if (openPacks.has(t.dataset.key)) openPacks.delete(t.dataset.key); else openPacks.add(t.dataset.key); renderPacks(); }
      else if (a === 'new') { packEdit = { skill: packSkill, title: '', tier: 'Tier 1', plan: 'MAX', group: 'Practice', description: '', premium: true, published: true, order: 0 }; renderPacks(); $('#pk-title').focus(); }
      else if (a === 'edit' && p) {
        const ad = p.admin || {};
        packEdit = { id: p.adminId || '', slug: p.slug, skill: packSkill, builtIn: !!p.builtIn, title: p.title, tier: p.tier || '', plan: p.plan || '', group: p.group || '', description: p.description || '', order: p.order || 0, premium: ad.premium !== undefined ? ad.premium : !!(p.def && p.def.locked), published: !p.hidden };
        renderPacks(); $('#content-packs').scrollIntoView({ block: 'start' });
      }
      else if (a === 'cancel') { packEdit = null; renderPacks(); }
      else if (a === 'pub' && p) {
        if (p.adminId) await api('/api/admin/packs/' + encodeURIComponent(p.adminId), { method: 'PATCH', body: JSON.stringify({ published: !!p.hidden }) });
        else await api('/api/admin/packs', { method: 'POST', body: JSON.stringify({ skill: packSkill, slug: p.slug, title: p.title, tier: p.tier || '', plan: p.plan || '', group: p.group || '', description: p.description || '', premium: !!(p.def && p.def.locked), published: !!p.hidden }) });
        toast(p.hidden ? 'Pack visible' : 'Pack hidden from students'); await loadPackList();
      }
      else if (a === 'del' && p && p.adminId) {
        if (!confirm(p.builtIn ? 'Reset “' + p.title + '” to its original card?' : 'Delete the pack “' + p.title + '”? Its tests stay (they move to “Practice”), only the pack card disappears.')) return;
        await api('/api/admin/packs/' + encodeURIComponent(p.adminId), { method: 'DELETE' }); packEdit = null; toast(p.builtIn ? 'Pack reset' : 'Pack deleted'); await loadPackList();
      }
      else if (a === 'add-test' && p) { if (!MODE_TYPES.includes(packSkill)) return; openBuilder(packSkill, null, 'full'); draft.pack = p.title; renderBuilder(); }
      else if (a === 'edit-test') { const full = await api('/api/admin/materials/' + encodeURIComponent(t.dataset.id)); openBuilder(full.item.type, full.item); }
      else if (a === 'save') {
        const body = { skill: packEdit && packEdit.slug ? packEdit.skill : $('#pk-skill').value, title: $('#pk-title').value, tier: $('#pk-tier').value, plan: $('#pk-plan').value, group: $('#pk-group').value, description: $('#pk-desc').value, order: $('#pk-order').value, published: $('#pk-published').checked };
        if ($('#pk-premium')) body.premium = $('#pk-premium').checked; else body.premium = !!packEdit.premium;
        if (!body.title.trim()) return toast('Please enter the pack name.', true);
        if (packEdit && packEdit.id) await api('/api/admin/packs/' + encodeURIComponent(packEdit.id), { method: 'PATCH', body: JSON.stringify(body) });
        else await api('/api/admin/packs', { method: 'POST', body: JSON.stringify(packEdit && packEdit.slug ? { ...body, slug: packEdit.slug } : body) });
        toast(packEdit && (packEdit.id || packEdit.slug) ? 'Pack saved' : 'Pack created'); packSkill = body.skill; packEdit = null; await loadPackList();
      }
    } catch (err) { fail(err); }
  }
  async function onPackChange(e) {
    const el = e.target;
    if (el.id === 'pk-q') { packQuery = el.value.trim().toLowerCase(); const pos = el.selectionStart; renderPacks(); const q = $('#pk-q'); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (x) { /* search field */ } } return; }
    if (e.type !== 'change' || !el.dataset.pkAccess) return;
    try { await api('/api/admin/access', { method: 'POST', body: JSON.stringify({ changes: [{ key: el.dataset.pkAccess, mode: el.value }] }) }); toast('Access saved'); await loadPackList(); }
    catch (err) { fail(err); }
  }

  /* ───────── for the AI Test Generator (admin-ai.js) ───────── */
  // the text of a PDF / paste -> passages, question groups (and a transcript), with the same reader as "Fill from a PDF"
  function readSource(type, mode, text) {
    const keep = draft; draft = { type, data: { mode } };   // the reader looks at draft.type (listening question types)
    try {
      if (type === 'reading') { const r = smartReading(text, mode === 'full'); return { passages: r.passages.map((x) => ({ title: x.title, text: x.passage })).filter((x) => x.text), groups: r.groups, skipped: r.skipped, keyCount: r.keyCount }; }
      const r = smartListening(text, mode === 'full'); return { passages: [], groups: r.groups, transcript: r.transcript, section: r.section, skipped: r.skipped, keyCount: r.keyCount };
    } finally { draft = keep; }
  }
  // the generator's result -> the normal form, as a Draft, with its warnings on top
  function openFromAi(p) {
    openBuilder(p.type, null, p.mode, { fresh: true });
    const d = draft.data;
    draft.title = p.title || ''; draft.published = false;
    draft._ai = { model: p.model, task: p.task, warnings: p.warnings || [], stats: p.stats || {} };
    if (p.type === 'reading') {
      const ps = p.passages || [];
      if (p.mode === 'full') d.passages = [0, 1, 2].map((k) => ({ title: (ps[k] && ps[k].title) || '', passage: (ps[k] && ps[k].passage) || '' }));
      else d.passage = (ps[0] && ps[0].passage) || '';
    } else {
      Object.assign(d, { audioUrl: p.audioUrl || '', audioStart: p.audioStart || 0, audioEnd: p.audioEnd || 0, transcript: p.transcript || '' });
      if (p.section && p.mode !== 'full') d.sectionLabel = p.section;
    }
    draft.groups = (p.groups || []).length ? JSON.parse(JSON.stringify(p.groups)) : [newGroup(p.type === 'listening' ? 'gap' : 'short')];
    $('#builder-title').textContent = 'Review the AI-made ' + GRID[viewOf(p.type, p.mode)].noun;
    renderBuilder(); showIssues(validate()); autosave();
  }
  window.IXAdmin = { readSource, openFromAi, uploadFile, toast, fail };

  const NAMES = Object.keys(TYPES);
  function onHash() { let v = (location.hash || '').slice(1).split('?')[0]; if (v === 'packs' && packList === null) loadPackList(); v = VIEW_FOR[v] || v; if (NAMES.includes(v) && lists[v] === null) loadType(v); }
  window.addEventListener('DOMContentLoaded', () => {
    NAMES.forEach((t) => renderType(t));
    document.addEventListener('click', onClick); document.addEventListener('click', onPackClick); renderPacks();
    document.addEventListener('input', onInput); document.addEventListener('change', onInput);
    const pk = $('#content-packs'); if (pk) { pk.addEventListener('input', onPackChange); pk.addEventListener('change', onPackChange); }
    $('#cb-save').addEventListener('click', () => save());
    const pub = $('#cb-publish');
    if (pub) pub.addEventListener('click', () => { if (draft && confirm('Publish “' + (draft.title || 'this test') + '”? Students will see it straight away. Have you read every question the AI made?')) save({ publish: true }); });
    document.querySelectorAll('[data-cb-close]').forEach((b) => b.addEventListener('click', closeBuilder));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#builder').classList.contains('open')) closeBuilder(); });
    window.addEventListener('hashchange', onHash); onHash();
    $('#refresh') && $('#refresh').addEventListener('click', () => { NAMES.forEach((t) => { if (lists[t] !== null) loadType(t); }); if (packList !== null) loadPackList(); });
  });
})();
