/*
 * IELTSX — shared filter helper (assets/filters.js)
 *
 * Same public functions as before: norm, getText, findItems, applyFilters,
 * wire and window.IELTSXFilters.refresh — now adapted to the real markup of
 * this site:
 *   grids     : #card-grid (listening, reading), #cardsGrid (speaking, writing),
 *               #articlesGrid (articles)
 *   dropdowns : .filter-trigger[data-filter] + .trigger-label  (listening, reading)
 *   selects   : #partFilter, #taskFilter, #statusFilter, #typeFilter,
 *               #planFilter, #packFilter  (speaking, writing)
 *   search    : #search-input / #searchInput (+ #search-btn / #searchBtn)
 *   hiding    : the site's own .card-hidden class
 *
 * Pages that ship their own filter + pagination engine (data-page-script)
 * stay in full control of their cards, so this helper never touches them
 * (otherwise it would break their pagination). On any other page that has a
 * card grid it filters the cards itself.
 */
(function () {
  'use strict';

  var HIDDEN_CLASS = 'card-hidden';
  var GRID_SELECTORS = ['#card-grid', '#cardsGrid', '#articlesGrid'];
  var CARD_SELECTORS = [
    '[data-test-card]', '[data-test]', '[data-passage]', '[data-task]',
    '.test-card', '.test-item', '.practice-card', '.practice-item',
    'article[data-id]', 'li[data-id]'
  ];
  var SEARCH_SELECTOR = '#search-input, #searchInput, input[type="search"]';
  var CONTROL_SELECTOR = '.filter-trigger[data-filter], select[id$="Filter"], ' + SEARCH_SELECTOR;
  var ALL_LABELS = [
    'all', 'all status', 'all types', 'all plans', 'all packs',
    'all passages', 'all tasks', 'all sections', 'all parts'
  ];

  function norm(v) {
    return String(v || '').trim().toLowerCase();
  }

  function getText(el) {
    return norm(el ? el.textContent : '');
  }

  function isAll(val) {
    return !val || ALL_LABELS.indexOf(val) !== -1;
  }

  // The page's own script owns filtering + pagination -> stay passive.
  function pageOwnsFiltering() {
    return !!document.querySelector('script[data-page-script]');
  }

  function findItems() {
    var found = [];
    function add(el) {
      if (el && found.indexOf(el) === -1) found.push(el);
    }
    GRID_SELECTORS.forEach(function (sel) {
      var grid = document.querySelector(sel);
      if (!grid) return;
      Array.prototype.forEach.call(grid.children, function (child) {
        if (!child.classList.contains('empty-message')) add(child);
      });
    });
    CARD_SELECTORS.forEach(function (s) {
      document.querySelectorAll(s).forEach(add);
    });
    return found;
  }

  // Values a card exposes (data-* first, then the badges the site renders).
  function getItemValue(item, key) {
    var attr = item.getAttribute('data-' + key) || item.getAttribute('data-filter-' + key);
    if (attr) return [norm(attr)];

    if (key === 'status') {
      var s = item.querySelector('.absolute.top-3.left-3 .inline-flex');
      return s ? [getText(s)] : [];
    }
    if (key === 'section' || key === 'part' || key === 'passage' || key === 'task') {
      var r = item.querySelector('.absolute.top-3.right-3 .inline-flex');
      return r ? [getText(r)] : [];
    }
    if (key === 'type') {
      var types = [];
      item.querySelectorAll('.flex.flex-wrap.gap-1 .inline-flex').forEach(function (t) {
        types.push(getText(t));
      });
      return types;
    }
    return null; // plan / pack etc. are not printed on the cards
  }

  function readControls() {
    var values = {};
    var search = '';

    document.querySelectorAll(CONTROL_SELECTOR).forEach(function (c) {
      if (c.matches(SEARCH_SELECTOR)) {
        search = norm(c.value);
        return;
      }
      var key, val;
      if (c.tagName === 'SELECT') {
        key = norm(c.id.replace(/Filter$/, ''));
        val = norm(c.value);
      } else {
        key = norm(c.getAttribute('data-filter'));
        var label = c.querySelector('.trigger-label');
        val = norm(label ? label.textContent : c.getAttribute('data-value'));
      }
      if (key) values[key] = val;
    });

    return { values: values, search: search };
  }

  function applyFilters() {
    var items = findItems();
    if (!items.length) return;
    if (pageOwnsFiltering()) return;

    var state = readControls();
    var visible = 0;

    items.forEach(function (item) {
      var ok = true;

      if (state.search && getText(item).indexOf(state.search) === -1) ok = false;

      Object.keys(state.values).forEach(function (key) {
        var val = state.values[key];
        if (isAll(val)) return;
        var have = getItemValue(item, key);
        if (have === null) return;
        if (have.indexOf(val) === -1) ok = false;
      });

      item.hidden = !ok;
      item.classList.toggle(HIDDEN_CLASS, !ok);
      if (ok) visible++;
    });

    document.querySelectorAll('[data-filter-count], .filter-count, [data-showing-count]')
      .forEach(function (el) {
        el.textContent = String(visible);
      });

    var counter = document.getElementById('result-count') || document.getElementById('resultCount');
    if (counter) counter.textContent = 'Showing ' + visible + ' of ' + items.length + ' tests';
  }

  function wire() {
    document.addEventListener('change', function (e) {
      if (e.target.matches && e.target.matches(CONTROL_SELECTOR)) applyFilters();
    });

    document.addEventListener('input', function (e) {
      if (e.target.matches && e.target.matches(SEARCH_SELECTOR + ', [data-filter-search]')) applyFilters();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.matches && e.target.matches(SEARCH_SELECTOR)) applyFilters();
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-option, #search-btn, #searchBtn, [data-filter-option]');
      if (!btn) return;
      // let the dropdown update its label first, then re-read the controls
      setTimeout(applyFilters, 0);
    });

    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  window.IELTSXFilters = {
    refresh: applyFilters
  };
})();
