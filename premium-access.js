(() => {
  'use strict';

  async function status() {
    try {
      const r = await fetch('/api/premium/status', { credentials: 'same-origin', cache: 'no-store' });
      if (r.ok) {
        return await r.json();
      }
    } catch (e) {}

    // Fallback to local storage if API is offline or unreachable
    try {
      const user = JSON.parse(localStorage.getItem('ieltsx_current_user') || 'null');
      if (user) {
        const isPrem = !!(user.premiumActive || user.premium);
        return { premium: isPrem, authenticated: true, plan: user.plan || (isPrem ? 'Premium' : 'Free') };
      }
    } catch (e) {}

    return { premium: false, authenticated: false };
  }

  async function requirePremium() {
    const s = await status();
    if (!s.premium) {
      const next = encodeURIComponent(location.pathname + location.search);
      location.href = '/Price.html?premium=required&next=' + next;
      return false;
    }
    return true;
  }

  function protect() {
    if (document.documentElement.hasAttribute('data-premium-required')) {
      return requirePremium();
    }
  }

  window.IELTSXPremium = {
    status,
    requirePremium,
    protect
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (document.documentElement.hasAttribute('data-premium-required')) {
      requirePremium();
    }
  });
})();