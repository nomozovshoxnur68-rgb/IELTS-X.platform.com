/*
 * IELTSX admin: reads a test PDF in the browser (admin.html, used by the "Fill from a PDF" block of admin-content.js).
 * The PDF never leaves the computer: pdf.js (assets/js/vendor/pdfjs, Mozilla, Apache-2.0) turns every page into lines of
 * text in reading order, repeated headers / footers / page numbers are dropped, and any page can be drawn on a canvas so a
 * chart, map or diagram can be cut out of it and uploaded as a picture.
 *
 *   const doc = await IXImport.open(file)   -> { pages, text, scanned }
 *   const canvas = await doc.render(n, scale)
 */
(() => {
  'use strict';
  const BASE = '/assets/js/vendor/pdfjs/';
  let loading = null;
  function lib() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (!loading) loading = new Promise((resolve, reject) => {
      const s = document.createElement('script'); s.src = BASE + 'pdf.min.js';
      s.onload = () => {
        if (!window.pdfjsLib) { loading = null; return reject(new Error('The PDF reader did not start.')); }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = BASE + 'pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      s.onerror = () => { loading = null; reject(new Error('The PDF reader could not be loaded (' + BASE + 'pdf.min.js).')); };
      document.head.appendChild(s);
    });
    return loading;
  }

  /* one page -> lines in the order the PDF writes them. A big jump between two pieces of the same line becomes
     three spaces (tables, two columns of options, an answer key in columns); a bigger gap between lines, or a jump
     up the page (the next column), becomes an empty line (a new paragraph). */
  function pageLines(items) {
    const lines = []; let cur = null; let eol = false;
    for (const it of items) {
      if (!it || typeof it.str !== 'string') continue;
      const s = it.str.replace(/ /g, ' ');
      const t = it.transform || [1, 0, 0, 1, 0, 0]; const size = Math.hypot(t[0], t[1]) || Math.abs(t[3]) || 10; const x = t[4], y = t[5];
      if (!s) { if (it.hasEOL) eol = true; continue; }
      const sameLine = cur && !eol && Math.abs(y - cur.y) <= Math.max(size, cur.size) * 0.55;
      if (!sameLine) {
        if (cur) lines.push(cur);
        const prev = cur; const gap = prev ? prev.y - y : 0;
        cur = { y, size, text: s, xEnd: x + (it.width || 0), blank: !!prev && (gap > Math.max(size, prev.size) * 1.75 || gap < -size * 0.6) };
      } else {
        const space = x - cur.xEnd;
        if (space > size * 1.6) cur.text = cur.text.replace(/\s+$/, '') + '   ';
        else if (space > size * 0.12 && !/\s$/.test(cur.text) && !/^\s/.test(s)) cur.text += ' ';
        cur.text += s; cur.xEnd = Math.max(cur.xEnd, x + (it.width || 0)); cur.size = Math.max(cur.size, size);
      }
      eol = !!it.hasEOL;
    }
    if (cur) lines.push(cur);
    return lines.map((l) => ({ text: l.text.replace(/[ \t]+$/, ''), blank: l.blank }));
  }

  /* a line printed on most pages (book title, "Test 1", a watermark) or a bare page number is not part of the test */
  function dropRepeats(pages) {
    const norm = (t) => t.trim().toLowerCase().replace(/\d+/g, '#').replace(/\s+/g, ' ');
    const seen = {};
    pages.forEach((ls) => { new Set(ls.map((l) => norm(l.text)).filter((k) => k && k.length < 90)).forEach((k) => { seen[k] = (seen[k] || 0) + 1; }); });
    const many = pages.length >= 3 ? Math.max(3, Math.ceil(pages.length * 0.3)) : Infinity;
    return pages.map((ls) => ls.filter((l) => { const t = l.text.trim(); const k = norm(t); return !(/^(?:page\s*)?\d{1,3}(?:\s*(?:\/|of)\s*\d{1,3})?$/i.test(t) || (seen[k] >= many && !/^(?:questions?|passage|part|section|task)\b/i.test(t))); }));
  }

  async function open(file) {
    const pdfjs = await lib();
    const data = new Uint8Array(await file.arrayBuffer());
    let pdf;
    try { pdf = await pdfjs.getDocument({ data, isEvalSupported: false, useSystemFonts: true }).promise; }
    catch (e) { throw new Error(/password/i.test(e && e.name + e.message) ? 'This PDF is password protected. Open it, save a copy without a password, and upload that.' : 'This file could not be read as a PDF (' + ((e && e.message) || 'unknown error') + ').'); }
    const pages = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const tc = await page.getTextContent();
      pages.push(pageLines(tc.items));
      page.cleanup();
    }
    const clean = dropRepeats(pages);
    const text = clean.map((ls) => ls.map((l) => (l.blank ? '\n' : '') + l.text).join('\n')).join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
    const chars = text.replace(/\s+/g, '').length;
    return {
      pages: pdf.numPages, text, scanned: chars < 60 * pdf.numPages,
      /* page n drawn on a canvas, `scale` times its size in points */
      async render(n, scale) {
        const page = await pdf.getPage(n); const vp = page.getViewport({ scale: scale || 1.5 });
        const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
        // "print" draws in one go: the display mode waits for animation frames, which a background tab never gets
        await page.render({ canvasContext: g, viewport: vp, intent: 'print' }).promise;
        return c;
      },
      close() { try { pdf.destroy(); } catch (e) { /* gone */ } }
    };
  }
  window.IXImport = { open };
})();
