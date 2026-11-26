/*
 * IELTSX — study music (assets/js/site-music.js). Loaded by assets/js/site-design.js on the ordinary pages only (never on
 * a test or exam page, so it can never play over a Listening recording).
 *   - the Settings page (#ixs-music): the list of tracks made in the admin panel (admin.html#music, GET /api/panels/music),
 *     a switch, play / pause, next, volume
 *   - every ordinary page: when the music is on, a small player at the bottom left keeps the track going
 *
 * Every page of the website is a page load of its own, and a browser stops all sound when a page is left. So the next
 * page picks the music up by itself, at once, where it would be had it kept playing:
 *   - the track (with its file) and its place are kept on this device every second (localStorage "ix-music"), and the
 *     list of tracks too ("ix-music-tracks"): the next page starts the file straight away. The list is asked again
 *     only in the background (that answer can take seconds), at most once a minute, on the Settings page and when the
 *     account changes;
 *   - it starts at the place it had reached plus the seconds the page change took (up to 30), and fades in;
 *   - a browser that wants a click before a page may play sound (a page opened without a click; iOS Safari on every
 *     page): the music stays on and comes back with the first click, tap or key press anywhere on the page;
 *   - the Back button (a page the browser kept) comes back at the latest place; a tab opened in the background waits
 *     until it is looked at; only one tab plays: the tab that starts the music pauses the others.
 * A slow or failed answer of the server never turns the music off; a track the server no longer lists for this visitor
 * (removed, hidden, or above the plan: it arrives without its file) stops. The music pauses by itself while a video of
 * the Videos page or any other sound of the page plays.
 */
(function () {
  'use strict';
  if (window.IXMusic) return;
  var TEST_PAGE = /^\/(full-tests\/[^/]+\/test-|pessages?\/|sections\/test-|full-mock\/|exam\/|writing\/|listening\/|test(\.html)?(\/|$)|game|admin)/i;
  if (TEST_PAGE.test(location.pathname)) return;
  var doc = document;
  var KEY = 'ix-music', TRACKS_KEY = 'ix-music-tracks';
  var REFRESH_MS = 60000, CARRY_S = 30, FADE_MS = 700;
  var onSettings = /^\/settings(\.html)?\/?$/i.test(location.pathname);
  var TAP = window.matchMedia && matchMedia('(pointer: coarse)').matches ? 'Tap' : 'Click';
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

  /* ───────── what this device keeps ───────── */
  function readJSON(key) { try { var v = JSON.parse(localStorage.getItem(key) || 'null'); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } }
  function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* private mode, full */ } }
  // the choice: { on, playing, id, t (seconds), at (when t was taken), d (length of the track did), vol, track: { id, title, artist, url, cover } }
  var pref = {};
  function fix() { if (typeof pref.vol !== 'number' || !(pref.vol >= 0 && pref.vol <= 1)) pref.vol = 0.5; }
  function read() { pref = readJSON(KEY) || pref; fix(); return pref; }
  /* another tab may have written in between: only the fields given here change (without storage: in this page only) */
  function save(patch) { var s = readJSON(KEY) || pref; for (var k in patch) s[k] = patch[k]; pref = s; fix(); writeJSON(KEY, s); }
  read();
  var snap = function (t) { return { id: t.id, title: t.title, artist: t.artist || '', url: t.url, cover: t.cover || '' }; };

  /* ───────── the tracks ───────── */
  var cache = readJSON(TRACKS_KEY);
  if (!cache || !Array.isArray(cache.items)) cache = null;
  try { sessionStorage.removeItem(TRACKS_KEY); } catch (e) { /* the copy of the first version of this file */ }
  var tracks = cache ? cache.items : null;
  var answered = false, failed = false, asking = null;
  // whose list it is: a list made for another account (or plan) is asked again
  var whoOf = function (u) { return u ? [u.id || '', u.plan || '', u.premiumActive ? 1 : 0].join('|') : 'guest'; };
  var who = window.IELTSXUser === undefined ? null : whoOf(window.IELTSXUser);
  function refresh() {
    if (asking) return asking;
    var askedFor = who;
    asking = fetch('/api/panels/music', { credentials: 'same-origin', cache: 'no-store', headers: { accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        if (!d || !Array.isArray(d.items)) throw new Error('no list');
        tracks = d.items; answered = true; failed = false;
        cache = { t: Date.now(), who: askedFor !== null ? askedFor : who, items: tracks, here: true };
        writeJSON(TRACKS_KEY, { t: cache.t, who: cache.who, items: tracks });
        settle();
      })
      .catch(function () { failed = !tracks; })   // offline or a slow / failed server: the music this device has goes on
      .then(function () { asking = null; paint(); });
    return asking;
  }
  var playable = function () { return (tracks || (pref.track ? [pref.track] : [])).filter(function (t) { return !t.locked && safeSrc(t.url); }); };
  var byId = function (id) { return (tracks || []).filter(function (t) { return t.id === id; })[0] || null; };
  /* the track to resume: from the list, or the copy kept with the choice while the list is not known yet */
  function chosen() { return (pref.id && byId(pref.id)) || (!answered && pref.track && pref.track.id === pref.id ? pref.track : null); }

  /* ───────── the sound ───────── */
  var audio = null, current = null, tick = null, fade = null;
  var startAt = 0;      // the place asked for, until the browser knows the file
  var quiet = false;    // the next pause is not the student's (another tab took the music, the page is put away)
  var leaving = false;  // the page is being left
  var owner = false;    // this tab is the one playing (only its place is kept)
  var blocked = false, blockedSince = 0;   // the browser wants a click or key press first
  function ensureAudio() {
    if (audio) return audio;
    audio = new Audio(); audio.preload = 'auto'; audio.volume = pref.vol;
    audio.addEventListener('ended', function () { next(true); });
    audio.addEventListener('playing', function () { blocked = false; stopWaiting(); claim(); paint(); });
    audio.addEventListener('pause', function () {
      if (quiet) { quiet = false; return; }
      if (audio.ended || leaving) return;
      savePos(); save({ playing: false }); clearInterval(tick); paint();   // paused by the student (or by the keyboard's media keys)
    });
    audio.addEventListener('loadedmetadata', function () {
      if (startAt > 0 && Math.abs((audio.currentTime || 0) - startAt) > 1) { try { audio.currentTime = startAt; } catch (e) { /* not seekable */ } }
      if (audio.duration && isFinite(audio.duration) && current) save({ d: Math.round(audio.duration), did: current.id });
    });
    audio.addEventListener('error', function () { if (current && audio.getAttribute('src')) paint('This track could not be played.'); });
    return audio;
  }
  function pos() { return audio && audio.readyState >= 1 ? audio.currentTime || 0 : startAt; }
  /* the place is kept by the tab that plays; a page that waited for a click keeps its place when it is left, unless
     another tab has been playing (and keeping its own place) meanwhile */
  function savePos(leavingNow) {
    if (!audio || !current) return;
    if (!owner) {
      if (!(leavingNow && blocked)) return;
      var s = readJSON(KEY); if (s && Number(s.at) > blockedSince) return;
    }
    save({ id: current.id, t: Math.round(pos() * 100) / 100, at: Date.now() });
  }
  function load(t, at) {
    var a = ensureAudio(), src = safeSrc(t.url); current = t; at = Math.max(0, Number(at) || 0);
    if (a.getAttribute('src') !== src) {
      a.preload = pref.playing ? 'auto' : 'metadata';
      a.src = src; startAt = at;
      if (at > 0) { try { a.currentTime = at; } catch (e) { /* set again when the file is known */ } }
    } else if (Math.abs(pos() - at) > 1.5) { startAt = at; try { a.currentTime = at; } catch (e) { /* not seekable */ } }
  }
  /* auto: started by the page itself (it fades in, and may need a click first) */
  function play(t, at, auto) {
    if (!t || t.locked || !safeSrc(t.url)) return;
    load(t, at);
    save({ on: true, playing: true, id: t.id, track: snap(t) });
    var a = audio;
    clearInterval(fade); a.volume = auto ? 0 : pref.vol;
    var p; try { p = a.play(); } catch (e) { p = null; }
    if (p && p.then) {
      p.then(function () { if (auto) fadeIn(); }, function (e) {
        a.volume = pref.vol;
        if (e && e.name === 'NotAllowedError' && current === t && pref.playing) { blocked = true; blockedSince = Date.now(); waitForGesture(); paint(); }   // the music stays on
      });
    } else if (auto) fadeIn();
    clearInterval(tick); tick = setInterval(function () { savePos(); }, 1000);
    paint();
  }
  function fadeIn() {
    clearInterval(fade);
    var t0 = Date.now();
    fade = setInterval(function () { var k = Math.min(1, (Date.now() - t0) / FADE_MS); try { audio.volume = pref.vol * k * k; } catch (e) { /* fixed volume (iOS) */ } if (k >= 1) clearInterval(fade); }, 40);
  }
  function quietPause() { if (audio && !audio.paused) { quiet = true; audio.pause(); } }
  function pause() { stopWaiting(); blocked = false; if (audio) { savePos(); audio.pause(); } save({ playing: false }); clearInterval(tick); paint(); }
  function next(auto) {
    var list = playable(); if (!list.length) return;
    var i = current ? list.map(function (t) { return t.id; }).indexOf(current.id) : -1;
    var t = list[(i + 1) % list.length];
    if (audio && current && t.id === current.id) { startAt = 0; try { audio.currentTime = 0; } catch (e) { /* not seekable */ } }
    play(t, 0, false);
  }
  /* here only: the music was turned off (in another tab), or the track is gone */
  function stopHere() { stopWaiting(); blocked = false; clearInterval(tick); clearInterval(fade); owner = false; if (audio) { quietPause(); audio.removeAttribute('src'); audio.load(); } current = null; }
  function turnOff() { if (audio) quietPause(); stopHere(); save({ on: false, playing: false }); paint(); }

  /* where the music would be now: the place it had reached, plus the seconds the page change took */
  function resumeAt() {
    var t = Number(pref.t) || 0, gap = (Date.now() - (Number(pref.at) || 0)) / 1000;
    if (pref.playing && gap > 0 && gap < CARRY_S) t += gap;
    return t;
  }
  function resume() {
    if (!pref.on) return;
    var t = chosen();
    if (!t || t.locked || !safeSrc(t.url)) { if (answered) save({ on: false, playing: false }); return; }   // removed, or above the plan now
    var at = resumeAt();
    if (pref.d && pref.did === t.id && at >= pref.d - 0.5) { current = t; if (pref.playing) return next(true); at = 0; }   // the track ended during the page change
    if (pref.playing) play(t, at, true); else { load(t, at); paint(); }
  }
  /* a tab opened in the background starts when it is looked at (not over the tab in front) */
  var seenWait = false;
  function resumeWhenSeen() {
    if (!doc.hidden) return resume();
    if (seenWait) return;
    seenWait = true;
    var seen = function () { if (doc.hidden) return; doc.removeEventListener('visibilitychange', seen); seenWait = false; read(); resume(); };
    doc.addEventListener('visibilitychange', seen);
  }
  /* the server answered: the track playing may be gone, or locked now */
  function settle() {
    if (!pref.on) return;
    if (!current) return resumeWhenSeen();
    var t = byId(current.id);
    if (!t || t.locked || !safeSrc(t.url)) return turnOff();
    var moved = safeSrc(t.url) !== safeSrc(current.url);
    current = t; if (pref.id === t.id) save({ track: snap(t) });
    if (moved) { var was = audio && !audio.paused; load(t, 0); if (was) play(t, 0, false); }   // a new file for the same track
  }

  /* a browser that wants a click first: the first click, tap or key press anywhere on the page starts the music */
  var GESTURES = ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click'], waiting = false;
  function waitForGesture() { if (waiting) return; waiting = true; GESTURES.forEach(function (n) { doc.addEventListener(n, onGesture, true); }); }
  function stopWaiting() { if (!waiting) return; waiting = false; GESTURES.forEach(function (n) { doc.removeEventListener(n, onGesture, true); }); }
  function onGesture(e) {
    if (!blocked || !audio || !current || !pref.on || !pref.playing) return stopWaiting();
    if (e.target && e.target.closest && e.target.closest('.ixm-mini,#ixs-music-card')) return;   // the player's own buttons decide
    var p; try { p = audio.play(); } catch (x) { p = null; }
    if (p && p.then) p.then(function () { blocked = false; stopWaiting(); fadeIn(); paint(); }, function () { /* not this one: the next */ });
  }

  /* one tab plays: the tab that starts the music pauses the others (they keep the music on) */
  var TAB = Math.random().toString(36).slice(2), chan = null;
  try { chan = new BroadcastChannel('ix-music'); chan.onmessage = function (e) { if (e.data && e.data.type === 'play' && e.data.tab !== TAB) yieldTab(); }; } catch (e) { chan = null; }
  function claim() { owner = true; if (chan) { try { chan.postMessage({ type: 'play', tab: TAB }); } catch (e) { /* closed */ } } }
  function yieldTab() { owner = false; blocked = false; stopWaiting(); clearInterval(tick); quietPause(); paint(); }
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    var was = { on: pref.on, vol: pref.vol }; read();
    if (was.on && !pref.on && current) { stopHere(); paint(); }   // turned off in another tab
    else if (was.vol !== pref.vol && audio) { clearInterval(fade); audio.volume = pref.vol; if (box && !box.contains(doc.activeElement)) paint(); }
  });

  // another sound of the page (a Videos page player, any <audio>/<video>): the music makes room for it
  doc.addEventListener('ix:media-play', function () { if (audio && !audio.paused) pause(); });
  doc.addEventListener('play', function (e) { if (audio && e.target !== audio && (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO') && !audio.paused) pause(); }, true);
  window.addEventListener('pagehide', function (e) { savePos(true); leaving = true; if (e.persisted) quietPause(); });
  window.addEventListener('pageshow', function (e) {
    leaving = false;
    if (!e.persisted) return;
    // back from the browser's back / forward cache: the other pages went on meanwhile
    read(); cache = readJSON(TRACKS_KEY); if (cache && Array.isArray(cache.items)) tracks = cache.items;
    if (!pref.on) { if (current) stopHere(); paint(); return; }
    resume();
  });
  doc.addEventListener('visibilitychange', function () { if (doc.hidden) savePos(); });
  // signed in, signed out, another account or plan: the list is asked again
  doc.addEventListener('ieltsx:user', function (e) {
    var w = whoOf(e.detail && e.detail.user); who = w;
    if (cache && cache.who === w) return;
    if (cache && cache.here && cache.who == null) { cache.who = w; writeJSON(TRACKS_KEY, { t: cache.t, who: w, items: cache.items }); return; }   // asked on this page, for this account
    if (pref.on || onSettings) refresh();
  });

  /* ───────── the little player of the ordinary pages ───────── */
  var mini = null;
  function css() {
    if (doc.getElementById('ixm-css') || !doc.head) return;
    var l = doc.createElement('link'); l.id = 'ixm-css'; l.rel = 'stylesheet'; l.href = '/assets/css/site-music.css'; doc.head.appendChild(l);
  }
  function paintMini(msg) {
    if (onSettings || !doc.body) return;
    if (!pref.on || !current) { if (mini) { mini.remove(); mini = null; } return; }
    css();
    if (!mini) {
      mini = doc.createElement('div'); mini.className = 'ixm-mini'; mini.setAttribute('role', 'region'); mini.setAttribute('aria-label', 'Study music');
      doc.body.appendChild(mini);
      mini.addEventListener('click', function (e) {
        var b = e.target.closest('[data-m]'); if (!b) return;
        var m = b.getAttribute('data-m');
        if (m === 'toggle') { if (audio && !audio.paused) pause(); else play(current, pos(), false); }
        else if (m === 'next') next(false);
        else if (m === 'off') turnOff();
      });
    }
    var on = audio && !audio.paused;
    if (!msg && blocked) msg = TAP + ' anywhere to continue';
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
    if (!tracks) { if (failed) box.innerHTML = '<p class="ixm-empty">The music could not be loaded. Check the connection and open this page again.</p>'; return; }
    if (!tracks.length) { box.innerHTML = '<p class="ixm-empty">No music yet. New tracks are added by the IELTS X team.</p>'; return; }
    var on = audio && !audio.paused;
    if (!msg && blocked) msg = TAP + ' anywhere to continue the music.';
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
      if (current && t && current.id === t.id && audio && !audio.paused) pause(); else play(t, current && t && current.id === t.id ? pos() : 0, false);
    });
    box.addEventListener('input', function (e) { if (e.target.id === 'ixm-vol') { save({ vol: Math.max(0, Math.min(1, Number(e.target.value) / 100)) }); clearInterval(fade); if (audio) audio.volume = pref.vol; } });
    if (sw) sw.addEventListener('change', function () {
      if (sw.checked) { var t = (pref.id && byId(pref.id)) || playable()[0]; if (t && !t.locked) play(t, t.id === pref.id ? Number(pref.t) || 0 : 0, false); else { sw.checked = false; paint('Choose a track below.'); } }
      else turnOff();
    });
  }

  /* ───────── start ───────── */
  // the sound starts at once (it needs neither the page nor the server); the player shows when the page is there
  function boot() {
    if (!pref.on && !onSettings) return;
    if (pref.on) resumeWhenSeen();
    var stale = !cache || !(Date.now() - (Number(cache.t) || 0) < REFRESH_MS) || (who !== null && cache.who !== who);
    if (onSettings || stale || (pref.on && !current)) refresh();
  }
  function start() { if (onSettings) settingsStart(); paint(); }
  window.IXMusic = {
    play: function (id) { play(byId(id), 0, false); }, pause: pause, next: next, off: turnOff,
    state: function () { return { on: !!pref.on, playing: !!(audio && !audio.paused), id: current && current.id, t: Math.round(pos() * 10) / 10, waitingForClick: blocked }; }
  };
  boot();
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
})();
