-- ============================================================
-- Blog: "JW Marriott Costa Elena is open" (EN + ES) for rutapacifico.com
--
-- Run in the Supabase SQL Editor AFTER blog_schema.sql and
-- i18n_es_schema.sql (both already applied). Idempotent: keyed by slug,
-- re-running simply rewrites the same article.
--
-- Facts checked on 9 Oct 2026 against Marriott's announcement (6 Oct 2026,
-- via The Tico Times), Costa Rican Trails and Deep Arrival: guests since
-- 10 Sep 2026, 415 rooms and suites, 45-room Griffin Club, 15 restaurants
-- and bars, 17 pools over 44,000 sq ft, Spa by JW, former Dreams Las
-- Mareas, operated by Mullen Hospitality Management. Transfer fares are
-- the live routes-table prices for LIR <-> JW Marriott Costa Elena.
--
-- Also patches the pillar article (best-hotels-guanacaste-by-zone...) so it
-- no longer calls the resort Dreams Las Mareas. blog_seed_03.sql carries
-- the same wording, so re-running that seed later will not undo this.
-- ============================================================

insert into public.blog_posts_ruta_pacifico
  (slug, title, excerpt, cover_image_url, cover_image_alt, category, tags, published, published_at, faqs, content_md)
values
(
  'jw-marriott-costa-elena-opens-guanacaste',
  $t$JW Marriott Costa Elena Is Open: What the New All-Inclusive in Northern Guanacaste Is Like and How to Get There from Liberia Airport$t$,
  $t$The former Dreams Las Mareas reopened on 10 September 2026 as the first all-inclusive JW Marriott in the world. What the $60 million rebuild changed, where Playa El Jobo actually is, the 1.5-hour drive from LIR, and the $160 fixed private transfer.$t$,
  'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/jw-marriot-costa-elena-guanacaste.webp',
  'JW Marriott Costa Elena resort on Playa El Jobo, La Cruz, northern Guanacaste',
  'news',
  array['jw marriott costa elena','jw marriott costa elena opening','costa elena guanacaste','liberia airport to jw marriott costa elena','dreams las mareas','all inclusive guanacaste','playa el jobo','la cruz guanacaste shuttle'],
  true,
  now(),
  $j$[
    {"q": "When did the JW Marriott Costa Elena open?", "a": "The resort started taking guests on 10 September 2026, and Marriott International made the official opening announcement on 6 October 2026. It is the first all-inclusive resort under the JW Marriott brand anywhere in the world."},
    {"q": "Is the JW Marriott Costa Elena the old Dreams Las Mareas?", "a": "Yes. It is the same beachfront on Playa El Jobo in La Cruz. The property changed hands in 2025 and was rebuilt as a JW Marriott in a $60 million transformation run by Mullen Hospitality Management, the franchise operator. Any route or price you saw for Dreams Las Mareas now applies to the JW Marriott Costa Elena."},
    {"q": "How far is the JW Marriott Costa Elena from Liberia Airport?", "a": "About 75 km (47 mi), which is a private transfer of 1 hour 20 minutes to 1 hour 40 minutes on paved road. You take the Pan-American Highway north past Santa Rosa National Park to La Cruz, then the coastal road down to Bahía Salinas and Playa El Jobo."},
    {"q": "How much is a private transfer from LIR to the JW Marriott Costa Elena?", "a": "Ruta Pacifico charges a fixed $160 per vehicle for 1 to 5 passengers, $180 for 6 to 9 and $240 for 10 to 12, in either direction. Taxes, flight tracking, child seats and a grocery stop on the way are included, and there is no surcharge for early or late flights."},
    {"q": "Is there a town near the JW Marriott Costa Elena?", "a": "No. The resort is alone on its beach inside the Costa Elena development. La Cruz, a small town with a supermarket and a few sodas, is about 20 minutes away; Playas del Coco is roughly an hour. Most guests stay on the all-inclusive and book a driver for day trips to Santa Rosa National Park, Rincón de la Vieja or the Papagayo gulf."}
  ]$j$::jsonb,
  $md$Every year or two a hotel opens in Guanacaste that changes where people ask us to drive them. In 2025 it was Nekajui on Peninsula Papagayo. This year it is the JW Marriott Costa Elena, which took its first guests on 10 September 2026 on Playa El Jobo, up in La Cruz, about as far north as you can go in Costa Rica before you reach Nicaragua. Marriott made the opening official on 6 October, and the bookings for the drive from Liberia Airport started arriving the same week. This is what the resort is, what changed from the hotel that stood there before, and what the trip from LIR is really like.

## Quick facts

| | |
| --- | --- |
| Opened | 10 September 2026 (first guests); announced by Marriott on 6 October 2026 |
| What it is | The first all-inclusive JW Marriott in the world |
| Where | Playa El Jobo, La Cruz, northern Guanacaste, inside the Costa Elena development |
| Rooms | 415 rooms and suites, including the 45-room Griffin Club |
| Dining | 15 restaurants and bars |
| Pools | 17, covering about 44,000 sq ft (4,090 m²), with an oceanfront infinity pool |
| Formerly | Dreams Las Mareas, rebuilt in a $60 million transformation |
| Distance from LIR | 75 km (47 mi), paved the whole way |
| Drive time | 1 h 20 – 1 h 40 |
| Private transfer, 1–5 passengers | $160 per vehicle, fixed |
| Private transfer, 6–9 passengers | $180 per vehicle |
| Private transfer, 10–12 passengers | $240 per vehicle |

## The hotel that was there before

If you have been to northern Guanacaste, you know the site. Dreams Las Mareas opened on Playa El Jobo in 2014 and for a decade it was the all-inclusive at the top of the map, the one guests booked for a quiet week far from Tamarindo. It changed owners in 2025 and closed for the rebuild. The operator, Mullen Hospitality Management, describes the result as a $60 million transformation rather than a renovation, and from what our drivers have seen on the first runs, that is fair: the arrival, the pool area and the restaurants are new, not refreshed.

The name matters for one practical reason. The route in our booking system that used to say Dreams Las Mareas now says JW Marriott Costa Elena, with the same fares, and if your hotel confirmation or an old itinerary still shows the Dreams name, it is the same place.

## What opened on 10 September

The JW Marriott Costa Elena is a milestone for the brand: JW Marriott has never run an all-inclusive resort before, anywhere, and it chose this beach for the first one. The numbers it opened with are large for Guanacaste.

**Rooms.** There are 415 rooms and suites, designed to feel like villas, every one with a private terrace or balcony. Some ground-floor rooms open onto semi-private swim-out pools. Junior Suites start at about 527 sq ft and come with a hot tub on the terrace. The Griffin Club is a 45-room section within the resort with its own lounge, its own pool, a private stretch of beach, butler service, personal check-in and priority reservations at the restaurants and pool cabanas.

**Food.** Fifteen restaurants and bars, which is more than any other resort in the province. The ones Marriott has named: Leal, a Guanacaste-inspired restaurant with coffee-roasting experiences and a seven-course tasting menu; Casado, a wood-fired coastal grill; Puerto Limón, with Afro-Caribbean cooking from the other coast; and LaGloria, a root beer stand. There are also Italian, Mexican and Japanese kitchens, and a JW Garden that grows herbs, edible flowers, fruit and vegetables for the restaurants and bars. Once a week the resort hosts a night market with artisans, food, music and dance from the area.

**Pools.** Seventeen of them, including an oceanfront infinity pool, spread over roughly 44,000 sq ft. Marriott calls it the largest resort pool complex in Costa Rica. There are separate family and Griffin Club areas, a children's pool and a waterslide.

**Spa and wellness.** Spa by JW occupies close to 16,000 sq ft with a fitness centre and one of the largest hydrotherapy pools in the country. It also has the brand's first Mindfulness House, with treatments that range from hydrotherapy and sound healing to Reiki and cacao ceremonies.

**Families and activities.** The Family by JW Club runs nature walks, children's yoga, creative workshops, storytelling and movie nights. Off the beach there is kayaking, fishing, scuba diving, sunset hikes and private yacht charters, all organised from the resort.

## Where Playa El Jobo actually is

This is the part most hotel websites skip. The resort sits on Playa El Jobo, a wide, golden-sand beach inside Bahía Salinas, the big bay on the Pacific side of the Nicaraguan border. It belongs to Costa Elena, a private development of about 1,200 hectares (3,000 acres) of dry forest and coastline, and the hotel is the only one on its beach.

There is no town. La Cruz, 20 minutes up the hill, is a small municipal centre with a supermarket, a few sodas and the best viewpoint in northern Guanacaste, high above the bay. The border crossing at Peñas Blancas is about 20 minutes further on. Playas del Coco, the nearest beach town with restaurants and bars, is roughly an hour away. Guests who choose the JW Marriott Costa Elena choose it for that: a full all-inclusive with the whole bay to itself.

The bay has its own weather. From December to April the afternoon wind in Bahía Salinas is strong enough that the kitesurfing schools of the country are based here, on the beaches just east of the resort. Mornings are calm. Santa Rosa National Park, with the dry-forest trails and the historic Casona, is half an hour back down the highway, and Rincón de la Vieja is a day trip of about an hour and a half each way.

## The drive from Liberia Airport

Your driver waits at the arrivals exit holding a sign with your name. We track the flight, so an early or late landing changes nothing, and you leave as soon as you have your bags.

From the airport the van joins the Pan-American Highway (Route 1) heading north. The first 40 minutes are flat and fast through the dry forest, past the entrance to Santa Rosa National Park. The road then climbs to La Cruz, where the view opens over the whole of Bahía Salinas; it is worth asking the driver for a two-minute photo stop at the viewpoint. From there the coastal road descends to the bay and runs along it, paved, to the Costa Elena entrance and the resort gate. Door to door it takes 1 hour 20 minutes to 1 hour 40 minutes depending on traffic at the Liberia junctions, and the whole route is paved: no 4x4, no gravel, and no problem after dark.

Costa Elena is a private development with a guard post at its entrance. As with Peninsula Papagayo and Hacienda Pinilla, we send the driver's details to the resort when a hotel asks for them, so the vehicle is expected when you arrive.

Live prices and booking are on the [LIR to JW Marriott Costa Elena route page](/private-shuttle/lir-liberia-int-airport-to-jw-marriott-costa-elena-la-cruz). The return, [JW Marriott Costa Elena to LIR](/private-shuttle/jw-marriott-costa-elena-la-cruz-to-lir-liberia-int-airport), is the same fare.

## Ways to get there from LIR

| Option | Time to the hotel | Cost | Worth knowing |
| --- | --- | --- | --- |
| Private transfer | 1 h 20 – 1 h 40, direct | $160 fixed for 1–5 passengers | Flight tracked, child seats included, one grocery stop |
| Hotel car service | Same drive | Premium rate through the concierge | Usually the most expensive option |
| Rental car | Same drive plus pickup paperwork | $40–90 a day plus mandatory insurance and a deposit | Only pays off if you leave the resort every day; there is little to drive to |
| Shared shuttle | Not offered to La Cruz on a fixed schedule | — | Shared vans serve Coco, Tamarindo and Flamingo, not Bahía Salinas |
| Airport taxi | Same drive | $130–170, negotiated on the spot | No flight tracking, cash only, no child seats |

For two people the private transfer costs about what a taxi would, with the price fixed before you land. For a family of five it is $32 a head for a 75 km ride, which is why the all-inclusive guests nearly all book it.

## Day trips from the resort

| Destination | Time from the JW Marriott Costa Elena | Why go |
| --- | --- | --- |
| Playa Rajada and the Bahía Salinas beaches | 10–15 min | Calm snorkelling coves in the morning, kitesurfing wind in the afternoon |
| La Cruz viewpoint and town | 20 min | The panorama over the bay, a supermarket and local sodas |
| Santa Rosa National Park | 30 min | Dry-forest trails, the Casona, and Playa Naranjo with Witch's Rock offshore |
| Rincón de la Vieja | 1 h 30 | Hot springs, mud pools and volcano hikes; the classic full-day trip |
| Playas del Coco and the Papagayo gulf | 1 h | The nearest beach town, plus boat trips on the gulf |

All of these are quoted as private round trips with the driver waiting, which is usually cheaper than the concierge rate for the same car.

## A few things our drivers would tell you

- The resort is the only hotel on its beach and the nearest shop is 20 minutes away, so if you want anything that is not on the all-inclusive, stop at the supermarket in Liberia or La Cruz on the way in. The stop costs nothing.
- The LIR arrivals hall is busiest between noon and 4 p.m., when the US flights land together. Allow up to an hour for immigration before you meet the driver; we track the flight and adjust.
- For the departure, book the pickup 4.5 hours before an international flight: 1.5 hours of driving plus the 3 hours the airport asks for in high season.
- Keep passports in your hand luggage. The border is close and the police checkpoints on Route 1 occasionally ask for identification.
- Arriving at night is fine. The highway and the coastal road are paved and the resort gate is staffed around the clock; there is no night surcharge on the transfer.

## Booking

The [Liberia Airport to JW Marriott Costa Elena private transfer](/private-shuttle/lir-liberia-int-airport-to-jw-marriott-costa-elena-la-cruz) can be booked online in a couple of minutes at a fixed price per vehicle, with the flight tracked and child seats included. If you want to compare the resort with the rest of the coast first, our guide to the [best hotels in Guanacaste by zone](/blog/best-hotels-guanacaste-by-zone-liberia-airport-transfer) covers all of them, and for anything else, write to us on WhatsApp and one of the drivers will answer.
$md$
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  category = excluded.category,
  tags = excluded.tags,
  published = excluded.published,
  faqs = excluded.faqs,
  content_md = excluded.content_md;

update public.blog_posts_ruta_pacifico set
  title_es = $t$Abrió el JW Marriott Costa Elena: cómo es el nuevo todo incluido del norte de Guanacaste y cómo llegar desde el Aeropuerto de Liberia$t$,
  excerpt_es = $t$El antiguo Dreams Las Mareas reabrió el 10 de septiembre de 2026 como el primer JW Marriott todo incluido del mundo. Qué cambió con la inversión de $60 millones, dónde queda realmente Playa El Jobo, el viaje de hora y media desde LIR y el traslado privado fijo de $160.$t$,
  cover_image_alt_es = 'Resort JW Marriott Costa Elena en Playa El Jobo, La Cruz, norte de Guanacaste',
  faqs_es = $j$[
    {"q": "¿Cuándo abrió el JW Marriott Costa Elena?", "a": "El resort empezó a recibir huéspedes el 10 de septiembre de 2026 y Marriott International hizo el anuncio oficial de apertura el 6 de octubre de 2026. Es el primer resort todo incluido de la marca JW Marriott en el mundo."},
    {"q": "¿El JW Marriott Costa Elena es el antiguo Dreams Las Mareas?", "a": "Sí. Es la misma playa, Playa El Jobo en La Cruz. La propiedad cambió de dueño en 2025 y se reconstruyó como JW Marriott con una inversión de $60 millones a cargo de Mullen Hospitality Management, el operador de la franquicia. Cualquier ruta o precio que hayas visto para Dreams Las Mareas aplica ahora al JW Marriott Costa Elena."},
    {"q": "¿A qué distancia está el JW Marriott Costa Elena del Aeropuerto de Liberia?", "a": "A unos 75 km (47 mi), un traslado privado de 1 hora 20 minutos a 1 hora 40 minutos por carretera asfaltada. Se toma la Interamericana al norte, pasando el Parque Nacional Santa Rosa hasta La Cruz, y luego la carretera costera que baja a Bahía Salinas y Playa El Jobo."},
    {"q": "¿Cuánto cuesta un traslado privado de LIR al JW Marriott Costa Elena?", "a": "Ruta Pacifico cobra una tarifa fija de $160 por vehículo para 1 a 5 pasajeros, $180 para 6 a 9 y $240 para 10 a 12, en cualquiera de los dos sentidos. Incluye impuestos, seguimiento de vuelo, sillas para niños y una parada para víveres en el camino, y no hay recargo por vuelos de madrugada o de noche."},
    {"q": "¿Hay algún pueblo cerca del JW Marriott Costa Elena?", "a": "No. El resort está solo en su playa, dentro del desarrollo Costa Elena. La Cruz, un pueblo pequeño con supermercado y algunas sodas, queda a unos 20 minutos; Playas del Coco, a más o menos una hora. La mayoría de los huéspedes se queda en el todo incluido y reserva un chofer para paseos de un día al Parque Nacional Santa Rosa, Rincón de la Vieja o el golfo de Papagayo."}
  ]$j$::jsonb,
  content_md_es = $es$Cada uno o dos años abre en Guanacaste un hotel que cambia a dónde nos piden que llevemos a la gente. En 2025 fue Nekajui, en Península Papagayo. Este año es el JW Marriott Costa Elena, que recibió a sus primeros huéspedes el 10 de septiembre de 2026 en Playa El Jobo, en La Cruz, casi tan al norte como se puede ir en Costa Rica antes de llegar a Nicaragua. Marriott hizo oficial la apertura el 6 de octubre, y las reservas del viaje desde el Aeropuerto de Liberia empezaron a llegar esa misma semana. Esto es lo que es el resort, qué cambió respecto al hotel que estaba ahí antes y cómo es realmente el viaje desde LIR.

## Datos rápidos

| | |
| --- | --- |
| Apertura | 10 de septiembre de 2026 (primeros huéspedes); anunciada por Marriott el 6 de octubre de 2026 |
| Qué es | El primer JW Marriott todo incluido del mundo |
| Dónde | Playa El Jobo, La Cruz, norte de Guanacaste, dentro del desarrollo Costa Elena |
| Habitaciones | 415 habitaciones y suites, incluido el Griffin Club de 45 habitaciones |
| Restaurantes | 15 restaurantes y bares |
| Piscinas | 17, en unos 4,090 m² (44,000 pies²), con una piscina infinita frente al mar |
| Antes era | Dreams Las Mareas, reconstruido con una inversión de $60 millones |
| Distancia desde LIR | 75 km (47 mi), asfaltado todo el camino |
| Tiempo de viaje | 1 h 20 – 1 h 40 |
| Traslado privado, 1–5 pasajeros | $160 por vehículo, fijo |
| Traslado privado, 6–9 pasajeros | $180 por vehículo |
| Traslado privado, 10–12 pasajeros | $240 por vehículo |

## El hotel que estaba antes

Si has estado en el norte de Guanacaste, conoces el lugar. Dreams Las Mareas abrió en Playa El Jobo en 2014 y durante una década fue el todo incluido de la punta del mapa, el que reservaban los huéspedes que querían una semana tranquila lejos de Tamarindo. Cambió de dueño en 2025 y cerró para la reconstrucción. El operador, Mullen Hospitality Management, describe el resultado como una transformación de $60 millones y no como una remodelación, y por lo que han visto nuestros choferes en los primeros viajes, es justo: la llegada, el área de piscinas y los restaurantes son nuevos, no retocados.

El nombre importa por una razón práctica. La ruta de nuestro sistema de reservas que antes decía Dreams Las Mareas ahora dice JW Marriott Costa Elena, con las mismas tarifas, y si la confirmación de tu hotel o un itinerario viejo todavía muestra el nombre Dreams, es el mismo lugar.

## Qué abrió el 10 de septiembre

El JW Marriott Costa Elena es un hito para la marca: JW Marriott nunca había operado un resort todo incluido, en ningún lugar, y eligió esta playa para el primero. Los números con los que abrió son grandes para Guanacaste.

**Habitaciones.** Son 415 habitaciones y suites, diseñadas para sentirse como villas, todas con terraza o balcón privado. Algunas habitaciones de planta baja dan a piscinas semiprivadas de acceso directo. Las Junior Suites parten de unos 49 m² (527 pies²) y tienen jacuzzi en la terraza. El Griffin Club es una sección de 45 habitaciones dentro del resort con su propio lounge, su propia piscina, un tramo privado de playa, servicio de mayordomo, check-in personalizado y reservas prioritarias en los restaurantes y las cabañas de piscina.

**Comida.** Quince restaurantes y bares, más que cualquier otro resort de la provincia. Los que Marriott ha nombrado: Leal, un restaurante de inspiración guanacasteca con experiencias de tueste de café y un menú de degustación de siete tiempos; Casado, una parrilla costera a leña; Puerto Limón, con cocina afrocaribeña de la otra costa; y LaGloria, un puesto de root beer. Hay también cocinas italiana, mexicana y japonesa, y un JW Garden que cultiva hierbas, flores comestibles, frutas y verduras para los restaurantes y bares. Una vez por semana el resort organiza un mercado nocturno con artesanos, comida, música y baile de la zona.

**Piscinas.** Diecisiete, incluida una piscina infinita frente al mar, repartidas en unos 4,090 m². Marriott lo llama el complejo de piscinas de resort más grande de Costa Rica. Hay áreas separadas para familias y para el Griffin Club, una piscina para niños y un tobogán.

**Spa y bienestar.** El Spa by JW ocupa cerca de 1,500 m² con gimnasio y una de las piscinas de hidroterapia más grandes del país. Tiene además la primera Mindfulness House de la marca, con tratamientos que van de la hidroterapia y la sanación con sonido al Reiki y las ceremonias de cacao.

**Familias y actividades.** El Family by JW Club organiza caminatas de naturaleza, yoga para niños, talleres creativos, cuentacuentos y noches de cine. Fuera de la playa hay kayak, pesca, buceo, caminatas al atardecer y charters privados de yate, todo organizado desde el resort.

## Dónde queda realmente Playa El Jobo

Esta es la parte que la mayoría de las páginas de hoteles se salta. El resort está en Playa El Jobo, una playa amplia de arena dorada dentro de Bahía Salinas, la gran bahía del lado Pacífico de la frontera con Nicaragua. Pertenece a Costa Elena, un desarrollo privado de unas 1,200 hectáreas de bosque seco y costa, y el hotel es el único de su playa.

No hay pueblo. La Cruz, a 20 minutos cuesta arriba, es un centro municipal pequeño con supermercado, algunas sodas y el mejor mirador del norte de Guanacaste, en lo alto sobre la bahía. El paso fronterizo de Peñas Blancas queda unos 20 minutos más adelante. Playas del Coco, el pueblo de playa más cercano con restaurantes y bares, está a más o menos una hora. Quien elige el JW Marriott Costa Elena lo elige por eso: un todo incluido completo con la bahía entera para él.

La bahía tiene su propio clima. De diciembre a abril el viento de la tarde en Bahía Salinas es tan fuerte que las escuelas de kitesurf del país están aquí, en las playas justo al este del resort. Las mañanas son tranquilas. El Parque Nacional Santa Rosa, con sus senderos de bosque seco y la Casona histórica, queda a media hora de regreso por la carretera, y Rincón de la Vieja es un paseo de un día de una hora y media por trayecto.

## El viaje desde el Aeropuerto de Liberia

Tu chofer espera a la salida de llegadas con un rótulo con tu nombre. Monitoreamos el vuelo, así que un aterrizaje adelantado o atrasado no cambia nada, y te vas en cuanto tienes las maletas.

Desde el aeropuerto la van toma la Interamericana (Ruta 1) hacia el norte. Los primeros 40 minutos son planos y rápidos a través del bosque seco, pasando la entrada del Parque Nacional Santa Rosa. Luego la carretera sube a La Cruz, donde la vista se abre sobre toda Bahía Salinas; vale la pena pedirle al chofer una parada de dos minutos para fotos en el mirador. Desde ahí la carretera costera baja a la bahía y la recorre, asfaltada, hasta la entrada de Costa Elena y el portón del resort. De puerta a puerta son de 1 hora 20 minutos a 1 hora 40 minutos según el tráfico en los cruces de Liberia, y toda la ruta es asfaltada: sin 4x4, sin lastre y sin problema de noche.

Costa Elena es un desarrollo privado con un puesto de guarda en la entrada. Igual que con Península Papagayo y Hacienda Pinilla, enviamos los datos del chofer al resort cuando el hotel los pide, así que el vehículo ya es esperado cuando llegas.

Los precios actualizados y la reserva están en la [página de la ruta LIR a JW Marriott Costa Elena](/private-shuttle/lir-liberia-int-airport-to-jw-marriott-costa-elena-la-cruz). El regreso, [JW Marriott Costa Elena a LIR](/private-shuttle/jw-marriott-costa-elena-la-cruz-to-lir-liberia-int-airport), tiene la misma tarifa.

## Formas de llegar desde LIR

| Opción | Tiempo hasta el hotel | Costo | Conviene saber |
| --- | --- | --- | --- |
| Traslado privado | 1 h 20 – 1 h 40, directo | $160 fijo para 1–5 pasajeros | Vuelo monitoreado, sillas para niños incluidas, una parada para víveres |
| Servicio de carro del hotel | El mismo trayecto | Tarifa premium a través del concierge | Suele ser la opción más cara |
| Carro de alquiler | El mismo trayecto más trámites de entrega | $40–90 al día más seguro obligatorio y depósito | Solo compensa si sales del resort todos los días; hay poco a dónde manejar |
| Shuttle compartido | No hay servicio con horario fijo a La Cruz | — | Las vans compartidas van al Coco, Tamarindo y Flamingo, no a Bahía Salinas |
| Taxi del aeropuerto | El mismo trayecto | $130–170, negociado en el momento | Sin seguimiento de vuelo, solo efectivo, sin sillas para niños |

Para dos personas el traslado privado cuesta más o menos lo que un taxi, con el precio fijo antes de aterrizar. Para una familia de cinco sale a $32 por cabeza por un viaje de 75 km, y por eso casi todos los huéspedes del todo incluido lo reservan.

## Paseos de un día desde el resort

| Destino | Tiempo desde el JW Marriott Costa Elena | Por qué ir |
| --- | --- | --- |
| Playa Rajada y las playas de Bahía Salinas | 10–15 min | Calas tranquilas para snorkel por la mañana, viento para kitesurf por la tarde |
| Mirador y pueblo de La Cruz | 20 min | La panorámica de la bahía, supermercado y sodas locales |
| Parque Nacional Santa Rosa | 30 min | Senderos de bosque seco, la Casona y Playa Naranjo con Witch's Rock frente a la costa |
| Rincón de la Vieja | 1 h 30 | Aguas termales, pozas de lodo y caminatas al volcán; el paseo clásico de día completo |
| Playas del Coco y el golfo de Papagayo | 1 h | El pueblo de playa más cercano, más paseos en lancha por el golfo |

Todos se cotizan como viajes privados de ida y vuelta con el chofer esperando, que suele salir más barato que la tarifa del concierge por el mismo carro.

## Algunas cosas que te dirían nuestros choferes

- El resort es el único hotel de su playa y la tienda más cercana queda a 20 minutos, así que si quieres algo que no esté en el todo incluido, para en el supermercado de Liberia o de La Cruz de camino. La parada no cuesta nada.
- La sala de llegadas de LIR está más llena entre el mediodía y las 4 p. m., cuando aterrizan juntos los vuelos de Estados Unidos. Calcula hasta una hora de migración antes de encontrarte con el chofer; nosotros monitoreamos el vuelo y nos ajustamos.
- Para la salida, reserva la recogida 4,5 horas antes de un vuelo internacional: 1,5 horas de camino más las 3 horas que pide el aeropuerto en temporada alta.
- Lleva los pasaportes en el equipaje de mano. La frontera queda cerca y los retenes policiales de la Ruta 1 a veces piden identificación.
- Llegar de noche no es problema. La carretera y la vía costera son asfaltadas y el portón del resort tiene personal las 24 horas; el traslado no tiene recargo nocturno.

## Reserva

El [traslado privado del Aeropuerto de Liberia al JW Marriott Costa Elena](/private-shuttle/lir-liberia-int-airport-to-jw-marriott-costa-elena-la-cruz) se reserva en línea en un par de minutos a precio fijo por vehículo, con el vuelo monitoreado y las sillas para niños incluidas. Si primero quieres comparar el resort con el resto de la costa, nuestra guía de los [mejores hoteles de Guanacaste por zona](/blog/best-hotels-guanacaste-by-zone-liberia-airport-transfer) los cubre todos, y para cualquier otra cosa escríbenos por WhatsApp y te contesta uno de los choferes.
$es$
where slug = 'jw-marriott-costa-elena-opens-guanacaste';

-- ------------------------------------------------------------
-- Pillar article: Dreams Las Mareas -> JW Marriott Costa Elena
-- ------------------------------------------------------------
update public.blog_posts_ruta_pacifico set
  content_md = replace(replace(content_md,
    'Up near the Nicaraguan border is Dreams Las Mareas, about an hour and a quarter from the airport and really a trip of its own.',
    'Up near the Nicaraguan border is the JW Marriott Costa Elena, the former Dreams Las Mareas, reopened in September 2026 as the brand''s first all-inclusive ([our guide to the new resort](/blog/jw-marriott-costa-elena-opens-guanacaste)); it is about an hour and a half from the airport and really a trip of its own.'),
    'Dreams Las Mareas and any hotel not listed here can be quoted on WhatsApp in a few minutes.',
    'The JW Marriott Costa Elena ($160 from LIR, [route page](/private-shuttle/lir-liberia-int-airport-to-jw-marriott-costa-elena-la-cruz)) and any hotel not listed here can be quoted on WhatsApp in a few minutes.'),
  content_md_es = replace(replace(content_md_es,
    'Cerca de la frontera con Nicaragua está Dreams Las Mareas, a una hora y cuarto del aeropuerto y en realidad un viaje aparte.',
    'Cerca de la frontera con Nicaragua está el JW Marriott Costa Elena, el antiguo Dreams Las Mareas, reabierto en septiembre de 2026 como el primer todo incluido de la marca ([nuestra guía del nuevo resort](/blog/jw-marriott-costa-elena-opens-guanacaste)); queda a una hora y media del aeropuerto y en realidad es un viaje aparte.'),
    'Dreams Las Mareas y cualquier hotel que no aparezca aquí se cotiza por WhatsApp en pocos minutos.',
    'El JW Marriott Costa Elena ($160 desde LIR, [página de la ruta](/private-shuttle/lir-liberia-int-airport-to-jw-marriott-costa-elena-la-cruz)) y cualquier hotel que no aparezca aquí se cotiza por WhatsApp en pocos minutos.')
where slug = 'best-hotels-guanacaste-by-zone-liberia-airport-transfer';

-- Check:
-- select slug, category, published_at, length(content_md) as en, length(content_md_es) as es
-- from public.blog_posts_ruta_pacifico
-- where slug in ('jw-marriott-costa-elena-opens-guanacaste', 'best-hotels-guanacaste-by-zone-liberia-airport-transfer');
