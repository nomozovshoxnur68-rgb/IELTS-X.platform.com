/*
 * IELTSX admin pages (admin/*.html): shared helpers.
 * The server already refuses these pages to everybody who is not an admin; this script also checks
 * the session, shows who is signed in, and gives every page the same api()/toast()/esc() helpers.
 */
(function () {
  'use strict';
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  async function api(url, opt = {}) {
    const isForm = opt.body instanceof FormData;
    const r = await fetch(url, { credentials: 'same-origin', ...opt, headers: { ...(opt.body && !isForm ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    let d = null; try { d = await r.json(); } catch (e) { /* no body */ }
    if (!r.ok) { const e = new Error((d && d.error) || 'Request failed'); e.status = r.status; throw e; }
    return d || {};
  }

  const style = document.createElement('style');
  style.textContent = '.toast{position:fixed;right:20px;bottom:20px;background:#0f172a;color:#fff;padding:11px 14px;border-radius:9px;font-size:13px;z-index:100;opacity:0;transform:translateY(8px);pointer-events:none;transition:.2s}.toast.show{opacity:1;transform:none}.toast.bad{background:#b91c1c}.who{margin-top:auto;padding:14px 12px 0;font-size:12px;color:#aab0b0;word-break:break-all}';
  document.head.appendChild(style);
  const toastEl = document.createElement('div'); toastEl.className = 'toast'; document.body.appendChild(toastEl);
  function toast(message, bad) {
    toastEl.textContent = message; toastEl.classList.toggle('bad', !!bad); toastEl.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  const never = new Promise(() => {});
  const ready = (async () => {
    try {
      const { user } = await api('/api/auth/me');
      if (!user) { location.replace('/login.html?next=' + encodeURIComponent(location.pathname)); return never; }
      if (!user.isAdmin) { location.replace('/index.html?admin=denied'); return never; }
      const nav = document.querySelector('.nav');
      if (nav) {
        const who = document.createElement('div'); who.className = 'who'; who.textContent = user.email; nav.parentNode.appendChild(who);
        const out = document.createElement('a'); out.href = '#'; out.textContent = 'Sign out';
        out.addEventListener('click', async (e) => { e.preventDefault(); await api('/api/auth/logout', { method: 'POST' }).catch(() => {}); location.href = '/login.html'; });
        nav.appendChild(out);
      }
      return user;
    } catch (e) {
      document.body.innerHTML = '<p style="padding:24px;font-family:system-ui">Cannot reach the server. Check your connection and reload.</p>';
      return never;
    }
  })();

  window.A = { api, esc, toast, ready };
})();
