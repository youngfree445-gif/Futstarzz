import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, MatchEvent, MatchDecision, Position, Club } from '../types';
import { Play, FastForward, Check, Skull, Target, Award, Sparkles, Trophy } from 'lucide-react';
import { ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE, OPPONENT_CLUBS_POOL, WORLD_CUP_TEAMS_DATABASE } from '../data';

interface MatchSimulatorProps {
  playerProfile: PlayerProfile;
  opponentName: string;
  isLibertadores: boolean;
  isWorldCup?: boolean;
  representingTeamId?: string | null; // si estás convocado a tu selección, el id del equipo del Mundial en vez de tu club
  isHome: boolean;
  myTablePosition?: number | null; // posición en la tabla de liga (1 = puntero); null si no aplica (copas/Mundial)
  rivalTablePosition?: number | null;
  leagueTeamCount?: number | null;
  onFinishMatch: (results: {
    goles: number;
    asistencias: number;
    resultado: 'W' | 'D' | 'L';
    golesRival: number;
    golesMiEquipo: number;
    puntosExperiencia: number;
    salaryEarned: number;
    rating: number; 
    log: string[];
  }) => void;
}

export default function MatchSimulator({
  playerProfile, opponentName, isLibertadores, isWorldCup, representingTeamId, isHome: isHomeProp,
  myTablePosition, rivalTablePosition, leagueTeamCount, onFinishMatch
}: MatchSimulatorProps) {
  const [minute, setMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(450);

  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);
  const isHome = useRef(isHomeProp);

  const [playerGoals, setPlayerGoals] = useState(0);
  const [playerAssists, setPlayerAssists] = useState(0);
  const [playerCards, setPlayerCards] = useState<'none' | 'yellow' | 'red'>('none');
  const [rating, setRating] = useState(6.0);

  const [matchLog, setMatchLog] = useState<MatchEvent[]>([]);
  const [activeDecision, setActiveDecision] = useState<MatchDecision | null>(null);
  const [decisionStage, setDecisionStage] = useState<'none' | 'choosing' | 'result'>('none');
  const [decisionOutcomeText, setDecisionOutcomeText] = useState('');

  const currentClub = representingTeamId
    ? WORLD_CUP_TEAMS_DATABASE.find(c => c.id === representingTeamId)!
    : CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;

  // Multiplicador de dificultad combinado: fuerza del rival en la tabla (un rival mejor ubicado
  // achica tu ventana de éxito, uno peor ubicado la agranda; sin tabla comparable en copas/Mundial
  // queda neutro) + apoyo de la hinchada (fans muy bajo = "te pitan", fans muy alto = te empuja)
  // + salud mental (Fase 3: cabeza floja te cuesta concentración, cabeza fuerte te da un empujón).
  const tablePositionFactor = (() => {
    if (myTablePosition == null || rivalTablePosition == null) return 1;
    const positionDiff = myTablePosition - rivalTablePosition; // positivo = rival mejor ubicado que vos
    return Math.max(0.8, Math.min(1.2, 1 - positionDiff * 0.01));
  })();
  const fanSupportFactor = playerProfile.fans < 20 ? 0.9 : playerProfile.fans > 80 ? 1.05 : 1;
  const mentalHealthFactor = playerProfile.mentalHealth < 35 ? 0.88 : playerProfile.mentalHealth > 85 ? 1.08 : 1;
  const pressureMultiplier = Math.max(0.65, Math.min(1.35, tablePositionFactor * fanSupportFactor * mentalHealthFactor));
  const teamName = currentClub.name;

  const getTeammateSample = () => {
    const list = currentClub.starPlayers.filter(p => p !== playerProfile.name);
    return list.length > 0 ? list[Math.floor(Math.random() * list.length)] : 'El volante de apoyo';
  };

  useEffect(() => {
    const estadioContexto = isHome.current ? `el estadio del ${teamName}` : `el fortín de ${opponentName}`;
    const competicionContexto = isWorldCup ? '🌎 COPA MUNDIAL FIFA 2026 🌎' : isLibertadores ? '🏆 COPA LIBERTADORES 2026 (Fase de Grupos) 🏆' : '🟢 LIGA DOMÉSTICA 2026 🟢';
    
    setMatchLog([
      { minute: 0, text: `Silbatazo Inicial en ${estadioContexto}. ¡Rueda la pelota! ${competicionContexto}`, type: 'neutral' },
      { minute: 4, text: `Ambiente ensordecedor en las tribunas. El recibimiento llena el aire de color.`, type: 'neutral' }
    ]);
  }, []);

  useEffect(() => {
    if (!isPlaying || minute >= 90 || activeDecision !== null) return;

    const timer = setTimeout(() => {
      const nextMin = minute + 1;
      setMinute(nextMin);
      triggerRandomMatchEvent(nextMin);
    }, speedMultiplier);

    return () => clearTimeout(timer);
  }, [isPlaying, minute, activeDecision, speedMultiplier]);

  const triggerRandomMatchEvent = (currentMin: number) => {
    if (currentMin === 90) {
      const finalResult: 'W' | 'D' | 'L' = 
        (isHome.current && scoreHome > scoreAway) || (!isHome.current && scoreAway > scoreHome) ? 'W' :
        scoreHome === scoreAway ? 'D' : 'L';
      
      const golesMiEquipo = isHome.current ? scoreHome : scoreAway;
      const golesRival = isHome.current ? scoreAway : scoreHome;

      setTimeout(() => {
        onFinishMatch({
          goles: playerGoals,
          asistencias: playerAssists,
          resultado: finalResult,
          golesRival,
          golesMiEquipo,
          puntosExperiencia: Math.round(rating * 15) + (playerGoals * 40) + (playerAssists * 25),
          salaryEarned: currentClub.initialSalary,
          rating: Number(rating.toFixed(1)),
          log: matchLog.map(item => `[${item.minute}'] ${item.text}`)
        });
      }, 1500);

      setMatchLog(prev => [...prev, {
        minute: 90,
        text: `¡FINAL DEL ENCUENTRO! Marcador definitivo: ${teamName} ${isHome.current ? scoreHome : scoreAway} - ${golesRival} ${opponentName}.`,
        type: 'neutral'
      }]);
      setIsPlaying(false);
      return;
    }

    if (currentMin === 24) {
      triggerDecisionEvent(24);
      return;
    }
    if (currentMin === 71) {
      triggerDecisionEvent(71);
      return;
    }

    const dado = Math.random();

    if (dado < 0.032) { // PROBABILIDAD REALISTA DE GOLES (0-0, 1-0, 2-1)
      const teamScores = Math.random() > 0.48; 
      const teammateName = getTeammateSample();

      if (teamScores) {
        if (isHome.current) setScoreHome(prev => prev + 1); else setScoreAway(prev => prev + 1);
        setMatchLog(prev => [...prev, {
          minute: currentMin,
          text: `¡GOL de ${teamName}! Combinación magistral en el área que finaliza ${teammateName} con un remate cruzado.`,
          type: 'good'
        }]);
        setRating(prev => Math.min(prev + 0.3, 10.0));
      } else {
        if (isHome.current) setScoreAway(prev => prev + 1); else setScoreHome(prev => prev + 1);
        setMatchLog(prev => [...prev, {
          minute: currentMin,
          text: `¡GOL de ${opponentName}! Desatención defensiva que el rival no perdona. Balón al fondo de la red.`,
          type: 'bad'
        }]);
        setRating(prev => Math.max(prev - 0.2, 3.5));
      }
    } else if (dado < 0.18) {
      // VARIEDAD DE NARRATIVAS PARA MÁS INMERSIÓN
      const mate = getTeammateSample();
      const jugadasDestacadas = [
        `Te desmarcas por la banda y recibes de ${mate}, intentas centrar pero el balón rebota. Córner.`,
        `Presionas la salida del central, forzando un error de despeje. La tribuna aplaude tu entrega.`,
        `Fuerte choque en el medio campo. El árbitro deja seguir la jugada aplicando la ley de la ventaja.`,
        `¡UFFF! Remate de ${mate} que pasa rozando el poste derecho. Casi se abre el marcador.`,
        `El equipo rival domina la posesión tocando de lado a lado, el partido entra en un bache táctico.`,
        `Recibes una falta táctica dura en tres cuartos de cancha para cortar tu avance. Tiro libre peligroso.`,
        `¡Atajadón de nuestro portero! Voló para sacar un cabezazo rival que tenía sello de gol.`,
        `El técnico manda a calentar a los suplentes. Se siente la tensión en los banquillos.`,
        `Tocas rápido y de primera intención para oxigenar el juego. Buen movimiento de tu parte.`,
        `¡Posición adelantada! Te habías escapado solo contra el portero pero el juez de línea levantó la bandera.`
      ];
      setMatchLog(prev => [...prev, {
        minute: currentMin,
        text: jugadasDestacadas[Math.floor(Math.random() * jugadasDestacadas.length)],
        type: 'highlight'
      }]);
      setRating(prev => Math.min(prev + 0.1, 10.0));
    }
  };

  const getPositionDecision = (pos: Position, min: number): MatchDecision => {
    switch (pos) {
      case 'Delantero':
        return min < 50 ? {
          prompt: "Recibes un pase filtrado al borde del área grande, el central rival te presiona fuertemente la espalda...",
          choices: [
            {
              text: 'Girar con velocidad y rematar de volea al ángulo',
              requiredAttr: 'tiro',
              minVal: 55,
              successChance: 0.5,
              successBonus: '¡GOLAZO! Giraste con una fluidez brutal y la clavaste al ángulo opuesto del palo.',
              failPenalty: 'El disparo chocó en las piernas del central y salieron de contragolpe.',
              effectOnSuccess: { goals: 1, assists: 0, prestige: 8, fans: 12 },
              effectOnFail: { prestige: -2, fans: -1, energy: 0 }
            },
            {
              text: 'Aguantar de espaldas y pivotear el balón hacia el extremo',
              requiredAttr: 'pase',
              minVal: 45,
              successChance: 0.75,
              successBonus: '¡CON RETORNO! Diste un pase seguro exquisito y tu equipo conserva la posesión con ventaja.',
              failPenalty: 'Diste un pase débil directo al mediocentro defensivo rival.',
              effectOnSuccess: { goals: 0, assists: 1, prestige: 6, fans: 5 },
              effectOnFail: { prestige: -3, fans: -2, energy: 5 }
            },
            {
              text: 'Engañarlos con un elegante autopase de taco por aire',
              requiredAttr: 'regate',
              minVal: 53,
              successChance: 0.45,
              successBonus: '¡PRESTIGIO TOTAL! El sombrerito funcionó, asistes a tu compañero que empuja el balón. ¡ASISTENCIA!',
              failPenalty: 'Te quitaron el balón con facilidad y quedaste tendido pidiendo una falta inexistente.',
              effectOnSuccess: { goals: 0, assists: 1, prestige: 10, fans: 15 },
              effectOnFail: { prestige: -5, fans: -5, energy: 5 }
            }
          ]
        } : {
          prompt: "¡Quedas completamente mano a mano frente al portero tras un pase bombeado letal! Te sale a achicar...",
          choices: [
            {
              text: 'Definir picando el balón de vaselina suave',
              requiredAttr: 'regate',
              minVal: 58,
              successChance: 0.45,
              successBonus: '¡PURA CLASE! Bañaste al portero de forma deliciosa. La pelota ingresa perezosa a la red. ¡GOL!',
              failPenalty: 'El portero adivinó la vaselina y atrapó el esférico con ambas manos sin despeinarse.',
              effectOnSuccess: { goals: 1, assists: 0, prestige: 12, fans: 18 },
              effectOnFail: { prestige: -4, fans: -3, energy: 0 }
            },
            {
              text: 'Romper el arco fusilando con potencia al primer poste',
              requiredAttr: 'tiro',
              minVal: 60,
              successChance: 0.65,
              successBonus: '¡FUEGO EN LOS GUANTES! El trallazo superó la resistencia del arquero por pura potencia. ¡GOL!',
              failPenalty: 'El disparo salió desviado por el lateral exterior de la red. Balón de saque de meta.',
              effectOnSuccess: { goals: 1, assists: 0, prestige: 8, fans: 10 },
              effectOnFail: { prestige: -1, fans: -1, energy: 10 }
            },
            {
              text: 'Pasar el balón al costado al compañero solo frente al arco vacío',
              requiredAttr: 'pase',
              minVal: 48,
              successChance: 0.85,
              successBonus: '¡COMPAÑERISMO! Dejaste el ego atrás, asistes a tu par que define con el arco vacío. ¡ASISTENCIA!',
              failPenalty: 'Diste el pase demasiado largo y tu compañero no alcanzó a conectar barriéndose.',
              effectOnSuccess: { goals: 0, assists: 1, prestige: 10, fans: 4 },
              effectOnFail: { prestige: -6, fans: -2, energy: 0 }
            }
          ]
        };
      
      case 'Mediocampista':
        return min < 50 ? {
          prompt: "Recuperas un rebote en el círculo central y el rival deja desprotegida la banda con el extremo pidiendo pase libre...",
          choices: [
            {
              text: 'Lanzar un pase filtrado de tres dedos por el callejón central',
              requiredAttr: 'pase',
              minVal: 55,
              successChance: 0.7,
              successBonus: '¡PINCELADA! Pase con una precisión digna de cirujano. El extremo desborda y la mete al arco. ¡ASISTENCIA!',
              failPenalty: 'El pase quedó corto y fue cortado en la medular por el pivote contrario.',
              effectOnSuccess: { goals: 0, assists: 1, prestige: 8, fans: 8 },
              effectOnFail: { prestige: -3, fans: -1, energy: 0 }
            },
            {
              text: 'Arrastrar la marca tú mismo regateando por el centro',
              requiredAttr: 'regate',
              minVal: 55,
              successChance: 0.55,
              successBonus: '¡PURA MAGIA! Dejaste atrás a dos rivales pegados y asistes en zona caliente para gol de tu club. ¡ASISTENCIA!',
              failPenalty: 'Te barrieron fuerte pero lícitamente y perdiste la posesión ofensiva.',
              effectOnSuccess: { goals: 0, assists: 1, prestige: 10, fans: 12 },
              effectOnFail: { prestige: -4, fans: -3, energy: 5 }
            },
            {
              text: 'Aprovechar el espacio libre y disparar de media distancia de primera',
              requiredAttr: 'tiro',
              minVal: 58,
              successChance: 0.45,
              successBonus: '¡MISIL TIERRA-AIRE! Sorprendiste a todo el estadio metiéndola abajo en el palo derecho. ¡GOLAZO!',
              failPenalty: 'El remate salió muy desviado hacia las gradas del estadio.',
              effectOnSuccess: { goals: 1, assists: 0, prestige: 12, fans: 15 },
              effectOnFail: { prestige: -1, fans: 0, energy: 5 }
            }
          ]
        } : {
          prompt: "El rival ataca con superioridad numérica por el centro. Debes tomar control defensivo rápido o arriesgar...",
          choices: [
            {
              text: 'Arrojarse en una barrida temeraria pero directa para recuperar',
              requiredAttr: 'defensa',
              minVal: 48,
              successChance: 0.60,
              successBonus: '¡CORTE DE HIERRO! Robaste limpiamente e iniciaste rápidamente la contra para tu equipo.',
              failPenalty: '¡Llegaste tarde! Te pintaron de amarillo y regalaste un tiro libre peligroso.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 10, fans: 12 },
              effectOnFail: { prestige: -6, fans: -5, energy: 10 }
            },
            {
              text: 'Presionar al portador usando tu físico para asfixiar su pase',
              requiredAttr: 'fisico',
              minVal: 50,
              successChance: 0.75,
              successBonus: '¡PULMONES DE ACERO! Forzaste el error de pase del rival enviando el esférico al lateral.',
              failPenalty: 'Te pasaron con un regate simple aprovechando tu fatiga física actual.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 6, fans: 4 },
              effectOnFail: { prestige: -2, fans: -2, energy: 15 }
            },
            {
              text: 'Marcar pasivamente tapando el pase hacia el delantero estrella',
              requiredAttr: 'pase', 
              minVal: 52,
              successChance: 0.80,
              successBonus: '¡LECTURA TÁCTICA! Cortas la línea de habilitación salvando una jugada crucial.',
              failPenalty: 'Te filtraron el balón por medio de las piernas desestabilizándote por completo.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 8, fans: 3 },
              effectOnFail: { prestige: -3, fans: -1, energy: 0 }
            }
          ]
        };

      case 'Defensor':
        return min < 50 ? {
          prompt: "El veloz extremo rival te encara directamente por la banda, amaga hacia el centro con un paso elástico...",
          choices: [
            {
              text: 'Interponer el cuerpo usando tu peso de forma física',
              requiredAttr: 'fisico',
              minVal: 55,
              successChance: 0.70,
              successBonus: '¡MURO IMPENETRABLE! Lo desplazaste legalmente y saliste jugando con solvencia de crack.',
              failPenalty: 'Te ganaron la espalda por la inercia y tiraron un centro con peligro extremo.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 8, fans: 6 },
              effectOnFail: { prestige: -4, fans: -4, energy: 8 }
            },
            {
              text: 'Realizar un cierre defensivo limpio estirando la pierna con timing',
              requiredAttr: 'defensa',
              minVal: 58,
              successChance: 0.80,
              successBonus: '¡ELEGANCIA DE DEFENSOR! Quitaste con guante blanco. Limpieza absoluta.',
              failPenalty: 'Te regatearon dejándote en el camino y el público local celebra la finta.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 10, fans: 10 },
              effectOnFail: { prestige: -6, fans: -8, energy: 0 }
            },
            {
              text: 'Meter presión explosiva para obligarlo a girar e ir hacia atrás',
              requiredAttr: 'ritmo',
              minVal: 54,
              successChance: 0.65,
              successBonus: '¡VELOCIDAD PURA! Le diste caza, forzando la pérdida y enviando el balón fuera del campo.',
              failPenalty: 'Te dejó descolocado por completo con un cambio de ritmo letal.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 6, fans: 4 },
              effectOnFail: { prestige: -2, fans: -2, energy: 10 }
            }
          ]
        } : {
          prompt: "Tiro de esquina decisivo en contra en los minutos agónicos. El potente 9 contrario busca el anticipo...",
          choices: [
            {
              text: 'Ganarle el testazo aéreo saltando con potencia física',
              requiredAttr: 'fisico',
              minVal: 58,
              successChance: 0.65,
              successBonus: '¡POR EL CIELO! Volaste por encima de su marca y cabeceaste fuerte fuera del área.',
              failPenalty: 'Te ganó el choque físico; su frentazo pegó en el poste salvándonos del gol por milímetros.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 10, fans: 10 },
              effectOnFail: { prestige: -5, fans: -5, energy: 15 }
            },
            {
              text: 'Cerrar la trayectoria del balón con un despeje acrobático',
              requiredAttr: 'defensa',
              minVal: 60,
              successChance: 0.55,
              successBonus: '¡EXPULSIÓN DE PELOTA! Despejaste de forma espectacular robándote los aplausos.',
              failPenalty: 'Pifiaste el esférico dándole un córner nuevo al rival totalmente gratis.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 12, fans: 15 },
              effectOnFail: { prestige: -3, fans: -3, energy: 5 }
            },
            {
              text: 'Bloquear el centro del área e iniciar un pase rápido de salida',
              requiredAttr: 'pase',
              minVal: 48,
              successChance: 0.75,
              successBonus: '¡ORGANIZACIÓN IMPERIAL! Tu pase largo de reojo inicia un contragolpe directo de peligro.',
              failPenalty: 'Tu habilitación salió al lateral desaprovechando una gran recuperación defensiva.',
              effectOnSuccess: { goals: 0, assists: 1, prestige: 8, fans: 5 },
              effectOnFail: { prestige: -4, fans: -1, energy: 0 }
            }
          ]
        };

      case 'Arquero':
        return min < 50 ? {
          prompt: "¡Hay penal en contra ejecutado por el crack rival! Te mira fijamente antes de patear...",
          choices: [
            {
              text: 'Volar con reflejos felinos hacia tu derecha',
              requiredAttr: 'defensa', 
              minVal: 60,
              successChance: 0.50,
              successBonus: '¡ATAJADÓN! Volaste firmemente desviando la bocha al tiro de esquina lateral.',
              failPenalty: 'Te engañó por completo pateando al centro mientras volabas a la esquina.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 15, fans: 20 },
              effectOnFail: { prestige: -2, fans: -2, energy: 5 }
            },
            {
              text: 'Lanzarte con potencia a la base del palo izquierdo',
              requiredAttr: 'fisico',
              minVal: 55,
              successChance: 0.45,
              successBonus: '¡HÉROE TOTAL! Te estiraste al límite y contuviste el disparo rasante sin dar rebote.',
              failPenalty: 'El balón te pasó rozando por debajo del codo por milímetros.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 18, fans: 25 },
              effectOnFail: { prestige: -3, fans: -2, energy: 10 }
            },
            {
              text: 'Aguantar en seco el centro del arco provocando al tirador',
              requiredAttr: 'defensa',
              minVal: 58,
              successChance: 0.40,
              successBonus: '¡PURA MENTALIDAD! Se asustó e intentó picarla, la atrapaste con un mano sonriéndole.',
              failPenalty: 'La cruzó fuerte a la red dejándote estático en el centro de la valla.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 20, fans: 30 },
              effectOnFail: { prestige: -5, fans: -4, energy: 0 }
            }
          ]
        } : {
          prompt: "Un centro cerrado cae sobre el área chica lloviendo con muchísima rosca...",
          choices: [
            {
              text: 'Salir agresivamente a despejar con los puños firmes',
              requiredAttr: 'fisico',
              minVal: 55,
              successChance: 0.70,
              successBonus: '¡PROPIETARIO DEL ÁREA! Derribaste marcas lícitamente y mandaste el balón al círculo central.',
              failPenalty: 'Calculaste mal la trayectoria del viento y el balón te techó dejando el arco desprotegido.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 10, fans: 8 },
              effectOnFail: { prestige: -5, fans: -5, energy: 10 }
            },
            {
              text: 'Retroceder confiando en la velocidad de tus reflejos en línea',
              requiredAttr: 'defensa',
              minVal: 62,
              successChance: 0.80,
              successBonus: '¡GATO VOLADOR! El remate a quemarropa fue despejado milagrosamente sobre la línea de gol.',
              failPenalty: 'El cabezazo a bocajarro te batió cruzado imposible de detener.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 12, fans: 15 },
              effectOnFail: { prestige: -4, fans: -4, energy: 0 }
            },
            {
              text: 'Organizar la defensa gritando directivas con liderazgo',
              requiredAttr: 'pase',
              minVal: 45,
              successChance: 0.75,
              successBonus: '¡VOZ DE MANDO! Tus gritos ordenaron el marcaje impidiendo remates incómodos.',
              failPenalty: 'Tus defensas se confundieron chocando entre sí y regalando una opción clara.',
              effectOnSuccess: { goals: 0, assists: 0, prestige: 8, fans: 4 },
              effectOnFail: { prestige: -3, fans: -1, energy: 0 }
            }
          ]
        };
    }
  };

  const triggerDecisionEvent = (min: number) => {
    const decision = getPositionDecision(playerProfile.position, min);
    setActiveDecision(decision);
    setDecisionStage('choosing');
  };

  const handleChoice = (choiceIndex: number) => {
    if (!activeDecision) return;
    const choice = activeDecision.choices[choiceIndex];
    const playerAttrValue = playerProfile.attributes[choice.requiredAttr];
    
    const statDiff = playerAttrValue - choice.minVal;
    const adjustedChance = Math.max(0.15, Math.min(0.95, (choice.successChance + (statDiff * 0.015)) * pressureMultiplier));
    
    const isSuccess = Math.random() < adjustedChance;

    if (isSuccess) {
      setDecisionOutcomeText(choice.successBonus);
      setDecisionStage('result');
      
      if (choice.effectOnSuccess.goals > 0) {
        setPlayerGoals(prev => prev + choice.effectOnSuccess.goals);
        if (isHome.current) setScoreHome(prev => prev + choice.effectOnSuccess.goals);
        else setScoreAway(prev => prev + choice.effectOnSuccess.goals);
      }
      if (choice.effectOnSuccess.assists > 0) {
        setPlayerAssists(prev => prev + choice.effectOnSuccess.assists);
        if (isHome.current) setScoreHome(prev => prev + 1);
        else setScoreAway(prev => prev + 1);
      }
      setRating(prev => Math.min(prev + 1.5, 10.0));
      
      setMatchLog(prev => [...prev, {
        minute,
        text: `⚡ EVENTO DE DECISIÓN: ${choice.successBonus}`,
        type: 'good'
      }]);
    } else {
      setDecisionOutcomeText(choice.failPenalty);
      setDecisionStage('result');
      setRating(prev => Math.max(prev - 1.2, 3.0));
      
      setMatchLog(prev => [...prev, {
        minute,
        text: `⚠️ EVENTO DE DECISIÓN: ${choice.failPenalty}`,
        type: 'bad'
      }]);
    }
  };

  const resolveDecisionStage = () => {
    setActiveDecision(null);
    setDecisionStage('none');
    setDecisionOutcomeText('');
  };

  return (
    <div id="match-simulator" className="min-h-screen bg-slate-950 text-white flex flex-col justify-between py-6 px-4">
      
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-2xs font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">
            {isWorldCup ? '🌎 Copa Mundial FIFA 2026' : isLibertadores ? '🏆 Copa Libertadores 2026' : '🇨🇴 Primera División Dimayor'}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xs px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-bold">
              Minuto {minute}'
            </span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 px-5 py-2 rounded-2xl border border-slate-800 shadow-lg">
          <div className="text-right">
            <span className="font-black text-sm block">{teamName}</span>
            <span className="text-3xs text-emerald-400 uppercase font-mono font-bold tracking-wider">
              Tu Equipo{myTablePosition != null && ` · ${myTablePosition}°${leagueTeamCount ? `/${leagueTeamCount}` : ''}`}
            </span>
          </div>

          <div className="text-2xl font-black font-mono tracking-wider bg-slate-950 px-3.5 py-1 rounded-xl border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            {isHome.current ? scoreHome : scoreAway} - {isHome.current ? scoreAway : scoreHome}
          </div>

          <div className="text-left">
            <span className="font-black text-sm block">{opponentName}</span>
            <span className="text-3xs text-slate-500 uppercase font-mono tracking-wider">
              Rival{rivalTablePosition != null && ` · ${rivalTablePosition}°${leagueTeamCount ? `/${leagueTeamCount}` : ''}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setSpeedMultiplier(450)}
            className={`p-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 450 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Velocidad Normal"
          >
            1x
          </button>
          <button 
            onClick={() => setSpeedMultiplier(100)}
            className={`p-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 100 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Velocidad Rápida"
          >
            4x
          </button>
          <button 
            onClick={() => setSpeedMultiplier(5)}
            className={`p-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 5 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Simulación Ultra Rápida"
          >
            Saltar
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto my-6 grid md:grid-cols-3 gap-6 flex-1">
        
        <div className="md:col-span-2 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative h-[420px]">
          
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center z-10">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold">
              Transmisión de Texto en Vivo
            </span>
            <span className="text-2xs text-emerald-400 font-bold tracking-wider uppercase animate-pulse">
              ● Narración
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-none flex flex-col-reverse justify-start">
            {matchLog.slice().reverse().map((log, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-2xl border text-xs leading-relaxed transition-all ${
                  log.type === 'good'
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : log.type === 'bad'
                    ? 'bg-red-950/20 border-red-500/30 text-red-300'
                    : log.type === 'highlight'
                    ? 'bg-amber-950/15 border-amber-500/20 text-amber-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-mono text-2xs font-black">
                  <span>⚽ [{log.minute}']</span>
                  <span className={`uppercase px-1.5 rounded font-black text-3xs ${
                    log.type === 'good' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-900' :
                    log.type === 'bad' ? 'bg-red-500 text-slate-900' :
                    log.type === 'highlight' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {log.type === 'good' ? 'Éxito' : log.type === 'bad' ? 'Alerta' : log.type === 'highlight' ? 'Jugada' : 'Partido'}
                  </span>
                </div>
                <div>{log.text}</div>
              </div>
            ))}
          </div>

          {activeDecision && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-center p-4 text-center z-50 backdrop-blur">
              {decisionStage === 'choosing' ? (
                <div className="space-y-4 max-w-md mx-auto w-full max-h-full flex flex-col">
                  
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="inline-flex p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2 animate-bounce">
                      <Sparkles size={20} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-amber-500 font-mono">
                      Decisión crítica · Minuto {minute}'
                    </span>
                    <h3 className="text-sm font-extrabold text-white leading-snug mt-1 mb-2">
                      {activeDecision.prompt}
                    </h3>
                  </div>

                  <div className="space-y-2 overflow-y-auto flex-1 pr-1 pb-2">
                    {activeDecision.choices.map((choice, i) => {
                      const requiredVal = playerProfile.attributes[choice.requiredAttr];
                      const isPromoted = requiredVal >= choice.minVal;
                      return (
                        <button
                          key={i}
                          onClick={() => handleChoice(i)}
                          className="w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all bg-slate-900 border-slate-800 hover:border-amber-400/50 hover:bg-slate-850 cursor-pointer shadow-sm group"
                        >
                          <div className="max-w-[70%] pr-2">
                            <p className="font-bold text-xs text-white leading-tight group-hover:text-amber-300 transition-colors">
                              {choice.text}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 font-mono">
                              Éxito: <span className="text-emerald-400 font-bold">{Math.round(choice.successChance * 100)}%</span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-800">
                              {choice.requiredAttr}: <strong className={isPromoted ? 'text-emerald-400' : 'text-amber-500'}>{requiredVal}</strong>/{choice.minVal}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-sm mx-auto">
                  <div className={`inline-flex p-3 rounded-full border text-white ${decisionOutcomeText.includes('GOL') || decisionOutcomeText.includes('ASISTENCIA') || decisionOutcomeText.includes('ATAJADÓN') || decisionOutcomeText.includes('ELEGANCIA') ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-red-500/20 border-red-500/40'}`}>
                    {decisionOutcomeText.includes('GOL') ? <Target size={28} className="text-emerald-400" /> : <Skull size={28} className="text-red-400" />}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 font-mono block">
                      Resultado de Acción
                    </span>
                    <h3 className="text-base font-black text-white leading-snug mt-2 p-1">
                      {decisionOutcomeText}
                    </h3>
                  </div>

                  <button
                    onClick={resolveDecisionStage}
                    className="mt-4 py-2 px-6 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black hover:bg-emerald-400 text-xs transition-all tracking-widest uppercase cursor-pointer shadow-lg active:scale-95"
                  >
                    Volver al Partido
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-2xs uppercase tracking-widest text-slate-400 font-black mb-4 flex items-center gap-1.5">
              <Award size={13} className="text-amber-400" /> Rendimiento de {playerProfile.name}
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-emerald-500 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/10">
                <span className="text-xs font-black text-slate-400 uppercase leading-none font-mono tracking-tighter">Calificación</span>
                <span className="text-xl font-extrabold text-white leading-none mt-1 font-mono">
                  {rating.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="text-2xs font-extrabold uppercase text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {playerProfile.position}
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">{playerProfile.name}</h4>
                <p className="text-3xs text-slate-400 font-mono">Ficha de Temporada Oficial</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block font-mono">Goles</span>
                <span className="text-xl font-bold font-mono text-emerald-400 block mt-0.5">{playerGoals}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block font-mono">Asistencias</span>
                <span className="text-xl font-bold font-mono text-amber-500 block mt-0.5">{playerAssists}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-2xs text-slate-400 font-mono">
                <span>Efectividad de pases</span>
                <span className="text-white font-bold">{Math.round((rating / 10) * 85)}%</span>
              </div>
              <div className="flex justify-between text-2xs text-slate-400 font-mono">
                <span>Distancia recorrida</span>
                <span className="text-white font-bold">{(5.2 + (minute * 0.08)).toFixed(1)} km</span>
              </div>
              <div className="flex justify-between text-2xs text-slate-400 font-mono">
                <span>Tarjetas</span>
                <span className="text-white font-bold">Ninguna</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-1">
              💡 Consejo Profesional de Táctica
            </h4>
            <p className="leading-relaxed text-2xs">
              Tus elecciones críticas están vinculadas a tus atributos actuales. Si no has entrenado lo suficiente tus atributos físicos o de pase, intenta ir por las opciones seguras para evitar pérdidas de prestigio.
            </p>
            {tablePositionFactor < 0.97 && (
              <p className="leading-relaxed text-2xs text-amber-400 mt-2">
                ⚠️ Rival mejor ubicado en la tabla: tus decisiones tienen menos margen de éxito hoy.
              </p>
            )}
            {tablePositionFactor > 1.03 && (
              <p className="leading-relaxed text-2xs text-emerald-400 mt-2">
                ✨ Rival peor ubicado en la tabla: tus decisiones tienen algo más de margen hoy.
              </p>
            )}
            {playerProfile.fans < 20 && (
              <p className="leading-relaxed text-2xs text-amber-400 mt-2">
                📣 La hinchada te viene pitando: tus decisiones tienen menos margen de éxito hoy.
              </p>
            )}
            {playerProfile.fans > 80 && (
              <p className="leading-relaxed text-2xs text-emerald-400 mt-2">
                📣 La hinchada te banca a muerte: tus decisiones tienen algo más de margen hoy.
              </p>
            )}
            {playerProfile.mentalHealth < 35 && (
              <p className="leading-relaxed text-2xs text-amber-400 mt-2">
                🧠 Traes la cabeza floja: tus decisiones tienen menos margen de éxito hoy.
              </p>
            )}
            {playerProfile.mentalHealth > 85 && (
              <p className="leading-relaxed text-2xs text-emerald-400 mt-2">
                🧠 Estás mentalmente a tope: tus decisiones tienen algo más de margen hoy.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}