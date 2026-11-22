/*
 * IELTSX admin: Teachers (admin.html#teachers) — the server is teachers.js.
 *   - make an account a teacher (it must have signed up), set the class name and the most students it may have
 *   - every teacher ranked by the performance of their class: how many students are active this week, their average
 *     band in the last 30 days (and the change from the 30 days before), how far they are in the e-books → a score
 *   - open a teacher: their students (tests, band, e-books), put students in the class or take them out,
 *     open the teacher's own panel (/teacher?as=<id>) to see exactly what they see
 *   - the user drawer (admin.js) gets a "Teacher / class" box: whose student this is, move them, make them a teacher
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const icon = (n) => (window.IXAdminIcon ? window.IXAdminIcon(n) : '');
  const DAY = 86400000;
  let list = null, meta = {}, loading = false, open = null, openData = null, users = null, query = '';

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  const post = (url, body) => api(url, { method: 'POST', body: JSON.stringify(body || {}) });
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const mount = () => $('#content-teachers');
  const ago = (v) => { if (!v) return 'never'; const s = Math.max(0, (Date.now() - new Date(v).getTime()) / 1000); if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + ' min ago'; if (s < 86400) return Math.floor(s / 3600) + ' h ago'; if (s < 30 * 86400) return Math.floor(s / 86400) + ' d ago'; return new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); };
  const initial = (n) => esc(String(n || '?').trim().charAt(0).toUpperCase() || '?');
  const bandClass = (b) => (Number(b) >= 7 ? 'hi' : Number(b) >= 5.5 ? 'mid' : 'lo');
  const band = (b) => (b == null ? '<span class="muted">—</span>' : `<span class="band-chip ${bandClass(b)}">${esc(Number(b).toFixed(1))}</span>`);
  const trend = (t) => (t == null || !t ? '' : ` <span class="delta ${t > 0 ? 'up' : 'down'}" title="Last 30 days compared with the 30 days before">${t > 0 ? '▲' : '▼'} ${esc(Math.abs(t).toFixed(1))}</span>`);
  const bar = (p, k) => `<div class="tp-bar" style="--k:${k || 'var(--c3)'}"><i style="width:${Math.max(0, Math.min(100, p || 0))}%"></i></div>`;
  const scoreRing = (s) => `<div class="at-score" style="--p:${s || 0};--k:${s >= 70 ? 'var(--ok)' : s >= 45 ? 'var(--c4)' : 'var(--bad)'}" title="Score: 40% active students, 30% band, 30% e-books"><b>${s == null ? '—' : s}</b></div>`;
  const inactive = (s) => !s.lastActive || Date.now() - new Date(s.lastActive).getTime() > 7 * DAY;

  /* ───────── the list ───────── */
  async function load() {
    if (loading) return; loading = true; render();
    try { const d = await api('/api/admin/teachers'); list = d.teachers; meta = d; } catch (e) { fail(e); list = list || []; } finally { loading = false; }
    render();
    if (open) openTeacher(open, true);
  }
  async function loadUsers() { if (users) return users; users = (await api('/api/admin/users')).users; return users; }
  function render() {
    const m = mount(); if (!m) return;
    if (!list) { m.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
    const active = list.filter((t) => t.active);
    const students = active.reduce((a, t) => a + t.students, 0);
    const scored = active.filter((t) => t.kpis.score != null);
    const avgScore = scored.length ? Math.round(scored.reduce((a, t) => a + t.kpis.score, 0) / scored.length) : null;
    const k = (label, v, ico, c, sub) => `<div class="card kpi" style="--k:${c}"><div class="kpi-top"><span class="stat-label">${label}</span><span class="kpi-ico">${icon(ico)}</span></div><div class="kpi-val"><div class="stat-value">${v}</div></div><div class="kpi-foot"><p class="stat-sub">${sub}</p></div></div>`;
    m.innerHTML = `
      <div class="pd-hero card">
        <div class="pd-hero-text"><div class="eyebrow">People · teachers and their classes</div><h2>Teachers</h2>
          <p class="muted">A teacher gets their own panel at <b>/teacher</b>: they add students (new accounts, invitations, a class link), see each student's tests, bands and how much of every e-book is done. You see every teacher here, ranked by how their class is doing, and can open any teacher's panel.</p></div>
        <div class="btn-row"><a class="btn" href="/teacher" target="_blank" rel="noopener">Teacher panel ↗</a><a class="btn" href="#ebooks">E-books</a></div>
      </div>
      <div class="grid kpis">
        ${k('Teachers', active.length, 'graduation', 'var(--c1)', `${list.length - active.length} switched off`)}
        ${k('Students in classes', students, 'users', 'var(--c2)', `${meta.inClass || 0} accounts have a teacher`)}
        ${k('Average score', avgScore == null ? '—' : avgScore, 'activity', 'var(--c3)', 'active students 40% · band 30% · e-books 30%')}
        ${k('E-books with units', meta.ebooks || 0, 'book', 'var(--c4)', '<a class="link-btn" href="#ebooks">Add units</a>')}
      </div>
      <div class="card">
        <div class="section-head"><div><div class="section-title">Make a teacher</div><div class="muted sm">Find the account (it must have signed up on the website), then press “Make teacher”.</div></div></div>
        <div class="toolbar"><input class="field grow" id="at-q" type="search" placeholder="Search a name or e-mail…" value="${esc(query)}" autocomplete="off">
          <input class="field" id="at-title" maxlength="80" placeholder="Class name (optional), e.g. IELTS 7.0 evening">
          <input class="field" id="at-max" type="number" min="1" max="2000" placeholder="Most students (200)" style="flex:0 1 170px"></div>
        <div class="at-results" id="at-results"></div>
      </div>
      <div class="card">
        <div class="section-head"><div><div class="section-title">Performance</div><div class="muted sm">Ranked by score. Active = did a test or an e-book unit, or signed in, in the last 7 days. Band = average of the last 30 days.</div></div></div>
        <div class="at-list">${list.map((t, i) => rowHtml(t, i)).join('') || '<div class="empty">No teachers yet. Find an account above and make it a teacher.</div>'}</div>
      </div>
      <div id="at-open"></div>`;
    renderResults();
    if (open && openData) renderOpen();
  }
  function rowHtml(t, i) {
    const k = t.kpis;
    return `<div class="at-row${t.active ? '' : ' is-hidden'}" style="${t.active ? '' : 'opacity:.6'}">
      <div class="at-rank${t.active && k.score != null && i < 3 ? ' r' + (i + 1) : ''}">${i + 1}</div>
      <div class="at-name"><strong>${esc(t.name)}${t.deleted ? ' <span class="badge badge-bad">deleted</span>' : ''}${t.active ? '' : ' <span class="badge">off</span>'}</strong><div class="muted sm">${esc(t.email)}${t.title ? ' · ' + esc(t.title) : ''}</div></div>
      <div class="at-m"><small>Students</small><b>${t.students}<small> / ${t.maxStudents}</small></b><div class="muted sm">${t.invites.length} invited · ${t.inactive} inactive</div></div>
      <div class="at-m"><small>Active this week</small><b>${k.activeRate}%</b>${bar(k.activeRate)}</div>
      <div class="at-m hide-md"><small>Band (30 days)</small><b>${k.band30 == null ? '—' : esc(k.band30.toFixed(1))}</b>${trend(k.bandTrend)}<div class="muted sm">${k.tests30} test${k.tests30 === 1 ? '' : 's'}</div></div>
      <div class="at-m hide-md"><small>E-books</small><b>${k.ebookAvg == null ? '—' : k.ebookAvg + '%'}</b>${k.ebookAvg == null ? '' : bar(k.ebookAvg, 'var(--c4)')}<div class="muted sm">${k.unitsDone} unit${k.unitsDone === 1 ? '' : 's'} learned</div></div>
      <div style="display:flex;align-items:center;gap:12px">${scoreRing(k.score)}
        <div class="at-actions"><button class="btn btn-sm btn-primary" data-at="open" data-id="${esc(t.userId)}" type="button">${open === t.userId ? 'Close' : 'Open'}</button><a class="btn btn-sm" href="/teacher?as=${encodeURIComponent(t.userId)}" target="_blank" rel="noopener">Panel ↗</a></div></div>
    </div>`;
  }
  async function renderResults() {
    const box = $('#at-results'); if (!box) return;
    const q = query.trim().toLowerCase();
    if (q.length < 2) { box.innerHTML = ''; return; }
    let all; try { all = await loadUsers(); } catch (e) { box.innerHTML = '<div class="muted sm">' + esc(e.message) + '</div>'; return; }
    const isT = new Set((list || []).map((t) => t.userId));
    const found = all.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q)).slice(0, 6);
    box.innerHTML = found.map((u) => `<button type="button" data-at="make" data-id="${esc(u.id)}" ${isT.has(u.id) ? 'disabled' : ''}><span class="avatar">${initial(u.name)}</span><span style="flex:1;min-width:0"><b>${esc(u.name)}</b><span class="muted sm"> · ${esc(u.email)}</span></span>${isT.has(u.id) ? '<span class="badge badge-ok">teacher</span>' : u.isAdmin ? '<span class="badge badge-admin">admin</span> <span class="btn btn-sm btn-primary">Make teacher</span>' : '<span class="btn btn-sm btn-primary">Make teacher</span>'}</button>`).join('') || '<div class="muted sm">No account matches.</div>';
  }

  /* ───────── one teacher ───────── */
  async function openTeacher(id, silent) {
    open = id;
    if (!silent) { openData = null; render(); const el = $('#at-open'); if (el) { el.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }
    try { openData = await api('/api/admin/teachers/' + encodeURIComponent(id)); } catch (e) { fail(e); open = null; openData = null; }
    render();
  }
  function renderOpen() {
    const el = $('#at-open'); if (!el || !openData) return;
    const t = openData.teacher, st = openData.students, k = openData.kpis;
    const others = (list || []).filter((x) => x.userId !== t.userId && x.active);
    el.innerHTML = `<div class="card">
      <div class="section-head"><div><div class="eyebrow">Teacher</div><div class="section-title" style="font-size:18px">${esc(t.name)}</div><div class="muted sm">${esc(t.email)} · class code <b>${esc(t.code)}</b> · since ${esc(ago(t.createdAt))}</div></div>
        <div class="btn-row"><a class="btn btn-sm" href="/teacher?as=${encodeURIComponent(t.userId)}" target="_blank" rel="noopener">Open their panel ↗</a><button class="btn btn-sm" data-at="close" type="button">Close</button></div></div>
      <div class="pn-grid3">
        <label class="lbl">Class name<input class="field" id="at-e-title" maxlength="80" value="${esc(t.title)}" placeholder="e.g. IELTS 7.0 evening"></label>
        <label class="lbl">Most students<input class="field" id="at-e-max" type="number" min="1" max="2000" value="${esc(t.maxStudents)}"></label>
        <label class="lbl">Status<select class="field" id="at-e-active"><option value="1"${t.active ? ' selected' : ''}>Teacher (panel works)</option><option value="0"${t.active ? '' : ' selected'}>Switched off (keeps the class)</option></select></label>
      </div>
      <div class="btn-row" style="margin-top:12px"><button class="btn btn-sm btn-primary" data-at="save" type="button">Save</button><button class="btn btn-sm btn-danger" data-at="remove" type="button">No longer a teacher</button></div>
      <div class="mini-kv" style="grid-template-columns:repeat(4,minmax(0,1fr))"><div><small>Students</small><b>${k.students} / ${k.max}</b></div><div><small>Active this week</small><b>${k.active7} (${k.activeRate}%)</b></div><div><small>Band · all tests</small><b>${k.avgBand ?? '—'}</b></div><div><small>E-books · average</small><b>${k.ebookAvg == null ? '—' : k.ebookAvg + '%'}</b></div></div>
      <div class="box" style="margin-top:16px"><h4>Put students in this class</h4><p class="muted sm" style="margin:0 0 8px">E-mails of existing accounts, one per line or separated by commas. A student in another class is moved here.</p>
        <div class="btn-row"><textarea class="field" id="at-add-emails" rows="2" placeholder="ali@example.com, malika@example.com" style="flex:2 1 260px;min-height:44px"></textarea><input class="field" id="at-add-group" maxlength="40" placeholder="Group (optional)" style="flex:1 1 140px"><button class="btn btn-sm btn-primary" data-at="assign" type="button">Add</button></div></div>
      <div class="table-wrap"><table class="table"><thead><tr><th>Student</th><th>Group</th><th class="right">Tests</th><th>Band</th><th>E-books</th><th>Last active</th><th></th></tr></thead><tbody>
        ${st.map((s) => `<tr><td><div class="tp-who"><div class="avatar">${initial(s.name)}</div><div><strong>${esc(s.name)}</strong><div class="muted sm">${esc(s.email)}</div></div></div></td>
          <td>${s.group ? `<span class="badge">${esc(s.group)}</span>` : '<span class="muted sm">—</span>'}</td><td class="right">${s.tests}</td><td class="nowrap">${band(s.avgBand)}</td>
          <td style="min-width:130px">${s.books.started ? `<div class="tp-pct"><b>${s.books.avgPercent}%</b><span class="muted sm">${s.books.unitsDone} units</span></div>${bar(s.books.avgPercent)}` : '<span class="muted sm">not started</span>'}</td>
          <td class="nowrap"><span class="${inactive(s) ? 'tp-late' : ''}">${esc(ago(s.lastActive))}</span></td>
          <td class="right nowrap"><button class="btn btn-sm" data-open-user="${esc(s.id)}" type="button">User</button>${others.length ? ` <select class="field" data-at-move="${esc(s.id)}" style="width:auto;padding:5px 8px;font-size:12px" aria-label="Move to another teacher"><option value="">Move to…</option>${others.map((o) => `<option value="${esc(o.userId)}">${esc(o.name)}</option>`).join('')}</select>` : ''} <button class="btn btn-sm btn-danger btn-icon" data-at="out" data-id="${esc(s.id)}" type="button" title="Take out of the class">✕</button></td></tr>`).join('') || '<tr><td colspan="7"><div class="empty">No students in this class yet.</div></td></tr>'}
      </tbody></table></div></div>`;
  }

  /* ───────── the user drawer (admin.js): whose student, teacher role ───────── */
  async function drawerBox(id) {
    const dr = $('#drawer'); if (!dr) return;
    let d; try { d = await api('/api/admin/teachers/of/' + encodeURIComponent(id)); } catch (e) { return; }
    if (!dr.querySelector('.drawer-head')) return;
    let box = dr.querySelector('[data-teacher-box]');
    if (!box) { box = document.createElement('div'); box.className = 'box'; box.setAttribute('data-teacher-box', id); const kv = dr.querySelector('.kv'); if (kv) kv.insertAdjacentElement('afterend', box); else dr.appendChild(box); }
    if (d.teacher) {
      box.innerHTML = `<h4>Teacher</h4><p class="muted sm" style="margin:0 0 8px">This account is a teacher${d.teacher.active ? '' : ' (switched off)'} with ${d.teacher.students} student${d.teacher.students === 1 ? '' : 's'}${d.teacher.title ? ' · ' + esc(d.teacher.title) : ''}.</p>
        <div class="btn-row"><a class="btn btn-sm btn-primary" href="/teacher?as=${encodeURIComponent(id)}" target="_blank" rel="noopener">Open their panel ↗</a><a class="btn btn-sm" href="#teachers" data-at-goto="${esc(id)}">Teachers</a></div>`;
      return;
    }
    const opts = d.teachers.filter((t) => t.id !== id);
    box.innerHTML = `<h4>Teacher / class</h4><p class="muted sm" style="margin:0 0 8px">${d.classOf ? `Student of <b>${esc(d.classOf.name)}</b>${d.classOf.group ? ' · group ' + esc(d.classOf.group) : ''}.` : 'Not in any class.'}</p>
      <div class="btn-row">${opts.length ? `<select class="field" data-drawer-teacher style="flex:1 1 200px"><option value="">${d.classOf ? 'Move to another teacher…' : 'Put in a teacher\'s class…'}</option>${opts.filter((t) => !d.classOf || t.id !== d.classOf.id).map((t) => `<option value="${esc(t.id)}">${esc(t.name)} · ${esc(t.email)}</option>`).join('')}</select><button class="btn btn-sm btn-primary" data-at="drawer-assign" data-id="${esc(id)}" type="button">Save</button>` : ''}
        ${d.classOf ? `<button class="btn btn-sm" data-at="drawer-out" data-id="${esc(id)}" data-t="${esc(d.classOf.id)}" type="button">Take out of class</button>` : ''}
        <button class="btn btn-sm" data-at="drawer-make" data-id="${esc(id)}" type="button">Make teacher</button></div>`;
  }

  /* ───────── events ───────── */
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-at],[data-at-goto]'); if (!t) return;
    if (t.hasAttribute('data-at-goto')) { open = t.getAttribute('data-at-goto'); const c = document.querySelector('[data-close-drawer]'); if (c) c.click(); if (!list) load(); else openTeacher(open); return; }
    const act = t.getAttribute('data-at'); const id = t.getAttribute('data-id');
    try {
      if (act === 'open') { if (open === id) { open = null; openData = null; return render(); } return openTeacher(id); }
      if (act === 'close') { open = null; openData = null; return render(); }
      if (act === 'make' || act === 'drawer-make') {
        const u = users && users.find((x) => x.id === id);
        if (!confirm(`Make ${u ? u.name + ' (' + u.email + ')' : 'this account'} a teacher? They get the Teacher panel and see only the students of their own class.`)) return;
        const title = act === 'make' ? ($('#at-title') || {}).value || '' : ''; const max = act === 'make' ? Number(($('#at-max') || {}).value) || undefined : undefined;
        await post('/api/admin/teachers', { userId: id, title, maxStudents: max });
        toast('Teacher added'); query = ''; users = null;
        if (act === 'drawer-make') drawerBox(id);
        open = id; return load();
      }
      if (act === 'save' && openData) {
        await post('/api/admin/teachers/' + encodeURIComponent(open), { title: $('#at-e-title').value, maxStudents: Number($('#at-e-max').value) || 200, active: $('#at-e-active').value === '1' });
        toast('Saved'); return load();
      }
      if (act === 'remove' && openData) {
        if (!confirm(`${openData.teacher.name} will no longer be a teacher. Their ${openData.teacher.students} student(s) stay without a class. Continue?`)) return;
        await api('/api/admin/teachers/' + encodeURIComponent(open), { method: 'DELETE' }); toast('Teacher role removed'); open = null; openData = null; return load();
      }
      if (act === 'assign' && openData) {
        const emails = $('#at-add-emails').value; if (!emails.trim()) return toast('Write at least one e-mail.', true);
        const d = await post('/api/admin/teachers/' + encodeURIComponent(open) + '/students', { emails: emails.split(/[\s,;]+/).filter(Boolean), group: $('#at-add-group').value });
        toast(`${d.added.length} added` + (d.already.length ? ` · ${d.already.length} already there` : '') + (d.missing.length ? ` · not found: ${d.missing.slice(0, 3).join(', ')}` : ''), !!d.missing.length && !d.added.length);
        return load();
      }
      if (act === 'out' && openData) {
        if (!confirm('Take this student out of the class? The account stays.')) return;
        await api('/api/admin/teachers/' + encodeURIComponent(open) + '/students/' + encodeURIComponent(id), { method: 'DELETE' }); toast('Taken out of the class'); return load();
      }
      if (act === 'drawer-assign') {
        const sel = document.querySelector('[data-drawer-teacher]'); const tid = sel && sel.value; if (!tid) return toast('Choose a teacher first.', true);
        await post('/api/admin/teachers/' + encodeURIComponent(tid) + '/students', { userIds: [id] }); toast('Put in the class'); drawerBox(id); if (list) load(); return;
      }
      if (act === 'drawer-out') {
        await api('/api/admin/teachers/' + encodeURIComponent(t.getAttribute('data-t')) + '/students/' + encodeURIComponent(id), { method: 'DELETE' }); toast('Taken out of the class'); drawerBox(id); if (list) load(); return;
      }
    } catch (err) { fail(err); }
  });
  document.addEventListener('change', async (e) => {
    const sid = e.target.getAttribute && e.target.getAttribute('data-at-move'); if (!sid || !e.target.value) return;
    try { await post('/api/admin/teachers/' + encodeURIComponent(e.target.value) + '/students', { userIds: [sid] }); toast('Moved to the other class'); load(); } catch (err) { fail(err); }
  });
  let tm;
  document.addEventListener('input', (e) => { if (e.target.id === 'at-q') { query = e.target.value; clearTimeout(tm); tm = setTimeout(renderResults, 150); } });
  document.addEventListener('ix:user-drawer', (e) => { if (e.detail && e.detail.id) drawerBox(e.detail.id); });
  const onHash = () => { const v = (location.hash || '').slice(1).split('?')[0]; if (v === 'teachers' && !list && !loading) load(); };
  window.addEventListener('hashchange', onHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onHash); else onHash();
})();
