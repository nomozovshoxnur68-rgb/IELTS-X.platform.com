/*
 * IELTSX admin: Price control (admin.html#pricing).
 * Everything the Price page shows comes from here: which plans are on sale, the durations, the price of each
 * plan for each duration, the old (crossed-out) price, how many premium tests a plan includes, the feature
 * list, the Telegram contact for payments. The server stores it (Settings: pricing-config) and /api/plans serves it.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  let cfg = null, loading = false, dirty = false, usage = {};

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3200); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const fmt = (n) => (n ? new Intl.NumberFormat('en-US').format(n) : '');
  const num = (v) => { const n = Math.round(Number(String(v).replace(/[^\d.]/g, ''))); return Number.isFinite(n) && n > 0 ? n : 0; };
  const monthWord = (m) => m + (m === 1 ? ' month' : ' months');

  function planCard(p) {
    const rows = cfg.months.map((m) => {
      const price = p.prices[m] || 0, old = p.oldPrices[m] || 0;
      const off = old && price && old > price ? Math.round((1 - price / old) * 100) : 0;
      return `<tr><td class="nowrap"><strong>${monthWord(m)}</strong></td>
        <td><input class="field" inputmode="numeric" data-price="${p.id}:${m}" value="${fmt(price)}" placeholder="not sold"></td>
        <td><input class="field" inputmode="numeric" data-old="${p.id}:${m}" value="${fmt(old)}" placeholder="optional"></td>
        <td class="muted sm nowrap" data-off="${p.id}:${m}">${off ? '−' + off + '%' : ''}</td></tr>`;
    }).join('');
    return `<div class="card" data-plan="${p.id}">
      <div class="section-head"><div><div class="section-title">${esc(p.name)}</div><div class="muted sm">Members of this plan unlock the tests locked to “${esc(p.name)}” in Access.</div></div>
        <label class="sm" style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" data-f="active" ${p.active ? 'checked' : ''}> On sale on the Price page</label></div>
      <div class="table-wrap"><table class="table"><thead><tr><th>Duration</th><th>Price (${esc(cfg.currency)})</th><th>Old price (crossed out)</th><th>Discount</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="muted sm" style="margin:6px 0 0">Leave a price empty and that duration is not sold for this plan.</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:6px">
        <div><label class="lbl">Tests included</label><input class="field" inputmode="numeric" data-f="testsLimit" value="${p.testsLimit || ''}" placeholder="0 = no limit">
          <div class="muted sm" style="margin-top:4px">How many different locked tests a member can open per purchase. 0 or empty = unlimited. Buying again adds the same number on top.</div></div>
        <div><label class="lbl">Small label on the card</label><input class="field" data-f="tag" maxlength="40" value="${esc(p.tag)}" placeholder="e.g. Best for 1 month"></div>
        <div><label class="lbl">Badge</label><label class="sm" style="display:flex;gap:8px;align-items:center;margin-top:9px;cursor:pointer"><input type="checkbox" data-f="recommended" ${p.recommended ? 'checked' : ''}> Show “Recommended”</label></div>
      </div>
      <label class="lbl">What the plan includes (one line = one point on the card)</label>
      <textarea class="field" data-f="features" rows="8">${esc(p.features.join('\n'))}</textarea>
    </div>`;
  }

  /* ── promo codes: typed by the student when ordering; the one marked "Strip" is shown at the top of the pages ── */
  const PLAN_IDS = [['standard', 'Standard'], ['max', 'Max'], ['ultra', 'Ultra']];
  const PROMO_RE = /^[A-Z0-9][A-Z0-9_-]{2,23}$/;
  const pad2 = (n) => String(n).padStart(2, '0');
  const localInput = (iso) => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? '' : `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
  function promoState(p) {
    if (!p.active) return '<span class="badge">Off</span>';
    if (p.endsAt && new Date(p.endsAt).getTime() <= Date.now()) return '<span class="badge badge-bad">Ended</span>';
    return '<span class="badge badge-ok">Working</span>';
  }
  function promoRow(p, i) {
    const u = usage[p.code];
    return `<tr data-promo="${i}">
      <td><input class="field" data-p="code" value="${esc(p.code)}" maxlength="24" placeholder="MAY10" style="text-transform:uppercase;font-family:ui-monospace,Menlo,Consolas,monospace;min-width:110px"></td>
      <td class="nowrap"><input class="field" data-p="percent" inputmode="numeric" value="${esc(p.percent)}" style="width:64px;display:inline-block"> %</td>
      <td><input class="field" type="datetime-local" data-p="endsAt" value="${esc(p.endsAt ? localInput(p.endsAt) : '')}"><div class="muted sm">empty = no end</div></td>
      <td class="nowrap">${PLAN_IDS.map(([id, name]) => `<label class="sm" style="display:inline-flex;gap:4px;align-items:center;margin-right:8px;cursor:pointer"><input type="checkbox" data-pp="${id}" ${p.plans.includes(id) ? 'checked' : ''}>${name}</label>`).join('')}<div class="muted sm">none ticked = every plan</div></td>
      <td><label class="sm" style="display:flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" data-p="active" ${p.active ? 'checked' : ''}>On</label><div style="margin-top:4px">${promoState(p)}</div></td>
      <td><label class="sm" style="display:flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" data-p="banner" ${p.banner ? 'checked' : ''}>Show</label></td>
      <td class="nowrap sm">${u ? `<b>${u.paid}</b> paid<div class="muted">${u.all} orders</div>` : '<span class="muted">—</span>'}</td>
      <td><button class="btn btn-sm btn-danger" type="button" data-promo-del="${i}">Remove</button></td></tr>`;
  }
  function promoCard() {
    const list = cfg.promos || [];
    return `<div class="card" id="pc-promos">
      <div class="section-head"><div><div class="section-title">Promo codes</div><div class="muted sm">The student types the code in the order window of the Price page and the order is made with the discount (the server checks the code). The code with “Strip: Show” appears in the purple strip at the top of the pages, with a countdown if it has an end date. No working code in the strip = no strip.</div></div>
        <button class="btn btn-sm" type="button" id="pc-promo-add">+ Add code</button></div>
      ${list.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Code</th><th>Discount</th><th>Ends</th><th>Plans</th><th>Active</th><th>Strip</th><th>Used</th><th></th></tr></thead><tbody>${list.map(promoRow).join('')}</tbody></table></div>`
        : '<div class="empty">No promo codes yet. The promo strip is hidden.</div>'}
    </div>`;
  }
  function readPromos(strict) {
    const list = $$('[data-promo]').map((tr) => {
      const v = (k) => tr.querySelector(`[data-p="${k}"]`);
      const code = v('code').value.trim().toUpperCase().replace(/\s+/g, ''), percent = Math.floor(Number(v('percent').value));
      const end = v('endsAt').value ? new Date(v('endsAt').value) : null;
      return { code, percent, active: v('active').checked, banner: v('banner').checked, endsAt: end && !Number.isNaN(end.getTime()) ? end.toISOString() : '',
        plans: PLAN_IDS.map(([id]) => id).filter((id) => tr.querySelector(`[data-pp="${id}"]`).checked) };
    });
    if (strict) {
      const seen = new Set();
      list.forEach((p) => {
        if (!PROMO_RE.test(p.code)) throw new Error(`Promo code “${p.code || '(empty)'}”: 3–24 letters or digits (also - and _), no spaces.`);
        if (!(p.percent >= 1 && p.percent <= 90)) throw new Error(`Promo code ${p.code}: the discount must be 1–90 %.`);
        if (seen.has(p.code)) throw new Error(`Promo code ${p.code} is in the list twice.`);
        seen.add(p.code);
      });
    }
    return list;
  }
  async function loadUsage() {   // how many orders used each code (the Orders list of the panel)
    try {
      const { orders } = await api('/api/admin/orders');
      usage = {};
      (orders || []).forEach((o) => { if (!o.promoCode) return; const u = usage[o.promoCode] || (usage[o.promoCode] = { all: 0, paid: 0 }); u.all++; if (o.status === 'paid') u.paid++; });
      if (cfg && !dirty) render();
    } catch (e) { /* the counts are only a help */ }
  }

  function render() {
    const mount = $('#content-pricing'); if (!mount) return;
    if (!cfg) { mount.innerHTML = '<div class="empty">Loading…</div>'; return; }
    mount.innerHTML = `
      <div class="card">
        <div class="section-head"><div><div class="section-title">Price control</div><div class="muted sm">Change prices, durations, test counts and the Telegram contact. Press “Save” and the Price page updates for everybody.</div></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-sm" href="/Price" target="_blank" rel="noopener">Open Price page ↗</a><button class="btn btn-sm" type="button" id="pc-reset">Reset to defaults</button><button class="btn btn-primary btn-sm" type="button" id="pc-save">Save changes</button></div></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
          <div><label class="lbl">Durations (months, comma separated)</label><input class="field" id="pc-months" value="${esc(cfg.months.join(', '))}" placeholder="1, 3, 6">
            <div class="muted sm" style="margin-top:4px">Up to 6 values from 1 to 36, e.g. 1, 3, 6, 12. After changing, press “Apply durations”.</div>
            <button class="btn btn-sm" type="button" id="pc-apply" style="margin-top:6px">Apply durations</button></div>
          <div><label class="lbl">Admin Telegram (payments are sent here)</label><input class="field" id="pc-contact" value="${esc(cfg.contact.replace('https://t.me/', '@'))}" placeholder="@sh7595"></div>
          <div><label class="lbl">1 USD = ? ${esc(cfg.currency)} (optional)</label><input class="field" id="pc-usd" inputmode="numeric" value="${fmt(cfg.usdRate)}" placeholder="0 = hide USD button">
            <div class="muted sm" style="margin-top:4px">If set, the Price page gets a USD / UZS switch.</div></div>
        </div>
        <label class="lbl">Payment instructions shown after the student creates an order</label>
        <textarea class="field" id="pc-instr" rows="2" maxlength="500">${esc(cfg.instructions)}</textarea>
      </div>
      ${promoCard()}
      ${cfg.plans.map(planCard).join('')}
      <div class="muted sm">Plan names stay Standard / Max / Ultra because the site decides access by them. Orders already created keep the price they were made with.</div>`;
  }

  function collect() {
    const months = [...new Set($('#pc-months').value.split(/[^\d]+/).map(Number).filter((n) => n >= 1 && n <= 36))].sort((a, b) => a - b).slice(0, 6);
    if (!months.length) throw new Error('Enter at least one duration, e.g. 1, 3, 6.');
    const contact = $('#pc-contact').value.trim();
    if (!/^(?:https?:\/\/)?(?:t\.me\/|telegram\.me\/)?@?[A-Za-z0-9_]{4,32}\/?$/.test(contact)) throw new Error('The Telegram contact looks wrong. Use something like @sh7595.');
    const plans = $$('[data-plan]').map((card) => {
      const id = card.dataset.plan, prices = {}, oldPrices = {};
      months.forEach((m) => {
        const a = card.querySelector(`[data-price="${id}:${m}"]`), b = card.querySelector(`[data-old="${id}:${m}"]`);
        if (a && num(a.value)) prices[m] = num(a.value);
        if (b && num(b.value)) oldPrices[m] = num(b.value);
      });
      const f = (k) => card.querySelector(`[data-f="${k}"]`);
      return { id, active: f('active').checked, recommended: f('recommended').checked, tag: f('tag').value, testsLimit: num(f('testsLimit').value), prices, oldPrices,
        features: f('features').value.split('\n').map((x) => x.trim()).filter(Boolean) };
    });
    plans.forEach((p) => { if (p.active && !Object.keys(p.prices).length) throw new Error('Plan ' + p.id + ' is on sale but has no price. Add a price or switch it off.'); });
    return { months, contact, usdRate: num($('#pc-usd').value), instructions: $('#pc-instr').value, plans, promos: readPromos(true) };
  }
  function editPromos(change) {   // add / remove a row, keeping everything typed so far
    const promos = readPromos(false); change(promos);
    cfg = { ...cfg, promos }; dirty = true; render();
  }

  async function save() {
    const b = $('#pc-save'); let body;
    try { body = collect(); } catch (e) { return fail(e); }
    b.disabled = true;
    try { cfg = (await api('/api/admin/pricing', { method: 'POST', body: JSON.stringify({ pricing: body }) })).pricing; dirty = false; render(); toast('Saved. The Price page is updated.'); }
    catch (e) { fail(e); } finally { b.disabled = false; }
  }

  function applyMonths() {      // keep what was typed, rebuild the price rows for the new durations
    try { const b = collect(); cfg = { ...cfg, ...b, currency: cfg.currency, plans: b.plans.map((p, i) => ({ ...cfg.plans[i], ...p })) }; render(); toast('Durations applied. Fill in the prices and press Save.'); }
    catch (e) { fail(e); }
  }

  async function load() {
    if (loading) return; loading = true;
    try { cfg = (await api('/api/admin/pricing')).pricing; render(); loadUsage(); } catch (e) { fail(e); const m = $('#content-pricing'); if (m) m.innerHTML = '<div class="empty">Could not load. Press Refresh.</div>'; }
    finally { loading = false; }
  }

  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('button'); if (!t || !$('#content-pricing') || !$('#content-pricing').contains(t)) return;
    if (t.id === 'pc-save') save();
    else if (t.id === 'pc-apply') applyMonths();
    else if (t.id === 'pc-promo-add') { editPromos((l) => l.push({ code: '', percent: 10, active: true, banner: !l.some((p) => p.banner), endsAt: '', plans: [] })); const rows = $$('[data-promo] [data-p="code"]'); if (rows.length) rows[rows.length - 1].focus(); }
    else if (t.dataset.promoDel !== undefined) { const i = Number(t.dataset.promoDel); editPromos((l) => l.splice(i, 1)); toast('Removed. Press “Save changes” to keep it.'); }
    else if (t.id === 'pc-reset' && confirm('Go back to the original prices, features and contact?')) {
      try { cfg = (await api('/api/admin/pricing', { method: 'POST', body: JSON.stringify({ reset: true }) })).pricing; render(); toast('Reset to defaults.'); } catch (x) { fail(x); }
    }
  });
  document.addEventListener('change', (e) => {     // one code in the strip: ticking one unticks the others
    const t = e.target; if (!t.matches || !t.matches('[data-promo] [data-p="banner"]') || !t.checked) return;
    $$('[data-promo] [data-p="banner"]').forEach((x) => { if (x !== t) x.checked = false; });
  });
  document.addEventListener('input', (e) => {      // live discount % next to the price fields
    const t = e.target;
    if (t.closest && t.closest('#content-pricing')) dirty = true;
    if (!t.dataset || !(t.dataset.price || t.dataset.old)) return;
    const key = t.dataset.price || t.dataset.old, card = t.closest('[data-plan]');
    const a = num(card.querySelector(`[data-price="${key}"]`).value), b = num(card.querySelector(`[data-old="${key}"]`).value);
    const out = card.querySelector(`[data-off="${key}"]`); if (out) out.textContent = a && b && b > a ? '−' + Math.round((1 - a / b) * 100) + '%' : '';
  });
  window.addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'pricing' && !cfg && !loading) load(); };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('DOMContentLoaded', () => { render(); onHash(); const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if ($('#view-pricing.active')) { dirty = false; load(); } }); });
})();
