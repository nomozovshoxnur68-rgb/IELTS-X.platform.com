/*
 * IELTSX admin: Games (admin.html#games) -- live quiz games for every subject.
 *   - Make a game: name, subject (Huquq, Matematika, IELTS ... or any other), questions with 2-4 answers, the right
 *     answer(s), a time limit and points. Questions can be pasted as text ("Import from text").
 *   - "Host live" gives the game a 6-digit PIN and opens the host screen (/game-host) for the classroom screen; the
 *     students open /game, type the PIN and play on their phones.
 *   - Past games keep a report: the ranking and how many got each question right (CSV download).
 * The server checks everything again (quiz-game.js).
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const SHAPES = ['▲', '◆', '●', '■'];
  const TIMES = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240];
  const POINTS = [[1, 'Standard points'], [2, 'Double points'], [0, 'No points']];
  const COVERS = [['#820241', '#c2185b'], ['#1e3a8a', '#3b82f6'], ['#065f46', '#10b981'], ['#7c2d12', '#f97316'], ['#4c1d95', '#8b5cf6'], ['#0f766e', '#22d3ee'], ['#9f1239', '#fb7185'], ['#334155', '#64748b']];
  let data = null, edit = null, busy = false, loading = false, subject = 'all', search = '', importOpen = false, report = null;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin#games')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const coverOf = (s) => { let h = 0; for (const c of String(s || '')) h = (h * 31 + c.charCodeAt(0)) >>> 0; return COVERS[h % COVERS.length]; };
  const fmtDate = (v) => { const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); };
  const fmtWhen = (v) => { const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); };
  const mins = (s) => { s = Number(s) || 0; return s < 60 ? s + ' s' : Math.round(s / 60) + ' min'; };
  const PHASE = { lobby: 'Waiting for players', ready: 'Question on screen', answer: 'Answering', reveal: 'Showing the answer', scoreboard: 'Scoreboard', final: 'Finished' };

  async function load() {
    if (loading) return; loading = true; render();
    try { data = await api('/api/admin/games'); } catch (e) { fail(e); data = data || { quizzes: [], live: [], reports: [], subjects: [] }; }
    loading = false; render(); livePill();
  }
  function livePill() { const p = $('#games-live'); if (!p || !data) return; const n = (data.live || []).filter((g) => g.phase !== 'final').length; p.textContent = n; p.hidden = !n; }

  /* ───────── a new question ───────── */
  const blankQ = (type) => (type === 'tf' ? { type: 'tf', text: '', image: '', answers: ['True', 'False'], correct: [0], time: 10, points: 1 } : { type: 'quiz', text: '', image: '', answers: ['', '', '', ''], correct: [], time: 20, points: 1 });
  const fourAnswers = (q) => { const a = (q.answers || []).slice(0, 4); while (q.type !== 'tf' && a.length < 4) a.push(''); return a; };

  /* ───────── questions pasted as text ─────────
       1. Which article of the Constitution …?      <- the question (a number in front is removed)
       A) 12                                         <- the answers: A) B) C) D)  or  1) 2) …  or  - …
       *B) 15                                        <- * (or +) marks the right answer
       C) 20
       Javob: B                                      <- or the right answer on its own line (Answer: / Javob: / Ответ:)
     An empty line starts the next question. */
  function parseText(src) {
    const out = []; const bad = [];
    const blocks = String(src || '').replace(/\r/g, '').split(/\n\s*\n/).map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean)).filter((b) => b.length);
    const ANS = /^([*+✓✔])?\s*(?:([A-Da-d]|[1-4])\s*[).:\]-]|[-•–])\s*(.+)$/;
    const KEY = /^(?:answer|javob|to['‘’`]?g['‘’`]?ri javob|ответ|key|correct)\s*[:=-]\s*([A-Da-d1-4]|true|false|to['‘’`]?g['‘’`]?ri|noto['‘’`]?g['‘’`]?ri|ha|yo['‘’`]?q)\s*$/i;
    blocks.forEach((lines, bi) => {
      const q = { type: 'quiz', text: '', image: '', answers: [], correct: [], time: 20, points: 1 };
      let key = null; const text = [];
      lines.forEach((l) => {
        const k = l.match(KEY); if (k) { key = k[1].toLowerCase(); return; }
        const a = q.answers.length < 4 && (text.length || q.answers.length) ? l.match(ANS) : null;
        const star = /^[*+✓✔]\s*\S/.test(l) && text.length;
        if (a || star) {
          const body = a ? a[3] : l.replace(/^[*+✓✔]\s*/, '');
          if ((a && a[1]) || star) q.correct.push(q.answers.length);
          q.answers.push(body.replace(/\s+/g, ' ').trim());
        } else if (!q.answers.length) text.push(l.replace(/^(?:\d{1,3}|savol|question|вопрос)\s*[).:-]\s*/i, ''));
      });
      q.text = text.join('\n').trim();
      if (key) {
        if (/^[a-d]$/.test(key)) q.correct = ['a', 'b', 'c', 'd'].indexOf(key) < q.answers.length ? [['a', 'b', 'c', 'd'].indexOf(key)] : [];
        else if (/^[1-4]$/.test(key)) q.correct = Number(key) <= q.answers.length ? [Number(key) - 1] : [];
        else if (!q.answers.length) { q.type = 'tf'; q.answers = /^(true|false)$/.test(key) ? ['True', 'False'] : ['Toʻgʻri', 'Notoʻgʻri']; q.correct = [/^(true|to|ha)/.test(key) ? 0 : 1]; }
      }
      if (q.answers.length === 2 && /^(true|to['‘’`]?g['‘’`]?ri|ha)$/i.test(q.answers[0]) && /^(false|noto['‘’`]?g['‘’`]?ri|yo['‘’`]?q)$/i.test(q.answers[1])) { q.type = 'tf'; q.time = 10; }
      if (!q.text || q.answers.length < 2 || !q.correct.length) bad.push(bi + 1); else { q.answers = fourAnswers(q); out.push(q); }
    });
    return { questions: out, bad };
  }

  /* ───────── cards ───────── */
  function card(g) {
    const [c1, c2] = coverOf(g.subject);
    return `<article class="gm-card">
      <div class="gm-cover" style="--c1:${c1};--c2:${c2}">${g.coverUrl ? `<img src="${esc(g.coverUrl)}" alt="">` : `<span class="gm-cover-mark">${esc(String(g.subject || '?').slice(0, 2).toUpperCase())}</span>`}
        <span class="gm-subj">${esc(g.subject)}</span><span class="gm-n">${g.count || 0} Q</span></div>
      <div class="gm-body">
        <strong class="gm-title">${esc(g.title)}</strong>
        ${g.description ? `<p class="muted sm gm-desc">${esc(g.description)}</p>` : ''}
        <div class="muted sm">${g.count || 0} question${g.count === 1 ? '' : 's'} · about ${mins((g.totalTime || 0) + (g.count || 0) * 12)} · ${g.plays ? 'played ' + g.plays + (g.plays === 1 ? ' time' : ' times') : 'not played yet'}</div>
        <div class="btn-row"><button class="btn btn-sm btn-primary" data-gm="host" data-id="${esc(g.id)}" type="button" ${busy ? 'disabled' : ''}>▶ Host live</button>
          <button class="btn btn-sm" data-gm="edit" data-id="${esc(g.id)}" type="button">Edit</button>
          <button class="btn btn-sm" data-gm="copy" data-id="${esc(g.id)}" type="button">Duplicate</button>
          <button class="btn btn-sm btn-danger" data-gm="del" data-id="${esc(g.id)}" type="button">Delete</button></div>
      </div></article>`;
  }
  function liveBlock() {
    const live = (data.live || []);
    if (!live.length) return '';
    return `<div class="gm-live"><div class="section-title" style="font-size:14px">● Live now</div>${live.map((g) => `<div class="gm-live-row">
        <span class="gm-pin">${esc(g.pin.slice(0, 3) + ' ' + g.pin.slice(3))}</span>
        <div class="grow"><strong>${esc(g.title)}</strong><div class="muted sm">${esc(g.subject)} · ${esc(PHASE[g.phase] || g.phase)}${g.q >= 0 ? ' · question ' + (g.q + 1) + ' of ' + g.n : ''} · by ${esc((g.host && g.host.name) || '—')} · ${fmtWhen(g.createdAt)}</div></div>
        <a class="btn btn-sm btn-primary" href="/game-host?pin=${esc(g.pin)}" target="_blank" rel="noopener">Open host screen ↗</a>
        <button class="btn btn-sm btn-danger" data-gm="close" data-pin="${esc(g.pin)}" type="button">Close</button></div>`).join('')}</div>`;
  }
  function reportsBlock() {
    const list = data.reports || [];
    return `<div class="card"><div class="section-head"><div><div class="section-title">Past games</div><div class="muted sm">Every game that reached the end (or was ended by the host): the ranking and how many players got each question right.</div></div></div>
      <div class="table-wrap"><table class="table"><thead><tr><th>When</th><th>Game</th><th>Subject</th><th class="right">Players</th><th>Winner</th><th class="right">Right answers</th><th>Actions</th></tr></thead><tbody>
      ${list.map((r) => `<tr><td class="nowrap">${fmtWhen(r.endedAt)}</td><td><strong>${esc(r.title)}</strong><div class="muted sm">${r.asked} of ${r.total} questions · PIN ${esc(r.pin)}</div></td><td>${esc(r.subject)}</td>
        <td class="right">${r.count || 0}</td><td>${r.winner ? esc(r.winner.name) + ` <span class="muted sm">${r.winner.score}</span>` : '—'}</td><td class="right">${r.avgRight || 0}%</td>
        <td><div class="actions"><button class="btn btn-sm btn-primary" data-gm="report" data-sid="${esc(r.sid)}" type="button">Open</button><button class="btn btn-sm" data-gm="csv" data-sid="${esc(r.sid)}" type="button">⬇ CSV</button><button class="btn btn-sm btn-danger" data-gm="delrep" data-sid="${esc(r.sid)}" type="button">Delete</button></div></td></tr>`).join('')
        || '<tr><td colspan="7" class="empty">No finished games yet.</td></tr>'}</tbody></table></div></div>`;
  }

  /* ───────── the editor ───────── */
  function questionBlock(q, i, n) {
    const tf = q.type === 'tf'; const answers = tf ? q.answers.slice(0, 2) : fourAnswers(q);
    const opt = (v, l, cur) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${esc(l)}</option>`;
    return `<div class="gm-q" data-qi="${i}">
      <div class="gm-q-head"><span class="cb-qn">${i + 1}</span>
        <select class="field gm-sel" data-q="${i}" data-k="type" aria-label="Question type">${opt('quiz', 'Quiz (2–4 answers)', q.type)}${opt('tf', 'True / False', q.type)}</select>
        <select class="field gm-sel" data-q="${i}" data-k="time" aria-label="Time limit">${TIMES.map((t) => opt(t, '⏱ ' + (t < 60 ? t + ' sec' : t / 60 + ' min'), q.time)).join('')}</select>
        <select class="field gm-sel" data-q="${i}" data-k="points" aria-label="Points">${POINTS.map(([v, l]) => opt(v, l, q.points)).join('')}</select>
        <span class="grow"></span>
        <button class="btn btn-sm" data-gm="up" data-qi="${i}" type="button" title="Move up" ${i ? '' : 'disabled'}>↑</button>
        <button class="btn btn-sm" data-gm="down" data-qi="${i}" type="button" title="Move down" ${i < n - 1 ? '' : 'disabled'}>↓</button>
        <button class="btn btn-sm" data-gm="dupq" data-qi="${i}" type="button" title="Duplicate">⧉</button>
        <button class="btn btn-sm btn-danger" data-gm="delq" data-qi="${i}" type="button" title="Delete">✕</button></div>
      <textarea class="field gm-q-text" data-q="${i}" data-k="text" rows="2" maxlength="400" placeholder="Type the question">${esc(q.text)}</textarea>
      <div class="gm-q-img">${q.image ? `<img src="${esc(q.image)}" alt="">` : ''}
        <input class="field" data-q="${i}" data-k="image" value="${esc(q.image)}" placeholder="Picture (optional): https://… or upload">
        <button class="btn btn-sm" data-gm="qimg" data-qi="${i}" type="button" ${busy ? 'disabled' : ''}>⬆ Upload</button>${q.image ? `<button class="btn btn-sm" data-gm="noimg" data-qi="${i}" type="button">Remove</button>` : ''}</div>
      <div class="gm-answers">${answers.map((a, k) => `<div class="gm-ans gm-a${k}${q.correct.includes(k) ? ' is-right' : ''}">
          <span class="gm-shape" aria-hidden="true">${SHAPES[k]}</span>
          <input class="gm-ans-in" data-q="${i}" data-a="${k}" value="${esc(a)}" maxlength="160" placeholder="Answer ${k + 1}${k > 1 ? ' (optional)' : ''}" aria-label="Answer ${k + 1}">
          <label class="gm-okwrap" title="Right answer"><input type="checkbox" class="gm-ok" data-q="${i}" data-c="${k}" ${q.correct.includes(k) ? 'checked' : ''} aria-label="Answer ${k + 1} is right"><span class="gm-tick" aria-hidden="true">✓</span></label></div>`).join('')}</div>
    </div>`;
  }
  function form() {
    const f = edit; const subs = (data && data.subjects) || [];
    return `<div class="cb-block gm-form" id="gm-form">
      <div class="section-head" style="margin:0"><strong>${f.id ? 'Edit “' + esc(f.title) + '”' : 'New game'}</strong><span class="muted sm">${f.questions.length} question${f.questions.length === 1 ? '' : 's'}</span></div>
      <div class="cb-grid"><label class="lbl">Name of the game *<input class="field" data-f="title" maxlength="120" value="${esc(f.title)}" placeholder="e.g. Konstitutsiya: 1-bob"></label>
        <label class="lbl">Subject *<input class="field" data-f="subject" maxlength="40" value="${esc(f.subject)}" list="gm-subjects" placeholder="Huquq, Matematika, IELTS …"><datalist id="gm-subjects">${subs.map((s) => `<option value="${esc(s)}">`).join('')}</datalist></label></div>
      <label class="lbl">Short description (optional)<textarea class="field" data-f="description" rows="2" maxlength="400" placeholder="Topic, class, level …">${esc(f.description)}</textarea></label>
      <div class="gm-q-img"><span class="lbl" style="margin:0">Card picture (optional)</span><input class="field" data-f="coverUrl" value="${esc(f.coverUrl)}" placeholder="https://… or upload">
        <button class="btn btn-sm" data-gm="cover" type="button" ${busy ? 'disabled' : ''}>⬆ Upload</button>${f.coverUrl ? '<button class="btn btn-sm" data-gm="nocover" type="button">Remove</button>' : ''}</div>
      <div class="gm-qbar"><strong>Questions</strong><span class="grow"></span>
        <button class="btn btn-sm" data-gm="addq" type="button">+ Question</button><button class="btn btn-sm" data-gm="addtf" type="button">+ True / False</button>
        <button class="btn btn-sm${importOpen ? ' btn-primary' : ''}" data-gm="import" type="button">⇪ Import from text</button></div>
      ${importOpen ? `<div class="gm-import"><textarea class="field" id="gm-import-text" rows="9" placeholder="1. Question text\nA) answer\n*B) right answer\nC) answer\nD) answer\n\n2. Next question …\nA) …\nB) …\nJavob: A"></textarea>
        <div class="muted sm">One question per block, an empty line between questions. Answers start with <b>A)</b> <b>B)</b> <b>C)</b> <b>D)</b> (or 1) 2) …, or a dash). Mark the right answer with <b>*</b> in front, or add a line <b>Javob: B</b> / <b>Answer: B</b>. A question with <b>Javob: true</b> / <b>false</b> and no answers becomes True / False.</div>
        <div class="btn-row"><button class="btn btn-primary btn-sm" data-gm="doimport" type="button">Add these questions</button><button class="btn btn-sm" data-gm="import" type="button">Close</button></div></div>` : ''}
      <div class="gm-qs">${f.questions.map((q, i) => questionBlock(q, i, f.questions.length)).join('') || '<div class="empty">No questions yet. Add one, or paste many with “Import from text”.</div>'}</div>
      ${f.questions.length ? '<div class="btn-row"><button class="btn btn-sm" data-gm="addq" type="button">+ Question</button><button class="btn btn-sm" data-gm="addtf" type="button">+ True / False</button></div>' : ''}
      <div class="btn-row gm-save"><button class="btn btn-primary" data-gm="save" type="button" ${busy ? 'disabled' : ''}>${f.id ? 'Save changes' : 'Create game'}</button>
        <button class="btn" data-gm="savehost" type="button" ${busy ? 'disabled' : ''}>Save and host live ▶</button><button class="btn" data-gm="cancel" type="button">Cancel</button></div></div>`;
  }

  function render() {
    const mount = $('#content-games'); if (!mount) return;
    if (!data) { mount.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
    const all = data.quizzes || [];
    const counts = {}; all.forEach((g) => { counts[g.subject] = (counts[g.subject] || 0) + 1; });
    const subjects = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    if (subject !== 'all' && !counts[subject]) subject = 'all';
    const q = search.trim().toLowerCase();
    const list = all.filter((g) => (subject === 'all' || g.subject === subject) && (!q || (g.title + ' ' + g.subject + ' ' + (g.description || '')).toLowerCase().includes(q)));
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">Games · live quiz for every subject</div>
        <div class="muted sm">Make a game for any subject (Huquq, Matematika, IELTS …). Press <b>▶ Host live</b>: the game gets a PIN and the host screen opens for the classroom screen. Students open <b>${esc(location.host)}/game</b> (or “Game” in the site menu), type the PIN and their name, and answer on their phones. Faster right answers get more points.</div></div>
        ${edit ? '' : '<div class="btn-row"><a class="btn" href="/game" target="_blank" rel="noopener">Join page ↗</a><button class="btn btn-primary" data-gm="new" type="button">+ New game</button></div>'}</div>
      ${liveBlock()}
      ${edit ? form() : ''}
      ${edit ? '' : `<div class="tabs gm-tabs"><button class="tab${subject === 'all' ? ' active' : ''}" data-gm="subject" data-s="all" type="button">All<span class="n">${all.length}</span></button>${subjects.map((s) => `<button class="tab${subject === s ? ' active' : ''}" data-gm="subject" data-s="${esc(s)}" type="button">${esc(s)}<span class="n">${counts[s]}</span></button>`).join('')}</div>
      ${all.length > 6 ? `<div class="toolbar"><input class="field grow" id="gm-search" type="search" placeholder="Search games" value="${esc(search)}" autocomplete="off"></div>` : ''}
      ${list.length ? `<div class="gm-grid">${list.map(card).join('')}</div>` : `<div class="empty">${all.length ? 'No game matches.' : 'No games yet. Press “+ New game”.'}</div>`}`}</div>
      ${edit ? '' : reportsBlock()}
      ${report ? reportModal() : ''}`;
  }

  /* ───────── a report ───────── */
  function reportModal() {
    const r = report;
    return `<div class="modal-backdrop open gm-modal" data-gm="closerep"><div class="modal modal-wide" role="dialog" aria-modal="true" aria-label="Game report">
      <div class="cb-top"><h3>${esc(r.title)} <span class="muted sm">· ${esc(r.subject)} · ${fmtWhen(r.endedAt)}</span></h3><button class="btn btn-sm" data-gm="closerep" type="button" aria-label="Close">✕</button></div>
      <div class="cb-body">
        <div class="kv"><div><small>Players</small><b>${r.count}</b></div><div><small>Questions played</small><b>${r.asked} of ${r.total}</b></div><div><small>Right answers (average)</small><b>${r.avgRight}%</b></div><div><small>Host</small><b>${esc((r.host && r.host.name) || '—')}</b></div></div>
        <div class="section-title" style="font-size:14px">Ranking</div>
        <div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Player</th><th class="right">Points</th><th class="right">Right</th><th class="right">Answered</th></tr></thead><tbody>
          ${(r.players || []).map((p) => `<tr><td>${p.rank <= 3 ? ['🥇', '🥈', '🥉'][p.rank - 1] : p.rank}</td><td>${esc(p.name)}${p.userId ? ' <span class="badge badge-info">account</span>' : ''}</td><td class="right">${p.score}</td><td class="right">${p.right} / ${r.asked}</td><td class="right">${p.answered}</td></tr>`).join('') || '<tr><td colspan="5" class="empty">Nobody played.</td></tr>'}
        </tbody></table></div>
        <div class="section-title" style="font-size:14px">Questions</div>
        ${(r.questions || []).map((q, i) => { const pct = q.answered ? Math.round(q.right / Math.max(1, r.count) * 100) : 0; return `<div class="gm-rq"><div class="gm-rq-head"><span class="cb-qn">${i + 1}</span><span class="grow">${esc(q.text)}</span><span class="badge ${pct >= 70 ? 'badge-ok' : pct >= 40 ? 'badge-warn' : 'badge-bad'}">${pct}% right</span></div>
          <div class="gm-rq-bars">${q.answers.map((a, k) => { const n = q.counts[k] || 0; const w = r.count ? Math.round(n / r.count * 100) : 0; return `<div class="gm-rq-bar gm-a${k}${q.correct.includes(k) ? ' is-right' : ''}"><span class="gm-shape">${SHAPES[k]}</span><span class="grow">${esc(a)}${q.correct.includes(k) ? ' ✓' : ''}</span><span class="gm-rq-fill" style="width:${w}%"></span><b>${n}</b></div>`; }).join('')}</div>
          <div class="muted sm">${q.answered} answered · ${r.count - q.answered} no answer</div></div>`; }).join('')}
      </div>
      <div class="modal-actions"><button class="btn" data-gm="csv" data-sid="${esc(r.sid)}" type="button">⬇ Download CSV</button><button class="btn btn-primary" data-gm="closerep" type="button">Close</button></div></div></div>`;
  }
  async function getReport(sid) { return (await api('/api/admin/games/reports/' + encodeURIComponent(sid))).report; }
  function csv(r) {
    const cell = (v) => { const s = String(v ?? ''); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const rows = [['Rank', 'Player', 'Points', 'Right', 'Answered', 'Questions played']].concat((r.players || []).map((p) => [p.rank, p.name, p.score, p.right, p.answered, r.asked]));
    rows.push([]); rows.push(['Question', 'Right answer', 'Right', 'Answered']);
    (r.questions || []).forEach((q, i) => rows.push([(i + 1) + '. ' + q.text, q.correct.map((k) => q.answers[k]).join(' / '), q.right, q.answered]));
    const blob = new Blob(['﻿' + rows.map((x) => x.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = ('game-' + r.title + '-' + String(r.endedAt).slice(0, 10)).replace(/[^\w.-]+/g, '-') + '.csv';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ───────── typing in the editor changes the game at once (no field is lost when the list is drawn again) ───────── */
  function onInput(e) {
    const t = e.target; if (!edit || !$('#gm-form') || !$('#gm-form').contains(t)) { if (t.id === 'gm-search') { search = t.value; const pos = t.selectionStart; render(); const s = $('#gm-search'); if (s) { s.focus(); s.setSelectionRange(pos, pos); } } return; }
    if (t.dataset.f) { edit[t.dataset.f] = t.value; return; }
    const qi = Number(t.dataset.q); const q = edit.questions[qi]; if (!q) return;
    if (t.dataset.a !== undefined) { q.answers = q.type === 'tf' ? q.answers : fourAnswers(q); q.answers[Number(t.dataset.a)] = t.value; return; }
    if (t.dataset.c !== undefined && e.type === 'change') {
      const c = Number(t.dataset.c); const set = new Set(q.correct);
      if (q.type === 'tf') { q.correct = [c]; } else if (t.checked) set.add(c); else set.delete(c);
      if (q.type !== 'tf') q.correct = [...set].sort();
      render(); return;
    }
    if (t.dataset.k === 'text') { q.text = t.value; return; }
    if (t.dataset.k === 'image') { q.image = t.value.trim(); return; }
    if (e.type !== 'change') return;
    if (t.dataset.k === 'time') q.time = Number(t.value);
    if (t.dataset.k === 'points') q.points = Number(t.value);
    if (t.dataset.k === 'type') { const n = blankQ(t.value); n.text = q.text; n.image = q.image; n.time = q.time; n.points = q.points; edit.questions[qi] = n; render(); }
  }
  function pickFile() {
    return new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(i); i.addEventListener('cancel', () => { i.remove(); res(null); }); i.onchange = () => { const x = i.files && i.files[0]; i.remove(); res(x); }; i.click(); });
  }
  async function upload() {
    if (!window.IXAdmin || !window.IXAdmin.uploadFile) { toast('The upload is not ready yet. Reload the page.', true); return ''; }
    const f = await pickFile(); if (!f) return '';
    busy = true; render();
    try { const url = await window.IXAdmin.uploadFile(f); toast('Picture uploaded'); return url; } finally { busy = false; }
  }
  function check() {
    if (!edit.title.trim()) return 'Please enter the name of the game.';
    if (!edit.subject.trim()) return 'Please choose or type the subject.';
    if (!edit.questions.length) return 'Add at least one question.';
    for (let i = 0; i < edit.questions.length; i++) {
      const q = edit.questions[i]; const filled = q.answers.map((a, k) => (String(a).trim() ? k : -1)).filter((k) => k >= 0);
      if (!q.text.trim()) return 'Question ' + (i + 1) + ': write the question.';
      if (filled.length < 2) return 'Question ' + (i + 1) + ': give at least two answers.';
      if (!q.correct.some((k) => filled.includes(k))) return 'Question ' + (i + 1) + ': mark the right answer (tick ✓).';
    }
    return '';
  }
  async function save() {
    const err = check(); if (err) { toast(err, true); return null; }
    busy = true; render();
    try {
      const body = JSON.stringify({ title: edit.title, subject: edit.subject, description: edit.description, coverUrl: edit.coverUrl, questions: edit.questions });
      const d = edit.id ? await api('/api/admin/games/' + encodeURIComponent(edit.id), { method: 'PATCH', body }) : await api('/api/admin/games', { method: 'POST', body });
      toast(edit.id ? 'Game saved' : 'Game created'); subject = d.quiz.subject; edit = null; importOpen = false;
      return d.quiz;
    } finally { busy = false; }
  }
  async function host(id) {
    const w = window.open('about:blank', '_blank');   // opened at the click, so the browser does not block it
    try {
      const d = await api('/api/admin/games/' + encodeURIComponent(id) + '/host', { method: 'POST' });
      const url = '/game-host?pin=' + d.pin;
      if (w) w.location.href = url; else location.href = url;
      toast('Game PIN ' + d.pin + ' — the host screen is open');
    } catch (e) { if (w) w.close(); throw e; }
    await load();
  }

  async function onClick(e) {
    const t = e.target.closest('[data-gm]'); const mount = $('#content-games');
    if (!t || !mount || !mount.contains(t)) return;
    const a = t.dataset.gm; const g = (data && data.quizzes || []).find((x) => x.id === t.dataset.id);
    if (a === 'closerep' && t !== e.target && t.classList.contains('modal-backdrop')) return;   // a click inside the dialog
    try {
      if (a === 'new') { edit = { title: '', subject: subject !== 'all' ? subject : '', description: '', coverUrl: '', questions: [blankQ('quiz')] }; importOpen = false; render(); $('[data-f="title"]').focus(); }
      else if (a === 'edit' && g) { busy = true; render(); try { edit = (await api('/api/admin/games/' + encodeURIComponent(g.id))).quiz; edit.questions.forEach((q) => { if (q.type !== 'tf') q.answers = fourAnswers(q); }); } finally { busy = false; } importOpen = false; render(); $('#content-games').scrollIntoView({ block: 'start' }); }
      else if (a === 'cancel') { if (!confirm('Leave the editor? Changes that were not saved are lost.')) return; edit = null; importOpen = false; render(); }
      else if (a === 'subject') { subject = t.dataset.s; render(); }
      else if (a === 'addq' || a === 'addtf') { edit.questions.push(blankQ(a === 'addtf' ? 'tf' : 'quiz')); render(); const qs = document.querySelectorAll('.gm-q-text'); const last = qs[qs.length - 1]; if (last) { last.focus(); last.scrollIntoView({ block: 'center' }); } }
      else if (a === 'up' || a === 'down') { const i = Number(t.dataset.qi), j = a === 'up' ? i - 1 : i + 1; if (j < 0 || j >= edit.questions.length) return; const x = edit.questions[i]; edit.questions[i] = edit.questions[j]; edit.questions[j] = x; render(); }
      else if (a === 'dupq') { const i = Number(t.dataset.qi); edit.questions.splice(i + 1, 0, JSON.parse(JSON.stringify(edit.questions[i]))); render(); }
      else if (a === 'delq') { const i = Number(t.dataset.qi); const q = edit.questions[i]; if (q && q.text.trim() && !confirm('Delete question ' + (i + 1) + '?')) return; edit.questions.splice(i, 1); render(); }
      else if (a === 'import') { importOpen = !importOpen; render(); if (importOpen) $('#gm-import-text').focus(); }
      else if (a === 'doimport') {
        const r = parseText($('#gm-import-text').value);
        if (!r.questions.length) return toast('No question was found. Check the format below the box.', true);
        if (edit.questions.length === 1 && !edit.questions[0].text.trim()) edit.questions = [];
        edit.questions.push(...r.questions); importOpen = false; render();
        toast(r.questions.length + ' question' + (r.questions.length === 1 ? '' : 's') + ' added' + (r.bad.length ? ' · block ' + r.bad.join(', ') + ' skipped (no answers or no right answer)' : ''), !!r.bad.length);
      }
      else if (a === 'qimg') { const i = Number(t.dataset.qi); const url = await upload(); if (url && edit && edit.questions[i]) edit.questions[i].image = url; render(); }
      else if (a === 'noimg') { edit.questions[Number(t.dataset.qi)].image = ''; render(); }
      else if (a === 'cover') { const url = await upload(); if (url && edit) edit.coverUrl = url; render(); }
      else if (a === 'nocover') { edit.coverUrl = ''; render(); }
      else if (a === 'save') { if (await save()) await load(); else render(); }
      else if (a === 'savehost') { const q = await save(); if (!q) return render(); await host(q.id); }
      else if (a === 'host' && g) { if (!g.count) return toast('This game has no questions.', true); await host(g.id); }
      else if (a === 'copy' && g) { await api('/api/admin/games/' + encodeURIComponent(g.id) + '/copy', { method: 'POST' }); toast('Copy made'); await load(); }
      else if (a === 'del' && g) { if (!confirm('Delete the game “' + g.title + '”? Reports of games already played stay.')) return; await api('/api/admin/games/' + encodeURIComponent(g.id), { method: 'DELETE' }); toast('Game deleted'); await load(); }
      else if (a === 'close') { if (!confirm('Close the game with PIN ' + t.dataset.pin + '? The players leave the game.')) return; await api('/api/admin/games/live/' + t.dataset.pin, { method: 'POST', body: JSON.stringify({ action: 'close' }) }); toast('Game closed'); await load(); }
      else if (a === 'report') { report = await getReport(t.dataset.sid); render(); }
      else if (a === 'closerep') { report = null; render(); }
      else if (a === 'csv') { csv(report && report.sid === t.dataset.sid ? report : await getReport(t.dataset.sid)); }
      else if (a === 'delrep') { if (!confirm('Delete this report?')) return; await api('/api/admin/games/reports/' + encodeURIComponent(t.dataset.sid), { method: 'DELETE' }); toast('Report deleted'); await load(); }
    } catch (err) { busy = false; fail(err); render(); }
  }

  const isMine = () => (location.hash || '').slice(1).split('?')[0] === 'games';
  function onHash() { if (isMine() && !data && !loading) load(); }
  window.addEventListener('DOMContentLoaded', () => {
    render(); document.addEventListener('click', onClick); document.addEventListener('input', onInput); document.addEventListener('change', onInput);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && report) { report = null; render(); } });
    onHash();
    if (!isMine()) api('/api/admin/games').then((d) => { if (!data) { data = d; livePill(); } }).catch(() => {});   // the "live" count in the menu
  });
  window.addEventListener('hashchange', onHash);
  window.addEventListener('beforeunload', (e) => { if (edit && edit.questions.some((q) => q.text.trim())) { e.preventDefault(); e.returnValue = ''; } });
  document.addEventListener('click', (e) => { if (e.target.closest('#refresh') && isMine()) { data = null; report = null; load(); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && isMine() && data && !edit && !report) load(); });   // back from the host screen: the live list and reports are fresh
  window.IXGames = { parseText };
})();
