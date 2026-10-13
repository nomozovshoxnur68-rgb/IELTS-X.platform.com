/*
 * IELTSX — premium status (classic script).
 * The server decides who is premium (GET /api/premium/status); nothing is read from localStorage,
 * so editing browser storage can not unlock anything. Pages that need premium also get
 * redirected by the server before they are sent (see server.js, PREMIUM_PATHS).
 *
 *   IELTSXPremium.status()          -> Promise<{authenticated, premium, admin, plan, expiresAt}>
 *   IELTSXPremium.cached()          -> last known status (sync) or null
 *   IELTSXPremium.requirePremium()  -> sends the visitor to login / pricing when needed
 *   <html data-premium-required>    -> protect() does that automatically
 */
(function () {
  'use strict';
  var KEY = 'ieltsx_premium';
  var inflight = null;
  var last = null;

  function readCache() {
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.t < 60000) return c.s;
    } catch (e) { /* no cache */ }
    return null;
  }
  function status(force) {
    if (!force && last && Date.now() - last.t < 30000) return Promise.resolve(last.s);
    if (!force && inflight) return inflight;
    inflight = fetch('/api/premium/status', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('status ' + r.status)); })
      .then(function (s) {
        last = { t: Date.now(), s: s };
        try { sessionStorage.setItem(KEY, JSON.stringify(last)); } catch (e) { /* ignore */ }
        document.dispatchEvent(new CustomEvent('ieltsx:premium', { detail: s }));
        return s;
      })
      .catch(function () { return { authenticated: false, premium: false, admin: false, error: true }; })
      .then(function (s) { inflight = null; return s; });
    return inflight;
  }
  function here() { return encodeURIComponent(location.pathname + location.search); }
  function requirePremium(target) {
    return status().then(function (s) {
      if (s.premium) { if (target) location.href = target; return true; }
      if (s.error) return false;
      location.href = s.authenticated ? '/Price.html?premium=required&next=' + encodeURIComponent(target || (location.pathname + location.search)) : '/login.html?next=' + here();
      return false;
    });
  }
  window.IELTSXPremium = {
    status: status,
    cached: function () { return last ? last.s : readCache(); },
    isPremium: function () { var c = window.IELTSXPremium.cached(); return !!(c && c.premium); },
    requirePremium: requirePremium,
    refresh: function () { return status(true); },
    protect: function () {
      if (document.documentElement.hasAttribute('data-premium-required')) requirePremium();
    }
  };
})();
