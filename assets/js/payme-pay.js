/*
 * IELTS X — "Pay with Payme" (assets/js/payme-pay.js, classic script; used by the Price page, Account and /payment-status).
 *   IXPayme.pay(orderId, button)  asks this server for the Payme checkout form of one of the student's own unpaid orders
 *                                 (POST /api/orders/<id>/payme: the amount comes from the order on the server) and
 *                                 sends the browser to Payme with it.
 * The plan is switched on only when Payme itself tells the server the payment is complete (payme.js); nothing here,
 * and nothing in the address Payme sends the student back to, can switch it on.
 */
(function () {
  'use strict';
  var CHECKOUT = /^https:\/\/[a-z0-9.-]+\.(paycom|payme)\.uz$/i;
  function lang() {
    var l = String((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
    return l.indexOf('ru') === 0 ? 'ru' : l.indexOf('uz') === 0 ? 'uz' : 'en';
  }
  var busy = [];
  function pay(orderId, button) {
    if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); busy.push(button); }
    return fetch('/api/orders/' + encodeURIComponent(orderId) + '/payme', {
      method: 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: lang() })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok || !d.checkout) throw new Error(d.error || 'Could not open Payme. Please try again.');
        return d.checkout;
      });
    }).then(function (c) {
      if (!c || !CHECKOUT.test(String(c.action || '')) || !c.fields) throw new Error('Could not open Payme. Please try again.');
      var f = document.createElement('form');
      f.method = 'POST'; f.action = c.action; f.acceptCharset = 'UTF-8'; f.style.display = 'none';
      Object.keys(c.fields).forEach(function (k) {
        var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = String(c.fields[k]); f.appendChild(i);
      });
      document.body.appendChild(f);
      f.submit();
    }).catch(function (e) {
      if (button) { button.disabled = false; button.removeAttribute('aria-busy'); }
      throw e;
    });
  }
  // back from Payme with the browser's Back button: the page comes from the cache with its buttons still disabled
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    busy.splice(0).forEach(function (b) { b.disabled = false; b.removeAttribute('aria-busy'); });
  });
  window.IXPayme = { pay: pay };
})();
