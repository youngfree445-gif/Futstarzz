import React, { useState, useEffect } from 'react';
import { PlayerProfile, ShopItem, PlayerStats } from './types';
import {
  INITIAL_LIFESTYLE_ITEMS, LOBBY_RANDOM_EVENTS, OPPONENT_CLUBS_POOL, ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE,
  WORLD_CUP_TEAMS_DATABASE, NATIONALITY_TO_WORLD_CUP_TEAM_ID
} from './data';
import {
  leagueKeyFor, getOrCreateSeasonForLeague, getUpcomingMatchForLeague, resolvePlayerWeekForLeague, isCupWeek, sortTable,
  getSeasonYear, getLibertadoresParticipants, getSudamericanaParticipants, getOrCreateCupState, getUpcomingCupMatch, resolveCupWeek,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState, getUpcomingUefaCupMatch, resolveUefaCupWeek,
  isWorldCupYear, getOrCreateWorldCupState, getUpcomingWorldCupMatch, resolveWorldCupWeek
} from './leagueEngine';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen from './components/SetupScreen';
import Dashboard from './components/Dashboard';
import MatchSimulator from './components/MatchSimulator';
import PostMatch from './components/PostMatch';
import DecisionCenter from './components/DecisionCenter';

// Prestigio mínimo para que te convoquen a la selección en un año de Mundial.
const WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD = 70;

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'setup' | 'dashboard' | 'match' | 'post_match' | 'event'>('welcome');
  
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
    const profileWithLeague: PlayerProfile = { ...newProfile, leagueSeasons: { [leagueKey]: season } };

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
      energy: Math.max(0, Math.min(100, playerProfile.energy + energyChange))
    };
    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
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
        const updated = {
          ...playerProfile,
          energy: Math.min(100, playerProfile.energy + 45),
          currentWeek: playerProfile.currentWeek + 1
        };
        setPlayerProfile(updated);
        saveGameState(updated, shopItems);
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

    const isCup = isCupWeek(playerProfile.currentWeek);
    setIsCopaLibertadores(isCup);

    let opName = '';
    let opClubId: string | null = null;
    let isHomeThisMatch = Math.random() > 0.5;
    // Declarado afuera del if/else de isCup para no quedar con un valor "viejo" de una
    // semana de copa anterior contaminando una semana doméstica normal (bug real detectado:
    // sin esto, handleFinishMatch podía resolver el Mundial con el resultado de un partido
    // de liga doméstica de otra semana).
    let foundWorldCupTeamId: string | null = null;

    if (isCup) {
      const year = getSeasonYear(playerProfile.currentWeek);
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;

      // El Mundial tiene prioridad sobre las obligaciones de copa de tu club: si te convocan,
      // esa semana jugás para tu selección (mismo cupo de semanas de copa que Libertadores/UEFA).
      if (isWorldCupYear(year)) {
        const wcTeamId = NATIONALITY_TO_WORLD_CUP_TEAM_ID[playerProfile.nationality];
        const isEligible = !!wcTeamId && playerProfile.prestige >= WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD;
        if (isEligible) {
          const wcState = getOrCreateWorldCupState(year, WORLD_CUP_TEAMS_DATABASE, playerProfile.worldCups[year], playerProfile.currentWeek);
          const upcoming = getUpcomingWorldCupMatch(wcState, wcTeamId);
          if (upcoming) {
            const opponentTeam = WORLD_CUP_TEAMS_DATABASE.find(t => t.id === upcoming.opponentId);
            opName = opponentTeam?.name || '';
            opClubId = upcoming.opponentId;
            isHomeThisMatch = upcoming.isHome;
            foundWorldCupTeamId = wcTeamId;
          }
        }
      }

      const libertadoresIds = new Set(getLibertadoresParticipants(CLUBS_DATABASE));
      const sudamericanaIds = new Set(getSudamericanaParticipants(CLUBS_DATABASE));
      const qualifiedCupId: 'libertadores' | 'sudamericana' | null = libertadoresIds.has(myClub.id)
        ? 'libertadores'
        : sudamericanaIds.has(myClub.id)
        ? 'sudamericana'
        : null;

      let foundOpponentId: string | null = null;
      if (!foundWorldCupTeamId && qualifiedCupId) {
        const cupKey = `${qualifiedCupId}-${year}`;
        const cup = getOrCreateCupState(qualifiedCupId, year, CLUBS_DATABASE, playerProfile.continentalCups[cupKey], playerProfile.currentWeek);
        const upcoming = getUpcomingCupMatch(cup, myClub.id);
        if (upcoming) {
          const opponentClub = CLUBS_DATABASE.find(c => c.id === upcoming.opponentId);
          opName = opponentClub?.name || '';
          opClubId = upcoming.opponentId;
          isHomeThisMatch = upcoming.isHome;
          foundOpponentId = upcoming.opponentId;
        }
      }
      setActiveCupId(foundOpponentId ? qualifiedCupId : null);

      // Si el club no juega Libertadores/Sudamericana (ligas sudamericanas), probamos Champions/Europa League.
      let foundUefaOpponentId: string | null = null;
      if (!foundWorldCupTeamId && !foundOpponentId) {
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
          }
        }
        setActiveUefaCupId(foundUefaOpponentId ? qualifiedUefaCupId : null);
      } else {
        setActiveUefaCupId(null);
      }

      // Club no clasificado a ninguna copa este año, o copa entre rondas (sin partido esta semana puntual): rival de relleno.
      if (!foundWorldCupTeamId && !foundOpponentId && !foundUefaOpponentId) {
        const giants = ['CR Flamengo', 'SE Palmeiras', 'CA Boca Juniors', 'CA River Plate', 'Fluminense FC', 'SC Corinthians', 'Peñarol (URU)', 'Nacional (URU)'];
        opName = giants[Math.floor(Math.random() * giants.length)];
      }
      setActiveMyTablePosition(null);
      setActiveRivalTablePosition(null);
      setActiveLeagueTeamCount(null);
    } else {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const leagueKey = leagueKeyFor(myClub);
      const leagueClubs = CLUBS_DATABASE.filter(c => leagueKeyFor(c) === leagueKey);
      const season = playerProfile.leagueSeasons[leagueKey] ?? getOrCreateSeasonForLeague(leagueClubs, undefined, playerProfile.currentWeek);
      const upcoming = getUpcomingMatchForLeague(season, leagueClubs, playerProfile.currentWeek, myClub.id);

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

  const handleResolveEvent = (effects: { prestige: number; fans: number; energy: number; capital: number }) => {
    if (!playerProfile) return;

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      prestige: Math.max(0, Math.min(100, playerProfile.prestige + effects.prestige) ),
      fans: Math.max(0, Math.min(100, playerProfile.fans + effects.fans)),
      energy: Math.max(0, Math.min(100, playerProfile.energy + effects.energy)),
      capital: Math.max(0, playerProfile.capital + (effects.capital || 0))
    };

    setPlayerProfile(updatedProfile);
    saveGameState(updatedProfile, shopItems);
    setActiveEvent(null);
    
    startMatchflow();
  };

  const handleFinishMatch = (results: any) => {
    if (!playerProfile) return;

    setMatchResults(results);

    const baseEnergySpent = 28;
    const coachItem = shopItems.find(i => i.id === 'physical_coach');
    const houseItem = shopItems.find(i => i.id === 'luxury_mansion');
    const passiveGamingItem = shopItems.find(i => i.id === 'gaming_sponsorship');

    const reduction = coachItem?.purchased ? 10 : 0;
    const finalEnergySpent = Math.max(10, baseEnergySpent - reduction);

    const goalBonus = results.goles * 500;
    const assistBonus = results.asistencias * 250;
    const activePassiveDividend = passiveGamingItem?.purchased ? 2500 : 0;

    const totalIncome = results.salaryEarned + goalBonus + assistBonus + activePassiveDividend;
    const totalExtraRecover = (coachItem?.purchased ? 8 : 0) + (houseItem?.purchased ? 20 : 0);

    const valueChg = results.rating * 6000 + (results.goles * 25000) + (results.asistencias * 15000);
    const campeonatoGanado = results.campeonatoGanado ? 1 : 0;

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
      updatedContinentalCups = { ...playerProfile.continentalCups, [cupKey]: resolvedCup };
    }

    let updatedUefaCups = playerProfile.uefaCups;
    if (isCopaLibertadores && activeUefaCupId && activeOppositionClubId) {
      const myClub = CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
      const uefaCupBeforeMatch = getOrCreateUefaCupState(activeUefaCupId, CLUBS_DATABASE, playerProfile.uefaCups[activeUefaCupId], playerProfile.currentWeek);
      const resolvedUefaCup = resolveUefaCupWeek(uefaCupBeforeMatch, CLUBS_DATABASE, myClub.id, activeIsHome, results.golesMiEquipo, results.golesRival);
      updatedUefaCups = { ...playerProfile.uefaCups, [activeUefaCupId]: resolvedUefaCup };
    }

    let updatedWorldCups = playerProfile.worldCups;
    if (isCopaLibertadores && activeWorldCupTeamId && activeOppositionClubId) {
      const year = getSeasonYear(playerProfile.currentWeek);
      const wcBeforeMatch = getOrCreateWorldCupState(year, WORLD_CUP_TEAMS_DATABASE, playerProfile.worldCups[year], playerProfile.currentWeek);
      const resolvedWorldCup = resolveWorldCupWeek(wcBeforeMatch, WORLD_CUP_TEAMS_DATABASE, activeWorldCupTeamId, activeIsHome, results.golesMiEquipo, results.golesRival);
      updatedWorldCups = { ...playerProfile.worldCups, [year]: resolvedWorldCup };
    }

    const updated: PlayerProfile = {
      ...playerProfile,
      energy: Math.max(5, Math.min(100, playerProfile.energy - finalEnergySpent + totalExtraRecover)),
      capital: playerProfile.capital + totalIncome,
      marketValue: Math.max(100000, playerProfile.marketValue + valueChg),
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
        partidosHistoricos: playerProfile.careerStats.partidosHistoricos + 1
      }
    };

    setPlayerProfile(updated);
    saveGameState(updated, shopItems);
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
          onBuyItem={handleBuyItem}
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