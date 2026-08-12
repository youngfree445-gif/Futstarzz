// Qué clubes existen de verdad dentro de una carrera.
//
// ---------------------------------------------------------------------------------------------
// LA DECISIÓN (12 de agosto de 2026): UN SOLO CALENDARIO.
// ---------------------------------------------------------------------------------------------
//
// La base tiene 1103 clubes y sólo 425 con calendario de FECHAS reales. Para los otros 678 corría
// un motor paralelo que repartía los partidos por SEMANAS, con su propio reloj. De esa convivencia
// salieron casi todos los bugs de calendario del proyecto, y siempre el mismo: el número que
// cuenta los pasos de la carrera se leía como "la N-ésima fecha que jugás" en un lado y como
// "semana N, 52 por año" en el otro. Ejemplos medidos, todos la misma línea:
//
//   - El Junior juega 63 fechas en 2026. Pasada la 52, getSeasonYear decía "temporada 2" y la clave
//     de la copa cambiaba en medio de la edición: el cuadro se reiniciaba solo.
//   - En el paso 18 de su calendario, cupWeeksElapsedInYear decía "van 10 pasos de copa": el motor
//     le jugaba la fase de grupos de Libertadores entera de fondo y el jugador ganaba su primer
//     partido para enterarse enseguida de que estaba "eliminado en octavos".
//
// Mientras existan dos formas de contar el tiempo van a seguir apareciendo. Así que se elige una:
// el calendario con fechas. Y los clubes que no lo tienen dejan de ser jugables.
//
// NO se borran de data.ts. Siguen ahí para el día que se carguen sus calendarios, y 31 de ellos se
// usan igual como RIVALES de Champions, Europa League y Libertadores -- Brugge, Olympiacos,
// Galatasaray, Salzburg y compañía juegan sus copas contra vos sin necesidad de tener liga propia.
// Lo único que no pueden es ser TU club, ni aparecer en una tabla de liga que no juegan.

import type { Club } from './types';
import { ULTIMATE_CLUBS_DATABASE } from './data';
import { tieneLigaConFechasReales } from './dateSchedule';
import { leagueKeyFor } from './leagueEngine';

/**
 * ¿Podés hacer una carrera en este club?
 *
 * El criterio es uno solo y no admite excepciones: que su liga tenga fechas reales cargadas. Todo
 * lo demás -- ofertas del mercado, descensos, ascensos, el club inicial -- se filtra con esto, para
 * que sea imposible terminar en un club que el calendario no sabe hacer jugar.
 */
export function esClubJugable(club: Club): boolean {
  return tieneLigaConFechasReales(club.name);
}

let cacheJugables: Club[] | null = null;

/** Todos los clubes en los que se puede hacer carrera. */
export function clubesJugables(): Club[] {
  if (!cacheJugables) cacheJugables = ULTIMATE_CLUBS_DATABASE.filter(esClubJugable);
  return cacheJugables;
}

const cachePorLiga = new Map<string, Club[]>();

/**
 * Los clubes que arman la TABLA de una liga.
 *
 * No es lo mismo que "los clubes de la base con esa liga y esa división". Hay tres ligas a las que
 * les falta calendario para un puñado de clubes -- Peruana 17 de 19, Ecuatoriana 16 de 17,
 * Portuguesa 15 de 16 -- y esos cuatro sueltos figuraban en la tabla sin jugar nunca: se quedaban
 * clavados en cero puntos toda la temporada, ocupando un puesto y hundiendo el promedio de
 * descenso de los demás. La tabla tiene que tener exactamente a los que el calendario hace jugar.
 */
export function clubesDeLiga(leagueKey: string): Club[] {
  const cacheado = cachePorLiga.get(leagueKey);
  if (cacheado) return cacheado;
  const lista = ULTIMATE_CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey && esClubJugable(c));
  cachePorLiga.set(leagueKey, lista);
  return lista;
}

/**
 * ¿Esta liga+división se puede jugar entera?
 *
 * Sirve para el ascenso y el descenso: bajar a una división que no tiene calendario dejaría al
 * jugador dentro del motor que estamos sacando. Si la de abajo no existe con fechas, no hay
 * descenso posible y el club se queda donde está.
 */
export function ligaTieneCalendario(leagueKey: string): boolean {
  return clubesDeLiga(leagueKey).length > 0;
}
