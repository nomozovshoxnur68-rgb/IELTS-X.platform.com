/* IELTSX — the Speaking test (opened by test-player.js at /test?id=<id>).
   Part 1 and Part 3 are answered question by question, Part 2 is a cue card with its preparation and speaking time.
   The student records each answer (or types it when there is no microphone). When every question is answered the AI check
   starts by itself after a few seconds (which can be stopped, to record an answer again); "Get AI feedback" starts it earlier.
   It sends the answers to the server: every recording is written down one at a time (so a long test fits the request size of
   the host and a failed answer is simply sent again), then the transcripts are marked on the four band criteria (ai-examiner.js).
   Recordings stay in this tab until the check starts, and the server does not keep them. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const para = (v) => esc(v).replace(/\n/g, '<br>');
  const pad = (n) => String(n).padStart(2, '0');
  const clock = (s) => pad(Math.floor(Math.max(0, s) / 60)) + ':' + pad(Math.max(0, s) % 60);
  const icon = (d, size = 18) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    sound: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    redo: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    keyboard: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M7 13h.01M17 13h.01M9 17h6"/>',
    spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
  };
  const CRITERIA = [
    ['fluencyCoherence', 'Fluency & Coherence'], ['lexicalResource', 'Lexical Resource'],
    ['grammarAccuracy', 'Grammatical Range & Accuracy'], ['pronunciation', 'Pronunciation']
  ];
  const MAX_SECONDS = 130;      // one answer fits one request of the host (16 kHz mono WAV)
  const AUTO_SECONDS = 5;       // the moment to change one's mind before the check starts by itself
  const partNo = (p) => { const m = /part\s*([123])/i.exec(String((p && p.title) || '')); return m ? Number(m[1]) : 0; };

  /* the same steps as questionsOf() in ai-examiner.js */
  function stepsOf(item) {
    const out = [];
    (item.data.parts || []).forEach((p, pi) => {
      const qs = p.questions || [], no = partNo(p);
      if (!qs.length || p.prepSeconds > 0) {
        out.push({ key: p.id + ':0', partId: p.id, pi, q: 0, cue: true, text: p.prompt || '', extra: qs, image: p.imageUrl, prep: p.prepSeconds || 0, limit: Math.min(MAX_SECONDS, p.speakSeconds || 120) });
      } else qs.forEach((text, q) => out.push({ key: p.id + ':' + q, partId: p.id, pi, q, cue: false, text, intro: q === 0 ? p.prompt : '', image: q === 0 ? p.imageUrl : '', prep: 0, limit: Math.min(MAX_SECONDS, p.speakSeconds || (no === 3 ? 90 : 60)) }));
    });
    return out;
  }

  function start({ item, id, main }) {
    const parts = item.data.parts || [], steps = stepsOf(item);
    const lastKey = 'ix-speaking:' + id;
    const answers = {};       // step key -> { blob, url, mime, durationSec, typed, transcript, pronunciation, fluency, noSpeech }
    let cur = 0, status = null, lang = 'en', typing = false, notes = '', checking = false, finished = false;
    let rec = null, stream = null, chunks = [], recStart = 0, tick = null, cdTimer = null, prepLeft = 0, meter = null, audioCtx = null, autoTimer = null, autoLeft = 0;
    try { lang = localStorage.getItem('ieltsx:pref:ai-lang') || 'en'; } catch (e) { /* blocked */ }

    const done = (s) => { const a = answers[s.key]; return !!(a && (a.blob || (a.typed && a.typed.trim()))); };
    const doneCount = () => steps.filter(done).length;
    const beep = () => { try { const c = new (window.AudioContext || window.webkitAudioContext)(); const o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.25); o.onended = () => c.close(); } catch (e) { /* silent */ } };

    /* ───────── the page ───────── */
    function paint() {
      const s = steps[cur]; if (!s) { main.innerHTML = '<div class="tp-state"><h2>This test has no questions yet</h2></div>'; return; }
      const inPart = steps.filter((x) => x.pi === s.pi), idx = inPart.indexOf(s);
      main.innerHTML = `<div class="sx">
        <nav class="sx-parts" aria-label="Parts of the test">${parts.map((p, i) => { const list = steps.filter((x) => x.pi === i), got = list.filter(done).length; return `<button type="button" class="sx-part${i === s.pi ? ' is-on' : ''}${list.length && got === list.length ? ' is-done' : ''}" data-part="${i}" ${i === s.pi ? 'aria-current="step"' : ''}><span class="sx-part-no">${got === list.length && list.length ? icon(I.check, 14) : partNo(p) || i + 1}</span><span class="sx-part-name">${esc(String(p.title || 'Part ' + (i + 1)).split('·')[0].trim())}<small>${esc(String(p.title || '').split('·')[1] || '')}</small></span><span class="sx-part-count">${got}/${list.length}</span></button>`; }).join('')}</nav>
        <div class="sx-grid">
          <section class="sx-card sx-question" aria-live="polite">
            <div class="sx-row"><span class="sx-chip">${s.cue ? 'Cue card' : `Question ${idx + 1} of ${inPart.length}`}</span><button type="button" class="sx-ghost" id="sx-say">${icon(I.sound, 16)} Listen</button></div>
            ${s.intro ? `<p class="sx-intro">${para(s.intro)}</p>` : ''}
            ${s.cue ? `<div class="sx-cue">${para(s.text)}</div>${(s.extra || []).length ? `<ol class="sx-extra">${s.extra.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}` : `<h2 class="sx-qtext">${esc(s.text)}</h2>`}
            ${s.image ? `<figure class="sx-fig"><img src="${esc(s.image)}" alt="" loading="lazy"></figure>` : ''}
            ${s.cue ? `<label class="sx-notes">Your notes (only you can see them)<textarea id="sx-notes" rows="3" placeholder="Write a few key words…">${esc(notes)}</textarea></label>` : ''}
            ${teacherBlock(s)}
            <div class="sx-nav"><button type="button" class="sx-btn ghost" id="sx-prev" ${cur === 0 ? 'disabled' : ''}>${icon(I.left, 16)} Previous</button><button type="button" class="sx-btn ghost" id="sx-next" ${cur === steps.length - 1 ? 'disabled' : ''}>Next ${icon(I.right, 16)}</button></div>
          </section>
          <section class="sx-card sx-recorder" id="sx-rec"></section>
        </div>
        <footer class="sx-bar">
          <div class="sx-progress"><div class="sx-track"><span style="width:${steps.length ? Math.round(doneCount() / steps.length * 100) : 0}%"></span></div><span class="sx-progress-t">${doneCount()} of ${steps.length} answered</span></div>
          <label class="sx-lang">Feedback in <select id="sx-lang">${[['en', 'English'], ['uz', 'Oʻzbekcha'], ['ru', 'Русский']].map(([v, t]) => `<option value="${v}" ${lang === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
          <div class="sx-cta" id="sx-cta"></div>
        </footer>
      </div>`;
      paintRecorder(); paintCta();
      $$('[data-part]', main).forEach((b) => b.addEventListener('click', () => go(steps.findIndex((x) => x.pi === Number(b.dataset.part)))));
      $('#sx-prev').onclick = () => go(cur - 1);
      $('#sx-next').onclick = () => go(cur + 1);
      $('#sx-say').onclick = () => say(s.cue ? s.text : s.text);
      $('#sx-lang').onchange = (e) => { lang = e.target.value; try { localStorage.setItem('ieltsx:pref:ai-lang', lang); } catch (x) { /* blocked */ } };
      const nt = $('#sx-notes'); if (nt) nt.oninput = () => { notes = nt.value; };
      const tb = $('#sx-teacher'); if (tb) tb.onclick = showTeacher;
    }
    function teacherBlock(s) {
      const p = parts[s.pi];
      return (p.audioUrl ? `<details class="sx-details"><summary>Listen to the teacher's model answer</summary><audio controls preload="none" src="${esc(p.audioUrl)}"></audio></details>` : '')
        + (p.hasSample ? `<div class="sx-teacher"><button type="button" class="sx-ghost" id="sx-teacher">Show the teacher's model answer</button><div id="sx-teacher-box" class="sx-details" hidden></div></div>` : '');
    }
    async function showTeacher() {
      const box = $('#sx-teacher-box'); if (!box) return;
      if (!box.hidden) { box.hidden = true; return; }
      try {
        const r = await fetch('/api/materials/' + encodeURIComponent(id) + '/sample', { credentials: 'same-origin' }); const d = await r.json();
        const x = (d.samples || []).find((y) => y.id === steps[cur].partId);
        box.innerHTML = para(x ? x.sample : ''); box.hidden = false;
      } catch (e) { box.textContent = 'Could not load the model answer.'; box.hidden = false; }
    }
    function say(text) {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; u.rate = 0.95; window.speechSynthesis.speak(u);
    }
    function go(i) {
      if (i < 0 || i >= steps.length) return;
      cancelAuto();
      const leave = () => { stopPrep(); typing = false; cur = i; if (window.speechSynthesis) window.speechSynthesis.cancel(); paint(); window.scrollTo({ top: 0 }); };
      if (rec && rec.state === 'recording') { pendingAfterStop = leave; stopRecording(); return; }
      leave();
    }
    let pendingAfterStop = null;

    /* ───────── the recorder panel ───────── */
    function paintRecorder(note) {
      const box = $('#sx-rec'); if (!box) return;
      const s = steps[cur], a = answers[s.key], recording = rec && rec.state === 'recording';
      if (recording) {
        box.innerHTML = `<div class="sx-rec-head"><span class="sx-live"><i></i>Recording</span><span class="sx-time" id="sx-time">${clock(Math.round((Date.now() - recStart) / 1000))} / ${clock(s.limit)}</span></div>
          <canvas class="sx-meter" id="sx-meter" width="520" height="72" aria-hidden="true"></canvas>
          <button type="button" class="sx-mic is-rec" id="sx-stop" aria-label="Stop recording">${icon(I.stop, 28)}</button>
          <p class="sx-hint">Press stop when you finish. It stops by itself at ${clock(s.limit)}.</p>`;
        $('#sx-stop').onclick = stopRecording; drawMeter(); return;
      }
      if (prepLeft > 0) {
        box.innerHTML = `<div class="sx-rec-head"><span class="sx-live is-prep">${icon(I.clock, 15)}Preparation</span></div><div class="sx-big" id="sx-prep" role="timer">${clock(prepLeft)}</div>
          <p class="sx-hint">Think about what you will say and write a few notes. Recording starts by itself when the time is up.</p>
          <div class="sx-actions"><button type="button" class="sx-btn" id="sx-start-now">${icon(I.mic, 16)} Start speaking now</button></div>`;
        $('#sx-start-now').onclick = () => { stopPrep(); startRecording(); }; return;
      }
      if (typing) {
        box.innerHTML = `<div class="sx-rec-head"><span class="sx-live is-prep">${icon(I.keyboard, 15)}Type your answer</span></div>
          <textarea class="sx-typed" id="sx-typed" rows="9" placeholder="Write what you would say…">${esc((a && a.typed) || '')}</textarea>
          <p class="sx-hint">A typed answer is checked for grammar, vocabulary and ideas. Pronunciation needs a recording.</p>
          <div class="sx-actions"><button type="button" class="sx-btn" id="sx-typed-ok">${icon(I.check, 16)} Save answer</button><button type="button" class="sx-btn ghost" id="sx-typed-no">Record instead</button></div>`;
        const t = $('#sx-typed');
        t.oninput = () => { answers[s.key] = { ...(answers[s.key] || {}), typed: t.value, transcript: '' }; };
        $('#sx-typed-ok').onclick = () => { typing = false; paint(); autoCheck(); };
        $('#sx-typed-no').onclick = () => { typing = false; paintRecorder(); }; return;
      }
      if (a && a.blob) {
        box.innerHTML = `<div class="sx-rec-head"><span class="sx-live is-done">${icon(I.check, 15)}Answer recorded</span><span class="sx-time">${clock(a.durationSec)}</span></div>
          <audio class="sx-audio" controls src="${esc(a.url)}"></audio>
          <div class="sx-actions"><button type="button" class="sx-btn ghost" id="sx-again">${icon(I.redo, 16)} Record again</button>${cur < steps.length - 1 ? `<button type="button" class="sx-btn" id="sx-go-next">Next question ${icon(I.right, 16)}</button>` : ''}</div>`;
        $('#sx-again').onclick = () => { cancelAuto(); URL.revokeObjectURL(a.url); delete answers[s.key]; paint(); };
        const n = $('#sx-go-next'); if (n) n.onclick = () => go(cur + 1); return;
      }
      if (a && a.typed && a.typed.trim()) {
        box.innerHTML = `<div class="sx-rec-head"><span class="sx-live is-done">${icon(I.check, 15)}Answer typed</span></div><p class="sx-typed-show">${para(a.typed)}</p>
          <div class="sx-actions"><button type="button" class="sx-btn ghost" id="sx-edit">Edit</button>${cur < steps.length - 1 ? `<button type="button" class="sx-btn" id="sx-go-next">Next question ${icon(I.right, 16)}</button>` : ''}</div>`;
        $('#sx-edit').onclick = () => { cancelAuto(); typing = true; paint(); };
        const n = $('#sx-go-next'); if (n) n.onclick = () => go(cur + 1); return;
      }
      box.innerHTML = `<div class="sx-rec-head"><span class="sx-live is-idle">Your answer</span><span class="sx-time">up to ${clock(s.limit)}</span></div>
        <button type="button" class="sx-mic" id="sx-rec-btn" aria-label="Start recording">${icon(I.mic, 30)}</button>
        <p class="sx-hint">${note ? `<span class="sx-warn">${esc(note)}</span>` : 'Press the microphone and answer out loud, as you would to the examiner.'}</p>
        <div class="sx-actions">${s.prep ? `<button type="button" class="sx-btn" id="sx-prep-btn">${icon(I.clock, 16)} Start ${Math.round(s.prep / 60) || 1}-minute preparation</button>` : ''}<button type="button" class="sx-ghost" id="sx-type">${icon(I.keyboard, 16)} Type instead</button></div>`;
      $('#sx-rec-btn').onclick = startRecording;
      $('#sx-type').onclick = () => { typing = true; paintRecorder(); };
      const pb = $('#sx-prep-btn'); if (pb) pb.onclick = () => startPrep(s.prep);
    }
    function startPrep(seconds) {
      prepLeft = seconds; paintRecorder();
      cdTimer = setInterval(() => {
        prepLeft -= 1;
        const el = $('#sx-prep'); if (el) el.textContent = clock(prepLeft);
        if (prepLeft <= 0) { stopPrep(); beep(); startRecording(); }
      }, 1000);
    }
    function stopPrep() { clearInterval(cdTimer); cdTimer = null; prepLeft = 0; }

    function pickMime() {
      if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
      return ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4', 'audio/webm'].find((m) => MediaRecorder.isTypeSupported(m)) || '';
    }
    async function startRecording() {
      if (!navigator.mediaDevices || !window.MediaRecorder) { paintRecorder('Recording does not work in this browser. Press "Type instead", or open the test in Chrome, Edge, Safari or Firefox.'); return; }
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
      catch (e) { paintRecorder(e && e.name === 'NotFoundError' ? 'No microphone was found. Connect one, or press "Type instead".' : 'The microphone is blocked. Allow it in the address bar of the browser and press the microphone again.'); return; }
      cancelAuto();
      const s = steps[cur]; const mime = pickMime();
      chunks = [];
      rec = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 64000 } : undefined);
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        clearInterval(tick); tick = null; stopMeter();
        const type = rec.mimeType || mime || 'audio/webm';
        const durationSec = Math.max(1, Math.round((Date.now() - recStart) / 1000));
        if (chunks.length) { const blob = new Blob(chunks, { type }); answers[s.key] = { blob, url: URL.createObjectURL(blob), mime: type, durationSec }; }
        if (stream) stream.getTracks().forEach((t) => t.stop());
        stream = null; rec = null;
        if (pendingAfterStop) { const f = pendingAfterStop; pendingAfterStop = null; f(); return; }
        paint();
        if (!chunks.length) paintRecorder('Nothing was recorded. Check your microphone and try again.');
        else autoCheck();
      };
      rec.start(1000); recStart = Date.now();
      startMeter(stream);
      paintRecorder();
      tick = setInterval(() => {
        const used = Math.round((Date.now() - recStart) / 1000);
        const el = $('#sx-time'); if (el) el.textContent = clock(used) + ' / ' + clock(s.limit);
        if (used >= s.limit) { beep(); stopRecording(); }
      }, 500);
    }
    function stopRecording() { if (rec && rec.state !== 'inactive') rec.stop(); }
    /* the level of the microphone, so the student can see it is working */
    function startMeter(st) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const an = audioCtx.createAnalyser(); an.fftSize = 512;
        audioCtx.createMediaStreamSource(st).connect(an);
        meter = { an, data: new Uint8Array(an.fftSize), bars: new Array(52).fill(0), raf: 0 };
      } catch (e) { meter = null; }
    }
    function drawMeter() {
      const cv = $('#sx-meter'); if (!cv || !meter) return;
      const g = cv.getContext('2d'); const color = getComputedStyle(cv).color;
      const loop = () => {
        if (!meter || !document.body.contains(cv)) return;
        meter.an.getByteTimeDomainData(meter.data);
        let peak = 0; for (let i = 0; i < meter.data.length; i++) peak = Math.max(peak, Math.abs(meter.data[i] - 128));
        meter.bars.push(Math.min(1, peak / 80)); meter.bars.shift();
        g.clearRect(0, 0, cv.width, cv.height); g.fillStyle = color;
        meter.bars.forEach((v, i) => { const h = Math.max(3, v * cv.height); g.fillRect(i * 10, (cv.height - h) / 2, 5, h); });
        meter.raf = requestAnimationFrame(loop);
      };
      loop();
    }
    function stopMeter() { if (meter) cancelAnimationFrame(meter.raf); meter = null; if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; } }

    /* ───────── the AI button ───────── */
    function paintCta() {
      const box = $('#sx-cta'); if (!box) return;
      const n = doneCount(), next = encodeURIComponent(location.pathname + location.search);
      if (status && !status.configured) { box.innerHTML = `<span class="sx-note">The AI check is not available yet.</span>${status.problem ? `<span class="sx-warn sx-admin">${esc(status.problem)}</span>` : ''}`; return; }
      if (status && !status.signedIn) { box.innerHTML = `<a class="sx-btn" href="/login?next=${next}">Sign in to get AI feedback</a>`; return; }
      if (status && status.limit !== null && status.limit !== undefined && status.remaining <= 0) { box.innerHTML = `<span class="sx-note">No AI checks left this month.</span><a class="sx-btn" href="/Price">See plans</a>`; return; }
      if (autoLeft > 0) {
        box.innerHTML = `<span class="sx-note" role="status">All answered. AI feedback starts in <b id="sx-auto-left">${autoLeft}</b> s</span><button type="button" class="sx-btn ghost" id="sx-auto-stop">Wait</button><button type="button" class="sx-btn primary" id="sx-check">${icon(I.spark, 16)} Start now</button>`;
        $('#sx-auto-stop').onclick = () => { cancelAuto(); paintCta(); };
        $('#sx-check').onclick = () => runCheck();
        return;
      }
      const left = status && status.limit ? `<span class="sx-note">${status.remaining} of ${status.limit} checks left</span>` : '';
      box.innerHTML = `${left}<button type="button" class="sx-btn primary" id="sx-check" ${n ? '' : 'disabled'}>${icon(I.spark, 16)} Get AI feedback</button>`;
      $('#sx-check').onclick = () => runCheck();
    }
    function cancelAuto() { clearInterval(autoTimer); autoTimer = null; autoLeft = 0; }
    /* every answer is in: the check starts by itself, unless the student may not use it (the button or the sign-in link stays then) */
    function autoCheck() {
      cancelAuto();
      const allowed = status && status.configured && status.signedIn && (status.limit === null || status.limit === undefined || status.remaining > 0);
      if (!allowed || checking || finished || doneCount() !== steps.length) return;
      autoLeft = AUTO_SECONDS; paintCta();
      autoTimer = setInterval(() => {
        autoLeft -= 1;
        if (autoLeft <= 0) { runCheck(); return; }
        const el = $('#sx-auto-left'); if (el) el.textContent = autoLeft;
      }, 1000);
    }

    /* the recording as 16 kHz mono WAV: every browser records another format, and speech needs no more than this */
    async function toWav(blob) {
      const AC = window.AudioContext || window.webkitAudioContext, Off = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!AC || !Off) return blob;
      const ctx = new AC();
      try {
        const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
        const rate = 16000, off = new Off(1, Math.ceil(buf.duration * rate), rate), src = off.createBufferSource();
        src.buffer = buf; src.connect(off.destination); src.start();
        const out = (await off.startRendering()).getChannelData(0);
        const pcm = new Int16Array(out.length);
        for (let i = 0; i < out.length; i++) pcm[i] = Math.max(-1, Math.min(1, out[i])) * 32767;
        const head = new DataView(new ArrayBuffer(44)); const text = (p, t) => { for (let i = 0; i < t.length; i++) head.setUint8(p + i, t.charCodeAt(i)); };
        text(0, 'RIFF'); head.setUint32(4, 36 + pcm.byteLength, true); text(8, 'WAVEfmt '); head.setUint32(16, 16, true); head.setUint16(20, 1, true); head.setUint16(22, 1, true);
        head.setUint32(24, rate, true); head.setUint32(28, rate * 2, true); head.setUint16(32, 2, true); head.setUint16(34, 16, true); text(36, 'data'); head.setUint32(40, pcm.byteLength, true);
        return new Blob([head.buffer, pcm.buffer], { type: 'audio/wav' });
      } catch (e) { return blob; } finally { if (ctx.close) ctx.close().catch(() => {}); }
    }
    const httpError = (msg, status2) => { const e = new Error(msg); e.status = status2; return e; };
    async function postJson(url, opts) {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 75000);
      try {
        const r = await fetch(url, { credentials: 'same-origin', signal: ctl.signal, ...opts });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw httpError(d.error || `The AI check failed (${r.status}). Please try again.`, r.status);
        return d;
      } catch (e) {
        if (e.name === 'AbortError') throw httpError('The AI took too long to answer. Please try again.', 504);
        if (e.status !== undefined) throw e;
        throw httpError('The server could not be reached. Check your connection and try again.', 0);
      } finally { clearTimeout(t); }
    }
    async function transcribe(s) {
      const a = answers[s.key]; if (!a.blob || a.transcript) return;
      const body = await toWav(a.blob); const type = (body.type || a.mime).split(';')[0];
      const q = `id=${encodeURIComponent(id)}&part=${encodeURIComponent(s.partId)}&q=${s.q}`;
      const d = await postJson('/api/ai/speaking/transcribe?' + q, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream', 'X-Audio-Type': type }, body });
      Object.assign(a, { transcript: d.transcript || '', noSpeech: !!d.noSpeech, pronunciation: d.pronunciation || [], fluency: d.fluency || [] });
    }
    function paintProgress(list, doneKeys, stage) {
      main.innerHTML = `<div class="sx"><section class="sx-card sx-working" role="status" aria-live="polite"><div class="sx-spin"></div><h2>${esc(stage)}</h2>
        <ol class="sx-worklist">${list.map((s, i) => `<li class="${doneKeys.has(s.key) ? 'is-done' : ''}">${doneKeys.has(s.key) ? icon(I.check, 14) : '<i></i>'}Answer ${i + 1}</li>`).join('')}<li class="${stage.startsWith('The examiner') ? 'is-now' : ''}"><i></i>Bands and feedback</li></ol>
        <p class="sx-hint">Please keep this page open. It usually takes about a minute.</p></section></div>`;
    }
    async function runCheck() {
      cancelAuto();
      if (checking) return;
      const list = steps.filter(done); if (!list.length) return;
      checking = true;
      if (rec && rec.state === 'recording') stopRecording();
      const finishedKeys = new Set(list.filter((s) => !answers[s.key].blob || answers[s.key].transcript).map((s) => s.key));
      try {
        paintProgress(list, finishedKeys, 'Listening to your answers…');
        // two at a time: quick enough, and it stays inside the limits of the AI service
        const queue = list.filter((s) => answers[s.key].blob && !answers[s.key].transcript);
        const worker = async () => { for (let s = queue.shift(); s; s = queue.shift()) { await transcribe(s); finishedKeys.add(s.key); paintProgress(list, finishedKeys, 'Listening to your answers…'); } };
        await Promise.all([worker(), worker()]);
        const usable = list.filter((s) => { const a = answers[s.key]; return a.blob ? a.transcript && !a.noSpeech : a.typed && a.typed.trim(); });
        if (!usable.length) throw httpError('No speech could be heard in your recordings. Check your microphone and record again.', 400);
        paintProgress(list, finishedKeys, 'The examiner is marking your answers…');
        const res = await postJson('/api/ai/speaking/assess', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ materialId: id, lang,
          answers: usable.map((s) => { const a = answers[s.key]; return { partId: s.partId, q: s.q, transcript: a.blob ? a.transcript : a.typed, typed: !a.blob, durationSec: a.durationSec || 0, pronunciation: a.pronunciation || [], fluency: a.fluency || [] }; }) }) });
        res.pronunciationNotes = [...new Set(usable.flatMap((s) => answers[s.key].pronunciation || []))].slice(0, 6);
        res.fluencyNotes = [...new Set(usable.flatMap((s) => answers[s.key].fluency || []))].slice(0, 4);
        res.missed = list.length - usable.length;
        finished = true;
        if (res.quota && status) Object.assign(status, res.quota);
        try { localStorage.setItem(lastKey, JSON.stringify({ at: Date.now(), res })); } catch (e) { /* full */ }
        saveResult(res, usable.length, usable.reduce((n, s) => n + (answers[s.key].durationSec || 0), 0));
        paintResult(res);
      } catch (e) { paintFailure(e); } finally { checking = false; }
    }
    function saveResult(res, answered, durationSec) {
      fetch('/api/results', { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testKey: '/test/' + id, section: 'Speaking', bucket: 'Practice', pageLabel: item.title, scoreCorrect: answered, scoreTotal: steps.length, band: res.overall, durationSec }) }).catch(() => { /* the feedback is still on screen */ });
    }
    function paintFailure(e) {
      const next = encodeURIComponent(location.pathname + location.search);
      const act = e.status === 401 ? `<a class="sx-btn primary" href="/login?next=${next}">Sign in</a>` : e.status === 402 ? '<a class="sx-btn primary" href="/Price">See plans</a>' : '<button type="button" class="sx-btn primary" id="sx-retry">Try again</button>';
      main.innerHTML = `<div class="sx"><section class="sx-card sx-working"><h2>${e.status === 401 ? 'Sign in to get AI feedback' : e.status === 402 ? 'No AI checks left' : 'The feedback did not finish'}</h2><p class="sx-warn">${esc(e.message)}</p>
        <p class="sx-hint">Your answers are still here, and a check that fails is not counted.</p><div class="sx-actions">${act}<button type="button" class="sx-btn ghost" id="sx-back">Back to my answers</button></div></section></div>`;
      const r = $('#sx-retry'); if (r) r.onclick = () => runCheck();
      $('#sx-back').onclick = () => paint();
    }

    /* ───────── the feedback ───────── */
    const bandWord = (b) => (b >= 8.5 ? 'Expert' : b >= 7.5 ? 'Very good' : b >= 6.5 ? 'Good' : b >= 5.5 ? 'Competent' : b >= 4.5 ? 'Modest' : b > 0 ? 'Limited' : 'No score');
    const ring = (b) => { const r = 54, c = 2 * Math.PI * r, f = Math.max(0, Math.min(1, b / 9)); return `<svg class="sx-ring" viewBox="0 0 128 128" role="img" aria-label="Overall band ${b.toFixed(1)}"><circle cx="64" cy="64" r="${r}" class="bg"/><circle cx="64" cy="64" r="${r}" class="fg" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 64 64)"/><text x="64" y="62" class="num">${b.toFixed(1)}</text><text x="64" y="84" class="of">of 9</text></svg>`; };
    const list = (rows) => `<ul class="sx-list">${rows.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    function paintResult(r) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      const crit = CRITERIA.map(([k, name]) => { const c = (r.criteria || {})[k] || {}; const none = c.band === null || c.band === undefined;
        return `<article class="sx-card sx-crit"><div class="sx-row"><h3>${esc(name)}</h3><span class="sx-score">${none ? '—' : Number(c.band).toFixed(1)}</span></div><div class="sx-bar-mini"><span style="width:${none ? 0 : Math.round(c.band / 9 * 100)}%"></span></div>${c.comment ? `<p>${esc(c.comment)}</p>` : ''}${(c.points || []).length ? list(c.points) : ''}</article>`; }).join('');
      const fix = (rows, render) => `<div class="sx-rows">${rows.map(render).join('')}</div>`;
      const q = r.quota;
      main.innerHTML = `<div class="sx sx-result">
        <section class="sx-card sx-hero">${ring(Number(r.overall) || 0)}<div><span class="sx-chip">${esc(item.title)}</span><h2>Band ${Number(r.overall || 0).toFixed(1)} · ${esc(bandWord(Number(r.overall) || 0))} speaker</h2><p>${esc(r.summary)}</p>
          ${r.missed ? `<p class="sx-warn">${r.missed} recording${r.missed === 1 ? ' had' : 's had'} no clear speech and ${r.missed === 1 ? 'was' : 'were'} left out.</p>` : ''}${r.typedOnly ? '<p class="sx-warn">These answers were typed, so pronunciation was not marked.</p>' : r.pronunciationUnheard ? '<p class="sx-warn">Pronunciation could not be assessed this time, so it was not marked and does not count.</p>' : ''}</div></section>
        <div class="sx-crits">${crit}</div>
        ${(r.strengths || []).length ? `<section class="sx-card"><h3>What you did well</h3>${list(r.strengths)}</section>` : ''}
        ${(r.grammar || []).length ? `<section class="sx-card"><h3>Grammar corrections</h3>${fix(r.grammar, (g) => `<div class="sx-fix"><div><s>${esc(g.wrong)}</s><span aria-hidden="true">→</span><b>${esc(g.correct)}</b></div>${g.why ? `<p>${esc(g.why)}</p>` : ''}</div>`)}</section>` : ''}
        ${(r.vocabulary || []).length ? `<section class="sx-card"><h3>Vocabulary upgrades</h3>${fix(r.vocabulary, (v) => `<div class="sx-fix"><div><s>${esc(v.word)}</s><span aria-hidden="true">→</span><b>${(v.better || []).map(esc).join(', ')}</b></div>${v.why ? `<p>${esc(v.why)}</p>` : ''}${v.example ? `<p class="sx-eg">${esc(v.example)}</p>` : ''}</div>`)}</section>` : ''}
        ${(r.pronunciationNotes || []).length || (r.fluencyNotes || []).length ? `<section class="sx-card"><h3>Pronunciation and fluency</h3>${list([...(r.pronunciationNotes || []), ...(r.fluencyNotes || [])])}</section>` : ''}
        <section class="sx-card"><h3>Your answers and model answers</h3><div class="sx-answers">${(r.answers || []).map((a, i) => `<details class="sx-answer" ${i === 0 ? 'open' : ''}><summary><span class="sx-part-no">${i + 1}</span><span>${esc(String(a.question).split('\n')[0])}</span></summary>
          <div class="sx-answer-body"><h4>What you said${a.typed ? ' (typed)' : ''}</h4><p>${para(a.transcript)}</p>${a.comment ? `<h4>Feedback</h4><p>${esc(a.comment)}</p>` : ''}${a.modelAnswer ? `<h4>Model answer</h4><p class="sx-model">${para(a.modelAnswer)}</p>` : ''}</div></details>`).join('')}</div></section>
        ${(r.plan || []).length ? `<section class="sx-card"><h3>Your next steps</h3><ol class="sx-list">${r.plan.map((p) => `<li>${p.title ? `<b>${esc(p.title)}:</b> ` : ''}${esc(p.text)}</li>`).join('')}</ol></section>` : ''}
        <p class="sx-hint sx-center">This band is an estimate from AI to help you practise, not an official IELTS score.${q && q.limit !== null && q.limit !== undefined ? ` AI checks left this month: ${q.remaining} of ${q.limit}.` : ''}</p>
        <div class="sx-actions sx-center"><button type="button" class="sx-btn ghost" id="sx-retake">${icon(I.redo, 16)} Try this test again</button><a class="sx-btn ghost" href="/study/Tools/Performance">See my progress</a><a class="sx-btn primary" href="/part/practice/speaking">More topics</a></div>
      </div>`;
      window.scrollTo({ top: 0 });
      $('#sx-retake').onclick = () => { Object.keys(answers).forEach((k) => { if (answers[k].url) URL.revokeObjectURL(answers[k].url); delete answers[k]; }); finished = false; try { localStorage.removeItem(lastKey); } catch (e) { /* blocked */ } cur = 0; paint(); };
    }

    /* ───────── start ───────── */
    window.addEventListener('pagehide', () => { stopPrep(); if (rec && rec.state !== 'inactive') rec.stop(); if (stream) stream.getTracks().forEach((t) => t.stop()); });
    window.addEventListener('beforeunload', (e) => { if (!finished && Object.keys(answers).some((k) => answers[k].blob || (answers[k].typed && answers[k].typed.trim()))) { e.preventDefault(); e.returnValue = ''; } });
    paint();
    let last = null; try { last = JSON.parse(localStorage.getItem(lastKey) || 'null'); } catch (e) { last = null; }
    fetch('/api/ai/status', { credentials: 'same-origin', cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((d) => { status = d; paintCta(); }).catch(() => { /* the button stays */ });
    if (last && last.res) {
      const bar = document.createElement('div'); bar.className = 'sx-last';
      bar.innerHTML = `<span>You have feedback on your last attempt (Band ${Number(last.res.overall || 0).toFixed(1)}).</span><button type="button" class="sx-ghost">See it</button>`;
      $('button', bar).onclick = () => { finished = true; paintResult(last.res); };
      const root = $('.sx', main); if (root) root.prepend(bar);
    }
  }
  window.IXSpeaking = { start };
})();
