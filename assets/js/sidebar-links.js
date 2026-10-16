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
        "writing": "/part/practice/writing",
        "speaking": "/part/practice/speaking",

        // ── part practice ──
        "listening-sections": "/part/practice/listening",
        "reading-passages": "/part/practice/reading",
        "writing-tasks": "/part/practice/writing",
        "speaking-topics": "/part/practice/speaking",

        // ── more ──
        "predictions": "/Predictions",
        "mock-tests": "/Mock%20tests",

        // ── study tools ──
        "performance": "/study/Tools/Performance",
        "pdf-materials": "/study/Tools/Pdf%20materials",
        "articles": "/study/Tools/Articles",

        // ── account / support ──
        "pricing": "/Price",
        "telegram": "https://t.me/ieltsxuz",
        "support": "mailto:support@ieltsx.com",
        "feedback": "mailto:support@ieltsx.com?subject=IELTSX%20feedback",
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

    window.IELTSXLinks = { links: LINKS, apply: apply };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { apply(); });
    } else {
        apply();
    }
})();
