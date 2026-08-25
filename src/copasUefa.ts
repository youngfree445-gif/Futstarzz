// Participantes REALES de la fase de liga de la Champions League y la Europa League 2025/26.
//
// Fuente: Transfermarkt (/gesamtspielplan/pokalwettbewerb/CL y /EL, saison_id 2025), bajado con
// scripts/scrape_copa_tm.mjs. Son 36 clubes por torneo y 144 partidos de fase de liga cada uno,
// que es el formato suizo que ya modela leagueEngine.
//
// El código de la Champions en Transfermarkt es **CL**, no C1: C1 existe pero es otra competición
// y devuelve una tabla de palmarés sin partidos. CL responde 503 si se lo pide muy seguido —
// hay que reintentar con espera, no cambiarle el código.
//
// Antes los 26 cupos de las ligas grandes salían de pickTopClubsByCountry (por REPUTACIÓN) y solo
// los 10 clubes de ligas chicas estaban investigados a mano. Eso hacía que fueran siempre los
// mismos y que el campeón no clasificara a la edición siguiente. Ahora la temporada 1 es la real
// y de la 2 en adelante los cupos se ganan en la tabla.
//
// Resueltos por ID de Transfermarkt, nunca por nombre: "Red Star" (TM 159) es el **Estrella Roja
// de Belgrado**, y por texto caía en el Red Star FC francés, que además está en segunda división.

/** Los 36 de la fase de liga de la Champions 2025/26. */
export const CHAMPIONS_2025: readonly string[] = [
  // Inglesa (6)
  'arsenal',                      // Arsenal
  'chelsea',                      // Chelsea
  'liverpool_eng',                // Liverpool
  'manchester_city',              // Man City
  'newcastle_united',             // Newcastle
  'tottenham_hotspur',            // Tottenham
  // Española (5)
  'athletic_club_esp',            // Athletic Club
  'atletico_de_madrid',           // Atlético
  'fc_barcelona',                 // Barcelona
  'real_madrid',                  // Real Madrid
  'villarreal_cf',                // Villarreal
  // Alemana (4)
  'bayer_leverkusen',             // Leverkusen
  'borussia_dortmund',            // Dortmund
  'eintracht_frankfurt',          // Frankfurt
  'fc_bayern_munchen',            // Bayern Munich
  // Italiana (4)
  'atalanta',                     // Atalanta
  'inter',                        // Inter
  'juventus',                     // Juventus
  'napoli',                       // Napoli
  // Francesa (3)
  'as_monaco',                    // Monaco
  'olympique_de_marseille',       // Marseille
  'paris_saint_germain',          // PSG
  // Belga (2)
  'club_brugge',                  // Club Brugge
  'union_sg',                     // Union SG
  // Holandesa (2)
  'ajax',                         // Ajax
  'psv',                          // PSV
  // Portuguesa (2)
  'sl_benfica',                   // Benfica
  'sporting_cp',                  // Sporting
  // Azerí (1)
  'qarabag',                      // Qarabağ
  // Checa (1)
  'slavia_praha',                 // Slavia Praha
  // Chipriota (1)
  'pafos_fc',                     // Pafos
  // Danesa (1)
  'fc_copenhagen',                // Copenhagen
  // Griega (1)
  'olympiacos',                   // Olympiacos
  // Kazaja (1)
  'kairat_almaty',                // Kairat Almaty
  // Noruega (1)
  'bodo_glimt',                   // Bodø/Glimt
  // Turca (1)
  'galatasaray',                  // Galatasaray
];

/** Los 36 de la fase de liga de la Europa League 2025/26. */
export const EUROPA_2025: readonly string[] = [
  // Francesa (3)
  'lille_osc',                    // Lille
  'nice',                         // Nice
  'olympique_lyonnais',           // Lyon
  // Holandesa (3)
  'fc_utrecht',                   // Utrecht
  'feyenoord',                    // Feyenoord
  'go_ahead_eagles',              // Go Ahead Eagles
  // Alemana (2)
  'sc_freiburg',                  // Freiburg
  'vfb_stuttgart',                // Stuttgart
  // Austríaca (2)
  'rb_salzburg',                  // Salzburg
  'sturm_graz',                   // Sturm Graz
  // Escocesa (2)
  'celtic_fc',                    // Celtic
  'rangers_fc',                   // Rangers
  // Española (2)
  'celta',                        // Celta de Vigo
  'real_betis',                   // Real Betis
  // Griega (2)
  'panathinaikos',                // Panathinaikos
  'paok',                         // PAOK
  // Inglesa (2)
  'aston_villa',                  // Aston Villa
  'nottingham_forest',            // Nott'm Forest
  // Italiana (2)
  'bologna',                      // Bologna
  'roma',                         // Roma
  // Portuguesa (2)
  'fc_porto',                     // Porto
  'sc_braga',                     // Braga
  // Suiza (2)
  'young_boys',                   // Young Boys
  'fc_basel',                     // Basel
  // Belga (1)
  'krc_genk',                     // Genk
  // Búlgara (1)
  'ludogorets',                   // Ludogorets
  // Checa (1)
  'viktoria_plzen',               // Viktoria Plzeň
  // Croata (1)
  'dinamo_zagreb',                // Dinamo Zagreb
  // Danesa (1)
  'midtjylland',                  // Midtjylland
  // Húngara (1)
  'ferencvaros',                  // Ferencváros
  // Israelí (1)
  'maccabi_tel_aviv',             // M. Tel Aviv
  // Noruega (1)
  'brann_sk',                     // SK Brann
  // Rumana (1)
  'fcsb',                         // FCSB
  // Serbia (1)
  'red_star_belgrade',            // Red Star
  // Sueca (1)
  'malmo_ff',                     // Malmö
  // Turca (1)
  'fenerbahce',                   // Fenerbahçe
];

// Cupos por liga, contados de la edición real. Se usan de la temporada 2 en adelante para repartir
// las plazas con la tabla final del año anterior.
export const CUPOS_CHAMPIONS: Readonly<Record<string, number>> = {
  'Inglesa': 6,
  'Española': 5,
  'Alemana': 4,
  'Italiana': 4,
  'Francesa': 3,
  'Belga': 2,
  'Holandesa': 2,
  'Portuguesa': 2,
  'Azerí': 1,
  'Checa': 1,
  'Chipriota': 1,
  'Danesa': 1,
  'Griega': 1,
  'Kazaja': 1,
  'Noruega': 1,
  'Turca': 1,
};

export const CUPOS_EUROPA: Readonly<Record<string, number>> = {
  'Francesa': 3,
  'Holandesa': 3,
  'Alemana': 2,
  'Austríaca': 2,
  'Escocesa': 2,
  'Española': 2,
  'Griega': 2,
  'Inglesa': 2,
  'Italiana': 2,
  'Portuguesa': 2,
  'Suiza': 2,
  'Belga': 1,
  'Búlgara': 1,
  'Checa': 1,
  'Croata': 1,
  'Danesa': 1,
  'Húngara': 1,
  'Israelí': 1,
  'Noruega': 1,
  'Rumana': 1,
  'Serbia': 1,
  'Sueca': 1,
  'Turca': 1,
};

// Liga de cada participante. Explícito y no deducido del orden de las listas, por lo mismo que en
// copasConmebol.ts: las listas van por cantidad y cualquier cálculo por índice se desalinea.
const LIGA_POR_CLUB: Readonly<Record<string, string>> = {
  // Alemana
  'bayer_leverkusen':             'Alemana',
  'borussia_dortmund':            'Alemana',
  'eintracht_frankfurt':          'Alemana',
  'fc_bayern_munchen':            'Alemana',
  'sc_freiburg':                  'Alemana',
  'vfb_stuttgart':                'Alemana',
  // Austríaca
  'rb_salzburg':                  'Austríaca',
  'sturm_graz':                   'Austríaca',
  // Azerí
  'qarabag':                      'Azerí',
  // Belga
  'club_brugge':                  'Belga',
  'krc_genk':                     'Belga',
  'union_sg':                     'Belga',
  // Búlgara
  'ludogorets':                   'Búlgara',
  // Checa
  'slavia_praha':                 'Checa',
  'viktoria_plzen':               'Checa',
  // Chipriota
  'pafos_fc':                     'Chipriota',
  // Croata
  'dinamo_zagreb':                'Croata',
  // Danesa
  'fc_copenhagen':                'Danesa',
  'midtjylland':                  'Danesa',
  // Escocesa
  'celtic_fc':                    'Escocesa',
  'rangers_fc':                   'Escocesa',
  // Española
  'athletic_club_esp':            'Española',
  'atletico_de_madrid':           'Española',
  'celta':                        'Española',
  'fc_barcelona':                 'Española',
  'real_betis':                   'Española',
  'real_madrid':                  'Española',
  'villarreal_cf':                'Española',
  // Francesa
  'as_monaco':                    'Francesa',
  'lille_osc':                    'Francesa',
  'nice':                         'Francesa',
  'olympique_de_marseille':       'Francesa',
  'olympique_lyonnais':           'Francesa',
  'paris_saint_germain':          'Francesa',
  // Griega
  'olympiacos':                   'Griega',
  'panathinaikos':                'Griega',
  'paok':                         'Griega',
  // Holandesa
  'ajax':                         'Holandesa',
  'fc_utrecht':                   'Holandesa',
  'feyenoord':                    'Holandesa',
  'go_ahead_eagles':              'Holandesa',
  'psv':                          'Holandesa',
  // Húngara
  'ferencvaros':                  'Húngara',
  // Inglesa
  'arsenal':                      'Inglesa',
  'aston_villa':                  'Inglesa',
  'chelsea':                      'Inglesa',
  'liverpool_eng':                'Inglesa',
  'manchester_city':              'Inglesa',
  'newcastle_united':             'Inglesa',
  'nottingham_forest':            'Inglesa',
  'tottenham_hotspur':            'Inglesa',
  // Israelí
  'maccabi_tel_aviv':             'Israelí',
  // Italiana
  'atalanta':                     'Italiana',
  'bologna':                      'Italiana',
  'inter':                        'Italiana',
  'juventus':                     'Italiana',
  'napoli':                       'Italiana',
  'roma':                         'Italiana',
  // Kazaja
  'kairat_almaty':                'Kazaja',
  // Noruega
  'bodo_glimt':                   'Noruega',
  'brann_sk':                     'Noruega',
  // Portuguesa
  'fc_porto':                     'Portuguesa',
  'sc_braga':                     'Portuguesa',
  'sl_benfica':                   'Portuguesa',
  'sporting_cp':                  'Portuguesa',
  // Rumana
  'fcsb':                         'Rumana',
  // Serbia
  'red_star_belgrade':            'Serbia',
  // Sueca
  'malmo_ff':                     'Sueca',
  // Suiza
  'fc_basel':                     'Suiza',
  'young_boys':                   'Suiza',
  // Turca
  'fenerbahce':                   'Turca',
  'galatasaray':                  'Turca',
};

/**
 * Quiénes juegan la copa europea en una temporada dada.
 *
 * Temporada 1: la edición real 2025/26, tal cual.
 *
 * Temporada 2 en adelante: se gana en la cancha. Mismos cupos por liga que la edición real, pero
 * llenados con la tabla final del año anterior — que es como reparte UEFA de verdad. El campeón
 * vigente de cada copa entra a la Champions siguiente aunque su liga no le haya dado plaza, igual
 * que en el reglamento real.
 *
 * A diferencia de Conmebol acá NO hay cupo por país fuera de Europa: las ligas chicas (Chipriota,
 * Kazaja, Azerí...) aportan un solo club y si esa liga no se simuló se cae al club real de 2025/26.
 */
export function participantesUefa(
  cupId: 'champions' | 'europa',
  year: number,
  posiciones?: Record<string, readonly string[]>,
  campeones?: { champions?: string | null; europa?: string | null },
  todosLosClubes: readonly { id: string; league: string; reputation: number; division?: 1 | 2 | 3 }[] = [],
): string[] {
  const real = cupId === 'champions' ? CHAMPIONS_2025 : EUROPA_2025;
  if (year <= 1 || !posiciones) return [...real];

  const cupos = cupId === 'champions' ? CUPOS_CHAMPIONS : CUPOS_EUROPA;
  const anioPrevio = year - 1;

  // La Champions se arma primero y la Europa recibe a los que quedaron afuera: un club no puede
  // estar en las dos.
  const tomado = cupId === 'europa'
    ? new Set(participantesUefa('champions', year, posiciones, campeones, todosLosClubes))
    : new Set<string>();

  const elegidos: string[] = [];
  for (const [league, n] of Object.entries(cupos)) {
    // El campeón vigente entra DENTRO de la cuota de su liga: sumarlo aparte pasaría de 36 y el
    // recorte final dejaría sin representante a la última liga de la lista.
    const campeonesDeLaLiga = cupId === 'champions'
      ? [campeones?.champions, campeones?.europa]
          .filter((id): id is string => !!id && ligaDe(id, todosLosClubes) === league)
      : [];
    const porTabla = posiciones[`${league}-${anioPrevio}`] ?? [];
    const resto = todosLosClubes
      .filter(c => c.league === league && (c.division ?? 1) === 1)
      .sort((a, b) => b.reputation - a.reputation)
      .map(c => c.id);
    const candidatos = [...campeonesDeLaLiga, ...porTabla, ...resto,
                        ...real.filter(id => ligaDe(id, todosLosClubes) === league)];

    let puestos = 0;
    for (const id of candidatos) {
      if (puestos >= n) break;
      if (tomado.has(id)) continue;
      tomado.add(id);
      elegidos.push(id);
      puestos++;
    }
  }
  return elegidos;
}

function ligaDe(
  clubId: string,
  todosLosClubes: readonly { id: string; league: string }[] = [],
): string | null {
  // El mapa cubre a los 72 de la edición real; cualquier otro club (uno que clasificó por mérito)
  // se busca en la base que llega por parámetro.
  return LIGA_POR_CLUB[clubId] ?? todosLosClubes.find(c => c.id === clubId)?.league ?? null;
}

/**
 * Cómo se llama cada copa europea EN EL CALENDARIO por fechas (src/realCalendarDates.ts).
 *
 * SIN el prefijo "UEFA", y eso no es una preferencia de estilo: es el nombre con el que hay que
 * comparar para contar sus días.
 *
 * El calendario viejo por semanas (realCalendar.ts) las llamaba "UEFA Champions League" y ese
 * nombre se quedó en el motor cuando se migró a fechas reales, donde la competición se llama
 * "Champions League" a secas. Como `fechasDeCopaTranscurridas` cuenta los días comparando el
 * nombre contra el del calendario, la comparación no daba nunca: el reloj de la copa se quedaba
 * clavado y el cuadro jamás llegaba al día. De ahí salían las dos Champions a la vez -- diez
 * partidos que ponía el calendario y unos pocos que ponía el cuadro, con dos carteles distintos en
 * la misma temporada -- y que el torneo se apagara en febrero sin cuartos, ni semis, ni final.
 *
 * Las de Conmebol nunca lo sufrieron porque sus dos nombres sí coinciden ("Copa Libertadores").
 *
 * El nombre que se MUESTRA en pantalla sigue siendo "UEFA Champions League": es otra cosa y vive
 * aparte a propósito.
 */
export const NOMBRE_UEFA_EN_EL_CALENDARIO: Readonly<Record<'champions' | 'europa', string>> = {
  champions: 'Champions League',
  europa: 'Europa League',
};

/** Campeones vigentes de las copas europeas, para darles su plaza en la Champions siguiente. */
export interface CampeonesUefa {
  champions?: string | null;
  europa?: string | null;
}
