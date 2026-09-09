-- ============================================================
-- Destination guides + SEO tiers for rutapacifico.com
--
-- Run this ONCE in the Supabase SQL Editor (Dashboard → SQL Editor →
-- New query → paste → Run), then run destinations_seed.sql.
--
-- WHY A SEPARATE TABLE: the `routes` table is SHARED with Cant Wait
-- Travel (its is_indexable flag and journey_description texts belong to
-- that site). Ruta Pacifico must never write to it and must not reuse
-- its texts, or both sites end up with duplicate content. Everything
-- Ruta-Pacifico-specific lives here, keyed by the destination slug that
-- src/lib/slug.ts derives from routes.origen / routes.destino.
-- ============================================================

create table if not exists public.destinations_ruta_pacifico (
  slug text primary key,                 -- toSlug(routes.origen|destino), e.g. 'tamarindo-guanacaste'
  name text not null unique,             -- EXACT routes.origen / routes.destino text
  short_name text not null,              -- 'Tamarindo'
  region text not null,                  -- 'Guanacaste', 'Central Valley', ...
  tier smallint not null default 4
    check (tier between 1 and 4),        -- 1 hub · 2 core beach · 3 hub-linked · 4 noindex
  intro_md text not null default '',     -- what the place is (Markdown)
  arrival_md text not null default '',   -- what the drive / arrival is like (Markdown)
  tips_md text not null default '',      -- practical bullet list (Markdown)
  best_for text[] not null default '{}', -- chips: {'Surfing','Families'}
  image_url text,                        -- optional hero photo (Supabase Storage public URL)
  image_alt text,
  updated_at timestamptz not null default now()
);

comment on table public.destinations_ruta_pacifico is
  'Ruta Pacifico destination guides and SEO tiers. A route page is indexable when both endpoints are tier ≤ 3 and (one is a tier-1 hub or both are tier-2 beaches).';

create or replace function public.destinations_ruta_pacifico_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_destinations_ruta_pacifico_updated_at on public.destinations_ruta_pacifico;
create trigger trg_destinations_ruta_pacifico_updated_at
  before update on public.destinations_ruta_pacifico
  for each row
  execute function public.destinations_ruta_pacifico_set_updated_at();

-- The website reads with the public anon key: read-only for everyone,
-- writes only from the dashboard / service role.
alter table public.destinations_ruta_pacifico enable row level security;

drop policy if exists "Public can read destinations" on public.destinations_ruta_pacifico;
create policy "Public can read destinations"
  on public.destinations_ruta_pacifico
  for select
  to anon, authenticated
  using (true);
