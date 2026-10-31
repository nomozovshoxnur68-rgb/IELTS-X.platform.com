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

* The old hand-made article pages (`collections/article-1.html` … `article-6.html`) were removed (October 2026): every article
  now comes from the admin panel, so every article can be locked. `article.js` still reads an embedded
  `<script type="application/json" id="article-data">` if a saved page is ever added again.
* **Lock**: the article form and its card have **Free / Standard / Max / Ultra**. A locked article's card says
  “🔒 Get Access · Max” and opens the Price page for that plan; the article page itself names the plan it needs.
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
The Node server refuses locked test pages itself; on Vercel `middleware.js` does it (see "Safety built in").

## Logo (`/admin#branding`)

Upload a **Logo** (wide: sign-in, password and legal pages) and/or an **Icon** (square: the sidebars, the header of every
test and the browser tab), or paste an https link, then **Save**. PNG, JPG, WebP or SVG (an SVG is turned into a PNG in the
browser, a big picture is made smaller); `/api/branding` is sent `no-cache`, so a saved logo shows on the next page at once. One picture is enough: it is used for both. The server keeps
them in `ieltsx_settings` (`branding`, served by `GET /api/branding`), and `assets/js/branding.js` swaps the IELTSX logo
and the red placeholder mark of the test pages for them. It is loaded by `site-access.js`, `full-mock/js/bridge.js` and a
`<script>` tag on the pages without them. **Use the IELTSX logo** puts the built-in logo back.

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

On **Vercel** the locked test pages are static files, so `middleware.js` (Vercel Routing Middleware) asks
`/api/access/check` with the visitor's session cookie before Vercel sends a full test, a practice passage / section,
`Mock tests` or anything under `/premium-audio/`; a visitor who may not open it goes to the Price page (audio: 403).
`vercel.json` sends the same security headers as the Node server, and the admin page gets its strict CSP, `DENY` and
`noindex` there too. Privacy Policy and Terms of Service: `privacy-policy.html`, `terms-of-service.html`.

## Configuration

See `.env.example`. Needed in production: `ADMIN_EMAILS`, `SESSION_SECRET`, `PUBLIC_URL`, mail keys, Supabase keys
(run `supabase-schema.sql`, it also contains the new tables). **Real keys go only into `.env` (ignored by git) and the
Vercel dashboard, never into `.env.example`: the repository is public.** Without `RESEND_API_KEY` + `MAIL_FROM` the
"Forgot password" page tells students to write to `PAYMENT_CONTACT` instead of waiting for an email.

## Deploying

* **Render / Railway / VPS (recommended)**: `npm start`; every rule above is enforced, uploads work.
* **Vercel**: use Supabase; static HTML is served by Vercel itself, the locked test pages are guarded by `middleware.js`
  (see above). No uploads on Vercel. `sitemap.xml` and `robots.txt` work through `/api/sitemap`, `/api/robots`.

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

## Admin: Part practice and Full tests for every skill, all packs in one place (October 2026)

The admin menu has two groups: **Tests · Part practice** (`#reading`, `#listening`, `#writing`, `#speaking`) and
**Tests · Full tests** (`#readingfull`, `#listeningfull`, `#writingfull`, `#speakingfull`), plus **Packs**.

* **Part** = one passage / one section / one task / one speaking part: a card on the practice page (`/part/practice/<skill>`).
* **Full** = a whole paper: Reading 3 passages, Listening Parts 1–4 (40 questions, one recording, 30 min, opens at
  `/exam/listening/<id>`; give each question group its *Part*, or paste the whole paper and the parts are taken from the
  question numbers), Writing Task 1 + Task 2, Speaking Parts 1–3. Listed on `/full-tests/<skill>/` inside its **Pack**.
  The format is saved as `data.mode` (`part` / `full`); tests saved earlier count as Part. `GET /api/materials?mode=part|full`.
* Every card: **Free / Standard / Max / Ultra** menu, Visible / Hidden, Edit, Copy, Open, **→ Full / → Part** (moves it to the
  other list), Remove. Tick cards (or **All**) for bulk actions: show, hide, access, set pack, move, remove.
* The form keeps unsaved work in the browser and offers it again the next time it is opened; a failed save shows the reason
  above the questions and keeps everything typed.
* **Packs** (`#packs`) lists every pack of the four Full Tests pages, the built-in ones too: rename, tier, plan label, section,
  position, hide / show, access, the tests inside, **+ Test** (a new full test in that pack). A built-in pack is changed by an
  override with the same address (kept in `admin-packs`); **Reset** brings back the original.

## Admin: fill a test from its PDF (October 2026)

Every Reading / Listening / Writing / Speaking form (Part and Full) starts with **⚡ Fill from a PDF — or paste the whole text**.
**Upload PDF** reads the file in the browser (`admin-import.js` + pdf.js in `assets/js/vendor/pdfjs/`, Mozilla, Apache-2.0; the
PDF is not uploaded), drops repeated headers / page numbers and fills the form with no marks needed:

* **Reading**: the passage = the long runs of running text (title above it, `A.` paragraph letters, words split at line ends
  joined); a full test is cut at `READING PASSAGE 2/3` (or into its three long texts) and every question group goes to its passage
  by its numbers. **Listening**: question groups (Parts 1–4 by their numbers), `SECTION 2` lines dropped, the **Audioscript /
  Transcript** into the transcript. **Writing**: `WRITING TASK 1/2`, time and word limits, **Model answer**. **Speaking**: Part 1
  questions, Part 2 cue card, Part 3 questions.
* Answers and explanations come from the **ANSWERS / Answer key** section, also when it is printed in columns (`1 TRUE   2 FALSE`).
* **PDF pages**: open a page, drag over a chart / map / diagram and add it as a picture (passage, map, Task 1, card).
* A scanned PDF (no text layer) is reported as such; its pages can still be used as pictures.

Also: **Finish** on the Listening results goes back to the Listening practice page (a full paper: the Full Listening page) instead
of restarting the test, and the Writing exam screen uses medium sizes (52 px arrows, 60 px bottom bar).

## Sample PDFs, first visit, Writing start screen (October 2026)

* **Sample PDFs** `assets/samples/{reading,listening,writing,speaking}-{part,full}.pdf` (made by `npm run build:samples`,
  `scripts/make-sample-pdfs.js`, texts written for IELTSX). Each form of the admin panel links its sample (**📄 Sample PDF**) next
  to **Upload PDF**; they show the layout the importer reads and cover the question types: True/False/Not Given, Yes/No/Not Given,
  matching headings (i–vii), matching information (paragraph letters), matching features, sentence endings, multiple choice,
  choose TWO, sentence / notes / form / summary completion (also with a word list), short answers, map labelling, the answer key
  in columns, an audioscript with PART 1–4, writing tasks with a chart and model answers, speaking Parts 1–3.
* The importer also reads: `21–22` question ranges, “IN EITHER ORDER B C” keys, a list of endings / words printed after the
  questions, word boxes printed in columns, “Label the map” groups (map type), map letters printed on the picture (ignored).
* **First visit**: a signed-out visitor who has never been to the site is sent to `/login?next=<the page>` once
  (`site-access.js`, flag `ix-first-visit-done` in localStorage); later visits and search-engine robots are not redirected.
* **Writing start screen**: the card no longer gets squeezed to the window height (it hid the Start button); the screen scrolls.

## AI Test Generator (`/admin#ai`)

Makes a Reading or Listening test from a PDF, a pasted passage or a recording with an AI (Gemini), and opens it in the normal
test form as a **Draft**. The admin reads it, fixes it and presses **Save draft** or **Publish** (asks for confirmation).
Nothing is saved or published by the generator itself; the manual forms are unchanged.

* **Files**: `ai-provider.js` (the AI service: Gemini over REST, or `mock`; one small interface so another provider can be
  added), `ai-generator.js` (routes, prompts, the JSON schema the model must answer in, the checks, cache), `admin-ai.js`
  (the page), hooks in `admin-content.js` (`window.IXAdmin`: the PDF reader, open-in-form, Save draft / Publish).
* **Routes** (inside `/api/admin/`, so `requireAdmin()`, the cross-site check, the admin rate limit and the audit log apply):
  `GET /api/admin/ai/status`, `POST /api/admin/ai/transcribe`, `POST /api/admin/ai/generate`.
* **Reading**: the PDF is read in the browser (as in "Fill from a PDF"); the passage text is **not** rewritten by the AI. If the
  source has questions they are kept word for word (`origin: "source"`) and the AI answers / explains them and checks the answer
  key (a disagreement is a warning, the key's answer stays). Without questions the AI writes them (`origin: "ai"`) with the chosen
  difficulty, number and types. A scanned PDF (no text) is uploaded to storage and read by the AI (marked so).
* **Listening**: the recording is uploaded to the site's storage (kept for playback), sent to Gemini's Files API by the server,
  transcribed with times (`[m:ss] SPEAKER: text`, editable), and the copy at Gemini is deleted. Questions are checked against the
  transcript (never "against the audio"); the second an answer is heard is saved as `at` and used by the review screen.
* **Checks**: every answer must come with the exact words of the source (`evidence`), looked up in the passage / transcript; an
  answer not found, an option letter that does not exist, a word limit broken, or a question the source does not decide is
  listed as a warning, and the question is tagged **check** in the form. Types the skill does not have are left out.
* **Cost / safety**: the key is read only on the server (`GEMINI_API_KEY`, sent to Google in the `x-goog-api-key` header), never
  in the page. One generation at a time per admin, `AI_HOURLY_LIMIT` per hour (default 30), the same request within an hour comes
  from the cache (no new AI call). Only files uploaded in this panel are sent (no other websites), audio up to `AI_MAX_AUDIO_MB`
  (default 60), PDFs up to 30 MB. Clear messages for a missing / wrong key, an unknown model, rate limits, timeouts, blocked or
  cut-off answers and answers that are not valid JSON (nothing is changed then).
* **Settings** (see `.env.example`): `GEMINI_API_KEY` (required, https://aistudio.google.com/apikey), `AI_MODEL` (empty =
  `gemini-3.8-flash`, Google's recommended Flash model in Oct 2026; if the key may not use it, `gemini-flash-latest` and
  `gemini-3.6-flash` are tried and the one that answers is kept), `AI_THINKING` (Gemini 3 thinking level, default `low`),
  `AI_PROVIDER` (`gemini`, or `mock` to try the page without a key), `AI_HOURLY_LIMIT`, `AI_MAX_AUDIO_MB`, `AI_TIMEOUT_MS`.
  On Vercel the function may run 60 s (`vercel.json`); a long recording should be one part at a time
  (“starts at / ends at”), and recordings / scanned PDFs need Supabase Storage.
* **Gemini API**: plain REST, as in https://ai.google.dev/api/generate-content (v1beta `generateContent`, JSON mode with
  `responseSchema` in OpenAPI form, the resumable Files API for audio / scanned PDFs, `x-goog-api-key` header). No SDK is needed
  (the official JS SDK is `@google/genai`; the project has no npm packages). "Thought" parts of the answer are skipped.
* **Private files on Vercel**: `middleware.js` answers 404 for `server.js`, the AI modules, `scripts/`, `data/`, `*.md` …,
  which Vercel would otherwise serve as static files (the Node server refuses them in `isBlocked()`).
* **Self-test**: `npm test` runs the generator against a local stand-in for the Gemini API (no real AI call).

## Built-in Reading Part tests, Volume 9 start screen (October 2026)

* **27 Reading passages** (Ambergris, Dark Chocolate, Asteroid, Growing More for Less, Marketing and the information age,
  Headphones, Termite Mounds, The Clipper Races, Walking and shoes, The Pearl, Ahead of its time, Roller Coaster, Science and
  Filmmaking; then A new look for Talbot Park, Playing Soccer, The purpose of facial expressions, How do plants talk to each
  other?, Robert Louis Stevenson, Practical Learning in the Classroom, All in the Family, How to Clean a Beach, William Gilbert
  and Magnetism, Sign, Baby, Sign!, The Conquest of Malaria in Italy, Why don't we sleep?, Transport during the Roman Empire,
  What Lucy Taught Us) are in `reading-src/part/` — passage, questions, answers, an explanation and the passage words to
  highlight for every question. They are **not pages**: on its first start the server adds each of them **once** to **Admin →
  Reading · Part practice** as an ordinary test (Published, Free, `/pessages/test-22` … `test-48` in list order on a new site;
  on a site that already has admin Part tests – or the first 13 – the new ones continue after them). From then on edit, lock, hide or remove them in the admin panel; changing a file later does
  not change the saved copy, and a removed test is not added again (the keys are kept in the setting `builtin-tests`). A new file
  added to `reading-src/part/index.js` is added on the next start. Works the same on Supabase (no SQL needed).
* **Numbering of Part tests** (admin-made too): the Passage tag decides it as in the paper: Passage 1 = Questions 1–13,
  Passage 2 = 14–26, Passage 3 = 27–40 (the page says "Part 2" and the admin form shows the same numbers).
* Admin Reading groups (completion and matching) have an optional **title** (“How ambergris is formed”, “List of Categories”),
  shown above the notes / the option list; the word limit of a completion block is read from its instruction (ONE WORD ONLY …);
  `## Sub-heading` lines in a passage become a bold sub-heading and `* note` lines a small footnote; a section with more than
  one paragraph (A, two plain paragraphs, B …) still gets its letters.
* **Volume 9**: `full-tests/reading/test-2.html` (the template of `npm run build:reading`) now has the same start screen as the
  other full tests (Instructions / Note / Exam Mode / Start Test) instead of the old name card; the Volume 9 pages were rebuilt.
* `reading-src/` is never served (the Node server blocks it like `scripts/`; `middleware.js` already did on Vercel).

## Built-in Listening sections (October 2026)

* **30 Listening sections** from the PDFs (26 × Section 4 = Questions 31–40, 3 × Section 1 = Questions 1–10; *The History of
  Sneakers* and *Beehive discovery* have 7 questions) are in `listening-src/part/` (format at the top of
  `listening-src/part/index.js`). Like the Reading passages they are added **once** to **Admin → Listening · Part practice**
  (`/sections/test-6` … in list order on a new site), but **Hidden**: the PDFs have no recording. Open a section → upload the
  audio or paste its link (and “starts at / ends at” if it is one long file) → **Save** → **Visible**. The admin card says
  “⚠ no audio” until then.
* No answer key in the PDF: *The development of Tinned Food*, *Rock Art*, *Beehive discovery*, *Survival Strategies of Male
  Lizards* (all answers empty) and *Soundscapes* question 40 (“not available” in the key). The form does not save a section with
  an empty answer, so type them in with the audio. *Ethics In Engineering* had no key either: its answers are the words of the
  transcript in the PDF (quoted in the explanations).
* `listening-router.js`: the last hand-made section is `sections/test-5.html` (was 4), so on Vercel – where the folder cannot be
  read – a new section never gets the number of that page. `listening-src/` is never served (server and `middleware.js`).

## Admin: questions, answers and explanations in three steps; tables; exam fixes (October 2026)

Reading and Listening tests (Part and Full) are filled in the admin panel in three steps, each **by question number**:

1. **Questions**: paste one block of the paper at a time (`From 1`, then `From 7` …) as it is printed: the instruction,
   the option list / list of headings and the numbered questions, no answers. The type is read from the instruction (or
   chosen). Pasting the same numbers again replaces that block; a block may be added before the one in front of it.
2. **Answers**: paste the answer key (`1 governess`, `7 FALSE`, `21-22 B, D`; two columns are fine), or one answer per
   line from a number. 3. **Explanations**: `1. …` per number, `Evidence: …` sets the passage highlight.

The strip of numbers 1–40 shows what each number still needs. **Everything together** is the old form with every field.

* **Table completion** (Reading and Listening): the table is typed once (first line = column headings, cells split by
  `|`, `____` = a gap). Every gap is one question, numbered row by row; the student sees a real table.
* Reading (all engines): the ← → arrows go to the previous / next **question** (into the next part after the last one);
  ✓ submits with **one** press (Listening too); Highlight / Note only on the passage text and the questions (the rest of
  the screen cannot be selected; Listening: only the question paper); explanations use the reading screen's blue review
  colours instead of red.
* No right-click menu on any page (`assets/js/no-context-menu.js`, loaded by `site-access.js` or its own tag); text
  fields keep theirs.
