# Payme payments — setup, testing, going live

IELTS X takes one-time payments in UZS through the **Payme Merchant API**. A paid order switches on the same plans an
admin switches on today (Standard / Max / Ultra for 1, 3 or 6 months). Free access does not change. The manual
payment (card transfer + receipt on Telegram, confirmed in Admin → Orders) stays as a second option.

## How it works

```
Student                     IELTS X (Vercel + Supabase)                       Payme
───────                     ───────────────────────────                       ─────
Price page → "Get Max" ──►  POST /api/orders            (order IX-4F2A91, amount from Price control)
"Pay with Payme"       ──►  POST /api/orders/<id>/payme (signed-in owner, unpaid order only)
                       ◄──  checkout form (merchant, amount in tiyin, account[order_id]=IX-4F2A91, return URL)
browser posts the form ─────────────────────────────────────────────────────► checkout.paycom.uz
                            POST /api/payme  ◄── CheckPerformTransaction ──── (Basic auth Paycom:<KEY>)
                                             ◄── CreateTransaction
                                             ◄── PerformTransaction  ──► plan switched on (one DB transaction)
student is sent back   ◄─────────────────────────────────────────────────────
/payment-status?order=IX-4F2A91 → GET /api/orders/IX-4F2A91 (reads the order; never switches anything on)
```

* **Only Payme's server call can switch a plan on.** The return address, the status page and the browser can only read.
* Every call to `/api/payme` must carry the merchant key (checked in constant time); optional IP allow-list.
* The amount Payme sends must equal the order total × 100 (tiyin); the order must still be unpaid.
* One live transaction per order (a unique index in the database); a repeated or parallel callback answers what was
  stored the first time and never adds plan time twice (`ieltsx_payme_perform` / `ieltsx_payme_cancel` lock the rows and
  change the transaction, the order and the account in one database transaction).
* A transaction that was created but not completed within 12 hours is cancelled (reason 4).
* A refund (Payme `CancelTransaction` after `PerformTransaction`) marks the order **refunded** and takes back the plan
  time that payment added.
* The activity log (Admin → Activity log) records `payme.create`, `payme.paid`, `payme.cancel`, `payme.refund`,
  `payme.timeout` with the order code, Payme transaction id and amount. Keys and card data are never stored or logged.

## Files

| File | What |
|---|---|
| `payme.js` | the Merchant API (all 7 methods), the checkout form, payment lookups. Server only. |
| `server.js` | routes: `POST /api/payme`, `POST /api/orders/<id>/payme`, `GET /api/orders/<code>`; Payme flag in `/api/plans` and `/api/orders`; an order being paid in Payme cannot be cancelled, replaced or confirmed by hand |
| `supabase-schema.sql` (v10) | `ieltsx_payme_transactions`, two order columns (`paidVia`, `refundedAt`), status `refunded`, the two functions |
| `scripts/payme-sql-check.sql` | checks the v10 functions inside Supabase and rolls everything back |
| `assets/js/payme-pay.js` | "Pay with Payme" (Price page, Account, status page) |
| `payment-status.html`, `assets/js/payment-status.js`, `assets/css/payment-status.css` | the page Payme sends the student back to |
| `assets/js/pricing.js`, `assets/css/pricing.css`, `Price.html` | order summary + Payme button in the order window |
| `assets/js/account.js`, `assets/css/account.css`, `account.html` | payment history: Pay with Payme, paid with Payme, refunded, details |
| `admin.js`, `admin.css` | Orders: "Refunded" tab, "Payme" tag |
| `site-check.js` | Admin → Website check reports Payme (off / test mode / live / table missing) |
| `middleware.js`, `vercel.json` | `payme.js` is never served as a file; pages may post forms to `*.paycom.uz` / `*.payme.uz` (CSP `form-action`) |

## 1. Supabase

1. Supabase → **SQL Editor** → paste the **v10** part of `supabase-schema.sql` (from the line
   `v10: Payme`) → **Run**. It only adds things; it is safe to run again.
2. Paste `scripts/payme-sql-check.sql` → **Run**. Expect `payme sql check: all passed`. It writes test rows and rolls them
   back, nothing is kept.
3. Row level security: the new table has RLS on with no policies, and the anon / authenticated roles have no rights on it or
   on the two functions — the browser (anon key) can read or change nothing. Only the server, with
   `SUPABASE_SERVICE_ROLE_KEY`, can.

## 2. Payme business cabinet

1. In the Payme business cabinet (test cabinet first) open your **cashbox** (kassa) settings.
2. **Endpoint URL**: `https://ielts-x.uz/api/payme`
3. **Account field** (the order field the payer is identified by): name `order_id`, label for example *Buyurtma raqami / Order code*.
   If you choose another name, set `PAYME_ACCOUNT_FIELD` to it.
4. Copy the **Merchant ID** (cashbox ID) and the **key**. The test key and the live key are different.

## 3. Vercel environment variables

Vercel → Project → Settings → Environment Variables (Production), then **Redeploy**:

| Variable | Value |
|---|---|
| `PAYME_MERCHANT_ID` | the cashbox ID |
| `PAYME_MERCHANT_KEY` | the **test** key while testing, the **live** key when going live |
| `PAYME_TEST_MODE` | `true` while testing (students go to `checkout.test.paycom.uz`), `false` live |
| `PUBLIC_URL` | `https://ielts-x.uz` (the return address after paying is built from it) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET` | already set |
| `PAYME_ACCOUNT_FIELD` | optional, default `order_id` |
| `PAYME_ALLOWED_IPS` | optional: the addresses Payme calls from (ask Payme support for the current list), comma separated, CIDR allowed |
| `PAYME_IKPU`, `PAYME_PACKAGE_CODE`, `PAYME_VAT_PERCENT` | optional: fiscal receipt data of your service (MXIK/IKPU code and package code from tasnif.soliq.uz). Ask your accountant / Payme whether your cashbox needs them. |
| `PAYME_CHECKOUT_URL` | optional: only if Payme gives you another checkout address (`https://….paycom.uz` / `….payme.uz`) |

Never put the key in a file in git, in a page or in a script. If you change the key in the Payme cabinet, Payme calls
`ChangePassword` and the site accepts the new key at once (a hash is kept in settings); put the new key in
`PAYME_MERCHANT_KEY` as well and redeploy — from then on the environment variable is used again.

After the redeploy: Admin → **Website check** must show *Payme is in TEST mode* (or *Payme payments are on*), not
*Payme cannot save payments*.

## 4. Testing (Payme test mode)

**Automatic tests on your computer** (`npm test`): 12 Payme checks run against a temporary local database — successful
payment, failed / cancelled payment, refund, duplicate and parallel callbacks, incorrect amount, unknown order,
unauthorized callback (no key, wrong key, wrong login, a student's own session), already processed transaction, already
paid order, 12-hour timeout, GetStatement, fiscal detail, IP allow-list, ChangePassword, no access before payment and
access after it.

**Payme sandbox** (with `PAYME_TEST_MODE=true` and the test key deployed):

1. On the site, signed in as a test student, make three orders and note their codes and totals:
   *A* — leave it unpaid (the sandbox pays it); *B* — have an admin confirm it in Admin → Orders (an already-paid order);
   *C* — any code that does not exist, e.g. `IX-000000`.
2. Open the Payme sandbox, enter the endpoint `https://ielts-x.uz/api/payme`, the Merchant ID and the test key, and the
   account values: *A* for "waiting for payment" with its total **in tiyin** (so'm × 100), *B* for an order that cannot be
   paid, *C* for "does not exist". Run every test group (authorization, CheckPerformTransaction, CreateTransaction,
   PerformTransaction, CancelTransaction, CheckTransaction, GetStatement). Expected codes:

   | Case | Answer |
   |---|---|
   | wrong / missing key | `-32504` |
   | wrong amount | `-31001` |
   | order does not exist | `-31050` (data `order_id`) |
   | order already paid / cancelled / refunded | `-31051` |
   | order already has another live transaction | `-31052` |
   | account of the order is blocked | `-31053` |
   | unknown transaction | `-31003` |
   | completed or cancelled transaction created again, timed out (12 h), cannot be performed | `-31008` |
   | refund when refunds are not allowed | `-31007` (refunds are allowed in this setup) |

3. Real checkout in test mode: Price page → choose a plan → **Pay with Payme** → pay with a Payme **test card** (shown in
   the sandbox / test cabinet) → you come back to `/payment-status` → *Payment successful*; Account → Subscription shows
   the plan and *paid … with Payme*; a locked test now opens. Cancel on the Payme page instead → *Payment not completed*,
   the order stays open, **Pay with Payme** works again.
4. Refund from the test cabinet → the order shows *Refunded* and the plan time is gone.

## 5. Production checklist

- [ ] v10 SQL ran in the **production** Supabase project; `scripts/payme-sql-check.sql` passed there.
- [ ] Every sandbox test group is green.
- [ ] Live cashbox: endpoint `https://ielts-x.uz/api/payme`, account field `order_id`.
- [ ] Vercel: `PAYME_TEST_MODE=false`, `PAYME_MERCHANT_KEY` = **live** key, `PAYME_MERCHANT_ID` = live cashbox, `PUBLIC_URL=https://ielts-x.uz`; redeployed.
- [ ] Fiscal data (`PAYME_IKPU`, `PAYME_PACKAGE_CODE`, `PAYME_VAT_PERCENT`) set if your cashbox requires receipts.
- [ ] Optional: `PAYME_ALLOWED_IPS` with Payme's official list.
- [ ] Admin → Website check shows *Payme payments are on*.
- [ ] One real small payment end to end (buy, return page, plan active, Admin → Orders shows *paid* + *Payme*), then a refund from the cabinet if you want to test it.
- [ ] Prices in Admin → Price control are the ones you want: the order total at the moment the order is made is the amount Payme must pay.
- [ ] Keep `PAYMENT_CONTACT` for the manual option and for support questions.

## Notes

* Prices: Payme always pays the order's own total (set when the order was made, after a promo code). Changing prices later
  does not change orders that already exist.
* Plan time: like an admin's *Confirm payment* — an active plan is extended from its end date, otherwise it starts now;
  1 month = 30 days. The test allowance of the plan (Price control) is given as well.
* Orders being paid: while Payme holds a created payment for an order, the student cannot cancel or replace it and an admin
  cannot confirm or reject it (Payme finishes or cancels it, at the latest after 12 hours).
* Without Supabase (`npm start` on your computer) the same rules run on the local data file, one process.
