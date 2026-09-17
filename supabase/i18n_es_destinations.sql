-- ============================================================
-- Spanish (es) copy for public.destinations_ruta_pacifico
--
-- PREREQUISITE: run supabase/i18n_es_schema.sql FIRST. It adds the
-- intro_md_es / arrival_md_es / tips_md_es / best_for_es / image_alt_es
-- columns this file writes to.
--
-- Source: supabase/destinations_seed.sql (English copy) as of 2026-09-17.
-- Idempotent: every statement is a plain UPDATE keyed by slug, so the file
-- is safe to re-run at any time; re-running simply rewrites the same text.
--
-- Rows whose English fields are empty in the seed (tier-4 stubs) get NULL
-- in every *_es column, so the site falls back to English for them.
-- The seed never sets image_alt, so image_alt_es is NULL on every row.
-- ============================================================

-- ---------- Tier 1: hubs ----------

update public.destinations_ruta_pacifico set
  intro_md_es = $es$El Aeropuerto Internacional Daniel Oduber Quirós (IATA: LIR) es la puerta de entrada a Guanacaste y el aeropuerto internacional más cercano a todas las playas de la Costa Dorada de Costa Rica. Es compacto y moderno: casi siempre pasas migración y aduanas y sales a la acera de llegadas en 20 a 30 minutos.

Recibe vuelos directos desde Houston, Dallas, Atlanta, Miami, Newark, Nueva York, Toronto, Montreal y más, además de servicio de temporada desde Europa. Aterrizar en LIR en lugar de San José te ahorra entre tres y cinco horas de carretera hacia cualquier destino de Guanacaste.$es$,
  arrival_md_es = $es$Tu chofer te espera en la salida de llegadas con un rótulo con tu nombre. Hay una sola salida, así que es imposible no encontrarse. Hacemos seguimiento de vuelo en tiempo real: si aterrizas antes o después de lo previsto, la recogida se ajusta automáticamente sin costo adicional. De la acera a la carretera son cinco minutos; la Ruta 21 baja hacia el sur rumbo a Tamarindo y la costa de Flamingo, mientras que la Ruta 1 sigue hacia el noroeste rumbo a Papagayo y Playas del Coco.$es$,
  tips_md_es = $es$- Pasa migración antes de comprar una tarjeta SIM; los kioscos están del lado público, después de aduanas.
- El cajero automático de la salida entrega colones y dólares; los billetes pequeños en dólares se aceptan casi en todas partes.
- Al salir del país: llega 2.5 a 3 horas antes de un vuelo internacional en temporada alta (diciembre a abril), cuando la sala de check-in se llena a media mañana.
- El duty-free es diminuto. Compra el café y los recuerdos en el pueblo, no en el aeropuerto.$es$,
  best_for_es = array['Playas de Guanacaste','Traslados cortos','Vuelos directos desde EE. UU. y Canadá'],
  image_alt_es = null
where slug = 'lir-liberia-int-airport';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$El Aeropuerto Internacional Juan Santamaría (IATA: SJO) está en Alajuela, a 20 minutos del centro de San José, y es el aeropuerto más grande de Costa Rica. Tiene la mayor oferta de aerolíneas y, por lo general, las tarifas más baratas, y por eso muchos viajeros con destino a Guanacaste siguen aterrizando aquí.

SJO tiene sentido cuando tus primeras noches son en el Valle Central, La Fortuna, Monteverde o el Pacífico Central. Para una semana solo de playa en Guanacaste, el aeropuerto de Liberia queda cuatro horas más cerca.$es$,
  arrival_md_es = $es$Los choferes te reciben justo afuera de las puertas de llegadas, pasando la fila de taxis, con un rótulo con tu nombre. Salir del aeropuerto toma unos minutos; desde ahí la autopista de peaje Ruta 27 baja hacia el Pacífico y la Ruta 1 sube hacia el norte. El seguimiento de vuelo está incluido, así que un aterrizaje con retraso nunca te cuesta el traslado.$es$,
  tips_md_es = $es$- La salida del aeropuerto es un caos en horas pico. Ignora a quienes te ofrezcan taxi y busca el rótulo con tu nombre.
- De SJO a Guanacaste son 4 a 5 horas de carretera. Si aterrizas después de las 4 pm, considera dormir en Alajuela y salir descansado a la mañana siguiente.
- Los peajes los paga el chofer y ya están incluidos en tu precio fijo.
- El impuesto de salida ya viene incluido en el boleto aéreo; no hay nada que pagar en el mostrador.$es$,
  best_for_es = array['Arenal y Monteverde','Manuel Antonio','Viajes por varias regiones'],
  image_alt_es = null
where slug = 'sjo-juan-santamaria-int-airport';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$La Fortuna es el pueblito al pie del Volcán Arenal, el cono casi perfecto que preside el destino de montaña más popular de Costa Rica. Aguas termales, puentes colgantes, caminatas a cataratas, rafting en aguas bravas y caminatas nocturnas para ver fauna: todo queda a menos de 20 minutos del centro.

Combina de maravilla con una semana de playa en Guanacaste: primero el volcán, para la aventura y el verde del bosque lluvioso, y luego la costa para el sol. La carretera entre ambos bordea la orilla norte del Lago Arenal, uno de los recorridos más escénicos del país.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia el viaje toma entre 3 y 3.5 horas por Cañas, Tilarán y la carretera del lago; desde la costa de Flamingo y Tamarindo suma una hora más. Desde San José son unas 3 horas pasando por San Ramón. El último tramo serpentea alrededor del Lago Arenal con el volcán al frente. Tu chofer te deja en la puerta de tu hotel, ya sea en el pueblo o en uno de los lodges de la carretera al parque nacional.$es$,
  tips_md_es = $es$- El volcán se ve más despejado temprano en la mañana; las nubes suelen cerrarlo hacia las 11 am.
- Reserva las aguas termales para la noche del día que llegas: es la mejor forma de sacudirse el viaje.
- La ropa para lluvia sirve todo el año; La Fortuna queda del lado caribeño y húmedo de la cordillera.
- La mayoría de los tours incluye recogida en el hotel, así que no necesitas carro una vez ahí.$es$,
  best_for_es = array['Vistas al volcán','Aguas termales','Familias'],
  image_alt_es = null
where slug = 'la-fortuna-arenal';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Monteverde es una comunidad en lo alto de la montaña, a 1,400 metros, famosa por sus reservas de bosque nuboso, puentes colgantes, fincas de café y los canopy originales de tirolesas. Las mañanas son frescas y con neblina, las tardes suelen despejar; el quetzal es la estrella entre enero y abril.

Es una parada natural entre Guanacaste y La Fortuna, o entre las playas y San José, y uno de los pocos lugares de Costa Rica donde vas a querer una chaqueta ligera.$es$,
  arrival_md_es = $es$Los últimos 30 a 40 km de subida desde la Interamericana son la razón por la que la gente reserva chofer para venir aquí: empinados, llenos de curvas, en parte de lastre y con neblina muchas tardes. Desde el aeropuerto de Liberia el viaje toma unas 3 horas, desde Tamarindo o Flamingo unas 3.5 y desde San José aproximadamente 3. Nuestros vehículos recorren este camino cada semana y los choferes conocen cada curva. Relájate y mira cómo el paisaje cambia de tierras bajas secas a bosque que gotea.$es$,
  tips_md_es = $es$- Lleva una capa abrigada y una capa para la lluvia; en las noches la temperatura baja a 12 a 15 °C.
- Las entradas a las reservas (Bosque Nuboso Monteverde, Santa Elena) se agotan en temporada alta; reserva con anticipación.
- Santa Elena es el pueblo caminable con restaurantes y tiendas; los lodges dentro del bosque son más tranquilos.
- Sal temprano el día de la partida: la bajada toma tiempo y la carretera puede estar lenta cerca de Puntarenas.$es$,
  best_for_es = array['Bosque nuboso','Canopy','Observación de aves'],
  image_alt_es = null
where slug = 'monteverde-cloud-forest';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Manuel Antonio es el parque nacional más visitado de Costa Rica: ensenadas de arena blanca rodeadas de bosque lluvioso donde perezosos, monos carablanca y tití y cientos de especies de aves aparecen en casi cualquier caminata. La carretera en la ladera entre el pueblo de Quepos y la entrada del parque está llena de hoteles, restaurantes y miradores para ver el atardecer sobre el Pacífico.

Desde Guanacaste es un viaje largo, pero es la combinación clásica para quienes terminan el viaje en el aeropuerto Juan Santamaría, y un recorrido fácil de 3 horas desde el propio SJO.$es$,
  arrival_md_es = $es$Desde San José el viaje es de unas 3 horas por la Ruta 27 y la Costanera pasando por Jacó. Desde el aeropuerto de Liberia o las playas de Guanacaste calcula 5 a 5.5 horas; la carretera está asfaltada todo el camino, con parada para almorzar en la costa en Jacó o Parrita. Desde La Fortuna son unas 4.5 horas. Tu chofer te lleva hasta la puerta de tu hotel, incluso por las calles empinadas de la ladera donde los taxis dudan.$es$,
  tips_md_es = $es$- El parque nacional cierra los martes y limita la cantidad de visitantes por día; compra las entradas en línea con anticipación.
- Contrata un guía con telescopio en la entrada del parque: vas a ver cinco veces más fauna.
- Nunca dejes comida sin vigilar en la playa; los monos y los mapaches son profesionales.
- El pueblo de Quepos, a 15 minutos, tiene los restaurantes más económicos y la feria del agricultor los sábados.$es$,
  best_for_es = array['Parque nacional','Fauna','Playa + selva'],
  image_alt_es = null
where slug = 'manuel-antonio-quepos';

-- ---------- Tier 2: core beaches ----------

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Tamarindo es el pueblo de playa más conocido de Guanacaste: una playa larga de olas suaves con clases de surf cada mañana, un centro caminable lleno de restaurantes, cafés y tiendas de surf, y atardeceres que todo el pueblo ve desde la arena. Playa Langosta al sur y Playa Grande al otro lado del estero ofrecen opciones más tranquilas a pocos minutos.

Es ideal para quienes visitan Costa Rica por primera vez y para grupos que quieren todo a pie, y es la base que la mayoría escoge para su primera semana de playa en el país.$es$,
  arrival_md_es = $es$Del aeropuerto de Liberia a Tamarindo son unos 65 km y 50 a 70 minutos por carretera asfaltada vía Belén y Huacas. Tu chofer toma la Ruta 21 hacia el sur y luego al oeste por tierra de ganado hasta el primer vistazo del Pacífico en Villarreal. Desde Flamingo o Conchal son 25 minutos; desde Playas del Coco, alrededor de una hora. Te dejamos en la puerta de tu hotel o condominio, incluidas las villas en lo alto de Tamarindo Heights y Playa Langosta.$es$,
  tips_md_es = $es$- El bote que cruza el estero hacia Playa Grande cuesta un par de dólares y sale según demanda desde el extremo norte de la playa.
- Las clases de surf son mejores con marea media a baja por la mañana, cuando el viento está calmo.
- Tamarindo se camina de punta a punta en 15 minutos; un carro de alquiler pasa la mayor parte del tiempo en un parqueo pagado.
- Reserva la cena los sábados por la noche en temporada alta; los buenos lugares se llenan.$es$,
  best_for_es = array['Surf','Vida nocturna','Pueblo caminable'],
  image_alt_es = null
where slug = 'tamarindo-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Playa Flamingo es una curva de arena clara entre dos puntas rocosas, con una marina moderna, parte de la mejor pesca deportiva de Guanacaste y catamaranes que zarpan a diario para ver el atardecer. La playa es más calma que Tamarindo, las villas de la ladera tienen amplias vistas al Pacífico, y Brasilito, Potrero y Conchal quedan a menos de diez minutos en carro.

Es la opción para quienes buscan una base más tranquila con botes, snorkel y acceso fácil a Reserva Conchal y Las Catalinas.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia el viaje es de aproximadamente 1 hora por la Ruta 21 pasando por Belén y Huacas, y luego hacia el norte después de Brasilito. Tamarindo queda a 25 minutos, Playas del Coco a unos 50, y la carretera está asfaltada hasta la marina. Las direcciones de las villas en la colina pueden confundir al GPS; envíanos el nombre o las coordenadas de tu alquiler al reservar y el chofer te lleva hasta el portón.$es$,
  tips_md_es = $es$- Las salidas por la mañana son las mejores para pescar y bucear; el viento se levanta después del almuerzo.
- Brasilito, cinco minutos al sur, tiene las sodas locales para almorzar barato.
- Los catamaranes de atardecer salen de la playa o de la marina alrededor de las 2 pm e incluyen snorkel.
- En Flamingo se puede nadar casi todos los días; Potrero es todavía más calma para los niños pequeños.$es$,
  best_for_es = array['Pesca deportiva','Marina','Playas tranquilas'],
  image_alt_es = null
where slug = 'flamingo-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Playa Conchal debe su nombre a su arena de conchas trituradas y es conocida por tener el agua más clara y turquesa de la Costa Dorada, ideal para hacer snorkel directamente desde la playa. Detrás está Reserva Conchal, hogar de los hoteles Westin y W y de un campo de golf, mientras que el pueblo vecino de Brasilito conserva el sabor local.

Es el destino para estadías en resort, con Flamingo, Tamarindo y Las Catalinas a menos de 25 minutos.$es$,
  arrival_md_es = $es$Del aeropuerto de Liberia a Conchal se hace aproximadamente 1 hora por carretera asfaltada pasando por Belén y Huacas. A los huéspedes del resort los dejamos en el lobby; quienes se hospedan en villas dentro de Reserva Conchal deben darle al chofer el nombre registrado en el portón. Desde Tamarindo son 20 minutos; desde Playas del Coco, poco menos de una hora.$es$,
  tips_md_es = $es$- Llega a la playa por la mañana, antes de que aparezcan los grupos de un día desde Tamarindo; el acceso es a pie desde Brasilito.
- Trae tu propio equipo de snorkel; en la playa casi no hay alquiler.
- Los restaurantes de Reserva Conchal tienen precios de resort; las sodas de Brasilito quedan a dos minutos.
- El campo de golf y el spa del resort están abiertos a no huéspedes con reservación.$es$,
  best_for_es = array['Resorts','Snorkel','Agua turquesa'],
  image_alt_es = null
where slug = 'conchal-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Playa Potrero es la bahía larga, calma y de arena oscura justo al norte de Flamingo, popular entre familias y visitantes de larga estadía gracias a su mar tranquilo, sus alquileres frente al mar y su pueblo relajado de restaurantes y pequeños mercados. El atardecer sobre la punta de Flamingo es el evento de cada día.

Es más tranquila y económica que sus vecinas, y aun así queda a minutos de la marina, Las Catalinas y el snorkel de Conchal.$es$,
  arrival_md_es = $es$El viaje desde el aeropuerto de Liberia es de poco más de una hora por la Ruta 21, Belén, Huacas y Flamingo, todo asfaltado. Las Catalinas queda 10 minutos al norte y Tamarindo 30 minutos al sur. Los alquileres están repartidos a lo largo del camino de la playa y por las colinas; compártenos el nombre de la propiedad y el chofer la encuentra.$es$,
  tips_md_es = $es$- El agua de Potrero es la más calma de las bahías de Flamingo, buena para paddleboard y para niños pequeños.
- Las ferias de los miércoles y sábados en el pueblo venden frutas y verduras, pan y artesanía local.
- Playa Penca y Playa Prieta, cinco minutos al norte, son playitas escondidas casi vacías.
- Haz las compras en el AutoMercado de Flamingo, el supermercado más grande de la zona.$es$,
  best_for_es = array['Mar tranquilo','Familias','Casas de alquiler'],
  image_alt_es = null
where slug = 'playa-potrero-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Las Catalinas es un pueblo de playa sin carros, de estilo mediterráneo, construido en las colinas sobre Playa Danta, con callecitas empedradas, plazas, un puñado de restaurantes y 40 km de senderos para caminar y andar en bicicleta de montaña en el bosque seco tropical que lo rodea. Sus bahías calmas son buenas para nadar, hacer kayak y paddleboard.

Los huéspedes llegan en shuttle y dejan los vehículos en la entrada, así que un traslado privado es la forma natural de entrar.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia calcula 1 hora 15 minutos vía Belén, Huacas, Flamingo y Potrero, asfaltado todo el camino. Tu chofer te deja en la entrada del pueblo, donde el equipo de Las Catalinas te recibe con carritos para el equipaje o un carrito de golf hasta tu casa u hotel. Flamingo queda a 15 minutos y Tamarindo a unos 40.$es$,
  tips_md_es = $es$- Reserva una caminata o un paseo en bici al amanecer por los senderos; las tardes son calientes y secas.
- Playa Danta es la playa para nadar; Playa Dantita, a una corta caminata hacia el norte, es más tranquila.
- Los restaurantes del pueblo son pocos; Potrero y Flamingo suman más opciones a diez minutos.
- Como el pueblo no permite carros, planea los paseos de un día con chofer en lugar de un carro de alquiler.$es$,
  best_for_es = array['Pueblo sin carros','Senderos','Hoteles boutique'],
  image_alt_es = null
where slug = 'las-catalinas-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Playa Grande es la playa de surf amplia y sin multitudes al otro lado del estero de Tamarindo, parte del Parque Nacional Marino Las Baulas, uno de los sitios de anidación de tortuga baula más importantes del Pacífico. El pueblo es tranquilo, con unos pocos hoteles, campamentos de surf y restaurantes dispersos bajo los árboles.

Es la gemela calmada de Tamarindo: las mismas olas, sin gentío, y los restaurantes de Tamarindo a dos minutos en bote.$es$,
  arrival_md_es = $es$Aunque se ve desde Tamarindo, a Playa Grande se llega por carretera rodeando el estero: aproximadamente 1 hora 10 minutos desde el aeropuerto de Liberia vía Belén, Huacas y Matapalo, asfaltado salvo algunas calles del pueblo. Desde Tamarindo en carro son 30 minutos, o dos minutos en bote por el estero si vas a pie. Tu chofer te lleva hasta la puerta de tu hotel o casa.$es$,
  tips_md_es = $es$- Los tours de anidación de tortugas se hacen de octubre a marzo por la noche con guías certificados; resérvalos a través de tu hotel.
- Las luces en la playa están restringidas de noche para proteger a las tortugas; trae una linterna de cabeza con luz roja.
- El oleaje aquí es fuerte; los principiantes deben quedarse en el extremo sur, cerca del estero.
- El pueblo tiene lo básico en víveres; los supermercados grandes están en Huacas y Tamarindo.$es$,
  best_for_es = array['Surf','Anidación de tortugas','Tranquilidad'],
  image_alt_es = null
where slug = 'playa-grande-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$La Península de Papagayo es el enclave de lujo de Guanacaste: el Four Seasons, el Andaz, el Planet Hollywood y las residencias privadas del Golfo de Papagayo comparten una península de ensenadas protegidas, mar calmo y una marina. Kayak, snorkel, vela y golf están todos ahí mismo.

Su mayor ventaja práctica es la distancia: es la zona de resorts más cercana al aeropuerto de Liberia, tan cerca que puedes estar en la playa menos de una hora después de aterrizar.$es$,
  arrival_md_es = $es$Del aeropuerto de Liberia a los resorts de Papagayo son 30 a 35 minutos por excelentes carreteras asfaltadas: la Ruta 1 hacia el noroeste y luego el desvío de Guardia hacia la costa y la entrada con portón de la península. Los choferes están preregistrados en la caseta de seguridad y te llevan directo al lobby de tu resort. Playas del Coco queda a 15 minutos para restaurantes y compras.$es$,
  tips_md_es = $es$- Los resorts lo tienen todo, pero a precios altos; Playas del Coco tiene buenos restaurantes a un corto viaje.
- Reserva los paseos en bote desde la Marina Papagayo por la mañana; la bahía está más calma antes del mediodía.
- En la caseta de seguridad piden el nombre del resort y la reservación, así que ten tu confirmación a mano.
- Los paseos de un día al volcán Rincón de la Vieja son 1.5 horas por trayecto; sal temprano.$es$,
  best_for_es = array['Resorts de lujo','Bahías tranquilas','El más cercano a LIR'],
  image_alt_es = null
where slug = 'papagayo-peninsula-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Playas del Coco es el pueblo animado y sin pretensiones del norte de la Costa Dorada, con una bahía larga y calma, una calle principal llena de restaurantes, bares y tiendas, y el punto de salida del buceo de Guanacaste hacia las Islas Catalinas y las Islas Murciélago. Hermosa y Ocotal quedan a cinco minutos si buscas arena más tranquila.

Es el favorito de buceadores, extranjeros residentes y viajeros que quieren un pueblo de verdad con servicios, cerca del aeropuerto de Liberia.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia el viaje es de solo 25 a 30 minutos por carretera asfaltada vía la Ruta 1 y el desvío de Sardinal. Tamarindo queda a una hora hacia el sur y Papagayo a 15 minutos hacia el norte. Tu chofer te deja en tu hotel, condominio o casa, incluidos los desarrollos en la cresta rumbo a Ocotal.$es$,
  tips_md_es = $es$- Los botes de buceo salen alrededor de las 7:30 am; reserva la noche anterior con tu operador.
- La playa del pueblo sirve para un chapuzón, pero Playa Hermosa y Ocotal son más bonitas y tranquilas.
- Coco tiene la mejor variedad de restaurantes de la región y un supermercado grande si cocinas por tu cuenta.
- Los domingos por la tarde se llena de familias locales; entre semana está relajado.$es$,
  best_for_es = array['Buceo','Restaurantes','Buen precio'],
  image_alt_es = null
where slug = 'playas-del-coco-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Playa Hermosa, la de Guanacaste, es una bahía curva, calma y de arena gris al norte de Playas del Coco, con hoteles y alquileres retirados bajo los árboles y una de las aguas más tranquilas para nadar de toda la costa. Es tranquila, segura para los niños y conocida por sus atardeceres y sus restaurantes frente al mar.

No la confundas con la Playa Hermosa cerca de Jacó, una playa de oleaje fuerte en el Pacífico Central.$es$,
  arrival_md_es = $es$Del aeropuerto de Liberia a Playa Hermosa son unos 30 minutos por la Ruta 1 y el camino de Sardinal, y luego hacia el norte pasando Coco, todo asfaltado. Papagayo queda a 10 minutos y Tamarindo a una hora. Los alquileres aquí están repartidos en dos caminos de acceso; dale al chofer el nombre de la propiedad y te lleva hasta la puerta.$es$,
  tips_md_es = $es$- La bahía está lo bastante calma para hacer paddleboard y kayak casi todos los días.
- Los restaurantes sobre la arena sirven la cena al atardecer; reserva las mesas de adelante en temporada alta.
- Supermercados, cajeros y farmacias están en Playas del Coco, a cinco minutos.
- El alquiler de equipo para deportes acuáticos está en el extremo sur de la playa.$es$,
  best_for_es = array['Nadar','Parejas','Atardeceres'],
  image_alt_es = null
where slug = 'playa-hermosa-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Nosara, y en particular la zona de Playa Guiones, es la capital del bienestar en Costa Rica: una playa de surf de siete kilómetros con olas constantes y aptas para principiantes, estudios de yoga y retiros en la selva de atrás, y una comunidad de construcciones bajas sin nada edificado sobre la arena. La cercana Playa Pelada es el lugar del atardecer y Ostional, hacia el norte, recibe las arribadas masivas de tortugas marinas.

El ambiente es sano, descalzo y sin prisa. Los caminos son de tierra a propósito, y justamente por eso los visitantes reservan chofer.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia el viaje toma entre 2 y 2.5 horas: asfaltado por Santa Cruz y Nicoya, y luego el último tramo hacia la costa donde el camino se vuelve de lastre. Nuestros choferes hacen esta ruta cada semana y conocen las líneas más suaves y los atajos por las callecitas de arena de Guiones. Desde Tamarindo calcula 2 horas en temporada seca. Te dejamos en la puerta de tu hotel, retiro o casa de alquiler.$es$,
  tips_md_es = $es$- El mejor surf para principiantes está en Playa Guiones con marea media; hay clases por todos lados.
- Guiones no tiene comercios en la playa; los restaurantes y los estudios están en los caminos de tierra de atrás.
- El polvo es constante en temporada seca y el barro en temporada verde; trae calzado adecuado.
- Las arribadas de tortugas en Ostional ocurren unas pocas noches al mes alrededor de la luna nueva; pregunta en tu hotel.$es$,
  best_for_es = array['Yoga','Surf','Bienestar'],
  image_alt_es = null
where slug = 'nosara-playa-guiones-area';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Sámara es un pueblo relajado sobre una bahía amplia protegida por un arrecife, cuya agua calma la convierte en una de las playas más seguras para nadar en Guanacaste. Con palmeras, caminable y sin prisa, atrae a familias, estudiantes de idiomas y viajeros de larga estadía. Playa Carrillo, diez minutos al sur, es una media luna de postal de arena blanca con casi nada construido.

Es el pueblo de playa para quienes encontraron Tamarindo demasiado agitado.$es$,
  arrival_md_es = $es$Del aeropuerto de Liberia a Sámara son unas 2 horas por carretera asfaltada pasando por Santa Cruz y Nicoya; Carrillo suma diez minutos. Desde Nosara son de 45 minutos a una hora, en parte por lastre. Tu chofer te lleva hasta la puerta de tu hotel o casa en Sámara o a lo largo del camino a Carrillo.$es$,
  tips_md_es = $es$- Nada en cualquier parte de la bahía; el arrecife mantiene las olas pequeñas todo el año.
- Playa Carrillo no tiene vendedores ni sombra, así que lleva agua y una sombrilla.
- La feria del agricultor de Sámara los sábados vale la visita por la fruta y el pan.
- Ve en kayak a Isla Chora, en el extremo sur de la bahía, para hacer snorkel.$es$,
  best_for_es = array['Mar calmo para nadar','Familias','Pueblo relajado'],
  image_alt_es = null
where slug = 'samara-playa-carrillo-guanacaste';

-- ---------- Tier 3: hub-linked ----------

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Playa Avellanas es una playa de surf larga y salvaje 20 minutos al sur de Tamarindo, conocida por el restaurante Lola's frente al mar, su arena blanca con manglar de fondo y olas constantes para todos los niveles, desde el estero hasta los reef breaks. Hay poco desarrollo: unos cuantos hoteles boutique, campamentos de surf y villas escondidas entre los árboles.

Es ideal para surfistas y parejas que quieren tener a mano las comodidades de Tamarindo pero silencio por la noche.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia calcula 1 hora 20 minutos: asfaltado hasta Villarreal, cerca de Tamarindo, y luego un camino de lastre hacia el sur atravesando Hacienda Pinilla. El camino se pone feo en temporada verde; nuestros vehículos lo manejan sin problema. Tamarindo queda a 20 o 25 minutos.$es$,
  tips_md_es = $es$- Lola's es la institución de la playa; llega antes del mediodía para conseguir mesa en la arena.
- No hay tiendas en la playa; compra lo que necesites en Tamarindo o Villarreal.
- El surf aquí es mejor con marea media a alta por la mañana.
- Playa Negra, más al sur, tiene un famoso reef break para surfistas con experiencia.$es$,
  best_for_es = array['Surf','Tranquilidad','Paseos de un día'],
  image_alt_es = null
where slug = 'playa-avellanas-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Hacienda Pinilla es una comunidad de resort cerrada de 4,500 acres al sur de Tamarindo, con un campo de golf de 18 hoyos, club de playa, centro ecuestre, villas privadas y el JW Marriott Guanacaste Resort en su propio tramo de Playa Mansita. Muchos kilómetros de caminos asfaltados y senderos serpentean por el bosque seco hasta tres playas.

Atrae a golfistas, familias que alquilan villas y huéspedes que buscan un resort seguro y autosuficiente con los restaurantes de Tamarindo a 15 minutos.$es$,
  arrival_md_es = $es$Del aeropuerto de Liberia a Hacienda Pinilla se hace aproximadamente 1 hora 10 minutos por la Ruta 21, Belén y Villarreal hasta el portón principal, todo asfaltado. Los choferes se registran en el portón y siguen hasta tu villa o el lobby del JW Marriott. Tamarindo queda a 15 minutos.$es$,
  tips_md_es = $es$- Si te hospedas en una villa, envíale al chofer con anticipación el nombre autorizado para el portón.
- El club de playa y el campo de golf están abiertos a quienes alquilan villas con un pase del resort.
- Playa Avellanas, 10 minutos al sur dentro de los terrenos de la hacienda, es la playa de surf.
- Haz las compras en Tamarindo o Villarreal de camino; adentro no hay supermercado.$es$,
  best_for_es = array['Golf','Villas','JW Marriott'],
  image_alt_es = null
where slug = 'hacienda-pinilla-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$El JW Marriott Guanacaste Resort & Spa está sobre Playa Mansita, dentro de Hacienda Pinilla, con una de las piscinas más grandes de Centroamérica, un spa frente al mar, varios restaurantes y acceso directo al campo de golf, los senderos y las playas de la hacienda. Es el resort de lujo más conocido al sur de Tamarindo.

La mayoría de los huéspedes llega en traslado privado desde el aeropuerto de Liberia y usa el resort como base para paseos de un día a Tamarindo, Avellanas y Rincón de la Vieja.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia el traslado toma aproximadamente 1 hora 15 minutos por carretera asfaltada vía Belén y Villarreal, entrando a Hacienda Pinilla por el portón principal y siguiendo 10 minutos hasta el lobby del resort. Tamarindo queda a 15 o 20 minutos.$es$,
  tips_md_es = $es$- Pídele al chofer que pare en el supermercado de Villarreal si quieres snacks y bebidas en la habitación.
- Los restaurantes del resort requieren reservación en temporada alta; Tamarindo tiene más variedad.
- El resort es un punto de recogida habitual para tours; programa los paseos de un día antes de reservar para evitar huecos.
- El atardecer en el bar frente al mar es el ritual de cada día.$es$,
  best_for_es = array['Estadía en resort','Familias','Frente al mar'],
  image_alt_es = null
where slug = 'jw-marriott-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$El RIU Guanacaste y el vecino RIU Palace Costa Rica son los dos grandes resorts todo incluido de Playa Matapalo, al noroeste de Liberia y al sur del Golfo de Papagayo. Entre los dos ofrecen piscinas, bufés, entretenimiento y una playa amplia y sin multitudes; la mayoría de los huéspedes nunca sale, pero Playas del Coco y Liberia quedan cerca para paseos de un día.

Las llegadas se concentran alrededor de los vuelos de la tarde a LIR, y por eso un traslado privado reservado con anticipación es la forma sin estrés de llegar al lobby.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia el viaje es de unos 40 minutos: la Ruta 1 hacia Guardia y luego la carretera asfaltada al oeste hasta Matapalo. El chofer te lleva directo al lobby del RIU Guanacaste o del RIU Palace, según el que hayas reservado. Playas del Coco queda a 25 minutos.$es$,
  tips_md_es = $es$- Dinos en cuál de los dos hoteles RIU te hospedas; están uno al lado del otro pero tienen lobbies separados.
- Los resorts están solos en la playa, así que para ir a Coco o a Liberia necesitas chofer.
- Las filas de check-in son más largas entre las 3 y las 5 pm, cuando aterrizan los vuelos de Estados Unidos.
- Muchos huéspedes agregan un paseo de un día a Rincón de la Vieja o una escapada a Tamarindo para ver el atardecer.$es$,
  best_for_es = array['Todo incluido','Playa Matapalo','Grupos'],
  image_alt_es = null
where slug = 'riu-guanacaste-hotel-riu-palace-hotel-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Punta Islita es un resort remoto en la ladera y un pueblito en la costa sur de Nicoya, al sur de Sámara y Carrillo, conocido por su piscina infinita en lo alto del acantilado, el museo de arte al aire libre del pueblo, un programa de liberación de lapas y una playa privada donde casi no hay nadie.

Es una de las estadías más apartadas de Guanacaste, y eso convierte el traslado en parte de la experiencia.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia calcula 2.5 a 3 horas: asfaltado por Nicoya y Sámara, y luego unos 40 minutos de lastre y cruces de río por la costa pasando Carrillo. Nuestros choferes conocen el camino en cualquier época del año. Desde Sámara son unos 45 minutos.$es$,
  tips_md_es = $es$- Lleva efectivo para el pueblo; las tarjetas solo se aceptan en el hotel.
- Pide el shuttle del hotel al club de playa; la bajada a pie es empinada.
- El camino puede ponerse lento después de lluvias fuertes en setiembre y octubre.
- Carrillo, 40 minutos al norte, es el pueblo más cercano con restaurantes fuera del hotel.$es$,
  best_for_es = array['Resort apartado','Luna de miel','Pueblo de arte'],
  image_alt_es = null
where slug = 'punta-islita-hotel-beach';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Brasilito es el pueblo pesquero activo entre Flamingo y Playa Conchal, con una plaza sobre la arena, sodas económicas y hoteles pequeños, y el sendero a pie hacia el agua turquesa de Conchal que arranca en el extremo sur de su playa. Es la base económica y con sabor local en este tramo de la costa.$es$,
  arrival_md_es = $es$Del aeropuerto de Liberia a Brasilito se hace aproximadamente 1 hora por la Ruta 21, Belén y Huacas por carretera asfaltada. Flamingo queda 5 minutos al norte y Tamarindo 20 minutos al sur.$es$,
  tips_md_es = $es$- Camina hasta Playa Conchal en 10 minutos por la playa rumbo al sur.
- Las sodas del pueblo sirven el pescado fresco más barato de la costa de Flamingo.
- La playa de Brasilito es calma y la usan las familias locales; Conchal es más bonita para nadar.
- Los supermercados están en Huacas y Flamingo.$es$,
  best_for_es = array['Pueblo local','Hospedaje económico','Acceso a Conchal'],
  image_alt_es = null
where slug = 'brasilito-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Playa Ocotal es una ensenada pequeña y protegida de arena oscura, cinco minutos al sur de Playas del Coco, con agua clara para hacer snorkel directamente desde la playa, un grupo de villas y condominios en la ladera y vistas hacia las puntas de Papagayo. Es tranquila y residencial; Coco pone los restaurantes y los servicios.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia calcula 35 minutos por la Ruta 1, el desvío de Sardinal y Playas del Coco, y luego la corta subida por la cresta hasta Ocotal, todo asfaltado. Las villas aquí están por calles empinadas; dale al chofer el nombre de la propiedad.$es$,
  tips_md_es = $es$- Haz snorkel en las rocas del extremo norte de la playa por la mañana, cuando el agua está más clara.
- Father Rooster, sobre la arena, es el bar de playa clásico para el atardecer.
- Supermercados y cajeros están en Coco, a cinco minutos.
- Los operadores de buceo de Coco te recogen en Ocotal si lo pides.$es$,
  best_for_es = array['Snorkel','Ensenada tranquila','Cerca de Coco'],
  image_alt_es = null
where slug = 'ocotal-guanacaste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Rincón de la Vieja es el volcán activo y parque nacional de Guanacaste, una hora al noreste de Liberia, con pailas de barro hirviente, fumarolas, cataratas y senderos de bosque seco. Las haciendas y lodges de los alrededores ofrecen aguas termales, cabalgatas, canopy, tubing y canyoning, lo que lo convierte en el paseo de aventura de un día o de una noche desde las playas.$es$,
  arrival_md_es = $es$Del aeropuerto de Liberia a los lodges son de 1 a 1.5 horas: asfaltado hasta los desvíos de Curubandé o Cañas Dulces, y luego lastre en el tramo final hasta cada hacienda. Desde Tamarindo o Flamingo calcula 2 a 2.5 horas; desde Papagayo, alrededor de 1.5.$es$,
  tips_md_es = $es$- El sector Las Pailas del parque nacional cierra los lunes; el sector Santa María es más tranquilo.
- Empieza las caminatas temprano; los senderos están al descubierto y hace calor al mediodía.
- La mayoría de los lodges incluye baños de barro y aguas termales en un pase de día si no te quedas a dormir.
- Los zapatos resistentes son indispensables; el suelo volcánico es áspero.$es$,
  best_for_es = array['Caminatas al volcán','Aguas termales','Lodges de aventura'],
  image_alt_es = null
where slug = 'rincon-de-la-vieja-national-park';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Río Celeste, dentro del Parque Nacional Volcán Tenorio, es el famoso río y catarata de color celeste que se forma por una reacción mineral donde se unen dos quebradas. El sendero hasta la catarata y los "teñideros" toma de 2 a 3 horas ida y vuelta a través del bosque nuboso, y el cercano pueblo de Bijagua tiene un puñado de lodges excelentes y fincas para ver perezosos.

Es una parada popular entre Guanacaste y La Fortuna, o una escapada de una noche desde las playas.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia el viaje es de 1.5 a 2 horas: la Ruta 1 hacia el sur hasta Cañas o hacia el norte hasta Upala, y luego la carretera asfaltada que sube a Bijagua y a la entrada del parque. Desde La Fortuna calcula 1.5 horas; desde Tamarindo, unas 2.5.$es$,
  tips_md_es = $es$- El parque limita la cantidad de visitantes por día y cierra la entrada al sendero a las 2 pm; llega por la mañana.
- No se permite nadar en el río dentro del parque.
- El color celeste es más intenso en temporada seca; una lluvia fuerte puede poner el río color café por un día.
- Los tours de perezosos en Bijagua son un buen complemento para familias.$es$,
  best_for_es = array['Río celeste','Caminata a la catarata','Lodges de naturaleza'],
  image_alt_es = null
where slug = 'rio-celeste';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$San José es la capital de Costa Rica y el centro del Valle Central: museos del oro y del jade, el Teatro Nacional, el Mercado Central y una escena gastronómica en crecimiento en Barrio Escalante. Para la mayoría de los visitantes es una parada de una noche a la entrada o a la salida del país, cerca del aeropuerto SJO y de las carreteras hacia el norte a La Fortuna y hacia el oeste al Pacífico.$es$,
  arrival_md_es = $es$Desde el aeropuerto SJO los hoteles del centro están a 20 a 40 minutos según el tráfico. Desde el aeropuerto de Liberia o las playas de Guanacaste calcula 4 a 5 horas por la Ruta 1 y la Ruta 27; desde La Fortuna, unas 3 horas; desde Manuel Antonio, alrededor de 3. Tu chofer te lleva hasta la puerta del hotel.$es$,
  tips_md_es = $es$- Evita entrar o salir de la ciudad entre las 6 y las 9 am o entre las 4 y las 7 pm; el tráfico duplica el tiempo.
- Barrio Escalante y Barrio Amón son los barrios agradables para hospedarse y comer.
- Como en cualquier capital, sé discreto con los objetos de valor en el centro después de oscurecer.
- Una recogida temprana desde el centro hacia el aeropuerto debe salir al menos 3 horas antes de un vuelo internacional.$es$,
  best_for_es = array['Escala en la ciudad','Museos','Noche antes del vuelo'],
  image_alt_es = null
where slug = 'san-jose-downtown';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Jacó es el pueblo de playa más cercano a San José, una playa de surf larga con una franja animada de restaurantes, bares, escuelas de surf y torres de condominios, y el punto de partida para la pesca desde la marina Los Sueños y las lapas rojas del Parque Nacional Carara. Es la playa de fiesta del Pacífico Central y una primera o última noche conveniente cerca de SJO.$es$,
  arrival_md_es = $es$Desde el aeropuerto SJO el viaje es de aproximadamente 1.5 horas por la autopista de peaje Ruta 27 y la Costanera. Desde Manuel Antonio calcula 1.5 horas hacia el norte; desde el aeropuerto de Liberia o Guanacaste, 3.5 a 4 horas. El chofer te deja en tu hotel o condominio.$es$,
  tips_md_es = $es$- Playa Hermosa de Jacó, 10 minutos al sur, tiene el surf serio; la playa de Jacó es para principiantes.
- Busca los cocodrilos desde el puente del Tárcoles a la entrada; tu chofer puede parar.
- El Parque Nacional Carara, 20 minutos al norte, es el lugar más fácil para ver lapas rojas.
- Las noches de fin de semana son ruidosas en la franja principal; reserva unas cuadras atrás si quieres dormir.$es$,
  best_for_es = array['Surf','Vida nocturna','La playa más cercana a SJO'],
  image_alt_es = null
where slug = 'jaco';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Santa Teresa es el pueblo de surf y yoga en la punta sur de la Península de Nicoya: un solo camino polvoriento a lo largo de una playa larga de olas potentes, hoteles boutique, cafés y bares de atardecer, con Malpaís y Montezuma cerca. Es remoto a propósito y se ha convertido en uno de los destinos de playa más de moda de Costa Rica.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia calcula 4 a 4.5 horas por carretera pasando por Nicoya, Jicaral y Cóbano, con lastre en el tramo final. Desde el aeropuerto SJO la opción más rápida combina el viaje a Puntarenas con el ferry a Paquera, unas 4.5 a 5 horas en total; tu chofer se encarga de los tiquetes del ferry. Desde Tamarindo o Nosara planea 3.5 a 4 horas.$es$,
  tips_md_es = $es$- Los cuadraciclos y las bicis son la forma de moverse por el camino; pregunta en tu hotel por alquileres.
- El oleaje es fuerte; los principiantes deben tomar clases en el extremo más calmo de Playa Carmen.
- Lleva efectivo; los cajeros se quedan sin dinero los fines de semana en temporada alta.
- La reserva Cabo Blanco, en la punta de la península, es una caminata preciosa de medio día.$es$,
  best_for_es = array['Surf','Hoteles boutique','Remoto'],
  image_alt_es = null
where slug = 'santa-teresa-nicoya-peninsula';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Montezuma es el pueblo bohemio del lado del Golfo de Nicoya en la punta de la península, famoso por su catarata de tres niveles, sus playas con pozas de marea, los monos congo en los árboles del pueblo y una mezcla relajada de mochileros, artistas y familias. Las excursiones son la reserva Cabo Blanco y los paseos de snorkel a Isla Tortuga.$es$,
  arrival_md_es = $es$Desde el aeropuerto de Liberia el viaje toma unas 4 horas vía Nicoya, Jicaral y Cóbano. Desde SJO, la ruta de carretera más ferry por Puntarenas y Paquera toma alrededor de 4.5 horas, ferry incluido. Santa Teresa queda a 40 minutos cruzando el cerro.$es$,
  tips_md_es = $es$- El sendero a la catarata empieza justo al sur del pueblo; ve temprano y usa zapatos con buen agarre.
- Los tours en bote a Isla Tortuga salen de la playa por la mañana.
- El pueblo es diminuto; la mayoría de los hoteles queda a pie desde el punto de bajada.
- Los monos congo empiezan al amanecer; si tienes el sueño ligero, lleva tapones para los oídos.$es$,
  best_for_es = array['Cataratas','Pueblo bohemio','Viaje económico'],
  image_alt_es = null
where slug = 'montezuma-nicoya-peninsula';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Uvita es el pueblito en el corazón de la Costa Ballena, conocido por el Parque Nacional Marino Ballena y su banco de arena en forma de cola de ballena, la temporada de ballenas jorobadas de julio a octubre y de diciembre a marzo, cataratas en las montañas y un litoral verde y sin multitudes al sur de Dominical. El hospedaje va desde lodges en la selva hasta villas en la ladera con vista al mar.$es$,
  arrival_md_es = $es$Desde el aeropuerto SJO calcula 3.5 a 4 horas por la Ruta 27 y la Costanera pasando por Jacó y Quepos. Desde Manuel Antonio son aproximadamente 1 hora 15 minutos hacia el sur por carretera asfaltada. Desde el aeropuerto de Liberia o Guanacaste planea 6 horas o más.$es$,
  tips_md_es = $es$- Visita la cola de ballena con marea baja; revisa las tablas de mareas antes de ir.
- Los tours en bote para ver ballenas salen por la mañana desde las entradas de playa del parque.
- Las Cataratas Nauyaca, 30 minutos al norte, valen medio día.
- Uvita tiene supermercado y cajeros; las villas en las montañas necesitan carro o chofer para salir a cenar.$es$,
  best_for_es = array['Avistamiento de ballenas','Parque Marino Ballena','Naturaleza'],
  image_alt_es = null
where slug = 'uvita';

update public.destinations_ruta_pacifico set
  intro_md_es = $es$Dominical es un pueblo de surf de una sola calle donde la Costanera se encuentra con el río Barú, con olas fuertes, una playa llena de vendedores y bares de atardecer, y montañas verdes detrás que llevan a las Cataratas Nauyaca y al pueblo de montaña de San Isidro. Es más pequeño y rústico que Manuel Antonio, a 45 minutos hacia el norte.$es$,
  arrival_md_es = $es$Desde el aeropuerto SJO el viaje es de unas 3.5 horas pasando por Jacó y Quepos, todo asfaltado. Desde Manuel Antonio calcula de 45 minutos a una hora. Desde el aeropuerto de Liberia o Guanacaste planea 5.5 a 6 horas.$es$,
  tips_md_es = $es$- Las corrientes de resaca aquí son fuertes; nada solo donde haya salvavidas o en la cercana Dominicalito.
- A las Cataratas Nauyaca se llega a pie, en camión o a caballo desde la carretera.
- Los viernes por la tarde la feria del pueblo vende frutas, verduras y artesanía.
- Playa Ventanas, al sur rumbo a Uvita, tiene cuevas marinas para explorar con marea baja.$es$,
  best_for_es = array['Surf','Cataratas','Ambiente de pueblo'],
  image_alt_es = null
where slug = 'dominical-beach-town';

-- ---------- Tier 4: stubs with no English copy in the seed ----------
-- intro_md / arrival_md / tips_md are '' and best_for is '{}' in the seed,
-- so every Spanish twin is NULL (the site falls back to English).

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'alajuela-city';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'bajos-del-toro-cloud-forest';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'bijagua-origins-lodge';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'cahuita';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'esterillos-este-oeste-beach';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'guapiles';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'herradura-los-suenos';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'la-pavona-tortuguero';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'la-paz-waterfall-gardens';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'los-chiles-nicaragua-border';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'malpais-nicoya-peninsula';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'manzanillo';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'ojochal';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'penas-blancas-nicaragua-border';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'puerto-caldera';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'puerto-jimenez-osa-peninsula';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'puerto-viejo-caribbean-coast';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'punta-leona-resort';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'puntarenas';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'rio-perdido';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'san-gerardo-de-dota-cloud-forest';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'sarapiqui-heredia';

update public.destinations_ruta_pacifico set
  intro_md_es = null, arrival_md_es = null, tips_md_es = null, best_for_es = null, image_alt_es = null
where slug = 'sierpe';

-- ============================================================
-- Rows updated: 54 (31 translated, 23 tier-4 stubs set to NULL).
-- Matches the 54 destination rows in destinations_seed.sql.
-- ============================================================
