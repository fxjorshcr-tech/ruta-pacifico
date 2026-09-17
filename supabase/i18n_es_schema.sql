-- Spanish twins of the database copy shown on /es pages. Every column is
-- nullable: the site falls back to the English column when the Spanish one
-- is empty, so rows can be translated one at a time.
--
-- Run once in the Supabase SQL editor, then the i18n_es_*.sql seeds.

alter table public.faqs_ruta_pacifico
  add column if not exists question_es text,
  add column if not exists answer_es text;

alter table public.destinations_ruta_pacifico
  add column if not exists intro_md_es text,
  add column if not exists arrival_md_es text,
  add column if not exists tips_md_es text,
  add column if not exists best_for_es text[],
  add column if not exists image_alt_es text;

alter table public.blog_posts_ruta_pacifico
  add column if not exists title_es text,
  add column if not exists excerpt_es text,
  add column if not exists content_md_es text,
  add column if not exists faqs_es jsonb,
  add column if not exists cover_image_alt_es text;
