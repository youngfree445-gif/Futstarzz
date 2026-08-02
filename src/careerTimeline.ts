// La línea de tiempo de la carrera, anclada a FECHAS REALES.
//
// El motor viejo trataba `currentWeek` como "semanas de 7 días corridos" y dejaba jugar un partido
// por semana. Medido sobre el calendario real: de 1008 partidos solo entraban 743 -- se perdía el
// 26,3%, y Santa Fe perdía 22 de 55. Por eso la tabla se congelaba y las copas no cerraban.
//
// La causa es que en el fútbol de verdad se juega liga el domingo y copa el jueves de la MISMA
// semana. En los 20 clubes de Colombia hay 253 semanas con 2+ partidos, con picos de 4.
//
// Este módulo invierte la relación: en vez de derivar la fecha desde la semana (getRealDate), cada
// paso de carrera es una FECHA del calendario real, y la "semana" se deriva de ella. Así los 153
// usos de currentWeek repartidos por el código siguen funcionando -- ven un número que crece de a
// uno, como siempre -- pero cada paso ya no significa "7 días", sino "la próxima fecha con
// partido", que es lo que permite meter los 265 partidos que antes no entraban.

import { CAREER_START_DATE, dateForDay, dayForDate, fixturesForClub } from './dateSchedule';

/** Días de calendario que dura una temporada. Un año redondo. */
export const SEASON_LENGTH_DAYS = 365;

/**
 * Las fechas en las que ESTE club juega, en orden. Cada una es un "paso" de la carrera.
 *
 * Se agrupan los partidos por fecha y no uno por uno porque un club puede tener dos partidos el
 * mismo día en los datos; en ese caso el día es un solo paso y el motor resuelve los dos.
 */
export function matchDatesForClub(clubName: string): string[] {
  const vistas = new Set<string>();
  for (const f of fixturesForClub(clubName)) vistas.add(f.date);
  return [...vistas].sort();
}

/**
 * La fecha del paso `step` de la carrera para este club. step=1 es el primer partido.
 *
 * Cuando se acaban los partidos del calendario real (el club ya jugó su temporada entera) se sigue
 * avanzando de a 7 días desde el último: el motor tiene que poder seguir corriendo -- mercado de
 * pases, entrenamiento, temporada siguiente -- aunque no haya más fechas cargadas.
 */
export function dateForStep(clubName: string, step: number): string {
  const fechas = matchDatesForClub(clubName);
  if (step <= fechas.length) return fechas[step - 1] ?? CAREER_START_DATE;

  const ultima = fechas[fechas.length - 1] ?? CAREER_START_DATE;
  const sobrantes = step - fechas.length;
  return dateForDay(dayForDate(ultima) + sobrantes * 7);
}

/** Cuántos pasos (fechas con partido) tiene el calendario real de este club. */
export function totalStepsForClub(clubName: string): number {
  return matchDatesForClub(clubName).length;
}

/**
 * La semana de calendario en la que cae un paso, contando desde el arranque de la carrera.
 *
 * Es lo que reemplaza a `currentWeek` para todo lo que de verdad necesita pensar en semanas
 * (sueldos, energía, eventos de vestuario): dos partidos de la misma semana real devuelven el mismo
 * número, que es justamente lo que antes era imposible de representar.
 */
export function calendarWeekOfStep(clubName: string, step: number): number {
  return Math.floor((dayForDate(dateForStep(clubName, step)) - 1) / 7) + 1;
}

/** El año de carrera (1, 2, 3...) en el que cae un paso. */
export function seasonOfStep(clubName: string, step: number): number {
  return Math.floor((dayForDate(dateForStep(clubName, step)) - 1) / SEASON_LENGTH_DAYS) + 1;
}

/** ¿Este paso cae en la misma semana real que el anterior? (o sea: se juega dos veces en la semana) */
export function isSameCalendarWeekAsPrevious(clubName: string, step: number): boolean {
  if (step <= 1) return false;
  return calendarWeekOfStep(clubName, step) === calendarWeekOfStep(clubName, step - 1);
}

const MESES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const DIAS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** "jueves 7 de mayo de 2026" -- para mostrar la fecha del partido en pantalla. */
export function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${DIAS_ES[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES_ES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

/** "7 may" -- versión corta para las celdas del calendario. */
export function formatDateShort(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${d.getUTCDate()} ${MESES_ES[d.getUTCMonth()].slice(0, 3)}`;
}
