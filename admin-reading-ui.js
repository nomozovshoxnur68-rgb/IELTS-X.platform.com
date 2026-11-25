/*
 * IELTSX admin: Reading interface (admin.html#readingui).
 * The two looks of the Reading tests (assets/js/reading-ui.js): the default of the website, whether students may choose
 * their own (Account -> Interface), and the look of each built-in test page. A test made in the admin panel has its own
 * "Interface" in its form and on its card (admin-content.js).
 * A student's own choice comes first, then the test, then the default. Kept by the server in Settings ("reading-ui").
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const LOOKS = [['modern', 'New', 'Clock in the middle, heading gaps above the paragraphs, a review with explanation cards and a Vocabulary tab.'],
    ['classic', 'Classic', 'The interface the tests have always had.']];
  let cfg = null, saved = '', groups = [], loading = false, busy = false, query = '';

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const plain = () => JSON.stringify({ default: cfg.default, choice: cfg.choice, pages: cfg.pages });
  const dirty = () => !!cfg && plain() !== saved;
  const keyOf = (href) => { let p = String(href || '').split(/[?#]/)[0]; try { p = decodeURIComponent(p); } catch (e) { /* as it is */ } return p.replace(/\/+$/, '').replace(/\.html$/i, '').toLowerCase(); };
  // the built-in pages that run on the shared engine; the five oldest passages are pages of their own and keep their look
  const switchable = (href) => /^\/full-tests\/reading\/test-/.test(keyOf(href)) || /^\/pessages\/test-(19|20|21)$/.test(keyOf(href));
  const lookName = (v) => (v === 'modern' ? 'New' : 'Classic');
  const options = (cur) => `<option value="" ${cur ? '' : 'selected'}>Default · ${lookName(cfg.default)}</option>` + LOOKS.map(([v, l]) => `<option value="${v}" ${cur === v ? 'selected' : ''}>${l}</option>`).join('');

  function render() {
    const mount = $('#content-readingui'); if (!mount) return;
    if (!cfg) { mount.innerHTML = '<div class="empty">Loading…</div>'; return; }
    const q = query.trim().toLowerCase();
    const rows = groups.map((g) => {
      const tests = g.tests.filter((t) => !q || (g.title + ' ' + t.title + ' ' + t.source).toLowerCase().includes(q));
      return tests.length ? `<tr class="rui-group"><td colspan="3"><strong>${esc(g.title)}</strong> <span class="muted sm">${tests.length} test(s)</span></td></tr>` + tests.map((t) =>
        `<tr><td>${esc(t.title)}<div class="muted sm">${esc(t.source)}</div></td><td><select class="field" data-rui-page="${esc(t.key)}" aria-label="Interface of ${esc(t.title)}">${options(cfg.pages[t.key] || '')}</select></td>
         <td><div class="btn-row"><a class="btn btn-sm" href="${esc(t.href)}?ui=modern" target="_blank" rel="noopener">New ↗</a><a class="btn btn-sm" href="${esc(t.href)}?ui=classic" target="_blank" rel="noopener">Classic ↗</a></div></td></tr>`).join('') : '';
    }).join('');
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">Reading interface</div>
        <div class="muted sm">How the Reading tests look. A student's own choice (Account → Interface) comes first, then the interface of the test, then this default. Full Mock papers always use the classic interface.</div></div>
        <div class="btn-row"><button class="btn btn-primary" data-rui-do="save" type="button" ${dirty() && !busy ? '' : 'disabled'}>Save</button></div></div>
      <div class="rui-looks" role="radiogroup" aria-label="Default interface">${LOOKS.map(([v, l, help]) => `<button class="rui-look${cfg.default === v ? ' on' : ''}" type="button" role="radio" aria-checked="${cfg.default === v}" data-rui-default="${v}">
        <img src="/assets/reading-ui-${v}.svg" alt="" width="320" height="200"><strong>${l} interface${cfg.default === v ? ' <span class="chip chip-ok">Default</span>' : ''}</strong><span class="muted sm">${help}</span></button>`).join('')}</div>
      <div class="cb-checks"><label><input type="checkbox" data-rui-choice ${cfg.choice ? 'checked' : ''}> Students may choose their own interface in <b>Account → Interface</b></label></div></div>
      <div class="card"><div class="section-head"><div><div class="section-title">Built-in tests</div><div class="muted sm">Tests made in this panel have their own <b>Interface</b> field: in the form and on the cards of <a href="#reading">Reading · Part</a> and <a href="#readingfull">Reading · Full</a>.</div></div></div>
        <div class="toolbar"><input class="field grow" type="search" placeholder="Search a test" data-rui-search value="${esc(query)}" autocomplete="off">
          <select class="field" data-rui-all style="width:auto" aria-label="Set every built-in test"><option value="-">Set all of them…</option><option value="">Default</option>${LOOKS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
        ${rows ? `<div class="table-wrap"><table class="table"><thead><tr><th>Test</th><th>Interface</th><th>Preview</th></tr></thead><tbody>${rows}</tbody></table></div>` : '<div class="empty">No tests found.</div>'}</div>`;
  }
  function refreshSave() { const b = $('[data-rui-do="save"]'); if (b) b.disabled = !dirty() || busy; }
  async function load() {
    loading = true; render();
    try {
      const [a, view] = await Promise.all([api('/api/admin/reading-ui'), api('/api/admin/access').catch(() => ({ skills: [] }))]);
      cfg = { default: a.config.default, choice: a.config.choice, pages: a.config.pages || {} }; saved = plain();
      const sk = (view.skills || []).find((x) => x.skill === 'reading') || { packs: [] }; const seen = new Set();
      groups = sk.packs.map((p) => ({ title: p.practice ? 'Reading practice passages' : p.title, tests: p.tests.filter((t) => !t.material && switchable(t.href)).map((t) => ({ key: keyOf(t.href), href: t.href, title: t.title, source: t.source || '' }))
        .filter((t) => { if (seen.has(t.key)) return false; seen.add(t.key); return true; }) })).filter((g) => g.tests.length);
      render();
    } catch (e) { fail(e); const m = $('#content-readingui'); if (m) m.innerHTML = '<div class="empty">Could not load. Press Refresh.</div>'; }
    finally { loading = false; }
  }
  async function save() {
    if (busy || !cfg) return; busy = true; refreshSave();
    try {
      const c = (await api('/api/admin/reading-ui', { method: 'POST', body: plain() })).config;
      cfg = { default: c.default, choice: c.choice, pages: c.pages || {} }; saved = plain();
      toast('Saved — the Reading tests open in the ' + lookName(cfg.default).toLowerCase() + ' interface by default');
    } catch (e) { fail(e); } finally { busy = false; render(); }
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-rui-default],[data-rui-do]'); if (!t || !cfg) return;
    if (t.dataset.ruiDo === 'save') return save();
    cfg.default = t.dataset.ruiDefault; render();
  });
  document.addEventListener('change', (e) => {
    const el = e.target; if (!el.matches || !cfg) return;
    if (el.matches('[data-rui-choice]')) { cfg.choice = el.checked; refreshSave(); }
    else if (el.matches('[data-rui-page]')) { if (el.value) cfg.pages[el.dataset.ruiPage] = el.value; else delete cfg.pages[el.dataset.ruiPage]; refreshSave(); }
    else if (el.matches('[data-rui-all]') && el.value !== '-') {
      groups.forEach((g) => g.tests.forEach((t) => { if (el.value) cfg.pages[t.key] = el.value; else delete cfg.pages[t.key]; }));
      render(); toast('Set for every built-in test — press Save');
    }
  });
  document.addEventListener('input', (e) => {
    if (!e.target.matches || !e.target.matches('[data-rui-search]') || !cfg) return;
    query = e.target.value; const at = e.target.selectionStart; render();
    const el = $('[data-rui-search]'); if (el) { el.focus(); try { el.setSelectionRange(at, at); } catch (x) { /* a search field may refuse */ } }
  });
  window.addEventListener('beforeunload', (e) => { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });
  const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'readingui' && !cfg && !loading) load(); };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('DOMContentLoaded', () => { render(); onHash(); const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if ($('#view-readingui.active')) { cfg = null; load(); } }); });
})();
