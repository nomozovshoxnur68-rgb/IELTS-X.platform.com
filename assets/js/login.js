/*
 * IELTS X — sign in / create account (assets/js/login.js)
 * One page for both: email + password (sign in or register) and, when GOOGLE_CLIENT_ID is set
 * on the server, "Continue with Google". Works for everybody's own account; admins are just
 * accounts with the admin role.
 */
import {
    login, register, loginWithGoogle, getCurrentUser, getAuthConfig,
    getKnownAccounts, removeKnownAccount, safeNext
} from '/auth.js';

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
    if (!googleClientId) return;
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
        $('#google-block').hidden = true; // blocked or offline: email sign-in still works
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
        } catch (e) { /* offline: show the form */ }
    }
    setupGoogle();
    (mode === 'register' ? nameInput : emailInput).focus();
})();
