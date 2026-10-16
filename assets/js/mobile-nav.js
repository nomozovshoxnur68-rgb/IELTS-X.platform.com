/*
 * IELTSX — mobile navigation drawer (assets/js/mobile-nav.js)
 * On phones the desktop sidebar is hidden, so the "Toggle Sidebar" button had nothing to open.
 * This turns that same button into a slide-in menu on screens narrower than 768px: it copies the
 * current sidebar (so links, plan label and the dark theme always match) into a drawer.
 * Closes with the backdrop, the × button, the Escape key or by choosing a link.
 */
(function () {
    'use strict';
    var mq = window.matchMedia ? window.matchMedia('(max-width: 767px)') : { matches: false };
    var drawer = null, lastFocus = null;

    var CSS = `/* ==== mobile navigation drawer (assets/js/mobile-nav.js) ==== */
html.ix-drawer-open { overflow: hidden; }
.ix-drawer { position: fixed; inset: 0; z-index: 1000; }
.ix-drawer-backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.5); opacity: 0; transition: opacity 0.2s ease; }
.ix-drawer-panel {
    position: absolute; top: 0; bottom: 0; left: 0; width: min(18rem, 86vw);
    display: flex; flex-direction: column; overflow: hidden;
    background: hsl(var(--sidebar, 0 0% 98%)); color: hsl(var(--sidebar-foreground, 240 5% 26%));
    border-right: 1px solid hsl(var(--sidebar-border, 220 13% 91%));
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.35);
    padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px);
    transform: translateX(-100%); transition: transform 0.2s ease;
}
.ix-drawer.show .ix-drawer-backdrop { opacity: 1; }
.ix-drawer.show .ix-drawer-panel { transform: none; }
.ix-drawer-body { flex: 1; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.ix-drawer-body > * { width: 100% !important; min-height: 100%; height: auto !important; border-right: 0 !important; }
.ix-drawer-close {
    position: absolute; top: 0.6rem; right: 0.6rem; z-index: 2; width: 2rem; height: 2rem; display: inline-flex;
    align-items: center; justify-content: center; border: 0; border-radius: 0.5rem; background: transparent; color: inherit; cursor: pointer;
}
.ix-drawer-close:hover, .ix-drawer-close:focus-visible { background: hsl(var(--sidebar-accent, 240 5% 96%)); outline: none; }
@media (prefers-reduced-motion: reduce) { .ix-drawer-backdrop, .ix-drawer-panel { transition: none; } }
@media (min-width: 768px) { .ix-drawer { display: none !important; } }
`;
    function ensureStyle() {
        if (document.getElementById('ix-drawer-style')) return;
        var st = document.createElement('style'); st.id = 'ix-drawer-style'; st.textContent = CSS; document.head.appendChild(st);
    }

    function sourceSidebar() {
        var el = document.querySelector('#main-sidebar-root [data-sidebar="sidebar"]') || document.querySelector('[data-sidebar="sidebar"]');
        return el ? (el.firstElementChild || el) : null;
    }

    function build() {
        var src = sourceSidebar();
        if (!src) return null;
        ensureStyle();
        var root = document.createElement('div');
        root.className = 'ix-drawer';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', 'Menu');

        var backdrop = document.createElement('div');
        backdrop.className = 'ix-drawer-backdrop';
        backdrop.addEventListener('click', close);

        var panel = document.createElement('div');
        panel.className = 'ix-drawer-panel';

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'ix-drawer-close';
        closeBtn.setAttribute('aria-label', 'Close menu');
        closeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
        closeBtn.addEventListener('click', close);

        var body = document.createElement('div');
        body.className = 'ix-drawer-body group';
        body.setAttribute('data-collapsible', '');
        var clone = src.cloneNode(true);
        clone.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
        body.appendChild(clone);
        if (window.IELTSXLinks && window.IELTSXLinks.apply) window.IELTSXLinks.apply(body);
        body.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a[href]')) close(); });

        var cs = getComputedStyle(src), bgc = cs.backgroundColor;
        if (bgc && bgc !== 'rgba(0, 0, 0, 0)') panel.style.background = bgc;
        panel.style.color = cs.color;
        panel.appendChild(closeBtn);
        panel.appendChild(body);
        root.appendChild(backdrop);
        root.appendChild(panel);
        return root;
    }

    function open() {
        if (drawer) return;
        drawer = build();
        if (!drawer) return;
        lastFocus = document.activeElement;
        document.body.appendChild(drawer);
        document.documentElement.classList.add('ix-drawer-open');
        // next frame, so the slide-in transition runs
        requestAnimationFrame(function () { requestAnimationFrame(function () { if (drawer) drawer.classList.add('show'); }); });
        var first = drawer.querySelector('.ix-drawer-close');
        if (first) first.focus();
        document.addEventListener('keydown', onKey, true);
    }

    function close() {
        if (!drawer) return;
        var d = drawer; drawer = null;
        d.classList.remove('show');
        document.documentElement.classList.remove('ix-drawer-open');
        document.removeEventListener('keydown', onKey, true);
        setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 220);
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* element gone */ } }
    }

    function onKey(e) {
        if (!drawer) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); return; }
        if (e.key !== 'Tab') return;
        var items = drawer.querySelectorAll('a[href], button:not([disabled])');
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    // capture phase: on phones this wins over the desktop "collapse" handler of the page
    document.addEventListener('click', function (e) {
        var t = e.target && e.target.closest ? e.target.closest('[data-sidebar="trigger"]') : null;
        if (!t || !mq.matches) return;
        e.preventDefault();
        e.stopPropagation();
        if (drawer) close(); else open();
    }, true);

    if (mq.addEventListener) mq.addEventListener('change', function (ev) { if (!ev.matches) close(); });
    window.addEventListener('pagehide', close);
})();
