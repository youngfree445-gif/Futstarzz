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
  ['gen_899', 'real_sociedad'],     // El derbi vasco

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
