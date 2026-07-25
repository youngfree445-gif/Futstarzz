import React, { useState, useEffect } from 'react';
import { PlayerProfile, Club, ShopItem, TableTeam, Position, PlayerStats } from '../types';
// Corregido: Importamos ULTIMATE_CLUBS_DATABASE y getClubWithRoster en lugar de soccerDatabase (que solo tenía 3 clubes de prueba hardcodeados)
import { ULTIMATE_CLUBS_DATABASE, PRESS_QUESTIONS_POOL, getClubWithRoster, MAX_ACTIVE_SPONSORSHIPS, WORLD_CUP_TEAMS_DATABASE, NATIONALITY_TO_WORLD_CUP_TEAM_ID } from '../data';
import {
  leagueKeyFor, sortTable, getSeasonYear, isCupWeek, isWorldCupBreakWeek,
  getLibertadoresParticipants, getSudamericanaParticipants, getOrCreateCupState, getUpcomingCupMatch,
  getChampionsParticipants, getEuropaParticipants, getOrCreateUefaCupState, getUpcomingUefaCupMatch,
  getOrCreateWorldCupState, getUpcomingWorldCupMatch, WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD, WORLD_CUP_CALLUP_MIN_MATCHES, isWorldCupYear,
  isTransferWindowOpen, weeksUntilTransferWindow, formatRealDate, getRealDate
} from '../leagueEngine';
import {
  User, Award, Dumbbell, Send, Radio, RefreshCw, ShoppingBag,
  Table, Zap, DollarSign, Star, Heart, Flame, LogOut, ArrowRight, CheckCircle,
  ShieldAlert, Sparkles, MessageCircle, TrendingUp, HelpCircle, Brain, Calendar
} from 'lucide-react';
import ClubBadge from './ClubBadge';

interface DashboardProps {
  playerProfile: PlayerProfile;
  shopItems: ShopItem[];
  onTrainAttribute: (attr: keyof PlayerStats) => void;
  onReconvertPosition: (newPosition: Position) => void;
  onBuyItem: (itemId: string) => void;
  onAcceptSponsor: (itemId: string) => void;
  onCancelSponsor: (itemId: string) => void;
  onLaunchPRCampaign: (cost: number, fansBonus: number, prestigeBonus: number, salaryBonus?: number) => void;
  onAnswerPress: (prestigeChange: number, fansChange: number, energyChange: number) => void;
  onAcceptTransfer: (clubId: string, signOnBonus: number) => void;
  onAdvanceWeek: () => void;
  onRecoverEnergy: (cost: number, energyAmount: number) => void;
  onLogout: () => void;
  onResetGame: () => void;
}

export default function Dashboard({
  playerProfile,
  shopItems,
  onTrainAttribute,
  onReconvertPosition,
  onBuyItem,
  onAcceptSponsor,
  onCancelSponsor,
  onLaunchPRCampaign,
  onAnswerPress,
  onAcceptTransfer,
  onAdvanceWeek,
  onRecoverEnergy,
  onLogout,
  onResetGame
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'carrera' | 'entrenamiento' | 'chutsocial' | 'prensa' | 'traspasos' | 'tienda' | 'patrocinios' | 'tablas' | 'mi_club' | 'calendario'>('carrera');
  const [pressResponseState, setPressResponseState] = useState<'asking' | 'answered'>('asking');
  const [pressReaction, setPressReaction] = useState('');

  // Al avanzar de semana vuelve a habilitarse la sala de prensa (la respuesta de la semana
  // anterior queda igual bloqueada por lastPressAnsweredWeek en el perfil).
  useEffect(() => {
    setPressResponseState('asking');
  }, [playerProfile.currentWeek]);

  // Corregido: Busca el club en la base de datos inyectada con el JSON
  const currentClub = ULTIMATE_CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
  const myLeagueKey = leagueKeyFor(currentClub);
  const myLeagueTable = sortTable(playerProfile.leagueSeasons[myLeagueKey]?.table || []);

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

  // Para el post de "campeón del Mundo" en ChutSocial -- ver generateCupChampionPosts.
  const wcState = isWorldCupYear(cupYear)
    ? getOrCreateWorldCupState(cupYear, WORLD_CUP_TEAMS_DATABASE, playerProfile.worldCups[cupYear], playerProfile.currentWeek)
    : null;

  // Calendario: próximos rivales de liga y de copa, en el orden real en que ya están fijados en
  // el fixture -- no se regeneran ni cambian una vez creados, así que esto es fiel a lo que de
  // verdad va a pasar (ver generateRoundRobin/drawCupGroups en leagueEngine.ts).
  const clubNameByIdEarly = (id: string) => ULTIMATE_CLUBS_DATABASE.find(c => c.id === id)?.name || id;
  const myLeagueFixtures = playerProfile.leagueSeasons[myLeagueKey]?.fixtures || [];
  const upcomingLeagueFixtures = myLeagueFixtures
    .filter(f => !f.played && (f.homeTeamId === currentClub.id || f.awayTeamId === currentClub.id))
    .sort((a, b) => a.matchweek - b.matchweek)
    .slice(0, 6)
    .map(f => ({
      matchweek: f.matchweek,
      isHome: f.homeTeamId === currentClub.id,
      opponentId: f.homeTeamId === currentClub.id ? f.awayTeamId : f.homeTeamId,
      opponentName: clubNameByIdEarly(f.homeTeamId === currentClub.id ? f.awayTeamId : f.homeTeamId)
    }));

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

  // Tarjeta "Próximo Partido" (estilo modo carrera FIFA/EA FC): quién es el rival de la
  // semana que viene depende de si esa semana es de copa (isCupWeek) o de liga -- misma
  // regla que ya usa handleAdvanceWeek en App.tsx para decidir qué partido se juega.
  // Si la semana que viene cae dentro de la ventana del Mundial (ver isWorldCupBreakWeek en
  // leagueEngine.ts), NI la liga doméstica NI Libertadores/Champions tienen partido -- están
  // realmente congeladas -- así que el único rival posible es el de la selección (y solo si estás
  // convocado y tu selección todavía tiene partido pendiente esa semana puntual).
  const nextWeekInWorldCupBreak = isWorldCupBreakWeek(playerProfile.currentWeek + 1);
  const nextWeekIsCup = !nextWeekInWorldCupBreak && isCupWeek(playerProfile.currentWeek + 1);
  let nextMatchOpponent: { club: Club | undefined; name: string; isHome: boolean; competition: string } | null = null;
  if (nextWeekInWorldCupBreak) {
    const wcYear = getSeasonYear(playerProfile.currentWeek + 1);
    const wcTeamId = NATIONALITY_TO_WORLD_CUP_TEAM_ID[playerProfile.nationality];
    const isEligible = !!wcTeamId
      && playerProfile.prestige >= WORLD_CUP_CALLUP_PRESTIGE_THRESHOLD
      && playerProfile.careerStats.partidosHistoricos >= WORLD_CUP_CALLUP_MIN_MATCHES;
    if (isEligible) {
      const wcState = getOrCreateWorldCupState(wcYear, WORLD_CUP_TEAMS_DATABASE, playerProfile.worldCups[wcYear], playerProfile.currentWeek + 1);
      const upcoming = getUpcomingWorldCupMatch(wcState, wcTeamId!);
      if (upcoming) {
        nextMatchOpponent = {
          club: WORLD_CUP_TEAMS_DATABASE.find(t => t.id === upcoming.opponentId),
          name: WORLD_CUP_TEAMS_DATABASE.find(t => t.id === upcoming.opponentId)?.name || '',
          isHome: upcoming.isHome,
          competition: 'Copa Mundial FIFA'
        };
      }
    }
  } else if (nextWeekIsCup) {
    const competition = conmebolCupId === 'libertadores' ? 'Copa Libertadores'
      : conmebolCupId === 'sudamericana' ? 'Copa Sudamericana'
      : uefaCupId === 'champions' ? 'Champions League'
      : uefaCupId === 'europa' ? 'Europa League'
      : '';
    const next = upcomingCupFixtures[0] ?? upcomingCupKnockoutOpponent;
    if (next && competition) {
      nextMatchOpponent = {
        club: ULTIMATE_CLUBS_DATABASE.find(c => c.id === next.opponentId),
        name: next.opponentName,
        isHome: next.isHome,
        competition
      };
    }
  }
  if (!nextMatchOpponent && !nextWeekInWorldCupBreak && upcomingLeagueFixtures.length > 0) {
    const next = upcomingLeagueFixtures[0];
    nextMatchOpponent = {
      club: ULTIMATE_CLUBS_DATABASE.find(c => c.id === next.opponentId),
      name: next.opponentName,
      isHome: next.isHome,
      competition: currentClub.league
    };
  }

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
      const signOnBonus = Math.round(c.marketValue * 0.01 + (playerProfile.careerStats.golesHistoricos * 750));
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
      avatar: celeb.avatar
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
      avatar: critic.avatar
    }];
  };

  // Rumores de mercado sobre OTROS jugadores de OTROS clubes (usa Club.starPlayers, datos reales
  // ya cargados en la base) -- para que el mercado no gire únicamente alrededor del jugador.
  const generateRivalTransferBuzzPosts = () => {
    const candidates = ULTIMATE_CLUBS_DATABASE.filter(c => c.id !== currentClub.id && c.starPlayers?.length > 0);
    if (candidates.length === 0) return [];
    const personas = [
      { author: 'Fichajes al Día', role: 'Cuenta de Mercado', avatar: '📋' },
      { author: 'Radar de Pases', role: 'Especialista en Fichajes', avatar: '🕵️' },
    ];
    const picked = [...candidates].sort(() => Math.random() - 0.5).slice(0, 2);
    return picked.map((club, idx) => {
      const star = club.starPlayers[Math.floor(Math.random() * club.starPlayers.length)];
      const persona = personas[idx % personas.length];
      const options = [
        `RUMOR: ${star} podría dejar ${club.name} este mercado. Varios clubes ya preguntaron por su cláusula.`,
        `${club.name} negocia la renovación de ${star} para blindarlo de ofertas externas.`,
        `Se cae la chance: ${star} de ${club.name} descartó una salida por ahora, según su entorno.`,
      ];
      return {
        id: `rivaltransfer_${club.id}_${playerProfile.currentWeek}_${idx}`,
        author: persona.author,
        role: persona.role,
        content: options[Math.floor(Math.random() * options.length)],
        likes: 100 + Math.floor(Math.random() * 1500),
        commentsCount: 20 + Math.floor(Math.random() * 300),
        timestamp: 'Mercado de Pases',
        avatar: persona.avatar
      };
    });
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

  const generateSocialFeed = () => {
    const pName = playerProfile.name;
    const basePosts = [
      {
        id: 'tweet_1',
        author: 'Fabián Torres',
        role: 'Periodista Deportivo',
        content: `¿Es ${pName} la revelación más grande del fútbol continental este año? Con solo ${playerProfile.age} años mantiene una lectura táctica increíble en el campo. #CalcioManager`,
        likes: 1240,
        commentsCount: 382,
        timestamp: 'Hace 2 horas',
        avatar: '🎙️'
      },
      {
        id: 'tweet_2',
        author: 'UltraVerde_99',
        role: 'Hincha Fiel',
        content: `¡Qué jugadorazo es ${pName}! Se nota la diferencia de jerarquía absoluta cuando pide la pelota en tres cuartos de cancha. ¡Titular inamovible siempre!`,
        likes: 852,
        commentsCount: 94,
        timestamp: 'Hace 4 horas',
        avatar: '⚽'
      },
      {
        id: 'tweet_3',
        author: 'La Redonda Oficial',
        role: 'Medio de Comunicación',
        content: `MERCADO: Varios intermediarios monitorean de cerca el rendimiento de ${pName}. Su valor sube como la espuma.`,
        likes: 3410,
        commentsCount: 812,
        timestamp: 'Hace 6 hours',
        avatar: '🔥'
      },
      {
        id: 'tweet_4',
        author: 'Compañero de Equipo',
        role: 'Primer Equipo',
        content: `Concentrados en el vestuario con el crack ${pName}. Esta semana se labura el doble pensando en los tres puntos del fin de semana. ¡Vamos equipo! 🦁`,
        likes: 620,
        commentsCount: 45,
        timestamp: 'Ayer',
        avatar: '👟'
      }
    ];
    return [
      ...generateCelebrityShoutoutPost(),
      ...generateCriticalPressPost(),
      ...basePosts,
      ...generateMatchdayReactionPosts(),
      ...generateRivalTransferBuzzPosts(),
      ...generateCupChampionPosts()
    ];
  };

  const handlePressAnswer = (opt: any) => {
    onAnswerPress(opt.prestigeChange, opt.fansChange, opt.energyChange);
    setPressReaction(opt.reaction);
    setPressResponseState('answered');
  };

  // La pregunta de esta semana rota según la semana de carrera (no es un estado libre que se
  // pudiera ciclear para reintentar) -- cada semana nueva trae una conferencia distinta.
  const selectedPressQ = playerProfile.currentWeek % PRESS_QUESTIONS_POOL.length;

  return (
    <div id="dashboard-view" className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row relative">
      
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 z-20">
        <div className="space-y-6">
          
          <div className="p-4 flex items-center gap-3 border-b border-slate-800">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center font-black text-slate-950 italic text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              FS
            </div>
            <div>
              <div className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest leading-none">
                Fútbol Star
              </div>
              <div className="text-sm font-black italic text-white tracking-tight leading-tight mt-0.5">
                CONSOLA 2026
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-amber-500 uppercase tracking-widest font-mono font-bold block mb-1">
              Ficha Profesional
            </span>
            <h2 className="font-extrabold text-sm text-white truncate">{playerProfile.name}</h2>
            <div className="flex justify-between items-center text-3xs text-slate-400 font-mono mt-1">
              <span>{playerProfile.position}</span>
              <span>{playerProfile.age} años</span>
            </div>
            
            <div className={`mt-2.5 p-2 rounded-xl text-xs font-bold truncate flex items-center gap-1.5 ${currentClub.badgeColor}`}>
              <ClubBadge club={currentClub} size={20} colorFallback={false} className="bg-black/25 font-normal" />
              <span className="truncate">{currentClub.name}</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('carrera')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'carrera' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <User size={15} /> Mi Carrera
            </button>
            <button
              onClick={() => setActiveTab('mi_club')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'mi_club' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Sparkles size={15} /> Plantilla de Club 
            </button>
            <button
              onClick={() => setActiveTab('entrenamiento')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'entrenamiento' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Dumbbell size={15} /> Entrenamiento
            </button>
            <button
              onClick={() => setActiveTab('chutsocial')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'chutsocial' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Send size={15} /> ChutSocial
            </button>
            <button
              onClick={() => setActiveTab('prensa')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'prensa' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Radio size={15} /> Sala de Prensa
            </button>
            <button
              onClick={() => setActiveTab('traspasos')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'traspasos' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <RefreshCw size={15} /> Traspasos
            </button>
            <button
              onClick={() => setActiveTab('tienda')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'tienda' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <ShoppingBag size={15} /> Tienda de Lujos
            </button>
            <button
              onClick={() => setActiveTab('patrocinios')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'patrocinios' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Award size={15} /> Patrocinios
            </button>
            <button
              onClick={() => setActiveTab('tablas')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'tablas' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Table size={15} /> Copas y Tablas
            </button>
            <button
              onClick={() => setActiveTab('calendario')}
              className={`btn-fx-subtle w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'calendario' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Calendar size={15} /> Calendario
            </button>
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-800">
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
        
        <header className="bg-slate-900 border-b border-slate-800 p-4 md:px-8 flex flex-col md:flex-row gap-4 justify-between items-center z-10">
          
          <div className="flex gap-1.5 items-center flex-wrap">
            <span className="text-emerald-400 text-sm font-black">SEMANA {playerProfile.currentWeek}</span>
            <span className="text-slate-500 text-2xs">· {formatRealDate(playerProfile.currentWeek)}</span>
            {playerProfile.suspendedMatches > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-3xs font-black uppercase">
                🚫 Sancionado · {playerProfile.suspendedMatches} PJ
              </span>
            )}
            {playerProfile.suspendedMatches === 0 && playerProfile.yellowCards > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-3xs font-black uppercase">
                🟨 x{playerProfile.yellowCards} en la temporada
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:flex items-center gap-4 text-xs font-mono w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <Zap size={14} className="text-amber-500" />
              <div>
                <div className="flex justify-between items-center text-3xs text-slate-500 font-bold uppercase leading-none min-w-[70px]">
                  <span>Energía</span>
                  <span className="text-white">{playerProfile.energy}/100</span>
                </div>
                <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${playerProfile.energy}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <DollarSign size={14} className="text-emerald-400 font-bold" />
              <div>
                <span className="text-3xs text-slate-500 block leading-none font-bold uppercase">Capital</span>
                <span className="text-xs text-white font-black">${playerProfile.capital.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
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

            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
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

            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
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

        <div className="p-4 md:p-8 flex-1">
          
          {activeTab === 'carrera' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-3 gap-6">
                
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Award size={15} className="text-emerald-400" /> Atributos del Jugador
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(playerProfile.attributes).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-2xs text-slate-300 font-mono uppercase font-bold">
                          <span>{key}</span>
                          <span className="text-emerald-400 font-black">{val}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-1 border border-slate-800">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full"
                            style={{ width: `${(val / 99) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-3xs font-mono text-slate-500 uppercase leading-relaxed text-center">
                    Entrena de forma exigente en el complejo deportivo para potenciar tus capacidades.
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      🏆 Estadísticas Históricas de Carrera
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Goles Marcados</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">
                          {playerProfile.careerStats.golesHistoricos}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Asistencias</span>
                        <span className="text-2xl font-black text-yellow-500 font-mono block mt-1">
                          {playerProfile.careerStats.asistenciasHistoricos}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center col-span-2">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Partidos Totales</span>
                        <span className="text-base font-black text-white font-mono block mt-1">
                          {playerProfile.careerStats.partidosHistoricos} encuentros oficiales
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl mt-4">
                    <span className="text-[10px] text-amber-500 uppercase font-mono font-bold block mb-0.5">Valor de Mercado de la Ficha</span>
                    <span className="font-extrabold text-sm text-slate-200">
                      ${playerProfile.marketValue.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div>
                    <div className="inline-flex py-1 px-2.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider mb-4 animate-pulse">
                      ¡PRÓXIMA JORNADA DISPONIBLE!
                    </div>
                    <h3 className="text-lg font-black text-white leading-tight uppercase">
                      COMPETICIÓN OFICIAL
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Salta al campo de juego con el resto de la plantilla titular. Una buena actuación incrementará tu reputación frente a los ojeadores internacionales.
                    </p>
                  </div>

                  <div className="space-y-4 pt-6">
                    {nextMatchOpponent ? (
                      <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
                        {nextMatchOpponent.club ? (
                          <ClubBadge club={nextMatchOpponent.club} size={40} className="rounded-xl border border-slate-800 bg-slate-900" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0">⚽</div>
                        )}
                        <div className="min-w-0">
                          <span className="text-3xs text-slate-500 uppercase font-mono block truncate">
                            Próximo Rival ({nextMatchOpponent.isHome ? 'Local' : 'Visitante'}) · {nextMatchOpponent.competition}
                          </span>
                          <span className="text-white font-bold text-sm truncate block">vs {nextMatchOpponent.name}</span>
                        </div>
                      </div>
                    ) : nextWeekInWorldCupBreak && (
                      <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                          🌎
                        </div>
                        <div className="min-w-0">
                          <span className="text-3xs text-slate-500 uppercase font-mono block truncate">Fecha FIFA</span>
                          <span className="text-white font-bold text-sm truncate block">Sin partido de clubes esta semana</span>
                        </div>
                      </div>
                    )}
                    <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-3xs text-slate-500 uppercase font-mono">Ficha Semanal</span>
                        <span className="text-white block font-bold">${currentClub.initialSalary}/sem</span>
                      </div>
                      <div className="text-right">
                        <span className="text-3xs text-slate-500 uppercase font-mono">Nivel de Reto</span>
                        <span className="text-emerald-400 block font-bold">Profesional</span>
                      </div>
                    </div>

                    <button
                      onClick={onAdvanceWeek}
                      className="btn-fx w-full py-4 px-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl cursor-pointer"
                    >
                      Disputar Partido <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

              </div>

              {playerProfile.age >= 32 && (
                <div className="bg-slate-900 border border-amber-900/40 rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-2">
                    🎖️ Fase Veterana de la Carrera
                  </h3>
                  <p className="text-2xs text-slate-400 leading-relaxed mb-4">
                    A los {playerProfile.age} años el cuerpo ya no responde igual que a los 18: tu ritmo y físico
                    empiezan a bajar de a poco cada temporada, aunque entrenes. Si sentís que tu posición actual
                    ya no rinde, todavía podés reconvertirte una vez más antes de colgar los botines.
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
                          className="btn-fx-subtle py-2 px-4 rounded-xl bg-slate-950 border border-slate-800 text-2xs font-bold text-slate-300 hover:border-amber-500/50 hover:text-amber-400 transition-all cursor-pointer"
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
                  Invierte tu estamina semanal para perfeccionar tus habilidades técnicas. Cada sesión requiere <span className="text-amber-500 font-bold">-20 Energía</span> y sumará permanentemente <span className="text-emerald-400 font-bold">+3 puntos</span> al atributo seleccionado.
                </p>
              </div>

              {playerProfile.energy < 20 ? (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldAlert size={18} /> Tu estado físico es de fatiga crítica. Entrena en la Clínica o descansa.
                </div>
              ) : null}

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: 'ritmo', label: 'Velocidad / Ritmo', icon: '⚡', desc: 'Mejora la aceleración explosiva y los desmarques por las bandas.' },
                  { key: 'regate', label: 'Dribbling / Regate', icon: '🪄', desc: 'Aumenta el control de balón en conducción y el mano a mano.' },
                  { key: 'tiro', label: 'Definición / Tiro', icon: '🎯', desc: 'Sube la contundencia y potencia de cara al arco rival.' },
                  { key: 'defensa', label: 'Robo / Defensa', icon: '🧱', desc: 'Optimiza la capacidad de anticipación e intercepción táctica.' },
                  { key: 'pase', label: 'Visión / Pase', icon: '🧬', desc: 'Clave para habilitaciones precisas entre líneas y asistencias.' },
                  { key: 'fisico', label: 'Potencia / Físico', icon: '🦾', desc: 'Incrementa la resistencia en disputas aéreas y choques hombro con hombro.' }
                ].map(item => (
                  <div key={item.key} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-3xs font-mono font-black uppercase bg-slate-950 px-2 py-0.5 rounded text-amber-500 border border-slate-800">
                          {playerProfile.attributes[item.key as keyof PlayerStats]}/99
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{item.label}</h4>
                      <p className="text-3xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => onTrainAttribute(item.key as keyof PlayerStats)}
                      disabled={playerProfile.energy < 20}
                      className={`btn-fx-subtle w-full mt-4 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        playerProfile.energy >= 20
                          ? 'bg-slate-950 text-white hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-600 hover:text-slate-950 border border-slate-800 hover:border-emerald-400 cursor-pointer'
                          : 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-900'
                      }`}
                    >
                      Ejercitar (-20 E)
                    </button>
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
                      <p className="text-3xs text-emerald-400 font-mono">+25 Energía al Instante</p>
                    </div>
                    <button
                      onClick={() => onRecoverEnergy(1500, 25)}
                      disabled={playerProfile.capital < 1500 || playerProfile.energy >= 100}
                      className="btn-fx-subtle py-2 px-4 rounded-xl bg-slate-800 text-white font-bold text-3xs uppercase tracking-wider hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-600 hover:text-slate-950 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -$1,500
                    </button>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Cámara Hiperbárica</span>
                      </div>
                      <p className="text-3xs text-emerald-400 font-mono">+60 Energía al Instante</p>
                    </div>
                    <button
                      onClick={() => onRecoverEnergy(3500, 60)}
                      disabled={playerProfile.capital < 3500 || playerProfile.energy >= 100}
                      className="btn-fx-subtle py-2 px-4 rounded-xl bg-slate-800 text-white font-bold text-3xs uppercase tracking-wider hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-600 hover:text-slate-950 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <Send size={15} className="text-emerald-400" /> Red de Opinión Pública - Prensa y Afición
                  </h3>

                  <div className="space-y-4">
                    {generateSocialFeed().map(post => (
                      <div key={post.id} className="p-4 bg-slate-955/40 border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                              {post.avatar}
                            </span>
                            <div>
                              <h4 className="font-bold text-xs text-white leading-none">{post.author}</h4>
                              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
                                {post.role}
                              </span>
                            </div>
                          </div>
                          <span className="text-3xs text-slate-500 font-mono">{post.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-3xs text-slate-500 font-mono pt-2 border-t border-slate-950">
                          <span>❤️ {post.likes} Me gusta</span>
                          <span>💬 {post.commentsCount} Hilos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
                        className="btn-fx-subtle w-full mt-3 py-1.5 px-3 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
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
                        onClick={() => onLaunchPRCampaign(3000, 15, 6)}
                        disabled={playerProfile.capital < 3000}
                        className="btn-fx-subtle w-full mt-3 py-1.5 px-3 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                      >
                        Financiar Evento
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Campaña de Patrocinio</span>
                        <span className="text-emerald-400 font-mono">+$4,000 Corp</span>
                      </div>
                      <p className="text-3xs text-slate-400">Recibes capital inmediato, pero genera ligeras críticas por saturación publicitaria.</p>
                      <button
                        onClick={() => onLaunchPRCampaign(-4000, 5, -8)}
                        className="btn-fx-subtle w-full mt-3 py-1.5 px-3 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
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
                <div className={`bg-slate-900 border rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4 ${PRESS_QUESTIONS_POOL[selectedPressQ].mediaColor}`}>
                  
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-3xs font-mono font-black uppercase tracking-wider">
                    <div className="flex items-center gap-2 min-w-0">
                      {PRESS_QUESTIONS_POOL[selectedPressQ].reporterAvatarImg ? (
                        <img
                          src={PRESS_QUESTIONS_POOL[selectedPressQ].reporterAvatarImg}
                          alt={PRESS_QUESTIONS_POOL[selectedPressQ].reporter || PRESS_QUESTIONS_POOL[selectedPressQ].mediaName}
                          className="w-11 h-11 shrink-0 rounded-lg object-cover border border-black/40"
                        />
                      ) : (
                        <span className="text-sm bg-black/40 p-1 rounded-lg shrink-0">{PRESS_QUESTIONS_POOL[selectedPressQ].reporterAvatar}</span>
                      )}
                      <span className="truncate">{PRESS_QUESTIONS_POOL[selectedPressQ].mediaName} · por <strong>{PRESS_QUESTIONS_POOL[selectedPressQ].reporter}</strong></span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-black/30 max-w-full">{PRESS_QUESTIONS_POOL[selectedPressQ].context}</span>
                  </div>

                  <h3 className="text-base font-black text-white italic leading-relaxed pt-2">
                    "{PRESS_QUESTIONS_POOL[selectedPressQ].question}"
                  </h3>

                  <div className="space-y-2.5 pt-2">
                    {PRESS_QUESTIONS_POOL[selectedPressQ].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handlePressAnswer(opt)}
                        className="btn-fx-subtle w-full p-4 rounded-xl border border-slate-800 bg-slate-950 text-left text-xs text-slate-300 hover:border-emerald-500/40 hover:bg-slate-900 hover:text-white transition-all font-medium py-3.5 cursor-pointer"
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-emerald-500/20 rounded-3xl p-6 shadow-xl space-y-4 text-center">
                  <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
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

              {(() => {
                const windowOpen = isTransferWindowOpen(playerProfile.currentWeek);
                if (windowOpen) {
                  return (
                    <div className="px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <RefreshCw size={13} /> Ventana de fichajes ABIERTA — podés concretar traspasos esta semana.
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
                              offer.club.division === 2 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
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
                          <span className="text-emerald-400 font-bold block">${offer.salaryOffer.toLocaleString()} / sem</span>
                          <span className="text-amber-500 text-3xs block">Prima por Firma: +${offer.signOnBonus.toLocaleString()}</span>
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
                              className="btn-fx py-1.5 px-3.5 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black text-2xs uppercase tracking-wider cursor-pointer"
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
                          ? 'border-amber-500/40 bg-slate-900 shadow-lg shadow-amber-950/10'
                          : 'border-slate-800 bg-slate-950/40 hover:border-emerald-500/30'
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
                          <span className="absolute top-2 right-2 inline-flex gap-1 items-center px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono text-3xs font-black uppercase shadow">
                            Adquirido
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1 gap-2.5">
                        <p className="text-3xs text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                        <p className="text-3xs text-emerald-400 font-mono font-bold uppercase leading-relaxed">
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
                                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 hover:from-emerald-300 hover:to-emerald-500 cursor-pointer'
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

              <p className="text-3xs text-slate-600 font-mono pt-2 border-t border-slate-900">
                Fotos: Wikimedia Commons — San Francisco Foghorn (CC BY 2.0), crudmucosa (CC BY 2.0), EU2016 SK / Bill Branson / Carol M. Highsmith (dominio público / CC0).
              </p>
            </div>
          )}

          {activeTab === 'patrocinios' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Ofertas de Patrocinio
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Las marcas te contactan a vos, no al revés: cuanto más lejos llegue tu fama, más y mejores ofertas te van a llegar. Aceptar un patrocinio no cuesta nada — al contrario, te paga una prima de firma inmediata.
                </p>
              </div>

              {(() => {
                const activeSponsorships = sponsorDeals.filter(i => i.purchased).length;
                const capReached = activeSponsorships >= MAX_ACTIVE_SPONSORSHIPS;
                return (
                  <div className={`px-4 py-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${capReached ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                    <DollarSign size={13} /> Patrocinios activos: {activeSponsorships}/{MAX_ACTIVE_SPONSORSHIPS}
                    {capReached ? ' — agenda comercial completa, esperá a liberar un cupo.' : ''}
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
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start gap-4 ${
                        item.purchased
                          ? 'border-amber-500/40 bg-slate-900 shadow shadow-amber-950/10'
                          : 'border-slate-800 bg-slate-950/40'
                      }`}
                    >
                      <div className="space-y-2 sm:max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🤝</span>
                          <h4 className="font-extrabold text-xs text-white">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-3xs text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                        <p className="text-3xs text-emerald-400 font-mono font-bold uppercase leading-relaxed">
                          ✨ Ventaja: {item.perkText}
                        </p>
                      </div>

                      <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto sm:text-right sm:h-full sm:min-h-[90px] gap-3">
                        <div className="text-right font-mono">
                          <span className="text-3xs text-slate-500 block uppercase">Prima de Firma</span>
                          <span className="text-xs font-black text-emerald-400 block">+${item.cost.toLocaleString()}</span>
                        </div>

                        <div className="sm:mt-4 flex flex-col items-end gap-1.5">
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
                              className="btn-fx-subtle py-1.5 px-3 rounded-lg text-3xs font-black uppercase tracking-wider bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 hover:from-emerald-300 hover:to-emerald-500 cursor-pointer"
                            >
                              Aceptar Patrocinio
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

          {activeTab === 'tablas' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Panel de Competiciones Oficiales
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Monitorea las fases de la prestigiosa Copa Libertadores de América 2026 y la situación clasificatoria actual.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Table size={13} /> TABLA DE POSICIONES · {currentClub.league.toUpperCase()} {currentClub.division && currentClub.division > 1 ? `(DIV. ${currentClub.division})` : ''}
                </h3>

                {myLeagueTable.length > 0 ? (
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
                        {myLeagueTable.map((row, idx) => (
                          <tr
                            key={row.clubId || row.name}
                            className={`border-b border-slate-900/40 ${row.clubId === currentClub.id ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
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
                {conmebolCup ? (
                  <>
                    <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 border-b border-slate-800 pb-2 flex items-center gap-2">
                      🏆 {conmebolCup.cupId === 'libertadores' ? 'COPA LIBERTADORES' : 'COPA SUDAMERICANA'} {conmebolCup.year} · {cupStageLabel(conmebolCup.stage)}
                    </h3>
                    {conmebolCup.stage === 'groups' ? (
                      <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
                        {conmebolCup.groups.map(group => (
                          <div key={group.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl">
                            <h4 className="font-extrabold text-white border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between text-2xs uppercase">
                              <span>Grupo {group.id}</span>
                              <span className="text-amber-500">🏆</span>
                            </h4>
                            <ul className="space-y-1.5 text-slate-300 font-mono text-3xs">
                              {sortTable(group.table).map((row, idx) => (
                                <li key={row.clubId || row.name} className="flex justify-between border-b border-slate-900/40 pb-0.5">
                                  <span className={row.clubId === currentClub.id ? 'text-emerald-400 font-bold' : ''}>
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
                    <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 border-b border-slate-800 pb-2 flex items-center gap-2">
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
                              <tr key={row.clubId || row.name} className={`border-b border-slate-900/40 ${row.clubId === currentClub.id ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
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
                  Tus próximos rivales, en el orden real en que ya están fijados. Este fixture no se regenera ni cambia: se respeta tal cual hasta el final de la competición.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Calendar size={13} /> LIGA · {currentClub.league.toUpperCase()}
                </h3>
                {upcomingLeagueFixtures.length > 0 ? (
                  <ul className="space-y-2">
                    {upcomingLeagueFixtures.map((fx, i) => (
                      <li key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs">
                        <span className="text-3xs font-mono text-slate-500 uppercase shrink-0">Fecha {fx.matchweek}</span>
                        <span className="font-bold text-white truncate px-2">
                          {fx.isHome ? 'vs.' : '@'} {fx.opponentName}
                        </span>
                        <span className={`text-3xs font-mono uppercase shrink-0 ${fx.isHome ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {fx.isHome ? 'Local' : 'Visitante'}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-2xs text-slate-500">No hay más fechas de liga programadas por ahora.</p>
                )}
              </div>

              {(conmebolCup || uefaCup) && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <Calendar size={13} /> {conmebolCup ? (conmebolCup.cupId === 'libertadores' ? 'COPA LIBERTADORES' : 'COPA SUDAMERICANA') : (uefaCup!.cupId === 'champions' ? 'UEFA CHAMPIONS LEAGUE' : 'UEFA EUROPA LEAGUE')}
                  </h3>
                  {upcomingCupFixtures.length > 0 ? (
                    <ul className="space-y-2">
                      {upcomingCupFixtures.map((fx, i) => (
                        <li key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs">
                          <span className="text-3xs font-mono text-slate-500 uppercase shrink-0">Fecha {fx.matchweek}</span>
                          <span className="font-bold text-white truncate px-2">
                            {fx.isHome ? 'vs.' : '@'} {fx.opponentName}
                          </span>
                          <span className={`text-3xs font-mono uppercase shrink-0 ${fx.isHome ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {fx.isHome ? 'Local' : 'Visitante'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : upcomingCupKnockoutOpponent ? (
                    <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs">
                      <span className="text-3xs font-mono text-amber-500 uppercase shrink-0">Próximo cruce</span>
                      <span className="font-bold text-white truncate px-2">
                        {upcomingCupKnockoutOpponent.isHome ? 'vs.' : '@'} {upcomingCupKnockoutOpponent.opponentName}
                      </span>
                      <span className={`text-3xs font-mono uppercase shrink-0 ${upcomingCupKnockoutOpponent.isHome ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {upcomingCupKnockoutOpponent.isHome ? 'Local' : 'Visitante'}
                      </span>
                    </div>
                  ) : (
                    <p className="text-2xs text-slate-500">Sin más partidos de copa programados por ahora.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mi_club' && (() => {
            // Corregido: ya no dependemos de soccerDatabase (solo 3 clubes de prueba).
            // Buscamos la plantilla real del club actual dentro de los 32,000 jugadores del JSON.
            const rosterClub = getClubWithRoster(currentClub.name);
            const plantilla = rosterClub?.plantilla || { porteros: [], defensivos: [], ofensivos: [] };
            const totalJugadoresReales = plantilla.porteros.length + plantilla.defensivos.length + plantilla.ofensivos.length;

            return (
              <div className="space-y-6 animate-fade-in max-w-5xl">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <ClubBadge club={currentClub} size={56} className="rounded-xl border border-slate-800 bg-slate-950 shadow-inner" />
                    <div>
                      <span className="text-3xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                        Ecosistema de Datos LTA Mod · {currentClub.league}
                      </span>
                      <h2 className="text-2xl font-black text-white mt-1">{currentClub.name}</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        🏆 <strong>Reputación:</strong> {'★'.repeat(currentClub.reputation)} · 💰 <strong>Valor de Plantilla:</strong> ${currentClub.marketValue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 min-w-[240px]">
                    <span className="text-[10px] text-amber-500 uppercase font-mono font-black block mb-1">Director Técnico Oficial</span>
                    <h4 className="font-bold text-sm text-white">{currentClub.dt}</h4>
                    <div className="text-3xs text-slate-400 font-mono mt-1 space-y-0.5">
                      <p>🏟️ Liga: {currentClub.league}</p>
                      <p>💵 Salario Semanal Base: ${currentClub.initialSalary.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {totalJugadoresReales === 0 && (
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-2xs text-amber-300 leading-relaxed">
                    ⚠️ Este club todavía no tiene jugadores reales cargados en el JSON de la base de datos LTA (el nombre <strong>"{currentClub.name}"</strong> no tiene coincidencias en <code>playersDatabase.json</code>). Revisa el Excel de origen para este equipo.
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 flex justify-between items-center">
                      <span>🧤 Porteros (GK)</span>
                      <span className="text-3xs font-mono text-emerald-400 font-normal">{plantilla.porteros.length}</span>
                    </h3>
                    <div className="space-y-2">
                      {plantilla.porteros.length > 0 ? plantilla.porteros.map(player => (
                        <div key={player.player_id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-xs text-white">{player.nombre_completo}</h4>
                            <span className="text-3xs text-slate-500 font-mono uppercase">{player.posicion_especifica} · €{player.valor_mercado_eur?.toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">{player.media_valoracion}</span>
                        </div>
                      )) : (
                        <p className="text-3xs text-slate-500 italic px-1">Sin datos disponibles.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 flex justify-between items-center">
                      <span>🧱 Defensivos (DF)</span>
                      <span className="text-3xs font-mono text-emerald-400 font-normal">{plantilla.defensivos.length}</span>
                    </h3>
                    <div className="space-y-2">
                      {plantilla.defensivos.length > 0 ? plantilla.defensivos.map(player => (
                        <div key={player.player_id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-xs text-white">{player.nombre_completo}</h4>
                            <span className="text-3xs text-slate-500 font-mono uppercase">{player.posicion_especifica} · €{player.valor_mercado_eur?.toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">{player.media_valoracion}</span>
                        </div>
                      )) : (
                        <p className="text-3xs text-slate-500 italic px-1">Sin datos disponibles.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 flex justify-between items-center">
                      <span>🎯 Ofensivos (OF)</span>
                      <span className="text-3xs font-mono text-emerald-400 font-normal">{plantilla.ofensivos.length}</span>
                    </h3>
                    <div className="space-y-2">
                      {plantilla.ofensivos.length > 0 ? plantilla.ofensivos.map(player => (
                        <div key={player.player_id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-xs text-white">{player.nombre_completo}</h4>
                            <span className="text-3xs text-slate-500 font-mono uppercase">{player.posicion_especifica} · €{player.valor_mercado_eur?.toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">{player.media_valoracion}</span>
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