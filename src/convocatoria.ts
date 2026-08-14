// LA LISTA DE CONVOCADOS.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// La convocatoria a la selección YA FUNCIONABA, y era completamente muda.
//
// La regla vivía suelta adentro de `startMatchflow` (App.tsx) y se evaluaba en el instante mismo de
// arrancar el partido. Si dabas el corte, aparecía un partido de eliminatorias sin aviso previo. Si
// no lo dabas, no pasaba absolutamente NADA: ni te enterabas de que había habido fecha FIFA, ni de
// que habías quedado afuera, ni de qué te faltaba para entrar.
//
// Osea que el mayor premio de la carrera -- que te llame tu selección -- entraba y salía en silencio.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ LA REGLA SE MUDA ACÁ EN VEZ DE COPIARSE
// ---------------------------------------------------------------------------------------------
//
// Ahora hay DOS lugares que necesitan saber si estás convocado: el que lo anuncia (el feed, antes de
// la fecha) y el que lo ejecuta (startMatchflow, el día del partido).
//
// Si cada uno tuviera su copia de la condición, tarde o temprano se desincronizan -- y el resultado
// sería peor que el silencio de antes: el diario te pone en la lista y después el juego no te lleva,
// o al revés. Un anuncio que miente rompe más confianza que un anuncio que falta.
//
// Por eso la condición vive UNA sola vez, acá, y App.tsx la consume. Es la misma lección de
// src/lesion.ts con las dos puertas al partido.
//
// ---------------------------------------------------------------------------------------------
// DE DÓNDE SALEN LOS NOMBRES DE LA NÓMINA
// ---------------------------------------------------------------------------------------------
//
// De la base, no inventados. Cada selección de ALL_NATIONAL_TEAMS_DATABASE trae sus `starPlayers`
// reales y su `dt` real (Italia: Donnarumma, Barella, Dimarco, Tonali, Retegui, con Gattuso de
// técnico). La lista muestra ESOS y a vos -- no rellena hasta 23 con nombres falsos.
//
// Es una lista corta y verdadera en vez de una larga y falsa, que es la misma decisión que se tomó
// con los periodistas de ChutSocial.

import { PlayerProfile, Club } from './types';
import { NATIONALITY_TO_WORLD_CUP_TEAM_ID, ALL_NATIONAL_TEAMS_DATABASE } from './data';
import { CONFEDERACION_POR_SELECCION, esJugable } from './eliminatorias';
import { cicloDeEliminatorias } from './dateSchedule';
import { ELIMINATORIAS_CALLUP_PRESTIGE_THRESHOLD, ELIMINATORIAS_CALLUP_MIN_MATCHES } from './leagueEngine';

/** Todo lo que se sabe de tu situación con la selección en un momento dado. */
export interface EstadoDeConvocatoria {
  /** Tu selección, si el juego la modela. null si tu nacionalidad no mapea a ninguna. */
  seleccion: Club | null;
  /**
   * ¿Tu selección disputa eliminatorias jugables? Sólo tres confederaciones se juegan partido a
   * partido; las demás clasifican por fuerza y no tienen fecha que anunciar (ver eliminatorias.ts).
   */
  hayEliminatorias: boolean;
  /** ¿Entrás en la lista? */
  convocado: boolean;
  /** Cuánto prestigio te falta para el corte. 0 si ya lo tenés. */
  faltaPrestigio: number;
  /** Cuántos partidos de carrera te faltan para el corte. 0 si ya los tenés. */
  faltaPartidos: number;
}

/**
 * La regla de convocatoria, en un solo lugar.
 *
 * `anio` es el año de carrera (ver anioDeCarrera en dateSchedule), y hace falta porque la
 * convocatoria sólo existe dentro de un ciclo de eliminatorias abierto.
 */
export function evaluarConvocatoria(perfil: PlayerProfile, anio: number): EstadoDeConvocatoria {
  const teamId = NATIONALITY_TO_WORLD_CUP_TEAM_ID[perfil.nationality];
  const seleccion = teamId ? ALL_NATIONAL_TEAMS_DATABASE.find(t => t.id === teamId) ?? null : null;
  const conf = teamId ? CONFEDERACION_POR_SELECCION[teamId] : undefined;
  const ciclo = cicloDeEliminatorias(anio);

  const hayEliminatorias = !!teamId && !!conf && esJugable(conf) && !!ciclo;

  const faltaPrestigio = Math.max(0, ELIMINATORIAS_CALLUP_PRESTIGE_THRESHOLD - perfil.prestige);
  const faltaPartidos = Math.max(0, ELIMINATORIAS_CALLUP_MIN_MATCHES - perfil.careerStats.partidosHistoricos);

  return {
    seleccion,
    hayEliminatorias,
    convocado: hayEliminatorias && faltaPrestigio === 0 && faltaPartidos === 0,
    faltaPrestigio,
    faltaPartidos,
  };
}

/**
 * Por qué NO estás en la lista, en una frase.
 *
 * Que te dejen afuera duele; que te dejen afuera sin decirte por qué se lee como un bug. Y como los
 * dos cortes son cosas que el jugador PUEDE mover -- prestigio y partidos jugados --, decirlo
 * convierte la ausencia en un objetivo en vez de un muro.
 *
 * Devuelve null si estás convocado (no hay nada que explicar).
 */
export function motivoDeAusencia(estado: EstadoDeConvocatoria): string | null {
  if (estado.convocado) return null;
  if (!estado.seleccion) return 'Tu nacionalidad no tiene selección modelada en el juego.';
  if (!estado.hayEliminatorias) return `${estado.seleccion.name} no disputa eliminatorias jugables en este ciclo.`;

  const faltas: string[] = [];
  if (estado.faltaPrestigio > 0) faltas.push(`${estado.faltaPrestigio} de prestigio`);
  if (estado.faltaPartidos > 0) faltas.push(`${estado.faltaPartidos} partido(s) de carrera`);
  return `Te falta ${faltas.join(' y ')} para entrar en los planes del DT.`;
}

/**
 * La nómina: los nombres reales que el juego conoce de esa selección, con vos adentro si entrás.
 *
 * No se rellena hasta 23. La base tiene 5 figuras por selección y son de verdad -- una lista corta y
 * verdadera vale más que una larga con nombres inventados.
 */
export function laNomina(
  estado: EstadoDeConvocatoria,
  nombreDelJugador: string,
): { nombre: string; esVos: boolean }[] {
  if (!estado.seleccion) return [];
  const figuras = (estado.seleccion.starPlayers ?? [])
    .filter(n => n !== nombreDelJugador)
    .map(nombre => ({ nombre, esVos: false }));
  return estado.convocado
    ? [{ nombre: nombreDelJugador, esVos: true }, ...figuras]
    : figuras;
}
