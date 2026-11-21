-- IELTSX — check the Payme database functions (supabase-schema.sql, v10) right inside Supabase.
-- Paste the whole file into Supabase -> SQL Editor and press Run AFTER running the v10 part of supabase-schema.sql.
-- It makes a test account, order and Payme transaction, runs Perform twice and a refund, checks every result, and then
-- ROLLS EVERYTHING BACK: nothing is kept. Success = the last line prints "payme sql check: all passed".
begin;

do $$
declare
  v_user uuid := gen_random_uuid();
  v_order uuid := gen_random_uuid();
  r jsonb; r2 jsonb;
  v_now bigint := (extract(epoch from clock_timestamp()) * 1000)::bigint;
  u public.ieltsx_users%rowtype;
  o public.ieltsx_orders%rowtype;
begin
  insert into public.ieltsx_users (id, name, email) values (v_user, 'Payme SQL check', 'payme-sql-check-' || v_user || '@example.invalid');
  insert into public.ieltsx_orders (id, ref, "userId", "userEmail", plan, "planName", months, amount)
    values (v_order, 'IX-' || upper(substr(md5(v_order::text), 1, 6)), v_user, 'x@example.invalid', 'max', 'Max', 3, 264000);
  insert into public.ieltsx_payme_transactions ("paymeId", "orderId", "orderRef", "userId", amount, "paymeTime", "createTime")
    select 'sqlcheck-1', v_order, ref, v_user, 26400000, v_now, v_now from public.ieltsx_orders where id = v_order;

  -- a second live transaction for the same order is refused by the unique index
  begin
    insert into public.ieltsx_payme_transactions ("paymeId", "orderId", "orderRef", "userId", amount, "paymeTime", "createTime")
      values ('sqlcheck-2', v_order, 'IX-TEST', v_user, 26400000, v_now, v_now);
    raise exception 'FAIL: a second live transaction was accepted';
  exception when unique_violation then null;
  end;

  r := public.ieltsx_payme_perform('sqlcheck-1', v_now, 43200000);
  if (r->>'performed') is distinct from 'true' or (r->'tx'->>'state')::int <> 2 then raise exception 'FAIL perform: %', r; end if;
  select * into u from public.ieltsx_users where id = v_user;
  select * into o from public.ieltsx_orders where id = v_order;
  if not u."premiumActive" or u.plan <> 'Max' or abs(extract(epoch from (u."premiumExpiresAt" - now())) - 90 * 86400) > 120 then raise exception 'FAIL grant: % % %', u."premiumActive", u.plan, u."premiumExpiresAt"; end if;
  if o.status <> 'paid' or o."paidVia" <> 'payme' then raise exception 'FAIL order: % %', o.status, o."paidVia"; end if;

  r2 := public.ieltsx_payme_perform('sqlcheck-1', v_now + 5000, 43200000);   -- a repeated callback
  if r2 ? 'performed' or (r2->'tx'->>'performTime') <> (r->'tx'->>'performTime') then raise exception 'FAIL repeated perform: %', r2; end if;
  if (select "premiumExpiresAt" from public.ieltsx_users where id = v_user) <> u."premiumExpiresAt" then raise exception 'FAIL: the plan was extended twice'; end if;

  r := public.ieltsx_payme_perform('no-such-id', v_now, 43200000);
  if (r->>'code')::int <> -31003 then raise exception 'FAIL unknown id: %', r; end if;
  r := public.ieltsx_payme_cancel('sqlcheck-1', 5, v_now + 10000, false);
  if (r->>'code')::int <> -31007 then raise exception 'FAIL refund refused: %', r; end if;

  r := public.ieltsx_payme_cancel('sqlcheck-1', 5, v_now + 10000, true);   -- refund
  if (r->>'refunded') is distinct from 'true' or (r->'tx'->>'state')::int <> -2 then raise exception 'FAIL refund: %', r; end if;
  select * into u from public.ieltsx_users where id = v_user;
  if u."premiumActive" or u.plan <> 'Free' then raise exception 'FAIL refund did not take the plan back: % %', u."premiumActive", u.plan; end if;
  if (select status from public.ieltsx_orders where id = v_order) <> 'refunded' then raise exception 'FAIL order not refunded'; end if;
  r2 := public.ieltsx_payme_cancel('sqlcheck-1', 5, v_now + 20000, true);   -- a repeated cancel
  if (r2->'tx'->>'cancelTime') <> (r->'tx'->>'cancelTime') then raise exception 'FAIL repeated cancel: %', r2; end if;
  r := public.ieltsx_payme_perform('sqlcheck-1', v_now, 43200000);
  if (r->>'code')::int <> -31008 then raise exception 'FAIL perform after refund: %', r; end if;

  -- timeout: a created transaction older than 12 hours is cancelled with reason 4
  update public.ieltsx_orders set status = 'pending' where id = v_order;
  insert into public.ieltsx_payme_transactions ("paymeId", "orderId", "orderRef", "userId", amount, "paymeTime", "createTime")
    values ('sqlcheck-3', v_order, 'IX-TEST', v_user, 26400000, v_now, v_now - 13 * 3600000);
  r := public.ieltsx_payme_perform('sqlcheck-3', v_now, 43200000);
  if (r->>'code')::int <> -31008 or (r->'tx'->>'state')::int <> -1 or (r->'tx'->>'reason')::int <> 4 then raise exception 'FAIL timeout: %', r; end if;

  raise notice 'payme sql check: all passed';
end $$;

rollback;
select 'payme sql check: all passed (everything was rolled back)' as result;
