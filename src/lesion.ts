// La lesión que se JUEGA, no la que se espera.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE ESTE ARCHIVO
// ---------------------------------------------------------------------------------------------
//
// Hasta acá la lesión tenía dos tratamientos -- 'fast' (pagás y se acorta) y 'natural' (gratis y no
// se acorta) -- y los dos terminaban en lo mismo: mirar bajar un número. La decisión se tomaba una
// vez, al principio, y después la lesión se resolvía sola durante N fechas.
//
// Falta la única decisión que de verdad duele: VOLVER ANTES DE TIEMPO. Jugar con la lesión encima,
// rendir peor, y arriesgarte a romperte de nuevo.
//
// ---------------------------------------------------------------------------------------------
// LO QUE SE ENCONTRÓ AL ABRIR EL CÓDIGO (y por qué esto es más chico de lo que parece)
// ---------------------------------------------------------------------------------------------
//
// El roll de recaída YA ESTABA ESCRITO en App.tsx (handleFinishMatch) y era CÓDIGO MUERTO. Las dos
// puertas de entrada al partido -- handleAdvanceWeek y startMatchflow -- cortaban con
// `weeksRemaining > 0` y mandaban la fecha a resolveInjuredWeek. O sea que era IMPOSIBLE llegar a
// jugar un partido con lesión activa, y por lo tanto imposible recaer.
//
// El aviso del tratamiento rápido ("hay riesgo de recaída si volvés a jugar apenas termine") era,
// literalmente, un farol: no había forma de que ese riesgo se ejecutara nunca.
//
// Así que forzar la vuelta no agrega un sistema: ABRE la puerta que dejaba muerto al que ya había.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EL RIESGO ESCALA EN VEZ DE SER FIJO
// ---------------------------------------------------------------------------------------------
//
// Un porcentaje plano volvería la decisión trivial: si arriesgar siempre cuesta lo mismo, forzás
// siempre (o nunca). El riesgo tiene que depender de CUÁNTO estás adelantando, porque volver una
// fecha antes de lo previsto y volver seis fechas antes no son la misma imprudencia.
//
//   1 semana pendiente  -> 23%   apuesta razonable por una final
//   3 semanas           -> 45%   ya es jugarse la temporada
//   5 o más             -> 72%   (tope) casi seguro que te rompés de nuevo
//
// Con esto la pregunta deja de ser "¿fuerzo?" y pasa a ser "¿fuerzo AHORA o espero dos fechas más?",
// que es la decisión interesante.

import { ActiveInjury, InjuryType } from './types';

/**
 * EL CATÁLOGO DE LESIONES, con su rango de fechas de recuperación.
 *
 * Vive acá y no en App.tsx porque hay dos que necesitan leerlo: el juego, que sortea la lesión al
 * terminar un partido, y el banco de pruebas, que juega dieciséis temporadas para ver cuántas
 * lesiones deja una carrera. Copiarlo en el segundo sería la receta de siempre: dos fuentes
 * contestando la misma pregunta, y el día que una cambie el banco de pruebas mide otro juego.
 *
 * OJO CON EL SORTEO: el tipo se elige UNIFORME, así que una de cada cuatro lesiones es fractura. No
 * es un descuido -- es el dato que hay que tener a la vista antes de escribir cualquier regla que
 * dependa de "una lesión grave", porque graves hay muchas más de las que uno supone.
 */
export const TIPOS_DE_LESION: { id: InjuryType; label: string; minWeeks: number; maxWeeks: number; peso: number }[] = [
  { id: 'golpe', label: 'Golpe muscular leve', minWeeks: 1, maxWeeks: 2, peso: 0.46 },
  { id: 'muscular', label: 'Desgarro muscular', minWeeks: 2, maxWeeks: 5, peso: 0.37 },
  { id: 'ligamentos', label: 'Esguince de ligamentos', minWeeks: 4, maxWeeks: 8, peso: 0.13 },
  { id: 'fractura', label: 'Fractura', minWeeks: 8, maxWeeks: 16, peso: 0.04 },
];

/**
 * Elige el tipo de lesión respetando los pesos.
 *
 * ANTES SE ELEGÍA UNIFORME, y eso significaba que UNA DE CADA CUATRO lesiones era fractura -- de
 * ocho a dieciséis fechas afuera. Medido en el banco de pruebas: una carrera larga juntaba doce
 * fracturas. Un plantel entero de futbolistas reales no junta doce fracturas.
 *
 * Los pesos ordenan el catálogo como se ordena en el fútbol: casi todo son golpes y desgarros, el
 * esguince serio es raro, y la fractura es lo que le pasa a un jugador cada varios años.
 */
export function sortearTipoDeLesion(dado: number): typeof TIPOS_DE_LESION[number] {
  let r = dado;
  for (const t of TIPOS_DE_LESION) {
    if (r < t.peso) return t;
    r -= t.peso;
  }
  return TIPOS_DE_LESION[0];
}

/** Probabilidad de lesionarte en un partido jugado, antes de la fatiga y la dificultad. */
export const RIESGO_BASE_POR_PARTIDO = 0.02;
/** Cuánto suma cada partido seguido sin descansar. Jugar exhausto es lo que más pesa. */
export const RIESGO_POR_PARTIDO_SIN_DESCANSO = 0.015;
/**
 * TOPE DE LA FATIGA, y la razón por la que existe.
 *
 * Para TU club, todos los pasos del calendario son día de partido -- `fixturesAtStep` está indexado
 * por club, así que no hay "fecha libre" que reinicie el contador. Medido: 120 de 120 pasos de
 * Junior tienen partido. `matchesWithoutRest` sólo vuelve a cero si vos no jugás (banco, lesión,
 * suspensión o descanso), y entonces en una temporada corrida crecía sin techo:
 *
 *     10 partidos seguidos -> 17% de lesionarte por partido
 *     20 partidos seguidos -> 32%
 *
 * O sea que la segunda mitad de cualquier temporada larga terminaba en lesión casi segura. La
 * dirección estaba bien -- jugar exhausto tiene que pesar -- pero sin techo dejaba de ser un riesgo
 * y pasaba a ser un calendario.
 *
 * Con el tope, jugar reventado te lleva de 2% a 8% por partido: cuatro veces más peligroso, que es
 * mucho, y sigue siendo una minoría de los partidos.
 */
export const RIESGO_MAXIMO_POR_FATIGA = 0.06;

/** El riesgo de lesionarte en este partido, con la fatiga ya topeada. */
export function riesgoDeLesion(partidosSinDescanso: number, multiplicadorDeDificultad = 1): number {
  const fatiga = Math.min(RIESGO_MAXIMO_POR_FATIGA, Math.max(0, partidosSinDescanso) * RIESGO_POR_PARTIDO_SIN_DESCANSO);
  return (RIESGO_BASE_POR_PARTIDO + fatiga) * multiplicadorDeDificultad;
}

/** Piso del riesgo: incluso volviendo casi recuperado, algo se arriesga. */
export const RECAIDA_BASE = 0.12;
/** Cuánto suma cada semana de recuperación que te estás salteando. */
export const RECAIDA_POR_SEMANA = 0.11;
/** Tope. Ni la imprudencia más grande es una recaída garantizada -- a veces se zafa. */
export const RECAIDA_MAXIMA = 0.72;

/**
 * Cuánto se te cae cada atributo mientras jugás lesionado.
 *
 * Se compara contra el descuento por fatiga de temporada, que es 6 (ver FATIGUE_ATTR_PENALTY en
 * MatchSimulator). Este es MÁS ALTO a propósito: jugar roto tiene que pesar más que jugar cansado,
 * si no forzar la vuelta sería casi gratis y la decisión no tendría filo.
 */
export const PENALIDAD_ATRIBUTOS_LESIONADO = 9;

/** Energía extra que te cuesta el partido jugado con la lesión encima. */
export const PENALIDAD_ENERGIA_LESIONADO = 14;

/**
 * Probabilidad de recaer al jugar un partido con `weeksRemaining` semanas todavía pendientes.
 *
 * Se llama una vez por partido jugado forzando, en handleFinishMatch.
 */
export function riesgoDeRecaida(weeksRemaining: number): number {
  const semanas = Math.max(0, weeksRemaining);
  return Math.min(RECAIDA_MAXIMA, RECAIDA_BASE + semanas * RECAIDA_POR_SEMANA);
}

/**
 * ¿Estás jugando CON la lesión encima?
 *
 * Es la única condición que deja pasar las dos puertas al partido con una lesión activa, así que
 * vive acá y no duplicada: si alguna de las dos puertas se olvidara de consultarla, el jugador
 * quedaría encerrado (no puede jugar y no puede descansar) o jugaría gratis sin riesgo.
 */
export function forzandoLaVuelta(perfil: { activeInjury?: ActiveInjury | null }): boolean {
  const lesion = perfil.activeInjury;
  return !!lesion && lesion.weeksRemaining > 0 && lesion.treatmentChoice === 'forzar';
}

/**
 * ¿La lesión te impide jugar esta fecha?
 *
 * El complemento exacto de la puerta: hay lesión activa Y no elegiste forzar. Se usa en
 * handleAdvanceWeek y en startMatchflow para que las dos decidan con el MISMO criterio -- que estén
 * desalineadas es justamente lo que dejaría al jugador encerrado.
 */
export function lesionTeDejaAfuera(perfil: { activeInjury?: ActiveInjury | null }): boolean {
  const lesion = perfil.activeInjury;
  return !!lesion && lesion.weeksRemaining > 0 && !forzandoLaVuelta(perfil);
}

/**
 * LOS ARQUEROS DEL MUNDO NO SE LESIONAN, Y HOY ESO SALE GRATIS.
 *
 * Decisión tomada el 20 de agosto de 2026, anotada acá porque es donde alguien la va a buscar.
 *
 * Hay 14 clubes (de 571 con plantel jugable) que tienen UN SOLO arquero. Si el juego lesionara a los
 * jugadores del plantel, esos clubes se quedarían sin nadie bajo los tres palos, así que se pidió
 * que ningún arquero se lesione -- salvo el propio jugador, si su carrera es de arquero.
 *
 * NO HIZO FALTA ESCRIBIR NADA: hoy `activeInjury` vive únicamente en PlayerProfile. El juego no
 * lesiona a nadie más que a vos, ni arquero ni de campo. La regla ya se cumple por construcción.
 *
 * SI ALGUNA VEZ SE AGREGAN LESIONES A LOS DEMÁS, esta es la regla que tiene que venir con ellas:
 * los arqueros quedan afuera del sorteo, y el único que puede lesionarse atajando es el jugador.
 * Ponerla después, cuando ya aparezca el club sin arqueros, es llegar tarde.
 */
export const LOS_ARQUEROS_DEL_MUNDO_NO_SE_LESIONAN = true;
