/*
 * IELTSX admin: Site Guard (admin.html#guard) — the small AI watchman of the website (server: site-watch.js).
 * It checks the site by itself (every N minutes on the Node server, every day on Vercel, or "Check now" here), finds
 * problems and errors from visitors' browsers, lists what changed, fixes what is safe to fix, writes an AI report, and
 * sends new problems to Telegram and / or e-mail. "Copy for Claude" copies everything a developer (or Claude Code) needs
 * to fix the code itself.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  let d = null, loading = false, busy = '', error = '', errFilter = 'open', form = null;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(j.error || 'Request failed (' + r.status + ')');
    return j;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 5000 : 2800); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  function ago(v) {
    if (!v) return '—'; const s = (Date.now() - new Date(v).getTime()) / 1000;
    if (s < 0) { const m = Math.round(-s / 60); return m < 60 ? 'in ' + Math.max(1, m) + ' min' : 'in ' + Math.round(m / 60) + ' h'; }
    if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + ' min ago'; if (s < 86400) return Math.floor(s / 3600) + ' h ago';
    return new Date(v).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
  const ICON = { ok: '✓', info: 'i', warn: '!', fail: '✕' };
  const BOT = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>';
  function ring(score) {
    const r = 46, c = 2 * Math.PI * r, off = c * (1 - (score || 0) / 100), cls = score >= 85 ? 'ok' : score >= 60 ? 'warn' : 'fail';
    return `<svg class="sc-ring ${cls}" viewBox="0 0 110 110" aria-label="Score ${score} of 100"><circle cx="55" cy="55" r="${r}" class="track"/><circle cx="55" cy="55" r="${r}" class="val" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/><text x="55" y="64" text-anchor="middle">${score ?? '—'}</text></svg>`;
  }
  const stat = (label, value, sub, cls) => `<div class="card stat ${cls || ''}"><div><div class="stat-label">${esc(label)}</div><div class="stat-value">${value}</div>${sub ? `<div class="stat-sub">${sub}</div>` : ''}</div></div>`;

  /* ───────── drawing ───────── */
  function render() {
    const mount = $('#content-guard'); if (!mount) return;
    if (!d) { mount.innerHTML = `<div class="card"><div class="empty">${error ? 'Could not load: ' + esc(error) + '<br><button class="btn" data-gd="reload" type="button" style="margin-top:10px">Try again</button>' : 'Site Guard is looking at the website… (the first check takes a few seconds)'}</div></div>`; return; }
    const L = d.last, cfg = d.config;
    const openErr = d.errors.filter((g) => g.status === 'open');
    const status = !cfg.enabled ? '<span class="badge">Off</span>' : '<span class="badge badge-ok">● On</span>';
    const every = cfg.intervalMin >= 60 ? (cfg.intervalMin / 60) + ' h' : cfg.intervalMin + ' min';
    const when = d.vercel ? `Vercel: every day at 08:00 (cron)${cfg.cronSecret ? '' : ' — needs CRON_SECRET'} and whenever you open this page after ${every}` : `every ${every}`;
    const channels = [cfg.notifyTelegram ? (cfg.telegramReady ? 'Telegram ✓' : 'Telegram (not set up)') : '', cfg.notifyEmail ? (d.mailReady ? 'E-mail ✓' : 'E-mail (server has no mail)') : ''].filter(Boolean).join(' · ') || 'no messages';
    mount.innerHTML = `
      <div class="card gd-hero">
        ${ring(L ? L.score : null)}
        <div class="gd-hero-main">
          <div class="gd-title"><span class="gd-bot">${BOT}</span><div><div class="section-title">Site Guard ${status}</div>
            <div class="muted sm">Checks the website by itself, finds problems and visitors' errors, fixes what is safe, writes an AI report and sends you the news.</div></div></div>
          <div class="gd-facts">
            <span>🕒 Last check: <b>${L ? esc(ago(L.at)) : '—'}</b>${L ? ` (${esc(L.reason)}, ${(L.tookMs / 1000).toFixed(1)} s)` : ''}</span>
            <span>⏭ Next: <b>${cfg.enabled ? esc(d.nextAt ? ago(d.nextAt) : 'soon') : 'off'}</b> · ${esc(when)}</span>
            <span>📨 ${esc(channels)}</span>
          </div>
        </div>
        <div class="btn-row gd-actions">
          <button class="btn" data-gd="copy" type="button" title="Copy the problems and errors as text for Claude Code or a developer">📋 Copy for Claude</button>
          <button class="btn" data-gd="test" type="button" ${busy ? 'disabled' : ''}>${busy === 'test' ? 'Sending…' : '✉ Send test message'}</button>
          <button class="btn btn-primary" data-gd="run" type="button" ${busy || d.running ? 'disabled' : ''}>${busy === 'run' || d.running ? 'Checking…' : '▶ Check now'}</button>
        </div>
      </div>
      <div class="grid stats mini-stats gd-stats">
        ${stat('Problems', L ? L.counts.fail : '—', L && L.newIssues.length ? `<span class="gd-new">${L.newIssues.length} new</span>` : 'red = needs you now', L && L.counts.fail ? 'gd-bad' : '')}
        ${stat('Warnings', L ? L.counts.warn : '—', 'can wait a little', L && L.counts.warn ? 'gd-warn' : '')}
        ${stat('Fixed by itself', L ? L.fixes.length : '—', L && L.resolved.length ? `${L.resolved.length} resolved since last check` : 'safe fixes only', '')}
        ${stat("Visitors' errors", openErr.length, openErr.length ? openErr.reduce((a, g) => a + g.count, 0) + ' times in all' : 'from their browsers', openErr.length ? 'gd-warn' : '')}
      </div>
      ${aiCard(L)}
      ${issuesCard(L)}
      <div class="grid two-col">${changesCard()}${fixesCard(L)}</div>
      ${errorsCard()}
      <div class="grid two-col">${probesCard(L)}${historyCard()}</div>
      ${settingsCard()}`;
  }
  function aiCard(L) {
    if (!L) return '';
    const ai = L.ai;
    if (!ai) return d.aiReady ? '' : `<div class="card gd-ai"><div class="section-title">🤖 AI report</div><div class="muted sm">The AI report needs OPENAI_API_KEY on the server (the same key as the AI check of Writing and Speaking). The checks, fixes and messages work without it.</div></div>`;
    if (ai.skipped) return `<div class="card gd-ai"><div class="section-title">🤖 AI report</div><div class="muted sm">${esc(ai.skipped)}</div></div>`;
    const P = { high: ['badge-bad', 'Urgent'], medium: ['badge-warn', 'Soon'], low: ['badge-info', 'Later'] };
    return `<div class="card gd-ai"><div class="section-head" style="margin-bottom:8px"><div class="section-title">🤖 AI report</div><span class="muted sm">${esc(ai.model || '')}${ai.at ? ' · ' + esc(ago(ai.at)) : ''}</span></div>
      <p class="gd-ai-sum">${esc(ai.summary)}</p>
      ${(ai.items || []).length ? `<ol class="gd-ai-list">${ai.items.map((x) => `<li><span class="badge ${P[x.priority][0]}">${P[x.priority][1]}</span> <b>${esc(x.title)}</b><div class="muted sm">${esc(x.fix)}</div></li>`).join('')}</ol>` : ''}</div>`;
  }
  function issuesCard(L) {
    if (!L) return '';
    const newIds = new Set(L.newIssues.map((i) => i.id));
    const list = L.issues.slice().sort((a, b) => (a.level === b.level ? 0 : a.level === 'fail' ? -1 : 1));
    return `<div class="card"><div class="section-head"><div><div class="section-title">What is wrong now</div><div class="muted sm">From the last check. A problem that is fixed disappears by itself at the next check.</div></div>
      <a class="btn btn-sm" href="#sitecheck">Full website check →</a></div>
      <div class="sc-list">${list.length ? list.map((f) => `<div class="sc-finding ${f.level}"><span class="sc-ico">${ICON[f.level]}</span><div class="sc-body">
        <div class="sc-title">${esc(f.title)} ${newIds.has(f.id) ? '<span class="badge badge-info">NEW</span>' : ''} <span class="muted sm">· ${esc(f.area)}</span></div>
        ${f.detail ? `<div class="muted sm">${esc(f.detail)}</div>` : ''}${f.fix ? `<div class="sc-fix">→ ${esc(f.fix)}</div>` : ''}
        ${(f.items || []).length ? `<details class="sc-items"><summary>Show ${f.items.length}</summary><ul>${f.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></details>` : ''}</div></div>`).join('')
        : '<div class="sc-finding ok"><span class="sc-ico">✓</span><div class="sc-body"><div class="sc-title">Nothing is wrong</div><div class="muted sm">Every page opens, the content is complete and visitors meet no errors.</div></div></div>'}</div></div>`;
  }
  function changesCard() {
    const log = d.changeLog || [];
    const KIND = { content: '📚', settings: '⚙️', people: '👥', code: '💻' };
    let lastAt = '';
    const rows = log.slice(0, 30).map((c) => { const head = c.at !== lastAt ? `<div class="gd-when">${esc(ago(c.at))}</div>` : ''; lastAt = c.at; return head + `<div class="gd-change"><span>${KIND[c.kind] || '•'}</span><span>${esc(c.text)}</span></div>`; }).join('');
    return `<div class="card"><div class="section-title">What changed on the site</div><div class="muted sm" style="margin-bottom:10px">Tests, settings of the admin panel, accounts and orders, the website's files.</div>
      <div class="gd-changes">${rows || '<div class="muted sm">No changes seen yet. The next checks list everything that changes.</div>'}</div></div>`;
  }
  function fixesCard(L) {
    const fx = L ? L.fixes : [], rs = L ? L.resolved : [];
    const cfg = d.config;
    const on = (b) => (b ? '<span class="badge badge-ok">on</span>' : '<span class="badge">off</span>');
    return `<div class="card"><div class="section-title">Fixed by itself</div><div class="muted sm" style="margin-bottom:10px">Only safe fixes: nothing is deleted, every fix is in the Activity log and can be undone.</div>
      ${fx.length ? `<ul class="gd-ul">${fx.map((f) => `<li>🔧 ${esc(f)}</li>`).join('')}</ul>` : '<div class="muted sm">Nothing needed fixing at the last check.</div>'}
      ${rs.length ? `<div class="sc-sub" style="margin-top:12px">Resolved since the check before</div><ul class="gd-ul">${rs.map((r) => `<li>✅ ${esc(r.title)}</li>`).join('')}</ul>` : ''}
      <div class="gd-auto"><div>${on(cfg.autoHideBroken)} Hide published tests that cannot work (no questions, no passage, no audio)</div><div>${on(cfg.autoHideDeadMenu)} Hide menu items whose page is gone</div><div>${on(cfg.autoCloseErrors)} Close visitors' errors not seen for 7 days</div></div></div>`;
  }
  function errorsCard() {
    const list = d.errors.filter((g) => errFilter === 'all' || g.status === errFilter);
    const tab = (v, n) => `<button class="tab${errFilter === v ? ' active' : ''}" data-gd="ef" data-v="${v}" type="button">${n}<span class="n">${v === 'all' ? d.errors.length : d.errors.filter((g) => g.status === v).length}</span></button>`;
    const KIND = { error: 'Script', promise: 'Script', resource: 'Missing file' };
    return `<div class="card"><div class="section-head"><div><div class="section-title">Errors in visitors' browsers</div><div class="muted sm">Sent by the pages themselves when something breaks for a student (no personal data). The same error is counted, not repeated.</div></div>
      <div class="btn-row"><div class="tabs" style="margin:0">${tab('open', 'Open')}${tab('fixed', 'Fixed')}${tab('ignored', 'Ignored')}${tab('all', 'All')}</div>${d.errors.some((g) => g.status !== 'open') ? '<button class="btn btn-sm" data-gd="eclear" type="button">Remove closed</button>' : ''}</div></div>
      ${list.length ? `<div class="table-wrap"><table class="table gd-errs"><thead><tr><th>Error</th><th>Page</th><th class="right">Times</th><th>Last seen</th><th></th></tr></thead><tbody>${list.slice(0, 60).map((g) => `<tr>
        <td><span class="badge ${g.kind === 'resource' ? 'badge-warn' : 'badge-bad'}">${KIND[g.kind] || 'Error'}</span> <b>${esc(g.message)}</b>${g.source ? `<div class="muted sm gd-mono">${esc(g.source)}${g.line ? ':' + g.line + (g.col ? ':' + g.col : '') : ''}</div>` : ''}
          ${g.stack ? `<details class="sc-items"><summary>Stack</summary><pre class="gd-pre">${esc(g.stack)}</pre></details>` : ''}${g.reopened ? '<div class="muted sm">⚠ came back after it was marked fixed</div>' : ''}</td>
        <td class="sm">${(g.pages || [g.page]).map(esc).join('<br>')}</td><td class="right"><b>${g.count}</b></td><td class="sm nowrap">${esc(ago(g.last))}<div class="muted sm">first ${esc(ago(g.first))}</div></td>
        <td class="nowrap">${g.status === 'open' ? `<button class="btn btn-sm" data-gd="es" data-id="${g.id}" data-v="fixed" type="button">✓ Fixed</button> <button class="btn btn-sm" data-gd="es" data-id="${g.id}" data-v="ignored" type="button">Ignore</button>` : `<span class="badge">${esc(g.status)}</span> <button class="btn btn-sm" data-gd="es" data-id="${g.id}" data-v="open" type="button">Reopen</button>`}</td></tr>`).join('')}</tbody></table></div>`
        : `<div class="empty sm">${errFilter === 'open' ? 'No open errors — visitors meet no broken scripts or missing files.' : 'Nothing here.'}</div>`}</div>`;
  }
  function probesCard(L) {
    const ps = (L && L.probes) || [];
    const max = Math.max(1500, ...ps.map((p) => p.ms));
    return `<div class="card"><div class="section-title">Live pages</div><div class="muted sm" style="margin-bottom:10px">Opened by the server at every check (how long the answer took).</div>
      ${ps.length ? `<div class="table-wrap"><table class="table"><tbody>${ps.map((p) => { const g = !p.ok ? 'fail' : p.ms < (p.kind === 'api' ? 600 : 1200) ? 'ok' : p.ms < 2500 ? 'warn' : 'fail';
        return `<tr><td><a href="${esc(p.path)}" target="_blank" rel="noopener">${esc(p.name)}</a></td><td class="nowrap"><span class="badge badge-${g === 'ok' ? 'ok' : g === 'warn' ? 'warn' : 'bad'}">${p.status || 'error'}</span></td>
          <td class="sc-bar-cell"><div class="sc-bar"><i class="${g}" style="width:${Math.max(3, Math.round(p.ms / max * 100))}%"></i></div></td><td class="right nowrap"><b>${p.ms} ms</b></td></tr>`; }).join('')}</tbody></table></div>`
        : '<div class="muted sm">Pages are opened at the next check (PUBLIC_URL tells Site Guard the address of the site).</div>'}</div>`;
  }
  function historyCard() {
    const h = (d.history || []).slice(0, 30).reverse();
    return `<div class="card"><div class="section-title">History</div><div class="muted sm" style="margin-bottom:10px">The score of the last ${h.length} check${h.length === 1 ? '' : 's'} (hover a bar).</div>
      ${h.length ? `<div class="gd-hist">${h.map((x) => `<i class="${x.score >= 85 ? 'ok' : x.score >= 60 ? 'warn' : 'fail'}" style="height:${Math.max(6, x.score)}%" title="${esc(new Date(x.at).toLocaleString('en-GB'))} · ${x.score}/100 · ${x.fail} problems, ${x.warn} warnings${x.fixes ? ', ' + x.fixes + ' fixed' : ''} (${esc(x.reason)})"></i>`).join('')}</div>` : '<div class="muted sm">No checks yet.</div>'}</div>`;
  }
  function settingsCard() {
    const c = form || d.config;
    const opt = (list, v) => list.map(([k, n]) => `<option value="${esc(k)}" ${String(v) === String(k) ? 'selected' : ''}>${esc(n)}</option>`).join('');
    const chk = (k, label, hint) => `<label class="gd-check"><input type="checkbox" data-gs="${k}" ${c[k] ? 'checked' : ''}><span><b>${label}</b>${hint ? `<span class="muted sm">${hint}</span>` : ''}</span></label>`;
    const origin = location.origin;
    return `<div class="card"><div class="section-head"><div><div class="section-title">Settings</div><div class="muted sm">How often to check, where to send the news and what Site Guard may fix by itself.</div></div>
      <button class="btn btn-primary" data-gd="save" type="button" ${busy ? 'disabled' : ''}>${busy === 'save' ? 'Saving…' : 'Save settings'}</button></div>
      <div class="gd-form">
        <div class="gd-col">
          ${chk('enabled', 'Check the site automatically', '')}
          <label class="lbl">Check every<select class="field" data-gs="intervalMin">${opt(d.intervals.map((m) => [m, m >= 60 ? (m / 60) + (m === 60 ? ' hour' : ' hours') : m + ' minutes']), c.intervalMin)}</select></label>
          <label class="lbl">Language of messages and the AI report<select class="field" data-gs="lang">${opt([['uz', "O'zbekcha"], ['en', 'English'], ['ru', 'Русский']], c.lang)}</select></label>
          <label class="lbl">Send me<select class="field" data-gs="notifyLevel">${opt([['fail', 'New problems only (red)'], ['warn', 'New problems and warnings']], c.notifyLevel)}</select></label>
          ${chk('digest', 'A short summary once a day', 'Even when nothing new happened.')}
          ${chk('ai', 'AI report', d.aiReady ? 'Written by the AI after each check with problems or changes.' : 'Needs OPENAI_API_KEY on the server.')}
        </div>
        <div class="gd-col">
          ${chk('notifyTelegram', 'Telegram', '')}
          <label class="lbl">Bot token ${c.telegramFromEnv ? '<span class="badge badge-info">from TELEGRAM_BOT_TOKEN</span>' : ''}<input class="field" data-gs="telegramToken" value="${esc(c.telegramToken || '')}" placeholder="123456789:AA… from @BotFather" autocomplete="off" ${c.telegramFromEnv ? 'disabled' : ''}></label>
          <label class="lbl">Chat ID ${c.telegramChatFromEnv ? '<span class="badge badge-info">from TELEGRAM_CHAT_ID</span>' : ''}<input class="field" data-gs="telegramChat" value="${esc(c.telegramChat || '')}" placeholder="e.g. 123456789 or -100…" ${c.telegramChatFromEnv ? 'disabled' : ''}></label>
          <details class="sc-items gd-howto"><summary>How to get them (2 minutes)</summary><ol>
            <li>In Telegram open <b>@BotFather</b> → <code>/newbot</code> → give it a name. Copy the token it sends.</li>
            <li>Open your new bot and press <b>Start</b> (or add it to your admins' group).</li>
            <li>Open <b>@userinfobot</b> (or <b>@getidsbot</b>) → it tells your Chat ID. A group's ID starts with -100.</li>
            <li>Paste both here, Save, then press “Send test message”.</li></ol></details>
          ${chk('notifyEmail', 'E-mail', d.mailReady ? '' : 'The server cannot send e-mail yet (SMTP_USER / SMTP_PASS in the environment).')}
          <label class="lbl">Addresses<input class="field" data-gs="emails" value="${esc(c.emails || '')}" placeholder="${esc(d.adminEmails.join(', ') || 'you@example.com')}"></label>
        </div>
        <div class="gd-col">
          <div class="sc-sub">Fix by itself</div>
          ${chk('autoHideBroken', 'Hide tests that cannot work', 'A published test with no questions, no passage or (Listening) no audio is hidden until you fix it.')}
          ${chk('autoHideDeadMenu', 'Hide dead menu items', 'A menu item you added whose page answers “not found”.')}
          ${chk('autoCloseErrors', "Close old visitors' errors", 'Not seen for 7 days = fixed. It opens again if it comes back.')}
          <div class="sc-sub" style="margin-top:12px">Automatic address</div>
          <div class="muted sm">${d.vercel ? 'Vercel runs the check every day by itself' + (c.cronSecret ? '.' : ' once <b>CRON_SECRET</b> is set (Vercel → Settings → Environment Variables).') : 'This server runs the check by itself.'}
            For a check every hour, add this address to a free pinger such as cron-job.org (replace KEY with your CRON_SECRET):</div>
          <code class="gd-mono gd-url">${esc(origin)}/api/cron/site-watch?key=KEY</code>
        </div>
      </div></div>`;
  }

  /* ───────── "Copy for Claude" ───────── */
  function report() {
    const L = d.last; if (!L) return '';
    const lines = [`# IELTSX — Site Guard report (${new Date(L.at).toLocaleString('en-GB')})`, '', `Site: ${location.origin} · score ${L.score}/100`, '',
      'Please fix these problems in the IELTSX website project. Explain each fix briefly.', ''];
    if (L.issues.length) { lines.push('## Problems'); L.issues.forEach((i) => { lines.push(`- [${i.level}] ${i.area}: ${i.title}${i.detail ? ' — ' + i.detail : ''}${i.fix ? ' (hint: ' + i.fix + ')' : ''}`); (i.items || []).slice(0, 5).forEach((x) => lines.push('  - ' + x)); }); lines.push(''); }
    const open = d.errors.filter((g) => g.status === 'open');
    if (open.length) {
      lines.push("## Errors in visitors' browsers");
      open.slice(0, 15).forEach((g) => { lines.push(`- ${g.kind}: ${g.message} — ${g.source || ''}${g.line ? ':' + g.line + ':' + (g.col || 0) : ''} — pages: ${(g.pages || [g.page]).join(', ')} — ${g.count}×, last ${g.last}`); if (g.stack) lines.push('  ```\n  ' + g.stack.split('\n').slice(0, 8).join('\n  ') + '\n  ```'); });
      lines.push('');
    }
    if ((d.changeLog || []).length) { lines.push('## Recent changes on the site'); d.changeLog.slice(0, 12).forEach((c) => lines.push(`- ${c.at.slice(0, 16).replace('T', ' ')} ${c.text}`)); lines.push(''); }
    if (L.ai && L.ai.summary) { lines.push('## AI summary', L.ai.summary); (L.ai.items || []).forEach((x) => lines.push(`- (${x.priority}) ${x.title}: ${x.fix}`)); }
    return lines.join('\n');
  }

  /* ───────── load, actions ───────── */
  async function load(force) {
    if (loading) return; loading = true; error = '';
    if (force) { d = null; render(); }
    try { d = await api('/api/admin/guard'); form = null; } catch (e) { error = e.message; }
    finally { loading = false; render(); }
  }
  function readForm() {
    const c = { ...(form || d.config) };
    document.querySelectorAll('#content-guard [data-gs]').forEach((el) => { if (el.disabled) return; c[el.dataset.gs] = el.type === 'checkbox' ? el.checked : el.value; });
    return c;
  }
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-gd]'); const m = $('#content-guard'); if (!t || !m || !m.contains(t)) return;
    const a = t.dataset.gd;
    try {
      if (a === 'reload') return load(true);
      if (a === 'run') { busy = 'run'; render(); try { d = await api('/api/admin/guard/run', { method: 'POST' }); toast('Checked — ' + (d.last ? d.last.counts.fail + ' problems, ' + d.last.counts.warn + ' warnings' : 'done')); } finally { busy = ''; render(); } return; }
      if (a === 'test') {
        busy = 'test'; render();
        try {
          const r = (await api('/api/admin/guard/test', { method: 'POST' })).result || {};
          const parts = []; if (r.telegram) parts.push('Telegram: ' + (r.telegram.ok ? 'sent ✓' : r.telegram.error)); if (r.email) parts.push('E-mail: ' + (r.email.ok ? 'sent ✓' : r.email.error));
          toast(parts.join(' · ') || 'Switch on Telegram or e-mail first.', !(r.telegram && r.telegram.ok) && !(r.email && r.email.ok));
        } finally { busy = ''; render(); }
        return;
      }
      if (a === 'save') {
        busy = 'save'; const body = readForm(); render();
        try { d = await api('/api/admin/guard/config', { method: 'POST', body: JSON.stringify(body) }); form = null; toast('Settings saved'); } catch (er) { form = body; throw er; } finally { busy = ''; render(); }
        return;
      }
      if (a === 'copy') {
        const text = report(); if (!text) return toast('Run a check first.', true);
        try { await navigator.clipboard.writeText(text); toast('Copied — paste it into Claude Code (or send it to your developer)'); }
        catch (er) { const w = window.open('', '_blank'); if (w) { w.document.title = 'Site Guard report'; const pre = w.document.createElement('pre'); pre.textContent = text; pre.style.whiteSpace = 'pre-wrap'; w.document.body.appendChild(pre); } }
        return;
      }
      if (a === 'ef') { errFilter = t.dataset.v; return render(); }
      if (a === 'es') { d = await api('/api/admin/guard/errors/' + t.dataset.id, { method: 'POST', body: JSON.stringify({ status: t.dataset.v }) }); return render(); }
      if (a === 'eclear') { if (!confirm('Remove the fixed and ignored errors from the list?')) return; d = await api('/api/admin/guard/errors/clear', { method: 'POST' }); return render(); }
    } catch (err) { fail(err); }
  });
  // keep what is typed in the settings when the page is drawn again (a check that ends while you type)
  document.addEventListener('input', (e) => { const el = e.target; if (el.dataset && el.dataset.gs && d) form = readForm(); });
  document.addEventListener('change', (e) => { const el = e.target; if (el.dataset && el.dataset.gs && d) form = readForm(); });

  const onHash = () => { if ((location.hash || '').slice(1).split('?')[0] === 'guard' && !d && !loading) load(); };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('DOMContentLoaded', () => {
    render(); onHash();
    const rf = $('#refresh'); if (rf) rf.addEventListener('click', () => { if ($('#view-guard.active')) load(false); });
  });
})();
