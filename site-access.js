/*
 * IELTSX — who is signed in, on every page (ES module).
 *  - fills the header/profile spots:  [data-user-name] [data-user-email] [data-user-avatar]
 *    [data-user-initial] [data-user-email-input] [data-plan-label] [data-profile-first/last]
 *  - shows [data-admin-only] items and an "Admin panel" menu entry for admins
 *  - makes the avatar menu's "Log out" really log out (guests get "Sign in")
 *  - <html data-require-login> sends signed-out visitors to the login page and back
 * No premium or role information is trusted from localStorage: it all comes from /api/auth/me.
 */
import { getCurrentUser, logout, safeNext, resendVerification } from './auth.js';

const LEGACY_KEYS = ['ieltsx_logged_in_email', 'userEmail']; // read by ieltsx-data.js to keep test results per user
let userPromise = null;

function loadUser(force) {
  if (!userPromise || force) {
    userPromise = getCurrentUser().catch((e) => (e && (e.code === 'network' || e.code === 'no-api') ? undefined : null));
  }
  return userPromise;
}
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const initialOf = (u) => (String((u && u.name) || (u && u.email) || '?').trim().charAt(0) || '?').toUpperCase();
const planText = (u) => (u.isAdmin ? 'ADMIN' : (u.premiumActive ? String(u.plan || 'Premium').toUpperCase() : 'DEMO'));

function syncLegacy(user) {
  try {
    if (user) LEGACY_KEYS.forEach((k) => localStorage.setItem(k, user.email));
    else LEGACY_KEYS.concat(['ieltsx_current_user']).forEach((k) => localStorage.removeItem(k));
  } catch (e) { /* storage blocked */ }
}

function ensureMenuLink(id, text, href, afterEl) {
  let link = document.getElementById(id);
  if (!link && afterEl) {
    link = afterEl.cloneNode(true);
    link.id = id;
    link.removeAttribute('data-link');
    link.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    const label = link.querySelector('span:last-child');
    if (label) label.textContent = text; else link.textContent = text;
    afterEl.parentNode.insertBefore(link, afterEl.nextSibling);
  }
  if (link) { link.setAttribute('href', href); link.hidden = false; link.style.display = ''; }
  return link;
}

function render(user) {
  const guest = !user;
  $$('[data-user-name]').forEach((n) => { n.textContent = guest ? 'Guest' : user.name; });
  $$('[data-user-email]').forEach((n) => { n.textContent = guest ? 'Not signed in' : user.email; });
  $$('[data-user-avatar]').forEach((n) => { n.textContent = guest ? '?' : initialOf(user); });
  $$('[data-user-initial]').forEach((n) => { n.textContent = guest ? '?' : initialOf(user); });
  $$('[data-user-email-input]').forEach((n) => { n.value = guest ? '' : user.email; });
  $$('[data-plan-label]').forEach((n) => { n.textContent = guest ? 'DEMO' : planText(user); });
  const status = document.getElementById('ieltsx-account-status');
  if (status) { status.textContent = guest ? '' : user.email; status.style.display = guest ? 'none' : 'block'; }
  const [first, ...rest] = String(guest ? '' : user.name).split(' ');
  $$('[data-profile-first]').forEach((n) => { n.value = first || ''; });
  $$('[data-profile-last]').forEach((n) => { n.value = rest.join(' '); });
  $$('[data-admin-only]').forEach((n) => { n.hidden = guest || !user.isAdmin; });

  const account = document.getElementById('dropdown-account');
  const logoutItem = document.getElementById('dropdown-logout');
  if (account && !guest && user.isAdmin) ensureMenuLink('dropdown-admin', 'Admin panel', '/admin', account);
  const adminLink = document.getElementById('dropdown-admin');
  if (adminLink) adminLink.hidden = guest || !user.isAdmin;
  if (account) account.style.display = guest ? 'none' : '';
  if (logoutItem) {
    const label = logoutItem.querySelector('span:last-child');
    if (label) label.textContent = guest ? 'Sign in' : 'Log out';
    logoutItem.dataset.mode = guest ? 'login' : 'logout';
  }
}

async function onLogoutClick(e) {
  const item = e.target.closest('#dropdown-logout, [data-action-logout], [data-logout]');
  if (!item) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  if (item.dataset.mode === 'login') {
    location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search);
    return;
  }
  await logout();
  location.href = '/login';
}
document.addEventListener('click', onLogoutClick, true);


function showVerifyBanner(user) {
  if (!user || user.emailVerified || document.getElementById('ix-verify-banner')) return;
  try { if (sessionStorage.getItem('ix-verify-dismissed')) return; } catch (e) { /* ignore */ }
  const bar = document.createElement('div');
  bar.id = 'ix-verify-banner'; bar.setAttribute('role', 'status');
  bar.className = 'ix-verify-banner';
  const msg = document.createElement('span'); msg.textContent = 'Please verify your email address.';
  const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Resend link';
  const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Dismiss');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    try { const r = await resendVerification(); msg.textContent = r.alreadyVerified ? 'Your email is already verified.' : r.sent === false ? 'Email sending is not set up on the site yet. You can keep using your account.' : 'Verification email sent. Check your inbox (and spam).'; btn.remove(); }
    catch (e) { msg.textContent = e.message || 'Could not send the email.'; btn.disabled = false; }
  });
  x.addEventListener('click', () => { bar.remove(); try { sessionStorage.setItem('ix-verify-dismissed', '1'); } catch (e) { /* ignore */ } });
  bar.append(msg, btn, x);
  document.body.prepend(bar);
}

// finished tests follow the account: progress ("Completed") and the results behind the dashboard
async function afterUser(user) {
  if (!user) { try { localStorage.removeItem('ieltsx_completed'); } catch (e) { /* ignore */ } return; }
  showVerifyBanner(user);
  try {
    const r = await fetch('/api/progress', { credentials: 'same-origin', cache: 'no-store' });
    if (r.ok) {
      const d = await r.json();
      localStorage.setItem('ieltsx_completed', JSON.stringify(d.completed || []));
      document.dispatchEvent(new CustomEvent('ieltsx:progress'));
    }
  } catch (e) { /* offline */ }
  if (window.IELTSXData && window.IELTSXData.syncFromServer) window.IELTSXData.syncFromServer();
}

export async function requireLogin() {
  const user = await loadUser();
  if (user === undefined) return null; // offline: do not bounce people to the login page
  if (!user) {
    location.replace('/login?next=' + encodeURIComponent(safeNext(location.pathname + location.search)));
    return null;
  }
  return user;
}

export async function refresh() {
  const user = await loadUser(true);
  if (user !== undefined) {
    syncLegacy(user);
    render(user);
    afterUser(user);
    window.IELTSXUser = user;
    document.dispatchEvent(new CustomEvent('ieltsx:user', { detail: { user } }));
  }
  return user;
}


/* pages whose header has the theme switch but no account menu get a small one */
function ensureUserMenu() {
  if (document.getElementById('avatar-dropdown-trigger') || document.querySelector('[data-ix-user]')) return;
  const sw = document.querySelector('.theme-switch');
  if (!sw) return;
  // a page that already ships its own avatar next to the switch must not get a second one
  const next = sw.nextElementSibling;
  if (next && (next.matches('[data-user-avatar]') || next.querySelector('[data-user-avatar]'))) return;
  const css = document.createElement('style');
  css.textContent =
    '.ix-user{position:relative;display:inline-flex}' +
    '.ix-user-btn{width:32px;height:32px;padding:0;border-radius:8px;border:1px solid var(--ix-border,#e2e8f0);background:var(--ix-bg,#fff);cursor:pointer;overflow:hidden;display:block}' +
    '.ix-user-btn [data-user-avatar]{display:grid;place-items:center;width:100%;height:100%;background:#1e293b;color:#fff;font:600 12px system-ui,sans-serif}' +
    '.ix-user-menu{position:absolute;right:0;top:calc(100% + 8px);min-width:13rem;z-index:60;background:var(--ix-popover,#fff);color:var(--ix-fg,#0f172a);border:1px solid var(--ix-border,#e2e8f0);border-radius:10px;box-shadow:var(--ix-shadow,0 10px 25px rgba(0,0,0,.12));padding:6px;font:14px system-ui,sans-serif}' +
    '.ix-user-menu[hidden]{display:none}' +
    '.ix-user-head{padding:8px 10px 10px;border-bottom:1px solid var(--ix-border,#e2e8f0);margin-bottom:4px}' +
    '.ix-user-head p{margin:0;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:15rem}' +
    '.ix-user-head p:first-child{font-weight:600}.ix-user-head p:last-child{font-size:12px;color:var(--ix-muted,#64748b)}' +
    '.ix-user-menu a,.ix-user-menu button{display:block;width:100%;text-align:left;padding:8px 10px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;text-decoration:none;cursor:pointer}' +
    '.ix-user-menu a:hover,.ix-user-menu button:hover{background:var(--ix-hover,#f1f5f9)}';
  document.head.appendChild(css);
  const wrap = document.createElement('div');
  wrap.className = 'ix-user';
  wrap.setAttribute('data-ix-user', '');
  wrap.innerHTML =
    '<button type="button" class="ix-user-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu"><span data-user-avatar>?</span></button>' +
    '<div class="ix-user-menu" role="menu" hidden>' +
    '<div class="ix-user-head"><p data-user-name>Guest</p><p data-user-email>Not signed in</p></div>' +
    '<a role="menuitem" id="dropdown-account" href="/account">Account</a>' +
    '<a role="menuitem" id="dropdown-admin" href="/admin" hidden>Admin panel</a>' +
    '<button type="button" role="menuitem" id="dropdown-logout"><span>Log out</span></button>' +
    '</div>';
  sw.insertAdjacentElement('afterend', wrap);
  const btn = wrap.querySelector('.ix-user-btn'), menu = wrap.querySelector('.ix-user-menu');
  const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', menu.hidden ? 'false' : 'true'); });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

window.IELTSXSiteAccess = { currentUser: loadUser, requireLogin, refresh, logout };

(async function init() {
  if (document.readyState === 'loading') await new Promise((r) => document.addEventListener('DOMContentLoaded', r, { once: true }));
  ensureUserMenu();
  const user = await refresh();
  if (user === null && document.documentElement.hasAttribute('data-require-login')) requireLogin();
})();
