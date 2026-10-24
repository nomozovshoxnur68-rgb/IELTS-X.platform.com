/* ============================================================
   FULL MOCK · shell
   login · pre-test checks · guide videos · running Listening / Reading
   (iframes) · results · analyse mistakes · PDF · sending the results.
   Writing lives in js/writing.js; the papers in js/reading.js and js/listening.js.

   SECURITY NOTE
   Everything here runs in the candidate's browser, so it is a deterrent, not a
   vault: it blocks the context menu and the usual shortcuts, keeps the page in
   full screen, logs every attempt to leave, locks Real Exam Mode (no submit,
   no restart) and signs the saved state so hand-edits are noticed. Scores that
   must be trusted should be re-checked on the server that receives the result.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- config */
  const CONFIG = {
    title: 'Full Mock Test',
    storeKey: 'rcdi_fullmock_v3',
    outboxKey: 'rcdi_fullmock_outbox',
    seenKey: 'rcdi_fullmock_bags_v2',       // per-paper shuffled bags (Listening / Reading / Writing rotate on their own)
    allowTestParam: false,                   // true: index.html?l=m15&r=m9&w=m1610 (or ?test=m15 for all three) forces papers (for you, not for candidates)
    /* Where the finished result is POSTed as JSON (name, phone, email, scores,
       answers, writing). Leave '' to keep results on this device only. */
    resultsEndpoint: '',
    salt: 'rcdi-fullmock-v3',
    videos: {
      listening: 'assets/video/listening-guide.mp4',
      reading:   'assets/video/reading-guide.mp4',
      writing:   'assets/video/writing-guide.mp4'
    },
    names: { listening: 'Listening', reading: 'Reading', writing: 'Writing' },
    steps: [
      { k: 'listening', title: 'Listening guide video', meta: 'Listening test: 4 parts, 40 questions, 40 minutes. The recording plays once.' },
      { k: 'reading',   title: 'Reading guide video',   meta: 'Reading test: 3 passages, 40 questions, 60 minutes.' },
      { k: 'writing',   title: 'Writing guide video',   meta: 'Writing test: Task 1 and Task 2, 60 minutes.' }
    ]
  };

  /* ------------------------------------------------------------- utilities */
  const $ = id => document.getElementById(id);
  const qsa = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const words = t => (String(t).match(/[A-Za-z0-9\u00C0-\u024F][A-Za-z0-9\u00C0-\u024F'’\-]*/g) || []).length;
  const stringify = o => JSON.stringify(o);
  /* small non-cryptographic hash (cyrb53) used to sign the saved state */
  function hash(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  let toastTimer = 0;
  function toast(msg) {
    const t = $('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
  }

  /* --------------------------------------------------------- hidden random papers */
  /* Listening, Reading and Writing are drawn SEPARATELY (js/tests.js -> MOCK_POOL), so a
     candidate can get, for example, Listening A + Reading C + Writing B. Each paper has its
     own shuffled bag: everything in it is handed out once before anything repeats, and the
     paper that was just used never comes straight back. Nothing shows which paper it is. */
  const KINDS = ['listening', 'reading', 'writing'];
  const POOL = (function () {
    const p = window.MOCK_POOL || {};
    /* old tests.js (one entry = one whole mock) still works */
    if (!p.listening && Array.isArray(window.MOCK_TESTS)) {
      const T = window.MOCK_TESTS;
      return {
        listening: T.map(t => ({ id: t.id, file: t.listening })),
        reading: T.map(t => ({ id: t.id, file: t.reading })),
        writing: T.map(t => ({ id: t.id, writing: t.writing }))
      };
    }
    return { listening: p.listening || [], reading: p.reading || [], writing: p.writing || [] };
  })();
  const entryOf = (k, id) => POOL[k].find(e => e.id === id) || POOL[k][0] || {};
  const rand = n => {
    if (window.crypto && crypto.getRandomValues) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
    return Math.floor(Math.random() * n);
  };
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function loadBags() {
    try { const b = JSON.parse(localStorage.getItem(CONFIG.seenKey) || '{}'); return b && typeof b === 'object' ? b : {}; } catch (e) { return {}; }
  }
  function saveBags(b) { try { localStorage.setItem(CONFIG.seenKey, JSON.stringify(b)); } catch (e) { /* ignore */ } }
  /* next paper of one kind: take from the bag; when the bag runs dry, refill it
     (shuffled, and never starting with the paper that was handed out last) */
  function drawPaper(k, bags) {
    const all = POOL[k].map(e => e.id);
    if (!all.length) return '';
    let bag = (bags[k] && Array.isArray(bags[k].bag) ? bags[k].bag : []).filter(id => all.indexOf(id) > -1);
    const last = bags[k] ? bags[k].last : '';
    if (!bag.length) {
      bag = shuffle(all);
      if (all.length > 1 && bag[0] === last) { const j = 1 + rand(bag.length - 1); const t = bag[0]; bag[0] = bag[j]; bag[j] = t; }
    }
    const id = bag.shift();
    bags[k] = { bag, last: id };
    return id;
  }
  function pickPapers() {
    const pick = {};
    if (CONFIG.allowTestParam) {
      const q = new URLSearchParams(location.search), all = q.get('test');
      KINDS.forEach(k => {
        const v = q.get(k[0]) || all;
        if (v && POOL[k].some(e => e.id === v)) pick[k] = v;
      });
    }
    const bags = loadBags();
    KINDS.forEach(k => { if (!pick[k]) pick[k] = drawPaper(k, bags); });
    saveBags(bags);
    return pick;
  }
  const pickLabel = pick => KINDS.map(k => k[0].toUpperCase() + ':' + (pick[k] || '')).join(' ');
  /* a state saved before papers were drawn separately: reuse its one test id for all three */
  function ensurePick(st) {
    const have = st.pick && KINDS.every(k => POOL[k].some(e => e.id === st.pick[k]));
    if (have) return;
    const pick = {};
    KINDS.forEach(k => { pick[k] = POOL[k].some(e => e.id === st.testId) ? st.testId : (POOL[k][0] || {}).id || ''; });
    st.pick = pick; st.testId = pickLabel(pick);
  }

  /* ----------------------------------------------------------------- state */
  const fresh = () => ({
    name: '', phone: '', email: '', mode: 'real',
    testId: '', pick: {}, done: {}, watched: {}, res: {}, w: { t1: '', t2: '' },
    wEndsAt: null, startedAt: null, finishedAt: null,
    viol: [], sent: false
  });
  let S = fresh();
  let running = null;          // 'listening' | 'reading' | 'writing' while a section is open
  let inSession = false;       // true from a successful login until the results are shown

  function save() {
    try {
      const body = stringify(S);
      localStorage.setItem(CONFIG.storeKey, stringify({ s: body, sig: hash(CONFIG.salt + body) }));
    } catch (e) { /* storage unavailable */ }
  }
  function loadSaved() {
    try {
      const raw = JSON.parse(localStorage.getItem(CONFIG.storeKey) || 'null');
      if (!raw || !raw.s || raw.sig !== hash(CONFIG.salt + raw.s)) return null;   // missing or edited by hand
      return Object.assign(fresh(), JSON.parse(raw.s));
    } catch (e) { return null; }
  }

  /* ---------------------------------------------------------------- screens */
  const SCREENS = ['scLogin', 'scChecks', 'scWriting', 'scAnalyse', 'scReport', 'scDone'];
  function show(id) {
    SCREENS.forEach(s => $(s).classList.toggle('hidden', s !== id));
    window.scrollTo(0, 0);
  }
  function paintIdentity() {
    ['pcName', 'wName', 'aName'].forEach(id => { const el = $(id); if (el) el.textContent = S.name; });
    const label = S.mode === 'real' ? 'Real Exam' : 'Practice';
    ['pcMode', 'rMode'].forEach(id => { const el = $(id); if (el) { el.textContent = label; el.dataset.mode = S.mode; } });
    document.documentElement.setAttribute('data-exam-mode', S.mode);
  }

  /* -------------------------------------------------------------- full screen */
  const isFull = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  const canFull = () => { const d = document.documentElement; return !!(d.requestFullscreen || d.webkitRequestFullscreen); };
  function goFull() {
    if (isFull() || !canFull()) return;
    const el = document.documentElement, r = el.requestFullscreen || el.webkitRequestFullscreen;
    try { const p = r.call(el); if (p && p.catch) p.catch(() => {}); } catch (e) { /* refused */ }
  }
  function leaveFull() {
    if (!isFull()) return;
    try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) { /* ignore */ }
  }
  function paintGuard() {
    const need = inSession && canFull() && !isFull();
    $('fsGuard').classList.toggle('hidden', !need);
  }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);
  function onFsChange() {
    if (inSession && !isFull() && running) logViolation('left full screen');
    paintGuard();
  }

  /* ----------------------------------------------------------------- security */
  function logViolation(what) {
    if (!inSession) return;
    S.viol.push({ t: Date.now(), what, k: running || '' }); save();
    if (running && S.mode === 'real') toast('Leaving the exam is recorded.');
  }
  document.addEventListener('contextmenu', e => e.preventDefault(), true);
  document.addEventListener('dragstart', e => e.preventDefault(), true);
  document.addEventListener('keydown', e => {
    const k = (e.key || '').toLowerCase(), c = e.ctrlKey || e.metaKey;
    const blocked = e.key === 'F12' || (c && e.shiftKey && 'ijc'.indexOf(k) > -1) || (c && !e.shiftKey && 'usp'.indexOf(k) > -1);
    if (blocked) { e.preventDefault(); e.stopPropagation(); logViolation('blocked shortcut'); }
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) logViolation('switched tab'); });
  window.addEventListener('beforeunload', e => { if (inSession && !S.finishedAt) { e.preventDefault(); e.returnValue = ''; } });
  /* the first click or key on the login page asks for full screen */
  ['pointerdown', 'keydown'].forEach(t => document.addEventListener(t, () => { if (!isFull() && !S.finishedAt) goFull(); }, { capture: true }));

  /* -------------------------------------------------------------------- login */
  function validate(name, phone, email) {
    if (name.replace(/\s/g, '').length < 3) return ['lgName', 'Please enter your full name.'];
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15 || !/^[+\d][\d\s()\-]*$/.test(phone)) return ['lgPhone', 'Please enter a valid phone number.'];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return ['lgEmail', 'Please enter a valid email address.'];
    return null;
  }
  function doLogin(e) {
    e.preventDefault();
    const name = $('lgName').value.trim().replace(/\s+/g, ' ');
    const phone = $('lgPhone').value.trim();
    const email = $('lgEmail').value.trim().toLowerCase();
    const mode = (document.querySelector('input[name="mode"]:checked') || {}).value === 'practice' ? 'practice' : 'real';
    const bad = validate(name, phone, email);
    if (bad) { $('lgErr').textContent = bad[1]; $(bad[0]).focus(); return; }
    $('lgErr').textContent = '';
    goFull();                                              // this click is the user gesture
    const old = loadSaved();
    /* Same candidate and a paper still in progress: carry on where they were (the mode they started with stays).
       A finished Real Exam is final (the results show again). A finished Practice, or a Real Exam re-entered in
       Practice, starts a NEW attempt and hands out the next mock at random. */
    const resume = old && old.email === email && (!old.finishedAt || (old.mode === 'real' && mode === 'real'));
    if (resume) {
      S = old; S.name = name; S.phone = phone; ensurePick(S);
    } else {
      S = fresh(); S.name = name; S.phone = phone; S.email = email; S.mode = mode; S.startedAt = Date.now();
      S.pick = pickPapers(); S.testId = pickLabel(S.pick);
    }
    save(); paintIdentity();
    if (S.finishedAt) { inSession = false; renderReport(); show('scReport'); return; }
    inSession = true; paintGuard();
    renderChecks(); show('scChecks');
  }

  /* ----------------------------------------------------------- pre-test checks */
  const I_PLAY = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9.5-5.5z"/></svg>';
  const I_ARROW = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8.6 2.4 14.2 8l-5.6 5.6V10H1.8V6h6.8z"/></svg>';
  const I_TICK = '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8.5 3.2 3.2L13 4.8"/></svg>';
  function renderChecks() {
    const cur = CONFIG.steps.findIndex(s => !S.done[s.k]);
    $('chkList').innerHTML = CONFIG.steps.map((s, i) => {
      const done = !!S.done[s.k], isCur = i === cur, locked = !done && !isCur, needVideo = !S.watched[s.k];
      const n = CONFIG.names[s.k];
      let btns = `<button class="ibtn" ${locked ? 'disabled' : ''} data-action="video" data-k="${s.k}">${I_PLAY}<span>Watch tutorial</span></button>`;
      if (done) btns += `<span class="donetag">${I_TICK} ${n} test completed</span>`;
      else btns += `<button class="ibtn go" ${(locked || needVideo) ? 'disabled' : ''} data-action="start" data-k="${s.k}">${I_ARROW}<span>Start ${n.toLowerCase()} test</span></button>`;
      if (locked) btns += `<span class="locknote">Available after the ${CONFIG.names[CONFIG.steps[i - 1].k]} test.</span>`;
      else if (!done && needVideo) btns += `<span class="locknote">Watch the tutorial to the end to unlock this test.</span>`;
      return `<div class="chk${isCur ? ' cur' : ''}${done ? ' done' : ''}${locked ? ' locked' : ''}">
        <div class="cn">${done ? I_TICK : i + 1}</div><div class="ct">${s.title}</div><div class="cm">${s.meta}</div><div class="cbtns">${btns}</div></div>`;
    }).join('');
  }

  /* ------------------------------------------------------------- guide videos */
  let videoOpen = false;
  /* The tutorial plays full screen over the whole page. It cannot be skipped or
     scrubbed, and Close unlocks when the video ends. */
  function openVideo(k) {
    if (videoOpen) return;
    goFull(); videoOpen = true;
    const src = CONFIG.videos[k], n = CONFIG.names[k];
    const ov = document.createElement('div'); ov.className = 'vfull';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', n + ' guide video');
    ov.innerHTML = (src
        ? `<video playsinline preload="auto" disablepictureinpicture controlslist="nodownload noplaybackrate nofullscreen"></video>
           <button class="vplay hidden" type="button"><span class="c">${I_PLAY}</span><span>Play the tutorial</span></button>`
        : `<div class="vempty">The ${n} tutorial video will appear here soon.</div>`)
      + `<div class="vf-top"><span class="vf-title"><i></i>${n} guide</span><span class="vf-st">Loading the tutorial…</span></div>`
      + `<div class="vf-bottom"><div class="vbar"><i></i></div><button class="ibtn vclose" type="button" disabled>Close (available when the tutorial ends)</button></div>`;
    document.body.appendChild(ov);
    const keyBlock = e => { e.preventDefault(); e.stopPropagation(); };
    document.addEventListener('keydown', keyBlock, true);
    const v = ov.querySelector('video'), playBtn = ov.querySelector('.vplay'), bar = ov.querySelector('.vbar i'),
          st = ov.querySelector('.vf-st'), closeBtn = ov.querySelector('.vclose');
    let finished = false, maxT = 0;
    const onFs = () => { if (!isFull() && !finished) st.textContent = 'Click anywhere to return to full screen.'; };
    document.addEventListener('fullscreenchange', onFs);
    const close = () => {
      if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
      document.removeEventListener('keydown', keyBlock, true);
      document.removeEventListener('fullscreenchange', onFs);
      ov.remove(); videoOpen = false; renderChecks();
    };
    closeBtn.onclick = close;
    ov.addEventListener('click', e => { if (!isFull() && !e.target.closest('.vclose')) goFull(); });
    const finish = () => {
      if (finished) return; finished = true;
      if (playBtn) playBtn.classList.add('hidden');            // the Play button must never cover Close
      S.watched[k] = true; save();
      bar.style.width = '100%';
      st.innerHTML = `<span class="done">Tutorial complete.</span> The ${n} test is now unlocked.`;
      closeBtn.disabled = false; closeBtn.textContent = 'Close'; closeBtn.focus();
    };
    if (!v) { finish(); return; }
    const tryPlay = () => {
      const blocked = () => { if (finished) return; playBtn.classList.remove('hidden'); st.textContent = 'Press play to start the tutorial.'; };
      let p; try { p = v.play(); } catch (e) { blocked(); return; }
      if (p && p.then) p.then(() => playBtn.classList.add('hidden')).catch(blocked);
    };
    playBtn.onclick = e => { e.stopPropagation(); goFull(); tryPlay(); };
    v.addEventListener('timeupdate', () => {
      if (v.currentTime > maxT + 1.5) { v.currentTime = maxT; return; }       // no skipping ahead
      maxT = Math.max(maxT, v.currentTime);
      if (v.duration) {
        bar.style.width = (v.currentTime / v.duration * 100) + '%';
        if (!finished && isFull()) st.textContent = 'Please watch the whole tutorial — ' + Math.max(0, Math.ceil(v.duration - v.currentTime)) + ' s left.';
      }
    });
    v.addEventListener('pause', () => { if (!finished && !v.ended) playBtn.classList.remove('hidden'); });
    v.addEventListener('play', () => playBtn.classList.add('hidden'));
    v.addEventListener('ended', finish);
    v.addEventListener('error', () => { finish(); st.innerHTML = 'The video could not be played in this browser. The ' + n + ' test has been unlocked.'; });
    v.src = src; v.load(); tryPlay();
    setTimeout(() => {
      if (!finished && v.readyState < 2 && !v.currentTime) { finish(); st.innerHTML = 'This browser could not play the tutorial. The ' + n + ' test has been unlocked.'; }
    }, 25000);
  }

  /* ----------------------------------------------------------- confirm dialog */
  function ask(text, okLabel, onOk, cancelLabel) {
    const sh = document.createElement('div'); sh.className = 'vshield';
    const box = document.createElement('div'); box.className = 'askbox';
    box.innerHTML = `<p>${text}</p><div class="askbtns"><button class="ibtn go" type="button">${okLabel}</button>
      <button class="ibtn ghost" type="button">${cancelLabel || 'Not yet'}</button></div>`;
    document.body.appendChild(sh); document.body.appendChild(box);
    const close = () => { sh.remove(); box.remove(); };
    const [ok, no] = box.querySelectorAll('button');
    ok.onclick = () => { close(); goFull(); onOk(); };
    no.onclick = close; ok.focus();
  }

  /* ------------------------------------------------- Listening / Reading pages */
  let activeFrame = null;                       // { fr, k, mode, ready }
  const frameUrl = k => entryOf(k, S.pick && S.pick[k]).file + '?embed=1';
  function startSection(k) {
    goFull();
    if (k === 'writing') { Mock.writing.start(); return; }
    ask('Start the ' + CONFIG.names[k] + ' test now? The clock starts immediately.', 'Start the ' + CONFIG.names[k] + ' test', () => openFrame(k, 'run'));
  }
  function openFrame(k, mode) {
    goFull();
    if (mode === 'run') { running = k; paintGuard(); }
    const host = $('modHost'); host.innerHTML = '';
    const fr = document.createElement('iframe');
    fr.setAttribute('allow', 'autoplay; fullscreen'); fr.setAttribute('allowfullscreen', '');
    fr.title = CONFIG.names[k] + (mode === 'review' ? ' review' : ' test');
    const me = { fr, k, mode, ready: false };
    activeFrame = me;
    fr.src = frameUrl(k);
    host.appendChild(fr); host.classList.remove('hidden');
    ['scChecks', 'scAnalyse'].forEach(id => $(id).classList.add('hidden'));
    setTimeout(() => {
      if (activeFrame === me && !me.ready) alert('The ' + CONFIG.names[k] + ' page could not be opened. Check that "' + frameUrl(k).split('?')[0] + '" is next to index.html, then reload.');
    }, 15000);
  }
  function closeFrame() { activeFrame = null; $('modHost').innerHTML = ''; $('modHost').classList.add('hidden'); }

  window.addEventListener('message', ev => {
    const m = ev.data, f = activeFrame;
    if (!m || !m.mock || !f || (ev.source && ev.source !== f.fr.contentWindow)) return;
    switch (m.type) {
      case 'ready':
        f.ready = true;
        if (f.mode === 'review') f.fr.contentWindow.postMessage({ mock: 1, type: 'review', name: S.name, ans: answerMap(S.res[f.k].rows) }, '*');
        else f.fr.contentWindow.postMessage({ mock: 1, type: 'start', name: S.name, mode: S.mode }, '*');
        break;
      case 'done':      if (f.mode === 'run' && m.k === f.k) sectionDone(m.k, m.res); break;
      case 'exit-review': exitReview(); break;
      case 'gesture':   goFull(); break;
      case 'violation': logViolation(m.what || 'blocked'); break;
      case 'issue':     openIssue(); break;
    }
  });

  /* the paper hands back its graded answers (or the clock ran out) */
  function sectionDone(k, res) {
    if (S.done[k] || !res) return;
    const detail = Array.isArray(res.detail) ? res.detail.slice(0, 40) : [];
    const rows = detail.map(d => ({
      q: String(d.id), ua: String(d.ua || ''),
      ca: k === 'reading' ? String(d.ca || '').split('|').join(' / ') : String(d.ca || ''),
      got: d.status === 'correct' ? 1 : 0, of: 1,
      part: k === 'reading' ? d.passage : d.part, type: d.type || ''
    }));
    S.res[k] = { correct: rows.filter(r => r.got).length, total: 40, band: Number(res.band).toFixed(1), rows };
    S.done[k] = true; save();
    running = null; paintGuard();
    setTimeout(() => { closeFrame(); renderChecks(); show('scChecks'); }, 30);
  }

  /* -------------------------------------------------------------- finishing up */
  function completeSession() {
    S.finishedAt = Date.now(); running = null; inSession = false; save();
    paintGuard(); closeFrame();
    renderReport(); show('scReport');
    sendResults();
  }
  function overallLR() {
    const L = S.res.listening, R = S.res.reading;
    if (!L || !R) return null;
    return (Math.round(((Number(L.band) + Number(R.band)) / 2) * 2) / 2).toFixed(1);
  }

  /* ------------------------------------------------------ sending the result */
  function payload(extra) {
    const L = S.res.listening || null, R = S.res.reading || null;
    return Object.assign({
      event: 'result', test: CONFIG.title, testId: S.testId, papers: S.pick, mode: S.mode,
      candidate: { name: S.name, phone: S.phone, email: S.email },
      startedAt: S.startedAt, finishedAt: S.finishedAt,
      listening: L, reading: R, overallLR: overallLR(),
      writing: { task1: S.w.t1, task2: S.w.t2, words1: words(S.w.t1), words2: words(S.w.t2) },
      integrity: S.viol
    }, extra || {});
  }
  function queue(obj) {
    try {
      const box = JSON.parse(localStorage.getItem(CONFIG.outboxKey) || '[]'); box.push(obj);
      localStorage.setItem(CONFIG.outboxKey, stringify(box));
    } catch (e) { /* ignore */ }
  }
  async function flushOutbox() {
    if (!CONFIG.resultsEndpoint) return false;
    let box; try { box = JSON.parse(localStorage.getItem(CONFIG.outboxKey) || '[]'); } catch (e) { return false; }
    const left = [];
    for (const item of box) {
      try {
        const r = await fetch(CONFIG.resultsEndpoint, { method: 'POST', keepalive: true,
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: stringify(item) });
        if (!r.ok) left.push(item);
      } catch (e) { left.push(item); }
    }
    try { localStorage.setItem(CONFIG.outboxKey, stringify(left)); } catch (e) { /* ignore */ }
    return left.length === 0;
  }
  async function sendResults() {
    queue(payload());
    S.sent = await flushOutbox(); save();
    paintSendStatus();
  }
  function paintSendStatus() {
    const el = $('sendStatus'); if (!el) return;
    if (!CONFIG.resultsEndpoint) el.textContent = 'Your result is saved on this device.';
    else el.textContent = S.sent ? 'Your result was sent to ' + S.email + '.' : 'Sending your result… it will retry automatically.';
    el.className = 'rx-status' + (S.sent ? ' ok' : '');
  }
  window.addEventListener('online', () => { if (S.finishedAt) flushOutbox().then(ok => { S.sent = ok; save(); paintSendStatus(); }); });

  /* ------------------------------------------------------------- report issue */
  function openIssue() { $('issueText').value = ''; $('issueDlg').classList.remove('hidden'); $('issueText').focus(); }
  function sendIssue() {
    const text = $('issueText').value.trim();
    if (!text) { $('issueText').focus(); return; }
    queue(payload({ event: 'issue', issue: text }));
    flushOutbox();
    $('issueDlg').classList.add('hidden'); toast('Thank you — your report was saved.');
  }

  /* ------------------------------------------------------------------ results */
  const mistakesLabel = n => `<span class="rx-n${n ? '' : ' zero'}">${n}</span> ${n === 1 ? 'mistake' : 'mistakes'}`;
  const TYPE_LABELS = {
    tfng: 'True False Not Given', ynng: 'Yes No Not Given', mcq: 'Multiple Choice', 'mcq-multi': 'Multiple Choice (Choose Two)',
    'matching-headings': 'Matching Headings', 'matching-info': 'Matching Information', 'matching-features': 'Matching Features',
    'sentence-endings': 'Sentence Endings', notes: 'Notes Completion', summary: 'Summary Completion',
    table: 'Table Completion', 'short-answer': 'Short Answer'
  };
  const prettyType = t => TYPE_LABELS[t] || String(t || 'Other').replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  function ansCell(r) {
    if (!String(r.ua).trim()) return '<span class="blank">no answer</span>';
    return esc(r.ua);
  }
  function sectionCard(label, R, partName, nParts, withTypes) {
    const rows = R.rows || [], bad = rows.filter(r => r.got !== r.of);
    const pct = rows.length ? Math.round(R.correct / (R.total || 40) * 100) : 0;
    const chips = bad.length ? bad.map(r => `<span class="rx-chip">Question ${esc(r.q)}</span>`).join('') : '<p class="rx-perfect">No incorrect questions. Well done!</p>';
    let parts = '';
    for (let p = 1; p <= nParts; p++) {
      const n = bad.filter(r => Number(r.part) === p).length;
      parts += `<div class="rx-row"><span>${partName} ${p}</span><span>${mistakesLabel(n)}</span></div>`;
    }
    let types = '';
    if (withTypes) {
      const map = {}; bad.forEach(r => { const k = prettyType(r.type); map[k] = (map[k] || 0) + 1; });
      const list = Object.keys(map).sort((a, b) => map[b] - map[a]);
      if (list.length) types = `<div class="rx-card"><h2>Mistakes by Question Type</h2>${list.map(k => `<div class="rx-row"><span>${esc(k)}</span><span>${mistakesLabel(map[k])}</span></div>`).join('')}</div>`;
    }
    return `<div class="rx-sec"><div class="rx-pill">${label} Section</div>
      <div class="rx-score"><div class="rx-score-t">Your Band Score</div><div class="rx-big">${R.band}</div><div class="rx-out">out of 9</div>
        <div class="rx-pct">${pct}% (${R.correct}/${R.total || 40} correct)</div></div>
      <div class="rx-card"><h2>Incorrect Questions</h2><div class="rx-chips">${chips}</div></div>
      <div class="rx-card"><h2>Mistakes by ${partName}</h2>${parts}</div>${types}</div>`;
  }
  function renderReport() {
    paintIdentity();
    const L = S.res.listening || { correct: 0, total: 40, band: '0.0', rows: [] };
    const R = S.res.reading || { correct: 0, total: 40, band: '0.0', rows: [] };
    const ov = overallLR() || '0.0', total = L.correct + R.correct;
    const w1 = words(S.w.t1), w2 = words(S.w.t2);
    const viol = S.viol.length;
    $('repBody').innerHTML = `
      <h1>Exam Results</h1>
      <div class="rx-pill">FULL MOCK TEST</div>
      <p class="rx-who">${esc(S.name)} &middot; ${esc(S.email)}</p>
      <div class="rx-score main"><div class="rx-score-t">Your Overall Band Score <small>(Listening + Reading)</small></div>
        <div class="rx-big">${ov}</div><div class="rx-out">out of 9</div>
        <div class="rx-pct">${Math.round(total / 80 * 100)}% (${total}/80 correct)</div></div>
      <div class="rx-trio">
        <div class="rx-mini"><span>Listening</span><b>${L.band}</b><small>${L.correct} / 40</small></div>
        <div class="rx-mini"><span>Reading</span><b>${R.band}</b><small>${R.correct} / 40</small></div>
        <div class="rx-mini nm"><span>Writing</span><b>Not marked</b><small>${w1} + ${w2} words</small></div>
      </div>
      ${sectionCard('Listening', L, 'Part', 4, false)}
      ${sectionCard('Reading', R, 'Passage', 3, true)}
      <div class="rx-sec"><div class="rx-pill">Writing Section</div>
        <div class="rx-card"><h2>Your answers</h2><p class="rx-hint">Writing is not marked automatically. Your text is saved exactly as typed.</p>
          <details><summary>Task 1 &middot; ${w1} words</summary><div class="wresp">${esc(S.w.t1) || '<span class="blank">No answer written.</span>'}</div></details>
          <details><summary>Task 2 &middot; ${w2} words</summary><div class="wresp">${esc(S.w.t2) || '<span class="blank">No answer written.</span>'}</div></details></div></div>
      ${viol ? `<p class="rx-hint">Integrity log: ${viol} event${viol === 1 ? '' : 's'} recorded (left full screen, switched tab or blocked shortcuts).</p>` : ''}
      <p id="sendStatus" class="rx-status"></p>
      <div class="rx-actions">
        <button class="rx-btn" data-action="issue">Report Issue</button>
        <button class="rx-btn" data-action="analyse">Review Mistakes</button>
        <button class="rx-btn" data-action="pdf">Download PDF</button>
        <button class="rx-btn dark" data-action="finish">Finish</button>
      </div>`;
    paintSendStatus();
  }
  function finishAll() {
    ask('Finish and leave the results page?', 'Finish', () => {
      leaveFull();
      $('doneMsg').textContent = 'Thank you, ' + S.name + '. Your result has been recorded.';
      $('newAttemptBtn').classList.toggle('hidden', S.mode !== 'practice');
      show('scDone');
    }, 'Stay here');
  }
  /* Practice only: back to the login page with the candidate's details filled in; the next mock is picked at random. */
  function newAttempt() {
    const keep = { lgName: S.name, lgPhone: S.phone, lgEmail: S.email };
    try { localStorage.removeItem(CONFIG.storeKey); } catch (e) { /* ignore */ }
    S = fresh(); inSession = false; running = null;
    Object.keys(keep).forEach(id => { $(id).value = keep[id] || ''; });
    const r = document.querySelector('input[name="mode"][value="practice"]'); if (r) r.checked = true;
    $('lgErr').textContent = ''; show('scLogin'); $('lgName').focus();
  }

  /* ---------------------------------------------- review: reopen a finished paper */
  function answerMap(rows) {
    const m = {};
    (rows || []).forEach(r => {
      const q = String(r.q);
      if (q.indexOf('-') < 0) { m[q] = r.ua || ''; return; }
      const a = parseInt(q.split('-')[0], 10), b = parseInt(q.split('-')[1], 10);
      const vals = String(r.ua || '').split(',').map(v => v.trim()).filter(Boolean);
      for (let i = a; i <= b; i++) m[i] = vals[i - a] || '';
    });
    return m;
  }
  function openReview(k) { if (S.res[k]) openFrame(k, 'review'); }
  function exitReview() { closeFrame(); renderAnalyse(); show('scAnalyse'); }

  /* ----------------------------------------------------------- analyse mistakes */
  let anaMode = 'wrong';
  function partOfRow(r, mod) {
    if (mod === 'reading') return r.part || Math.min(3, Math.ceil(parseInt(r.q, 10) / 14));
    return Math.min(4, Math.ceil(parseInt(r.q, 10) / 10));
  }
  function anaBlock(mod, label, rows, parts, partName) {
    let out = '';
    for (let p = 1; p <= parts; p++) {
      const all = rows.filter(r => partOfRow(r, mod) === p);
      if (!all.length) continue;
      const list = anaMode === 'wrong' ? all.filter(r => r.got !== r.of) : all;
      const wrong = all.filter(r => r.got !== r.of).length;
      out += `<div class="mhead"><span>${partName} ${p}</span><span>${wrong} wrong of ${all.length}</span><span></span></div>`;
      if (!list.length) { out += `<div class="mrow good"><span class="qn">&#10004;</span><span>All answers in this ${partName.toLowerCase()} were correct.</span><span></span></div>`; continue; }
      out += list.map(r => `<div class="mrow${r.got === r.of ? ' good' : ''}"><span class="qn">${esc(r.q)}</span>`
        + `<span>${String(r.ua).trim() ? esc(r.ua) : '<span class="blank">no answer</span>'} <span class="${r.got === r.of ? 'ok' : 'no'}">${r.got === r.of ? '&#10004;' : '&#10008;'}</span></span>`
        + `<span>${esc(r.ca)}</span></div>`).join('');
    }
    return `<h2>${label}</h2>` + out;
  }
  function renderAnalyse() {
    const L = S.res.listening || { correct: 0, rows: [] }, R = S.res.reading || { correct: 0, rows: [] };
    const wl = L.rows.filter(r => r.got !== r.of).length, wr = R.rows.filter(r => r.got !== r.of).length;
    $('anaBody').innerHTML = `
      <h1>Review mistakes</h1>
      <p class="who">${esc(S.name)} &middot; ${CONFIG.title} &middot; Listening ${L.correct}/40 &middot; Reading ${R.correct}/40</p>
      <p class="hint" style="margin:0 0 14px">Reopen either paper to see your answers marked in place &mdash; Listening comes back with the transcript, Reading with an explanation on every question.</p>
      <div class="anabar"><button class="sel" data-action="review" data-k="listening">&#9654;&nbsp; Open the Listening test</button>
        <button class="sel" data-action="review" data-k="reading">&#9654;&nbsp; Open the Reading test</button></div>
      <div class="anabar">
        <button class="${anaMode === 'wrong' ? 'sel' : ''}" data-action="ana-mode" data-v="wrong">Mistakes only (${wl + wr})</button>
        <button class="${anaMode === 'all' ? 'sel' : ''}" data-action="ana-mode" data-v="all">All answers</button>
        <button data-action="show-report">Back to the results</button></div>
      <div class="mhead" style="margin-top:0"><span>Q</span><span>Your answer</span><span>Correct answer</span></div>
      ${anaBlock('listening', `Listening &mdash; ${wl} mistake${wl === 1 ? '' : 's'}`, L.rows, 4, 'Part')}
      ${anaBlock('reading', `Reading &mdash; ${wr} mistake${wr === 1 ? '' : 's'}`, R.rows, 3, 'Passage')}`;
  }

  /* ---------------------------------------------------------------- PDF export */
  const fileBase = () => (S.name || 'Candidate').replace(/[\\/:*?"<>|]+/g, '').trim() + ' - ' + CONFIG.title + ' report';
  const fmtDate = t => { const d = new Date(t || Date.now());
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); };
  const mark = r => !String(r.ua).trim() ? 'x (no answer)' : r.got === r.of ? 'correct' : 'x';
  const pdfSafe = s => String(s == null ? '' : s)
    .replace(/[‘’ʻʼ`´]/g, "'").replace(/[“”«»]/g, '"').replace(/[–—−]/g, '-').replace(/…/g, '...')
    .replace(/[✓✔]/g, 'v').replace(/[✗✘]/g, 'x').replace(/\u00A0/g, ' ')
    .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u00FF]/g, '?');
  function downloadPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) { alert('The PDF maker is not available here.'); return; }
    const L = S.res.listening || { correct: 0, band: '0.0', rows: [] }, R = S.res.reading || { correct: 0, band: '0.0', rows: [] };
    const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 15;
    let y = 16;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(227, 24, 55); doc.text('IELTS', M, y);
    doc.setTextColor(0); y += 9; doc.setFontSize(15); doc.text(pdfSafe(CONFIG.title + ' - Result report'), M, y);
    y += 6; doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(pdfSafe('Candidate: ' + S.name + '   Phone: ' + S.phone + '   Email: ' + S.email), M, y); y += 5;
    doc.text(pdfSafe('Mode: ' + (S.mode === 'real' ? 'Real Exam' : 'Practice') + '   Date: ' + fmtDate(S.finishedAt)), M, y); y += 4;
    const base = { theme: 'grid', margin: { left: M, right: M }, styles: { font: 'helvetica', fontSize: 9.5, cellPadding: 1.8, lineColor: [200, 200, 200], lineWidth: .2, textColor: 0 },
                   headStyles: { fillColor: [242, 242, 242], textColor: 0, fontStyle: 'bold' } };
    doc.autoTable(Object.assign({}, base, { startY: y, head: [['Module', 'Correct', 'Band']],
      body: [['Listening', L.correct + ' / 40', L.band], ['Reading', R.correct + ' / 40', R.band], ['Overall (Listening + Reading)', '', overallLR() || '0.0'],
             ['Writing', 'Task 1: ' + words(S.w.t1) + ' words, Task 2: ' + words(S.w.t2) + ' words', 'Not marked']] }));
    const table = (title, rows) => {
      let yy = doc.lastAutoTable.finalY + 9; if (yy > H - 30) { doc.addPage(); yy = 18; }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text(pdfSafe(title), M, yy);
      doc.autoTable(Object.assign({}, base, { startY: yy + 3, head: [['Q', 'Your answer', 'Correct answer', 'Result']],
        body: rows.map(r => [r.q, pdfSafe(r.ua || '(blank)'), pdfSafe(r.ca), mark(r)]), columnStyles: { 0: { cellWidth: 14, fontStyle: 'bold' }, 3: { cellWidth: 28 } } }));
    };
    table('Listening - ' + L.correct + ' / 40 - Band ' + L.band, L.rows);
    [1, 2, 3].forEach(p => { const rs = R.rows.filter(r => Number(r.part) === p); if (rs.length) table('Reading Passage ' + p, rs); });
    const para = (title, body) => {
      doc.addPage(); let yy = 18; doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text(pdfSafe(title), M, yy); yy += 7;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5);
      doc.splitTextToSize(pdfSafe(body || '(no answer)'), W - 2 * M).forEach(l => { if (yy > H - 16) { doc.addPage(); yy = 18; } doc.text(l, M, yy); yy += 5.2; });
    };
    para('Writing Task 1 (' + words(S.w.t1) + ' words) - not marked', S.w.t1);
    para('Writing Task 2 (' + words(S.w.t2) + ' words) - not marked', S.w.t2);
    const n = doc.getNumberOfPages();
    for (let i = 1; i <= n; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(110);
      doc.text(pdfSafe(S.name + ' - ' + CONFIG.title), M, H - 8); doc.text(i + ' / ' + n, W - M, H - 8, { align: 'right' }); doc.setTextColor(0); }
    doc.save(fileBase() + '.pdf');
  }

  /* ------------------------------------------------------------ click actions */
  const actions = {
    'go-full': () => goFull(),
    'video': el => openVideo(el.dataset.k),
    'start': el => startSection(el.dataset.k),
    'review': el => openReview(el.dataset.k),
    'analyse': () => { anaMode = 'wrong'; renderAnalyse(); show('scAnalyse'); },
    'ana-mode': el => { anaMode = el.dataset.v; renderAnalyse(); },
    'show-report': () => { renderReport(); show('scReport'); },
    'pdf': downloadPDF,
    'issue': openIssue,
    'issue-send': sendIssue,
    'issue-close': () => $('issueDlg').classList.add('hidden'),
    'finish': finishAll,
    'new-attempt': newAttempt
  };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (fn) { goFull(); fn(el, e); }
  });
  $('loginForm').addEventListener('submit', doLogin);
  const ICONS = {
    signal: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="14" width="3" height="7" rx="1"/><rect x="8.5" y="10" width="3" height="11" rx="1"/><rect x="14" y="6" width="3" height="15" rx="1"/><rect x="19.5" y="3" width="3" height="18" rx="1" opacity=".35"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>'
  };
  qsa('[data-ico]').forEach(el => { el.innerHTML = ICONS[el.dataset.ico] || ''; });

  /* ------------------------------------------------- the API Writing builds on */
  const writingApi = {};
  const Mock = {
    $, qsa, esc, words, show, goFull, save, ask, toast, logViolation,
    get S() { return S; },
    get test() { return { id: S.testId, writing: entryOf('writing', S.pick && S.pick.writing).writing }; },
    get running() { return running; }, set running(v) { running = v; paintGuard(); },
    attach(name, api) { writingApi[name] = api; },
    get writing() { return writingApi.writing; },
    completeSession, paintIdentity, renderChecks,
    answerMap
  };
  Object.freeze(Mock);
  window.Mock = Mock;
  $('lgName').focus();
})();
