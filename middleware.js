/* IELTSX — Vercel Routing Middleware (runs on Vercel only; "npm start" checks these pages inside server.js).
   On Vercel the test pages are static files, so anybody who knew the address could download a locked test with its
   answers (assets/js/access-gate.js only hides the page in the browser). Before Vercel sends a locked page (full tests,
   practice passages / sections, /premium-audio/) this asks the server the same question the page script asks
   (/api/access/check) with the visitor's session cookie, and sends a visitor who may not open it to the Price page.
   The papers of a Full Mock (full-mock/listening-*.html, reading-*.html, the Listening answer packs and recordings) are
   sent only inside the student's own attempt: the check gets the session cookie and the signed attempt cookie
   (ieltsx_mock, see mock-tests.js), and refuses when the API cannot be asked. full-mock/js/tests.js is never sent.
   It also keeps the server's own files private: Vercel would otherwise send server.js, the AI modules, scripts/ … as
   static files (the Node server refuses them itself, see isBlocked() in server.js). */
export const config = { matcher: ['/full-tests/:path*', '/pessages/:path*', '/sections/:path*', '/premium-audio/:path*', '/full-mock/:path*',
  '/server.js', '/ai-provider.js', '/ai-generator.js', '/ai-examiner.js', '/ai-store.js', '/mock-tests.js', '/reading-router.js', '/listening-router.js', '/reading-exam.js', '/listening-exam.js', '/middleware.js', '/site-check.js',
  '/supabase-schema.sql', '/vercel.json', '/package.json', '/README.md', '/GOOGLE_SETUP.md', '/VERCEL_SETUP.md', '/scripts/:path*', '/data/:path*', '/reading-src/:path*', '/listening-src/:path*', '/speaking-src/:path*'] };

const PRIVATE = /^\/(?:server|ai-provider|ai-generator|ai-examiner|ai-store|mock-tests|reading-router|listening-router|reading-exam|listening-exam|middleware|site-check)\.js$|^\/(?:supabase-schema\.sql|vercel\.json|package\.json)$|\.md$|^\/(?:scripts|data|reading-src|listening-src|speaking-src)\/|^\/full-mock\/js\/tests\.js$/i;

const GATED = [
  /^\/full-tests\/(reading|listening|writing|speaking)\/test-[^/]+?(\.html)?\/?$/i,
  /^\/(pessages|sections)\/test-\d+(\.html)?\/?$/i,
  /^\/premium-audio\/.+/i
];
// a Full Mock paper (the page has its answers inside), the Listening answer packs, the recordings
const MOCK = /^\/full-mock\/(?:(?:listening|reading)-[^/]+?(?:\.html)?\/?|js\/listening\.js|assets\/audio\/.+)$/i;
// the same as next() of @vercel/functions: let the request go on to the file
const next = () => new Response(null, { headers: { 'x-middleware-next': '1' } });
const noStore = { 'cache-control': 'no-store, private' };
const cookieOf = (request, name) => (String(request.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]{1,4096})')) || [])[1];

export default async function middleware(request) {
  const url = new URL(request.url);
  let path;
  try { path = decodeURIComponent(url.pathname).replace(/\/{2,}/g, '/'); } catch (e) { return new Response('Bad request', { status: 400 }); }
  if (PRIVATE.test(path)) return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', ...noStore } });
  const mock = MOCK.test(path);
  if (!mock && !GATED.some((re) => re.test(path))) return next();
  const audio = /^\/premium-audio\//i.test(path) || (mock && !/(?:listening|reading)-[^/]+?(?:\.html)?\/?$/i.test(path));
  // only the session (and the mock attempt) cookie is passed on, so a huge or broken Cookie header cannot make the check fail
  const session = cookieOf(request, 'ieltsx_session'); const attempt = mock ? cookieOf(request, 'ieltsx_mock') : '';
  const cookie = [session ? 'ieltsx_session=' + session : '', attempt ? 'ieltsx_mock=' + attempt : ''].filter(Boolean).join('; ');
  // ?page=, not ?path=: the "/api/:path*" rewrite of vercel.json puts its own "path" into the query
  const check = new URL('/api/access/check', url.origin); check.searchParams.set('page', path);
  let r;
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 5000);
    try { r = await fetch(check, { headers: { accept: 'application/json', ...(cookie ? { cookie } : {}) }, signal: ctl.signal }); }
    finally { clearTimeout(t); }
  } catch (e) { r = null; }
  // the API cannot be asked: a test page is still checked by its page script (access-gate.js); a mock paper is refused
  if (!r || r.status >= 500) return mock ? new Response('Please try again in a moment.', { status: 503, headers: { 'retry-after': '5', ...noStore } }) : next();
  let d = null; try { d = await r.json(); } catch (e) { /* refused below */ }
  if (r.ok && d && d.allowed !== false) return next();
  if (audio) return new Response(mock ? 'This file opens only inside your mock test.' : 'Premium required.', { status: 403, headers: noStore });
  const to = d && typeof d.price === 'string' && d.price.startsWith('/') && !d.price.startsWith('//') ? d.price : '/Price?premium=required&next=' + encodeURIComponent(path);
  return new Response(null, { status: 307, headers: { location: new URL(to, url.origin).toString(), ...noStore } });
}
