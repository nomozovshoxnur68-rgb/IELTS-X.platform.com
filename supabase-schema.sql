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
alter table public.ieltsx_materials drop constraint if exists ieltsx_materials_type_check;
alter table public.ieltsx_materials add constraint ieltsx_materials_type_check check (type in ('reading','listening','writing'));
alter table public.ieltsx_materials add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.ieltsx_materials add column if not exists published boolean not null default true;
alter table public.ieltsx_materials add column if not exists "updatedAt" timestamptz not null default now();
-- the panel creates the public "ieltsx-media" Storage bucket (audio + images) by itself on the first upload.

-- ───────────── added in v5: Vocabulary collections (admin panel -> Vocabulary) ─────────────
-- Run this once on an existing database (safe to run again). Collections are rows of ieltsx_materials with type 'vocab':
-- `premium` = locked for Free users, `published` = visible, `data` = { kind, level, source, icon, words[] }.
alter table public.ieltsx_materials drop constraint if exists ieltsx_materials_type_check;
alter table public.ieltsx_materials add constraint ieltsx_materials_type_check check (type in ('reading','listening','writing','vocab'));

-- ───────────── added in v6: Access rules (admin panel -> Access: free / locked + plan for every pack and test) ─────────────
-- Run this once on an existing database (safe to run again). Without it the site keeps working with the default locks,
-- but the choices made in the panel cannot be saved.
create table if not exists public.ieltsx_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  "updatedAt" timestamptz not null default now()
);
alter table public.ieltsx_settings enable row level security;

-- ───────────── added in v5: Vocabulary collections (admin panel -> Vocabulary) ─────────────
-- Run this once on an existing database (safe to run again). Collections are rows of ieltsx_materials with type 'vocab':
-- `premium` = locked for Free users, `published` = visible, `data` = { kind, level, source, icon, words[] }.
alter table public.ieltsx_materials drop constraint if exists ieltsx_materials_type_check;
alter table public.ieltsx_materials add constraint ieltsx_materials_type_check check (type in ('reading','listening','writing','vocab'));

-- ───────────── added in v6: Access rules (admin panel -> Access: free / locked + plan for every pack and test) ─────────────
-- Run this once on an existing database (safe to run again). Without it the site keeps working with the default locks,
-- but the choices made in the panel cannot be saved.
create table if not exists public.ieltsx_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  "updatedAt" timestamptz not null default now()
);
alter table public.ieltsx_settings enable row level security;

-- ───────────── added in v5: Vocabulary collections (admin panel -> Vocabulary) ─────────────
-- Run this once on an existing database (safe to run again). Collections are rows of ieltsx_materials with type 'vocab':
-- `premium` = locked for Free users, `published` = visible, `data` = { kind, level, source, icon, words[] }.
alter table public.ieltsx_materials drop constraint if exists ieltsx_materials_type_check;
alter table public.ieltsx_materials add constraint ieltsx_materials_type_check check (type in ('reading','listening','writing','vocab'));

-- ───────────── added in v6: Access rules (admin panel -> Access: free / locked + plan for every pack and test) ─────────────
-- Run this once on an existing database (safe to run again). Without it the site keeps working with the default locks,
-- but the choices made in the panel cannot be saved.
create table if not exists public.ieltsx_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  "updatedAt" timestamptz not null default now()
);
alter table public.ieltsx_settings enable row level security;


-- ───────────── added in v7: Speaking tests and Articles made in the admin panel (run once) ─────────────
alter table public.ieltsx_materials drop constraint if exists ieltsx_materials_type_check;
alter table public.ieltsx_materials add constraint ieltsx_materials_type_check check (type in ('reading','listening','writing','vocab','speaking','article'));

-- ───────────── added in v7: every type the admin panel can create (run once on an existing database; safe to run again) ─────────────
-- Adds speaking, article and pdf (PDF library) to the allowed types. Without it Supabase refuses to save those.
alter table public.ieltsx_materials drop constraint if exists ieltsx_materials_type_check;
alter table public.ieltsx_materials add constraint ieltsx_materials_type_check check (type in ('reading','listening','writing','speaking','article','vocab','pdf'));
