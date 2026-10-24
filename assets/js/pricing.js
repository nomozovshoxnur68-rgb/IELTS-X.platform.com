/*
 * IELTS X — buying a plan (assets/js/pricing.js, used by Price.html).
 * "Lock in ..." / "Get Tier 3 Access" open a small dialog: choose plan + months, we create an order
 * with a code, you pay (Uzcard / Humo / ...) and message the code on Telegram; an admin confirms and
 * your plan switches on automatically (or a payment provider's signed webhook does it).
 */
(function () {
  'use strict';
  var cache = { plans: null, user: undefined };

  function api(url, opt) {
    opt = opt || {};
    return fetch(url, { credentials: 'same-origin', cache: 'no-store', method: opt.method || 'GET',
      headers: opt.body ? { 'Content-Type': 'application/json' } : undefined, body: opt.body ? JSON.stringify(opt.body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || 'Something went wrong'); return d; }); });
  }
  function money(n, cur) { return new Intl.NumberFormat('en-US').format(n) + ' ' + (cur === 'UZS' ? 'uzs' : cur); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  var style = document.createElement('style');
  style.textContent =
    '.ixp-ov{position:fixed;inset:0;z-index:99990;background:rgba(15,23,42,.55);display:grid;place-items:center;padding:16px}' +
    '.ixp{width:100%;max-width:440px;max-height:92vh;overflow:auto;background:#fff;color:#0f172a;border-radius:16px;padding:22px;box-shadow:0 25px 60px rgba(0,0,0,.3);font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
    'html.dark-mode .ixp{background:#131920;color:#e5e7eb}.ixp h2{margin:0 0 4px;font-size:20px}.ixp p{margin:0 0 14px;color:#64748b}' +
    '.ixp-row{display:grid;gap:8px;margin-bottom:14px}.ixp-row.cols{grid-template-columns:repeat(3,1fr)}' +
    '.ixp-opt{border:1px solid #cbd5e1;border-radius:10px;padding:10px 12px;cursor:pointer;background:transparent;color:inherit;font:inherit;text-align:left}' +
    'html.dark-mode .ixp-opt{border-color:#334155}.ixp-opt[aria-pressed="true"]{border-color:#2563eb;box-shadow:0 0 0 2px rgba(37,99,235,.25)}' +
    '.ixp-opt b{display:block}.ixp-opt small{color:#64748b}.ixp-total{display:flex;justify-content:space-between;font-weight:700;margin:4px 0 14px}' +
    '.ixp-btn{display:block;width:100%;text-align:center;padding:11px 14px;border-radius:10px;border:0;background:#0f172a;color:#fff;font:600 14px system-ui,sans-serif;cursor:pointer;text-decoration:none}' +
    'html.dark-mode .ixp-btn{background:#f8fafc;color:#0f172a}.ixp-btn.alt{background:transparent;color:inherit;border:1px solid #cbd5e1;margin-top:8px}' +
    '.ixp-code{font:700 24px ui-monospace,Menlo,Consolas,monospace;letter-spacing:.06em;text-align:center;padding:12px;border-radius:10px;background:#f1f5f9;margin:0 0 12px}html.dark-mode .ixp-code{background:#1b2430}' +
    '.ixp-err{color:#dc2626;margin:0 0 10px;min-height:0}.ixp-x{float:right;border:0;background:none;color:inherit;font-size:22px;cursor:pointer;line-height:1}' +
    '.ixp-bar{position:sticky;top:0;z-index:50;padding:10px 16px;text-align:center;background:#fef3c7;color:#78350f;font:500 14px system-ui,sans-serif}';
  document.head.appendChild(style);

  function loadPlans() { return cache.plans ? Promise.resolve(cache.plans) : api('/api/plans').then(function (d) { cache.plans = d; return d; }); }
  function loadUser() { return cache.user !== undefined ? Promise.resolve(cache.user) : api('/api/auth/me').then(function (d) { cache.user = d.user || null; return cache.user; }).catch(function () { return null; }); }

  function openDialog(defaultPlan) {
    var overlay = el('div', 'ixp-ov'), box = el('div', 'ixp');
    overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true');
    overlay.appendChild(box); document.body.appendChild(overlay);
    function close() { overlay.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    box.textContent = 'Loading…';

    Promise.all([loadPlans(), loadUser()]).then(function (res) {
      var data = res[0], user = res[1];
      var plan = data.plans.filter(function (p) { return p.id === defaultPlan; })[0] || data.plans[0];
      var months = data.months.indexOf(3) > -1 ? 3 : data.months[0];

      function render() {
        box.textContent = '';
        var x = el('button', 'ixp-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.onclick = close;
        box.appendChild(x);
        box.appendChild(el('h2', null, 'Choose your plan'));
        box.appendChild(el('p', null, 'One-time payment, no auto-renewal.'));
        var plans = el('div', 'ixp-row');
        data.plans.forEach(function (p) {
          var b = el('button', 'ixp-opt'); b.type = 'button'; b.setAttribute('aria-pressed', p.id === plan.id ? 'true' : 'false');
          b.appendChild(el('b', null, p.name)); b.appendChild(el('small', null, 'from ' + money(p.prices[String(data.months[0])], data.currency) + ' / ' + data.months[0] + ' month'));
          b.onclick = function () { plan = p; render(); }; plans.appendChild(b);
        });
        box.appendChild(plans);
        var durs = el('div', 'ixp-row cols');
        data.months.forEach(function (m) {
          var b = el('button', 'ixp-opt'); b.type = 'button'; b.setAttribute('aria-pressed', m === months ? 'true' : 'false');
          b.appendChild(el('b', null, m + (m === 1 ? ' month' : ' months'))); b.appendChild(el('small', null, money(plan.prices[String(m)], data.currency)));
          b.onclick = function () { months = m; render(); }; durs.appendChild(b);
        });
        box.appendChild(durs);
        var total = el('div', 'ixp-total'); total.appendChild(el('span', null, 'Total')); total.appendChild(el('span', null, money(plan.prices[String(months)], data.currency))); box.appendChild(total);
        var err = el('p', 'ixp-err'); err.setAttribute('role', 'alert'); box.appendChild(err);
        var go = el('button', 'ixp-btn', user ? 'Continue' : 'Sign in to continue'); go.type = 'button';
        go.onclick = function () {
          if (!user) { location.href = '/login?next=' + encodeURIComponent(location.pathname); return; }
          go.disabled = true; err.textContent = '';
          api('/api/orders', { method: 'POST', body: { plan: plan.id, months: months } })
            .then(function (d) { showOrder(d.order, d.payment, user); })
            .catch(function (e) { err.textContent = e.message; go.disabled = false; });
        };
        box.appendChild(go);
      }

      function showOrder(order, payment, who) {
        box.textContent = '';
        var x = el('button', 'ixp-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.onclick = close; box.appendChild(x);
        box.appendChild(el('h2', null, 'Your order'));
        box.appendChild(el('p', null, order.planName + ' · ' + order.months + (order.months === 1 ? ' month' : ' months') + ' · ' + money(order.amount, order.currency)));
        box.appendChild(el('div', 'ixp-code', order.ref));
        box.appendChild(el('p', null, payment.instructions));
        var text = 'IELTSX order ' + order.ref + ' - ' + order.planName + ' ' + order.months + 'm - ' + who.email;
        var tg = el('a', 'ixp-btn', 'Message us on Telegram'); tg.href = payment.contact + '?text=' + encodeURIComponent(text); tg.target = '_blank'; tg.rel = 'noopener noreferrer'; box.appendChild(tg);
        var copy = el('button', 'ixp-btn alt', 'Copy order code'); copy.type = 'button';
        copy.onclick = function () { (navigator.clipboard ? navigator.clipboard.writeText(order.ref) : Promise.reject()).then(function () { copy.textContent = 'Copied'; }, function () { copy.textContent = order.ref; }); };
        box.appendChild(copy);
        var acc = el('a', 'ixp-btn alt', 'See my orders'); acc.href = '/account#subscription'; box.appendChild(acc);
      }
      render();
    }).catch(function (e) { box.textContent = e.message || 'Could not load the plans.'; });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button,a');
    if (!b) return;
    var t = (b.textContent || '').replace(/\s+/g, ' ').trim();
    var plan = /^Lock in 17%/i.test(t) ? 'standard' : /^Lock in 20%/i.test(t) ? 'max' : /^Get Tier 3 Access/i.test(t) ? 'max' : null;
    if (!plan) return;
    e.preventDefault(); e.stopPropagation();
    openDialog(plan);
  }, true);

  if (new URLSearchParams(location.search).get('premium') === 'required') {
    var need = new URLSearchParams(location.search).get('plan');
    var bar = el('div', 'ixp-bar', need === 'max' ? 'That content needs the Max plan. Pick Max below to unlock it.'
      : 'That content is for Premium members. Pick a plan below to unlock it.');
    document.addEventListener('DOMContentLoaded', function () { document.body.prepend(bar); });
  }
})();

