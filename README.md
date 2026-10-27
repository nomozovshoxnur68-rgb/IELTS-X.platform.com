# IELTSX

Static IELTS practice site + one small Node server for **accounts, premium, payments, results and admin**.
No npm packages (Node 18+).

```bash
npm start            # http://localhost:3000
npm test             # 26 checks: accounts, premium, orders, results, admin tests + articles, file protection ...
```

## Test links (always `test-1`, `test-2`, ... in listing order)

| What | URL | Notes |
| --- | --- | --- |
| Reading passages (practice cards) | `/pessages/test-1.html` ... `test-21.html` | same order as the cards; 1, 2, 7, 17-21 have content, the rest show "coming soon" |
| Listening sections (practice cards) | `/sections/test-1.html` ... `test-4.html` | Volume 10 Test 3, Part 1-4 (new listening engine) |
| Reading full tests (premium) | `/full-tests/reading/test-1.html` ... `test-4.html` | list: `/full-tests/reading/` |
| Listening full test | (the old full test was removed with the old listening engine) | list: `/full-tests/listening/` |

To add a test: drop the real page over the matching placeholder file (keep the file name), and set the card text
in `assets/js/app.js` (reading, `cardData`) or `part/practice/listening.html` (listening). Old links such as
`/pessage6.html` or `/Full_Reading_Test_8.html` still work (`ALIASES` in `server.js`).

## Full Tests packs (`/full-tests/<skill>/<pack>`)

Packs and their tests live in `assets/js/full-tests-data.js`. After adding a pack or a test run **`npm run build:packs`**:
it writes a real page for every pack (`full-tests/<skill>/<pack>/index.html`, so the link never shows the 404 page, even on
hosting without rewrite rules) and checks that every test link points at an existing file. Reading Pack 1 = `test-5`, `test-6`.
The **Finish** button on the reading results screen returns to `/full-tests/reading/`.

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

## Listening (new engine) and Listening tests made in the admin panel

* Engine: `listening/js/listening.js` + `listening/css/listening.css` (one Part per page). The four hand-made parts are
  `sections/test-1..4.html`; each defines `window.PART_PRACTICE` (answers, transcript, `build()`).
* Admin listening tests are generated on every visit by `listening-router.js` + `listening-exam.js` from
  `listening/exam-template.html` and `listening/js/listening-render.js` (the same idea as the Reading router).
  They open at `/sections/test-5`, `test-6` ... (or `/exam/listening/<id>`); the number is stored in `data.no`.
* Question types in the admin Listening form: `gap` (typed completion), `mcq`, `mcq-multi` (choose TWO/THREE), `matching`
  (drag a lettered option), `map` (letter matrix over the pictures), `box` (drag a word from a word box into the text).
  Consecutive questions with the same type and instruction form one block; write `____` where the answer goes.
* Audio: upload or paste a link; "starts at / ends at" cut one section out of a long recording.
* Pictures: uploads work on disk (local) or Supabase Storage. On Vercel without Storage, pictures are kept in the database
  (`/api/media/<id>`, up to 3 MB, large photos are shrunk in the browser); audio and PDF still need Storage or a pasted link.

## Adding tests from the admin panel (Reading / Listening / Writing)

`/admin#reading`, `#listening`, `#writing` -> **+ New test**. Fill in the title, (reading) the passage, (listening) upload the **audio**,
upload **pictures** (maps, diagrams, charts), then add questions with their correct answers
(short answer, True/False/Not Given, Yes/No/Not Given, multiple choice; `|` separates accepted answers; **Paste many** adds
`question => answer` lines in one go). Writing: Task 1 / Task 2 prompt, optional chart picture, minimum words, model answer.
Each test can be **Free / Premium** and **Published / Draft** with one click.

Students open them from the Reading / Listening / Writing practice pages (section "New ... tests") or at `/test?id=...`.
Reading + listening are **graded on the server** (answers never reach the browser before submitting), get an IELTS band and are
saved to the account's results. Writing has a timer, word counter and auto-saved draft.

**Writing** sets open in the IELTS writing exam screen `/writing/?id=...` (`writing/index.html`, `writing/css/style.css`,
`writing/js/script.js`): every task is one Part (Part 1, Part 2 in the bottom bar), one timer for the whole set, auto-saved drafts,
then a results page per task plus the overall Writing band (Task 2 counts twice). For a line graph type the numbers in the task
(`Years: 1961, 1971 …` and one `Name: 10, 30 …` line per series) and the page draws the chart; otherwise upload a picture.
The model answer is shown on the results page. `/writing/` without an id is the free demo (car ownership line graph).
Scoring uses an offline demo grader until an AI endpoint is set in `CONFIG.ai` (top of `writing/js/script.js`);
only real AI results are saved to the student's account.

**Uploads on Vercel** go straight from the browser to Supabase Storage (public bucket `ieltsx-media`, created automatically) -
needs `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` and the **v4 part of `supabase-schema.sql`** (run once). On a normal server
they are saved in `uploads/`.

## Articles (`/study/Tools/Articles`)

Every article page uses the same files: the site shell (sidebar, header, light/dark) like the Articles list,
`assets/css/article.css` for the reading area and `assets/js/article.js` for Read / Review tabs, text size, font and the word pop-up.

* **Saved articles** `collections/article-1.html` ... `article-6.html`: the text is in the HTML, the word list in
  `<script type="application/json" id="article-data">` (vocabulary with English / O‘zbekcha / Русский / synonyms, grammar points).
* **Admin articles** (`/admin#article` -> **+ New article**): title, topic, level (Passage 1-3), lead, cover picture, the text
  (empty line between paragraphs, `## Heading` for a heading), source, and in the same form the **vocabulary** and **grammar**
  lists. **Paste many** adds a whole list at once: one word per line `word | definition | o‘zbekcha | русский | synonyms | example`
  (or columns copied from Excel, or a JSON list such as the `reviewItems` of an old article). Each word shows whether it was found
  in the text; it is underlined where it first appears (use "Underline" when the text has another form of the word).
  They open at `/collections/article?id=...` with exactly the same design and show up first on the Articles page.
* On Supabase run the **v5 part** of `supabase-schema.sql` once (it allows the `article` type).

## Results follow the account

When a signed-in student finishes a reading or listening test, the result (score, band, time) is stored on the server
(`/api/results`), the card gets a **✓ Completed** pill, the **Completed / Not completed** filter works and the
Performance dashboard shows the same data on every device. Signed-out visitors can still take the free tests.
## Access: free / locked + plan (`/admin#access`)

Every pack and every test (Reading, Listening, Writing, Speaking, the cards of the four practice pages, and tests made in the admin panel) can be set to
**Demo (Free)**, **Standard**, **Max**, **Ultra** or **Default**. A locked card shows **Get Access**, which opens the Price page.
A test's own setting beats its pack's; a pack's setting is inherited by its tests. Default = the catalog
(`assets/js/full-tests-data.js`: `premium: true` = any paid plan, optional `minPlan: 'max'`).
Levels: Demo 0, Standard 1, Max 2, Ultra 3 (admin = Ultra; other paid plan names such as "Premium" count as Max).
Rules are stored in `ieltsx_settings` (run the **v6 part** of `supabase-schema.sql` once on Supabase).
The Node server refuses locked test pages itself; on Vercel the static test pages are only guarded by
`assets/js/access-gate.js` (the API is still enforced).
## Premium and payments

* Premium pages: `Mock tests.html`, the full tests, anything under `/premium-audio/`
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



## Admin: Speaking and Articles (October 2026)

`/admin#speaking` and `/admin#articles` work like Reading/Listening: **+ New**, picture and audio uploads, Free/Premium, Published/Draft, **Copy**, search and filter.
* **Speaking**: Part 1 questions, Part 2 cue card with preparation / speaking timers, Part 3, optional picture, model-answer audio and text. Students open it from the Speaking practice page; they can record themselves in the browser (never uploaded).
* **Articles**: cover picture, topic, passage level, source, reading time, text with pictures inside (the "Insert picture" button adds `![caption](url)`; `## Heading` and `- list` also work). They appear on the Articles page next to the built-in ones.
* Lock / unlock by plan for all of them in `/admin#access`. Run the **v7 part** at the end of `supabase-schema.sql` once on Supabase.

## Repair notes
* A wrongly resolved git merge had removed the Access (lock) routes from `server.js` and parts of several admin/page files; they are restored. Admin-made tests now follow the Access rules (before, only the old Premium flag was checked).
* Garbled characters (`в–¦`, `вњ“`) fixed in 79 files. Articles page: cards that led to non-existing pages were removed.

## Reading router: Part and Full tests from the admin panel (October 2026)

`/admin#reading` -> **+ New test** -> **Reading format**:

* **Part - 1 passage** (default, 20 min): opens in the same page as `pessages/test-19, 20, 21` (`reading.js` + `reading.css`). Listed in **New reading tests** on the Reading practice page. Address: `/pessages/test-22`, `test-23`, ...
* **Full - 3 passages** (60 min): opens in the same page as `full-tests/reading/test-1` (`reading.js` + `reading.css`). Listed on the Full Reading page (in the pack you type in *Pack*). Address: `/full-tests/reading/test-7`, `test-8`, ...

Paste the passage(s), add the questions (every IELTS type; in a Full test each question and picture has a **Passage 1/2/3** selector), press Create: the page is generated on every visit by `reading-router.js` + `reading-exam.js`, so nothing else has to be copied. The number `test-N` is given once and never changes; `/exam/reading/<id>` always works too. Free / Premium / plan locks from `/admin#access` apply, Draft tests are visible to admins only. **Finish** goes back to the Reading practice page (Part) or the Full Reading page (Full).

On Vercel the new paths are rewritten to the API in `vercel.json` (and the two template pages are bundled with the function), so no redeploy per test is needed.

## Admin: Part practice, Full tests and Packs are separate (October 2026)

The admin menu now has three separate places for Reading:

* **Reading · Part practice** (`/admin#reading`): one passage. Besides the passage and questions you set the **card**: picture, *Passage 1/2/3* tag, question-type chips (empty = taken from the questions) and the pack line. The card appears in the **same grid** of `/part/practice/reading` (same look, filters, search and pagination), and the test opens at `/pessages/test-22`, `test-23` ... like test-19, 20, 21.
* **Reading · Full tests** (`/admin#readingfull`): three passages, 60 minutes. Choose the **Pack** and the test appears inside that pack card on the Full Reading page, opening at `/full-tests/reading/test-7`, `test-8` ...
* **Packs (Full Tests cards)** (`/admin#packs`): create the pack cards of the Full Reading / Listening / Writing / Speaking pages: name, tier, plan label, **section** on the page (Recent Exams / Practice / a new name), description, locked by default, visible. A pack with the same name as a built-in one (e.g. *Pack 4*) takes over that card. Lock / unlock a whole pack or one test in **Access** (new packs are listed there too).

Packs are stored in the settings table (`admin-packs`), so no new SQL is needed.
