/*
 * IELTSX — account helpers for the browser (ES module).
 *   import { login, register, logout, getCurrentUser } from '/auth.js';
 * Everything goes through the server API; the session lives in an HttpOnly cookie,
 * so nothing secret (no password, no token, no premium flag) is ever kept in localStorage.
 */
async function request(url, { method = 'GET', body } = {}) {
  if (location.protocol === 'file:') {
    const err = new Error('Sahifa fayl sifatida ochilgan (file://). Login ishlashi uchun saytni serverda oching: terminalda "npm start", keyin http://localhost:3000');
    err.code = 'no-api';
    throw err;
  }
  let res;
  try {
    res = await fetch(url, {
      method, credentials: 'same-origin', cache: 'no-store',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    const err = new Error('Network error. Check your connection and try again.');
    err.code = 'network';
    throw err;
  }
  let data = null;
  try { data = await res.json(); } catch (e) { /* empty or not json */ }
  // The page is served by a plain static host (Live Server, GitHub Pages, ...): there is no /api there.
  if (data === null && (res.status === 404 || res.status === 405 || res.status === 501 || res.ok)) {
    const err = new Error('Server (API) topilmadi. Saytni "npm start" bilan ishga tushiring (http://localhost:3000) yoki Vercel/Render ga joylang. Faqat HTML fayllarni ochish bilan login ishlamaydi.');
    err.code = 'no-api';
    err.status = res.status;
    throw err;
  }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data || {};
}

/* ---- accounts you used on this device (only name + email, for the quick "continue as" list) ---- */
const KNOWN_KEY = 'ieltsx_known_accounts';
export function getKnownAccounts() {
  try {
    const list = JSON.parse(localStorage.getItem(KNOWN_KEY) || '[]');
    return Array.isArray(list) ? list.filter((a) => a && a.email) : [];
  } catch (e) { return []; }
}
export function rememberAccount(user) {
  if (!user || !user.email) return;
  const list = getKnownAccounts().filter((a) => a.email !== user.email);
  list.unshift({ uid: user.id, email: user.email, displayName: user.name });
  try { localStorage.setItem(KNOWN_KEY, JSON.stringify(list.slice(0, 4))); } catch (e) { /* storage full / private mode */ }
}
export function removeKnownAccount(uid) {
  try { localStorage.setItem(KNOWN_KEY, JSON.stringify(getKnownAccounts().filter((a) => a.uid !== uid))); } catch (e) { /* ignore */ }
}

/* ---- session ---- */
export async function login(email, password) {
  const { user } = await request('/api/auth/login', { method: 'POST', body: { email, password } });
  rememberAccount(user);
  return user;
}
export async function register(name, email, password) {
  const { user } = await request('/api/auth/register', { method: 'POST', body: { name, email, password } });
  rememberAccount(user);
  return user;
}
export async function loginWithGoogle(credential) {
  const { user } = await request('/api/auth/google', { method: 'POST', body: { credential } });
  rememberAccount(user);
  return user;
}
export async function logout() {
  try { await request('/api/auth/logout', { method: 'POST' }); } catch (e) { /* cookie is cleared by the server when reachable */ }
  ['ieltsx_logged_in_email', 'userEmail', 'ieltsx_current_user', 'ieltsx_premium', 'ieltsx_completed'].forEach((k) => {
    try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) { /* ignore */ }
  });
}
// returns the user, or null when signed out; throws (code "network") when the server cannot be reached
export async function getCurrentUser() { return (await request('/api/auth/me')).user || null; }
export async function getAuthConfig() {
  try { return await request('/api/auth/config'); } catch (e) { return { googleClientId: null, apiError: e && e.message ? e.message : 'API unavailable' }; }
}
export async function requestPasswordReset(email) { return request('/api/auth/forgot', { method: 'POST', body: { email } }); }
export async function resetPassword(token, newPassword) {
  const { user } = await request('/api/auth/reset', { method: 'POST', body: { token, newPassword } });
  rememberAccount(user);
  return user;
}
export async function verifyEmail(token) { await request('/api/auth/verify', { method: 'POST', body: { token } }); }
export async function resendVerification() { return request('/api/auth/verify/send', { method: 'POST' }); }
export async function updateProfile(name) { return (await request('/api/auth/profile', { method: 'POST', body: { name } })).user; }
export async function changePassword(currentPassword, newPassword) {
  return (await request('/api/auth/password', { method: 'POST', body: { currentPassword, newPassword } })).user;
}

/* only same-site relative paths are allowed as a "go back to" target */
export function safeNext(value, fallback = '/') {
  const v = String(value || '');
  if (!v.startsWith('/') || v.startsWith('//') || v.startsWith('/\\') || /[\r\n]/.test(v)) return fallback;
  if (/^\/(login|admin-login)(\.html)?(\?|$)/i.test(v)) return fallback;
  return v;
}
