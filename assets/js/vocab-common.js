/* IELTSX vocabulary — shared helpers: current user + per-account progress (kept in this browser). */
(function () {
  'use strict';
  var mePromise = null;
  function me() {
    if (!mePromise) mePromise = fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : { user: null }; }).then(function (d) { return d.user || null; }).catch(function () { return null; });
    return mePromise;
  }
  function key(uid) { return 'ieltsx_vocab:' + (uid || 'guest'); }
  function load(uid) { try { var d = JSON.parse(localStorage.getItem(key(uid)) || '{}'); return d && typeof d === 'object' ? d : {}; } catch (e) { return {}; } }
  function save(uid, d) { try { localStorage.setItem(key(uid), JSON.stringify(d)); } catch (e) { /* storage full or blocked */ } }
  function entry(d, id) { if (!d[id]) d[id] = { known: {}, learning: {} }; return d[id]; }
  var P = {
    me: me,
    all: function (uid) { return load(uid); },
    knownCount: function (uid, id, total) { var e = load(uid)[id]; var n = e ? Object.keys(e.known || {}).length : 0; return Math.min(n, total == null ? n : total); },
    get: function (uid, id) { var e = load(uid)[id]; return e || { known: {}, learning: {} }; },
    mark: function (uid, id, word, status) {
      var d = load(uid), e = entry(d, id), k = String(word).toLowerCase();
      if (status === 'known') { e.known[k] = 1; delete e.learning[k]; } else { e.learning[k] = 1; delete e.known[k]; }
      e.last = new Date().toISOString(); save(uid, d);
    }
  };
  window.IXVocab = P;
})();
