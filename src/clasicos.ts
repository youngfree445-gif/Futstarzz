// Los CLÁSICOS: los partidos que pesan distinto.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// Todas las fechas del calendario valen lo mismo para el juego: tres puntos, la misma presión, el
// mismo puñado de fans en juego. En el fútbol de verdad no es así -- hay cinco o seis partidos al
// año que valen por diez, y un jugador los encara distinto.
//
// Esto no cambia el motor ni el calendario: sólo marca ciertos cruces y sube lo que está en juego.
//
// ---------------------------------------------------------------------------------------------
// DE DÓNDE SALEN LOS PARES
// ---------------------------------------------------------------------------------------------
//
// Escritos a mano, y no hay forma de evitarlo: un clásico no se deduce de los datos. No es "los dos
// mejores de la liga" ni "los dos de la misma ciudad" -- Boca y River comparten ciudad con otros
// quince clubes, y el Barsa y el Madrid están a 600 km. Es historia, y la historia se escribe.
//
// Se listan por ID de club (ver data.ts), en pares. El orden no importa: `esClasico` compara en las
// dos direcciones.

/** Pares que forman un clásico, por id de club. */
const PARES: readonly (readonly [string, string])[] = [
  // --- Colombia ---
  ['millonarios', 'santafe'],              // El clásico capitalino
  ['nacional', 'medellin'],                 // El clásico paisa
  ['america_cali', 'cali'],       // El clásico vallecaucano
  ['junior', 'nacional'],                   // El clásico añejo
  ['junior', 'millonarios'],
  ['once_caldas', 'nacional'],

  // --- Argentina ---
  ['boca', 'river'],          // El Superclásico
  ['independiente', 'racing'],         // El clásico de Avellaneda
  ['san_lorenzo', 'huracan'],               // El clásico de Boedo y Parque Patricios
  ['estudiantes_lp', 'gimnasia_lp'],           // El clásico platense
  ['newells', 'rosario_central'],           // El clásico rosarino

  // --- España ---
  ['real_madrid', 'fc_barcelona'],             // El Clásico
  ['real_madrid', 'atletico_de_madrid'],       // El derbi madrileño
  ['fc_barcelona', 'rcd_espanyol'],
  ['sevilla_fc', 'real_betis'],                // El gran derbi
  ['athletic_club_esp', 'real_sociedad'],   // El derbi vasco

  // --- Inglaterra ---
  ['manchester_united', 'manchester_city'],
  ['liverpool_eng', 'everton_eng'],                 // El derbi de Merseyside
  ['arsenal', 'tottenham_hotspur'],                 // El derbi del norte de Londres
  ['liverpool_eng', 'manchester_united'],
  ['chelsea', 'arsenal'],

  // --- Italia ---
  ['inter', 'milan'],                    // El derbi della Madonnina
  ['juventus', 'inter'],                    // El derbi d'Italia
  ['roma', 'lazio'],                        // El derbi della Capitale
  ['napoli', 'juventus'],

  // --- Alemania ---
  ['borussia_dortmund', 'schalke_04'],         // El derbi del Ruhr
  ['fc_bayern_munchen', 'borussia_dortmund'],   // Der Klassiker

  // --- Brasil ---
  ['flamengo', 'fluminense'],               // El Fla-Flu
  ['corinthians', 'palmeiras'],             // El derbi paulista
  ['santos', 'corinthians'],
  ['gremio', 'internacional'],              // El Gre-Nal
  ['flamengo', 'vasco_da_gama'],

  // --- México ---
  ['america_mex', 'chivas'],                // El Clásico Nacional
  ['america_mex', 'pumas'],
  ['monterrey', 'tigres'],                  // El Clásico Regiomontano

  // --- Otros ---
  ['ajax', 'feyenoord'],                    // De Klassieker
  ['boca', 'independiente'],

  // --- Colombia (mas) ---
  ['millonarios', 'nacional'],
  ['america_cali', 'nacional'],
  ['cali', 'nacional'],

  // --- Argentina (mas) ---
  ['talleres', 'belgrano'],                 // El clásico cordobés
  ['banfield', 'lanus'],                    // El clásico del sur
  ['gimnasia_mza', 'indep_rivadavia'],      // El clásico mendocino
  ['river', 'racing'],
  ['boca', 'san_lorenzo'],

  // --- España (mas) ---
  ['valencia_cf', 'levante_ud'],            // El derbi valenciano
  ['sevilla_fc', 'atletico_de_madrid'],
  ['real_madrid', 'sevilla_fc'],

  // --- Inglaterra (mas) ---
  ['newcastle_united', 'sunderland'],       // El derbi del Tyne-Wear
  ['aston_villa', 'wolverhampton_wanderers'], // El derbi de las Midlands
  ['crystal_palace', 'brighton_hove_albion'], // El derbi M23
  ['manchester_city', 'liverpool_eng'],
  ['west_ham_united', 'tottenham_hotspur'],
  ['chelsea', 'tottenham_hotspur'],

  // --- Italia (mas) ---
  ['torino', 'juventus'],                   // El derby della Mole
  ['fiorentina', 'juventus'],
  ['roma', 'napoli'],
  ['inter', 'napoli'],

  // --- Alemania (mas) ---
  ['1_fc_koln', 'borussia_monchengladbach'], // El derbi renano
  ['hamburg', 'sv_werder_bremen'],           // El Nordderby
  ['bayer_leverkusen', '1_fc_koln'],
  ['fc_bayern_munchen', 'rb_leipzig'],

  // --- Brasil (mas) ---
  ['sao_paulo', 'corinthians'],             // El Majestoso
  ['sao_paulo', 'palmeiras'],               // El Choque-Rei
  ['santos', 'sao_paulo'],
  ['santos', 'palmeiras'],
  ['flamengo', 'botafogo'],
  ['botafogo', 'fluminense'],
  ['atletico_mineiro', 'cruzeiro'],         // El clássico mineiro
  ['bahia', 'vitoria'],                     // El Ba-Vi

  // --- México (mas) ---
  ['cruz_azul', 'america_mex'],             // El Clásico Joven
  ['atlas', 'chivas'],                      // El Clásico Tapatío
  ['cruz_azul', 'pumas'],

  // --- Francia ---
  ['paris_saint_germain', 'olympique_de_marseille'],  // Le Classique
  ['lens', 'lille_osc'],                    // El derbi del Norte
  ['nice', 'olympique_de_marseille'],       // El derbi de la Costa Azul
  ['olympique_lyonnais', 'olympique_de_marseille'],

  // --- Holanda (mas) ---
  ['ajax', 'psv'],                          // De Topper
  ['feyenoord', 'sparta_rotterdam'],        // El derbi de Rotterdam
  ['psv', 'feyenoord'],

  // --- Portugal ---
  ['sl_benfica', 'sporting_cp'],            // El derbi de Lisboa
  ['fc_porto', 'sl_benfica'],               // O Clássico
  ['fc_porto', 'sporting_cp'],
  ['boavista_fc', 'fc_porto'],              // El derbi de Oporto

  // --- Chile ---
  ['colocolo', 'u_chile'],                  // El Superclásico chileno
  ['u_chile', 'u_catolica'],                // El clásico universitario
  ['colocolo', 'u_catolica'],

  // --- Uruguay ---
  ['penarol', 'nacional_uru'],              // El Clásico uruguayo

  // --- Ecuador ---
  ['barcelona_sc', 'emelec'],               // El Clásico del Astillero
  ['ldu_quito', 'aucas'],
  ['ldu_quito', 'universidad_católica_ecu'],

  // --- Bolivia ---
  ['bolívar', 'the_strongest'],             // El clásico paceño
  ['oriente_petrolero', 'blooming'],        // El clásico cruceño
];

/** Índice de búsqueda, armado una sola vez. La clave junta los dos ids ordenados. */
const INDICE = new Set(PARES.map(([a, b]) => [a, b].sort().join('|')));

/** ¿Este cruce es un clásico? El orden de los argumentos no importa. */
export function esClasico(clubA: string, clubB: string): boolean {
  return INDICE.has([clubA, clubB].sort().join('|'));
}

/**
 * Cuánto multiplica lo que está en juego.
 *
 * Se aplica a la afición ganada o perdida, no a los puntos: un clásico no vale seis puntos, pero en
 * la calle vale por diez. Perder duele MÁS de lo que ganar suma -- 1.6 contra 2.2 -- porque así se
 * siente de verdad: al clásico se lo recuerda por las derrotas.
 */
export const CLASICO_MULTIPLICADOR_GANAR = 2.2;
export const CLASICO_MULTIPLICADOR_PERDER = 1.6;
