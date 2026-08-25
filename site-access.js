import { getCurrentUser, logout as endServerSession } from './auth.js';

const loginUrl = '/login.html';

function clearLegacySession() {
  localStorage.removeItem('ieltsx_logged_in_email');
  localStorage.removeItem('ieltsx_current_user');
  localStorage.removeItem('ieltsx_current_user_v1');
  localStorage.removeItem('userEmail');
}

async function currentUser() {
  try {
    return await getCurrentUser();
  } catch (error) {
    return null;
  }
}

async function requireLogin() {
  const user = await currentUser();
  if (user) return user;

  const next = encodeURIComponent(location.pathname + location.search);
  location.assign(`${loginUrl}?next=${next}`);
  return null;
}

async function logout() {
  try {
    await endServerSession();
  } finally {
    clearLegacySession();
    location.assign(loginUrl);
  }
}

window.IELTSXSiteAccess = { currentUser, requireLogin, logout };

document.addEventListener('DOMContentLoaded', async () => {
  const user = await currentUser();
  window.dispatchEvent(new CustomEvent('ieltsx:user-context-changed', { detail: { user } }));

  const logoutControl = document.getElementById('dropdown-logout');
  if (logoutControl) {
    logoutControl.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      void logout();
    }, true);
  }
});
