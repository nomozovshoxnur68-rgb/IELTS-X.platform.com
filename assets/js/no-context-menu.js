/*
 * IELTSX — no right-click menu anywhere on the site (it offered "Save as", "View page source",
 * "Inspect" and "Copy" over the test content). Text fields keep theirs, so typing an answer
 * or filling a form still has paste and spell-check.
 * Loaded on every page: imported by site-access.js, or with its own <script> tag on the pages
 * that do not load site-access.js. Running it twice is harmless.
 */
(function () {
  'use strict';
  if (window.__ixNoContextMenu) return;
  window.__ixNoContextMenu = true;
  document.addEventListener('contextmenu', function (e) {
    var t = e.target;
    var el = t && t.nodeType === 1 ? t : t && t.parentElement;
    if (el && el.closest && el.closest('input, textarea, [contenteditable=""], [contenteditable="true"]')) return;
    e.preventDefault();
  }, true);
})();
