// CUÁNTO PESA UN CLUB, con el ranking mundial de Opta.
//
// ---------------------------------------------------------------------------------------------
// EL PROBLEMA QUE RESUELVE
// ---------------------------------------------------------------------------------------------
//
// Hasta acá la fuerza de un club salía de `reputation`, un número del 1 al 5 puesto a mano. De él
// dependen la vara de titularidad, qué clubes te fichan y cuánto te piden.
//
// Cinco escalones no alcanzan para 697 clubes. Junior, Millonarios, el Real Madrid y el City eran
// todos 5: pedían exactamente lo mismo. El valor del plantel tapaba una parte del problema -- por
// eso `clubStrength` ya lo mezclaba -- pero el valor de plantel de un club sudamericano y el de uno
// europeo no se comparan bien: hay clubes enormes en sus ligas con planteles baratos.
//
// Opta puntúa 14.612 clubes de 226 países en una MISMA escala de 0 a 100, comparable entre ligas
// porque sale de resultados y no de plata. 573 de nuestros clubes están enlazados
// (ver docs/OPTA_POWER_RANKINGS.md).
//
// ---------------------------------------------------------------------------------------------
// UNA SOLA FUENTE, DOS LECTURAS
// ---------------------------------------------------------------------------------------------
//
// `fuerzaDelClub` devuelve un número de 0 a 100 y es lo único que hay que mirar. De ahí salen las
// dos cosas que el juego necesita, cada una en la escala que ya usaba:
//
//   `clubStrength`        11 a 85, para el mercado
//   `varaDeTitularidad`   36 a 80, para saber si sos titular
//
// Los dos rangos son EXACTAMENTE los de antes. Eso es deliberado: lo que cambia es de dónde sale el
// número, no cuánto vale -- así ninguna de las quince cosas que leen esas escalas se entera.
//
// ---------------------------------------------------------------------------------------------
// Y LOS QUE NO ESTÁN EN OPTA SIGUEN COMO SIEMPRE
// ---------------------------------------------------------------------------------------------
//
// 124 de nuestros clubes no tienen rating: los europeos sueltos que existen sólo para las copas, y
// el ascenso argentino con el nombre abreviado. Para ésos la fuerza se sigue derivando de
// `reputation` y del valor del plantel, igual que antes. No es un parche: es que para esos clubes
// eso ES lo mejor que hay, y usar un dato inventado sería peor que usar el viejo.

import type { Club } from './types';
import ranking from '../data/opta_power_rankings.json';

/** Valor de plantel de referencia, el mismo que usaba clubStrength. */
export const VALOR_DE_PLANTEL_DE_REFERENCIA = 500_000_000;

/** El rating de Opta por id de club. Se arma una vez. */
const RATING_POR_ID = new Map<string, number>(
  (ranking as { id: string; rating: number }[]).map(o => [o.id, o.rating]),
);

/** Rango real del rating en nuestra base, medido: de 36.1 a 100. */
const RATING_MINIMO = 36;
const RATING_MAXIMO = 100;

/** ¿Este club tiene rating de Opta? */
export function tieneRatingReal(club: Pick<Club, 'id'>): boolean {
  return RATING_POR_ID.has(club.id);
}

/**
 * Cuánto pesa el club, de 0 a 100.
 *
 * Con Opta cuando lo hay; si no, la cuenta vieja -- reputación más valor de plantel -- llevada a la
 * misma escala para que las dos convivan sin escalones raros.
 */
export function fuerzaDelClub(club: Club): number {
  const real = RATING_POR_ID.get(club.id);
  if (real != null) return real;

  // El respaldo: la fórmula de siempre (11 a 85) estirada al rango del rating. Un club sin Opta con
  // reputación 5 y plantel caro queda cerca de 100, uno de reputación 1 cerca de 36 -- que es
  // exactamente donde los pondría Opta si estuvieran.
  const vieja = club.reputation * 11 + Math.sqrt(Math.min(1, club.marketValue / VALOR_DE_PLANTEL_DE_REFERENCIA)) * 30;
  const t = (vieja - 11) / (85 - 11);
  return RATING_MINIMO + t * (RATING_MAXIMO - RATING_MINIMO);
}

/** Todos los ratings enlazados, ordenados. Es la regla para saber en qué puesto cae uno nuevo. */
const RATINGS_ORDENADOS: number[] = (ranking as { rating: number }[])
  .map(o => o.rating).sort((a, b) => a - b);

/**
 * EN QUÉ PERCENTIL DEL MUNDO CAE ESTE RATING, de 0 a 1.
 *
 * SE USA EL PERCENTIL Y NO EL RATING CRUDO, y esto se decidió midiendo. La escala de Opta está
 * apretada arriba: el rating más bajo de nuestros clubes es 36 pero la mediana es 76.8, así que
 * repartir 36-100 linealmente sobre la vara empujaba a TODO el medio hacia arriba -- Envigado pasaba
 * de pedir 47 de prestigio a pedir 63, y la vara media de todos los clubes subía 7,6 puntos. O sea
 * que conectar el ranking hacía el juego más difícil en todos lados, que no era la idea.
 *
 * Con el percentil, la vara media se mueve +1,5 -- prácticamente nada -- y aun así hay 45 escalones
 * distintos donde antes había 5. Se gana el relieve sin cambiar cuán difícil es el juego.
 */
function percentilDe(rating: number): number {
  const n = RATINGS_ORDENADOS.length;
  if (n === 0) return 0.5;
  // Búsqueda binaria: esto corre en cada render de la pantalla de partido.
  let lo = 0, hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (RATINGS_ORDENADOS[mid] < rating) lo = mid + 1; else hi = mid;
  }
  return lo / (n - 1);
}

/** Lleva la fuerza (0-100) a un rango cualquiera, por percentil. */
function aEscala(fuerza: number, desde: number, hasta: number): number {
  return desde + Math.max(0, Math.min(1, percentilDe(fuerza))) * (hasta - desde);
}

/**
 * La fuerza que mira el MERCADO. Mismo rango que antes (11 a 85) para no mover nada de lo que la lee.
 */
export function fuerzaParaElMercado(club: Club): number {
  return aEscala(fuerzaDelClub(club), 11, 85);
}

/**
 * EL PRESTIGIO QUE UN CLUB TE PIDE PARA SER TITULAR.
 *
 * Mismo rango que antes (36 a 80), donde 36 era reputación 1 y 80 reputación 5. Lo que cambia es
 * que ahora entre Junior y Boca hay distancia: los dos eran 5 y pedían lo mismo.
 */
export function varaDeTitularidad(club: Club): number {
  return Math.round(aEscala(fuerzaDelClub(club), 36, 80));
}

/**
 * EL PRESTIGIO POR DEBAJO DEL CUAL NI TE CONVOCAN. Mismo rango que antes (0 a 20).
 *
 * Se mantiene bajo a propósito: un fichaje te puede mandar al banco, nunca dejarte fuera de la
 * lista, porque eso sería perder fechas enteras por algo que no hiciste.
 */
export function varaDeConvocatoria(club: Club): number {
  return Math.round(aEscala(fuerzaDelClub(club), 0, 20));
}
