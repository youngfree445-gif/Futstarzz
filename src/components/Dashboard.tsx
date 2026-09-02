import React, { useState, useEffect, useMemo } from 'react';
import { useNumeroQueCuenta } from '../animaciones';
import { COMFORT_ZONE_YEARS_THRESHOLD, RINDE_EN_ZONA_DE_CONFORT, TRAINING_ENERGY_COST, cuestaEntrenar, rindeEntrenar } from '../entrenamiento';
import { apodoDe } from '../apodo';
import { laHemerotecaTeRecuerda } from '../hemeroteca';
import { clasicoPersonalContra } from '../clasicoPersonal';
import { loQueDiceDeVos } from '../elPibe';
import { CAMISETAS_CON_DUENO } from '../laCamiseta';
import { BarraDeSecciones, BarraDeAtajos, soloEnSeccion } from './BarraDeSecciones';
import { BarraDeApp, COLCHON_DE_LA_FICHA } from './BarraDeApp';
import { HexagonoDeAtributos } from './HexagonoDeAtributos';
import { ResumenDeCompeticiones } from './ResumenDeCompeticiones';
import { tablaDeFondo } from '../ligasDeFondo';
import { BarraDeEstado } from './BarraDeEstado';
import { SelectorDeDorsal } from './SelectorDeDorsal';
import { dorsalesOcupados } from '../laCamiseta';
import { estorboDelRival, promedioDelRival } from '../rivalDePuesto';
import { PlayerProfile, Club, ShopItem, TableTeam, Position, PlayerStats, TwoLegTie, PlayoffMatch } from '../types';
// Corregido: Importamos ULTIMATE_CLUBS_DATABASE y getClubWithRoster en lugar de soccerDatabase (que solo tenía 3 clubes de prueba hardcodeados)
import { ULTIMATE_CLUBS_DATABASE, CLUBS_DATABASE, PRESS_QUESTIONS_POOL, getClubWithRoster, MAX_ACTIVE_SPONSORSHIPS, WORLD_CUP_TEAMS_DATABASE, NATIONALITY_TO_WORLD_CUP_TEAM_ID, ACHIEVEMENTS_DATABASE, REAL_TRANSFER_POOL, REAL_LEAGUE_LEADERS, INJURY_LABELS, ROLES_DATABASE, AGENTS_DATABASE, INVESTMENTS_DATABASE } from '../data';
import { ROSTER_ENRICHMENT } from '../rosterEnrichment';
import { PLAYER_ENRICHMENT } from '../playerEnrichment';
import { TM_SQUAD_ENRICHMENT } from '../tmSquadEnrichment';
import { applySquadRetirements, MENTEE_MAX_AGE, MENTOR_MIN_AGE, ATTRIBUTE_MAX, puedeTenerMentor, getSquadPlayerAge, displayName } from '../worldRetirements';
import { torneoDeSeleccionesDelDia, jornadaDeLiga, fechaDelPaso as fechaDelPasoCal, anioDeCarrera, anioDelPaso, calendarioDeLigaAgotado, quedanFechasDeSeleccion, diasHastaElMercado, enVentanaDelMundial, mercadoAbierto, pasosDeMundialTranscurridos, esDiaDeCopa, fechaDelPaso, fechasDeCopaTranscurridas, fixturesAtStep, fixturesForClub, hasDatedLeagueSchedule, hasDatedSchedule, pasoDeFecha, pickPrimary as pickDatedPrimary, rondaDeCopaEnElCalendario, rotuloDeTemporada, temporadaDeCarrera, temporadaDelPaso, torneoDeFecha, torneoDelClubEnFecha } from '../dateSchedule';
import { formatDate, formatDateShort } from '../careerTimeline';
import { resolverClubDeCalendario } from '../clubAliases';
import { getLeagueDisplay, rondaEnEspanol } from '../leagueDisplay';
import { crearCopaNacional, cruceActual, nombreCopaNacional, piernaDelCruce, rondaActual, sigueEnCopa, tieneCopaNacionalReal } from '../copaNacional';
import { getPalmares } from '../palmares';
import { esClasico } from '../clasicos';
import { anotarEnLideres, claveDeCompeticion, lideresDe } from '../lideresPorCompeticion';
import { lineasDeCopa, partidosDeCopaConmebol, partidosDeCopaNacional, partidosDeCopaUefa } from '../lideresDeCopa';
import ReportarBug from './ReportarBug';
import { rivalDeRelleno, resolverRivalDeLaFecha, seleccionesDelMundialDe, estaEnElCuadrangular, cruceDeEliminatoriasHoy, torneoDeSeleccionesDeHoy, bajoALaSudamericana, claveDeCopaNacional, copaContinentalDelJugador, cruceDeCopaNacionalHoy, cuadrangularDeHoy, duenoDelDiaDeCopa, grupoRealDelCalendario, laCopaContinentalLaLlevaElCuadro, laNacionalTieneCruce, repescadosDeLaLibertadores } from '../decisionDelDia';
import { mesesQueFaltanEnElClub, radarDeInteres, rendimientoDe, requisitosDe } from '../transferMarket';
import { clubesDeLiga, clubesJugables } from '../clubesJugables';
import { NOMBRE_UEFA_EN_EL_CALENDARIO } from '../copasUefa';
import { postsDelBajon, postsDelRivalDeCarrera, postsDelPartido, postsDelBalonDeOro, comentariosDeRuedaDePrensa, postsDeEliminacion, postsDeRefuerzo, postsDeListaDeTransferibles, postsDePreviaDeClasico, postsDeLesion, postsDeConvocatoria, postsDeForma, publicacionesDisponibles, respuestasAMiPublicacion, type OpcionDePublicacion, postsDelBautizo, postsDeHemeroteca, postsDeClasicoPersonal, postsDelPibe,
} from '../chutSocialVoces';
import { precargarAmbiente } from '../ambienteDelPartido';
import { forzandoLaVuelta, riesgoDeRecaida, PENALIDAD_ATRIBUTOS_LESIONADO } from '../lesion';
import { evaluarConvocatoria, laNomina, motivoDeAusencia, convocadoAlMundial, motivoDeAusenciaDelMundial } from '../convocatoria';
import { evaluarForma, rotuloDeForma, VENTANA_DE_FORMA, NOTA_BUENA, NOTA_MALA, AJUSTE_DE_FORMA } from '../forma';
import { estaEnBajon, faltaParaSalida, motivoDelBajon, SALIDAS, SalidaDelBajon } from '../animo';
import { rachasDelProximoPartido } from '../rachas';
import { numerosDelRival, quienVaGanando, rivalDeCarrera, rotuloDeLaComparacion } from '../rivalDeCarrera';
import {
  leagueKeyFor, sortTable,
  getLibertadoresParticipants, getSudamericanaParticipants, getConcacafParticipants, getOrCreateCupState, getUpcomingCupMatch,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState, getUpcomingUefaCupMatch,
  isClubStillInCup, isClubStillInUefaCup, partidosQueLeQuedanEnLaCopa,
  getOrCreateWorldCupState, getUpcomingWorldCupMatch, WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD, WORLD_CUP_CALLUP_MIN_MATCHES, isWorldCupYear,
  isApeturaClausuraLeague, getOrCreateSeasonForLeague, generateLeagueLeadersFromTable,
  CAREER_START_YEAR, roundLabelByMatchCount, crucePlayoffDeLiga, sigueEnPlayoffDeLiga, rondaDelPlayoff, rondaDeCopaUefa, rondaDeCopaContinental
} from '../leagueEngine';
import {
  User, Award, Dumbbell, Send, Radio, RefreshCw, ShoppingBag,
  Table, Zap, DollarSign, Star, Heart, Flame, Swords, LogOut, ArrowRight, FastForward, BarChart3, CheckCircle,
  ShieldAlert, Sparkles, MessageCircle, TrendingUp, HelpCircle, Brain, Calendar, Handshake, Trophy, Lock, Users,
  Menu, X, Home, Globe
} from 'lucide-react';
import ClubBadge from './ClubBadge';
import SeasonComparisonChart from './SeasonComparisonChart';
import { generateWorldRanking } from '../worldRanking';
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

/**
 * EL COLOR DE CADA TORNEO en la grilla del calendario.
 *
 * Antes eran dos: dorado para la liga y borgoña para "lo demás". Con eso, la Copa MX, la Concacaf,
 * la Libertadores y el cuadrangular se pintaban todos iguales, y encima el rótulo de las copas
 * decía "Copa" a secas -- así que un mes entero de celdas borgoña con la misma palabra no decía
 * nada. Pedido: "no diga copa y ya, sino que diga copa mx o concacaf (...) y agranda el color del
 * torneo, que no sea sólo la línea de color".
 *
 * Son FAMILIAS, no un color por copa: un club juega una sola copa internacional por año, así que
 * Libertadores, Sudamericana, Concacaf, Champions y Europa nunca conviven en el mismo calendario y
 * no hay nada que distinguir entre ellas. Lo que sí conviven -- liga, cuadrangular, copa nacional y
 * copa internacional -- tiene cada una la suya. El NOMBRE del torneo va escrito adentro igual.
 *
 * `celda` tiñe el día entero y `pastilla` pinta el bloque: ese es el "color más grande".
 */
const COLOR_DE_TORNEO = {
  liga:        { pastilla: 'bg-gold-500 text-slate-950',    celda: 'bg-gold-500/10',     punto: 'bg-gold-500' },
  playoff:     { pastilla: 'bg-burgundy-500 text-white',    celda: 'bg-burgundy-500/10', punto: 'bg-burgundy-500' },
  nacional:    { pastilla: 'bg-emerald-600 text-white',     celda: 'bg-emerald-600/10',  punto: 'bg-emerald-600' },
  continental: { pastilla: 'bg-sky-600 text-white',         celda: 'bg-sky-600/10',      punto: 'bg-sky-600' },
  seleccion:   { pastilla: 'bg-slate-200 text-slate-950',   celda: 'bg-slate-200/10',    punto: 'bg-slate-200' },
  // El día que el calendario apartó para una copa en la que ya no estás. Apagado a propósito: es
  // la única celda que no es un partido.
  libre:       { pastilla: 'bg-slate-800 text-slate-400',   celda: 'bg-slate-900/40',    punto: 'bg-slate-800' },
} as const;

type FamiliaDeTorneo = keyof typeof COLOR_DE_TORNEO;

interface CalendarEvent {
  date: Date;
  label: string; // nombre corto del torneo, el que se lee dentro de la celda ("Copa MX", "Clausura")
  sublabel: string; // texto completo "vs./@ Rival", usado como tooltip
  colorClass: string;
  cellClass: string; // el tinte del día entero, del mismo color que la pastilla
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

/**
 * Temporadas transcurridas desde el inicio de la carrera, para envejecer al mundo.
 *
 * Ojo: esto estaba MAL y devolvía siempre 0. Decía `getSeasonYear(week) - CAREER_START_YEAR`, o
 * sea "1 menos 2026" -- una temporada (1, 2, 3...) restándole un año (2026), dos magnitudes que no
 * se pueden restar. Con el máximo contra 0, el resultado era 0 siempre, así que los compañeros de
 * plantel no envejecían nunca para la mentoría: uno de 30 seguía leyéndose 30 cinco temporadas
 * después. Salió a la luz al sacar getSeasonYear.
 */
const seasonsElapsed = (clubName: string, paso: number) =>
  Math.max(0, temporadaDeCarrera(clubName, paso) - 1);

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
  onSelectMentor: (playerName: string | null) => void;
  onVisitarEntorno: () => void;
  onSalirDelBajon: (id: SalidaDelBajon) => void;
  onFindGirlfriend: () => void;
  onGirlfriendFlowers: () => void;
  onGirlfriendPhoto: () => void;
  onGirlfriendFaithful: () => void;
  onGirlfriendCheat: () => void;
  onGirlfriendDenyRumors: () => void;
  onGirlfriendMoveIn: (accept: boolean) => void;
  onPropose: () => void;
  onHaveChild: () => void;
  onTreatInjury: (choice: 'fast' | 'natural' | 'forzar') => void;
  onSelectRole: (roleId: string | null) => void;
  onRefreshTransferOffers: () => void;
  onHireAgent: (agentId: string | 'familia') => void;
  onFireAgent: () => void;
  onRequestRenewal: () => void;
  onLoanOut: (clubId: string) => void;
  onResolveLoan: (buyOption: boolean) => void;
  onBuyInvestment: (investmentId: string) => void;
  onReconvertPosition: (newPosition: Position) => void;
  onBuyItem: (itemId: string) => void;
  onAcceptSponsor: (itemId: string) => void;
  onCancelSponsor: (itemId: string) => void;
  onLaunchPRCampaign: (cost: number, fansBonus: number, prestigeBonus: number, salaryBonus?: number) => void;
  // El TEXTO viaja junto con los numeros: sin el, lo que dijiste no se puede guardar, y la rueda de
  // prensa se queda siendo un tramite contable (ver src/hemeroteca.ts).
  onAnswerPress: (prestigeChange: number, fansChange: number, energyChange: number, texto: string) => void;
  /** Publicar en ChutSocial. Una por fecha; las opciones salen de publicacionesDisponibles. */
  onPublicar: (opcion: OpcionDePublicacion) => void;
  onAcceptTransfer: (clubId: string, signOnBonus: number, newDorsal: number) => void;
  onAdvanceWeek: () => void;
  /** Juega el partido solo, con vos en cancha. Ver autoSimular en MatchSimulator.tsx. */
  onSimularPartido: () => void;
  /** Última fecha real del año jugada, con todo cerrado: dispara el periódico de nueva temporada. */
  onFinalizeSeason: () => void;
  onRecoverEnergy: (cost: number, energyAmount: number) => void;
  onSocialInteraction: () => void;
  onLogout: () => void;
  onResetGame: () => void;
  /**
   * Pestaña con la que abre el Dashboard. Sólo la usa scripts/validar_pantallas.jsx; en el juego
   * nadie la pasa y abre en 'carrera' como siempre.
   *
   * Existe porque el validador dibujaba SOLO la pestaña inicial, así que las otras diez -- el feed,
   * la prensa, los traspasos, las tablas -- no las comprobaba nadie. Se descubrió al agregar la
   * lista de convocados: el caso pasaba en verde y la lista no se estaba dibujando.
   */
  initialTab?: SeccionKey;
  /**
   * EL PEDIDO DE ABRIR LA PESTAÑA DEL CLUB, al terminar la ceremonia de un fichaje.
   *
   * Es un contador y no un booleano ni una clave: lo que importa es que CAMBIÓ, no cuánto vale.
   * Con un booleano el segundo fichaje de la carrera no abriría nada (el valor ya estaba en true),
   * y con `initialTab` tampoco alcanzaba, porque ése se lee una sola vez al montar el dashboard y
   * el dashboard nunca se desmonta.
   */
  abrirEnMiClub?: number;
}

/** Las tres columnas de Mi Carrera. En celular se ve una por vez (ver BarraDeSecciones). */
/**
 * Los cuatro segmentos de Mi Carrera en celular.
 *
 * Lo que se HACE no está acá: el partido, la lesión y el bajón se ven siempre, porque tienen
 * botones y una decisión detrás de una pestaña es una decisión que el jugador no toma.
 */
type SeccionDeCarrera = 'ficha' | 'rival' | 'ranking' | 'historia';

/** Los tres grupos del plantel. En celular se ve uno por vez. */
type PuestoDelPlantel = 'porteros' | 'defensas' | 'ofensivos';

type SeccionKey =
  | 'carrera' | 'mi_club' | 'entrenamiento' | 'chutsocial' | 'prensa' | 'traspasos'
  | 'tienda' | 'patrocinios' | 'tablas' | 'calendario' | 'logros';

// Las pestañas de la barra lateral, en el orden en que se muestran. Estaban escritas una por una
// como once botones idénticos salvo ícono y rótulo, así que cualquier cambio transversal --el alto
// mínimo táctil, el anillo de foco, los roles de accesibilidad-- había que repetirlo once veces y
// alcanzaba con olvidarse de uno para que quedara desparejo.
const SECCIONES: readonly { key: SeccionKey; label: string; Icon: typeof User }[] = [
  { key: 'carrera',       label: 'Mi Carrera',       Icon: User },
  { key: 'mi_club',       label: 'Plantilla de Club', Icon: Sparkles },
  { key: 'entrenamiento', label: 'Entrenamiento',    Icon: Dumbbell },
  { key: 'chutsocial',    label: 'ChutSocial',       Icon: Send },
  { key: 'prensa',        label: 'Sala de Prensa',   Icon: Radio },
  { key: 'traspasos',     label: 'Traspasos',        Icon: RefreshCw },
  { key: 'tienda',        label: 'Tienda de Lujos',  Icon: ShoppingBag },
  { key: 'patrocinios',   label: 'Patrocinios',      Icon: Award },
  { key: 'tablas',        label: 'Copas y Tablas',   Icon: Table },
  { key: 'calendario',    label: 'Calendario',       Icon: Calendar },
  { key: 'logros',        label: 'Logros',           Icon: Trophy },
];

export default function Dashboard({
  playerProfile,
  shopItems,
  onTrainAttribute,
  onSelectMentee,
  onSelectMentor,
  onVisitarEntorno,
  onSalirDelBajon,
  onFindGirlfriend,
  onGirlfriendFlowers,
  onGirlfriendPhoto,
  onGirlfriendFaithful,
  onGirlfriendCheat,
  onGirlfriendDenyRumors,
  onGirlfriendMoveIn,
  onPropose,
  onHaveChild,
  onTreatInjury,
  onSelectRole,
  onRefreshTransferOffers,
  onHireAgent,
  onFireAgent,
  onRequestRenewal,
  onLoanOut,
  onResolveLoan,
  onBuyInvestment,
  onReconvertPosition,
  onBuyItem,
  onAcceptSponsor,
  onCancelSponsor,
  onLaunchPRCampaign,
  onAnswerPress,
  onPublicar,
  onAcceptTransfer,
  onAdvanceWeek,
  onSimularPartido,
  onFinalizeSeason,
  onRecoverEnergy,
  onSocialInteraction,
  onLogout,
  onResetGame,
  initialTab,
  abrirEnMiClub
}: DashboardProps) {
  /**
   * QUE SE MIRA EN "Copas y Tablas": una sola cosa por vez.
   *
   * Antes se dibujaban las tres una debajo de la otra con unos atajos arriba que hacian scroll. En
   * un monitor eso ya era una pantalla de varios metros, y en un telefono peor. Pedido: pestañas de
   * verdad -- Liga, Copa, Cracks -- que muestren SOLO lo elegido, en PC y en celular.
   */
  const [seccionElegida, setSeccionDeTablas] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SeccionKey>(initialTab ?? 'carrera');

  // Al terminar la presentación en el club nuevo, el juego te deja en la plantilla de tu club:
  // el pase termina donde empieza el trabajo. Se dispara sólo cuando el contador cambia, así que
  // no le pisa la pestaña a nadie que esté navegando.
  useEffect(() => {
    if (abrirEnMiClub) setActiveTab('mi_club');
  }, [abrirEnMiClub]);
  // En móvil el menú arranca cerrado. La barra lateral es `w-full` en pantallas chicas, así que las
  // once pestañas se desplegaban enteras ARRIBA del contenido: había que hacer scroll por todas
  // antes de ver los atributos o el botón de jugar. En md+ no aplica -- la barra es una columna al
  // costado y el menú se muestra siempre.
  const [navAbiertoEnMovil, setNavAbiertoEnMovil] = useState(false);
  const [pressResponseState, setPressResponseState] = useState<'asking' | 'answered'>('asking');
  const [pressReaction, setPressReaction] = useState('');
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  // Pestaña Traspasos: dorsal elegido para el club nuevo, uno por vez -- se pisa si el jugador
  // cambia de oferta antes de confirmar. clubId null = todavía no eligió dorsal para nadie.
  const [pendingTransferClubId, setPendingTransferClubId] = useState<string | null>(null);
  const [pendingTransferDorsal, setPendingTransferDorsal] = useState(10);
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

  // Las ofertas de mercado se refrescan al abrir la pestaña de Traspasos, no en cada render (ver
  // refreshTransferOffersIfNeeded en transferMarket.ts) -- el handler ya chequea si currentWeek
  // cambió desde la última generación antes de tocar el estado, así que reabrir la pestaña en la
  // misma semana no genera un set nuevo.
  useEffect(() => {
    if (activeTab === 'traspasos') onRefreshTransferOffers();
  }, [activeTab, playerProfile.currentWeek]);

  // Corregido: Busca el club en la base de datos inyectada con el JSON
  const currentClub = ULTIMATE_CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;

  // Plantel de un club con los retiros del mundo ya aplicados (ver worldRetirements.ts): quien se
  // retiró aparece reemplazado por su canterano. Hay que usar esto en vez de `club.starPlayers`
  // en todo lo que se muestre al jugador, o el feed seguiría hablando de gente que ya no juega.
  const squadOf = (club: Club) =>
    applySquadRetirements(club.id, club.starPlayers, playerProfile.retiredWorldPlayers);

  /** Igual que squadOf pero con los nombres listos para mostrar (sin marca de debut). */
  const squadNames = (club: Club) => squadOf(club).map(displayName);
  // La sesión más barata que el jugador puede pagar hoy: como el precio sube con el nivel, "no me
  // alcanza" recién es cierto cuando no alcanza ni para el atributo más flojo. Si están todos al
  // máximo queda Infinity y el aviso no aparece, que es lo correcto.
  const sesionMasBarata = Math.min(...(['ritmo', 'regate', 'tiro', 'defensa', 'pase', 'fisico'] as (keyof PlayerStats)[])
    .filter(k => playerProfile.attributes[k] < ATTRIBUTE_MAX)
    .map(k => cuestaEntrenar(playerProfile.attributes[k], currentClub.reputation)));

  // El costo y el rendimiento de cada sesión dependen del nivel del atributo, así que se preguntan
  // por atributo más abajo. Antes esta pantalla tenía su propia copia de la fórmula ("misma que
  // handleTrainAttribute en App.tsx"), que es exactamente como el botón termina prometiendo una cosa
  // y el motor haciendo otra: ahora las dos preguntan a entrenamiento.ts.

  // Fase 2.5 -- Rivalidad generacional: nivel actual (el hito más alto ya alcanzado) y progreso
  // hacia el próximo, según CAREER_MILESTONES.
  const careerContribution = playerProfile.careerStats.golesHistoricos + playerProfile.careerStats.asistenciasHistoricos;
  const currentMilestoneIdx = CAREER_MILESTONES.reduce((bestIdx, m, i) => careerContribution >= m.threshold ? i : bestIdx, 0);
  const currentMilestone = CAREER_MILESTONES[currentMilestoneIdx];
  const nextMilestone = CAREER_MILESTONES[currentMilestoneIdx + 1] || null;
  const milestoneProgressPct = nextMilestone
    ? Math.min(100, Math.round(((careerContribution - currentMilestone.threshold) / (nextMilestone.threshold - currentMilestone.threshold)) * 100))
    : 100;
  // Fase 7 -- Modo "leyenda del club": derivado de seasonHistory filtrado por el club actual, sin
  // campo nuevo en el perfil (el cálculo es liviano, no hace falta cachear). Umbral doble --
  // partidos O goles -- para que un defensor longevo también pueda ser leyenda sin necesitar la
  // cifra de gol de un delantero.
  const LEGEND_MATCHES_THRESHOLD = 150;
  const LEGEND_GOALS_THRESHOLD = 80;
  const statsEnClubActual = playerProfile.seasonHistory
    .filter(s => s.clubId === playerProfile.currentClubId)
    .reduce((acc, s) => ({ partidos: acc.partidos + s.partidos, goles: acc.goles + s.goles }), { partidos: 0, goles: 0 });
  const esLeyendaDelClub = statsEnClubActual.partidos >= LEGEND_MATCHES_THRESHOLD || statsEnClubActual.goles >= LEGEND_GOALS_THRESHOLD;

  const myLeagueKey = leagueKeyFor(currentClub);
  /**
   * LA TABLA CON LA QUE SE SIEMBRA EL CUADRANGULAR, la MISMA que usa App al armar el partido.
   *
   * Aca se leia `leagueSeasons?.[myLeagueKey]?.table ?? []`, y ese `?? []` es el bug: la clave es
   * `liga-division`, asi que un ascenso o un descenso la RENUEVA y la entrada todavia no existe.
   * App no tiene ese problema porque siempre pasa por getOrCreateSeasonForLeague, que arma la tabla
   * inicial cuando falta.
   *
   * Con las dos leyendo distinto, en un dia de cuadrangular la tarjeta decia "rival aun sin sortear"
   * -- honesto, no inventa -- mientras el motor sembraba el cuadro con la tabla en cero, donde el
   * orden es arbitrario y el club puede quedar afuera de los ocho. Nadie ofrecia partido y el dia se
   * perdia. Visto con el Junior y con el Platense.
   *
   * getOrCreateSeasonForLeague es pura -- devuelve un objeto, no toca nada -- asi que llamarla
   * mientras se dibuja es seguro.
   */
  const tablaParaElCuadrangular = playerProfile.leagueSeasons?.[myLeagueKey]?.table
    ?? getOrCreateSeasonForLeague(clubesDeLiga(myLeagueKey), undefined, playerProfile.currentWeek).table;
  const myLeagueTable = sortTable(playerProfile.leagueSeasons[myLeagueKey]?.table || []);

  // Todas las ligas del juego disponibles para explorar en la pestaña Tablas (no solo la del
  // jugador), agrupadas por leagueKey (liga+división) -- ver tablesLeagueOverride arriba.
  const allLeagueKeys = Array.from(new Set(ULTIMATE_CLUBS_DATABASE.map(c => leagueKeyFor(c)))).sort();
  const selectedLeagueKey = tablesLeagueOverride ?? myLeagueKey;
  const selectedLeagueClubs = clubesDeLiga(selectedLeagueKey);
  // LA TABLA DE LA LIGA QUE ESTÁS MIRANDO, con tres orígenes y en este orden:
  //
  //   1. Si es LA TUYA, la de tu partida: ahí mandan tus resultados de verdad.
  //   2. Si es una en la que JUGASTE antes, la guardada: es tu historia, aunque haya quedado
  //      congelada el día que te fuiste.
  //   3. Si nunca la tocaste, se juega de fondo (ver src/ligasDeFondo.ts). Antes este caso devolvía
  //      una tabla nueva con los veinte equipos en cero, y encima no se guardaba: la próxima vez se
  //      volvía a crear igual de vacía. Reportado: "puedo ver las tablas de otras ligas pero todas
  //      me salen en 0".
  //
  // El caso 3 es DETERMINISTA y no ocupa un byte del save: el marcador de cada partido de fondo sale
  // de `fecha|local|visitante`, así que la tabla de la Premier de tu carrera es idéntica la mires
  // cuando la mires. El useMemo es sólo para no rehacer 380 partidos en cada render.
  const tablaDeFondoDeHoy = useMemo(() => {
    if (selectedLeagueKey === myLeagueKey) return null;
    if (playerProfile.leagueSeasons[selectedLeagueKey]) return null;
    if (!selectedLeagueClubs.length) return null;
    const hoy = fechaDelPasoCal(currentClub.name, playerProfile.currentWeek);
    if (!hoy) return null;
    return tablaDeFondo(selectedLeagueClubs, hoy, temporadaDeCarrera(currentClub.name, playerProfile.currentWeek));
  }, [selectedLeagueKey, myLeagueKey, selectedLeagueClubs, currentClub.name, playerProfile.currentWeek, playerProfile.leagueSeasons]);

  const selectedLeagueTable = selectedLeagueKey === myLeagueKey
    ? myLeagueTable
    : tablaDeFondoDeHoy
      ?? (selectedLeagueClubs.length > 0
        ? sortTable(getOrCreateSeasonForLeague(selectedLeagueClubs, playerProfile.leagueSeasons[selectedLeagueKey], playerProfile.currentWeek).table)
        : []);
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
    const anio = anioDeCarrera(currentClub.name, playerProfile.currentWeek);
    // En playoffs se nombra la RONDA concreta ("Semifinal", "Final"), no un "Playoffs" genérico:
    // el jugador llegaba a la final del Apertura sin que nada le dijera en qué instancia estaba.
    // La ronda se deriva de cuántas llaves quedan vivas (ver roundLabelByMatchCount).
    // Acá se nombraba la ronda del cuadrangular leyendo los cuadros internos de la temporada. Nunca
    // se llenaron (ver LeagueSeasonState en types.ts) y `stage` tampoco se setea para una liga, así
    // que esto devolvía null siempre. La ronda del cuadrangular la muestra la tarjeta del próximo
    // partido, que la saca de playoffsDeLiga -- el cuadro que sí se juega.
    const fase = season.stage === 'done' ? ' · Finalizado' : '';
    return `${nombre} ${anio}${fase}`;
  })();
  // Los datos de REAL_LEAGUE_LEADERS son una foto de la temporada real previa al inicio de la
  // carrera, así que solo valen para la PRIMERA temporada: sirven de punto de partida creíble
  // (arrancás viendo a Muriel goleador, como en la vida real). De la segunda en adelante manda
  // lo que pasó en TU carrera, o el panel se quedaría congelado en 2026 para siempre mostrando
  // goleadores que ya se retiraron.
  // temporadaDeCarrera devuelve el NÚMERO de temporada (1, 2, 3...), no el año. Comparado contra
  // CAREER_START_YEAR (2026) daba false SIEMPRE, así que la foto real de goleadores no se usaba
  // nunca -- ni siquiera en la primera temporada, que es justo para lo que está.
  const isFirstSeason = temporadaDeCarrera(currentClub.name, playerProfile.currentWeek) === 1;
  const selectedLeagueLeaders = (isFirstSeason ? REAL_LEAGUE_LEADERS[selectedLeagueName] : undefined)
    ?? generateLeagueLeadersFromTable(selectedLeagueClubs, selectedLeagueTable, playerProfile.retiredWorldPlayers);


  // Copa continental real que le corresponde al club actual (si clasifica a alguna).
  const cupYear = temporadaDeCarrera(currentClub.name, playerProfile.currentWeek);
  // Los cupos de la temporada 2 en adelante salen de la tabla del año anterior y de los campeones
  // vigentes; hay que pasarlos también acá o esta pantalla mostraría una copa distinta de la que el
  // motor está jugando de fondo.
  const cupPosiciones = playerProfile.posicionesFinales;
  const cupCampeones = {
    libertadores: playerProfile.campeonesContinentales?.[`libertadores-${cupYear - 1}`] ?? null,
    sudamericana: playerProfile.campeonesContinentales?.[`sudamericana-${cupYear - 1}`] ?? null,
  };
  // La CONCACAF entra por la misma puerta que las dos de Conmebol: comparte CupState, cuadro y
  // pantalla. Faltaba, y por eso un club mexicano no tenia copa continental para esta pantalla: la
  // tarjeta del proximo partido le anunciaba Copa MX en dias que el partido jugaba Concacaf, y el
  // panel de la copa no mostraba su cuadro. Encontrado con Tigres.
  // Cual es TU copa lo contesta decisionDelDia, no esta pantalla: desde el repechaje la respuesta
  // cambia a mitad de ano -- el tercero de un grupo de Libertadores baja a la Sudamericana -- y dos
  // derivaciones que se desincronicen serian un cartel anunciando una copa y un partido de la otra.
  const conmebolCupId = copaContinentalDelJugador(
    playerProfile, currentClub, ULTIMATE_CLUBS_DATABASE, cupYear, cupPosiciones, cupCampeones);
  const conmebolCup = conmebolCupId
    // currentClub.id frena la copa antes de un partido pendiente del jugador. Sin eso, el Dashboard
    // adelantaba el torneo de fondo con sólo mirarlo: la tabla de grupos mostraba fechas que el
    // jugador todavía no jugó, y peor, ese estado adelantado quedaba guardado.
    ? getOrCreateCupState(conmebolCupId, cupYear, ULTIMATE_CLUBS_DATABASE, playerProfile.continentalCups[`${conmebolCupId}-${cupYear}`], fechasDeCopaTranscurridas(currentClub.name, playerProfile.currentWeek, true,
          // El nombre importa: sin el se cuentan las fechas de las DOS copas continentales y el
          // Medellin, que juega Libertadores y despues cae a la Sudamericana, coronaba su
          // Libertadores en agosto.
          conmebolCupId === 'libertadores' ? 'Copa Libertadores'
            : conmebolCupId === 'concacaf' ? 'Concacaf Champions Cup' : 'Copa Sudamericana'), cupPosiciones, cupCampeones, currentClub.id,
        // El grupo del jugador sale del CALENDARIO, que es de donde salen sus seis partidos. Sin
        // esto esta pantalla dibujaba el grupo que sorteo el motor -- otros rivales -- y el jugador
        // lo vio: "en copas y tablas muestra un grupo distinto al que juego".
        conmebolCupId === 'concacaf' ? undefined : grupoRealDelCalendario(
          currentClub, ULTIMATE_CLUBS_DATABASE,
          conmebolCupId === 'libertadores' ? 'Copa Libertadores' : 'Copa Sudamericana',
          cupYear,
          conmebolCupId === 'libertadores'
            ? getLibertadoresParticipants(ULTIMATE_CLUBS_DATABASE, cupYear, cupPosiciones, cupCampeones)
            : getSudamericanaParticipants(ULTIMATE_CLUBS_DATABASE, cupYear, cupPosiciones, cupCampeones),
        ),
        // Los terceros de la Libertadores, que bajan al repechaje de la Sudamericana.
        repescadosDeLaLibertadores(playerProfile, cupYear))
    : null;

  const cupCampeonesUefa = {
    champions: playerProfile.campeonesContinentales?.[`champions-${cupYear - 1}`] ?? null,
    europa: playerProfile.campeonesContinentales?.[`europa-${cupYear - 1}`] ?? null,
  };
  const uefaCupId: 'champions' | 'europa' | null = getChampionsParticipants(ULTIMATE_CLUBS_DATABASE, cupYear, cupPosiciones, cupCampeonesUefa).includes(currentClub.id)
    ? 'champions'
    : getEuropaParticipants(ULTIMATE_CLUBS_DATABASE, cupYear, cupPosiciones, cupCampeonesUefa).includes(currentClub.id)
    ? 'europa'
    : null;
  const uefaCup = uefaCupId
    ? getOrCreateUefaCupState(uefaCupId, ULTIMATE_CLUBS_DATABASE, playerProfile.uefaCups[uefaCupId], fechasDeCopaTranscurridas(currentClub.name, playerProfile.currentWeek, false, NOMBRE_UEFA_EN_EL_CALENDARIO[uefaCupId]), cupPosiciones, cupCampeonesUefa, currentClub.id)
    : null;

  // QUÉ COPA SE JUEGA HOY, cuando el día que trae el calendario es una RESERVA.
  //
  // La bolsa de días de copa es UNA SOLA (ver RESERVAS DE COPA en dateSchedule.ts): el día queda
  // guardado bajo la competición que se lo pidió a la LIGA del club, que no tiene por qué ser la
  // tuya, y quién lo usa se decide recién al llegar. App.tsx lo decide en un orden fijo -- primero
  // la continental, y si esa no tiene cruce para vos, la nacional.
  //
  // Esta pantalla preguntaba otra cosa: el nombre que traía el día. Por eso anunciaba "Copa
  // Libertadores" para un día que después se jugaba como Copa Colombia -- la continental estaba
  // entre rondas y el turno se lo llevaba la nacional. Reportado: "te decía siguiente partido de
  // Copa Libertadores y me metía a uno de Copa Colombia".
  //
  // Se contesta con el MISMO orden y los MISMOS estados de copa que usa App.tsx. Es la única forma
  // de que el cartel y el partido no se contradigan: una sola pregunta, una sola respuesta.
  const copaContinentalDeHoy = (() => {
    if (conmebolCup) {
      const upcoming = getUpcomingCupMatch(conmebolCup, currentClub.id);
      if (upcoming) {
        return {
          nombre: conmebolCupId === 'sudamericana' ? 'Copa Sudamericana'
            : conmebolCupId === 'concacaf' ? 'Concacaf Champions Cup' : 'Copa Libertadores',
          rivalId: upcoming.opponentId, soyLocal: upcoming.isHome,
          // En qué ronda estás. Sin esto la tarjeta rotulaba la copa con la FECHA del partido.
          ronda: rondaDeCopaContinental(conmebolCup, currentClub.id),
        };
      }
    }
    if (uefaCup) {
      const upcoming = getUpcomingUefaCupMatch(uefaCup, currentClub.id);
      if (upcoming) {
        return {
          nombre: uefaCupId === 'europa' ? 'UEFA Europa League' : 'UEFA Champions League',
          rivalId: upcoming.opponentId, soyLocal: upcoming.isHome,
          ronda: rondaDeCopaUefa(uefaCup, currentClub.id),
        };
      }
    }
    return null;
  })();

  // Va DESPUES de conmebolCup a proposito, y esto no es cosmetico.
  //
  // Estaba arriba, antes de que conmebolCupId se declarara, y compDeHoy lo usa adentro de una
  // funcion que se ejecuta en el acto. Un `const` leido antes de su declaracion tira
  // "Cannot access 'X' before initialization" -- zona muerta temporal --, y como pasa durante el
  // render, React desmonta el arbol entero: la pantalla en negro que se reporto jugando con el
  // Santos. En desarrollo no siempre salta; compilado y minificado, siempre.
  // LA TABLA DE LÍDERES SIGUE AL TORNEO QUE JUGÁS HOY.
  //
  // Si hoy es día de Libertadores, el panel muestra los goleadores de la Libertadores; al día
  // siguiente, si toca liga, vuelve a los de la liga. Cada competición lleva la suya y el jugador
  // entra en todas -- sus goles cuentan para ser goleador del torneo, que antes era imposible
  // porque el panel salía de una tabla fija. Ver lideresPorCompeticion.ts.
  //
  // La tabla es POR TEMPORADA: la clave lleva el año de carrera, así que cada temporada arranca en
  // blanco y se llena con los partidos que se vayan jugando.
  const compDeHoy = (() => {
    const paso = hasDatedLeagueSchedule(currentClub.name)
      ? fixturesAtStep(currentClub.name, playerProfile.currentWeek) : null;
    const fx = paso ? pickDatedPrimary(paso.fixtures) : null;
    if (!fx) return null;
    // Día RESERVADO: el nombre que trae el día no dice nada (ver copaContinentalDeHoy). La tabla
    // de goleadores tiene que ser la del torneo que de verdad se juega hoy, o los goles del día se
    // van a contar en la tabla de otra copa.
    if (fx.esReservaDeCuadro && (fx.competition.kind === 'continental_cup' || fx.competition.kind === 'domestic_cup')) {
      return copaContinentalDeHoy?.nombre ?? nombreCopaNacional(currentClub.league);
    }
    // Día con partido REAL de copa continental: desde que el cuadro del motor manda las copas
    // europeas, el rival de ese día lo pone él, así que su tabla de goleadores tiene que ser la
    // MISMA que la de los días reservados. Con el nombre del calendario ("Champions League") y el
    // del motor ("UEFA Champions League") quedaban dos tablas distintas para la misma copa, y los
    // goles del torneo se repartían entre las dos.
    if (fx.competition.kind === 'continental_cup' && copaContinentalDeHoy) {
      return copaContinentalDeHoy.nombre;
    }
    return fx.competition.name;
  })();
  const claveLideresHoy = compDeHoy
    ? claveDeCompeticion(compDeHoy, temporadaDeCarrera(currentClub.name, playerProfile.currentWeek))
    : null;
  // SIEMPRE la tabla de TU carrera, aunque esté vacía. Nunca más la fija.
  //
  // Antes, si la tabla real no tenía goles todavía, el panel caía a REAL_LEAGUE_LEADERS -- datos
  // reales de 2026 con Muriel goleador. La intención era no mostrar un panel vacío, y el efecto fue
  // el contrario del buscado: en una carrera recién creada se veía EXACTAMENTE igual que cuando el
  // bug de las claves tenía la tabla rota, y no habia forma de distinguir "todavía no jugaste" de
  // "esto no funciona". Reportado dos veces, la segunda con una carrera nueva.
  //
  // Ahora lo que se ve es siempre la verdad de tu carrera: vacío al empezar, y poblado desde el
  // primer partido -- con los goleadores de los diez partidos de la fecha, no solo del tuyo.
  // La tabla en sí se arma más abajo (lideresDeHoy), después de los estados de copa: los
  // goleadores de copa salen del cuadro y hasta acá el cuadro todavía no existe.
  const hayLideresDeHoy = !!claveLideresHoy;
  const tituloDeLideres = hayLideresDeHoy && compDeHoy ? compDeHoy : selectedLeagueName;


  // LOS GOLEADORES DE LA COPA SALEN DEL CUADRO, no de un acumulador (ver lideresDeCopa.ts).
  //
  // Hasta acá, la tabla de una copa contaba SOLO los partidos del jugador: los demás cruces de la
  // ronda los resuelve el motor de fondo y no aportaban un gol, así que el goleador de la
  // Libertadores eras vos con dos goles y nadie más figuraba. En la liga eso ya estaba resuelto
  // (los otros nueve partidos de la fecha se reparten en handleMatchComplete), pero una copa avanza
  // en semanas donde no jugás y se termina de golpe cuando quedás eliminado, así que no hay un
  // "momento de la fecha" donde anotarla.
  //
  // Va acá abajo y no junto a claveLideresHoy porque necesita los estados de copa, que se arman
  // unas líneas más arriba. El orden de este archivo no es cosmético: leer algo por encima de su
  // declaración ya costó una pantalla en negro (ver la nota de conmebolCup).
  const lineasDeCopaDeHoy = React.useMemo(() => {
    if (!claveLideresHoy) return [];
    const temporadaHoy = temporadaDeCarrera(currentClub.name, playerProfile.currentWeek);
    const esLaDeHoy = (nombre: string) => claveDeCompeticion(nombre, temporadaHoy) === claveLideresHoy;
    const copaNacionalDeHoy = playerProfile.domesticCups?.[`${currentClub.league}-${temporadaHoy}`];
    const partidos =
      conmebolCup && esLaDeHoy(conmebolCupId === 'libertadores' ? 'Copa Libertadores'
        : conmebolCupId === 'concacaf' ? 'Concacaf Champions Cup' : 'Copa Sudamericana')
        ? partidosDeCopaConmebol(conmebolCup)
      : uefaCup && esLaDeHoy(uefaCupId === 'champions' ? 'UEFA Champions League' : 'UEFA Europa League')
        ? partidosDeCopaUefa(uefaCup)
      : copaNacionalDeHoy && esLaDeHoy(nombreCopaNacional(currentClub.league))
        ? partidosDeCopaNacional(copaNacionalDeHoy)
      : [];
    // CLUBS_DATABASE y no ULTIMATE_CLUBS_DATABASE, y la diferencia se ve en la tabla.
    //
    // ULTIMATE le saca la posición al plantel: donde la base dice 'Rodrigo Rey (GK)', ULTIMATE
    // dice 'Rodrigo Rey' a secas (medido: 453 de 697 clubes con posición en CLUBS_DATABASE, 10 de
    // 1107 en ULTIMATE). Y de esa etiqueta viven las dos reglas del reparto: repartirGoles se queda
    // con los ofensivos, y arqueroDe busca al (GK). Sin ella, el reparto cae al plantel entero y el
    // arquero sale goleador de la Libertadores -- pasó, con Rodrigo Rey y 7 goles -- mientras la
    // portería menos vencida queda para siempre vacía porque no hay ni un arquero que reconocer.
    //
    // Los 32 clubes de la Libertadores, los 32 de la Sudamericana y los 36 de la Champions están
    // todos en CLUBS_DATABASE, así que no se pierde ningún partido por cambiar de lista. Es la
    // misma que ya usa handleMatchComplete para repartir los goles de la fecha de liga.
    //
    // TU club queda afuera del reparto: tus partidos de copa ya están anotados con los datos
    // reales (tus goles, tu tarjeta, el reparto de tus compañeros y del rival). Deducirlos otra
    // vez acá te pondría el doble de goles de los que metiste.
    return partidos.length ? lineasDeCopa(partidos, CLUBS_DATABASE, currentClub.id) : [];
  }, [claveLideresHoy, conmebolCup, conmebolCupId, uefaCup, uefaCupId, currentClub.id, currentClub.league, currentClub.name, playerProfile.currentWeek, playerProfile.domesticCups]);

  const lideresDeHoy = claveLideresHoy
    ? lideresDe(
        lineasDeCopaDeHoy.length
          ? anotarEnLideres(playerProfile.lideresPorCompeticion, claveLideresHoy, lineasDeCopaDeHoy)
          : playerProfile.lideresPorCompeticion,
        claveLideresHoy)
    : null;

  // Distingue "no clasificaste a ninguna copa" de "clasificaste pero quedaste afuera": las dos
  // cosas dejan la semana de copa sin rival, pero al jugador le dicen cosas muy distintas.
  const eliminadoDeCopa =
    (!!conmebolCup && !isClubStillInCup(conmebolCup, currentClub.id)) ||
    (!!uefaCup && !isClubStillInUefaCup(uefaCup, currentClub.id));

  /**
   * EL TORNEO DE SELECCIONES QUE SE ESTA JUGANDO HOY, si hay alguno y si el jugador esta en el.
   *
   * Se muestra SOLO mientras dura: fuera de la ventana no existe, que es lo que corresponde -- el
   * panel de copas es de lo que se esta jugando, no un archivo. Pedido: "que se vean cuando se
   * juegue el torneo nada mas".
   */
  const torneoDeSelecciones = (() => {
    const hoy = torneoDeSeleccionesDeHoy(
      playerProfile, currentClub.name,
      temporadaDeCarrera(currentClub.name, playerProfile.currentWeek),
      // LAS CLASIFICADAS DE ESTA CARRERA, no las 48 fijas. Ver seleccionesDelMundialDe: con dos
      // listas distintas salen dos sorteos distintos, y la tarjeta terminaba anunciando un rival
      // que en el torneo que juega App no existe.
      seleccionesDelMundialDe(anioDeCarrera(currentClub.name, playerProfile.currentWeek), playerProfile));
    if (!hoy) return null;
    const estado = getOrCreateWorldCupState(
      temporadaDeCarrera(currentClub.name, playerProfile.currentWeek), hoy.equipos,
      // Con la seleccion del jugador, igual que App: sin el guardian la tarjeta leeria un torneo
      // mas adelantado que el que se va a jugar, y volveria a anunciar lo que ya no toca.
      playerProfile.worldCups[hoy.clave], hoy.pasos, hoy.torneo, hoy.miSeleccionId);
    const NOMBRE = { mundial: 'COPA MUNDIAL FIFA', eurocopa: 'EUROCOPA', copaamerica: 'COPA AMÉRICA' } as const;
    return { ...hoy, estado, nombre: NOMBRE[hoy.torneo] };
  })();

  /** La copa nacional de esta temporada, si la hay: es un torneo mas para mostrar. */
  const copaNacionalDeLaTemporada = playerProfile.domesticCups?.[claveDeCopaNacional(currentClub, playerProfile.currentWeek)] ?? null;

  /**
   * EL CUADRO DEL CUADRANGULAR, para dibujarlo como el de la Libertadores.
   *
   * Pedido: "cuando la liga llega a los cuadrangulares, que se muestren los brackets de
   * eliminación, como con la libertadores". El cuadro ya existe y se juega -- lo que faltaba era
   * mostrarlo: la pestaña de la liga terminaba en la tabla de la fase regular, que a esa altura del
   * torneo ya no dice quién está peleando el título.
   *
   * SE BUSCA POR PREFIJO en vez de rearmar la clave. La clave es `liga|temporada|semestre` y el
   * semestre sale de la fecha del partido de liga de HOY (ver clavePlayoffDeLiga), pero esta
   * pantalla se mira cualquier día -- también uno de copa, o uno sin partido --, y ahí no hay
   * torneo de liga que consultar: la clave saldría con el semestre vacío y no encontraría nada.
   * Del prefijo cuelgan como mucho dos cuadros por año (Apertura y Clausura) y se toma el último,
   * que es el que se está jugando.
   */
  const cuadrangularDeLaTemporada = (() => {
    const cuadros = playerProfile.playoffsDeLiga;
    if (!cuadros) return null;
    const prefijo = `${myLeagueKey}|${temporadaDeCarrera(currentClub.name, playerProfile.currentWeek)}|`;
    const claves = Object.keys(cuadros).filter(k => k.startsWith(prefijo)).sort();
    const ultima = claves[claves.length - 1];
    return ultima ? cuadros[ultima] ?? null : null;
  })();

  /**
   * UNA PESTAÑA POR TORNEO QUE SE ESTA JUGANDO, con el nombre de cada uno.
   *
   * No son categorias genericas ("Liga", "Copa"): son los torneos de verdad -- Bundesliga, UEFA
   * Champions League, DFB-Pokal, Copa Mundial FIFA -- porque lo que el jugador quiere ver de un
   * vistazo es TODO lo que su club esta disputando esta temporada. La lista se arma sola: el club
   * que no juega copa continental no tiene esa pestaña, y en la ventana del Mundial aparece la del
   * Mundial.
   */
  const seccionesDeTablas: { id: string; texto: string; Icono: React.ComponentType<{ size?: number }> }[] = [
    { id: 'liga', texto: getLeagueDisplay(currentClub.league, currentClub.division).name, Icono: Table },
    ...(conmebolCup ? [{
      id: 'continental',
      texto: conmebolCupId === 'libertadores' ? 'Copa Libertadores'
        : conmebolCupId === 'concacaf' ? 'Concacaf Champions Cup' : 'Copa Sudamericana',
      Icono: Trophy,
    }] : []),
    ...(!conmebolCup && uefaCup ? [{
      id: 'continental',
      texto: uefaCupId === 'europa' ? 'UEFA Europa League' : 'UEFA Champions League',
      Icono: Trophy,
    }] : []),
    ...(copaNacionalDeLaTemporada ? [{
      id: 'nacional', texto: nombreCopaNacional(currentClub.league), Icono: Trophy,
    }] : []),
    ...(torneoDeSelecciones ? [{
      id: 'selecciones',
      texto: torneoDeSelecciones.torneo === 'mundial' ? 'Copa Mundial FIFA'
        : torneoDeSelecciones.torneo === 'eurocopa' ? 'Eurocopa' : 'Copa América',
      Icono: Globe,
    }] : []),
    { id: 'cracks', texto: 'Cracks', Icono: BarChart3 },
  ];

  /**
   * QUE SECCION SE VE.
   *
   * Si el jugador todavia no eligio: en ventana de Mundial, Eurocopa o Copa America las ligas estan
   * PARADAS, asi que abrir en la tabla de liga seria abrir en lo unico que no esta pasando -- se
   * abre en el torneo de selecciones. Fuera de eso, la liga.
   *
   * Y si lo que eligio ya no existe -- se acabo la copa, cambio de club, se cerro la ventana del
   * Mundial -- se vuelve a la liga en vez de quedar en una pestaña vacia.
   */
  const seccionPorDefecto = torneoDeSelecciones ? 'selecciones' : 'liga';
  const seccionDeTablas = seccionesDeTablas.some(x => x.id === seccionElegida)
    ? seccionElegida!
    : seccionPorDefecto;

  const nombreDeSeleccion = (id: string | null) =>
    (id ? torneoDeSelecciones?.equipos.find(t => t.id === id)?.name : '') || '';

  // Para el post de "campeón del Mundo" en ChutSocial -- ver generateCupChampionPosts.
  const wcState = isWorldCupYear(cupYear)
    ? getOrCreateWorldCupState(cupYear, WORLD_CUP_TEAMS_DATABASE, playerProfile.worldCups[cupYear], pasosDeMundialTranscurridos(currentClub.name, playerProfile.currentWeek))
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
  // El paron es de SELECCIONES, no solo del Mundial: en los anios del medio lo ocupan la Eurocopa y
  // la Copa America. Ver torneoDeSeleccionesDelDia, que contesta cual de los tres es.
  const nextWeekInWorldCupBreak = !!torneoDeSeleccionesDelDia(currentClub.name, playerProfile.currentWeek);
  // Igual que en App: lo que se juega hoy lo dice el calendario. Con isCupWeek, la tarjeta y el
  // partido de verdad se decidían por caminos distintos y podían no coincidir.
  const nextWeekIsCup = !nextWeekInWorldCupBreak
    && esDiaDeCopa(currentClub.name, playerProfile.currentWeek);
  // rivalPos/rivalTotal: posición del rival en la tabla que corresponda (liga doméstica, grupo de
  // Fecha completa del partido que viene, para la tarjeta de "próximo partido". Es la MISMA fecha
  // que el calendario usa para ubicarlo, así que las dos vistas no pueden contradecirse.
  const fechaDelProximoPartido = (() => {
    const club = ULTIMATE_CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    if (!club || !hasDatedLeagueSchedule(club.name)) return null;
    const paso = fixturesAtStep(club.name, playerProfile.currentWeek);
    return paso ? formatDate(paso.date) : null;
  })();

  /** La ronda de copa, corta y en español, para que entre en la celda del calendario. */
  const rondaCorta = (ronda: string) => {
    const b = ronda.replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
    if (/^final$/.test(b)) return 'Final';
    if (/semi/.test(b)) return 'Semis';
    if (/quarter|cuartos/.test(b)) return 'Cuartos';
    if (/round of 16|last 16|octavos/.test(b)) return 'Octavos';
    if (/round of 32|last 32|dieciseis/.test(b)) return '16avos';
    if (/round of 64/.test(b)) return '32avos';
    if (/group|grupo/.test(b)) return 'Grupos';
    return ronda.length > 12 ? ronda.slice(0, 12) : ronda;
  };

  /**
   * El nombre corto de un torneo, tal como entra en una celda del calendario.
   *
   * Las copas nacionales ya vienen cortas y con nombre propio (Copa MX, Copa BetPlay, FA Cup,
   * DFB-Pokal), así que se devuelven tal cual: eran justo las que se perdían bajo el "Copa" genérico.
   * Las internacionales sí hay que recortarlas -- "Concacaf Champions Cup" no entra en una celda de
   * séptimo de ancho -- pero se recortan al nombre con el que cada una se conoce, no a su categoría.
   */
  const nombreCortoDeTorneo = (nombre: string): string => {
    if (/Libertadores/i.test(nombre)) return 'Libertadores';
    if (/Sudamericana/i.test(nombre)) return 'Sudamericana';
    if (/Concacaf/i.test(nombre)) return 'Concacaf';
    if (/Champions League/i.test(nombre)) return 'Champions';
    if (/Europa League/i.test(nombre)) return 'Europa';
    if (/Conference League/i.test(nombre)) return 'Conference';
    if (/Recopa/i.test(nombre)) return 'Recopa';
    if (/Eliminatorias/i.test(nombre)) return 'Eliminatorias';
    if (/Mundial de Clubes/i.test(nombre)) return 'Mundial Clubes';
    if (/Mundial/i.test(nombre)) return 'Mundial';
    return nombre;
  };

  /** A qué familia de color va este torneo. Ver COLOR_DE_TORNEO. */
  const familiaDeTorneo = (etiqueta: string, kind: string, esPlayoff?: boolean): FamiliaDeTorneo => {
    // El cuadrangular es liga, pero no es la fase regular: se pinta aparte porque es la parte del
    // año en la que un partido te deja afuera. La leyenda prometía un color de "Playoffs" que hasta
    // ahora no existía: eran del mismo borgoña que todas las copas.
    if (esPlayoff) return 'playoff';
    if (kind === 'league') return 'liga';
    if (etiqueta === 'Libre') return 'libre';
    if (/^(Eliminatorias|Mundial)/.test(etiqueta)) return 'seleccion';
    if (/^(Libertadores|Sudamericana|Concacaf|Champions|Europa|Conference|Recopa)$/.test(etiqueta)) return 'continental';
    return 'nacional';
  };

  /**
   * ¿La copa nacional puede quedarse con alguno de los días que faltan?
   *
   * Sale de la MISMA función con la que App.tsx decide de quién es el día, así que el calendario no
   * puede prometer una copa que el motor no va a jugar. Se contesta una sola vez y no una por celda:
   * la respuesta no depende del día que se esté dibujando sino del estado de hoy, y quedar afuera
   * -- o salir campeón, que también te saca del cuadro -- es definitivo.
   */
  const laNacionalPuedeTomarDias = laNacionalTieneCruce(playerProfile, currentClub, playerProfile.currentWeek);

  /**
   * LOS DIAS APARTADOS QUE YA NO SON DE NADIE.
   *
   * El calendario aparta mas dias de copa de los que el cuadro necesita -- a proposito, para que
   * ningun torneo se quede corto -- y hasta ahora TODOS mostraban el cartel de la copa. Con la final
   * por jugar, al Junior le quedaban tres dias de "Libertadores" DESPUES de la final. Reportado:
   * "estoy por jugar la final de la Libertadores pero en el calendario aparecen mas fechas".
   *
   * Se recorren los dias apartados que quedan por delante, en orden, y se le dan a la copa los
   * PARTIDOS QUE LE FALTAN (ver partidosQueLeQuedanEnLaCopa). Los de mas atras quedan libres.
   *
   * Sólo mira la copa internacional: la nacional comparte la misma bolsa y su cuadro se sortea con
   * otro reloj, asi que descontarla acá seria adivinar.
   */
  const diasDeCopaQueSobran = useMemo(() => {
    const sobran = new Set<string>();
    const cupState = conmebolCup ?? null;
    if (!cupState || !conmebolCupId) return sobran;

    let quedan = partidosQueLeQuedanEnLaCopa(cupState, currentClub.id);
    if (quedan >= 99) return sobran;   // en grupos todavia falta todo

    const hoy = fechaDelPasoCal(currentClub.name, playerProfile.currentWeek) ?? '';
    const apartados = fixturesForClub(currentClub.name)
      .filter(f => f.esReservaDeCuadro && f.competition.kind === 'continental_cup' && f.date >= hoy)
      .map(f => f.date)
      .sort();

    for (const d of apartados) {
      if (quedan > 0) quedan--;
      else sobran.add(d);
    }
    return sobran;
  }, [conmebolCup, conmebolCupId, currentClub.id, currentClub.name, playerProfile.currentWeek]);

  // El capital cuenta hasta su valor nuevo en vez de saltar: un número que pasa de 300.000 a
  // 432.120 en un frame se lee como un parpadeo, no como una ganancia. Ver src/animaciones.ts.
  const capitalQueCuenta = useNumeroQueCuenta(playerProfile.capital);

  // El apodo se CALCULA, no se guarda: guardarlo sería congelar una foto de lo que fuiste. Un
  // volante que se vuelve goleador se lo gana de nuevo.
  const llevoUnaDeLasGrandes = CAMISETAS_CON_DUENO.includes(playerProfile.dorsal as 1 | 9 | 10);

  const miApodo = apodoDe({
    partidos: playerProfile.careerStats.partidosHistoricos,
    goles: playerProfile.careerStats.golesHistoricos,
    asistencias: playerProfile.careerStats.asistenciasHistoricos,
    amarillas: playerProfile.careerStats.tarjetasAmarillasHistoricas,
    rojas: playerProfile.careerStats.tarjetasRojasHistoricas,
    posicion: playerProfile.position,
    jugadas: playerProfile.jugadasPorAtributo,
  });

  /**
   * LA PANTALLA DE CARRERA, EN CELULAR, ES UNA SOLA VISTA Y NO UN SCROLL DE SEIS.
   *
   * En escritorio la pestaña es una rejilla de tres columnas y se ve entera de un vistazo. En un
   * teléfono esa misma rejilla se apila: ficha, atributos, vitrina, estadísticas, próximo partido,
   * ranking, forma, rival, comparador. Nueve bloques, seis pantallas de scroll -- y el botón de
   * jugar, que es a lo que venís, enterrado en el medio.
   *
   * Ahora el teléfono muestra UNA sección por vez y se cambia con una barra abajo, del tamaño del
   * pulgar. Escritorio no se entera: todo lo de acá va detrás de `md:`.
   *
   * Arranca en PARTIDO a propósito. Lo primero que tiene que ver el que abre el juego es contra
   * quién juega y el botón para hacerlo.
   */
  const [seccionMovil, setSeccionMovil] = useState<SeccionDeCarrera>('ficha');
  const [puestoMovil, setPuestoMovil] = useState<PuestoDelPlantel>('porteros');
  const soloEnPuesto = (p: PuestoDelPlantel) => soloEnSeccion(puestoMovil, p);
  const soloEn = (s: SeccionDeCarrera) => soloEnSeccion(seccionMovil, s);

  const etiquetaCompetencia = (comp: { kind: string; name: string; league?: string }, date: string, esReserva?: boolean) => {
    if (comp.kind === 'league') return torneoDeFecha(comp as never, date);
    // Un día RESERVADO de copa no sabe todavía de qué copa es, y no puede saberlo: la bolsa de días
    // es una sola y el motor recién ese día pregunta "¿tengo cruce en la nacional? ¿y en la
    // internacional?". La reserva se guarda bajo la competición que le tocó a su LIGA, que no tiene
    // por qué ser la tuya -- en Colombia hay clubes en Libertadores y clubes en Sudamericana, y al
    // Junior, que juega la Libertadores, el calendario le mostraba "Sudamericana" en sus días
    // reservados (reportado: "con Junior por alguna razón me sale un partido de Sudamericana"). Sus
    // partidos REALES siempre estuvieron bien: los seis de grupos contra Palmeiras, Cerro Porteño y
    // Sporting Cristal. Era sólo el cartel de los días apartados.
    //
    // Acá sí se sabe cuál es TU copa (conmebolCupId y uefaCupId salen de los clasificados de tu
    // carrera), así que se dice. Lo que no se sabía se decía como "Copa" a secas, y eso tapaba
    // justo lo que el jugador quería leer: en un mes de Tigres, cuatro celdas idénticas que decían
    // "Copa" eran Copa MX y cinco eran Concacaf. Ahora cada día apartado nombra a la copa que puede
    // quedárselo -- y si no queda ninguna viva, dice que el día está libre en vez de inventar una.
    if (esReserva) {
      // Un día apartado que ya no le hace falta a ninguna copa es un día libre, no un partido.
      if (comp.kind === 'continental_cup' && diasDeCopaQueSobran.has(date)) return 'Libre';
      // Quedar afuera de una copa es definitivo, así que alcanza con mirar cómo estamos HOY para
      // saber quién puede quedarse con los días que faltan. Una copa que todavía no arrancó -- sin
      // estado guardado -- cuenta como viva: no se quedó afuera nadie.
      const nacional = nombreCortoDeTorneo(nombreCopaNacional(currentClub.league));
      const internacional =
        conmebolCupId && (!conmebolCup || isClubStillInCup(conmebolCup, currentClub.id))
          ? (conmebolCupId === 'libertadores' ? 'Libertadores'
            : conmebolCupId === 'concacaf' ? 'Concacaf' : 'Sudamericana')
        : uefaCupId && (!uefaCup || isClubStillInUefaCup(uefaCup, currentClub.id))
          ? (uefaCupId === 'champions' ? 'Champions' : 'Europa')
        : null;
      // Un día que pidió la copa nacional lo juega la nacional siempre que tenga cruce: es la que
      // tiene prioridad sobre la bolsa compartida (ver duenoDelDiaDeCopa).
      if (comp.kind === 'domestic_cup' && laNacionalPuedeTomarDias) return nacional;
      if (internacional) return internacional;
      if (laNacionalPuedeTomarDias) return nacional;
      // Sin cruce en ninguna de las dos, el día apartado no lo juega nadie. Es el mismo día que la
      // tarjeta del próximo partido anuncia como "Hoy no se juega", y hasta ahora el calendario lo
      // seguía contando como un partido de copa que nunca iba a llegar.
      return 'Libre';
    }
    return nombreCortoDeTorneo(comp.name);
  };

  // Fecha real que se muestra en el encabezado. Sale del calendario de fechas cuando el club lo
  // tiene (así el 7 de mayo es el 7 de mayo de verdad) y del cálculo por semanas si no.
  // Igual que misTrofeos: se calcula acá arriba porque el JSX que la usa está ~1200 líneas abajo y
  // declararla ahí repetiría el TDZ que dejó la pantalla en blanco.
  // Va acá arriba y no junto al JSX por la misma razón que fechaEnPantalla: el encabezado se
  // renderiza ~2000 líneas más abajo y declararla ahí repite el TDZ que dejó la pantalla en blanco.
  const jornadaDeHoy = (() => {
    const club = ULTIMATE_CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    return club ? jornadaDeLiga(club.name, playerProfile.currentWeek) : null;
  })();

  const fechaEnPantalla = (() => {
    const club = ULTIMATE_CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    const fecha = club ? fechaDelPaso(club.name, playerProfile.currentWeek) : null;
    return fecha ? formatDate(fecha) : '';
  })();

  // Palmarés del jugador para la vitrina de la tarjeta de atributos. Se calcula acá arriba, y no
  // junto al JSX que lo usa, para no repetir el ReferenceError por zona muerta temporal (TDZ) que
  // dejó la pantalla en blanco: el bloque de atributos se renderiza ~1300 líneas más abajo.
  const misTrofeos = getPalmares(
    playerProfile,
    ULTIMATE_CLUBS_DATABASE,
    (league: string, division?: number) => getLeagueDisplay(league, division).name,
    isApeturaClausuraLeague,
    NATIONALITY_TO_WORLD_CUP_TEAM_ID[playerProfile.nationality],
  );

  // Libertadores/Sudamericana, o fase de liga de Champions/Europa) -- null en fases sin tabla
  // (eliminación directa, Mundial). jornada es el rótulo corto para la esquina de la card.
  /** El cartel de "todavía no hay rival". Uno solo, para poder reconocerlo después. */
  const RIVAL_SIN_SORTEAR = 'Rival por definir';

  /**
   * El calendario aparto el dia para copa y NINGUNA copa tiene cruce para vos: hoy no se juega.
   *
   * Pasa cuando ya ganaste la copa nacional, cuando te eliminaron, o cuando el cuadro termino antes
   * que las fechas apartadas. App.tsx en ese caso da el dia por libre -- avanza y avisa --, asi que
   * la tarjeta no puede seguir ofreciendo "DISPUTAR PARTIDO" con un hueco de rival vacio al lado.
   * Reportado con captura: la tarjeta decia "SIN PARTIDO DE COPA" y "Rival aun sin sortear", y
   * abajo el boton de jugar.
   */
  let hoySinPartido = false;

  let nextMatchOpponent: {
    club: Club | undefined; name: string; isHome: boolean; competition: string;
    jornada: string; rivalPos: number | null; rivalTotal: number | null;
    /**
     * El cruce todavía no está sorteado: hoy es un día que el calendario apartó para copa o para
     * cuadrangular, y el cuadro se siembra recién al llegar (a propósito: sortear acá daría uno
     * distinto del que va a guardar App.tsx).
     *
     * Hace falta como BANDERA y no como un nombre de relleno: metido en el hueco del nombre del
     * club, "Rival por definir" salía como "vs Rival po..." -- el truncado lo dejaba a mitad de
     * palabra y parecía un club de verdad con el nombre roto. Y la localia que se mostraba al lado
     * era mentira: una fecha reservada viene siempre marcada como local porque no tiene rival
     * todavía, así que la tarjeta anunciaba "LOCAL" sin tener idea.
     */
    rivalPorDefinir: boolean;
  } | null = null;
  // ¿Hoy es fecha FIFA de ELIMINATORIAS? Lo dice el calendario, igual que en App.tsx.
  const esFechaDeEliminatorias = (() => {
    if (nextWeekInWorldCupBreak || !hasDatedLeagueSchedule(currentClub.name)) return false;
    const paso = fixturesAtStep(currentClub.name, playerProfile.currentWeek);
    return pickDatedPrimary(paso?.fixtures ?? [])?.competition.id === 'eliminatorias';
  })();

  if (nextWeekInWorldCupBreak) {
    // Los tres torneos de selecciones pasan por aca. Cual es y con quienes se juega lo contesta
    // torneoDeSeleccionesDeHoy -- el MISMO que usa App al ofrecer el partido, para que la tarjeta no
    // pueda anunciar un torneo y el boton meter en otro.
    const hoy = torneoDeSeleccionesDeHoy(
      playerProfile, currentClub.name,
      temporadaDeCarrera(currentClub.name, playerProfile.currentWeek),
      // Las clasificadas de ESTA carrera, las mismas que usa App (ver seleccionesDelMundialDe).
      // Aca decia "las 48 de siempre: para dibujar la tarjeta alcanza" -- y no alcanzaba.
      seleccionesDelMundialDe(anioDeCarrera(currentClub.name, playerProfile.currentWeek), playerProfile));
    // La MISMA regla que usa App para llevarte (ver convocadoAlMundial en convocatoria.ts). Estaba
    // copiada acá palabra por palabra, que es como se llega a anunciar un partido que no se juega.
    const isEligible = !!hoy && convocadoAlMundial(playerProfile);
    if (isEligible && hoy) {
      const wcState = getOrCreateWorldCupState(
        temporadaDeCarrera(currentClub.name, playerProfile.currentWeek), hoy.equipos,
        playerProfile.worldCups[hoy.clave], hoy.pasos, hoy.torneo, hoy.miSeleccionId);
      const upcoming = getUpcomingWorldCupMatch(wcState, hoy.miSeleccionId);
      if (upcoming) {
        const NOMBRE = { mundial: 'Copa Mundial FIFA', eurocopa: 'Eurocopa', copaamerica: 'Copa América' } as const;
        nextMatchOpponent = {
          club: hoy.equipos.find(t => t.id === upcoming.opponentId),
          name: hoy.equipos.find(t => t.id === upcoming.opponentId)?.name || '',
          isHome: upcoming.isHome,
          rivalPorDefinir: false,   // el cuadro ya esta sorteado cuando hay partido
          competition: NOMBRE[hoy.torneo],
          jornada: 'Fecha FIFA',
          rivalPos: null,
          rivalTotal: null
        };
      }
    }
  } else if (esFechaDeEliminatorias) {
    // FECHA FIFA DE ELIMINATORIAS.
    //
    // El cruce lo contesta cruceDeEliminatoriasHoy, el MISMO que usa App al armar el partido. Acá
    // no había nada: el día caía al camino del calendario, cuyo rival para una fecha FIFA es el
    // cartel de relleno "Por definir" (el sorteo lo hace el motor al llegar), y encima venía
    // marcado como local. Medido jugando siete temporadas: las 52 fechas de eliminatorias, todas
    // "vs Por definir · Local". Nunca se veía contra quién se jugaba.
    const cruce = cruceDeEliminatoriasHoy(playerProfile, currentClub.name);
    if (cruce) {
      nextMatchOpponent = {
        club: cruce.rival ?? undefined,
        name: cruce.rival?.name ?? '',
        isHome: cruce.soyLocal,
        rivalPorDefinir: false,
        competition: `Eliminatorias ${cruce.mundial}${cruce.zona ? ` · ${cruce.zona}` : ''}`,
        jornada: `Fecha ${cruce.fecha}`,
        rivalPos: cruce.suPos,
        rivalTotal: cruce.total,
      };
    } else {
      // No estás en la nómina (o tu zona descansa esta fecha): App da el día por libre, así que la
      // tarjeta no puede ofrecer un partido que no existe.
      hoySinPartido = true;
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
        const round = conmebolCup.knockout?.tiesByRound[conmebolCup.knockout.tiesByRound.length - 1];
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
        rivalPorDefinir: false,   // sale del cuadro de la copa, que ya tiene el cruce armado
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

  // `!esFechaDeEliminatorias` es lo que impide que este bloque le pase por encima a la fecha FIFA.
  // Sin él, un día de eliminatorias sin partido para vos volvía a caer al calendario y la tarjeta
  // anunciaba otra vez "vs Por definir · Local" -- el rival de relleno de la fecha reservada.
  if (!nextMatchOpponent && !nextWeekInWorldCupBreak && !esFechaDeEliminatorias
      && (upcomingLeagueFixtures.length > 0 || hayPartidoReal)) {
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
    // El calendario semanal legado (realSchedule.ts) se eliminó: llevaba su propio reloj de jornadas
    // y derivaba del calendario por fechas, que ahora es la única fuente de verdad.
    const legadoDeLaSemana = null;
    // El calendario semanal LEGADO de copa nacional (realSchedule.ts) es un fixture fijo de 2024 sin
    // eliminación real -- para los países que ya tienen el bracket de copaNacional.ts (con sorteo,
    // ida/vuelta y coronación de verdad), ese legado no debe ganarle a la tarjeta: mostraba un rival
    // fijo semanal que ni siquiera es el cruce real del cuadro que el jugador está jugando.
    const legadoEsCopaConBracketReal = legadoDeLaSemana?.competition.kind === 'domestic_cup'
      && tieneCopaNacionalReal(currentClub.league);
    const realDeLaSemana = pasoConFecha
      ? pickDatedPrimary(pasoConFecha.fixtures)
      : legadoEsCopaConBracketReal ? null : legadoDeLaSemana;
    const realDeLiga = realDeLaSemana?.competition.kind === 'league' ? realDeLaSemana : null;

    // El rival se toma del partido real SEA DE LA COMPETICIÓN QUE SEA, no solo de liga. Filtrar por
    // liga dejaba la tarjeta sin rival cuando el partido del día era de copa, y entonces caía al
    // fixture generado: anunciaba "vs Deportivo Pereira" y salías a jugar la Superliga contra Santa
    // Fe. Fuera de la liga el rival puede ser de otro país (Libertadores), así que se busca en toda
    // la base y se desambigua con el torneo.
    const rivalReal = realDeLiga
      ? resolverRivalDeLaFecha(
          clubesDeLiga(myLeagueKey),
          realDeLiga, currentClub, currentClub.league, 'league', realDeLiga.competition.name)
      : realDeLaSemana
        ? resolverRivalDeLaFecha(
            ULTIMATE_CLUBS_DATABASE, realDeLaSemana, currentClub,
            realDeLaSemana.competition.league ?? (realDeLaSemana.competition.kind === 'domestic_cup' ? currentClub.league : undefined),
            realDeLaSemana.competition.kind, realDeLaSemana.competition.name)
        : null;

    // Semana de copa nacional con bracket real (ver copaNacional.ts) y sin fecha real que la cubra:
    // el rival sale del cruce actual del cuadro, no del legado semanal descartado arriba ni del
    // fixture de liga (que anunciaría un partido de liga para una semana que en realidad es de
    // copa). Mismo criterio que usa el calendario mensual más abajo.
    // Y también cuando el día de hoy es una fecha RESERVADA para la copa (ver dateSchedule.ts): el
    // calendario apartó el día pero no trae rival, así que sin esto la tarjeta caía al fixture
    // generado de liga y anunciaba un rival de liga para un día que en realidad es de copa.
    // Un día apartado lo puede haber pedido cualquiera de las dos copas -- la bolsa es una sola --,
    // así que las DOS clases de reserva se tratan igual y el turno se decide como lo decide App.tsx:
    // continental primero (copaContinentalDeHoy), nacional si aquélla no tiene cruce para vos.
    const esReservaDeCopa = !!realDeLaSemana?.esReservaDeCuadro
      && (realDeLaSemana.competition.kind === 'domestic_cup'
        || realDeLaSemana.competition.kind === 'continental_cup');
    // De quién es el día: lo estrena la copa que lo PIDIÓ, y la otra lo hereda si aquélla no tiene
    // cruce. Mismo criterio y mismos datos que App.tsx (ver laNacionalTieneCruceHoy allá); si acá
    // se contestara distinto, el cartel volvería a prometer un torneo y el partido sería de otro.
    // Igual que en App.tsx: un dia de copa nacional es suyo aunque el partido sea REAL y no una
    // reserva. Con la pregunta vieja la continental se quedaba con las fechas de Copa BetPlay.
    // Por NOMBRE y no por tipo: la Superliga de Colombia también es `domestic_cup` y no es la Copa
    // BetPlay. Ver la misma nota en App.tsx.
    const elDiaLoPidioLaNacional = realDeLaSemana?.competition.kind === 'domestic_cup'
      && realDeLaSemana.competition.name === nombreCopaNacional(currentClub.league);
    const laNacionalTieneCruceHoy = (esReservaDeCopa || elDiaLoPidioLaNacional)
      && duenoDelDiaDeCopa(
        playerProfile, currentClub, playerProfile.currentWeek,
        elDiaLoPidioLaNacional,
      ) === 'nacional';
    // EL DÍA ES DEL CUADRO AUNQUE EL CALENDARIO TRAIGA UN PARTIDO REAL.
    //
    // Desde que las copas europeas las maneja el motor y no el calendario (ver clubEnCopaContinental
    // en App.tsx), un día de Champions ya no se juega contra el rival que trae el calendario sino
    // contra el que dice el cuadro. Sin esto la tarjeta seguía leyendo el calendario: anunciaba
    // "Juventus · 16 sep" y el partido era contra otro, que es exactamente el bug que ya pasó con la
    // Copa MX ("la tarjeta anunciaba a León y el partido era contra Cruz Azul").
    //
    // Sólo para las europeas: las de Conmebol siguen mandadas por el calendario donde lo tienen.
    //
    // No se pregunta si el club clasificó: se pregunta si el día es de copa europea. Un club sin
    // plaza este año tampoco juega los partidos que trae el calendario -- ese día es de la copa
    // nacional o de descanso -- y es la misma respuesta que da App.tsx.
    const diaDeCopaEuropeaDelCuadro = realDeLaSemana?.competition.kind === 'continental_cup'
      && !realDeLaSemana.esReservaDeCuadro
      && Object.values(NOMBRE_UEFA_EN_EL_CALENDARIO).includes(realDeLaSemana.competition.name);
    // Y la copa NACIONAL, por lo mismo: el calendario trae sus partidos reales y el motor lleva su
    // cuadro, y hasta acá corrían los dos a la vez. Ver la nota en App.tsx (tres finales de Coppa
    // Italia en una temporada, una de ellas antes de la semifinal).
    // LA COPA NACIONAL, no cualquier torneo doméstico: la Superliga de Colombia y la Supercopa de
    // España también son `domestic_cup` y son otra cosa. Se compara con el nombre del reglamento.
    const diaDeCopaNacionalDelCuadro = realDeLaSemana?.competition.kind === 'domestic_cup'
      && !realDeLaSemana.esReservaDeCuadro
      && realDeLaSemana.competition.name === nombreCopaNacional(currentClub.league);
    // Y cualquier copa continental que lleve el cuadro del motor (la Libertadores de Boca, que el
    // calendario le mezclaba con partidos de Sudamericana que no le tocaban).
    //
    // "QUE LLEVE EL CUADRO" HAY QUE PREGUNTARLO, y acá no se preguntaba: alcanzaba con que el club
    // estuviera clasificado (`!!conmebolCup`). Pero estar clasificado no quiere decir que el cuadro
    // ponga los partidos -- en la temporada 1 los pone el CALENDARIO, porque ésos sí son los que el
    // club jugó de verdad (ver laCopaContinentalLaLlevaElCuadro, que es la misma respuesta que usa
    // App.tsx para armar el partido).
    //
    // Sin la pregunta, la tarjeta leía el cuadro del motor y el partido salía del calendario. Con el
    // Junior en la temporada 1, cuatro de sus seis partidos del grupo de Libertadores se anunciaban
    // contra un rival y se jugaban contra otro: la tarjeta decía "vs Sporting Cristal" y salía
    // contra Palmeiras. Reportado: "la tarjeta dice un equipo en libertadores, pero el partido es
    // otro".
    const diaDeCopaContinentalDelCuadro = realDeLaSemana?.competition.kind === 'continental_cup'
      && !realDeLaSemana.esReservaDeCuadro
      && !!conmebolCup
      && laCopaContinentalLaLlevaElCuadro(playerProfile, currentClub, cupYear, conmebolCupId);
    const elDiaEsDeCopa = esReservaDeCopa || diaDeCopaEuropeaDelCuadro || diaDeCopaNacionalDelCuadro
      || diaDeCopaContinentalDelCuadro;
    const continentalDeLaSemana = elDiaEsDeCopa && !laNacionalTieneCruceHoy ? copaContinentalDeHoy : null;
    // El cruce sale de cruceDeCopaNacionalHoy, que es LA MISMA funcion que usa App.tsx: la clave de
    // la edicion, la ronda, el rival y la localia salen todos de ahi.
    //
    // Y esa funcion ARMA LA RONDA SIGUIENTE antes de mirar. Es lo que faltaba: el cuadro se guarda
    // con la ronda recien terminada como ultima, asi que leerlo tal cual devolvia LA LLAVE YA
    // JUGADA. Reportado jugando con Tigres: la tarjeta anunciaba a Leon, al que acababa de
    // eliminar, mientras el partido era contra Cruz Azul.
    const cupBracketDeLaSemana = (!continentalDeLaSemana
      && ((!realDeLaSemana && legadoEsCopaConBracketReal) || elDiaEsDeCopa))
      ? cruceDeCopaNacionalHoy(playerProfile, currentClub, ULTIMATE_CLUBS_DATABASE, playerProfile.currentWeek)
      : null;

    // Dia de copa sin cruce en NINGUNA copa: hoy no se juega. Se decide con las mismas dos
    // respuestas que usa App.tsx, asi que no puede discrepar de lo que el partido va a hacer.
    hoySinPartido = elDiaEsDeCopa && !continentalDeLaSemana && !cupBracketDeLaSemana;

    // PLAYOFF DE LIGA: el rival lo pone el CUADRO, no el calendario.
    //
    // En los cuadrangulares de Colombia y Argentina el calendario real aporta los DÍAS, pero los
    // cruces salen del cuadro sembrado por la tabla de tu carrera (ver prepararPlayoffDeLiga) -- que
    // casi nunca coincide con quién los jugó en la vida real. El calendario de Junior dice "vs Once
    // Caldas" el 10 de mayo y el partido que arma App.tsx es contra Deportes Tolima. Es la misma
    // distinción que ya se hacía con las fechas reservadas de copa, sólo que acá el día SÍ trae un
    // rival escrito, y por eso pasaba desapercibido: la tarjeta lo mostraba como si fuera el bueno.
    // Reportado: "el calendario muestra otro equipo y partido".
    // La clave, el cruce, la localia y la ronda salen de cuadrangularDeHoy: es LA MISMA funcion que
    // usa App.tsx al armar el partido, no una copia que haya que mantener a la par.
    // La tabla se lee del perfil y no de myLeagueSeason: esa constante se declara ~1200 lineas mas
    // abajo y usarla aca seria el ReferenceError por zona muerta temporal que ya dejo la pantalla
    // en negro una vez. Va para poder SEMBRAR el cuadro el primer dia: sin ella la tarjeta decia
    // "Rival por definir" justo cuando hay que decidir si jugas.
    const playoffDeLaSemana = realDeLaSemana?.esPlayoff
      ? cuadrangularDeHoy(
          playerProfile, currentClub, playerProfile.currentWeek, realDeLaSemana.date,
          tablaParaElCuadrangular)
      : null;

    // NO CLASIFICASTE AL CUADRANGULAR: eso no es "rival por definir", es que hoy no jugás.
    //
    // El cuadrangular lo juegan los ocho primeros. Al club que terminó noveno el calendario le sigue
    // apartando esos días -- son días de su liga -- y la tarjeta los rotulaba "Rival por definir"
    // con el botón de jugar debajo. Medido con el Junior: diez fechas así en una temporada, en las
    // dos ventanas de cuadrangular (mayo-junio y diciembre). El torneo se juega igual, sin vos (ver
    // playoffDelDiaSinElJugador), así que lo honesto es decir que no hay partido.
    //
    // Se distingue de "todavía no se puede sembrar": con la tabla vacía el cuadro no se puede armar
    // y ahí sí no se sabe nada todavía, así que se conserva el cartel.
    const fueraDelCuadrangular = !!realDeLaSemana?.esPlayoff && !playoffDeLaSemana
      && !estaEnElCuadrangular(
        playerProfile, currentClub, playerProfile.currentWeek, realDeLaSemana.date,
        tablaParaElCuadrangular);
    if (fueraDelCuadrangular) hoySinPartido = true;

    // `next` puede no existir cuando el fixture generado ya se agotó y el partido sale solo del
    // calendario real, así que todos los accesos van con ?.
    const opponentId = playoffDeLaSemana?.rivalId ?? continentalDeLaSemana?.rivalId
      ?? cupBracketDeLaSemana?.rivalId ?? rivalReal?.id ?? next?.opponentId
      ?? (realDeLiga ? rivalDeRelleno(currentClub, clubesDeLiga(myLeagueKey), playerProfile.currentWeek)?.id : undefined);
    const opponentName = playoffDeLaSemana
      ? (ULTIMATE_CLUBS_DATABASE.find(c => c.id === playoffDeLaSemana.rivalId)?.name ?? '')
      : continentalDeLaSemana
      ? (ULTIMATE_CLUBS_DATABASE.find(c => c.id === continentalDeLaSemana.rivalId)?.name ?? '')
      : cupBracketDeLaSemana
      ? (ULTIMATE_CLUBS_DATABASE.find(c => c.id === cupBracketDeLaSemana.rivalId)?.name ?? '')
      // Día de copa sin cruce en ninguna copa: ya no llega acá. Lo atiende hoySinPartido, que no
      // arma tarjeta de rival y cambia el botón por "Pasar a Siguiente Fecha" -- decir "rival por
      // definir" con el botón de jugar debajo era el contrasentido reportado.
      //
      // Queda este último, y es honesto: día de cuadrangular cuyo cuadro no se puede sembrar porque
      // la tabla de la fase regular todavía está vacía. En una carrera normal no pasa -- el
      // cuadrangular llega después de 17 o 19 jornadas -- pero si pasara, el rival del calendario es
      // el del cuadrangular REAL, que no es el que vas a jugar, y anunciarlo sería peor.
      : realDeLaSemana?.esPlayoff && !fueraDelCuadrangular
      ? RIVAL_SIN_SORTEAR
      // EL NOMBRE CRUDO DEL CALENDARIO ES EL ULTIMO RECURSO, y ni siquiera eso cuando el partido es
      // de liga: si el rival que trae el calendario no se resuelve dentro de tu division es porque el
      // calendario quedo en la division vieja (tu club subio o bajo), y ahi el motor pone un rival de
      // relleno. La tarjeta calcula EL MISMO con rivalDeRelleno -- es determinista a proposito -- en
      // vez de anunciar al Manchester City mientras se juega contra el West Bromwich Albion.
      : (rivalReal?.name
          ?? next?.opponentName
          ?? (realDeLiga ? rivalDeRelleno(currentClub, clubesDeLiga(myLeagueKey), playerProfile.currentWeek)?.name : undefined)
          ?? realDeLaSemana?.opponentName ?? '');
    const isHome = playoffDeLaSemana
      ? playoffDeLaSemana.soyLocal
      : continentalDeLaSemana
      ? continentalDeLaSemana.soyLocal
      : cupBracketDeLaSemana
      ? cupBracketDeLaSemana.soyLocal
      : realDeLaSemana ? realDeLaSemana.isHome : (next?.isHome ?? true);
    // La ronda que trae el calendario, sólo para partidos que NO son de liga (una liga no tiene
    // "octavos"; ahí lo que se muestra es la fecha).
    const rondaDeLaCopaDelCalendario = realDeLaSemana && realDeLaSemana.competition.kind !== 'league'
      ? rondaEnEspanol((realDeLaSemana.match as { round?: string }).round)
        // Las copas continentales vienen SIN ronda desde Transfermarkt, así que se deduce de la
        // lista de partidos del club (ver rondaDeCopaEnElCalendario). Sin esto, un partido de fase
        // de grupos de la Libertadores se rotulaba "9 abr": la fecha, que es el dato que menos
        // importa cuando lo que querés saber es en qué instancia estás.
        ?? (realDeLaSemana.competition.kind === 'continental_cup'
          ? rondaDeCopaEnElCalendario(
              currentClub.name, realDeLaSemana.competition.name,
              temporadaDeCarrera(currentClub.name, playerProfile.currentWeek), realDeLaSemana.date)
          : null)
      : null;
    const idx = myLeagueTable.findIndex(r => r.clubId === opponentId);

    nextMatchOpponent = hoySinPartido ? null : {
      club: ULTIMATE_CLUBS_DATABASE.find(c => c.id === opponentId),
      name: opponentName,
      isHome,
      // Sin club resuelto no hay rival: el nombre es un cartel, no un equipo.
      rivalPorDefinir: opponentName === RIVAL_SIN_SORTEAR,
      // Si el partido del día no es de liga, la tarjeta tiene que decir de qué torneo es: anunciaba
      // "Colombiana" cuando lo que se jugaba era la Superliga.
      competition: continentalDeLaSemana
        ? continentalDeLaSemana.nombre
        // `laNacionalTieneCruceHoy` sin cuadro guardado es la primera fecha de la edición: el cruce
        // todavía no está sorteado (a propósito, ver arriba) pero la copa del día ya se sabe.
        : cupBracketDeLaSemana || laNacionalTieneCruceHoy
        ? nombreCopaNacional(currentClub.league)
        // El caso "reserva sin cruce en ninguna copa" ya no llega acá: lo atiende hoySinPartido, que
        // no arma tarjeta de rival. Antes se rotulaba "Sin partido de copa" y aun así se dibujaba el
        // hueco del rival con el botón de jugar debajo, que era el contrasentido reportado.
        : realDeLaSemana && realDeLaSemana.competition.kind !== 'league'
        ? realDeLaSemana.competition.name
        // EL NOMBRE DE LA LIGA, no la nacionalidad. La tarjeta decía "Alemana", "Colombiana" o
        // "Brasileña" -- que es la CLAVE interna de la liga, no cómo se llama el torneo. El resto
        // del juego ya usaba getLeagueDisplay ("Bundesliga", "Liga BetPlay", "Brasileirão"); era
        // esta tarjeta, la que más se mira, la única que mostraba el dato crudo.
        : getLeagueDisplay(currentClub.league, currentClub.division).name,
      // El calendario por fechas no trae número de jornada (ESPN no lo publica), pero sí la fecha
      // exacta, que dice más: "8 feb" en vez de "Jornada 12".
      // La RONDA le gana a la fecha cuando hay una: en una copa, "Octavos de Final (Vuelta)" dice
      // lo único que importa antes de jugar, y "17 feb" no dice nada. La continental faltaba acá
      // -- sólo la nacional aportaba ronda -- así que la Champions se anunciaba con la fecha y el
      // jugador no sabía nunca en qué instancia estaba.
      jornada: continentalDeLaSemana?.ronda ? continentalDeLaSemana.ronda
        : cupBracketDeLaSemana ? cupBracketDeLaSemana.ronda
        // Copa que manda el CALENDARIO (la Libertadores del Junior, la Copa do Brasil del Flamengo):
        // la ronda viene en el propio partido y no se usaba. La tarjeta decía "9 abr" para un
        // partido de fase de grupos de la Libertadores, que es justo el dato que no sirve.
        : rondaDeLaCopaDelCalendario ? rondaDeLaCopaDelCalendario
        : pasoConFecha ? formatDateShort(pasoConFecha.date)
        : realDeLiga && 'round' in realDeLiga.match ? realDeLiga.match.round
        : next ? `Jornada ${next.matchweek}` : '',
      // La posición en la tabla solo tiene sentido en la liga: en una copa el rival puede no estar
      // en tu tabla, y mostrar "13° de 22" sería un dato inventado.
      rivalPos: realDeLiga && idx >= 0 ? idx + 1 : null,
      rivalTotal: realDeLiga ? (myLeagueTable.length || null) : null
    };
  }

  // EL RIVAL DE CARRERA (ver rivalDeCarrera.ts). Se deduce, no se guarda.
  //
  // La semilla lleva el club de ORIGEN y no el actual: el sentido de la vara es que sea la misma
  // toda la vida, asi que un traspaso no puede cambiarte de rival. El origen sale del primer tramo
  // de seasonHistory, y si todavia no hay ninguno (carrera recien creada) es tu club actual, que en
  // ese momento es lo mismo.
  const miRival = React.useMemo(() => {
    const origen = playerProfile.seasonHistory?.[0]?.clubId ?? playerProfile.currentClubId;
    const base = rivalDeCarrera(playerProfile.name, origen, playerProfile.position, CLUBS_DATABASE);
    if (!base) return null;
    const rival = numerosDelRival(base, playerProfile.careerStats.partidosHistoricos, playerProfile.position);
    return { rival, quien: quienVaGanando(playerProfile.careerStats, rival, playerProfile.position) };
  }, [playerProfile.name, playerProfile.position, playerProfile.currentClubId, playerProfile.seasonHistory, playerProfile.careerStats]);
  // Las rachas que se cuentan antes de ESTE partido (ver rachas.ts). Salen de datedResults, que ya
  // guarda toda tu historia con rival, competición y marcador -- no hace falta ningún dato nuevo.
  const rachasDeHoy = nextMatchOpponent
    ? rachasDelProximoPartido(
        playerProfile.datedResults,
        nextMatchOpponent.name,
        nextMatchOpponent.competition)
    : [];
  // Fecha de copa sin cruce puntual todavía definido (club no clasificado, o copa "de relleno"
  // con rival sorpresa que App.tsx recién sortea al arrancar el partido -- ver startMatchflow):
  // no hay datos reales para mostrar escudo/rival, pero la semana de todos modos tiene actividad.
  // Con fechas reales nunca hay "copa de relleno": si el calendario no tiene partido ese día, no
  // hay partido, punto. Sin este corte aparecía un cartel de semana de copa inventado por la
  // aritmética de semanas del motor.
  const nextWeekIsFillerCup = nextWeekIsCup && !nextMatchOpponent && !hasDatedLeagueSchedule(currentClub.name);

  // EL ESTADIO EMPIEZA A BAJAR ACA, no en el pitazo inicial.
  //
  // Las pistas de hinchada pesan entre 430 y 700 KB. Si la descarga arranca cuando el jugador toca
  // "Disputar Partido" -- que es cuando MatchSimulator llama a arrancarAmbiente --, el principio del
  // partido va en silencio hasta que termine de bajar: medido con carga lenta, casi seis segundos.
  // Desde acá, que es cuando ya se ve la tarjeta del próximo partido, llega lista al silbatazo.
  //
  // La semilla es EL CLUB LOCAL, igual que en la cancha: de visitante suena el estadio del rival.
  const clubDeLaCanchaQueViene = nextMatchOpponent
    ? (nextMatchOpponent.isHome ? currentClub : nextMatchOpponent.club)
    : null;
  useEffect(() => {
    if (clubDeLaCanchaQueViene) precargarAmbiente(clubDeLaCanchaQueViene.id, clubDeLaCanchaQueViene.league);
  }, [clubDeLaCanchaQueViene?.id, clubDeLaCanchaQueViene?.league]);

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

  /**
   * El CUADRO de una eliminatoria, ronda por ronda.
   *
   * Antes acá salía "Tu club sigue en carrera en la fase eliminatoria. Los cruces se resuelven
   * semana a semana en tu calendario" -- una frase que no dice nada: ni contra quién jugás, ni
   * cómo va el cuadro, ni si seguís vivo. Pedido textual: "que no salga un mensaje diciendo que
   * sigues en carrera, que te salga cual es tu siguiente rival o el cuadro completo, o si ya estas
   * eliminado que lo diga".
   *
   * Sirve para los dos formatos que hay: partido único (Conmebol) y ida y vuelta (UEFA, copas
   * nacionales, cuadrangulares).
   */
  const CuadroEliminatoria = ({ rondas, miId, campeonId }: {
    rondas: { nombre: string; cruces: { aId: string; bId: string; marcador: string | null; ganadorId: string | null }[] }[];
    miId: string;
    campeonId: string | null;
  }) => {
    if (!rondas.length) return <p className="text-2xs text-slate-500">El cuadro todavía no está sorteado.</p>;

    const ultima = rondas[rondas.length - 1];
    const miCruce = ultima.cruces.find(c => c.aId === miId || c.bId === miId);
    const sigoVivo = campeonId === miId || (!!miCruce && (!miCruce.ganadorId || miCruce.ganadorId === miId));
    // En qué ronda me quedé afuera, mirando de atrás para adelante.
    const rondaEnQueSali = !sigoVivo
      ? [...rondas].reverse().find(r => r.cruces.some(c => c.aId === miId || c.bId === miId))?.nombre
      : null;

    return (
      <div className="space-y-3">
        {/* Lo primero es tu situación, que es lo que se viene a mirar. */}
        {campeonId === miId ? (
          <div className="px-3 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-2xs font-bold">
            🏆 Campeón. No queda nada por jugar.
          </div>
        ) : !sigoVivo ? (
          <div className="px-3 py-2 rounded-xl bg-burgundy-600/10 border border-burgundy-600/30 text-burgundy-300 text-2xs font-bold">
            Eliminado en {rondaEnQueSali ?? 'la fase eliminatoria'}.
            {campeonId && <span className="text-slate-400 font-normal"> Ganó {clubNameById(campeonId)}.</span>}
          </div>
        ) : miCruce ? (
          <div className="px-3 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 text-2xs font-bold">
            {ultima.nombre}: te toca {clubNameById(miCruce.aId === miId ? miCruce.bId : miCruce.aId)}
            {miCruce.marcador && <span className="text-slate-300 font-normal"> · va {miCruce.marcador}</span>}
          </div>
        ) : null}

        {rondas.map(ronda => (
          <div key={ronda.nombre}>
            <p className="text-3xs uppercase tracking-widest text-slate-500 font-bold mb-1">{ronda.nombre}</p>
            <ul className="space-y-0.5 font-mono text-3xs">
              {ronda.cruces.map((c, i) => {
                const mio = c.aId === miId || c.bId === miId;
                return (
                  <li key={i} className={`flex justify-between gap-2 border-b border-slate-900/40 pb-0.5 ${mio ? 'text-gold-400 font-bold' : 'text-slate-400'}`}>
                    <span className="truncate">
                      <span className={c.ganadorId && c.ganadorId !== c.aId ? 'opacity-50' : ''}>{clubNameById(c.aId)}</span>
                      <span className="text-slate-600"> vs </span>
                      <span className={c.ganadorId && c.ganadorId !== c.bId ? 'opacity-50' : ''}>{clubNameById(c.bId)}</span>
                    </span>
                    <span className="text-slate-500 shrink-0">{c.marcador ?? '—'}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  // Acá vivía rondasDePartidoUnico, el adaptador para un PlayoffBracket. Lo usaba el cuadro de la
  // Conmebol cuando su knockout era a partido único; desde que va a ida y vuelta como el de verdad,
  // no lo llama nadie.

  /** Un TwoLegBracket (ida y vuelta) llevado a la misma forma. El marcador es el GLOBAL. */
  /**
   * El mismo cuadro, pero de partidos UNICOS: el Mundial, la Eurocopa y la Copa America.
   *
   * Hermana de rondasDeIdaYVuelta. Las dos existen para que CuadroEliminatoria no tenga que saber
   * de que torneo viene lo que dibuja.
   */
  const rondasDePartidoUnico = (matchesByRound: PlayoffMatch[][] | undefined) =>
    (matchesByRound ?? []).map(ronda => ({
      nombre: roundLabelByMatchCount(ronda.length),
      cruces: ronda.map(m => ({
        aId: m.homeTeamId, bId: m.awayTeamId,
        marcador: m.played ? `${m.homeGoals}-${m.awayGoals}` : null,
        ganadorId: m.played
          ? (m.penaltyShootout?.winnerId
            ?? ((m.homeGoals ?? 0) > (m.awayGoals ?? 0) ? m.homeTeamId : m.awayTeamId))
          : null,
      })),
    }));

  const rondasDeIdaYVuelta = (tiesByRound: TwoLegTie[][] | undefined) =>
    (tiesByRound ?? []).map(ronda => ({
      nombre: roundLabelByMatchCount(ronda.length),
      cruces: ronda.map(t => {
        const jugadoAlgo = t.firstLegGoalsA !== null;
        const golesA = (t.firstLegGoalsA ?? 0) + (t.secondLegGoalsA ?? 0);
        const golesB = (t.firstLegGoalsB ?? 0) + (t.secondLegGoalsB ?? 0);
        return {
          aId: t.clubAId, bId: t.clubBId,
          marcador: jugadoAlgo ? `${golesA}-${golesB}` : null,
          ganadorId: t.winnerId,
        };
      }),
    }));


  // Los patrocinios (tienen "category") son ofertas que le llegan al jugador, no compras de
  // catálogo -- viven en su propia pestaña "Patrocinios", separados de los lujos puros de la
  // "Tienda de Estilo de Vida" (ver handleAcceptSponsor en App.tsx).
  const lifestyleItems = shopItems.filter(i => !i.category);
  const sponsorDeals = shopItems.filter(i => !!i.category);

  // ¿Tu club se fue a segunda en el último cierre de temporada? El jugador tiene que enterarse: es
  // el momento en que decide si se queda a pelear el ascenso o se va a un club de primera.
  const miClubDescendio = !!playerProfile.ultimoAscensoDescenso?.descienden
    .some(d => d.clubId === playerProfile.currentClubId);

  // Las ofertas ahora se generan una vez por semana y persisten en el perfil (ver
  // refreshTransferOffersIfNeeded en transferMarket.ts, llamado desde App.tsx en el ciclo
  // semanal) -- ya no se recalculan en cada render. Acá solo se resuelve el Club real por id.
  // Cuanto le falta al jugador para poder volver a moverse (0 = ya puede). Ver
  // MESES_MINIMOS_EN_EL_CLUB: despues de un traspaso hay que quedarse medio año.
  const mesesQueFaltan = mesesQueFaltanEnElClub(playerProfile, currentClub);
  const transferOffers = (playerProfile.pendingTransferOffers ?? [])
    .map(offer => ({ ...offer, club: ULTIMATE_CLUBS_DATABASE.find(c => c.id === offer.clubId) }))
    .filter((offer): offer is typeof offer & { club: NonNullable<typeof offer.club> } => !!offer.club);

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
  // Rumores sobre VOS antes de que la oferta se vuelva concreta: si a un club le falta poco para
  // cumplir el umbral de ficharte (reqPrestige), la prensa ya empieza a especular. No espoilea el
  // club exacto hasta que está muy cerca (>=92%) -- antes de eso queda en "un club de la liga X".
  const generateOwnTransferRumorPosts = () => {
    const week = playerProfile.currentWeek;
    // La fórmula estaba copiada a mano acá y ya se había desincronizado de transferMarket.ts: esta
    // copia no aplicaba el ajuste del agente, así que la prensa rumoreaba con un umbral distinto al
    // de las ofertas que después aparecían en Traspasos. Ahora las dos leen del mismo lugar.
    const performanceScore = rendimientoDe(playerProfile);
    if (performanceScore <= 0) return [];

    const personas = [
      { author: 'Fichajes al Día', role: 'Cuenta de Mercado', avatar: '📋' },
      { author: 'Radar de Pases', role: 'Especialista en Fichajes', avatar: '🕵️' },
      { author: 'La Chiva del Mercado', role: 'Cuenta de Rumores', avatar: '🐐' },
    ];

    const candidatos = ULTIMATE_CLUBS_DATABASE
      .filter(c => c.id !== playerProfile.currentClubId)
      .map(c => {
        const { reqPrestige } = requisitosDe(c, currentClub, playerProfile.agent);
        return { club: c, closeness: reqPrestige > 0 ? performanceScore / reqPrestige : 0 };
      })
      // Cerca del umbral (80%-99%) pero sin cumplirlo todavía: si ya lo cumple, la oferta real ya
      // está disponible en la pestaña de Traspasos y no tiene sentido "rumorear" lo que ya es un hecho.
      .filter(x => x.closeness >= 0.8 && x.closeness < 1)
      .sort((a, b) => b.closeness - a.closeness)
      .slice(0, 2);

    if (candidatos.length === 0) return [];

    return candidatos.map(({ club, closeness }, idx) => {
      const persona = personas[(week + idx) % personas.length];
      const espoileaClub = closeness >= 0.92;
      const referenciaClub = espoileaClub ? club.name : `un club de ${club.league}`;
      const options = [
        `RUMOR: ${referenciaClub} sigue de cerca a ${playerProfile.name} de cara al próximo mercado. Todavía nada formal.`,
        `${referenciaClub} pidió información sobre ${playerProfile.name} y su situación contractual. La cosa recién empieza.`,
        `Ojo con este dato: ${referenciaClub} viene monitoreando el rendimiento de ${playerProfile.name} hace semanas.`,
      ];
      return {
        id: `ownrumor_${club.id}_${week}_${idx}`,
        author: persona.author,
        role: persona.role,
        content: options[(week + idx * 3) % options.length],
        likes: 200 + Math.floor(Math.random() * 2000),
        commentsCount: 30 + Math.floor(Math.random() * 400),
        timestamp: 'Mercado de Pases',
        avatar: persona.avatar
      };
    });
  };

  // "Cuentas pendientes": tu rival más enfrentado en la carrera hasta ahora (no un clásico fijo por
  // catálogo, sino el que de hecho más te cruzaste jugando). Solo aparece si ya se jugaron varias
  // veces, para que no dispare desde el segundo partido contra cualquiera.
  const generateRivalryPosts = () => {
    const records = Object.values(playerProfile.headToHeadRecords ?? {});
    if (records.length === 0) return [];
    const masEnfrentado = [...records].sort((a, b) => (b.wins + b.draws + b.losses) - (a.wins + a.draws + a.losses))[0];
    const totalPartidos = masEnfrentado.wins + masEnfrentado.draws + masEnfrentado.losses;
    if (totalPartidos < 3) return [];
    // Solo dispara la semana de un cruce reciente, no en cualquier semana al azar.
    if (masEnfrentado.lastMeetingWeek !== playerProfile.currentWeek) return [];

    const personas = [
      { author: 'Historial y Números', role: 'Cuenta de Estadísticas', avatar: '📊' },
      { author: 'La Lupa Deportiva', role: 'Analista Crítico', avatar: '🔍' },
    ];
    const persona = personas[playerProfile.currentWeek % personas.length];
    const balance = masEnfrentado.wins > masEnfrentado.losses
      ? `${playerProfile.name} le sigue ganando la partida a ${masEnfrentado.rivalName}`
      : masEnfrentado.wins < masEnfrentado.losses
      ? `${masEnfrentado.rivalName} le sigue sacando ventaja en el historial a ${playerProfile.name}`
      : `${playerProfile.name} y ${masEnfrentado.rivalName} siguen sin sacarse diferencias`;
    return [{
      id: `rivalry_${playerProfile.currentWeek}`,
      author: persona.author,
      role: persona.role,
      content: `CUENTAS PENDIENTES: van ${totalPartidos} cruces entre ${playerProfile.name} y ${masEnfrentado.rivalName} (${masEnfrentado.wins}V ${masEnfrentado.draws}E ${masEnfrentado.losses}D). ${balance}.`,
      likes: 300 + Math.floor(Math.random() * 2500),
      commentsCount: 40 + Math.floor(Math.random() * 500),
      timestamp: 'Historial',
      avatar: persona.avatar
    }];
  };

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
      // LAS LIGAS CON CALENDARIO REAL NO CORONAN ACÁ, y la guarda es por el CLUB.
      //
      // Esta era la TERCERA copia del mismo error, después de la vitrina y del festejo de fin de
      // torneo. La guarda vieja usaba un fixture vacío para identificar a esas ligas: cierto el
      // primer día, falso en cuanto se juega, porque resolveLigaPorFecha va AGREGANDO a `fixtures`
      // los partidos que resuelve y sólo agrega los ya jugados -- nunca los pendientes. A las dos
      // fechas el array tiene dos y los dos están jugados, así que `some(f => !f.played)` da false
      // y la liga se lee como TERMINADA.
      //
      // Reportado con captura: "¡Deportes Tolima campeón de Apertura 2026! 4 puntos en 2 fechas".
      //
      // Estas ligas ya tienen quien anuncie a su campeón: App.tsx lo publica al ganarlo. Acá abajo
      // queda sólo el respaldo para las ligas de fixture pregenerado, que sí llevan los pendientes.
      const clubDeLaLiga = ULTIMATE_CLUBS_DATABASE.find(c => leagueKeyFor(c) === key);
      if (clubDeLaLiga && hasDatedLeagueSchedule(clubDeLaLiga.name)) continue;
      if (!season.fixtures?.length) continue;
      if (season.fixtures.some(f => !f.played)) continue;
      // Y aunque haya fixtures, una tabla sin un solo partido jugado no tiene campeón.
      if (!season.table.some(t => t.pj > 0)) continue;

      const lider = sortTable([...season.table])[0];
      if (!lider) continue;
      const sample = ULTIMATE_CLUBS_DATABASE.find(c => leagueKeyFor(c) === key);
      if (!sample) continue;

      const anio = anioDeCarrera(currentClub.name, playerProfile.currentWeek);
      const formato = isApeturaClausuraLeague(sample.league);
      // El id lleva el semestre: en Apertura/Clausura hay dos campeones por año y con un solo id
      // el segundo título nunca aparecería (React los deduplica por key).
      const sufijo = formato ? `${anio}_s${season.semester ?? 1}` : `${anio}`;
      const torneo = formato
        ? `${season.semester === 2 ? 'Clausura' : 'Apertura'} ${anio}`
        : `${getLeagueDisplay(sample.league, sample.division).name} ${anio}`;
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
        `FIN DE UNA ERA: ${n.playerName} (${n.age}) anunció su retiro. ${n.clubName} le da la camiseta a ${n.replacementName}, un juvenil de la cantera.`,
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
        author: 'Mau', role: 'Mau Sports · Periodista', avatarImg: mauSportsAvatar,
        lines: (star, club) => [
          `¡EPA! Me cuentan que ${star} no la está pasando bien en ${club} últimamente... ustedes qué opinan, ¿se le acabó la magia? 👀`,
          `Hablamos de ${star} en el programa de hoy: la gente está dividida, unos lo defienden y otros ya lo quieren ver afuera de ${club}.`
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
  /** Cuántos posts se dibujan como mucho. Ver el comentario del corte, abajo. */
  const POSTS_EN_EL_FEED = 22;

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
        content: `${pName}, explícame por qué sigues siendo titular. El equipo necesita más que promesas, necesita resultados YA.`,
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
        content: `Vamos ${pName}, la tribuna te apoya, pero tú sabes que hay que subir el nivel de a poco. El hincha exige porque quiere.`,
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
    // LA CARRERA POR EL BALON DE ORO, en el feed. Ver postsDelBalonDeOro.
    //
    // El ranking ya se mueve cada fecha, pero un ranking que cambia y del que nadie habla es una
    // tabla mas. Lo que lo vuelve una carrera es que la prensa lo discuta MIENTRAS pasa. El texto
    // depende de tu puesto: fuera del top 20 ni te nombran -- hablan del favorito y de la pelea de
    // arriba, como en la vida real.
    const carreraBalonDeOro: SocialPost[] = (() => {
      const r = generateWorldRanking(playerProfile, currentClub.name, week, currentClub.league);
      if (r.length < 2) return [];
      const idx = r.findIndex(e => e.isPlayer);
      // El SEGUNDO es el segundo de la lista, no "el primero que no sos vos". Con ese criterio,
      // cuando el jugador no entra al ranking -- que es lo normal al empezar la carrera -- el
      // primero que no era el jugador resultaba ser el lider, y el post decia "Dembele sigue al
      // frente, con Dembele pisandole los talones". Reportado con captura.
      const lider = r[0];
      const escolta = r.find(e => e !== lider) ?? r[1];
      return postsDelBalonDeOro(pName, idx >= 0 ? idx + 1 : null,
        lider.name, lider.clubName, escolta.name, week)
        .map((p, i) => ({
          id: `balon_${week}_${i}`,
          author: p.author, role: p.role, content: p.content,
          likes: 1200 + Math.floor(Math.random() * 9000),
          commentsCount: 150 + Math.floor(Math.random() * 1800),
          timestamp: 'Hace un rato',
          avatar: p.avatar,
        }));
    })();

    // Reacciones a lo que dijiste en la rueda de prensa, si respondiste esta fecha.
    // Van arriba de todo cuando existen: hablaste vos, es la noticia mas fresca.
    const ecoDePrensa: SocialPost[] = playerProfile.ultimaPrensa?.semana === week
      ? comentariosDeRuedaDePrensa(pName, playerProfile.ultimaPrensa.saldo, week)
          .map((c, i) => ({
            id: `prensa_${week}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 600 + Math.floor(Math.random() * 8000),
            commentsCount: 80 + Math.floor(Math.random() * 1500),
            timestamp: 'Hace instantes',
            avatar: c.avatar,
          }))
      : [];

    // La ELIMINACION pisa a todo lo demas: si el equipo quedo afuera, esa es la noticia. El resto
    // del feed sigue mirando tu calificacion individual, y una buena nota no salva a nadie cuando
    // se acabo el torneo.
    // LA PREVIA DEL CLASICO. Un clasico que no se anticipa no es un clasico: la mitad de lo que lo
    // hace especial es la semana previa. Si el partido pesa mas pero nadie lo dice, el jugador solo
    // ve un numero raro al final.
    const previaDeClasico: SocialPost[] = nextMatchOpponent?.club
      && esClasico(currentClub.id, nextMatchOpponent.club.id)
      ? postsDePreviaDeClasico(currentClub.name, nextMatchOpponent.club.name, week)
          .map((c, i) => ({
            id: `clasico_${week}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 8000 + Math.floor(Math.random() * 30000),
            commentsCount: 1500 + Math.floor(Math.random() * 6000),
            timestamp: 'Semana de clásico', avatar: c.avatar,
          }))
      : [];

    // EL REFUERZO QUE TE TAPA, en las fechas siguientes a su llegada. Sin este aviso el fichaje
    // seria un numero invisible que te manda al banco sin explicacion, y eso se lee como un bug.
    const llegadaDelRefuerzo: SocialPost[] = playerProfile.fichajeRival
      && week - playerProfile.fichajeRival.desdeSemana >= 0
      && week - playerProfile.fichajeRival.desdeSemana <= 2
      ? postsDeRefuerzo(pName, playerProfile.fichajeRival.nombre, playerProfile.fichajeRival.posicion,
          currentClub.name, week)
          .map((c, i) => ({
            id: `refuerzo_${playerProfile.fichajeRival!.desdeSemana}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 2000 + Math.floor(Math.random() * 9000),
            commentsCount: 300 + Math.floor(Math.random() * 2000),
            timestamp: 'Mercado de pases', avatar: c.avatar,
          }))
      : [];

    // LA LISTA DE TRANSFERIBLES, en el feed. Un aviso en un toast se lee una vez y se va; que la
    // prensa hable de que estás en la lista es lo que lo convierte en una situación que estás
    // atravesando. Se mantiene MIENTRAS estés en la lista y no sólo el día que te ponen: es
    // justamente lo que no te deja olvidarte.
    const enLaLista: SocialPost[] = playerProfile.listaDeTransferibles
      ? postsDeListaDeTransferibles(
          pName, currentClub.name,
          playerProfile.fichajeRival?.nombre ?? null,
          (playerProfile.listaDeTransferibles.temporadas ?? 0) >= 1,
          week)
          .map((c, i) => ({
            id: `lista_${playerProfile.listaDeTransferibles!.desdeSemana}_${playerProfile.listaDeTransferibles!.temporadas}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 3000 + Math.floor(Math.random() * 12000),
            commentsCount: 600 + Math.floor(Math.random() * 3000),
            timestamp: 'Mercado de pases', avatar: c.avatar,
          }))
      : [];

    // EL BAUTIZO. Dura dos fechas y despues se apaga: quien lo dijo primero es media noticia, pero
    // repetirlo toda la temporada lo gastaria. El apodo queda igual en la ficha, para siempre.
    const elBautizo: SocialPost[] = playerProfile.apodoAnunciado && miApodo
      && week - playerProfile.apodoAnunciado.semana >= 0
      && week - playerProfile.apodoAnunciado.semana <= 2
      ? postsDelBautizo(pName, miApodo.apodo, miApodo.porque, currentClub.name, week)
          .map((c, i) => ({
            id: `bautizo_${playerProfile.apodoAnunciado!.apodo}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 4000 + Math.floor(Math.random() * 14000),
            commentsCount: 500 + Math.floor(Math.random() * 2600),
            timestamp: 'Hace instantes', avatar: c.avatar,
          }))
      : [];

    // LA HEMEROTECA. Sale cuando la situacion de hoy contrasta con algo que dijiste hace rato: te
    // pusieron en la lista, te fuiste del club donde lo dijiste, o saliste campeon despues de
    // hablar fuerte. Si nada de eso pasa, el archivo se queda cerrado.
    const delArchivo: SocialPost[] = (() => {
      const cita = laHemerotecaTeRecuerda(playerProfile.declaraciones ?? [], {
        semana: week,
        clubId: playerProfile.currentClubId,
        clubName: currentClub.name,
        enLaLista: !!playerProfile.listaDeTransferibles,
        // La temporada que acabas de cerrar, con titulo o sin el. Sin vueltas: cualquier cuenta
        // mas fina necesitaria el paso en que arranco la temporada, que no se guarda.
        ganasteTitulo: !!playerProfile.seasonHistory.at(-1)?.titulo,
      });
      if (!cita) return [];
      return postsDeHemeroteca(pName, cita.declaracion.texto, cita.marco, cita.aFavor, week)
        .map((c, i) => ({
          id: `archivo_${cita.declaracion.semana}_${i}`,
          author: c.author, role: c.role, content: c.content,
          likes: 2500 + Math.floor(Math.random() * 11000),
          commentsCount: 400 + Math.floor(Math.random() * 2400),
          timestamp: 'Del archivo', avatar: c.avatar,
        }));
    })();

    // TU CLASICO PERSONAL, en la previa. El que te ganaste jugando, no el del catalogo: puede ser
    // cualquier equipo mediano al que le hiciste seis goles seguidos.
    const miClasico = clasicoPersonalContra(
      nextMatchOpponent?.club
        ? playerProfile.headToHeadRecords?.[nextMatchOpponent.club.name]
        : null);
    const previaDeMiClasico: SocialPost[] = miClasico
      ? postsDeClasicoPersonal(pName, miClasico.rivalName, miClasico.tipo, miClasico.titular,
          miClasico.detalle, week)
          .map((c, i) => ({
            id: `miclasico_${miClasico.rivalName}_${week}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 3000 + Math.floor(Math.random() * 12000),
            commentsCount: 500 + Math.floor(Math.random() * 2500),
            timestamp: 'Previa', avatar: c.avatar,
          }))
      : [];

    // EL PIBE, la temporada en que se define su carrera. Dura tres fechas: es una noticia, no un
    // estado.
    const elPibeEnElFeed: SocialPost[] = (() => {
      const pibe = playerProfile.elPibe;
      if (!pibe?.destino) return [];
      if (week - pibe.destino.semana < 0 || week - pibe.destino.semana > 3) return [];
      return postsDelPibe(pibe.nombre, pibe.destino.relato, loQueDiceDeVos(pibe, pName),
        pibe.destino.que !== 'perdido', week)
        .map((c, i) => ({
          id: `pibe_${pibe.nombre}_${pibe.destino!.semana}_${i}`,
          author: c.author, role: c.role, content: c.content,
          likes: 3500 + Math.floor(Math.random() * 13000),
          commentsCount: 600 + Math.floor(Math.random() * 2700),
          timestamp: 'Hace instantes', avatar: c.avatar,
        }));
    })();

    // TU PUBLICACION y lo que le respondieron. Va primero de todo: lo dijiste vos.
    const miPost: SocialPost[] = playerProfile.miPublicacion?.semana === week
      ? [
          {
            id: `mio_${week}`,
            author: pName, role: 'Tú', content: playerProfile.miPublicacion.texto,
            likes: 5000 + Math.floor(Math.random() * 40000),
            commentsCount: 800 + Math.floor(Math.random() * 5000),
            timestamp: 'Hace instantes', avatar: '⭐',
          },
          ...respuestasAMiPublicacion(pName, playerProfile.miPublicacion.saldo, week)
            .map((c, i) => ({
              id: `respuesta_${week}_${i}`,
              author: c.author, role: c.role, content: c.content,
              likes: 900 + Math.floor(Math.random() * 7000),
              commentsCount: 100 + Math.floor(Math.random() * 1200),
              timestamp: 'Hace instantes', avatar: c.avatar,
            })),
        ]
      : [];

    // LA LISTA DE CONVOCADOS, el dia que hay fecha FIFA.
    //
    // Se declara ACA, junto al resto del feed y no arriba del archivo, porque las constantes de este
    // componente se leen en orden: una lectura antes de su declaracion desmonta el arbol de React
    // entero y deja la pantalla en negro (ya paso una vez con conmebolCupId).
    //
    // La regla de si estas convocado NO se decide aca: sale de evaluarConvocatoria, la misma que usa
    // App.tsx el dia del partido. Si el feed tuviera su propia copia, tarde o temprano anunciaria una
    // lista a la que el juego despues no te lleva.
    const hoyEsFechaFifa = (() => {
      if (!hasDatedLeagueSchedule(currentClub.name)) return false;
      const paso = fixturesAtStep(currentClub.name, playerProfile.currentWeek);
      const fx = paso ? pickDatedPrimary(paso.fixtures) : null;
      return fx?.competition.id === 'eliminatorias';
    })();

    const laConvocatoria: SocialPost[] = (() => {
      if (!hoyEsFechaFifa) return [];
      const estado = evaluarConvocatoria(playerProfile, anioDeCarrera(currentClub.name, playerProfile.currentWeek));
      if (!estado.seleccion || !estado.hayEliminatorias) return [];

      const dt = estado.seleccion.dt || 'El cuerpo técnico';
      const nomina = laNomina(estado, pName);
      // La nomina va como publicacion propia y arriba de las opiniones: primero el hecho, despues lo
      // que se dice del hecho. Los nombres son los REALES de la base, no un relleno hasta 23.
      const listado: SocialPost[] = nomina.length > 0 ? [{
        id: `nomina_${week}`,
        author: estado.seleccion.name,
        role: 'Selección nacional',
        content: `📋 LISTA DE CONVOCADOS · ${dt}\n\n${nomina.map(j => (j.esVos ? `⭐ ${j.nombre}` : `· ${j.nombre}`)).join('\n')}`
          + (estado.convocado ? '' : `\n\n${motivoDeAusencia(estado) ?? ''}`),
        likes: 12000 + Math.floor(Math.random() * 60000),
        commentsCount: 2000 + Math.floor(Math.random() * 9000),
        timestamp: 'Fecha FIFA',
        avatar: estado.seleccion.badgeLogoUrl || '🌍',
      }] : [];

      return [
        ...listado,
        ...postsDeConvocatoria(pName, estado.seleccion.name, dt, estado.convocado, motivoDeAusencia(estado), week)
          .map((c, i) => ({
            id: `convocatoria_${week}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 4000 + Math.floor(Math.random() * 22000),
            commentsCount: 600 + Math.floor(Math.random() * 4000),
            timestamp: 'Fecha FIFA', avatar: c.avatar,
          })),
      ];
    })();

    // EL MOMENTO DE FORMA. Solo habla cuando HAY racha: si comentara todas las fechas seria ruido, y
    // el feed ya tiene bastante. Con racha definida, en cambio, es lo mas comentable que hay.
    const laForma: SocialPost[] = (() => {
      const f = evaluarForma(playerProfile.formaReciente, playerProfile.currentWeek);
      if (f.estado === 'normal' || f.promedio == null) return [];
      return postsDeForma(pName, currentClub.name, f.estado === 'en_racha', f.seguidos, f.promedio, week)
        .map((c, i) => ({
          id: `forma_${week}_${i}`,
          author: c.author, role: c.role, content: c.content,
          likes: 2500 + Math.floor(Math.random() * 16000),
          commentsCount: 400 + Math.floor(Math.random() * 3000),
          timestamp: 'Hace instantes', avatar: c.avatar,
        }));
    })();

    // EL BAJON ANIMICO (ver animo.ts). Es lo unico del feed que el jugador no provoco jugando, asi
    // que las voces lo tratan distinto: nadie lo insulta por esto.
    const elBajon: SocialPost[] = estaEnBajon(playerProfile)
      ? postsDelBajon(pName, currentClub.name, week).map((c, i) => ({
          id: `bajon_${week}_${i}`,
          author: c.author, role: c.role, content: c.content,
          likes: 3000 + Math.floor(Math.random() * 14000),
          commentsCount: 500 + Math.floor(Math.random() * 2500),
          timestamp: 'Hace instantes', avatar: c.avatar,
        }))
      : [];

    // EL RIVAL DE CARRERA (ver rivalDeCarrera.ts). Son los DEMAS los que te comparan, que es de lo
    // que se trata: la comparacion no vale si te la haces vos solo mirando un panel.
    const laComparacion: SocialPost[] = miRival && playerProfile.careerStats.partidosHistoricos >= 20
      ? postsDelRivalDeCarrera(pName, miRival.rival.nombre, miRival.rival.clubName, miRival.quien === 'vos', week)
          .map((c, i) => ({
            id: `rival_${week}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 2000 + Math.floor(Math.random() * 15000),
            commentsCount: 400 + Math.floor(Math.random() * 2800),
            timestamp: 'Hace instantes', avatar: c.avatar,
          }))
      : [];
    // LA REHABILITACION. Mientras dure la lesion el feed la sigue: sin esto el tramo de baja es una
    // pantalla muda con un numero bajando, que es exactamente lo que hacia que la lesion se sintiera
    // un castigo y no una parte de la carrera.
    const parteMedico: SocialPost[] = playerProfile.activeInjury && playerProfile.activeInjury.weeksRemaining > 0
      ? postsDeLesion(pName, currentClub.name, playerProfile.activeInjury.weeksRemaining,
          playerProfile.activeInjury.treatmentChoice === 'forzar', week)
          .map((c, i) => ({
            id: `lesion_${week}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 1500 + Math.floor(Math.random() * 11000),
            commentsCount: 250 + Math.floor(Math.random() * 2500),
            timestamp: 'Parte médico', avatar: c.avatar,
          }))
      : [];

    const golpeDeEliminacion: SocialPost[] = playerProfile.ultimaEliminacion?.semana === week
      ? postsDeEliminacion(pName, playerProfile.ultimaEliminacion.competicion, currentClub.name, week)
          .map((c, i) => ({
            id: `elim_${week}_${i}`,
            author: c.author, role: c.role, content: c.content,
            likes: 3000 + Math.floor(Math.random() * 15000),
            commentsCount: 500 + Math.floor(Math.random() * 3000),
            timestamp: 'Hace instantes',
            avatar: c.avatar,
          }))
      : [];

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
      ...previaDeClasico,
      ...previaDeMiClasico,
      ...miPost,
      ...elPibeEnElFeed,
      ...elBautizo,
      ...delArchivo,
      ...llegadaDelRefuerzo,
      ...enLaLista,
      // La lista de convocados va arriba de casi todo: el dia que sale, es LA noticia.
      ...laConvocatoria,
      ...parteMedico,
      ...laForma,
      ...elBajon,
      ...laComparacion,
      ...golpeDeEliminacion,
      ...ecoDePrensa,
      ...reacciones,
      // Despues de las reacciones al partido y antes del resto: la carrera del Balon de Oro es
      // contexto de la temporada, no la noticia del dia. Si fuera primero taparia lo que acabas de
      // hacer en la cancha, que es lo unico del feed que responde a vos.
      ...carreraBalonDeOro,
      ...generateRetirementPosts(),
      ...generateJournalistPosts(),
      ...generateCelebrityShoutoutPost(),
      ...generateCriticalPressPost(),
      ...selectedBasePosts,
      ...generateMatchdayReactionPosts(),
      ...generateOwnTransferRumorPosts(),
      ...generateRivalryPosts(),
      ...generateRivalTransferBuzzPosts(),
      ...generateOtherPlayersCritiquePosts(),
      ...generateTransferAnnouncementPosts(),
      ...generateCupChampionPosts()
    // EL FEED TIENE TOPE, Y EL ORDEN DE ARRIBA ES LA PRIORIDAD.
    //
    // Son 28 fuentes y hasta acá se dibujaban TODAS. Medido en una fecha donde pasa todo junto --
    // te bautizaron, se abrió la hemeroteca, al pibe lo vendieron a Europa, estás en la lista,
    // llegó un refuerzo para tu puesto, estás lesionado y encima jugaste un 9.1 -- salían CINCUENTA
    // posts de una sentada. Nadie lee cincuenta posts: lo que pasa es que lo importante se pierde
    // adentro del resto, que es lo contrario de para lo que existe el feed.
    //
    // El corte es un slice a secas y puede serlo porque el orden de arriba no es casual: primero lo
    // que te pasó a VOS esta fecha, después el contexto, y al final el relleno genérico que se
    // repite todas las semanas. Cortar por abajo tira exactamente lo que sobra.
    ].slice(0, POSTS_EN_EL_FEED);
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
    onAnswerPress(opt.prestigeChange, opt.fansChange, opt.energyChange, opt.text);
    setPressReaction(opt.reaction);
    setPressResponseState('answered');
  };

  // La pregunta de esta semana se deriva de la semana de carrera (no es un estado libre que se
  // pudiera ciclear para reintentar) -- cada semana nueva trae una conferencia distinta. Se usa un
  // hash de la semana en vez de currentWeek % length para que el orden se sienta random en vez de
  // repetir siempre el mismo ciclo 1,2,3... Tu primerísima rueda de prensa de la carrera
  // (lastPressAnsweredWeek === 0, nunca respondiste ninguna) siempre es la entrevista de Mau Sports.
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
  // Temporada que el jugador está cursando. Todo lo que muestra el calendario se recorta a ésta.
  const temporadaEnCurso = temporadaDelPaso(currentClub.name, playerProfile.currentWeek)?.temporada
    ?? temporadaDeCarrera(currentClub.name, playerProfile.currentWeek);

  const calendarEvents: CalendarEvent[] = [];

  // ¿Ya cerraron TODAS tus competencias reales de este año calendario (liga, copa nacional, copa
  // continental, UEFA)? El motor sigue generando partidos sintéticos de relleno para que la carrera
  // nunca se trabe, así que "siempre hay próximo partido" -- eso es justo lo que hacía que el
  // jugador nunca se enterara de que su año ya había terminado. Pedido explícito: "que el boton de
  // disputar partido cambie a finalizar temporada" cuando no quede nada real pendiente.
  //
  // Liga: en formato Apertura/Clausura, solo cuenta como año cerrado si YA SE JUGÓ el Clausura
  // (semester 2 y stage 'done') -- terminar el Apertura no es fin de año, falta el segundo semestre.
  // En formato de un solo torneo con calendario real (Brasil), el fixture guardado en el perfil
  // trae 380 partidos de TODA la liga -- no solo los del club -- y la mayoría quedan sin jugar
  // aunque tu participación ya haya terminado, así que "fixtures completo" no sirve de criterio.
  // Se usa la FECHA real en cambio: si ya pasó la última fecha de liga del calendario real, cerró
  // (calendarioDeLigaAgotado se corta sola pasado el año calendario de los datos -- solo tenemos
  // 2026 -- para no quedar en "true" para siempre en los años siguientes, sin datos reales, donde
  // el criterio de fixtures completo tampoco puede aplicar: el motor sintético de esos años nunca
  // marca el fixture de 380 partidos como terminado. El botón "Finalizar Temporada" solo aparece en
  // el primer año con datos reales; en los siguientes la carrera sigue por el motor sin ese aviso).
  // SIN ESTADO DE LIGA NO ES QUE EL AÑO TERMINO: ES QUE NO EMPEZO.
  //
  // leagueSeasons esta indexado por liga, asi que al llegar a un pais nuevo esa clave todavia no
  // existe -- y dar eso por "temporada cerrada" ofrecia "Finalizar Temporada" en el primer dia con
  // el club nuevo. El boton gasta una fecha del calendario (handleFinalizeSeason avanza el paso), y
  // si esa fecha tenia partido, el partido se perdia. Medido en 19 carreras completas: pasa justo
  // despues del primer traspaso -- el que se fue del Dortmund al Sassuolo y el que se fue del Inter
  // al Villarreal lo sufrieron los dos en su fecha 80.
  //
  // Con calendario real la pregunta se la contesta el CALENDARIO, que es quien sabe si al club le
  // quedan fechas de liga este año. Sin calendario real se mantiene el criterio viejo: no hay con
  // que jugar, el año se cierra.
  const ligaCerradaElAnio = !myLeagueSeason
    ? (hasDatedLeagueSchedule(currentClub.name)
        ? calendarioDeLigaAgotado(currentClub.name, playerProfile.currentWeek)
        : true)
    : isApeturaClausuraLeague(currentClub.league)
    ? myLeagueSeason.semester === 2 && myLeagueSeason.stage === 'done'
    : hasDatedLeagueSchedule(currentClub.name)
    ? calendarioDeLigaAgotado(currentClub.name, playerProfile.currentWeek)
    : myLeagueSeason.fixtures.length > 0 && !myLeagueSeason.fixtures.some(f => !f.played);
  const copaNacionalCerradaElAnio = (() => {
    if (!tieneCopaNacionalReal(currentClub.league)) return true;
    const cupYearNacional = temporadaDeCarrera(currentClub.name, playerProfile.currentWeek);
    const cupKeyNacional = `${currentClub.league}-${cupYearNacional}`;
    const cupNacional = playerProfile.domesticCups?.[cupKeyNacional];
    // Sin estado guardado todavía: no se armó el cuadro, no hay nada pendiente que bloquee el cierre.
    if (!cupNacional) return true;
    return !sigueEnCopa(cupNacional, currentClub.id);
  })();
  const copaContinentalCerradaElAnio = !conmebolCup || !isClubStillInCup(conmebolCup, currentClub.id);
  const copaUefaCerradaElAnio = !uefaCup || !isClubStillInUefaCup(uefaCup, currentClub.id);
  // Y LAS FECHAS DE SELECCION CUENTAN COMO TORNEO PENDIENTE.
  //
  // Sin esto, un club cuya liga cierra antes que el Mundial daba el año por terminado con fechas
  // FIFA todavia por delante: el boton pasaba a "Finalizar Temporada", la tarjeta seguia anunciando
  // "Local vs Seleccion de Colombia" y no habia con que jugarlo. Medido con el Porto -- la Primeira
  // Liga cierra el 16 de mayo y el Mundial va de junio a julio: cuatro partidos anunciados y
  // ninguno jugable. En 32 carreras, de 126 partidos de Mundial anunciados solo 43 se pudieron
  // jugar.
  const mundialPendienteElAnio = hasDatedLeagueSchedule(currentClub.name)
    && quedanFechasDeSeleccion(currentClub.name, playerProfile.currentWeek);
  const temporadaRealTerminada = ligaCerradaElAnio && copaNacionalCerradaElAnio
    && copaContinentalCerradaElAnio && copaUefaCerradaElAnio && !mundialPendienteElAnio;

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

    // Sólo la temporada en curso: fixturesForClub concatena las 32, y sin este recorte los
    // partidos de años siguientes entraban al mismo mapa. La grilla filtra por mes y año, así que
    // bastaba con avanzar de mes para ver el fixture del año que viene -- o peor, el de esta
    // temporada repetido con otro año encima. Reportado: "te muestra el mismo 2026 en el 2027".
    for (const f of fixturesForClub(currentClub.name)) {
      if (f.temporada !== temporadaEnCurso) continue;
      const paso = pasoDeFecha(currentClub.name, f.date);
      const yaJugado = paso !== null && paso < pasoActual;
      const rival = resolverRivalDeLaFecha(
        ULTIMATE_CLUBS_DATABASE, f, currentClub,
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
      // El NOMBRE del torneo de esta celda. En un día ya jugado sale del resultado guardado, que es
      // el único que sabe qué copa se jugó de verdad: los días de copa son una bolsa compartida y el
      // calendario sólo sabe cuál los pidió. Un día reservado por la Copa MX lo puede terminar
      // jugando la Concacaf, y hasta ahora el calendario seguía diciendo Copa MX para siempre.
      // (Para la liga no: ahí el resultado guarda "Liga MX" y la celda tiene que decir Apertura o
      // Clausura, que es información que el resultado no trae.)
      const etiqueta = f.esReservaDeCuadro && porFecha
        ? nombreCortoDeTorneo(porFecha.competition)
        : etiquetaCompetencia(f.competition, f.date, f.esReservaDeCuadro);
      const familia = familiaDeTorneo(etiqueta, f.competition.kind, f.esPlayoff);
      calendarEvents.push({
        date: new Date(`${f.date}T00:00:00`),
        label: etiqueta,
        // En una fecha RESERVADA para la copa el rival todavía no existe: depende de cómo terminen
        // las rondas anteriores. Decirlo es más honesto que mostrar el cartel de relleno.
        // En una copa se dice la RONDA además del rival: no es lo mismo unos octavos que una final,
        // y el dato ya venía en el calendario sin usarse.
        // Un día de PLAYOFF trae rival escrito, pero no es el que vas a jugar: los cuadrangulares se
        // siembran con la tabla de TU carrera (ver prepararPlayoffDeLiga) y el cruce casi nunca
        // coincide con el que hubo en la realidad. El calendario anunciaba "vs Once Caldas" y salías
        // contra Deportes Tolima. Reportado: "el calendario muestra otro equipo y partido".
        // Un día que ya no lo juega nadie no tiene "rival por definir": no va a haber rival. Decir
        // las dos cosas en la misma celda -- "Libre" arriba y un rival pendiente en el globo -- es
        // la clase de contradicción que hace dudar de si el calendario está roto.
        sublabel: etiqueta === 'Libre'
          ? 'El calendario apartó este día para una copa en la que tu club ya no está'
          : f.esReservaDeCuadro || f.esPlayoff
          ? 'Rival por definir'
          : `${f.competition.kind !== 'league' && f.match.round ? rondaCorta(f.match.round) + ' · ' : ''}${f.isHome ? 'vs.' : '@'} ${rival?.name ?? f.opponentName}`,
        // El color es SIEMPRE el del torneo, también en los partidos ya jugados: antes se lo comía
        // el color del resultado y la celda pasada perdía todo rastro de qué torneo era. El
        // resultado se dice adentro, en su propia fichita.
        colorClass: COLOR_DE_TORNEO[familia].pastilla,
        cellClass: COLOR_DE_TORNEO[familia].celda,
        // Sin escudo tampoco: mostrar el del rival del calendario al lado de "Rival por definir" es
        // decir dos cosas distintas en la misma celda, y el escudo es la que se mira primero.
        opponentClub: f.esReservaDeCuadro || f.esPlayoff ? undefined : (rival ?? undefined),
        played: !!marcador,
        result: marcador ? resultFromScore(marcador.myGoals, marcador.rivalGoals) : undefined,
        score: marcador ? `${marcador.myGoals}-${marcador.rivalGoals}` : undefined,
        esHoy: paso === pasoActual,
      });
    }
  }

  // NOTA: acá vivían dos bloques enteros para clubes SIN calendario de fechas -- una grilla de
  // meses armada a partir de getRealDateForLeagueStepsAhead/Behind y del reparto isCupWeek, y su
  // historial equivalente. 300 líneas que dibujaban el calendario del OTRO motor.
  //
  // Se borraron el 12 de agosto de 2026: desde que sólo se puede hacer carrera en clubes con
  // calendario propio (ver clubesJugables.ts), `usaFechasEnCalendario` es siempre true y esa rama
  // no la alcanzaba nadie. Mientras existió, las dos vistas del mismo día podían no coincidir.

  // --- Historial: partidos YA jugados, con su resultado real (V/E/D + marcador) -- antes el
  // calendario solo mostraba fechas futuras y perdía todo rastro apenas se jugaba el partido (bug
  // reportado: "cuando pasa la fecha se borra del calendario"). Mismo truco de "pasos" que arriba,
  // pero contando hacia atrás con getRealDateFor...StepsBehind, del partido más reciente al más viejo.
  //
  // Solo para clubes SIN fechas reales. Con calendario real este bloque volvía a agregar los mismos
  // partidos con fechas calculadas por semanas, y aparecían días con dos y tres partidos que no
  // existen ("en el calendario salen otros partidos que no sé de dónde salen"). Ahí arriba el
  // calendario ya incluye los jugados con su resultado, en su fecha verdadera.

  // El mes que abre el calendario es el del partido de HOY, tomado del calendario real.
  //
  // getRealDate cuenta semanas de 7 días desde el arranque de carrera, y con fechas reales eso ya
  // no coincide: en el paso 18 (9 de abril de verdad) daba mediados de mayo, así que el calendario
  // abría en un mes equivocado y los partidos de Libertadores "no aparecían" -- estaban, pero en
  // abril, y la grilla mostraba mayo.
  const calendarBaseDate = (() => {
    const fecha = fechaDelPaso(currentClub.name, playerProfile.currentWeek);
    return fecha ? new Date(`${fecha}T00:00:00`) : new Date();
  })();
  // EL CALENDARIO NO SALE DE LA TEMPORADA EN CURSO.
  //
  // Las flechas movían el mes sin tope, y más allá del último partido del año la grilla volvía a
  // mostrar el fixture de 2026 fechado en 2027: fixturesForClub concatena las 32 temporadas y el
  // filtro de la grilla es por mes y año, así que un partido de la temporada 2 con la misma fecha
  // de calendario se colaba como si fuera de ésta. Reportado: "se bugea y te muestra el mismo 2026
  // en el 2027".
  //
  // El jugador ve el año que está jugando y nada más -- que además es lo correcto: el fixture de la
  // temporada que viene todavía no está sorteado.
  const mesesEntre = (a: Date, b: Date) =>
    (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  const fechasDeLaTemporada = fixturesForClub(currentClub.name).filter(f => f.temporada === temporadaEnCurso);
  const limiteDeMeses = (() => {
    if (!fechasDeLaTemporada.length) return { min: 0, max: 0 };
    const primera = new Date(`${fechasDeLaTemporada[0].date}T00:00:00`);
    const ultima = new Date(`${fechasDeLaTemporada[fechasDeLaTemporada.length - 1].date}T00:00:00`);
    return { min: mesesEntre(calendarBaseDate, primera), max: mesesEntre(calendarBaseDate, ultima) };
  })();
  const mesVisible = Math.min(limiteDeMeses.max, Math.max(limiteDeMeses.min, calendarMonthOffset));
  const calendarGridDate = new Date(calendarBaseDate.getFullYear(), calendarBaseDate.getMonth() + mesVisible, 1);
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

      {/* LA COLUMNA DE LA IZQUIERDA VA AL FINAL EN CELULAR.

          En el teléfono la raíz es una columna, así que esto -- la ficha profesional, el menú de
          escritorio, reportar un bug, guardar y salir -- caía ARRIBA DE TODO, en todas las
          pestañas. Entrabas a Entrenamiento y lo primero que veías era tu propia ficha; cualquier
          re-render te devolvía ahí y había que bajar de nuevo para tocar el botón que acababas de
          tocar. Reportado tal cual: "me toca bajar para de nuevo entrenar, no es nada cómodo".

          Ahora es lo último: identidad y salidas al pie, que es donde se buscan. La navegación de
          verdad ya vive en la barra de abajo (ver BarraDeApp). En escritorio es la columna
          izquierda de siempre. */}
      {/* EL COLCHÓN DE ABAJO ES DE ESTE BLOQUE, no del panel.

          Estaba en el panel de contenido, que era lo último de la pantalla. Al bajar la ficha al
          pie dejó de serlo, y entonces la barra de abajo y los botones flotantes de música y sonido
          se comieron el final de esta columna: "Guardar & Salir" y "Reiniciar Datos de Carrera" no
          se veían. Reportado con captura.

          `pb-28` y no `pb-20` porque acá abajo hay DOS cosas encimadas, no una: la barra (56px) y
          los botones flotantes, que viven por arriba de ella. */}
      <aside className={`order-last md:order-none w-full md:w-64 bg-slate-950 border-t md:border-t-0 md:border-r border-slate-800 flex flex-col justify-between p-3 ${COLCHON_DE_LA_FICHA} z-20`}>
        <div className="space-y-4">

          <div className="p-3 flex items-center gap-3 border-b border-slate-800">
            <div className="w-9 h-9 bg-gold-500 hover:bg-gold-400 transition-colors rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,132,46,0.3)]">
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
              {playerProfile.dorsal != null && (
                /* LA CAMISETA. Las tres que significan algo van resaltadas: hay una por plantel y
                   hubo que ganarsela. Un 27 es un numero; la 10 es la 10. Ver src/laCamiseta.ts. */
                <span
                  data-camiseta={llevoUnaDeLasGrandes ? String(playerProfile.dorsal) : undefined}
                  title={llevoUnaDeLasGrandes
                    ? 'Al que la lleva lo marcan mas y le exigen mas.'
                    : undefined}
                  className={llevoUnaDeLasGrandes
                    ? 'text-gold-300 bg-gold-500/15 border border-gold-500/30 rounded px-1'
                    : 'text-gold-400'}
                >
                  #{playerProfile.dorsal}
                </span>
              )} {playerProfile.name}
            </h2>
            {/* EL APODO, debajo del nombre y entre comillas, como lo escribiría un diario. No se
                elige: se gana con lo que hacés en la cancha (ver src/apodo.ts), y por eso lleva el
                porqué en el title -- un apodo sin explicación es un adorno. */}
            {miApodo && (
              <p data-apodo={miApodo.apodo} className="text-2xs text-gold-400 font-bold truncate mt-0.5" title={miApodo.porque}>
                “{miApodo.apodo}”
              </p>
            )}
            <div className="flex justify-between items-center gap-2 text-3xs text-slate-400 font-mono mt-1">
              <span className="truncate">{playerProfile.position}</span>
              <span className="shrink-0">{playerProfile.age} años{playerProfile.heightCm != null ? ` · ${playerProfile.heightCm}cm` : ''}</span>
            </div>
            
            <div className={`mt-2.5 p-2 rounded-xl text-xs font-bold truncate flex items-center gap-1.5 ${currentClub.badgeColor}`}>
              <ClubBadge club={currentClub} size={20} colorFallback={false} className="bg-black/25 font-normal" />
              <span className="truncate">{currentClub.name}</span>
            </div>
          </div>

          {/* La lista completa es la navegación de ESCRITORIO (`hidden md:block`). En celular las
              secciones viven en la barra de abajo (ver BarraDeApp), que además tiene su propia hoja
              para las siete que no entran; tener las dos era el mismo menú dos veces.

              Y salen de SECCIONES y no una por una: el tamaño táctil, el foco y los roles
              de accesibilidad se tocan en un solo lugar en vez de en once botones copiados. */}
          <nav
            id="nav-principal"
            role="tablist"
            aria-orientation="vertical"
            aria-label="Secciones de la carrera"
            className="space-y-1 hidden md:block"
          >
            {/* min-h-[44px]: los botones quedaban en ~36px de alto, por debajo de la guía de zona
                táctil. En escritorio no se nota; con el pulgar, sí. */}
            {/* EN HARDCORE NO HAY ENTRENAMIENTO. No se deshabilita el boton: se saca. Un boton
                apagado sigue prometiendo algo que en este modo no existe, y la promesa del modo es
                justamente que no elegis vos como crecer -- crecés jugando (ver src/modoHardcore.ts). */}
            {SECCIONES.filter(s => !(playerProfile.hardcoreEnabled && s.key === 'entrenamiento')).map(({ key, label, Icon }) => {
              const activa = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`tab-${key}`}
                  aria-selected={activa}
                  aria-controls="panel-seccion"
                  onClick={() => {
                    setActiveTab(key);
                    // En móvil el menú se cierra solo al elegir: dejarlo abierto obligaba a subir y
                    // cerrarlo a mano para llegar al contenido que se acaba de pedir.
                    setNavAbiertoEnMovil(false);
                  }}
                  className={`btn-fx-subtle w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 ${activa ? 'bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
                >
                  <Icon size={15} /> {label}
                  {key === 'logros' && (
                    <span className={`ml-auto text-3xs font-mono ${activa ? 'text-slate-800' : 'text-slate-400'}`}>
                      {Object.keys(playerProfile.unlockedAchievements).length}/{ACHIEVEMENTS_DATABASE.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-slate-800">
          {/* REPORTAR BUG. Va acá, con los controles de la partida y no escondido en una pestaña,
              porque se usa JUSTO cuando algo se vio raro: si hay que buscarlo, el momento se pasa y
              el estado que había que fotografiar ya cambió de paso. Ver src/reporteDeBug.ts. */}
          <ReportarBug perfil={playerProfile} clubes={ULTIMATE_CLUBS_DATABASE} />
          <button
            onClick={onLogout}
            className="btn-fx-subtle w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 text-2xs font-mono transition-colors text-left cursor-pointer"
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

      {/* min-w-0 NO es decorativo: sin el, nada de lo que hay adentro puede limitar su ancho.
          Un item flex arranca con `min-width: auto`, o sea que NO se encoge por debajo del ancho de
          su contenido: <main> se estiraba para caber y el que se desbordaba era la pagina entera.
          Por eso la tira de metricas del header no envolvia aunque se lo pidieramos -- nunca se
          quedaba sin espacio -- y la ultima tarjeta quedaba cortada contra el borde de la ventana,
          alcanzable solo con scroll horizontal. Reportado con captura: "mira como lo ultimo no
          entra".
          Los tres bloques anchos de adentro (las tablas) ya traen su propio overflow-x-auto, asi que
          limitar aca no los rompe: cada uno se desliza dentro de si mismo, que es como debe ser. */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* NO es sticky. Se probó pegada arriba para que el capital siguiera a la vista en
            Entrenamiento, y en uso real tapaba contenido al bajar: molestaba más de lo que
            resolvía. Se queda arriba de todo y se va con el scroll, como cualquier encabezado. */}
        {/* EL ENCABEZADO SON DOS FILAS TAMBIEN EN ESCRITORIO, y esto se aprendio a los golpes.
              La fecha ("martes 19 de enero de 2027") mas las siete metricas no entran en una sola
              fila ni en una pantalla ancha. Compartiendo fila solo hay dos finales posibles, y los
              dos se reportaron con captura: envolver a dos filas desparejas contra el borde derecho
              (se ve amontonado) o no envolver y que la ultima quede CORTADA (no se ve completo).
              Con la tira en su propia fila, entran las siete con aire de sobra. */}
        <header className="bg-slate-900 border-b border-slate-800 px-3 py-2 md:px-8 flex flex-col gap-2 md:gap-2.5">

          {/* shrink-0 + nowrap en la fecha: sin esto el bloque se encogía contra la tira de
              métricas y "miércoles 11 de marzo de 2026" se partía en tres renglones, que era lo
              que estiraba la barra a lo alto. */}
          <div className="flex gap-1.5 items-center flex-wrap shrink-0">
            {/* La JORNADA del torneo, no el paso de carrera. "FECHA" en futbol significa jornada, y
                aca se mostraba currentWeek, que cuenta tambien los dias de copa y las fechas FIFA:
                con Tigres decia "FECHA 21" jugando la 13 del Clausura, que solo tiene 17. */}
            <span className="text-gold-400 text-sm font-black">
              {jornadaDeHoy ? `FECHA ${jornadaDeHoy.jornada}/${jornadaDeHoy.total}` : `DIA ${playerProfile.currentWeek}`}
            </span>
            <span className="text-slate-500 text-2xs whitespace-nowrap">· {fechaEnPantalla}</span>
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

          {/* LA TIRA DE ESTADO vive en src/components/BarraDeEstado.tsx.
              Eran SIETE copias del mismo bloque de veinte lineas -- ciento cuarenta lineas para
              mostrar siete numeros -- y por eso nunca mejoraba: cualquier cambio de forma habia que
              hacerlo siete veces. Ahi esta explicado por que en escritorio se veia amontonada. */}
          <BarraDeEstado
            metricas={[
              { clave: 'energia', rotulo: 'Energía', Icono: Zap,
                colorIcono: 'text-burgundy-500', colorBarra: 'bg-burgundy-500',
                valor: playerProfile.energy, texto: `${playerProfile.energy}/100` },
              { clave: 'capital', rotulo: 'Capital', Icono: DollarSign,
                colorIcono: 'text-gold-400', colorBarra: '',
                valor: null, texto: `$${capitalQueCuenta.toLocaleString()}` },

              // COMO TE VE EL FUTBOL. "DT" y no "Relacion DT": es el rotulo largo de la tira y el
              // `title` deja el nombre completo a un hover. Los textos que EXPLICAN la metrica -- el
              // de la renovacion, por ejemplo -- la siguen nombrando entera.
              { clave: 'dt', rotulo: 'DT', nombreLargo: 'Relación con el DT', Icono: Star,
                colorIcono: 'text-yellow-400', colorBarra: 'bg-yellow-500',
                valor: playerProfile.prestige, texto: `${playerProfile.prestige}/100`,
                abreGrupo: true },
              { clave: 'plantel', rotulo: 'Plantel', nombreLargo: 'Relación con tus compañeros de plantel',
                Icono: Users, colorIcono: 'text-sky-400', colorBarra: 'bg-sky-500',
                valor: playerProfile.prestigeCompaneros ?? playerProfile.prestige,
                texto: `${playerProfile.prestigeCompaneros ?? playerProfile.prestige}/100` },
              { clave: 'hinchada', rotulo: 'Hinchada', Icono: Heart,
                colorIcono: 'text-rose-500', colorBarra: 'bg-rose-500',
                valor: playerProfile.fans, texto: `${playerProfile.fans}/100` },

              // LO QUE EL FUTBOL TE VA COSTANDO. Son las dos que bajan solas sin que hagas nada mal.
              { clave: 'entorno', rotulo: 'Entorno', nombreLargo: 'Familia y amigos', Icono: Home,
                colorIcono: 'text-emerald-400', colorBarra: 'bg-emerald-500',
                valor: playerProfile.entorno ?? 60, texto: `${playerProfile.entorno ?? 60}/100`,
                abreGrupo: true },
              { clave: 'mente', rotulo: 'Mente', Icono: Brain,
                colorIcono: 'text-sky-400', colorBarra: 'bg-sky-400',
                valor: playerProfile.mentalHealth, texto: `${playerProfile.mentalHealth}/100` },
            ]}
          />
        </header>

        {/* Un solo panel que cambia de contenido, en vez de once paneles ocultos: por eso lleva un
            id fijo y se etiqueta con la pestaña activa. Así un lector de pantalla anuncia en qué
            sección quedó parado al cambiar de pestaña. */}
        {/* pb-24 en móvil: los controles flotantes de música y sonido viven en las esquinas de abajo
            (fixed bottom-4), así que sin este colchón el último bloque de cada pestaña queda tapado
            justo cuando terminás de bajar. En escritorio sobra ancho y no hace falta. */}
        <div
          className="p-3 md:p-6 md:pb-8 flex-1"
          id="panel-seccion"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >

          {activeTab === 'carrera' && (
            <div className="space-y-4 animate-fade-in">

              {/* La barra vive en src/components/BarraDeSecciones.tsx: la usan tres pestañas y
                  copiarla tres veces era pedir que se desparejaran. */}
              <BarraDeSecciones<SeccionDeCarrera>
                etiqueta="Secciones de Mi Carrera"
                activa={seccionMovil}
                onCambiar={setSeccionMovil}
                destinos={[
                  { id: 'ficha', texto: 'Atributos', Icono: Award },
                  { id: 'rival', texto: 'Rival', Icono: Swords },
                  { id: 'ranking', texto: 'Ranking', Icono: Globe },
                  { id: 'historia', texto: 'Historia', Icono: BarChart3 },
                ] as const}
              />

              <div className="grid md:grid-cols-6 gap-4 stagger">

                <div className={`${soloEn('ficha')} md:col-span-3 md:order-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg`}>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                    <Award size={15} className="text-gold-400" /> Atributos del Jugador
                  </h3>
                  {(playerProfile.dorsal != null || playerProfile.heightCm != null) && (
                    <p className={`text-3xs text-slate-500 font-mono ${esLeyendaDelClub ? 'mb-1' : 'mb-3'}`}>
                      {playerProfile.dorsal != null && `Dorsal #${playerProfile.dorsal}`}
                      {playerProfile.dorsal != null && playerProfile.heightCm != null && ' · '}
                      {playerProfile.heightCm != null && `${playerProfile.heightCm} cm`}
                    </p>
                  )}
                  {esLeyendaDelClub && (
                    <p className="text-3xs font-mono uppercase text-gold-400 font-black mb-3 flex items-center gap-1">
                      👑 Leyenda de {currentClub.name} — dorsal #{playerProfile.dorsal} homenajeado
                    </p>
                  )}

                  {/* EL HEXÁGONO Y LAS BARRAS, JUNTOS Y NO EN VEZ DE. Contestan preguntas distintas: las barras
                      dicen cuánto tenés de cada cosa y el hexágono dice qué CLASE de jugador sos. Un central y
                      un delantero de la misma media tienen barras casi iguales y siluetas opuestas.
                      Ver src/components/HexagonoDeAtributos.tsx. */}
                  <div className="flex items-center gap-3">
                    <div className="w-[38%] max-w-[150px] shrink-0 text-slate-500">
                      <HexagonoDeAtributos atributos={playerProfile.attributes} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2.5">
                    {Object.entries(playerProfile.attributes).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-2xs text-slate-300 font-mono uppercase font-bold">
                          <span>{key}</span>
                          <span className="text-gold-400 font-black">{val}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-800">
                          <div
                            className="bg-gold-500 h-full rounded-full transition-[width] duration-500 ease-out"
                            style={{ width: `${(val / 99) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>

                  {/* Vitrina de trofeos. Va acá, debajo de los atributos, porque era el espacio
                      muerto de la tarjeta y porque el palmarés es la otra mitad de "quién es este
                      jugador". Ver getPalmares: se deriva del perfil, no se guarda aparte. */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <h4 className="text-3xs font-black uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <Trophy size={12} className="text-gold-400" /> Vitrina de Trofeos
                      {/* Cuenta TITULOS, no tarjetas: desde que una tarjeta junta todos los años de
                          la misma competicion, `misTrofeos.length` seria "2" con cuatro campeonatos
                          encima. El numero de la vitrina es cuantas veces saliste campeon. */}
                      {misTrofeos.length > 0 && (
                        <span className="ml-auto text-gold-400 font-mono">
                          {misTrofeos.reduce((n, t) => n + t.anios.length, 0)}
                        </span>
                      )}
                    </h4>

                    {misTrofeos.length === 0 ? (
                      <p className="text-2xs font-mono text-slate-400 leading-relaxed text-center py-2">
                        Todavía no ganaste ningún título. Llevá a tu equipo a lo más alto.
                      </p>
                    ) : (
                      <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {misTrofeos.map(t => (
                          <li
                            key={t.id}
                            className="anim-vitrina flex items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2"
                          >
                            <span className="text-base leading-none shrink-0" aria-hidden="true">
                              {/* 'copa' es la copa NACIONAL: ganarla es un título, así que no puede
                                  llevar 🥈 (se lee como subcampeón). Va con la copa de asas. */}
                              {t.tipo === 'mundial' ? '🌎' : t.tipo === 'continental' ? '🏆' : t.tipo === 'copa' ? '🏅' : '🥇'}
                            </span>
                            {/* El club va en su PROPIO renglón, no pegado al detalle. Juntos en una
                                sola línea, el truncate cortaba los nombres largos a media palabra
                                ("Junior de Barranquil..."). El truncate se queda -- está para que un
                                nombre largo no rompa la tarjeta -- pero ahora tiene el ancho entero
                                para él, y el title deja leer el completo si aun así no entra. */}
                            <span className="min-w-0 flex-1">
                              <span className="block text-2xs font-black text-white truncate" title={t.nombre}>{t.nombre}</span>
                              <span className="block text-3xs font-mono text-slate-400 truncate" title={t.clubName}>
                                {t.clubName}
                              </span>
                              <span className="block text-3xs font-mono text-slate-500">{t.detalle}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-2xs font-mono text-slate-400 leading-relaxed text-center">
                    Entrena de forma exigente en el complejo deportivo para potenciar tus capacidades.
                  </div>
                </div>

                <div className={`${soloEn('historia')} md:col-span-3 md:order-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg md:flex md:flex-col md:justify-between`}>
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
                          {/* El sustantivo concuerda con el número: con un solo partido jugado la
                              tarjeta decía "1 encuentros oficiales". */}
                          {playerProfile.careerStats.partidosHistoricos}{' '}
                          {playerProfile.careerStats.partidosHistoricos === 1 ? 'encuentro oficial' : 'encuentros oficiales'}
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
                            className="bg-gold-500 h-full rounded-full transition-[width] duration-500 ease-out"
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

                {/* EL RIVAL DE CARRERA sube a la grilla: en escritorio es una de las tres tarjetas
                    de la fila de abajo, con las estadisticas historicas y el ranking. Abajo del
                    todo quedaba a dos pantallas de scroll de lo unico con lo que se compara. */}
              {/* EL RIVAL DE CARRERA (ver rivalDeCarrera.ts). Va pegado al momento de forma
                  porque son la misma pregunta a dos escalas: la forma dice cómo venís estas
                  cinco fechas, y esto dice cómo vas contra el que arrancó cuando vos. */}
              {miRival && (
                <div className={`${soloEn('rival')} md:col-span-3 md:order-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3`}>
                  <h3 className="font-black text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Swords size={14} /> Rival de carrera
                  </h3>
                  <p className={`text-2xs font-bold leading-relaxed ${
                    miRival.quien === 'vos' ? 'text-emerald-400'
                    : miRival.quien === 'el' ? 'text-burgundy-400' : 'text-gold-400'
                  }`}>
                    {rotuloDeLaComparacion(miRival.quien, miRival.rival)}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Partidos', mio: playerProfile.careerStats.partidosHistoricos, suyo: miRival.rival.partidos },
                      { label: 'Goles', mio: playerProfile.careerStats.golesHistoricos, suyo: miRival.rival.goles },
                      { label: 'Asistencias', mio: playerProfile.careerStats.asistenciasHistoricos, suyo: miRival.rival.asistencias },
                    ].map(f => (
                      <div key={f.label} className="p-2 bg-slate-950 border border-slate-850 rounded-xl">
                        <p className="text-3xs uppercase font-mono text-slate-500 font-bold truncate">{f.label}</p>
                        <p className="text-sm font-black text-white">{f.mio}</p>
                        <p className="text-3xs font-mono text-slate-500">él: {f.suyo}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-3xs text-slate-500 font-mono leading-relaxed">
                    {miRival.rival.nombre} · {miRival.rival.clubName} · promedio {miRival.rival.promedio}
                  </p>
                </div>
              )}

                {/* self-start: que la tarjeta mida lo que ocupa su contenido y NADA MÁS.

                    Es hija directa de un grid, y los items de grid se estiran por defecto hasta la
                    altura del más alto de la fila -- acá, la tarjeta de atributos. Resultado: debajo
                    del botón "Disputar Partido" quedaba un vacío enorme del alto de media pantalla,
                    y encima empujaba todo lo de abajo fuera de la vista. */}
              {/* Tercera columna: el partido y, debajo, el ranking.

                  El ranking vivia al final de la pestaña, asi que para verlo habia que
                  scrollear toda la pantalla principal. Acá arriba entra en el hueco que
                  dejó la tarjeta del partido al dejar de estirarse (self-start), y de paso
                  empareja el alto de las tres columnas en vez de dejar una corta. */}
              {/* EL PARTIDO NO SE ESCONDE DETRÁS DE UNA PESTAÑA.

                  Era una de las tres columnas, así que en el teléfono había que elegir "Partido" para
                  verlo. Pero es lo que venís a hacer: abrís el juego para jugar la fecha, no para mirarte
                  los atributos. Ahora está siempre, arriba de todo, y los segmentos eligen entre lo OTRO
                  -- que es lo que se consulta, no lo que se hace.

                  `order-first` sigue por el mismo motivo de siempre en celular, y en escritorio conserva
                  su lugar en la grilla de tres. */}
              <div data-hub-del-partido="true" className="order-first md:order-none md:col-span-3 md:order-2 space-y-4 self-start">
                <div className="bg-gold-950/20 border border-gold-900/30 rounded-2xl p-4 shadow-xl flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    {nextMatchOpponent ? (
                      <div className={`p-4 rounded-2xl relative border ${
                        nextMatchOpponent.club && esClasico(currentClub.id, nextMatchOpponent.club.id)
                          ? 'bg-burgundy-950/40 border-burgundy-500/50'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}>
                        {/* El clasico se ve ANTES de jugarlo, no despues en un numero raro. El borde
                            y el cartel son todo el aviso que hace falta: si el partido pesa mas,
                            tiene que verse distinto desde que lo abris. */}
                        {nextMatchOpponent.club && esClasico(currentClub.id, nextMatchOpponent.club.id) && (
                          <span className="inline-block mb-2 text-3xs font-mono font-black uppercase bg-burgundy-500 text-slate-950 px-2 py-0.5 rounded tracking-wider">
                            🔥 Clásico
                          </span>
                        )}
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
                            {/* Con el cruce sin sortear no se anuncia localia: una fecha reservada
                                viene siempre marcada como local porque no tiene rival todavia, asi
                                que decir "LOCAL" seria inventar la mitad del dato. */}
                            <span className="text-3xs text-slate-500 uppercase font-mono block truncate">
                              {nextMatchOpponent.rivalPorDefinir
                                ? 'Sede por definir'
                                : nextMatchOpponent.isHome ? 'Local' : 'Visitante'}
                            </span>
                            {/* Y el nombre va SIN "vs" y sin truncar: "vs Rival po..." se leia como
                                un club de verdad con el nombre roto. Reportado con captura. */}
                            {nextMatchOpponent.rivalPorDefinir ? (
                              <span className="text-slate-400 font-bold text-sm block leading-tight">
                                Rival aún sin sortear
                              </span>
                            ) : (
                              <span className="text-white font-bold text-base truncate block">vs {nextMatchOpponent.name}</span>
                            )}
                            {nextMatchOpponent.rivalPos != null && (
                              <span className="text-2xs text-gold-400 font-mono font-bold block mt-0.5">
                                {nextMatchOpponent.rivalPos}° {nextMatchOpponent.rivalTotal ? `de ${nextMatchOpponent.rivalTotal}` : ''} en la tabla
                              </span>
                            )}
                          </div>
                        </div>
                        {/* LAS RACHAS DE TU HISTORIA (ver rachas.ts). Van acá y no en un panel
                            aparte porque el único momento en que un dato así sirve es JUSTO antes
                            de jugar ese partido: "no le ganas a este desde hace cuatro" cambia
                            cómo lo encaras, y leído una semana después es trivia. */}
                        {rachasDeHoy.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1">
                            {rachasDeHoy.map(r => (
                              <p key={r.texto} className={`text-3xs font-mono font-bold leading-relaxed flex items-start gap-1.5 ${
                                r.tono === 'buena' ? 'text-emerald-400' : r.tono === 'mala' ? 'text-burgundy-400' : 'text-slate-400'
                              }`}>
                                <Flame size={11} className="shrink-0 mt-0.5" /> <span>{r.texto}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : nextWeekInWorldCupBreak ? (
                      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                          🌎
                        </div>
                        <div className="min-w-0">
                          <span className="text-3xs text-slate-500 uppercase font-mono block truncate">Fecha FIFA</span>
                          <span className="text-white font-bold text-sm block leading-tight">No fuiste convocado esta ventana</span>
                          {/* Y POR QUE, igual que el dia libre de al lado. Los dos cortes son cosas que
                              podes mover, asi que decirlas convierte la ausencia en un objetivo. */}
                          {motivoDeAusenciaDelMundial(playerProfile) && (
                            <span className="text-3xs text-slate-500 block leading-snug mt-0.5">
                              {motivoDeAusenciaDelMundial(playerProfile)}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : hoySinPartido ? (
                      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                          ☕
                        </div>
                        <div className="min-w-0">
                          <span className="text-3xs text-slate-500 uppercase font-mono block truncate">Dia libre</span>
                          <span className="text-white font-bold text-sm block leading-tight">
                            Hoy no se juega
                          </span>
                          {/* Se dice POR QUE, que es la diferencia entre un dia libre y un bug. */}
                          <span className="text-3xs text-slate-500 block mt-0.5 leading-snug">
                            El calendario aparto esta fecha para {nombreCopaNacional(currentClub.league)}, y tu
                            club ya no tiene cruce ahi.
                          </span>
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
                    onClick={temporadaRealTerminada ? onFinalizeSeason : onAdvanceWeek}
                    className={`btn-fx w-full py-3 px-6 rounded-2xl font-black text-xs flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl cursor-pointer mt-4 ${
                      playerProfile.activeInjury
                        ? 'bg-gradient-to-br from-red-700 to-red-900 text-white'
                        : temporadaRealTerminada
                        ? 'bg-gradient-to-br from-slate-600 to-slate-800 text-white'
                        : 'bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950'
                    }`}
                  >
                    {/* Con la lesión encima el botón sigue en rojo -- estás roto -- pero el rótulo
                        tiene que decir la verdad: si forzaste la vuelta, este botón te mete a la
                        cancha. Dejarlo en "Recuperándose" haría creer que el partido se salta solo. */}
                    {forzandoLaVuelta(playerProfile)
                      ? 'Jugar lesionado'
                      : playerProfile.activeInjury
                      ? `Recuperándose (${playerProfile.activeInjury.weeksRemaining} sem.)`
                      : temporadaRealTerminada
                      ? 'Finalizar Temporada'
                      : hoySinPartido || (nextWeekInWorldCupBreak && !nextMatchOpponent)
                      ? 'Pasar a Siguiente Fecha'
                      : 'Disputar Partido'} <ArrowRight size={15} />
                  </button>

                  {/* SIMULAR: el mismo partido, jugado solo.
                      Sale sólo cuando hay un partido de verdad que jugar -- si la fecha se pasa sin
                      partido, o la temporada terminó, no hay nada que simular y el botón sería un
                      segundo "avanzar" que confunde. Va en secundario a propósito: disputarlo sigue
                      siendo lo principal. */}
                  {!temporadaRealTerminada && !hoySinPartido && !!nextMatchOpponent && (!playerProfile.activeInjury || forzandoLaVuelta(playerProfile)) && (
                    <button
                      onClick={onSimularPartido}
                      className="btn-fx-subtle w-full py-2.5 px-6 rounded-2xl font-black text-2xs flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer mt-2 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500"
                      title="Se juega solo, con vos en cancha"
                    >
                      <FastForward size={13} /> Simular partido
                    </button>
                  )}
                </div>

              <div className={`${soloEn('ranking')} bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg`}>
                <h3 className="text-2xs uppercase tracking-widest text-slate-400 font-black flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-3">
                  🌎 Ranking mundial
                </h3>
                {/* Filas finas: el ranking es una lista para recorrer con la vista, no tarjetas.
                    Con py-1.5 y separación entre filas entraban 8 y había que scrollear dentro del
                    panel para ver el resto; así entran 12 en menos alto del que ocupaban 8. Se
                    cambió la separación por una línea divisoria, que ordena sin gastar píxeles. */}
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/60">
                  {generateWorldRanking(playerProfile, currentClub.name, playerProfile.currentWeek, currentClub.league).map((entry, i) => (
                    <div
                      key={`${entry.name}_${i}`}
                      className={`flex items-center justify-between gap-2 px-2.5 py-1 text-2xs ${
                        entry.isPlayer ? 'bg-gold-950/30' : ''
                      }`}
                    >
                      <span className="flex items-baseline gap-2 min-w-0">
                        <span className="text-3xs font-mono text-slate-500 w-5 shrink-0 text-right">{i + 1}°</span>
                        <span className={`truncate font-bold ${entry.isPlayer ? 'text-gold-400' : 'text-white'}`}>{entry.name}</span>
                        <span className="text-3xs text-slate-500 truncate">{entry.clubName}</span>
                      </span>
                      <span className="text-3xs font-mono text-slate-400 shrink-0 tabular-nums">{Math.round(entry.score)}</span>
                    </div>
                  ))}
                </div>
              </div>
              </div>
              </div>{/* fin tercera columna */}

              {/* De acá para abajo, en celular, todo vive en la sección HISTORIA: son paneles de
                  consulta, no de acción, y apilados debajo del partido eran cuatro pantallas más de
                  scroll. En escritorio se ven siempre. */}
              {/* ESTE BLOQUE YA NO SE ESCONDE ENTERO: cada panel dice a qué segmento pertenece.

                  Antes era una sola columna "Historia" con siete cosas adentro, y entre ellas dos
                  que hay que PODER TOCAR -- el bajón anímico y la lesión, que tienen botones. Que
                  una decisión viva detrás de una pestaña es la forma más silenciosa de que el
                  jugador no se entere de que podía hacer algo.

                  La regla es la misma que la del partido: lo accionable está siempre; lo que se
                  consulta va detrás de un segmento. */}
              <div className="space-y-4">

              {/* MOMENTO DE FORMA. Se muestra siempre que haya al menos un partido jugado, no sólo
                  cuando hay racha: media pantalla del juego son números que suben, y la forma tiene
                  que poder LEERSE antes de que sea noticia -- si sólo apareciera al llegar a la
                  tercera buena, el jugador no vería venir ni la racha ni el pozo. */}
              {(() => {
                const forma = evaluarForma(playerProfile.formaReciente, playerProfile.currentWeek);
                const notas = (playerProfile.formaReciente ?? []).slice(-VENTANA_DE_FORMA);
                if (notas.length === 0) return null;
                const color = forma.estado === 'en_racha' ? 'text-emerald-400'
                  : forma.estado === 'en_baja' ? 'text-red-400' : 'text-slate-400';
                const borde = forma.estado === 'en_racha' ? 'border-emerald-900/40'
                  : forma.estado === 'en_baja' ? 'border-red-900/40' : 'border-slate-800';
                return (
                  <div className={`${soloEn('ficha')} bg-slate-900 border ${borde} rounded-2xl p-5 shadow-lg`}>
                    <h3 className={`text-xs font-black uppercase tracking-widest ${color} mb-2 flex items-center gap-2`}>
                      {forma.estado === 'en_racha' ? '🔥' : forma.estado === 'en_baja' ? '🥶' : '📈'} Momento de forma
                    </h3>
                    <p className="text-2xs text-slate-400 leading-relaxed">
                      {rotuloDeForma(forma)}
                      {forma.promedio != null && (
                        <> · promedio <span className="text-white font-bold">{forma.promedio.toFixed(1)}</span></>
                      )}
                    </p>
                    {/* Las notas en crudo, de la más vieja a la más nueva. Ver la racha es una cosa;
                        ver POR QUE el juego la llama racha es otra, y evita que se lea como un
                        número que aparece de la nada. */}
                    <div className="flex items-end gap-1.5 mt-3">
                      {notas.map((n, i) => (
                        <div
                          key={`${n.paso}_${i}`}
                          className={`flex-1 rounded-xl text-center py-1.5 text-2xs font-black tabular-nums ${
                            n.rating >= NOTA_BUENA ? 'bg-emerald-950/60 text-emerald-300'
                              : n.rating <= NOTA_MALA ? 'bg-red-950/60 text-red-300'
                              : 'bg-slate-950 text-slate-400'
                          }`}
                          title={`Fecha ${n.paso}`}
                        >
                          {n.rating.toFixed(1)}
                        </div>
                      ))}
                    </div>
                    {forma.estado !== 'normal' && (
                      <p className={`text-3xs font-mono uppercase mt-3 ${color}`}>
                        {forma.estado === 'en_racha'
                          ? `+${AJUSTE_DE_FORMA} en todos los atributos mientras dure.`
                          : `−${AJUSTE_DE_FORMA} en todos los atributos hasta que cortes la mala racha.`}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* EL QUE TE PELEA EL PUESTO. Va antes del rival de carrera y no después, porque es
                  el más urgente de los dos: el rival de carrera es una comparación con alguien de
                  otro club, y éste te saca del equipo el domingo.

                  Se muestra con NÚMEROS y no con un cartel de "hay competencia": el problema tiene
                  que tener cara. Si no jugaste dos fechas y él metió tres, eso se ve acá. */}
              {playerProfile.fichajeRival && (
                <div className={`${soloEn('rival')} bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg`}>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <Swords size={15} className="text-gold-400" /> Te pelea el puesto
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 border border-gold-900/40 rounded-xl p-3">
                      <div className="text-3xs font-mono uppercase tracking-widest text-gold-400 mb-1">Vos</div>
                      <div className="text-sm font-black text-white truncate">{playerProfile.name}</div>
                      <div className="text-2xs text-slate-400 font-mono mt-1.5">
                        {playerProfile.careerStats.partidos} PJ · {playerProfile.careerStats.goles} G · {playerProfile.careerStats.asistencias} A
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                      <div className="text-3xs font-mono uppercase tracking-widest text-slate-500 mb-1">
                        {playerProfile.fichajeRival.posicion}
                      </div>
                      <div className="text-sm font-black text-white truncate">{playerProfile.fichajeRival.nombre}</div>
                      <div className="text-2xs text-slate-400 font-mono mt-1.5">
                        {playerProfile.fichajeRival.partidos ?? 0} PJ · {playerProfile.fichajeRival.goles ?? 0} G · {playerProfile.fichajeRival.asistencias ?? 0} A
                      </div>
                    </div>
                  </div>
                  <p className="text-2xs text-slate-400 leading-relaxed mt-3">
                    {(() => {
                      const e = estorboDelRival(playerProfile.fichajeRival, playerProfile.currentWeek);
                      const prom = promedioDelRival(playerProfile.fichajeRival);
                      if ((playerProfile.fichajeRival.partidos ?? 0) === 0) {
                        return 'Todavía no jugó. Llegó con crédito del club: mientras no lo pongan, el puesto sigue siendo tuyo.';
                      }
                      if (e > 6) return `Está por delante tuyo (promedio ${prom}). Cada fecha que no juegues le suma.`;
                      if (e < -6) return `Le ganaste el puesto: promedia ${prom} y el DT ya no lo mira.`;
                      return `Están parejos (promedia ${prom}). Lo define el próximo mes.`;
                    })()}
                  </p>
                </div>
              )}


              {/* EL BAJÓN ANÍMICO (ver animo.ts).
                  Sólo aparece cuando estás adentro: un panel que está siempre se vuelve otra
                  barra más para ignorar, y esto tiene que leerse como algo que pasó y hay que
                  resolver. Va pegado al de Entorno porque son la misma familia -- lo de afuera
                  de la cancha -- y porque visitar a los tuyos es la prevención de esto mismo. */}
              {estaEnBajon(playerProfile) && (
                <div data-panel-accionable="bajon" className="bg-burgundy-950/30 border border-burgundy-500/40 rounded-2xl p-5 shadow-lg space-y-3">
                  <h3 className="font-black text-xs text-burgundy-300 uppercase tracking-wider flex items-center gap-2">
                    <Brain size={14} /> Bajón anímico
                  </h3>
                  <p className="text-2xs text-slate-300 leading-relaxed">
                    {motivoDelBajon({
                      activeInjury: playerProfile.activeInjury,
                      fans: playerProfile.fans,
                      prestige: playerProfile.prestige,
                      forma: evaluarForma(playerProfile.formaReciente, playerProfile.currentWeek).estado,
                    })}
                  </p>
                  <p className="text-3xs text-burgundy-400 font-mono font-bold leading-relaxed">
                    Mientras dure: llegas a los partidos con menos energía y tus decisiones tienen
                    bastante menos margen de éxito.
                  </p>
                  <div className="space-y-2">
                    {SALIDAS.map(salida => {
                      const falta = faltaParaSalida(salida, playerProfile);
                      return (
                        <button
                          key={salida.id}
                          onClick={() => onSalirDelBajon(salida.id)}
                          disabled={!!falta}
                          title={falta ?? salida.detalle}
                          className="btn-fx-subtle w-full min-h-[44px] py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-burgundy-500/50 text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span className="block text-2xs font-bold text-white">{salida.titulo}</span>
                          <span className="block text-3xs text-slate-400 font-mono">{salida.costoTexto}</span>
                          <span className="block text-3xs text-slate-500 leading-relaxed mt-0.5">{salida.detalle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              </div>
              {/* Fin de HISTORIA. La lesión queda AFUERA a propósito: si estás roto tenés que verlo
                  al abrir la pantalla, no después de cambiar de sección. */}

              {playerProfile.activeInjury && (
                <div data-panel-accionable="lesion" className="bg-slate-900 border border-red-900/40 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-400 mb-2 flex items-center gap-2">
                    🩹 Lesionado
                  </h3>
                  <p className="text-2xs text-slate-400 leading-relaxed">
                    {INJURY_LABELS[playerProfile.activeInjury.type]}. Te quedan{' '}
                    <span className="text-white font-bold">{playerProfile.activeInjury.weeksRemaining} semana(s)</span>{' '}
                    de recuperación antes de volver a jugar.
                  </p>
                  {playerProfile.activeInjury.treatmentChoice == null && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button
                        onClick={() => onTreatInjury('fast')}
                        disabled={playerProfile.capital < 2000}
                        className="btn-fx-subtle py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        💊 Tratamiento rápido ($2.000)
                      </button>
                      <button
                        onClick={() => onTreatInjury('natural')}
                        className="btn-fx-subtle py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer"
                      >
                        🛌 Recuperación natural
                      </button>
                    </div>
                  )}
                  {playerProfile.activeInjury.treatmentChoice === 'fast' && (
                    <p className="text-3xs text-gold-400 font-mono uppercase mt-3">
                      Tratamiento rápido en curso: menos tiempo afuera.
                    </p>
                  )}
                  {playerProfile.activeInjury.treatmentChoice === 'natural' && (
                    <p className="text-3xs text-slate-500 font-mono uppercase mt-3">
                      Recuperación natural en curso, sin costo ni riesgo.
                    </p>
                  )}

                  {/* VOLVER ANTES DE TIEMPO. Va aparte de las otras dos y se ofrece SIEMPRE mientras
                      dure la lesión, no sólo al principio: la decisión interesante casi nunca aparece
                      el día que te lesionás, aparece a mitad de la recuperación cuando ves la final
                      en el calendario. El riesgo se muestra en número, no en adjetivos -- que sea una
                      apuesta está bien, que sea una apuesta a ciegas no. */}
                  {playerProfile.activeInjury.treatmentChoice !== 'forzar' ? (
                    <button
                      onClick={() => onTreatInjury('forzar')}
                      className="btn-fx-subtle w-full mt-3 py-2 px-3 rounded-xl bg-red-950/50 border border-red-900/60 hover:border-red-500/70 text-2xs font-bold text-red-200 cursor-pointer"
                    >
                      🔥 Volver antes de tiempo · {Math.round(riesgoDeRecaida(playerProfile.activeInjury.weeksRemaining) * 100)}% de recaída por partido
                    </button>
                  ) : (
                    <div className="mt-3 rounded-xl bg-red-950/40 border border-red-900/50 p-3">
                      <p className="text-3xs text-red-300 font-mono uppercase leading-relaxed">
                        Jugando lesionado. Rindes por debajo (−{PENALIDAD_ATRIBUTOS_LESIONADO} en todos los atributos)
                        y cada partido tiene {Math.round(riesgoDeRecaida(playerProfile.activeInjury.weeksRemaining) * 100)}% de recaída.
                      </p>
                      <p className="text-3xs text-slate-500 font-mono uppercase mt-1.5">
                        Si aguantas {playerProfile.activeInjury.weeksRemaining} fecha(s) más, llegas al alta jugando.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {playerProfile.age >= 32 && (
                <div className={`${soloEn('historia')} bg-slate-900 border border-burgundy-900/40 rounded-2xl p-5 shadow-lg`}>
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

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <SeasonComparisonChart seasonHistory={playerProfile.seasonHistory} />
              </div>

            </div>
          )}

          {activeTab === 'entrenamiento' && !playerProfile.hardcoreEnabled && (
            /* Sin max-w-4xl: la pestaña usa el ancho que haya. Con el tope de 4xl, en una pantalla
               normal sobraba media pantalla vacía a la derecha mientras la clínica y la
               especialización quedaban abajo de todo, fuera de la vista. Ahora van AL LADO. */
            /* EN CELULAR SE REORDENA, en escritorio no. La raíz pasa a ser una columna flex sólo
               hasta `lg`, que es lo que permite mover los bloques con `order` sin tocar el orden
               del DOM -- ni el de escritorio, que ya estaba resuelto en dos columnas. */
            <div className="flex flex-col gap-4 lg:block lg:space-y-4 animate-fade-in">
              <div className="order-2 lg:order-none">
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Complejo de Preparación Física y Técnica
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Invierte tu estamina semanal para perfeccionar tus habilidades técnicas. Cada sesión requiere <span className="text-burgundy-500 font-bold">-{TRAINING_ENERGY_COST} Energía</span> y lo que cobren las instalaciones de {currentClub.name}. Cuanto mejor ya seas en algo, <span className="text-burgundy-500 font-bold">menos rinde y más cuesta</span> pulirlo: por debajo de 60 sumás <span className="text-gold-400 font-bold">+3</span>, hasta 74 sumás <span className="text-gold-400 font-bold">+2</span>, y de ahí en adelante <span className="text-burgundy-500 font-bold">+1</span> a precio de estrella. Cada botón te dice cuánto rinde y cuánto sale.
                </p>
              </div>

              {/* Tarjetas COMPACTAS, en fila.

                  Antes cada atributo era una tarjeta vertical con una foto de 112 px, padding de
                  20 px y el párrafo de descripción entero: seis de ésas no entraban en pantalla y
                  había que subir y bajar para entrenar y después para comprar. Reportado tal cual:
                  "tener que subir y bajar siempre, no es cómodo, y es hasta molesto".

                  Ahora cada una ocupa ~85 px en vez de ~300. La foto queda de miniatura, la
                  descripción pasa al title (sigue estando, al pasar el mouse) y en su lugar va una
                  barra de progreso, que dice de un vistazo lo que antes había que leer -- y que era
                  el mismo texto todas las semanas. */}
              {/* Dos columnas: los atributos a la izquierda, clínica y especialización a la
                  derecha. items-stretch (el defecto) y no items-start: con items-start cada columna
                  medía lo suyo y las dos terminaban a alturas distintas, que es lo que se veía como
                  desprolijo. Pedido: "que no sobrepasen la línea verde para que se vea más
                  simétrico". */}
              <div className="order-3 lg:order-none grid lg:grid-cols-3 gap-4">
              <div data-panel-de-entreno="ejercicios" className="order-2 lg:order-none lg:col-span-2 grid sm:grid-cols-2 gap-2.5 content-start auto-rows-min">
                {[
                  { key: 'ritmo', label: 'Velocidad / Ritmo', img: trainingRitmoImg, desc: 'Mejora la aceleración explosiva y los desmarques por las bandas.' },
                  { key: 'regate', label: 'Dribbling / Regate', img: trainingRegateImg, desc: 'Aumenta el control de balón en conducción y el mano a mano.' },
                  { key: 'tiro', label: 'Definición / Tiro', img: trainingTiroImg, desc: 'Sube la contundencia y potencia de cara al arco rival.' },
                  { key: 'defensa', label: 'Robo / Defensa', img: trainingDefensaImg, desc: 'Optimiza la capacidad de anticipación e intercepción táctica.' },
                  { key: 'pase', label: 'Visión / Pase', img: trainingPaseImg, desc: 'Clave para habilitaciones precisas entre líneas y asistencias.' },
                  { key: 'fisico', label: 'Potencia / Físico', img: trainingFisicoImg, desc: 'Incrementa la resistencia en disputas aéreas y choques hombro con hombro.' }
                ].map(item => {
                  const valor = playerProfile.attributes[item.key as keyof PlayerStats];
                  const alMaximo = valor >= ATTRIBUTE_MAX;
                  const trainingCost = cuestaEntrenar(valor, currentClub.reputation);
                  const rinde = rindeEntrenar(valor, playerProfile.yearsAtClub);
                  const puede = !alMaximo && playerProfile.energy >= TRAINING_ENERGY_COST && playerProfile.capital >= trainingCost;
                  return (
                    <div key={item.key} className="bg-slate-900 border border-slate-800 rounded-xl hover:border-gold-500/20 transition-all flex items-center gap-2.5 p-2.5">
                      {/* La foto no se ve en celular: son seis miniaturas que no dicen nada que el
                          rótulo no diga, y ahí el ancho es todo. En escritorio se queda. */}
                      <img src={item.img} alt="" title={item.desc} loading="lazy" decoding="async"
                           className="hidden sm:block w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-bold text-xs text-white truncate" title={item.desc}>{item.label}</h4>
                          <span className={`text-3xs font-mono font-black shrink-0 ${alMaximo ? 'text-gold-400' : 'text-burgundy-500'}`}>
                            {valor}/{ATTRIBUTE_MAX}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-slate-950 my-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${alMaximo ? 'bg-gold-400' : 'bg-burgundy-500'}`}
                               style={{ width: `${Math.round((valor / ATTRIBUTE_MAX) * 100)}%` }} />
                        </div>
                        {/* Al máximo el botón se apaga y lo dice. Antes cobraba la sesión igual y el
                            atributo no se movía, así que el jugador pagaba por enterarse. */}
                        <button
                          onClick={() => onTrainAttribute(item.key as keyof PlayerStats)}
                          disabled={!puede}
                          title={alMaximo
                            ? `Ya está en ${ATTRIBUTE_MAX}, el máximo.`
                            : playerProfile.energy < TRAINING_ENERGY_COST
                            ? 'Te falta energía para entrenar.'
                            : playerProfile.capital < trainingCost
                            ? `Te faltan $${(trainingCost - playerProfile.capital).toLocaleString()}.`
                            : item.desc}
                          className={`btn-fx-subtle w-full min-h-[36px] py-1.5 px-2 rounded-xl font-bold text-3xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                            puede
                              ? 'bg-slate-950 text-white hover:bg-gradient-to-br hover:from-gold-400 hover:to-gold-600 hover:text-slate-950 border border-slate-800 hover:border-gold-400 cursor-pointer'
                              : alMaximo
                              ? 'bg-gold-950/20 text-gold-500/70 cursor-not-allowed border border-gold-500/25'
                              : 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-900'
                          }`}
                        >
                          {alMaximo ? `Al máximo · ${ATTRIBUTE_MAX}` : `Entrenar +${rinde} · -${TRAINING_ENERGY_COST}E · -$${trainingCost.toLocaleString()}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Columna derecha: clínica y especialización, que antes vivían abajo de todo.
                  flex-col y no space-y a secas: así el último panel crece y las dos columnas cierran
                  a la misma altura en vez de quedar uno más largo que el otro. */}
              {/* `contents` en celular: el envoltorio deja de existir como caja y la clínica pasa a
                  ser hija de la grilla, que es lo que le permite ordenarse por separado. Desde `lg`
                  es la tercera columna, al lado de los ejercicios. */}
              <div className="contents lg:block">


              {/* LA CLÍNICA, AL LADO DE LOS EJERCICIOS. Es la tercera columna de la grilla: comprar
                  energía y gastarla entrenando son la misma decisión, y tenerlas separadas obligaba
                  a bajar para comprar y volver a subir para entrenar. */}
              <div data-panel-de-entreno="clinica" className="order-1 lg:order-none bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                  <Heart size={15} className="text-rose-500" /> Clínica de Fisioterapia
                </h3>
                <p className="text-3xs text-slate-400 leading-snug mb-3">
                  Recuperá estamina al instante, sin perder fechas.
                </p>

                {/* Una sola columna: ahora esto vive en la barra lateral, y dos al lado quedaban
                    apretadas contra el precio. */}
                <div className="grid gap-2">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center gap-2">
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
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center gap-2">
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

              </div>{/* fin columna derecha */}
              </div>{/* fin de las dos columnas */}

              {/* LA ESPECIALIZACIÓN, ABAJO Y A LO ANCHO.

                  Era la tarjeta de arriba de la columna derecha, y ahí pasaban dos cosas malas: el
                  quinto rol quedaba cortado por abajo, y al lado de la grilla de ejercicios --que
                  es más alta-- sobraba media pantalla vacía. Reportado con un círculo rojo encima.

                  Abajo y a lo ancho los cinco roles entran en una fila y no queda hueco. */}
              <div data-panel-de-entreno="especializacion" className="order-4 lg:order-none bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                  <Sparkles size={15} className="text-gold-400" /> Especialización
                </h3>
                {playerProfile.careerStats.partidosHistoricos < 15 ? (
                  <p className="text-3xs text-slate-500 leading-relaxed">
                    Todavía estás construyendo tu trayectoria. A partir de los 15 partidos jugados vas
                    a poder elegir un rol favorito que redistribuye tus atributos en cancha.
                  </p>
                ) : (
                  <>
                    <p className="text-3xs text-slate-400 leading-relaxed mb-3">
                      Elegí un estilo de juego para tu posición ({playerProfile.position}). Cada rol le
                      da más peso a ciertos atributos y menos a otros en el resultado del partido -- no
                      suma ni resta puntos, solo cambia cómo rinden los que ya tienes.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                      {ROLES_DATABASE.filter(r => r.position === playerProfile.position).map(role => (
                        <button
                          key={role.id}
                          onClick={() => onSelectRole(playerProfile.favoriteRole === role.id ? null : role.id)}
                          className={`btn-fx-subtle text-left py-2.5 px-3 rounded-xl border transition-all ${
                            playerProfile.favoriteRole === role.id
                              ? 'border-gold-500 bg-gold-950/30 text-white shadow-sm'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <span className="text-2xs font-bold block">{role.label}</span>
                          <span className="text-3xs text-slate-500 block mt-0.5 leading-relaxed">{role.description}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* LOS AVISOS: PRIMEROS EN CELULAR, ABAJO EN ESCRITORIO.

                  Las dos mitades son pedidos del jugador, y se contradicen -- por eso conviven en
                  vez de que una pise a la otra:

                    1. "el anuncio de fatiga crítica ponlo debajo de los paneles", porque arriba
                       empujaba toda la grilla hacia abajo y obligaba a scrollear justo cuando el
                       aviso decía que no podías entrenar. Eso sigue valiendo EN ESCRITORIO, donde
                       la grilla es ancha y el aviso se come una franja entera.
                    2. El rediseño de celular los pone arriba de todo. Ahí lo de antes no aplica:
                       la columna es una sola, el aviso mide cuatro renglones y no empuja nada que
                       no fuera a estar abajo igual -- y es lo primero que necesitás saber antes de
                       gastar energía.

                  De ahí `order-first lg:order-none`, en vez de moverlos de lugar en el DOM. */}
              {playerProfile.energy < 20 ? (
                <div className="order-first lg:order-none p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldAlert size={18} /> Tu estado físico es de fatiga crítica. Entrena en la Clínica o descansa.
                </div>
              ) : null}

              {playerProfile.capital < sesionMasBarata && (
                <div className="order-first lg:order-none p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldAlert size={18} /> No te alcanza para entrenar en las instalaciones de {currentClub.name}: la sesión más barata que te queda sale ${sesionMasBarata.toLocaleString()}.
                </div>
              )}

              {playerProfile.yearsAtClub >= COMFORT_ZONE_YEARS_THRESHOLD && (
                <div className="order-first lg:order-none p-4 rounded-xl border border-burgundy-500/30 bg-burgundy-950/20 text-burgundy-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldAlert size={18} /> Zona de confort: llevas {playerProfile.yearsAtClub} temporadas seguidas en {currentClub.name} y el entrenamiento rinde el mínimo (+{RINDE_EN_ZONA_DE_CONFORT}). Un traspaso te devuelve la ambición fresca.
                </div>
              )}
            </div>
          )}

          {activeTab === 'chutsocial' && (
            <div className="space-y-6 animate-fade-in max-w-4xl grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Send size={15} className="text-gold-400" /> Red de Opinión Pública - Prensa y Afición
                  </h3>

                  {/* PUBLICAR. UNA por fecha: si ya publicaste, el bloque no aparece.
                      Son opciones escritas y no un campo libre a propósito -- un texto libre no se
                      puede evaluar, así que no podría tener consecuencias, y una publicación sin
                      consecuencias es un adorno. Ver publicacionesDisponibles. */}
                  {playerProfile.lastMatchRating > 0 && playerProfile.miPublicacion?.semana !== playerProfile.currentWeek && (
                    <div className="mb-4 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                      <p className="text-3xs uppercase font-mono text-slate-500 font-bold mb-2">
                        Publicá algo sobre el partido
                      </p>
                      <div className="space-y-1.5">
                        {publicacionesDisponibles(
                          playerProfile.lastMatchRating >= 6.5 && (playerProfile.lastMatchGoals > 0 || playerProfile.lastMatchRating >= 7),
                          nextMatchOpponent?.name ?? 'el rival',
                        ).map(op => (
                          <button
                            key={op.id}
                            onClick={() => onPublicar(op)}
                            className="btn-fx-subtle w-full text-left p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-gold-500/30 hover:bg-slate-850 transition-all cursor-pointer"
                          >
                            <span className="text-xs text-slate-200 leading-snug block">{op.texto}</span>
                            <span className="text-3xs font-mono text-slate-500 mt-1 block">
                              {op.fans !== 0 && `${op.fans > 0 ? '+' : ''}${op.fans} afición · `}
                              {op.prestigio !== 0 && `${op.prestigio > 0 ? '+' : ''}${op.prestigio} prestigio · `}
                              {op.dt !== 0 && `${op.dt > 0 ? '+' : ''}${op.dt} DT · `}
                              {op.animo !== 0 && `${op.animo > 0 ? '+' : ''}${op.animo} ánimo`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                                  <span className="w-6 h-6 rounded-full bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">
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
                                        className="w-32 rounded-xl border border-slate-800 mt-1 cursor-pointer hover:opacity-90 transition-opacity"
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
                                  <img src={commentGifDrafts[post.id]} alt="GIF elegido" className="w-28 rounded-xl border border-gold-500/40" />
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
                                  className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-2xs text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = gifPickerOpenFor === post.id ? null : post.id;
                                    setGifPickerOpenFor(next);
                                    if (next) searchGifsForComment(playerProfile.name);
                                  }}
                                  className="btn-fx-subtle px-2.5 py-1.5 rounded-xl border border-slate-700 text-2xs font-bold text-slate-300 hover:border-gold-500/50 shrink-0"
                                  title="Adjuntar GIF"
                                >
                                  GIF
                                </button>
                                <button
                                  onClick={() => submitComment(post.id)}
                                  className="btn-fx-subtle px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-bold text-2xs cursor-pointer shrink-0"
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
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-2xs text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50"
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
                                            className="btn-fx-subtle rounded-xl overflow-hidden border border-slate-800 hover:border-gold-500/50"
                                          >
                                            <img src={url} alt="" loading="lazy" decoding="async" className="w-full h-28 object-cover" />
                                          </button>
                                        ))
                                      )}
                                    </div>
                                    {gifSearchResults.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={loadMoreGifs}
                                        disabled={gifSearchLoadingMore}
                                        className="btn-fx-subtle w-full py-2 rounded-xl border border-slate-800 text-2xs font-bold text-slate-300 hover:border-gold-500/50 disabled:opacity-50 disabled:cursor-wait"
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
                {/* Entorno: familia y amigos. Va acá arriba, junto a la vida amorosa, porque es la
                    misma mitad de la carrera -- la que pasa fuera de la cancha. La pareja tiene su
                    propio medidor desde antes y no se toca. */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    🏠 Familia y Amigos
                  </h3>
                  {(() => {
                    const entorno = playerProfile.entorno ?? 60;
                    return (
                      <>
                        <div className="flex justify-between text-3xs text-slate-400 font-mono mb-1">
                          <span>Entorno</span>
                          <span className="text-emerald-400 font-bold">{entorno}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mb-2.5">
                          <div
                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-[width] duration-500 ease-out"
                            style={{ width: `${entorno}%` }}
                          />
                        </div>
                        <p className="text-3xs text-slate-400 leading-relaxed mb-3">
                          {entorno >= 70
                            ? 'Los tuyos están cerca. Cuando el fútbol sale mal, tienes dónde apoyarte.'
                            : entorno <= 30
                            ? 'Hace mucho que no apareces. Las derrotas te pegan más fuerte cuando vuelves a una casa vacía.'
                            : 'Los tuyos siguen ahí, pero las semanas pasan y tú no. El entorno se enfría solo al cerrar cada temporada.'}
                        </p>
                        <button
                          onClick={onVisitarEntorno}
                          disabled={playerProfile.capital < 900 || playerProfile.energy < 12}
                          title={playerProfile.capital < 900
                            ? 'Necesitas $900 para el viaje.'
                            : playerProfile.energy < 12
                            ? 'Necesitas 12 de energía: estás fundido.'
                            : 'Unos días con los tuyos.'}
                          className="btn-fx-subtle w-full min-h-[44px] py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-2xs font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Visitar a los tuyos · $900 · −12 energía
                        </button>
                      </>
                    );
                  })()}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
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
                        className="btn-fx-subtle w-full py-2 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
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
                            className="bg-gradient-to-r from-burgundy-600 to-burgundy-400 h-full rounded-full transition-[width] duration-500 ease-out"
                            style={{ width: `${playerProfile.girlfriend.loveMeter}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={onGirlfriendFlowers}
                          disabled={playerProfile.capital < 300}
                          className="btn-fx-subtle py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          💐 Regalar Flores
                        </button>
                        <button
                          onClick={onGirlfriendPhoto}
                          className="btn-fx-subtle py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer"
                        >
                          📸 Foto Juntos
                        </button>
                        <button
                          onClick={onGirlfriendFaithful}
                          className="btn-fx-subtle py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer"
                        >
                          🙏 Serle Fiel
                        </button>
                        <button
                          onClick={onGirlfriendDenyRumors}
                          className="btn-fx-subtle py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer"
                        >
                          📰 Negar Rumores
                        </button>
                        <button
                          onClick={onGirlfriendCheat}
                          className="btn-fx-subtle col-span-2 py-1.5 px-2 rounded-xl bg-red-950/30 border border-red-500/20 hover:border-red-500/50 text-2xs font-bold text-red-300 cursor-pointer"
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
                              className="btn-fx-subtle py-1.5 px-2 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-bold text-3xs uppercase cursor-pointer"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() => onGirlfriendMoveIn(false)}
                              className="btn-fx-subtle py-1.5 px-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-3xs uppercase cursor-pointer"
                            >
                              Rechazar
                            </button>
                          </div>
                        </div>
                      )}

                      {playerProfile.girlfriend.marriedAt === undefined ? (
                        playerProfile.girlfriend.livingTogether && playerProfile.girlfriend.loveMeter >= 70 && (
                          <button
                            onClick={onPropose}
                            disabled={playerProfile.capital < 8000}
                            className="btn-fx-subtle w-full py-2 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-bold text-2xs uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            💍 Pedirle Matrimonio
                          </button>
                        )
                      ) : (
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                          <p className="text-3xs text-gold-400 font-bold uppercase font-mono">
                            💍 Casado con {playerProfile.girlfriend.name}
                          </p>
                          {(playerProfile.girlfriend.children ?? []).length > 0 && (
                            <p className="text-3xs text-slate-400">
                              👶 {(playerProfile.girlfriend.children ?? []).map(c => c.name).join(', ')}
                            </p>
                          )}
                          <button
                            onClick={onHaveChild}
                            disabled={playerProfile.energy < 25}
                            className="btn-fx-subtle w-full py-1.5 px-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            👶 Agrandar la Familia
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
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
                        className="btn-fx-subtle w-full mt-3 py-1.5 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                      >
                        Lanzar sorteo
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Gala de Caridad</span>
                        <span className="text-red-400 font-mono">-$3,000</span>
                      </div>
                      <p className="text-3xs text-slate-400">Impacto altamente positivo en tu Relación DT y en la prensa especializada.</p>
                      <button
                        onClick={() => onLaunchPRCampaign(3000, 15, 3)}
                        disabled={playerProfile.capital < 3000}
                        className="btn-fx-subtle w-full mt-3 py-1.5 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
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
                        className="btn-fx-subtle w-full mt-3 py-1.5 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
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
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3 text-center">
                  <div className="inline-flex p-3 rounded-full bg-slate-800/60 border border-slate-700 text-slate-400 mb-1">
                    <Radio size={24} />
                  </div>
                  <h3 className="text-sm font-black text-white px-2">Ya atendiste a la prensa esta semana.</h3>
                  <p className="text-3xs text-slate-400 font-mono">Los reporteros vuelven la semana que viene con nuevas preguntas.</p>
                </div>
              ) : pressResponseState === 'asking' ? (
                <div className={`bg-slate-900 border rounded-2xl shadow-xl relative overflow-hidden ${PRESS_QUESTIONS_POOL[selectedPressQ].mediaColor}`}>

                  {/* Backdrop tipo "step and repeat" de rueda de prensa real, detrás del encabezado */}
                  <div className="absolute inset-x-0 top-0 h-28 overflow-hidden pointer-events-none select-none">
                    {/* Bajado de 0.08 a 0.05: el patrón tiene que leerse como textura de fondo, no
                        competir con la pregunta del periodista, que es lo único que hay que leer. */}
                    <div className="flex flex-wrap gap-x-6 gap-y-4 -rotate-6 -translate-x-6 -translate-y-3 opacity-[0.05] whitespace-nowrap">
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
                <div className="bg-slate-900 border border-gold-500/20 rounded-2xl p-6 shadow-xl space-y-4 text-center">
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
              <BarraDeAtajos
                etiqueta="Atajos de Traspasos"
                atajos={[
                  { ancla: 'traspasos-ofertas', texto: 'Ofertas', Icono: RefreshCw },
                  { ancla: 'traspasos-radar', texto: 'Radar', Icono: Table },
                  { ancla: 'traspasos-agente', texto: 'Agente', Icono: Award },
                ]}
              />
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Oficina de Contratos y Representaciones
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Revisa las propuestas de los clubes interesados en tu perfil deportivo para la temporada {rotuloDeTemporada(currentClub.name, playerProfile.currentWeek)}. Tu margen de negociación salarial y los bonos de fichaje se expanden a la par de tu Prestigio general.
                </p>
              </div>

              {playerProfile.activeLoan && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  playerProfile.currentWeek >= playerProfile.activeLoan.returnWeek
                    ? 'border-gold-500/40 bg-gold-950/20 text-gold-200'
                    : 'border-slate-800 bg-slate-900 text-slate-300'
                }`}>
                  <strong className="block text-white mb-1">📄 Cedido por {playerProfile.activeLoan.originClubName}</strong>
                  {playerProfile.currentWeek >= playerProfile.activeLoan.returnWeek ? (
                    <>
                      <p className="mb-2">El préstamo terminó. ¿Ejerces la opción de compra por ${(playerProfile.activeLoan.optionToBuyAmount ?? 0).toLocaleString()} o vuelves a {playerProfile.activeLoan.originClubName}?</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onResolveLoan(true)} disabled={playerProfile.capital < (playerProfile.activeLoan.optionToBuyAmount ?? 0)} className="btn-fx-subtle py-1.5 px-2 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-bold text-2xs uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">Comprar</button>
                        <button onClick={() => onResolveLoan(false)} className="btn-fx-subtle py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold text-2xs uppercase cursor-pointer">Volver</button>
                      </div>
                    </>
                  ) : (
                    <p>Vuelves en {playerProfile.activeLoan.returnWeek - playerProfile.currentWeek} semana(s), salvo que el club ejerza tu opción de compra.</p>
                  )}
                </div>
              )}

              {/* Tu club bajó a segunda: el jugador tiene que poder decidir a conciencia si se
                  queda a pelear el ascenso o se va. Sin este aviso el descenso pasaba en silencio. */}
              {miClubDescendio && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-xs text-red-200 leading-relaxed">
                  <strong className="block text-red-300 mb-1">📉 {currentClub.name} descendió a la B</strong>
                  Los clubes de primera preguntan por ti. Puedes irte a seguir en la máxima categoría,
                  o quedarte a devolver al club donde estaba — la hinchada no olvida al que se queda.
                </div>
              )}

              {(() => {
                const windowOpen = mercadoAbierto(currentClub.name, playerProfile.currentWeek);
                if (windowOpen) {
                  return (
                    <div className="px-4 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-bold flex items-center gap-2">
                      <RefreshCw size={13} /> Ventana de fichajes ABIERTA — puedes concretar traspasos esta semana.
                    </div>
                  );
                }
                // En DÍAS, no en semanas: el jugador avanza por fechas, así que "faltan 3 semanas"
                // era una cuenta que no se correspondía con nada de lo que veía en el calendario.
                const diasQueFaltan = diasHastaElMercado(currentClub.name, playerProfile.currentWeek);
                return (
                  <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold flex items-center gap-2">
                    <RefreshCw size={13} /> Mercado de fichajes CERRADO — vuelve a abrir en {diasQueFaltan} día{diasQueFaltan !== 1 ? 's' : ''}. Puedes revisar ofertas, pero no concretarlas hasta entonces.
                  </div>
                );
              })()}

              {/* Dos columnas: cada oferta ocupaba el ancho ENTERO con un vacío grande en el medio
                  -- el club a la izquierda y el sueldo a la derecha, y entre medio nada -- así que
                  sólo entraban tres y había que scrollear para comparar. Compactadas y de a dos,
                  entran seis en el mismo alto, que es justo lo que hace falta acá: verlas juntas
                  para elegir. */}
              {/* RECIEN FICHADO: se dice POR QUE no hay ofertas.
                  Una pestaña vacia se lee como un error del juego, no como una regla. Y la regla es
                  parte de lo que hace que un traspaso pese: ver MESES_MINIMOS_EN_EL_CLUB. */}
              {mesesQueFaltan > 0 && (
                <div className="mb-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-3xs text-slate-400 font-mono uppercase leading-relaxed">
                  ⏳ Acabas de firmar con {currentClub.name}. Un jugador no se muda cada mes: hasta cumplir
                  medio año en el club no vas a recibir ofertas.
                  {' '}<span className="text-gold-400 font-black">
                    {mesesQueFaltan === 1 ? 'Falta 1 mes.' : `Faltan ${mesesQueFaltan} meses.`}
                  </span>
                </div>
              )}
              <div id="traspasos-ofertas" className="scroll-mt-4 grid xl:grid-cols-2 gap-2.5 items-start">
                {transferOffers.map(offer => {
                  const getLeagueFlagText = (lg: string) => {
                    switch (lg) {
                      case 'Colombiana': return '🇨🇴 COL';
                      case 'Brasileña': return '🇧🇷 BRA';
                      case 'Argentina': return '🇦🇷 ARG';
                      case 'Inglesa': return '🇬🇧 ENG';
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
                      data-vuelta-a-casa={offer.esVueltaACasa ? offer.club.name : undefined}
                      className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                        offer.esVueltaACasa
                          ? 'bg-gold-950/20 border-gold-500/40'
                          : 'bg-slate-900 border-slate-800'
                      } ${!offer.possible ? 'opacity-60' : ''}`}
                    >
                      {/* LA VUELTA A CASA lleva su motivo escrito. El resto del mercado no explica
                          nada -- te fichan por lo que servis y el numero lo dice todo. Esta si:
                          sin el motivo, al lado de una oferta que paga el doble, parece una oferta
                          mala y nada mas. */}
                      {offer.esVueltaACasa && offer.motivo && (
                        <p className="text-3xs text-gold-400 font-bold leading-snug">
                          {'\u{1F3E0}'} {offer.motivo}
                        </p>
                      )}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ClubBadge club={offer.club} size={34} className="rounded-xl border border-slate-800 bg-slate-950 shadow-inner shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="font-extrabold text-xs text-white truncate max-w-[150px] sm:max-w-[210px]">
                              {offer.club.name}
                            </h3>
                            <span className="text-3xs bg-slate-950 border border-slate-800 rounded px-1 py-0.5 text-slate-400 font-mono">
                              {getLeagueFlagText(offer.club.league)}
                            </span>
                            <span className={`text-[9px] px-1 py-0.5 rounded font-black uppercase text-3xs ${
                              offer.club.division === 2 ? 'bg-burgundy-500/10 text-burgundy-500 border border-burgundy-500/10' : 'bg-gold-500/10 text-gold-400 border border-gold-500/10'
                            }`}>
                              {offer.club.division === 2 ? '2ª Div' : '1ª Div'}
                            </span>
                          </div>
                          {/* El sueldo pegado al club, que es lo que se compara entre ofertas.
                              Antes vivía en la otra punta de la fila, con medio ancho de pantalla
                              de vacío en el medio. */}
                          <div className="font-mono text-3xs flex items-baseline gap-2 mt-0.5">
                            <span className="text-gold-400 font-bold">${offer.salaryOffer.toLocaleString()}/sem</span>
                            <span className="text-burgundy-500">+${offer.signOnBonus.toLocaleString()} firma</span>
                          </div>
                        </div>
                      </div>

                      {/* La descripción del club, recortada: es color, no un dato que se compare. */}
                      <p className="text-3xs text-slate-400 leading-snug line-clamp-2"
                         title={`${offer.club.dt} · ${offer.club.description}`}>
                        <strong>Mánager:</strong> {offer.club.dt} · {offer.club.description}
                      </p>

                      <div className="flex flex-row justify-end items-center gap-2">
                        <div>
                          {!offer.possible ? (
                            <span className="inline-block py-1 px-2.5 rounded bg-slate-950 text-slate-500 text-3xs font-bold border border-slate-800">
                              Rendimiento Insuficiente (Mín: {offer.reqPrestige})
                            </span>
                          ) : !mercadoAbierto(currentClub.name, playerProfile.currentWeek) ? (
                            <span className="inline-block py-1 px-2.5 rounded bg-slate-950 text-slate-500 text-3xs font-bold border border-slate-800">
                              Mercado Cerrado
                            </span>
                          ) : pendingTransferClubId === offer.club.id ? (
                            (() => {
                              // EL PLANTEL DE VERDAD, con sus dorsales de verdad. Lo que habia aca
                              // era un hash inventado -- (club.id.length + dorsal) % 7 === 0 -- que
                              // su propio comentario admitia: "no hay datos reales de dorsales
                              // ocupados en el juego". Ahora los hay.
                              const rosterDestino: any = getClubWithRoster(offer.club.name, offer.club.id);
                              const plantelDestino = rosterDestino?.plantilla
                                ? [...rosterDestino.plantilla.porteros, ...rosterDestino.plantilla.defensivos, ...rosterDestino.plantilla.ofensivos]
                                : [];
                              const tomados = dorsalesOcupados(plantelDestino);
                              const dorsalOcupado = tomados.has(pendingTransferDorsal);
                              return (
                                <div className="flex flex-col gap-2 w-full max-w-sm">
                                  <SelectorDeDorsal
                                    plantel={plantelDestino}
                                    clubName={offer.club.name}
                                    valor={pendingTransferDorsal}
                                    onElegir={setPendingTransferDorsal}
                                  />
                                  <button
                                    disabled={dorsalOcupado}
                                    onClick={() => {
                                      if (confirm(`¿Estás seguro de concretar el fichaje con ${offer.club.name} por un salario semanal de $${offer.salaryOffer}? Recibirás un bono de firma inmediato de $${offer.signOnBonus}.`)) {
                                        onAcceptTransfer(offer.club.id, offer.signOnBonus, pendingTransferDorsal);
                                        setPendingTransferClubId(null);
                                      }
                                    }}
                                    className="btn-fx py-1.5 px-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-black text-2xs uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    Confirmar fichaje
                                  </button>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="flex flex-col gap-1.5 items-end">
                              <button
                                onClick={() => {
                                  setPendingTransferClubId(offer.club.id);
                                  setPendingTransferDorsal(playerProfile.dorsal);
                                }}
                                className="btn-fx py-1.5 px-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-black text-2xs uppercase tracking-wider cursor-pointer"
                              >
                                Aceptar Traspaso
                              </button>
                              {!playerProfile.activeLoan && (
                                <button
                                  onClick={() => {
                                    if (confirm(`¿Salir a préstamo a ${offer.club.name}? Vuelves a ${currentClub.name} en unas semanas, salvo que se ejerza la opción de compra.`)) {
                                      onLoanOut(offer.club.id);
                                    }
                                  }}
                                  className="btn-fx-subtle py-1 px-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                                >
                                  Salir a préstamo
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Radar de interés: los clubes que TODAVÍA no podés fichar y cuánto te falta.
                  Antes el mercado sólo mostraba las 3 mejores ofertas ya disponibles, así que un
                  club grande aparecía de la nada el día que lo alcanzabas -- no había forma de
                  saber cuánto faltaba ni si lo que faltaba era rendimiento o partidos. Usa el mismo
                  criterio que las ofertas reales: si dice "te faltan 8", a los 8 aparece la oferta. */}
              {(() => {
                const rendimiento = rendimientoDe(playerProfile);
                const radar = radarDeInteres(playerProfile, currentClub, clubesJugables())
                  .map(p => ({ ...p, club: ULTIMATE_CLUBS_DATABASE.find(c => c.id === p.clubId) }))
                  .filter((p): p is typeof p & { club: Club } => !!p.club);
                if (radar.length === 0) return null;
                return (
                  <div id="traspasos-radar" className="scroll-mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                      🎯 Quién te está mirando
                    </h3>
                    <p className="text-2xs text-slate-400 mb-3 leading-relaxed">
                      Tu Rendimiento hoy es <strong className="text-gold-400">{Math.round(rendimiento)}</strong> con{' '}
                      <strong className="text-gold-400">{playerProfile.careerStats.partidosHistoricos}</strong>{' '}
                      {playerProfile.careerStats.partidosHistoricos === 1 ? 'partido' : 'partidos'} en las piernas.
                      Sube con la Relación DT, con goles y asistencias por partido, y con títulos.
                    </p>

                    <div className="space-y-2.5">
                      {radar.map(p => (
                        <div key={p.clubId} className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
                          <div className="flex items-center gap-2.5">
                            <ClubBadge club={p.club} size={22} colorFallback={false} />
                            <span className="text-2xs font-black text-white truncate flex-1 min-w-0" title={p.club.name}>
                              {p.club.name}
                            </span>
                            <span className="text-3xs font-mono text-slate-400 shrink-0">
                              {Math.round(p.progreso * 100)}%
                            </span>
                          </div>

                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                            <div
                              className="bg-gold-500 h-full rounded-full transition-[width] duration-500 ease-out"
                              style={{ width: `${Math.min(100, p.progreso * 100)}%` }}
                            />
                          </div>

                          {/* Se dice QUÉ falta, no sólo cuánto: sin esto un jugador con el
                              rendimiento cumplido pero sin partidos no entiende por qué sigue
                              sin poder ir. */}
                          <p className="text-3xs font-mono text-slate-400 mt-1.5">
                            {p.faltaRendimiento > 0 && p.faltanPartidos > 0
                              ? `Te faltan ${p.faltaRendimiento} de Rendimiento y ${p.faltanPartidos} ${p.faltanPartidos === 1 ? 'partido' : 'partidos'}.`
                              : p.faltaRendimiento > 0
                              ? `Rendimiento: te faltan ${p.faltaRendimiento} para llegar a ${p.reqPrestige}.`
                              : `Ya tienes el nivel: te faltan ${p.faltanPartidos} ${p.faltanPartidos === 1 ? 'partido' : 'partidos'} de rodaje.`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div id="traspasos-agente" className="scroll-mt-4 grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    🤝 Representante
                  </h3>
                  {playerProfile.agent ? (
                    <div className="space-y-2">
                      <p className="text-2xs text-slate-300">
                        <span className="text-white font-bold">{playerProfile.agent.name}</span>
                        {playerProfile.agent.type === 'profesional'
                          ? ` — agente profesional, comisión ${playerProfile.agent.commissionPct}% por traspaso.`
                          : ' — un cercano tuyo, sin experiencia real negociando.'}
                      </p>
                      <button
                        onClick={onFireAgent}
                        className="btn-fx-subtle py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-300 hover:border-red-500/40 font-bold text-2xs uppercase cursor-pointer"
                      >
                        Terminar relación
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-3xs text-slate-400 leading-relaxed mb-2">
                        Un agente profesional negocia mejores ofertas y te abre más clubes, a cambio de
                        una comisión. También puedes dejar que un familiar o amigo cumpla ese rol: no
                        cuesta nada contratarlo, pero negocia evidentemente peor.
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {AGENTS_DATABASE.map(a => (
                          <button
                            key={a.id}
                            onClick={() => onHireAgent(a.id)}
                            className="btn-fx-subtle py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer text-left"
                          >
                            {a.name}
                            <span className="block text-3xs text-slate-500 font-mono">{'★'.repeat(a.reputation)} · {a.commissionPct}%</span>
                          </button>
                        ))}
                        <button
                          onClick={() => onHireAgent('familia')}
                          className="btn-fx-subtle col-span-2 py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-2xs font-bold text-slate-300 cursor-pointer text-left"
                        >
                          Un familiar/amigo cercano
                          <span className="block text-3xs text-slate-500 font-mono">Sin reputación · 3%</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    ✍️ Renovación con {currentClub.name}
                  </h3>
                  <p className="text-3xs text-slate-400 leading-relaxed mb-3">
                    Pídele al club que reafirme su apuesta por ti antes de que el vínculo se enfríe.
                    Necesitas buena relación con el DT -- el club puede decir que no.
                  </p>
                  <button
                    onClick={onRequestRenewal}
                    disabled={playerProfile.prestige < 55}
                    title={playerProfile.prestige < 55
                      ? `Necesitas 55 de Relación DT para pedir la renovación (tienes ${playerProfile.prestige}).`
                      : 'Pedile al club que renueve tu contrato.'}
                    className="btn-fx-subtle w-full min-h-[44px] py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Pedir renovación
                  </button>
                  {/* La condición se MUESTRA, no se deja sólo en el title: en un teléfono no hay
                      hover, así que el botón gris era un callejón sin salida sin explicación. */}
                  {playerProfile.prestige < 55 && (
                    <p className="text-3xs text-slate-400 font-mono mt-2 text-center">
                      Te faltan {55 - playerProfile.prestige} de Relación DT (vas {playerProfile.prestige}/55).
                    </p>
                  )}
                </div>
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

              {/* Compactada por el mismo motivo que el entrenamiento: cada tarjeta medía ~330 px
                  (foto de 144 + descripción + ventaja + precio) y comprar obligaba a scrollear toda
                  la pantalla. Se conservan las fotos -- en la tienda son parte de la gracia -- pero
                  más chicas, con menos aire y la descripción recortada a dos renglones. */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                      <div className="relative h-24 shrink-0 overflow-hidden">
                        {/* Filtro parejo para todas: son fotos de stock de origen distinto y venían
                            con brillos y saturaciones que no pegaban entre sí -- una tarjeta clara
                            al lado de una oscura hacía ver la grilla como un collage. Bajando un
                            poco el brillo y subiendo el contraste quedan del mismo juego, y encima
                            el título blanco de abajo se lee mejor sobre cualquiera de ellas.

                            loading="lazy": pesan entre 460 KB y 944 KB cada una y son la grilla más
                            pesada del juego. Sin esto se descargaban TODAS al abrir el Dashboard,
                            aunque la pestaña que estuvieras mirando fuera otra. */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover brightness-[0.82] contrast-[1.08] saturate-[0.92] transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-3xl">💎</div>
                        )}
                        {/* DOS capas, no una.
                            La de abajo es el degradado de siempre, ahora mas denso: con 6 fotos
                            elegidas a mano alcanzaba con via-slate-950/10, pero el catalogo pasó a
                            50 fotos de banco con brillos que van de un estudio de TV iluminado a una
                            cancha de noche, y sobre las claras el titulo blanco se lavaba.
                            La de arriba es un velo parejo y debil sobre TODA la tarjeta: es lo que
                            iguala el brillo entre una foto y la de al lado. El degradado solo
                            oscurece abajo, asi que sin este velo la mitad superior seguia siendo un
                            collage. Ver PENDIENTES_UI_UX.md, "Overlay uniforme sobre las imagenes de
                            la Tienda". */}
                        <div className="absolute inset-0 bg-slate-950/15" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                        <span className="absolute bottom-2 left-3 text-sm font-black text-white drop-shadow-lg leading-tight pr-3">
                          {item.name}
                        </span>
                        {item.purchased && (
                          <span className="absolute top-2 right-2 inline-flex gap-1 items-center px-2 py-0.5 rounded bg-gold-500 text-slate-950 font-mono text-3xs font-black uppercase shadow">
                            Adquirido
                          </span>
                        )}
                      </div>

                      <div className="p-3 flex flex-col flex-1 gap-1.5">
                        <p className="text-3xs text-slate-400 leading-snug line-clamp-2" title={item.description}>
                          {item.description}
                        </p>
                        <p className="text-3xs text-gold-400 font-mono font-bold uppercase leading-snug">
                          ✨ {item.perkText}
                        </p>

                        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
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
                              className={`btn-fx-subtle py-1.5 px-3.5 rounded-xl text-3xs font-black uppercase tracking-wider transition-all ${
                                isAffordable
                                  ? 'bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 hover:from-gold-300 hover:to-gold-500 cursor-pointer'
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

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg mt-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                  💼 Finanzas Personales
                </h3>
                <p className="text-3xs text-slate-400 leading-relaxed mb-3">
                  Invertí parte de tu capital en algo que te devuelva un ingreso semanal. Cada
                  inversión tiene su propio riesgo de perder el capital -- cuanto más devuelve, más
                  riesgo corre.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {INVESTMENTS_DATABASE.map(inv => {
                    const owned = (playerProfile.investments ?? []).some(i => i.id === inv.id);
                    return (
                      <div key={inv.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <span className="text-2xs font-bold text-white block">{inv.name}</span>
                        <span className="text-3xs text-gold-400 font-mono block mt-1">+${inv.weeklyReturn}/sem</span>
                        <span className="text-3xs text-slate-500 font-mono block">Riesgo: {inv.riskOfLossPct}%/sem</span>
                        <button
                          onClick={() => onBuyInvestment(inv.id)}
                          disabled={owned || playerProfile.capital < inv.cost}
                          className="btn-fx-subtle w-full mt-2 py-1.5 px-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-gold-500/40 text-2xs font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {owned ? 'Ya invertiste' : `Invertir $${inv.cost.toLocaleString()}`}
                        </button>
                      </div>
                    );
                  })}
                </div>
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
                  <div className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${capReached ? 'bg-burgundy-500/10 border-burgundy-500/20 text-burgundy-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
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
                        {/* Mismo filtro Y MISMO OVERLAY que la Tienda: las dos grillas se ven una al
                            lado de la otra en la misma sesión y tienen que sentirse del mismo juego.
                            El filtro ya era el mismo; el velo parejo de arriba se había quedado sólo
                            en la Tienda, así que acá la mitad superior seguía siendo un collage de
                            brillos -- que es justo lo que el velo existe para emparejar. */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover brightness-[0.82] contrast-[1.08] saturate-[0.92] transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600">
                            <Handshake size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/15" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
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
                                className="btn-fx-subtle py-1 px-2 rounded-xl text-3xs font-bold uppercase tracking-wider text-red-400 border border-red-500/20 hover:bg-red-950/30 cursor-pointer"
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
                                className="btn-fx-subtle py-1.5 px-3 rounded-xl text-3xs font-black uppercase tracking-wider bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 hover:from-gold-300 hover:to-gold-500 cursor-pointer"
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
              {/* PESTAÑAS, UNA COSA POR VEZ, y en escritorio también.
                  Acá había ATAJOS -- botones que hacían scroll hasta cada panel -- con el argumento
                  de que se querría comparar la tabla de liga con el cuadro de la copa. En la
                  práctica no: las tres cosas juntas hacen una pantalla de varios metros donde lo
                  que buscás siempre queda abajo, y eso pasa igual en un monitor que en un teléfono.
                  Pedido explícito: "si está en liga, sólo la tabla de liga; si tocás cracks, sólo
                  cracks; si tocás copa, sólo la copa -- para PC y celular". */}
              {/* UNA PESTAÑA POR TORNEO, con su nombre. No dice "Liga" y "Copa" en genérico: dice
                  "Bundesliga", "UEFA Champions League", "DFB-Pokal", "Copa Mundial FIFA". Así se ve
                  de un vistazo TODO lo que tu club está jugando esta temporada, que es justo lo que
                  no se veía cuando los tres paneles vivían apilados uno debajo del otro.
                  La barra scrollea de costado: en un teléfono cinco torneos no entran de frente. */}
              <nav
                aria-label="Secciones de Copas y Tablas"
                className="flex gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto"
              >
                {seccionesDeTablas.map(({ id, texto, Icono }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSeccionDeTablas(id)}
                    aria-current={seccionDeTablas === id ? 'page' : undefined}
                    className={`flex-1 min-w-fit shrink-0 min-h-[44px] px-3 flex items-center justify-center gap-1.5 rounded-xl font-black uppercase tracking-wider text-3xs transition-colors cursor-pointer ${
                      seccionDeTablas === id
                        ? 'bg-gold-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icono size={14} />
                    <span className="truncate">{texto}</span>
                  </button>
                ))}
              </nav>
              {/* DÓNDE VAS EN CADA TORNEO, arriba de todo.

                  Cada número de acá sale del MISMO panel que está más abajo -- la posición de la
                  tabla de posiciones, los goles del listado de goleadores -- y no se vuelve a
                  deducir por las suyas: dos fuentes contestando la misma pregunta es como este
                  juego se rompió varias veces. Ver ResumenDeCompeticiones. */}
              {(() => {
                const iMio = myLeagueTable.findIndex(t => t.clubId === currentClub.id);
                const mio = iMio >= 0 ? myLeagueTable[iMio] : null;
                const goles = lideresDeHoy?.goleadores ?? [];
                const iGol = goles.findIndex(g => g.esVos);
                const lineas = [
                  ...(mio ? [{
                    rotulo: getLeagueDisplay(currentClub.league, currentClub.division).name,
                    valor: `${iMio + 1}º (${mio.puntos} pts)`,
                    destacado: iMio === 0,
                  }] : []),
                  ...(iGol >= 0 ? [{
                    rotulo: iGol === 0 ? 'Bota de oro' : 'Goleadores',
                    valor: `${iGol + 1}º (${goles[iGol].goles}G)`,
                    destacado: iGol === 0,
                  }] : []),
                ];
                return (
                  <ResumenDeCompeticiones
                    nota={playerProfile.lastMatchRating ?? null}
                    titulo="Centro de Competición y Copas"
                    bajada={`${rotuloDeTemporada(currentClub.name, playerProfile.currentWeek)} · ${currentClub.name} · ${misTrofeos.reduce((n, t) => n + t.anios.length, 0)} títulos oficiales`}
                    lineas={lineas}
                  />
                );
              })()}

              {seccionDeTablas === 'liga' && (
              <div id="tabla-posiciones" className="scroll-mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
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
                    className="bg-slate-950 border border-slate-800 rounded-xl text-2xs font-bold text-white py-1 px-2 focus:outline-none focus:border-gold-500"
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

                {/* EL CUADRO, DEBAJO DE LA TABLA. Cuando el torneo llega a los cuadrangulares, la
                    tabla de la fase regular ya no dice quién está peleando el título: lo dice el
                    cuadro. Se dibuja con el MISMO componente que la Libertadores y la copa
                    nacional, así que las tres eliminatorias se leen igual.

                    Solo para TU liga: el cuadro se siembra con la tabla de tu carrera y existe
                    únicamente para ella. Con otra liga elegida en el selector no hay nada que
                    mostrar, y dibujar el tuyo bajo la tabla de otra sería mentir. */}
                {selectedLeagueKey === myLeagueKey && cuadrangularDeLaTemporada
                  && (cuadrangularDeLaTemporada.tiesByRound?.length ?? 0) > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-2xs font-black uppercase tracking-widest text-gold-400">
                        Cuadrangulares{torneoEnCurso ? ` · ${torneoEnCurso}` : ''}
                      </h4>
                      <span className="text-3xs text-slate-500 font-mono">
                        {cuadrangularDeLaTemporada.championId
                          ? (ULTIMATE_CLUBS_DATABASE.find(c => c.id === cuadrangularDeLaTemporada.championId)?.name ?? '') + ' campeón'
                          : sigueEnPlayoffDeLiga(cuadrangularDeLaTemporada, currentClub.id)
                            ? `${currentClub.name} sigue en carrera.`
                            : `${currentClub.name} quedó eliminado.`}
                      </span>
                    </div>
                    <CuadroEliminatoria
                      rondas={rondasDeIdaYVuelta(cuadrangularDeLaTemporada.tiesByRound)}
                      miId={currentClub.id}
                      campeonId={cuadrangularDeLaTemporada.championId ?? null}
                    />
                  </div>
                )}
              </div>
              )}

              {seccionDeTablas === 'cracks' && (
              <div id="tabla-goleadores" className="scroll-mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gold-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Award size={13} /> ESTADÍSTICAS DE JUGADORES · {tituloDeLideres.toUpperCase()}
                </h3>
                {(() => {
                  const goleador = hayLideresDeHoy ? lideresDeHoy!.goleadores[0] : null;
                  const asistidor = hayLideresDeHoy ? lideresDeHoy!.asistidores[0] : null;
                  const amonestado = hayLideresDeHoy ? lideresDeHoy!.amonestados[0] : null;
                  const expulsado = hayLideresDeHoy ? lideresDeHoy!.expulsados[0] : null;
                  const arquero = hayLideresDeHoy ? lideresDeHoy!.arqueros[0] : null;
                  const stats: { icon: string; label: string; entry: { name: string; clubName: string } | null; value: string | null }[] = [
                    // LAS CINCO salen de la tabla de TU carrera, sin excepcion y sin respaldo.
                    //
                    // Antes cada tarjeta caia por su cuenta a REAL_LEAGUE_LEADERS cuando su dato
                    // todavia no existia, y el resultado era un panel MEZCLADO: el goleador ya era
                    // real (Anderson Angulo, 2 goles) mientras al lado seguia "Omar Fernandez, 8
                    // asistencias" de la tabla fija de 2026. Peor que estar todo viejo, porque
                    // parece consistente y no lo es. Reportado: "se arreglo los goleadores pero
                    // quiero eso mismo con todos los datos".
                    //
                    // Sin dato todavia, la tarjeta lo dice. Que es la verdad: nadie dio una
                    // asistencia todavia en esta carrera.
                    { icon: '⚽', label: 'Máximo Goleador',
                      entry: goleador ? { name: goleador.esVos ? `${goleador.nombre} (tú)` : goleador.nombre, clubName: goleador.clubName } : null,
                      value: goleador ? `${goleador.goles} goles` : null },
                    { icon: '🎯', label: 'Máximo Asistidor',
                      entry: asistidor ? { name: asistidor.esVos ? `${asistidor.nombre} (tú)` : asistidor.nombre, clubName: asistidor.clubName } : null,
                      value: asistidor ? `${asistidor.asistencias} asistencias` : null },
                    // El arquero muestra el PROMEDIO de goles recibidos, que es como se mide la
                    // portería menos vencida: el total premiaba al que menos jugó.
                    { icon: '🧤', label: 'Portería Menos Vencida',
                      entry: arquero ? { name: arquero.nombre, clubName: arquero.clubName } : null,
                      value: arquero ? `${(arquero.golesRecibidos! / arquero.partidosDeArquero!).toFixed(2)} goles por partido` : null },
                    { icon: '🟨', label: 'Más Amarillas',
                      entry: amonestado ? { name: amonestado.esVos ? `${amonestado.nombre} (tú)` : amonestado.nombre, clubName: amonestado.clubName } : null,
                      value: amonestado ? `${amonestado.amarillas} amarillas` : null },
                    { icon: '🟥', label: 'Más Rojas',
                      entry: expulsado ? { name: expulsado.esVos ? `${expulsado.nombre} (tú)` : expulsado.nombre, clubName: expulsado.clubName } : null,
                      value: expulsado ? `${expulsado.rojas} rojas` : null },
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
                              <p className="text-3xs text-slate-600 italic">Todavía nadie en esta competición.</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              )}

              {/* EL TORNEO DE SELECCIONES va PRIMERO y solo mientras se juega: cuando hay Mundial o
                  continental, es lo unico que esta pasando -- las ligas estan paradas -- asi que es
                  lo que el jugador viene a mirar. Fuera de la ventana no se dibuja.
                  Vive en la pestaña de COPA porque eso es: un torneo, no una tabla de liga. */}
              {seccionDeTablas === 'selecciones' && torneoDeSelecciones && (
                <div data-torneo={torneoDeSelecciones.torneo}
                  className="bg-slate-900 border border-gold-500/30 rounded-2xl p-5 shadow-lg space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gold-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                    {torneoDeSelecciones.torneo === 'mundial' ? '🌎' : '🏆'} {torneoDeSelecciones.nombre}
                    {' · '}{cupStageLabel(torneoDeSelecciones.estado.stage)}
                  </h3>

                  {torneoDeSelecciones.estado.stage === 'groups' ? (
                    <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
                      {torneoDeSelecciones.estado.groups.map(group => (
                        <div key={group.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl">
                          <h4 className="font-extrabold text-white border-b border-slate-800 pb-1.5 mb-2 text-2xs uppercase">
                            Grupo {group.id}
                          </h4>
                          <ul className="space-y-1.5 text-slate-300 font-mono text-3xs">
                            {sortTable(group.table).map((row, idx) => (
                              <li
                                key={row.clubId || row.name}
                                className={`flex justify-between gap-2 ${
                                  row.clubId === torneoDeSelecciones.miSeleccionId ? 'text-gold-400 font-black' : ''
                                }`}
                              >
                                <span className="truncate">{idx + 1}. {row.name.replace('Selección de ', '')}</span>
                                <span className="text-slate-500 shrink-0">{row.puntos} Pts</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : torneoDeSelecciones.estado.stage === 'done' ? (
                    <p className="text-2xs text-slate-300">
                      🏆 Campeón: <strong className="text-white">{nombreDeSeleccion(torneoDeSelecciones.estado.championId)}</strong>
                    </p>
                  ) : (
                    <CuadroEliminatoria
                      rondas={rondasDePartidoUnico(torneoDeSelecciones.estado.knockout?.matchesByRound)}
                      miId={torneoDeSelecciones.miSeleccionId}
                      campeonId={torneoDeSelecciones.estado.knockout?.championId ?? torneoDeSelecciones.estado.championId ?? null}
                    />
                  )}
                </div>
              )}

              {/* LA COPA NACIONAL, que hasta acá no se veía en ninguna parte.
                  Se jugaba -- hay cuadro, hay rondas y hay campeón -- pero esta pestaña sólo
                  mostraba la liga, los goleadores y la copa continental, así que el jugador
                  disputaba la DFB-Pokal o la Copa Colombia sin poder mirar nunca el cuadro. */}
              {seccionDeTablas === 'nacional' && copaNacionalDeLaTemporada && (
                <div id="tabla-copa-nacional" className="scroll-mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-burgundy-500 border-b border-slate-800 pb-2 flex items-center gap-2">
                    🏆 {nombreCopaNacional(currentClub.league).toUpperCase()}
                    {copaNacionalDeLaTemporada.championId
                      ? ' · TERMINADA'
                      : ` · ${rondaActual(copaNacionalDeLaTemporada).toUpperCase()}`}
                  </h3>
                  {copaNacionalDeLaTemporada.championId ? (
                    <p className="text-2xs text-slate-300">
                      🏆 Campeón: <strong className="text-white">{clubNameById(copaNacionalDeLaTemporada.championId)}</strong>
                    </p>
                  ) : (
                    <p className="text-3xs text-slate-500 font-mono">
                      {sigueEnCopa(copaNacionalDeLaTemporada, currentClub.id)
                        ? `${currentClub.name} sigue en carrera.`
                        : `${currentClub.name} quedó eliminado de esta edición.`}
                    </p>
                  )}
                  <CuadroEliminatoria
                    rondas={rondasDeIdaYVuelta(copaNacionalDeLaTemporada.bracket?.tiesByRound)}
                    miId={currentClub.id}
                    campeonId={copaNacionalDeLaTemporada.championId ?? null}
                  />
                </div>
              )}

              {seccionDeTablas === 'continental' && (
              <div id="tabla-copa" className="scroll-mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                {conmebolCup ? (
                  <>
                    <h3 className="text-xs font-black uppercase tracking-widest text-burgundy-500 border-b border-slate-800 pb-2 flex items-center gap-2">
                      🏆 {conmebolCup.cupId === 'libertadores' ? 'COPA LIBERTADORES'
                        : conmebolCup.cupId === 'concacaf' ? 'CONCACAF CHAMPIONS CUP'
                        : 'COPA SUDAMERICANA'} {conmebolCup.year} · {cupStageLabel(conmebolCup.stage)}
                    </h3>
                    {/* La Concacaf NO tiene fase de grupos: son cinco rondas de eliminación directa
                        seguidas, y así se juega de verdad. Sin decirlo, el jugador entra a su primer
                        partido y cree que el juego se saltó los grupos -- reportado dos veces con la
                        misma frase: "me metió a ese partido sin haber jugado grupos". */}
                    {conmebolCup.cupId === 'concacaf' && (
                      <p className="text-3xs text-slate-500 leading-relaxed -mt-1">
                        La Concacaf Champions Cup no tiene fase de grupos: se juega a eliminación
                        directa desde la primera ronda, como en la realidad.
                      </p>
                    )}
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
                      <CuadroEliminatoria
                        rondas={rondasDeIdaYVuelta(conmebolCup.knockout?.tiesByRound)}
                        miId={currentClub.id}
                        campeonId={conmebolCup.knockout?.championId ?? conmebolCup.championId ?? null}
                      />
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
                      <CuadroEliminatoria
                        rondas={rondasDeIdaYVuelta(uefaCup.stage === 'playoff' ? [uefaCup.playoff ?? []] : uefaCup.knockout?.tiesByRound)}
                        miId={currentClub.id}
                        campeonId={uefaCup.knockout?.championId ?? uefaCup.championId ?? null}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-2xs text-slate-500">Tu club no está clasificado a ningún torneo continental esta temporada.</p>
                )}
              </div>
              )}
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

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCalendarMonthOffset(m => Math.max(limiteDeMeses.min, m - 1))}
                    disabled={mesVisible <= limiteDeMeses.min}
                    className="btn-fx-subtle w-8 h-8 rounded-full bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-300 disabled:hover:border-slate-800"
                    title={mesVisible <= limiteDeMeses.min ? 'Es el primer mes de la temporada' : 'Mes anterior'}
                  >
                    ‹
                  </button>
                  <h3 className="font-black uppercase text-sm text-white tracking-wide">
                    {CALENDAR_MONTH_NAMES[calendarGridMonth]} <span className="text-slate-500 font-normal">{calendarGridYear}</span>
                  </h3>
                  <button
                    onClick={() => setCalendarMonthOffset(m => Math.min(limiteDeMeses.max, m + 1))}
                    disabled={mesVisible >= limiteDeMeses.max}
                    className="btn-fx-subtle w-8 h-8 rounded-full bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-300 disabled:hover:border-slate-800"
                    title={mesVisible >= limiteDeMeses.max ? 'La temporada termina acá; el fixture del año que viene todavía no está sorteado' : 'Mes siguiente'}
                  >
                    ›
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[620px]">
                    <div className="grid grid-cols-7 gap-1 text-3xs font-mono uppercase text-center text-slate-500 mb-1">
                      {CALENDAR_WEEKDAY_NAMES.map(d => <div key={d} className="py-1">{d}</div>)}
                    </div>
                    <div className="space-y-1">
                      {calendarWeeks.map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7 gap-1">
                          {week.map((day, di) => (
                            <div
                              key={di}
                              className={`min-h-[78px] rounded-xl p-1.5 ${
                                day
                                  ? (calendarEventsByDay.get(day) || []).some(e => e.esHoy)
                                    // El partido que te toca AHORA: sin esto la tarjeta decia
                                    // "Libertadores" y en el calendario no se distinguia cual de
                                    // todos era, que es de donde salia la confusion.
                                    ? 'bg-gold-950/40 border-2 border-gold-500'
                                    // El dia entero se tiñe del color de su torneo. Es la mitad del
                                    // "color mas grande" que pidio el jugador: la otra mitad es la
                                    // pastilla, que ahora es un bloque lleno y no una linea fina.
                                    : `border border-slate-850 ${(calendarEventsByDay.get(day) || [])[0]?.cellClass ?? 'bg-slate-950'}`
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
                                    {(calendarEventsByDay.get(day) || []).map((ev, ei) => (
                                      // El bloque de color lleva SIEMPRE el nombre del torneo. Antes
                                      // un partido jugado mostraba sólo "V 4-1" y se perdía de qué
                                      // torneo había sido; ahora el resultado va en su propia fichita
                                      // adentro, sobre el color del torneo.
                                      <div
                                        key={ei}
                                        title={ev.sublabel}
                                        className={`rounded-md px-1 py-1 ${ev.colorClass}`}
                                      >
                                        <div className="flex items-center gap-1">
                                          {ev.opponentClub ? (
                                            <ClubBadge club={ev.opponentClub} size={12} className="rounded-sm shrink-0" />
                                          ) : (
                                            // El mismo café que la tarjeta de "Hoy no se juega":
                                            // una pelota en un día libre dice lo contrario que el
                                            // rótulo que tiene al lado.
                                            <span className="shrink-0 text-[9px] leading-none">{ev.label === 'Libre' ? '☕' : '⚽'}</span>
                                          )}
                                          <span className="truncate text-[9px] leading-tight font-black tracking-tight">{ev.label}</span>
                                        </div>
                                        {ev.played && (
                                          <div className={`mt-0.5 rounded bg-slate-950/60 text-center text-[9px] leading-tight font-black font-mono ${
                                            ev.result === 'V' ? 'text-gold-300' : ev.result === 'D' ? 'text-red-400' : 'text-slate-300'
                                          }`}>
                                            {ev.result} {ev.score}
                                          </div>
                                        )}
                                      </div>
                                    ))}
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

                {/* Los puntos salen del MISMO mapa que pinta las celdas. Escrita aparte, esta
                    leyenda ya se había quedado describiendo colores que no existían: prometía un
                    rojo para los playoffs y un borgoña para la copa continental cuando en la grilla
                    todas las copas y los playoffs eran del mismo borgoña. */}
                <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-800 text-3xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded inline-block ${COLOR_DE_TORNEO.liga.punto}`} /> Liga ({currentClub.league})</span>
                  <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded inline-block ${COLOR_DE_TORNEO.playoff.punto}`} /> Playoffs</span>
                  <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded inline-block ${COLOR_DE_TORNEO.nacional.punto}`} /> {nombreCopaNacional(currentClub.league)}</span>
                  <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded inline-block ${COLOR_DE_TORNEO.continental.punto}`} /> Copa internacional</span>
                  <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded inline-block ${COLOR_DE_TORNEO.seleccion.punto}`} /> Selección</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-950/60 border border-slate-700 inline-block" /> V / E / D: ya jugado</span>
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
                  <div key={category} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
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
                    <ClubBadge club={viewedClub} size={40} className="rounded-xl border border-slate-800 bg-slate-950 shadow-inner" />
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
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl text-2xs font-bold text-white py-1.5 px-2 focus:outline-none focus:border-gold-500"
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
                    const eligibleMentees = squadOf(currentClub).filter(p => p !== playerProfile.name && getMenteeAge(currentClub.id, p, seasonsElapsed(currentClub.name, playerProfile.currentWeek)) <= MENTEE_MAX_AGE);
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
                            className={`btn-fx-subtle py-1.5 px-3 text-2xs font-bold rounded-xl border transition-all ${
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
                              className={`btn-fx-subtle py-1.5 px-3 text-2xs font-bold rounded-xl border transition-all ${
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
                          <p className="text-2xs text-slate-400 mt-2 italic">
                            Ningún jugador del plantel tiene {MENTEE_MAX_AGE} años o menos esta temporada: no hay a quién apadrinar por ahora.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>}

                {/* El otro lado del vínculo. Va en su propio bloque y sólo mientras seas joven: la
                    carrera arranca a los 17 y hasta ahora lo único que veía un juvenil acá era que
                    no podía apadrinar a nadie -- un callejón sin salida en su primera pantalla. */}
                {isViewingOwnClub && puedeTenerMentor(playerProfile.age) && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
                    {(() => {
                      const posiblesMentores = squadOf(currentClub)
                        .filter(p => p !== playerProfile.name
                          && getMenteeAge(currentClub.id, p, seasonsElapsed(currentClub.name, playerProfile.currentWeek)) >= MENTOR_MIN_AGE);
                      return (
                        <>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="text-3xs font-black uppercase tracking-widest text-slate-400 mr-1">
                              🎓 Tu referente
                            </h3>
                            <button
                              type="button"
                              onClick={() => onSelectMentor(null)}
                              className={`btn-fx-subtle min-h-[36px] py-1.5 px-3 text-2xs font-bold rounded-xl border transition-all ${
                                !playerProfile.mentorName
                                  ? 'border-gold-500 bg-gold-950/30 text-white shadow-sm'
                                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                              }`}
                            >
                              Ninguno
                            </button>
                            {posiblesMentores.map(p => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => onSelectMentor(p)}
                                className={`btn-fx-subtle min-h-[36px] py-1.5 px-3 text-2xs font-bold rounded-xl border transition-all ${
                                  playerProfile.mentorName === p
                                    ? 'border-gold-500 bg-gold-950/30 text-white shadow-sm'
                                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                                }`}
                              >
                                {displayName(p)}
                              </button>
                            ))}
                          </div>
                          <p className="text-2xs text-slate-400 mt-2 leading-relaxed">
                            {posiblesMentores.length === 0
                              ? `No hay veteranos de ${MENTOR_MIN_AGE} años o más en el plantel: por ahora te las arreglas solo.`
                              : playerProfile.mentorName
                              ? `${displayName(playerProfile.mentorName)} te tiene bajo su ala: te sostiene el ánimo en las derrotas y te suma en el vestuario al cerrar la temporada.`
                              : 'Elige a un veterano del plantel como referente: las derrotas te van a pegar menos y vas a ganar lugar en el vestuario.'}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* El mensaje viejo era una nota técnica para el desarrollador -- hablaba del JSON,
                    de playersDatabase y del "Excel de origen" -- y no le decía nada al jugador.
                    Ahora simplemente avisa que ese plantel todavía no está cargado. */}
                {totalJugadoresReales === 0 && (
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-2xs text-slate-400 leading-relaxed">
                    📋 La plantilla de <strong className="text-slate-300">{viewedClub.name}</strong> todavía no está disponible.
                  </div>
                )}

                {/* EL FILTRO POR PUESTO, sólo en celular. Un plantel son 28 nombres en una columna:
                    llegar al último delantero eran cuatro pantallas de scroll. En escritorio los
                    tres grupos se ven al lado y no hay nada que elegir, así que la barra no existe
                    ahí (ver BarraDeSecciones). */}
                <BarraDeSecciones<PuestoDelPlantel>
                  etiqueta="Puestos del plantel"
                  activa={puestoMovil}
                  onCambiar={setPuestoMovil}
                  destinos={[
                    { id: 'porteros', texto: 'Porteros', Icono: ShieldAlert },
                    { id: 'defensas', texto: 'Defensas', Icono: Users },
                    { id: 'ofensivos', texto: 'Ofensivos', Icono: Swords },
                  ] as const}
                />

                <div className="grid md:grid-cols-3 gap-3">
                  <div className={`${soloEnPuesto('porteros')} bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2`}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5 flex justify-between items-center">
                      <span>🧤 Porteros (GK)</span>
                      <span className="text-3xs font-mono text-gold-400 font-normal">{plantilla.porteros.length}</span>
                    </h3>
                    <div className="space-y-1">
                      {plantilla.porteros.length > 0 ? plantilla.porteros.map(player => (
                        <div key={player.player_id} className="px-2 py-1.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center gap-2">
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

                  <div className={`${soloEnPuesto('defensas')} bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2`}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5 flex justify-between items-center">
                      <span>🧱 Defensivos (DF)</span>
                      <span className="text-3xs font-mono text-gold-400 font-normal">{plantilla.defensivos.length}</span>
                    </h3>
                    <div className="space-y-1">
                      {plantilla.defensivos.length > 0 ? plantilla.defensivos.map(player => (
                        <div key={player.player_id} className="px-2 py-1.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center gap-2">
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

                  <div className={`${soloEnPuesto('ofensivos')} bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2`}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1.5 flex justify-between items-center">
                      <span>🎯 Ofensivos (OF)</span>
                      <span className="text-3xs font-mono text-gold-400 font-normal">{plantilla.ofensivos.length}</span>
                    </h3>
                    <div className="space-y-1">
                      {plantilla.ofensivos.length > 0 ? plantilla.ofensivos.map(player => (
                        <div key={player.player_id} className="px-2 py-1.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center gap-2">
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

      {/* LA BARRA DE LA APP, sólo en celular. Es la ÚNICA barra fija del juego: la de secciones de
          cada pestaña ahora va dentro del contenido (ver BarraDeSecciones), porque dos barras
          pegadas al mismo borde se tapaban entre sí y cuál ganaba dependía del orden del DOM. */}
      <BarraDeApp<SeccionKey>
        secciones={SECCIONES.filter(sec => !(playerProfile.hardcoreEnabled && sec.key === 'entrenamiento'))}
        activa={activeTab}
        onCambiar={setActiveTab}
        abierta={navAbiertoEnMovil}
        onAbrir={setNavAbiertoEnMovil}
      />

      {/* EL PANEL DEL REPORTE DE BUG.
          El texto se muestra ADEMÁS de copiarse: el portapapeles falla sin contexto seguro (http en
          el celular, WebView de Capacitor) y en ese caso el botón no haría nada sin decirlo. Con el
          texto a la vista, siempre se puede seleccionar y copiar a mano. */}

    </div>
  );
}