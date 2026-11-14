/*
 * IELTSX Game -- the host screen (/game-host?pin=123456), shown on the classroom screen by an admin.
 * Lobby (the PIN, the players joining) -> each question: shown for a moment, the clock with the answer count, the right
 * answer with how many chose each tile and the fastest player -> the ranking of ALL players (place, change, points
 * of this question, total) -> ... -> the podium. With Auto on (the default) the game moves on by itself: when everybody
 * has answered (or the time is up) the right answer is shown, then the ranking, then the next question; the big
 * button skips the wait. The screen asks the server (GET /api/admin/games/live/<pin>, quiz-game.js) and every action
 * (POST {action}) answers with the new state, which is drawn at once. Keys: Space / Enter / → = the big button.
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
  var pin = String(new URLSearchParams(location.search).get('pin') || '').replace(/\D/g, '');
  var st = null, offset = 0, synced = false, pollT = 0, tickT = 0, autoT = 0, autoKey = '', shown = '', acting = false, autoQ = -1, failures = 0, dead = false, inflight = false;
  var now = function () { return Date.now() + offset; };
  function toast(m) { var el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 3500); }
  function call(method, body) {
    return fetch('/api/admin/games/live/' + pin, { method: method, credentials: 'same-origin', cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) { var e = new Error(d.error || ('Error ' + r.status)); e.status = r.status; throw e; } return d; }); });
  }
  function message(text, link, label) {
    dead = true; clearTimeout(pollT); clearInterval(tickT); clearTimeout(autoT);
    ['#h-pin', '#h-count', '#h-lock', '#h-end', '#h-auto'].forEach(function (s) { $(s).hidden = true; });
    $('#stage').innerHTML = '<div class="gh-msg"><div class="g-big" style="font-size:22px">' + esc(text) + '</div>' + (link ? '<div><a href="' + esc(link) + '">' + esc(label) + '</a></div>' : '') + '</div>';
  }
  function sync(d, t0) {
    var t1 = Date.now(); var o = d.now - (t0 + t1) / 2;
    offset = !synced || Math.abs(o - offset) > 800 ? o : offset * 0.8 + o * 0.2; synced = true;
  }

  /* ───────── ask the server ───────── */
  function poll() {
    clearTimeout(pollT); if (dead || inflight) return;
    inflight = true; var t0 = Date.now();
    call('GET').then(function (d) {
      inflight = false; sync(d, t0); failures = 0; $('#offline').hidden = true;
      render(d); schedule(d);
    }).catch(function (e) {
      inflight = false;
      if (e.status === 401) return message(t('hostOnly'), '/login?next=' + encodeURIComponent(location.pathname + location.search), t('signIn'));
      if (e.status === 403) return message(t('hostOnly'), '/', 'IELTSX');
      if (e.status === 404) return message(t('gameOver'), '/admin#games', t('toAdmin'));
      failures++; if (failures > 1) $('#offline').hidden = false;
      pollT = setTimeout(poll, Math.min(5000, 800 * failures));
    });
  }
  function schedule(d) {
    clearTimeout(pollT); if (dead || d.phase === 'final') return;
    var wait = 1000;
    if (d.phase === 'ready') wait = d.openAt - now() + 60;
    if (d.phase === 'answer') wait = Math.min(500, d.endsAt - now() + 120);   // everybody answered? -> the answer at once
    pollT = setTimeout(poll, Math.max(120, Math.min(document.hidden ? 3000 : 1000, wait)));
  }
  function act(action, extra) {
    if (acting || !st) return Promise.resolve();
    acting = true; clearTimeout(autoT); document.querySelectorAll('[data-act]').forEach(function (b) { b.disabled = true; });
    var body = Object.assign({ action: action, q: st.q }, extra || {}); var t0 = Date.now();
    return call('POST', body).then(function (d) {
      if (d.closed) { location.href = '/admin#games'; return; }
      acting = false; sync(d, t0); render(d); schedule(d);   // the new state comes with the answer: drawn at once
    }).catch(function (e) {
      acting = false;
      if (e.status === 404) return message(t('gameOver'), '/admin#games', t('toAdmin'));
      if (e.status !== 409) toast(e.status === 400 && /player/i.test(e.message) ? t('needPlayer') : e.message);
      shown = ''; poll();
    });
  }

  /* ───────── draw ───────── */
  function header(d) {
    $('#h-title').textContent = d.title;
    $('#h-subject').textContent = d.subject + ' · ' + (d.mode === 'phone' ? '📱 ' + t('modePhone') : '🖥️ ' + t('modeClassic'));
    document.title = d.title + ' — PIN ' + d.pin;
    $('#h-pin').hidden = false; $('#h-pin').textContent = 'PIN ' + d.pin.slice(0, 3) + ' ' + d.pin.slice(3);
    $('#h-count').hidden = false; $('#h-count-n').textContent = d.players.length;
    $('#h-lock').hidden = d.phase === 'final'; $('#h-lock').textContent = d.locked ? '🔒 ' + t('unlock') : '🔓 ' + t('lock'); $('#h-lock').classList.toggle('on', d.locked);
    $('#h-auto').hidden = d.phase === 'final'; $('#h-auto').innerHTML = '<span class="sw' + (d.auto ? ' on' : '') + '"></span>' + esc(t('auto'));
    $('#h-auto').setAttribute('aria-pressed', d.auto ? 'true' : 'false'); $('#h-auto').title = d.auto ? t('autoOnHint') : t('autoOffHint');
    $('#h-end').hidden = d.phase === 'final' || d.phase === 'lobby';
  }
  function render(d) {
    st = d; header(d);
    var key = d.phase + ':' + d.q;
    if (d.phase === 'lobby') return drawLobby(d);   // drawn on every answer: the players come and go
    if (d.phase === 'answer') {
      if (key !== shown) { shown = key; drawQuestion(d); }
      var c = $('#g-count'); if (c) c.textContent = d.answered;
      var pb = $('#g-answered'); if (pb) pb.style.transform = 'scaleX(' + (d.players.length ? d.answered / d.players.length : 0) + ')';
      if (d.players.length && d.answered >= d.players.length && autoQ !== d.q) { autoQ = d.q; act('reveal'); }   // everybody answered
      return;
    }
    if (key !== shown) {
      shown = key;
      if (d.phase === 'ready') drawReady(d);
      else if (d.phase === 'reveal') drawQuestion(d);
      else if (d.phase === 'scoreboard') drawBoard(d);
      else if (d.phase === 'final') drawFinal(d);
    }
    planAuto(d);
  }
  /* Auto: the right answer and the ranking stay for a moment, then the game goes on by itself (the big button fills up) */
  function planAuto(d) {
    var key = d.phase + ':' + d.q + ':' + d.auto;
    if (key === autoKey) return;
    autoKey = key; clearTimeout(autoT);
    var btn = document.querySelector('.gh-big-btn[data-act="next"]'); var fill = btn && btn.querySelector('.fill');
    if (!d.auto || (d.phase !== 'reveal' && d.phase !== 'scoreboard')) { if (fill) { fill.style.transition = 'none'; fill.style.width = '0'; } return; }
    var ms = Math.max(300, d.phaseAt + (d.phase === 'reveal' ? d.revealMs : d.boardMs) - now());
    if (fill) { fill.style.transition = 'none'; fill.style.width = '0'; void fill.offsetWidth; fill.style.transition = 'width ' + ms + 'ms linear'; fill.style.width = '100%'; }
    autoT = setTimeout(function () { if (st && st.phase === d.phase && st.q === d.q && st.auto) act('next'); }, ms);
  }
  function drawLobby(d) {
    var host = location.host.replace(/^www\./, '');
    var sig = d.players.map(function (p) { return p.pid; }).join(',') + '|' + d.locked + '|' + I.lang + '|' + d.mode;
    if (shown === 'lobby' && $('#stage').dataset.sig === sig) return;
    var isNew = function (p) { return shown === 'lobby' && ($('#stage').dataset.sig || '').indexOf(p.pid) < 0; };
    var players = d.players.slice().reverse().map(function (p) { return '<button class="gh-player' + (isNew(p) ? ' new' : '') + '" type="button" data-kick="' + esc(p.pid) + '" data-name="' + esc(p.name) + '" title="' + esc(t('kickHint')) + '">' + esc(p.name) + '</button>'; }).join('');
    shown = 'lobby'; $('#stage').dataset.sig = sig;
    $('#stage').innerHTML =
      '<div class="gh-join"><div class="url">' + esc(t('joinAt')) + '<b>' + esc(host) + '/game</b></div><div class="pin"><small>' + esc(t('gamePin')) + '</small><b>' + esc(d.pin.slice(0, 3) + ' ' + d.pin.slice(3)) + '</b></div></div>' +
      '<div class="gh-modechip">' + (d.mode === 'phone' ? '📱 ' + esc(t('modePhone')) : '🖥️ ' + esc(t('modeClassic'))) + '</div>' +
      '<div class="gh-lobby-bar"><span class="gh-count big">👥 ' + d.players.length + ' ' + esc(t('playersN')) + '</span>' +
        (d.locked ? '<span class="g-tag">🔒 ' + esc(t('lockedNote')) + '</span>' : '<span class="gh-note">' + esc(d.players.length ? t('kickHint') : '') + '</span>') +
        '<button class="gh-big-btn go" type="button" data-act="start" ' + (d.players.length ? '' : 'disabled') + '>' + esc(t('start')) + ' ▶</button></div>' +
      '<div class="gh-players">' + (players || '<div class="g-sub" style="align-self:center">' + esc(t('waitingPlayers')) + ' <span class="g-dots"><i></i><i></i><i></i></span></div>') + '</div>';
  }
  function tag(q) { return q.points === 2 ? '<span class="g-tag">⚡ ' + esc(t('double')) + '</span>' : q.points === 0 ? '<span class="g-tag">' + esc(t('noPoints')) + '</span>' : ''; }
  function drawReady(d) {
    var q = d.question || {};
    $('#stage').innerHTML = '<div class="gh-qnum">' + esc(t('qOf', { n: d.q + 1, m: d.n })) + '</div>' + tag(q) +
      '<div class="gh-q big">' + esc(q.text) + '</div>' + (q.image ? '<div class="gh-media"><img src="' + esc(q.image) + '" alt=""></div>' : '') +
      '<div class="g-progress" style="width:min(700px,90%);height:14px"><i id="g-bar"></i></div>' +
      '<div class="gh-ctrl" style="justify-content:flex-end"><button class="gh-tbtn" type="button" data-act="reveal">' + esc(t('skip')) + ' ⏭</button></div>';
    tick();
  }
  function tiles(q, reveal) {
    return '<div class="g-tiles' + (q.answers.length === 2 ? ' two' : '') + '">' + q.answers.map(function (a, k) {
      var right = reveal && q.correct && q.correct.indexOf(k) >= 0;
      return '<div class="g-tile a' + k + (reveal && !right ? ' dim' : '') + (right ? ' right' : '') + '"><span class="g-shape">' + SHAPES[k] + '</span><span class="g-tile-text">' + esc(a) + '</span>' + (right ? '<span class="g-check">✓</span>' : '') + '</div>';
    }).join('') + '</div>';
  }
  function nextBtn(label) { return '<button class="gh-big-btn gh-next" type="button" data-act="next"><span class="fill" aria-hidden="true"></span><span class="lab">' + esc(label) + ' ▶</span></button>'; }
  function drawQuestion(d) {
    var q = d.question || { answers: [] }; var reveal = d.phase === 'reveal';
    var mid;
    if (reveal) {
      var max = Math.max(1, Math.max.apply(null, d.dist || [0]));
      mid = '<div></div><div class="gh-bars">' + q.answers.map(function (a, k) {
        var n = (d.dist || [])[k] || 0; var right = q.correct && q.correct.indexOf(k) >= 0;
        return '<div class="gh-bar a' + k + (right ? '' : ' dim') + '"><b>' + n + '</b><div class="fill" style="height:' + Math.max(4, Math.round(n / max * 100)) + '%"></div><div class="lab">' + SHAPES[k] + (right ? '✓' : '') + '</div></div>';
      }).join('') + '</div><div></div>';
    } else {
      mid = '<div class="gh-timer" id="g-timer">' + Math.max(0, Math.ceil((d.endsAt - now()) / 1000)) + '</div>' +
        '<div class="gh-media">' + (q.image ? '<img src="' + esc(q.image) + '" alt="">' : tag(q)) + '</div>' +
        '<div class="gh-answers"><b id="g-count">' + d.answered + '</b><span>' + esc(t('answersN')) + '</span><span class="gh-abar"><i id="g-answered"></i></span></div>';
    }
    var fast = reveal ? d.players.filter(function (p) { return p.ok; }).sort(function (a, b) { return (a.ms || 0) - (b.ms || 0); })[0] : null;
    var info = reveal ? (d.answered ? '✓ ' + esc(t('rightOf', { a: d.right, p: d.players.length })) + (fast ? ' · ⚡ ' + esc(t('fastest')) + ': <b>' + esc(fast.name) + '</b> (' + ((fast.ms || 0) / 1000).toFixed(1) + ' ' + esc(t('sec')) + ')' : '') : esc(t('nobody'))) : esc(t('qOf', { n: d.q + 1, m: d.n }));
    $('#stage').innerHTML = '<div class="gh-q">' + esc(q.text) + '</div><div class="gh-mid">' + mid + '</div>' + tiles(q, reveal) +
      '<div class="gh-ctrl"><span class="info">' + info + '</span>' +
      (reveal ? nextBtn(t('scoreboard')) : '<button class="gh-tbtn" type="button" data-act="reveal">' + esc(t('skip')) + ' ⏭</button>') + '</div>';
    if (!reveal) tick();
  }
  /* the ranking after every question: every player with the place, the change of place, the points of this question and the total */
  function drawBoard(d) {
    var ps = d.players; var big = ps.slice(0, 8), rest = ps.slice(8);
    var move = function (p) { return p.move > 0 ? '<span class="mv up">▲' + p.move + '</span>' : p.move < 0 ? '<span class="mv down">▼' + (-p.move) + '</span>' : '<span class="mv"></span>'; };
    var gain = function (p) { return p.gain ? '<span class="gain">+' + p.gain + '</span>' : p.answered ? '<span class="gain bad">✗</span>' : '<span class="gain none">–</span>'; };
    $('#stage').innerHTML = '<div class="gh-heading">' + esc(t('scoreboard')) + ' <small>' + esc(t('qOf', { n: d.q + 1, m: d.n })) + '</small></div>' +
      '<div class="gh-board">' + (big.map(function (p, i) {
        return '<div class="row r' + p.rank + '" style="animation-delay:' + (i * 0.06) + 's"><span class="rk">' + (p.rank <= 3 ? ['🥇', '🥈', '🥉'][p.rank - 1] : p.rank) + '</span>' + move(p) + '<b>' + esc(p.name) + '</b>' + gain(p) + '<span class="sc">' + p.score + '</span></div>';
      }).join('') || '<div class="row"><b>' + esc(t('nobody')) + '</b></div>') + '</div>' +
      (rest.length ? '<div class="gh-board-rest">' + rest.map(function (p) { return '<div><span class="rk">' + p.rank + '</span>' + move(p) + '<b>' + esc(p.name) + '</b>' + gain(p) + '<span class="sc">' + p.score + '</span></div>'; }).join('') + '</div>' : '') +
      '<div class="gh-ctrl"><span class="info">' + esc(t('rightOf', { a: d.players.filter(function (p) { return p.ok; }).length, p: d.players.length })) + '</span>' + nextBtn(d.last ? t('results') : t('nextQuestion')) + '</div>';
  }
  function drawFinal(d) {
    var p = d.players; var step = function (i, cls) {
      var x = p[i]; if (!x) return '<div class="gh-step ' + cls + '"></div>';
      return '<div class="gh-step ' + cls + '"><div class="who">' + esc(x.name) + '</div><div class="pts">' + x.score + ' ' + esc(t('points')) + '</div><div class="block">' + ['🥇', '🥈', '🥉'][i] + '</div></div>';
    };
    var colors = ['#e5484d', '#3e63dd', '#f5a524', '#2f9e66', '#ffd166', '#fff'], conf = '';
    for (var i = 0; i < 90; i++) conf += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;background:' + colors[i % colors.length] + ';animation-delay:' + (1 + Math.random() * 2).toFixed(2) + 's;animation-duration:' + (2.6 + Math.random() * 2).toFixed(2) + 's"></i>';
    $('#stage').innerHTML = '<div class="g-confetti" aria-hidden="true">' + conf + '</div><div class="gh-heading">🏆 ' + esc(d.title) + '</div>' +
      '<div class="gh-podium">' + step(1, 'p2') + step(0, 'p1') + step(2, 'p3') + '</div>' +
      '<details class="gh-table" open><summary>' + esc(t('allResults')) + ' (' + p.length + ')</summary><table><thead><tr><th>' + esc(t('rank')) + '</th><th>' + esc(t('player')) + '</th><th style="text-align:right">' + esc(t('score')) + '</th></tr></thead><tbody>' +
        p.map(function (x) { return '<tr><td>' + x.rank + '</td><td>' + esc(x.name) + '</td><td style="text-align:right">' + x.score + '</td></tr>'; }).join('') + '</tbody></table></details>' +
      '<div class="gh-ctrl" style="justify-content:center"><button class="gh-big-btn" type="button" id="g-csv">⬇ ' + esc(t('csv')) + '</button><button class="gh-big-btn" type="button" data-act="close">' + esc(t('closeGame')) + '</button></div>';
  }

  /* the clock and the reading bar */
  function tick() {
    clearInterval(tickT);
    tickT = setInterval(function () {
      if (!st) return;
      if (st.phase === 'ready') {
        var lead = Math.max(1, st.openAt - st.phaseAt), left = Math.max(0, st.openAt - now()); var bar = $('#g-bar'); if (bar) bar.style.transform = 'scaleX(' + Math.min(1, left / lead) + ')';
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
      var qn = r.questions.map(function (q, i) { return 'Q' + (i + 1); });
      var rows = [['Rank', 'Player', 'Points', 'Right', 'Answered', 'Questions played'].concat(qn)].concat(r.players.map(function (p) {
        return [p.rank, p.name, p.score, p.right, p.answered, r.asked].concat((p.a || []).map(function (x, i) { return x ? (r.questions[i].answers[x[0]] || '') + (x[1] ? ' ✓' : ' ✗') : '–'; }));
      }));
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
  $('#h-auto').addEventListener('click', function () { if (st) act('auto', { auto: !st.auto }); });
  $('#h-lock').addEventListener('click', function () { if (st) act('lock', { locked: !st.locked }); });
  $('#h-end').addEventListener('click', function () { if (st && confirm(t('endQ'))) act('end'); });
  $('#h-full').addEventListener('click', function () {
    var el = document.documentElement;
    if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
  });
  document.addEventListener('keydown', function (e) {
    if (e.target.closest('input,textarea,select,summary') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
      var b = document.querySelector('.gh-big-btn[data-act]:not([disabled])'); if (b && b.dataset.act !== 'close') { e.preventDefault(); act(b.dataset.act); }
    }
  });
  $('#lang-btn').addEventListener('click', function () { I.next(); });
  document.addEventListener('ix-lang', function () { if (st) { shown = ''; autoKey = ''; $('#stage').dataset.sig = ''; render(st); } });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !dead) poll(); });

  I.apply();
  if (!/^\d{6}$/.test(pin)) message(t('gameOver'), '/admin#games', t('toAdmin')); else poll();
})();
