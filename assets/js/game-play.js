/*
 * IELTSX Game -- the player page (/game).
 * PIN -> nickname -> wait -> each question: read it, tap one of the four tiles, see right / wrong and the points ->
 * the place -> the end. The page asks the server about once a second (GET /api/game/state, quiz-game.js): there is no
 * open connection, so it works on Vercel and on weak school Wi-Fi. The player's signed token is kept in this browser,
 * so a reload (or a locked phone) comes back to the same game. Points and right answers are worked out on the server.
 */
(function () {
  'use strict';
  var I = window.IXGameI18n; var t = I.t;
  var $ = function (s) { return document.querySelector(s); };
  var SHAPES = [
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 30 28H2z"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 30 16 16 30 2 16z"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="4" width="24" height="24" rx="2"/></svg>'
  ];
  var KEY = 'ix-game-player', NICK = 'ix-game-nick', LEAD = 5000;
  var me = null, st = null, pending = null, offset = 0, synced = false, pollT = 0, tickT = 0, shown = '', sending = false, failures = 0;

  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var now = function () { return Date.now() + offset; };
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch (e) { /* storage blocked: the game still works until a reload */ } }
  function read(k, json) { try { var v = localStorage.getItem(k); return json ? JSON.parse(v || 'null') : v; } catch (e) { return null; } }
  function show(id) {
    document.querySelectorAll('.g-screen').forEach(function (s) { s.hidden = s.id !== id; });
    var inGame = ['s-lobby', 's-ready', 's-answer', 's-sent', 's-result', 's-board', 's-final'].indexOf(id) >= 0;
    $('#foot').hidden = !inGame || !me;
    $('#qbar').hidden = !(id === 's-answer' || id === 's-sent');
  }
  function mood(c) { document.body.classList.remove('is-ok', 'is-bad', 'is-neutral'); if (c) document.body.classList.add(c); }
  function toast(m) { var el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 3200); }
  function ordinal(n) { return '#' + n; }
  function medal(n) { return n === 1 ? '🥇' : n === 2 ? '🥈' : n === 3 ? '🥉' : ''; }

  function call(method, url, body) {
    var h = { Accept: 'application/json' };
    if (body) h['Content-Type'] = 'application/json';
    if (me && me.token) h['X-Game-Token'] = me.token;
    return fetch(url, { method: method, credentials: 'same-origin', cache: 'no-store', headers: h, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) { var e = new Error(d.error || ('Error ' + r.status)); e.status = r.status; throw e; } return d; }); });
  }
  function errText(e) {
    if (!e || !e.status) return t('offline');
    if (e.status === 404) return t('pinWrong');
    if (e.status === 429) return t('tooMany');
    if (e.status === 423) return t('lockedJoin');
    if (e.status === 410) return t('gone');
    if (e.status === 409 && /nickname/i.test(e.message)) return t('nickTaken');
    if (e.status === 409 && /full/i.test(e.message)) return t('full');
    return e.message;
  }
  function busy(form, on) { form.querySelectorAll('button,input').forEach(function (x) { x.disabled = on; }); }

  /* ───────── PIN and nickname ───────── */
  $('#pin').addEventListener('input', function () {
    var d = this.value.replace(/\D/g, '').slice(0, 6); this.value = d.length > 3 ? d.slice(0, 3) + ' ' + d.slice(3) : d; $('#pin-err').textContent = '';
  });
  $('#f-pin').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var pin = $('#pin').value.replace(/\D/g, ''); var f = this;
    if (pin.length !== 6) { $('#pin-err').textContent = t('pinBad'); $('#pin').focus(); return; }
    busy(f, true);
    call('POST', '/api/game/pin', { pin: pin }).then(function (d) {
      pending = { pin: pin, title: d.title, subject: d.subject };
      $('#name-title').textContent = d.title; $('#name-subject').textContent = d.subject;
      $('#nick').value = read(NICK) || d.name || ''; $('#nick-err').textContent = '';
      show('s-name'); $('#nick').focus(); $('#nick').select();
    }).catch(function (e) { $('#pin-err').textContent = errText(e); }).then(function () { busy(f, false); });
  });
  $('#name-back').addEventListener('click', function () { pending = null; show('s-pin'); $('#pin').focus(); });
  $('#f-name').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var name = $('#nick').value.replace(/\s+/g, ' ').trim(); var f = this;
    if (!name) { $('#nick-err').textContent = t('nickBad'); $('#nick').focus(); return; }
    if (!pending) { show('s-pin'); return; }
    busy(f, true);
    call('POST', '/api/game/join', { pin: pending.pin, name: name }).then(function (d) {
      me = { token: d.token, pin: d.pin, name: d.name, title: d.title, subject: d.subject };
      store(KEY, me); store(NICK, d.name); pending = null; shown = '';
      $('#foot-name').textContent = me.name; $('#foot-score').textContent = '0';
      lobby(); poll();
    }).catch(function (e) { $('#nick-err').textContent = errText(e); if (e.status === 404 || e.status === 410) setTimeout(reset, 1800); }).then(function () { busy(f, false); });
  });
  function lobby() {
    $('#lobby-name').textContent = me.name; $('#lobby-title').textContent = me.title || ''; $('#lobby-subject').textContent = me.subject || '';
    $('#lobby-subject').hidden = !me.subject; mood(''); show('s-lobby');
  }
  function reset() {
    clearTimeout(pollT); me = null; st = null; shown = ''; store(KEY, null); mood('');
    $('#pin').value = ''; $('#pin-err').textContent = ''; show('s-pin'); $('#pin').focus();
  }
  function gone(text) { clearTimeout(pollT); store(KEY, null); me = null; mood('is-neutral'); $('#gone-text').textContent = text; show('s-gone'); }
  $('#lobby-leave').addEventListener('click', function () { call('POST', '/api/game/leave', {}).catch(function () {}).then(reset); });
  $('#gone-again').addEventListener('click', reset);
  $('#final-again').addEventListener('click', reset);

  /* ───────── the game: ask the server, draw the screen it says ───────── */
  function poll() {
    clearTimeout(pollT); if (!me) return;
    var t0 = Date.now();
    call('GET', '/api/game/state').then(function (d) {
      var t1 = Date.now(); var o = d.now - (t0 + t1) / 2;
      offset = !synced || Math.abs(o - offset) > 800 ? o : offset * 0.8 + o * 0.2; synced = true;
      failures = 0; $('#offline').hidden = true;
      render(d); schedule(d);
    }).catch(function (e) {
      if (e.status === 401) { gone(t('gone')); return; }
      failures++; if (failures > 1) $('#offline').hidden = false;
      pollT = setTimeout(poll, Math.min(5000, 1000 * failures));
    });
  }
  function schedule(d) {
    if (!me) return;
    var wait = document.hidden ? 4000 : 1000;
    if (d.phase === 'ready') wait = Math.max(120, Math.min(wait, d.openAt - now() + 80));       // the tiles appear when the answers open
    if (d.phase === 'answer') wait = Math.max(200, Math.min(wait, d.endsAt - now() + 350));   // the result as soon as the time is up
    pollT = setTimeout(poll, wait);
  }
  function render(d) {
    st = d;
    if (d.phase === 'gone') return gone(t('gone'));
    if (d.phase === 'kicked') return gone(t('kicked'));
    if (d.you) { $('#foot-name').textContent = d.you.name; $('#foot-score').textContent = String(d.you.score); }
    var key = d.phase + ':' + d.q + (d.phase === 'answer' && d.answered ? ':sent' : '');
    if (key === shown) return;
    shown = key;
    if (d.phase === 'lobby') return lobby();
    if (d.phase === 'ready') return drawReady(d);
    if (d.phase === 'answer') return d.answered ? drawSent(d.answered.c) : drawAnswer(d);
    if (d.phase === 'reveal') return drawResult(d);
    if (d.phase === 'scoreboard') return drawBoard(d);
    if (d.phase === 'final') return drawFinal(d);
  }
  function qTag(q) { return q.points === 2 ? '<span class="g-tag">⚡ ' + esc(t('double')) + '</span>' : q.points === 0 ? '<span class="g-tag">' + esc(t('noPoints')) + '</span>' : ''; }
  function drawReady(d) {
    mood('');
    $('#ready-n').textContent = t('qOf', { n: d.q + 1, m: d.n });
    $('#ready-tag').innerHTML = d.question ? qTag(d.question) : '';
    $('#ready-q').textContent = d.question ? d.question.text : '';
    show('s-ready'); tick();
  }
  function drawAnswer(d) {
    mood('');
    var q = d.question || { answers: [] };
    $('#qbar-n').textContent = (d.q + 1) + ' / ' + d.n;
    $('#qbar-x').innerHTML = q.points === 2 ? '⚡ x2' : '';
    $('#ans-q').textContent = q.text;
    var img = $('#ans-img'); if (q.image) { img.src = q.image; img.hidden = false; } else { img.hidden = true; img.removeAttribute('src'); }
    var box = $('#ans-tiles'); box.className = 'g-tiles' + (q.answers.length === 2 ? ' two' : '');
    box.innerHTML = q.answers.map(function (a, k) { return '<button class="g-tile a' + k + '" type="button" data-c="' + k + '"><span class="g-shape">' + SHAPES[k] + '</span><span>' + esc(a) + '</span></button>'; }).join('');
    show('s-answer'); tick();
  }
  function drawSent(c) {
    mood('');
    $('#sent-shape').innerHTML = c != null && SHAPES[c] ? '<div class="g-tile a' + c + '" style="min-height:0;width:110px;height:110px;justify-content:center"><span class="g-shape" style="width:56px;height:56px">' + SHAPES[c] + '</span></div>' : '';
    $('#sent-title').textContent = t('sent');
    show('s-sent'); tick();
  }
  function drawResult(d) {
    var r = d.result || {}; var you = d.you || {};
    $('#res-gain').hidden = true; $('#res-streak').hidden = true; $('#res-right').hidden = true;
    if (!r.answered) { mood('is-neutral'); $('#res-title').textContent = t('timeUp'); $('#res-mark').textContent = '⏱'; }
    else if (r.ok) { mood('is-ok'); $('#res-title').textContent = t('correct'); $('#res-mark').textContent = '✓'; $('#res-gain').textContent = '+ ' + r.pts; $('#res-gain').hidden = false; if (navigator.vibrate) navigator.vibrate([30, 40, 30]); }
    else { mood('is-bad'); $('#res-title').textContent = t('wrong'); $('#res-mark').textContent = '✕'; if (navigator.vibrate) navigator.vibrate(120); }
    if (r.ok && you.streak > 1) { $('#res-streak').textContent = t('streak', { n: you.streak }); $('#res-streak').hidden = false; }
    if (!r.ok && r.correctText && r.correctText.length) { $('#res-right').textContent = t('rightWas') + ' ' + r.correctText.join(' / '); $('#res-right').hidden = false; }
    show('s-result');
  }
  function drawBoard(d) {
    mood(''); var y = d.you || {};
    $('#board-place').textContent = y.rank ? (medal(y.rank) || '') + ordinal(y.rank) : '';
    $('#board-of').textContent = y.rank ? t('yourPlace') + ' · ' + t('ofPlayers', { n: y.players || '?' }) : '';
    $('#board-score').textContent = y.score + ' ' + t('points');
    show('s-board');
  }
  function drawFinal(d) {
    var y = d.you || {};
    mood(y.rank && y.rank <= 3 ? 'is-ok' : '');
    $('#final-title').textContent = d.title || '';
    $('#final-place').textContent = y.rank ? (medal(y.rank) || '') + ordinal(y.rank) : '';
    $('#final-of').textContent = y.rank ? t('yourPlace') + ' · ' + t('ofPlayers', { n: y.players || '?' }) : '';
    $('#final-score').textContent = String(y.score || 0);
    $('#final-top').innerHTML = (d.top || []).map(function (p, i) { return '<div><span>' + medal(i + 1) + '</span><b>' + esc(p.name) + '</b><span>' + p.score + '</span></div>'; }).join('');
    show('s-final'); clearTimeout(pollT);
    store(KEY, null);   // a reload starts a new game
  }

  /* the clock on the screen (the server's time, worked out from each answer of the server) */
  function tick() {
    clearInterval(tickT);
    tickT = setInterval(function () {
      if (!st) return;
      if (st.phase === 'ready' && !$('#s-ready').hidden) {
        var left = Math.max(0, st.openAt - now()); $('#ready-bar').style.transform = 'scaleX(' + Math.min(1, left / LEAD) + ')';
        if (left <= 0) { clearInterval(tickT); poll(); }
      } else if ((st.phase === 'answer' || st.phase === 'ready') && (!$('#s-answer').hidden || !$('#s-sent').hidden)) {
        var s = Math.max(0, Math.ceil((st.endsAt - now()) / 1000)); var el = $('#qbar-t');
        el.textContent = s; el.classList.toggle('low', s <= 5);
        if (s <= 0) {
          clearInterval(tickT);
          if (!$('#s-answer').hidden) { $('#ans-tiles').querySelectorAll('button').forEach(function (b) { b.disabled = true; b.classList.add('dim'); }); }
        }
      } else clearInterval(tickT);
    }, 100);
  }

  /* a tap on a tile */
  $('#ans-tiles').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-c]'); if (!b || b.disabled || sending || !st || st.phase !== 'answer') return;
    var c = Number(b.dataset.c), q = st.q; sending = true;
    if (navigator.vibrate) navigator.vibrate(25);
    st.answered = { c: c }; shown = 'answer:' + q + ':sent'; drawSent(c);
    call('POST', '/api/game/answer', { q: q, c: c }).then(function () { sending = false; }).catch(function (e) {
      sending = false;
      if (e.status === 409 || e.status === 410 || e.status === 403) { if (/time/i.test(e.message)) $('#sent-title').textContent = t('timeUp'); poll(); return; }
      toast(errText(e)); st.answered = null; shown = ''; render(st);   // not sent (no connection): the tiles come back
    });
  });

  /* ───────── start ───────── */
  $('#lang-btn').addEventListener('click', function () { I.next(); });
  document.addEventListener('ix-lang', function () { if (st && me) { shown = ''; render(st); } });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && me) poll(); });
  I.apply();
  var qp = new URLSearchParams(location.search).get('pin');
  me = read(KEY, true);
  if (me && me.token) { $('#foot-name').textContent = me.name || ''; lobby(); poll(); }
  else {
    me = null; show('s-pin');
    if (qp && /^\d{3}\s?\d{3}$/.test(qp)) { $('#pin').value = qp.replace(/\D/g, '').replace(/^(\d{3})/, '$1 '); $('#f-pin').requestSubmit ? $('#f-pin').requestSubmit() : $('#f-pin').dispatchEvent(new Event('submit', { cancelable: true })); }
    else $('#pin').focus();
  }
})();
