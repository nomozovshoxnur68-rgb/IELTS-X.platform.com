/*
 * IELTSX admin: Website check (admin.html#sitecheck).
 * One page that tells how the website is doing: a score, the speed of the main pages and API calls (measured here, in
 * this browser, the way a visitor feels it) and the findings of the server (site-check.js via /api/admin/site-check):
 * setup and security, tests and articles, people and activity, broken links, heavy files and search-engine basics.
 * Read only: nothing is changed by opening it.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  let report = null, speed = null, loading = false, measuring = false, filter = 'all', error = '';

  async function api(url) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }

  /* ───────── speed (measured in this browser) ───────── */
  const PAGES = [
    ['Home', '/'], ['Reading · Part practice', '/part/practice/reading'], ['Listening · Part practice', '/part/practice/listening'],
    ['Writing · Part practice', '/part/practice/writing'], ['Articles', '/study/Tools/Articles'], ['Full tests · Reading', '/full-tests/reading/'],
    ['Price', '/Price'], ['Account', '/account']
  ];
  const APIS = [
    ['Reading cards', '/api/materials?type=reading&mode=part'], ['Listening cards', '/api/materials?type=listening&mode=part'], ['Articles list', '/api/materials?type=article'],
    ['Access rules', '/api/access'], ['Signed-in user', '/api/auth/me'], ['Logo', '/api/branding']
  ];
  async function timeOne(url) {
    const t0 = performance.now();
    try {
      const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', redirect: 'follow' });
      const buf = await r.arrayBuffer();
      return { ms: performance.now() - t0, status: r.status, size: buf.byteLength, ok: r.ok };
    } catch (e) { return { ms: performance.now() - t0, status: 0, size: 0, ok: false }; }
  }
  async function measure() {
    if (measuring) return;
    measuring = true; speed = { pages: [], apis: [] }; render();
    for (const [kind, list] of [['pages', PAGES], ['apis', APIS]]) {
      for (const [name, url] of list) {
        const a = await timeOne(url), b = await timeOne(url);   // the second one shows the warm speed most visitors get
        const best = a.ms <= b.ms ? a : b;
        speed[kind].push({ name, url, ...best, first: a.ms });
        render();
      }
    }
    measuring = false; render();
  }
  const grade = (ms, api) => (ms < (api ? 250 : 450) ? 'ok' : ms < (api ? 700 : 1200) ? 'warn' : 'fail');
  const kb = (n) => (n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : n >= 1024 ? Math.round(n / 1024) + ' KB' : n + ' B');
  function speedRows(list, api) {
    if (!list.length) return '<tr><td colspan="4" class="muted">Measuring…</td></tr>';
    const max = Math.max(...list.map((x) => x.ms), api ? 700 : 1200);
    return list.map((x) => {
      const g = x.ok ? grade(x.ms, api) : 'fail';
      return `<tr><td><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.name)}</a><div class="muted sm">${esc(x.url)}</div></td>
        <td class="nowrap"><span class="badge badge-${g === 'ok' ? 'ok' : g === 'warn' ? 'warn' : 'bad'}">${x.status || 'error'}</span></td>
        <td class="sc-bar-cell"><div class="sc-bar"><i class="${g}" style="width:${Math.max(3, Math.round(x.ms / max * 100))}%"></i></div></td>
        <td class="right nowrap"><b>${Math.round(x.ms)} ms</b><div class="muted sm">${kb(x.size)}${Math.abs(x.first - x.ms) > 150 ? ' · first ' + Math.round(x.first) + ' ms' : ''}</div></td></tr>`;
    }).join('');
  }
  function speedSummary() {
    if (!speed || !speed.pages.length) return '';
    const all = speed.pages.concat(speed.apis);
    const avgPage = speed.pages.reduce((a, x) => a + x.ms, 0) / speed.pages.length;
    const slow = all.filter((x) => !x.ok || grade(x.ms, speed.apis.includes(x)) === 'fail');
    return `<div class="sc-speed-sum"><div><div class="stat-label">Average page</div><div class="stat-value">${Math.round(avgPage)} <small>ms</small></div></div>
      <div><div class="stat-label">Slow or failing</div><div class="stat-value">${slow.length}</div></div>
      <div><div class="stat-label">Measured</div><div class="stat-value">${all.length}<small>/ ${PAGES.length + APIS.length}</small></div></div></div>`;
  }

  /* ───────── report ───────── */
  const ICON = { ok: '✓', info: 'i', warn: '!', fail: '✕' };
  const LEVEL = { ok: 'Passed', info: 'Note', warn: 'Warning', fail: 'Problem' };
  function scoreRing(score) {
    const r = 46, c = 2 * Math.PI * r, off = c * (1 - score / 100);
    const cls = score >= 85 ? 'ok' : score >= 60 ? 'warn' : 'fail';
    return `<svg class="sc-ring ${cls}" viewBox="0 0 110 110" aria-label="Score ${score} of 100"><circle cx="55" cy="55" r="${r}" class="track"/><circle cx="55" cy="55" r="${r}" class="val" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/><text x="55" y="60" text-anchor="middle">${score}</text></svg>`;
  }
  function finding(f) {
    const items = Array.isArray(f.items) && f.items.length
      ? `<details class="sc-items"><summary>Show ${f.items.length}${f.items.length >= 20 ? '+' : ''}</summary><ul>${f.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></details>` : '';
    return `<div class="sc-finding ${f.level}"><span class="sc-ico" title="${LEVEL[f.level]}">${ICON[f.level]}</span><div class="sc-body">
      <div class="sc-title">${esc(f.title)}</div>${f.detail ? `<div class="muted sm">${esc(f.detail)}</div>` : ''}${f.fix ? `<div class="sc-fix">→ ${esc(f.fix)}</div>` : ''}${items}</div></div>`;
  }
  function render() {
    const mount = $('#content-sitecheck'); if (!mount) return;
    if (error && !report) { mount.innerHTML = `<div class="card"><div class="empty">Could not run the check: ${esc(error)}<br><button class="btn" data-sc="run" type="button" style="margin-top:10px">Try again</button></div></div>`; return; }
    if (!report) { mount.innerHTML = '<div class="card"><div class="empty">Checking the website…</div></div>'; return; }
    const r = report, c = r.counts;
    const label = r.score >= 85 ? 'Healthy' : r.score >= 60 ? 'Needs some work' : 'Needs attention';
    const show = (f) => filter === 'all' || f.level === filter || (filter === 'issues' && (f.level === 'fail' || f.level === 'warn'));
    const sections = r.sections.map((s) => {
      const list = s.items.filter(show);
      if (!list.length) return '';
      const bad = s.items.filter((x) => x.level === 'fail').length, warn = s.items.filter((x) => x.level === 'warn').length;
      return `<div class="card"><div class="section-head"><div class="section-title">${esc(s.title)}</div>
        <div class="btn-row">${bad ? `<span class="badge badge-bad">${bad} problem${bad > 1 ? 's' : ''}</span>` : ''}${warn ? `<span class="badge badge-warn">${warn} warning${warn > 1 ? 's' : ''}</span>` : ''}${!bad && !warn ? '<span class="badge badge-ok">All good</span>' : ''}</div></div>
        <div class="sc-list">${list.map(finding).join('')}</div></div>`;
    }).join('');
    mount.innerHTML = `
      <div class="card sc-head">
        ${scoreRing(r.score)}
        <div class="sc-head-main">
          <div class="section-title">Website health: ${label}</div>
          <div class="muted sm">Checked ${new Date(r.generatedAt).toLocaleString()} · ${r.tookMs} ms on the server</div>
          <div class="sc-counts">
            <button type="button" class="sc-chip ${filter === 'all' ? 'on' : ''}" data-sc-filter="all">All ${c.ok + c.info + c.warn + c.fail}</button>
            <button type="button" class="sc-chip fail ${filter === 'fail' ? 'on' : ''}" data-sc-filter="fail">${c.fail} problems</button>
            <button type="button" class="sc-chip warn ${filter === 'warn' ? 'on' : ''}" data-sc-filter="warn">${c.warn} warnings</button>
            <button type="button" class="sc-chip ok ${filter === 'ok' ? 'on' : ''}" data-sc-filter="ok">${c.ok} passed</button>
          </div>
        </div>
        <div class="btn-row"><button class="btn" data-sc="speed" type="button" ${measuring ? 'disabled' : ''}>${measuring ? 'Measuring…' : '⏱ Test speed again'}</button><button class="btn btn-primary" data-sc="run" type="button" ${loading ? 'disabled' : ''}>${loading ? 'Checking…' : '↻ Run the check'}</button></div>
      </div>
      <div class="card">
        <div class="section-head"><div><div class="section-title">Speed</div><div class="muted sm">Measured in this browser right now (no cache): the time to get each page or answer from the server. Green &lt; 450 ms page / 250 ms API.</div></div></div>
        ${speedSummary()}
        <div class="grid two-col sc-speed">
          <div><div class="sc-sub">Pages</div><div class="table-wrap"><table class="table"><tbody>${speed ? speedRows(speed.pages, false) : '<tr><td class="muted">Press “Test speed”.</td></tr>'}</tbody></table></div></div>
          <div><div class="sc-sub">Server answers (API)</div><div class="table-wrap"><table class="table"><tbody>${speed ? speedRows(speed.apis, true) : ''}</tbody></table></div></div>
        </div>
      </div>
      ${sections || '<div class="card"><div class="empty">Nothing in this filter.</div></div>'}`;
  }

  async function load(fresh) {
    if (loading) return;
    loading = true; error = ''; render();
    try { report = await api('/api/admin/site-check' + (fresh ? '?fresh=1' : '')); }
    catch (e) { error = e.message || 'Request failed'; }
    finally { loading = false; render(); }
  }

  document.addEventListener('click', (e) => {
    const f = e.target.closest && e.target.closest('[data-sc-filter]');
    if (f) { filter = f.dataset.scFilter; render(); return; }
    const t = e.target.closest && e.target.closest('[data-sc]'); if (!t) return;
    if (t.dataset.sc === 'run') load(true).then(() => { speed = null; measure(); });
    else if (t.dataset.sc === 'speed') measure();
  });
  const onHash = () => {
    if ((location.hash || '').slice(1).split('?')[0] !== 'sitecheck') return;
    // one after the other: the speed is measured when the server is not busy with the check itself
    if (!report && !loading) load(false).then(() => { if (!speed && !measuring) measure(); });
    else if (!speed && !measuring) measure();
  };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('DOMContentLoaded', () => {
    render(); onHash();
    const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if ($('#view-sitecheck.active')) load(true).then(measure); });
  });
})();
