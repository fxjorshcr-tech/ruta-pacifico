#!/usr/bin/env python3
"""
Source of truth for supabase/destinations_seed.sql.

Edit the DESTINATIONS list below and run:

    python3 supabase/destinations_content.py > supabase/destinations_seed.sql

then paste the generated SQL into the Supabase SQL Editor (after
destinations_schema.sql). The script derives each row's `slug` with the same
algorithm as src/lib/slug.ts (toSlug), so slugs always match the `routes`
table without anyone typing them by hand.

Tiers (see src/lib/destinations.ts):
  1  hub           — airports and the three big inland/pacific anchors
  2  core beach    — Guanacaste beach towns travellers search by name
  3  hub-linked    — indexable only when paired with a tier-1 hub
  4  noindex       — bookable, but not worth a search-engine page
"""
import re
import unicodedata

def to_slug(text: str) -> str:
    t = unicodedata.normalize("NFD", text.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")

# name            : EXACT text used in routes.origen / routes.destino (never edit)
# short_name      : how the page refers to the place
# region          : shown as a label and used in copy
# tier            : 1-4, see above
# intro_md        : what the place is (2 short paragraphs)
# arrival_md      : what the drive / arrival is like
# tips_md         : bullet list, practical
# best_for        : chips
DESTINATIONS = [
    # ───────────────────────────── TIER 1 · HUBS ─────────────────────────────
    dict(
        name="LIR - Liberia Int. Airport", short_name="Liberia Airport (LIR)", region="Guanacaste", tier=1,
        best_for=["Guanacaste beaches", "Short transfers", "Direct US & Canada flights"],
        intro_md="""Daniel Oduber Quirós International Airport (IATA: LIR) is the gateway to Guanacaste and the closest international airport to every beach on Costa Rica's Gold Coast. It is compact and modern: on most days you are through immigration, customs and out to the arrivals curb in 20 to 30 minutes.

Direct flights arrive from Houston, Dallas, Atlanta, Miami, Newark, New York, Toronto, Montreal and more, with seasonal service from Europe. Flying into LIR instead of San José saves three to five hours of driving for any Guanacaste destination.""",
        arrival_md="""Your driver waits at the arrivals exit holding a sign with your name. There is one exit, so you cannot miss each other. Flights are tracked in real time, so if you land early or late the pickup adjusts automatically at no charge. From the curb to the highway is five minutes; Route 21 runs south toward Tamarindo and the Flamingo coast, while Route 1 heads north-west toward Papagayo and Playas del Coco.""",
        tips_md="""- Clear immigration before buying a SIM card; the kiosks are on the public side after customs.
- The ATM at the exit dispenses both colones and dollars; small US bills are accepted almost everywhere.
- Departing: arrive 2.5 to 3 hours before international flights in high season (December to April), when the check-in hall fills up mid-morning.
- Duty-free is tiny. Buy coffee and souvenirs in town, not at the airport.""",
    ),
    dict(
        name="SJO - Juan Santamaria Int. Airport", short_name="San José Airport (SJO)", region="Central Valley", tier=1,
        best_for=["Arenal & Monteverde", "Manuel Antonio", "Multi-region trips"],
        intro_md="""Juan Santamaría International Airport (IATA: SJO) sits in Alajuela, 20 minutes from downtown San José, and is Costa Rica's largest airport. It has the widest choice of airlines and usually the cheapest fares, which is why many Guanacaste-bound travellers still land here.

SJO makes sense when your first nights are in the Central Valley, La Fortuna, Monteverde or the Central Pacific. For a beach-only week in Guanacaste, Liberia Airport is four hours closer.""",
        arrival_md="""Drivers meet you just outside the arrivals doors, past the taxi rank, holding a sign with your name. Leaving the airport takes a few minutes; from there the Route 27 toll highway drops toward the Pacific and Route 1 climbs north. Flight tracking is included, so a delayed landing never costs you the ride.""",
        tips_md="""- The airport exit is chaotic at peak hours. Ignore offers from touts and look for your name sign.
- SJO to Guanacaste is a 4 to 5 hour drive. If you land after 4 pm, consider an overnight in Alajuela and leave fresh the next morning.
- Toll roads are paid by the driver and already included in your fixed price.
- Departure tax is now included in airline tickets; there is nothing to pay at the counter.""",
    ),
    dict(
        name="La Fortuna (Arenal)", short_name="La Fortuna", region="Northern Zone", tier=1,
        best_for=["Volcano views", "Hot springs", "Families"],
        intro_md="""La Fortuna is the small town at the foot of Arenal Volcano, the near-perfect cone that anchors Costa Rica's most popular inland destination. Hot springs, hanging bridges, waterfall hikes, white-water rafting and wildlife night walks are all within 20 minutes of the town centre.

It pairs naturally with a Guanacaste beach week: the volcano first for adventure and rain-forest green, then the coast for sun. The road between the two follows the north shore of Lake Arenal, one of the most scenic drives in the country.""",
        arrival_md="""From Liberia Airport the drive takes about 3 to 3.5 hours via Cañas, Tilarán and the lake road; from the Flamingo and Tamarindo coast add an hour. From San José it is roughly 3 hours through San Ramón. The last stretch winds around Lake Arenal with volcano views ahead. Your driver drops you at your hotel door, whether it is in town or at one of the lodges on the road to the national park.""",
        tips_md="""- The volcano is clearest early in the morning; clouds usually build by 11 am.
- Book hot springs for the evening of your arrival day, a good way to shake off the drive.
- Rain gear is useful year-round; La Fortuna sits on the wet Caribbean side of the divide.
- Most tours include hotel pickup, so a car is not needed once you are there.""",
    ),
    dict(
        name="Monteverde (Cloud Forest)", short_name="Monteverde", region="Puntarenas highlands", tier=1,
        best_for=["Cloud forest", "Zip lines", "Birdwatching"],
        intro_md="""Monteverde is a mountaintop community at 1,400 metres, famous for its cloud-forest reserves, hanging bridges, coffee farms and the original zip-line canopy tours. Mornings are cool and misty, afternoons often clear; the resplendent quetzal is the star bird between January and April.

It is a natural stop between Guanacaste and La Fortuna, or between the beaches and San José, and one of the few places in Costa Rica where you will want a light jacket.""",
        arrival_md="""The final 30 to 40 km climb from the Pan-American Highway is the reason people book a driver here: steep, winding, partly gravel, and fogged in on many afternoons. From Liberia Airport the trip takes about 3 hours, from Tamarindo or Flamingo about 3.5, and from San José roughly 3. Our vehicles run the road weekly and drivers know every curve. Sit back and watch the landscape change from dry lowlands to dripping forest.""",
        tips_md="""- Pack a warm layer and a rain shell; evenings drop to 12 to 15 °C.
- Reserve entrances (Monteverde Cloud Forest Reserve, Santa Elena) sell out in high season; book ahead.
- Santa Elena is the walkable town with restaurants and shops; lodges out in the forest are quieter.
- Leave early on departure day: the descent takes time and the highway can be slow near Puntarenas.""",
    ),
    dict(
        name="Manuel Antonio / Quepos", short_name="Manuel Antonio", region="Central Pacific", tier=1,
        best_for=["National park", "Wildlife", "Beach + jungle"],
        intro_md="""Manuel Antonio is Costa Rica's most visited national park: white-sand coves backed by rain forest where sloths, capuchin and squirrel monkeys and hundreds of bird species are seen on almost every walk. The hillside road between Quepos town and the park entrance is lined with hotels, restaurants and sunset viewpoints over the Pacific.

It is a long haul from Guanacaste, but a classic combination for travellers finishing at San José Airport, and an easy 3-hour run from SJO itself.""",
        arrival_md="""From San José the drive is about 3 hours on Route 27 and the coastal highway through Jacó. From Liberia Airport or the Guanacaste beaches allow 5 to 5.5 hours; the road is paved the whole way with a lunch stop on the coast at Jacó or Parrita. From La Fortuna it is roughly 4.5 hours. Your driver takes you to your hotel door, even on the steep hillside streets where taxis hesitate.""",
        tips_md="""- The national park is closed on Tuesdays and limits daily visitors; buy tickets online in advance.
- Hire a guide with a scope at the park entrance: you will see five times more wildlife.
- Never leave food unattended on the beach; the monkeys and raccoons are professionals.
- Quepos town, 15 minutes away, has the cheaper restaurants and the Saturday farmers' market.""",
    ),
    # ───────────────────────────── TIER 2 · CORE BEACHES ─────────────────────
    dict(
        name="Tamarindo (Guanacaste)", short_name="Tamarindo", region="Guanacaste", tier=2,
        best_for=["Surfing", "Nightlife", "Walkable town"],
        intro_md="""Tamarindo is the best-known beach town in Guanacaste: a long, gentle surf beach with lessons every morning, a walkable centre full of restaurants, cafés and surf shops, and sunsets watched from the sand by the whole town. Playa Langosta to the south and Playa Grande across the estuary offer quieter options a few minutes away.

It suits first-time visitors and groups who want everything within walking distance, and it is the base most travellers pick for a first Costa Rica beach week.""",
        arrival_md="""Liberia Airport to Tamarindo is about 65 km and 50 to 70 minutes on paved roads via Belén and Huacas. Your driver takes Route 21 south, then west through cattle country before the first glimpse of the Pacific at Villarreal. From Flamingo or Conchal it is 25 minutes; from Playas del Coco about an hour. Drop-off is at your hotel or condo door, including the villas up the hill in Tamarindo Heights and Playa Langosta.""",
        tips_md="""- The estuary boat to Playa Grande costs a couple of dollars and runs on demand from the north end of the beach.
- Surf lessons are best at mid to low tide in the morning, when the wind is calm.
- Tamarindo is walkable end to end in 15 minutes; a rental car mostly sits in a paid parking lot.
- Book dinner on Saturday nights in high season; the good places fill up.""",
    ),
    dict(
        name="Flamingo (Guanacaste)", short_name="Flamingo", region="Guanacaste", tier=2,
        best_for=["Sport fishing", "Marina", "Calm beaches"],
        intro_md="""Playa Flamingo is a curve of pale sand between two headlands, with a modern marina, some of Guanacaste's best sport fishing and catamaran sunset sails leaving daily. The beach is calmer than Tamarindo, the hillside villas have wide Pacific views, and Brasilito, Potrero and Conchal are all within a ten-minute drive.

It is the choice for travellers who want a quieter base with boats, snorkelling and easy access to Reserva Conchal and Las Catalinas.""",
        arrival_md="""From Liberia Airport the drive is about 1 hour along Route 21 through Belén and Huacas, then north past Brasilito. Tamarindo is 25 minutes away, Playas del Coco about 50 minutes, and the road is paved to the marina. Villa addresses on the hill can be tricky for GPS; send your rental's name or coordinates when booking and the driver will bring you to the gate.""",
        tips_md="""- Morning departures are best for fishing and diving trips; the wind picks up after lunch.
- Brasilito, five minutes south, has the local sodas for inexpensive lunches.
- The catamaran sunset sails leave from the beach or marina around 2 pm and include snorkelling.
- Flamingo's beach is swimmable most days; Potrero is even calmer for small children.""",
    ),
    dict(
        name="Conchal (Guanacaste)", short_name="Playa Conchal", region="Guanacaste", tier=2,
        best_for=["Resorts", "Snorkelling", "Turquoise water"],
        intro_md="""Playa Conchal is named for its sand of crushed shells and is known for the clearest, most turquoise water on the Gold Coast, ideal for snorkelling right off the beach. Reserva Conchal, home to the Westin and W hotels and a golf course, sits behind it, while the village of Brasilito next door keeps the local flavour.

It is the destination for resort stays with Flamingo, Tamarindo and Las Catalinas all within 25 minutes.""",
        arrival_md="""Liberia Airport to Conchal takes about 1 hour on paved roads through Belén and Huacas. Resort guests are dropped at the lobby; villa guests inside Reserva Conchal will need to give the driver their gate registration name. From Tamarindo it is 20 minutes, from Playas del Coco just under an hour.""",
        tips_md="""- Arrive at the beach in the morning before the day-trip crowds from Tamarindo; access is on foot from Brasilito.
- Bring your own snorkel gear; rentals on the beach are limited.
- Reserva Conchal restaurants are resort-priced; Brasilito's sodas are two minutes away.
- The resort golf course and spa are open to non-guests with reservations.""",
    ),
    dict(
        name="Playa Potrero (Guanacaste)", short_name="Playa Potrero", region="Guanacaste", tier=2,
        best_for=["Calm water", "Families", "Vacation rentals"],
        intro_md="""Playa Potrero is the long, calm, dark-sand bay just north of Flamingo, popular with families and long-stay visitors thanks to its gentle water, beachfront rentals and relaxed village of restaurants and small markets. Sunset over the Flamingo headland is the daily event.

It is quieter and cheaper than its neighbours yet only minutes from the marina, Las Catalinas and the Conchal snorkelling.""",
        arrival_md="""The drive from Liberia Airport is a little over an hour via Route 21, Belén, Huacas and Flamingo, all paved. Las Catalinas is 10 minutes north, Tamarindo 30 minutes south. Rentals are spread along the beach road and up the hills; share the property name and the driver will find it.""",
        tips_md="""- Potrero's water is the calmest of the Flamingo bays, good for paddleboards and small children.
- The Wednesday and Saturday markets in the village sell produce, bread and local crafts.
- Playa Penca and Playa Prieta, five minutes north, are near-empty pocket beaches.
- Stock up on groceries at the AutoMercado in Flamingo, the biggest supermarket in the area.""",
    ),
    dict(
        name="Las Catalinas, Guanacaste", short_name="Las Catalinas", region="Guanacaste", tier=2,
        best_for=["Car-free town", "Trails", "Boutique stays"],
        intro_md="""Las Catalinas is a car-free, Mediterranean-style beach town built into the hills above Playa Danta, with cobbled lanes, plazas, a handful of restaurants and 40 km of hiking and mountain-biking trails in the tropical dry forest behind it. Calm bays make it good for swimming, kayaking and paddleboarding.

Guests arrive by shuttle and leave their vehicles at the entrance, so a private transfer is the natural way in.""",
        arrival_md="""From Liberia Airport allow 1 hour 15 minutes via Belén, Huacas, Flamingo and Potrero, paved the entire way. Your driver drops you at the town entrance, where the Las Catalinas team meets you with luggage carts or a golf cart to your home or hotel. Flamingo is 15 minutes away, Tamarindo about 40.""",
        tips_md="""- Book a sunrise hike or bike ride on the trails; afternoons are hot and dry.
- Playa Danta is the swimming beach; Playa Dantita, a short walk north, is quieter.
- Restaurants in town are limited; Potrero and Flamingo add more options ten minutes away.
- Because the town is car-free, plan day trips with a driver rather than a rental.""",
    ),
    dict(
        name="Playa Grande (Guanacaste)", short_name="Playa Grande", region="Guanacaste", tier=2,
        best_for=["Surfing", "Turtle nesting", "Quiet"],
        intro_md="""Playa Grande is the wide, uncrowded surf beach across the estuary from Tamarindo and part of Las Baulas National Marine Park, one of the most important leatherback turtle nesting sites in the Pacific. The village is low-key, with a few hotels, surf camps and restaurants scattered under the trees.

It is Tamarindo's calmer twin: same waves, no crowds, and Tamarindo's restaurants a two-minute boat ride away.""",
        arrival_md="""Despite being visible from Tamarindo, Playa Grande is reached by road around the estuary: about 1 hour 10 minutes from Liberia Airport via Belén, Huacas and Matapalo, paved apart from a few village streets. From Tamarindo by car it is 30 minutes, or two minutes by estuary boat on foot. Your driver takes you to your hotel or house door.""",
        tips_md="""- Turtle-nesting tours run October to March at night with certified guides; book through your hotel.
- Beach lights are restricted at night to protect the turtles; bring a red-light headlamp.
- The surf here is powerful; beginners should stick to the south end near the estuary.
- Groceries are basic in the village; the big supermarkets are in Huacas and Tamarindo.""",
    ),
    dict(
        name="Papagayo Peninsula, Guanacaste", short_name="Papagayo Peninsula", region="Guanacaste", tier=2,
        best_for=["Luxury resorts", "Calm bays", "Closest to LIR"],
        intro_md="""The Papagayo Peninsula is Guanacaste's luxury enclave: the Four Seasons, Andaz, Planet Hollywood and the Papagayo Gulf's private residences share a peninsula of protected coves, calm water and a marina. Kayaking, snorkelling, sailing and golf are all on site.

Its biggest practical advantage is distance: it is the closest resort area to Liberia Airport, close enough that arriving guests can be on the beach within an hour of landing.""",
        arrival_md="""Liberia Airport to the Papagayo resorts is 30 to 35 minutes on excellent paved roads: Route 1 north-west, then the Guardia turn-off toward the coast and the peninsula's gated entrance. Drivers are pre-registered at the security gate and take you straight to your resort lobby. Playas del Coco is 15 minutes away for restaurants and shopping.""",
        tips_md="""- Resorts are self-contained but pricey; Playas del Coco has good restaurants a short ride away.
- Book boat trips from the Papagayo Marina in the morning; the bay is calmest before noon.
- Gate security asks for the resort name and reservation, so keep your confirmation handy.
- Day trips to Rincón de la Vieja volcano are 1.5 hours each way; leave early.""",
    ),
    dict(
        name="Playas del Coco (Guanacaste)", short_name="Playas del Coco", region="Guanacaste", tier=2,
        best_for=["Scuba diving", "Restaurants", "Budget-friendly"],
        intro_md="""Playas del Coco is the lively, unpretentious town of the northern Gold Coast, with a long calm bay, a busy main street of restaurants, bars and shops, and the departure point for Guanacaste's scuba diving to the Catalina and Bat Islands. Hermosa and Ocotal are five minutes away for quieter sand.

It is a favourite for divers, expats and travellers who want a real town with services close to Liberia Airport.""",
        arrival_md="""From Liberia Airport the drive is only 25 to 30 minutes on paved road via Route 1 and the Sardinal turn-off. Tamarindo is about an hour south, Papagayo 15 minutes north. Your driver drops you at your hotel, condo or house, including the developments up on the ridge toward Ocotal.""",
        tips_md="""- Dive boats leave around 7:30 am; book the night before through your operator.
- The town beach is fine for a swim but Playa Hermosa and Ocotal are prettier and quieter.
- Coco has the region's best selection of restaurants and a large supermarket for self-catering.
- Sunday afternoons are busy with local families; weekdays are relaxed.""",
    ),
    dict(
        name="Playa Hermosa (Guanacaste)", short_name="Playa Hermosa", region="Guanacaste", tier=2,
        best_for=["Swimming", "Couples", "Sunsets"],
        intro_md="""Playa Hermosa, the Guanacaste one, is a curved, calm, grey-sand bay north of Playas del Coco, with hotels and rentals set back under the trees and some of the gentlest swimming water on the coast. It is quiet, safe for children and known for its sunsets and beachfront restaurants.

Do not confuse it with Playa Hermosa near Jacó, a heavy surf beach on the Central Pacific.""",
        arrival_md="""Liberia Airport to Playa Hermosa is about 30 minutes via Route 1 and the Sardinal road, then north past Coco, fully paved. Papagayo is 10 minutes away, Tamarindo about an hour. Rentals here are spread along two access roads; give the driver the property name and he will take you to the door.""",
        tips_md="""- The bay is calm enough for paddleboarding and kayaking almost every day.
- Restaurants on the sand serve dinner at sunset; book the front tables in high season.
- Groceries, ATMs and pharmacies are in Playas del Coco, five minutes away.
- Water-sports rentals sit at the south end of the beach.""",
    ),
    dict(
        name="Nosara (Playa Guiones Area)", short_name="Nosara", region="Guanacaste (Nicoya coast)", tier=2,
        best_for=["Yoga", "Surfing", "Wellness"],
        intro_md="""Nosara, and specifically the Playa Guiones area, is Costa Rica's wellness capital: a seven-kilometre surf beach with consistent, beginner-friendly waves, yoga studios and retreats in the jungle behind it, and a low-rise community with no buildings on the sand. Nearby Playa Pelada is the sunset spot and Ostional, to the north, hosts mass sea-turtle arrivals.

The vibe is healthy, barefoot and slow. Roads are unpaved by design, which is exactly why visitors book a driver.""",
        arrival_md="""From Liberia Airport the trip takes about 2 to 2.5 hours: paved through Santa Cruz and Nicoya, then the last stretch toward the coast where the road turns to gravel. Our drivers do this route every week and know the smoothest lines and the shortcuts through Guiones' sandy lanes. From Tamarindo allow 2 hours in dry season. Drop-off is at your hotel, retreat or rental door.""",
        tips_md="""- The best beginner surf is at Playa Guiones mid-tide; lessons are everywhere.
- Guiones has no shops on the beach; the restaurants and studios are in the dirt lanes behind it.
- Dust is constant in dry season and mud in green season; bring appropriate footwear.
- Ostional's turtle arribadas happen a few nights a month around the new moon; ask your hotel.""",
    ),
    dict(
        name="Samara / Playa Carrillo (Guanacaste)", short_name="Sámara", region="Guanacaste (Nicoya coast)", tier=2,
        best_for=["Calm swimming", "Families", "Laid-back village"],
        intro_md="""Sámara is a relaxed village on a wide, reef-protected bay whose calm water makes it one of the safest swimming beaches in Guanacaste. Palm-lined, walkable and unhurried, it draws families, language students and long-stay travellers. Playa Carrillo, ten minutes south, is a postcard crescent of white sand with almost nothing on it.

It is the beach town for people who found Tamarindo too busy.""",
        arrival_md="""Liberia Airport to Sámara is about 2 hours on paved road through Santa Cruz and Nicoya; Carrillo adds ten minutes. From Nosara it is 45 minutes to an hour, partly gravel. Your driver takes you to your hotel or house door in Sámara or along the Carrillo road.""",
        tips_md="""- Swim anywhere in the bay; the reef keeps the waves small year-round.
- Playa Carrillo has no vendors or shade structures, so bring water and an umbrella.
- Sámara's Saturday farmers' market is worth a visit for fruit and baked goods.
- Kayak to Isla Chora at the south end of the bay for snorkelling.""",
    ),
    # ───────────────────────────── TIER 3 · HUB-LINKED ───────────────────────
    dict(
        name="Playa Avellanas (Guanacaste)", short_name="Playa Avellanas", region="Guanacaste", tier=3,
        best_for=["Surfing", "Quiet", "Day trips"],
        intro_md="""Playa Avellanas is a long, wild surf beach 20 minutes south of Tamarindo, known for Lola's beachfront restaurant, its white sand and mangrove backdrop, and consistent waves at every level from the estuary to the reef breaks. There is little development: a few boutique hotels, surf camps and villas hidden in the trees.

It suits surfers and couples who want Tamarindo's amenities within reach but silence at night.""",
        arrival_md="""From Liberia Airport allow 1 hour 20 minutes: paved to Villarreal near Tamarindo, then a gravel road south through Hacienda Pinilla. The road is rough in green season; our vehicles handle it comfortably. Tamarindo is 20 to 25 minutes away.""",
        tips_md="""- Lola's is the beach institution; arrive before noon for a table on the sand.
- There are no shops at the beach; buy supplies in Tamarindo or Villarreal.
- The surf here is best on mid to high tide in the morning.
- Playa Negra, further south, offers a famous reef break for experienced surfers.""",
    ),
    dict(
        name="Hacienda Pinilla (Guanacaste)", short_name="Hacienda Pinilla", region="Guanacaste", tier=3,
        best_for=["Golf", "Villas", "JW Marriott"],
        intro_md="""Hacienda Pinilla is a 4,500-acre gated resort community south of Tamarindo with an 18-hole golf course, beach club, equestrian centre, private villas and the JW Marriott Guanacaste Resort on its own stretch of Playa Mansita. Miles of paved and trail roads wind through dry forest to three beaches.

It appeals to golfers, families renting villas and guests who want a secure, self-contained resort with Tamarindo's restaurants 15 minutes away.""",
        arrival_md="""Liberia Airport to Hacienda Pinilla takes about 1 hour 10 minutes via Route 21, Belén and Villarreal to the main gate, all paved. Drivers register at the gate and continue to your villa or the JW Marriott lobby. Tamarindo is 15 minutes.""",
        tips_md="""- Villa guests should send the driver the rental's gate authorisation name in advance.
- The beach club and golf course are open to villa renters with a resort pass.
- Playa Avellanas, 10 minutes south inside the hacienda's lands, is the surf beach.
- Stock groceries in Tamarindo or Villarreal on the way in; there is no supermarket inside.""",
    ),
    dict(
        name="JW Marriott (Guanacaste)", short_name="JW Marriott Guanacaste", region="Guanacaste", tier=3,
        best_for=["Resort stay", "Families", "Beachfront"],
        intro_md="""The JW Marriott Guanacaste Resort & Spa sits on Playa Mansita inside Hacienda Pinilla, with one of the largest pools in Central America, a beachfront spa, several restaurants and direct access to the hacienda's golf course, trails and beaches. It is the best-known luxury resort south of Tamarindo.

Most guests arrive on private transfers from Liberia Airport and use the resort as a base for day trips to Tamarindo, Avellanas and Rincón de la Vieja.""",
        arrival_md="""From Liberia Airport the transfer takes about 1 hour 15 minutes on paved road via Belén and Villarreal, entering Hacienda Pinilla at the main gate and continuing 10 minutes to the resort lobby. Tamarindo is 15 to 20 minutes away.""",
        tips_md="""- Ask the driver to stop at the Villarreal supermarket if you want snacks and drinks in your room.
- Resort restaurants require reservations in high season; Tamarindo has more choice.
- The resort is a common pickup point for tours; schedule day trips before booking to avoid gaps.
- Sunset at the beachfront bar is the daily ritual.""",
    ),
    dict(
        name="RIU Guanacaste Hotel / RIU Palace Hotel (Guanacaste)", short_name="RIU Guanacaste", region="Guanacaste", tier=3,
        best_for=["All-inclusive", "Matapalo beach", "Groups"],
        intro_md="""The RIU Guanacaste and the neighbouring RIU Palace Costa Rica are the two large all-inclusive resorts on Playa Matapalo, north-west of Liberia and south of the Papagayo Gulf. Together they offer pools, buffets, entertainment and a wide, uncrowded beach; most guests never leave, but Playas del Coco and Liberia are both close for day trips.

Arrivals cluster around the afternoon flights into LIR, which is why a pre-booked private transfer is the stress-free way to reach the lobby.""",
        arrival_md="""From Liberia Airport the drive is about 40 minutes: Route 1 toward Guardia, then the paved road west to Matapalo. The driver takes you straight to the lobby of the RIU Guanacaste or the RIU Palace, whichever you booked. Playas del Coco is 25 minutes away.""",
        tips_md="""- Tell us which of the two RIU hotels you are staying in; they are next to each other but have separate lobbies.
- The resorts sit alone on the beach, so trips to Coco or Liberia need a driver.
- Check-in lines are longest around 3 to 5 pm when the US flights land.
- Guests often add a day trip to Rincón de la Vieja or a Tamarindo sunset run.""",
    ),
    dict(
        name="Punta Islita (Hotel & Beach)", short_name="Punta Islita", region="Guanacaste (Nicoya coast)", tier=3,
        best_for=["Secluded resort", "Honeymoons", "Art village"],
        intro_md="""Punta Islita is a remote hillside resort and village on the southern Nicoya coast, south of Sámara and Carrillo, known for its cliff-top infinity pool, the open-air art museum in the village, a macaw release programme and a private beach with almost nobody on it.

It is one of the most secluded stays in Guanacaste, which makes the transfer part of the experience.""",
        arrival_md="""From Liberia Airport allow 2.5 to 3 hours: paved through Nicoya and Sámara, then about 40 minutes of gravel road and river crossings along the coast past Carrillo. Our drivers know the road in every season. From Sámara it is about 45 minutes.""",
        tips_md="""- Bring cash for the village; cards are accepted at the hotel only.
- Ask for the beach club shuttle from the hotel; the walk down is steep.
- The road can be slow after heavy rain in September and October.
- Carrillo, 40 minutes north, is the nearest town with restaurants outside the hotel.""",
    ),
    dict(
        name="Brasilito (Guanacaste)", short_name="Brasilito", region="Guanacaste", tier=3,
        best_for=["Local village", "Budget stays", "Conchal access"],
        intro_md="""Brasilito is the working fishing village between Flamingo and Playa Conchal, with a plaza on the sand, inexpensive sodas and small hotels, and the footpath to Conchal's turquoise water starting at the south end of its beach. It is the affordable, local-flavour base on this stretch of coast.""",
        arrival_md="""Liberia Airport to Brasilito is about 1 hour via Route 21, Belén and Huacas on paved road. Flamingo is 5 minutes north, Tamarindo 20 minutes south.""",
        tips_md="""- Walk to Playa Conchal in 10 minutes along the beach heading south.
- The village sodas serve the cheapest fresh fish on the Flamingo coast.
- Brasilito's beach is calm and used by local families; Conchal is prettier for swimming.
- Supermarkets are in Huacas and Flamingo.""",
    ),
    dict(
        name="Ocotal (Guanacaste)", short_name="Ocotal", region="Guanacaste", tier=3,
        best_for=["Snorkelling", "Quiet cove", "Near Coco"],
        intro_md="""Playa Ocotal is a small, sheltered dark-sand cove five minutes south of Playas del Coco, with clear water for snorkelling straight off the beach, a cluster of hillside villas and condos and views to the Papagayo headlands. It is quiet and residential; Coco supplies the restaurants and services.""",
        arrival_md="""From Liberia Airport allow 35 minutes via Route 1, the Sardinal turn-off and Playas del Coco, then the short climb over the ridge to Ocotal, all paved. Villas here are up steep streets; give the driver the property name.""",
        tips_md="""- Snorkel the rocks at the north end of the beach in the morning for the clearest water.
- Father Rooster on the sand is the classic beach bar for sunset.
- Groceries and ATMs are in Coco, five minutes away.
- Dive operators in Coco pick up in Ocotal on request.""",
    ),
    dict(
        name="Rincon de la Vieja (National Park)", short_name="Rincón de la Vieja", region="Guanacaste", tier=3,
        best_for=["Volcano hikes", "Hot springs", "Adventure lodges"],
        intro_md="""Rincón de la Vieja is Guanacaste's active volcano and national park, an hour north-east of Liberia, with boiling mud pots, fumaroles, waterfalls and dry-forest trails. The surrounding haciendas and lodges offer hot springs, horseback rides, zip lines, tubing and canyoning, making it the adventure day-trip or overnight from the beaches.""",
        arrival_md="""Liberia Airport to the lodges takes 1 to 1.5 hours: paved to the Curubandé or Cañas Dulces turn-offs, then gravel for the final stretch to each hacienda. From Tamarindo or Flamingo allow 2 to 2.5 hours, from Papagayo about 1.5.""",
        tips_md="""- The national park's Las Pailas sector is closed on Mondays; the Santa María sector is quieter.
- Start hikes early; the trails are exposed and hot by midday.
- Most lodges include mud baths and hot springs in a day pass if you are not staying overnight.
- Sturdy shoes are essential; the volcanic ground is rough.""",
    ),
    dict(
        name="Rio Celeste", short_name="Río Celeste", region="Northern Zone (Tenorio)", tier=3,
        best_for=["Blue river", "Waterfall hike", "Nature lodges"],
        intro_md="""Río Celeste, inside Tenorio Volcano National Park, is the famously sky-blue river and waterfall created by a mineral reaction where two streams meet. The trail to the waterfall and the "teñideros" takes 2 to 3 hours round trip through cloud-forest and the nearby village of Bijagua hosts a handful of excellent lodges and sloth-spotting farms.

It is a popular stop between Guanacaste and La Fortuna, or an overnight from the beaches.""",
        arrival_md="""From Liberia Airport the drive is about 1.5 to 2 hours: Route 1 south to Cañas or north to Upala, then the paved road up to Bijagua and the park entrance. From La Fortuna allow 1.5 hours, from Tamarindo about 2.5.""",
        tips_md="""- The park caps daily visitors and closes the trail entrance by 2 pm; arrive in the morning.
- Swimming in the river is not allowed inside the park.
- The blue colour is most intense in dry season; heavy rain can turn the river brown for a day.
- Bijagua's sloth tours are a good add-on for families.""",
    ),
    dict(
        name="San Jose Downtown", short_name="San José", region="Central Valley", tier=3,
        best_for=["City stopover", "Museums", "Overnight before flights"],
        intro_md="""San José is Costa Rica's capital and the hub of the Central Valley: museums of gold and jade, the National Theatre, the Central Market and a growing food scene in Barrio Escalante. For most visitors it is a one-night stop on the way in or out, close to SJO airport and to the roads north to La Fortuna and west to the Pacific.""",
        arrival_md="""From SJO airport downtown hotels are 20 to 40 minutes depending on traffic. From Liberia Airport or the Guanacaste beaches allow 4 to 5 hours on Route 1 and Route 27; from La Fortuna about 3 hours, from Manuel Antonio about 3. Your driver takes you to the hotel door.""",
        tips_md="""- Avoid arriving or leaving the city between 6 and 9 am or 4 and 7 pm; traffic doubles the time.
- Barrio Escalante and Barrio Amón are the pleasant neighbourhoods to stay and eat in.
- Keep valuables discreet downtown after dark, as in any capital.
- An early airport pickup from downtown should leave at least 3 hours before an international flight.""",
    ),
    dict(
        name="Jaco", short_name="Jacó", region="Central Pacific", tier=3,
        best_for=["Surfing", "Nightlife", "Closest beach to SJO"],
        intro_md="""Jacó is the closest beach town to San José, a long surf beach with a busy strip of restaurants, bars, surf schools and condo towers, and the launch point for Los Sueños marina fishing and Carara National Park's scarlet macaws. It is the party beach of the Central Pacific and a convenient first or last night near SJO.""",
        arrival_md="""From SJO airport the drive is about 1.5 hours on the Route 27 toll road and the coastal highway. From Manuel Antonio allow 1.5 hours north; from Liberia Airport or Guanacaste 3.5 to 4 hours. The driver drops you at your hotel or condo.""",
        tips_md="""- Playa Hermosa de Jacó, 10 minutes south, has the serious surf; Jacó's own beach is for beginners.
- Watch for crocodiles from the Tárcoles bridge on the way in; your driver can stop.
- Carara National Park, 20 minutes north, is the easiest place to see scarlet macaws.
- Weekend nights are loud on the main strip; book a few blocks back for sleep.""",
    ),
    dict(
        name="Santa Teresa (Nicoya Peninsula)", short_name="Santa Teresa", region="Nicoya Peninsula", tier=3,
        best_for=["Surfing", "Boutique hotels", "Remote"],
        intro_md="""Santa Teresa is the surf-and-yoga village at the southern tip of the Nicoya Peninsula, a single dusty road along a long beach of powerful waves, boutique hotels, cafés and sunset bars, with Malpaís and Montezuma nearby. It is remote by design and has become one of Costa Rica's most fashionable beach destinations.""",
        arrival_md="""From Liberia Airport allow 4 to 4.5 hours by road through Nicoya, Jicaral and Cóbano, with gravel on the final approach. From SJO airport the fastest option combines a drive to Puntarenas with the Paquera ferry, about 4.5 to 5 hours in total; your driver handles the ferry tickets. From Tamarindo or Nosara plan for 3.5 to 4 hours.""",
        tips_md="""- ATVs and bikes are how people move along the road; ask your hotel about rentals.
- The surf is strong; beginners should take lessons at the calmer Playa Carmen end.
- Bring cash; ATMs run out on weekends in high season.
- Cabo Blanco reserve at the peninsula's tip is a beautiful half-day hike.""",
    ),
    dict(
        name="Montezuma (Nicoya Peninsula)", short_name="Montezuma", region="Nicoya Peninsula", tier=3,
        best_for=["Waterfalls", "Bohemian village", "Budget travel"],
        intro_md="""Montezuma is the bohemian village on the Gulf of Nicoya side of the peninsula's tip, famous for its three-tier waterfall, tide-pool beaches, howler monkeys in the village trees and a laid-back mix of backpackers, artists and families. Cabo Blanco reserve and Isla Tortuga snorkelling trips are the excursions.""",
        arrival_md="""From Liberia Airport the trip takes about 4 hours via Nicoya, Jicaral and Cóbano. From SJO the drive-plus-ferry route through Puntarenas and Paquera takes around 4.5 hours, ferry included. Santa Teresa is 40 minutes away over the hill.""",
        tips_md="""- The waterfall trail starts just south of the village; go early and wear grip shoes.
- Isla Tortuga boat tours leave from the beach in the morning.
- The village is tiny; most hotels are walkable from the drop-off point.
- Howler monkeys start at dawn; light sleepers may want earplugs.""",
    ),
    dict(
        name="Uvita", short_name="Uvita", region="South Pacific (Costa Ballena)", tier=3,
        best_for=["Whale watching", "Marino Ballena park", "Nature"],
        intro_md="""Uvita is the small town at the heart of the Costa Ballena, known for Marino Ballena National Park and its whale-tail sandbar, humpback whale season from July to October and December to March, waterfalls in the hills and a green, uncrowded coastline south of Dominical. Lodging ranges from jungle lodges to hillside villas with ocean views.""",
        arrival_md="""From SJO airport allow 3.5 to 4 hours via Route 27 and the coastal highway through Jacó and Quepos. From Manuel Antonio it is about 1 hour 15 minutes south on paved road. From Liberia Airport or Guanacaste plan for 6 hours or more.""",
        tips_md="""- Visit the whale tail at low tide; check tide tables before you go.
- Whale-watching boat tours run mornings from the park's beach entrances.
- Nauyaca Waterfalls, 30 minutes north, are worth a half day.
- Uvita has a supermarket and ATMs; villas in the hills need a car or driver for dinner runs.""",
    ),
    dict(
        name="Dominical (Beach Town)", short_name="Dominical", region="South Pacific (Costa Ballena)", tier=3,
        best_for=["Surfing", "Waterfalls", "Small-town vibe"],
        intro_md="""Dominical is a one-street surf town where the coastal highway meets the Barú river, with strong waves, a beach lined with vendors and sunset bars, and lush hills behind it leading to Nauyaca Waterfalls and the mountain village of San Isidro. It is smaller and more rustic than Manuel Antonio, 45 minutes north.""",
        arrival_md="""From SJO airport the drive is about 3.5 hours through Jacó and Quepos, all paved. From Manuel Antonio allow 45 minutes to an hour. From Liberia Airport or Guanacaste plan for 5.5 to 6 hours.""",
        tips_md="""- Rip currents are strong here; swim only where lifeguards are posted or at nearby Dominicalito.
- Nauyaca Waterfalls can be reached on foot, by truck or on horseback from the highway.
- Friday afternoons the town market sells produce and crafts.
- Playa Ventanas, south toward Uvita, has sea caves to explore at low tide.""",
    ),
    # ───────────────────────────── TIER 4 · NOINDEX (bookable, no SEO page) ──
    *[
        dict(name=n, short_name=s, region=r, tier=4, best_for=[], intro_md="", arrival_md="", tips_md="")
        for n, s, r in [
            ("Alajuela City", "Alajuela", "Central Valley"),
            ("Bajos del Toro (Cloud Forest)", "Bajos del Toro", "Central Valley highlands"),
            ("Bijagua (Origins Lodge)", "Bijagua", "Northern Zone (Tenorio)"),
            ("Cahuita", "Cahuita", "Caribbean Coast"),
            ("Esterillos (Este & Oeste Beach)", "Esterillos", "Central Pacific"),
            ("Guapiles", "Guápiles", "Caribbean lowlands"),
            ("Herradura (Los Sueños)", "Herradura", "Central Pacific"),
            ("La Pavona (Tortuguero)", "La Pavona", "Caribbean lowlands"),
            ("La Paz Waterfall Gardens", "La Paz Waterfall Gardens", "Central Valley highlands"),
            ("Los Chiles (Nicaragua Border)", "Los Chiles", "Northern Zone"),
            ("Malpaís (Nicoya Peninsula)", "Malpaís", "Nicoya Peninsula"),
            ("Manzanillo", "Manzanillo", "Caribbean Coast"),
            ("Ojochal", "Ojochal", "South Pacific (Costa Ballena)"),
            ("Penas Blancas (Nicaragua Border)", "Peñas Blancas", "Guanacaste (border)"),
            ("Puerto Caldera", "Puerto Caldera", "Central Pacific"),
            ("Puerto Jimenez (Osa Peninsula)", "Puerto Jiménez", "Osa Peninsula"),
            ("Puerto Viejo (Caribbean Coast)", "Puerto Viejo", "Caribbean Coast"),
            ("Punta Leona (Resort)", "Punta Leona", "Central Pacific"),
            ("Puntarenas", "Puntarenas", "Central Pacific"),
            ("Rio Perdido", "Río Perdido", "Guanacaste"),
            ("San Gerardo de Dota (Cloud Forest)", "San Gerardo de Dota", "Talamanca highlands"),
            ("Sarapiqui, Heredia", "Sarapiquí", "Caribbean lowlands"),
            ("Sierpe", "Sierpe", "South Pacific (Osa)"),
        ]
    ],
]


def sql_str(s: str) -> str:
    return "$md$" + s.strip() + "$md$" if s else "''"


def sql_arr(items):
    if not items:
        return "'{}'::text[]"
    return "array[" + ", ".join("'" + i.replace("'", "''") + "'" for i in items) + "]"


def main():
    print("-- GENERATED by supabase/destinations_content.py — do not edit by hand.")
    print("-- Run AFTER destinations_schema.sql. Safe to re-run: upserts on slug.")
    print("insert into public.destinations_ruta_pacifico")
    print("  (slug, name, short_name, region, tier, intro_md, arrival_md, tips_md, best_for)")
    print("values")
    rows = []
    for d in DESTINATIONS:
        rows.append(
            "(%s, %s, %s, %s, %d, %s, %s, %s, %s)"
            % (
                "'" + to_slug(d["name"]) + "'",
                "'" + d["name"].replace("'", "''") + "'",
                "'" + d["short_name"].replace("'", "''") + "'",
                "'" + d["region"].replace("'", "''") + "'",
                d["tier"],
                sql_str(d["intro_md"]),
                sql_str(d["arrival_md"]),
                sql_str(d["tips_md"]),
                sql_arr(d["best_for"]),
            )
        )
    print(",\n".join(rows))
    print("on conflict (slug) do update set")
    print("  name = excluded.name, short_name = excluded.short_name, region = excluded.region,")
    print("  tier = excluded.tier, intro_md = excluded.intro_md, arrival_md = excluded.arrival_md,")
    print("  tips_md = excluded.tips_md, best_for = excluded.best_for, updated_at = now();")


if __name__ == "__main__":
    main()
