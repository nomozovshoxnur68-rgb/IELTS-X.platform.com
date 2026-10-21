/*
 * IELTSX — images that are missing on the server (404) no longer show a broken-image icon.
 * They are hidden, the card background / gradient stays. Safe to include on every page.
 */
(function () {
    'use strict';
    function hide(img) {
        if (!img || img.dataset.imgMissing) return;
        img.dataset.imgMissing = '1';
        img.classList.add('img-missing');
        img.style.visibility = 'hidden';
        img.removeAttribute('alt');
        if (img.parentElement) img.parentElement.classList.add('ix-thumb-fallback');
    }
    document.addEventListener('error', function (e) {
        if (e.target && e.target.tagName === 'IMG') hide(e.target);
    }, true);
    function sweep() {
        var imgs = document.images;
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].complete && imgs[i].naturalWidth === 0 && imgs[i].getAttribute('src')) hide(imgs[i]);
        }
    }
    window.addEventListener('load', sweep);
    document.addEventListener('DOMContentLoaded', sweep);
})();
