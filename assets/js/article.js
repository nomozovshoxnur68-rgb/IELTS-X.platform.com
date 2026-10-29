/* IELTSX — one article page (assets/js/article.js)
   Used by every article: the saved ones (collections/article-N.html keep their text in the HTML and their
   word list in <script type="application/json" id="article-data">) and the ones added in the admin panel
   (collections/article?id=..., text and words come from /api/materials/<id>). Both get the same look,
   the same Read / Review tabs, reader settings and word pop-up.
   The page shell (sidebar, header, light/dark) is handled by app.js like on every other page. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pref = {
    get(k, d) { try { return localStorage.getItem('ixa:' + k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('ixa:' + k, v); } catch (e) { /* private mode */ } }
  };

  const root = $('#ixa');
  if (!root) return;
  const readBody = $('#article-content');
  const reviewBody = $('#article-content-review');
  let items = [];
  let openIndex = -1;

  /* ───────── data ───────── */
  // admin articles keep vocabulary and grammar apart; the page works with one list (V1.., G1..)
  function itemsFromMaterial(d) {
    const vocab = (d.vocabulary || []).map((v, i) => ({
      id: 'v' + (i + 1), type: 'vocabulary', marker: 'V' + (i + 1), title: v.word, match: v.match,
      definition: v.definition, definition_uz: v.definition_uz, definition_ru: v.definition_ru,
      synonyms: v.synonyms || [], example: v.example, sourceContext: v.sourceContext
    }));
    const grammar = (d.grammar || []).map((g, i) => ({
      id: 'g' + (i + 1), type: 'grammar', marker: 'G' + (i + 1), title: g.title, match: g.match, pattern: g.pattern,
      explanation: g.explanation, explanation_uz: g.explanation_uz, explanation_ru: g.explanation_ru,
      example: g.example, sourceContext: g.sourceContext
    }));
    return vocab.concat(grammar).filter((x) => x.title);
  }

  const fmtDate = (v) => {
    if (!v) return '';
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(v)) return v;
    const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (day) return `${day[3]}.${day[2]}.${day[1]}`;
    const d = new Date(v);
    return isNaN(d) ? String(v) : [d.getDate(), d.getMonth() + 1].map((n) => String(n).padStart(2, '0')).join('.') + '.' + d.getFullYear();
  };
  const ICON_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>';

  /** Builds the header, text and references of an admin article in the same markup the saved articles use. */
  function renderMaterial(m) {
    const d = m.data || {};
    document.title = 'IELTSX — ' + m.title;
    const crumb = $('#ixa-crumb'); if (crumb) crumb.textContent = m.title;
    const tags = [d.topic, d.level, d.category || 'Academic Reading'].filter(Boolean);
    $('#ixa-head-col').innerHTML =
      `<div class="ixa-tags">${tags.map((t, i) => `<span class="ixa-tag${i === 0 && d.topic ? ' ixa-tag--topic' : ''}">${esc(t)}</span>`).join('')}</div>
       <h1 class="ixa-title">${esc(m.title)}</h1>
       ${d.lead || m.description ? `<p class="ixa-lead">${esc(d.lead || m.description)}</p>` : ''}
       <div class="ixa-meta"><span class="ixa-author">${esc(d.author || 'IELTSX Reading Team')}</span><span>${esc(fmtDate(d.date || m.createdAt))}</span>${d.testDate ? `<span>${ICON_CAL}Test date: ${esc(fmtDate(d.testDate))}</span>` : ''}</div>`;

    let html = d.imageUrl ? `<figure class="ixa-figure"><img src="${esc(d.imageUrl)}" alt="${esc(d.imageAlt || m.title)}">${d.imageCaption ? `<figcaption>${esc(d.imageCaption)}</figcaption>` : ''}</figure>` : '';
    // a paragraph that is only ![caption](picture url) is a picture inside the text ("Insert picture" in the admin panel)
    const picUrl = (u) => ((/^\/(uploads|assets)\//.test(u) && !u.includes('..')) || /^\/api\/media\/[A-Za-z0-9_-]{8,40}$/.test(u) || /^https:\/\/[^\s"'<>]+$/i.test(u) ? u : '');
    String(d.body || '').replace(/\r/g, '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).forEach((b) => {
      const h = /^#{1,3}\s+(.+)$/.exec(b), img = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(b);
      if (img && picUrl(img[2])) html += `<figure class="ixa-figure"><img src="${esc(picUrl(img[2]))}" alt="${esc(img[1] || m.title)}" loading="lazy">${img[1] ? `<figcaption>${esc(img[1])}</figcaption>` : ''}</figure>`;
      else html += h && !b.includes('\n') ? `<h3>${esc(h[1])}</h3>` : `<p>${esc(b).replace(/\n/g, '<br>')}</p>`;
    });
    readBody.innerHTML = html;
    $('#ixa-source').textContent = d.source || m.title;
  }

  /* ───────── highlights ─────────
     A word in the list that is not underlined in the text yet gets underlined at its first appearance
     (item.match, else the word itself; grammar may also use its quoted source sentence). */
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function matcher(phrase) {
    const body = reEsc(phrase.trim()).replace(/\s+/g, '\\s+').replace(/['’‘]/g, "['’‘]").replace(/["“”]/g, '["“”]');
    try { return new RegExp('(^|[^\\p{L}\\p{N}])(' + body + ')(?![\\p{L}\\p{N}])', 'iu'); } catch (e) { return null; }
  }
  // text inside <p> that is not underlined yet (a word may still sit inside a grammar phrase)
  function textNodes(container, insideGrammarOk) {
    const out = [];
    const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || !p.closest('p') || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (p.closest('.ix-hl--vocab') || (!insideGrammarOk && p.closest('.ix-hl'))) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walk.nextNode()) out.push(walk.currentNode);
    return out;
  }
  function wrap(node, start, len, item) {
    const range = document.createRange();
    range.setStart(node, start); range.setEnd(node, start + len);
    const span = document.createElement('span');
    span.className = 'ix-hl ix-hl--' + (item.type === 'grammar' ? 'grammar' : 'vocab');
    span.dataset.itemId = item.id;
    range.surroundContents(span);
    return span;
  }
  function autoHighlight() {
    const present = new Set($$('[data-item-id]', readBody).map((el) => el.dataset.itemId));
    // grammar first: a grammar phrase may contain a highlighted word, not the other way round
    const todo = items.filter((it) => !present.has(it.id)).sort((a, b) => (a.type === 'grammar' ? 0 : 1) - (b.type === 'grammar' ? 0 : 1));
    for (const it of todo) {
      const phrases = [it.match, it.type === 'vocabulary' ? it.title : '', it.type === 'grammar' && String(it.sourceContext || '').length <= 140 ? it.sourceContext : '']
        .map((p) => String(p || '').replace(/^["“]|["”]$/g, '').trim()).filter((p) => p.length > 1);
      let done = false;
      for (const phrase of phrases) {
        const re = matcher(phrase); if (!re) continue;
        for (const n of textNodes(readBody, it.type === 'vocabulary')) {
          const m = re.exec(n.nodeValue);
          if (m) { wrap(n, m.index + m[1].length, m[2].length, it); done = true; break; }
        }
        if (done) break;
      }
    }
  }
  // the sentence around the first highlight, for items that came without one
  function fillContext() {
    for (const it of items) {
      if (it.sourceContext) continue;
      const el = $(`[data-item-id="${it.id}"]`, readBody); if (!el) continue;
      const p = el.closest('p'); if (!p) continue;
      const text = p.textContent; const word = el.textContent;
      const at = text.indexOf(word);
      const from = Math.max(text.lastIndexOf('. ', at) + 1, text.lastIndexOf('? ', at) + 1, text.lastIndexOf('! ', at) + 1, 0);
      const ends = ['. ', '? ', '! '].map((s) => text.indexOf(s, at + word.length)).filter((i) => i > -1);
      it.sourceContext = text.slice(from, ends.length ? Math.min(...ends) + 1 : text.length).trim();
    }
  }
  function decorate(container) {
    $$('[data-item-id]', container).forEach((el) => {
      const it = items.find((x) => x.id === el.dataset.itemId);
      if (!it) { el.replaceWith(...el.childNodes); return; }
      el.classList.add('ix-hl', 'ix-hl--' + (it.type === 'grammar' ? 'grammar' : 'vocab'));
      el.setAttribute('role', 'button'); el.tabIndex = 0;
      el.title = it.marker + ' · ' + it.title;
    });
  }

  /* ───────── tabs + reader settings ───────── */
  function setTab(tab) {
    const review = tab === 'review';
    $('#tab-panel-read').hidden = review;
    $('#tab-panel-review').hidden = !review;
    $('#tab-trigger-read').setAttribute('aria-selected', String(!review));
    $('#tab-trigger-review').setAttribute('aria-selected', String(review));
    if (review && !reviewBody.childNodes.length) {
      reviewBody.innerHTML = readBody.innerHTML;
      $$('[id]', reviewBody).forEach((el) => el.removeAttribute('id'));
      applyReader();
      renderSide();
    }
  }
  function applyReader() {
    const size = pref.get('size', 'comfortable'), style = pref.get('style', 'sans');
    [readBody, reviewBody].forEach((el) => {
      el.classList.remove('size-comfortable', 'size-large', 'size-extra', 'style-sans', 'style-serif');
      el.classList.add('size-' + size, 'style-' + style);
    });
    $$('[data-size]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.size === size)));
    $$('[data-style]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.style === style)));
  }

  const ICON_BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>';
  const ICON_CAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>';
  function renderSide() {
    const box = $('#review-sidebar-content'); if (!box) return;
    const group = (type, label, icon) => {
      const list = items.filter((i) => i.type === type); if (!list.length) return '';
      const chip = type === 'grammar' ? 'grammar' : 'vocab';
      return `<div class="ixa-side-sec"><div class="ixa-side-label">${icon}${label} (${list.length})</div><div class="ixa-side-list">${list.map((i) =>
        `<button class="ixa-item" type="button" data-item-id="${esc(i.id)}"><span class="ixa-chip ixa-chip--${chip}">${esc(i.marker)}</span><span class="ixa-item-title">${esc(i.title)}</span></button>`).join('')}</div></div>`;
    };
    box.innerHTML = (group('vocabulary', 'Vocabulary', ICON_BOOK) + group('grammar', 'Grammar', ICON_CAP)) || '<p class="ixa-empty">No review highlights available.</p>';
  }

  /* ───────── pop-up ───────── */
  const modal = $('#modal-overlay');
  function openItem(i) {
    const it = items[i]; if (!it) return;
    openIndex = i;
    const vocab = it.type !== 'grammar';
    $('#modal-header').innerHTML = `<span class="ixa-badge ixa-badge--${vocab ? 'vocab' : 'grammar'}">${vocab ? 'Vocabulary' : 'Grammar'}</span><span class="ixa-badge ixa-badge--marker">${esc(it.marker)}</span>`;
    $('#modal-title').textContent = it.title;
    const tr = (uz, ru) => (uz || ru) ? `<div class="ixa-tr">${uz ? `<p><b>🇺🇿 Oʻzbekcha:</b> ${esc(uz)}</p>` : ''}${ru ? `<p><b>🇷🇺 Русский:</b> ${esc(ru)}</p>` : ''}</div>` : '';
    let html = '';
    if (it.definition) html += `<p class="ixa-def">${esc(it.definition)}</p>` + tr(it.definition_uz, it.definition_ru);
    if (it.synonyms && it.synonyms.length) html += `<div class="ixa-box"><div class="ixa-box-label">Synonyms</div><div class="ixa-box-text">${esc(it.synonyms.join(', '))}</div></div>`;
    if (it.pattern) html += `<div class="ixa-box ixa-pattern">${esc(it.pattern)}</div>`;
    if (it.explanation) html += `<p class="ixa-def">${esc(it.explanation)}</p>` + tr(it.explanation_uz, it.explanation_ru);
    if (it.example) html += `<blockquote class="ixa-example">${esc(it.example)}</blockquote>`;
    if (it.sourceContext) html += `<div class="ixa-context">${esc(it.sourceContext)}</div>`;
    $('#modal-body').innerHTML = html;
    $('#modal-prev').disabled = i <= 0;
    $('#modal-next').disabled = i >= items.length - 1;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#modal-close-btn').focus();
  }
  function closeItem() { modal.hidden = true; document.body.style.overflow = ''; openIndex = -1; }

  /* ───────── events ───────── */
  function bind() {
    $('#tab-trigger-read').addEventListener('click', () => setTab('read'));
    $('#tab-trigger-review').addEventListener('click', () => setTab('review'));
    $$('[data-size]', root).forEach((b) => b.addEventListener('click', () => { pref.set('size', b.dataset.size); applyReader(); }));
    $$('[data-style]', root).forEach((b) => b.addEventListener('click', () => { pref.set('style', b.dataset.style); applyReader(); }));
    root.addEventListener('click', (e) => {
      const el = e.target.closest('[data-item-id]'); if (!el) return;
      e.stopPropagation(); openItem(items.findIndex((x) => x.id === el.dataset.itemId));
    });
    root.addEventListener('keydown', (e) => {
      const el = e.target.closest('.ix-hl'); if (!el || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault(); openItem(items.findIndex((x) => x.id === el.dataset.itemId));
    });
    $('#modal-close-btn').addEventListener('click', closeItem);
    $('#modal-prev').addEventListener('click', () => openItem(openIndex - 1));
    $('#modal-next').addEventListener('click', () => openItem(openIndex + 1));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeItem(); });
    document.addEventListener('keydown', (e) => {
      if (modal.hidden) return;
      if (e.key === 'Escape') closeItem();
      else if (e.key === 'ArrowRight' && openIndex < items.length - 1) openItem(openIndex + 1);
      else if (e.key === 'ArrowLeft' && openIndex > 0) openItem(openIndex - 1);
    });
  }

  // a missing picture must not leave an empty box floating next to the text
  function guardFigure() {
    $$('.ixa-figure img', readBody).forEach((img) => {
      const drop = () => img.closest('.ixa-figure')?.remove();
      if (img.complete && !img.naturalWidth) drop(); else img.addEventListener('error', drop);
    });
  }

  function start() {
    guardFigure();
    decorate(readBody);
    autoHighlight();
    fillContext();
    decorate(readBody);
    applyReader();
    bind();
    setTab('read');
  }

  function showState(html) {
    $('#ixa-head-col').innerHTML = '';
    $('.ixa-toolbar', root).hidden = true;
    $('#tab-panel-read').innerHTML = `<div class="ixa-state">${html}</div>`;
  }

  async function init() {
    const embedded = $('#article-data');
    if (embedded) {
      try { items = JSON.parse(embedded.textContent).reviewItems || []; } catch (e) { items = []; }
      return start();
    }
    const id = new URLSearchParams(location.search).get('id');
    if (!id) return showState('<h2>No article selected</h2><p><a href="/study/Tools/Articles">Browse all articles</a></p>');
    let r, d;
    try { r = await fetch('/api/materials/' + encodeURIComponent(id), { credentials: 'same-origin' }); d = await r.json().catch(() => ({})); }
    catch (e) { return showState('<h2>Cannot reach the server</h2><p>Check your connection and <a href="">try again</a>.</p>'); }
    if (r.status === 401) return showState(`<h2>Please sign in</h2><p>Sign in to read this article.</p><p><a href="/login?next=${encodeURIComponent(location.pathname + location.search)}">Sign in</a></p>`);
    if (r.status === 403) {
      const plan = (/\b(Standard|Max|Ultra)\b/.exec(d.error || '') || [])[1];
      return showState(`<h2>🔒 ${esc(plan ? plan + ' article' : 'Premium article')}</h2><p>${esc(d.error || 'This article is for Premium members.')}</p><p><a href="/Price?premium=required${plan ? '&plan=' + plan.toLowerCase() : ''}&next=${encodeURIComponent(location.pathname + location.search)}">See plans</a></p>`);
    }
    if (!r.ok || !d.item || d.item.type !== 'article') return showState(`<h2>Article not found</h2><p>${esc(d.error || 'It may have been removed.')}</p><p><a href="/study/Tools/Articles">Browse all articles</a></p>`);
    renderMaterial(d.item);
    items = itemsFromMaterial(d.item.data || {});
    start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
