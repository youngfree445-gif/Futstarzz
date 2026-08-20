// LA CUENTA DE SI UNA JUGADA SALE BIEN, y cuántas jugadas tiene un partido.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ESTO SALIÓ DE MatchSimulator
// ---------------------------------------------------------------------------------------------
//
// Todo el prestigio de una carrera se decide acá. Cada jugada del partido tiene un efecto de
// prestigio si sale bien y otro si sale mal (de +10 a -6, ver los pools de decisiones), y el perfil
// los acumula: `prestige = clamp(prestige + suma del partido, 0, 100)`.
//
// O sea que la pregunta "¿es fácil llegar a crack?" se contesta exactamente acá, y el banco de
// pruebas de carrera larga no podía contestarla porque tenía su PROPIA fórmula inventada -- una
// cuenta sobre la nota del partido que no existe en ningún lado del juego. Dos fuentes contestando
// la misma pregunta, con la diferencia de que una de las dos era la que yo miraba para decir si el
// juego estaba balanceado.
//
// Ahora la cuenta vive acá, la usan el partido de verdad y el banco de pruebas, y lo que se mide es
// el juego.
//
// ---------------------------------------------------------------------------------------------
// EL RUIDO ENTRA POR PARÁMETRO
// ---------------------------------------------------------------------------------------------
//
// `chanceDeAcertar` no llama a Math.random(): recibe el ruido ya sorteado. Es la misma decisión que
// en src/secuela.ts y src/elPibe.ts, y por el mismo motivo -- una función pura se puede correr diez
// mil veces con dados controlados y contar qué pasa de verdad.

import type { PlayerStats } from './types';

/** Los cuatro momentos del partido en los que te toca decidir algo. */
export const MOMENTOS_POR_PARTIDO = 4;

/** El techo de acierto del que nadie te marca. Con marca encima baja proporcionalmente. */
export const TECHO_DE_ACIERTO = 0.88;
/** El piso: ninguna jugada es imposible. */
export const PISO_DE_ACIERTO = 0.15;
/** Cuánto suma cada punto de atributo por encima del que la jugada pide. */
export const BONUS_POR_ATRIBUTO_DE_SOBRA = 0.014;
/** Y cuánto resta cada punto que te falta. Falta menos de lo que sobra: pesa la mitad. */
export const CASTIGO_POR_ATRIBUTO_QUE_FALTA = 0.007;
/** El margen parejo del modo Superestrella. */
export const BONUS_SUPERESTRELLA = 0.05;
/** Amplitud del ruido de cada jugada. */
export const RUIDO = 0.06;

export interface DatosDeLaJugada {
  /** Tu valor en el atributo que la jugada pide. */
  atributo: number;
  /** El valor que la jugada pide (`minVal`). */
  minVal: number;
  /** La dificultad base de la jugada (`successChance`). */
  successChance: number;
  /** Tabla, hinchada, cabeza, fase del torneo y marca personal, ya multiplicados. */
  presion: number;
  /** El factor de marca personal, que además baja el techo. */
  marcaFactor: number;
  starMode?: boolean;
  /** De -0.5 a 0.5. Quien llama tira el dado. */
  ruido: number;
}

/**
 * Qué chance tenés de que esta jugada salga bien.
 *
 * EL TECHO BAJA CON LA MARCA, y sin eso la marca personal no servía para nada: con los atributos en
 * 99 la cuenta antes del clamp da 1.09, así que multiplicarla por 0.80 seguía dando 0.87 y el tope
 * de 0.88 se comía el castigo entero. Bajando el techo la marca se siente donde tiene que sentirse:
 * 0.88 para el que nadie marca, 0.70 para el que tiene un hombre encima los noventa minutos.
 */
export function chanceDeAcertar(d: DatosDeLaJugada): number {
  const statDiff = d.atributo - d.minVal;
  const statBonus = statDiff >= 0
    ? statDiff * BONUS_POR_ATRIBUTO_DE_SOBRA
    : statDiff * CASTIGO_POR_ATRIBUTO_QUE_FALTA;
  const bonusEstrella = d.starMode ? BONUS_SUPERESTRELLA : 0;
  const techo = TECHO_DE_ACIERTO * d.marcaFactor;
  return Math.max(PISO_DE_ACIERTO, Math.min(
    techo,
    (d.successChance + statBonus + bonusEstrella) * d.presion + d.ruido * RUIDO,
  ));
}

/** El promedio de tus seis atributos, que es como el juego mide "tu nivel". */
export function nivelMedio(attrs: PlayerStats): number {
  return Object.values(attrs).reduce((a, b) => a + b, 0) / 6;
}
