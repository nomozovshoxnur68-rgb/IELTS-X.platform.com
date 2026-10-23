/*
 * IELTSX admin: Access (admin.html#access) — lock / unlock every pack and every test, and choose the plan.
 *
 *   Free      -> everybody can open it (even without an account)
 *   Standard  -> Standard and Max members
 *   Max       -> Max members only
 *   Default   -> whatever assets/js/full-tests-data.js says (for a test inside a pack: the pack's setting first)
 *
 * A setting on a pack is inherited by its tests; a setting on a single test wins over the pack.
 * The server checks it (test pages, the API and the Full Tests cards), this panel only stores the choice.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const LABEL = { free: 'Demo (Free)', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  const SKILL_ORDER = ['reading', 'listening', 'writing', 'speaking'];

  let data = null;                 // { skills: [...] } from /api/admin/access
  let skill = 'reading';
  let query = '';
  let loading = false;
  const openPacks = new Set();

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2200); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);

  const statusOf = (rule) => (rule.locked ? rule.plan : 'free');
  const chip = (rule) => `<span class="chip ${rule.locked ? 'chip-premium' : 'chip-ok'}" style="cursor:default">${rule.locked ? '🔒 ' + LABEL[rule.plan] : '🔓 Demo (Free)'}</span>`;
  function modeSelect(attrs, mode, defaultLabel) {
    const opt = (v, t) => `<option value="${v}" ${mode === v ? 'selected' : ''}>${t}</option>`;
    return `<select class="field" style="width:auto;min-width:150px;padding:6px 8px" ${attrs}>
      ${opt('default', 'Default · ' + esc(defaultLabel))}${opt('free', '🔓 Demo (Free)')}${opt('standard', '🔒 Standard')}${opt('max', '🔒 Max')}${opt('ultra', '🔒 Ultra')}</select>`;
  }
  // what a pack / test becomes when its own setting is removed
  const packDefault = (pk) => LABEL[statusOf(pk.def)];
  const testDefault = (pk, t) => LABEL[statusOf(pk.rule.mode !== 'default' ? pk.rule : t.def)];

  function match(pk, t) {
    if (!query) return true;
    const hay = [pk.title, t ? t.title : '', t ? t.source : '', t ? t.href : ''].join(' ').toLowerCase();
    return hay.includes(query);
  }

  function packHtml(pk) {
    const tests = pk.tests.filter((t) => match(pk, t));
    if (query && !tests.length && !pk.title.toLowerCase().includes(query)) return '';
    const shown = query ? tests : pk.tests;
    const open = openPacks.has(pk.key) || !!query;
    const rows = shown.map((t) => `<tr>
        <td><strong>${esc(t.title)}</strong><div class="muted sm">${esc(t.source || '')}${t.material ? ' · made in admin' + (t.published === false ? ' · Draft' : '') : ''}</div></td>
        <td class="muted sm" style="word-break:break-all">${esc(t.href)}</td>
        <td>${chip(t.rule)}${t.rule.mode !== 'default' ? ' <span class="muted sm">custom</span>' : ''}</td>
        <td>${modeSelect(`data-ac="test" data-key="${esc(t.key)}"`, t.rule.mode, testDefault(pk, t))}</td></tr>`).join('');
    return `<details class="card" data-pack="${esc(pk.key)}" ${open ? 'open' : ''} style="margin-bottom:12px">
      <summary style="cursor:pointer;display:flex;flex-wrap:wrap;gap:10px;align-items:center;list-style:none">
        <strong style="font-size:15px">${esc(pk.title)}</strong>
        ${pk.tier ? `<span class="muted sm">${esc(pk.tier)}</span>` : ''}
        ${chip(pk.rule)}${pk.rule.mode !== 'default' ? '<span class="muted sm">custom</span>' : ''}
        <span class="muted sm">${pk.tests.length} test${pk.tests.length === 1 ? '' : 's'}${pk.extra ? ' · made in admin' : ''}</span>
        <span style="flex:1"></span><span class="muted sm">▾</span>
      </summary>
      <div class="toolbar" style="margin:12px 0">
        <label class="muted sm" style="display:flex;align-items:center;gap:8px">Pack ${modeSelect(`data-ac="pack" data-key="${esc(pk.key)}"`, pk.rule.mode, packDefault(pk))}</label>
        <label class="muted sm" style="display:flex;align-items:center;gap:8px">All tests in this pack
          <select class="field" style="width:auto;min-width:150px;padding:6px 8px" data-ac="pack-tests" data-key="${esc(pk.key)}">
            <option value="">Choose…</option><option value="default">Default (inherit pack)</option><option value="free">🔓 Demo (Free)</option><option value="standard">🔒 Standard</option><option value="max">🔒 Max</option><option value="ultra">🔒 Ultra</option></select></label>
      </div>
      ${pk.tests.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Test</th><th>Link</th><th>Now</th><th>Setting</th></tr></thead><tbody>${rows || '<tr><td colspan="4" class="muted">No test matches.</td></tr>'}</tbody></table></div>` : '<div class="muted sm">No tests in this pack yet.</div>'}
    </details>`;
  }

  function render() {
    const mount = $('#content-access'); if (!mount) return;
    if (!data) { mount.innerHTML = `<div class="card"><div class="empty">${loading ? 'Loading…' : 'Could not load.'}</div></div>`; return; }
    const sk = data.skills.find((s) => s.skill === skill) || data.skills[0];
    const tabs = SKILL_ORDER.map((k) => { const s = data.skills.find((x) => x.skill === k); if (!s) return ''; const n = s.packs.reduce((a, p) => a + p.tests.length, 0);
      return `<button class="tab ${k === skill ? 'active' : ''}" data-ac="tab" data-skill="${k}" type="button">${esc(k.charAt(0).toUpperCase() + k.slice(1))}<span class="n">${s.packs.length} / ${n}</span></button>`; }).join('');
    const locked = sk.packs.filter((p) => p.rule.locked).length;
    mount.innerHTML = `
      <div class="card">
        <div class="section-head"><div>
          <div class="section-title">Access: free / locked, by plan</div>
          <div class="muted sm">Choose for every pack and every test who can open it. A locked card shows “Get Access” and sends the student to the Price page. A test setting wins over its pack; “Default” follows the pack (or the catalog).</div></div></div>
        <div class="tabs">${tabs}</div>
        <div class="toolbar">
          <input id="ac-search" class="field grow" type="search" placeholder="Search a pack or a test" value="${esc(query)}" autocomplete="off">
          <select id="ac-bulk" class="field" aria-label="Set everything in this skill"><option value="">Set EVERYTHING in ${esc(sk.title)} to…</option><option value="free">🔓 Demo (Free)</option><option value="standard">🔒 Standard</option><option value="max">🔒 Max</option><option value="ultra">🔒 Ultra</option><option value="default">Default (reset)</option></select>
          <button class="btn btn-sm" id="ac-expand" type="button">Expand / collapse all</button>
        </div>
        <div class="muted sm" style="margin-bottom:12px">${sk.packs.length} packs · ${locked} locked · ${sk.packs.length - locked} free</div>
        ${sk.packs.map(packHtml).join('') || '<div class="empty">No packs.</div>'}
      </div>`;
  }

  async function load() {
    loading = true; render();
    try { data = await api('/api/admin/access'); } catch (e) { fail(e); }
    loading = false; render();
  }
  async function save(changes, msg) {
    if (!changes.length) return;
    try { data = await api('/api/admin/access', { method: 'POST', body: JSON.stringify({ changes }) }); toast(msg || 'Saved'); }
    catch (e) { fail(e); }
    render();
  }

  function currentSkill() { return data && data.skills.find((s) => s.skill === skill); }

  async function onChange(e) {
    const t = e.target; const kind = t.dataset && t.dataset.ac; if (!kind) return;
    if (kind === 'test' || kind === 'pack') return save([{ key: t.dataset.key, mode: t.value }], 'Saved');
    if (kind === 'pack-tests') {
      const mode = t.value; if (!mode) return;
      const pk = currentSkill().packs.find((p) => p.key === t.dataset.key); if (!pk || !pk.tests.length) { t.value = ''; return toast('This pack has no tests yet.', true); }
      return save(pk.tests.map((x) => ({ key: x.key, mode })), pk.tests.length + ' tests updated');
    }
    if (t.id === 'ac-bulk') {
      const mode = t.value; if (!mode) return;
      const sk = currentSkill();
      const changes = [];
      sk.packs.forEach((p) => { changes.push({ key: p.key, mode }); p.tests.forEach((x) => changes.push({ key: x.key, mode })); });
      const label = mode === 'default' ? 'reset to default' : 'set to ' + LABEL[mode];
      if (!confirm(`Every pack and test in ${sk.title} will be ${label}. Continue?`)) { t.value = ''; return; }
      return save(changes, 'Everything in ' + sk.title + ' ' + label);
    }
  }
  function onClick(e) {
    const tab = e.target.closest('[data-ac="tab"]');
    if (tab) { skill = tab.dataset.skill; render(); return; }
    if (e.target.closest('#ac-expand')) {
      const sk = currentSkill(); if (!sk) return;
      const allOpen = sk.packs.every((p) => openPacks.has(p.key));
      sk.packs.forEach((p) => (allOpen ? openPacks.delete(p.key) : openPacks.add(p.key)));
      render();
    }
  }
  function onToggle(e) {
    const d = e.target; if (!d.matches || !d.matches('details[data-pack]')) return;
    if (d.open) openPacks.add(d.dataset.pack); else openPacks.delete(d.dataset.pack);
  }

  window.addEventListener('DOMContentLoaded', () => {
    const mount = $('#content-access'); if (!mount) return;
    render();
    document.addEventListener('change', onChange);
    document.addEventListener('click', onClick);
    mount.addEventListener('toggle', onToggle, true);
    let timer;
    document.addEventListener('input', (e) => { if (e.target.id !== 'ac-search') return; clearTimeout(timer); const v = e.target.value; timer = setTimeout(() => { query = v.trim().toLowerCase(); render(); const i = $('#ac-search'); if (i) { i.focus(); i.setSelectionRange(v.length, v.length); } }, 150); });
    const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'access' && !data && !loading) load(); };
    window.addEventListener('hashchange', onHash); onHash();
    const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if (data) load(); });
  });
})();
