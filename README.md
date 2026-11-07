# IELTSX

Static IELTS practice site + one small Node server for **accounts, premium, payments, results and admin**.
No npm packages (Node 18+).

```bash
npm start            # http://localhost:3000
npm test             # 52 checks: accounts, premium, orders, results, admin tests + articles, file protection ...
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

Students open them from the cards of the practice pages or at `/test?id=...`.
Reading + listening are **graded on the server** (answers never reach the browser before submitting), get an IELTS band and are
saved to the account's results. Writing has a timer, word counter and auto-saved draft.

**Writing** sets open in the IELTS writing exam screen `/writing/?id=...` (`writing/index.html`, `writing/css/style.css`,
`writing/js/script.js`): every task is one Part (Part 1, Part 2 in the bottom bar), one timer for the whole set, auto-saved drafts,
then a results page per task plus the overall Writing band (Task 2 counts twice). For a line graph type the numbers in the task
(`Years: 1961, 1971 …` and one `Name: 10, 30 …` line per series) and the page draws the chart; otherwise upload a picture.
The model answer is shown on the results page. `/writing/` without an id is the free demo (car ownership line graph).
Scoring is the AI check on the server (see **AI check of Writing and Speaking** below); only a real check is saved to the account.

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

## AI check of Writing and Speaking

Students get, for every Writing task and Speaking attempt: a band on each of the **four IELTS criteria** with comments, **grammar corrections**
(their words, the fix, the rule), **vocabulary upgrades**, feedback, next steps and a **model answer** (the teacher's one when the test has it). The
feedback comes in English, O'zbekcha or Русский, as the student chooses. The band is an estimate and the pages say so.

* **To switch it on**: set `OPENAI_API_KEY` on the server (the same key as the AI Test Generator; locally in `.env`, on Vercel: Settings -> Environment Variables, then redeploy) and add credit to the OpenAI account (a ChatGPT subscription does not include the API). The key never reaches a browser. Without it the pages say the check is not available yet, and admins read what to set.
* **It runs by itself**: a Writing test is checked when it is submitted; a Speaking test is checked a few seconds after the last answer (**Wait** stops it, to record an answer again; **Get AI feedback** starts it earlier, with some questions unanswered); the Writing of a Full Mock is checked when the test ends. A visitor who is not signed in, or who has no checks left, is told so and nothing is sent.
* **Files**: `ai-examiner.js` (routes, prompts, schemas, the allowance; server only), `ai-provider.js` (the AI service), `writing/js/script.js` and `assets/js/speaking-exam.js` (the pages).
* **Routes**: `GET /api/ai/status`, `POST /api/ai/writing`, `POST /api/ai/speaking/transcribe` (one recording, raw bytes), `POST /api/ai/speaking/assess`, `GET /api/ai/history`, `GET /api/ai/reports` (+ `/<id>`, `DELETE /<id>`, see **AI feedback archive**). All but the status need a signed-in student who may open the test.
* **Speaking**: one recording per question (a cue card is one recording), converted in the browser to 16 kHz mono WAV so one answer fits a Vercel request (2 minutes 10 seconds at most). Each is written down (`gpt-transcribe`) and heard for notes on pronunciation and fluency (`gpt-audio-1.5`), then the transcripts are marked. Recordings are not stored. A student without a microphone can type: pronunciation is then not marked and does not count. The same happens when the audio model gives no notes: pronunciation is never guessed from a transcript.
* **Bands**: the model gives the four criteria; the overall band is worked out on the server with the IELTS rule for averages (6.25 -> 6.5, 6.75 -> 7.0). In a full Writing test Task 2 counts twice.
* **Allowance per month** (a failed check is not counted, admins have no limit): `AI_CHECKS_FREE` 3, `AI_CHECKS_STANDARD` 30, `AI_CHECKS_MAX` 60, `AI_CHECKS_ULTRA` 200. One Writing task or one Speaking attempt is one check. Usage is kept in the setting `ai-usage:<user id>` with the bands of the last 40 checks (for the Performance page); the checks themselves are kept in the AI feedback archive (below).
* **Full Mock**: the Writing section is checked when the test ends (each task is one check; Task 2 counts twice); if that fails, or for an older attempt, the results page has **Get AI feedback**. The feedback stays with the attempt, so it is not asked for twice, and the band goes to the Mock group of the Performance page.
* **Trying it without a key**: `AI_PROVIDER=mock` answers with placeholder text marked [Test mode].

## Speaking

* **Practice page** (`/part/practice/speaking`): the same cards, filters and pagination as the other skills; every card is a test of **Admin -> Speaking · Part practice**.
* **Built-in topics**: `speaking-src/topics.js` has six topics, added once as 18 Part cards and 6 Full tests (packs Jan-August, Sep-Dec). Topic 19 is free, the others need a plan. Edit, lock or remove them in the panel, like the built-in Reading passages.
* **The test** (`/test?id=...`, `assets/js/speaking-exam.js` + `assets/css/speaking-exam.css`): Parts 1-3 with progress, the question read aloud on request, recording with a level meter and a time limit, the Part 2 preparation countdown and notes, typed answers, the AI feedback, and the last feedback kept on the device.

## Pre-test

**Pre-test** is a pack of Part tests with up to **49 questions numbered from 1**, whatever the Passage / Section tag says (the admin form and the server refuse more). It is in the **All Packs** filter of all four practice pages. In the form of a Part test press the **Pre-test** chip under the Pack field (or type the name; "pre test" and "PreTest" are the same pack). The band is scaled to the 40-question table, as for every test that is not 40 questions.

## Bands and results

* **One table everywhere**: the official IELTS Academic Reading and Listening tables (`reading.js`, `listening/js/listening.js`, `listening/js/exam-app.js`, `full-mock/js/*.js`, `assets/js/test-complete.js`, `server.js`). A paper that is not 40 questions is scaled to 40.
* **One way to compare answers**: capitals, extra spaces, curly quotes, hyphens and a final full stop do not matter; `a|b` = either; `(the) river` = `river` or `the river`.
* **Saving**: an attempt is saved once (opening its results again adds nothing); tests at `/exam/...` are saved too; a result that could not be sent is kept and sent again on the next page; a finished Full Mock saves Listening and Reading in the Mock group.
* **Performance page** (`study/Tools/Performance.html`, `performance-dashboard.js`, `assets/css/performance-2.css`): estimated overall band against a target, the four skills with their trend, band over time, the criteria of the AI checks and the weakest one, averages of the last 10 attempts and last 3 mocks, activity and every attempt.

## AI Test Generator (`/admin#ai`)

Makes a Reading or Listening test from a PDF, a pasted passage or a recording with an AI (OpenAI), and opens it in the normal
test form as a **Draft**. The admin reads it, fixes it and presses **Save draft** or **Publish** (asks for confirmation).
Nothing is saved or published by the generator itself; the manual forms are unchanged.

* **Files**: `ai-provider.js` (the AI service: OpenAI or Gemini over REST, or `mock`; one small interface so another provider can be
  added), `ai-generator.js` (routes, prompts, the JSON schema the model must answer in, the checks, cache), `admin-ai.js`
  (the page), hooks in `admin-content.js` (`window.IXAdmin`: the PDF reader, open-in-form, Save draft / Publish).
* **Routes** (inside `/api/admin/`, so `requireAdmin()`, the cross-site check, the admin rate limit and the audit log apply):
  `GET /api/admin/ai/status`, `POST /api/admin/ai/transcribe`, `POST /api/admin/ai/generate`.
* **Reading**: the PDF is read in the browser (as in "Fill from a PDF"); the passage text is **not** rewritten by the AI. If the
  source has questions they are kept word for word (`origin: "source"`) and the AI answers / explains them and checks the answer
  key (a disagreement is a warning, the key's answer stays). Without questions the AI writes them (`origin: "ai"`) with the chosen
  difficulty, number and types. A scanned PDF (no text) is uploaded to storage and read by the AI (marked so).
* **Listening**: the recording is uploaded to the site's storage (kept for playback), sent to the AI service by the server (OpenAI:
  written down with `whisper-1`, up to 25 MB; Gemini: its Files API, and the copy there is deleted), and transcribed with times
  (`[m:ss] SPEAKER: text`, editable). `whisper-1` is the only OpenAI model with times and shuts down on 26 Feb 2027; after that
  the transcript comes from `gpt-transcribe` without times. Questions are checked against the
  transcript (never "against the audio"); the second an answer is heard is saved as `at` and used by the review screen.
* **Checks**: every answer must come with the exact words of the source (`evidence`), looked up in the passage / transcript; an
  answer not found, an option letter that does not exist, a word limit broken, or a question the source does not decide is
  listed as a warning, and the question is tagged **check** in the form. Types the skill does not have are left out.
* **Cost / safety**: the key is read only on the server (`OPENAI_API_KEY`, sent to OpenAI in the `Authorization` header), never
  in the page. One generation at a time per admin, `AI_HOURLY_LIMIT` per hour (default 30), the same request within an hour comes
  from the cache (no new AI call). Only files uploaded in this panel are sent (no other websites), audio up to `AI_MAX_AUDIO_MB`
  (default 60; OpenAI takes 25 at most), PDFs up to 30 MB. Clear messages for a missing / wrong key, an account without credit, an
  unknown model, rate limits, timeouts, blocked or cut-off answers and answers that are not valid JSON (nothing is changed then).
* **Settings** (see `.env.example`): `OPENAI_API_KEY` (required, https://platform.openai.com/api-keys), `AI_MODEL` (empty =
  `gpt-6-luna`, OpenAI's efficient model in Nov 2026; if the key may not use it, `gpt-5.6-luna` is tried and the one that answers
  is kept), `AI_AUDIO_MODEL` (default `gpt-audio-1.5`), `AI_TRANSCRIBE_MODEL` (default `gpt-transcribe`), `AI_THINKING` (default `low`),
  `AI_PROVIDER` (`openai`, `gemini` with `GEMINI_API_KEY`, or `mock` to try the page without a key), `AI_HOURLY_LIMIT`, `AI_MAX_AUDIO_MB`, `AI_TIMEOUT_MS`.
  On Vercel the function may run 60 s (`vercel.json`); a long recording should be one part at a time
  (“starts at / ends at”), and recordings / scanned PDFs need Supabase Storage.
* **OpenAI API**: plain REST with no SDK. `/v1/responses` with `text.format` (strict JSON schema: `strictSchema()` closes every object and
  makes a key that may be left out nullable) for answers, pictures and PDFs; `/v1/chat/completions` with `input_audio` for hearing a
  spoken answer (the Responses API takes no audio); `/v1/audio/transcriptions` for writing speech down. Nothing is kept at OpenAI: `store: false`, and
  files go inside the request.
* **Gemini API**: plain REST, as in https://ai.google.dev/api/generate-content (v1beta `generateContent`, JSON mode with
  `responseSchema` in OpenAPI form, the resumable Files API for audio / scanned PDFs, `x-goog-api-key` header). No SDK is needed
  (the official JS SDK is `@google/genai`; the project has no npm packages). "Thought" parts of the answer are skipped.
* **Private files on Vercel**: `middleware.js` answers 404 for `server.js`, the AI modules, `scripts/`, `data/`, `*.md` …,
  which Vercel would otherwise serve as static files (the Node server refuses them in `isBlocked()`).
* **Self-test**: `npm test` runs the generator and the checks against local stand-ins for the OpenAI and Gemini APIs (no real AI call; a real key in `.env` is not used).

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

* **Every question type is its own type.** Reading: True/False/Not Given, Yes/No/Not Given, multiple choice (one / TWO-THREE),
  matching headings, matching information, matching features, matching sentence endings, note / summary / sentence / table /
  flow-chart completion, summary with a list of words, short answers, map / diagram labelling. Listening: notes, sentences,
  summary, table, flow-chart (typed), notes / summary with a box of words, multiple choice, matching, map. Step 1 reads the type
  from the instruction of each pasted block; older tests are converted when they are opened in the panel.
* **Notes, summaries, sentences, flow-charts and word boxes are typed as text** with `____` for each gap, so the lines without a
  gap are kept (a sub-heading, a sentence of the notes). Every gap is one question. A summary with a list of words looks like the
  computer test: the title, the summary with numbered boxes, the words (without letters) under it; a word typed as the answer
  becomes its letter.
* **Table completion** (Reading and Listening): the table is typed once (first line = column headings, cells split by
  `|`, `____` = a gap). Every gap is one question, numbered row by row; the student sees a real table.
* Reading (all engines): the ← → arrows go to the previous / next **question** (into the next part after the last one);
  ✓ submits with **one** press (Listening too); Highlight / Note only on the passage text and the questions (the rest of
  the screen cannot be selected; Listening: only the question paper); explanations use the reading screen's blue review
  colours instead of red.
* **Tables** are edited box by box (+ Row / + Column, one box per cell; a cell may have several lines, `- ` = a bullet, several
  `____` gaps). The title is printed in the first row, the headings and (optionally) the first column in bold, gaps numbered row
  by row, as in the computer test. Pasting a whole paper (Fill from a PDF / Paste text / Paste many groups) keeps every line of
  notes, summaries and tables too; their answers come from the key by number.
* A **full listening paper** made in the panel is shown part by part (header "Part N", footer Part 1–4, arrows go question by
  question across the parts). Highlight / Note takes at most 40 words at a time. **One light / dark setting** for the site and
  every test: choosing it in a test or on the site changes both.
* No right-click menu on any page (`assets/js/no-context-menu.js`, loaded by `site-access.js` or its own tag); text
  fields keep theirs.

## Speed, loading bar, several workers, cards and logo (November 2026)

* **Loading bar** on every page (`assets/js/loading.js`, first thing in `<head>`): moves while the page loads, while it waits
  for the server and as soon as a link is clicked. A test page shows a spinner instead of a blank screen while its access is
  checked (at most 3 s; the server and the Vercel middleware refuse the page itself).
* **Faster**: the Node server sends pages, styles and scripts compressed (brotli / gzip, made once and kept in memory: e.g.
  `reading.css` 375 KB -> 81 KB); pictures and fonts are kept by the browser for a day (also on Vercel, `vercel.json`).
  Pages, styles and scripts are always checked again, so an update is seen at once.
* **Several workers**: `WEB_CONCURRENCY=4` (or `auto` = one per CPU core) runs that many copies of the server on the same port
  and restarts one that stops; it needs Supabase (the local `data/db.json` is written by one process). On Vercel nothing is
  needed: every request gets its own instance and Vercel adds more as visitors come.
* Home: **Part Practice** (Listening / Reading / Writing / Speaking) replaces "IELTS Courses". Card pictures all have the same
  4:3 frame (`aspect-[4/3]` was missing from the CSS). A full test made in the admin panel gets the same card as a built-in
  one (Test N, the pack's tier, "Pack | title", question types). An uploaded logo takes exactly the place of the built-in mark
  (it grew to the picture's own size in the reading header). Dark mode of the tests: a black page, no grey blocks behind the
  answer rows.

## Website check, faster page changes, new Account page (November 2026)

* **Website check** (`/admin#sitecheck`, `admin-sitecheck.js` + server module `site-check.js`, `GET /api/admin/site-check`):
  a score out of 100 and every finding marked Passed / Note / Warning / Problem in four groups: setup and security (database,
  session secret, e-mail, PUBLIC_URL, Google, AI, payment webhook, server memory), tests and articles (published Listening
  without audio, tests without questions or answers, Reading without a passage, articles without a cover, uploaded files that
  are missing), people and activity (accounts, tests this week, unconfirmed e-mails, orders waiting for payment, plans ending),
  pages (broken links and pictures in every page, heavy files, title / description / viewport / language of the public pages).
  The **Speed** table measures the main pages and API answers in the admin's own browser. Read only; the page scan runs in
  small steps so visitors are not slowed down, and is kept for a minute (`?fresh=1` runs it again).
* **Moving between pages is faster**:
  * the server adds `?v=<file time>` to the styles and scripts of every page (`versionedPage` in `server.js`), so the browser
    keeps them for a year (`immutable`) and asks again only when a file really changed. Before, every page asked the server
    about ~25 files again (each a round trip). Module scripts keep their plain address (they import each other).
  * local data file: `data/db.json` is read once and kept in memory until it changes on disk (it was read and parsed several
    times per request). Supabase: logo, prices, packs, access rules and the test lists are kept for 5 s
    (`memoGet`; a change made on this server clears them at once).
  * links are fetched while the pointer rests on them (Chrome / Edge speculation rules, `<link rel=prefetch>` elsewhere;
    `assets/js/loading.js`). Tests themselves, the API, the admin panel and sign-out are never fetched early, and the server
    answers 503 to an early fetch of a locked test, so it never counts towards a plan's test allowance.
* **Part Practice and Articles show at once**: grey placeholder cards (`.ix-skel`, styles in `loading.js`) until the list is
  there; the list from `/api/materials` is kept in the tab for 10 minutes (`IELTSX.cachedJson` in `assets/js/app.js`), so a
  page opened again draws its cards immediately and is updated in the background (the cards are drawn again only if the list
  changed). Saving a test, an article, a pack or a lock in the admin panel makes those copies old; signing in or out drops them.
  Empty pages say "coming soon" instead of showing an empty grid. The loading bar and spinner use the site's blue.
* **Account** (`account.html`, `assets/js/account.js`, `assets/css/account.css`): profile card (verified / not, member since),
  progress from the real results (tests finished, average and best band, time practised, the last five tests), tabs Profile /
  Security (change password, signs out other devices) / Subscription (plan, days left, test allowance, orders) / Appearance
  (Light / Dark / System). The made-up "AI usage", "Invites" and the Telegram / Instagram / WhatsApp / Facebook share buttons
  are gone.
* **Sidebar**: Support and Feedback (and Telegram on Speaking) are removed from every page. The old `@READING_CDI` /
  `@ieltsxuz` Telegram promos of the tests, the listening start screen and the Price footer are removed; the brand in those
  places is IELTSX. The payment contact set in Price control stays.
* **Logo**: `assets/ieltsx-mark.png` is a real square IELTSX mark (the file used in the sidebars was the wide logo squeezed into
  a square). The Reading and Writing test headers draw the IELTSX mark instead of a square with a slash. An uploaded logo in
  the Writing exam bar and results no longer grows to 100 x 100 (the size of a hidden screen was read as 100px).
* PDF materials show only the PDFs added in the admin panel (the five sample cards downloaded a one-page placeholder; set
  `window.IELTSX_SHOW_BUILTIN_PDFS = true` to show them again). The Articles "Live Source Feed" tab (sample links to `#`) is
  hidden. `sections/test-5.html` no longer asks for scripts that do not exist.

## Promo codes (November 2026)

* **Price control → Promo codes** (`admin-pricing.js`): code, discount (1–90 %), optional end date, optional plans
  (none ticked = every plan), On / Off, and **Strip: Show** for the one code shown in the purple promo strip. The panel shows
  how many orders used each code. The codes are kept in the pricing settings (`promos`); out of the box there is `MAY10`
  (10 %, every plan, no end date, in the strip), the code the strip always showed.
* **Price page** (`assets/js/pricing.js`): the order window has a promo code field; the server checks it
  (`POST /api/promo/check`, rate limited) and `POST /api/orders` makes the order with the discount (rounded to 100 so'm).
  The order keeps `promoCode`, `discount` and `fullAmount`; the admin Orders list, the student's account and the Telegram
  message show them. A wrong, ended or other-plan code is refused by the server. The strip's "Upgrade" link
  (`/Price?promo=CODE`) fills the code in.
* **Promo strip** (`assets/js/promo.js`): the real code and percent from `/api/plans` (`promo`); a countdown only when the code
  has an end date (the old one restarted for every visitor); no working code = no strip (hidden from the first paint by
  `loading.js`). Clicking the code copies it.
* **Supabase**: run the **v8 part** of `supabase-schema.sql` once (three columns on `ieltsx_orders`). Until then an order with
  a code still gets the lower price and the code is written in the activity log; the Website check reminds you.

## AI feedback archive, pack pages on Vercel, more safety (November 2026)

**AI feedback archive (the store of AI checks).** Every Writing task and Speaking attempt the AI examiner marks is kept on the
student's account: the band, the four criteria with their comments, grammar corrections, vocabulary upgrades, strengths, next steps,
the model answer(s), the task, and the student's own text or the transcripts of the answers (recordings are still never stored).

* **Where**: Performance page → **AI feedback archive** (`assets/js/ai-archive.js`, `assets/css/ai-archive.css`): All / Writing / Speaking,
  10 at a time with **Load more**, **Open** shows the whole check (Print / PDF), **✕** deletes it. The Writing and Speaking results
  link straight to the check they just saved (`/study/Tools/Performance#ai-report=<id>`). The admin user drawer lists the bands and
  criteria of a student's checks, never the texts.
* **Server**: `ai-store.js` (server only, refused as a file by `server.js` and `middleware.js`). `ai-examiner.js` saves a check at the
  same time as it counts it (one round trip). Routes: `GET /api/ai/reports?section=&testKey=&limit=&before=` → `{ items, next }` (light
  rows: band, criteria, title, date — no texts), `GET /api/ai/reports/<id>` → `{ report }`, `DELETE /api/ai/reports/<id>`. Only the owner;
  any other id is a 404. A check that could not be saved still reaches the student (`saved: false`).
* **Fast**: Supabase table `ieltsx_ai_reports` with indexes on (`userId`, `createdAt` desc) and (`userId`, `testKey`, `createdAt` desc);
  a list reads only the small columns, the feedback (`report`) is read when one check is opened; paging by date, not offset. Local
  file mode: one file per account in `data/ai-reports/<userId>.json` (last 300 checks), kept in memory, so `data/db.json` does not grow.
* **Supabase**: run the **v9 part** of `supabase-schema.sql` once (the table, its indexes, RLS, and table rights taken from the
  public `anon` / `authenticated` roles on every IELTSX table). Until then the Website check shows a warning and checks are not kept.

**Packs on Vercel.** A pack made in **Admin → Packs** opened a 404 page on Vercel: `vercel.json` rewrote `/full-tests/<skill>/<pack>` to
`/full-tests/pack.html`, and with `cleanUrls: true` Vercel serves that file only as `/full-tests/pack`. The rewrites now point at
`/full-tests/pack` and `/test` (the old `/test/<id>` links were a 404 for the same reason). The built-in packs worked because they
have their own files. Also: a pack named in Cyrillic (`Пакет 7`) or with no letters got an empty address, so the second one was
refused as "already exists" — the name is now written in Latin letters (`paket-7`), the same rule in `server.js`, `assets/js/access.js`
and `full-tests.js`. Admin changes to packs and Access rules read the database itself (not the copy kept for 5 s), and a pack change
stops with an error instead of starting from an empty list when the database cannot be read (that would have deleted every pack).

**Safety.** Ids are checked before they reach Supabase (a made-up id is a 404, not a 500 that printed the database's own error); the
database's own words stay in the server log; an order is found by its id or its code with two separate filters (before, a code went
inside one `or=(…)` filter, which also made finding an order by its code fail on Supabase); `Cross-Origin-Opener-Policy:
same-origin-allow-popups` and a stricter `Permissions-Policy` (microphone for this site only, no sensors / ad topics) on the Node server
and in `vercel.json`. `npm test`: 51 checks.

## Full Mock Tests: admin panel, new page, safer mocks (November 2026)

**Mock Tests page** (`/Mock tests`, `Mock tests.html` + `assets/js/mock-page.js` + `assets/css/mock-page.css`): the old copy of a
Reading page is replaced by the real catalog: a hero with the three papers and the student's own mock results, how a mock works,
filters (All / Available to me / Not taken / Completed) and one card per mock (picture or a coloured cover, plan badge, the three
papers, time, "new papers every attempt", status In progress / Done with the best band, Start / Continue / Take again / Get Access).
The page is public now; what a card needs is decided per mock. Light / dark / phone.

**Admin → Mock tests** (`#mocks`, `admin-mocks.js`): + New mock test → name, label, description, card picture (upload or link), and
for each paper **Random built-in** (a new one for every attempt), **one built-in paper**, or **a Full test made in the panel** (Reading /
Listening: a Full test; Writing: a test with a Task 1 and a Task 2). A test saved as **Draft** works in mocks only, so a teacher can
keep papers that appear nowhere else. Who can take it (Free / Standard / Max / Ultra), exam mode (student chooses / Real only /
Practice only), position, Visible. Hide / Show, Open, Delete; the built-in "Full Mock Test" (random papers, any paid plan) can be
changed and **Reset**. The user drawer lists the student's mock attempts: bands, how often they left the exam screen, and a ⚠ when the
page claimed another score than the server found. Mocks are kept in the settings (`mock-tests`): no SQL to run.

**How a mock runs now** (`mock-tests.js`, server only): the shell `/full-mock/?mock=<id>` asks `POST /api/mocks/<id>/start`; the server
checks the plan, **draws the papers** (each student gets every built-in paper once before any repeats) and returns a **signed attempt**
(HMAC with `SESSION_SECRET`, 8 hours, also the HttpOnly cookie `ieltsx_mock`). `POST /api/mock/resume` after a reload,
`POST /api/mock/finish` at the end. Admin-made papers open at `/full-mock/paper/<reading|listening>/<id>` (the site's own engines and
templates plus the bridge to the shell; `reading.js` got the same two mock hooks as `full-mock/js/reading.js`).

**Mock security**
* A paper page (it carries its answers) is sent **only inside the student's own attempt and only its own papers**; another paper,
  another account or no attempt gets 403 / the Mock page. The Listening answer packs (`full-mock/js/listening.js`) and recordings need
  an attempt too. `full-mock/js/tests.js` (every paper and every Writing task) is **never sent**: the server reads it. On Vercel
  `middleware.js` asks `/api/access/check` with the session and attempt cookies before it sends any of these files (and refuses when
  the API cannot be asked).
* **Marked again on the server**: the answers are compared with the server's own key (built-in Reading: the paper's data; built-in
  Listening: `full-mock/js/listening.js`; admin papers: the test in the database), with the same rule as the exam pages; the band comes
  from the official table on the server. A score the page claims is never trusted; a difference is kept as a flag. An attempt is
  finished once; the Listening / Reading results (Mock group of the Performance page) are written by the server.
* The Writing task for the AI check comes from the attempt on the server (`mockToken`), never from the page; the check is kept in the
  AI feedback archive.
* The cards and the shell never name a paper; random papers are drawn on the server, not in the browser (the old `?test=` switch is gone).
* In the browser the shell still keeps full screen, blocks shortcuts and logs leaving the screen (the count goes to the server).

`npm test`: 52 checks.
