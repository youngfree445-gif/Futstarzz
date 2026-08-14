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

import { ActiveInjury } from './types';

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
