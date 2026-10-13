/* IELTS X — forgot password, reset password and email verification pages */
import { requestPasswordReset, resetPassword, verifyEmail, safeNext } from '/auth.js';

const $ = (s) => document.querySelector(s);
const page = document.body.dataset.page;
const params = new URLSearchParams(location.search);
const showError = (m) => { const e = $('#error'); if (e) e.textContent = m || ''; };

if (page === 'forgot') {
    $('#form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = $('#email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Please enter a valid email address.');
        showError(''); $('#submit').disabled = true;
        try {
            await requestPasswordReset(email);
            const done = $('#done'); done.hidden = false;
            done.textContent = 'If an account exists for this email, a reset link is on its way. It works for one hour.';
        } catch (err) { showError(err.message); $('#submit').disabled = false; }
    });
}

if (page === 'reset') {
    const token = params.get('token') || '';
    if (!token) showError('This reset link is incomplete. Request a new one.');
    const pw = $('#password');
    $('#toggle-pw').addEventListener('click', (e) => {
        const show = pw.type === 'password';
        pw.type = show ? 'text' : 'password';
        e.currentTarget.textContent = show ? 'Hide' : 'Show';
        e.currentTarget.setAttribute('aria-pressed', show ? 'true' : 'false');
    });
    $('#form').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!token) return;
        if (pw.value.length < 8) return showError('Password must be at least 8 characters.');
        if (pw.value !== $('#password2').value) return showError('The two passwords do not match.');
        showError(''); $('#submit').disabled = true;
        try { await resetPassword(token, pw.value); location.replace(safeNext('/index.html')); }
        catch (err) { showError(err.message); $('#submit').disabled = false; }
    });
}

if (page === 'verify') {
    (async () => {
        const token = params.get('token') || '';
        try {
            if (!token) throw new Error('This verification link is incomplete.');
            await verifyEmail(token);
            $('#title').textContent = 'Email verified';
            $('#message').textContent = 'Thank you! Your email address is confirmed.';
        } catch (err) {
            $('#title').textContent = 'Could not verify';
            $('#message').textContent = err.message + ' You can ask for a new link from the banner at the top of any page after signing in.';
        }
        $('#go').style.display = 'block';
    })();
}
