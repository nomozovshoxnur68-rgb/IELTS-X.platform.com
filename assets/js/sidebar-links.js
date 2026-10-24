/*
 * IELTSX вЂ” sidebar links (assets/js/sidebar-links.js)
 *
 * Every link of the sidebar is defined HERE, once, for all pages.
 * To change a link, edit its value below and save вЂ” nothing else. Links are written WITHOUT ".html" (clean URLs).
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
        // в”Ђв”Ђ brand (logo, top of the sidebar) в”Ђв”Ђ
        "brand": "/",

        // в”Ђв”Ђ full tests в”Ђв”Ђ
        "listening": "/full-tests/listening/",
        "reading": "/full-tests/reading/",
        "writing": "/full-tests/writing/",
        "speaking": "/full-tests/speaking/",

        // в”Ђв”Ђ part practice в”Ђв”Ђ
        "listening-sections": "/part/practice/listening",
        "reading-passages": "/part/practice/reading",
        "writing-tasks": "/part/practice/writing",
        "speaking-topics": "/part/practice/speaking",

        // в”Ђв”Ђ more в”Ђв”Ђ
        "predictions": "/Predictions",
        "mock-tests": "/Mock%20tests",

        // в”Ђв”Ђ study tools в”Ђв”Ђ
        "performance": "/study/Tools/Performance",
        "pdf-materials": "/study/Tools/Pdf%20materials",
        "articles": "/study/Tools/Articles",
        "vocabulary": "/vocabulary",

        // в”Ђв”Ђ account / support в”Ђв”Ђ
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


