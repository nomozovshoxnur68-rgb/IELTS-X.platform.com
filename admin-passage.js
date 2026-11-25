/*
 * IELTSX admin: the passage of a Reading test, paragraph by paragraph (used by admin-content.js). Every paragraph has its own
 * place for its letter (A, B, C …) on the left and its text on the right, as on the paper; "Whole text" shows the same passage
 * as one text ("[A] …" starts a lettered paragraph). What is seen here is what the student sees: both use
 * assets/js/passage-core.js.
 */
(() => {
  'use strict';
  const P = () => window.IXPassage;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  let ctx = null;                  // given by admin-content.js: get(path), set(path, text), draft()
  const KINDS = [['p', 'Paragraph'], ['sub', 'Sub-heading'], ['foot', 'Footnote']];
  const store = () => { const d = ctx.draft(); d._pm = d._pm || {}; d._rows = d._rows || {}; return d; };
  const modeOf = (path) => { const d = store(); return d._pm[path] || (String(ctx.get(path) || '').trim() ? 'paras' : 'text'); };
  /* the rows of the passage: kept while they are edited (an unfinished row is not lost), read again when the text changed elsewhere */
  function rowsOf(path) {
    const d = store(), text = String(ctx.get(path) || ''); const have = d._rows[path];
    if (have && have.text === text) return have.rows;
    const rows = P().split(text).map((r) => ({ l: r.l, k: r.k, t: String(r.t).replace(/\s*\n\s*/g, ' ') }));
    d._rows[path] = { text, rows }; return rows;
  }
  function write(path, rows) { const text = P().join(rows); store()._rows[path] = { text, rows }; ctx.set(path, text); }
  const isLead = (r, i, rows) => i === 0 && rows.length > 2 && r.t.length < 200 && !/[.!?]["'”’)]?$/.test(r.t);
  function summary(rows) {
    const ps = rows.filter((r) => r.k === 'p' && r.t).length, ls = rows.map((r) => r.l).filter(Boolean); const twice = ls.filter((l, i) => ls.indexOf(l) !== i);
    return ps + ' paragraph' + (ps === 1 ? '' : 's') + ' · ' + (ls.length ? 'letters ' + (ls.length > 1 ? ls[0] + '–' + ls[ls.length - 1] + ' (' + ls.length + ')' : ls[0]) : 'no letters') + (twice.length ? ' · <span class="pn-warn">' + esc(twice.join(', ')) + ' is there twice</span>' : '');
  }
  function rowHtml(r, i, n, rows) {
    const dup = r.l && rows.some((x, j) => j !== i && x.l === r.l);
    return `<div class="ps-row${r.l ? ' has-l' : ''}${r.k === 'sub' ? ' is-sub' : r.k === 'foot' ? ' is-foot' : ''}" data-i="${i}">
      <div class="ps-side"><input class="field ps-l${dup ? ' dup' : ''}" data-ps-l maxlength="2" value="${esc(r.l)}" placeholder="–" aria-label="Letter of this paragraph"${r.k === 'p' ? '' : ' disabled'} title="The letter of this paragraph (empty = none)"><button class="ps-seq" type="button" data-ps="seq" title="A, B, C … from here on"${r.k === 'p' ? '' : ' hidden'}>↓ABC</button></div>
      <textarea class="field ps-t" data-ps-t rows="${Math.min(12, Math.max(1, Math.ceil(r.t.length / 105)))}" placeholder="The text of the paragraph">${esc(r.t)}</textarea>
      <div class="ps-act"><select class="field" data-ps-k aria-label="What this is">${KINDS.map(([v, l]) => `<option value="${v}"${r.k === v ? ' selected' : ''}>${l}</option>`).join('')}</select>
        <div class="ps-btns"><button class="btn btn-sm" type="button" data-ps="up" title="Move up"${i ? '' : ' disabled'}>↑</button><button class="btn btn-sm" type="button" data-ps="down" title="Move down"${i < n - 1 ? '' : ' disabled'}>↓</button><button class="btn btn-sm" type="button" data-ps="join" title="Join with the paragraph above"${i ? '' : ' disabled'}>⤒</button><button class="btn btn-sm" type="button" data-ps="cut" title="Split at the cursor: the text after it becomes a new paragraph">✂</button><button class="btn btn-sm btn-danger" type="button" data-ps="del" title="Take out">✕</button></div></div></div>`;
  }
  /* o: { label, ph, rows, head } */
  function html(path, o) {
    o = o || {}; const mode = modeOf(path); const text = String(ctx.get(path) || '');
    const rows = mode === 'paras' ? rowsOf(path) : [];
    const body = mode === 'text'
      ? `<textarea class="field cb-passage" rows="${o.rows || 14}" data-p="${esc(path)}" data-ps-whole placeholder="${esc(o.ph || 'Paste the passage here. Leave an empty line between paragraphs.')}">${esc(text)}</textarea>`
      : `<div class="ps-tools"><button class="btn btn-sm btn-primary" type="button" data-ps="auto">A, B, C … to every paragraph</button><button class="btn btn-sm" type="button" data-ps="none">No letters</button><span class="muted sm ps-sum">${summary(rows)}</span></div>
        <div class="ps-headrow"><span>Letter</span><span>Text of the paragraph</span></div>
        <div class="ps-list">${rows.map((r, i) => rowHtml(r, i, rows.length, rows)).join('') || '<div class="muted sm">No text yet: paste the passage in “Whole text”, or add a paragraph.</div>'}</div>
        <button class="btn btn-sm" type="button" data-ps="add">+ Paragraph</button>`;
    return `<div class="cb-block ps-ed" data-path="${esc(path)}"><div class="cb-head"><div><strong>${o.label || 'Passage text *'}</strong><div class="muted sm">${mode === 'text' ? 'Paste the whole passage, then press <b>Paragraphs A, B, C</b> to set the letters. <code>[A]</code> at the start of a paragraph gives it a letter, <code>##</code> = a sub-heading, <code>*</code> = a footnote.' : 'Each paragraph has its own place for its letter. An empty letter = the paragraph has none.'}</div></div>
      <div class="ps-modes" role="tablist"><button class="cb-step${mode === 'text' ? ' on' : ''}" type="button" role="tab" aria-selected="${mode === 'text'}" data-ps="m-text">Whole text</button><button class="cb-step${mode === 'paras' ? ' on' : ''}" type="button" role="tab" aria-selected="${mode === 'paras'}" data-ps="m-paras">Paragraphs A, B, C</button></div></div>${o.head || ''}${body}</div>`;
  }
  const opts = new Map();          // path -> how it was drawn
  const block = (path, o) => { opts.set(path, o || {}); return html(path, o); };
  function redraw(path, focus) {
    const ed = document.querySelector('.ps-ed[data-path="' + path + '"]'); if (!ed) return;
    const top = ed.parentElement.closest('#builder-body'); const st = top ? top.scrollTop : 0;
    const box = document.createElement('div'); box.innerHTML = html(path, opts.get(path)); ed.replaceWith(box.firstElementChild); if (top) top.scrollTop = st;
    if (focus) { const el = document.querySelector('.ps-ed[data-path="' + path + '"] .ps-row[data-i="' + focus[0] + '"] ' + (focus[1] || '.ps-t')); if (el) { el.focus({ preventScroll: true }); if (focus[2] !== undefined) try { el.setSelectionRange(focus[2], focus[2]); } catch (e) { /* fine */ } } }
  }
  function note(ed, rows) { const s = ed.querySelector('.ps-sum'); if (s) s.innerHTML = summary(rows); ed.querySelectorAll('.ps-l').forEach((x, i) => { const l = rows[i] && rows[i].l; x.classList.toggle('dup', !!l && rows.some((r, j) => j !== i && r.l === l)); x.closest('.ps-row').classList.toggle('has-l', !!l); }); }
  function letterFrom(rows, i, first) {   // A, B, C … to the paragraphs from row i on
    const base = first && /^[A-Z]$/.test(first) ? first.charCodeAt(0) - 65 : 0; let n = base;
    for (let k = i; k < rows.length; k++) if (rows[k].k === 'p' && rows[k].t && !(k === 0 && isLead(rows[0], 0, rows))) rows[k].l = P().letterAt(n++);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-ps]'); if (!t || !ctx) return; const ed = t.closest('.ps-ed'); if (!ed) return;
    const path = ed.dataset.path, act = t.dataset.ps, row = t.closest('.ps-row'), i = row ? Number(row.dataset.i) : -1;
    if (act === 'm-text' || act === 'm-paras') { store()._pm[path] = act === 'm-text' ? 'text' : 'paras'; return redraw(path); }
    const rows = rowsOf(path);
    if (act === 'auto') { rows.forEach((r) => { r.l = ''; }); letterFrom(rows, 0); write(path, rows); return redraw(path); }
    if (act === 'none') { rows.forEach((r) => { r.l = ''; }); write(path, rows); return redraw(path); }
    if (act === 'add') { const last = rows.filter((r) => r.l).pop(); rows.push({ l: last && /^[A-Y]$/.test(last.l) ? String.fromCharCode(last.l.charCodeAt(0) + 1) : '', k: 'p', t: '' }); write(path, rows); store()._rows[path] = { text: String(ctx.get(path) || ''), rows }; return redraw(path, [rows.length - 1]); }
    if (i < 0 || !rows[i]) return;
    if (act === 'seq') { letterFrom(rows, i, rows[i].l || (rows.slice(0, i).map((r) => r.l).filter(Boolean).length ? P().letterAt(rows.slice(0, i).filter((r) => r.l).length) : 'A')); write(path, rows); return redraw(path); }
    if (act === 'up' || act === 'down') { const j = act === 'up' ? i - 1 : i + 1; if (!rows[j]) return; [rows[i], rows[j]] = [rows[j], rows[i]]; write(path, rows); return redraw(path); }
    if (act === 'join' && i) { const at = rows[i - 1].t.length + 1; rows[i - 1].t = (rows[i - 1].t + ' ' + rows[i].t).trim(); if (!rows[i - 1].l) rows[i - 1].l = rows[i].l; rows.splice(i, 1); write(path, rows); return redraw(path, [i - 1, '.ps-t', at]); }
    if (act === 'cut') { const ta = row.querySelector('.ps-t'), at = ta.selectionStart; const a = rows[i].t.slice(0, at).trim(), b = rows[i].t.slice(at).trim(); if (!a || !b) { ta.focus(); return ctx.toast('Put the cursor where the new paragraph begins, then press ✂.', true); } rows[i].t = a; rows.splice(i + 1, 0, { l: '', k: 'p', t: b }); write(path, rows); return redraw(path, [i + 1, '.ps-t', 0]); }
    if (act === 'del') { if (rows[i].t.length > 40 && !confirm('Take out this paragraph?')) return; rows.splice(i, 1); write(path, rows); return redraw(path); }
  });
  document.addEventListener('input', (e) => {
    const el = e.target; if (!ctx || !el.hasAttribute) return; const ed = el.closest('.ps-ed'), row = el.closest('.ps-row'); if (!ed || !row) return;
    const path = ed.dataset.path, rows = rowsOf(path), r = rows[Number(row.dataset.i)]; if (!r) return;
    if (el.hasAttribute('data-ps-l')) { const v = P().cleanLetter(el.value); if (el.value !== v) el.value = v; r.l = v; }
    else if (el.hasAttribute('data-ps-t')) { r.t = el.value.replace(/\s*\n\s*/g, ' '); }
    else if (el.hasAttribute('data-ps-k')) { r.k = el.value; if (r.k !== 'p') r.l = ''; write(path, rows); return redraw(path); }
    else return;
    write(path, rows); note(ed, rows);
  });
  // several paragraphs pasted into one row become rows of their own
  document.addEventListener('paste', (e) => {
    const el = e.target; if (!ctx || !el.hasAttribute || !el.hasAttribute('data-ps-t')) return; const text = (e.clipboardData && e.clipboardData.getData('text')) || ''; if (!/\n\s*\n/.test(text.trim())) return;
    e.preventDefault(); const ed = el.closest('.ps-ed'), path = ed.dataset.path, rows = rowsOf(path), i = Number(el.closest('.ps-row').dataset.i);
    const add = P().split(text).map((x) => ({ l: x.l, k: x.k, t: String(x.t).replace(/\s*\n\s*/g, ' ') })); if (!add.length) return;
    if (!rows[i].t.trim()) { if (!add[0].l) add[0].l = rows[i].l; rows.splice(i, 1, ...add); } else rows.splice(i + 1, 0, ...add);
    write(path, rows); redraw(path, [i]);
  });
  // Enter in a letter goes to the next letter
  document.addEventListener('keydown', (e) => { if (e.key !== 'Enter' || !e.target.hasAttribute || !e.target.hasAttribute('data-ps-l')) return; e.preventDefault(); const all = Array.from(e.target.closest('.ps-ed').querySelectorAll('.ps-l:not(:disabled)')); const n = all[all.indexOf(e.target) + 1]; if (n) { n.focus(); n.select(); } });

  window.IXPassageEditor = { init: (c) => { ctx = c; }, block, redraw };
})();
