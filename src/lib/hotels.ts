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
      { name: "Hotel Arenal Paraíso Resort & Spa" },
      { name: "Lost Iguana Resort & Spa" },
      { name: "Arenal Lodge" },
      { name: "Hotel Linda Vista", area: "El Castillo" },
      { name: "Hotel Arenal Vista Lodge", area: "El Castillo" },
      { name: "Hotel Arenal Montechiari" },
      { name: "Hotel Campo Verde" },
      { name: "Hotel Secreto La Fortuna" },
      { name: "Chachagua Rainforest Hotel & Hot Springs", area: "Chachagua" },
      { name: "Hotel Lavas Tacotal" },
      { name: "Hotel Vista del Cerro" },
      { name: "Hotel Roca Negra del Arenal" },
      { name: "Hotel Arenal Rabfer" },
      { name: "Hotel Kokoro Arenal" },
      { name: "Tifakara Boutique Hotel & Birding Oasis" },
      { name: "Hotel Arenal Bromelias" },
      { name: "Sangregado Lodge" },
      { name: "Hotel Las Colinas", area: "Downtown" },
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
      { name: "Hotel Montaña Monteverde" },
      { name: "Ocotea Boutique Hotel" },
      { name: "Chira Glamping Monteverde" },
      { name: "Hidden Canopy Treehouses Boutique Hotel" },
      { name: "Monteverde Rustic Lodge" },
      { name: "Arco Iris Lodge", area: "Santa Elena" },
      { name: "Cala Lodge" },
      { name: "Hotel El Bosque" },
      { name: "Mar Inn B&B" },
      { name: "Los Pinos Cabañas y Jardines" },
      { name: "Hotel Claro de Luna" },
      { name: "Selina Monteverde" },
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
      { name: "Hotel La Mansión Inn" },
      { name: "Byblos Resort & Casino" },
      { name: "Hotel Playa Espadilla" },
      { name: "Espadilla Gardens Hotel" },
      { name: "Los Altos Resort" },
      { name: "El Faro Beach Hotel" },
      { name: "Hotel Villa Roca" },
      { name: "Hotel Casitas Eclipse" },
      { name: "Teva Hotel & Jungle Reserve" },
      { name: "Hotel Villabosque" },
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
      { name: "Planet Hollywood Costa Rica" },
      { name: "El Mangroove, Autograph Collection" },
      { name: "Occidental Papagayo" },
      { name: "Nekajui, a Ritz-Carlton Reserve", area: "Peninsula Papagayo" },
      { name: "Kasiiya Papagayo" },
      { name: "Casa Conde Beach-Front Hotel", area: "Playa Panamá" },
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
      { name: "Bahía Pez Vela Resort", area: "Ocotal" },
      { name: "Hotel El Velero", area: "Playa Hermosa" },
      { name: "Hotel Mangaby", area: "Playa Hermosa" },
      { name: "Hotel Villa del Sueño", area: "Playa Hermosa" },
      { name: "Hotel Coco Palms", area: "Playas del Coco" },
      { name: "Hotel Pato Loco Inn", area: "Playas del Coco" },
      { name: "Hotel Chantel Suites & Villas", area: "Playas del Coco" },
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
      { name: "Mariner Inn Hotel", area: "Playa Flamingo" },
    ],
  },
  {
    match: ["potrero"],
    hotels: [
      { name: "Hotel Sugar Beach", area: "Playa Potrero" },
      { name: "Bahía del Sol Beach Front Hotel", area: "Playa Potrero" },
      { name: "Las Brisas Resort & Villas", area: "Playa Potrero" },
      { name: "Hotel Bahía Esmeralda", area: "Playa Potrero" },
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
      { name: "Hotel Cantarana", area: "Playa Grande" },
      { name: "Playa Grande Inn", area: "Playa Grande" },
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
      { name: "Barceló Langosta Beach", area: "Playa Langosta" },
      { name: "Ten North Tamarindo Beach Hotel" },
      { name: "Hotel Tamarindo Bay Boutique" },
      { name: "Hotel Luna Llena" },
      { name: "Villas Macondo" },
      { name: "Witch's Rock Surf Camp" },
      { name: "Hotel Zullymar" },
      { name: "Hotel Villa Alegre", area: "Playa Langosta" },
      { name: "Hotel La Laguna del Cocodrilo" },
      { name: "Pueblo Dorado Surf Hotel" },
    ],
  },
  {
    match: ["avellanas"],
    hotels: [
      { name: "Las Avellanas Villas", area: "Playa Avellanas" },
      { name: "Mauna Loa Surf Resort", area: "Playa Avellanas" },
      { name: "Cabinas Las Olas", area: "Playa Avellanas" },
      { name: "Hotel Playa Negra", area: "Playa Negra" },
      { name: "Café Playa Negra Hotel", area: "Playa Negra" },
    ],
  },
  {
    // JW Marriott has its own dedicated route point.
    match: ["jw marriott guanacaste"], // not the Costa Elena JW Marriott (own group below)
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
      { name: "L'Acqua Viva Resort & Spa" },
      { name: "Tierra Magnífica Boutique Hotel" },
      { name: "Living Hotel Nosara" },
      { name: "Silvestre Nosara Hotel & Restaurant" },
      { name: "Nomadic Hotel Nosara" },
      { name: "Hotel Casa Romantica", area: "Playa Guiones" },
      { name: "Giardino Tropicale" },
      { name: "Harbor Reef Beach & Surf Resort", area: "Playa Guiones" },
      { name: "Hotel Luna Azul", area: "Ostional" },
    ],
  },
  {
    match: ["samara", "carrillo"],
    hotels: [
      { name: "Villas Playa Sámara Beachfront Resort" },
      { name: "Hotel Sámara Beach" },
      { name: "Fenix Beach Hotel" },
      { name: "Hotel Guanamar", area: "Playa Carrillo" },
      { name: "Hotel Belvedere Sámara" },
      { name: "Hotel Giada" },
      { name: "Samara Tree House Inn" },
      { name: "Locanda Samara Beach" },
      { name: "Villas Kalimba" },
      { name: "Hotel Mirador de Sámara" },
      { name: "Hotel Nammbú Beachfront Bungalows", area: "Playa Carrillo" },
      { name: "Hotel Leyenda", area: "Playa Carrillo" },
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
      { name: "Hotel Tropico Latino" },
      { name: "Funky Monkey Lodge" },
      { name: "Horizon Ocean View Hotel & Yoga Center" },
      { name: "Blue Surf Sanctuary" },
      { name: "Manala Hotel" },
      { name: "Nautilus Boutique Hotel" },
    ],
  },
  {
    match: ["malpais", "mal pais"],
    hotels: [
      { name: "Moana Boutique Hotel", area: "Malpaís" },
      { name: "Hotel Vista de Olas", area: "Malpaís" },
      { name: "Star Mountain Eco Lodge", area: "Malpaís" },
      { name: "Hotel Casa Chameleon Mal País", area: "Malpaís" },
      { name: "Mal Pais Surf Camp & Resort", area: "Malpaís" },
      { name: "Beija Flor Resort", area: "Malpaís" },
    ],
  },
  {
    match: ["montezuma"],
    hotels: [
      { name: "Ylang Ylang Beach Resort", area: "Montezuma" },
      { name: "Hotel Amor de Mar", area: "Montezuma" },
      { name: "Anamaya Resort", area: "Montezuma" },
      { name: "Hotel Los Mangos", area: "Montezuma" },
      { name: "Hotel El Jardín", area: "Montezuma" },
      { name: "Hotel Horizontes de Montezuma", area: "Montezuma" },
      { name: "Luz de Mono Hotel", area: "Montezuma" },
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
      { name: "Zephyr Palace", area: "Villa Caletas" },
      { name: "Hotel Amapola" },
      { name: "Hotel Poseidon" },
      { name: "Hotel Mar de Luz" },
      { name: "Hotel Balcón del Mar" },
      { name: "Hotel Nine" },
      { name: "Hotel Pochote Grande" },
      { name: "Copacabana Hotel & Suites" },
      { name: "Hotel Tangerí" },
    ],
  },
  {
    match: ["esterillos"],
    hotels: [
      { name: "Alma del Pacifico Beach Hotel & Spa", area: "Esterillos" },
      { name: "Hotel Xandari Pacifico", area: "Esterillos" },
      { name: "Monterey del Mar Hotel", area: "Esterillos Este" },
      { name: "Encantada Ocean Cottages", area: "Esterillos Este" },
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
      { name: "Vista Celestial", area: "Uvita" },
      { name: "Hotel Vista Ballena", area: "Uvita" },
      { name: "Hotel Villas Río Mar", area: "Dominical" },
      { name: "Hacienda Barú Lodge", area: "Dominical" },
      { name: "Mavi Surf Hotel", area: "Dominical" },
      { name: "Three Sixty Boutique Hotel", area: "Ojochal" },
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
      { name: "Namuwoki Lodge", area: "Playa Chiquita" },
      { name: "Azania Bungalows", area: "Playa Cocles" },
      { name: "Hotel La Costa de Papito", area: "Playa Cocles" },
      { name: "Physis Caribbean Bed & Breakfast", area: "Playa Cocles" },
      { name: "Villas del Caribe", area: "Playa Cocles" },
      { name: "Tree House Lodge", area: "Punta Uva" },
      { name: "Umami Hotel" },
      { name: "Blue Conga Hotel" },
      { name: "Escape Caribeño" },
      { name: "Congo Bongo EcoVillage", area: "Manzanillo" },
      { name: "Atlántida Lodge", area: "Cahuita" },
      { name: "Hotel Suizo Loco Lodge", area: "Cahuita" },
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
      { name: "Gran Hotel Costa Rica, Curio Collection by Hilton", area: "Downtown" },
      { name: "Hilton Garden Inn San José La Sabana", area: "La Sabana" },
      { name: "Tryp by Wyndham San José Sabana", area: "La Sabana" },
      { name: "Sheraton San José Hotel", area: "Escazú" },
      { name: "AC Hotel by Marriott San José Escazú", area: "Escazú" },
      { name: "Aloft San José Costa Rica", area: "Escazú" },
      { name: "Wyndham Garden San José Escazú", area: "Escazú" },
      { name: "Hotel Alta Las Palomas", area: "Santa Ana" },
      { name: "Best Western Irazú Hotel & Casino", area: "La Uruca" },
      { name: "Hotel Don Carlos", area: "Downtown" },
      { name: "Hotel Balmoral", area: "Downtown" },
      { name: "Hotel Fleur de Lys", area: "Downtown" },
      { name: "Hotel Bougainvillea", area: "Santo Domingo de Heredia" },
      { name: "Finca Rosa Blanca Coffee Farm & Inn", area: "Santa Bárbara de Heredia" },
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
      { name: "Wyndham San José Herradura Hotel & Convention Center", area: "Belén" },
      { name: "Hotel Aeropuerto" },
      { name: "Pura Vida Hotel" },
      { name: "Hotel La Rosa de America" },
      { name: "Hotel Villa San Ignacio" },
      { name: "Tacacori EcoLodge" },
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
      { name: "Hotel Liberia", area: "Liberia downtown" },
      { name: "Hotel Javy", area: "Liberia" },
      { name: "Hotel Las Espuelas", area: "Liberia" },
    ],
  },

  // ===========================================================================
  // GUANACASTE — LA CRUZ / COSTA ELENA (far north coast)
  // JW Marriott Costa Elena is the former Dreams Las Mareas (Playa El
  // Jobo). It has its own route point; the old name is kept in the
  // display string so guests who still type "Dreams" find it.
  // ===========================================================================
  {
    match: ["costa elena", "la cruz", "las mareas"],
    hotels: [
      { name: "JW Marriott Costa Elena (formerly Dreams Las Mareas)", area: "Playa El Jobo, La Cruz" },
    ],
  },
  // ===========================================================================
  // GUANACASTE — RINCÓN DE LA VIEJA (volcano lodges)
  // ===========================================================================
  {
    match: ["rincon de la vieja"],
    hotels: [
      { name: "Hacienda Guachipelín", area: "Rincón de la Vieja" },
      { name: "Borinquen Thermal Resort", area: "Rincón de la Vieja" },
      { name: "Buena Vista del Rincón Eco Adventure Park Hotel & Spa", area: "Rincón de la Vieja" },
      { name: "Rincón de la Vieja Lodge" },
      { name: "Blue River Resort & Hot Springs", area: "Rincón de la Vieja" },
      { name: "Rinconcito Lodge", area: "Rincón de la Vieja" },
      { name: "Cañón de la Vieja Lodge", area: "Rincón de la Vieja" },
    ],
  },
  // ===========================================================================
  // NORTHERN ZONE — RÍO CELESTE / BIJAGUA (Tenorio)
  // ===========================================================================
  {
    match: ["rio celeste", "bijagua", "tenorio"],
    hotels: [
      { name: "Rio Celeste Hideaway Hotel" },
      { name: "Tenorio Lodge", area: "Bijagua" },
      { name: "Celeste Mountain Lodge", area: "Bijagua" },
      { name: "Origins Lodge", area: "Bijagua" },
      { name: "Casitas Tenorio B&B", area: "Bijagua" },
      { name: "Sueño Celeste B&B", area: "Bijagua" },
    ],
  },
  // ===========================================================================
  // CENTRAL PACIFIC — PUNTA LEONA (own route point)
  // ===========================================================================
  {
    match: ["punta leona"],
    hotels: [
      { name: "Hotel Punta Leona", area: "Punta Leona" },
    ],
  },
  // ===========================================================================
  // CENTRAL PACIFIC — PUNTARENAS
  // ===========================================================================
  {
    match: ["puntarenas"],
    hotels: [
      { name: "DoubleTree Resort by Hilton Costa Rica Central Pacific", area: "Puntarenas" },
    ],
  },
  // ===========================================================================
  // NICOYA PENINSULA — TAMBOR
  // ===========================================================================
  {
    match: ["tambor"],
    hotels: [
      { name: "Tango Mar Beachfront Boutique Hotel & Villas", area: "Tambor" },
      { name: "Barceló Tambor", area: "Tambor" },
    ],
  },
  // ===========================================================================
  // CENTRAL VALLEY HIGHLANDS — LA PAZ WATERFALL GARDENS / BAJOS DEL TORO
  // ===========================================================================
  {
    match: ["la paz waterfall"],
    hotels: [
      { name: "Peace Lodge", area: "La Paz Waterfall Gardens" },
    ],
  },
  // ===========================================================================
  // CENTRAL VALLEY HIGHLANDS — BAJOS DEL TORO
  // ===========================================================================
  {
    match: ["bajos del toro"],
    hotels: [
      { name: "El Silencio Lodge & Spa", area: "Bajos del Toro" },
    ],
  },
  // ===========================================================================
  // TALAMANCA — SAN GERARDO DE DOTA (quetzal cloud forest)
  // ===========================================================================
  {
    match: ["san gerardo de dota"],
    hotels: [
      { name: "Savegre Hotel, Natural Reserve & Spa", area: "San Gerardo de Dota" },
      { name: "Dantica Cloud Forest Lodge", area: "San Gerardo de Dota" },
      { name: "Trogon Lodge", area: "San Gerardo de Dota" },
    ],
  },
  // ===========================================================================
  // CARIBBEAN LOWLANDS — SARAPIQUÍ
  // ===========================================================================
  {
    match: ["sarapiqui"],
    hotels: [
      { name: "Selva Verde Lodge", area: "Sarapiquí" },
      { name: "La Quinta de Sarapiquí Country Inn", area: "Sarapiquí" },
      { name: "Tirimbina Rainforest Lodge", area: "Sarapiquí" },
      { name: "Sueño Azul Resort", area: "Sarapiquí" },
    ],
  },
  // ===========================================================================
  // CARIBBEAN — TORTUGUERO (boat lodges, reached via La Pavona dock)
  // ===========================================================================
  {
    match: ["la pavona", "tortuguero"],
    hotels: [
      { name: "Tortuga Lodge & Gardens", area: "Tortuguero (boat from La Pavona)" },
      { name: "Mawamba Lodge", area: "Tortuguero (boat from La Pavona)" },
      { name: "Pachira Lodge", area: "Tortuguero (boat from La Pavona)" },
      { name: "Laguna Lodge", area: "Tortuguero (boat from La Pavona)" },
      { name: "Evergreen Lodge", area: "Tortuguero (boat from La Pavona)" },
      { name: "Manatus Hotel", area: "Tortuguero (boat from La Pavona)" },
    ],
  },
  // ===========================================================================
  // OSA PENINSULA — PUERTO JIMÉNEZ / GOLFO DULCE
  // ===========================================================================
  {
    match: ["puerto jimenez"],
    hotels: [
      { name: "Lapa Rios Lodge", area: "Cabo Matapalo" },
      { name: "Botánika Osa Peninsula, Curio Collection by Hilton", area: "Puerto Jiménez" },
      { name: "Iguana Lodge", area: "Playa Platanares" },
      { name: "El Remanso Rainforest Lodge", area: "Cabo Matapalo" },
      { name: "Bosque del Cabo Rainforest Lodge", area: "Cabo Matapalo" },
      { name: "Playa Nicuesa Rainforest Lodge", area: "Golfo Dulce" },
    ],
  },
  // ===========================================================================
  // OSA PENINSULA — DRAKE BAY (boat from Sierpe)
  // ===========================================================================
  {
    match: ["sierpe", "drake"],
    hotels: [
      { name: "Aguila de Osa", area: "Drake Bay (boat from Sierpe)" },
      { name: "Copa de Arbol Beach & Rainforest Resort", area: "Drake Bay (boat from Sierpe)" },
      { name: "La Paloma Lodge", area: "Drake Bay (boat from Sierpe)" },
      { name: "Casa Corcovado Jungle Lodge", area: "Drake Bay (boat from Sierpe)" },
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
