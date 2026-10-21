#!/usr/bin/env node
/*
 * IELTSX — builds one REAL page per Full Tests pack, and checks that every test link in the catalog points at a file.
 *
 *   node scripts/build-packs.js        (also:  npm run build:packs)
 *
 * Why: /full-tests/reading/pack-1 used to exist only as a rewrite rule (server.js / vercel.json). On any host that
 * does not run that rule (static hosting, Live Server, a rule that did not load) it showed the 404 page. Now every pack
 * in assets/js/full-tests-data.js also has  full-tests/<skill>/<pack>/index.html , so the link works everywhere.
 * Run it again after you add a pack to full-tests-data.js. (Packs created in the Admin panel keep using the rewrite.)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(read('assets/js/full-tests-data.js'), sandbox);
const DATA = sandbox.window.IELTSX_FULL_TESTS;
if (!DATA) { console.error('full-tests-data.js did not define IELTSX_FULL_TESTS'); process.exit(1); }

const template = read('full-tests/pack.html');
let built = 0, problems = 0;

for (const skill of Object.keys(DATA.packs)) {
  for (const pack of DATA.packs[skill]) {
    const dir = path.join(root, 'full-tests', skill, pack.slug);
    fs.mkdirSync(dir, { recursive: true });
    const html = template.replace('data-view="pack" data-skill=""', 'data-view="pack" data-skill="' + skill + '"');
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    built++;

    for (const t of pack.tests || []) {
      const href = String(t.href || '').split(/[?#]/)[0].replace(/\/+$/, '');
      const candidates = [href + '.html', href + '/index.html', href];
      const ok = candidates.some((c) => { try { return fs.statSync(path.join(root, c)).isFile(); } catch (e) { return false; } });
      console.log((ok ? '  ok   ' : '  MISSING ') + (skill + '/' + pack.slug).padEnd(28) + ' ' + String(t.source).padEnd(28) + ' -> ' + t.href);
      if (!ok) problems++;
    }
  }
}
console.log('\n' + built + ' pack pages written, ' + problems + ' broken test link(s).');
process.exit(problems ? 1 : 0);
