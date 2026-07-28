import React, { useState, useEffect } from 'react';
import { PlayerProfile, ShopItem, PlayerStats, Position, Club, PenaltyShootoutResult, PlayoffBracket, TwoLegBracket, TwoLegTie, SeasonHistory } from './types';
import {
  INITIAL_LIFESTYLE_ITEMS, LOBBY_RANDOM_EVENTS, OPPONENT_CLUBS_POOL, ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE,
  WORLD_CUP_TEAMS_DATABASE, NATIONALITY_TO_WORLD_CUP_TEAM_ID, MAX_ACTIVE_SPONSORSHIPS
} from './data';
import {
  leagueKeyFor, getOrCreateSeasonForLeague, getUpcomingMatchForLeague, resolvePlayerWeekForLeague, isCupWeek, sortTable,
  getSeasonYear, getLibertadoresParticipants, getSudamericanaParticipants, getOrCreateCupState, getUpcomingCupMatch, resolveCupWeek,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState, getUpcomingUefaCupMatch, resolveUefaCupWeek,
  isWorldCupBreakWeek, getOrCreateWorldCupState, getUpcomingWorldCupMatch, resolveWorldCupWeek, simulateMatch,
  WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD, WORLD_CUP_CALLUP_MIN_MATCHES
} from './leagueEngine';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen from './components/SetupScreen';
import Dashboard from './components/Dashboard';
import MatchSimulator from './components/MatchSimulator';
import PostMatch from './components/PostMatch';
import DecisionCenter from './components/DecisionCenter';
import PenaltyShootout from './components/PenaltyShootout';
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

function isPastRetirementAge(profile: PlayerProfile): boolean {
  return profile.age >= FORCED_RETIREMENT_AGE;
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
  const [activeWorldCupTeamId, setActiveWorldCupTeamId] = useState<string | null>(null);
  // Posiciones en la tabla al momento de armar el partido (solo liga doméstica -- en copas/Mundial
  // no hay una tabla comparable entre rivales de países distintos). Alimentan tanto el badge de
  // posiciones en MatchSimulator como el multiplicador de dificultad de las decisiones.
  const [activeMyTablePosition, setActiveMyTablePosition] = useState<number | null>(null);
  const [activeRivalTablePosition, setActiveRivalTablePosition] = useState<number | null>(null);
  const [activeLeagueTeamCount, setActiveLeagueTeamCount] = useState<number | null>(null);
  const [matchResults, setMatchResults] = useState<any>(null);
  const [activePenaltyShootout, setActivePenaltyShootout] = useState<{ result: PenaltyShootoutResult; myId: string; myName: string } | null>(null);

  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

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
    if (profile.lastMatchRating === undefined) {
      profile = { ...profile, lastMatchRating: 0 };
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

  const handleTrainAttribute = (attr: keyof PlayerStats) => {
    if (!playerProfile) return;
    if (playerProfile.energy < 20) {
      alert('¡No tienes suficiente energía para entrenar!');
      return;
    }

    const updatedProfile = {
      ...playerProfile,
      energy: playerProfile.energy - 20,
      attributes: {
        ...playerProfile.attributes,
        [attr]: Math.min(99, playerProfile.attributes[attr] + 3)
      }
    };

    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
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
    alert(`Te reconvertiste a ${newPosition}. El cuerpo técnico ajustó tu plan de entrenamiento a la nueva posición.`);
  };

  // Solo lujos puros (sin category, ver ShopItem en types.ts) pasan por acá -- los patrocinios
  // viven en handleAcceptSponsor, con su propia lógica de "oferta que te llega" en vez de compra.
  const handleBuyItem = (itemId: string) => {
    if (!playerProfile) return;
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (playerProfile.capital < item.cost) {
      alert('No cuentas con el capital suficiente para adquirir este lujo.');
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
      alert(`Ya tenés un patrocinio activo de la categoría "${item.category}" (${conflicting.name}). Esperá a que termine ese contrato antes de firmar otro del mismo rubro.`);
      return;
    }

    const activeSponsorships = shopItems.filter(i => i.purchased && i.category).length;
    if (activeSponsorships >= MAX_ACTIVE_SPONSORSHIPS) {
      alert(`Ya tenés el máximo de ${MAX_ACTIVE_SPONSORSHIPS} patrocinios activos al mismo tiempo. Tu agenda comercial está completa.`);
      return;
    }

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      capital: playerProfile.capital + item.cost,
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + (item.effect.prestigeBonus || 0))),
      fans: Math.max(0, Math.min(100, playerProfile.fans + (item.effect.fansBonus || 0)))
    };

    const updatedShop = shopItems.map(i => i.id === itemId ? { ...i, purchased: true } : i);

    setPlayerProfile(updatedProfile);
    setShopItems(updatedShop);
    saveGameState(updatedProfile, updatedShop);
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
      alert('No tienes los fondos necesarios.');
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
    alert(cost < 0 ? '¡Contrato firmado con éxito!' : 'Campaña ejecutada con éxito.');
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
      alert(`📉 Tu declaración generó ruido de sobra. ${droppedNames.join(', ')} ${verb} con vos por la polémica.`);
    }
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
      leagueSeasons: { ...playerProfile.leagueSeasons, [leagueKey]: season }
    };

    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    alert(`🎉 ¡TRASPASO CONFIRMADO! Todo listo para presentarte en: ${targetClub.name}.`);
  };

  const handleAdvanceWeek = () => {
    if (!playerProfile) return;

    if (playerProfile.energy < 20) {
      if (!confirm('Tu nivel de fatiga física es alarmante (Energía < 20). ¿Deseas arriesgarte a saltar al campo?')) {
        const restSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, false, false);
        const updated = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 45),
          mentalHealth: Math.min(100, playerProfile.mentalHealth + 6), // descansar en vez de forzar la máquina te despeja la cabeza
          currentWeek: playerProfile.currentWeek + 1,
          continentalCups: restSync.continentalCups,
          uefaCups: restSync.uefaCups
        };
        const agedRest = applyAgingIfNewSeason(updated, playerProfile.currentWeek, updated.currentWeek);
        if (isPastRetirementAge(agedRest)) {
          triggerForcedRetirement(agedRest);
          return;
        }
        setPlayerProfile(agedRest);
        saveGameState(agedRest, shopItems);
        alert('Decidiste descansar este fin de semana. Recuperas +45 de Energía.');
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
        setActiveMyTablePosition(null);
        setActiveRivalTablePosition(null);
        setActiveLeagueTeamCount(null);
      } else {
        // Fecha FIFA sin partido puntual para vos (no convocado, tu selección ya quedó
        // eliminada, o estás entre rondas): no hay actividad de clubes en absoluto esta semana,
        // ni de liga ni de copa -- descansás de verdad, como en la vida real.
        const restSync = syncBackgroundCups(playerProfile.currentClubId, playerProfile.currentWeek + 1, playerProfile.continentalCups, playerProfile.uefaCups, true, true);
        const updated = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 20),
          currentWeek: playerProfile.currentWeek + 1,
          continentalCups: restSync.continentalCups,
          uefaCups: restSync.uefaCups
        };
        const aged = applyAgingIfNewSeason(updated, playerProfile.currentWeek, updated.currentWeek);
        if (isPastRetirementAge(aged)) {
          triggerForcedRetirement(aged);
          return;
        }
        setPlayerProfile(aged);
        saveGameState(aged, shopItems);
        alert('📅 FECHA FIFA: el Mundial paraliza la actividad de clubes en todo el mundo. Esta semana no hay partido de liga ni de copa para tu club.');
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
      if (qualifiedCupId) {
        const cupKey = `${qualifiedCupId}-${year}`;
        const cup = getOrCreateCupState(qualifiedCupId, year, CLUBS_DATABASE, playerProfile.continentalCups[cupKey], playerProfile.currentWeek);
        const upcoming = getUpcomingCupMatch(cup, myClub.id);
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

      // Club no clasificado a ninguna copa este año, o copa entre rondas (sin partido esta semana puntual): rival de relleno.
      if (!foundOpponentId && !foundUefaOpponentId) {
        const giants = ['CR Flamengo', 'SE Palmeiras', 'CA Boca Juniors', 'CA River Plate', 'Fluminense FC', 'SC Corinthians', 'Peñarol (URU)', 'Nacional (URU)'];
        opName = giants[Math.floor(Math.random() * giants.length)];
      }
      setActiveMyTablePosition(cupMyPos);
      setActiveRivalTablePosition(cupRivalPos);
      setActiveLeagueTeamCount(cupTeamCount);
    } else {
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
      leagueSeasons: updatedLeagueSeasons,
      continentalCups: suspendedSync.continentalCups,
      uefaCups: suspendedSync.uefaCups
    };

    const aged = applyAgingIfNewSeason(updated, playerProfile.currentWeek, updated.currentWeek);

    if (isPastRetirementAge(aged)) {
      triggerForcedRetirement(aged);
      return;
    }

    setPlayerProfile(aged);
    saveGameState(aged, shopItems);
    alert(`🚫 Cumpliste tu sanción esta fecha. Sin vos en el campo, ${myClub.name} ${isHomeThisMatch ? myGoals : rivalGoals}-${isHomeThisMatch ? rivalGoals : myGoals} ${opponentClub.name}.${aged.suspendedMatches > 0 ? ` Te quedan ${aged.suspendedMatches} partido(s) más de sanción.` : ''}`);
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
      alert(`📉 El escándalo llegó a la prensa. ${droppedNames.join(', ')} ${verb} con vos.`);
    }
    if (effects.suspension) {
      alert(`🚫 Sanción disciplinaria: te perderás ${effects.suspension} partido${effects.suspension > 1 ? 's' : ''} de liga.`);
    }

    startMatchflow();
  };

  const handleFinishMatch = (results: any) => {
    if (!playerProfile) return;

    setMatchResults(results);

    const baseEnergySpent = 28;
    const coachItem = shopItems.find(i => i.id === 'physical_coach');
    const houseItem = shopItems.find(i => i.id === 'luxury_mansion');

    const reduction = coachItem?.purchased ? 10 : 0;
    const finalEnergySpent = Math.max(10, baseEnergySpent - reduction);

    // FASE 3 -- economía más dura: bonos por gol/asistencia recortados ~25% respecto al original.
    const goalBonus = results.goles * 380;
    const assistBonus = results.asistencias * 180;
    // Patrocinios "casi infinitos": sumamos el dividendo pasivo de TODOS los items comprados que
    // tengan uno, en vez de tener un caso especial hardcodeado por cada patrocinio nuevo.
    const activePassiveDividend = shopItems.filter(i => i.purchased).reduce((sum, i) => sum + (i.effect.passiveIncome || 0), 0);

    const totalIncome = results.salaryEarned + goalBonus + assistBonus + activePassiveDividend;
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
        activeIsHome, results.golesMiEquipo, results.golesRival
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
      const resolvedCup = resolveCupWeek(cupBeforeMatch, CLUBS_DATABASE, myClub.id, activeIsHome, results.golesMiEquipo, results.golesRival);
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
      const resolvedUefaCup = resolveUefaCupWeek(uefaCupBeforeMatch, CLUBS_DATABASE, myClub.id, activeIsHome, results.golesMiEquipo, results.golesRival);
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
      const resolvedWorldCup = resolveWorldCupWeek(wcBeforeMatch, WORLD_CUP_TEAMS_DATABASE, activeWorldCupTeamId, activeIsHome, results.golesMiEquipo, results.golesRival);
      const shootout = findShootoutInPlayoffBracket(resolvedWorldCup.knockout, activeWorldCupTeamId, activeOppositionClubId);
      if (shootout) {
        foundShootout = shootout;
        foundShootoutMyId = activeWorldCupTeamId;
        foundShootoutMyName = WORLD_CUP_TEAMS_DATABASE.find(t => t.id === activeWorldCupTeamId)?.name || '';
      }
      updatedWorldCups = { ...playerProfile.worldCups, [year]: resolvedWorldCup };
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

    // Tarjetas, multas y sanciones: el prestigio/fans que acumularon las decisiones del partido
    // (antes muerto, nunca se aplicaba) se liquida acá. Una roja (directa o por doble amarilla)
    // suma sanción de la federación y multa, además del golpe de prestigio de la jugada en sí.
    const YELLOW_CARD_SUSPENSION_THRESHOLD = 5;
    const RED_CARD_FINE = 15000;
    const RED_CARD_PRESTIGE_PENALTY = 8;

    const cardReceived: 'none' | 'yellow' | 'red' = results.cardReceived || 'none';
    const decisionPrestigeChange = results.prestigeChange || 0;
    const decisionFansChange = results.fansChange || 0;
    const netPrestigeChange = decisionPrestigeChange - (cardReceived === 'red' ? RED_CARD_PRESTIGE_PENALTY : 0);

    let newYellowCards = playerProfile.yellowCards;
    let newSuspendedMatches = playerProfile.suspendedMatches;
    let disciplineFine = 0;
    const disciplineMessages: string[] = [];

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
      disciplineMessages.push(`📉 ${droppedNames.join(', ')} ${verb} con vos tras lo sucedido en el partido.`);
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

    const updated: PlayerProfile = {
      ...playerProfile,
      energy: Math.max(5, Math.min(100, playerProfile.energy - finalEnergySpent + totalExtraRecover)),
      capital: Math.max(0, playerProfile.capital + totalIncome - disciplineFine),
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + netPrestigeChange)),
      fans: Math.max(0, Math.min(100, playerProfile.fans + decisionFansChange)),
      yellowCards: newYellowCards,
      suspendedMatches: newSuspendedMatches,
      seasonHistory: updatedSeasonHistory,
      marketValue: Math.max(100000, playerProfile.marketValue + valueChg + viralMarketBonus),
      mentalHealth: Math.max(0, Math.min(100, playerProfile.mentalHealth + matchMentalHealthChange)),
      lastMatchRating: results.rating,
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

    const aged = applyAgingIfNewSeason(updated, playerProfile.currentWeek, updated.currentWeek);

    if (isPastRetirementAge(aged)) {
      triggerForcedRetirement(aged);
      return;
    }

    setPlayerProfile(aged);
    setShopItems(updatedShop);
    saveGameState(aged, updatedShop);
    if (disciplineMessages.length > 0) {
      alert(disciplineMessages.join('\n'));
    }

    if (foundShootout) {
      setActivePenaltyShootout({ result: foundShootout, myId: foundShootoutMyId, myName: foundShootoutMyName });
      setScreen('penalty_shootout');
    } else {
      setScreen('post_match');
    }
  };

  const handleContinueFromShootout = () => {
    setActivePenaltyShootout(null);
    setScreen('post_match');
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
      alert('No tienes suficientes fondos en tu cuenta bancaria para pagar este tratamiento.');
      return;
    }
    if (playerProfile.energy >= 100) {
      alert('¡Tu energía ya está al máximo! Estás a tope para jugar.');
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
        />
      )}

      {screen === 'dashboard' && playerProfile && (
        <Dashboard
          playerProfile={playerProfile}
          shopItems={shopItems}
          onTrainAttribute={handleTrainAttribute}
          onReconvertPosition={handleReconvertPosition}
          onBuyItem={handleBuyItem}
          onAcceptSponsor={handleAcceptSponsor}
          onCancelSponsor={handleCancelSponsor}
          onLaunchPRCampaign={handleLaunchPRCampaign}
          onAnswerPress={handleAnswerPress}
          onAcceptTransfer={handleAcceptTransfer}
          onAdvanceWeek={handleAdvanceWeek}
          onRecoverEnergy={handleRecoverEnergy}
          onLogout={() => setScreen('welcome')}
          onResetGame={handleResetGame}
        />
      )}

      {screen === 'match' && playerProfile && (
        <MatchSimulator
          playerProfile={playerProfile}
          opponentName={activeOpposition}
          isLibertadores={isCopaLibertadores}
          isWorldCup={!!activeWorldCupTeamId}
          representingTeamId={activeWorldCupTeamId}
          isHome={activeIsHome}
          myTablePosition={activeMyTablePosition}
          rivalTablePosition={activeRivalTablePosition}
          leagueTeamCount={activeLeagueTeamCount}
          onFinishMatch={handleFinishMatch}
        />
      )}

      {screen === 'career_summary' && playerProfile && (
        <CareerSummary
          playerProfile={playerProfile}
          onContinue={handleFinishCareerSummary}
        />
      )}

      {screen === 'penalty_shootout' && activePenaltyShootout && (
        <PenaltyShootout
          shootout={activePenaltyShootout.result}
          myClubId={activePenaltyShootout.myId}
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