import { Club, Fixture, LeagueSeasonState, TableTeam } from './types';

// Semanas de carrera por temporada (incluye semanas de Copa). Fija e igual
// para TODAS las ligas, sin importar cuántos equipos tenga cada una —
// esto es lo que permite sincronizar copas continentales y el ciclo de
// 4 años de los torneos de selecciones más adelante.
export const SEASON_LENGTH_WEEKS = 38;

export function isCupWeek(week: number): boolean {
  return week % 3 === 0;
}

export function leagueKeyFor(club: Club): string {
  return `${club.league}-${club.division ?? 1}`;
}

export function getSeasonYear(currentWeek: number): number {
  return Math.floor((currentWeek - 1) / SEASON_LENGTH_WEEKS) + 1;
}

function getSeasonStartWeek(currentWeek: number): number {
  return (getSeasonYear(currentWeek) - 1) * SEASON_LENGTH_WEEKS + 1;
}

// Cuántas fechas de LIGA (no de Copa) ya pasaron desde el arranque de la
// temporada actual hasta antes de currentWeek.
export function leagueMatchweeksElapsed(currentWeek: number): number {
  const start = getSeasonStartWeek(currentWeek);
  let count = 0;
  for (let w = start; w < currentWeek; w++) {
    if (!isCupWeek(w)) count++;
  }
  return count;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Genera UNA vuelta ida-y-vuelta completa (método del círculo) para el
// conjunto de clubIds dado, con matchweek arrancando en 1.
function generateRoundRobin(clubIds: string[]): Fixture[] {
  const teams = clubIds.length % 2 === 0 ? [...clubIds] : [...clubIds, '__BYE__'];
  const n = teams.length;
  const rounds: [string, string][][] = [];
  let arr = [...teams];

  for (let round = 0; round < n - 1; round++) {
    const pairs: [string, string][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (a !== '__BYE__' && b !== '__BYE__') {
        pairs.push(round % 2 === 0 ? [a, b] : [b, a]);
      }
    }
    rounds.push(pairs);
    arr = [arr[0], arr[arr.length - 1], ...arr.slice(1, arr.length - 1)];
  }

  const fixtures: Fixture[] = [];
  let matchweek = 1;
  for (const pairs of rounds) {
    for (const [home, away] of pairs) {
      fixtures.push({ matchweek, homeTeamId: home, awayTeamId: away, played: false, homeGoals: null, awayGoals: null });
    }
    matchweek++;
  }
  for (const pairs of rounds) {
    for (const [home, away] of pairs) {
      fixtures.push({ matchweek, homeTeamId: away, awayTeamId: home, played: false, homeGoals: null, awayGoals: null });
    }
    matchweek++;
  }
  return fixtures;
}

// Extiende (sin mutar) el fixture agregando vueltas nuevas hasta cubrir
// requiredMatchweeks. Ligas cortas que agotan su vuelta antes de llegar
// a SEASON_LENGTH_WEEKS simplemente arrancan una vuelta nueva.
function ensureFixturesUpTo(fixtures: Fixture[], requiredMatchweeks: number, clubIds: string[]): { fixtures: Fixture[]; roundsAdded: number } {
  let result = fixtures;
  let roundsAdded = 0;
  while (result.length === 0 || result[result.length - 1].matchweek < requiredMatchweeks) {
    const startWeek = result.length > 0 ? result[result.length - 1].matchweek + 1 : 1;
    const newRound = generateRoundRobin(shuffle(clubIds)).map(f => ({ ...f, matchweek: f.matchweek - 1 + startWeek }));
    result = [...result, ...newRound];
    roundsAdded++;
  }
  return { fixtures: result, roundsAdded };
}

function buildInitialTable(clubs: Club[]): TableTeam[] {
  return clubs.map(c => ({ clubId: c.id, name: c.name, puntos: 0, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 }));
}

function applyResultToTable(table: TableTeam[], homeId: string, awayId: string, homeGoals: number, awayGoals: number): TableTeam[] {
  return table.map(row => {
    if (row.clubId !== homeId && row.clubId !== awayId) return row;
    const isHomeRow = row.clubId === homeId;
    const goalsFor = isHomeRow ? homeGoals : awayGoals;
    const goalsAgainst = isHomeRow ? awayGoals : homeGoals;
    const win = goalsFor > goalsAgainst;
    const draw = goalsFor === goalsAgainst;
    return {
      ...row,
      pj: row.pj + 1,
      gf: row.gf + goalsFor,
      gc: row.gc + goalsAgainst,
      g: row.g + (win ? 1 : 0),
      e: row.e + (draw ? 1 : 0),
      p: row.p + (!win && !draw ? 1 : 0),
      puntos: row.puntos + (win ? 3 : draw ? 1 : 0)
    };
  });
}

export function sortTable(table: TableTeam[]): TableTeam[] {
  return [...table].sort((a, b) => b.puntos - a.puntos || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf);
}

function clubStrength(club: Club): number {
  const repScore = club.reputation * 20; // 20-100
  const valueScore = Math.log10(Math.max(club.marketValue, 100000)) * 10; // ~50-90 en el rango real de los clubes
  return repScore + valueScore;
}

function poissonSample(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export function simulateMatch(home: Club, away: Club): { homeGoals: number; awayGoals: number } {
  const homeStrength = clubStrength(home) * 1.1; // ventaja de local
  const awayStrength = clubStrength(away);
  const total = homeStrength + awayStrength;
  const homeExpected = 1.1 + (homeStrength / total) * 2.2;
  const awayExpected = 0.9 + (awayStrength / total) * 2.0;
  return { homeGoals: poissonSample(homeExpected), awayGoals: poissonSample(awayExpected) };
}

// Crea (si no existe) o pone al día la temporada de una liga: simula de
// golpe todas las fechas que ya deberían estar jugadas según currentWeek.
// Esto es lo que permite el enfoque perezoso: una liga que recién visitás
// por primera vez (ej. tras un traspaso) aparece con tabla e historial
// "como si viniera corriendo de fondo" sin haber generado los ~20 ligas
// del juego desde el arranque de la carrera.
export function getOrCreateLeagueSeason(
  leagueKey: string,
  clubs: Club[],
  existing: LeagueSeasonState | undefined,
  currentWeek: number
): LeagueSeasonState {
  const clubIds = clubs.map(c => c.id);
  let fixtures = existing ? existing.fixtures : [];
  let table = existing ? existing.table : buildInitialTable(clubs);
  let round = existing ? existing.round : 0;

  const targetMatchweeks = Math.max(leagueMatchweeksElapsed(currentWeek), 1);
  const extended = ensureFixturesUpTo(fixtures, targetMatchweeks, clubIds);
  fixtures = extended.fixtures;
  round += extended.roundsAdded;

  for (let mw = 1; mw <= leagueMatchweeksElapsed(currentWeek); mw++) {
    fixtures = fixtures.map(fx => {
      if (fx.matchweek !== mw || fx.played) return fx;
      const home = clubs.find(c => c.id === fx.homeTeamId);
      const away = clubs.find(c => c.id === fx.awayTeamId);
      if (!home || !away) return fx;
      const { homeGoals, awayGoals } = simulateMatch(home, away);
      table = applyResultToTable(table, fx.homeTeamId, fx.awayTeamId, homeGoals, awayGoals);
      return { ...fx, played: true, homeGoals, awayGoals };
    });
  }

  return { leagueKey, fixtures, table, round };
}

// Rival + condición de local/visitante de tu club para la fecha que
// corresponde jugar esta semana (según currentWeek), sin resolverla todavía.
export function getUpcomingFixtureForClub(
  season: LeagueSeasonState,
  clubs: Club[],
  currentWeek: number,
  clubId: string
): { opponentId: string; isHome: boolean } | null {
  const clubIds = clubs.map(c => c.id);
  const mw = leagueMatchweeksElapsed(currentWeek) + 1;
  const { fixtures } = ensureFixturesUpTo(season.fixtures, mw, clubIds);
  const fx = fixtures.find(f => f.matchweek === mw && (f.homeTeamId === clubId || f.awayTeamId === clubId));
  if (!fx) return null;
  return fx.homeTeamId === clubId ? { opponentId: fx.awayTeamId, isHome: true } : { opponentId: fx.homeTeamId, isHome: false };
}

// Resuelve la fecha de esta semana: tu partido usa el resultado REAL que
// jugaste, el resto de los partidos de esa fecha se simulan.
export function resolvePlayerMatchweek(
  season: LeagueSeasonState,
  clubs: Club[],
  currentWeek: number,
  playerClubId: string,
  playerIsHome: boolean,
  playerGoals: number,
  opponentGoals: number
): LeagueSeasonState {
  const clubIds = clubs.map(c => c.id);
  const mw = leagueMatchweeksElapsed(currentWeek) + 1;
  const extended = ensureFixturesUpTo(season.fixtures, mw, clubIds);
  let fixtures = extended.fixtures;
  let table = season.table;

  fixtures = fixtures.map(fx => {
    if (fx.matchweek !== mw || fx.played) return fx;
    const isPlayerMatch = fx.homeTeamId === playerClubId || fx.awayTeamId === playerClubId;

    let homeGoals: number, awayGoals: number;
    if (isPlayerMatch) {
      homeGoals = playerIsHome ? playerGoals : opponentGoals;
      awayGoals = playerIsHome ? opponentGoals : playerGoals;
    } else {
      const home = clubs.find(c => c.id === fx.homeTeamId);
      const away = clubs.find(c => c.id === fx.awayTeamId);
      if (!home || !away) return fx;
      ({ homeGoals, awayGoals } = simulateMatch(home, away));
    }

    table = applyResultToTable(table, fx.homeTeamId, fx.awayTeamId, homeGoals, awayGoals);
    return { ...fx, played: true, homeGoals, awayGoals };
  });

  return { leagueKey: season.leagueKey, fixtures, table, round: season.round + extended.roundsAdded };
}
