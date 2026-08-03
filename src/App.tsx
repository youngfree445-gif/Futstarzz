import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, ShopItem, PlayerStats, Position, Club, PenaltyShootoutResult, PlayoffBracket, TwoLegBracket, TwoLegTie, SeasonHistory, Achievement, DatedResult, CupTitle } from './types';
import {
  INITIAL_LIFESTYLE_ITEMS, LOBBY_RANDOM_EVENTS, OPPONENT_CLUBS_POOL, ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE,
  WORLD_CUP_TEAMS_DATABASE, NATIONALITY_TO_WORLD_CUP_TEAM_ID, MAX_ACTIVE_SPONSORSHIPS, ACHIEVEMENTS_DATABASE
} from './data';
import { applyClubTheme } from './clubTheme';
import { preloadSfx } from './audio';
import { realDomesticCupFor } from './realCalendar';
import { hasRealSchedule, matchesThisWeek, pickPrimary } from './realSchedule';
// Calendario por fechas reales (ver dateSchedule.ts). Convive con realSchedule: los clubes con
// fechas cargadas usan éste, el resto sigue con el semanal hasta que se importen las suyas.
import { esUltimoPartidoDeLaCopa, esUltimaFechaDelTorneo, fixturesAtStep, hasDatedLeagueSchedule, partidosDeLaMismaLlave, pickPrimary as pickDatedPrimary, torneoDelClubEnFecha } from './dateSchedule';
import { crearCopaNacional, cruceActual, nombreCopaNacional, piernaDelCruce, rondaActual, sigueEnCopa } from './copaNacional';
import { reglasDeLiga, resolverMovimientos, tablaDeDescenso } from './promocionDescenso';
import { classifyMissedMatch, missedMatchNotice, prestigeCostOfMissing, seasonEndPrestigePenalty } from './nationalTeamDuty';
import { resolveWorldRetirements, applySquadRetirements, getSquadPlayerAge, MENTEE_MAX_AGE } from './worldRetirements';
import {
  leagueKeyFor, setDivisionOverrides, getOrCreateSeasonForLeague, getUpcomingMatchForLeague, resolvePlayerWeekForLeague, isCupWeek, sortTable, isApeturaClausuraLeague,
  getSeasonYear, getLibertadoresParticipants, getSudamericanaParticipants, getOrCreateCupState, getUpcomingCupMatch, resolveCupWeek, isClubStillInCup,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState, getUpcomingUefaCupMatch, resolveUefaCupWeek, isClubStillInUefaCup,
  isWorldCupBreakWeek, getOrCreateWorldCupState, getUpcomingWorldCupMatch, resolveWorldCupWeek, simulateMatch,
  WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD, WORLD_CUP_CALLUP_MIN_MATCHES, generateLeagueLeadersFromTable, CAREER_START_YEAR,
  resolverPasoCopaNacional, simulatePenaltyShootout
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
import ChampionOverlay, { type ChampionInfo } from './components/ChampionOverlay';
import { getLeagueDisplay } from './leagueDisplay';
import { resolverClubDeCalendario } from './clubAliases';
import NoticeToast from './components/NoticeToast';
import SoundSettings from './components/SoundSettings';
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

  // Si el club tiene calendario con fechas reales, ese calendario ES su temporada completa: liga,
  // copa nacional y continental. El motor no debe montarle además su propia Libertadores.
  //
  // Sin esto quedaban DOS Libertadores corriendo en paralelo para el mismo club -- la del calendario
  // real (6 partidos entre abril y mayo) y la que el motor le arma por estar clasificado -- y la del
  // motor le reclamaba el turno cuando el calendario decía otra cosa: ibas a jugar Libertadores y
  // terminabas jugando la vuelta de la Superliga, o al revés.
  const tieneCalendarioPropio = !!myClub && hasDatedLeagueSchedule(myClub.name);

  if (myClub && !tieneCalendarioPropio) {
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

// A partir de RETIREMENT_DECISION_AGE, cada cierre de temporada te pregunta si colgás los botines
// o aguantás un año más -- la decisión es tuya, se repite todos los años y no cuesta nada más que
// el desgaste. A RETIREMENT_MAX_AGE ya no hay pregunta: se termina la carrera.
//
// Los números salen de los datos reales scrapeados (ver tmSquadEnrichment.ts): en Colombia y
// Argentina hay gente jugando a los 41 (Teófilo Gutiérrez, Rodallega, Insaurralde), así que cortar
// a los 39 dejaba afuera una franja de veteranos que en la vida real siguen en cancha.
const RETIREMENT_DECISION_AGE = 43;
const RETIREMENT_MAX_AGE = 45;

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

  // El ahijado también cumple años: pasado el límite se "gradúa" y deja de serlo, o seguirías
  // apadrinando al mismo jugador cuando ya tiene 30. El roll de esta temporada igual se aplica.
  const seguiaSiendoJoven = getSquadPlayerAge(profile.currentClubId, profile.mentorshipPlayerName, getSeasonYear(newWeek) - CAREER_START_YEAR) < MENTEE_MAX_AGE;

  return {
    ...profile,
    prestige: Math.max(0, Math.min(100, profile.prestige + prestigeChange)),
    mentorshipPlayerName: seguiaSiendoJoven ? profile.mentorshipPlayerName : null,
  };
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

// Paso 3 -- Retiros del mundo: cada cierre de temporada los veteranos de los OTROS clubes tiran
// para colgar los botines, y al que se va lo reemplaza un canterano generado. Sin esto los
// planteles quedan congelados para siempre. Ver worldRetirements.ts para la curva de edades.
function applyWorldRetirementsIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (getSeasonYear(previousWeek) === getSeasonYear(newWeek)) return profile;

  // Los retiros previos ya están aplicados, así que se le pasan los planteles YA renovados: un
  // canterano de 18 que subió la temporada pasada no puede retirarse en la siguiente.
  const previos = profile.retiredWorldPlayers ?? {};
  const clubs = CLUBS_DATABASE.map(c => ({
    id: c.id,
    name: c.name,
    league: c.league,
    starPlayers: applySquadRetirements(c.id, c.starPlayers, previos),
  }));

  const { events, replacements } = resolveWorldRetirements(clubs, getSeasonYear(newWeek));
  if (events.length === 0) return { ...profile, lastRetirementNews: [] };

  // Se fusiona con lo que ya había: cada club acumula sus retiros de todas las temporadas.
  const merged: Record<string, Record<string, string>> = { ...previos };
  for (const [clubId, mapa] of Object.entries(replacements)) {
    merged[clubId] = { ...(merged[clubId] ?? {}), ...mapa };
  }

  return {
    ...profile,
    retiredWorldPlayers: merged,
    // Solo los más resonantes van al feed: 6 alcanza para que se note sin tapar el resto.
    lastRetirementNews: events
      .sort((a, b) => b.age - a.age)
      .slice(0, 6)
      .map(e => ({ clubName: e.clubName, playerName: e.playerName, age: e.age, replacementName: e.replacementName })),
  };
}

// Congela el palmarés de la liga en la entrada de seasonHistory de la temporada que se está
// cerrando. El panel de estadísticas siempre muestra la temporada EN CURSO (se reinicia sola,
// porque sale del gf/pj de la tabla), así que sin esto no quedaría rastro de quién fue goleador
// en los años anteriores de la carrera.
function freezeSeasonLeadersIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (getSeasonYear(previousWeek) === getSeasonYear(newWeek)) return profile;
  const history = profile.seasonHistory ?? [];
  const last = history[history.length - 1];
  if (!last || last.leagueTopScorer) return profile; // sin temporada que cerrar, o ya congelada

  const club = CLUBS_DATABASE.find(c => c.id === last.clubId);
  if (!club) return profile;
  const leagueClubs = CLUBS_DATABASE.filter(c => c.league === club.league);
  const season = profile.leagueSeasons?.[leagueKeyFor(club)];
  if (!season?.table?.length) return profile;

  const leaders = generateLeagueLeadersFromTable(leagueClubs, season.table, profile.retiredWorldPlayers);
  // Si metiste más goles que el goleador simulado, el goleador sos vos: el jugador humano no
  // entra en el reparto de generateLeagueLeadersFromTable (que solo mira starPlayers).
  const meWon = leaders.topScorer != null && last.goles > leaders.topScorer.value;

  const updated: SeasonHistory = {
    ...last,
    leagueName: club.league,
    leagueTopScorer: meWon
      ? { name: profile.name, clubName: last.clubName, value: last.goles }
      : leaders.topScorer ?? undefined,
    leagueTopAssist: leaders.topAssist ?? undefined,
    wasLeagueTopScorer: meWon,
  };
  return { ...profile, seasonHistory: [...history.slice(0, -1), updated] };
}

/** División vigente de un club, con los ascensos/descensos ya aplicados encima de CLUBS_DATABASE. */
function divisionDeClub(profile: PlayerProfile): (c: Club) => 1 | 2 {
  return (c: Club) => (profile.divisionOverrides?.[c.id] ?? (c.division === 2 ? 2 : 1)) as 1 | 2;
}

/**
 * Cierre de año: guarda lo que sumó cada club y aplica ascensos y descensos.
 *
 * Solo en las ligas con reglamento cargado (ver promocionDescenso.ts). Cada una usa SU criterio:
 * Colombia baja 2 por promedio plurianual, Argentina 4 por la tabla del año, Holanda 2 por tabla
 * más un play-off por el 16°, Brasil 4 directos. Las demás ligas no se tocan.
 */
function applyPromotionRelegationIfNewSeason(
  profile: PlayerProfile, previousWeek: number, newWeek: number,
): PlayerProfile {
  if (getSeasonYear(previousWeek) === getSeasonYear(newWeek)) return profile;

  const anioCerrado = getSeasonYear(previousWeek);
  const divisionDe = (c: Club): 1 | 2 =>
    (profile.divisionOverrides?.[c.id] ?? (c.division === 2 ? 2 : 1));

  // 1. Anotar lo que sumó cada club en el año que termina, para la tabla de promedios.
  const historial = [...(profile.historialAnual ?? [])];
  for (const season of Object.values(profile.leagueSeasons ?? {})) {
    for (const fila of season.table ?? []) {
      const club = CLUBS_DATABASE.find(c => c.id === fila.clubId || c.name === fila.name);
      if (!club || !reglasDeLiga(club.league)) continue;
      if (historial.some(h => h.clubId === club.id && h.year === anioCerrado)) continue;
      historial.push({
        clubId: club.id, league: club.league, year: anioCerrado,
        puntos: fila.puntos, partidos: fila.pj,
        // Desempates: Brasil ordena por victorias, diferencia de gol y goles a favor.
        victorias: fila.g, golesFavor: fila.gf, golesContra: fila.gc,
      });
    }
  }
  if (historial.length === (profile.historialAnual?.length ?? 0)) return { ...profile, historialAnual: historial };

  // 2. Resolver los movimientos, liga por liga.
  const overrides: Record<string, 1 | 2> = { ...(profile.divisionOverrides ?? {}) };
  let ultimo: PlayerProfile['ultimoAscensoDescenso'];

  for (const league of [...new Set(CLUBS_DATABASE.map(c => c.league))]) {
    if (!reglasDeLiga(league)) continue;

    const primera = tablaDeDescenso(historial, league, anioCerrado, id =>
      CLUBS_DATABASE.find(c => c.id === id)?.name ?? '')
      .filter(f => divisionDe(CLUBS_DATABASE.find(c => c.id === f.clubId)!) === 1);

    // La segunda ordenada por lo que sumó ese año: los mejores son los que suben. Mismo desempate
    // que la tabla de descenso, para que la Serie B no ascienda por orden de inserción.
    const dg = (h: typeof historial[number]) => (h.golesFavor ?? 0) - (h.golesContra ?? 0);
    const segunda = historial
      .filter(h => h.league === league && h.year === anioCerrado)
      .map(h => ({ h, club: CLUBS_DATABASE.find(c => c.id === h.clubId)! }))
      .filter(x => x.club && divisionDe(x.club) === 2)
      .sort((a, b) =>
        b.h.puntos - a.h.puntos
        || (b.h.victorias ?? 0) - (a.h.victorias ?? 0)
        || dg(b.h) - dg(a.h)
        || (b.h.golesFavor ?? 0) - (a.h.golesFavor ?? 0))
      .map(x => ({ clubId: x.club.id, clubName: x.club.name }));

    // Llaves del play-off (solo Holanda). Pesa la reputación pero deja pasar la sorpresa: sin azar,
    // el 16° de Eredivisie nunca perdería la categoría contra un club de Segunda.
    const ganaLlave = (a: string, b: string): string => {
      const repDe = (id: string) => CLUBS_DATABASE.find(c => c.id === id)?.reputation ?? 1;
      const fa = repDe(a) + Math.random() * 3;
      const fb = repDe(b) + Math.random() * 3;
      return fa >= fb ? a : b;
    };

    const { descienden, ascienden } = resolverMovimientos(league, primera, segunda, ganaLlave);
    for (const d of descienden) overrides[d.clubId] = 2;
    for (const a of ascienden) overrides[a.clubId] = 1;

    // Se guarda el movimiento de TU liga, que es el que se cuenta en pantalla.
    const miClub = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
    if (miClub?.league === league && (descienden.length || ascienden.length)) {
      ultimo = {
        year: anioCerrado,
        descienden: descienden.map(d => ({ clubId: d.clubId, clubName: d.clubName, promedio: d.valor })),
        ascienden,
      };
    }
  }

  return { ...profile, historialAnual: historial, divisionOverrides: overrides, ultimoAscensoDescenso: ultimo ?? profile.ultimoAscensoDescenso };
}

function applySeasonTransitions(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  let next = freezeSeasonLeadersIfNewSeason(profile, previousWeek, newWeek);
  next = applyWorldRetirementsIfNewSeason(next, previousWeek, newWeek);
  next = applyAgingIfNewSeason(next, previousWeek, newWeek);
  next = applyCoachChangeIfNewSeason(next, previousWeek, newWeek);
  next = applyBreakoutSeasonIfNewSeason(next, previousWeek, newWeek);
  next = applyYearsAtClubIfNewSeason(next, previousWeek, newWeek);
  next = applyMentorshipIfNewSeason(next, previousWeek, newWeek);
  next = applyCountryDutyToll(next, previousWeek, newWeek);
  next = applyPromotionRelegationIfNewSeason(next, previousWeek, newWeek);
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

// True cuando hay que resolver algo con el retiro: o preguntarle al jugador si sigue (43-44) o
// cortarle la carrera sin preguntar (45+). Quién de los dos casos es, lo decide
// resolveRetirementCheckpoint.
function isPastRetirementAge(profile: PlayerProfile): boolean {
  return profile.age >= RETIREMENT_DECISION_AGE;
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

  // Las divisiones que cambiaron por ascenso/descenso se registran en el motor apenas cambia el
  // perfil. Va acá y no dentro de cada función porque leagueKeyFor lo consultan decenas de sitios,
  // y pasarles el perfil a todos sería reescribir medio motor.
  // useMemo y no useEffect: tiene que estar puesto ANTES del primer render que arme una tabla, o la
  // primera pantalla mostraría al descendido todavía en primera.
  React.useMemo(() => {
    setDivisionOverrides(playerProfile?.divisionOverrides);
  }, [playerProfile?.divisionOverrides]);
  const [shopItems, setShopItems] = useState<ShopItem[]>(INITIAL_LIFESTYLE_ITEMS);
  
  const [activeOpposition, setActiveOpposition] = useState('');
  const [activeOppositionClubId, setActiveOppositionClubId] = useState<string | null>(null);
  const [activeIsHome, setActiveIsHome] = useState(true);
  const [isCopaLibertadores, setIsCopaLibertadores] = useState(false);
  // Festejo a pantalla completa al salir campeón (ver ChampionOverlay). Se muestra al volver del
  // resumen de post-partido, para no tapar el resultado que lo causó.
  const [championInfo, setChampionInfo] = useState<ChampionInfo | null>(null);
  const [activeCupId, setActiveCupId] = useState<'libertadores' | 'sudamericana' | null>(null);
  const [activeUefaCupId, setActiveUefaCupId] = useState<'champions' | 'europa' | null>(null);
  // Semana de copa en la que el club no juega ninguna copa continental: se rotula como copa
  // nacional (Copa del Rey, FA Cup, etc.) en vez de caer al cartel de Libertadores.
  const [activeDomesticCup, setActiveDomesticCup] = useState(false);
  // Nombre exacto del torneo cuando el partido sale del calendario real. Hace falta porque un país
  // tiene varias copas nacionales -- Colombia juega Copa Colombia Y Superliga -- y el booleano
  // activeDomesticCup no alcanza para distinguirlas: rotulaba "Copa Colombia" la Superliga.
  const [activeCompetitionName, setActiveCompetitionName] = useState<string | null>(null);
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
  //
  // Cada aviso lleva un id propio porque el TEXTO no sirve como identidad: dos avisos iguales
  // seguidos ("esta semana no hay partido de copa", el de fatiga) compartían key, React reutilizaba
  // el mismo NoticeToast en vez de remontarlo, y su temporizador de auto-cierre -- que depende de
  // `message` -- no se volvía a disparar. El toast quedaba colgado para siempre, y como es un div
  // `fixed top-4 right-4` de 384px de ancho, tapaba justo los botones x2/x4/Saltar: se veían pero
  // no recibían el clic. Recargar la página lo arreglaba porque vaciaba la cola.
  const [noticeQueue, setNoticeQueue] = useState<{ id: number; message: string }[]>([]);
  const nextNoticeId = useRef(0);
  const notify = (message: string) =>
    setNoticeQueue(prev => [...prev, { id: ++nextNoticeId.current, message }]);

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
  // Sube uno por partido y va como `key` de MatchSimulator, para que cada partido monte de cero.
  const [matchInstance, setMatchInstance] = useState(0);

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
    // El ahijado se guardaba sin revalidar: una partida creada antes de que existieran las edades
    // reales podía tener elegido a un veterano (reporte real: Luis Fernando Muriel, 35 años, como
    // "joven promesa" en Junior) y ese valor sobrevivía para siempre a cualquier arreglo posterior.
    // Acá se vuelve a chequear contra la edad actual y se limpia si ya no corresponde.
    if (profile.mentorshipPlayerName) {
      const edad = getSquadPlayerAge(profile.currentClubId, profile.mentorshipPlayerName, getSeasonYear(profile.currentWeek) - CAREER_START_YEAR);
      if (edad > MENTEE_MAX_AGE) {
        profile = { ...profile, mentorshipPlayerName: null };
      }
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
    // Última barrera: la UI ya filtra por edad, pero esto garantiza que ningún camino (un save
    // manipulado, un plantel que cambió entre render y click) pueda dejar a un veterano de ahijado.
    if (playerName && getSquadPlayerAge(playerProfile.currentClubId, playerName, getSeasonYear(playerProfile.currentWeek) - CAREER_START_YEAR) > MENTEE_MAX_AGE) {
      notify('Ese jugador ya no es un juvenil: la mentoría es solo para promesas del plantel.');
      return;
    }
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

    // Si el club tiene calendario REAL (src/realCalendar.ts), es él quien decide si esta semana toca
    // copa o liga, en vez del reparto aritmético isCupWeek(). Esa es la diferencia de fondo: antes
    // todas las copas compartían un cupo global de semanas y por eso Champions/Europa necesitaban
    // 22 pasos con 17 disponibles, quedando desfasadas 1,3 temporadas. Con las fechas reales cada
    // torneo ocupa las suyas -- la Champions se juega entre semana, sin quitarle fechas a la liga.
    //
    // Los clubes sin calendario real (los 606 de la bolsa "Internacional") siguen con isCupWeek.
    const myClubForSchedule = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);

    // Calendario por FECHAS reales: cada paso de carrera es un día con partido, no una semana.
    // Es lo que permite jugar liga el domingo y copa el jueves de la misma semana -- con el modelo
    // por semanas uno de los dos se perdía, y así se caía el 26,3% de los partidos (265 de 1008).
    // Los clubes que todavía no tienen fechas cargadas siguen con el calendario semanal de abajo.
    // hasDatedLeagueSchedule y no hasDatedSchedule: un club de Segunda con solo 2 fechas sueltas de
    // Copa BetPlay (sin ninguna fecha de LIGA real) no puede tratarse como "tiene calendario real" --
    // eso hacía que fixturesAtStep(club, 1) devolviera esa Copa BetPlay de julio como si fuera el
    // primer paso de la carrera entera, y el jugador arrancaba en julio jugando contra Junior en vez
    // de arrancar en enero con la liga. Bug reportado: "por que inicia la carrera alli y no en
    // enero?" + "junior me elimino" (era rival de un partido que ni siquiera correspondía todavía).
    const tieneFechasReales = !!myClubForSchedule && hasDatedLeagueSchedule(myClubForSchedule.name);
    const datedStep = tieneFechasReales && !inWorldCupBreak
      ? fixturesAtStep(myClubForSchedule!.name, playerProfile.currentWeek)
      : null;
    const datedPrimary = datedStep ? pickDatedPrimary(datedStep.fixtures) : null;

    // El calendario real cubre UNA temporada (el Junior tiene 54 partidos, hasta noviembre de 2026).
    // Cuando se agota hay que volver al motor semanal, o la carrera se queda sin partidos para
    // siempre: al simular una carrera completa, a partir de diciembre de 2026 no volvía a jugar
    // nunca y el jugador nunca llegaba al retiro. `usaFechasReales` mira el PASO ACTUAL, no si el
    // club tiene calendario, justamente para que el agotamiento devuelva el control al motor.
    const usaFechasReales = tieneFechasReales && !!datedStep;

    const realWeekMatches = !inWorldCupBreak && myClubForSchedule && !usaFechasReales
      ? matchesThisWeek(myClubForSchedule.name, playerProfile.currentWeek)
      : [];

    // Los dos calendarios exponen la misma forma ({ opponentName, isHome, competition }), así que
    // de acá para abajo el código no distingue de cuál vino el partido: solo cambia la fuente.
    const realPrimary = datedPrimary ?? pickPrimary(realWeekMatches);
    const usaCalendarioReal = !!myClubForSchedule && (usaFechasReales || hasRealSchedule(myClubForSchedule.name));

    // ¿Tu club está jugando una copa continental que el motor sí modela? El calendario importado
    // solo trae 36 clubes en Libertadores y no incluye a varios que el motor sí clasifica (Junior
    // entre ellos), así que preguntarle únicamente a realPrimary dejaba a esos clubes sin copa: en
    // las 13 semanas de copa del año el calendario devolvía un partido de liga y el jugador salía a
    // jugar Dimayor cuando le tocaba Libertadores.
    const clubEnCopaContinental = (() => {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
      if (!myClub) return false;
      // Con calendario propio, sus copas son las del calendario: el motor no le agrega ninguna.
      if (usaFechasReales) return false;
      return getLibertadoresParticipants(CLUBS_DATABASE).includes(myClub.id)
        || getSudamericanaParticipants(CLUBS_DATABASE).includes(myClub.id)
        || getChampionsParticipants(CLUBS_DATABASE).includes(myClub.id)
        || getEuropaParticipants(CLUBS_DATABASE).includes(myClub.id);
    })();

    const isCup = !inWorldCupBreak && (
      usaCalendarioReal
        ? realPrimary?.competition.kind === 'continental_cup'
          || realPrimary?.competition.kind === 'domestic_cup'
          // El calendario no cubre la copa de este club: manda el reparto del motor, que es el que
          // de verdad lleva su llave (ver getOrCreateCupState más abajo). Con fechas reales esto no
          // hace falta -- el partido de hoy ya dice de qué torneo es -- así que solo aplica al
          // calendario semanal.
          || (!datedPrimary && clubEnCopaContinental && isCupWeek(playerProfile.currentWeek))
        : isCupWeek(playerProfile.currentWeek)
    );
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
        setActiveCompetitionName(null);
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
    } else if (
      isCup && usaCalendarioReal && realPrimary
      // El partido real tiene que ser DE COPA. Sin este chequeo, un club que juega copa según el
      // motor pero no figura en el calendario de esa copa (Junior en Libertadores) entraba acá con
      // un partido de liga y lo jugaba rotulado como copa.
      && (realPrimary.competition.kind === 'continental_cup' || realPrimary.competition.kind === 'domestic_cup')
    ) {
      // Partido de copa tomado del calendario REAL: rival, ronda y torneo salen de las fechas de
      // Transfermarkt, no de un sorteo generado. El estado interno de la copa (tabla, bracket) lo
      // sigue llevando el motor -- esto solo decide QUÉ se juega esta semana.
      // Hay nombres duplicados entre países ("Athletic Club" existe en Brasil y en España), así que
      // en una copa NACIONAL se busca primero dentro de la liga del club: un find() global devuelve
      // el primero que coincida y puede traer el club del país equivocado.
      const myClubForCup = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
      const rival = resolverClubDeCalendario(
        CLUBS_DATABASE,
        realPrimary.opponentName,
        // En una copa nacional el rival es del mismo país que vos.
        realPrimary.competition.league ?? (realPrimary.competition.kind === 'domestic_cup' ? myClubForCup?.league : undefined),
        realPrimary.competition.kind,
        realPrimary.competition.name,
      );
      opName = rival?.name ?? realPrimary.opponentName;
      opClubId = rival?.id ?? null;
      isHomeThisMatch = realPrimary.isHome;

      const esContinental = realPrimary.competition.kind === 'continental_cup';
      const nombre = realPrimary.competition.name;
      setActiveCupId(esContinental && /Libertadores/i.test(nombre) ? 'libertadores'
        : esContinental && /Sudamericana/i.test(nombre) ? 'sudamericana' : null);
      setActiveUefaCupId(esContinental && /Champions/i.test(nombre) ? 'champions'
        : esContinental && /Europa/i.test(nombre) ? 'europa' : null);
      setActiveDomesticCup(!esContinental);
      setActiveCompetitionName(nombre);
      setActiveMyTablePosition(null);
      setActiveRivalTablePosition(null);
      setActiveLeagueTeamCount(null);
    } else if (isCup && !usaFechasReales) {
      // Con calendario propio esta rama NO corre: arma la copa por clasificación del motor,
      // ignorando lo que dice el calendario. Ahí nacía el cruce -- ibas a jugar Libertadores según
      // tus fechas reales y el motor te montaba su propia llave, o al revés: te mandaba a la vuelta
      // de la Superliga cuando tocaba Libertadores. La rama de arriba ya resolvió el partido con la
      // fecha real; ésta es solo para los clubes sin fechas cargadas.
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

        // COPA NACIONAL con cuadro de verdad (ver copaNacional.ts).
        //
        // Antes acá se sorteaba un rival del país AL AZAR cada semana: no había llave que avanzar,
        // ganar no te pasaba de ronda, perder no te eliminaba, podías repetir rival dos semanas
        // seguidas y el torneo no coronaba a nadie. Era un generador de amistosos con el cartel de
        // la copa encima.
        //
        // Ahora es un cuadro de eliminación directa entre los 36 clubes del país (Primera y
        // Segunda), a ida y vuelta, que arranca en dieciseisavos y termina con un campeón.
        const cupKey = myClubForCup ? `${myClubForCup.league}-${year}` : null;
        let cupCruce: ReturnType<typeof cruceActual> = null;
        if (myClubForCup && cupKey) {
          const cup = playerProfile.domesticCups?.[cupKey]
            ?? crearCopaNacional(myClubForCup.league, year, CLUBS_DATABASE, divisionDeClub(playerProfile));
          if (!playerProfile.domesticCups?.[cupKey]) {
            setPlayerProfile(prev => prev && ({ ...prev, domesticCups: { ...(prev.domesticCups ?? {}), [cupKey]: cup } }));
          }
          cupCruce = sigueEnCopa(cup, myClubForCup.id) ? cruceActual(cup, myClubForCup.id) : null;
          if (cupCruce) {
            const rivalId = cupCruce.clubAId === myClubForCup.id ? cupCruce.clubBId : cupCruce.clubAId;
            const rivalCup = CLUBS_DATABASE.find(c => c.id === rivalId);
            if (rivalCup) {
              opName = rivalCup.name;
              opClubId = rivalCup.id;
              // En la ida es local el clubA; en la vuelta se invierte.
              const esIda = piernaDelCruce(cupCruce) === 'ida';
              isHomeThisMatch = esIda
                ? cupCruce.clubAId === myClubForCup.id
                : cupCruce.clubBId === myClubForCup.id;
              setActiveCompetitionName(`${nombreCopaNacional(myClubForCup.league)} · ${rondaActual(cup)} (${esIda ? 'Ida' : 'Vuelta'})`);
            }
          }
        }

        // Sin cruce (ya eliminado, o liga sin copa modelada): rival suelto del país, como antes.
        // Ojo: "ya eliminado de la copa nacional real" (había cupKey, pero sigueEnCopa dio false) NO
        // es lo mismo que "liga sin copa modelada" (nunca hubo cupKey). En el primer caso el partido
        // de relleno seguía rotulándose con el nombre de la copa nacional (isDomesticCup en true sin
        // condición) -- salía "Copa Colombia" para un partido que en realidad ya no es de la Copa
        // Colombia, porque quedaste eliminado. Bug reportado: "toda la interfaz aunque me eliminen
        // dice copa colombia".
        const yaEliminadoDeLaCopa = !!(myClubForCup && cupKey) && !cupCruce;
        if (!opClubId) {
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
          // Eliminado de la copa nacional real: este partido ya no es de esa copa, así que no puede
          // llevar su cartel. Rótulo honesto en vez de "Copa Nacional" genérica (que seguía sonando
          // a torneo real) o el nombre de la copa de la que ya saliste.
          setActiveCompetitionName(yaEliminadoDeLaCopa ? 'Partido Amistoso' : null);
        }
        setActiveDomesticCup(!yaEliminadoDeLaCopa);
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
      setActiveCompetitionName(null);
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const leagueKey = leagueKeyFor(myClub);
      const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey);
      const season = playerProfile.leagueSeasons[leagueKey] ?? getOrCreateSeasonForLeague(leagueClubs, undefined, playerProfile.currentWeek);
      const upcoming = getUpcomingMatchForLeague(season, leagueClubs, playerProfile.currentWeek, myClub.id);

      // Sanción disciplinaria pendiente (ver handleFinishMatch/handleResolveEvent): la liga
      // doméstica no espera, tu club juega igual pero simulado sin vos, sin pantalla de partido.
      // Las copas continentales/selección NO se ven afectadas por esta sanción (criterio real:
      // una sanción de liga doméstica no se traslada automáticamente a otra competencia).
      if (playerProfile.suspendedMatches > 0) {
        // Antes esto exigía `upcoming`: en las semanas en que el motor no le encuentra rival a tu
        // club (fecha libre por zona impar, o el fixture ya agotado) la sanción no bajaba, la liga
        // no avanzaba y la semana se perdía. Con 6 fechas de sanción la tabla quedaba congelada
        // -- el bug de "la tabla se quedó en 7 partidos jugados".
        //
        // Ahora se cumple igual: si hay rival se juega el partido simulado, y si no lo hay solo se
        // descuenta la fecha de sanción y el calendario sigue corriendo.
        const opponentClub = upcoming ? leagueClubs.find(c => c.id === upcoming.opponentId) : undefined;
        if (upcoming && opponentClub) {
          resolveSuspendedLeagueWeek(myClub, leagueKey, leagueClubs, season, upcoming.isHome, opponentClub);
        } else {
          advanceSuspendedIdleWeek(myClub, leagueKey, leagueClubs, season);
        }
        return;
      }

      if (upcoming) {
        const opponentClub = leagueClubs.find(c => c.id === upcoming.opponentId);
        opName = opponentClub?.name || OPPONENT_CLUBS_POOL[Math.floor(Math.random() * OPPONENT_CLUBS_POOL.length)];
        opClubId = upcoming.opponentId;
        isHomeThisMatch = upcoming.isHome;

        // Con calendario real, el rival y la localía salen de la fecha de Transfermarkt. La TABLA
        // la sigue llevando el motor (necesita simular los otros 19 partidos de la jornada), así
        // que solo se pisa el rival puntual del jugador, no el estado de la liga.
        if (usaCalendarioReal && realPrimary?.competition.kind === 'league') {
          // Se busca dentro de leagueClubs (la propia liga) y no en toda la base: hay nombres
          // duplicados entre países -- "Athletic Club" existe en Brasil y en España -- y un
          // find() global devolvía el primero, metiendo un club brasileño en LaLiga.
          const rivalReal = resolverClubDeCalendario(
            leagueClubs, realPrimary.opponentName, myClub.league, 'league', realPrimary.competition.name);
          if (rivalReal) {
            opName = rivalReal.name;
            opClubId = rivalReal.id;
            isHomeThisMatch = realPrimary.isHome;
          }
        }

        // La posición se busca por opClubId y no por upcoming.opponentId: con calendario real el
        // rival lo pisa realPrimary unas líneas más arriba, y usar el del motor mostraba en pantalla
        // la posición de un club contra el que no ibas a jugar.
        const sortedTable = sortTable(season.table);
        const myPos = sortedTable.findIndex(row => row.clubId === myClub.id);
        const rivalPos = sortedTable.findIndex(row => row.clubId === opClubId);
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

    // Identifica ESTE partido para el `key` de MatchSimulator: sin él React reutiliza la instancia
    // anterior cuando dos partidos seguidos entran por acá, y el simulador conserva su estado --
    // entre otras cosas `minute`, que si quedó en 90 hace que el reloj salga sin agendar nada. El
    // partido nuevo arrancaba muerto: los botones x2/x4/Saltar cambiaban de color pero no había
    // reloj que acelerar. Con el contador cada partido monta limpio.
    setMatchInstance(n => n + 1);
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

  // Semana de sanción en la que tu club NO tiene partido de liga (fecha libre por zona impar, o el
  // fixture de la fecha ya agotado). No hay resultado que resolver, pero la semana tiene que correr
  // igual: se descuenta la fecha de sanción y las demás ligas y copas avanzan de fondo. Sin esto la
  // semana quedaba en el aire y la tabla se congelaba mientras durase la sanción.
  const advanceSuspendedIdleWeek = (
    myClub: Club,
    leagueKey: string,
    leagueClubs: Club[],
    season: ReturnType<typeof getOrCreateSeasonForLeague>
  ) => {
    if (!playerProfile) return;

    // La liga propia igual se pone al día: el resto de los clubes juega su fecha aunque vos no.
    const updatedLeagueSeasons = { ...playerProfile.leagueSeasons, [leagueKey]: season };
    for (const key of Object.keys(updatedLeagueSeasons)) {
      const otherLeagueClubs = key === leagueKey ? leagueClubs : CLUBS_DATABASE.filter(c => leagueKeyFor(c) === key);
      if (otherLeagueClubs.length === 0) continue;
      updatedLeagueSeasons[key] = getOrCreateSeasonForLeague(otherLeagueClubs, updatedLeagueSeasons[key], playerProfile.currentWeek + 1);
    }

    const activePassiveDividend = shopItems.filter(i => i.purchased).reduce((sum, i) => sum + (i.effect.passiveIncome || 0), 0);
    const sync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false);

    const updated: PlayerProfile = {
      ...playerProfile,
      energy: Math.min(100, playerProfile.energy + 15),
      capital: playerProfile.capital + myClub.initialSalary + activePassiveDividend,
      currentWeek: playerProfile.currentWeek + 1,
      suspendedMatches: playerProfile.suspendedMatches - 1,
      matchesWithoutRest: 0,
      leagueSeasons: updatedLeagueSeasons,
      continentalCups: sync.continentalCups,
      uefaCups: sync.uefaCups,
    };

    const aged = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);
    if (isPastRetirementAge(aged)) {
      resolveRetirementCheckpoint(aged);
      return;
    }

    setPlayerProfile(aged);
    saveGameState(aged, shopItems);
    notify(`🚫 Fecha libre de ${myClub.name}: cumpliste una fecha de sanción sin jugar.${aged.suspendedMatches > 0 ? ` Te quedan ${aged.suspendedMatches} partido(s).` : ' Ya podés volver a jugar.'}`);
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
    // El campeonato NO lo informa el MatchSimulator (nunca manda ese campo): se
    // deduce de la tabla al terminar la temporada, mas abajo, cuando ya se
    // resolvio la fecha. Sin esto careerStats.campeonatos quedaba siempre en 0 y
    // el historial de carrera nunca mostraba un titulo.
    let salioCampeon = false;

    // Si tu partido de esta semana fue de eliminación directa y terminó igualado, alguna de las
    // 4 ramas de abajo va a dejar una tanda de penales guardada en el bracket/llave correspondiente.
    // La detectamos acá para poder narrarla en pantalla antes de seguir al resumen post-partido.
    let foundShootout: PenaltyShootoutResult | null = null;
    let foundShootoutMyId = '';
    let foundShootoutMyName = '';
    // Títulos ganados en este partido, para sumarlos al palmarés del perfil (ver cupTitles).
    let cupTitleWon: CupTitle | null = null;
    let leagueTitleWon: CupTitle | null = null;
    // Resultado del partido de hoy anclado a su fecha real (ver DatedResult): es la única forma de
    // recuperar después el marcador de un partido de copa, que no queda en ninguna tabla del motor.
    let datedResultToday: DatedResult | null = null;

    // Campeón de una copa del calendario real (Superliga, Copa Colombia, Libertadores...).
    //
    // Estas copas no tienen bracket en el motor -- sus cruces salen del calendario importado -- así
    // que nadie las coronaba: se ganaba la final y no pasaba nada, ni festejo ni trofeo en la
    // vitrina. El criterio es directo: si éste era tu último partido de esa copa y lo ganaste, sos
    // campeón. Con ida y vuelta solo cuenta la vuelta, que es donde se define.
    (() => {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
      if (!myClub || !hasDatedLeagueSchedule(myClub.name)) return;
      const paso = fixturesAtStep(myClub.name, playerProfile.currentWeek);
      if (!paso) return;
      const fx = pickDatedPrimary(paso.fixtures);
      if (!fx) return;

      // El marcador se anota para TODO partido del calendario real, gane o pierda: es lo que el
      // calendario lee después para mostrar el resultado.
      datedResultToday = {
        date: paso.date,
        competition: fx.competition.name,
        opponentName: fx.opponentName,
        myGoals: results.golesMiEquipo,
        rivalGoals: results.golesRival,
      };

      if (fx.competition.kind === 'league') return;
      if (!esUltimoPartidoDeLaCopa(myClub.name, fx.competition.id, paso.date)) return;

      // La final se gana por el GLOBAL de la llave, no por el partido de vuelta. Mirando solo la
      // vuelta, ganar la ida 2-0 y empatar la vuelta no coronaba a nadie (reportado tal cual).
      //
      // Los partidos de ida salen de datedResults, que guarda el marcador de cada fecha jugada --
      // incluidas las que el club resolvió sin vos, como cuando no jugás por fatiga.
      const idasDeLaLlave = partidosDeLaMismaLlave(myClub.name, fx.competition.id, paso.date);
      const previos = (playerProfile.datedResults ?? [])
        .filter(r => r.competition === fx.competition.name && idasDeLaLlave.includes(r.date));
      const globalMio = results.golesMiEquipo + previos.reduce((n, r) => n + r.myGoals, 0);
      const globalRival = results.golesRival + previos.reduce((n, r) => n + r.rivalGoals, 0);
      if (globalMio < globalRival) return;

      // Empate en el global (ida y vuelta ambas igualadas, o compensadas entre sí): se define por
      // penales, igual que cualquier otra llave del juego. Antes acá simplemente no coronaba a
      // nadie -- "se resuelve a favor del que ganó al menos uno de los dos partidos, y si ninguno,
      // no corona" -- y un global 1-1 (0-0 de ida, 1-1 de vuelta) dejaba la Superliga sin campeón.
      // Bug reportado: "aqui quedo empatadoe el global y no hubo desempate".
      if (globalMio === globalRival) {
        if (shootoutOverride) {
          // Segunda pasada: ya jugaste la tanda en vivo (ver handleContinueFromShootout). Este
          // resultado real es el que decide, no una simulación de fondo.
          if (shootoutOverride.winnerId !== myClub.id) return;
        } else {
          // Primera pasada: solo señalizamos que hay que pausar y mostrar InteractivePenaltyShootout
          // (ver el bloque `if (foundShootout && !shootoutOverride)` más abajo). Ese componente juega
          // su propia tanda con placeholders 'mine'/'rival' -- lo que se simule acá no se usa para
          // nada más que activar la pausa, así que no hace falta un club real, cualquier resultado
          // no-null sirve de señal.
          const rivalClub = CLUBS_DATABASE.find(c => c.id === activeOppositionClubId);
          if (!rivalClub) return;
          foundShootout = simulatePenaltyShootout(myClub, rivalClub);
          foundShootoutMyId = myClub.id;
          foundShootoutMyName = myClub.name;
          return;
        }
      }

      salioCampeon = true;
      // El año sale de la FECHA del partido, no del contador de semanas: con calendario real un
      // paso es una fecha, no una semana, y a partir del paso 53 getSeasonYear ya creía que era el
      // año siguiente (ver anioDelPaso).
      const anioCopa = Number(paso.date.slice(0, 4));
      setChampionInfo({
        competition: fx.competition.name,
        clubName: myClub.name,
        season: String(anioCopa),
        badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
      });
      cupTitleWon = {
        competition: fx.competition.name,
        year: anioCopa,
        clubId: myClub.id,
        tipo: 'copa',
      };
    })();

    // Copa nacional: si el partido de hoy era de su cuadro, se resuelve la pierna con TU resultado
    // y el resto de las llaves se simulan. Al completarse la ronda, el motor encadena la siguiente
    // hasta la final (ver resolverPasoCopaNacional).
    let updatedDomesticCups = playerProfile.domesticCups;
    (() => {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
      if (!myClub || !activeDomesticCup || !activeOppositionClubId) return;
      const cupKey = `${myClub.league}-${getSeasonYear(playerProfile.currentWeek)}`;
      const cup = playerProfile.domesticCups?.[cupKey];
      if (!cup || cup.championId) return;
      const tie = cruceActual(cup, myClub.id);
      // Solo si el rival de hoy es el de su llave: en las semanas sin cruce el partido es un
      // amistoso doméstico y no debe mover el cuadro.
      if (!tie || (tie.clubAId !== activeOppositionClubId && tie.clubBId !== activeOppositionClubId)) return;

      const resuelta = resolverPasoCopaNacional(cup, CLUBS_DATABASE, {
        clubId: myClub.id,
        isHome: activeIsHome,
        goals: results.golesMiEquipo,
        opponentGoals: results.golesRival,
      });
      updatedDomesticCups = { ...(playerProfile.domesticCups ?? {}), [cupKey]: resuelta };

      if (resuelta.championId === myClub.id) {
        salioCampeon = true;
        const anio = CAREER_START_YEAR + getSeasonYear(playerProfile.currentWeek) - 1;
        setChampionInfo({
          competition: nombreCopaNacional(myClub.league),
          clubName: myClub.name,
          season: String(anio),
          badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
        });
        cupTitleWon = {
          competition: nombreCopaNacional(myClub.league),
          year: anio,
          clubId: myClub.id,
          tipo: 'copa',
        };
      }
    })();

    let updatedLeagueSeasons = playerProfile.leagueSeasons;
    if (!isCopaLibertadores && activeOppositionClubId) {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const usaFechasRealesParaMiClub = hasDatedLeagueSchedule(myClub.name);
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

      // ¿Cerró el torneo y quedaste primero?
      //
      // El cierre lo manda el CALENDARIO REAL cuando el club tiene uno, no el fixture del motor:
      // son calendarios distintos y el del motor es más corto (20 partidos contra los 44 reales del
      // Nacional), así que `fixtures` todavía tenía partidos pendientes cuando el Apertura real ya
      // había terminado y no se coronaba a nadie. Además el motor lleva UNA temporada por año y en
      // Colombia/Argentina hay dos campeones, uno por semestre.
      // El calendario real solo manda si HOY jugaste liga por él. Un club de Segunda como el
      // Barranquilla tiene calendario (2 partidos de Copa BetPlay) pero ninguna fecha de liga: su
      // torneo lo lleva entero el motor. Preguntándole al calendario, esUltimaFechaDelTorneo miraba
      // fechas de liga que no existen, devolvía false siempre y el club nunca salía campeón de la
      // Primera B -- 0 cierres de torneo en toda la carrera.
      const pasoHoy = usaFechasRealesParaMiClub ? fixturesAtStep(myClub.name, playerProfile.currentWeek) : null;
      const hoyJuegoLigaPorCalendario = !!pasoHoy && pasoHoy.fixtures.some(f => f.competition.kind === 'league');
      const cerroElTorneo = hoyJuegoLigaPorCalendario
        ? esUltimaFechaDelTorneo(myClub.name, pasoHoy!.date)
        : !resolvedSeason.fixtures.some(
            f => !f.played && (f.homeTeamId === myClub.id || f.awayTeamId === myClub.id));

      if (cerroElTorneo && resolvedSeason.table.length > 0) {
        const lider = sortTable([...resolvedSeason.table])[0];
        if (lider && (lider.clubId === myClub.id || lider.name === myClub.name)) {
          salioCampeon = true;
          // En Colombia y Argentina el título es del semestre, no del año: el rótulo tiene que
          // decir cuál de los dos torneos ganaste o parecería que se repite el mismo campeonato.
          // Con calendario real el semestre sale de la FECHA del partido, que es la que de verdad
          // dice si cerraste el Apertura (junio) o el Clausura (noviembre).
          const formato = isApeturaClausuraLeague(myClub.league);
          // Con calendario real el año sale de la fecha del partido: el contador de semanas se
          // adelantaba y el Clausura jugado en noviembre de 2026 se anotaba como 2027.
          const anio = hoyJuegoLigaPorCalendario
            ? Number(pasoHoy!.date.slice(0, 4))
            : CAREER_START_YEAR + getSeasonYear(playerProfile.currentWeek) - 1;
          const semestreReal = hoyJuegoLigaPorCalendario
            ? torneoDelClubEnFecha(myClub.name, pasoHoy!.date)
            : null;
          const semestre = semestreReal ?? (resolvedSeason.semester === 2 ? 'Clausura' : 'Apertura');
          const torneo = formato ? `${semestre} ${anio}` : `Temporada ${anio}`;
          setChampionInfo({
            competition: getLeagueDisplay(myClub.league).name,
            clubName: myClub.name,
            season: torneo,
            badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
          });
          // El título se ANOTA en el perfil, no se deduce después de la tabla: la vitrina se
          // recalcula desde el estado actual y al empezar el Clausura la temporada se reinicia, así
          // que el Apertura ganado desaparecía. Anotado acá queda para siempre.
          leagueTitleWon = {
            competition: getLeagueDisplay(myClub.league).name,
            year: anio,
            clubId: myClub.id,
            torneo: formato ? semestre : undefined,
            tipo: 'liga',
          };
        }
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
          salioCampeon
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
      domesticCups: updatedDomesticCups,
      // Copas y ligas van a la misma lista: todo campeonato ganado queda anotado en la vitrina.
      // El filtro por id evita duplicar si se rejuega el mismo paso.
      cupTitles: (() => {
        const nuevos = [cupTitleWon, leagueTitleWon].filter(Boolean) as CupTitle[];
        if (!nuevos.length) return playerProfile.cupTitles;
        const yaEstan = playerProfile.cupTitles ?? [];
        const clave = (t: CupTitle) => `${t.competition}|${t.year}|${t.torneo ?? ''}`;
        const vistos = new Set(yaEstan.map(clave));
        return [...yaEstan, ...nuevos.filter(t => !vistos.has(clave(t)))];
      })(),
      // Se reemplaza el de la misma fecha si ya existía, para que rejugar un paso no duplique.
      datedResults: datedResultToday
        ? [...(playerProfile.datedResults ?? []).filter(r => r.date !== datedResultToday!.date), datedResultToday]
        : playerProfile.datedResults,
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
        campeonatos: playerProfile.careerStats.campeonatos + (salioCampeon ? 1 : 0),
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

  // Punto único donde se resuelve isPastRetirementAge(profile) === true.
  //
  // A los RETIREMENT_MAX_AGE la carrera se termina, sin preguntar. Antes de eso (43-44) la decisión
  // es del jugador y se le vuelve a ofrecer cada temporada: puede colgar los botines cuando quiera
  // o estirar hasta el límite. Si además nunca usó el retiro escalonado y hay a dónde bajar, se le
  // ofrece primero ese camino -- seguir jugando pero en un club más chico.
  const resolveRetirementCheckpoint = (profile: PlayerProfile, updatedShopItems: ShopItem[] = shopItems) => {
    if (profile.age >= RETIREMENT_MAX_AGE) {
      triggerForcedRetirement(profile);
      return;
    }

    const anosRestantes = RETIREMENT_MAX_AGE - profile.age;
    const clubName = CLUBS_DATABASE.find(c => c.id === profile.currentClubId)?.name || 'tu club';

    // Seguir en el mismo club es la opción por defecto; el jugador tiene que elegir retirarse.
    const quiereRetirarse = confirm(
      `Tenés ${profile.age} años y el cuerpo ya te pasa factura. Podés colgar los botines ahora, con la carrera todavía fresca en la memoria de la gente, o aguantar ${anosRestantes} ${anosRestantes === 1 ? 'año más' : 'años más'} hasta el retiro definitivo a los ${RETIREMENT_MAX_AGE}.\n\n¿Te retirás ahora?\n\nAceptar = me retiro    ·    Cancelar = sigo jugando`
    );

    if (quiereRetirarse) {
      triggerForcedRetirement(profile);
      return;
    }

    // Sigue jugando. Si nunca bajó de categoría y hay un club menor disponible, se le ofrece --
    // es la forma realista de estirar la carrera cuando ya no rendís para la elite.
    if (!profile.hasSteppedDownRetirement) {
      const stepDownClub = findStepDownClub(profile);
      if (stepDownClub && confirm(
        `Seguís. Pero a los ${profile.age} en ${clubName} vas a pelear cada minuto.\n\n¿Querés bajar a ${stepDownClub.name}, donde vas a jugar seguido aunque haya menos luces?\n\nAceptar = bajo de categoría    ·    Cancelar = me quedo`
      )) {
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
        notify(`🔻 Bajaste de categoría a ${stepDownClub.name} para seguir compitiendo. Menos luces, pero seguís en la cancha.`);
        return;
      }
    }

    // Se queda donde está, un año más.
    setPlayerProfile(profile);
    setShopItems(updatedShopItems);
    saveGameState(profile, updatedShopItems);
    setScreen('dashboard');
    notify(`💪 Seguís en ${clubName}. A los ${profile.age} años, cada partido es un regalo.`);
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
          key={noticeQueue[0].id}
          message={noticeQueue[0].message}
          onDone={() => setNoticeQueue(prev => prev.slice(1))}
        />
      )}

      {/* Festejo de campeón. Se muestra recién en el dashboard: si apareciera sobre el resumen de
          post-partido taparía el resultado que acaba de coronar al equipo. */}
      {championInfo && screen === 'dashboard' && playerProfile && (
        <ChampionOverlay
          info={championInfo}
          playerName={playerProfile.name}
          onClose={() => setChampionInfo(null)}
        />
      )}

      {/* Fuera de los bloques por pantalla a propósito: montado una sola vez acá, el iframe
          sobrevive los cambios de pantalla y la canción no se corta al entrar a un partido.
          Se esconde en welcome/setup para no competir con el arranque del juego. */}
      <MusicPlayer hidden={screen === 'welcome' || screen === 'setup'} />

      {/* Ajustes de sonido siempre a mano: sirve para silenciar el juego sin abrir el reproductor
          de música. Comparte estado con él (todo vive en audio.ts). */}
      <SoundSettings hidden={screen === 'welcome' || screen === 'setup'} />

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
          key={matchInstance}
          playerProfile={playerProfile}
          opponentName={activeOpposition}
          opponentClubId={activeOppositionClubId}
          isLibertadores={isCopaLibertadores}
          cupId={activeCupId}
          uefaCupId={activeUefaCupId}
          isDomesticCup={activeDomesticCup}
          competitionNameOverride={activeCompetitionName}
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