/*
 * IELTSX — small shared helpers loaded in <head> by the saved pages.
 *  - window.IELTSXAuth.email()/isLoggedIn()  (the e-mail is mirrored by site-access.js for display only)
 *  - window.IELTSXAuth.logout()              (real server logout)
 *  - shows a one-time notice when the server sent you back with ?admin=denied
 * It never grants any access by itself: the server and /api/auth/me decide everything.
 */
(function () {
  'use strict';
  function email() {
    try { return String(localStorage.getItem('ieltsx_logged_in_email') || localStorage.getItem('userEmail') || '').trim().toLowerCase(); }
    catch (e) { return ''; }
  }
  window.IELTSXAuth = {
    email: email,
    isLoggedIn: function () { return !!email(); },
    logout: function () {
      return fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
        .catch(function () { /* offline */ })
        .then(function () {
          ['ieltsx_logged_in_email', 'userEmail', 'ieltsx_current_user', 'ieltsx_premium'].forEach(function (k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) { /* ignore */ } });
          location.href = '/login';
        });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(location.search);
    if (params.get('admin') !== 'denied') return;
    var note = document.createElement('div');
    note.setAttribute('role', 'alert');
    note.textContent = 'Admin access required. Sign in with an administrator account.';
    note.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:99999;background:#111827;color:#fff;padding:10px 16px;border-radius:10px;font:500 13px system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)';
    document.body.appendChild(note);
    setTimeout(function () { note.remove(); }, 5000);
    params.delete('admin');
    history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '') + location.hash);
  });
})();
