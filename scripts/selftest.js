'use strict';
/* Self-test: starts the server on a temporary database and checks accounts, premium, admin and file protection. */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http'), assert = require('assert');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ieltsx-'));
process.env.DATA_DIR = tmp; process.env.UPLOAD_DIR = path.join(tmp, 'uploads');
process.env.ADMIN_EMAILS = 'boss@example.com'; process.env.SESSION_SECRET = 'test-secret-test-secret-test-secret-123456';
process.env.PAYMENT_WEBHOOK_SECRET = 'hook-secret';
const mails = []; const realLog = console.log;
console.log = (...a) => { const t = a.join(' '); if (t.includes('[mail not configured]')) mails.push(t); else realLog(...a); };
const handler = require('../server');
const crypto = require('crypto');

const server = http.createServer(handler);
server.listen(0, async () => {
  const base = 'http://127.0.0.1:' + server.address().port;
  const jar = () => { let c = ''; return { get: () => c, set: (v) => { c = v; } }; };
  async function call(method, url, { body, jar: j, headers = {}, raw } = {}) {
    const h = { ...headers }; if (j && j.get()) h.cookie = j.get();
    if (body && !raw) h['content-type'] = 'application/json';
    let r = await fetch(base + url, { method, headers: h, body: raw || (body ? JSON.stringify(body) : undefined), redirect: 'manual' });
    // "/x.html" is redirected (301) to the clean "/x": follow that one hop, the tests care about the page itself
    if (r.status === 301 && method === 'GET' && /\.html(\?|$)/i.test(url)) r = await fetch(base + r.headers.get('location'), { method, headers: h, redirect: 'manual' });
    const sc = r.headers.get('set-cookie'); if (sc && j) j.set(sc.split(';')[0]);
    const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch (e) {}
    return { status: r.status, json, text, headers: r.headers };
  }
  let n = 0; const ok = (name) => realLog('  ok  ' + name, ++n);
  try {
    // --- files that must never be downloadable
    for (const p of ['/data/db.json', '/data/.session-secret', '/server.js', '/package.json', '/.env.example', '/ADMIN_ACCESS.md', '/supabase-schema.sql', '/vercel.json', '/scripts/make-admin.js', '/api/../server.js', '/%2e%2e/server.js', '/..%2fserver.js', '/node_modules/x.js']) {
      const r = await call('GET', p); assert.ok([403, 404].includes(r.status), p + ' -> ' + r.status);
    }
    ok('server code, database and docs are not downloadable');
    assert.equal((await call('GET', '/index.html')).status, 200); assert.equal((await call('GET', '/')).status, 200);
    assert.equal((await call('GET', '/listening.html')).status, 200, 'alias'); ok('pages + old links (aliases) still work');
    assert.equal((await call('POST', '/index.html')).status, 405); ok('POST to a page is rejected');

    // --- register / login
    const user = jar(), boss = jar();
    assert.equal((await call('POST', '/api/auth/register', { body: { name: 'A', email: 'bad', password: '12345678' } })).status, 400);
    assert.equal((await call('POST', '/api/auth/register', { body: { name: 'A', email: 'a@x.com', password: 'short' } })).status, 400);
    let r = await call('POST', '/api/auth/register', { body: { name: ' Alice  <b> ', email: 'Alice@Example.com', password: 'Tr1cky-pass-77' }, jar: user });
    assert.equal(r.status, 201); assert.equal(r.json.user.email, 'alice@example.com'); assert.equal(r.json.user.name, 'Alice b'); assert.equal(r.json.user.isAdmin, false); assert.equal(r.json.user.premiumActive, false);
    assert.ok(/HttpOnly/.test(r.headers.get('set-cookie')) && !/Secure/.test(r.headers.get('set-cookie')), 'cookie flags on http');
    assert.equal((await call('POST', '/api/auth/register', { body: { name: 'Alice', email: 'alice@example.com', password: 'Tr1cky-pass-77' } })).status, 409);
    r = await call('POST', '/api/auth/register', { body: { name: 'Boss', email: 'boss@example.com', password: 'Tr1cky-pass-77' }, jar: boss });
    assert.equal(r.json.user.isAdmin, true); ok('register (normalised email, ADMIN_EMAILS -> admin, duplicate blocked)');
    r = await call('GET', '/api/auth/me', { jar: user }); assert.equal(r.json.user.email, 'alice@example.com');
    assert.equal((await call('GET', '/api/auth/me')).json.user, null);
    assert.equal((await call('GET', '/api/auth/me', { headers: { cookie: 'ieltsx_session=garbage.garbage' } })).status, 200);
    assert.equal((await call('GET', '/api/auth/me', { headers: { cookie: 'ieltsx_session=%E0%A4%A' } })).status, 200); ok('bad / broken cookies are treated as signed out (no crash)');
    assert.equal((await call('POST', '/api/auth/login', { body: { email: 'alice@example.com', password: 'wrong-one' } })).status, 401);
    r = await call('POST', '/api/auth/login', { body: { email: 'ALICE@example.com', password: 'Tr1cky-pass-77' } }); assert.equal(r.status, 200); ok('login');

    // --- admin API
    assert.equal((await call('GET', '/api/admin/users')).status, 401);
    assert.equal((await call('GET', '/api/admin/users', { jar: user })).status, 403);
    r = await call('GET', '/api/admin/users', { jar: boss }); assert.equal(r.status, 200); assert.equal(r.json.users.length, 2);
    const aliceId = r.json.users.find((u) => u.email === 'alice@example.com').id;
    ok('admin API: 401 anonymous, 403 normal user, 200 admin');

    // --- premium
    assert.equal((await call('GET', '/api/premium/status', { jar: user })).json.premium, false);
    let m = await call('GET', '/Mock%20tests.html'); assert.equal(m.status, 302); assert.ok(m.headers.get('location').startsWith('/login?next='));
    m = await call('GET', '/Mock%20tests.html', { jar: user }); assert.equal(m.status, 302); assert.ok(m.headers.get('location').startsWith('/Price?premium=required'));
    // --- vocabulary collections: Free / Premium unlock enforced by the server
    {
      const adm = boss;
      const words = [{ word: 'altogether', pos: 'adverb', definition: 'completely', example: 'x', synonyms: ['wholly'], opposites: ['partly'] }, { word: 'Altogether', pos: '', definition: 'dup' }, { word: 'nodef' }];
      let r = await call('POST', '/api/admin/materials', { jar: adm, body: { type: 'vocab', title: 'B2 - Part 2', premium: true, data: { kind: 'collection', level: 'Intermediate', source: 'Oxford', words } } });
      assert.equal(r.status, 201); const vid = r.json.item.id; assert.equal(r.json.item.data.words.length, 1, 'duplicates and empty definitions are dropped');
      const free = user;   // alice is still a Free member here
      r = await call('GET', '/api/materials?type=vocab', { jar: free }); const it = r.json.items.find((x) => x.id === vid);
      assert.ok(it && it.locked === true && it.wordCount === 1 && !it.data, 'list shows a locked card without words');
      assert.equal((await call('GET', '/api/materials/' + vid, { jar: free })).status, 403); assert.equal((await call('GET', '/api/materials/' + vid)).status, 401);
      r = await call('GET', '/api/materials/' + vid, { jar: adm }); assert.equal(r.status, 200); assert.equal(r.json.item.data.words[0].word, 'altogether');
      assert.equal((await call('PATCH', '/api/admin/materials/' + vid, { jar: adm, body: { premium: false } })).status, 200);
      r = await call('GET', '/api/materials/' + vid, { jar: free }); assert.equal(r.status, 200); assert.equal(r.json.item.data.words.length, 1);
      assert.equal((await call('GET', '/vocabulary')).status, 200); assert.equal((await call('GET', '/vocabulary/study')).status, 200);
      await call('DELETE', '/api/admin/materials/' + vid, { jar: adm });
      ok('vocabulary: lock/unlock by admin, words never sent to Free users while locked');
    }
    r = await call('POST', `/api/admin/users/${aliceId}/premium`, { body: { plan: 'Premium', days: 30 }, jar: boss }); assert.equal(r.json.user.premiumActive, true);
    assert.equal((await call('GET', '/api/premium/status', { jar: user })).json.premium, true);
    assert.equal((await call('GET', '/Mock%20tests.html', { jar: user })).status, 200);
    assert.equal((await call('GET', '/Mock%20tests.html', { jar: boss })).status, 200);
    await call('DELETE', `/api/admin/users/${aliceId}/premium`, { jar: boss });
    assert.equal((await call('GET', '/Mock%20tests.html', { jar: user })).status, 302); ok('premium: grant, page unlocked, revoke, page locked again');
    // expired premium
    const dbf = path.join(tmp, 'db.json'); const db = JSON.parse(fs.readFileSync(dbf)); db.users.find((u) => u.email === 'alice@example.com').premiumActive = true; db.users.find((u) => u.email === 'alice@example.com').premiumExpiresAt = new Date(Date.now() - 1000).toISOString(); fs.writeFileSync(dbf, JSON.stringify(db));
    assert.equal((await call('GET', '/api/premium/status', { jar: user })).json.premium, false); ok('expired premium counts as free');

    // --- admin pages
    assert.equal((await call('GET', '/admin')).status, 302);
    assert.equal((await call('GET', '/admin', { jar: user })).headers.get('location'), '/?admin=denied');
    assert.equal((await call('GET', '/admin', { jar: boss })).status, 200);
    assert.equal((await call('GET', '/admin.html', { jar: boss })).status, 200); ok('admin pages: only admins can open them');

    // --- roles
    r = await call('POST', `/api/admin/users/${aliceId}/role`, { body: { role: 'admin' }, jar: boss }); assert.equal(r.json.user.isAdmin, true);
    assert.equal((await call('GET', '/api/admin/users', { jar: user })).status, 200);
    r = await call('POST', `/api/admin/users/${aliceId}/role`, { body: { role: 'user' }, jar: boss }); assert.equal(r.json.user.isAdmin, false);
    const bossId = (await call('GET', '/api/auth/me', { jar: boss })).json.user.id;
    assert.equal((await call('POST', `/api/admin/users/${bossId}/role`, { body: { role: 'user' }, jar: boss })).status, 400);
    assert.equal((await call('DELETE', `/api/admin/users/${bossId}`, { jar: boss })).status, 400); ok('roles: promote/demote, cannot demote or delete yourself');

    // --- profile + password (old sessions end)
    r = await call('POST', '/api/auth/profile', { body: { name: 'Alice Smith' }, jar: user }); assert.equal(r.json.user.name, 'Alice Smith');
    const second = jar(); await call('POST', '/api/auth/login', { body: { email: 'alice@example.com', password: 'Tr1cky-pass-77' }, jar: second });
    r = await call('POST', '/api/auth/password', { body: { currentPassword: 'nope', newPassword: 'Fresh-pass-88' }, jar: user }); assert.equal(r.status, 401);
    r = await call('POST', '/api/auth/password', { body: { currentPassword: 'Tr1cky-pass-77', newPassword: 'Fresh-pass-88' }, jar: user }); assert.equal(r.status, 200);
    assert.equal((await call('GET', '/api/auth/me', { jar: user })).json.user.email, 'alice@example.com', 'this device stays signed in');
    assert.equal((await call('GET', '/api/auth/me', { jar: second })).json.user, null, 'other device signed out'); ok('profile + password change (other devices signed out)');

    // --- materials + upload
    r = await call('POST', '/api/admin/materials', { body: { type: 'reading', title: 'Test 1', premium: true }, jar: boss }); assert.equal(r.status, 201);
    assert.equal((await call('GET', '/api/materials?type=reading', { jar: user })).json.items[0].locked, true);
    assert.equal((await call('GET', '/api/materials?type=reading', { jar: boss })).json.items[0].locked, false);
    await call('DELETE', '/api/admin/materials/' + r.json.item.id, { jar: boss }); assert.equal((await call('GET', '/api/admin/materials', { jar: boss })).json.items.length, 0);
    const bd = '----x'; const mp = (name, data, type) => Buffer.from(`--${bd}\r\nContent-Disposition: form-data; name="type"\r\n\r\n${type}\r\n--${bd}\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: application/octet-stream\r\n\r\n${data}\r\n--${bd}--\r\n`);
    r = await call('POST', '/api/admin/uploads', { raw: mp('Read ../me.html', '<h1>hi</h1>', 'reading'), headers: { 'content-type': 'multipart/form-data; boundary=' + bd }, jar: boss });
    assert.equal(r.status, 201, JSON.stringify(r.json)); assert.ok(!/\.\./.test(r.json.filename));
    let f = await call('GET', r.json.url); assert.equal(f.status, 200); assert.ok(/sandbox/.test(f.headers.get('content-security-policy')) && f.text.includes('hi'));
    assert.equal((await call('POST', '/api/admin/uploads', { raw: mp('evil.exe', 'x', 'reading'), headers: { 'content-type': 'multipart/form-data; boundary=' + bd }, jar: boss })).status, 400);
    assert.equal((await call('POST', '/api/admin/uploads', { raw: mp('a.html', 'x', 'reading'), headers: { 'content-type': 'multipart/form-data; boundary=' + bd }, jar: user })).status, 403); ok('materials + uploads (admin only, type-checked, sandboxed)');

    // --- audio range
    const audio = '/listening/audio/Pacific_tapa_cloth_IELTS_LISTENING_Vol_3_Test_4_Section_3IELTS.mp3';
    if (fs.existsSync(path.join(__dirname, '..', audio))) { const a = await call('GET', audio, { headers: { range: 'bytes=0-99' } }); assert.equal(a.status, 206); ok('audio supports Range (seeking)'); }


    // --- health, cross-site protection
    assert.equal((await call('GET', '/api/health')).json.ok, true);
    r = await call('POST', '/api/auth/logout', { headers: { origin: 'https://evil.example' } }); assert.equal(r.status, 403);
    r = await call('POST', '/api/auth/logout', { headers: { origin: base } }); assert.equal(r.status, 200); ok('health + cross-site POST blocked');

    // --- email verification
    const vmail = mails.find((m) => /To: alice@example.com/.test(m) && /verify\.html\?token=/.test(m)); assert.ok(vmail, 'verification mail');
    const vtoken = decodeURIComponent(/token=([^\s]+)/.exec(vmail)[1]);
    assert.equal((await call('GET', '/api/auth/me', { jar: user })).json.user.emailVerified, false);
    assert.equal((await call('POST', '/api/auth/verify', { body: { token: 'nope' } })).status, 400);
    assert.equal((await call('POST', '/api/auth/verify', { body: { token: vtoken } })).status, 200);
    assert.equal((await call('GET', '/api/auth/me', { jar: user })).json.user.emailVerified, true); ok('email verification link');

    // --- forgot / reset password
    const before = mails.length;
    assert.equal((await call('POST', '/api/auth/forgot', { body: { email: 'nobody@example.com' } })).status, 200);
    assert.equal(mails.length, before, 'no mail for unknown account, same answer');
    assert.equal((await call('POST', '/api/auth/forgot', { body: { email: 'alice@example.com' } })).status, 200);
    const rmail = mails.slice(before).find((m) => /reset\.html\?token=/.test(m)); assert.ok(rmail);
    const rtoken = decodeURIComponent(/token=([^\s]+)/.exec(rmail)[1]);
    const sessionTok = decodeURIComponent(user.get().split('=')[1]);
    assert.equal((await call('POST', '/api/auth/reset', { body: { token: sessionTok, newPassword: 'another-pass-1' } })).status, 400, 'a session token is not a reset token');
    assert.equal((await call('POST', '/api/auth/reset', { body: { token: rtoken, newPassword: 'short' } })).status, 400);
    const fresh = jar(); r = await call('POST', '/api/auth/reset', { body: { token: rtoken, newPassword: 'brand-new-pass-1' }, jar: fresh }); assert.equal(r.status, 200);
    assert.equal((await call('GET', '/api/auth/me', { jar: fresh })).json.user.email, 'alice@example.com');
    assert.equal((await call('POST', '/api/auth/reset', { body: { token: rtoken, newPassword: 'again-new-pass-2' } })).status, 400, 'reset link works once');
    assert.equal((await call('POST', '/api/auth/login', { body: { email: 'alice@example.com', password: 'Fresh-pass-88' } })).status, 401);
    assert.equal((await call('POST', '/api/auth/login', { body: { email: 'alice@example.com', password: 'brand-new-pass-1' } })).status, 200); ok('forgot + reset password (single use, no account enumeration)');
    Object.assign(user, { get: fresh.get, set: fresh.set });

    // --- results + progress
    const res1 = { testKey: '/pessages/test-1.html', section: 'Reading', scoreCorrect: 7, scoreTotal: 10, pageLabel: 'Cakes' };
    assert.equal((await call('POST', '/api/results', { body: res1 })).status, 401);
    assert.equal((await call('POST', '/api/results', { body: { ...res1, scoreCorrect: 11 }, jar: user })).status, 400);
    assert.equal((await call('POST', '/api/results', { body: { ...res1, testKey: 'x' }, jar: user })).status, 400);
    r = await call('POST', '/api/results', { body: res1, jar: user }); assert.equal(r.status, 201); assert.equal(r.json.result.band, 6.3);
    assert.equal((await call('POST', '/api/results', { body: res1, jar: user })).json.duplicate, true);
    await call('POST', '/api/results', { body: { ...res1, testKey: '/sections/test-1.html', section: 'Listening', scoreCorrect: 5, scoreTotal: 10 }, jar: user });
    assert.equal((await call('GET', '/api/results', { jar: user })).json.results.length, 2);
    assert.deepEqual((await call('GET', '/api/progress', { jar: user })).json.completed.sort(), ['/pessages/test-1.html', '/sections/test-1.html']);
    assert.deepEqual((await call('GET', '/api/progress', { jar: boss })).json.completed, []); ok('results + progress are per account');

    // --- plans + orders + admin approval + webhook
    assert.ok((await call('GET', '/api/plans')).json.plans.length >= 2);
    assert.equal((await call('POST', '/api/orders', { body: { plan: 'max', months: 3 } })).status, 401);
    assert.equal((await call('POST', '/api/orders', { body: { plan: 'max', months: 5 }, jar: user })).status, 400);
    r = await call('POST', '/api/orders', { body: { plan: 'max', months: 3 }, jar: user }); assert.equal(r.status, 201); assert.equal(r.json.order.amount, 264000); assert.ok(/^IX-[0-9A-F]{6}$/.test(r.json.order.ref));
    const order1 = r.json.order;
    assert.equal((await call('POST', '/api/orders', { body: { plan: 'max', months: 3 }, jar: user })).json.order.id, order1.id, 'same open order is reused');
    assert.equal((await call('POST', `/api/admin/orders/${order1.id}/approve`, { jar: user })).status, 403);
    r = await call('POST', `/api/admin/orders/${order1.id}/approve`, { jar: boss }); assert.equal(r.status, 200); assert.equal(r.json.user.plan, 'Max'); assert.equal(r.json.user.premiumActive, true);
    const exp1 = new Date(r.json.user.premiumExpiresAt).getTime(); assert.ok(Math.abs(exp1 - Date.now() - 90 * 86400000) < 60000);
    assert.equal((await call('POST', `/api/admin/orders/${order1.id}/approve`, { jar: boss })).status, 400, 'cannot approve twice');
    const o2 = (await call('POST', '/api/orders', { body: { plan: 'standard', months: 1 }, jar: user })).json.order;
    r = await call('POST', `/api/admin/orders/${o2.id}/approve`, { jar: boss }); const exp2 = new Date(r.json.user.premiumExpiresAt).getTime(); assert.ok(exp2 - exp1 > 29 * 86400000, 'extends an active plan');
    const o3 = (await call('POST', '/api/orders', { body: { plan: 'standard', months: 6 }, jar: user })).json.order;
    assert.equal((await call('POST', `/api/orders/${o3.id}/cancel`, { jar: user })).json.order.status, 'cancelled');
    const o4 = (await call('POST', '/api/orders', { body: { plan: 'standard', months: 3 }, jar: user })).json.order;
    const hook = (body, sig) => call('POST', '/api/payments/webhook', { raw: body, headers: { 'content-type': 'application/json', 'x-signature': sig } });
    const body4 = JSON.stringify({ reference: o4.ref, status: 'paid', amount: o4.amount });
    assert.equal((await hook(body4, 'deadbeef')).status, 401);
    assert.equal((await hook(JSON.stringify({ reference: o4.ref, status: 'paid', amount: 1 }), crypto.createHmac('sha256', 'hook-secret').update(JSON.stringify({ reference: o4.ref, status: 'paid', amount: 1 })).digest('hex'))).status, 400, 'amount too low');
    assert.equal((await hook(body4, crypto.createHmac('sha256', 'hook-secret').update(body4).digest('hex'))).json.status, 'paid');
    assert.equal((await hook(body4, crypto.createHmac('sha256', 'hook-secret').update(body4).digest('hex'))).json.status, 'paid', 'idempotent');
    assert.equal((await call('GET', '/api/admin/orders?status=paid', { jar: boss })).json.orders.length, 3); ok('orders: create, approve (extends plan), cancel, signed webhook');

    // --- audit log
    r = await call('GET', '/api/admin/audit', { jar: boss }); assert.equal(r.status, 200);
    const acts = r.json.entries.map((e) => e.action); assert.ok(acts.includes('premium.grant') && acts.includes('order.approve') && acts.includes('role.admin') && acts.includes('upload'));
    assert.equal((await call('GET', '/api/admin/audit', { jar: user })).status, 403); ok('admin audit log');

    // --- numbered tests: /pessages/test-N, /sections/test-N, /full-tests/...
    for (const u of ['/pessages/test-1.html', '/pessages/test-3.html', '/pessages/test-21.html', '/sections/test-1.html', '/sections/test-5.html', '/full-tests/reading/', '/full-tests/listening/', '/pessage6.html', '/free/section-2/library-services', '/full-tests/reading.html']) {
      const x = await call('GET', u); assert.equal(x.status, 200, u + ' -> ' + x.status);
    }
    assert.ok((await call('GET', '/pessages/test-3.html')).text.includes('being prepared'));
    const anon = await call('GET', '/full-tests/reading/test-1.html'); assert.equal(anon.status, 302);
    const guest = jar(); await call('POST', '/api/auth/register', { body: { name: 'Free', email: 'free@example.com', password: 'Tr1cky-pass-77' }, jar: guest });
    assert.equal((await call('GET', '/full-tests/reading/test-1.html', { jar: guest })).status, 302);
    assert.equal((await call('GET', '/full-tests/reading/test-1.html', { jar: boss })).status, 200);
    assert.equal((await call('GET', '/full-tests/reading/test-1.html', { jar: user })).status, 200, 'premium member'); ok('numbered test links + premium full tests');

    // --- search engines
    r = await call('GET', '/robots.txt'); assert.ok(r.text.includes('Disallow: /admin') && /Sitemap: http/.test(r.text));
    r = await call('GET', '/sitemap.xml'); assert.ok(r.text.includes('/pessages/test-1') && r.text.includes('/full-tests/reading/') && !r.text.includes('/pessages/test-3') && !r.text.includes('/admin')); ok('robots.txt + sitemap.xml (no placeholders, no admin)');


    // --- v3: password policy, suspend, notes, details, stats, csv, extend, headers
    r = await call('POST', '/api/auth/register', { body: { name: 'Weak', email: 'weak@example.com', password: 'password123' } }); assert.equal(r.status, 400, 'common password refused');
    r = await call('POST', '/api/auth/register', { body: { name: 'Weak', email: 'weakling@example.com', password: 'weakling99' } }); assert.equal(r.status, 400, 'password containing the e-mail name refused');
    r = await call('POST', '/api/auth/register', { body: { name: 'Weak', email: 'weak2@example.com', password: 'onlyletters' } }); assert.equal(r.status, 400, 'letters only refused');
    const vj = jar(); r = await call('POST', '/api/auth/register', { body: { name: 'Vera', email: 'vera@example.com', password: 'Tr1cky-pass-77' }, jar: vj }); assert.equal(r.status, 201);
    const veraId = r.json.user.id;
    await call('POST', '/api/results', { body: { testKey: '/pessages/test-1.html', section: 'Reading', scoreCorrect: 30, scoreTotal: 40, band: 7 }, jar: vj });
    await call('POST', '/api/results', { body: { testKey: '/sections/test-1.html', section: 'Listening', scoreCorrect: 20, scoreTotal: 40 }, jar: vj });
    r = await call('GET', '/api/admin/users', { jar: boss }); const vu = r.json.users.find((x) => x.id === veraId);
    assert.equal(vu.testsCount, 2); assert.ok(vu.avgBand > 0); assert.equal(vu.blocked, false);
    r = await call('GET', '/api/admin/users/' + veraId, { jar: boss }); assert.equal(r.status, 200); assert.equal(r.json.results.length, 2); assert.equal(r.json.user.email, 'vera@example.com');
    assert.equal((await call('GET', '/api/admin/users/' + veraId, { jar: vj })).status, 403);
    r = await call('POST', `/api/admin/users/${veraId}/note`, { body: { note: 'paid in cash' }, jar: boss }); assert.equal(r.json.user.note, 'paid in cash');
    r = await call('GET', '/api/admin/stats', { jar: boss }); assert.ok(r.json.testsTotal >= 2 && r.json.chart.days.length === 14 && r.json.chart.signups.length === 14 && typeof r.json.revenue === 'object');
    r = await call('GET', '/api/admin/results', { jar: boss }); assert.ok(r.json.results.some((x) => x.userEmail === 'vera@example.com'));
    r = await call('GET', '/api/admin/users.csv', { jar: boss }); assert.ok(r.text.includes('vera@example.com') && /text\/csv/.test(r.headers.get('content-type')));
    assert.equal((await call('GET', '/api/admin/users.csv', { jar: vj })).status, 403);
    // premium is extended, never shortened
    await call('POST', `/api/admin/users/${veraId}/premium`, { body: { plan: 'Premium', days: 30 }, jar: boss });
    r = await call('POST', `/api/admin/users/${veraId}/premium`, { body: { plan: 'Premium', days: 30 }, jar: boss });
    assert.ok(Math.abs(new Date(r.json.user.premiumExpiresAt).getTime() - Date.now() - 60 * 86400000) < 60000, 'second grant adds 30 days on top');
    r = await call('POST', `/api/admin/users/${veraId}/premium`, { body: { plan: 'Premium', days: 0 }, jar: boss }); assert.equal(r.json.user.premiumExpiresAt, null);
    r = await call('POST', `/api/admin/users/${veraId}/premium`, { body: { plan: 'Premium', days: 30 }, jar: boss }); assert.equal(r.json.user.premiumExpiresAt, null, 'lifetime is not turned into a short plan');
    // suspend: session dies at once and login is refused; unsuspend restores it
    assert.equal((await call('GET', '/api/auth/me', { jar: vj })).json.user.email, 'vera@example.com');
    r = await call('POST', `/api/admin/users/${veraId}/block`, { body: { blocked: true, reason: 'abuse' }, jar: boss }); assert.equal(r.json.user.blocked, true);
    assert.equal((await call('GET', '/api/auth/me', { jar: vj })).json.user, null, 'suspended session is dead');
    assert.equal((await call('POST', '/api/auth/login', { body: { email: 'vera@example.com', password: 'Tr1cky-pass-77' } })).status, 403);
    assert.equal((await call('POST', `/api/admin/users/${bossId}/block`, { body: { blocked: true }, jar: boss })).status, 400, 'cannot suspend yourself');
    await call('POST', `/api/admin/users/${veraId}/block`, { body: { blocked: false }, jar: boss });
    assert.equal((await call('POST', '/api/auth/login', { body: { email: 'vera@example.com', password: 'Tr1cky-pass-77' }, jar: vj })).status, 200);
    r = await call('GET', '/api/admin/users/' + veraId, { jar: boss }); assert.ok(r.json.user.loginCount >= 1 && r.json.user.lastLoginAt, 'last login is recorded');
    // force sign-out everywhere
    r = await call('POST', `/api/admin/users/${veraId}/logout-all`, { jar: boss }); assert.equal(r.status, 200);
    assert.equal((await call('GET', '/api/auth/me', { jar: vj })).json.user, null, 'all sessions ended');
    // material edit
    r = await call('POST', '/api/admin/materials', { body: { type: 'reading', title: 'Edit me' }, jar: boss }); const mid = r.json.item.id;
    r = await call('PATCH', '/api/admin/materials/' + mid, { body: { premium: true, title: 'Edited' }, jar: boss }); assert.equal(r.json.item.premium, true); assert.equal(r.json.item.title, 'Edited');
    await call('DELETE', '/api/admin/materials/' + mid, { jar: boss });
    // browsers without Origin still send Sec-Fetch-Site: cross-site is refused
    assert.equal((await call('POST', '/api/auth/logout', { headers: { 'sec-fetch-site': 'cross-site' } })).status, 403);
    assert.equal((await call('POST', '/api/auth/logout', { headers: { 'sec-fetch-site': 'same-origin' } })).status, 200);
    // admin pages: strict headers
    r = await call('GET', '/admin', { jar: boss }); assert.ok(/frame-ancestors 'none'/.test(r.headers.get('content-security-policy')) && r.headers.get('x-frame-options') === 'DENY' && /noindex/.test(r.headers.get('x-robots-tag')));
    // deleting an account removes its results too
    await call('DELETE', `/api/admin/users/${veraId}`, { jar: boss });
    assert.ok(!(await call('GET', '/api/admin/results', { jar: boss })).json.results.some((x) => x.userEmail === 'vera@example.com'));
    ok('v3: password policy, suspend, notes, details, stats, csv, extend premium, headers');

    // --- tests made in the admin panel (reading / listening / writing)
    await call('DELETE', `/api/admin/users/${aliceId}/premium`, { jar: boss }); const freeU = user;
    const rd = await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'reading', title: 'Bees test', premium: false, data: { durationMin: 20, passage: 'Bees make honey.\n\nBees dance.',
      images: [{ url: '/uploads/images/x.png', caption: 'bee' }, { url: 'javascript:alert(1)' }],
      questions: [{ type: 'short', prompt: 'What do bees make?', answer: 'Honey|honey' }, { type: 'tfng', prompt: 'Bees dance.', answer: 'True' }, { type: 'mcq', prompt: 'Pick', options: ['a', 'b'], answer: 'B' }] } } });
    assert.equal(rd.status, 201); const rid = rd.json.item.id; assert.equal(rd.json.item.data.images.length, 1);
    assert.equal(rd.json.item.data.questions.length, 3);
    const pubList = await call('GET', '/api/materials?type=reading'); assert.ok(pubList.json.items.some((x) => x.id === rid && x.questionCount === 3));
    const pubOne = await call('GET', '/api/materials/' + rid); assert.equal(pubOne.status, 200);
    assert.ok(!JSON.stringify(pubOne.json).includes('Honey'), 'answers must not be sent to students');
    const gr = await call('POST', '/api/materials/' + rid + '/grade', { body: { answers: { q1: ' honey ', q2: 't', q3: 'b' }, durationSec: 60 } });
    assert.equal(gr.json.correct, 3); assert.equal(gr.json.saved, false);
    const gr2 = await call('POST', '/api/materials/' + rid + '/grade', { jar: freeU, body: { answers: { q1: 'wax' } } });
    assert.equal(gr2.json.correct, 0); assert.equal(gr2.json.saved, true);
    { // every IELTS question type is stored and graded
      const qs = [
        { type: 'completion', prompt: 'Name: ____', answer: 'smith|smyth' }, { type: 'tfng', prompt: 'a', answer: 'NOT GIVEN' }, { type: 'ynng', prompt: 'b', answer: 'NO' },
        { type: 'mcq-multi', prompt: 'Choose two', options: ['x', 'y', 'z', 'w'], answer: 'A,C' }, { type: 'matching', prompt: 'Heading for para B', options: ['i. Cost', 'ii. Risk', 'iv. Hope'], answer: 'iv' },
        { type: 'map', prompt: 'Library', options: ['A', 'B', 'C'], answer: 'B' } ];
      const mr = await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'listening', title: 'All types', data: { audioUrl: '', questions: qs } } });
      assert.equal(mr.status, 201); assert.equal(mr.json.item.data.questions.length, 6);
      assert.equal(mr.json.item.data.questions[3].options.length, 4);
      const g = await call('POST', '/api/materials/' + mr.json.item.id + '/grade', { body: { answers: { q1: 'Smith', q2: 'ng', q3: 'no', q4: 'c, a', q5: 'iv', q6: 'b' } } });
      assert.equal(g.json.correct, 6, JSON.stringify(g.json).slice(0, 300));
    }
    const wr = await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'writing', title: 'Task 1 chart', premium: true, data: { tasks: [{ title: 'Task 1', prompt: 'Describe the chart', minWords: 150, minutes: 20, sample: 'secret sample' }, { prompt: 'Essay', minWords: 250 }] } } });
    assert.equal(wr.status, 201); const wid = wr.json.item.id;
    assert.equal((await call('GET', '/api/materials/' + wid)).status, 401);            // premium + guest
    assert.equal((await call('GET', '/api/materials/' + wid, { jar: freeU })).status, 403); // premium + free user
    const wBoss = await call('GET', '/api/materials/' + wid, { jar: boss }); assert.equal(wBoss.status, 200);
    assert.ok(!JSON.stringify(wBoss.json).includes('secret sample') && wBoss.json.item.data.tasks[0].hasSample);
    assert.equal((await call('POST', '/api/materials/' + wid + '/grade', { jar: boss, body: {} })).status, 400);
    const ls = await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'listening', title: 'Library', published: false, data: { audioUrl: '/uploads/audio/a.mp3', questions: [{ prompt: 'Name?', answer: 'Smith' }] } } });
    assert.equal(ls.status, 201); assert.equal(ls.json.item.data.audioUrl, '/uploads/audio/a.mp3');
    assert.ok(!(await call('GET', '/api/materials?type=listening')).json.items.some((x) => x.id === ls.json.item.id), 'drafts are hidden');
    assert.equal((await call('GET', '/api/materials/' + ls.json.item.id)).status, 404);
    assert.equal((await call('PATCH', '/api/admin/materials/' + ls.json.item.id, { jar: boss, body: { published: true } })).status, 200);
    assert.equal((await call('GET', '/api/materials/' + ls.json.item.id)).status, 200);
    assert.equal((await call('POST', '/api/admin/materials', { jar: freeU, body: { type: 'reading', title: 'x' } })).status, 403);
    // uploads: images + audio, anything else refused
    const boundary = 'XBOUNDARYX';
    const mpart = (name, bytes, type) => Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="type"\r\n\r\n${type}\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: application/octet-stream\r\n\r\n`), bytes, Buffer.from(`\r\n--${boundary}--\r\n`)]);
    const up = (name, type) => call('POST', '/api/admin/uploads', { jar: boss, raw: mpart(name, Buffer.from('abc'), type), headers: { 'content-type': 'multipart/form-data; boundary=' + boundary } });
    const upImg = await up('map one.png', 'image'); assert.equal(upImg.status, 201); assert.ok(upImg.json.url.startsWith('/uploads/images/'));
    const upAud = await up('sec3.mp3', 'audio'); assert.equal(upAud.status, 201); assert.ok(upAud.json.url.startsWith('/uploads/audio/'));
    assert.equal((await up('evil.exe', 'image')).status, 400);
    assert.equal((await call('GET', upImg.json.url)).status, 200);
    assert.equal((await call('POST', '/api/admin/upload-url', { jar: boss, body: { filename: 'a.mp3' } })).json.local, true);
    assert.equal((await call('POST', '/api/admin/upload-url', { jar: boss, body: { filename: 'a.sh' } })).status, 400);
    assert.equal((await call('DELETE', '/api/admin/materials/' + rid, { jar: boss })).status, 200);
    ok('admin-made tests: reading/listening/writing, grading, premium lock, drafts, image + audio uploads');
    // --- access rules: free / locked + plan for every pack and test (admin panel -> Access)
    {
      const vm = require('vm');
      // accounts are created straight in the store (sign-up is rate limited per address, earlier tests used it up) and then log in for real
      const mk = async (name, email) => {
        const { salt, hash } = handler.hashPassword('Tr1cky-pass-77');
        const row = await handler.store.insertUser({ id: crypto.randomUUID(), name, email, role: 'user', plan: 'Free', premiumActive: false, premiumExpiresAt: null, passwordHash: hash, passwordSalt: salt, emailVerified: true, createdAt: new Date().toISOString() });
        const j = jar(); const lr = await call('POST', '/api/auth/login', { body: { email, password: 'Tr1cky-pass-77' }, jar: j }); assert.equal(lr.status, 200, 'login ' + email);
        return { j, id: row.id };
      };
      const stdU = await mk('Stan', 'stan@example.com'), maxU = await mk('Maxi', 'maxi@example.com'), nobody = await mk('Nora', 'nora@example.com');
      await call('POST', `/api/admin/users/${stdU.id}/premium`, { body: { plan: 'Standard', days: 30 }, jar: boss });
      await call('POST', `/api/admin/users/${maxU.id}/premium`, { body: { plan: 'Max', days: 30 }, jar: boss });
      assert.equal((await call('GET', '/api/premium/status', { jar: stdU.j })).json.level, 1);
      assert.equal((await call('GET', '/api/premium/status', { jar: maxU.j })).json.level, 2);
      assert.equal((await call('GET', '/api/premium/status', { jar: nobody.j })).json.level, 0);
      assert.equal((await call('GET', '/api/access')).json.level, 0, 'guest level 0');
      ok('plan levels: Free 0, Standard 1, Max 2');

      // defaults: every full test is locked for Free, open to any paid plan
      const page = '/full-tests/reading/test-5.html';
      assert.equal((await call('GET', page, { jar: nobody.j })).status, 302);
      assert.equal((await call('GET', page, { jar: stdU.j })).status, 200);
      assert.equal((await call('GET', page, { jar: maxU.j })).status, 200);

      // admin only
      assert.equal((await call('GET', '/api/admin/access', { jar: stdU.j })).status, 403);
      assert.equal((await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/pack-1/test-5', mode: 'free' }] }, jar: stdU.j })).status, 403);
      let r = await call('GET', '/api/admin/access', { jar: boss }); assert.equal(r.status, 200);
      const reading = r.json.skills.find((x) => x.skill === 'reading'); const pack1 = reading.packs.find((p) => p.slug === 'pack-1');
      assert.ok(pack1 && pack1.tests.length === 2 && pack1.tests[0].key === 'test:reading/pack-1/test-5', 'catalog keys');
      assert.equal(pack1.rule.mode, 'default');
      // bad input
      assert.equal((await call('POST', '/api/admin/access', { body: { changes: [{ key: '../etc', mode: 'free' }] }, jar: boss })).status, 400);
      assert.equal((await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/pack-1/test-5', mode: 'vip' }] }, jar: boss })).status, 400);
      assert.equal((await call('POST', '/api/admin/access', { body: { changes: [] }, jar: boss })).status, 400);

      // Max only for ONE test: Standard is sent to the Price page, Max still gets in
      r = await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/pack-1/test-5', mode: 'max' }] }, jar: boss }); assert.equal(r.status, 200);
      let x = await call('GET', page, { jar: stdU.j }); assert.equal(x.status, 302); assert.ok(/^\/Price\?premium=required&plan=max/.test(x.headers.get('location')), x.headers.get('location'));
      assert.equal((await call('GET', page, { jar: maxU.j })).status, 200);
      assert.equal((await call('GET', '/full-tests/reading/test-6.html', { jar: stdU.j })).status, 200, 'the other test of the pack is untouched');
      let chk = (await call('GET', '/api/access/check?path=' + encodeURIComponent('/full-tests/reading/test-5'), { jar: stdU.j })).json;
      assert.equal(chk.allowed, false); assert.equal(chk.plan, 'max'); assert.ok(chk.price.includes('plan=max'));
      assert.equal((await call('GET', '/api/access/check?path=' + encodeURIComponent('/full-tests/reading/test-5'), { jar: maxU.j })).json.allowed, true);
      ok('one test can be made Max-only (Standard -> Price page, Max still opens it)');

      // a whole pack: Free for everybody, then Max, then back to default; a test setting wins over its pack
      r = await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'free' }, { key: 'test:reading/pack-1/test-5', mode: 'default' }] }, jar: boss });
      assert.equal((await call('GET', page, { jar: nobody.j })).status, 200, 'free pack: tests inherit it');
      assert.equal((await call('GET', '/full-tests/reading/test-6.html')).status, 200, 'free for guests too');
      assert.equal((await call('GET', '/api/access')).json.rules['pack:reading/pack-1'].locked, false);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'max' }, { key: 'test:reading/pack-1/test-6', mode: 'free' }] }, jar: boss });
      assert.equal((await call('GET', page, { jar: stdU.j })).status, 302, 'locked pack: Max only');
      assert.equal((await call('GET', '/full-tests/reading/test-6.html', { jar: nobody.j })).status, 200, 'a free test inside a locked pack');
      r = await call('GET', '/api/admin/access', { jar: boss });
      const p1 = r.json.skills[0].packs.find((p) => p.slug === 'pack-1');
      assert.equal(p1.rule.mode, 'max'); assert.equal(p1.tests[0].rule.locked, true); assert.equal(p1.tests[0].rule.plan, 'max'); assert.equal(p1.tests[1].rule.mode, 'free');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'default' }, { key: 'test:reading/pack-1/test-6', mode: 'default' }] }, jar: boss });
      assert.equal((await call('GET', page, { jar: nobody.j })).status, 302, 'back to the default lock');
      assert.equal((await call('GET', page, { jar: stdU.j })).status, 200);
      ok('packs: free / Max / default, inheritance, a test setting beats its pack');

      // tests made in the admin panel follow the same rules (and the old premium flag stays in step)
      r = await call('POST', '/api/admin/materials', { body: { type: 'reading', title: 'Made in admin', pack: 'Pack 1', premium: false, data: { passage: 'Text', questions: [{ type: 'short', text: 'Q?', answer: 'a' }] } }, jar: boss });
      assert.equal(r.status, 201); const mid = r.json.item.id;
      assert.equal((await call('GET', '/api/materials/' + mid, { jar: nobody.j })).status, 200, 'free material');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'mat:' + mid, mode: 'max' }] }, jar: boss });
      assert.equal((await call('GET', '/api/materials/' + mid, { jar: stdU.j })).status, 403);
      assert.equal((await call('GET', '/api/materials/' + mid, { jar: maxU.j })).status, 200);
      assert.equal((await call('GET', '/api/materials/' + mid)).status, 401);
      let list = (await call('GET', '/api/materials?type=reading', { jar: stdU.j })).json.items.find((i) => i.id === mid); assert.equal(list.locked, true); assert.equal(list.plan, 'max');
      assert.equal((await call('GET', '/api/admin/materials/' + mid, { jar: boss })).json.item.premium, true, 'premium flag follows');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'max' }, { key: 'mat:' + mid, mode: 'default' }] }, jar: boss });
      ok('admin-made tests: Free / Standard / Max, pack setting inherited');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'default' }] }, jar: boss });
      await call('DELETE', '/api/admin/materials/' + mid, { jar: boss });
      assert.ok((await call('GET', '/api/admin/audit', { jar: boss })).json.entries.some((e) => e.action === 'access.set'), 'audited');

      // Ultra + the cards of the practice pages (Reading passages, Listening sections, Writing tasks, Speaking topics)
      const ultraU = await mk('Ulla', 'ulla@example.com');
      await call('POST', `/api/admin/users/${ultraU.id}/premium`, { body: { plan: 'Ultra', days: 30 }, jar: boss });
      assert.equal((await call('GET', '/api/premium/status', { jar: ultraU.j })).json.level, 3, 'Ultra = level 3');
      assert.equal((await call('GET', '/api/premium/status', { jar: maxU.j })).json.level, 2);
      const av = (await call('GET', '/api/admin/access', { jar: boss })).json;
      assert.deepEqual(av.plans, ['standard', 'max', 'ultra']);
      const counts = Object.fromEntries(av.skills.map((x) => [x.skill, (x.packs.find((p) => p.practice) || { tests: [] }).tests.length]));
      delete counts.article; assert.deepEqual(counts, { reading: 21, listening: 5, writing: 12, speaking: 18 }, 'all practice cards are listed');
      assert.equal((await call('GET', '/pessages/test-1.html')).status, 200, 'free by default');
      assert.equal((await call('GET', '/pessages/test-1 explanations.html')).status, 200, 'explanations untouched');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/practice-cards/test-1', mode: 'ultra' }] }, jar: boss });
      x = await call('GET', '/pessages/test-1.html', { jar: maxU.j }); assert.equal(x.status, 302); assert.ok(x.headers.get('location').includes('plan=ultra'));
      assert.equal((await call('GET', '/pessages/test-1.html', { jar: ultraU.j })).status, 200);
      assert.equal((await call('GET', '/pessages/test-2.html')).status, 200, 'other card untouched');
      assert.equal((await call('GET', '/api/access/check?path=' + encodeURIComponent('/pessages/test-1'), { jar: stdU.j })).json.allowed, false);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:listening/practice-cards', mode: 'standard' }] }, jar: boss });
      assert.equal((await call('GET', '/sections/test-3.html', { jar: nobody.j })).status, 302);
      assert.equal((await call('GET', '/sections/test-3.html', { jar: stdU.j })).status, 200);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/practice-cards/test-1', mode: 'default' }, { key: 'pack:listening/practice-cards', mode: 'default' }] }, jar: boss });
      assert.equal((await call('GET', '/sections/test-3.html')).status, 200);
      ok('Ultra plan + practice cards (Reading/Listening pages are enforced, Writing/Speaking listed)');

      // the keys the browser builds (access.js) are the keys the server knows
      const ctx = { window: {} }; vm.createContext(ctx);
      vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets/js/access.js'), 'utf8'), ctx);
      vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets/js/full-tests-data.js'), 'utf8'), ctx);
      const D = ctx.window.IELTSX_FULL_TESTS; const adminView = (await call('GET', '/api/admin/access', { jar: boss })).json; let checked = 0;
      for (const sk of adminView.skills) for (const pk of sk.packs.filter((p) => !p.extra && !p.practice)) {
        const cp = D.packs[sk.skill].find((p) => p.slug === pk.slug);
        const tests = cp.tests.map((t, i) => Object.assign({}, t, { _i: i })).sort((a, b) => ((a.number || 0) - (b.number || 0)) || (a._i - b._i));
        const pack = ctx.window.IELTSXAccess.assignKeys(sk.skill, { slug: cp.slug, tests });
        assert.equal(pack.key, pk.key);
        assert.deepEqual(tests.map((t) => t.key), pk.tests.map((t) => t.key), sk.skill + '/' + pk.slug); checked += tests.length + 1;
      }
      assert.ok(checked > 20); ok('browser keys = server keys (' + checked + ' packs and tests)');
    }
    // --- access rules: free / locked + plan for every pack and test (admin panel -> Access)
    {
      const vm = require('vm');
      // accounts are created straight in the store (sign-up is rate limited per address, earlier tests used it up) and then log in for real
      const mk = async (name, email) => {
        const { salt, hash } = handler.hashPassword('Tr1cky-pass-77');
        const row = await handler.store.insertUser({ id: crypto.randomUUID(), name, email, role: 'user', plan: 'Free', premiumActive: false, premiumExpiresAt: null, passwordHash: hash, passwordSalt: salt, emailVerified: true, createdAt: new Date().toISOString() });
        const j = jar(); const lr = await call('POST', '/api/auth/login', { body: { email, password: 'Tr1cky-pass-77' }, jar: j }); assert.equal(lr.status, 200, 'login ' + email);
        return { j, id: row.id };
      };
      const stdU = await mk('Stan', 'stan@example.com'), maxU = await mk('Maxi', 'maxi@example.com'), nobody = await mk('Nora', 'nora@example.com');
      await call('POST', `/api/admin/users/${stdU.id}/premium`, { body: { plan: 'Standard', days: 30 }, jar: boss });
      await call('POST', `/api/admin/users/${maxU.id}/premium`, { body: { plan: 'Max', days: 30 }, jar: boss });
      assert.equal((await call('GET', '/api/premium/status', { jar: stdU.j })).json.level, 1);
      assert.equal((await call('GET', '/api/premium/status', { jar: maxU.j })).json.level, 2);
      assert.equal((await call('GET', '/api/premium/status', { jar: nobody.j })).json.level, 0);
      assert.equal((await call('GET', '/api/access')).json.level, 0, 'guest level 0');
      ok('plan levels: Free 0, Standard 1, Max 2');

      // defaults: every full test is locked for Free, open to any paid plan
      const page = '/full-tests/reading/test-5.html';
      assert.equal((await call('GET', page, { jar: nobody.j })).status, 302);
      assert.equal((await call('GET', page, { jar: stdU.j })).status, 200);
      assert.equal((await call('GET', page, { jar: maxU.j })).status, 200);

      // admin only
      assert.equal((await call('GET', '/api/admin/access', { jar: stdU.j })).status, 403);
      assert.equal((await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/pack-1/test-5', mode: 'free' }] }, jar: stdU.j })).status, 403);
      let r = await call('GET', '/api/admin/access', { jar: boss }); assert.equal(r.status, 200);
      const reading = r.json.skills.find((x) => x.skill === 'reading'); const pack1 = reading.packs.find((p) => p.slug === 'pack-1');
      assert.ok(pack1 && pack1.tests.length === 2 && pack1.tests[0].key === 'test:reading/pack-1/test-5', 'catalog keys');
      assert.equal(pack1.rule.mode, 'default');
      // bad input
      assert.equal((await call('POST', '/api/admin/access', { body: { changes: [{ key: '../etc', mode: 'free' }] }, jar: boss })).status, 400);
      assert.equal((await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/pack-1/test-5', mode: 'vip' }] }, jar: boss })).status, 400);
      assert.equal((await call('POST', '/api/admin/access', { body: { changes: [] }, jar: boss })).status, 400);

      // Max only for ONE test: Standard is sent to the Price page, Max still gets in
      r = await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/pack-1/test-5', mode: 'max' }] }, jar: boss }); assert.equal(r.status, 200);
      let x = await call('GET', page, { jar: stdU.j }); assert.equal(x.status, 302); assert.ok(/^\/Price\?premium=required&plan=max/.test(x.headers.get('location')), x.headers.get('location'));
      assert.equal((await call('GET', page, { jar: maxU.j })).status, 200);
      assert.equal((await call('GET', '/full-tests/reading/test-6.html', { jar: stdU.j })).status, 200, 'the other test of the pack is untouched');
      let chk = (await call('GET', '/api/access/check?path=' + encodeURIComponent('/full-tests/reading/test-5'), { jar: stdU.j })).json;
      assert.equal(chk.allowed, false); assert.equal(chk.plan, 'max'); assert.ok(chk.price.includes('plan=max'));
      assert.equal((await call('GET', '/api/access/check?path=' + encodeURIComponent('/full-tests/reading/test-5'), { jar: maxU.j })).json.allowed, true);
      ok('one test can be made Max-only (Standard -> Price page, Max still opens it)');

      // a whole pack: Free for everybody, then Max, then back to default; a test setting wins over its pack
      r = await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'free' }, { key: 'test:reading/pack-1/test-5', mode: 'default' }] }, jar: boss });
      assert.equal((await call('GET', page, { jar: nobody.j })).status, 200, 'free pack: tests inherit it');
      assert.equal((await call('GET', '/full-tests/reading/test-6.html')).status, 200, 'free for guests too');
      assert.equal((await call('GET', '/api/access')).json.rules['pack:reading/pack-1'].locked, false);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'max' }, { key: 'test:reading/pack-1/test-6', mode: 'free' }] }, jar: boss });
      assert.equal((await call('GET', page, { jar: stdU.j })).status, 302, 'locked pack: Max only');
      assert.equal((await call('GET', '/full-tests/reading/test-6.html', { jar: nobody.j })).status, 200, 'a free test inside a locked pack');
      r = await call('GET', '/api/admin/access', { jar: boss });
      const p1 = r.json.skills[0].packs.find((p) => p.slug === 'pack-1');
      assert.equal(p1.rule.mode, 'max'); assert.equal(p1.tests[0].rule.locked, true); assert.equal(p1.tests[0].rule.plan, 'max'); assert.equal(p1.tests[1].rule.mode, 'free');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'default' }, { key: 'test:reading/pack-1/test-6', mode: 'default' }] }, jar: boss });
      assert.equal((await call('GET', page, { jar: nobody.j })).status, 302, 'back to the default lock');
      assert.equal((await call('GET', page, { jar: stdU.j })).status, 200);
      ok('packs: free / Max / default, inheritance, a test setting beats its pack');

      // tests made in the admin panel follow the same rules (and the old premium flag stays in step)
      r = await call('POST', '/api/admin/materials', { body: { type: 'reading', title: 'Made in admin', pack: 'Pack 1', premium: false, data: { passage: 'Text', questions: [{ type: 'short', text: 'Q?', answer: 'a' }] } }, jar: boss });
      assert.equal(r.status, 201); const mid = r.json.item.id;
      assert.equal((await call('GET', '/api/materials/' + mid, { jar: nobody.j })).status, 200, 'free material');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'mat:' + mid, mode: 'max' }] }, jar: boss });
      assert.equal((await call('GET', '/api/materials/' + mid, { jar: stdU.j })).status, 403);
      assert.equal((await call('GET', '/api/materials/' + mid, { jar: maxU.j })).status, 200);
      assert.equal((await call('GET', '/api/materials/' + mid)).status, 401);
      let list = (await call('GET', '/api/materials?type=reading', { jar: stdU.j })).json.items.find((i) => i.id === mid); assert.equal(list.locked, true); assert.equal(list.plan, 'max');
      assert.equal((await call('GET', '/api/admin/materials/' + mid, { jar: boss })).json.item.premium, true, 'premium flag follows');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'max' }, { key: 'mat:' + mid, mode: 'default' }] }, jar: boss });
      ok('admin-made tests: Free / Standard / Max, pack setting inherited');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:reading/pack-1', mode: 'default' }] }, jar: boss });
      await call('DELETE', '/api/admin/materials/' + mid, { jar: boss });
      assert.ok((await call('GET', '/api/admin/audit', { jar: boss })).json.entries.some((e) => e.action === 'access.set'), 'audited');

      // Ultra + the cards of the practice pages (Reading passages, Listening sections, Writing tasks, Speaking topics)
      const ultraU = await mk('Ulla', 'ulla@example.com');
      await call('POST', `/api/admin/users/${ultraU.id}/premium`, { body: { plan: 'Ultra', days: 30 }, jar: boss });
      assert.equal((await call('GET', '/api/premium/status', { jar: ultraU.j })).json.level, 3, 'Ultra = level 3');
      assert.equal((await call('GET', '/api/premium/status', { jar: maxU.j })).json.level, 2);
      const av = (await call('GET', '/api/admin/access', { jar: boss })).json;
      assert.deepEqual(av.plans, ['standard', 'max', 'ultra']);
      const counts = Object.fromEntries(av.skills.map((x) => [x.skill, (x.packs.find((p) => p.practice) || { tests: [] }).tests.length]));
      delete counts.article; assert.deepEqual(counts, { reading: 21, listening: 5, writing: 12, speaking: 18 }, 'all practice cards are listed');
      assert.equal((await call('GET', '/pessages/test-1.html')).status, 200, 'free by default');
      assert.equal((await call('GET', '/pessages/test-1 explanations.html')).status, 200, 'explanations untouched');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/practice-cards/test-1', mode: 'ultra' }] }, jar: boss });
      x = await call('GET', '/pessages/test-1.html', { jar: maxU.j }); assert.equal(x.status, 302); assert.ok(x.headers.get('location').includes('plan=ultra'));
      assert.equal((await call('GET', '/pessages/test-1.html', { jar: ultraU.j })).status, 200);
      assert.equal((await call('GET', '/pessages/test-2.html')).status, 200, 'other card untouched');
      assert.equal((await call('GET', '/api/access/check?path=' + encodeURIComponent('/pessages/test-1'), { jar: stdU.j })).json.allowed, false);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'pack:listening/practice-cards', mode: 'standard' }] }, jar: boss });
      assert.equal((await call('GET', '/sections/test-3.html', { jar: nobody.j })).status, 302);
      assert.equal((await call('GET', '/sections/test-3.html', { jar: stdU.j })).status, 200);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/practice-cards/test-1', mode: 'default' }, { key: 'pack:listening/practice-cards', mode: 'default' }] }, jar: boss });
      assert.equal((await call('GET', '/sections/test-3.html')).status, 200);
      ok('Ultra plan + practice cards (Reading/Listening pages are enforced, Writing/Speaking listed)');

      // the keys the browser builds (access.js) are the keys the server knows
      const ctx = { window: {} }; vm.createContext(ctx);
      vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets/js/access.js'), 'utf8'), ctx);
      vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets/js/full-tests-data.js'), 'utf8'), ctx);
      const D = ctx.window.IELTSX_FULL_TESTS; const adminView = (await call('GET', '/api/admin/access', { jar: boss })).json; let checked = 0;
      for (const sk of adminView.skills) for (const pk of sk.packs.filter((p) => !p.extra && !p.practice)) {
        const cp = D.packs[sk.skill].find((p) => p.slug === pk.slug);
        const tests = cp.tests.map((t, i) => Object.assign({}, t, { _i: i })).sort((a, b) => ((a.number || 0) - (b.number || 0)) || (a._i - b._i));
        const pack = ctx.window.IELTSXAccess.assignKeys(sk.skill, { slug: cp.slug, tests });
        assert.equal(pack.key, pk.key);
        assert.deepEqual(tests.map((t) => t.key), pk.tests.map((t) => t.key), sk.skill + '/' + pk.slug); checked += tests.length + 1;
      }
      assert.ok(checked > 20); ok('browser keys = server keys (' + checked + ' packs and tests)');
    }
    // --- rate limit
    let limited = false; for (let i = 0; i < 12; i++) { const x = await call('POST', '/api/auth/login', { body: { email: 'victim@example.com', password: 'x' + i } }); if (x.status === 429) limited = true; }
    assert.ok(limited); ok('login brute force is rate limited');


    realLog('\nALL SERVER TESTS PASSED');
  } catch (e) { realLog('\nFAILED:', e.stack || e); process.exitCode = 1; }
  server.close(); fs.rmSync(tmp, { recursive: true, force: true }); process.exit(process.exitCode || 0);
});


