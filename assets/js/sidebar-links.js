/*
 * IELTSX — sidebar links (assets/js/sidebar-links.js)
 *
 * Every link of the sidebar is defined HERE, once, for all pages.
 * To change a link, edit its value below and save — nothing else. Links are written WITHOUT ".html" (clean URLs).
 *
 * How it works: each <a> in the sidebar markup has a data-link="key" attribute,
 * and this file sets that link's href from the table. (The href written inside
 * the HTML is only a fallback for when JavaScript is off.)
 *
 * Adding a new sidebar item: put data-link="my-key" on its <a> and add
 * "my-key": "/page" below.
 */
(function () {
    'use strict';

    var LINKS = {
        // ── brand (logo, top of the sidebar) ──
        "brand": "/",

        // ── full tests ──
        "listening": "/full-tests/listening/",
        "reading": "/full-tests/reading/",
        "writing": "/full-tests/writing/",
        "speaking": "/full-tests/speaking/",

        // ── part practice ──
        "listening-sections": "/part/practice/listening",
        "reading-passages": "/part/practice/reading",
        "writing-tasks": "/part/practice/writing",
        "speaking-topics": "/part/practice/speaking",

        // ── more ──
        "predictions": "/Predictions",
        "mock-tests": "/Mock%20tests",
        "game": "/game",

        // ── study tools ──
        "performance": "/study/Tools/Performance",
        "pdf-materials": "/study/Tools/Pdf%20materials",
        "articles": "/study/Tools/Articles",
        "vocabulary": "/vocabulary",
        "settings": "/settings",        // added under Study Tools by assets/js/site-design.js

        // ── account ──
        "pricing": "/Price",
        "admin-panel": "/admin"
    };

    function apply(root) {
        var anchors = (root || document).querySelectorAll('a[data-link]');
        for (var i = 0; i < anchors.length; i++) {
            var key = anchors[i].getAttribute('data-link');
            if (Object.prototype.hasOwnProperty.call(LINKS, key)) {
                anchors[i].setAttribute('href', LINKS[key]);
            }
        }
    }

    /* The "Game" item (live quiz games, /game) is added here once for every page, right under "Mock Tests":
       a copy of that item with its own link, icon and name (so it always looks like the rest of the menu). */
    var GAME_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gamepad-2"><line x1="6" x2="10" y1="11" y2="11"></line><line x1="8" x2="8" y1="9" y2="13"></line><line x1="15" x2="15.01" y1="12" y2="12"></line><line x1="18" x2="18.01" y1="10" y2="10"></line><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path></svg>';
    function addGame(root) {
        var mocks = (root || document).querySelectorAll('a[data-link="mock-tests"]');
        for (var i = 0; i < mocks.length; i++) {
            var li = mocks[i].closest('li');
            if (!li || !li.parentNode || li.parentNode.querySelector('a[data-link="game"]')) continue;
            var copy = li.cloneNode(true); var a = copy.querySelector('a');
            if (!a) continue;
            a.setAttribute('data-link', 'game'); a.setAttribute('href', LINKS.game);
            a.setAttribute('data-active', /^\/game\/?$/i.test(location.pathname) ? 'true' : 'false'); a.removeAttribute('aria-current');
            var svg = a.querySelector('svg');
            if (svg) { var tpl = document.createElement('div'); tpl.innerHTML = GAME_ICON; svg.parentNode.replaceChild(tpl.firstChild, svg); }
            var label = a.querySelector('span.flex-1') || a.querySelector('span:last-of-type');
            if (label) label.textContent = 'Game';
            li.parentNode.insertBefore(copy, li.nextSibling);
        }
    }
    try { addGame(); } catch (e) { /* the menu still works without it */ }

    window.IELTSXLinks = { links: LINKS, apply: apply, addGame: addGame };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { apply(); });
    } else {
        apply();
    }
})();


