'use strict';
/* ====
   reading-router.js -- ONE router for every Reading test that is made in the admin panel.

   The admin chooses the format of a Reading test:
     * PART  (one passage, ~20 min)  -> built from pessages/test-19.html  (reading.js + reading.css)
     * FULL  (three passages, 60 min) -> built from full-tests/reading/test-1.html (reading.js + reading.css)
   Nothing has to be copied by hand: the page is generated from the saved test on every visit, so a test
   that is saved (and Published) in the admin panel is on the site straight away.

   Addresses served here (all give the same page for the same test):
     /exam/reading/<id>                 canonical, always works
     /pessages/test-<N>                 PART tests, numbered after the hand-made ones  (22, 23, ...)
     /full-tests/reading/test-<N>       FULL tests, numbered after the hand-made ones  (7, 8, ...)
   N is stored in the test (data.no) when it is created and never changes, so links stay stable.
   ==== */
const fs = require('fs');
const path = require('path');
const { buildExamHtml, isFull } = require('./reading-exam');

const KINDS = {
  part: { dir: 'pessages', template: 'pessages/test-19.html', pageBase: '/pessages/test-', fallbackLast: 21 },
  full: { dir: 'full-tests/reading', template: 'full-tests/reading/test-1.html', pageBase: '/full-tests/reading/test-', fallbackLast: 6 }
};
const kindOf = (m) => (isFull(m) ? 'full' : 'part');

/* highest test-N.html that exists by hand (so the admin ones continue the numbering) */
function lastStatic(root, kind) {
  const k = KINDS[kind]; let max = 0;
  try { fs.readdirSync(path.join(root, k.dir)).forEach((f) => { const m = /^test-(\d+)\.html$/i.exec(f); if (m) max = Math.max(max, Number(m[1])); }); } catch (e) { /* not on disk (serverless): use the fallback */ }
  return Math.max(max, k.fallbackLast);
}
/* the next free number for a new test of this kind */
function nextNumber(root, kind, materials) {
  let max = lastStatic(root, kind);
  (materials || []).forEach((m) => { if (m && m.type === 'reading' && kindOf(m) === kind) max = Math.max(max, Number(m.data && m.data.no) || 0); });
  return max + 1;
}
/* the address a student should use */
function hrefFor(m) {
  if (!m || m.type !== 'reading') return '';
  const no = Number(m.data && m.data.no) || 0;
  return no ? KINDS[kindOf(m)].pageBase + no : '/exam/reading/' + encodeURIComponent(m.id);
}
/* what does this path ask for?  -> { id } | { kind, no } | null */
function match(pathname) {
  let m = /^\/exam\/reading(?:-part|-full)?\/([^/]+)\/?$/.exec(pathname);
  if (m) { try { return { id: decodeURIComponent(m[1]) }; } catch (e) { return null; } }
  m = /^\/pessages\/test-(\d+)(?:\.html)?\/?$/i.exec(pathname);
  if (m) return { kind: 'part', no: Number(m[1]) };
  m = /^\/full-tests\/reading\/test-(\d+)(?:\.html)?\/?$/i.exec(pathname);
  if (m) return { kind: 'full', no: Number(m[1]) };
  return null;
}
const readTemplate = (root, kind) => fs.readFileSync(path.join(root, KINDS[kind].template), 'utf8');

/* Handles the request; returns false when the path is not ours (the caller carries on).
   ctx = { root, store, currentUser, isAdmin, materialRule, accessRules, allowsLevel, userLevel, send } */
async function route(req, res, url, ctx) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  const hit = match(url.pathname);
  if (!hit) return false;
  if (hit.no && fs.existsSync(path.join(ctx.root, KINDS[hit.kind].dir, 'test-' + hit.no + '.html'))) return false;   // a hand-made page: static file wins
  let m = null;
  if (hit.id) m = await ctx.store.getMaterial(hit.id);
  else if (hit.no > lastStatic(ctx.root, hit.kind)) m = (await ctx.store.listMaterials('reading')).find((x) => kindOf(x) === hit.kind && Number(x.data && x.data.no) === hit.no) || null;
  else return false;
  const u = await ctx.currentUser(req);
  if (!m || m.type !== 'reading' || (m.published === false && !ctx.isAdmin(u))) { if (hit.id) { ctx.send(res, 404, 'Test not found.'); return true; } return false; }
  const rule = ctx.materialRule(m, await ctx.accessRules());
  if (!ctx.allowsLevel(rule, ctx.userLevel(u))) {
    res.statusCode = 302; res.setHeader('Location', u ? '/Price?premium=required' : '/login?next=' + encodeURIComponent(url.pathname)); res.end(); return true;
  }
  const kind = kindOf(m);
  let html;
  try { html = buildExamHtml(m, { [kind]: readTemplate(ctx.root, kind) }); }
  catch (e) { console.error('reading-router:', e); ctx.send(res, 500, 'This test could not be built. Please check its passage and questions in the admin panel.'); return true; }
  ctx.send(res, 200, html, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex' });
  return true;
}

module.exports = { route, match, hrefFor, nextNumber, kindOf, KINDS };
