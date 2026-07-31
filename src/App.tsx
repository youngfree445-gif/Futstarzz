import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, ShopItem, PlayerStats, Position, Club, PenaltyShootoutResult, PlayoffBracket, TwoLegBracket, TwoLegTie, SeasonHistory, Achievement } from './types';
import {
  INITIAL_LIFESTYLE_ITEMS, LOBBY_RANDOM_EVENTS, OPPONENT_CLUBS_POOL, ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE,
  WORLD_CUP_TEAMS_DATABASE, NATIONALITY_TO_WORLD_CUP_TEAM_ID, MAX_ACTIVE_SPONSORSHIPS, ACHIEVEMENTS_DATABASE
} from './data';
import { applyClubTheme } from './clubTheme';
import { preloadSfx } from './audio';
import { realDomesticCupFor } from './realCalendar';
import { classifyMissedMatch, missedMatchNotice, prestigeCostOfMissing, seasonEndPrestigePenalty } from './nationalTeamDuty';
import {
  leagueKeyFor, getOrCreateSeasonForLeague, getUpcomingMatchForLeague, resolvePlayerWeekForLeague, isCupWeek, sortTable,
  getSeasonYear, getLibertadoresParticipants, getSudamericanaParticipants, getOrCreateCupState, getUpcomingCupMatch, resolveCupWeek, isClubStillInCup,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState, getUpcomingUefaCupMatch, resolveUefaCupWeek, isClubStillInUefaCup,
  isWorldCupBreakWeek, getOrCreateWorldCupState, getUpcomingWorldCupMatch, resolveWorldCupWeek, simulateMatch,
  WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD, WORLD_CUP_CALLUP_MIN_MATCHES
} from './leagueEngine';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen, { SUPERSTITIONS_DATABASE } from './components/SetupScreen';
import Dashboard from './components/Dashboard';
import MatchSimulator from './components/MatchSimulator';
import PostMatch from './components/PostMatch';
import DecisionCenter from './components/DecisionCenter';
import InteractivePenaltyShootout from './components/InteractivePenaltyShootout';
import AchievementToast from './components/AchievementToast';
import MusicPlayer from './components/MusicPlayer';
import NoticeToast from './components/NoticeToast';
import CareerSummary from './components/CareerSummary';

// Busca la tanda de penales de TU partido dentro de un bracket/llave de eliminación directa, si
// tu partido de esta semana terminó igualado. Se usa en handleFinishMatch para decidir si hay que
// mostrar la pantalla de PenaltyShootout antes de seguir al resumen post-partido.
function findShootoutInPlayoffBracket(bracket: PlayoffBracket | null | undefined, myId: string, opponentId: string): PenaltyShootoutResult | null {
  if (!bracket) return null;
  for (const round of bracket.matchesByRound) {
    for (const m of round) {
      if (m.penaltyShootout && ((m.homeTeamId === myId && m.awayTeamId === opponentId) || (m.homeTeamId === opponentId && m.awayTeamId === myId))) {
        return m.penaltyShootout;
      }
    }
  }
  return null;
}

function findShootoutInTwoLegBracket(bracket: TwoLegBracket | null | undefined, myId: string, opponentId: string): PenaltyShootoutResult | null {
  if (!bracket) return null;
  for (const round of bracket.tiesByRound) {
    const found = findShootoutInTwoLegTies(round, myId, opponentId);
    if (found) return found;
  }
  return null;
}

function findShootoutInTwoLegTies(ties: TwoLegTie[] | null | undefined, myId: string, opponentId: string): PenaltyShootoutResult | null {
  if (!ties) return null;
  for (const t of ties) {
    if (t.penaltyShootout && ((t.clubAId === myId && t.clubBId === opponentId) || (t.clubAId === opponentId && t.clubBId === myId))) {
      return t.penaltyShootout;
    }
  }
  return null;
}

// Mantiene al día el estado de Libertadores/Sudamericana y Champions/Europa del club actual,
// incluso en semanas donde NO le tocó jugar la copa (ej. semana de liga doméstica). Sin esto,
// playerProfile.continentalCups/uefaCups queda desactualizado toda semana que no sea de copa, y
// cualquier pantalla que necesite mostrarlo (Dashboard) tiene que "ponerse al día" ella misma
// llamando a getOrCreateCupState con azar fresco (simulateMatch) cada vez que renderiza -- eso
// hacía que la tabla de grupos mostrada cambiara sola en cada render, sin persistir nunca un
// resultado real (bug reportado: "se suman puntos de partidos que no se han jugado").
function syncBackgroundCups(
  clubId: string,
  atWeek: number,
  continentalCups: Record<string, any>,
  uefaCups: Record<string, any>,
  skipConmebol: boolean,
  skipUefa: boolean
): { continentalCups: Record<string, any>; uefaCups: Record<string, any> } {
  const myClub = CLUBS_DATABASE.find(c => c.id === clubId);
  let nextContinental = continentalCups;
  let nextUefa = uefaCups;
  if (myClub) {
    const conmebolCupId: 'libertadores' | 'sudamericana' | null = getLibertadoresParticipants(CLUBS_DATABASE).includes(myClub.id)
      ? 'libertadores'
      : getSudamericanaParticipants(CLUBS_DATABASE).includes(myClub.id)
      ? 'sudamericana'
      : null;
    if (conmebolCupId && !skipConmebol) {
      const yr = getSeasonYear(atWeek);
      const cupKey = `${conmebolCupId}-${yr}`;
      nextContinental = { ...nextContinental, [cupKey]: getOrCreateCupState(conmebolCupId, yr, CLUBS_DATABASE, nextContinental[cupKey], atWeek) };
    }

    const uefaCupId: 'champions' | 'europa' | null = getChampionsParticipants(CLUBS_DATABASE).includes(myClub.id)
      ? 'champions'
      : getEuropaParticipants(CLUBS_DATABASE).includes(myClub.id)
      ? 'europa'
      : null;
    if (uefaCupId && !skipUefa) {
      nextUefa = { ...nextUefa, [uefaCupId]: getOrCreateUefaCupState(uefaCupId, CLUBS_DATABASE, nextUefa[uefaCupId], atWeek) };
    }
  }
  return { continentalCups: nextContinental, uefaCups: nextUefa };
}

// Trayectoria club a club por temporada (ver SeasonHistory en types.ts): si el último tramo
// guardado ya es de este mismo año Y este mismo club, se lo suma; si cambiaste de club a mitad de
// temporada (traspaso) o arrancó un año nuevo, abre un tramo nuevo. Los partidos de la selección
// (Mundial) no se cuentan acá -- esta tabla es la carrera de CLUB, no la de la selección.
function recordSeasonHistory(
  history: SeasonHistory[],
  seasonNum: number,
  clubId: string,
  clubName: string,
  matchGoals: number,
  matchAssists: number,
  wonTitle: boolean
): SeasonHistory[] {
  const last = history[history.length - 1];
  if (last && last.seasonNum === seasonNum && last.clubId === clubId) {
    const updatedLast: SeasonHistory = {
      ...last,
      goles: last.goles + matchGoals,
      asistencias: last.asistencias + matchAssists,
      partidos: last.partidos + 1,
      titulo: wonTitle ? '🏆 Campeón' : last.titulo
    };
    return [...history.slice(0, -1), updatedLast];
  }
  return [...history, {
    seasonNum, clubId, clubName,
    goles: matchGoals, asistencias: matchAssists, partidos: 1,
    titulo: wonTitle ? '🏆 Campeón' : ''
  }];
}

// Fase 3 -- Salud mental: en vez de agregar un campo mentalHealth a cada evento/pregunta de prensa
// de data.ts, la movemos un poco en la misma dirección que el efecto neto de prestigio+fans de
// cualquier decisión/evento/partido -- así todo lo que ya existe la afecta automáticamente.
const mentalHealthNudge = (netChange: number) => Math.max(-6, Math.min(6, Math.round(netChange * 0.15)));

// Polémicas y sponsors: si un evento/pregunta de prensa/partido te da un golpe de prestigio grande
// (escándalo real, no una crítica cualquiera), las marcas que cuidan su imagen (sensitiveToControversy)
// tienen una chance de rescindir el contrato -- igual que en la vida real, no todas las marcas te
// perdonan un escándalo (las de imagen arriesgada como apuestas/cripto/energizantes ya asumen ese riesgo).
const CONTROVERSY_PRESTIGE_THRESHOLD = -10;
const SPONSOR_DROP_CHANCE_ON_CONTROVERSY = 0.5;

function checkSponsorControversyFallout(items: ShopItem[], netPrestigeChange: number): { items: ShopItem[]; droppedNames: string[] } {
  if (netPrestigeChange > CONTROVERSY_PRESTIGE_THRESHOLD) return { items, droppedNames: [] };
  const droppedNames: string[] = [];
  const updated = items.map(item => {
    if (item.purchased && item.sensitiveToControversy && Math.random() < SPONSOR_DROP_CHANCE_ON_CONTROVERSY) {
      droppedNames.push(item.name);
      return { ...item, purchased: false };
    }
    return item;
  });
  return { items: updated, droppedNames };
}

// Fase 4 -- Logros: recorre ACHIEVEMENTS_DATABASE contra el perfil YA actualizado y desbloquea
// los que todavía no estaban en unlockedAchievements. Pura respecto al perfil (no muta nada acá
// adentro) -- devuelve el perfil con unlockedAchievements/capital actualizados y la lista de
// logros recién desbloqueados para que el caller dispare la notificación tipo Xbox.
function checkAndUnlockAchievements(profile: PlayerProfile): { profile: PlayerProfile; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  let updatedUnlocked = profile.unlockedAchievements;
  let capitalGain = 0;

  for (const achievement of ACHIEVEMENTS_DATABASE) {
    if (updatedUnlocked[achievement.id] !== undefined) continue;
    if (achievement.check(profile)) {
      newlyUnlocked.push(achievement);
      updatedUnlocked = { ...updatedUnlocked, [achievement.id]: profile.currentWeek };
      capitalGain += achievement.reward;
    }
  }

  if (newlyUnlocked.length === 0) return { profile, newlyUnlocked };
  return {
    profile: { ...profile, unlockedAchievements: updatedUnlocked, capital: profile.capital + capitalGain },
    newlyUnlocked
  };
}

// Fase 3 -- Modo Veterano: a partir de esta edad el declive físico empieza a pesar más que las
// mejoras de entrenamiento; a partir de esta otra, se te acaba la carrera (no hay club que te
// contrate a ese nivel físico).
const VETERAN_DECLINE_START_AGE = 33;
const FORCED_RETIREMENT_AGE = 39;

// Se llama una vez por cada semana que avanza la carrera; si esa semana cruza el límite de un
// "año" (SEASON_LENGTH_WEEKS), el jugador cumple años y, si ya es veterano, sufre un pequeño
// declive físico automático que el entrenamiento normal ya no alcanza a compensar del todo.
function applyAgingIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (getSeasonYear(previousWeek) === getSeasonYear(newWeek)) return profile;

  const newAge = profile.age + 1;
  if (newAge < VETERAN_DECLINE_START_AGE) {
    return { ...profile, age: newAge };
  }
  return {
    ...profile,
    age: newAge,
    attributes: {
      ...profile.attributes,
      ritmo: Math.max(15, profile.attributes.ritmo - 2),
      fisico: Math.max(15, profile.attributes.fisico - 2)
    }
  };
}

// Fase 2.5 -- Adaptación a nuevo DT: reusa el mismo golpe de prestigio "hay que ganarse el lugar de
// nuevo" que ya existe al fichar por un club nuevo (ver handleAcceptTransfer, prestige * 0.9), pero
// triggereado por tu propio club cambiando de entrenador de una temporada a otra en vez de por un
// traspaso -- no lo elegiste vos, así que el golpe es más chico. Se llama junto a applyAgingIfNewSeason
// en cada cruce de temporada, sin importar qué flujo lo dispare (jugar, descansar, sanción, etc).
const COACH_CHANGE_CHANCE_PER_SEASON = 0.25;
const COACH_CHANGE_PRESTIGE_MULTIPLIER = 0.94;

function applyCoachChangeIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (getSeasonYear(previousWeek) === getSeasonYear(newWeek)) return profile;
  if (Math.random() >= COACH_CHANGE_CHANCE_PER_SEASON) return profile;
  return { ...profile, prestige: Math.round(profile.prestige * COACH_CHANGE_PRESTIGE_MULTIPLIER) };
}

// Fase 2.5 -- Síndrome del segundo año: si la temporada que recién cierra tuvo un aporte ofensivo
// de "batacazo" (BREAKOUT_CONTRIBUTION_THRESHOLD goles+asistencias sumando todos los clubes donde
// jugaste ese año), se marca hadBreakoutSeason para vigilar la temporada siguiente. Si esa siguiente
// temporada cierra sin crecimiento real de atributos (no entrenaste lo suficiente para sostener el
// nivel), la prensa y la hinchada lo notan -- golpe chico de prestige/fans, no de attributes.
const attrSum = (attrs: PlayerStats) => attrs.ritmo + attrs.regate + attrs.tiro + attrs.defensa + attrs.pase + attrs.fisico;
const BREAKOUT_CONTRIBUTION_THRESHOLD = 18;
const SOPHOMORE_SLUMP_MIN_GROWTH = 3;
const SOPHOMORE_SLUMP_PRESTIGE_PENALTY = 5;
const SOPHOMORE_SLUMP_FANS_PENALTY = 6;

function applyBreakoutSeasonIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (getSeasonYear(previousWeek) === getSeasonYear(newWeek)) return profile;

  let next = profile;
  if (profile.hadBreakoutSeason) {
    const growth = attrSum(profile.attributes) - profile.attrSumAtSeasonStart;
    if (growth < SOPHOMORE_SLUMP_MIN_GROWTH) {
      next = {
        ...next,
        prestige: Math.max(0, next.prestige - SOPHOMORE_SLUMP_PRESTIGE_PENALTY),
        fans: Math.max(0, next.fans - SOPHOMORE_SLUMP_FANS_PENALTY)
      };
    }
  }

  const endedSeasonYear = getSeasonYear(previousWeek);
  const endedSeasonContribution = profile.seasonHistory
    .filter(s => s.seasonNum === endedSeasonYear)
    .reduce((sum, s) => sum + s.goles + s.asistencias, 0);

  return {
    ...next,
    hadBreakoutSeason: endedSeasonContribution >= BREAKOUT_CONTRIBUTION_THRESHOLD,
    attrSumAtSeasonStart: attrSum(next.attributes)
  };
}

// Fase 2.5 -- Zona de confort: cada temporada seguida en el mismo club (yearsAtClub, se resetea a 0
// en cada traspaso, ver handleAcceptTransfer) suma un año; pasado el umbral, el entrenamiento rinde
// menos (ver COMFORT_ZONE_TRAINING_GAIN en handleTrainAttribute) -- representa la comodidad de estar
// asentado sin la ambición fresca de un jugador que recién llega a probarse en un club nuevo.
const COMFORT_ZONE_YEARS_THRESHOLD = 5;
const NORMAL_TRAINING_GAIN = 3;
const COMFORT_ZONE_TRAINING_GAIN = 1;

function applyYearsAtClubIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (getSeasonYear(previousWeek) === getSeasonYear(newWeek)) return profile;
  return { ...profile, yearsAtClub: profile.yearsAtClub + 1 };
}

// Fase 2.5 -- Mentoría de jóvenes: si elegiste un ahijado del plantel actual (mentorshipPlayerName,
// de currentClub.starPlayers -- ver handleSelectMentee), cada cierre de temporada tira un roll según
// cómo le fue: la mayoría de las veces evoluciona bien y suma prestigio como mentor, a veces se
// estanca (nada), y raramente decepciona (golpe chico). Sigue siendo tu ahijado temporada tras
// temporada hasta que elijas a otro.
const MENTORSHIP_GOOD_CHANCE = 0.55;
const MENTORSHIP_STAGNANT_CHANCE = 0.25; // el resto (0.20) es una mala evolución
const MENTORSHIP_PRESTIGE_GOOD = 2;
const MENTORSHIP_PRESTIGE_BAD = -1;

function applyMentorshipIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (getSeasonYear(previousWeek) === getSeasonYear(newWeek)) return profile;
  if (!profile.mentorshipPlayerName) return profile;

  const roll = Math.random();
  const prestigeChange = roll < MENTORSHIP_GOOD_CHANCE
    ? MENTORSHIP_PRESTIGE_GOOD
    : roll < MENTORSHIP_GOOD_CHANCE + MENTORSHIP_STAGNANT_CHANCE
    ? 0
    : MENTORSHIP_PRESTIGE_BAD;

  return { ...profile, prestige: Math.max(0, Math.min(100, profile.prestige + prestigeChange)) };
}

// Agrupa todos los efectos que se disparan al cruzar de una temporada a otra (edad/declive físico,
// cambio de DT, síndrome del segundo año, años en el club, mentoría) en un solo lugar -- se llama
// igual sin importar qué flujo hizo avanzar currentWeek (jugar, descansar, fecha FIFA sin
// convocatoria, sanción).
// Irse con la selección una vez es normal y el club lo asume; hacerlo repetidamente en partidos
// grandes es lo que termina de romper la relación. El golpe puntual ya se aplicó partido a partido
// (ver pendingCountryDutyCost); esto es el saldo acumulado que se cobra al cerrar la temporada.
function applyCountryDutyToll(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (getSeasonYear(newWeek) === getSeasonYear(previousWeek)) return profile;
  const penalty = seasonEndPrestigePenalty(profile.missedClubMatchesForCountry);
  return {
    ...profile,
    prestige: Math.max(0, Math.min(100, profile.prestige + penalty)),
    // El contador se reinicia cada temporada: lo que se juzga es el año, no la carrera entera.
    missedClubMatchesForCountry: 0,
  };
}

function applySeasonTransitions(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  let next = applyAgingIfNewSeason(profile, previousWeek, newWeek);
  next = applyCoachChangeIfNewSeason(next, previousWeek, newWeek);
  next = applyBreakoutSeasonIfNewSeason(next, previousWeek, newWeek);
  next = applyYearsAtClubIfNewSeason(next, previousWeek, newWeek);
  next = applyMentorshipIfNewSeason(next, previousWeek, newWeek);
  next = applyCountryDutyToll(next, previousWeek, newWeek);
  return next;
}

// Fase 2.5 -- Retiro escalonado: al llegar a la edad de retiro forzado se ofrece UNA sola chance de
// bajar de categoría (a un club de menor reputación en la misma liga) en vez de retirarte de una, ver
// findStepDownClub más abajo y el manejo de isPastRetirementAge en cada uno de los 4 puntos donde se
// chequea. Una vez usada esa chance (hasSteppedDownRetirement), el límite de edad final sube
// STEP_DOWN_AGE_EXTENSION años y no se vuelve a ofrecer -- ahí sí es retiro forzado de verdad.
const STEP_DOWN_AGE_EXTENSION = 3;
const STEP_DOWN_MARKET_VALUE_MULTIPLIER = 0.4;
const STEP_DOWN_PRESTIGE_MULTIPLIER = 0.85;

function isPastRetirementAge(profile: PlayerProfile): boolean {
  const effectiveLimit = FORCED_RETIREMENT_AGE + (profile.hasSteppedDownRetirement ? STEP_DOWN_AGE_EXTENSION : 0);
  return profile.age >= effectiveLimit;
}

function findStepDownClub(profile: PlayerProfile): Club | null {
  const myClub = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  if (!myClub) return null;
  const leagueKey = leagueKeyFor(myClub);
  const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey && c.id !== myClub.id);
  const lowerTier = leagueClubs.filter(c => c.reputation < myClub.reputation).sort((a, b) => b.reputation - a.reputation);
  if (lowerTier.length > 0) return lowerTier[0];
  return [...leagueClubs].sort((a, b) => a.reputation - b.reputation)[0] || null;
}

// Reconversión de posición (Fase 3): mueve un poco los atributos hacia el perfil típico de la
// posición nueva, representando el reentrenamiento -- no resetea al jugador, solo lo empuja.
const POSITION_RECONVERSION_BIAS: Record<Position, Partial<Record<keyof PlayerStats, number>>> = {
  Delantero: { tiro: 8, regate: 4, defensa: -6 },
  Mediocampista: { pase: 8, regate: 3, tiro: -4, defensa: 3 },
  Defensor: { defensa: 8, fisico: 4, tiro: -6, regate: -3 },
  Arquero: { defensa: 10, pase: -3, tiro: -10, regate: -6 }
};

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'setup' | 'dashboard' | 'match' | 'post_match' | 'event' | 'penalty_shootout' | 'career_summary'>('welcome');

  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>(INITIAL_LIFESTYLE_ITEMS);
  
  const [activeOpposition, setActiveOpposition] = useState('');
  const [activeOppositionClubId, setActiveOppositionClubId] = useState<string | null>(null);
  const [activeIsHome, setActiveIsHome] = useState(true);
  const [isCopaLibertadores, setIsCopaLibertadores] = useState(false);
  const [activeCupId, setActiveCupId] = useState<'libertadores' | 'sudamericana' | null>(null);
  const [activeUefaCupId, setActiveUefaCupId] = useState<'champions' | 'europa' | null>(null);
  // Semana de copa en la que el club no juega ninguna copa continental: se rotula como copa
  // nacional (Copa del Rey, FA Cup, etc.) en vez de caer al cartel de Libertadores.
  const [activeDomesticCup, setActiveDomesticCup] = useState(false);
  // Costo de irse con la selección, calculado al salir de la semana pero aplicado recién cuando
  // termina el partido: si se aplicara antes, el jugador vería bajar su prestigio sin saber por qué.
  const pendingCountryDutyCost = useRef<{ prestige: number; notice: string | null; important: boolean } | null>(null);
  const [activeWorldCupTeamId, setActiveWorldCupTeamId] = useState<string | null>(null);
  // Posiciones en la tabla al momento de armar el partido (solo liga doméstica -- en copas/Mundial
  // no hay una tabla comparable entre rivales de países distintos). Alimentan tanto el badge de
  // posiciones en MatchSimulator como el multiplicador de dificultad de las decisiones.
  const [activeMyTablePosition, setActiveMyTablePosition] = useState<number | null>(null);
  const [activeRivalTablePosition, setActiveRivalTablePosition] = useState<number | null>(null);
  const [activeLeagueTeamCount, setActiveLeagueTeamCount] = useState<number | null>(null);
  const [matchResults, setMatchResults] = useState<any>(null);
  const [activePenaltyShootout, setActivePenaltyShootout] = useState<{ result: PenaltyShootoutResult; myId: string; myName: string } | null>(null);
  // Si tu partido de esta semana puede terminar definiéndose en una tanda de penales, se guarda acá
  // el resultado crudo del partido (goles) mientras jugás la tanda en vivo (InteractivePenaltyShootout) --
  // handleFinishMatch se vuelve a invocar con el resultado real de la tanda una vez que termina.
  const [pendingMatchResults, setPendingMatchResults] = useState<any>(null);
  // Fase 4 -- Logros: cola de notificaciones tipo Xbox pendientes de mostrar (AchievementToast en
  // App.tsx render). Se apilan si se desbloquea más de uno a la vez y se muestran de a una.
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  // Cola de avisos tipo toast (reemplazo no bloqueante de alert() nativo) -- ver notify() más abajo
  // y NoticeToast en App.tsx render. Se apilan si se dispara más de uno a la vez y se muestran de a uno.
  const [noticeQueue, setNoticeQueue] = useState<string[]>([]);
  const notify = (message: string) => setNoticeQueue(prev => [...prev, message]);

  // Theming dinámico por club: repinta el dorado/borgoña de toda la app con el color real de
  // camiseta del club actual (ver Club.themeColor en data.ts y clubTheme.ts) cada vez que cambia
  // de club -- ficha nueva, traspaso, etc. Si el club no tiene color curado, vuelve al dorado por
  // defecto (applyClubTheme ya maneja ese fallback internamente).
  useEffect(() => {
    const currentClub = playerProfile ? CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId) : undefined;
    applyClubTheme(currentClub);
  }, [playerProfile?.currentClubId]);

  // Los sfx se descargan al arrancar y no en el primer disparo: si se pidieran recién cuando entra
  // el gol, el sonido llegaría tarde (o directamente después del festejo) en conexiones lentas.
  useEffect(() => {
    preloadSfx();
  }, []);

  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  // Fase de banco/convocatoria: si sos titular, MatchSimulator arranca normal (undefined). Si sos
  // suplente, arranca desde el banco y entra recién en un minuto random del 2do tiempo -- ver
  // decideLineupStatus más abajo.
  const [activeLineupStatus, setActiveLineupStatus] = useState<'starter' | 'substitute'>('starter');
  const [activeSubEntryMinute, setActiveSubEntryMinute] = useState<number | null>(null);

  const saveGameState = (profile: PlayerProfile, items: ShopItem[], forcedSlotId?: string) => {
    const slot = forcedSlotId || activeSlotId;
    if (!slot) return;
    localStorage.setItem(`futbol_star_save_${slot}`, JSON.stringify(profile));
    localStorage.setItem(`futbol_star_shop_${slot}`, JSON.stringify(items));
  };

  const handleStartNew = (slotId: string) => {
    setActiveSlotId(slotId);
    setScreen('setup');
  };

  const handleLoadGame = (savedState: PlayerProfile, slotId: string) => {
    setActiveSlotId(slotId);

    // Compatibilidad con saves viejos que no tenían el motor de liga: si falta,
    // lo generamos ahora mismo para el club actual, puesto al día a la semana en curso.
    let profile = savedState;
    if (!profile.leagueSeasons) {
      const myClub = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
      if (myClub) {
        const leagueKey = leagueKeyFor(myClub);
        const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey);
        const season = getOrCreateSeasonForLeague(leagueClubs, undefined, profile.currentWeek);
        profile = { ...profile, leagueSeasons: { [leagueKey]: season } };
      } else {
        profile = { ...profile, leagueSeasons: {} };
      }
    }
    if (!profile.continentalCups) {
      profile = { ...profile, continentalCups: {} };
    }
    if (!profile.uefaCups) {
      profile = { ...profile, uefaCups: {} };
    }
    if (!profile.worldCups) {
      profile = { ...profile, worldCups: {} };
    }
    if (profile.mentalHealth === undefined) {
      profile = { ...profile, mentalHealth: 70 };
    }
    // Compatibilidad con saves de antes del Bloque 4 (dorsal/altura en la creación de personaje):
    // les asignamos un valor razonable la primera vez que cargan, para no dejar campos undefined
    // rotando por el resto de las pantallas (Dashboard/roster ya asumen que pueden existir).
    if (profile.dorsal === undefined) {
      profile = { ...profile, dorsal: 1 + Math.floor(Math.random() * 33) };
    }
    if (profile.heightCm === undefined) {
      const defaultHeight = profile.position === 'Arquero' ? 190 : profile.position === 'Defensor' ? 185 : profile.position === 'Delantero' ? 180 : 178;
      profile = { ...profile, heightCm: defaultHeight };
    }
    if (profile.lastMatchRating === undefined) {
      profile = { ...profile, lastMatchRating: 0 };
    }
    // Compatibilidad con saves de antes del sistema de logros (Fase 4).
    if (profile.lastMatchGoals === undefined) {
      profile = { ...profile, lastMatchGoals: 0 };
    }
    if (profile.lastMatchWonShootout === undefined) {
      profile = { ...profile, lastMatchWonShootout: false };
    }
    if (profile.unlockedAchievements === undefined) {
      profile = { ...profile, unlockedAchievements: {} };
    }
    if (profile.sponsorsSignedCount === undefined) {
      profile = { ...profile, sponsorsSignedCount: 0 };
    }
    if (profile.yellowCards === undefined) {
      profile = { ...profile, yellowCards: 0 };
    }
    if (profile.suspendedMatches === undefined) {
      profile = { ...profile, suspendedMatches: 0 };
    }
    if (profile.seasonHistory === undefined) {
      profile = { ...profile, seasonHistory: [] };
    }
    if (profile.lastPressAnsweredWeek === undefined) {
      profile = { ...profile, lastPressAnsweredWeek: 0 };
    }
    if (profile.superstition === undefined) {
      profile = { ...profile, superstition: SUPERSTITIONS_DATABASE[0].id };
    }
    if (profile.matchesWithoutRest === undefined) {
      profile = { ...profile, matchesWithoutRest: 0 };
    }
    if (profile.hadBreakoutSeason === undefined) {
      profile = { ...profile, hadBreakoutSeason: false, attrSumAtSeasonStart: attrSum(profile.attributes) };
    }
    if (profile.yearsAtClub === undefined) {
      profile = { ...profile, yearsAtClub: 0 };
    }
    if (profile.appearanceBonus === undefined) {
      const myClub = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
      profile = { ...profile, appearanceBonus: myClub ? Math.round(myClub.initialSalary * 0.15) : 0 };
    }
    if (profile.mentorshipPlayerName === undefined) {
      profile = { ...profile, mentorshipPlayerName: null };
    }
    if (profile.missedClubMatchesForCountry === undefined) {
      profile = { ...profile, missedClubMatchesForCountry: 0 };
    }
    if (profile.hasSteppedDownRetirement === undefined) {
      profile = { ...profile, hasSteppedDownRetirement: false };
    }
    if (profile.girlfriend === undefined) {
      profile = { ...profile, girlfriend: null };
    }
    if (profile.careerStats.sumaCalificacionesHistoricas === undefined) {
      profile = {
        ...profile,
        careerStats: {
          ...profile.careerStats,
          sumaCalificacionesHistoricas: 0,
          tarjetasAmarillasHistoricas: 0,
          tarjetasRojasHistoricas: 0
        }
      };
    }
    setPlayerProfile(profile);

    const savedShop = localStorage.getItem(`futbol_star_shop_${slotId}`);
    if (savedShop) {
      try {
        setShopItems(JSON.parse(savedShop));
      } catch (e) {
        console.error('Error al cargar la tienda', e);
        setShopItems(INITIAL_LIFESTYLE_ITEMS.map(item => ({ ...item, purchased: false })));
      }
    } else {
      setShopItems(INITIAL_LIFESTYLE_ITEMS.map(item => ({ ...item, purchased: false })));
    }
    setScreen('dashboard');
  };

  const handleFinishSetup = (newProfile: PlayerProfile) => {
    const defaultShop = INITIAL_LIFESTYLE_ITEMS.map(item => ({ ...item, purchased: false }));

    const myClub = CLUBS_DATABASE.find(c => c.id === newProfile.currentClubId)!;
    const leagueKey = leagueKeyFor(myClub);
    const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey);
    const season = getOrCreateSeasonForLeague(leagueClubs, undefined, newProfile.currentWeek);
    // Igual que la liga: generamos y persistimos Libertadores/Sudamericana/Champions/Europa desde
    // el arranque mismo de la carrera (si tu club clasifica a alguna), para que el sorteo de
    // grupos quede fijo desde el primer momento y nunca haya una ventana sin guardar donde
    // Dashboard tenga que inventar un sorteo nuevo con azar fresco solo para mostrarlo.
    const initialCups = syncBackgroundCups(newProfile.currentClubId, newProfile.currentWeek, {}, {}, false, false);
    const profileWithLeague: PlayerProfile = {
      ...newProfile,
      leagueSeasons: { [leagueKey]: season },
      continentalCups: initialCups.continentalCups,
      uefaCups: initialCups.uefaCups
    };

    setPlayerProfile(profileWithLeague);
    setShopItems(defaultShop);
    if (activeSlotId) {
      saveGameState(profileWithLeague, defaultShop, activeSlotId);
    }
    setScreen('dashboard');
  };

  // Fase 4 -- Entrenamiento ya no es gratis en plata: instalaciones/preparadores de clubes top
  // cobran más caro que las de un club chico. reputation va de 1 (chico) a 5 (élite mundial).
  const TRAINING_ENERGY_COST = 20;
  const TRAINING_BASE_COST = 200;
  const TRAINING_COST_PER_REPUTATION = 150;
  const handleTrainAttribute = (attr: keyof PlayerStats) => {
    if (!playerProfile) return;
    if (playerProfile.energy < TRAINING_ENERGY_COST) {
      notify('¡No tienes suficiente energía para entrenar!');
      return;
    }

    const currentClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    const trainingCost = TRAINING_BASE_COST + (currentClub?.reputation || 1) * TRAINING_COST_PER_REPUTATION;
    if (playerProfile.capital < trainingCost) {
      notify(`No tienes los $${trainingCost.toLocaleString()} que cuesta esta sesión de entrenamiento en ${currentClub?.name || 'tu club'}.`);
      return;
    }

    const trainingGain = playerProfile.yearsAtClub >= COMFORT_ZONE_YEARS_THRESHOLD ? COMFORT_ZONE_TRAINING_GAIN : NORMAL_TRAINING_GAIN;

    const updatedProfile = {
      ...playerProfile,
      energy: playerProfile.energy - TRAINING_ENERGY_COST,
      capital: playerProfile.capital - trainingCost,
      attributes: {
        ...playerProfile.attributes,
        [attr]: Math.min(99, playerProfile.attributes[attr] + trainingGain)
      }
    };

    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
  };

  // Fase 2.5 -- Mentoría de jóvenes: elegís (o dejás de elegir, pasando null) un ahijado del
  // plantel actual. El roll de cómo evoluciona corre solo al cierre de cada temporada, ver
  // applyMentorshipIfNewSeason.
  const handleSelectMentee = (playerName: string | null) => {
    if (!playerProfile) return;
    const updatedProfile = { ...playerProfile, mentorshipPlayerName: playerName };
    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(updatedProfile);
    if (newlyUnlocked.length > 0) setAchievementQueue(prev => [...prev, ...newlyUnlocked]);
    setPlayerProfile(withAchievements);
    saveGameState(withAchievements, shopItems);
  };

  // Fase 2.5 -- Vida amorosa: relación de pareja opcional con su propia barra (loveMeter) y sus
  // propias acciones. Todo vive acá como handlers puntuales en vez de meterlo en el sistema
  // genérico de LOBBY_RANDOM_EVENTS/DecisionCenter porque ese sistema solo soporta el shape fijo
  // { prestige, fans, energy, capital, suspension } y acá necesitamos tocar un campo propio
  // (girlfriend.loveMeter) que no existe en ese contrato.
  const GIRLFRIEND_CANDIDATES = ['Valentina Ríos', 'Camila Duarte', 'Sofía Lombardi', 'Isabella Cruz', 'Mariana Solís', 'Antonella Ferrari'];
  const GIRLFRIEND_FLOWERS_COST = 300;
  const GIRLFRIEND_CHEAT_CAUGHT_CHANCE = 0.35;
  const GIRLFRIEND_CHEAT_CAUGHT_FINE = 5000;
  const GIRLFRIEND_DENY_RUMORS_SUCCESS_CHANCE = 0.6;

  const handleFindGirlfriend = () => {
    if (!playerProfile || playerProfile.girlfriend) return;
    const name = GIRLFRIEND_CANDIDATES[Math.floor(Math.random() * GIRLFRIEND_CANDIDATES.length)];
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      girlfriend: { name, loveMeter: 50, livingTogether: false }
    };
    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(updatedProfile);
    if (newlyUnlocked.length > 0) setAchievementQueue(prev => [...prev, ...newlyUnlocked]);
    setPlayerProfile(withAchievements);
    saveGameState(withAchievements, shopItems);
    notify(`💘 Empezaste a salir con ${name}. Cuidado con las redes.`);
  };

  const handleGirlfriendFlowers = () => {
    if (!playerProfile?.girlfriend) return;
    if (playerProfile.capital < GIRLFRIEND_FLOWERS_COST) {
      notify('No tienes fondos suficientes para las flores.');
      return;
    }
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: playerProfile.capital - GIRLFRIEND_FLOWERS_COST,
      fans: Math.min(100, playerProfile.fans + 1),
      girlfriend: { ...playerProfile.girlfriend, loveMeter: Math.min(100, playerProfile.girlfriend.loveMeter + 6) }
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
  };

  const handleGirlfriendPhoto = () => {
    if (!playerProfile?.girlfriend) return;
    const gfName = playerProfile.girlfriend.name;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      fans: Math.min(100, playerProfile.fans + 6),
      girlfriend: { ...playerProfile.girlfriend, loveMeter: Math.min(100, playerProfile.girlfriend.loveMeter + 4) }
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(`📸 Publicaste una foto con ${gfName}. Los hinchas se derriten en los comentarios.`);
  };

  const handleGirlfriendFaithful = () => {
    if (!playerProfile?.girlfriend) return;
    const gfName = playerProfile.girlfriend.name;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      mentalHealth: Math.min(100, playerProfile.mentalHealth + 3),
      girlfriend: { ...playerProfile.girlfriend, loveMeter: Math.min(100, playerProfile.girlfriend.loveMeter + 5) }
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(`🙏 Le reafirmaste tu compromiso a ${gfName}.`);
  };

  const handleGirlfriendCheat = () => {
    if (!playerProfile?.girlfriend) return;
    const gfName = playerProfile.girlfriend.name;
    const caught = Math.random() < GIRLFRIEND_CHEAT_CAUGHT_CHANCE;
    if (caught) {
      const hadSportsCar = shopItems.some(i => i.id === 'sports_car' && i.purchased);
      const updatedShop = hadSportsCar ? shopItems.map(i => i.id === 'sports_car' ? { ...i, purchased: false } : i) : shopItems;
      const updatedProfile: PlayerProfile = {
        ...playerProfile,
        girlfriend: null,
        fans: Math.max(0, playerProfile.fans - 15),
        prestige: Math.max(0, playerProfile.prestige - 10),
        mentalHealth: Math.max(0, playerProfile.mentalHealth - 15),
        capital: Math.max(0, playerProfile.capital - GIRLFRIEND_CHEAT_CAUGHT_FINE)
      };
      setPlayerProfile(updatedProfile);
      setShopItems(updatedShop);
      saveGameState(updatedProfile, updatedShop);
      notify(`💥 ¡${gfName} te descubrió engañándola! ${hadSportsCar ? 'Te estrelló el auto deportivo contra el portón de tu casa y ' : ''}la ruptura se hizo pública. -$${GIRLFRIEND_CHEAT_CAUGHT_FINE.toLocaleString()}, tu imagen quedó destrozada.`);
    } else {
      const updatedProfile: PlayerProfile = {
        ...playerProfile,
        mentalHealth: Math.max(0, playerProfile.mentalHealth - 3)
      };
      setPlayerProfile(updatedProfile);
      saveGameState(updatedProfile, shopItems);
      notify('😬 Nadie se enteró... por ahora. Te queda la culpa.');
    }
  };

  const handleGirlfriendDenyRumors = () => {
    if (!playerProfile?.girlfriend) return;
    const success = Math.random() < GIRLFRIEND_DENY_RUMORS_SUCCESS_CHANCE;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      fans: Math.max(0, Math.min(100, playerProfile.fans + (success ? 5 : -3))),
      girlfriend: { ...playerProfile.girlfriend, loveMeter: Math.max(0, Math.min(100, playerProfile.girlfriend.loveMeter + (success ? 4 : -5))) }
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(success
      ? '📰 Desmentiste con calma los rumores con una modelo y te creyeron.'
      : '📰 Nadie te creyó del todo. Los rumores con la modelo siguen circulando.');
  };

  const handleGirlfriendMoveIn = (accept: boolean) => {
    if (!playerProfile?.girlfriend) return;
    const gfName = playerProfile.girlfriend.name;
    const updatedProfile: PlayerProfile = accept
      ? {
          ...playerProfile,
          mentalHealth: Math.min(100, playerProfile.mentalHealth + 5),
          girlfriend: { ...playerProfile.girlfriend, livingTogether: true, loveMeter: Math.min(100, playerProfile.girlfriend.loveMeter + 10) }
        }
      : {
          ...playerProfile,
          girlfriend: { ...playerProfile.girlfriend, loveMeter: Math.max(0, playerProfile.girlfriend.loveMeter - 20) }
        };
    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(updatedProfile);
    if (newlyUnlocked.length > 0) setAchievementQueue(prev => [...prev, ...newlyUnlocked]);
    setPlayerProfile(withAchievements);
    saveGameState(withAchievements, shopItems);
    notify(accept ? `🏠 Te mudaste con ${gfName}. Un paso grande en la relación.` : `💔 Le dijiste que no estás listo para mudarte. ${gfName} se lo tomó mal.`);
  };

  // Fase 3 -- Modo Veterano: reconversión de posición. Solo tiene sentido ofrecerla desde el
  // Dashboard a partir de cierta edad (ver VETERAN_DECLINE_START_AGE), pero el handler en sí no
  // depende de la edad -- si en el futuro se habilita antes, funciona igual.
  const handleReconvertPosition = (newPosition: Position) => {
    if (!playerProfile) return;
    if (newPosition === playerProfile.position) return;

    const bias = POSITION_RECONVERSION_BIAS[newPosition];
    const updatedAttributes = { ...playerProfile.attributes };
    (Object.keys(bias) as (keyof PlayerStats)[]).forEach(key => {
      updatedAttributes[key] = Math.max(10, Math.min(99, updatedAttributes[key] + (bias[key] || 0)));
    });

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      position: newPosition,
      attributes: updatedAttributes
    };

    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(`Te reconvertiste a ${newPosition}. El cuerpo técnico ajustó tu plan de entrenamiento a la nueva posición.`);
  };

  // Solo lujos puros (sin category, ver ShopItem en types.ts) pasan por acá -- los patrocinios
  // viven en handleAcceptSponsor, con su propia lógica de "oferta que te llega" en vez de compra.
  const handleBuyItem = (itemId: string) => {
    if (!playerProfile) return;
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (playerProfile.capital < item.cost) {
      notify('No cuentas con el capital suficiente para adquirir este lujo.');
      return;
    }

    let updatedAttributes = { ...playerProfile.attributes };
    if (item.effect.attribute && item.effect.value) {
      const k = item.effect.attribute;
      updatedAttributes[k] = Math.min(99, updatedAttributes[k] + item.effect.value);
    }

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: playerProfile.capital - item.cost,
      prestige: Math.min(100, playerProfile.prestige + (item.effect.prestigeBonus || 0)),
      fans: Math.min(100, playerProfile.fans + (item.effect.fansBonus || 0)),
      attributes: updatedAttributes
    };

    const updatedShop = shopItems.map(i => i.id === itemId ? { ...i, purchased: true } : i);

    setPlayerProfile(updatedProfile);
    setShopItems(updatedShop);
    saveGameState(updatedProfile, updatedShop);
  };

  // Aceptar una oferta de patrocinio: a diferencia de un lujo, la marca te paga a vos (item.cost
  // funciona como prima de firma), no al revés. Mismas reglas de exclusividad que antes: un solo
  // contrato activo por categoría/rubro, y un tope global de patrocinios simultáneos.
  const handleAcceptSponsor = (itemId: string) => {
    if (!playerProfile) return;
    const item = shopItems.find(i => i.id === itemId);
    if (!item || !item.category) return;

    const conflicting = shopItems.find(i => i.purchased && i.category === item.category && i.id !== item.id);
    if (conflicting) {
      notify(`Ya tienes un patrocinio activo de la categoría "${item.category}" (${conflicting.name}). Espera a que termine ese contrato antes de firmar otro del mismo rubro.`);
      return;
    }

    const activeSponsorships = shopItems.filter(i => i.purchased && i.category).length;
    if (activeSponsorships >= MAX_ACTIVE_SPONSORSHIPS) {
      notify(`Ya tienes el máximo de ${MAX_ACTIVE_SPONSORSHIPS} patrocinios activos al mismo tiempo. Tu agenda comercial está completa.`);
      return;
    }

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: playerProfile.capital + item.cost,
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + (item.effect.prestigeBonus || 0))),
      fans: Math.max(0, Math.min(100, playerProfile.fans + (item.effect.fansBonus || 0))),
      sponsorsSignedCount: playerProfile.sponsorsSignedCount + 1
    };

    const updatedShop = shopItems.map(i => i.id === itemId ? { ...i, purchased: true } : i);

    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(updatedProfile);
    if (newlyUnlocked.length > 0) setAchievementQueue(prev => [...prev, ...newlyUnlocked]);

    setPlayerProfile(withAchievements);
    setShopItems(updatedShop);
    saveGameState(withAchievements, updatedShop);
  };

  // Romper un contrato de patrocinio a voluntad para liberar un cupo (ver MAX_ACTIVE_SPONSORSHIPS):
  // tiene un pequeño costo de imagen, como en la vida real salir de un contrato antes de tiempo.
  const CANCEL_SPONSOR_PRESTIGE_PENALTY = 3;
  const handleCancelSponsor = (itemId: string) => {
    if (!playerProfile) return;
    const item = shopItems.find(i => i.id === itemId);
    if (!item || !item.purchased || !item.category) return;

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      prestige: Math.max(0, playerProfile.prestige - CANCEL_SPONSOR_PRESTIGE_PENALTY)
    };
    const updatedShop = shopItems.map(i => i.id === itemId ? { ...i, purchased: false } : i);

    setPlayerProfile(updatedProfile);
    setShopItems(updatedShop);
    saveGameState(updatedProfile, updatedShop);
  };

  const handleLaunchPRCampaign = (cost: number, fansBonus: number, prestigeBonus: number) => {
    if (!playerProfile) return;
    
    if (cost > 0 && playerProfile.capital < cost) {
      notify('No tienes los fondos necesarios.');
      return;
    }

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: playerProfile.capital - cost,
      fans: Math.max(0, Math.min(100, playerProfile.fans + fansBonus)),
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + prestigeBonus))
    };

    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(cost < 0 ? '¡Contrato firmado con éxito!' : 'Campaña ejecutada con éxito.');
  };

  const handleAnswerPress = (prestigeChange: number, fansChange: number, energyChange: number) => {
    if (!playerProfile) return;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + prestigeChange)),
      fans: Math.max(0, Math.min(100, playerProfile.fans + fansChange)),
      energy: Math.max(0, Math.min(100, playerProfile.energy + energyChange)),
      mentalHealth: Math.max(0, Math.min(100, playerProfile.mentalHealth + mentalHealthNudge(prestigeChange + fansChange))),
      lastPressAnsweredWeek: playerProfile.currentWeek
    };

    const { items: updatedShop, droppedNames } = checkSponsorControversyFallout(shopItems, prestigeChange);

    setPlayerProfile(updatedProfile);
    setShopItems(updatedShop);
    saveGameState(updatedProfile, updatedShop);

    if (droppedNames.length > 0) {
      const verb = droppedNames.length > 1 ? 'rescindieron sus contratos' : 'rescindió su contrato';
      notify(`📉 Tu declaración generó ruido de sobra. ${droppedNames.join(', ')} ${verb} contigo por la polémica.`);
    }
  };

  // ChutSocial: dar like o comentar te desconecta un rato del entrenamiento -- +1 de energía por
  // interacción, tope 100. Sin saveGameState acá a propósito: es un cambio mínimo y muy frecuente
  // (podés likear muchos posts seguidos), guardarlo en localStorage cada vez sería ruido innecesario
  // -- se persiste solo con el próximo guardado real (avanzar semana, entrenar, etc.).
  const SOCIAL_INTERACTION_ENERGY_GAIN = 1;
  const handleSocialInteraction = () => {
    if (!playerProfile) return;
    setPlayerProfile({
      ...playerProfile,
      energy: Math.min(100, playerProfile.energy + SOCIAL_INTERACTION_ENERGY_GAIN)
    });
  };

  const handleAcceptTransfer = (clubId: string, signOnBonus: number) => {
    if (!playerProfile) return;
    const targetClub = CLUBS_DATABASE.find(c => c.id === clubId)!;

    // Si es una liga que todavía no visitaste, se genera y se pone al día
    // (queda "corriendo de fondo" como si nunca la hubieras dejado de mirar).
    const leagueKey = leagueKeyFor(targetClub);
    const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey);
    const season = getOrCreateSeasonForLeague(leagueClubs, playerProfile.leagueSeasons[leagueKey], playerProfile.currentWeek);

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      currentClubId: clubId,
      capital: playerProfile.capital + signOnBonus,
      prestige: Math.round(playerProfile.prestige * 0.9),
      yearsAtClub: 0,
      appearanceBonus: Math.round(targetClub.initialSalary * 0.15),
      leagueSeasons: { ...playerProfile.leagueSeasons, [leagueKey]: season }
    };

    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(updatedProfile);
    if (newlyUnlocked.length > 0) setAchievementQueue(prev => [...prev, ...newlyUnlocked]);

    setPlayerProfile(withAchievements);
    saveGameState(withAchievements, shopItems);
    notify(`🎉 ¡TRASPASO CONFIRMADO! Todo listo para presentarte en: ${targetClub.name}.`);
  };

  const handleAdvanceWeek = () => {
    if (!playerProfile) return;

    if (playerProfile.energy < 20) {
      if (!confirm('Tu nivel de fatiga física es alarmante (Energía < 20). ¿Deseas arriesgarte a saltar al campo?')) {
        const inWorldCupBreak = isWorldCupBreakWeek(playerProfile.currentWeek);
        const isCup = !inWorldCupBreak && isCupWeek(playerProfile.currentWeek);

        // Si esta semana te tocaba partido de LIGA DOMÉSTICA, ese partido no se cancela porque
        // vos descanses -- tu club lo juega igual, simulado sin vos (mismo criterio que una
        // sanción, ver resolveSuspendedLeagueWeek). Antes esto quedaba en manos del catch-up lazy
        // de leagueSeasons (sin persistir acá), así que el resultado de ESA fecha puntual nunca se
        // le mostraba al jugador -- se sentía como si el partido hubiera quedado "colgado" (bug
        // reportado: "a veces descansaba... y el partido se quedaba ahí").
        let updatedLeagueSeasons = playerProfile.leagueSeasons;
        let restResultMsg = '';
        if (!inWorldCupBreak && !isCup) {
          const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
          const leagueKey = leagueKeyFor(myClub);
          const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey);
          const season = playerProfile.leagueSeasons[leagueKey] ?? getOrCreateSeasonForLeague(leagueClubs, undefined, playerProfile.currentWeek);
          const upcoming = getUpcomingMatchForLeague(season, leagueClubs, playerProfile.currentWeek, myClub.id);
          if (upcoming) {
            const opponentClub = leagueClubs.find(c => c.id === upcoming.opponentId)!;
            const { homeGoals, awayGoals } = upcoming.isHome ? simulateMatch(myClub, opponentClub) : simulateMatch(opponentClub, myClub);
            const myGoals = upcoming.isHome ? homeGoals : awayGoals;
            const rivalGoals = upcoming.isHome ? awayGoals : homeGoals;
            const resolvedSeason = resolvePlayerWeekForLeague(season, leagueClubs, playerProfile.currentWeek, myClub.id, upcoming.isHome, myGoals, rivalGoals);
            updatedLeagueSeasons = { ...playerProfile.leagueSeasons, [leagueKey]: resolvedSeason };
            restResultMsg = ` Sin ti en el campo, ${myClub.name} ${myGoals}-${rivalGoals} ${opponentClub.name}.`;
          }
        }

        const restSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false);
        const updated = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 45),
          mentalHealth: Math.min(100, playerProfile.mentalHealth + 6), // descansar en vez de forzar la máquina te despeja la cabeza
          currentWeek: playerProfile.currentWeek + 1,
          matchesWithoutRest: 0,
          leagueSeasons: updatedLeagueSeasons,
          continentalCups: restSync.continentalCups,
          uefaCups: restSync.uefaCups
        };
        const agedRest = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);
        if (isPastRetirementAge(agedRest)) {
          resolveRetirementCheckpoint(agedRest);
          return;
        }
        setPlayerProfile(agedRest);
        saveGameState(agedRest, shopItems);
        notify(`Decidiste descansar este fin de semana. Recuperas +45 de Energía.${restResultMsg}`);
        return;
      }
    }

    const triggerEvent = Math.random() < 0.35;
    if (triggerEvent) {
      const idx = Math.floor(Math.random() * LOBBY_RANDOM_EVENTS.length);
      setActiveEvent(LOBBY_RANDOM_EVENTS[idx]);
      setScreen('event');
      return;
    }

    startMatchflow();
  };

  // Convocatoria semanal: en clubes grandes (reputation alta), un jugador con poco prestige/relación
  // con el DT tiene chance real de arrancar en el banco o directamente quedar afuera de la lista,
  // igual que en la vida real (las jóvenes promesas de clubes top rotan menos que en clubes chicos).
  // reputation va de 1 (chico) a 5 (élite mundial); prestige va de 0 a 100.
  function decideLineupStatus(reputation: number, prestige: number): 'starter' | 'substitute' | 'not_called' {
    // Umbral de prestige que un club de esa reputation exige para considerarte titular indiscutido.
    const starterThreshold = 25 + reputation * 11; // ~36 (reputation 1) a ~80 (reputation 5)
    const notCalledThreshold = Math.max(0, reputation * 7 - 15); // 0 (reputation <=2) a 20 (reputation 5)

    if (prestige >= starterThreshold) return 'starter';
    if (prestige <= notCalledThreshold) {
      // No convocado es poco frecuente incluso cuando calificás: solo ~40% de las veces que tu
      // prestige es muy bajo para el calibre del club, para que no se sienta punitivo todas las semanas.
      return Math.random() < 0.4 ? 'not_called' : 'substitute';
    }
    return 'substitute';
  }

  const startMatchflow = () => {
    if (!playerProfile) return;

    // El Mundial ya NO comparte cupo con Libertadores/Champions cada 3 semanas -- ocupa su propio
    // bloque de 8 semanas SEGUIDAS (ver isWorldCupBreakWeek en leagueEngine.ts), como la fecha
    // FIFA real: mientras dura, liga doméstica y copas de club quedan congeladas de verdad (los
    // conteos de leagueMatchweeksElapsed*/cupWeeksElapsed* ya excluyen esas semanas).
    const inWorldCupBreak = isWorldCupBreakWeek(playerProfile.currentWeek);
    const isCup = !inWorldCupBreak && isCupWeek(playerProfile.currentWeek);
    // isCopaLibertadores es, en la práctica, un "no es liga doméstica" genérico (nombre legado de
    // antes de que existieran Champions/Mundial): debe ser true tanto en semana de copa normal
    // como en semana de Mundial con partido de selección. Si el Mundial no tiene partido puntual
    // esta semana, handleFinishMatch nunca se llama (se retorna antes de setScreen('match')), así
    // que no importa qué valor quede seteado en ese caso.
    setIsCopaLibertadores(isCup || inWorldCupBreak);

    let opName = '';
    let opClubId: string | null = null;
    let isHomeThisMatch = Math.random() > 0.5;
    // Declarado afuera del if/else para no quedar con un valor "viejo" de una semana de copa
    // anterior contaminando una semana doméstica normal (bug real detectado: sin esto,
    // handleFinishMatch podía resolver el Mundial con el resultado de un partido de liga
    // doméstica de otra semana).
    let foundWorldCupTeamId: string | null = null;

    if (inWorldCupBreak) {
      const year = getSeasonYear(playerProfile.currentWeek);
      const wcTeamId = NATIONALITY_TO_WORLD_CUP_TEAM_ID[playerProfile.nationality];
      const isEligible = !!wcTeamId
        && playerProfile.prestige >= WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD
        && playerProfile.careerStats.partidosHistoricos >= WORLD_CUP_CALLUP_MIN_MATCHES;

      const upcoming = isEligible
        ? getUpcomingWorldCupMatch(getOrCreateWorldCupState(year, WORLD_CUP_TEAMS_DATABASE, playerProfile.worldCups[year], playerProfile.currentWeek), wcTeamId!)
        : null;

      if (upcoming) {
        const opponentTeam = WORLD_CUP_TEAMS_DATABASE.find(t => t.id === upcoming.opponentId);
        opName = opponentTeam?.name || '';
        opClubId = upcoming.opponentId;
        isHomeThisMatch = upcoming.isHome;
        foundWorldCupTeamId = wcTeamId;
        setActiveCupId(null);
        setActiveUefaCupId(null);
        setActiveDomesticCup(false);
        setActiveMyTablePosition(null);
        setActiveRivalTablePosition(null);
        setActiveLeagueTeamCount(null);

        // El club te libera -- la FIFA lo obliga, así que irse nunca se bloquea -- pero si esa
        // semana tu club se jugaba algo grande, la relación con el DT (prestige) se enfría.
        // Un partido de liga en mitad de temporada es rutina y no cuesta nada.
        const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
        const clubComp = myClub ? realDomesticCupFor(myClub.league) : undefined;
        const importancia = classifyMissedMatch(clubComp, undefined);
        const costo = prestigeCostOfMissing(importancia);
        if (costo !== 0 && myClub) {
          pendingCountryDutyCost.current = {
            prestige: costo,
            notice: missedMatchNotice(importancia, myClub.name, clubComp?.name ?? 'tu club'),
            important: importancia !== 'routine',
          };
        }
      } else {
        // Fecha FIFA sin partido puntual para vos (no convocado, tu selección ya quedó
        // eliminada, o estás entre rondas): no hay actividad de clubes en absoluto esta semana,
        // ni de liga ni de copa -- descansás de verdad, como en la vida real.
        const restSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, true, true);
        const updated = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 20),
          currentWeek: playerProfile.currentWeek + 1,
          matchesWithoutRest: 0,
          continentalCups: restSync.continentalCups,
          uefaCups: restSync.uefaCups
        };
        const aged = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);
        if (isPastRetirementAge(aged)) {
          resolveRetirementCheckpoint(aged);
          return;
        }
        setPlayerProfile(aged);
        saveGameState(aged, shopItems);
        notify('📅 FECHA FIFA: el Mundial paraliza la actividad de clubes en todo el mundo. Esta semana no hay partido de liga ni de copa para tu club.');
        return;
      }
    } else if (isCup) {
      const year = getSeasonYear(playerProfile.currentWeek);
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;

      const libertadoresIds = new Set(getLibertadoresParticipants(CLUBS_DATABASE));
      const sudamericanaIds = new Set(getSudamericanaParticipants(CLUBS_DATABASE));
      const qualifiedCupId: 'libertadores' | 'sudamericana' | null = libertadoresIds.has(myClub.id)
        ? 'libertadores'
        : sudamericanaIds.has(myClub.id)
        ? 'sudamericana'
        : null;

      // Posición en la tabla de grupo/fase de liga de la copa continental (si aplica): antes esto
      // siempre quedaba en null para cualquier semana de copa -- eso hacía que ni el marcador del
      // partido ("Tu Equipo · N°" / "Rival · N°") ni el pressureMultiplier reflejaran nunca la
      // tabla real de grupos de Libertadores/Sudamericana/Champions/Europa, aunque fueras líder
      // invicto o colista (bug reportado: "ganar en Libertadores no se refleja en la tabla").
      let cupMyPos: number | null = null;
      let cupRivalPos: number | null = null;
      let cupTeamCount: number | null = null;

      let foundOpponentId: string | null = null;
      let eliminatedFromQualifiedCup = false;
      if (qualifiedCupId) {
        const cupKey = `${qualifiedCupId}-${year}`;
        const cup = getOrCreateCupState(qualifiedCupId, year, CLUBS_DATABASE, playerProfile.continentalCups[cupKey], playerProfile.currentWeek);
        const upcoming = getUpcomingCupMatch(cup, myClub.id);
        if (!upcoming && !isClubStillInCup(cup, myClub.id)) {
          eliminatedFromQualifiedCup = true;
        }
        if (upcoming) {
          const opponentClub = CLUBS_DATABASE.find(c => c.id === upcoming.opponentId);
          opName = opponentClub?.name || '';
          opClubId = upcoming.opponentId;
          isHomeThisMatch = upcoming.isHome;
          foundOpponentId = upcoming.opponentId;

          if (cup.stage === 'groups') {
            const myGroup = cup.groups.find(g => g.clubIds.includes(myClub.id));
            if (myGroup) {
              const sortedGroup = sortTable(myGroup.table);
              const myIdx = sortedGroup.findIndex(r => r.clubId === myClub.id);
              const rivalIdx = sortedGroup.findIndex(r => r.clubId === upcoming.opponentId);
              cupMyPos = myIdx >= 0 ? myIdx + 1 : null;
              cupRivalPos = rivalIdx >= 0 ? rivalIdx + 1 : null;
              cupTeamCount = sortedGroup.length || null;
            }
          }
        }
      }
      setActiveCupId(foundOpponentId ? qualifiedCupId : null);

      // Si el club no juega Libertadores/Sudamericana (ligas sudamericanas), probamos Champions/Europa League.
      let foundUefaOpponentId: string | null = null;
      if (!foundOpponentId) {
        const championsIds = new Set(getChampionsParticipants(CLUBS_DATABASE));
        const europaIds = new Set(getEuropaParticipants(CLUBS_DATABASE));
        const qualifiedUefaCupId: 'champions' | 'europa' | null = championsIds.has(myClub.id)
          ? 'champions'
          : europaIds.has(myClub.id)
          ? 'europa'
          : null;

        if (qualifiedUefaCupId) {
          const uefaCup = getOrCreateUefaCupState(qualifiedUefaCupId, CLUBS_DATABASE, playerProfile.uefaCups[qualifiedUefaCupId], playerProfile.currentWeek);
          const upcoming = getUpcomingUefaCupMatch(uefaCup, myClub.id);
          if (!upcoming && !isClubStillInUefaCup(uefaCup, myClub.id)) {
            eliminatedFromQualifiedCup = true;
          }
          if (upcoming) {
            const opponentClub = CLUBS_DATABASE.find(c => c.id === upcoming.opponentId);
            opName = opponentClub?.name || '';
            opClubId = upcoming.opponentId;
            isHomeThisMatch = upcoming.isHome;
            foundUefaOpponentId = upcoming.opponentId;

            if (uefaCup.stage === 'league_phase') {
              const sortedUefa = sortTable(uefaCup.table);
              const myIdx = sortedUefa.findIndex(r => r.clubId === myClub.id);
              const rivalIdx = sortedUefa.findIndex(r => r.clubId === upcoming.opponentId);
              cupMyPos = myIdx >= 0 ? myIdx + 1 : null;
              cupRivalPos = rivalIdx >= 0 ? rivalIdx + 1 : null;
              cupTeamCount = sortedUefa.length || null;
            }
          }
        }
        setActiveUefaCupId(foundUefaOpponentId ? qualifiedUefaCupId : null);
      } else {
        setActiveUefaCupId(null);
      }

      // Ya quedaste eliminado de la copa a la que habías clasificado esta edición: no hay más
      // partidos tuyos ahí, así que esta semana de copa no tiene actividad para vos -- igual que
      // una fecha FIFA sin partido puntual, no un partido de relleno bajo el cartel de un torneo
      // del que ya te bajaron (bug reportado: "si te eliminan de Libertadores, en julio vuelve a
      // aparecer la fase de grupos").
      if (eliminatedFromQualifiedCup && !foundOpponentId && !foundUefaOpponentId) {
        const restSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false);
        const updated = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 20),
          currentWeek: playerProfile.currentWeek + 1,
          matchesWithoutRest: 0,
          continentalCups: restSync.continentalCups,
          uefaCups: restSync.uefaCups
        };
        const aged = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);
        if (isPastRetirementAge(aged)) {
          resolveRetirementCheckpoint(aged);
          return;
        }
        setPlayerProfile(aged);
        saveGameState(aged, shopItems);
        notify('🏆 Ya quedaste eliminado de la copa continental esta edición. Esta semana no hay partido de copa para tu club.');
        return;
      }

      // Club no clasificado a ninguna copa continental, o copa entre rondas (sin partido esta
      // semana puntual): se juega la COPA NACIONAL contra un rival del propio país.
      //
      // Antes acá se sorteaba un nombre de un pool fijo de gigantes sudamericanos (Flamengo, Boca,
      // River...) y el partido salía bajo el cartel de "Copa Libertadores", porque isCopaLibertadores
      // es un "no es liga doméstica" genérico y activeCupLabel cae a Libertadores cuando no hay
      // cupId ni uefaCupId. Resultado: el 87% de los clubes de la base (887 de 1023) veía a un club
      // alemán o español jugando la Libertadores contra Boca, 12 veces por temporada. Encima esos
      // 8 nombres no existen en CLUBS_DATABASE, así que el rival quedaba sin escudo ni datos.
      if (!foundOpponentId && !foundUefaOpponentId) {
        const myClubForCup = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
        const domesticRivals = myClubForCup
          ? CLUBS_DATABASE.filter(c => c.id !== myClubForCup.id && c.league === myClubForCup.league)
          : [];
        const rival = domesticRivals.length
          ? domesticRivals[Math.floor(Math.random() * domesticRivals.length)]
          : null;
        if (rival) {
          opName = rival.name;
          opClubId = rival.id;
        } else {
          // Liga de un solo equipo en la base: no hay rival nacional posible, se cae al pool
          // genérico de rivales que ya usa la liga doméstica.
          opName = OPPONENT_CLUBS_POOL[Math.floor(Math.random() * OPPONENT_CLUBS_POOL.length)];
        }
        setActiveDomesticCup(true);
      } else {
        setActiveDomesticCup(false);
      }
      setActiveMyTablePosition(cupMyPos);
      setActiveRivalTablePosition(cupRivalPos);
      setActiveLeagueTeamCount(cupTeamCount);
    } else {
      // Semana de liga doméstica: limpiar el flag de copa nacional para que no quede pegado de una
      // semana de copa anterior y rotule mal el partido de liga.
      setActiveDomesticCup(false);
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const leagueKey = leagueKeyFor(myClub);
      const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey);
      const season = playerProfile.leagueSeasons[leagueKey] ?? getOrCreateSeasonForLeague(leagueClubs, undefined, playerProfile.currentWeek);
      const upcoming = getUpcomingMatchForLeague(season, leagueClubs, playerProfile.currentWeek, myClub.id);

      // Sanción disciplinaria pendiente (ver handleFinishMatch/handleResolveEvent): la liga
      // doméstica no espera, tu club juega igual pero simulado sin vos, sin pantalla de partido.
      // Las copas continentales/selección NO se ven afectadas por esta sanción (criterio real:
      // una sanción de liga doméstica no se traslada automáticamente a otra competencia).
      if (upcoming && playerProfile.suspendedMatches > 0) {
        const opponentClub = leagueClubs.find(c => c.id === upcoming.opponentId)!;
        resolveSuspendedLeagueWeek(myClub, leagueKey, leagueClubs, season, upcoming.isHome, opponentClub);
        return;
      }

      if (upcoming) {
        const opponentClub = leagueClubs.find(c => c.id === upcoming.opponentId);
        opName = opponentClub?.name || OPPONENT_CLUBS_POOL[Math.floor(Math.random() * OPPONENT_CLUBS_POOL.length)];
        opClubId = upcoming.opponentId;
        isHomeThisMatch = upcoming.isHome;

        const sortedTable = sortTable(season.table);
        const myPos = sortedTable.findIndex(row => row.clubId === myClub.id);
        const rivalPos = sortedTable.findIndex(row => row.clubId === upcoming.opponentId);
        setActiveMyTablePosition(myPos >= 0 ? myPos + 1 : null);
        setActiveRivalTablePosition(rivalPos >= 0 ? rivalPos + 1 : null);
        setActiveLeagueTeamCount(sortedTable.length || null);
      } else {
        // Fallback de seguridad (liga con un solo club u otro caso borde): no debería pasar en la práctica.
        const localRivals = leagueClubs.filter(c => c.id !== myClub.id).map(c => c.name);
        opName = localRivals.length > 0 ? localRivals[Math.floor(Math.random() * localRivals.length)] : OPPONENT_CLUBS_POOL[Math.floor(Math.random() * OPPONENT_CLUBS_POOL.length)];
        setActiveMyTablePosition(null);
        setActiveRivalTablePosition(null);
        setActiveLeagueTeamCount(null);
      }
    }

    setActiveWorldCupTeamId(foundWorldCupTeamId);
    setActiveOpposition(opName);
    setActiveOppositionClubId(opClubId);
    setActiveIsHome(isHomeThisMatch);

    // Convocatoria: solo aplica a partidos de club (liga/copas continentales/UEFA) -- la selección
    // ya filtra por prestige/partidos jugados antes de convocarte (ver WORLD_CUP_CALLUP thresholds
    // arriba), así que si estás ahí siempre arrancás titular.
    if (!foundWorldCupTeamId && opClubId) {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const lineupStatus = decideLineupStatus(myClub.reputation, playerProfile.prestige);

      if (lineupStatus === 'not_called') {
        const { homeGoals, awayGoals } = isHomeThisMatch ? simulateMatch(myClub, CLUBS_DATABASE.find(c => c.id === opClubId) || myClub) : simulateMatch(CLUBS_DATABASE.find(c => c.id === opClubId) || myClub, myClub);
        const myGoals = isHomeThisMatch ? homeGoals : awayGoals;
        const rivalGoals = isHomeThisMatch ? awayGoals : homeGoals;
        const updated: PlayerProfile = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 18),
          mentalHealth: Math.max(0, playerProfile.mentalHealth - 4),
          currentWeek: playerProfile.currentWeek + 1,
          matchesWithoutRest: 0,
        };
        const aged = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);
        if (isPastRetirementAge(aged)) {
          resolveRetirementCheckpoint(aged);
          return;
        }
        setPlayerProfile(aged);
        saveGameState(aged, shopItems);
        notify(`📋 NO FUISTE CONVOCADO esta fecha: el DT decidió dejarte fuera de la lista de ${myClub.name}. Resultado sin vos: ${myGoals}-${rivalGoals} vs. ${opName}.`);
        return;
      }

      setActiveLineupStatus(lineupStatus === 'substitute' ? 'substitute' : 'starter');
      setActiveSubEntryMinute(lineupStatus === 'substitute' ? 46 + Math.floor(Math.random() * 30) : null);
    } else {
      setActiveLineupStatus('starter');
      setActiveSubEntryMinute(null);
    }

    setScreen('match');
  };

  // Resuelve una fecha de liga doméstica sin mostrar el partido: tu club juega igual (simulado
  // vía simulateMatch, el mismo motor que usa el resto de la liga corriendo de fondo), vos solo
  // cumplís la sanción -- cobrás sueldo/dividendos pasivos pero no hay goles/asistencias propias.
  const resolveSuspendedLeagueWeek = (
    myClub: Club,
    leagueKey: string,
    leagueClubs: Club[],
    season: ReturnType<typeof getOrCreateSeasonForLeague>,
    isHomeThisMatch: boolean,
    opponentClub: Club
  ) => {
    if (!playerProfile) return;

    const { homeGoals, awayGoals } = isHomeThisMatch ? simulateMatch(myClub, opponentClub) : simulateMatch(opponentClub, myClub);
    const myGoals = isHomeThisMatch ? homeGoals : awayGoals;
    const rivalGoals = isHomeThisMatch ? awayGoals : homeGoals;

    const resolvedSeason = resolvePlayerWeekForLeague(season, leagueClubs, playerProfile.currentWeek, myClub.id, isHomeThisMatch, myGoals, rivalGoals);
    let updatedLeagueSeasons = { ...playerProfile.leagueSeasons, [leagueKey]: resolvedSeason };

    for (const key of Object.keys(updatedLeagueSeasons)) {
      if (key === leagueKey) continue;
      const otherLeagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === key);
      if (otherLeagueClubs.length === 0) continue;
      updatedLeagueSeasons[key] = getOrCreateSeasonForLeague(otherLeagueClubs, updatedLeagueSeasons[key], playerProfile.currentWeek + 1);
    }

    const activePassiveDividend = shopItems.filter(i => i.purchased).reduce((sum, i) => sum + (i.effect.passiveIncome || 0), 0);

    const suspendedSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false);
    const updated: PlayerProfile = {
      ...playerProfile,
      energy: Math.min(100, playerProfile.energy + 15),
      capital: playerProfile.capital + myClub.initialSalary + activePassiveDividend,
      mentalHealth: Math.max(0, playerProfile.mentalHealth - 3),
      currentWeek: playerProfile.currentWeek + 1,
      suspendedMatches: playerProfile.suspendedMatches - 1,
      matchesWithoutRest: 0,
      leagueSeasons: updatedLeagueSeasons,
      continentalCups: suspendedSync.continentalCups,
      uefaCups: suspendedSync.uefaCups
    };

    const aged = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);

    if (isPastRetirementAge(aged)) {
      resolveRetirementCheckpoint(aged);
      return;
    }

    setPlayerProfile(aged);
    saveGameState(aged, shopItems);
    notify(`🚫 Cumpliste tu sanción esta fecha. Sin ti en el campo, ${myClub.name} ${isHomeThisMatch ? myGoals : rivalGoals}-${isHomeThisMatch ? rivalGoals : myGoals} ${opponentClub.name}.${aged.suspendedMatches > 0 ? ` Te quedan ${aged.suspendedMatches} partido(s) más de sanción.` : ''}`);
  };

  const handleResolveEvent = (effects: { prestige: number; fans: number; energy: number; capital: number; suspension?: number }) => {
    if (!playerProfile) return;

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + effects.prestige) ),
      fans: Math.max(0, Math.min(100, playerProfile.fans + effects.fans)),
      energy: Math.max(0, Math.min(100, playerProfile.energy + effects.energy)),
      capital: Math.max(0, playerProfile.capital + (effects.capital || 0)),
      mentalHealth: Math.max(0, Math.min(100, playerProfile.mentalHealth + mentalHealthNudge(effects.prestige + effects.fans))),
      suspendedMatches: playerProfile.suspendedMatches + (effects.suspension || 0)
    };

    const { items: updatedShop, droppedNames } = checkSponsorControversyFallout(shopItems, effects.prestige);

    setPlayerProfile(updatedProfile);
    setShopItems(updatedShop);
    saveGameState(updatedProfile, updatedShop);
    setActiveEvent(null);
    // startMatchflow tiene ramas (fecha FIFA sin partido puntual, sanción de liga pendiente) que
    // resuelven la semana solas y vuelven sin llamar a setScreen('match') -- si no volvemos acá a
    // 'dashboard' primero, la pantalla se queda pegada en 'event' con activeEvent ya en null y no
    // renderiza nada (pantalla negra). Si sí hay partido, startMatchflow pisa esto con 'match'.
    setScreen('dashboard');

    if (droppedNames.length > 0) {
      const verb = droppedNames.length > 1 ? 'rescindieron sus contratos' : 'rescindió su contrato';
      notify(`📉 El escándalo llegó a la prensa. ${droppedNames.join(', ')} ${verb} contigo.`);
    }
    if (effects.suspension) {
      notify(`🚫 Sanción disciplinaria: te perderás ${effects.suspension} partido${effects.suspension > 1 ? 's' : ''} de liga.`);
    }

    startMatchflow();
  };

  const handleFinishMatch = (results: any, shootoutOverride?: PenaltyShootoutResult) => {
    if (!playerProfile) return;

    setMatchResults(results);

    const baseEnergySpent = 28;
    const coachItem = shopItems.find(i => i.id === 'physical_coach');
    const houseItem = shopItems.find(i => i.id === 'luxury_mansion');

    const reduction = coachItem?.purchased ? 10 : 0;
    const finalEnergySpent = Math.max(10, baseEnergySpent - reduction);

    // FASE 4 -- ahora que el entrenamiento cuesta capital (ver handleTrainAttribute), el bono por
    // partido sube ~30% respecto al valor de Fase 3 para compensar el nuevo gasto semanal.
    const goalBonus = results.goles * 500;
    const assistBonus = results.asistencias * 230;
    // Patrocinios "casi infinitos": sumamos el dividendo pasivo de TODOS los items comprados que
    // tengan uno, en vez de tener un caso especial hardcodeado por cada patrocinio nuevo.
    const activePassiveDividend = shopItems.filter(i => i.purchased).reduce((sum, i) => sum + (i.effect.passiveIncome || 0), 0);

    const totalIncome = results.salaryEarned + goalBonus + assistBonus + activePassiveDividend + playerProfile.appearanceBonus;
    const totalExtraRecover = (coachItem?.purchased ? 8 : 0) + (houseItem?.purchased ? 20 : 0);

    // Antes esto era rating*6000 (siempre positivo, hasta en un partido flojo) más goles/asistencias
    // sin tope real -- eso hacía que el valor de mercado subiera rápido partido tras partido sin
    // importar cómo jugaste. Ahora está centrado en una calificación de 6.0 (partido "normal" no
    // cambia nada): jugar mal de verdad (rating < 6) te baja el valor, y solo un partidazo genuino
    // (rating alto y/o goles/asistencias) lo sube.
    const valueChg = (results.rating - 6.0) * 4500 + (results.goles * 12000) + (results.asistencias * 7000);
    const campeonatoGanado = results.campeonatoGanado ? 1 : 0;

    // Si tu partido de esta semana fue de eliminación directa y terminó igualado, alguna de las
    // 4 ramas de abajo va a dejar una tanda de penales guardada en el bracket/llave correspondiente.
    // La detectamos acá para poder narrarla en pantalla antes de seguir al resumen post-partido.
    let foundShootout: PenaltyShootoutResult | null = null;
    let foundShootoutMyId = '';
    let foundShootoutMyName = '';

    let updatedLeagueSeasons = playerProfile.leagueSeasons;
    if (!isCopaLibertadores && activeOppositionClubId) {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const leagueKey = leagueKeyFor(myClub);
      const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey);
      const existingSeason = playerProfile.leagueSeasons[leagueKey] ?? getOrCreateSeasonForLeague(leagueClubs, undefined, playerProfile.currentWeek);
      const resolvedSeason = resolvePlayerWeekForLeague(
        existingSeason, leagueClubs, playerProfile.currentWeek, myClub.id,
        activeIsHome, results.golesMiEquipo, results.golesRival, shootoutOverride
      );

      const shootout = findShootoutInPlayoffBracket(resolvedSeason.knockout, myClub.id, activeOppositionClubId)
        || findShootoutInTwoLegBracket(resolvedSeason.twoLegKnockout, myClub.id, activeOppositionClubId);
      if (shootout) {
        foundShootout = shootout;
        foundShootoutMyId = myClub.id;
        foundShootoutMyName = myClub.name;
      }

      updatedLeagueSeasons = { ...playerProfile.leagueSeasons, [leagueKey]: resolvedSeason };

      // Ligas ya visitadas (por traspasos anteriores) siguen corriendo de fondo aunque ya no juegues ahí.
      for (const key of Object.keys(updatedLeagueSeasons)) {
        if (key === leagueKey) continue;
        const otherLeagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === key);
        if (otherLeagueClubs.length === 0) continue;
        updatedLeagueSeasons[key] = getOrCreateSeasonForLeague(otherLeagueClubs, updatedLeagueSeasons[key], playerProfile.currentWeek + 1);
      }
    }

    let updatedContinentalCups = playerProfile.continentalCups;
    if (isCopaLibertadores && activeCupId && activeOppositionClubId) {
      const year = getSeasonYear(playerProfile.currentWeek);
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const cupKey = `${activeCupId}-${year}`;
      const cupBeforeMatch = getOrCreateCupState(activeCupId, year, CLUBS_DATABASE, playerProfile.continentalCups[cupKey], playerProfile.currentWeek);
      const resolvedCup = resolveCupWeek(cupBeforeMatch, CLUBS_DATABASE, myClub.id, activeIsHome, results.golesMiEquipo, results.golesRival, shootoutOverride);
      const shootout = findShootoutInPlayoffBracket(resolvedCup.knockout, myClub.id, activeOppositionClubId);
      if (shootout) {
        foundShootout = shootout;
        foundShootoutMyId = myClub.id;
        foundShootoutMyName = myClub.name;
      }
      updatedContinentalCups = { ...playerProfile.continentalCups, [cupKey]: resolvedCup };
    }

    let updatedUefaCups = playerProfile.uefaCups;
    if (isCopaLibertadores && activeUefaCupId && activeOppositionClubId) {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const uefaCupBeforeMatch = getOrCreateUefaCupState(activeUefaCupId, CLUBS_DATABASE, playerProfile.uefaCups[activeUefaCupId], playerProfile.currentWeek);
      const resolvedUefaCup = resolveUefaCupWeek(uefaCupBeforeMatch, CLUBS_DATABASE, myClub.id, activeIsHome, results.golesMiEquipo, results.golesRival, shootoutOverride);
      const shootout = findShootoutInTwoLegBracket(resolvedUefaCup.knockout, myClub.id, activeOppositionClubId)
        || findShootoutInTwoLegTies(resolvedUefaCup.playoff, myClub.id, activeOppositionClubId);
      if (shootout) {
        foundShootout = shootout;
        foundShootoutMyId = myClub.id;
        foundShootoutMyName = myClub.name;
      }
      updatedUefaCups = { ...playerProfile.uefaCups, [activeUefaCupId]: resolvedUefaCup };
    }

    let updatedWorldCups = playerProfile.worldCups;
    if (isCopaLibertadores && activeWorldCupTeamId && activeOppositionClubId) {
      const year = getSeasonYear(playerProfile.currentWeek);
      const wcBeforeMatch = getOrCreateWorldCupState(year, WORLD_CUP_TEAMS_DATABASE, playerProfile.worldCups[year], playerProfile.currentWeek);
      const resolvedWorldCup = resolveWorldCupWeek(wcBeforeMatch, WORLD_CUP_TEAMS_DATABASE, activeWorldCupTeamId, activeIsHome, results.golesMiEquipo, results.golesRival, shootoutOverride);
      const shootout = findShootoutInPlayoffBracket(resolvedWorldCup.knockout, activeWorldCupTeamId, activeOppositionClubId);
      if (shootout) {
        foundShootout = shootout;
        foundShootoutMyId = activeWorldCupTeamId;
        foundShootoutMyName = WORLD_CUP_TEAMS_DATABASE.find(t => t.id === activeWorldCupTeamId)?.name || '';
      }
      updatedWorldCups = { ...playerProfile.worldCups, [year]: resolvedWorldCup };
    }

    // Si tu partido terminó igualado en eliminación directa y todavía no jugaste la tanda en vivo,
    // pausamos acá: se muestra InteractivePenaltyShootout y, cuando termine, handleFinishMatch se
    // vuelve a invocar con shootoutOverride para que el bracket quede consistente con lo que jugaste.
    if (foundShootout && !shootoutOverride) {
      setPendingMatchResults(results);
      setActivePenaltyShootout({ result: foundShootout, myId: foundShootoutMyId, myName: foundShootoutMyName });
      setScreen('penalty_shootout');
      return;
    }

    // Mantener al día Libertadores/Sudamericana y Champions/Europa de tu club aunque esta semana
    // haya sido de liga doméstica (no de copa) -- ver syncBackgroundCups.
    {
      const synced = syncBackgroundCups(
        playerProfile.currentClubId, playerProfile.currentWeek + 1, updatedContinentalCups, updatedUefaCups,
        !!(isCopaLibertadores && activeCupId && activeOppositionClubId),
        !!(isCopaLibertadores && activeUefaCupId && activeOppositionClubId)
      );
      updatedContinentalCups = synced.continentalCups;
      updatedUefaCups = synced.uefaCups;
    }

    // Fase 3 -- salud mental según el resultado del partido, y saludo de famoso si el rating fue altísimo.
    const matchMentalHealthChange = results.resultado === 'W' ? 4 : results.resultado === 'L' ? -5 : -1;
    const isViralPerformance = results.rating >= 8.5;
    const viralMarketBonus = isViralPerformance ? 50000 : 0;

    // Fase 2.5 -- Viralización negativa: un partido paupérrimo (rating bajísimo) también te puede
    // hacer viral, pero para mal -- memes y burlas en redes aunque no hayas cometido ninguna decisión
    // arriesgada puntual. Antes solo una tarjeta roja o una mala decisión de partido golpeaban el
    // prestigio/fans; esto extiende esa misma cuenta para que el rating solo (sin roja ni mala
    // decisión) también pueda empujar netPrestigeChange por debajo del umbral de checkSponsorControversyFallout.
    const VIRAL_NEGATIVE_RATING_THRESHOLD = 4.0;
    const VIRAL_NEGATIVE_PRESTIGE_PENALTY = 6;
    const VIRAL_NEGATIVE_FANS_PENALTY = 8;
    const isViralNegativePerformance = results.rating < VIRAL_NEGATIVE_RATING_THRESHOLD;

    // Tarjetas, multas y sanciones: el prestigio/fans que acumularon las decisiones del partido
    // (antes muerto, nunca se aplicaba) se liquida acá. Una roja (directa o por doble amarilla)
    // suma sanción de la federación y multa, además del golpe de prestigio de la jugada en sí.
    const YELLOW_CARD_SUSPENSION_THRESHOLD = 5;
    const RED_CARD_FINE = 15000;
    const RED_CARD_PRESTIGE_PENALTY = 8;

    const cardReceived: 'none' | 'yellow' | 'red' = results.cardReceived || 'none';
    const decisionPrestigeChange = results.prestigeChange || 0;
    const decisionFansChange = results.fansChange || 0;
    const netPrestigeChange = decisionPrestigeChange
      - (cardReceived === 'red' ? RED_CARD_PRESTIGE_PENALTY : 0)
      - (isViralNegativePerformance ? VIRAL_NEGATIVE_PRESTIGE_PENALTY : 0);
    const netFansChange = decisionFansChange - (isViralNegativePerformance ? VIRAL_NEGATIVE_FANS_PENALTY : 0);

    let newYellowCards = playerProfile.yellowCards;
    let newSuspendedMatches = playerProfile.suspendedMatches;
    let disciplineFine = 0;
    const disciplineMessages: string[] = [];

    if (isViralNegativePerformance) {
      disciplineMessages.push(`📉 Te volviste viral por las malas: la timeline te destroza tras un partido paupérrimo (rating ${results.rating.toFixed(1)}).`);
    }

    // Fase 2.5 -- Superstición del jugador: cada partido hay una chance chica de que la rutina
    // elegida en la creación del personaje se rompa por circunstancias fuera de tu control, con un
    // golpecito de mentalHealth (nada grave, es un ritual, no una lesión).
    const SUPERSTITION_BREAK_CHANCE = 0.12;
    const SUPERSTITION_BREAK_MENTAL_PENALTY = 3;
    const superstitionBroke = Math.random() < SUPERSTITION_BREAK_CHANCE;
    const superstitionBreakPenalty = superstitionBroke ? SUPERSTITION_BREAK_MENTAL_PENALTY : 0;
    if (superstitionBroke) {
      const ritual = SUPERSTITIONS_DATABASE.find(s => s.id === playerProfile.superstition);
      if (ritual) {
        disciplineMessages.push(`😬 Se te rompió el ritual ("${ritual.label}"): ${ritual.breakMessage}. Quedaste con la cabeza un poco floja.`);
      }
    }

    if (cardReceived === 'red') {
      newSuspendedMatches += 1;
      disciplineFine = RED_CARD_FINE;
      disciplineMessages.push(`🟥 Expulsión: la federación te suspende 1 partido y te multa con $${RED_CARD_FINE.toLocaleString()}.`);
    } else if (cardReceived === 'yellow') {
      newYellowCards += 1;
      if (newYellowCards >= YELLOW_CARD_SUSPENSION_THRESHOLD) {
        newYellowCards = 0;
        newSuspendedMatches += 1;
        disciplineMessages.push(`🟨 Acumulaste ${YELLOW_CARD_SUSPENSION_THRESHOLD} amarillas en la temporada: sanción automática de 1 partido.`);
      }
    }

    const { items: updatedShop, droppedNames } = checkSponsorControversyFallout(shopItems, netPrestigeChange);
    if (droppedNames.length > 0) {
      const verb = droppedNames.length > 1 ? 'rescindieron sus contratos' : 'rescindió su contrato';
      disciplineMessages.push(`📉 ${droppedNames.join(', ')} ${verb} contigo tras lo sucedido en el partido.`);
    }

    // Trayectoria de carrera: solo partidos de CLUB (liga o copas de clubes) suman a la tabla de
    // temporadas, no los de la selección -- ver recordSeasonHistory.
    const updatedSeasonHistory = activeWorldCupTeamId
      ? playerProfile.seasonHistory
      : recordSeasonHistory(
          playerProfile.seasonHistory,
          getSeasonYear(playerProfile.currentWeek),
          playerProfile.currentClubId,
          CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)?.name || '',
          results.goles,
          results.asistencias,
          !!results.campeonatoGanado
        );

    // Costo de haberse ido con la selección esta semana (ver pendingCountryDutyCost). Se aplica
    // acá y no al salir de la semana para que el jugador vea el efecto junto al partido que lo
    // causó, no antes de jugarlo.
    const countryDuty = pendingCountryDutyCost.current;
    pendingCountryDutyCost.current = null;
    if (countryDuty?.notice) notify(countryDuty.notice);

    const updated: PlayerProfile = {
      ...playerProfile,
      missedClubMatchesForCountry:
        playerProfile.missedClubMatchesForCountry + (countryDuty?.important ? 1 : 0),
      energy: Math.max(5, Math.min(100, playerProfile.energy - finalEnergySpent + totalExtraRecover)),
      capital: Math.max(0, playerProfile.capital + totalIncome - disciplineFine),
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + netPrestigeChange + (countryDuty?.prestige ?? 0))),
      fans: Math.max(0, Math.min(100, playerProfile.fans + netFansChange)),
      yellowCards: newYellowCards,
      suspendedMatches: newSuspendedMatches,
      seasonHistory: updatedSeasonHistory,
      marketValue: Math.max(100000, playerProfile.marketValue + valueChg + viralMarketBonus),
      mentalHealth: Math.max(0, Math.min(100, playerProfile.mentalHealth + matchMentalHealthChange - superstitionBreakPenalty)),
      matchesWithoutRest: playerProfile.matchesWithoutRest + 1,
      lastMatchRating: results.rating,
      lastMatchGoals: results.goles,
      lastMatchWonShootout: !!shootoutOverride && shootoutOverride.winnerId === (activeWorldCupTeamId || playerProfile.currentClubId),
      currentWeek: playerProfile.currentWeek + 1,
      leagueSeasons: updatedLeagueSeasons,
      continentalCups: updatedContinentalCups,
      uefaCups: updatedUefaCups,
      worldCups: updatedWorldCups,
      careerStats: {
        goles: playerProfile.careerStats.goles + results.goles,
        asistencias: playerProfile.careerStats.asistencias + results.asistencias,
        partidos: playerProfile.careerStats.partidos + 1,
        campeonatos: playerProfile.careerStats.campeonatos + campeonatoGanado,
        golesHistoricos: playerProfile.careerStats.golesHistoricos + results.goles,
        asistenciasHistoricos: playerProfile.careerStats.asistenciasHistoricos + results.asistencias,
        partidosHistoricos: playerProfile.careerStats.partidosHistoricos + 1,
        sumaCalificacionesHistoricas: playerProfile.careerStats.sumaCalificacionesHistoricas + results.rating,
        tarjetasAmarillasHistoricas: playerProfile.careerStats.tarjetasAmarillasHistoricas + (cardReceived === 'yellow' ? 1 : 0),
        tarjetasRojasHistoricas: playerProfile.careerStats.tarjetasRojasHistoricas + (cardReceived === 'red' ? 1 : 0)
      }
    };

    const aged = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);

    if (isPastRetirementAge(aged)) {
      resolveRetirementCheckpoint(aged, updatedShop);
      return;
    }

    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(aged);
    if (newlyUnlocked.length > 0) {
      setAchievementQueue(prev => [...prev, ...newlyUnlocked]);
    }

    setPlayerProfile(withAchievements);
    setShopItems(updatedShop);
    saveGameState(withAchievements, updatedShop);
    if (disciplineMessages.length > 0) {
      notify(disciplineMessages.join('\n'));
    }

    setActivePenaltyShootout(null);
    setPendingMatchResults(null);
    setScreen('post_match');
  };

  const handleContinueFromShootout = (result: PenaltyShootoutResult, myClubWon: boolean) => {
    if (!pendingMatchResults || !activePenaltyShootout || !activeOppositionClubId) return;
    // InteractivePenaltyShootout no conoce los IDs reales de los clubes (solo nombres), así que
    // acá remapeamos sus placeholders 'mine'/'rival' a los IDs reales antes de que el motor de
    // brackets lo use como shootoutOverride -- ver ForcedResult en leagueEngine.ts.
    const myRealId = activePenaltyShootout.myId;
    const remappedResult: PenaltyShootoutResult = {
      ...result,
      clubAId: myRealId,
      clubBId: activeOppositionClubId,
      kicks: result.kicks.map(k => ({ ...k, clubId: k.clubId === 'mine' ? myRealId : activeOppositionClubId })),
      winnerId: result.winnerId === 'mine' ? myRealId : activeOppositionClubId,
    };
    // Reflejamos en el resumen del partido lo que de verdad pasó en la tanda que jugaste, aunque el
    // resultado en tiempo reglamentario haya sido empate.
    const adjustedResults = {
      ...pendingMatchResults,
      resultado: myClubWon ? 'W' : 'L',
    };
    handleFinishMatch(adjustedResults, remappedResult);
  };

  const handleContinuePostMatch = () => {
    setScreen('dashboard');
  };

  const handleResetGame = () => {
    if (confirm('¿Estás seguro de restaurar los datos? Todo tu progreso guardado será borrado.')) {
      if (activeSlotId) {
        localStorage.removeItem(`futbol_star_save_${activeSlotId}`);
        localStorage.removeItem(`futbol_star_shop_${activeSlotId}`);
      }
      setPlayerProfile(null);
      setShopItems(INITIAL_LIFESTYLE_ITEMS);
      setScreen('welcome');
    }
  };

  // Fase 3 -- retiro forzado: a partir de FORCED_RETIREMENT_AGE ningún club te contrata a ese
  // nivel físico. Cierra la carrera mostrando un resumen y borra el save (no hay vuelta atrás,
  // como el retiro real -- si el jugador quiere seguir jugando, empieza una carrera nueva).
  const triggerForcedRetirement = (profile: PlayerProfile) => {
    setPlayerProfile(profile);
    setScreen('career_summary');
  };

  // Fase 2.5 -- Punto único donde se resuelve isPastRetirementAge(profile) === true: si todavía no
  // usaste la chance de "retiro escalonado" y hay un club de menor reputación disponible en tu
  // misma liga, se ofrece bajar de categoría para seguir jugando en vez de cortar la carrera de una.
  // Si ya la usaste, o no hay a dónde bajar, o el jugador prefiere retirarse -- retiro forzado normal.
  const resolveRetirementCheckpoint = (profile: PlayerProfile, updatedShopItems: ShopItem[] = shopItems) => {
    if (!profile.hasSteppedDownRetirement) {
      const stepDownClub = findStepDownClub(profile);
      if (stepDownClub) {
        const oldClubName = CLUBS_DATABASE.find(c => c.id === profile.currentClubId)?.name || 'tu club';
        if (confirm(`Llegaste a los ${profile.age} años, el límite físico para seguir en ${oldClubName} a este nivel. ¿Querés bajar de categoría a ${stepDownClub.name} para seguir jugando unos años más, en vez de retirarte ahora?`)) {
          const steppedDown: PlayerProfile = {
            ...profile,
            currentClubId: stepDownClub.id,
            hasSteppedDownRetirement: true,
            marketValue: Math.max(50000, Math.round(profile.marketValue * STEP_DOWN_MARKET_VALUE_MULTIPLIER)),
            prestige: Math.round(profile.prestige * STEP_DOWN_PRESTIGE_MULTIPLIER)
          };
          setPlayerProfile(steppedDown);
          setShopItems(updatedShopItems);
          saveGameState(steppedDown, updatedShopItems);
          setScreen('dashboard');
          notify(`🔻 Bajaste de categoría a ${stepDownClub.name} para seguir compitiendo unos años más. Menos luces, pero sigues en la cancha.`);
          return;
        }
      }
    }
    triggerForcedRetirement(profile);
  };

  const handleFinishCareerSummary = () => {
    if (activeSlotId) {
      localStorage.removeItem(`futbol_star_save_${activeSlotId}`);
      localStorage.removeItem(`futbol_star_shop_${activeSlotId}`);
    }
    setPlayerProfile(null);
    setShopItems(INITIAL_LIFESTYLE_ITEMS);
    setScreen('welcome');
  };

  // NUEVO: SISTEMA DE RECUPERACIÓN DE ENERGÍA PAGANDO
  const handleRecoverEnergy = (cost: number, energyAmount: number) => {
    if (!playerProfile) return;
    if (playerProfile.capital < cost) {
      notify('No tienes suficientes fondos en tu cuenta bancaria para pagar este tratamiento.');
      return;
    }
    if (playerProfile.energy >= 100) {
      notify('¡Tu energía ya está al máximo! Estás a tope para jugar.');
      return;
    }

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: playerProfile.capital - cost,
      energy: Math.min(100, playerProfile.energy + energyAmount)
    };

    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans antialiased text-base">

      {achievementQueue.length > 0 && (
        <AchievementToast
          key={achievementQueue[0].id}
          achievement={achievementQueue[0]}
          onDone={() => setAchievementQueue(prev => prev.slice(1))}
        />
      )}

      {noticeQueue.length > 0 && (
        <NoticeToast
          key={noticeQueue[0]}
          message={noticeQueue[0]}
          onDone={() => setNoticeQueue(prev => prev.slice(1))}
        />
      )}

      {/* Fuera de los bloques por pantalla a propósito: montado una sola vez acá, el iframe
          sobrevive los cambios de pantalla y la canción no se corta al entrar a un partido.
          Se esconde en welcome/setup para no competir con el arranque del juego. */}
      <MusicPlayer hidden={screen === 'welcome' || screen === 'setup'} />

      {screen === 'welcome' && (
        <WelcomeScreen 
          onStartNew={handleStartNew} 
          onLoadGame={handleLoadGame} 
        />
      )}

      {screen === 'setup' && (
        <SetupScreen
          onBack={() => setScreen('welcome')}
          onFinishSetup={handleFinishSetup}
          onNotify={notify}
        />
      )}

      {screen === 'dashboard' && playerProfile && (
        <Dashboard
          playerProfile={playerProfile}
          shopItems={shopItems}
          onTrainAttribute={handleTrainAttribute}
          onSelectMentee={handleSelectMentee}
          onFindGirlfriend={handleFindGirlfriend}
          onGirlfriendFlowers={handleGirlfriendFlowers}
          onGirlfriendPhoto={handleGirlfriendPhoto}
          onGirlfriendFaithful={handleGirlfriendFaithful}
          onGirlfriendCheat={handleGirlfriendCheat}
          onGirlfriendDenyRumors={handleGirlfriendDenyRumors}
          onGirlfriendMoveIn={handleGirlfriendMoveIn}
          onReconvertPosition={handleReconvertPosition}
          onBuyItem={handleBuyItem}
          onAcceptSponsor={handleAcceptSponsor}
          onCancelSponsor={handleCancelSponsor}
          onLaunchPRCampaign={handleLaunchPRCampaign}
          onAnswerPress={handleAnswerPress}
          onAcceptTransfer={handleAcceptTransfer}
          onAdvanceWeek={handleAdvanceWeek}
          onRecoverEnergy={handleRecoverEnergy}
          onSocialInteraction={handleSocialInteraction}
          onLogout={() => setScreen('welcome')}
          onResetGame={handleResetGame}
        />
      )}

      {screen === 'match' && playerProfile && (
        <MatchSimulator
          playerProfile={playerProfile}
          opponentName={activeOpposition}
          isLibertadores={isCopaLibertadores}
          cupId={activeCupId}
          uefaCupId={activeUefaCupId}
          isDomesticCup={activeDomesticCup}
          isWorldCup={!!activeWorldCupTeamId}
          representingTeamId={activeWorldCupTeamId}
          isHome={activeIsHome}
          myTablePosition={activeMyTablePosition}
          rivalTablePosition={activeRivalTablePosition}
          leagueTeamCount={activeLeagueTeamCount}
          lineupStatus={activeLineupStatus}
          subEntryMinute={activeSubEntryMinute}
          onFinishMatch={handleFinishMatch}
        />
      )}

      {screen === 'career_summary' && playerProfile && (
        <CareerSummary
          playerProfile={playerProfile}
          onContinue={handleFinishCareerSummary}
        />
      )}

      {screen === 'penalty_shootout' && activePenaltyShootout && playerProfile && (
        <InteractivePenaltyShootout
          playerProfile={playerProfile}
          myClubName={activePenaltyShootout.myName}
          rivalClubName={activeOpposition}
          onContinue={handleContinueFromShootout}
        />
      )}

      {screen === 'post_match' && playerProfile && matchResults && (
        <PostMatch
          playerProfile={playerProfile}
          matchResults={matchResults}
          opponentName={activeOpposition}
          representingTeamId={activeWorldCupTeamId}
          onContinue={handleContinuePostMatch}
        />
      )}

      {screen === 'event' && activeEvent && (
        <DecisionCenter
          event={activeEvent}
          onResolve={handleResolveEvent}
        />
      )}

    </div>
  );
}