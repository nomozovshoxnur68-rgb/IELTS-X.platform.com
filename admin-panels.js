/*
 * IELTSX admin: Videos, Books, Grammar, Music and Links (admin.html#videos #books #grammar #music #links).
 *   Videos   YouTube / Vimeo links, shown on /videos (the student watches them in the site's own player window)
 *   Books    PDF files (uploaded here) or links, with a cover, shown on /books
 *   Grammar  topics: the explanation (simple formatting) and short exercises, shown on /grammar
 *   Music    tracks the students can play from the Settings page (and on the ordinary pages, never in a test)
 *   Links    "old link → new link": every page of the website shows the new link instead (and an old page address
 *            opens the new one)
 * Each item has its plan (Free / Standard / Max / Ultra) and can be hidden. The server (panels.js) checks everything and
 * never sends a locked item's video, file, text or music to a student.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const PLANS = { free: 'Free', standard: 'Standard', max: 'Max', ultra: 'Ultra' };
  const LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const CATS = {
    videos: ['Listening', 'Reading', 'Writing', 'Speaking', 'Vocabulary', 'Grammar', 'Exam tips', 'General'],
    books: ['Cambridge IELTS', 'Listening', 'Reading', 'Writing', 'Speaking', 'Vocabulary', 'Grammar', 'General'],
    grammar: ['Tenses', 'Articles', 'Conditionals', 'Passive voice', 'Modal verbs', 'Clauses', 'Linking words', 'Sentence structure', 'Punctuation'],
    music: ['Lo-fi', 'Piano', 'Nature', 'Classical', 'Focus']
  };
  const K = {
    videos: { name: 'Videos', one: 'video', page: '/videos', icon: 'video', hero: 'Video lessons on the Videos page', help: 'Paste a YouTube or Vimeo link. Students watch it inside the website. A locked video shows only its title (and your own cover picture, if you add one) until the student has the plan. Note: anybody who has the YouTube link itself can watch it on YouTube, so use “Unlisted” videos for paid lessons.' },
    books: { name: 'Books', one: 'book', page: '/books', icon: 'book', hero: 'Books and study guides on the Books page', help: 'Upload a PDF (or paste a link to it) and a cover picture. A locked book shows its cover and title only; the file is given to students with the plan.' },
    grammar: { name: 'Grammar', one: 'topic', page: '/grammar', icon: 'graduation', hero: 'Grammar lessons on the Grammar page', help: 'Write the explanation with simple formatting and add short exercises; students check their answers on the page. A locked topic shows its title and summary only.' },
    music: { name: 'Music', one: 'track', page: '/settings', icon: 'music', hero: 'Study music in Settings', help: 'Upload music files (MP3, M4A, OGG, WAV) or paste links. Students choose a track on the Settings page; it plays on the ordinary pages of the website and stops by itself in tests and exams. Use only music you have the right to share.' }
  };
  const icon = (n) => (window.IXAdminIcon ? window.IXAdminIcon(n) : '');
  const state = {};            // kind -> { items, loading, draft, original, query }
  let links = null, linksOriginal = '', linksLoading = false, linksBusy = false;

  async function api(url, opt = {}) {
    const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { ...(opt.body && !(opt.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) } });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent('/admin')); throw new Error('Please sign in.'); }
    if (!r.ok) throw new Error(d.error || 'Request failed (' + r.status + ')');
    return d;
  }
  function toast(m, bad) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.toggle('bad', !!bad); t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), bad ? 4500 : 2600); }
  const fail = (e) => toast((e && e.message) || 'Something went wrong', true);
  const ago = (v) => { if (!v) return '—'; const s = Math.max(0, (Date.now() - new Date(v).getTime()) / 1000); if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + ' min ago'; if (s < 86400) return Math.floor(s / 3600) + ' h ago'; return new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); };
  const mount = (kind) => $('#content-' + kind);
  const st = (kind) => state[kind] || (state[kind] = { items: null, loading: false, draft: null, original: '', query: '' });
  /* YouTube / Vimeo link -> its id (the same rule as panels.js), for the preview */
  function videoOf(url) {
    const s = String(url || '').trim();
    let m = /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/i.exec(s);
    if (m) return { provider: 'youtube', videoId: m[1] };
    m = /vimeo\.com\/(?:video\/)?(\d{5,12})/i.exec(s);
    return m ? { provider: 'vimeo', videoId: m[1] } : null;
  }
  const videoLink = (it) => (it.provider === 'vimeo' ? 'https://vimeo.com/' + it.videoId : it.videoId ? 'https://www.youtube.com/watch?v=' + it.videoId : '');

  /* ───────── a list ───────── */
  function thumb(kind, it) {
    const img = kind === 'videos' ? (it.cover || (it.provider === 'youtube' && it.videoId ? 'https://i.ytimg.com/vi/' + it.videoId + '/default.jpg' : '')) : it.cover;
    return `<div class="pn-thumb pn-${kind}">${img ? `<img src="${esc(img)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : icon(K[kind].icon)}</div>`;
  }
  function metaText(kind, it) {
    const p = [];
    if (it.category) p.push(esc(it.category)); if (it.level) p.push(esc(it.level));
    if (kind === 'videos') { p.push(it.provider === 'vimeo' ? 'Vimeo' : 'YouTube'); if (it.duration) p.push(esc(it.duration)); }
    if (kind === 'books') { if (it.author) p.push(esc(it.author)); p.push(it.file ? 'file ✓' : '<span class="pn-warn">no file yet</span>'); if (it.pages) p.push(it.pages + ' pages'); }
    if (kind === 'grammar') p.push((it.exercises || []).length + ' exercises');
    if (kind === 'music' && it.artist) p.push(esc(it.artist));
    p.push('updated ' + esc(ago(it.updatedAt)));
    return p.join(' · ');
  }
  function renderList(kind) {
    const m = mount(kind); const s = st(kind); if (!m) return;
    if (!s.items) { m.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
    const q = s.query.toLowerCase();
    const shown = s.items.filter((it) => !q || [it.title, it.category, it.author, it.artist, it.summary, it.description].join(' ').toLowerCase().includes(q));
    m.innerHTML = `
      <div class="pd-hero card">
        <div class="pd-hero-text"><div class="eyebrow">${esc(K[kind].hero)}</div><h2>${esc(K[kind].name)}</h2><p class="muted">${esc(K[kind].help)}</p></div>
        <div class="btn-row"><a class="btn" href="${K[kind].page}" target="_blank" rel="noopener">Open the page ↗</a><button class="btn btn-primary" data-pn="new" data-k="${kind}" type="button">+ New ${esc(K[kind].one)}</button></div>
      </div>
      <div class="card">
        <div class="toolbar"><div class="muted sm" style="flex:1 1 auto">${s.items.length} ${esc(K[kind].one)}${s.items.length === 1 ? '' : 's'} · ${s.items.filter((x) => x.published !== false).length} shown on the site</div>
          <input class="field" data-pn-search="${kind}" type="search" placeholder="Search" value="${esc(s.query)}" style="flex:0 1 260px"></div>
        <div class="pd-list">${shown.map((it, i) => `<div class="pd-row${it.published === false ? ' is-hidden' : ''}">
          ${thumb(kind, it)}
          <div class="pd-main"><div class="pd-title"><strong>${esc(it.title)}</strong><span class="badge badge-plan-${esc(it.plan)}">${it.plan === 'free' ? 'Free' : '🔒 ' + esc(PLANS[it.plan] || it.plan)}</span>${it.published === false ? '<span class="badge">Hidden</span>' : ''}</div>
            <div class="muted sm">${metaText(kind, it)}</div></div>
          <div class="actions pd-actions">
            <button class="btn btn-sm btn-icon" data-pn="up" data-k="${kind}" data-id="${esc(it.id)}" type="button" title="Move up" ${i === 0 || q ? 'disabled' : ''}>↑</button>
            <button class="btn btn-sm btn-icon" data-pn="down" data-k="${kind}" data-id="${esc(it.id)}" type="button" title="Move down" ${i === shown.length - 1 || q ? 'disabled' : ''}>↓</button>
            <button class="btn btn-sm" data-pn="publish" data-k="${kind}" data-id="${esc(it.id)}" type="button">${it.published === false ? 'Publish' : 'Hide'}</button>
            <button class="btn btn-sm btn-primary" data-pn="edit" data-k="${kind}" data-id="${esc(it.id)}" type="button">Edit</button>
            <button class="btn btn-sm btn-danger btn-icon" data-pn="delete" data-k="${kind}" data-id="${esc(it.id)}" type="button" title="Delete">✕</button>
          </div></div>`).join('') || `<div class="empty">${s.items.length ? 'Nothing matches.' : 'Nothing here yet. Press “New ' + esc(K[kind].one) + '”.'}</div>`}</div>
      </div>`;
  }

  /* ───────── the editor ───────── */
  const blank = (kind) => ({ id: '', title: '', plan: 'free', published: true, category: '', level: '', description: '', url: '', duration: '', cover: '', author: '', file: '', pages: 0, summary: '', content: '', exercises: [], artist: '' });
  const field = (label, html, hint) => `<label class="lbl">${label}${html}${hint ? `<span class="muted sm" style="font-weight:400">${hint}</span>` : ''}</label>`;
  const input = (kind, k, v, ph, type) => `<input class="field" data-f="${k}" type="${type || 'text'}" value="${esc(v)}" placeholder="${esc(ph || '')}">`;
  function upload(k, accept, label, v) { return `<div class="pn-upload"><input class="field" data-f="${k}" value="${esc(v)}" placeholder="https://… or upload"><button class="btn btn-sm" type="button" data-pn="upload" data-f2="${k}" data-accept="${accept}">${label}</button></div>`; }
  function editorHtml(kind, d) {
    const cats = `<datalist id="pn-cats-${kind}">${CATS[kind].map((c) => `<option value="${esc(c)}">`).join('')}</datalist>`;
    const common = `<div class="pn-grid3">
      ${field('Category', `<input class="field" data-f="category" list="pn-cats-${kind}" value="${esc(d.category)}" placeholder="e.g. ${esc(CATS[kind][0])}">${cats}`)}
      ${kind !== 'music' ? field('Level (CEFR)', `<select class="field" data-f="level">${LEVELS.map((l) => `<option value="${l}"${d.level === l ? ' selected' : ''}>${l || 'Any level'}</option>`).join('')}</select>`) : '<div></div>'}
      ${field('Who may open it', `<select class="field" data-f="plan">${Object.entries(PLANS).map(([v, n]) => `<option value="${v}"${d.plan === v ? ' selected' : ''}>${v === 'free' ? 'Free — everybody' : n + ' and higher'}</option>`).join('')}</select>`)}
    </div>
    <label class="pn-check"><input type="checkbox" data-f="published"${d.published !== false ? ' checked' : ''}> Shown on the website</label>`;
    let body = '';
    if (kind === 'videos') {
      const v = videoOf(d.url);
      body = `${field('Title *', input(kind, 'title', d.title, 'e.g. IELTS Listening Part 1 — 5 traps'))}
        ${field('YouTube or Vimeo link *', input(kind, 'url', d.url, 'https://www.youtube.com/watch?v=…'), 'A normal, “Unlisted” or Shorts link of YouTube, or a Vimeo link.')}
        <div class="pn-vprev">${v && v.provider === 'youtube' ? `<img src="https://i.ytimg.com/vi/${esc(v.videoId)}/mqdefault.jpg" alt="" referrerpolicy="no-referrer"><span class="muted sm">YouTube video <b>${esc(v.videoId)}</b></span>` : v ? `<span class="muted sm">Vimeo video <b>${esc(v.videoId)}</b></span>` : d.url ? '<span class="pn-warn sm">This is not a YouTube / Vimeo link.</span>' : ''}</div>
        ${field('Description', `<textarea class="field" data-f="description" rows="3" placeholder="What the student learns in this video">${esc(d.description)}</textarea>`)}
        <div class="pn-grid2">${field('Duration', input(kind, 'duration', d.duration, 'e.g. 12:30'))}${field('Cover picture (optional)', upload('cover', 'image/*', 'Upload', d.cover), 'Empty = the YouTube picture. A locked video shows only this picture.')}</div>`;
    } else if (kind === 'books') {
      body = `${field('Title *', input(kind, 'title', d.title, 'e.g. Cambridge IELTS 18 Academic'))}
        <div class="pn-grid2">${field('Author', input(kind, 'author', d.author, 'e.g. Cambridge University Press'))}${field('Pages', input(kind, 'pages', d.pages || '', 'e.g. 140', 'number'))}</div>
        ${field('Description', `<textarea class="field" data-f="description" rows="3" placeholder="What is inside the book">${esc(d.description)}</textarea>`)}
        <div class="pn-grid2">${field('The book (PDF)', upload('file', '.pdf,application/pdf', 'Upload PDF', d.file), 'Or a link to the book on another site (https://…).')}${field('Cover picture', upload('cover', 'image/*', 'Upload', d.cover))}</div>
        ${d.cover ? `<img class="pn-cover-prev" src="${esc(d.cover)}" alt="">` : ''}`;
    } else if (kind === 'grammar') {
      body = `${field('Title *', input(kind, 'title', d.title, 'e.g. Present Perfect vs Past Simple'))}
        ${field('Summary', `<textarea class="field" data-f="summary" rows="2" placeholder="One or two sentences shown on the card">${esc(d.summary)}</textarea>`)}
        ${field('The explanation', `<textarea class="field pn-mono" data-f="content" rows="14" placeholder="## When do we use it?&#10;We use the present perfect for …&#10;&#10;- finished actions with a result now&#10;- experiences (ever, never)&#10;&#10;> I have lost my keys.&#10;! Never use it with a finished time: yesterday, in 2010.&#10;&#10;| Form | Example |&#10;| have + past participle | She has visited Rome. |">${esc(d.content)}</textarea>`,
          'Formatting: <code>## Heading</code> · <code>- bullet</code> · <code>1. numbered</code> · <code>&gt; example</code> · <code>! tip</code> · <code>| a | b |</code> table · <code>**bold**</code> · <code>*italic*</code> · <code>==marked==</code>')}
        <div class="pn-ex-head"><strong>Exercises</strong><span class="muted sm">A choice question: write the options (one per line) and pick the right one. A gap: leave the options empty and type the answer (several right answers: <code>has gone|’s gone</code>). Use <code>____</code> for the gap.</span></div>
        <div class="pn-exs">${(d.exercises || []).map((x, n) => `<div class="pn-ex" data-ex="${n}">
          <div class="pn-ex-n">${n + 1}</div>
          <div class="pn-ex-main">
            <textarea class="field" data-x="q" rows="2" placeholder="She ____ (live) here since 2015.">${esc(x.q)}</textarea>
            <div class="pn-grid2"><textarea class="field" data-x="options" rows="3" placeholder="Options, one per line (empty = a typed answer)">${esc((x.options || []).join('\n'))}</textarea>
              <div style="display:grid;gap:6px"><input class="field" data-x="answer" value="${esc(x.answer)}" placeholder="The right answer"><input class="field" data-x="explain" value="${esc(x.explain)}" placeholder="Why (optional)"></div></div>
          </div>
          <button class="btn btn-sm btn-danger btn-icon" data-pn="ex-del" data-n="${n}" type="button" title="Remove">✕</button></div>`).join('')}</div>
        <button class="btn btn-sm" data-pn="ex-add" type="button">+ Add exercise</button>`;
    } else {
      body = `${field('Title *', input(kind, 'title', d.title, 'e.g. Calm piano for reading'))}
        <div class="pn-grid2">${field('Artist', input(kind, 'artist', d.artist, 'e.g. Lofi Girl'))}${field('Cover picture (optional)', upload('cover', 'image/*', 'Upload', d.cover))}</div>
        ${field('Music file *', upload('url', 'audio/*,.mp3,.m4a,.ogg,.wav', 'Upload music', d.url), 'MP3 is best. Or a direct https:// link to an audio file.')}
        ${d.url ? `<audio class="pn-audio" controls preload="none" src="${esc(d.url)}"></audio>` : ''}`;
    }
    return `<div class="card pd-editor-head"><div class="btn-row" style="justify-content:space-between"><div><div class="eyebrow">${esc(K[kind].name)}</div><strong style="font-size:16px">${d.id ? 'Edit ' + esc(K[kind].one) : 'New ' + esc(K[kind].one)}</strong></div>
        <div class="btn-row"><button class="btn" data-pn="cancel" type="button">Cancel</button><button class="btn btn-primary" data-pn="save" type="button">Save</button></div></div></div>
      <div class="card pn-form">${body}${common}</div>`;
  }
  function renderEditor(kind) { const m = mount(kind); const s = st(kind); if (m && s.draft) m.innerHTML = editorHtml(kind, s.draft); }
  function readForm(kind) {
    const s = st(kind); const m = mount(kind); if (!s.draft || !m) return;
    m.querySelectorAll('[data-f]').forEach((el) => { const k = el.getAttribute('data-f'); s.draft[k] = el.type === 'checkbox' ? el.checked : el.value; });
    if (kind === 'grammar') {
      s.draft.exercises = Array.from(m.querySelectorAll('.pn-ex')).map((row) => {
        const v = (k) => (row.querySelector(`[data-x="${k}"]`) || {}).value || '';
        return { q: v('q'), options: v('options').split('\n').map((o) => o.trim()).filter(Boolean), answer: v('answer').trim(), explain: v('explain') };
      });
    }
  }
  function openEditor(kind, it) {
    const s = st(kind);
    s.draft = { ...blank(kind), ...(it ? JSON.parse(JSON.stringify(it)) : {}) };
    if (kind === 'videos' && it) s.draft.url = videoLink(it);
    s.original = JSON.stringify(s.draft); renderEditor(kind); window.scrollTo(0, 0);
  }
  async function save(kind) {
    const s = st(kind); readForm(kind);
    const btn = mount(kind).querySelector('[data-pn="save"]'); if (btn) btn.disabled = true;
    try {
      const d = await api('/api/admin/panels/' + kind, { method: 'POST', body: JSON.stringify({ item: s.draft }) });
      s.items = d.items; s.draft = null; toast('Saved'); renderList(kind);
    } catch (e) { fail(e); if (btn) btn.disabled = false; }
  }
  async function load(kind) {
    const s = st(kind); if (s.loading) return; s.loading = true; renderList(kind);
    try { s.items = (await api('/api/admin/panels/' + kind)).items; } catch (e) { fail(e); s.items = s.items || []; } finally { s.loading = false; }
    if (!s.draft) renderList(kind);
  }
  function pickFile(accept) {
    return new Promise((resolve) => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept; inp.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(inp);
      const done = (v) => { try { inp.remove(); } catch (e) { /* gone */ } resolve(v); };
      inp.addEventListener('cancel', () => done(null));
      inp.onchange = () => done(inp.files && inp.files[0]);
      inp.click();
    });
  }

  /* ───────── Links ───────── */
  const blankRule = () => ({ id: '', from: '', to: '', note: '', active: true });
  function renderLinks() {
    const m = mount('links'); if (!m) return;
    if (!links) { m.innerHTML = '<div class="card"><div class="empty">Loading…</div></div>'; return; }
    const dirty = JSON.stringify(links) !== linksOriginal;
    m.innerHTML = `
      <div class="pd-hero card">
        <div class="pd-hero-text"><div class="eyebrow">Every page of the website</div><h2>Links</h2>
          <p class="muted">Change a link everywhere at once: write the link as it is on the site now (old) and the link it should be (new). Every page then shows the new link — buttons, the footer, the menu, Telegram / Instagram / e-mail links. A page address of this site (<code>/Price</code>) also opens the new address when somebody visits the old one. A star at the end (<code>https://t.me/old*</code>) changes every link that starts like that.</p></div>
        <div class="btn-row"><button class="btn" data-ln="add" type="button">+ Add link</button><button class="btn btn-primary" data-ln="save" type="button"${dirty && !linksBusy ? '' : ' disabled'}>Save${dirty ? '' : 'd'}</button></div>
      </div>
      <div class="card">
        <div class="table-wrap"><table class="table pn-links"><thead><tr><th>On</th><th>Old link (as on the site now)</th><th></th><th>New link</th><th>Note</th><th></th></tr></thead><tbody>
          ${links.map((r, i) => `<tr data-i="${i}"><td><input type="checkbox" data-l="active"${r.active !== false ? ' checked' : ''} aria-label="On"></td>
            <td><input class="field" data-l="from" value="${esc(r.from)}" placeholder="https://t.me/old_channel  or  /old-page"></td><td class="muted">→</td>
            <td><input class="field" data-l="to" value="${esc(r.to)}" placeholder="https://t.me/new_channel  or  /new-page"></td>
            <td><input class="field" data-l="note" value="${esc(r.note)}" placeholder="e.g. new Telegram"></td>
            <td><button class="btn btn-sm btn-danger btn-icon" data-ln="del" data-i="${i}" type="button" title="Remove">✕</button></td></tr>`).join('') || '<tr><td colspan="6" class="empty">No links changed yet. Press “Add link”.</td></tr>'}
        </tbody></table></div>
        <p class="muted sm" style="margin:12px 0 0">Examples: <code>https://t.me/sh7595</code> → <code>https://t.me/ieltsx_support</code> · <code>mailto:support@ieltsx.com</code> → <code>mailto:help@ielts-x.uz</code> · <code>/study/Tools/Articles</code> → <code>/blog</code>. The admin panel and <code>/api</code> addresses cannot be changed. Changes reach every visitor within about a minute.</p>
      </div>`;
  }
  function readLinks() {
    const m = mount('links'); if (!m || !links) return;
    m.querySelectorAll('tr[data-i]').forEach((tr) => {
      const r = links[Number(tr.getAttribute('data-i'))]; if (!r) return;
      tr.querySelectorAll('[data-l]').forEach((el) => { const k = el.getAttribute('data-l'); r[k] = el.type === 'checkbox' ? el.checked : el.value.trim(); });
    });
  }
  async function loadLinks() {
    if (linksLoading) return; linksLoading = true; renderLinks();
    try { links = (await api('/api/admin/links')).rules; linksOriginal = JSON.stringify(links); } catch (e) { fail(e); links = links || []; } finally { linksLoading = false; }
    renderLinks();
  }

  /* ───────── events ───────── */
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-pn],[data-ln]'); if (!t) return;
    const ln = t.getAttribute('data-ln');
    if (ln) {
      readLinks();
      if (ln === 'add') { links.push(blankRule()); renderLinks(); const rows = mount('links').querySelectorAll('[data-l="from"]'); if (rows.length) rows[rows.length - 1].focus(); return; }
      if (ln === 'del') { links.splice(Number(t.getAttribute('data-i')), 1); renderLinks(); return; }
      if (ln === 'save') {
        linksBusy = true; renderLinks();
        try { const d = await api('/api/admin/links', { method: 'POST', body: JSON.stringify({ rules: links.filter((r) => r.from || r.to) }) }); links = d.rules; linksOriginal = JSON.stringify(links); toast('Links saved'); }
        catch (err) { fail(err); } finally { linksBusy = false; renderLinks(); }
      }
      return;
    }
    const act = t.getAttribute('data-pn');
    const kind = t.getAttribute('data-k') || Object.keys(K).find((k) => mount(k) && mount(k).contains(t)); if (!kind) return;
    const s = st(kind); const id = t.getAttribute('data-id');
    const it = id && s.items ? s.items.find((x) => x.id === id) : null;
    try {
      if (act === 'new') return openEditor(kind, null);
      if (act === 'edit' && it) return openEditor(kind, it);
      if (act === 'cancel') { if (JSON.stringify((readForm(kind), s.draft)) !== s.original && !confirm('Leave without saving?')) return; s.draft = null; return renderList(kind); }
      if (act === 'save') return save(kind);
      if (act === 'ex-add') { readForm(kind); s.draft.exercises.push({ q: '', options: [], answer: '', explain: '' }); renderEditor(kind); const qs = mount(kind).querySelectorAll('[data-x="q"]'); if (qs.length) qs[qs.length - 1].focus(); return; }
      if (act === 'ex-del') { readForm(kind); s.draft.exercises.splice(Number(t.getAttribute('data-n')), 1); return renderEditor(kind); }
      if (act === 'upload') {
        const k = t.getAttribute('data-f2'); const f = await pickFile(t.getAttribute('data-accept'));
        if (!f) return;
        if (!window.IXAdmin || !window.IXAdmin.uploadFile) throw new Error('The uploader is not ready. Reload the page.');
        if (f.size > 100 * 1024 * 1024) throw new Error('File is larger than 100 MB.');
        t.disabled = true; t.textContent = 'Uploading…';
        try { readForm(kind); s.draft[k] = await window.IXAdmin.uploadFile(f); toast('Uploaded ' + f.name); }
        finally { renderEditor(kind); }
        return;
      }
      if (act === 'delete' && it) {
        if (!confirm('Delete “' + it.title + '”? Students will not see it any more.')) return;
        s.items = (await api('/api/admin/panels/' + kind + '/' + encodeURIComponent(it.id), { method: 'DELETE' })).items; toast('Deleted'); return renderList(kind);
      }
      if (act === 'publish' && it) {
        s.items = (await api('/api/admin/panels/' + kind, { method: 'POST', body: JSON.stringify({ item: { ...it, ...(kind === 'videos' ? { url: videoLink(it) } : {}), published: it.published === false } }) })).items;
        toast(it.published === false ? 'Shown on the website' : 'Hidden'); return renderList(kind);
      }
      if ((act === 'up' || act === 'down') && it) {
        const ids = s.items.map((x) => x.id); const i = ids.indexOf(it.id); const j = act === 'up' ? i - 1 : i + 1;
        if (j < 0 || j >= ids.length) return; [ids[i], ids[j]] = [ids[j], ids[i]];
        s.items = (await api('/api/admin/panels/' + kind + '/order', { method: 'POST', body: JSON.stringify({ ids }) })).items; return renderList(kind);
      }
    } catch (err) { fail(err); }
  });
  document.addEventListener('input', (e) => {
    const sk = e.target.getAttribute && e.target.getAttribute('data-pn-search');
    if (sk) { st(sk).query = e.target.value; const pos = e.target.selectionStart; renderList(sk); const f = mount(sk).querySelector('[data-pn-search]'); if (f) { f.focus(); try { f.setSelectionRange(pos, pos); } catch (x) { /* fine */ } } return; }
    // the video link: its preview follows what is typed
    if (e.target.getAttribute && e.target.getAttribute('data-f') === 'url' && mount('videos') && mount('videos').contains(e.target)) {
      const v = videoOf(e.target.value); const box = mount('videos').querySelector('.pn-vprev'); if (!box) return;
      box.innerHTML = v && v.provider === 'youtube' ? `<img src="https://i.ytimg.com/vi/${esc(v.videoId)}/mqdefault.jpg" alt="" referrerpolicy="no-referrer"><span class="muted sm">YouTube video <b>${esc(v.videoId)}</b></span>` : v ? `<span class="muted sm">Vimeo video <b>${esc(v.videoId)}</b></span>` : e.target.value.trim() ? '<span class="pn-warn sm">This is not a YouTube / Vimeo link.</span>' : '';
    }
    if (mount('links') && mount('links').contains(e.target)) { readLinks(); const b = mount('links').querySelector('[data-ln="save"]'); if (b) { const dirty = JSON.stringify(links) !== linksOriginal; b.disabled = !dirty || linksBusy; b.textContent = dirty ? 'Save' : 'Saved'; } }
  });
  document.addEventListener('change', (e) => { if (mount('links') && mount('links').contains(e.target)) e.target.dispatchEvent(new Event('input', { bubbles: true })); });
  window.addEventListener('beforeunload', (e) => {
    const open = Object.keys(K).some((k) => state[k] && state[k].draft && mount(k) && (readForm(k), JSON.stringify(state[k].draft) !== state[k].original));
    if (open || (links && JSON.stringify(links) !== linksOriginal)) { e.preventDefault(); e.returnValue = ''; }
  });
  const onHash = () => {
    const v = (location.hash || '').slice(1).split('?')[0];
    if (K[v] && !st(v).items && !st(v).loading) load(v);
    if (v === 'links' && !links && !linksLoading) loadLinks();
  };
  window.addEventListener('hashchange', onHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onHash); else onHash();
})();
