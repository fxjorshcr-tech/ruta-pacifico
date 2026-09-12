-- Replace outdated contact details in database copy.
--
-- The FAQ answers (and possibly blog posts / destination guides) were written
-- when the business used +506 8596-2438 and mybooking@rutapacificocr.com.
-- Those strings reached the FAQPage JSON-LD on the home, booking and FAQ
-- pages, which is how AI assistants ended up quoting the old number.
-- The site now rewrites them on the fly (src/lib/contact.ts), but the rows
-- should carry the right values too.
--
-- Run in Supabase → SQL Editor. Safe to run more than once.

-- 1. See what will change.
select id, question, answer
from faqs_ruta_pacifico
where question || answer ~* '8596|rutapacificocr\.com';

-- 2. FAQs
update faqs_ruta_pacifico
set answer = regexp_replace(
      regexp_replace(
        regexp_replace(answer, '(\+?\s?506[\s.-]?)?8596[\s.-]?2438', '+506 7080-5578', 'g'),
        '[A-Za-z0-9._+-]+@rutapacificocr\.com', 'reservations@rutapacifico.com', 'g'),
      'rutapacificocr\.com(/private-tours/?)?', 'rutapacifico.com', 'g'),
    question = regexp_replace(
      regexp_replace(question, '(\+?\s?506[\s.-]?)?8596[\s.-]?2438', '+506 7080-5578', 'g'),
      '[A-Za-z0-9._+-]+@rutapacificocr\.com', 'reservations@rutapacifico.com', 'g')
where question || answer ~* '8596|rutapacificocr\.com';

-- 2b. One FAQ ("Do you offer tours in addition to transportation?") still
-- advertises a Private Tours section that this site does not have. Hide it
-- unless tours are actually sold — uncomment to run:
-- update faqs_ruta_pacifico set is_active = false
-- where question ilike '%offer tours%';

-- 3. Blog posts (title, excerpt, body, embedded FAQs)
update blog_posts_ruta_pacifico
set content_md = regexp_replace(
      regexp_replace(content_md, '(\+?\s?506[\s.-]?)?8596[\s.-]?2438', '+506 7080-5578', 'g'),
      '[A-Za-z0-9._+-]+@rutapacificocr\.com', 'reservations@rutapacifico.com', 'g'),
    excerpt = regexp_replace(excerpt, '(\+?\s?506[\s.-]?)?8596[\s.-]?2438', '+506 7080-5578', 'g'),
    faqs = replace(replace(faqs::text, '+506-8596-2438', '+506 7080-5578'),
                   'mybooking@rutapacificocr.com', 'reservations@rutapacifico.com')::jsonb
where content_md || excerpt || faqs::text ~* '8596|rutapacificocr\.com';

-- 4. Destination guides
update destinations_ruta_pacifico
set intro_md   = regexp_replace(intro_md,   '(\+?\s?506[\s.-]?)?8596[\s.-]?2438', '+506 7080-5578', 'g'),
    arrival_md = regexp_replace(arrival_md, '(\+?\s?506[\s.-]?)?8596[\s.-]?2438', '+506 7080-5578', 'g'),
    tips_md    = regexp_replace(tips_md,    '(\+?\s?506[\s.-]?)?8596[\s.-]?2438', '+506 7080-5578', 'g')
where intro_md || arrival_md || tips_md ~* '8596|rutapacificocr\.com';

-- 5. Should return no rows.
select 'faqs' as tbl, count(*) from faqs_ruta_pacifico where question || answer ~* '8596|rutapacificocr\.com'
union all
select 'blog', count(*) from blog_posts_ruta_pacifico where content_md || excerpt || faqs::text ~* '8596|rutapacificocr\.com'
union all
select 'destinations', count(*) from destinations_ruta_pacifico where intro_md || arrival_md || tips_md ~* '8596|rutapacificocr\.com';
