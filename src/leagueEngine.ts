import { Club, CuadrangularesState, Fixture, LeagueSeasonState, PlayoffBracket, TableTeam } from './types';

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
  const pairs = rankedClubIds.length === 16 ? SEED_PAIRS_16 : SEED_PAIRS_8;
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
      if (homeGoals === awayGoals) homeGoals += 1; // sin empates en eliminación directa
    }
    return { ...m, played: true, homeGoals, awayGoals };
  });

  const matchesByRound = [...bracket.matchesByRound.slice(0, roundIdx), currentRound];
  const roundComplete = currentRound.every(m => m.played);
  if (!roundComplete) return { matchesByRound, championId: null };

  const winners = currentRound.map(m => (m.homeGoals! > m.awayGoals! ? m.homeTeamId : m.awayTeamId));
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
