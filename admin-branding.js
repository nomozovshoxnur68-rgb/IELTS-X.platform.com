/*
 * IELTSX admin: Logo (admin.html#branding).
 * Two pictures: the logo (wide, shown on the sign-in and legal pages) and the icon (square, shown in the sidebars,
 * in the header of every test and as the browser-tab icon). One of them is enough: it is used
 * for both. The server keeps them in Settings ("branding"); assets/js/branding.js puts them on every page.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  let cfg = null, saved = null, loading = false, busy = 0;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body && !(opt.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const dirty = () => !!cfg && !!saved && (cfg.logoUrl !== saved.logoUrl || cfg.iconUrl !== saved.iconUrl);

  const SLOTS = {
    logoUrl: { title: 'Logo', help: 'The wide logo: the top of the sign-in, password and legal pages. PNG with a transparent background works best (for example 600 × 160).' },
    iconUrl: { title: 'Icon', help: 'The square mark: the sidebar of every page and of this panel, the header of every test and the browser tab. Square PNG, at least 128 × 128.' }
  };
  function slot(key) {
    const s = SLOTS[key], url = cfg[key], other = cfg[key === 'logoUrl' ? 'iconUrl' : 'logoUrl'];
    const preview = url || other;
    return `<div class="card" data-slot="${key}">
      <div class="section-head"><div><div class="section-title">${s.title}</div><div class="muted sm">${s.help}</div></div>
        <div class="btn-row"><button class="btn btn-primary" data-br="upload" data-key="${key}" type="button" ${busy ? 'disabled' : ''}>⬆ ${url ? 'Replace' : 'Upload'}</button>${url ? `<button class="btn btn-danger" data-br="remove" data-key="${key}" type="button">Remove</button>` : ''}</div></div>
      <div class="br-preview${key === 'iconUrl' ? ' br-square' : ''}">${preview ? `<img src="${esc(preview)}" alt="">` : '<span class="muted sm">The built-in IELTSX logo is used.</span>'}</div>
      ${!url && other ? '<div class="muted sm">Not set: the other picture is used here.</div>' : ''}
      <label class="lbl">Or paste a link (https://…)<input class="field" data-br-url="${key}" value="${esc(url)}" placeholder="https://…/logo.png"></label>
      <div class="muted sm" data-br-status="${key}"></div></div>`;
  }
  function render() {
    const mount = $('#content-branding'); if (!mount) return;
    if (!cfg) { mount.innerHTML = '<div class="empty">Loading…</div>'; return; }
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">Logo</div>
        <div class="muted sm">Your logo replaces the IELTSX logo on every page of the website and in the tests. Upload one picture or both, then press Save. Visitors see it within a minute.</div></div>
        <div class="btn-row"><button class="btn" data-br="reset" type="button" ${cfg.logoUrl || cfg.iconUrl ? '' : 'disabled'}>Use the IELTSX logo</button><button class="btn btn-primary" data-br="save" type="button" ${dirty() && !busy ? '' : 'disabled'}>Save</button></div></div></div>
      <div class="br-grid">${slot('logoUrl')}${slot('iconUrl')}</div>`;
  }

  function pick() {
    return new Promise((resolve) => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp';
      inp.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'; document.body.appendChild(inp);
      const done = (f) => { try { inp.remove(); } catch (e) { /* gone */ } resolve(f); };
      inp.addEventListener('cancel', () => done(null));
      inp.onchange = () => done(inp.files && inp.files[0]);
      inp.click();
    });
  }
  async function upload(key) {
    const f = await pick(); if (!f) return;
    if (!/\.(png|jpe?g|webp)$/i.test(f.name)) return toast('Use a PNG, JPG or WebP picture.', true);
    if (f.size > 3 * 1024 * 1024) return toast('The picture is larger than 3 MB. Make it smaller and try again.', true);
    const st = $(`[data-br-status="${key}"]`); busy++; render(); const st2 = $(`[data-br-status="${key}"]`); if (st2) st2.textContent = 'Uploading ' + f.name + ' …';
    try {
      const fd = new FormData(); fd.append('type', 'image'); fd.append('file', f, f.name);
      cfg[key] = (await api('/api/admin/uploads', { method: 'POST', body: fd })).url;
      toast('Uploaded — press Save to put it on the website');
    } catch (e) { fail(e); } finally { busy--; render(); if (st) st.textContent = ''; }
  }
  async function save(next) {
    busy++; render();
    try { saved = (await api('/api/admin/branding', { method: 'POST', body: JSON.stringify(next || cfg) })).branding; cfg = { logoUrl: saved.logoUrl, iconUrl: saved.iconUrl };
      try { if (cfg.logoUrl || cfg.iconUrl) localStorage.setItem('ix-branding', JSON.stringify(cfg)); else localStorage.removeItem('ix-branding'); } catch (e) { /* blocked */ }
      if (window.IXBranding) window.IXBranding.apply(cfg);
      toast(cfg.logoUrl || cfg.iconUrl ? 'Saved — the website now shows your logo' : 'Saved — the IELTSX logo is back');
    } catch (e) { fail(e); } finally { busy--; render(); }
  }
  async function load() {
    loading = true; render();
    try { saved = (await api('/api/admin/branding')).branding; cfg = { logoUrl: saved.logoUrl, iconUrl: saved.iconUrl }; render(); }
    catch (e) { fail(e); const m = $('#content-branding'); if (m) m.innerHTML = '<div class="empty">Could not load. Press Refresh.</div>'; }
    finally { loading = false; }
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-br]'); if (!t || !cfg) return;
    const a = t.dataset.br, key = t.dataset.key;
    if (a === 'upload') upload(key);
    else if (a === 'remove') { cfg[key] = ''; render(); }
    else if (a === 'save') save();
    else if (a === 'reset') { if (confirm('Show the IELTSX logo again everywhere?')) save({ logoUrl: '', iconUrl: '' }); }
  });
  document.addEventListener('change', (e) => {
    const el = e.target.closest && e.target.closest('[data-br-url]'); if (!el || !cfg) return;
    const v = el.value.trim();
    if (v && !/^https:\/\/[^\s"'<>]+$/i.test(v) && !/^\/(uploads|assets|api\/media)\//.test(v)) { toast('The link must start with https://', true); el.value = cfg[el.dataset.brUrl]; return; }
    cfg[el.dataset.brUrl] = v; render();
  });
  window.addEventListener('beforeunload', (e) => { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });
  const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'branding' && !cfg && !loading) load(); };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('DOMContentLoaded', () => { render(); onHash(); const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if ($('#view-branding.active')) { cfg = null; load(); } }); });
})();
