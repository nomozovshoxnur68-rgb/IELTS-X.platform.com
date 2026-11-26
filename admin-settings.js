/*
 * IELTSX admin: Settings (admin.html#settings).
 * The panel's own settings, kept in this browser (localStorage "ix-admin-prefs"), the same way the website keeps its
 * Settings page: light / dark / system (the website's own "theme" key, so the site and the panel always agree), compact
 * rows, larger text, a folded sidebar, the NEW labels of the menu, less motion, the page the panel opens on and an
 * automatic refresh of the numbers. The settings of the website itself (locks, prices, logo, design, interfaces, menu,
 * links, music) are one click away from here; they are kept by the server and change the site for everybody.
 * The small script in the <head> of admin.html applies these classes before the first paint.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const icon = (n) => (window.IXAdminIcon ? window.IXAdminIcon(n) : '');
  const KEY = 'ix-admin-prefs';
  const DEFAULTS = { density: 'comfortable', text: 'default', sidebar: 'open', newBadges: true, motion: 'full', start: 'dashboard', refresh: 0 };
  const REFRESH = [[0, 'Off'], [60, 'Every minute'], [300, 'Every 5 minutes'], [900, 'Every 15 minutes']];

  function read() {
    let p = {}; try { p = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { p = {}; }
    return Object.assign({}, DEFAULTS, p);
  }
  function write(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* private window: this visit only */ } }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4200 : 2200); }

  /* the classes the <head> script of admin.html sets too */
  function apply(p) {
    const c = document.documentElement.classList;
    c.toggle('ad-compact', p.density === 'compact');
    c.toggle('ad-text-lg', p.text === 'large');
    c.toggle('ad-side-collapsed', p.sidebar === 'collapsed');
    c.toggle('ad-no-new', p.newBadges === false);
    c.toggle('ad-reduce-motion', p.motion === 'reduced');
    schedule(p);
  }
  function set(key, value) {
    const p = read(); p[key] = value; write(p); apply(p); render();
    // the activity chart is drawn for the width of its card
    if (key === 'sidebar' || key === 'density' || key === 'text') window.dispatchEvent(new Event('resize'));
  }

  /* automatic refresh of the numbers (dashboard, users, orders, activity): only while the tab is in front and nothing is open */
  let timer = null;
  function schedule(p) {
    clearInterval(timer); timer = null;
    const s = Number(p.refresh) || 0; if (!s) return;
    timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if ($('.modal-backdrop.open') || $('#drawer-backdrop.open')) return;
      const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && !a.closest('#view-settings')) return;
      if (window.IXAdminReload) window.IXAdminReload().catch(() => {});
    }, s * 1000);
  }

  /* ───────── the page ───────── */
  const seg = (name, value, options) => `<div class="st-opts" role="radiogroup">${options.map(([v, label, ic]) =>
    `<button type="button" role="radio" class="st-opt${String(value) === String(v) ? ' on' : ''}" aria-checked="${String(value) === String(v)}" data-st-set="${name}" data-st-val="${esc(v)}">${ic ? icon(ic) : ''}<span>${esc(label)}</span></button>`).join('')}</div>`;
  const sw = (name, on, label, hint) => `<div class="st-row"><div class="st-txt"><strong>${esc(label)}</strong><span>${esc(hint)}</span></div>
    <button type="button" class="st-switch" role="switch" aria-checked="${on ? 'true' : 'false'}" aria-label="${esc(label)}" data-st-toggle="${name}"></button></div>`;
  const SITE = [
    ['access', 'lock', 'Access (lock / plans)', 'Free or locked, and for which plan'],
    ['pricing', 'tag', 'Price control', 'Plans, prices and promo codes'],
    ['branding', 'image', 'Logo', 'The logo of every page'],
    ['design', 'palette', 'Design', 'The designs students can choose'],
    ['readingui', 'book', 'Reading interface', 'Classic or new look of the Reading tests'],
    ['listeningui', 'headphones', 'Listening interface', 'Classic or new look of the Listening tests'],
    ['sidebar', 'menu', 'Sidebar (menu)', 'The menu of the website'],
    ['links', 'link', 'Links', 'Links shown on the pages'],
    ['music', 'music', 'Music (Settings)', 'Study music of the Settings page']
  ];

  function render() {
    const mount = $('#content-settings'); if (!mount) return;
    const p = read();
    const theme = window.IXAdminTheme ? window.IXAdminTheme.get() : 'system';
    const views = window.IXAdminViews ? window.IXAdminViews() : { dashboard: 'Dashboard' };
    const me = window.IXAdminMe ? window.IXAdminMe() : null;
    const startOpts = Object.keys(views).filter((k) => k !== 'settings').map((k) => `<option value="${esc(k)}"${p.start === k ? ' selected' : ''}>${esc(views[k])}</option>`).join('');
    const refreshOpts = REFRESH.map(([s, l]) => `<option value="${s}"${Number(p.refresh) === s ? ' selected' : ''}>${esc(l)}</option>`).join('');
    mount.innerHTML = `
    <div class="dash-hero"><div><div class="eyebrow">Admin panel</div><h1>Settings</h1><p>How the admin panel looks and works for you. Kept in this browser, as the Settings page of the website.</p></div></div>
    <div class="st-wrap">
      <section class="st-card">
        <h3>Appearance</h3><p>Light, dark, or the same as your device. The website follows the same choice.</p>
        <div class="st-opts" role="radiogroup" aria-label="Theme">
          ${[['light', 'Light', 'sun'], ['dark', 'Dark', 'moon'], ['system', 'System', 'monitor']].map(([v, l, ic]) =>
            `<button type="button" role="radio" class="st-opt${theme === v ? ' on' : ''}" aria-checked="${theme === v}" data-theme-pref="${v}">${icon(ic)}<span>${l}</span></button>`).join('')}
        </div>
      </section>

      <section class="st-card">
        <h3>Layout</h3><p>Room on the page and the size of the text.</p>
        ${seg('density', p.density, [['comfortable', 'Comfortable'], ['compact', 'Compact']])}
        <div style="height:10px"></div>
        ${seg('text', p.text, [['default', 'Default text'], ['large', 'Large text']])}
        <div style="height:6px"></div>
        ${sw('sidebar', p.sidebar !== 'collapsed', 'Show the menu', 'On a wide screen. The button left of the page title folds it too.')}
        ${sw('newBadges', p.newBadges !== false, '“NEW” labels in the menu', 'The small labels next to the newest parts of the panel.')}
        ${sw('motion', p.motion === 'reduced', 'Less motion', 'No animations when pages and menus change.')}
      </section>

      <section class="st-card">
        <h3>Start and data</h3><p>Where the panel opens and how fresh its numbers are.</p>
        <div class="st-row"><div class="st-txt"><strong>Start page</strong><span>The page that opens at /admin.</span></div>
          <select class="field" data-st-select="start">${startOpts}</select></div>
        <div class="st-row"><div class="st-txt"><strong>Refresh the numbers</strong><span>Users, orders, results and the dashboard, while this tab is open.</span></div>
          <select class="field" data-st-select="refresh">${refreshOpts}</select></div>
      </section>

      <section class="st-card">
        <h3>Website settings</h3><p>Saved on the server: they change the website for every student.</p>
        <div class="st-links">${SITE.map(([v, ic, t, d]) => `<a class="st-link" href="#${v}"><span class="todo-ico">${icon(ic)}</span><span><strong>${esc(t)}</strong><span>${esc(d)}</span></span></a>`).join('')}</div>
      </section>

      <section class="st-card">
        <h3>Your account</h3><p>${me ? `${esc(me.name || '')} · ${esc(me.email || '')}` : 'The signed-in admin.'}</p>
        <div class="st-foot">
          <div class="btn-row"><a class="btn" href="/account" target="_blank" rel="noopener">${icon('users')}Account page</a><a class="btn" href="/settings" target="_blank" rel="noopener">${icon('settings')}Website Settings page</a></div>
          <div class="btn-row"><button type="button" class="btn" data-st-reset>Reset panel settings</button><button type="button" class="btn btn-danger" data-logout>${icon('logout')}Sign out</button></div>
        </div>
      </section>
    </div>`;
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-st-set],[data-st-toggle],[data-st-reset],[data-theme-pref]');
    if (!t || !t.closest('#content-settings')) {
      // the theme buttons of the header: show the choice here too
      if (t && t.hasAttribute('data-theme-pref') && $('#view-settings.active')) setTimeout(render, 0);
      return;
    }
    if (t.hasAttribute('data-theme-pref')) { setTimeout(render, 0); return; }   // admin.js saves and applies it
    if (t.hasAttribute('data-st-set')) { const k = t.dataset.stSet; set(k, t.dataset.stVal); return; }
    if (t.hasAttribute('data-st-toggle')) {
      const k = t.dataset.stToggle, p = read();
      if (k === 'sidebar') set('sidebar', p.sidebar === 'collapsed' ? 'open' : 'collapsed');
      else if (k === 'newBadges') set('newBadges', p.newBadges === false);
      else if (k === 'motion') set('motion', p.motion === 'reduced' ? 'full' : 'reduced');
      return;
    }
    if (t.hasAttribute('data-st-reset')) { write({}); apply(read()); render(); window.dispatchEvent(new Event('resize')); toast('Panel settings are back to the defaults'); }
  });
  document.addEventListener('change', (e) => {
    const el = e.target; if (!el.matches || !el.matches('[data-st-select]')) return;
    const k = el.dataset.stSelect; set(k, k === 'refresh' ? Number(el.value) || 0 : el.value);
    toast(k === 'start' ? 'The panel will open on this page' : (Number(el.value) ? 'The numbers will refresh by themselves' : 'Automatic refresh is off'));
  });
  // the fold button of the header changed the sidebar; another tab changed a setting
  window.addEventListener('ix-admin-prefs', () => { if ($('#view-settings.active')) render(); });
  window.addEventListener('storage', (e) => { if (e.key === KEY || e.key === 'theme' || e.key === null) { apply(read()); if ($('#view-settings.active')) render(); } });
  const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'settings') render(); };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('DOMContentLoaded', () => { schedule(read()); render(); });
})();
