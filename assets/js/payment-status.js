/*
 * IELTS X — payment status page (assets/js/payment-status.js, used by payment-status.html; styles: payment-status.css).
 * Payme sends the student back to /payment-status?order=IX-XXXXXX. The page asks the server about that order
 * (GET /api/orders/<code>: only the signed-in owner gets an answer) and shows what the SERVER knows:
 *   paid       -> success, the plan and its end date
 *   pending    -> Payme is still confirming (the page asks again every few seconds), or the payment did not go through
 *   refunded / cancelled / rejected -> what happened, and what to do next
 * Nothing in the address (no "status=success") is believed: only the server switches a plan on, when Payme confirms.
 */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var ref = (new URLSearchParams(location.search).get('order') || '').trim().slice(0, 40);
  var started = Date.now(), timer = null;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function money(n, c) { return new Intl.NumberFormat('en-US').format(Math.round(Number(n) || 0)) + ' ' + (c === 'UZS' || !c ? 'so‘m' : c); }
  function day(v) { return v ? new Date(v).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : ''; }
  function months(m) { return m + (m === 1 ? ' month' : ' months'); }
  var ICON = {
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    bad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>'
  };

  function show(kind, title, text, actions) {
    var icon = document.querySelector('.pst-icon');
    icon.className = 'pst-icon ' + ({ ok: 'pst-ok', bad: 'pst-bad', warn: 'pst-warn', wait: 'pst-wait' }[kind] || 'pst-wait');
    icon.innerHTML = kind === 'wait' ? '<span class="pst-spin"></span>' : ICON[kind] || '';
    $('pst-title').textContent = title;
    var t = $('pst-text'); t.textContent = ''; (Array.isArray(text) ? text : [text]).forEach(function (x) { t.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); });
    var a = $('pst-actions'); a.textContent = ''; (actions || []).forEach(function (x) { a.appendChild(x); });
    document.title = title + ' — IELTSX';
  }
  function link(text, href, cls) { var a = el('a', 'pst-btn ' + (cls || 'alt'), text); a.href = href; return a; }
  function payButton(o) {
    if (!window.IXPayme) return null;
    var b = el('button', 'pst-btn primary', 'Pay ' + money(o.amount, o.currency) + ' with Payme'); b.type = 'button';
    b.onclick = function () {
      $('pst-err').textContent = ''; b.textContent = 'Opening Payme…';
      window.IXPayme.pay(o.id, b).catch(function (e) { b.textContent = 'Pay ' + money(o.amount, o.currency) + ' with Payme'; $('pst-err').textContent = e.message; });
    };
    return b;
  }
  function summary(o, extra) {
    var dl = $('pst-summary'); dl.textContent = ''; dl.hidden = false;
    [['Order', o.ref, 'pst-ref'], ['Plan', o.planName + ' · ' + months(o.months)], ['Amount', money(o.amount, o.currency)]].concat(extra || []).forEach(function (r) {
      var d = el('div'); d.appendChild(el('dt', null, r[0])); d.appendChild(el('dd', r[2] || null, r[1])); dl.appendChild(d);
    });
  }
  /* why Payme cancelled a payment (CancelTransaction "reason") */
  function why(reason) {
    return ({ 1: 'Payme could not reach the receiver of the payment.', 2: 'Your bank could not take the payment.', 3: 'The payment could not be completed.',
      4: 'The payment was not finished in time.', 5: 'The money was returned.' })[reason] || 'The payment was cancelled.';
  }

  function render(d) {
    var o = d.order, pay = d.payment, online = !!d.payme;
    var orders = link('See my orders', '/account#subscription');
    if (o.status === 'paid') {
      stop();
      summary(o, [['Paid', day(o.paidAt) + (o.paidVia === 'payme' ? ' · Payme' : '')]].concat(d.premium && d.premium.active && d.premium.expiresAt ? [['Plan active until', day(d.premium.expiresAt)]] : []));
      try { sessionStorage.removeItem('ieltsx_premium'); } catch (e) { /* the cached plan of premium-access.js */ }
      return show('ok', 'Payment successful', ['Thank you! Your ', el('b', null, o.planName), ' plan is active now.'], [link('Start practising', '/dashboard', 'primary'), orders]);
    }
    if (o.status === 'refunded') {
      stop(); summary(o, o.refundedAt ? [['Refunded', day(o.refundedAt)]] : []);
      return show('warn', 'Payment refunded', 'This payment was returned to you, and the plan time it added was taken back.', [link('Choose a plan', '/Price', 'primary'), orders]);
    }
    if (o.status === 'cancelled' || o.status === 'rejected') {
      stop(); summary(o);
      return show('bad', o.status === 'rejected' ? 'Order rejected' : 'Order cancelled', 'This order is closed and cannot be paid. You can make a new order on the Price page.', [link('Choose a plan', '/Price', 'primary'), orders]);
    }
    // pending: what is Payme doing?
    summary(o);
    var waited = Date.now() - started;
    if (pay && pay.state === 1 && waited < 5 * 60000) {
      again(3000);
      return show('wait', 'Waiting for Payme…', 'Payme is confirming your payment. This page updates by itself; please do not pay twice.', [orders]);
    }
    if (!pay && waited < 20000) {   // just back from Payme: its confirmation may still be on the way
      again(2500);
      return show('wait', 'Checking your payment…', 'One moment, please.', [orders]);
    }
    stop();
    var retry = online ? payButton(o) : null;
    var other = link('Other ways to pay', '/account#subscription');
    if (pay && pay.state === -1) return show('bad', 'Payment not completed', [why(pay.reason), ' No money was taken for this order. You can try again.'], [retry, other].filter(Boolean));
    if (pay && pay.state === 1) return show('warn', 'Payment is still in progress', 'Payme has not confirmed this payment yet. If money was taken, it will be confirmed or returned automatically. Check again in a few minutes.', [reloadButton(), orders]);
    return show('warn', 'Not paid yet', 'We have not received a payment for this order. If you have just paid, wait a minute and check again.', [retry, reloadButton(), other].filter(Boolean));
  }
  function reloadButton() { var b = el('button', 'pst-btn alt', 'Check again'); b.type = 'button'; b.onclick = function () { started = Date.now(); load(); }; return b; }
  function stop() { if (timer) { clearTimeout(timer); timer = null; } }
  function again(ms) { stop(); timer = setTimeout(load, ms); }

  function load() {
    fetch('/api/orders/' + encodeURIComponent(ref), { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { d.httpStatus = r.status; return d; }); })
      .then(function (d) {
        if (d.httpStatus === 401) { stop(); return show('warn', 'Please sign in', 'Sign in with the account that made this order to see its payment.', [link('Sign in', '/login?next=' + encodeURIComponent(location.pathname + location.search), 'primary')]); }
        if (d.httpStatus === 404) { stop(); return show('bad', 'Order not found', 'This order does not exist or belongs to another account.', [link('See my orders', '/account#subscription', 'primary')]); }
        if (d.httpStatus === 429) return again(15000);
        if (!d.order) throw new Error(d.error || 'Could not load the order.');
        render(d);
      })
      .catch(function () {
        if (Date.now() - started < 60000) return again(5000);
        show('warn', 'Could not check the payment', 'Check your internet connection and try again. If you paid, the plan is switched on anyway as soon as Payme confirms.', [reloadButton(), link('See my orders', '/account#subscription')]);
      });
  }

  function start() {
    if (!/^[A-Za-z0-9-]{4,40}$/.test(ref)) return show('warn', 'No order selected', 'Open this page from your order, or see all your orders and payments in your account.', [link('See my orders', '/account#subscription', 'primary')]);
    load();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
