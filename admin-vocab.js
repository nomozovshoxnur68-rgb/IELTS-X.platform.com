/*
 * IELTSX admin: Vocabulary collections (admin.html#vocab).
 *
 * Each collection is a row of the materials store with type "vocab":
 *   premium   -> true = LOCKED (only Premium members can open / study it), false = FREE
 *   published -> false = Draft (students do not see it at all)
 *   data      -> { kind: 'collection' | 'test', level, source, icon, words: [...] }
 * The lock is enforced by the server (GET /api/materials/:id answers 403 to Free users and never sends the words),
 * so this panel only flips the flag.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const fmt = (v) => (v ? new Date(v).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
  const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Upper-intermediate', 'Advanced'];

  let items = null;            // null = not loaded yet
  const selected = new Set();
  let filter = 'all';          // all | collection | test
  let editingId = null;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);

  /* ───────── list ───────── */
  async function load() {
    try { items = (await api('/api/admin/materials?type=vocab')).items || []; } catch (e) { fail(e); items = items || []; }
    render();
  }
  const dataOf = (m) => m.data || {};
  const kindOf = (m) => (dataOf(m).kind === 'test' ? 'test' : 'collection');

  function render() {
    const mount = $('#content-vocab'); if (!mount) return;
    const all = items || [];
    const shown = all.filter((m) => filter === 'all' || kindOf(m) === filter);
    const nLocked = all.filter((m) => m.premium).length;
    const rows = shown.map((m) => {
      const d = dataOf(m); const words = (d.words || []).length; const kind = kindOf(m);
      return `<tr>
        <td><input type="checkbox" data-vc="sel" data-id="${esc(m.id)}" ${selected.has(m.id) ? 'checked' : ''} aria-label="Select"></td>
        <td><strong>${esc(m.title)}</strong><div class="muted sm">${esc(d.source || m.description || '')}${d.level ? ' · ' + esc(d.level) : ''}</div></td>
        <td>${kind === 'test' ? 'Study by test' + (d.icon === 'listening' ? ' · 🎧' : ' · 📖') : 'Collection'}</td>
        <td>${words}${words ? '' : ' <span class="warn-text">empty</span>'}</td>
        <td><button class="chip ${m.premium ? 'chip-premium' : 'chip-ok'}" data-vc="premium" data-id="${esc(m.id)}" type="button" title="Click to switch Free / Locked">${m.premium ? '🔒 Premium (locked)' : '🔓 Free'}</button></td>
        <td><button class="chip ${m.published === false ? '' : 'chip-ok'}" data-vc="publish" data-id="${esc(m.id)}" type="button" title="Click to change">${m.published === false ? 'Draft' : 'Published'}</button></td>
        <td>${fmt(m.createdAt)}</td>
        <td><div class="btn-row"><button class="btn btn-sm" data-vc="edit" data-id="${esc(m.id)}" type="button">Edit</button><a class="btn btn-sm" href="/vocabulary/study?id=${encodeURIComponent(m.id)}" target="_blank" rel="noopener">Open ↗</a><button class="btn btn-sm btn-danger" data-vc="delete" data-id="${esc(m.id)}" type="button">Delete</button></div></td></tr>`;
    }).join('');
    const bulk = selected.size
      ? `<div class="toolbar" style="margin:0 0 12px"><strong>${selected.size} selected</strong>
           <button class="btn btn-sm" data-vc="bulk" data-mode="lock" type="button">🔒 Make Premium</button>
           <button class="btn btn-sm" data-vc="bulk" data-mode="free" type="button">🔓 Make Free</button>
           <button class="btn btn-sm" data-vc="bulk" data-mode="publish" type="button">Publish</button>
           <button class="btn btn-sm" data-vc="bulk" data-mode="draft" type="button">Move to Draft</button>
           <button class="btn btn-sm" data-vc="clear" type="button">Clear</button></div>` : '';
    mount.innerHTML = `<div class="card"><div class="section-head"><div>
        <div class="section-title">Vocabulary collections</div>
        <div class="muted sm">${all.length} total · ${nLocked} locked (Premium) · ${all.length - nLocked} free. Click the Free / Premium badge to unlock or lock a card. Locked cards ask Free users to upgrade; the words are never sent to them.</div></div>
        <button class="btn btn-primary" data-vc="new" type="button">+ New collection</button></div>
      <div class="tabs" style="margin-bottom:12px">
        ${[['all', 'All'], ['collection', 'Collections'], ['test', 'Study by test']].map(([k, l]) => `<button class="tab ${filter === k ? 'active' : ''}" data-vc="filter" data-k="${k}" type="button">${l}</button>`).join('')}
      </div>${bulk}
      ${items === null ? '<div class="empty">Loading…</div>' : shown.length ? `<div class="table-wrap"><table class="table"><thead><tr><th style="width:28px"><input type="checkbox" data-vc="all" aria-label="Select all" ${shown.length && shown.every((m) => selected.has(m.id)) ? 'checked' : ''}></th><th>Title</th><th>Type</th><th>Words</th><th>Access</th><th>Status</th><th>Added</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>` : '<div class="empty">Nothing here yet. Press “+ New collection” and paste your words.</div>'}
    </div>`;
  }

  /* ───────── words <-> text ───────── */
  // one word per line:  word | part of speech | definition | example | synonym, synonym | opposite, opposite
  function wordsToText(words) {
    return (words || []).map((w) => [w.word, w.pos, w.definition, w.example, (w.synonyms || []).join(', '), (w.opposites || []).join(', ')].map((x) => String(x || '').replace(/\|/g, '/').replace(/\s*\n\s*/g, ' ')).join(' | ')).join('\n');
  }
  function parseWords(text) {
    const words = []; const bad = []; const seen = new Set();
    String(text || '').split(/\r?\n/).forEach((raw, i) => {
      const line = raw.trim(); if (!line || line[0] === '#') return;
      const parts = (line.includes('|') ? line.split('|') : line.split('\t')).map((x) => x.trim());
      if (i === 0 && /^word$/i.test(parts[0])) return;           // header row
      const [word, pos, definition, example, syn, opp] = parts;
      if (!word || !definition) { bad.push(i + 1); return; }
      const key = word.toLowerCase(); if (seen.has(key)) { bad.push(i + 1); return; } seen.add(key);
      const list = (v) => String(v || '').split(/[,;]/).map((x) => x.trim()).filter(Boolean);
      words.push({ word, pos: pos || '', definition, example: example || '', synonyms: list(syn), opposites: list(opp) });
    });
    return { words, bad };
  }

  /* ───────── editor ───────── */
  function modal() {
    let m = $('#vocab-modal'); if (m) return m;
    m = document.createElement('div'); m.id = 'vocab-modal'; m.className = 'modal-backdrop';
    document.body.appendChild(m); return m;
  }
  function openEditor(item) {
    editingId = item ? item.id : null;
    const d = item ? dataOf(item) : {};
    const m = modal();
    m.innerHTML = `<div class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="vc-title">
      <div class="cb-top"><h3 id="vc-title">${item ? 'Edit collection' : 'New collection'}</h3><button class="btn btn-sm" data-vc="close" type="button" aria-label="Close">✕</button></div>
      <div class="cb-body">
        <div class="cb-grid">
          <label class="lbl">Title *<input class="field" id="vc-name" maxlength="120" placeholder="e.g. B2 - Part 1" value="${esc(item ? item.title : '')}"></label>
          <label class="lbl">Source line<input class="field" id="vc-source" maxlength="120" placeholder="e.g. The Oxford 5000 by CEFR level" value="${esc(d.source || '')}"></label>
        </div>
        <div class="cb-grid">
          <label class="lbl">Level badge<input class="field" id="vc-level" list="vc-levels" maxlength="40" value="${esc(d.level || 'Intermediate')}"><datalist id="vc-levels">${LEVELS.map((l) => `<option value="${l}">`).join('')}</datalist></label>
          <label class="lbl">Where it appears
            <select class="field" id="vc-kind"><option value="collection" ${d.kind !== 'test' ? 'selected' : ''}>Vocabulary collections</option><option value="test" ${d.kind === 'test' ? 'selected' : ''}>Study by test (Needs practice)</option></select></label>
        </div>
        <div class="cb-grid">
          <label class="lbl">Icon (for “Study by test”)
            <select class="field" id="vc-icon"><option value="reading" ${d.icon !== 'listening' ? 'selected' : ''}>📖 Reading</option><option value="listening" ${d.icon === 'listening' ? 'selected' : ''}>🎧 Listening</option></select></label>
          <div class="cb-checks"><label><input type="checkbox" id="vc-premium" ${item && item.premium ? 'checked' : ''}> 🔒 Premium only (locked for Free users)</label>
            <label><input type="checkbox" id="vc-published" ${!item || item.published !== false ? 'checked' : ''}> Published (visible to students)</label></div>
        </div>
        <label class="lbl">Words <span class="muted sm">— one per line: <code>word | part of speech | definition | example | synonyms, … | opposites, …</code></span>
          <textarea class="field" id="vc-words" rows="14" spellcheck="false" placeholder="altogether | adverb | completely, or considering everything as a whole. | The new system is altogether more efficient than the previous one. | wholly, entirely, completely, totally, all | partly">${esc(wordsToText(d.words))}</textarea></label>
        <div class="btn-row" style="justify-content:space-between;align-items:center">
          <span class="muted sm" id="vc-count"></span>
          <span><input type="file" id="vc-file" accept=".txt,.csv,.tsv" hidden><button class="btn btn-sm" data-vc="import" type="button">Import .txt / .tsv file</button></span>
        </div>
      </div>
      <div class="modal-actions"><button class="btn" data-vc="close" type="button">Cancel</button><button class="btn btn-primary" id="vc-save" data-vc="save" type="button">${item ? 'Save changes' : 'Create'}</button></div>
    </div>`;
    m.classList.add('open'); count(); setTimeout(() => { const n = $('#vc-name'); n && n.focus(); }, 30);
  }
  function closeEditor() { const m = $('#vocab-modal'); if (m) m.classList.remove('open'); editingId = null; }
  function count() {
    const t = $('#vc-words'); const c = $('#vc-count'); if (!t || !c) return;
    const { words, bad } = parseWords(t.value);
    c.innerHTML = `${words.length} word(s) ready` + (bad.length ? ` · <span class="warn-text">skipped line ${bad.slice(0, 8).join(', ')}${bad.length > 8 ? '…' : ''} (needs at least word | pos | definition, no duplicates)</span>` : '');
  }
  async function save() {
    const title = $('#vc-name').value.trim(); if (!title) return toast('Title is required.', true);
    const { words, bad } = parseWords($('#vc-words').value);
    if (bad.length && !confirm(`${bad.length} line(s) will be skipped (missing definition or duplicate word). Save anyway?`)) return;
    const body = { type: 'vocab', title, description: $('#vc-source').value.trim(), premium: $('#vc-premium').checked, published: $('#vc-published').checked,
      data: { kind: $('#vc-kind').value, level: $('#vc-level').value.trim(), source: $('#vc-source').value.trim(), icon: $('#vc-icon').value, words } };
    const btn = $('#vc-save'); btn.disabled = true; btn.textContent = 'Saving…';
    try {
      const res = editingId ? await api('/api/admin/materials/' + encodeURIComponent(editingId), { method: 'PATCH', body: JSON.stringify(body) })
        : await api('/api/admin/materials', { method: 'POST', body: JSON.stringify(body) });
      const it = res.item; const i = items.findIndex((x) => x.id === it.id);
      if (i >= 0) items[i] = it; else items.unshift(it);
      toast(editingId ? 'Collection saved.' : 'Collection created.'); closeEditor(); render();
    } catch (e) { fail(e); btn.disabled = false; btn.textContent = editingId ? 'Save changes' : 'Create'; }
  }

  /* ───────── quick actions ───────── */
  async function patch(id, body) {
    const res = await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify(body) });
    const i = items.findIndex((x) => x.id === id); if (i >= 0) items[i] = res.item; return res.item;
  }
  async function bulk(mode) {
    const ids = Array.from(selected); if (!ids.length) return;
    const body = mode === 'lock' ? { premium: true } : mode === 'free' ? { premium: false } : mode === 'publish' ? { published: true } : { published: false };
    try { for (const id of ids) await patch(id, body); toast(ids.length + ' updated.'); selected.clear(); } catch (e) { fail(e); }
    render();
  }

  async function onClick(e) {
    const b = e.target.closest('[data-vc]'); if (!b) return;
    const act = b.dataset.vc; const id = b.dataset.id;
    try {
      if (act === 'new') return openEditor(null);
      if (act === 'edit') return openEditor(items.find((x) => x.id === id));
      if (act === 'close') return closeEditor();
      if (act === 'save') return save();
      if (act === 'filter') { filter = b.dataset.k; return render(); }
      if (act === 'clear') { selected.clear(); return render(); }
      if (act === 'bulk') return bulk(b.dataset.mode);
      if (act === 'import') return $('#vc-file').click();
      if (act === 'premium') { const m = items.find((x) => x.id === id); const it = await patch(id, { premium: !m.premium }); toast(it.premium ? 'Locked: Premium only.' : 'Unlocked: free for everyone.'); return render(); }
      if (act === 'publish') { const m = items.find((x) => x.id === id); const it = await patch(id, { published: m.published === false }); toast(it.published === false ? 'Moved to Draft.' : 'Published.'); return render(); }
      if (act === 'delete') {
        const m = items.find((x) => x.id === id); if (!m || !confirm('Delete “' + m.title + '”? This cannot be undone.')) return;
        await api('/api/admin/materials/' + encodeURIComponent(id), { method: 'DELETE' });
        items = items.filter((x) => x.id !== id); selected.delete(id); toast('Deleted.'); return render();
      }
    } catch (err) { fail(err); }
  }
  function onChange(e) {
    const t = e.target;
    if (t.matches && t.matches('[data-vc="sel"]')) { t.checked ? selected.add(t.dataset.id) : selected.delete(t.dataset.id); return render(); }
    if (t.matches && t.matches('[data-vc="all"]')) {
      const shown = (items || []).filter((m) => filter === 'all' || kindOf(m) === filter);
      shown.forEach((m) => (t.checked ? selected.add(m.id) : selected.delete(m.id))); return render();
    }
    if (t.id === 'vc-file' && t.files && t.files[0]) {
      const f = t.files[0]; if (f.size > 2 * 1024 * 1024) return toast('File is larger than 2 MB.', true);
      const r = new FileReader();
      r.onload = () => { const ta = $('#vc-words'); ta.value = (ta.value.trim() ? ta.value.trim() + '\n' : '') + String(r.result || '').trim(); count(); toast('File added to the list.'); };
      r.readAsText(f); t.value = '';
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    render();
    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);
    document.addEventListener('input', (e) => { if (e.target.id === 'vc-words') count(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEditor(); });
    const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'vocab' && items === null) load(); };
    window.addEventListener('hashchange', onHash); onHash();
    const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if (items !== null) load(); });
  });
})();
