/**
 * Hotel & landmark → route-point resolution for the booking search.
 *
 * Guests search by the name of the place they are staying at ("Andaz",
 * "Four Seasons", "Tabacón"), not by the route point the shared `routes`
 * table prices ("Papagayo Peninsula, Guanacaste", "La Fortuna (Arenal)").
 * This module turns a free-text query into the route point(s) it belongs to
 * so the search shows "Andaz Costa Rica Resort → Papagayo" instead of "No
 * matches found" — every miss there is a lost booking.
 *
 * Client-safe (no server imports). Resolution is 100% in memory: each group
 * lists keywords that are substring-matched against the REAL route points the
 * form already loaded, so the exact DB spelling never has to be duplicated
 * here and a renamed route point never breaks a hotel.
 *
 * The list mirrors the one Cant Wait Travel ships (same `routes` table, same
 * route points), extended with landmark aliases (airport nicknames, volcano,
 * national parks). To add a hotel, drop it in the right group. To add a new
 * zone, add a group whose `match` keywords appear in that zone's route point.
 */

export interface CuratedGroup {
  /** Lower-cased keywords matched against the route-point name. */
  match: string[];
  hotels: { name: string; area?: string }[];
}

export const CURATED_HOTELS: CuratedGroup[] = [
  // ===========================================================================
  // LA FORTUNA / ARENAL
  // ===========================================================================
  {
    match: ["la fortuna", "arenal"],
    hotels: [
      { name: "Tabacón Thermal Resort & Spa", area: "Hot springs district" },
      { name: "Nayara Gardens" },
      { name: "Nayara Springs" },
      { name: "Nayara Tented Camp" },
      { name: "The Springs Resort & Spa" },
      { name: "Hotel Arenal Kioro Suites & Spa" },
      { name: "Amor Arenal" },
      { name: "The Royal Corin Thermal Water Spa & Resort" },
      { name: "Baldi Hot Springs Hotel & Spa" },
      { name: "Arenal Springs Resort & Spa" },
      { name: "Los Lagos Hotel Spa & Resort" },
      { name: "Arenal Observatory Lodge & Trails" },
      { name: "Volcano Lodge & Springs" },
      { name: "Arenal Manoa Resort & Hot Springs" },
      { name: "Hotel Silencio del Campo" },
      { name: "Casa Luna Hotel & Spa" },
      { name: "Hotel Lomas del Volcán" },
      { name: "Mountain Paradise Hotel" },
      { name: "Hotel Magic Mountain" },
      { name: "Hotel Montaña de Fuego Resort & Spa" },
      { name: "GreenLagoon Wellbeing Resort" },
      { name: "Essence Arenal Boutique Lodge" },
      { name: "Rancho Margot", area: "El Castillo" },
      { name: "Hotel San Bosco" },
      { name: "La Pradera del Arenal" },
      { name: "Selina La Fortuna", area: "Downtown" },
    ],
  },

  // ===========================================================================
  // MONTEVERDE
  // ===========================================================================
  {
    match: ["monteverde"],
    hotels: [
      { name: "Hotel Belmar" },
      { name: "Monteverde Lodge & Gardens" },
      { name: "Senda Monteverde Hotel" },
      { name: "El Establo Mountain Hotel" },
      { name: "Koora Monteverde" },
      { name: "Hotel Fonda Vela" },
      { name: "Hotel Poco a Poco" },
      { name: "Trapp Family Lodge" },
      { name: "Hotel Heliconia" },
      { name: "Cloud Forest Lodge" },
      { name: "Hotel El Sapo Dorado" },
      { name: "Monteverde Country Lodge" },
      { name: "Ficus Lodge" },
      { name: "Hotel Villa Verde" },
      { name: "Camino Verde B&B" },
      { name: "Valle Escondido Lodge" },
    ],
  },

  // ===========================================================================
  // MANUEL ANTONIO / QUEPOS
  // ===========================================================================
  {
    match: ["manuel antonio", "quepos"],
    hotels: [
      { name: "Parador Nature Resort & Spa" },
      { name: "Gaia Hotel & Reserve" },
      { name: "Tulemar Resort" },
      { name: "Arenas del Mar Beachfront & Rainforest Resort" },
      { name: "Si Como No Resort & Wildlife Refuge" },
      { name: "Makanda by the Sea" },
      { name: "Hotel Costa Verde" },
      { name: "La Mariposa Hotel" },
      { name: "Shana by the Beach" },
      { name: "Hotel San Bada", area: "Next to the National Park" },
      { name: "Issimo Suites Boutique Hotel & Spa" },
      { name: "Buena Vista Luxury Villas" },
      { name: "Hotel Verde Mar" },
      { name: "La Posada Private Jungle Bungalows" },
      { name: "Mango Moon Villa" },
      { name: "Hotel Plinio" },
      { name: "Karahé Beach Hotel" },
      { name: "Hotel Mono Azul" },
      { name: "Best Western Kamuk Hotel", area: "Quepos" },
      { name: "Selina Manuel Antonio" },
    ],
  },

  // ===========================================================================
  // GUANACASTE — PAPAGAYO PENINSULA
  // ===========================================================================
  {
    match: ["papagayo"],
    hotels: [
      { name: "Four Seasons Resort Costa Rica at Peninsula Papagayo" },
      { name: "Andaz Costa Rica Resort at Peninsula Papagayo" },
      { name: "Secrets Papagayo Costa Rica" },
      { name: "Dreams Las Mareas", area: "Far north Guanacaste" },
      { name: "Planet Hollywood Costa Rica" },
      { name: "El Mangroove, Autograph Collection" },
      { name: "Occidental Papagayo" },
    ],
  },
  // RIU resorts are their own route point in Guanacaste.
  {
    match: ["riu"],
    hotels: [
      { name: "Hotel Riu Guanacaste" },
      { name: "Hotel Riu Palace Costa Rica" },
    ],
  },

  // ===========================================================================
  // GUANACASTE — PLAYAS DEL COCO / OCOTAL / PLAYA HERMOSA
  // ===========================================================================
  {
    match: ["playas del coco", "playa hermosa", "ocotal"],
    hotels: [
      { name: "Coco Beach Hotel & Casino" },
      { name: "Hotel La Puerta del Sol" },
      { name: "Villa Buena Onda", area: "Ocotal" },
      { name: "Ocotal Beach Resort", area: "Ocotal" },
      { name: "Villas Sol Beach Resort", area: "Playa Hermosa" },
      { name: "Bosque del Mar Hotel Playa Hermosa", area: "Playa Hermosa" },
      { name: "Condovac La Costa", area: "Playa Hermosa" },
      { name: "Hotel Casa del Mar", area: "Playa Hermosa" },
    ],
  },

  // ===========================================================================
  // GUANACASTE — FLAMINGO / CONCHAL / BRASILITO / POTRERO / CATALINAS / GRANDE
  // ===========================================================================
  {
    match: ["conchal"],
    hotels: [
      { name: "The Westin Reserva Conchal, an All-Inclusive Golf Resort & Spa" },
      { name: "W Costa Rica – Reserva Conchal" },
    ],
  },
  {
    match: ["flamingo"],
    hotels: [
      { name: "Margaritaville Beach Resort Playa Flamingo" },
      { name: "Flamingo Beach Resort & Spa" },
      { name: "Angel & Pearl Boutique Hotel" },
    ],
  },
  {
    match: ["potrero"],
    hotels: [
      { name: "Hotel Sugar Beach", area: "Playa Potrero" },
      { name: "Bahía del Sol Beach Front Hotel", area: "Playa Potrero" },
      { name: "Las Brisas Resort & Villas", area: "Playa Potrero" },
    ],
  },
  {
    match: ["catalinas"],
    hotels: [
      { name: "Santarena Hotel", area: "Las Catalinas" },
      { name: "Casa Chameleon Hotel Las Catalinas", area: "Las Catalinas" },
    ],
  },
  {
    match: ["brasilito"],
    hotels: [
      { name: "Hotel Brasilito", area: "Brasilito" },
      { name: "Conchal Hotel", area: "Brasilito" },
    ],
  },
  {
    match: ["playa grande"],
    hotels: [
      { name: "Las Tortugas Hotel", area: "Playa Grande" },
      { name: "Rip Jack Inn", area: "Playa Grande" },
      { name: "Hotel Bula Bula", area: "Playa Grande" },
    ],
  },

  // ===========================================================================
  // GUANACASTE — TAMARINDO / LANGOSTA / AVELLANAS / HACIENDA PINILLA
  // ===========================================================================
  {
    match: ["tamarindo", "langosta"],
    hotels: [
      { name: "Tamarindo Diriá Beach Resort" },
      { name: "Hotel Capitán Suizo", area: "Playa Langosta" },
      { name: "Cala Luna Boutique Hotel & Villas", area: "Playa Langosta" },
      { name: "Jardín del Edén Boutique Hotel" },
      { name: "Wyndham Tamarindo" },
      { name: "Occidental Tamarindo" },
      { name: "The Coast Beachfront Hotel" },
      { name: "Best Western Tamarindo Vista Villas" },
      { name: "Hotel Pasatiempo" },
      { name: "Sueño del Mar Beachfront Hotel", area: "Playa Langosta" },
      { name: "Hotel Arco Iris" },
    ],
  },
  {
    match: ["avellanas"],
    hotels: [
      { name: "Las Avellanas Villas", area: "Playa Avellanas" },
      { name: "Mauna Loa Surf Resort", area: "Playa Avellanas" },
    ],
  },
  {
    // JW Marriott has its own dedicated route point.
    match: ["jw marriott"],
    hotels: [
      { name: "JW Marriott Guanacaste Resort & Spa", area: "Hacienda Pinilla" },
    ],
  },
  {
    match: ["hacienda pinilla", "pinilla"],
    hotels: [
      { name: "Hacienda Pinilla Beach Club", area: "Hacienda Pinilla" },
    ],
  },

  // ===========================================================================
  // GUANACASTE — NOSARA & SÁMARA (Nicoya beaches)
  // ===========================================================================
  {
    match: ["nosara", "guiones"],
    hotels: [
      { name: "The Gilded Iguana Hotel" },
      { name: "The Harmony Hotel" },
      { name: "Bodhi Tree Yoga Resort" },
      { name: "Olas Verdes Resort" },
      { name: "Lagarta Lodge" },
      { name: "Nosara Beach Hotel" },
    ],
  },
  {
    match: ["samara", "carrillo"],
    hotels: [
      { name: "Villas Playa Sámara Beachfront Resort" },
      { name: "Hotel Sámara Beach" },
      { name: "Fenix Beach Hotel" },
      { name: "Hotel Guanamar", area: "Playa Carrillo" },
    ],
  },
  {
    match: ["punta islita"],
    hotels: [
      { name: "Hotel Punta Islita, Autograph Collection", area: "Punta Islita" },
    ],
  },

  // ===========================================================================
  // NICOYA PENINSULA — SANTA TERESA / MALPAÍS / MONTEZUMA
  // ===========================================================================
  {
    match: ["santa teresa"],
    hotels: [
      { name: "Florblanca Resort" },
      { name: "Nantipa – A Tico Beach Experience" },
      { name: "Pranamar Oceanfront Villas & Yoga Retreat" },
      { name: "Hotel Nya Santa Teresa" },
      { name: "Latitude 10 Resort" },
      { name: "Selina Santa Teresa" },
    ],
  },
  {
    match: ["malpais", "mal pais"],
    hotels: [
      { name: "Moana Boutique Hotel", area: "Malpaís" },
      { name: "Hotel Vista de Olas", area: "Malpaís" },
      { name: "Star Mountain Eco Lodge", area: "Malpaís" },
    ],
  },
  {
    match: ["montezuma"],
    hotels: [
      { name: "Ylang Ylang Beach Resort", area: "Montezuma" },
      { name: "Hotel Amor de Mar", area: "Montezuma" },
      { name: "Anamaya Resort", area: "Montezuma" },
      { name: "Hotel Los Mangos", area: "Montezuma" },
    ],
  },

  // ===========================================================================
  // CENTRAL PACIFIC — JACÓ / HERRADURA & ESTERILLOS
  // ===========================================================================
  {
    match: ["jaco", "herradura"],
    hotels: [
      { name: "Los Sueños Marriott Ocean & Golf Resort", area: "Playa Herradura" },
      { name: "Hotel Villa Caletas", area: "Between Jacó & Herradura" },
      { name: "Croc's Resort & Casino" },
      { name: "Hotel Club del Mar" },
      { name: "Jaco Laguna Resort & Beach Club" },
      { name: "DoceLunas Hotel" },
      { name: "Best Western Jacó Beach Resort" },
      { name: "Selina Jaco" },
    ],
  },
  {
    match: ["esterillos"],
    hotels: [
      { name: "Alma del Pacifico Beach Hotel & Spa", area: "Esterillos" },
      { name: "Hotel Xandari Pacifico", area: "Esterillos" },
    ],
  },

  // ===========================================================================
  // SOUTH PACIFIC — UVITA / DOMINICAL / OJOCHAL
  // ===========================================================================
  {
    match: ["uvita", "dominical", "ojochal", "south pacific"],
    hotels: [
      { name: "Kurà Design Villas", area: "Uvita" },
      { name: "Oxygen Jungle Villas & Spa", area: "Uvita" },
      { name: "Rancho Pacífico", area: "Uvita" },
      { name: "Hotel Cristal Ballena", area: "Uvita" },
      { name: "La Cusinga Lodge", area: "Uvita" },
      { name: "Villas Alturas", area: "Dominical" },
      { name: "Cuna del Angel", area: "Dominical" },
      { name: "Hotel Diuwak", area: "Dominical" },
      { name: "Física del Cielo", area: "Ojochal" },
      { name: "El Castillo Boutique Luxury Hotel", area: "Ojochal" },
    ],
  },

  // ===========================================================================
  // CARIBBEAN — PUERTO VIEJO / CAHUITA
  // ===========================================================================
  {
    match: ["puerto viejo", "cahuita", "caribbean"],
    hotels: [
      { name: "Le Caméléon Boutique Hotel", area: "Playa Cocles" },
      { name: "Hotel Aguas Claras" },
      { name: "Hotel Banana Azul", area: "Playa Negra" },
      { name: "Almonds & Corals Hotel", area: "Manzanillo" },
      { name: "Shawandha Lodge", area: "Playa Chiquita" },
      { name: "Cariblue Beach & Jungle Resort", area: "Playa Cocles" },
      { name: "Hotel La Diosa", area: "Cahuita" },
      { name: "Selina Puerto Viejo" },
    ],
  },

  // ===========================================================================
  // CENTRAL VALLEY — SAN JOSÉ (downtown / Escazú / Santa Ana)
  // ===========================================================================
  {
    match: ["san jose", "escazu", "santa ana", "sabana", "curridabat"],
    hotels: [
      { name: "Hyatt Place San Jose Pinares", area: "Curridabat" },
      { name: "Real InterContinental Costa Rica", area: "Escazú" },
      { name: "Hotel Grano de Oro San José" },
      { name: "Crowne Plaza Corobicí", area: "La Sabana" },
      { name: "Aurola San José" },
      { name: "Barceló San José" },
      { name: "Radisson Hotel San José" },
      { name: "Park Inn by Radisson San José" },
      { name: "Hotel Presidente", area: "Downtown" },
      { name: "Courtyard by Marriott San José Escazú", area: "Escazú" },
      { name: "Residence Inn by Marriott San José Escazú", area: "Escazú" },
      { name: "Studio Hotel Boutique", area: "Escazú" },
      { name: "Hotel Villa Tournon" },
      { name: "Apartotel La Sabana", area: "La Sabana" },
    ],
  },

  // ===========================================================================
  // CENTRAL VALLEY — ALAJUELA / SJO AIRPORT area
  // ===========================================================================
  {
    match: ["alajuela"],
    hotels: [
      { name: "Costa Rica Marriott Hotel Hacienda Belén" },
      { name: "Hampton Inn & Suites San José Airport" },
      { name: "Holiday Inn Express San José Airport" },
      { name: "Courtyard by Marriott San José Airport Alajuela" },
      { name: "DoubleTree by Hilton Cariari San José" },
      { name: "Xandari Resort & Spa" },
      { name: "Country Inn & Suites San José Airport" },
      { name: "Adventure Inn" },
      { name: "Hotel Buena Vista" },
      { name: "Hotel Robledal" },
    ],
  },

  // ===========================================================================
  // GUANACASTE — LIBERIA (LIR airport / city)
  // ===========================================================================
  {
    match: ["liberia", "lir"],
    hotels: [
      { name: "Hilton Garden Inn Liberia Airport (Guanacaste Airport)" },
      { name: "Hotel El Punto Boutique" },
      { name: "Hotel Boyeros", area: "Liberia downtown" },
      { name: "Best Western El Sitio Hotel & Casino" },
    ],
  },
];

/**
 * Landmarks and nicknames guests type instead of the route-point name:
 * "Guanacaste airport", "Daniel Oduber", "Arenal volcano", "Coco beach".
 * Resolved exactly like hotels, so they show as "Liberia Airport → LIR…".
 */
export const LANDMARK_ALIASES: { name: string; match: string[] }[] = [
  { name: "Liberia Airport (Daniel Oduber, Guanacaste)", match: ["lir"] },
  { name: "Guanacaste Airport", match: ["lir"] },
  { name: "San José Airport (Juan Santamaría)", match: ["sjo"] },
  { name: "Arenal Volcano", match: ["la fortuna", "arenal"] },
  { name: "Arenal Hot Springs", match: ["la fortuna", "arenal"] },
  { name: "Monteverde Cloud Forest", match: ["monteverde"] },
  { name: "Manuel Antonio National Park", match: ["manuel antonio"] },
  { name: "Coco Beach", match: ["playas del coco"] },
  { name: "Playa Conchal", match: ["conchal"] },
  { name: "Playa Flamingo", match: ["flamingo"] },
  { name: "Playa Tamarindo", match: ["tamarindo"] },
  { name: "Playa Guiones", match: ["nosara"] },
  { name: "Playa Sámara", match: ["samara"] },
  { name: "Peninsula Papagayo", match: ["papagayo"] },
  { name: "Gulf of Papagayo", match: ["papagayo"] },
  { name: "Tenorio Volcano National Park", match: ["rio celeste"] },
  { name: "Rincón de la Vieja Volcano", match: ["rincon de la vieja"] },
  { name: "Tortuguero", match: ["la pavona"] },
];

interface Alias {
  /** Display name (hotel or landmark). */
  name: string;
  area: string | null;
  /** Route-point keywords of the group this alias belongs to. */
  keywords: string[];
  kind: "landmark" | "hotel";
}

// Landmarks first: "Liberia Airport" should outrank the hotels next to it.
const ALIASES: Alias[] = [
  ...LANDMARK_ALIASES.map((l) => ({
    name: l.name,
    area: null,
    keywords: l.match,
    kind: "landmark" as const,
  })),
  ...CURATED_HOTELS.flatMap((g) =>
    g.hotels.map((h) => ({
      name: h.name,
      area: h.area ?? null,
      keywords: g.match,
      kind: "hotel" as const,
    }))
  ),
];

/**
 * Lower-case, strip accents and punctuation, collapse whitespace. Makes
 * "Tabacón" ≡ "tabacon" and "Croc's" ≡ "croc s" so comparisons forgive the
 * way people actually type on a phone.
 */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Query words; empty when the query is blank. */
export function queryTokens(query: string): string[] {
  return normalizeText(query).split(" ").filter(Boolean);
}

/**
 * True when every typed word is the START of some word in `text`, in any
 * order. Word-start (not substring-anywhere) keeps "anda" from matching
 * "Hacienda" while still allowing partials: "tabac" → Tabacón, "coco" →
 * Playas del Coco, "san jose" → San José.
 */
export function matchesWordStart(tokens: string[], text: string): boolean {
  if (tokens.length === 0) return true;
  const words = normalizeText(text).split(" ");
  return tokens.every((t) => words.some((w) => w.startsWith(t)));
}

/** Looser fallback: the whole query appears anywhere in `text`. */
export function matchesSubstring(query: string, text: string): boolean {
  const q = normalizeText(query);
  return q.length > 0 && normalizeText(text).includes(q);
}

export interface HotelMatch {
  /** The canonical route point to store / price against. */
  location: string;
  /** The hotel or landmark name that matched the query, for display. */
  hotel: string;
}

/**
 * Resolve a free-text query to canonical route points via hotel/landmark
 * names.
 *
 * For each alias whose name (or area) matches the query, returns the route
 * point(s) from `locations` that belong to its zone. When a group bundles
 * several beaches, keywords that also appear in the alias's own name/area
 * win (e.g. "Westin Reserva Conchal" → Conchal, not all five beaches);
 * otherwise every matching point is offered so the guest can disambiguate.
 *
 * `locations` is the list of valid route points already shown in the form,
 * so results stay consistent with origin/destination filtering.
 */
export function resolveHotelMatches(
  query: string,
  locations: string[]
): HotelMatch[] {
  const tokens = queryTokens(query);
  if (tokens.length === 0 || normalizeText(query).length < 2) return [];

  const normLocations = locations.map((loc) => ({
    raw: loc,
    norm: normalizeText(loc),
  }));
  const results: HotelMatch[] = [];
  const seen = new Set<string>();
  // One landmark per route point is enough ("Guanacaste Airport" and
  // "Liberia Airport" both → LIR); distinct hotels always all show.
  const landmarkLocations = new Set<string>();

  for (const alias of ALIASES) {
    const hay = `${alias.name} ${alias.area ?? ""}`;
    if (!matchesWordStart(tokens, hay)) continue;

    // Prefer keywords that also appear in the alias's own name/area, so a
    // bundled-beach group resolves precisely. If those specific keywords
    // match no actual route point, fall back to the full keyword set (e.g.
    // "Los Sueños" sits in Playa Herradura, which isn't a route point, so it
    // must fall back to "Jaco").
    const normHay = normalizeText(hay);
    const all = alias.keywords.map(normalizeText);
    const specific = all.filter((kw) => normHay.includes(kw));
    const matchWith = (kws: string[]) =>
      normLocations.filter((loc) => kws.some((kw) => loc.norm.includes(kw)));

    let matched = specific.length > 0 ? matchWith(specific) : [];
    if (matched.length === 0) matched = matchWith(all);

    for (const loc of matched) {
      const key = `${loc.raw}||${alias.name}`;
      if (seen.has(key)) continue;
      if (alias.kind === "landmark") {
        if (landmarkLocations.has(loc.raw)) continue;
        landmarkLocations.add(loc.raw);
      }
      seen.add(key);
      results.push({ location: loc.raw, hotel: alias.name });
    }
  }

  return results;
}
