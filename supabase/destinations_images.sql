-- Photos for the destination hubs and guides. The site applies the same
-- values as a code fallback while image_url is empty (src/lib/destinations.ts);
-- run this once in the Supabase SQL editor to store them, then replace any
-- URL with a better photo of that exact place whenever you have one.
update destinations_ruta_pacifico as d
set image_url = v.url, image_alt = v.alt, image_alt_es = v.alt_es
from (values
  ('lir-liberia-int-airport', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aeropuerto-LIR-guanacaste.webp', 'Liberia International Airport (LIR), Guanacaste', 'Aeropuerto Internacional de Liberia (LIR), Guanacaste'),
  ('la-fortuna-arenal', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-view.webp', 'Arenal Volcano, La Fortuna', 'Volcán Arenal, La Fortuna'),
  ('monteverde-cloud-forest', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/cloud-forest-monteverde-costa-rica-trees.webp', 'Monteverde Cloud Forest', 'Bosque Nuboso de Monteverde'),
  ('manuel-antonio-quepos', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/capuchin-monkey-manuel-antonio-costa-rica.webp', 'Capuchin monkey, Manuel Antonio National Park', 'Mono capuchino, Parque Nacional Manuel Antonio'),
  ('tamarindo-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/tamarindo-beach-costa-rica.webp', 'Tamarindo Beach, Guanacaste', 'Playa Tamarindo, Guanacaste'),
  ('flamingo-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/guanacaste-beach-sunset-costa-rica.webp', 'Sunset on the Flamingo coast, Guanacaste', 'Atardecer en la costa de Flamingo, Guanacaste'),
  ('conchal-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp', 'Playa Conchal from the air, Guanacaste', 'Playa Conchal desde el aire, Guanacaste'),
  ('playa-potrero-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/costa-rica-beach-travel.webp', 'Beach near Playa Potrero, Guanacaste', 'Playa cerca de Potrero, Guanacaste'),
  ('las-catalinas-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/summer-time-beach-costarica.webp', 'Beach at Las Catalinas, Guanacaste', 'Playa en Las Catalinas, Guanacaste'),
  ('playa-grande-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/playa_tamarindo_kristen_brown.jpg', 'Surfer at sunset, Playa Grande', 'Surfista al atardecer, Playa Grande'),
  ('papagayo-peninsula-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/buseta-papagayo.webp', 'Ruta Pacifico shuttle on the Papagayo Peninsula', 'Shuttle de Ruta Pacifico en la Península de Papagayo'),
  ('playas-del-coco-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/tamarindo-Costa-rica.jpg', 'Cove near Playas del Coco, Guanacaste', 'Ensenada cerca de Playas del Coco, Guanacaste'),
  ('playa-hermosa-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp', 'Playa Hermosa, Guanacaste', 'Playa Hermosa, Guanacaste'),
  ('nosara-playa-guiones-area', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/nosara-beach-surf-guanacaste.jpg', 'Surf at Playa Guiones, Nosara', 'Surf en Playa Guiones, Nosara'),
  ('samara-playa-carrillo-guanacaste', 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Conchal-beach-guanacaste.webp', 'Beach near Sámara, Guanacaste', 'Playa cerca de Sámara, Guanacaste')
) as v(slug, url, alt, alt_es)
where d.slug = v.slug and (d.image_url is null or d.image_url = '');
