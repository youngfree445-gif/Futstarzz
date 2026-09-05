// LA SEQUÍA DE GOL: cuántos partidos hace que no marcás, y lo que eso pesa.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// Pedido, con estas palabras: "un contador visible de partidos sin marcar que la prensa levanta y
// la hinchada nota. Presión acumulada, no un número aislado."
//
// El dato ya estaba -- `careerStats` guarda goles y partidos -- pero sumado, que es justo la forma
// en la que no dice nada. Un delantero con 40 goles en 60 partidos puede llevar dos meses sin
// marcar y el juego no se enteraba: ni la prensa lo mencionaba, ni la hinchada lo notaba, ni cortar
// la racha se sentía distinto de un gol cualquiera.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EL UMBRAL DEPENDE DEL PUESTO
// ---------------------------------------------------------------------------------------------
//
// Es lo que separa esta mecánica de un impuesto. Cinco partidos sin gol de un DELANTERO es una
// sequía y se habla de eso en la radio; de un defensor no es nada, es su trabajo. Un contador único
// castigaría al arquero por no hacer goles, que es absurdo.
//
// Por eso el defensor y el arquero NO TIENEN umbral. El contador se lleva igual -- es un dato, y se
// muestra cuando marcan -- pero no hay presión, ni castigo, ni rebote: no se sale de una sequía que
// nunca existió.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EL CASTIGO CRECE Y EL REBOTE TAMBIÉN
// ---------------------------------------------------------------------------------------------
//
// "Presión acumulada, no un número aislado". Si cada partido de sequía costara lo mismo, el partido
// 20 se sentiría igual que el 6, y el jugador no tendría por qué apurarse. El castigo sube de a
// poco y tiene techo, para que una mala racha larga se note sin volverse una condena.
//
// Y el rebote es la otra mitad, la que hace que valga la pena: cortar una sequía de quince partidos
// devuelve mucho más que cortar una de seis. Sin eso, la mecánica sería sólo un castigo, y un
// castigo sin salida no es una mecánica.
//
// El rebote está calibrado para pagar MÁS que lo que costó la sequía entera hasta ese punto en los
// primeros partidos, y menos en las muy largas: salir rápido conviene, y de una sequía eterna se
// sale, pero no gratis.

import type { Position } from './types';

/**
 * Cuántos partidos sin marcar hacen falta para que esto sea una sequía, por puesto.
 *
 * `null` es "a este puesto no se le cuenta": no es que el umbral sea altísimo, es que la pregunta
 * no aplica. Un arquero sin goles no está en sequía.
 */
export const UMBRAL_DE_SEQUIA: Record<Position, number | null> = {
  Delantero: 5,
  Mediocampista: 8,
  Defensor: null,
  Arquero: null,
};

/** Lo máximo que puede costar un partido de sequía, en puntos de hinchada. */
export const CASTIGO_MAXIMO = 4;
/** Cada cuántos partidos de sequía sube el castigo un punto. */
const PARTIDOS_POR_ESCALON = 2;
/** Lo que paga cortar una sequía apenas cumplida. De ahí crece un punto por partido de más. */
const REBOTE_EN_EL_UMBRAL = 3;
/** El techo del rebote, por larga que haya sido. */
export const REBOTE_MAXIMO = 12;

/** El contador después de jugar un partido. Marcar lo pone en cero, no marcar lo sube. */
export function contarElPartido(partidosSinMarcar: number, goles: number): number {
  return goles > 0 ? 0 : partidosSinMarcar + 1;
}

/** ¿Esto ya es una sequía, para este puesto? */
export function haySequia(partidosSinMarcar: number, puesto: Position): boolean {
  const umbral = UMBRAL_DE_SEQUIA[puesto];
  return umbral !== null && partidosSinMarcar >= umbral;
}

/**
 * Cuántos puntos de hinchada cuesta ESTE partido de sequía. 0 mientras no haya sequía.
 *
 * Se cobra por partido jugado, no por fecha del calendario: las fechas que no jugaste no son tuyas.
 */
export function castigoDeLaSequia(partidosSinMarcar: number, puesto: Position): number {
  const umbral = UMBRAL_DE_SEQUIA[puesto];
  if (umbral === null || partidosSinMarcar < umbral) return 0;
  return Math.min(CASTIGO_MAXIMO, 1 + Math.floor((partidosSinMarcar - umbral) / PARTIDOS_POR_ESCALON));
}

/**
 * Lo que devuelve cortarla, en puntos de hinchada. 0 si no había sequía que cortar.
 *
 * ES UN PAGO GRANDE DE UNA VEZ, PERO NO ALCANZA A CUBRIR LO QUE LA SEQUÍA SE LLEVÓ. Esa es toda la
 * calibración, y costó dos intentos:
 *
 *   . La primera versión pagaba un número fijo grande -- 6 por cortar una sequía que había costado
 *     1. Medido sobre diez temporadas, daba vuelta la mecánica: un delantero de 0,25 goles por
 *     partido TERMINABA CON MÁS hinchada de la que empezó.
 *   . La segunda devolvía lo gastado más un bono. Peor todavía: por construcción, TODA sequía
 *     cortada dejaba ganancia. Una mecánica de presión con valor esperado positivo no es presión.
 *
 * Ahora el goteo del castigo va más rápido que el rebote, así que la cuenta de una temporada
 * entera queda en rojo para el que no marca y en cero para el que marca. Medido (ver
 * validar:sequia, sección E; hinchada neta por temporada de 38 partidos):
 *
 *     0,15 goles/partido   -19,4      0,40 goles/partido   +0,9
 *     0,25 goles/partido    -2,1      0,90 goles/partido    0,0
 *
 * Y sigue siendo un pago VISIBLE: hasta 12 puntos en un solo partido, contra un goteo de 1 a 4. El
 * gol que corta una sequía larga se siente distinto de un gol cualquiera, que era el pedido.
 *
 * `partidosSinMarcar` es el contador ANTES de este partido: el gol todavía no lo reseteó.
 */
export function reboteAlCortarla(partidosSinMarcar: number, puesto: Position): number {
  const umbral = UMBRAL_DE_SEQUIA[puesto];
  if (umbral === null || partidosSinMarcar < umbral) return 0;
  return Math.min(REBOTE_MAXIMO, REBOTE_EN_EL_UMBRAL + (partidosSinMarcar - umbral));
}

/**
 * Qué tan hondo está: sirve para elegir qué dice la prensa y cuánto insiste.
 *
 * 'ninguna' incluye al que va camino a la sequía pero todavía no llegó. Que el juego no hable de
 * una sequía de tres partidos es parte del diseño: si se habla de todo, no se habla de nada.
 */
export type HondoDeLaSequia = 'ninguna' | 'empieza' | 'pesa' | 'escandalo';

export function hondoDeLaSequia(partidosSinMarcar: number, puesto: Position): HondoDeLaSequia {
  const umbral = UMBRAL_DE_SEQUIA[puesto];
  if (umbral === null || partidosSinMarcar < umbral) return 'ninguna';
  if (partidosSinMarcar >= umbral * 3) return 'escandalo';
  if (partidosSinMarcar >= umbral * 2) return 'pesa';
  return 'empieza';
}

/**
 * ¿La prensa habla HOY de la sequía?
 *
 * No en todos los partidos: una sequía que se comenta cada fecha se vuelve ruido y el jugador deja
 * de leer los posts. Habla al cumplirse el umbral -- que es la noticia -- y después cada tantos
 * partidos, más seguido cuanto más honda.
 */
export function laPrensaHablaDeLaSequia(partidosSinMarcar: number, puesto: Position): boolean {
  const umbral = UMBRAL_DE_SEQUIA[puesto];
  if (umbral === null || partidosSinMarcar < umbral) return false;
  if (partidosSinMarcar === umbral) return true;
  const cada = hondoDeLaSequia(partidosSinMarcar, puesto) === 'escandalo' ? 2 : 3;
  return (partidosSinMarcar - umbral) % cada === 0;
}
