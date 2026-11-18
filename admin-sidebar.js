/*
 * IELTSX admin: Sidebar (admin.html#sidebar) — the menu on the left of every page of the website.
 *   - groups: rename, add, remove, order
 *   - items: rename, change the icon, move to another group, order, add a new item (any page of the site or an https link),
 *     remove an item you added, and for every item: who sees it (everybody, signed-in, guests, paid plans, admins, nobody)
 *     and whether it is free or locked for a plan (Standard / Max / Ultra)
 *   - a live preview shows the menu the way a guest, a Free student, a paid student or an admin sees it
 * The server (sidebar.js) checks everything; the pages draw the saved menu with assets/js/sidebar-links.js.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const ICONS = () => (window.IELTSXLinks && window.IELTSXLinks.icons) || {};
  const icon = (name, size) => `<svg viewBox="0 0 24 24" width="${size || 16}" height="${size || 16}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS()[name] || ICONS().link || ''}</svg>`;
  const CROWN = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>';
  const VISIBLE = { all: 'Everybody', 'signed-in': 'Signed-in students', guests: 'Guests only (not signed in)', paid: 'Paid plans only', admins: 'Admins only', hidden: 'Nobody (hidden)' };
  const ACCESS = { default: 'As the page is', free: 'Free', locked: 'Locked' };
  const PLANS = { standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  const LEVEL = { standard: 1, max: 2, ultra: 3 };
  const VIEWERS = { guest: 'a guest', free: 'a Free student', standard: 'a Standard student', max: 'a Max student', ultra: 'an Ultra student', admin: 'an admin' };

  let data = null, builtin = [], icons = [], badges = [], original = '', busy = false, loading = false, viewer = 'free', error = '';

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const dirty = () => !!data && JSON.stringify({ g: data.groups, i: data.items }) !== original;
  const isBuiltin = (key) => builtin.some((b) => b.key === key);
  const newId = (p) => p + '-' + Array.from(crypto.getRandomValues(new Uint8Array(4))).map((b) => b.toString(16).padStart(2, '0')).join('');

  /* what one kind of visitor sees (the same rules as sidebar.js forViewer) */
  function seen(it, v) {
    const signedIn = v !== 'guest', admin = v === 'admin', level = { guest: 0, free: 0, standard: 1, max: 2, ultra: 3, admin: 3 }[v];
    const ok = it.visible === 'all' || (it.visible === 'signed-in' && signedIn) || (it.visible === 'guests' && !signedIn) || (it.visible === 'paid' && (level >= 1 || admin)) || (it.visible === 'admins' && admin);
    return ok ? { locked: it.access === 'locked' && !admin && level < (LEVEL[it.plan] || 2) } : null;
  }

  /* ───────── drawing ───────── */
  function render() {
    const mount = $('#content-sidebar'); if (!mount) return;
    if (!data) { mount.innerHTML = `<div class="card"><div class="empty">${error ? 'Could not load: ' + esc(error) + '<br><button class="btn" data-sb="reload" type="button" style="margin-top:10px">Try again</button>' : 'Loading…'}</div></div>`; return; }
    const opt = (map, v) => Object.entries(map).map(([k, n]) => `<option value="${esc(k)}" ${v === k ? 'selected' : ''}>${esc(n)}</option>`).join('');
    const gOpts = (v) => data.groups.map((g) => `<option value="${esc(g.id)}" ${v === g.id ? 'selected' : ''}>${esc(g.title)}</option>`).join('');
    const hiddenN = data.items.filter((i) => i.visible === 'hidden').length, lockedN = data.items.filter((i) => i.access === 'locked').length, customN = data.items.filter((i) => !isBuiltin(i.key)).length;
    const groupsHtml = data.groups.map((g, gi) => {
      const items = data.items.map((it, n) => ({ it, n })).filter((x) => x.it.group === g.id);
      return `<div class="sbm-group" data-g="${esc(g.id)}">
        <div class="sbm-ghead">
          <input class="field sbm-gtitle" data-gf="title" data-g="${esc(g.id)}" value="${esc(g.title)}" maxlength="40" aria-label="Group name">
          <span class="muted sm">${items.length} item${items.length === 1 ? '' : 's'}</span>
          <div class="btn-row">
            <button class="btn btn-sm btn-icon" data-sb="gup" data-g="${esc(g.id)}" type="button" title="Move the group up" ${gi === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn btn-sm btn-icon" data-sb="gdown" data-g="${esc(g.id)}" type="button" title="Move the group down" ${gi === data.groups.length - 1 ? 'disabled' : ''}>↓</button>
            <button class="btn btn-sm" data-sb="add" data-g="${esc(g.id)}" type="button">+ Item</button>
            <button class="btn btn-sm btn-danger btn-icon" data-sb="gdel" data-g="${esc(g.id)}" type="button" title="Remove the group" ${data.groups.length < 2 ? 'disabled' : ''}>✕</button>
          </div>
        </div>
        <div class="sbm-items">${items.map(({ it, n }, k) => itemHtml(it, n, k, items.length, opt, gOpts)).join('') || '<div class="empty sm">No items. Press “+ Item” or move one here.</div>'}</div>
      </div>`;
    }).join('');
    mount.innerHTML = `
      <div class="card sbm-head">
        <div class="section-head" style="margin:0">
          <div><div class="section-title">Website menu (sidebar)</div>
            <div class="muted sm">The menu on the left of every page. Add a new item, remove one, rename, reorder, choose who sees it and whether it is <b>Free</b> or <b>Locked</b> for a plan. A locked item sends students without the plan to the Price page — also when they open the page directly.</div></div>
          <div class="btn-row">
            <a class="btn" href="/dashboard" target="_blank" rel="noopener">Open website ↗</a>
            <button class="btn" data-sb="reset" type="button" ${busy ? 'disabled' : ''}>Reset to default</button>
            <button class="btn" data-sb="gadd" type="button">+ New group</button>
            <button class="btn btn-primary" data-sb="save" type="button" ${busy || !dirty() ? 'disabled' : ''}>${busy ? 'Saving…' : dirty() ? 'Save changes' : 'Saved'}</button>
          </div>
        </div>
        <div class="sbm-sum"><span class="badge">${data.items.length} items</span><span class="badge">${data.groups.length} groups</span>${customN ? `<span class="badge badge-info">${customN} added by you</span>` : ''}${lockedN ? `<span class="badge badge-premium">🔒 ${lockedN} locked</span>` : ''}${hiddenN ? `<span class="badge">${hiddenN} hidden</span>` : ''}${data.updatedAt ? `<span class="muted sm">Saved ${esc(new Date(data.updatedAt).toLocaleString())}</span>` : '<span class="muted sm">Not changed yet: the pages show their own menu.</span>'}</div>
      </div>
      <div class="sbm-layout">
        <div class="sbm-editor">${groupsHtml}</div>
        <aside class="card sbm-preview">
          <div class="section-title" style="font-size:14px">Preview</div>
          <label class="lbl sm">As <select class="field" data-sb-viewer>${opt(VIEWERS, viewer)}</select></label>
          <div class="sbm-pv">${previewHtml()}</div>
          <div class="muted sm" style="margin-top:10px">🔒 = this person sees the item with a crown; clicking it opens the Price page.</div>
        </aside>
      </div>`;
  }
  function itemHtml(it, n, k, count, opt, gOpts) {
    const custom = !isBuiltin(it.key);
    return `<div class="sbm-item${it.visible === 'hidden' ? ' is-hidden' : ''}${it.access === 'locked' ? ' is-locked' : ''}" data-n="${n}">
      <div class="sbm-row">
        <span class="sbm-ico">${icon(it.icon, 18)}</span>
        <input class="field sbm-label" data-f="label" value="${esc(it.label)}" maxlength="40" aria-label="Name">
        <select class="field sbm-iconsel" data-f="icon" aria-label="Icon">${icons.map((i) => `<option value="${esc(i)}" ${it.icon === i ? 'selected' : ''}>${esc(i)}</option>`).join('')}</select>
        <div class="btn-row sbm-act">
          <button class="btn btn-sm btn-icon" data-sb="up" data-n="${n}" type="button" title="Move up" ${k === 0 ? 'disabled' : ''}>↑</button>
          <button class="btn btn-sm btn-icon" data-sb="down" data-n="${n}" type="button" title="Move down" ${k === count - 1 ? 'disabled' : ''}>↓</button>
          <button class="btn btn-sm" data-sb="toggle" data-n="${n}" type="button" title="${it.visible === 'hidden' ? 'Show it to everybody' : 'Hide it from everybody'}">${it.visible === 'hidden' ? 'Show' : 'Hide'}</button>
          ${custom ? `<button class="btn btn-sm btn-danger btn-icon" data-sb="del" data-n="${n}" type="button" title="Remove this item">✕</button>` : ''}
        </div>
      </div>
      <div class="sbm-row sbm-opts">
        ${custom ? `<input class="field sbm-href" data-f="href" value="${esc(it.href)}" placeholder="/page-of-the-site or https://…" aria-label="Link">
          <label class="sbm-check"><input type="checkbox" data-f="newTab" ${it.newTab ? 'checked' : ''}> New tab</label>`
          : `<span class="muted sm sbm-path" title="Built-in page">${esc(it.href)}</span>`}
        <label class="sbm-mini">Group<select class="field" data-f="group">${gOpts(it.group)}</select></label>
        <label class="sbm-mini">Who sees it<select class="field" data-f="visible">${opt(VISIBLE, it.visible)}</select></label>
        <label class="sbm-mini">Access<select class="field" data-f="access">${opt(ACCESS, it.access)}</select></label>
        ${it.access === 'locked' ? `<label class="sbm-mini">Plan needed<select class="field" data-f="plan">${opt(PLANS, it.plan)}</select></label>` : ''}
        <label class="sbm-mini">Badge<select class="field" data-f="badge">${opt(Object.fromEntries([['', 'None'], ...badges.map((b) => [b, b.toUpperCase()])]), it.badge || '')}</select></label>
      </div>
    </div>`;
  }
  function previewHtml() {
    const parts = data.groups.map((g) => {
      const rows = data.items.filter((it) => it.group === g.id).map((it) => ({ it, s: seen(it, viewer) })).filter((x) => x.s);
      if (!rows.length) return '';
      return `<div class="sbm-pv-label">${esc(g.title)}</div>` + rows.map(({ it, s }) => `<div class="sbm-pv-item${s.locked ? ' locked' : ''}">${icon(it.icon, 15)}<span>${esc(it.label)}</span>${it.badge ? `<em class="sbm-pv-badge ${esc(it.badge)}">${esc(it.badge)}</em>` : ''}${s.locked ? CROWN : ''}</div>`).join('');
    }).join('');
    return parts || '<div class="muted sm">This person sees no menu items.</div>';
  }
  function repaintPreview() { const p = $('.sbm-pv'); if (p) p.innerHTML = previewHtml(); const s = $('[data-sb="save"]'); if (s) { s.disabled = busy || !dirty(); s.textContent = busy ? 'Saving…' : dirty() ? 'Save changes' : 'Saved'; } }

  /* ───────── load, save ───────── */
  async function load() {
    loading = true; error = '';
    try {
      const d = await api('/api/admin/sidebar');
      data = d.sidebar; builtin = d.builtin || []; icons = d.icons || []; badges = d.badges || [];
      original = JSON.stringify({ g: data.groups, i: data.items });
    } catch (e) { error = e.message; }
    finally { loading = false; render(); }
  }
  async function save() {
    const bad = data.items.find((i) => !isBuiltin(i.key) && (!i.label.trim() || !/^(\/(?!\/)|https:\/\/)/.test(i.href.trim())));
    if (bad) { toast(bad.label.trim() ? `"${bad.label}": the link must start with / (a page of this site) or https://` : 'A new item needs a name.', true); return; }
    busy = true; render();
    try {
      const d = await api('/api/admin/sidebar', { method: 'POST', body: JSON.stringify({ groups: data.groups, items: data.items }) });
      data = d.sidebar; original = JSON.stringify({ g: data.groups, i: data.items });
      try { localStorage.removeItem('ix-sidebar-cfg'); } catch (e) { /* blocked */ }
      toast('Saved — every page shows the new menu');
    } catch (e) { fail(e); }
    finally { busy = false; render(); }
  }

  /* ───────── events ───────── */
  const within = (el) => { const m = $('#content-sidebar'); return m && m.contains(el); };
  const moveIn = (n, dir) => {   // swap with the next / previous item of the same group
    const g = data.items[n].group; const idx = data.items.map((x, i) => (x.group === g ? i : -1)).filter((i) => i >= 0);
    const at = idx.indexOf(n), to = idx[at + dir]; if (to === undefined) return;
    [data.items[n], data.items[to]] = [data.items[to], data.items[n]];
  };
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-sb]'); if (!t || !within(t)) return;
    const a = t.dataset.sb, n = Number(t.dataset.n), gid = t.dataset.g;
    try {
      if (a === 'reload') { data = null; render(); return load(); }
      if (a === 'save') return save();
      if (a === 'reset') {
        if (!confirm('Put the menu back the way the pages have it? Your groups, new items, locks and hidden items are removed.')) return;
        busy = true; render();
        try { const d = await api('/api/admin/sidebar/reset', { method: 'POST' }); data = d.sidebar; original = JSON.stringify({ g: data.groups, i: data.items }); try { localStorage.removeItem('ix-sidebar-cfg'); } catch (er) { /* blocked */ } toast('The menu is back to the default'); }
        finally { busy = false; render(); }
        return;
      }
      if (a === 'gadd') { const title = prompt('Name of the new group (e.g. "Courses")', ''); if (!title || !title.trim()) return; data.groups.push({ id: newId('g'), title: title.trim().slice(0, 40) }); return render(); }
      if (a === 'gup' || a === 'gdown') { const i = data.groups.findIndex((g) => g.id === gid), j = i + (a === 'gup' ? -1 : 1); if (i < 0 || j < 0 || j >= data.groups.length) return; [data.groups[i], data.groups[j]] = [data.groups[j], data.groups[i]]; return render(); }
      if (a === 'gdel') {
        const g = data.groups.find((x) => x.id === gid); if (!g || data.groups.length < 2) return;
        const inside = data.items.filter((i) => i.group === gid);
        const to = data.groups.find((x) => x.id !== gid);
        if (!confirm(inside.length ? `Remove the group "${g.title}"? Its ${inside.length} item(s) move to "${to.title}".` : `Remove the group "${g.title}"?`)) return;
        inside.forEach((i) => { i.group = to.id; });
        data.groups = data.groups.filter((x) => x.id !== gid); return render();
      }
      if (a === 'add') {
        data.items.push({ key: newId('c'), label: 'New page', href: '/', icon: 'link', group: gid, visible: 'all', access: 'free', plan: 'max', newTab: false, badge: 'new' });
        render(); const rows = document.querySelectorAll(`.sbm-group[data-g="${gid}"] .sbm-item`); const last = rows[rows.length - 1];
        if (last) { last.scrollIntoView({ block: 'center', behavior: 'smooth' }); const f = last.querySelector('[data-f="label"]'); if (f) { f.focus(); f.select(); } }
        return;
      }
      if (a === 'up' || a === 'down') { moveIn(n, a === 'up' ? -1 : 1); return render(); }
      if (a === 'toggle') { const it = data.items[n]; it.visible = it.visible === 'hidden' ? 'all' : 'hidden'; return render(); }
      if (a === 'del') { const it = data.items[n]; if (!confirm(`Remove "${it.label}" from the menu?`)) return; data.items.splice(n, 1); return render(); }
    } catch (err) { fail(err); }
  });
  document.addEventListener('input', (e) => {
    const el = e.target; if (!within(el) || !data) return;
    if (el.dataset.gf) { const g = data.groups.find((x) => x.id === el.dataset.g); if (g) g.title = el.value; return repaintPreview(); }
    const row = el.closest('.sbm-item'); if (!row || !el.dataset.f || el.tagName === 'SELECT' || el.type === 'checkbox') return;
    const it = data.items[Number(row.dataset.n)]; if (!it) return;
    it[el.dataset.f] = el.value; repaintPreview();
  });
  document.addEventListener('change', (e) => {
    const el = e.target; if (!within(el) || !data) return;
    if (el.matches('[data-sb-viewer]')) { viewer = el.value; return repaintPreview(); }
    const row = el.closest('.sbm-item'); if (!row || !el.dataset.f) return;
    const it = data.items[Number(row.dataset.n)]; if (!it) return;
    if (el.type === 'checkbox') it[el.dataset.f] = el.checked; else it[el.dataset.f] = el.value;
    if (['group', 'access', 'visible', 'icon'].includes(el.dataset.f)) render(); else repaintPreview();
  });
  window.addEventListener('beforeunload', (e) => { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });

  const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'sidebar' && !data && !loading) load(); };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('DOMContentLoaded', () => {
    render(); onHash();
    const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if ($('#view-sidebar.active') && !dirty()) { data = null; render(); load(); } });
  });
})();
