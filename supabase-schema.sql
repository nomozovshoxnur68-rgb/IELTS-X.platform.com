create extension if not exists pgcrypto;
create table if not exists public.ieltsx_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null default 'user' check (role in ('user','admin')),
  plan text not null default 'Free',
  "premiumActive" boolean not null default false,
  "premiumExpiresAt" timestamptz null,
  "passwordHash" text not null,
  "passwordSalt" text not null,
  "createdAt" timestamptz not null default now()
);
alter table public.ieltsx_users enable row level security;
-- After registering your admin account, run:
-- update public.ieltsx_users set role='admin', plan='Admin', "premiumActive"=true where email='YOUR_ADMIN_EMAIL';
