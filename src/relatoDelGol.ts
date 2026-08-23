// EL RELATOR QUE GRITA EL GOL, y dónde corresponde que grite en inglés.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ESTO ES UNA REGLA Y NO UN SONIDO MÁS
// ---------------------------------------------------------------------------------------------
//
// Los dos relatos que hay grabados están EN INGLÉS ("what an amazing shot", "that is nothing but
// incredible"). El resto del juego está en español, así que soltarlos en cualquier gol sería un
// relator inglés gritando un gol en el Metropolitano, que es peor que no tener relator.
//
// Pero en su lugar son exactamente lo que corresponde: un gol en Old Trafford lo grita un inglés.
// Así que la regla no es "hay relato o no hay", es DÓNDE.
//
// ---------------------------------------------------------------------------------------------
// SE MIRA LA CANCHA, NO TU CLUB
// ---------------------------------------------------------------------------------------------
//
// La transmisión es la del país donde se juega. Un colombiano que mete un gol de visitante en la
// Premier lo escucha gritado en inglés, y un inglés que juega en Colombia lo escucha en español --
// que es exactamente lo que pasaría en la tele.
//
// Y por mirar la cancha, esto cubre solo los tres casos sin nombrarlos uno por uno:
//
//   . la liga inglesa y la MLS,
//   . las copas de esos dos países (se juegan ahí),
//   . y una Champions o una Libertadores disputada en un estadio de esos países.
//
// ---------------------------------------------------------------------------------------------
// LOS DOS SE ALTERNAN, Y NO AL AZAR
// ---------------------------------------------------------------------------------------------
//
// Con dos grabaciones y un sorteo, la mitad de las veces el segundo gol suena igual que el primero
// y se nota enseguida. Alternando estrictamente hacen falta cuatro goles en un partido para que
// alguno se repita, que ya casi no pasa.

/** Las ligas cuyos estadios tienen relato en inglés. */
const CANCHAS_EN_INGLES = new Set(['Inglesa', 'Estadounidense']);

/** Los dos relatos grabados, en el orden en que se alternan. */
export const RELATOS = ['relato_gol_1', 'relato_gol_2'] as const;
export type RelatoDeGol = typeof RELATOS[number];

/**
 * ¿En esta cancha el gol se grita en inglés?
 *
 * `liga` es la del club LOCAL (`Club.league`, que guarda el país). Sin liga -- un partido de
 * selecciones, un amistoso -- no hay relato: no se puede saber dónde se juega.
 */
export function hayRelatoEnIngles(liga: string | null | undefined): boolean {
  return !!liga && CANCHAS_EN_INGLES.has(liga);
}

/**
 * Cuál de los dos relatos toca, dado cuántos goles ya se gritaron en este partido.
 *
 * Se pasa el contador y no se guarda acá adentro: un módulo con memoria propia se ensucia entre
 * partidos, y esto tiene que arrancar igual todas las veces.
 */
export function relatoNumero(golesYaGritados: number): RelatoDeGol {
  return RELATOS[Math.abs(golesYaGritados) % RELATOS.length];
}

// ==================================================================================================
// EL GOL EN MORSE
// ==================================================================================================
//
// Un guiño, no un sonido de sistema: los tres puntos y la raya sobre el festejo. Suena ALGUNA QUE
// OTRA VEZ y no siempre, que es la única forma de que siga siendo un guiño -- en todos los goles
// sería un tic, y a la media hora el jugador lo estaría esperando en vez de escuchándolo.
//
// Y NUNCA JUNTO AL RELATOR. Los dos ocupan el mismo lugar -- el segundo y medio después de que la
// pelota entra -- y encimados no se entiende ninguno de los dos. Donde hay relato, el relato manda.

/** Cada cuántos goles, más o menos, aparece. Uno de cada siete. */
export const CHANCE_DEL_MORSE = 0.15;

/** ¿Este gol lleva morse? El dado entra por parámetro, como todas las reglas del juego. */
export function suenaElMorse(dado: number): boolean {
  return dado < CHANCE_DEL_MORSE;
}
