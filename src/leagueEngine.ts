import { Club, CuadrangularesState, CupGroup, CupState, Fixture, LeagueSeasonState, PenaltyShootoutResult, PlayoffBracket, TableTeam, TwoLegBracket, TwoLegTie, UefaCupState, WorldCupState } from './types';

// Semanas de carrera por temporada (incluye semanas de Copa). Fija e igual
// para TODAS las ligas, sin importar cuántos equipos tenga cada una —
// esto es lo que permite sincronizar copas continentales y el ciclo de
// 4 años de los torneos de selecciones más adelante.
export const SEASON_LENGTH_WEEKS = 38;

export function isCupWeek(week: number): boolean {
  return week % 3 === 0;
}

// Ventanas de fichajes, inspiradas en las fechas reales de modo carrera
// FIFA/EA FC (jul-ago y enero), escaladas a las 38 semanas de temporada:
// ventana 1 ≈ jul-ago (arranque de temporada), ventana 2 ≈ enero (mitad).
const TRANSFER_WINDOW_1_END = 7;
const TRANSFER_WINDOW_2_START = 19;
const TRANSFER_WINDOW_2_END = 22;

function weekInSeason(currentWeek: number): number {
  return ((currentWeek - 1) % SEASON_LENGTH_WEEKS) + 1;
}

export function isTransferWindowOpen(currentWeek: number): boolean {
  const w = weekInSeason(currentWeek);
  return w <= TRANSFER_WINDOW_1_END || (w >= TRANSFER_WINDOW_2_START && w <= TRANSFER_WINDOW_2_END);
}

// Solo tiene sentido llamarla cuando isTransferWindowOpen(currentWeek) es false.
export function weeksUntilTransferWindow(currentWeek: number): number {
  const w = weekInSeason(currentWeek);
  if (w < TRANSFER_WINDOW_2_START) return TRANSFER_WINDOW_2_START - w;
  return SEASON_LENGTH_WEEKS - w + 1;
}

// Fecha calendario real: semana 1 = 1° de julio 2026 (arranque de la
// ventana de fichajes 1, ver arriba), y cada semana de carrera suma 7 días.
// Puramente cosmético — no reemplaza currentWeek, que sigue siendo la base
// de fixtures, copas y mundiales.
const CAREER_START_YEAR = 2026;
const CAREER_START_MONTH = 6; // julio (0-indexado)
const CAREER_START_DAY = 1;

const MONTH_NAMES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function getRealDate(currentWeek: number): Date {
  const date = new Date(CAREER_START_YEAR, CAREER_START_MONTH, CAREER_START_DAY);
  date.setDate(date.getDate() + (currentWeek - 1) * 7);
  return date;
}

export function formatRealDate(currentWeek: number): string {
  const date = getRealDate(currentWeek);
  return `${date.getDate()} de ${MONTH_NAMES_ES[date.getMonth()]} de ${date.getFullYear()}`;
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

// Igual que leagueMatchweeksElapsed, pero SIN reiniciarse cada
// SEASON_LENGTH_WEEKS — cuenta desde el arranque de la carrera. Lo usa el
// motor de Apertura/Clausura, que necesita más de un "año" del motor de
// tabla larga para completar Apertura + Clausura (regular + playoffs/
// cuadrangulares de cada semestre).
export function leagueMatchweeksElapsedTotal(currentWeek: number): number {
  let count = 0;
  for (let w = 1; w < currentWeek; w++) {
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

// Tanda de penales real (no un coin-flip invisible): 5 tiros por lado alternando A/B, y si sigue
// igualado, muerte súbita de a un tiro por lado hasta que quede desnivelado. La conversión ronda
// el 78% real de las tandas profesionales, con un pequeño empujón para el equipo más fuerte.
export function simulatePenaltyShootout(clubA: Club, clubB: Club): PenaltyShootoutResult {
  const strengthA = clubStrength(clubA);
  const strengthB = clubStrength(clubB);
  const convChance = (strength: number, otherStrength: number) =>
    Math.max(0.6, Math.min(0.92, 0.78 + (strength - otherStrength) / 400));

  const kicks: { clubId: string; scored: boolean }[] = [];
  let scoreA = 0;
  let scoreB = 0;

  const shootOnce = () => {
    const scoredA = Math.random() < convChance(strengthA, strengthB);
    kicks.push({ clubId: clubA.id, scored: scoredA });
    if (scoredA) scoreA++;

    const scoredB = Math.random() < convChance(strengthB, strengthA);
    kicks.push({ clubId: clubB.id, scored: scoredB });
    if (scoredB) scoreB++;
  };

  for (let round = 1; round <= 5; round++) shootOnce();
  while (scoreA === scoreB) shootOnce();

  return {
    clubAId: clubA.id,
    clubBId: clubB.id,
    kicks,
    scoreA,
    scoreB,
    winnerId: scoreA > scoreB ? clubA.id : clubB.id,
  };
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

// ==========================================================================
// --- FORMATO APERTURA/CLAUSURA (Colombia y Argentina) ---
// Colombia: todos-contra-todos (19 fechas, 20 clubes) -> top 8 -> Apertura:
// eliminación directa (partido único) / Clausura: cuadrangulares.
// Argentina: 2 zonas de 15 -> todos-contra-todos intra-zona (14 fechas,
// simplificación: no modelamos las 2 fechas interzonales reales) -> top 8
// por zona (16 en total) -> eliminación directa a partido único, ambos
// semestres.
// ==========================================================================

const REGULAR_PHASE_MATCHDAYS: Record<'colombia' | 'argentina', number> = {
  colombia: 19,
  argentina: 14,
};

const SEED_PAIRS_8 = [[0, 7], [3, 4], [2, 5], [1, 6]];
const SEED_PAIRS_16 = [[0, 15], [7, 8], [4, 11], [3, 12], [2, 13], [5, 10], [6, 9], [1, 14]];
// Ronda de 32 del Mundial -- misma construcción recursiva estándar de bracket que las de arriba
// (los sembrados 1 y 2 quedan en mitades opuestas del cuadro y solo pueden cruzarse en la final).
const SEED_PAIRS_32 = [
  [0, 31], [15, 16], [7, 24], [8, 23], [3, 28], [12, 19], [4, 27], [11, 20],
  [1, 30], [14, 17], [6, 25], [9, 22], [2, 29], [13, 18], [5, 26], [10, 21],
];

export function isApeturaClausuraLeague(league: string): 'colombia' | 'argentina' | null {
  if (league === 'Colombiana') return 'colombia';
  if (league === 'Argentina') return 'argentina';
  return null;
}

// División determinística en 2 zonas de 15 (no tenemos el sorteo real de
// AFA) — estable mientras la lista de clubIds no cambie.
function assignArgentinaZones(clubIds: string[]): { zoneA: string[]; zoneB: string[] } {
  const sorted = [...clubIds].sort();
  return { zoneA: sorted.filter((_, i) => i % 2 === 0), zoneB: sorted.filter((_, i) => i % 2 === 1) };
}

// UNA sola vuelta (no ida y vuelta) — Colombia y Argentina juegan todos
// contra todos una sola vez en la fase regular de cada semestre.
function generateSingleRound(clubIds: string[]): Fixture[] {
  const teams = clubIds.length % 2 === 0 ? [...clubIds] : [...clubIds, '__BYE__'];
  const n = teams.length;
  let arr = [...teams];
  const fixtures: Fixture[] = [];

  for (let round = 0; round < n - 1; round++) {
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (a !== '__BYE__' && b !== '__BYE__') {
        const [home, away] = round % 2 === 0 ? [a, b] : [b, a];
        fixtures.push({ matchweek: round + 1, homeTeamId: home, awayTeamId: away, played: false, homeGoals: null, awayGoals: null });
      }
    }
    arr = [arr[0], arr[arr.length - 1], ...arr.slice(1, arr.length - 1)];
  }
  return fixtures;
}

function seedBracket(rankedClubIds: string[]): PlayoffBracket {
  const pairs = rankedClubIds.length === 32 ? SEED_PAIRS_32 : rankedClubIds.length === 16 ? SEED_PAIRS_16 : SEED_PAIRS_8;
  const firstRound = pairs.map(([a, b]) => ({
    homeTeamId: rankedClubIds[a],
    awayTeamId: rankedClubIds[b],
    played: false,
    homeGoals: null as number | null,
    awayGoals: null as number | null,
  }));
  return { matchesByRound: [firstRound], championId: null };
}

function resolveBracketRound(
  bracket: PlayoffBracket,
  clubs: Club[],
  forced?: { clubId: string; isHome: boolean; goals: number; opponentGoals: number }
): PlayoffBracket {
  const roundIdx = bracket.matchesByRound.length - 1;
  const currentRound = bracket.matchesByRound[roundIdx].map(m => {
    if (m.played) return m;
    const isForcedMatch = forced && (m.homeTeamId === forced.clubId || m.awayTeamId === forced.clubId);
    let homeGoals: number, awayGoals: number;
    if (isForcedMatch && forced) {
      homeGoals = forced.isHome ? forced.goals : forced.opponentGoals;
      awayGoals = forced.isHome ? forced.opponentGoals : forced.goals;
    } else {
      const home = clubs.find(c => c.id === m.homeTeamId);
      const away = clubs.find(c => c.id === m.awayTeamId);
      if (!home || !away) return m;
      ({ homeGoals, awayGoals } = simulateMatch(home, away));
    }
    if (homeGoals === awayGoals) {
      // Sin empates en eliminación directa: se define con una tanda de penales real, no un
      // "+1 gol" invisible (eso además castigaba injustamente al local en tu propio partido).
      const home = clubs.find(c => c.id === m.homeTeamId);
      const away = clubs.find(c => c.id === m.awayTeamId);
      if (home && away) {
        const penaltyShootout = simulatePenaltyShootout(home, away);
        return { ...m, played: true, homeGoals, awayGoals, penaltyShootout };
      }
    }
    return { ...m, played: true, homeGoals, awayGoals };
  });

  const matchesByRound = [...bracket.matchesByRound.slice(0, roundIdx), currentRound];
  const roundComplete = currentRound.every(m => m.played);
  if (!roundComplete) return { matchesByRound, championId: null };

  const winners = currentRound.map(m => m.penaltyShootout ? m.penaltyShootout.winnerId : (m.homeGoals! > m.awayGoals! ? m.homeTeamId : m.awayTeamId));
  if (winners.length === 1) {
    return { matchesByRound, championId: winners[0] };
  }
  const nextRound = [];
  for (let i = 0; i < winners.length; i += 2) {
    nextRound.push({ homeTeamId: winners[i], awayTeamId: winners[i + 1], played: false, homeGoals: null, awayGoals: null });
  }
  return { matchesByRound: [...matchesByRound, nextRound], championId: null };
}

function startCuadrangulares(top8: string[]): CuadrangularesState {
  // Cruce estándar para que los 2 mejores no queden en el mismo grupo: A=1,4,5,8 / B=2,3,6,7
  const groupA = [top8[0], top8[3], top8[4], top8[7]];
  const groupB = [top8[1], top8[2], top8[5], top8[6]];
  return {
    groupA,
    groupB,
    tableA: groupA.map(id => ({ clubId: id, name: id, puntos: 0, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 })),
    tableB: groupB.map(id => ({ clubId: id, name: id, puntos: 0, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 })),
    fixturesA: generateSingleRound(groupA),
    fixturesB: generateSingleRound(groupB),
    finalPlayed: false,
    championId: null,
  };
}

function resolveCuadrangularesStep(
  state: CuadrangularesState,
  clubs: Club[],
  forced?: { clubId: string; isHome: boolean; goals: number; opponentGoals: number }
): CuadrangularesState {
  const groupDone = (fixtures: Fixture[]) => fixtures.every(f => f.played);

  if (!groupDone(state.fixturesA) || !groupDone(state.fixturesB)) {
    const nextMw = Math.min(
      state.fixturesA.find(f => !f.played)?.matchweek ?? Infinity,
      state.fixturesB.find(f => !f.played)?.matchweek ?? Infinity
    );
    const resolveGroup = (fixtures: Fixture[], table: TableTeam[]): { fixtures: Fixture[]; table: TableTeam[] } => {
      let t = table;
      const fx = fixtures.map(f => {
        if (f.matchweek !== nextMw || f.played) return f;
        const isForcedMatch = forced && (f.homeTeamId === forced.clubId || f.awayTeamId === forced.clubId);
        let homeGoals: number, awayGoals: number;
        if (isForcedMatch && forced) {
          homeGoals = forced.isHome ? forced.goals : forced.opponentGoals;
          awayGoals = forced.isHome ? forced.opponentGoals : forced.goals;
        } else {
          const home = clubs.find(c => c.id === f.homeTeamId);
          const away = clubs.find(c => c.id === f.awayTeamId);
          if (!home || !away) return f;
          ({ homeGoals, awayGoals } = simulateMatch(home, away));
        }
        t = applyResultToTable(t, f.homeTeamId, f.awayTeamId, homeGoals, awayGoals);
        return { ...f, played: true, homeGoals, awayGoals };
      });
      return { fixtures: fx, table: t };
    };

    const resultA = resolveGroup(state.fixturesA, state.tableA);
    const resultB = resolveGroup(state.fixturesB, state.tableB);
    return { ...state, fixturesA: resultA.fixtures, tableA: resultA.table, fixturesB: resultB.fixtures, tableB: resultB.table };
  }

  if (!state.finalPlayed) {
    const finalistA = sortTable(state.tableA)[0].clubId!;
    const finalistB = sortTable(state.tableB)[0].clubId!;
    const isForcedMatch = forced && (forced.clubId === finalistA || forced.clubId === finalistB);
    let homeGoals: number, awayGoals: number;
    if (isForcedMatch && forced) {
      homeGoals = forced.isHome ? forced.goals : forced.opponentGoals;
      awayGoals = forced.isHome ? forced.opponentGoals : forced.goals;
    } else {
      const home = clubs.find(c => c.id === finalistA);
      const away = clubs.find(c => c.id === finalistB);
      homeGoals = 0; awayGoals = 0;
      if (home && away) {
        ({ homeGoals, awayGoals } = simulateMatch(home, away));
        if (homeGoals === awayGoals) homeGoals += 1;
      }
    }
    const championId = homeGoals > awayGoals ? finalistA : finalistB;
    return { ...state, finalPlayed: true, championId };
  }

  return state;
}

function freshRegularPhase(clubs: Club[], format: 'colombia' | 'argentina', semester: 1 | 2, semesterStartWeek: number): LeagueSeasonState {
  const leagueKey = leagueKeyFor(clubs[0]);
  if (format === 'colombia') {
    const clubIds = shuffle(clubs.map(c => c.id));
    return {
      leagueKey,
      fixtures: generateSingleRound(clubIds),
      table: buildInitialTable(clubs),
      round: 0,
      semester,
      semesterStartWeek,
      stage: 'regular',
    };
  }
  // Argentina: 2 zonas, fixture combinado (matchweek de ambas zonas comparten número de fecha)
  const { zoneA, zoneB } = assignArgentinaZones(shuffle(clubs.map(c => c.id)));
  const fixturesA = generateSingleRound(zoneA);
  const fixturesB = generateSingleRound(zoneB);
  return {
    leagueKey,
    fixtures: [...fixturesA, ...fixturesB],
    table: buildInitialTable(clubs),
    round: 0,
    semester,
    semesterStartWeek,
    stage: 'regular',
  };
}

// Resuelve UN paso (una fecha de fase regular, una ronda de playoffs, o una
// fecha de cuadrangulares) de la temporada. Si currentWeek ya alcanzó el
// final de una etapa, transiciona a la siguiente (playoffs/cuadrangulares,
// o al semestre siguiente) y resuelve el primer paso de esa nueva etapa en
// la misma llamada, para no "perder" la semana.
function resolveApeturaClausuraStep(
  season: LeagueSeasonState,
  clubs: Club[],
  currentWeek: number,
  format: 'colombia' | 'argentina',
  forced?: { clubId: string; isHome: boolean; goals: number; opponentGoals: number }
): LeagueSeasonState {
  const stage = season.stage ?? 'regular';

  if (stage === 'regular') {
    // Basado en el estado real de los fixtures (próxima fecha sin jugar), NO
    // en aritmética de currentWeek — así el catch-up (que llama a esta
    // función muchas veces seguidas con el mismo currentWeek "objetivo")
    // avanza fecha a fecha en vez de recalcular siempre la misma fecha.
    const nextMw = season.fixtures.find(f => !f.played)?.matchweek;

    if (nextMw === undefined) {
      // Fase regular terminada: arma top 8 (o top 8 por zona en Argentina) y pasa a la siguiente etapa.
      if (format === 'colombia') {
        const top8 = sortTable(season.table).slice(0, 8).map(r => r.clubId!);
        if (season.semester === 1) {
          return resolveApeturaClausuraStep({ ...season, stage: 'knockout', knockout: seedBracket(top8) }, clubs, currentWeek, format, forced);
        }
        return resolveApeturaClausuraStep({ ...season, stage: 'cuadrangulares', cuadrangulares: startCuadrangulares(top8) }, clubs, currentWeek, format, forced);
      }
      // Argentina: top 8 de cada zona por separado
      const { zoneA, zoneB } = assignArgentinaZones(clubs.map(c => c.id));
      const zoneTable = (zoneIds: string[]) => sortTable(season.table.filter(r => zoneIds.includes(r.clubId!)));
      const top8A = zoneTable(zoneA).slice(0, 8).map(r => r.clubId!);
      const top8B = zoneTable(zoneB).slice(0, 8).map(r => r.clubId!);
      const rankedClubIds = [...top8A, ...top8B]; // 16 equipos, seed 1-16 (zona A primero, zona B después)
      return resolveApeturaClausuraStep({ ...season, stage: 'knockout', knockout: seedBracket(rankedClubIds) }, clubs, currentWeek, format, forced);
    }

    let fixtures = season.fixtures;
    let table = season.table;
    fixtures = fixtures.map(fx => {
      if (fx.matchweek !== nextMw || fx.played) return fx;
      const isForcedMatch = forced && (fx.homeTeamId === forced.clubId || fx.awayTeamId === forced.clubId);
      let homeGoals: number, awayGoals: number;
      if (isForcedMatch && forced) {
        homeGoals = forced.isHome ? forced.goals : forced.opponentGoals;
        awayGoals = forced.isHome ? forced.opponentGoals : forced.goals;
      } else {
        const home = clubs.find(c => c.id === fx.homeTeamId);
        const away = clubs.find(c => c.id === fx.awayTeamId);
        if (!home || !away) return fx;
        ({ homeGoals, awayGoals } = simulateMatch(home, away));
      }
      table = applyResultToTable(table, fx.homeTeamId, fx.awayTeamId, homeGoals, awayGoals);
      return { ...fx, played: true, homeGoals, awayGoals };
    });
    return { ...season, fixtures, table };
  }

  if (stage === 'knockout') {
    const bracket = season.knockout!;
    if (bracket.championId) {
      return startNextSemester(season, clubs, currentWeek, format, forced);
    }
    const updatedBracket = resolveBracketRound(bracket, clubs, forced);
    return { ...season, knockout: updatedBracket };
  }

  if (stage === 'cuadrangulares') {
    const state = season.cuadrangulares!;
    if (state.championId) {
      return startNextSemester(season, clubs, currentWeek, format, forced);
    }
    const updated = resolveCuadrangularesStep(state, clubs, forced);
    return { ...season, cuadrangulares: updated };
  }

  return season;
}

function startNextSemester(
  season: LeagueSeasonState,
  clubs: Club[],
  currentWeek: number,
  format: 'colombia' | 'argentina',
  forced?: { clubId: string; isHome: boolean; goals: number; opponentGoals: number }
): LeagueSeasonState {
  const nextSemester: 1 | 2 = season.semester === 1 ? 2 : 1;
  const fresh = freshRegularPhase(clubs, format, nextSemester, currentWeek);
  return resolveApeturaClausuraStep(fresh, clubs, currentWeek, format, forced);
}

// Crea (si no existe) o pone al día la temporada Apertura/Clausura,
// simulando de golpe (sin resultado forzado) todos los pasos ya pasados.
// Cada llamada a resolveApeturaClausuraStep consume EXACTAMENTE una fecha
// de liga, sea cual sea la etapa en la que caiga (fase regular, una ronda
// completa de playoffs, o una fecha de cuadrangulares) — así que alcanza
// con contar cuántas fechas de liga ya transcurrieron en total.
export function getOrCreateApeturaClausuraSeason(
  clubs: Club[],
  existing: LeagueSeasonState | undefined,
  currentWeek: number,
  format: 'colombia' | 'argentina'
): LeagueSeasonState {
  let season = existing ?? freshRegularPhase(clubs, format, 1, currentWeek);
  let stepsConsumed = existing?.stepsConsumed ?? 0;
  const targetSteps = leagueMatchweeksElapsedTotal(currentWeek);

  while (stepsConsumed < targetSteps) {
    season = resolveApeturaClausuraStep(season, clubs, currentWeek, format);
    stepsConsumed++;
  }
  return { ...season, stepsConsumed };
}

// Resuelve la semana actual con el resultado REAL de tu partido (si te
// corresponde jugar esta semana en cualquiera de las etapas).
export function resolveApeturaClausuraWeek(
  season: LeagueSeasonState,
  clubs: Club[],
  currentWeek: number,
  format: 'colombia' | 'argentina',
  playerClubId: string,
  playerIsHome: boolean,
  playerGoals: number,
  opponentGoals: number
): LeagueSeasonState {
  const updated = resolveApeturaClausuraStep(season, clubs, currentWeek, format, {
    clubId: playerClubId,
    isHome: playerIsHome,
    goals: playerGoals,
    opponentGoals,
  });
  return { ...updated, stepsConsumed: (season.stepsConsumed ?? 0) + 1 };
}

// Rival de tu club para el paso que corresponde esta semana, en cualquiera
// de las etapas (regular, knockout, cuadrangulares). null si tu club no
// tiene partido esta semana (quedaste afuera / etapa ya sin tu equipo) —
// en ese caso el llamador cae al fallback de partido amistoso ya existente.
export function getUpcomingApeturaClausuraMatch(
  season: LeagueSeasonState,
  currentWeek: number,
  clubId: string
): { opponentId: string; isHome: boolean } | null {
  const stage = season.stage ?? 'regular';

  if (stage === 'regular') {
    // Misma fecha que resolveApeturaClausuraStep tomaría como "próximo paso"
    // (la fecha más baja con algún partido sin jugar) — si tu club no tiene
    // partido justo en esa fecha (ej. fecha libre en una zona impar de
    // Argentina), no hay partido esta semana para vos.
    const nextMw = season.fixtures.find(f => !f.played)?.matchweek;
    if (nextMw === undefined) return null;
    const fx = season.fixtures.find(f => f.matchweek === nextMw && (f.homeTeamId === clubId || f.awayTeamId === clubId));
    if (!fx) return null;
    return fx.homeTeamId === clubId ? { opponentId: fx.awayTeamId, isHome: true } : { opponentId: fx.homeTeamId, isHome: false };
  }

  if (stage === 'knockout' && season.knockout && !season.knockout.championId) {
    const currentRound = season.knockout.matchesByRound[season.knockout.matchesByRound.length - 1];
    const m = currentRound.find(mm => !mm.played && (mm.homeTeamId === clubId || mm.awayTeamId === clubId));
    if (!m) return null;
    return m.homeTeamId === clubId ? { opponentId: m.awayTeamId, isHome: true } : { opponentId: m.homeTeamId, isHome: false };
  }

  if (stage === 'cuadrangulares' && season.cuadrangulares && !season.cuadrangulares.championId) {
    const state = season.cuadrangulares;
    const inGroupFixtures = [...state.fixturesA, ...state.fixturesB];
    const pending = inGroupFixtures.find(f => !f.played && (f.homeTeamId === clubId || f.awayTeamId === clubId));
    if (pending) {
      return pending.homeTeamId === clubId ? { opponentId: pending.awayTeamId, isHome: true } : { opponentId: pending.homeTeamId, isHome: false };
    }
    const groupsDone = [...state.fixturesA, ...state.fixturesB].every(f => f.played);
    if (groupsDone && !state.finalPlayed) {
      const finalistA = sortTable(state.tableA)[0]?.clubId;
      const finalistB = sortTable(state.tableB)[0]?.clubId;
      if (clubId === finalistA) return { opponentId: finalistB!, isHome: true };
      if (clubId === finalistB) return { opponentId: finalistA!, isHome: false };
    }
    return null;
  }

  return null;
}

// ==========================================================================
// --- DISPATCHERS: eligen entre el motor simple (tabla larga) y el de
// Apertura/Clausura según la liga, para que App.tsx no tenga que saber cuál
// es cuál. ---
// ==========================================================================

export function getOrCreateSeasonForLeague(
  leagueClubs: Club[],
  existing: LeagueSeasonState | undefined,
  currentWeek: number
): LeagueSeasonState {
  const format = isApeturaClausuraLeague(leagueClubs[0].league);
  const leagueKey = leagueKeyFor(leagueClubs[0]);
  if (format) return getOrCreateApeturaClausuraSeason(leagueClubs, existing, currentWeek, format);
  return getOrCreateLeagueSeason(leagueKey, leagueClubs, existing, currentWeek);
}

export function getUpcomingMatchForLeague(
  season: LeagueSeasonState,
  leagueClubs: Club[],
  currentWeek: number,
  clubId: string
): { opponentId: string; isHome: boolean } | null {
  const format = isApeturaClausuraLeague(leagueClubs[0].league);
  if (format) return getUpcomingApeturaClausuraMatch(season, currentWeek, clubId);
  return getUpcomingFixtureForClub(season, leagueClubs, currentWeek, clubId);
}

// ==========================================================================
// --- COPA LIBERTADORES / COPA SUDAMERICANA (Conmebol) ---
// 32 equipos cada una, 8 grupos de 4 (ida y vuelta, 6 fechas), top 2 de
// cada grupo a octavos -> cuartos -> semis -> final.
// Clasificación por reputation (no por tabla en vivo — evita tener que
// simular las ligas sudamericanas que nadie visitó). Los clubes que no
// clasifican a Libertadores son los candidatos a Sudamericana.
// Simplificación consciente: NO modelamos el cruce real donde los tres
// terceros de Libertadores caen a la fase eliminatoria de Sudamericana —
// cada copa corre como un torneo de grupos + eliminación directa
// independiente, con su propio pool de clasificados.
// ==========================================================================

type ForcedResult = { clubId: string; isHome: boolean; goals: number; opponentGoals: number };

// Reparto de cupos por país, aproximando el reparto real de Conmebol
// (Brasil/Argentina con más cupos). Suma 32.
const LIBERTADORES_SLOTS: Record<string, number> = {
  Brasileña: 6,
  Argentina: 6,
  Colombiana: 4,
  Ecuatoriana: 3,
  Uruguaya: 3,
  Paraguaya: 3,
  Chilena: 3,
  Peruana: 2,
  Boliviana: 1,
  Venezolana: 1,
};

function pickTopClubsByCountry(clubs: Club[], slots: Record<string, number>, exclude: Set<string>): string[] {
  const picked: string[] = [];
  for (const [league, n] of Object.entries(slots)) {
    const countryClubs = clubs
      .filter(c => c.league === league && (c.division ?? 1) === 1 && !exclude.has(c.id))
      .sort((a, b) => b.reputation - a.reputation || b.marketValue - a.marketValue);
    picked.push(...countryClubs.slice(0, n).map(c => c.id));
  }
  return picked;
}

export function getLibertadoresParticipants(allClubs: Club[]): string[] {
  return pickTopClubsByCountry(allClubs, LIBERTADORES_SLOTS, new Set());
}

export function getSudamericanaParticipants(allClubs: Club[]): string[] {
  const libertadoresIds = new Set(getLibertadoresParticipants(allClubs));
  return pickTopClubsByCountry(allClubs, LIBERTADORES_SLOTS, libertadoresIds);
}

function drawCupGroups(participantIds: string[], allClubs: Club[]): CupGroup[] {
  const shuffled = shuffle(participantIds);
  const groups: CupGroup[] = [];
  for (let g = 0; g < 8; g++) {
    const clubIds = shuffled.slice(g * 4, g * 4 + 4);
    const groupClubs = clubIds.map(id => allClubs.find(c => c.id === id)).filter((c): c is Club => !!c);
    groups.push({
      id: String.fromCharCode(65 + g), // 'A'..'H'
      clubIds,
      table: buildInitialTable(groupClubs),
      fixtures: generateRoundRobin(clubIds), // ida y vuelta = 6 fechas para 4 equipos
    });
  }
  return groups;
}

function resolveCupGroupsStep(groups: CupGroup[], allClubs: Club[], forced?: ForcedResult): CupGroup[] {
  const nextMw = Math.min(...groups.map(g => g.fixtures.find(f => !f.played)?.matchweek ?? Infinity));
  if (nextMw === Infinity) return groups;
  return groups.map(g => {
    let table = g.table;
    const fixtures = g.fixtures.map(f => {
      if (f.matchweek !== nextMw || f.played) return f;
      const isForced = forced && (f.homeTeamId === forced.clubId || f.awayTeamId === forced.clubId);
      let homeGoals: number, awayGoals: number;
      if (isForced && forced) {
        homeGoals = forced.isHome ? forced.goals : forced.opponentGoals;
        awayGoals = forced.isHome ? forced.opponentGoals : forced.goals;
      } else {
        const home = allClubs.find(c => c.id === f.homeTeamId);
        const away = allClubs.find(c => c.id === f.awayTeamId);
        if (!home || !away) return f;
        ({ homeGoals, awayGoals } = simulateMatch(home, away));
      }
      table = applyResultToTable(table, f.homeTeamId, f.awayTeamId, homeGoals, awayGoals);
      return { ...f, played: true, homeGoals, awayGoals };
    });
    return { ...g, table, fixtures };
  });
}

function seedFromCupGroups(groups: CupGroup[]): string[] {
  const winners = groups.map(g => sortTable(g.table)[0].clubId!);
  const runnersUp = groups.map(g => sortTable(g.table)[1].clubId!);
  return [...winners, ...runnersUp]; // 16: seeds 1-8 ganadores, 9-16 segundos — nunca cruza compañeros de grupo en la 1ª ronda
}

function resolveCupStep(cup: CupState, allClubs: Club[], forced?: ForcedResult): CupState {
  if (cup.stage === 'groups') {
    const allPlayed = cup.groups.every(g => g.fixtures.every(f => f.played));
    if (allPlayed) {
      const seeded = seedFromCupGroups(cup.groups);
      return resolveCupStep({ ...cup, stage: 'knockout', knockout: seedBracket(seeded) }, allClubs, forced);
    }
    return { ...cup, groups: resolveCupGroupsStep(cup.groups, allClubs, forced) };
  }

  if (cup.stage === 'knockout') {
    if (cup.knockout?.championId) {
      return { ...cup, stage: 'done', championId: cup.knockout.championId };
    }
    return { ...cup, knockout: resolveBracketRound(cup.knockout!, allClubs, forced) };
  }

  return cup; // 'done': el torneo de este año ya terminó, no hay más pasos
}

function freshCupState(cupId: 'libertadores' | 'sudamericana', year: number, allClubs: Club[]): CupState {
  const participants = cupId === 'libertadores' ? getLibertadoresParticipants(allClubs) : getSudamericanaParticipants(allClubs);
  return {
    cupId,
    year,
    groups: drawCupGroups(participants, allClubs),
    stage: 'groups',
    knockout: null,
    championId: null,
    stepsConsumed: 0,
  };
}

// Cuántas semanas de Copa (isCupWeek) ya transcurrieron en total desde el
// arranque de la carrera — el equivalente de leagueMatchweeksElapsedTotal
// pero contando las semanas que SÍ son de copa en vez de las que no.
export function cupWeeksElapsedTotal(currentWeek: number): number {
  let count = 0;
  for (let w = 1; w < currentWeek; w++) {
    if (isCupWeek(w)) count++;
  }
  return count;
}

// A diferencia de la liga (cuyo LeagueSeasonState vive toda la carrera y por
// eso necesita un contador que nunca se reinicia), cada CupState se crea de
// cero por año (freshCupState). Si el catch-up usara cupWeeksElapsedTotal
// (que no se reinicia) como objetivo, a partir del año 2 ese objetivo ya
// sería enorme frente al stepsConsumed=0 de un torneo recién creado, y el
// catch-up resolvería TODA la edición (grupos + eliminatoria) de un solo
// golpe sin dejarle nunca un partido real al jugador. Por eso acá contamos
// solo las semanas de copa transcurridas DESDE el arranque de ese año.
function cupWeeksElapsedInYear(year: number, currentWeek: number): number {
  const yearStartWeek = (year - 1) * SEASON_LENGTH_WEEKS + 1;
  let count = 0;
  for (let w = yearStartWeek; w < currentWeek; w++) {
    if (isCupWeek(w)) count++;
  }
  return count;
}

export function getOrCreateCupState(
  cupId: 'libertadores' | 'sudamericana',
  year: number,
  allClubs: Club[],
  existing: CupState | undefined,
  currentWeek: number
): CupState {
  let cup = existing ?? freshCupState(cupId, year, allClubs);
  let stepsConsumed = existing?.stepsConsumed ?? 0;
  const targetSteps = cupWeeksElapsedInYear(year, currentWeek);

  while (stepsConsumed < targetSteps && cup.stage !== 'done') {
    cup = resolveCupStep(cup, allClubs);
    stepsConsumed++;
  }
  return { ...cup, stepsConsumed };
}

export function resolveCupWeek(
  cup: CupState,
  allClubs: Club[],
  playerClubId: string,
  playerIsHome: boolean,
  playerGoals: number,
  opponentGoals: number
): CupState {
  const updated = resolveCupStep(cup, allClubs, { clubId: playerClubId, isHome: playerIsHome, goals: playerGoals, opponentGoals });
  return { ...updated, stepsConsumed: (cup.stepsConsumed ?? 0) + 1 };
}

export function getUpcomingCupMatch(cup: CupState, clubId: string): { opponentId: string; isHome: boolean } | null {
  if (cup.stage === 'groups') {
    const nextMw = Math.min(...cup.groups.map(g => g.fixtures.find(f => !f.played)?.matchweek ?? Infinity));
    if (nextMw === Infinity) return null;
    for (const g of cup.groups) {
      const fx = g.fixtures.find(f => f.matchweek === nextMw && (f.homeTeamId === clubId || f.awayTeamId === clubId));
      if (fx) return fx.homeTeamId === clubId ? { opponentId: fx.awayTeamId, isHome: true } : { opponentId: fx.homeTeamId, isHome: false };
    }
    return null;
  }

  if (cup.stage === 'knockout' && cup.knockout && !cup.knockout.championId) {
    const currentRound = cup.knockout.matchesByRound[cup.knockout.matchesByRound.length - 1];
    const m = currentRound.find(mm => !mm.played && (mm.homeTeamId === clubId || mm.awayTeamId === clubId));
    if (!m) return null;
    return m.homeTeamId === clubId ? { opponentId: m.awayTeamId, isHome: true } : { opponentId: m.homeTeamId, isHome: false };
  }

  return null;
}

// ==========================================================================
// --- CHAMPIONS LEAGUE / EUROPA LEAGUE (Fase 1c) ---
// Formato Swiss simplificado: campo único en una tabla compartida, cada
// club juega una fase de liga de fechas fijas contra rivales DISTINTOS (no
// todos-contra-todos) elegidos al azar -- sin bombos por ranking UEFA real,
// que hubiera exigido modelar 4 potes por club. Desde el playoff en
// adelante, todo es ida y vuelta con marcador global (TwoLegTie/
// TwoLegBracket en types.ts); un global empatado se define al azar
// ponderado por fortaleza del club (representa la tanda de penales, sin
// gol de visitante, regla UEFA vigente desde 2021).
//
// Los 7 países con liga doméstica completa (Inglaterra, España, Alemania,
// Italia, Francia, Portugal, Holanda) clasifican por cupos-por-reputación,
// igual que Conmebol. Los otros 19 países solo tienen los clubes puntuales
// que de verdad clasificaron a cada copa 2025-26 (investigados en
// Transfermarkt) -- no hay "top N" que elegir ahí, así que van fijos.
// ==========================================================================

const UEFA_LEAGUE_PHASE_MATCHDAYS = 8;
const UEFA_TOP_DIRECT = 8; // top 8 de la fase de liga -> directo a octavos
const UEFA_PLAYOFF_ZONE_END = 24; // 9º-24º juegan el playoff; 25º en adelante queda eliminado

// Cupos por país para los 7 países con liga doméstica completa. Suman 26
// (Champions) / 16 (Europa) -- sumados a los clubes fijos de los 19 países
// minimalistas (10 / 20) dan 36 en ambas copas.
const CHAMPIONS_SLOTS: Record<string, number> = {
  Inglesa: 6, Española: 5, Alemana: 4, Italiana: 4, Francesa: 3, Portuguesa: 2, Holandesa: 2,
};
const EUROPA_SLOTS: Record<string, number> = {
  Inglesa: 3, Española: 2, Alemana: 3, Italiana: 2, Francesa: 2, Portuguesa: 2, Holandesa: 2,
};

// Países sin liga doméstica completa: acá NO se puede elegir "top N por
// reputación" porque el valor de plantel no siempre coincide con quién
// clasificó realmente (ej. Fenerbahçe vale más que Galatasaray en
// Transfermarkt, pero el que fue a Champions fue Galatasaray por posición
// en la liga turca) -- así que van fijos, tal cual se investigó.
const CHAMPIONS_FIXED_CLUBS = [
  'club_brugge', 'union_sg', 'olympiacos', 'slavia_praha', 'bodo_glimt',
  'fc_copenhagen', 'galatasaray', 'qarabag', 'pafos_fc', 'kairat_almaty',
];
const EUROPA_FIXED_CLUBS = [
  'krc_genk', 'paok', 'panathinaikos', 'viktoria_plzen', 'brann_sk', 'midtjylland',
  'fenerbahce', 'rb_salzburg', 'sturm_graz', 'rangers_fc', 'celtic_fc', 'young_boys',
  'fc_basel', 'ferencvaros', 'red_star_belgrade', 'dinamo_zagreb', 'ludogorets',
  'malmo_ff', 'fcsb', 'maccabi_tel_aviv',
];

export function getChampionsParticipants(allClubs: Club[]): string[] {
  const fromLeagues = pickTopClubsByCountry(allClubs, CHAMPIONS_SLOTS, new Set());
  const fixedIds = CHAMPIONS_FIXED_CLUBS.filter(id => allClubs.some(c => c.id === id));
  return [...fromLeagues, ...fixedIds];
}

export function getEuropaParticipants(allClubs: Club[]): string[] {
  const championsIds = new Set(getChampionsParticipants(allClubs));
  const fromLeagues = pickTopClubsByCountry(allClubs, EUROPA_SLOTS, championsIds);
  const fixedIds = EUROPA_FIXED_CLUBS.filter(id => allClubs.some(c => c.id === id));
  return [...fromLeagues, ...fixedIds];
}

function resolveOneLegOfTie(tie: TwoLegTie, legToPlay: 'first' | 'second', clubs: Club[], forced?: ForcedResult): TwoLegTie {
  if (tie.played) return tie;
  if (legToPlay === 'first' && tie.firstLegGoalsA !== null) return tie;
  if (legToPlay === 'second' && tie.firstLegGoalsA === null) return tie;

  const homeId = legToPlay === 'first' ? tie.clubAId : tie.clubBId;
  const awayId = legToPlay === 'first' ? tie.clubBId : tie.clubAId;
  const isForcedMatch = forced && (homeId === forced.clubId || awayId === forced.clubId);
  let homeGoals: number, awayGoals: number;
  if (isForcedMatch && forced) {
    homeGoals = forced.isHome ? forced.goals : forced.opponentGoals;
    awayGoals = forced.isHome ? forced.opponentGoals : forced.goals;
  } else {
    const home = clubs.find(c => c.id === homeId);
    const away = clubs.find(c => c.id === awayId);
    if (!home || !away) return tie;
    ({ homeGoals, awayGoals } = simulateMatch(home, away));
  }

  if (legToPlay === 'first') {
    return { ...tie, firstLegGoalsA: homeGoals, firstLegGoalsB: awayGoals };
  }

  const secondLegGoalsA = awayGoals; // A juega de visitante en la vuelta
  const secondLegGoalsB = homeGoals; // B de local en la vuelta
  const aggA = tie.firstLegGoalsA! + secondLegGoalsA;
  const aggB = tie.firstLegGoalsB! + secondLegGoalsB;
  let winnerId: string;
  let penaltyShootout: PenaltyShootoutResult | undefined;
  if (aggA > aggB) winnerId = tie.clubAId;
  else if (aggB > aggA) winnerId = tie.clubBId;
  else {
    const clubA = clubs.find(c => c.id === tie.clubAId);
    const clubB = clubs.find(c => c.id === tie.clubBId);
    if (clubA && clubB) {
      penaltyShootout = simulatePenaltyShootout(clubA, clubB);
      winnerId = penaltyShootout.winnerId;
    } else {
      const strengthA = clubA ? clubStrength(clubA) : 50;
      const strengthB = clubB ? clubStrength(clubB) : 50;
      winnerId = Math.random() < strengthA / (strengthA + strengthB) ? tie.clubAId : tie.clubBId;
    }
  }
  return { ...tie, secondLegGoalsA, secondLegGoalsB, played: true, winnerId, penaltyShootout };
}

function seedSingleTwoLegRound(rankedClubIds: string[]): TwoLegTie[] {
  const pairs = rankedClubIds.length === 16 ? SEED_PAIRS_16 : SEED_PAIRS_8;
  return pairs.map(([a, b]) => ({
    clubAId: rankedClubIds[a],
    clubBId: rankedClubIds[b],
    firstLegGoalsA: null, firstLegGoalsB: null, secondLegGoalsA: null, secondLegGoalsB: null,
    played: false, winnerId: null,
  }));
}

// Resuelve UNA pierna (ida o vuelta, la que corresponda) de TODAS las
// llaves de una ronda plana (sin encadenar a la siguiente ronda) -- así es
// el playoff real: una sola ronda de 16->8, los ganadores no vuelven a
// cruzarse entre sí, se suman directo a los octavos.
function resolveSingleTwoLegRoundStep(ties: TwoLegTie[], clubs: Club[], forced?: ForcedResult): TwoLegTie[] {
  const anyPending = ties.some(t => !t.played);
  if (!anyPending) return ties;
  const legToPlay: 'first' | 'second' = ties.every(t => t.firstLegGoalsA !== null) ? 'second' : 'first';
  return ties.map(tie => resolveOneLegOfTie(tie, legToPlay, clubs, forced));
}

function seedTwoLegBracket(rankedClubIds: string[]): TwoLegBracket {
  return { tiesByRound: [seedSingleTwoLegRound(rankedClubIds)], championId: null };
}

// Igual que resolveSingleTwoLegRoundStep, pero encadena a la siguiente
// ronda (octavos -> cuartos -> semis -> final) hasta coronar campeón.
function resolveTwoLegRound(bracket: TwoLegBracket, clubs: Club[], forced?: ForcedResult): TwoLegBracket {
  const roundIdx = bracket.tiesByRound.length - 1;
  const currentRound = bracket.tiesByRound[roundIdx];
  const legToPlay: 'first' | 'second' = currentRound.every(t => t.firstLegGoalsA !== null) ? 'second' : 'first';
  const newRound = currentRound.map(tie => resolveOneLegOfTie(tie, legToPlay, clubs, forced));

  const tiesByRound = [...bracket.tiesByRound.slice(0, roundIdx), newRound];
  const roundComplete = newRound.every(t => t.played);
  if (!roundComplete) return { tiesByRound, championId: null };

  const winners = newRound.map(t => t.winnerId!);
  if (winners.length === 1) {
    return { tiesByRound, championId: winners[0] };
  }
  const nextRound: TwoLegTie[] = [];
  for (let i = 0; i < winners.length; i += 2) {
    nextRound.push({
      clubAId: winners[i], clubBId: winners[i + 1],
      firstLegGoalsA: null, firstLegGoalsB: null, secondLegGoalsA: null, secondLegGoalsB: null,
      played: false, winnerId: null,
    });
  }
  return { tiesByRound: [...tiesByRound, nextRound], championId: null };
}

function resolveUefaLeaguePhaseStep(
  fixtures: Fixture[], table: TableTeam[], clubs: Club[], forced?: ForcedResult
): { fixtures: Fixture[]; table: TableTeam[] } {
  const nextMw = fixtures.find(f => !f.played)?.matchweek;
  if (nextMw === undefined) return { fixtures, table };
  let newTable = table;
  const newFixtures = fixtures.map(f => {
    if (f.matchweek !== nextMw || f.played) return f;
    const isForcedMatch = forced && (f.homeTeamId === forced.clubId || f.awayTeamId === forced.clubId);
    let homeGoals: number, awayGoals: number;
    if (isForcedMatch && forced) {
      homeGoals = forced.isHome ? forced.goals : forced.opponentGoals;
      awayGoals = forced.isHome ? forced.opponentGoals : forced.goals;
    } else {
      const home = clubs.find(c => c.id === f.homeTeamId);
      const away = clubs.find(c => c.id === f.awayTeamId);
      if (!home || !away) return f;
      ({ homeGoals, awayGoals } = simulateMatch(home, away));
    }
    newTable = applyResultToTable(newTable, f.homeTeamId, f.awayTeamId, homeGoals, awayGoals);
    return { ...f, played: true, homeGoals, awayGoals };
  });
  return { fixtures: newFixtures, table: newTable };
}

function resolveUefaCupStep(cup: UefaCupState, allClubs: Club[], forced?: ForcedResult): UefaCupState {
  if (cup.stage === 'league_phase') {
    const allPlayed = cup.fixtures.every(f => f.played);
    if (allPlayed) {
      const ranked = sortTable(cup.table).map(t => t.clubId!);
      const playoffPool = ranked.slice(UEFA_TOP_DIRECT, UEFA_PLAYOFF_ZONE_END);
      if (playoffPool.length >= 2) {
        return resolveUefaCupStep({ ...cup, stage: 'playoff', playoff: seedSingleTwoLegRound(playoffPool) }, allClubs, forced);
      }
      // Campo chico (no llega a 24 clasificados): saltamos directo a octavos con el top 8.
      const direct = ranked.slice(0, UEFA_TOP_DIRECT);
      return resolveUefaCupStep({ ...cup, stage: 'knockout', knockout: seedTwoLegBracket(direct) }, allClubs, forced);
    }
    const { fixtures, table } = resolveUefaLeaguePhaseStep(cup.fixtures, cup.table, allClubs, forced);
    return { ...cup, fixtures, table };
  }

  if (cup.stage === 'playoff') {
    if (!cup.playoff) return cup;
    const roundDone = cup.playoff.every(t => t.played);
    if (roundDone) {
      const ranked = sortTable(cup.table).map(t => t.clubId!);
      const direct = ranked.slice(0, UEFA_TOP_DIRECT);
      const playoffWinners = cup.playoff.map(t => t.winnerId!);
      return resolveUefaCupStep({ ...cup, stage: 'knockout', knockout: seedTwoLegBracket([...direct, ...playoffWinners]) }, allClubs, forced);
    }
    const playoff = resolveSingleTwoLegRoundStep(cup.playoff, allClubs, forced);
    return { ...cup, playoff };
  }

  if (cup.stage === 'knockout') {
    if (!cup.knockout) return cup;
    if (cup.knockout.championId) {
      return { ...cup, stage: 'done', championId: cup.knockout.championId };
    }
    const knockout = resolveTwoLegRound(cup.knockout, allClubs, forced);
    return { ...cup, knockout };
  }

  return cup;
}

function freshUefaCupState(cupId: 'champions' | 'europa', year: number, allClubs: Club[], startedAtStep: number): UefaCupState {
  const participantIds = cupId === 'champions' ? getChampionsParticipants(allClubs) : getEuropaParticipants(allClubs);
  const shuffled = shuffle(participantIds);
  const fullSchedule = generateRoundRobin(shuffled);
  const fixtures = fullSchedule.filter(f => f.matchweek <= UEFA_LEAGUE_PHASE_MATCHDAYS);
  const participantClubs = participantIds.map(id => allClubs.find(c => c.id === id)).filter((c): c is Club => !!c);
  return {
    cupId, year, participants: participantIds,
    fixtures, table: buildInitialTable(participantClubs),
    stage: 'league_phase', playoff: null, knockout: null, championId: null, stepsConsumed: 0, startedAtStep,
  };
}

// A diferencia de Libertadores/Sudamericana, una edición completa (~19
// semanas de copa) no entra en un solo "año" de 38 semanas -- así que acá
// NO se indexa por año calendario ni se limita el catch-up a ese año. Se
// cuenta el total de semanas de copa transcurridas desde el arranque de la
// carrera (cupWeeksElapsedTotal, no se reinicia nunca) y se compara contra
// startedAtStep + stepsConsumed de la edición actual; si esa edición ya
// terminó y todavía queda presupuesto de pasos, se arranca la siguiente
// edición en el mismo llamado (así el campeón cambia de año a año como
// corresponde, sin quedar nunca "pegado").
export function getOrCreateUefaCupState(
  cupId: 'champions' | 'europa', allClubs: Club[],
  existing: UefaCupState | undefined, currentWeek: number
): UefaCupState {
  let cup = existing ?? freshUefaCupState(cupId, 1, allClubs, 0);
  const totalStepsAvailable = cupWeeksElapsedTotal(currentWeek);

  while (cup.startedAtStep + cup.stepsConsumed < totalStepsAvailable) {
    if (cup.stage === 'done') {
      cup = freshUefaCupState(cupId, cup.year + 1, allClubs, cup.startedAtStep + cup.stepsConsumed);
      continue;
    }
    cup = { ...resolveUefaCupStep(cup, allClubs), stepsConsumed: cup.stepsConsumed + 1 };
  }
  return cup;
}

export function resolveUefaCupWeek(
  cup: UefaCupState, allClubs: Club[], playerClubId: string,
  playerIsHome: boolean, playerGoals: number, opponentGoals: number
): UefaCupState {
  const updated = resolveUefaCupStep(cup, allClubs, { clubId: playerClubId, isHome: playerIsHome, goals: playerGoals, opponentGoals });
  return { ...updated, stepsConsumed: (cup.stepsConsumed ?? 0) + 1 };
}

function findUpcomingTwoLegMatch(ties: TwoLegTie[], clubId: string): { opponentId: string; isHome: boolean } | null {
  const tie = ties.find(t => (t.clubAId === clubId || t.clubBId === clubId) && !t.played);
  if (!tie) return null;
  const legToPlay: 'first' | 'second' = ties.every(t => t.firstLegGoalsA !== null) ? 'second' : 'first';
  if (legToPlay === 'first' && tie.firstLegGoalsA !== null) return null;
  if (legToPlay === 'second' && tie.firstLegGoalsA === null) return null;
  if (legToPlay === 'first') {
    return tie.clubAId === clubId ? { opponentId: tie.clubBId, isHome: true } : { opponentId: tie.clubAId, isHome: false };
  }
  return tie.clubBId === clubId ? { opponentId: tie.clubAId, isHome: true } : { opponentId: tie.clubBId, isHome: false };
}

export function getUpcomingUefaCupMatch(cup: UefaCupState, clubId: string): { opponentId: string; isHome: boolean } | null {
  if (cup.stage === 'league_phase') {
    const nextMw = cup.fixtures.find(f => !f.played)?.matchweek;
    if (nextMw === undefined) return null;
    const fx = cup.fixtures.find(f => f.matchweek === nextMw && (f.homeTeamId === clubId || f.awayTeamId === clubId));
    if (!fx) return null;
    return fx.homeTeamId === clubId ? { opponentId: fx.awayTeamId, isHome: true } : { opponentId: fx.homeTeamId, isHome: false };
  }
  if (cup.stage === 'playoff' && cup.playoff) {
    return findUpcomingTwoLegMatch(cup.playoff, clubId);
  }
  if (cup.stage === 'knockout' && cup.knockout && !cup.knockout.championId) {
    const currentRound = cup.knockout.tiesByRound[cup.knockout.tiesByRound.length - 1];
    return findUpcomingTwoLegMatch(currentRound, clubId);
  }
  return null;
}

// ==========================================================================
// MUNDIAL (cada 4 años) -- 48 selecciones, 12 grupos de 4 a una sola vuelta
// (3 fechas), top 2 + mejores 8 terceros -> Ronda de 32 -> octavos -> cuartos
// -> semis -> final, todo a partido único (sin ida y vuelta, a diferencia de
// las copas de clubes UEFA). Reutiliza CupGroup/PlayoffBracket/seedBracket/
// resolveBracketRound/resolveCupGroupsStep tal cual -- ver nota en
// WorldCupState (types.ts) sobre las simplificaciones deliberadas.
// ==========================================================================

export function isWorldCupYear(year: number): boolean {
  return (year - 1) % 4 === 0; // años 1, 5, 9, 13... de la carrera
}

function drawWorldCupGroups(teamIds: string[], allTeams: Club[]): CupGroup[] {
  const shuffled = shuffle(teamIds);
  const groups: CupGroup[] = [];
  for (let g = 0; g < 12; g++) {
    const clubIds = shuffled.slice(g * 4, g * 4 + 4);
    const groupTeams = clubIds.map(id => allTeams.find(c => c.id === id)).filter((c): c is Club => !!c);
    groups.push({
      id: String.fromCharCode(65 + g), // 'A'..'L'
      clubIds,
      table: buildInitialTable(groupTeams),
      fixtures: generateSingleRound(clubIds), // una sola vuelta = 3 fechas
    });
  }
  return groups;
}

function seedFromWorldCupGroups(groups: CupGroup[]): string[] {
  const winners = groups.map(g => sortTable(g.table)[0].clubId!);
  const runnersUp = groups.map(g => sortTable(g.table)[1].clubId!);
  const bestThirds = groups
    .map(g => sortTable(g.table)[2])
    .sort((a, b) => (b.puntos - a.puntos) || ((b.gf - b.gc) - (a.gf - a.gc)) || (b.gf - a.gf))
    .slice(0, 8)
    .map(row => row.clubId!);
  return [...winners, ...runnersUp, ...bestThirds]; // 12 + 12 + 8 = 32
}

function resolveWorldCupStep(cup: WorldCupState, allTeams: Club[], forced?: ForcedResult): WorldCupState {
  if (cup.stage === 'groups') {
    const allPlayed = cup.groups.every(g => g.fixtures.every(f => f.played));
    if (allPlayed) {
      const seeded = seedFromWorldCupGroups(cup.groups);
      return resolveWorldCupStep({ ...cup, stage: 'knockout', knockout: seedBracket(seeded) }, allTeams, forced);
    }
    return { ...cup, groups: resolveCupGroupsStep(cup.groups, allTeams, forced) };
  }
  if (cup.stage === 'knockout') {
    if (cup.knockout?.championId) {
      return { ...cup, stage: 'done', championId: cup.knockout.championId };
    }
    return { ...cup, knockout: resolveBracketRound(cup.knockout!, allTeams, forced) };
  }
  return cup; // 'done'
}

function freshWorldCupState(year: number, allTeams: Club[]): WorldCupState {
  const teamIds = allTeams.map(t => t.id); // el array pasado ya son las 48 selecciones clasificadas
  return {
    year,
    groups: drawWorldCupGroups(teamIds, allTeams),
    stage: 'groups',
    knockout: null,
    championId: null,
    stepsConsumed: 0,
  };
}

export function getOrCreateWorldCupState(
  year: number,
  allTeams: Club[],
  existing: WorldCupState | undefined,
  currentWeek: number
): WorldCupState {
  let cup = existing ?? freshWorldCupState(year, allTeams);
  let stepsConsumed = existing?.stepsConsumed ?? 0;
  const targetSteps = cupWeeksElapsedInYear(year, currentWeek);

  while (stepsConsumed < targetSteps && cup.stage !== 'done') {
    cup = resolveWorldCupStep(cup, allTeams);
    stepsConsumed++;
  }
  return { ...cup, stepsConsumed };
}

export function resolveWorldCupWeek(
  cup: WorldCupState,
  allTeams: Club[],
  playerTeamId: string,
  playerIsHome: boolean,
  playerGoals: number,
  opponentGoals: number
): WorldCupState {
  const updated = resolveWorldCupStep(cup, allTeams, { clubId: playerTeamId, isHome: playerIsHome, goals: playerGoals, opponentGoals });
  return { ...updated, stepsConsumed: (cup.stepsConsumed ?? 0) + 1 };
}

export function getUpcomingWorldCupMatch(cup: WorldCupState, teamId: string): { opponentId: string; isHome: boolean } | null {
  if (cup.stage === 'groups') {
    const nextMw = Math.min(...cup.groups.map(g => g.fixtures.find(f => !f.played)?.matchweek ?? Infinity));
    if (nextMw === Infinity) return null;
    for (const g of cup.groups) {
      const fx = g.fixtures.find(f => f.matchweek === nextMw && (f.homeTeamId === teamId || f.awayTeamId === teamId));
      if (fx) return fx.homeTeamId === teamId ? { opponentId: fx.awayTeamId, isHome: true } : { opponentId: fx.homeTeamId, isHome: false };
    }
    return null;
  }
  if (cup.stage === 'knockout' && cup.knockout && !cup.knockout.championId) {
    const currentRound = cup.knockout.matchesByRound[cup.knockout.matchesByRound.length - 1];
    const m = currentRound.find(mm => !mm.played && (mm.homeTeamId === teamId || mm.awayTeamId === teamId));
    if (!m) return null;
    return m.homeTeamId === teamId ? { opponentId: m.awayTeamId, isHome: true } : { opponentId: m.homeTeamId, isHome: false };
  }
  return null;
}

export function resolvePlayerWeekForLeague(
  season: LeagueSeasonState,
  leagueClubs: Club[],
  currentWeek: number,
  playerClubId: string,
  playerIsHome: boolean,
  playerGoals: number,
  opponentGoals: number
): LeagueSeasonState {
  const format = isApeturaClausuraLeague(leagueClubs[0].league);
  if (format) {
    return resolveApeturaClausuraWeek(season, leagueClubs, currentWeek, format, playerClubId, playerIsHome, playerGoals, opponentGoals);
  }
  return resolvePlayerMatchweek(season, leagueClubs, currentWeek, playerClubId, playerIsHome, playerGoals, opponentGoals);
}
