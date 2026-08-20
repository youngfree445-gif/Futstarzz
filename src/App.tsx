import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { PlayerProfile, ShopItem, PlayerStats, Position, Club, PenaltyShootoutResult, PlayoffBracket, TwoLegBracket, TwoLegTie, SeasonHistory, Achievement, DatedResult, CupTitle, InjuryType, ActiveInjury, Agent } from './types';
import {
  INITIAL_LIFESTYLE_ITEMS, LOBBY_RANDOM_EVENTS, OPPONENT_CLUBS_POOL, ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE,
  WORLD_CUP_TEAMS_DATABASE, ALL_NATIONAL_TEAMS_DATABASE, NATIONALITY_TO_WORLD_CUP_TEAM_ID, MAX_ACTIVE_SPONSORSHIPS, ACHIEVEMENTS_DATABASE, ROLES_DATABASE,
  AGENTS_DATABASE, INVESTMENTS_DATABASE, getClubWithRoster } from './data';
import {
  CONFEDERACION_POR_SELECCION, crearEliminatoria, esJugable, ponerAlDiaLaEliminatoria,
  seleccionesDeLaEurocopa, seleccionesDeLaCopaAmerica, torneoContinentalDe,
  proximoPartidoDeEliminatoria, resolverPasoEliminatoria, seleccionesDelMundial, tablaDeEliminatoria,
  terminarEliminatoria, zonaDe,
} from './eliminatorias';
import { applyClubTheme } from './clubTheme';
import { limpiarTitulosFantasma } from './limpiarTitulos';
import { refreshTransferOffersIfNeeded } from './transferMarket';
import { clubesDeLiga, clubesJugables, esClubJugable, ligaTieneCalendario } from './clubesJugables';
import { generateWorldRanking } from './worldRanking';
import { preloadSfx } from './audio';
import { realDomesticCupFor } from './realCalendar';
// Calendario por fechas reales (ver dateSchedule.ts). Convive con realSchedule: los clubes con
// fechas cargadas usan éste, el resto sigue con el semanal hasta que se importen las suyas.
import { pasoAlCambiarDeClub, fechaDelPaso, pasosDeContinentalTranscurridos, torneoDeSeleccionesDelDia, type DatedFixture, type IntercambioDeCasilla, setIntercambiosDeCasilla, cicloDeEliminatorias, pasosDeEliminatoriasTranscurridos, competitionsForClubInSeason, esUltimoPartidoDeLaCopa, esUltimaFechaDelTorneo, fechasDeLigaDelTorneo, fechasDePlayoffDelTorneo, anioDeCarrera, enVentanaDelMundial, esDiaDeCopa, rivalDeLigaEnPaso, fechasDeCopaNacionalRestantes, pasosDeMundialTranscurridos, quedanFechasDeCopaContinental, fechasDeCopaTranscurridas, fechasDeLigaTranscurridas, fixturesAtStep, hasDatedLeagueSchedule, hasDatedSchedule, partidosDeLaMismaLlave, pickPrimary as pickDatedPrimary, RIVAL_POR_SORTEAR, temporadaDeCarrera, temporadaDelPaso, torneoDelClubEnFecha } from './dateSchedule';
import { crearCopaNacional, cruceActual, nombreCopaNacional, piernaDelCruce, rondaActual, sigueEnCopa, tamanoDelCuadro, tieneCopaNacionalReal } from './copaNacional';
import { reglasDeLiga, resolverMovimientos, tablaDeDescenso } from './promocionDescenso';
import { classifyMissedMatch, missedMatchNotice, prestigeCostOfMissing, seasonEndPrestigePenalty } from './nationalTeamDuty';
import { resolveWorldRetirements, applySquadRetirements, getSquadPlayerAge, MENTEE_MAX_AGE, MENTEE_SELF_MAX_AGE, MENTOR_MIN_AGE, puedeTenerMentor, ATTRIBUTE_MAX } from './worldRetirements';
import {
  leagueKeyFor, setDivisionOverrides, getOrCreateSeasonForLeague, resolvePlayerWeekForLeague, sortTable, isApeturaClausuraLeague,
  getLibertadoresParticipants, getSudamericanaParticipants, getConcacafParticipants, getOrCreateCupState, getUpcomingCupMatch, resolveCupWeek, isClubStillInCup,
  sigueEnElCuadroDeIdaYVuelta,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState, getUpcomingUefaCupMatch, resolveUefaCupWeek, isClubStillInUefaCup,
  getOrCreateWorldCupState, getUpcomingWorldCupMatch, resolveWorldCupWeek, simulateMatch,
  WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD, WORLD_CUP_CALLUP_MIN_MATCHES,
  ELIMINATORIAS_CALLUP_PRESTIGE_THRESHOLD, ELIMINATORIAS_CALLUP_MIN_MATCHES, generateLeagueLeadersFromTable, CAREER_START_YEAR,
  resolverPasoCopaNacional, prepararRondaCopaNacional, prepararPlayoffDeLiga, resolverPasoPlayoffDeLiga, crucePlayoffDeLiga, rondaDelPlayoff,
  type TorneoDeSelecciones, simulatePenaltyShootout, roundLabelByMatchCount, tercerosDeGrupo, terminarCopaContinental, terminarCopaUefa, terminarTorneoSinElJugador,
} from './leagueEngine';
import { anotarEnLideres, arqueroDe, claveDeCompeticion, repartirGoles, repartirTarjetas } from './lideresPorCompeticion';
import { esClasico, CLASICO_MULTIPLICADOR_GANAR, CLASICO_MULTIPLICADOR_PERDER } from './clasicos';
import { forzandoLaVuelta, lesionTeDejaAfuera, riesgoDeRecaida, PENALIDAD_ENERGIA_LESIONADO, TIPOS_DE_LESION, sortearTipoDeLesion, riesgoDeLesion } from './lesion';
import { secuelaDeLaLesion, PISO_DE_ATRIBUTO } from './secuela';
import { clubQueTeFormo, esLaCasaQueEspera, volvisteACasa } from './clubQueTeFormo';
import { guardarDeclaracion } from './hemeroteca';
import { estaEnBajon, faltaParaSalida, motivoDelBajon, resultadoDeSalida, salidaPorId, SalidaDelBajon, PENALIDAD_ENERGIA_BAJON } from './animo';
import { evaluarConvocatoria } from './convocatoria';
import { anotarNota, evaluarForma, ajusteDeFormaEnElOnce, avisoDeFormaEnElOnce } from './forma';
import { crecimientoDeLaTemporada, informeDeLaTemporada } from './modoHardcore';
import { apodoDe, bautizoDe } from './apodo';
import { estorboDelRival, jugarFechaDelRival, anotarFechaDelRival, cronicaDelRival } from './rivalDePuesto';
import {
  elClubSeCansoDeVos, teGanasteQuedarte, avisoDeLista, AVISO_TE_QUEDAS,
  exigenciaPorLoQueValés, evolucionDeLaLista,
  type ListaDeTransferibles,
} from './listaDeTransferibles';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen, { SUPERSTITIONS_DATABASE } from './components/SetupScreen';
// Las pantallas grandes se cargan bajo demanda. Todo el juego viajaba en un solo archivo de
// JavaScript, así que quien abría la pantalla de inicio se descargaba también el simulador de
// partidos, el hub, la tanda de penales y el resumen de carrera antes de ver un solo píxel. Son
// pantallas que ni siquiera existen hasta que hay una carrera cargada.
//
// SetupScreen y WelcomeScreen quedan afuera a propósito: son lo PRIMERO que se ve, diferirlas
// agregaría una espera justo donde no hay nada que esperar. SetupScreen además exporta
// SUPERSTITIONS_DATABASE, que App usa en tiempo de módulo.
const Dashboard = lazy(() => import('./components/Dashboard'));
const MatchSimulator = lazy(() => import('./components/MatchSimulator'));
const PostMatch = lazy(() => import('./components/PostMatch'));
const DecisionCenter = lazy(() => import('./components/DecisionCenter'));
const InteractivePenaltyShootout = lazy(() => import('./components/InteractivePenaltyShootout'));
import AchievementToast from './components/AchievementToast';
import MusicPlayer from './components/MusicPlayer';
import ChampionOverlay, { type ChampionInfo } from './components/ChampionOverlay';
import SeasonEndOverlay, { type SeasonEndInfo } from './components/SeasonEndOverlay';
import NewSeasonOverlay, { type NewSeasonInfo } from './components/NewSeasonOverlay';
import BallonDorOverlay, { type BallonDorInfo } from './components/BallonDorOverlay';
import { armarReporteDeBug, recordarEstado } from './reporteDeBug';
import { podarEdicionesTerminadas } from './podarPartida';
import { torneoDeSeleccionesDeHoy, bajoALaSudamericana, cerrarPlayoffsSinFechas, claveDeCopaNacional, clavePlayoffDeLiga, copaContinentalDelJugador, copaNacionalDelPaso, duenoDelDiaDeCopa, grupoRealDelCalendario, playoffDelDiaSinElJugador, repescadosDeLaLibertadores } from './decisionDelDia';
import { guardarRanura } from './partidaArchivo';
import { getLeagueDisplay } from './leagueDisplay';
import { resolverClubDeCalendario } from './clubAliases';
import NoticeToast from './components/NoticeToast';
import SoundSettings from './components/SoundSettings';
const CareerSummary = lazy(() => import('./components/CareerSummary'));

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


/**
 * Tope para el catch-up sintético de la liga Apertura/Clausura de un club con calendario real.
 *
 * getOrCreateApeturaClausuraSeason cuenta su catch-up en "pasos" ≈ una semana de carrera cada uno
 * (apeturaClausuraStepsElapsed), sin distinguir semanas de liga de las de copa. El calendario REAL
 * intercala fechas de copa (Libertadores, Copa Colombia) entre las de liga, así que currentWeek=32
 * puede corresponder a solo 24 fechas reales de LIGA -- el motor sintético, si se le pasa 32 tal
 * cual, avanza 7 "pasos" de más y resuelve de fondo, sin el jugador, ida Y vuelta de una ronda
 * entera de knockout (Cuartos completo, ida y vuelta de Semifinal empezada) antes de que el
 * calendario real llegue a esa fecha. El jugador terminaba jugando un partido que ya no
 * correspondía a la llave vigente del motor, y el resultado real no tenía dónde aplicarse bien.
 * Bug reportado: "me dio el campeonaao y habiamos empatado en el global, y el global nunca
 * aparecio".
 *
 * Se usa SOLO para el club actual del jugador (el que se está por mostrar/resolver en pantalla):
 * las demás ligas que corren de fondo (otros clubes por los que pasó) siguen su catch-up normal,
 * sin tope -- ahí no hay un jugador esperando su turno real.
 */
function currentWeekParaLigaDelJugador(club: Club, currentWeek: number): number {
  if (!isApeturaClausuraLeague(club.league) || !hasDatedLeagueSchedule(club.name)) return currentWeek;
  return fechasDeLigaTranscurridas(club.name, currentWeek) + 1;
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
  skipUefa: boolean,
  // De acá salen los cupos continentales de la temporada 2 en adelante: la tabla final de cada liga
  // y los campeones vigentes. Sin esto toda edición repetiría la real 2026. Opcional porque al
  // crear una carrera todavía no hay nada que mirar.
  cupos?: Pick<PlayerProfile, 'posicionesFinales' | 'campeonesContinentales'>
): { continentalCups: Record<string, any>; uefaCups: Record<string, any> } {
  const myClub = CLUBS_DATABASE.find(c => c.id === clubId);
  // La temporada sale del calendario del club, igual que en todos lados. Con getSeasonYear, un
  // club de 65 fechas por año cambiaba de edición de copa a mitad de temporada.
  const year = myClub ? temporadaDeCarrera(myClub.name, atWeek) : 1;
  const posiciones = cupos?.posicionesFinales;
  const campeones = {
    libertadores: cupos?.campeonesContinentales?.[`libertadores-${year - 1}`] ?? null,
    sudamericana: cupos?.campeonesContinentales?.[`sudamericana-${year - 1}`] ?? null,
  };
  const campeonesEuropa = {
    champions: cupos?.campeonesContinentales?.[`champions-${year - 1}`] ?? null,
    europa: cupos?.campeonesContinentales?.[`europa-${year - 1}`] ?? null,
  };
  let nextContinental = continentalCups;
  let nextUefa = uefaCups;

  // El estado de la copa se lleva y se PERSISTE para todos los clubes, tengan calendario real o no.
  //
  // Antes esto se salteaba para los clubes con calendario propio, porque el motor les montaba una
  // Libertadores paralela y le reclamaba el turno al calendario: ibas a jugar Libertadores y
  // terminabas jugando la vuelta de la Superliga. Ese problema ya no existe por acá — la rama que
  // elige el partido del jugador está guardada por `usaCalendarioReal`, así que el calendario manda
  // siempre y el bracket del motor no puede robarle el turno.
  //
  // Saltearlo tenía en cambio un costo feo: sin estado guardado, "Copas y Tablas" lo recreaba de
  // cero en CADA render (Dashboard llama a getOrCreate*State con `existing` undefined) y, como cada
  // recreación vuelve a simular con azar nuevo, la tabla del grupo se movía sola entre un vistazo y
  // el siguiente. Persistirlo acá la deja quieta: se simula una vez por paso y se guarda.
  if (myClub) {
    // Ver copaContinentalDelJugador: desde el repechaje, la copa del club cambia a mitad de ano.
    // `{ continentalCups }` y no el perfil entero: esta funcion no lo recibe, y de el solo se leen
    // las copas guardadas -- que es justo lo que si tiene a mano.
    const perfilDeCopas = { continentalCups } as unknown as PlayerProfile;
    const conmebolCupId = copaContinentalDelJugador(perfilDeCopas, myClub, CLUBS_DATABASE, year, posiciones, campeones);
    if (conmebolCupId && !skipConmebol) {
      const cupKey = `${conmebolCupId}-${year}`;
      // myClub.id al final: la copa de fondo NO puede jugar los partidos del jugador. Se detiene en
      // el suyo y lo deja pendiente. Ver getOrCreateCupState.
      nextContinental = { ...nextContinental, [cupKey]: getOrCreateCupState(conmebolCupId, year, CLUBS_DATABASE, nextContinental[cupKey], fechasDeCopaTranscurridas(myClub.name, atWeek, true, NOMBRE_DE_COPA[conmebolCupId]), posiciones, campeones, myClub.id, grupoDelCalendario(conmebolCupId, myClub, year, posiciones, campeones), repescadosDeLaLibertadores(perfilDeCopas, year)) };
    }

    const uefaCupId: 'champions' | 'europa' | null = getChampionsParticipants(CLUBS_DATABASE, year, posiciones, campeonesEuropa).includes(myClub.id)
      ? 'champions'
      : getEuropaParticipants(CLUBS_DATABASE, year, posiciones, campeonesEuropa).includes(myClub.id)
      ? 'europa'
      : null;
    if (uefaCupId && !skipUefa) {
      nextUefa = { ...nextUefa, [uefaCupId]: getOrCreateUefaCupState(uefaCupId, CLUBS_DATABASE, nextUefa[uefaCupId], fechasDeCopaTranscurridas(myClub.name, atWeek, false, NOMBRE_DE_COPA_UEFA[uefaCupId]), posiciones, campeonesEuropa, myClub.id) };
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

// Lesiones (opt-in, ver injuriesEnabled en SetupScreen): catálogo chico de tipos con su rango de
// semanas de recuperación. El roll de una lesión NUEVA vive inline en handleFinishMatch (solo se
// juega un partido real ahí, no en las semanas sin partido). INJURY_BASE_CHANCE_PER_MATCH es la
// probabilidad base por partido jugado; sube con matchesWithoutRest ya existente -- jugar
// exhausto es lo que más pesa en el riesgo real.
// El catalogo, las probabilidades y el sorteo viven en src/lesion.ts: los comparte el banco de
// pruebas, que es el que descubrio que el sorteo uniforme repartia una fractura cada cuatro lesiones.
const INJURY_TYPES = TIPOS_DE_LESION;
// El riesgo de recaída vive en src/lesion.ts, no acá: escala con las semanas que te salteás, así que
// es una función y no una constante. (Antes era un 0.35 fijo que además nunca se ejecutaba.)
const INJURY_FAST_TREATMENT_COST = 2000;
const INJURY_FAST_TREATMENT_WEEKS_SAVED = 0.4; // recorta ~40% del tiempo de recuperación restante

// Roles favoritos (ver ROLES_DATABASE en data.ts): se desbloquea recién con trayectoria, no en la
// creación de personaje -- tiene más sentido narrativo que un jugador "encuentre" su especialización
// jugando, no que la declare antes del primer partido.
const ROLE_UNLOCK_MATCHES = 15;

// Fase 3 -- Modo Veterano: a partir de esta edad el declive físico empieza a pesar más que las
// mejoras de entrenamiento; a partir de esta otra, se te acaba la carrera (no hay club que te
// contrate a ese nivel físico).
/**
 * Fecha y temporada del paso actual de un club. Es lo que necesita el motor para armar la tabla con
 * el MISMO calendario del que sale el partido que juega el jugador -- antes la tabla la resolvía el
 * legado semanal, con su propio reloj de jornadas, y registraba un rival distinto al de la pantalla.
 *
 * undefined si el club no tiene calendario real: ahí el motor cae a su fixture generado, como antes.
 */
function contextoRealDelPaso(clubName: string, step: number): { fecha: string; temporada: number } | undefined {
  const paso = fixturesAtStep(clubName, step);
  const t = temporadaDelPaso(clubName, step);
  return paso && t ? { fecha: paso.date, temporada: t.temporada } : undefined;
}

const VETERAN_DECLINE_START_AGE = 32;

// Carreras iniciadas en "modo veterano" (ver startedAsVeteran, elegido en SetupScreen) tienen su
// propia curva: como ya arrancan consagradas y con los años de juvenil salteados, el declive
// empieza un poco más tarde pero cae más fuerte por año -- asumen que entraron directo a la etapa
// final de la carrera, no que la construyeron desde los 17.
const VETERAN_MODE_DECLINE_START_AGE = 35;
const VETERAN_MODE_DECLINE_RATE = 3;

// A partir de RETIREMENT_DECISION_AGE, cada cierre de temporada te pregunta si colgás los botines
// o aguantás un año más -- la decisión es tuya, se repite todos los años y no cuesta nada más que
// el desgaste. A RETIREMENT_MAX_AGE ya no hay pregunta: se termina la carrera.
//
// Los números salen de los datos reales scrapeados (ver tmSquadEnrichment.ts): en Colombia y
// Argentina hay gente jugando a los 41 (Teófilo Gutiérrez, Rodallega, Insaurralde), así que cortar
// a los 39 dejaba afuera una franja de veteranos que en la vida real siguen en cancha.
const RETIREMENT_DECISION_AGE = 43;
const RETIREMENT_MAX_AGE = 45;

/**
 * El rival de liga del paso, ya resuelto contra la base de clubes. Es lo que antes daba
 * getUpcomingMatchForLeague, pero leyéndolo del calendario en vez de generando un fixture.
 */
function rivalDeLigaDelPaso(leagueClubs: Club[], clubName: string, paso: number):
  { opponentId: string; isHome: boolean } | null {
  const fx = rivalDeLigaEnPaso(clubName, paso);
  if (!fx) return null;
  const rival = resolverClubDeCalendario(leagueClubs, fx.opponentName, undefined, 'league', fx.competition.name);
  return rival ? { opponentId: rival.id, isHome: fx.isHome } : null;
}

/**
 * "Copa do Brasil · Octavos de Final" a partir del nombre del torneo y la ronda del calendario.
 *
 * Las rondas vienen de Transfermarkt en inglés y con formatos distintos según la copa ("Round of
 * 16", "Quarter-Finals", "1. Round"). Se traducen las habituales y el resto pasa tal cual: es
 * preferible mostrar "Group Stage" que no mostrar nada.
 */
const RONDAS_EN_ESPANOL: Record<string, string> = {
  'final': 'Final',
  'semi-finals': 'Semifinal', 'semi-final': 'Semifinal', 'semifinals': 'Semifinal',
  'quarter-finals': 'Cuartos de Final', 'quarter-final': 'Cuartos de Final',
  'round of 16': 'Octavos de Final', 'last 16': 'Octavos de Final',
  'round of 32': 'Dieciseisavos', 'last 32': 'Dieciseisavos',
  'round of 64': 'Treintaidosavos',
  'group stage': 'Fase de Grupos', 'first round': 'Primera Ronda', 'second round': 'Segunda Ronda',
  'third round': 'Tercera Ronda', 'preliminary round': 'Ronda Preliminar',
};

/**
 * Las 48 selecciones que juegan el Mundial de ese año.
 *
 * La edición 1 (2026) es la real: son las 48 que clasificaron de verdad, y para eso está
 * WORLD_CUP_TEAMS_DATABASE. De la segunda en adelante SE CLASIFICA JUGANDO -- salen de las
 * eliminatorias que se disputaron en los tres años previos (ver eliminatorias.ts).
 *
 * Antes acá iba siempre WORLD_CUP_TEAMS_DATABASE, y por eso el Mundial 2030 lo jugaban las mismas
 * 48 de 2026: Colombia clasificaba siempre e Italia no jugaba nunca, pasaran veinte años.
 */
/**
 * Como se llama el torneo de selecciones que para la actividad de clubes hoy.
 *
 * Se nombra el que de verdad ocupa el dia. En los anos del medio son DOS a la vez -- la Eurocopa y
 * la Copa America --, asi que se nombra el del jugador; si su confederacion no tiene ninguno (AFC,
 * CAF, OFC) se nombran los dos, que es lo honesto: su liga para igual porque las de al lado paran.
 */
function nombreDelParonDeSelecciones(perfil: PlayerProfile, clubName: string): string {
  const hoy = torneoDeSeleccionesDeHoyEnApp(perfil, clubName);
  if (hoy?.torneo === 'mundial') return 'el Mundial';
  if (hoy?.torneo === 'eurocopa') return 'la Eurocopa';
  if (hoy?.torneo === 'copaamerica') return 'la Copa America';
  return torneoDeSeleccionesDelDia(clubName, perfil.currentWeek) === 'mundial'
    ? 'el Mundial'
    : 'la Eurocopa y la Copa America';
}

/**
 * Envoltorio de torneoDeSeleccionesDeHoy con las selecciones del Mundial de ESTE ciclo.
 *
 * La funcion compartida no puede calcularlas: salen de las eliminatorias jugadas en esta carrera,
 * que es cuenta de App. El Dashboard le pasa las 48 de siempre, que para dibujar la tarjeta alcanza.
 */
function torneoDeSeleccionesDeHoyEnApp(perfil: PlayerProfile, clubName: string) {
  return torneoDeSeleccionesDeHoy(
    perfil, clubName, temporadaDe(perfil, perfil.currentWeek),
    seleccionesDelMundialDe(anioDeCarrera(clubName, perfil.currentWeek), perfil));
}

function seleccionesDelMundialDe(anio: number, perfil: PlayerProfile): Club[] {
  if (anio <= CAREER_START_YEAR) return WORLD_CUP_TEAMS_DATABASE;
  // Se cierra lo que haya quedado a medio jugar: el calendario no siempre le alcanza al club para
  // darle las 18 fechas de Conmebol, y una carrera que arranca a mitad de ciclo llega más tarde.
  const jugadas = Object.values(perfil.eliminatorias ?? {})
    .filter(e => e.mundial === anio)
    .map(e => terminarEliminatoria(e, ALL_NATIONAL_TEAMS_DATABASE));
  const ids = new Set(seleccionesDelMundial(anio, jugadas, ALL_NATIONAL_TEAMS_DATABASE));
  const clasificadas = ALL_NATIONAL_TEAMS_DATABASE.filter(t => ids.has(t.id));
  // Red de seguridad: el sorteo son 12 grupos de 4 y con 47 no se puede armar.
  return clasificadas.length === 48 ? clasificadas : WORLD_CUP_TEAMS_DATABASE;
}

function rotuloDeRonda(competicion: string, ronda?: string): string {
  if (!ronda) return competicion;
  const limpia = ronda.trim();
  // "Final (Vuelta)" -> se traduce "Final" y se conserva el paréntesis.
  const conParentesis = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(limpia);
  const base = (conParentesis ? conParentesis[1] : limpia).trim();
  const sufijo = conParentesis ? ` (${conParentesis[2].trim()})` : '';
  const traducida = RONDAS_EN_ESPANOL[base.toLowerCase()] ?? base;
  return `${competicion} · ${traducida}${sufijo}`;
}

// --- LA TEMPORADA LA DICE EL CALENDARIO ---------------------------------------------------------
//
// Estas tres reemplazan a getSeasonYear, que calculaba la temporada como floor(paso / 52) + 1.
// Ninguna temporada dura 52 pasos: el Junior juega 65 fechas en 2026 y un club europeo 34 en su
// media temporada inicial. Pasada la 52, getSeasonYear decía "temporada 2" con el calendario
// todavía en 2026, y de ese número cuelgan la clave de cada copa, el año de cada título y qué
// edición estás jugando -- por eso la copa se reiniciaba a mitad de año con el jugador adentro.

/** La temporada de carrera en la que cae ese paso, según el calendario del club del perfil. */
function temporadaDe(profile: PlayerProfile, paso: number): number {
  const club = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  return club ? temporadaDeCarrera(club.name, paso) : 1;
}

/** El AÑO calendario de ese paso (2026, 2027...). */
function anioDe(profile: PlayerProfile, paso: number): number {
  const club = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  return club ? anioDeCarrera(club.name, paso) : CAREER_START_YEAR;
}

/** ¿Entre estos dos pasos se cruzó a una temporada nueva? Es el disparador de todo lo anual. */
function cambioDeTemporada(profile: PlayerProfile, previousWeek: number, newWeek: number): boolean {
  return temporadaDe(profile, previousWeek) !== temporadaDe(profile, newWeek);
}

// Se llama una vez por cada semana que avanza la carrera; si esa semana cruza el límite de un
// "año" (SEASON_LENGTH_WEEKS), el jugador cumple años y, si ya es veterano, sufre un pequeño
// declive físico automático que el entrenamiento normal ya no alcanza a compensar del todo.
/**
 * MODO HARDCORE: los atributos se ganan jugando, no entrenando.
 *
 * Reemplaza a la ventana de entrenamiento, que en este modo no existe. La regla vive en
 * src/modoHardcore.ts para poder medirla sin abrir el juego -- y se midió: un jugador promedio en un
 * club chico hace pico a los 25 y termina en 60 a los 32; el mismo jugador en un plantel mejor
 * llega a 78, porque los compañeros tiran para arriba.
 *
 * El reparto de los puntos entre los seis atributos SÍ vive acá: la regla dice cuánto, el juego
 * decide dónde. Se reparte parejo y con el resto al que más se usa en tu posición, para que la
 * evolución tenga forma de jugador y no de planilla.
 */
/**
 * EL ALTA DE UNA LESIÓN, en un solo lugar.
 *
 * Hay TRES puertas por las que una lesión llega a cero: el cierre de temporada, la fecha que pasás
 * recuperándote, y el partido que aguantaste jugando roto hasta el final. Las tres armaban la línea
 * de `injuryHistory` por su cuenta, con la misma fórmula copiada tres veces -- y ahora además hay
 * que tirar el dado de la secuela, que es exactamente el tipo de cosa que en dos meses va a estar
 * en dos de las tres puertas y no en la tercera.
 *
 * Así que el alta se da acá, una vez, y las tres puertas la llaman.
 */
function darDeAlta(perfil: PlayerProfile, lesion: ActiveInjury, semanaDeAlta: number): {
  injuryHistory: NonNullable<PlayerProfile['injuryHistory']>;
  attributes: PlayerStats;
  ultimaSecuela?: { titular: string; relato: string };
  secuelasDeCarrera: NonNullable<PlayerProfile['secuelasDeCarrera']>;
} {
  const previas = perfil.injuryHistory ?? [];
  const weeksOut = Math.max(1, perfil.currentWeek - lesion.startedWeek + 1);

  const secuela = secuelaDeLaLesion({
    tipo: lesion.type,
    semanasAfuera: weeksOut,
    edad: perfil.age,
    posicion: perfil.position,
    atributos: perfil.attributes,
    semanaActual: perfil.currentWeek,
    historial: previas,
  }, Math.random());

  const attributes = { ...perfil.attributes };
  if (secuela) {
    for (const [k, v] of Object.entries(secuela.cambios) as [keyof PlayerStats, number][]) {
      attributes[k] = Math.max(PISO_DE_ATRIBUTO, Math.min(99, attributes[k] + v));
    }
  }

  return {
    injuryHistory: [...previas, { type: lesion.type, weeksOut, week: semanaDeAlta }],
    attributes,
    ultimaSecuela: secuela ? { titular: secuela.titular, relato: secuela.relato } : undefined,
    secuelasDeCarrera: secuela
      ? [...(perfil.secuelasDeCarrera ?? []), { relato: secuela.relato, semana: semanaDeAlta }]
      : (perfil.secuelasDeCarrera ?? []),
  };
}

function applyHardcoreGrowthIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!profile.hardcoreEnabled) return profile;
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;

  const notas = profile.notasDeLaTemporada ?? [];
  const club = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  const plantel = club ? getClubWithRoster(club.name, club.id) : null;
  const companeros: number[] = plantel?.plantilla
    ? [...plantel.plantilla.porteros, ...plantel.plantilla.defensivos, ...plantel.plantilla.ofensivos]
        .map((j: any) => j.media_valoracion).filter((n: number) => !!n)
    : [];
  const nivelDelPlantel = companeros.length
    ? companeros.reduce((a, b) => a + b, 0) / companeros.length
    : 65;
  const nivelPropio = Object.values(profile.attributes).reduce((a, b) => a + b, 0) / 6;

  const datos = {
    edad: profile.age,
    partidosJugados: notas.length,
    promedioDeNota: notas.length ? Number((notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1)) : null,
    nivelDelPlantel,
    nivelPropio,
  };
  const cambio = crecimientoDeLaTemporada(datos);

  // El reparto: un punto entero a cada atributo hasta donde alcance, y el resto al que tu posición
  // usa más. Repartir el decimal en los seis dejaba temporadas donde no se movía nada.
  const claves = Object.keys(profile.attributes) as (keyof PlayerStats)[];
  const enteros = Math.trunc(cambio);
  const resto = cambio - enteros;
  const preferido: Record<string, keyof PlayerStats> = {
    POR: 'defensa', DEF: 'defensa', CB: 'defensa', LI: 'ritmo', LD: 'ritmo',
    MCD: 'defensa', MC: 'pase', MCO: 'pase', EI: 'regate', ED: 'regate', DC: 'tiro', ST: 'tiro',
  };
  const favorito = preferido[profile.position] ?? 'fisico';

  const attributes = { ...profile.attributes };
  for (const k of claves) attributes[k] = Math.max(30, Math.min(99, attributes[k] + enteros));
  if (Math.abs(resto) >= 0.5) {
    attributes[favorito] = Math.max(30, Math.min(99, attributes[favorito] + Math.sign(resto)));
  }

  return { ...profile, attributes, notasDeLaTemporada: [], ultimoInformeHardcore: informeDeLaTemporada(cambio, datos) };
}

function applyAgingIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;

  const newAge = profile.age + 1;
  // Un save viejo con startedAsVeteran undefined SIEMPRE cae acá, en la curva normal -- nunca en
  // la de modo veterano, aunque tenga edad alta por haber jugado muchas temporadas.
  const declineStartAge = profile.startedAsVeteran ? VETERAN_MODE_DECLINE_START_AGE : VETERAN_DECLINE_START_AGE;
  const declineRate = profile.startedAsVeteran ? VETERAN_MODE_DECLINE_RATE : 2;
  if (newAge < declineStartAge) {
    return { ...profile, age: newAge };
  }
  return {
    ...profile,
    age: newAge,
    attributes: {
      ...profile.attributes,
      ritmo: Math.max(15, profile.attributes.ritmo - declineRate),
      fisico: Math.max(15, profile.attributes.fisico - declineRate)
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

// EL FICHAJE QUE TE TAPA. Cada temporada, el club puede traer a alguien de tu puesto.
//
// Es la contracara del mercado: hoy los traspasos son siempre una oportunidad para el jugador, y en
// el futbol de verdad tambien son una amenaza -- llega uno mejor y te toca pelear el lugar.
//
// La chance sube con la reputacion del club (los grandes fichan mas) y BAJA con tu prestigio: si sos
// intocable, no traen a nadie para tu puesto. Asi el refuerzo llega cuando duele y tiene sentido,
// no al azar puro.
const REFUERZO_CHANCE_BASE = 0.30;

const NOMBRES_DE_REFUERZO = [
  'Matías Ferreyra', 'Diego Sanabria', 'Lucas Ospina', 'Bruno Cardozo', 'Iván Mendoza',
  'Tomás Villalba', 'Kevin Restrepo', 'Andrés Quintero', 'Rodrigo Cabral', 'Nicolás Duarte',
];

function applyRefuerzoIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
  const club = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  if (!club) return profile;
  // Antes: "un jugador consagrado no se ve amenazado", y a los 85 de prestigio la chance era CERO.
  // Es al reves de como funciona un club grande -- cuanto mejor sos, mejor es el que traen para
  // pelearte el puesto -- y ademas apagaba la unica fuente de tension justo cuando la carrera se
  // queda sin nada en juego. Ahora baja pero nunca se apaga: al mejor del mundo igual le traen a
  // alguien, sólo que menos seguido.
  const chance = REFUERZO_CHANCE_BASE * (club.reputation / 5) * Math.max(0.3, 1 - profile.prestige / 130);
  if (Math.random() >= chance) return profile;
  return {
    ...profile,
    fichajeRival: {
      nombre: NOMBRES_DE_REFUERZO[Math.floor(Math.random() * NOMBRES_DE_REFUERZO.length)],
      posicion: profile.position,
      desdeSemana: newWeek,
      // Su nivel sale de la talla del club: en un grande te pelea el puesto alguien de verdad.
      nivel: Math.round(62 + club.reputation * 4 + Math.random() * 8),
      partidos: 0, goles: 0, asistencias: 0, sumaDeNotas: 0,
    },
  };
}

function applyCoachChangeIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
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
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;

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

  const endedSeasonYear = temporadaDe(profile, previousWeek);
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
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
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

// El OTRO lado de la mentoría: el veterano que te apadrina mientras sos joven.
//
// No toca atributos ni entrenamiento a propósito: el vínculo con un referente del plantel se siente
// en el vestuario y en la cabeza, no en la ficha. Suma a la barra de Compañeros al cerrar la
// temporada y amortigua el golpe anímico de las derrotas (ver MENTOR_DEFEAT_CUSHION más abajo).
// --- Entorno: familia y amigos ---
//
// Las otras barras miden cómo te ve el fútbol (DT, compañeros, hinchada). Ésta mide lo que el fútbol
// te va costando, y por eso es la única que baja SOLA sin que hagas nada mal: encadenar partidos sin
// parar nunca enfría a los tuyos. Recuperarla cuesta lo que de verdad cuesta -- tiempo y plata.
export const ENTORNO_INICIAL = 60;
const ENTORNO_DESGASTE_POR_TEMPORADA = 6;
// A partir de acá el desgaste de la temporada se duplica: no es lo mismo una temporada normal que
// una en la que no paraste nunca. Es el mismo umbral que ya usa la fatiga acumulada.
const ENTORNO_PARTIDOS_SEGUIDOS_DUROS = 8;
const ENTORNO_VISITA_COSTO = 900;
const ENTORNO_VISITA_ENERGIA = 12;
const ENTORNO_VISITA_SUBE = 14;
const ENTORNO_VISITA_MENTE = 5;
/** Por debajo de esto los tuyos ya no te sostienen y la cabeza lo siente. */
export const ENTORNO_UMBRAL_BAJO = 30;
/** Por encima de esto tenés dónde apoyarte cuando el fútbol sale mal. */
export const ENTORNO_UMBRAL_ALTO = 70;

/** Cuánto modifica el entorno un golpe anímico. Sostiene en las malas, o lo profundiza. */
export function ajustePorEntorno(entorno: number, cambioAnimico: number): number {
  if (cambioAnimico >= 0) return cambioAnimico;
  if (entorno >= ENTORNO_UMBRAL_ALTO) return Math.ceil(cambioAnimico * 0.75);
  if (entorno <= ENTORNO_UMBRAL_BAJO) return Math.floor(cambioAnimico * 1.25);
  return cambioAnimico;
}

function applyEntornoIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
  const actual = profile.entorno ?? ENTORNO_INICIAL;
  const desgaste = profile.matchesWithoutRest >= ENTORNO_PARTIDOS_SEGUIDOS_DUROS
    ? ENTORNO_DESGASTE_POR_TEMPORADA * 2
    : ENTORNO_DESGASTE_POR_TEMPORADA;
  return { ...profile, entorno: Math.max(0, actual - desgaste) };
}

// Las edades (MENTOR_MIN_AGE, MENTEE_SELF_MAX_AGE, puedeTenerMentor) viven en worldRetirements.ts
// porque el Dashboard también las necesita para filtrar la lista de candidatos.
const MENTOR_COMPANEROS = 2;
/** Cuánto queda del golpe anímico de una derrota si tenés mentor. 0.6 = se amortigua un 40%. */
const MENTOR_DEFEAT_CUSHION = 0.6;

function applyMentorFigureIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
  if (!profile.mentorName) return profile;

  // La edad del perfil ya la subió applyAgingIfNewSeason antes de llegar acá.
  const seguisSiendoJoven = puedeTenerMentor(profile.age);
  const prestigeCompanerosActual = profile.prestigeCompaneros ?? profile.prestige;

  return {
    ...profile,
    prestigeCompaneros: seguisSiendoJoven
      ? Math.max(0, Math.min(100, prestigeCompanerosActual + MENTOR_COMPANEROS))
      : prestigeCompanerosActual,
    // Al dejar de ser joven el vínculo se corta solo: si no, seguirías siendo "el pibe" a los 30.
    mentorName: seguisSiendoJoven ? profile.mentorName : null,
  };
}

function applyMentorshipIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
  if (!profile.mentorshipPlayerName) return profile;

  const roll = Math.random();
  const prestigeChange = roll < MENTORSHIP_GOOD_CHANCE
    ? MENTORSHIP_PRESTIGE_GOOD
    : roll < MENTORSHIP_GOOD_CHANCE + MENTORSHIP_STAGNANT_CHANCE
    ? 0
    : MENTORSHIP_PRESTIGE_BAD;

  // El ahijado también cumple años: pasado el límite se "gradúa" y deja de serlo, o seguirías
  // apadrinando al mismo jugador cuando ya tiene 30. El roll de esta temporada igual se aplica.
  const seguiaSiendoJoven = getSquadPlayerAge(profile.currentClubId, profile.mentorshipPlayerName, temporadaDe(profile, newWeek) - CAREER_START_YEAR) < MENTEE_MAX_AGE;

  // La mentoría es un vínculo con un compañero de plantel, no con el cuerpo técnico -- golpea la
  // barra de compañeros, no la de prestige (DT).
  const prestigeCompanerosActual = profile.prestigeCompaneros ?? profile.prestige;
  return {
    ...profile,
    prestigeCompaneros: Math.max(0, Math.min(100, prestigeCompanerosActual + prestigeChange)),
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
  if (temporadaDe(profile, newWeek) === temporadaDe(profile, previousWeek)) return profile;
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
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;

  // Los retiros previos ya están aplicados, así que se le pasan los planteles YA renovados: un
  // canterano de 18 que subió la temporada pasada no puede retirarse en la siguiente.
  const previos = profile.retiredWorldPlayers ?? {};
  const clubs = CLUBS_DATABASE.map(c => ({
    id: c.id,
    name: c.name,
    league: c.league,
    starPlayers: applySquadRetirements(c.id, c.starPlayers, previos),
  }));

  const { events, replacements } = resolveWorldRetirements(clubs, temporadaDe(profile, newWeek));
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
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
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
    // Snapshot para el comparador de temporadas: cómo quedaste al cerrar este año.
    attributesSnapshot: { ...profile.attributes },
    prestigeSnapshot: profile.prestige,
    prestigeCompanerosSnapshot: profile.prestigeCompaneros ?? profile.prestige,
    fansSnapshot: profile.fans,
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
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;

  const anioCerrado = temporadaDe(profile, previousWeek);
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
  // 1b. Guardar la tabla final de cada liga simulada. A diferencia del historial de arriba (que
  // solo mira las ligas con reglamento de ascenso/descenso), acá entran TODAS: los cupos de
  // Libertadores y Sudamericana se reparten con las diez ligas de Conmebol, y siete de ellas no
  // tienen reglamento cargado. Sin esto, la temporada 2 repetiría la edición real 2026.
  const posicionesFinales: Record<string, readonly string[]> = { ...(profile.posicionesFinales ?? {}) };
  for (const season of Object.values(profile.leagueSeasons ?? {})) {
    const filas = season.table ?? [];
    if (!filas.length) continue;
    const primera = CLUBS_DATABASE.find(c => c.id === filas[0].clubId || c.name === filas[0].name);
    if (!primera) continue;
    const clave = `${primera.league}-${anioCerrado}`;
    if (posicionesFinales[clave]) continue;
    // La tabla se reordena acá y no se confía en cómo quedó guardada: el motor la actualiza in situ
    // y el orden de inserción no siempre refleja el puntaje.
    posicionesFinales[clave] = [...filas]
      .sort((a, b) => b.puntos - a.puntos || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf)
      .map(f => f.clubId ?? CLUBS_DATABASE.find(c => c.name === f.name)?.id ?? '')
      .filter(Boolean);
  }

  // 1c. Campeones continentales del año que cierra: Conmebol le da a los dos un lugar en la
  // Libertadores siguiente.
  const campeonesContinentales = { ...(profile.campeonesContinentales ?? {}) };
  for (const [clave, copa] of Object.entries(profile.continentalCups ?? {})) {
    if (copa?.championId) campeonesContinentales[clave] = copa.championId;
  }
  // Champions/Europa se indexan por cupId (una edición cruza dos años calendario), así que su
  // campeón se anota con el año que cierra para que el reparto del año siguiente lo encuentre.
  for (const [cupId, copa] of Object.entries(profile.uefaCups ?? {})) {
    if (copa?.championId) campeonesContinentales[`${cupId}-${anioCerrado}`] = copa.championId;
  }

  profile = { ...profile, posicionesFinales, campeonesContinentales };

  if (historial.length === (profile.historialAnual?.length ?? 0)) return { ...profile, historialAnual: historial };

  // 2. Resolver los movimientos, liga por liga.
  const overrides: Record<string, 1 | 2> = { ...(profile.divisionOverrides ?? {}) };
  // Los intercambios de casilla del calendario que deja este cierre de año. Ver el comentario largo
  // más abajo, donde se emparejan, y setIntercambiosDeCasilla en dateSchedule.ts.
  const intercambios: IntercambioDeCasilla[] = [...(profile.intercambiosDeCasilla ?? [])];
  // La temporada que ARRANCA: el intercambio rige desde ahí, nunca hacia atrás. Remapear el pasado
  // cambiaría las fechas de partidos ya jugados y con eso todo el historial.
  const temporadaQueEmpieza = temporadaDe(profile, newWeek);
  let ultimo: PlayerProfile['ultimoAscensoDescenso'];

  for (const league of [...new Set(CLUBS_DATABASE.map(c => c.league))]) {
    if (!reglasDeLiga(league)) continue;
    // Sin Segunda con calendario no hay descenso posible: mandar al jugador ahí lo dejaba en un
    // club que el calendario no sabe hacer jugar. Hoy sólo Colombia, Argentina y Brasil tienen
    // su Segunda con fechas; Inglaterra, España, Alemania, Francia y Holanda no. En cuanto se
    // carguen esos calendarios, el descenso vuelve solo -- no hay nada más que tocar acá.
    if (!ligaTieneCalendario(`${league}-2`)) continue;

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

    // EL QUE BAJA Y EL QUE SUBE SE INTERCAMBIAN LA CASILLA DEL CALENDARIO.
    //
    // La división la cambia `overrides`, pero el calendario no la mira: es una función del NOMBRE
    // del club, y el que baja nunca jugó en la categoría de abajo, así que no tiene ni una fecha
    // ahí. Sin el intercambio, sus rivales seguían siendo los de la categoría que dejó -- ninguno
    // de su liga nueva -- y el partido caía a un respaldo que no registraba el resultado.
    //
    // Se emparejan de a uno, en orden: los cupos son los mismos de los dos lados (resolverMovimientos
    // devuelve tantos ascensos como descensos), así que cada casilla que se libera arriba la ocupa
    // la que se libera abajo. Vale desde la temporada que ARRANCA, no la que cerró.
    for (let i = 0; i < Math.min(descienden.length, ascienden.length); i++) {
      const queBaja = CLUBS_DATABASE.find(c => c.id === descienden[i].clubId);
      const queSube = CLUBS_DATABASE.find(c => c.id === ascienden[i].clubId);
      if (queBaja && queSube) {
        intercambios.push({ temporada: temporadaQueEmpieza, a: queBaja.name, b: queSube.name });
      }
    }

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

  return { ...profile, historialAnual: historial, divisionOverrides: overrides, intercambiosDeCasilla: intercambios, ultimoAscensoDescenso: ultimo ?? profile.ultimoAscensoDescenso };
}

// Balón de Oro anual: usa el mismo pool de candidatos que el ranking mundial (generateWorldRanking)
// para que compartan criterio -- no duplica la lógica de "quién es una estrella del mundo". El
// jugador entra al ranking con su propio score; su posición ahí decide rank/winnerName acá.
const BALLON_DOR_MIN_MATCHES = 20; // sin trayectoria mínima ese año, no hay ceremonia que narrar

function applyBallonDorIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
  if (profile.careerStats.partidosHistoricos < BALLON_DOR_MIN_MATCHES) return profile;

  const myClubName = CLUBS_DATABASE.find(c => c.id === profile.currentClubId)?.name ?? '';
  const ranking = generateWorldRanking(profile, myClubName, previousWeek,
    CLUBS_DATABASE.find(c => c.id === profile.currentClubId)?.league ?? '');
  const myRankIdx = ranking.findIndex(e => e.isPlayer);
  const rank = myRankIdx >= 0 ? myRankIdx + 1 : null;
  const winner = ranking.find(e => !e.isPlayer) ?? ranking[0];

  const anioCerrado = anioDe(profile, previousWeek);
  // Un año se vota UNA vez. applySeasonTransitions se llama desde siete puntos distintos y basta
  // con que dos coincidan en el mismo cruce de temporada para que la gala se anote dos veces --
  // dos entradas del mismo año, y el overlay disparándose dos veces seguidas.
  if ((profile.ballonDorHistory ?? []).some(b => b.year === anioCerrado)) return profile;

  // Los candidatos se CONGELAN acá, con el mismo ranking que decidió el ganador. Ver el comentario
  // de ballonDorHistory en types.ts: recalcularlos al abrir la gala daba otro podio cada vez.
  const entry = {
    year: anioCerrado,
    rank,
    winnerName: rank === 1 ? profile.name : winner.name,
    candidatos: ranking.slice(0, 5).map(e => ({ name: e.name, clubName: e.clubName })),
  };
  return { ...profile, ballonDorHistory: [...(profile.ballonDorHistory ?? []), entry] };
}

/**
 * Un cuadrangular que se quedo sin fechas se termina, en vez de quedar abierto para siempre.
 *
 * Va aca porque applySeasonTransitions es el unico punto por el que pasan LOS DOCE caminos que
 * avanzan un dia -- jugar, descansar, lesionarse, estar sancionado, no ser convocado, el paron del
 * Mundial --, y el cuadro se puede quedar sin dias por cualquiera de ellos.
 */
function cerrarCuadrangularesVencidos(profile: PlayerProfile, newWeek: number): PlayerProfile {
  const club = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  if (!club) return profile;
  const cerrados = cerrarPlayoffsSinFechas(profile, club, clubesDeLiga(leagueKeyFor(club)), newWeek);
  if (!cerrados) return profile;

  // Si al simular las llaves que ya no tenian fecha el campeon resulta ser TU club, el titulo se
  // anota. Sin esto, la vitrina -- que sale de cupTitles y no de los cuadros -- se quedaria sin un
  // campeonato que el juego si dio por ganado: un titulo invisible es peor que no tenerlo.
  const titulos = [...(profile.cupTitles ?? [])];
  const clave = (t: CupTitle) => `${t.competition}|${t.year}|${t.torneo ?? ''}`;
  const vistos = new Set(titulos.map(clave));
  for (const [k, cuadro] of Object.entries(cerrados)) {
    if (cuadro?.championId !== club.id) continue;
    const [, , torneo] = k.split('|');
    const nuevo: CupTitle = {
      competition: getLeagueDisplay(club.league, club.division).name,
      year: anioDeCarrera(club.name, newWeek),
      clubId: club.id,
      torneo: torneo || undefined,
      tipo: 'liga',
    };
    if (!vistos.has(clave(nuevo))) { titulos.push(nuevo); vistos.add(clave(nuevo)); }
  }
  return { ...profile, playoffsDeLiga: cerrados, cupTitles: titulos };
}

import type { CampeonesConmebol, PosicionesFinales } from './copasConmebol';

/** El nombre con el que el calendario rotula cada copa continental. */
const NOMBRE_DE_COPA_UEFA: Record<'champions' | 'europa', string> = {
  champions: 'UEFA Champions League',
  europa: 'UEFA Europa League',
};

const NOMBRE_DE_COPA: Record<'libertadores' | 'sudamericana' | 'concacaf', string> = {
  libertadores: 'Copa Libertadores',
  sudamericana: 'Copa Sudamericana',
  concacaf: 'Concacaf Champions Cup',
};

/**
 * El grupo del jugador segun el CALENDARIO, para que el sorteo del motor lo respete.
 *
 * Ver grupoRealDelCalendario: sin esto el motor sorteaba tambien el grupo del jugador y la pantalla
 * de Copas mostraba rivales distintos de los seis partidos que iba a jugar.
 */
function grupoDelCalendario(
  cupId: 'libertadores' | 'sudamericana' | 'concacaf',
  club: Club, temporada: number, posiciones?: PosicionesFinales, campeones?: CampeonesConmebol,
): string[] | undefined {
  if (cupId === 'concacaf') return undefined;  // sin fase de grupos
  const participantes = cupId === 'libertadores'
    ? getLibertadoresParticipants(CLUBS_DATABASE, temporada, posiciones, campeones)
    : getSudamericanaParticipants(CLUBS_DATABASE, temporada, posiciones, campeones);
  return grupoRealDelCalendario(club, CLUBS_DATABASE, NOMBRE_DE_COPA[cupId], temporada, participantes);
}

/**
 * Una copa continental que se quedo sin fechas se termina, en vez de quedar sin campeon.
 *
 * Hermana de cerrarCuadrangularesVencidos y por el mismo motivo. La copa avanza un paso por fecha
 * continental del calendario, y medido: 29 de los 64 participantes terminan el ano con 12, cuando
 * una Libertadores completa necesita 13. Sin esto se quedaba a un paso de coronar -- y un torneo
 * sin campeon deja sin repartir los cupos del ano siguiente, sin llenar la vitrina y sin noticia.
 */
function cerrarCopasContinentalesVencidas(profile: PlayerProfile, newWeek: number): PlayerProfile {
  const club = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  const guardadas = profile.continentalCups;
  if (!club || !guardadas) return profile;
  const temporadaHoy = temporadaDeCarrera(club.name, newWeek);
  const quedanFechas = quedanFechasDeCopaContinental(club.name, newWeek);

  let cambio = false;
  const copia = { ...guardadas };
  for (const [clave, cup] of Object.entries(guardadas)) {
    if (!cup || cup.championId) continue;
    // La edicion en curso solo se cierra cuando ya no queda ninguna fecha por delante; las de
    // temporadas anteriores, siempre: sus fechas pasaron hace rato.
    const suTemporada = Number(clave.split('-').pop());
    if (suTemporada === temporadaHoy && quedanFechas) continue;
    if (suTemporada > temporadaHoy) continue;
    const cerrada = terminarCopaContinental(cup, CLUBS_DATABASE);
    if (cerrada.championId) { copia[clave] = cerrada; cambio = true; }
  }
  return cambio ? { ...profile, continentalCups: copia } : profile;
}

/**
 * Lo mismo para las copas de la UEFA.
 *
 * Van aparte porque su estado es distinto (uefaCups, con fase de liga y playoff) y porque NO son
 * por temporada: la Champions arrastra su edicion de un ano al siguiente, asi que la clave no lleva
 * el ano y solo se cierra la que se quedo sin fechas por delante.
 */
function cerrarCopasUefaVencidas(profile: PlayerProfile, paso: number): PlayerProfile {
  const club = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  const guardadas = profile.uefaCups;
  if (!club || !guardadas || quedanFechasDeCopaContinental(club.name, paso)) return profile;

  let cambio = false;
  const copia = { ...guardadas };
  for (const [clave, cup] of Object.entries(guardadas)) {
    if (!cup || cup.championId) continue;
    const cerrada = terminarCopaUefa(cup, CLUBS_DATABASE);
    if (cerrada.championId) { copia[clave] = cerrada; cambio = true; }
  }
  return cambio ? { ...profile, uefaCups: copia } : profile;
}

/**
 * Al cambiar de temporada, las ediciones ya terminadas se guardan por su resultado.
 *
 * Ver podarPartida.ts: son ~24 KB por temporada de cuadros que nadie vuelve a mirar. Se hace al
 * cambiar de ano y no en cada paso porque es justo cuando dejan de ser la edicion en curso.
 */
function podarSiEsNuevaTemporada(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
  const club = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  return club ? podarEdicionesTerminadas(profile, temporadaDeCarrera(club.name, newWeek)) : profile;
}

/**
 * LA LISTA DE TRANSFERIBLES: el club se cansa, avisa, y si no lo revertís te vende.
 *
 * Corre en el cambio de temporada, después del refuerzo -- así el rival del puesto ya está creado y
 * su rendimiento cuenta para la decisión.
 *
 * La venta manda a un club MÁS CHICO y elegido de la misma liga, no al azar del mundo: una salida
 * forzada es un escalón para abajo, y mandarte a otro país sin que lo elijas sería peor que
 * venderte.
 */
function applyListaDeTransferiblesIfNewSeason(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  if (!cambioDeTemporada(profile, previousWeek, newWeek)) return profile;
  const club = CLUBS_DATABASE.find(c => c.id === profile.currentClubId);
  if (!club) return profile;

  const forma = evaluarForma(profile.formaReciente, newWeek);
  const estorbo = estorboDelRival(profile.fichajeRival, newWeek);

  // Un club más chico de la misma liga: el escalón para abajo que es una salida forzada. Mandarte a
  // otro país sin que lo elijas sería peor que venderte.
  //
  // Y el destino tiene que ser JUGABLE. Sin este filtro el club te podia vender a un equipo cuya liga
  // no tiene un solo club cargado -- Excursionistas es uno -- y ahi la carrera se queda sin rivales
  // contra quien jugar. Lo encontro el simulador de carreras largas la primera vez que encadeno
  // temporadas: "Excursionistas no tiene rivales en su liga, la temporada 4 no se puede jugar".
  const candidatos = CLUBS_DATABASE.filter(c =>
    c.league === club.league && c.id !== club.id && c.reputation <= Math.max(1, club.reputation - 1)
    && clubesDeLiga(leagueKeyFor(c)).some(x => x.id === c.id));
  const destino = candidatos[Math.floor(Math.random() * candidatos.length)];

  // LA REGLA VIVE EN EL MODULO, no acá: el simulador de carreras largas necesita la misma respuesta,
  // y una regla escrita dos veces es una regla que se desincroniza.
  const r = evolucionDeLaLista(profile, {
    promedioDeForma: forma.promedio,
    estorboDelRival: estorbo,
    reputacionDelClub: club.reputation,
    destinoSiTeVenden: destino ? { id: destino.id, nombre: destino.name } : null,
    semana: newWeek,
  });

  if (!r.vendidoA) return r.perfil as PlayerProfile;

  // Lo que sólo sabe App: el reloj de la carrera y el vestuario que se deja atrás.
  return {
    ...(r.perfil as PlayerProfile),
    currentWeek: pasoAlCambiarDeClub(r.vendidoA.nombre, fechaDelPaso(club.name, newWeek)) ?? newWeek,
    yearsAtClub: 0,
    mentorName: null,
    mentorshipPlayerName: null,
    ventaForzada: { desde: club.name, hacia: r.vendidoA.nombre, semana: newWeek },
  };
}

function applySeasonTransitions(profile: PlayerProfile, previousWeek: number, newWeek: number): PlayerProfile {
  // Las dos redes miran el dia que se ACABA de jugar (previousWeek), no el siguiente: asi un torneo
  // se cierra el dia de su ultima fecha. Preguntando por el siguiente, el campeon aparecia tres
  // dias tarde.
  let next = cerrarCuadrangularesVencidos(profile, previousWeek);
  next = cerrarCopasContinentalesVencidas(next, previousWeek);
  next = cerrarCopasUefaVencidas(next, previousWeek);
  next = freezeSeasonLeadersIfNewSeason(next, previousWeek, newWeek);
  next = applyWorldRetirementsIfNewSeason(next, previousWeek, newWeek);
  // ANTES del envejecimiento: la temporada que cerras te deja lo que te dejo, y recien despues te
  // sumas el anio. Al reves, un jugador de 29 cobraria el declive de los 30 por una temporada que
  // jugo con 29.
  next = applyHardcoreGrowthIfNewSeason(next, previousWeek, newWeek);
  next = applyAgingIfNewSeason(next, previousWeek, newWeek);
  next = applyCoachChangeIfNewSeason(next, previousWeek, newWeek);
  next = applyRefuerzoIfNewSeason(next, previousWeek, newWeek);
  // Va DESPUES del refuerzo: la decision mira como le fue al que te pelea el puesto, asi que el
  // rival tiene que estar creado antes de preguntarle nada.
  next = applyListaDeTransferiblesIfNewSeason(next, previousWeek, newWeek);
  next = applyBreakoutSeasonIfNewSeason(next, previousWeek, newWeek);
  next = applyYearsAtClubIfNewSeason(next, previousWeek, newWeek);
  next = applyMentorshipIfNewSeason(next, previousWeek, newWeek);
  // Va después de applyAgingIfNewSeason porque decide con la edad YA sumada: el año que cruzás el
  // límite tenés que dejar de ser el apadrinado, no un año tarde.
  next = applyMentorFigureIfNewSeason(next, previousWeek, newWeek);
  next = applyEntornoIfNewSeason(next, previousWeek, newWeek);
  next = applyCountryDutyToll(next, previousWeek, newWeek);
  next = applyPromotionRelegationIfNewSeason(next, previousWeek, newWeek);
  next = applyBallonDorIfNewSeason(next, previousWeek, newWeek);
  // Al final: lo de arriba puede leer las ediciones que esta poda reduce (el reparto de cupos
  // continentales del ano siguiente sale de sus campeones).
  next = podarSiEsNuevaTemporada(next, previousWeek, newWeek);
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

  // EL CLUB QUE TE FORMO GANA A CUALQUIER OTRO. Bajar de categoria a un club cualquiera es una
  // decision de calendario -- donde vas a jugar los ultimos anios. Bajar al club que te formo es un
  // final. No hay ninguna razon para ofrecerte el segundo mejor equipo de tu liga si el lugar donde
  // empezaste todo te esta esperando.
  const casa = clubQueTeFormo(profile);
  if (casa) {
    const clubDeLaCasa = CLUBS_DATABASE.find(c => c.id === casa);
    if (clubDeLaCasa && esLaCasaQueEspera(profile, clubDeLaCasa) && hasDatedSchedule(clubDeLaCasa.name)) {
      return clubDeLaCasa;
    }
  }

  const leagueKey = leagueKeyFor(myClub);
  const leagueClubs = clubesDeLiga(leagueKey).filter(c => c.id !== myClub.id);
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

/**
 * Le agrega a una tienda GUARDADA los articulos que se sumaron al catalogo despues.
 *
 * La tienda viaja dentro de la partida (localStorage `futbol_star_shop_${slot}`), asi que una
 * carrera vieja se abre con la lista que existia el dia que se creo. Al ampliar el catalogo de 6 a
 * 35 articulos, el jugador seguia viendo los 6 de siempre y parecia que el cambio no habia entrado.
 * Reportado con captura: "sale igual".
 *
 * Se conserva TODO lo comprado -- la entrada guardada manda sobre la del catalogo -- y solo se
 * agregan los ids que faltan, sin comprar. Asi una carrera de veinte temporadas no pierde nada y
 * ademas ve las novedades.
 */
function fusionarTienda(guardada: ShopItem[]): ShopItem[] {
  const porId = new Map(guardada.map(i => [i.id, i]));
  return INITIAL_LIFESTYLE_ITEMS.map(base => porId.get(base.id) ?? { ...base, purchased: false })
    // Y lo que este guardado pero ya no exista en el catalogo se conserva igual: si el jugador lo
    // compro, tiene que seguir siendo suyo aunque el articulo se haya retirado de la tienda.
    .concat(guardada.filter(i => !INITIAL_LIFESTYLE_ITEMS.some(b => b.id === i.id)));
}

/**
 * ¿Con este partido el club paso a la ronda siguiente?
 *
 * Se mide por la CANTIDAD de rondas del cuadro, no por el resultado del partido: una llave se gana
 * por el global, y el motor recien arma la ronda siguiente cuando la anterior quedo cerrada. Si hay
 * una ronda mas que antes y el club sigue vivo, avanzo. Preguntarle al marcador daria falsos
 * positivos en la ida.
 */
function pasoDeRonda(antes: { knockout?: { tiesByRound: unknown[] } | null }, despues: { knockout?: { tiesByRound: unknown[] } | null }): boolean {
  const a = antes.knockout?.tiesByRound.length ?? 0;
  const d = despues.knockout?.tiesByRound.length ?? 0;
  return d > a && a > 0;
}

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
  // Y las casillas del calendario, por la misma razón y en el mismo momento: fixturesAtStep lo
  // consultan decenas de sitios y ninguno recibe el perfil. Si esto se instalara tarde, el club
  // recién descendido pediría un paso y el calendario le contestaría con la categoría que dejó.
  React.useMemo(() => {
    setIntercambiosDeCasilla(playerProfile?.intercambiosDeCasilla);
  }, [playerProfile?.intercambiosDeCasilla]);
  const [shopItems, setShopItems] = useState<ShopItem[]>(INITIAL_LIFESTYLE_ITEMS);
  
  const [activeOpposition, setActiveOpposition] = useState('');
  const [activeOppositionClubId, setActiveOppositionClubId] = useState<string | null>(null);
  const [activeIsHome, setActiveIsHome] = useState(true);
  const [isCopaLibertadores, setIsCopaLibertadores] = useState(false);
  // Festejo a pantalla completa al salir campeón (ver ChampionOverlay). Se muestra al volver del
  // resumen de post-partido, para no tapar el resultado que lo causó.
  const [championInfo, setChampionInfo] = useState<ChampionInfo | null>(null);
  // Fin de temporada/torneo sin haber salido campeón: posición final en la tabla, o eliminación de
  // una copa de bracket. Complementa a ChampionOverlay -- entre los dos, cerrar cualquier torneo
  // siempre le avisa algo al jugador.
  const [seasonEndInfo, setSeasonEndInfo] = useState<SeasonEndInfo | null>(null);
  /**
   * El aviso que va DESPUES del que se esta mostrando.
   *
   * Hace falta porque hay un caso con dos: el dia que quedas tercero del grupo de Libertadores se
   * cierra esa copa -- que si termino para vos -- y aparte se anuncia que pasas a la Sudamericana.
   * Son dos cosas distintas y decirlas juntas convertiria una eliminacion en un premio.
   */
  const avisoEncolado = useRef<SeasonEndInfo | null>(null);
  // Periódico de arranque de temporada, disparado al tocar "Finalizar Temporada" (ver
  // handleFinalizeSeason). Pedido explícito del usuario.
  const [newSeasonInfo, setNewSeasonInfo] = useState<NewSeasonInfo | null>(null);
  const [ballonDorInfo, setBallonDorInfo] = useState<BallonDorInfo | null>(null);
  // El resultado del Balón de Oro se calcula dentro de applySeasonTransitions (7 puntos de llamada
  // distintos en App.tsx), no en un solo lugar -- en vez de repetir el disparo del overlay en cada
  // uno, se observa acá si ballonDorHistory creció desde el último render.
  // Arranca en null y NO en 0: con 0, una partida guardada con tres galas ya celebradas entraba
  // como "creció de 0 a 3" y la ceremonia se abría sola cada vez que se cargaba el juego. Como el
  // podio además se recalculaba en ese momento -- y el ranking mundial se mueve fecha a fecha --,
  // cada carga mostraba otro nombre arriba. Reportado: "cada que me meto me sale un ganador
  // distinto".
  const lastBallonDorCount = useRef<number | null>(null);
  // LA FOTO DEL ESTADO PARA CUANDO SE CAIGA LA PANTALLA.
  //
  // PantallaDeError envuelve el árbol entero desde main.tsx, así que cuando un error de render la
  // despierta ya no puede leer el perfil: el árbol que lo tenía se acaba de desmontar. Se le deja
  // servido acá, en una variable de módulo que no es parte del árbol y por eso sobrevive.
  //
  // Cuesta armar un string por paso de carrera y evita el reporte que no sirve para nada: un stack
  // trace suelto, que dice dónde reventó pero no en qué fecha, en qué torneo ni contra quién. Ver
  // src/reporteDeBug.ts.
  useEffect(() => {
    if (!playerProfile) return;
    try {
      recordarEstado(armarReporteDeBug(playerProfile, CLUBS_DATABASE));
    } catch {
      // Un reporte que se rompe no puede llevarse puesta la partida: es diagnóstico, no juego.
    }
  }, [playerProfile]);

  useEffect(() => {
    if (!playerProfile) return;
    const history = playerProfile.ballonDorHistory ?? [];
    // Primera pasada con perfil cargado, o carrera nueva (el historial se acortó): se sincroniza en
    // silencio. La gala se abre sólo cuando el historial CRECE jugando.
    if (lastBallonDorCount.current === null || history.length < lastBallonDorCount.current) {
      lastBallonDorCount.current = history.length;
      return;
    }
    if (history.length > lastBallonDorCount.current) {
      const last = history[history.length - 1];
      setBallonDorInfo({
        year: last.year,
        playerName: playerProfile.name,
        rank: last.rank,
        // El podio es el que se guardó con el resultado, no uno nuevo. Las partidas viejas no lo
        // tienen: ahí se muestra al ganador solo, que es el dato que sí quedó anotado, en vez de un
        // podio inventado que contradiga el nombre que la gala acaba de anunciar.
        winnerName: last.winnerName,
        candidates: last.candidatos ?? [{ name: last.winnerName, clubName: '' }],
      });
    }
    lastBallonDorCount.current = history.length;
  }, [playerProfile]);
  const [activeCupId, setActiveCupId] = useState<'libertadores' | 'sudamericana' | 'concacaf' | null>(null);
  const [activeUefaCupId, setActiveUefaCupId] = useState<'champions' | 'europa' | null>(null);
  // Semana de copa en la que el club no juega ninguna copa continental: se rotula como copa
  // nacional (Copa del Rey, FA Cup, etc.) en vez de caer al cartel de Libertadores.
  const [activeDomesticCup, setActiveDomesticCup] = useState(false);
  // Nombre exacto del torneo cuando el partido sale del calendario real. Hace falta porque un país
  // tiene varias copas nacionales -- Colombia juega Copa Colombia Y Superliga -- y el booleano
  // activeDomesticCup no alcanza para distinguirlas: rotulaba "Copa Colombia" la Superliga.
  const [activeCompetitionName, setActiveCompetitionName] = useState<string | null>(null);
  // "2-1" en la vuelta de una llave a ida y vuelta -- null en la ida (todavía no hay global) y en
  // partidos a partido único. El jugador no podía ver el marcador acumulado durante el partido en
  // vivo, solo después en la tarjeta de "próximo partido". Bug reportado: agregar "el resultado
  // global visible en la pantalla de partido".
  const [activeGlobalScoreLabel, setActiveGlobalScoreLabel] = useState<string | null>(null);
  // "Apertura"/"Clausura" para el header del partido de liga en países con dos torneos por año.
  // Antes MatchSimulator lo recalculaba por su cuenta con fixturesAtStep(club, currentWeek) --
  // funcionaba mientras el partido de HOY viniera del calendario real, pero cuando el rival salía
  // del motor sintético (temporada avanzada, calendario real ya agotado) esa cuenta podía apuntar a
  // una fecha real de otro semestre y rotular mal el torneo. Ahora App.tsx, que ya sabe con certeza
  // de dónde salió el partido de hoy, se lo pasa hecho. Bug reportado: "la pagina del partido
  // siempre debe decir cual competencia se juega, exactamente sin errores".
  const [activeTorneoLabel, setActiveTorneoLabel] = useState<string | null>(null);
  // Costo de irse con la selección, calculado al salir de la semana pero aplicado recién cuando
  // termina el partido: si se aplicara antes, el jugador vería bajar su prestigio sin saber por qué.
  const pendingCountryDutyCost = useRef<{ prestige: number; notice: string | null; important: boolean } | null>(null);
  const [activeWorldCupTeamId, setActiveWorldCupTeamId] = useState<string | null>(null);
  // Clave de la eliminatoria del partido en curso ('CONMEBOL-2030'). Distingue un partido de
  // eliminatoria de uno del Mundial: los dos son con la selección y los dos pasan por la misma
  // pantalla, pero el resultado va a tablas distintas.
  const [activeEliminatoriaKey, setActiveEliminatoriaKey] = useState<string | null>(null);
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

  /**
   * LOS AVISOS DE LA LISTA DE TRANSFERIBLES, en UN solo lugar.
   *
   * applySeasonTransitions se llama desde diez ramas distintas -- partido jugado, fecha sin partido,
   * descanso, no convocado, lesion, seleccion... -- y avisar en cada una era garantizar que tarde o
   * temprano una se olvidara y el jugador se enterara de que lo vendieron por ver otro escudo en la
   * pantalla. Mirando el perfil, las diez quedan cubiertas por igual.
   */
  const listaAnterior = useRef<ListaDeTransferibles | undefined>(undefined);
  useEffect(() => {
    if (!playerProfile) return;

    // La venta forzada se cuenta UNA vez y se limpia: si quedara guardada, el aviso volveria a
    // salir en cada render que tocara el perfil.
    // El informe de la temporada en hardcore. Sin entrenamiento, esto es lo UNICO que le explica al
    // jugador por que sus atributos se movieron: sin el aviso, los numeros cambian solos y parece un
    // bug. Se cuenta una vez y se limpia.
    // LA SECUELA. Va primero de todo porque es lo mas fuerte que le puede pasar a un perfil sin que
    // el jugador haya hecho nada: los atributos se movieron solos. Sin el aviso parece un bug.
    if (playerProfile.ultimaSecuela) {
      const sec = playerProfile.ultimaSecuela;
      notify(`🩼 ${sec.titular}. ${sec.relato}`);
      setPlayerProfile(p => (p ? { ...p, ultimaSecuela: undefined } : p));
      return;
    }

    if (playerProfile.ultimoInformeHardcore) {
      notify(`📈 ${playerProfile.ultimoInformeHardcore}`);
      setPlayerProfile(p => (p ? { ...p, ultimoInformeHardcore: undefined } : p));
      return;
    }

    if (playerProfile.ventaForzada) {
      const v = playerProfile.ventaForzada;
      notify(`🚫 ${v.desde} te vendió a ${v.hacia}. No es el traspaso que querías, pero vas a jugar.`);
      setPlayerProfile(p => (p ? { ...p, ventaForzada: undefined } : p));
      listaAnterior.current = undefined;
      return;
    }

    const ahora = playerProfile.listaDeTransferibles;
    const antes = listaAnterior.current;
    const club = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);

    if (ahora && (!antes || antes.temporadas !== ahora.temporadas) && club) {
      notify(`⚠ ${avisoDeLista(ahora, club.name)}`);
    } else if (!ahora && antes) {
      notify(`✅ ${AVISO_TE_QUEDAS}`);
    }
    listaAnterior.current = ahora;
  }, [playerProfile?.listaDeTransferibles, playerProfile?.ventaForzada, playerProfile?.ultimoInformeHardcore, playerProfile?.ultimaSecuela]);

  /**
   * EL BAUTIZO. El apodo se calcula solo (src/apodo.ts), pero que te lo PONGAN es un momento, y un
   * momento hay que contarlo cuando pasa. Este efecto vigila el apodo vigente y avisa la primera
   * vez que aparece uno nuevo.
   *
   * Guarda el apodo anunciado y no el apodo: si guardara el apodo, dejaria de ser un espejo de como
   * jugas hoy. Asi el jugador que se reinventa se lo gana de nuevo, y la prensa lo cuenta de nuevo.
   */
  useEffect(() => {
    if (!playerProfile) return;
    const nuevo = apodoDe({
      partidos: playerProfile.careerStats.partidosHistoricos,
      goles: playerProfile.careerStats.golesHistoricos,
      asistencias: playerProfile.careerStats.asistenciasHistoricos,
      amarillas: playerProfile.careerStats.tarjetasAmarillasHistoricas,
      rojas: playerProfile.careerStats.tarjetasRojasHistoricas,
      posicion: playerProfile.position,
      jugadas: playerProfile.jugadasPorAtributo,
    });
    if (!nuevo || nuevo.apodo === playerProfile.apodoAnunciado?.apodo) return;
    const club = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    notify(`🗞 ${bautizoDe(playerProfile.name, nuevo, club?.name ?? 'el vestuario')}`);
    setPlayerProfile(p => (p ? { ...p, apodoAnunciado: { apodo: nuevo.apodo, semana: p.currentWeek } } : p));
  }, [playerProfile?.careerStats.partidosHistoricos, playerProfile?.jugadasPorAtributo]);

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

  // GUARDAR PUEDE FALLAR, Y CALLARSE ES LO PEOR QUE PUEDE HACER.
  //
  // localStorage tiene un tope de ~5 MB POR DOMINIO, repartido entre todas las ranuras. Una carrera
  // de 32 temporadas pesa cerca de 1 MB -- las copas continentales guardan sus ocho grupos con las
  // tablas completas, edición por edición, y nada se poda nunca -- así que tres ranuras llenas
  // rozan el tope. Cuando se pasa, `setItem` TIRA una excepción.
  //
  // Hasta acá no había try/catch. Dos consecuencias, las dos malas:
  //
  //   - La excepción salía disparada en medio del handler que la llamó (los 51 llamadores están en
  //     mitad de resolver un partido o una transición de temporada), cortando lo que quedaba.
  //   - Y el jugador no se enteraba de nada: seguía jugando temporadas sobre una partida que ya no
  //     se estaba guardando, y las perdía todas al cerrar.
  //
  // Son dos claves separadas, además, así que la primera podía grabar y la segunda fallar: ranura a
  // medio guardar, con el perfil nuevo y la tienda vieja.
  //
  // Ahora se escriben las dos o ninguna, y si no se puede, se avisa. Un aviso no arregla el tope,
  // pero convierte "perdí veinte temporadas sin saber por qué" en "exportá la partida ahora mismo",
  // que es una salida que el juego ya tiene (ver partidaArchivo.ts).
  const guardadoFallido = useRef(false);
  const saveGameState = (profile: PlayerProfile, items: ShopItem[], forcedSlotId?: string) => {
    const slot = forcedSlotId || activeSlotId;
    if (!slot) return;
    const res = guardarRanura(slot, profile, items);
    if (res.ok) { guardadoFallido.current = false; return; }
    // Se avisa UNA vez por racha: esto corre en cada partido, y repetir el cartel en todos taparía
    // el resto del juego sin agregar información.
    if (!guardadoFallido.current) {
      guardadoFallido.current = true;
      notify(res.lleno
        ? '⚠️ NO SE PUDO GUARDAR: el almacenamiento del navegador está lleno. Exportá tu partida desde el menú de inicio ANTES de cerrar, y borrá alguna ranura vieja para liberar espacio.'
        : '⚠️ NO SE PUDO GUARDAR tu partida. Exportá el archivo desde el menú de inicio antes de cerrar el juego.');
    }
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
        const leagueClubs = clubesDeLiga(leagueKey);
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
    // Compatibilidad con saves de antes del split de prestige en 3 barras: la relación con
    // compañeros arranca igual a la relación con el DT que ya tenías, no en un valor fijo.
    if (profile.prestigeCompaneros === undefined) {
      profile = { ...profile, prestigeCompaneros: profile.prestige };
    }
    if (profile.activeInjury === undefined) {
      profile = { ...profile, activeInjury: null };
    }
    if (profile.injuryHistory === undefined) {
      profile = { ...profile, injuryHistory: [] };
    }
    if (profile.agent === undefined) {
      profile = { ...profile, agent: null };
    }
    if (profile.activeLoan === undefined) {
      profile = { ...profile, activeLoan: null };
    }
    if (profile.investments === undefined) {
      profile = { ...profile, investments: [] };
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
    // Momento de forma (ver src/forma.ts). Las partidas viejas arrancan SIN historial, no con las
    // notas inventadas a partir del promedio: una racha que no jugaste no es tuya. Con la lista
    // vacía el jugador queda 'normal' y la forma se construye desde el próximo partido.
    if (profile.formaReciente === undefined) {
      profile = { ...profile, formaReciente: [] };
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
      const edad = getSquadPlayerAge(profile.currentClubId, profile.mentorshipPlayerName, temporadaDe(profile, profile.currentWeek) - CAREER_START_YEAR);
      if (edad > MENTEE_MAX_AGE) {
        profile = { ...profile, mentorshipPlayerName: null };
      }
    }
    if (profile.mentorName === undefined) {
      profile = { ...profile, mentorName: null };
    }
    // Una carrera vieja no arranca en cero: no hizo nada para descuidar a los suyos, simplemente la
    // barra no existía. Entra en el mismo valor que una carrera nueva.
    if (profile.entorno === undefined) {
      profile = { ...profile, entorno: ENTORNO_INICIAL };
    }
    // Mismo criterio que el ahijado, por los dos lados: el mentor deja de valer si él ya no está en
    // el plantel con edad de referente, o si el que creciste sos vos. Un traspaso también lo corta
    // -- getSquadPlayerAge se pregunta contra el club ACTUAL, así que un veterano del club anterior
    // no sobrevive al cambio.
    if (profile.mentorName) {
      const edadMentor = getSquadPlayerAge(profile.currentClubId, profile.mentorName, temporadaDe(profile, profile.currentWeek) - CAREER_START_YEAR);
      if (edadMentor < MENTOR_MIN_AGE || !puedeTenerMentor(profile.age)) {
        profile = { ...profile, mentorName: null };
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
    // Títulos que se anotaron por bugs ya corregidos. El palmarés se deriva del estado, así que los
    // de liga se arreglaron solos; los de cupTitles están GUARDADOS y hay que sacarlos a mano. La
    // regla es una: no se puede ganar un torneo en el que no se jugó ni un partido.
    const limpieza = limpiarTitulosFantasma(profile);
    profile = limpieza.perfil;

    // Aviso del cambio de balance del mercado, una sola vez por partida. Va antes de setPlayerProfile
    // para que el flag quede guardado junto con el resto de las migraciones y no vuelva a salir.
    const debeAvisarMercado = !profile.avisoMercadoNuevoVisto;
    if (debeAvisarMercado) profile = { ...profile, avisoMercadoNuevoVisto: true };

    setPlayerProfile(profile);
    if (limpieza.quitados.length) {
      // Se guarda enseguida: si no, el título vuelve a aparecer en la próxima carga.
      saveGameState(profile, shopItems);
      const cuales = limpieza.quitados.map(t => `${t.competition} ${t.year}`).join(', ');
      notify(`🧹 Se quitaron ${limpieza.quitados.length} título${limpieza.quitados.length === 1 ? '' : 's'} de la vitrina que un error había anotado sin que los jugaras: ${cuales}. El resto de tu palmarés queda igual.`);
    }
    if (debeAvisarMercado) {
      notify('📊 El mercado de pases cambió: ahora los clubes grandes exigen bastante más que los chicos, así que alguno que antes te seguía puede haber quedado lejos. Mirá "Quién te está mirando" en Traspasos para ver cuánto te falta.');
    }

    const savedShop = localStorage.getItem(`futbol_star_shop_${slotId}`);
    if (savedShop) {
      try {
        setShopItems(fusionarTienda(JSON.parse(savedShop)));
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
    const leagueClubs = clubesDeLiga(leagueKey);
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
      uefaCups: initialCups.uefaCups,
      // Una carrera que nace HOY ya nace con el mercado nuevo: no hay nada que avisarle. Sin esto,
      // el aviso le saltaría igual la primera vez que la reabriera desde el menú.
      avisoMercadoNuevoVisto: true,
      entorno: ENTORNO_INICIAL,
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
    // El tope se aplicaba con Math.min(99, ...) DESPUÉS de cobrar, así que con el atributo en 99
    // seguías pagando la sesión y gastando energía a cambio de nada. Se corta antes de tocar nada.
    if (playerProfile.attributes[attr] >= ATTRIBUTE_MAX) {
      notify(`Ya tienes ${attr} en ${ATTRIBUTE_MAX}, el máximo. Entrenarlo de nuevo sería tirar la plata: dedícalo a otra cosa.`);
      return;
    }
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
        [attr]: Math.min(ATTRIBUTE_MAX, playerProfile.attributes[attr] + trainingGain)
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
    if (playerName && getSquadPlayerAge(playerProfile.currentClubId, playerName, temporadaDe(playerProfile, playerProfile.currentWeek) - CAREER_START_YEAR) > MENTEE_MAX_AGE) {
      notify('Ese jugador ya no es un juvenil: la mentoría es solo para promesas del plantel.');
      return;
    }
    const updatedProfile = { ...playerProfile, mentorshipPlayerName: playerName };
    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(updatedProfile);
    if (newlyUnlocked.length > 0) setAchievementQueue(prev => [...prev, ...newlyUnlocked]);
    setPlayerProfile(withAchievements);
    saveGameState(withAchievements, shopItems);
  };

  // El otro lado: elegís al veterano que te apadrina. Misma forma que handleSelectMentee -- null
  // para quedarte sin mentor -- y las mismas dos barreras finales, edad tuya y edad de él.
  const handleSelectMentor = (playerName: string | null) => {
    if (!playerProfile) return;
    if (playerName && !puedeTenerMentor(playerProfile.age)) {
      notify(`Ya pasaste los ${MENTEE_SELF_MAX_AGE}: a esta altura de la carrera el que apadrina eres tú.`);
      return;
    }
    if (playerName && getSquadPlayerAge(playerProfile.currentClubId, playerName, temporadaDe(playerProfile, playerProfile.currentWeek) - CAREER_START_YEAR) < MENTOR_MIN_AGE) {
      notify('Ese compañero no tiene la trayectoria para ser tu referente: buscá a un veterano del plantel.');
      return;
    }
    const updatedProfile: PlayerProfile = { ...playerProfile, mentorName: playerName };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(playerName
      ? `${playerName} te tomó bajo su ala. Su respaldo en el vestuario te va a sostener en las malas.`
      : 'Te soltaste del ala de tu referente: de acá en más, solo.');
  };

  // Entorno: dedicarles tiempo a los tuyos. Cuesta plata y ENERGÍA a propósito -- si sólo costara
  // dinero sería un botón sin decisión, y lo que el fútbol te saca de verdad es el tiempo.
  const handleVisitarEntorno = () => {
    if (!playerProfile) return;
    if (playerProfile.capital < ENTORNO_VISITA_COSTO) {
      notify(`No te alcanza: un viaje a ver a los tuyos sale $${ENTORNO_VISITA_COSTO.toLocaleString()}.`);
      return;
    }
    if (playerProfile.energy < ENTORNO_VISITA_ENERGIA) {
      notify('Estás fundido. Descansa antes de subirte a un avión.');
      return;
    }
    const actual = playerProfile.entorno ?? ENTORNO_INICIAL;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: playerProfile.capital - ENTORNO_VISITA_COSTO,
      energy: Math.max(0, playerProfile.energy - ENTORNO_VISITA_ENERGIA),
      entorno: Math.min(100, actual + ENTORNO_VISITA_SUBE),
      mentalHealth: Math.min(100, playerProfile.mentalHealth + ENTORNO_VISITA_MENTE),
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify('🏠 Te tomaste unos días con los tuyos. Vuelves con la cabeza en otro lado — en el bueno.');
  };

  /**
   * Salir del bajón anímico (ver animo.ts).
   *
   * Vive acá al lado de la visita al entorno porque es la misma familia: acciones sueltas que
   * tocan campos propios del perfil y no entran en el shape fijo de LOBBY_RANDOM_EVENTS.
   *
   * Las tres opciones cobran en monedas distintas a propósito -- dinero e imagen, energía del
   * próximo partido, o riesgo -- así que ninguna es "la correcta" y la elección depende de en qué
   * momento de la temporada estés.
   */
  const handleSalirDelBajon = (id: SalidaDelBajon) => {
    if (!playerProfile) return;
    const salida = salidaPorId(id);
    // Se vuelve a comprobar acá y no sólo en el botón: la pantalla puede haber quedado con datos
    // viejos entre el render y el clic, y una opción que no se puede pagar no puede cobrarse igual.
    const falta = faltaParaSalida(salida, playerProfile);
    if (falta) {
      notify(falta);
      return;
    }
    const resultado = resultadoDeSalida(salida);
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: Math.max(0, playerProfile.capital - resultado.capital),
      energy: Math.max(0, playerProfile.energy - resultado.energia),
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + resultado.prestigio)),
      entorno: Math.min(100, (playerProfile.entorno ?? ENTORNO_INICIAL) + resultado.entorno),
      mentalHealth: Math.max(0, Math.min(100, playerProfile.mentalHealth + resultado.animo)),
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(resultado.mensaje);
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

  // Extensión de la vida amorosa: matrimonio e hijos, con el mismo patrón puntual de handlers que
  // el resto de girlfriend.* -- ver nota más arriba de por qué no vive en DecisionCenter.
  const PROPOSE_MIN_LOVE = 70;
  const PROPOSE_COST = 8000;
  const CHILD_ENERGY_COST = 15; // el nacimiento compite por tu energía esa semana, no es gratis

  const handlePropose = () => {
    if (!playerProfile?.girlfriend) return;
    if (playerProfile.girlfriend.marriedAt !== undefined) return;
    if (!playerProfile.girlfriend.livingTogether || playerProfile.girlfriend.loveMeter < PROPOSE_MIN_LOVE) {
      notify('Todavía no es el momento: necesitas vivir juntos y una relación más sólida antes de proponerle matrimonio.');
      return;
    }
    if (playerProfile.capital < PROPOSE_COST) {
      notify(`No te alcanza para el anillo. Necesitas al menos $${PROPOSE_COST.toLocaleString()}.`);
      return;
    }
    const gfName = playerProfile.girlfriend.name;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: playerProfile.capital - PROPOSE_COST,
      fans: Math.min(100, playerProfile.fans + 8),
      mentalHealth: Math.min(100, playerProfile.mentalHealth + 6),
      girlfriend: { ...playerProfile.girlfriend, marriedAt: playerProfile.currentWeek, loveMeter: 100 }
    };
    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(updatedProfile);
    if (newlyUnlocked.length > 0) setAchievementQueue(prev => [...prev, ...newlyUnlocked]);
    setPlayerProfile(withAchievements);
    saveGameState(withAchievements, shopItems);
    notify(`💍 ¡Te casaste con ${gfName}! Toda la prensa deportiva habló de la boda.`);
  };

  const handleHaveChild = () => {
    if (!playerProfile?.girlfriend) return;
    if (playerProfile.girlfriend.marriedAt === undefined) {
      notify('Solo puedes formar una familia con alguien con quien ya te casaste.');
      return;
    }
    if (playerProfile.energy < CHILD_ENERGY_COST + 10) {
      notify('Estás demasiado exhausto para esta noticia ahora mismo. Descansa primero.');
      return;
    }
    const childName = ['Mateo', 'Sofía', 'Thiago', 'Emma', 'Santiago', 'Valentina'][Math.floor(Math.random() * 6)];
    const gfName = playerProfile.girlfriend.name;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      energy: Math.max(5, playerProfile.energy - CHILD_ENERGY_COST),
      mentalHealth: Math.min(100, playerProfile.mentalHealth + 10),
      fans: Math.min(100, playerProfile.fans + 5),
      girlfriend: {
        ...playerProfile.girlfriend,
        loveMeter: Math.min(100, playerProfile.girlfriend.loveMeter + 8),
        children: [...(playerProfile.girlfriend.children ?? []), { name: childName, bornWeek: playerProfile.currentWeek }]
      }
    };
    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(updatedProfile);
    if (newlyUnlocked.length > 0) setAchievementQueue(prev => [...prev, ...newlyUnlocked]);
    setPlayerProfile(withAchievements);
    saveGameState(withAchievements, shopItems);
    notify(`👶 ¡${gfName} y tú tuvieron a ${childName}! La familia crece, pero esta semana llegaste al partido más cansado de lo habitual.`);
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

  // Rol favorito: solo elegible desde ROLE_UNLOCK_MATCHES partidos jugados (ver Dashboard.tsx para
  // el gate de UI); el handler en sí no revalida la edad ni el conteo, es la última barrera contra
  // un save manipulado o un roster que cambió entre render y click, mismo criterio que
  // handleSelectMentee.
  const handleSelectRole = (roleId: string | null) => {
    if (!playerProfile) return;
    if (roleId && playerProfile.careerStats.partidosHistoricos < ROLE_UNLOCK_MATCHES) {
      notify(`Todavía no tienes trayectoria suficiente para especializarte (necesitas ${ROLE_UNLOCK_MATCHES} partidos jugados).`);
      return;
    }
    const role = roleId ? ROLES_DATABASE.find(r => r.id === roleId) : null;
    if (roleId && (!role || role.position !== playerProfile.position)) return;
    const updatedProfile: PlayerProfile = { ...playerProfile, favoriteRole: roleId ?? undefined };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(role ? `Elegiste tu rol favorito: ${role.label}.` : 'Volviste a un estilo de juego neutro, sin especialización.');
  };

  // Se llama al abrir la pestaña de Traspasos (ver useEffect en Dashboard.tsx): si currentWeek ya
  // avanzó desde la última generación, arma un conjunto nuevo de ofertas y lo persiste -- así no
  // hace falta enganchar el refresco en cada uno de los puntos donde la semana avanza (mismo tipo
  // de superficie ya tocada por lesiones), y el jugador ve un conjunto estable de ofertas mientras
  // no pase una semana nueva, sin importar cuántas veces reabra la pestaña.
  const handleRefreshTransferOffers = () => {
    if (!playerProfile) return;
    if (playerProfile.transferOffersGeneratedWeek === playerProfile.currentWeek && playerProfile.pendingTransferOffers) return;
    const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    if (!myClub) return;
    // Sólo clubes jugables: una oferta de un club sin calendario te dejaba dentro del motor
    // viejo por semanas apenas la aceptabas. Ver clubesJugables.ts.
    const refreshed = refreshTransferOffersIfNeeded(playerProfile, myClub, clubesJugables());
    const updatedProfile: PlayerProfile = { ...playerProfile, ...refreshed };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
  };

  const FAMILY_AGENT_COMMISSION_PCT = 3; // barato, pero negocia peor (ver agentMultiplier)

  // Contratar un agente profesional del catálogo, o que un familiar/amigo cumpla ese rol (gratis
  // de contratar, pero evidentemente peor negociando -- ver agentMultiplier en transferMarket.ts).
  // Cambiar de agente limpia las ofertas activas: se regeneran con los nuevos parámetros la
  // próxima vez que se abra la pestaña.
  const handleHireAgent = (agentId: string | 'familia') => {
    if (!playerProfile) return;
    const agent: Agent | null = agentId === 'familia'
      ? { id: 'familia', name: 'Un familiar/amigo cercano', type: 'familiar_amigo', reputation: 0, commissionPct: FAMILY_AGENT_COMMISSION_PCT }
      : (() => {
          const found = AGENTS_DATABASE.find(a => a.id === agentId);
          return found ? { ...found, type: 'profesional' as const } : null;
        })();
    if (!agent) return;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      agent,
      pendingTransferOffers: undefined,
      transferOffersGeneratedWeek: undefined,
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(`🤝 ${agent.name} ahora es tu representante.`);
  };

  const handleFireAgent = () => {
    if (!playerProfile?.agent) return;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      agent: null,
      pendingTransferOffers: undefined,
      transferOffersGeneratedWeek: undefined,
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify('Terminaste tu relación con tu representante. Vuelves a negociar directo.');
  };

  const RENEWAL_MIN_PRESTIGE = 55;
  const RENEWAL_ACCEPT_CHANCE_BASE = 0.5;
  const RENEWAL_REJECT_PRESTIGE_PENALTY = 6;

  // Pedirle al club actual que renueve antes de que "expire" la relación implícita -- el juego no
  // modela contratos con fecha de vencimiento explícita, así que esto es una forma de reafirmar el
  // vínculo con el club y ganar un pequeño empujón de sueldo/bono. Riesgo real: el club puede decir
  // que no, y eso enfría la relación con el DT.
  const handleRequestRenewal = () => {
    if (!playerProfile) return;
    const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    if (!myClub) return;
    if (playerProfile.prestige < RENEWAL_MIN_PRESTIGE) {
      notify('Todavía no tienes la relación suficiente con el DT como para pedir una renovación.');
      return;
    }
    const accepted = Math.random() < RENEWAL_ACCEPT_CHANCE_BASE + (playerProfile.prestige - RENEWAL_MIN_PRESTIGE) / 200;
    if (accepted) {
      const bonus = Math.round(myClub.initialSalary * 0.5);
      const updatedProfile: PlayerProfile = {
        ...playerProfile,
        capital: playerProfile.capital + bonus,
        prestige: Math.min(100, playerProfile.prestige + 4),
        appearanceBonus: Math.round(myClub.initialSalary * 0.18),
      };
      setPlayerProfile(updatedProfile);
      saveGameState(updatedProfile, shopItems);
      notify(`✍️ Renovación aceptada: ${myClub.name} te reafirma con un bono de $${bonus.toLocaleString()}.`);
    } else {
      const updatedProfile: PlayerProfile = {
        ...playerProfile,
        prestige: Math.max(0, playerProfile.prestige - RENEWAL_REJECT_PRESTIGE_PENALTY),
      };
      setPlayerProfile(updatedProfile);
      saveGameState(updatedProfile, shopItems);
      notify(`❌ ${myClub.name} no aceptó renovar por ahora. La relación con el DT se enfrió un poco.`);
    }
  };

  const LOAN_MIN_WEEKS = 8;
  const LOAN_MAX_WEEKS = 20;

  // Salir a préstamo: reusa el mismo mecanismo de handleAcceptTransfer para el cambio de club,
  // pero guarda de dónde volver (originClubId) y cuándo (returnWeek). El fichaje receptor no paga
  // el signOnBonus completo de un traspaso definitivo -- una cesión es más barata que comprar.
  const handleLoanOut = (clubId: string) => {
    if (!playerProfile) return;
    const targetClub = CLUBS_DATABASE.find(c => c.id === clubId)!;
    const originClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
    const leagueKey = leagueKeyFor(targetClub);
    const leagueClubs = clubesDeLiga(leagueKey);
    const season = getOrCreateSeasonForLeague(leagueClubs, playerProfile.leagueSeasons[leagueKey], playerProfile.currentWeek);
    const returnWeek = playerProfile.currentWeek + LOAN_MIN_WEEKS + Math.floor(Math.random() * (LOAN_MAX_WEEKS - LOAN_MIN_WEEKS));
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      currentClubId: clubId,
      currentWeek: pasoEnElClubNuevo(playerProfile, originClub, targetClub),
      yearsAtClub: 0,
      // Los vínculos de vestuario son con COMPAÑEROS, así que no cruzan la puerta del club: al
      // cambiar de plantel se cortan los dos lados. Si no, getSquadPlayerAge termina preguntando
      // por un nombre que no está en el plantel nuevo y le inventa una edad por hash.
      mentorName: null,
      mentorshipPlayerName: null,
      leagueSeasons: { ...playerProfile.leagueSeasons, [leagueKey]: season },
      activeLoan: { originClubId: originClub.id, originClubName: originClub.name, returnWeek, optionToBuyAmount: Math.round(targetClub.initialSalary * 8) },
      pendingTransferOffers: undefined,
      transferOffersGeneratedWeek: undefined,
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(`📄 Sales a préstamo a ${targetClub.name}. Vuelves a ${originClub.name} en ${returnWeek - playerProfile.currentWeek} semanas, salvo que se ejerza la opción de compra.`);
  };

  // Al llegar returnWeek con un préstamo activo, el jugador decide: ejercer la opción de compra
  // (te quedás en el club receptor de forma definitiva, activeLoan se borra) o volver al club de
  // origen. Se dispara desde el ciclo semanal -- ver el chequeo en handleFinishMatch.
  const handleResolveLoan = (buyOption: boolean) => {
    if (!playerProfile?.activeLoan) return;
    const loan = playerProfile.activeLoan;
    if (buyOption) {
      if (playerProfile.capital < (loan.optionToBuyAmount ?? 0)) {
        notify('No tienes fondos suficientes para ejercer la opción de compra.');
        return;
      }
      const updatedProfile: PlayerProfile = {
        ...playerProfile,
        capital: playerProfile.capital - (loan.optionToBuyAmount ?? 0),
        activeLoan: null,
      };
      setPlayerProfile(updatedProfile);
      saveGameState(updatedProfile, shopItems);
      notify('✅ Ejerciste la opción de compra: tu paso por este club ahora es definitivo.');
    } else {
      const originClub = CLUBS_DATABASE.find(c => c.id === loan.originClubId);
      if (!originClub) return;
      const leagueKey = leagueKeyFor(originClub);
      const leagueClubs = clubesDeLiga(leagueKey);
      const season = getOrCreateSeasonForLeague(leagueClubs, playerProfile.leagueSeasons[leagueKey], playerProfile.currentWeek);
      const updatedProfile: PlayerProfile = {
        ...playerProfile,
        currentClubId: originClub.id,
        currentWeek: pasoEnElClubNuevo(playerProfile, CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId), originClub),
        yearsAtClub: 0,
        // Volvés del préstamo a un vestuario que ya no es el que dejaste: los vínculos se rehacen.
        mentorName: null,
        mentorshipPlayerName: null,
        leagueSeasons: { ...playerProfile.leagueSeasons, [leagueKey]: season },
        activeLoan: null,
        pendingTransferOffers: undefined,
        transferOffersGeneratedWeek: undefined,
      };
      setPlayerProfile(updatedProfile);
      saveGameState(updatedProfile, shopItems);
      notify(`↩️ Volviste a ${originClub.name} tras el préstamo.`);
    }
  };

  // Finanzas personales: comprar una inversión fija predefinida (ver INVESTMENTS_DATABASE). El
  // retorno/riesgo semanal se aplica en el ciclo semanal -- ver el bloque en handleFinishMatch.
  const handleBuyInvestment = (investmentId: string) => {
    if (!playerProfile) return;
    const investment = INVESTMENTS_DATABASE.find(i => i.id === investmentId);
    if (!investment) return;
    if (playerProfile.capital < investment.cost) {
      notify('No tienes fondos suficientes para esta inversión.');
      return;
    }
    if ((playerProfile.investments ?? []).some(i => i.id === investmentId)) return;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: playerProfile.capital - investment.cost,
      investments: [...(playerProfile.investments ?? []), investment],
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(`💼 Invertiste en ${investment.name}.`);
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

  // Modo difícil: la prensa es más exigente -- las respuestas buenas rinden un poco menos y las
  // malas pesan un poco más, en vez de aplicar el mismo multiplicador a ambas (que no cambiaría
  // nada en términos relativos).
  const pressDifficultyAdjust = (change: number): number => {
    if (playerProfile?.difficultyMode !== 'realista') return change;
    return change >= 0 ? Math.round(change * 0.8) : Math.round(change * 1.25);
  };

  /**
   * Publicas algo en ChutSocial. Una por fecha, y con consecuencias.
   *
   * Cierra el circulo del feed, que hasta ahora era de una sola via: te hablaba y no habia forma de
   * contestar. Los efectos son los de la opcion elegida (ver publicacionesDisponibles) y ninguna es
   * gratis -- picantear da hinchada y enfria al DT, hacerte cargo da respeto y baja el animo.
   */
  const handlePublicar = (opcion: { id: string; texto: string; fans: number; prestigio: number; dt: number; animo: number }) => {
    if (!playerProfile) return;
    const acotado = (v: number) => Math.max(0, Math.min(100, v));
    setPlayerProfile(p => ({
      ...p,
      fans: acotado(p.fans + opcion.fans),
      // "Relacion DT" en pantalla ES el prestigio: no hay un campo aparte. Por eso el efecto sobre
      // el tecnico se suma ahi mismo, y no en un campo inventado que nadie leeria.
      prestige: acotado(p.prestige + opcion.prestigio + opcion.dt),
      mentalHealth: acotado(p.mentalHealth + opcion.animo),
      // El saldo que decide el tono de las respuestas: la misma cuenta que ya usa la rueda de
      // prensa, para que no haya dos reglas que puedan contradecirse.
      miPublicacion: { texto: opcion.texto, saldo: opcion.fans + opcion.prestigio, semana: p.currentWeek },
    }));
  };

  const handleAnswerPress = (prestigeChange: number, fansChange: number, energyChange: number, texto = '') => {
    if (!playerProfile) return;
    prestigeChange = pressDifficultyAdjust(prestigeChange);
    fansChange = pressDifficultyAdjust(fansChange);
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + prestigeChange)),
      fans: Math.max(0, Math.min(100, playerProfile.fans + fansChange)),
      energy: Math.max(0, Math.min(100, playerProfile.energy + energyChange)),
      mentalHealth: Math.max(0, Math.min(100, playerProfile.mentalHealth + mentalHealthNudge(prestigeChange + fansChange))),
      // El saldo queda guardado para que ChutSocial reaccione a lo que dijiste. Antes la
      // conferencia era un tramite silencioso: movia numeros y el mundo no se enteraba.
      ultimaPrensa: { saldo: prestigeChange + fansChange, semana: playerProfile.currentWeek },
      // Y ademas queda en el archivo, si fue una declaracion fuerte. El saldo hace de filtro sin
      // que el juego tenga que entender la frase: las que envejecen mal son las que gustaron.
      declaraciones: guardarDeclaracion(playerProfile.declaraciones ?? [], {
        texto,
        saldo: prestigeChange + fansChange,
        semana: playerProfile.currentWeek,
        clubId: playerProfile.currentClubId,
        clubName: CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)?.name ?? 'su club',
      }),
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

/**
   * El paso con el que sigue la carrera al cambiar de club, o el actual si no se puede calcular.
   *
   * Sin esto la carrera saltaba en el TIEMPO en cada cambio de club: el paso es la N-ésima fecha DE TU
   * CLUB, y el 40 cae el 17 de febrero para el Benfica y el 2 de agosto para el Santos. Ver
   * pasoAlCambiarDeClub en dateSchedule.ts.
   */
  const pasoEnElClubNuevo = (perfil: PlayerProfile, clubViejo: Club | undefined, clubNuevo: Club): number => {
    const hoy = clubViejo ? fechaDelPaso(clubViejo.name, perfil.currentWeek) : null;
    return pasoAlCambiarDeClub(clubNuevo.name, hoy) ?? perfil.currentWeek;
  };
  
    const handleAcceptTransfer = (clubId: string, signOnBonus: number, newDorsal: number) => {
    if (!playerProfile) return;
    const targetClub = CLUBS_DATABASE.find(c => c.id === clubId)!;
    const previousClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);

    // Si es una liga que todavía no visitaste, se genera y se pone al día
    // (queda "corriendo de fondo" como si nunca la hubieras dejado de mirar).
    const leagueKey = leagueKeyFor(targetClub);
    const leagueClubs = clubesDeLiga(leagueKey);
    const season = getOrCreateSeasonForLeague(leagueClubs, playerProfile.leagueSeasons[leagueKey], playerProfile.currentWeek);

    // Llegás a un plantel y a un cuerpo técnico que no te conocen: hay que ganarse el lugar de
    // nuevo con el DT y con los compañeros. La hinchada nueva no sufre el mismo golpe porque nunca
    // tuvo nada tuyo que perder.
    const prestigeCompanerosActual = playerProfile.prestigeCompaneros ?? playerProfile.prestige;
    // El dorsal que dejás atrás queda en el historial, para poder narrar "en tu club anterior
    // usabas el N" más adelante en la carrera.
    const dorsalHistory = previousClub
      ? [...(playerProfile.dorsalHistory ?? []), { clubId: previousClub.id, clubName: previousClub.name, dorsal: playerProfile.dorsal }]
      : (playerProfile.dorsalHistory ?? []);
    // El agente se lleva su comisión del bono de firma, si tenés uno (ver Agent en types.ts).
    const agentCommission = playerProfile.agent ? Math.round(signOnBonus * (playerProfile.agent.commissionPct / 100)) : 0;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      currentClubId: clubId,
      currentWeek: pasoEnElClubNuevo(playerProfile, previousClub, targetClub),
      dorsal: newDorsal,
      dorsalHistory,
      capital: playerProfile.capital + signOnBonus - agentCommission,
      prestige: Math.round(playerProfile.prestige * 0.9),
      prestigeCompaneros: Math.round(prestigeCompanerosActual * 0.9),
      yearsAtClub: 0,
      // Club nuevo, vestuario nuevo: ni el referente ni el ahijado te siguen en el traspaso.
      mentorName: null,
      mentorshipPlayerName: null,
      appearanceBonus: Math.round(targetClub.initialSalary * 0.15),
      leagueSeasons: { ...playerProfile.leagueSeasons, [leagueKey]: season },
      // Las ofertas eran relativas al club anterior -- se regeneran solas la próxima vez que se
      // abra la pestaña de Traspasos en el club nuevo.
      pendingTransferOffers: undefined,
      transferOffersGeneratedWeek: undefined,
    };

    const { profile: withAchievements, newlyUnlocked } = checkAndUnlockAchievements(updatedProfile);
    if (newlyUnlocked.length > 0) setAchievementQueue(prev => [...prev, ...newlyUnlocked]);

    setPlayerProfile(withAchievements);
    saveGameState(withAchievements, shopItems);
    notify(agentCommission > 0
      ? `🎉 ¡TRASPASO CONFIRMADO! Todo listo para presentarte en: ${targetClub.name}. Tu agente se llevó $${agentCommission.toLocaleString()} de comisión.`
      : `🎉 ¡TRASPASO CONFIRMADO! Todo listo para presentarte en: ${targetClub.name}.`);
  };

  // Última fecha real del año ya jugada, con liga+copas cerradas (ver temporadaRealTerminada en
  // Dashboard.tsx): el botón dice "Finalizar Temporada" en vez de "Disputar Partido". Acá no se
  // abre ningún partido -- ya no queda nada real que jugar este año -- solo se avanza el reloj de
  // carrera y se muestra el periódico de bienvenida a la temporada nueva.
  const handleFinalizeSeason = () => {
    if (!playerProfile) return;
    const nextWeek = playerProfile.currentWeek + 1;
    const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;

    // La liga de tu club se recalcula acá y no se deja para la próxima vez que se abra el
    // Dashboard: éste lee leagueSeasons directo del perfil guardado, sin volver a llamar a
    // getOrCreateSeasonForLeague. Sin este recálculo, la temporada quedaba marcada 'done' para
    // siempre y el botón nunca volvía a decir "Disputar Partido" -- un loop sin salida.
    const leagueKey = leagueKeyFor(myClub);
    const leagueClubs = clubesDeLiga(leagueKey);
    const updatedLeagueSeasons = {
      ...playerProfile.leagueSeasons,
      [leagueKey]: getOrCreateSeasonForLeague(leagueClubs, playerProfile.leagueSeasons[leagueKey], nextWeek),
    };

    // Mismo criterio para las copas continentales/UEFA de fondo (si clasificás a la del año nuevo).
    const cupsSync = syncBackgroundCups(playerProfile.currentClubId, nextWeek, playerProfile.continentalCups, playerProfile.uefaCups, false, false, playerProfile);

    // Si veías el final del año lesionado, la baja sigue corriendo igual -- no se congela solo
    // porque no había más partidos que jugar.
    const activeInjuryAtClose = playerProfile.activeInjury;
    const weeksRemainingAtClose = activeInjuryAtClose ? activeInjuryAtClose.weeksRemaining - 1 : 0;
    const injuryDoneAtClose = !!activeInjuryAtClose && weeksRemainingAtClose <= 0;

    const aged = applySeasonTransitions({
      ...playerProfile,
      currentWeek: nextWeek,
      leagueSeasons: updatedLeagueSeasons,
      continentalCups: cupsSync.continentalCups,
      uefaCups: cupsSync.uefaCups,
      activeInjury: !activeInjuryAtClose ? null : injuryDoneAtClose ? null : { ...activeInjuryAtClose, weeksRemaining: weeksRemainingAtClose },
      ...(injuryDoneAtClose ? darDeAlta(playerProfile, activeInjuryAtClose!, nextWeek) : { injuryHistory: playerProfile.injuryHistory ?? [] }),
    }, playerProfile.currentWeek, nextWeek);
    if (isPastRetirementAge(aged)) {
      resolveRetirementCheckpoint(aged);
      return;
    }
    setPlayerProfile(aged);
    saveGameState(aged, shopItems);
    setNewSeasonInfo({
      clubName: myClub.name,
      year: anioDeCarrera(myClub.name, nextWeek),
      badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
    });
  };

  /**
   * El cuadrangular avanza aunque vos no juegues.
   *
   * Los dias que el jugador se pierde -- lesionado, sancionado, sin convocatoria, descansando por
   * energia baja, o porque el dia era de una copa en la que ya no esta -- el calendario los gasta
   * igual, pero el cuadro se quedaba quieto. Y las fechas de cuadrangular son contadas: el Clausura
   * mexicano tiene seis y un cuadro de ocho necesita las seis. Perdiendo tres, el torneo se congela
   * en semifinal para siempre. Reportado: "la liga mx no dio campeon, no se jugo el de vuelta".
   *
   * La tabla sale del perfil y no de un parametro para que todas las salidas puedan llamarlo igual;
   * solo hace falta el dia que el cuadro todavia no esta sembrado.
   */
  const playoffSinVosHoy = () => {
    const club = playerProfile && CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
    if (!playerProfile || !club) return undefined;
    const liga = leagueKeyFor(club);
    return playoffDelDiaSinElJugador(
      playerProfile, club, clubesDeLiga(liga),
      playerProfile.leagueSeasons?.[liga]?.table ?? [],
    ) ?? undefined;
  };

  /**
   * El resultado de una fecha que tu club jugo SIN VOS, anotado en el historial.
   *
   * datedResults no es "los partidos que jugaste": es lo que le paso a tu club fecha por fecha. De
   * ahi salen la racha, el global de las llaves de copa y los marcadores del calendario -- y el
   * codigo ya daba por sentado que estaba completo ("incluye las fechas que el club resolvio sin
   * vos", dice el comentario del global). No lo estaba: las fechas de sancion y las que el DT no te
   * convocaba se simulaban, se te avisaba el marcador por pantalla, se actualizaba la tabla... y no
   * quedaba registro. Reportado: "hubo un partido que se simulo porque me suspendieron y perdimos,
   * pero en la ventana de proximo partido aun me sale que voy invicto".
   */
  const resultadoDelClubSinVos = (
    myClub: Club, opponentName: string, myGoals: number, rivalGoals: number,
  ): DatedResult | null => {
    if (!playerProfile || !hasDatedLeagueSchedule(myClub.name)) return null;
    const paso = fixturesAtStep(myClub.name, playerProfile.currentWeek);
    const fx = paso ? pickDatedPrimary(paso.fixtures) : null;
    if (!paso || !fx) return null;
    return {
      date: paso.date, competition: fx.competition.name,
      opponentName, myGoals, rivalGoals, sinElJugador: true,
    };
  };

  /**
   * El partido de liga de HOY, jugado por tu club sin vos.
   *
   * Lo usan las tres salidas en las que el club juega y vos no: energia baja, lesion y sancion. Las
   * tres tenian su propia copia de esto -- o directamente no lo hacian, como la lesion, que
   * adelantaba la liga entera sin resolver el partido del club -- y ninguna anotaba el resultado.
   *
   * El rival sale del CALENDARIO REAL cuando lo hay, con el fixture del motor de respaldo: con la
   * deriva entre los dos relojes, el motor puede no tener fixture mientras el calendario si tiene
   * fecha, y ahi el aviso de "sin ti en el campo" se saltaba un partido que de verdad se jugaba.
   */
  const partidoDeLigaSinVos = (
    myClub: Club, leagueClubs: Club[], season: ReturnType<typeof getOrCreateSeasonForLeague>,
  ) => {
    if (!playerProfile) return null;
    let rival: Club | null = null;
    let soyLocal = false;
    if (hasDatedLeagueSchedule(myClub.name)) {
      const pasoHoy = fixturesAtStep(myClub.name, playerProfile.currentWeek);
      const fx = pasoHoy ? pickDatedPrimary(pasoHoy.fixtures) : null;
      if (fx?.competition.kind === 'league') {
        const encontrado = resolverClubDeCalendario(leagueClubs, fx.opponentName, myClub.league, 'league', fx.competition.name);
        if (encontrado) { rival = encontrado; soyLocal = fx.isHome; }
      }
    }
    if (!rival) {
      const upcoming = rivalDeLigaDelPaso(leagueClubs, myClub.name, playerProfile.currentWeek);
      if (!upcoming) return null;
      rival = leagueClubs.find(c => c.id === upcoming.opponentId) ?? null;
      soyLocal = upcoming.isHome;
    }
    if (!rival) return null;
    const { homeGoals, awayGoals } = soyLocal ? simulateMatch(myClub, rival) : simulateMatch(rival, myClub);
    const myGoals = soyLocal ? homeGoals : awayGoals;
    const rivalGoals = soyLocal ? awayGoals : homeGoals;
    return {
      rival, soyLocal, myGoals, rivalGoals,
      season: resolvePlayerWeekForLeague(season, leagueClubs, playerProfile.currentWeek, myClub.id,
        soyLocal, myGoals, rivalGoals, undefined, contextoRealDelPaso(myClub.name, playerProfile.currentWeek)),
      aviso: ` Sin ti en el campo, ${myClub.name} ${myGoals}-${rivalGoals} ${rival.name}.`,
    };
  };

  /** El historial con esa fecha anotada. Reemplaza la del mismo dia para no duplicar. */
  const historialCon = (r: DatedResult | null): DatedResult[] | undefined =>
    r ? [...(playerProfile?.datedResults ?? []).filter(x => x.date !== r.date), r]
      : playerProfile?.datedResults;

  /**
   * Si el próximo partido se juega solo.
   *
   * Se prende desde el botón "Simular partido" y se apaga al terminar, así que dura exactamente un
   * partido: la fecha siguiente vuelve a ofrecerte jugarlo. Es una decisión por partido, no un modo
   * en el que quedás encerrado.
   */
  const [simularEstePartido, setSimularEstePartido] = useState(false);

  const handleAdvanceWeek = (simular = false) => {
    setSimularEstePartido(simular);
    if (!playerProfile) return;

    // Lesión activa: no hay decisión de jugar/descansar que tomar, la semana se resuelve sola.
    // SALVO que hayas elegido forzar la vuelta (ver src/lesion.ts), que es justamente decidir que
    // sí jugás con la lesión encima. Las dos puertas al partido -- ésta y startMatchflow -- tienen
    // que consultar el MISMO criterio: si una dejara pasar y la otra no, quedarías encerrado sin
    // poder jugar ni avanzar la fecha.
    if (lesionTeDejaAfuera(playerProfile)) {
      resolveInjuredWeek();
      return;
    }

    if (playerProfile.energy < 20) {
      if (!confirm('Tu nivel de fatiga física es alarmante (Energía < 20). ¿Deseas arriesgarte a saltar al campo?')) {
        // Forzaste la vuelta pero al final no saltaste al campo: eso NO es un descanso cualquiera,
        // es una fecha de recuperación. Sin esto weeksRemaining no bajaría nunca por este camino y
        // la lesión quedaría congelada para siempre -- jugando siempre con el riesgo encima y sin
        // llegar jamás al alta. resolveInjuredWeek ya hace exactamente lo que corresponde acá.
        if (playerProfile.activeInjury && playerProfile.activeInjury.weeksRemaining > 0) {
          resolveInjuredWeek();
          return;
        }
        const miClubHoy = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
        const inWorldCupBreak = !!miClubHoy && !!torneoDeSeleccionesDelDia(miClubHoy.name, playerProfile.currentWeek);
        const isCup = !inWorldCupBreak && !!miClubHoy
          && esDiaDeCopa(miClubHoy.name, playerProfile.currentWeek);

        // Si esta semana te tocaba partido de LIGA DOMÉSTICA, ese partido no se cancela porque
        // vos descanses -- tu club lo juega igual, simulado sin vos (mismo criterio que una
        // sanción, ver resolveSuspendedLeagueWeek). Antes esto quedaba en manos del catch-up lazy
        // de leagueSeasons (sin persistir acá), así que el resultado de ESA fecha puntual nunca se
        // le mostraba al jugador -- se sentía como si el partido hubiera quedado "colgado" (bug
        // reportado: "a veces descansaba... y el partido se quedaba ahí").
        let updatedLeagueSeasons = playerProfile.leagueSeasons;
        let restResultMsg = '';
        // El resultado del partido que jugo el club sin vos, para que quede en el historial: de ahi
        // salen la racha y los marcadores del calendario. Ver resultadoDelClubSinVos.
        let resultadoDeHoy: DatedResult | null = null;
        if (!inWorldCupBreak && !isCup) {
          const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
          const leagueKey = leagueKeyFor(myClub);
          const leagueClubs = clubesDeLiga(leagueKey);
          const season = playerProfile.leagueSeasons[leagueKey] ?? getOrCreateSeasonForLeague(leagueClubs, undefined, playerProfile.currentWeek);
          const suyo = partidoDeLigaSinVos(myClub, leagueClubs, season);
          if (suyo) {
            updatedLeagueSeasons = { ...playerProfile.leagueSeasons, [leagueKey]: suyo.season };
            restResultMsg = suyo.aviso;
            resultadoDeHoy = resultadoDelClubSinVos(myClub, suyo.rival.name, suyo.myGoals, suyo.rivalGoals);
          }
        }

        const restSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false, playerProfile);
        const updated = {
          ...playerProfile,
          datedResults: historialCon(resultadoDeHoy),
          energy: Math.min(100, playerProfile.energy + 45),
          mentalHealth: Math.min(100, playerProfile.mentalHealth + 6), // descansar en vez de forzar la máquina te despeja la cabeza
          currentWeek: playerProfile.currentWeek + 1,
          playoffsDeLiga: playoffSinVosHoy() ?? playerProfile.playoffsDeLiga,
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
  // ACA VIVIA refuerzoQueTeTapa, que devolvia 14 * (1 - fechas/10): el refuerzo pesaba por ser
  // NUEVO y se apagaba solo a las diez fechas, metiera goles o no. O sea que no se le podia ganar el
  // puesto jugando bien -- habia que esperar. Ahora el peso sale de lo que el rival HIZO en la
  // cancha (ver estorboDelRival en src/rivalDePuesto.ts).

  function decideLineupStatus(reputation: number, prestige: number, starMode?: boolean, estorbo = 0): 'starter' | 'substitute' | 'not_called' {
    // Modo Superestrella: titular garantizado, sin importar el umbral de la reputation del club --
    // es la promesa central del modo (ver SetupScreen).
    if (starMode) return 'starter';
    // Umbral de prestige que un club de esa reputation exige para considerarte titular indiscutido.
    // El refuerzo sube la vara de la titularidad, no la de la convocatoria: por eso `estorbo` entra
    // SOLO aca. Un fichaje te puede mandar al banco, nunca dejarte fuera de la lista -- eso seria
    // perder fechas enteras por algo que no hiciste, y el peor caso tiene que seguir siendo jugable.
    const starterThreshold = 25 + reputation * 11 + estorbo; // ~36 (reputation 1) a ~80 (reputation 5)
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

    // Lesión activa (ver activeInjury/injuriesEnabled): corta acá, antes de ramificar por tipo de
    // partido -- una lesión no distingue si esta semana tocaba liga, copa o Mundial. La excepción
    // es forzar la vuelta (ver src/lesion.ts), que es exactamente la decisión de jugar lesionado.
    if (lesionTeDejaAfuera(playerProfile)) {
      resolveInjuredWeek();
      return;
    }

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
    // La ventana del Mundial la dice el CALENDARIO: son las fechas que él mismo le reservó al
    // torneo (11 de junio a 19 de julio del año que toca; ver reservarFechasDeMundial). Mientras
    // dura, la liga y las copas de clubes están paradas de verdad -- es la fecha FIFA más larga que
    // existe y el calendario ya les sacó esas fechas a los clubes.
    //
    // Antes era "un bloque de 9 semanas a partir de la semana 19 de la temporada". Como cada club
    // tiene una temporada de largo distinto -- entre 34 y 66 pasos -- esa semana 19 caía en un mes
    // distinto para cada uno: al Junior en mayo y a un club europeo en diciembre.
    //
    // Va DESPUÉS de myClubForSchedule a propósito: declararlo antes es el TDZ que ya dejó la
    // pantalla en blanco una vez.
    // El paron es de SELECCIONES, no solo del Mundial: en los anos del medio lo ocupan la Eurocopa
    // y la Copa America, y las ligas paran igual. Se llamaba inWorldCupBreak y valia true durante
    // la Euro, que es la clase de nombre que este proyecto viene sacando.
    const inWorldCupBreak = !!myClubForSchedule
      && !!torneoDeSeleccionesDelDia(myClubForSchedule.name, playerProfile.currentWeek);

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

    // Mismo criterio que usaCalendarioReal más abajo: el legado solo corre para clubes que NUNCA
    // tuvieron calendario real de fecha exacta, no para los que lo agotaron.
    // El calendario semanal legado (realSchedule.ts) se eliminó: llevaba su propio reloj de jornadas
    // y derivaba del calendario por fechas. Queda el array vacío para no cambiar la forma de abajo.
    const realWeekMatches: DatedFixture[] = [];

    // Los dos calendarios exponen la misma forma ({ opponentName, isHome, competition }), así que
    // de acá para abajo el código no distingue de cuál vino el partido: solo cambia la fuente.
    const realPrimary = datedPrimary;
    // El legado semanal (hasRealSchedule) solo puede tomar el control si el club NUNCA tuvo
    // calendario real de fecha exacta -- no cuando lo tuvo y ya se agotó (tieneFechasReales true,
    // usaFechasReales false). Antes, apenas se agotaba el calendario real de Flamengo (después del
    // 2 de diciembre), el juego caía al legado semanal en paralelo con el motor nuevo (que ya sabe
    // generar la temporada siguiente por su cuenta desde getOrCreateSeasonForLeague): dos relojes de
    // temporada compitiendo por el mismo club. Eso explicaba la Copa do Brasil que nunca se jugaba
    // (el legado no la tiene con bracket), la temporada que no cerraba nunca y el mismo próximo
    // partido repitiéndose. Bug reportado: "hice una carrera en Brasil... no se jugó la copa, y
    // tampoco se acabó nunca la temporada... salía el mismo próximo partido varias veces".
    const usaCalendarioReal = !!myClubForSchedule && usaFechasReales;

    // ¿Tu club está jugando una copa continental que el motor sí modela? El calendario importado
    // solo trae 36 clubes en Libertadores y no incluye a varios que el motor sí clasifica (Junior
    // entre ellos), así que preguntarle únicamente a realPrimary dejaba a esos clubes sin copa: en
    // las 13 semanas de copa del año el calendario devolvía un partido de liga y el jugador salía a
    // jugar Dimayor cuando le tocaba Libertadores.
    const clubEnCopaContinental = (() => {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
      if (!myClub) return false;

      // Antes acá decía: "con calendario propio, sus copas son las del calendario, el motor no le
      // agrega ninguna". Es falso, y era la raíz de que una copa se jugara sola.
      //
      // De los 64 participantes de Libertadores y Sudamericana, 38 no tienen NI UNA fecha de esa
      // copa en el calendario scrapeado -- el Santos entre ellos: está en la Sudamericana y su
      // calendario sólo trae Brasileirão y Copa do Brasil. Con la regla vieja, esos clubes quedaban
      // en tierra de nadie: el calendario no les daba partido de copa y el motor tenía prohibido
      // dárselo, pero igual les simulaba la copa de fondo. El jugador veía puntos, avance de ronda
      // y hasta su eliminación de un torneo que nunca jugó.
      //
      // Ahora la pregunta es por copa, no por club: el calendario manda donde tiene fechas, y donde
      // no las tiene manda el cuadro del motor. Una sola fuente por competición, nunca dos.
      // La pregunta es por la temporada EN CURSO, no por todas juntas: desde la 2 el calendario ya
      // no trae copas, así que preguntarle al histórico responde "sí, la cubre" por lo que hubo en
      // la 1 y el club se quedaría sin copa para siempre.
      const temporadaActual = temporadaDe(playerProfile, playerProfile.currentWeek);
      const laCubreElCalendario = (re: RegExp) =>
        usaFechasReales && competitionsForClubInSeason(myClub.name, temporadaActual).some(c => re.test(c.name));

      return (getLibertadoresParticipants(CLUBS_DATABASE).includes(myClub.id) && !laCubreElCalendario(/libertadores/i))
        || (getSudamericanaParticipants(CLUBS_DATABASE).includes(myClub.id) && !laCubreElCalendario(/sudamericana/i))
        || (getChampionsParticipants(CLUBS_DATABASE).includes(myClub.id) && !laCubreElCalendario(/champions/i))
        || (getEuropaParticipants(CLUBS_DATABASE).includes(myClub.id) && !laCubreElCalendario(/europa/i));
    })();

    // Fecha RESERVADA para COPA. Es una sola bolsa de días para todas: cuando llega, se pregunta en
    // orden -- ¿hay partido de copa continental?, ¿y de copa nacional?, ¿no? entonces descanso. Es
    // como funciona de verdad (el miércoles es de copa, la que te toque) y evita tener que adivinar
    // de antemano a qué torneo pertenece cada día, que es imposible: quién juega la Libertadores
    // depende de la tabla del año anterior y el calendario es una función pura del club.
    //
    // Ver RESERVAS DE COPA en dateSchedule.ts.
    //
    // Vale para las DOS clases de reserva. Antes sólo contaba la nacional, y por eso los días que el
    // calendario apartaba para la continental no entraban en la rama de copa: caían en la de LIGA
    // con isCopaLibertadores en true. Ahí el partido salía contra un rival que ponía el motor
    // sintético bajo el cartel de "Copa Sudamericana", handleFinishMatch se saltaba el bloque de
    // liga (que empieza con `!isCopaLibertadores`) y el resultado terminaba aplicándosele a la copa
    // que hubiera quedado activa de un día anterior. Medidos: 7 días así por temporada en el Junior
    // y en el Millonarios, 12 en el Atlético Nacional, 11 en el Flamengo. Reportado: "te decía
    // siguiente partido de Copa Libertadores y me metía a uno de Copa Colombia".
    const esReservaDeCopa = !!realPrimary?.esReservaDeCuadro
      && (realPrimary.competition.kind === 'domestic_cup'
        || realPrimary.competition.kind === 'continental_cup');

    // Si hoy es día de copa lo dice el CALENDARIO, y nadie más. Antes acá había un ternario con
    // isCupWeek de respaldo -- un reparto aritmético que decidía "2 de cada 5 semanas son de copa"
    // sin mirar el calendario de nadie -- para los clubes que no tenían fechas. Desde que sólo se
    // puede hacer carrera en clubes con calendario (ver clubesJugables.ts) ese respaldo no cubre a
    // nadie, y tener dos formas de contestar la misma pregunta era justamente el problema.
    const isCup = !inWorldCupBreak
      && (realPrimary?.competition.kind === 'continental_cup'
        || realPrimary?.competition.kind === 'domestic_cup');
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
    // Clave de la eliminatoria que se este jugando hoy, si hoy es fecha FIFA. Se guarda para que
    // handleFinishMatch sepa a que tabla aplicarle el resultado.
    let foundEliminatoriaKey: string | null = null;

    // --- FECHA FIFA: eliminatoria del Mundial ---------------------------------------------------
    //
    // Va ANTES que todo lo demas porque en el calendario la fecha FIFA le gana al partido del club
    // (national_tournament es la prioridad mas alta en pickPrimary): si hoy juega tu seleccion, te
    // vas con ella y tu club juega sin vos. Es lo que pasa de verdad.
    const esFechaFifa = !!myClubForSchedule
      && !inWorldCupBreak
      && realPrimary?.competition.id === 'eliminatorias';

    if (esFechaFifa) {
      const teamId = NATIONALITY_TO_WORLD_CUP_TEAM_ID[playerProfile.nationality];
      const conf = teamId ? CONFEDERACION_POR_SELECCION[teamId] : undefined;
      const anio = anioDeCarrera(myClubForSchedule!.name, playerProfile.currentWeek);
      const ciclo = cicloDeEliminatorias(anio);
      // La regla vive en src/convocatoria.ts y NO se repite acá. Antes estaba escrita inline en
      // este mismo punto, pero ahora hay un segundo lugar que necesita la misma respuesta: el feed,
      // que anuncia la lista ANTES de la fecha. Con dos copias se desincronizarían tarde o temprano
      // y el diario te pondría en una nómina a la que el juego después no te lleva -- un anuncio que
      // miente rompe más confianza que un anuncio que falta.
      //
      // (El umbral de ELIMINATORIAS es más bajo que el del Mundial a propósito: a la selección se
      // entra por eliminatorias y después vas al Mundial, no al revés.)
      const convocado = evaluarConvocatoria(playerProfile, anio).convocado;

      if (convocado && ciclo) {
        const clave = `${conf}-${ciclo.mundial}`;
        const guardada = playerProfile.eliminatorias?.[clave];
        const puesta = ponerAlDiaLaEliminatoria(
          guardada ?? crearEliminatoria(conf!, ciclo.mundial, ALL_NATIONAL_TEAMS_DATABASE),
          ALL_NATIONAL_TEAMS_DATABASE,
          pasosDeEliminatoriasTranscurridos(myClubForSchedule!.name, playerProfile.currentWeek),
          teamId,
        );
        const proximo = proximoPartidoDeEliminatoria(puesta, teamId!);
        if (proximo) {
          const rival = ALL_NATIONAL_TEAMS_DATABASE.find(t => t.id === proximo.opponentId);
          opName = rival?.name ?? '';
          opClubId = proximo.opponentId;
          isHomeThisMatch = proximo.isHome;
          foundWorldCupTeamId = teamId!;
          foundEliminatoriaKey = clave;
          const zona = zonaDe(puesta, teamId!);
          setActiveCompetitionName(`Eliminatorias ${ciclo.mundial}${zona ? ` · ${zona}` : ''} · Fecha ${proximo.fecha}`);
          setActiveCupId(null); setActiveUefaCupId(null); setActiveDomesticCup(false);
          setActiveGlobalScoreLabel(null); setActiveTorneoLabel(null);
          // La posicion en la tabla de la eliminatoria: es lo que se mira en una eliminatoria.
          const tabla = tablaDeEliminatoria(puesta, teamId!);
          const miIdx = tabla?.findIndex(r => r.clubId === teamId) ?? -1;
          const suIdx = tabla?.findIndex(r => r.clubId === proximo.opponentId) ?? -1;
          setActiveMyTablePosition(miIdx >= 0 ? miIdx + 1 : null);
          setActiveRivalTablePosition(suIdx >= 0 ? suIdx + 1 : null);
          setActiveLeagueTeamCount(tabla?.length ?? null);
          setPlayerProfile(p => ({ ...p, eliminatorias: { ...(p.eliminatorias ?? {}), [clave]: puesta } }));
        }
      }
    }

    if (inWorldCupBreak) {
      // Los tres torneos de selecciones pasan por aca: el Mundial y, en los anos del medio, la
      // Eurocopa o la Copa America segun tu nacionalidad. Ver torneoDeSeleccionesDeHoy, que es
      // quien contesta cual es y con quienes se juega.
      const hoy = torneoDeSeleccionesDeHoyEnApp(playerProfile, myClubForSchedule?.name ?? '');
      const wcTeamId = hoy?.miSeleccionId;
      const isEligible = !!hoy
        && playerProfile.prestige >= WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD
        && playerProfile.careerStats.partidosHistoricos >= WORLD_CUP_CALLUP_MIN_MATCHES;

      const upcoming = isEligible && hoy
        ? getUpcomingWorldCupMatch(
            getOrCreateWorldCupState(temporadaDe(playerProfile, playerProfile.currentWeek), hoy.equipos,
              playerProfile.worldCups[hoy.clave], hoy.pasos, hoy.torneo),
            hoy.miSeleccionId)
        : null;

      if (upcoming && hoy) {
        const opponentTeam = hoy.equipos.find(t => t.id === upcoming.opponentId);
        opName = opponentTeam?.name || '';
        opClubId = upcoming.opponentId;
        isHomeThisMatch = upcoming.isHome;
        foundWorldCupTeamId = wcTeamId;
        setActiveCupId(null);
        setActiveUefaCupId(null);
        setActiveCompetitionName(null);
        setActiveDomesticCup(false);
        setActiveGlobalScoreLabel(null);
        setActiveTorneoLabel(null);
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
        const restSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, true, true, playerProfile);
        const updated = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 20),
          currentWeek: playerProfile.currentWeek + 1,
          playoffsDeLiga: playoffSinVosHoy() ?? playerProfile.playoffsDeLiga,
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
        // El cartel nombra el torneo que de verdad para la actividad. Decia "el Mundial" siempre, y
        // en los anos del medio el paron es de la Eurocopa y la Copa America.
        notify(`📅 FECHA FIFA: ${nombreDelParonDeSelecciones(playerProfile, myClubForSchedule?.name ?? '')} paraliza la actividad de clubes. Esta fecha no hay partido de liga ni de copa para tu club.`);
        return;
      }
    } else if (
      isCup && usaCalendarioReal && realPrimary
      // El partido real tiene que ser DE COPA. Sin este chequeo, un club que juega copa según el
      // motor pero no figura en el calendario de esa copa (Junior en Libertadores) entraba acá con
      // un partido de liga y lo jugaba rotulado como copa.
      && (realPrimary.competition.kind === 'continental_cup' || realPrimary.competition.kind === 'domestic_cup')
      // Una fecha RESERVADA no trae rival: el calendario sólo apartó el día. El cruce lo pone el
      // cuadro, así que cede el paso a la rama de abajo.
      && !realPrimary.esReservaDeCuadro
      // Si es copa NACIONAL y viene del calendario semanal LEGADO (sin datedPrimary, es decir sin
      // fecha real verdadera) para un país que ya tiene el bracket real de copaNacional.ts, cede el
      // paso: ese legado es un calendario semanal fijo de 2024 sin eliminación (todo "round":
      // "Schedule", nunca hay Final ni campeón), y capturaba el partido antes de que el bracket real
      // (con ida/vuelta, sorteo y coronación) llegara a ejecutarse nunca. Bug reportado: el jugador
      // veía "Copa Colombia" contra un rival fijo semanal en vez del cruce real del cuadro.
      && !(realPrimary.competition.kind === 'domestic_cup' && !datedPrimary
        && tieneCopaNacionalReal(CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)?.league ?? ''))
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
      // En una copa hay que decir QUÉ RONDA es: no es lo mismo unos octavos que una final, y el
      // dato ya venía en el calendario (`round` de Transfermarkt) sin usarse. Los partidos que
      // arma el cuadro del motor ya lo mostraban; los que salen del calendario, no.
      setActiveCompetitionName(rotuloDeRonda(nombre, realPrimary.match.round));
      setActiveMyTablePosition(null);
      setActiveRivalTablePosition(null);
      setActiveLeagueTeamCount(null);

      // Global de la llave, ANTES de jugar. La suma ya se calculaba para coronar campeón al cerrar
      // la vuelta (ver handleFinishMatch), pero el jugador entraba a la vuelta de una Copa do Brasil
      // sin ver con qué resultado llegaba: el rótulo "Global" sólo aparecía en las copas del cuadro
      // sintético, no en las que salen del calendario real.
      //
      // Mismo criterio que la coronación, así que no puede decir una cosa acá y otra al final:
      // partidosDeLaMismaLlave da las fechas anteriores contra el mismo rival en la misma temporada,
      // y los marcadores salen de datedResults -- que incluye las fechas que el club resolvió sin
      // vos. En la ida no hay nada que sumar todavía y se deja en null.
      const idasPrevias = partidosDeLaMismaLlave(myClubForCup?.name ?? '', realPrimary.competition.id, realPrimary.date);
      const jugadasPrevias = (playerProfile.datedResults ?? [])
        .filter(r => r.competition === nombre && idasPrevias.includes(r.date));
      if (jugadasPrevias.length > 0) {
        const misGoles = jugadasPrevias.reduce((n, r) => n + r.myGoals, 0);
        const susGoles = jugadasPrevias.reduce((n, r) => n + r.rivalGoals, 0);
        setActiveGlobalScoreLabel(`${misGoles}-${susGoles}`);
      } else {
        setActiveGlobalScoreLabel(null);
      }
    } else if (isCup && (!usaFechasReales || clubEnCopaContinental || esReservaDeCopa)) {
      // Copa armada por el cuadro del motor. Corre en tres casos:
      //
      //   1. El club no tiene fechas reales cargadas (el caso de siempre).
      //   2. El club SÍ las tiene, pero su calendario no cubre esta copa (clubEnCopaContinental).
      //      Ver el comentario largo de ese flag: son 38 de 64 participantes de las copas Conmebol.
      //      Sin este segundo caso quedaban en tierra de nadie -- ni partido del calendario ni
      //      partido del cuadro -- y la copa avanzaba sola de fondo.
      //   3. Hoy es una fecha RESERVADA para la copa nacional (esReservaDeCopa). El
      //      calendario apartó el día y el cuadro pone el rival. Sin este tercer caso la rama no se
      //      alcanzaba NUNCA para un club con calendario real -- fixturesAtStep le da partido en
      //      todos los pasos -- y por eso ninguna copa nacional llegaba a coronar campeón.
      //
      // Lo que sigue sin poder pasar es que las dos fuentes se peleen el turno: la rama de arriba
      // atiende primero y sólo se llega acá si el calendario NO trajo un partido de copa hoy.
      const year = temporadaDe(playerProfile, playerProfile.currentWeek);
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;

      const cupCampeones = {
        libertadores: playerProfile.campeonesContinentales?.[`libertadores-${year - 1}`] ?? null,
        sudamericana: playerProfile.campeonesContinentales?.[`sudamericana-${year - 1}`] ?? null,
      };
      const libertadoresIds = new Set(getLibertadoresParticipants(CLUBS_DATABASE, year, playerProfile.posicionesFinales, cupCampeones));
      const sudamericanaIds = new Set(getSudamericanaParticipants(CLUBS_DATABASE, year, playerProfile.posicionesFinales, cupCampeones));
      // La copa CONTINENTAL tiene prioridad sobre la nacional en un día de copa, igual que en el
      // calendario real. Antes acá se la bloqueaba en las fechas reservadas, porque con una bolsa
      // de 12 días la continental se comía los de la nacional y ésta se quedaba sin terminar. Ya no
      // hace falta: los clubes que juegan copa internacional tienen bolsa de 22 (ver
      // FECHAS_DE_COPA_CONTINENTAL), que alcanza para las dos.
      // La Concacaf entra por el mismo camino que las dos de Conmebol: comparte CupState, cuadro y
      // pantalla. Lo unico distinto es que arranca directo en eliminacion directa, sin grupos.
      const concacafIds = new Set(getConcacafParticipants(CLUBS_DATABASE, year, playerProfile.posicionesFinales));
      const qualifiedCupId: 'libertadores' | 'sudamericana' | 'concacaf' | null = libertadoresIds.has(myClub.id)
        ? 'libertadores'
        : sudamericanaIds.has(myClub.id)
        ? 'sudamericana'
        : concacafIds.has(myClub.id)
        ? 'concacaf'
        : null;

      // Posición en la tabla de grupo/fase de liga de la copa continental (si aplica): antes esto
      // siempre quedaba en null para cualquier semana de copa -- eso hacía que ni el marcador del
      // partido ("Tu Equipo · N°" / "Rival · N°") ni el pressureMultiplier reflejaran nunca la
      // tabla real de grupos de Libertadores/Sudamericana/Champions/Europa, aunque fueras líder
      // invicto o colista (bug reportado: "ganar en Libertadores no se refleja en la tabla").
      let cupMyPos: number | null = null;
      let cupRivalPos: number | null = null;
      // Se arranca en null y lo recalcula la rama que corresponda: desde octavos, tanto la Conmebol
      // como la Champions van a ida y vuelta y la vuelta necesita mostrar cómo va el global.
      setActiveGlobalScoreLabel(null);
      // Semana de copa: no hay Apertura/Clausura que mostrar.
      setActiveTorneoLabel(null);
      let cupTeamCount: number | null = null;

      // DE QUIÉN ES EL DÍA.
      //
      // El calendario le reserva días a CADA copa por separado: al Millonarios, 10 para la Copa
      // BetPlay y 7 para la Sudamericana. Hasta acá la continental preguntaba primero y se los
      // quedaba TODOS -- entre fecha y fecha siempre tiene un cruce pendiente esperando --, así que
      // el cuadro nacional no arrancaba hasta que sobraran días al final del año, y para entonces
      // se dimensionaba a lo que quedaba. Medido con el Junior y con el Millonarios: la Copa BetPlay
      // se reducía a una FINAL suelta de dos partidos. De ahí venía que el cartel del global no
      // apareciera nunca en las copas domésticas -- casi no llegabas a jugar una vuelta.
      //
      // Ahora el día lo estrena la copa que lo PIDIÓ, que es como lo repartió el calendario. La
      // otra lo hereda igual cuando aquélla no tiene nada ese día (el orden de abajo sigue intacto),
      // así que ninguna se queda a medio camino. Es el mismo reparto que usa
      // scripts/jugar_carrera.ts, que por eso jugaba las diez fechas de Copa BetPlay del Junior.
      const laNacionalTieneCruceHoy = duenoDelDiaDeCopa(
        playerProfile, myClub, playerProfile.currentWeek,
        !!realPrimary?.esReservaDeCuadro && realPrimary.competition.kind === 'domestic_cup',
      ) === 'nacional';

      let foundOpponentId: string | null = null;
      let eliminatedFromQualifiedCup = false;
      if (qualifiedCupId && !laNacionalTieneCruceHoy) {
        const cupKey = `${qualifiedCupId}-${year}`;
        // myClub.id NO es opcional acá: sin él la copa se adelanta hasta el paso que le toca por
        // conteo de semanas, aunque el jugador tenga un partido suyo sin jugar. Reportado: ganar el
        // PRIMER partido de la fase de grupos y que salte "eliminado en octavos" acto seguido --
        // el motor se había comido la fase de grupos entera de fondo. Ver getOrCreateCupState.
        const cup = getOrCreateCupState(qualifiedCupId, year, CLUBS_DATABASE, playerProfile.continentalCups[cupKey], fechasDeCopaTranscurridas(myClub.name, playerProfile.currentWeek, true, NOMBRE_DE_COPA[qualifiedCupId]), playerProfile.posicionesFinales, cupCampeones, myClub.id, grupoDelCalendario(qualifiedCupId, myClub, year, playerProfile.posicionesFinales, cupCampeones), repescadosDeLaLibertadores(playerProfile, year));
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
          } else if (cup.stage === 'knockout' && cup.knockout) {
            // Desde octavos la Conmebol va a IDA Y VUELTA (la final, a partido único en cancha
            // neutral). Hay que decir en qué ronda estás, qué pierna se juega y cómo va el global:
            // sin esto el partido salía rotulado "Copa Libertadores" a secas, sin ninguna de las
            // tres cosas, que en una eliminatoria es justo lo que se necesita saber.
            const llaves = cup.knockout.tiesByRound[cup.knockout.tiesByRound.length - 1];
            const miLlave = llaves?.find(t => t.clubAId === myClub.id || t.clubBId === myClub.id);
            const nombreCopa = qualifiedCupId === 'sudamericana' ? 'Copa Sudamericana'
              : qualifiedCupId === 'concacaf' ? 'Concacaf Champions Cup'
              : 'Copa Libertadores';
            const ronda = roundLabelByMatchCount(llaves?.length ?? 0);
            if (miLlave?.partidoUnico) {
              setActiveCompetitionName(`${nombreCopa} · ${ronda}`);
            } else if (miLlave) {
              const soyA = miLlave.clubAId === myClub.id;
              const idaJugada = miLlave.firstLegGoalsA !== null && miLlave.firstLegGoalsB !== null;
              setActiveCompetitionName(`${nombreCopa} · ${ronda} (${idaJugada ? 'Vuelta' : 'Ida'})`);
              if (idaJugada) {
                const misGoles = (soyA ? miLlave.firstLegGoalsA : miLlave.firstLegGoalsB) ?? 0;
                const susGoles = (soyA ? miLlave.firstLegGoalsB : miLlave.firstLegGoalsA) ?? 0;
                setActiveGlobalScoreLabel(`${misGoles}-${susGoles}`);
              }
            }
          }
        }
      }
      setActiveCupId(foundOpponentId ? qualifiedCupId : null);

      // Si el club no juega Libertadores/Sudamericana (ligas sudamericanas), probamos Champions/Europa League.
      let foundUefaOpponentId: string | null = null;
      if (!foundOpponentId && !laNacionalTieneCruceHoy) {
        const championsIds = new Set(getChampionsParticipants(CLUBS_DATABASE));
        const europaIds = new Set(getEuropaParticipants(CLUBS_DATABASE));
        const qualifiedUefaCupId: 'champions' | 'europa' | null = championsIds.has(myClub.id)
          ? 'champions'
          : europaIds.has(myClub.id)
          ? 'europa'
          : null;

        if (qualifiedUefaCupId) {
          const uefaCup = getOrCreateUefaCupState(qualifiedUefaCupId, CLUBS_DATABASE, playerProfile.uefaCups[qualifiedUefaCupId], fechasDeCopaTranscurridas(myClub.name, playerProfile.currentWeek, false, NOMBRE_DE_COPA_UEFA[qualifiedUefaCupId]), undefined, undefined, myClub.id);
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

            // Champions/Europa van a ida y vuelta desde octavos, igual que la Conmebol de arriba:
            // mismo cálculo de global que la copa nacional.
            if (uefaCup.stage === 'knockout') {
              const miLlaveUefa = uefaCup.knockout?.tiesByRound[uefaCup.knockout.tiesByRound.length - 1]
                ?.find(t => t.clubAId === myClub.id || t.clubBId === myClub.id);
              if (miLlaveUefa) {
                const soyA = miLlaveUefa.clubAId === myClub.id;
                const idaJugada = miLlaveUefa.firstLegGoalsA !== null && miLlaveUefa.firstLegGoalsB !== null;
                if (idaJugada) {
                  const misGoles = (soyA ? miLlaveUefa.firstLegGoalsA : miLlaveUefa.firstLegGoalsB) ?? 0;
                  const susGoles = (soyA ? miLlaveUefa.firstLegGoalsB : miLlaveUefa.firstLegGoalsA) ?? 0;
                  setActiveGlobalScoreLabel(`${misGoles}-${susGoles}`);
                }
              }
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
      // `!esReservaDeCopa` es clave desde que las fechas de copa son UNA SOLA BOLSA: si hoy es un
      // día de copa reservado y ya te eliminaron de la continental, ese día le toca a la copa
      // NACIONAL, no a un descanso. Cortar acá se la robaba. El descanso de verdad se decide más
      // abajo, recién cuando tampoco hay cruce nacional que jugar.
      if (eliminatedFromQualifiedCup && !foundOpponentId && !foundUefaOpponentId && !esReservaDeCopa) {
        const restSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false, playerProfile);
        const updated = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 20),
          currentWeek: playerProfile.currentWeek + 1,
          playoffsDeLiga: playoffSinVosHoy() ?? playerProfile.playoffsDeLiga,
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
        // La temporada de la copa la manda el CALENDARIO, no el contador de semanas. getSeasonYear
        // cuenta 52 semanas por año, pero acá un paso es una fecha con partido y el Junior tiene 63
        // en 2026: pasada la número 52, el contador ya decía "temporada 2" y la clave de la copa
        // cambiaba EN MEDIO de la edición -- el cuadro se reiniciaba solo y el jugador volvía a
        // dieciseisavos con la copa a mitad de camino.
        // La clave sale de claveDeCopaNacional y no se arma acá: se construía en cinco lugares con
        // tres fórmulas distintas, y es la clave que decide a qué EDICIÓN se le escribe tu
        // resultado. Si dos de esos lugares no coinciden, el partido se juega en una edición y se
        // guarda en otra, y el cuadro no avanza nunca.
        const temporadaDeCopa = myClubForCup
          ? (temporadaDelPaso(myClubForCup.name, playerProfile.currentWeek)?.temporada ?? year)
          : year;
        const cupKey = myClubForCup ? claveDeCopaNacional(myClubForCup, playerProfile.currentWeek) : null;
        let cupCruce: ReturnType<typeof cruceActual> = null;
        // Se guarda afuera para poder seguir avanzando el cuadro en las fechas en las que el
        // jugador ya no juega (ver el día de descanso más abajo).
        let cupNacional: ReturnType<typeof crearCopaNacional> | null = null;
        if (myClubForCup && cupKey) {
          // El cuadro se dimensiona a las FECHAS QUE QUEDAN, no al revés. Cada ronda son dos
          // partidos (ida y vuelta), así que con N fechas entran floor(N/2) rondas y 2^rondas
          // clubes. Si el cuadro natural del país ya entra en ese presupuesto no se recorta nada.
          //
          // Importa sobre todo en la temporada 1, que arranca el 12 de enero -- a media temporada
          // europea. Al Manchester City le quedan 4 fechas de FA Cup: un cuadro de 32 necesita 10 y
          // moría sin final. Con 4 fechas se arma uno de 4 y se corona igual, que además es lo que
          // pasa de verdad (cuando empezás la carrera, la copa ya va por cuartos).
          //
          // Los rivales son los clubes más fuertes del país: de ellos el calendario real no dice
          // nada, así que se sortea -- generar, pero con lógica.
          //
          // Y TU CLUB entra siempre. El cuadro se recorta a la potencia de 2 de abajo (36 clubes
          // colombianos -> 32), y ese recorte se llevaba por delante a los cuatro de menor
          // reputación: no jugaban la Copa BetPlay ninguna temporada, para siempre, sin que nada se
          // lo dijera al jugador. Medido: 28 club-temporadas sin un solo partido de copa.
          // El sorteo de la edicion vive en copaNacionalDelPaso, no aca: la tarjeta del proximo
          // partido necesita armar EL MISMO cuadro para poder anunciar el rival, y con el sorteo
          // escrito solo de este lado no le quedaba mas que decir "Rival por definir".
          let cup = playerProfile.domesticCups?.[cupKey]
            ?? copaNacionalDelPaso(playerProfile, myClubForCup, CLUBS_DATABASE, playerProfile.currentWeek)
            ?? crearCopaNacional(myClubForCup.league, temporadaDeCopa, CLUBS_DATABASE, divisionDeClub(playerProfile));

          // Ronda anterior ya completa: se arma la siguiente ANTES de preguntar por el cruce. Sin
          // esto cruceActual devolvía la llave YA JUGADA -- sigueEnCopa da true porque la ganaste --
          // y el jugador la disputaba de nuevo contra el mismo rival, con un resultado que el motor
          // después descartaba. Un partido fantasma en cada cambio de ronda.
          //
          // Se ARMA y nada más. Acá se llamaba a resolverPasoCopaNacional, que además de armar la
          // ronda le resuelve una pierna: la IDA de cada ronda nueva se jugaba sola, y el jugador
          // entraba directo a un partido rotulado "(Vuelta)" con un global que venía de un partido
          // que nunca disputó. Un partido perdido por ronda, en todas las copas nacionales.
          cup = prepararRondaCopaNacional(cup);
          if (playerProfile.domesticCups?.[cupKey] !== cup) {
            const cupGuardada = cup;
            setPlayerProfile(prev => prev && ({ ...prev, domesticCups: { ...(prev.domesticCups ?? {}), [cupKey]: cupGuardada } }));
          }
          cupNacional = cup;

          // Con campeón coronado la edición terminó: las fechas que sobren ya no son de copa.
          // sigueEnCopa devuelve true para el campeón (sigue, porque ganó), así que sin este corte
          // el campeón salía a jugar la final otra vez.
          cupCruce = !cup.championId && sigueEnCopa(cup, myClubForCup.id)
            ? cruceActual(cup, myClubForCup.id)
            : null;
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
              // Global visible en la pantalla de partido: en la ida no hay nada que mostrar
              // (ninguna pierna jugada todavía), en la vuelta se arma sumando ambas piernas.
              if (esIda) {
                setActiveGlobalScoreLabel(null);
              } else {
                const soyA = cupCruce.clubAId === myClubForCup.id;
                const misGoles = (soyA ? cupCruce.firstLegGoalsA : cupCruce.firstLegGoalsB) ?? 0;
                const susGoles = (soyA ? cupCruce.firstLegGoalsB : cupCruce.firstLegGoalsA) ?? 0;
                setActiveGlobalScoreLabel(`${misGoles}-${susGoles}`);
              }
            }
          }
        }

        // Fecha reservada para la copa y sin cruce que jugar: ya saliste campeón, te eliminaron, o
        // el cuadro terminó antes de que se acabaran las fechas apartadas. El día queda libre DE
        // VERDAD.
        //
        // Antes acá se inventaba un amistoso contra un rival al azar del país, y eso es exactamente
        // el "partido fantasma" que hay que evitar: un partido que no existe en ningún torneo, que
        // no cuenta para nada y que igual te gasta energía. La reserva no es una obligación de
        // jugar, es un día que el calendario tenía apartado por si la copa lo necesitaba.
        if (esReservaDeCopa && !cupCruce) {
          const restSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false, playerProfile);

          // El torneo sigue sin vos. Antes el cuadro sólo avanzaba cuando el jugador tenía partido,
          // así que apenas lo eliminaban la copa se congelaba a mitad de camino y NADIE salía
          // campeón -- el club que te ganó tampoco. Medido: de 12 ediciones, 6 terminaban sin
          // coronar a nadie. Ahora cada fecha reservada que no jugás resuelve una pierna del resto
          // del cuadro, y la copa llega a su final igual.
          let cupsDelPais = playerProfile.domesticCups;
          if (cupKey && cupNacional && !cupNacional.championId) {
            cupsDelPais = { ...(playerProfile.domesticCups ?? {}), [cupKey]: resolverPasoCopaNacional(cupNacional, CLUBS_DATABASE) };
          }

          const updated = {
            ...playerProfile,
            energy: Math.min(100, playerProfile.energy + 20),
            currentWeek: playerProfile.currentWeek + 1,
            playoffsDeLiga: playoffSinVosHoy() ?? playerProfile.playoffsDeLiga,
            matchesWithoutRest: 0,
            continentalCups: restSync.continentalCups,
            uefaCups: restSync.uefaCups,
            domesticCups: cupsDelPais,
          };
          const aged = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);
          if (isPastRetirementAge(aged)) {
            resolveRetirementCheckpoint(aged);
            return;
          }
          setPlayerProfile(aged);
          saveGameState(aged, shopItems);
          notify(`📅 Fecha de ${nombreCopaNacional(myClubForCup?.league ?? '')} sin partido para tu club. Semana de descanso.`);
          return;
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
          // Rival suelto (eliminado, o liga sin copa modelada): no hay llave, no hay global.
          setActiveGlobalScoreLabel(null);
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
      // Y los de copa CONTINENTAL también, por la misma razón y con peores consecuencias: no es un
      // rótulo, es a qué torneo va el resultado. handleFinishMatch le aplica el marcador a
      // activeCupId/activeUefaCupId, así que un id que quedó pegado de un día de copa anterior le
      // mete un partido de liga a la Libertadores. Las otras cinco ramas de este if los setean
      // siempre; ésta era la única que los dejaba como estaban.
      setActiveCupId(null);
      setActiveUefaCupId(null);
      // El global se recalcula más abajo SOLO si el partido de hoy resulta ser un playoff a ida y
      // vuelta (Colombia/Argentina); si es fase regular se queda en null.
      setActiveGlobalScoreLabel(null);
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const leagueKey = leagueKeyFor(myClub);
      const leagueClubs = clubesDeLiga(leagueKey);
      const season = playerProfile.leagueSeasons[leagueKey] ?? getOrCreateSeasonForLeague(leagueClubs, undefined, playerProfile.currentWeek);
      const upcoming = rivalDeLigaDelPaso(leagueClubs, myClub.name, playerProfile.currentWeek);

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
        let opponentClub = upcoming ? leagueClubs.find(c => c.id === upcoming.opponentId) : undefined;
        let isHomeSancion = upcoming?.isHome ?? true;
        // Mismo criterio que el flujo principal: el calendario real manda. Va SIN exigir `upcoming`
        // -- con la deriva entre los dos relojes el motor puede no tener fixture para su jornada
        // mientras el calendario real sí tiene fecha, y en ese caso la sanción tiene que consumirse
        // igual contra el rival real, no saltearse.
        let hayFechaReal = false;
        if (hasDatedLeagueSchedule(myClub.name)) {
          const pasoHoy = fixturesAtStep(myClub.name, playerProfile.currentWeek);
          const fx = pasoHoy ? pickDatedPrimary(pasoHoy.fixtures) : null;
          if (fx?.competition.kind === 'league') {
            const rivalReal = resolverClubDeCalendario(leagueClubs, fx.opponentName, myClub.league, 'league', fx.competition.name);
            if (rivalReal) { opponentClub = rivalReal; isHomeSancion = fx.isHome; hayFechaReal = true; }
          }
        }
        if ((upcoming || hayFechaReal) && opponentClub) {
          resolveSuspendedLeagueWeek(myClub, leagueKey, leagueClubs, season, isHomeSancion, opponentClub);
        } else {
          advanceSuspendedIdleWeek(myClub, leagueKey, leagueClubs, season);
        }
        return;
      }

      // El calendario real es la ÚNICA fuente de verdad de contra quién jugás hoy.
      //
      // Antes esto estaba al revés: el motor sintético (`upcoming`) decidía si había partido y
      // contra quién, y el calendario real solo lo "pisaba" después, ya adentro del if. El problema
      // es que los dos llevan relojes DISTINTOS -- leagueMatchweeksElapsed cuenta semanas de 52
      // salteando semanas de copa fijas, mientras que el calendario real cuenta FECHAS con partido --
      // y derivan hasta el doble: en el Brasileirão la fecha 38 real cae en la jornada 20 sintética.
      // Con esa deriva, si el motor no encontraba fixture para su jornada (`upcoming` null) el
      // partido REAL no se jugaba, y en las fechas en que el calendario real marcaba copa el rival
      // quedaba siendo el del motor. Bug reportado: "jugué el Brasileirão y para la segunda parte de
      // la temporada me decía un partido y se jugaba otro".
      //
      // Se busca dentro de leagueClubs (la propia liga) y no en toda la base: hay nombres duplicados
      // entre países -- "Athletic Club" existe en Brasil y en España -- y un find() global devolvía
      // el primero, metiendo un club brasileño en LaLiga.
      let rivalDeCalendarioReal = usaCalendarioReal && realPrimary?.competition.kind === 'league'
        ? resolverClubDeCalendario(
            leagueClubs, realPrimary.opponentName, myClub.league, 'league', realPrimary.competition.name)
        : null;

      // PLAYOFF DE LIGA (cuadrangulares de Colombia, fase final argentina).
      //
      // El calendario dice CUÁNDO -- esas fechas ya vienen marcadas como esPlayoff -- pero el rival
      // lo pone el CUADRO, sembrado con los ocho primeros de la tabla de la fase regular. Es de lo
      // que se trata: hasta ahora quién los jugaba en las temporadas generadas lo decidía la
      // permutación de nombres del calendario, así que al club que heredaba el lugar de un
      // finalista le tocaba la final todos los años sin importar cómo le había ido.
      //
      // Mismo reparto que en las copas: el calendario pone el día, el cuadro pone el rival.
      const esFechaDePlayoff = !!realPrimary?.esPlayoff;
      let brackedDelPlayoff: TwoLegBracket | undefined;
      let clavePlayoff = '';
      // La llave que se juega HOY. Se guarda afuera del bloque porque más abajo hacen falta dos
      // cosas suyas -- la localía y el global -- y hasta ahora las dos se buscaban en el cuadro
      // EQUIVOCADO: el del motor (season.twoLegKnockout), que se siembra por su cuenta y no es el
      // que puso el rival de la pantalla.
      let cruceDelPlayoffHoy: TwoLegTie | null = null;
      if (esFechaDePlayoff && datedStep) {
        clavePlayoff = clavePlayoffDeLiga(myClub, playerProfile.currentWeek, datedStep.date);
        brackedDelPlayoff = prepararPlayoffDeLiga(
          playerProfile.playoffsDeLiga?.[clavePlayoff], season.table,
          fechasDePlayoffDelTorneo(myClub.name, datedStep.date));
        if (playerProfile.playoffsDeLiga?.[clavePlayoff] !== brackedDelPlayoff) {
          const guardar = brackedDelPlayoff;
          setPlayerProfile(prev => prev && ({ ...prev, playoffsDeLiga: { ...(prev.playoffsDeLiga ?? {}), [clavePlayoff]: guardar } }));
        }

        const cruce = crucePlayoffDeLiga(brackedDelPlayoff, myClub.id);
        cruceDelPlayoffHoy = cruce;
        if (cruce) {
          const rivalId = cruce.clubAId === myClub.id ? cruce.clubBId : cruce.clubAId;
          const rival = leagueClubs.find(c => c.id === rivalId);
          if (rival) {
            rivalDeCalendarioReal = rival;
            // La localía la manda la LLAVE, no el calendario: en la ida es local el clubA y en la
            // vuelta se invierte. Es el mismo cuidado que ya hubo que tener en la copa nacional.
            const esIda = cruce.firstLegGoalsA === null;
            isHomeThisMatch = esIda ? cruce.clubAId === myClub.id : cruce.clubBId === myClub.id;
            setActiveCompetitionName(`${rondaDelPlayoff(brackedDelPlayoff)} (${esIda ? 'Ida' : 'Vuelta'})`);
          }
        } else {
          // Quedaste afuera del cuadro (no entraste al top 8, o te eliminaron): esa fecha no es
          // tuya. El torneo sigue sin vos y el día queda libre, igual que en las copas.
          const bracketSinVos = brackedDelPlayoff && !brackedDelPlayoff.championId
            ? resolverPasoPlayoffDeLiga(brackedDelPlayoff, leagueClubs)
            : brackedDelPlayoff;
          const updated = {
            ...playerProfile,
            energy: Math.min(100, playerProfile.energy + 20),
            currentWeek: playerProfile.currentWeek + 1,
            matchesWithoutRest: 0,
            playoffsDeLiga: bracketSinVos
              ? { ...(playerProfile.playoffsDeLiga ?? {}), [clavePlayoff]: bracketSinVos }
              : playerProfile.playoffsDeLiga,
          };
          const aged = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);
          if (isPastRetirementAge(aged)) { resolveRetirementCheckpoint(aged); return; }
          setPlayerProfile(aged);
          saveGameState(aged, shopItems);
          notify('🏁 Los cuadrangulares se juegan sin tu club. Semana de descanso.');
          return;
        }
      }

      if (rivalDeCalendarioReal || upcoming) {
        // La TABLA la sigue llevando el motor (necesita simular los otros 19 partidos de la fecha),
        // pero el partido del jugador sale del calendario real siempre que exista.
        const esPartidoDeCalendarioReal = !!rivalDeCalendarioReal;
        if (rivalDeCalendarioReal) {
          opName = rivalDeCalendarioReal.name;
          opClubId = rivalDeCalendarioReal.id;
          // En un día de cuadrangular la localía la manda la LLAVE, no el calendario, y ya se
          // calculó arriba: en la ida es local el clubA y en la vuelta se invierte. Los días
          // reservados vienen todos marcados `isHome: true` -- no tienen rival todavía, mal podrían
          // saber dónde se juega --, así que pisar la localía de la llave con la del calendario te
          // ponía de local en las dos piernas de todas las llaves. El motor sí la anotaba bien (ver
          // soyLocalEnLaLlave en handleFinishMatch), o sea que la pantalla decía una cosa y la tabla
          // guardaba otra.
          if (!cruceDelPlayoffHoy) isHomeThisMatch = realPrimary!.isHome;
        } else {
          const opponentClub = leagueClubs.find(c => c.id === upcoming!.opponentId);
          opName = opponentClub?.name || OPPONENT_CLUBS_POOL[Math.floor(Math.random() * OPPONENT_CLUBS_POOL.length)];
          opClubId = upcoming!.opponentId;
          isHomeThisMatch = upcoming!.isHome;
        }

        // Apertura/Clausura para el header: si el partido de hoy vino del calendario real, el
        // semestre sale de SU fecha (torneoDelClubEnFecha). Si vino del motor sintético, sale del
        // estado de la temporada (season.semester) -- nunca se recalcula con fixturesAtStep desde
        // MatchSimulator, que podía apuntar a la fecha real de un semestre distinto al que
        // realmente se está jugando.
        if (isApeturaClausuraLeague(myClub.league)) {
          const semestreDeHoy = esPartidoDeCalendarioReal && datedStep
            ? torneoDelClubEnFecha(myClub.name, datedStep.date)
            : (season.semester === 2 ? 'Clausura' : 'Apertura');
          setActiveTorneoLabel(semestreDeHoy);
        } else {
          setActiveTorneoLabel(null);
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

        // Playoff de liga a ida y vuelta (Colombia/Argentina, cuadrangulares y final): el global se
        // arma igual que en la copa nacional, buscando el TwoLegTie del club en la ronda en curso.
        //
        // Sale del cuadro que de verdad se está jugando (playoffsDeLiga, el mismo que puso al rival
        // en pantalla). Antes se leía el cuadro interno del motor, que además de ser otro cuadro
        // NUNCA se llenaba: por eso el global del cuadrangular no aparecía jamás.
        const miLlaveLiga = cruceDelPlayoffHoy;
        if (miLlaveLiga) {
          const soyA = miLlaveLiga.clubAId === myClub.id;
          const idaJugada = miLlaveLiga.firstLegGoalsA !== null && miLlaveLiga.firstLegGoalsB !== null;
          if (idaJugada) {
            const misGoles = (soyA ? miLlaveLiga.firstLegGoalsA : miLlaveLiga.firstLegGoalsB) ?? 0;
            const susGoles = (soyA ? miLlaveLiga.firstLegGoalsB : miLlaveLiga.firstLegGoalsA) ?? 0;
            setActiveGlobalScoreLabel(`${misGoles}-${susGoles}`);
          }
        }
      } else {
        // Fallback de seguridad (liga con un solo club u otro caso borde): no debería pasar en la práctica.
        const localRivals = leagueClubs.filter(c => c.id !== myClub.id).map(c => c.name);
        opName = localRivals.length > 0 ? localRivals[Math.floor(Math.random() * localRivals.length)] : OPPONENT_CLUBS_POOL[Math.floor(Math.random() * OPPONENT_CLUBS_POOL.length)];
        setActiveMyTablePosition(null);
        setActiveRivalTablePosition(null);
        setActiveLeagueTeamCount(null);
        setActiveTorneoLabel(null);
      }
    }

    setActiveWorldCupTeamId(foundWorldCupTeamId);
    setActiveEliminatoriaKey(foundEliminatoriaKey);
    setActiveOpposition(opName);
    setActiveOppositionClubId(opClubId);
    setActiveIsHome(isHomeThisMatch);

    // Convocatoria: solo aplica a partidos de club (liga/copas continentales/UEFA) -- la selección
    // ya filtra por prestige/partidos jugados antes de convocarte (ver WORLD_CUP_CALLUP thresholds
    // arriba), así que si estás ahí siempre arrancás titular.
    if (!foundWorldCupTeamId && opClubId) {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      // EL PUESTO SE PIERDE Y SE GANA. Antes la titularidad la decidia solo el prestigio, que nada
      // mas sube: pasado el umbral del club eras titular para siempre, jugaras bien o jugaras mal.
      // Ahora la FORMA -- que sube y baja -- entra en la cuenta junto al refuerzo que te taparon.
      // Ver ajusteDeFormaEnElOnce en src/forma.ts.
      const formaHoy = evaluarForma(playerProfile.formaReciente, playerProfile.currentWeek);
      // El rival del puesto ya no pesa por ser nuevo sino por lo que HIZO: ver estorboDelRival en
      // src/rivalDePuesto.ts. Antes se diluia solo en diez fechas aunque estuviera metiendo goles.
      // Y la exigencia por lo que valés dentro del plantel: al fichaje caro se le pide desde el
      // primer día, al pibe de la casa todavía no le reclama nadie. Ver exigenciaPorLoQueValés.
      const estorboTotal = estorboDelRival(playerProfile.fichajeRival, playerProfile.currentWeek)
        + ajusteDeFormaEnElOnce(formaHoy)
        + exigenciaPorLoQueValés(playerProfile.marketValue, myClub.marketValue);
      const lineupStatus = decideLineupStatus(myClub.reputation, playerProfile.prestige, playerProfile.starModeEnabled, estorboTotal);
      const avisoForma = avisoDeFormaEnElOnce(formaHoy);
      if (avisoForma && lineupStatus !== 'not_called') notify(avisoForma);

      if (lineupStatus === 'not_called') {
        const { homeGoals, awayGoals } = isHomeThisMatch ? simulateMatch(myClub, CLUBS_DATABASE.find(c => c.id === opClubId) || myClub) : simulateMatch(CLUBS_DATABASE.find(c => c.id === opClubId) || myClub, myClub);
        const myGoals = isHomeThisMatch ? homeGoals : awayGoals;
        const rivalGoals = isHomeThisMatch ? awayGoals : homeGoals;
        // LA FECHA QUE VOS NO JUGAS, LA JUEGA EL. Y se te cuenta: perder el puesto por un numero
        // invisible se lee como un bug, y perderlo porque el otro metio dos se lee como futbol.
        const rivalHoy = playerProfile.fichajeRival;
        const fechaDelRival = rivalHoy ? jugarFechaDelRival(rivalHoy.nivel ?? 72) : null;

        const updated: PlayerProfile = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 18),
          mentalHealth: Math.max(0, playerProfile.mentalHealth - 4),
          currentWeek: playerProfile.currentWeek + 1,
          playoffsDeLiga: playoffSinVosHoy() ?? playerProfile.playoffsDeLiga,
          datedResults: historialCon(resultadoDelClubSinVos(myClub, opName, myGoals, rivalGoals)),
          matchesWithoutRest: 0,
          fichajeRival: rivalHoy && fechaDelRival ? anotarFechaDelRival(rivalHoy, fechaDelRival) : rivalHoy,
        };
        const aged = applySeasonTransitions(updated, playerProfile.currentWeek, updated.currentWeek);
        if (isPastRetirementAge(aged)) {
          resolveRetirementCheckpoint(aged);
          return;
        }
        setPlayerProfile(aged);
        saveGameState(aged, shopItems);
        notify(`📋 NO FUISTE CONVOCADO esta fecha: el DT decidió dejarte fuera de la lista de ${myClub.name}. Resultado sin ti: ${myGoals}-${rivalGoals} vs. ${opName}.`);
        if (rivalHoy && fechaDelRival) notify(`⚠ ${cronicaDelRival(rivalHoy, fechaDelRival)}`);
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

    // La localia y el rival vienen dados por quien llama (la pantalla ya los calculo), asi que aca
    // no se usa partidoDeLigaSinVos: seria recalcular lo que ya se sabe y podria discrepar.
    const { homeGoals, awayGoals } = isHomeThisMatch ? simulateMatch(myClub, opponentClub) : simulateMatch(opponentClub, myClub);
    const myGoals = isHomeThisMatch ? homeGoals : awayGoals;
    const rivalGoals = isHomeThisMatch ? awayGoals : homeGoals;

    const resolvedSeason = resolvePlayerWeekForLeague(season, leagueClubs, playerProfile.currentWeek, myClub.id, isHomeThisMatch, myGoals, rivalGoals, undefined, contextoRealDelPaso(myClub.name, playerProfile.currentWeek));
    let updatedLeagueSeasons = { ...playerProfile.leagueSeasons, [leagueKey]: resolvedSeason };

    for (const key of Object.keys(updatedLeagueSeasons)) {
      if (key === leagueKey) continue;
      const otherLeagueClubs = clubesDeLiga(key);
      if (otherLeagueClubs.length === 0) continue;
      updatedLeagueSeasons[key] = getOrCreateSeasonForLeague(otherLeagueClubs, updatedLeagueSeasons[key], playerProfile.currentWeek + 1);
    }

    const activePassiveDividend = shopItems.filter(i => i.purchased).reduce((sum, i) => sum + (i.effect.passiveIncome || 0), 0);

    const suspendedSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false, playerProfile);
    const updated: PlayerProfile = {
      ...playerProfile,
      energy: Math.min(100, playerProfile.energy + 15),
      capital: playerProfile.capital + myClub.initialSalary + activePassiveDividend,
      mentalHealth: Math.max(0, playerProfile.mentalHealth - 3),
      currentWeek: playerProfile.currentWeek + 1,
      playoffsDeLiga: playoffSinVosHoy() ?? playerProfile.playoffsDeLiga,
      datedResults: historialCon(resultadoDelClubSinVos(myClub, opponentClub.name, myGoals, rivalGoals)),
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

  // Elegir cómo tratar la lesión activa (ver DecisionCenter-style, pero puntual como girlfriend.*
  // porque necesita tocar activeInjury.treatmentChoice, que no existe en el contrato genérico de
  // efectos {prestige, fans, energy, capital}). 'fast' acorta la recuperación pagando capital, pero
  // deja riesgo de recaída si volvés a jugar apenas termina (ver el roll en handleFinishMatch).
  // 'natural' no cuesta nada y no tiene riesgo, solo no acelera nada.
  // 'forzar' es distinta de las otras dos y por eso rompe la regla de "una sola elección": se puede
  // decidir EN CUALQUIER MOMENTO de la recuperación, incluso si ya elegiste tratamiento. Ésa es la
  // situación que la hace interesante -- venías recuperándote tranquilo y de golpe aparece una final
  // en el calendario. Lo que no se puede es volver atrás: una vez que saltaste a la cancha roto, la
  // decisión ya está tomada.
  const handleTreatInjury = (choice: 'fast' | 'natural' | 'forzar') => {
    if (!playerProfile?.activeInjury) return;
    if (choice !== 'forzar' && playerProfile.activeInjury.treatmentChoice) return;
    if (choice === 'forzar' && playerProfile.activeInjury.treatmentChoice === 'forzar') return;
    if (choice === 'fast' && playerProfile.capital < INJURY_FAST_TREATMENT_COST) {
      notify('No tienes fondos suficientes para el tratamiento rápido.');
      return;
    }

    // Forzar no acorta ni encarece nada: lo único que cambia es que a partir de ahora podés jugar.
    // El precio no se paga acá, se paga en la cancha (atributos bajos) y en el dado de cada partido.
    if (choice === 'forzar') {
      const riesgo = Math.round(riesgoDeRecaida(playerProfile.activeInjury.weeksRemaining) * 100);
      const forzado: PlayerProfile = {
        ...playerProfile,
        activeInjury: { ...playerProfile.activeInjury, treatmentChoice: 'forzar' },
      };
      setPlayerProfile(forzado);
      saveGameState(forzado, shopItems);
      notify(`🔥 Vuelves antes de tiempo. Juegas con la lesión encima: rindes por debajo y cada partido tiene ${riesgo}% de recaída.`);
      return;
    }

    const weeksRemaining = choice === 'fast'
      ? Math.max(1, Math.round(playerProfile.activeInjury.weeksRemaining * (1 - INJURY_FAST_TREATMENT_WEEKS_SAVED)))
      : playerProfile.activeInjury.weeksRemaining;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: choice === 'fast' ? playerProfile.capital - INJURY_FAST_TREATMENT_COST : playerProfile.capital,
      activeInjury: { ...playerProfile.activeInjury, weeksRemaining, treatmentChoice: choice },
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    notify(choice === 'fast'
      ? `💊 Empezaste el tratamiento rápido: tu recuperación se acorta ${Math.round(INJURY_FAST_TREATMENT_WEEKS_SAVED * 100)}%.`
      : `🛌 Vas a recuperarte de forma natural, sin apuros ni riesgos.`);
  };

  // Semana con lesión activa (ver activeInjury/injuriesEnabled): a diferencia de la sanción, esto
  // corta CUALQUIER tipo de semana (liga, copa nacional, continental, Mundial, fecha libre) -- una
  // lesión no distingue de competencia. Tu club juega igual de fondo (simulado), vos solo avanzás
  // la semana descontando weeksRemaining. Se llama desde el principio de startMatchflow, antes de
  // ramificar por tipo de partido, y desde handleAdvanceWeek al descansar.
  const resolveInjuredWeek = () => {
    if (!playerProfile?.activeInjury) return;
    const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
    const leagueKey = leagueKeyFor(myClub);
    const leagueClubs = clubesDeLiga(leagueKey);
    const nextWeek = playerProfile.currentWeek + 1;

    // TU CLUB JUEGA IGUAL MIENTRAS VOS ESTAS DE BAJA, y hasta ahora esa fecha no se resolvia: se
    // adelantaba la liga entera con getOrCreateSeasonForLeague y el partido del club quedaba sin
    // marcador propio. Osea que una lesion de tres semanas eran tres partidos de tu club que no
    // existian en ningun lado -- ni en el historial, ni en la racha, ni en el calendario --,
    // mientras que la sancion y la falta de convocatoria si los anotan.
    const seasonPropia = playerProfile.leagueSeasons[leagueKey]
      ?? getOrCreateSeasonForLeague(leagueClubs, undefined, playerProfile.currentWeek);
    const suyo = partidoDeLigaSinVos(myClub, leagueClubs, seasonPropia);

    // El resto de las ligas que ya visitaste (leagueSeasons) sigue de fondo para no desincronizarse.
    const updatedLeagueSeasons = { ...playerProfile.leagueSeasons };
    for (const key of Object.keys(updatedLeagueSeasons)) {
      if (key === leagueKey) continue;
      const otherLeagueClubs = clubesDeLiga(key);
      if (otherLeagueClubs.length === 0) continue;
      updatedLeagueSeasons[key] = getOrCreateSeasonForLeague(otherLeagueClubs, updatedLeagueSeasons[key], nextWeek);
    }
    updatedLeagueSeasons[leagueKey] = suyo?.season
      ?? getOrCreateSeasonForLeague(leagueClubs, updatedLeagueSeasons[leagueKey], nextWeek);

    const activePassiveDividend = shopItems.filter(i => i.purchased).reduce((sum, i) => sum + (i.effect.passiveIncome || 0), 0);
    const sync = syncBackgroundCups(playerProfile.currentClubId, nextWeek, playerProfile.continentalCups, playerProfile.uefaCups, false, false, playerProfile);

    const weeksRemaining = playerProfile.activeInjury.weeksRemaining - 1;
    const injuryDone = weeksRemaining <= 0;
    const updated: PlayerProfile = {
      ...playerProfile,
      energy: Math.min(100, playerProfile.energy + 12),
      capital: playerProfile.capital + myClub.initialSalary + activePassiveDividend,
      currentWeek: nextWeek,
      playoffsDeLiga: playoffSinVosHoy() ?? playerProfile.playoffsDeLiga,
      matchesWithoutRest: 0,
      activeInjury: injuryDone ? null : { ...playerProfile.activeInjury, weeksRemaining },
      datedResults: historialCon(suyo ? resultadoDelClubSinVos(myClub, suyo.rival.name, suyo.myGoals, suyo.rivalGoals) : null),
      ...(injuryDone ? darDeAlta(playerProfile, playerProfile.activeInjury, nextWeek) : { injuryHistory: playerProfile.injuryHistory ?? [] }),
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
    notify((injuryDone
      ? `✅ Te recuperaste de tu lesión. Ya puedes volver a jugar con ${myClub.name}.`
      : `🩹 Sigues de baja. Te quedan ${weeksRemaining} semana(s) de recuperación.`) + (suyo?.aviso ?? ''));
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
      const otherLeagueClubs = key === leagueKey ? leagueClubs : clubesDeLiga(key);
      if (otherLeagueClubs.length === 0) continue;
      updatedLeagueSeasons[key] = getOrCreateSeasonForLeague(otherLeagueClubs, updatedLeagueSeasons[key], playerProfile.currentWeek + 1);
    }

    const activePassiveDividend = shopItems.filter(i => i.purchased).reduce((sum, i) => sum + (i.effect.passiveIncome || 0), 0);
    const sync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false, playerProfile);

    const updated: PlayerProfile = {
      ...playerProfile,
      energy: Math.min(100, playerProfile.energy + 15),
      capital: playerProfile.capital + myClub.initialSalary + activePassiveDividend,
      currentWeek: playerProfile.currentWeek + 1,
      playoffsDeLiga: playoffSinVosHoy() ?? playerProfile.playoffsDeLiga,
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
    notify(`🚫 Fecha libre de ${myClub.name}: cumpliste una fecha de sanción sin jugar.${aged.suspendedMatches > 0 ? ` Te quedan ${aged.suspendedMatches} partido(s).` : ' Ya puedes volver a jugar.'}`);
  };

  const handleResolveEvent = (effects: { prestige: number; fans: number; energy: number; capital: number; suspension?: number; companeros?: number }) => {
    if (!playerProfile) return;

    const prestigeCompanerosActual = playerProfile.prestigeCompaneros ?? playerProfile.prestige;
    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + effects.prestige) ),
      prestigeCompaneros: Math.max(0, Math.min(100, prestigeCompanerosActual + (effects.companeros || 0))),
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
    // Un partido simulado no deja el modo prendido: la fecha que viene se vuelve a elegir.
    setSimularEstePartido(false);
    if (!playerProfile) return;

    setMatchResults(results);

    // EL DESENLACE DE COPA ES DE ESTE PARTIDO, NO DE UNO VIEJO.
    //
    // seasonEndInfo lo lee PostMatch para el titular a toda página ("ELIMINADOS DE LA COPA
    // LIBERTADORES"), y hasta acá era un estado que sólo se limpiaba al cerrar el overlay del
    // dashboard -- que no siempre llega a mostrarse, porque cede el paso al festejo de campeón
    // (`!championInfo` en su condición de render). Cuando no se mostraba, el dato quedaba pegado
    // para siempre y TODOS los partidos siguientes abrían con el titular de una eliminación vieja,
    // incluidos los que ganabas y los que te clasificaban. Reportado: "aunque clasificara, siempre
    // me salía el anuncio de que fui eliminado del torneo, cuando no fue así".
    //
    // Se limpia acá, al empezar a resolver el partido: si hoy hay desenlace, lo vuelve a poner
    // alguna de las ramas de abajo; si no hay, el diario no tiene nada que anunciar.
    setSeasonEndInfo(null);

    // Modo difícil (ver DIFFICULTY_ENERGY_MULTIPLIER): en 'realista' la energía baja más rápido
    // por partido -- el resto del multiplicador de dificultad (lesiones más frecuentes) ya vive en
    // el bloque de roll de lesión más abajo.
    const DIFFICULTY_ENERGY_MULTIPLIER = playerProfile.difficultyMode === 'realista' ? 1.25 : 1;
    const baseEnergySpent = Math.round(28 * DIFFICULTY_ENERGY_MULTIPLIER);
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

    // Finanzas personales: cada inversión activa (ver INVESTMENTS_DATABASE) devuelve su weeklyReturn
    // salvo que el roll de riesgo de esa semana la haga perder el capital invertido -- en ese caso
    // se descuenta de la lista y se avisa, en vez de seguir devolviendo intereses sobre plata que
    // ya no existe.
    const investmentResults = (playerProfile.investments ?? []).map(inv => ({
      inv,
      lost: Math.random() < inv.riskOfLossPct / 100,
    }));
    const investmentIncome = investmentResults.filter(r => !r.lost).reduce((sum, r) => sum + r.inv.weeklyReturn, 0);
    const lostInvestments = investmentResults.filter(r => r.lost);
    const updatedInvestments = (playerProfile.investments ?? []).filter(inv => !lostInvestments.some(l => l.inv.id === inv.id));

    const totalIncome = results.salaryEarned + goalBonus + assistBonus + activePassiveDividend + playerProfile.appearanceBonus
      + investmentIncome - (playerProfile.fixedExpensesWeekly ?? 0);
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
    // LA COMPETICION QUE DE VERDAD SE JUGO HOY.
    //
    // No siempre es la que trae el calendario. Los dias de copa son UNA SOLA BOLSA: el dia queda
    // apartado bajo la copa que se lo pidio a tu liga, y quien lo USA se decide al llegar. Un dia
    // reservado por la Copa MX lo puede terminar jugando la Concacaf.
    //
    // Reportado con un reporte de bug del propio juego: "2026-05-06 Copa MX 3-2 vs FC Cincinnati --
    // tienes la copa mx entrelazada con la concacaf". Cincinnati es rival de Concacaf; el resultado
    // quedo anotado bajo Copa MX porque ese dia lo habia reservado ella.
    //
    // Importa mas que el rotulo: con el nombre equivocado, el historial, la tabla de goleadores de
    // cada torneo y el global de las llaves quedan mirando la competicion que no es.
    const nombreDeLaCopaDeHoy = (): string | null => {
      const mio = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
      if (activeCupId === 'libertadores') return 'Copa Libertadores';
      if (activeCupId === 'sudamericana') return 'Copa Sudamericana';
      if (activeCupId === 'concacaf') return 'Concacaf Champions Cup';
      if (activeUefaCupId === 'champions') return 'UEFA Champions League';
      if (activeUefaCupId === 'europa') return 'UEFA Europa League';
      if (activeDomesticCup && mio) return nombreCopaNacional(mio.league);
      return null;
    };

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
      // En un dia RESERVADO el nombre del calendario es el de la copa que PIDIO el dia, no el de la
      // que lo jugo. Ver nombreDeLaCopaDeHoy.
      const copaDeVerdad = fx.esReservaDeCuadro ? nombreDeLaCopaDeHoy() : null;
      datedResultToday = {
        date: paso.date,
        competition: copaDeVerdad ?? fx.competition.name,
        // Cuando el calendario no sabe contra quién jugaste -- el rival lo puso el cuadro -- se
        // guarda el de verdad. Guardar el cartel de relleno deja el historial (y las rachas, que se
        // arman con este nombre) apuntando a un club que no existe.
        //
        // Se compara contra el CARTEL y no contra `esReservaDeCuadro`, que era lo que había: las
        // fechas de cuadrangular no llevan esa marca -- llevan `esPlayoff` -- así que todas las
        // llaves del Clausura y del Apertura quedaban anotadas como "4-1 vs Por definir".
        // Encontrado en un reporte de bug del propio juego, con Tigres.
        opponentName: fx.opponentName === RIVAL_POR_SORTEAR ? activeOpposition : fx.opponentName,
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
      if (globalMio < globalRival) {
        // PERDISTE EL ULTIMO PARTIDO DE LA COPA: quedaste afuera, y hasta ahora eso pasaba en
        // silencio absoluto. Estas copas no tienen cuadro en el motor -- sus cruces salen del
        // calendario -- asi que la deteccion de eliminacion que existe para los brackets nunca las
        // miraba. Reportado: "me eliminaron de la Superliga pero en ningun lado dice eso".
        //
        // No hace falta saber en que ronda: si este era tu ultimo partido de la copa y lo perdiste
        // en el global, la copa termino para vos. Es la misma condicion que corona al ganador, leida
        // al reves.
        setSeasonEndInfo({
          competition: fx.competition.name,
          clubName: myClub.name,
          season: String(Number(paso.date.slice(0, 4))),
          badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
          eliminated: true,
          eliminatedRound: rotuloDeRonda('', fx.match.round) || null,
        });
        setPlayerProfile(p => ({ ...p, ultimaEliminacion: { competicion: fx.competition.name, semana: p.currentWeek } }));
        return;
      }

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
    let updatedPlayoffs = playerProfile.playoffsDeLiga;
    (() => {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
      if (!myClub || !activeDomesticCup || !activeOppositionClubId) return;
      // MISMA clave que al armar el partido (ver temporadaDeCopa allá): con calendario real manda
      // la temporada del calendario, no el contador de 52 semanas. Si las dos no coinciden, el
      // resultado se guarda en una edición distinta de la que se jugó y el cuadro no avanza nunca.
      const cupKey = claveDeCopaNacional(myClub, playerProfile.currentWeek);
      // El año del título sale de la MISMA temporada con la que se armó la clave, para que el
      // trofeo no quede fechado en una edición distinta de la que se jugó.
      const temporadaDeCopa = Number(cupKey.slice(cupKey.lastIndexOf('-') + 1));
      const cup = playerProfile.domesticCups?.[cupKey];
      if (!cup || cup.championId) return;
      const tie = cruceActual(cup, myClub.id);
      // Solo si el rival de hoy es el de su llave: en las semanas sin cruce el partido es un
      // amistoso doméstico y no debe mover el cuadro.
      if (!tie || (tie.clubAId !== activeOppositionClubId && tie.clubBId !== activeOppositionClubId)) return;

      // La localía que le pasamos al motor tiene que ser la de la LLAVE INTERNA de la copa
      // nacional, no la del calendario real (activeIsHome) -- mismo bug ya corregido para el
      // playoff de liga (ver isHomeParaElMotor más abajo): en la ida el clubA es local, en la
      // vuelta se invierte, y eso puede no coincidir con lo que dice el calendario real para esa
      // fecha. Sin esto, la localía le entraba invertida al motor en la vuelta y el global
      // terminaba mal calculado (o, como acá, el motor nunca marcaba la vuelta como jugada).
      const isHomeParaLaCopaNacional = tie.firstLegGoalsA === null
        ? tie.clubAId === myClub.id  // ida: A es local
        : tie.clubBId === myClub.id; // vuelta: se invierte, B es local

      const resuelta = resolverPasoCopaNacional(cup, CLUBS_DATABASE, {
        clubId: myClub.id,
        isHome: isHomeParaLaCopaNacional,
        goals: results.golesMiEquipo,
        opponentGoals: results.golesRival,
      });
      // Si este partido te dejó afuera, la copa NO se congela ahí: se juega sola hasta la final.
      // Antes el cuadro sólo avanzaba cuando jugabas vos, así que el torneo del que te eliminaban
      // se quedaba para siempre en la ronda donde quedaste y nunca coronaba campeón -- ni para la
      // vitrina, ni para las noticias, ni para repartir los cupos continentales del año que viene.
      const terminada = resuelta.championId || sigueEnCopa(resuelta, myClub.id)
        ? resuelta
        : terminarTorneoSinElJugador(resuelta, c => resolverPasoCopaNacional(c, CLUBS_DATABASE));
      updatedDomesticCups = { ...(playerProfile.domesticCups ?? {}), [cupKey]: terminada };

      if (resuelta.championId === myClub.id) {
        salioCampeon = true;
        // Mismo criterio que la clave de la copa: el año sale de la temporada del CALENDARIO. Con
        // getSeasonYear, un club de 60 pasos por año veía su título fechado en el año siguiente.
        const anio = CAREER_START_YEAR + temporadaDeCopa - 1;
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
    // Los OTROS partidos de la fecha, los que el motor simula de fondo. Se guardan acá para poder
    // atribuirles goleadores más abajo: sin esto, la tabla de goleadores de la liga sólo contaba los
    // partidos del jugador -- era "el goleador de tus partidos", no el de la liga.
    let otrosPartidosDeLaFecha: { homeTeamId: string; awayTeamId: string; homeGoals: number; awayGoals: number }[] = [];
    if (!isCopaLibertadores && activeOppositionClubId) {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const usaFechasRealesParaMiClub = hasDatedLeagueSchedule(myClub.name);
      const leagueKey = leagueKeyFor(myClub);
      const leagueClubs = clubesDeLiga(leagueKey);
      const existingSeason = playerProfile.leagueSeasons[leagueKey] ?? getOrCreateSeasonForLeague(leagueClubs, undefined, playerProfile.currentWeek);

      // Acá se calculaba una "localía para el motor" leyendo los cuadros internos de la temporada.
      // Los dos estaban SIEMPRE vacíos (ver la nota de LeagueSeasonState en types.ts), así que el
      // cálculo entero terminaba siempre en el mismo `activeIsHome` del final.
      //
      // Y aunque no lo estuvieran, no cambiaría nada: resolvePlayerWeekForLeague recibe la localía
      // pero NO LA USA -- su único camino es resolveLigaPorFecha, que arma la tabla con las fechas
      // del calendario y no necesita saber quién es local. La localía que sí importa, la de la
      // llave del cuadrangular, la calcula el bloque de playoff más abajo con su propio cuadro.

      const resolvedSeason = resolvePlayerWeekForLeague(
        existingSeason, leagueClubs, playerProfile.currentWeek, myClub.id,
        activeIsHome, results.golesMiEquipo, results.golesRival, shootoutOverride,
        contextoRealDelPaso(myClub.name, playerProfile.currentWeek)
      );

      // Qué partidos pasaron de pendientes a jugados en ESTA llamada. Se compara antes contra
      // después en vez de filtrar por fecha: el motor decide solo qué resuelve en cada paso, y
      // preguntarle al calendario por la fecha daría una lista parecida pero no la misma -- y la que
      // vale es la que de verdad quedó registrada en la tabla.
      const jugadosAntes = new Set(
        existingSeason.fixtures.filter(f => f.played).map(f => `${f.matchweek}|${f.homeTeamId}|${f.awayTeamId}`));
      otrosPartidosDeLaFecha = resolvedSeason.fixtures
        .filter(f => f.played
          && !jugadosAntes.has(`${f.matchweek}|${f.homeTeamId}|${f.awayTeamId}`)
          // El del jugador se anota aparte, con sus goles REALES en vez de un reparto simulado.
          && f.homeTeamId !== myClub.id && f.awayTeamId !== myClub.id)
        .map(f => ({
          homeTeamId: f.homeTeamId, awayTeamId: f.awayTeamId,
          homeGoals: f.homeGoals ?? 0, awayGoals: f.awayGoals ?? 0,
        }));

      // ACÁ SE BUSCABA LA TANDA DE PENALES DEL CUADRANGULAR, en los cuadros internos de la
      // temporada. Como esos cuadros nunca se llenaron, la búsqueda daba null siempre y la pantalla
      // de penales NO SE OFRECE en un cuadrangular: una llave empatada en el global resuelve los
      // penales sola, por dentro de resolverPasoPlayoffDeLiga, sin que el jugador los patee.
      //
      // Queda anotado como pendiente y no se improvisa acá: ofrecer la tanda es pausar el partido
      // ANTES de aplicar el resultado y volver a resolver la llave con el resultado real
      // (`shootoutOverride`), que es lo que ya hacen las copas continentales. Fingirlo con el cuadro
      // equivocado es lo que produjo este bug en primer lugar.

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

      // RED DE SEGURIDAD DEL TÍTULO DE LIGA. No reemplaza a los cierres de torneo de más abajo: los
      // respalda. Los dos caminos que coronan campeón de liga (el playoff y cerroElTorneo) deducen
      // del calendario que el torneo terminó, y esa deducción ya falló antes de maneras distintas
      // -- por eso el título salía en febrero, con el Apertura empezado. Acá se pregunta otra cosa,
      // que no depende de ninguna deducción: ¿jugaste este torneo? Un Apertura son 19 fechas; con
      // tres jugadas no hay nada que coronar, no importa qué diga el resto del código.
      //
      // El umbral es la mitad y no todas a propósito: un club puede tener fechas que el jugador se
      // saltea, y exigir el 100% dejaría sin título a un campeón legítimo. La mitad separa "jugué
      // el torneo" de "recién empieza" sin quedar al filo de ningún caso real.
      const fechasDelTorneo = hoyJuegoLigaPorCalendario && pasoHoy
        ? fechasDeLigaDelTorneo(myClub.name, pasoHoy.date,
            new Set((playerProfile.datedResults ?? []).map(r => r.date)))
        : null;
      const jugoElTorneo = !fechasDelTorneo
        || fechasDelTorneo.total === 0
        || fechasDelTorneo.jugadas * 2 >= fechasDelTorneo.total;

      // El título de liga se guarda con el nombre que usa el CALENDARIO ("Liga BetPlay Dimayor"),
      // no con el de leagueDisplay ("Primera División Dimayor").
      //
      // No es cosmético: limpiarTitulosFantasma decide si un título es real buscando resultados de
      // esa misma competición, y compara por nombre. Con dos nombres distintos para la misma liga
      // no coincidía NUNCA, así que el Apertura ganado en cancha se borraba de la vitrina al
      // cargar la partida -- exactamente lo contrario de lo que esa limpieza tiene que hacer.
      // El nombre del calendario además es el real y ya es el que muestra el palmarés.
      const nombreDeLaLigaHoy = (hoyJuegoLigaPorCalendario && pasoHoy
        ? pasoHoy.fixtures.find(f => f.competition.kind === 'league')?.competition.name
        : null) ?? getLeagueDisplay(myClub.league, myClub.division).name;

      // PLAYOFF DE LIGA: el partido de hoy avanza el cuadro sembrado por tabla (ver
      // prepararPlayoffDeLiga). El resultado del jugador entra por `forced` y el resto de las
      // llaves las simula el motor en la misma llamada.
      const hoyFuePlayoff = !!pasoHoy && pasoHoy.fixtures.some(f => f.esPlayoff);
      if (hoyFuePlayoff && pasoHoy && activeOppositionClubId) {
        const semestre = torneoDelClubEnFecha(myClub.name, pasoHoy.date) ?? '';
        // La MISMA clave que uso handlePlayMatch al armar el partido: si las dos no coinciden, el
        // resultado se guarda en un cuadro distinto del que se jugo.
        const clave = clavePlayoffDeLiga(myClub, playerProfile.currentWeek, pasoHoy.date);
        const antes = playerProfile.playoffsDeLiga?.[clave];
        const tie = crucePlayoffDeLiga(antes, myClub.id);

        if (antes && tie) {
          // La localía que va al motor es la de la LLAVE, no la del calendario: en la ida es local
          // el clubA y en la vuelta se invierte. Con activeIsHome el global salía dado vuelta.
          const esIda = tie.firstLegGoalsA === null;
          const soyLocalEnLaLlave = esIda ? tie.clubAId === myClub.id : tie.clubBId === myClub.id;
          const despues = resolverPasoPlayoffDeLiga(antes, leagueClubs, {
            clubId: myClub.id, isHome: soyLocalEnLaLlave,
            goals: results.golesMiEquipo, opponentGoals: results.golesRival,
            // En la segunda pasada llega la tanda que el jugador pateó de verdad, y ésa manda sobre
            // el dado del motor (ver shootoutOverride en resolveOneLegOfTie). Sin pasarlo, la
            // pantalla de penales decidía una cosa y la llave se resolvía con otra.
            shootoutOverride,
          });

          // ¿LA LLAVE SE FUE A PENALES? Entonces se patean, no se simulan.
          //
          // Esto no existía: la búsqueda de tanda miraba los cuadros internos del motor, que nunca
          // se llenaban (ver la nota de LeagueSeasonState en types.ts), así que un cuadrangular
          // empatado en el global resolvía los penales solo, por dentro, y el jugador se enteraba
          // del resultado sin haber pateado. En las copas continentales sí se ofrecía desde
          // siempre; era la única eliminatoria del juego que se definía a espaldas del jugador.
          //
          // El mecanismo es el mismo que usa la Libertadores: en la primera pasada se detecta la
          // tanda, se pausa el partido ANTES de guardar nada (ver `if (foundShootout &&
          // !shootoutOverride)` más abajo, que corta y vuelve), y en la segunda se resuelve la
          // llave otra vez desde `antes` -- que quedó intacto -- con el resultado real.
          const tandaDelCuadrangular = findShootoutInTwoLegBracket(despues, myClub.id, activeOppositionClubId);
          if (tandaDelCuadrangular) {
            foundShootout = tandaDelCuadrangular;
            foundShootoutMyId = myClub.id;
            foundShootoutMyName = myClub.name;
          }
          // Mientras la tanda esté pendiente no se anuncia nada: el campeón y la eliminación los
          // decide ella. Mismo cuidado que el bloque de la copa continental.
          const tandaResuelta = !tandaDelCuadrangular || !!shootoutOverride;

          // Igual que la copa nacional: si te eliminaron, el cuadrangular sigue sin vos hasta la
          // final. Sin esto el Apertura se quedaba sin campeón el día que perdías la semifinal.
          const cerrado = despues.championId || crucePlayoffDeLiga(despues, myClub.id)
            ? despues
            // Con `prepararPlayoffDeLiga` adelante: resolverPasoPlayoffDeLiga solo JUEGA una
            // pierna, y resolveTwoLegRound corta a proposito sin armar la ronda siguiente. Sin la
            // primera mitad, "sigue sin vos hasta la final" se quedaba en la ronda donde te
            // eliminaron. No se notaba porque cada fecha de cuadrangular que venia despues volvia a
            // preparar el cuadro; se nota el dia que ya no quedan fechas.
            : terminarTorneoSinElJugador(
                despues, b => resolverPasoPlayoffDeLiga(prepararPlayoffDeLiga(b, [], undefined), leagueClubs));
          updatedPlayoffs = { ...(playerProfile.playoffsDeLiga ?? {}), [clave]: cerrado };

          const anioPlayoff = Number(pasoHoy.date.slice(0, 4));
          const semestreLabel = `${semestre || 'Playoff'} ${anioPlayoff}`;

          if (despues.championId === myClub.id && jugoElTorneo && tandaResuelta) {
            salioCampeon = true;
            setChampionInfo({
              competition: getLeagueDisplay(myClub.league, myClub.division).name,
              clubName: myClub.name,
              season: semestreLabel,
              badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
            });
            leagueTitleWon = {
              competition: nombreDeLaLigaHoy,
              year: anioPlayoff, clubId: myClub.id, torneo: semestre || undefined, tipo: 'liga',
            };
          } else if (
            tandaResuelta
            // Campeón del cuadrangular NO es eliminado, y hay que decirlo aparte: crucePlayoffDeLiga
            // devuelve null en cuanto el cuadro tiene campeón, sea quien sea. Con el `jugoElTorneo`
            // de la rama de arriba en false -- un semestre al que llegaste a mitad de camino, o con
            // muchos partidos jugados sin vos -- ganar la final caía acá y anunciaba "Eliminado en
            // Final" al que se acababa de coronar.
            && despues.championId !== myClub.id
            && !crucePlayoffDeLiga(despues, myClub.id)) {
            // Recién eliminado con este partido. Antes esto pasaba en silencio.
            const ronda = despues.tiesByRound[despues.tiesByRound.length - 1];
            setSeasonEndInfo({
              competition: getLeagueDisplay(myClub.league, myClub.division).name,
              clubName: myClub.name,
              season: semestreLabel,
              badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
              eliminated: true,
              eliminatedRound: ronda ? roundLabelByMatchCount(ronda.length) : null,
            });
          }
        }
      }

      // ¿Cerró el torneo y quedaste primero?
      const cerroElTorneo = hoyJuegoLigaPorCalendario
        ? esUltimaFechaDelTorneo(myClub.name, pasoHoy!.date)
        // Con calendario real la liga cierra SOLO en su última fecha, y esa fecha se juega. Si hoy
        // jugaste otra cosa -- la Superliga, una copa -- la liga no cerró nada hoy.
        //
        // Sin esta rama caía al respaldo de abajo, que pregunta por fixtures pendientes sobre un
        // array VACÍO: las ligas con calendario real nacen con `fixtures: []` a propósito, así que
        // `[].some(...)` daba false y el torneo se leía como cerrado. Cada partido de copa coronaba
        // campeón de liga al primero de la tabla. Reportado: ganar la Superliga con Junior anotaba
        // también un "Primera División Dimayor · Apertura 2026" que nadie jugó.
        //
        // Es la misma trampa que el trofeo fantasma de la vitrina (ver palmares.ts): confundir
        // "no quedan partidos" con "no hay partidos".
        : usaFechasRealesParaMiClub
        ? false
        : resolvedSeason.fixtures.length > 0 && !resolvedSeason.fixtures.some(
            f => !f.played && (f.homeTeamId === myClub.id || f.awayTeamId === myClub.id));

      if (cerroElTorneo && resolvedSeason.table.length > 0) {
        // Torneo/año se calculan siempre que cierre, seas campeón o no: hacen falta para el rótulo
        // del festejo Y para el de fin de temporada del que no salió campeón.
        const formato = isApeturaClausuraLeague(myClub.league);
        const anio = hoyJuegoLigaPorCalendario
          ? Number(pasoHoy!.date.slice(0, 4))
          : anioDe(playerProfile, playerProfile.currentWeek);
        const semestreReal = hoyJuegoLigaPorCalendario
          ? torneoDelClubEnFecha(myClub.name, pasoHoy!.date)
          : null;
        const semestre = semestreReal ?? (resolvedSeason.semester === 2 ? 'Clausura' : 'Apertura');
        const torneo = formato ? `${semestre} ${anio}` : `Temporada ${anio}`;

        // En fase de knockout (playoff/final a ida y vuelta de Colombia, o a partido único de
        // Argentina) el campeón lo decide el resultado de la LLAVE, no la tabla de la fase regular
        // -- esa tabla queda congelada desde antes del playoff y no refleja el global de la final.
        // Antes acá se usaba sortTable(resolvedSeason.table) siempre, así que ganar el global de la
        // final por diferencia de gol de la fase regular (no del partido) coronaba a quien NO ganó
        // la final. Bug reportado: "me dio el campeonaao y habiamos empatado en el global".
        const tablaOrdenada = sortTable([...resolvedSeason.table]);
        // `enKnockout` miraba resolvedSeason.stage, que para una liga NUNCA vale 'knockout':
        // resolveLigaPorFecha -- el único camino que queda -- no lo setea. Y el campeón de la llave
        // salía de los cuadros internos, que nunca se llenaron. El cuadrangular lo corona el bloque
        // de playoff de más arriba, con playoffsDeLiga; acá sólo queda la liga de tabla directa.
        const lider = tablaOrdenada[0];
        // DONDE HAY CUADRANGULAR, LA TABLA NO CORONA A NADIE.
        //
        // La última fecha del Apertura ES la final del cuadrangular -- el 8 de junio de 2026, para el
        // Junior, las dos cosas caen el mismo día. Y las dos ramas corren: primero la del playoff,
        // que corona a quien ganó la llave, y después ésta, que corona al primero de la tabla y pisa
        // a la anterior. En Colombia y Argentina el campeón es el que gana el cuadrangular; salir
        // primero en la fase regular no da título, da la mejor siembra.
        //
        // Encontrado jugando una temporada entera con el Junior (scripts/jugar_carrera.ts): terminó
        // 1º de 20 en la tabla y ELIMINADO en cuadrangulares por Atlético Nacional, y el juego le
        // daba igual el "Apertura 2026". Es la misma familia que el título prematuro de febrero: el
        // torneo se corona por donde no se define.
        const esCampeon = hoyFuePlayoff
          ? false
          : !!lider && (lider.clubId === myClub.id || lider.name === myClub.name);
        if (esCampeon && jugoElTorneo) {
          salioCampeon = true;
          setChampionInfo({
            competition: getLeagueDisplay(myClub.league, myClub.division).name,
            clubName: myClub.name,
            season: torneo,
            badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
          });
          // El título se ANOTA en el perfil, no se deduce después de la tabla: la vitrina se
          // recalcula desde el estado actual y al empezar el Clausura la temporada se reinicia, así
          // que el Apertura ganado desaparecía. Anotado acá queda para siempre.
          //
          // getLeagueDisplay(..., myClub.division) y no sin división: un título de Barranquilla FC
          // (Segunda) se anunciaba y se guardaba como "Primera División Dimayor" -- el nombre de la
          // liga a la que ni siquiera pertenece. Bug reportado: "dice primera division".
          leagueTitleWon = {
            competition: nombreDeLaLigaHoy,
            year: anio,
            clubId: myClub.id,
            torneo: formato ? semestre : undefined,
            tipo: 'liga',
          };
        // `!hoyFuePlayoff`: en el día de la final del cuadrangular, el desenlace ya lo contó la rama
        // del playoff -- con la ronda y todo. Sin esto se apilaba encima un "terminaste 1º en la
        // tabla" de la fase regular, que a esa altura ya no es la noticia.
        } else if (!esCampeon && !hoyFuePlayoff) {
          // No saliste campeón de una liga de tabla directa (Brasil): antes el torneo se cerraba en
          // silencio y la carrera seguía sin que el jugador se enterara -- ni de que había
          // terminado, ni de en qué puesto quedó. Bug reportado: "el jugador jamás se da cuenta".
          //
          // El caso "perdiste la FINAL de knockout" no entra acá: lo cubre el bloque de eliminación
          // de playoff más arriba (estaEnPlayoffDeLiga), que ya sabe que la ronda era la Final y no
          // tiene sentido mostrar una "posición en la tabla" de la fase regular, ya superada.
          const miPos = tablaOrdenada.findIndex(r => r.clubId === myClub.id || r.name === myClub.name);
          setSeasonEndInfo({
            competition: getLeagueDisplay(myClub.league, myClub.division).name,
            clubName: myClub.name,
            season: torneo,
            badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
            finalPosition: miPos >= 0 ? miPos + 1 : null,
            totalTeams: tablaOrdenada.length,
          });
        }
      }

      updatedLeagueSeasons = { ...playerProfile.leagueSeasons, [leagueKey]: resolvedSeason };

      // Ligas ya visitadas (por traspasos anteriores) siguen corriendo de fondo aunque ya no juegues ahí.
      for (const key of Object.keys(updatedLeagueSeasons)) {
        if (key === leagueKey) continue;
        const otherLeagueClubs = clubesDeLiga(key);
        if (otherLeagueClubs.length === 0) continue;
        updatedLeagueSeasons[key] = getOrCreateSeasonForLeague(otherLeagueClubs, updatedLeagueSeasons[key], playerProfile.currentWeek + 1);
      }
    }

    let updatedContinentalCups = playerProfile.continentalCups;
    if (isCopaLibertadores && activeCupId && activeOppositionClubId) {
      const year = temporadaDe(playerProfile, playerProfile.currentWeek);
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const cupKey = `${activeCupId}-${year}`;
      // Mismo myClub.id que al armar el partido. Si acá se omite, este estado "antes del partido"
      // sale adelantado respecto del que el jugador vio en pantalla, y su resultado se aplica a una
      // ronda que no es la suya.
      const cupBeforeMatch = getOrCreateCupState(activeCupId, year, CLUBS_DATABASE, playerProfile.continentalCups[cupKey], fechasDeCopaTranscurridas(myClub.name, playerProfile.currentWeek, true, NOMBRE_DE_COPA[activeCupId]), playerProfile.posicionesFinales, undefined, myClub.id, grupoDelCalendario(activeCupId, myClub, year, playerProfile.posicionesFinales), repescadosDeLaLibertadores(playerProfile, year));
      const resolvedCup = resolveCupWeek(cupBeforeMatch, CLUBS_DATABASE, myClub.id, activeIsHome, results.golesMiEquipo, results.golesRival, shootoutOverride, repescadosDeLaLibertadores(playerProfile, year));
      const shootout = findShootoutInTwoLegBracket(resolvedCup.knockout, myClub.id, activeOppositionClubId);
      if (shootout) {
        foundShootout = shootout;
        foundShootoutMyId = myClub.id;
        foundShootoutMyName = myClub.name;
      }
      // Recién quedaste eliminado con este partido (estabas antes, ya no): avisar, igual que el
      // cierre de liga sin título. Sin esto la copa desaparecía en silencio de la carrera.
      if (!shootout || shootoutOverride) {
        const seguiaAntes = isClubStillInCup(cupBeforeMatch, myClub.id);
        const sigueAhora = isClubStillInCup(resolvedCup, myClub.id);
        const nombreDeLaCopa = activeCupId === 'sudamericana' ? 'Copa Sudamericana'
          : activeCupId === 'concacaf' ? 'Concacaf Champions Cup' : 'Copa Libertadores';
        if (seguiaAntes && !sigueAhora && resolvedCup.championId !== myClub.id) {
          const ultimaRonda = resolvedCup.knockout?.tiesByRound[resolvedCup.knockout.tiesByRound.length - 1];
          setSeasonEndInfo({
            competition: nombreDeLaCopa,
            clubName: myClub.name,
            season: String(year),
            badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
            eliminated: true,
            eliminatedRound: ultimaRonda ? roundLabelByMatchCount(ultimaRonda.length) : null,
          });
          setPlayerProfile(p => ({ ...p, ultimaEliminacion: { competicion: nombreDeLaCopa, semana: p.currentWeek } }));

          // EL TERCERO DEL GRUPO NO SE VA A CASA: baja a la Sudamericana y sigue jugando ahi. Se
          // anuncia DESPUES del cartel de eliminacion, no en vez de el: la Libertadores si termino.
          //
          // Se lee de `resolvedCup` y no del perfil porque el estado nuevo todavia no se guardo.
          if (activeCupId === 'libertadores' && tercerosDeGrupo(resolvedCup).includes(myClub.id)) {
            avisoEncolado.current = {
              competition: nombreDeLaCopa,
              clubName: myClub.name,
              season: String(year),
              badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
              bajaA: 'Copa Sudamericana',
            };
          }
        } else if (seguiaAntes && sigueAhora && !resolvedCup.championId && pasoDeRonda(cupBeforeMatch, resolvedCup)) {
          // PASASTE DE RONDA. El contrario exacto del caso de arriba, y hasta ahora no existia: la
          // copa te despedia al perder pero nunca te felicitaba al ganar. Avanzar es la mitad buena
          // del cuadro y pasaba en silencio.
          const nueva = resolvedCup.knockout?.tiesByRound[resolvedCup.knockout.tiesByRound.length - 1];
          setSeasonEndInfo({
            competition: nombreDeLaCopa,
            clubName: myClub.name,
            season: String(year),
            badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
            avanzo: true,
            rondaSiguiente: nueva ? roundLabelByMatchCount(nueva.length) : null,
          });
        }
      }
      updatedContinentalCups = { ...playerProfile.continentalCups, [cupKey]: resolvedCup };
    }

    let updatedUefaCups = playerProfile.uefaCups;
    if (isCopaLibertadores && activeUefaCupId && activeOppositionClubId) {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const uefaCupBeforeMatch = getOrCreateUefaCupState(activeUefaCupId, CLUBS_DATABASE, playerProfile.uefaCups[activeUefaCupId], fechasDeCopaTranscurridas(myClub.name, playerProfile.currentWeek, false, NOMBRE_DE_COPA_UEFA[activeUefaCupId]), undefined, undefined, myClub.id);
      // Desde el playoff en adelante, Champions/Europa es ida y vuelta (TwoLegTie): mismo bug ya
      // corregido en el playoff de liga y en la copa nacional -- la localía para el motor tiene que
      // salir de la llave interna, no del calendario real (activeIsHome), porque se invierte entre
      // ida y vuelta y puede no coincidir.
      const llaveUefaDelClub = uefaCupBeforeMatch.knockout?.tiesByRound[uefaCupBeforeMatch.knockout.tiesByRound.length - 1]
        ?.find(t => t.clubAId === myClub.id || t.clubBId === myClub.id)
        ?? uefaCupBeforeMatch.playoff?.find(t => t.clubAId === myClub.id || t.clubBId === myClub.id);
      const isHomeParaUefa = llaveUefaDelClub
        ? (llaveUefaDelClub.firstLegGoalsA === null
            ? llaveUefaDelClub.clubAId === myClub.id  // ida: A es local
            : llaveUefaDelClub.clubBId === myClub.id) // vuelta: se invierte, B es local
        : activeIsHome; // fase de liga (round-robin, sin ida/vuelta): el calendario real es correcto
      const resolvedUefaCup = resolveUefaCupWeek(uefaCupBeforeMatch, CLUBS_DATABASE, myClub.id, isHomeParaUefa, results.golesMiEquipo, results.golesRival, shootoutOverride);
      const shootout = findShootoutInTwoLegBracket(resolvedUefaCup.knockout, myClub.id, activeOppositionClubId)
        || findShootoutInTwoLegTies(resolvedUefaCup.playoff, myClub.id, activeOppositionClubId);
      if (shootout) {
        foundShootout = shootout;
        foundShootoutMyId = myClub.id;
        foundShootoutMyName = myClub.name;
      }
      if (!shootout || shootoutOverride) {
        const seguiaAntes = isClubStillInUefaCup(uefaCupBeforeMatch, myClub.id);
        const sigueAhora = isClubStillInUefaCup(resolvedUefaCup, myClub.id);
        if (seguiaAntes && !sigueAhora && resolvedUefaCup.championId !== myClub.id) {
          const ultimaRonda = resolvedUefaCup.knockout?.tiesByRound[resolvedUefaCup.knockout.tiesByRound.length - 1];
          setSeasonEndInfo({
            competition: activeUefaCupId === 'europa' ? 'Europa League' : 'Champions League',
            clubName: myClub.name,
            season: `Edición ${resolvedUefaCup.year}`,
            badgeUrl: myClub.badgeImageUrl ?? myClub.badgeLogoUrl ?? null,
            eliminated: true,
            eliminatedRound: ultimaRonda ? roundLabelByMatchCount(ultimaRonda.length) : null,
          });
        }
      }
      updatedUefaCups = { ...playerProfile.uefaCups, [activeUefaCupId]: resolvedUefaCup };
    }

    let updatedWorldCups = playerProfile.worldCups;
    // --- Resultado de un partido de ELIMINATORIA ------------------------------------------------
    //
    // Va antes que el Mundial y corta con `else`: los dos son partidos de selección y comparten
    // activeWorldCupTeamId, pero el resultado tiene que ir a la tabla de la eliminatoria, no al
    // cuadro del Mundial. Sin el corte, un partido de eliminatoria le movería el Mundial.
    let updatedEliminatorias = playerProfile.eliminatorias;
    if (activeEliminatoriaKey && activeWorldCupTeamId) {
      const guardada = playerProfile.eliminatorias?.[activeEliminatoriaKey];
      if (guardada) {
        updatedEliminatorias = {
          ...(playerProfile.eliminatorias ?? {}),
          [activeEliminatoriaKey]: resolverPasoEliminatoria(guardada, ALL_NATIONAL_TEAMS_DATABASE, {
            teamId: activeWorldCupTeamId,
            goals: results.golesMiEquipo,
            opponentGoals: results.golesRival,
          }),
        };
      }
    } else if (isCopaLibertadores && activeWorldCupTeamId && activeOppositionClubId) {
      const clubDelMundial = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
      // Mismo helper que al ofrecer el partido: si el torneo se resolviera con otros equipos o bajo
      // otra clave que los que se ofrecieron, el resultado caeria en un torneo que no es.
      const hoy = torneoDeSeleccionesDeHoyEnApp(playerProfile, clubDelMundial?.name ?? '');
      const seleccionesDeEsteMundial = hoy?.equipos ?? WORLD_CUP_TEAMS_DATABASE;
      const clave = hoy?.clave ?? String(temporadaDe(playerProfile, playerProfile.currentWeek));
      const wcBeforeMatch = getOrCreateWorldCupState(
        temporadaDe(playerProfile, playerProfile.currentWeek), seleccionesDeEsteMundial,
        playerProfile.worldCups[clave], hoy?.pasos ?? 0, hoy?.torneo ?? 'mundial');
      const resolvedWorldCup = resolveWorldCupWeek(wcBeforeMatch, seleccionesDeEsteMundial, activeWorldCupTeamId, activeIsHome, results.golesMiEquipo, results.golesRival, shootoutOverride);
      const shootout = findShootoutInPlayoffBracket(resolvedWorldCup.knockout, activeWorldCupTeamId, activeOppositionClubId);
      if (shootout) {
        foundShootout = shootout;
        foundShootoutMyId = activeWorldCupTeamId;
        foundShootoutMyName = seleccionesDeEsteMundial.find(t => t.id === activeWorldCupTeamId)?.name || '';
      }
      updatedWorldCups = { ...playerProfile.worldCups, [clave]: resolvedWorldCup };

      // GANAR CON LA SELECCION SE ANOTA COMO TITULO.
      //
      // No se anotaba. La vitrina lo DEDUCIA del estado guardado -- por eso el trofeo aparecia --
      // pero los logros leen cupTitles, asi que "Campeon del Mundo", "El Record de Pele" (tres
      // Mundiales) y el de ganarlo antes de los 20 eran inalcanzables aunque lo ganaras. Es la
      // misma forma de bug que el Mundial que no coronaba: nadie escribia el dato que otro leia.
      if (resolvedWorldCup.championId && resolvedWorldCup.championId === activeWorldCupTeamId) {
        const comoSeLlama: Record<TorneoDeSelecciones, string> = {
          mundial: 'Copa del Mundo', eurocopa: 'Eurocopa', copaamerica: 'Copa América',
        };
        cupTitleWon = {
          competition: comoSeLlama[hoy?.torneo ?? 'mundial'],
          year: anioDeCarrera(clubDelMundial?.name ?? '', playerProfile.currentWeek),
          clubId: activeWorldCupTeamId,
          tipo: 'copa',
        };
        setChampionInfo({
          competition: comoSeLlama[hoy?.torneo ?? 'mundial'],
          clubName: seleccionesDeEsteMundial.find(t => t.id === activeWorldCupTeamId)?.name ?? '',
          season: String(anioDeCarrera(clubDelMundial?.name ?? '', playerProfile.currentWeek)),
          badgeUrl: null,
        });
      }
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
        !!(isCopaLibertadores && activeUefaCupId && activeOppositionClubId),
        playerProfile
      );
      updatedContinentalCups = synced.continentalCups;
      updatedUefaCups = synced.uefaCups;
    }

    // Fase 3 -- salud mental según el resultado del partido, y saludo de famoso si el rating fue altísimo.
    //
    // Tener un mentor amortigua SÓLO la caída, nunca agranda la subida: un referente del plantel te
    // levanta después de una derrota, no te hace festejar más una victoria. Se aplica al golpe ya
    // calculado para que la regla siga viviendo en un solo lugar.
    const golpeAnimicoBase = results.resultado === 'W' ? 4 : results.resultado === 'L' ? -5 : -1;
    const tieneMentor = !!playerProfile.mentorName && puedeTenerMentor(playerProfile.age);
    const conMentor = tieneMentor && golpeAnimicoBase < 0
      ? Math.ceil(golpeAnimicoBase * MENTOR_DEFEAT_CUSHION)
      : golpeAnimicoBase;
    // El entorno se aplica DESPUÉS del mentor y sobre el mismo golpe: son dos redes distintas -- una
    // del vestuario y otra de afuera -- y tener las dos amortigua más que tener una sola. Como las
    // dos sólo actúan sobre caídas, no hay forma de que una victoria termine valiendo más.
    const matchMentalHealthChange = ajustePorEntorno(playerProfile.entorno ?? ENTORNO_INICIAL, conMentor);
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
    // EL CLÁSICO MULTIPLICA LO QUE ESTÁ EN JUEGO, y sólo la afición: un clásico no vale seis puntos,
    // pero en la calle vale por diez. Perder duele MÁS de lo que ganar suma (1.6 contra 2.2), que es
    // como se siente de verdad -- al clásico se lo recuerda por las derrotas.
    const hoyEsClasico = !!activeOppositionClubId
      && esClasico(playerProfile.currentClubId, activeOppositionClubId);
    const multiplicadorClasico = !hoyEsClasico ? 1
      : results.resultado === 'W' ? CLASICO_MULTIPLICADOR_GANAR
      : results.resultado === 'L' ? CLASICO_MULTIPLICADOR_PERDER
      : 1;
    const netFansChange = Math.round(
      (decisionFansChange - (isViralNegativePerformance ? VIRAL_NEGATIVE_FANS_PENALTY : 0))
      * multiplicadorClasico);

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

    // Lesiones: opt-in por SetupScreen (injuriesEnabled). Si está desactivado, este bloque entero
    // se salta y el comportamiento es bit a bit igual al de antes de que existiera la feature.
    let newActiveInjury: ActiveInjury | null = playerProfile.activeInjury ?? null;
    let newInjuryHistory = playerProfile.injuryHistory ?? [];
    let altaConSecuela: ReturnType<typeof darDeAlta> | null = null;
    let injuryMessage: string | null = null;
    if (playerProfile.injuriesEnabled) {
      // FORZASTE LA VUELTA Y JUGASTE ROTO. Acá se cobra -- o se zafa.
      //
      // Este roll existía desde antes y era CÓDIGO MUERTO: las dos puertas al partido cortaban con
      // weeksRemaining > 0, así que era imposible llegar hasta acá con una lesión activa y el
      // "riesgo de recaída" que anunciaba el tratamiento rápido no se ejecutaba nunca. Forzar la
      // vuelta (ver src/lesion.ts) es lo que lo vuelve alcanzable.
      //
      // El riesgo ESCALA con lo que falta: adelantar una fecha es una apuesta, adelantar seis es una
      // imprudencia, y un porcentaje plano volvería la decisión trivial.
      if (forzandoLaVuelta(playerProfile)) {
        const restantes = newActiveInjury!.weeksRemaining;
        if (Math.random() < riesgoDeRecaida(restantes)) {
          const tipo = INJURY_TYPES.find(t => t.id === newActiveInjury!.type)!;
          const weeks = tipo.minWeeks + Math.floor(Math.random() * (tipo.maxWeeks - tipo.minWeeks + 1));
          // La recaída BORRA la elección de forzar: volvés a foja cero y tenés que decidir de nuevo.
          // Si se heredara 'forzar', seguirías jugando roto sin haberlo vuelto a elegir.
          newActiveInjury = { type: tipo.id, weeksRemaining: weeks, startedWeek: playerProfile.currentWeek, treatmentChoice: undefined };
          injuryMessage = `⚠️ RECAÍDA: forzaste la vuelta y la lesión (${tipo.label}) se reactivó. ${weeks} semana(s) más afuera.`;
        } else {
          // Aguantaste. El tiempo corre igual -- el partido cuenta como una fecha menos de
          // recuperación, así que forzar no te deja atrapado en un riesgo eterno: en algún momento
          // llegás al alta, jugando.
          const quedan = restantes - 1;
          if (quedan <= 0) {
            const alta = darDeAlta({ ...playerProfile, injuryHistory: newInjuryHistory }, newActiveInjury!, playerProfile.currentWeek + 1);
            newInjuryHistory = alta.injuryHistory;
            altaConSecuela = alta;
            newActiveInjury = null;
            // "Estás entero" sólo si de verdad lo estás: aguantar jugando roto es justo lo que puede
            // dejar marca, y decir que no pasó nada cuando pasó es la peor forma de contarlo.
            injuryMessage = alta.ultimaSecuela
              ? `💪 Aguantaste jugando lesionado hasta el alta, pero no salió gratis.`
              : `💪 Aguantaste jugando lesionado hasta el final de la recuperación. Estás entero.`;
          } else {
            newActiveInjury = { ...newActiveInjury!, weeksRemaining: quedan };
            injuryMessage = `😬 Aguantaste el partido con la lesión encima. Te quedan ${quedan} fecha(s) de riesgo.`;
          }
        }
      } else if (!newActiveInjury) {
        const difficultyMultiplier = playerProfile.difficultyMode === 'realista' ? 1.6 : 1;
        // La cuenta vive en src/lesion.ts, con el tope de fatiga y el porque del tope.
        const chance = riesgoDeLesion(playerProfile.matchesWithoutRest, difficultyMultiplier);
        if (Math.random() < chance) {
          // Con pesos, no uniforme: casi todo son golpes y desgarros, la fractura es rarisima.
          const tipo = sortearTipoDeLesion(Math.random());
          const weeks = tipo.minWeeks + Math.floor(Math.random() * (tipo.maxWeeks - tipo.minWeeks + 1));
          newActiveInjury = { type: tipo.id, weeksRemaining: weeks, startedWeek: playerProfile.currentWeek };
          injuryMessage = `🩹 Te lesionaste: ${tipo.label}. Vas a estar afuera ${weeks} semana(s).`;
        }
      }
      if (injuryMessage) disciplineMessages.push(injuryMessage);
    }

    if (lostInvestments.length > 0) {
      disciplineMessages.push(`📉 Perdiste el capital invertido en ${lostInvestments.map(l => l.inv.name).join(', ')}.`);
    }

    // Trayectoria de carrera: solo partidos de CLUB (liga o copas de clubes) suman a la tabla de
    // temporadas, no los de la selección -- ver recordSeasonHistory.
    const updatedSeasonHistory = activeWorldCupTeamId
      ? playerProfile.seasonHistory
      : recordSeasonHistory(
          playerProfile.seasonHistory,
          temporadaDe(playerProfile, playerProfile.currentWeek),
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

    // Cabeza a cabeza: solo partidos de club contra un rival identificado (no selección, no
    // simulación de fondo sin rival concreto).
    const updatedHeadToHead = (() => {
      if (activeWorldCupTeamId || !activeOpposition) return playerProfile.headToHeadRecords;
      const key = activeOpposition;
      const previo = playerProfile.headToHeadRecords?.[key] ?? { rivalName: activeOpposition, wins: 0, draws: 0, losses: 0, lastMeetingWeek: 0 };
      const nuevo = {
        rivalName: activeOpposition,
        wins: previo.wins + (results.golesMiEquipo > results.golesRival ? 1 : 0),
        draws: previo.draws + (results.golesMiEquipo === results.golesRival ? 1 : 0),
        losses: previo.losses + (results.golesMiEquipo < results.golesRival ? 1 : 0),
        // LO TUYO CONTRA ELLOS, que es de donde sale el clasico personal. El resultado del club ya
        // estaba; esto es lo que hiciste vos, y sin esto no hay historia que contar.
        goles: (previo.goles ?? 0) + results.goles,
        asistencias: (previo.asistencias ?? 0) + results.asistencias,
        lastMeetingWeek: playerProfile.currentWeek,
      };
      return { ...(playerProfile.headToHeadRecords ?? {}), [key]: nuevo };
    })();

    const updated: PlayerProfile = {
      ...playerProfile,
      missedClubMatchesForCountry:
        playerProfile.missedClubMatchesForCountry + (countryDuty?.important ? 1 : 0),
      // Jugar roto cansa distinto. Se descuenta ACÁ, después del partido, así que el costo real no
      // es sólo este número: entrás a la fecha siguiente con menos energía, y la fatiga acumulada ya
      // sube por su cuenta el riesgo de lesionarte de nuevo. Forzar dos o tres fechas seguidas se
      // paga solo, sin necesidad de una regla aparte que lo castigue.
      // Y el bajón anímico se cobra en el mismo lugar: dormir mal también se paga en piernas. Pesa
      // menos que jugar roto (12 contra 14) y los dos se suman si te toca lo peor de los dos --
      // que es exactamente cuando debería doler.
      energy: Math.max(5, Math.min(100, playerProfile.energy - finalEnergySpent + totalExtraRecover
        - (forzandoLaVuelta(playerProfile) ? PENALIDAD_ENERGIA_LESIONADO : 0)
        - (estaEnBajon(playerProfile) ? PENALIDAD_ENERGIA_BAJON : 0))),
      capital: Math.max(0, playerProfile.capital + totalIncome - disciplineFine),
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + netPrestigeChange + (countryDuty?.prestige ?? 0))),
      fans: Math.max(0, Math.min(100, playerProfile.fans + netFansChange)),
      yellowCards: newYellowCards,
      suspendedMatches: newSuspendedMatches,
      activeInjury: newActiveInjury,
      injuryHistory: newInjuryHistory,
      // El alta que ocurrió jugando: los atributos ya vienen con la secuela aplicada, si la hubo.
      ...(altaConSecuela ? {
        attributes: altaConSecuela.attributes,
        ultimaSecuela: altaConSecuela.ultimaSecuela,
        secuelasDeCarrera: altaConSecuela.secuelasDeCarrera,
      } : {}),
      investments: updatedInvestments,
      seasonHistory: updatedSeasonHistory,
      headToHeadRecords: updatedHeadToHead,
      domesticCups: updatedDomesticCups,
      playoffsDeLiga: updatedPlayoffs,
      // Copas y ligas van a la misma lista: todo campeonato ganado queda anotado en la vitrina.
      // El filtro por id evita duplicar si se rejuega el mismo paso.
      // LÍDERES DE LA COMPETICIÓN QUE SE JUGÓ HOY. Ver lideresPorCompeticion.ts.
      //
      // Se anota acá, en el mismo lugar donde ya se resuelve todo lo del partido, porque acá se sabe
      // con certeza QUÉ competición fue -- el mismo dato que usa el rótulo de la pantalla de partido
      // y el marcador del calendario. Antes el panel de estadísticas mostraba siempre los líderes de
      // la liga, sacados de una tabla fija, y el jugador no figuraba en ninguna.
      lideresPorCompeticion: (() => {
        const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
        if (!myClub) return playerProfile.lideresPorCompeticion;
        // LA CLAVE SALE DEL CALENDARIO, igual que del lado del panel. Es la unica forma de que las
        // dos mitades se encuentren.
        //
        // Antes se usaba activeCompetitionName, o getLeagueDisplay como respaldo, y eso guardaba la
        // fecha de liga bajo "Primera Division Dimayor" mientras el panel la buscaba como "Liga
        // BetPlay Dimayor" -- el nombre que trae el calendario. Las claves no coincidian NUNCA, asi
        // que la tabla se veia vacia por mas partidos que jugaras y el panel caia siempre a los
        // datos fijos. Reportado: "la tabla de goleadores sigue vacia despues de mas de 10
        // partidos". Misma familia que el bug de los titulos: dos nombres para la misma liga.
        const pasoDeHoy = fixturesAtStep(myClub.name, playerProfile.currentWeek);
        const fixtureDeHoy = pasoDeHoy ? pickDatedPrimary(pasoDeHoy.fixtures) : null;
        // Y en un dia RESERVADO de copa continental manda TU copa, no la que le tocó a tu liga: la
        // reserva se guarda bajo la copa de la liga (al Junior, Sudamericana) aunque el club juegue
        // la Libertadores. El panel ya hace esta misma correccion, y si acá no se hiciera la misma,
        // las dos volverian a apuntar a claves distintas.
        // La correccion ya existia, pero solo cubria Libertadores y Sudamericana: la Concacaf, la
        // Champions y la Europa caian igual bajo el nombre de la copa que reservo el dia. Ahora sale
        // de nombreDeLaCopaDeHoy, que es la misma respuesta que usa el historial.
        const nombreDeMiCopa = nombreDeLaCopaDeHoy();
        const nombreComp = (fixtureDeHoy?.esReservaDeCuadro && nombreDeMiCopa)
          ? nombreDeMiCopa
          : fixtureDeHoy?.competition.name
          ?? activeCompetitionName
          ?? (activeDomesticCup ? nombreCopaNacional(myClub.league) : getLeagueDisplay(myClub.league, myClub.division).name);
        const temporadaHoy = temporadaDelPaso(myClub.name, playerProfile.currentWeek)?.temporada
          ?? temporadaDe(playerProfile, playerProfile.currentWeek);
        const clave = claveDeCompeticion(nombreComp, temporadaHoy);

        const rivalClub = CLUBS_DATABASE.find(c => c.id === activeOppositionClubId);
        // Los goles del rival se reparten entre sus figuras: el motor simula marcadores, no
        // goleadores, y sin este reparto la tabla sería un ranking de un solo nombre -- el tuyo.
        const delRival = rivalClub
          ? repartirGoles(rivalClub.starPlayers ?? [], rivalClub.name, results.golesRival)
          : [];
        // Los goles de tu equipo que NO metiste vos también se reparten entre tus compañeros.
        const deLosMios = repartirGoles(
          (myClub.starPlayers ?? []).filter(f => !f.startsWith(playerProfile.name)),
          myClub.name,
          Math.max(0, results.golesMiEquipo - results.goles));

        // Tarjetas: las tuyas son reales (salen de tus decisiones en el partido); las de los demás
        // se simulan, porque el motor no las genera y si no "más amarillas" del torneo serías
        // siempre vos con una sola.
        const tarjeta: 'none' | 'yellow' | 'red' = results.cardReceived || 'none';
        const tarjetasAjenas = [
          ...(rivalClub ? repartirTarjetas(rivalClub.starPlayers ?? [], rivalClub.name) : []),
          ...repartirTarjetas((myClub.starPlayers ?? []).filter(f => !f.startsWith(playerProfile.name)), myClub.name),
        ];
        // Portería menos vencida: cada arquero suma un partido y los goles que le hicieron.
        const miArquero = arqueroDe(myClub.starPlayers ?? []);
        const suArquero = rivalClub ? arqueroDe(rivalClub.starPlayers ?? []) : null;
        const arqueros = [
          ...(miArquero ? [{ nombre: miArquero, clubName: myClub.name, partidosDeArquero: 1, golesRecibidos: results.golesRival }] : []),
          ...(suArquero && rivalClub ? [{ nombre: suArquero, clubName: rivalClub.name, partidosDeArquero: 1, golesRecibidos: results.golesMiEquipo }] : []),
        ];

        // LOS OTROS PARTIDOS DE LA FECHA. Es lo que convierte la tabla en la de la LIGA y no en la
        // de tus partidos: hasta acá, los nueve partidos que el motor simula de fondo no aportaban
        // ni un goleador, así que el jugador se veía a sí mismo primero a las pocas fechas.
        //
        // Sólo para la liga: en las copas el motor resuelve el cuadro entero de una y atribuirle
        // goleadores a rondas que el jugador todavía no vio adelantaría el torneo en la pantalla.
        // Es liga si hoy no jugaste copa: activeCupId/uefa/domesticCup cubren los tres casos, y son
        // los mismos flags con los que se armó el partido.
        const esDiaDeLiga = !activeCupId && !activeUefaCupId && !activeDomesticCup && !activeWorldCupTeamId;
        const deLaFecha = esDiaDeLiga
          ? otrosPartidosDeLaFecha.flatMap(p => {
              const local = CLUBS_DATABASE.find(c => c.id === p.homeTeamId);
              const visita = CLUBS_DATABASE.find(c => c.id === p.awayTeamId);
              return [
                ...(local ? repartirGoles(local.starPlayers ?? [], local.name, p.homeGoals) : []),
                ...(visita ? repartirGoles(visita.starPlayers ?? [], visita.name, p.awayGoals) : []),
                ...(local ? repartirTarjetas(local.starPlayers ?? [], local.name) : []),
                ...(visita ? repartirTarjetas(visita.starPlayers ?? [], visita.name) : []),
                ...(local && arqueroDe(local.starPlayers ?? [])
                  ? [{ nombre: arqueroDe(local.starPlayers ?? [])!, clubName: local.name, partidosDeArquero: 1, golesRecibidos: p.awayGoals }] : []),
                ...(visita && arqueroDe(visita.starPlayers ?? [])
                  ? [{ nombre: arqueroDe(visita.starPlayers ?? [])!, clubName: visita.name, partidosDeArquero: 1, golesRecibidos: p.homeGoals }] : []),
              ];
            })
          : [];

        return anotarEnLideres(playerProfile.lideresPorCompeticion, clave, [
          ...deLaFecha,
          {
            nombre: playerProfile.name, clubName: myClub.name,
            goles: results.goles, asistencias: results.asistencias,
            amarillas: tarjeta === 'yellow' ? 1 : 0, rojas: tarjeta === 'red' ? 1 : 0,
            esVos: true,
          },
          ...delRival, ...deLosMios, ...tarjetasAjenas, ...arqueros,
        ]);
      })(),
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
      // La nota entra al historial de forma junto con el paso en que se jugó (ver src/forma.ts). El
      // paso hace falta para que una lesión larga corte la racha: sin él, volverías de dos meses
      // afuera todavía "en racha" por partidos de antes de romperte, y eso es memoria, no forma.
      formaReciente: anotarNota(playerProfile.formaReciente, results.rating, playerProfile.currentWeek),
      // En hardcore la temporada se cierra mirando como rendiste, asi que hay que ir guardando las
      // notas: sin ellas applyHardcoreGrowthIfNewSeason no tiene con que decidir y todos los anios
      // darian lo mismo. Fuera de hardcore no se guarda nada.
      // El acumulado de toda la carrera, sumando lo del partido que acaba de terminar.
      jugadasPorAtributo: (() => {
        const previo = { ...(playerProfile.jugadasPorAtributo ?? {}) };
        for (const [k, v] of Object.entries(results.jugadasAcertadas ?? {})) {
          previo[k as keyof PlayerStats] = (previo[k as keyof PlayerStats] ?? 0) + (v as number);
        }
        return previo;
      })(),
      notasDeLaTemporada: playerProfile.hardcoreEnabled
        ? [...(playerProfile.notasDeLaTemporada ?? []), results.rating]
        : playerProfile.notasDeLaTemporada,
      lastMatchGoals: results.goles,
      lastMatchWonShootout: !!shootoutOverride && shootoutOverride.winnerId === (activeWorldCupTeamId || playerProfile.currentClubId),
      currentWeek: playerProfile.currentWeek + 1,
      leagueSeasons: updatedLeagueSeasons,
      continentalCups: updatedContinentalCups,
      uefaCups: updatedUefaCups,
      worldCups: updatedWorldCups,
      eliminatorias: updatedEliminatorias,
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
      `Tienes ${profile.age} años y el cuerpo ya te pasa factura. Puedes colgar los botines ahora, con la carrera todavía fresca en la memoria de la gente, o aguantar ${anosRestantes} ${anosRestantes === 1 ? 'año más' : 'años más'} hasta el retiro definitivo a los ${RETIREMENT_MAX_AGE}.\n\n¿Te retirás ahora?\n\nAceptar = me retiro    ·    Cancelar = sigo jugando`
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
        esLaCasaQueEspera(profile, stepDownClub)
          ? `Sigues. Pero a los ${profile.age} en ${clubName} vas a pelear cada minuto.\n\nY ${stepDownClub.name} te llamó. Donde empezó todo. Menos plata y menos luces, pero ahí te esperan.\n\n¿Volvés a casa?\n\nAceptar = vuelvo    ·    Cancelar = me quedo`
          : `Sigues. Pero a los ${profile.age} en ${clubName} vas a pelear cada minuto.\n\n¿Quieres bajar a ${stepDownClub.name}, donde vas a jugar seguido aunque haya menos luces?\n\nAceptar = bajo de categoría    ·    Cancelar = me quedo`
      )) {
        const prestigeCompanerosAlBajar = profile.prestigeCompaneros ?? profile.prestige;
        const steppedDown: PlayerProfile = {
          ...profile,
          currentClubId: stepDownClub.id,
          currentWeek: pasoEnElClubNuevo(profile, CLUBS_DATABASE.find(c => c.id === profile.currentClubId), stepDownClub),
          hasSteppedDownRetirement: true,
          marketValue: Math.max(50000, Math.round(profile.marketValue * STEP_DOWN_MARKET_VALUE_MULTIPLIER)),
          prestige: Math.round(profile.prestige * STEP_DOWN_PRESTIGE_MULTIPLIER),
          prestigeCompaneros: Math.round(prestigeCompanerosAlBajar * STEP_DOWN_PRESTIGE_MULTIPLIER)
        };
        setPlayerProfile(steppedDown);
        setShopItems(updatedShopItems);
        saveGameState(steppedDown, updatedShopItems);
        setScreen('dashboard');
        notify(esLaCasaQueEspera(profile, stepDownClub)
          ? `🏠 ${volvisteACasa(stepDownClub.name, profile.age)}`
          : `🔻 Bajaste de categoría a ${stepDownClub.name} para seguir compitiendo. Menos luces, pero sigues en la cancha.`);
        return;
      }
    }

    // Se queda donde está, un año más.
    setPlayerProfile(profile);
    setShopItems(updatedShopItems);
    saveGameState(profile, updatedShopItems);
    setScreen('dashboard');
    notify(`💪 Sigues en ${clubName}. A los ${profile.age} años, cada partido es un regalo.`);
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

  // Pantalla de espera de las pantallas diferidas. Va con la identidad del juego y no con un
  // spinner genérico: en una conexión lenta puede verse un instante, y ese instante también es
  // parte del juego. Se muestra a pantalla completa porque las pantallas que envuelve lo son.
  const cargando = (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-slate-500">
      <div className="w-10 h-10 rounded-full border-2 border-slate-800 border-t-gold-500 animate-spin" />
      <span className="text-2xs font-mono uppercase tracking-widest">Preparando la cancha…</span>
    </div>
  );

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

      {!championInfo && seasonEndInfo && screen === 'dashboard' && playerProfile && (
        <SeasonEndOverlay
          info={seasonEndInfo}
          onClose={() => {
            const siguiente = avisoEncolado.current;
            avisoEncolado.current = null;
            setSeasonEndInfo(siguiente);
          }}
        />
      )}

      {newSeasonInfo && screen === 'dashboard' && playerProfile && (
        <NewSeasonOverlay
          info={newSeasonInfo}
          onClose={() => setNewSeasonInfo(null)}
        />
      )}

      {/* Se muestra encima de lo que sea que esté en pantalla al cerrar el año -- el jugador puede
          estar en 'dashboard' o recién yendo a 'post_match', y de cualquier forma la gala tiene que
          verse una vez por año cerrado, no depender de en qué pantalla cayó el cierre. */}
      {ballonDorInfo && !newSeasonInfo && !seasonEndInfo && !championInfo && playerProfile && (
        <BallonDorOverlay
          info={ballonDorInfo}
          onClose={() => setBallonDorInfo(null)}
        />
      )}

      {/* Fuera de los bloques por pantalla a propósito: montado una sola vez acá, el iframe
          sobrevive los cambios de pantalla y la canción no se corta al entrar a un partido.
          Se esconde en welcome/setup para no competir con el arranque del juego. */}
      <MusicPlayer hidden={screen === 'welcome' || screen === 'setup'} />

      {/* Ajustes de sonido siempre a mano: sirve para silenciar el juego sin abrir el reproductor
          de música. Comparte estado con él (todo vive en audio.ts). */}
      <SoundSettings hidden={screen === 'welcome' || screen === 'setup'} />

      {/* Un solo Suspense para todas las pantallas: sólo hay una montada por vez, así que no hace
          falta uno por cada una. */}
      <Suspense fallback={cargando}>

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
          onSelectMentor={handleSelectMentor}
          onVisitarEntorno={handleVisitarEntorno}
          onSalirDelBajon={handleSalirDelBajon}
          onFindGirlfriend={handleFindGirlfriend}
          onGirlfriendFlowers={handleGirlfriendFlowers}
          onGirlfriendPhoto={handleGirlfriendPhoto}
          onGirlfriendFaithful={handleGirlfriendFaithful}
          onGirlfriendCheat={handleGirlfriendCheat}
          onGirlfriendDenyRumors={handleGirlfriendDenyRumors}
          onGirlfriendMoveIn={handleGirlfriendMoveIn}
          onPropose={handlePropose}
          onHaveChild={handleHaveChild}
          onTreatInjury={handleTreatInjury}
          onSelectRole={handleSelectRole}
          onRefreshTransferOffers={handleRefreshTransferOffers}
          onHireAgent={handleHireAgent}
          onFireAgent={handleFireAgent}
          onRequestRenewal={handleRequestRenewal}
          onLoanOut={handleLoanOut}
          onResolveLoan={handleResolveLoan}
          onBuyInvestment={handleBuyInvestment}
          onReconvertPosition={handleReconvertPosition}
          onBuyItem={handleBuyItem}
          onAcceptSponsor={handleAcceptSponsor}
          onCancelSponsor={handleCancelSponsor}
          onLaunchPRCampaign={handleLaunchPRCampaign}
          onAnswerPress={handleAnswerPress}
          onPublicar={handlePublicar}
          onAcceptTransfer={handleAcceptTransfer}
          onAdvanceWeek={() => handleAdvanceWeek(false)}
          onSimularPartido={() => handleAdvanceWeek(true)}
          onFinalizeSeason={handleFinalizeSeason}
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
          globalScoreLabel={activeGlobalScoreLabel}
          torneoLabel={activeTorneoLabel}
          isWorldCup={!!activeWorldCupTeamId}
          representingTeamId={activeWorldCupTeamId}
          isHome={activeIsHome}
          myTablePosition={activeMyTablePosition}
          rivalTablePosition={activeRivalTablePosition}
          leagueTeamCount={activeLeagueTeamCount}
          lineupStatus={activeLineupStatus}
          subEntryMinute={activeSubEntryMinute}
          autoSimular={simularEstePartido}
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
          // El diario cuenta el DESENLACE, no solo el partido. seasonEndInfo ya lo calcula para el
          // overlay -- eliminado en tal ronda, o paso a la siguiente -- asi que se reusa en vez de
          // deducirlo por segunda vez y arriesgar que las dos cuentas digan cosas distintas.
          desenlaceDeCopa={seasonEndInfo?.eliminated
            ? { tipo: 'eliminado' as const, competicion: seasonEndInfo.competition, ronda: seasonEndInfo.eliminatedRound }
            : null}
          onContinue={handleContinuePostMatch}
        />
      )}

      {screen === 'event' && activeEvent && (
        <DecisionCenter
          event={activeEvent}
          onResolve={handleResolveEvent}
        />
      )}

      </Suspense>

    </div>
  );
}