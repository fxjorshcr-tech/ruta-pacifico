#!/usr/bin/env python3
"""
Generates supabase/blog_seed_04.sql: one "Liberia Airport to <hotel>" article
per major Guanacaste resort, in English with its Spanish twin.

    python3 supabase/gen_hotel_posts.py > supabase/blog_seed_04.sql

Each article shares a skeleton (drive, gate, options, what's around, tips,
FAQ) but every hotel-specific paragraph is written by hand below, so the
pages are not thin duplicates of each other. Fares are the live per-vehicle
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
        where_en="The Four Seasons sits at the neck of **Peninsula Papagayo**, a private 1,400-acre enclave on the north shore of Culebra Bay, 30 km from Liberia Airport. It is the closest luxury resort to LIR in all of Costa Rica: the whole drive is on paved road, first Route 21 north past the airport, then the Guardia turn-off west toward Playa Panamá and the peninsula gate. The resort has two beaches (Playa Virador on the bay side, Playa Blanca on the Pacific side), an Arnold Palmer golf course, and the kind of jungle-meets-ocean setting that made Papagayo famous.",
        where_es="El Four Seasons está en el cuello de **Península Papagayo**, un enclave privado de 570 hectáreas en la orilla norte de Bahía Culebra, a 30 km del Aeropuerto de Liberia. Es el resort de lujo más cercano a LIR de toda Costa Rica: todo el trayecto es asfaltado, primero por la Ruta 21 hacia el norte pasando el aeropuerto y luego el desvío de Guardia hacia el oeste rumbo a Playa Panamá y el portón de la península. El resort tiene dos playas (Playa Virador del lado de la bahía y Playa Blanca del lado del Pacífico), un campo de golf de Arnold Palmer y ese entorno de selva con mar que hizo famoso a Papagayo.",
        gate_en="Peninsula Papagayo has a manned security checkpoint at the entrance, and it is strict: an unregistered vehicle waits while the guard phones the resort. Security expects the **driver’s full name, cédula (national ID) number, and the vehicle’s make, plate and colour** on your reservation before you arrive. When you book with Ruta Pacifico we send those details to the Four Seasons in advance, so the gate has your driver on the list and you roll straight through to the lobby.",
        gate_es="Península Papagayo tiene un puesto de seguridad con guarda en la entrada, y es estricto: un vehículo no registrado espera mientras el guarda llama al resort. La seguridad espera el **nombre completo del chofer, su número de cédula y la marca, placa y color del vehículo** en tu reserva antes de que llegues. Cuando reservas con Ruta Pacifico enviamos esos datos al Four Seasons con anticipación, para que el portón tenga a tu chofer en la lista y pases directo hasta el lobby.",
        around_en="**Nothing, and that is the point.** There is no town on Peninsula Papagayo. Outside the resort you have the Marina Papagayo with a couple of restaurants, and the Prieta Beach Club for members. The nearest real town is **Playas del Coco**, 20–25 minutes by car, with restaurants, bars, a supermarket and a public beach. Most Four Seasons guests eat at the resort every night; those who want a change of scene book a transfer to Coco or to **El Mangroove** on the gulf for dinner.",
        around_es="**Nada, y ese es el punto.** No hay pueblo en Península Papagayo. Fuera del resort tienes la Marina Papagayo con un par de restaurantes y el Prieta Beach Club para miembros. El pueblo real más cercano es **Playas del Coco**, a 20–25 minutos en carro, con restaurantes, bares, supermercado y playa pública. La mayoría de huéspedes del Four Seasons cena en el resort todas las noches; quien quiere cambiar de aire reserva un traslado al Coco o a **El Mangroove** en el golfo para cenar.",
        tips_en=[
            "**Stop for groceries on the way.** There is no shop on the peninsula. Ask your driver to stop at the Automercado in Liberia or the supermarket in Guardia — it is free on a private transfer.",
            "**Check-in is 3 p.m.** If you land at 11 a.m., the 35-minute drive gets you there early. The resort will hold luggage; a pool day while you wait is standard.",
            "**Book day trips as private transfers.** Rincón de la Vieja (1 h 15), Tamarindo (1 h 15) and the Coco sunset strip are all easy from here; the resort concierge quotes are usually higher than booking direct.",
        ],
        tips_es=[
            "**Para a comprar víveres en el camino.** No hay tienda en la península. Pídele a tu chofer parar en el Automercado de Liberia o en el supermercado de Guardia; en un traslado privado no tiene costo.",
            "**El check-in es a las 3 p. m.** Si aterrizas a las 11 a. m., los 35 minutos de viaje te dejan temprano. El resort guarda el equipaje; pasar el rato en la piscina mientras esperas es lo normal.",
            "**Reserva las excursiones como traslados privados.** Rincón de la Vieja (1 h 15), Tamarindo (1 h 15) y el atardecer en el Coco son fáciles desde aquí; las cotizaciones del concierge suelen ser más altas que reservar directo.",
        ],
        faqs_en=[
            ("How long is the drive from Liberia Airport to the Four Seasons Papagayo?", "30 to 40 minutes on fully paved roads. The resort is about 30 km (19 miles) from LIR, making it the closest luxury resort to the airport in Costa Rica."),
            ("Does the Four Seasons Papagayo offer an airport shuttle?", "The resort arranges private car transfers through its concierge at a premium rate. Ruta Pacifico runs the same door-to-door private transfer, with flight tracking and gate registration included, for a fixed $105 per vehicle for up to 5 passengers."),
            ("Is there Uber at Liberia Airport to get to Papagayo?", "Not reliably. Uber drivers are scarce in Guanacaste and frequently cancel airport requests, and an unregistered car will be held at the Peninsula Papagayo security gate. Pre-book a transfer whose driver details are sent to the resort in advance."),
            ("Can I go out to dinner outside the Four Seasons?", "Yes, but you will need a car or transfer. There is no town on the peninsula; Playas del Coco is 20–25 minutes away and has the nearest restaurants and bars."),
        ],
        faqs_es=[
            ("¿Cuánto dura el viaje del Aeropuerto de Liberia al Four Seasons Papagayo?", "Entre 30 y 40 minutos por carretera completamente asfaltada. El resort está a unos 30 km (19 millas) de LIR, lo que lo convierte en el resort de lujo más cercano al aeropuerto en Costa Rica."),
            ("¿El Four Seasons Papagayo ofrece shuttle desde el aeropuerto?", "El resort organiza traslados privados a través de su concierge con tarifa premium. Ruta Pacifico hace el mismo traslado privado puerta a puerta, con seguimiento de vuelo y registro en el portón incluidos, por un precio fijo de $105 por vehículo para hasta 5 pasajeros."),
            ("¿Hay Uber en el Aeropuerto de Liberia para ir a Papagayo?", "No de forma confiable. Hay pocos choferes de Uber en Guanacaste y suelen cancelar las solicitudes del aeropuerto, y un carro no registrado queda retenido en el portón de seguridad de Península Papagayo. Reserva un traslado cuyos datos del chofer se envíen al resort con anticipación."),
            ("¿Puedo salir a cenar fuera del Four Seasons?", "Sí, pero necesitas carro o traslado. No hay pueblo en la península; Playas del Coco está a 20–25 minutos y tiene los restaurantes y bares más cercanos."),
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
        where_en="**Nekajui** opened in 2025 at the far tip of **Peninsula Papagayo**, past the Four Seasons and the Andaz, on a headland above Playa Nacascolo. It is the newest and most secluded ultra-luxury address in Costa Rica: treehouse-style suites, a cliffside pool, and a funicular down to the beach. From Liberia Airport it is 34 km on paved road — Route 21 north, the Guardia turn-off toward Playa Panamá, the peninsula gate, and then the winding resort road along the ridge to the point.",
        where_es="**Nekajui** abrió en 2025 en la punta más lejana de **Península Papagayo**, pasando el Four Seasons y el Andaz, en un promontorio sobre Playa Nacascolo. Es la dirección de ultralujo más nueva y aislada de Costa Rica: suites estilo casa del árbol, piscina al borde del acantilado y un funicular hasta la playa. Desde el Aeropuerto de Liberia son 34 km por asfalto: Ruta 21 hacia el norte, el desvío de Guardia hacia Playa Panamá, el portón de la península y luego la carretera serpenteante del resort por la cresta hasta la punta.",
        gate_en="Nekajui is behind the same **Peninsula Papagayo security checkpoint** as the Four Seasons, and then a second resort gate of its own. Both expect the **driver’s full name, cédula number and vehicle details** on your reservation. Ruta Pacifico sends them to the resort when you book, so neither gate holds you up; arriving in an unregistered taxi means waiting at the first checkpoint while the guard calls the front desk.",
        gate_es="Nekajui está detrás del mismo **puesto de seguridad de Península Papagayo** que el Four Seasons, y luego de un segundo portón propio del resort. Ambos esperan el **nombre completo del chofer, su número de cédula y los datos del vehículo** en tu reserva. Ruta Pacifico los envía al resort cuando reservas, así ninguno de los dos portones te detiene; llegar en un taxi no registrado significa esperar en el primer puesto mientras el guarda llama a recepción.",
        around_en="Nekajui is the end of the peninsula road, so there is even less around it than the Four Seasons: the resort’s own restaurants, the beach club, and the Marina Papagayo a 10-minute drive back. The nearest town with a street to walk on is **Playas del Coco**, about 30 minutes away. Guests come here precisely to disappear for a week; plan meals at the resort and book a transfer if you want one night out in Coco.",
        around_es="Nekajui es el final de la carretera de la península, así que hay aún menos alrededor que en el Four Seasons: los restaurantes propios del resort, el club de playa y la Marina Papagayo a 10 minutos de regreso. El pueblo más cercano con una calle para caminar es **Playas del Coco**, a unos 30 minutos. Los huéspedes vienen aquí justamente para desaparecer una semana; planifica las comidas en el resort y reserva un traslado si quieres una noche fuera en el Coco.",
        tips_en=[
            "**Same price as the Four Seasons.** Nekajui is on the Peninsula Papagayo route, so the private transfer is the same fixed fare even though it is 10 minutes farther along the ridge.",
            "**Groceries and pharmacy in Liberia.** There is no shop anywhere on the peninsula; a stop at the Automercado on the way is free with a private transfer.",
            "**Night arrivals are fine.** The peninsula road is paved and lit at the gate; our drivers do the last stretch to the point daily and the resort is staffed 24 hours.",
        ],
        tips_es=[
            "**Mismo precio que el Four Seasons.** Nekajui está en la ruta de Península Papagayo, así que el traslado privado tiene la misma tarifa fija aunque esté 10 minutos más adelante por la cresta.",
            "**Víveres y farmacia en Liberia.** No hay tienda en ninguna parte de la península; una parada en el Automercado en el camino no tiene costo con un traslado privado.",
            "**Llegar de noche no es problema.** La carretera de la península es asfaltada e iluminada en el portón; nuestros choferes hacen el último tramo hasta la punta a diario y el resort tiene personal 24 horas.",
        ],
        faqs_en=[
            ("How far is Nekajui from Liberia Airport?", "About 34 km (21 miles), a 35 to 45 minute private transfer on paved roads. It is at the far tip of Peninsula Papagayo, about 10 minutes beyond the Four Seasons."),
            ("How much is a private transfer from LIR to Nekajui?", "Ruta Pacifico charges a fixed $105 per vehicle for 1–5 passengers ($130 for 6–9, $170 for 10–12), including taxes, flight tracking, child seats and registration of the driver at the Peninsula Papagayo gate."),
            ("Do I need to register my transfer with Nekajui before arrival?", "Yes. Both the Peninsula Papagayo checkpoint and the resort’s own gate expect the driver’s name, ID number and vehicle details in advance. Ruta Pacifico sends them to the resort automatically when you book."),
            ("Is Nekajui near a town?", "No. The nearest town is Playas del Coco, about 30 minutes by car. The resort is designed to be self-contained, with its own restaurants and beach club."),
        ],
        faqs_es=[
            ("¿A qué distancia está Nekajui del Aeropuerto de Liberia?", "A unos 34 km (21 millas), un traslado privado de 35 a 45 minutos por carretera asfaltada. Está en la punta más lejana de Península Papagayo, unos 10 minutos más allá del Four Seasons."),
            ("¿Cuánto cuesta un traslado privado de LIR a Nekajui?", "Ruta Pacifico cobra una tarifa fija de $105 por vehículo para 1–5 pasajeros ($130 para 6–9, $170 para 10–12), que incluye impuestos, seguimiento de vuelo, sillas para niños y el registro del chofer en el portón de Península Papagayo."),
            ("¿Tengo que registrar mi traslado con Nekajui antes de llegar?", "Sí. Tanto el puesto de Península Papagayo como el portón propio del resort esperan el nombre del chofer, su cédula y los datos del vehículo con anticipación. Ruta Pacifico los envía al resort automáticamente al reservar."),
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
        where_en="The **Andaz** is Hyatt’s design-forward resort on the calm, bay side of **Peninsula Papagayo**, a few minutes inside the gate and before the Four Seasons. It looks out over Culebra Bay, with two small beaches, low-rise rooms tucked into the dry forest and a more relaxed, younger feel than its neighbours. From Liberia Airport it is 31 km entirely on paved road: Route 21 north, the Guardia turn-off west past Playa Panamá, and the peninsula entrance.",
        where_es="El **Andaz** es el resort de diseño de Hyatt del lado calmo de la bahía en **Península Papagayo**, a pocos minutos dentro del portón y antes del Four Seasons. Mira hacia Bahía Culebra, con dos playas pequeñas, habitaciones bajas escondidas en el bosque seco y un ambiente más relajado y joven que sus vecinos. Desde el Aeropuerto de Liberia son 31 km todo por asfalto: Ruta 21 hacia el norte, el desvío de Guardia hacia el oeste pasando Playa Panamá y la entrada de la península.",
        gate_en="The Andaz is inside the **Peninsula Papagayo security gate**. The checkpoint expects the **driver’s full name, cédula number and vehicle plate** to be on file with the hotel before arrival; unregistered vehicles are held while the guard calls. Booking with Ruta Pacifico means those details go to the Andaz ahead of time and the gate simply waves you through.",
        gate_es="El Andaz está dentro del **portón de seguridad de Península Papagayo**. El puesto espera que el **nombre completo del chofer, su número de cédula y la placa del vehículo** estén registrados en el hotel antes de la llegada; los vehículos no registrados quedan retenidos mientras el guarda llama. Reservar con Ruta Pacifico significa que esos datos llegan al Andaz con anticipación y en el portón simplemente te dejan pasar.",
        around_en="Like every resort on the peninsula, the Andaz has **no town nearby**. What it does have is the best position for getting out: the Marina Papagayo restaurants are 5 minutes away, **El Mangroove** and the Playa Panamá beach bars are 10 minutes, and **Playas del Coco**, the only real town in the zone, is 20 minutes. If you want to alternate resort nights with a casual dinner out, the Andaz is the easiest of the three peninsula hotels to do it from.",
        around_es="Como todos los resorts de la península, el Andaz **no tiene pueblo cerca**. Lo que sí tiene es la mejor posición para salir: los restaurantes de la Marina Papagayo están a 5 minutos, **El Mangroove** y los bares de playa de Playa Panamá a 10, y **Playas del Coco**, el único pueblo real de la zona, a 20 minutos. Si quieres alternar noches de resort con una cena casual afuera, el Andaz es el más fácil de los tres hoteles de la península para hacerlo.",
        tips_en=[
            "**Same fare as the Four Seasons and Nekajui.** All three are on the Peninsula Papagayo route, so the private transfer is one fixed price.",
            "**Playa Panamá for groceries.** There is a small supermarket in Playa Panamá village just before the gate; the Automercado in Liberia is bigger. Either stop is free on a private transfer.",
            "**Combine with Rincón de la Vieja.** The volcano park is 1 h 15 from the Andaz; a private round trip with waiting time is the easiest way to do it without a rental car.",
        ],
        tips_es=[
            "**Misma tarifa que el Four Seasons y Nekajui.** Los tres están en la ruta de Península Papagayo, así que el traslado privado tiene un solo precio fijo.",
            "**Playa Panamá para víveres.** Hay un supermercado pequeño en el pueblo de Playa Panamá justo antes del portón; el Automercado de Liberia es más grande. Cualquiera de las dos paradas es gratis en un traslado privado.",
            "**Combínalo con Rincón de la Vieja.** El parque del volcán está a 1 h 15 del Andaz; un viaje privado de ida y vuelta con tiempo de espera es la forma más fácil de hacerlo sin carro de alquiler.",
        ],
        faqs_en=[
            ("How long does it take to get from Liberia Airport to the Andaz Papagayo?", "30 to 40 minutes by private transfer, about 31 km (19 miles) on paved roads. The Andaz is one of the closest resorts to LIR."),
            ("How much is a shuttle from LIR to the Andaz Costa Rica?", "A Ruta Pacifico private transfer is a fixed $105 per vehicle for up to 5 passengers, $130 for 6–9 and $170 for 10–12, taxes, flight tracking and child seats included."),
            ("Do I need to register my driver with the Andaz?", "Yes. The Peninsula Papagayo gate requires the driver’s name, ID and vehicle details to be on your hotel reservation. Ruta Pacifico sends them to the Andaz when you book."),
            ("What is near the Andaz Papagayo?", "The Marina Papagayo (5 min), Playa Panamá and El Mangroove (10 min) and the town of Playas del Coco (20 min). There is no walkable town at the resort itself."),
        ],
        faqs_es=[
            ("¿Cuánto se tarda del Aeropuerto de Liberia al Andaz Papagayo?", "De 30 a 40 minutos en traslado privado, unos 31 km (19 millas) por carretera asfaltada. El Andaz es uno de los resorts más cercanos a LIR."),
            ("¿Cuánto cuesta un shuttle de LIR al Andaz Costa Rica?", "Un traslado privado de Ruta Pacifico tiene precio fijo de $105 por vehículo para hasta 5 pasajeros, $130 para 6–9 y $170 para 10–12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿Tengo que registrar a mi chofer con el Andaz?", "Sí. El portón de Península Papagayo exige que el nombre, la cédula y los datos del vehículo del chofer estén en tu reserva del hotel. Ruta Pacifico los envía al Andaz al reservar."),
            ("¿Qué hay cerca del Andaz Papagayo?", "La Marina Papagayo (5 min), Playa Panamá y El Mangroove (10 min) y el pueblo de Playas del Coco (20 min). No hay pueblo caminable en el resort."),
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
        where_en="**Secrets Papagayo** is an adults-only all-inclusive on Playa Arenilla, on the mainland shore of the Gulf of Papagayo, just before the turn to Playa Panamá and the peninsula. It is **not** inside the Peninsula Papagayo gate, which makes the arrival simpler: 28 km from Liberia Airport, all paved, Route 21 north then the Guardia road west, and the resort entrance is right off the coastal road. The beach is calm, gulf-facing water, and the resort is the most popular honeymoon address in Zone 1.",
        where_es="**Secrets Papagayo** es un todo incluido solo para adultos en Playa Arenilla, en la orilla continental del Golfo de Papagayo, justo antes del desvío a Playa Panamá y la península. **No** está dentro del portón de Península Papagayo, lo que hace la llegada más sencilla: 28 km desde el Aeropuerto de Liberia, todo asfaltado, Ruta 21 hacia el norte y luego la carretera de Guardia hacia el oeste, con la entrada del resort justo sobre la carretera costera. La playa es de aguas calmas del golfo, y el resort es la dirección de luna de miel más popular de la Zona 1.",
        gate_en="Secrets has its own entrance gate but no community checkpoint, so arrival is quick: the guard checks the guest name and lets the vehicle through to the lobby. We still send your driver’s name and vehicle details to the resort when you book, which is what the front desk prefers for late-night arrivals.",
        gate_es="Secrets tiene su propio portón de entrada pero no un puesto de control comunitario, así que la llegada es rápida: el guarda verifica el nombre del huésped y deja pasar el vehículo hasta el lobby. Igual enviamos el nombre del chofer y los datos del vehículo al resort al reservar, que es lo que recepción prefiere para llegadas de madrugada.",
        around_en="Secrets is all-inclusive and most guests never leave, but if you want to, you are better placed than the peninsula resorts. **Playa Panamá** with its beach bars is 5 minutes away, **Playa Hermosa** 10 minutes, and **Playas del Coco** — the only real town in the zone, with restaurants, bars and a supermarket — about 15 minutes by car. There is nothing to walk to from the resort itself.",
        around_es="Secrets es todo incluido y la mayoría de huéspedes nunca sale, pero si quieres hacerlo estás mejor ubicado que en los resorts de la península. **Playa Panamá** con sus bares de playa está a 5 minutos, **Playa Hermosa** a 10, y **Playas del Coco**, el único pueblo real de la zona, con restaurantes, bares y supermercado, a unos 15 minutos en carro. Desde el resort en sí no hay adónde caminar.",
        tips_en=[
            "**The transfer is the Papagayo fare.** Secrets is on the same route as the peninsula hotels, so it is the same fixed $105 for up to 5 passengers.",
            "**Adults-only means no child seats needed, but couples travel light.** A private transfer still beats a shared van: you leave the airport when you land, not when the van fills.",
            "**Pair it with a Coco sunset.** Book a private round trip to Playas del Coco one evening for a dinner outside the all-inclusive; 15 minutes each way.",
        ],
        tips_es=[
            "**El traslado tiene la tarifa de Papagayo.** Secrets está en la misma ruta que los hoteles de la península, así que son los mismos $105 fijos para hasta 5 pasajeros.",
            "**Solo adultos significa sin sillas para niños, pero las parejas viajan ligero.** Un traslado privado igual le gana a una van compartida: sales del aeropuerto cuando aterrizas, no cuando la van se llena.",
            "**Combínalo con un atardecer en el Coco.** Reserva un viaje privado de ida y vuelta a Playas del Coco una noche para cenar fuera del todo incluido; 15 minutos por trayecto.",
        ],
        faqs_en=[
            ("How far is Secrets Papagayo from Liberia Airport?", "About 28 km (17 miles), a 30 to 35 minute drive on paved roads. It is on the mainland shore of the Gulf of Papagayo, outside the Peninsula Papagayo gate."),
            ("How much is a private transfer from LIR to Secrets Papagayo?", "Ruta Pacifico charges a fixed $105 per vehicle for 1–5 passengers, $130 for 6–9 and $170 for 10–12, with taxes and flight tracking included."),
            ("Is Secrets Papagayo inside the Peninsula Papagayo security gate?", "No. Secrets is on Playa Arenilla, before the peninsula turn-off, with its own simple entrance gate. Arrival is faster than at the Four Seasons, Andaz or Nekajui."),
            ("Is there a town near Secrets Papagayo?", "Playas del Coco is about 15 minutes by car and is the nearest town with restaurants, bars and shops. Playa Panamá, 5 minutes away, has a few beach bars."),
        ],
        faqs_es=[
            ("¿A qué distancia está Secrets Papagayo del Aeropuerto de Liberia?", "A unos 28 km (17 millas), un viaje de 30 a 35 minutos por carretera asfaltada. Está en la orilla continental del Golfo de Papagayo, fuera del portón de Península Papagayo."),
            ("¿Cuánto cuesta un traslado privado de LIR a Secrets Papagayo?", "Ruta Pacifico cobra una tarifa fija de $105 por vehículo para 1–5 pasajeros, $130 para 6–9 y $170 para 10–12, con impuestos y seguimiento de vuelo incluidos."),
            ("¿Secrets Papagayo está dentro del portón de seguridad de Península Papagayo?", "No. Secrets está en Playa Arenilla, antes del desvío a la península, con su propio portón de entrada sencillo. La llegada es más rápida que en el Four Seasons, el Andaz o Nekajui."),
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
        where_en="The two Riu resorts — **Riu Guanacaste** and the newer, higher-end **Riu Palace Costa Rica** — sit side by side on **Playa Matapalo**, a long, wild Pacific beach north of Playas del Coco, reached through the town of Sardinal. They are the largest all-inclusives in Guanacaste and the go-to choice for Canadian and American package travellers. From Liberia Airport it is 33 km: Route 21 north, the Guardia/Sardinal road west, and a final paved stretch down to the coast. Count on 35–40 minutes.",
        where_es="Los dos resorts Riu, el **Riu Guanacaste** y el más nuevo y de mayor categoría **Riu Palace Costa Rica**, están uno junto al otro en **Playa Matapalo**, una playa larga y salvaje del Pacífico al norte de Playas del Coco, a la que se llega por el pueblo de Sardinal. Son los todo incluido más grandes de Guanacaste y la opción habitual de viajeros canadienses y estadounidenses con paquete. Desde el Aeropuerto de Liberia son 33 km: Ruta 21 hacia el norte, la carretera de Guardia/Sardinal hacia el oeste y un último tramo asfaltado hasta la costa. Calcula 35–40 minutos.",
        gate_en="The Riu complex has a single entrance gate shared by both hotels; the guard checks the guest name and directs the vehicle to the right lobby. No community checkpoint and no pre-registration required, though we send your driver’s details to the hotel anyway so late arrivals go smoothly.",
        gate_es="El complejo Riu tiene un solo portón de entrada compartido por los dos hoteles; el guarda verifica el nombre del huésped y dirige el vehículo al lobby correcto. No hay puesto de control comunitario ni registro previo obligatorio, aunque igual enviamos los datos de tu chofer al hotel para que las llegadas tardías sean fluidas.",
        around_en="Playa Matapalo is beautiful and empty: **there is no town, shop or restaurant outside the resorts.** Sardinal, 10 minutes inland, is a working Costa Rican town with a supermarket and sodas but not a tourist stop. For a night out, **Playas del Coco** is 20 minutes by car and has the restaurants, bars and the public beach that most Riu guests visit at least once. Package tours pick up at the lobby, so most guests never need a car.",
        around_es="Playa Matapalo es preciosa y vacía: **no hay pueblo, tienda ni restaurante fuera de los resorts.** Sardinal, a 10 minutos tierra adentro, es un pueblo costarricense de trabajo con supermercado y sodas, pero no un destino turístico. Para una noche fuera, **Playas del Coco** está a 20 minutos en carro y tiene los restaurantes, bares y la playa pública que la mayoría de huéspedes del Riu visita al menos una vez. Los tours de paquete recogen en el lobby, así que la mayoría nunca necesita carro.",
        tips_en=[
            "**Skip the shared package bus.** Tour-operator transfers stop at every resort on the gulf and can take 1.5 hours; a private transfer is 35 minutes and costs less per person for a family of four.",
            "**Say which Riu.** The two lobbies are 500 m apart; tell us whether you are at Riu Guanacaste or Riu Palace so the driver goes to the right door.",
            "**Sunscreen and snacks from Liberia.** Resort shop prices are high; a free supermarket stop on the way saves real money for a week.",
        ],
        tips_es=[
            "**Evita el bus compartido del paquete.** Los traslados de los operadores paran en todos los resorts del golfo y pueden tardar 1,5 horas; un traslado privado son 35 minutos y cuesta menos por persona para una familia de cuatro.",
            "**Di cuál Riu.** Los dos lobbies están a 500 m uno del otro; dinos si estás en el Riu Guanacaste o en el Riu Palace para que el chofer llegue a la puerta correcta.",
            "**Bloqueador y snacks desde Liberia.** Los precios de la tienda del resort son altos; una parada gratuita en el supermercado en el camino ahorra dinero de verdad en una semana.",
        ],
        faqs_en=[
            ("How far is the Riu Guanacaste from Liberia Airport?", "About 33 km (20 miles), a 35 to 40 minute private transfer on paved roads via Sardinal. The Riu Palace is on the same beach, next door."),
            ("How much is a private shuttle from LIR to the Riu?", "Ruta Pacifico charges a fixed $120 per vehicle for 1–5 passengers, $130 for 6–9 and $185 for 10–12, taxes, flight tracking and child seats included."),
            ("Is a private transfer better than the Riu package shuttle?", "The package bus waits for several flights and stops at multiple resorts, often taking 1.5 hours. A private transfer leaves when you land and takes 35 minutes; for four or more people it is usually cheaper per person."),
            ("Is there anything to do outside the Riu resorts?", "Not on foot. Playa Matapalo has no town. Playas del Coco, 20 minutes by car, has restaurants, bars and shops, and is the usual night out for Riu guests."),
        ],
        faqs_es=[
            ("¿A qué distancia está el Riu Guanacaste del Aeropuerto de Liberia?", "A unos 33 km (20 millas), un traslado privado de 35 a 40 minutos por carretera asfaltada vía Sardinal. El Riu Palace está en la misma playa, al lado."),
            ("¿Cuánto cuesta un shuttle privado de LIR al Riu?", "Ruta Pacifico cobra una tarifa fija de $120 por vehículo para 1–5 pasajeros, $130 para 6–9 y $185 para 10–12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿Es mejor un traslado privado que el shuttle del paquete del Riu?", "El bus del paquete espera varios vuelos y para en varios resorts, y suele tardar 1,5 horas. Un traslado privado sale cuando aterrizas y tarda 35 minutos; para cuatro o más personas suele ser más barato por persona."),
            ("¿Hay algo que hacer fuera de los resorts Riu?", "No a pie. Playa Matapalo no tiene pueblo. Playas del Coco, a 20 minutos en carro, tiene restaurantes, bares y comercios, y es la salida nocturna habitual de los huéspedes del Riu."),
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
        where_en="The **Westin Reserva Conchal** is the largest resort in Guanacaste: an all-inclusive with a Robert Trent Jones II golf course, a huge free-form pool and direct access to **Playa Conchal**, whose sand is crushed white shell. It sits inside **Reserva Conchal**, a 2,300-acre gated development between Brasilito and Flamingo. From Liberia Airport it is about 60 km: Route 21 south to Belén, west through Huacas, then north past Matapalo village to the Reserva gate. The road is paved the whole way and the drive takes 65–70 minutes.",
        where_es="El **Westin Reserva Conchal** es el resort más grande de Guanacaste: un todo incluido con campo de golf de Robert Trent Jones II, una enorme piscina de forma libre y acceso directo a **Playa Conchal**, cuya arena es concha blanca triturada. Está dentro de **Reserva Conchal**, un desarrollo privado de 930 hectáreas entre Brasilito y Flamingo. Desde el Aeropuerto de Liberia son unos 60 km: Ruta 21 hacia el sur hasta Belén, al oeste por Huacas y luego al norte pasando el pueblo de Matapalo hasta el portón de la Reserva. La carretera es asfaltada todo el camino y el viaje dura 65–70 minutos.",
        gate_en="Reserva Conchal has a **security gate** at the entrance shared with the W and the residential villas. The guard asks for the guest name and checks the vehicle; it is a lighter process than Papagayo or Pinilla, but a registered driver still gets through faster. We send your driver’s name and vehicle details to the Westin when you book.",
        gate_es="Reserva Conchal tiene un **portón de seguridad** en la entrada, compartido con el W y las villas residenciales. El guarda pide el nombre del huésped y revisa el vehículo; es un proceso más ligero que en Papagayo o Pinilla, pero un chofer registrado igual pasa más rápido. Enviamos el nombre de tu chofer y los datos del vehículo al Westin al reservar.",
        around_en="Outside the Reserva gate is **Brasilito**, a small fishing village with a couple of sodas, a mini-super and a public beach; it is charming for a walk but not a dinner destination. **Flamingo**’s marina strip is 10 minutes north with a few restaurants. For a real night out, Westin guests go to **Tamarindo**, 20–25 minutes south, which has the region’s best restaurant scene. Inside the reserve, the Westin’s own restaurants are included and the W’s are a short shuttle away.",
        around_es="Fuera del portón de la Reserva está **Brasilito**, un pueblito de pescadores con un par de sodas, un minisúper y playa pública; es encantador para caminar pero no un destino para cenar. La franja de la marina de **Flamingo** está a 10 minutos al norte con algunos restaurantes. Para una noche fuera en serio, los huéspedes del Westin van a **Tamarindo**, a 20–25 minutos al sur, que tiene la mejor oferta de restaurantes de la región. Dentro de la reserva, los restaurantes del Westin están incluidos y los del W quedan a un shuttle corto.",
        tips_en=[
            "**Groceries in Huacas or Belén.** There is a supermarket in Huacas on the way and a bigger Automercado in Tamarindo; the private transfer stops for free.",
            "**Sunset at Flamingo, dinner in Tamarindo.** Book a private round trip one evening: 10 minutes to the Flamingo viewpoint, then 20 minutes to Tamarindo and back after dinner.",
            "**Playa Conchal is public.** Locals arrive on foot from Brasilito on weekends; the far end near the resort stays quiet.",
        ],
        tips_es=[
            "**Víveres en Huacas o Belén.** Hay supermercado en Huacas en el camino y un Automercado más grande en Tamarindo; el traslado privado para sin costo.",
            "**Atardecer en Flamingo, cena en Tamarindo.** Reserva un viaje privado de ida y vuelta una noche: 10 minutos al mirador de Flamingo y luego 20 minutos a Tamarindo y de regreso después de cenar.",
            "**Playa Conchal es pública.** Los locales llegan a pie desde Brasilito los fines de semana; el extremo cercano al resort se mantiene tranquilo.",
        ],
        faqs_en=[
            ("How far is the Westin Reserva Conchal from Liberia Airport?", "About 60 km (37 miles), a 65 to 70 minute drive on paved roads via Belén and Huacas."),
            ("How much is a private transfer from LIR to the Westin Conchal?", "Ruta Pacifico charges a fixed $130 per vehicle for 1–5 passengers, $165 for 6–9 and $220 for 10–12, including taxes, flight tracking and child seats."),
            ("Is there a town near the Westin Conchal?", "Brasilito, just outside the gate, is a small village with a few sodas and a mini-super. For restaurants and nightlife, Tamarindo is 20–25 minutes away by car."),
            ("Does the Westin Conchal have an airport shuttle?", "The resort sells private transfers through its concierge. Ruta Pacifico offers the same door-to-door service with flight tracking and gate registration at a fixed per-vehicle price, usually lower."),
        ],
        faqs_es=[
            ("¿A qué distancia está el Westin Reserva Conchal del Aeropuerto de Liberia?", "A unos 60 km (37 millas), un viaje de 65 a 70 minutos por carretera asfaltada vía Belén y Huacas."),
            ("¿Cuánto cuesta un traslado privado de LIR al Westin Conchal?", "Ruta Pacifico cobra una tarifa fija de $130 por vehículo para 1–5 pasajeros, $165 para 6–9 y $220 para 10–12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿Hay algún pueblo cerca del Westin Conchal?", "Brasilito, justo fuera del portón, es un pueblito con un par de sodas y un minisúper. Para restaurantes y vida nocturna, Tamarindo está a 20–25 minutos en carro."),
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
        where_en="The **W Costa Rica** is Marriott’s lifestyle hotel inside **Reserva Conchal**, a few hundred metres from the Westin on the same gated estate. It is smaller, louder and more design-driven than its neighbour: a rooftop-style pool scene, DJ nights, and rooms opening onto the dry forest above **Playa Conchal**. From Liberia Airport it is about 60 km on paved road — Route 21 south to Belén, west through Huacas, north past Matapalo to the Reserva gate — and the drive takes 65–70 minutes.",
        where_es="El **W Costa Rica** es el hotel lifestyle de Marriott dentro de **Reserva Conchal**, a unos cientos de metros del Westin en la misma finca privada. Es más pequeño, más ruidoso y más de diseño que su vecino: ambiente de piscina tipo rooftop, noches de DJ y habitaciones que dan al bosque seco sobre **Playa Conchal**. Desde el Aeropuerto de Liberia son unos 60 km por asfalto, Ruta 21 al sur hasta Belén, al oeste por Huacas y al norte pasando Matapalo hasta el portón de la Reserva, y el viaje dura 65–70 minutos.",
        gate_en="The W shares the **Reserva Conchal security gate** with the Westin and the villas. The guard takes the guest name and checks the vehicle; pre-registered drivers pass faster, so we send yours to the W when you book. From the gate it is a two-minute drive to the W’s own entrance.",
        gate_es="El W comparte el **portón de seguridad de Reserva Conchal** con el Westin y las villas. El guarda toma el nombre del huésped y revisa el vehículo; los choferes registrados pasan más rápido, así que enviamos el tuyo al W al reservar. Desde el portón son dos minutos hasta la entrada propia del W.",
        around_en="Same situation as the Westin: **Brasilito** village at the gate for a walk and a soda lunch, **Flamingo**’s marina strip 10 minutes north, and **Tamarindo** 20–25 minutes south for the real restaurant and bar scene. The W is not all-inclusive, so guests do go out more than Westin guests; a private round trip to Tamarindo for dinner is the most common request we get from the W.",
        around_es="Misma situación que el Westin: el pueblito de **Brasilito** en el portón para caminar y almorzar en una soda, la franja de la marina de **Flamingo** a 10 minutos al norte y **Tamarindo** a 20–25 minutos al sur para la oferta real de restaurantes y bares. El W no es todo incluido, así que los huéspedes sí salen más que los del Westin; un viaje privado de ida y vuelta a Tamarindo para cenar es la solicitud más común que recibimos desde el W.",
        tips_en=[
            "**Not all-inclusive, so plan dinners.** The W has three restaurants; for variety, Tamarindo is the answer and a private round trip beats two taxis.",
            "**Groceries and wine in Huacas or Tamarindo.** The transfer stops for free; the in-room minibar is expensive.",
            "**Ask for the W, not the Westin.** They share the gate but have separate entrances; tell us which one so the driver does not have to circle.",
        ],
        tips_es=[
            "**No es todo incluido, así que planifica las cenas.** El W tiene tres restaurantes; para variedad, Tamarindo es la respuesta y un viaje privado de ida y vuelta le gana a dos taxis.",
            "**Víveres y vino en Huacas o Tamarindo.** El traslado para sin costo; el minibar de la habitación es caro.",
            "**Pide el W, no el Westin.** Comparten portón pero tienen entradas separadas; dinos cuál para que el chofer no tenga que dar vueltas.",
        ],
        faqs_en=[
            ("How far is the W Costa Rica from Liberia Airport?", "About 60 km (37 miles), 65 to 70 minutes on paved roads. It is inside Reserva Conchal, next to the Westin."),
            ("How much is a private shuttle from LIR to the W Costa Rica?", "A fixed $130 per vehicle for 1–5 passengers with Ruta Pacifico, $165 for 6–9 and $220 for 10–12, including taxes, flight tracking and child seats."),
            ("Is the W Costa Rica all-inclusive?", "No. The W is a full-service hotel with restaurants and bars charged separately, unlike the Westin next door. Many guests take a transfer to Tamarindo for dinner."),
            ("Can I walk from the W to a town?", "No. Brasilito village is just outside the gate but is a 20-minute walk and has only a few sodas. Tamarindo, the nearest real town, is 20–25 minutes by car."),
        ],
        faqs_es=[
            ("¿A qué distancia está el W Costa Rica del Aeropuerto de Liberia?", "A unos 60 km (37 millas), de 65 a 70 minutos por carretera asfaltada. Está dentro de Reserva Conchal, junto al Westin."),
            ("¿Cuánto cuesta un shuttle privado de LIR al W Costa Rica?", "Un precio fijo de $130 por vehículo para 1–5 pasajeros con Ruta Pacifico, $165 para 6–9 y $220 para 10–12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿El W Costa Rica es todo incluido?", "No. El W es un hotel de servicio completo con restaurantes y bares que se cobran aparte, a diferencia del Westin de al lado. Muchos huéspedes toman un traslado a Tamarindo para cenar."),
            ("¿Puedo caminar del W a algún pueblo?", "No. El pueblito de Brasilito está justo fuera del portón pero son 20 minutos a pie y solo tiene unas pocas sodas. Tamarindo, el pueblo real más cercano, está a 20–25 minutos en carro."),
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
        where_en="**Margaritaville Beach Resort Playa Flamingo** is the big family resort on **Playa Flamingo**, a white-sand bay with a marina, about 62 km from Liberia Airport. The drive is Route 21 south to Belén, west through Huacas, then north through Brasilito and along the coast to Flamingo; paved the entire way, 65–75 minutes. The resort is across the road from the beach, a two-minute walk to the sand, with the marina and the small Flamingo strip a few minutes further on.",
        where_es="**Margaritaville Beach Resort Playa Flamingo** es el gran resort familiar en **Playa Flamingo**, una bahía de arena blanca con marina, a unos 62 km del Aeropuerto de Liberia. El trayecto es Ruta 21 al sur hasta Belén, al oeste por Huacas, y luego al norte por Brasilito y por la costa hasta Flamingo; asfaltado todo el camino, 65–75 minutos. El resort está al otro lado de la calle de la playa, a dos minutos a pie de la arena, con la marina y la pequeña franja de Flamingo unos minutos más adelante.",
        gate_en="No community gate and no registration needed: Margaritaville has a regular hotel entrance and the driver pulls up to the lobby. We still share your driver’s details with the front desk so a late-night arrival is expected.",
        gate_es="Sin portón comunitario ni registro necesario: Margaritaville tiene una entrada de hotel normal y el chofer llega hasta el lobby. Igual compartimos los datos de tu chofer con recepción para que una llegada de madrugada esté prevista.",
        around_en="Flamingo is **the most walkable of the resort beaches in Zone 2, but it is still not a town.** Within a 10-minute walk of Margaritaville you have the marina, a handful of restaurants and bars, a small supermarket and the beach. For a proper evening out with choice, **Tamarindo** is 25 minutes south. **Potrero**, 5 minutes north, is a quiet local village; **Las Catalinas**, 10 minutes, is the car-free planned village with good restaurants.",
        around_es="Flamingo es **la más caminable de las playas con resort de la Zona 2, pero sigue sin ser un pueblo.** A 10 minutos a pie de Margaritaville tienes la marina, un puñado de restaurantes y bares, un supermercado pequeño y la playa. Para una noche fuera con opciones, **Tamarindo** está a 25 minutos al sur. **Potrero**, a 5 minutos al norte, es un pueblito local tranquilo; **Las Catalinas**, a 10 minutos, es el pueblo planificado sin carros con buenos restaurantes.",
        tips_en=[
            "**Families: the private transfer includes child seats.** Two or three car seats at no charge, which shared shuttles rarely guarantee.",
            "**Supermarket in Huacas on the way.** The Flamingo mini-super is small and pricey; a stop in Huacas is free on a private transfer.",
            "**Catamaran and Las Catalinas day.** The Flamingo marina is where most sunset sails leave from, walking distance from the resort.",
        ],
        tips_es=[
            "**Familias: el traslado privado incluye sillas para niños.** Dos o tres sillas sin costo, algo que los shuttles compartidos rara vez garantizan.",
            "**Supermercado en Huacas en el camino.** El minisúper de Flamingo es pequeño y caro; una parada en Huacas es gratis en un traslado privado.",
            "**Día de catamarán y Las Catalinas.** La marina de Flamingo es de donde salen la mayoría de paseos al atardecer, a distancia caminable del resort.",
        ],
        faqs_en=[
            ("How far is Margaritaville Flamingo from Liberia Airport?", "About 62 km (39 miles), a 65 to 75 minute drive on paved roads via Belén, Huacas and Brasilito."),
            ("How much is a private shuttle from LIR to Margaritaville Playa Flamingo?", "Ruta Pacifico charges a fixed $130 per vehicle for 1–5 passengers, $165 for 6–9 and $220 for 10–12, with taxes, flight tracking and child seats included."),
            ("Can I walk to restaurants from Margaritaville Flamingo?", "Yes, a few. The Flamingo marina strip with several restaurants and bars is within a 10-minute walk. For more choice, Tamarindo is 25 minutes by car."),
            ("Is Flamingo a good base for families?", "Yes. The bay is calm, the resort is family-oriented, and Potrero and Las Catalinas are minutes away. Tamarindo’s restaurants and surf schools are a 25-minute transfer."),
        ],
        faqs_es=[
            ("¿A qué distancia está Margaritaville Flamingo del Aeropuerto de Liberia?", "A unos 62 km (39 millas), un viaje de 65 a 75 minutos por carretera asfaltada vía Belén, Huacas y Brasilito."),
            ("¿Cuánto cuesta un shuttle privado de LIR a Margaritaville Playa Flamingo?", "Ruta Pacifico cobra una tarifa fija de $130 por vehículo para 1–5 pasajeros, $165 para 6–9 y $220 para 10–12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
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
        where_en="The **JW Marriott Guanacaste** is the hotel we drive to more than any other in the region, and the one whose location surprises the most guests. It sits on **Playa Mansita** inside **Hacienda Pinilla**, a 4,500-acre gated estate **south of Tamarindo** — not in Tamarindo, and not in any town. The resort has the largest pool in Central America, a golf course, a beach club and miles of estate roads, and nothing else around it. From Liberia Airport it is about 80 km: Route 21 south to Belén, west through Huacas and Villarreal, past the Tamarindo turn-off, then south through the Hacienda Pinilla gate and along the estate road to the resort. Paved all the way; 75–85 minutes.",
        where_es="El **JW Marriott Guanacaste** es el hotel al que más manejamos en toda la región, y el que más sorprende a los huéspedes por su ubicación. Está en **Playa Mansita** dentro de **Hacienda Pinilla**, una finca privada de 1.800 hectáreas **al sur de Tamarindo**: no en Tamarindo, y no en ningún pueblo. El resort tiene la piscina más grande de Centroamérica, campo de golf, club de playa y kilómetros de caminos internos, y nada más alrededor. Desde el Aeropuerto de Liberia son unos 80 km: Ruta 21 al sur hasta Belén, al oeste por Huacas y Villarreal, pasando el desvío a Tamarindo, y luego al sur por el portón de Hacienda Pinilla y el camino interno hasta el resort. Asfaltado todo el camino; 75–85 minutos.",
        gate_en="**Hacienda Pinilla’s gate is the strictest in Guanacaste after Papagayo.** Security expects the **driver’s full name, cédula number, and the vehicle’s make, plate and colour** to be on the guest’s reservation; an unregistered taxi waits at the barrier while the guard phones the resort, sometimes for a long time. When you book with Ruta Pacifico we send those details to the JW Marriott in advance — every time, for every arrival — so the gate already expects you.",
        gate_es="**El portón de Hacienda Pinilla es el más estricto de Guanacaste después de Papagayo.** La seguridad espera que el **nombre completo del chofer, su número de cédula y la marca, placa y color del vehículo** estén en la reserva del huésped; un taxi no registrado espera en la barrera mientras el guarda llama al resort, a veces un buen rato. Cuando reservas con Ruta Pacifico enviamos esos datos al JW Marriott con anticipación, siempre, en cada llegada, para que el portón ya te espere.",
        around_en="**There is nothing around the JW Marriott.** No town, no strip, no walk to a restaurant. Inside the estate you have the resort’s own restaurants and the Hacienda Pinilla beach club. The nearest place with a choice of restaurants is **Tamarindo, 20–25 minutes by car**; **Playa Avellanas**, 10 minutes south, has the famous Lola’s beach restaurant and little else. Guests who arrive knowing this have a superb, quiet stay. Guests who expected Tamarindo next door spend the week paying for taxis — so plan on a private round trip for the one or two nights you want to go out.",
        around_es="**No hay nada alrededor del JW Marriott.** Ni pueblo, ni franja comercial, ni caminata hasta un restaurante. Dentro de la finca tienes los restaurantes del resort y el club de playa de Hacienda Pinilla. El lugar más cercano con variedad de restaurantes es **Tamarindo, a 20–25 minutos en carro**; **Playa Avellanas**, a 10 minutos al sur, tiene el famoso restaurante de playa Lola's y poco más. Quien llega sabiendo esto tiene una estancia excelente y tranquila. Quien esperaba tener Tamarindo al lado se pasa la semana pagando taxis, así que planifica un viaje privado de ida y vuelta para la o las dos noches que quieras salir.",
        tips_en=[
            "**There is no shared shuttle or bus to the JW.** Shared vans stop in Tamarindo; the resort is a further 20 minutes inside a gated estate. Book a private transfer or rent a car.",
            "**Groceries in Villarreal or Tamarindo.** The Automercado in Tamarindo is the last real supermarket before the gate; the stop is free on a private transfer.",
            "**Budget a Tamarindo night.** A private round trip with waiting time is the easiest way to get dinner outside the resort; ask us when you book the airport transfer.",
        ],
        tips_es=[
            "**No hay shuttle compartido ni bus hasta el JW.** Las vans compartidas paran en Tamarindo; el resort está 20 minutos más adentro de una finca con portón. Reserva un traslado privado o alquila carro.",
            "**Víveres en Villarreal o Tamarindo.** El Automercado de Tamarindo es el último supermercado de verdad antes del portón; la parada es gratis en un traslado privado.",
            "**Presupuesta una noche en Tamarindo.** Un viaje privado de ida y vuelta con tiempo de espera es la forma más fácil de cenar fuera del resort; pídelo cuando reserves el traslado del aeropuerto.",
        ],
        faqs_en=[
            ("How far is the JW Marriott Guanacaste from Liberia Airport?", "About 80 km (50 miles), a 75 to 85 minute private transfer on paved roads via Belén, Huacas and the Hacienda Pinilla gate south of Tamarindo."),
            ("How much is a private shuttle from LIR to the JW Marriott?", "Ruta Pacifico charges a fixed $135 per vehicle for 1–5 passengers, $175 for 6–9 and $260 for 10–12, including taxes, flight tracking, child seats and registration of the driver at the Hacienda Pinilla gate."),
            ("Do I need to register my driver with the JW Marriott before arrival?", "Yes. Hacienda Pinilla security requires the driver’s name, ID number and vehicle details on your reservation. Ruta Pacifico sends them to the resort automatically when you book."),
            ("Is the JW Marriott in Tamarindo?", "No. It is inside Hacienda Pinilla, a gated estate 20–25 minutes south of Tamarindo by car. There is no town within walking distance of the resort."),
            ("Is there a shared shuttle from Liberia Airport to the JW Marriott?", "No. Shared shuttles serve Tamarindo town, not the resort. The options are a private transfer, the hotel’s own car service, or a rental car."),
        ],
        faqs_es=[
            ("¿A qué distancia está el JW Marriott Guanacaste del Aeropuerto de Liberia?", "A unos 80 km (50 millas), un traslado privado de 75 a 85 minutos por carretera asfaltada vía Belén, Huacas y el portón de Hacienda Pinilla al sur de Tamarindo."),
            ("¿Cuánto cuesta un shuttle privado de LIR al JW Marriott?", "Ruta Pacifico cobra una tarifa fija de $135 por vehículo para 1–5 pasajeros, $175 para 6–9 y $260 para 10–12, con impuestos, seguimiento de vuelo, sillas para niños y el registro del chofer en el portón de Hacienda Pinilla incluidos."),
            ("¿Tengo que registrar a mi chofer con el JW Marriott antes de llegar?", "Sí. La seguridad de Hacienda Pinilla exige el nombre, la cédula y los datos del vehículo del chofer en tu reserva. Ruta Pacifico los envía al resort automáticamente al reservar."),
            ("¿El JW Marriott está en Tamarindo?", "No. Está dentro de Hacienda Pinilla, una finca privada a 20–25 minutos al sur de Tamarindo en carro. No hay pueblo a distancia caminable del resort."),
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
        where_en="The **Tamarindo Diriá** is the resort that sits **in the middle of Tamarindo itself**, on the main beach, with the town’s restaurants, bars and surf shops literally across the street. That makes it the opposite of every gated resort in this series: instead of seclusion, you get the liveliest beach town in Guanacaste at your door. It is the largest and longest-established hotel in Tamarindo, with beachfront and garden wings on both sides of the main road, several pools and direct access to the sand. From Liberia Airport it is about 65 km: Route 21 south to Belén, west through Huacas and Villarreal, and straight into town. Paved all the way; 55–70 minutes depending on traffic in Liberia and along the Tamarindo main street.",
        where_es="El **Tamarindo Diriá** es el resort que está **en pleno Tamarindo**, sobre la playa principal, con los restaurantes, bares y tiendas de surf del pueblo literalmente cruzando la calle. Eso lo convierte en lo opuesto a todos los resorts con portón de esta serie: en vez de aislamiento, tienes el pueblo de playa más animado de Guanacaste en la puerta. Es el hotel más grande y de más trayectoria de Tamarindo, con alas frente al mar y de jardín a ambos lados de la calle principal, varias piscinas y acceso directo a la arena. Desde el Aeropuerto de Liberia son unos 65 km: Ruta 21 al sur hasta Belén, al oeste por Huacas y Villarreal, y directo al pueblo. Asfaltado todo el camino; 55–70 minutos según el tráfico en Liberia y en la calle principal de Tamarindo.",
        gate_en="No gate, no checkpoint, no registration: the Diriá has a regular hotel entrance on Tamarindo’s main street and your driver pulls up to reception. The only thing to know is that the main street can be slow at sunset, when the whole town walks to the beach; our drivers know the back way in.",
        gate_es="Sin portón, sin puesto de control, sin registro: el Diriá tiene una entrada de hotel normal sobre la calle principal de Tamarindo y tu chofer llega hasta la recepción. Lo único que hay que saber es que la calle principal puede ser lenta al atardecer, cuando todo el pueblo camina hacia la playa; nuestros choferes conocen la entrada por atrás.",
        around_en="**Everything, on foot.** This is the point of staying at the Diriá. Tamarindo has 60+ restaurants, from sodas to sushi to steakhouses, bars with live music, surf schools on the sand, two supermarkets, pharmacies, ATMs and tour offices — all within a 10-minute walk of the lobby. **Playa Langosta**, quieter and more upscale, is a 20-minute walk south. **Playa Grande** and the Las Baulas turtle park are across the estuary. The trade-off is noise: the beachfront rooms on the main strip hear the town on weekend nights. Ask for the garden side if you want quiet.",
        around_es="**Todo, a pie.** Ese es el sentido de quedarse en el Diriá. Tamarindo tiene más de 60 restaurantes, desde sodas hasta sushi y parrillas, bares con música en vivo, escuelas de surf en la arena, dos supermercados, farmacias, cajeros y oficinas de tours, todo a 10 minutos a pie del lobby. **Playa Langosta**, más tranquila y de mayor categoría, está a 20 minutos caminando al sur. **Playa Grande** y el parque de tortugas Las Baulas están al otro lado del estero. El precio a pagar es el ruido: las habitaciones frente al mar sobre la calle principal escuchan el pueblo las noches de fin de semana. Pide el lado de jardín si quieres silencio.",
        tips_en=[
            "**You do not need a rental car here.** Tamarindo is walkable end to end, tours pick up at the Diriá lobby, and day trips to Flamingo, Conchal or Rincón de la Vieja are easy as private transfers.",
            "**Skip the grocery stop.** The Automercado is a 5-minute walk from the hotel; it is the one resort in this series where you can shop after check-in.",
            "**Ask for the beachfront wing if you want the sunset, the garden wing if you want sleep.** Both sides share the pools and the beach access.",
        ],
        tips_es=[
            "**Aquí no necesitas carro de alquiler.** Tamarindo se camina de punta a punta, los tours recogen en el lobby del Diriá, y las excursiones a Flamingo, Conchal o Rincón de la Vieja son fáciles como traslados privados.",
            "**Sáltate la parada del supermercado.** El Automercado está a 5 minutos a pie del hotel; es el único resort de esta serie donde puedes hacer compras después del check-in.",
            "**Pide el ala frente al mar si quieres el atardecer, el ala de jardín si quieres dormir.** Ambos lados comparten las piscinas y el acceso a la playa.",
        ],
        faqs_en=[
            ("How far is the Tamarindo Diriá from Liberia Airport?", "About 65 km (40 miles), a 55 to 70 minute drive on paved roads via Belén and Huacas, straight into Tamarindo town."),
            ("How much is a private shuttle from LIR to the Tamarindo Diriá?", "Ruta Pacifico charges a fixed $130 per vehicle for 1–5 passengers, $165 for 6–9 and $220 for 10–12, with taxes, flight tracking and child seats included."),
            ("Can I walk to restaurants from the Tamarindo Diriá?", "Yes — dozens. The Diriá is on Tamarindo’s main street, and the town’s restaurants, bars, surf schools and supermarkets are all within a 10-minute walk."),
            ("Is the Tamarindo Diriá noisy?", "The beachfront wing on the main strip can hear the town on weekend nights. The garden wing across the road is quieter; both share the pools and beach access."),
            ("Do I need a car if I stay at the Tamarindo Diriá?", "No. Tamarindo is fully walkable, tours include hotel pickup, and day trips to nearby beaches are easy as private transfers. A car only makes sense if you plan to change locations every day."),
        ],
        faqs_es=[
            ("¿A qué distancia está el Tamarindo Diriá del Aeropuerto de Liberia?", "A unos 65 km (40 millas), un viaje de 55 a 70 minutos por carretera asfaltada vía Belén y Huacas, directo al pueblo de Tamarindo."),
            ("¿Cuánto cuesta un shuttle privado de LIR al Tamarindo Diriá?", "Ruta Pacifico cobra una tarifa fija de $130 por vehículo para 1–5 pasajeros, $165 para 6–9 y $220 para 10–12, con impuestos, seguimiento de vuelo y sillas para niños incluidos."),
            ("¿Puedo caminar a restaurantes desde el Tamarindo Diriá?", "Sí, a decenas. El Diriá está sobre la calle principal de Tamarindo, y los restaurantes, bares, escuelas de surf y supermercados del pueblo están a menos de 10 minutos a pie."),
            ("¿El Tamarindo Diriá es ruidoso?", "El ala frente al mar sobre la calle principal puede escuchar el pueblo las noches de fin de semana. El ala de jardín al otro lado de la calle es más tranquila; ambas comparten piscinas y acceso a la playa."),
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
    gate_head = "## At the gate: what security needs" if h["gated"] else "## Arrival at the hotel"
    tips = "\n".join(f"- {t}" for t in h["tips_en"])
    return f"""
If you have a reservation at the **{h['full']}**, the ride from Liberia International Airport (LIR) is the first hour of your trip — and the part most guests leave to the last minute. Here is exactly where the hotel is, how long the drive really takes, what the security gate needs from your driver, and what is (and is not) around the resort once you arrive. We drive this route every week.

## Quick facts

| | |
| --- | --- |
| **Distance from LIR** | {h['km']} |
| **Real drive time** | {h['time']}, paved the whole way |
| **Private transfer, 1–5 pax** | **${p1}** per vehicle, fixed |
| **Private transfer, 6–9 pax** | ${p2} per vehicle |
| **Private transfer, 10–12 pax** | ${p3} per vehicle |
| **Included** | Taxes, tolls, flight tracking, child seats, one free stop for groceries |
| **Gated access** | {"Yes — driver must be pre-registered" if h["gated"] else "No community checkpoint"} |

## Where the hotel actually is

{h['where_en']}

## The drive from Liberia Airport

Your driver meets you at the arrivals exit with a name sign, having tracked your flight, and you leave the moment you have your bags — no waiting for other passengers, no van filling up. The road is paved end to end; the only variable is traffic through Liberia town at rush hour, which is why we quote **{h['time']}** rather than a single number. Want to stop for groceries, cash or a pharmacy on the way? Just say so; it is your vehicle.

See live prices and book the [LIR → {h['short']} transfer](/private-shuttle/{h['route']}).

{gate_head}

{h['gate_en']}

## What is around the {h['short']}

{h['around_en']}

For the full picture of how Guanacaste’s hotel zones fit together — and which beaches have a town you can walk to — read our guide to the [best hotels in Guanacaste by zone]({PILLAR}).

## Your options from LIR, honestly compared

| Option | Time to the hotel | Cost | The catch |
| --- | --- | --- | --- |
| **Private transfer** | {h['time']}, direct | ${p1} fixed, 1–5 pax | None — driver pre-registered at the gate, flight tracked |
| **Hotel car service** | Same drive | Premium rate via concierge | Usually the most expensive option |
| **Rental car** | Same drive + pickup paperwork | $40–90/day + mandatory insurance + deposit | Only worth it if you will leave the resort daily |
| **Shared shuttle** | 1.5–2.5 h, multiple stops | ~$25–35 per person | {"Does not enter the gated estate — drops at the nearest town" if h["gated"] else "Waits for other flights; slow with kids"} |
| **Airport taxi** | Same drive | $100–150, negotiated | {"Unregistered vehicle is held at the gate" if h["gated"] else "No flight tracking, cash, no child seats"} |

For two people a private transfer costs about the same as a taxi and removes every unknown. For a family of four it is cheaper per person than a shared shuttle and takes less than half the time.

## Tips from our drivers

{tips}

## Book the transfer

Fixed price per vehicle, flight tracked, driver registered at the resort, child seats included. Book the [Liberia Airport → {h['short']} private transfer](/private-shuttle/{h['route']}) online in two minutes, or message us on WhatsApp — a real person who drives this road answers.
"""


def body_es(h):
    p1, p2, p3 = h["fares"]
    gate_head = "## En el portón: qué necesita la seguridad" if h["gated"] else "## Llegada al hotel"
    tips = "\n".join(f"- {t}" for t in h["tips_es"])
    return f"""
Si tienes reserva en el **{h['full']}**, el viaje desde el Aeropuerto Internacional de Liberia (LIR) es la primera hora de tu viaje, y la parte que la mayoría de huéspedes deja para último momento. Aquí está exactamente dónde queda el hotel, cuánto dura de verdad el trayecto, qué necesita el portón de seguridad de tu chofer y qué hay (y qué no) alrededor del resort cuando llegas. Nosotros manejamos esta ruta todas las semanas.

## Datos rápidos

| | |
| --- | --- |
| **Distancia desde LIR** | {h['km']} |
| **Tiempo real de viaje** | {h['time']}, asfaltado todo el camino |
| **Traslado privado, 1–5 pax** | **${p1}** por vehículo, fijo |
| **Traslado privado, 6–9 pax** | ${p2} por vehículo |
| **Traslado privado, 10–12 pax** | ${p3} por vehículo |
| **Incluye** | Impuestos, peajes, seguimiento de vuelo, sillas para niños, una parada gratis para víveres |
| **Acceso con portón** | {"Sí: el chofer debe estar registrado de antemano" if h["gated"] else "Sin puesto de control comunitario"} |

## Dónde queda realmente el hotel

{h['where_es']}

## El viaje desde el Aeropuerto de Liberia

Tu chofer te recibe a la salida de llegadas con un rótulo con tu nombre, habiendo monitoreado tu vuelo, y sales en cuanto tienes las maletas: sin esperar a otros pasajeros ni a que se llene una van. La carretera es asfaltada de punta a punta; la única variable es el tráfico por Liberia centro en hora pico, por eso decimos **{h['time']}** y no un solo número. ¿Quieres parar por víveres, efectivo o una farmacia en el camino? Solo dilo; el vehículo es tuyo.

Mira los precios actualizados y reserva el [traslado LIR → {h['short_es']}](/private-shuttle/{h['route']}).

{gate_head}

{h['gate_es']}

## Qué hay alrededor del {h['short_es']}

{h['around_es']}

Para ver el panorama completo de cómo encajan las zonas hoteleras de Guanacaste, y qué playas tienen un pueblo al que puedes caminar, lee nuestra guía de los [mejores hoteles de Guanacaste por zona]({PILLAR}).

## Tus opciones desde LIR, comparadas con honestidad

| Opción | Tiempo hasta el hotel | Costo | El detalle |
| --- | --- | --- | --- |
| **Traslado privado** | {h['time']}, directo | ${p1} fijo, 1–5 pax | Ninguno: chofer registrado en el portón, vuelo monitoreado |
| **Servicio de carro del hotel** | El mismo trayecto | Tarifa premium vía concierge | Suele ser la opción más cara |
| **Carro de alquiler** | El mismo trayecto + trámites de entrega | $40–90/día + seguro obligatorio + depósito | Solo vale la pena si vas a salir del resort a diario |
| **Shuttle compartido** | 1,5–2,5 h, varias paradas | ~$25–35 por persona | {"No entra a la finca privada: te deja en el pueblo más cercano" if h["gated"] else "Espera otros vuelos; lento con niños"} |
| **Taxi del aeropuerto** | El mismo trayecto | $100–150, negociado | {"El vehículo no registrado queda retenido en el portón" if h["gated"] else "Sin seguimiento de vuelo, en efectivo, sin sillas para niños"} |

Para dos personas un traslado privado cuesta más o menos lo mismo que un taxi y elimina todas las incógnitas. Para una familia de cuatro es más barato por persona que un shuttle compartido y tarda menos de la mitad.

## Consejos de nuestros choferes

{tips}

## Reserva el traslado

Precio fijo por vehículo, vuelo monitoreado, chofer registrado en el resort, sillas para niños incluidas. Reserva el [traslado privado Aeropuerto de Liberia → {h['short_es']}](/private-shuttle/{h['route']}) en línea en dos minutos, o escríbenos por WhatsApp: responde una persona real que maneja esta carretera.
"""


def title_en(h):
    return f"Liberia Airport to {h['short']}: Private Transfer, Drive Time, Gate Access & What’s Nearby"


def title_es(h):
    return f"Del Aeropuerto de Liberia al {h['short_es']}: traslado privado, tiempo de viaje, acceso al portón y qué hay cerca"


def excerpt_en(h):
    p1 = h["fares"][0]
    return (f"Exactly where the {h['full']} is, the real {h['time']} drive from LIR, "
            f"the fixed ${p1} private transfer price, what the security gate needs from your driver, "
            f"and whether there is a town nearby. Written by the drivers who do this route every week.")


def excerpt_es(h):
    p1 = h["fares"][0]
    return (f"Exactamente dónde queda el {h['full']}, el viaje real de {h['time']} desde LIR, "
            f"el precio fijo de ${p1} del traslado privado, qué necesita el portón de seguridad de tu chofer "
            f"y si hay un pueblo cerca. Escrito por los choferes que hacen esta ruta todas las semanas.")


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
  {sql_str(title_en(h))},
  {sql_str(excerpt_en(h))},
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
  title_es = {sql_str(title_es(h))},
  excerpt_es = {sql_str(excerpt_es(h))},
  cover_image_alt_es = {sql_str(h['cover_alt_es'])},
  faqs_es = {sql_str(faq_json(h['faqs_es']))}::jsonb,
  content_md_es = $es${body_es(h)}$es$
where slug = {sql_str(h['slug'])};
""")
    print("".join(out))


if __name__ == "__main__":
    main()
