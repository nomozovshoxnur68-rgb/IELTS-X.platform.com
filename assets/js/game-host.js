/*
 * IELTSX Game -- the host screen (/game-host?pin=123456), shown on the classroom screen by an admin.
 * Lobby (the PIN, the players joining) -> each question: read it (5 s), the clock with the answer count, the right
 * answer with how many chose each tile -> the scoreboard -> ... -> the podium. The screen asks the server about once a
 * second (GET /api/admin/games/live/<pin>, quiz-game.js) and moves the game on with POST {action}. When everybody has
 * answered the question closes at once. Keys: Space / Enter / → = the big button of the screen.
 */
(function () {
  'use strict';
  var I = window.IXGameI18n; var t = I.t;
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var SHAPES = [
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 30 28H2z"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 30 16 16 30 2 16z"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="4" width="24" height="24" rx="2"/></svg>'
  ];
  var LEAD = 5000;
  var pin = String(new URLSearchParams(location.search).get('pin') || '').replace(/\D/g, '');
  var st = null, offset = 0, synced = false, pollT = 0, tickT = 0, shown = '', acting = false, autoQ = -1, failures = 0, dead = false;
  var now = function () { return Date.now() + offset; };
  function toast(m) { var el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 3500); }
  function call(method, body) {
    return fetch('/api/admin/games/live/' + pin, { method: method, credentials: 'same-origin', cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) { var e = new Error(d.error || ('Error ' + r.status)); e.status = r.status; throw e; } return d; }); });
  }
  function message(text, link, label) {
    dead = true; clearTimeout(pollT); clearInterval(tickT);
    ['#h-pin', '#h-count', '#h-lock', '#h-end'].forEach(function (s) { $(s).hidden = true; });
    $('#stage').innerHTML = '<div class="gh-msg"><div class="g-big" style="font-size:22px">' + esc(text) + '</div>' + (link ? '<div><a href="' + esc(link) + '">' + esc(label) + '</a></div>' : '') + '</div>';
  }

  /* ───────── ask the server ───────── */
  function poll() {
    clearTimeout(pollT); if (dead) return;
    var t0 = Date.now();
    call('GET').then(function (d) {
      var t1 = Date.now(); var o = d.now - (t0 + t1) / 2;
      offset = !synced || Math.abs(o - offset) > 800 ? o : offset * 0.8 + o * 0.2; synced = true;
      failures = 0; $('#offline').hidden = true;
      render(d);
      var wait = document.hidden ? 3000 : 1000;
      if (d.phase === 'ready') wait = Math.max(120, Math.min(wait, d.openAt - now() + 60));
      if (d.phase === 'answer') wait = Math.max(150, Math.min(wait, d.endsAt - now() + 120));
      pollT = setTimeout(poll, wait);
    }).catch(function (e) {
      if (e.status === 401) return message(t('hostOnly'), '/login?next=' + encodeURIComponent(location.pathname + location.search), t('signIn'));
      if (e.status === 403) return message(t('hostOnly'), '/', 'IELTSX');
      if (e.status === 404) return message(t('gameOver'), '/admin#games', t('toAdmin'));
      failures++; if (failures > 1) $('#offline').hidden = false;
      pollT = setTimeout(poll, Math.min(5000, 1000 * failures));
    });
  }
  function act(action, extra) {
    if (acting || !st) return Promise.resolve();
    acting = true; document.querySelectorAll('[data-act]').forEach(function (b) { b.disabled = true; });
    var body = Object.assign({ action: action, q: st.q }, extra || {});
    return call('POST', body).then(function (d) {
      if (d.closed) { location.href = '/admin#games'; return; }
    }).catch(function (e) {
      if (e.status === 404) return message(t('gameOver'), '/admin#games', t('toAdmin'));
      if (e.status !== 409) toast(e.status === 400 && /player/i.test(e.message) ? t('needPlayer') : e.message);
    }).then(function () { acting = false; shown = ''; poll(); });
  }

  /* ───────── draw ───────── */
  function header(d) {
    $('#h-title').textContent = d.title; $('#h-subject').textContent = d.subject + (d.host && d.host.name ? ' · ' + d.host.name : '');
    document.title = d.title + ' — PIN ' + d.pin;
    $('#h-pin').hidden = false; $('#h-pin').textContent = 'PIN ' + d.pin.slice(0, 3) + ' ' + d.pin.slice(3);
    $('#h-count').hidden = false; $('#h-count-n').textContent = d.players.length;
    $('#h-lock').hidden = d.phase === 'final'; $('#h-lock').textContent = d.locked ? '🔒 ' + t('unlock') : '🔓 ' + t('lock'); $('#h-lock').classList.toggle('on', d.locked);
    $('#h-end').hidden = d.phase === 'final' || d.phase === 'lobby';
  }
  function render(d) {
    st = d; header(d);
    var key = d.phase + ':' + d.q;
    if (d.phase === 'lobby') return drawLobby(d);   // drawn on every answer: the players come and go
    if (d.phase === 'answer') {
      if (key !== shown) { shown = key; drawQuestion(d); }
      $('#g-count').textContent = d.answered;
      if (d.players.length && d.answered >= d.players.length && autoQ !== d.q) { autoQ = d.q; act('reveal'); }   // everybody answered
      return;
    }
    if (key === shown) return;
    shown = key;
    if (d.phase === 'ready') return drawReady(d);
    if (d.phase === 'reveal') return drawQuestion(d);
    if (d.phase === 'scoreboard') return drawBoard(d);
    if (d.phase === 'final') return drawFinal(d);
  }
  function drawLobby(d) {
    var host = location.host.replace(/^www\./, '');
    var players = d.players.map(function (p) { return '<button class="gh-player" type="button" data-kick="' + esc(p.pid) + '" data-name="' + esc(p.name) + '" title="' + esc(t('kickHint')) + '">' + esc(p.name) + '</button>'; }).join('');
    var sig = d.players.map(function (p) { return p.pid; }).join(',') + '|' + d.locked + '|' + I.lang;
    if (shown === 'lobby' && $('#stage').dataset.sig === sig) return;
    shown = 'lobby'; $('#stage').dataset.sig = sig;
    $('#stage').innerHTML =
      '<div class="gh-join"><div class="url">' + esc(t('joinAt')) + '<b>' + esc(host) + '/game</b></div><div class="pin"><small>' + esc(t('gamePin')) + '</small><b>' + esc(d.pin.slice(0, 3) + ' ' + d.pin.slice(3)) + '</b></div></div>' +
      '<div class="gh-lobby-bar"><span class="gh-count" style="font-size:20px">👥 ' + d.players.length + ' ' + esc(t('playersN')) + '</span>' +
        (d.locked ? '<span class="g-tag">🔒 ' + esc(t('lockedNote')) + '</span>' : '<span class="gh-note">' + esc(d.players.length ? t('kickHint') : '') + '</span>') +
        '<button class="gh-big-btn go" type="button" data-act="start" ' + (d.players.length ? '' : 'disabled') + '>' + esc(t('start')) + ' ▶</button></div>' +
      '<div class="gh-players">' + (players || '<div class="g-sub" style="align-self:center">' + esc(t('waitingPlayers')) + ' <span class="g-dots"><i></i><i></i><i></i></span></div>') + '</div>';
  }
  function tag(q) { return q.points === 2 ? '<span class="g-tag">⚡ ' + esc(t('double')) + '</span>' : q.points === 0 ? '<span class="g-tag">' + esc(t('noPoints')) + '</span>' : ''; }
  function drawReady(d) {
    var q = d.question || {};
    $('#stage').innerHTML = '<div class="g-sub" style="font-size:22px">' + esc(t('qOf', { n: d.q + 1, m: d.n })) + '</div>' + tag(q) +
      '<div class="gh-q">' + esc(q.text) + '</div><div class="g-progress" style="width:min(700px,90%);height:14px"><i id="g-bar"></i></div>' +
      '<div class="gh-ctrl" style="justify-content:flex-end"><button class="gh-tbtn" type="button" data-act="reveal">' + esc(t('skip')) + ' ⏭</button></div>';
    tick();
  }
  function tiles(q, reveal) {
    return '<div class="g-tiles' + (q.answers.length === 2 ? ' two' : '') + '">' + q.answers.map(function (a, k) {
      var right = reveal && q.correct && q.correct.indexOf(k) >= 0;
      return '<div class="g-tile a' + k + (reveal && !right ? ' dim' : '') + '"><span class="g-shape">' + SHAPES[k] + '</span><span>' + esc(a) + '</span>' + (right ? '<span class="g-check">✓</span>' : '') + '</div>';
    }).join('') + '</div>';
  }
  function drawQuestion(d) {
    var q = d.question || { answers: [] }; var reveal = d.phase === 'reveal';
    var mid;
    if (reveal) {
      var max = Math.max(1, Math.max.apply(null, d.dist || [0]));
      mid = '<div></div><div class="gh-bars">' + q.answers.map(function (a, k) {
        var n = (d.dist || [])[k] || 0; var right = q.correct && q.correct.indexOf(k) >= 0;
        return '<div class="gh-bar a' + k + (right ? '' : ' dim') + '"><b style="font-size:26px">' + n + '</b><div class="fill" style="height:' + Math.round(n / max * 70) + '%"></div><div class="lab">' + SHAPES[k] + (right ? '✓' : '') + '</div></div>';
      }).join('') + '</div><div></div>';
    } else {
      mid = '<div class="gh-timer" id="g-timer">' + Math.max(0, Math.ceil((d.endsAt - now()) / 1000)) + '</div>' +
        '<div class="gh-media">' + (q.image ? '<img src="' + esc(q.image) + '" alt="">' : tag(q)) + '</div>' +
        '<div class="gh-answers"><b id="g-count">' + d.answered + '</b><span>' + esc(t('answersN')) + '</span></div>';
    }
    var info = reveal ? (d.answered ? '✓ ' + t('rightOf', { a: d.right, p: d.players.length }) : t('nobody')) : t('qOf', { n: d.q + 1, m: d.n });
    $('#stage').innerHTML = '<div class="gh-q">' + esc(q.text) + '</div><div class="gh-mid">' + mid + '</div>' + tiles(q, reveal) +
      '<div class="gh-ctrl"><span class="info">' + esc(info) + '</span>' +
      (reveal ? '<button class="gh-big-btn" type="button" data-act="next">' + esc(t('next')) + ' ▶</button>' : '<button class="gh-tbtn" type="button" data-act="reveal">' + esc(t('skip')) + ' ⏭</button>') + '</div>';
    if (!reveal) tick();
  }
  function drawBoard(d) {
    var top = d.top || [];
    $('#stage').innerHTML = '<div class="gh-heading">' + esc(t('scoreboard')) + '</div><div class="gh-board">' +
      (top.map(function (p, i) { return '<div style="animation-delay:' + (i * 0.08) + 's"><span>' + (i + 1) + '</span><b>' + esc(p.name) + '</b>' + (p.gain ? '<span class="gain">+' + p.gain + '</span>' : '') + '<span>' + p.score + '</span></div>'; }).join('') || '<div><b>' + esc(t('nobody')) + '</b></div>') +
      '</div><div class="gh-ctrl"><span class="info">' + esc(t('qOf', { n: d.q + 1, m: d.n })) + '</span><button class="gh-big-btn" type="button" data-act="next">' + esc(t('next')) + ' ▶</button></div>';
  }
  function drawFinal(d) {
    var p = d.players; var step = function (i, cls) {
      var x = p[i]; if (!x) return '<div class="gh-step ' + cls + '"></div>';
      return '<div class="gh-step ' + cls + '"><div class="who">' + esc(x.name) + '</div><div class="pts">' + x.score + ' ' + esc(t('points')) + '</div><div class="block">' + ['🥇', '🥈', '🥉'][i] + '</div></div>';
    };
    $('#stage').innerHTML = '<div class="gh-heading">🏆 ' + esc(d.title) + '</div>' +
      '<div class="gh-podium">' + step(1, 'p2') + step(0, 'p1') + step(2, 'p3') + '</div>' +
      '<details class="gh-table"><summary style="padding:10px 14px;cursor:pointer;font-weight:800">' + esc(t('allResults')) + ' (' + p.length + ')</summary><table><thead><tr><th>' + esc(t('rank')) + '</th><th>' + esc(t('player')) + '</th><th style="text-align:right">' + esc(t('score')) + '</th></tr></thead><tbody>' +
        p.map(function (x) { return '<tr><td>' + x.rank + '</td><td>' + esc(x.name) + '</td><td style="text-align:right">' + x.score + '</td></tr>'; }).join('') + '</tbody></table></details>' +
      '<div class="gh-ctrl" style="justify-content:center"><button class="gh-big-btn" type="button" id="g-csv">⬇ ' + esc(t('csv')) + '</button><button class="gh-big-btn" type="button" data-act="close">' + esc(t('closeGame')) + '</button></div>';
  }

  /* the clock and the reading bar */
  function tick() {
    clearInterval(tickT);
    tickT = setInterval(function () {
      if (!st) return;
      if (st.phase === 'ready') {
        var left = Math.max(0, st.openAt - now()); var bar = $('#g-bar'); if (bar) bar.style.transform = 'scaleX(' + Math.min(1, left / LEAD) + ')';
        if (left <= 0) { clearInterval(tickT); poll(); }
      } else if (st.phase === 'answer') {
        var s = Math.max(0, Math.ceil((st.endsAt - now()) / 1000)); var el = $('#g-timer');
        if (el) { el.textContent = s; el.classList.toggle('low', s <= 5); }
        if (s <= 0) { clearInterval(tickT); poll(); }
      } else clearInterval(tickT);
    }, 100);
  }

  /* the results as a table file (the full report of the admin panel) */
  function downloadCsv() {
    fetch('/api/admin/games/reports/' + st.sid, { credentials: 'same-origin', cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
      var r = d.report; if (!r) throw new Error('Report not found.');
      var cell = function (v) { var s = String(v == null ? '' : v); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
      var rows = [['Rank', 'Player', 'Points', 'Right', 'Answered', 'Questions played']].concat(r.players.map(function (p) { return [p.rank, p.name, p.score, p.right, p.answered, r.asked]; }));
      rows.push([]); rows.push(['Question', 'Right answer', 'Right', 'Answered']);
      r.questions.forEach(function (q, i) { rows.push([(i + 1) + '. ' + q.text, q.correct.map(function (k) { return q.answers[k]; }).join(' / '), q.right, q.answered]); });
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + rows.map(function (x) { return x.map(cell).join(','); }).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
      a.download = ('game-' + r.title + '-' + String(r.endedAt).slice(0, 10)).replace(/[^\w.-]+/g, '-') + '.csv';
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }).catch(function (e) { toast(e.message); });
  }

  /* ───────── buttons and keys ───────── */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (b && !b.disabled) {
      if (b.dataset.act === 'close' && !confirm(t('closeQ'))) return;
      act(b.dataset.act); return;
    }
    var k = e.target.closest('[data-kick]');
    if (k && confirm(t('removeQ', { name: k.dataset.name }))) { act('kick', { pid: k.dataset.kick }); return; }
    if (e.target.closest('#g-csv')) downloadCsv();
  });
  $('#h-lock').addEventListener('click', function () { if (st) act('lock', { locked: !st.locked }); });
  $('#h-end').addEventListener('click', function () { if (st && confirm(t('endQ'))) act('end'); });
  $('#h-full').addEventListener('click', function () {
    var el = document.documentElement;
    if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
  });
  document.addEventListener('keydown', function (e) {
    if (e.target.closest('input,textarea,select,details') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
      var b = document.querySelector('.gh-big-btn[data-act]:not([disabled])'); if (b && b.dataset.act !== 'close') { e.preventDefault(); act(b.dataset.act); }
    }
  });
  $('#lang-btn').addEventListener('click', function () { I.next(); });
  document.addEventListener('ix-lang', function () { if (st) { shown = ''; $('#stage').dataset.sig = ''; render(st); } });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !dead) poll(); });

  I.apply();
  if (!/^\d{6}$/.test(pin)) message(t('gameOver'), '/admin#games', t('toAdmin')); else poll();
})();
