// LOS NOMBRES DE CADA CLUB, EN UN SOLO LUGAR.
//
// Un club se llama distinto según quién lo escriba. El juego le dice "Junior de Barranquilla", el
// calendario de Transfermarkt "Junior FC", la base de jugadores "Junior" y la ventana de pases
// "Junior Barranquilla". Son cuatro respuestas a UNA pregunta: cómo se llama este club.
//
// Durante mucho tiempo cada una vivía en su propia tabla -- ALIAS_CALENDARIO acá, EQUIPO_SYNONYMS y
// EQUIPO_SYNONYMS_POR_ID dentro de data.ts, y otra más en el script de fichajes -- y cada arreglo
// entraba en una sola. El costo se pudo medir: el Bayern, el PSV, el Inter y el Lyon no recibieron
// NINGÚN fichaje de toda la ventana porque el nombre con el que Transfermarkt los escribe sólo
// estaba cargado en la tabla del calendario, que el script de fichajes no lee.
//
// Ahora hay una entrada por club, indexada por su id, con un campo por fuente. El id y no el nombre
// porque los nombres se repiten: hay dos Everton, dos Liverpool, dos Nacional, dos Comunicaciones.
// Una tabla por nombre le daba a los dos la misma plantilla -- el Everton de Chile llegó a alinear a
// los jugadores de Goodison Park.
//
// EN PANTALLA SÓLO SE MUESTRA `nombre`. Los demás campos existen para encontrar al club en datos que
// vienen de afuera; ninguno se le muestra al jugador.
//
// Vive en su propio módulo, y no dentro de data.ts o realSchedule.ts, porque lo necesitan los tres:
// data.ts para armar las plantillas, realSchedule para saber qué le toca jugar al club esta semana y
// leagueEngine para armar la tabla con la jornada real. leagueEngine no puede importar de
// realSchedule -- realSchedule ya importa de leagueEngine y el ciclo rompe el build.

export interface NombresDelClub {
  /** El nombre visible, el mismo `name` de data.ts. Es el único que ve el jugador. */
  nombre: string;
  /** Como lo escriben los calendarios reales importados de Transfermarkt (src/realCalendar.ts). */
  calendario?: string;
  /** Como llama la base de jugadores a su plantel (`team_name` de playersDatabase.json).
   *  `null` significa que la base NO lo tiene, y que no hay que buscarlo por su nombre: el San
   *  Antonio de Ecuador terminaba alineando al San Antonio Bulo Bulo de Bolivia. */
  plantel?: string | null;
  /** Otras formas con las que lo escriben las fuentes externas: nombres largos, homónimos, la
   *  ventana de pases de Transfermarkt. Sólo para buscar; nunca se muestran. */
  otros?: string[];
}

/**
 * Cada club que se escribe distinto en alguna fuente, por id.
 *
 * Los clubes que se escriben igual en todos lados no están acá: no hace falta traducir nada.
 *
 * SOBRE `calendario`: sin esta columna, 29 clubes de primera -- Racing, Newell's, Flamengo,
 * Palmeiras y medio MLS -- no encontraban su calendario y caían al fixture generado, jugando un
 * torneo paralelo al de sus rivales de la misma liga. Y en la vista de copa Transfermarkt abrevia
 * distinto que en las de liga ("Indep. Medellín", "Nott'm Forest"): otros 103 clubes.
 *
 * SOBRE `plantel`: la base de jugadores usa nombres SIN LICENCIA para varios clubes grandes -- el
 * Inter es "Lombardia FC", el Milan "Milano FC", el Lazio "Latium", el Atalanta "Bergamo Calcio".
 * Ningún parecido de texto los une; se encontraron con una sonda que busca en qué equipo de la base
 * está la mayoría de los jugadores del club. Y dos se descartaron con la misma sonda, que es lo que
 * la hace confiable: "Universitario de Vinto" daba cuatro coincidencias con "Blooming" y "Deportivo
 * Táchira" cuatro con "Puerto Cabello" -- son clubes DISTINTOS y esas cuatro son jugadores que
 * pasaron de uno al otro. Uno quedó afuera a propósito: "Independiente del Valle" parecía resolverse
 * con el "Independiente" de la base, pero esos 32 son Machuca, Mele y Rey -- el de AVELLANEDA.
 * Queda sin plantel hasta conseguir el suyo, porque meter el plantel argentino en un club ecuatoriano
 * es exactamente como se rompió el juego dos veces.
 */
// Las claves van entre comillas a propósito, aunque TypeScript no las pida: así cada línea es JSON
// válido y los scripts de datos, que leen este archivo como texto, la parsean con JSON.parse en vez
// de con una expresión regular. La regular era el problema: cortaba en la primera comilla simple y
// leía "Borussia M" en lugar de "Borussia M'gladbach", así que el club no encontraba su plantel y se
// perdió su ventana de pases entera. Lo mismo le pasaba a O'Higgins y a Newell's.
//
// Por eso los comentarios de acá adentro van SIEMPRE en su propio renglón: el lector los descarta
// por línea. Uno al final de una entrada rompe el parseo, y npm run validar:alias lo avisa.
export const NOMBRES_DE_CLUB: Record<string, NombresDelClub> = {
  "22_de_julio": { "nombre": "22 de Julio", "plantel": "22 de Julio FC" },
  "9_de_octubre": { "nombre": "9 de Octubre", "plantel": "9 de Octubre FC" },
  "a_rafaela": { "nombre": "A. Rafaela", "plantel": "Atletico Rafaela" },
  "academia_puerto_cabello": { "nombre": "Academia Puerto Cabello", "calendario": "Puerto Cabello", "plantel": "Puerto Cabello" },
  "ad_ceuta_fc": { "nombre": "AD Ceuta FC", "plantel": "AD Ceuta" },
  "al_ahly": { "nombre": "Al Ahly", "plantel": "Al-Ahly SC" },
  "alianza_fc": { "nombre": "Alianza FC", "plantel": "Alianza F.C." },
  "alianza_lima": { "nombre": "Alianza Lima", "calendario": "Alianza Atl." },
  // Alianza Universidad está DOS VECES en data.ts: una en la liga peruana, que es la real, y otra
  // suelta en "Resto del Mundo". Es el mismo club de Huánuco. El plantel es del de la liga peruana;
  // el duplicado se queda sin ninguno, porque si los dos lo reclaman uno está mostrando el del otro.
  "alianza_universidad": { "nombre": "Alianza Universidad", "plantel": null },
  "america_mex": { "nombre": "América", "otros": ["Club América"] },
  "argentinos_jrs": { "nombre": "Argentinos Juniors", "calendario": "Argentinos Jrs.", "plantel": "Argentinos Jrs.", "otros": ["AA Argentinos Juniors"] },
  "arsenal_sarandi": { "nombre": "Arsenal de Sarandí", "plantel": "Arsenal Sarandí" },
  "as_monaco": { "nombre": "AS Monaco", "calendario": "Monaco" },
  "as_nancy": { "nombre": "AS Nancy Lorraine", "plantel": "AS Nancy" },
  "atalanta": { "nombre": "Atalanta", "plantel": "Bergamo Calcio" },
  "athletic_club_esp": { "nombre": "Athletic Club", "plantel": "Athletic Club de Bilbao" },
  "athletic_club": { "nombre": "Athletic Club de São João del-Rei", "plantel": "Athletic Club" },
  "athletico_pr": { "nombre": "Athletico Paranaense", "plantel": "Athletico-PR" },
  "atlanta_united": { "nombre": "Atlanta United", "plantel": "Atlanta United FC" },
  "atlas": { "nombre": "Atlas", "plantel": "Atlas FC", "otros": ["Atlas Guadalajara"] },
  "bucaramanga": { "nombre": "Atlético Bucaramanga", "calendario": "A. Bucaramanga", "plantel": "Bucaramanga" },
  "san_luis": { "nombre": "Atlético de San Luis", "plantel": "Atl. San Luis" },
  "atletico_mineiro": { "nombre": "Atlético Mineiro", "calendario": "Clube Atlético Mineiro" },
  "mitre": { "nombre": "Atlético Mitre", "plantel": "Atl. Mitre" },
  "nacional": { "nombre": "Atlético Nacional", "calendario": "Atl. Nacional", "plantel": "Atl. Nacional" },
  // Alianza Atlético de Sullana, con cuatro nombres: el juego lo llama "Atlético Sullana", el
  // calendario de la Sudamericana "Alianza Atlético", la ventana de pases "Alianza Atlético
  // Sullana" y la base de jugadores "A. Sullana". Estaba con ['Jugador 1', 'Jugador 2'] teniendo
  // sus 26 (Perleche, Villegas, Gordillo) cargados.
  "atlético_sullana": { "nombre": "Atlético Sullana", "calendario": "Alianza Atlético", "plantel": "A. Sullana", "otros": ["Alianza Atlético Sullana"] },
  "auckland_city": { "nombre": "Auckland City", "plantel": "Auckland City FC" },
  "ayacucho_fc": { "nombre": "Ayacucho FC", "plantel": "Ayacucho" },
  "bahia": { "nombre": "Bahia", "calendario": "Esporte Clube Bahia" },
  "barracas": { "nombre": "Barracas Central", "calendario": "Barracas C." },
  "bayer_leverkusen": { "nombre": "Bayer 04 Leverkusen", "calendario": "Leverkusen" },
  "belgrano": { "nombre": "Belgrano de Córdoba", "plantel": "Belgrano" },
  "blooming": { "nombre": "Blooming", "calendario": "Club Blooming" },
  "boca": { "nombre": "Boca Juniors", "otros": ["Club Atlético Boca Juniors"] },
  "boca_cali": { "nombre": "Boca Juniors de Cali", "plantel": "Boca Jrs Cali" },
  "borussia_dortmund": { "nombre": "Borussia Dortmund", "calendario": "Dortmund" },
  "borussia_monchengladbach": { "nombre": "Borussia Mönchengladbach", "plantel": "Borussia M'gladbach" },
  "botafogo": { "nombre": "Botafogo", "calendario": "S. A. F. Botafogo" },
  "brest": { "nombre": "Brest", "calendario": "Stade Brestois 29", "plantel": "Stade Brestois 29" },
  "young_boys": { "nombre": "BSC Young Boys", "calendario": "Young Boys" },
  "c_bolivar": { "nombre": "C. Bolivar", "plantel": "Ciudad Bolivar" },
  "cancun_fc": { "nombre": "Cancun FC", "plantel": "Cancún FC" },
  "cd_nacional": { "nombre": "CD Nacional", "plantel": "Nacional da Madeira" },
  "cd_santa_clara": { "nombre": "CD Santa Clara", "plantel": "Santa Clara" },
  "ceara": { "nombre": "Ceará", "plantel": "Ceará SC" },
  "celta": { "nombre": "Celta", "calendario": "Celta de Vigo", "plantel": "RC Celta de Vigo" },
  "celtic_fc": { "nombre": "Celtic FC", "calendario": "Celtic", "plantel": "Celtic" },
  "cerro_uru": { "nombre": "Cerro", "plantel": "C.A. Cerro" },
  "cf_montreal": { "nombre": "CF Montréal", "calendario": "Club de Foot Montréal" },
  "chacarita": { "nombre": "Chacarita", "plantel": "Chacarita Jrs." },
  "chacaritas": { "nombre": "Chacaritas", "plantel": "Chacaritas FC" },
  "chicago_fire": { "nombre": "Chicago Fire", "plantel": "Chicago Fire FC" },
  "clermont_foot": { "nombre": "Clermont Foot 63", "plantel": "Clermont Foot" },
  "club_brugge": { "nombre": "Club Brugge KV", "calendario": "Club Brugge", "plantel": "Club Brugge" },
  "tijuana": { "nombre": "Club Tijuana", "plantel": "Tijuana" },
  "comunicaciones": { "nombre": "Comunicaciones", "plantel": "Comunicaciones (A)" },
  "comunicaciones_gt": { "nombre": "Comunicaciones", "plantel": "Comunicaciones FC" },
  "cuenca_jrs": { "nombre": "Cuenca Jrs", "plantel": "Cuenca Jrs." },
  "cumbayá": { "nombre": "Cumbayá", "plantel": "Cumbayá FC" },
  "d_alaves": { "nombre": "D. Alavés", "plantel": "Deportivo Alavés" },
  "darmstadt_98": { "nombre": "Darmstadt 98", "plantel": "SV Darmstadt 98" },
  "dc_united": { "nombre": "DC United", "calendario": "D.C. United", "plantel": "D.C. United" },
  "defensa_y_justicia": { "nombre": "Defensa y Justicia", "calendario": "Club Social y Deportivo Defensa y Justicia", "plantel": "Defensa" },
  "defensor_sporting": { "nombre": "Defensor Sporting", "calendario": "Defensor SC", "plantel": "Defensor" },
  "defensores_belgrano": { "nombre": "Defensores de Belgrano", "plantel": "Defensores B." },
  "delfín": { "nombre": "Delfín", "plantel": "Delfín S.C." },
  "deportes_concepción": { "nombre": "Deportes Concepción", "plantel": "D. Concepción" },
  "deportivo_cuenca": { "nombre": "Deportivo Cuenca", "calendario": "Dep. Cuenca" },
  "deportivo_garcilaso": { "nombre": "Deportivo Garcilaso", "calendario": "Dep. Garcilaso" },
  "deportivo_la_guaira": { "nombre": "Deportivo La Guaira", "calendario": "Dep. La Guaira", "plantel": "Dep. La Guaira" },
  "dep_madryn": { "nombre": "Deportivo Madryn", "plantel": "Dep. Madryn" },
  "pereira": { "nombre": "Deportivo Pereira", "plantel": "Dep. Pereira" },
  "deportivo_táchira": { "nombre": "Deportivo Táchira", "calendario": "Táchira" },
  "ea_guingamp": { "nombre": "EA Guingamp", "plantel": "En Avant Guingamp" },
  "eintracht_frankfurt": { "nombre": "Eintracht Frankfurt", "calendario": "Frankfurt" },
  "emelec": { "nombre": "Emelec", "plantel": "CS Emelec" },
  "envigado_fc": { "nombre": "Envigado FC", "plantel": "Envigado" },
  "estoril_praia": { "nombre": "Estoril Praia", "plantel": "Estoril" },
  "estudiantes_ba": { "nombre": "Estudiantes de Buenos Aires", "plantel": "Estudiantes B.A." },
  "estudiantes_lp": { "nombre": "Estudiantes de La Plata", "calendario": "Estudiantes LP", "plantel": "Estudiantes" },
  "estudiantes_rc": { "nombre": "Estudiantes de Río Cuarto", "calendario": "Asociación Atlética Estudiantes", "plantel": "Estudiantes R.C." },
  "everton_eng": { "nombre": "Everton", "plantel": "Everton" },
  "everton": { "nombre": "Everton de Viña del Mar", "plantel": "Everton Chile", "otros": ["CD Everton"] },
  "fc_arouca": { "nombre": "FC Arouca", "plantel": "Arouca" },
  "fc_basel": { "nombre": "FC Basel 1893", "calendario": "Basel", "plantel": "FC Basel" },
  "fc_bayern_munchen": { "nombre": "FC Bayern München", "calendario": "Bayern Munich", "plantel": "Bayern München" },
  "fc_cincinnati": { "nombre": "FC Cincinnati", "calendario": "Football Club Cincinnati" },
  "fc_famalicao": { "nombre": "FC Famalicão", "plantel": "Famalicão" },
  "fc_heidenheim": { "nombre": "FC Heidenheim", "plantel": "1. FC Heidenheim" },
  "juarez": { "nombre": "FC Juárez", "plantel": "F.C. Juárez" },
  "fc_copenhagen": { "nombre": "FC København", "calendario": "Copenhagen" },
  "midtjylland": { "nombre": "FC Midtjylland", "calendario": "Midtjylland" },
  "fc_porto": { "nombre": "FC Porto", "calendario": "Porto" },
  "rb_salzburg": { "nombre": "FC Red Bull Salzburg", "calendario": "Salzburg", "plantel": "RB Salzburg" },
  "fc_utrecht": { "nombre": "FC Utrecht", "calendario": "Utrecht" },
  "viktoria_plzen": { "nombre": "FC Viktoria Plzeň", "calendario": "Viktoria Plzeň", "plantel": "Viktoria Plzeň" },
  "fenerbahce": { "nombre": "Fenerbahçe SK", "calendario": "Fenerbahçe", "plantel": "Fenerbahçe" },
  "ferencvaros": { "nombre": "Ferencvárosi TC", "calendario": "Ferencváros" },
  "ferro": { "nombre": "Ferro", "plantel": "Ferro Carril Oeste" },
  "bodo_glimt": { "nombre": "FK Bodø/Glimt", "calendario": "Bodø/Glimt", "plantel": "FK Bodø_Glimt" },
  "flamengo": { "nombre": "Flamengo", "calendario": "Clube de Regatas do Flamengo" },
  "fortaleza_fc": { "nombre": "Fortaleza FC", "plantel": "Fortaleza CEIF" },
  "galatasaray": { "nombre": "Galatasaray SK", "calendario": "Galatasaray", "plantel": "Galatasaray" },
  "gimnasia_jujuy": { "nombre": "Gimnasia de Jujuy", "plantel": "Gimnasia de J." },
  "gimnasia_mza": { "nombre": "Gimnasia de Mendoza", "calendario": "Club Atlético Gimnasia y Esgrima de Mendoza", "plantel": "Gimnasia de M." },
  "gimnasia_lp": { "nombre": "Gimnasia y Esgrima La Plata", "plantel": "Gimnasia" },
  "gimnasia_tiro": { "nombre": "Gimnasia y Tiro de Salta", "plantel": "Gimnasia y Tiro" },
  "dinamo_zagreb": { "nombre": "GNK Dinamo Zagreb", "calendario": "Dinamo Zagreb", "plantel": "Dinamo Zagreb" },
  "greuther_furth": { "nombre": "Greuther Fürth", "plantel": "SpVgg Greuther Fürth" },
  "gualaceo": { "nombre": "Gualaceo", "plantel": "Gualaceo SC" },
  "gualberto_villarroel": { "nombre": "Gualberto Villarroel", "plantel": "GV San José" },
  "huracan_lh": { "nombre": "Huracan LH", "plantel": "Huracán LH" },
  "imbabura": { "nombre": "Imbabura", "plantel": "Imbabura SC" },
  "idv_ecu": { "nombre": "Independiente del Valle", "plantel": "IDV" },
  "medellin": { "nombre": "Independiente Medellín", "calendario": "Indep. Medellín", "plantel": "DIM" },
  "independiente_petrolero": { "nombre": "Independiente Petrolero", "calendario": "Ind. Petrolero", "plantel": "Ind. Petrolero" },
  "indep_rivadavia": { "nombre": "Independiente Rivadavia", "calendario": "Club Sportivo Independiente Rivadavia", "plantel": "Ind. Rivadavia", "otros": ["CS Independiente Rivadavia"] },
  "santafe": { "nombre": "Independiente Santa Fe", "calendario": "Indep. Santa Fe", "plantel": "Santa Fe" },
  "indep_yumbo": { "nombre": "Independiente Valle del Cauca", "calendario": "Independiente Yumbo", "plantel": "Ind. Yumbo" },
  "instituto": { "nombre": "Instituto de Córdoba", "calendario": "Instituto Atlético Central Córdoba", "plantel": "Instituto", "otros": ["Instituto ACC"] },
  "inter": { "nombre": "Inter", "plantel": "Lombardia FC", "otros": ["Inter Milan"] },
  "inter_miami_cf": { "nombre": "Inter Miami CF", "calendario": "Club Internacional de Fútbol Miami", "plantel": "Inter Miami" },
  "inter_palmira": { "nombre": "Internacional de Palmira", "calendario": "Inter Palmira", "plantel": "Inter Palmira" },
  "jaguares": { "nombre": "Jaguares de Córdoba", "plantel": "Jaguares" },
  "junior": { "nombre": "Junior de Barranquilla", "calendario": "Junior FC", "plantel": "Junior" },
  "juventud_de_las_piedras_uru": { "nombre": "Juventud de Las Piedras", "calendario": "Juventud", "plantel": "Juventud" },
  "juventude": { "nombre": "Juventude", "calendario": "Esporte Clube Juventude" },
  "krc_genk": { "nombre": "KRC Genk", "calendario": "Genk", "plantel": "Genk" },
  "la_galaxy": { "nombre": "LA Galaxy", "calendario": "Los Angeles Galaxy", "plantel": "Los Angeles Galaxy" },
  "lafc": { "nombre": "LAFC", "plantel": "Los Angeles FC" },
  "lazio": { "nombre": "Lazio", "plantel": "Latium" },
  "lens": { "nombre": "Lens", "calendario": "RC Lens", "plantel": "RC Lens" },
  "leones_fc": { "nombre": "Leones FC", "plantel": "Itagüí Leones" },
  "leones_fc_ecu": { "nombre": "Leones FC de Ecuador", "plantel": "Leones FC" },
  "libertad": { "nombre": "Libertad", "otros": ["Club Libertad Asunción"] },
  "libertad_fc": { "nombre": "Libertad FC", "plantel": "Libertad F.C." },
  "lille_osc": { "nombre": "Lille OSC", "calendario": "LOSC Lille", "plantel": "LOSC Lille" },
  "liverpool_eng": { "nombre": "Liverpool", "calendario": "Liverpool FC", "plantel": "Liverpool" },
  "liverpool_uru": { "nombre": "Liverpool de Montevideo", "plantel": "Liverpool F.C." },
  "llaneros_fc": { "nombre": "Llaneros FC", "plantel": "Llaneros F.C." },
  "macará": { "nombre": "Macará", "calendario": "CD Macará" },
  "maccabi_tel_aviv": { "nombre": "Maccabi Tel Aviv FC", "calendario": "M. Tel Aviv" },
  "magallanes": { "nombre": "Magallanes", "plantel": "Club Magallanes" },
  "magdeburg": { "nombre": "Magdeburg", "plantel": "1. FC Magdeburg" },
  "malmo_ff": { "nombre": "Malmö FF", "calendario": "Malmö" },
  "manta_fc": { "nombre": "Manta FC", "plantel": "Manta F.C." },
  "melgar": { "nombre": "Melgar", "calendario": "FBC Melgar", "plantel": "FBC Melgar" },
  "metropolitanos_fc": { "nombre": "Metropolitanos FC", "calendario": "Metropolitanos", "plantel": "Metropolitanos" },
  "milan": { "nombre": "Milan", "plantel": "Milano FC" },
  "millonarios": { "nombre": "Millonarios FC", "calendario": "Millonarios", "plantel": "Millonarios" },
  "minnesota_united": { "nombre": "Minnesota United", "plantel": "Minnesota United FC" },
  "mirassol": { "nombre": "Mirassol", "calendario": "Mirasol Futebol Clube", "plantel": "Mirassol F.C." },
  "montevideo_city_torque_uru": { "nombre": "Montevideo City Torque", "calendario": "Mvd City Torque", "plantel": "Mdeo City Torque" },
  "montevideo_wanderers_uru": { "nombre": "Montevideo Wanderers", "plantel": "Wanderers" },
  "moreirense_fc": { "nombre": "Moreirense FC", "plantel": "Moreirense" },
  "nacional_uru": { "nombre": "Nacional", "plantel": "Nacional U." },
  "nacional_paraguay": { "nombre": "Nacional de Asunción", "plantel": "Club Nacional" },
  "nantes": { "nombre": "Nantes", "plantel": "FC Nantes" },
  "new_england": { "nombre": "New England", "plantel": "New England Revolution" },
  "newcastle_united": { "nombre": "Newcastle United", "calendario": "Newcastle" },
  "newells": { "nombre": "Newells Old Boys", "calendario": "Club Atlético Newell’s Old Boys", "plantel": "Newell's", "otros": ["CA Newell's Old Boys"] },
  "nice": { "nombre": "Nice", "calendario": "OGC Nice", "plantel": "OGC Nice" },
  "nottingham_forest": { "nombre": "Nottingham Forest", "calendario": "Nott'm Forest" },
  "ny_red_bulls": { "nombre": "NY Red Bulls", "calendario": "Red Bull New York", "plantel": "Red Bull New York" },
  "ohiggins": { "nombre": "O'Higgins", "plantel": "CD O'Higgins" },
  "olympiacos": { "nombre": "Olympiacos FC", "calendario": "Olympiacos", "plantel": "Olympiacos" },
  "olympique_de_marseille": { "nombre": "Olympique de Marseille", "calendario": "Marseille" },
  "olympique_lyonnais": { "nombre": "Olympique Lyonnais", "calendario": "Lyon", "otros": ["Olympique Lyon"] },
  "orense": { "nombre": "Orense", "calendario": "Orense SC" },
  "orlando_city": { "nombre": "Orlando City", "plantel": "Orlando City SC" },
  "orsomarso": { "nombre": "Orsomarso", "calendario": "Orsomarso SC", "plantel": "Orsomarso SC" },
  "pafos_fc": { "nombre": "Pafos FC", "calendario": "Pafos" },
  "palmeiras": { "nombre": "Palmeiras", "calendario": "Sociedade Esportiva Palmeiras" },
  "panathinaikos": { "nombre": "Panathinaikos FC", "calendario": "Panathinaikos", "plantel": "Panathinaikos" },
  "paok": { "nombre": "PAOK Thessaloniki", "calendario": "PAOK", "plantel": "PAOK" },
  "paris_saint_germain": { "nombre": "Paris Saint-Germain", "calendario": "PSG" },
  "patriotas": { "nombre": "Patriotas Boyacá", "calendario": "Patriotas" },
  "ludogorets": { "nombre": "PFC Ludogorets 1945", "calendario": "Ludogorets" },
  "philadelphia": { "nombre": "Philadelphia", "plantel": "Philadelphia Union" },
  "portuguesa_fc": { "nombre": "Portuguesa FC", "plantel": "Portuguesa" },
  "progreso_uru": { "nombre": "Progreso", "plantel": "C.A. Progreso" },
  "psv": { "nombre": "PSV", "otros": ["PSV Eindhoven"] },
  "qarabag": { "nombre": "Qarabağ FK", "calendario": "Qarabağ" },
  "quilmes": { "nombre": "Quilmes", "plantel": "Quilmes A.C." },
  "r_oviedo": { "nombre": "R. Oviedo", "plantel": "Real Oviedo" },
  "r_racing_club": { "nombre": "R. Racing Club", "plantel": "Racing de Santander" },
  "r_sporting": { "nombre": "R. Sporting", "plantel": "Real Sporting de Gijón", "otros": ["Sporting Gijón"] },
  "r_valladolid_cf": { "nombre": "R. Valladolid CF", "plantel": "Real Valladolid" },
  "racing": { "nombre": "Racing Club de Avellaneda", "calendario": "Racing Club Asociación Civil de Avellaneda", "plantel": "Racing Club" },
  // Los dos Racing Club. El de Avellaneda es "Racing Club" en la base y el de Montevideo
  // "Racing Club U.", pero el uruguayo se llama "Racing Club" a secas en data.ts: sin esta línea
  // buscaba su plantel por su propio nombre y alineaba a los 31 jugadores de Avellaneda.

  // CATORCE CLUBES QUE TENIAN SU PLANTEL Y NO LO ENCONTRABAN, porque la base los escribe
  // abreviados. Ninguno se acepto por parecerse el nombre: se bajo el plantel real de
  // Transfermarkt y se conto en que equipo de la base estan sus jugadores (npm run sonda -- <club>).
  // Al lado va la cuenta: los suyos contra el segundo equipo mas votado. Esa distancia es la prueba.
  "deportes_antofagasta": { "nombre": "Deportes Antofagasta", "plantel": "Antofagasta" },
  "san_marcos_de_arica": { "nombre": "San Marcos de Arica", "plantel": "San Marcos" },
  "deportes_santa_cruz": { "nombre": "Deportes Santa Cruz", "plantel": "D. Santa Cruz" },
  "san_luis_de_quillota": { "nombre": "San Luis de Quillota", "plantel": "San Luis" },
  "vinotinto_fc": { "nombre": "Vinotinto FC", "plantel": "Vinotinto F.C." },
  "alajuelense": { "nombre": "Alajuelense", "plantel": "LD Alajuelense" },
  "herediano": { "nombre": "Herediano", "plantel": "C.S. Herediano" },
  "wydad_casablanca": { "nombre": "Wydad Casablanca", "plantel": "Wydad A.C." },
  "mineros": { "nombre": "Mineros", "plantel": "Mineros Z." },
  "urawa_red_diamonds": { "nombre": "Urawa Red Diamonds", "plantel": "Urawa Reds" },
  "santiago_morning": { "nombre": "Santiago Morning", "plantel": "Santiago M." },
  "cd_tondela": { "nombre": "CD Tondela", "plantel": "Tondela" },
  "jorge_wilstermann": { "nombre": "Jorge Wilstermann", "plantel": "Wilstermann" },
  "atlético_tembetary": { "nombre": "Atlético Tembetary", "plantel": "A. Tembetary" },
  // Y UNO QUE LA SONDA RECHAZO, que es lo que la hace confiable: el Santiago Wanderers de Chile daba
  // 9 coincidencias con el equipo "Wanderers" de la base y parecia suyo. El Montevideo Wanderers da
  // 19 sobre 24 con el mismo equipo: es del uruguayo. El chileno se queda sin plantel.
  "racing_club_uru": { "nombre": "Racing Club", "plantel": "Racing Club U.", "otros": ["Racing Club de Montevideo"] },
  "racing_club_de_strasbourg_alsace": { "nombre": "Racing Club de Strasbourg Alsace", "calendario": "RC Strasbourg Alsace", "plantel": "RC Strasbourg" },
  "rangers_fc": { "nombre": "Rangers FC", "plantel": "Rangers" },
  "rb_bragantino": { "nombre": "RB Bragantino", "calendario": "Red Bull Bragantino" },
  "rcd_espanyol": { "nombre": "RCD Espanyol", "otros": ["RCD Espanyol Barcelona"] },
  "real_betis": { "nombre": "Real Betis", "plantel": "Real Betis Balompié" },
  "real_estelí": { "nombre": "Real Estelí", "plantel": "Real Estelí FC" },
  "real_madrid": { "nombre": "Real Madrid", "otros": ["Real Madrid Club de Fútbol"] },
  "recoleta": { "nombre": "Recoleta", "plantel": "Recoleta F.C." },
  "red_star_fc": { "nombre": "Red Star FC", "plantel": "Red Star FC (FRANCE)" },
  "riestra": { "nombre": "Riestra", "calendario": "Asociación de Fomento Deportivo Riestra Barrio Colón", "plantel": "Dep. Riestra" },
  "rio_ave_fc": { "nombre": "Rio Ave FC", "plantel": "Rio Ave" },
  "union_sg": { "nombre": "Royale Union Saint-Gilloise", "calendario": "Union Saint-Gilloise", "plantel": "Union Saint-Gilloise" },
  // "San Antonio" en la base son los 32 de Bulo Bulo (Ballivián, Terrazas, Giossa): bolivianos. El
  // San Antonio de Ecuador se llama igual y se los estaba llevando puestos; la base no lo tiene, así
  // que se queda sin plantel hasta conseguir el suyo.
  "san_antonio": { "nombre": "San Antonio", "plantel": null },
  "san_antonio_bulo_bulo": { "nombre": "San Antonio Bulo Bulo", "calendario": "SA Bulo Bulo", "plantel": "San Antonio" },
  "san_jose": { "nombre": "San Jose", "plantel": "San Jose Earthquakes" },
  "san_lorenzo": { "nombre": "San Lorenzo de Almagro", "plantel": "San Lorenzo" },
  "san_martin_sj": { "nombre": "San Martín de San Juan", "plantel": "San Martín" },
  "san_martin_tuc": { "nombre": "San Martín de Tucumán", "plantel": "San Martín T." },
  "sc_braga": { "nombre": "SC Braga", "calendario": "Braga", "plantel": "Sporting de Braga" },
  "sc_freiburg": { "nombre": "SC Freiburg", "calendario": "Freiburg" },
  "slavia_praha": { "nombre": "SK Slavia Praha", "calendario": "Slavia Praha", "plantel": "Slavia Praha" },
  "sturm_graz": { "nombre": "SK Sturm Graz", "calendario": "Sturm Graz", "plantel": "Sturm Graz" },
  "sl_benfica": { "nombre": "SL Benfica", "calendario": "Benfica", "plantel": "Benfica" },
  "sm_mendoza": { "nombre": "SM Mendoza", "plantel": "San Martín (M)" },
  "sport_recife": { "nombre": "Sport Recife", "calendario": "Sport Club do Recife", "plantel": "Sport" },
  "sporting_cristal": { "nombre": "Sporting Cristal", "calendario": "Sport. Cristal" },
  "sporting_kc": { "nombre": "Sporting KC", "calendario": "Sporting Kansas City" },
  "sportivo_ameliano": { "nombre": "Sportivo Ameliano", "plantel": "S. Ameliano" },
  "sportivo_trinidense": { "nombre": "Sportivo Trinidense", "calendario": "Trinidense", "plantel": "Trinidense" },
  "stade_lavallois": { "nombre": "Stade Lavallois", "plantel": "Stade Lavallois MFC" },
  "stade_rennais_fc": { "nombre": "Stade Rennais FC", "plantel": "Stade Rennais" },
  "sudtirol": { "nombre": "Sudtirol", "plantel": "Südtirol" },
  "sv_werder_bremen": { "nombre": "SV Werder Bremen", "plantel": "Werder Bremen" },
  "talleres": { "nombre": "Talleres de Córdoba", "calendario": "Club Atlético Talleres", "plantel": "Talleres" },
  "talleres_re": { "nombre": "Talleres RE", "plantel": "Talleres R.E." },
  "tapatio": { "nombre": "Tapatio", "plantel": "Tapatío" },
  "técnico_universitario": { "nombre": "Técnico Universitario", "plantel": "Técnico U." },
  "tepatitlan": { "nombre": "Tepatitlan", "plantel": "Tepatitlán" },
  "tigres": { "nombre": "Tigres U.A.N.L.", "otros": ["Tigres UANL"] },
  "tottenham_hotspur": { "nombre": "Tottenham Hotspur", "calendario": "Tottenham" },
  "tsg_hoffenheim": { "nombre": "TSG Hoffenheim", "plantel": "TSG 1899 Hoffenheim" },
  "union_sf": { "nombre": "Unión de Santa Fe", "plantel": "Unión" },
  "u_catolica": { "nombre": "Universidad Católica", "calendario": "U. Católica", "plantel": "Uni. Católica" },
  "universidad_católica_ecu": { "nombre": "Universidad Católica de Quito", "plantel": "U. Católica" },
  "u_chile": { "nombre": "Universidad de Chile", "calendario": "U. de Chile", "plantel": "U. de Chile" },
  "utc": { "nombre": "UTC", "otros": ["Universidad Técnica de Cajamarca"] },
  "vasco_da_gama": { "nombre": "Vasco da Gama", "calendario": "Club de Regatas Vasco da Gama" },
  "vfb_stuttgart": { "nombre": "VfB Stuttgart", "calendario": "Stuttgart" },
  "villarreal_cf": { "nombre": "Villarreal CF", "calendario": "Villarreal" },
  "virtus_entella": { "nombre": "Virtus Entella", "plantel": "Entella" },
  "vitoria": { "nombre": "Vitória", "calendario": "Esporte Clube Vitória" },
  "vitoria_sc": { "nombre": "Vitória SC", "plantel": "Vitória de Guimarães", "otros": ["Vitória Guimarães SC"] },
  "yaracuyanos_fc": { "nombre": "Yaracuyanos FC", "plantel": "Yaracuyanos" },
  // Como los escribe Transfermarkt en sus paginas de liga. Sin esto el club no tiene id, y sin
  // id no se le puede pedir ni el plantel ni el tecnico sin ponerse a adivinar por nombre.
  "roma": { "nombre": "Roma", "otros": ["AS Roma"] },
  "sassuolo": { "nombre": "Sassuolo", "otros": ["US Sassuolo"] },
  "fc_twente": { "nombre": "FC Twente", "otros": ["FC Twente Enschede"] },
  "real_salt_lake": { "nombre": "Real Salt Lake", "otros": ["Real Salt Lake City"] },
  "sport_boys": { "nombre": "Sport Boys", "otros": ["Sport Boys Association"] },
  "juan_pablo_ii": { "nombre": "Juan Pablo II", "otros": ["Club Juan Pablo II College"] },
  "moquegua": { "nombre": "Moquegua", "otros": ["Deportivo Moquegua"] },
  "adt": { "nombre": "ADT", "otros": ["Asociación Deportiva Tarma"] },
  "aguilas": { "nombre": "Águilas Doradas", "otros": ["Rionegro Águilas"] },
  "pasto": { "nombre": "Deportivo Pasto", "otros": ["Asociación Deportivo Pasto"] },
};

// --- Lo que cada consumidor pregunta, respondido desde la tabla de arriba -----------------------

/**
 * Del nombre visible al del calendario. Se deriva de la tabla; no se escribe a mano.
 *
 * Va por nombre y no por id porque el calendario no conoce ids: trae nombres sueltos. Los homónimos
 * comparten entrada, y está bien -- se desempatan por país en resolverClubDeCalendario.
 */
export const ALIAS_CALENDARIO: Record<string, string> = Object.fromEntries(
  Object.values(NOMBRES_DE_CLUB)
    .filter(c => c.calendario)
    .map(c => [c.nombre, c.calendario as string])
);

// La vuelta: del nombre del calendario al visible. Es el que se cuela en las crónicas de
// PostMatch/ChutSocial, así que sin esto el rival aparecería como "Asociación de Fomento Deportivo
// Riestra Barrio Colón" en vez de "Riestra".
const NOMBRE_CORTO: Record<string, string> = Object.fromEntries(
  Object.entries(ALIAS_CALENDARIO).map(([corto, largo]) => [largo, corto])
);

/** Nombre con el que este club aparece en los calendarios reales. */
export function nombreEnCalendario(clubName: string): string {
  return ALIAS_CALENDARIO[clubName] ?? clubName;
}

/** Nombre corto y mostrable de un club tal como viene en el calendario. */
export function nombreMostrable(nombreCalendario: string): string {
  return NOMBRE_CORTO[nombreCalendario] ?? nombreCalendario;
}

/**
 * El nombre con el que la base de jugadores llama al plantel de este club.
 *
 * LA RESPUESTA ÚNICA A ESA PREGUNTA. Antes había dos: data.ts la contestaba por id en un lado y por
 * nombre en otro, y el que iba por nombre le daba a los dos Everton la misma plantilla.
 *
 * Se pide el club entero -- y no sólo el id -- porque los clubes generados desde el JSON no están en
 * la tabla y su propio nombre YA es el de la base.
 */
export function nombreDelPlantel(club: { id: string; name: string }): string {
  const c = NOMBRES_DE_CLUB[club.id];
  if (!c) return club.name;
  // `null` es una respuesta, no un hueco: la base no tiene a este club. Devolver su nombre lo haría
  // coincidir con el homónimo de otro país, que es como el San Antonio de Ecuador terminó alineando
  // a los bolivianos del San Antonio Bulo Bulo. Sin plantel se queda, hasta conseguir el suyo.
  if (c.plantel === null) return '';
  return c.plantel ?? club.name;
}

/**
 * Todos los nombres por los que se puede llegar a un club, para buscarlo en datos de afuera.
 *
 * Lo usan los scripts de datos (fichajes, importadores) y el validador. El orden no importa: el que
 * pregunta compara contra la lista entera.
 */
export function nombresDeBusqueda(id: string): string[] {
  const c = NOMBRES_DE_CLUB[id];
  if (!c) return [];
  return [c.nombre, c.calendario, c.plantel, ...(c.otros ?? [])].filter(Boolean) as string[];
}

// Ligas de cada confederación. Sirven para desambiguar un nombre repetido según el torneo en el que
// aparece: en la Champions "Liverpool" solo puede ser el inglés, y en la Libertadores solo el
// uruguayo.
const LIGAS_SUDAMERICA = new Set([
  'Argentina', 'Boliviana', 'Brasileña', 'Chilena', 'Colombiana', 'Ecuatoriana',
  'Paraguaya', 'Peruana', 'Uruguaya', 'Venezolana',
]);
const LIGAS_EUROPA = new Set([
  'Alemana', 'Austríaca', 'Belga', 'Búlgara', 'Checa', 'Chipriota', 'Croata', 'Danesa',
  'Escocesa', 'Española', 'Francesa', 'Griega', 'Holandesa', 'Húngara', 'Inglesa', 'Israelí',
  'Italiana', 'Kazaja', 'Noruega', 'Portuguesa', 'Rumana', 'Serbia', 'Sueca', 'Suiza', 'Turca',
]);

interface ClubMinimo { id: string; name: string; league: string }

/**
 * Encuentra el club de data.ts que corresponde a un nombre de calendario, usando el torneo como
 * desambiguador.
 *
 * Hay 8 nombres exactamente repetidos entre países -- Liverpool (Inglaterra y Uruguay), Everton
 * (Inglaterra y Chile), Nacional (Uruguay y Paraguay), Athletic Club (España y Brasil), Leones FC
 * (Colombia y Ecuador), Universidad Católica (Chile y Ecuador), Comunicaciones y Alianza
 * Universidad. Un find() por nombre devuelve el primero de la lista, así que la FA Cup podía
 * emparejarte contra el Liverpool uruguayo y la Copa del Rey contra el Athletic brasileño.
 *
 * @param competitionLeague  Club.league de la competición, si es liga o copa nacional.
 * @param competitionKind    Para las continentales, que son multipaís y no declaran liga.
 * @param competitionName    Nombre del torneo: distingue Champions de Libertadores.
 */
export function resolverClubDeCalendario<T extends ClubMinimo>(
  clubs: readonly T[],
  nombreCalendario: string,
  competitionLeague?: string,
  competitionKind?: string,
  competitionName?: string,
): T | undefined {
  const corto = nombreMostrable(nombreCalendario);
  const candidatos = clubs.filter(c => c.name === corto || nombreEnCalendario(c.name) === nombreCalendario);
  if (candidatos.length <= 1) return candidatos[0];

  // Copa nacional o liga: el club tiene que ser de ese país.
  if (competitionLeague) {
    const delPais = candidatos.find(c => c.league === competitionLeague);
    if (delPais) return delPais;
  }

  // Continental: se acota al continente del TORNEO, no al de los candidatos. La Libertadores solo
  // tiene clubes sudamericanos y la Champions solo europeos, así que "Liverpool" en una es el
  // uruguayo y en la otra el inglés.
  if (competitionKind === 'continental_cup' && competitionName) {
    const esDeEuropa = /champions|europa|conference|uefa/i.test(competitionName);
    const set = esDeEuropa ? LIGAS_EUROPA : LIGAS_SUDAMERICA;
    const delContinente = candidatos.find(c => set.has(c.league));
    if (delContinente) return delContinente;
  }

  return candidatos[0];
}
