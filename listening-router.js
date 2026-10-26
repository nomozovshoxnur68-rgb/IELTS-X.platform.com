'use strict';
/* ====
   listening-router.js -- ONE router for every Listening test that is made in the admin panel (same idea as reading-router.js).
   The page is generated on every visit from the saved test, on the new listening engine (listening/js/listening.js + .css).

   Addresses:
     /exam/listening/<id>     canonical, always works
     /sections/test-<N>       numbered after the hand-made ones (test-1 ... test-4), so the first admin test is test-5
   N is stored in the test (data.no) when it is created and never changes.
   ==== */
const fs = require('fs');
const path = require('path');
const { renderPage } = require('./listening-exam');

const FALLBACK_LAST = 4;
function lastStatic(root) {
  let max = 0;
  try { fs.readdirSync(path.join(root, 'sections')).forEach((f) => { const m = /^test-(\d+)\.html$/i.exec(f); if (m) max = Math.max(max, Number(m[1])); }); } catch (e) { /* serverless: use the fallback */ }
  return Math.max(max, FALLBACK_LAST);
}
function nextNumber(root, materials) {
  let max = lastStatic(root);
  (materials || []).forEach((m) => { if (m && m.type === 'listening') max = Math.max(max, Number(m.data && m.data.no) || 0); });
  return max + 1;
}
function hrefFor(m) {
  if (!m || m.type !== 'listening') return '';
  const no = Number(m.data && m.data.no) || 0;
  return no ? '/sections/test-' + no : '/exam/listening/' + encodeURIComponent(m.id);
}
function match(pathname) {
  let m = /^\/exam\/listening\/([^/]+)\/?$/.exec(pathname);
  if (m) { try { return { id: decodeURIComponent(m[1]) }; } catch (e) { return null; } }
  m = /^\/sections\/test-(\d+)(?:\.html)?\/?$/i.exec(pathname);
  if (m) return { no: Number(m[1]) };
  return null;
}
async function route(req, res, url, ctx) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  const hit = match(url.pathname);
  if (!hit) return false;
  if (hit.no && fs.existsSync(path.join(ctx.root, 'sections', 'test-' + hit.no + '.html'))) return false;   // hand-made page: static file wins
  let m = null;
  if (hit.id) m = await ctx.store.getMaterial(hit.id);
  else if (hit.no > lastStatic(ctx.root)) m = (await ctx.store.listMaterials('listening')).find((x) => Number(x.data && x.data.no) === hit.no) || null;
  else return false;
  const u = await ctx.currentUser(req);
  if (!m || m.type !== 'listening' || (m.published === false && !ctx.isAdmin(u))) { if (hit.id) { ctx.send(res, 404, 'Test not found.'); return true; } return false; }
  const rule = ctx.materialRule(m, await ctx.accessRules());
  if (!ctx.allowsLevel(rule, ctx.userLevel(u))) {
    res.statusCode = 302; res.setHeader('Location', u ? '/Price?premium=required' : '/login?next=' + encodeURIComponent(url.pathname)); res.end(); return true;
  }
  let html;
  try { html = renderPage(m); }
  catch (e) { console.error('listening-router:', e); ctx.send(res, 500, 'This test could not be built. Please check its audio and questions in the admin panel.'); return true; }
  ctx.send(res, 200, html, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex' });
  return true;
}
module.exports = { route, hrefFor, nextNumber, lastStatic, match };
