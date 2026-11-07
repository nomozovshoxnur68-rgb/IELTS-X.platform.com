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
