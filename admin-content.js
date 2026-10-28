/* IELTSX admin: Reading / Listening / Writing / Speaking / PDF builder and the Article builder (admin.html #reading #listening #writing #speaking #articles #pdf). */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const TYPES = { reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking', article: 'Articles', pdf: 'PDF materials' };
  const TOPICS = ['General', 'History', 'Science', 'Technology', 'Environment', 'Health', 'Education', 'Society', 'Business', 'Culture', 'Nature', 'Psychology'];
  const Q_LABEL = { short: 'Short answer / sentence completion', completion: 'Note / form / table / flow-chart / summary completion', tfng: 'True / False / Not Given', ynng: 'Yes / No / Not Given', mcq: 'Multiple choice (one answer)', 'mcq-multi': 'Multiple choice (two or more answers)', matching: 'Matching: headings / information / features / sentence endings', map: 'Map / plan / diagram labelling (choose a letter)' };
  /* Listening has its own question types: they are the types of the listening engine (listening/js/listening.js) */
  const LQ_LABEL = { gap: 'Completion, typed: notes / form / table / sentence / flow-chart', mcq: 'Multiple choice (one answer)', 'mcq-multi': 'Multiple choice, choose TWO / THREE letters', matching: 'Matching: drag the lettered option into the gap', map: 'Map / plan / diagram labelling (tick one letter)', box: 'Completion with a word box (drag a word into the text)' };
  const qLabels = () => (draft && draft.type === 'listening' ? LQ_LABEL : Q_LABEL);
  const OPT_TYPES = ['mcq', 'mcq-multi', 'matching', 'map', 'box'];
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
  const today = () => { const d = new Date(); return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-'); };

  /* ───────── list views ───────── */
  async function loadType(type) {
    try { lists[type] = (await api('/api/admin/materials?type=' + type)).items.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))); } catch (e) { fail(e); lists[type] = lists[type] || []; }
    renderType(type);
  }
  const NOUN = { reading: 'test', listening: 'listening card', writing: 'writing card', speaking: 'speaking card', article: 'article card', pdf: 'PDF material' };
  const HELP = {
    reading: 'Passage, pictures and questions with answers. Graded automatically.',
    listening: 'Audio file, map/diagram pictures and questions with answers. Graded automatically.',
    writing: 'Task 1 / Task 2 prompts with a chart (drawn from your numbers) or a picture and a model answer. They open in the IELTS writing exam screen.',
    speaking: 'Part 1 questions, Part 2 cue card, Part 3 discussion. Timers, pictures, model-answer audio.',
    article: 'Text, cover picture and the vocabulary / grammar students tap on — all in one form.',
    pdf: 'A PDF file with its own card (picture, title, tags) on the PDF Library page. Students download it from the card.'
  };
  const WHERE = { reading: 'the Reading practice page (Part) or the Full Reading page (Full)', listening: 'the Listening practice page', writing: 'the Writing practice page', speaking: 'the Speaking practice page', article: 'the Articles page', pdf: 'the PDF Library page' };
  function countText(type, m) {
    const d = m.data || {}; const nq = (d.questions || []).length;
    if (type === 'writing') return (d.tasks || []).length + ' task(s)';
    if (type === 'speaking') { const ps = d.parts || []; return ps.length + ' part(s) · ' + ps.reduce((n, x) => n + (x.questions || []).length, 0) + ' questions' + (ps.some((x) => x.audioUrl) ? ' · 🔊' : ''); }
    if (type === 'pdf') return (d.fileUrl ? '📄 file' : '<span class="warn-text">no file</span>') + (d.pages ? ' · ' + d.pages + ' pages' : '');
    if (type === 'article') return esc(d.level || d.passageLabel || 'Passage 1') + ' · ' + `${(d.vocabulary || []).length} words · ${(d.grammar || []).length} grammar` + (d.imageUrl || d.coverUrl ? ' · 🖼 cover' : ' · <span class="warn-text">no cover</span>');
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
    writing: { title: 'Writing cards', noun: 'writing card', help: 'Each card is a Task 1 / Task 2 set on the Writing practice page, with its chart and model answer. It opens in the IELTS writing exam screen.' },
    speaking: { title: 'Speaking cards', noun: 'speaking card', help: 'Each card is a speaking test: Part 1, Part 2 cue card, Part 3.' },
    article: { title: 'Article cards', noun: 'article card', help: 'Each card is an article on the Articles page: text, cover picture and the vocabulary / grammar students tap on.' },
    pdf: { title: 'PDF material cards', noun: 'PDF material', help: 'Each card is a PDF on the PDF Library page. Upload the file and a card picture; students press Download.' }
  };
  function cardInfo(type, m) {
    const d = m.data || {}; const nq = (d.questions || []).length; const exp = (d.questions || []).filter((q) => String(q.explanation || '').trim()).length;
    const expTxt = nq ? (exp === nq ? ' · 💡 all explained' : exp ? ' · ' + exp + '/' + nq + ' explained' : '') : '';
    if (type === 'reading') return { img: d.coverUrl, tag: d.passageLabel || 'Passage 1', sub: nq + ' questions · ' + (d.durationMin ? d.durationMin + ' min' : 'no timer') + expTxt, href: d.no ? '/pessages/test-' + d.no : '/test?id=' + encodeURIComponent(m.id) };
    if (type === 'listening') return { img: d.coverUrl, tag: d.sectionLabel || 'Section 1', sub: nq + ' questions' + (d.audioUrl ? ' · 🔊 audio' : ' · ⚠ no audio') + expTxt, href: d.no ? '/sections/test-' + d.no : '/exam/listening/' + encodeURIComponent(m.id) };
    if (type === 'writing') { const ts = d.tasks || []; return { img: d.coverUrl || (ts.find((t) => t.imageUrl) || {}).imageUrl, tag: d.tier || 'Tier 1', sub: ts.length + ' task(s)' + (ts.some((t) => t.chart) ? ' · chart' : '') + (ts.some((t) => t.sample) ? ' · model answer' : ''), href: '/writing/?id=' + encodeURIComponent(m.id) }; }
    if (type === 'speaking') { const ps = d.parts || []; return { img: (ps.find((t) => t.imageUrl) || {}).imageUrl, tag: ps.length + ' part(s)', sub: ps.reduce((n, x) => n + (x.questions || []).length, 0) + ' questions' + (ps.some((x) => x.audioUrl) ? ' · 🔊' : ''), href: '/test?id=' + encodeURIComponent(m.id) }; }
    if (type === 'article') return { img: d.imageUrl || d.coverUrl, tag: d.level || d.passageLabel || 'Passage 1', sub: (d.topic || 'General') + ` · ${(d.vocabulary || []).length} words · ${(d.grammar || []).length} grammar`, href: '/collections/article?id=' + encodeURIComponent(m.id) };
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
  function syncSave() { const b = $('#cb-save'); if (b) { b.disabled = uploading > 0; b.textContent = uploading ? 'Uploading…' : (editingId ? 'Save changes' : 'Create'); } }

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
  function blank(type, mode) {
    if (type === 'article') {
      return { type, title: '', pack: '', description: '', premium: false, published: true,
        data: { topic: '', level: 'Passage 1', category: 'Academic Reading', lead: '', author: 'IELTSX Reading Team', date: today(), testDate: '', imageUrl: '', imageAlt: '', body: '', source: '', vocabulary: [blankV()], grammar: [] } };
    }
    const data = { durationMin: type === 'writing' ? 60 : type === 'listening' ? 30 : type === 'reading' ? (mode === 'full' ? 60 : 20) : 60, instructions: '', images: [] };
    if (type === 'reading') Object.assign(data, { mode: mode === 'full' ? 'full' : 'part', coverUrl: '', passageLabel: 'Passage 1', cardTypes: [], passage: '', passages: blankPassages(), questions: [blankQ()] });
    if (type === 'listening') Object.assign(data, { audioUrl: '', audioStart: 0, audioEnd: 0, durationMin: 10, transcript: '', coverUrl: '', sectionLabel: 'Section 1', cardTypes: [], questions: [blankQ('gap')] });
    if (type === 'pdf') { Object.assign(data, { fileUrl: '', coverUrl: '', category: 'reading', badge: 'PDF', corner: '', pages: 0, tags: [] }); delete data.instructions; delete data.images; }
    if (type === 'speaking') Object.assign(data, { parts: [
      { title: 'Part 1 · Introduction and interview', prompt: '', questions: [], imageUrl: '', audioUrl: '', prepSeconds: 0, speakSeconds: 0, sample: '' },
      { title: 'Part 2 · Long turn (cue card)', prompt: '', questions: [], imageUrl: '', audioUrl: '', prepSeconds: 60, speakSeconds: 120, sample: '' },
      { title: 'Part 3 · Discussion', prompt: '', questions: [], imageUrl: '', audioUrl: '', prepSeconds: 0, speakSeconds: 0, sample: '' }] });
    if (type === 'writing') Object.assign(data, { coverUrl: '', tier: 'Tier 1', cardTypes: [], tasks: [blankTask(1), blankTask(2)] });
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
    draft.data = draft.data || {};
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
    if (draft.type === 'reading' || draft.type === 'listening') { draft.groups = toGroups(draft.data.questions || []); if (!draft.groups.length) draft.groups = [newGroup(draft.type === 'listening' ? 'gap' : 'short')]; }
    if (draft.type === 'speaking' && !(draft.data.parts || []).length) draft.data.parts = blank('speaking').data.parts;
    if (draft.type === 'writing') {
      if (!(draft.data.tasks || []).length) draft.data.tasks = blank('writing').data.tasks;
      draft.data.tasks.forEach((t, i) => { t.kind = t.kind || (i === 0 ? 'task1' : 'task2'); t.chartText = chartToText(t.chart); t.chartUnit = (t.chart && t.chart.unit) || ''; });
    }
    $('#builder-title').textContent = (editingId ? 'Edit ' : 'New ') + (draft.type === 'reading' ? (draft.data.mode === 'full' ? 'full reading test' : 'part practice card') : NOUN[draft.type]);
    renderBuilder(); $('#builder').classList.add('open'); $('#builder-body').scrollTop = 0;
  }
  function closeBuilder() { if (uploading && !confirm('A file is still uploading. Close anyway?')) return; $('#builder').classList.remove('open'); draft = null; editingId = null; }

  const field = (label, path, val, extra = '') => `<label class="lbl">${label}<input class="field" data-p="${path}" value="${esc(val)}" ${extra}></label>`;
  const area = (label, path, val, rows, extra = '') => `<label class="lbl">${label}<textarea class="field" rows="${rows}" data-p="${path}" ${extra}>${esc(val)}</textarea></label>`;
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
  /* ═════════ Question GROUPS ═════════
     A group = one block of the paper ("Questions 1–5 …"): ONE type, ONE heading, ONE option list (for matching / map / word box) and its questions.
     The data saved on the server stays a flat list of questions (each carries its group heading, its options and a group number "gi"),
     so the player and the old tests do not change. toGroups() / flatten() convert between the two. */
  const SHARED_OPTS = ['matching', 'map', 'box'];                 // option list typed ONCE per group
  const isFullReading = () => !!draft && draft.type === 'reading' && draft.data.mode === 'full';
  const gLetters = (a) => String(a || '').toUpperCase().split(/[^A-Z]+/).filter(Boolean);
  const ROMANS = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i;
  const optToken = (o, i) => { const m = /^\s*([A-Za-z0-9]{1,5})\s*[.):]\s+([\s\S]*)$/.exec(String(o || '')); return m ? { l: m[1], t: m[2] } : { l: /^[A-Za-z]$/.test(String(o || '').trim()) ? String(o).trim() : String.fromCharCode(65 + i), t: String(o || '').trim() }; };
  const newItem = () => ({ prompt: '', answer: '', explanation: '', evidence: '', title: '', options: [] });
  const newGroup = (type, passage) => ({ type, passage: passage || 1, group: '', blockTitle: '', options: [], items: [newItem()] });
  const normType = (t) => (draft && draft.type === 'listening' ? (LQ_LABEL[t] ? t : 'gap') : (Q_LABEL[t] ? t : 'short'));

  function toGroups(qs) {
    const gs = []; let cur = null;
    (qs || []).forEach((q) => {
      const type = normType(q.type); const hasGi = q.gi !== undefined && q.gi !== null && q.gi !== '';
      const g = String(q.group || '').trim(); const shared = SHARED_OPTS.includes(type); const opts = Array.isArray(q.options) ? q.options : [];
      const pass = Number(q.passage) || 1;
      const same = cur && cur.type === type && pass === cur.passage && (hasGi ? q.gi === cur._gi : (!g || g === cur.group)) && (!shared || !opts.length || !cur.options.length || JSON.stringify(opts) === JSON.stringify(cur.options));
      if (!same) { cur = { type, passage: pass, group: g, blockTitle: q.blockTitle || '', options: [], items: [], _gi: hasGi ? q.gi : undefined }; gs.push(cur); }
      if (shared && !cur.options.length && opts.length) cur.options = opts.slice();
      if (!cur.group && g) cur.group = g; if (!cur.blockTitle && q.blockTitle) cur.blockTitle = q.blockTitle;
      cur.items.push({ prompt: q.prompt || '', answer: q.answer || '', explanation: q.explanation || '', evidence: q.evidence || '', title: q.title || '', options: shared ? [] : opts.slice() });
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
  const orderedGroups = () => { const gs = draft.groups || []; const idx = gs.map((_, i) => i); if (isFullReading()) idx.sort((a, b) => (gs[a].passage - gs[b].passage) || (a - b)); return idx; };
  function flatten(gs) {
    const out = []; const idx = (gs || []).map((_, i) => i);
    if (isFullReading()) idx.sort((a, b) => (gs[a].passage - gs[b].passage) || (a - b));
    idx.forEach((i, n) => { const g = gs[i]; const shared = SHARED_OPTS.includes(g.type);
      g.items.forEach((it) => out.push({ type: g.type, passage: g.passage || 1, gi: n, group: String(g.group || '').trim(), blockTitle: String(g.blockTitle || '').trim(), title: String(it.title || '').trim(), prompt: String(it.prompt || '').trim(),
        options: (shared ? g.options : it.options || []).map((o) => String(o).trim()).filter(Boolean), answer: normAnswer(g.type, it.answer), explanation: String(it.explanation || '').trim(), evidence: String(it.evidence || '').trim() })); });
    return out;
  }
  function numbering() {
    const gs = draft.groups || []; const map = {}; let n = 1;
    if (draft.type === 'listening') { const part = parseInt(String(draft.data.sectionLabel || '').replace(/\D+/g, ''), 10) || 1; n = (part - 1) * 10 + 1; }
    orderedGroups().forEach((i) => { const g = gs[i]; const from = n;
      g.items.forEach((it) => { n += g.type === 'mcq-multi' ? (draft.type === 'listening' ? Math.max(2, gLetters(it.answer).length) : Math.max(1, gLetters(it.answer).length)) : 1; });
      map[i] = { from, to: Math.max(from, n - 1) }; });
    return map;
  }

  /* ───────── checks before saving: every problem listed at once ───────── */
  function validate() {
    const out = []; const gs = draft.groups || []; const num = numbering(); const L = draft.type === 'listening';
    const err = (m, g) => out.push({ level: 'error', msg: m, g }); const warn = (m, g) => out.push({ level: 'warn', msg: m, g });
    let total = 0; const perPass = { 1: 0, 2: 0, 3: 0 };
    gs.forEach((g, gi) => {
      const where = 'Group ' + (gi + 1) + ' (' + (qLabels()[g.type] || g.type).split(':')[0] + ')'; const shared = SHARED_OPTS.includes(g.type);
      const filled = g.items.filter((it) => String(it.prompt || '').trim() || String(it.answer || '').trim());
      if (!filled.length) { warn(where + ' is empty and will be left out.', gi); return; }
      if (shared) {
        const ot = (g.options || []).filter(Boolean);
        if (ot.length < 2) err(where + ': type the option list (at least 2 lines) once, at the top of the group.', gi);
      }
      let n = num[gi] ? num[gi].from : 1;
      g.items.forEach((it) => {
        const has = String(it.prompt || '').trim(), ans = String(it.answer || '').trim(); const q = 'Question ' + n;
        if (!has && !ans) return;
        total += 1; perPass[g.passage || 1] += 1;
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
        n += g.type === 'mcq-multi' ? Math.max(L ? 2 : 1, gLetters(ans).length) : 1;
      });
      if (isFullReading() && !String(((draft.data.passages || [])[(g.passage || 1) - 1] || {}).passage || '').trim()) err(where + ' belongs to Passage ' + (g.passage || 1) + ', but that passage has no text.', gi);
    });
    if (!total) err('Add at least one question with its answer.');
    if (isFullReading() && total && total !== 40) warn('A full reading paper normally has 40 questions; this one has ' + total + ' (Passage 1: ' + perPass[1] + ', 2: ' + perPass[2] + ', 3: ' + perPass[3] + ').');
    if (L && total && total !== 10 && total <= 40 && (draft.data.sectionLabel || '').startsWith('Section')) warn('A listening section normally has 10 questions; this one has ' + total + '.');
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
    box: 'List the words of the box ONCE above. Each question is a line with ____ and the right word.'
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
  const qNum = (g, ii, from) => { let n = from; for (let k = 0; k < ii; k++) n += g.type === 'mcq-multi' ? Math.max(draft.type === 'listening' ? 2 : 1, gLetters(g.items[k].answer).length) : 1; return n; };
  function groupBlock(g, gi, range, total) {
    const L = draft.type === 'listening'; const shared = SHARED_OPTS.includes(g.type); const full = isFullReading();
    const items = g.items.map((it, ii) => {
      const p = `groups.${gi}.items.${ii}`; const multi = g.type === 'mcq' || g.type === 'mcq-multi';
      const prompt = `<textarea class="field gi-prompt" rows="${multi ? 2 : 1}" data-p="${p}.prompt" placeholder="${esc(GROUP_HINT[g.type] ? (g.type === 'tfng' || g.type === 'ynng' ? 'Statement' : multi ? 'Question' : g.type === 'matching' || g.type === 'map' ? 'Item, e.g. Paragraph A' : g.type === 'short' || g.type === 'completion' || g.type === 'gap' || g.type === 'box' ? 'Text with ____ for the gap' : 'Question') : 'Question')}">${esc(it.prompt)}</textarea>`;
      return `<div class="gi-row"><div class="cb-qn">${qNum(g, ii, range.from)}</div><div class="gi-main">
        <div class="gi-line">${prompt}${answerCell(g, gi, it, ii)}</div>
        ${multi ? `<textarea class="field" rows="4" data-lines="1" data-p="${p}.options" placeholder="Options, one per line (A, B, C… in this order)">${esc((it.options || []).join('\n'))}</textarea>` : ''}
        ${L && (g.type === 'gap' || g.type === 'box') ? `<input class="field" data-p="${p}.title" value="${esc(it.title)}" placeholder="Small sub-heading before this line (optional), e.g. Prices">` : ''}
        <input class="field gi-exp" data-p="${p}.explanation" value="${esc(it.explanation)}" placeholder="Explanation shown after submitting (optional). Words in &quot;quotes&quot; are lit up in the passage">
        ${L ? '' : `<input class="field gi-exp gi-ev" data-p="${p}.evidence" value="${esc(it.evidence || '')}" placeholder="Passage words to highlight (optional — copy them exactly; quotes in the explanation are used if empty)">`}</div>
        <button class="btn btn-sm btn-danger" data-cb="i-del" data-g="${gi}" data-i="${ii}" type="button" title="Delete this question">✕</button></div>`;
    }).join('');
    const mcqLike = g.type === 'mcq' || g.type === 'mcq-multi';
    return `<div class="cb-group" id="cb-group-${gi}"><div class="cb-ghead"><div class="cb-gtitle"><span class="cb-gno">Group ${gi + 1}</span><span class="cb-grange">Questions ${range.from}–${range.to} · ${g.items.length} question${g.items.length === 1 ? '' : 's'}</span></div>
        <div class="btn-row"><button class="btn btn-sm" data-cb="g-up" data-g="${gi}" type="button" title="Move up">↑</button><button class="btn btn-sm" data-cb="g-down" data-g="${gi}" type="button" title="Move down">↓</button><button class="btn btn-sm" data-cb="g-dup" data-g="${gi}" type="button" title="Copy this group">Copy</button><button class="btn btn-sm btn-danger" data-cb="g-del" data-g="${gi}" type="button">Remove group</button></div></div>
      <div class="cb-row"><select class="field" data-p="groups.${gi}.type" data-rerender="1" title="Type of this group">${Object.entries(qLabels()).map(([k, v]) => `<option value="${k}" ${g.type === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>${full ? passSelect(`groups.${gi}.passage`, g.passage) : ''}</div>
      <input class="field" data-p="groups.${gi}.group" value="${esc(g.group)}" placeholder="${L ? 'Instruction of this block, e.g. Complete the notes below. Write ONE WORD for each answer.' : 'Instruction of this group, e.g. Complete the notes. Write NO MORE THAN TWO WORDS. (“Questions 1–5” is added by itself. Empty = the standard instruction)'}">
      ${L ? `<input class="field" data-p="groups.${gi}.blockTitle" value="${esc(g.blockTitle)}" placeholder="Title above the block (optional), e.g. Barrington Historical Buildings Tours">` : ''}
      ${shared ? `<label class="lbl cb-shared">${SHARED_LABEL[g.type]}<textarea class="field" rows="${g.type === 'matching' ? 6 : 4}" data-lines="1" data-p="groups.${gi}.options" placeholder="${esc(SHARED_PH[g.type])}">${esc((g.options || []).join('\n'))}</textarea></label>
        ${g.type === 'matching' && !L ? `<div class="btn-row"><button class="btn btn-sm" data-cb="g-letters" data-g="${gi}" type="button">Fill paragraph letters A–G</button><button class="btn btn-sm" data-cb="g-letters-9" data-g="${gi}" type="button">A–I</button></div>` : ''}` : ''}
      <div class="gi-list">${items}</div>
      <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="i-add" data-g="${gi}" type="button">+ Question</button><button class="btn btn-sm" data-cb="g-paste" data-g="${gi}" type="button">Paste many into this group</button></div>
      <div class="cb-bulk" id="gpaste-${gi}" hidden><div class="muted sm"><b>${esc(GROUP_HINT[g.type] || '')}</b><br>One question per line: <code>question =&gt; answer =&gt; explanation</code> (explanation optional). Or blocks: <code>1. text</code> / <code>Answer: …</code> / <code>Explanation: …</code>.${mcqLike ? ' Put the options (<code>A. …</code>) under each question.' : ''}</div>
        <textarea class="field" id="gpaste-text-${gi}" rows="8" placeholder="${g.type === 'tfng' ? 'Glass was first made in Egypt. => TRUE => Paragraph A says so.\nThe factory closed in 1990. => NOT GIVEN' : 'The tour starts in ____ Street => Mill => Speaker says Mill Street.'}"></textarea>
        <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="g-paste-do" data-g="${gi}" type="button">Add to this group</button></div></div>
    </div>`;
  }
  function questionsInner() {
    const gs = draft.groups || []; const num = numbering(); const total = gs.reduce((n, g) => n + g.items.length, 0);
    const types = Object.entries(qLabels());
    return `<div class="cb-block"><div class="cb-head"><div><strong>Questions &amp; answers · ${gs.length} group${gs.length === 1 ? '' : 's'} · ${total} question${total === 1 ? '' : 's'}</strong>
      <div class="muted sm">Add a <b>group</b> for each block of the paper (“Questions 1–5”). Type its heading and its option list <b>once</b>, then only the questions. Several accepted answers: <code>colour|color</code>.</div></div>
      <div class="btn-row"><button class="btn btn-sm" data-cb="check" type="button">✓ Check</button><button class="btn btn-sm" data-cb="q-bulk" type="button">Paste many groups</button></div></div>
      <div id="bulk-box" class="cb-bulk" hidden><div class="muted sm"><b>Several groups in one go.</b> A line like <code>Questions 1–5 …</code> starts a new group (everything after it up to the next such line). Under it you may put the instruction line, the option list (<code>A. …</code> / <code>i. …</code>) once, then the questions:<br>
        <code>Questions 1–3 Do the following statements agree…</code><br><code>1. Glass was first made in Egypt. =&gt; TRUE =&gt; Paragraph A</code> &nbsp; or &nbsp; <code>1. text</code> + <code>Answer: TRUE</code> + <code>Explanation: …</code><br>The type of each group is detected from the answers; or pick it below.<br>No answers next to the questions? Paste the <b>ANSWERS</b> section (<code>1. TRUE — …</code>, <code>7 irrigation</code>, <code>Q21/Q22. A and C</code>) under them: it is matched by question number. A 4th part <code>=&gt; words to highlight</code> or an <code>Evidence: …</code> line sets the passage highlight; otherwise the words in “quotes” in the explanation are used.</div>
        <textarea class="field" id="bulk-text" rows="14" placeholder="Questions 1–3 Do the following statements agree with the information in the passage?&#10;1. Glass was first made in Egypt. => TRUE => Paragraph A, line 2.&#10;2. The factory closed in 1990. => NOT GIVEN&#10;&#10;Questions 4–6 Complete the notes. Write ONE WORD.&#10;4. The bees live in a ____ => hive"></textarea>
        <div class="btn-row"><select class="field" id="bulk-type" style="width:auto"><option value="auto">Auto-detect the type of each group</option>${types.map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select>${isFullReading() ? `<select class="field" id="bulk-pass" style="width:auto"><option value="">Passage: as the last group</option><option value="1">Passage 1</option><option value="2">Passage 2</option><option value="3">Passage 3</option></select>` : ''}<button class="btn btn-sm btn-primary" data-cb="q-bulk-do" type="button">Add the groups</button></div></div>
      <div id="cb-issues"></div>
      ${gs.map((g, gi) => groupBlock(g, gi, num[gi] || { from: 1, to: 1 }, total)).join('')}
      <div class="cb-addgroup"><span class="muted sm">New group:</span><select class="field" id="g-newtype" style="width:auto;max-width:100%">${types.map(([k, v]) => `<option value="${k}" ${(gs.length && gs[gs.length - 1].type === k) ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select><button class="btn btn-sm btn-primary" data-cb="g-add" type="button">+ Add group</button></div></div>`;
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
  const P_NUM = /^(?:Q\s*)?(\d{1,2})(?:\s*[.)\-:]\s*|\s+(?=[A-Za-z"“‘'(]|\d{3,4}\b))(.+)$/i, P_HEAD = /^(?:questions?|savollar)\s+\d+\s*(?:(?:[-–—]|to|dan)\s*\d+)?\b/i;
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
    const r = String(rest || '').replace(/[✓✔]/g, ' ').replace(/\s+/g, ' ').trim(); let m;
    if ((m = /^paragraph\s+[A-Z]\s*(?:→|->|=>)\s*(\S+)\s*[—–:-]?\s*(.*)$/i.exec(r))) return { ans: m[1], exp: m[2] };
    if ((m = /^paragraph\s+([A-Z])\b\s*[—–:-]?\s*(.*)$/i.exec(r))) return { ans: m[1], exp: m[2] };
    if ((m = /^(not\s+given|true|false|yes|no)\b\s*[—–:-]?\s*(.*)$/i.exec(r))) return { ans: m[1].toUpperCase().replace(/\s+/, ' '), exp: m[2] };
    if ((m = /^([A-J])((?:\s*(?:,|&|and)\s*[A-J]\b)+)\s*(?:\([^)]*\))?\s*[—–:-]?\s*(.*)$/.exec(r))) return { ans: (m[1] + m[2]).match(/[A-J]/g).join(','), exp: m[3] };
    if ((m = /^([A-J]|i{1,3}|iv|vi{0,3}|ix|xi{0,2}|x)\b\s*(?:\([^)]*\))?\s*[—–:-]?\s*(.*)$/.exec(r))) return { ans: m[1], exp: m[2] };
    if ((m = /^(.+?)(?:\s[—–-]\s|\s\(|:\s|\s{2,})(.*)$/.exec(r)) && m[1].split(/\s+/).length <= 5) return { ans: m[1].replace(/\s*\/\s*/g, '|'), exp: m[2] };
    const w = r.split(' '); return { ans: w[0], exp: w.slice(1).join(' ') };
  }
  function splitKey(text) {
    const lines = String(text || '').replace(/\r/g, '').replace(/\f/g, '\n').split('\n'); let at = -1;
    for (let i = 0; i < lines.length; i++) { const l = lines[i].trim(); if (KEY_HEAD.test(l) && l.length < 80 && !/write|boxes|choose|sheet/i.test(l)) { at = i; break; } }
    if (at < 0) return { text: lines.join('\n'), key: {} };
    const key = {}; let last = 0, cur = null;
    const ENTRY = /^\s*(?:Q\s*)?(\d{1,2})(?:\s*(?:\/|&|and|,)\s*(?:Q\s*)?(\d{1,2}))?\s*[.):]?\s+(.+)$/i;
    let pend = 0;   // a table copied from a PDF puts the number and the answer on separate lines
    lines.slice(at + 1).forEach((l) => {
      const t = l.trim(); if (!t) return;
      const lone = /^(?:Q\s*)?(\d{1,2})\s*[.):]?$/i.exec(t);
      if (lone && (Number(lone[1]) > last && Number(lone[1]) <= last + 3 || !last)) { pend = Number(lone[1]); return; }
      if (pend) { const a = keyAnswer(t); cur = { ans: a.ans, exp: a.exp }; key[pend] = cur; last = pend; pend = 0; return; }
      const m = ENTRY.exec(t);
      if (m && (Number(m[1]) > last && Number(m[1]) <= last + 3 || !last)) {
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
      const B = /[.!?;]\s|•|\n\s*\n|\n\s*o\s|\s{3,}/g;
      gaps.forEach((g, i) => {
        const from = i ? gaps[i - 1].e : 0, to = i + 1 < gaps.length ? gaps[i + 1].s : body.length;
        let left = body.slice(from, g.s); let b, lastB = -1; B.lastIndex = 0; while ((b = B.exec(left))) lastB = b.index + b[0].length; if (lastB >= 0) left = left.slice(lastB);
        let right = body.slice(g.e, to); B.lastIndex = 0; b = B.exec(right); if (b) right = right.slice(0, b.index + 1);
        const clip = (t, end) => { const w = t.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean); return end ? w.slice(-14).join(' ') : w.slice(0, 14).join(' '); };
        out.push(g.n + '. ' + (clip(left, true) + ' ____ ' + clip(right, false)).replace(/^[•\-\s]+/, '').trim());
      });
      run = [];
    };
    lines.forEach((l) => { if (isHead(l)) { flush(); out.push(l); } else run.push(l); });
    flush();
    return out.join('\n');
  }

  /* -> { blocks: [{ head, shared: [], qs: [{ prompt, options, answer, explanation }] }], skipped: [lines] } */
  function parseRaw(text, key) {
    key = key || {};
    if (!Object.keys(key).length) { const sk = splitKey(text); text = sk.text; key = sk.key; }
    text = expandGaps(dropWatermarks(text));
    // two option columns on one line ("A poverty        C boats") -> two lines
    const lines = String(text || '').replace(/\r/g, '').split('\n').reduce((acc, x) => { const parts = x.trim().split(/\s{3,}/); return acc.concat(parts.length > 1 && parts.every((y) => /^(?:[A-J]|[ivx]{1,4})\s+\S/.test(y)) ? parts : [x.trim()]); }, []).filter(Boolean);
    let expect = 0;
    const blocks = []; const skipped = []; let blk = null, cur = null, lastField = '';
    const newBlock = (head) => { blk = { head: head || '', shared: [], qs: [] }; blocks.push(blk); return blk; };
    const fromKey = (q) => { const k = key[q.num]; if (!k) return; if (!q.answer) q.answer = k.ans; if (!q.explanation && k.exp) q.explanation = k.exp; };
    const push = () => { if (cur && cur.prompt) { fromKey(cur); if (cur.answer) blk.qs.push(cur); else skipped.push(cur.prompt); } cur = null; lastField = ''; };
    lines.forEach((l) => {
      let m;
      if (P_HEAD.test(l) && !l.includes('=>') && (!cur || cur.answer || key[cur.num])) { push(); newBlock(l); return; }
      // an instruction line with no "Questions 1–5" above it still starts a new group
      if (P_INSTR.test(l) && !l.includes('=>') && blk && (blk.qs.length || cur) && (!cur || cur.answer || key[cur.num])) { push(); newBlock(l); return; }
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
      if (!cur && !numbered && !blk.qs.length && blk.head && !(/\?\s*$/.test(l) && !/^(?:which paragraph|do the following|which section)/i.test(l)) && !/_{2,}/.test(l) && !/^[A-Za-z]/.test(l.slice(0, 1) === '(' ? 'x' : '') ) { blk.head += ' ' + l; return; }
      push();
      const num = numbered ? Number(numbered[1]) : expect + 1;
      cur = { num, prompt: (numbered ? numbered[2] : l).trim(), options: [], answer: '', explanation: '', evidence: '' }; lastField = '';
      expect = num + Math.max(0, ((key[num] && /^[A-J](,[A-J])+$/.test(key[num].ans)) ? key[num].ans.split(',').length : 1) - 1);
    });
    push();
    blocks.forEach((b) => b.qs.forEach((q) => { delete q._done; }));
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
        b.forceType = 'matching';
      }
      b.qs.forEach((q) => {
        let type = forced && forced !== 'auto' ? forced : (b.forceType || detectType(q, b.shared));
        if (L) type = ({ short: 'gap', completion: 'gap', tfng: 'gap', ynng: 'gap' })[type] || type;
        if (!(cur && cur.type === type)) { cur = { type, passage: passage || 1, group: first ? b.head : '', blockTitle: '', options: [], items: [], _num: b.num }; first = false; groups.push(cur); }
        if (SHARED_OPTS.includes(type) && !cur.options.length) cur.options = (b.shared.length ? b.shared : q.options).slice();
        cur.items.push({ prompt: q.prompt, answer: normAnswer(type, q.answer), explanation: q.explanation, evidence: q.evidence || '', title: '', options: SHARED_OPTS.includes(type) ? [] : (q.options || []).slice() });
      });
    });
    if (!keepNum) groups.forEach((g) => { delete g._num; });
    return { groups, skipped: raw.skipped };
  }
  /* a whole full test: PASSAGE 1 / text / Questions 1–13 … / PASSAGE 2 … */
  function parseFullTest(text) {
    const sk = splitKey(dropWatermarks(text)); const key = sk.key;
    const src = sk.text; const re = /^[ \t]*(?:READING[ \t]+)?PASSAGE[ \t]*([123])[ \t]*(?:[:.\-\u2013\u2014][^\n]*)?$|^[^\n]*you should spend about \d+ minutes[^\n]*reading passage[ \t]*([123])\b[^\n]*$/gim; const marks = []; let m;
    while ((m = re.exec(src))) {
      const mk = { n: Number(m[1] || m[2]), at: m.index, end: m.index + m[0].length, line: /you should spend/i.test(m[0]) ? '' : m[0].trim() };
      const prev = marks[marks.length - 1];
      if (prev && prev.n === mk.n && !src.slice(prev.end, mk.at).trim()) { prev.end = mk.end; continue; }   // "READING PASSAGE 1" + "You should spend …" = one marker
      marks.push(mk);
    }
    if (!marks.length) return null;
    const passages = [{ title: '', passage: '' }, { title: '', passage: '' }, { title: '', passage: '' }]; const groups = []; const skipped = [];
    marks.forEach((mk, k) => {
      let chunk = src.slice(mk.end, k + 1 < marks.length ? marks[k + 1].at : src.length).replace(/^\n+/, '');
      let title = (/^[^\n]*?PASSAGE[ \t]*[123][ \t]*[:.\-–—]+[ \t]*(.+)$/i.exec(mk.line) || [])[1] || '';
      const ls = chunk.split('\n'); const hi = ls.findIndex((l) => P_HEAD.test(l.trim()) || P_INSTR.test(l.trim()));
      let ptxt = (hi >= 0 ? ls.slice(0, hi) : ls).join('\n').trim(); const qtxt = hi >= 0 ? ls.slice(hi).join('\n') : '';
      if (!title) { const first = ptxt.split('\n')[0] || ''; if (first && first.length < 120 && !/[.!?]$/.test(first.trim()) && ptxt.split(/\n\s*\n/).length > 1) { title = first.trim(); ptxt = ptxt.split('\n').slice(1).join('\n').trim(); } }
      passages[mk.n - 1] = { title: title.trim(), passage: ptxt };
      if (qtxt) { const r = parseGroups(qtxt, 'auto', mk.n, true, key); r.groups.forEach((g) => groups.push(g)); r.skipped.forEach((x) => skipped.push(x)); }
    });
    return { passages, groups, skipped };
  }
  function fullImportBlock() {
    return `<div class="cb-block cb-import"><div class="cb-head"><div><strong>⚡ Paste the whole test at once (fastest)</strong><div class="muted sm">Passages and all questions in one box. It fills the three passages and every question group for you. <b>Easiest: open the PDF, select all (Ctrl+A), copy and paste it here as it is</b> — if the PDF has an <b>ANSWERS / Answer key</b> section at the end, every answer and explanation is filled in from it, and the words quoted in each explanation are lit up in the passage. Then just look through the groups and fix what the checker shows.</div></div><button class="btn btn-sm btn-primary" data-cb="full-toggle" type="button">Open</button></div>
      <div id="full-box" hidden><div class="muted sm">A PDF copied as it is works (“READING PASSAGE 1” or “You should spend about 20 minutes … Reading Passage 1” marks each passage; an “ANSWERS” section at the end gives the answers). Or type it: a line <code>PASSAGE 1: Title</code>, then the passage text; then <code>Questions 1–5 …</code> with its questions (as in “Paste many groups”); then <code>PASSAGE 2</code> … and <code>PASSAGE 3</code>. A passage may also have its questions at the very end; in that case the groups are put into the passages by their numbers (1–13, 14–26, 27–40) and you can change a group’s passage with its Passage menu.</div>
      <textarea class="field" id="full-text" rows="16" placeholder="PASSAGE 1: The history of cakes&#10;Paragraph one…&#10;&#10;A. Paragraph two…&#10;&#10;Questions 1–5 Do the following statements agree with the information in the passage?&#10;1. Glass was first made in Egypt. => TRUE&#10;…&#10;&#10;PASSAGE 2: …"></textarea>
      <div class="btn-row"><button class="btn btn-sm btn-primary" data-cb="full-do" type="button">Fill the test from this text</button><span class="muted sm">This replaces the passages and questions already in the form.</span></div></div></div>`;
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
      <div class="cb-checks cb-checks-row"><label><input type="checkbox" data-p="premium" ${draft.premium ? 'checked' : ''}> Premium only</label><label><input type="checkbox" data-p="published" ${draft.published !== false ? 'checked' : ''}> Published (visible to students)</label></div>
      ${vocabBlock()}
      ${grammarBlock()}`;
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
  function renderBuilder() {
    const t = draft.type, d = draft.data;
    if (t === 'article') { $('#builder-body').innerHTML = articleForm(); return syncSave(); }
    $('#builder-body').innerHTML = `
      ${t === 'reading' && d.mode !== 'full' ? readingFormatBlock() : cardBlock(t, d)}
      <div class="cb-grid">${field('Title *', 'title', draft.title, 'placeholder="e.g. Cambridge 18 · Test 2 · Passage 1" maxlength="200"')}${field(t === 'reading' && d.mode !== 'full' ? 'Pack shown on the card (e.g. Starter Pack)' : 'Pack — pick one, or type a new name to create a new pack card', 'pack', draft.pack, 'list="ix-pack-list" placeholder="e.g. Pack 5" autocomplete="off"')}<datalist id="ix-pack-list">${packNames(draft.type).map((n) => `<option value="${esc(n)}"></option>`).join('')}</datalist></div>
      <label class="lbl">Short description (optional)<input class="field" data-p="description" value="${esc(draft.description)}" maxlength="500"></label>
      <div class="cb-grid">${t === 'article' || t === 'speaking' || t === 'pdf' ? '<div></div>' : `<label class="lbl">Time limit, minutes (0 = none)<input class="field" type="number" min="0" data-p="data.durationMin" value="${esc(d.durationMin)}"></label>`}
        <div class="cb-checks"><label><input type="checkbox" data-p="premium" ${draft.premium ? 'checked' : ''}> Premium only</label><label><input type="checkbox" data-p="published" ${draft.published !== false ? 'checked' : ''}> Published (visible to students)</label></div></div>
      ${t === 'reading' || t === 'listening' ? `<label class="lbl">Instructions shown above the questions (optional)<textarea class="field" rows="2" data-p="data.instructions">${esc(d.instructions)}</textarea></label>` : ''}
      ${t === 'reading' ? (d.mode === 'full' ? readingFormatBlock() + fullImportBlock() : '') + (d.mode === 'full' ? passagesBlock() : `<label class="lbl">Passage text *<textarea class="field cb-passage" rows="14" data-p="data.passage" placeholder="Paste the passage. Leave an empty line between paragraphs. Tip: start a line with A. / B. / C. to label paragraphs.">${esc(d.passage)}</textarea></label>`) : ''}
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
    const gt = /^groups\.(\d+)\.type$/.exec(p);
    if (gt) {   // another type: the option list moves between the group (matching / map / box) and the questions (multiple choice)
      const g = draft.groups[Number(gt[1])]; const shared = SHARED_OPTS.includes(g.type);
      if (shared && !(g.options || []).length) { const src = g.items.find((it) => (it.options || []).length); if (src) g.options = src.options.slice(); }
      if (!shared) g.items.forEach((it) => { if (!(it.options || []).length && (g.options || []).length && (g.type === 'mcq' || g.type === 'mcq-multi')) it.options = g.options.slice(); });
      g.items.forEach((it) => { it.answer = normAnswer(g.type, it.answer); });
    }
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
  async function save() {
    if (uploading) return;
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
      const a = t.dataset.cb, i = Number(t.dataset.i), d = draft.data;
      const scrollToLast = (sel) => { const all = document.querySelectorAll(sel); if (all.length) all[all.length - 1].scrollIntoView({ block: 'center' }); };
      if (a === 'img-add') { const url = await pickAndUpload('image/*', $('#img-status')); if (url) { draft.data.images.push({ url, caption: '' }); renderBuilder(); } }
      else if (a === 'img-del') { draft.data.images.splice(i, 1); renderBuilder(); }
      else if (a === 'audio') { const url = await pickAndUpload('audio/*,.mp3,.wav,.m4a,.ogg', $('#audio-status')); if (url) { draft.data.audioUrl = url; renderBuilder(); } }
      else if (a === 'check') showIssues(validate(), true);
      else if (a === 'q-bulk') { const b = $('#bulk-box'); b.hidden = !b.hidden; }
      else if (a === 'q-bulk-do') {
        const type = $('#bulk-type').value; const ps = $('#bulk-pass'); const last = draft.groups[draft.groups.length - 1];
        const passage = ps && ps.value ? Number(ps.value) : (last ? last.passage : 1);
        const r = parseGroups($('#bulk-text').value, type, passage);
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
      else if (a === 'full-toggle') { const b = $('#full-box'); b.hidden = !b.hidden; t.textContent = b.hidden ? 'Open' : 'Close'; }
      else if (a === 'full-do') {
        const r = parseFullTest($('#full-text').value);
        if (!r) return toast('Put “PASSAGE 1”, “PASSAGE 2”, “PASSAGE 3” on their own lines to mark where each passage starts.', true);
        const marked = (($('#full-text').value.match(/^[ \t]*(?:READING[ \t]+)?PASSAGE[ \t]*[123]\b/gim)) || []).length;
        if (marked > 1 && r.groups.length && r.groups.every((g) => g.passage === r.groups[0].passage) && r.groups[0].passage === 3 && r.passages[0].passage && r.passages[1].passage) {
          r.groups.forEach((g) => { const m = /(\d+)/.exec(g._num || ''); const n = m ? Number(m[1]) : 0; if (n) g.passage = n <= 13 ? 1 : n <= 26 ? 2 : 3; });
        }
        if (draft.groups.some((g) => g.items.some((it) => it.prompt || it.answer)) && !confirm('This replaces the passages and the questions already in the form. Continue?')) return;
        r.groups.forEach((g) => { delete g._num; });
        draft.data.passages = r.passages; draft.groups = r.groups.length ? r.groups : [newGroup('short')];
        renderBuilder(); const nq = r.groups.reduce((n, g) => n + g.items.length, 0);
        toast(r.passages.filter((x) => x.passage).length + ' passage(s) · ' + nq + ' questions · ' + r.groups.length + ' groups filled in' + (r.skipped.length ? ' · ' + r.skipped.length + ' line(s) NOT understood: “' + r.skipped[0].slice(0, 40) + '…”' : ''), !!r.skipped.length);
        showIssues(validate());
      }
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
      else if (a === 'p-add') { if (draft.data.parts.length < 3) { draft.data.parts.push({ title: 'Part ' + (draft.data.parts.length + 1), prompt: '', questions: [], imageUrl: '', audioUrl: '', prepSeconds: 0, speakSeconds: 0, sample: '' }); renderBuilder(); } }
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
