/* ============================================================
   FULL MOCK · Writing test
   60-minute clock, word counts, options sheet (contrast / text size),
   draggable divider. Built on the shell API in js/mock.js (window.Mock).

   Real Exam Mode : no submit button; the paper is submitted by the clock.
   Practice Mode  : the tick button (and Options > Go to submission page) submits.
   ============================================================ */
(function () {
  'use strict';
  const { $, qsa, esc, show, goFull, save, ask, words, completeSession, logViolation } = Mock;
  const WRITING_MINUTES = 60;
  const state = () => Mock.S;
  let current = 1, timer = null;

  /* ---------------------------------------------------------------- start */
  function start() {
    goFull();
    if (!state().wEndsAt) {
      ask('Start the Writing test now? You will have ' + WRITING_MINUTES + ' minutes for both tasks.', 'Start the Writing test', begin);
      return;
    }
    begin();                                         // resuming: the clock kept running
  }
  function begin() {
    goFull();
    const s = state();
    Mock.running = 'writing';
    if (!s.wEndsAt) { s.wEndsAt = Date.now() + WRITING_MINUTES * 60000; save(); }
    $('wText1').value = s.w.t1 || ''; $('wText2').value = s.w.t2 || '';
    applyMode(); renderPrompts();
    show('scWriting'); showTask(1); paintCounts();
    clearInterval(timer); tick(); timer = setInterval(tick, 1000);
    setTimeout(() => $('wText1').focus(), 50);
  }
  /* the two tasks come from the mock this candidate was given (js/tests.js) */
  function renderPrompts() {
    const w = Mock.test.writing, lines = a => a.map(l => '<p>' + esc(l) + '</p>').join('');
    $('wPrompt1').innerHTML = '<h3>WRITING TASK 1</h3><p>You should spend about <b>20 minutes</b> on this task.</p>'
      + '<div class="tbox">' + lines(w.task1.lines) + '</div><p><b>Write at least 150 words.</b></p>'
      + (w.task1.img ? '<figure><img alt="' + esc(w.task1.alt || '') + '" src="' + esc(w.task1.img) + '"></figure>' : '');
    $('wPrompt2').innerHTML = '<h3>WRITING TASK 2</h3><p>You should spend about <b>40 minutes</b> on this task.</p><p>Write about the following topic:</p>'
      + '<div class="tbox">' + lines(w.task2.lines) + '</div>'
      + '<p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p><p><b>Write at least 250 words.</b></p>';
  }
  function applyMode() {
    const real = state().mode === 'real';
    ['wSubmit', 'mSubmit'].forEach(id => $(id).classList.toggle('hidden', real));
  }

  /* ---------------------------------------------------------------- clock */
  function tick() {
    const left = Math.max(0, Math.round((state().wEndsAt - Date.now()) / 1000));
    const m = Math.ceil(left / 60);
    $('wClock').textContent = left <= 0 ? 'Time is up' : (left < 60 ? left + ' seconds left' : m + (m === 1 ? ' minute left' : ' minutes left'));
    $('wClockBox').classList.toggle('warn', left <= 300);
    if (left <= 0) { clearInterval(timer); submit(true); }            // the clock submits the paper
  }

  /* ---------------------------------------------------------------- tasks */
  function showTask(n) {
    current = n;
    $('wPrompt1').classList.toggle('hidden', n !== 1); $('wPrompt2').classList.toggle('hidden', n !== 2);
    $('wText1').classList.toggle('hidden', n !== 1);   $('wText2').classList.toggle('hidden', n !== 2);
    $('wTab1').classList.toggle('sel', n === 1);       $('wTab2').classList.toggle('sel', n === 2);
    $('wTitle').textContent = 'Task ' + n;
    $('wSub').textContent = n === 1 ? 'You should spend about 20 minutes on this task. Write at least 150 words.'
                                    : 'You should spend about 40 minutes on this task. Write at least 250 words.';
    $('wLeft').scrollTop = 0;
    $('wText' + n).focus();
  }
  function paintCounts() {
    const a = words($('wText1').value), b = words($('wText2').value);
    $('wWc1').textContent = a + (a === 1 ? ' word' : ' words');
    $('wWc2').textContent = b + (b === 1 ? ' word' : ' words');
    $('wCount').textContent = 'Task 1: ' + a + ' words · Task 2: ' + b + ' words';
  }
  ['wText1', 'wText2'].forEach((id, i) => {
    const ta = $(id);
    ta.addEventListener('input', () => { state().w['t' + (i + 1)] = ta.value; save(); paintCounts(); });
    /* Real Exam Mode: what you write has to be typed here */
    ['paste', 'drop', 'cut', 'copy'].forEach(ev => ta.addEventListener(ev, e => {
      if (state().mode === 'real') { e.preventDefault(); if (ev === 'paste' || ev === 'drop') logViolation('paste blocked'); }
    }));
  });

  /* --------------------------------------------------------------- submit */
  function submit(auto) {
    if (Mock.running !== 'writing') return;
    if (!auto) {
      if (state().mode === 'real') return;                            // no manual submit in Real Exam Mode
      ask('Submit the Writing test and finish the mock test?', 'Submit', () => finalize(), 'Keep writing');
      return;
    }
    finalize();
  }
  function finalize() {
    if (Mock.running !== 'writing') return;
    clearInterval(timer);
    const s = state();
    s.w.t1 = $('wText1').value; s.w.t2 = $('wText2').value; s.done.writing = true;
    document.body.classList.remove('c-wb', 'c-yb', 'ts-large', 'ts-xlarge');
    closeMenu();
    completeSession();
  }

  /* ----------------------------------------------------- draggable divider */
  (function () {
    const div = $('wDiv'), left = $('wLeft'), main = $('wMain');
    let drag = false;
    const move = x => { const r = main.getBoundingClientRect(); left.style.flexBasis = Math.min(80, Math.max(20, (x - r.left) / r.width * 100)) + '%'; };
    div.addEventListener('mousedown', e => { drag = true; e.preventDefault(); document.body.style.userSelect = 'none'; });
    document.addEventListener('mousemove', e => { if (drag) move(e.clientX); });
    document.addEventListener('mouseup', () => { drag = false; document.body.style.userSelect = ''; });
    div.addEventListener('touchstart', () => { drag = true; }, { passive: true });
    document.addEventListener('touchmove', e => { if (drag) move(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('touchend', () => { drag = false; });
  })();

  /* ---------------------------------------------------------- options sheet */
  const openMenu = () => { $('menu').classList.add('open'); menuRoot(); };
  const closeMenu = () => $('menu').classList.remove('open');
  function menuRoot() {
    $('mTitle').textContent = 'Options'; $('mBack').classList.remove('show');
    $('mRoot').classList.remove('hidden'); $('mContrast').classList.add('hidden'); $('mText').classList.add('hidden');
  }
  function menuView(v) {
    $('mBack').classList.add('show'); $('mRoot').classList.add('hidden');
    if (v === 'contrast') { $('mTitle').textContent = 'Contrast'; $('mContrast').classList.remove('hidden'); }
    else { $('mTitle').textContent = 'Text size'; $('mText').classList.remove('hidden'); }
  }
  const tick1 = (sel, row) => { qsa(sel + ' .ck').forEach(c => { c.textContent = ''; }); row.querySelector('.ck').textContent = '✔'; };
  qsa('[data-contrast]').forEach(r => r.addEventListener('click', () => {
    document.body.classList.remove('c-wb', 'c-yb');
    if (r.dataset.contrast !== 'bw') document.body.classList.add('c-' + r.dataset.contrast);
    tick1('[data-contrast]', r);
  }));
  qsa('[data-ts]').forEach(r => r.addEventListener('click', () => {
    document.body.classList.remove('ts-large', 'ts-xlarge');
    if (r.dataset.ts !== 'regular') document.body.classList.add('ts-' + r.dataset.ts);
    tick1('[data-ts]', r);
  }));

  /* -------------------------------------------------------------- actions */
  const actions = {
    'task': el => showTask(Number(el.dataset.n)),
    'w-submit': () => submit(false),
    'menu-open': openMenu, 'menu-close': closeMenu, 'menu-root': menuRoot,
    'menu-view': el => menuView(el.dataset.v),
    'menu-submit': () => { closeMenu(); submit(false); }
  };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (el && actions[el.dataset.action]) actions[el.dataset.action](el, e);
  });
  $('scWriting').addEventListener('mousedown', goFull);

  Mock.attach('writing', { start });
})();
