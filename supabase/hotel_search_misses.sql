-- ============================================================
-- HOTEL SEARCH MISSES  (shared with Cant Wait Travel — same project)
-- ------------------------------------------------------------
-- Records location searches in the route finder that returned no result,
-- so we can see which hotels to add to src/lib/hotels.ts.
-- Written by /api/hotel-miss via the log_hotel_miss() RPC.
--
-- The table and function already exist in the shared Supabase project
-- (created by cwt-web, 2026-06-19). This file is idempotent: running it
-- again only makes sure the anon key used by Ruta Pacifico may call the
-- RPC (the function is SECURITY DEFINER, so anon never touches the table).
-- ============================================================

create table if not exists hotel_search_misses (
  id          bigint generated always as identity primary key,
  query       text        not null,        -- what the guest typed (trimmed)
  normalized  text        not null unique,  -- lower(trim(query)) for dedupe
  hits        integer     not null default 1,
  first_seen  timestamptz not null default now(),
  last_seen   timestamptz not null default now()
);

alter table hotel_search_misses enable row level security;

create or replace function log_hotel_miss(q text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  n text := lower(trim(q));
begin
  if n is null or length(n) < 3 then
    return;
  end if;

  insert into hotel_search_misses (query, normalized)
  values (trim(q), n)
  on conflict (normalized)
  do update set
    hits = hotel_search_misses.hits + 1,
    last_seen = now();
end;
$$;

grant execute on function log_hotel_miss(text) to anon, authenticated, service_role;

-- Review the most-wanted missing hotels with:
--   select query, hits, last_seen
--   from hotel_search_misses
--   order by hits desc, last_seen desc
--   limit 50;
