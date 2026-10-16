/*
 * IELTSX — locked premium cards.
 * A card with data-premium-card (or .premium-card / .unlock-card) is locked for visitors
 * without premium. The decision comes from the server (IELTSXPremium.status), not from localStorage.
 */
(function () {
  'use strict';

  function known() {
    var P = window.IELTSXPremium;
    return P && P.cached ? P.cached() : null;
  }
  function isPremium() {
    var s = known();
    return !!(s && s.premium);
  }
  function status() {
    var P = window.IELTSXPremium;
    return P ? P.status() : Promise.resolve({ premium: false, authenticated: false });
  }

  function show(card, s) {
    if (card.querySelector('.ieltsx-unlock-overlay')) return;
    var loggedIn = s && s.authenticated;
    var overlay = document.createElement('div');
    overlay.className = 'ieltsx-unlock-overlay';
    overlay.innerHTML =
      '<div class="ieltsx-unlock-dialog">' +
      '<button class="unlock-close" aria-label="Close">×</button>' +
      '<h3>Premium Access Required</h3>' +
      '<p>' + (loggedIn ? 'This test is locked. Upgrade to Premium to unlock this content.' : 'Sign in to your account to open this test.') + '</p>' +
      '<a class="unlock-action" href="' + (loggedIn ? '/Price?premium=required' : '/login?next=' + encodeURIComponent(location.pathname + location.search)) + '">' +
      (loggedIn ? 'Unlock Premium' : 'Sign in') + '</a>' +
      '</div>';
    card.appendChild(overlay);
    overlay.querySelector('.unlock-close').onclick = function () { overlay.remove(); };
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  }

  function paint(s) {
    var locked = !(s && s.premium);
    document.querySelectorAll('.ieltsx-unlock-card').forEach(function (card) {
      card.classList.toggle('is-locked', locked);
      card.classList.toggle('is-unlocked', !locked);
    });
  }

  window.IELTSXUnlock = {
    isPremium: isPremium,
    requirePremium: function (target) {
      return status().then(function (s) {
        if (s.premium) { if (target) location.href = target; return true; }
        var card = document.querySelector('.ieltsx-unlock-card');
        if (card) show(card, s); else location.href = s.authenticated ? '/Price?premium=required' : '/login';
        return false;
      });
    }
  };

  function init() {
    document.querySelectorAll('[data-premium-card],.premium-card,.unlock-card').forEach(function (card) {
      card.classList.add('ieltsx-unlock-card');
      var action = card.querySelector('[data-premium-link], a[href], button');
      if (action && !action.dataset.unlockBound) {
        action.dataset.unlockBound = '1';
        var href = action.getAttribute('href');
        action.addEventListener('click', function (e) {
          if (isPremium()) return;               // already known: let the link work
          e.preventDefault();
          status().then(function (s) {
            if (s.premium) { if (href) location.href = href; return; }
            show(card, s);
          });
        });
      }
    });
    paint(known());                               // instant state from the short cache
    status().then(paint);                         // then the server's answer
  }
  document.addEventListener('ieltsx:premium', function (e) { paint(e.detail); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
