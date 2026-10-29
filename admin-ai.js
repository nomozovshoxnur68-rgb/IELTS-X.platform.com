/*
 * IELTSX admin: AI Test Generator (admin.html#ai).
 * Upload a PDF / paste a passage (Reading) or upload a recording (Listening); the server (ai-generator.js) asks the AI for
 * the questions, answers and explanations and checks them against the passage / transcript. The result opens in the normal
 * test form (admin-content.js, window.IXAdmin) as a Draft: the admin reads it, fixes it, and saves it as a Draft or
 * publishes it there. Nothing is saved or published from this page. The AI key stays on the server.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const words = (s) => String(s || '').split(/\s+/).filter(Boolean).length;
  const mmss = (s) => { s = Math.max(0, Math.round(Number(s) || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const DEF_TYPES = { reading: ['tfng', 'mcq', 'matching', 'short'], listening: ['gap', 'mcq'] };

  let status = null;                       // GET /api/admin/ai/status
  const st = { skill: 'reading', mode: 'part', title: '', difficulty: 'band-6', count: 13, types: new Set(DEF_TYPES.reading), task: 'auto',
    src: null,                             // reading: { name, text, read, scanned, pdfUrl }   listening questions: same shape
    audio: null,                           // { url, name, start, end }
    transcript: '',                        // "[m:ss] (Part n) SPEAKER: text" lines, editable
    busy: '', started: 0, error: '', result: null };
  let tick = null;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin#ai')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  const X = () => window.IXAdmin;          // the form helpers of admin-content.js
  const defCount = () => (st.mode === 'full' ? 40 : st.skill === 'listening' ? 10 : 13);

  /* "[0:12] (Part 1) MAN: Good morning" lines <-> transcript segments */
  const segToLines = (segs) => segs.map((s) => `[${mmss(s.start)}]${s.part ? ' (Part ' + s.part + ')' : ''} ${s.speaker ? s.speaker + ': ' : ''}${s.text}`).join('\n');
  function linesToSeg(text) {
    return String(text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
      const m = /^\[(\d{1,3}):(\d{2})\]\s*(?:\(Part\s*([1-4])\)\s*)?(?:([^:]{1,30}):\s+)?(.*)$/i.exec(l);
      if (!m) { const sp = /^([^:]{1,30}):\s+(.*)$/.exec(l); return { start: 0, part: 0, speaker: sp ? sp[1] : '', text: sp ? sp[2] : l }; }
      return { start: Number(m[1]) * 60 + Number(m[2]), part: Number(m[3]) || 0, speaker: m[4] || '', text: m[5] };
    }).filter((s) => s.text);
  }
  /* the transcript as the listening page shows it: "SPEAKER: text" lines, "PART 2" between parts */
  function transcriptForForm(segs) {
    let part = 0; const out = [];
    segs.forEach((s) => { if (st.mode === 'full' && s.part && s.part !== part) { part = s.part; out.push('PART ' + part); } out.push((s.speaker ? s.speaker + ': ' : '') + s.text); });
    return out.join('\n');
  }

  /* ───────── view ───────── */
  function statusHtml() {
    if (!status) return '<div class="ai-status">Checking the AI set-up…</div>';
    if (!status.configured) return `<div class="ai-status bad"><b>⚠ The AI is not set up.</b> ${esc(status.problem)}</div>`;
    return `<div class="ai-status ok">✓ ${status.mock ? '<b>Mock AI</b> (placeholder questions, no AI service — for trying the panel)' : 'AI ready: <b>' + esc(status.provider) + '</b> · ' + esc(status.model)}${status.storage === 'none' ? ' · <span class="warn-text">no file storage: uploading recordings / scanned PDFs needs Supabase Storage</span>' : ''}</div>`;
  }
  function sourceHtml() {
    const s = st.src; const R = st.skill === 'reading';
    const read = s && s.read;
    const found = read ? (R ? read.passages.map((p, i) => `Passage ${i + 1}${p.title ? ' “' + esc(p.title) + '”' : ''}: ${words(p.text)} words`).join(' · ') || '<span class="warn-text">no passage text found</span>' : '') +
      ` · questions in the source: <b>${read.groups.reduce((n, g) => n + g.items.length, 0)}</b>${read.keyCount ? ' (answer key: ' + read.keyCount + ')' : ''}` : '';
    const fileBlock = `<div class="btn-row"><button class="btn btn-sm btn-primary" data-ai="pdf" type="button" ${st.busy ? 'disabled' : ''}>⬆ Upload ${R ? 'PDF' : 'questions PDF'}</button><button class="btn btn-sm" data-ai="paste" type="button">${R ? 'Paste text' : 'Paste questions'}</button><a class="btn btn-sm" href="/assets/samples/${st.skill}-${st.mode}.pdf" target="_blank" rel="noopener">📄 Sample PDF</a></div>
      ${s ? `<div class="sm">${esc(s.name || 'Pasted text')}${s.scanned ? ' — <b>scanned PDF</b> (no text in it): the AI will read the page images' + (s.pdfUrl ? '' : ' <span class="warn-text">(uploading…)</span>') : found ? ' — ' + found : ''}</div>` : ''}
      <textarea class="field cb-mono" id="ai-text" rows="7" ${st.showPaste || (s && !s.scanned && !s.file) ? '' : 'hidden'} placeholder="${R ? 'Paste the passage (and its questions and answer key, if you have them)…' : 'Paste the questions (and the answer key / audioscript, if you have them)…'}">${esc(s && !s.file ? s.text : '')}</textarea>`;
    if (R) return `<div class="cb-block"><strong>Source</strong><div class="muted sm">A PDF of a test or of a passage, or the text itself. The passage text is kept exactly as in your source; the questions printed in it are kept word for word.</div>${fileBlock}</div>`;
    const a = st.audio;
    return `<div class="cb-block"><strong>Recording *</strong><div class="muted sm">MP3, WAV, M4A, AAC or OGG${status ? ', up to ' + status.limits.maxAudioMb + ' MB' : ''}. It is kept for playback in the test. For a long recording use “starts at / ends at” for one part.</div>
        <div class="btn-row"><button class="btn btn-sm btn-primary" data-ai="audio" type="button" ${st.busy ? 'disabled' : ''}>⬆ ${a ? 'Replace recording' : 'Upload recording'}</button></div>
        ${a ? `<div class="sm">${esc(a.name)}</div><audio controls preload="none" src="${esc(a.url)}" style="width:100%"></audio>
        <div class="cb-grid"><label class="lbl">Starts at (seconds)<input class="field" type="number" min="0" data-ai-f="start" value="${a.start || 0}"></label><label class="lbl">Ends at (seconds, 0 = the end)<input class="field" type="number" min="0" data-ai-f="end" value="${a.end || 0}"></label></div>` : ''}</div>
      <div class="cb-block"><div class="cb-head"><div><strong>Transcript</strong><div class="muted sm">Written by the AI from the recording when you press Generate — or paste your own (an audioscript in the questions PDF is used too). One line per turn: <code>[0:12] MAN: Good morning…</code></div></div>
        <button class="btn btn-sm" data-ai="transcribe" type="button" ${a && !st.busy ? '' : 'disabled'}>🎧 Transcribe now</button></div>
        <textarea class="field cb-mono" id="ai-transcript" rows="7" placeholder="[0:05] WOMAN: Good morning, how can I help you?">${esc(st.transcript)}</textarea></div>
      <div class="cb-block"><strong>Questions (optional)</strong><div class="muted sm">If you have the printed questions, add them: they are kept word for word and the AI only answers and explains them. Without them the AI writes new questions.</div>${fileBlock}</div>`;
  }
  function taskHtml() {
    const has = !!(st.src && st.src.read && st.src.read.groups.length);
    const auto = has ? 'complete' : 'generate'; const cur = st.task === 'auto' ? auto : st.task;
    return `<label class="lbl">What the AI does<select class="field" data-ai-f="task">
      <option value="auto" ${st.task === 'auto' ? 'selected' : ''}>Automatic — ${has ? 'answer & explain the questions of the source' : 'write new questions'}</option>
      <option value="complete" ${st.task === 'complete' ? 'selected' : ''} ${has ? '' : 'disabled'}>Answer & explain the questions of the source (kept word for word)</option>
      <option value="generate" ${st.task === 'generate' ? 'selected' : ''}>Write ${esc(st.count)} new questions</option></select></label>
      ${cur === 'generate' ? '' : '<div class="muted sm">Number of questions and question types are taken from the source.</div>'}`;
  }
  function resultHtml() {
    const r = st.result; if (!r) return '';
    const s = r.stats || {};
    const lab = (status && status.types[st.skill]) || {};
    const groups = r.groups.map((g) => `<div class="ai-group"><div class="sm"><b>${esc((lab[g.type] || g.type).split('(')[0])}</b> · ${st.skill === 'reading' ? 'Passage' : 'Part'} ${g.passage}${g.group ? ' — <span class="muted">' + esc(g.group.slice(0, 120)) + '</span>' : ''}</div><ol>${g.items.map((it) => `<li><span>${esc(it.prompt.slice(0, 160))}</span> <b>→ ${esc(it.answer || '—')}</b> ${it.origin === 'ai' ? '<span class="cb-ai-tag">AI</span>' : '<span class="cb-ai-tag src">source</span>'}${it.verified ? '<span class="cb-ai-tag ok">✓ proof found</span>' : '<span class="cb-ai-tag warn">check</span>'}</li>`).join('')}</ol></div>`).join('');
    return `<div class="card"><div class="section-head"><div><div class="section-title">Result${r.cached ? ' <span class="muted sm">(same request as before: shown again, no new AI cost)</span>' : ''}</div>
      <div class="muted sm"><b>${s.questions}</b> questions · ${s.fromSource} from the source · ${s.byAi} written by the AI · <b>${s.verified}</b> with their proof found in the ${st.skill === 'listening' ? 'transcript (not checked against the audio)' : 'passage'}${s.noAnswer ? ' · <b class="warn-text">' + s.noAnswer + ' without an answer</b>' : ''} · ${esc(r.model || '')}</div></div>
      <div class="btn-row"><button class="btn btn-primary" data-ai="open" type="button">Review in the form → Save draft / Publish</button></div></div>
      ${(r.warnings || []).length ? `<div class="cb-issues warn"><strong>${r.warnings.length} thing(s) to check</strong><ul>${r.warnings.map((w) => `<li class="warn">! ${esc(w)}</li>`).join('')}</ul></div>` : '<div class="cb-issues ok">✓ Every answer has its proof in the source.</div>'}
      <div class="ai-preview">${groups}</div></div>`;
  }
  function render() {
    const mount = $('#content-ai'); if (!mount) return;
    const typeLab = (status && status.types[st.skill]) || {};
    const diff = (status && status.difficulty) || { 'band-6': 'IELTS band 6–6.5' };
    const elapsed = st.busy ? Math.round((Date.now() - st.started) / 1000) : 0;
    mount.innerHTML = `<div class="card"><div class="section-head"><div><div class="section-title">🤖 AI Test Generator</div>
        <div class="muted sm">Upload a test PDF, paste a passage, or upload a recording. The AI writes the answers and explanations (or new questions), checks them against the text, and the test opens in the normal form as a <b>Draft</b> for you to review. Nothing is published by itself. The manual forms (Reading / Listening …) work as before.</div></div></div>
      ${statusHtml()}
      <div class="cb-grid">
        <label class="lbl">Test type<span class="ai-seg">${['reading', 'listening'].map((k) => `<button type="button" class="chip ${st.skill === k ? 'chip-ok' : ''}" data-ai="skill" data-v="${k}">${k === 'reading' ? 'Reading' : 'Listening'}</button>`).join('')}</span></label>
        <label class="lbl">Format<span class="ai-seg">${['part', 'full'].map((k) => `<button type="button" class="chip ${st.mode === k ? 'chip-ok' : ''}" data-ai="mode" data-v="${k}">${k === 'part' ? (st.skill === 'reading' ? 'Part · 1 passage' : 'Part · 1 section') : (st.skill === 'reading' ? 'Full · 3 passages' : 'Full · 4 parts')}</button>`).join('')}</span></label>
        <label class="lbl">Test title<input class="field" data-ai-f="title" maxlength="200" value="${esc(st.title)}" placeholder="e.g. Cambridge 18 Test 2 Passage 1"></label>
        <label class="lbl">Difficulty<select class="field" data-ai-f="difficulty">${Object.entries(diff).map(([k, v]) => `<option value="${k}" ${st.difficulty === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></label>
        <label class="lbl">Number of questions<input class="field" type="number" min="1" max="${st.mode === 'full' ? 40 : st.skill === 'listening' ? 10 : 20}" data-ai-f="count" value="${esc(st.count)}"></label>
      </div>
      <div class="lbl">Question types (for questions the AI writes)<div class="ai-types">${Object.entries(typeLab).map(([k, v]) => `<label class="chip ${st.types.has(k) ? 'chip-ok' : ''}"><input type="checkbox" data-ai-type="${k}" ${st.types.has(k) ? 'checked' : ''}> ${esc(v.split('(')[0].trim())}</label>`).join('')}</div></div>
      ${sourceHtml()}
      ${taskHtml()}
      <div class="btn-row" style="margin-top:10px"><button class="btn btn-primary" data-ai="go" type="button" ${st.busy || !(status && status.configured) ? 'disabled' : ''}>⚡ Generate test</button>
        ${st.busy ? `<span class="ai-busy"><span class="ai-spin"></span>${esc(st.busy)} · <span class="ai-sec">${elapsed} s</span></span>` : ''}</div>
      ${st.error ? `<div class="cb-issues bad"><strong>✕ ${esc(st.error)}</strong></div>` : ''}</div>
      ${resultHtml()}`;
  }

  /* ───────── reading a source ───────── */
  function pickFile(accept) {
    return new Promise((resolve) => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept; inp.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'; document.body.appendChild(inp);
      const done = (f) => { try { inp.remove(); } catch (e) { /* gone */ } resolve(f); };
      inp.addEventListener('cancel', () => done(null)); inp.onchange = () => done(inp.files && inp.files[0]); inp.click();
    });
  }
  function readText(text, name, file) {
    const r = X().readSource(st.skill, st.mode, text);
    st.src = { name, text, read: r, file: !!file };
    if (st.skill === 'reading' && !st.title && r.passages[0] && r.passages[0].title && st.mode === 'part') st.title = r.passages[0].title;
    if (st.skill === 'listening' && r.transcript && !st.transcript.trim()) st.transcript = r.transcript;   // an audioscript in the PDF: no AI needed for it
    st.task = 'auto'; st.result = null; st.error = '';
  }
  async function uploadPdf() {
    const f = await pickFile('.pdf,application/pdf'); if (!f) return;
    st.error = ''; st.busy = 'Reading ' + f.name; st.started = Date.now(); render();
    try {
      const doc = await window.IXImport.open(f);
      if (doc.scanned) {
        if (st.skill !== 'reading') throw new Error('This PDF has no text in it (a scan). Paste the questions instead.');
        st.src = { name: f.name, scanned: true, file: true, text: '', read: { passages: [], groups: [], keyCount: 0 } }; st.busy = 'Uploading the scanned PDF'; render();
        st.src.pdfUrl = await X().uploadFile(f);
      } else readText(doc.text, f.name, true);
      if (!st.title) st.title = f.name.replace(/\.pdf$/i, '').replace(/[_]+/g, ' ');
      doc.close();
    } catch (e) { st.error = e.message || 'The PDF could not be read.'; }
    st.busy = ''; render();
  }
  async function uploadAudio() {
    const f = await pickFile('audio/*,.mp3,.wav,.m4a,.aac,.ogg'); if (!f) return;
    const max = (status ? status.limits.maxAudioMb : 60) * 1048576;
    if (f.size > max) { st.error = 'The recording is larger than ' + Math.round(max / 1048576) + ' MB. Upload one section.'; return render(); }
    st.error = ''; st.busy = 'Uploading ' + f.name; st.started = Date.now(); render();
    try { st.audio = { url: await X().uploadFile(f), name: f.name, start: 0, end: 0 }; st.transcript = ''; st.result = null; }
    catch (e) { st.error = e.message || 'The recording could not be uploaded.'; }
    st.busy = ''; render();
  }
  async function transcribe() {
    if (!st.audio) throw new Error('Upload the recording first.');
    st.busy = 'The AI is listening to the recording (this can take up to a minute)'; render();
    const r = await api('/api/admin/ai/transcribe', { method: 'POST', body: JSON.stringify({ audioUrl: st.audio.url, audioStart: st.audio.start, audioEnd: st.audio.end }) });
    st.transcript = segToLines(r.segments);
    return r;
  }

  /* ───────── generate ───────── */
  async function generate() {
    st.error = ''; st.result = null; st.started = Date.now();
    const R = st.skill === 'reading'; const read = st.src && st.src.read;
    const ta = $('#ai-transcript'); if (ta) st.transcript = ta.value;
    try {
      if (R && !(read && read.passages.length) && !(st.src && st.src.pdfUrl)) throw new Error(st.src && st.src.scanned ? 'The scanned PDF is still uploading.' : 'Upload the PDF or paste the passage first.');
      if (!R && !st.audio && !st.transcript.trim()) throw new Error('Upload the recording (or paste its transcript) first.');
      if (!R && !st.transcript.trim()) await transcribe();
      const task = st.task === 'auto' ? (read && read.groups.length ? 'complete' : 'generate') : st.task;
      st.busy = task === 'complete' ? 'The AI is answering and checking the questions' : 'The AI is writing ' + st.count + ' questions'; render();
      const segs = R ? [] : linesToSeg(st.transcript);
      const body = { skill: st.skill, mode: st.mode, title: st.title, difficulty: st.difficulty, count: st.count, types: [...st.types], task,
        passages: R && read ? read.passages : [], pdfUrl: R && st.src && st.src.pdfUrl ? st.src.pdfUrl : '',
        groups: task === 'complete' && read ? read.groups.map((g) => ({ type: g.type, section: g.passage, instruction: g.group, options: g.options, items: g.items })) : [],
        transcript: segs.some((s) => s.start) ? segs : [], transcriptText: segs.some((s) => s.start) ? '' : st.transcript };
      st.result = await api('/api/admin/ai/generate', { method: 'POST', body: JSON.stringify(body) });
      X().toast(st.result.cached ? 'Shown again from the last run (no new AI cost)' : 'Done — review it, then open it in the form');
    } catch (e) { st.error = e.message || 'Something went wrong.'; }
    st.busy = ''; render();
    const res = $('#ai-result') || $('.ai-preview'); if (res && st.result) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function openInForm() {
    const r = st.result; if (!r) return;
    const R = st.skill === 'reading'; const read = st.src && st.src.read;
    const segs = linesToSeg(st.transcript);
    X().openFromAi({ type: st.skill, mode: st.mode, title: st.title, model: r.model, task: r.task, warnings: r.warnings, stats: r.stats, groups: r.groups,
      passages: R ? (r.passages || (read ? read.passages.map((p) => ({ title: p.title, passage: p.text })) : [])) : [],
      audioUrl: st.audio ? st.audio.url : '', audioStart: st.audio ? st.audio.start : 0, audioEnd: st.audio ? st.audio.end : 0,
      transcript: R ? '' : transcriptForForm(segs), section: !R && read && read.section ? read.section : '' });
  }

  /* ───────── events ───────── */
  async function onClick(e) {
    const t = e.target.closest('[data-ai]'); if (!t || !$('#content-ai').contains(t)) return;
    const a = t.dataset.ai;
    if (st.busy && a !== 'open') return;                       // one thing at a time: no double requests
    if (a === 'skill' || a === 'mode') {
      if (a === 'skill' && st.skill !== t.dataset.v) { st.skill = t.dataset.v; st.types = new Set(DEF_TYPES[st.skill]); st.src = null; st.audio = null; st.transcript = ''; }
      if (a === 'mode') st.mode = t.dataset.v;
      st.count = defCount(); st.result = null; st.error = ''; st.task = 'auto';
      if (st.src && st.src.text && !st.src.scanned) readText(st.src.text, st.src.name, st.src.file);
      return render();
    }
    if (a === 'pdf') return uploadPdf();
    if (a === 'paste') { st.showPaste = true; render(); const ta = $('#ai-text'); if (ta) { ta.hidden = false; ta.focus(); } return; }
    if (a === 'audio') return uploadAudio();
    if (a === 'transcribe') { st.error = ''; st.started = Date.now(); try { await transcribe(); X().toast('Transcript ready — read it through'); } catch (err) { st.error = err.message; } st.busy = ''; return render(); }
    if (a === 'go') return generate();
    if (a === 'open') return openInForm();
  }
  function onChange(e) {
    const el = e.target; if (!$('#content-ai') || !$('#content-ai').contains(el)) return;
    if (el.id === 'ai-text') { if (e.type !== 'change') return; const v = el.value.trim(); if (v) readText(v, 'Pasted text', false); else st.src = null; return render(); }
    if (el.id === 'ai-transcript') { st.transcript = el.value; return; }
    if (el.dataset.aiType) { if (el.checked) st.types.add(el.dataset.aiType); else if (st.types.size > 1) st.types.delete(el.dataset.aiType); else el.checked = true; if (e.type === 'change') render(); return; }
    const f = el.dataset.aiF; if (!f) return;
    if (f === 'title') st.title = el.value;
    else if (f === 'count') st.count = Math.max(1, Math.min(Number(el.max) || 40, Math.floor(Number(el.value) || defCount())));
    else if (f === 'start' || f === 'end') { if (st.audio) st.audio[f] = Math.max(0, Math.floor(Number(el.value) || 0)); }
    else st[f] = el.value;
    if (e.type === 'change' && (f === 'task' || f === 'count')) render();
  }
  async function loadStatus() {
    try { status = await api('/api/admin/ai/status'); } catch (e) { status = { configured: false, problem: e.message, types: { reading: {}, listening: {} }, limits: { maxAudioMb: 60 } }; }
    render();
  }
  const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'ai') { if (!status) loadStatus(); else render(); } };
  window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', onClick); document.addEventListener('input', onChange); document.addEventListener('change', onChange);
    window.addEventListener('hashchange', onHash); onHash();
    tick = setInterval(() => { if (st.busy && $('#view-ai.active')) { const b = $('.ai-sec'); if (b) b.textContent = Math.round((Date.now() - st.started) / 1000) + ' s'; } }, 1000);
    const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if ($('#view-ai.active')) loadStatus(); });
  });
})();
