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
     6. AI grading (gradeWithAI) + normalisation + mock
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

    /**
     * AI SETTINGS
     * --------------------------------------------------------
     * endpoint : URL of YOUR backend (recommended) that calls the AI model.
     *            NEVER put a secret API key in browser code in production –
     *            keep the key on the server and let the endpoint proxy it.
     *            Leave '' to use the built-in offline MOCK grader (demo only).
     *
     * The endpoint receives POST JSON (one request per task):
     *   { prompt, systemPrompt, examId, taskId, taskType, taskPrompt, chartData, imageUrl,
     *     answer, wordCount, timeSpentSeconds, model }
     * and must reply with JSON that matches the schema in AI_SCHEMA below
     * (either directly, or as a string inside { result | content | text | output }).
     *
     * If you need a custom body (e.g. OpenAI / Anthropic format) set
     * `buildRequestBody(payload)` and `extractText(responseJson)`.
     */
    ai: {
      endpoint: '',                 // e.g. 'https://your-server.com/api/grade-writing'
      apiKey: '',                   // optional; sent as Bearer token (prefer server-side keys)
      model: 'default',
      timeoutMs: 60000,
      retries: 1,
      headers: {},                  // extra headers
      buildRequestBody: null,       // (payload) => object
      extractText: null,            // (json) => string | object
      useMockOnError: false,        // true = fall back to mock if the API fails
    },
  };

  const AI_SCHEMA = {
    overall: 6.5,
    summary: 'string',
    criteria: {
      taskAchievement: { band: 6.5, points: ['string'] },
      coherenceCohesion: { band: 6.5, points: ['string'] },
      lexicalResource: { band: 6.5, points: ['string'] },
      grammarAccuracy: { band: 6.5, points: ['string'] },
    },
    problems: { language: ['string'], content: ['string'], structure: ['string'] },
    sampleAnswer: 'string (paragraphs separated by \\n\\n)',
    keyImprovements: ['string'],
    plan: [{ title: 'Task Response', text: 'string' }],
  };

  const isTask2 = (task) => task.kind === 'task2';
  const taskType = (task) => (isTask2(task) ? 'Writing Task 2 (essay)'
    : 'Academic Writing Task 1' + (task.chart ? ' (line graph)' : task.imageUrl ? ' (visual information)' : ''));
  const firstCriterion = (task) => (isTask2(task) ? 'Task Response' : 'Task Achievement');

  const systemPrompt = (task) =>
    'You are a certified IELTS examiner. Assess the candidate\'s ' + taskType(task) + ' strictly with the official ' +
    'IELTS public band descriptors (' + firstCriterion(task) + ', Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy). ' +
    'Use half-band steps (e.g. 6.5). Quote real mistakes from the candidate text. ' + (task.chart ? 'Be accurate about the chart data. ' : '') +
    'Respond with ONE valid JSON object only, no markdown, matching exactly this schema ' +
    '(put the ' + firstCriterion(task) + ' band in criteria.taskAchievement): ' + JSON.stringify(AI_SCHEMA);

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
     6. AI grading
     --------------------------------------------------------- */
  function buildUserPrompt(task, p) {
    const lines = [`TASK TYPE: ${p.taskType}`, `TASK PROMPT: ${p.taskPrompt}`];
    if (task.chart) {
      const chartLines = task.chart.series
        .map((s) => `- ${s.name}: ` + task.chart.years.map((y, i) => `${y}=${s.values[i]}`).join(', '))
        .join('\n');
      lines.push(`CHART DATA${task.chart.unit ? ` (${task.chart.unit})` : ''}:\n${chartLines}`);
    }
    if (task.imageUrl) lines.push(`TASK PICTURE: ${task.imageUrl}`);
    lines.push(
      `MINIMUM WORDS: ${task.minWords}`,
      `CANDIDATE WORD COUNT: ${p.wordCount}`,
      `TIME SPENT ON THE WHOLE TEST: ${Math.round(p.timeSpentSeconds / 60)} minutes`,
      'CANDIDATE ANSWER:\n"""\n' + p.answer + '\n"""',
      'Return the JSON object now.',
    );
    return lines.join('\n\n');
  }

  function extractJSON(text) {
    if (text && typeof text === 'object') return text;
    const str = String(text || '').replace(/```json|```/gi, '');
    const a = str.indexOf('{'), b = str.lastIndexOf('}');
    if (a < 0 || b <= a) throw new Error('AI did not return JSON.');
    return JSON.parse(str.slice(a, b + 1));
  }

  const arr = (v) => (Array.isArray(v) ? v.map(String).filter(Boolean) : (v ? [String(v)] : []));

  /** Accepts several key spellings and always returns a complete, safe object. */
  function normalizeResult(raw) {
    const c = raw.criteria || {};
    const pick = (...keys) => { for (const k of keys) if (c[k] != null) return c[k]; return {}; };
    const crit = (o) => ({ band: roundHalf(o.band ?? o.score), points: arr(o.points ?? o.feedback ?? o.comments) });
    const criteria = {
      taskAchievement: crit(pick('taskAchievement', 'task_achievement', 'ta', 'taskResponse', 'task_response', 'tr')),
      coherenceCohesion: crit(pick('coherenceCohesion', 'coherence_cohesion', 'cc')),
      lexicalResource: crit(pick('lexicalResource', 'lexical_resource', 'lr')),
      grammarAccuracy: crit(pick('grammarAccuracy', 'grammatical_range_accuracy', 'gra', 'grammar')),
    };
    const bands = Object.values(criteria).map((x) => x.band);
    const avg = bands.reduce((a, b) => a + b, 0) / (bands.length || 1);
    const pr = raw.problems || {};
    return {
      overall: roundHalf(raw.overall ?? raw.band ?? avg),
      summary: String(raw.summary || ''),
      criteria,
      problems: { language: arr(pr.language), content: arr(pr.content), structure: arr(pr.structure) },
      sampleAnswer: String(raw.sampleAnswer || raw.sample_answer || ''),
      keyImprovements: arr(raw.keyImprovements || raw.key_improvements),
      plan: (Array.isArray(raw.plan) ? raw.plan : []).map((p) =>
        typeof p === 'string' ? { title: '', text: p } : { title: String(p.title || ''), text: String(p.text || p.description || '') }),
      meta: { source: raw.meta?.source || 'ai' },
    };
  }

  async function fetchWithTimeout(url, options, ms) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try { return await fetch(url, { ...options, signal: ctrl.signal }); }
    finally { clearTimeout(t); }
  }

  /**
   * Main entry for the AI examiner (one call per task).
   * @param {object} task  one of CONFIG.exam.tasks
   * @param {{answer:string, wordCount:number}} part  the candidate's answer to it
   * @param {number} timeSpentSeconds
   * @returns {Promise<object>} normalised result
   */
  async function gradeWithAI(task, part, timeSpentSeconds) {
    const { ai, exam } = CONFIG;
    if (!part.answer.trim()) return normalizeResult(emptyAnswerResult(task));

    const payload = {
      prompt: '',
      systemPrompt: systemPrompt(task),
      examId: exam.id,
      taskId: task.id,
      taskType: taskType(task),
      taskPrompt: task.prompt,
      chartData: task.chart || null,
      imageUrl: task.imageUrl || null,
      answer: part.answer,
      wordCount: part.wordCount,
      timeSpentSeconds,
      model: ai.model,
    };
    payload.prompt = buildUserPrompt(task, payload);

    if (!ai.endpoint) return mockGrade(task, part);

    const body = typeof ai.buildRequestBody === 'function' ? ai.buildRequestBody(payload) : payload;
    const headers = { 'Content-Type': 'application/json', ...ai.headers };
    if (ai.apiKey) headers.Authorization = `Bearer ${ai.apiKey}`;

    let lastErr;
    for (let attempt = 0; attempt <= ai.retries; attempt++) {
      try {
        const res = await fetchWithTimeout(ai.endpoint, { method: 'POST', headers, body: JSON.stringify(body) }, ai.timeoutMs);
        if (!res.ok) throw new Error(`AI server error ${res.status}`);
        const json = await res.json();
        let raw = typeof ai.extractText === 'function'
          ? ai.extractText(json)
          : (json.result ?? json.content ?? json.text ?? json.output ?? json.choices?.[0]?.message?.content ?? json);
        raw = extractJSON(raw);
        const out = normalizeResult(raw);
        out.meta.source = 'ai';
        return out;
      } catch (err) {
        lastErr = err.name === 'AbortError' ? new Error('AI request timed out.') : err;
        if (attempt < ai.retries) await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
      }
    }
    if (ai.useMockOnError) return mockGrade(task, part);
    throw lastErr;
  }

  function emptyAnswerResult(task) {
    const z = { band: 0, points: ['No answer was submitted.'] };
    return {
      overall: 0,
      summary: 'No response was submitted, so the task cannot be assessed (Band 0 on all criteria).',
      criteria: { taskAchievement: z, coherenceCohesion: z, lexicalResource: z, grammarAccuracy: z },
      problems: { language: [], content: [isTask2(task)
        ? `Write at least ${task.minWords} words that answer every part of the question with a clear position.`
        : `Write at least ${task.minWords} words describing the main features and comparing the data.`], structure: [] },
      sampleAnswer: '', keyImprovements: [], plan: [],
      meta: { source: 'empty' },
    };
  }

  /** Offline demo grader – replace by a real endpoint in CONFIG.ai.endpoint */
  async function mockGrade(task, part) {
    await new Promise((r) => setTimeout(r, 1400));
    const text = part.answer;
    const words = part.wordCount;
    const t2 = isTask2(task);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length || 1;
    const avgLen = words / sentences;
    const paragraphs = text.split(/\n\s*\n/).filter((s) => s.trim()).length;
    const linkers = (text.match(/\b(however|whereas|while|in contrast|overall|meanwhile|similarly|by contrast|furthermore|moreover|respectively|therefore|consequently|in addition)\b/gi) || []).length;
    const low = words < task.minWords;

    let ta, lr, detected, tips;
    if (!t2) {
      const years = (text.match(/\b(19|20)\d{2}\b/g) || []).length;
      const nums = (text.match(/\b\d+(\.\d+)?%?/g) || []).length;
      const verbs = (text.match(/\b(rose|fell|increased|decreased|declined|climbed|dropped|peaked|remained|fluctuated|stabilised|stabilized|doubled|plummeted)\b/gi) || []).length;
      const overview = /\boverall\b/i.test(text);
      ta = 4 + Math.min(2.5, nums / 8) + (low ? -1 : 0.5) + (overview ? 0.5 : 0);
      lr = 4.5 + Math.min(2.5, verbs * 0.35);
      detected = `Detected ${years} year references, ${nums} figures, ${linkers} linking devices and ${verbs} trend verbs. `;
      tips = {
        ta: [nums >= 6 ? 'Key data points are supported with figures.' : 'Support the main trends with more specific figures.',
          overview ? 'A clear overview is present.' : 'Add a clear overview paragraph that highlights the main trends.'],
        lr: verbs >= 5 ? 'Good range of trend vocabulary.' : 'Vary trend verbs and nouns (rose, climbed, a steady decline, levelled off).',
        content: 'Compare the categories directly, noting where the lines cross or the trends change direction.',
        structure: 'Use 4 paragraphs: introduction, overview, two detail paragraphs.',
        keys: ['Clear overview', 'Accurate figures with comparisons', 'Wide range of trend vocabulary', 'Varied complex structures'],
      };
    } else {
      const positions = (text.match(/\b(in my (opinion|view)|i (strongly )?(believe|think|agree|disagree)|i would argue|this essay (will )?(argue|agree|disagree))/gi) || []).length;
      const examples = (text.match(/\b(for example|for instance|such as)\b/gi) || []).length;
      const conclusion = /\b(in conclusion|to conclude|to sum up|in summary)\b/i.test(text);
      const all = text.toLowerCase().match(/[a-z']+/g) || [];
      const variety = all.length ? new Set(all).size / all.length : 0;
      ta = 4 + (low ? -1 : 0.5) + Math.min(1.5, positions * 0.5) + Math.min(1, examples * 0.5) + (conclusion ? 0.5 : 0);
      lr = 4.5 + Math.max(0, Math.min(2.5, (variety - 0.4) * 9));
      detected = `Detected ${paragraphs} paragraphs, ${positions} position statements, ${examples} examples and ${linkers} linking devices. `;
      tips = {
        ta: [positions ? 'Your position is stated.' : 'State your position clearly in the introduction and keep it to the end.',
          examples >= 2 ? 'Ideas are supported with examples.' : 'Support each main idea with an explanation and a specific example.'],
        lr: variety > 0.55 ? 'Good variety of vocabulary.' : 'Avoid repeating the same words; use topic-specific collocations.',
        content: 'Answer every part of the question and develop each idea fully.',
        structure: 'Use 4–5 paragraphs: introduction, two or three body paragraphs, conclusion.',
        keys: ['Clear position throughout', 'Fully developed main ideas', 'Precise topic vocabulary', 'Varied complex structures'],
      };
    }
    const cc = 4.5 + Math.min(2, linkers * 0.4) + (paragraphs >= (t2 ? 4 : 3) ? 0.5 : 0);
    const gra = 4.5 + Math.min(2, (avgLen - 8) / 5) + (/[,;]/.test(text) ? 0.5 : 0);
    const bands = { ta: roundHalf(ta), cc: roundHalf(cc), lr: roundHalf(lr), gra: roundHalf(gra) };

    return normalizeResult({
      meta: { source: 'mock' },
      overall: (bands.ta + bands.cc + bands.lr + bands.gra) / 4,
      summary: '[DEMO RESULT – offline mock grader, no AI connected] ' +
        (low ? `Your answer has ${words} words, below the ${task.minWords}-word minimum, which limits ${firstCriterion(task)}. ` : '') +
        detected + 'Connect your AI endpoint in CONFIG.ai to get a real examiner-style assessment.',
      criteria: {
        taskAchievement: { band: bands.ta, points: [...tips.ta, low ? `Under-length response: aim for ${task.minWords + 20}–${task.minWords + 40} words.` : 'Length requirement is met.'] },
        coherenceCohesion: { band: bands.cc, points: [
          linkers >= 3 ? 'A reasonable range of linking devices is used.' : 'Use more cohesive devices (whereas, in contrast, moreover).',
          t2 ? 'Give each body paragraph one central idea with a clear topic sentence.' : 'Group related information into separate paragraphs.'] },
        lexicalResource: { band: bands.lr, points: [tips.lr, 'Check spelling and collocations carefully.'] },
        grammarAccuracy: { band: bands.gra, points: [
          avgLen > 14 ? 'Complex sentences are attempted.' : 'Combine short sentences with relative clauses and participles.',
          'Proofread for article, tense and preposition errors.'] },
      },
      problems: {
        language: ['Replace repeated words with synonyms.', t2 ? 'Prefer formal academic phrasing to conversational language.' : 'Use precise prepositions: "from 10% to 49%", "at 39%".'],
        content: [tips.content],
        structure: [tips.structure],
      },
      sampleAnswer: task.sample || '',
      keyImprovements: tips.keys,
      plan: [
        { title: firstCriterion(task), text: t2 ? 'Plan for 5 minutes: decide your position and two supported main ideas before writing.' : 'Always include an overview and compare the data, not just list it.' },
        { title: 'Lexical Resource', text: t2 ? 'Build topic vocabulary sets (education, environment, technology …).' : 'Build a bank of trend phrases and practise paraphrasing the task wording.' },
        { title: 'Grammar', text: 'Proofread for tenses, articles and prepositions.' },
        { title: 'Coherence', text: 'Use signposting and one clear idea per paragraph.' },
      ],
    });
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
      ${list(c.points)}
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

    const p = r.problems;
    if (p.language.length || p.content.length || p.structure.length) {
      html += `<div class="card block"><div class="sec-title">${icon('i-circle-alert')} Specific Problems & Improvements</div>`;
      if (p.language.length) html += `<h5>Language & Style</h5>${list(p.language)}`;
      if (p.content.length) html += `<h5>Content Development</h5>${list(p.content)}`;
      if (p.structure.length) html += `<h5>Structural Improvements</h5>${list(p.structure)}`;
      html += '</div>';
    }
    if (r.sampleAnswer) {
      const paras = r.sampleAnswer.split(/\n\s*\n|\\n\\n/).map((t) => `<p>${esc(t.trim())}</p>`).join('');
      const keys = r.keyImprovements.length ? `<p><strong>Key Improvements:</strong> ${r.keyImprovements.map((k) => '• ' + esc(k)).join(' ')}</p>` : '';
      html += `<div class="card block sample"><div class="sec-title">${icon('i-star')} ${r.sampleIsModel ? 'Model Answer' : 'Sample High-Band Answer (Band 9)'}</div>${paras}${keys}</div>`;
    }
    if (r.plan.length) {
      html += `<div class="card block"><div class="sec-title">${icon('i-target')} Personalized Improvement Plan</div><ol>${
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
    html += `<div class="res-actions">
      <button class="btn-outline" id="reportIssueBtn">Report Issue</button>
      <button class="btn-outline" id="reviewBtn">Review Mistakes</button>
      <button class="btn-dark" id="finishBtn">Finish</button>
    </div>`;
    $('#resultsContent').innerHTML = html;
    bindResultButtons();
  }

  function renderLoading() {
    $('#resultsContent').innerHTML =
      `<div class="card loading-box"><div class="spinner"></div><h3>Checking your writing…</h3><p class="muted">The examiner is assessing your answer. Please wait.</p></div>`;
  }

  function renderError(err) {
    $('#resultsContent').innerHTML =
      `<h2 class="res-title">Exam Results</h2><span class="res-chip">WRITING Section</span>
       <div class="card" style="text-align:center">
         <h3>No Feedback Available</h3>
         <p class="muted">Your test has been submitted successfully. Feedback was not generated during submission.</p>
         <p class="err">${esc(err?.message || 'Unknown error')}</p>
         <div class="res-actions" style="border:0">
           <button class="btn-outline" id="retryBtn">Try again</button>
           <button class="btn-outline" id="reportIssueBtn">Report Issue</button>
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
    clearDrafts();
    const u = state.user;
    $('#testTakerId').textContent = 'Test taker ID: ' + (u ? u.email || u.id : 'Guest');
    showScreen('results');
    await runGrading();
  }

  async function runGrading() {
    renderLoading();
    try {
      await loadSamples();
      const sub = state.lastSubmission;
      const results = await Promise.all(tasks().map((t, i) => gradeWithAI(t, sub.parts[i], sub.timeSpentSeconds)));
      // the teacher's model answer (admin panel) replaces the generated sample
      results.forEach((r, i) => { const t = tasks()[i]; if (t.sample && CONFIG.exam.materialId) { r.sampleAnswer = t.sample; r.sampleIsModel = true; } });
      state.results = results;
      store.set('result', results);
      renderResults(results);
      saveToAccount(results);
    } catch (err) {
      console.error('[AI grading failed]', err);
      renderError(err);
    }
  }

  // only real examiner results go to the account (the offline demo grader is not a score)
  function saveToAccount(results) {
    const sub = state.lastSubmission;
    if (!state.user || !results.every((r) => r.meta.source === 'ai')) return;
    const answered = sub.parts.filter((p) => p.wordCount).length;
    if (!answered) return;
    fetch('/api/results', {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testKey: '/writing/' + (CONFIG.exam.materialId || CONFIG.exam.id), section: 'Writing', bucket: 'Practice',
        pageLabel: CONFIG.exam.title, scoreCorrect: answered, scoreTotal: tasks().length, band: overallBand(results), durationSec: sub.timeSpentSeconds }),
    }).catch(() => { /* the result is still on screen */ });
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
    // remember which part was open when the page is reloaded
    window.addEventListener('pagehide', () => { if (!$('#screen-exam').hidden) store.set('part', state.cur); });
    loadUser();

    // Resume a running exam after refresh
    const endsAt = store.get('endsAt');
    if (endsAt && endsAt > Date.now()) beginExam();
  }

  // Public hooks so you can configure / call the AI from the console or other scripts
  window.IELTSApp = { CONFIG, DEMO_EXAM, gradeWithAI, normalizeResult, mockGrade, renderResults, state };

  document.addEventListener('DOMContentLoaded', init);
})();
