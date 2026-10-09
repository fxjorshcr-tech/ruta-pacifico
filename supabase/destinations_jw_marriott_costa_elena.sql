-- JW Marriott Costa Elena (La Cruz): ficha de destino para rutapacifico.com
-- Solo esta fila (EN + ES). Idempotente: se puede correr varias veces.
-- Requiere que ya exista la tabla destinations_ruta_pacifico con las
-- columnas *_es (supabase/destinations_schema.sql + i18n_es_schema.sql),
-- que ya existen en el proyecto.

insert into public.destinations_ruta_pacifico
  (slug, name, short_name, region, tier, intro_md, arrival_md, tips_md, best_for)
values
('jw-marriott-costa-elena-la-cruz', 'JW Marriott Costa Elena (La Cruz)', 'JW Marriott Costa Elena', 'Guanacaste (far north coast)', 3, $md$The JW Marriott Costa Elena stands on Playa El Jobo in La Cruz, the far north of Guanacaste, 20 minutes from the Nicaraguan border. It is the resort that opened as Dreams Las Mareas: a full-service beachfront property with several pools, restaurants, a spa and a wide, calm, golden-sand beach inside Bahía Salinas, backed by the dry forest of the Costa Elena development.

It is the most secluded of the big Guanacaste resorts. Guests come for the beach and the resort itself, with Santa Rosa National Park, the Bahía Salinas kitesurfing beaches and Rincón de la Vieja all possible day trips.$md$, $md$From Liberia Airport the transfer takes about 1 hour 30 minutes, all on paved road: the Pan-American Highway north past Santa Rosa National Park to La Cruz, then the coastal road down to Bahía Salinas and Playa El Jobo. The viewpoint at La Cruz, high above the bay, is worth a two-minute photo stop. Your driver takes you to the resort lobby; there is one gate and no walking involved.$md$, $md$- The resort is the only hotel on its beach: buy snacks, sunscreen or anything outside the all-inclusive in Liberia on the way in.
- Afternoons in Bahía Salinas are windy from December to April, which is why the kitesurfing schools are here; mornings are calm.
- Keep passports in your hand luggage; the border at Peñas Blancas is close and police checkpoints on Route 1 occasionally ask for ID.
- Book the airport pickup for 4.5 hours before an international departure: 1.5 hours of driving plus 3 hours at LIR.$md$, array['Resort stay', 'All-inclusive', 'Beachfront'])
on conflict (slug) do update set
  name = excluded.name, short_name = excluded.short_name, region = excluded.region,
  tier = excluded.tier, intro_md = excluded.intro_md, arrival_md = excluded.arrival_md,
  tips_md = excluded.tips_md, best_for = excluded.best_for, updated_at = now();

update public.destinations_ruta_pacifico set
  intro_md_es = $es$El JW Marriott Costa Elena está sobre Playa El Jobo, en La Cruz, en el extremo norte de Guanacaste, a 20 minutos de la frontera con Nicaragua. Es el resort que abrió como Dreams Las Mareas: una propiedad de servicio completo frente al mar con varias piscinas, restaurantes, spa y una playa amplia, tranquila y de arena dorada dentro de Bahía Salinas, rodeada del bosque seco del desarrollo Costa Elena.

Es el más apartado de los grandes resorts de Guanacaste. Los huéspedes vienen por la playa y el resort en sí, con el Parque Nacional Santa Rosa, las playas de kitesurf de Bahía Salinas y Rincón de la Vieja como posibles paseos de un día.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia el traslado toma aproximadamente 1 hora 30 minutos, todo por carretera asfaltada: la Interamericana al norte, pasando el Parque Nacional Santa Rosa hasta La Cruz, y luego la carretera costera que baja a Bahía Salinas y Playa El Jobo. El mirador de La Cruz, en lo alto sobre la bahía, vale una parada de dos minutos para fotos. El chofer te lleva hasta el lobby del resort; hay un solo portón y no se camina nada.$es$,
  tips_md_es = $es$- El resort es el único hotel de su playa: compra snacks, bloqueador o cualquier cosa fuera del todo incluido en Liberia, de camino.
- Las tardes en Bahía Salinas son ventosas de diciembre a abril, por eso las escuelas de kitesurf están aquí; las mañanas son tranquilas.
- Lleva los pasaportes en el equipaje de mano; la frontera de Peñas Blancas queda cerca y los retenes policiales de la Ruta 1 a veces piden identificación.
- Reserva la recogida hacia el aeropuerto 4,5 horas antes de un vuelo internacional: 1,5 horas de camino más 3 horas en LIR.$es$,
  best_for_es = array['Estadía en resort','Todo incluido','Frente al mar'],
  image_alt_es = null
where slug = 'jw-marriott-costa-elena-la-cruz';

-- Verificar:
-- select slug, name, tier, length(intro_md) as en, length(intro_md_es) as es
-- from public.destinations_ruta_pacifico where slug = 'jw-marriott-costa-elena-la-cruz';
