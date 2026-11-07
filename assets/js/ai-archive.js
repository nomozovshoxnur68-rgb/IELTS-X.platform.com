/* IELTSX — AI feedback archive (Performance page, <section id="ix-ai-archive">).
   Every Writing / Speaking check the AI made is kept on the account (server: ai-store.js, GET /api/ai/reports). The list
   asks only for the small columns (band, the four criteria, title, date) 10 at a time; the whole feedback of one check is
   loaded when it is opened, and kept in memory while the page is open. #ai-report=<id> in the address opens one at once
   (the Writing and Speaking results link here). Everything shown is escaped: it comes from the AI and from the student. */
(function (window, document) {
  'use strict';
  const mount = document.getElementById('ix-ai-archive');
  if (!mount || !window.fetch) return;

  const PAGE = 10;
  const NAMES = {
    taskAchievement: 'Task Achievement', coherenceCohesion: 'Coherence & Cohesion', lexicalResource: 'Lexical Resource', grammarAccuracy: 'Grammatical Range & Accuracy',
    fluencyCoherence: 'Fluency & Coherence', pronunciation: 'Pronunciation'
  };
  const SHORT = { taskAchievement: 'TA', coherenceCohesion: 'CC', lexicalResource: 'LR', grammarAccuracy: 'GRA', fluencyCoherence: 'FC', pronunciation: 'P' };
  const ORDER = { Writing: ['taskAchievement', 'coherenceCohesion', 'lexicalResource', 'grammarAccuracy'], Speaking: ['fluencyCoherence', 'lexicalResource', 'grammarAccuracy', 'pronunciation'] };
  const ui = { section: '', items: [], next: null, loading: false, error: '', signedOut: false };
  const full = new Map();   // id -> the whole check, once opened

  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v.toFixed(1) : '—');
  const cls = (b) => (b >= 7 ? 'good' : b > 0 && b < 5 ? 'low' : '');
  const when = (iso) => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? '' : d.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };
  const paras = (t) => String(t || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');
  const list = (rows, ordered) => (rows && rows.length ? `<${ordered ? 'ol' : 'ul'}>${rows.map((x) => `<li>${esc(x)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>` : '');
  const critName = (k, kind) => (k === 'taskAchievement' && kind === 'task2' ? 'Task Response' : NAMES[k] || k);

  async function getJson(url, opts) {
    const ctl = window.AbortController ? new AbortController() : null;
    const t = setTimeout(() => ctl && ctl.abort(), 15000);
    try {
      const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...(opts || {}), signal: ctl ? ctl.signal : undefined });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { const e = new Error(d.error || 'Request failed (' + r.status + ')'); e.status = r.status; throw e; }
      return d;
    } finally { clearTimeout(t); }
  }

  /* ── the list ── */
  function rowHtml(x) {
    const keys = ORDER[x.section] || Object.keys(x.criteria || {});
    const crits = keys.filter((k) => x.criteria && k in x.criteria).map((k) => `<span>${esc(SHORT[k] || k)} <b>${num(x.criteria[k])}</b></span>`).join('');
    const kind = x.section === 'Writing' ? (x.kind === 'task2' ? 'Task 2' : x.kind === 'task1' ? 'Task 1' : '') : (x.kind === 'typed' ? 'typed' : '');
    return `<div class="ixa-row" data-id="${esc(x.id)}">
      <div class="ixa-band ${cls(x.band)}" aria-label="Band ${num(x.band)}">${num(x.band)}</div>
      <div class="ixa-main"><div class="ixa-title"><span class="ixa-chip ${x.section === 'Writing' ? 'w' : 's'}">${esc(x.section)}</span><span class="t">${esc(x.title || 'AI check')}</span></div>
        <div class="ixa-meta">${esc(when(x.createdAt))}${kind ? ' · ' + esc(kind) : ''}${x.words ? ' · ' + x.words + ' words' : ''}</div>
        ${crits ? `<div class="ixa-crits">${crits}</div>` : ''}</div>
      <div class="ixa-actions"><button type="button" class="ixa-btn primary" data-ixa="open" data-id="${esc(x.id)}">Open</button><button type="button" class="ixa-btn danger" data-ixa="del" data-id="${esc(x.id)}" aria-label="Delete this feedback" title="Delete">✕</button></div>
    </div>`;
  }
  function render() {
    const seg = [['', 'All'], ['Writing', 'Writing'], ['Speaking', 'Speaking']].map(([v, l]) => `<button type="button" data-ixa="sec" data-sec="${v}" aria-pressed="${ui.section === v}">${l}</button>`).join('');
    let body;
    if (ui.signedOut) body = `<div class="ixa-empty"><a href="/login?next=${encodeURIComponent(location.pathname)}">Sign in</a> to keep every AI feedback on your account.</div>`;
    else if (ui.error && !ui.items.length) body = `<div class="ixa-empty">${esc(ui.error)} <button type="button" class="ixa-btn" data-ixa="retry">Try again</button></div>`;
    else if (ui.loading && !ui.items.length) body = '<div class="ixa-list"><div class="ixa-skel"></div><div class="ixa-skel"></div><div class="ixa-skel"></div></div>';
    else if (!ui.items.length) body = `<div class="ixa-empty">No AI feedback here yet. Finish a <a href="/part/practice/writing">writing</a> or <a href="/part/practice/speaking">speaking</a> test and it is kept here.</div>`;
    else body = `<div class="ixa-list">${ui.items.map(rowHtml).join('')}</div>` + (ui.next ? `<div class="ixa-more"><button type="button" class="ixa-btn" data-ixa="more" ${ui.loading ? 'disabled' : ''}>${ui.loading ? 'Loading…' : 'Load more'}</button></div>` : '');
    mount.innerHTML = `<div class="ixa-head"><div><h2>AI feedback archive</h2><p class="pf-note pf-sub">Every writing and speaking check, with its comments, corrections and model answers.</p></div><div class="pf-seg" role="group" aria-label="Show">${seg}</div></div>${body}`;
  }
  async function load(more) {
    if (ui.loading) return;
    ui.loading = true; ui.error = ''; if (!more) { ui.items = []; ui.next = null; } render();
    const q = new URLSearchParams({ limit: String(PAGE) });
    if (ui.section) q.set('section', ui.section);
    if (more && ui.next) q.set('before', ui.next);
    try {
      const d = await getJson('/api/ai/reports?' + q);
      const seen = new Set(ui.items.map((x) => x.id));
      ui.items = ui.items.concat((d.items || []).filter((x) => !seen.has(x.id)));
      ui.next = d.next || null;
    } catch (e) {
      if (e.status === 401) ui.signedOut = true; else ui.error = e.name === 'AbortError' ? 'The list took too long to load.' : e.message;
    } finally { ui.loading = false; render(); }
  }

  /* ── one check ── */
  let dialog = null;
  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'ixa-dialog'; dialog.setAttribute('aria-labelledby', 'ixa-dtitle');
    document.body.appendChild(dialog);
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });   // a click on the backdrop
    dialog.addEventListener('close', () => { if (/^#ai-report=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); });
    return dialog;
  }
  function detailHtml(row) {
    const r = row.report || {}; const sec = row.section; const keys = ORDER[sec] || Object.keys(r.criteria || {});
    const crit = keys.map((k) => { const c = (r.criteria || {})[k] || {}; const none = c.band === null || c.band === undefined;
      return `<div class="ixa-box"><h4>${esc(critName(k, row.kind))}<span>${none ? '—' : num(Number(c.band))}</span></h4>${c.comment ? `<p>${esc(c.comment)}</p>` : ''}${list(c.points)}</div>`; }).join('');
    const fixes = (rows, render) => rows.map((x) => `<div class="ixa-fix">${render(x)}</div>`).join('');
    const box = (title, inner) => (inner ? `<section class="ixa-box"><h4>${esc(title)}</h4>${inner}</section>` : '');
    const t = r.task || {};
    let html = `<div class="ixa-hero"><div class="ixa-band ${cls(row.band)}">${num(Number(row.band))}</div><div style="flex:1;min-width:220px"><div class="ixa-title"><span class="ixa-chip ${sec === 'Writing' ? 'w' : 's'}">${esc(sec)}</span>${row.kind === 'task2' ? '<span class="ixa-chip">Task 2</span>' : row.kind === 'task1' ? '<span class="ixa-chip">Task 1</span>' : ''}</div>
      <div class="ixa-meta">${esc(when(row.createdAt))}${row.words ? ' · ' + row.words + ' words' : ''}</div>${r.summary ? `<p>${esc(r.summary)}</p>` : ''}
      ${r.typedOnly ? '<p class="ixa-warn">These answers were typed, so pronunciation was not marked.</p>' : r.pronunciationUnheard ? '<p class="ixa-warn">Pronunciation could not be assessed, so it was not marked and does not count.</p>' : ''}</div></div>`;
    html += `<div class="ixa-grid">${crit}</div>`;
    html += box('What you did well', list(r.strengths));
    html += box('Grammar corrections', fixes(r.grammar || [], (g) => `<div><s>${esc(g.wrong)}</s><span aria-hidden="true">→</span><b>${esc(g.correct)}</b></div>${g.why ? `<p>${esc(g.why)}</p>` : ''}`));
    html += box('Vocabulary upgrades', fixes(r.vocabulary || [], (v) => `<div><s>${esc(v.word)}</s><span aria-hidden="true">→</span><b>${(v.better || []).map(esc).join(', ')}</b></div>${v.why ? `<p>${esc(v.why)}</p>` : ''}${v.example ? `<p class="ixa-eg">${esc(v.example)}</p>` : ''}`));
    html += box('Pronunciation and fluency', list([].concat(r.pronunciationNotes || [], r.fluencyNotes || [])));
    if (sec === 'Writing') {
      html += box('The task', t.prompt ? `<div class="ixa-text">${esc(t.prompt)}</div>${t.minWords ? `<p class="ixa-note">At least ${esc(t.minWords)} words.</p>` : ''}` : '');
      html += box('Your answer', r.answer ? `<div class="ixa-text">${esc(r.answer)}</div>` : '');
      html += box(r.sampleIsModel ? 'Model answer' : 'Model answer (Band 9, written by AI)', paras(r.sampleAnswer));
    } else {
      html += box('Your answers and model answers', (r.answers || []).map((a, i) => `<details class="ixa-answer" ${i === 0 ? 'open' : ''}><summary>${i + 1}. ${esc(String(a.question || '').split('\n')[0])}</summary>
        <h5>What you said${a.typed ? ' (typed)' : ''}</h5><div class="ixa-text">${esc(a.transcript)}</div>${a.comment ? `<h5>Feedback</h5><p>${esc(a.comment)}</p>` : ''}${a.modelAnswer ? `<h5>Model answer</h5>${paras(a.modelAnswer)}` : ''}</details>`).join(''));
    }
    html += box('Your next steps', (r.plan || []).length ? `<ol>${r.plan.map((p) => `<li>${p.title ? `<b>${esc(p.title)}:</b> ` : ''}${esc(p.text)}</li>`).join('')}</ol>` : '');
    html += '<p class="ixa-note">The band is an estimate from AI to help you practise, not an official IELTS score.</p>';
    return html;
  }
  async function open(id) {
    const d = ensureDialog();
    d.innerHTML = `<div class="ixa-dhead"><h3 id="ixa-dtitle">AI feedback</h3><div class="ixa-actions"><button type="button" class="ixa-btn" data-ixa="close">Close</button></div></div><div class="ixa-dbody"><div class="ixa-skel"></div><div class="ixa-skel"></div></div>`;
    if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }
    try {
      let row = full.get(id);
      if (!row) { row = (await getJson('/api/ai/reports/' + encodeURIComponent(id))).report; full.set(id, row); }
      if (!d.open) return;
      d.innerHTML = `<div class="ixa-dhead"><h3 id="ixa-dtitle">${esc(row.title || 'AI feedback')}</h3><div class="ixa-actions"><button type="button" class="ixa-btn" data-ixa="print">Print / PDF</button><button type="button" class="ixa-btn danger" data-ixa="del" data-id="${esc(row.id)}">Delete</button><button type="button" class="ixa-btn" data-ixa="close">Close</button></div></div><div class="ixa-dbody">${detailHtml(row)}</div>`;
      if (location.hash !== '#ai-report=' + id) history.replaceState(null, '', '#ai-report=' + id);
    } catch (e) {
      const b = d.querySelector('.ixa-dbody'); if (b) b.innerHTML = `<div class="ixa-empty">${esc(e.status === 401 ? 'Please sign in to open your feedback.' : e.message)}</div>`;
    }
  }
  async function remove(id, btn) {
    if (!window.confirm('Delete this AI feedback from your account? This cannot be undone.')) return;
    if (btn) btn.disabled = true;
    try {
      await getJson('/api/ai/reports/' + encodeURIComponent(id), { method: 'DELETE' });
      full.delete(id); ui.items = ui.items.filter((x) => x.id !== id);
      if (dialog && dialog.open) dialog.close();
      render();
    } catch (e) { if (btn) btn.disabled = false; window.alert(e.message); }
  }

  function onClick(e) {
    const b = e.target.closest('[data-ixa]'); if (!b) return;
    const a = b.getAttribute('data-ixa');
    if (a === 'sec') { ui.section = b.getAttribute('data-sec') || ''; load(false); }
    else if (a === 'more') load(true);
    else if (a === 'retry') load(false);
    else if (a === 'open') open(b.getAttribute('data-id'));
    else if (a === 'del') remove(b.getAttribute('data-id'), b);
    else if (a === 'close' && dialog) dialog.close();
    else if (a === 'print') { document.body.classList.add('ixa-print'); window.print(); setTimeout(() => document.body.classList.remove('ixa-print'), 500); }
  }
  mount.addEventListener('click', onClick);
  document.addEventListener('click', (e) => { if (dialog && dialog.contains(e.target)) onClick(e); });

  render();
  load(false);
  const m = /^#ai-report=([0-9a-f-]{36})$/i.exec(location.hash);
  if (m) open(m[1]);
})(window, document);
