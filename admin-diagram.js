/*
 * IELTSX admin: the editor of a "Label the diagram" block (Reading and Listening), used by admin-content.js. The picture is
 * shown as the student will see it (assets/js/diagram-core.js + assets/css/diagram.css) and edited in place:
 *   + Label / + Box     a text with boxes (____) and an arrow, or only a box on the picture; a double press on the picture too
 *   drag                the label; its right edge = its width; the two dots = the ends of its arrow; arrow keys move it a little
 *   space around        free space around the picture for the labels (they stay at their place on the picture)
 *   the picture         uploaded, pasted (Ctrl+V), dropped, or chosen from the pictures of the test
 * Every ____ is one question, numbered label by label (↑ ↓ change the order). The model lives in group.dg.
 */
(() => {
  'use strict';
  const D = () => window.IXDiagram;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(v * 100) / 100));
  let ctx = null;                        // given by admin-content.js: group, from, changed, upload, pick, images, toast
  const picked = new Map();              // group -> the chosen label
  const SPACES = [['none', 'No space', [0, 0, 0, 0]], ['sides', 'Left and right', [0, 45, 0, 45]], ['ends', 'Above and below', [26, 0, 26, 0]], ['all', 'All round', [24, 42, 24, 42]]];
  const spaceOf = (pad) => (SPACES.find((s) => s[2].join() === pad.join()) || ['own'])[0];
  const modelOf = (g) => { if (!g.dg) g.dg = D().read(g.diagram) || D().read({}); return g.dg; };
  const edOf = (gi) => document.querySelector('.dg-ed[data-g="' + gi + '"]');
  const giOf = (el) => { const ed = el && el.closest && el.closest('.dg-ed'); return ed ? Number(ed.dataset.g) : -1; };
  const cur = (gi) => (picked.has(gi) ? picked.get(gi) : -1);

  /* ───────── the editor ───────── */
  function html(g, gi, from) {
    const d = modelOf(g); const imgs = ctx.images().filter((u) => u && u !== d.img);
    return `<div class="dg-ed" data-g="${gi}">
      <div class="cb-thelp">The picture as the student will see it. <b>Drag</b> a label to its place, its right edge to make it wider, the two dots to set its arrow. <code>____</code> = a box for an answer: every box is one question. Press the picture twice for a new label; <b>Ctrl+V</b> pastes a picture.</div>
      <div class="dg-bar">
        <button class="btn btn-sm${d.img ? '' : ' btn-primary'}" type="button" data-dg="pic">⬆ ${d.img ? 'Change the picture' : 'Upload the picture'}</button>
        ${imgs.length ? `<select class="field" data-dg-pick aria-label="A picture of this test"><option value="">or a picture of this test…</option>${imgs.map((u, i) => `<option value="${esc(u)}">Picture ${i + 1}: ${esc(u.split('/').pop().slice(-28))}</option>`).join('')}</select>` : ''}
        <span class="dg-sep"></span><button class="btn btn-sm btn-primary" type="button" data-dg="add">+ Label with an arrow</button><button class="btn btn-sm" type="button" data-dg="gap">+ Box on the picture</button>
        <span class="dg-sep"></span><label class="dg-l">Space around <select class="field" data-dg-space>${SPACES.map(([k, l]) => `<option value="${k}"${spaceOf(d.pad) === k ? ' selected' : ''}>${l}</option>`).join('')}${spaceOf(d.pad) === 'own' ? '<option value="own" selected>Own</option>' : ''}</select></label>
        ${[['↑', 0], ['→', 1], ['↓', 2], ['←', 3]].map(([s, k]) => `<label class="dg-l" title="${['Above', 'On the right', 'Below', 'On the left'][k]}, % of the picture">${s}<input class="field dg-pad" type="number" min="0" max="150" step="5" data-dg-pad="${k}" value="${d.pad[k]}"></label>`).join('')}</div>
      <div class="dg-canvas" tabindex="0" aria-label="The diagram"></div>
      <div class="muted sm dg-status" aria-live="polite"></div>
      <div class="dg-list">${rows(g, gi, from)}</div></div>`;
  }
  function rows(g, gi, from) {
    const d = modelOf(g); let n = from;
    if (!d.labels.length) return '<div class="muted sm">No labels yet. Press “+ Label with an arrow”, or the picture twice.</div>';
    return d.labels.map((b, i) => {
      const k = (String(b.t).match(D().GAP) || []).length; const no = k ? (k > 1 ? n + '–' + (n + k - 1) : String(n)) : '—'; n += k;
      return `<div class="dg-row${cur(gi) === i ? ' on' : ''}" data-li="${i}"><span class="dg-no" title="${k ? 'Question ' + no : 'No box: only text'}">${no}</span>
        <textarea class="field" rows="2" data-dg-t placeholder="The text of the label, ____ for the box">${esc(b.t)}</textarea>
        <div class="dg-act"><button class="btn btn-sm" type="button" data-dg="ins" title="Put a box in the text">____</button><button class="btn btn-sm${b.line ? ' is-on' : ''}" type="button" data-dg="line" aria-pressed="${!!b.line}" title="Arrow">↗</button><button class="btn btn-sm" type="button" data-dg="up" title="Earlier number"${i ? '' : ' disabled'}>↑</button><button class="btn btn-sm" type="button" data-dg="down" title="Later number"${i < d.labels.length - 1 ? '' : ' disabled'}>↓</button><button class="btn btn-sm" type="button" data-dg="dup" title="Copy">⧉</button><button class="btn btn-sm btn-danger" type="button" data-dg="del" title="Take out">✕</button></div></div>`;
    }).join('');
  }
  function draw(gi) {
    const ed = edOf(gi), g = ctx.group(gi); if (!ed || !g) return;
    const d = modelOf(g), cv = ed.querySelector('.dg-canvas'); const from = ctx.from(gi);
    cv.innerHTML = D().html(d, from, (n) => `<span class="dg-fake">${n}</span>`) + (d.img ? '' : '<div class="dg-nopic">Upload, paste or drop the picture of the diagram</div>');
    const box = cv.querySelector('.ix-dg-in');
    cv.querySelectorAll('.ix-dg-label').forEach((el) => { const li = Number(el.dataset.li); el.classList.toggle('on', cur(gi) === li); const w = document.createElement('i'); w.className = 'dg-w'; w.dataset.h = 'w'; w.dataset.li = li; w.title = 'Width'; el.appendChild(w); });
    d.labels.forEach((b, li) => { if (b.line) ['s', 'e'].forEach((h) => { const dot = document.createElement('i'); dot.className = 'dg-dot dg-dot-' + h + (cur(gi) === li ? ' on' : ''); dot.dataset.h = h; dot.dataset.li = li; dot.title = h === 's' ? 'Beginning of the arrow' : 'End of the arrow'; box.appendChild(dot); }); });
    place(gi);
  }
  /* the positions only (while dragging) */
  function place(gi) {
    const ed = edOf(gi), g = ctx.group(gi); if (!ed || !g) return; const d = modelOf(g);
    ed.querySelectorAll('.ix-dg-label').forEach((el) => { const b = d.labels[Number(el.dataset.li)]; if (b) { el.style.left = b.x + '%'; el.style.top = b.y + '%'; el.style.width = b.w + '%'; } });
    ed.querySelectorAll('.dg-dot').forEach((el) => { const b = d.labels[Number(el.dataset.li)]; if (b && b.line) { const s = el.dataset.h === 's' ? 0 : 2; el.style.left = b.line[s] + '%'; el.style.top = b.line[s + 1] + '%'; } });
    const svg = ed.querySelector('.ix-dg-lines'); if (svg) svg.innerHTML = D().lines(d);
  }
  function choose(gi, li, scroll) {
    picked.set(gi, li); const ed = edOf(gi); if (!ed) return;
    ed.querySelectorAll('.ix-dg-label,.dg-row,.dg-dot').forEach((el) => el.classList.toggle('on', Number(el.dataset.li) === li));
    if (scroll) { const r = ed.querySelector('.dg-row[data-li="' + li + '"]'); if (r) r.scrollIntoView({ block: 'nearest' }); }
  }
  const mount = () => document.querySelectorAll('.dg-ed').forEach((ed) => draw(Number(ed.dataset.g)));
  /* the list of labels and the picture again (a label was added, moved in the order, taken out) */
  function redo(gi, focusLi) {
    const ed = edOf(gi), g = ctx.group(gi); if (!ed || !g) return;
    ed.querySelector('.dg-list').innerHTML = rows(g, gi, ctx.from(gi)); draw(gi); ctx.changed(gi, true);
    if (focusLi !== undefined) { choose(gi, focusLi); const t = ed.querySelector('.dg-row[data-li="' + focusLi + '"] textarea'); if (t) { t.focus({ preventScroll: true }); t.select(); } }
  }
  function addLabel(gi, x, y, arrow) {
    const d = modelOf(ctx.group(gi)); if (d.labels.length >= D().MAX) return ctx.toast('Keep at most ' + D().MAX + ' labels on one picture.', true);
    const b = arrow ? { x: clamp(x, 0, 74), y: clamp(y, 0, 90), w: 24, t: 'The ____', line: null } : { x: clamp(x, 0, 84), y: clamp(y, 0, 94), w: 16, t: '____', line: null };
    if (arrow) { const down = b.y < 50; b.line = [clamp(b.x + 10, 0, 100), clamp(down ? b.y + 9 : b.y - 1, 0, 100), clamp(b.x + (b.x < 40 ? 20 : 0), 0, 100), clamp(down ? b.y + 24 : b.y - 14, 0, 100)]; }
    d.labels.push(b); redo(gi, d.labels.length - 1);
  }
  function status(gi, text) { const el = edOf(gi) && edOf(gi).querySelector('.dg-status'); if (el) el.textContent = text || ''; }
  function setPicture(gi, url) {
    const g = ctx.group(gi); if (!g || !url) return;
    const im = new Image();
    im.onload = () => { const d = modelOf(g); const first = !d.img; d.img = url; d.iw = im.naturalWidth || 1000; d.ih = im.naturalHeight || 700; if (first && !d.labels.length) d.pad = [0, 0, 0, 0]; ctx.changed(gi, false); ctx.refresh(); };
    im.onerror = () => { status(gi, ''); ctx.toast('This picture could not be opened.', true); };
    im.src = url;
  }
  async function uploadPicture(gi, file) {
    if (!/^image\//.test(file.type)) return ctx.toast('Choose a picture (PNG, JPG, WebP).', true);
    status(gi, 'Uploading the picture …');
    try { setPicture(gi, await ctx.upload(file)); } catch (e) { ctx.toast((e && e.message) || 'The picture could not be uploaded.', true); } finally { status(gi, ''); }
  }

  /* ───────── mouse, touch, keys ───────── */
  document.addEventListener('pointerdown', (e) => {
    const cv = e.target.closest && e.target.closest('.dg-canvas'); if (!cv || e.button || !ctx) return;
    const gi = giOf(cv), g = ctx.group(gi), box = cv.querySelector('.ix-dg-in'); if (!g || !box) return;
    const h = e.target.closest('[data-h]'), lab = e.target.closest('.ix-dg-label'); const li = h ? Number(h.dataset.li) : lab ? Number(lab.dataset.li) : -1;
    const b = modelOf(g).labels[li]; if (!b) { choose(gi, -1); return; }
    e.preventDefault(); if (document.activeElement && document.activeElement !== cv) document.activeElement.blur(); cv.focus({ preventScroll: true }); choose(gi, li, true);
    const r = box.getBoundingClientRect(), kind = h ? h.dataset.h : 'move', old = JSON.parse(JSON.stringify(b)), sx = e.clientX, sy = e.clientY; let moved = false;
    try { cv.setPointerCapture(e.pointerId); } catch (x) { /* fine */ }
    const move = (ev) => {
      const dx = (ev.clientX - sx) / r.width * 100, dy = (ev.clientY - sy) / r.height * 100;
      if (!moved && Math.abs(ev.clientX - sx) < 3 && Math.abs(ev.clientY - sy) < 3) return; moved = true;
      if (kind === 'move') { b.x = clamp(old.x + dx, 0, 98); b.y = clamp(old.y + dy, 0, 98); if (b.line) { b.line[0] = clamp(old.line[0] + b.x - old.x, 0, 100); b.line[1] = clamp(old.line[1] + b.y - old.y, 0, 100); } }
      else if (kind === 'w') b.w = clamp(old.w + dx, 5, 100 - b.x);
      else { const k = kind === 's' ? 0 : 2; b.line[k] = clamp(old.line[k] + dx, 0, 100); b.line[k + 1] = clamp(old.line[k + 1] + dy, 0, 100); }
      place(gi);
    };
    const up = () => { cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('pointercancel', up); if (moved) ctx.changed(gi, false); };
    cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  });
  document.addEventListener('dblclick', (e) => {
    const cv = e.target.closest && e.target.closest('.dg-canvas'); if (!cv || !ctx) return; const gi = giOf(cv), box = cv.querySelector('.ix-dg-in'); if (!box) return;
    const lab = e.target.closest('.ix-dg-label');
    if (lab) { const t = edOf(gi).querySelector('.dg-row[data-li="' + lab.dataset.li + '"] textarea'); if (t) { t.focus(); t.scrollIntoView({ block: 'nearest' }); } return; }
    const r = box.getBoundingClientRect(); addLabel(gi, (e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100, false);
  });
  document.addEventListener('keydown', (e) => {
    const cv = e.target.closest && e.target.closest('.dg-canvas'); if (!cv || e.target !== cv || !ctx) return; const gi = giOf(cv), d = modelOf(ctx.group(gi)), b = d.labels[cur(gi)]; if (!b) return;
    const s = e.shiftKey ? 2 : 0.5; const go = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
    if (go) { e.preventDefault(); const ox = b.x, oy = b.y; b.x = clamp(b.x + go[0], 0, 98); b.y = clamp(b.y + go[1], 0, 98); if (b.line) { b.line[0] = clamp(b.line[0] + b.x - ox, 0, 100); b.line[1] = clamp(b.line[1] + b.y - oy, 0, 100); } place(gi); ctx.changed(gi, false); }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); ctx.drop(gi, cur(gi)); picked.set(gi, -1); redo(gi); }
  });
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-dg]'); if (!t || !ctx) return; const gi = giOf(t), g = ctx.group(gi); if (!g) return;
    const act = t.dataset.dg, d = modelOf(g), row = t.closest('.dg-row'), i = row ? Number(row.dataset.li) : -1;
    if (act === 'pic') { const f = await ctx.pick('image/*'); if (f) uploadPicture(gi, f); return; }
    if (act === 'add') return addLabel(gi, 3 + (d.labels.length % 2) * 70, 6 + (Math.floor(d.labels.length / 2) % 5) * 18, true);
    if (act === 'gap') return addLabel(gi, 42, 12 + (d.labels.length % 7) * 11, false);
    if (i < 0) return;
    if (act === 'ins') { const ta = row.querySelector('textarea'); const a = ta.selectionStart, z = ta.selectionEnd; ta.setRangeText('____', a, z, 'end'); ta.focus(); ta.dispatchEvent(new Event('input', { bubbles: true })); return; }
    if (act === 'line') { const b = d.labels[i]; b.line = b.line ? null : [clamp(b.x + Math.min(b.w, 12), 0, 100), clamp(b.y + 8, 0, 100), clamp(b.x + b.w + 8, 0, 100), clamp(b.y + 20, 0, 100)]; return redo(gi); }
    if (act === 'up' || act === 'down') { const j = act === 'up' ? i - 1 : i + 1; if (j < 0 || j >= d.labels.length) return; ctx.swap(gi, i, j); picked.set(gi, j); return redo(gi); }
    if (act === 'dup') { const c = JSON.parse(JSON.stringify(d.labels[i])); c.y = clamp(c.y + 6, 0, 94); if (c.line) { c.line[1] = clamp(c.line[1] + 6, 0, 100); c.line[3] = clamp(c.line[3] + 6, 0, 100); } d.labels.push(c); return redo(gi, d.labels.length - 1); }
    if (act === 'del') { ctx.drop(gi, i); picked.set(gi, -1); return redo(gi); }
  });
  let drawT = 0;
  document.addEventListener('input', (e) => {
    const el = e.target; if (!ctx || !el.hasAttribute) return; const gi = giOf(el); if (gi < 0) return; const d = modelOf(ctx.group(gi));
    if (el.hasAttribute('data-dg-t')) {
      const b = d.labels[Number(el.closest('.dg-row').dataset.li)]; if (!b) return; b.t = el.value;
      clearTimeout(drawT); drawT = setTimeout(() => { draw(gi); ctx.changed(gi, true); numbers(gi); }, 220);
    }
  });
  function numbers(gi) {   // the question numbers of the rows
    const ed = edOf(gi), g = ctx.group(gi); if (!ed || !g) return; let n = ctx.from(gi);
    modelOf(g).labels.forEach((b, i) => { const k = (String(b.t).match(D().GAP) || []).length, el = ed.querySelector('.dg-row[data-li="' + i + '"] .dg-no'); if (el) el.textContent = k ? (k > 1 ? n + '–' + (n + k - 1) : n) : '—'; n += k; });
  }
  document.addEventListener('change', (e) => {
    const el = e.target; if (!ctx || !el.hasAttribute) return; const gi = giOf(el); if (gi < 0) return; const d = modelOf(ctx.group(gi));
    if (el.hasAttribute('data-dg-pick') && el.value) return setPicture(gi, el.value);
    if (el.hasAttribute('data-dg-space')) { const s = SPACES.find((x) => x[0] === el.value); if (s) { D().setPad(d, s[2]); ctx.changed(gi, false); ctx.refresh(); } }
    if (el.hasAttribute('data-dg-pad')) { const p = d.pad.slice(); p[Number(el.getAttribute('data-dg-pad'))] = Number(el.value) || 0; D().setPad(d, p); ctx.changed(gi, false); draw(gi); }
  });
  document.addEventListener('focusin', (e) => { const row = e.target.closest && e.target.closest('.dg-row'); if (row && ctx) choose(giOf(row), Number(row.dataset.li)); });
  document.addEventListener('paste', (e) => {
    const gi = giOf(document.activeElement); if (gi < 0 || !ctx) return; const f = Array.from((e.clipboardData && e.clipboardData.files) || []).find((x) => /^image\//.test(x.type)); if (!f) return;
    e.preventDefault(); uploadPicture(gi, new File([f], f.name && f.name !== 'image.png' ? f.name : 'diagram-' + Date.now() + '.png', { type: f.type }));
  });
  document.addEventListener('dragover', (e) => { const cv = e.target.closest && e.target.closest('.dg-canvas'); if (cv && e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) { e.preventDefault(); cv.classList.add('over'); } });
  document.addEventListener('dragleave', (e) => { const cv = e.target.closest && e.target.closest('.dg-canvas'); if (cv) cv.classList.remove('over'); });
  document.addEventListener('drop', (e) => { const cv = e.target.closest && e.target.closest('.dg-canvas'); if (!cv || !ctx) return; cv.classList.remove('over'); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return; e.preventDefault(); uploadPicture(giOf(cv), f); });

  window.IXDiagramEditor = { init: (c) => { ctx = c; }, html, mount, draw, modelOf, setPicture, forget: () => picked.clear() };
})();
