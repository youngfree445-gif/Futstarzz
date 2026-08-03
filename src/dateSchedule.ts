// Calendario por FECHAS REALES: qué juega un club cada día, en vez de cada semana.
//
// El motor viejo modelaba el tiempo en semanas y permitía UN partido por semana. Con eso la liga
// disponía de ~31 de las 52 semanas del año (isCupWeek se quedaba con 2 de cada 5), pero la liga
// colombiana necesita 40 fechas por año entre Apertura y Clausura. Faltaban ~9: por eso la tabla se
// congelaba y las copas no cerraban.
//
// Los datos reales lo confirman: en los 20 clubes de Colombia hay 253 semanas con 2+ partidos y
// picos de 4 (liga el domingo, Libertadores el jueves). Ninguno de esos partidos entraba.
//
// Acá la unidad es el DÍA. Cada partido está anclado a su fecha, y una misma semana puede tener
// tantos partidos como tenga en la realidad.

import { DATED_CALENDARS, type DatedCompetition, type DatedMatch } from './realCalendarDates';

export interface DatedFixture {
  competition: DatedCompetition;
  match: DatedMatch;
  date: string;      // YYYY-MM-DD
  isHome: boolean;
  opponentName: string;
}

/** Día 1 de la carrera. Coincide con el arranque real de la temporada 2026. */
export const CAREER_START_DATE = '2026-01-12';

const MS_POR_DIA = 86_400_000;

/** Fecha (YYYY-MM-DD) del día N de carrera. day=1 es CAREER_START_DATE. */
export function dateForDay(day: number): string {
  const base = Date.parse(`${CAREER_START_DATE}T00:00:00Z`);
  return new Date(base + (day - 1) * MS_POR_DIA).toISOString().slice(0, 10);
}

/** Día de carrera de una fecha. Inverso de dateForDay. */
export function dayForDate(date: string): number {
  const base = Date.parse(`${CAREER_START_DATE}T00:00:00Z`);
  return Math.round((Date.parse(`${date}T00:00:00Z`) - base) / MS_POR_DIA) + 1;
}

// Índice club -> partidos, ordenados por fecha. Se arma una sola vez: recorrer los 504 partidos en
// cada avance de día se nota en móvil.
let indice: Map<string, DatedFixture[]> | null = null;

function getIndice(): Map<string, DatedFixture[]> {
  if (indice) return indice;
  indice = new Map();

  const agregar = (club: string, fx: DatedFixture) => {
    const lista = indice!.get(club);
    if (lista) lista.push(fx);
    else indice!.set(club, [fx]);
  };

  for (const comp of DATED_CALENDARS) {
    for (const match of comp.matches) {
      agregar(match.home, { competition: comp, match, date: match.date, isHome: true, opponentName: match.away });
      agregar(match.away, { competition: comp, match, date: match.date, isHome: false, opponentName: match.home });
    }
  }
  for (const lista of indice.values()) lista.sort((a, b) => a.date.localeCompare(b.date));
  return indice;
}

/** ¿Este club tiene calendario con fechas reales? */
export function hasDatedSchedule(clubName: string): boolean {
  return (getIndice().get(clubName)?.length ?? 0) > 0;
}

/** Todos los partidos del club, en orden cronológico. */
export function fixturesForClub(clubName: string): DatedFixture[] {
  return getIndice().get(clubName) ?? [];
}

/**
 * Los partidos de un club en un día concreto.
 *
 * Casi siempre es 0 o 1, pero se devuelve lista porque nada impide que un club tenga dos partidos
 * el mismo día en los datos, y descartar en silencio es peor que mostrarlos.
 */
export function fixturesOnDate(clubName: string, date: string): DatedFixture[] {
  return fixturesForClub(clubName).filter(f => f.date === date);
}

/** El próximo partido del club en o después de `date`. */
export function nextFixture(clubName: string, date: string): DatedFixture | null {
  return fixturesForClub(clubName).find(f => f.date >= date) ?? null;
}

/** Partidos del club dentro de un rango de fechas, inclusive. */
export function fixturesBetween(clubName: string, desde: string, hasta: string): DatedFixture[] {
  return fixturesForClub(clubName).filter(f => f.date >= desde && f.date <= hasta);
}

/**
 * Cuántos días hay que avanzar desde `date` para llegar al próximo partido del club.
 *
 * Es lo que reemplaza al "avanzar una semana": en vez de saltar 7 días fijos, se salta hasta el
 * siguiente partido real. Devuelve null si el club ya no tiene más partidos.
 */
export function daysUntilNextFixture(clubName: string, date: string): number | null {
  const prox = nextFixture(clubName, date);
  if (!prox) return null;
  return dayForDate(prox.date) - dayForDate(date);
}

/**
 * El paso de carrera en el que cae una fecha de este club, o null si no juega ese día.
 *
 * Sirve para saber si un partido del calendario ya se jugó: su paso es menor al actual.
 */
export function pasoDeFecha(clubName: string, date: string): number | null {
  const fechas: string[] = [];
  for (const f of fixturesForClub(clubName)) if (fechas[fechas.length - 1] !== f.date) fechas.push(f.date);
  const i = fechas.indexOf(date);
  return i < 0 ? null : i + 1;
}

/**
 * En Colombia y Argentina el año tiene DOS torneos de liga, no uno: el Apertura (enero a junio) y
 * el Clausura (julio a noviembre), cada uno con su campeón. Decir solo "Primera División" deja al
 * jugador sin saber cuál está jugando ni cuál puede ganar.
 *
 * El corte sale de las fechas reales: entre el último partido del Apertura (8 de junio) y el
 * primero del Clausura (24 de julio) hay un parón de 46 días.
 */
export function torneoDeFecha(competition: DatedCompetition, date: string): string {
  if (competition.kind !== 'league') return competition.name;
  const mes = Number(date.slice(5, 7));
  return mes <= 6 ? 'Apertura' : 'Clausura';
}

/**
 * ¿Con este partido el club cierra su torneo de liga?
 *
 * En las ligas de Apertura/Clausura hay DOS cierres por año, no uno: el último partido de junio
 * corona el Apertura y el de noviembre el Clausura. Sin esto el campeón salía de `fixtures` del
 * motor, que tiene su propio calendario más corto (20 partidos contra los 44 reales del Nacional)
 * y nunca coincidía con el cierre real -- se terminaba el Apertura ganando todo y no se coronaba
 * a nadie.
 *
 * En las ligas de temporada corrida devuelve true solo en el último partido del año.
 */
export function esUltimaFechaDelTorneo(clubName: string, date: string): boolean {
  const deLiga = fixturesForClub(clubName).filter(f => f.competition.kind === 'league');
  if (!deLiga.length) return false;

  const esteFixture = deLiga.find(f => f.date === date);
  if (!esteFixture) return false;

  const torneo = torneoDeFecha(esteFixture.competition, date);
  const mismos = deLiga.filter(f => torneoDeFecha(f.competition, f.date) === torneo);
  return mismos[mismos.length - 1]?.date === date;
}

/** El torneo de liga que el club juega en esa fecha ('Apertura', 'Clausura' o el nombre de la liga). */
export function torneoDelClubEnFecha(clubName: string, date: string): string | null {
  const f = fixturesForClub(clubName).find(x => x.date === date && x.competition.kind === 'league');
  return f ? torneoDeFecha(f.competition, date) : null;
}

/** Un partido cuya ronda es la final del torneo. Las rondas vienen del calendario importado. */
function esRondaFinal(round: string | undefined): boolean {
  if (!round) return false;
  const r = round.toLowerCase();
  // "Final (Vuelta)" cuenta; "Semifinal" y "Cuartos de Final" NO -- de ahí el \b y el descarte
  // explícito de semi, que contiene la palabra "final" adentro.
  if (/semi|cuartos|octavos|dieciseisavos|ronda/.test(r)) return false;
  return /\bfinal\b/.test(r);
}

/**
 * ¿Este partido corona al campeón de esa copa?
 *
 * El motor no lleva las llaves de las copas del calendario real, así que no hay bracket que
 * consultar: hay que deducirlo del propio calendario. Se exige que el partido sea **la final**,
 * identificada por el nombre de la ronda que trae el calendario importado.
 *
 * ANTES alcanzaba con que fuera tu ÚLTIMO partido de la copa, y eso coronaba campeones falsos: la
 * Copa Libertadores del juego son 34 partidos de fase de grupos, sin una sola llave cargada, así
 * que el último partido del grupo pasaba por final y ganarlo te daba la copa. Igual la Copa BetPlay
 * y la Copa do Brasil. Solo las copas con rondas nombradas (Copa del Rey, FA Cup, DFB-Pokal,
 * Coppa Italia, EFL) pueden coronar, y solo en la ronda que se llama "Final".
 *
 * Con ida y vuelta marca solo la VUELTA, que es donde se define.
 */
export function esUltimoPartidoDeLaCopa(clubName: string, competitionId: string, date: string): boolean {
  const delTorneo = fixturesForClub(clubName).filter(f => f.competition.id === competitionId);
  if (!delTorneo.length) return false;

  const finales = delTorneo.filter(f => esRondaFinal(f.match.round));
  // Sin rondas nombradas no se puede saber si hubo final: no se corona a nadie. Es preferible
  // quedarse sin campeón a inventar uno por ganar un partido de grupos.
  if (!finales.length) return false;

  // La ida de la final no corona: solo la última.
  return finales[finales.length - 1].date === date;
}

/** Todas las competiciones en las que participa el club. */
export function competitionsForClub(clubName: string): DatedCompetition[] {
  const vistas = new Map<string, DatedCompetition>();
  for (const f of fixturesForClub(clubName)) vistas.set(f.competition.id, f.competition);
  return [...vistas.values()];
}

// Prioridad cuando hay varios partidos el mismo día: una final continental pesa más que una fecha
// de liga.
const PRIORIDAD: Record<string, number> = {
  national_tournament: 4,
  continental_cup: 3,
  domestic_cup: 2,
  league: 1,
};

/** Si hay más de un partido el mismo día, cuál se le muestra al jugador. */
export function pickPrimary(fixtures: DatedFixture[]): DatedFixture | null {
  if (!fixtures.length) return null;
  return [...fixtures].sort(
    (a, b) => (PRIORIDAD[b.competition.kind] ?? 0) - (PRIORIDAD[a.competition.kind] ?? 0),
  )[0];
}

/**
 * Lo que le toca jugar al club en el paso N de su carrera.
 *
 * Un "paso" es una FECHA con partido, no una semana. Ésa es toda la diferencia con el motor viejo:
 * si el club juega liga el domingo y copa el jueves, son dos pasos distintos en vez de una sola
 * semana donde uno de los dos se perdía.
 *
 * Devuelve null cuando el club ya agotó su calendario real; el motor sigue avanzando por su cuenta.
 */
export function fixturesAtStep(clubName: string, step: number): { date: string; fixtures: DatedFixture[] } | null {
  const todas = fixturesForClub(clubName);
  if (!todas.length) return null;

  // Fechas distintas, en orden: dos partidos el mismo día cuentan como un solo paso.
  const fechas: string[] = [];
  for (const f of todas) if (fechas[fechas.length - 1] !== f.date) fechas.push(f.date);

  const date = fechas[step - 1];
  if (!date) return null;
  return { date, fixtures: todas.filter(f => f.date === date) };
}
