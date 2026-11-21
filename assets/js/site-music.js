/*
 * IELTSX — study music (assets/js/site-music.js). Loaded by assets/js/site-design.js on the ordinary pages only (never on
 * a test or exam page, so it can never play over a Listening recording).
 *   - the Settings page (#ixs-music): the list of tracks made in the admin panel (admin.html#music, GET /api/panels/music),
 *     a switch, play / pause, next, volume
 *   - every ordinary page: when the music is on, a small player at the bottom left keeps the track going from where it was
 *     (a browser may ask for one click before it plays again on a new page; the player then shows ▶)
 * The choice stays on this device (localStorage "ix-music"). A locked track (a higher plan) arrives without its file and
 * cannot be played. The music pauses by itself while a video of the Videos page or any other sound of the page plays.
 */
(function () {
  'use strict';
  if (window.IXMusic) return;
  var TEST_PAGE = /^\/(full-tests\/[^/]+\/test-|pessages?\/|sections\/test-|full-mock\/|exam\/|writing\/|listening\/|test(\.html)?(\/|$)|game|admin)/i;
  if (TEST_PAGE.test(location.pathname)) return;
  var doc = document;
  var KEY = 'ix-music', TRACKS_KEY = 'ix-music-tracks';
  var onSettings = /^\/settings(\.html)?\/?$/i.test(location.pathname);
  var PLAN = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var IC = {
    play: '<polygon points="6 3 20 12 6 21 6 3"/>', pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    next: '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>', x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>', lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    vol: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/>'
  };
  var svg = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var safeSrc = function (u) { u = String(u || ''); return /^(https:\/\/|\/(?:uploads|api\/media|assets)\/)/i.test(u) ? u : ''; };

  /* ───────── the saved choice ───────── */
  function read() { try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); return s && typeof s === 'object' ? s : {}; } catch (e) { return {}; } }
  var pref = read();
  if (typeof pref.vol !== 'number' || !(pref.vol >= 0 && pref.vol <= 1)) pref.vol = 0.5;
  function write() { try { localStorage.setItem(KEY, JSON.stringify(pref)); } catch (e) { /* private mode */ } }

  /* ───────── the tracks (kept 5 minutes in this tab, so moving between pages does not ask the server each time) ───────── */
  var tracks = null;
  function loadTracks(force) {
    if (!force) { try { var c = JSON.parse(sessionStorage.getItem(TRACKS_KEY) || 'null'); if (c && Array.isArray(c.items) && Date.now() - c.t < 300000) { tracks = c.items; return Promise.resolve(tracks); } } catch (e) { /* none */ } }
    return fetch('/api/panels/music', { credentials: 'same-origin', cache: 'no-store', headers: { accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : { items: [] }; })
      .then(function (d) { tracks = (d && d.items) || []; try { sessionStorage.setItem(TRACKS_KEY, JSON.stringify({ t: Date.now(), items: tracks })); } catch (e) { /* full */ } return tracks; })
      .catch(function () { tracks = tracks || []; return tracks; });
  }
  var playable = function () { return (tracks || []).filter(function (t) { return !t.locked && safeSrc(t.url); }); };
  var byId = function (id) { return (tracks || []).filter(function (t) { return t.id === id; })[0] || null; };

  /* ───────── the sound ───────── */
  var audio = null, current = null, saveTimer = null, leaving = false;   // leaving: the page is being left, its pause is not the student's
  function ensureAudio() {
    if (audio) return audio;
    audio = new Audio(); audio.preload = 'auto'; audio.volume = pref.vol;
    audio.addEventListener('ended', function () { next(true); });
    audio.addEventListener('play', function () { pref.playing = true; write(); paint(); });
    audio.addEventListener('pause', function () { if (!audio.ended && !leaving) { pref.playing = false; savePos(); paint(); } });
    audio.addEventListener('error', function () { if (current) { paint('This track could not be played.'); } });
    return audio;
  }
  function savePos() { if (audio && current) { pref.id = current.id; pref.t = Math.floor(audio.currentTime || 0); write(); } }
  function load(t, at) {
    var a = ensureAudio(); current = t;
    if (a.getAttribute('data-id') !== t.id) { a.src = safeSrc(t.url); a.setAttribute('data-id', t.id); if (at > 0) { var seek = function () { try { a.currentTime = at; } catch (e) { /* not seekable */ } a.removeEventListener('loadedmetadata', seek); }; a.addEventListener('loadedmetadata', seek); } }
    pref.id = t.id; write();
  }
  function play(t, at) {
    if (!t || t.locked || !safeSrc(t.url)) return;
    load(t, at || 0);
    pref.on = true; write();
    var p = audio.play(); if (p && p.catch) p.catch(function () { pref.playing = false; paint(); });   // the browser wants a click first: ▶ shows
    clearInterval(saveTimer); saveTimer = setInterval(savePos, 3000);
    paint();
  }
  function pause() { if (audio) audio.pause(); pref.playing = false; savePos(); paint(); }
  function next(auto) {
    var list = playable(); if (!list.length) return;
    var i = current ? list.map(function (t) { return t.id; }).indexOf(current.id) : -1;
    play(list[(i + 1) % list.length], 0);
    if (!auto && audio) audio.currentTime = 0;
  }
  function turnOff() { pause(); pref.on = false; write(); if (audio) { audio.removeAttribute('src'); audio.load(); } current = null; paint(); }
  // another sound of the page (a Videos page player, any <audio>/<video>): the music makes room for it
  doc.addEventListener('ix:media-play', function () { if (audio && !audio.paused) pause(); });
  doc.addEventListener('play', function (e) { if (audio && e.target !== audio && (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO') && !audio.paused) pause(); }, true);
  window.addEventListener('pagehide', function () { leaving = true; savePos(); });
  window.addEventListener('pageshow', function (e) { leaving = false; if (e.persisted) paint(); });
  doc.addEventListener('visibilitychange', function () { if (doc.hidden) savePos(); });

  /* ───────── the little player of the ordinary pages ───────── */
  var mini = null;
  function css() {
    if (doc.getElementById('ixm-css')) return;
    var l = doc.createElement('link'); l.id = 'ixm-css'; l.rel = 'stylesheet'; l.href = '/assets/css/site-music.css'; doc.head.appendChild(l);
  }
  function paintMini(msg) {
    if (onSettings) return;
    if (!pref.on || !current) { if (mini) { mini.remove(); mini = null; } return; }
    css();
    if (!mini) {
      mini = doc.createElement('div'); mini.className = 'ixm-mini'; mini.setAttribute('role', 'region'); mini.setAttribute('aria-label', 'Study music');
      doc.body.appendChild(mini);
      mini.addEventListener('click', function (e) {
        var b = e.target.closest('[data-m]'); if (!b) return;
        var m = b.getAttribute('data-m');
        if (m === 'toggle') { if (audio && !audio.paused) pause(); else play(current, audio ? audio.currentTime : pref.t || 0); }
        else if (m === 'next') next(false);
        else if (m === 'off') turnOff();
      });
    }
    var on = audio && !audio.paused;
    mini.innerHTML = '<span class="ixm-mini-ic' + (on ? ' on' : '') + '">' + svg(IC.music) + '</span>'
      + '<a class="ixm-mini-t" href="/settings#ixs-music-card" title="Music settings"><b>' + esc(current.title) + '</b>' + (msg ? '<small>' + esc(msg) + '</small>' : current.artist ? '<small>' + esc(current.artist) + '</small>' : '') + '</a>'
      + '<button type="button" data-m="toggle" aria-label="' + (on ? 'Pause' : 'Play') + '">' + svg(on ? IC.pause : IC.play) + '</button>'
      + (playable().length > 1 ? '<button type="button" data-m="next" aria-label="Next track">' + svg(IC.next) + '</button>' : '')
      + '<button type="button" data-m="off" aria-label="Turn the music off">' + svg(IC.x) + '</button>';
  }

  /* ───────── the Settings page ───────── */
  var box = null, sw = null;
  function paintSettings(msg) {
    if (!onSettings || !box) return;
    if (sw) sw.checked = !!pref.on;
    if (!tracks) return;
    if (!tracks.length) { box.innerHTML = '<p class="ixm-empty">No music yet. New tracks are added by the IELTS X team.</p>'; return; }
    var on = audio && !audio.paused;
    box.innerHTML = '<ul class="ixm-tracks">' + tracks.map(function (t) {
      var cur = current && current.id === t.id;
      var cover = safeSrc(t.cover);
      var btn = t.locked ? '<a class="ixm-get" href="/Price?premium=required&plan=' + encodeURIComponent(t.plan) + '&next=%2Fsettings">' + svg(IC.lock) + esc(PLAN[t.plan] || t.plan) + '</a>'
        : '<button type="button" class="ixm-play" data-t="' + esc(t.id) + '" aria-label="' + (cur && on ? 'Pause ' : 'Play ') + esc(t.title) + '">' + svg(cur && on ? IC.pause : IC.play) + '</button>';
      return '<li class="ixm-track' + (cur ? ' cur' : '') + (t.locked ? ' locked' : '') + '"><span class="ixm-cover">' + (cover ? '<img src="' + esc(cover) + '" alt="" loading="lazy">' : svg(IC.music)) + (cur && on ? '<i class="ixm-eq"><b></b><b></b><b></b></i>' : '') + '</span>'
        + '<span class="ixm-meta"><b>' + esc(t.title) + '</b><small>' + esc([t.artist, t.category].filter(Boolean).join(' · ') || 'Study music') + '</small></span>' + btn + '</li>';
    }).join('') + '</ul>'
      + '<div class="ixm-bar"><span class="ixm-vol">' + svg(IC.vol) + '<input type="range" min="0" max="100" step="1" value="' + Math.round(pref.vol * 100) + '" id="ixm-vol" aria-label="Volume"></span>'
      + (playable().length > 1 ? '<button type="button" class="ixs-btn" data-mnext>Next track</button>' : '') + (msg ? '<span class="ixm-msg">' + esc(msg) + '</span>' : '') + '</div>';
  }
  function paint(msg) { paintMini(msg); paintSettings(msg); }
  function settingsStart() {
    box = doc.getElementById('ixs-music'); sw = doc.getElementById('ixs-music-on');
    if (!box) return;
    css();
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-t],[data-mnext]'); if (!b) return;
      if (b.hasAttribute('data-mnext')) return next(false);
      var t = byId(b.getAttribute('data-t'));
      if (current && t && current.id === t.id && audio && !audio.paused) pause(); else play(t, current && t && current.id === t.id && audio ? audio.currentTime : 0);
    });
    box.addEventListener('input', function (e) { if (e.target.id === 'ixm-vol') { pref.vol = Math.max(0, Math.min(1, Number(e.target.value) / 100)); if (audio) audio.volume = pref.vol; write(); } });
    if (sw) sw.addEventListener('change', function () {
      if (sw.checked) { var t = (pref.id && byId(pref.id)) || playable()[0]; if (t && !t.locked) play(t, t.id === pref.id ? pref.t || 0 : 0); else { sw.checked = false; paint('Choose a track below.'); } }
      else turnOff();
    });
  }

  /* ───────── start ───────── */
  function start() {
    if (onSettings) settingsStart();
    var need = onSettings || pref.on;
    if (!need) return;
    loadTracks(onSettings).then(function () {
      var t = pref.id && byId(pref.id);
      if (pref.on && t && !t.locked && safeSrc(t.url)) {
        if (pref.playing) play(t, pref.t || 0); else { load(t, pref.t || 0); paint(); }
      } else if (pref.on && !t) { pref.on = false; write(); }   // the track was removed (or locked since)
      paint();
    });
  }
  window.IXMusic = { play: function (id) { play(byId(id), 0); }, pause: pause, next: next, off: turnOff, state: function () { return { on: !!pref.on, playing: !!(audio && !audio.paused), id: current && current.id }; } };
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
})();
