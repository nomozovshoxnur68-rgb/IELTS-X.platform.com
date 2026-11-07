/*
 * IELTSX admin: Mock tests (admin.html#mocks).
 * A mock test is Listening + Reading + Writing in one sitting (the exam shell /full-mock/). For each paper choose
 *   - a random built-in paper (a new one for every attempt of a student),
 *   - one built-in paper, or
 *   - a Full test made in this panel (a Draft is fine: it is then used only in mocks).
 * Plus the card: name, description, picture, tier label, who may take it (Free / Standard / Max / Ultra), exam mode.
 * The server checks everything again (mock-tests.js); the papers are never named to students.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const KINDS = [['listening', 'Listening', '♫'], ['reading', 'Reading', '▥'], ['writing', 'Writing', '✎']];
  const ACCESS = [['free', 'Free'], ['standard', 'Standard'], ['max', 'Max'], ['ultra', 'Ultra']];
  const MODES = [['both', 'Student chooses (Real exam or Practice)'], ['real', 'Real exam only (no submit button, the clock ends each paper)'], ['practice', 'Practice only']];
  let data = null, edit = null, busy = false, loading = false;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);

  async function load() {
    if (loading) return; loading = true; render();
    try { data = await api('/api/admin/mocks'); } catch (e) { fail(e); data = data || { mocks: [], options: { builtin: {}, material: {} } }; }
    loading = false; render();
  }

  /* what a paper is, in words */
  function paperText(kind, p) {
    const o = (data && data.options) || {};
    if (!p || p.src === 'random') return 'Random built-in paper';
    if (p.src === 'builtin') { const b = ((o.builtin || {})[kind] || []).find((x) => x.id === p.id); return 'Built-in ' + p.id + (b && b.title ? ' — ' + b.title : ''); }
    const m = ((o.material || {})[kind] || []).find((x) => x.id === p.id);
    return m ? '“' + m.title + '”' + (m.published ? '' : ' (Draft)') : '“' + (p.title || 'a test of this panel') + '” (removed?)';
  }
  const planChip = (a) => (a === 'free' ? '<span class="chip chip-ok">Free</span>' : `<span class="chip chip-premium">🔒 ${esc((ACCESS.find((x) => x[0] === a) || ['', 'Standard'])[1])}</span>`);

  function card(m) {
    const cover = m.coverUrl ? `<img src="${esc(m.coverUrl)}" alt="">` : '<span class="mk-cover-mark">IELTS<br><small>Full mock</small></span>';
    return `<article class="mk-card${m.published === false ? ' is-hidden' : ''}">
      <div class="mk-cover">${cover}</div>
      <div class="mk-body">
        <div class="mk-title"><strong>${esc(m.title)}</strong>${m.builtin ? '<span class="chip">built-in</span>' : ''}${m.published === false ? '<span class="chip">Hidden</span>' : ''}</div>
        <div class="mk-chips">${planChip(m.access)}${m.tier ? `<span class="chip">${esc(m.tier)}</span>` : ''}<span class="chip">${m.modes === 'real' ? 'Real exam only' : m.modes === 'practice' ? 'Practice only' : 'Real or Practice'}</span>${m.order ? `<span class="chip">position ${m.order}</span>` : ''}</div>
        ${m.description ? `<p class="muted sm mk-desc">${esc(m.description)}</p>` : ''}
        <ul class="mk-papers">${KINDS.map(([k, name, ico]) => `<li><span class="mk-ico">${ico}</span><b>${name}</b><span>${esc(paperText(k, m.papers && m.papers[k]))}</span></li>`).join('')}</ul>
        <div class="btn-row">
          <button class="btn btn-sm btn-primary" data-mk="edit" data-id="${esc(m.id)}" type="button">Edit</button>
          <button class="btn btn-sm" data-mk="pub" data-id="${esc(m.id)}" type="button">${m.published === false ? 'Show' : 'Hide'}</button>
          <a class="btn btn-sm" href="/full-mock/?mock=${encodeURIComponent(m.id)}" target="_blank" rel="noopener">Open ↗</a>
          ${m.builtin ? '<button class="btn btn-sm" data-mk="del" data-id="' + esc(m.id) + '" type="button" title="Back to its first settings">Reset</button>' : `<button class="btn btn-sm btn-danger" data-mk="del" data-id="${esc(m.id)}" type="button">Delete</button>`}
        </div>
      </div></article>`;
  }

  function paperSelect(kind, name, cur) {
    const o = (data && data.options) || {}; const B = (o.builtin || {})[kind] || []; const M = (o.material || {})[kind] || [];
    const val = !cur || cur.src === 'random' ? 'random' : cur.src === 'builtin' ? 'b:' + cur.id : 'm:' + cur.id;
    const opt = (v, l) => `<option value="${esc(v)}" ${v === val ? 'selected' : ''}>${esc(l)}</option>`;
    const help = kind === 'writing' ? 'Writing tests of this panel need a Task 1 and a Task 2 (Part or Full).' : `Only Full ${name} tests (a whole paper, 40 questions) can be used. A Draft is used only in mocks.`;
    return `<label class="lbl">${name} paper<select class="field" id="mk-${kind}">
        ${opt('random', 'Random built-in paper (a new one for every attempt)')}
        ${B.length ? `<optgroup label="Built-in ${name.toLowerCase()} papers">${B.map((b) => opt('b:' + b.id, b.id + (b.title ? ' — ' + b.title : ''))).join('')}</optgroup>` : ''}
        ${M.length ? `<optgroup label="${name} tests made in this panel">${M.map((m) => opt('m:' + m.id, m.title + (m.published ? '' : ' (Draft)') + (kind === 'writing' && m.mode !== 'full' ? ' · Part' : ''))).join('')}</optgroup>` : `<option disabled>— no ${kind === 'writing' ? '' : 'Full '}${name} test in this panel yet —</option>`}
      </select><span class="muted sm">${help}</span></label>`;
  }
  function form() {
    const f = edit;
    const sel = (id, list, cur) => `<select class="field" id="${id}">${list.map(([v, l]) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
    return `<div class="cb-block mk-form"><div class="section-head" style="margin:0"><strong>${f.id ? 'Edit “' + esc(f.title) + '”' : 'New mock test'}</strong></div>
      <div class="cb-grid"><label class="lbl">Name *<input class="field" id="mk-title" maxlength="90" value="${esc(f.title)}" placeholder="e.g. Mock Test · November 2026"></label>
        <label class="lbl">Tier / label on the card (optional)<input class="field" id="mk-tier" maxlength="20" value="${esc(f.tier)}" placeholder="e.g. Recent exam"></label></div>
      <label class="lbl">Short description<textarea class="field" id="mk-desc" rows="2" maxlength="400" placeholder="What makes this mock special (shown on the card)">${esc(f.description)}</textarea></label>
      <div class="mk-cover-row"><div class="mk-cover sm">${f.coverUrl ? `<img src="${esc(f.coverUrl)}" alt="">` : '<span class="mk-cover-mark">IELTS<br><small>Full mock</small></span>'}</div>
        <div style="flex:1;min-width:220px"><label class="lbl">Card picture (optional)<input class="field" id="mk-cover" value="${esc(f.coverUrl)}" placeholder="https://… or upload"></label>
        <div class="btn-row" style="margin-top:6px"><button class="btn btn-sm" data-mk="upload" type="button" ${busy ? 'disabled' : ''}>⬆ Upload picture</button>${f.coverUrl ? '<button class="btn btn-sm" data-mk="nocover" type="button">Remove</button>' : ''}<span class="muted sm" id="mk-up"></span></div></div></div>
      <div class="cb-grid">${paperSelect('listening', 'Listening', f.papers.listening)}${paperSelect('reading', 'Reading', f.papers.reading)}${paperSelect('writing', 'Writing', f.papers.writing)}</div>
      <div class="cb-grid"><label class="lbl">Who can take it${sel('mk-access', ACCESS, f.access)}</label>
        <label class="lbl">Exam mode${sel('mk-modes', MODES, f.modes)}</label>
        <label class="lbl">Position (1 = first, empty = newest first)<input class="field" id="mk-order" type="number" min="0" max="999" value="${esc(f.order || '')}"></label></div>
      <div class="cb-checks"><label><input type="checkbox" id="mk-pub" ${f.published !== false ? 'checked' : ''}> Visible to students</label></div>
      <div class="muted sm">Students never see which papers a mock uses. The answers are marked again on the server, and each paper opens only inside the student's own attempt.</div>
      <div class="btn-row"><button class="btn btn-primary" data-mk="save" type="button" ${busy ? 'disabled' : ''}>${f.id ? 'Save changes' : 'Create mock test'}</button><button class="btn" data-mk="cancel" type="button">Cancel</button></div></div>`;
  }
  function render() {
    const mount = $('#content-mocks'); if (!mount) return;
    if (!data) { mount.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
    const list = data.mocks || [];
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">Mock tests · cards of the Mock Tests page</div>
        <div class="muted sm">A mock is Listening + Reading + Writing in one sitting, in full screen, timed like the exam. Pick each paper (random built-in, one built-in, or a Full test made in this panel), the plan and the exam mode. Results go to the student's Performance page (Mock).</div></div>
        ${edit ? '' : '<div class="btn-row"><a class="btn" href="/Mock%20tests" target="_blank" rel="noopener">Open the page ↗</a><button class="btn btn-primary" data-mk="new" type="button">+ New mock test</button></div>'}</div>
      ${edit ? form() : ''}
      ${list.length ? `<div class="mk-grid">${list.map(card).join('')}</div>` : '<div class="empty">No mock tests yet. Press “+ New mock test”.</div>'}</div>`;
  }

  function readForm() {
    const paper = (k) => { const v = $('#mk-' + k).value; return v === 'random' ? { src: 'random' } : v.startsWith('b:') ? { src: 'builtin', id: v.slice(2) } : { src: 'material', id: v.slice(2) }; };
    return { title: $('#mk-title').value, tier: $('#mk-tier').value, description: $('#mk-desc').value, coverUrl: $('#mk-cover').value.trim(), access: $('#mk-access').value, modes: $('#mk-modes').value,
      order: $('#mk-order').value, published: $('#mk-pub').checked, papers: { listening: paper('listening'), reading: paper('reading'), writing: paper('writing') } };
  }
  async function onClick(e) {
    const t = e.target.closest('[data-mk]'); if (!t || !$('#content-mocks').contains(t)) return;
    const a = t.dataset.mk; const m = (data && data.mocks || []).find((x) => x.id === t.dataset.id);
    try {
      if (a === 'new') { edit = { title: '', tier: '', description: '', coverUrl: '', access: 'standard', modes: 'both', order: 0, published: true, papers: { listening: { src: 'random' }, reading: { src: 'random' }, writing: { src: 'random' } } }; render(); $('#mk-title').focus(); }
      else if (a === 'edit' && m) { edit = JSON.parse(JSON.stringify(m)); render(); $('#content-mocks').scrollIntoView({ block: 'start' }); }
      else if (a === 'cancel') { edit = null; render(); }
      else if (a === 'nocover') { Object.assign(edit, readForm(), { coverUrl: '' }); render(); }
      else if (a === 'upload') {
        if (!window.IXAdmin || !window.IXAdmin.uploadFile) return toast('The upload is not ready yet. Reload the page.', true);
        const f = await new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(i); i.addEventListener('cancel', () => { i.remove(); res(null); }); i.onchange = () => { const x = i.files && i.files[0]; i.remove(); res(x); }; i.click(); });
        if (!f) return;
        Object.assign(edit, readForm()); busy = true; render(); $('#mk-up').textContent = 'Uploading ' + f.name + ' …';
        try { edit.coverUrl = await window.IXAdmin.uploadFile(f); toast('Picture uploaded'); } finally { busy = false; render(); }
      }
      else if (a === 'save') {
        const body = readForm(); if (!body.title.trim()) return toast('Please enter the name of the mock test.', true);
        busy = true; render(); Object.assign(edit, body);
        try {
          if (edit.id) await api('/api/admin/mocks/' + encodeURIComponent(edit.id), { method: 'PATCH', body: JSON.stringify(body) });
          else await api('/api/admin/mocks', { method: 'POST', body: JSON.stringify(body) });
          toast(edit.id ? 'Mock test saved' : 'Mock test created'); edit = null;
        } finally { busy = false; }
        await load();
      }
      else if (a === 'pub' && m) { await api('/api/admin/mocks/' + encodeURIComponent(m.id), { method: 'PATCH', body: JSON.stringify({ published: m.published === false }) }); toast(m.published === false ? 'Visible to students' : 'Hidden from students'); await load(); }
      else if (a === 'del' && m) {
        if (!confirm(m.builtin ? 'Reset “' + m.title + '” to its first settings?' : 'Delete the mock test “' + m.title + '”? Results already taken stay on the students\' accounts.')) return;
        await api('/api/admin/mocks/' + encodeURIComponent(m.id), { method: 'DELETE' }); toast(m.builtin ? 'Mock test reset' : 'Mock test deleted'); edit = null; await load();
      }
    } catch (err) { busy = false; fail(err); render(); }
  }

  function onHash() { if ((location.hash || '').slice(1).split('?')[0] === 'mocks' && !data && !loading) load(); }
  window.addEventListener('DOMContentLoaded', () => { render(); document.addEventListener('click', onClick); onHash(); });
  window.addEventListener('hashchange', onHash);
  document.addEventListener('click', (e) => { if (e.target.closest('#refresh') && (location.hash || '').startsWith('#mocks')) { data = null; edit = null; load(); } });
})();
