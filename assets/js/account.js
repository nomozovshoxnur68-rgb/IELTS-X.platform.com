/*
 * IELTSX — account page (account.html). Real behaviour, no demo alerts:
 * the name is saved on the server, the e-mail comes from your session, sign out is real
 * (site-access.js fills in the name / e-mail / avatar / plan and handles "Log out").
 */
import { updateProfile } from '../../auth.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function toast(message, bad) {
    let t = $('#ix-toast');
    if (!t) {
        t = document.createElement('div'); t.id = 'ix-toast'; t.setAttribute('role', 'status');
        t.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:99999;padding:11px 14px;border-radius:10px;font:500 13px system-ui,sans-serif;color:#fff;box-shadow:0 10px 25px rgba(0,0,0,.18);transition:opacity .2s';
        document.body.appendChild(t);
    }
    t.textContent = message; t.style.background = bad ? '#b91c1c' : '#0f172a'; t.style.opacity = '1';
    clearTimeout(toast.timer); toast.timer = setTimeout(() => { t.style.opacity = '0'; }, 2600);
}

/* sidebar */
const sidebarPanel = $('#sidebar-panel'), sidebarBtn = $('#sidebar-toggle-btn');
try { if (localStorage.getItem('ix-sidebar') === 'collapsed') sidebarPanel?.classList.add('sidebar-collapsed'); } catch (e) { /* ignore */ }
sidebarBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const collapsed = sidebarPanel?.classList.toggle('sidebar-collapsed');
    sidebarBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    try { localStorage.setItem('ix-sidebar', collapsed ? 'collapsed' : 'open'); } catch (err) { /* ignore */ }
});

/* tabs */
const tabBtns = $$('.tab-btn');
const panels = Object.fromEntries(['profile', 'appearance', 'subscription', 'invites'].map((id) => [id, $(`[data-tab-panel="${id}"]`)]));
function activateTab(id) {
    Object.values(panels).forEach((p) => p?.classList.add('hidden'));
    panels[id]?.classList.remove('hidden');
    tabBtns.forEach((b) => b.setAttribute('data-active', b.getAttribute('data-tab') === id ? 'true' : 'false'));
}
tabBtns.forEach((b) => b.addEventListener('click', () => { const id = b.getAttribute('data-tab'); if (id && panels[id]) activateTab(id); }));
activateTab(panels[location.hash.slice(1)] ? location.hash.slice(1) : 'profile');

/* profile: save the display name */
$('#profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const first = $('[data-profile-first]')?.value.trim() || '', last = $('[data-profile-last]')?.value.trim() || '';
    const name = `${first} ${last}`.trim();
    if (!name) return toast('Please enter your name.', true);
    const btn = e.submitter || $('button[type="submit"]', e.target);
    if (btn) btn.disabled = true;
    try {
        await updateProfile(name);
        await window.IELTSXSiteAccess?.refresh();
        toast('Profile saved');
    } catch (err) { toast(err.message || 'Could not save your profile.', true); }
    finally { if (btn) btn.disabled = false; }
});

/* this device (instead of made-up sessions) */
(function sessions() {
    const card = $$('.rounded-xl').find((c) => /Active Sessions/.test(c.textContent) && c.querySelector('.space-y-3'));
    const rows = card ? $$('.space-y-3 > div', card) : [];
    if (rows.length < 2) return;
    const ua = navigator.userAgent;
    const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
    const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|iOS/.test(ua) ? 'iOS' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'this device';
    rows[0].remove();
    const title = rows[1].querySelector('p.font-medium'), when = rows[1].querySelector('p.text-xs');
    if (title) title.firstChild.textContent = `${browser} - ${os} `;
    if (when) when.textContent = 'Active now';
})();

/* avatar menu open / close (log out + account links are handled by site-access.js) */
(function menu() {
    const trigger = $('#avatar-dropdown-trigger'), dropdown = $('#user-dropdown');
    if (!trigger || !dropdown) return;
    trigger.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); });
    document.addEventListener('click', (e) => { if (!trigger.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.add('hidden'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') dropdown.classList.add('hidden'); });
})();

/* invites */
const copyBtn = $('#copyInviteLink'), inviteInput = $('#invite-link-input');
copyBtn?.addEventListener('click', async () => {
    if (!inviteInput) return;
    try { await navigator.clipboard.writeText(inviteInput.value); } catch (e) { inviteInput.select(); document.execCommand('copy'); }
    toast('Invite link copied');
});
const SHARE = {
    telegram: (u) => `https://t.me/share/url?url=${u}`, whatsapp: (u) => `https://wa.me/?text=${u}`,
    facebook: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`, twitter: (u) => `https://twitter.com/intent/tweet?url=${u}`, x: (u) => `https://twitter.com/intent/tweet?url=${u}`
};
$$('.share-social').forEach((b) => b.addEventListener('click', async () => {
    const url = encodeURIComponent(inviteInput?.value || location.origin);
    const build = SHARE[String(b.getAttribute('data-platform') || '').toLowerCase()];
    if (build) window.open(build(url), '_blank', 'noopener,noreferrer');
    else { try { await navigator.clipboard.writeText(inviteInput?.value || location.origin); toast('Link copied'); } catch (e) { toast('Copy the link from the box above', true); } }
}));

/* theme: light / dark / system (same "theme" key as the rest of the site) */
const themeOpts = $$('.theme-opt');
const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function applyTheme(theme, save) {
    const dark = theme === 'dark' || (theme === 'system' && media && media.matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('dark-mode', dark);
    if (save) { try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ } }
    themeOpts.forEach((o) => o.classList.toggle('bg-muted', o.getAttribute('data-theme') === theme));
    themeOpts.forEach((o) => o.classList.toggle('text-foreground', o.getAttribute('data-theme') === theme));
}
let savedTheme = 'system';
try { savedTheme = localStorage.getItem('theme') || 'system'; } catch (e) { /* ignore */ }
applyTheme(savedTheme, false);
themeOpts.forEach((o) => o.addEventListener('click', () => { savedTheme = o.getAttribute('data-theme'); applyTheme(savedTheme, true); }));
media?.addEventListener?.('change', () => { if (savedTheme === 'system') applyTheme('system', false); });

/* buttons that used to say "(demo)" */
$('#exam-style-btn')?.addEventListener('click', (e) => {
    const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', on ? 'true' : 'false');
    try { localStorage.setItem('ieltsx_exam_style', on ? 'bc' : 'idp'); } catch (err) { /* ignore */ }
    toast(on ? 'Exam style: British Council' : 'Exam style: IDP');
});
$('#learning-stats-btn')?.addEventListener('click', () => { location.href = '/study/Tools/Performance'; });
$$('.bg-blue-600, .border-blue-300, .bg-primary\\/5 button, .bg-gradient-to-r button').forEach((btn) => {
    if (btn.tagName === 'BUTTON') btn.addEventListener('click', () => { location.href = '/Price'; });
});


/* orders (plans bought through the pricing page) */
(async function orders() {
    const list = $('#orders-list');
    if (!list) return;
    const fmt = (n, c) => `${new Intl.NumberFormat('en-US').format(n)} ${c === 'UZS' ? 'uzs' : c}`;
    const badge = { pending: 'Waiting for payment', paid: 'Paid', rejected: 'Rejected', cancelled: 'Cancelled' };
    async function load() {
        try {
            const r = await fetch('/api/orders', { credentials: 'same-origin', cache: 'no-store' });
            if (r.status === 401) { list.textContent = 'Sign in to see your orders.'; return; }
            const { orders, contact } = await r.json();
            if (!orders.length) { list.textContent = 'No orders yet.'; return; }
            list.replaceChildren(...orders.map((o) => {
                const row = document.createElement('div');
                row.className = 'flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3';
                const left = document.createElement('div');
                const t = document.createElement('div'); t.className = 'font-medium'; t.textContent = `${o.planName} · ${o.months} ${o.months === 1 ? 'month' : 'months'} · ${fmt(o.amount, o.currency)}`;
                const s = document.createElement('div'); s.className = 'text-xs text-muted-foreground'; s.textContent = `${o.ref} · ${badge[o.status] || o.status} · ${new Date(o.createdAt).toLocaleDateString()}`;
                left.append(t, s); row.appendChild(left);
                if (o.status === 'pending') {
                    const actions = document.createElement('div'); actions.className = 'flex gap-2';
                    const tg = document.createElement('a'); tg.textContent = 'Send receipt'; tg.href = `${contact}?text=${encodeURIComponent('IELTSX order ' + o.ref)}`; tg.target = '_blank'; tg.rel = 'noopener noreferrer'; tg.className = 'text-sm underline underline-offset-4';
                    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = 'Cancel'; cancel.className = 'text-sm text-muted-foreground underline underline-offset-4';
                    cancel.addEventListener('click', async () => {
                        cancel.disabled = true;
                        try {
                            const res = await fetch(`/api/orders/${encodeURIComponent(o.id)}/cancel`, { method: 'POST', credentials: 'same-origin' });
                            if (!res.ok) throw new Error('Could not cancel the order.');
                        } catch (err) { toast(err.message || 'Could not cancel the order.', true); cancel.disabled = false; return; }
                        load();
                    });
                    actions.append(tg, cancel); row.appendChild(actions);
                }
                return row;
            }));
        } catch (e) { list.textContent = 'Could not load your orders.'; }
    }
    load();
})();
