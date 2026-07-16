-- ============================================================
-- Blog posts table for rutapacifico.com
-- Run this ONCE in the Supabase SQL Editor (Dashboard → SQL Editor
-- → New query → paste → Run).
-- ============================================================

create table if not exists public.blog_posts_ruta_pacifico (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,                -- 1-2 sentence summary (meta description + card text)
  content_md text not null,             -- article body in Markdown (GFM tables supported)
  cover_image_url text,                 -- public URL from Supabase Storage (nullable until photo is ready)
  cover_image_alt text,
  category text not null default 'travel-guide',
  tags text[] not null default '{}',
  faqs jsonb not null default '[]',     -- [{"q": "...", "a": "..."}] rendered as FAQ section + FAQPage schema
  author text not null default 'Ruta Pacifico Team',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every edit (used for "Updated <month year>" + sitemap).
create or replace function public.blog_posts_ruta_pacifico_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_blog_posts_ruta_pacifico_updated_at on public.blog_posts_ruta_pacifico;
create trigger trg_blog_posts_ruta_pacifico_updated_at
  before update on public.blog_posts_ruta_pacifico
  for each row
  execute function public.blog_posts_ruta_pacifico_set_updated_at();

-- Row Level Security: the website uses the public anon key, so allow
-- read-only access to PUBLISHED posts only. Writing requires the service
-- role (Supabase dashboard / SQL editor), never the website.
alter table public.blog_posts_ruta_pacifico enable row level security;

drop policy if exists "Public can read published posts" on public.blog_posts_ruta_pacifico;
create policy "Public can read published posts"
  on public.blog_posts_ruta_pacifico
  for select
  to anon, authenticated
  using (published = true);

-- Helpful index for the listing page (newest first).
create index if not exists blog_posts_ruta_pacifico_published_idx
  on public.blog_posts_ruta_pacifico (published, published_at desc);
