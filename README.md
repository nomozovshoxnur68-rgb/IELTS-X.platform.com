# IELTSX

Static IELTS practice site + one small Node server for **accounts, premium, payments, results and admin**.
No npm packages (Node 18+).

```bash
npm start            # http://localhost:3000
npm test             # 23 checks: accounts, premium, orders, results, file protection ...
```

## Test links (always `test-1`, `test-2`, ... in listing order)

| What | URL | Notes |
| --- | --- | --- |
| Reading passages (practice cards) | `/pessages/test-1.html` ... `test-21.html` | same order as the cards; 1, 2, 7, 17-21 have content, the rest show "coming soon" |
| Listening sections (practice cards) | `/sections/test-1.html` ... `test-5.html` | 1 and 5 have content |
| Reading full tests (premium) | `/full-tests/reading/test-1.html` ... `test-4.html` | list: `/full-tests/reading/` |
| Listening full test (premium) | `/full-tests/listening/test-1.html` | list: `/full-tests/listening/` |

To add a test: drop the real page over the matching placeholder file (keep the file name), and set the card text
in `assets/js/app.js` (reading, `cardData`) or `part/practice/listening.html` (listening). Old links such as
`/pessage6.html` or `/Full_Reading_Test_8.html` still work (`ALIASES` in `server.js`).

## Accounts, e-mail, admin

* Everybody signs in with **their own** account (`/login.html`: e-mail + password, or Google).
* **Forgot password** (`/forgot.html`) and **e-mail verification** (`/verify.html`) send real e-mails through
  [Resend](https://resend.com) when `RESEND_API_KEY` + `MAIL_FROM` are set. Without them the links are printed in
  the server console, so you can still test locally. Reset links work once and for one hour.
* Admin is a role: set `ADMIN_EMAILS=you@example.com`, or `node scripts/make-admin.js you@example.com`,
  or promote someone in the panel. Admin panel: `/admin.html` (users, premium, roles, **orders**, **activity log**,
  reading/listening materials, uploads).

## Admin panel (`/admin.html`)

One page, six views (hash links `#dashboard #users #premium #orders #activity #audit`):

* **Dashboard**: users, Premium, tests taken, confirmed revenue, 14-day charts, things that need attention
  (unpaid orders, plans ending in 7 days, suspended accounts).
* **Users**: every account that signed in, with plan, status, tests taken, average band, last activity; search, filters
  (Premium / Free / expiring / suspended / unverified / inactive), sorting, paging, **CSV export**. *Open* a user for the
  profile, **test history**, orders, a private admin note, quick Premium buttons (+30 days ... Lifetime, **Take Premium
  away**), suspend / unsuspend, sign out everywhere, make/remove admin, delete (asks you to type the e-mail).
* **Premium**: find a user and give Premium; members sorted by expiry with +30d / +1y / Revoke. Giving Premium to an
  active member **adds time on top** (it never shortens a plan; a lifetime plan stays lifetime).
* **Orders**, **Test activity** (latest finished tests of everybody), **Activity log** (searchable).

On Supabase run the **v3 part** of `supabase-schema.sql` once (last-login, suspend, notes). Without it everything
else keeps working.

## Adding tests from the admin panel (Reading / Listening / Writing)

`/admin#reading`, `#listening`, `#writing` -> **+ New test**. Fill in the title, (reading) the passage, (listening) upload the **audio**,
upload **pictures** (maps, diagrams, charts), then add questions with their correct answers
(short answer, True/False/Not Given, Yes/No/Not Given, multiple choice; `|` separates accepted answers; **Paste many** adds
`question => answer` lines in one go). Writing: Task 1 / Task 2 prompt, optional chart picture, minimum words, model answer.
Each test can be **Free / Premium** and **Published / Draft** with one click.

Students open them from the Reading / Listening / Writing practice pages (section "New ... tests") or at `/test?id=...`.
Reading + listening are **graded on the server** (answers never reach the browser before submitting), get an IELTS band and are
saved to the account's results. Writing has a timer, word counter and auto-saved draft.

**Uploads on Vercel** go straight from the browser to Supabase Storage (public bucket `ieltsx-media`, created automatically) -
needs `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` and the **v4 part of `supabase-schema.sql`** (run once). On a normal server
they are saved in `uploads/`.

## Results follow the account

When a signed-in student finishes a reading or listening test, the result (score, band, time) is stored on the server
(`/api/results`), the card gets a **✓ Completed** pill, the **Completed / Not completed** filter works and the
Performance dashboard shows the same data on every device. Signed-out visitors can still take the free tests.

## Premium and payments

* Premium pages: `Mock tests.html`, the full tests, `/listening/index.html`, anything under `/premium-audio/`
  (put paid audio there; the server checks premium before sending it). More: `PREMIUM_PATHS=/a.html,/b/*`.
* **Buying**: on `Price.html` the buttons open a dialog (plan + months) -> an **order with a code** (e.g. `IX-4F2A91`) ->
  the student pays and sends the code to Telegram -> an admin presses **Confirm payment** in the panel and the plan
  turns on (an active plan is extended). Prices are in `plans.json`.
* **Automatic confirmation**: a payment provider or a Telegram bot can `POST /api/payments/webhook` with the header
  `X-Signature` = hex HMAC-SHA256 of the body using `PAYMENT_WEBHOOK_SECRET`, body `{"reference":"IX-...","status":"paid","amount":264000}`.
  (Payme / Click / Uzum need their own merchant agreement and protocol; the webhook is the place to connect them.)

## Safety built in

Passwords: salted scrypt, a short list of very common passwords (and passwords containing the e-mail name) is refused.
Session: HttpOnly cookie, other devices signed out on password change, an admin can **suspend** an account (sessions die
at once, login is refused) or **sign a user out everywhere**. Login, reset, verify, orders, results and the admin API are
rate limited; after 15 wrong passwords an account waits 15 minutes. Cross-site POSTs are refused (Origin and
`Sec-Fetch-Site` checks). HSTS on https. Admin pages are sent with their own strict CSP, `X-Frame-Options: DENY` and
`noindex`. CSV export neutralises spreadsheet formulas. Every admin action is written to the activity log. `server.js`, `data/`, `scripts/`, `.env*`, `*.md`, `*.sql`, dot-files are never served. Uploaded files
are sandboxed. `/api/health` is there for uptime monitors.

## Configuration

See `.env.example`. Needed in production: `ADMIN_EMAILS`, `SESSION_SECRET`, `PUBLIC_URL`, mail keys, Supabase keys
(run `supabase-schema.sql`, it also contains the new tables).

## Deploying

* **Render / Railway / VPS (recommended)**: `npm start`; every rule above is enforced, uploads work.
* **Vercel**: use Supabase; static HTML (admin, premium, full tests) is served by Vercel itself, so only the API is
  protected there. No uploads on Vercel. `sitemap.xml` and `robots.txt` work through `/api/sitemap`, `/api/robots`.

## Not included (needs something from you)

* **Payme / Click / Uzum** direct integration (merchant account + their protocol).
* **AI scoring** of Writing / Speaking (needs an AI API key and budget).
* **Two-factor login**, **error tracking (Sentry)** and **browser tests (Playwright)**: add after launch.
* Replacing `cdn.tailwindcss.com` with a compiled CSS file (needs the Tailwind build step with your class list).
* Files the saved pages point to but are not in this folder: images of `collections/`, card logos on `Price.html`,
  PDFs of `Pdf materials.html`, resources of `sections/test-5.html`.

## Fixes (October 2026)

* **Design**: 11 pages loaded Tailwind at runtime from `cdn.tailwindcss.com`; when that host was blocked/slow the layout broke.
  The script is removed; the few utilities it supplied are now in `assets/css/tw-fallback.css` (works offline).
* **Login**: if the page is opened without the Node server (file://, Live Server, any static host) the login page now says
  so clearly instead of failing silently. Real use: `npm start` -> http://localhost:3000.
* **Google**: if `GOOGLE_CLIENT_ID` is missing, or Google's script cannot load, the button explains why (see `GOOGLE_SETUP.md`).
* **JS**: null-element error on `index.html` fixed; the avatar menu "Log out" no longer shows the "(demo)" alert, it really signs out.
* Missing image files no longer show broken-image icons (`assets/js/img-fallback.js`).
* Removed two broken, unlinked pages (`Full Reading Test 13/14.html`); the real tests are in `/full-tests/reading/`.
