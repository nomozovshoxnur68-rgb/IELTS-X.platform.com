/* IELTSX — the Performance page (study/Tools/Performance.html). Everything is worked out from the real results of the
   account (IELTSXData, /api/results) and the AI checks (/api/ai/history); nothing here is made up. */
(function (window, document) {
  'use strict';
  const api = window.IELTSXData;
  if (!api) return;

  const SKILLS = ['Listening', 'Reading', 'Writing', 'Speaking'];
  const SKILL_LINK = { Listening: '/part/practice/listening', Reading: '/part/practice/reading', Writing: '/part/practice/writing', Speaking: '/part/practice/speaking' };
  const CRITERIA = {
    Writing: [['taskAchievement', 'Task Response / Achievement'], ['coherenceCohesion', 'Coherence & Cohesion'], ['lexicalResource', 'Lexical Resource'], ['grammarAccuracy', 'Grammatical Range & Accuracy']],
    Speaking: [['fluencyCoherence', 'Fluency & Coherence'], ['lexicalResource', 'Lexical Resource'], ['grammarAccuracy', 'Grammatical Range & Accuracy'], ['pronunciation', 'Pronunciation']]
  };
  const PAGE = 10;
  const ui = { trend: 'All', table: 'All', page: 1, history: null };
  let drawn = '';

  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const band = (v) => api.formatBand(v);
  const dateText = (iso, opts) => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, opts || { day: 'numeric', month: 'short', year: 'numeric' }); };
  const localDay = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const newest = (list) => list.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const avgOf = (list) => api.average(list.map((r) => r.band));
  function target() { try { const n = Number(localStorage.getItem('ix-target-band')); return n >= 4 && n <= 9 ? n : 7; } catch (e) { return 7; } }
  function results() { return api.getCurrentUser() ? newest(api.getCurrentUserResults()) : []; }

  /* the average of the last n attempts of each skill; the overall band follows the IELTS rule for averages */
  function skillStats(all) {
    const out = {};
    SKILLS.forEach((s) => {
      const list = all.filter((r) => r.section === s);
      const recent = list.slice(0, 10), before = list.slice(10, 20);
      const now = avgOf(recent), prev = avgOf(before);
      out[s] = { list, count: list.length, avg: now === null ? null : api.roundBand(now), delta: now !== null && prev !== null ? Math.round((now - prev) * 10) / 10 : null, best: list.length ? Math.max(...list.map((r) => r.band)) : null };
    });
    return out;
  }
  function overallOf(stats) {
    const have = SKILLS.map((s) => stats[s].avg).filter((v) => v !== null);
    return { value: have.length ? api.roundBand(api.average(have)) : null, skills: have.length };
  }
  function streakOf(all) {
    const days = new Set(all.map((r) => localDay(new Date(r.createdAt))));
    const d = new Date(); if (!days.has(localDay(d))) d.setDate(d.getDate() - 1);   // today still counts until it ends
    let n = 0; while (days.has(localDay(d))) { n += 1; d.setDate(d.getDate() - 1); }
    return n;
  }
  function timeText(sec) {
    if (!sec) return '—';
    const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
    return h ? h + 'h ' + m + 'm' : (m || 1) + ' min';
  }

  /* ── the numbers at the top ── */
  function renderKpis(all, stats) {
    const o = overallOf(stats), t = target();
    const gap = o.value === null ? '' : o.value >= t ? 'Target reached' : (t - o.value).toFixed(1) + ' to your target of ' + t.toFixed(1);
    const days = new Set(all.map((r) => localDay(new Date(r.createdAt)))).size;
    const tile = (label, value, note) => `<div class="pf-card pf-kpi"><div class="pf-label">${esc(label)}</div><div class="pf-big">${esc(value)}</div><div class="pf-note">${esc(note)}</div></div>`;
    $('pf-kpis').innerHTML =
      tile('Estimated overall band', band(o.value), o.value === null ? 'Finish a test to see it' : gap + (o.skills < 4 ? ` · from ${o.skills} of 4 skills` : '')) +
      tile('Tests finished', String(all.length), days + (days === 1 ? ' active day' : ' active days')) +
      tile('Time practised', timeText(all.reduce((n, r) => n + (r.durationSec || 0), 0)), 'On tests with a recorded time') +
      tile('Day streak', String(streakOf(all)), streakOf(all) ? 'Keep it going' : 'Finish a test today to start one');
  }

  /* ── one card per skill ── */
  function spark(list) {
    const pts = list.slice(0, 12).reverse();
    if (pts.length < 2) return '';
    const w = 96, h = 28, x = (i) => (i / (pts.length - 1)) * (w - 4) + 2, y = (b) => h - 2 - (b / 9) * (h - 4);
    return `<svg class="pf-spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><polyline points="${pts.map((r, i) => x(i).toFixed(1) + ',' + y(r.band).toFixed(1)).join(' ')}"/></svg>`;
  }
  function renderSkills(stats) {
    $('pf-skills').innerHTML = SKILLS.map((s) => {
      const st = stats[s];
      const delta = st.delta === null ? '' : `<span class="pf-delta ${st.delta > 0 ? 'up' : st.delta < 0 ? 'down' : ''}">${st.delta > 0 ? '▲ +' : st.delta < 0 ? '▼ ' : ''}${st.delta.toFixed(1)}</span>`;
      return `<article class="pf-card pf-skill"><div class="pf-skill-top"><h3>${s}</h3>${delta}</div>
        <div class="pf-skill-mid"><span class="pf-big">${band(st.avg)}</span>${spark(st.list)}</div>
        <div class="pf-note">${st.count ? `Best ${band(st.best)} · ${st.count} ${st.count === 1 ? 'attempt' : 'attempts'}` : 'No attempts yet'}</div>
        <div class="pf-skill-foot">${st.count ? `<button type="button" class="pf-link" data-trend="${s}">Progress</button>` : ''}<a class="pf-link" href="${SKILL_LINK[s]}">Practise</a></div></article>`;
    }).join('');
  }

  /* ── the band over time ── */
  const seriesName = (s) => 'var(--pf-s' + (SKILLS.indexOf(s) + 1) + ')';
  function renderTrend(all) {
    const box = $('pf-trend-chart'); const shown = ui.trend === 'All' ? SKILLS : [ui.trend];
    document.querySelectorAll('#pf-trend-tabs [data-trend]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.trend === ui.trend)));
    const rows = all.filter((r) => shown.includes(r.section)).map((r) => ({ ...r, t: new Date(r.createdAt).getTime() })).sort((a, b) => a.t - b.t);
    if (!rows.length) { box.innerHTML = `<div class="pf-empty">${ui.trend === 'All' ? 'Finish a test' : 'Finish a ' + ui.trend + ' test'} to see your band over time.</div>`; $('pf-legend').innerHTML = ''; return; }
    const W = Math.max(320, box.clientWidth || 800), H = 260, L = 34, R = 14, T = 12, B = 28;
    const t0 = rows[0].t, t1 = rows[rows.length - 1].t, span = t1 - t0 || 1;
    const x = (t) => (t1 === t0 ? (L + W - R) / 2 : L + ((t - t0) / span) * (W - L - R));
    const y = (b) => T + (1 - b / 9) * (H - T - B);
    const grid = [0, 3, 5, 7, 9].map((b) => `<line class="pf-grid" x1="${L}" x2="${W - R}" y1="${y(b)}" y2="${y(b)}"/><text class="pf-axis" x="${L - 8}" y="${y(b) + 4}" text-anchor="end">${b}</text>`).join('');
    const tg = target();
    const goal = `<line class="pf-goal" x1="${L}" x2="${W - R}" y1="${y(tg)}" y2="${y(tg)}"/><text class="pf-axis" x="${W - R}" y="${y(tg) - 5}" text-anchor="end">Target ${tg.toFixed(1)}</text>`;
    const ticks = (t1 === t0 ? [t0] : [t0, t0 + span / 2, t1]).map((t, i, a) => `<text class="pf-axis" x="${x(t)}" y="${H - 8}" text-anchor="${a.length > 1 && i === 0 ? 'start' : a.length > 1 && i === a.length - 1 ? 'end' : 'middle'}">${esc(dateText(t, { day: 'numeric', month: 'short' }))}</text>`).join('');
    const lines = shown.map((s) => {
      const list = rows.filter((r) => r.section === s); if (!list.length) return '';
      return `<polyline class="pf-line" style="stroke:${seriesName(s)}" points="${list.map((r) => x(r.t).toFixed(1) + ',' + y(r.band).toFixed(1)).join(' ')}"/>` +
        (list.length <= 40 ? list.map((r) => `<circle class="pf-dot" style="fill:${seriesName(s)}" cx="${x(r.t).toFixed(1)}" cy="${y(r.band).toFixed(1)}" r="4"/>`).join('') : '');
    }).join('');
    box.innerHTML = `<svg class="pf-chart" viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="Band over time. The table below lists every attempt.">${grid}${goal}${ticks}${lines}<line class="pf-cross" id="pf-cross" y1="${T}" y2="${H - B}" hidden/></svg><div class="pf-tip" id="pf-tip" hidden></div>`;
    $('pf-legend').innerHTML = shown.length > 1 ? shown.map((s) => `<span class="pf-key"><i style="background:${seriesName(s)}"></i>${s}</span>`).join('') : '';
    const svg = box.querySelector('svg'), tip = $('pf-tip'), cross = $('pf-cross');
    svg.addEventListener('pointermove', (e) => {
      const rect = svg.getBoundingClientRect(), mx = (e.clientX - rect.left) * (W / rect.width);
      let hit = rows[0]; rows.forEach((r) => { if (Math.abs(x(r.t) - mx) < Math.abs(x(hit.t) - mx)) hit = r; });
      const cx = x(hit.t); cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); cross.removeAttribute('hidden');
      tip.hidden = false;
      tip.innerHTML = `<b>${esc(hit.section)} · Band ${band(hit.band)}</b><span>${esc(hit.pageLabel)}</span><span>${esc(dateText(hit.t))}</span>`;
      const left = Math.min(rect.width - tip.offsetWidth - 4, Math.max(4, (cx / W) * rect.width + 10));
      tip.style.left = left + 'px'; tip.style.top = Math.max(0, (y(hit.band) / H) * rect.height - tip.offsetHeight - 8) + 'px';
    });
    svg.addEventListener('pointerleave', () => { tip.hidden = true; cross.setAttribute('hidden', ''); });
  }

  /* ── what the AI checks say: the four criteria of Writing and Speaking ── */
  function renderAi() {
    const box = $('pf-ai'); const h = ui.history;
    if (!h) { box.innerHTML = '<h2>AI feedback</h2><div class="pf-empty">Sign in to see your AI checks.</div>'; return; }
    const credits = !h.configured ? 'The AI check is not available yet.' : h.limit === null ? 'No limit on your account.' : `${h.remaining} of ${h.limit} checks left this month.`;
    const groups = ['Writing', 'Speaking'].map((sec) => {
      const items = (h.items || []).filter((x) => x.section === sec).slice(0, 5);
      if (!items.length) return { sec, rows: [], items };
      const rows = CRITERIA[sec].map(([k, name]) => {
        const vals = items.map((x) => x.criteria && x.criteria[k]).filter((v) => typeof v === 'number');
        return { name, value: vals.length ? api.roundBand(api.average(vals)) : null };
      }).filter((r) => r.value !== null);
      return { sec, rows, items };
    });
    const weakest = groups.flatMap((g) => g.rows.map((r) => ({ ...r, sec: g.sec }))).sort((a, b) => a.value - b.value)[0];
    const bars = groups.map((g) => (g.rows.length ? `<div class="pf-crit"><h3>${g.sec}<small>last ${g.items.length} ${g.items.length === 1 ? 'check' : 'checks'}</small></h3>${g.rows.map((r) => `<div class="pf-bar"><span class="pf-bar-name">${esc(r.name)}</span><span class="pf-bar-track"><i style="width:${(r.value / 9 * 100).toFixed(0)}%"></i></span><span class="pf-bar-val">${r.value.toFixed(1)}</span></div>`).join('')}</div>`
      : `<div class="pf-crit"><h3>${g.sec}</h3><p class="pf-note">No AI check yet. <a class="pf-link" href="${SKILL_LINK[g.sec]}">Try a ${g.sec.toLowerCase()} test</a></p></div>`)).join('');
    box.innerHTML = `<h2>AI feedback</h2><p class="pf-note pf-sub">${esc(credits)}</p>${weakest ? `<p class="pf-focus">Your focus now: <b>${esc(weakest.name)}</b> in ${weakest.sec} (Band ${weakest.value.toFixed(1)}).</p>` : ''}${bars}`;
  }

  /* ── practice and mock averages: last 10 attempts, last 3 exams ── */
  function renderAverages(all) {
    const row = (name, list, n) => {
      const vals = SKILLS.map((s) => { const v = avgOf(list.filter((r) => r.section === s).slice(0, n)); return v === null ? null : api.roundBand(v); });
      const have = vals.filter((v) => v !== null);
      return `<tr><th scope="row">${name}</th>${vals.map((v) => `<td>${band(v)}</td>`).join('')}<td class="pf-strong">${band(have.length ? api.roundBand(api.average(have)) : null)}</td></tr>`;
    };
    $('pf-avg-body').innerHTML = row('Practice', all.filter((r) => r.bucket !== 'Mock'), 10) + row('Mock', all.filter((r) => r.bucket === 'Mock'), 3);
  }

  /* ── activity over the last year ── */
  function renderActivity(all) {
    const days = api.getActivity(all); const svg = $('pf-activity-svg'); if (!svg) return;
    const size = 12, gap = 4, top = 18, left = 30;
    const weeks = Math.ceil(days.length / 7);
    const fill = (n) => (n <= 0 ? 'hsl(var(--muted))' : n === 1 ? '#6ee7b7' : n === 2 ? '#34d399' : n === 3 ? '#10b981' : '#059669');
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let labels = '', lastMonth = -1, lastWeek = -10;
    for (let w = 0; w < weeks; w += 1) {
      const first = days[w * 7]; if (!first) break;
      const m = Number(first.date.slice(5, 7)) - 1;
      if (m !== lastMonth) { if (w - lastWeek >= 3) { labels += `<text class="pf-axis" x="${left + w * (size + gap)}" y="10">${names[m]}</text>`; lastWeek = w; } lastMonth = m; }
    }
    const cells = days.map((d, i) => `<rect x="${left + Math.floor(i / 7) * (size + gap)}" y="${top + d.dayOfWeek * (size + gap)}" width="${size}" height="${size}" rx="3" fill="${fill(d.count)}"><title>${d.date}: ${d.count} ${d.count === 1 ? 'test' : 'tests'}</title></rect>`).join('');
    const width = left + weeks * (size + gap);
    svg.setAttribute('width', width); svg.setAttribute('viewBox', `0 0 ${width} ${top + 7 * (size + gap)}`);
    svg.innerHTML = labels + ['Mon', 'Wed', 'Fri'].map((t, i) => `<text class="pf-axis" x="0" y="${top + (i * 2 + 1) * (size + gap) + 10}">${t}</text>`).join('') + cells;
    const box = svg.parentElement; box.scrollLeft = box.scrollWidth;
  }

  /* ── every attempt ── */
  function hrefOf(key) {
    const k = String(key || '');
    let m = /^\/test\/([^/]+)$/.exec(k); if (m) return '/test?id=' + encodeURIComponent(m[1]);
    m = /^\/writing\/([^/]+)$/.exec(k); if (m) return /^demo-/.test(m[1]) ? '/writing/' : '/writing/?id=' + encodeURIComponent(m[1]);
    if (/^\/(pessages|sections|full-tests|exam|listening)\//.test(k)) return k.replace(/\.html$/, '');
    return '';
  }
  function renderTable(all) {
    document.querySelectorAll('#pf-table-tabs [data-table]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.table === ui.table)));
    const list = ui.table === 'All' ? all : ui.table === 'Mock' ? all.filter((r) => r.bucket === 'Mock') : all.filter((r) => r.section === ui.table);
    const pages = Math.max(1, Math.ceil(list.length / PAGE)); if (ui.page > pages) ui.page = pages;
    const rows = list.slice((ui.page - 1) * PAGE, ui.page * PAGE);
    const body = $('pf-table-body');
    const scoreOf = (r) => (r.section === 'Writing' ? r.scoreCorrect + ' of ' + r.scoreTotal + (r.scoreTotal === 1 ? ' task' : ' tasks') : r.section === 'Speaking' ? r.scoreCorrect + ' of ' + r.scoreTotal + ' answers' : r.scoreCorrect + ' / ' + r.scoreTotal);
    body.innerHTML = rows.length ? rows.map((r) => { const h = hrefOf(r.testKey);
      return `<tr><td>${esc(r.section)}${r.bucket === 'Mock' ? ' <span class="pf-tag">Mock</span>' : ''}</td><td class="pf-test">${esc(r.pageLabel)}</td><td>${esc(scoreOf(r))}</td><td class="pf-strong">${band(r.band)}</td><td>${esc(r.durationSec ? timeText(r.durationSec) : '—')}</td><td>${esc(dateText(r.createdAt))}</td><td class="pf-end">${h ? `<a class="pf-link" href="${esc(h)}">Open</a>` : ''}</td></tr>`; }).join('')
      : `<tr><td colspan="7"><div class="pf-empty">${all.length ? 'No attempts here yet.' : 'Your finished tests will be listed here.'}</div></td></tr>`;
    $('pf-page').textContent = list.length ? 'Page ' + ui.page + ' of ' + pages + ' · ' + list.length + (list.length === 1 ? ' attempt' : ' attempts') : '';
    $('pf-prev').disabled = ui.page <= 1; $('pf-next').disabled = ui.page >= pages;
  }

  /* ── the page ── */
  function render() {
    if (!$('ix-perf')) return;
    const all = results(); const user = api.getCurrentUser();
    $('pf-context').textContent = user ? 'Bands are averages of your last 10 attempts in each skill.' : 'Sign in and your results are saved here, on any device.';
    $('pf-guest').hidden = !!user;
    const sel = $('pf-target'); if (sel) sel.value = target().toFixed(1);
    const stats = skillStats(all);
    renderKpis(all, stats); renderSkills(stats); renderTrend(all); renderAi(); renderAverages(all); renderActivity(all); renderTable(all);
    drawn = all.length + ':' + (all[0] ? all[0].id : '');
  }
  function loadHistory() {
    fetch('/api/ai/history', { credentials: 'same-origin', cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((d) => { ui.history = d; renderAi(); }).catch(() => { /* the rest of the page still works */ });
  }
  function init() {
    if (!$('ix-perf')) return;
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-trend]');
      if (t) { ui.trend = t.dataset.trend; renderTrend(results()); if (!t.closest('#pf-trend-tabs')) $('pf-trend').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      const f = e.target.closest('[data-table]');
      if (f) { ui.table = f.dataset.table; ui.page = 1; renderTable(results()); }
    });
    $('pf-prev').addEventListener('click', () => { ui.page -= 1; renderTable(results()); });
    $('pf-next').addEventListener('click', () => { ui.page += 1; renderTable(results()); });
    $('pf-target').addEventListener('change', (e) => { try { localStorage.setItem('ix-target-band', e.target.value); } catch (x) { /* blocked */ } render(); });
    let resize; window.addEventListener('resize', () => { clearTimeout(resize); resize = setTimeout(() => renderTrend(results()), 150); });
    render(); loadHistory();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
  // the results arrive from the server a moment after the page opens
  window.addEventListener('ieltsx:results-changed', () => { const all = results(); if (all.length + ':' + (all[0] ? all[0].id : '') !== drawn) render(); });
  window.addEventListener('ieltsx:user-context-changed', render);
  window.addEventListener('storage', (event) => { if (event.key === 'ieltsx_results_v1' || event.key === 'ieltsx_logged_in_email') render(); });
})(window, document);
