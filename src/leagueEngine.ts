import { Club, CupGroup, CupState, Fixture, LeagueSeasonState, PenaltyShootoutResult, PlayoffBracket, TableTeam, TwoLegBracket, TwoLegTie, UefaCupState, WorldCupState } from './types';
import type { DomesticCupState } from './copaNacional';
import { participantesConmebol, type CampeonesConmebol, type PosicionesFinales } from './copasConmebol';
import { participantesUefa, type CampeonesUefa } from './copasUefa';
import { GRUPOS_MUNDIAL_2026 } from './mundialReal';
import { competicionEnTemporada, ligaDeClubes, partidosDePlayoff } from './seasonCalendar';
import { participantesConcacaf } from './copaConcacaf';
import { ALIAS_CALENDARIO } from './clubAliases';
import { displayName } from './worldRetirements';

// Resultado forzado del partido que el usuario realmente jugó esta semana (en vez de simularlo al
// azar como el resto de los cruces). shootoutOverride es opcional: si tu partido forzado terminó
// en empate Y jugaste una tanda de penales interactiva (ver InteractivePenaltyShootout.tsx), acá
// va el resultado REAL que jugaste, para que el bracket no tire su propio dado y quede
// inconsistente con lo que viste en pantalla -- ver resolveBracketRound/resolveOneLegOfTie.
export type ForcedResult = {
  clubId: string;
  isHome: boolean;
  goals: number;
  opponentGoals: number;
  shootoutOverride?: PenaltyShootoutResult;
};
// EL RELOJ DE SEMANAS YA NO EXISTE.
//
// Acá vivían SEASON_LENGTH_WEEKS (52), isCupWeek, weekInSeason, getSeasonYear, getRealDate,
// isWorldCupBreakWeek, cupWeeksElapsed*, leagueMatchweeksElapsed* y las ventanas de fichajes por
// número de semana. Eran la SEGUNDA forma de contar el tiempo del juego, y de esa convivencia
// salieron casi todos los bugs de calendario: el mismo número se leía como "la N-ésima fecha que
// jugás" en un lado y como "semana N, 52 por año" en el otro.
//
// Se fueron entre el 11 y el 12 de agosto de 2026, en siete tramos. Hoy el tiempo lo dice el
// calendario y nadie más: ver dateSchedule.ts (temporadaDeCarrera, fechaDelPaso, esDiaDeCopa,
// enVentanaDelMundial, mercadoAbierto) y el trinquete de scripts/validar_un_calendario.ts, que
// falla si alguno vuelve a aparecer.

export const CAREER_START_YEAR = 2026;
const CAREER_START_MONTH = 0; // enero (0-indexado)
const CAREER_START_DAY = 18;

// Acá vivían getRealDate y formatRealDate: traducían "semana N de la carrera" a una fecha,
// anclando el año a getSeasonYear y moviendo el día siete por semana. Eran el reloj de semanas
// hecho fecha, y siempre iban por su lado -- en el paso 18 del Junior (9 de abril de verdad)
// daban mediados de mayo. Borradas el 12 de agosto de 2026: la fecha de un paso la da el
// calendario (fechaDelPaso en dateSchedule.ts) y no hay una segunda respuesta posible.

const MONTH_NAMES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];







// División "real" de cada club en la partida en curso. CLUBS_DATABASE es estático, así que cuando
// un club asciende o desciende (ver promocionDescenso.ts) el cambio se guarda acá y se aplica
// encima. Se registra una sola vez, al cargar/actualizar el perfil, para que todo el motor lo vea
// sin tener que pasarle el perfil a cada función.
let divisionOverrides: Record<string, 1 | 2> = {};
// Acá vivían getRealDateForLeagueStepsAhead/Behind y getRealDateForCupStepsAhead/Behind: cuatro
// funciones que traducían "dentro de N jornadas" a una fecha caminando el reparto isCupWeek.
// Eran la fuente del calendario en pantalla para los clubes SIN fechas propias. Borradas el 12
// de agosto de 2026 junto con esa vista: ahora la fecha de un partido la dice el calendario y
// nada más (fixturesAtStep).


export function setDivisionOverrides(overrides: Record<string, 1 | 2> | undefined): void {
  divisionOverrides = overrides ?? {};
}

/** La división en la que juega HOY el club, contando ascensos y descensos ya ocurridos. */
export function divisionActual(club: Club): 1 | 2 | 3 {
  return divisionOverrides[club.id] ?? club.division ?? 1;
}

export function leagueKeyFor(club: Club): string {
  return `${club.league}-${divisionActual(club)}`;
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
export function generateRoundRobin(clubIds: string[]): Fixture[] {
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

export function buildInitialTable(clubs: Club[]): TableTeam[] {
  return clubs.map(c => ({ clubId: c.id, name: c.name, puntos: 0, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 }));
}

export function applyResultToTable(table: TableTeam[], homeId: string, awayId: string, homeGoals: number, awayGoals: number): TableTeam[] {
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

// n = cantidad de partidos/llaves en la ronda de playoffs actual -- deriva el nombre real de la
// ronda sin tener que llevar un campo aparte (4 llaves = Cuartos, 2 = Semifinal, 1 = Final, etc.)
export function roundLabelByMatchCount(n: number): string {
  if (n === 1) return 'Final';
  if (n === 2) return 'Semifinal';
  if (n === 4) return 'Cuartos';
  if (n === 8) return 'Octavos';
  return `Ronda de ${n * 2}`;
}

// Fuerza de un club para la simulación de fondo. Escala ~20-100, donde 100 es el mejor del mundo.
//
// Antes era reputation*20 + log10(marketValue)*10, y el logaritmo aplastaba la jerarquía: el
// Manchester City (1.441M) sacaba 191,6 y el Everton (500M) 167 -- tener 7 veces más plantel valía
// 4 puntos de fuerza. Con esa escala la tabla salía plana y el campeón era cualquiera: en la
// simulación de fondo el Everton ganaba la Premier con 65 puntos y el City quedaba 4º.
//
// Ahora el valor de mercado se compara con el de un club grande de referencia (1.000M) en escala
// lineal, no logarítmica, así 1.441M pesa de verdad más que 500M. La reputación sigue mandando
// (es el dato curado de data.ts) y el valor ajusta dentro de esa categoría.
const REFERENCE_SQUAD_VALUE = 1_000_000_000;

// Se exporta porque el mercado de pases la usa para saber cuánto vale ficharte (ver requisitosDe en
// transferMarket.ts). Antes el mercado medía por `reputation` sola, que va de 1 a 5, y ahí Junior,
// Millonarios, Real Madrid y el City eran todos 5: un club colombiano y un gigante europeo pedían
// exactamente lo mismo. La fuerza ya distinguía a los dos para simular partidos (58 contra 85), sólo
// que el mercado no la estaba mirando.
export function clubStrength(club: Club): number {
  const repScore = club.reputation * 11;                              // 11-55
  // Raíz cuadrada: sigue premiando al plantel caro, pero sin que la distancia entre el 5º y el
  // último se vuelva un abismo. Con proporción lineal pura el colista terminaba con 8 puntos.
  const valueRatio = Math.sqrt(Math.min(1, club.marketValue / REFERENCE_SQUAD_VALUE));
  return repScore + valueRatio * 30;                                  // +0-30
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
  // Los goles esperados salen de la DIFERENCIA de fuerza, no de la proporción sobre el total.
  // Con proporción, strength/total se queda siempre cerca de 0,5 aunque un equipo doble al otro, y
  // el favorito apenas marcaba más que el débil: la Premier terminaba con 6 puntos entre el 1º y el
  // 5º y salía campeón cualquiera.
  const gap = clubStrength(home) + HOME_ADVANTAGE_STRENGTH - clubStrength(away);
  // ±30 de fuerza (grande contra chico) mueve el marcador ~0,9 goles por lado. El tope de 0,9 evita
  // que un recién ascendido quede sin ninguna chance: en la realidad hasta el colista roba puntos,
  // y con un tope más alto terminaba la temporada con menos de 10.
  const swing = Math.max(-0.9, Math.min(0.9, gap / 30));
  const homeExpected = Math.max(0.25, 1.45 + swing);
  const awayExpected = Math.max(0.25, 1.25 - swing);
  return { homeGoals: poissonSample(homeExpected), awayGoals: poissonSample(awayExpected) };
}

// Jugar de local, expresado en la misma escala que clubStrength (~20-100).
const HOME_ADVANTAGE_STRENGTH = 4;

// Tanda de penales real (no un coin-flip invisible): 5 tiros por lado alternando A/B, y si sigue
// igualado, muerte súbita de a un tiro por lado hasta que quede desnivelado. La conversión ronda
// el 78% real de las tandas profesionales, con un pequeño empujón para el equipo más fuerte.
export function simulatePenaltyShootout(clubA: Club, clubB: Club): PenaltyShootoutResult {
  const strengthA = clubStrength(clubA);
  const strengthB = clubStrength(clubB);
  // El divisor acompaña la escala de clubStrength (~20-100): con el /400 de la escala vieja, que
  // llegaba a ~190, la diferencia entre un grande y un chico quedaba en menos de 1 punto porcentual.
  const convChance = (strength: number, otherStrength: number) =>
    Math.max(0.6, Math.min(0.92, 0.78 + (strength - otherStrength) / 200));

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




// ==========================================================================
// --- FORMATO APERTURA/CLAUSURA (Colombia y Argentina) ---
// Un semestre real (Apertura o Clausura) son 6 meses de calendario -- acá
// eso son las primeras/segundas 19 semanas del año de 38 (ver SEASON_LENGTH_WEEKS),
// de las que 1 de cada 3 es semana de copa (isCupWeek): quedan exactamente
// 13 semanas de liga disponibles por semestre. Cada paso de
// resolveApeturaClausuraStep (una fecha de fase regular, o una ida/vuelta de
// playoff) consume UNA semana de liga, así que la fase regular + el knockout
// completo tienen que sumar ≤13 pasos o el semestre no alcanza a terminar
// dentro de sus 19 semanas de calendario -- el Clausura nunca llegaría a
// arrancar y el Apertura se "comería" el año entero (bug reportado: "la liga
// colombiana se juega la apertura todo el año").
//
// Colombia: fase regular corta de todos-contra-todos parcial (7 fechas, no
// el ciclo completo de 19 que exigiría un round-robin contra los 19 rivales)
// -> top 8 por tabla -> Cuartos, Semifinal y Final, TODO a ida y vuelta
// (formato real vigente desde 2024, 6 pasos) -- ver twoLegKnockout en
// LeagueSeasonState (types.ts). Total: 7+6=13 pasos.
// Argentina: 2 zonas de 15 -> todos-contra-todos intra-zona parcial (9
// fechas) -> top 8 por zona (16 en total) -> eliminación directa a partido
// único (4 rondas). Total: 9+4=13 pasos.
// ==========================================================================

// Fechas de fase regular de cada torneo, según el reglamento real (ver docs/REGLAMENTO_*.md):
//
//   Argentina (AFA/LPF): dos zonas de 15 a una rueda = 15 fechas + 1 interzonal = 16. Coincide con
//     el calendario importado de Transfermarkt, que trae exactamente 16 jornadas de 15 partidos.
//   Colombia (Dimayor): todos contra todos, 20 fechas.
//
// Antes eran 9 y 7. Ese recorte venía de un presupuesto de "13 pasos por semestre" que salía de
// gastar UNA semana de calendario por fecha, saltando las semanas de copa (isCupWeek). Con ese
// límite el torneo argentino se jugaba a poco más de la mitad y los campeones salían con puntajes
// imposibles (12 puntos). En la realidad liga y copa se juegan en la misma semana -- el calendario
// real ya lo hace, el Barcelona tiene 11 semanas con liga y Champions a la vez -- así que el
// presupuesto no existe: ver getOrCreateApeturaClausuraSeason.
//
// Colombia pasó de 20 a 19: la fase regular es todos contra todos entre 20 clubes, o sea 19 fechas,
// y los partidos que sobran en el calendario real son los PLAYOFFS. Con 20 el motor pedía una fecha
// que el calendario real no tenía, y al simular una carrera del Junior la tabla dejaba de sumar
// partidos desde mayo: el jugador seguía jugando fechas reales que ya no entraban en ninguna tabla.
const REGULAR_PHASE_MATCHDAYS: Record<'colombia' | 'argentina', number> = {
  colombia: 19,
  argentina: 16,
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

// Algoritmo del círculo: reparte los rivales de cada club a lo largo de las rondas sin
// repetirlos. Si maxMatchdays es menor que el ciclo completo (n-1 rondas), se corta ahí --
// cada club no llega a jugar contra todos sus rivales, pero eso es intencional: la fase
// regular de Apertura/Clausura tiene que caber en el presupuesto de semanas de liga de UN
// semestre (ver REGULAR_PHASE_MATCHDAYS), no en el ciclo completo de round-robin.
function generateSingleRound(clubIds: string[], maxMatchdays?: number): Fixture[] {
  const teams = clubIds.length % 2 === 0 ? [...clubIds] : [...clubIds, '__BYE__'];
  const n = teams.length;
  const porRueda = n - 1;
  const objetivo = maxMatchdays ?? porRueda;
  let arr = [...teams];
  const fixtures: Fixture[] = [];

  // Se dan tantas ruedas como haga falta para llegar a las fechas pedidas, invirtiendo la localía
  // en cada una. Antes se topaba en `n - 1` (una sola rueda) y las divisiones chicas quedaban con
  // un torneo a medias: la Segunda colombiana tiene 14 clubes, así que pedía 19 fechas y generaba
  // 13 -- el jugador terminaba el semestre con 13 partidos y la tabla se congelaba ahí.
  for (let round = 0; round < objetivo; round++) {
    const rueda = Math.floor(round / porRueda);   // 0 = ida, 1 = vuelta, ...
    // Cada rueda arranca de nuevo el giro del round-robin, o los cruces se repetirían salteados.
    if (round % porRueda === 0) arr = [...teams];

    for (let i = 0; i < n / 2; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (a !== '__BYE__' && b !== '__BYE__') {
        // La localía alterna por PAREJA dentro de la fecha y se invierte entera en la rueda de
        // vuelta, así el que fue local en la ida es visitante en la revancha. Alternar por fecha
        // entera dejaba a un club 12-7; alternar por fecha Y pareja a la vez era peor todavía
        // (algunos clubes jugaban las 19 de local).
        const local = (i % 2 === 0) !== (rueda % 2 === 1);
        const [home, away] = local ? [a, b] : [b, a];
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
  forced?: ForcedResult
): PlayoffBracket {
  const roundIdx = bracket.matchesByRound.length - 1;
  const currentRound = bracket.matchesByRound[roundIdx].map(m => {
    if (m.played) return m;
    const isForcedMatch = forced && (m.homeTeamId === forced.clubId || m.awayTeamId === forced.clubId);
    let homeGoals: number, awayGoals: number;
    if (isForcedMatch && forced) {
      // La localía la manda el cruce, no forced.isHome: ese flag viene de la UI y si discrepa
      // el resultado entra dado vuelta (un 3-0 tuyo se anota 0-3 en contra).
      const yoSoyLocal = m.homeTeamId === forced.clubId;
      homeGoals = yoSoyLocal ? forced.goals : forced.opponentGoals;
      awayGoals = yoSoyLocal ? forced.opponentGoals : forced.goals;
    } else {
      const home = clubs.find(c => c.id === m.homeTeamId);
      const away = clubs.find(c => c.id === m.awayTeamId);
      if (!home || !away) return m;
      ({ homeGoals, awayGoals } = simulateMatch(home, away));
    }
    if (homeGoals === awayGoals) {
      // Sin empates en eliminación directa: se define con una tanda de penales real, no un
      // "+1 gol" invisible (eso además castigaba injustamente al local en tu propio partido).
      // Si el partido forzado (el tuyo) empató y jugaste la tanda en vivo, ese resultado real
      // manda sobre el dado del motor -- ver ForcedResult.shootoutOverride.
      if (isForcedMatch && forced?.shootoutOverride) {
        return { ...m, played: true, homeGoals, awayGoals, penaltyShootout: forced.shootoutOverride };
      }
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
  // Se resuelve la ronda y se CORTA acá, sin armar la siguiente en el mismo paso -- mismo motivo
  // que en resolveTwoLegRound (Colombia): si el partido del jugador completaba la última llave
  // pendiente, esta función armaba la ronda siguiente en la misma llamada y el partido jugado
  // "desaparecía" de tiesByRound/matchesByRound antes de que la pantalla pudiera mostrarlo.
  if (!roundComplete) return { matchesByRound, championId: null };
  const winners = currentRound.map(m => m.penaltyShootout ? m.penaltyShootout.winnerId : (m.homeGoals! > m.awayGoals! ? m.homeTeamId : m.awayTeamId));
  if (winners.length === 1) {
    return { matchesByRound, championId: winners[0] };
  }
  return { matchesByRound, championId: null };
}

/** Arma la ronda siguiente del knockout de liga (Argentina, partido único) tras la ya jugada. */
function siguienteRondaBracket(bracket: PlayoffBracket): PlayoffBracket {
  const roundIdx = bracket.matchesByRound.length - 1;
  const currentRound = bracket.matchesByRound[roundIdx];
  if (bracket.championId || !currentRound.every(m => m.played)) return bracket;
  const winners = currentRound.map(m => m.penaltyShootout ? m.penaltyShootout.winnerId : (m.homeGoals! > m.awayGoals! ? m.homeTeamId : m.awayTeamId));
  const nextRound = [];
  for (let i = 0; i < winners.length; i += 2) {
    nextRound.push({ homeTeamId: winners[i], awayTeamId: winners[i + 1], played: false, homeGoals: null, awayGoals: null });
  }
  return { matchesByRound: [...bracket.matchesByRound, nextRound], championId: null };
}

function freshRegularPhase(clubs: Club[], format: 'colombia' | 'argentina', semester: 1 | 2, semesterStartWeek: number): LeagueSeasonState {
  const leagueKey = leagueKeyFor(clubs[0]);
  if (format === 'colombia') {
    const clubIds = shuffle(clubs.map(c => c.id));
    return {
      leagueKey,
      fixtures: generateSingleRound(clubIds, REGULAR_PHASE_MATCHDAYS.colombia),
      table: buildInitialTable(clubs),
      round: 0,
      semester,
      semesterStartWeek,
      stage: 'regular',
    };
  }
  // Argentina: 2 zonas, fixture combinado (matchweek de ambas zonas comparten número de fecha)
  const { zoneA, zoneB } = assignArgentinaZones(shuffle(clubs.map(c => c.id)));
  const fixturesA = generateSingleRound(zoneA, REGULAR_PHASE_MATCHDAYS.argentina);
  const fixturesB = generateSingleRound(zoneB, REGULAR_PHASE_MATCHDAYS.argentina);
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

// Resuelve UN paso (una fecha de fase regular, o una ronda/pierna de
// playoffs) de la temporada. Si currentWeek ya alcanzó el final de una
// etapa, transiciona a la siguiente (playoffs, o al semestre siguiente) y
// resuelve el primer paso de esa nueva etapa en la misma llamada, para no
// "perder" la semana.
function resolveApeturaClausuraStep(
  season: LeagueSeasonState,
  clubs: Club[],
  currentWeek: number,
  format: 'colombia' | 'argentina',
  forced?: ForcedResult
): LeagueSeasonState {
  const stage = season.stage ?? 'regular';

  if (stage === 'regular') {
    // Basado en el estado real de los fixtures (próxima fecha sin jugar), NO
    // en aritmética de currentWeek — así el catch-up (que llama a esta
    // función muchas veces seguidas con el mismo currentWeek "objetivo")
    // avanza fecha a fecha en vez de recalcular siempre la misma fecha.
    const nextMw = season.fixtures.find(f => !f.played)?.matchweek;

    if (nextMw === undefined) {
      // Fase regular terminada: se ARMA el cuadro y se corta acá. Antes se encadenaba una llamada
      // recursiva que resolvía la primera ronda en el mismo paso, así que el jugador clasificaba a
      // cuartos y su partido se jugaba solo: aparecía eliminado sin haberlo jugado. La primera
      // ronda se juega en el paso siguiente, que es cuando la pantalla se la ofrece.
      if (format === 'colombia') {
        // Formato real vigente desde 2024, igual en Apertura y Clausura: Cuartos, Semifinal y
        // Final, TODO a ida y vuelta -- ver twoLegKnockout más abajo.
        const top8 = sortTable(season.table).slice(0, 8).map(r => r.clubId!);
        return { ...season, stage: 'knockout', twoLegKnockout: seedTwoLegBracket(top8) };
      }
      // Argentina: top 8 de cada zona por separado
      const { zoneA, zoneB } = assignArgentinaZones(clubs.map(c => c.id));
      const zoneTable = (zoneIds: string[]) => sortTable(season.table.filter(r => zoneIds.includes(r.clubId!)));
      const top8A = zoneTable(zoneA).slice(0, 8).map(r => r.clubId!);
      const top8B = zoneTable(zoneB).slice(0, 8).map(r => r.clubId!);
      const rankedClubIds = [...top8A, ...top8B]; // 16 equipos, seed 1-16 (zona A primero, zona B después)
      return { ...season, stage: 'knockout', knockout: seedBracket(rankedClubIds) };
    }

    let fixtures = season.fixtures;
    let table = season.table;
    fixtures = fixtures.map(fx => {
      if (fx.matchweek !== nextMw || fx.played) return fx;
      const isForcedMatch = forced && (fx.homeTeamId === forced.clubId || fx.awayTeamId === forced.clubId);
      let homeGoals: number, awayGoals: number;
      if (isForcedMatch && forced) {
        // Quién es local lo decide el FIXTURE, no forced.isHome. Ese flag viene de la UI y puede no
        // coincidir (en Argentina el rival se elige con getUpcomingApeturaClausuraMatch, pero si el
        // club no tiene partido en esa fecha la pantalla cae a un amistoso y sortea la localía).
        // Cuando discrepaban, el resultado entraba DADO VUELTA: un 3-0 tuyo se anotaba 0-3 en
        // contra. Ganando todos los partidos 3-0, River terminaba con 4 victorias y 4 derrotas.
        const yoSoyLocal = fx.homeTeamId === forced.clubId;
        homeGoals = yoSoyLocal ? forced.goals : forced.opponentGoals;
        awayGoals = yoSoyLocal ? forced.opponentGoals : forced.goals;
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
    if (format === 'colombia') {
      const bracket = season.twoLegKnockout!;
      if (bracket.championId) {
        return startNextSemester(season, clubs, currentWeek, format, forced);
      }
      // La ronda actual ya está completa (todas las llaves jugadas) pero sin campeón todavía: hay
      // que ARMAR la ronda siguiente y cortar acá, sin resolverla en el mismo paso -- mismo patrón
      // que fase regular -> knockout. Sin esto, resolveTwoLegRound armaba Y resolvía la ronda
      // siguiente de una, así que el partido del jugador (que recién pasó de ronda) se jugaba solo.
      const rondaActualCompleta = bracket.tiesByRound[bracket.tiesByRound.length - 1].every(t => t.played);
      if (rondaActualCompleta) {
        return { ...season, twoLegKnockout: siguienteRondaTwoLeg(bracket) };
      }
      const updatedBracket = resolveTwoLegRound(bracket, clubs, forced);
      return { ...season, twoLegKnockout: updatedBracket };
    }
    const bracket = season.knockout!;
    if (bracket.championId) {
      return startNextSemester(season, clubs, currentWeek, format, forced);
    }
    // Mismo corte que en Colombia (twoLegKnockout) unas líneas más arriba.
    const rondaActualCompletaArg = bracket.matchesByRound[bracket.matchesByRound.length - 1].every(m => m.played);
    if (rondaActualCompletaArg) {
      return { ...season, knockout: siguienteRondaBracket(bracket) };
    }
    const updatedBracket = resolveBracketRound(bracket, clubs, forced);
    return { ...season, knockout: updatedBracket };
  }

  return season;
}

function startNextSemester(
  season: LeagueSeasonState,
  clubs: Club[],
  currentWeek: number,
  format: 'colombia' | 'argentina',
  forced?: ForcedResult
): LeagueSeasonState {
  const nextSemester: 1 | 2 = season.semester === 1 ? 2 : 1;
  const fresh = freshRegularPhase(clubs, format, nextSemester, currentWeek);
  return resolveApeturaClausuraStep(fresh, clubs, currentWeek, format, forced);
}



/**
 * La temporada ya no tiene nada por jugar y hay que arrancar la siguiente.
 *
 * Ojo con la fase regular: quedarse sin fechas NO es el final del semestre, es el momento en que
 * empiezan los cuadrangulares. Darla por agotada ahí saltaba los playoffs enteros -- el semestre
 * pasaba de regular a regular y nunca había campeón de Apertura ni de Clausura.
 */
function temporadaAgotada(season: LeagueSeasonState): boolean {
  const stage = season.stage ?? 'regular';
  if (stage === 'knockout') {
    if (season.twoLegKnockout) return !!season.twoLegKnockout.championId;
    if (season.knockout) return !!season.knockout.championId;
    return true;
  }
  return stage === 'done';
}

/** La fase regular terminó y toca armar los playoffs (no confundir con temporadaAgotada). */
function faseRegularTerminada(season: LeagueSeasonState): boolean {
  return (season.stage ?? 'regular') === 'regular'
    && season.fixtures.length > 0
    && !season.fixtures.some(f => !f.played);
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
  // No se pre-genera NADA: resolveLigaPorFecha resuelve, en cada paso, todo lo pendiente hasta la
  // fecha de hoy. La tabla arranca vacía y la llena el calendario.
  //
  // Acá abajo había dos ramas más -- getOrCreateApeturaClausuraSeason y getOrCreateLeagueSeason --
  // que generaban un fixture sintético por SEMANAS para los clubes sin calendario. Desde que sólo
  // se puede hacer carrera en clubes con fechas propias (ver clubesJugables.ts) no las alcanza
  // nadie: medido, las 27 ligas jugables entran por ligaDeClubes. Eran el último resto del otro
  // motor, y con ellas se fueron sus contadores por semana.
  return existing ?? {
    leagueKey: leagueKeyFor(leagueClubs[0]),
    fixtures: [],
    table: buildInitialTable(leagueClubs),
    round: 0,
  };
}



// ==========================================================================
// --- COPA LIBERTADORES / COPA SUDAMERICANA (Conmebol) ---
// 32 equipos cada una, 8 grupos de 4 (ida y vuelta, 6 fechas), top 2 de
// cada grupo a octavos -> cuartos -> semis -> final.
// Quiénes las juegan sale de src/copasConmebol.ts: la temporada 1 es la
// edición real 2026 y de la 2 en adelante los cupos se ganan en la tabla.
// Simplificación consciente: NO modelamos el cruce real donde los tres
// terceros de Libertadores caen a la fase eliminatoria de Sudamericana —
// cada copa corre como un torneo de grupos + eliminación directa
// independiente, con su propio pool de clasificados.
// ==========================================================================

// Los participantes ya NO se eligen por reputación: la temporada 1 es la edición real 2026 y de la
// 2 en adelante los cupos se ganan en la simulación. Ver src/copasConmebol.ts.
//
// `allClubs` se conserva en la firma para no tocar los seis puntos de llamada, pero se ignora a
// propósito: era justamente la fuente del bug. App.tsx pasaba CLUBS_DATABASE y Dashboard.tsx
// ULTIMATE_CLUBS_DATABASE, así que la misma copa podía tener participantes distintos según quién
// preguntara. Con listas fijas la respuesta es una sola.
export function getLibertadoresParticipants(
  allClubs: Club[], year = 1, posiciones?: PosicionesFinales, campeones?: CampeonesConmebol,
): string[] {
  return participantesConmebol('libertadores', year, posiciones, campeones, allClubs);
}

export function getSudamericanaParticipants(
  allClubs: Club[], year = 1, posiciones?: PosicionesFinales, campeones?: CampeonesConmebol,
): string[] {
  return participantesConmebol('sudamericana', year, posiciones, campeones, allClubs);
}

// Reparte participantIds en numGroups grupos de groupSize sin repetir país (c.league) dentro
// de un mismo grupo -- así se evita que, por ejemplo, dos brasileños caigan juntos en un grupo
// de Libertadores. Empaqueta primero los países con más cupos (los que más chocan entre sí) y
// reintenta con un nuevo orden aleatorio si un intento particular se traba, aunque con los cupos
// reales (máx. 6 clubes de un país para 8 grupos) siempre hay una asignación válida.
function assignGroupsAvoidingSameCountry(
  participantIds: string[], allClubs: Club[], numGroups: number, groupSize: number
): string[][] {
  const countryOf = (id: string) => allClubs.find(c => c.id === id)?.league ?? id;

  for (let attempt = 0; attempt < 200; attempt++) {
    const byCountry = new Map<string, string[]>();
    for (const id of shuffle(participantIds)) {
      const country = countryOf(id);
      if (!byCountry.has(country)) byCountry.set(country, []);
      byCountry.get(country)!.push(id);
    }
    const countryEntries = shuffle([...byCountry.entries()]).sort((a, b) => b[1].length - a[1].length);

    const groups: string[][] = Array.from({ length: numGroups }, () => []);
    const groupCountries: Set<string>[] = Array.from({ length: numGroups }, () => new Set());
    let ok = true;
    for (const [country, ids] of countryEntries) {
      const availableGroups = shuffle(Array.from({ length: numGroups }, (_, i) => i))
        .filter(g => !groupCountries[g].has(country) && groups[g].length < groupSize);
      if (availableGroups.length < ids.length) { ok = false; break; }
      ids.forEach((id, i) => {
        const g = availableGroups[i];
        groups[g].push(id);
        groupCountries[g].add(country);
      });
    }
    if (ok) return groups;
  }
  // No debería llegar acá con los cupos reales, pero por si acaso: reparto simple sin garantía
  // en vez de trabar el juego.
  const fallback: string[][] = Array.from({ length: numGroups }, () => []);
  shuffle(participantIds).forEach((id, i) => fallback[i % numGroups].push(id));
  return fallback;
}

function drawCupGroups(participantIds: string[], allClubs: Club[]): CupGroup[] {
  const grouped = assignGroupsAvoidingSameCountry(participantIds, allClubs, 8, 4);
  const groups: CupGroup[] = [];
  for (let g = 0; g < 8; g++) {
    const clubIds = grouped[g];
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
        // La localía la manda el cruce, no forced.isHome: ese flag viene de la UI y si discrepa
        // el resultado entra dado vuelta (un 3-0 tuyo se anota 0-3 en contra).
        const yoSoyLocal = f.homeTeamId === forced.clubId;
        homeGoals = yoSoyLocal ? forced.goals : forced.opponentGoals;
        awayGoals = yoSoyLocal ? forced.opponentGoals : forced.goals;
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
      // Se ARMA el cuadro y se corta acá: la recursión resolvía los octavos enteros en el mismo
      // paso en que se creaban, así que el jugador clasificaba a octavos y su partido se jugaba
      // solo -- aparecía eliminado sin haber jugado. Los octavos se juegan en el paso siguiente,
      // que es cuando la pantalla le ofrece el partido.
      const seeded = seedFromCupGroups(cup.groups);
      return { ...cup, stage: 'knockout', knockout: seedTwoLegBracket(seeded) };
    }
    return { ...cup, groups: resolveCupGroupsStep(cup.groups, allClubs, forced) };
  }

  if (cup.stage === 'knockout') {
    if (cup.knockout?.championId) {
      return { ...cup, stage: 'done', championId: cup.knockout.championId };
    }
    // Ronda completa: este paso ARMA la siguiente y corta, igual que la Champions (resolveUefaCupStep
    // unas líneas más abajo) y que la copa nacional.
    //
    // Sin esto el cuadro se congelaba en OCTAVOS PARA SIEMPRE. resolveBracketRound resuelve la ronda
    // y corta a propósito -- así la pantalla alcanza a mostrar el partido que se acaba de jugar --
    // pero nadie llamaba después a siguienteRondaBracket para las copas Conmebol, que era el único
    // lugar donde faltaba. No existían los cuartos, ni las semis, ni la final, ni el campeón: medido
    // con 200 pasos, el cuadro seguía teniendo una sola ronda de 8 llaves. De ahí salía el "sólo 7
    // partidos de Libertadores" -- 6 de grupos y 1 de octavos, y el torneo dejaba de existir.
    // Ver la nota de resolverPasoCopaNacional: armar la ronda no gasta una fecha del calendario.
    const ultima = cup.knockout!.tiesByRound[cup.knockout!.tiesByRound.length - 1];
    const puesto = ultima.length && ultima.every(t => t.played)
      ? siguienteRondaTwoLeg(cup.knockout!, true)
      : cup.knockout!;
    return { ...cup, knockout: resolveTwoLegRound(puesto, allClubs, forced) };
  }

  return cup; // 'done': el torneo de este año ya terminó, no hay más pasos
}

export function getConcacafParticipants(allClubs: Club[], year = 1, posiciones?: PosicionesFinales): string[] {
  return participantesConcacaf(year, posiciones, allClubs);
}

function freshCupState(
  cupId: 'libertadores' | 'sudamericana' | 'concacaf', year: number, allClubs: Club[],
  posiciones?: PosicionesFinales, campeones?: CampeonesConmebol,
): CupState {
  // La Concacaf NO tiene fase de grupos: son cinco rondas de eliminación directa seguidas. Se
  // arranca ya en el cuadro, y de ahí en adelante corre por el mismo camino que las otras dos --
  // resolveCupStep, getUpcomingCupMatch y el cuadro de la pantalla no distinguen de qué copa es.
  if (cupId === 'concacaf') {
    const ids = participantesConcacaf(year, posiciones, allClubs);
    return {
      cupId, year, groups: [], stage: 'knockout',
      knockout: seedTwoLegBracket(ids), championId: null, stepsConsumed: 0,
    };
  }
  // El año importa: la 1 es la edición real 2026 y las siguientes se arman con lo que dejó la
  // simulación. Antes acá no se pasaba nada y todas las ediciones salían idénticas.
  const participants = participantesConmebol(cupId, year, posiciones, campeones, allClubs);
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

// LAS COPAS YA NO CUENTAN SEMANAS.
//
// Acá vivían cupWeeksElapsedTotal y cupWeeksElapsedInYear: repartían las semanas del año entre
// liga y copa con aritmética (isCupWeek) y le decían al motor cuántos pasos de copa "deberían"
// haberse jugado. Era el segundo reloj del juego, y de él salieron una fila de bugs -- la copa que
// se jugaba sola, la que se reiniciaba a mitad de año, y la peor: ganar el primer partido de la
// fase de grupos y que saltara "eliminado en octavos", porque en el paso 18 del calendario del
// Junior ese conteo ya iba por el paso 10 de copa y el motor le había jugado los grupos de fondo.
//
// Ahora el paso lo da el CALENDARIO: cada fecha de copa del club es exactamente un paso del cuadro
// (ver fechasDeCopaTranscurridas en dateSchedule.ts). Las copas corren por RONDA, al mismo reloj
// que el jugador, y no hay forma de que se adelanten.
//
// El cálculo se le pide a quien llama en vez de hacerlo acá porque dateSchedule.ts importa este
// módulo: al revés sería un ciclo.

export function getOrCreateCupState(
  cupId: 'libertadores' | 'sudamericana' | 'concacaf',
  year: number,
  allClubs: Club[],
  existing: CupState | undefined,
  /**
   * Cuántas fechas de COPA del calendario ya pasaron para el club del jugador en esta temporada.
   * Cada una es UN paso del cuadro: así la copa corre por RONDA, al mismo reloj que el jugador.
   *
   * Antes acá entraba `currentWeek` y el paso se sacaba de cupWeeksElapsedInYear, un reparto
   * aritmético de semanas que no tenía nada que ver con las fechas que el jugador iba jugando. En
   * el paso 18 del calendario del Junior, ese conteo ya iba por el paso 10 de copa: el motor le
   * jugaba la fase de grupos entera de fondo y el jugador ganaba su primer partido para enterarse
   * enseguida de que estaba "eliminado en octavos".
   */
  pasosDeCopa: number,
  posiciones?: PosicionesFinales,
  campeones?: CampeonesConmebol,
  /**
   * El club del jugador. Si se pasa, la copa NO avanza por encima de un partido suyo pendiente:
   * ese paso queda esperando a que lo juegue.
   *
   * Sin esto, la copa se jugaba sola. El caso es real y frecuente: de los 64 participantes de
   * Libertadores y Sudamericana, 38 no tienen ni una fecha de esa copa en el calendario scrapeado,
   * así que el jugador nunca recibía un partido — pero este bucle igual simulaba los suyos semana
   * a semana. En pantalla aparecían puntos, avance de ronda y hasta la eliminación de un torneo
   * que nunca jugó. Reportado tal cual: "la juego pero jamás jugué ningún partido y además se
   * juega sola".
   */
  playerClubId?: string,
): CupState {
  let cup = existing ?? freshCupState(cupId, year, allClubs, posiciones, campeones);
  let stepsConsumed = existing?.stepsConsumed ?? 0;
  const targetSteps = pasosDeCopa;

  while (stepsConsumed < targetSteps && cup.stage !== 'done') {
    // El turno es del jugador: se frena acá y no se consume el paso, así la próxima vez que se
    // pregunte el partido sigue estando. Si ya quedó eliminado, getUpcomingCupMatch devuelve null
    // y el resto del cuadro sigue corriendo con normalidad -- no se generan partidos fantasma para
    // alguien que ya está afuera.
    if (playerClubId && getUpcomingCupMatch(cup, playerClubId)) break;
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
  opponentGoals: number,
  shootoutOverride?: PenaltyShootoutResult
): CupState {
  const updated = resolveCupStep(cup, allClubs, { clubId: playerClubId, isHome: playerIsHome, goals: playerGoals, opponentGoals, shootoutOverride });
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
    const currentRound = cup.knockout.tiesByRound[cup.knockout.tiesByRound.length - 1];
    return findUpcomingTwoLegMatch(currentRound, clubId);
  }

  return null;
}

// getUpcomingCupMatch(...) === null es ambiguo: puede ser "estás entre rondas, esperá a la
// próxima fecha" (seguís vivo) o "ya te eliminaron esta edición" (nunca más vas a tener partido
// acá). App.tsx necesita distinguir ambos casos para no mostrarte semana tras semana un partido
// de relleno bajo el cartel de una copa de la que ya quedaste afuera (bug reportado: "si te
// eliminan de Libertadores, en julio vuelve a aparecer la fase de grupos" -- ver
// cupWeeksElapsedInYear más arriba para el bug hermano del contador anual).
/** Quién ganó una llave a partido único: el que hizo más goles, o el que ganó los penales. */
export function ganadorDelPartido(m: { homeTeamId: string; awayTeamId: string; homeGoals: number | null; awayGoals: number | null; penaltyShootout?: PenaltyShootoutResult }): string | null {
  if (m.penaltyShootout) return m.penaltyShootout.winnerId;
  if (m.homeGoals === null || m.awayGoals === null) return null;
  return m.homeGoals > m.awayGoals ? m.homeTeamId : m.awayTeamId;
}

/**
 * ¿El club sigue vivo en un cuadro de eliminación directa?
 *
 * Se mira SÓLO LA ÚLTIMA RONDA ARMADA, y dentro de ella si el club perdió su partido. Las dos
 * condiciones hacen falta:
 *
 *   - Rondas viejas: un club eliminado en octavos sigue apareciendo para siempre en el octavos que
 *     jugó. Preguntar "¿está en alguna ronda?" da que sí eternamente, y por eso el juego te decía
 *     que seguías en carrera después de haberte eliminado.
 *   - Última ronda ya jugada: el cuadro resuelve la ronda y CORTA sin armar la siguiente (ver la
 *     nota en resolveBracketRound), así que entre un paso y el otro la última ronda tiene adentro a
 *     los ganadores Y a los perdedores. Mirar sólo "¿estás en la última?" te da vivo hasta que se
 *     arme la ronda que viene.
 */
export function sigueEnElCuadro(rondas: { homeTeamId: string; awayTeamId: string; played: boolean; homeGoals: number | null; awayGoals: number | null; penaltyShootout?: PenaltyShootoutResult }[][], clubId: string): boolean {
  const ultima = rondas[rondas.length - 1];
  const mio = ultima?.find(m => m.homeTeamId === clubId || m.awayTeamId === clubId);
  if (!mio) return false;                       // quedó en una ronda anterior
  if (!mio.played) return true;                 // lo tiene por jugar
  return ganadorDelPartido(mio) === clubId;     // lo jugó: sigue sólo si lo ganó
}

/** Igual que sigueEnElCuadro, para llaves de ida y vuelta (copas nacionales, cuadrangulares, UEFA). */
export function sigueEnElCuadroDeIdaYVuelta(rondas: TwoLegTie[][], clubId: string): boolean {
  const ultima = rondas[rondas.length - 1];
  const mia = ultima?.find(t => t.clubAId === clubId || t.clubBId === clubId);
  if (!mia) return false;
  if (!mia.played) return true;
  return mia.winnerId === clubId;
}

export function isClubStillInCup(cup: CupState, clubId: string): boolean {
  if (cup.stage === 'groups') {
    return cup.groups.some(g => g.clubIds.includes(clubId));
  }
  if (cup.stage === 'knockout' && cup.knockout) {
    if (cup.knockout.championId) return cup.knockout.championId === clubId;
    return sigueEnElCuadroDeIdaYVuelta(cup.knockout.tiesByRound, clubId);
  }
  if (cup.stage === 'done') return cup.championId === clubId;
  return false;
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
// Quiénes las juegan sale de src/copasUefa.ts: la temporada 1 son los 36
// clubes reales de la fase de liga 2025/26 y de la 2 en adelante los cupos
// se ganan en la tabla del año anterior.
// ==========================================================================

const UEFA_LEAGUE_PHASE_MATCHDAYS = 8;
const UEFA_TOP_DIRECT = 8; // top 8 de la fase de liga -> directo a octavos
const UEFA_PLAYOFF_ZONE_END = 24; // 9º-24º juegan el playoff; 25º en adelante queda eliminado

export function getChampionsParticipants(
  allClubs: Club[], year = 1, posiciones?: PosicionesFinales, campeones?: CampeonesUefa,
): string[] {
  return participantesUefa('champions', year, posiciones, campeones, allClubs);
}

export function getEuropaParticipants(
  allClubs: Club[], year = 1, posiciones?: PosicionesFinales, campeones?: CampeonesUefa,
): string[] {
  return participantesUefa('europa', year, posiciones, campeones, allClubs);
}

function resolveOneLegOfTie(tie: TwoLegTie, legToPlay: 'first' | 'second', clubs: Club[], forced?: ForcedResult): TwoLegTie {
  if (tie.played) return tie;

  // FINAL A PARTIDO ÚNICO (Libertadores y Sudamericana desde 2019): se juega y se define en el
  // mismo paso. El resultado se anota en los campos de la ida y no hay vuelta que ofrecer.
  if (tie.partidoUnico) {
    const local = clubs.find(c => c.id === tie.clubAId);
    const visita = clubs.find(c => c.id === tie.clubBId);
    if (!local || !visita) return tie;
    const forzado = forced && (tie.clubAId === forced.clubId || tie.clubBId === forced.clubId) ? forced : undefined;
    let golesA: number, golesB: number;
    if (forzado) {
      const yoSoyLocal = tie.clubAId === forzado.clubId;
      golesA = yoSoyLocal ? forzado.goals : forzado.opponentGoals;
      golesB = yoSoyLocal ? forzado.opponentGoals : forzado.goals;
    } else {
      ({ homeGoals: golesA, awayGoals: golesB } = simulateMatch(local, visita));
    }
    if (golesA !== golesB) {
      return { ...tie, firstLegGoalsA: golesA, firstLegGoalsB: golesB, played: true, winnerId: golesA > golesB ? tie.clubAId : tie.clubBId };
    }
    const penaltyShootout = forzado?.shootoutOverride ?? simulatePenaltyShootout(local, visita);
    return { ...tie, firstLegGoalsA: golesA, firstLegGoalsB: golesB, played: true, winnerId: penaltyShootout.winnerId, penaltyShootout };
  }

  if (legToPlay === 'first' && tie.firstLegGoalsA !== null) return tie;
  if (legToPlay === 'second' && tie.firstLegGoalsA === null) return tie;

  const homeId = legToPlay === 'first' ? tie.clubAId : tie.clubBId;
  const awayId = legToPlay === 'first' ? tie.clubBId : tie.clubAId;
  const isForcedMatch = forced && (homeId === forced.clubId || awayId === forced.clubId);
  let homeGoals: number, awayGoals: number;
  if (isForcedMatch && forced) {
    // La localía la manda el cruce, no forced.isHome: ese flag viene de la UI y si discrepa
    // el resultado entra dado vuelta (un 3-0 tuyo se anota 0-3 en contra).
    const yoSoyLocal = homeId === forced.clubId;
    homeGoals = yoSoyLocal ? forced.goals : forced.opponentGoals;
    awayGoals = yoSoyLocal ? forced.opponentGoals : forced.goals;
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
    // Si el jugador es parte de esta llave y jugó la tanda en vivo, su resultado real manda sobre
    // el dado del motor -- ver ForcedResult.shootoutOverride.
    const tieIncludesForcedClub = forced && (tie.clubAId === forced.clubId || tie.clubBId === forced.clubId);
    if (tieIncludesForcedClub && forced?.shootoutOverride) {
      penaltyShootout = forced.shootoutOverride;
      winnerId = penaltyShootout.winnerId;
    } else {
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
  // Se resuelve la ronda y se CORTA acá, sin armar la siguiente en el mismo paso -- mismo patrón
  // que fase regular -> knockout unas líneas más arriba ("se ARMA el cuadro y se corta"). Antes,
  // cuando la vuelta del jugador completaba la última llave pendiente de la ronda, esta función
  // armaba la ronda siguiente EN LA MISMA LLAMADA: para cuando App.tsx/Dashboard.tsx consultaban
  // tiesByRound[length-1] para calcular el global o decidir el campeón, ya no encontraban la llave
  // que el jugador acababa de jugar -- encontraban la llave vacía de la ronda siguiente. El global
  // "nunca aparecía" y el campeón se decidía con datos de otra ronda. Bug reportado: "me dio el
  // campeonaao y habiamos empatado en el global, y el global nunca aparecio". La ronda siguiente se
  // arma en el paso posterior, que es cuando la pantalla se la ofrece al jugador.
  if (!roundComplete) return { tiesByRound, championId: null };
  const winners = newRound.map(t => t.winnerId!);
  if (winners.length === 1) {
    return { tiesByRound, championId: winners[0] };
  }
  return { tiesByRound, championId: null };
}

/** Arma la ronda siguiente del knockout de liga a partir de los ganadores de la última ya jugada. */
function siguienteRondaTwoLeg(bracket: TwoLegBracket, finalAPartidoUnico = false): TwoLegBracket {
  const roundIdx = bracket.tiesByRound.length - 1;
  const currentRound = bracket.tiesByRound[roundIdx];
  if (bracket.championId || !currentRound.every(t => t.played)) return bracket;
  const winners = currentRound.map(t => t.winnerId!);
  // Dos ganadores = la que viene es LA FINAL. Sólo la Conmebol la pide a partido único; la Champions
  // y las copas nacionales siguen definiendo con global, que es como las modela el resto del motor.
  const esLaFinal = winners.length === 2;
  const nextRound: TwoLegTie[] = [];
  for (let i = 0; i < winners.length; i += 2) {
    nextRound.push({
      clubAId: winners[i], clubBId: winners[i + 1],
      firstLegGoalsA: null, firstLegGoalsB: null, secondLegGoalsA: null, secondLegGoalsB: null,
      played: false, winnerId: null,
      ...(finalAPartidoUnico && esLaFinal ? { partidoUnico: true } : {}),
    });
  }
  return { tiesByRound: [...bracket.tiesByRound, nextRound], championId: null };
}

/**
 * Avanza UNA pierna de la copa nacional (Copa BetPlay y equivalentes).
 *
 * Reusa el mismo motor de llaves que los playoffs de Apertura/Clausura: resuelve la ida o la vuelta
 * de todas las llaves de la ronda, y al completarse encadena la siguiente hasta coronar campeón.
 * Si el jugador tiene partido en esa ronda, su resultado entra por `forced` y el resto se simula.
 *
 * @param forced Resultado real del partido del jugador, si le tocaba jugar esta pierna.
 */
/**
 * Un paso del PLAYOFF de liga: los cuadrangulares de Colombia y la fase final argentina.
 *
 * El cuadro se siembra con los OCHO PRIMEROS DE LA TABLA de la fase regular, que es de lo que se
 * trata: hasta ahora, quién los jugaba en las temporadas generadas lo decidía la permutación de
 * nombres del calendario -- el club al que le tocaba el lugar de un finalista jugaba la final
 * todos los años, sin importar cómo le hubiera ido.
 *
 * Ida y vuelta en las tres rondas (cuartos, semis, final), que es lo que muestran los datos reales
 * del Apertura 2026: ocho clubes llegan a 21 fechas, cuatro a 23 y dos a 25.
 *
 * Mismo motor de llaves que la copa nacional y las copas europeas, y con el mismo cuidado: si la
 * ronda ya está completa se arma la siguiente y se corta, sin resolverla en el mismo paso.
 *
 * @param forced El resultado real del jugador, si le tocaba jugar esta pierna.
 */
export function prepararPlayoffDeLiga(
  bracket: TwoLegBracket | undefined,
  tabla: TableTeam[],
): TwoLegBracket {
  if (!bracket) {
    // Arranque: los 8 mejores de la fase regular, en orden. seedSingleTwoLegRound cruza 1-8, 2-7...
    const ocho = sortTable(tabla).slice(0, 8).map(t => t.clubId);
    if (ocho.length < 2) return { tiesByRound: [[]], championId: null };
    return seedTwoLegBracket(ocho);
  }
  if (bracket.championId) return bracket;

  // Ronda completa: se arma la siguiente ANTES de preguntar por el cruce. Sin esto, el cruce que
  // se ofrece es el que YA se jugó y el jugador lo disputa de nuevo contra el mismo rival -- un
  // partido fantasma por cada cambio de ronda. Es el mismo error que ya apareció en la copa
  // nacional, y se arregla en el mismo lugar del ciclo.
  const ultima = bracket.tiesByRound[bracket.tiesByRound.length - 1];
  if (ultima?.length && ultima.every(t => t.played)) return siguienteRondaTwoLeg(bracket);
  return bracket;
}

/** Resuelve UNA pierna del playoff con el resultado del jugador; el resto de las llaves se simula. */
export function resolverPasoPlayoffDeLiga(
  bracket: TwoLegBracket,
  clubs: Club[],
  forced?: ForcedResult,
): TwoLegBracket {
  if (bracket.championId) return bracket;
  return resolveTwoLegRound(bracket, clubs, forced);
}

/** El cruce del club en la ronda en curso del playoff, o null si ya no juega. */
export function crucePlayoffDeLiga(bracket: TwoLegBracket | undefined, clubId: string): TwoLegTie | null {
  if (!bracket || bracket.championId) return null;
  const ronda = bracket.tiesByRound[bracket.tiesByRound.length - 1];
  const tie = ronda?.find(t => t.clubAId === clubId || t.clubBId === clubId) ?? null;
  if (!tie || (tie.played && tie.winnerId !== clubId)) return null;
  return tie;
}

/** Cómo se llama la ronda que se está jugando. */
export function rondaDelPlayoff(bracket: TwoLegBracket | undefined): string {
  const ronda = bracket?.tiesByRound[bracket.tiesByRound.length - 1];
  return roundLabelByMatchCount(ronda?.length ?? 0);
}

/**
 * Termina un torneo que el jugador ya no juega, para que TENGA campeón.
 *
 * Los cuadros del motor sólo avanzan cuando el jugador disputa una llave, así que el día que lo
 * eliminaban el torneo se congelaba en la ronda donde había quedado y no coronaba nunca a nadie. La
 * Copa BetPlay terminaba la temporada "en Semifinal" para siempre. Encontrado jugando una temporada
 * entera con el Junior (scripts/jugar_carrera.ts), que exige desenlace en todas las competiciones.
 *
 * Un torneo del que te eliminan sigue jugándose sin vos -- eso es lo normal, no una concesión --, y
 * su campeón hace falta para la vitrina, para las noticias y para repartir los cupos continentales
 * del año siguiente. Se resuelve de una vez y no de a un paso por fecha, porque una vez afuera el
 * jugador no tiene días de esa copa donde el cuadro pudiera avanzar.
 *
 * El tope de vueltas no es decorativo: un cuadro corrupto (una ronda que nunca se marca jugada)
 * colgaría el juego en un bucle infinito en medio del partido.
 */
export function terminarTorneoSinElJugador<T extends { championId: string | null }>(
  estado: T,
  unPaso: (e: T) => T,
  maxRondas = 12,
): T {
  let actual = estado;
  for (let i = 0; i < maxRondas && !actual.championId; i++) {
    const siguiente = unPaso(actual);
    if (siguiente === actual) break;   // dejó de avanzar: mejor sin campeón que colgado
    actual = siguiente;
  }
  return actual;
}

export function resolverPasoCopaNacional(
  cup: DomesticCupState,
  allClubs: Club[],
  forced?: ForcedResult,
): DomesticCupState {
  if (cup.championId) return cup;
  // ARMAR la ronda siguiente NO gasta una fecha del calendario.
  //
  // Antes la armaba y cortaba, asi que cada cambio de ronda se comia un dia: un campeon de
  // Libertadores necesitaba 11 fechas de copa despues de los grupos -- 7 partidos mas 4 dias
  // dedicados a sortear la ronda que viene -- y el calendario real de la Conmebol tiene 7. Por eso
  // las fechas reales del knockout no entraban y habia que repartir dias genericos.
  //
  // Ahora se arma al PRINCIPIO del paso siguiente y se juega en ese mismo paso. El corte que hacia
  // falta se conserva igual: cuando el jugador completa una ronda, esa llamada termina con la ronda
  // JUGADA como ultima, asi que la pantalla la muestra. La ronda nueva recien aparece cuando el
  // jugador avanza, que es cuando corresponde.
  const listaCompleta = cup.bracket.tiesByRound[cup.bracket.tiesByRound.length - 1].every(t => t.played);
  const puesta = listaCompleta ? siguienteRondaTwoLeg(cup.bracket) : cup.bracket;
  const bracket = resolveTwoLegRound(puesta, allClubs, forced);
  return { ...cup, bracket, championId: bracket.championId };
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
      // La localía la manda el cruce, no forced.isHome: ese flag viene de la UI y si discrepa
      // el resultado entra dado vuelta (un 3-0 tuyo se anota 0-3 en contra).
      const yoSoyLocal = f.homeTeamId === forced.clubId;
      homeGoals = yoSoyLocal ? forced.goals : forced.opponentGoals;
      awayGoals = yoSoyLocal ? forced.opponentGoals : forced.goals;
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
      // Se arma el cuadro y se corta: encadenar la recursión resolvía la primera ronda en el mismo
      // paso y el partido del jugador se jugaba solo, sin que él lo viera.
      if (playoffPool.length >= 2) {
        return { ...cup, stage: 'playoff', playoff: seedSingleTwoLegRound(playoffPool) };
      }
      // Campo chico (no llega a 24 clasificados): saltamos directo a octavos con el top 8.
      const direct = ranked.slice(0, UEFA_TOP_DIRECT);
      return { ...cup, stage: 'knockout', knockout: seedTwoLegBracket(direct) };
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
      return { ...cup, stage: 'knockout', knockout: seedTwoLegBracket([...direct, ...playoffWinners]) };
    }
    const playoff = resolveSingleTwoLegRoundStep(cup.playoff, allClubs, forced);
    return { ...cup, playoff };
  }

  if (cup.stage === 'knockout') {
    if (!cup.knockout) return cup;
    if (cup.knockout.championId) {
      return { ...cup, stage: 'done', championId: cup.knockout.championId };
    }
    // Ver la nota de resolverPasoCopaNacional: armar la ronda no gasta una fecha.
    const completa = cup.knockout.tiesByRound[cup.knockout.tiesByRound.length - 1].every(t => t.played);
    const puesto = completa ? siguienteRondaTwoLeg(cup.knockout) : cup.knockout;
    const knockout = resolveTwoLegRound(puesto, allClubs, forced);
    return { ...cup, knockout };
  }

  return cup;
}

// El método del círculo (generateRoundRobin) arma emparejamientos distintos según el orden de
// entrada -- probamos varios órdenes al azar y nos quedamos con el que menos partidos entre
// clubes del mismo país deja en las primeras UEFA_LEAGUE_PHASE_MATCHDAYS fechas (que son las
// únicas que de verdad se juegan). No hay garantía matemática de cero choques como en los grupos
// de Conmebol (acá hay más equipos por país y menos margen), pero reparte muchísimo mejor que un
// solo shuffle sin evaluar.
function shuffleMinimizingCountryClashes(participantIds: string[], allClubs: Club[], matchdaysToCheck: number): string[] {
  const countryOf = (id: string) => allClubs.find(c => c.id === id)?.league ?? id;
  let best = shuffle(participantIds);
  let bestClashes = Infinity;
  for (let attempt = 0; attempt < 400; attempt++) {
    const candidate = shuffle(participantIds);
    const fixtures = generateRoundRobin(candidate).filter(f => f.matchweek <= matchdaysToCheck);
    let clashes = 0;
    for (const f of fixtures) {
      if (countryOf(f.homeTeamId) === countryOf(f.awayTeamId)) clashes++;
    }
    if (clashes < bestClashes) {
      bestClashes = clashes;
      best = candidate;
      if (clashes === 0) break;
    }
  }
  return best;
}

function freshUefaCupState(
  cupId: 'champions' | 'europa', year: number, allClubs: Club[], startedAtStep: number,
  posiciones?: PosicionesFinales, campeones?: CampeonesUefa,
): UefaCupState {
  // El año importa: la 1 es la edición real 2025/26 y las siguientes se arman con lo que dejó la
  // simulación. Antes no se pasaba nada y todas las ediciones salían con los mismos 36 clubes.
  const participantIds = participantesUefa(cupId, year, posiciones, campeones, allClubs);
  const shuffled = shuffleMinimizingCountryClashes(participantIds, allClubs, UEFA_LEAGUE_PHASE_MATCHDAYS);
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
  existing: UefaCupState | undefined,
  /** Ver el mismo parámetro en getOrCreateCupState. Acá es el total CORRIDO de la carrera, no el
   *  del año: la Champions arrastra su estado de una temporada a la siguiente. */
  pasosDeCopa: number,
  posiciones?: PosicionesFinales, campeones?: CampeonesUefa,
  /** Ver el mismo parámetro en getOrCreateCupState: la copa no avanza por encima de un partido
   *  pendiente del jugador. Acá el riesgo es idéntico -- Champions y Europa tampoco tienen fecha
   *  scrapeada para todos sus participantes. */
  playerClubId?: string,
): UefaCupState {
  let cup = existing ?? freshUefaCupState(cupId, 1, allClubs, 0, posiciones, campeones);
  const totalStepsAvailable = pasosDeCopa;

  while (cup.startedAtStep + cup.stepsConsumed < totalStepsAvailable) {
    if (cup.stage === 'done') {
      cup = freshUefaCupState(
        cupId, cup.year + 1, allClubs, cup.startedAtStep + cup.stepsConsumed, posiciones, campeones);
      continue;
    }
    if (playerClubId && getUpcomingUefaCupMatch(cup, playerClubId)) break;
    cup = { ...resolveUefaCupStep(cup, allClubs), stepsConsumed: cup.stepsConsumed + 1 };
  }
  return cup;
}

export function resolveUefaCupWeek(
  cup: UefaCupState, allClubs: Club[], playerClubId: string,
  playerIsHome: boolean, playerGoals: number, opponentGoals: number,
  shootoutOverride?: PenaltyShootoutResult
): UefaCupState {
  const updated = resolveUefaCupStep(cup, allClubs, { clubId: playerClubId, isHome: playerIsHome, goals: playerGoals, opponentGoals, shootoutOverride });
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

// Equivalente a isClubStillInCup pero para Champions/Europa (formato liga suiza + playoff +
// eliminatoria ida/vuelta). Mismo motivo: getUpcomingUefaCupMatch===null no distingue "entre
// fechas de la fase de liga" de "quedaste eliminado en el playoff/knockout" o "no clasificaste
// directamente a esta edición".
export function isClubStillInUefaCup(cup: UefaCupState, clubId: string): boolean {
  if (!cup.participants.includes(clubId)) return false;
  if (cup.stage === 'league_phase') return true;
  if (cup.stage === 'playoff') {
    if (!cup.playoff) return true;
    const inPlayoff = cup.playoff.some(t => t.clubAId === clubId || t.clubBId === clubId);
    // Top 8 de la fase de liga: pasó directo a octavos, no juega el playoff pero sigue vivo.
    if (!inPlayoff) return true;
    const roundDone = cup.playoff.every(t => t.played);
    if (!roundDone) return true;
    return cup.playoff.some(t => t.winnerId === clubId);
  }
  if (cup.stage === 'knockout' && cup.knockout) {
    if (cup.knockout.championId) return cup.knockout.championId === clubId;
    return cup.knockout.tiesByRound.some(round => round.some(t => t.clubAId === clubId || t.clubBId === clubId));
  }
  if (cup.stage === 'done') return cup.championId === clubId;
  return false;
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

// Prestigio mínimo Y partidos oficiales mínimos para que te convoquen a la selección en un año
// de Mundial -- no alcanza con el prestigio (que escala rápido con conferencias/decisiones):
// además hace falta haber demostrado nivel en cancha durante un tiempo real (más o menos una
// temporada completa). Exportado (no vive en App.tsx) porque Dashboard también lo necesita para
// previsualizar el próximo rival durante la ventana del Mundial.
export const WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD = 82;
export const WORLD_CUP_CALLUP_MIN_MATCHES = 40;

/**
 * Para las ELIMINATORIAS el listón es más bajo que para el Mundial.
 *
 * Es como funciona de verdad: a la selección se entra por eliminatorias, jugando los partidos que
 * a nadie le importan de visitante en la altura, y recién después -- si respondiste -- vas al
 * Mundial. Pedir el mismo prestigio 82 para las dos cosas dejaba la eliminatoria fuera de alcance
 * justo cuando se juega: la primera fecha del ciclo cae en septiembre del año 2 de la carrera, con
 * temporada y media encima, y llegar a 82 de prestigio en ese lapso es de un jugador ya consagrado.
 * El que llega a 82 iba a ir al Mundial igual; el que está entre 60 y 82 es exactamente el que en
 * la vida real se gana el puesto en la eliminatoria.
 *
 * Los partidos jugados también bajan, por la misma razón: 40 es casi una temporada entera y la
 * eliminatoria arranca antes de que termine la segunda.
 */
export const ELIMINATORIAS_CALLUP_PRESTIGE_THRESHOLD = 62;
export const ELIMINATORIAS_CALLUP_MIN_MATCHES = 25;

// El Mundial necesita 9 pasos para resolverse por completo y quedar en stage 'done' (3 fechas de
// fase de grupos + 5 rondas de eliminación directa -- R32, R16, cuartos, semis, final -- + 1 paso
// extra donde resolveWorldCupStep recién detecta el campeón ya definido y recién ahí marca
// stage:'done'; medido empíricamente con getOrCreateWorldCupState a currentWeek gigante). Antes
// esos pasos se esparcían por toda la temporada compartiendo el cupo "cada 3 semanas" de
// Libertadores/Champions, así que un Mundial terminaba "encimado" con fechas de liga doméstica y
// de copas de clubes que en la vida real están paradas por la fecha FIFA. Ahora el Mundial ocupa
// un bloque de 9 semanas SEGUIDAS (ver isWorldCupBreakWeek) dentro de la temporada del año que
// corresponda, y leagueMatchweeksElapsed*/cupWeeksElapsed* excluyen esas semanas del conteo, así
// que liga y copas de club quedan realmente congeladas mientras dura el Mundial.
const WORLD_CUP_BREAK_START_WEEK = 19;
const WORLD_CUP_BREAK_LENGTH_WEEKS = 9;


// Acá vivía worldCupWeeksElapsedInYear, que contaba las semanas del bloque del Mundial. El torneo
// ahora avanza por las FECHAS que el calendario le reserva (pasosDeMundialTranscurridos en
// dateSchedule.ts): 9 días entre el 11 de junio y el 19 de julio, los mismos para todos los
// clubes. Antes el bloque arrancaba en la semana 19 de la temporada, que con temporadas de entre
// 34 y 66 pasos caía en un mes distinto para cada club.

function drawWorldCupGroups(teamIds: string[], allTeams: Club[], year: number): CupGroup[] {
  // El Mundial 2026 (año 1 de la carrera) usa el SORTEO REAL, no uno al azar: sin esto Argentina
  // podía cruzarse con Brasil en fase de grupos y el torneo no se parecía en nada al de verdad.
  // Las ediciones siguientes sí se sortean: no simulamos eliminatorias, así que no hay manera de
  // saber quién clasificaría a 2030.
  const real = year === 1 && GRUPOS_MUNDIAL_2026.every(g => g.every(id => teamIds.includes(id)));
  const shuffled = shuffle(teamIds);
  const groups: CupGroup[] = [];
  for (let g = 0; g < 12; g++) {
    const clubIds = real ? [...GRUPOS_MUNDIAL_2026[g]] : shuffled.slice(g * 4, g * 4 + 4);
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
    groups: drawWorldCupGroups(teamIds, allTeams, year),
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
  /** Cuántas fechas del Mundial ya pasaron para el club del jugador. Cada una es un paso del
   *  torneo: ver pasosDeMundialTranscurridos en dateSchedule.ts. */
  pasosDeMundial: number
): WorldCupState {
  let cup = existing ?? freshWorldCupState(year, allTeams);
  let stepsConsumed = existing?.stepsConsumed ?? 0;
  const targetSteps = pasosDeMundial;

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
  opponentGoals: number,
  shootoutOverride?: PenaltyShootoutResult
): WorldCupState {
  const updated = resolveWorldCupStep(cup, allTeams, { clubId: playerTeamId, isHome: playerIsHome, goals: playerGoals, opponentGoals, shootoutOverride });
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

// ==========================================================================
// --- ESTADÍSTICAS DE JUGADORES POR LIGA (Fase 5) ---
// Para las ~24 ligas sin cobertura de datos reales (ver REAL_LEAGUE_LEADERS en data.ts, que cubre
// las 7 grandes europeas + 8 latinoamericanas con fuentes reales), generamos goleador/asistidor/
// arquero-menos-vencido/tarjetas de forma DETERMINÍSTICA a partir de los goles a favor/en contra
// REALES que cada club ya tiene en la tabla (TableTeam.gf/gc/pj) -- nunca inventamos números
// sueltos: siempre repartimos el total real del club entre sus starPlayers, así que el mismo
// estado de tabla siempre produce el mismo resultado (no cambia en cada render/semana que no
// avanzó), y la suma de goles repartidos nunca supera lo que el club realmente anotó.
// ==========================================================================

function hashSeed(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Extrae "Nombre" y posición desde el formato usado en starPlayers ("Fulano (ST)" o "Fulano" a secas).
function parseStarPlayer(raw: string): { name: string; pos: string | null } {
  const m = raw.match(/^(.*?)\s*\(([A-Z]+)\)$/);
  return m ? { name: m[1].trim(), pos: m[2] } : { name: raw.trim(), pos: null };
}

// Peso relativo de cada posición a la hora de repartir los goles a favor del club -- delanteros
// concentran la mayoría, el arco no suma nunca.
const GOAL_WEIGHT_BY_POS: Record<string, number> = {
  ST: 5, CF: 5, LW: 4, RW: 4, CAM: 3, CM: 3, RM: 2, LM: 2, CDM: 1, RB: 1, LB: 1, CB: 1, GK: 0,
};
const ASSIST_WEIGHT_BY_POS: Record<string, number> = {
  CAM: 5, CM: 4, RM: 4, LM: 4, RW: 3, LW: 3, ST: 2, CF: 2, CDM: 2, RB: 1, LB: 1, CB: 1, GK: 0,
};

export function generateLeagueLeadersFromTable(
  clubs: Club[],
  table: TableTeam[],
  // Retiros del mundo (PlayerProfile.retiredWorldPlayers). Sin esto el panel de
  // estadisticas sigue coronando goleador a alguien que ya colgo los botines:
  // Mbappe aparecia como maximo goleador 20 temporadas seguidas, incluso despues
  // de haberse retirado del Madrid.
  retired?: Record<string, Record<string, string>>
): LeagueLeadersResult {
  type Candidate = { name: string; clubName: string; goalShare: number; assistShare: number; pos: string | null };
  const candidates: Candidate[] = [];
  const goalkeepers: { name: string; clubName: string; gc: number; pj: number }[] = [];

  for (const club of clubs) {
    const row = table.find(r => r.clubId === club.id);
    const gf = row?.gf ?? 0;
    const gc = row?.gc ?? 0;
    const pj = row?.pj ?? 0;
    const roster = retired?.[club.id]
      ? club.starPlayers.map(p => retired[club.id][p] ?? p)
      : club.starPlayers;
    const parsed = roster
      .map(displayName)                            // quitar la marca interna de año de debut
      .map(parseStarPlayer)
      .filter(p => p.name && !p.name.startsWith('Jugador '));
    if (parsed.length === 0) continue;

    const goalWeights = parsed.map(p => GOAL_WEIGHT_BY_POS[p.pos ?? ''] ?? 2);
    const totalGoalWeight = goalWeights.reduce((a, b) => a + b, 0) || 1;
    const assistWeights = parsed.map(p => ASSIST_WEIGHT_BY_POS[p.pos ?? ''] ?? 2);
    const totalAssistWeight = assistWeights.reduce((a, b) => a + b, 0) || 1;

    parsed.forEach((p, i) => {
      candidates.push({
        name: p.name,
        clubName: club.name,
        goalShare: Math.round((gf * goalWeights[i]) / totalGoalWeight),
        assistShare: Math.round((gf * 0.65 * assistWeights[i]) / totalAssistWeight),
        pos: p.pos,
      });
      if (p.pos === 'GK') {
        goalkeepers.push({ name: p.name, clubName: club.name, gc, pj });
      }
    });
    // Si ningún starPlayer tiene posición GK etiquetada, usamos el primero de la lista como portero
    // de referencia (muchos clubes curados listan al arquero primero o último sin sufijo).
    if (!parsed.some(p => p.pos === 'GK') && parsed.length > 0) {
      goalkeepers.push({ name: parsed[0].name, clubName: club.name, gc, pj });
    }
  }

  const topScorerC = candidates.filter(c => c.goalShare > 0).sort((a, b) => b.goalShare - a.goalShare)[0];
  const topAssistC = candidates.filter(c => c.assistShare > 0).sort((a, b) => b.assistShare - a.assistShare)[0];
  // Portería menos vencida: menor promedio de goles recibidos por partido, con mínimo de partidos jugados.
  const topGkC = goalkeepers.filter(g => g.pj >= 3).sort((a, b) => (a.gc / a.pj) - (b.gc / b.pj))[0];

  // Tarjetas: escalan con los partidos DISPUTADOS en la temporada, igual que los goles escalan con
  // gf. El hash solo decide qué tan propenso es cada jugador; los partidos deciden cuántas lleva.
  //
  // Antes el total salía solo del hash de nombre+club, así que era el mismo número en la fecha 1
  // que en la 38 y no se reiniciaba nunca entre temporadas: el panel mostraba "8 amarillas" con la
  // liga recién arrancada. Ponderado por posición, que en la realidad pesa mucho (centrales y
  // volantes de contención acumulan bastante más que un extremo).
  const CARD_WEIGHT: Record<string, number> = { CB: 3, CDM: 3, LB: 2, RB: 2, CM: 2, RM: 1, LM: 1, CAM: 1, ST: 1, CF: 1, LW: 1, RW: 1, GK: 1 };
  const maxPj = Math.max(...table.map(t => t.pj ?? 0), 0);
  const cardCandidates = candidates.map(c => {
    const seed = hashSeed(`${c.name}|${c.clubName}|card`);
    const weight = CARD_WEIGHT[c.pos ?? ''] ?? 1;
    // Ritmo de amarillas por partido: entre ~0.10 y ~0.28 según el hash, escalado por posición.
    // Sobre 38 fechas eso da un máximo realista de 10-12 para el líder de la tabla.
    const ratePerMatch = (0.10 + (seed % 7) * 0.03) * (0.6 + weight * 0.2);
    return {
      name: c.name,
      clubName: c.clubName,
      yellow: Math.floor(maxPj * ratePerMatch),
      // Una roja aparece recién pasado cierto punto de la temporada, no en la fecha 1.
      red: seed % 23 === 0 && maxPj >= 8 ? 1 : 0,
    };
  });
  // Sin partidos jugados no hay tarjetas que mostrar: el panel dirá "Sin datos disponibles".
  const topYellowC = cardCandidates.filter(c => c.yellow > 0).sort((a, b) => b.yellow - a.yellow)[0];
  const topRedCandidates = cardCandidates.filter(c => c.red > 0);
  const topRedC = topRedCandidates.length > 0 ? { name: topRedCandidates[0].name, clubName: topRedCandidates[0].clubName, red: 1 } : null;

  return {
    topScorer: topScorerC ? { name: topScorerC.name, clubName: topScorerC.clubName, value: topScorerC.goalShare } : null,
    topAssist: topAssistC ? { name: topAssistC.name, clubName: topAssistC.clubName, value: topAssistC.assistShare } : null,
    topGoalkeeper: topGkC ? { name: topGkC.name, clubName: topGkC.clubName } : null,
    topYellow: topYellowC ? { name: topYellowC.name, clubName: topYellowC.clubName, value: topYellowC.yellow } : null,
    topRed: topRedC ? { name: topRedC.name, clubName: topRedC.clubName, value: topRedC.red } : null,
  };
}

export interface LeagueLeadersResult {
  topScorer: { name: string; clubName: string; value: number } | null;
  topAssist: { name: string; clubName: string; value: number } | null;
  topGoalkeeper: { name: string; clubName: string } | null;
  topYellow: { name: string; clubName: string; value: number } | null;
  topRed: { name: string; clubName: string; value: number } | null;
}

export function resolvePlayerWeekForLeague(
  season: LeagueSeasonState,
  leagueClubs: Club[],
  currentWeek: number,
  playerClubId: string,
  playerIsHome: boolean,
  playerGoals: number,
  opponentGoals: number,
  shootoutOverride?: PenaltyShootoutResult,
  ctxReal?: { fecha: string; temporada: number }
): LeagueSeasonState {
  // La tabla se arma con las FECHAS reales del calendario, que es la única fuente de verdad: es el
  // mismo calendario del que sale el partido que juega el jugador. Antes había dos sistemas más --
  // el legado semanal (realSchedule) y el fixture sintético generado -- cada uno con su reloj, y la
  // tabla terminaba registrando un rival distinto al que se veía en pantalla.
  // Sin ctxReal no hay nada que resolver: la tabla se arma con las FECHAS del calendario y punto.
  //
  // Acá abajo había dos ramas de respaldo -- resolveApeturaClausuraWeek y resolvePlayerMatchweek --
  // que resolvían la fecha con el reloj de semanas cuando el calendario no contestaba. Eran la
  // última red del otro motor. Se fueron el 12 de agosto de 2026 junto con él: los tres llamadores
  // pasan ctxReal siempre, y resolveLigaPorFecha sólo devuelve null si el grupo de clubes no es una
  // liga del calendario, cosa que no pasa para ningún club jugable (medido: las 27 ligas entran).
  if (!ctxReal) return season;
  return resolveLigaPorFecha(season, leagueClubs, playerClubId, playerGoals, opponentGoals, ctxReal) ?? season;
}


// Liga -> competición del calendario real. Se resuelve por mayoría: la competición donde figuran más
// clubes de esta liga es la suya. Así no hace falta una tabla liga->código a mano, y las divisiones
// sin calendario (Championship, Serie B, Primera Nacional...) devuelven null solas y caen al motor
// generado.


// Jornadas de una competición en orden de disputa ("1. Matchday", "2. Matchday"...). Se ordena por
// el número que trae el nombre, y solo si no lo tiene se cae a la semana en que aparece por primera
// vez: con los aplazamientos, la jornada 12 puede empezar más tarde que la 13.
const jornadasCache = new Map<string, string[]>();


// Semanas del año en las que esta liga juega, tomadas del calendario real.
//
// Son exactamente las semanas donde el calendario ubica algún partido: las demás quedan libres, que
// es de dónde salen los parones FIFA, el receso de mitad de año y las vacaciones de verano.
//
// Cuando hay menos semanas de fútbol que jornadas (LaLiga: 36 semanas para 38 fechas, porque el
// calendario real mete fechas dobles entre semana), las jornadas que faltan se juegan en las
// primeras semanas libres del final del año, para que el torneo cierre completo dentro de la
// temporada de 52 semanas.
const semanasDeLigaCache = new Map<string, Set<number>>();




/**
 * Resuelve la tabla con el calendario de FECHAS reales (realCalendarDates), que es el único que
 * queda: el legado semanal (realCalendar.ts + realSchedule.ts) llevaba su propio reloj de jornadas
 * y derivaba del calendario que veía el jugador.
 *
 * Se resuelve todo lo PENDIENTE hasta la fecha de hoy inclusive, no solo los partidos del día: los
 * demás clubes de la liga juegan en fechas en las que el tuyo descansa, y si solo se resolviera el
 * día del jugador esos partidos no entraban nunca y la tabla quedaba con menos partidos jugados
 * para unos clubes que para otros.
 *
 * Cada fixture guarda en `round` la clave "fecha|local|visitante", que es lo que evita resolver dos
 * veces el mismo partido.
 */
function resolveLigaPorFecha(
  season: LeagueSeasonState,
  leagueClubs: Club[],
  playerClubId: string,
  playerGoals: number,
  opponentGoals: number,
  ctx: { fecha: string; temporada: number }
): LeagueSeasonState | null {
  const base = ligaDeClubes(new Set(leagueClubs.map(c => c.name)));
  if (!base) return null;
  const comp = competicionEnTemporada(base, ctx.temporada);

  const porNombre = new Map<string, Club>();
  for (const c of leagueClubs) porNombre.set(c.name, c);

  // Saves viejos: sus fixtures traen `round` con el formato de jornada del legado ("5. Matchday").
  // Si se mezclaran con las claves nuevas, ningún partido ya jugado coincidiría y se volverían a
  // resolver todos, duplicándolos en la tabla. Se detecta y se arranca la temporada de cero, que se
  // pone al día sola en este mismo paso.
  const esSaveLegado = season.fixtures.some(fx => fx.round !== undefined && !fx.round.includes('|'));
  // Temporada nueva: la tabla arranca de cero. Sin esto los partidos del año siguiente se sumaban
  // encima de los del anterior y los clubes terminaban con 44 partidos jugados en vez de 38.
  const cambioDeTemporada = season.seasonYear !== undefined && season.seasonYear !== ctx.temporada;
  const reiniciar = esSaveLegado || cambioDeTemporada;
  const playoffs = partidosDePlayoff(base);
  let table = reiniciar ? buildInitialTable(leagueClubs) : season.table;
  const fixtures = reiniciar ? [] : [...season.fixtures];
  const yaJugadas = new Set(fixtures.map(fx => fx.round).filter((r): r is string => !!r));

  for (let i = 0; i < comp.matches.length; i++) {
    const m = comp.matches[i];
    if (m.date > ctx.fecha) continue;
    const clave = `${m.date}|${m.home}|${m.away}`;
    if (yaJugadas.has(clave)) continue;
    const home = porNombre.get(m.home);
    const away = porNombre.get(m.away);
    if (!home || !away) continue;                // club del calendario que no está en data.ts

    // El resultado del jugador solo manda en SU partido de HOY: los de fechas anteriores que
    // quedaron pendientes (porque su club no jugó ese día) se simulan como los demás.
    const esMioHoy = m.date === ctx.fecha && (home.id === playerClubId || away.id === playerClubId);
    let homeGoals: number, awayGoals: number;
    if (esMioHoy) {
      const yoSoyLocal = home.id === playerClubId;
      homeGoals = yoSoyLocal ? playerGoals : opponentGoals;
      awayGoals = yoSoyLocal ? opponentGoals : playerGoals;
    } else {
      ({ homeGoals, awayGoals } = simulateMatch(home, away));
    }

    // Los PLAYOFFS no van a la tabla. En el Apertura colombiano el Junior juega 25 fechas y el
    // Millonarios 19: sumando las seis de cuartos, semis y final a la misma tabla, el campeón salía
    // de comparar 25 partidos contra 19 -- el que llegaba a la final quedaba arriba por haber
    // jugado más, no por andar mejor. El partido igual se guarda en `fixtures` (se jugó, y el
    // calendario lo muestra con su resultado), pero no mueve puntos.
    if (!playoffs.has(i)) {
      table = applyResultToTable(table, home.id, away.id, homeGoals, awayGoals);
    }
    fixtures.push({ matchweek: 0, homeTeamId: home.id, awayTeamId: away.id, played: true, homeGoals, awayGoals, round: clave });
    yaJugadas.add(clave);
  }

  return { ...season, fixtures, table, seasonYear: ctx.temporada };
}
