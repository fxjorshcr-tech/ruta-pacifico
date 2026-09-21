#!/usr/bin/env python3
"""
Generates supabase/blog_seed_04.sql: one "Liberia Airport to <hotel>" article
per major Guanacaste resort, in English with its Spanish twin.

    python3 supabase/gen_hotel_posts.py > supabase/blog_seed_04.sql

Every paragraph below is written by hand for its hotel. The only shared
parts are the two data tables (quick facts, options) and the booking line,
because those carry numbers, not prose. Fares are the live per-vehicle
prices from the routes table on 21 Sep 2026; update HOTELS and regenerate
when a fare changes.
"""

import json

COVER_DIR = "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/blogs-hotels"
PILLAR = "/blog/best-hotels-guanacaste-by-zone-liberia-airport-transfer"

HOTELS = [
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-four-seasons-papagayo",
        photo="hotel-four-seasons-papagayo.webp",
        short="Four Seasons Papagayo",
        full="Four Seasons Resort Costa Rica at Peninsula Papagayo",
        short_es="Four Seasons Papagayo",
        route="lir-liberia-int-airport-to-papagayo-peninsula-guanacaste",
        fares=(105, 130, 170),
        time="30–40 min", km="30 km (19 mi)",
        gated=True,
        cover_alt="Private shuttle arriving at a luxury beach resort on Peninsula Papagayo, Guanacaste",
        cover_alt_es="Shuttle privado llegando a un resort de lujo en Península Papagayo, Guanacaste",
        tags=["four seasons papagayo shuttle", "liberia airport to four seasons", "four seasons costa rica transfer", "peninsula papagayo transportation", "LIR to four seasons"],
        title_en="Getting to the Four Seasons Papagayo from Liberia Airport: 35 Minutes, One Gate, No Town",
        title_es="Cómo llegar al Four Seasons Papagayo desde el Aeropuerto de Liberia: 35 minutos, un portón y ningún pueblo",
        excerpt_en="The Four Seasons is the closest luxury resort to LIR in Costa Rica, but it sits behind a security gate with no town for miles. Drive time, the $105 fixed transfer, what the peninsula guard needs from your driver, and where to eat if you leave the resort.",
        excerpt_es="El Four Seasons es el resort de lujo más cercano a LIR en Costa Rica, pero está detrás de un portón de seguridad sin pueblo en kilómetros. Tiempo de viaje, el traslado fijo de $105, qué pide el guarda de la península a tu chofer y dónde comer si sales del resort.",
        intro_en="A lot of people who book the Four Seasons assume the transfer from Liberia will be long, because everything else in Costa Rica seems to be. It is not. The resort is about 35 minutes from the airport on a paved road, and the only thing that can slow you down is the security gate at the entrance to the peninsula, which will not let a vehicle through unless the driver has been registered with the hotel beforehand. We take guests there most weeks, so this is written from the driver's seat.",
        intro_es="Mucha gente que reserva el Four Seasons da por hecho que el traslado desde Liberia va a ser largo, porque todo lo demás en Costa Rica parece serlo. No es el caso. El resort está a unos 35 minutos del aeropuerto por carretera asfaltada, y lo único que puede atrasarte es el portón de seguridad a la entrada de la península, que no deja pasar un vehículo si el chofer no fue registrado antes con el hotel. Llevamos huéspedes allí casi todas las semanas, así que esto está escrito desde el asiento del chofer.",
        where_en="The Four Seasons sits at the neck of Peninsula Papagayo, a private 1,400-acre enclave on the north side of Culebra Bay, about 30 km from Liberia Airport. Of all the luxury resorts in the country, it is the one closest to an international airport. The whole drive is on pavement: you take Route 21 west from the airport to Guardia, turn onto the road toward Playas del Coco, and branch off toward Playa Panamá and the peninsula gate. The property has two beaches, Playa Virador on the bay and Playa Blanca on the open Pacific, plus an Arnold Palmer golf course and the hilly, forested setting the peninsula is known for.",
        where_es="El Four Seasons está en el cuello de Península Papagayo, un enclave privado de 570 hectáreas en el lado norte de Bahía Culebra, a unos 30 km del Aeropuerto de Liberia. De todos los resorts de lujo del país, es el que queda más cerca de un aeropuerto internacional. Todo el trayecto es asfaltado: se toma la Ruta 21 hacia el oeste desde el aeropuerto hasta Guardia, se entra a la carretera hacia Playas del Coco y se desvía hacia Playa Panamá y el portón de la península. La propiedad tiene dos playas, Playa Virador del lado de la bahía y Playa Blanca del lado del Pacífico abierto, además de un campo de golf de Arnold Palmer y el entorno de colinas con bosque por el que se conoce la península.",
        gate_en="Peninsula Papagayo has a manned checkpoint at its entrance, and the guards there follow the rules closely. They expect the hotel to have sent them the driver's full name, his cédula number, and the make, plate and colour of the vehicle before you show up. If that information is not on file, the vehicle waits at the barrier while someone phones the front desk, and depending on the hour that can take a while. When you book with us, we send those details to the Four Seasons as soon as the reservation is confirmed, so by the time you land the gate already has your driver on its list.",
        gate_es="Península Papagayo tiene un puesto de control con guarda en la entrada, y ahí se aplican las reglas al pie de la letra. Esperan que el hotel les haya enviado el nombre completo del chofer, su número de cédula y la marca, placa y color del vehículo antes de que llegues. Si esa información no está registrada, el vehículo espera en la barrera mientras alguien llama a recepción, y según la hora eso puede tardar. Cuando reservas con nosotros, enviamos esos datos al Four Seasons apenas se confirma la reserva, así que cuando aterrizas el portón ya tiene a tu chofer en la lista.",
        around_en="There is no town on Peninsula Papagayo. Outside the resort you have the Marina Papagayo, which has a couple of restaurants, and a members' beach club. The nearest place with a street to walk along is Playas del Coco, 20 to 25 minutes away by car, where you will find restaurants, bars, a supermarket and a public beach. Most Four Seasons guests eat at the resort every night and are happy doing so. If you want a change of scene, a transfer to Coco or to El Mangroove, over on the mainland side of the gulf, is the usual choice.",
        around_es="En Península Papagayo no hay pueblo. Fuera del resort tienes la Marina Papagayo, con un par de restaurantes, y un club de playa para miembros. El lugar más cercano con una calle por donde caminar es Playas del Coco, a 20 o 25 minutos en carro, donde hay restaurantes, bares, supermercado y playa pública. La mayoría de huéspedes del Four Seasons cena en el resort todas las noches y está contenta así. Si quieres un cambio de aire, un traslado al Coco o a El Mangroove, del lado continental del golfo, es lo habitual.",
        tips_en=[
            "Since there is no shop on the peninsula, it makes sense to stop for groceries on the way in. The supermarket in Sardinal and the Automercado in Playas del Coco are both close to the route, and the stop costs nothing on a private transfer.",
            "Check-in is at 3 p.m. If you land late morning, you will arrive early. The resort holds luggage and most people spend the wait at the pool.",
            "Rincón de la Vieja and Tamarindo are each about an hour and a quarter away. Booking those day trips as private round trips is usually cheaper than what the concierge quotes.",
        ],
        tips_es=[
            "Como en la península no hay tienda, conviene parar a comprar víveres en el camino. El supermercado de Sardinal y el Automercado de Playas del Coco quedan cerca de la ruta, y la parada no cuesta nada en un traslado privado.",
            "El check-in es a las 3 p. m. Si aterrizas a media mañana, vas a llegar temprano. El resort guarda el equipaje y la mayoría pasa la espera en la piscina.",
            "Rincón de la Vieja y Tamarindo quedan a una hora y cuarto cada uno. Reservar esas excursiones como viajes privados de ida y vuelta suele salir más barato que lo que cotiza el concierge.",
        ],
        faqs_en=[
            ("How long is the drive from Liberia Airport to the Four Seasons Papagayo?", "Between 30 and 40 minutes on paved roads. The resort is about 30 km from LIR, which makes it the closest luxury resort to the airport in Costa Rica."),
            ("Does the Four Seasons Papagayo offer an airport shuttle?", "The resort arranges private car transfers through its concierge at a premium rate. Ruta Pacifico runs the same door-to-door private transfer, with flight tracking and gate registration included, for a fixed $105 per vehicle for up to 5 passengers."),
            ("Is there Uber at Liberia Airport to get to Papagayo?", "Not reliably. There are few Uber drivers in Guanacaste and they often cancel airport requests. An unregistered car will also be held at the Peninsula Papagayo gate. It is easier to pre-book a transfer whose driver details are sent to the resort in advance."),
            ("Can I go out to dinner outside the Four Seasons?", "Yes, but you need a car or a transfer. There is no town on the peninsula. Playas del Coco is 20 to 25 minutes away and has the nearest restaurants and bars."),
        ],
        faqs_es=[
            ("¿Cuánto dura el viaje del Aeropuerto de Liberia al Four Seasons Papagayo?", "Entre 30 y 40 minutos por carretera asfaltada. El resort está a unos 30 km de LIR, lo que lo convierte en el resort de lujo más cercano al aeropuerto en Costa Rica."),
            ("¿El Four Seasons Papagayo ofrece shuttle desde el aeropuerto?", "El resort organiza traslados privados a través de su concierge con tarifa premium. Ruta Pacifico hace el mismo traslado privado puerta a puerta, con seguimiento de vuelo y registro en el portón incluidos, por un precio fijo de $105 por vehículo para hasta 5 pasajeros."),
            ("¿Hay Uber en el Aeropuerto de Liberia para ir a Papagayo?", "No de forma confiable. Hay pocos choferes de Uber en Guanacaste y suelen cancelar las solicitudes del aeropuerto. Un carro no registrado además queda retenido en el portón de Península Papagayo. Es más fácil reservar un traslado cuyos datos del chofer se envíen al resort con anticipación."),
            ("¿Puedo salir a cenar fuera del Four Seasons?", "Sí, pero necesitas carro o traslado. No hay pueblo en la península. Playas del Coco está a 20 o 25 minutos y tiene los restaurantes y bares más cercanos."),
        ],
    ),
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-nekajui-ritz-carlton-reserve-papagayo",
        photo="hotel-nekajui-papagayo.webp",
        short="Nekajui, a Ritz-Carlton Reserve",
        full="Nekajui, a Ritz-Carlton Reserve (Peninsula Papagayo)",
        short_es="Nekajui, Ritz-Carlton Reserve",
        route="lir-liberia-int-airport-to-papagayo-peninsula-guanacaste",
        fares=(105, 130, 170),
        time="35–45 min", km="34 km (21 mi)",
        gated=True,
        cover_alt="Coastline of Peninsula Papagayo near Nekajui, a Ritz-Carlton Reserve, Guanacaste",
        cover_alt_es="Costa de Península Papagayo cerca de Nekajui, Ritz-Carlton Reserve, Guanacaste",
        tags=["nekajui shuttle", "liberia airport to nekajui", "ritz carlton reserve costa rica transfer", "nekajui papagayo transportation", "LIR to ritz carlton papagayo"],
        title_en="Nekajui, Ritz-Carlton Reserve: How to Get There from Liberia Airport (and Through Both Gates)",
        title_es="Nekajui, Ritz-Carlton Reserve: cómo llegar desde el Aeropuerto de Liberia (y pasar los dos portones)",
        excerpt_en="Costa Rica’s newest ultra-luxury resort is at the very tip of Peninsula Papagayo, behind two security gates. Real drive time from LIR, the $105 fixed transfer, pre-registering your driver, and why there is nothing else at the end of that road.",
        excerpt_es="El resort de ultralujo más nuevo de Costa Rica está en la punta misma de Península Papagayo, detrás de dos portones de seguridad. Tiempo real desde LIR, el traslado fijo de $105, cómo registrar a tu chofer y por qué no hay nada más al final de ese camino.",
        intro_en="Nekajui opened in 2025 and it took only a few months for it to become one of the hotels we get asked about most. The question is nearly always the same: how do you actually get there. The short answer is a drive of about 40 minutes from Liberia Airport, past the Four Seasons and along a ridge road to the end of the peninsula, with two checkpoints on the way that both want your driver's details ahead of time. The rest of this page goes through the route, the price and what to expect on arrival.",
        intro_es="Nekajui abrió en 2025 y en pocos meses se convirtió en uno de los hoteles por los que más nos preguntan. La pregunta casi siempre es la misma: cómo se llega realmente. La respuesta corta es un viaje de unos 40 minutos desde el Aeropuerto de Liberia, pasando el Four Seasons y por una carretera de cresta hasta el final de la península, con dos puestos de control en el camino que quieren los datos de tu chofer con anticipación. El resto de esta página repasa la ruta, el precio y qué esperar al llegar.",
        where_en="Nekajui is at the far end of Peninsula Papagayo, beyond the Four Seasons and the Andaz, on a headland above Playa Nacascolo. It is the most secluded of the three peninsula resorts and the newest luxury address in the country, with suites built into the treeline, a pool on the cliff edge and a funicular that takes you down to the beach. From Liberia Airport it is 34 km on paved road. You head west on Route 21 to Guardia, take the Coco road toward Playa Panamá, pass the peninsula gate, and then follow the resort road along the ridge until it ends at the hotel.",
        where_es="Nekajui está en el extremo de Península Papagayo, más allá del Four Seasons y el Andaz, en un promontorio sobre Playa Nacascolo. Es el más aislado de los tres resorts de la península y la dirección de lujo más nueva del país, con suites metidas entre los árboles, una piscina al borde del acantilado y un funicular que baja a la playa. Desde el Aeropuerto de Liberia son 34 km por asfalto. Se va hacia el oeste por la Ruta 21 hasta Guardia, se toma la carretera del Coco rumbo a Playa Panamá, se pasa el portón de la península y luego se sigue la carretera del resort por la cresta hasta que termina en el hotel.",
        gate_en="To reach Nekajui you go through the same Peninsula Papagayo checkpoint as the Four Seasons and then through a second gate that belongs to the resort itself. Both expect the driver's full name, cédula number and vehicle details to have been sent by the hotel in advance. We send them to Nekajui when you book, which means neither gate holds you up. If you arrive in a taxi that was not registered, you will spend some time at the first checkpoint while the guard calls reception and waits for an answer.",
        gate_es="Para llegar a Nekajui se pasa el mismo puesto de Península Papagayo que para el Four Seasons y después un segundo portón que es del propio resort. Ambos esperan que el hotel haya enviado de antemano el nombre completo del chofer, su número de cédula y los datos del vehículo. Nosotros los enviamos a Nekajui cuando reservas, lo que significa que ninguno de los dos portones te detiene. Si llegas en un taxi que no fue registrado, vas a pasar un rato en el primer puesto mientras el guarda llama a recepción y espera respuesta.",
        around_en="Nekajui is where the peninsula road ends, so there is even less around it than around the Four Seasons. You have the resort's own restaurants and beach club, and the Marina Papagayo about ten minutes back the way you came. Playas del Coco, the only real town in this part of the coast, is roughly half an hour away. People choose Nekajui to be left alone for a week, and the hotel is built for that. If you do want one dinner out, a transfer to Coco is easy to arrange.",
        around_es="Nekajui es donde termina la carretera de la península, así que hay aún menos alrededor que en el Four Seasons. Tienes los restaurantes y el club de playa del resort, y la Marina Papagayo a unos diez minutos de regreso por donde llegaste. Playas del Coco, el único pueblo de verdad en esta parte de la costa, queda a más o menos media hora. La gente elige Nekajui para que la dejen en paz una semana, y el hotel está hecho para eso. Si quieres una cena fuera, un traslado al Coco se organiza fácil.",
        tips_en=[
            "Nekajui is on the same route as the Four Seasons, so the private transfer costs the same fixed fare even though it is another ten minutes along the ridge.",
            "There is no shop anywhere on the peninsula. If you need groceries or a pharmacy, ask the driver to stop in Playas del Coco on the way; it adds a few minutes and costs nothing.",
            "Arriving after dark is not a problem. The peninsula road is paved and lit at the gate, and the resort has staff around the clock.",
        ],
        tips_es=[
            "Nekajui está en la misma ruta que el Four Seasons, así que el traslado privado cuesta la misma tarifa fija aunque sean diez minutos más por la cresta.",
            "No hay tienda en ninguna parte de la península. Si necesitas víveres o farmacia, pídele al chofer parar en Playas del Coco de camino; añade unos minutos y no cuesta nada.",
            "Llegar de noche no es problema. La carretera de la península es asfaltada e iluminada en el portón, y el resort tiene personal las 24 horas.",
        ],
        faqs_en=[
            ("How far is Nekajui from Liberia Airport?", "About 34 km, which is a private transfer of 35 to 45 minutes on paved roads. It sits at the far tip of Peninsula Papagayo, about ten minutes beyond the Four Seasons."),
            ("How much is a private transfer from LIR to Nekajui?", "Ruta Pacifico charges a fixed $105 per vehicle for 1 to 5 passengers, $130 for 6 to 9 and $170 for 10 to 12. That includes taxes, flight tracking, child seats and registering the driver at the Peninsula Papagayo gate."),
            ("Do I need to register my transfer with Nekajui before arrival?", "Yes. Both the Peninsula Papagayo checkpoint and the resort's own gate expect the driver's name, ID number and vehicle details ahead of time. Ruta Pacifico sends them to the resort when you book."),
            ("Is Nekajui near a town?", "No. The nearest town is Playas del Coco, about 30 minutes by car. The resort is designed to be self-contained, with its own restaurants and beach club."),
        ],
        faqs_es=[
            ("¿A qué distancia está Nekajui del Aeropuerto de Liberia?", "A unos 34 km, un traslado privado de 35 a 45 minutos por carretera asfaltada. Está en la punta más lejana de Península Papagayo, unos diez minutos más allá del Four Seasons."),
            ("¿Cuánto cuesta un traslado privado de LIR a Nekajui?", "Ruta Pacifico cobra una tarifa fija de $105 por vehículo para 1 a 5 pasajeros, $130 para 6 a 9 y $170 para 10 a 12. Incluye impuestos, seguimiento de vuelo, sillas para niños y el registro del chofer en el portón de Península Papagayo."),
            ("¿Tengo que registrar mi traslado con Nekajui antes de llegar?", "Sí. Tanto el puesto de Península Papagayo como el portón del propio resort esperan el nombre del chofer, su cédula y los datos del vehículo con anticipación. Ruta Pacifico los envía al resort al reservar."),
            ("¿Nekajui está cerca de algún pueblo?", "No. El pueblo más cercano es Playas del Coco, a unos 30 minutos en carro. El resort está diseñado para ser autosuficiente, con sus propios restaurantes y club de playa."),
        ],
    ),
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-andaz-papagayo",
        photo="hotel-andaz-papagayo.webp",
        short="Andaz Papagayo",
        full="Andaz Costa Rica Resort at Peninsula Papagayo",
        short_es="Andaz Papagayo",
        route="lir-liberia-int-airport-to-papagayo-peninsula-guanacaste",
        fares=(105, 130, 170),
        time="30–40 min", km="31 km (19 mi)",
        gated=True,
        cover_alt="Culebra Bay seen from Peninsula Papagayo near the Andaz resort, Guanacaste",
        cover_alt_es="Bahía Culebra vista desde Península Papagayo cerca del Andaz, Guanacaste",
        tags=["andaz papagayo shuttle", "liberia airport to andaz", "andaz costa rica transfer", "hyatt papagayo transportation", "LIR to andaz papagayo"],
        title_en="Liberia Airport to the Andaz Papagayo: Drive Time, Transfer Price and the Best Nights Out Nearby",
        title_es="Del Aeropuerto de Liberia al Andaz Papagayo: tiempo de viaje, precio del traslado y las mejores salidas cerca",
        excerpt_en="The Andaz is the peninsula resort best placed for leaving it: Marina Papagayo in 5 minutes, El Mangroove in 10, Coco in 20. How long the ride from LIR really takes, the $105 fixed fare, and the gate rule that applies to every Papagayo hotel.",
        excerpt_es="El Andaz es el resort de la península mejor ubicado para salir: Marina Papagayo a 5 minutos, El Mangroove a 10, el Coco a 20. Cuánto dura realmente el viaje desde LIR, la tarifa fija de $105 y la regla del portón que aplica a todos los hoteles de Papagayo.",
        intro_en="Of the three hotels on Peninsula Papagayo, the Andaz is the one people tend to pick when they like the setting but do not want to feel cut off. It is the first resort inside the gate, 30 to 40 minutes from Liberia Airport, and from there a dinner in Coco or at El Mangroove is a short drive rather than an expedition. This guide covers the transfer itself, the checkpoint, and what is within easy reach once you are settled in.",
        intro_es="De los tres hoteles de Península Papagayo, el Andaz es el que la gente suele elegir cuando le gusta el entorno pero no quiere sentirse aislada. Es el primer resort dentro del portón, a 30 o 40 minutos del Aeropuerto de Liberia, y desde ahí una cena en el Coco o en El Mangroove es un viaje corto y no una expedición. Esta guía cubre el traslado en sí, el puesto de control y qué queda a mano una vez instalado.",
        where_en="The Andaz is Hyatt's resort on the calm, bay-facing side of Peninsula Papagayo, a few minutes past the security gate and before you reach the Four Seasons. It looks out over Culebra Bay, has two small beaches, and its low buildings are set back into the dry forest, which gives it a more relaxed feel than its neighbours. From Liberia Airport the distance is 31 km, all of it paved: west on Route 21 to Guardia, then the Coco road past Playa Panamá to the peninsula entrance.",
        where_es="El Andaz es el resort de Hyatt del lado calmo de la bahía en Península Papagayo, unos minutos después del portón de seguridad y antes de llegar al Four Seasons. Da a Bahía Culebra, tiene dos playas pequeñas y sus edificios bajos están metidos en el bosque seco, lo que le da un ambiente más relajado que el de sus vecinos. Desde el Aeropuerto de Liberia son 31 km, todo asfaltado: hacia el oeste por la Ruta 21 hasta Guardia, y luego la carretera del Coco pasando Playa Panamá hasta la entrada de la península.",
        gate_en="The Andaz is inside the Peninsula Papagayo security gate. The guards there check that the hotel has the driver's full name, cédula number and vehicle plate on file before they let anyone through, and a vehicle that is not registered waits at the barrier while they phone the hotel. When you book with us, those details go to the Andaz ahead of your arrival and the gate lets you straight in.",
        gate_es="El Andaz está dentro del portón de seguridad de Península Papagayo. Los guardas verifican que el hotel tenga registrado el nombre completo del chofer, su número de cédula y la placa del vehículo antes de dejar pasar a alguien, y un vehículo no registrado espera en la barrera mientras llaman al hotel. Cuando reservas con nosotros, esos datos llegan al Andaz antes de tu llegada y el portón te deja pasar directo.",
        around_en="Like the other peninsula resorts, the Andaz has no town nearby. What it does have is the best position for getting out in the evening. The Marina Papagayo and its restaurants are five minutes away, El Mangroove and the beach bars at Playa Panamá are ten, and Playas del Coco, the only proper town in the zone, is about twenty. If your idea of a good week mixes resort nights with a few casual dinners out, the Andaz makes that easier than the Four Seasons or Nekajui do.",
        around_es="Como los otros resorts de la península, el Andaz no tiene pueblo cerca. Lo que sí tiene es la mejor posición para salir por la noche. La Marina Papagayo y sus restaurantes quedan a cinco minutos, El Mangroove y los bares de playa de Playa Panamá a diez, y Playas del Coco, el único pueblo como tal de la zona, a unos veinte. Si tu idea de una buena semana mezcla noches de resort con algunas cenas casuales afuera, el Andaz lo hace más fácil que el Four Seasons o Nekajui.",
        tips_en=[
            "The Andaz, the Four Seasons and Nekajui all sit on the Peninsula Papagayo route, so the private transfer to any of them is the same fixed price.",
            "For groceries there is a small supermarket in Playa Panamá village just before the gate. The Automercado in Playas del Coco is bigger and only a short detour. Either stop is free on a private transfer.",
            "Rincón de la Vieja is about an hour and a quarter from the Andaz. A private round trip with the driver waiting is the simplest way to do it if you have not rented a car.",
        ],
        tips_es=[
            "El Andaz, el Four Seasons y Nekajui están en la ruta de Península Papagayo, así que el traslado privado a cualquiera de los tres tiene el mismo precio fijo.",
            "Para víveres hay un supermercado pequeño en el pueblo de Playa Panamá justo antes del portón. El Automercado de Playas del Coco es más grande y queda a un desvío corto. Cualquiera de las dos paradas es gratis en un traslado privado.",
            "Rincón de la Vieja está a una hora y cuarto del Andaz. Un viaje privado de ida y vuelta con el chofer esperando es la forma más sencilla de hacerlo si no alquilaste carro.",
        ],
        faqs_en=[
            ("How long does it take to get from Liberia Airport to the Andaz Papagayo?", "Between 30 and 40 minutes by private transfer, about 31 km on paved roads. The Andaz is one of the closest resorts to LIR."),
            ("How much is a shuttle from LIR to the Andaz Costa Rica?", "A Ruta Pacifico private transfer is a fixed $105 per vehicle for up to 5 passengers, $130 for 6 to 9 and $170 for 10 to 12, with taxes, flight tracking and child seats included."),
            ("Do I need to register my driver with the Andaz?", "Yes. The Peninsula Papagayo gate requires the driver's name, ID and vehicle details to be on your hotel reservation. Ruta Pacifico sends them to the Andaz when you book."),
            ("What is near the Andaz Papagayo?", "The Marina Papagayo is 5 minutes away, Playa Panamá and El Mangroove about 10, and the town of Playas del Coco about 20. There is no walkable town at the resort itself."),
        ],
        faqs_es=[
            ("¿Cuánto se tarda del Aeropuerto de Liberia al Andaz Papagayo?", "Entre 30 y 40 minutos en traslado privado, unos 31 km por carretera asfaltada. El Andaz es uno de los resorts más cercanos a LIR."),
            ("¿Cuánto cuesta un shuttle de LIR al Andaz Costa Rica?", "Un traslado privado de Ruta Pacifico tiene precio fijo de $105 por vehículo para hasta 5 pasajeros, $130 para 6 a 9 y $170 para 10 a 12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿Tengo que registrar a mi chofer con el Andaz?", "Sí. El portón de Península Papagayo exige que el nombre, la cédula y los datos del vehículo del chofer estén en tu reserva del hotel. Ruta Pacifico los envía al Andaz al reservar."),
            ("¿Qué hay cerca del Andaz Papagayo?", "La Marina Papagayo está a 5 minutos, Playa Panamá y El Mangroove a unos 10, y el pueblo de Playas del Coco a unos 20. En el resort mismo no hay pueblo caminable."),
        ],
    ),
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-secrets-papagayo",
        photo="hotel-secrets-papagayo.webp",
        short="Secrets Papagayo",
        full="Secrets Papagayo Costa Rica",
        short_es="Secrets Papagayo",
        route="lir-liberia-int-airport-to-papagayo-peninsula-guanacaste",
        fares=(105, 130, 170),
        time="30–35 min", km="28 km (17 mi)",
        gated=False,
        cover_alt="Calm water of the Gulf of Papagayo near Playa Arenilla, Guanacaste",
        cover_alt_es="Aguas calmas del Golfo de Papagayo cerca de Playa Arenilla, Guanacaste",
        tags=["secrets papagayo shuttle", "liberia airport to secrets papagayo", "secrets papagayo transfer", "adults only papagayo transportation", "LIR to secrets papagayo"],
        title_en="Secrets Papagayo from Liberia Airport: The 30-Minute Transfer Honeymooners Ask Us About",
        title_es="Secrets Papagayo desde el Aeropuerto de Liberia: el traslado de 30 minutos por el que preguntan las parejas",
        excerpt_en="Adults-only, all-inclusive and just 28 km from LIR, outside the peninsula gate. What the ride costs ($105 fixed), why arrival is faster than at the Four Seasons, and how close you really are to Playa Panamá and Coco.",
        excerpt_es="Solo adultos, todo incluido y a solo 28 km de LIR, fuera del portón de la península. Cuánto cuesta el viaje ($105 fijo), por qué la llegada es más rápida que en el Four Seasons y qué tan cerca estás realmente de Playa Panamá y el Coco.",
        intro_en="Secrets Papagayo is the honeymoon hotel of this part of the coast, and it is also the easiest of the Papagayo resorts to reach from the airport. It is 28 km from LIR on paved road, and because it sits outside the peninsula there is no community checkpoint to deal with. Most couples we drive there arrive on an evening flight and want to be at the pool bar within the hour, which is realistic. Below is what the ride involves, what it costs, and what is nearby when you feel like leaving the all-inclusive for a few hours.",
        intro_es="Secrets Papagayo es el hotel de luna de miel de esta parte de la costa, y también el más fácil de alcanzar desde el aeropuerto de los resorts de Papagayo. Está a 28 km de LIR por asfalto, y como queda fuera de la península no hay puesto de control comunitario de por medio. La mayoría de parejas que llevamos llega en vuelo de la tarde y quiere estar en el bar de la piscina en menos de una hora, y es realista. Abajo va en qué consiste el viaje, cuánto cuesta y qué hay cerca cuando te den ganas de salir del todo incluido unas horas.",
        where_en="Secrets Papagayo is an adults-only all-inclusive on Playa Arenilla, on the mainland side of the Gulf of Papagayo, just before the turn toward Playa Panamá and the peninsula. It is not inside the Peninsula Papagayo gate, which makes the arrival simpler than at the Four Seasons or the Andaz. From Liberia Airport you drive west on Route 21 to Guardia, then take the Coco road toward Playa Panamá, and the resort entrance is directly off the coastal road. The beach faces the calm water of the gulf.",
        where_es="Secrets Papagayo es un todo incluido solo para adultos en Playa Arenilla, del lado continental del Golfo de Papagayo, justo antes del desvío hacia Playa Panamá y la península. No está dentro del portón de Península Papagayo, lo que hace la llegada más sencilla que en el Four Seasons o el Andaz. Desde el Aeropuerto de Liberia se maneja hacia el oeste por la Ruta 21 hasta Guardia, luego se toma la carretera del Coco rumbo a Playa Panamá, y la entrada del resort está directamente sobre la carretera costera. La playa da a las aguas calmas del golfo.",
        gate_en="Secrets has its own entrance gate but nothing like the peninsula checkpoint. The guard asks for the guest name, confirms it, and lets the vehicle through to the lobby. We still send the resort your driver's name and vehicle details when you book, because the front desk prefers to know who is bringing guests in late at night.",
        gate_es="Secrets tiene su propio portón de entrada, pero nada parecido al puesto de la península. El guarda pide el nombre del huésped, lo confirma y deja pasar el vehículo hasta el lobby. Igual enviamos al resort el nombre del chofer y los datos del vehículo al reservar, porque recepción prefiere saber quién trae huéspedes de madrugada.",
        around_en="Most people at Secrets never leave the property, since everything is included. If you do want to, you are better placed than guests on the peninsula. Playa Panamá and its beach bars are five minutes away, Playa Hermosa is ten, and Playas del Coco, with its restaurants, bars and supermarket, is about fifteen by car. There is nothing within walking distance of the resort itself.",
        around_es="La mayoría de la gente en Secrets nunca sale de la propiedad, porque todo está incluido. Si quieres hacerlo, estás mejor ubicado que los huéspedes de la península. Playa Panamá y sus bares de playa quedan a cinco minutos, Playa Hermosa a diez, y Playas del Coco, con sus restaurantes, bares y supermercado, a unos quince en carro. A pie desde el resort no hay nada.",
        tips_en=[
            "Secrets is on the same route as the peninsula hotels, so the private transfer is the same $105 for up to five passengers.",
            "Couples travelling light sometimes consider a shared van. The difference is that a private transfer leaves when you land, while the shared van waits until it fills up.",
            "If you want one dinner outside the all-inclusive, a private round trip to Playas del Coco in the evening is fifteen minutes each way and easy to arrange.",
        ],
        tips_es=[
            "Secrets está en la misma ruta que los hoteles de la península, así que el traslado privado son los mismos $105 para hasta cinco pasajeros.",
            "Las parejas que viajan ligero a veces consideran una van compartida. La diferencia es que un traslado privado sale cuando aterrizas, mientras la van compartida espera hasta llenarse.",
            "Si quieres una cena fuera del todo incluido, un viaje privado de ida y vuelta a Playas del Coco por la noche son quince minutos por trayecto y se organiza fácil.",
        ],
        faqs_en=[
            ("How far is Secrets Papagayo from Liberia Airport?", "About 28 km, a drive of 30 to 35 minutes on paved roads. It is on the mainland side of the Gulf of Papagayo, outside the Peninsula Papagayo gate."),
            ("How much is a private transfer from LIR to Secrets Papagayo?", "Ruta Pacifico charges a fixed $105 per vehicle for 1 to 5 passengers, $130 for 6 to 9 and $170 for 10 to 12, with taxes and flight tracking included."),
            ("Is Secrets Papagayo inside the Peninsula Papagayo security gate?", "No. Secrets is on Playa Arenilla, before the peninsula turn-off, and has its own simple entrance gate. Arrival is quicker than at the Four Seasons, the Andaz or Nekajui."),
            ("Is there a town near Secrets Papagayo?", "Playas del Coco is about 15 minutes by car and is the nearest town with restaurants, bars and shops. Playa Panamá, 5 minutes away, has a few beach bars."),
        ],
        faqs_es=[
            ("¿A qué distancia está Secrets Papagayo del Aeropuerto de Liberia?", "A unos 28 km, un viaje de 30 a 35 minutos por carretera asfaltada. Está del lado continental del Golfo de Papagayo, fuera del portón de Península Papagayo."),
            ("¿Cuánto cuesta un traslado privado de LIR a Secrets Papagayo?", "Ruta Pacifico cobra una tarifa fija de $105 por vehículo para 1 a 5 pasajeros, $130 para 6 a 9 y $170 para 10 a 12, con impuestos y seguimiento de vuelo incluidos."),
            ("¿Secrets Papagayo está dentro del portón de seguridad de Península Papagayo?", "No. Secrets está en Playa Arenilla, antes del desvío a la península, y tiene su propio portón de entrada sencillo. La llegada es más rápida que en el Four Seasons, el Andaz o Nekajui."),
            ("¿Hay algún pueblo cerca de Secrets Papagayo?", "Playas del Coco está a unos 15 minutos en carro y es el pueblo más cercano con restaurantes, bares y comercios. Playa Panamá, a 5 minutos, tiene algunos bares de playa."),
        ],
    ),
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-riu-guanacaste-riu-palace",
        photo="hotel-riu-guanacaste.webp",
        short="Riu Guanacaste & Riu Palace",
        full="Hotel Riu Guanacaste and Riu Palace Costa Rica",
        short_es="Riu Guanacaste y Riu Palace",
        route="lir-liberia-int-airport-to-riu-guanacaste-hotel-riu-palace-hotel-guanacaste",
        fares=(120, 130, 185),
        time="35–40 min", km="33 km (20 mi)",
        gated=False,
        cover_alt="Playa Matapalo beach in front of the Riu resorts, Guanacaste, Costa Rica",
        cover_alt_es="Playa Matapalo frente a los hoteles Riu, Guanacaste, Costa Rica",
        tags=["riu guanacaste shuttle", "liberia airport to riu guanacaste", "riu palace costa rica transfer", "riu matapalo transportation", "LIR to riu"],
        title_en="Riu Guanacaste and Riu Palace: Skip the Package Bus, Here Is the 35-Minute Ride from LIR",
        title_es="Riu Guanacaste y Riu Palace: olvida el bus del paquete, este es el viaje de 35 minutos desde LIR",
        excerpt_en="The tour-operator shuttle to the Riu can take 90 minutes with stops. A private transfer is 35 minutes and $120 fixed for up to five. Where Playa Matapalo really is, which lobby is which, and what to do outside the all-inclusive.",
        excerpt_es="El shuttle del operador al Riu puede tardar 90 minutos con paradas. Un traslado privado son 35 minutos y $120 fijos para hasta cinco. Dónde queda realmente Playa Matapalo, cuál lobby es cuál y qué hacer fuera del todo incluido.",
        intro_en="If you booked the Riu Guanacaste or the Riu Palace as part of a package, you were probably offered a shared airport shuttle along with it. It works, but it waits for several flights to land and then stops at most of the resorts on the gulf before it reaches Matapalo, so a 35-minute trip can stretch past an hour and a half. Many of the families we drive to the Riu tried the shared bus once and switched. This page explains what the direct ride looks like, what it costs, and what there is to do once you are there.",
        intro_es="Si reservaste el Riu Guanacaste o el Riu Palace como parte de un paquete, seguramente te ofrecieron un shuttle compartido del aeropuerto junto con él. Funciona, pero espera a que aterricen varios vuelos y después para en la mayoría de los resorts del golfo antes de llegar a Matapalo, así que un viaje de 35 minutos puede estirarse a más de hora y media. Muchas de las familias que llevamos al Riu probaron el bus compartido una vez y cambiaron. Esta página explica cómo es el trayecto directo, cuánto cuesta y qué hay para hacer una vez allí.",
        where_en="The two Riu hotels stand side by side on Playa Matapalo, a long, undeveloped Pacific beach north-west of Playas del Coco that you reach through the town of Sardinal. The Riu Guanacaste is the older and larger of the two, and the Riu Palace is the newer, more upscale one. Together they are the biggest all-inclusive complex in Guanacaste and the usual choice for package travellers from Canada and the United States. From Liberia Airport it is 33 km: west on Route 21 to Guardia, then the road through Sardinal and a final paved stretch down to the coast. Allow 35 to 40 minutes.",
        where_es="Los dos hoteles Riu están uno junto al otro en Playa Matapalo, una playa larga y sin desarrollar del Pacífico al noroeste de Playas del Coco, a la que se llega por el pueblo de Sardinal. El Riu Guanacaste es el más antiguo y grande de los dos, y el Riu Palace el más nuevo y de mayor categoría. Juntos forman el complejo todo incluido más grande de Guanacaste y son la opción habitual de viajeros con paquete desde Canadá y Estados Unidos. Desde el Aeropuerto de Liberia son 33 km: hacia el oeste por la Ruta 21 hasta Guardia, luego la carretera por Sardinal y un último tramo asfaltado hasta la costa. Calcula 35 a 40 minutos.",
        gate_en="The Riu complex has one entrance gate shared by both hotels. The guard asks for the guest name and points the vehicle toward the right lobby. There is no community checkpoint and no need to register in advance, although we pass your driver's details to the hotel anyway so that a late arrival goes smoothly.",
        gate_es="El complejo Riu tiene un solo portón de entrada compartido por los dos hoteles. El guarda pide el nombre del huésped y dirige el vehículo al lobby correcto. No hay puesto de control comunitario ni hace falta registrarse de antemano, aunque igual le pasamos los datos de tu chofer al hotel para que una llegada tardía salga sin problema.",
        around_en="Playa Matapalo is a beautiful beach with nothing on it apart from the two hotels. There is no town, no shop and no restaurant outside the resorts. Sardinal, ten minutes inland, is a working Costa Rican town with a supermarket and a few sodas, but it is not somewhere tourists go for an evening. For a night out, Playas del Coco is twenty minutes by car and has the restaurants, bars and public beach that most Riu guests visit at least once during their stay. Tour buses collect guests at the lobby, so few people here need a car.",
        around_es="Playa Matapalo es una playa preciosa sin nada más que los dos hoteles. No hay pueblo, ni tienda, ni restaurante fuera de los resorts. Sardinal, a diez minutos tierra adentro, es un pueblo costarricense de trabajo con supermercado y algunas sodas, pero no es un lugar adonde vayan los turistas de noche. Para salir, Playas del Coco está a veinte minutos en carro y tiene los restaurantes, bares y playa pública que la mayoría de huéspedes del Riu visita al menos una vez durante su estancia. Los buses de tours recogen en el lobby, así que poca gente aquí necesita carro.",
        tips_en=[
            "For a family of four, a private transfer usually costs less per person than the tour-operator shuttle and takes a fraction of the time.",
            "Tell us which Riu you are staying at. The two lobbies are about 500 metres apart and it saves the driver circling the complex.",
            "The resort shops charge a lot for sunscreen and snacks. A stop at the supermarket in Sardinal on the way in costs nothing and saves money over a week.",
        ],
        tips_es=[
            "Para una familia de cuatro, un traslado privado suele costar menos por persona que el shuttle del operador y tarda una fracción del tiempo.",
            "Dinos en cuál Riu te quedas. Los dos lobbies están a unos 500 metros uno del otro y le ahorra al chofer dar vueltas por el complejo.",
            "Las tiendas del resort cobran mucho por bloqueador y snacks. Una parada en el supermercado de Sardinal de camino no cuesta nada y ahorra dinero en una semana.",
        ],
        faqs_en=[
            ("How far is the Riu Guanacaste from Liberia Airport?", "About 33 km, a private transfer of 35 to 40 minutes on paved roads via Sardinal. The Riu Palace is on the same beach, next door."),
            ("How much is a private shuttle from LIR to the Riu?", "Ruta Pacifico charges a fixed $120 per vehicle for 1 to 5 passengers, $130 for 6 to 9 and $185 for 10 to 12, with taxes, flight tracking and child seats included."),
            ("Is a private transfer better than the Riu package shuttle?", "The package bus waits for several flights and stops at multiple resorts, and often takes an hour and a half. A private transfer leaves when you land and takes 35 minutes. For four or more people it is usually cheaper per person as well."),
            ("Is there anything to do outside the Riu resorts?", "Not on foot. Playa Matapalo has no town. Playas del Coco, 20 minutes by car, has restaurants, bars and shops and is where Riu guests usually go for a night out."),
        ],
        faqs_es=[
            ("¿A qué distancia está el Riu Guanacaste del Aeropuerto de Liberia?", "A unos 33 km, un traslado privado de 35 a 40 minutos por carretera asfaltada vía Sardinal. El Riu Palace está en la misma playa, al lado."),
            ("¿Cuánto cuesta un shuttle privado de LIR al Riu?", "Ruta Pacifico cobra una tarifa fija de $120 por vehículo para 1 a 5 pasajeros, $130 para 6 a 9 y $185 para 10 a 12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿Es mejor un traslado privado que el shuttle del paquete del Riu?", "El bus del paquete espera varios vuelos y para en varios resorts, y suele tardar hora y media. Un traslado privado sale cuando aterrizas y tarda 35 minutos. Para cuatro o más personas suele ser más barato por persona también."),
            ("¿Hay algo que hacer fuera de los resorts Riu?", "No a pie. Playa Matapalo no tiene pueblo. Playas del Coco, a 20 minutos en carro, tiene restaurantes, bares y comercios y es adonde suelen ir los huéspedes del Riu para salir de noche."),
        ],
    ),
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-westin-reserva-conchal",
        photo="hotel-westin-conchal.webp",
        short="Westin Reserva Conchal",
        full="The Westin Reserva Conchal, an All-Inclusive Golf Resort & Spa",
        short_es="Westin Reserva Conchal",
        route="lir-liberia-int-airport-to-conchal-guanacaste",
        fares=(130, 165, 220),
        time="65–70 min", km="60 km (37 mi)",
        gated=True,
        cover_alt="White shell sand of Playa Conchal in front of the Westin resort, Guanacaste",
        cover_alt_es="Arena blanca de concha de Playa Conchal frente al Westin, Guanacaste",
        tags=["westin conchal shuttle", "liberia airport to westin conchal", "westin reserva conchal transfer", "playa conchal transportation", "LIR to westin"],
        title_en="Westin Reserva Conchal from Liberia Airport: The Hour-Long Drive, the Gate, and Where Dinner Really Is",
        title_es="Westin Reserva Conchal desde el Aeropuerto de Liberia: la hora de viaje, el portón y dónde está realmente la cena",
        excerpt_en="Guanacaste’s biggest all-inclusive sits inside a gated reserve an hour from LIR, with only a fishing village outside. Real drive time, the $130 fixed transfer for up to five, what Reserva Conchal security checks, and why guests end up in Tamarindo for dinner.",
        excerpt_es="El todo incluido más grande de Guanacaste está dentro de una reserva privada a una hora de LIR, con solo un pueblito de pescadores afuera. Tiempo real de viaje, el traslado fijo de $130 para hasta cinco, qué revisa la seguridad de Reserva Conchal y por qué los huéspedes terminan cenando en Tamarindo.",
        intro_en="A good share of the all-inclusive guests who land at Liberia are heading for the Westin Reserva Conchal, and the first thing many of them ask us is whether it is in Tamarindo. It is close, but not in it. The resort sits inside its own gated reserve about an hour from the airport, with the small village of Brasilito at the gate and Tamarindo twenty minutes further down the coast. Knowing that ahead of time makes the week easier to plan, so here is the drive, the fare and the geography.",
        intro_es="Una buena parte de los huéspedes de todo incluido que aterrizan en Liberia va rumbo al Westin Reserva Conchal, y lo primero que muchos nos preguntan es si está en Tamarindo. Está cerca, pero no ahí. El resort queda dentro de su propia reserva privada a una hora del aeropuerto, con el pueblito de Brasilito en el portón y Tamarindo veinte minutos más abajo por la costa. Saberlo de antemano hace la semana más fácil de planificar, así que aquí van el trayecto, la tarifa y la geografía.",
        where_en="The Westin Reserva Conchal is the largest resort in Guanacaste. It is all-inclusive, has a Robert Trent Jones II golf course and a very large free-form pool, and opens directly onto Playa Conchal, whose sand is made of crushed white shell. The hotel sits inside Reserva Conchal, a 2,300-acre gated development between Brasilito and Flamingo. From Liberia Airport the drive is about 60 km on paved road: Route 21 south to Belén, west through Huacas, then north past the village of Matapalo to the reserve gate. It takes 65 to 70 minutes.",
        where_es="El Westin Reserva Conchal es el resort más grande de Guanacaste. Es todo incluido, tiene un campo de golf de Robert Trent Jones II y una piscina de forma libre muy grande, y da directamente a Playa Conchal, cuya arena es de concha blanca triturada. El hotel está dentro de Reserva Conchal, un desarrollo privado de 930 hectáreas entre Brasilito y Flamingo. Desde el Aeropuerto de Liberia el viaje son unos 60 km por asfalto: Ruta 21 hacia el sur hasta Belén, al oeste por Huacas y luego al norte pasando el pueblo de Matapalo hasta el portón de la reserva. Tarda 65 a 70 minutos.",
        gate_en="Reserva Conchal has a security gate at its entrance, shared with the W and the residential villas inside. The guard asks for the guest name and takes a look at the vehicle. It is a lighter process than at Papagayo or Hacienda Pinilla, but a driver who has been registered gets through faster, so we send the Westin your driver's name and vehicle details when you book.",
        gate_es="Reserva Conchal tiene un portón de seguridad en la entrada, compartido con el W y las villas residenciales de adentro. El guarda pide el nombre del huésped y le da un vistazo al vehículo. Es un proceso más ligero que en Papagayo o Hacienda Pinilla, pero un chofer registrado pasa más rápido, así que le enviamos al Westin el nombre de tu chofer y los datos del vehículo cuando reservas.",
        around_en="Just outside the reserve gate is Brasilito, a small fishing village with a couple of sodas, a mini-market and a public beach. It is a nice place for a walk but not somewhere you would go for dinner. Flamingo, ten minutes north, has a short strip of restaurants by the marina. When Westin guests want a proper evening out, they go to Tamarindo, twenty to twenty-five minutes south, which has the best restaurant scene on this stretch of coast. Inside the reserve, the Westin's restaurants are included in your stay and the W's are a short shuttle ride away.",
        around_es="Justo fuera del portón de la reserva está Brasilito, un pueblito de pescadores con un par de sodas, un minisúper y playa pública. Es agradable para caminar pero no es un lugar adonde ir a cenar. Flamingo, a diez minutos al norte, tiene una franja corta de restaurantes junto a la marina. Cuando los huéspedes del Westin quieren una salida nocturna en serio, van a Tamarindo, a veinte o veinticinco minutos al sur, que tiene la mejor oferta de restaurantes de este tramo de costa. Dentro de la reserva, los restaurantes del Westin están incluidos en tu estancia y los del W quedan a un shuttle corto.",
        tips_en=[
            "There is a supermarket in Huacas on the way to the resort and a larger Automercado in Tamarindo. Stopping at either is free on a private transfer.",
            "A popular evening is a private round trip that stops at the Flamingo viewpoint for sunset and then continues to Tamarindo for dinner.",
            "Playa Conchal is a public beach and fills up with local families on weekends, mostly at the Brasilito end. The stretch in front of the resort stays quiet.",
        ],
        tips_es=[
            "Hay un supermercado en Huacas de camino al resort y un Automercado más grande en Tamarindo. Parar en cualquiera de los dos es gratis en un traslado privado.",
            "Una salida popular es un viaje privado de ida y vuelta que para en el mirador de Flamingo para el atardecer y sigue a Tamarindo a cenar.",
            "Playa Conchal es pública y se llena de familias locales los fines de semana, sobre todo del lado de Brasilito. El tramo frente al resort se mantiene tranquilo.",
        ],
        faqs_en=[
            ("How far is the Westin Reserva Conchal from Liberia Airport?", "About 60 km, a drive of 65 to 70 minutes on paved roads via Belén and Huacas."),
            ("How much is a private transfer from LIR to the Westin Conchal?", "Ruta Pacifico charges a fixed $130 per vehicle for 1 to 5 passengers, $165 for 6 to 9 and $220 for 10 to 12, including taxes, flight tracking and child seats."),
            ("Is there a town near the Westin Conchal?", "Brasilito, just outside the gate, is a small village with a few sodas and a mini-market. For restaurants and nightlife, Tamarindo is 20 to 25 minutes away by car."),
            ("Does the Westin Conchal have an airport shuttle?", "The resort sells private transfers through its concierge. Ruta Pacifico offers the same door-to-door service with flight tracking and gate registration at a fixed per-vehicle price, usually lower."),
        ],
        faqs_es=[
            ("¿A qué distancia está el Westin Reserva Conchal del Aeropuerto de Liberia?", "A unos 60 km, un viaje de 65 a 70 minutos por carretera asfaltada vía Belén y Huacas."),
            ("¿Cuánto cuesta un traslado privado de LIR al Westin Conchal?", "Ruta Pacifico cobra una tarifa fija de $130 por vehículo para 1 a 5 pasajeros, $165 para 6 a 9 y $220 para 10 a 12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿Hay algún pueblo cerca del Westin Conchal?", "Brasilito, justo fuera del portón, es un pueblito con un par de sodas y un minisúper. Para restaurantes y vida nocturna, Tamarindo está a 20 o 25 minutos en carro."),
            ("¿El Westin Conchal tiene shuttle desde el aeropuerto?", "El resort vende traslados privados a través de su concierge. Ruta Pacifico ofrece el mismo servicio puerta a puerta con seguimiento de vuelo y registro en el portón a un precio fijo por vehículo, normalmente más bajo."),
        ],
    ),
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-w-costa-rica-reserva-conchal",
        photo="hotel-w-conchal.webp",
        short="W Costa Rica – Reserva Conchal",
        full="W Costa Rica – Reserva Conchal",
        short_es="W Costa Rica – Reserva Conchal",
        route="lir-liberia-int-airport-to-conchal-guanacaste",
        fares=(130, 165, 220),
        time="65–70 min", km="60 km (37 mi)",
        gated=True,
        cover_alt="Playa Conchal coastline at Reserva Conchal, home of the W Costa Rica, Guanacaste",
        cover_alt_es="Costa de Playa Conchal en Reserva Conchal, donde está el W Costa Rica, Guanacaste",
        tags=["w costa rica shuttle", "liberia airport to w conchal", "w reserva conchal transfer", "w hotel guanacaste transportation", "LIR to w costa rica"],
        title_en="How to Get to the W Costa Rica from Liberia Airport, and How to Get to Tamarindo for Dinner After",
        title_es="Cómo llegar al W Costa Rica desde el Aeropuerto de Liberia, y cómo ir a Tamarindo a cenar después",
        excerpt_en="The W is not all-inclusive, so its guests leave the reserve more than anyone else in Conchal. The 65-minute ride from LIR, the $130 fixed transfer, the shared gate with the Westin, and the Tamarindo dinner run we get asked for most.",
        excerpt_es="El W no es todo incluido, así que sus huéspedes salen de la reserva más que nadie en Conchal. El viaje de 65 minutos desde LIR, el traslado fijo de $130, el portón compartido con el Westin y la salida a cenar a Tamarindo que más nos piden.",
        intro_en="The W Costa Rica shares a gate, a beach and a transfer fare with the Westin next door, but staying there is a different experience. There is no all-inclusive wristband, the hotel has three restaurants of its own, and the guests tend to be younger and more inclined to go out. That changes how you plan transport for the week. This guide covers the ride from the airport, the checkpoint at the reserve, and how W guests usually handle evenings.",
        intro_es="El W Costa Rica comparte portón, playa y tarifa de traslado con el Westin de al lado, pero quedarse ahí es una experiencia distinta. No hay pulsera de todo incluido, el hotel tiene tres restaurantes propios y los huéspedes suelen ser más jóvenes y con más ganas de salir. Eso cambia cómo se planifica el transporte de la semana. Esta guía cubre el viaje desde el aeropuerto, el puesto de control de la reserva y cómo resuelven las noches los huéspedes del W.",
        where_en="The W Costa Rica is Marriott's lifestyle hotel inside Reserva Conchal, a few hundred metres from the Westin on the same gated estate. It is smaller and louder than its neighbour and leans hard on design, with a pool scene that runs into the evening, DJ nights, and rooms that look out over the dry forest toward Playa Conchal. From Liberia Airport it is about 60 km on paved road, the same way as the Westin: Route 21 south to Belén, west through Huacas, then north past Matapalo to the reserve gate. The drive is 65 to 70 minutes.",
        where_es="El W Costa Rica es el hotel lifestyle de Marriott dentro de Reserva Conchal, a unos cientos de metros del Westin en la misma finca privada. Es más pequeño y más ruidoso que su vecino y apuesta fuerte por el diseño, con un ambiente de piscina que sigue hasta la noche, noches de DJ y habitaciones que miran al bosque seco hacia Playa Conchal. Desde el Aeropuerto de Liberia son unos 60 km por asfalto, el mismo camino que al Westin: Ruta 21 al sur hasta Belén, al oeste por Huacas y luego al norte pasando Matapalo hasta el portón de la reserva. El viaje dura 65 a 70 minutos.",
        gate_en="The W uses the same Reserva Conchal security gate as the Westin and the villas. The guard takes the guest name and checks the vehicle, and drivers who are already registered get through faster, so we send yours to the W when you book. From the gate it is about two minutes to the W's own entrance.",
        gate_es="El W usa el mismo portón de seguridad de Reserva Conchal que el Westin y las villas. El guarda toma el nombre del huésped y revisa el vehículo, y los choferes ya registrados pasan más rápido, así que enviamos el tuyo al W cuando reservas. Desde el portón son unos dos minutos hasta la entrada propia del W.",
        around_en="The surroundings are the same as for the Westin: Brasilito village at the gate for a walk and a soda lunch, the Flamingo marina strip ten minutes north, and Tamarindo twenty to twenty-five minutes south for the real choice of restaurants and bars. Because the W is not all-inclusive, its guests go out much more than Westin guests do, and the most common request we get from the W is a private round trip to Tamarindo for dinner with the driver waiting.",
        around_es="Los alrededores son los mismos que para el Westin: el pueblito de Brasilito en el portón para caminar y almorzar en una soda, la franja de la marina de Flamingo a diez minutos al norte, y Tamarindo a veinte o veinticinco minutos al sur para la verdadera variedad de restaurantes y bares. Como el W no es todo incluido, sus huéspedes salen mucho más que los del Westin, y la solicitud más común que recibimos desde el W es un viaje privado de ida y vuelta a Tamarindo para cenar con el chofer esperando.",
        tips_en=[
            "Since meals are not included, it is worth planning a couple of dinners in Tamarindo. A private round trip works out cheaper than two taxis and you are not waiting for one at the end of the night.",
            "The minibar is expensive. Pick up drinks and snacks at the supermarket in Huacas or the Automercado in Tamarindo on the way in; the stop is free.",
            "When you book, say the W rather than the Westin. They share the gate but have separate entrances, and it saves the driver a loop through the reserve.",
        ],
        tips_es=[
            "Como las comidas no están incluidas, vale la pena planificar un par de cenas en Tamarindo. Un viaje privado de ida y vuelta sale más barato que dos taxis y no te quedas esperando uno al final de la noche.",
            "El minibar es caro. Compra bebidas y snacks en el supermercado de Huacas o en el Automercado de Tamarindo de camino; la parada es gratis.",
            "Al reservar, indica el W y no el Westin. Comparten portón pero tienen entradas separadas, y le ahorra al chofer una vuelta por la reserva.",
        ],
        faqs_en=[
            ("How far is the W Costa Rica from Liberia Airport?", "About 60 km, 65 to 70 minutes on paved roads. It is inside Reserva Conchal, next to the Westin."),
            ("How much is a private shuttle from LIR to the W Costa Rica?", "A fixed $130 per vehicle for 1 to 5 passengers with Ruta Pacifico, $165 for 6 to 9 and $220 for 10 to 12, including taxes, flight tracking and child seats."),
            ("Is the W Costa Rica all-inclusive?", "No. The W is a full-service hotel where restaurants and bars are charged separately, unlike the Westin next door. Many guests take a transfer to Tamarindo for dinner."),
            ("Can I walk from the W to a town?", "No. Brasilito village is just outside the gate but it is a 20-minute walk and has only a few sodas. Tamarindo, the nearest real town, is 20 to 25 minutes by car."),
        ],
        faqs_es=[
            ("¿A qué distancia está el W Costa Rica del Aeropuerto de Liberia?", "A unos 60 km, de 65 a 70 minutos por carretera asfaltada. Está dentro de Reserva Conchal, junto al Westin."),
            ("¿Cuánto cuesta un shuttle privado de LIR al W Costa Rica?", "Un precio fijo de $130 por vehículo para 1 a 5 pasajeros con Ruta Pacifico, $165 para 6 a 9 y $220 para 10 a 12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿El W Costa Rica es todo incluido?", "No. El W es un hotel de servicio completo donde los restaurantes y bares se cobran aparte, a diferencia del Westin de al lado. Muchos huéspedes toman un traslado a Tamarindo para cenar."),
            ("¿Puedo caminar del W a algún pueblo?", "No. El pueblito de Brasilito está justo fuera del portón pero son 20 minutos a pie y solo tiene unas pocas sodas. Tamarindo, el pueblo real más cercano, está a 20 o 25 minutos en carro."),
        ],
    ),
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-margaritaville-flamingo",
        photo="hotel-margaritaville-flamingo.webp",
        short="Margaritaville Flamingo",
        full="Margaritaville Beach Resort Playa Flamingo",
        short_es="Margaritaville Flamingo",
        route="lir-liberia-int-airport-to-flamingo-guanacaste",
        fares=(130, 165, 220),
        time="65–75 min", km="62 km (39 mi)",
        gated=False,
        cover_alt="Playa Flamingo bay and marina, Guanacaste, Costa Rica",
        cover_alt_es="Bahía y marina de Playa Flamingo, Guanacaste, Costa Rica",
        tags=["margaritaville flamingo shuttle", "liberia airport to margaritaville", "margaritaville costa rica transfer", "playa flamingo transportation", "LIR to flamingo"],
        title_en="Margaritaville Playa Flamingo from Liberia Airport: Family Transfer Guide with Car Seats Included",
        title_es="Margaritaville Playa Flamingo desde el Aeropuerto de Liberia: guía de traslado familiar con sillas incluidas",
        excerpt_en="Flamingo is the most walkable of the Zone 2 resort beaches, and Margaritaville is its family hotel. The 70-minute ride from LIR, the $130 fixed transfer with child seats, what is within a 10-minute walk, and when Tamarindo is worth the drive.",
        excerpt_es="Flamingo es la más caminable de las playas con resort de la Zona 2, y Margaritaville es su hotel familiar. El viaje de 70 minutos desde LIR, el traslado fijo de $130 con sillas para niños, qué hay a 10 minutos a pie y cuándo vale la pena ir a Tamarindo.",
        intro_en="Margaritaville is the hotel in Flamingo we drive the most families to, and the questions on arrival day are always practical ones: whether there are car seats, where to buy groceries, and how long until the kids can get in the water. The answers are yes, on the way, and about 70 minutes after you leave the airport. There is no gate to deal with and the marina strip is close enough to walk to. Here is how the ride works, what it costs and what you will find around the resort.",
        intro_es="Margaritaville es el hotel de Flamingo al que más familias llevamos, y las preguntas del día de llegada siempre son prácticas: si hay sillas para niños, dónde comprar víveres y cuánto falta para que los niños puedan meterse al agua. Las respuestas son sí, de camino, y unos 70 minutos después de salir del aeropuerto. No hay portón de por medio y la franja de la marina queda lo bastante cerca para ir a pie. Así funciona el viaje, cuánto cuesta y qué vas a encontrar alrededor del resort.",
        where_en="Margaritaville Beach Resort is the large family hotel on Playa Flamingo, a white-sand bay with a marina about 62 km from Liberia Airport. The route is Route 21 south to Belén, west through Huacas, then north through Brasilito and along the coast into Flamingo, all on pavement, in 65 to 75 minutes. The resort is across the road from the beach, a two-minute walk to the sand, with the marina and Flamingo's small commercial strip a few minutes further along.",
        where_es="Margaritaville Beach Resort es el gran hotel familiar de Playa Flamingo, una bahía de arena blanca con marina a unos 62 km del Aeropuerto de Liberia. La ruta es Ruta 21 al sur hasta Belén, al oeste por Huacas, y luego al norte por Brasilito y por la costa hasta Flamingo, todo asfaltado, en 65 a 75 minutos. El resort está al otro lado de la calle de la playa, a dos minutos a pie de la arena, con la marina y la pequeña franja comercial de Flamingo unos minutos más adelante.",
        gate_en="Margaritaville has an ordinary hotel entrance, with no community gate and nothing to register beforehand. Your driver takes you to the lobby door. We still pass your driver's details to the front desk so that a late-night arrival is expected.",
        gate_es="Margaritaville tiene una entrada de hotel normal, sin portón comunitario ni nada que registrar de antemano. Tu chofer te lleva hasta la puerta del lobby. Igual le pasamos los datos de tu chofer a recepción para que una llegada de madrugada esté prevista.",
        around_en="Flamingo is the most walkable of the resort beaches in this zone, although it is still a small place rather than a town. Within ten minutes on foot from Margaritaville you have the marina, a handful of restaurants and bars, a small supermarket and the beach. For an evening with more choice, Tamarindo is 25 minutes south. Potrero, five minutes north, is a quiet local village, and Las Catalinas, ten minutes away, is the car-free planned village with a few good restaurants.",
        around_es="Flamingo es la más caminable de las playas con resort de esta zona, aunque sigue siendo un lugar pequeño y no un pueblo. A diez minutos a pie de Margaritaville tienes la marina, un puñado de restaurantes y bares, un supermercado pequeño y la playa. Para una noche con más opciones, Tamarindo está a 25 minutos al sur. Potrero, a cinco minutos al norte, es un pueblito local tranquilo, y Las Catalinas, a diez minutos, es el pueblo planificado sin carros con algunos buenos restaurantes.",
        tips_en=[
            "Child seats come with the private transfer at no charge, two or three if you need them. Shared shuttles rarely guarantee that.",
            "The mini-market in Flamingo is small and not cheap. There is a proper supermarket in Huacas on the way, and stopping there is free.",
            "Most of the sunset catamaran trips leave from the Flamingo marina, which is walking distance from the resort.",
        ],
        tips_es=[
            "Las sillas para niños vienen con el traslado privado sin costo, dos o tres si las necesitas. Los shuttles compartidos rara vez lo garantizan.",
            "El minisúper de Flamingo es pequeño y no es barato. Hay un supermercado como tal en Huacas de camino, y parar ahí es gratis.",
            "La mayoría de los paseos en catamarán al atardecer salen de la marina de Flamingo, que queda a distancia caminable del resort.",
        ],
        faqs_en=[
            ("How far is Margaritaville Flamingo from Liberia Airport?", "About 62 km, a drive of 65 to 75 minutes on paved roads via Belén, Huacas and Brasilito."),
            ("How much is a private shuttle from LIR to Margaritaville Playa Flamingo?", "Ruta Pacifico charges a fixed $130 per vehicle for 1 to 5 passengers, $165 for 6 to 9 and $220 for 10 to 12, with taxes, flight tracking and child seats included."),
            ("Can I walk to restaurants from Margaritaville Flamingo?", "Yes, to a few. The Flamingo marina strip with several restaurants and bars is within a 10-minute walk. For more choice, Tamarindo is 25 minutes by car."),
            ("Is Flamingo a good base for families?", "Yes. The bay is calm, the resort is family-oriented, and Potrero and Las Catalinas are minutes away. Tamarindo's restaurants and surf schools are a 25-minute transfer."),
        ],
        faqs_es=[
            ("¿A qué distancia está Margaritaville Flamingo del Aeropuerto de Liberia?", "A unos 62 km, un viaje de 65 a 75 minutos por carretera asfaltada vía Belén, Huacas y Brasilito."),
            ("¿Cuánto cuesta un shuttle privado de LIR a Margaritaville Playa Flamingo?", "Ruta Pacifico cobra una tarifa fija de $130 por vehículo para 1 a 5 pasajeros, $165 para 6 a 9 y $220 para 10 a 12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿Puedo caminar a restaurantes desde Margaritaville Flamingo?", "Sí, a algunos. La franja de la marina de Flamingo con varios restaurantes y bares está a 10 minutos a pie. Para más opciones, Tamarindo está a 25 minutos en carro."),
            ("¿Flamingo es buena base para familias?", "Sí. La bahía es calma, el resort es familiar, y Potrero y Las Catalinas están a minutos. Los restaurantes y escuelas de surf de Tamarindo quedan a un traslado de 25 minutos."),
        ],
    ),
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-jw-marriott-guanacaste",
        photo="hotel-jw-marriott-guanacaste.webp",
        short="JW Marriott Guanacaste",
        full="JW Marriott Guanacaste Resort & Spa (Hacienda Pinilla)",
        short_es="JW Marriott Guanacaste",
        route="lir-liberia-int-airport-to-jw-marriott-guanacaste",
        fares=(135, 175, 260),
        time="75–85 min", km="80 km (50 mi)",
        gated=True,
        cover_alt="Playa Mansita beach in front of the JW Marriott Guanacaste, Hacienda Pinilla",
        cover_alt_es="Playa Mansita frente al JW Marriott Guanacaste, Hacienda Pinilla",
        tags=["jw marriott guanacaste shuttle", "liberia airport to jw marriott", "jw marriott costa rica transfer", "hacienda pinilla transportation", "LIR to jw marriott"],
        title_en="JW Marriott Guanacaste Is Not in Tamarindo: How to Get There from Liberia Airport and What to Expect",
        title_es="El JW Marriott Guanacaste no está en Tamarindo: cómo llegar desde el Aeropuerto de Liberia y qué esperar",
        excerpt_en="The most-requested hotel on our routes sits inside Hacienda Pinilla, a gated estate 25 minutes south of Tamarindo with nothing around it. The 80-minute drive from LIR, the $135 fixed transfer, the strictest gate in the region, and how to plan dinners.",
        excerpt_es="El hotel más solicitado en nuestras rutas está dentro de Hacienda Pinilla, una finca privada a 25 minutos al sur de Tamarindo sin nada alrededor. El viaje de 80 minutos desde LIR, el traslado fijo de $135, el portón más estricto de la región y cómo planificar las cenas.",
        intro_en="We drive to the JW Marriott more often than to any other hotel in Guanacaste, and we still see the same surprise at the gate most weeks: guests who thought they had booked a hotel in Tamarindo. The JW is not in Tamarindo. It is inside Hacienda Pinilla, a private estate about 25 minutes further south, behind the strictest security checkpoint in the region and with no town anywhere near it. None of that is a problem if you know it in advance, which is the reason for this page.",
        intro_es="Manejamos al JW Marriott más seguido que a cualquier otro hotel de Guanacaste, y todavía vemos la misma sorpresa en el portón casi todas las semanas: huéspedes que creían haber reservado un hotel en Tamarindo. El JW no está en Tamarindo. Está dentro de Hacienda Pinilla, una finca privada unos 25 minutos más al sur, detrás del puesto de seguridad más estricto de la región y sin ningún pueblo cerca. Nada de eso es un problema si lo sabes de antemano, y esa es la razón de esta página.",
        where_en="The JW Marriott Guanacaste sits on Playa Mansita inside Hacienda Pinilla, a 4,500-acre gated estate south of Tamarindo. The resort has the largest swimming pool in Central America, a golf course, a beach club and miles of estate roads, and beyond the estate boundary there is very little. From Liberia Airport the drive is about 80 km: Route 21 south to Belén, west through Huacas and Villarreal, past the turn for Tamarindo, then south to the Hacienda Pinilla gate and along the estate road to the hotel. It is paved the whole way and takes 75 to 85 minutes.",
        where_es="El JW Marriott Guanacaste está en Playa Mansita dentro de Hacienda Pinilla, una finca privada de 1.800 hectáreas al sur de Tamarindo. El resort tiene la piscina más grande de Centroamérica, campo de golf, club de playa y kilómetros de caminos internos, y más allá del límite de la finca hay muy poco. Desde el Aeropuerto de Liberia el viaje son unos 80 km: Ruta 21 al sur hasta Belén, al oeste por Huacas y Villarreal, pasando el desvío a Tamarindo, y luego al sur hasta el portón de Hacienda Pinilla y por el camino interno hasta el hotel. Es asfaltado todo el trayecto y tarda 75 a 85 minutos.",
        gate_en="After Papagayo, the Hacienda Pinilla gate is the strictest in Guanacaste. The guards expect the hotel to have the driver's full name, cédula number, and the make, plate and colour of the vehicle on the guest's reservation. A taxi that is not registered waits at the barrier while the guard phones the resort, and we have seen that wait run to twenty minutes on a busy afternoon. We send those details to the JW Marriott ahead of every arrival, without exception, so the gate is already expecting your vehicle when you pull up.",
        gate_es="Después de Papagayo, el portón de Hacienda Pinilla es el más estricto de Guanacaste. Los guardas esperan que el hotel tenga en la reserva del huésped el nombre completo del chofer, su número de cédula y la marca, placa y color del vehículo. Un taxi no registrado espera en la barrera mientras el guarda llama al resort, y hemos visto esa espera llegar a veinte minutos en una tarde movida. Nosotros enviamos esos datos al JW Marriott antes de cada llegada, sin excepción, así que el portón ya espera tu vehículo cuando llegas.",
        around_en="There is nothing around the JW Marriott. No town, no commercial strip, and no restaurant you can walk to. Inside the estate you have the resort's own restaurants and the Hacienda Pinilla beach club. The nearest place with a real choice of restaurants is Tamarindo, twenty to twenty-five minutes away by car. Playa Avellanas, ten minutes south, has Lola's, the well-known beach restaurant, and not much else. Guests who arrive knowing this tend to have an excellent, quiet week. Guests who expected Tamarindo next door end up spending a fair amount on taxis, so it helps to plan a private round trip for the one or two nights you want to go out.",
        around_es="No hay nada alrededor del JW Marriott. Ni pueblo, ni franja comercial, ni un restaurante al que se pueda ir caminando. Dentro de la finca tienes los restaurantes del resort y el club de playa de Hacienda Pinilla. El lugar más cercano con variedad real de restaurantes es Tamarindo, a veinte o veinticinco minutos en carro. Playa Avellanas, a diez minutos al sur, tiene Lola's, el conocido restaurante de playa, y poco más. Quien llega sabiendo esto suele pasar una semana excelente y tranquila. Quien esperaba tener Tamarindo al lado termina gastando bastante en taxis, así que conviene planificar un viaje privado de ida y vuelta para la o las dos noches que quieras salir.",
        tips_en=[
            "There is no shared shuttle or bus to the JW. The shared vans stop in Tamarindo, and the resort is another twenty minutes inside a gated estate. It is either a private transfer or a rental car.",
            "The supermarket in Villarreal is the last one on the road to the Pinilla gate without detouring into Tamarindo. Stopping there costs nothing on a private transfer.",
            "If you would like a dinner in Tamarindo during your stay, mention it when you book the airport transfer and we will quote the round trip with the driver waiting.",
        ],
        tips_es=[
            "No hay shuttle compartido ni bus hasta el JW. Las vans compartidas paran en Tamarindo, y el resort está veinte minutos más adentro de una finca con portón. Es traslado privado o carro de alquiler.",
            "El supermercado de Villarreal es el último en el camino al portón de Pinilla sin desviarse a Tamarindo. Parar ahí no cuesta nada en un traslado privado.",
            "Si te gustaría cenar en Tamarindo durante tu estancia, menciónalo al reservar el traslado del aeropuerto y te cotizamos el viaje de ida y vuelta con el chofer esperando.",
        ],
        faqs_en=[
            ("How far is the JW Marriott Guanacaste from Liberia Airport?", "About 80 km, a private transfer of 75 to 85 minutes on paved roads via Belén, Huacas and the Hacienda Pinilla gate south of Tamarindo."),
            ("How much is a private shuttle from LIR to the JW Marriott?", "Ruta Pacifico charges a fixed $135 per vehicle for 1 to 5 passengers, $175 for 6 to 9 and $260 for 10 to 12, including taxes, flight tracking, child seats and registering the driver at the Hacienda Pinilla gate."),
            ("Do I need to register my driver with the JW Marriott before arrival?", "Yes. Hacienda Pinilla security requires the driver's name, ID number and vehicle details on your reservation. Ruta Pacifico sends them to the resort automatically when you book."),
            ("Is the JW Marriott in Tamarindo?", "No. It is inside Hacienda Pinilla, a gated estate 20 to 25 minutes south of Tamarindo by car. There is no town within walking distance of the resort."),
            ("Is there a shared shuttle from Liberia Airport to the JW Marriott?", "No. Shared shuttles serve Tamarindo town, not the resort. The options are a private transfer, the hotel's own car service, or a rental car."),
        ],
        faqs_es=[
            ("¿A qué distancia está el JW Marriott Guanacaste del Aeropuerto de Liberia?", "A unos 80 km, un traslado privado de 75 a 85 minutos por carretera asfaltada vía Belén, Huacas y el portón de Hacienda Pinilla al sur de Tamarindo."),
            ("¿Cuánto cuesta un shuttle privado de LIR al JW Marriott?", "Ruta Pacifico cobra una tarifa fija de $135 por vehículo para 1 a 5 pasajeros, $175 para 6 a 9 y $260 para 10 a 12, con impuestos, seguimiento de vuelo, sillas para niños y el registro del chofer en el portón de Hacienda Pinilla incluidos."),
            ("¿Tengo que registrar a mi chofer con el JW Marriott antes de llegar?", "Sí. La seguridad de Hacienda Pinilla exige el nombre, la cédula y los datos del vehículo del chofer en tu reserva. Ruta Pacifico los envía al resort automáticamente al reservar."),
            ("¿El JW Marriott está en Tamarindo?", "No. Está dentro de Hacienda Pinilla, una finca privada a 20 o 25 minutos al sur de Tamarindo en carro. No hay pueblo a distancia caminable del resort."),
            ("¿Hay shuttle compartido del Aeropuerto de Liberia al JW Marriott?", "No. Los shuttles compartidos llegan al pueblo de Tamarindo, no al resort. Las opciones son traslado privado, el servicio de carro del hotel o carro de alquiler."),
        ],
    ),
    # ------------------------------------------------------------------ #
    dict(
        slug="liberia-airport-to-tamarindo-diria",
        photo="hotel-tamarindo-diria.webp",
        short="Tamarindo Diriá",
        full="Tamarindo Diriá Beach Resort",
        short_es="Tamarindo Diriá",
        route="lir-liberia-int-airport-to-tamarindo-guanacaste",
        fares=(130, 165, 220),
        time="55–70 min", km="65 km (40 mi)",
        gated=False,
        cover_alt="Tamarindo beach at sunset in front of the Tamarindo Diriá Beach Resort, Guanacaste",
        cover_alt_es="Playa Tamarindo al atardecer frente al Tamarindo Diriá Beach Resort, Guanacaste",
        tags=["tamarindo diria shuttle", "liberia airport to tamarindo diria", "tamarindo diria transfer", "tamarindo beach resort transportation", "LIR to tamarindo hotel"],
        title_en="Tamarindo Diriá from Liberia Airport: The One Resort Where You Can Walk to Dinner",
        title_es="Tamarindo Diriá desde el Aeropuerto de Liberia: el único resort donde puedes caminar a cenar",
        excerpt_en="The Diriá sits on Tamarindo’s main beach with the whole town across the street, which makes it the opposite of every gated resort in Guanacaste. The 60-minute ride from LIR, the $130 fixed transfer, which wing to ask for, and why you will not need a car.",
        excerpt_es="El Diriá está sobre la playa principal de Tamarindo con todo el pueblo cruzando la calle, lo que lo hace lo opuesto a todos los resorts con portón de Guanacaste. El viaje de 60 minutos desde LIR, el traslado fijo de $130, qué ala pedir y por qué no vas a necesitar carro.",
        intro_en="Most of the big resorts in Guanacaste are behind a gate with no town for miles. The Tamarindo Diriá is the exception. It is a beachfront resort in the middle of the busiest beach town in the province, and when you walk out of the lobby you are on the main street with restaurants on both sides. The transfer from Liberia Airport is about an hour on paved road and there is no checkpoint at the end of it. This page covers the ride, the price and a few things worth knowing before you book.",
        intro_es="La mayoría de los resorts grandes de Guanacaste están detrás de un portón sin pueblo en kilómetros. El Tamarindo Diriá es la excepción. Es un resort frente al mar en medio del pueblo de playa más animado de la provincia, y cuando sales del lobby estás en la calle principal con restaurantes a ambos lados. El traslado desde el Aeropuerto de Liberia es más o menos una hora por asfalto y no hay puesto de control al final. Esta página cubre el viaje, el precio y algunas cosas que conviene saber antes de reservar.",
        where_en="The Tamarindo Diriá is the resort that sits in the middle of Tamarindo itself, on the main beach, with the town's restaurants, bars and surf shops directly across the road. It is the largest and longest-established hotel in Tamarindo, with beachfront and garden wings on either side of the main street, several pools and direct access to the sand. From Liberia Airport it is about 65 km: Route 21 south to Belén, west through Huacas and Villarreal, and straight into town. The road is paved all the way and the drive takes 55 to 70 minutes depending on the time of day and traffic on Tamarindo's main street.",
        where_es="El Tamarindo Diriá es el resort que está en pleno Tamarindo, sobre la playa principal, con los restaurantes, bares y tiendas de surf del pueblo directamente al otro lado de la calle. Es el hotel más grande y de más trayectoria de Tamarindo, con alas frente al mar y de jardín a ambos lados de la calle principal, varias piscinas y acceso directo a la arena. Desde el Aeropuerto de Liberia son unos 65 km: Ruta 21 al sur hasta Belén, al oeste por Huacas y Villarreal, y directo al pueblo. La carretera es asfaltada todo el camino y el viaje tarda 55 a 70 minutos según la hora y el tráfico en la calle principal de Tamarindo.",
        gate_en="The Diriá has a regular hotel entrance on Tamarindo's main street and your driver takes you straight to reception. There is no gate and nothing to register. The one thing worth knowing is that the main street gets slow around sunset, when the whole town walks down to the beach, and our drivers use the back way into the hotel at that hour.",
        gate_es="El Diriá tiene una entrada de hotel normal sobre la calle principal de Tamarindo y tu chofer te lleva directo a recepción. No hay portón ni nada que registrar. Lo único que conviene saber es que la calle principal se pone lenta al atardecer, cuando todo el pueblo baja a la playa, y nuestros choferes usan la entrada por atrás del hotel a esa hora.",
        around_en="Everything in Tamarindo is within walking distance of the Diriá, which is the reason to stay there. The town has more than sixty restaurants, from sodas to sushi to steakhouses, bars with live music, surf schools on the sand, two supermarkets, pharmacies, ATMs and tour offices, all within ten minutes on foot from the lobby. Playa Langosta, which is quieter and more upscale, is a twenty-minute walk south. Playa Grande and the Las Baulas turtle park are across the estuary. The trade-off is noise: the beachfront rooms facing the main strip hear the town on weekend nights, so ask for the garden side if you want quiet.",
        around_es="Todo Tamarindo queda a distancia caminable del Diriá, y esa es la razón para quedarse ahí. El pueblo tiene más de sesenta restaurantes, desde sodas hasta sushi y parrillas, bares con música en vivo, escuelas de surf en la arena, dos supermercados, farmacias, cajeros y oficinas de tours, todo a diez minutos a pie del lobby. Playa Langosta, más tranquila y de mayor categoría, está a veinte minutos caminando hacia el sur. Playa Grande y el parque de tortugas Las Baulas están al otro lado del estero. El precio a pagar es el ruido: las habitaciones frente al mar que dan a la calle principal escuchan el pueblo las noches de fin de semana, así que pide el lado de jardín si quieres silencio.",
        tips_en=[
            "You do not need a rental car in Tamarindo. The town is walkable end to end, tours pick up at the Diriá lobby, and day trips to Flamingo, Conchal or Rincón de la Vieja are easy to book as private transfers.",
            "There is no need to stop for groceries on the way in. The Automercado is a five-minute walk from the hotel, which makes the Diriá the one resort in this series where you can shop after check-in.",
            "The beachfront wing gets the sunset and the garden wing gets the quiet. Both sides share the pools and the beach access, so pick according to how you sleep.",
        ],
        tips_es=[
            "En Tamarindo no necesitas carro de alquiler. El pueblo se camina de punta a punta, los tours recogen en el lobby del Diriá, y las excursiones a Flamingo, Conchal o Rincón de la Vieja se reservan fácil como traslados privados.",
            "No hace falta parar por víveres de camino. El Automercado está a cinco minutos a pie del hotel, lo que hace del Diriá el único resort de esta serie donde puedes hacer compras después del check-in.",
            "El ala frente al mar tiene el atardecer y el ala de jardín tiene el silencio. Ambos lados comparten las piscinas y el acceso a la playa, así que elige según cómo duermes.",
        ],
        faqs_en=[
            ("How far is the Tamarindo Diriá from Liberia Airport?", "About 65 km, a drive of 55 to 70 minutes on paved roads via Belén and Huacas, straight into Tamarindo town."),
            ("How much is a private shuttle from LIR to the Tamarindo Diriá?", "Ruta Pacifico charges a fixed $130 per vehicle for 1 to 5 passengers, $165 for 6 to 9 and $220 for 10 to 12, with taxes, flight tracking and child seats included."),
            ("Can I walk to restaurants from the Tamarindo Diriá?", "Yes, to dozens of them. The Diriá is on Tamarindo's main street, and the town's restaurants, bars, surf schools and supermarkets are all within a 10-minute walk."),
            ("Is the Tamarindo Diriá noisy?", "The beachfront wing on the main strip can hear the town on weekend nights. The garden wing across the road is quieter, and both share the pools and beach access."),
            ("Do I need a car if I stay at the Tamarindo Diriá?", "No. Tamarindo is fully walkable, tours include hotel pickup, and day trips to nearby beaches are easy as private transfers. A car only makes sense if you plan to change locations every day."),
        ],
        faqs_es=[
            ("¿A qué distancia está el Tamarindo Diriá del Aeropuerto de Liberia?", "A unos 65 km, un viaje de 55 a 70 minutos por carretera asfaltada vía Belén y Huacas, directo al pueblo de Tamarindo."),
            ("¿Cuánto cuesta un shuttle privado de LIR al Tamarindo Diriá?", "Ruta Pacifico cobra una tarifa fija de $130 por vehículo para 1 a 5 pasajeros, $165 para 6 a 9 y $220 para 10 a 12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿Puedo caminar a restaurantes desde el Tamarindo Diriá?", "Sí, a decenas. El Diriá está sobre la calle principal de Tamarindo, y los restaurantes, bares, escuelas de surf y supermercados del pueblo están a menos de 10 minutos a pie."),
            ("¿El Tamarindo Diriá es ruidoso?", "El ala frente al mar sobre la calle principal puede escuchar el pueblo las noches de fin de semana. El ala de jardín al otro lado de la calle es más tranquila, y ambas comparten piscinas y acceso a la playa."),
            ("¿Necesito carro si me quedo en el Tamarindo Diriá?", "No. Tamarindo se camina por completo, los tours incluyen recogida en el hotel, y las excursiones a playas cercanas son fáciles como traslados privados. Un carro solo tiene sentido si planeas cambiar de lugar cada día."),
        ],
    ),
]


def sql_str(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


def faq_json(pairs):
    return json.dumps([{"q": q, "a": a} for q, a in pairs], ensure_ascii=False, indent=4)


def body_en(h):
    p1, p2, p3 = h["fares"]
    gate_head = "## What the security gate needs" if h["gated"] else "## Arriving at the hotel"
    tips = "\n".join(f"- {t}" for t in h["tips_en"])
    shared_row = ("Does not enter the gated estate and drops you at the nearest town" if h["gated"]
                  else "Waits for other flights, which is slow with children")
    taxi_row = ("An unregistered vehicle is held at the gate" if h["gated"]
                else "No flight tracking, cash only, no child seats")
    gated_row = "Yes, the driver has to be registered in advance" if h["gated"] else "No community checkpoint"
    return f"""
{h['intro_en']}

## Quick facts

| | |
| --- | --- |
| Distance from LIR | {h['km']} |
| Drive time | {h['time']}, paved the whole way |
| Private transfer, 1–5 passengers | ${p1} per vehicle, fixed |
| Private transfer, 6–9 passengers | ${p2} per vehicle |
| Private transfer, 10–12 passengers | ${p3} per vehicle |
| Included | Taxes, tolls, flight tracking, child seats, one stop for groceries |
| Gated access | {gated_row} |

## Where the hotel is

{h['where_en']}

## The drive from the airport

Your driver waits at the arrivals exit holding a sign with your name. We track the flight, so if it lands early or late the driver is still there when you walk out, and you leave as soon as you have your bags rather than waiting for a van to fill. The road is paved from start to finish and you never go through Liberia town, since the airport sits west of the city and Route 21 heads straight for the coast. The range we give for the drive time comes from daytime traffic at the junctions along the way, nothing more. If you need to stop for groceries, cash or a pharmacy, tell the driver; the vehicle is yours for the trip.

Live prices and booking are on the [LIR to {h['short']} route page](/private-shuttle/{h['route']}).

{gate_head}

{h['gate_en']}

## What is around the {h['short']}

{h['around_en']}

If you want to see how this hotel fits with the rest of the coast, and which beaches have a town you can walk to, our guide to the [best hotels in Guanacaste by zone]({PILLAR}) covers all of them.

## Ways to get there from LIR

| Option | Time to the hotel | Cost | Worth knowing |
| --- | --- | --- | --- |
| Private transfer | {h['time']}, direct | ${p1} fixed for 1–5 passengers | Driver registered at the gate, flight tracked |
| Hotel car service | Same drive | Premium rate through the concierge | Usually the most expensive option |
| Rental car | Same drive plus pickup paperwork | $40–90 a day plus mandatory insurance and a deposit | Only pays off if you leave the resort every day |
| Shared shuttle | 1.5–2.5 h with stops | About $25–35 a person | {shared_row} |
| Airport taxi | Same drive | $100–150, negotiated on the spot | {taxi_row} |

For two people a private transfer costs about the same as a taxi and takes the guesswork out of the arrival. For a family of four it works out cheaper per person than a shared shuttle and takes less than half the time.

## A few things our drivers would tell you

{tips}

## Booking

The [Liberia Airport to {h['short']} private transfer](/private-shuttle/{h['route']}) can be booked online in a couple of minutes at a fixed price per vehicle, with the flight tracked, the driver registered at the resort and child seats included. If you would rather ask something first, write to us on WhatsApp and one of the drivers will answer.
"""


def body_es(h):
    p1, p2, p3 = h["fares"]
    gate_head = "## Qué necesita el portón de seguridad" if h["gated"] else "## La llegada al hotel"
    tips = "\n".join(f"- {t}" for t in h["tips_es"])
    shared_row = ("No entra a la finca privada y te deja en el pueblo más cercano" if h["gated"]
                  else "Espera otros vuelos, lo que es lento con niños")
    taxi_row = ("Un vehículo no registrado queda retenido en el portón" if h["gated"]
                else "Sin seguimiento de vuelo, solo efectivo, sin sillas para niños")
    gated_row = "Sí, el chofer debe estar registrado de antemano" if h["gated"] else "Sin puesto de control comunitario"
    return f"""
{h['intro_es']}

## Datos rápidos

| | |
| --- | --- |
| Distancia desde LIR | {h['km']} |
| Tiempo de viaje | {h['time']}, asfaltado todo el camino |
| Traslado privado, 1–5 pasajeros | ${p1} por vehículo, fijo |
| Traslado privado, 6–9 pasajeros | ${p2} por vehículo |
| Traslado privado, 10–12 pasajeros | ${p3} por vehículo |
| Incluye | Impuestos, peajes, seguimiento de vuelo, sillas para niños, una parada para víveres |
| Acceso con portón | {gated_row} |

## Dónde queda el hotel

{h['where_es']}

## El viaje desde el aeropuerto

Tu chofer espera a la salida de llegadas con un rótulo con tu nombre. Monitoreamos el vuelo, así que si aterriza antes o después el chofer sigue ahí cuando sales, y te vas en cuanto tienes las maletas en vez de esperar a que se llene una van. La carretera es asfaltada de principio a fin y nunca pasas por Liberia centro, porque el aeropuerto queda al oeste de la ciudad y la Ruta 21 sale directo hacia la costa. El rango que damos para el tiempo de viaje viene del tráfico de día en los cruces del camino, nada más. Si necesitas parar por víveres, efectivo o una farmacia, díselo al chofer; el vehículo es tuyo durante el viaje.

Los precios actualizados y la reserva están en la [página de la ruta LIR a {h['short_es']}](/private-shuttle/{h['route']}).

{gate_head}

{h['gate_es']}

## Qué hay alrededor del {h['short_es']}

{h['around_es']}

Si quieres ver cómo encaja este hotel con el resto de la costa, y qué playas tienen un pueblo al que se puede caminar, nuestra guía de los [mejores hoteles de Guanacaste por zona]({PILLAR}) los cubre todos.

## Formas de llegar desde LIR

| Opción | Tiempo hasta el hotel | Costo | Conviene saber |
| --- | --- | --- | --- |
| Traslado privado | {h['time']}, directo | ${p1} fijo para 1–5 pasajeros | Chofer registrado en el portón, vuelo monitoreado |
| Servicio de carro del hotel | El mismo trayecto | Tarifa premium a través del concierge | Suele ser la opción más cara |
| Carro de alquiler | El mismo trayecto más trámites de entrega | $40–90 al día más seguro obligatorio y depósito | Solo compensa si sales del resort todos los días |
| Shuttle compartido | 1,5–2,5 h con paradas | Unos $25–35 por persona | {shared_row} |
| Taxi del aeropuerto | El mismo trayecto | $100–150, negociado en el momento | {taxi_row} |

Para dos personas un traslado privado cuesta más o menos lo mismo que un taxi y le quita la incertidumbre a la llegada. Para una familia de cuatro sale más barato por persona que un shuttle compartido y tarda menos de la mitad.

## Algunas cosas que te dirían nuestros choferes

{tips}

## Reserva

El [traslado privado del Aeropuerto de Liberia al {h['short_es']}](/private-shuttle/{h['route']}) se reserva en línea en un par de minutos a precio fijo por vehículo, con el vuelo monitoreado, el chofer registrado en el resort y las sillas para niños incluidas. Si prefieres preguntar algo primero, escríbenos por WhatsApp y te contesta uno de los choferes.
"""


def main():
    out = []
    out.append("""-- ============================================================
-- Seed: one "Liberia Airport to <hotel>" article per major
-- Guanacaste resort (EN + ES). GENERATED by gen_hotel_posts.py —
-- edit that file and regenerate rather than editing this one.
--
-- Run AFTER blog_schema.sql, i18n_es_schema.sql and blog_seed_03.sql
-- (the pillar article these pages link to). Idempotent: keyed by slug.
-- ============================================================
""")
    for h in HOTELS:
        tags = "array[" + ",".join(sql_str(t) for t in h["tags"]) + "]"
        out.append(f"""
-- ------------------------------------------------------------
-- {h['slug']}
-- ------------------------------------------------------------
insert into public.blog_posts_ruta_pacifico
  (slug, title, excerpt, cover_image_url, cover_image_alt, category, tags, published, published_at, faqs, content_md)
values
(
  {sql_str(h['slug'])},
  {sql_str(h['title_en'])},
  {sql_str(h['excerpt_en'])},
  {sql_str(COVER_DIR + '/' + h['photo'])},
  {sql_str(h['cover_alt'])},
  'getting-around',
  {tags},
  true,
  now(),
  {sql_str(faq_json(h['faqs_en']))}::jsonb,
  $md${body_en(h)}$md$
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
  title_es = {sql_str(h['title_es'])},
  excerpt_es = {sql_str(h['excerpt_es'])},
  cover_image_alt_es = {sql_str(h['cover_alt_es'])},
  faqs_es = {sql_str(faq_json(h['faqs_es']))}::jsonb,
  content_md_es = $es${body_es(h)}$es$
where slug = {sql_str(h['slug'])};
""")
    print("".join(out))


if __name__ == "__main__":
    main()
