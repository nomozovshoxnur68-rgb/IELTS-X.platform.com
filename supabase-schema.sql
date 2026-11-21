-- Run once in the Supabase SQL editor (Project -> SQL Editor).
create extension if not exists pgcrypto;

create table if not exists public.ieltsx_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null default 'user' check (role in ('user','admin')),
  plan text not null default 'Free',
  "premiumActive" boolean not null default false,
  "premiumExpiresAt" timestamptz null,
  "passwordHash" text not null default '',   -- empty for accounts created with Google
  "passwordSalt" text not null default '',
  "createdAt" timestamptz not null default now()
);

create table if not exists public.ieltsx_materials (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('reading','listening')),
  title text not null,
  pack text not null default '',
  description text not null default '',
  content text not null default '',
  premium boolean not null default false,
  "createdAt" timestamptz not null default now()
);

-- the server uses the service-role key; nobody can read these tables from the browser
alter table public.ieltsx_users enable row level security;
alter table public.ieltsx_materials enable row level security;

-- Make an existing account an admin (or list it in ADMIN_EMAILS instead):
-- update public.ieltsx_users set role='admin', plan='Admin', "premiumActive"=true, "premiumExpiresAt"=null where email='you@example.com';

-- ───────────── added in v2.1 (run this part on an existing database too) ─────────────
alter table public.ieltsx_users add column if not exists "emailVerified" boolean not null default false;

create table if not exists public.ieltsx_results (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public.ieltsx_users(id) on delete cascade,
  "testKey" text not null,
  section text not null check (section in ('Reading','Listening','Writing','Speaking')),
  bucket text not null default 'Practice',
  "pageLabel" text not null default '',
  "scoreCorrect" int not null,
  "scoreTotal" int not null,
  band numeric(3,1) not null,
  "durationSec" int not null default 0,
  "createdAt" timestamptz not null default now()
);
create index if not exists ieltsx_results_user on public.ieltsx_results ("userId", "createdAt" desc);

create table if not exists public.ieltsx_orders (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  "userId" uuid not null references public.ieltsx_users(id) on delete cascade,
  "userEmail" text not null,
  plan text not null,
  "planName" text not null,
  months int not null,
  amount int not null,
  currency text not null default 'UZS',
  status text not null default 'pending' check (status in ('pending','paid','rejected','cancelled')),
  "createdAt" timestamptz not null default now(),
  "paidAt" timestamptz null
);
create index if not exists ieltsx_orders_status on public.ieltsx_orders (status, "createdAt" desc);

create table if not exists public.ieltsx_audit (
  id uuid primary key default gen_random_uuid(),
  "actorId" uuid null,
  "actorEmail" text null,
  action text not null,
  target text not null default '',
  meta jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now()
);

alter table public.ieltsx_results enable row level security;
alter table public.ieltsx_orders enable row level security;
alter table public.ieltsx_audit enable row level security;

-- ───────────── added in v3 (admin panel: activity, suspend, notes, sign-out everywhere) ─────────────
-- Run this on an existing database. Without it everything keeps working, but last-login, suspend, notes
-- and "sign out everywhere" cannot be saved.
alter table public.ieltsx_users add column if not exists "lastLoginAt" timestamptz null;
alter table public.ieltsx_users add column if not exists "loginCount" integer not null default 0;
alter table public.ieltsx_users add column if not exists "blocked" boolean not null default false;
alter table public.ieltsx_users add column if not exists "blockedReason" text not null default '';
alter table public.ieltsx_users add column if not exists "note" text not null default '';
alter table public.ieltsx_users add column if not exists "sessionEpoch" integer not null default 0;

-- ───────────── added in v4: tests made in the admin panel (Reading / Listening / Writing) ─────────────
-- Run this part once on an existing database (it is safe to run again).
alter table public.ieltsx_materials add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.ieltsx_materials add column if not exists published boolean not null default true;
alter table public.ieltsx_materials add column if not exists "updatedAt" timestamptz not null default now();
-- the panel creates the public "ieltsx-media" Storage bucket (audio + images) by itself on the first upload.

-- ───────────── added in v6: Access rules (admin panel -> Access: free / locked + plan for every pack and test) ─────────────
-- Run this once on an existing database (safe to run again). Without it the site keeps working with the default locks,
-- but the choices made in the panel cannot be saved. Pictures uploaded on Vercel without Storage are kept here too.
create table if not exists public.ieltsx_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  "updatedAt" timestamptz not null default now()
);
alter table public.ieltsx_settings enable row level security;

-- ───────────── every type the admin panel can create (v4 – v7; run once on an existing database, safe to run again) ─────────────
-- reading / listening / writing (v4), vocab = Vocabulary collections (v5), speaking, article and pdf = PDF library (v7).
-- Vocabulary collections keep { kind, level, source, icon, words[] } in "data"; articles keep their text, cover picture,
-- vocabulary and grammar there. The list is set in ONE place: a shorter list fails ("violated by some row") on a
-- database that already holds vocab / speaking / article / pdf rows. Without it Supabase refuses to save those types.
alter table public.ieltsx_materials drop constraint if exists ieltsx_materials_type_check;
alter table public.ieltsx_materials add constraint ieltsx_materials_type_check
  check (type in ('reading','listening','writing','speaking','article','vocab','pdf'));

-- ───────────── v8: promo codes on orders (run once on an existing database, safe to run again) ─────────────
-- The code typed on the Price page, the money it saved and the price before the code. Without these columns an order
-- with a code is still made at the lower price; the code is then only written in the activity log.
alter table public.ieltsx_orders add column if not exists "promoCode" text not null default '';
alter table public.ieltsx_orders add column if not exists "discount" integer not null default 0;
alter table public.ieltsx_orders add column if not exists "fullAmount" integer not null default 0;

-- ───────────── v9: the store of AI checks (run once on an existing database, safe to run again) ─────────────
-- Every Writing task and Speaking attempt the AI marks: the band, the four criteria, and in "report" the whole feedback
-- (comments, grammar, vocabulary, next steps, model answers) with the student's text or transcripts (never recordings).
-- A list reads only the small columns through the indexes below; "report" is read when one check is opened.
-- Without this table students still get their feedback on screen; it is only not kept (the Website check says so).
create table if not exists public.ieltsx_ai_reports (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public.ieltsx_users(id) on delete cascade,
  section text not null check (section in ('Writing','Speaking')),
  kind text not null default '',
  "testKey" text not null default '',
  "materialId" text not null default '',
  title text not null default '',
  band numeric(3,1) not null default 0 check (band >= 0 and band <= 9),
  criteria jsonb not null default '{}'::jsonb,
  words integer not null default 0,
  lang text not null default 'en',
  model text not null default '',
  report jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now()
);
create index if not exists ieltsx_ai_reports_user on public.ieltsx_ai_reports ("userId", "createdAt" desc);
create index if not exists ieltsx_ai_reports_user_test on public.ieltsx_ai_reports ("userId", "testKey", "createdAt" desc);
alter table public.ieltsx_ai_reports enable row level security;

-- Security (v9): only the server (service-role key) may touch the IELTSX tables. Row level security with no policies
-- already hides them from the public anon key; taking the table rights away as well closes them even if a policy is
-- ever added by mistake.
revoke all on public.ieltsx_users, public.ieltsx_materials, public.ieltsx_results, public.ieltsx_orders,
  public.ieltsx_audit, public.ieltsx_settings, public.ieltsx_ai_reports from anon, authenticated;

-- ───────────── v10: Payme (automatic payments through the Payme Merchant API, see payme.js and PAYME_SETUP.md) ─────────────
-- Run this part once on an existing database (safe to run again). Nothing existing is dropped or rewritten: two columns
-- and one more allowed status on ieltsx_orders, one new table, two functions. Without it the site keeps working with
-- orders confirmed by hand; /api/payme answers Payme with "system error" and Admin -> Website check says what is missing.

-- 1. orders: how an order was paid ('' = by an admin, 'payme' = automatically), and "refunded" (a Payme payment that was
--    cancelled after it was completed: the plan time it added is taken back)
alter table public.ieltsx_orders add column if not exists "paidVia" text not null default '';
alter table public.ieltsx_orders add column if not exists "refundedAt" timestamptz null;
alter table public.ieltsx_orders drop constraint if exists ieltsx_orders_status_check;
alter table public.ieltsx_orders add constraint ieltsx_orders_status_check
  check (status in ('pending','paid','rejected','cancelled','refunded'));

-- 2. one row per Payme transaction (Payme's own id). Times are milliseconds, the amount is in tiyin (1 so'm = 100 tiyin),
--    exactly as the Merchant API sends and expects them. The rows are kept when an account is deleted (payment history,
--    GetStatement); the order code stays in "orderRef".
create table if not exists public.ieltsx_payme_transactions (
  id uuid primary key default gen_random_uuid(),
  "paymeId" text unique not null check (char_length("paymeId") between 1 and 64),
  "orderId" uuid null references public.ieltsx_orders(id) on delete set null,
  "orderRef" text not null,
  "userId" uuid null references public.ieltsx_users(id) on delete set null,
  amount bigint not null check (amount > 0),
  state smallint not null default 1 check (state in (1, 2, -1, -2)),
  reason smallint null,
  "paymeTime" bigint not null,
  "createTime" bigint not null,
  "performTime" bigint not null default 0,
  "cancelTime" bigint not null default 0,
  -- what the payment switched on, and the account as it was before (so a refund can put it back)
  "grantPlan" text not null default '',
  "grantDays" integer not null default 0,
  "prevPlan" text null,
  "prevActive" boolean null,
  "prevExpiresAt" timestamptz null,
  "grantedExpiresAt" timestamptz null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
-- at most ONE live (created or completed) Payme transaction per order: a second payment for the same order is refused
-- by the database itself, even when two requests arrive at the same moment on two Vercel instances
create unique index if not exists ieltsx_payme_one_live on public.ieltsx_payme_transactions ("orderId") where state in (1, 2);
create index if not exists ieltsx_payme_time on public.ieltsx_payme_transactions ("paymeTime");
create index if not exists ieltsx_payme_order on public.ieltsx_payme_transactions ("orderId", "createdAt" desc);
alter table public.ieltsx_payme_transactions enable row level security;
revoke all on public.ieltsx_payme_transactions from anon, authenticated;

-- 3. PerformTransaction in ONE database transaction: the Payme transaction, the order and the account change together
--    or not at all (rows locked, so a repeated or parallel call can never switch a plan on twice). The plan time is worked
--    out like grantPremium() in server.js: an active plan is extended from its end date, otherwise from now.
create or replace function public.ieltsx_payme_perform(p_payme_id text, p_now bigint, p_timeout bigint)
returns jsonb language plpgsql set search_path = public as $$
declare
  t public.ieltsx_payme_transactions%rowtype;
  o public.ieltsx_orders%rowtype;
  u public.ieltsx_users%rowtype;
  v_days integer;
  v_base timestamptz;
  v_exp timestamptz;
begin
  select * into t from public.ieltsx_payme_transactions where "paymeId" = p_payme_id for update;
  if not found then return jsonb_build_object('code', -31003); end if;
  if t.state = 2 then return jsonb_build_object('tx', to_jsonb(t)); end if;
  if t.state <> 1 then return jsonb_build_object('code', -31008, 'tx', to_jsonb(t)); end if;
  if p_now - t."createTime" > p_timeout then
    update public.ieltsx_payme_transactions set state = -1, reason = 4, "cancelTime" = p_now, "updatedAt" = now()
      where id = t.id returning * into t;
    return jsonb_build_object('code', -31008, 'expired', true, 'tx', to_jsonb(t));
  end if;
  select * into o from public.ieltsx_orders where id = t."orderId" for update;
  if not found or o.status <> 'pending' or o.amount::bigint * 100 <> t.amount then
    return jsonb_build_object('code', -31008, 'tx', to_jsonb(t), 'orderStatus', coalesce(o.status, 'missing'));
  end if;
  select * into u from public.ieltsx_users where id = o."userId" for update;
  if not found then return jsonb_build_object('code', -31008, 'tx', to_jsonb(t), 'orderStatus', 'no-account'); end if;
  v_days := greatest(o.months, 1) * 30;
  v_base := case when u.role <> 'admin' and u."premiumActive" and u."premiumExpiresAt" is not null and u."premiumExpiresAt" > now()
                 then u."premiumExpiresAt" else now() end;
  v_exp := v_base + make_interval(days => v_days);
  update public.ieltsx_users set "premiumActive" = true, plan = o."planName", "premiumExpiresAt" = v_exp where id = u.id;
  update public.ieltsx_orders set status = 'paid', "paidAt" = now(), "paidVia" = 'payme' where id = o.id;
  update public.ieltsx_payme_transactions set state = 2, "performTime" = p_now, "updatedAt" = now(),
      "grantPlan" = o."planName", "grantDays" = v_days, "prevPlan" = u.plan, "prevActive" = u."premiumActive",
      "prevExpiresAt" = u."premiumExpiresAt", "grantedExpiresAt" = v_exp
    where id = t.id returning * into t;
  return jsonb_build_object('tx', to_jsonb(t), 'performed', true, 'userId', u.id,
    'prev', jsonb_build_object('plan', u.plan, 'premiumActive', u."premiumActive", 'premiumExpiresAt', u."premiumExpiresAt"));
end $$;

-- 4. CancelTransaction in ONE database transaction. A created payment is cancelled (the order stays open, so the student
--    can pay again). A completed payment is a refund: the order becomes "refunded" and the time it added is taken back
--    (the account is put back exactly as it was, or, when it changed since, the days are subtracted).
create or replace function public.ieltsx_payme_cancel(p_payme_id text, p_reason integer, p_now bigint, p_allow_refund boolean)
returns jsonb language plpgsql set search_path = public as $$
declare
  t public.ieltsx_payme_transactions%rowtype;
  o public.ieltsx_orders%rowtype;
  u public.ieltsx_users%rowtype;
  v_exp timestamptz;
begin
  select * into t from public.ieltsx_payme_transactions where "paymeId" = p_payme_id for update;
  if not found then return jsonb_build_object('code', -31003); end if;
  if t.state < 0 then return jsonb_build_object('tx', to_jsonb(t)); end if;
  if t.state = 1 then
    update public.ieltsx_payme_transactions set state = -1, reason = p_reason, "cancelTime" = p_now, "updatedAt" = now()
      where id = t.id returning * into t;
    return jsonb_build_object('tx', to_jsonb(t), 'cancelled', true);
  end if;
  if not p_allow_refund then return jsonb_build_object('code', -31007, 'tx', to_jsonb(t)); end if;
  select * into o from public.ieltsx_orders where id = t."orderId" for update;
  select * into u from public.ieltsx_users where id = t."userId" for update;
  if found then
    if u."premiumExpiresAt" is not distinct from t."grantedExpiresAt" and u.plan is not distinct from t."grantPlan" then
      update public.ieltsx_users set plan = coalesce(t."prevPlan", 'Free'), "premiumActive" = coalesce(t."prevActive", false),
        "premiumExpiresAt" = t."prevExpiresAt" where id = u.id;
    elsif u."premiumExpiresAt" is not null and t."grantDays" > 0 then
      v_exp := u."premiumExpiresAt" - make_interval(days => t."grantDays");
      if v_exp > now() then
        update public.ieltsx_users set "premiumExpiresAt" = v_exp where id = u.id;
      else
        update public.ieltsx_users set "premiumActive" = false, plan = 'Free', "premiumExpiresAt" = null where id = u.id;
      end if;
    end if;
  end if;
  if o.id is not null then
    update public.ieltsx_orders set status = 'refunded', "refundedAt" = now() where id = o.id and status = 'paid';
  end if;
  update public.ieltsx_payme_transactions set state = -2, reason = p_reason, "cancelTime" = p_now, "updatedAt" = now()
    where id = t.id returning * into t;
  return jsonb_build_object('tx', to_jsonb(t), 'refunded', true, 'userId', t."userId");
end $$;

-- only the server (service_role key) may run them: Supabase lets the public anon key call new functions by default
revoke all on function public.ieltsx_payme_perform(text, bigint, bigint) from public, anon, authenticated;
revoke all on function public.ieltsx_payme_cancel(text, integer, bigint, boolean) from public, anon, authenticated;
grant execute on function public.ieltsx_payme_perform(text, bigint, bigint) to service_role;
grant execute on function public.ieltsx_payme_cancel(text, integer, bigint, boolean) to service_role;
notify pgrst, 'reload schema';
