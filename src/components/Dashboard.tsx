import React, { useState, useEffect } from 'react';
import { PlayerProfile, Club, ShopItem, TableTeam, Position, PlayerStats, TwoLegTie, PlayoffMatch } from '../types';
// Corregido: Importamos ULTIMATE_CLUBS_DATABASE y getClubWithRoster en lugar de soccerDatabase (que solo tenía 3 clubes de prueba hardcodeados)
import { ULTIMATE_CLUBS_DATABASE, PRESS_QUESTIONS_POOL, getClubWithRoster, MAX_ACTIVE_SPONSORSHIPS, WORLD_CUP_TEAMS_DATABASE, NATIONALITY_TO_WORLD_CUP_TEAM_ID, ACHIEVEMENTS_DATABASE, REAL_TRANSFER_POOL, REAL_LEAGUE_LEADERS } from '../data';
import { ROSTER_ENRICHMENT } from '../rosterEnrichment';
import { PLAYER_ENRICHMENT } from '../playerEnrichment';
import { TM_SQUAD_ENRICHMENT } from '../tmSquadEnrichment';
import { applySquadRetirements, MENTEE_MAX_AGE, getSquadPlayerAge, displayName } from '../worldRetirements';
import { hasRealSchedule, matchesThisWeek, pickPrimary } from '../realSchedule';
import { fixturesAtStep, fixturesForClub, hasDatedLeagueSchedule, hasDatedSchedule, pasoDeFecha, pickPrimary as pickDatedPrimary, torneoDeFecha } from '../dateSchedule';
import { formatDate, formatDateShort } from '../careerTimeline';
import { resolverClubDeCalendario } from '../clubAliases';
import { getLeagueDisplay } from '../leagueDisplay';
import { getPalmares } from '../palmares';
import { postsDelPartido } from '../chutSocialVoces';
import {
  leagueKeyFor, sortTable, getSeasonYear, isCupWeek, isWorldCupBreakWeek,
  getLibertadoresParticipants, getSudamericanaParticipants, getOrCreateCupState, getUpcomingCupMatch,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState, getUpcomingUefaCupMatch,
  isClubStillInCup, isClubStillInUefaCup,
  getOrCreateWorldCupState, getUpcomingWorldCupMatch, WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD, WORLD_CUP_CALLUP_MIN_MATCHES, isWorldCupYear,
  isTransferWindowOpen, weeksUntilTransferWindow, formatRealDate, getRealDate,
  getRealDateForLeagueStepsAhead, getRealDateForCupStepsAhead, getRealDateForLeagueStepsBehind, getRealDateForCupStepsBehind,
  isApeturaClausuraLeague, getUpcomingMatchForLeague, getOrCreateSeasonForLeague, generateLeagueLeadersFromTable,
  CAREER_START_YEAR
} from '../leagueEngine';
import {
  User, Award, Dumbbell, Send, Radio, RefreshCw, ShoppingBag,
  Table, Zap, DollarSign, Star, Heart, Flame, LogOut, ArrowRight, CheckCircle,
  ShieldAlert, Sparkles, MessageCircle, TrendingUp, HelpCircle, Brain, Calendar, Handshake, Trophy, Lock
} from 'lucide-react';
import ClubBadge from './ClubBadge';
import { fetchReactionGif, searchReactionGifs } from '../services/giphy';
import trainingRitmoImg from '../assets/training/ritmo.jpg';
import trainingRegateImg from '../assets/training/regate.jpg';
import trainingTiroImg from '../assets/training/tiro.jpg';
import trainingDefensaImg from '../assets/training/defensa.jpg';
import trainingPaseImg from '../assets/training/pase.jpg';
import trainingFisicoImg from '../assets/training/fisico.jpg';
import mauSportsAvatar from '../assets/mau_sports.jpg';
import fabrizioRomanoAvatar from '../assets/press/FABRIZZIO ROMANO.jpg';
import gastonEdulAvatar from '../assets/press/gaston Edul.jpg';
import eduAguirreAvatar from '../assets/press/EDU AGUIRRE.jpg';
import pipeSierraAvatar from '../assets/press/PIPE SIERRA.jpg';
import joseHugoIlleraAvatar from '../assets/press/josehugoillera.jpg';
import carlosAntonioVelezAvatar from '../assets/press/Carlos Antonio Velez.jpg';
import eduardoLuisAvatar from '../assets/press/eduardo luis.jpg';
import espnLogo from '../assets/press/ESPN.png';
import rcnLogo from '../assets/press/RCN.jpg';
import caracolLogo from '../assets/press/CARACOL.jpg';

const CALENDAR_MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const CALENDAR_WEEKDAY_NAMES = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

// Fase 2.5 -- Rivalidad generacional: tabla estática de hitos (generación automática, solo umbrales
// fijos) contra la que se compara el aporte ofensivo acumulado de toda la carrera (goles +
// asistencias históricos). Puramente de exhibición -- no lee ni escribe ningún campo nuevo del
// perfil, solo re-lee careerStats que ya existía.
const CAREER_MILESTONES: { threshold: number; label: string }[] = [
  { threshold: 0, label: 'Promesa del Club' },
  { threshold: 25, label: 'Titular Indiscutido' },
  { threshold: 50, label: 'Referente del Plantel' },
  { threshold: 100, label: 'Ídolo de la Hinchada' },
  { threshold: 200, label: 'Leyenda Viva' },
  { threshold: 350, label: 'Mito Eterno del Fútbol' }
];

interface CalendarEvent {
  date: Date;
  label: string; // rótulo corto de jornada para la esquina (J3, G1, Cuartos...)
  sublabel: string; // texto completo "vs./@ Rival", usado como tooltip
  colorClass: string;
  opponentClub?: Club;
  played?: boolean;
  result?: 'V' | 'E' | 'D';
  score?: string; // "3-1", ya orientado a favor/en contra de tu club
  esHoy?: boolean; // el partido que te toca AHORA -- se resalta para no confundirlo con los demás
}

function resultFromScore(myGoals: number, rivalGoals: number): 'V' | 'E' | 'D' {
  return myGoals > rivalGoals ? 'V' : myGoals === rivalGoals ? 'E' : 'D';
}

// Mentoría de Jóvenes: la edad sale de getSquadPlayerAge (worldRetirements.ts), que consulta
// PLAYER_ENRICHMENT y TM_SQUAD_ENRICHMENT y solo cae a un hash del nombre cuando no hay dato real.
//
// Antes esta lógica estaba duplicada acá con su propia copia del hash. Se unificó porque tener dos
// fuentes de edad permite que diverjan: los retiros del mundo podían considerar veterano a alguien
// que la mentoría seguía ofreciendo como promesa.
const getMenteeAge = getSquadPlayerAge;

/** Temporadas transcurridas desde el inicio de la carrera, para envejecer al mundo. */
const seasonsElapsed = (week: number) => Math.max(0, getSeasonYear(week) - CAREER_START_YEAR);

// Ligas que dominan la conversación en ChutSocial. Son las que un hincha real sigue a diario, así
// que el feed tiene que sonar a ellas: sin esto, de los 706 clubes con plantel solo el 43% es de
// estas 7, y más de la mitad de los posts terminaban hablando de ligas que nadie mira.
const CHUTSOCIAL_TOP_LEAGUES = [
  'Colombiana', 'Argentina', 'Brasileña', 'Española', 'Italiana', 'Inglesa', 'Alemana',
];

// De cada 10 posts, cuántos salen sí o sí de las ligas de arriba. No es 10/10 a propósito: dejar
// una porción chica al resto del mundo es lo que hace que aparezca la sorpresa ocasional (un
// crack en Portugal, un veterano en la MLS) sin que el feed deje de sentirse "de tu fútbol".
const TOP_LEAGUE_SHARE = 0.85;

/**
 * Clubes candidatos a aparecer en ChutSocial, ordenados para que las ligas top copen el feed.
 *
 * Devuelve una lista ya barajada de forma estable por semana (no se reordena en cada render) en la
 * que los primeros TOP_LEAGUE_SHARE de los puestos son de las ligas grandes. Los generadores toman
 * `slice(0, n)` de acá, así que con solo respetar el orden ya heredan el reparto.
 */
function rankClubsForSocial(
  clubs: Club[],
  excludeClubId: string,
  seed: number,
  spread: number
): Club[] {
  const shuffle = (list: Club[]) =>
    list
      .map((club, i) => ({ club, key: Math.abs(Math.sin((seed + i * spread) * 78.233)) }))
      .sort((a, b) => a.key - b.key)
      .map(x => x.club);

  const candidates = clubs.filter(c => c.id !== excludeClubId && c.starPlayers?.length > 0);
  const top = shuffle(candidates.filter(c => CHUTSOCIAL_TOP_LEAGUES.includes(c.league)));
  const rest = shuffle(candidates.filter(c => !CHUTSOCIAL_TOP_LEAGUES.includes(c.league)));
  if (top.length === 0) return rest; // por las dudas: nunca dejar el feed vacío

  // Intercalar respetando la proporción: cada vez que la cuota acumulada de "resto" supera 1,
  // se cuela un club de liga menor. Con 0.85 eso es ~1 de cada 7 posts.
  const out: Club[] = [];
  let debt = 0;
  let ti = 0;
  let ri = 0;
  while (ti < top.length || ri < rest.length) {
    debt += 1 - TOP_LEAGUE_SHARE;
    if (debt >= 1 && ri < rest.length) {
      out.push(rest[ri++]);
      debt -= 1;
    } else if (ti < top.length) {
      out.push(top[ti++]);
    } else if (ri < rest.length) {
      out.push(rest[ri++]);
    }
  }
  return out;
}

// Descompone una llave a ida y vuelta ya jugada en hasta 2 partidos reales de calendario (Vuelta
// primero, por ser la más reciente) -- una llave completa son 2 fechas distintas, no un solo evento.
function twoLegTieToEvents(tie: TwoLegTie, myClubId: string): { leg: 'Ida' | 'Vuelta'; isHome: boolean; opponentId: string; myGoals: number; rivalGoals: number }[] {
  const opponentId = tie.clubAId === myClubId ? tie.clubBId : tie.clubAId;
  const out: { leg: 'Ida' | 'Vuelta'; isHome: boolean; opponentId: string; myGoals: number; rivalGoals: number }[] = [];
  if (tie.secondLegGoalsA !== null && tie.secondLegGoalsB !== null) {
    out.push({
      leg: 'Vuelta',
      isHome: tie.clubBId === myClubId,
      opponentId,
      myGoals: myClubId === tie.clubAId ? tie.secondLegGoalsA : tie.secondLegGoalsB,
      rivalGoals: myClubId === tie.clubAId ? tie.secondLegGoalsB : tie.secondLegGoalsA
    });
  }
  if (tie.firstLegGoalsA !== null && tie.firstLegGoalsB !== null) {
    out.push({
      leg: 'Ida',
      isHome: tie.clubAId === myClubId,
      opponentId,
      myGoals: myClubId === tie.clubAId ? tie.firstLegGoalsA : tie.firstLegGoalsB,
      rivalGoals: myClubId === tie.clubAId ? tie.firstLegGoalsB : tie.firstLegGoalsA
    });
  }
  return out;
}

interface SocialPost {
  id: string;
  author: string;
  role: string;
  content: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  avatar: string;
  avatarImg?: string;
  gifQuery?: string; // si está presente, Dashboard busca un GIF de reacción en Giphy para este post (ver postGifs)
}

function singleLegMatchToEvent(m: PlayoffMatch, myClubId: string): { isHome: boolean; opponentId: string; myGoals: number; rivalGoals: number } | null {
  if (!m.played || m.homeGoals === null || m.awayGoals === null) return null;
  if (m.homeTeamId !== myClubId && m.awayTeamId !== myClubId) return null;
  const isHome = m.homeTeamId === myClubId;
  return {
    isHome,
    opponentId: isHome ? m.awayTeamId : m.homeTeamId,
    myGoals: isHome ? m.homeGoals : m.awayGoals,
    rivalGoals: isHome ? m.awayGoals : m.homeGoals
  };
}

// Cuadrícula de semanas para un mes real (una fila por semana, domingo primero, celdas null antes
// del día 1 y después del último día para que el grid quede parejo) -- para pintar el calendario
// como una grilla real en vez de una lista plana de "Fecha N".
function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// n = cantidad de partidos/llaves en la ronda de playoffs actual -- deriva el nombre real de la
// ronda sin tener que llevar un campo aparte (4 llaves = Cuartos, 2 = Semifinal, 1 = Final, etc.)
function roundLabelByMatchCount(n: number): string {
  if (n === 1) return 'Final';
  if (n === 2) return 'Semifinal';
  if (n === 4) return 'Cuartos';
  if (n === 8) return 'Octavos';
  return `Ronda de ${n * 2}`;
}

/**
 * Cómo va la llave para el club del jugador: si es la ida, si es la vuelta y con qué global llega.
 * En una eliminatoria a dos partidos el resultado de la ida es la información que más importa antes
 * de salir a la cancha, y no se mostraba en ningún lado.
 */
function tieStatusLabel(tie: TwoLegTie, myClubId: string): { leg: 'Ida' | 'Vuelta'; global: string | null } {
  const soyA = tie.clubAId === myClubId;
  const idaJugada = tie.firstLegGoalsA !== null && tie.firstLegGoalsB !== null;
  if (!idaJugada) return { leg: 'Ida', global: null };

  // En la vuelta se invierte la localía, así que el global se arma sumando ambas piernas.
  const misGoles = (soyA ? tie.firstLegGoalsA : tie.firstLegGoalsB) ?? 0;
  const susGoles = (soyA ? tie.firstLegGoalsB : tie.firstLegGoalsA) ?? 0;
  return { leg: 'Vuelta', global: `${misGoles}-${susGoles}` };
}

interface DashboardProps {
  playerProfile: PlayerProfile;
  shopItems: ShopItem[];
  onTrainAttribute: (attr: keyof PlayerStats) => void;
  onSelectMentee: (playerName: string | null) => void;
  onFindGirlfriend: () => void;
  onGirlfriendFlowers: () => void;
  onGirlfriendPhoto: () => void;
  onGirlfriendFaithful: () => void;
  onGirlfriendCheat: () => void;
  onGirlfriendDenyRumors: () => void;
  onGirlfriendMoveIn: (accept: boolean) => void;
  onReconvertPosition: (newPosition: Position) => void;
  onBuyItem: (itemId: string) => void;
  onAcceptSponsor: (itemId: string) => void;
  onCancelSponsor: (itemId: string) => void;
  onLaunchPRCampaign: (cost: number, fansBonus: number, prestigeBonus: number, salaryBonus?: number) => void;
  onAnswerPress: (prestigeChange: number, fansChange: number, energyChange: number) => void;
  onAcceptTransfer: (clubId: string, signOnBonus: number) => void;
  onAdvanceWeek: () => void;
  onRecoverEnergy: (cost: number, energyAmount: number) => void;
  onSocialInteraction: () => void;
  onLogout: () => void;
  onResetGame: () => void;
}

export default function Dashboard({
  playerProfile,
  shopItems,
  onTrainAttribute,
  onSelectMentee,
  onFindGirlfriend,
  onGirlfriendFlowers,
  onGirlfriendPhoto,
  onGirlfriendFaithful,
  onGirlfriendCheat,
  onGirlfriendDenyRumors,
  onGirlfriendMoveIn,
  onReconvertPosition,
  onBuyItem,
  onAcceptSponsor,
  onCancelSponsor,
  onLaunchPRCampaign,
  onAnswerPress,
  onAcceptTransfer,
  onAdvanceWeek,
  onRecoverEnergy,
  onSocialInteraction,
  onLogout,
  onResetGame
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'carrera' | 'entrenamiento' | 'chutsocial' | 'prensa' | 'traspasos' | 'tienda' | 'patrocinios' | 'tablas' | 'mi_club' | 'calendario' | 'logros'>('carrera');
  const [pressResponseState, setPressResponseState] = useState<'asking' | 'answered'>('asking');
  const [pressReaction, setPressReaction] = useState('');
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  // Pestaña Tablas: por defecto muestra la liga del jugador, pero puede explorar cualquier otra
  // liga del juego solo para consulta (no persiste su LeagueSeasonState -- se recalcula al vuelo
  // con getOrCreateSeasonForLeague cada vez que la abrís, igual que hace cualquier liga que el
  // jugador todavía no visitó).
  const [tablesLeagueOverride, setTablesLeagueOverride] = useState<string | null>(null);
  // Pestaña Mi Club: podés explorar la plantilla de CUALQUIER club del juego, no solo el tuyo --
  // pero la Mentoría de Jóvenes sigue atada siempre a tu club real (currentClub), no al explorado,
  // porque es una mecánica de tu carrera, no un dato de consulta.
  const [rosterClubIdOverride, setRosterClubIdOverride] = useState<string | null>(null);
  // ChutSocial: likes/comentarios son interacción local de la sesión (los posts en sí ya rotan
  // semana a semana vía hash pseudo-aleatorio, no viven en el save) -- el jugador puede likear
  // cualquier post y comentar lo que quiera, sin filtro, y su comentario aparece con miles de
  // likes automáticos bajo su propio nombre de jugador.
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [postComments, setPostComments] = useState<Record<string, { id: string; text: string; likes: number; gifUrl?: string }[]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [openCommentBox, setOpenCommentBox] = useState<string | null>(null);
  // GIFs de reacción (vía Giphy, ver services/giphy.ts): se cargan de forma asíncrona por postId
  // porque generateSocialFeed() es síncrona y se llama directo en el render -- no se puede hacer
  // fetch ahí adentro. Si no hay API key configurada o falla la red, simplemente no aparece GIF.
  const [postGifs, setPostGifs] = useState<Record<string, string>>({});
  const [gifPickerOpenFor, setGifPickerOpenFor] = useState<string | null>(null);
  const [gifSearchQuery, setGifSearchQuery] = useState('');
  const [gifSearchResults, setGifSearchResults] = useState<string[]>([]);
  const [gifSearchOffset, setGifSearchOffset] = useState(0);
  const [gifSearchLoadingMore, setGifSearchLoadingMore] = useState(false);
  const [commentGifDrafts, setCommentGifDrafts] = useState<Record<string, string>>({});
  // Lightbox: click en cualquier GIF ya publicado (post o comentario) lo agranda en un overlay
  // sobre el resto del juego -- click afuera (o en el ✕) lo cierra y volvés a donde estabas.
  const [expandedGifUrl, setExpandedGifUrl] = useState<string | null>(null);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
        // Solo al dar like (no al sacarlo) -- desconectarte un rato con el celular recarga un poco.
        onSocialInteraction();
      }
      return next;
    });
  };

  const submitComment = (postId: string) => {
    const text = (commentDrafts[postId] || '').trim();
    const gifUrl = commentGifDrafts[postId];
    if (!text && !gifUrl) return;
    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), {
        id: `${postId}_c${(prev[postId]?.length || 0)}_${Date.now()}`,
        text,
        likes: 1200 + Math.floor(Math.random() * 15000),
        gifUrl
      }]
    }));
    setCommentDrafts(prev => ({ ...prev, [postId]: '' }));
    setCommentGifDrafts(prev => { const next = { ...prev }; delete next[postId]; return next; });
    onSocialInteraction();
  };

  // Búsqueda de GIF para adjuntar a tu propio comentario -- se dispara al abrir el selector con
  // el nombre de tu jugador como query por defecto, o lo que el usuario tipee en gifSearchQuery.
  // Reinicia la paginación: es una búsqueda nueva, no una continuación.
  const searchGifsForComment = async (query: string) => {
    setGifSearchQuery(query);
    setGifSearchOffset(0);
    if (!query.trim()) { setGifSearchResults([]); return; }
    const results = await searchReactionGifs(query, 0);
    setGifSearchResults(results);
  };

  // "Cargar más": pide el siguiente lote de la misma búsqueda y lo agrega al final de la lista ya
  // mostrada, en vez de reemplazarla -- así el usuario puede seguir scrolleando sin perder lo que
  // ya vio.
  const loadMoreGifs = async () => {
    if (!gifSearchQuery.trim() || gifSearchLoadingMore) return;
    setGifSearchLoadingMore(true);
    const nextOffset = gifSearchOffset + 24;
    const results = await searchReactionGifs(gifSearchQuery, nextOffset);
    setGifSearchResults(prev => [...prev, ...results]);
    setGifSearchOffset(nextOffset);
    setGifSearchLoadingMore(false);
  };

  // Al avanzar de semana vuelve a habilitarse la sala de prensa (la respuesta de la semana
  // anterior queda igual bloqueada por lastPressAnsweredWeek en el perfil).
  useEffect(() => {
    setPressResponseState('asking');
  }, [playerProfile.currentWeek]);

  // Corregido: Busca el club en la base de datos inyectada con el JSON
  const currentClub = ULTIMATE_CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;

  // Plantel de un club con los retiros del mundo ya aplicados (ver worldRetirements.ts): quien se
  // retiró aparece reemplazado por su canterano. Hay que usar esto en vez de `club.starPlayers`
  // en todo lo que se muestre al jugador, o el feed seguiría hablando de gente que ya no juega.
  const squadOf = (club: Club) =>
    applySquadRetirements(club.id, club.starPlayers, playerProfile.retiredWorldPlayers);

  /** Igual que squadOf pero con los nombres listos para mostrar (sin marca de debut). */
  const squadNames = (club: Club) => squadOf(club).map(displayName);
  // Fase 4: costo en capital de cada sesión de entrenamiento -- misma fórmula que handleTrainAttribute en App.tsx.
  const trainingCost = 200 + currentClub.reputation * 150;

  // Fase 2.5 -- Rivalidad generacional: nivel actual (el hito más alto ya alcanzado) y progreso
  // hacia el próximo, según CAREER_MILESTONES.
  const careerContribution = playerProfile.careerStats.golesHistoricos + playerProfile.careerStats.asistenciasHistoricos;
  const currentMilestoneIdx = CAREER_MILESTONES.reduce((bestIdx, m, i) => careerContribution >= m.threshold ? i : bestIdx, 0);
  const currentMilestone = CAREER_MILESTONES[currentMilestoneIdx];
  const nextMilestone = CAREER_MILESTONES[currentMilestoneIdx + 1] || null;
  const milestoneProgressPct = nextMilestone
    ? Math.min(100, Math.round(((careerContribution - currentMilestone.threshold) / (nextMilestone.threshold - currentMilestone.threshold)) * 100))
    : 100;
  const myLeagueKey = leagueKeyFor(currentClub);
  const myLeagueTable = sortTable(playerProfile.leagueSeasons[myLeagueKey]?.table || []);

  // Todas las ligas del juego disponibles para explorar en la pestaña Tablas (no solo la del
  // jugador), agrupadas por leagueKey (liga+división) -- ver tablesLeagueOverride arriba.
  const allLeagueKeys = Array.from(new Set(ULTIMATE_CLUBS_DATABASE.map(c => leagueKeyFor(c)))).sort();
  const selectedLeagueKey = tablesLeagueOverride ?? myLeagueKey;
  const selectedLeagueClubs = ULTIMATE_CLUBS_DATABASE.filter(c => leagueKeyFor(c) === selectedLeagueKey);
  const selectedLeagueTable = selectedLeagueKey === myLeagueKey
    ? myLeagueTable
    : selectedLeagueClubs.length > 0
    ? sortTable(getOrCreateSeasonForLeague(selectedLeagueClubs, playerProfile.leagueSeasons[selectedLeagueKey], playerProfile.currentWeek).table)
    : [];
  // Estadísticas de jugadores de la liga seleccionada: usamos datos REALES (REAL_LEAGUE_LEADERS)
  // cuando existen para esa liga (7 grandes europeas + 8 latinoamericanas curadas); el resto se
  // genera de forma determinística a partir del gf/gc real de la tabla -- ver
  // generateLeagueLeadersFromTable en leagueEngine.ts, nunca cambia si la tabla no cambió.
  const selectedLeagueName = selectedLeagueClubs[0]?.league ?? currentClub.league;

  // Rótulo del torneo que se está mirando. En Colombia y Argentina un año son DOS campeonatos
  // (Apertura y Clausura) con tabla propia, así que sin esto la tabla parecía reiniciarse sola.
  const torneoEnCurso = (() => {
    if (!isApeturaClausuraLeague(selectedLeagueName)) return null;
    // Se lee directo del perfil y no de myLeagueSeason: esa constante se declara ~870 líneas más
    // abajo, y usarla acá lanzaba un ReferenceError por zona muerta temporal que dejaba el
    // dashboard en blanco al entrar a la carrera. TypeScript no lo marca porque es válido
    // sintácticamente; solo revienta en runtime.
    const season = playerProfile.leagueSeasons[selectedLeagueKey];
    if (!season) return null;
    const nombre = season.semester === 2 ? 'Clausura' : 'Apertura';
    const anio = CAREER_START_YEAR + getSeasonYear(playerProfile.currentWeek) - 1;
    // En playoffs se nombra la RONDA concreta ("Semifinal", "Final"), no un "Playoffs" genérico:
    // el jugador llegaba a la final del Apertura sin que nada le dijera en qué instancia estaba.
    // La ronda se deriva de cuántas llaves quedan vivas (ver roundLabelByMatchCount).
    const rondaActual = (() => {
      if (season.stage !== 'knockout') return null;
      const ties = season.twoLegKnockout?.tiesByRound;
      if (ties?.length) return roundLabelByMatchCount(ties[ties.length - 1].length);
      const rounds = season.knockout?.matchesByRound;
      if (rounds?.length) return roundLabelByMatchCount(rounds[rounds.length - 1].length);
      return null;
    })();
    const fase = season.stage === 'knockout' ? ` · ${rondaActual ?? 'Playoffs'}`
      : season.stage === 'done' ? ' · Finalizado'
      : '';
    return `${nombre} ${anio}${fase}`;
  })();
  // Los datos de REAL_LEAGUE_LEADERS son una foto de la temporada real previa al inicio de la
  // carrera, así que solo valen para la PRIMERA temporada: sirven de punto de partida creíble
  // (arrancás viendo a Muriel goleador, como en la vida real). De la segunda en adelante manda
  // lo que pasó en TU carrera, o el panel se quedaría congelado en 2026 para siempre mostrando
  // goleadores que ya se retiraron.
  const isFirstSeason = getSeasonYear(playerProfile.currentWeek) === CAREER_START_YEAR;
  const selectedLeagueLeaders = (isFirstSeason ? REAL_LEAGUE_LEADERS[selectedLeagueName] : undefined)
    ?? generateLeagueLeadersFromTable(selectedLeagueClubs, selectedLeagueTable, playerProfile.retiredWorldPlayers);

  // Copa continental real que le corresponde al club actual (si clasifica a alguna).
  const cupYear = getSeasonYear(playerProfile.currentWeek);
  const conmebolCupId: 'libertadores' | 'sudamericana' | null = getLibertadoresParticipants(ULTIMATE_CLUBS_DATABASE).includes(currentClub.id)
    ? 'libertadores'
    : getSudamericanaParticipants(ULTIMATE_CLUBS_DATABASE).includes(currentClub.id)
    ? 'sudamericana'
    : null;
  const conmebolCup = conmebolCupId
    ? getOrCreateCupState(conmebolCupId, cupYear, ULTIMATE_CLUBS_DATABASE, playerProfile.continentalCups[`${conmebolCupId}-${cupYear}`], playerProfile.currentWeek)
    : null;

  const uefaCupId: 'champions' | 'europa' | null = getChampionsParticipants(ULTIMATE_CLUBS_DATABASE).includes(currentClub.id)
    ? 'champions'
    : getEuropaParticipants(ULTIMATE_CLUBS_DATABASE).includes(currentClub.id)
    ? 'europa'
    : null;
  const uefaCup = uefaCupId
    ? getOrCreateUefaCupState(uefaCupId, ULTIMATE_CLUBS_DATABASE, playerProfile.uefaCups[uefaCupId], playerProfile.currentWeek)
    : null;

  // Distingue "no clasificaste a ninguna copa" de "clasificaste pero quedaste afuera": las dos
  // cosas dejan la semana de copa sin rival, pero al jugador le dicen cosas muy distintas.
  const eliminadoDeCopa =
    (!!conmebolCup && !isClubStillInCup(conmebolCup, currentClub.id)) ||
    (!!uefaCup && !isClubStillInUefaCup(uefaCup, currentClub.id));

  // Para el post de "campeón del Mundo" en ChutSocial -- ver generateCupChampionPosts.
  const wcState = isWorldCupYear(cupYear)
    ? getOrCreateWorldCupState(cupYear, WORLD_CUP_TEAMS_DATABASE, playerProfile.worldCups[cupYear], playerProfile.currentWeek)
    : null;

  // Calendario: próximos rivales de liga y de copa, en el orden real en que ya están fijados en
  // el fixture -- no se regeneran ni cambian una vez creados, así que esto es fiel a lo que de
  // verdad va a pasar (ver generateRoundRobin/drawCupGroups en leagueEngine.ts).
  const clubNameByIdEarly = (id: string) => ULTIMATE_CLUBS_DATABASE.find(c => c.id === id)?.name || id;
  const myLeagueFixtures = playerProfile.leagueSeasons[myLeagueKey]?.fixtures || [];
  const allUpcomingLeagueFixtures = myLeagueFixtures
    .filter(f => !f.played && (f.homeTeamId === currentClub.id || f.awayTeamId === currentClub.id))
    .sort((a, b) => a.matchweek - b.matchweek)
    .map(f => ({
      matchweek: f.matchweek,
      isHome: f.homeTeamId === currentClub.id,
      opponentId: f.homeTeamId === currentClub.id ? f.awayTeamId : f.homeTeamId,
      opponentName: clubNameByIdEarly(f.homeTeamId === currentClub.id ? f.awayTeamId : f.homeTeamId)
    }));
  // La tarjeta de "próximo partido" solo necesita el primero; el calendario mensual (más abajo)
  // necesita el torneo completo -- con solo 6 acá, un club de Segunda de 19 jornadas mostraba el
  // calendario "terminado" en marzo cuando en realidad seguía hasta noviembre. Bug reportado: "la
  // ultima jornada aparece en marzo y dice 6 jornadas".
  const upcomingLeagueFixtures = allUpcomingLeagueFixtures.slice(0, 6);

  let upcomingCupFixtures: { matchweek: number; isHome: boolean; opponentId: string; opponentName: string }[] = [];
  let upcomingCupKnockoutOpponent: { opponentId: string; opponentName: string; isHome: boolean } | null = null;
  if (conmebolCup) {
    if (conmebolCup.stage === 'groups') {
      const myGroup = conmebolCup.groups.find(g => g.clubIds.includes(currentClub.id));
      if (myGroup) {
        upcomingCupFixtures = myGroup.fixtures
          .filter(f => !f.played && (f.homeTeamId === currentClub.id || f.awayTeamId === currentClub.id))
          .sort((a, b) => a.matchweek - b.matchweek)
          .map(f => ({
            matchweek: f.matchweek,
            isHome: f.homeTeamId === currentClub.id,
            opponentId: f.homeTeamId === currentClub.id ? f.awayTeamId : f.homeTeamId,
            opponentName: clubNameByIdEarly(f.homeTeamId === currentClub.id ? f.awayTeamId : f.homeTeamId)
          }));
      }
    } else if (conmebolCup.stage === 'knockout') {
      const upcoming = getUpcomingCupMatch(conmebolCup, currentClub.id);
      if (upcoming) upcomingCupKnockoutOpponent = { opponentId: upcoming.opponentId, opponentName: clubNameByIdEarly(upcoming.opponentId), isHome: upcoming.isHome };
    }
  } else if (uefaCup) {
    if (uefaCup.stage === 'league_phase') {
      upcomingCupFixtures = uefaCup.fixtures
        .filter(f => !f.played && (f.homeTeamId === currentClub.id || f.awayTeamId === currentClub.id))
        .sort((a, b) => a.matchweek - b.matchweek)
        .map(f => ({
          matchweek: f.matchweek,
          isHome: f.homeTeamId === currentClub.id,
          opponentId: f.homeTeamId === currentClub.id ? f.awayTeamId : f.homeTeamId,
          opponentName: clubNameByIdEarly(f.homeTeamId === currentClub.id ? f.awayTeamId : f.homeTeamId)
        }));
    } else if (uefaCup.stage === 'playoff' || uefaCup.stage === 'knockout') {
      const upcoming = getUpcomingUefaCupMatch(uefaCup, currentClub.id);
      if (upcoming) upcomingCupKnockoutOpponent = { opponentId: upcoming.opponentId, opponentName: clubNameByIdEarly(upcoming.opponentId), isHome: upcoming.isHome };
    }
  }

  // Tarjeta "Próximo Partido" (estilo modo carrera FIFA/EA FC): currentWeek YA es la semana que
  // se va a jugar a continuación (no la última completada), así que esto debe usar currentWeek
  // tal cual, SIN +1 -- misma semana exacta que evalúa startMatchflow() en App.tsx al apretar
  // "Disputar Partido". Antes esta card usaba currentWeek+1 mientras startMatchflow usaba
  // currentWeek a secas: en una semana de liga previa a una de copa, la card mostraba (bien) el
  // rival de copa que venía, pero al apretar el botón se jugaba en realidad la liga de esa
  // semana -- y recién en el partido SIGUIENTE aparecía la copa. Bug real detectado por el
  // usuario ("me mete un partido de liga de la nada, y ahí sí me mete en Champions").
  // Si esta semana cae dentro de la ventana del Mundial (ver isWorldCupBreakWeek en
  // leagueEngine.ts), NI la liga doméstica NI Libertadores/Champions tienen partido -- están
  // realmente congeladas -- así que el único rival posible es el de la selección (y solo si estás
  // convocado y tu selección todavía tiene partido pendiente esa semana puntual).
  const nextWeekInWorldCupBreak = isWorldCupBreakWeek(playerProfile.currentWeek);
  const nextWeekIsCup = !nextWeekInWorldCupBreak && isCupWeek(playerProfile.currentWeek);
  // rivalPos/rivalTotal: posición del rival en la tabla que corresponda (liga doméstica, grupo de
  // Fecha completa del partido que viene, para la tarjeta de "próximo partido". Es la MISMA fecha
  // que el calendario usa para ubicarlo, así que las dos vistas no pueden contradecirse.
  const fechaDelProximoPartido = (() => {
    const club = ULTIMATE_CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    if (!club || !hasDatedLeagueSchedule(club.name)) return null;
    const paso = fixturesAtStep(club.name, playerProfile.currentWeek);
    return paso ? formatDate(paso.date) : null;
  })();

  // Etiqueta corta de cada celda del calendario. En las ligas de Apertura/Clausura dice cuál de los
  // dos torneos es, que es la información que faltaba: son dos campeonatos distintos en el mismo año.
  const etiquetaCompetencia = (comp: { kind: string; name: string; league?: string }, date: string) => {
    if (comp.kind === 'league') return torneoDeFecha(comp as never, date);
    if (/Libertadores/i.test(comp.name)) return 'Libertadores';
    if (/Sudamericana/i.test(comp.name)) return 'Sudamericana';
    if (/Superliga/i.test(comp.name)) return 'Superliga';
    if (/Copa/i.test(comp.name)) return 'Copa';
    return comp.name;
  };

  // Fecha real que se muestra en el encabezado. Sale del calendario de fechas cuando el club lo
  // tiene (así el 7 de mayo es el 7 de mayo de verdad) y del cálculo por semanas si no.
  // Igual que misTrofeos: se calcula acá arriba porque el JSX que la usa está ~1200 líneas abajo y
  // declararla ahí repetiría el TDZ que dejó la pantalla en blanco.
  const fechaEnPantalla = (() => {
    const club = ULTIMATE_CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    if (club && hasDatedLeagueSchedule(club.name)) {
      const paso = fixturesAtStep(club.name, playerProfile.currentWeek);
      if (paso) return formatDate(paso.date);
    }
    return formatRealDate(playerProfile.currentWeek);
  })();

  // Palmarés del jugador para la vitrina de la tarjeta de atributos. Se calcula acá arriba, y no
  // junto al JSX que lo usa, para no repetir el ReferenceError por zona muerta temporal (TDZ) que
  // dejó la pantalla en blanco: el bloque de atributos se renderiza ~1300 líneas más abajo.
  const misTrofeos = getPalmares(
    playerProfile,
    ULTIMATE_CLUBS_DATABASE,
    (league: string) => getLeagueDisplay(league).name,
    isApeturaClausuraLeague,
    NATIONALITY_TO_WORLD_CUP_TEAM_ID[playerProfile.nationality],
  );

  // Libertadores/Sudamericana, o fase de liga de Champions/Europa) -- null en fases sin tabla
  // (eliminación directa, Mundial). jornada es el rótulo corto para la esquina de la card.
  let nextMatchOpponent: {
    club: Club | undefined; name: string; isHome: boolean; competition: string;
    jornada: string; rivalPos: number | null; rivalTotal: number | null;
  } | null = null;
  if (nextWeekInWorldCupBreak) {
    const wcYear = getSeasonYear(playerProfile.currentWeek);
    const wcTeamId = NATIONALITY_TO_WORLD_CUP_TEAM_ID[playerProfile.nationality];
    const isEligible = !!wcTeamId
      && playerProfile.prestige >= WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD
      && playerProfile.careerStats.partidosHistoricos >= WORLD_CUP_CALLUP_MIN_MATCHES;
    if (isEligible) {
      const wcState = getOrCreateWorldCupState(wcYear, WORLD_CUP_TEAMS_DATABASE, playerProfile.worldCups[wcYear], playerProfile.currentWeek);
      const upcoming = getUpcomingWorldCupMatch(wcState, wcTeamId!);
      if (upcoming) {
        nextMatchOpponent = {
          club: WORLD_CUP_TEAMS_DATABASE.find(t => t.id === upcoming.opponentId),
          name: WORLD_CUP_TEAMS_DATABASE.find(t => t.id === upcoming.opponentId)?.name || '',
          isHome: upcoming.isHome,
          competition: 'Copa Mundial FIFA',
          jornada: 'Fecha FIFA',
          rivalPos: null,
          rivalTotal: null
        };
      }
    }
  } else if (nextWeekIsCup && !hasDatedLeagueSchedule(currentClub.name)) {
    // Este bloque decide la copa por el reparto de semanas del motor y por en qué copa te tiene
    // CLASIFICADO, sin mirar el calendario. Corre antes que el bloque de fechas reales, así que
    // ganaba siempre: anunciaba "Copa Libertadores" cuando el calendario decía final de vuelta de
    // la Superliga. Con fechas reales no debe correr nunca -- manda el calendario y nada más.
    const competition = conmebolCupId === 'libertadores' ? 'Copa Libertadores'
      : conmebolCupId === 'sudamericana' ? 'Copa Sudamericana'
      : uefaCupId === 'champions' ? 'Champions League'
      : uefaCupId === 'europa' ? 'Europa League'
      : '';
    const next = upcomingCupFixtures[0] ?? upcomingCupKnockoutOpponent;
    if (next && competition) {
      let jornada = 'Copa';
      let rivalPos: number | null = null;
      let rivalTotal: number | null = null;
      if (conmebolCup && conmebolCup.stage === 'groups' && 'matchweek' in next) {
        jornada = `Fecha ${next.matchweek} · Grupos`;
        const myGroup = conmebolCup.groups.find(g => g.clubIds.includes(currentClub.id));
        if (myGroup) {
          const sortedGroup = sortTable(myGroup.table);
          const idx = sortedGroup.findIndex(r => r.clubId === next.opponentId);
          rivalPos = idx >= 0 ? idx + 1 : null;
          rivalTotal = sortedGroup.length || null;
        }
      } else if (conmebolCup) {
        const round = conmebolCup.knockout?.matchesByRound[conmebolCup.knockout.matchesByRound.length - 1];
        jornada = round ? roundLabelByMatchCount(round.length) : 'Eliminatoria';
      } else if (uefaCup && uefaCup.stage === 'league_phase' && 'matchweek' in next) {
        jornada = `Fecha ${next.matchweek} · Fase de Liga`;
        const sortedUefa = sortTable(uefaCup.table);
        const idx = sortedUefa.findIndex(r => r.clubId === next.opponentId);
        rivalPos = idx >= 0 ? idx + 1 : null;
        rivalTotal = sortedUefa.length || null;
      } else if (uefaCup && uefaCup.stage === 'playoff') {
        jornada = 'Playoff';
      } else if (uefaCup) {
        const round = uefaCup.knockout?.tiesByRound[uefaCup.knockout.tiesByRound.length - 1];
        jornada = round ? roundLabelByMatchCount(round.length) : 'Eliminatoria';
        // Las llaves europeas son a ida y vuelta: sin esto, "Cuartos de final" se leía igual en los
        // dos partidos, y en la vuelta no se veía con qué global llegabas.
        const miLlave = round?.find(t => t.clubAId === currentClub.id || t.clubBId === currentClub.id);
        if (miLlave) {
          const { leg, global } = tieStatusLabel(miLlave, currentClub.id);
          jornada += ` · ${leg}`;
          if (global) jornada += ` · Global ${global}`;
        }
      }
      nextMatchOpponent = {
        club: ULTIMATE_CLUBS_DATABASE.find(c => c.id === next.opponentId),
        name: next.opponentName,
        isHome: next.isHome,
        competition,
        jornada,
        rivalPos,
        rivalTotal
      };
    }
  }
  // Con calendario de fechas reales alcanza con que HAYA partido ese día: no se exige que el
  // fixture generado tenga algo pendiente. Si no, un club cuyo fixture generado ya se agotó se
  // quedaba sin tarjeta de próximo partido aunque el calendario real sí tuviera fecha.
  const hayPartidoReal = !nextWeekInWorldCupBreak
    && hasDatedLeagueSchedule(currentClub.name)
    && !!fixturesAtStep(currentClub.name, playerProfile.currentWeek);

  if (!nextMatchOpponent && !nextWeekInWorldCupBreak && (upcomingLeagueFixtures.length > 0 || hayPartidoReal)) {
    const next = upcomingLeagueFixtures[0];

    // El rival que se anuncia tiene que ser el MISMO que va a salir al arrancar el partido. App.tsx
    // resuelve la semana con el calendario real (realSchedule) cuando el club tiene fechas
    // importadas, y solo cae al fixture generado si no las tiene. El panel leía siempre el fixture
    // generado, así que en Dimayor anunciaba un rival distinto al real en 32 de las 52 semanas:
    // decía "vs Llaneros FC" y salías a jugar contra Once Caldas.
    // Con fechas reales el paso de carrera ES un día con partido, así que se pregunta directamente
    // qué se juega en ese paso. Los clubes sin fechas cargadas siguen con el calendario semanal.
    const pasoConFecha = hasDatedLeagueSchedule(currentClub.name)
      ? fixturesAtStep(currentClub.name, playerProfile.currentWeek)
      : null;
    const realDeLaSemana = pasoConFecha
      ? pickDatedPrimary(pasoConFecha.fixtures)
      : hasRealSchedule(currentClub.name)
        ? pickPrimary(matchesThisWeek(currentClub.name, playerProfile.currentWeek))
        : null;
    const realDeLiga = realDeLaSemana?.competition.kind === 'league' ? realDeLaSemana : null;

    // El rival se toma del partido real SEA DE LA COMPETICIÓN QUE SEA, no solo de liga. Filtrar por
    // liga dejaba la tarjeta sin rival cuando el partido del día era de copa, y entonces caía al
    // fixture generado: anunciaba "vs Deportivo Pereira" y salías a jugar la Superliga contra Santa
    // Fe. Fuera de la liga el rival puede ser de otro país (Libertadores), así que se busca en toda
    // la base y se desambigua con el torneo.
    const rivalReal = realDeLiga
      ? resolverClubDeCalendario(
          ULTIMATE_CLUBS_DATABASE.filter(c => leagueKeyFor(c) === myLeagueKey),
          realDeLiga.opponentName, currentClub.league, 'league', realDeLiga.competition.name)
      : realDeLaSemana
        ? resolverClubDeCalendario(
            ULTIMATE_CLUBS_DATABASE, realDeLaSemana.opponentName,
            realDeLaSemana.competition.league ?? (realDeLaSemana.competition.kind === 'domestic_cup' ? currentClub.league : undefined),
            realDeLaSemana.competition.kind, realDeLaSemana.competition.name)
        : null;

    // `next` puede no existir cuando el fixture generado ya se agotó y el partido sale solo del
    // calendario real, así que todos los accesos van con ?.
    const opponentId = rivalReal?.id ?? next?.opponentId;
    const opponentName = rivalReal?.name ?? next?.opponentName ?? realDeLaSemana?.opponentName ?? '';
    const isHome = realDeLaSemana ? realDeLaSemana.isHome : (next?.isHome ?? true);
    const idx = myLeagueTable.findIndex(r => r.clubId === opponentId);

    nextMatchOpponent = {
      club: ULTIMATE_CLUBS_DATABASE.find(c => c.id === opponentId),
      name: opponentName,
      isHome,
      // Si el partido del día no es de liga, la tarjeta tiene que decir de qué torneo es: anunciaba
      // "Colombiana" cuando lo que se jugaba era la Superliga.
      competition: realDeLaSemana && realDeLaSemana.competition.kind !== 'league'
        ? realDeLaSemana.competition.name
        : currentClub.league,
      // El calendario por fechas no trae número de jornada (ESPN no lo publica), pero sí la fecha
      // exacta, que dice más: "8 feb" en vez de "Jornada 12".
      jornada: pasoConFecha ? formatDateShort(pasoConFecha.date)
        : realDeLiga && 'round' in realDeLiga.match ? realDeLiga.match.round
        : next ? `Jornada ${next.matchweek}` : '',
      // La posición en la tabla solo tiene sentido en la liga: en una copa el rival puede no estar
      // en tu tabla, y mostrar "13° de 22" sería un dato inventado.
      rivalPos: realDeLiga && idx >= 0 ? idx + 1 : null,
      rivalTotal: realDeLiga ? (myLeagueTable.length || null) : null
    };
  }
  // Fecha de copa sin cruce puntual todavía definido (club no clasificado, o copa "de relleno"
  // con rival sorpresa que App.tsx recién sortea al arrancar el partido -- ver startMatchflow):
  // no hay datos reales para mostrar escudo/rival, pero la semana de todos modos tiene actividad.
  // Con fechas reales nunca hay "copa de relleno": si el calendario no tiene partido ese día, no
  // hay partido, punto. Sin este corte aparecía un cartel de semana de copa inventado por la
  // aritmética de semanas del motor.
  const nextWeekIsFillerCup = nextWeekIsCup && !nextMatchOpponent && !hasDatedLeagueSchedule(currentClub.name);

  const cupStageLabel = (stage: string) => {
    switch (stage) {
      case 'groups': return 'Fase de Grupos';
      case 'league_phase': return 'Fase de Liga';
      case 'playoff': return 'Playoff';
      case 'knockout': return 'Fase Eliminatoria';
      case 'done': return 'Finalizada';
      default: return stage;
    }
  };
  const clubNameById = (id: string | null) => (id ? ULTIMATE_CLUBS_DATABASE.find(c => c.id === id)?.name || id : '');

  // Los patrocinios (tienen "category") son ofertas que le llegan al jugador, no compras de
  // catálogo -- viven en su propia pestaña "Patrocinios", separados de los lujos puros de la
  // "Tienda de Estilo de Vida" (ver handleAcceptSponsor en App.tsx).
  const lifestyleItems = shopItems.filter(i => !i.category);
  const sponsorDeals = shopItems.filter(i => !!i.category);

  // Corregido: antes "possible" dependía solo del Prestigio (que arranca en 50 y ya deja fichable
  // casi cualquier club de reputación <=4 desde la semana 1). Ahora se mide un "Rendimiento" real
  // que mezcla prestigio + aporte en cancha (goles+asistencias por partido) + títulos, y además
  // exige una cantidad mínima de partidos jugados que crece con el salto de categoría -- así un
  // club grande de verdad se siente ganado con el tiempo, no regalado de arranque.
  const generateMockTransferOffers = () => {
    const matchesPlayed = playerProfile.careerStats.partidosHistoricos;
    const contributionPerMatch = matchesPlayed > 0
      ? (playerProfile.careerStats.golesHistoricos + playerProfile.careerStats.asistenciasHistoricos) / matchesPlayed
      : 0;
    const performanceScore = Math.min(100, playerProfile.prestige * 0.55 + contributionPerMatch * 70 + playerProfile.careerStats.campeonatos * 6);

    return ULTIMATE_CLUBS_DATABASE.filter(c => c.id !== playerProfile.currentClubId).map(c => {
      const multiplier = 1 + (playerProfile.prestige / 100);
      const customSalary = Math.round(c.initialSalary * multiplier);
      // Fase 4 -- desacoplado de marketValue total del club (ahora refleja el valor del plantel
      // entero, no lo que le pagarían a un fichaje individual como vos -- tras calibrar salarios
      // con datos reales, clubes top llegaron a marketValue de $700M-1.000M+). El bono de firma
      // ahora escala con la reputation del club (rango de fichaje real de nivel medio-alto según
      // REAL_TRANSFER_POOL: ~$2M a ~$24M) y tu propia trayectoria de carrera.
      const signOnBonus = Math.round(
        1500 * c.reputation * c.reputation
        + playerProfile.careerStats.golesHistoricos * 750
        + playerProfile.careerStats.campeonatos * 2000
      );
      const reputationGap = c.reputation - currentClub.reputation;
      const reqPrestige = Math.round(Math.min(95, c.reputation * 12 + Math.max(0, reputationGap) * 15));
      const reqMatches = 4 + Math.max(0, reputationGap) * 5 + (c.reputation - 1) * 2;

      return {
        club: c,
        salaryOffer: customSalary,
        signOnBonus,
        reqPrestige,
        possible: performanceScore >= reqPrestige && matchesPlayed >= reqMatches
      };
    });
  };

  // Con 600+ clubes en la base de datos, mostrar una oferta por cada uno volvía la pestaña
  // interminable (varios cientos de miles de píxeles de alto). Priorizamos los clubes a los
  // que de verdad podés fichar (reputación alcanzada) y mostramos un puñado manejable.
  // ¿Tu club se fue a segunda en el último cierre de temporada? El jugador tiene que enterarse: es
  // el momento en que decide si se queda a pelear el ascenso o se va a un club de primera.
  const miClubDescendio = !!playerProfile.ultimoAscensoDescenso?.descienden
    .some(d => d.clubId === playerProfile.currentClubId);

  const transferOffers = generateMockTransferOffers()
    .sort((a, b) => (b.possible === a.possible ? b.club.reputation - a.club.reputation : b.possible ? 1 : -1))
    .slice(0, 40);

  // Fase 3 -- Saludo de famoso: si tu último partido tuvo una calificación altísima, un famoso
  // parodia te felicita en redes. Contenido con plantillas, dispara con playerProfile.lastMatchRating
  // (seteado en App.tsx -> handleFinishMatch).
  const generateCelebrityShoutoutPost = () => {
    if (playerProfile.lastMatchRating < 8.5) return [];
    const celebrities = [
      { author: 'Shakirulla_Oficial', role: 'Ícono Pop Parodia', avatar: '🎤' },
      { author: 'ElPibeDeLosMemes', role: 'Streamer Viral', avatar: '🐐' },
      { author: 'DonBalonazo', role: 'Ex-Crack Retirado', avatar: '👑' },
    ];
    const celeb = celebrities[Math.floor(playerProfile.lastMatchRating * 10) % celebrities.length];
    return [{
      id: `celebrity_${playerProfile.careerStats.partidos}`,
      author: celeb.author,
      role: celeb.role,
      content: `Loco, vi tu partido y quedé sin palabras. Calificación de ${playerProfile.lastMatchRating.toFixed(1)}, ¡una locura total! Grande ${playerProfile.name}, seguí así. 🔥`,
      likes: 8000 + Math.floor(Math.random() * 25000),
      commentsCount: 900 + Math.floor(Math.random() * 3000),
      timestamp: 'Hace 1 hora',
      avatar: celeb.avatar,
      gifQuery: 'soccer goal celebration'
    }];
  };

  // Contracara de generateCelebrityShoutoutPost: si el último partido fue flojo, la prensa/hinchas
  // también critican, no todo puede ser siempre elogioso. Mismo patrón de plantillas + persona.
  const generateCriticalPressPost = () => {
    if (playerProfile.lastMatchRating <= 0 || playerProfile.lastMatchRating >= 5.5) return [];
    const critics = [
      { author: 'El Polémico Bermúdez', role: 'Panelista de Debate', avatar: '🎤' },
      { author: 'HinchaFurioso_Trib', role: 'Hincha Enojado', avatar: '😤' },
      { author: 'La Lupa Deportiva', role: 'Analista Crítico', avatar: '🔍' },
    ];
    const critic = critics[Math.floor(playerProfile.lastMatchRating * 10) % critics.length];
    const lines = [
      `Flojo el partido de ${playerProfile.name}, la verdad. Con la camiseta que tiene puesta se le exige mucho más que un ${playerProfile.lastMatchRating.toFixed(1)}.`,
      `${playerProfile.name} desapareció del partido justo cuando el equipo más lo necesitaba. Preocupa la caída de nivel.`,
      `No alcanza con el nombre: ${playerProfile.name} viene de otro partido gris. La hinchada ya empieza a impacientarse.`,
    ];
    return [{
      id: `critic_${playerProfile.careerStats.partidos}`,
      author: critic.author,
      role: critic.role,
      content: lines[Math.floor(Math.random() * lines.length)],
      likes: 300 + Math.floor(Math.random() * 2000),
      commentsCount: 80 + Math.floor(Math.random() * 500),
      timestamp: 'Hace 1 hora',
      avatar: critic.avatar,
      gifQuery: 'disappointed facepalm reaction'
    }];
  };

  // Rumores de mercado sobre OTROS jugadores de OTROS clubes (usa Club.starPlayers, datos reales
  // ya cargados en la base) -- el mercado de pases es el tema que más mueve las redes reales, así
  // que acá vive el grueso del volumen de ChutSocial, y a propósito casi nunca es sobre vos (tus
  // propios rumores de fichaje se juegan en la Sala de Prensa, con consecuencias reales -- ver
  // press_13/press_14 en data.ts). Selección pseudo-aleatoria estable por semana (no se reordena
  // en cada render) para que la sección no "parpadee" distinto cada vez que Dashboard re-renderiza.
  const generateRivalTransferBuzzPosts = () => {
    const personas = [
      { author: 'Fichajes al Día', role: 'Cuenta de Mercado', avatar: '📋' },
      { author: 'Radar de Pases', role: 'Especialista en Fichajes', avatar: '🕵️' },
      { author: 'Mercado Total', role: 'Portal de Fichajes', avatar: '💼' },
      { author: 'La Chiva del Mercado', role: 'Cuenta de Rumores', avatar: '🐐' },
      { author: 'Transfer Radar LatAm', role: 'Especialista Internacional', avatar: '🌎' },
    ];
    const week = playerProfile.currentWeek;
    const ranked = rankClubsForSocial(ULTIMATE_CLUBS_DATABASE, currentClub.id, week, 11);
    if (ranked.length === 0) return [];
    const picked = ranked.slice(0, 7);
    return picked.map((club, idx) => {
      const squad = squadNames(club);
      const star = squad[(week + idx) % squad.length];
      const persona = personas[(week + idx) % personas.length];
      const otherClub = ranked[(idx + 3) % ranked.length];
      const options = [
        `RUMOR: ${star} podría dejar ${club.name} este mercado. Varios clubes ya preguntaron por su cláusula de salida.`,
        `${club.name} negocia la renovación de ${star} para blindarlo de ofertas externas antes de que se dispare el interés.`,
        `Se cae la chance: ${star} de ${club.name} descartó una salida por ahora, según confirmó su entorno cercano.`,
        `SE CALIENTA: ${otherClub.name} ya hizo una consulta formal por ${star}, de ${club.name}. La respuesta llegaría en los próximos días.`,
        `${star} no estaría del todo cómodo en ${club.name} y su representante ya sondea el mercado por lo bajo.`,
        `Cifras que se filtran: ${club.name} pediría una cifra altísima por ${star} si algún club pregunta en serio.`,
        `Última hora: reunión sorpresa entre el representante de ${star} y dirigentes de ${otherClub.name}. Todavía nada oficial.`,
        `${club.name} blinda a ${star} con una cláusula de rescisión gigante tras el interés que despertó en el mercado.`,
        `Hinchas de ${club.name} piden que la directiva no deje salir a ${star} bajo ninguna circunstancia este semestre.`,
      ];
      return {
        id: `rivaltransfer_${club.id}_${playerProfile.currentWeek}_${idx}`,
        author: persona.author,
        role: persona.role,
        content: options[(week + idx * 5) % options.length],
        likes: 100 + Math.floor(Math.random() * 1500),
        commentsCount: 20 + Math.floor(Math.random() * 300),
        timestamp: 'Mercado de Pases',
        avatar: persona.avatar
      };
    });
  };

  // Críticas/elogios de prensa e hinchas sobre OTROS jugadores de OTROS clubes -- para que
  // ChutSocial no gire únicamente alrededor tuyo (antes todo el feed te adulaba a vos siempre).
  const generateOtherPlayersCritiquePosts = () => {
    const personas = [
      { author: 'La Lupa Deportiva', role: 'Analista Crítico', avatar: '🔍' },
      { author: 'Tribuna Caliente', role: 'Hincha Rival', avatar: '🗣️' },
      { author: 'Panorama Deportivo', role: 'Medio Local', avatar: '📰' },
      { author: 'El Polémico Bermúdez', role: 'Panelista de Debate', avatar: '🎤' },
    ];
    const seed = playerProfile.currentWeek * 7919; // determinístico por semana, no cambia en cada render
    const pickedClubs = rankClubsForSocial(ULTIMATE_CLUBS_DATABASE, currentClub.id, seed, 17).slice(0, 3);
    if (pickedClubs.length === 0) return [];
    return pickedClubs.map((club, idx) => {
      const squad = squadNames(club);
      const star = squad[(seed + idx) % squad.length];
      const persona = personas[(seed + idx) % personas.length];
      const lines = [
        `${star} viene de otro partido flojo con ${club.name}. La prensa local ya empieza a impacientarse con su nivel.`,
        `Actuación destacada de ${star} este fin de semana con ${club.name}. Lo vienen siguiendo de cerca varios clubes grandes.`,
        `Duras críticas para ${star} tras la derrota de ${club.name}: dicen que le falta compromiso en los partidos importantes.`,
        `${star} sigue siendo la gran figura de ${club.name}, pero algunos analistas dudan si puede sostener ese nivel toda la temporada.`,
        `Polémica en ${club.name}: parte de la hinchada pide que ${star} pierda la titularidad tras varias fechas discretas.`,
      ];
      return {
        id: `otherplayer_${club.id}_${playerProfile.currentWeek}_${idx}`,
        author: persona.author,
        role: persona.role,
        content: lines[(seed + idx * 3) % lines.length],
        likes: 60 + Math.floor(Math.random() * 1200),
        commentsCount: 15 + Math.floor(Math.random() * 250),
        timestamp: 'Liga Doméstica',
        avatar: persona.avatar
      };
    });
  };

  // Fichajes YA OFICIALIZADOS -- antes se inventaba un jugador ficticio moviéndose entre dos
  // clubes del juego; ahora usa REAL_TRANSFER_POOL (fichajes reales del fútbol mundial reciente,
  // ver data.ts) para que el anuncio se sienta genuino, con nombre, clubes y monto real.
  const generateTransferAnnouncementPosts = () => {
    if (REAL_TRANSFER_POOL.length === 0) return [];
    const seed = playerProfile.currentWeek * 5303;
    const transfer = REAL_TRANSFER_POOL[seed % REAL_TRANSFER_POOL.length];
    return [{
      id: `transferofficial_${playerProfile.currentWeek}`,
      author: 'Fichajes al Día',
      role: 'Cuenta de Mercado',
      content: `✅ OFICIAL: ${transfer.to} anuncia la contratación de ${transfer.player}, que llega procedente de ${transfer.from} por €${(transfer.fee / 1_000_000).toFixed(1)}M.`,
      likes: 900 + Math.floor(Math.random() * 4000),
      commentsCount: 150 + Math.floor(Math.random() * 900),
      timestamp: 'Mercado de Pases',
      avatar: '✅'
    }];
  };

  // Cuando una copa que le toca a tu club (o el Mundial) termina, se anuncia el campeón -- puede
  // ser cualquier otro equipo/selección, no necesariamente el tuyo. Antes esto solo se veía como
  // texto fijo en la tarjeta de la copa (pestaña Copas y Tablas), nunca como noticia en ChutSocial.
  const generateCupChampionPosts = () => {
    const posts: { id: string; author: string; role: string; content: string; likes: number; commentsCount: number; timestamp: string; avatar: string }[] = [];
    if (conmebolCup?.stage === 'done' && conmebolCup.championId) {
      const cupName = conmebolCup.cupId === 'libertadores' ? 'Copa Libertadores' : 'Copa Sudamericana';
      posts.push({
        id: `champion_${conmebolCup.cupId}_${conmebolCup.year}`,
        author: 'Conmebol Oficial',
        role: 'Organismo Rector',
        content: `🏆 ¡${clubNameById(conmebolCup.championId)} se consagró campeón de la ${cupName} ${conmebolCup.year}! Fiesta continental para el ganador.`,
        likes: 12000 + Math.floor(Math.random() * 8000),
        commentsCount: 1500 + Math.floor(Math.random() * 2000),
        timestamp: 'Copa Continental',
        avatar: '🏆'
      });
    }
    if (uefaCup?.stage === 'done' && uefaCup.championId) {
      const cupName = uefaCup.cupId === 'champions' ? 'Champions League' : 'Europa League';
      posts.push({
        id: `champion_${uefaCup.cupId}_${uefaCup.year}`,
        author: 'UEFA Oficial',
        role: 'Organismo Rector',
        content: `🏆 ¡${clubNameById(uefaCup.championId)} se coronó campeón de la ${cupName} ${uefaCup.year}! Gloria europea para el nuevo rey del continente.`,
        likes: 15000 + Math.floor(Math.random() * 10000),
        commentsCount: 2000 + Math.floor(Math.random() * 3000),
        timestamp: 'Copa Continental',
        avatar: '🏆'
      });
    }
    // Campeones de liga de TODO el mundo, no solo la tuya: si el Madrid gana LaLiga o Flamengo el
    // Brasileirão mientras vos jugás en Dimayor, ChutSocial lo comenta igual. Se recorren las ligas
    // que ya están corriendo en la partida (leagueSeasons) y se corona al líder de las que
    // terminaron su fixture.
    for (const [key, season] of Object.entries(playerProfile.leagueSeasons)) {
      if (!season?.table?.length) continue;
      const quedanPartidos = season.fixtures?.some(f => !f.played) ?? false;
      if (quedanPartidos) continue;

      const lider = sortTable([...season.table])[0];
      if (!lider) continue;
      const sample = ULTIMATE_CLUBS_DATABASE.find(c => leagueKeyFor(c) === key);
      if (!sample) continue;

      const anio = CAREER_START_YEAR + getSeasonYear(playerProfile.currentWeek) - 1;
      const formato = isApeturaClausuraLeague(sample.league);
      // El id lleva el semestre: en Apertura/Clausura hay dos campeones por año y con un solo id
      // el segundo título nunca aparecería (React los deduplica por key).
      const sufijo = formato ? `${anio}_s${season.semester ?? 1}` : `${anio}`;
      const torneo = formato
        ? `${season.semester === 2 ? 'Clausura' : 'Apertura'} ${anio}`
        : `${getLeagueDisplay(sample.league).name} ${anio}`;
      const esMiLiga = key === myLeagueKey;

      posts.push({
        id: `champion_league_${key}_${sufijo}`,
        author: esMiLiga ? 'Liga Oficial' : 'Fútbol Mundial',
        role: 'Organismo Rector',
        content: `🏆 ¡${lider.name} campeón de ${torneo}! ${lider.puntos} puntos en ${lider.pj} fechas para quedarse con el título.`,
        likes: (esMiLiga ? 9000 : 3000) + Math.floor(Math.random() * 6000),
        commentsCount: (esMiLiga ? 1200 : 400) + Math.floor(Math.random() * 1500),
        timestamp: esMiLiga ? 'Tu liga' : 'Fútbol Mundial',
        avatar: '🏆'
      });
    }

    if (wcState?.stage === 'done' && wcState.championId) {
      const champName = WORLD_CUP_TEAMS_DATABASE.find(t => t.id === wcState.championId)?.name || '';
      posts.push({
        id: `champion_worldcup_${wcState.year}`,
        author: 'FIFA Oficial',
        role: 'Organismo Rector',
        content: `🌎🏆 ¡${champName} se consagró Campeón del Mundo ${wcState.year}! El planeta entero habla de la nueva gloria mundialista.`,
        likes: 40000 + Math.floor(Math.random() * 20000),
        commentsCount: 8000 + Math.floor(Math.random() * 6000),
        timestamp: 'Mundial',
        avatar: '🌎'
      });
    }
    return posts;
  };

  // Posts de "hinchas reaccionando" a OTROS partidos de la última fecha jugada de tu liga
  // (no el tuyo, que ya tiene sus propios posts arriba) -- contenido con plantillas a partir
  // de resultados reales ya resueltos en leagueSeasons.
  const generateMatchdayReactionPosts = () => {
    const season = playerProfile.leagueSeasons[myLeagueKey];
    if (!season) return [];
    const playedFixtures = season.fixtures.filter(f => f.played && f.homeGoals !== null && f.awayGoals !== null);
    if (playedFixtures.length === 0) return [];
    const lastMatchweek = Math.max(...playedFixtures.map(f => f.matchweek));
    const otherMatches = playedFixtures.filter(f =>
      f.matchweek === lastMatchweek && f.homeTeamId !== currentClub.id && f.awayTeamId !== currentClub.id
    );
    if (otherMatches.length === 0) return [];

    const personas = [
      { author: 'HinchaDeFierro22', role: 'Hincha Rival', avatar: '🧢' },
      { author: 'Panorama Deportivo', role: 'Medio Local', avatar: '📰' },
      { author: 'ElAnalistaTáctico', role: 'Analista', avatar: '📊' },
      { author: 'VozDeLaTribuna', role: 'Hincha Fiel', avatar: '📣' },
    ];

    const picked = [...otherMatches].sort(() => Math.random() - 0.5).slice(0, 2);
    return picked.map((f, idx) => {
      const homeName = ULTIMATE_CLUBS_DATABASE.find(c => c.id === f.homeTeamId)?.name || 'Local';
      const awayName = ULTIMATE_CLUBS_DATABASE.find(c => c.id === f.awayTeamId)?.name || 'Visitante';
      const persona = personas[(idx + lastMatchweek) % personas.length];
      const draw = f.homeGoals === f.awayGoals;
      const homeWon = (f.homeGoals ?? 0) > (f.awayGoals ?? 0);
      const content = draw
        ? `Empate agónico entre ${homeName} y ${awayName} (${f.homeGoals}-${f.awayGoals}) en la fecha ${lastMatchweek}. Partidazo parejo de punta a punta.`
        : `${homeWon ? homeName : awayName} se quedó con los tres puntos frente a ${homeWon ? awayName : homeName} (${f.homeGoals}-${f.awayGoals}) en la fecha ${lastMatchweek}. La tabla se sigue moviendo.`;
      return {
        id: `matchday_${lastMatchweek}_${f.homeTeamId}_${f.awayTeamId}`,
        author: persona.author,
        role: persona.role,
        content,
        likes: 80 + Math.floor(Math.random() * 900),
        commentsCount: 10 + Math.floor(Math.random() * 150),
        timestamp: `Fecha ${lastMatchweek}`,
        avatar: persona.avatar
      };
    });
  };

  // Paso 3 -- Retiros del mundo: cuando un veterano de otro club cuelga los botines al cierre de
  // temporada (ver applyWorldRetirementsIfNewSeason en App.tsx), ChutSocial lo cuenta y nombra al
  // canterano que hereda su lugar. Van arriba del feed: es la noticia más fuerte de esa semana.
  const generateRetirementPosts = (): SocialPost[] => {
    const news = playerProfile.lastRetirementNews ?? [];
    if (news.length === 0) return [];
    const personas = [
      { author: 'ESPN Continental', role: 'Medio Deportivo', avatar: '📺' },
      { author: 'Archivo del Fútbol', role: 'Cuenta de Historia', avatar: '📼' },
      { author: 'Tribuna Caliente', role: 'Hincha', avatar: '🗣️' },
      { author: 'Panorama Deportivo', role: 'Medio Local', avatar: '📰' },
    ];
    return news.map((n, idx) => {
      const persona = personas[idx % personas.length];
      const options = [
        `🎙️ SE RETIRA: ${n.playerName} deja el fútbol profesional a los ${n.age} años. Última camiseta: ${n.clubName}. En su lugar sube ${n.replacementName} desde las inferiores.`,
        `FIN DE UNA ERA: ${n.playerName} (${n.age}) anunció su retiro. ${n.clubName} le da la camiseta a ${n.replacementName}, un pibe de la cantera.`,
        `${n.playerName} colgó los botines a los ${n.age}. Aplausos de pie en ${n.clubName}. El que hereda el puesto es ${n.replacementName}.`,
        `Se va un grande: ${n.playerName} se retira a los ${n.age} años. ${n.clubName} apuesta por ${n.replacementName} para reemplazarlo.`,
      ];
      return {
        id: `retirement_${n.clubName}_${n.playerName}_${playerProfile.currentWeek}`.replace(/\s+/g, ''),
        author: persona.author,
        role: persona.role,
        content: options[(playerProfile.currentWeek + idx * 3) % options.length],
        likes: 2000 + Math.floor(Math.random() * 12000),
        commentsCount: 400 + Math.floor(Math.random() * 3000),
        timestamp: 'Fin de temporada',
        avatar: persona.avatar,
      };
    });
  };

  // Periodistas y medios reales de la Sala de Prensa (PRESS_QUESTIONS_POOL), ahora también viven en
  // ChutSocial con su foto real -- antes solo aparecían si te tocaba su pregunta esa semana puntual.
  // Casi todo el contenido es sobre OTROS jugadores de OTROS clubes (no vos) y a propósito no es puro
  // elogio: cada uno mantiene el tono que ya tiene en la Sala de Prensa (Vélez filoso, Edu Aguirre
  // incendiario, Mau hypeando en vivo, Fabrizio Romano con su clásico "Here we go" de fichajes, etc.).
  const generateJournalistPosts = () => {
    const week = playerProfile.currentWeek;
    const ranked = rankClubsForSocial(ULTIMATE_CLUBS_DATABASE, currentClub.id, week, 29);
    if (ranked.length === 0) return [];

    type Journalist = { author: string; role: string; avatarImg?: string; avatar?: string; lines: (star: string, club: string, rivalClub: string) => string[] };
    const journalists: Journalist[] = [
      {
        author: 'Mau', role: 'mausportstv', avatarImg: mauSportsAvatar,
        lines: (star, club) => [
          `¡EPA! Me cuentan que ${star} no la está pasando bien en ${club} últimamente... ustedes qué opinan, ¿se le acabó la magia? 👀`,
          `LIVE ahora mismo hablando de ${star}: la gente en el chat está dividida, unos lo defienden y otros ya lo quieren ver afuera de ${club}.`
        ]
      },
      {
        author: 'Fabrizio Romano', role: 'Here We Go! - Digital Network', avatarImg: fabrizioRomanoAvatar,
        lines: (star, club) => [
          `🚨 Understand that ${star} (${club}) is attracting strong interest from clubs abroad. Nothing signed yet, conversations only. Here we go... soon? ⏳`,
          `${star}'s camp has already had informal contact with other clubs. ${club} not worried for now, but it's a situation to monitor closely.`
        ]
      },
      {
        author: 'Gastón Edul', role: 'ESPN F90', avatarImg: gastonEdulAvatar,
        lines: (star, club) => [
          `Puedo confirmar en exclusiva: ${star} pidió explicaciones puertas adentro de ${club} por su falta de continuidad. Hay malestar.`,
          `Información propia: dirigentes de ${club} ya evalúan el futuro de ${star} de cara al próximo mercado. Nada cerrado, pero la puerta está abierta.`
        ]
      },
      {
        author: 'Edu Aguirre', role: 'El Chiringuito TV', avatarImg: eduAguirreAvatar,
        lines: (star, club) => [
          `¡¡ESTO ES UN ESCÁNDALO!! ${star} discutió con un compañero en pleno entrenamiento de ${club}. ¡LO CONTAMOS EN EXCLUSIVA!`,
          `¡PEROOO BASTA YA! ${star} lleva varias fechas desaparecido con ${club} y NADIE dice nada. ¡Hay que hablarlo EN DIRECTO!`
        ]
      },
      {
        author: 'Pipe Sierra', role: 'ESPN Colombia', avatarImg: pipeSierraAvatar,
        lines: (star, club) => [
          `Parcero, ¿alguien más vio el gesto de ${star} después del cambio en ${club}? Ahí hay tema pa' rato jajaja.`,
          `${star} sigue siendo tendencia por los memes, más que por el partido en sí. Así es este negocio, ${club} lo sabe.`
        ]
      },
      {
        author: 'José Hugo Illera', role: 'Win Sports+', avatarImg: joseHugoIlleraAvatar,
        lines: (star, club) => [
          `¡Esa jugada de ${star} con ${club} la vamos a estar contando por años! Relato para el recuerdo, así se hace historia.`,
          `${star} tuvo un partido de esos que se cuentan en la sobremesa. ${club} sigue soñando gracias a esa clase.`
        ]
      },
      {
        author: 'Carlos Antonio Vélez', role: 'El Vbar - ESPN Colombia', avatarImg: carlosAntonioVelezAvatar,
        lines: (star, club) => [
          `Yo lo he dicho hace rato: ${star} está sobrevalorado. En ${club} lo defienden porque es la estrella, pero el rendimiento no acompaña.`,
          `No entiendo la pasividad de ${club} con ${star}. Si no rinde, no rinde, y hay que decirlo aunque incomode a la hinchada.`
        ]
      },
      {
        author: 'George Michael', role: 'ESPN Colombia · @gmdlhm', avatar: '📻',
        lines: (star, club) => [
          `Análisis en frío: ${star} viene sosteniendo un nivel constante con ${club} en las últimas fechas, sin necesidad de golpes de efecto. Eso también tiene mérito.`,
          `Dato que hay que seguir de cerca: la carga de minutos de ${star} en ${club} viene en aumento. Vale la pena monitorear cómo responde en las próximas semanas.`
        ]
      },
      {
        author: 'Eduardo Luis', role: 'Relatos del Estadio', avatarImg: eduardoLuisAvatar,
        lines: (star, club) => [
          `¡${star}! ¡${star} y el estadio entero de ${club} de pie! Momentos así son los que justifican amar este deporte.`,
          `Se siente en el ambiente de ${club}: ${star} está en un gran momento y la gente ya lo sabe, se lo hace saber en cada jugada.`
        ]
      },
      {
        author: 'Radio Caracol Deportes', role: 'Medio Oficial', avatarImg: caracolLogo,
        lines: (star, club, rivalClub) => [
          `Fuentes cercanas a ${club} le confirman a esta casa que ${star} sigue firme pese a los rumores. La dirigencia no piensa moverlo.`,
          `${rivalClub} habría preguntado por ${star} en las últimas horas. En ${club} prefieren no hacer comentarios por ahora.`
        ]
      },
      {
        author: 'Deportes RCN', role: 'Medio Oficial', avatarImg: rcnLogo,
        lines: (star, club) => [
          `Desde el camerino de ${club} señalan que el grupo respalda a ${star} pese a las críticas de las últimas semanas.`,
          `${star} fue la nota destacada del entrenamiento de ${club} de esta semana, según pudo confirmar nuestro equipo periodístico.`
        ]
      },
      {
        author: 'ESPN Continental', role: 'Medio Oficial', avatarImg: espnLogo,
        lines: (star, club) => [
          `Análisis del panel: ${star} viene en caída libre de rendimiento con ${club} en las últimas fechas. Los números no mienten.`,
          `El debate del día en la mesa: ¿sigue siendo ${star} indiscutido en ${club}, o ya es momento de repensar la titularidad?`
        ]
      }
    ];

    const seed = week * 6151;
    // Todos los periodistas postean siempre (antes se elegían solo 4 al azar) -- para que
    // ChutSocial se sienta lleno de contenido real cada semana, no un feed medio vacío.
    const pickedJournalists = [...journalists].sort((a, b) => (a.author.charCodeAt(0) * seed) % 101 - (b.author.charCodeAt(0) * seed) % 101);
    return pickedJournalists.map((j, idx) => {
      const club = ranked[idx % ranked.length];
      const rivalClub = ranked[(idx + 4) % ranked.length];
      const squad = squadNames(club);
      const star = squad[(seed + idx) % squad.length];
      const lines = j.lines(star, club.name, rivalClub?.name || club.name);
      return {
        id: `journalist_${j.author.replace(/\s+/g, '')}_${week}_${idx}`,
        author: j.author,
        role: j.role,
        content: lines[(seed + idx * 13) % lines.length],
        likes: 500 + Math.floor(Math.random() * 6000),
        commentsCount: 100 + Math.floor(Math.random() * 1200),
        timestamp: 'Sala de Prensa',
        avatar: j.avatar || '📰',
        avatarImg: j.avatarImg
      };
    });
  };

  // Pool grande y de tono variado (no solo elogios) sobre vos -- antes eran 4 posts fijos, siempre
  // los mismos y siempre 100% elogiosos cada vez que entrabas a ChutSocial. Ahora se eligen unos
  // pocos de forma pseudo-aleatoria por semana (determinístico para no cambiar en cada render, pero
  // distinto semana a semana) de un pool bien mezclado: elogio, análisis neutro, duda/crítica de
  // hincha y chicana de rival conviven, para que la sección se sienta como redes sociales reales.
  const generateSocialFeed = (): SocialPost[] => {
    const pName = playerProfile.name;
    const basePostsPool = [
      {
        id: 'tweet_1',
        author: 'Fabián Torres',
        role: 'Periodista Deportivo',
        content: `Buen aporte de ${pName} este fin de semana, aunque todavía le falta continuidad para ser un fijo indiscutido del once. #FutStarzz`,
        likes: 1240,
        commentsCount: 382,
        timestamp: 'Hace 2 horas',
        avatar: '🎙️'
      },
      {
        id: 'tweet_2',
        author: 'UltraVerde_99',
        role: 'Hincha Fiel',
        content: `${pName} viene mostrando cosas interesantes, pero la neta todavía no me late del todo como titular fijo. A ver qué muestra en los próximos partidos.`,
        likes: 852,
        commentsCount: 94,
        timestamp: 'Hace 4 horas',
        avatar: '⚽'
      },
      {
        id: 'tweet_3',
        author: 'La Redonda Oficial',
        role: 'Medio de Comunicación',
        content: `MERCADO: Algunos intermediarios preguntan por la situación contractual de ${pName}, pero nada concreto por ahora.`,
        likes: 1410,
        commentsCount: 312,
        timestamp: 'Hace 6 horas',
        avatar: '🔥'
      },
      {
        id: 'tweet_4',
        author: 'Compañero de Equipo',
        role: 'Primer Equipo',
        content: `Concentrados en el vestuario junto a ${pName} y el resto del plantel. Semana de trabajo doble pensando en los tres puntos del fin de semana. 🦁`,
        likes: 620,
        commentsCount: 45,
        timestamp: 'Ayer',
        avatar: '👟'
      },
      {
        id: 'tweet_5',
        author: 'HinchaFurioso_Trib',
        role: 'Hincha Crítico',
        content: `${pName}, explicame por qué seguís siendo titular. El equipo necesita más que promesas, necesita resultados YA.`,
        likes: 410,
        commentsCount: 260,
        timestamp: 'Hace 3 horas',
        avatar: '😤'
      },
      {
        id: 'tweet_6',
        author: 'ElAnalistaTáctico',
        role: 'Analista',
        content: `Repasando el mapa de calor de ${pName} de la última fecha: buen volumen de juego, pero decisiones para pulir en el último tercio de cancha.`,
        likes: 340,
        commentsCount: 58,
        timestamp: 'Hace 5 horas',
        avatar: '📊'
      },
      {
        id: 'tweet_7',
        author: 'MemeDeportivoCol',
        role: 'Cuenta de Memes',
        content: `Parce, los memes de la jugada de ${pName} del fin de semana ya son una chimba de incontables. Internet no perdona ni cuando sale bien. 😂`,
        likes: 2200,
        commentsCount: 540,
        timestamp: 'Hace 8 horas',
        avatar: '🐸'
      },
      {
        id: 'tweet_8',
        author: 'VozDeLaTribuna',
        role: 'Hincha de Base',
        content: `Vamos ${pName}, la tribuna te banca, pero vos sabés que hay que subir el nivel de a poco. El hincha exige porque quiere.`,
        likes: 510,
        commentsCount: 71,
        timestamp: 'Ayer',
        avatar: '📣'
      },
      {
        id: 'tweet_9',
        author: 'O Burrinho',
        role: 'Predicciones & Memes',
        content: `🔮🐴 El Burrinho ya tiene el pálpito de la fecha: ${pName} vuelve a estar entre los nombres que más se van a mencionar el domingo. Nunca falla el bicho.`,
        likes: 3100,
        commentsCount: 410,
        timestamp: 'Hace 3 horas',
        avatar: '🐴'
      },
      {
        id: 'tweet_10',
        author: 'WillyFPC',
        role: 'Fantasy & Stats',
        content: `Dato para el fantasy: ${pName} viene sumando puntos constantes fecha a fecha. Si todavía no lo tienes en tu equipo, la neta te estás perdiendo de algo.`,
        likes: 780,
        commentsCount: 96,
        timestamp: 'Hace 5 horas',
        avatar: '📈'
      },
      {
        id: 'tweet_11',
        author: 'untalsebs',
        role: 'Hincha del DIM',
        content: `Como hincha del Independiente Medellín, valoro cuando un futbolista rinde con seriedad y compromiso. El nivel de ${pName} en la última fecha fue de ese tipo de actuaciones.`,
        likes: 640,
        commentsCount: 88,
        timestamp: 'Hace 7 horas',
        avatar: '🔴'
      }
    ];
    const week = playerProfile.currentWeek;
    const shuffledBase = basePostsPool
      .map((post, i) => ({ post, key: Math.abs(Math.sin((week + i * 17) * 12.9898)) }))
      .sort((a, b) => a.key - b.key)
      .map(x => x.post);
    const selectedBasePosts = shuffledBase.slice(0, 4);

    // Los periodistas reales (Mau, Fabrizio Romano, Gastón Edul, Edu Aguirre, Pipe Sierra, José
    // Hugo Illera, Carlos Antonio Vélez, George Michael, Eduardo Luis, Radio Caracol, Deportes
    // RCN, ESPN Continental -- ver generateJournalistPosts) van primero casi siempre: son la
    // "prensa acreditada" del feed, así que encabezan ChutSocial antes que el resto de posts.
    // Reacciones al partido que ACABÁS de jugar (ver chutSocialVoces.ts). Van primero porque son
    // lo único del feed que responde a lo que hiciste: si te fue mal te destrozan y si te fue bien
    // te levantan. El resto del feed es contexto; esto es la reacción.
    const reacciones: SocialPost[] = playerProfile.lastMatchRating > 0
      ? postsDelPartido(pName, playerProfile.lastMatchRating, playerProfile.lastMatchGoals, week)
          .map((p, i) => ({
            id: `reaccion_${week}_${i}`,
            author: p.author,
            role: p.role,
            content: p.content,
            likes: 800 + Math.floor(Math.random() * 12000),
            commentsCount: 90 + Math.floor(Math.random() * 2200),
            timestamp: 'Hace instantes',
            avatar: p.avatar,
          }))
      : [];

    return [
      ...reacciones,
      ...generateRetirementPosts(),
      ...generateJournalistPosts(),
      ...generateCelebrityShoutoutPost(),
      ...generateCriticalPressPost(),
      ...selectedBasePosts,
      ...generateMatchdayReactionPosts(),
      ...generateRivalTransferBuzzPosts(),
      ...generateOtherPlayersCritiquePosts(),
      ...generateTransferAnnouncementPosts(),
      ...generateCupChampionPosts()
    ];
  };

  // El feed usa Math.random() sin semilla en varios lugares (likes/comentarios de cada post) --
  // antes se llamaba a generateSocialFeed() directo en el JSX, así que cualquier re-render (abrir
  // un box de comentario, tipear, etc.) recalculaba TODO el feed de nuevo con números distintos,
  // haciendo que los contadores de likes/hilos "bailaran" sin que hubiera pasado nada real. Ahora
  // se memoiza una sola vez por semana (currentWeek), que es lo único que debería cambiar el feed.
  const socialFeed = React.useMemo(() => generateSocialFeed(), [playerProfile.currentWeek]);

  // Carga los GIFs de reacción (Giphy) de los posts que los pidan (gifQuery) cada vez que cambia
  // el rating/partido más reciente -- generateSocialFeed() es síncrona así que no puede hacer el
  // fetch ella misma; acá se resuelve aparte y se guarda por postId en postGifs para el render.
  useEffect(() => {
    let cancelled = false;
    const postsNeedingGif = socialFeed.filter(p => p.gifQuery && !postGifs[p.id]);
    postsNeedingGif.forEach(async post => {
      const url = await fetchReactionGif(post.gifQuery!);
      if (!cancelled && url) {
        setPostGifs(prev => ({ ...prev, [post.id]: url }));
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socialFeed]);

  const handlePressAnswer = (opt: any) => {
    onAnswerPress(opt.prestigeChange, opt.fansChange, opt.energyChange);
    setPressReaction(opt.reaction);
    setPressResponseState('answered');
  };

  // La pregunta de esta semana se deriva de la semana de carrera (no es un estado libre que se
  // pudiera ciclear para reintentar) -- cada semana nueva trae una conferencia distinta. Se usa un
  // hash de la semana en vez de currentWeek % length para que el orden se sienta random en vez de
  // repetir siempre el mismo ciclo 1,2,3... Tu primerísima rueda de prensa de la carrera
  // (lastPressAnsweredWeek === 0, nunca respondiste ninguna) siempre es la de Mau Sports TV.
  const pseudoRandomPressIndex = (week: number) => {
    const hashed = Math.sin(week * 12.9898) * 43758.5453;
    return Math.floor((hashed - Math.floor(hashed)) * PRESS_QUESTIONS_POOL.length);
  };
  const mauDebutIndex = PRESS_QUESTIONS_POOL.findIndex(q => q.id === 'press_mau_debut');
  const selectedPressQ = playerProfile.lastPressAnsweredWeek === 0 && mauDebutIndex !== -1
    ? mauDebutIndex
    : pseudoRandomPressIndex(playerProfile.currentWeek);

  // --- Calendario en grilla mensual real: un evento con fecha real de calendario por partido,
  // en vez de la vieja lista plana de "Fecha N" sin ubicar en el tiempo real.
  const myLeagueSeason = playerProfile.leagueSeasons[myLeagueKey];
  const calendarEvents: CalendarEvent[] = [];

  // Con calendario de fechas reales el mes se pinta directamente con ellas: cada partido cae en su
  // día exacto (jueves 12 de febrero es jueves), en vez de deducir la fecha contando semanas desde
  // hoy -- que ubicaba todo en domingo y no coincidía con el partido que el motor iba a jugar.
  // No alcanza con preguntar si el club TIENE calendario: hay que pedirle que traiga fechas de
  // LIGA. Los clubes de Segunda como el Barranquilla FC figuran con calendario propio por dos
  // partidos sueltos de Copa BetPlay, pero su torneo lo lleva entero el motor. Preguntando solo
  // `hasDatedSchedule` el calendario se armaba con esa única fuente, descartaba el fixture del
  // motor y quedaba vacío: dos partidos en julio y ningún otro mes con nada.
  const usaFechasEnCalendario = hasDatedLeagueSchedule(currentClub.name);

  if (usaFechasEnCalendario) {
    // Con fechas reales el calendario sale de UNA sola fuente: el calendario del club. Antes se
    // mezclaba con el fixture generado y con el historial por semanas, y el mismo partido aparecía
    // dos veces el mismo día (uno como "Apertura" y otro como "V 4-2") o caía en un día que no era.
    //
    // Los resultados de los que ya se jugaron se buscan por RIVAL en las tablas del motor, que es
    // quien los guarda, y se pegan a la fecha real del partido.
    const pasoActual = playerProfile.currentWeek;

    const jugadosPorRival = new Map<string, { myGoals: number; rivalGoals: number }>();
    const anotar = (opponentId: string, myGoals: number, rivalGoals: number) => {
      if (!jugadosPorRival.has(opponentId)) jugadosPorRival.set(opponentId, { myGoals, rivalGoals });
    };
    for (const f of myLeagueFixtures) {
      if (!f.played || (f.homeTeamId !== currentClub.id && f.awayTeamId !== currentClub.id)) continue;
      const isHome = f.homeTeamId === currentClub.id;
      anotar(isHome ? f.awayTeamId : f.homeTeamId, (isHome ? f.homeGoals : f.awayGoals)!, (isHome ? f.awayGoals : f.homeGoals)!);
    }
    const grupoCopa = conmebolCup?.groups.find(g => g.clubIds.includes(currentClub.id));
    for (const f of grupoCopa?.fixtures ?? []) {
      if (!f.played || (f.homeTeamId !== currentClub.id && f.awayTeamId !== currentClub.id)) continue;
      const isHome = f.homeTeamId === currentClub.id;
      anotar(isHome ? f.awayTeamId : f.homeTeamId, (isHome ? f.homeGoals : f.awayGoals)!, (isHome ? f.awayGoals : f.homeGoals)!);
    }

    for (const f of fixturesForClub(currentClub.name)) {
      const paso = pasoDeFecha(currentClub.name, f.date);
      const yaJugado = paso !== null && paso < pasoActual;
      const rival = resolverClubDeCalendario(
        ULTIMATE_CLUBS_DATABASE, f.opponentName,
        f.competition.league, f.competition.kind, f.competition.name,
      );
      // Primero el resultado guardado por FECHA (ver datedResults): es el único que existe para los
      // partidos de copa. Si no está, se cae al que guarda la tabla del motor, por rival.
      const porFecha = playerProfile.datedResults?.find(r => r.date === f.date);
      const marcador = porFecha
        ? { myGoals: porFecha.myGoals, rivalGoals: porFecha.rivalGoals }
        : (yaJugado && rival ? jugadosPorRival.get(rival.id) : undefined);
      // `played` solo si además HAY marcador: la celda imprime `${result} ${score}` y sin marcador
      // mostraba "undefined undefined". Pasa con los partidos de copa (Superliga, Copa Colombia),
      // que no viven en ninguna tabla del motor y por eso no tienen resultado que buscar. Sin
      // marcador se muestra el torneo, atenuado para que se note que ya pasó.
      calendarEvents.push({
        date: new Date(`${f.date}T00:00:00`),
        label: etiquetaCompetencia(f.competition, f.date),
        sublabel: `${f.isHome ? 'vs.' : '@'} ${rival?.name ?? f.opponentName}`,
        colorClass: yaJugado
          ? 'bg-slate-700 text-slate-300'
          : f.competition.kind === 'league' ? 'bg-gold-600 text-white' : 'bg-burgundy-500 text-slate-950',
        opponentClub: rival ?? undefined,
        played: !!marcador,
        result: marcador ? resultFromScore(marcador.myGoals, marcador.rivalGoals) : undefined,
        score: marcador ? `${marcador.myGoals}-${marcador.rivalGoals}` : undefined,
        esHoy: paso === pasoActual,
      });
    }
  } else {
  allUpcomingLeagueFixtures.forEach((fx, i) => {
    calendarEvents.push({
      date: getRealDateForLeagueStepsAhead(playerProfile.currentWeek, i + 1),
      label: `J${fx.matchweek}`,
      sublabel: `${fx.isHome ? 'vs.' : '@'} ${fx.opponentName}`,
      colorClass: 'bg-gold-600 text-white',
      opponentClub: ULTIMATE_CLUBS_DATABASE.find(c => c.id === fx.opponentId)
    });
  });

  // Playoffs de Apertura/Clausura (Colombia a ida y vuelta / Argentina a partido único): la lista
  // de arriba queda vacía en fase eliminatoria (season.fixtures solo cubre la fase regular), así
  // que acá se agrega el próximo cruce de knockout con el nombre real de la ronda.
  if (myLeagueSeason && isApeturaClausuraLeague(currentClub.league) && myLeagueSeason.stage === 'knockout') {
    const myLeagueClubs = ULTIMATE_CLUBS_DATABASE.filter(c => leagueKeyFor(c) === myLeagueKey);
    const upcomingKO = getUpcomingMatchForLeague(myLeagueSeason, myLeagueClubs, playerProfile.currentWeek, currentClub.id);
    if (upcomingKO) {
      let roundLabel = 'Playoff';
      let legLabel = '';
      if (myLeagueSeason.twoLegKnockout) {
        const round = myLeagueSeason.twoLegKnockout.tiesByRound[myLeagueSeason.twoLegKnockout.tiesByRound.length - 1];
        roundLabel = roundLabelByMatchCount(round.length);
        const tie = round.find(t => t.clubAId === currentClub.id || t.clubBId === currentClub.id);
        if (tie) {
          const { leg, global } = tieStatusLabel(tie, currentClub.id);
          legLabel = global ? ` (${leg}, global ${global})` : ` (${leg})`;
        }
      } else if (myLeagueSeason.knockout) {
        const round = myLeagueSeason.knockout.matchesByRound[myLeagueSeason.knockout.matchesByRound.length - 1];
        roundLabel = roundLabelByMatchCount(round.length);
      }
      calendarEvents.push({
        date: getRealDateForLeagueStepsAhead(playerProfile.currentWeek, 1),
        label: `${roundLabel}${legLabel}`,
        sublabel: `${upcomingKO.isHome ? 'vs.' : '@'} ${clubNameById(upcomingKO.opponentId)}`,
        colorClass: 'bg-red-600 text-white',
        opponentClub: ULTIMATE_CLUBS_DATABASE.find(c => c.id === upcomingKO.opponentId)
      });
    }
  }

  upcomingCupFixtures.forEach((fx, i) => {
    calendarEvents.push({
      date: getRealDateForCupStepsAhead(playerProfile.currentWeek, i + 1),
      label: `G${fx.matchweek}`,
      sublabel: `${fx.isHome ? 'vs.' : '@'} ${fx.opponentName}`,
      colorClass: 'bg-burgundy-500 text-slate-950',
      opponentClub: ULTIMATE_CLUBS_DATABASE.find(c => c.id === fx.opponentId)
    });
  });

  if (upcomingCupKnockoutOpponent) {
    calendarEvents.push({
      date: getRealDateForCupStepsAhead(playerProfile.currentWeek, 1),
      label: 'Copa Playoff',
      sublabel: `${upcomingCupKnockoutOpponent.isHome ? 'vs.' : '@'} ${upcomingCupKnockoutOpponent.opponentName}`,
      colorClass: 'bg-burgundy-500 text-slate-950',
      opponentClub: ULTIMATE_CLUBS_DATABASE.find(c => c.id === upcomingCupKnockoutOpponent.opponentId)
    });
  }

  // Copas del calendario real que sí tiene este club aunque su liga vaya por el motor: el
  // Barranquilla FC juega dos partidos de Copa BetPlay contra el Junior y son fecha real, con día
  // exacto. Se agregan acá para no perderlos al elegir la rama del motor.
  //
  // Solo se agregan los que estén CERCA de la semana actual (jugados hace poco o próximos): esta
  // grilla sintética avanza mes a mes desde currentWeek, así que una fecha real fija (ej. julio) que
  // ya quedó muy atrás en la carrera aparecía igual, clavada en medio de meses que ya no
  // correspondían -- el calendario mostraba "julio" y al lado el arranque de la temporada
  // siguiente (enero), como si el tiempo saltara. Bug reportado: "el calendario ... pasa de julio a
  // enero". Con calendario_propio de solo 2 fechas de copa (todos los clubes de Segunda), esas 2
  // fechas deben ubicarse una sola vez, en su momento real, y no perseguir a currentWeek para
  // siempre.
  const ventanaVisibleDias = 120; // ~4 meses a cada lado, igual de generoso que la grilla sintética
  const hoyRealAprox = getRealDate(playerProfile.currentWeek).getTime();
  for (const f of fixturesForClub(currentClub.name)) {
    if (f.competition.kind === 'league') continue;
    const fechaMs = new Date(`${f.date}T00:00:00`).getTime();
    if (Math.abs(fechaMs - hoyRealAprox) > ventanaVisibleDias * 24 * 60 * 60 * 1000) continue;
    const rival = resolverClubDeCalendario(
      ULTIMATE_CLUBS_DATABASE, f.opponentName,
      f.competition.league, f.competition.kind, f.competition.name,
    );
    const porFecha = playerProfile.datedResults?.find(r => r.date === f.date);
    calendarEvents.push({
      date: new Date(`${f.date}T00:00:00`),
      label: f.competition.name,
      sublabel: `${f.isHome ? 'vs.' : '@'} ${rival?.name ?? f.opponentName}`,
      colorClass: porFecha ? 'bg-slate-700 text-slate-300' : 'bg-burgundy-500 text-slate-950',
      opponentClub: rival ?? undefined,
      played: !!porFecha,
      result: porFecha ? resultFromScore(porFecha.myGoals, porFecha.rivalGoals) : undefined,
      score: porFecha ? `${porFecha.myGoals}-${porFecha.rivalGoals}` : undefined,
    });
  }
  } // fin del calendario sin fechas reales

  // --- Historial: partidos YA jugados, con su resultado real (V/E/D + marcador) -- antes el
  // calendario solo mostraba fechas futuras y perdía todo rastro apenas se jugaba el partido (bug
  // reportado: "cuando pasa la fecha se borra del calendario"). Mismo truco de "pasos" que arriba,
  // pero contando hacia atrás con getRealDateFor...StepsBehind, del partido más reciente al más viejo.
  //
  // Solo para clubes SIN fechas reales. Con calendario real este bloque volvía a agregar los mismos
  // partidos con fechas calculadas por semanas, y aparecían días con dos y tres partidos que no
  // existen ("en el calendario salen otros partidos que no sé de dónde salen"). Ahí arriba el
  // calendario ya incluye los jugados con su resultado, en su fecha verdadera.
  if (!usaFechasEnCalendario) {
  let leagueStepsBehindUsed = 0;
  const nextLeagueStepBehind = () => {
    leagueStepsBehindUsed++;
    return getRealDateForLeagueStepsBehind(playerProfile.currentWeek, leagueStepsBehindUsed);
  };
  let cupStepsBehindUsed = 0;
  const nextCupStepBehind = () => {
    cupStepsBehindUsed++;
    return getRealDateForCupStepsBehind(playerProfile.currentWeek, cupStepsBehindUsed);
  };

  if (myLeagueSeason && isApeturaClausuraLeague(currentClub.league) && (myLeagueSeason.stage === 'knockout' || myLeagueSeason.stage === 'done')) {
    if (myLeagueSeason.twoLegKnockout) {
      [...myLeagueSeason.twoLegKnockout.tiesByRound].reverse().forEach(round => {
        const tie = round.find(t => t.clubAId === currentClub.id || t.clubBId === currentClub.id);
        if (!tie) return;
        const roundLabel = roundLabelByMatchCount(round.length);
        twoLegTieToEvents(tie, currentClub.id).forEach(leg => {
          const opponentClub = ULTIMATE_CLUBS_DATABASE.find(c => c.id === leg.opponentId);
          calendarEvents.push({
            date: nextLeagueStepBehind(),
            label: `${roundLabel} (${leg.leg === 'Ida' ? 'I' : 'V'})`,
            sublabel: `${leg.isHome ? 'vs.' : '@'} ${opponentClub?.name || leg.opponentId}`,
            colorClass: 'bg-red-600 text-white',
            opponentClub, played: true,
            result: resultFromScore(leg.myGoals, leg.rivalGoals),
            score: `${leg.myGoals}-${leg.rivalGoals}`
          });
        });
      });
    } else if (myLeagueSeason.knockout) {
      [...myLeagueSeason.knockout.matchesByRound].reverse().forEach(round => {
        const m = round.find(mm => mm.homeTeamId === currentClub.id || mm.awayTeamId === currentClub.id);
        const resolved = m && singleLegMatchToEvent(m, currentClub.id);
        if (!resolved) return;
        const opponentClub = ULTIMATE_CLUBS_DATABASE.find(c => c.id === resolved.opponentId);
        calendarEvents.push({
          date: nextLeagueStepBehind(),
          label: roundLabelByMatchCount(round.length),
          sublabel: `${resolved.isHome ? 'vs.' : '@'} ${opponentClub?.name || resolved.opponentId}`,
          colorClass: 'bg-red-600 text-white',
          opponentClub, played: true,
          result: resultFromScore(resolved.myGoals, resolved.rivalGoals),
          score: `${resolved.myGoals}-${resolved.rivalGoals}`
        });
      });
    }
  }

  myLeagueFixtures
    .filter(f => f.played && (f.homeTeamId === currentClub.id || f.awayTeamId === currentClub.id))
    .sort((a, b) => b.matchweek - a.matchweek)
    .slice(0, 8)
    .forEach(f => {
      const isHome = f.homeTeamId === currentClub.id;
      const opponentId = isHome ? f.awayTeamId : f.homeTeamId;
      const myGoals = (isHome ? f.homeGoals : f.awayGoals)!;
      const rivalGoals = (isHome ? f.awayGoals : f.homeGoals)!;
      calendarEvents.push({
        date: nextLeagueStepBehind(),
        label: `J${f.matchweek}`,
        sublabel: `${isHome ? 'vs.' : '@'} ${clubNameByIdEarly(opponentId)}`,
        colorClass: 'bg-gold-600 text-white',
        opponentClub: ULTIMATE_CLUBS_DATABASE.find(c => c.id === opponentId),
        played: true,
        result: resultFromScore(myGoals, rivalGoals),
        score: `${myGoals}-${rivalGoals}`
      });
    });

  if (conmebolCup) {
    if (conmebolCup.stage === 'knockout' || conmebolCup.stage === 'done') {
      [...(conmebolCup.knockout?.matchesByRound || [])].reverse().forEach(round => {
        const m = round.find(mm => mm.homeTeamId === currentClub.id || mm.awayTeamId === currentClub.id);
        const resolved = m && singleLegMatchToEvent(m, currentClub.id);
        if (!resolved) return;
        const opponentClub = ULTIMATE_CLUBS_DATABASE.find(c => c.id === resolved.opponentId);
        calendarEvents.push({
          date: nextCupStepBehind(),
          label: roundLabelByMatchCount(round.length),
          sublabel: `${resolved.isHome ? 'vs.' : '@'} ${opponentClub?.name || resolved.opponentId}`,
          colorClass: 'bg-burgundy-500 text-slate-950',
          opponentClub, played: true,
          result: resultFromScore(resolved.myGoals, resolved.rivalGoals),
          score: `${resolved.myGoals}-${resolved.rivalGoals}`
        });
      });
    }
    const myGroup = conmebolCup.groups.find(g => g.clubIds.includes(currentClub.id));
    if (myGroup) {
      myGroup.fixtures
        .filter(f => f.played && (f.homeTeamId === currentClub.id || f.awayTeamId === currentClub.id))
        .sort((a, b) => b.matchweek - a.matchweek)
        .forEach(f => {
          const isHome = f.homeTeamId === currentClub.id;
          const opponentId = isHome ? f.awayTeamId : f.homeTeamId;
          const myGoals = (isHome ? f.homeGoals : f.awayGoals)!;
          const rivalGoals = (isHome ? f.awayGoals : f.homeGoals)!;
          calendarEvents.push({
            date: nextCupStepBehind(),
            label: `G${f.matchweek}`,
            sublabel: `${isHome ? 'vs.' : '@'} ${clubNameByIdEarly(opponentId)}`,
            colorClass: 'bg-burgundy-500 text-slate-950',
            opponentClub: ULTIMATE_CLUBS_DATABASE.find(c => c.id === opponentId),
            played: true,
            result: resultFromScore(myGoals, rivalGoals),
            score: `${myGoals}-${rivalGoals}`
          });
        });
    }
  } else if (uefaCup) {
    if (uefaCup.stage === 'knockout' || uefaCup.stage === 'done') {
      [...(uefaCup.knockout?.tiesByRound || [])].reverse().forEach(round => {
        const tie = round.find(t => t.clubAId === currentClub.id || t.clubBId === currentClub.id);
        if (!tie) return;
        const roundLabel = roundLabelByMatchCount(round.length);
        twoLegTieToEvents(tie, currentClub.id).forEach(leg => {
          const opponentClub = ULTIMATE_CLUBS_DATABASE.find(c => c.id === leg.opponentId);
          calendarEvents.push({
            date: nextCupStepBehind(),
            label: `${roundLabel} (${leg.leg === 'Ida' ? 'I' : 'V'})`,
            sublabel: `${leg.isHome ? 'vs.' : '@'} ${opponentClub?.name || leg.opponentId}`,
            colorClass: 'bg-burgundy-500 text-slate-950',
            opponentClub, played: true,
            result: resultFromScore(leg.myGoals, leg.rivalGoals),
            score: `${leg.myGoals}-${leg.rivalGoals}`
          });
        });
      });
    } else if (uefaCup.stage === 'playoff' && uefaCup.playoff) {
      const tie = uefaCup.playoff.find(t => t.clubAId === currentClub.id || t.clubBId === currentClub.id);
      if (tie) {
        twoLegTieToEvents(tie, currentClub.id).forEach(leg => {
          const opponentClub = ULTIMATE_CLUBS_DATABASE.find(c => c.id === leg.opponentId);
          calendarEvents.push({
            date: nextCupStepBehind(),
            label: `Playoff (${leg.leg === 'Ida' ? 'I' : 'V'})`,
            sublabel: `${leg.isHome ? 'vs.' : '@'} ${opponentClub?.name || leg.opponentId}`,
            colorClass: 'bg-burgundy-500 text-slate-950',
            opponentClub, played: true,
            result: resultFromScore(leg.myGoals, leg.rivalGoals),
            score: `${leg.myGoals}-${leg.rivalGoals}`
          });
        });
      }
    }
    uefaCup.fixtures
      .filter(f => f.played && (f.homeTeamId === currentClub.id || f.awayTeamId === currentClub.id))
      .sort((a, b) => b.matchweek - a.matchweek)
      .forEach(f => {
        const isHome = f.homeTeamId === currentClub.id;
        const opponentId = isHome ? f.awayTeamId : f.homeTeamId;
        const myGoals = (isHome ? f.homeGoals : f.awayGoals)!;
        const rivalGoals = (isHome ? f.awayGoals : f.homeGoals)!;
        calendarEvents.push({
          date: nextCupStepBehind(),
          label: `F${f.matchweek}`,
          sublabel: `${isHome ? 'vs.' : '@'} ${clubNameByIdEarly(opponentId)}`,
          colorClass: 'bg-burgundy-500 text-slate-950',
          opponentClub: ULTIMATE_CLUBS_DATABASE.find(c => c.id === opponentId),
          played: true,
          result: resultFromScore(myGoals, rivalGoals),
          score: `${myGoals}-${rivalGoals}`
        });
      });
  }

  } // fin del historial por semanas (solo clubes sin fechas reales)

  // El mes que abre el calendario es el del partido de HOY, tomado del calendario real.
  //
  // getRealDate cuenta semanas de 7 días desde el arranque de carrera, y con fechas reales eso ya
  // no coincide: en el paso 18 (9 de abril de verdad) daba mediados de mayo, así que el calendario
  // abría en un mes equivocado y los partidos de Libertadores "no aparecían" -- estaban, pero en
  // abril, y la grilla mostraba mayo.
  const calendarBaseDate = (() => {
    if (hasDatedLeagueSchedule(currentClub.name)) {
      const paso = fixturesAtStep(currentClub.name, playerProfile.currentWeek);
      if (paso) return new Date(`${paso.date}T00:00:00`);
    }
    return getRealDate(playerProfile.currentWeek);
  })();
  const calendarGridDate = new Date(calendarBaseDate.getFullYear(), calendarBaseDate.getMonth() + calendarMonthOffset, 1);
  const calendarGridYear = calendarGridDate.getFullYear();
  const calendarGridMonth = calendarGridDate.getMonth();
  const calendarWeeks = buildMonthGrid(calendarGridYear, calendarGridMonth);
  const calendarEventsByDay = new Map<number, CalendarEvent[]>();
  calendarEvents.forEach(ev => {
    if (ev.date.getFullYear() === calendarGridYear && ev.date.getMonth() === calendarGridMonth) {
      const d = ev.date.getDate();
      if (!calendarEventsByDay.has(d)) calendarEventsByDay.set(d, []);
      calendarEventsByDay.get(d)!.push(ev);
    }
  });

  return (
    <div id="dashboard-view" className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row relative">

      {expandedGifUrl && (
        <div
          onClick={() => setExpandedGifUrl(null)}
          className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer animate-fade-in"
        >
          <button
            onClick={() => setExpandedGifUrl(null)}
            className="btn-fx-subtle absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <img
            src={expandedGifUrl}
            alt="GIF ampliado"
            onClick={e => e.stopPropagation()}
            className="max-w-full max-h-full rounded-2xl border border-slate-700 shadow-2xl cursor-default"
          />
        </div>
      )}

      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-3 z-20">
        <div className="space-y-4">

          <div className="p-3 flex items-center gap-3 border-b border-slate-800">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,132,46,0.3)]">
              <Star size={18} className="text-slate-950" fill="currentColor" strokeWidth={1} />
            </div>
            <div>
              <div className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest leading-none">
                FutStarzz
              </div>
              <div className="text-sm font-black italic text-white tracking-tight leading-tight mt-0.5">
                CONSOLA 2026
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-burgundy-500 uppercase tracking-widest font-mono font-bold block mb-1">
              Ficha Profesional
            </span>
            <h2 className="font-extrabold text-sm text-white truncate">
              {playerProfile.dorsal != null && <span className="text-gold-400">#{playerProfile.dorsal}</span>} {playerProfile.name}
            </h2>
            <div className="flex justify-between items-center gap-2 text-3xs text-slate-400 font-mono mt-1">
              <span className="truncate">{playerProfile.position}</span>
              <span className="shrink-0">{playerProfile.age} años{playerProfile.heightCm != null ? ` · ${playerProfile.heightCm}cm` : ''}</span>
            </div>
            
            <div className={`mt-2.5 p-2 rounded-xl text-xs font-bold truncate flex items-center gap-1.5 ${currentClub.badgeColor}`}>
              <ClubBadge club={currentClub} size={20} colorFallback={false} className="bg-black/25 font-normal" />
              <span className="truncate">{currentClub.name}</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('carrera')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'carrera' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <User size={15} /> Mi Carrera
            </button>
            <button
              onClick={() => setActiveTab('mi_club')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'mi_club' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Sparkles size={15} /> Plantilla de Club 
            </button>
            <button
              onClick={() => setActiveTab('entrenamiento')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'entrenamiento' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Dumbbell size={15} /> Entrenamiento
            </button>
            <button
              onClick={() => setActiveTab('chutsocial')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'chutsocial' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Send size={15} /> ChutSocial
            </button>
            <button
              onClick={() => setActiveTab('prensa')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'prensa' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Radio size={15} /> Sala de Prensa
            </button>
            <button
              onClick={() => setActiveTab('traspasos')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'traspasos' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <RefreshCw size={15} /> Traspasos
            </button>
            <button
              onClick={() => setActiveTab('tienda')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'tienda' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <ShoppingBag size={15} /> Tienda de Lujos
            </button>
            <button
              onClick={() => setActiveTab('patrocinios')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'patrocinios' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Award size={15} /> Patrocinios
            </button>
            <button
              onClick={() => setActiveTab('tablas')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'tablas' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Table size={15} /> Copas y Tablas
            </button>
            <button
              onClick={() => setActiveTab('calendario')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'calendario' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Calendar size={15} /> Calendario
            </button>
            <button
              onClick={() => setActiveTab('logros')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'logros' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Trophy size={15} /> Logros
              <span className="ml-auto text-3xs font-mono text-slate-500">
                {Object.keys(playerProfile.unlockedAchievements).length}/{ACHIEVEMENTS_DATABASE.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="btn-fx-subtle w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 text-2xs font-mono transition-colors text-left cursor-pointer"
          >
            <LogOut size={13} /> Guardar & Salir
          </button>
          <button
            onClick={onResetGame}
            className="btn-fx-subtle w-full flex items-center gap-2 px-3 py-1 text-slate-500 hover:text-orange-500 text-3xs font-mono transition-colors text-left cursor-pointer"
          >
            🗑️ Reiniciar Datos de Carrera
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        
        <header className="bg-slate-900 border-b border-slate-800 p-3 md:px-8 md:py-3 flex flex-col md:flex-row gap-4 justify-between items-center z-10">
          
          <div className="flex gap-1.5 items-center flex-wrap">
            <span className="text-gold-400 text-sm font-black">FECHA {playerProfile.currentWeek}</span>
            <span className="text-slate-500 text-2xs">· {fechaEnPantalla}</span>
            {playerProfile.suspendedMatches > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-3xs font-black uppercase">
                🚫 Sancionado · {playerProfile.suspendedMatches} PJ
              </span>
            )}
            {playerProfile.suspendedMatches === 0 && playerProfile.yellowCards > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-burgundy-500/10 border border-burgundy-500/30 text-burgundy-400 text-3xs font-black uppercase">
                🟨 x{playerProfile.yellowCards} en la temporada
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:flex items-center gap-4 text-xs font-mono w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <Zap size={14} className="text-burgundy-500" />
              <div>
                <div className="flex justify-between items-center text-3xs text-slate-500 font-bold uppercase leading-none min-w-[70px]">
                  <span>Energía</span>
                  <span className="text-white">{playerProfile.energy}/100</span>
                </div>
                <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-burgundy-500 h-full rounded-full"
                    style={{ width: `${playerProfile.energy}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <DollarSign size={14} className="text-gold-400 font-bold" />
              <div>
                <span className="text-3xs text-slate-500 block leading-none font-bold uppercase">Capital</span>
                <span className="text-xs text-white font-black">${playerProfile.capital.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <Star size={14} className="text-yellow-400" />
              <div>
                <div className="flex justify-between items-center text-3xs text-slate-500 font-bold uppercase leading-none min-w-[70px]">
                  <span>Prestigio</span>
                  <span className="text-white">{playerProfile.prestige}/100</span>
                </div>
                <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-yellow-500 h-full rounded-full"
                    style={{ width: `${playerProfile.prestige}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <Heart size={14} className="text-rose-500" />
              <div>
                <div className="flex justify-between items-center text-3xs text-slate-500 font-bold uppercase leading-none min-w-[70px]">
                  <span>Hinchada</span>
                  <span className="text-white">{playerProfile.fans}/100</span>
                </div>
                <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${playerProfile.fans}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <Brain size={14} className="text-sky-400" />
              <div>
                <div className="flex justify-between items-center text-3xs text-slate-500 font-bold uppercase leading-none min-w-[70px]">
                  <span>Mente</span>
                  <span className="text-white">{playerProfile.mentalHealth}/100</span>
                </div>
                <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{ width: `${playerProfile.mentalHealth}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-3 md:p-6 flex-1">

          {activeTab === 'carrera' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid md:grid-cols-3 gap-4">

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                    <Award size={15} className="text-gold-400" /> Atributos del Jugador
                  </h3>
                  {(playerProfile.dorsal != null || playerProfile.heightCm != null) && (
                    <p className="text-3xs text-slate-500 font-mono mb-3">
                      {playerProfile.dorsal != null && `Dorsal #${playerProfile.dorsal}`}
                      {playerProfile.dorsal != null && playerProfile.heightCm != null && ' · '}
                      {playerProfile.heightCm != null && `${playerProfile.heightCm} cm`}
                    </p>
                  )}

                  <div className="space-y-2.5">
                    {Object.entries(playerProfile.attributes).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-2xs text-slate-300 font-mono uppercase font-bold">
                          <span>{key}</span>
                          <span className="text-gold-400 font-black">{val}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-gold-600 to-gold-400 h-full rounded-full"
                            style={{ width: `${(val / 99) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vitrina de trofeos. Va acá, debajo de los atributos, porque era el espacio
                      muerto de la tarjeta y porque el palmarés es la otra mitad de "quién es este
                      jugador". Ver getPalmares: se deriva del perfil, no se guarda aparte. */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <h4 className="text-3xs font-black uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <Trophy size={12} className="text-gold-400" /> Vitrina de Trofeos
                      {misTrofeos.length > 0 && (
                        <span className="ml-auto text-gold-400 font-mono">{misTrofeos.length}</span>
                      )}
                    </h4>

                    {misTrofeos.length === 0 ? (
                      <p className="text-3xs font-mono text-slate-500 uppercase leading-relaxed text-center py-2">
                        Todavía no ganaste ningún título. Llevá a tu equipo a lo más alto.
                      </p>
                    ) : (
                      <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {misTrofeos.map(t => (
                          <li
                            key={t.id}
                            className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2"
                          >
                            <span className="text-base leading-none shrink-0" aria-hidden="true">
                              {/* 'copa' es la copa NACIONAL: ganarla es un título, así que no puede
                                  llevar 🥈 (se lee como subcampeón). Va con la copa de asas. */}
                              {t.tipo === 'mundial' ? '🌎' : t.tipo === 'continental' ? '🏆' : t.tipo === 'copa' ? '🏅' : '🥇'}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-2xs font-black text-white truncate">{t.nombre}</span>
                              <span className="block text-3xs font-mono text-slate-500 truncate">
                                {t.detalle} · {t.clubName}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-3xs font-mono text-slate-500 uppercase leading-relaxed text-center">
                    Entrena de forma exigente en el complejo deportivo para potenciar tus capacidades.
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                      🏆 Estadísticas Históricas de Carrera
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
                        <span className="text-3xs text-slate-500 font-mono uppercase min-h-[2rem] flex items-center justify-center">Goles Marcados</span>
                        <span className="text-2xl font-black text-gold-400 font-mono block mt-1">
                          {playerProfile.careerStats.golesHistoricos}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
                        <span className="text-3xs text-slate-500 font-mono uppercase w-full break-words min-h-[2rem] flex items-center justify-center">Asistencias</span>
                        <span className="text-2xl font-black text-yellow-500 font-mono block mt-1">
                          {playerProfile.careerStats.asistenciasHistoricos}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center text-center col-span-2">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Calificación Promedio</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">
                          {(playerProfile.careerStats.partidosHistoricos > 0
                            ? playerProfile.careerStats.sumaCalificacionesHistoricas / playerProfile.careerStats.partidosHistoricos
                            : 0
                          ).toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Tarjetas Amarillas</span>
                        <span className="text-2xl font-black text-yellow-400 font-mono mt-1 flex items-center gap-1.5">
                          <span className="w-3 h-4 rounded-sm bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)] shrink-0" />
                          {playerProfile.careerStats.tarjetasAmarillasHistoricas}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Tarjetas Rojas</span>
                        <span className="text-2xl font-black text-red-500 font-mono mt-1 flex items-center gap-1.5">
                          <span className="w-3 h-4 rounded-sm bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)] shrink-0" />
                          {playerProfile.careerStats.tarjetasRojasHistoricas}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center col-span-2">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Partidos Totales</span>
                        <span className="text-base font-black text-white font-mono block mt-1">
                          {playerProfile.careerStats.partidosHistoricos} encuentros oficiales
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl mt-3">
                    <span className="text-[10px] text-burgundy-500 uppercase font-mono font-bold block mb-0.5">Valor de Mercado de la Ficha</span>
                    <span className="font-extrabold text-sm text-slate-200">
                      ${playerProfile.marketValue.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl mt-2.5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] text-burgundy-500 uppercase font-mono font-bold">Rivalidad Generacional</span>
                      <span className="text-2xs font-black text-gold-400">{currentMilestone.label}</span>
                    </div>
                    {nextMilestone ? (
                      <>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-gold-600 to-gold-400 h-full rounded-full"
                            style={{ width: `${milestoneProgressPct}%` }}
                          />
                        </div>
                        <p className="text-3xs text-slate-500 font-mono mt-1">
                          {careerContribution}/{nextMilestone.threshold} aporte (G+A) para "{nextMilestone.label}"
                        </p>
                      </>
                    ) : (
                      <p className="text-3xs text-slate-500 font-mono">Ya alcanzaste el hito máximo de la tabla histórica.</p>
                    )}
                  </div>
                </div>

                <div className="bg-gold-950/20 border border-gold-900/30 rounded-3xl p-4 shadow-xl flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    {nextMatchOpponent ? (
                      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl relative">
                        <span className="absolute top-3 right-3 text-3xs font-mono font-black uppercase bg-slate-900/80 px-2 py-1 rounded text-gold-400 border border-slate-800">
                          {nextMatchOpponent.jornada}
                        </span>
                        {/* La fecha completa, no solo "9 abr" en la esquina: sin esto no quedaba
                            claro que ese día era el del partido, y al abrir el Calendario para
                            confirmarlo la confusión crecía. */}
                        <span className="text-3xs text-burgundy-500 uppercase font-mono font-bold block mb-1 pr-16 truncate">
                          {nextMatchOpponent.competition}
                        </span>
                        {fechaDelProximoPartido && (
                          <span className="text-3xs text-slate-500 font-mono block mb-3 pr-16 truncate">
                            {fechaDelProximoPartido}
                          </span>
                        )}
                        <div className="flex items-center gap-3">
                          {nextMatchOpponent.club ? (
                            <ClubBadge club={nextMatchOpponent.club} size={48} className="rounded-xl border border-slate-800 bg-slate-900 shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">⚽</div>
                          )}
                          <div className="min-w-0">
                            <span className="text-3xs text-slate-500 uppercase font-mono block truncate">
                              {nextMatchOpponent.isHome ? 'Local' : 'Visitante'}
                            </span>
                            <span className="text-white font-bold text-base truncate block">vs {nextMatchOpponent.name}</span>
                            {nextMatchOpponent.rivalPos != null && (
                              <span className="text-2xs text-gold-400 font-mono font-bold block mt-0.5">
                                {nextMatchOpponent.rivalPos}° {nextMatchOpponent.rivalTotal ? `de ${nextMatchOpponent.rivalTotal}` : ''} en la tabla
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : nextWeekInWorldCupBreak ? (
                      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                          🌎
                        </div>
                        <div className="min-w-0">
                          <span className="text-3xs text-slate-500 uppercase font-mono block truncate">Fecha FIFA</span>
                          <span className="text-white font-bold text-sm truncate block">No fuiste convocado esta ventana</span>
                        </div>
                      </div>
                    ) : nextWeekIsFillerCup ? (
                      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                          🏆
                        </div>
                        <div className="min-w-0">
                          <span className="text-3xs text-slate-500 uppercase font-mono block truncate">Semana de Copa</span>
                          {/* "Rival por definirse" era engañoso: el rival no aparecía nunca porque el
                              club no está jugando ninguna copa continental esta temporada. */}
                          <span className="text-white font-bold text-sm truncate block">
                            {eliminadoDeCopa ? 'Eliminado de la copa' : `${currentClub.name} no juega copa esta temporada`}
                          </span>
                          <span className="text-3xs text-slate-500 block truncate mt-0.5">
                            Se juega un amistoso de mitad de semana
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <button
                    onClick={onAdvanceWeek}
                    className="btn-fx w-full py-3 px-6 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl cursor-pointer mt-4"
                  >
                    {nextWeekInWorldCupBreak && !nextMatchOpponent ? 'Pasar a Siguiente Fecha' : 'Disputar Partido'} <ArrowRight size={15} />
                  </button>
                </div>

              </div>

              {playerProfile.age >= 32 && (
                <div className="bg-slate-900 border border-burgundy-900/40 rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-burgundy-500 mb-2 flex items-center gap-2">
                    🎖️ Fase Veterana de la Carrera
                  </h3>
                  <p className="text-2xs text-slate-400 leading-relaxed mb-4">
                    A los {playerProfile.age} años el cuerpo ya no responde igual que a los 18: tu ritmo y físico
                    empiezan a bajar de a poco cada temporada, aunque entrenes. Si sientes que tu posición actual
                    ya no rinde, todavía puedes reconvertirte una vez más antes de colgar los botines.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(['Delantero', 'Mediocampista', 'Defensor', 'Arquero'] as Position[])
                      .filter(pos => pos !== playerProfile.position)
                      .map(pos => (
                        <button
                          key={pos}
                          onClick={() => {
                            if (confirm(`¿Reconvertirte a ${pos}? Tus atributos se van a reacomodar un poco hacia el perfil de esa posición. Esta decisión no se puede deshacer.`)) {
                              onReconvertPosition(pos);
                            }
                          }}
                          className="btn-fx-subtle py-2 px-4 rounded-xl bg-slate-950 border border-slate-800 text-2xs font-bold text-slate-300 hover:border-burgundy-500/50 hover:text-burgundy-400 transition-all cursor-pointer"
                        >
                          Reconvertirme a {pos}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'entrenamiento' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Complejo de Preparación Física y Técnica
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Invierte tu estamina semanal para perfeccionar tus habilidades técnicas. Cada sesión requiere <span className="text-burgundy-500 font-bold">-20 Energía</span> y <span className="text-burgundy-500 font-bold">-${trainingCost.toLocaleString()}</span> (instalaciones de {currentClub.name}), y sumará permanentemente {playerProfile.yearsAtClub >= 5 ? <span className="text-burgundy-500 font-bold">+1 punto</span> : <span className="text-gold-400 font-bold">+3 puntos</span>} al atributo seleccionado.
                </p>
              </div>

              {playerProfile.energy < 20 ? (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldAlert size={18} /> Tu estado físico es de fatiga crítica. Entrena en la Clínica o descansa.
                </div>
              ) : null}

              {playerProfile.capital < trainingCost && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldAlert size={18} /> No tienes los ${trainingCost.toLocaleString()} que cuesta entrenar en las instalaciones de {currentClub.name}.
                </div>
              )}

              {playerProfile.yearsAtClub >= 5 && (
                <div className="p-4 rounded-xl border border-burgundy-500/30 bg-burgundy-950/20 text-burgundy-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldAlert size={18} /> Zona de confort: llevas {playerProfile.yearsAtClub} temporadas seguidas en {currentClub.name} y el entrenamiento rinde menos (+1 en vez de +3). Un traspaso te devuelve la ambición fresca.
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: 'ritmo', label: 'Velocidad / Ritmo', img: trainingRitmoImg, desc: 'Mejora la aceleración explosiva y los desmarques por las bandas.' },
                  { key: 'regate', label: 'Dribbling / Regate', img: trainingRegateImg, desc: 'Aumenta el control de balón en conducción y el mano a mano.' },
                  { key: 'tiro', label: 'Definición / Tiro', img: trainingTiroImg, desc: 'Sube la contundencia y potencia de cara al arco rival.' },
                  { key: 'defensa', label: 'Robo / Defensa', img: trainingDefensaImg, desc: 'Optimiza la capacidad de anticipación e intercepción táctica.' },
                  { key: 'pase', label: 'Visión / Pase', img: trainingPaseImg, desc: 'Clave para habilitaciones precisas entre líneas y asistencias.' },
                  { key: 'fisico', label: 'Potencia / Físico', img: trainingFisicoImg, desc: 'Incrementa la resistencia en disputas aéreas y choques hombro con hombro.' }
                ].map(item => (
                  <div key={item.key} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-gold-500/20 transition-all flex flex-col justify-between">
                    <div className="relative h-28 shrink-0 overflow-hidden">
                      <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <span className="absolute top-2 right-2 text-3xs font-mono font-black uppercase bg-slate-950/80 px-2 py-0.5 rounded text-burgundy-500 border border-slate-800">
                        {playerProfile.attributes[item.key as keyof PlayerStats]}/99
                      </span>
                      <h4 className="absolute bottom-2 left-3 font-bold text-sm text-white drop-shadow-lg pr-3">{item.label}</h4>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-1">
                      <p className="text-3xs text-slate-400 leading-relaxed">{item.desc}</p>

                      <button
                        onClick={() => onTrainAttribute(item.key as keyof PlayerStats)}
                        disabled={playerProfile.energy < 20 || playerProfile.capital < trainingCost}
                        className={`btn-fx-subtle w-full mt-4 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                          playerProfile.energy >= 20 && playerProfile.capital >= trainingCost
                            ? 'bg-slate-950 text-white hover:bg-gradient-to-br hover:from-gold-400 hover:to-gold-600 hover:text-slate-950 border border-slate-800 hover:border-gold-400 cursor-pointer'
                            : 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-900'
                        }`}
                      >
                        Ejercitar (-20 E · -${trainingCost.toLocaleString()})
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SECCIÓN CLÍNICA DE FISIOTERAPIA */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg mt-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                  <Heart size={15} className="text-rose-500" /> Clínica de Fisioterapia y Recuperación
                </h3>
                <p className="text-3xs text-slate-400 leading-relaxed mb-4">
                  ¿Fatiga acumulada? Invierte parte de tu capital bancario en sesiones de crioterapia y masajes para recuperar estamina rápidamente sin perder semanas de juego.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Masaje Deportivo</span>
                      </div>
                      <p className="text-3xs text-gold-400 font-mono">+25 Energía al Instante</p>
                    </div>
                    <button
                      onClick={() => onRecoverEnergy(1500, 25)}
                      disabled={playerProfile.capital < 1500 || playerProfile.energy >= 100}
                      className="btn-fx-subtle py-2 px-4 rounded-xl bg-slate-800 text-white font-bold text-3xs uppercase tracking-wider hover:bg-gradient-to-br hover:from-gold-400 hover:to-gold-600 hover:text-slate-950 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -$1,500
                    </button>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Cámara Hiperbárica</span>
                      </div>
                      <p className="text-3xs text-gold-400 font-mono">+60 Energía al Instante</p>
                    </div>
                    <button
                      onClick={() => onRecoverEnergy(3500, 60)}
                      disabled={playerProfile.capital < 3500 || playerProfile.energy >= 100}
                      className="btn-fx-subtle py-2 px-4 rounded-xl bg-slate-800 text-white font-bold text-3xs uppercase tracking-wider hover:bg-gradient-to-br hover:from-gold-400 hover:to-gold-600 hover:text-slate-950 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -$3,500
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chutsocial' && (
            <div className="space-y-6 animate-fade-in max-w-4xl grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Send size={15} className="text-gold-400" /> Red de Opinión Pública - Prensa y Afición
                  </h3>

                  <div className="space-y-4">
                    {socialFeed.map(post => {
                      const isLiked = likedPosts.has(post.id);
                      const totalLikes = post.likes + (isLiked ? 1 : 0);
                      const comments = postComments[post.id] || [];
                      const totalComments = post.commentsCount + comments.length;
                      return (
                        <div key={post.id} className="p-4 bg-slate-955/40 border border-slate-800 rounded-2xl space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2.5">
                              {post.avatarImg ? (
                                <img src={post.avatarImg} alt={post.author} className="w-9 h-9 rounded-xl object-cover border border-slate-800 shrink-0" />
                              ) : (
                                <span className="text-lg p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                                  {post.avatar}
                                </span>
                              )}
                              <div>
                                <h4 className="font-bold text-xs text-white leading-none">{post.author}</h4>
                                <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider font-mono">
                                  {post.role}
                                </span>
                              </div>
                            </div>
                            <span className="text-3xs text-slate-500 font-mono">{post.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {post.content}
                          </p>
                          {postGifs[post.id] && (
                            <img
                              src={postGifs[post.id]}
                              alt="Reacción GIF"
                              onClick={() => setExpandedGifUrl(postGifs[post.id])}
                              className="w-full max-w-xs rounded-xl border border-slate-800 mt-1 cursor-pointer hover:opacity-90 transition-opacity"
                            />
                          )}
                          <div className="flex items-center gap-4 text-3xs text-slate-500 font-mono pt-2 border-t border-slate-950">
                            <button
                              onClick={() => toggleLike(post.id)}
                              className={`btn-fx-subtle flex items-center gap-1 cursor-pointer transition-colors ${isLiked ? 'text-red-400' : 'hover:text-red-400'}`}
                            >
                              {isLiked ? '❤️' : '🤍'} {totalLikes.toLocaleString()} Me gusta
                            </button>
                            <button
                              onClick={() => setOpenCommentBox(openCommentBox === post.id ? null : post.id)}
                              className="btn-fx-subtle flex items-center gap-1 cursor-pointer hover:text-gold-400 transition-colors"
                            >
                              💬 {totalComments.toLocaleString()} Hilos
                            </button>
                          </div>

                          {comments.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-950">
                              {comments.map(c => (
                                <div key={c.id} className="flex items-start gap-2">
                                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">
                                    {playerProfile.name.charAt(0).toUpperCase()}
                                  </span>
                                  <div className="min-w-0">
                                    <span className="text-[10px] text-white font-bold block">{playerProfile.name}</span>
                                    {c.text && <p className="text-2xs text-slate-300 leading-snug">{c.text}</p>}
                                    {c.gifUrl && (
                                      <img
                                        src={c.gifUrl}
                                        alt="GIF"
                                        onClick={() => setExpandedGifUrl(c.gifUrl!)}
                                        className="w-32 rounded-lg border border-slate-800 mt-1 cursor-pointer hover:opacity-90 transition-opacity"
                                      />
                                    )}
                                    <span className="text-[9px] text-slate-500 font-mono">❤️ {c.likes.toLocaleString()} Me gusta</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {openCommentBox === post.id && (
                            <div className="pt-2 border-t border-slate-950 space-y-2">
                              {commentGifDrafts[post.id] && (
                                <div className="relative inline-block">
                                  <img src={commentGifDrafts[post.id]} alt="GIF elegido" className="w-28 rounded-lg border border-gold-500/40" />
                                  <button
                                    type="button"
                                    onClick={() => setCommentGifDrafts(prev => { const next = { ...prev }; delete next[post.id]; return next; })}
                                    className="btn-fx-subtle absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-3xs font-black flex items-center justify-center"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={commentDrafts[post.id] || ''}
                                  onChange={e => setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyDown={e => { if (e.key === 'Enter') submitComment(post.id); }}
                                  placeholder="Escribí tu comentario... es libre, opiná lo que quieras"
                                  className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-2xs text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = gifPickerOpenFor === post.id ? null : post.id;
                                    setGifPickerOpenFor(next);
                                    if (next) searchGifsForComment(playerProfile.name);
                                  }}
                                  className="btn-fx-subtle px-2.5 py-1.5 rounded-lg border border-slate-700 text-2xs font-bold text-slate-300 hover:border-gold-500/50 shrink-0"
                                  title="Adjuntar GIF"
                                >
                                  GIF
                                </button>
                                <button
                                  onClick={() => submitComment(post.id)}
                                  className="btn-fx-subtle px-3 py-1.5 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-bold text-2xs cursor-pointer shrink-0"
                                >
                                  Publicar
                                </button>
                              </div>

                              {gifPickerOpenFor === post.id && (
                                <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                                  <input
                                    type="text"
                                    value={gifSearchQuery}
                                    onChange={e => searchGifsForComment(e.target.value)}
                                    placeholder="Buscar GIF..."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-2xs text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50"
                                  />
                                  <div className="max-h-96 overflow-y-auto pr-1 space-y-2">
                                    <div className="grid grid-cols-3 gap-2">
                                      {gifSearchResults.length === 0 ? (
                                        <span className="col-span-3 text-3xs text-slate-500 text-center py-2">
                                          {gifSearchQuery.trim() ? 'Sin resultados' : 'Escribí algo para buscar'}
                                        </span>
                                      ) : (
                                        gifSearchResults.map((url, i) => (
                                          <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                              setCommentGifDrafts(prev => ({ ...prev, [post.id]: url }));
                                              setGifPickerOpenFor(null);
                                            }}
                                            className="btn-fx-subtle rounded-lg overflow-hidden border border-slate-800 hover:border-gold-500/50"
                                          >
                                            <img src={url} alt="" className="w-full h-28 object-cover" />
                                          </button>
                                        ))
                                      )}
                                    </div>
                                    {gifSearchResults.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={loadMoreGifs}
                                        disabled={gifSearchLoadingMore}
                                        className="btn-fx-subtle w-full py-2 rounded-lg border border-slate-800 text-2xs font-bold text-slate-300 hover:border-gold-500/50 disabled:opacity-50 disabled:cursor-wait"
                                      >
                                        {gifSearchLoadingMore ? 'Cargando...' : 'Cargar más GIFs'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    💕 Vida Amorosa
                  </h3>

                  {!playerProfile.girlfriend ? (
                    <>
                      <p className="text-3xs text-slate-400 leading-relaxed mb-4">
                        Estás soltero. La prensa del corazón siempre anda buscando algo que contar.
                      </p>
                      <button
                        onClick={onFindGirlfriend}
                        className="btn-fx-subtle w-full py-2 px-3 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                      >
                        Buscar Pareja
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-white">{playerProfile.girlfriend.name}</span>
                          {playerProfile.girlfriend.livingTogether && (
                            <span className="text-3xs font-mono uppercase text-gold-400">Conviven</span>
                          )}
                        </div>
                        <div className="flex justify-between text-3xs text-slate-400 font-mono mb-1">
                          <span>Relación</span>
                          <span className="text-burgundy-400 font-bold">{playerProfile.girlfriend.loveMeter}/100</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-burgundy-600 to-burgundy-400 h-full rounded-full"
                            style={{ width: `${playerProfile.girlfriend.loveMeter}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={onGirlfriendFlowers}
                          disabled={playerProfile.capital < 300}
                          className="btn-fx-subtle py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          💐 Regalar Flores
                        </button>
                        <button
                          onClick={onGirlfriendPhoto}
                          className="btn-fx-subtle py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer"
                        >
                          📸 Foto Juntos
                        </button>
                        <button
                          onClick={onGirlfriendFaithful}
                          className="btn-fx-subtle py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer"
                        >
                          🙏 Serle Fiel
                        </button>
                        <button
                          onClick={onGirlfriendDenyRumors}
                          className="btn-fx-subtle py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer"
                        >
                          📰 Negar Rumores
                        </button>
                        <button
                          onClick={onGirlfriendCheat}
                          className="btn-fx-subtle col-span-2 py-1.5 px-2 rounded-lg bg-red-950/30 border border-red-500/20 hover:border-red-500/50 text-2xs font-bold text-red-300 cursor-pointer"
                        >
                          😈 Engañarla con una Modelo
                        </button>
                      </div>

                      {playerProfile.girlfriend.loveMeter >= 70 && !playerProfile.girlfriend.livingTogether && (
                        <div className="p-3 bg-gold-950/20 border border-gold-500/20 rounded-xl">
                          <p className="text-3xs text-slate-300 leading-relaxed mb-2">
                            💬 {playerProfile.girlfriend.name} te pidió que se muden juntos.
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => onGirlfriendMoveIn(true)}
                              className="btn-fx-subtle py-1.5 px-2 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-bold text-3xs uppercase cursor-pointer"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() => onGirlfriendMoveIn(false)}
                              className="btn-fx-subtle py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-bold text-3xs uppercase cursor-pointer"
                            >
                              Rechazar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    📢 Gestión de Imagen de Marca
                  </h3>
                  <p className="text-3xs text-slate-400 leading-relaxed mb-4">
                    Ejecuta relaciones públicas para fidelizar a los seguidores o renegociar contratos de patrocinio comercial.
                  </p>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Sorteo para Aficionados</span>
                        <span className="text-red-400 font-mono">-$1,000</span>
                      </div>
                      <p className="text-3xs text-slate-400">Regala equipamiento autografiado para aumentar radicalmente tu base de fans.</p>
                      <button
                        onClick={() => onLaunchPRCampaign(1000, 10, 0)}
                        disabled={playerProfile.capital < 1000}
                        className="btn-fx-subtle w-full mt-3 py-1.5 px-3 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                      >
                        Lanzar sorteo
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Gala de Caridad</span>
                        <span className="text-red-400 font-mono">-$3,000</span>
                      </div>
                      <p className="text-3xs text-slate-400">Impacto altamente positivo en el prestigio de la prensa especializada.</p>
                      <button
                        onClick={() => onLaunchPRCampaign(3000, 15, 3)}
                        disabled={playerProfile.capital < 3000}
                        className="btn-fx-subtle w-full mt-3 py-1.5 px-3 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                      >
                        Financiar Evento
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Campaña de Patrocinio</span>
                        <span className="text-gold-400 font-mono">+$4,000 Corp</span>
                      </div>
                      <p className="text-3xs text-slate-400">Recibes capital inmediato, pero genera ligeras críticas por saturación publicitaria.</p>
                      <button
                        onClick={() => onLaunchPRCampaign(-4000, 5, -8)}
                        className="btn-fx-subtle w-full mt-3 py-1.5 px-3 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                      >
                        Firmar Contrato Comercial
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'prensa' && (
            <div className="space-y-6 animate-fade-in max-w-2xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Sala de Conferencias Oficial
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Responde a los cuestionamientos directos de los reporteros deportivos. Tus declaraciones moldearán el vestuario, el prestigio institucional y tu estatus frente a la hinchada.
                </p>
              </div>

              {pressResponseState === 'asking' && playerProfile.lastPressAnsweredWeek === playerProfile.currentWeek ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3 text-center">
                  <div className="inline-flex p-3 rounded-full bg-slate-800/60 border border-slate-700 text-slate-400 mb-1">
                    <Radio size={24} />
                  </div>
                  <h3 className="text-sm font-black text-white px-2">Ya atendiste a la prensa esta semana.</h3>
                  <p className="text-3xs text-slate-400 font-mono">Los reporteros vuelven la semana que viene con nuevas preguntas.</p>
                </div>
              ) : pressResponseState === 'asking' ? (
                <div className={`bg-slate-900 border rounded-3xl shadow-xl relative overflow-hidden ${PRESS_QUESTIONS_POOL[selectedPressQ].mediaColor}`}>

                  {/* Backdrop tipo "step and repeat" de rueda de prensa real, detrás del encabezado */}
                  <div className="absolute inset-x-0 top-0 h-28 overflow-hidden pointer-events-none select-none">
                    <div className="flex flex-wrap gap-x-6 gap-y-4 -rotate-6 -translate-x-6 -translate-y-3 opacity-[0.08] whitespace-nowrap">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span key={i} className="text-2xs font-black uppercase tracking-widest text-white">
                          ★ FutStarzz
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative p-6 space-y-4">
                    <div className="flex items-start gap-3.5">
                      {PRESS_QUESTIONS_POOL[selectedPressQ].reporterAvatarImg ? (
                        <img
                          src={PRESS_QUESTIONS_POOL[selectedPressQ].reporterAvatarImg}
                          alt={PRESS_QUESTIONS_POOL[selectedPressQ].reporter || PRESS_QUESTIONS_POOL[selectedPressQ].mediaName}
                          className="w-16 h-16 shrink-0 rounded-2xl object-cover border-2 border-black/40 shadow-lg"
                        />
                      ) : (
                        <span className="text-2xl bg-black/40 w-16 h-16 shrink-0 rounded-2xl border-2 border-black/40 shadow-lg flex items-center justify-center">
                          {PRESS_QUESTIONS_POOL[selectedPressQ].reporterAvatar}
                        </span>
                      )}
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-black text-white leading-tight truncate">
                          {PRESS_QUESTIONS_POOL[selectedPressQ].reporter || PRESS_QUESTIONS_POOL[selectedPressQ].mediaName}
                        </p>
                        <p className="text-3xs font-mono font-bold uppercase tracking-wider truncate opacity-80 mt-0.5">
                          {PRESS_QUESTIONS_POOL[selectedPressQ].mediaName}
                        </p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-black/30 text-3xs font-mono font-black uppercase tracking-wider max-w-full truncate">
                          {PRESS_QUESTIONS_POOL[selectedPressQ].context}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-white italic leading-relaxed pt-1">
                      "{PRESS_QUESTIONS_POOL[selectedPressQ].question}"
                    </h3>

                    <div className="space-y-2.5 pt-1">
                      {PRESS_QUESTIONS_POOL[selectedPressQ].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handlePressAnswer(opt)}
                          className="btn-fx-subtle w-full p-4 rounded-xl border border-slate-800 bg-slate-950 text-left text-xs text-slate-300 hover:border-gold-500/40 hover:bg-slate-900 hover:text-white transition-all font-medium py-3.5 cursor-pointer"
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pie de marca, como el zocalo de una transmision en vivo */}
                  <div className="relative flex items-center justify-center gap-2 py-2.5 border-t border-white/5 bg-black/20">
                    <Radio size={11} className="opacity-50" />
                    <span className="text-3xs font-mono font-black uppercase tracking-[0.2em] text-slate-500">
                      FutStarzz 2026
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-gold-500/20 rounded-3xl p-6 shadow-xl space-y-4 text-center">
                  <div className="inline-flex p-3 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 mb-2">
                    <CheckCircle size={28} />
                  </div>
                  <h3 className="text-base font-black text-white px-2">
                    {pressReaction}
                  </h3>
                  <p className="text-3xs text-slate-400 font-mono">
                    Los indicadores de reputación se han recalculado en función de tus declaraciones públicas.
                  </p>

                  <p className="text-3xs text-slate-500 font-mono uppercase pt-2">
                    Ya usaste tu conferencia de esta semana — volvé la semana que viene por la próxima.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'traspasos' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Oficina de Contratos y Representaciones
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Revisa las propuestas de los clubes interesados en tu perfil deportivo para la temporada {getRealDate(playerProfile.currentWeek).getFullYear()}. Tu margen de negociación salarial y los bonos de fichaje se expanden a la par de tu Prestigio general.
                </p>
              </div>

              {/* Tu club bajó a segunda: el jugador tiene que poder decidir a conciencia si se
                  queda a pelear el ascenso o se va. Sin este aviso el descenso pasaba en silencio. */}
              {miClubDescendio && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-xs text-red-200 leading-relaxed">
                  <strong className="block text-red-300 mb-1">📉 {currentClub.name} descendió a la B</strong>
                  Los clubes de primera preguntan por vos. Podés irte a seguir en la máxima categoría,
                  o quedarte a devolver al club donde estaba — la hinchada no olvida al que se queda.
                </div>
              )}

              {(() => {
                const windowOpen = isTransferWindowOpen(playerProfile.currentWeek);
                if (windowOpen) {
                  return (
                    <div className="px-4 py-2.5 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-bold flex items-center gap-2">
                      <RefreshCw size={13} /> Ventana de fichajes ABIERTA — puedes concretar traspasos esta semana.
                    </div>
                  );
                }
                const weeksLeft = weeksUntilTransferWindow(playerProfile.currentWeek);
                return (
                  <div className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold flex items-center gap-2">
                    <RefreshCw size={13} /> Mercado de fichajes CERRADO — vuelve a abrir en {weeksLeft} semana{weeksLeft !== 1 ? 's' : ''}. Podés revisar ofertas, pero no concretarlas hasta entonces.
                  </div>
                );
              })()}

              <div className="space-y-3">
                {transferOffers.map(offer => {
                  const getLeagueFlagText = (lg: string) => {
                    switch (lg) {
                      case 'Colombiana': return '🇨🇴 COL';
                      case 'Brasileña': return '🇧🇷 BRA';
                      case 'Argentina': return '🇦🇷 ARG';
                      case 'Inglesa': return '🏴_󠁧󠁢󠁥󠁮󠁧󠁿 ENG';
                      case 'Española': return '🇪🇸 ESP';
                      case 'Alemana': return '🇩🇪 GER';
                      case 'Italiana': return '🇮🇹 ITA';
                      case 'Francesa': return '🇫🇷 FRA';
                      case 'Holandesa': return '🇳🇱 NED';
                      case 'Portuguesa': return '🇵🇹 POR';
                      case 'MLS (EE.UU.)': return '🇺🇸 USA';
                      case 'Mexicana': return '🇲🇽 MEX';
                      case 'Uruguaya': return '🇺🇾 URU';
                      case 'Ecuatoriana': return '🇪🇨 ECU';
                      case 'Chilena': return '🇨🇱 CHI';
                      default: return '⚽ INT';
                    }
                  };

                  return (
                    <div 
                      key={offer.club.id} 
                      className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all bg-slate-900 border-slate-800 ${!offer.possible ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <ClubBadge club={offer.club} size={44} className="rounded-xl border border-slate-800 bg-slate-950 shadow-inner" />
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="font-extrabold text-sm text-white truncate max-w-[170px] sm:max-w-[250px]">
                              {offer.club.name}
                            </h3>
                            <span className="text-3xs bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-slate-400 font-mono">
                              {getLeagueFlagText(offer.club.league)}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase text-3xs ${
                              offer.club.division === 2 ? 'bg-burgundy-500/10 text-burgundy-500 border border-burgundy-500/10' : 'bg-gold-500/10 text-gold-400 border border-gold-500/10'
                            }`}>
                              {offer.club.division === 2 ? '2ª Div' : '1ª Div'}
                            </span>
                          </div>
                          <p className="text-3xs text-slate-400">
                            <strong>Mánager:</strong> {offer.club.dt} · {offer.club.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-between w-full md:w-auto items-center md:items-end mt-4 md:mt-0 gap-4">
                        <div className="text-left md:text-right font-mono text-xs">
                          <span className="text-slate-500 block text-3xs font-bold uppercase">Oferta Salarial</span>
                          <span className="text-gold-400 font-bold block">${offer.salaryOffer.toLocaleString()} / sem</span>
                          <span className="text-burgundy-500 text-3xs block">Prima por Firma: +${offer.signOnBonus.toLocaleString()}</span>
                        </div>

                        <div>
                          {!offer.possible ? (
                            <span className="inline-block py-1 px-2.5 rounded bg-slate-950 text-slate-500 text-3xs font-bold border border-slate-800">
                              Rendimiento Insuficiente (Mín: {offer.reqPrestige})
                            </span>
                          ) : !isTransferWindowOpen(playerProfile.currentWeek) ? (
                            <span className="inline-block py-1 px-2.5 rounded bg-slate-950 text-slate-500 text-3xs font-bold border border-slate-800">
                              Mercado Cerrado
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro de concretar el fichaje con ${offer.club.name} por un salario semanal de $${offer.salaryOffer}? Recibirás un bono de firma inmediato de $${offer.signOnBonus}.`)) {
                                  onAcceptTransfer(offer.club.id, offer.signOnBonus);
                                }
                              }}
                              className="btn-fx py-1.5 px-3.5 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-black text-2xs uppercase tracking-wider cursor-pointer"
                            >
                              Aceptar Traspaso
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tienda' && (
            <div className="space-y-6 animate-fade-in max-w-5xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Boutique de Estilo de Vida
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Invierte el capital neto de tus contratos semanales en lujos exclusivos de alta gama. Cada activo desbloquea mejoras permanentes automáticas en la recuperación de estamina, rendimiento físico o ingresos extra.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {lifestyleItems.map(item => {
                  const isAffordable = playerProfile.capital >= item.cost;
                  return (
                    <div
                      key={item.id}
                      className={`group rounded-2xl border overflow-hidden transition-all flex flex-col ${
                        item.purchased
                          ? 'border-burgundy-500/40 bg-slate-900 shadow-lg shadow-burgundy-950/10'
                          : 'border-slate-800 bg-slate-950/40 hover:border-gold-500/30'
                      }`}
                    >
                      <div className="relative h-36 shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-3xl">💎</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
                        <span className="absolute bottom-2 left-3 text-sm font-black text-white drop-shadow-lg leading-tight pr-3">
                          {item.name}
                        </span>
                        {item.purchased && (
                          <span className="absolute top-2 right-2 inline-flex gap-1 items-center px-2 py-0.5 rounded bg-gold-500 text-slate-950 font-mono text-3xs font-black uppercase shadow">
                            Adquirido
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1 gap-2.5">
                        <p className="text-3xs text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                        <p className="text-3xs text-gold-400 font-mono font-bold uppercase leading-relaxed">
                          ✨ Ventaja: {item.perkText}
                        </p>

                        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                          <span className="text-sm font-black font-mono text-white">
                            ${item.cost.toLocaleString()}
                          </span>

                          {item.purchased ? (
                            <span className="text-3xs text-slate-500 font-mono uppercase">Ya es tuyo</span>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm(`¿Deseas adquirir "${item.name}" por $${item.cost.toLocaleString()}?`)) {
                                  onBuyItem(item.id);
                                }
                              }}
                              disabled={!isAffordable}
                              className={`btn-fx-subtle py-1.5 px-3.5 rounded-lg text-3xs font-black uppercase tracking-wider transition-all ${
                                isAffordable
                                  ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 hover:from-gold-300 hover:to-gold-500 cursor-pointer'
                                  : 'bg-slate-950 text-slate-500 border border-slate-800 cursor-not-allowed'
                              }`}
                            >
                              Adquirir
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'patrocinios' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Ofertas de Patrocinio
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Las marcas te contactan a ti, no al revés: cuanto más lejos llegue tu fama, más y mejores ofertas te van a llegar. Aceptar un patrocinio no cuesta nada — al contrario, te paga una prima de firma inmediata.
                </p>
              </div>

              {(() => {
                const activeSponsorships = sponsorDeals.filter(i => i.purchased).length;
                const capReached = activeSponsorships >= MAX_ACTIVE_SPONSORSHIPS;
                return (
                  <div className={`px-4 py-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${capReached ? 'bg-burgundy-500/10 border-burgundy-500/20 text-burgundy-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                    <DollarSign size={13} /> Patrocinios activos: {activeSponsorships}/{MAX_ACTIVE_SPONSORSHIPS}
                    {capReached ? ' — agenda comercial completa, espera a liberar un cupo.' : ''}
                  </div>
                );
              })()}

              <div className="grid md:grid-cols-2 gap-4">
                {sponsorDeals.map(item => {
                  // Cuánta fama (Fans) hace falta para que esta marca se fije en vos -- proporcional
                  // al tamaño del contrato, así los grandes patrocinios de verdad se sienten ganados.
                  const reqFans = Math.min(95, Math.round(item.cost / 3000));
                  const isEligible = playerProfile.fans >= reqFans;
                  const activeSponsorships = sponsorDeals.filter(i => i.purchased).length;
                  const blockedByCap = !item.purchased && activeSponsorships >= MAX_ACTIVE_SPONSORSHIPS;
                  return (
                    <div
                      key={item.id}
                      className={`group rounded-2xl border overflow-hidden transition-all flex flex-col ${
                        item.purchased
                          ? 'border-burgundy-500/40 bg-slate-900 shadow shadow-burgundy-950/10'
                          : 'border-slate-800 bg-slate-950/40'
                      }`}
                    >
                      <div className="relative h-28 shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600">
                            <Handshake size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <span className="absolute bottom-2 left-3 text-sm font-black text-white drop-shadow-lg leading-tight pr-3">
                          {item.name}
                        </span>
                        {item.purchased && (
                          <span className="absolute top-2 right-2 inline-flex gap-1 items-center px-2 py-0.5 rounded bg-burgundy-500 text-slate-950 font-mono text-3xs font-black uppercase shadow">
                            Activo
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1 gap-3 sm:flex-row sm:justify-between sm:items-start">
                        <div className="space-y-2 sm:max-w-[65%]">
                          <p className="text-3xs text-slate-400 leading-relaxed">
                            {item.description}
                          </p>
                          <p className="text-3xs text-gold-400 font-mono font-bold uppercase leading-relaxed">
                            Ventaja: {item.perkText}
                          </p>
                        </div>

                        <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto sm:text-right gap-3">
                          <div className="text-right font-mono">
                            <span className="text-3xs text-slate-500 block uppercase">Prima de Firma</span>
                            <span className="text-xs font-black text-gold-400 block">+${item.cost.toLocaleString()}</span>
                          </div>

                          <div className="sm:mt-2 flex flex-col items-end gap-1.5">
                            {item.purchased ? (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Rescindir el contrato con "${item.name}"? Perderás sus ventajas (incluido cualquier ingreso pasivo) y tu Prestigio cae un poco por romper el acuerdo antes de tiempo.`)) {
                                    onCancelSponsor(item.id);
                                  }
                                }}
                                className="btn-fx-subtle py-1 px-2 rounded-lg text-3xs font-bold uppercase tracking-wider text-red-400 border border-red-500/20 hover:bg-red-950/30 cursor-pointer"
                              >
                                Cancelar Contrato
                              </button>
                            ) : blockedByCap ? (
                              <span className="inline-block py-1 px-2.5 rounded bg-slate-950 text-slate-500 text-3xs font-bold border border-slate-800">
                                Cupo de Patrocinios Lleno
                              </span>
                            ) : !isEligible ? (
                              <span className="inline-block py-1 px-2.5 rounded bg-slate-950 text-slate-500 text-3xs font-bold border border-slate-800">
                                Fama Insuficiente (Mín: {reqFans})
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Aceptar la oferta de "${item.name}"? Vas a recibir $${item.cost.toLocaleString()} de inmediato.`)) {
                                    onAcceptSponsor(item.id);
                                  }
                                }}
                                className="btn-fx-subtle py-1.5 px-3 rounded-lg text-3xs font-black uppercase tracking-wider bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 hover:from-gold-300 hover:to-gold-500 cursor-pointer"
                              >
                                Aceptar Patrocinio
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tablas' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Panel de Competiciones Oficiales
                </h2>
                {/* Genérico a propósito: este panel lo ve tanto un club sudamericano como uno
                    europeo, así que no puede nombrar una copa puntual ni un año fijo. */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  Monitorea las fases de tus competiciones y la situación clasificatoria actual.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 flex-wrap">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-gold-400 flex items-center gap-2">
                      <Table size={13} /> TABLA DE POSICIONES
                    </h3>
                    {/* En Colombia y Argentina la tabla se reinicia a mitad de año: sin este rótulo
                        no había forma de saber si lo que se ve es el Apertura o el Clausura, y una
                        tabla que "volvía a cero" parecía un bug. */}
                    {torneoEnCurso && (
                      <p className="text-3xs text-slate-500 font-mono uppercase tracking-wide mt-1">
                        {torneoEnCurso}
                      </p>
                    )}
                  </div>
                  <select
                    value={selectedLeagueKey}
                    onChange={(e) => setTablesLeagueOverride(e.target.value === myLeagueKey ? null : e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg text-2xs font-bold text-white py-1 px-2 focus:outline-none focus:border-gold-500"
                  >
                    {allLeagueKeys.map(key => {
                      const sampleClub = ULTIMATE_CLUBS_DATABASE.find(c => leagueKeyFor(c) === key);
                      const label = sampleClub ? `${sampleClub.league}${sampleClub.division && sampleClub.division > 1 ? ` (Div. ${sampleClub.division})` : ''}` : key;
                      return <option key={key} value={key}>{label}</option>;
                    })}
                  </select>
                </div>

                {selectedLeagueTable.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-3xs font-mono text-left">
                      <thead>
                        <tr className="text-slate-500 uppercase border-b border-slate-800">
                          <th className="py-1.5 pr-2">#</th>
                          <th className="py-1.5 pr-2">Equipo</th>
                          <th className="py-1.5 px-1.5 text-center">PJ</th>
                          <th className="py-1.5 px-1.5 text-center">G</th>
                          <th className="py-1.5 px-1.5 text-center hidden sm:table-cell">E</th>
                          <th className="py-1.5 px-1.5 text-center">P</th>
                          <th className="py-1.5 px-1.5 text-center hidden sm:table-cell">GF</th>
                          <th className="py-1.5 px-1.5 text-center hidden sm:table-cell">GC</th>
                          <th className="py-1.5 pl-1.5 text-center">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLeagueTable.map((row, idx) => (
                          <tr
                            key={row.clubId || row.name}
                            className={`border-b border-slate-900/40 ${row.clubId === currentClub.id ? 'text-gold-400 font-bold' : 'text-slate-300'}`}
                          >
                            <td className="py-1.5 pr-2">{idx + 1}</td>
                            <td className="py-1.5 pr-2 truncate max-w-[110px] sm:max-w-[140px]">{row.name}</td>
                            <td className="py-1.5 px-1.5 text-center">{row.pj}</td>
                            <td className="py-1.5 px-1.5 text-center">{row.g}</td>
                            <td className="py-1.5 px-1.5 text-center hidden sm:table-cell">{row.e}</td>
                            <td className="py-1.5 px-1.5 text-center">{row.p}</td>
                            <td className="py-1.5 px-1.5 text-center hidden sm:table-cell">{row.gf}</td>
                            <td className="py-1.5 px-1.5 text-center hidden sm:table-cell">{row.gc}</td>
                            <td className="py-1.5 pl-1.5 text-center font-black">{row.puntos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-2xs text-slate-500">Todavía no hay datos de la tabla para esta liga.</p>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gold-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Award size={13} /> ESTADÍSTICAS DE JUGADORES · {selectedLeagueName.toUpperCase()}
                </h3>
                {(() => {
                  const stats: { icon: string; label: string; entry: { name: string; clubName: string } | null; value: string | null }[] = [
                    { icon: '⚽', label: 'Máximo Goleador', entry: selectedLeagueLeaders.topScorer, value: selectedLeagueLeaders.topScorer ? `${selectedLeagueLeaders.topScorer.value} goles` : null },
                    { icon: '🎯', label: 'Máximo Asistidor', entry: selectedLeagueLeaders.topAssist, value: selectedLeagueLeaders.topAssist ? `${selectedLeagueLeaders.topAssist.value} asistencias` : null },
                    { icon: '🧤', label: 'Portería Menos Vencida', entry: selectedLeagueLeaders.topGoalkeeper, value: null },
                    { icon: '🟨', label: 'Más Amarillas', entry: selectedLeagueLeaders.topYellow, value: selectedLeagueLeaders.topYellow ? `${selectedLeagueLeaders.topYellow.value} amarillas` : null },
                    { icon: '🟥', label: 'Más Rojas', entry: selectedLeagueLeaders.topRed, value: selectedLeagueLeaders.topRed ? `${selectedLeagueLeaders.topRed.value} rojas` : null },
                  ];
                  return (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {stats.map(s => (
                        <div key={s.label} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center gap-3">
                          <span className="text-xl shrink-0">{s.icon}</span>
                          {s.entry ? (
                            <div className="min-w-0">
                              <p className="text-3xs uppercase font-mono text-slate-500 font-bold">{s.label}</p>
                              <h4 className="font-bold text-xs text-white truncate">{s.entry.name}</h4>
                              <p className="text-3xs text-gold-400 font-mono font-bold">
                                {s.entry.clubName ? `${s.entry.clubName}${s.value ? ' · ' : ''}` : ''}{s.value ?? ''}
                              </p>
                            </div>
                          ) : (
                            <div className="min-w-0">
                              <p className="text-3xs uppercase font-mono text-slate-500 font-bold">{s.label}</p>
                              <p className="text-3xs text-slate-600 italic">Sin datos disponibles.</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
                {conmebolCup ? (
                  <>
                    <h3 className="text-xs font-black uppercase tracking-widest text-burgundy-500 border-b border-slate-800 pb-2 flex items-center gap-2">
                      🏆 {conmebolCup.cupId === 'libertadores' ? 'COPA LIBERTADORES' : 'COPA SUDAMERICANA'} {conmebolCup.year} · {cupStageLabel(conmebolCup.stage)}
                    </h3>
                    {conmebolCup.stage === 'groups' ? (
                      <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
                        {conmebolCup.groups.map(group => (
                          <div key={group.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl">
                            <h4 className="font-extrabold text-white border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between text-2xs uppercase">
                              <span>Grupo {group.id}</span>
                              <span className="text-burgundy-500">🏆</span>
                            </h4>
                            <ul className="space-y-1.5 text-slate-300 font-mono text-3xs">
                              {sortTable(group.table).map((row, idx) => (
                                <li key={row.clubId || row.name} className="flex justify-between border-b border-slate-900/40 pb-0.5">
                                  <span className={row.clubId === currentClub.id ? 'text-gold-400 font-bold' : ''}>
                                    {idx + 1}. {row.name}
                                  </span>
                                  <span className="text-slate-500">{row.puntos} Pts</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : conmebolCup.stage === 'done' ? (
                      <p className="text-2xs text-slate-300">🏆 Campeón: <strong className="text-white">{clubNameById(conmebolCup.championId)}</strong></p>
                    ) : (
                      <p className="text-2xs text-slate-400">Tu club sigue en carrera en la fase eliminatoria. Los cruces se resuelven semana a semana en tu calendario.</p>
                    )}
                  </>
                ) : uefaCup ? (
                  <>
                    <h3 className="text-xs font-black uppercase tracking-widest text-burgundy-500 border-b border-slate-800 pb-2 flex items-center gap-2">
                      🏆 {uefaCup.cupId === 'champions' ? 'UEFA CHAMPIONS LEAGUE' : 'UEFA EUROPA LEAGUE'} {uefaCup.year} · {cupStageLabel(uefaCup.stage)}
                    </h3>
                    {uefaCup.stage === 'league_phase' ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-3xs font-mono text-left">
                          <thead>
                            <tr className="text-slate-500 uppercase border-b border-slate-800">
                              <th className="py-1.5 pr-2">#</th>
                              <th className="py-1.5 pr-2">Equipo</th>
                              <th className="py-1.5 px-1.5 text-center">PJ</th>
                              <th className="py-1.5 px-1.5 text-center">G</th>
                              <th className="py-1.5 px-1.5 text-center hidden sm:table-cell">E</th>
                              <th className="py-1.5 px-1.5 text-center">P</th>
                              <th className="py-1.5 pl-1.5 text-center">Pts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortTable(uefaCup.table).map((row, idx) => (
                              <tr key={row.clubId || row.name} className={`border-b border-slate-900/40 ${row.clubId === currentClub.id ? 'text-gold-400 font-bold' : 'text-slate-300'}`}>
                                <td className="py-1.5 pr-2">{idx + 1}</td>
                                <td className="py-1.5 pr-2 truncate max-w-[110px] sm:max-w-[140px]">{row.name}</td>
                                <td className="py-1.5 px-1.5 text-center">{row.pj}</td>
                                <td className="py-1.5 px-1.5 text-center">{row.g}</td>
                                <td className="py-1.5 px-1.5 text-center hidden sm:table-cell">{row.e}</td>
                                <td className="py-1.5 px-1.5 text-center">{row.p}</td>
                                <td className="py-1.5 pl-1.5 text-center font-black">{row.puntos}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="text-3xs text-slate-500 mt-2">Top 8 avanza directo a octavos · 9º-24º juega el playoff · el resto queda eliminado.</p>
                      </div>
                    ) : uefaCup.stage === 'done' ? (
                      <p className="text-2xs text-slate-300">🏆 Campeón: <strong className="text-white">{clubNameById(uefaCup.championId)}</strong></p>
                    ) : (
                      <p className="text-2xs text-slate-400">Tu club sigue en carrera en {uefaCup.stage === 'playoff' ? 'el playoff' : 'la fase eliminatoria'}, a ida y vuelta. Los cruces se resuelven semana a semana en tu calendario.</p>
                    )}
                  </>
                ) : (
                  <p className="text-2xs text-slate-500">Tu club no está clasificado a ningún torneo continental esta temporada.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'calendario' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Calendario de Partidos
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tus próximos partidos ubicados en la fecha real del calendario. Este fixture no se regenera ni cambia: se respeta tal cual hasta el final de la competición.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCalendarMonthOffset(m => m - 1)}
                    className="btn-fx-subtle w-8 h-8 rounded-full bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center justify-center cursor-pointer"
                    title="Mes anterior"
                  >
                    ‹
                  </button>
                  <h3 className="font-black uppercase text-sm text-white tracking-wide">
                    {CALENDAR_MONTH_NAMES[calendarGridMonth]} <span className="text-slate-500 font-normal">{calendarGridYear}</span>
                  </h3>
                  <button
                    onClick={() => setCalendarMonthOffset(m => m + 1)}
                    className="btn-fx-subtle w-8 h-8 rounded-full bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center justify-center cursor-pointer"
                    title="Mes siguiente"
                  >
                    ›
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[560px]">
                    <div className="grid grid-cols-7 gap-1 text-3xs font-mono uppercase text-center text-slate-500 mb-1">
                      {CALENDAR_WEEKDAY_NAMES.map(d => <div key={d} className="py-1">{d}</div>)}
                    </div>
                    <div className="space-y-1">
                      {calendarWeeks.map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7 gap-1">
                          {week.map((day, di) => (
                            <div
                              key={di}
                              className={`min-h-[68px] rounded-lg p-1.5 ${
                                day
                                  ? (calendarEventsByDay.get(day) || []).some(e => e.esHoy)
                                    // El partido que te toca AHORA: sin esto la tarjeta decia
                                    // "Libertadores" y en el calendario no se distinguia cual de
                                    // todos era, que es de donde salia la confusion.
                                    ? 'bg-gold-950/40 border-2 border-gold-500'
                                    : 'bg-slate-950 border border-slate-850'
                                  : ''
                              }`}
                            >
                              {day && (
                                <>
                                  <span className="text-3xs font-mono flex items-center justify-between">
                                    <span className={(calendarEventsByDay.get(day) || []).some(e => e.esHoy) ? 'text-gold-400 font-black' : 'text-slate-500'}>{day}</span>
                                    {(calendarEventsByDay.get(day) || []).some(e => e.esHoy) && (
                                      <span className="text-[7px] font-black text-gold-400 tracking-wide">HOY</span>
                                    )}
                                  </span>
                                  <div className="space-y-0.5 mt-0.5">
                                    {(calendarEventsByDay.get(day) || []).map((ev, ei) => {
                                      const resultColorClass = ev.result === 'V'
                                        ? 'bg-gold-700 text-white'
                                        : ev.result === 'D'
                                        ? 'bg-red-700 text-white'
                                        : 'bg-slate-700 text-white';
                                      return (
                                        <div
                                          key={ei}
                                          title={ev.sublabel}
                                          className={`relative flex items-center gap-1 text-[9px] leading-tight font-black rounded pl-1 pr-3 py-0.5 truncate ${ev.played ? resultColorClass : ev.colorClass}`}
                                        >
                                          {ev.opponentClub ? (
                                            <ClubBadge club={ev.opponentClub} size={11} className="rounded-sm shrink-0" />
                                          ) : (
                                            <span className="shrink-0">⚽</span>
                                          )}
                                          <span className="truncate">{ev.played ? `${ev.result} ${ev.score}` : ev.label}</span>
                                          <span className="absolute -top-1 -right-1 bg-slate-950 border border-slate-800 rounded-full min-w-[13px] h-[13px] px-0.5 flex items-center justify-center text-[6px] text-slate-300 font-mono leading-none">
                                            {ev.label.replace(/[^0-9]/g, '') || '•'}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-800 text-3xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-gold-600 inline-block" /> Liga ({currentClub.league})</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-burgundy-500 inline-block" /> Copa Continental</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-600 inline-block" /> Playoffs</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-gold-700 inline-block" /> Ya jugado: V</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-700 inline-block" /> E</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-700 inline-block" /> D</span>
                </div>
              </div>

              {calendarEvents.length === 0 && (
                <p className="text-2xs text-slate-500">No hay más partidos programados por ahora para tu club.</p>
              )}
            </div>
          )}

          {activeTab === 'logros' && (
            <div className="space-y-6 animate-fade-in max-w-5xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2 flex items-center gap-2">
                  <Trophy size={20} className="text-gold-400" /> Logros
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Desbloqueaste {Object.keys(playerProfile.unlockedAchievements).length} de {ACHIEVEMENTS_DATABASE.length} logros. Cada uno te da un premio chico en capital al cumplirlo.
                </p>
              </div>

              {(['carrera', 'partido', 'personal'] as const).map(category => {
                const categoryLabel = category === 'carrera' ? '📈 Carrera' : category === 'partido' ? '⚡ Partido Puntual' : '❤️ Vida Personal';
                const categoryAchievements = ACHIEVEMENTS_DATABASE.filter(a => a.category === category);
                return (
                  <div key={category} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                      {categoryLabel}
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryAchievements.map(achievement => {
                        const unlockedWeek = playerProfile.unlockedAchievements[achievement.id];
                        const isUnlocked = unlockedWeek !== undefined;
                        return (
                          <div
                            key={achievement.id}
                            className={`p-3 rounded-2xl border flex items-center gap-3 ${
                              isUnlocked
                                ? 'bg-gold-950/10 border-gold-500/30'
                                : 'bg-slate-950/60 border-slate-800 opacity-60'
                            }`}
                          >
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                              isUnlocked ? 'bg-slate-950 border-gold-500/30' : 'bg-slate-900 border-slate-800'
                            }`}>
                              {isUnlocked ? achievement.icon : <Lock size={16} className="text-slate-600" />}
                            </div>
                            <div className="min-w-0">
                              <h4 className={`font-bold text-xs leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                {achievement.name}
                              </h4>
                              <p className="text-3xs text-slate-500 leading-snug mt-0.5">
                                {achievement.description}
                              </p>
                              <span className={`text-3xs font-mono font-bold block mt-1 ${isUnlocked ? 'text-gold-400' : 'text-slate-600'}`}>
                                {isUnlocked ? `Desbloqueado · Semana ${unlockedWeek}` : `Recompensa: $${achievement.reward.toLocaleString()}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'mi_club' && (() => {
            // Corregido: ya no dependemos de soccerDatabase (solo 3 clubes de prueba).
            // Buscamos la plantilla real del club explorado (el tuyo por defecto, o cualquier otro
            // vía el selector) dentro de los 32,000 jugadores del JSON.
            const viewedClub = rosterClubIdOverride
              ? ULTIMATE_CLUBS_DATABASE.find(c => c.id === rosterClubIdOverride) ?? currentClub
              : currentClub;
            const rosterClub = getClubWithRoster(viewedClub.name, viewedClub.id);
            const plantillaCruda = rosterClub?.plantilla || { porteros: [], defensivos: [], ofensivos: [] };

            // Los retiros del mundo (ver worldRetirements.ts) se llevan jugadores de
            // los planteles temporada a temporada. Esta pestaña lee playersDatabase.json,
            // que es una foto fija de 2026 y no sabe nada de eso: sin filtrar, seguiría
            // mostrando a gente que ya colgó los botines hace 10 temporadas.
            const retiradosDelClub = new Set(
              Object.keys(playerProfile.retiredWorldPlayers?.[viewedClub.id] ?? {})
                .map(n => displayName(n).replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase())
            );
            const sigueActivo = (p: { nombre_completo?: string }) => {
              const n = (p.nombre_completo ?? '').trim().toLowerCase();
              if (!n || retiradosDelClub.size === 0) return true;
              // Comparación por apellido además de nombre completo: las fuentes escriben
              // al mismo jugador distinto ("Luis Muriel" vs "Luis Fernando Muriel").
              const ap = n.split(/\s+/).slice(-1)[0];
              for (const r of retiradosDelClub) {
                if (r === n) return false;
                if (ap.length > 3 && r.endsWith(' ' + ap) && r.split(/\s+/)[0] === n.split(/\s+/)[0]) return false;
              }
              return true;
            };
            const plantilla = {
              porteros: plantillaCruda.porteros.filter(sigueActivo),
              defensivos: plantillaCruda.defensivos.filter(sigueActivo),
              ofensivos: plantillaCruda.ofensivos.filter(sigueActivo),
            };
            const totalJugadoresReales = plantilla.porteros.length + plantilla.defensivos.length + plantilla.ofensivos.length;
            const isViewingOwnClub = viewedClub.id === currentClub.id;

            return (
              <div className="space-y-6 animate-fade-in max-w-5xl">
                {/* Compacto a proposito: este bloque y el de mentoria empujaban la lista de
                    jugadores ~600px hacia abajo y obligaban a scrollear para ver el plantel. */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <ClubBadge club={viewedClub} size={40} className="rounded-lg border border-slate-800 bg-slate-950 shadow-inner" />
                    <div>
                      <span className="text-3xs font-mono font-bold uppercase tracking-widest text-gold-400">
                        {viewedClub.league}
                      </span>
                      <h2 className="text-lg font-black text-white leading-tight">{viewedClub.name}</h2>
                      <p className="text-3xs text-slate-400">
                        {'★'.repeat(viewedClub.reputation)} · ${viewedClub.marketValue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 min-w-[240px] space-y-2">
                    <div>
                      {/* La liga no se repite: ya está arriba, junto al nombre del club. */}
                      <span className="text-3xs text-burgundy-500 uppercase font-mono font-black block">DT</span>
                      <h4 className="font-bold text-xs text-white">{viewedClub.dt}</h4>
                      <div className="text-3xs text-slate-400 font-mono space-y-0.5">
                        <p>💵 ${viewedClub.initialSalary.toLocaleString()}/sem</p>
                        {isViewingOwnClub && <p>📋 ${playerProfile.appearanceBonus.toLocaleString()}/partido</p>}
                      </div>
                    </div>
                    <div>
                      <label className="text-3xs text-slate-500 uppercase font-mono font-black block mb-0.5">Explorar otro club</label>
                      <select
                        value={viewedClub.id}
                        onChange={(e) => setRosterClubIdOverride(e.target.value === currentClub.id ? null : e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg text-2xs font-bold text-white py-1.5 px-2 focus:outline-none focus:border-gold-500"
                      >
                        <option value={currentClub.id}>{currentClub.name} (Tu club)</option>
                        {ULTIMATE_CLUBS_DATABASE.filter(c => c.id !== currentClub.id).map(c => (
                          <option key={c.id} value={c.id}>{c.name} · {c.league}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {!isViewingOwnClub && (
                  <div className="p-3 rounded-xl border border-gold-500/20 bg-gold-500/5 text-2xs text-gold-300 leading-relaxed">
                    👀 Estás mirando la plantilla de <strong>{viewedClub.name}</strong> solo de consulta. Volvé a "{currentClub.name} (Tu club)" en el selector para gestionar tu mentoría.
                  </div>
                )}

                {isViewingOwnClub && <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
                  {(() => {
                    const eligibleMentees = squadOf(currentClub).filter(p => p !== playerProfile.name && getMenteeAge(currentClub.id, p, seasonsElapsed(playerProfile.currentWeek)) <= MENTEE_MAX_AGE);
                    return (
                      <>
                        {/* Título y botones en la MISMA fila, y la explicación larga solo si hay a
                            quién mentorear: sin juveniles este bloque gastaba media pantalla para
                            decir "Ninguno". */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="text-3xs font-black uppercase tracking-widest text-slate-400 mr-1">
                            🌱 Mentoría
                          </h3>
                          <button
                            type="button"
                            onClick={() => onSelectMentee(null)}
                            className={`btn-fx-subtle py-1.5 px-3 text-2xs font-bold rounded-lg border transition-all ${
                              !playerProfile.mentorshipPlayerName
                                ? 'border-gold-500 bg-gold-950/30 text-white shadow-sm'
                                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            Ninguno
                          </button>
                          {eligibleMentees.map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => onSelectMentee(p)}
                              className={`btn-fx-subtle py-1.5 px-3 text-2xs font-bold rounded-lg border transition-all ${
                                playerProfile.mentorshipPlayerName === p
                                  ? 'border-gold-500 bg-gold-950/30 text-white shadow-sm'
                                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                              }`}
                            >
                              {displayName(p)}
                            </button>
                          ))}
                        </div>
                        {eligibleMentees.length === 0 && (
                          <p className="text-2xs text-slate-500 mt-2 italic">
                            Ningún jugador del plantel tiene {MENTEE_MAX_AGE} años o menos esta temporada: no puedes ser mentor de nadie por ahora.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>}

                {/* El mensaje viejo era una nota técnica para el desarrollador -- hablaba del JSON,
                    de playersDatabase y del "Excel de origen" -- y no le decía nada al jugador.
                    Ahora simplemente avisa que ese plantel todavía no está cargado. */}
                {totalJugadoresReales === 0 && (
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-2xs text-slate-400 leading-relaxed">
                    📋 La plantilla de <strong className="text-slate-300">{viewedClub.name}</strong> todavía no está disponible.
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5 flex justify-between items-center">
                      <span>🧤 Porteros (GK)</span>
                      <span className="text-3xs font-mono text-gold-400 font-normal">{plantilla.porteros.length}</span>
                    </h3>
                    <div className="space-y-1">
                      {plantilla.porteros.length > 0 ? plantilla.porteros.map(player => (
                        <div key={player.player_id} className="px-2 py-1.5 bg-slate-950 border border-slate-850 rounded-lg flex justify-between items-center gap-2">
                          <div>
                            <h4 className="font-bold text-2xs text-white flex items-center gap-1 leading-tight truncate">
                              {player.nombre_completo}
                              {ROSTER_ENRICHMENT[player.player_id]?.dorsal != null && (
                                <span className="text-3xs font-mono text-slate-500">#{ROSTER_ENRICHMENT[player.player_id].dorsal}</span>
                              )}
                            </h4>
                            <span className="text-3xs text-slate-500 font-mono uppercase">
                              {player.posicion_especifica} · €{player.valor_mercado_eur?.toLocaleString()}
                              {ROSTER_ENRICHMENT[player.player_id]?.nationality && ` · ${ROSTER_ENRICHMENT[player.player_id].nationality}`}
                            </span>
                          </div>
                          <span className="text-xs font-black font-mono text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/10">{player.media_valoracion}</span>
                        </div>
                      )) : (
                        <p className="text-3xs text-slate-500 italic px-1">Sin datos disponibles.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5 flex justify-between items-center">
                      <span>🧱 Defensivos (DF)</span>
                      <span className="text-3xs font-mono text-gold-400 font-normal">{plantilla.defensivos.length}</span>
                    </h3>
                    <div className="space-y-1">
                      {plantilla.defensivos.length > 0 ? plantilla.defensivos.map(player => (
                        <div key={player.player_id} className="px-2 py-1.5 bg-slate-950 border border-slate-850 rounded-lg flex justify-between items-center gap-2">
                          <div>
                            <h4 className="font-bold text-2xs text-white flex items-center gap-1 leading-tight truncate">
                              {player.nombre_completo}
                              {ROSTER_ENRICHMENT[player.player_id]?.dorsal != null && (
                                <span className="text-3xs font-mono text-slate-500">#{ROSTER_ENRICHMENT[player.player_id].dorsal}</span>
                              )}
                            </h4>
                            <span className="text-3xs text-slate-500 font-mono uppercase">
                              {player.posicion_especifica} · €{player.valor_mercado_eur?.toLocaleString()}
                              {ROSTER_ENRICHMENT[player.player_id]?.nationality && ` · ${ROSTER_ENRICHMENT[player.player_id].nationality}`}
                            </span>
                          </div>
                          <span className="text-xs font-black font-mono text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/10">{player.media_valoracion}</span>
                        </div>
                      )) : (
                        <p className="text-3xs text-slate-500 italic px-1">Sin datos disponibles.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5 flex justify-between items-center">
                      <span>🎯 Ofensivos (OF)</span>
                      <span className="text-3xs font-mono text-gold-400 font-normal">{plantilla.ofensivos.length}</span>
                    </h3>
                    <div className="space-y-1">
                      {plantilla.ofensivos.length > 0 ? plantilla.ofensivos.map(player => (
                        <div key={player.player_id} className="px-2 py-1.5 bg-slate-950 border border-slate-850 rounded-lg flex justify-between items-center gap-2">
                          <div>
                            <h4 className="font-bold text-2xs text-white flex items-center gap-1 leading-tight truncate">
                              {player.nombre_completo}
                              {ROSTER_ENRICHMENT[player.player_id]?.dorsal != null && (
                                <span className="text-3xs font-mono text-slate-500">#{ROSTER_ENRICHMENT[player.player_id].dorsal}</span>
                              )}
                            </h4>
                            <span className="text-3xs text-slate-500 font-mono uppercase">
                              {player.posicion_especifica} · €{player.valor_mercado_eur?.toLocaleString()}
                              {ROSTER_ENRICHMENT[player.player_id]?.nationality && ` · ${ROSTER_ENRICHMENT[player.player_id].nationality}`}
                            </span>
                          </div>
                          <span className="text-xs font-black font-mono text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/10">{player.media_valoracion}</span>
                        </div>
                      )) : (
                        <p className="text-3xs text-slate-500 italic px-1">Sin datos disponibles.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

        </div>

      </main>

    </div>
  );
}