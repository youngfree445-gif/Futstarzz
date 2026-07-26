/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Position = 'Delantero' | 'Mediocampista' | 'Defensor' | 'Arquero';
export type Nationality = string;

export interface Club {
  id: string;
  name: string;
  league: string; // The league/country name
  dt: string;
  reputation: number; // 1-5 stars
  initialSalary: number; // USD per week
  marketValue: number; // USD
  starPlayers: string[];
  description: string;
  badgeColor: string; // Tailwind bg class for aesthetic rendering
  badgeLogoUrl?: string; // Real or illustrative badge icon/emoji/flag
  badgeImageUrl?: string | null; // Escudo real (hotlink a Wikimedia Commons) -- ver ClubBadge.tsx para el fallback si falta o no carga
  hasSecondDivision?: boolean; // Flag to represent division state
  division?: 1 | 2 | 3; // Corregido: Ahora soporta división 3 sin errores
}

export interface SaveSlot {
  id: string;
  profile: PlayerProfile | null;
  shopItems: ShopItem[];
  lastSaved: string;
}

export interface PlayerStats {
  ritmo: number;
  regate: number;
  tiro: number;
  defensa: number;
  pase: number;
  fisico: number;
}

export interface CareerStats {
  goles: number;
  asistencias: number;
  partidos: number;
  campeonatos: number;
  golesHistoricos: number;
  asistenciasHistoricos: number;
  partidosHistoricos: number;
}

export interface PlayerProfile {
  name: string;
  position: Position;
  age: number;
  nationality: Nationality;
  energy: number;
  capital: number;
  prestige: number; // 0-100 (Relación vestuario / DT)
  fans: number;     // 0-100 (Relación hinchada / opinión pública)
  mentalHealth: number; // 0-100 (Fase 3): baja con derrotas/prensa hostil/rachas negativas, sube con victorias/descanso/buena prensa; afecta el % de éxito de las decisiones del partido igual que el resto de los multiplicadores
  lastMatchRating: number; // Fase 3: calificación del último partido jugado (0 si todavía no jugaste ninguno) -- dispara el post de "saludo de famoso" en ChutSocial si es muy alta
  yellowCards: number; // amarillas acumuladas en la temporada (fuera de un partido puntual); al llegar a un umbral, sanción automática -- ver handleFinishMatch
  suspendedMatches: number; // partidos de liga que te quedan por cumplir de sanción; startMatchflow los resuelve solo, sin pantalla de partido
  lastPressAnsweredWeek: number; // semana en que respondiste la última conferencia de prensa -- una sola por semana, evita farmear prestigio infinito ciclando preguntas
  attributes: PlayerStats;
  careerStats: CareerStats;
  seasonHistory: SeasonHistory[]; // trayectoria club a club por temporada -- ver recordSeasonHistory en App.tsx
  currentClubId: string;
  currentWeek: number;
  marketValue: number; // USD
  leagueSeasons: Record<string, LeagueSeasonState>; // todas las ligas ya "visitadas" corriendo en paralelo, clave = leagueKey
  continentalCups: Record<string, CupState>; // Copa Libertadores / Sudamericana por año, clave = `${cupId}-${year}`
  uefaCups: Record<string, UefaCupState>; // Champions / Europa League, clave = cupId ('champions' | 'europa') -- una edición corre varios "años" calendario, ver nota en UefaCupState
  worldCups: Record<string, WorldCupState>; // Mundial cada 4 años, clave = year de esa edición
}

// --- Copa Libertadores / Copa Sudamericana ---
export interface CupGroup {
  id: string; // 'A'..'H'
  clubIds: string[]; // 4
  table: TableTeam[];
  fixtures: Fixture[];
}

export interface CupState {
  cupId: 'libertadores' | 'sudamericana';
  year: number;
  groups: CupGroup[];
  stage: 'groups' | 'knockout' | 'done';
  knockout: PlayoffBracket | null;
  championId: string | null;
  stepsConsumed: number;
}

// --- Champions League / Europa League (formato Swiss simplificado) ---
// A diferencia de Libertadores/Sudamericana (grupos de 4), acá cada club
// juega una "fase de liga" de fechas fijas contra rivales DISTINTOS (no
// todos-contra-todos) en una tabla única, y desde los playoffs/octavos se
// juega a ida y vuelta con marcador global (sin gol de visitante, per las
// reglas UEFA vigentes); un empate global se resuelve con una tanda de
// penales real (ver simulatePenaltyShootout en leagueEngine.ts), guardada
// en penaltyShootout para que la UI la pueda narrar si es tu partido.
export interface TwoLegTie {
  clubAId: string; // local en la ida
  clubBId: string; // local en la vuelta
  firstLegGoalsA: number | null;
  firstLegGoalsB: number | null;
  secondLegGoalsA: number | null; // A de visitante
  secondLegGoalsB: number | null; // B de local
  played: boolean; // true cuando ya se jugaron ambas idas y vueltas
  winnerId: string | null;
  penaltyShootout?: PenaltyShootoutResult; // solo presente si el global terminó igualado
}

// Tanda de penales real (no un coin-flip invisible): kicks en orden de ejecución real
// (A,B,A,B,... y luego muerte súbita si sigue empatado tras 5 c/u).
export interface PenaltyShootoutResult {
  clubAId: string;
  clubBId: string;
  kicks: { clubId: string; scored: boolean }[];
  scoreA: number;
  scoreB: number;
  winnerId: string;
}

export interface TwoLegBracket {
  tiesByRound: TwoLegTie[][];
  championId: string | null;
}

export interface UefaCupState {
  cupId: 'champions' | 'europa';
  year: number; // número de edición (1, 2, 3...), solo para mostrar -- NO define el calendario
  participants: string[];
  fixtures: Fixture[]; // fase de liga: 8 fechas por club, rivales distintos
  table: TableTeam[];
  stage: 'league_phase' | 'playoff' | 'knockout' | 'done';
  playoff: TwoLegTie[] | null; // puestos 9-24 del campo, UNA sola ronda ida y vuelta -> ganadores completan los octavos
  knockout: TwoLegBracket | null; // desde octavos en adelante, siempre ida y vuelta hasta la final
  championId: string | null;
  stepsConsumed: number; // pasos ya resueltos DE ESTA EDICIÓN (se reinicia al arrancar la siguiente)
  // Una edición completa (fase de liga + playoff + octavos-a-final) necesita ~19 semanas de copa, más de
  // lo que caben en un solo "año" de 38 semanas (SEASON_LENGTH_WEEKS) -- a diferencia de Libertadores/
  // Sudamericana, que sí entran en un año. Por eso esta copa NO se indexa por año calendario: vive en un
  // único slot por cupId (ver PlayerProfile.uefaCups) y este campo guarda en qué "paso global" (contando
  // TODAS las semanas de copa desde el arranque de la carrera) arrancó la edición actual, para saber
  // cuántos pasos de catch-up le corresponden sin pisar el límite de 38 semanas.
  startedAtStep: number;
}

// --- Mundial (cada 4 años) ---
// Formato real 2026: 48 selecciones, 12 grupos de 4 a una sola vuelta (3
// fechas), top 2 de grupo + mejores 8 terceros -> Ronda de 32 -> octavos ->
// cuartos -> semis -> final, TODO a partido único (el Mundial, a diferencia
// de las copas de clubes UEFA, no juega ninguna fase a ida y vuelta).
// Reutiliza CupGroup y PlayoffBracket tal cual -- misma forma que
// CupState, solo con más grupos y una llave de entrada más grande (32 en
// vez de 16), por eso seedBracket ahora también soporta length 32.
// Simplificación deliberada: no hay partido por el tercer puesto (no
// afecta quién sale campeón) y los "mejores 8 terceros" no se ubican en el
// cuadro según las reglas reales de cruce de la FIFA -- se siembran junto a
// los demás clasificados por reputación, igual que en Libertadores.
export interface WorldCupState {
  year: number; // año de esta edición dentro de la carrera (cada 4 años)
  groups: CupGroup[]; // 12 grupos de 4
  stage: 'groups' | 'knockout' | 'done';
  knockout: PlayoffBracket | null;
  championId: string | null;
  stepsConsumed: number;
}

export interface SocialPost {
  id: string;
  author: string;
  role: string; // 'Periodista', 'Hincha', 'Club Oficial', 'Compañero'
  content: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  avatar: string;
}

export interface PressQuestion {
  id: string;
  context: string;
  mediaName: string;
  mediaColor: string;
  reporter?: string; // Corregido: Cambiado 'mediaName' por 'reporter' para coincidir con la BD
  reporterAvatar: string;
  reporterAvatarImg?: string; // foto real (importada) del reportero, si existe, en vez del emoji
  question: string;
  options: {
    text: string;
    prestigeChange: number;
    fansChange: number;
    energyChange: number;
    reaction: string;
  }[];
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  description: string;
  perkText: string;
  effect: {
    attribute?: keyof PlayerStats;
    value?: number;
    permanentEnergyBonus?: number;
    prestigeBonus?: number;
    fansBonus?: number;
    fatigueReduction?: number; // how much less energy is spent per match
    passiveIncome?: number; // capital que se gana cada vez que avanzás la semana, si el item está comprado
  };
  category?: string; // si está presente, solo podés tener UN item comprado de esta categoría a la vez (patrocinios en conflicto)
  sensitiveToControversy?: boolean; // marcas que cuidan mucho su imagen: si te metés en una polémica grande, hay chance de que rescindan el contrato (ver checkSponsorControversyFallout en App.tsx)
  purchased: boolean;
  icon: string;
  image?: string; // foto de portada de la card; si falta, la tienda cae a un ícono genérico y Patrocinios cae al ícono de Handshake (ver Dashboard.tsx)
}

export interface MatchEvent {
  minute: number;
  text: string;
  type: 'neutral' | 'good' | 'bad' | 'decision' | 'highlight';
}

export interface MatchDecision {
  prompt: string;
  choices: {
    text: string;
    requiredAttr: keyof PlayerStats;
    minVal: number;
    successBonus: string;
    failPenalty: string;
    successChance: number; // base chance
    effectOnSuccess: { goals: number; assists: number; prestige: number; fans: number };
    effectOnFail: { prestige: number; fans: number; energy: number };
    cardRiskOnFail?: 'yellow' | 'red'; // decisiones agresivas/temerarias (barridas, presión física, salidas de arquero): si fallan, tarjeta segura
  }[];
}

export interface SeasonHistory {
  seasonNum: number;
  clubId: string;
  clubName: string;
  goles: number;
  asistencias: number;
  partidos: number;
  titulo: string; // vacío si no hubo título ese tramo; texto corto si sí (ej. "🏆 Campeón")
}

export interface TableTeam {
  clubId?: string; // Preferí comparar por id en vez de name — un nombre corto de club puede colisionar con otro club real (ver bug de "Arsenal" en data.ts)
  name: string;
  puntos: number;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
}

export interface Fixture {
  matchweek: number;
  homeTeamId: string;
  awayTeamId: string;
  played: boolean;
  homeGoals: number | null;
  awayGoals: number | null;
}

// --- Formato Apertura/Clausura (Colombia y Argentina) ---
// Colombia: fase de todos-contra-todos -> top 8 -> Cuartos, Semifinal y
// Final a ida y vuelta (formato real vigente desde 2024), igual en Apertura
// y Clausura -- ver twoLegKnockout abajo. Argentina: 2 zonas -> top 8 por
// zona (16 en total) -> eliminación directa a partido único en ambos
// semestres -- ver knockout abajo.
export interface PlayoffMatch {
  homeTeamId: string;
  awayTeamId: string;
  played: boolean;
  homeGoals: number | null;
  awayGoals: number | null;
  penaltyShootout?: PenaltyShootoutResult; // solo presente si el partido terminó igualado
}

export interface PlayoffBracket {
  matchesByRound: PlayoffMatch[][]; // matchesByRound[0] = primera ronda de la fase eliminatoria
  championId: string | null;
}

export interface LeagueSeasonState {
  leagueKey: string; // `${club.league}-${club.division}`
  fixtures: Fixture[];
  table: TableTeam[];
  round: number; // cuántas veces se regeneró el fixture (ligas cortas que llegan al final de la vuelta antes de terminar la temporada)
  // Solo se usan en ligas con formato Apertura/Clausura (Colombia, Argentina):
  semester?: 1 | 2; // 1 = Apertura, 2 = Clausura
  semesterStartWeek?: number; // currentWeek en el que arrancó la fase de todos-contra-todos del semestre actual
  stage?: 'regular' | 'knockout' | 'done';
  knockout?: PlayoffBracket; // Argentina: Cuartos-Semifinal-Final a partido único
  twoLegKnockout?: TwoLegBracket; // Colombia: Cuartos-Semifinal-Final a ida y vuelta
  stepsConsumed?: number; // cuántas fechas de liga (independiente del semestre) ya se resolvieron en total, para el catch-up perezoso
}