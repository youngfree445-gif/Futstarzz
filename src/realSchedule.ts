// Qué le toca jugar a un club en una semana de carrera, según el calendario REAL importado.
//
// Reemplaza el reparto aritmético del motor viejo (`isCupWeek(week) = week % N`), donde todas las
// copas compartían un cupo global de semanas. Ese cupo era la causa de que Champions y Europa
// necesitaran ~22 pasos y solo hubiera 9-17 disponibles: tardaban 2,4 temporadas en coronar campeón
// y quedaban desfasadas de la liga.
//
// Acá cada competición tiene SUS semanas, tomadas de las fechas de Transfermarkt: la Champions
// ocupa sus 16 semanas reales sin quitarle ninguna a la liga, porque en la realidad se juegan entre
// semana y no compiten por la misma fecha.

import { REAL_CALENDARS, type RealCompetition, type RealMatch } from './realCalendar';
import { SEASON_LENGTH_WEEKS } from './leagueEngine';
import { nombreEnCalendario, nombreMostrable } from './clubAliases';

export interface ScheduledMatch {
  competition: RealCompetition;
  match: RealMatch;
  isHome: boolean;
  opponentName: string;
}

/** Semana dentro de la temporada en curso: 1..SEASON_LENGTH_WEEKS. */
export function weekInSeason(currentWeek: number): number {
  return ((currentWeek - 1) % SEASON_LENGTH_WEEKS) + 1;
}


// Índice club -> competiciones en las que participa. Se arma una sola vez: recorrer 9.331 partidos
// en cada avance de semana sería caro y se nota en móvil.
let indice: Map<string, RealCompetition[]> | null = null;

function getIndice(): Map<string, RealCompetition[]> {
  if (indice) return indice;
  indice = new Map();
  for (const comp of REAL_CALENDARS) {
    const clubes = new Set<string>();
    for (const m of comp.matches) {
      clubes.add(m.home);
      clubes.add(m.away);
    }
    for (const c of clubes) {
      const lista = indice.get(c);
      if (lista) lista.push(comp);
      else indice.set(c, [comp]);
    }
  }
  return indice;
}

/** Competiciones con calendario real en las que participa este club. */
export function competitionsForClub(clubName: string): RealCompetition[] {
  return getIndice().get(nombreEnCalendario(clubName)) ?? [];
}

/**
 * Partidos que le tocan a un club esta semana de carrera.
 *
 * Puede devolver MÁS DE UNO: en la realidad se juega liga el fin de semana y copa entre semana. El
 * llamador decide cuál mostrar (ver pickPrimary) y cuáles resolver de fondo.
 */
export function matchesThisWeek(clubName: string, currentWeek: number): ScheduledMatch[] {
  const w = weekInSeason(currentWeek);
  const out: ScheduledMatch[] = [];
  // Los partidos traen el nombre tal como figura en el calendario, no el corto de data.ts.
  const nombreCal = nombreEnCalendario(clubName);

  for (const comp of competitionsForClub(clubName)) {
    // La semana de la competición es directamente la semana de la temporada: cada torneo ocupa sus
    // semanas reales dentro del año y las que sobran quedan sin partido, como en la realidad
    // (parones, vacaciones, fechas FIFA).
    //
    // NO se cicla con módulo: hacerlo repetía el calendario dentro de la misma temporada -- una
    // liga de 41 semanas volvía a arrancar en la 42 y el club terminaba jugando 48 fechas de las 38
    // que tiene LaLiga.
    if (w > comp.weeks) continue;
    const wComp = w;
    for (const m of comp.matches) {
      if (m.w !== wComp) continue;
      if (m.home === nombreCal) out.push({ competition: comp, match: m, isHome: true, opponentName: nombreMostrable(m.away) });
      else if (m.away === nombreCal) out.push({ competition: comp, match: m, isHome: false, opponentName: nombreMostrable(m.home) });
    }
  }
  return out;
}

// Prioridad cuando hay varios partidos la misma semana. Una eliminatoria continental pesa más que
// una fecha de liga: es lo que el jugador querría jugar.
const PRIORIDAD: Record<string, number> = {
  national_tournament: 5,
  qualifier: 4,
  continental_cup: 3,
  domestic_cup: 2,
  league: 1,
};

/** El partido que se le muestra al jugador; el resto se resuelve de fondo. */
export function pickPrimary(matches: ScheduledMatch[]): ScheduledMatch | null {
  if (!matches.length) return null;
  return [...matches].sort((a, b) => {
    const pa = PRIORIDAD[a.competition.kind] ?? 0;
    const pb = PRIORIDAD[b.competition.kind] ?? 0;
    if (pa !== pb) return pb - pa;
    // A igual prioridad, la ronda más avanzada primero (una final antes que una fecha de grupos).
    return rondaPeso(b.match.round) - rondaPeso(a.match.round);
  })[0];
}

function rondaPeso(round: string): number {
  const r = round.toLowerCase();
  if (/quarter|cuartos/.test(r)) return 3;
  if (/semi/.test(r)) return 4;
  if (/final/.test(r)) return 5;
  if (/last 16|round of|octavos/.test(r)) return 2;
  return 1;
}

/** ¿Este club tiene calendario real, o hay que caer al motor generado? */
export function hasRealSchedule(clubName: string): boolean {
  return competitionsForClub(clubName).length > 0;
}
