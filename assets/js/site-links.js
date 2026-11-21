/*
 * IELTSX — the link rules of Admin → Links (assets/js/site-links.js; loaded on every page by assets/js/loading.js).
 * The admin writes "old link → new link" (panels.js keeps them, GET /api/links lists the active ones):
 *   - every <a href> of the page that points at an old link gets the new one (also links added later by the page's own
 *     scripts: the menu, the Telegram button of the Price page …). The query and #part of a link are kept.
 *   - a page address of this site (/old-page) that is visited opens the new address instead (also from a 404 page)
 *   - "https://t.me/old*" (a star at the end) changes every link that starts like that
 * Matching ignores http/https, "www.", a trailing slash, ".html" and capital letters. The last list is kept on this device
 * (localStorage "ix-links") and asked again once a minute at most, so pages never wait for it.
 */
(function () {
  'use strict';
  if (window.IXLinks || /^\/(?:admin|api)(?:[/.]|$)/i.test(location.pathname)) return;
  var KEY = 'ix-links', HOPS = 'ix-links-hops';
  var parse = function (h) { try { return new URL(h, location.href); } catch (e) { return null; } };
  function keyOf(u) {
    if (u.protocol === 'mailto:' || u.protocol === 'tel:') { var x = u.pathname; try { x = decodeURIComponent(x); } catch (e) { /* keep */ } return u.protocol + x.replace(/\s+/g, '').toLowerCase(); }
    if (!/^https?:$/.test(u.protocol)) return '';
    var p = u.pathname; try { p = decodeURIComponent(p); } catch (e) { /* keep */ }
    p = p.replace(/\.html$/i, '').replace(/\/index$/i, '/').replace(/\/+$/, '') || '/';
    return (u.origin === location.origin ? '' : u.host.toLowerCase().replace(/^www\./, '')) + p.toLowerCase();
  }
  var compiled = [];
  function compile(rules) {
    compiled = (rules || []).map(function (r) {
      var from = String(r.from || '').trim(), prefix = /\*$/.test(from); if (prefix) from = from.replace(/\*+$/, '');
      var u = parse(from); if (!u || !r.to) return null;
      var k = keyOf(u); if (!k) return null;
      var q = u.search.toLowerCase();
      return { key: k + (prefix ? '' : q), hasQuery: !!q && !prefix, prefix: prefix, internal: /^\//.test(from), to: String(r.to).replace(/\*+$/, '') };
    }).filter(Boolean);
  }
  function find(u) {
    var k = keyOf(u); if (!k) return null;
    var full = k + u.search.toLowerCase();
    for (var i = 0; i < compiled.length; i++) {
      var r = compiled[i];
      if (r.prefix ? full.indexOf(r.key) === 0 : (r.hasQuery ? full === r.key : k === r.key)) return r;
    }
    return null;
  }
  function target(r, u) {
    var to = r.to;
    if (!r.hasQuery && to.indexOf('?') < 0 && u.search && !r.prefix) to += u.search;   // ?text=… of a Telegram link, ?next=… of a page
    if (to.indexOf('#') < 0 && u.hash) to += u.hash;
    return to;
  }

  /* the links of the page */
  function fix(a) {
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(?:javascript|data):/i.test(h) || a.__ixLink === h) return;
    var u = parse(h); if (!u) return;
    var r = find(u); if (!r) return;
    var nh = target(r, u);
    if (nh && nh !== h) { a.__ixLink = nh; a.setAttribute('href', nh); relabel(a, h, nh); }
  }
  /* a link whose text is the old address itself ("@sh7595", "support@ieltsx.com", "t.me/old") shows the new one */
  var bare = function (s) { return String(s || '').split(/[?#]/)[0].replace(/^(?:https?:\/\/(?:www\.)?|mailto:|tel:)/i, '').replace(/\/+$/, ''); };
  var handle = function (s) { var m = /t\.me\/([^/?#]+)/i.exec(String(s || '')); return m ? m[1] : ''; };
  function relabel(a, oldHref, newHref) {
    if (a.children.length) return;
    var txt = (a.textContent || '').trim(); if (!txt) return;
    if (txt === oldHref) a.textContent = newHref;
    else if (txt.replace(/\/+$/, '').toLowerCase() === bare(oldHref).toLowerCase()) a.textContent = bare(newHref);
    else if (handle(oldHref) && handle(newHref) && txt.toLowerCase() === '@' + handle(oldHref).toLowerCase()) a.textContent = '@' + handle(newHref);
  }
  function fixAll(root) {
    if (!compiled.length) return;
    var list = (root || document).querySelectorAll ? (root || document).querySelectorAll('a[href]') : [];
    for (var i = 0; i < list.length; i++) fix(list[i]);
    if (root && root.tagName === 'A' && root.hasAttribute('href')) fix(root);
  }
  /* this page itself: an old address of the site opens the new one (never more than 3 hops in a row: no loops) */
  function redirect() {
    var u = parse(location.href); if (!u) return false;
    var r = find(u); if (!r || !r.internal) return false;
    var to = target(r, u); var t = parse(to);
    if (!t || (t.origin === location.origin && keyOf(t) === keyOf(u) && t.search === u.search)) return false;
    var hops = 0; try { var hv = JSON.parse(sessionStorage.getItem(HOPS) || 'null'); hops = hv && Date.now() - hv.t < 5000 ? hv.n : 0; sessionStorage.setItem(HOPS, JSON.stringify({ n: hops + 1, t: Date.now() })); } catch (e) { /* private mode */ }
    if (hops >= 3) return false;
    location.replace(to);
    return true;
  }

  var cached = null;
  try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { cached = null; }
  if (cached && Array.isArray(cached.rules)) { compile(cached.rules); if (redirect()) return; }
  var observer = null;
  function watch() {
    if (observer || !window.MutationObserver || !compiled.length) return;
    observer = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'attributes') { if (m.target.tagName === 'A') fix(m.target); }
        else for (var j = 0; j < m.addedNodes.length; j++) { var n = m.addedNodes[j]; if (n.nodeType === 1) fixAll(n); }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
  }
  function ready() { fixAll(document); watch(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();

  var fresh = cached && cached.t && Date.now() - cached.t < 60000 && Date.now() >= cached.t;
  if (!fresh && window.fetch) {
    fetch('/api/links', { credentials: 'omit', headers: { accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !Array.isArray(d.rules)) return;
        var same = cached && JSON.stringify(cached.rules) === JSON.stringify(d.rules);
        try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), rules: d.rules })); } catch (e) { /* blocked */ }
        if (same) return;
        compile(d.rules);
        if (redirect()) return;
        if (document.readyState !== 'loading') { fixAll(document); watch(); }
      })
      .catch(function () { /* offline: the links of the page stay */ });
  }
  window.IXLinks = { find: function (h) { var u = parse(h); var r = u && find(u); return r ? target(r, u) : null; }, apply: fixAll };
})();
