/* IELTSX — Vercel Routing Middleware (runs on Vercel only; "npm start" checks these pages inside server.js).
   On Vercel the test pages are static files, so anybody who knew the address could download a locked test with its
   answers (assets/js/access-gate.js only hides the page in the browser). Before Vercel sends a locked page (full tests,
   practice passages / sections, Mock tests, /premium-audio/) this asks the server the same question the page script
   asks (/api/access/check) with the visitor's session cookie, and sends a visitor who may not open it to the Price page. */
export const config = { matcher: ['/full-tests/:path*', '/pessages/:path*', '/sections/:path*', '/premium-audio/:path*', '/Mock(.*)', '/mock(.*)'] };

const GATED = [
  /^\/full-tests\/(reading|listening|writing|speaking)\/test-[^/]+?(\.html)?\/?$/i,
  /^\/(pessages|sections)\/test-\d+(\.html)?\/?$/i,
  /^\/mock tests(\.html)?\/?$/i,
  /^\/premium-audio\/.+/i
];
// the same as next() of @vercel/functions: let the request go on to the file
const next = () => new Response(null, { headers: { 'x-middleware-next': '1' } });
const noStore = { 'cache-control': 'no-store, private' };

export default async function middleware(request) {
  const url = new URL(request.url);
  let path;
  try { path = decodeURIComponent(url.pathname).replace(/\/{2,}/g, '/'); } catch (e) { return new Response('Bad request', { status: 400 }); }
  if (!GATED.some((re) => re.test(path))) return next();
  const audio = /^\/premium-audio\//i.test(path);
  // only the session cookie is passed on, so a huge or broken Cookie header cannot make the check fail
  const session = (String(request.headers.get('cookie') || '').match(/(?:^|;\s*)ieltsx_session=([^;]{1,4096})/) || [])[1];
  const check = new URL('/api/access/check', url.origin); check.searchParams.set('path', path);
  let r;
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 5000);
    try { r = await fetch(check, { headers: { accept: 'application/json', ...(session ? { cookie: 'ieltsx_session=' + session } : {}) }, signal: ctl.signal }); }
    finally { clearTimeout(t); }
  } catch (e) { return next(); }   // the API cannot be reached: the page script (access-gate.js) still checks
  if (r.status >= 500) return next();
  let d = null; try { d = await r.json(); } catch (e) { /* refused below */ }
  if (r.ok && d && d.allowed !== false) return next();
  if (audio) return new Response('Premium required.', { status: 403, headers: noStore });
  const to = d && typeof d.price === 'string' && d.price.startsWith('/') && !d.price.startsWith('//') ? d.price : '/Price?premium=required&next=' + encodeURIComponent(path);
  return new Response(null, { status: 307, headers: { location: new URL(to, url.origin).toString(), ...noStore } });
}
