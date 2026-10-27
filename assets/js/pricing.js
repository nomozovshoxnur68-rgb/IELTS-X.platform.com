/*
 * IELTS X — Price page (assets/js/pricing.js, used by Price.html; styles: assets/css/pricing.css).
 * Plans, durations, prices, test counts, features and the Telegram contact come from /api/plans, which the admin
 * panel (Price control) edits. Nothing about prices is written in the HTML any more.
 *
 * Buying: "Get <plan>" opens a small dialog (plan + duration) -> an order with a code is created -> the student pays
 * (Uzcard / Humo / ...) and sends the code to the admin on Telegram -> the admin confirms and the plan turns on.
 */
(function () {
  'use strict';
  var state = { data: null, user: undefined, months: 0, cur: 'UZS', status: null, notice: '' };

  function api(url, opt) {
    opt = opt || {};
    return fetch(url, { credentials: 'same-origin', cache: 'no-store', method: opt.method || 'GET',
      headers: opt.body ? { 'Content-Type': 'application/json' } : undefined, body: opt.body ? JSON.stringify(opt.body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || 'Something went wrong'); return d; }); });
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function $(s) { return document.querySelector(s); }
  function nf(n) { return new Intl.NumberFormat('en-US').format(n); }
  function money(n, cur, rate) {
    if (cur === 'USD' && rate > 0) { var u = n / rate; return '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: u < 100 ? 2 : 0, maximumFractionDigits: u < 100 ? 2 : 0 }).format(u); }
    return nf(Math.round(n)) + ' uzs';
  }
  function monthWord(m) { return m + (m === 1 ? ' month' : ' months'); }
  function handle(url) { return '@' + String(url || '').replace(/\/+$/, '').split('/').pop(); }
  function loadPlans() { return state.data ? Promise.resolve(state.data) : api('/api/plans').then(function (d) { state.data = d; return d; }); }
  function loadUser() { return state.user !== undefined ? Promise.resolve(state.user) : api('/api/auth/me').then(function (d) { state.user = d.user || null; return state.user; }).catch(function () { state.user = null; return null; }); }

  /* ---------- numbers shown on the cards ---------- */
  function priceOf(p, m) { return p.prices[String(m)] || 0; }
  function offOf(p, m) {       // % saved: against the old price set in the admin, otherwise against paying month by month
    var price = priceOf(p, m); if (!price) return 0;
    var old = (p.oldPrices || {})[String(m)] || 0;
    if (!old && m > 1) { var one = priceOf(p, 1); if (one) old = one * m; }
    return old > price ? Math.round((1 - price / old) * 100) : 0;
  }
  function oldOf(p, m) {
    var old = (p.oldPrices || {})[String(m)] || 0;
    if (!old && m > 1) { var one = priceOf(p, 1); if (one) old = one * m; }
    return old > priceOf(p, m) ? old : 0;
  }
  function sold(d, m) { return d.plans.filter(function (p) { return priceOf(p, m); }); }

  /* ---------- page ---------- */
  function render() {
    var d = state.data, mount = $('#ix-pricing'); if (!mount) return;
    mount.textContent = '';
    if (!d.plans.length) { mount.appendChild(el('div', 'ixp-fail', 'Plans are being updated. Please check back soon.')); return; }
    var months = d.months.filter(function (m) { return sold(d, m).length; });
    if (months.indexOf(state.months) < 0) state.months = months.indexOf(3) > -1 ? 3 : months[0];
    var m = state.months;

    if (state.notice) { var nb = el('div', 'ixp-bar', state.notice); nb.setAttribute('role', 'status'); mount.appendChild(nb); }
    if (state.status && state.status.premium && !state.status.admin) mount.appendChild(meStrip(state.status));

    var controls = el('div', 'ixp-controls');
    var seg = el('div', 'ixp-seg'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Duration');
    months.forEach(function (mm) {
      var b = el('button'); b.type = 'button'; b.setAttribute('aria-pressed', mm === m ? 'true' : 'false'); b.appendChild(el('span', null, mm === 1 ? 'Monthly' : monthWord(mm)));
      var best = 0; d.plans.forEach(function (p) { best = Math.max(best, offOf(p, mm)); });
      if (best) b.appendChild(el('span', 'ixp-off', '-' + best + '%'));
      b.onclick = function () { state.months = mm; render(); }; seg.appendChild(b);
    });
    controls.appendChild(seg);
    if (d.usdRate > 0) {
      var cs = el('div', 'ixp-seg'); cs.setAttribute('role', 'group'); cs.setAttribute('aria-label', 'Currency');
      [['UZS', '🇺🇿 UZS'], ['USD', '🌍 USD']].forEach(function (c) {
        var b = el('button', null, c[1]); b.type = 'button'; b.setAttribute('aria-pressed', state.cur === c[0] ? 'true' : 'false');
        b.onclick = function () { state.cur = c[0]; render(); }; cs.appendChild(b);
      });
      controls.appendChild(cs);
    }
    mount.appendChild(controls);

    var list = sold(d, m);
    var grid = el('div', 'ixp-grid n' + Math.min(list.length, 3));
    list.forEach(function (p) { grid.appendChild(card(p, m, d)); });
    mount.appendChild(grid);

    var note = el('div', 'ixp-note'); note.appendChild(el('span', null, '💬'));
    var t = el('p'); t.style.margin = '0';
    t.appendChild(el('strong', null, '🇺🇿 Uzcard / Humo: '));
    var a = el('a', null, handle(d.contact)); a.href = d.contact; a.target = '_blank'; a.rel = 'noopener noreferrer'; t.appendChild(a);
    t.appendChild(document.createTextNode(' — send your order code and the receipt, your plan turns on right after.'));
    note.appendChild(t); mount.appendChild(note);
    renderCompare(d);
  }

  function meStrip(s) {
    var box = el('div', 'ixp-me'); box.appendChild(el('span', null, 'Your plan:')); box.appendChild(el('b', null, s.plan || 'Premium'));
    if (s.expiresAt) { var left = Math.ceil((new Date(s.expiresAt) - Date.now()) / 86400000); box.appendChild(el('span', null, left > 0 ? left + (left === 1 ? ' day left' : ' days left') : 'ends today')); }
    if (s.quota) box.appendChild(el('span', null, 'Tests opened: ' + s.quota.used + ' / ' + s.quota.limit));
    return box;
  }

  function card(p, m, d) {
    var c = el('article', 'ixp-card' + (p.recommended ? ' rec' : ''));
    var pills = el('div', 'ixp-pills');
    if (p.tag) pills.appendChild(el('span', 'ixp-pill', p.tag));
    var off = offOf(p, m); if (off) pills.appendChild(el('span', 'ixp-pill hot', '🔥 ' + off + '% OFF'));
    c.appendChild(pills);
    var h = el('h3', 'ixp-name', p.name); if (p.recommended) { h.appendChild(document.createTextNode(' ')); h.appendChild(el('span', 'ixp-pill rec', 'Recommended')); } c.appendChild(h);
    var total = priceOf(p, m), per = total / m;
    var price = el('div', 'ixp-price'); price.appendChild(el('strong', null, money(per, state.cur, d.usdRate))); price.appendChild(el('span', null, '/ month')); c.appendChild(price);
    var sub = el('div', 'ixp-sub');
    if (m > 1) { sub.appendChild(document.createTextNode('billed once')); sub.appendChild(el('b', null, money(total, state.cur, d.usdRate))); }
    else sub.appendChild(document.createTextNode('billed once, no auto-renewal'));
    var old = oldOf(p, m); if (old) sub.appendChild(el('s', null, money(old, state.cur, d.usdRate)));
    c.appendChild(sub);
    c.appendChild(el('div', 'ixp-tests', p.testsLimit ? 'Includes ' + nf(p.testsLimit) + ' premium tests' : 'Unlimited premium tests'));
    var go = el('button', 'ixp-cta', 'Get ' + p.name + (off ? ' · save ' + off + '%' : '')); go.type = 'button'; go.onclick = function () { openDialog(p.id, m); }; c.appendChild(go);
    if (p.features.length) {
      c.appendChild(el('div', 'ixp-hr')); c.appendChild(el('p', 'ixp-inc', 'Everything included:'));
      var ul = el('ul', 'ixp-list'); p.features.forEach(function (f) { ul.appendChild(el('li', null, f)); }); c.appendChild(ul);
    }
    return c;
  }

  function renderCompare(d) {
    var mount = $('#ix-compare'); if (!mount) return; mount.textContent = '';
    var plans = d.plans; if (plans.length < 2) return;
    var feats = []; plans.forEach(function (p) { p.features.forEach(function (f) { if (feats.indexOf(f) < 0) feats.push(f); }); });
    mount.appendChild(el('h2', 'ixp-compare-h', 'Compare plans'));
    mount.appendChild(el('p', 'ixp-compare-p', 'Choose the plan that fits your preparation timeline'));
    var wrap = el('div', 'ixp-table-wrap'), t = el('table', 'ixp-table');
    var thead = el('thead'), hr = el('tr'); hr.appendChild(el('th', null, 'Features')); plans.forEach(function (p) { hr.appendChild(el('th', null, p.name)); }); thead.appendChild(hr); t.appendChild(thead);
    var tb = el('tbody');
    function row(label, cells) { var r = el('tr'); r.appendChild(el('td', null, label)); cells.forEach(function (c) { var td = el('td'); if (c === true) td.appendChild(el('span', 'ixp-yes', '✓')); else if (c === false) td.appendChild(el('span', 'ixp-no', '—')); else td.textContent = c; r.appendChild(td); }); tb.appendChild(r); }
    function group(label) { var r = el('tr', 'grp'), td = el('td', null, label); td.colSpan = plans.length + 1; r.appendChild(td); tb.appendChild(r); }
    group('Plan');
    row('Starting price', plans.map(function (p) { var best = 0; d.months.forEach(function (m) { var v = priceOf(p, m); if (v && (!best || v / m < best)) best = v / m; }); return best ? 'from ' + money(best, state.cur, d.usdRate) + ' / month' : '—'; }));
    row('Available durations', plans.map(function (p) { var ms = d.months.filter(function (m) { return priceOf(p, m); }); return ms.length ? ms.join(', ') + (ms[ms.length - 1] === 1 ? ' month' : ' months') : '—'; }));
    row('Premium tests included', plans.map(function (p) { return p.testsLimit ? nf(p.testsLimit) + ' tests' : 'Unlimited'; }));
    if (feats.length) { group('What you get'); feats.forEach(function (f) { row(f, plans.map(function (p) { return p.features.indexOf(f) > -1; })); }); }
    t.appendChild(tb); wrap.appendChild(t); mount.appendChild(wrap);
  }

  /* ---------- order dialog ---------- */
  function openDialog(planId, months) {
    var overlay = el('div', 'ixp-ov'), box = el('div', 'ixp-dlg');
    overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.appendChild(box); document.body.appendChild(overlay);
    var prevFocus = document.activeElement;
    function close() { overlay.remove(); document.removeEventListener('keydown', onKey); if (prevFocus && prevFocus.focus) prevFocus.focus(); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey); overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    box.textContent = 'Loading…';

    Promise.all([loadPlans(), loadUser()]).then(function (res) {
      var d = res[0], user = res[1];
      var plan = d.plans.filter(function (p) { return p.id === planId; })[0] || d.plans[0];
      var m = months || state.months;
      if (!priceOf(plan, m)) m = d.months.filter(function (x) { return priceOf(plan, x); })[0];

      function head(title, sub) {
        box.textContent = '';
        var x = el('button', 'ixp-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.onclick = close; box.appendChild(x);
        box.appendChild(el('h2', null, title)); if (sub) box.appendChild(el('p', null, sub));
      }
      function choose() {
        head('Choose your plan', 'One-time payment, no auto-renewal.');
        var plans = el('div', 'ixp-row');
        d.plans.forEach(function (p) {
          var ms = d.months.filter(function (x) { return priceOf(p, x); });
          var b = el('button', 'ixp-opt'); b.type = 'button'; b.setAttribute('aria-pressed', p.id === plan.id ? 'true' : 'false');
          b.appendChild(el('b', null, p.name)); b.appendChild(el('small', null, 'from ' + money(priceOf(p, ms[0]), d.currency) + ' / ' + monthWord(ms[0])));
          b.onclick = function () { plan = p; if (!priceOf(p, m)) m = ms[0]; choose(); }; plans.appendChild(b);
        });
        box.appendChild(plans);
        var durs = el('div', 'ixp-row cols');
        d.months.filter(function (x) { return priceOf(plan, x); }).forEach(function (x) {
          var b = el('button', 'ixp-opt'); b.type = 'button'; b.setAttribute('aria-pressed', x === m ? 'true' : 'false');
          b.appendChild(el('b', null, monthWord(x))); b.appendChild(el('small', null, money(priceOf(plan, x), d.currency)));
          b.onclick = function () { m = x; choose(); }; durs.appendChild(b);
        });
        box.appendChild(durs);
        var total = el('div', 'ixp-total'); total.appendChild(el('span', null, 'Total')); total.appendChild(el('span', null, money(priceOf(plan, m), d.currency))); box.appendChild(total);
        box.appendChild(el('p', 'ixp-facts', (plan.testsLimit ? nf(plan.testsLimit) + ' premium tests' : 'Unlimited premium tests') + ' · access for ' + monthWord(m)));
        var err = el('p', 'ixp-err'); err.setAttribute('role', 'alert'); box.appendChild(err);
        var go = el('button', 'ixp-btn', user ? 'Continue' : 'Sign in to continue'); go.type = 'button';
        go.onclick = function () {
          if (!user) { location.href = '/login?next=' + encodeURIComponent(location.pathname); return; }
          go.disabled = true; err.textContent = '';
          api('/api/orders', { method: 'POST', body: { plan: plan.id, months: m } }).then(function (r) { showOrder(r.order, r.payment, user); })
            .catch(function (e) { err.textContent = e.message; go.disabled = false; });
        };
        box.appendChild(go); go.focus();
      }
      function showOrder(order, payment, who) {
        head('Your order', order.planName + ' · ' + monthWord(order.months) + ' · ' + money(order.amount, order.currency));
        box.appendChild(el('div', 'ixp-code', order.ref));
        box.appendChild(el('p', null, payment.instructions));
        var text = 'IELTSX order ' + order.ref + ' - ' + order.planName + ' ' + order.months + 'm - ' + who.email;
        var tg = el('a', 'ixp-btn', 'Message ' + handle(payment.contact) + ' on Telegram'); tg.href = payment.contact + '?text=' + encodeURIComponent(text); tg.target = '_blank'; tg.rel = 'noopener noreferrer'; box.appendChild(tg);
        var copy = el('button', 'ixp-btn alt', 'Copy order code'); copy.type = 'button';
        copy.onclick = function () { (navigator.clipboard ? navigator.clipboard.writeText(order.ref) : Promise.reject()).then(function () { copy.textContent = 'Copied'; }, function () { copy.textContent = order.ref; }); };
        box.appendChild(copy);
        var acc = el('a', 'ixp-btn alt', 'See my orders'); acc.href = '/account#subscription'; box.appendChild(acc);
      }
      choose();
    }).catch(function (e) { box.textContent = e.message || 'Could not load the plans.'; });
  }
  window.IXPricing = { open: openDialog };

  /* ---------- start ---------- */
  function start() {
    var mount = $('#ix-pricing'); if (!mount) return;
    function load() {
      loadPlans().then(function () { render(); }).catch(function () {
        mount.textContent = ''; var f = el('div', 'ixp-fail', 'Could not load the prices.'); var b = el('button', 'ixp-btn alt', 'Try again'); b.type = 'button'; b.onclick = function () { mount.textContent = ''; mount.appendChild(el('div', 'ixp-skel')); load(); }; f.appendChild(b); mount.appendChild(f);
      });
    }
    load();
    api('/api/premium/status').then(function (s) { state.status = s; if (state.data) render(); }).catch(function () { });
    var q = new URLSearchParams(location.search), why = q.get('premium');
    if (why === 'required' || why === 'limit') {
      var need = q.get('plan');
      var msg = why === 'limit' ? 'You have opened all the tests included in your plan. Pick a plan below to unlock more.'
        : need === 'max' ? 'That content needs the Max plan. Pick Max below to unlock it.' : 'That content is for Premium members. Pick a plan below to unlock it.';
      state.notice = msg; if (state.data) render();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
