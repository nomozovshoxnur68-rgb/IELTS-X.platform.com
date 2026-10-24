# Full Mock Test (9 ta mock, tasodifiy tanlanadi)

Ochish: `index.html`. Papkani butunligicha saqlang. Eng ishonchli yo'li: papkada `python3 -m http.server`, keyin `http://localhost:8000`.

## Testlar qanday almashadi
Har yangi kandidat uchun 4 ta mockdan biri **tasodifiy va yashirin** tanlanadi (nomi hech qayerda ko'rinmaydi).
Avval hammasi bir martadan chiqadi, keyin qayta aralashadi; oxirgi chiqqani darrov takrorlanmaydi.
Real va Practice rejimda ham shunday. Tugallangan Practice'dan keyin "Start a new attempt" yoki qayta kirish keyingi tasodifiy mockni beradi.
Kandidat qayta kirsa (o'sha email) tugallanmagan testida davom etadi; tugallangan Real Exam qayta topshirilmaydi. Qaysi test tushgani natija bilan serverga `testId` sifatida boradi.
Tekshirish uchun: `js/mock.js` dagi `allowTestParam: true` qiling va `index.html?test=m15` bilan ochasiz (m0510, m0110, m16, m15, m14, m13, m11, m10, m9).

| id | Reading | Listening | Writing |
|---|---|---|---|
| m0510 | reading-m0510.html | listening-m0510.html | js/tests.js |
| m0110 | reading-m0110.html | listening-m0110.html | js/tests.js |
| m16   | reading-m16.html   | listening-m16.html   | js/tests.js |
| m15   | reading-m15.html   | listening-m15.html   | js/tests.js |
| m14   | reading-m14.html   | listening-m14.html   | js/tests.js |
| m13   | reading-m13.html   | listening-m13.html   | js/tests.js |
| m11   | reading-m11.html   | listening-m11.html   | js/tests.js |
| m10   | reading-m10.html   | listening-m10.html   | js/tests.js |
| m9    | reading-m9.html    | listening-m9.html    | js/tests.js |

Yangi mock qo'shish: `reading-<id>.html`, `listening-<id>.html` yarating (listening uchun `js/listening.js` ga yangi `TEST_PACKS['<id>']` qo'shiladi),
Writing topshiriqlarini `js/tests.js` ga yozing va yangi yozuv qo'shing.

## Oqim
Login (ism, telefon, email, rejim) -> pre-test checks (videolar) -> Listening -> Reading -> Writing -> Exam Results.
To'liq ekran login'dan natijagacha saqlanadi.

## Rejimlar
- **Real Exam Mode**: submit tugmasi yo'q, har bo'lim vaqt tugaganda o'zi topshiriladi. Writing'ga paste bloklanadi.
- **Practice Mode**: har bo'limni o'zi topshirishi mumkin.

## Natijani yuborish
`js/mock.js` boshidagi `CONFIG.resultsEndpoint` ga server manzilini yozing. Natija (ism, telefon, email, testId, ballar, javoblar,
writing matni, integrity log) JSON POST qilinadi; internet bo'lmasa saqlanib, keyin qayta yuboriladi. Email'ni o'sha server jo'natadi.

## Xavfsizlik (brauzer tomoni)
Context menu, F12, Ctrl+Shift+I/J/C, Ctrl+U/S/P bloklanadi; tab almashtirish va full screen'dan chiqish qayd etiladi;
saqlangan holat imzolanadi. Bu to'siq, to'liq himoya emas: ballarni serverda qayta tekshiring.

## Fayllar
index.html, css/mock.css, js/mock.js (qobiq) | js/tests.js (mocklar ro'yxati) | css/writing.css, js/writing.js |
css/reading.css, js/reading.js (umumiy engine) | css/listening.css, js/listening.js (umumiy engine + 4 ta test paketi) |
js/bridge.js (iframe ko'prigi) | assets/

---

## Update: papers are drawn separately (v5)

- **Listening, Reading and Writing are picked independently** for every new candidate
  (e.g. Listening C + Reading A + Writing F). `js/tests.js` now holds `MOCK_POOL`
  (13 Listening, 12 Reading, 10 Writing).
- Each paper has its own shuffled bag: every paper is handed out once before any
  repeats, and the one just used never comes straight back. The bags live in
  `localStorage` (`rcdi_fullmock_bags_v2`).
- Force papers for your own testing: set `allowTestParam: true` in `js/mock.js`, then open
  `index.html?l=m16&r=r16b&w=m1610` (or `?test=m16` for all three).
- Added sources: Listening `v10t3`, `v10t5`, `lfull2`, `m1610`; Reading `r16b`, `r14b`, `m1610`;
  Writing `m1610`. The 16.10.2026 audio is `assets/audio/m1610.mp3`, its Task 1 chart is
  `assets/img/m1610-task1.jpg`.
- Fix: the tutorial video's Play button could cover the Close button when a video failed to play.
- Adding a paper: see the comment at the top of `js/tests.js`.
