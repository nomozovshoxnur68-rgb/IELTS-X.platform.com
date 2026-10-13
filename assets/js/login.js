/*
 * IELTS X — sign in / create account (assets/js/login.js)
 * One page for both: email + password (sign in or register) and, when GOOGLE_CLIENT_ID is set
 * on the server, "Continue with Google". Works for everybody's own account; admins are just
 * accounts with the admin role.
 */
import {
    login, register, loginWithGoogle, getCurrentUser, getAuthConfig,
    getKnownAccounts, removeKnownAccount, safeNext
} from '../../auth.js';

const $ = (sel) => document.querySelector(sel);
const params = new URLSearchParams(location.search);
const next = safeNext(params.get('next'));

const form = $('#auth-form'), nameField = $('#name-field'), nameInput = $('#name');
const emailInput = $('#email'), passwordInput = $('#password');
const errorBox = $('#error'), submitBtn = $('#submit');
const titleEl = $('#title'), subtitleEl = $('#subtitle');
const switchBtn = $('#switch-mode'), switchText = $('#switch-text');

let mode = (params.get('mode') === 'register' || location.hash === '#register') ? 'register' : 'login';
let busy = false;

/* ───────────── mode: sign in / create account ───────────── */
function setMode(next) {
    mode = next;
    const reg = mode === 'register';
    nameField.hidden = !reg;
    titleEl.textContent = reg ? 'Create your account' : 'Welcome back';
    subtitleEl.textContent = reg ? 'Start preparing for IELTS in a minute.' : 'Sign in to continue your IELTS preparation.';
    submitBtn.textContent = reg ? 'Create account' : 'Sign in';
    switchText.textContent = reg ? 'Already have an account?' : 'New to IELTS X?';
    switchBtn.textContent = reg ? 'Sign in' : 'Create an account';
    passwordInput.autocomplete = reg ? 'new-password' : 'current-password';
    document.title = reg ? 'IELTS X — Create account' : 'IELTS X — Sign in';
    showError('');
}
switchBtn.addEventListener('click', () => { setMode(mode === 'login' ? 'register' : 'login'); (mode === 'register' ? nameInput : emailInput).focus(); });

/* ───────────── helpers ───────────── */
function showError(message, field) {
    errorBox.textContent = message || '';
    [nameInput, emailInput, passwordInput].forEach((i) => i.removeAttribute('aria-invalid'));
    if (message && field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
}
function setBusy(on) {
    busy = on;
    submitBtn.disabled = on;
    form.setAttribute('aria-busy', on ? 'true' : 'false');
    submitBtn.textContent = on ? 'Please wait…' : (mode === 'register' ? 'Create account' : 'Sign in');
}
async function finish(action) {
    if (busy) return;
    showError('');
    setBusy(true);
    try {
        await action();
        location.replace(next);
    } catch (err) {
        showError(err.message || 'Something went wrong. Please try again.');
        setBusy(false);
    }
}

/* ───────────── form ───────────── */
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (mode === 'register' && !nameInput.value.trim()) return showError('Please enter your name.', nameInput);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Please enter a valid email address.', emailInput);
    if (!password) return showError('Please enter your password.', passwordInput);
    if (mode === 'register' && password.length < 8) return showError('Password must be at least 8 characters.', passwordInput);
    finish(() => (mode === 'register' ? register(nameInput.value.trim(), email, password) : login(email, password)));
});

$('#toggle-pw').addEventListener('click', (e) => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    e.currentTarget.textContent = show ? 'Hide' : 'Show';
    e.currentTarget.setAttribute('aria-pressed', show ? 'true' : 'false');
    e.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

/* ───────────── accounts used on this device ───────────── */
function renderSaved() {
    const box = $('#saved-accounts-container'), list = $('#saved-accounts-list');
    const accounts = getKnownAccounts();
    box.hidden = accounts.length === 0;
    list.replaceChildren(...accounts.map((acc) => {
        const row = document.createElement('div'); row.className = 'saved-row';
        const pick = document.createElement('button'); pick.type = 'button'; pick.className = 'saved-pick';
        const avatar = document.createElement('span'); avatar.className = 'saved-avatar'; avatar.textContent = (acc.displayName || acc.email).charAt(0).toUpperCase();
        const text = document.createElement('span'); text.className = 'saved-text';
        const name = document.createElement('span'); name.className = 'saved-name'; name.textContent = acc.displayName || 'Account';
        const mail = document.createElement('span'); mail.className = 'saved-mail'; mail.textContent = acc.email;
        text.append(name, mail); pick.append(avatar, text);
        pick.addEventListener('click', () => { setMode('login'); emailInput.value = acc.email; passwordInput.focus(); });
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'saved-remove';
        remove.textContent = '×'; remove.title = 'Remove from this device'; remove.setAttribute('aria-label', `Remove ${acc.email} from this device`);
        remove.addEventListener('click', () => { removeKnownAccount(acc.uid); renderSaved(); });
        row.append(pick, remove);
        return row;
    }));
}

/* ───────────── Google (only when the server has GOOGLE_CLIENT_ID) ───────────── */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src; s.async = true; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
    });
}
async function setupGoogle() {
    const { googleClientId } = await getAuthConfig();
    if (!googleClientId) {
        // Not configured yet: keep the button visible so it is obvious, and explain what is missing.
        const slot = $('#google-btn');
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'google-fallback';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.3.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg><span>Continue with Google</span>';
        btn.addEventListener('click', () => showError('Google bilan kirish hali sozlanmagan: serverga GOOGLE_CLIENT_ID qo\'yilishi kerak (GOOGLE_SETUP.md ga qarang). Hozircha email va parol bilan kiring.'));
        slot.replaceChildren(btn);
        $('#google-block').hidden = false;
        return;
    }
    try {
        await loadScript('https://accounts.google.com/gsi/client');
        window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => finish(() => loginWithGoogle(response.credential))
        });
        const slot = $('#google-btn');
        $('#google-block').hidden = false;
        window.google.accounts.id.renderButton(slot, { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', width: Math.min(344, slot.clientWidth || 344) });
    } catch (e) {
        // accounts.google.com is blocked or offline: keep the button, explain, email sign-in still works
        const slot = $('#google-btn');
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'google-fallback';
        btn.innerHTML = '<span>Continue with Google</span>';
        btn.addEventListener('click', () => showError('Google xizmatiga ulanib bo\'lmadi (internet yoki VPN/blokirovka). Email va parol bilan kiring yoki keyinroq urinib ko\'ring.'));
        slot.replaceChildren(btn);
        $('#google-block').hidden = false;
    }
}

/* ───────────── start ───────────── */
window.addEventListener('pageshow', (e) => { if (e.persisted) setBusy(false); });

(async function start() {
    setMode(mode);
    renderSaved();
    if (params.get('switch') !== '1') {
        try {
            const user = await getCurrentUser();
            if (user) { location.replace(next); return; }   // already signed in
        } catch (e) {
            // No server behind this page (static host / file://): say so clearly instead of a silent dead form.
            if (e && e.code === 'no-api') showError(e.message);
        }
    }
    setupGoogle();
    (mode === 'register' ? nameInput : emailInput).focus();
})();
