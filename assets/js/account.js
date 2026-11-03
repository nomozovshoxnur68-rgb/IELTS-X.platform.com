/*
 * IELTSX — account page (account.html, assets/css/account.css). Everything shown comes from the server:
 * the session (site-access.js fills the name / e-mail / avatar / plan and handles "Log out"), the finished tests
 * (/api/results), the plan (/api/premium/status) and the orders (/api/orders). Nothing is made up.
 */
import { updateProfile, changePassword, resendVerification } from '../../auth.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const day = (iso) => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); };
const DAY = 86400000;

function toast(message, bad) {
    let t = $('#ix-toast');
    if (!t) {
        t = document.createElement('div'); t.id = 'ix-toast'; t.setAttribute('role', 'status');
        t.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:99999;padding:11px 14px;border-radius:10px;font:500 13px system-ui,sans-serif;color:#fff;box-shadow:0 10px 25px rgba(0,0,0,.18);transition:opacity .2s;max-width:min(380px,calc(100vw - 40px))';
        document.body.appendChild(t);
    }
    t.textContent = message; t.style.background = bad ? '#b91c1c' : '#0f172a'; t.style.opacity = '1';
    clearTimeout(toast.timer); toast.timer = setTimeout(() => { t.style.opacity = '0'; }, bad ? 4200 : 2800);
}
async function getJson(url) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
    if (!r.ok) throw Object.assign(new Error('HTTP ' + r.status), { status: r.status });
    return r.json();
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

/* avatar menu open / close (log out + account links are handled by site-access.js) */
(function menu() {
    const trigger = $('#avatar-dropdown-trigger'), dropdown = $('#user-dropdown');
    if (!trigger || !dropdown) return;
    trigger.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); });
    document.addEventListener('click', (e) => { if (!trigger.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.add('hidden'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') dropdown.classList.add('hidden'); });
})();

/* tabs (#profile #security #subscription #appearance; old links such as #invites open Profile) */
const TABS = ['profile', 'security', 'subscription', 'appearance'];
const tabBtns = $$('.acc-tab');
const panels = Object.fromEntries(TABS.map((id) => [id, $(`[data-tab-panel="${id}"]`)]));
function activateTab(id, remember) {
    if (!panels[id]) id = 'profile';
    TABS.forEach((t) => { if (panels[t]) panels[t].hidden = t !== id; });
    tabBtns.forEach((b) => { b.setAttribute('aria-selected', b.dataset.tab === id ? 'true' : 'false'); b.tabIndex = b.dataset.tab === id ? 0 : -1; });
    if (remember) history.replaceState(null, '', '#' + id);
}
tabBtns.forEach((b) => b.addEventListener('click', () => activateTab(b.dataset.tab, true)));
$('.acc-tabs')?.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = tabBtns.findIndex((b) => b.getAttribute('aria-selected') === 'true');
    const next = tabBtns[(i + (e.key === 'ArrowRight' ? 1 : tabBtns.length - 1)) % tabBtns.length];
    activateTab(next.dataset.tab, true); next.focus();
});
activateTab(location.hash.slice(1), false);
window.addEventListener('hashchange', () => activateTab(location.hash.slice(1), false));

/* the signed-in account (site-access.js sends "ieltsx:user" after every refresh) */
function showUser(u) {
    if (!u) return;
    const verified = $('#acc-verified');
    if (verified) { verified.hidden = false; verified.className = 'acc-pill ' + (u.emailVerified ? 'ok' : 'warn'); verified.textContent = u.emailVerified ? '✓ Verified' : 'Not verified'; }
    const since = $('#acc-since');
    if (since && u.createdAt && day(u.createdAt)) { since.hidden = false; since.textContent = 'Member since ' + new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }); }
    const banner = $('#acc-verify'); if (banner) banner.hidden = !!u.emailVerified;
    const up = $('#acc-upgrade');
    if (up) { up.hidden = !!u.isAdmin; const label = up.querySelector('span'); if (label) label.textContent = u.premiumActive ? 'Extend plan' : 'Upgrade'; }
}
document.addEventListener('ieltsx:user', (e) => showUser(e.detail && e.detail.user));
if (window.IELTSXUser) showUser(window.IELTSXUser);

$('#acc-verify-send')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget; btn.disabled = true;
    try {
        const r = await resendVerification();
        if (r.alreadyVerified) { toast('Your e-mail address is already confirmed.'); await window.IELTSXSiteAccess?.refresh(); }
        else toast(r.sent === false ? 'E-mail is not set up on this server yet. Please write to us to confirm your address.' : 'We sent the link again. Check your inbox (and the spam folder).', r.sent === false);
    } catch (err) { toast(err.message || 'Could not send the link. Try again later.', true); }
    finally { setTimeout(() => { btn.disabled = false; }, 4000); }
});

/* profile: save the display name */
$('#profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const first = $('[data-profile-first]')?.value.trim() || '', last = $('[data-profile-last]')?.value.trim() || '';
    const name = `${first} ${last}`.trim();
    if (!name) { toast('Please enter your name.', true); $('[data-profile-first]')?.focus(); return; }
    const btn = e.submitter || $('button[type="submit"]', e.target);
    if (btn) btn.disabled = true;
    try {
        await updateProfile(name);
        await window.IELTSXSiteAccess?.refresh();
        toast('Your details are saved.');
    } catch (err) { toast(err.message || 'Could not save your details.', true); }
    finally { if (btn) btn.disabled = false; }
});

/* security: password */
function strength(p) {
    let s = 0;
    if (p.length >= 8) s++; if (p.length >= 12) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(4, s);
}
$('#pwd-new')?.addEventListener('input', (e) => {
    const m = $('#pwd-meter'); if (!m) return;
    const v = e.target.value, s = v ? strength(v) : 0;
    m.style.width = (v ? Math.max(12, s * 25) : 0) + '%';
    m.style.background = ['#ef4444', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'][s];
});
$('#passwordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cur = $('#pwd-current').value, next = $('#pwd-new').value, again = $('#pwd-repeat').value;
    if (next.length < 8) { toast('The new password needs at least 8 characters.', true); $('#pwd-new').focus(); return; }
    if (next !== again) { toast('The two new passwords are not the same.', true); $('#pwd-repeat').focus(); return; }
    if (cur && cur === next) { toast('The new password must be different from the current one.', true); return; }
    const btn = e.submitter || $('button[type="submit"]', e.target);
    if (btn) btn.disabled = true;
    try {
        await changePassword(cur, next);
        e.target.reset(); $('#pwd-meter').style.width = '0';
        toast('Password changed. Your other devices were signed out.');
    } catch (err) { toast(err.message || 'Could not change the password.', true); }
    finally { if (btn) btn.disabled = false; }
});
(function device() {
    const ua = navigator.userAgent;
    const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /YaBrowser\//.test(ua) ? 'Yandex' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
    const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|iOS/.test(ua) ? 'iOS' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'this device';
    const el = $('#acc-device'); if (el) el.textContent = `${browser} on ${os}`;
})();

/* progress: the finished tests of this account */
const SECTION_ICON = {
    Reading: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    Listening: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    Writing: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
    Speaking: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/>'
};
const band1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
const bandClass = (b) => (b >= 7 ? 'hi' : b >= 5.5 ? 'mid' : 'lo');
function duration(sec) {
    const m = Math.round(sec / 60);
    if (m < 60) return m + ' min';
    const h = Math.floor(m / 60), r = m % 60;
    return h + ' h' + (r ? ' ' + r + ' min' : '');
}
function ago(iso) {
    const d = Date.now() - new Date(iso).getTime();
    if (!(d >= 0)) return '';
    if (d < 3600000) return Math.max(1, Math.round(d / 60000)) + ' min ago';
    if (d < DAY) return Math.round(d / 3600000) + ' h ago';
    const n = Math.round(d / DAY); return n === 1 ? 'yesterday' : n + ' days ago';
}
function set(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
(async function progress() {
    const list = $('#acc-recent');
    let results = [];
    try { results = (await getJson('/api/results')).results || []; }
    catch (e) { if (list) list.innerHTML = '<div class="acc-empty">' + (e.status === 401 ? 'Sign in to see your tests.' : 'Could not load your tests. Refresh the page to try again.') + '</div>'; return; }
    const withBand = results.filter((r) => Number.isFinite(Number(r.band)));
    set('st-tests', String(results.length));
    const week = results.filter((r) => Date.now() - new Date(r.createdAt).getTime() < 7 * DAY).length;
    set('st-tests-sub', results.length ? (week ? week + ' this week' : 'none this week') : 'Start your first test');
    if (withBand.length) {
        const avg = withBand.reduce((a, r) => a + Number(r.band), 0) / withBand.length;
        set('st-avg', band1(avg));
        const per = {};
        withBand.forEach((r) => { (per[r.section] = per[r.section] || []).push(Number(r.band)); });
        set('st-avg-sub', Object.keys(per).slice(0, 2).map((k) => `${k} ${band1(per[k].reduce((a, b) => a + b, 0) / per[k].length)}`).join(' · '));
        const best = withBand.reduce((a, r) => (Number(r.band) > Number(a.band) ? r : a));
        set('st-best', band1(Number(best.band)));
        set('st-best-sub', best.pageLabel || best.section);
    } else { set('st-avg-sub', 'after your first test'); set('st-best-sub', ' '); }
    const secs = results.reduce((a, r) => a + (Number(r.durationSec) || 0), 0);
    set('st-time', secs ? duration(secs) : '0 min');
    set('st-time-sub', results[0] ? 'last test ' + ago(results[0].createdAt) : ' ');
    if (!list) return;
    if (!results.length) {
        list.innerHTML = '<div class="acc-empty">No finished tests yet. <a href="/part/practice/reading">Try a Reading passage</a> or <a href="/part/practice/listening">a Listening section</a>.</div>';
        return;
    }
    list.innerHTML = results.slice(0, 5).map((r) => {
        const href = /^\/[^/]/.test(r.testKey || '') ? r.testKey.replace(/\.html(?=$|[?#])/, '') : '';
        const tag = href ? 'a' : 'div';
        const score = r.scoreTotal ? `${r.scoreCorrect}/${r.scoreTotal}` : '';
        const b = Number(r.band);
        return `<${tag} class="acc-item"${href ? ` href="${esc(href)}"` : ''}>` +
            `<span class="acc-item-icon ${esc(r.section)}"><svg viewBox="0 0 24 24" aria-hidden="true">${SECTION_ICON[r.section] || SECTION_ICON.Reading}</svg></span>` +
            `<span class="acc-item-main"><span class="acc-item-title" style="display:block">${esc(r.pageLabel || r.section + ' test')}</span>` +
            `<span class="acc-item-meta" style="display:block">${esc([r.section, score, day(r.createdAt)].filter(Boolean).join(' · '))}</span></span>` +
            (Number.isFinite(b) ? `<span class="acc-band ${bandClass(b)}" title="Band">${band1(b)}</span>` : '') +
            `</${tag}>`;
    }).join('');
})();

/* subscription: the plan */
(async function plan() {
    let st;
    try { st = await getJson('/api/premium/status'); } catch (e) { return; }
    if (!st || !st.authenticated) return;
    const pill = $('#plan-pill'), cta = $('#plan-cta');
    if (st.admin) {
        set('plan-name', 'Admin'); set('plan-status', 'Every test and every tool is open.');
        pill.className = 'acc-pill ok'; pill.textContent = 'Full access';
        if (cta) cta.hidden = true;
    } else if (st.premium) {
        set('plan-name', String(st.plan || 'Premium'));
        if (st.expiresAt) {
            const left = Math.ceil((new Date(st.expiresAt).getTime() - Date.now()) / DAY);
            set('plan-status', `Active until ${day(st.expiresAt)} · ${left} ${left === 1 ? 'day' : 'days'} left`);
            pill.className = 'acc-pill ' + (left <= 7 ? 'warn' : 'ok'); pill.textContent = left <= 7 ? 'Ends soon' : 'Active';
        } else { set('plan-status', 'Active · no end date'); pill.className = 'acc-pill ok'; pill.textContent = 'Active'; }
        if (cta) cta.textContent = 'Extend plan';
    } else {
        set('plan-name', 'Demo'); set('plan-status', 'Free practice tests. Choose a plan to open every test.');
        pill.className = 'acc-pill'; pill.textContent = 'Free';
        if (cta) cta.textContent = 'See plans';
    }
    if (st.quota && st.quota.limit > 0) {
        const used = Math.min(st.quota.used, st.quota.limit);
        $('#plan-meter-wrap').hidden = false; $('#plan-meter').style.width = Math.round((used / st.quota.limit) * 100) + '%';
        const q = $('#plan-quota'); q.hidden = false; q.textContent = `Tests opened with this plan: ${used} of ${st.quota.limit}`;
    }
})();

/* subscription: orders (plans bought through the Price page) */
(async function orders() {
    const list = $('#orders-list');
    if (!list) return;
    const fmt = (n, c) => `${new Intl.NumberFormat('en-US').format(n)} ${c === 'UZS' ? 'so‘m' : c}`;
    const badge = { pending: ['Waiting for payment', 'warn'], paid: ['Paid', 'ok'], rejected: ['Rejected', 'bad'], cancelled: ['Cancelled', ''] };
    async function load() {
        let data;
        try {
            data = await getJson('/api/orders');
        } catch (e) { list.innerHTML = '<div class="acc-empty">' + (e.status === 401 ? 'Sign in to see your orders.' : 'Could not load your orders.') + '</div>'; return; }
        const all = data.orders || [], contact = data.contact || '';
        if (!all.length) { list.innerHTML = '<div class="acc-empty">No orders yet. <a href="/Price">Choose a plan</a></div>'; return; }
        list.replaceChildren(...all.map((o) => {
            const [label, cls] = badge[o.status] || [o.status, ''];
            const row = document.createElement('div'); row.className = 'acc-item';
            row.innerHTML = `<span class="acc-item-main"><span class="acc-item-title" style="display:block">${esc(o.planName)} · ${esc(o.months)} ${o.months === 1 ? 'month' : 'months'} · ${esc(fmt(o.amount, o.currency))}</span>` +
                `<span class="acc-item-meta" style="display:block">${esc(o.ref)} · ${esc(day(o.createdAt))}${o.promoCode ? ` · ${esc(o.promoCode)}, you saved ${esc(fmt(o.discount, o.currency))}` : ''}</span></span><span class="acc-pill ${cls}">${esc(label)}</span>`;
            if (o.status === 'pending') {
                const actions = document.createElement('div'); actions.className = 'acc-order-actions';
                if (/^https:\/\//.test(contact)) {
                    const tg = document.createElement('a'); tg.textContent = 'Send receipt'; tg.href = `${contact}?text=${encodeURIComponent('IELTSX order ' + o.ref)}`; tg.target = '_blank'; tg.rel = 'noopener noreferrer';
                    actions.appendChild(tg);
                }
                const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = 'Cancel';
                cancel.addEventListener('click', async () => {
                    if (!confirm('Cancel order ' + o.ref + '?')) return;
                    cancel.disabled = true;
                    try {
                        const res = await fetch(`/api/orders/${encodeURIComponent(o.id)}/cancel`, { method: 'POST', credentials: 'same-origin' });
                        if (!res.ok) throw new Error('Could not cancel the order.');
                        toast('Order cancelled.');
                    } catch (err) { toast(err.message || 'Could not cancel the order.', true); cancel.disabled = false; return; }
                    load();
                });
                actions.appendChild(cancel); row.appendChild(actions);
            }
            return row;
        }));
    }
    load();
})();

/* appearance: light / dark / system (same "theme" key as the rest of the site) */
const themeOpts = $$('.theme-opt');
const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function applyTheme(theme, save) {
    const dark = theme === 'dark' || (theme === 'system' && media && media.matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('dark-mode', dark);
    if (save) { try { localStorage.setItem('theme', theme); localStorage.removeItem('cdi_reading_theme'); localStorage.removeItem('cdi_reading_theme_pref'); } catch (e) { /* ignore */ } }   // the tests follow the site again
    themeOpts.forEach((o) => o.setAttribute('aria-checked', o.getAttribute('data-theme') === theme ? 'true' : 'false'));
    if (save) document.dispatchEvent(new CustomEvent('ieltsx:themechange', { detail: { theme } }));
}
let savedTheme = 'system';
try { savedTheme = localStorage.getItem('theme') || 'system'; } catch (e) { /* ignore */ }
applyTheme(savedTheme, false);
themeOpts.forEach((o) => o.addEventListener('click', () => { savedTheme = o.getAttribute('data-theme'); applyTheme(savedTheme, true); }));
media?.addEventListener?.('change', () => { if (savedTheme === 'system') applyTheme('system', false); });
