import { getCurrentUser, logout as endServerSession } from './auth.js';

const loginUrl = '/login.html';

function clearLegacySession() {
  localStorage.removeItem('ieltsx_logged_in_email');
  localStorage.removeItem('ieltsx_current_user');
  localStorage.removeItem('ieltsx_current_user_v1');
  localStorage.removeItem('userEmail');
}

function syncUserToLocalStorage(user) {
  if (!user || !user.email) return;
  const email = String(user.email).trim().toLowerCase();
  localStorage.setItem('ieltsx_logged_in_email', email);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('ieltsx_current_user', JSON.stringify(user));
  localStorage.setItem('ieltsx_current_user_v1', JSON.stringify(user));

  // Sync with legacy ieltsx_users list for offline/client compatibility
  try {
    const users = JSON.parse(localStorage.getItem('ieltsx_users') || '[]');
    const idx = users.findIndex(u => String(u.email || '').toLowerCase() === email);
    const userEntry = {
      id: user.id,
      name: user.name || 'User',
      email: email,
      premium: !!user.premiumActive,
      premiumUntil: user.premiumExpiresAt || (user.premiumActive ? 'lifetime' : null),
      role: user.role || 'user'
    };
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...userEntry };
    } else {
      users.push(userEntry);
    }
    localStorage.setItem('ieltsx_users', JSON.stringify(users));
  } catch (e) {}
}

async function currentUser() {
  try {
    const user = await getCurrentUser();
    if (user) {
      syncUserToLocalStorage(user);
      return user;
    }
  } catch (error) {}

  // Local fallback if server session is not available
  try {
    const stored = localStorage.getItem('ieltsx_current_user');
    if (stored) return JSON.parse(stored);
  } catch (e) {}

  return null;
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
  } catch (e) {
  } finally {
    clearLegacySession();
    location.assign(loginUrl);
  }
}

function updateUI(user) {
  if (!user) return;
  const email = user.email || '';
  const name = user.name || email.split('@')[0] || 'User';

  // Update account status badge if present
  const accountStatusEl = document.getElementById('ieltsx-account-status');
  if (accountStatusEl) {
    accountStatusEl.textContent = email;
    accountStatusEl.style.display = 'block';
  }

  // Update avatar trigger initials if user photo is not present
  const avatarNameEls = document.querySelectorAll('[data-user-name], .user-name-display');
  avatarNameEls.forEach(el => { el.textContent = name; });

  const avatarEmailEls = document.querySelectorAll('[data-user-email], .user-email-display');
  avatarEmailEls.forEach(el => { el.textContent = email; });

  // Update user dropdown if present
  const dropdownUser = document.querySelector('#user-dropdown .font-medium');
  if (dropdownUser && !dropdownUser.getAttribute('data-keep-static')) {
    dropdownUser.textContent = name;
  }
  const dropdownEmail = document.querySelector('#user-dropdown .text-muted-foreground');
  if (dropdownEmail && !dropdownEmail.getAttribute('data-keep-static')) {
    dropdownEmail.textContent = email;
  }
}

window.IELTSXSiteAccess = { currentUser, requireLogin, logout };

document.addEventListener('DOMContentLoaded', async () => {
  const user = await currentUser();
  if (user) {
    updateUI(user);
  }
  window.dispatchEvent(new CustomEvent('ieltsx:user-context-changed', { detail: { user } }));

  const logoutControls = document.querySelectorAll('#dropdown-logout, [data-action-logout]');
  logoutControls.forEach(ctrl => {
    ctrl.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      void logout();
    }, true);
  });
});
