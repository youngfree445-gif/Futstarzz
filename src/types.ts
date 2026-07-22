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
  attributes: PlayerStats;
  careerStats: CareerStats;
  currentClubId: string;
  currentWeek: number;
  marketValue: number; // USD
  leagueSeasons: Record<string, LeagueSeasonState>; // todas las ligas ya "visitadas" corriendo en paralelo, clave = leagueKey
  continentalCups: Record<string, CupState>; // Copa Libertadores / Sudamericana por año, clave = `${cupId}-${year}`
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
  };
  purchased: boolean;
  icon: string;
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
  }[];
}

export interface SeasonHistory {
  seasonNum: number;
  clubName: string;
  goles: number;
  asistencias: number;
  partidos: number;
  titulo: string;
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
// Colombia: fase de todos-contra-todos -> top 8 -> Apertura: eliminación
// directa / Clausura: cuadrangulares. Argentina: 2 zonas -> top 8 por zona
// (16 en total) -> eliminación directa a partido único en ambos semestres.
export interface PlayoffMatch {
  homeTeamId: string;
  awayTeamId: string;
  played: boolean;
  homeGoals: number | null;
  awayGoals: number | null;
}

export interface PlayoffBracket {
  matchesByRound: PlayoffMatch[][]; // matchesByRound[0] = primera ronda de la fase eliminatoria
  championId: string | null;
}

export interface CuadrangularesState {
  groupA: string[]; // clubIds
  groupB: string[];
  tableA: TableTeam[];
  tableB: TableTeam[];
  fixturesA: Fixture[];
  fixturesB: Fixture[];
  finalPlayed: boolean;
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
  stage?: 'regular' | 'knockout' | 'cuadrangulares' | 'done';
  knockout?: PlayoffBracket;
  cuadrangulares?: CuadrangularesState;
  stepsConsumed?: number; // cuántas fechas de liga (independiente del semestre) ya se resolvieron en total, para el catch-up perezoso
}