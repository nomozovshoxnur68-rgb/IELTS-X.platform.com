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
    for (const p of ['/data/db.json', '/data/.session-secret', '/server.js', '/package.json', '/.env.example', '/ADMIN_ACCESS.md', '/supabase-schema.sql', '/vercel.json', '/scripts/make-admin.js', '/api/../server.js', '/%2e%2e/server.js', '/..%2fserver.js', '/node_modules/x.js',
      '/ai-provider.js', '/ai-generator.js', '/reading-router.js', '/listening-router.js', '/reading-exam.js', '/listening-exam.js', '/middleware.js']) {
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

    // --- site logo (admin panel -> Logo)
    assert.deepEqual(Object.values((await call('GET', '/api/branding')).json).slice(0, 2), ['', ''], 'no logo by default');
    assert.equal((await call('POST', '/api/admin/branding', { jar: user, body: { logoUrl: 'https://cdn.example.com/x.png' } })).status, 403);
    r = await call('POST', '/api/admin/branding', { jar: boss, body: { logoUrl: 'https://cdn.example.com/logo.png', iconUrl: 'javascript:alert(1)' } });
    assert.equal(r.status, 200); assert.equal(r.json.branding.logoUrl, 'https://cdn.example.com/logo.png'); assert.equal(r.json.branding.iconUrl, '');
    // no-cache: a stale cached answer used to take a just-saved logo off the next page
    r = await call('GET', '/api/branding'); assert.equal(r.json.logoUrl, 'https://cdn.example.com/logo.png'); assert.ok(/no-cache/.test(r.headers.get('cache-control')));
    await call('POST', '/api/admin/branding', { jar: boss, body: { logoUrl: '', iconUrl: '' } });
    assert.equal((await call('GET', '/api/branding')).json.logoUrl, ''); ok('site logo: admin only, links checked, public read');

    // --- numbered tests: /pessages/test-N, /sections/test-N, /full-tests/...
    for (const u of ['/pessages/test-1.html', '/pessages/test-3.html', '/pessages/test-21.html', '/sections/test-1.html', '/sections/test-4.html', '/full-tests/reading/', '/full-tests/listening/', '/pessage6.html', '/free/section-2/library-services', '/full-tests/reading.html']) {
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
    { // reading router: PART (1 passage) and FULL (3 passages) tests made in the admin panel open in the real-exam pages
      const partNo = rd.json.item.data.no; assert.ok(partNo >= 22, 'part tests continue after pessages/test-21');
      const ex = await call('GET', '/exam/reading/' + rid); assert.equal(ex.status, 200);
      assert.ok(ex.text.includes('window.READING_TEST') && ex.text.includes('reading.js') && ex.text.includes('reading.css') && ex.text.includes('Bees test') && ex.text.includes('/part/practice/reading'));
      assert.ok(!/(href|src)="\.\.\//.test(ex.text), 'relative ../ paths are made absolute');
      const viaNo = await call('GET', '/pessages/test-' + partNo); assert.equal(viaNo.status, 200); assert.ok(viaNo.text.includes('Bees test'));
      assert.equal((await call('GET', '/pessages/test-' + (partNo + 50))).status, 404, 'unknown number is a 404');
      const fl = await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'reading', title: 'Full demo paper', data: { mode: 'full', durationMin: 60,
        passages: [{ title: 'One', passage: 'First text.' }, { title: 'Two', passage: 'Second text.' }, { title: '', passage: '' }],
        images: [{ url: '/uploads/images/y.png', passage: 2 }],
        questions: [{ type: 'short', passage: 1, prompt: 'qa', answer: 'x' }, { type: 'tfng', passage: 2, prompt: 'qb', answer: 'TRUE' }, { type: 'short', passage: 2, prompt: 'qc', answer: 'y' }] } } });
      assert.equal(fl.status, 201); const fno = fl.json.item.data.no; assert.ok(fno >= 7, 'full tests continue after full-tests/reading/test-6');
      assert.equal(fl.json.item.data.mode, 'full'); assert.equal(fl.json.item.data.questions[2].passage, 2);
      const fp = await call('GET', '/full-tests/reading/test-' + fno); assert.equal(fp.status, 200);
      assert.ok(fp.text.includes('QTOTAL = 3') && fp.text.includes('MINUTES: 60') && fp.text.includes('Full demo paper') && fp.text.includes('/full-tests/reading/'));
      assert.ok(fp.text.includes('Second text.') && fp.text.includes('"id": 3') && fp.text.includes('y.png'));
      const pl = (await call('GET', '/api/materials?type=reading')).json.items;
      assert.ok(pl.some((x) => x.id === fl.json.item.id && x.mode === 'full' && x.href === '/full-tests/reading/test-' + fno) && pl.some((x) => x.id === rid && x.mode === 'part' && x.href === '/pessages/test-' + partNo));
      const back = await call('PATCH', '/api/admin/materials/' + fl.json.item.id, { jar: boss, body: { data: { ...fl.json.item.data, title: 'x' } } });
      assert.equal(back.json.item.data.no, fno, 'the number never changes when a test is edited');
      assert.equal((await call('DELETE', '/api/admin/materials/' + fl.json.item.id, { jar: boss })).status, 200);
      // cards of the Reading practice page: picture, passage tag, question-type chips come with the test
      const cd = await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'reading', title: 'Card demo', pack: 'Starter Pack', data: { mode: 'part', coverUrl: '/uploads/images/c.png', passageLabel: 'Passage 2', cardTypes: ['Matching Headings', 'Summary Completion'], passage: 'Text.', questions: [{ type: 'tfng', prompt: 'a', answer: 'TRUE' }] } } });
      const cdPub = (await call('GET', '/api/materials?type=reading')).json.items.find((x) => x.id === cd.json.item.id);
      assert.equal(cdPub.coverUrl, '/uploads/images/c.png'); assert.equal(cdPub.passageLabel, 'Passage 2'); assert.deepEqual(cdPub.types, ['Matching Headings', 'Summary Completion']);
      const cd2 = await call('PATCH', '/api/admin/materials/' + cd.json.item.id, { jar: boss, body: { data: { ...cd.json.item.data, cardTypes: [] } } });
      assert.deepEqual((await call('GET', '/api/materials?type=reading')).json.items.find((x) => x.id === cd.json.item.id).types, ['True False Not Given'], 'chips come from the questions when none are typed');
      await call('DELETE', '/api/admin/materials/' + cd.json.item.id, { jar: boss });
      // packs made in the admin panel
      assert.ok([401, 403].includes((await call('POST', '/api/admin/packs', { body: { skill: 'reading', title: 'Hack' } })).status));
      const pk = await call('POST', '/api/admin/packs', { jar: boss, body: { skill: 'reading', title: 'Pack 9', tier: 'Tier 2', plan: 'max', group: 'Recent Exams', premium: true } });
      assert.equal(pk.status, 201); assert.equal(pk.json.pack.slug, 'pack-9'); assert.equal(pk.json.pack.plan, 'MAX');
      assert.equal((await call('POST', '/api/admin/packs', { jar: boss, body: { skill: 'reading', title: 'Pack 9' } })).status, 409);
      assert.ok((await call('GET', '/api/packs?skill=reading')).json.packs.some((x) => x.title === 'Pack 9' && x.group === 'Recent Exams'));
      assert.equal((await call('GET', '/api/packs?skill=listening')).json.packs.length, 0);
      assert.ok((await call('GET', '/api/admin/access', { jar: boss })).json.skills.find((x) => x.skill === 'reading').packs.some((x) => x.slug === 'pack-9'), 'the pack can be locked / unlocked in Access');
      await call('PATCH', '/api/admin/packs/' + pk.json.pack.id, { jar: boss, body: { published: false } });
      assert.ok(!(await call('GET', '/api/packs?skill=reading')).json.packs.some((x) => x.title === 'Pack 9'), 'hidden packs are not public');
      assert.equal((await call('DELETE', '/api/admin/packs/' + pk.json.pack.id, { jar: boss })).status, 200);
    }
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
    // writing: line graph from numbers, task type, long titles
    const longTitle = '[Demo] Test 2 - T1: Changes in car ownership in European households between 1971 and 2001 (long title)';
    const wc = await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'writing', title: longTitle, data: { tasks: [
      { prompt: 'Describe', kind: 'task1', chart: { unit: '%', years: [1961, 1971], series: [{ name: 'No car', values: [70, '39'] }, { name: 'bad', values: [1] }] } }, { prompt: 'Essay', kind: 'nonsense' }] } } });
    assert.equal(wc.status, 201); assert.equal(wc.json.item.title, longTitle);
    const ch = wc.json.item.data.tasks[0].chart;
    assert.deepEqual(ch.years, ['1961', '1971']); assert.equal(ch.series.length, 1); assert.deepEqual(ch.series[0].values, [70, 39]);
    assert.equal(wc.json.item.data.tasks[1].kind, 'task2');
    await call('DELETE', '/api/admin/materials/' + wc.json.item.id, { jar: boss });
    // articles: text + vocabulary + grammar saved in one go
    const ar = await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'article', title: 'How to clean a beach', data: { topic: 'Environment', level: 'Passage 9', lead: 'Oil spills', body: 'A slick <b>x</b>',
      imageUrl: 'javascript:alert(1)', vocabulary: [{ word: 'slick', definition: 'oil layer', definition_uz: 'neft dog‘i', synonyms: 'oil slick, sheen' }, { definition: 'no word' }], grammar: [{ title: 'Inversion', match: 'should another spill occur' }] } } });
    assert.equal(ar.status, 201); const ad = ar.json.item.data;
    assert.equal(ad.level, 'Passage 1'); assert.equal(ad.imageUrl, ''); assert.deepEqual(ad.vocabulary[0].synonyms, ['oil slick', 'sheen']);
    assert.equal(ad.vocabulary.length, 1); assert.equal(ad.grammar.length, 1);
    const card = (await call('GET', '/api/materials?type=article')).json.items.find((x) => x.id === ar.json.item.id);
    assert.equal(card.vocabCount, 1); assert.equal(card.topic, 'Environment');
    assert.equal((await call('GET', '/api/materials/' + ar.json.item.id)).json.item.data.vocabulary[0].definition_uz, 'neft dog‘i');
    assert.equal((await call('POST', '/api/materials/' + ar.json.item.id + '/grade', { body: {} })).status, 400);
    assert.equal((await call('GET', '/collections/article')).status, 200); assert.equal((await call('GET', '/writing/')).status, 200);
    await call('DELETE', '/api/admin/materials/' + ar.json.item.id, { jar: boss });
    ok('admin-made articles (vocabulary + grammar in one form) and writing line graphs');
    const ls =await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'listening', title: 'Library', published: false, data: { audioUrl: '/uploads/audio/a.mp3', questions: [{ prompt: 'Name?', answer: 'Smith' }] } } });
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
      // ?page= (what access-gate.js and middleware.js send), and the query Vercel builds: its rewrite adds path=access/check first
      assert.equal((await call('GET', '/api/access/check?page=' + encodeURIComponent('/full-tests/reading/test-5'), { jar: stdU.j })).json.allowed, false);
      assert.equal((await call('GET', '/api/access/check?path=access%2Fcheck&path=' + encodeURIComponent('/full-tests/reading/test-5'), { jar: stdU.j })).json.allowed, false);
      assert.equal((await call('GET', '/api/access/check?page=' + encodeURIComponent('/Mock tests'))).json.allowed, false, 'Mock tests need a plan');
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
      delete counts.article; assert.deepEqual(counts, { reading: 21, listening: 4, writing: 12, speaking: 18 }, 'all practice cards are listed');
      assert.equal((await call('GET', '/pessages/test-1.html')).status, 200, 'free by default');
      assert.equal((await call('GET', '/pessages/test-1 explanations.html')).status, 200, 'explanations untouched');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/practice-cards/test-1', mode: 'ultra' }] }, jar: boss });
      x = await call('GET', '/pessages/test-1.html', { jar: maxU.j }); assert.equal(x.status, 302); assert.ok(x.headers.get('location').includes('plan=ultra'));
      assert.equal((await call('GET', '/pessages/test-1.html', { jar: ultraU.j })).status, 200);
      assert.equal((await call('GET', '/pessages/test-2.html')).status, 200, 'other card untouched');
      assert.equal((await call('GET', '/api/access/check?path=' + encodeURIComponent('/pessages/test-1'), { jar: stdU.j })).json.allowed, false);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:listening/practice-cards/test-3', mode: 'standard' }] }, jar: boss });
      assert.equal((await call('GET', '/sections/test-3.html', { jar: nobody.j })).status, 302);
      assert.equal((await call('GET', '/sections/test-3.html', { jar: stdU.j })).status, 200);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/practice-cards/test-1', mode: 'default' }, { key: 'test:listening/practice-cards/test-3', mode: 'default' }] }, jar: boss });
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
      // ?page= (what access-gate.js and middleware.js send), and the query Vercel builds: its rewrite adds path=access/check first
      assert.equal((await call('GET', '/api/access/check?page=' + encodeURIComponent('/full-tests/reading/test-5'), { jar: stdU.j })).json.allowed, false);
      assert.equal((await call('GET', '/api/access/check?path=access%2Fcheck&path=' + encodeURIComponent('/full-tests/reading/test-5'), { jar: stdU.j })).json.allowed, false);
      assert.equal((await call('GET', '/api/access/check?page=' + encodeURIComponent('/Mock tests'))).json.allowed, false, 'Mock tests need a plan');
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
      delete counts.article; assert.deepEqual(counts, { reading: 21, listening: 4, writing: 12, speaking: 18 }, 'all practice cards are listed');
      assert.equal((await call('GET', '/pessages/test-1.html')).status, 200, 'free by default');
      assert.equal((await call('GET', '/pessages/test-1 explanations.html')).status, 200, 'explanations untouched');
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/practice-cards/test-1', mode: 'ultra' }] }, jar: boss });
      x = await call('GET', '/pessages/test-1.html', { jar: maxU.j }); assert.equal(x.status, 302); assert.ok(x.headers.get('location').includes('plan=ultra'));
      assert.equal((await call('GET', '/pessages/test-1.html', { jar: ultraU.j })).status, 200);
      assert.equal((await call('GET', '/pessages/test-2.html')).status, 200, 'other card untouched');
      assert.equal((await call('GET', '/api/access/check?path=' + encodeURIComponent('/pessages/test-1'), { jar: stdU.j })).json.allowed, false);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:listening/practice-cards/test-3', mode: 'standard' }] }, jar: boss });
      assert.equal((await call('GET', '/sections/test-3.html', { jar: nobody.j })).status, 302);
      assert.equal((await call('GET', '/sections/test-3.html', { jar: stdU.j })).status, 200);
      await call('POST', '/api/admin/access', { body: { changes: [{ key: 'test:reading/practice-cards/test-1', mode: 'default' }, { key: 'test:listening/practice-cards/test-3', mode: 'default' }] }, jar: boss });
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
    // --- Part practice / Full tests for all four skills, and built-in packs changed from the admin panel
    {
      const mk = async (type, mode, data, pack) => (await call('POST', '/api/admin/materials', { jar: boss, body: { type, title: type + ' ' + mode + ' mode test', pack: pack || '', data: { mode, ...data } } })).json.item;
      const lp = await mk('listening', 'part', { audioUrl: 'https://example.com/a.mp3', questions: [{ type: 'gap', prompt: 'Name ____', answer: 'Tom' }] });
      const lf = await mk('listening', 'full', { audioUrl: 'https://example.com/full.mp3', transcript: 'PART 1\nA: My name is Tom\nPART 2\nB: Mill Street', questions: [
        { type: 'gap', passage: 2, gi: 1, prompt: 'Street ____', answer: 'Mill' }, { type: 'gap', passage: 1, gi: 0, prompt: 'Name ____', answer: 'Tom' }] }, 'Pack 5');
      const wf = await mk('writing', 'full', { tasks: [{ prompt: 'Task one' }, { prompt: 'Task two', kind: 'task2' }] }, 'Pack 5');
      const sf = await mk('speaking', 'full', { parts: [{ title: 'Part 1', questions: ['Do you work?'] }, { title: 'Part 2', prompt: 'Describe a book' }] }, 'Jan-August');
      const sp = await mk('speaking', 'part', { parts: [{ title: 'Part 2', prompt: 'Describe a city' }] });
      assert.equal(lp.data.mode, 'part'); assert.ok(lp.data.no > 0, 'a section gets its /sections/test-N number');
      assert.equal(lf.data.mode, 'full'); assert.equal(lf.data.no, 0, 'a full paper is not a section'); assert.equal(lf.data.questions[0].passage, 2, 'Part 4 / 2 kept');
      const ids = (r) => r.json.items.map((x) => x.id);
      assert.ok(ids(await call('GET', '/api/materials?type=listening&mode=full')).includes(lf.id) && !ids(await call('GET', '/api/materials?type=listening&mode=full')).includes(lp.id));
      assert.ok(ids(await call('GET', '/api/materials?type=listening&mode=part')).includes(lp.id) && !ids(await call('GET', '/api/materials?type=listening&mode=part')).includes(lf.id));
      assert.ok(ids(await call('GET', '/api/materials?type=speaking&mode=full')).includes(sf.id) && ids(await call('GET', '/api/materials?type=speaking&mode=part')).includes(sp.id));
      assert.ok(ids(await call('GET', '/api/materials?type=writing&mode=full')).includes(wf.id));
      const fl = (await call('GET', '/api/materials?type=listening&mode=full')).json.items.find((x) => x.id === lf.id);
      assert.equal(fl.href, '/exam/listening/' + lf.id); assert.equal((await call('GET', '/api/materials?type=speaking')).json.items.find((x) => x.id === sf.id).href, '/test?id=' + sf.id);
      const page = await call('GET', fl.href, { jar: boss }); assert.equal(page.status, 200);
      assert.ok(page.text.includes('"label":"Full test"') && page.text.indexOf('"partHead":"Part 1"') < page.text.indexOf('"partHead":"Part 2"'), 'parts in order, each with its heading');
      assert.ok(/"from":1,"to":2/.test(page.text), 'a full paper is numbered from 1');
      assert.ok(page.text.includes('"finishUrl":"/full-tests/listening/"'), 'Finish goes back to the Full Listening page');
      assert.ok((await call('GET', lp.href || '/sections/test-' + lp.data.no, { jar: boss })).text.includes('"finishUrl":"/part/practice/listening"'), 'Finish of a section goes back to the practice page');
      for (const f of ['pdf.min.js', 'pdf.worker.min.js']) { const r = await call('GET', '/assets/js/vendor/pdfjs/' + f); assert.equal(r.status, 200, f); assert.ok(/javascript/.test(r.headers.get('content-type') || ''), f + ' type'); }
      for (const s of ['reading', 'listening', 'writing', 'speaking']) for (const m of ['part', 'full']) { const r = await call('GET', `/assets/samples/${s}-${m}.pdf`); assert.equal(r.status, 200, s + '-' + m); assert.ok(r.text.startsWith('%PDF-'), s + '-' + m + ' is a PDF'); }
      // a locked article names its plan; the old saved article pages are gone
      const art = (await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'article', title: 'Max article', premium: true, data: { lead: 'x', body: 'y' } } })).json.item;
      await call('POST', '/api/admin/access', { jar: boss, body: { changes: [{ key: 'mat:' + art.id, mode: 'max' }] } });
      const artPub = (await call('GET', '/api/materials?type=article')).json.items.find((x) => x.id === art.id);
      assert.ok(artPub.locked && artPub.plan === 'max', 'the list says it is a Max article');
      assert.equal((await call('GET', '/api/materials/' + art.id)).status, 401);
      assert.equal((await call('GET', '/collections/article-1')).status, 404);
      await call('DELETE', '/api/admin/materials/' + art.id, { jar: boss });
      // Part -> Full: the same test moves to the other list (a section number is dropped)
      const moved = (await call('PATCH', '/api/admin/materials/' + lp.id, { jar: boss, body: { data: { ...lp.data, mode: 'full' } } })).json.item;
      assert.equal(moved.data.mode, 'full'); assert.equal(moved.data.no, 0);
      // a built-in pack: renamed, put first, then hidden (an override with the same slug)
      const ov = await call('POST', '/api/admin/packs', { jar: boss, body: { skill: 'listening', slug: 'pack-6', title: 'Pack 6 · New name', order: 1, group: 'Recent Exams' } });
      assert.equal(ov.status, 201); assert.equal(ov.json.pack.slug, 'pack-6', 'the built-in address is kept');
      let view = (await call('GET', '/api/admin/access', { jar: boss })).json.skills.find((s) => s.skill === 'listening');
      const p6 = view.packs.find((p) => p.key === 'pack:listening/pack-6'); assert.equal(p6.title, 'Pack 6 · New name'); assert.equal(p6.order, 1); assert.ok(p6.builtIn && p6.adminId);
      assert.ok(view.packs.find((p) => p.key === 'pack:listening/pack-5').tests.some((t) => t.id === lf.id && t.mode === 'full'));
      await call('PATCH', '/api/admin/packs/' + ov.json.pack.id, { jar: boss, body: { published: false } });
      const pub = (await call('GET', '/api/packs?skill=listening')).json.packs.find((x) => x.slug === 'pack-6');
      assert.ok(pub && pub.hidden && !pub.title, 'a hidden pack is only named');
      assert.equal((await call('DELETE', '/api/admin/packs/' + ov.json.pack.id, { jar: boss })).status, 200);
      for (const m of [lp, lf, wf, sf, sp]) await call('DELETE', '/api/admin/materials/' + m.id, { jar: boss });
      ok('Part / Full tests for Reading, Listening, Writing, Speaking + built-in packs managed from the admin panel');
    }
    // --- AI Test Generator, against a local stand-in for the Gemini API (no real AI is called by the self-test)
    {
      const KEY = 'test-gemini-key-123';
      const PASSAGE = 'The first glass was made in Mesopotamia around 3500 BC. Glass blowing was discovered in the first century BC and made glass cheap. In 1959 Alastair Pilkington introduced the float process, which produces flat glass.';
      const fake = { mode: 'generate', calls: 0, deleted: [], seenKey: true, lastBody: null, delay: 0, models: [] };
      const reply = (res, status, obj, headers) => { res.writeHead(status, { 'content-type': 'application/json', ...(headers || {}) }); res.end(JSON.stringify(obj)); };
      const gen = (text, finishReason) => ({ candidates: [{ content: { parts: [{ text }] }, finishReason: finishReason || 'STOP' }] });
      const gemini = http.createServer((req, res) => {
        let body = ''; req.on('data', (c) => { body += c; }); req.on('end', async () => {
          if (req.url.startsWith('/upload/v1beta/files') && req.headers['x-goog-upload-command'] === 'start') return reply(res, 200, {}, { 'x-goog-upload-url': `http://127.0.0.1:${gemini.address().port}/upload-target` });
          if (req.url === '/upload-target') return reply(res, 200, { file: { name: 'files/abc123', uri: 'https://files.example/abc123', mimeType: 'audio/mp3', state: 'ACTIVE' } });
          if (req.method === 'DELETE') { fake.deleted.push(req.url); return reply(res, 200, {}); }
          if (req.headers['x-goog-api-key'] !== KEY) { fake.seenKey = false; return reply(res, 400, { error: { code: 400, message: 'API key not valid. Please pass a valid API key.', status: 'INVALID_ARGUMENT' } }); }
          fake.calls += 1; fake.lastBody = JSON.parse(body || '{}');
          const model = (/\/models\/([^:]+):generateContent/.exec(req.url) || [])[1] || ''; fake.models.push(model);
          if (fake.delay) await new Promise((ok) => setTimeout(ok, fake.delay));
          const m = fake.mode;
          if (m === 'fallback' && model === 'gemini-3.8-flash') return reply(res, 404, { error: { code: 404, message: 'models/gemini-3.8-flash is not found for API version v1beta', status: 'NOT_FOUND' } });
          if (m === 'thinking400' && fake.lastBody.generationConfig.thinkingConfig) return reply(res, 400, { error: { code: 400, message: 'Invalid JSON payload received. Unknown name "thinkingLevel" at \'generation_config.thinking_config\'', status: 'INVALID_ARGUMENT' } });
          if (m === 'thought') return reply(res, 200, { candidates: [{ content: { parts: [{ thought: true, text: 'Let me think about the passage…' }, { text: JSON.stringify({ groups: [{ type: 'tfng', section: 1, instruction: 'TFNG', questions: [{ prompt: 'Glass came from Mesopotamia.', answer: 'TRUE', explanation: 'Line 1.', evidence: 'made in Mesopotamia', origin: 'ai' }] }] }) }] }, finishReason: 'STOP' }] });
          if (m === '429') return reply(res, 429, { error: { code: 429, message: 'Resource exhausted', status: 'RESOURCE_EXHAUSTED' } });
          if (m === '404') return reply(res, 404, { error: { code: 404, message: 'models/x is not found', status: 'NOT_FOUND' } });
          if (m === 'malformed') return reply(res, 200, gen('Sure! Here are your questions: 1. ...'));
          if (m === 'recitation') return reply(res, 200, gen('', 'RECITATION'));
          if (m === 'transcribe') return reply(res, 200, gen(JSON.stringify({ segments: [{ start: 3, part: 1, speaker: 'MAN', text: 'Good morning, my name is Tom Clarke.' }, { start: 9, part: 1, speaker: 'WOMAN', text: 'I live on Mill Street.' }] })));
          if (m === 'complete') return reply(res, 200, gen(JSON.stringify({ answers: [{ id: 'g1q1', answer: 'TRUE', explanation: 'Line 1.', evidence: 'made in Mesopotamia around 3500 BC' }, { id: 'g1q2', answer: 'TRUE', explanation: 'Line 2.', evidence: 'made glass cheap' }] })));
          return reply(res, 200, gen(JSON.stringify({ groups: [
            { type: 'tfng', section: 1, instruction: 'Do the following statements agree with the information given in the passage?', questions: [
              { prompt: 'Glass was first made in Mesopotamia.', answer: 'T', explanation: 'Sentence 1.', evidence: 'The first glass was made in Mesopotamia', origin: 'ai' },
              { prompt: 'Pilkington was a Roman.', answer: 'NOT GIVEN', explanation: 'Not stated.', evidence: 'Pilkington was born in Rome', origin: 'ai' }] },
            { type: 'short', section: 1, instruction: 'Complete the sentence. Write ONE WORD ONLY.', questions: [
              { prompt: 'The float process produces ____ glass.', answer: 'flat', explanation: 'Last sentence.', evidence: 'which produces flat glass', origin: 'ai' },
              { prompt: 'Glass blowing made glass ____.', answer: '', explanation: 'Ambiguous.', evidence: '', origin: 'ai' }] },
            { type: 'essay', section: 1, instruction: 'x', questions: [{ prompt: 'bad type', answer: 'x', explanation: '', evidence: '', origin: 'ai' }] }] })));
        });
      });
      await new Promise((ok) => gemini.listen(0, ok));
      const env0 = { ...process.env };
      const ai = (b, j) => call('POST', '/api/admin/ai/generate', { jar: j || boss, body: b });
      const reading = (extra) => ({ skill: 'reading', mode: 'part', title: 'Glass', count: 4, types: ['tfng', 'short'], passages: [{ title: 'Glass', text: PASSAGE }], ...(extra || {}) });
      try {
        // only admins; the server says plainly when the AI is not set up
        delete process.env.GEMINI_API_KEY; process.env.AI_PROVIDER = 'gemini';
        assert.equal((await call('GET', '/api/admin/ai/status')).status, 401);
        assert.equal((await call('GET', '/api/admin/ai/status', { jar: user })).status, 403);
        assert.equal((await ai(reading(), user)).status, 403);
        let r = await call('GET', '/api/admin/ai/status', { jar: boss }); assert.equal(r.json.configured, false); assert.ok(/GEMINI_API_KEY/.test(r.json.problem));
        r = await ai(reading()); assert.equal(r.status, 503); assert.ok(/GEMINI_API_KEY/.test(r.json.error));
        // set up: the key goes to Gemini in a header and never comes back to the browser
        Object.assign(process.env, { GEMINI_API_KEY: KEY, GEMINI_API_BASE: `http://127.0.0.1:${gemini.address().port}`, AI_MODEL: 'gemini-test-flash', AI_TIMEOUT_MS: '5000' });
        r = await call('GET', '/api/admin/ai/status', { jar: boss }); assert.equal(r.json.configured, true); assert.equal(r.json.model, 'gemini-test-flash'); assert.ok(!r.text.includes(KEY));
        // input checks
        assert.equal((await ai({ skill: 'maths' })).status, 400);
        assert.equal((await ai({ skill: 'reading' })).status, 400, 'no passage');
        assert.equal((await ai({ skill: 'listening' })).status, 400, 'no transcript');
        // generate: unknown types left out, answers normalised, evidence looked up in the passage, no answer = warning
        r = await ai(reading()); assert.equal(r.status, 200, r.text); assert.ok(fake.seenKey);
        assert.ok(fake.lastBody.generationConfig.responseSchema && fake.lastBody.contents[0].parts[0].text.includes('Mesopotamia'));
        // the schema as the API reference writes it (OBJECT / ARRAY / STRING), JSON mode on, no thinking setting for a non-Gemini-3 model
        const sch = fake.lastBody.generationConfig.responseSchema;
        assert.equal(sch.type, 'OBJECT'); assert.equal(sch.properties.groups.type, 'ARRAY'); assert.equal(sch.properties.groups.items.properties.questions.items.properties.prompt.type, 'STRING');
        assert.equal(fake.lastBody.generationConfig.responseMimeType, 'application/json'); assert.equal(fake.lastBody.generationConfig.thinkingConfig, undefined);
        assert.equal(r.json.groups.length, 2); assert.equal(r.json.groups[0].items[0].answer, 'TRUE');
        assert.equal(r.json.groups[0].items[0].verified, true); assert.equal(r.json.groups[0].items[1].verified, false);
        assert.ok(r.json.warnings.some((w) => /essay/.test(w)) && r.json.warnings.some((w) => /not found in the passage/.test(w)) && r.json.warnings.some((w) => /no answer/.test(w)));
        assert.deepEqual([r.json.stats.questions, r.json.stats.byAi, r.json.stats.verified, r.json.stats.noAnswer], [4, 4, 2, 1]);
        assert.ok(!r.text.includes(KEY));
        // the same request again: from the cache, no second AI call
        const before = fake.calls; r = await ai(reading()); assert.equal(r.json.cached, true); assert.equal(fake.calls, before);
        // the questions of the source: kept word for word; a disagreeing key is kept and reported
        fake.mode = 'complete';
        r = await ai(reading({ task: 'complete', groups: [{ type: 'tfng', section: 1, instruction: 'TFNG', items: [{ prompt: 'Glass came from Mesopotamia.', answer: 'FALSE' }, { prompt: 'Blowing made glass cheaper.' }] }] }));
        assert.equal(r.status, 200, r.text); assert.equal(r.json.groups[0].items[0].prompt, 'Glass came from Mesopotamia.'); assert.equal(r.json.groups[0].items[0].answer, 'FALSE');
        assert.equal(r.json.groups[0].items[1].answer, 'TRUE'); assert.ok(r.json.groups[0].items.every((it) => it.origin === 'source'));
        assert.ok(r.json.warnings.some((w) => /answer key says “FALSE”/.test(w)));
        // AI errors become clear messages; a bad answer is never saved or cached
        for (const [mode, status, re] of [['malformed', 502, /not valid JSON/], ['429', 429, /rate limit|quota/], ['404', 503, /AI_MODEL/], ['recitation', 422, /published text/]]) {
          fake.mode = mode; r = await ai(reading({ title: 'err ' + mode })); assert.equal(r.status, status, mode + ' ' + r.text); assert.ok(re.test(r.json.error), mode + ': ' + r.json.error); assert.ok(!r.text.includes(KEY));
        }
        process.env.GEMINI_API_KEY = 'wrong-key'; fake.mode = 'generate';
        r = await ai(reading({ title: 'bad key' })); assert.equal(r.status, 503); assert.ok(/refused the API key/.test(r.json.error)); process.env.GEMINI_API_KEY = KEY;
        fake.delay = 1500; process.env.AI_TIMEOUT_MS = '600';
        r = await ai(reading({ title: 'slow' })); assert.equal(r.status, 504); assert.ok(/too long/.test(r.json.error)); process.env.AI_TIMEOUT_MS = '5000';
        // one generation at a time per admin: a second click while the first runs is refused
        const [a1, a2] = await Promise.all([ai(reading({ title: 'twice A' })), new Promise((ok) => setTimeout(ok, 200)).then(() => ai(reading({ title: 'twice B' })))]);
        assert.deepEqual([a1.status, a2.status].sort(), [200, 409]); fake.delay = 0;
        // listening: only a recording uploaded in this panel is sent to the AI, and the copy there is deleted afterwards
        const bd = 'AIBOUNDARY'; const mp = (name, bytes) => Buffer.concat([Buffer.from(`--${bd}\r\nContent-Disposition: form-data; name="type"\r\n\r\naudio\r\n--${bd}\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: audio/mpeg\r\n\r\n`), bytes, Buffer.from(`\r\n--${bd}--\r\n`)]);
        const upA = await call('POST', '/api/admin/uploads', { jar: boss, raw: mp('part1.mp3', Buffer.from('ID3fake-audio')), headers: { 'content-type': 'multipart/form-data; boundary=' + bd } });
        assert.equal(upA.status, 201);
        const tr = (b) => call('POST', '/api/admin/ai/transcribe', { jar: boss, body: b });
        assert.equal((await tr({ audioUrl: 'https://evil.example/a.mp3' })).status, 400, 'other websites are not fetched');
        assert.equal((await tr({ audioUrl: '/uploads/audio/../../data/db.json' })).status, 400, 'not an audio file');
        assert.equal((await tr({ audioUrl: '/uploads/audio/..%2F..%2Fserver.mp3' })).status, 404);
        assert.equal((await call('POST', '/api/admin/ai/transcribe', { jar: user, body: { audioUrl: upA.json.url } })).status, 403);
        fake.mode = 'transcribe'; r = await tr({ audioUrl: upA.json.url });
        assert.equal(r.status, 200, r.text); assert.equal(r.json.segments.length, 2); assert.equal(r.json.segments[1].start, 9); assert.ok(fake.deleted.some((u) => /files\/abc123/.test(u)), 'the copy at the AI service is deleted');
        fake.mode = 'generate';   // the listening reply reuses the reading stand-in: a reading type is left out, the check runs against the transcript
        r = await ai({ skill: 'listening', mode: 'part', count: 2, transcript: r.json.segments });
        assert.equal(r.status, 200, r.text); assert.ok(r.json.groups.every((g) => g.type === 'gap'), 'completion becomes the listening gap type');
        assert.ok(r.json.warnings.some((w) => /not in the transcript/.test(w)) && r.json.warnings.some((w) => /tfng/.test(w)));
        // what is saved keeps where a question came from and when its answer is heard; students never get either
        const saved = (await call('POST', '/api/admin/materials', { jar: boss, body: { type: 'listening', title: 'AI listening', published: false, data: { audioUrl: 'https://cdn.example.com/a.mp3', questions: [{ type: 'gap', prompt: 'Name ____', answer: 'Tom', origin: 'ai', at: 3 }] } } })).json.item;
        assert.equal(saved.published, false); assert.equal(saved.data.questions[0].origin, 'ai'); assert.equal(saved.data.questions[0].at, 3);
        await call('PATCH', '/api/admin/materials/' + saved.id, { jar: boss, body: { published: true } });
        const pubQ = (await call('GET', '/api/materials/' + saved.id, { jar: boss })).json.item.data.questions[0];
        assert.ok(pubQ.origin === undefined && pubQ.at === undefined && pubQ.answer === undefined);
        await call('DELETE', '/api/admin/materials/' + saved.id, { jar: boss });
        // no AI_MODEL: Google's recommended Flash model first, the next one when the key may not use it (and it is remembered)
        delete process.env.AI_MODEL; fake.mode = 'fallback'; fake.models = [];
        r = await ai(reading({ title: 'fallback' })); assert.equal(r.status, 200, r.text);
        assert.deepEqual(fake.models.slice(0, 2), ['gemini-3.8-flash', 'gemini-flash-latest']); assert.equal(r.json.model, 'gemini-flash-latest');
        assert.equal((await call('GET', '/api/admin/ai/status', { jar: boss })).json.model, 'gemini-flash-latest');
        // a Gemini 3 model: low thinking level; its "thought" parts are not the answer
        process.env.AI_MODEL = 'gemini-3.8-flash'; fake.mode = 'thought';
        r = await ai(reading({ title: 'thought' })); assert.equal(r.status, 200, r.text);
        assert.deepEqual(fake.lastBody.generationConfig.thinkingConfig, { thinkingLevel: 'low' }); assert.equal(r.json.groups[0].items[0].answer, 'TRUE');
        // an API that does not know thinkingLevel: asked again without it
        fake.mode = 'thinking400'; fake.calls = 0;
        r = await ai(reading({ title: 'thinking400' })); assert.equal(r.status, 200, r.text); assert.equal(fake.calls, 2); assert.equal(fake.lastBody.generationConfig.thinkingConfig, undefined);
        // the hourly limit per admin
        process.env.AI_HOURLY_LIMIT = '1'; fake.mode = 'generate';
        r = await ai(reading({ title: 'limit check' })); assert.equal(r.status, 429);
        ok('AI Test Generator: admins only, key stays on the server, answers checked against the source, cache, one run at a time, clear AI errors, uploaded files only');
      } finally {
        for (const k of ['GEMINI_API_KEY', 'GEMINI_API_BASE', 'AI_MODEL', 'AI_TIMEOUT_MS', 'AI_PROVIDER', 'AI_HOURLY_LIMIT']) { if (env0[k] === undefined) delete process.env[k]; else process.env[k] = env0[k]; }
        gemini.close();
      }
    }
    // --- rate limit
    let limited = false; for (let i = 0; i < 12; i++) { const x = await call('POST', '/api/auth/login', { body: { email: 'victim@example.com', password: 'x' + i } }); if (x.status === 429) limited = true; }
    assert.ok(limited); ok('login brute force is rate limited');


    realLog('\nALL SERVER TESTS PASSED');
  } catch (e) { realLog('\nFAILED:', e.stack || e); process.exitCode = 1; }
  server.close(); fs.rmSync(tmp, { recursive: true, force: true }); process.exit(process.exitCode || 0);
});


