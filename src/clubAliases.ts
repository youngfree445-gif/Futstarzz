// Puente entre el nombre corto de data.ts y el nombre oficial largo con el que los clubes figuran
// en los calendarios reales importados de Transfermarkt (src/realCalendar.ts).
//
// Vive en su propio módulo, y no dentro de realSchedule.ts, porque lo necesitan tanto realSchedule
// (para saber qué le toca jugar al club esta semana) como leagueEngine (para armar la tabla con la
// jornada real). leagueEngine no puede importar de realSchedule: realSchedule ya importa de
// leagueEngine y el ciclo rompe el build.
//
// Sin esta tabla, 29 clubes de primera división -- Racing, Newell's, Flamengo, Palmeiras y medio
// MLS entre ellos -- no encontraban su calendario y caían al fixture generado, jugando un torneo
// paralelo al de sus rivales de la misma liga.
//
// Se mapea acá y no renombrando data.ts a propósito: el nombre corto es el que se muestra en
// pantalla y el que usan escudos, plantillas y posts de ChutSocial.
export const ALIAS_CALENDARIO: Record<string, string> = {
  // Argentina
  'Racing Club de Avellaneda': 'Racing Club Asociación Civil de Avellaneda',
  'Newells Old Boys': 'Club Atlético Newell’s Old Boys',
  'Instituto de Córdoba': 'Instituto Atlético Central Córdoba',
  'Defensa y Justicia': 'Club Social y Deportivo Defensa y Justicia',
  'Talleres de Córdoba': 'Club Atlético Talleres',
  'Independiente Rivadavia': 'Club Sportivo Independiente Rivadavia',
  'Riestra': 'Asociación de Fomento Deportivo Riestra Barrio Colón',
  'Estudiantes de Río Cuarto': 'Asociación Atlética Estudiantes',
  'Gimnasia de Mendoza': 'Club Atlético Gimnasia y Esgrima de Mendoza',
  // Brasil
  'Palmeiras': 'Sociedade Esportiva Palmeiras',
  'Botafogo': 'S. A. F. Botafogo',
  'Atlético Mineiro': 'Clube Atlético Mineiro',
  'Flamengo': 'Clube de Regatas do Flamengo',
  'RB Bragantino': 'Red Bull Bragantino',
  'Vitória': 'Esporte Clube Vitória',
  'Vasco da Gama': 'Club de Regatas Vasco da Gama',
  'Bahia': 'Esporte Clube Bahia',
  'Sport Recife': 'Sport Club do Recife',
  'Mirassol': 'Mirasol Futebol Clube',   // el calendario lo escribe con una sola 's'
  'Juventude': 'Esporte Clube Juventude',
  // Francia
  'Lens': 'RC Lens',
  'Lille OSC': 'LOSC Lille',
  'Nice': 'OGC Nice',
  'Racing Club de Strasbourg Alsace': 'RC Strasbourg Alsace',
  'Brest': 'Stade Brestois 29',
  // MLS
  'CF Montréal': 'Club de Foot Montréal',
  'DC United': 'D.C. United',
  'FC Cincinnati': 'Football Club Cincinnati',
  'Inter Miami CF': 'Club Internacional de Fútbol Miami',
  'LA Galaxy': 'Los Angeles Galaxy',
  'NY Red Bulls': 'Red Bull New York',
  'Sporting KC': 'Sporting Kansas City',
  // Bélgica
  'Royale Union Saint-Gilloise': 'Union Saint-Gilloise',

  // --- Copas continentales ---
  // En la vista de copa Transfermarkt abrevia los nombres ("Indep. Medellin", "Bayern Munich",
  // "Nott'm Forest"), distinto de como los escribe en las paginas de liga. Sin estos alias,
  // 103 clubes no encontraban su calendario de copa.
  //
  // Los homonimos se resolvieron por pais: "Liverpool FC" en Libertadores es el uruguayo, no el
  // ingles, y "U. Catolica" es la chilena. Ver el comentario de cada bloque.
  'AS Monaco': 'Monaco',
  'Academia Puerto Cabello': 'Puerto Cabello',
  'Alianza Lima': 'Alianza Atl.',
  'Argentinos Juniors': 'Argentinos Jrs.',
  'Atlético Bucaramanga': 'A. Bucaramanga',
  'Atlético Nacional': 'Atl. Nacional',
  'BSC Young Boys': 'Young Boys',
  'Barracas Central': 'Barracas C.',
  'Bayer 04 Leverkusen': 'Leverkusen',
  'Blooming': 'Club Blooming',
  'Borussia Dortmund': 'Dortmund',
  'Celta': 'Celta de Vigo',
  'Celtic FC': 'Celtic',
  'Club Brugge KV': 'Club Brugge',
  'Defensor Sporting': 'Defensor SC',
  'Deportivo Cuenca': 'Dep. Cuenca',
  'Deportivo Garcilaso': 'Dep. Garcilaso',
  'Deportivo La Guaira': 'Dep. La Guaira',
  'Deportivo Táchira': 'Táchira',
  'Eintracht Frankfurt': 'Frankfurt',
  'Estudiantes de La Plata': 'Estudiantes LP',
  'FC Basel 1893': 'Basel',
  'FC Bayern München': 'Bayern Munich',
  'FC København': 'Copenhagen',
  'FC Midtjylland': 'Midtjylland',
  'FC Porto': 'Porto',
  'FC Red Bull Salzburg': 'Salzburg',
  'FC Utrecht': 'Utrecht',
  'FC Viktoria Plzeň': 'Viktoria Plzeň',
  'FK Bodø/Glimt': 'Bodø/Glimt',
  'Fenerbahçe SK': 'Fenerbahçe',
  'Ferencvárosi TC': 'Ferencváros',
  'GNK Dinamo Zagreb': 'Dinamo Zagreb',
  'Galatasaray SK': 'Galatasaray',
  'Independiente Medellín': 'Indep. Medellín',
  'Independiente Petrolero': 'Ind. Petrolero',
  'Independiente Santa Fe': 'Indep. Santa Fe',
  'Junior de Barranquilla': 'Junior FC',
  'Juventud de Las Piedras': 'Juventud',
  'KRC Genk': 'Genk',
  'Liverpool': 'Liverpool FC',
  'Macará': 'CD Macará',
  'Maccabi Tel Aviv FC': 'M. Tel Aviv',
  'Malmö FF': 'Malmö',
  'Melgar': 'FBC Melgar',
  'Metropolitanos FC': 'Metropolitanos',
  'Millonarios FC': 'Millonarios',
  'Montevideo City Torque': 'Mvd City Torque',
  'Newcastle United': 'Newcastle',
  'Nottingham Forest': "Nott'm Forest",
  'Olympiacos FC': 'Olympiacos',
  'Olympique Lyonnais': 'Lyon',
  'Olympique de Marseille': 'Marseille',
  'Orense': 'Orense SC',
  'PAOK Thessaloniki': 'PAOK',
  'PFC Ludogorets 1945': 'Ludogorets',
  'Pafos FC': 'Pafos',
  'Panathinaikos FC': 'Panathinaikos',
  'Paris Saint-Germain': 'PSG',
  'Qarabağ FK': 'Qarabağ',
  'SC Braga': 'Braga',
  'SC Freiburg': 'Freiburg',
  'SK Slavia Praha': 'Slavia Praha',
  'SK Sturm Graz': 'Sturm Graz',
  'SL Benfica': 'Benfica',
  'San Antonio Bulo Bulo': 'SA Bulo Bulo',
  'Sporting Cristal': 'Sport. Cristal',
  'Sportivo Trinidense': 'Trinidense',
  'Tottenham Hotspur': 'Tottenham',
  'Universidad Católica': 'U. Católica',
  'Universidad de Chile': 'U. de Chile',
  'VfB Stuttgart': 'Stuttgart',
  'Villarreal CF': 'Villarreal',
};

// La vuelta: del nombre del calendario al corto de data.ts. Es el que se muestra en pantalla y el
// que se cuela en las crónicas de PostMatch/ChutSocial, así que sin esto el rival aparecería como
// "Asociación de Fomento Deportivo Riestra Barrio Colón" en vez de "Riestra".
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
