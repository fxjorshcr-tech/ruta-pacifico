-- Spanish twins (question_es / answer_es) for public.faqs_ruta_pacifico.
--
-- PREREQUISITE: run supabase/i18n_es_schema.sql first; it adds the *_es columns
-- these statements write to.
--
-- Source: supabase/_faqs_live_en.json (the 63 FAQs scraped from the live English
-- FAQ page), generated 2026-09-17 by a script that copies each English question
-- verbatim into the WHERE clause; the Spanish was written by hand, question by
-- question. Rows are matched by the exact English question text because the
-- scrape carries no id.
--
-- Idempotent: every statement is a plain UPDATE that sets the same values, so the
-- file can be re-run safely. A row whose English question has since been edited
-- simply stays untranslated (question_es null) and the site falls back to English;
-- the final SELECT reports how many such rows remain.

begin;

-- 01
update public.faqs_ruta_pacifico set
  question_es = $es$¿Con cuánta anticipación debo reservar mi shuttle privado?$es$,
  answer_es = $es$Te recomendamos reservar con al menos 1 o 2 semanas de anticipación, sobre todo en temporada alta (de diciembre a abril y en julio y agosto). Aun así, muchas veces podemos aceptar reservas con tan solo 24 horas de aviso, sujeto a disponibilidad. Para las fechas festivas (Navidad, Año Nuevo y Semana Santa) te recomendamos reservar con 1 o 2 meses de anticipación, porque la demanda es muy alta.$es$
where question = $en$How far in advance should I book my private shuttle?$en$;

-- 02
update public.faqs_ruta_pacifico set
  question_es = $es$¿Puedo reservar un shuttle para el mismo día?$es$,
  answer_es = $es$¡Sí! Muchas veces podemos aceptar reservas para el mismo día si tenemos disponibilidad. Escríbenos de inmediato por WhatsApp al +506 7080-5578 o al correo reservations@rutapacifico.com para consultar disponibilidad. De todas formas, siempre es mejor reservar con anticipación para garantizar tu espacio.$es$
where question = $en$Can I book a shuttle for the same day?$en$;

-- 03
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cómo sé que mi reserva está confirmada?$es$,
  answer_es = $es$Recibirás un correo de confirmación inmediatamente después de que se procese el pago. Ese correo incluye los detalles de tu reserva, la hora de recogida y tu número de referencia. Si no lo ves en tu bandeja de entrada, revisa la carpeta de spam. Siempre puedes contactarnos para verificar el estado de tu reserva.$es$
where question = $en$How do I know my booking is confirmed?$en$;

-- 04
update public.faqs_ruta_pacifico set
  question_es = $es$¿Puedo modificar o cambiar mi reserva después de confirmarla?$es$,
  answer_es = $es$Sí, puedes hacer modificaciones hasta 48 horas antes de la hora de recogida programada. Los cambios pueden ser de hora, lugar o fecha de recogida, sujetos a disponibilidad. Escríbenos a reservations@rutapacifico.com con tu número de referencia y los cambios que necesitas. No se cobra ningún cargo adicional, a menos que cambies la ruta o agregues pasajeros.$es$
where question = $en$Can I modify or change my booking after it's confirmed?$en$;

-- 05
update public.faqs_ruta_pacifico set
  question_es = $es$¿El precio es por persona o por vehículo?$es$,
  answer_es = $es$Todos los precios de nuestros shuttles privados son por vehículo (el costo total del viaje), NO por persona.$es$
where question = $en$Is the price per person or per vehicle?$en$;

-- 06
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué métodos de pago aceptan?$es$,
  answer_es = $es$Aceptamos tarjetas de crédito y débito (Visa, Mastercard y American Express) a través de nuestra pasarela de pago segura. El pago se realiza al momento de reservar para confirmar tu reservación. Todos los precios están en dólares (USD) e incluyen el 13% de IVA de Costa Rica.$es$
where question = $en$What payment methods do you accept?$en$;

-- 07
update public.faqs_ruta_pacifico set
  question_es = $es$¿Hay cargos adicionales o costos ocultos?$es$,
  answer_es = $es$¡Sin costos ocultos! El precio que ves en la página de resumen es el precio total.$es$
where question = $en$Are there any additional fees or hidden costs?$en$;

-- 08
update public.faqs_ruta_pacifico set
  question_es = $es$¿Los niños pagan precio completo?$es$,
  answer_es = $es$No, los niños no pagan aparte. Como nuestros precios son por vehículo (no por persona), los niños van incluidos en tu grupo sin costo extra. Solo pagas la tarifa base del vehículo, sin importar cuántos adultos o niños viajen (hasta la capacidad máxima).$es$
where question = $en$Do children pay full price?$en$;

-- 09
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cuál es la política de cancelación?$es$,
  answer_es = $es$Las cancelaciones hechas con al menos 48 horas de anticipación a la hora de recogida programada reciben un reembolso completo, menos el 13% de impuestos y comisiones. Las cancelaciones con menos de 48 horas no son reembolsables. Toda solicitud de cancelación debe enviarse por correo a reservations@rutapacifico.com. Los reembolsos aprobados se procesan de inmediato, aunque los tiempos de procesamiento de cada banco varían.$es$
where question = $en$What is your cancellation policy?$en$;

-- 10
update public.faqs_ruta_pacifico set
  question_es = $es$¿Puedo reservar un shuttle si mi vuelo llega de noche?$es$,
  answer_es = $es$¡Sí! Ofrecemos recogidas en el aeropuerto a cualquier hora, incluidas las llegadas tarde en la noche. No hay recargo por recogidas nocturnas. Tu chofer te estará esperando con un rótulo con tu nombre, sin importar la hora. Te recomendamos programar la recogida 90 minutos después de la hora de aterrizaje prevista, para dar tiempo a migración y a recoger las maletas.$es$
where question = $en$Can I book a shuttle if my flight arrives at night?$en$;

-- 11
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué pasa si mi vuelo se atrasa o se cancela?$es$,
  answer_es = $es$Hacemos seguimiento de tu vuelo y ajustamos la hora de recogida según sea necesario, sin costo extra por atrasos. El seguimiento de vuelo en tiempo real viene incluido de forma estándar en todas las recogidas en el aeropuerto, así que si tu vuelo se atrasa, ajustamos la recogida automáticamente. Si tu vuelo se cancela, contáctanos de inmediato por WhatsApp o correo y buscaremos una solución contigo.$es$
where question = $en$What if my flight is delayed or cancelled?$en$;

-- 12
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cuánto tarda migración en el aeropuerto de Liberia (LIR)?$es$,
  answer_es = $es$Migración en el aeropuerto de Liberia (Daniel Oduber Quirós) suele ser rápida: normalmente entre 20 y 45 minutos, según la cantidad de vuelos que lleguen y la hora del día. En horas pico, cuando aterrizan varios vuelos internacionales a la vez, puede tardar un poco más. Te recomendamos programar la recogida entre 60 y 90 minutos después del aterrizaje, para dar tiempo a migración, la recogida de maletas y aduanas. Hacemos seguimiento de tu vuelo en tiempo real, así que si sales más rápido, escríbenos por WhatsApp y tendremos a tu chofer listo.$es$
where question = $en$How long does immigration take at LIR Airport?$en$;

-- 13
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué pasa si no llego a mi shuttle (no-show)?$es$,
  answer_es = $es$Si no te presentas dentro de los 30 minutos siguientes a la hora de recogida acordada y no nos has contactado por correo o WhatsApp, la reserva se considera un no-show y no es reembolsable. Si tus planes cambian, avísanos lo antes posible por WhatsApp o correo para intentar acomodarte.$es$
where question = $en$What happens if I miss my shuttle (no-show)?$en$;

-- 14
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cuánto tarda en llegar mi reembolso?$es$,
  answer_es = $es$Procesamos los reembolsos aprobados de inmediato (normalmente en menos de 24 horas). Sin embargo, el tiempo que tardan los fondos en aparecer en tu cuenta depende de tu banco o del emisor de tu tarjeta, y suele ser de 5 a 10 días hábiles. Recibirás un correo de confirmación en cuanto procesemos el reembolso de nuestro lado.$es$
where question = $en$How long does it take to receive my refund?$en$;

-- 15
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cuál es la diferencia entre Ruta Pacifico y los shuttles compartidos como Interbus?$es$,
  answer_es = $es$Con Ruta Pacifico recibes un servicio 100% privado: la van es exclusiva para tu grupo, tú eliges la hora de recogida y te llevamos puerta a puerta (hotel, Airbnb o aeropuerto). Los shuttles compartidos como Interbus trabajan con horarios fijos (normalmente a las 8 a.m. o a las 2 p.m.), hacen de 4 a 6 paradas para recoger a otros pasajeros y solo llegan a los hoteles principales. Para grupos de 4 o más viajeros, nuestro servicio privado muchas veces cuesta lo mismo o menos por persona que las opciones compartidas.$es$
where question = $en$What is the difference between Ruta Pacifico and shared shuttles like Interbus?$en$;

-- 16
update public.faqs_ruta_pacifico set
  question_es = $es$¿Dónde exactamente me espera el chofer en el aeropuerto?$es$,
  answer_es = $es$En el aeropuerto de Liberia (LIR, Daniel Oduber Quirós) tu chofer te espera justo en el área de llegadas con un rótulo con tu nombre. Estamos en contacto por WhatsApp desde que aterriza tu vuelo hasta que estás dentro de la van, así que no hay lugar a confusiones. Si tu recogida es en el aeropuerto Juan Santamaría (SJO, San José), que hacemos a solicitud, el chofer te espera justo afuera de las puertas de salida principales con un rótulo con tu nombre.$es$
where question = $en$Where exactly will the driver meet me at the airport?$en$;

-- 17
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cuánto tiempo después de aterrizar me encuentro con el chofer?$es$,
  answer_es = $es$Te recomendamos programar la recogida 90 minutos después de que aterrice tu vuelo. Así hay tiempo para bajar del avión, pasar migración (que puede tardar de 30 minutos a 2 horas en días de mucho movimiento), recoger las maletas y pasar aduanas. Tu chofer hace seguimiento de tu vuelo y se ajusta si hay atrasos.$es$
where question = $en$How long after landing should I expect to meet my driver?$en$;

-- 18
update public.faqs_ruta_pacifico set
  question_es = $es$¿Pueden recogerme en un Airbnb o en una casa de alquiler vacacional?$es$,
  answer_es = $es$¡Sí! Una de las grandes ventajas del shuttle privado es que te recogemos donde estés: hoteles, Airbnbs, alquileres vacacionales o casas privadas. Toma en cuenta que hay casas y hoteles a los que solo se llega en 4x4. Te avisaremos si aplica un costo extra por tu lugar de recogida.$es$
where question = $en$Can you pick me up from an Airbnb or vacation rental?$en$;

-- 19
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué pasa si viajo con tablas de surf o equipaje extra?$es$,
  answer_es = $es$La franquicia de equipaje estándar es 1 maleta grande + 1 equipaje de mano por persona. Si traes tablas de surf, palos de golf o maletas extra, menciónalo al reservar para asignarte el vehículo adecuado. Las tablas de surf de hasta 7 pies normalmente caben en nuestras vans sin costo extra. Para tablas más grandes o grupos con mucho equipo, puede que necesitemos coordinar un vehículo más grande (sujeto a disponibilidad y precio).$es$
where question = $en$What if I am traveling with surfboards or extra luggage?$en$;

-- 20
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué hago si no encuentro a mi chofer en el aeropuerto?$es$,
  answer_es = $es$¡No te preocupes! Tu correo de confirmación incluye nuestro número de teléfono y contacto de WhatsApp (+506 7080-5578). Solo envíanos un mensaje o llámanos. Estaremos pendientes de tu vuelo y el chofer te estará esperando en el punto de encuentro acordado con un rótulo con tu nombre.$es$
where question = $en$What if I can't find my driver at the airport?$en$;

-- 21
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué pasa si la dirección de mi alojamiento es difícil de encontrar?$es$,
  answer_es = $es$Danos todos los detalles que puedas: dirección completa, coordenadas GPS (¡ayudan muchísimo!), el nombre en Google Maps o Waze, puntos de referencia cercanos y el número de teléfono de tu anfitrión. Nuestros choferes son de la zona y la conocen muy bien. También puedes compartirnos tu ubicación por WhatsApp el día de la recogida.$es$
where question = $en$What if my accommodation address is hard to find?$en$;

-- 22
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cuánto equipaje puedo llevar?$es$,
  answer_es = $es$Cada pasajero puede llevar 1 maleta grande facturada (de hasta 50 lb / 23 kg) más 1 equipaje de mano (bolso, mochila o bolsa pequeña). Nuestros vehículos tienen espacio de sobra para las maletas. Si llevas artículos de gran tamaño o más equipaje del permitido, avísanos al reservar para coordinar un vehículo más grande si hace falta.$es$
where question = $en$How much luggage can I bring?$en$;

-- 23
update public.faqs_ruta_pacifico set
  question_es = $es$¿Puedo llevar una tabla de surf?$es$,
  answer_es = $es$Las tablas de surf y otros equipos deportivos grandes normalmente caben en nuestros vehículos. Avísanos al momento de reservar para asegurarnos de que el vehículo tenga espacio suficiente o coordinar una parrilla de techo si es necesario. Puede aplicar un cargo adicional por artículos de gran tamaño, según el equipo.$es$
where question = $en$Can I bring a surfboard?$en$;

-- 24
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué pasa si llevo más equipaje del permitido?$es$,
  answer_es = $es$Si excedes la franquicia de equipaje, avísanos al reservar. Puede que necesitemos coordinar un vehículo más grande, lo que podría tener un cargo adicional. Si llegas con exceso de equipaje que no cabe de forma segura en el vehículo asignado, es posible que no podamos brindarte el servicio y no se haría ningún reembolso.$es$
where question = $en$What if I have more luggage than the allowance?$en$;

-- 25
update public.faqs_ruta_pacifico set
  question_es = $es$¿Hay espacio para guardar el equipaje durante el viaje?$es$,
  answer_es = $es$Sí, todas las maletas van seguras en el compartimento de carga trasero. Puedes llevar contigo en tu asiento los artículos personales pequeños. Asegúrate de llevarte todos tus objetos de valor y documentos importantes al bajarte del vehículo en tu destino.$es$
where question = $en$Is there storage space in the vehicle while we travel?$en$;

-- 26
update public.faqs_ruta_pacifico set
  question_es = $es$¿Ofrecen sillas para niños?$es$,
  answer_es = $es$¡Sí! Ofrecemos sillas para niños y asientos elevadores (boosters) GRATIS. Debes solicitarlos al momento de reservar e indicar la edad de cada niño. La ley costarricense exige silla de seguridad para los menores de 12 años. Tenemos sillas adecuadas para niños desde los 0 años en adelante.$es$
where question = $en$Do you provide car seats for children?$en$;

-- 27
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué tipos de sillas para niños tienen disponibles?$es$,
  answer_es = $es$Ofrecemos asientos elevadores (boosters) y sillas orientadas hacia adelante, adecuadas para niños de 3 a 12 años (15 a 36 kg / 33 a 79 lb). Para bebés y niños menores de 3 años te recomendamos mucho traer tu propia silla aprobada por la FAA (también tenemos, por si no traes la tuya), ya que las regulaciones locales y la calidad de las sillas pueden variar.$es$
where question = $en$What types of car seats do you have available?$en$;

-- 28
update public.faqs_ruta_pacifico set
  question_es = $es$¿Debería traer mi propia silla para niños?$es$,
  answer_es = $es$Si viajas con un bebé o un niño menor de 3 años, te recomendamos traer tu propia silla aprobada por la FAA, por seguridad y porque tu hijo ya está acostumbrado a ella. Para niños más grandes, los asientos elevadores que ofrecemos son suficientes. Si traes tu propia silla, cuenta con unos minutos extra para instalarla al momento de la recogida.$es$
where question = $en$Should I bring my own car seat?$en$;

-- 29
update public.faqs_ruta_pacifico set
  question_es = $es$¿El chofer puede ayudarme a instalar la silla para niños?$es$,
  answer_es = $es$Nuestros choferes pueden ayudarte con la instalación, pero conviene que conozcas bien cómo se instala tu propia silla. Toma en cuenta que no todos los vehículos tienen cinturones de tres puntos en los asientos traseros (la regulación costarricense solo los exige en los asientos delanteros), así que prepárate para instalarla con cinturón de cadera si hace falta.$es$
where question = $en$Can the driver help install my car seat?$en$;

-- 30
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué tipo de vehículos usan?$es$,
  answer_es = $es$Usamos vans y SUV modernas con aire acondicionado (modelos 2025 o más nuevos). Todos los vehículos están completamente asegurados, cuentan con licencia de las autoridades de turismo de Costa Rica y se mantienen bajo altos estándares de seguridad.$es$
where question = $en$What type of vehicles do you use?$en$;

-- 31
update public.faqs_ruta_pacifico set
  question_es = $es$¿Los vehículos tienen aire acondicionado?$es$,
  answer_es = $es$¡Sí! Todos nuestros vehículos tienen aire acondicionado en perfecto funcionamiento. Costa Rica puede ser muy caliente y húmeda, así que nos aseguramos de que todos nuestros shuttles sean cómodos. Siempre puedes pedirle al chofer que ajuste la temperatura a tu gusto.$es$
where question = $en$Are the vehicles air-conditioned?$en$;

-- 32
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cuántos pasajeros caben en cada vehículo?$es$,
  answer_es = $es$Nuestros vehículos estándar tienen esta capacidad: van pequeña (de 1 a 6 pasajeros + equipaje), van (de 7 a 9 pasajeros + equipaje) y van grande (de 10 a 12 pasajeros + equipaje). La capacidad máxima incluye tanto adultos como niños. Nos aseguramos de que todos viajen cómodos y con espacio suficiente.$es$
where question = $en$How many passengers fit in each vehicle?$en$;

-- 33
update public.faqs_ruta_pacifico set
  question_es = $es$¿Hay WiFi en los vehículos?$es$,
  answer_es = $es$La disponibilidad de WiFi varía según el vehículo. Muchos de nuestros shuttles ofrecen WiFi gratis, aunque la calidad de la conexión depende de la ruta y de la cobertura celular. En zonas remotas la conectividad puede ser limitada. Con confianza, pregúntale a tu chofer si hay WiFi disponible.$es$
where question = $en$Is WiFi available in the vehicles?$en$;

-- 34
update public.faqs_ruta_pacifico set
  question_es = $es$¿Puedo fumar en el vehículo?$es$,
  answer_es = $es$No, está estrictamente prohibido fumar en todos nuestros vehículos. Esto incluye cigarrillos, puros, vapeadores y cualquier otro dispositivo para fumar. Costa Rica tiene leyes estrictas contra el fumado en el transporte público, por la comodidad y seguridad de todos los pasajeros.$es$
where question = $en$Can I smoke in the vehicle?$en$;

-- 35
update public.faqs_ruta_pacifico set
  question_es = $es$¿Los vehículos son accesibles para sillas de ruedas?$es$,
  answer_es = $es$Por ahora, nuestra flota estándar no cuenta con rampas ni elevadores para sillas de ruedas. Sin embargo, podemos asistir a pasajeros que puedan pasar de su silla de ruedas al asiento del vehículo. Contáctanos directamente para conversar sobre tus necesidades específicas de accesibilidad y haremos todo lo posible por acomodarte.$es$
where question = $en$Are your vehicles wheelchair accessible?$en$;

-- 36
update public.faqs_ruta_pacifico set
  question_es = $es$¿Los choferes hablan inglés?$es$,
  answer_es = $es$¡Sí! Todos nuestros choferes hablan al menos inglés básico y muchos lo hablan con fluidez. Pueden responder tus preguntas sobre Costa Rica, darte recomendaciones y garantizar una comunicación clara durante todo el viaje. Además, a la mayoría le encanta compartir su conocimiento local sobre las zonas por las que van pasando.$es$
where question = $en$Do your drivers speak English?$en$;

-- 37
update public.faqs_ruta_pacifico set
  question_es = $es$¿Los choferes tienen licencia y seguro?$es$,
  answer_es = $es$Por supuesto. Todos nuestros choferes cuentan con los permisos especiales que exige la ley costarricense para operar transporte turístico. Todos los vehículos tienen cobertura de seguro completa, incluido el seguro de responsabilidad civil. Nuestros choferes pasan por verificación de antecedentes y tienen amplia experiencia en las carreteras de Costa Rica.$es$
where question = $en$Are your drivers licensed and insured?$en$;

-- 38
update public.faqs_ruta_pacifico set
  question_es = $es$¿El chofer me ayuda con el equipaje?$es$,
  answer_es = $es$¡Sí! Nuestros choferes te ayudan a cargar y descargar las maletas, tanto en el punto de recogida como en el destino. Eso sí, te recomendamos llevar personalmente tus objetos de valor, artículos frágiles y documentos importantes.$es$
where question = $en$Will the driver help with my luggage?$en$;

-- 39
update public.faqs_ruta_pacifico set
  question_es = $es$¿El chofer puede darme recomendaciones o información turística?$es$,
  answer_es = $es$¡Claro que sí! Nuestros choferes son locales y conocen Costa Rica muy bien. Con gusto te cuentan sobre los destinos, te recomiendan restaurantes, te explican lo que vas viendo en la ruta y responden tus preguntas sobre la cultura costarricense. ¡Para muchos viajeros, estas conversaciones son de lo mejor del viaje!$es$
where question = $en$Can the driver make recommendations or provide tourist information?$en$;

-- 40
update public.faqs_ruta_pacifico set
  question_es = $es$¿Se acostumbra dejar propina?$es$,
  answer_es = $es$La propina no es obligatoria, pero se agradece si el servicio te gustó. Una propina típica es del 10% al 15% de la tarifa, o de $10 a $20 USD por un servicio excelente. Puedes darla en efectivo (dólares o colones) directamente a tu chofer.$es$
where question = $en$Is tipping expected?$en$;

-- 41
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cómo están las carreteras en Costa Rica?$es$,
  answer_es = $es$Las rutas principales entre los destinos turísticos más populares son, en general, carreteras asfaltadas y en buen estado. Algunas zonas rurales o destinos remotos pueden tener tramos de lastre sin asfaltar, sobre todo en la época lluviosa (de mayo a noviembre). Nuestros choferes tienen experiencia en todo tipo de caminos y manejan con precaución. Con lluvia fuerte, los tiempos de viaje pueden ser más largos.$es$
where question = $en$What are the road conditions like in Costa Rica?$en$;

-- 42
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué pasa si hay un cierre de vía o trabajos en la carretera?$es$,
  answer_es = $es$Nuestros choferes están pendientes del estado de las carreteras y tomarán la mejor ruta alternativa disponible si hay cierres o trabajos en la vía. En los casos poco comunes en que una carretera quede intransitable por el clima o una emergencia, te contactaremos de inmediato para conversar las opciones. No nos hacemos responsables por atrasos fuera de nuestro control, pero siempre buscamos una solución.$es$
where question = $en$What if there's a road closure or construction?$en$;

-- 43
update public.faqs_ruta_pacifico set
  question_es = $es$¿Los shuttles son seguros y están asegurados?$es$,
  answer_es = $es$¡Sí! La seguridad es nuestra prioridad número uno. Todos los vehículos tienen cobertura de seguro completa, incluidos el seguro de responsabilidad civil y el seguro de pasajeros. Nuestros choferes son operadores turísticos con licencia y con un historial de manejo limpio. Los vehículos pasan por mantenimiento regular e inspecciones de seguridad.$es$
where question = $en$Are your shuttles safe and insured?$en$;

-- 44
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué pasa si hay un accidente o una emergencia?$es$,
  answer_es = $es$En el improbable caso de un accidente o una emergencia, nuestros choferes están capacitados para manejar la situación y llamarán a los servicios de emergencia si hace falta. Todos los pasajeros están cubiertos por nuestro seguro. Ante cualquier emergencia, contáctanos de inmediato al +506 7080-5578.$es$
where question = $en$What happens if there's an accident or emergency?$en$;

-- 45
update public.faqs_ruta_pacifico set
  question_es = $es$¿Es seguro viajar de noche en Costa Rica?$es$,
  answer_es = $es$En general, recomendamos viajar de día cuando sea posible, por mejor visibilidad y para disfrutar del paisaje. Sin embargo, nuestros choferes tienen experiencia manejando de noche y conocen todas nuestras rutas. Si tu vuelo llega tarde, te llevaremos a tu destino con toda seguridad, sin importar la hora.$es$
where question = $en$Is it safe to travel at night in Costa Rica?$en$;

-- 46
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué pasa si dejo algo olvidado en el vehículo?$es$,
  answer_es = $es$Revisa con cuidado que lleves todas tus pertenencias antes de bajarte del vehículo. No nos hacemos responsables por objetos perdidos. Si te das cuenta de que dejaste algo, contáctanos de inmediato a reservations@rutapacifico.com o al +506 7080-5578. Intentaremos coordinar con tu chofer para recuperarlo y devolvértelo, aunque no podemos garantizar que aparezca.$es$
where question = $en$What if I leave something in the vehicle?$en$;

-- 47
update public.faqs_ruta_pacifico set
  question_es = $es$¿Pueden atender grupos de más de 12 personas?$es$,
  answer_es = $es$¡Sí! Para grupos de 13 pasajeros o más, podemos coordinar vehículos más grandes o varios shuttles. Contáctanos directamente a reservations@rutapacifico.com o por WhatsApp al +506 7080-5578 para una cotización personalizada. Tenemos tarifas para grupos y nos aseguramos de que todo tu grupo viaje junto (o en shuttles coordinados).$es$
where question = $en$Can you accommodate groups larger than 12 people?$en$;

-- 48
update public.faqs_ruta_pacifico set
  question_es = $es$¿Ofrecen descuentos para grupos grandes?$es$,
  answer_es = $es$Ofrecemos tarifas competitivas para grupos grandes. Aunque nuestros precios estándar ya son muy convenientes (precio por vehículo, no por persona), es posible que podamos darte tarifas especiales para grupos de 13 o más pasajeros o para varios traslados. ¡Contáctanos para una cotización personalizada!$es$
where question = $en$Do you offer discounts for large groups?$en$;

-- 49
update public.faqs_ruta_pacifico set
  question_es = $es$¿Puedo reservar varios shuttles para distintas fechas en una sola reserva?$es$,
  answer_es = $es$Por supuesto. En nuestro sitio web puedes reservar varios traslados distintos en una misma reserva.$es$
where question = $en$Can I book multiple shuttles for different dates in one reservation?$en$;

-- 50
update public.faqs_ruta_pacifico set
  question_es = $es$¿Ofrecen tours además del transporte?$es$,
  answer_es = $es$¡Sí! Revisa nuestra sección de Tours Privados en rutapacifico.com. Ofrecemos tours privados de día completo a destinos populares como el Volcán Arenal, aguas termales, cataratas, tours de vida silvestre y más, siempre con tu propio guía privado y tu propio transporte.$es$
where question = $en$Do you offer tours in addition to transportation?$en$;

-- 51
update public.faqs_ruta_pacifico set
  question_es = $es$¿A qué aeropuerto debo llegar para ir a la costa Pacífica: LIR o SJO?$es$,
  answer_es = $es$Para casi todos los destinos que atendemos, el aeropuerto de Liberia (LIR) es la mejor opción. Es el aeropuerto internacional más cercano a las playas de Guanacaste (Tamarindo, Flamingo, Conchal, Papagayo, Nosara, Sámara y Playas del Coco), así como a Rincón de la Vieja y a la península de Nicoya. Los vuelos llegan a una terminal pequeña y moderna, y migración suele ser rápida. El aeropuerto Juan Santamaría (SJO), en San José, queda más lejos de la costa y suma más de 4 horas de manejo, así que solo lo recomendamos si tu viaje también incluye la ciudad de San José, La Fortuna/Arenal o Monteverde. Aun así, podemos recogerte en SJO a solicitud si tu itinerario lo necesita.$es$
where question = $en$Which airport should I fly into for the Pacific coast — LIR or SJO?$en$;

-- 52
update public.faqs_ruta_pacifico set
  question_es = $es$¿Con cuánta anticipación debo llegar al aeropuerto para mi vuelo de salida?$es$,
  answer_es = $es$Para vuelos internacionales, llega 3 horas antes de la salida. Para vuelos nacionales, entre 1 y 1.5 horas antes. Si tienes un vuelo internacional temprano en la mañana (antes del mediodía), te recomendamos quedarte cerca del aeropuerto la noche anterior para evitar estrés y atrasos por el tráfico.$es$
where question = $en$How early should I arrive at the airport for my departure flight?$en$;

-- 53
update public.faqs_ruta_pacifico set
  question_es = $es$¿Necesito dar mi número de vuelo al reservar?$es$,
  answer_es = $es$Sí, por favor indícanos tu número de vuelo para las recogidas en el aeropuerto. Así podemos hacer seguimiento de tu vuelo por si hay atrasos y ajustar la hora de recogida. Para recogidas en hoteles o alquileres, la información del vuelo no es necesaria, a menos que quieras coordinar la hora con tu itinerario de vuelo.$es$
where question = $en$Do I need to provide my flight number when booking?$en$;

-- 54
update public.faqs_ruta_pacifico set
  question_es = $es$¿Necesito efectivo en Costa Rica o puedo usar tarjeta de crédito?$es$,
  answer_es = $es$Tu shuttle ya está pagado por adelantado, así que no necesitas efectivo para eso. Sin embargo, te recomendamos llevar algo de efectivo (dólares o colones) para propinas, restaurantes pequeños, sodas, souvenirs y zonas rurales donde no aceptan tarjetas. Los hoteles y restaurantes grandes aceptan tarjetas. Hay cajeros automáticos en casi todas partes.$es$
where question = $en$Do I need cash in Costa Rica or can I use credit cards?$en$;

-- 55
update public.faqs_ruta_pacifico set
  question_es = $es$¿Debo cambiar dinero antes de llegar a Costa Rica?$es$,
  answer_es = $es$El dólar estadounidense se acepta ampliamente en las zonas turísticas, así que no necesitas cambiar dinero antes de llegar. Si necesitas colones, puedes usar los cajeros automáticos del aeropuerto o de los pueblos. Las tarjetas de crédito funcionan en la mayoría de los lugares. Muchos negocios tienen sus precios en dólares.$es$
where question = $en$Should I exchange money before arriving in Costa Rica?$en$;

-- 56
update public.faqs_ruta_pacifico set
  question_es = $es$¿Qué debo llevar para el viaje en shuttle?$es$,
  answer_es = $es$Lo esencial: pasaporte, confirmación de la reserva, celular con WhatsApp, snacks y agua (sobre todo en viajes largos), bloqueador solar, una chaqueta ligera (el aire acondicionado puede estar frío), medicamento para el mareo si lo necesitas, entretenimiento para los niños y cámara para las fotos del camino. Usa ropa y zapatos cómodos.$es$
where question = $en$What should I pack for my shuttle ride?$en$;

-- 57
update public.faqs_ruta_pacifico set
  question_es = $es$¿Costa Rica es un país seguro para los turistas?$es$,
  answer_es = $es$¡Sí! Costa Rica es uno de los países más seguros de Centroamérica y recibe millones de turistas cada año. Usa el sentido común: no dejes objetos de valor a la vista dentro de los vehículos, usa la caja fuerte del hotel y presta atención a tu entorno. Nuestros choferes son locales y pueden darte consejos de seguridad actualizados sobre zonas específicas.$es$
where question = $en$Is Costa Rica safe for tourists?$en$;

-- 58
update public.faqs_ruta_pacifico set
  question_es = $es$¿Cuál es la mejor época del año para visitar Costa Rica?$es$,
  answer_es = $es$La época seca (de diciembre a abril) es la más popular: llueve menos y las playas están soleadas. La época verde (de mayo a noviembre) tiene lluvias por la tarde, pero hay menos gente, los paisajes son más verdes y muchas veces los precios son mejores. ¡Las dos épocas son excelentes! Las rutas principales son transitables todo el año, aunque la lluvia puede causar atrasos.$es$
where question = $en$What's the best time of year to visit Costa Rica?$en$;

-- 59
update public.faqs_ruta_pacifico set
  question_es = $es$No recibí mi correo de confirmación, ¿qué hago?$es$,
  answer_es = $es$Primero revisa tu carpeta de spam o correo no deseado, porque a veces los correos llegan ahí. Si aun así no lo ves, escríbenos a reservations@rutapacifico.com con tu nombre y la fecha de la reserva. Te reenviaremos la confirmación de inmediato. Tu reserva está segura aunque el correo se haya atrasado.$es$
where question = $en$I didn't receive my confirmation email, what should I do?$en$;

-- 60
update public.faqs_ruta_pacifico set
  question_es = $es$¿Puedo hacer cambios desde el sitio web o tengo que escribir por correo?$es$,
  answer_es = $es$Para modificaciones o cancelaciones, escríbenos a reservations@rutapacifico.com con tu número de referencia de la reserva y los cambios que necesitas. Así queda un registro por escrito y podemos confirmar los cambios correctamente. Para solicitudes urgentes (con menos de 24 horas), escríbenos también por WhatsApp al +506 7080-5578.$es$
where question = $en$Can I make changes through the website or do I need to email?$en$;

-- 61
update public.faqs_ruta_pacifico set
  question_es = $es$¿Mi información de pago está segura?$es$,
  answer_es = $es$¡Por supuesto! Usamos Stripe, uno de los procesadores de pago más seguros del mundo, con cifrado de nivel bancario. Nunca guardamos los datos de tu tarjeta de crédito en nuestros servidores. Todas las transacciones cumplen con la norma PCI y están protegidas por varias capas de seguridad.$es$
where question = $en$Is my payment information secure?$en$;

-- 62
update public.faqs_ruta_pacifico set
  question_es = $es$¿Por qué se paga al reservar y no directamente al chofer?$es$,
  answer_es = $es$El pago por adelantado garantiza que tu reserva quede confirmada y nos permite coordinar la logística con anticipación. Además, te da un procesamiento de pago seguro, recibos por correo y políticas de cancelación claras. Es la práctica estándar de los servicios de transporte profesionales en todo el mundo.$es$
where question = $en$Why do you require payment at booking instead of paying the driver?$en$;

-- 63
update public.faqs_ruta_pacifico set
  question_es = $es$¿Tienen una aplicación móvil?$es$,
  answer_es = $es$Por ahora no tenemos una aplicación móvil, ¡pero nuestro sitio web está totalmente optimizado para celular! Puedes reservar, ver tus confirmaciones y acceder a toda la información fácilmente desde el navegador de tu teléfono. Guarda nuestro contacto para comunicarte fácilmente por WhatsApp con tu chofer.$es$
where question = $en$Do you have a mobile app?$en$;

commit;

-- 63 FAQs translated (63 update statements above).
-- Sanity check: should print 0 once every live row has matched.
select count(*) as untranslated from public.faqs_ruta_pacifico where question_es is null;
