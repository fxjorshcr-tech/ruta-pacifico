-- ============================================================
-- Spanish (es) twins of the blog posts shown under rutapacifico.com/es
--
-- PREREQUISITE: run supabase/i18n_es_schema.sql FIRST. It adds the
-- title_es, excerpt_es, content_md_es, faqs_es and cover_image_alt_es
-- columns to public.blog_posts_ruta_pacifico that this file fills.
--
-- Source of truth (English copy):
--   supabase/blog_seed_01.sql  (3 posts)
--   supabase/blog_seed_02.sql  (7 posts)
-- Generated: 2026-09-17
--
-- Every statement is an UPDATE keyed by slug, so the file is idempotent:
-- safe to re-run as many times as you like. It only overwrites the *_es
-- columns; the English columns, category, tags, images and dates are
-- untouched. A slug that does not exist yet is simply skipped.
--
-- Style: Costa Rican Spanish, "tú" form. Proper names, prices, distances,
-- durations and URLs are unchanged. Internal links keep their English
-- path (the site prefixes /es at render time). Markdown structure mirrors
-- the English article exactly.
-- ============================================================


-- ------------------------------------------------------------
-- 1/10 · liberia-airport-to-tamarindo  (blog_seed_01.sql)
-- ------------------------------------------------------------
update public.blog_posts_ruta_pacifico set
  title_es = $es$Cómo llegar del Aeropuerto de Liberia (LIR) a Tamarindo: las 5 opciones comparadas con precios y tiempos$es$,
  excerpt_es = $es$Shuttle privado, alquiler de carro, shuttle compartido, taxi o bus: precios reales, tiempos de viaje reales y consejos honestos para el trayecto de 50 minutos del aeropuerto de Liberia a Tamarindo.$es$,
  content_md_es = $es$
Tamarindo está a unos **65 km (40 millas)** del Aeropuerto Internacional de Liberia (LIR), y el viaje toma **50–70 minutos** por carretera completamente asfaltada. Tienes cinco maneras realistas de hacer el trayecto: shuttle privado, carro de alquiler, shuttle compartido, taxi oficial del aeropuerto o bus público. Aquí te contamos cómo se comparan en la práctica, con los pros y contras honestos que la mayoría de los sitios de viajes se saltan.

## La comparación rápida

| Opción | Tiempo de viaje | Costo típico | Ideal para |
| --- | --- | --- | --- |
| **Shuttle privado** | ~50 min, directo | Precio fijo por vehículo (1–6 pax) | Familias, grupos, quienes vienen por primera vez |
| **Carro de alquiler** | ~55 min + trámites de entrega | $40–90/día + seguro obligatorio | Exploradores independientes |
| **Shuttle compartido** | 1.5–2.5 h (varias paradas) | ~$25–35 por persona | Viajeros solos con presupuesto ajustado |
| **Taxi del aeropuerto** | ~50 min | ~$90–120, a menudo negociable | Sin reserva, al llegar |
| **Bus público** | 3–4 h (vía Liberia centro, con transbordo) | ~$4–6 | Mochileros con tiempo |

## Opción 1: Shuttle privado (la opción puerta a puerta)

Un shuttle privado significa un chofer esperándote a la salida de llegadas con un rótulo con tu nombre, una buseta con aire acondicionado solo para tu grupo y un **precio fijo por vehículo** —no por persona— con impuestos, peajes, WiFi, agua fría y sillas para niños incluidos.

Las dos grandes ventajas frente a cualquier otra opción:

- **Seguimiento de vuelo.** Si tu vuelo aterriza antes o dos horas tarde, el chofer se ajusta automáticamente. Nadie está pendiente del reloj más que tú.
- **Cero navegación el día de llegada.** Después de un día largo de viaje con niños y maletas, no tener que pensar es un lujo que vale la pena pagar.

Para una familia de cuatro o más, un shuttle privado suele costar **menos por persona que un shuttle compartido**, y toma menos de la mitad del tiempo. Consulta los precios actualizados de la [ruta LIR → Tamarindo](/private-shuttle/lir-to-tamarindo-guanacaste).

## Opción 2: Carro de alquiler

El camino es fácil: Ruta 21 hacia el sur hasta Belén, luego hacia el oeste por Huacas hasta Tamarindo, asfaltado todo el trayecto. Un SUV compacto cuesta **$40–90 por día** en temporada alta, pero presupuesta la parte que los cotizadores en línea esconden: el **seguro obligatorio de responsabilidad civil** de Costa Rica (a menudo $15–25/día, no incluido en las cotizaciones en línea) y una retención de depósito de más de $1,000 en tu tarjeta de crédito.

Un carro tiene sentido si planeas cambiar de playa cada uno o dos días. Si tu base va a ser Tamarindo, toma en cuenta: el pueblo se recorre de punta a punta en 15 minutos a pie, el parqueo es escaso y, de todos modos, la mayoría de los tours incluyen recogida en el hotel.

## Opción 3: Shuttle compartido

Los shuttles compartidos cuestan aproximadamente **$25–35 por persona** y salen en horarios fijos con varias paradas en hoteles. El detalle es el tiempo: lo que en privado es un viaje de 50 minutos se convierte en **1.5–2.5 horas** mientras la buseta da la vuelta por Playas del Coco o Flamingo dejando a otros pasajeros. Si tu vuelo se retrasa más allá de la ventana de salida, es posible que te reprogramen en una salida posterior. Está bien para viajeros solos con flexibilidad; frustrante con niños.

## Opción 4: Taxi oficial del aeropuerto

Los taxis anaranjados del aeropuerto hacen fila justo afuera de llegadas, sin necesidad de reserva. Calcula **$90–120 hasta Tamarindo**, según tu negociación y la hora. El taxímetro casi no se usa en esta ruta; acuerda la tarifa antes de subirte. Es una opción razonable si aterrizas sin plan, aunque por el mismo dinero un shuttle privado reservado con anticipación te da seguimiento de vuelo, un vehículo más nuevo y un precio confirmado por escrito.

## Opción 5: Bus público

La ruta más barata: bus local o taxi del aeropuerto al centro de Liberia (~15 min), y luego un bus de La Pampa/Tralapa hacia Tamarindo. Costo total de menos de **$6**, tiempo total de **3–4 horas** con transbordo y sin garantías para el equipaje. Solo vale la pena si el presupuesto es realmente ajustado y el horario realmente abierto.

## Nuestra recomendación honesta

- **¿Viajas en familia o en grupo de 3 o más?** Shuttle privado: más rápido que el compartido, más barato por persona, y las sillas para niños son gratis.
- **¿Solo y con presupuesto ajustado?** Shuttle compartido.
- **¿Planeas cambiar de pueblo todos los días?** Carro de alquiler, pero lee la letra pequeña del seguro antes de comprometerte.

Como sea que vayas: la carretera es segura, asfaltada y hermosa, y en menos de una hora cambiarás el aire acondicionado del aeropuerto por el atardecer de Tamarindo. Pura vida.
$es$,
  faqs_es = $es$[
    {"q": "¿A qué distancia está Tamarindo del aeropuerto de Liberia?", "a": "Tamarindo está a unos 65 km (40 millas) del Aeropuerto Internacional de Liberia (LIR). El viaje toma entre 50 minutos y 1 hora 10 minutos por carretera asfaltada, según el tráfico que haya en Belén y Huacas."},
    {"q": "¿Hay Uber en el aeropuerto de Liberia?", "a": "Uber opera en una zona gris legal en Costa Rica y las recogidas en el aeropuerto de Liberia son poco confiables: hay muy pocos choferes en Guanacaste y muchos cancelan las solicitudes del aeropuerto. La mayoría de los viajeros reserva un shuttle privado con anticipación o toma un taxi anaranjado oficial del aeropuerto."},
    {"q": "¿Cuánto cuesta un shuttle privado de LIR a Tamarindo?", "a": "Un shuttle privado para hasta 6 pasajeros tiene un precio fijo por vehículo (no por persona), con impuestos, peajes, seguimiento de vuelo y sillas para niños incluidos. Consulta los precios actualizados en rutapacifico.com/private-shuttle: el precio que ves es el precio que pagas."},
    {"q": "¿Necesito alquilar carro si me hospedo en Tamarindo?", "a": "Por lo general, no. El pueblo de Tamarindo se recorre completo a pie, los tours incluyen recogida en el hotel y las excursiones de un día se pueden hacer en shuttle privado. Alquilar carro solo vale la pena si piensas cambiar de lugar todos los días o explorar playas remotas a tu propio ritmo."},
    {"q": "¿Qué pasa si mi vuelo a LIR se retrasa?", "a": "Con un shuttle privado de Ruta Pacifico, tu vuelo se monitorea en tiempo real y el chofer se ajusta a la hora real de aterrizaje sin costo adicional. Con taxis y shuttles compartidos, un retraso largo puede significar perder tu asiento o esperar la siguiente salida."}
  ]$es$::jsonb,
  cover_image_alt_es = $es$Lanchas ancladas en la bahía de Tamarindo al atardecer, Guanacaste, Costa Rica$es$
where slug = 'liberia-airport-to-tamarindo';


-- ------------------------------------------------------------
-- 2/10 · guanacaste-driving-times-from-liberia-airport  (blog_seed_01.sql)
-- ------------------------------------------------------------
update public.blog_posts_ruta_pacifico set
  title_es = $es$Tiempos de viaje en Guanacaste: distancias reales del Aeropuerto de Liberia a cada pueblo de playa$es$,
  excerpt_es = $es$Los tiempos de viaje reales del aeropuerto de Liberia (LIR) a Tamarindo, Nosara, Flamingo, Papagayo, Coco, Sámara y más allá, incluyendo qué caminos están asfaltados, según choferes que hacen estas rutas a diario.$es$,
  content_md_es = $es$
Todo viaje por Guanacaste empieza con la misma pregunta: *¿qué tan lejos queda, en realidad?* Aquí tienes los tiempos de viaje reales desde el **Aeropuerto Internacional de Liberia (LIR)** a cada destino importante: no el optimismo de Google Maps, sino lo que nuestros choferes ven día tras día, incluyendo qué caminos están asfaltados y dónde se pone feo el último tramo.

## La tabla maestra

| Destino | Tiempo desde LIR | Distancia | Estado del camino |
| --- | --- | --- | --- |
| Playas del Coco | ~25 min | 22 km | Asfaltado |
| Playa Hermosa (Guanacaste) | ~30 min | 26 km | Asfaltado |
| Península de Papagayo | ~30 min | 30 km | Asfaltado |
| Playa Ocotal | ~30 min | 25 km | Asfaltado |
| Tamarindo | ~50 min | 65 km | Asfaltado |
| Playa Grande | ~1 h | 70 km | Asfaltado, tramo corto de lastre al final |
| Flamingo / Brasilito / Conchal | ~1 h | 65 km | Asfaltado |
| Las Catalinas / Potrero | ~1 h | 70 km | Asfaltado |
| Playa Avellanas | ~1 h 10 min | 75 km | Últimos 6 km sin asfaltar |
| Playa Negra / Junquillal | ~1 h 20 min | 80 km | Parcialmente sin asfaltar |
| P. N. Rincón de la Vieja | ~1.5 h | 60 km | Último tramo de lastre |
| Nosara / Playa Guiones | ~2 h | 120 km | Últimos 25–30 km sin asfaltar |
| Sámara / Playa Carrillo | ~2 h | 110 km | Asfaltado |
| Río Celeste | ~2.5 h | 115 km | Mayormente asfaltado |
| Monteverde | ~3 h | 145 km | Subida final de montaña sin asfaltar |
| La Fortuna / Arenal | ~3.5 h | 200 km | Asfaltado |
| San José | ~4 h | 215 km | Asfaltado (Ruta 1) |
| Manuel Antonio | ~5 h | 300 km | Asfaltado |

*Los tiempos asumen tráfico diurno normal. Súmale 15–25% en las tardes de temporada lluviosa, con el tráfico playero del fin de semana por Belén, o en cualquier ruta con camino de tierra.*

## Las tres zonas de Guanacaste

**El círculo de 30 minutos: Coco, Hermosa, Ocotal, Papagayo.** Lo más cercano al aeropuerto y hogar de los grandes resorts (Four Seasons, Andaz, Secrets). Si aterrizas por la tarde, puedes estar en la piscina antes del atardecer. Perfecto para la primera y la última noche.

**La costa a una hora: Tamarindo, Flamingo, Conchal, Las Catalinas, Potrero, Grande.** El corazón de la vida de playa de la Costa Dorada (Gold Coast): pueblos surferos, playas de arena blanca, la mejor oferta de restaurantes. Todo accesible por buenas carreteras asfaltadas en cerca de una hora.

**Las aventuras de dos horas o más: Nosara, Sámara y los volcanes.** Valen cada minuto, pero planifícalas como medios días de viaje. Los últimos 25–30 km de camino de lastre corrugado hacia Nosara son el «atajo que no lo es» más famoso de Costa Rica: los locales saben en qué tramos hay que ir despacio, y justo ahí es donde tener chofer le gana a ir aferrado al volante de un carro alquilado.

## Alquilar carro o que te lleven: lo que deciden los caminos

Para la costa asfaltada a una hora, cualquier carro sirve. Para **Nosara, Monteverde, Avellanas o viajes en temporada lluviosa**, se recomienda mucho un SUV si vas a manejar por tu cuenta: las agencias de alquiler pueden anular la cobertura por cruces de ríos, y los caminos corrugados son donde ocurre la mayoría de los daños a carros alquilados.

Un [shuttle privado](/private-shuttle) elimina la pregunta por completo: precio fijo, un chofer que conoce cada hueco personalmente, WiFi para planear tu semana en el camino y una hielera con agua fría. En las recogidas en LIR, tu vuelo se monitorea en tiempo real, así que un retraso nunca te cuesta el traslado.

## Un consejo de local

Si tu itinerario incluye dos bases (digamos, primero Papagayo y luego Nosara), no vuelvas al aeropuerto para cambiar de transporte: un traslado directo entre playas te ahorra una hora o más. Los pueblos de playa de Guanacaste se conectan directamente, y el [buscador de rutas](/private-shuttle) cotiza cualquier combinación al instante.
$es$,
  faqs_es = $es$[
    {"q": "¿Cuál pueblo de playa de Guanacaste está más cerca del aeropuerto de Liberia?", "a": "Playas del Coco es el pueblo de playa importante más cercano, a unos 25 minutos de LIR, seguido de Playa Hermosa y la Península de Papagayo a unos 30 minutos. Por eso el corredor Coco–Hermosa–Papagayo es tan popular para la primera o la última noche del viaje."},
    {"q": "¿El camino a Nosara está asfaltado?", "a": "No todo. La carretera principal está asfaltada hasta pasando Nicoya, pero el último tramo hacia Nosara es camino de lastre corrugado. Se puede transitar todo el año en buseta o SUV, pero es polvoriento en temporada seca y lodoso en la lluviosa, una de las razones por las que muchos viajeros prefieren que los lleven."},
    {"q": "¿Cuánto dura el viaje del aeropuerto de Liberia a La Fortuna o Monteverde?", "a": "Alrededor de 3.5 horas a La Fortuna/Arenal y unas 3 horas a Monteverde. La ruta a Monteverde termina en una famosa subida de montaña sin asfaltar y llena de curvas. Ambas son muy factibles como traslados privados, con una parada para comer o tomar fotos en el camino."},
    {"q": "¿Google Maps da tiempos exactos en Guanacaste?", "a": "En las carreteras principales asfaltadas, en su mayoría sí, pero tiende a ser optimista en los tramos de lastre (Nosara, Monteverde) y no toma en cuenta el tráfico lento por pueblos como Belén los fines de semana. Súmale un margen de 15–25% a cualquier estimación que incluya camino de tierra."},
    {"q": "¿Puedo parar en un supermercado camino a mi hotel?", "a": "Sí. Con un shuttle privado, una parada rápida en el supermercado o la farmacia en el camino es práctica habitual, sobre todo para huéspedes que van a villas en Flamingo, Potrero o Nosara. Solo menciónaselo a tu chofer."}
  ]$es$::jsonb,
  cover_image_alt_es = $es$Vista aérea de la costa de Guanacaste y sus ensenadas, Costa Rica$es$
where slug = 'guanacaste-driving-times-from-liberia-airport';


-- ------------------------------------------------------------
-- 3/10 · uber-in-guanacaste-costa-rica  (blog_seed_01.sql)
-- ------------------------------------------------------------
update public.blog_posts_ruta_pacifico set
  title_es = $es$¿Hay Uber en Guanacaste, Costa Rica? Lo que todo viajero debe saber$es$,
  excerpt_es = $es$Uber técnicamente existe en Costa Rica, pero en Guanacaste apenas funciona. Aquí está el panorama real del transporte en Tamarindo, Coco, Flamingo y el aeropuerto de Liberia, contado por locales.$es$,
  content_md_es = $es$
Respuesta corta: **Uber existe en Costa Rica, pero no deberías contar con él en Guanacaste.** La app que funciona sin problemas en San José es, en la Costa Dorada (Gold Coast), casi siempre una ruedita dando vueltas. Aquí va el panorama real, para que planees tu viaje según cómo funciona el transporte aquí de verdad.

## Por qué Uber apenas funciona en Guanacaste

Uber llegó a Costa Rica en 2015 y sigue siendo popular en el **área metropolitana de San José**, donde hay miles de choferes en línea a cualquier hora. Pero Guanacaste es otro mundo:

- **Muy pocos choferes.** Los pueblos de playa son pequeños y están dispersos; no hay una masa crítica de choferes de Uber esperando solicitudes. Abre la app en Flamingo o Playa Grande y normalmente verás... nada.
- **Las recogidas en el aeropuerto son el punto débil.** Incluso cuando aparece un chofer en la app en LIR, las cancelaciones son comunes: el chofer puede estar a 40 minutos, y la normativa sobre recogidas en el aeropuerto hace que muchos no quieran entrar.
- **Las distancias son largas.** Un «viaje rápido» entre pueblos de playa implica para el chofer un recorrido de ida y vuelta de 40–70 km, así que las solicitudes para viajes entre pueblos fallan aunque haya choferes conectados.

Está también la nota legal: Uber lleva una década operando en una **zona gris regulatoria** en Costa Rica. En la práctica eso afecta menos a los viajeros que la disponibilidad, pero significa que no hay zonas oficiales de recogida en el aeropuerto ni a quién reclamar si un viaje se cae.

## Lo que usan de verdad los locales y los viajeros astutos

| Tipo de viaje | Lo que sí funciona |
| --- | --- |
| Aeropuerto → hotel | Shuttle privado reservado con anticipación o taxi anaranjado oficial del aeropuerto |
| Entre pueblos de playa | Shuttle privado reservado con un día de anticipación |
| Trayectos cortos en el pueblo | Taxis rojos oficiales, choferes del hotel, caminar |
| Tours y excursiones de un día | Operadores de tours (recogida en el hotel incluida) |
| Salidas nocturnas | El restaurante o bar puede llamar a un taxi local de confianza |

### Traslados al aeropuerto

Este es el viaje donde improvisar sale más caro. Aterriza en LIR a las 2 de la tarde en temporada alta sin un plan, y terminas negociando tarifas de taxi bajo el calor con niños con jet lag. Un [shuttle privado reservado con anticipación](/private-shuttle) le da la vuelta a eso: tu chofer monitorea el vuelo, te espera a la salida de llegadas con un rótulo con tu nombre, y el precio quedó fijo cuando reservaste: sin tarifa dinámica, sin regateo, sin sorpresas.

### Entre pueblos

Para moverse de hotel a hotel (Tamarindo → Nosara, Coco → Flamingo, Papagayo → Monteverde), los shuttles reservados con anticipación son lo habitual. Reserva a más tardar la noche anterior; obtendrás un precio fijo por vehículo que le gana a lo que costaría un viaje a demanda, incluso si existiera.

### Dentro del pueblo

Aquí viene la buena noticia: **casi no necesitas transporte dentro de la mayoría de los pueblos de playa de Guanacaste.** Tamarindo, Coco y Sámara se recorren a pie de punta a punta. Para una noche lluviosa o un restaurante lejano, los taxis rojos oficiales (busca el triángulo amarillo en la puerta) son baratos y están por todas partes; tu hotel o cualquier restaurante te llama a uno de confianza.

## En resumen

No armes tu plan de Guanacaste alrededor de una app que funciona en tu casa. Ármalo como funciona aquí:

1. **Reserva tu traslado al aeropuerto con anticipación**: es el viaje más largo y más caro de las vacaciones para improvisarlo.
2. **Reserva los viajes entre pueblos** con un día de anticipación.
3. **Camina y toma taxis rojos** para todo lo local.

Haz eso y nunca vas a extrañar Uber. Consulta precios fijos para cualquier ruta en Costa Rica en [rutapacifico.com/private-shuttle](/private-shuttle), o simplemente escríbenos por WhatsApp; te contesta una persona de verdad.
$es$,
  faqs_es = $es$[
    {"q": "¿Funciona Uber en el aeropuerto de Liberia (LIR)?", "a": "Rara vez. Hay muy pocos choferes de Uber en Guanacaste y las recogidas en el aeropuerto son poco confiables: las solicitudes muchas veces no encuentran chofer o se cancelan. Los taxis anaranjados oficiales del aeropuerto y los shuttles privados reservados con anticipación son las opciones confiables en LIR."},
    {"q": "¿Es legal Uber en Costa Rica?", "a": "Uber opera en una zona gris legal: la app funciona y en San José se hacen miles de viajes al día, pero el servicio nunca ha sido regulado formalmente. En la práctica, el mayor problema en Guanacaste no es la legalidad sino la disponibilidad: simplemente hay muy pocos choferes fuera de la capital."},
    {"q": "¿Hay Uber en Tamarindo?", "a": "De vez en cuando aparecen uno o dos choferes en temporada alta, pero no puedes contar con eso, sobre todo para salidas al aeropuerto de madrugada. Los taxis locales y los shuttles reservados con anticipación son la forma en que la gente realmente se mueve."},
    {"q": "¿Cómo voy de mi hotel en Guanacaste a un restaurante por la noche?", "a": "Los trayectos cortos dentro de un pueblo son fáciles: taxis rojos oficiales, choferes que consigue el hotel o caminar (Tamarindo y Coco se recorren muy bien a pie). Es en los viajes ENTRE pueblos y en los traslados al aeropuerto donde necesitas reservar con anticipación."},
    {"q": "¿Cuál es la forma más segura de moverse por Guanacaste sin carro?", "a": "Shuttles privados reservados con anticipación para traslados al aeropuerto y viajes entre pueblos, taxis oficiales para trayectos locales cortos y operadores de tours (que incluyen recogida en el hotel) para las excursiones. Esa combinación cubre unas vacaciones completas sin manejar ni un kilómetro."}
  ]$es$::jsonb,
  cover_image_alt_es = $es$Una iguana cruzando un camino de lastre en Guanacaste, Costa Rica$es$
where slug = 'uber-in-guanacaste-costa-rica';


-- ------------------------------------------------------------
-- 4/10 · liberia-vs-san-jose-airport  (blog_seed_02.sql)
-- ------------------------------------------------------------
update public.blog_posts_ruta_pacifico set
  title_es = $es$Aeropuerto de Liberia (LIR) o San José (SJO): ¿a cuál te conviene volar en Costa Rica?$es$,
  excerpt_es = $es$Volar al aeropuerto equivocado puede costarte 4 horas de carretera el primer día. Aquí te explicamos exactamente cuándo elegir Liberia y cuándo tiene sentido San José, con tiempos de viaje reales desde cada uno.$es$,
  content_md_es = $es$
El error más caro que puedes cometer al planear un viaje a Costa Rica no es el hotel: es **volar al aeropuerto equivocado**. Costa Rica tiene dos puertas de entrada internacionales principales, y elegir entre ellas se reduce a una sola pregunta: *¿dónde vas a dormir la mayoría de las noches?*

**Respuesta corta: ¿te hospedas en Guanacaste (Tamarindo, Papagayo, Flamingo, Nosara, Coco)? Vuela a Liberia (LIR). ¿Vas a San José, Manuel Antonio, la costa caribeña o el Poás? Vuela a San José (SJO).**

## Tiempos de viaje comparados

| Destino | Desde Liberia (LIR) | Desde San José (SJO) |
| --- | --- | --- |
| Playas del Coco | ~25 min | ~4.5 h |
| Península de Papagayo | ~30 min | ~4.5 h |
| Tamarindo | ~50 min | ~4.5–5 h |
| Flamingo / Conchal | ~1 h | ~4.5–5 h |
| Nosara | ~2 h | ~5 h |
| Sámara | ~2 h | ~4.5 h |
| Monteverde | ~3 h | ~3 h |
| La Fortuna / Arenal | ~3.5 h | ~3 h |
| San José (ciudad) | ~4 h | ~20 min |
| Manuel Antonio | ~5 h | ~3 h |

Dos cosas saltan a la vista. Primero, para **cualquier playa de Guanacaste**, LIR gana por más de 3.5 horas en cada sentido: eso es un día completo de vacaciones ahorrado entre ida y vuelta. Segundo, **Monteverde y La Fortuna quedan prácticamente empatados**, así que para un viaje de volcán más playa la jugada inteligente suele ser el *open-jaw* (llegar por un aeropuerto y salir por otro): aterrizar en SJO, hacer las montañas y terminar en la playa para volar a casa desde LIR.

## Por qué la gente igual se tienta con SJO

Los vuelos a SJO suelen ser **$50–150 más baratos** porque es el hub más grande. Pero haz la cuenta completa para un viaje a Guanacaste:

- **5 horas extra de traslado terrestre** el día de llegada (y otra vez el día de salida)
- Un **traslado de larga distancia cuesta más** que el salto corto desde LIR
- Llegar al hotel agotado a las 9 de la noche en lugar de a las 3 de la tarde

A menos que la diferencia de tarifa sea enorme, el boleto «barato» a SJO normalmente cuesta más en dinero *y* se lleva de paso dos medios días de vacaciones.

## Los argumentos a favor de LIR (más allá de la distancia)

El Aeropuerto Internacional Daniel Oduber Quirós de Liberia es pequeño en el mejor sentido: la mayoría de los días puedes ir **de la puerta del avión al shuttle en 20–30 minutos**. Llegan vuelos directos desde Houston, Dallas, Atlanta, Miami, Nueva York, Toronto y más; revisa tu ciudad, el mapa de rutas crece cada temporada.

Y como los [tiempos de viaje desde LIR](/blog/guanacaste-driving-times-from-liberia-airport) a los principales pueblos de playa van de 25 minutos a 2 horas, es perfectamente realista aterrizar a mediodía y ver el atardecer desde la playa de tu hotel.

## Nuestra recomendación según el tipo de viaje

- **Semana de playa solo en Guanacaste** → LIR ida y vuelta. Sin discusión.
- **Volcán (Arenal/Monteverde) + playa en Guanacaste** → llegar a SJO, salir por LIR (o al revés).
- **Manuel Antonio + Guanacaste** → open-jaw de nuevo: llegar a SJO, salir por LIR.
- **Solo San José ciudad o el lado del Caribe** → SJO ida y vuelta.

Aterrices en el aeropuerto que aterrices, un [shuttle privado](/private-shuttle) con seguimiento de vuelo le quita el estrés al día de llegada: precio fijo, rótulo con tu nombre a la salida, y directo a la playa.
$es$,
  faqs_es = $es$[
    {"q": "¿Qué aeropuerto está más cerca de Tamarindo, LIR o SJO?", "a": "Liberia (LIR), por mucho. Tamarindo está a cerca de 1 hora de LIR frente a 4.5 a 5 horas desde San José (SJO). Para cualquier pueblo de playa de Guanacaste, LIR es el aeropuerto correcto."},
    {"q": "¿Por qué los vuelos a Liberia a veces son más caros?", "a": "SJO es un hub más grande, con más aerolíneas y rutas diarias, así que las tarifas suelen ser más bajas. Pero toma en cuenta el traslado terrestre: ahorrarte $80 en un vuelo a SJO y luego manejar 5 horas hasta Guanacaste normalmente sale más caro en traslados, tiempo y energía."},
    {"q": "¿Puedo llegar por un aeropuerto y salir por el otro?", "a": "Sí, los boletos open-jaw (multidestino) son comunes y muchas veces ideales: por ejemplo, llegar a SJO para La Fortuna y Monteverde, y salir por LIR después de una semana de playa en Guanacaste. Los shuttles privados pueden hacer rutas solo de ida entre dos puntos cualesquiera."},
    {"q": "¿El aeropuerto de Liberia es pequeño?", "a": "LIR es compacto pero moderno e internacional, con vuelos directos desde muchas ciudades de Estados Unidos y Canadá, además de rutas europeas de temporada. Que sea pequeño es en realidad la ventaja: migración y aduanas suelen tomar minutos, y tu chofer está a pasos de la salida."},
    {"q": "¿Con cuánta anticipación debo reservar mi traslado desde el aeropuerto?", "a": "Idealmente en cuanto tengas los vuelos, y al menos con 24 a 48 horas de anticipación en temporada alta (diciembre a abril). Reservar temprano garantiza disponibilidad de vehículo para el tamaño de tu grupo y tu hora de llegada."}
  ]$es$::jsonb,
  cover_image_alt_es = $es$Vista aérea cenital de una playa de Guanacaste con agua turquesa, Costa Rica$es$
where slug = 'liberia-vs-san-jose-airport';


-- ------------------------------------------------------------
-- 5/10 · best-time-to-visit-guanacaste  (blog_seed_02.sql)
-- ------------------------------------------------------------
update public.blog_posts_ruta_pacifico set
  title_es = $es$Mejor época para visitar Guanacaste: guía del clima mes a mes$es$,
  excerpt_es = $es$Temporada seca vs. temporada verde en Guanacaste, Costa Rica: cómo se siente realmente cada mes (lluvia, calor, cantidad de gente, precios, surf y anidación de tortugas), contado por gente que vive aquí.$es$,
  content_md_es = $es$
**La versión corta: Guanacaste es un destino para todo el año. De diciembre a abril el sol está garantizado; de mayo a noviembre se cambia un aguacero diario por la tarde a cambio de paisajes verdes, precios más bajos y menos gente.** Es la región más seca de Costa Rica, y por eso la Costa Dorada (Gold Coast) rara vez tiene un mes realmente «malo».

## Las dos temporadas, sin adornos

**Temporada seca (diciembre–abril).** Clima de cero sombrilla: cielos despejados, tardes de 30–35 °C, colinas doradas. Es la temporada alta: reserva hoteles y [traslados desde el aeropuerto](/private-shuttle) con bastante anticipación, sobre todo en Navidad, Año Nuevo y Semana Santa.

**Temporada verde (mayo–noviembre).** El paisaje cambia a verde selva. El día típico: mañana soleada, nubes que se acumulan después del almuerzo, un aguacero de 1–2 horas entre las 3 y las 5 de la tarde, y cielo despejado para el atardecer. Los precios bajan 20–40%, las playas se vacían y todo huele a vida. Septiembre y octubre son los meses más lluviosos; también son cuando los locales hacen sus propios viajes a la playa.

## Mes a mes

| Mes | Lluvia | Calor | Gente y precios | El dato de local |
| --- | --- | --- | --- | --- |
| Diciembre | Casi nada | Calor, con brisa | Alta → pico en Navidad | Empiezan los vientos papagayo; el paisaje sigue verde por las lluvias |
| Enero | Nada | Calor, con brisa | Pico | Clima de postal; reserva todo con anticipación |
| Febrero | Nada | Calor | Alta | El mes más seco; tortugas baula en Playa Grande |
| Marzo | Nada | El más caliente | Alta (Spring Break) | Las colinas se ponen doradas; el calor pega más a media tarde |
| Abril | Primeros aguaceros ocasionales | El más caliente | Pico en Semana Santa, luego baja | Semana Santa es la semana más concurrida del año entre los ticos |
| Mayo | Empiezan los aguaceros de la tarde | Calor, húmedo | Baja | El verde vuelve de un día para otro; muy buenas ofertas |
| Junio | Lluvia moderada por la tarde | Cálido | Baja–media | Exuberante y tranquilo; los viajeros del verano estadounidense llegan a finales de junio |
| Julio | Breve pausa seca a mitad de temporada | Cálido | Media (veranillo) | El veranillo: semanas soleadas con paisaje verde |
| Agosto | Moderada | Cálido | Media, luego baja | Arrancan las arribadas de Ostional; el surf a todo dar |
| Septiembre | La más fuerte | Cálido | La más baja | Los mayores descuentos de hotel; planea las mañanas y usa la lluvia de siesta |
| Octubre | La más fuerte | Cálido | La más baja | Algunos negocios cierran por vacaciones; las cataratas a toda potencia |
| Noviembre | Baja rápido | Cálido | Baja → subiendo | El punto dulce: colinas verdes, días secos, precios de pretemporada |

## El mejor mes según el tipo de viajero

- **Sol de playa garantizado:** enero–marzo.
- **Mejor relación calidad-precio sin lluvia diaria:** noviembre o principios de diciembre: paisajes verdes, clima de temporada seca, precios de temporada intermedia.
- **Surfistas:** mayo–noviembre por el tamaño; diciembre–abril por olas limpias para principiantes.
- **Amantes de las tortugas:** agosto–diciembre para las arribadas de Ostional (miles de tortugas lora en unas pocas noches); octubre–marzo para las baulas en Playa Grande.
- **Recién casados con presupuesto ajustado:** septiembre. Sí, llueve, pero vas a tener playas enteras y los mejores restaurantes casi para ustedes solos.

## Un consejo de planificación que las tablas del clima no muestran

La lluvia cambia más los *caminos* que los *planes*. Las rutas asfaltadas (Tamarindo, Flamingo, Coco, Papagayo) no se ven afectadas en todo el año, pero los tramos de tierra hacia [Nosara o Monteverde](/blog/guanacaste-driving-times-from-liberia-airport) se ponen lentos y lodosos en septiembre y octubre. Si viajas en plena temporada verde, ese es el argumento más fuerte para dejar que un chofer local se encargue de la última hora de camino: nuestras busetas recorren esos caminos todos los días del año.
$es$,
  faqs_es = $es$[
    {"q": "¿Cuál es la época más seca del año en Guanacaste?", "a": "De diciembre a abril es la temporada seca: casi cero lluvia, días calurosos y soleados y los meses de mayor turismo. Guanacaste es la región más seca de Costa Rica, así que incluso la temporada lluviosa aquí es más suave que en el resto del país."},
    {"q": "¿Vale la pena visitar Guanacaste en la temporada lluviosa?", "a": "Totalmente. De mayo a noviembre (los locales la llaman temporada verde) los paisajes se ponen verdes, los precios bajan, hay menos gente y la lluvia suele caer como un aguacero por la tarde, dejando las mañanas soleadas. Septiembre y octubre son los meses más lluviosos en el Pacífico."},
    {"q": "¿Cuándo puedo ver tortugas anidando en Guanacaste?", "a": "Las tortugas lora anidan en Ostional (cerca de Nosara) la mayor parte del año, con arribadas masivas que alcanzan su punto máximo de agosto a diciembre, normalmente alrededor del cuarto menguante. Las tortugas baula anidan en Playa Grande aproximadamente de octubre a marzo."},
    {"q": "¿Cuándo hay mejor surf en Tamarindo?", "a": "Hay olas todo el año. Las marejadas más grandes y constantes llegan de mayo a noviembre; de diciembre a abril las olas son más pequeñas y limpias, ideales para principiantes. Las mañanas suelen ser glassy (planas y sin viento) todo el año."},
    {"q": "¿Qué tanto calor hace en Guanacaste?", "a": "Espera 30–35 °C (86–95 °F) la mayoría de las tardes durante todo el año, con marzo y abril como los meses más calientes y secos. Los vientos alisios de diciembre a febrero (los vientos papagayo) hacen que las noches sean agradablemente frescas."}
  ]$es$::jsonb,
  cover_image_alt_es = $es$Atardecer dorado sobre una playa de Guanacaste, Costa Rica$es$
where slug = 'best-time-to-visit-guanacaste';


-- ------------------------------------------------------------
-- 6/10 · tamarindo-vs-nosara-vs-flamingo  (blog_seed_02.sql)
-- ------------------------------------------------------------
update public.blog_posts_ruta_pacifico set
  title_es = $es$Tamarindo, Nosara o Playa Flamingo: ¿cuál es el mejor pueblo de playa de Guanacaste para ti?$es$,
  excerpt_es = $es$¿Energía de pueblo surfero, selva wellness o lujo pulido de arena blanca? Una comparación honesta y local de los tres pueblos de playa más queridos de Guanacaste, y cómo elegir.$es$,
  content_md_es = $es$
Tres pueblos, tres vacaciones completamente distintas, y todos a menos de dos horas del mismo aeropuerto. Aquí va el desglose honesto que los locales le dan a los amigos que preguntan *«¿dónde nos quedamos?»*

## La comparación en 60 segundos

| | **Tamarindo** | **Nosara** | **Playa Flamingo** |
| --- | --- | --- | --- |
| Personalidad | Pueblo surfero animado | Selva wellness a pie descalzo | Pulido y tranquilo |
| Desde LIR | ~50 min, asfaltado | ~2 h, termina en camino de lastre | ~1 h, asfaltado |
| Playa | Larga, dorada, surfeable | Guiones, salvaje y amplia | Arena blanca, agua calmada |
| Oferta gastronómica | Enorme variedad | Cafés saludables | Pequeña pero exclusiva |
| Vida nocturna | La mayor de Guanacaste | Casi nula (a propósito) | Noches tranquilas en la marina |
| Ideal para | Primera visita, grupos, surfistas | Yoga, inmersión en el surf, desconectarse | Familias, parejas, lujo |
| Rango de presupuesto | $ – $$$ | $$ – $$$ | $$ – $$$$ |

## Tamarindo: el pueblo que lo tiene todo

Tamarindo es el álbum de grandes éxitos de Guanacaste: olas para aprender a surfear en un extremo, catamaranes al atardecer en el otro, y en medio más restaurantes, bares y tiendas que el resto de la costa junta. Todo se recorre **a pie**, los tours te recogen en la puerta y el [traslado desde el aeropuerto](/blog/liberia-airport-to-tamarindo) es el más fácil de la región para una estadía larga.

El costo: es popular, y de diciembre a abril se nota. Si para ti «vibrante» suena a «lleno de gente», mira los dos siguientes.

**Elige Tamarindo si:** es tu primer viaje a Costa Rica, vienes en un grupo con intereses variados o quieres la comodidad de no necesitar carro.

## Nosara: el botón de reinicio

Nosara (en realidad Playa Guiones) es adonde la gente va a *convertirse* en madrugadora: surf al amanecer, yoga en estudios de clase mundial, smoothie bowls y caminos de selva donde los monos congo ponen la banda sonora. El desarrollo es deliberadamente bajo y escondido entre los árboles: no existe una «calle principal» como tal.

Llegar es parte del filtro: [los últimos 25–30 km son camino de lastre corrugado](/blog/guanacaste-driving-times-from-liberia-airport). A los locales les gusta así, en serio. Sáltate el estrés del carro alquilado y entra en shuttle; una vez ahí, todo el mundo se mueve en bici, cuadraciclo o a pie.

**Elige Nosara si:** quieres inmersión en surf y bienestar, huyes de una vida llena de pantallas o las mañanas lentas son el objetivo del viaje.

## Playa Flamingo: la refinada

Flamingo es la adulta de las tres: una **playa de arena realmente blanca con agua calmada para nadar**, villas en las colinas con vistas impresionantes del atardecer y una marina moderna que trae pesca deportiva y un puñado de restaurantes excelentes. Al lado: Playa Conchal (la famosa playa de conchas trituradas) y los pueblitos relajados de Brasilito y Potrero.

No hay ambiente de fiesta ni mucho «pueblo» para caminar, y justo ahí está su encanto.

**Elige Flamingo si:** viajas con niños que necesitan agua calmada, estás celebrando algo o tu noche ideal es una copa de vino en una terraza en lugar de un bar de playa.

## ¿No te decides? Divide la semana

La jugada clásica: **3–4 noches en Tamarindo o Flamingo + 3–4 noches en Nosara.** Primero tienes la facilidad de la carretera asfaltada, luego el reinicio en la selva, conectados por un solo salto en [shuttle privado](/private-shuttle) (Tamarindo ↔ Nosara ≈ 1.5–2 h), para que nadie maneje el camino de lastre más que nosotros. Esa combinación es, no por casualidad, nuestra ruta entre playas más reservada.
$es$,
  faqs_es = $es$[
    {"q": "¿Cuál es mejor para quien visita por primera vez, Tamarindo o Nosara?", "a": "Tamarindo es más fácil: 50 minutos del aeropuerto por carretera asfaltada, se recorre a pie y tiene restaurantes y tours por todas partes. Nosara es un viaje de 2 horas que termina en camino de lastre y está más disperso: maravilloso, pero mejor cuando ya sabes que prefieres tranquilidad y yoga antes que variedad y vida nocturna."},
    {"q": "¿Playa Flamingo es cara?", "a": "Es la más exclusiva de las tres: alquiler de villas, una marina y hoteles de lujo más tranquilos. Los gastos del día a día (restaurantes, tours) son similares a los de Tamarindo, pero el hospedaje tiende a ser más caro. Brasilito y Potrero, a minutos de distancia, ofrecen estadías más económicas."},
    {"q": "¿Puedo hospedarme en un pueblo y visitar los otros?", "a": "Sí. De Tamarindo a Flamingo son unos 35 minutos por carretera; de Tamarindo a Nosara, entre 1.5 y 2 horas. Muchos viajeros se instalan en un pueblo y hacen una excursión de un día en shuttle privado a otro, o dividen la semana entre dos."},
    {"q": "¿Qué pueblo tiene la mejor playa para nadar?", "a": "Flamingo, y la vecina Playa Conchal, tienen el agua más calmada y clara de las tres. Tamarindo está bien para nadar por el lado del estero. Playa Guiones, en Nosara, es principalmente una playa de surf: hermosa, pero con olas constantes."},
    {"q": "¿Los tres tienen buena comida?", "a": "Sí, pero distinta: Tamarindo tiene por mucho la mayor variedad (desde sushi hasta parrilladas), Nosara se especializa en cafés saludables y cocina de la finca a la mesa, y Flamingo tiene una oferta más pequeña pero refinada, además de los nuevos locales de la marina."}
  ]$es$::jsonb,
  cover_image_alt_es = $es$Panorámica del atardecer sobre las playas y colinas de la Costa Dorada de Guanacaste, Costa Rica$es$
where slug = 'tamarindo-vs-nosara-vs-flamingo';


-- ------------------------------------------------------------
-- 7/10 · do-you-need-a-rental-car-in-guanacaste  (blog_seed_02.sql)
-- ------------------------------------------------------------
update public.blog_posts_ruta_pacifico set
  title_es = $es$¿Necesitas alquilar carro en Guanacaste? La respuesta honesta de un local$es$,
  excerpt_es = $es$A veces sí, muchas veces no. La cuenta real del alquiler de carro en Guanacaste (seguro obligatorio, estado de los caminos y depósitos) frente a shuttles, taxis y tours que incluyen recogida.$es$,
  content_md_es = $es$
La respuesta más honesta en el mundo de los viajes a Costa Rica: **depende de cuántas veces vayas a cambiar de cama.** ¿Te quedas en un solo pueblo? Olvídate del carro. ¿Vas a recorrer todo el país? Alquila uno. Aquí va la cuenta real, incluyendo los costos que los sitios de reservas no te muestran.

## El costo real de un carro de alquiler

Esa tarifa gancho de $12/día en el comparador no es lo que vas a pagar. La verdadera matemática del alquiler en Costa Rica:

| Rubro | Monto típico |
| --- | --- |
| Tarifa base (SUV compacto, temporada alta) | $40–90/día |
| **Seguro obligatorio de responsabilidad civil (SLI/TPL)** | $15–25/día, obligatorio por ley, casi nunca en la cotización en línea |
| CDW completo (o una retención de depósito de $1,000–3,000) | $10–30/día o congelado en tu tarjeta |
| Gasolina (LIR → playas → tours) | ~$60–100/semana |
| Parqueo, parqueos vigilados ocasionales | Poco, pero constante |

**Total semanal realista: $450–800.** La cobertura de alquiler de tu tarjeta de crédito no te exime del seguro obligatorio de responsabilidad civil; todo el que alquila lo paga en el mostrador, y de ahí salen las famosas historias de «mi alquiler de $89 terminó en $340».

## Cuando el carro sí gana de verdad

Seamos justos con el alquiler: a veces es la decisión correcta.

- **Viajes por carretera con varias bases**: 3 o más lugares en una semana, sobre todo si combinas volcán y playa a tu propio ritmo.
- **Coleccionistas de playas remotas**: si andas tras olas vacías en Junquillal, Marbella o calas secretas de Nicoya adonde no llega ningún transporte con horario.
- **Espontaneidad total**: quieres seguir un camino de lastre solo porque se ve interesante. (Es, en serio, uno de los placeres de Guanacaste, en el vehículo adecuado.)

Si ese es tu viaje: alquila un **SUV alto**, toma el seguro completo y lee primero nuestro [resumen del estado de los caminos](/blog/guanacaste-driving-times-from-liberia-airport).

## Cuando el carro se queda parqueado (la mayoría de las vacaciones de playa)

Esto es lo que sorprende a quienes vienen por primera vez: **en una semana clásica de playa en uno o dos pueblos, el carro de alquiler se la pasa parqueado al sol.**

- **Los pueblos de playa se recorren a pie.** Tamarindo, Coco, Sámara: todo queda caminando. [No hace falta Uber](/blog/uber-in-guanacaste-costa-rica); los taxis rojos cubren las noches lluviosas.
- **Todos los tours incluyen recogida.** Catamarán, Rincón de la Vieja, snorkel, canopy: las busetas te recogen en el hotel. Manejarías hasta un punto de encuentro para... subirte a su buseta.
- **Los traslados son un problema resuelto.** Los shuttles [desde el aeropuerto](/private-shuttle) y entre pueblos tienen precio fijo y son puerta a puerta, y alguien más se hace responsable de los huecos.

Haz esa cuenta: los traslados al aeropuerto más un cambio de playa suelen sumar **menos de la mitad** del costo semanal real del alquiler, sin depósitos, sin formularios de seguro y sin ansiedad por caminos de lastre.

## La estrategia híbrida que recomiendan los locales

No es todo o nada: **alquila carro solo los 2–3 días en que de verdad lo necesitas.** Las oficinas de alquiler en Tamarindo, Flamingo y Coco entregan carros en los hoteles. Llega en shuttle, instálate, alquila localmente para tus días de exploración y devuélvelo. Te saltas la fila del mostrador del aeropuerto *y* los días de pagar por un carro parqueado.

## En resumen

- **Semana de playa en un solo pueblo** → sin carro. Llega en shuttle, camina, tours con recogida, shuttle de salida.
- **Dos pueblos** → sin carro. Un traslado entre playas los conecta.
- **3 o más bases o cacería de playas remotas** → alquila el SUV, presupuesta con honestidad, toma el seguro completo.
- **¿Sin decidirte?** → llega sin carro; alquila localmente en el momento en que te sientas atrapado. (La mayoría nunca lo hace.)
$es$,
  faqs_es = $es$[
    {"q": "¿Vale la pena alquilar carro en Costa Rica?", "a": "Depende de tu itinerario. Si tu base es un solo pueblo de playa que se recorre a pie y haces tours (que incluyen recogida), el carro se la pasa parqueado. Si cambias de pueblo cada uno o dos días y te encantan las paradas espontáneas, el carro sí se gana su costo."},
    {"q": "¿Cuál es el seguro obligatorio de los carros de alquiler en Costa Rica?", "a": "La cobertura de responsabilidad civil frente a terceros (a menudo llamada SLI o TPL) es obligatoria por ley y suele costar entre $15 y $25 por día. Normalmente NO está incluida en la cotización en línea, y por eso el precio en el mostrador sorprende a tantos viajeros. La cobertura CDW de la tarjeta de crédito no la sustituye."},
    {"q": "¿Cuánto gasta la gente realmente en un carro de alquiler por semana?", "a": "Una cifra realista, con todo incluido, para un SUV compacto en temporada alta es de $450 a $800 por semana una vez que sumas el seguro obligatorio, la cobertura completa, la gasolina y el parqueo, frente a la tarifa gancho de $60 a $90 por día con la que empezó la búsqueda."},
    {"q": "¿Puedo hacer excursiones de un día desde Tamarindo sin carro?", "a": "Fácilmente. Los operadores de tours incluyen recogida en el hotel para Rincón de la Vieja, catamaranes, snorkel y canopy, y los shuttles privados se encargan de los días de recorrer playas. Dentro del pueblo todo se hace a pie."},
    {"q": "¿Necesito 4x4 en Guanacaste?", "a": "En el corredor asfaltado (Tamarindo, Flamingo, Conchal, Coco, Papagayo), no. Para Nosara, Avellanas, Monteverde o viajes en temporada verde por caminos de lastre, se recomienda mucho un SUV alto: en esos caminos ocurre la mayoría de los daños a carros alquilados y de las disputas por coberturas anuladas."}
  ]$es$::jsonb,
  cover_image_alt_es = $es$Lancha de pesca en una playa amplia y tranquila de Guanacaste, Costa Rica$es$
where slug = 'do-you-need-a-rental-car-in-guanacaste';


-- ------------------------------------------------------------
-- 8/10 · liberia-airport-to-la-fortuna-monteverde  (blog_seed_02.sql)
-- The seed ships this post with cover_image_url / cover_image_alt = NULL,
-- so cover_image_alt_es is NULL too (nothing to translate; the site
-- falls back to the English alt once one exists).
-- ------------------------------------------------------------
update public.blog_posts_ruta_pacifico set
  title_es = $es$Del Aeropuerto de Liberia a La Fortuna y Monteverde sin alquilar carro$es$,
  excerpt_es = $es$Sí, puedes visitar el Volcán Arenal y el bosque nuboso de Monteverde desde LIR sin manejar: tiempos de viaje reales, cómo son los caminos y cómo combinar ambos con una playa de Guanacaste.$es$,
  content_md_es = $es$
Las playas de Guanacaste se llevan la fama, pero dos de los lugares más espectaculares de Costa Rica quedan a unas horas tierra adentro del aeropuerto de Liberia: el **Volcán Arenal (La Fortuna)** y el **bosque nuboso de Monteverde**. Ninguno requiere carro de alquiler y, honestamente, estas son las dos rutas donde *no* manejar rinde más.

## Las rutas de un vistazo

| Ruta | Tiempo | Distancia | Camino |
| --- | --- | --- | --- |
| LIR → La Fortuna / Arenal | ~3.5 h | ~200 km | Asfaltado todo el trayecto |
| LIR → Monteverde | ~3 h | ~145 km | Asfaltado, luego subida de montaña sin asfaltar |
| La Fortuna ↔ Monteverde (jeep-boat-jeep) | ~3 h | cruzando el Lago Arenal | Buseta + bote + buseta |
| Monteverde → Tamarindo / Flamingo | ~3 h | ~150 km | Bajada de montaña, luego asfaltado |

## LIR → La Fortuna: la carretera del lago

El viaje es un hermoso arco alrededor del **Lago Arenal**: crestas con molinos de viento, pueblitos a la orilla del lago y, al final, el cono perfecto del volcán llenando el parabrisas. Está asfaltado todo el trayecto; lo «difícil» no es el camino, es mantenerse despierto 3.5 horas después de un vuelo internacional, que es exactamente para lo que existe un chofer.

**Vale la pena parar:** *Llanos de Cortés*, una de las cataratas más bonitas de Costa Rica, se esconde a 40 minutos del aeropuerto, cerca de Bagaces; un chapuzón ahí parte el viaje perfectamente. Los restaurantes a la orilla del lago cerca de Nuevo Arenal son una gran pausa para almorzar con vista al volcán.

En La Fortuna no vas a extrañar el carro: aguas termales, puentes colgantes y caminatas al volcán funcionan con tours que te recogen en el hotel, y el centro del pueblo se recorre a pie.

## LIR → Monteverde: la subida a las nubes

Monteverde está más cerca que La Fortuna pero *se siente* más remoto, porque el último tramo es la legendaria **subida de montaña sin asfaltar**: curvas en zigzag, neblina ocasional y vistas de todo el Golfo de Nicoya cuando despeja. No es peligroso; es simplemente el tipo de camino donde el chofer debería ser alguien que lo hace todas las semanas (y cuya suspensión no es tu depósito de alquiler).

Arriba: la Reserva Bosque Nuboso Monteverde, puentes colgantes entre la neblina, jardines de colibríes y caminatas nocturnas. También aire más fresco: lleva una chaqueta ligera, de noche baja a 15–18 °C.

## El triángulo clásico: volcán + bosque nuboso + playa

Este es el itinerario que aprovecha estas rutas a la perfección, con **cero carro de alquiler**:

1. **Días 1–3 — La Fortuna.** Shuttle privado desde LIR (~3.5 h). Aguas termales, caminatas al volcán, cataratas.
2. **Días 3–5 — Monteverde.** Cruza el Lago Arenal en **jeep-boat-jeep** (~3 h, y el paseo en bote es un atractivo en sí mismo). Bosque nuboso, puentes, tours de café.
3. **Días 5–8 — Gran final en la playa.** Shuttle montaña abajo hasta [Tamarindo, Flamingo o Conchal](/blog/tamarindo-vs-nosara-vs-flamingo) (~3 h). Descansa, surfea, disfruta el atardecer.
4. **Salida.** Un cómodo [salto de 1 hora a LIR](/blog/guanacaste-driving-times-from-liberia-airport).

Cada tramo es un traslado privado a precio fijo (consulta cualquiera en el [buscador de rutas](/private-shuttle)) y en ninguno vas aferrado al volante en un camino de montaña con neblina.

## ¿Excursión de un día desde la playa o pernoctar?

Nos preguntan si Arenal o Monteverde funcionan como *excursión de un día* desde Tamarindo. Técnicamente sí; honestamente, no lo hagas. Más de seis horas de carretera ida y vuelta por una tarde a las carreras les queda corto a ambos lugares. Dale a cada uno **dos noches como mínimo**: el bosque nuboso de madrugada, antes de que lleguen los visitantes del día, es otro mundo y vale por sí solo la noche de hospedaje.
$es$,
  faqs_es = $es$[
    {"q": "¿Cuánto dura el viaje del aeropuerto de Liberia a La Fortuna?", "a": "Unas 3.5 horas (aproximadamente 200 km) por carretera totalmente asfaltada, rodeando el Lago Arenal con el volcán apareciendo en el tramo final. Con una parada para fotos o almuerzo, calcula 4 horas puerta a puerta."},
    {"q": "¿Cuánto se tarda del aeropuerto de Liberia a Monteverde?", "a": "Unas 3 horas. Los primeros dos tercios son carretera asfaltada; la famosa subida final al bosque nuboso es un camino de montaña sin asfaltar y lleno de curvas. Es lento pero muy escénico, y completamente rutinario para choferes que lo hacen cada semana."},
    {"q": "¿Puedo visitar La Fortuna y Monteverde en un mismo viaje?", "a": "Sí: están uno frente al otro, separados por el Lago Arenal. La conexión popular es el traslado jeep-boat-jeep (buseta, bote por el lago, buseta), que toma unas 3 horas y es una experiencia en sí misma. Una ruta típica: de LIR a La Fortuna, jeep-boat-jeep a Monteverde y luego shuttle a una playa de Guanacaste."},
    {"q": "¿El camino a Monteverde es peligroso?", "a": "No, solo lento: sin asfaltar, lleno de curvas y con neblina a ratos, que es exactamente por lo que muchos visitantes prefieren no manejarlo, sobre todo de noche o en temporada verde. Busetas en buen estado con choferes experimentados lo hacen a diario."},
    {"q": "¿Puedo parar en algún lugar interesante camino de LIR a La Fortuna?", "a": "Sí: la catarata Llanos de Cortés, cerca de Bagaces, es una parada espectacular de 40 minutos para nadar, a un paso de la carretera, y los restaurantes a la orilla del Lago Arenal son perfectos para almorzar con vista al volcán. Los traslados privados pueden incluir una parada sin ningún drama."}
  ]$es$::jsonb,
  cover_image_alt_es = null
where slug = 'liberia-airport-to-la-fortuna-monteverde';


-- 9. guanacaste-with-kids
update public.blog_posts_ruta_pacifico set
  title_es = $es$Guanacaste con niños: la guía familiar (sillas de carro, playas tranquilas y tiempos de viaje sensatos)$es$,
  excerpt_es = $es$Las playas más tranquilas para los peques, hasta dónde es demasiado lejos con un bebé, sillas de carro gratis y la logística familiar que ningún folleto cuenta, de un equipo que traslada familias todos los días.$es$,
  content_md_es = $es$
Guanacaste puede ser el destino tropical más fácil de las Américas para viajar en familia: vuelos cortos, agua potable del tubo, ninguna vacuna obligatoria y playas a 25 minutos del aeropuerto. Pero un viaje con niños se gana o se pierde en la logística, así que aquí va la guía que nos hubiera gustado que toda familia tuviera antes de aterrizar.

## Regla #1: elige la playa según el niño

No todas las playas del Pacífico se comportan igual. El mapa honesto:

| Playa | Agua | Edades ideales | Por qué |
| --- | --- | --- | --- |
| **Playa Conchal** | Tranquila, cristalina | Todas | Entrada poco profunda y turquesa, snorkel desde la orilla |
| **Playa Flamingo** | Tranquila | Todas | Arena blanca, restaurantes y baños cerca |
| **Playa Hermosa (Gte.)** | Muy tranquila | Bebés y niños pequeños | Bahía protegida, pendiente suave, árboles con sombra |
| **Playas del Coco** | Tranquila | Todas | Pueblo caminable = helado siempre a mano |
| **Playa Carrillo** | Tranquila | Todas | Media luna de palmeras, felizmente sin desarrollar |
| **Tamarindo** | Olas pequeñas | 6+ | Ideal para las primeras clases de surf; el lado del estero es más calmo |
| **Playa Grande / Guiones** | Surf de verdad | Adolescentes | Olas serias y corrientes fuertes para los más pequeños |

**En resumen:** hospedarte en Conchal/Flamingo, Hermosa o Coco te da agua tranquila todos los días, con la energía de un pueblo surfero a una excursión fácil de distancia.

## Tiempos de viaje, en unidades de papá y mamá

Distancias que parecen triviales en el mapa se sienten distintas desde la tercera fila. Desde LIR ([tabla completa aquí](/blog/guanacaste-driving-times-from-liberia-airport)):

- **Hermosa, Coco, Papagayo: ~30 min.** Lo que dura una siesta. Aterrizas después de almorzar y te bañas antes de cenar.
- **Tamarindo, Flamingo, Conchal: ~1 h.** Una merienda y un capítulo. Indoloro.
- **Sámara/Carrillo, Nosara: ~2 h.** Se puede; planea una parada y procura viajar en la mañana.
- **La Fortuna, Monteverde: 3–3,5 h.** Bien para niños de 5+ con una parada en una catarata; valiente con un bebé.

## Sillas de carro: lo que decide cómo vas a viajar

En Costa Rica las sillas de retención infantil son obligatorias por ley, y aquí es donde la logística familiar suele quebrarse: las aerolíneas cobran por documentar las sillas, las rentadoras alquilan sillas cansadas a $10+ por día cada una y los taxis no tienen.

**Nuestro enfoque: todos los vehículos de Ruta Pacifico llevan sillas para bebé, convertibles y boosters sin costo.** Dinos las edades al reservar y van instaladas antes de llegar a la acera del aeropuerto. Es el detalle que más agradecen en nuestras reseñas, casi siempre el papá o la mamá que esperaba cargar dos sillas por tres aeropuertos.

## Un ritmo de una semana en familia que funciona

1. **Días 1–3: aterriza suave.** LIR → Playa Hermosa o un resort de Papagayo (30 min). Piscina, bahía tranquila, recuperación del jet lag.
2. **Días 4–6: el tramo de casa de playa.** Shuttle a Flamingo/Conchal (~45 min). Villa con cocina, snorkel en Conchal, un atardecer familiar en catamarán (las salidas de tarde en aguas calmas les sientan muy bien a los niños).
3. **Día 6: día de aventura.** Excursión a Tamarindo para una clase de surf infantil, o a Rincón de la Vieja por cataratas y puentes colgantes (el tour incluye recogida).
4. **Día 7: a casa.** Un viaje sin prisas de 1 hora a LIR, con las sillas ya instaladas y sin nadie devolviendo un carro alquilado lleno de arena.

Total de carretera en la semana: unas 2,5 horas, y ninguna manejada por ti. Ese es todo el argumento para [hacer Guanacaste sin alquilar carro](/blog/do-you-need-a-rental-car-in-guanacaste) cuando viajas con niños.

## Los detalles pequeños que importan

- **El sol es el verdadero peligro.** La radiación aquí es fuerte; una camiseta de licra le gana a reaplicar bloqueador sobre un niño que no se queda quieto. Playa en la mañana, piscina en la tarde.
- **Las farmacias son excelentes** y hay en cada pueblo; no hace falta empacar una clínica.
- **Los monos van a juzgar tus meriendas.** Los congos al amanecer son entretenimiento gratis; solo no les des comida.
- **Por WhatsApp se arregla todo:** tours, taxis, nosotros. Un mensaje y está resuelto.
$es$,
  faqs_es = $es$[
    {"q": "¿Las sillas de carro son obligatorias en Costa Rica?", "a": "Sí. La ley costarricense exige sistemas de retención infantil adecuados a la edad y la talla (en general hasta los 12 años o 1,45 m). Ruta Pacifico ofrece sillas para bebé, sillas convertibles y boosters sin costo en todos los traslados; solo dinos las edades al reservar."},
    {"q": "¿Qué playas de Guanacaste son las más tranquilas para niños pequeños?", "a": "Playa Conchal, Playa Flamingo, Playa Hermosa (Guanacaste), Playas del Coco y Playa Carrillo, cerca de Sámara, tienen el agua más suave. Playas de surf como Tamarindo y Guiones son mejores para nadadores con confianza y niños mayores que toman clases."},
    {"q": "¿Cuánto traslado aguantan de verdad los niños pequeños?", "a": "Nuestra regla, después de miles de recogidas familiares: menos de 1 hora es fácil a cualquier edad, hasta 2 horas funciona con un plan de merienda y pantalla, y 3 horas o más (La Fortuna, Monteverde) conviene partirlas con una parada en una catarata o para almorzar, algo que un traslado privado puede incluir."},
    {"q": "¿Es seguro viajar en familia a Guanacaste?", "a": "Sí. Es una de las regiones más visitadas por familias en América Latina. Aplica el sentido común de cualquier viaje. Los puntos prácticos de seguridad son el sol (muy fuerte; sombrero y bloqueador biodegradable), las banderas de oleaje en los días de playa y mantenerse hidratados."},
    {"q": "¿Los hoteles de Guanacaste están preparados para niños?", "a": "Muchos lo hacen excepcionalmente bien: clubes infantiles en los resorts de Papagayo y Conchal, piscinas familiares en todas partes y villas vacacionales en Flamingo y Potrero con cocina, que hacen la vida mucho más fácil con los comelones exigentes."}
  ]$es$::jsonb,
  cover_image_alt_es = $es$Familia con un coche de bebé descansando bajo las palmeras en Playa Carrillo, Costa Rica$es$
where slug = 'guanacaste-with-kids';

-- 10. guanacaste-7-day-itinerary-without-car
update public.blog_posts_ruta_pacifico set
  title_es = $es$El itinerario perfecto de 7 días por Guanacaste (sin alquilar carro)$es$,
  excerpt_es = $es$Una semana día por día en la Costa Dorada de Costa Rica (Papagayo, Conchal, Tamarindo) conectada solo con shuttles privados: dónde hospedarte, qué reservar y cuándo moverte.$es$,
  content_md_es = $es$
Un aeropuerto, dos bases, tres viajes en shuttle, cero carros alquilados: esta es la semana que le planearíamos a un amigo en su primer viaje a Guanacaste. Tiempo total de carretera: unas **2,5 horas en siete días**; todo lo demás es playa.

## La forma de la semana

| Días | Base | Cómo llegar |
| --- | --- | --- |
| 1–3 | Playa Hermosa / zona de Papagayo | LIR → hotel, ~30 min |
| 4–7 | Tamarindo (o Flamingo) | Traslado de ~45 min |
| 7 | A casa | Hotel → LIR, ~1 h |

## Día 1 — Aterrizar y desconectar (Papagayo / Hermosa)

Tu chofer te espera en la salida de llegadas de LIR, con el vuelo rastreado y [las sillas de carro instaladas si hacen falta](/blog/guanacaste-with-kids), y 30 minutos después estás haciendo check-in en el lado tranquilo de la costa. Piscina, primer casado de la cena, atardecer desde la arena. No planees más que esto: los días de llegada son para llegar.

**Hospedaje:** Playa Hermosa para calma boutique, los resorts de Papagayo para servicio completo, Playas del Coco para la energía de un pueblo caminable.

## Día 2 — Día de aguas tranquilas

Hermosa y Coco dan a una bahía protegida: paddleboard en la mañana, tour de snorkel a las caletas de Papagayo o simplemente la playa con un buen libro. Por la noche, Coco para un ceviche y ver pasar a la gente por el frente de playa.

## Día 3 — Día de gran aventura

Elige tu clásico de Guanacaste (todos incluyen recogida en el hotel):

- **Rincón de la Vieja:** pailas de barro volcánico, cataratas, canopy y aguas termales en un solo día de parque.
- **Paseo en catamarán:** snorkel, barra libre y el regreso al atardecer.
- **Safari fluvial en Palo Verde:** cocodrilos, monos y mil aves en el Tempisque.

## Día 4 — Bajar por la Costa Dorada

El único cambio de base de la semana: un **traslado privado de 45 minutos** hacia el sur. En el camino, pídele a tu chofer pasar por **Playa Conchal**, la playa de conchas trituradas con el agua más clara de esta costa, para una primera mirada, o parar en un supermercado si reservaste una villa.

**Elección de base:** [Tamarindo por energía y opciones; Flamingo por elegancia y aguas tranquilas](/blog/tamarindo-vs-nosara-vs-flamingo). Las dos funcionan igual en este plan.

## Día 5 — Mañana de surf

El suave beach break de Tamarindo es donde miles de personas se han parado en una tabla por primera vez: hay clases todas las mañanas, para todos los niveles y todas las edades. Celébralo con tacos de pescado y pasa la tarde en horizontal.

*¿Te quedaste en Flamingo?* Date el salto de 20 minutos a Tamarindo para la clase, o cámbiala por una mañana de pesca deportiva o buceo desde la marina.

## Día 6 — Tu comodín

- **Paseo en bote por los manglares del estero** de Tamarindo: monos y cocodrilos a una curva de río de las tiendas de surf.
- **Día de saltar entre playas:** el famoso bar de playa de Avellanas, o Conchal con equipo de snorkel y una hielera.
- **Absolutamente nada.** Legalmente, sigue siendo tu mejor opción. La [lluvia de la tarde](/blog/best-time-to-visit-guanacaste), si llega, es la mejor excusa del mundo para una siesta.

## Día 7 — La salida fácil

Tamarindo/Flamingo → LIR es [una hora asfaltada y con paisaje](/blog/guanacaste-driving-times-from-liberia-airport). Para un vuelo al mediodía, sal unas 3,5 horas antes de la salida y harás el check-in sin apuros: sin devolver el carro alquilado, sin buscar gasolinera, sin angustia por el depósito. Solo una última mirada a los cerros dorados desde la ventana.

## Lista de reservas

1. Vuelos a **LIR** ([por qué no a SJO](/blog/liberia-vs-san-jose-airport))
2. Hoteles: noches 1–3 del lado de la bahía, noches 4–7 en Tamarindo/Flamingo
3. [Traslados de aeropuerto y entre playas](/private-shuttle): tres tramos, precio fijo, una sola reserva
4. Catamarán al atardecer (en temporada alta, reserva con anticipación)
5. Una camiseta de licra, bloqueador biodegradable y pocas expectativas sobre tu correo

Pura vida: el itinerario es la parte fácil; lo difícil es volver a casa.
$es$,
  faqs_es = $es$[
    {"q": "¿De verdad se puede recorrer Guanacaste sin alquilar carro?", "a": "Con toda comodidad. Este itinerario usa tres traslados privados que suman unas 2,5 horas de carretera en toda la semana. Los tours incluyen recogida en el hotel, los pueblos de playa se recorren a pie y los taxis cubren cualquier salto ocasional."},
    {"q": "¿Cuánto debo presupuestar en traslados para esta semana?", "a": "Tres tramos de shuttle privado (llegada al aeropuerto, un cambio de playa y salida al aeropuerto) a precio fijo por vehículo; repartido entre el grupo, casi siempre sale mejor que una semana de carro alquilado, seguro y gasolina. Los precios exactos de cada tramo están en rutapacifico.com/private-shuttle."},
    {"q": "¿Una semana alcanza para Guanacaste?", "a": "Una semana cubre bien dos bases: una bahía con resort más un pueblo de playa, con una o dos excursiones. Para sumar La Fortuna o Monteverde sin correr, planea 10 días."},
    {"q": "¿Qué debo reservar antes de llegar?", "a": "Vuelos, hoteles, tu traslado desde el aeropuerto y, en temporada alta, el catamarán al atardecer y cualquier tour imperdible. Las clases de surf y los restaurantes se pueden arreglar en el lugar con un día de anticipación."},
    {"q": "¿Este itinerario funciona en la temporada de lluvias?", "a": "Sí. De mayo a noviembre las mañanas se mantienen mayormente soleadas, así que concentra la playa temprano y toma el aguacero de 3 a 5 p. m. como siesta. Setiembre y octubre traen la mayor lluvia y los mejores precios."}
  ]$es$::jsonb,
  cover_image_alt_es = $es$Velero cruzando el horizonte al atardecer frente a la costa de Guanacaste, Costa Rica$es$
where slug = 'guanacaste-7-day-itinerary-without-car';

-- 10 posts translated (every slug in blog_seed_01.sql and blog_seed_02.sql appears exactly once above).
