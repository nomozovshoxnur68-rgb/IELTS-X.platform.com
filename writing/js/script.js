/* =========================================================
   IELTS Writing – exam logic (/writing/)
   /writing/            -> the built-in demo test (DEMO_EXAM below)
   /writing/?id=<id>    -> a writing set added in the admin panel (Task 1, Task 2 … = Part 1, Part 2 …)
   Sections:
     1. CONFIG            (demo exam + AI settings here)
     2. Utils & Storage
     3. Chart rendering
     4. Parts, timer, word count, autosave
     5. UI: divider, modals, settings, fullscreen
     6. AI check (the server keeps the key: POST /api/ai/writing, see ai-examiner.js)
     7. Results renderer
     8. Flow control (load -> start -> exam -> submit -> results)
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     1. CONFIG
     --------------------------------------------------------- */
  const DEMO_EXAM = {
    id: 'demo-test-2-t1',
    title: '[Demo] Test 2 - T1: Changes in car ownership in European households between 1971 and 2001',
    durationMinutes: 20,
    tasks: [{
      id: 't1', kind: 'task1', title: 'Task 1', minWords: 150, minutes: 20,
      prompt: 'The graph below shows the changes in car ownership in European households between 1971 and 2001.\n' +
        'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      // Data of the chart (used both to draw it and to send to the AI examiner)
      chart: {
        years: [1961, 1971, 1981, 1991, 2001],
        yMax: 75,
        yStep: 25,
        unit: '% of households',
        series: [
          { name: '2 + cars', values: [10, 30, 35, 40, 49] },
          { name: '1 car',    values: [30, 39, 39, 37, 39] },
          { name: 'No car',   values: [70, 39, 30, 20, 10] },
        ],
      },
      sample:
        'The line graph illustrates how the proportion of European households owning no car, one car, or two or more cars changed between 1961 and 2001.\n\n' +
        'Overall, car ownership became far more widespread: households without a car fell dramatically, while those with two or more vehicles rose steadily and became the most common category by the end of the period.\n\n' +
        'In 1961, households with no car dominated at 70%, whereas only 30% owned one car and a mere 10% owned two or more. Over the next decade the no-car figure plunged to 39%, level with one-car households, which had risen to the same value. Two-car ownership tripled to 30% over the same period.\n\n' +
        'From 1971 onwards, one-car ownership stayed almost static at around 37–39%. By contrast, households with two or more cars continued to climb, overtaking the no-car group in 1981 (35% vs 30%) and reaching 49% in 2001, while the no-car share fell to just 10%.',
    }],
  };

  const CONFIG = {
    exam: null,                       // DEMO_EXAM or the admin test, set by loadExam()
    testsPage: '/part/practice/writing',
    supportEmail: 'support@ieltsx.com',
    ai: { endpoint: '/api/ai/writing', timeoutMs: 70000, retries: 1 },
  };

  const isTask2 = (task) => task.kind === 'task2';
  const firstCriterion = (task) => (isTask2(task) ? 'Task Response' : 'Task Achievement');

  /* ---------------------------------------------------------
     2. Utils & Storage
     --------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const store = {
    key: (k) => `ieltsx:${CONFIG.exam.id}:${k}`,
    get(k, fallback = null) {
      try { const v = localStorage.getItem(this.key(k)); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(k, v) { try { localStorage.setItem(this.key(k), JSON.stringify(v)); } catch { /* quota / private mode */ } },
    del(k) { try { localStorage.removeItem(this.key(k)); } catch { /* ignore */ } },
  };
  const prefs = {
    get: (k, d) => { try { return localStorage.getItem('ieltsx:pref:' + k) || d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem('ieltsx:pref:' + k, v); } catch { /* ignore */ } },
  };

  const countWords = (text) => {
    const t = (text || '').trim();
    return t ? t.split(/\s+/).filter(Boolean).length : 0;
  };

  const roundHalf = (n) => Math.min(9, Math.max(0, Math.round(Number(n) * 2) / 2)) || 0;
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const tasks = () => CONFIG.exam.tasks;

  let toastTimer;
  function toast(msg, ms = 2600) {
    const el = $('#toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, ms);
  }

  function showScreen(name) {
    $$('.screen').forEach((s) => { s.hidden = s.id !== `screen-${name}`; });
    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------
     3. Chart rendering (SVG line graph drawn from task.chart)
     --------------------------------------------------------- */
  const SERIES_STYLE = [
    { marker: 'circle', dash: '8 6' }, { marker: 'square', dash: '' }, { marker: 'triangle', dash: '14 5 3 5' },
    { marker: 'diamond', dash: '3 6' }, { marker: 'circle', dash: '' }, { marker: 'square', dash: '8 6' },
  ];
  // round axis: 3–6 grid lines with a friendly step (… 5, 10, 20, 25, 50 …)
  function niceScale(max) {
    const pow = Math.pow(10, Math.floor(Math.log10(max)));
    for (const m of [0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10]) {
      const step = m * pow;
      if (Math.ceil(max / step) <= 6) return { yStep: step, yMax: Math.ceil(max / step) * step };
    }
    return { yStep: max / 5, yMax: max };
  }

  function renderChart(chart) {
    const { years, series } = chart;
    const { yMax, yStep } = chart.yMax ? chart : niceScale(Math.max(1, ...series.flatMap((s) => s.values)));
    const W = 1000, H = 720;
    const L = 100, R = 975, T = 40, B = 610;
    const colW = (R - L) / years.length;
    const x = (i) => L + colW * (i + 0.5);
    const y = (v) => B - (v / yMax) * (B - T);

    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Line graph${chart.unit ? ' (' + esc(chart.unit) + ')' : ''}">`;
    s += `<rect width="${W}" height="${H}" fill="#fff"/>`;
    if (chart.unit) s += `<text x="${L}" y="${T - 14}" font-size="20" fill="#555">${esc(chart.unit)}</text>`;
    // horizontal grid + y labels
    for (let k = 0; k * yStep <= yMax + 1e-9; k++) {
      const v = k * yStep;
      s += `<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="#222" stroke-width="${v === 0 ? 3 : 1.5}"/>`;
      s += `<text x="${L - 22}" y="${y(v) + 8}" text-anchor="end" font-size="22" fill="#222">${+v.toFixed(2)}</text>`;
    }
    // vertical grid + x labels
    s += `<line x1="${L}" x2="${L}" y1="${T}" y2="${B}" stroke="#222" stroke-width="3"/>`;
    s += `<line x1="${R}" x2="${R}" y1="${T}" y2="${B}" stroke="#222" stroke-width="1.5"/>`;
    years.forEach((yr, i) => {
      s += `<line x1="${x(i)}" x2="${x(i)}" y1="${T}" y2="${B}" stroke="#222" stroke-width="1.5"/>`;
      s += `<text x="${x(i)}" y="${B + 38}" text-anchor="middle" font-size="22" fill="#222">${esc(yr)}</text>`;
    });
    // watermark
    s += `<text x="${(L + R) / 2}" y="${(T + B) / 2 + 80}" text-anchor="middle" font-size="130" font-weight="700" fill="#000" opacity=".07" transform="rotate(-28 ${(L + R) / 2} ${(T + B) / 2 + 80})">IELTSX.COM</text>`;

    const marker = (type, cx, cy) => {
      if (type === 'circle') return `<circle cx="${cx}" cy="${cy}" r="8" fill="#fff" stroke="#000" stroke-width="3"/>`;
      if (type === 'square') return `<rect x="${cx - 9}" y="${cy - 9}" width="18" height="18" fill="#000"/>`;
      if (type === 'diamond') return `<polygon points="${cx},${cy - 11} ${cx + 11},${cy} ${cx},${cy + 11} ${cx - 11},${cy}" fill="#000"/>`;
      return `<polygon points="${cx},${cy - 11} ${cx + 11},${cy + 8} ${cx - 11},${cy + 8}" fill="#fff" stroke="#000" stroke-width="3"/>`;
    };
    const style = (i) => SERIES_STYLE[i % SERIES_STYLE.length];
    series.forEach((ser, si) => {
      const st = style(si);
      const pts = ser.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
      s += `<polyline points="${pts}" fill="none" stroke="#000" stroke-width="3.5" ${st.dash ? `stroke-dasharray="${st.dash}"` : ''}/>`;
      ser.values.forEach((v, i) => { s += marker(st.marker, x(i), y(v)); });
    });
    // legend, centred under the graph
    const widths = series.map((ser) => 110 + String(ser.name).length * 13);
    let x0 = Math.max(20, (W - widths.reduce((a, b) => a + b, 0)) / 2);
    series.forEach((ser, si) => {
      const st = style(si), yy = 690;
      s += `<line x1="${x0}" x2="${x0 + 70}" y1="${yy}" y2="${yy}" stroke="#000" stroke-width="3.5" ${st.dash ? `stroke-dasharray="${st.dash}"` : ''}/>`;
      s += marker(st.marker, x0 + 35, yy);
      s += `<text x="${x0 + 90}" y="${yy + 8}" font-size="24" fill="#222">${esc(ser.name)}</text>`;
      x0 += widths[si];
    });
    s += '</svg>';
    return s;
  }

  /* ---------------------------------------------------------
     4. Parts, timer, word count, autosave
     --------------------------------------------------------- */
  const state = {
    startedAt: 0,
    endsAt: 0,
    timerId: null,
    submitted: false,
    cur: 0,               // index of the part on screen
    answers: [],          // one answer per task
    results: null,
    lastSubmission: null,
    user: null,           // signed-in account (from /api/auth/me) or null
  };

  // the part on screen: instructions, chart / picture, the answer box and the bottom bar
  function showPart(i) {
    const list = tasks();
    state.cur = Math.max(0, Math.min(list.length - 1, i));
    const t = list[state.cur];
    $('#partTitle').textContent = `Part ${state.cur + 1}`;
    $('#partHint').textContent = `You should spend about ${t.minutes || (isTask2(t) ? 40 : 20)} minutes on this task. Write at least ${t.minWords || (isTask2(t) ? 250 : 150)} words.`;
    $('#promptBox').innerHTML = String(t.prompt || '').split(/\n+/).map((p) => p.trim()).filter(Boolean)
      .map((p) => `<p class="prompt">${esc(p)}</p>`).join('');
    $('#chartWrap').innerHTML = t.chart ? renderChart(t.chart)
      : t.imageUrl ? `<img src="${esc(t.imageUrl)}" alt="${esc(t.title)} picture">` : '';
    $('#paneLeft').scrollTop = 0;
    $('#answer').value = state.answers[state.cur] || '';
    updateWordCount();
    renderPartsNav();
    $('#prevBtn').disabled = state.cur === 0;
  }

  function renderPartsNav() {
    $('#partsNav').innerHTML = tasks().map((t, i) => {
      if (i === state.cur) {
        return `<div class="part-tab active"><span class="tab-line"></span><button class="part-label" data-part="${i}">Part ${i + 1}</button></div>` +
          `<div class="q-tab active"><span class="tab-line"></span><button class="q-btn active" data-part="${i}" aria-label="Question ${i + 1}">${i + 1}</button></div>`;
      }
      const done = countWords(state.answers[i]) > 0;
      return `<div class="part-tab idle" data-part="${i}"><button class="part-label" data-part="${i}">Part ${i + 1}</button><span class="part-count${done ? ' done' : ''}">${done ? 1 : 0} of 1</span></div>`;
    }).join('');
  }

  // on phones the question sits above the answer box: start at the top instead of jumping to the box
  function focusAnswer() {
    if (matchMedia('(max-width: 900px)').matches) $('#split').scrollTop = 0;
    else $('#answer').focus();
  }

  function switchPart(i) {
    if (i === state.cur) { focusAnswer(); return; }
    store.set('draft:' + state.cur, state.answers[state.cur] || '');
    store.set('part', i);
    showPart(i);
    focusAnswer();
  }

  function formatRemaining(ms) {
    const sec = Math.max(0, Math.ceil(ms / 1000));
    if (sec > 60) {
      const m = Math.ceil(sec / 60);
      return `${m} minute${m === 1 ? '' : 's'} remaining`;
    }
    return `${sec} second${sec === 1 ? '' : 's'} remaining`;
  }

  function tick() {
    const left = state.endsAt - Date.now();
    const el = $('#timerDisplay');
    el.textContent = formatRemaining(left);
    el.classList.toggle('warn', left <= 5 * 60 * 1000);
    if (left <= 0 && !state.submitted) {
      stopTimer();
      toast('Time is up – your answer is being submitted.', 3500);
      submitAnswer({ auto: true });
    }
  }
  function startTimer() {
    stopTimer();
    tick();
    state.timerId = setInterval(tick, 500);
  }
  function stopTimer() { clearInterval(state.timerId); state.timerId = null; }

  function updateWordCount() {
    $('#wordCount').textContent = `Words: ${countWords($('#answer').value)}`;
  }
  const saveDraft = debounce((i, text) => store.set('draft:' + i, text), 400);

  function setupAnswerBox() {
    const ta = $('#answer');
    ta.addEventListener('input', () => {
      const had = countWords(state.answers[state.cur]) > 0;
      state.answers[state.cur] = ta.value;
      updateWordCount();
      saveDraft(state.cur, ta.value);
      if (had !== countWords(ta.value) > 0) renderPartsNav();
    });
    // exam rules: no paste of large blocks / drag-drop (optional – comment out to allow)
    ta.addEventListener('drop', (e) => e.preventDefault());
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input')); }
    });
    $('#partsNav').addEventListener('click', (e) => {
      const b = e.target.closest('[data-part]'); if (b) switchPart(Number(b.dataset.part));
    });
    $('#prevBtn').addEventListener('click', () => { if (state.cur > 0) switchPart(state.cur - 1); });
    $('#nextBtn').addEventListener('click', () => {
      if (state.cur < tasks().length - 1) switchPart(state.cur + 1);
      else toast('This is the last question. Use the ✓ button to submit.');
    });
    window.addEventListener('beforeunload', (e) => {
      if (!state.submitted && !$('#screen-exam').hidden && state.answers.some((a) => String(a || '').trim())) { e.preventDefault(); e.returnValue = ''; }
    });
  }

  /* ---------------------------------------------------------
     5. UI: divider, modals, settings, fullscreen
     --------------------------------------------------------- */
  function setupDivider() {
    const split = $('#split'), left = $('#paneLeft'), div = $('#divider');
    let dragging = false;
    const move = (clientX) => {
      const r = split.getBoundingClientRect();
      const pct = Math.min(75, Math.max(25, ((clientX - r.left) / r.width) * 100));
      left.style.width = pct + '%';
      prefs.set('split', pct.toFixed(1));
    };
    const down = (e) => { dragging = true; document.body.style.userSelect = 'none'; e.preventDefault(); };
    const up = () => { dragging = false; document.body.style.userSelect = ''; };
    div.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', (e) => { if (dragging) move(e.clientX); });
    window.addEventListener('pointerup', up);
    div.addEventListener('dblclick', () => { left.style.width = '50%'; });
    const saved = parseFloat(prefs.get('split', ''));
    if (saved) left.style.width = saved + '%';
  }

  const openModal = (id) => { $(id).hidden = false; };
  const closeModal = (id) => { $(id).hidden = true; };

  function confirmDialog({ title, text, yes = 'Submit', no = 'Cancel' }) {
    return new Promise((resolve) => {
      $('#confirmTitle').textContent = title;
      $('#confirmText').innerHTML = text;
      $('#confirmYes').textContent = yes;
      $('#confirmNo').textContent = no;
      openModal('#confirmModal');
      const done = (val) => {
        closeModal('#confirmModal');
        $('#confirmYes').onclick = $('#confirmNo').onclick = null;
        resolve(val);
      };
      $('#confirmYes').onclick = () => done(true);
      $('#confirmNo').onclick = () => done(false);
    });
  }

  function applyTheme(theme) {
    const resolved = theme === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.body.dataset.theme = resolved;
    document.body.dataset.themePref = theme;
  }
  function applyTextSize(size) { document.body.dataset.textsize = size; }

  function syncSettingsUI() {
    const theme = document.body.dataset.themePref || 'light';
    const size = document.body.dataset.textsize || 'default';
    $$('[data-group="theme"] .opt').forEach((b) => b.classList.toggle('active', b.dataset.value === theme));
    $$('[data-group="textsize"] .opt').forEach((b) => b.classList.toggle('active', b.dataset.value === size));
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => toast('Fullscreen is not available.'));
    else document.exitFullscreen?.();
  }

  const mailto = (subject) => `mailto:${CONFIG.supportEmail}?subject=${encodeURIComponent(subject)}`;

  function setupUI() {
    applyTheme(prefs.get('theme', 'light'));
    applyTextSize(prefs.get('textsize', 'default'));
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      if (document.body.dataset.themePref === 'system') applyTheme('system');
    });

    $('#menuBtn').addEventListener('click', () => { syncSettingsUI(); openModal('#settingsModal'); });
    $('#notesBtn').addEventListener('click', () => { $('#notesArea').value = store.get('notes', ''); openModal('#notesModal'); });
    $('#notesArea').addEventListener('input', debounce(() => store.set('notes', $('#notesArea').value), 300));
    $('#fullscreenBtn').addEventListener('click', toggleFullscreen);
    $('#fullscreenBtn2').addEventListener('click', toggleFullscreen);
    $('#wifiBtn').addEventListener('click', () => toast(navigator.onLine ? 'Connection: online' : 'Connection: offline – your draft is saved locally'));

    $$('.modal-backdrop').forEach((m) => {
      m.addEventListener('mousedown', (e) => { if (e.target === m && m.id !== 'confirmModal') m.hidden = true; });
      $$('[data-close]', m).forEach((b) => b.addEventListener('click', () => { m.hidden = true; }));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') $$('.modal-backdrop').forEach((m) => { if (m.id !== 'confirmModal') m.hidden = true; });
    });

    $$('[data-group="theme"] .opt').forEach((b) => b.addEventListener('click', () => {
      prefs.set('theme', b.dataset.value); applyTheme(b.dataset.value); syncSettingsUI();
    }));
    $$('[data-group="textsize"] .opt').forEach((b) => b.addEventListener('click', () => {
      prefs.set('textsize', b.dataset.value); applyTextSize(b.dataset.value); syncSettingsUI();
    }));

    $('#reportBtn').addEventListener('click', () => {
      closeModal('#settingsModal');
      window.open(mailto('Issue report: ' + CONFIG.exam.title), '_blank');
      toast('Thank you – please describe the issue in the email.');
    });
    $('#leaveBtn').addEventListener('click', async () => {
      closeModal('#settingsModal');
      const ok = await confirmDialog({
        title: 'Leave test without saving?',
        text: 'Your current answer and timer will be discarded.',
        yes: 'Leave', no: 'Stay',
      });
      if (ok) { resetExam(); location.href = CONFIG.testsPage; }
    });

    $('#submitBtn').addEventListener('click', () => submitAnswer({ auto: false }));
    setupDivider();
    setupAnswerBox();
  }

  /* ---------------------------------------------------------
     6. AI check: one request per task; the server has the key and works out the bands
     --------------------------------------------------------- */
  const arr = (v) => (Array.isArray(v) ? v.map(String).filter(Boolean) : (v ? [String(v)] : []));
  const MIN_WORDS_TO_CHECK = 20;

  /** Always returns a complete, safe object. */
  function normalizeResult(raw) {
    const c = raw.criteria || {};
    const crit = (o) => ({ band: roundHalf(o && o.band), comment: String((o && o.comment) || ''), points: arr(o && o.points) });
    return {
      overall: roundHalf(raw.overall),
      summary: String(raw.summary || ''),
      strengths: arr(raw.strengths),
      criteria: { taskAchievement: crit(c.taskAchievement), coherenceCohesion: crit(c.coherenceCohesion), lexicalResource: crit(c.lexicalResource), grammarAccuracy: crit(c.grammarAccuracy) },
      grammar: (Array.isArray(raw.grammar) ? raw.grammar : []).map((g) => ({ wrong: String(g.wrong || ''), correct: String(g.correct || ''), why: String(g.why || '') })),
      vocabulary: (Array.isArray(raw.vocabulary) ? raw.vocabulary : []).map((v) => ({ word: String(v.word || ''), better: arr(v.better), why: String(v.why || ''), example: String(v.example || '') })),
      sampleAnswer: String(raw.sampleAnswer || ''),
      sampleIsModel: !!raw.sampleIsModel,
      plan: (Array.isArray(raw.plan) ? raw.plan : []).map((p) => ({ title: String(p.title || ''), text: String(p.text || '') })),
      quota: raw.quota || null,
      reportId: /^[0-9a-f-]{36}$/i.test(String(raw.reportId || '')) ? String(raw.reportId) : null,
      meta: { source: (raw.meta && raw.meta.source) || 'ai' },
    };
  }

  async function fetchWithTimeout(url, options, ms) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try { return await fetch(url, { ...options, signal: ctrl.signal }); }
    finally { clearTimeout(t); }
  }

  const aiError = (message, status) => { const e = new Error(message); e.status = status; return e; };

  /**
   * The AI check of one task.
   * @param {object} task  one of CONFIG.exam.tasks
   * @param {{answer:string, wordCount:number}} part  the candidate's answer to it
   * @returns {Promise<object>} normalised result
   */
  async function gradeWithAI(task, part) {
    const { ai, exam } = CONFIG;
    if (part.wordCount < MIN_WORDS_TO_CHECK) return normalizeResult(emptyAnswerResult(task, part.wordCount));   // nothing to check: no request, no check used
    const body = exam.materialId
      ? { materialId: exam.materialId, taskId: task.id, answer: part.answer, lang: prefs.get('ai-lang', 'en') }
      : { examId: exam.id, title: exam.title, taskKind: task.kind, taskPrompt: task.prompt, chart: task.chart || null, minWords: task.minWords, answer: part.answer, lang: prefs.get('ai-lang', 'en') };
    let lastErr;
    for (let attempt = 0; attempt <= ai.retries; attempt++) {
      try {
        const res = await fetchWithTimeout(ai.endpoint, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, ai.timeoutMs);
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw aiError(json.error || `The AI check failed (${res.status}). Please try again.`, res.status);
        return normalizeResult(json);
      } catch (err) {
        lastErr = err.name === 'AbortError' ? aiError('The AI took too long to answer. Please try again.', 504)
          : err.status ? err : aiError('The server could not be reached. Check your connection and try again.', 0);
        if (lastErr.status && lastErr.status < 502) break;               // signing in, a limit or a bad request: asking again changes nothing
        if (attempt < ai.retries) await new Promise((r) => setTimeout(r, 1200));
      }
    }
    throw lastErr;
  }

  function emptyAnswerResult(task, words) {
    const z = { band: 0, points: [words ? 'The answer is too short to assess.' : 'No answer was submitted.'] };
    return {
      overall: 0,
      summary: words ? `This answer has only ${words} word${words === 1 ? '' : 's'}, which is too short to assess (Band 0 on all criteria).` : 'No response was submitted, so the task cannot be assessed (Band 0 on all criteria).',
      strengths: [], grammar: [], vocabulary: [],
      criteria: { taskAchievement: z, coherenceCohesion: z, lexicalResource: z, grammarAccuracy: z },
      sampleAnswer: '',
      plan: [{ title: firstCriterion(task), text: isTask2(task)
        ? `Write at least ${task.minWords} words that answer every part of the question with a clear position.`
        : `Write at least ${task.minWords} words describing the main features and comparing the data.` }],
      meta: { source: 'empty' },
    };
  }

  /* ---------------------------------------------------------
     7. Results renderer
     --------------------------------------------------------- */
  const bandClass = (b) => (b >= 7 ? 'good' : b < 5 ? 'low' : '');
  const icon = (id) => `<svg><use href="#${id}"/></svg>`;
  const list = (items) => (items.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '<p class="muted">—</p>');

  // IELTS writing band: Task 2 counts twice as much as Task 1
  function overallBand(results) {
    const ts = tasks();
    let sum = 0, weight = 0;
    results.forEach((r, i) => { const w = isTask2(ts[i]) ? 2 : 1; sum += r.overall * w; weight += w; });
    return roundHalf(weight ? sum / weight : 0);
  }

  function critCard(iconId, title, c) {
    return `<div class="card">
      <div class="crit-head"><h4>${icon(iconId)} ${esc(title)}</h4><span class="band-badge ${bandClass(c.band)}">Band ${c.band.toFixed(1)}</span></div>
      ${c.comment ? `<p class="crit-comment">${esc(c.comment)}</p>` : ''}${c.points.length ? list(c.points) : ''}
    </div>`;
  }

  function taskResultHtml(r, task) {
    const c = r.criteria;
    let html = `<div class="card score-card"><h3>${isTask2(task) ? 'Task 2' : 'Task 1'} Band Score</h3><div class="big">${r.overall.toFixed(1)}</div><p>${esc(r.summary)}</p></div>`;
    html += `<div class="grid2">
      ${critCard('i-target', firstCriterion(task), c.taskAchievement)}
      ${critCard('i-trend', 'Coherence & Cohesion', c.coherenceCohesion)}
      ${critCard('i-book', 'Lexical Resource', c.lexicalResource)}
      ${critCard('i-circle-check', 'Grammatical Range & Accuracy', c.grammarAccuracy)}
    </div>`;
    if (r.strengths.length) html += `<div class="card block"><div class="sec-title">${icon('i-star')} What You Did Well</div>${list(r.strengths)}</div>`;
    if (r.grammar.length) {
      html += `<div class="card block"><div class="sec-title">${icon('i-circle-alert')} Grammar Corrections</div><div class="ai-rows">${
        r.grammar.map((g) => `<div class="ai-row"><div class="ai-fix"><s>${esc(g.wrong)}</s><span aria-hidden="true">→</span><b>${esc(g.correct)}</b></div>${g.why ? `<p>${esc(g.why)}</p>` : ''}</div>`).join('')}</div></div>`;
    }
    if (r.vocabulary.length) {
      html += `<div class="card block"><div class="sec-title">${icon('i-book')} Vocabulary Upgrades</div><div class="ai-rows">${
        r.vocabulary.map((v) => `<div class="ai-row"><div class="ai-fix"><s>${esc(v.word)}</s><span aria-hidden="true">→</span><b>${v.better.map(esc).join(', ')}</b></div>${v.why ? `<p>${esc(v.why)}</p>` : ''}${v.example ? `<p class="ai-eg">${esc(v.example)}</p>` : ''}</div>`).join('')}</div></div>`;
    }
    if (r.sampleAnswer) {
      const paras = r.sampleAnswer.split(/\n\s*\n/).map((t) => `<p>${esc(t.trim())}</p>`).join('');
      html += `<div class="card block sample"><div class="sec-title">${icon('i-star')} ${r.sampleIsModel ? 'Model Answer' : 'Model Answer (Band 9, written by AI)'}</div>${paras}</div>`;
    }
    if (r.plan.length) {
      html += `<div class="card block"><div class="sec-title">${icon('i-target')} Your Next Steps</div><ol>${
        r.plan.map((x) => `<li>${x.title ? `<strong>${esc(x.title)}</strong>: ` : ''}${esc(x.text)}</li>`).join('')}</ol></div>`;
    }
    return html;
  }

  function renderResults(results) {
    const ts = tasks(), sub = state.lastSubmission;
    let html = `<h2 class="res-title">Exam Results</h2><span class="res-chip">WRITING Section</span>`;
    if (results.length > 1) {
      html += `<div class="card score-card overall-card"><h3>Writing Band Score</h3><div class="big">${overallBand(results).toFixed(1)}</div>
        <p>${ts.map((t, i) => `${esc(t.title)}: Band ${results[i].overall.toFixed(1)}`).join(' · ')}. Task 2 counts twice as much as Task 1.</p></div>`;
    }
    results.forEach((r, i) => {
      if (results.length > 1) html += `<div class="task-head"><h3>Part ${i + 1} · ${esc(ts[i].title)}</h3><span>${sub?.parts[i]?.wordCount || 0} words</span></div>`;
      html += taskResultHtml(r, ts[i]);
    });
    const q = results.map((r) => r.quota).filter(Boolean).pop();
    html += `<p class="ai-note">This band is an estimate from AI to help you practise, not an official IELTS score.${q && q.limit !== null ? ` AI checks left this month: ${q.remaining} of ${q.limit}.` : ''}</p>`;
    // every check is kept on the account (ai-store.js on the server): it opens again from the Performance page on any device
    const saved = results.map((r, i) => ({ id: r.reportId, i })).filter((x) => x.id);
    if (saved.length) html += `<p class="ai-note">Saved to your account. Open it again any time in the AI feedback archive: ${saved.map((x) => `<a href="/study/Tools/Performance#ai-report=${encodeURIComponent(x.id)}">${saved.length > 1 ? 'Part ' + (x.i + 1) : 'open the feedback'}</a>`).join(' · ')}.</p>`;
    html += `<div class="res-actions">
      <button class="btn-outline" id="reportIssueBtn">Report Issue</button>
      <button class="btn-outline" id="reviewBtn">Review Mistakes</button>
      <button class="btn-dark" id="finishBtn">Finish</button>
    </div>`;
    $('#resultsContent').innerHTML = html;
    bindResultButtons();
  }

  function renderLoading(text) {
    $('#resultsContent').innerHTML =
      `<div class="card loading-box"><div class="spinner"></div><h3>${esc(text || 'Checking your writing…')}</h3><p class="muted">The AI examiner is reading your answer. This usually takes less than a minute.</p></div>`;
  }

  function renderError(err) {
    const next = encodeURIComponent(location.pathname + location.search);
    const action = err && err.status === 401 ? `<a class="btn-dark" href="/login?next=${next}">Sign in</a>`
      : err && err.status === 402 ? '<a class="btn-dark" href="/Price">See plans</a>'
      : '<button class="btn-outline" id="retryBtn">Try again</button>';
    $('#resultsContent').innerHTML =
      `<h2 class="res-title">Exam Results</h2><span class="res-chip">WRITING Section</span>
       <div class="card" style="text-align:center">
         <h3>${err && err.status === 401 ? 'Sign in to get AI feedback' : err && err.status === 402 ? 'No AI checks left' : 'No Feedback Yet'}</h3>
         <p class="muted">Your answer is saved on this device, so nothing is lost.</p>
         <p class="err">${esc((err && err.message) || 'Unknown error')}</p>
         <div class="res-actions" style="border:0">
           ${action}
           <button class="btn-outline" id="reviewBtn">See My Answer</button>
           <button class="btn-dark" id="finishBtn">Finish</button>
         </div>
       </div>`;
    $('#retryBtn')?.addEventListener('click', () => runGrading());
    bindResultButtons();
  }

  function bindResultButtons() {
    $('#reportIssueBtn')?.addEventListener('click', () => {
      window.open(mailto('Result issue: ' + CONFIG.exam.title), '_blank');
    });
    $('#reviewBtn')?.addEventListener('click', () => {
      const parts = state.lastSubmission?.parts || [];
      confirmDialog({
        title: 'Your submitted answer' + (parts.length > 1 ? 's' : ''),
        text: `<div style="max-height:50vh;overflow:auto;font-size:14px">${parts.map((p, i) =>
          `${parts.length > 1 ? `<h4 style="margin:12px 0 4px">Part ${i + 1}</h4>` : ''}<div style="white-space:pre-wrap">${esc(p.answer || '(empty)')}</div><p class="muted">${p.wordCount} words</p>`).join('')}</div>`,
        yes: 'Close', no: 'Back',
      });
    });
    $('#finishBtn')?.addEventListener('click', async () => {
      const ok = await confirmDialog({ title: 'Finish session?', text: 'Your result is saved. You will return to the writing tasks.', yes: 'Finish', no: 'Stay' });
      if (ok) { resetExam({ clearResult: false }); location.href = CONFIG.testsPage; }
    });
  }

  /* ---------------------------------------------------------
     8. Flow control
     --------------------------------------------------------- */
  class ExamError extends Error { constructor(msg, html) { super(msg); this.html = html || ''; } }

  /** The demo, or the writing set from the admin panel (/writing/?id=…). */
  async function loadExam() {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) return DEMO_EXAM;
    let r, d;
    try { r = await fetch('/api/materials/' + encodeURIComponent(id), { credentials: 'same-origin' }); d = await r.json().catch(() => ({})); }
    catch (e) { throw new ExamError('Cannot reach the server. Check your connection and reload the page.'); }
    if (r.status === 401) throw new ExamError('Please sign in to open this test.', `<a href="/login?next=${encodeURIComponent(location.pathname + location.search)}">Sign in</a>`);
    if (r.status === 403) throw new ExamError('This test is for Premium members.', '<a href="/Price">See plans</a>');
    if (!r.ok || !d.item || d.item.type !== 'writing') throw new ExamError(d.error || 'Test not found. It may have been removed.');
    const m = d.item, data = m.data || {};
    const list = (data.tasks || []).map((t, i) => {
      const kind = t.kind || (i ? 'task2' : 'task1');
      return { id: t.id || 't' + (i + 1), kind, title: t.title || 'Task ' + (i + 1), prompt: t.prompt || '', imageUrl: t.imageUrl || '', chart: t.chart || null,
        minWords: t.minWords || (kind === 'task2' ? 250 : 150), minutes: t.minutes || 0, hasSample: !!t.hasSample, sample: '' };
    });
    if (!list.length) throw new ExamError('This test has no tasks yet.');
    return { id: 'm-' + m.id, materialId: m.id, title: m.title, tasks: list,
      durationMinutes: data.durationMin || list.reduce((a, t) => a + (t.minutes || 0), 0) || 60 };
  }

  // model answers of admin tests are sent only after the test is submitted
  async function loadSamples() {
    const exam = CONFIG.exam;
    if (!exam.materialId || exam.samplesLoaded || !exam.tasks.some((t) => t.hasSample)) return;
    try {
      const r = await fetch('/api/materials/' + encodeURIComponent(exam.materialId) + '/sample', { credentials: 'same-origin' });
      const d = r.ok ? await r.json() : {};
      (d.samples || []).forEach((s) => { const t = exam.tasks.find((x) => x.id === s.id); if (t) t.sample = s.sample || ''; });
      exam.samplesLoaded = true;
    } catch (e) { /* results still show without it */ }
  }

  async function loadUser() {
    try {
      const r = await fetch('/api/auth/me', { credentials: 'same-origin' });
      state.user = r.ok ? (await r.json()).user || null : null;
    } catch (e) { state.user = null; }
  }

  function beginExam() {
    state.submitted = false;
    state.results = null;
    const dur = CONFIG.exam.durationMinutes * 60 * 1000;
    let endsAt = store.get('endsAt');
    if (!endsAt || endsAt < Date.now()) { endsAt = Date.now() + dur; store.set('endsAt', endsAt); store.set('startedAt', Date.now()); }
    state.endsAt = endsAt;
    state.startedAt = store.get('startedAt', Date.now());
    state.answers = tasks().map((_, i) => store.get('draft:' + i, ''));
    showScreen('exam');
    showPart(store.get('part', 0));
    startTimer();
    focusAnswer();
  }

  async function submitAnswer({ auto }) {
    if (state.submitted) return;
    state.answers[state.cur] = $('#answer').value;
    const ts = tasks();
    const parts = ts.map((t, i) => ({ answer: state.answers[i] || '', wordCount: countWords(state.answers[i]) }));
    if (!auto) {
      const many = ts.length > 1;
      const counts = parts.map((p, i) => `${many ? `Part ${i + 1}: ` : ''}<strong>${p.wordCount}</strong> words` +
        (p.wordCount < ts[i].minWords ? ` <span class="err">(minimum ${ts[i].minWords})</span>` : '')).join('<br>');
      const short = parts.some((p, i) => p.wordCount < ts[i].minWords);
      const ok = await confirmDialog({
        title: 'Submit your answer' + (many ? 's' : '') + '?',
        text: `You have written:<br>${counts}${short ? '<br><strong>Answers under the minimum may lose marks.</strong>' : ''}<br>You cannot change ${many ? 'them' : 'it'} after submitting.`,
      });
      if (!ok) return;
    }
    state.submitted = true;
    stopTimer();
    state.lastSubmission = {
      parts,
      timeSpentSeconds: Math.min(CONFIG.exam.durationMinutes * 60, Math.round((Date.now() - state.startedAt) / 1000)),
    };
    store.set('submission', state.lastSubmission);
    store.del('result');
    clearDrafts();
    const u = state.user;
    $('#testTakerId').textContent = 'Test taker ID: ' + (u ? u.email || u.id : 'Guest');
    showScreen('results');
    await runGrading();
  }

  async function runGrading() {
    renderLoading();
    try {
      const sub = state.lastSubmission, ts = tasks();
      const results = [];
      // one task after the other: each check is one request of up to a minute
      for (let i = 0; i < ts.length; i++) {
        renderLoading(ts.length > 1 ? `Checking Part ${i + 1} of ${ts.length}…` : 'Checking your writing…');
        results.push(await gradeWithAI(ts[i], sub.parts[i]));
      }
      // an unanswered task still shows the teacher's model answer; a checked one got it from the server
      if (results.some((r) => r.meta.source === 'empty')) {
        await loadSamples();
        results.forEach((r, i) => { if (r.meta.source === 'empty' && ts[i].sample && CONFIG.exam.materialId) { r.sampleAnswer = ts[i].sample; r.sampleIsModel = true; } });
      }
      state.results = results;
      store.set('result', results);
      renderResults(results);
      saveToAccount(results);
      loadAiStatus();
    } catch (err) {
      console.error('[AI check failed]', err);
      renderError(err);
    }
  }

  // only a real check goes to the account (an empty part counts as Band 0, as in the exam)
  function saveToAccount(results) {
    const sub = state.lastSubmission;
    if (!results.some((r) => r.meta.source === 'ai')) return;
    fetch('/api/results', {
      method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testKey: '/writing/' + (CONFIG.exam.materialId || CONFIG.exam.id), section: 'Writing', bucket: 'Practice',
        pageLabel: CONFIG.exam.title, scoreCorrect: sub.parts.filter((p) => p.wordCount).length, scoreTotal: tasks().length, band: overallBand(results), durationSec: sub.timeSpentSeconds }),
    }).catch(() => { /* the result is still on screen */ });
  }

  /* the line on the start screen: how many checks are left, in which language the feedback comes */
  async function loadAiStatus() {
    const box = $('#aiStatus'); if (!box) return;
    let d = null;
    try { const r = await fetch('/api/ai/status', { credentials: 'same-origin', cache: 'no-store' }); d = r.ok ? await r.json() : null; } catch (e) { /* offline */ }
    if (!d) { box.textContent = ''; return; }
    const next = encodeURIComponent(location.pathname + location.search);
    box.innerHTML = !d.configured ? 'The AI check is not available yet.' + (d.problem ? ` <span class="err">${esc(d.problem)}</span>` : '')
      : !d.signedIn ? `<a href="/login?next=${next}">Sign in</a> to get AI feedback when you finish.`
      : d.limit === null ? 'AI feedback is on.'
      : d.remaining > 0 ? `AI checks left this month: <b>${d.remaining}</b> of ${d.limit}.`
      : `You have used your AI checks for this month. <a href="/Price">See plans</a>`;
  }

  function clearDrafts() {
    tasks().forEach((_, i) => store.del('draft:' + i));
    store.del('part'); store.del('endsAt'); store.del('startedAt');
  }

  function resetExam({ clearResult = true } = {}) {
    stopTimer();
    clearDrafts();
    if (clearResult) { store.del('result'); store.del('submission'); }
    state.submitted = false;
    state.answers = [];
    $('#answer').value = '';
    updateWordCount();
    if (document.fullscreenElement) document.exitFullscreen?.();
    showScreen('start');
  }

  async function init() {
    setupUI();
    showScreen('start');
    $('#startTitle').textContent = 'Loading…';
    try {
      CONFIG.exam = await loadExam();
    } catch (err) {
      $('#startTitle').textContent = 'Writing test';
      const msg = $('#startMsg');
      msg.innerHTML = esc(err.message) + (err.html ? ' ' + err.html : '');
      msg.hidden = false;
      return;
    }
    const exam = CONFIG.exam;
    $('#startTitle').textContent = exam.title;
    $('#examTitle').textContent = exam.title;
    document.title = exam.title + ' — IELTSX';
    $('#startParts').textContent = `${exam.tasks.length} part${exam.tasks.length > 1 ? 's' : ''} · ${exam.durationMinutes} minutes · ` +
      exam.tasks.map((t, i) => `Part ${i + 1}: ${t.title} (at least ${t.minWords} words)`).join(' · ');
    $('#startBtn').disabled = false;
    $('#startBtn').addEventListener('click', beginExam);
    const langSel = $('#aiLang');
    if (langSel) { langSel.value = prefs.get('ai-lang', 'en'); langSel.addEventListener('change', () => prefs.set('ai-lang', langSel.value)); }
    loadAiStatus();
    // remember which part was open when the page is reloaded
    window.addEventListener('pagehide', () => { if (!$('#screen-exam').hidden) store.set('part', state.cur); });
    loadUser();

    // Resume a running exam after refresh
    const endsAt = store.get('endsAt');
    if (endsAt && endsAt > Date.now()) { beginExam(); return; }
    // the last finished attempt can be opened again (its feedback, or the check that did not finish)
    const lastSub = store.get('submission'), lastRes = store.get('result');
    if (lastSub && Array.isArray(lastSub.parts) && lastSub.parts.length === exam.tasks.length) {
      const msg = $('#startMsg');
      msg.innerHTML = 'You have a finished attempt on this test. <a href="#" id="seeLast">' + (lastRes ? 'See your feedback' : 'Get your AI feedback') + '</a>';
      msg.hidden = false;
      $('#seeLast').addEventListener('click', (e) => {
        e.preventDefault();
        state.lastSubmission = lastSub; state.submitted = true;
        const u = state.user; $('#testTakerId').textContent = 'Test taker ID: ' + (u ? u.email || u.id : 'Guest');
        showScreen('results');
        const ok = Array.isArray(lastRes) && lastRes.length === exam.tasks.length && lastRes.every((r) => r && r.meta && r.grammar);
        if (ok) renderResults(lastRes); else runGrading();
      });
    }
  }

  // Public hooks so you can configure / call the AI from the console or other scripts
  window.IELTSApp = { CONFIG, DEMO_EXAM, gradeWithAI, normalizeResult, renderResults, state };

  document.addEventListener('DOMContentLoaded', init);
})();
