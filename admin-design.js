/*
 * IELTSX admin: Design (admin.html#design).
 * What the visitors can choose on the Settings page of the website (/settings) and how the site looks for everybody:
 *  - who may use each design and animation: free, locked for a plan (Standard, Max, Ultra) or hidden — kept by the
 *    server (/api/design, /api/design/fx/, /api/account/design), not only by the page
 *  - the default design (Classic, Cosmic or a design added here) and the default animation (none, Snowfall, New Year lights)
 *  - the site colours of the Classic design (accent, sidebar, cards, page background; light and dark)
 *  - designs of your own: a background picture (or colour) for light and dark mode, an accent colour, twinkling stars
 *  - the accent colours offered in Settings
 * Kept like the logo: the server keeps it in Settings ("design", /api/admin/design), assets/js/site-design.js draws it on
 * the ordinary pages (never on a test or exam page). Pictures are uploaded with /api/admin/uploads like the logo; a
 * picture is sent as it is when it fits, otherwise made smaller with a good resampling (see prepare()).
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const HEX = /^#[0-9a-f]{6}$/i;
  const DEFAULT_ACCENTS = [{ name: 'Blue', color: '#2563eb' }, { name: 'Violet', color: '#7c3aed' }, { name: 'Emerald', color: '#059669' }, { name: 'Rose', color: '#e11d48' }, { name: 'Amber', color: '#d97706' }, { name: 'Teal', color: '#0d9488' }];
  let cfg = null, saved = '', loading = false, busy = 0;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body && !(opt.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const plain = (d) => JSON.stringify({ default: d.default, defaultEffect: d.defaultEffect, builtins: d.builtins, colors: d.colors, themes: d.themes, accents: d.accents });
  const dirty = () => !!cfg && plain(cfg) !== saved;
  const newId = () => 't-' + Math.random().toString(36).slice(2, 10).replace(/[^a-z0-9]/g, '').padEnd(6, '0');
  const BUILTINS = [['cosmic', 'Cosmic', 'design', 'The space background: a ringed planet by day, the Earth at night.'],
    ['snow', 'Snowfall', 'effect', 'New Year animation: gentle snow over the page.'], ['garland', 'New Year lights', 'effect', 'New Year animation: twinkling lights along the top.']];
  function fromServer(d) {
    const b = d.builtins || {};
    return { default: d.default || 'classic', defaultEffect: d.defaultEffect || '',
      builtins: Object.fromEntries(BUILTINS.map(([id]) => [id, { access: (b[id] && b[id].access) || 'free', plan: (b[id] && b[id].plan) || 'standard' }])),
      colors: { ...(d.colors || {}) }, themes: (d.themes || []).map((t) => ({ ...t, access: t.access || 'free', plan: t.plan || 'standard' })), accents: (d.accents || DEFAULT_ACCENTS).map((a) => ({ ...a })) };
  }

  /* ───────── who may use a design or an animation: free / locked for a plan / hidden (the server keeps to it) ───────── */
  const ACCESS_OPTS = [['free', 'Free — everybody'], ['standard', 'Locked — Standard and higher'], ['max', 'Locked — Max and higher'], ['ultra', 'Locked — Ultra only'], ['hidden', 'Hidden — nobody (admins can try it)']];
  const accessOf = (r) => (r.access === 'locked' ? r.plan || 'standard' : r.access || 'free');
  const accessBadge = (r) => { const a = accessOf(r); return a === 'free' ? '<span class="ds-badge free">Free</span>' : a === 'hidden' ? '<span class="ds-badge hidden">Hidden</span>' : `<span class="ds-badge locked">🔒 ${esc(a.charAt(0).toUpperCase() + a.slice(1))}</span>`; };
  const accessSelect = (r, attrs) => `<select class="field ds-access" ${attrs} aria-label="Who may use it">${ACCESS_OPTS.map(([v, l]) => `<option value="${v}" ${accessOf(r) === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  function setAccess(r, v) { if (v === 'free' || v === 'hidden') { r.access = v; } else { r.access = 'locked'; r.plan = v; } }
  function accessRows() {
    const row = (name, kind, about, r, attrs) => `<div class="ds-ax-row"><div class="ds-ax-name"><strong>${esc(name)}</strong> <span class="muted sm">${esc(kind)}</span>${about ? `<span class="muted sm">${esc(about)}</span>` : ''}</div>${accessBadge(r)}${accessSelect(r, attrs)}</div>`;
    return `<div class="ds-ax-row"><div class="ds-ax-name"><strong>Classic</strong> <span class="muted sm">design</span><span class="muted sm">The plain site. Always free: it is what everybody else falls back to.</span></div><span class="ds-badge free">Free</span><span></span></div>` +
      BUILTINS.map(([id, name, kind, about]) => row(name, kind === 'effect' ? 'animation' : 'design', about, cfg.builtins[id], `data-ds-access="${id}"`)).join('') +
      cfg.themes.map((t) => row(t.name || 'Custom design', 'your design', '', t, `data-ds-access="${esc(t.id)}" data-tid="${esc(t.id)}"`)).join('');
  }
  function defaultWarn() {
    const d = cfg.default === 'cosmic' ? cfg.builtins.cosmic : cfg.themes.find((t) => t.id === cfg.default);
    const e = cfg.defaultEffect ? cfg.builtins[cfg.defaultEffect] : null;
    const w = [];
    if (d && d.access === 'locked') w.push('The default design is locked: visitors without that plan get Classic.');
    if (d && d.access === 'hidden') w.push('The default design is hidden: everybody gets Classic.');
    if (e && e.access === 'locked') w.push('The default animation is locked: visitors without that plan get none.');
    if (e && e.access === 'hidden') w.push('The default animation is hidden: nobody gets it.');
    return w.length ? `<div class="ds-warn">${w.map(esc).join('<br>')}</div>` : '';
  }

  /* ───────── site colours ───────── */
  const COLORS = [
    ['accent', 'Accent', 'Buttons, links, highlights and the loading bar, in every design (unless a design or the visitor picks another).', '#2563eb'],
    ['sidebarLight', 'Sidebar · light mode', 'The menu on the left.', '#fafafa'], ['sidebarDark', 'Sidebar · dark mode', '', '#1c1c1c'],
    ['cardLight', 'Cards · light mode', 'Test cards, panels and menus.', '#ffffff'], ['cardDark', 'Cards · dark mode', '', '#292929'],
    ['bgLight', 'Page background · light mode', 'Behind the cards.', '#ffffff'], ['bgDark', 'Page background · dark mode', '', '#212121']
  ];
  /* one colour: a site colour (tid empty) or a colour of one of your designs */
  function colorRow(key, label, help, def, value, tid) {
    const v = HEX.test(value || '') ? value : '', own = tid ? `data-ds-tc="${key}" data-tid="${esc(tid)}"` : `data-ds-color="${key}"`;
    return `<div class="ds-color">
      <input type="color" ${own} value="${esc(v || def)}" aria-label="${esc(label)}">
      <div class="ds-color-txt"><strong>${esc(label)}</strong>${help ? `<span class="muted sm">${esc(help)}</span>` : ''}</div>
      <code class="ds-hex">${v ? esc(v) : 'default'}</code>
      <button class="btn btn-sm" type="button" data-ds="clear-color" data-key="${key}" ${tid ? `data-tid="${esc(tid)}"` : ''} ${v ? '' : 'disabled'}>Default</button></div>`;
  }
  function sitePreview() {
    const c = cfg.colors, pane = (dark) => {
      const side = c[dark ? 'sidebarDark' : 'sidebarLight'] || (dark ? '#1c1c1c' : '#fafafa'), card = c[dark ? 'cardDark' : 'cardLight'] || (dark ? '#292929' : '#ffffff');
      const bg = c[dark ? 'bgDark' : 'bgLight'] || (dark ? '#212121' : '#ffffff'), acc = c.accent || (dark ? '#4b8df8' : '#2563eb');
      return `<div class="ds-pv" style="--pv-side:${side};--pv-card:${card};--pv-bg:${bg};--pv-acc:${acc};--pv-line:${dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.09)'}"><i class="pv-side"></i><i class="pv-card"><b></b></i><i class="pv-card"><b></b></i><span>${dark ? 'Dark' : 'Light'}</span></div>`;
    };
    return `<div class="ds-pv-row">${pane(false)}${pane(true)}</div>`;
  }

  /* ───────── own designs ───────── */
  function picSlot(t, key, label) {
    const url = t[key];
    return `<div class="ds-pic"><div class="ds-pic-box">${url ? `<img src="${esc(url)}" alt="">` : '<span class="muted sm">No picture</span>'}</div>
      <div class="ds-pic-act"><strong class="sm">${label}</strong>
        <div class="btn-row"><button class="btn btn-sm" type="button" data-ds="upload" data-tid="${t.id}" data-key="${key}" ${busy ? 'disabled' : ''}>⬆ ${url ? 'Replace' : 'Upload'}</button>${url ? `<button class="btn btn-sm btn-danger" type="button" data-ds="remove-pic" data-tid="${t.id}" data-key="${key}">Remove</button>` : ''}</div>
        <input class="field" data-ds-url="${key}" data-tid="${t.id}" value="${esc(url)}" placeholder="or a link: https://…/background.jpg"></div></div>`;
  }
  function themeCard(t, i) {
    const thumb = (dark) => {
      const img = dark ? t.bgDark || t.bgLight : t.bgLight || t.bgDark, col = (dark ? t.colorDark : t.colorLight) || (dark ? '#0d1018' : '#eef1f8');
      return `<div class="ds-thumb${dark ? ' dark' : ''}" style="background-color:${esc(col)};${img ? `background-image:url(&quot;${esc(img)}&quot;)` : ''}"><i style="background:${dark ? `rgba(0,0,0,${(t.veil || 0) / 100})` : `rgba(255,255,255,${(t.veil || 0) / 100})`}"></i><b style="--acc:${esc(t.accent || '#2563eb')}"></b><span>${dark ? 'Dark' : 'Light'}</span></div>`;
    };
    return `<div class="ds-theme card" data-theme-card="${t.id}">
      <div class="ds-theme-top"><div class="ds-thumbs">${thumb(false)}${thumb(true)}</div>
        <div class="ds-theme-main">
          <label class="lbl">Name<input class="field" data-ds-tf="name" data-tid="${t.id}" value="${esc(t.name)}" maxlength="40" placeholder="Ocean, Sunset…"></label>
          <div class="ds-inline">
            <label class="lbl ds-inline-lbl">Who may use it ${accessSelect(t, `data-ds-access="${esc(t.id)}" data-tid="${esc(t.id)}"`)}</label>
            <label class="ds-check"><input type="checkbox" data-ds-tb="stars" data-tid="${t.id}" ${t.stars ? 'checked' : ''}> Twinkling stars</label>
          </div>
          <div class="btn-row"><button class="btn btn-sm" type="button" data-ds="move" data-dir="-1" data-tid="${t.id}" ${i ? '' : 'disabled'}>↑</button><button class="btn btn-sm" type="button" data-ds="move" data-dir="1" data-tid="${t.id}" ${i < cfg.themes.length - 1 ? '' : 'disabled'}>↓</button><button class="btn btn-sm btn-danger" type="button" data-ds="delete-theme" data-tid="${t.id}">Delete</button></div>
        </div></div>
      <div class="ds-pics">${picSlot(t, 'bgLight', 'Background · light mode')}${picSlot(t, 'bgDark', 'Background · dark mode (optional: the light one is used)')}</div>
      <div class="ds-colors ds-colors-3">
        ${colorRow('accent', 'Accent colour', '', '#2563eb', t.accent, t.id)}
        ${colorRow('colorLight', 'Background colour · light', 'Without a picture, or around it.', '#eef1f8', t.colorLight, t.id)}
        ${colorRow('colorDark', 'Background colour · dark', '', '#0d1018', t.colorDark, t.id)}
      </div>
      <label class="lbl">Veil over the picture: <span data-veil-out="${t.id}">${t.veil || 0}%</span> <span class="muted sm">(a white haze in light mode, a dark one in dark mode. 0% shows the picture exactly as uploaded; the cards already keep the text readable)</span>
        <input type="range" min="0" max="80" step="5" data-ds-veil data-tid="${t.id}" value="${t.veil || 0}"></label>
    </div>`;
  }

  function render() {
    const mount = $('#content-design'); if (!mount) return;
    if (!cfg) { mount.innerHTML = '<div class="empty">Loading…</div>'; return; }
    const tag = (r) => (r.access === 'hidden' ? ' — hidden' : r.access === 'locked' ? ' — 🔒 ' + (r.plan || 'standard') : '');
    const opts = [['classic', 'Classic (the plain site)'], ['cosmic', 'Cosmic (space)' + tag(cfg.builtins.cosmic)], ...cfg.themes.map((t) => [t.id, (t.name || 'Custom design') + tag(t)])];
    const fxOpts = [['', 'None'], ['snow', 'Snowfall' + tag(cfg.builtins.snow)], ['garland', 'New Year lights' + tag(cfg.builtins.garland)]];
    mount.innerHTML = `
      <div class="card"><div class="section-head"><div><div class="section-title">Design</div>
        <div class="muted sm">How the website looks. Every visitor can pick a design, an animation and an accent colour on the <a href="/settings" target="_blank" rel="noopener">Settings</a> page; what you set here is what they can choose from. Tests and exams always keep their plain look. Visitors see a change within a few minutes.</div></div>
        <div class="btn-row"><a class="btn" href="/settings" target="_blank" rel="noopener">Open Settings ↗</a><button class="btn btn-primary" data-ds="save" type="button" ${dirty() && !busy ? '' : 'disabled'}>Save</button></div></div>
        <div class="ds-grid2">
          <label class="lbl">Default design (for visitors who have not chosen one)
            <select class="field" data-ds-default>${opts.map(([v, l]) => `<option value="${esc(v)}" ${cfg.default === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
          <label class="lbl">Default animation (for visitors who have not chosen one)
            <select class="field" data-ds-default-fx>${fxOpts.map(([v, l]) => `<option value="${esc(v)}" ${cfg.defaultEffect === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
        </div>${defaultWarn()}</div>

      <div class="card"><div class="section-head"><div><div class="section-title">Who may use each design and animation</div>
        <div class="muted sm"><b>Free</b>: everybody. <b>Locked</b>: only members of that plan (or a higher one); the others see it in Settings with a lock and a link to the Price page. <b>Hidden</b>: not offered at all (you, as an admin, still see it in Settings to try it). The server keeps to this: a locked design is sent without its pictures, and the code of Cosmic and of the animations is not sent to anyone who may not use them.</div></div></div>
        <div class="ds-ax-list">${accessRows()}</div></div>

      <div class="card"><div class="section-head"><div><div class="section-title">Site colours</div>
        <div class="muted sm">The colours of the Classic design. Leave one on "default" to keep the IELTS-X colour. The accent is used by every design.</div></div></div>
        ${sitePreview()}
        <div class="ds-colors">${COLORS.map(([k, l, h, d]) => colorRow(k, l, h, d, cfg.colors[k], '')).join('')}</div></div>

      <div class="card"><div class="section-head"><div><div class="section-title">Your designs</div>
        <div class="muted sm">Each one appears in Settings with its own picture: a background picture (or colour) for light and dark mode, an accent colour and, if you like, twinkling stars. Wide pictures work best: 2560 × 1440 or 3840 × 2160 (4K) stays sharp on large and high-resolution screens. A picture under 2.8 MB is uploaded exactly as it is; a bigger one is made smaller with a high-quality resize (at most 3840 px, WebP quality 92 %).</div></div>
        <div class="btn-row"><button class="btn btn-primary" type="button" data-ds="add-theme" ${cfg.themes.length >= 20 ? 'disabled' : ''}>+ Add a design</button></div></div>
        ${cfg.themes.length ? cfg.themes.map(themeCard).join('') : '<div class="empty">No designs of your own yet. Press "Add a design".</div>'}</div>

      <div class="card"><div class="section-head"><div><div class="section-title">Accent colours in Settings</div>
        <div class="muted sm">The colours a visitor can pick for buttons and links. Up to 24.</div></div>
        <div class="btn-row"><button class="btn" type="button" data-ds="reset-accents">Standard colours</button></div></div>
        <div class="ds-accents">${cfg.accents.map((a, i) => `<div class="ds-acc"><input type="color" data-ds-acc="color" data-i="${i}" value="${esc(a.color)}" aria-label="Colour"><input class="field" data-ds-acc="name" data-i="${i}" value="${esc(a.name)}" maxlength="24" aria-label="Name"><button class="btn btn-sm btn-danger" type="button" data-ds="del-accent" data-i="${i}" aria-label="Remove ${esc(a.name)}">✕</button></div>`).join('')}
          <button class="btn ds-acc-add" type="button" data-ds="add-accent" ${cfg.accents.length >= 24 ? 'disabled' : ''}>+ Add a colour</button></div></div>`;
  }
  function syncSave() { const b = $('[data-ds="save"]'); if (b) b.disabled = !dirty() || !!busy; }
  const theme = (id) => cfg.themes.find((t) => t.id === id);

  /* ───────── pictures (the same upload as the logo) ───────── */
  function pick() {
    return new Promise((resolve) => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.png,.jpg,.jpeg,.webp,.avif,image/png,image/jpeg,image/webp,image/avif';
      inp.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'; document.body.appendChild(inp);
      const done = (f) => { try { inp.remove(); } catch (e) { /* gone */ } resolve(f); };
      inp.addEventListener('cancel', () => done(null));
      inp.onchange = () => done(inp.files && inp.files[0]);
      inp.click();
    });
  }
  /* A background picture has to stay sharp on a large or high-resolution screen (a 1440p screen at 2× shows 5120 px).
     The first version made every picture over 1.2 MB at most 2400 px wide in one step (the browser's quick, blurry
     resampling) and saved it again as WebP at quality 86 → 64: that was the blur. Now:
       - a picture that fits (≤ 2.8 MB, at most 4096 px, not AVIF) is uploaded exactly as it is, byte for byte;
       - a bigger one is made smaller only as much as needed (3840 px, then 3200, then 2560), halving in steps with
         high-quality smoothing (sharp, no moiré), and saved as WebP at quality 92 → 88 → 84 (JPEG where the browser
         cannot write WebP), the first that is under 2.8 MB (the server on Vercel takes up to 3 MB). */
  const KEEP_BYTES = 2.8 * 1024 * 1024, KEEP_SIDE = 4096;
  async function openImage(f) {
    if (window.createImageBitmap) { try { return await createImageBitmap(f); } catch (e) { /* try the <img> way */ } }
    const url = URL.createObjectURL(f);
    try { return await new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = () => rej(new Error('This picture could not be opened.')); i.src = url; }); }
    finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
  }
  function resample(img, W, H) {
    let src = img, w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    while (w / 2 >= W && h / 2 >= H) {   // halve while it stays above the size wanted: every step averages 2×2 pixels
      const c = document.createElement('canvas'); c.width = Math.round(w / 2); c.height = Math.round(h / 2);
      const x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, c.width, c.height);
      src = c; w = c.width; h = c.height;
    }
    const out = document.createElement('canvas'); out.width = W; out.height = H;
    const x = out.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, W, H);
    return out;
  }
  const encode = (c, type, q) => new Promise((res) => c.toBlob(res, type, q));
  async function prepare(f) {
    const avif = /\.avif$/i.test(f.name) || f.type === 'image/avif';
    if (f.size <= KEEP_BYTES && !avif) {
      const img = await openImage(f).catch(() => null);
      const side = img ? Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height) : 0;
      if (img && img.close) img.close();
      if (!img || side <= KEEP_SIDE) return f;    // sent as it is: no quality lost at all
    }
    const img = await openImage(f);
    const w0 = img.naturalWidth || img.width, h0 = img.naturalHeight || img.height;
    if (!w0 || !h0) throw new Error('This picture could not be read.');
    for (const side of [3840, 3200, 2560]) {
      const k = Math.min(1, side / Math.max(w0, h0)), c = resample(img, Math.round(w0 * k), Math.round(h0 * k));
      for (const q of [0.92, 0.88, 0.84]) {
        let blob = await encode(c, 'image/webp', q);
        if (!blob || blob.type !== 'image/webp') blob = await encode(c, 'image/jpeg', q);   // Safari writes PNG when asked for WebP
        if (blob && blob.size <= KEEP_BYTES) {
          if (img.close) img.close();
          const ext = blob.type === 'image/webp' ? '.webp' : '.jpg';
          return new File([blob], f.name.replace(/\.\w+$/, '') + ext, { type: blob.type });
        }
      }
    }
    if (img.close) img.close();
    throw new Error('This picture is too large even at 2560 px. Use a JPG or WebP under 2.8 MB.');
  }
  async function upload(tid, key) {
    let f = await pick(); if (!f) return;
    if (!/\.(png|jpe?g|webp|avif)$/i.test(f.name)) return toast('Use a JPG, PNG or WebP picture.', true);
    const orig = f;
    toast('Preparing ' + f.name + ' …');
    try { f = await prepare(f); } catch (e) { return fail(e); }
    if (f.size > 3 * 1024 * 1024) return toast('The picture is larger than 3 MB. Make it smaller and try again.', true);
    busy++; render(); toast(f === orig ? 'Uploading ' + f.name + ' as it is (full quality) …' : 'Uploading ' + f.name + ' (' + (f.size / 1048576).toFixed(1) + ' MB, high quality) …');
    try {
      const fd = new FormData(); fd.append('type', 'image'); fd.append('file', f, f.name);
      const t = theme(tid); if (t) t[key] = (await api('/api/admin/uploads', { method: 'POST', body: fd })).url;
      toast('Uploaded — press Save to put it on the website');
    } catch (e) { fail(e); } finally { busy--; render(); }
  }

  async function save() {
    busy++; syncSave();
    try {
      const d = (await api('/api/admin/design', { method: 'POST', body: JSON.stringify(cfg) })).design;
      cfg = fromServer(d); saved = plain(cfg);
      // the list the website keeps in this browser: the one the server makes for this account (what this admin may see)
      api('/api/design').then((v) => { try { localStorage.setItem('ix-design-site', JSON.stringify({ ...v, t: Date.now() })); } catch (e) { /* blocked */ } }).catch(() => {
        try { localStorage.removeItem('ix-design-site'); } catch (e) { /* blocked */ }
      });
      toast('Saved — the website shows the new design settings');
    } catch (e) { fail(e); } finally { busy--; render(); }
  }
  async function load() {
    loading = true; render();
    try { const d = (await api('/api/admin/design')).design; cfg = fromServer(d); saved = plain(cfg); render(); }
    catch (e) { fail(e); const m = $('#content-design'); if (m) m.innerHTML = '<div class="empty">Could not load. Press Refresh.</div>'; }
    finally { loading = false; }
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-ds]'); if (!t || !cfg || !t.closest('#content-design')) return;
    const a = t.dataset.ds, tid = t.dataset.tid, th = tid && theme(tid);
    if (a === 'save') save();
    else if (a === 'clear-color') {
      if (th) th[t.dataset.key] = ''; else cfg.colors[t.dataset.key] = '';
      render(); syncSave();
    } else if (a === 'add-theme') {
      cfg.themes.push({ id: newId(), name: 'New design', bgLight: '', bgDark: '', colorLight: '', colorDark: '', accent: '', stars: false, veil: 0, access: 'hidden', plan: 'standard' });   // hidden until you have tried it
      render(); syncSave();
      const last = document.querySelector('[data-theme-card]:last-of-type input[data-ds-tf="name"]'); if (last) { last.focus(); last.select(); }
    } else if (a === 'delete-theme' && th) {
      if (!confirm('Delete the design "' + (th.name || 'Custom design') + '"? Visitors who chose it get the default design.')) return;
      cfg.themes = cfg.themes.filter((x) => x !== th); if (cfg.default === tid) cfg.default = 'classic'; render(); syncSave();
    } else if (a === 'move' && th) {
      const i = cfg.themes.indexOf(th), j = i + Number(t.dataset.dir); if (j < 0 || j >= cfg.themes.length) return;
      cfg.themes.splice(i, 1); cfg.themes.splice(j, 0, th); render(); syncSave();
    } else if (a === 'upload' && th) upload(tid, t.dataset.key);
    else if (a === 'remove-pic' && th) { th[t.dataset.key] = ''; render(); syncSave(); }
    else if (a === 'add-accent') { cfg.accents.push({ name: 'New colour', color: '#0ea5e9' }); render(); syncSave(); }
    else if (a === 'del-accent') { cfg.accents.splice(Number(t.dataset.i), 1); render(); syncSave(); }
    else if (a === 'reset-accents') { cfg.accents = DEFAULT_ACCENTS.map((x) => ({ ...x })); render(); syncSave(); }
  });
  // typing and dragging change the settings without drawing the panel again (the field keeps the focus)
  document.addEventListener('input', (e) => {
    const el = e.target; if (!cfg || !el.closest || !el.closest('#content-design')) return;
    const th = el.dataset.tid && theme(el.dataset.tid);
    if (el.hasAttribute('data-ds-color')) cfg.colors[el.dataset.dsColor] = el.value.toLowerCase();
    else if (el.dataset.dsTc && th) th[el.dataset.dsTc] = el.value.toLowerCase();
    else if (el.dataset.dsTf && th) th[el.dataset.dsTf] = el.value;
    else if (el.hasAttribute('data-ds-veil') && th) { th.veil = Number(el.value); const o = $(`[data-veil-out="${th.id}"]`); if (o) o.textContent = th.veil + '%'; }
    else if (el.dataset.dsAcc) { const acc = cfg.accents[Number(el.dataset.i)]; if (acc) acc[el.dataset.dsAcc] = el.dataset.dsAcc === 'color' ? el.value.toLowerCase() : el.value; }
    else return;
    if (el.type === 'color') { const hex = el.closest('.ds-color') && el.closest('.ds-color').querySelector('.ds-hex'); if (hex) hex.textContent = el.value.toLowerCase(); }
    syncSave();
  });
  document.addEventListener('change', (e) => {
    const el = e.target; if (!cfg || !el.closest || !el.closest('#content-design')) return;
    const th = el.dataset.tid && theme(el.dataset.tid);
    if (el.hasAttribute('data-ds-default')) cfg.default = el.value;
    else if (el.hasAttribute('data-ds-default-fx')) cfg.defaultEffect = el.value;
    else if (el.dataset.dsAccess) { const r = cfg.builtins[el.dataset.dsAccess] || th; if (!r) return; setAccess(r, el.value); }
    else if (el.dataset.dsTb && th) th[el.dataset.dsTb] = el.checked;
    else if (el.dataset.dsUrl && th) {
      const v = el.value.trim();
      if (v && !/^https:\/\/[^\s"'<>()\\]+$/i.test(v) && !/^\/(uploads|assets|api\/media)\//.test(v)) { toast('The link must start with https://', true); el.value = th[el.dataset.dsUrl] || ''; return; }
      th[el.dataset.dsUrl] = v;
    } else if (el.type !== 'color' && !el.hasAttribute('data-ds-veil') && !el.dataset.dsTf) return;
    render(); syncSave();   // the pictures, the previews and the "Default" buttons follow
  });
  window.addEventListener('beforeunload', (e) => { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });
  const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'design' && !cfg && !loading) load(); };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('DOMContentLoaded', () => { render(); onHash(); const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if ($('#view-design.active')) { if (dirty() && !confirm('Drop the changes that are not saved?')) return; cfg = null; load(); } }); });
})();
