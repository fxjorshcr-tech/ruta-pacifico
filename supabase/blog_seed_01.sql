-- ============================================================
-- Seed: first 3 blog articles (run AFTER blog_schema.sql).
-- Paste into Supabase SQL Editor and Run.
--
-- Cover images: cover_image_url is NULL for now. When your photos
-- are uploaded to Supabase Storage, update each row, e.g.:
--   update public.blog_posts
--   set cover_image_url = 'https://<project>.supabase.co/storage/v1/object/public/...',
--       cover_image_alt = 'Sunset over Tamarindo beach'
--   where slug = 'liberia-airport-to-tamarindo';
-- ============================================================

insert into public.blog_posts
  (slug, title, excerpt, category, tags, published, published_at, faqs, content_md)
values
(
  'liberia-airport-to-tamarindo',
  'How to Get from Liberia Airport (LIR) to Tamarindo: All 5 Options Compared',
  'Private shuttle, rental car, shared shuttle, taxi or bus — real prices, real travel times and honest advice for the 50-minute trip from Liberia Airport to Tamarindo.',
  'getting-around',
  array['liberia airport to tamarindo','LIR to tamarindo','tamarindo transportation','costa rica airport transfer','guanacaste shuttle'],
  true,
  now(),
  '[
    {"q": "How far is Tamarindo from Liberia Airport?", "a": "Tamarindo is about 65 km (40 miles) from Liberia International Airport (LIR). The drive takes around 50 minutes to 1 hour and 10 minutes on paved roads, depending on traffic through Belén and Huacas."},
    {"q": "Is there Uber at Liberia Airport?", "a": "Uber operates in a legal gray area in Costa Rica and pickups at Liberia Airport are unreliable — drivers are scarce in Guanacaste and often cancel airport requests. Most travelers pre-book a private shuttle or take an official orange airport taxi instead."},
    {"q": "How much does a private shuttle from LIR to Tamarindo cost?", "a": "A private shuttle for up to 6 passengers costs a fixed per-vehicle price (not per person), with taxes, tolls, flight tracking and child seats included. Check live prices at rutapacifico.com/private-shuttle — the price you see is the price you pay."},
    {"q": "Do I need a rental car if I am staying in Tamarindo?", "a": "Usually not. Tamarindo town is fully walkable, tours include hotel pickup, and day trips can be done by private shuttle. A rental car only pays off if you plan to change locations every day or explore remote beaches on your own schedule."},
    {"q": "What happens if my flight into LIR is delayed?", "a": "With a private shuttle from Ruta Pacifico, your flight is tracked in real time and the driver adjusts to your actual landing time at no extra cost. With taxis and shared shuttles, a long delay can mean losing your seat or waiting for the next departure."}
  ]'::jsonb,
  $md$
Tamarindo is about **65 km (40 miles)** from Liberia International Airport (LIR), and the drive takes **50–70 minutes** on fully paved roads. You have five realistic ways to make the trip: private shuttle, rental car, shared shuttle, official airport taxi, or public bus. Here is how they actually compare — with the honest trade-offs most travel sites skip.

## The quick comparison

| Option | Travel time | Typical cost | Best for |
| --- | --- | --- | --- |
| **Private shuttle** | ~50 min, direct | Fixed price per vehicle (1–6 pax) | Families, groups, first-timers |
| **Rental car** | ~55 min + pickup paperwork | $40–90/day + mandatory insurance | Independent explorers |
| **Shared shuttle** | 1.5–2.5 hrs (multiple stops) | ~$25–35 per person | Solo travelers on a budget |
| **Airport taxi** | ~50 min | ~$90–120, often negotiable | Walk-up, no reservation |
| **Public bus** | 3–4 hrs (via Liberia town, transfer) | ~$4–6 | Backpackers with time |

## Option 1: Private shuttle (the door-to-door choice)

A private shuttle means a driver waiting at the arrivals exit with your name on a sign, an air-conditioned van just for your group, and a **fixed price per vehicle** — not per person — with taxes, tolls, WiFi, cold water and child seats included.

The two big advantages over every other option:

- **Flight tracking.** If your flight lands early or two hours late, the driver adjusts automatically. Nobody is watching the clock but you.
- **Zero navigation on arrival day.** After a long travel day with kids and luggage, not thinking is a luxury worth paying for.

For a family of four or more, a private shuttle usually costs **less per person than a shared shuttle** — and takes less than half the time. See live prices for the [LIR → Tamarindo route](/private-shuttle/lir-to-tamarindo-guanacaste).

## Option 2: Rental car

The drive is easy: Route 21 south to Belén, then west through Huacas to Tamarindo — paved the whole way. A compact SUV runs **$40–90 per day** in high season, but budget for the part quote sites hide: Costa Rica's **mandatory liability insurance** (often $15–25/day, not included in online quotes) and a deposit hold of $1,000+ on your credit card.

A car makes sense if you plan to change beaches every day or two. If you're basing yourself in Tamarindo, be aware: the town is walkable end-to-end in 15 minutes, parking is tight, and most tours include hotel pickup anyway.

## Option 3: Shared shuttle

Shared shuttles cost roughly **$25–35 per person** and run on fixed schedules with multiple hotel stops. The catch is time: what's a 50-minute drive privately becomes **1.5–2.5 hours** as the van loops through Playas del Coco or Flamingo dropping other passengers. If your flight is delayed past the departure window, you may be rebooked on a later run. Fine for flexible solo travelers; frustrating with kids.

## Option 4: Official airport taxi

The orange airport taxis line up right outside arrivals — no reservation needed. Expect **$90–120 to Tamarindo** depending on your negotiation and the hour. Metered pricing is rare on this route; agree on the fare before getting in. It's a fair option if you land without a plan, though for the same money a pre-booked private shuttle gets you flight tracking, a newer vehicle and a confirmed price in writing.

## Option 5: Public bus

The cheapest route: local bus or taxi from the airport into Liberia town (~15 min), then a La Pampa/Tralapa bus toward Tamarindo. Total cost under **$6**, total time **3–4 hours** with a transfer and no luggage guarantees. Only worth it if the budget is truly tight and the schedule truly open.

## Our honest recommendation

- **Traveling as a family or group of 3+?** Private shuttle — faster than shared, cheaper per person, and the child seats are free.
- **Solo on a budget?** Shared shuttle.
- **Planning to change towns every day?** Rental car — but read the insurance fine print before you commit.

However you go: the road is safe, paved and beautiful, and in under an hour you'll trade airport air-conditioning for Tamarindo's sunset. Pura vida.
$md$
),
(
  'guanacaste-driving-times-from-liberia-airport',
  'Driving Times in Guanacaste: Real Distances from Liberia Airport to Every Beach Town',
  'The real driving times from Liberia Airport (LIR) to Tamarindo, Nosara, Flamingo, Papagayo, Coco, Sámara and beyond — including which roads are paved, from drivers who do these routes daily.',
  'getting-around',
  array['guanacaste driving times','liberia airport distances','LIR to nosara','costa rica road conditions','guanacaste beach towns map'],
  true,
  now(),
  '[
    {"q": "Which Guanacaste beach town is closest to Liberia Airport?", "a": "Playas del Coco is the closest major beach town at roughly 25 minutes from LIR, followed by Playa Hermosa and the Papagayo Peninsula at about 30 minutes. That is why the Coco–Hermosa–Papagayo corridor is popular for the first or last night of a trip."},
    {"q": "Is the road to Nosara paved?", "a": "Not all of it. The main highway is paved until after Nicoya, but the final stretch into Nosara is unpaved washboard road. It is passable year-round in a van or SUV, but it is dusty in dry season and muddy in rainy season — one reason many travelers prefer to be driven."},
    {"q": "How long is the drive from Liberia Airport to La Fortuna or Monteverde?", "a": "Around 3.5 hours to La Fortuna/Arenal and about 3 hours to Monteverde. The Monteverde route ends in a famously winding unpaved mountain climb. Both are very doable as private transfers with a stop for food or photos on the way."},
    {"q": "Does Google Maps give accurate times in Guanacaste?", "a": "Mostly on paved main roads, but it tends to be optimistic on unpaved stretches (Nosara, Monteverde) and does not account for slow traffic through towns like Belén on weekends. Add a 15-25% buffer to any estimate that includes dirt road."},
    {"q": "Can I stop at a supermarket on the way to my hotel?", "a": "Yes — with a private shuttle a quick grocery or pharmacy stop on the way is standard practice, especially for guests heading to villas in Flamingo, Potrero or Nosara. Just mention it to your driver."}
  ]'::jsonb,
  $md$
Every trip in Guanacaste starts with the same question: *how far is it, really?* Here are the actual driving times from **Liberia International Airport (LIR)** to every major destination — not Google Maps optimism, but what our drivers see day in, day out, including which roads are paved and where the last stretch gets rough.

## The master table

| Destination | Time from LIR | Distance | Road condition |
| --- | --- | --- | --- |
| Playas del Coco | ~25 min | 22 km | Paved |
| Playa Hermosa (Guanacaste) | ~30 min | 26 km | Paved |
| Papagayo Peninsula | ~30 min | 30 km | Paved |
| Playa Ocotal | ~30 min | 25 km | Paved |
| Tamarindo | ~50 min | 65 km | Paved |
| Playa Grande | ~1 hr | 70 km | Paved, short gravel at end |
| Flamingo / Brasilito / Conchal | ~1 hr | 65 km | Paved |
| Las Catalinas / Potrero | ~1 hr | 70 km | Paved |
| Playa Avellanas | ~1 hr 10 min | 75 km | Last 6 km unpaved |
| Playa Negra / Junquillal | ~1 hr 20 min | 80 km | Partially unpaved |
| Rincón de la Vieja NP | ~1.5 hrs | 60 km | Last stretch gravel |
| Nosara / Playa Guiones | ~2 hrs | 120 km | Last 25–30 km unpaved |
| Sámara / Playa Carrillo | ~2 hrs | 110 km | Paved |
| Río Celeste | ~2.5 hrs | 115 km | Mostly paved |
| Monteverde | ~3 hrs | 145 km | Final mountain climb unpaved |
| La Fortuna / Arenal | ~3.5 hrs | 200 km | Paved |
| San José | ~4 hrs | 215 km | Paved (Route 1) |
| Manuel Antonio | ~5 hrs | 300 km | Paved |

*Times assume normal daytime traffic. Add 15–25% for rainy-season afternoons, weekend beach traffic through Belén, or any route with dirt road.*

## The three zones of Guanacaste

**The 30-minute circle: Coco, Hermosa, Ocotal, Papagayo.** Closest to the airport and home to the big resorts (Four Seasons, Andaz, Secrets). If you land in the afternoon, you can be in the pool before sunset. Perfect for first and last nights.

**The one-hour coast: Tamarindo, Flamingo, Conchal, Las Catalinas, Potrero, Grande.** The heart of Gold Coast beach life — surf towns, white-sand beaches, the best restaurant scenes. All reachable on good paved roads in about an hour.

**The two-hour-plus adventures: Nosara, Sámara, and the volcanoes.** Worth every minute — but plan them as half-day travel days. Nosara's final 25–30 km of washboard dirt road is the most famous "shortcut that isn't" in Costa Rica: locals know which stretches to take slow, which is exactly when having a driver beats white-knuckling a rental.

## Renting a car vs. being driven: what the roads decide

For the paved one-hour coast, any car works. For **Nosara, Monteverde, Avellanas or rainy-season travel**, an SUV is strongly recommended if you self-drive — rental agencies may void coverage for river crossings, and washboard roads are where most rental damage happens.

A [private shuttle](/private-shuttle) removes the question entirely: fixed price, a driver who knows every pothole personally, WiFi to plan your week on the way, and a cooler of cold water. For LIR pickups, your flight is tracked in real time, so a delay never costs you your ride.

## One local tip

If your itinerary includes two bases (say, Papagayo first, then Nosara), don't backtrack to the airport to switch transport — a direct inter-beach transfer saves an hour or more. Guanacaste's beach towns connect directly, and the [route search](/private-shuttle) prices any combination instantly.
$md$
),
(
  'uber-in-guanacaste-costa-rica',
  'Is There Uber in Guanacaste, Costa Rica? What Travelers Should Know',
  'Uber technically exists in Costa Rica but barely functions in Guanacaste. Here is the real transportation picture for Tamarindo, Coco, Flamingo and Liberia Airport — from locals.',
  'travel-tips',
  array['uber costa rica','uber guanacaste','uber tamarindo','uber liberia airport','taxi guanacaste','getting around guanacaste'],
  true,
  now(),
  '[
    {"q": "Does Uber work at Liberia Airport (LIR)?", "a": "Rarely. Uber drivers are scarce in Guanacaste and airport pickups are unreliable — requests often go unmatched or get cancelled. Official orange airport taxis and pre-booked private shuttles are the dependable options at LIR."},
    {"q": "Is Uber legal in Costa Rica?", "a": "Uber operates in a legal gray area: the app works and thousands of rides happen daily in San José, but the service has never been formally regulated. In practice the bigger issue in Guanacaste is not legality but availability — there are simply very few drivers outside the capital."},
    {"q": "Is there Uber in Tamarindo?", "a": "Occasionally one or two drivers appear in high season, but you cannot rely on it — especially for early-morning airport runs. Local taxis and pre-booked shuttles are how people actually move."},
    {"q": "How do I get from my hotel in Guanacaste to a restaurant at night?", "a": "Short hops inside a town are easy: official red taxis, hotel-arranged drivers, or walking (Tamarindo and Coco are very walkable). It is trips BETWEEN towns and airport transfers where you need to pre-book."},
    {"q": "What is the safest way to get around Guanacaste without a car?", "a": "Pre-booked private shuttles for airport transfers and town-to-town trips, official taxis for short local rides, and tour operators (who include hotel pickup) for excursions. This combination covers a full vacation with zero driving."}
  ]'::jsonb,
  $md$
Short answer: **Uber exists in Costa Rica, but you should not count on it in Guanacaste.** The app that works flawlessly in San José is mostly a spinning wheel on the Gold Coast. Here's the real picture, so you can plan your trip around how transportation actually works here.

## Why Uber barely works in Guanacaste

Uber launched in Costa Rica in 2015 and remains popular in the **San José metro area**, where thousands of drivers are online at any hour. But Guanacaste is a different world:

- **Very few drivers.** Beach towns are small and spread out; there's no critical mass of Uber drivers waiting for pings. Open the app in Flamingo or Playa Grande and you'll usually see... nothing.
- **Airport pickups are the weak point.** Even when a driver appears in the app at LIR, cancellations are common — the driver may be 40 minutes away, and regulations around airport pickups make many unwilling to enter.
- **The distances are long.** A "quick ride" between beach towns is a 40–70 km round trip for the driver, so matches for inter-town trips fail even when drivers are online.

There's also the legal footnote: Uber has operated in a **regulatory gray area** for a decade in Costa Rica. In practice that affects travelers less than availability does — but it means no official airport pickup zones and no recourse if a ride falls through.

## What locals and smart travelers actually use

| Trip type | What actually works |
| --- | --- |
| Airport → hotel | Pre-booked private shuttle or official orange airport taxi |
| Between beach towns | Private shuttle booked a day ahead |
| Short hops in town | Official red taxis, hotel drivers, walking |
| Tours & day trips | Tour operators (hotel pickup included) |
| Nights out | Restaurant/bar can call a trusted local taxi |

### Airport transfers

This is the trip where winging it costs the most. Land at LIR at 2 pm in high season without a plan, and you're negotiating taxi fares in the heat with jet-lagged kids. A [pre-booked private shuttle](/private-shuttle) flips that: your driver tracks the flight, waits at the arrivals exit with a name sign, and the price was fixed when you booked — no surge, no negotiation, no surprises.

### Between towns

For hotel-to-hotel moves (Tamarindo → Nosara, Coco → Flamingo, Papagayo → Monteverde), pre-booked shuttles are the standard. Book by the evening before; you'll get a fixed per-vehicle price that beats what an on-demand ride would cost even if one existed.

### Inside town

Here's the good news: **you barely need transportation inside most Guanacaste beach towns.** Tamarindo, Coco and Sámara are walkable end to end. For a rainy night or a far restaurant, official red taxis (look for the yellow triangle on the door) are cheap and everywhere — your hotel or any restaurant will call one they trust.

## The bottom line

Don't build your Guanacaste plan around an app that works at home. Build it the way it works here:

1. **Pre-book your airport transfer** — it's the longest, most expensive trip of the vacation to improvise.
2. **Pre-book town-to-town moves** a day ahead.
3. **Walk and take red taxis** for everything local.

Do that, and you'll never once miss Uber. Check fixed prices for any route in Costa Rica at [rutapacifico.com/private-shuttle](/private-shuttle) — or just message us on WhatsApp; a real human answers.
$md$
);
