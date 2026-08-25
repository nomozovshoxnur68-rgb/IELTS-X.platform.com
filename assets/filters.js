
(function () {
  'use strict';

  function norm(v) {
    return String(v || '').trim().toLowerCase();
  }

  function getText(el) {
    return norm(el ? el.textContent : '');
  }

  function findItems() {
    var selectors = [
      '[data-test-card]', '[data-test]', '[data-passage]', '[data-task]',
      '.test-card', '.test-item', '.practice-card', '.practice-item',
      'article[data-id]', 'li[data-id]'
    ];
    var found = [];
    selectors.forEach(function (s) {
      document.querySelectorAll(s).forEach(function (el) {
        if (found.indexOf(el) === -1) found.push(el);
      });
    });
    return found;
  }

  function applyFilters() {
    var items = findItems();
    if (!items.length) return;

    var controls = document.querySelectorAll(
      'select, [data-filter], [data-filter-type], [role="combobox"], input[type="search"]'
    );

    var values = {};
    controls.forEach(function (c) {
      var key = c.getAttribute('data-filter') ||
                c.getAttribute('data-filter-type') ||
                c.getAttribute('name') ||
                c.id || '';
      if (key) values[norm(key)] = norm(c.value || c.getAttribute('data-value') || '');
    });

    var search = '';
    controls.forEach(function(c) {
      if ((c.type || '').toLowerCase() === 'search') search = norm(c.value);
    });

    var visible = 0;

    items.forEach(function(item) {
      var text = getText(item);
      var ok = true;

      if (search && text.indexOf(search) === -1) ok = false;

      Object.keys(values).forEach(function(key) {
        var val = values[key];
        if (!val || val === 'all' || val === 'all status' || val === 'all types' ||
            val === 'all plans' || val === 'all packs' || val === 'all passages' ||
            val === 'all tasks' || val === 'all sections') return;

        var attr = item.getAttribute('data-' + key) ||
                   item.getAttribute('data-filter-' + key) || '';
        var hay = norm(attr || text);

        if (hay.indexOf(val) === -1) ok = false;
      });

      item.hidden = !ok;
      item.style.display = ok ? '' : 'none';
      if (ok) visible++;
    });

    document.querySelectorAll('[data-filter-count], .filter-count, [data-showing-count]')
      .forEach(function(el) {
        el.textContent = String(visible);
      });
  }

  function wire() {
    document.addEventListener('change', function(e) {
      if (e.target.matches('select, [data-filter], [data-filter-type], [role="combobox"], input[type="search"]')) {
        applyFilters();
      }
    });

    document.addEventListener('input', function(e) {
      if (e.target.matches('input[type="search"], [data-filter-search]')) {
        applyFilters();
      }
    });

    document.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-filter-option], [data-value], button, [role="option"]');
      if (!btn) return;

      var label = norm(btn.textContent);
      var allLabels = [
        'all status','all types','all plans','all packs',
        'all passages','all tasks','all sections'
      ];

      if (allLabels.indexOf(label) !== -1) {
        var parent = btn.closest('[data-filter], [data-filter-type], .dropdown, .select, [role="listbox"]');
        if (parent) {
          var target = parent.querySelector('select');
          if (target) {
            target.value = 'all';
            target.dispatchEvent(new Event('change', {bubbles:true}));
          }
        }
      }

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
