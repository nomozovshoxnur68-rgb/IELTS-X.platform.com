/* IELTSX — plays tests made in the admin panel: reading, listening (graded on the server) and writing. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const id = new URLSearchParams(location.search).get('id') || decodeURIComponent((location.pathname.match(/^\/test\/([^/]+)/) || [])[1] || '');
  const main = $('#tp-main'), timerEl = $('#tp-timer');
  let item = null, answers = {}, submitted = false, started = Date.now(), tick = null;

  /* theme */
  $('#tp-theme').addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark-mode');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { /* blocked */ }
  });
  const state = (html) => { main.innerHTML = `<div class="tp-state">${html}</div>`; };
  const pad = (n) => String(n).padStart(2, '0');
  const clock = (s) => (s >= 3600 ? Math.floor(s / 3600) + ':' : '') + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);

  async function load() {
    if (!id) return state('No test selected. <a href="/part/practice/reading">Browse the tests</a>.');
    let r, d;
    try { r = await fetch('/api/materials/' + encodeURIComponent(id), { credentials: 'same-origin' }); d = await r.json().catch(() => ({})); }
    catch (e) { return state('Cannot reach the server. Check your connection and <a href="">try again</a>.'); }
    if (r.status === 401) return state(`<h2>Please sign in</h2><p>Sign in to open this test.</p><a class="tp-btn" href="/login?next=${encodeURIComponent(location.pathname + location.search)}">Sign in</a>`);
    if (r.status === 403) return state('<h2>★ Premium test</h2><p>This test is for Premium members.</p><a class="tp-btn" href="/Price">See plans</a>');
    if (!r.ok) return state(`<h2>Test not found</h2><p>${esc(d.error || 'It may have been removed.')}</p><a class="tp-btn" href="/part/practice/reading">Browse tests</a>`);
    item = d.item; document.title = item.title + ' — IELTSX';
    $('#tp-title').textContent = item.title; $('#tp-back').href = '/part/practice/' + item.type; $('#tp-back').textContent = '← ' + item.type.charAt(0).toUpperCase() + item.type.slice(1) + ' tests';
    if (item.type === 'writing') renderWriting(); else renderExam();
  }

  /* ───────── timer ───────── */
  function startTimer(limitMin, onEnd) {
    timerEl.hidden = false; started = Date.now();
    const limit = (limitMin || 0) * 60;
    const paint = () => {
      const used = Math.floor((Date.now() - started) / 1000);
      if (limit) { const left = Math.max(0, limit - used); timerEl.textContent = clock(left); timerEl.classList.toggle('low', left <= 300); if (!left) { clearInterval(tick); onEnd && onEnd(); } }
      else timerEl.textContent = clock(used);
    };
    paint(); tick = setInterval(paint, 1000);
  }

  /* ───────── reading + listening ───────── */
  function qInput(q) {
    const n = q.id;
    if (q.type === 'tfng' || q.type === 'ynng') {
      const opts = q.type === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'];
      return `<div class="tp-opts">${opts.map((o) => `<label class="tp-opt"><input type="radio" name="${n}" value="${o}"><span>${o}</span></label>`).join('')}</div>`;
    }
    if (q.type === 'mcq') return `<div class="tp-opts col">${(q.options || []).map((o, i) => `<label class="tp-opt"><input type="radio" name="${n}" value="${String.fromCharCode(65 + i)}"><span><b>${String.fromCharCode(65 + i)}</b> ${esc(o)}</span></label>`).join('')}</div>`;
    return `<input class="tp-text" name="${n}" type="text" autocomplete="off" spellcheck="false" placeholder="Your answer" maxlength="200">`;
  }
  function questionsHtml() {
    let last = '';
    return (item.data.questions || []).map((q, i) => {
      const head = q.group && q.group !== last ? `<h3 class="tp-group">${esc(q.group)}</h3>` : ''; if (q.group) last = q.group;
      return `${head}<div class="tp-q" id="box-${q.id}" data-q="${q.id}"><div class="tp-qn">${i + 1}</div><div class="tp-qb"><div class="tp-qt">${esc(q.prompt).replace(/\n/g, '<br>')}</div>${qInput(q)}<div class="tp-fb" hidden></div></div></div>`;
    }).join('');
  }
  function imagesHtml() { return (item.data.images || []).map((im) => `<figure class="tp-fig"><img src="${esc(im.url)}" alt="${esc(im.caption || 'Picture for the questions')}" loading="lazy">${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ''}</figure>`).join(''); }
  function passageHtml() {
    return String(item.data.passage || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
      const m = /^([A-H])[.)]\s+([\s\S]*)$/.exec(p);
      return m ? `<p><span class="tp-pl">${m[1]}</span>${esc(m[2]).replace(/\n/g, '<br>')}</p>` : `<p>${esc(p).replace(/\n/g, '<br>')}</p>`;
    }).join('');
  }
  function renderExam() {
    const d = item.data, reading = item.type === 'reading', total = (d.questions || []).length;
    const intro = d.instructions ? `<div class="tp-note">${esc(d.instructions).replace(/\n/g, '<br>')}</div>` : '';
    const audio = !reading ? `<div class="tp-audio"><audio id="tp-audio" controls preload="metadata" src="${esc(d.audioUrl)}"></audio><div class="tp-hint">Play the recording once, like in the real exam. You can pause it.</div></div>` : '';
    main.innerHTML = `<div class="tp-exam ${reading ? 'split' : ''}">
      ${reading ? `<section class="tp-pane tp-passage" aria-label="Passage"><h2>${esc(item.title)}</h2>${imagesHtml()}${passageHtml()}</section>` : ''}
      <section class="tp-pane tp-questions" aria-label="Questions">${audio}${!reading ? imagesHtml() : ''}${intro}<form id="tp-form" autocomplete="off" onsubmit="return false">${questionsHtml()}</form>
        <div id="tp-result" hidden></div></section></div>
      <footer class="tp-bar"><span id="tp-prog">0 / ${total} answered</span><button class="tp-btn" id="tp-submit" type="button">Submit answers</button></footer>`;
    main.addEventListener('input', onAnswer); main.addEventListener('change', onAnswer);
    $('#tp-submit').addEventListener('click', () => submit(false));
    startTimer(d.durationMin, () => submit(true));
    window.addEventListener('beforeunload', (e) => { if (!submitted && Object.keys(answers).length) { e.preventDefault(); e.returnValue = ''; } });
  }
  function onAnswer(e) {
    const el = e.target; if (!el.name || submitted) return;
    const v = el.value.trim(); if (v) answers[el.name] = v; else delete answers[el.name];
    $('#box-' + el.name)?.classList.toggle('done', !!v);
    $('#tp-prog').textContent = Object.keys(answers).length + ' / ' + item.data.questions.length + ' answered';
  }
  async function submit(auto) {
    if (submitted) return;
    const total = item.data.questions.length, got = Object.keys(answers).length;
    if (!auto && got < total && !confirm(`You answered ${got} of ${total} questions. Submit anyway?`)) return;
    const btn = $('#tp-submit'); btn.disabled = true; btn.textContent = 'Checking…';
    try {
      const r = await fetch('/api/materials/' + encodeURIComponent(id) + '/grade', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers, durationSec: Math.floor((Date.now() - started) / 1000) }) });
      const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || 'Could not check your answers.');
      submitted = true; clearInterval(tick); $('#tp-audio')?.pause(); showResult(d); btn.hidden = true;
    } catch (e) { btn.disabled = false; btn.textContent = 'Submit answers'; alert(e.message); }
  }
  function showResult(d) {
    main.querySelectorAll('input').forEach((i) => { i.disabled = true; });
    d.details.forEach((x) => {
      const box = $('#box-' + x.id); if (!box) return; box.classList.add(x.correct ? 'ok' : 'bad');
      const fb = $('.tp-fb', box); fb.hidden = false;
      fb.innerHTML = x.correct ? '✓ Correct' : `✗ Correct answer: <b>${esc(String(x.answer).split('|').join(' / '))}</b>`;
      if (x.explanation) fb.innerHTML += `<div class="tp-expl">${esc(x.explanation)}</div>`;
    });
    const res = $('#tp-result'); res.hidden = false;
    res.innerHTML = `<div class="tp-score"><div><span class="n">${d.correct}</span><span class="of">/ ${d.total}</span></div><div class="band">Band <b>${d.band.toFixed(1)}</b></div></div>
      <p class="tp-hint">${d.saved ? 'Your result is saved in your account (Performance page).' : 'Sign in next time and your results will be saved.'}</p>
      ${d.transcript ? `<details class="tp-trans"><summary>Show transcript</summary><div>${esc(d.transcript).replace(/\n/g, '<br>')}</div></details>` : ''}
      <div class="tp-actions"><a class="tp-btn ghost" href="/part/practice/${item.type}">More tests</a><button class="tp-btn ghost" onclick="location.reload()" type="button">Try again</button></div>`;
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('#tp-prog').textContent = `Score ${d.correct} / ${d.total} · Band ${d.band.toFixed(1)}`;
  }

  /* ───────── writing ───────── */
  function renderWriting() {
    const tasks = item.data.tasks || []; let cur = 0;
    const key = (i) => 'ieltsx_w_' + id + '_' + i; const store = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* blocked */ } };
    const read = (k) => { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } };
    const words = (t) => (t.trim().match(/\S+/g) || []).length;
    main.innerHTML = `<div class="tp-tabs" role="tablist">${tasks.map((t, i) => `<button class="tp-tab" role="tab" data-t="${i}" type="button">${esc(t.title)}</button>`).join('')}</div><div id="tp-w"></div>`;
    startTimer(item.data.durationMin);
    const paint = () => {
      const t = tasks[cur]; document.querySelectorAll('.tp-tab').forEach((b) => b.classList.toggle('active', Number(b.dataset.t) === cur));
      $('#tp-w').innerHTML = `<div class="tp-exam split"><section class="tp-pane"><h2>${esc(t.title)}</h2>${t.minutes ? `<div class="tp-hint">Suggested time: ${t.minutes} minutes</div>` : ''}${t.prompt ? `<div class="tp-wprompt">${esc(t.prompt).replace(/\n/g, '<br>')}</div>` : ''}${t.imageUrl ? `<figure class="tp-fig"><img src="${esc(t.imageUrl)}" alt="Task picture"></figure>` : ''}</section>
        <section class="tp-pane"><textarea id="tp-essay" class="tp-essay" placeholder="Write your answer here…" spellcheck="true"></textarea>
        <div class="tp-wbar"><span id="tp-wc">0 words</span><span class="tp-hint">Saved on this device automatically</span></div>
        <div class="tp-actions"><button class="tp-btn ghost" id="tp-copy" type="button">Copy my answer</button><button class="tp-btn ghost" id="tp-clear" type="button">Clear</button>${t.hasSample ? '<button class="tp-btn" id="tp-sample" type="button">Show model answer</button>' : ''}</div><div id="tp-sample-box" class="tp-trans" hidden></div></section></div>`;
      const ta = $('#tp-essay'); ta.value = read(key(cur));
      const upd = () => { const w = words(ta.value); const wc = $('#tp-wc'); wc.textContent = w + ' words' + (t.minWords ? ` (minimum ${t.minWords})` : ''); wc.classList.toggle('ok', !t.minWords || w >= t.minWords); };
      ta.addEventListener('input', () => { store(key(cur), ta.value || null); upd(); }); upd();
      $('#tp-copy').onclick = () => { navigator.clipboard?.writeText(ta.value).then(() => alert('Copied.'), () => { ta.select(); }); };
      $('#tp-clear').onclick = () => { if (confirm('Clear your answer?')) { ta.value = ''; store(key(cur), null); upd(); } };
      const sb = $('#tp-sample'); if (sb) sb.onclick = async () => {
        const box = $('#tp-sample-box'); if (!box.hidden) { box.hidden = true; return; }
        try { const r = await fetch('/api/materials/' + encodeURIComponent(id) + '/sample', { credentials: 'same-origin' }); const d = await r.json(); const s = (d.samples || []).find((x) => x.id === t.id); box.innerHTML = '<strong>Model answer</strong><div>' + esc(s ? s.sample : '').replace(/\n/g, '<br>') + '</div>'; box.hidden = false; } catch (e) { alert('Could not load the model answer.'); }
      };
    };
    document.querySelectorAll('.tp-tab').forEach((b) => b.addEventListener('click', () => { cur = Number(b.dataset.t); paint(); }));
    paint();
  }
  load();
})();
