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

// ==================================================================================================
// EL REBALANCEO DEL PRESTIGIO
// ==================================================================================================
//
// `npm run medir:balance` midió dos cosas que rompían la progresión entera:
//
//   1. UN JUGADOR PROMEDIO IBA DE 50 A 100 EN OCHO PARTIDOS. El prestigio decide la titularidad, el
//      mercado, la lista de transferibles y la selección -- y se saturaba en media temporada. A
//      partir de ahí ninguna de esas cosas volvía a moverse.
//   2. LA OPCIÓN ARRIESGADA PAGABA MÁS QUE LA CONSERVADORA SIEMPRE (+8.30 contra +6.45). O sea que
//      la pantalla de partido no tenía una decisión: tenía una respuesta correcta.
//
// Las dos se arreglan acá, y las dos de la misma forma: sin tocar el catálogo. Los números de cada
// jugada siguen siendo los mismos y siguen leyéndose como pesos relativos -- lo que cambia es cuánto
// vale un punto y qué pide el partido en ese momento.

/**
 * Cuánto vale de verdad un punto de prestigio de una jugada.
 *
 * Se aplica en un solo lugar (donde se acumula), y no editando las trescientas jugadas del catálogo:
 * los números de ahí son PESOS RELATIVOS -- que un caño valga más que un pase al pie es correcto y
 * no había que tocarlo. Lo que estaba mal era la escala.
 *
 * Con 1/3, un jugador promedio pasa de 50 a 100 en unos 22 partidos en vez de 8: más de media
 * temporada de titular, jugando bien.
 */
export const CUANTO_VALE_UN_PUNTO = 1 / 3;

export interface SituacionDeLaJugada {
  /** Qué tan segura es la opción que elegiste (`successChance` del catálogo). */
  successChance: number;
  minuto: number;
  golesMios: number;
  golesRival: number;
  exito: boolean;
}

/** Debajo de esto una opción es "arriesgada"; encima del otro umbral es "de aguantar". */
export const OPCION_ARRIESGADA = 0.45;
export const OPCION_SEGURA = 0.6;
/** A partir de qué minuto el partido empieza a pedirte una cosa concreta. */
export const MINUTO_EN_QUE_IMPORTA = 60;

/**
 * Cuánto multiplica el prestigio de esta jugada según lo que el partido pedía.
 *
 * LA IDEA. Antes de los 60' o con el partido roto (dos goles o más de diferencia) no pide nada
 * especial: jugás. Del minuto 60 en adelante y con el partido en un gol, sí:
 *
 *   . GANANDO POR UNO, perder la pelota en una jugada de riesgo es un crimen y aguantarla vale
 *     doble. Es el minuto 85 con 1-0: nadie te aplaude el caño.
 *   . PERDIENDO POR UNO es exactamente al revés. El que la toca para el costado en el 85 con 0-1 no
 *     está siendo prudente, está escondiéndose.
 *   . EMPATADOS no pide ninguna de las dos: ahí sí es tu decisión y nada la inclina.
 *
 * Con esto la pregunta de la pantalla de partido deja de ser "¿cuál paga más?" -- que tenía una
 * respuesta fija -- y pasa a ser "¿qué necesita el equipo ahora?", que cambia cada vez.
 */
export function pesoDeLaSituacion(d: SituacionDeLaJugada): number {
  if (d.minuto < MINUTO_EN_QUE_IMPORTA) return 1;
  const diferencia = d.golesMios - d.golesRival;
  if (Math.abs(diferencia) !== 1) return 1;

  const arriesgada = d.successChance < OPCION_ARRIESGADA;
  const segura = d.successChance >= OPCION_SEGURA;
  if (!arriesgada && !segura) return 1;

  const vasGanando = diferencia > 0;

  if (vasGanando) {
    if (arriesgada) return d.exito ? 0.7 : 2;    // si sale, ni te lo festejan; si no, te matan
    if (segura) return d.exito ? 1.8 : 1;        // aguantarla vale, y perderla no se castiga extra
  } else {
    if (arriesgada) return d.exito ? 1.8 : 0.8;  // había que intentarla
    if (segura) return d.exito ? 0.6 : 1.2;      // esconderse no es prudencia
  }
  return 1;
}

/**
 * El prestigio final de una jugada: el del catálogo, por lo que pide el partido, por la escala.
 *
 * Vive acá para que el partido de verdad y el banco de pruebas hagan LA MISMA cuenta. Devuelve un
 * número con decimales a propósito; quien lo acumule redondea una sola vez al final del partido, o
 * las jugadas chicas se perderían de a una.
 */
export function prestigioDeLaJugada(base: number, situacion: SituacionDeLaJugada): number {
  return base * pesoDeLaSituacion(situacion) * CUANTO_VALE_UN_PUNTO;
}

/**
 * Qué te está pidiendo el partido ahora mismo, o null si no pide nada en particular.
 *
 * ESTO NO ES DECORACIÓN: es la mitad de la regla. Una regla que cambia lo que paga cada opción y que
 * el jugador no puede ver no es una decisión, es un impuesto escondido -- elegís a ciegas y después
 * el número sale distinto sin que sepas por qué. Con el cartel, la pregunta pasa a ser "¿le hago
 * caso al partido o me la juego?", que es una pregunta de verdad.
 */
export function queEstaPidiendoElPartido(
  minuto: number,
  golesMios: number,
  golesRival: number,
): string | null {
  if (minuto < MINUTO_EN_QUE_IMPORTA) return null;
  const diferencia = golesMios - golesRival;
  if (Math.abs(diferencia) !== 1) return null;
  return diferencia > 0
    ? 'Faltan minutos y ganás por uno: el equipo necesita que la aguantes.'
    : 'Faltan minutos y perdés por uno: si no la intentás vos, no la intenta nadie.';
}
