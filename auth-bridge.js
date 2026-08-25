
(function () {
  'use strict';

  const EMAIL_KEY = 'ieltsx_logged_in_email';
  const USER_KEY = 'ieltsx_current_user';
  const USERS_KEY = 'ieltsx_users';

  function normalize(v){ return String(v || '').trim().toLowerCase(); }

  function readUsers(){
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch(e){ return []; }
  }

  function currentEmail(){
    return normalize(
      localStorage.getItem(EMAIL_KEY) ||
      localStorage.getItem('userEmail') ||
      ''
    );
  }

  window.IELTSXAuth = {
    email: currentEmail,
    isLoggedIn: function(){ return !!currentEmail(); },
    currentUser: function(){
      const email = currentEmail();
      const user = readUsers().find(function(u){ return normalize(u.email) === email; });
      return user || {email: email};
    },
    logout: function(){
      localStorage.removeItem(EMAIL_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('ieltsx_admin_session');
      location.href = '/login.html';
    }
  };

  // Prevent broken/old login redirect flags from leaving index in an error state.
  if (location.pathname.endsWith('/index.html') || location.pathname === '/' ) {
    const bad = new URLSearchParams(location.search).get('admin');
    if (bad === 'denied') {
      history.replaceState({}, '', location.pathname);
    }
  }
})();
