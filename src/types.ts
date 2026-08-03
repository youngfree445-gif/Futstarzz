/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { RegistroAnual } from './promocionDescenso';

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
  themeColor?: { primary: string; secondary: string }; // Color real de camiseta (hex) -- si existe, la app entera se repinta con estos colores mientras jugás en este club (ver applyClubTheme en App.tsx). Si falta, se mantiene el dorado/borgoña por defecto.
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
  sumaCalificacionesHistoricas: number; // suma de todas las calificaciones de partido -- promedio = suma / partidosHistoricos
  tarjetasAmarillasHistoricas: number; // acumulado de toda la carrera (a diferencia de yellowCards, que es solo la temporada en curso y se resetea)
  tarjetasRojasHistoricas: number;
}

export type AchievementCategory = 'carrera' | 'partido' | 'personal';

// Catálogo estático de logros (ver ACHIEVEMENTS_DATABASE en data.ts) -- check() es puro y solo lee
// del PlayerProfile, nunca lo muta; quien llama (checkAndUnlockAchievements en App.tsx) es quien
// decide si ya estaba desbloqueado y aplica la recompensa.
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  category: AchievementCategory;
  reward: number; // capital que se otorga al desbloquear (montos chicos y parejos, ver diseño)
  check: (profile: PlayerProfile) => boolean;
}

export type Superstition =
  | 'botin_derecho'
  | 'mismo_numero'
  | 'cancion_previa'
  | 'pie_derecho_cancha'
  | 'no_afeitarse'
  | 'ultimo_vestuario';

export interface Girlfriend {
  name: string;
  loveMeter: number; // 0-100, barra de la relación -- ver GIRLFRIEND_CANDIDATES y handleGirlfriend* en App.tsx
  livingTogether: boolean; // true si aceptaste mudarte juntos (ver handleGirlfriendMoveIn)
}

/** Un retiro de otro jugador del mundo, para narrarlo en ChutSocial. Ver worldRetirements.ts. */
export interface RetirementNews {
  clubName: string;
  playerName: string;
  age: number;
  replacementName: string;
}

export interface PlayerProfile {
  name: string;
  position: Position;
  age: number;
  nationality: Nationality;
  dorsal: number; // número de camiseta (1-99), elegido en la creación del personaje -- se muestra en Dashboard/roster
  heightCm: number; // altura en cm, elegida en la creación del personaje -- puramente informativo/de perfil por ahora
  energy: number;
  capital: number;
  prestige: number; // 0-100 (Relación vestuario / DT)
  fans: number;     // 0-100 (Relación hinchada / opinión pública)
  mentalHealth: number; // 0-100 (Fase 3): baja con derrotas/prensa hostil/rachas negativas, sube con victorias/descanso/buena prensa; afecta el % de éxito de las decisiones del partido igual que el resto de los multiplicadores
  lastMatchRating: number; // Fase 3: calificación del último partido jugado (0 si todavía no jugaste ninguno) -- dispara el post de "saludo de famoso" en ChutSocial si es muy alta
  lastMatchGoals: number; // Fase 4: goles del último partido jugado -- usado para logros puntuales (ej. hat-trick), no se acumula, se pisa cada partido
  lastMatchWonShootout: boolean; // Fase 4: true si el último partido se definió por penales y tu equipo ganó -- usado para el logro de la tanda
  yellowCards: number; // amarillas acumuladas en la temporada (fuera de un partido puntual); al llegar a un umbral, sanción automática -- ver handleFinishMatch
  suspendedMatches: number; // partidos de liga que te quedan por cumplir de sanción; startMatchflow los resuelve solo, sin pantalla de partido
  lastPressAnsweredWeek: number; // semana en que respondiste la última conferencia de prensa -- una sola por semana, evita farmear prestigio infinito ciclando preguntas
  superstition: Superstition; // Fase 2.5: ritual elegido en la creación del personaje -- romperlo tiene una chance chica cada partido de golpear mentalHealth, ver SUPERSTITIONS_DATABASE y handleFinishMatch
  matchesWithoutRest: number; // Fase 2.5: partidos jugados seguidos sin una semana de descanso -- pasado el umbral, MatchSimulator aplica una penalización temporal a los atributos efectivos (no muta attributes real). Se resetea a 0 cualquier semana que no juegues.
  hadBreakoutSeason: boolean; // Fase 2.5: la temporada que acaba de cerrar tuvo aporte ofensivo alto (ver applyBreakoutSeasonIfNewSeason) -- si la siguiente temporada no muestra crecimiento real de atributos, dispara el "síndrome del segundo año" (golpe chico a prestige/fans)
  attrSumAtSeasonStart: number; // Fase 2.5: suma de los 6 atributos al arrancar la temporada en curso -- referencia para medir el crecimiento real de esa temporada en applyBreakoutSeasonIfNewSeason
  yearsAtClub: number; // Fase 2.5: temporadas seguidas en el club actual -- se resetea a 0 en cada traspaso (ver handleAcceptTransfer). Pasado COMFORT_ZONE_YEARS_THRESHOLD, el entrenamiento rinde menos (ver handleTrainAttribute) -- "zona de confort"
  appearanceBonus: number; // Fase 2.5: cláusula de contrato fijada al fichar (ver handleAcceptTransfer/SetupScreen) -- se paga cada partido jugado, pero jugar ya exhausto para cobrarla genera fricción con el DT (ver handleFinishMatch)
  mentorshipPlayerName: string | null; // Fase 2.5: joven del plantel actual (de currentClub.starPlayers) elegido como ahijado -- cada cierre de temporada tira un roll según cómo evolucionó y suma/resta prestige (ver applyMentorshipIfNewSeason). null si no elegiste a nadie.
  missedClubMatchesForCountry: number; // Partidos importantes del club que te perdiste por ir con la selección (fecha FIFA, eliminatorias). Irte está permitido -- el club libera al jugador, como en la realidad -- pero perderse un partido de eliminación o un clásico enfría la relación con el DT: ver resolveNationalTeamCallup en App.tsx
  hasSteppedDownRetirement: boolean; // Fase 2.5: ya usaste la única chance de "retiro escalonado" (bajar de categoría en vez de retirarte al llegar a FORCED_RETIREMENT_AGE) -- ver isPastRetirementAge/findStepDownClub en App.tsx
  girlfriend: Girlfriend | null; // Fase 2.5: relación de pareja opcional -- null si estás soltero. Ver handleFindGirlfriend/handleGirlfriend* en App.tsx
  retiredWorldPlayers?: Record<string, Record<string, string>>; // Paso 3: retiros de OTROS jugadores del mundo. clubId -> { nombreRetirado: nombreDelCanteranoQueLoReemplaza }. Se acumula temporada a temporada (ver resolveWorldRetirements en worldRetirements.ts) y se aplica al leer cualquier plantel, para que los clubes envejezcan y se renueven solos. Opcional: las partidas viejas no lo tienen.
  lastRetirementNews?: RetirementNews[]; // Paso 3: retiros de la última temporada, para que ChutSocial los cuente. Se pisa cada temporada -- no es un historial.
  unlockedAchievements: Record<string, number>; // Fase 4: id de logro (ver ACHIEVEMENTS_DATABASE en data.ts) -> semana de carrera en que se desbloqueó. Ver checkAndUnlockAchievements en App.tsx.
  sponsorsSignedCount: number; // Fase 4: total de patrocinios firmados en toda la carrera (no baja si cancelás uno) -- usado para el logro "primer patrocinio", ver handleAcceptSponsor
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
  // Copas del calendario real que ganó el jugador (Superliga, Copa Colombia, Libertadores...).
  // Estas copas no tienen bracket en el motor -- sus cruces salen del calendario importado -- así
  // que no hay un championId que consultar y el título se anota acá al ganar la final.
  // Opcional: las partidas guardadas antes de que existiera este campo no lo traen.
  cupTitles?: CupTitle[];
  // Resultados de los partidos del calendario real, por fecha. Ver DatedResult: sin esto los
  // partidos de copa quedaban sin marcador en el calendario. Opcional por las partidas viejas.
  datedResults?: DatedResult[];
  // Lo que sumó cada club por año, para resolver ascensos y descensos (ver promocionDescenso.ts).
  // Hace falta guardarlo porque Colombia no baja por la tabla de posiciones sino por un promedio
  // plurianual, y porque Brasil desempata por victorias y goles, que se pierden al cerrar el año.
  // El tipo se importa en vez de repetirse: escrito a mano se desincronizó al sumar los desempates.
  historialAnual?: RegistroAnual[];
  // Clubes que cambiaron de división al cerrar un año: clubId -> división actual. Se aplica encima
  // de CLUBS_DATABASE, que es estático. Opcional por las partidas viejas.
  divisionOverrides?: Record<string, 1 | 2>;
  // Movimientos del último cierre de temporada, para poder contarlos en pantalla.
  ultimoAscensoDescenso?: {
    year: number;
    descienden: { clubId: string; clubName: string; promedio: number }[];
    ascienden: { clubId: string; clubName: string }[];
  };
}

/**
 * Un título ganado, anotado en el momento de ganarlo.
 *
 * Sirve tanto para copas como para ligas. Las ligas también se anotan acá aunque el motor lleve su
 * tabla, porque la vitrina no puede depender del estado en curso: al arrancar el Clausura la
 * temporada se reinicia y el Apertura ganado desaparecía de la vitrina.
 */
export interface CupTitle {
  competition: string; // "Superliga de Colombia", "Liga BetPlay Dimayor"
  year: number;
  clubId: string;
  /** 'Apertura' / 'Clausura' en las ligas de dos torneos. Ausente = copa o temporada corrida. */
  torneo?: string;
  /** 'liga' para los campeonatos domésticos; ausente = copa. Decide el ícono en la vitrina. */
  tipo?: 'liga' | 'copa';
}

/**
 * Resultado de un partido del calendario real, guardado por FECHA.
 *
 * Los partidos de copa (Superliga, Copa Colombia) no viven en ninguna tabla del motor -- sus cruces
 * salen del calendario importado -- así que su marcador no se podía recuperar de ningún lado y el
 * calendario los mostraba como "undefined undefined". Acá queda el resultado tal cual se jugó.
 */
export interface DatedResult {
  date: string;      // YYYY-MM-DD
  competition: string;
  opponentName: string;
  myGoals: number;
  rivalGoals: number;
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
  // Penal/tiro libre directo: en vez de elegir entre 3 acciones de texto distintas, elegís a dónde
  // patear (izquierda/centro/derecha) y el resultado se resuelve contra tu atributo tiro vs. el
  // arquero rival -- ver renderKickDirectionPicker en MatchSimulator.tsx. choices queda vacío/sin
  // uso en este modo.
  kickMode?: 'penalty' | 'freekick';
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
  // Palmarés de la liga en la que jugaste esa temporada, congelado al cerrarla. El panel de
  // estadísticas muestra siempre la temporada EN CURSO (se reinicia cada año), así que sin esto
  // no quedaría rastro de quién fue goleador en las temporadas anteriores de tu carrera.
  leagueName?: string;
  leagueTopScorer?: { name: string; clubName: string; value: number };
  leagueTopAssist?: { name: string; clubName: string; value: number };
  wasLeagueTopScorer?: boolean; // true si el goleador de la liga fuiste VOS -- se resalta en el historial
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
  /**
   * Jornada del calendario real a la que pertenece este partido ("5. Matchday"). Solo la traen los
   * fixtures generados desde el calendario real; el motor generado la deja sin definir.
   *
   * Sirve para no jugar dos jornadas en la misma semana: el calendario real a veces mete el cierre
   * de una fecha y el arranque de la siguiente en la misma semana, y sin esto LaLiga terminaba con
   * 43 fechas en vez de 38.
   */
  round?: string;
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