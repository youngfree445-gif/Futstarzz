import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, MatchEvent, MatchDecision, Position, Club, PlayerStats } from '../types';
import { Play, FastForward, Check, Skull, Star, Award, Sparkles, Trophy, ArrowLeft, ArrowUp, ArrowRight, Armchair, Target, Send, BarChart3, Footprints, Square, Lightbulb, AlertTriangle, Megaphone, Brain } from 'lucide-react';
import { ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE, OPPONENT_CLUBS_POOL, WORLD_CUP_TEAMS_DATABASE, getClubWithRoster } from '../data';
import { playSfx } from '../audio';
import { CAREER_START_YEAR, getSeasonYear } from '../leagueEngine';
import { getDomesticCupName, getLeagueDisplay } from '../leagueDisplay';
import { applySquadRetirements, displayName } from '../worldRetirements';

// Silbatazo de inicio y final del partido. Apagado a pedido del usuario: el sonido molestaba más
// de lo que sumaba. El resto de los efectos del partido (gol, tarjeta, etc.) no se tocan.
// Para volver a activarlo alcanza con poner true acá -- el audio y su carga siguen en su lugar.
const WHISTLE_SFX_ENABLED = false;

// Pool de decisiones por posición y momento del partido (early = minuto 24, late = minuto 71 --
// ver triggerDecisionEvent). Antes cada posición tenía EXACTAMENTE una decisión fija por momento
// (siempre el mismo prompt y las mismas 3 opciones, partido tras partido); ahora cada momento elige
// al azar entre varias, y a propósito no todas las opciones de éxito terminan en gol/asistencia --
// varias son jugadas de mérito (recuperación, achique, manejo de tiempos) que solo suman prestigio/
// fans, para que un partido "bueno" no sea sinónimo automático de gol.
const DELANTERO_EARLY: MatchDecision[] = [
  {
    prompt: "Recibes un pase filtrado al borde del área grande, el central rival te presiona fuertemente la espalda...",
    choices: [
      {
        text: 'Girar con velocidad y rematar de volea al ángulo',
        requiredAttr: 'tiro',
        minVal: 55,
        successChance: 0.35,
        successBonus: '¡GOLAZO! Giraste con una fluidez brutal y la clavaste al ángulo opuesto del palo.',
        failPenalty: 'El disparo chocó en las piernas del central y salieron de contragolpe.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 4, fans: 12 },
        effectOnFail: { prestige: -2, fans: -1, energy: 0 }
      },
      {
        text: 'Aguantar de espaldas y pivotear el balón hacia el extremo',
        requiredAttr: 'pase',
        minVal: 45,
        successChance: 0.6,
        successBonus: '¡CON RETORNO! Diste un pase seguro exquisito y tu equipo conserva la posesión con ventaja.',
        failPenalty: 'Diste un pase débil directo al mediocentro defensivo rival.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 3, fans: 5 },
        effectOnFail: { prestige: -3, fans: -2, energy: 5 }
      },
      {
        text: 'Engañarlos con un elegante autopase de taco por aire',
        requiredAttr: 'regate',
        minVal: 53,
        successChance: 0.3,
        successBonus: '¡PRESTIGIO TOTAL! El sombrerito funcionó, asistes a tu compañero que empuja el balón. ¡ASISTENCIA!',
        failPenalty: 'Te quitaron el balón con facilidad y quedaste tendido pidiendo una falta inexistente.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 5, fans: 15 },
        effectOnFail: { prestige: -5, fans: -5, energy: 5 }
      }
    ]
  },
  {
    prompt: "¡Contragolpe letal! Quedan 3 contra 2 con el equipo desbordando por la izquierda, tienes que decidir rápido...",
    choices: [
      {
        text: 'Filtrar el balón al compañero mejor ubicado',
        requiredAttr: 'pase',
        minVal: 50,
        successChance: 0.55,
        successBonus: '¡LECTURA PERFECTA! El pase encontró el hueco justo y tu compañero definió sin problemas. ¡ASISTENCIA!',
        failPenalty: 'El pase se fue directo a los pies del último defensor rival, contragolpe abortado.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 4, fans: 10 },
        effectOnFail: { prestige: -3, fans: -2, energy: 0 }
      },
      {
        text: 'Encarar tú mismo al último defensor con velocidad',
        requiredAttr: 'ritmo',
        minVal: 55,
        successChance: 0.4,
        successBonus: '¡EXPLOSIÓN PURA! Lo dejaste en el camino y definiste solo ante el arquero. ¡GOL!',
        failPenalty: 'El defensor te alcanzó justo a tiempo y cortó el avance con una entrada limpia.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 5, fans: 14 },
        effectOnFail: { prestige: -2, fans: -1, energy: 10 }
      },
      {
        text: 'Frenar el avance y esperar que suban los compañeros',
        requiredAttr: 'pase',
        minVal: 40,
        successChance: 0.75,
        successBonus: 'DECISIÓN INTELIGENTE: mantuviste la posesión y reorganizaste el ataque con paciencia, sin arriesgar de más.',
        failPenalty: 'Frenaste de más y el rival recompuso la marca, se perdió la superioridad numérica.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 1 },
        effectOnFail: { prestige: -2, fans: -1, energy: 0 }
      }
    ]
  },
  {
    prompt: "Marca personal asfixiante del central rival, juegas de espaldas al arco con muy poco espacio para girar...",
    choices: [
      {
        text: 'Pelear el balón cuerpo a cuerpo y forzar la falta',
        requiredAttr: 'fisico',
        minVal: 52,
        successChance: 0.5,
        successBonus: '¡AGUANTE TOTAL! Protegiste la pelota con el cuerpo y el árbitro corta el juego a tu favor. Tiro libre peligroso.',
        failPenalty: 'Perdiste el pulso físico y el rival se llevó el balón limpio.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 5 },
        effectOnFail: { prestige: -2, fans: -1, energy: 8 }
      },
      {
        text: 'Dejarla caer de primera para el compañero que sube',
        requiredAttr: 'pase',
        minVal: 48,
        successChance: 0.55,
        successBonus: '¡PARED PERFECTA! La devolución de primera dejó mano a mano a tu compañero. ¡ASISTENCIA!',
        failPenalty: 'El toque de primera salió débil y el rival cortó la jugada sin problemas.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 4, fans: 9 },
        effectOnFail: { prestige: -3, fans: -2, energy: 0 }
      },
      {
        text: 'Simular el contacto buscando ganar un tiro libre',
        requiredAttr: 'regate',
        minVal: 45,
        successChance: 0.3,
        successBonus: 'El árbitro compró la caída: tiro libre cerca del área para tu equipo.',
        failPenalty: '¡El árbitro no perdonó la teatralidad! Te muestra tarjeta amarilla por simulación.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: -3 },
        effectOnFail: { prestige: -6, fans: -8, energy: 0 },
        cardRiskOnFail: 'yellow'
      }
    ]
  },
  {
    prompt: "Recibes de espaldas al área en el círculo central, con TODA la línea defensiva rival plantada entre vos y el arco, nadie se anima a meterte presión...",
    choices: [
      {
        text: 'Encarar y regatear a todo el equipo rival, uno por uno',
        requiredAttr: 'regate',
        minVal: 70,
        successChance: 0.18,
        successBonus: '¡GENIALIDAD ABSOLUTA! Dejaste en el camino a cuatro rivales con una serie de gambetas imposibles y definiste solo ante el arquero. ¡GOLAZO PARA LA HISTORIA!',
        failPenalty: 'El quinto rival te alcanzó justo antes del área y cortó la jugada individual con una entrada limpia. El estadio abuchea el intento egoísta.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 10, fans: 30 },
        effectOnFail: { prestige: -6, fans: -6, energy: 18 }
      },
      {
        text: 'Simplificar con un pase seguro al primer compañero libre',
        requiredAttr: 'pase',
        minVal: 42,
        successChance: 0.78,
        successBonus: 'Jugada sin riesgo: soltaste rápido y el equipo mantiene la posesión con calma.',
        failPenalty: 'El pase fácil salió mal calculado y el rival recuperó cerca de mitad de cancha.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 1, fans: 0 },
        effectOnFail: { prestige: -3, fans: -2, energy: 0 }
      },
      {
        text: 'Probar un par de gambetas cortas para ganar unos metros',
        requiredAttr: 'regate',
        minVal: 50,
        successChance: 0.45,
        successBonus: '¡BUEN QUIEBRE! Ganaste espacio con un par de amagues y habilitaste el ataque en mejor posición.',
        failPenalty: 'Te cerraron el espacio rápido y perdiste el balón sin generar peligro.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 3, fans: 5 },
        effectOnFail: { prestige: -2, fans: -1, energy: 8 }
      }
    ]
  },
  {
    prompt: "Notás que tu compañero de ataque quedó desconectado del bloque y el equipo pierde el orden en la presión tras perder la pelota...",
    choices: [
      {
        text: 'Gritar para reordenar el pressing y cerrar líneas de pase',
        requiredAttr: 'fisico',
        minVal: 50,
        successChance: 0.55,
        successBonus: '¡LIDERAZGO EN LA CANCHA! El equipo recupera el orden y ahoga la salida rival, terminando en pérdida forzada a tu favor.',
        failPenalty: 'Nadie te hizo caso en el achique y el rival salió jugando cómodo desde el fondo.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 3, fans: 5 },
        effectOnFail: { prestige: -2, fans: -1, energy: 6 }
      },
      {
        text: 'Señalar el espacio libre a tu compañero con un gesto claro',
        requiredAttr: 'pase',
        minVal: 48,
        successChance: 0.5,
        successBonus: '¡CONEXIÓN TOTAL! Tu compañero entendió el gesto al instante y se desmarcó justo a tiempo, dejándolo en posición de gol.',
        failPenalty: 'La seña llegó tarde y tu compañero quedó en fuera de juego posicional sin entenderte.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 4, fans: 6 },
        effectOnFail: { prestige: -3, fans: -2, energy: 0 }
      },
      {
        text: 'Ignorar la desconexión y seguir jugando por tu cuenta',
        requiredAttr: 'ritmo',
        minVal: 40,
        successChance: 0.7,
        successBonus: 'Resolviste solo la jugada igual, sin necesidad de coordinar con nadie más.',
        failPenalty: 'Tu individualismo dejó al equipo descoordinado un rato más y el rival aprovechó el desorden para salir con ventaja.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 1, fans: 0 },
        effectOnFail: { prestige: -4, fans: -3, energy: 0 }
      }
    ]
  },
  {
    prompt: "¡PENAL A FAVOR! El árbitro no duda tras la falta clarísima dentro del área. El capitán te entrega el balón: te toca a vos ejecutar.",
    kickMode: 'penalty',
    choices: []
  }
];

const DELANTERO_LATE: MatchDecision[] = [
  {
    prompt: "¡Quedas completamente mano a mano frente al portero tras un pase bombeado letal! Te sale a achicar...",
    choices: [
      {
        text: 'Definir picando el balón de vaselina suave',
        requiredAttr: 'regate',
        minVal: 58,
        successChance: 0.3,
        successBonus: '¡PURA CLASE! Bañaste al portero de forma deliciosa. La pelota ingresa perezosa a la red. ¡GOL!',
        failPenalty: 'El portero adivinó la vaselina y atrapó el esférico con ambas manos sin despeinarse.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 6, fans: 18 },
        effectOnFail: { prestige: -4, fans: -3, energy: 0 }
      },
      {
        text: 'Romper el arco fusilando con potencia al primer poste',
        requiredAttr: 'tiro',
        minVal: 60,
        successChance: 0.5,
        successBonus: '¡FUEGO EN LOS GUANTES! El trallazo superó la resistencia del arquero por pura potencia. ¡GOL!',
        failPenalty: 'El disparo salió desviado por el lateral exterior de la red. Balón de saque de meta.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 4, fans: 10 },
        effectOnFail: { prestige: -1, fans: -1, energy: 10 }
      },
      {
        text: 'Pasar el balón al costado al compañero solo frente al arco vacío',
        requiredAttr: 'pase',
        minVal: 48,
        successChance: 0.7,
        successBonus: '¡COMPAÑERISMO! Dejaste el ego atrás, asistes a tu par que define con el arco vacío. ¡ASISTENCIA!',
        failPenalty: 'Diste el pase demasiado largo y tu compañero no alcanzó a conectar barriéndose.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 5, fans: 4 },
        effectOnFail: { prestige: -6, fans: -2, energy: 0 }
      }
    ]
  },
  {
    prompt: "Tu equipo gana por la mínima y quedan pocos minutos. Te cae un balón cerca del banderín de córner con el rival volcado al ataque...",
    choices: [
      {
        text: 'Proteger el balón en la esquina para hacer tiempo',
        requiredAttr: 'fisico',
        minVal: 45,
        successChance: 0.65,
        successBonus: 'GESTIÓN PERFECTA: aguantaste la pelota pegado a la línea y el árbitro pita falta a favor. El reloj sigue corriendo.',
        failPenalty: 'Te quitaron el balón en la disputa y el rival sale rápido de contragolpe.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 2 },
        effectOnFail: { prestige: -4, fans: -3, energy: 5 }
      },
      {
        text: 'Reponerte rápido y buscar liquidar el partido',
        requiredAttr: 'tiro',
        minVal: 55,
        successChance: 0.3,
        successBonus: '¡SENTENCIA! Encontraste el segundo gol que deja el partido totalmente resuelto.',
        failPenalty: 'El remate se fue desviado y el rival recupera con espacio para su última ofensiva.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 6, fans: 16 },
        effectOnFail: { prestige: -2, fans: -2, energy: 10 }
      },
      {
        text: 'Tocarla en corto para no arriesgar la ventaja',
        requiredAttr: 'pase',
        minVal: 42,
        successChance: 0.72,
        successBonus: 'Manejo inteligente del balón: el equipo respira y controla el partido sin sobresaltos.',
        failPenalty: 'El pase corto salió mal calculado y el rival te robó cerca de tu propia área.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 0 },
        effectOnFail: { prestige: -5, fans: -4, energy: 0 }
      }
    ]
  },
  {
    prompt: "¡Centro bombeado que te queda picando de espaldas al arco, dentro del área! No hay tiempo de acomodarte, o la tocás de otra forma o se pierde la ocasión...",
    choices: [
      {
        text: 'Intentar una chilena acrobática de espaldas al arco',
        requiredAttr: 'tiro',
        minVal: 68,
        successChance: 0.22,
        successBonus: '¡CHILENA DE ANTOLOGÍA! Te fuiste al piso y la clavaste imposible arriba del arquero. ¡GOLAZO PARA LOS ANALES DEL CLUB!',
        failPenalty: 'La chilena salió desviada por completo y terminaste de espaldas en el pasto sin generar peligro real.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 11, fans: 32 },
        effectOnFail: { prestige: -4, fans: -3, energy: 15 }
      },
      {
        text: 'Bajarla con el pecho y girar para definir de frente',
        requiredAttr: 'regate',
        minVal: 55,
        successChance: 0.4,
        successBonus: '¡CONTROL Y GIRO PERFECTO! Bajaste el balón con clase y definiste de frente sin problemas. ¡GOL!',
        failPenalty: 'El control se te fue largo y el defensor central llegó primero a despejar.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 6, fans: 14 },
        effectOnFail: { prestige: -2, fans: -1, energy: 5 }
      },
      {
        text: 'Dejarla caer y cederla de taco al compañero que llega de atrás',
        requiredAttr: 'pase',
        minVal: 50,
        successChance: 0.5,
        successBonus: '¡TACO GENIAL! Dejaste el balón servido para que tu compañero defina solo. ¡ASISTENCIA!',
        failPenalty: 'El taco salió sin fuerza y el rival despejó el peligro sin drama.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 5, fans: 9 },
        effectOnFail: { prestige: -3, fans: -1, energy: 0 }
      }
    ]
  },
  {
    prompt: "Centro cerrado y venenoso desde la banda que cae justo en tu zona de remate, dentro del área rival...",
    choices: [
      {
        text: 'Cabecear con violencia buscando el primer palo',
        requiredAttr: 'fisico',
        minVal: 58,
        successChance: 0.4,
        successBonus: '¡CABEZAZO LETAL! Le pegaste con toda el alma y el arquero no pudo hacer nada. ¡GOL!',
        failPenalty: 'El cabezazo salió débil y el arquero controló sin problemas.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 6, fans: 15 },
        effectOnFail: { prestige: -2, fans: -1, energy: 8 }
      },
      {
        text: 'Bajarla de pecho para el compañero mejor plantado',
        requiredAttr: 'regate',
        minVal: 50,
        successChance: 0.55,
        successBonus: '¡CONTROL DE ORFEBRE! Dejaste la pelota servida y tu compañero definió de primera. ¡ASISTENCIA!',
        failPenalty: 'El control te quedó largo y el defensor central se anticipó, despejando el peligro.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 4, fans: 8 },
        effectOnFail: { prestige: -3, fans: -1, energy: 0 }
      },
      {
        text: 'Desviarla con cuidado buscando forzar un nuevo córner',
        requiredAttr: 'tiro',
        minVal: 40,
        successChance: 0.75,
        successBonus: 'Jugada inteligente: sin espacio para definir bien, generaste otro córner y el equipo sigue presionando.',
        failPenalty: 'Se te escapó el control por completo y el balón quedó servido para que el rival despeje sin problemas.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 1 },
        effectOnFail: { prestige: -3, fans: -2, energy: 0 }
      }
    ]
  }
];

const MEDIOCAMPISTA_EARLY: MatchDecision[] = [
  {
    prompt: "Recuperas un rebote en el círculo central y el rival deja desprotegida la banda con el extremo pidiendo pase libre...",
    choices: [
      {
        text: 'Lanzar un pase filtrado de tres dedos por el callejón central',
        requiredAttr: 'pase',
        minVal: 55,
        successChance: 0.55,
        successBonus: '¡PINCELADA! Pase con una precisión digna de cirujano. El extremo desborda y la mete al arco. ¡ASISTENCIA!',
        failPenalty: 'El pase quedó corto y fue cortado en la medular por el pivote contrario.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 4, fans: 8 },
        effectOnFail: { prestige: -3, fans: -1, energy: 0 }
      },
      {
        text: 'Arrastrar la marca tú mismo regateando por el centro',
        requiredAttr: 'regate',
        minVal: 55,
        successChance: 0.4,
        successBonus: '¡PURA MAGIA! Dejaste atrás a dos rivales pegados y asistes en zona caliente para gol de tu club. ¡ASISTENCIA!',
        failPenalty: 'Te barrieron fuerte pero lícitamente y perdiste la posesión ofensiva.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 5, fans: 12 },
        effectOnFail: { prestige: -4, fans: -3, energy: 5 }
      },
      {
        text: 'Aprovechar el espacio libre y disparar de media distancia de primera',
        requiredAttr: 'tiro',
        minVal: 58,
        successChance: 0.3,
        successBonus: '¡MISIL TIERRA-AIRE! Sorprendiste a todo el estadio metiéndola abajo en el palo derecho. ¡GOLAZO!',
        failPenalty: 'El remate salió muy desviado hacia las gradas del estadio.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 6, fans: 15 },
        effectOnFail: { prestige: -1, fans: 0, energy: 5 }
      }
    ]
  },
  {
    prompt: "El rival presiona alto buscando el error en la salida, tienes que decidir cómo manejar el ritmo del partido...",
    choices: [
      {
        text: 'Tocar rápido en corto para romper la presión',
        requiredAttr: 'pase',
        minVal: 50,
        successChance: 0.6,
        successBonus: '¡SALIDA LIMPIA! Rompiste la presión con toques cortos y el equipo respira con la pelota controlada.',
        failPenalty: 'El toque corto fue leído por el rival, que recuperó cerca de tu área.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 3 },
        effectOnFail: { prestige: -4, fans: -3, energy: 0 }
      },
      {
        text: 'Arriesgar un pase filtrado entre líneas',
        requiredAttr: 'pase',
        minVal: 62,
        successChance: 0.3,
        successBonus: '¡VISIÓN DE OTRO PLANETA! El pase partió en dos a la defensa rival. ¡ASISTENCIA!',
        failPenalty: 'El pase fue interceptado y el rival sale de contragolpe con espacio.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 6, fans: 14 },
        effectOnFail: { prestige: -5, fans: -4, energy: 0 }
      },
      {
        text: 'Simplificar devolviéndosela al arquero para reorganizar',
        requiredAttr: 'pase',
        minVal: 35,
        successChance: 0.82,
        successBonus: 'Decisión sin brillo pero efectiva: el equipo se reordena con calma y sale la presión rival.',
        failPenalty: 'El pase de vuelta salió flojo y casi genera un susto enorme en tu propia área.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 1, fans: 0 },
        effectOnFail: { prestige: -6, fans: -5, energy: 0 }
      }
    ]
  },
  {
    prompt: "Falta a favor cerca del borde del área rival. Todo el equipo te mira: eres tú quien ejecuta...",
    choices: [
      {
        text: 'Cobrar directo al arco buscando la escuadra',
        requiredAttr: 'tiro',
        minVal: 58,
        successChance: 0.32,
        successBonus: '¡DIRECTO A LA ESCUADRA! La barrera saltó tarde y el arquero solo pudo mirarla entrar. ¡GOLAZO!',
        failPenalty: 'El remate se fue apenas desviado, rozando el travesaño.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 6, fans: 17 },
        effectOnFail: { prestige: -2, fans: -1, energy: 5 }
      },
      {
        text: 'Centrar buscando la cabeza del central que sube',
        requiredAttr: 'pase',
        minVal: 52,
        successChance: 0.5,
        successBonus: '¡CENTRO MEDIDO! Tu compañero llegó solo por el segundo palo para cabecear al gol. ¡ASISTENCIA!',
        failPenalty: 'El centro fue despejado por la defensa rival sin mayores complicaciones.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 4, fans: 9 },
        effectOnFail: { prestige: -2, fans: -1, energy: 0 }
      },
      {
        text: 'Jugarla corta para armar de nuevo el ataque',
        requiredAttr: 'pase',
        minVal: 45,
        successChance: 0.72,
        successBonus: 'Jugada colectiva bien resuelta: el equipo reorganiza el ataque con más gente cerca del área.',
        failPenalty: 'La jugada amasada se cortó rápido y el rival despeja el peligro sin problemas.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 1 },
        effectOnFail: { prestige: -2, fans: -1, energy: 0 }
      }
    ]
  },
  {
    prompt: "¡TIRO LIBRE DIRECTO! Falta muy cerca del área rival, con ángulo de disparo. La barrera se está armando, pero el árbitro ya pitó: es tu ejecución.",
    kickMode: 'freekick',
    choices: []
  },
  {
    prompt: "El equipo queda partido en dos bloques tras perder la pelota en un contragolpe rival y hace falta reordenar las líneas ya...",
    choices: [
      {
        text: 'Gritar instrucciones para achicar el campo entre líneas',
        requiredAttr: 'pase',
        minVal: 52,
        successChance: 0.55,
        successBonus: '¡VOZ DE MANDO! El bloque se cierra a tiempo y asfixia el contragolpe rival antes de que sea peligroso.',
        failPenalty: 'Nadie reaccionó a tiempo: el rival encontró el pasillo libre entre líneas y avanzó con comodidad.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 6 },
        effectOnFail: { prestige: -4, fans: -3, energy: 5 }
      },
      {
        text: 'Correr tú mismo a tapar el hueco que dejó la desorganización',
        requiredAttr: 'fisico',
        minVal: 55,
        successChance: 0.5,
        successBonus: '¡SACRIFICIO TOTAL! Cubriste metros de más y llegaste a cortar la jugada rival tú solo.',
        failPenalty: 'El esfuerzo no alcanzó: llegaste tarde y el rival ya había definido la jugada.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 3, fans: 7 },
        effectOnFail: { prestige: -3, fans: -2, energy: 14 }
      },
      {
        text: 'Confiar en que la defensa se acomode sola y quedarte de referencia',
        requiredAttr: 'defensa',
        minVal: 45,
        successChance: 0.68,
        successBonus: 'La lectura fue correcta: la línea se ordenó sin necesidad de que bajaras a tapar el hueco.',
        failPenalty: 'La defensa no se acomodó a tiempo y quedaste mirando cómo el rival generaba una ocasión clara.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 1, fans: 1 },
        effectOnFail: { prestige: -5, fans: -4, energy: 0 }
      }
    ]
  }
];

const MEDIOCAMPISTA_LATE: MatchDecision[] = [
  {
    prompt: "El rival ataca con superioridad numérica por el centro. Debes tomar control defensivo rápido o arriesgar...",
    choices: [
      {
        text: 'Arrojarse en una barrida temeraria pero directa para recuperar',
        requiredAttr: 'defensa',
        minVal: 48,
        successChance: 0.45,
        successBonus: '¡CORTE DE HIERRO! Robaste limpiamente e iniciaste rápidamente la contra para tu equipo.',
        failPenalty: '¡Llegaste tarde! Te pintaron de amarillo y regalaste un tiro libre peligroso.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 5, fans: 12 },
        effectOnFail: { prestige: -6, fans: -5, energy: 10 },
        cardRiskOnFail: 'yellow'
      },
      {
        text: 'Presionar al portador usando tu físico para asfixiar su pase',
        requiredAttr: 'fisico',
        minVal: 50,
        successChance: 0.6,
        successBonus: '¡PULMONES DE ACERO! Forzaste el error de pase del rival enviando el esférico al lateral.',
        failPenalty: 'Te pasaron con un regate simple y tu físico terminó en falta sobre el rival.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 3, fans: 4 },
        effectOnFail: { prestige: -2, fans: -2, energy: 15 },
        cardRiskOnFail: 'yellow'
      },
      {
        text: 'Marcar pasivamente tapando el pase hacia el delantero estrella',
        requiredAttr: 'pase',
        minVal: 52,
        successChance: 0.65,
        successBonus: '¡LECTURA TÁCTICA! Cortas la línea de habilitación salvando una jugada crucial.',
        failPenalty: 'Te filtraron el balón por medio de las piernas desestabilizándote por completo.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 3 },
        effectOnFail: { prestige: -3, fans: -1, energy: 0 }
      }
    ]
  },
  {
    prompt: "El rival está cansado en el tramo final y se abre un espacio enorme entre líneas...",
    choices: [
      {
        text: 'Filtrar el pase entre los dos centrales',
        requiredAttr: 'pase',
        minVal: 55,
        successChance: 0.45,
        successBonus: '¡PASE QUIRÚRGICO! Encontraste el hueco exacto y tu compañero definió solo. ¡ASISTENCIA!',
        failPenalty: 'El pase fue leído a tiempo por uno de los centrales, que cortó la jugada.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 5, fans: 11 },
        effectOnFail: { prestige: -3, fans: -2, energy: 0 }
      },
      {
        text: 'Avanzar tú mismo y definir tras superar líneas',
        requiredAttr: 'tiro',
        minVal: 56,
        successChance: 0.32,
        successBonus: '¡LLEGADA DE MEDIOCAMPISTA! Avanzaste sin que nadie te frenara y definiste con clase. ¡GOL!',
        failPenalty: 'El remate final se fue apenas afuera tras la larga carrera.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 6, fans: 15 },
        effectOnFail: { prestige: -2, fans: -1, energy: 12 }
      },
      {
        text: 'Retener la posesión sin arriesgar el resultado',
        requiredAttr: 'pase',
        minVal: 40,
        successChance: 0.78,
        successBonus: 'Manejo inteligente de los tiempos: el equipo controla el partido sin sobresaltos innecesarios.',
        failPenalty: 'Un pase de más terminó en pérdida cerca de mitad de cancha.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 0 },
        effectOnFail: { prestige: -3, fans: -2, energy: 0 }
      }
    ]
  },
  {
    prompt: "El armador rival controla el balón de espaldas a vos en el círculo central, confiado, sin saber que le venís pisando los talones...",
    choices: [
      {
        text: 'Robarle el balón por detrás y lanzar el contragolpe con un pase gol inmediato',
        requiredAttr: 'defensa',
        minVal: 58,
        successChance: 0.35,
        successBonus: '¡ROBO Y PASE GOL EN UNA SOLA JUGADA! Le sacaste el balón limpio y sin parar filtraste el pase perfecto para el gol de tu compañero. ¡ASISTENCIA!',
        failPenalty: 'Llegaste desprolijo, no tocaste el balón y el armador rival escapó con ventaja.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 7, fans: 15 },
        effectOnFail: { prestige: -4, fans: -3, energy: 10 }
      },
      {
        text: 'Robar el balón limpio y guardarlo, sin arriesgar el pase',
        requiredAttr: 'defensa',
        minVal: 48,
        successChance: 0.55,
        successBonus: '¡ROBO SECO! Recuperaste la pelota sin complicarte, el equipo se reorganiza con la posesión a favor.',
        failPenalty: 'Falló el intento de robo y el rival mantuvo el balón sin problemas.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 3, fans: 4 },
        effectOnFail: { prestige: -2, fans: -1, energy: 8 }
      },
      {
        text: 'Marcarlo de cerca sin entrar al choque para no arriesgar tarjeta',
        requiredAttr: 'pase',
        minVal: 45,
        successChance: 0.68,
        successBonus: 'Marca inteligente: lo incomodaste lo suficiente para que perdiera tiempo en su salida.',
        failPenalty: 'La marca pasiva no molestó lo suficiente y el armador encontró el pase que buscaba.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 1 },
        effectOnFail: { prestige: -2, fans: -1, energy: 0 }
      }
    ]
  },
  {
    prompt: "El técnico te grita desde el banco que bajes a tapar la salida rival: el resultado está muy ajustado...",
    choices: [
      {
        text: 'Marca personal estrecha sobre el armador rival',
        requiredAttr: 'defensa',
        minVal: 55,
        successChance: 0.58,
        successBonus: '¡ANULADO POR COMPLETO! El armador rival no pudo tocar una sola pelota limpia en varios minutos.',
        failPenalty: 'Se te escapó en un giro rápido y quedó de cara al ataque.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 6 },
        effectOnFail: { prestige: -4, fans: -4, energy: 8 }
      },
      {
        text: 'Cubrir el espacio libre sin ir a la marca directa',
        requiredAttr: 'pase',
        minVal: 48,
        successChance: 0.68,
        successBonus: '¡LECTURA DE PARTIDO! Tapaste la línea de pase clave y el rival tuvo que reiniciar la jugada.',
        failPenalty: 'El rival encontró igual el hueco que intentabas cubrir.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 2 },
        effectOnFail: { prestige: -3, fans: -2, energy: 0 }
      },
      {
        text: 'Arriesgar a robarle el balón para salir de contragolpe',
        requiredAttr: 'defensa',
        minVal: 52,
        successChance: 0.4,
        successBonus: '¡ROBO Y CONTRAGOLPE! Le sacaste el balón limpio y lanzaste una contra peligrosa para tu equipo.',
        failPenalty: 'Llegaste fuerte y tarde: el árbitro no duda en sancionarte con tarjeta.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 6, fans: 12 },
        effectOnFail: { prestige: -6, fans: -5, energy: 10 },
        cardRiskOnFail: 'yellow'
      }
    ]
  }
];

const DEFENSOR_EARLY: MatchDecision[] = [
  {
    prompt: "El veloz extremo rival te encara directamente por la banda, amaga hacia el centro con un paso elástico...",
    choices: [
      {
        text: 'Interponer el cuerpo usando tu peso de forma física',
        requiredAttr: 'fisico',
        minVal: 55,
        successChance: 0.55,
        successBonus: '¡MURO IMPENETRABLE! Lo desplazaste legalmente y saliste jugando con solvencia de crack.',
        failPenalty: 'Te ganaron la espalda por la inercia, lo derribaste tratando de recuperar y el árbitro sanciona.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 6 },
        effectOnFail: { prestige: -4, fans: -4, energy: 8 },
        cardRiskOnFail: 'yellow'
      },
      {
        text: 'Realizar un cierre defensivo limpio estirando la pierna con timing',
        requiredAttr: 'defensa',
        minVal: 58,
        successChance: 0.65,
        successBonus: '¡ELEGANCIA DE DEFENSOR! Quitaste con guante blanco. Limpieza absoluta.',
        failPenalty: 'Calculaste mal el timing y llegaste a destiempo, la pierna estirada pega de lleno en el rival.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 5, fans: 10 },
        effectOnFail: { prestige: -6, fans: -8, energy: 0 },
        cardRiskOnFail: 'yellow'
      },
      {
        text: 'Meter presión explosiva para obligarlo a girar e ir hacia atrás',
        requiredAttr: 'ritmo',
        minVal: 54,
        successChance: 0.5,
        successBonus: '¡VELOCIDAD PURA! Le diste caza, forzando la pérdida y enviando el balón fuera del campo.',
        failPenalty: 'Te dejó descolocado por completo con un cambio de ritmo letal.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 3, fans: 4 },
        effectOnFail: { prestige: -2, fans: -2, energy: 10 }
      }
    ]
  },
  {
    prompt: "Presión alta de dos delanteros rivales sobre tu salida desde el fondo...",
    choices: [
      {
        text: 'Pase largo directo buscando al delantero',
        requiredAttr: 'pase',
        minVal: 55,
        successChance: 0.4,
        successBonus: '¡PELOTAZO PRECISO! El balón cayó perfecto en el pecho del delantero, que definió de cara al arco. ¡ASISTENCIA!',
        failPenalty: 'El pase largo se fue directo a las manos del arquero rival.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 4, fans: 8 },
        effectOnFail: { prestige: -3, fans: -2, energy: 0 }
      },
      {
        text: 'Pase corto seguro al lateral',
        requiredAttr: 'pase',
        minVal: 42,
        successChance: 0.78,
        successBonus: 'Salida limpia y sin sobresaltos: el equipo sigue construyendo desde atrás con tranquilidad.',
        failPenalty: 'El pase corto quedó corto de más y casi genera un susto en tu propia área.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 1 },
        effectOnFail: { prestige: -5, fans: -4, energy: 0 }
      },
      {
        text: 'Conducir tú mismo unos metros para ganar tiempo',
        requiredAttr: 'ritmo',
        minVal: 50,
        successChance: 0.55,
        successBonus: 'Manejaste bien los tiempos y encontraste el pase justo tras avanzar unos metros con el balón dominado.',
        failPenalty: 'Te presionaron y perdiste el balón cerca de tu propia área, situación de riesgo total.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 2 },
        effectOnFail: { prestige: -7, fans: -6, energy: 10 }
      }
    ]
  },
  {
    prompt: "El rival intenta un pase filtrado buscando la espalda de tu línea defensiva...",
    choices: [
      {
        text: 'Anticipar el corte leyendo la trayectoria',
        requiredAttr: 'defensa',
        minVal: 55,
        successChance: 0.5,
        successBonus: '¡ANTICIPACIÓN PERFECTA! Cortaste el balón antes de que llegue al delantero rival.',
        failPenalty: 'No llegaste a tiempo y el delantero recibió con ventaja.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 7 },
        effectOnFail: { prestige: -4, fans: -4, energy: 8 }
      },
      {
        text: 'Achicar el espacio marcando bien la línea de pase',
        requiredAttr: 'pase',
        minVal: 45,
        successChance: 0.68,
        successBonus: 'Posicionamiento inteligente: tapaste la línea de pase sin necesidad de arriesgar el cuerpo.',
        failPenalty: 'El rival igual encontró el ángulo para filtrar el balón.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 3 },
        effectOnFail: { prestige: -3, fans: -3, energy: 0 }
      },
      {
        text: 'Arriesgar la línea alta para dejarlo en offside',
        requiredAttr: 'defensa',
        minVal: 50,
        successChance: 0.35,
        successBonus: '¡TRAMPA PERFECTA! Toda la línea subió al mismo tiempo y el linier levanta la bandera. Jugada anulada.',
        failPenalty: 'La línea no salió coordinada: el delantero quedó habilitado y definió sin oposición.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 5, fans: 9 },
        effectOnFail: { prestige: -9, fans: -10, energy: 8 }
      }
    ]
  },
  {
    prompt: "Córner a favor. Subís al área rival como sueles hacer en jugadas de pelota parada, el centro viene cargado y venenoso directo a tu zona...",
    choices: [
      {
        text: 'Cabecear con toda la fuerza buscando el ángulo',
        requiredAttr: 'fisico',
        minVal: 58,
        successChance: 0.35,
        successBonus: '¡CABEZAZO DE DEFENSOR CENTRAL! Subiste como delantero y la clavaste en el ángulo. ¡GOL!',
        failPenalty: 'El cabezazo salió débil y el arquero lo controló sin problemas.',
        effectOnSuccess: { goals: 1, assists: 0, prestige: 7, fans: 18 },
        effectOnFail: { prestige: -2, fans: -1, energy: 10 }
      },
      {
        text: 'Bajarla de cabeza para el compañero mejor plantado',
        requiredAttr: 'pase',
        minVal: 48,
        successChance: 0.5,
        successBonus: '¡ASISTENCIA DE LUJO! Le bajaste el balón servido a tu compañero, que definió de primera. ¡ASISTENCIA!',
        failPenalty: 'El desvío de cabeza salió impreciso y el rival despejó sin problemas.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 4, fans: 8 },
        effectOnFail: { prestige: -3, fans: -1, energy: 0 }
      },
      {
        text: 'No arriesgar el salto y quedarte cubriendo por si hay contragolpe',
        requiredAttr: 'defensa',
        minVal: 45,
        successChance: 0.7,
        successBonus: 'Decisión conservadora: te quedaste atrás y cuando el córner se despejó, cortaste vos mismo el intento de contra rival.',
        failPenalty: 'Al quedarte atrás sin necesidad, el córner se perdió sin peligro y no aportaste nada a la jugada.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 1 },
        effectOnFail: { prestige: -1, fans: 0, energy: 0 }
      }
    ]
  },
  {
    prompt: "La línea defensiva queda desalineada tras un cambio de marca confuso, dejando un espacio peligroso entre el lateral y el central...",
    choices: [
      {
        text: 'Gritar para que la línea suba pareja y deje en offside al delantero',
        requiredAttr: 'defensa',
        minVal: 52,
        successChance: 0.5,
        successBonus: '¡TRAMPA BIEN EJECUTADA! Toda la línea reaccionó junta y el linier levanta la bandera. Jugada anulada.',
        failPenalty: 'La línea no te escuchó a tiempo: subiste solo y dejaste al delantero mano a mano con el arquero.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 8 },
        effectOnFail: { prestige: -8, fans: -9, energy: 6 }
      },
      {
        text: 'Achicar tú el hueco cubriendo la posición del compañero desubicado',
        requiredAttr: 'pase',
        minVal: 45,
        successChance: 0.55,
        successBonus: 'Cubriste bien el espacio libre y el ataque rival se quedó sin opciones claras de pase.',
        failPenalty: 'Al cubrir el hueco dejaste libre a tu propio marcado, que recibió cómodo.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 4 },
        effectOnFail: { prestige: -4, fans: -3, energy: 8 }
      },
      {
        text: 'Salir fuerte al choque para cortar antes de que se arme la jugada',
        requiredAttr: 'fisico',
        minVal: 48,
        successChance: 0.45,
        successBonus: '¡CONTUNDENCIA TOTAL! Llegaste primero y cortaste la jugada de un planchazo lícito.',
        failPenalty: 'Llegaste tarde al choque y el árbitro te sanciona con falta peligrosa cerca del área.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 9 },
        effectOnFail: { prestige: -10, fans: -11, energy: 10 },
        cardRiskOnFail: 'yellow'
      }
    ]
  }
];

const DEFENSOR_LATE: MatchDecision[] = [
  {
    prompt: "Tiro de esquina decisivo en contra en los minutos agónicos. El potente 9 contrario busca el anticipo...",
    choices: [
      {
        text: 'Ganarle el testazo aéreo saltando con potencia física',
        requiredAttr: 'fisico',
        minVal: 58,
        successChance: 0.5,
        successBonus: '¡POR EL CIELO! Volaste por encima de su marca y cabeceaste fuerte fuera del área.',
        failPenalty: 'Te ganó el choque físico; su frentazo pegó en el poste salvándonos del gol por milímetros.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 5, fans: 10 },
        effectOnFail: { prestige: -5, fans: -5, energy: 15 },
        cardRiskOnFail: 'yellow'
      },
      {
        text: 'Cerrar la trayectoria del balón con un despeje acrobático',
        requiredAttr: 'defensa',
        minVal: 60,
        successChance: 0.4,
        successBonus: '¡EXPULSIÓN DE PELOTA! Despejaste de forma espectacular robándote los aplausos.',
        failPenalty: 'Pifiaste el esférico dándole un córner nuevo al rival totalmente gratis.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 6, fans: 15 },
        effectOnFail: { prestige: -3, fans: -3, energy: 5 }
      },
      {
        text: 'Bloquear el centro del área e iniciar un pase rápido de salida',
        requiredAttr: 'pase',
        minVal: 48,
        successChance: 0.6,
        successBonus: '¡ORGANIZACIÓN IMPERIAL! Tu pase largo de reojo inicia un contragolpe directo de peligro.',
        failPenalty: 'Tu habilitación salió al lateral desaprovechando una gran recuperación defensiva.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 4, fans: 5 },
        effectOnFail: { prestige: -4, fans: -1, energy: 0 }
      }
    ]
  },
  {
    prompt: "¡Contragolpe rival 2 contra 1 en tu propia área, minutos finales, el resultado pende de un hilo!",
    choices: [
      {
        text: 'Sacrificar el cuerpo con una falta táctica calculada',
        requiredAttr: 'defensa',
        minVal: 45,
        successChance: 0.6,
        successBonus: '¡SACRIFICIO CON CABEZA FRÍA! Cortaste el avance con una falta bien calculada. Amarilla, pero peligro eliminado.',
        failPenalty: 'El árbitro interpreta que le negaste una ocasión clarísima de gol: ¡ROJA DIRECTA!',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 3, fans: 8 },
        effectOnFail: { prestige: -10, fans: -8, energy: 5 },
        cardRiskOnFail: 'red'
      },
      {
        text: 'Achicar el ángulo sin entrar al choque',
        requiredAttr: 'defensa',
        minVal: 52,
        successChance: 0.45,
        successBonus: '¡ACHIQUE PERFECTO! Le tapaste el ángulo y el remate rival se fue desviado por muy poco.',
        failPenalty: 'No lograste incomodarlo lo suficiente y definió cruzado, imposible para el arquero.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 9 },
        effectOnFail: { prestige: -8, fans: -9, energy: 8 }
      },
      {
        text: 'Intentar robar el balón limpio',
        requiredAttr: 'defensa',
        minVal: 58,
        successChance: 0.3,
        successBonus: '¡ROBO ESPECTACULAR! Le sacaste el balón limpio sin cometer falta, aplausos de todo el estadio.',
        failPenalty: 'Llegaste desprolijo, no tocaste el balón y encima el árbitro te amonesta.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 6, fans: 14 },
        effectOnFail: { prestige: -9, fans: -10, energy: 10 },
        cardRiskOnFail: 'yellow'
      }
    ]
  },
  {
    prompt: "¡DESASTRE DEFENSIVO! El delantero rival quedó completamente solo, mano a mano con tu arquero ya vencido, el gol es prácticamente un hecho. Solo llegás vos, desesperado, por detrás...",
    choices: [
      {
        text: 'Meter una entrada rompedora por detrás para evitar el gol como sea',
        requiredAttr: 'defensa',
        minVal: 40,
        successChance: 0.85,
        successBonus: '¡SACRIFICIO EXTREMO! Le cortaste las piernas antes del remate. El árbitro no duda: roja directa y expulsión, pero el gol cantado quedó evitado.',
        failPenalty: 'Ni con la entrada desesperada llegaste a tiempo: te expulsan igual y el delantero define el gol de todas formas.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: -4, fans: 6 },
        effectOnFail: { prestige: -14, fans: -12, energy: 10 },
        cardRiskOnFail: 'red'
      },
      {
        text: 'Perseguirlo intentando robarle el balón limpio sin cometer falta',
        requiredAttr: 'ritmo',
        minVal: 60,
        successChance: 0.22,
        successBonus: '¡MILAGRO DEFENSIVO! Le sacaste el balón limpio justo antes del remate, sin necesidad de falta. El estadio explota de alivio.',
        failPenalty: 'No llegaste a tocar el balón y el delantero definió sin oposición. Gol rival.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 8, fans: 20 },
        effectOnFail: { prestige: -10, fans: -9, energy: 15 }
      },
      {
        text: 'Dejarlo definir y confiar en que tu arquero reaccione',
        requiredAttr: 'pase',
        minVal: 30,
        successChance: 0.15,
        successBonus: 'Contra todo pronóstico, el arquero saca una mano milagrosa y evita el gol sin que tuvieras que arriesgar nada.',
        failPenalty: 'El delantero no perdonó: definió cruzado y el balón terminó en el fondo de la red. Gol rival.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 3 },
        effectOnFail: { prestige: -9, fans: -8, energy: 0 }
      }
    ]
  },
  {
    prompt: "Tiro libre peligroso en contra, muy cerca del área, en el epílogo del partido...",
    choices: [
      {
        text: 'Organizar la barrera al milímetro',
        requiredAttr: 'pase',
        minVal: 48,
        successChance: 0.68,
        successBonus: '¡BARRERA PERFECTA! El remate rival se estrelló contra el muro que armaste con precisión.',
        failPenalty: 'La barrera quedó mal armada y dejó un hueco que el rival aprovechó.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 6 },
        effectOnFail: { prestige: -7, fans: -7, energy: 0 }
      },
      {
        text: 'Saltar de la barrera justo antes del disparo para bloquear',
        requiredAttr: 'ritmo',
        minVal: 55,
        successChance: 0.4,
        successBonus: '¡BLOQUEO HEROICO! Saliste en el momento justo y tapaste el remate con el cuerpo.',
        failPenalty: 'Saliste demasiado pronto y dejaste un espacio libre que el rival aprovechó al instante.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 6, fans: 13 },
        effectOnFail: { prestige: -8, fans: -8, energy: 10 }
      },
      {
        text: 'Mantener posición conservadora en la barrera',
        requiredAttr: 'defensa',
        minVal: 40,
        successChance: 0.72,
        successBonus: 'Sin heroísmos, pero la barrera cumplió su función y el peligro quedó neutralizado.',
        failPenalty: 'El disparo encontró un hueco entre los cuerpos de la barrera.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 2 },
        effectOnFail: { prestige: -6, fans: -6, energy: 0 }
      }
    ]
  }
];

const ARQUERO_EARLY: MatchDecision[] = [
  {
    prompt: "¡Hay penal en contra ejecutado por el crack rival! Te mira fijamente antes de patear...",
    choices: [
      {
        text: 'Volar con reflejos felinos hacia tu derecha',
        requiredAttr: 'defensa',
        minVal: 60,
        successChance: 0.35,
        successBonus: '¡ATAJADÓN! Volaste firmemente desviando la bocha al tiro de esquina lateral.',
        failPenalty: 'Te engañó por completo pateando al centro mientras volabas a la esquina.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 8, fans: 20 },
        effectOnFail: { prestige: -2, fans: -2, energy: 5 }
      },
      {
        text: 'Lanzarte con potencia a la base del palo izquierdo',
        requiredAttr: 'fisico',
        minVal: 55,
        successChance: 0.3,
        successBonus: '¡HÉROE TOTAL! Te estiraste al límite y contuviste el disparo rasante sin dar rebote.',
        failPenalty: 'El balón te pasó rozando por debajo del codo por milímetros.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 9, fans: 25 },
        effectOnFail: { prestige: -3, fans: -2, energy: 10 }
      },
      {
        text: 'Aguantar en seco el centro del arco provocando al tirador',
        requiredAttr: 'defensa',
        minVal: 58,
        successChance: 0.25,
        successBonus: '¡PURA MENTALIDAD! Se asustó e intentó picarla, la atrapaste con una mano sonriéndole.',
        failPenalty: 'La cruzó fuerte a la red dejándote estático en el centro de la valla.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 10, fans: 30 },
        effectOnFail: { prestige: -5, fans: -4, energy: 0 }
      }
    ]
  },
  {
    prompt: "¡Mano a mano puro! El delantero rival quedó completamente solo frente a ti tras un error defensivo...",
    choices: [
      {
        text: 'Achicar el ángulo avanzando con calma',
        requiredAttr: 'defensa',
        minVal: 55,
        successChance: 0.5,
        successBonus: '¡ACHIQUE DE MANUAL! Le tapaste todo el arco y el remate se fue directo a tus manos.',
        failPenalty: 'Se la picó por encima justo cuando avanzabas. Gol imposible de evitar.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 8, fans: 22 },
        effectOnFail: { prestige: -3, fans: -3, energy: 5 }
      },
      {
        text: 'Quedarte parado esperando que defina él',
        requiredAttr: 'defensa',
        minVal: 48,
        successChance: 0.42,
        successBonus: '¡SE PUSO NERVIOSO! Al no achicarte, dudó en la definición y remató directo a tu cuerpo.',
        failPenalty: 'Definió con clase por el segundo palo, sin margen para reaccionar.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 7, fans: 18 },
        effectOnFail: { prestige: -4, fans: -4, energy: 0 }
      },
      {
        text: 'Salir a cortar el centro antes de que reciba',
        requiredAttr: 'fisico',
        minVal: 58,
        successChance: 0.35,
        successBonus: '¡ANTICIPACIÓN TOTAL! Llegaste primero al balón y cortaste el peligro antes de que definiera.',
        failPenalty: 'Calculaste mal la salida: lo tocaste a él antes que al balón. ¡PENAL Y EXPULSIÓN!',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 10, fans: 26 },
        effectOnFail: { prestige: -14, fans: -12, energy: 12 },
        cardRiskOnFail: 'red'
      }
    ]
  },
  {
    prompt: "Pase retrasado de tu defensa, con un delantero rival presionándote de inmediato en la salida...",
    choices: [
      {
        text: 'Despejar directo a las gradas sin arriesgar',
        requiredAttr: 'fisico',
        minVal: 40,
        successChance: 0.8,
        successBonus: 'Despeje sin estridencias: la pelota sale del área y el equipo respira, sin sobresaltos.',
        failPenalty: 'El despeje salió débil y quedó cerca del área, generando un córner peligroso.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 1 },
        effectOnFail: { prestige: -4, fans: -3, energy: 5 }
      },
      {
        text: 'Driblar corto al rival bajo presión',
        requiredAttr: 'regate',
        minVal: 60,
        successChance: 0.3,
        successBonus: '¡SANGRE FRÍA DE ARQUERO MODERNO! Lo dejaste en el camino con un amague corto y saliste jugando limpio.',
        failPenalty: '¡CATÁSTROFE! Te quitaron el balón dentro del área. Gol prácticamente regalado.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 8, fans: 20 },
        effectOnFail: { prestige: -16, fans: -18, energy: 8 }
      },
      {
        text: 'Lanzar un pase largo y preciso buscando el contragolpe',
        requiredAttr: 'pase',
        minVal: 55,
        successChance: 0.4,
        successBonus: '¡PELOTAZO DE ORO! El balón cayó perfecto en la carrera de tu compañero, que definió solo. ¡ASISTENCIA!',
        failPenalty: 'El pase largo se fue directo a un rival, que quedó con el balón cerca de tu área.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 7, fans: 16 },
        effectOnFail: { prestige: -6, fans: -5, energy: 0 }
      }
    ]
  },
  {
    prompt: "Ves que tus centrales dudan sobre quién marca al delantero libre en un córner que están por ejecutar...",
    choices: [
      {
        text: 'Gritar la marca exacta para cada central antes del centro',
        requiredAttr: 'defensa',
        minVal: 50,
        successChance: 0.55,
        successBonus: '¡ORGANIZACIÓN PERFECTA! Cada uno marcó a su hombre y el córner murió en un despeje tranquilo.',
        failPenalty: 'No te escucharon con el ruido del estadio y el delantero quedó completamente solo.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 7 },
        effectOnFail: { prestige: -6, fans: -6, energy: 0 }
      },
      {
        text: 'Salir tú mismo a disputar el balón aéreo por encima de todos',
        requiredAttr: 'fisico',
        minVal: 52,
        successChance: 0.4,
        successBonus: '¡SALIDA DE ORO! Ganaste el salto por encima de todos y despejaste el peligro con autoridad.',
        failPenalty: 'Calculaste mal el salto y el balón te pasó por arriba dejando el arco completamente vacío.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 6, fans: 14 },
        effectOnFail: { prestige: -14, fans: -15, energy: 10 }
      },
      {
        text: 'Confiar en la marca zonal ya acordada y quedarte en la línea',
        requiredAttr: 'pase',
        minVal: 40,
        successChance: 0.65,
        successBonus: 'La marca zonal funcionó sin sobresaltos, el córner se despejó sin que hiciera falta arriesgar.',
        failPenalty: 'La marca zonal falló y nadie llegó a la pelota: gol del rival de cabeza sin oposición.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 2 },
        effectOnFail: { prestige: -12, fans: -13, energy: 0 }
      }
    ]
  }
];

const ARQUERO_LATE: MatchDecision[] = [
  {
    prompt: "Un centro cerrado cae sobre el área chica lloviendo con muchísima rosca...",
    choices: [
      {
        text: 'Salir agresivamente a despejar con los puños firmes',
        requiredAttr: 'fisico',
        minVal: 55,
        successChance: 0.55,
        successBonus: '¡PROPIETARIO DEL ÁREA! Derribaste marcas lícitamente y mandaste el balón al círculo central.',
        failPenalty: 'Calculaste mal la trayectoria y chocaste de lleno contra un rival. El árbitro no duda en sancionarte.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 5, fans: 8 },
        effectOnFail: { prestige: -5, fans: -5, energy: 10 },
        cardRiskOnFail: 'yellow'
      },
      {
        text: 'Retroceder confiando en la velocidad de tus reflejos en línea',
        requiredAttr: 'defensa',
        minVal: 62,
        successChance: 0.65,
        successBonus: '¡GATO VOLADOR! El remate a quemarropa fue despejado milagrosamente sobre la línea de gol.',
        failPenalty: 'El cabezazo a bocajarro te batió cruzado imposible de detener.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 6, fans: 15 },
        effectOnFail: { prestige: -4, fans: -4, energy: 0 }
      },
      {
        text: 'Organizar la defensa gritando directivas con liderazgo',
        requiredAttr: 'pase',
        minVal: 45,
        successChance: 0.6,
        successBonus: '¡VOZ DE MANDO! Tus gritos ordenaron el marcaje impidiendo remates incómodos.',
        failPenalty: 'Tus defensas se confundieron chocando entre sí y regalando una opción clara.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 4, fans: 4 },
        effectOnFail: { prestige: -3, fans: -1, energy: 0 }
      }
    ]
  },
  {
    prompt: "Rebote suelto dentro del área chica tras la estirada que ya hiciste en el primer remate...",
    choices: [
      {
        text: 'Reaccionar rápido para cubrir el segundo palo',
        requiredAttr: 'defensa',
        minVal: 58,
        successChance: 0.5,
        successBonus: '¡REFLEJOS DE ACERO! Llegaste al rebote antes que nadie y sacaste una mano milagrosa.',
        failPenalty: 'No llegaste a tiempo: el rival empujó el rebote a la red vacía.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 8, fans: 20 },
        effectOnFail: { prestige: -6, fans: -6, energy: 10 }
      },
      {
        text: 'Salir a cortar el centro entre varios jugadores',
        requiredAttr: 'fisico',
        minVal: 55,
        successChance: 0.45,
        successBonus: '¡PUÑO SALVADOR! Saliste entre varios cuerpos y despejaste el peligro con autoridad.',
        failPenalty: 'Chocaste con un rival en el aire sin llegar al balón. El árbitro te amonesta.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 6, fans: 12 },
        effectOnFail: { prestige: -6, fans: -5, energy: 10 },
        cardRiskOnFail: 'yellow'
      },
      {
        text: 'Gritar para que un compañero despeje primero',
        requiredAttr: 'pase',
        minVal: 40,
        successChance: 0.65,
        successBonus: '¡VOZ DE MANDO! Tu grito ordenó al defensor justo a tiempo para despejar el rebote.',
        failPenalty: 'Nadie reaccionó a tiempo al grito y el rebote terminó en el fondo de la red.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 3, fans: 4 },
        effectOnFail: { prestige: -5, fans: -4, energy: 0 }
      }
    ]
  },
  {
    prompt: "Últimos minutos, tu equipo gana por la mínima. Saque de meta con presión altísima del rival...",
    choices: [
      {
        text: 'Sacar rápido y corto arriesgando la salida',
        requiredAttr: 'pase',
        minVal: 55,
        successChance: 0.45,
        successBonus: '¡SALIDA LETAL! El saque corto y rápido sorprendió al rival y terminó en un contragolpe que sentenció el partido. ¡ASISTENCIA!',
        failPenalty: 'El rival anticipó la salida corta y recuperó el balón peligrosamente cerca de tu área.',
        effectOnSuccess: { goals: 0, assists: 1, prestige: 8, fans: 18 },
        effectOnFail: { prestige: -8, fans: -8, energy: 5 }
      },
      {
        text: 'Sacar largo directo a despejar el peligro',
        requiredAttr: 'fisico',
        minVal: 40,
        successChance: 0.8,
        successBonus: 'Saque largo simple y efectivo: el equipo aleja el peligro sin sobresaltos.',
        failPenalty: 'El saque largo salió débil y el rival recuperó cerca de mitad de cancha.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 2, fans: 1 },
        effectOnFail: { prestige: -3, fans: -2, energy: 5 }
      },
      {
        text: 'Demorar el saque para hacer tiempo',
        requiredAttr: 'pase',
        minVal: 35,
        successChance: 0.75,
        successBonus: 'Manejo inteligente del reloj: cada segundo cuenta y el árbitro no te sanciona por la demora.',
        failPenalty: 'El árbitro te advierte por demorar el juego y encima pierdes la concentración en el saque.',
        effectOnSuccess: { goals: 0, assists: 0, prestige: 3, fans: -1 },
        effectOnFail: { prestige: -4, fans: -3, energy: 0 }
      }
    ]
  }
];

function getPositionDecision(pos: Position, min: number, usedPrompts: Set<string>): MatchDecision {
  const pools: Record<Position, { early: MatchDecision[]; late: MatchDecision[] }> = {
    Delantero: { early: DELANTERO_EARLY, late: DELANTERO_LATE },
    Mediocampista: { early: MEDIOCAMPISTA_EARLY, late: MEDIOCAMPISTA_LATE },
    Defensor: { early: DEFENSOR_EARLY, late: DEFENSOR_LATE },
    Arquero: { early: ARQUERO_EARLY, late: ARQUERO_LATE },
  };
  const pool = min < 45 ? pools[pos].early : pools[pos].late;
  // Evita repetir el mismo prompt dos veces en el mismo partido (ahora que hay 4 momentos por
  // posición, con solo 3-4 decisiones por bolsa la repetición se notaba demasiado seguido).
  const fresh = pool.filter(d => !usedPrompts.has(d.prompt));
  const candidates = fresh.length > 0 ? fresh : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Minutos de los 4 momentos clave por partido (antes eran solo 2 fijos: 24 y 71). Se reparten en
// las 4 fases del partido para que ningún tramo del relato quede vacío, con jitter random de
// unos minutos para que no se sientan como un reloj perfecto partido tras partido.
function getDecisionMinutes(): number[] {
  const jitter = () => Math.floor(Math.random() * 7) - 3; // -3 a +3
  return [16 + jitter(), 38 + jitter(), 61 + jitter(), 83 + jitter()];
}

// El jugador ya no ve el % de éxito exacto de una decisión (comparar 65% vs 35% a ojo le sacaba toda
// la tensión a la elección) -- ve una categoría de riesgo cualitativa. El motor sigue usando el
// número real (choice.successChance) para el roll en handleChoice, esto es puramente de UI.
function getRiskLabel(successChance: number): { label: string; color: string } {
  const pct = successChance * 100;
  if (pct >= 80) return { label: 'Muy seguro', color: 'text-emerald-400' };
  if (pct >= 60) return { label: 'Seguro', color: 'text-lime-400' };
  if (pct >= 40) return { label: 'Arriesgado', color: 'text-amber-400' };
  if (pct >= 20) return { label: 'Muy arriesgado', color: 'text-orange-400' };
  return { label: 'Casi imposible', color: 'text-red-500' };
}

interface MatchSimulatorProps {
  playerProfile: PlayerProfile;
  opponentName: string;
  /** Id del club rival, si se conoce. Habilita nombrar a sus figuras reales en la narración
   *  (ver getRivalSample); sin él la narración cae a "el defensor rival", como antes. */
  opponentClubId?: string | null;
  isLibertadores: boolean;
  cupId?: 'libertadores' | 'sudamericana' | null;
  uefaCupId?: 'champions' | 'europa' | null;
  /** Semana de copa sin copa continental: se juega la copa nacional del país del club. */
  isDomesticCup?: boolean;
  isWorldCup?: boolean;
  representingTeamId?: string | null; // si estás convocado a tu selección, el id del equipo del Mundial en vez de tu club
  isHome: boolean;
  myTablePosition?: number | null; // posición en la tabla de liga (1 = puntero); null si no aplica (copas/Mundial)
  rivalTablePosition?: number | null;
  leagueTeamCount?: number | null;
  lineupStatus?: 'starter' | 'substitute'; // convocatoria de la semana -- ver decideLineupStatus en App.tsx
  subEntryMinute?: number | null; // minuto en el que entrás desde el banco si lineupStatus es 'substitute'
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
    cardReceived: 'none' | 'yellow' | 'red';
    prestigeChange: number;
    fansChange: number;
  }) => void;
}

export default function MatchSimulator({
  playerProfile, opponentName, opponentClubId, isLibertadores, cupId, uefaCupId, isDomesticCup, isWorldCup, representingTeamId, isHome: isHomeProp,
  myTablePosition, rivalTablePosition, leagueTeamCount, lineupStatus, subEntryMinute, onFinishMatch
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
  const [isSentOff, setIsSentOff] = useState(false);
  const [prestigeAccum, setPrestigeAccum] = useState(0);
  const [fansAccum, setFansAccum] = useState(0);
  const [rating, setRating] = useState(6.0);

  const [matchLog, setMatchLog] = useState<MatchEvent[]>([]);
  const [activeDecision, setActiveDecision] = useState<MatchDecision | null>(null);
  const [decisionStage, setDecisionStage] = useState<'none' | 'choosing' | 'result'>('none');
  const [decisionOutcomeText, setDecisionOutcomeText] = useState('');
  const [decisionWasSuccess, setDecisionWasSuccess] = useState(false);
  const decisionMinutes = useRef(getDecisionMinutes());
  const usedPrompts = useRef(new Set<string>());

  // Banco de suplentes: si arrancás afuera, no estás "en cancha" hasta tu minuto de entrada (no
  // generás decisiones ni bonos de rating personales hasta ese momento, aunque el partido narre
  // goles/tarjetas ambientales igual). Un rendimiento flojo puede terminar en sustitución al 70'
  // (ver checkCoachSubstitution) -- una vez afuera, tu rating queda congelado, ya no jugás más.
  const [onField, setOnField] = useState(lineupStatus !== 'substitute');
  const [wasSubbedOff, setWasSubbedOff] = useState(false);
  const hasEnteredAsSubRef = useRef(false);

  const currentClub = representingTeamId
    ? WORLD_CUP_TEAMS_DATABASE.find(c => c.id === representingTeamId)!
    : CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;

  // Nombre real de la competencia que se está jugando esta semana. Antes acá se asumía siempre
  // "Copa Libertadores" para cualquier semana que no fuera liga doméstica ni Mundial, así que un
  // club europeo en Champions/Europa veía el cartel incorrecto (bug reportado: "estoy jugando la
  // champions y arriba dice copa libertadores"), y peor: el 87% de los clubes de la base no juega
  // ninguna copa continental y caía igual en ese cartel, jugando la "Libertadores" contra Boca.
  // Ahora esa rama es la copa nacional del país del club (Copa del Rey, DFB-Pokal, etc.).
  const activeCupLabel = isDomesticCup
    ? getDomesticCupName(currentClub?.league)
    : cupId === 'sudamericana'
    ? 'Copa Sudamericana'
    : cupId === 'libertadores'
    ? 'Copa Libertadores'
    : uefaCupId === 'champions'
    ? 'Champions League'
    : uefaCupId === 'europa'
    ? 'Europa League'
    // Sin ninguna copa identificada no se inventa un torneo: rótulo genérico.
    : 'Copa Nacional';

  // Año de la temporada en curso, calculado desde la semana real de la carrera. Antes estaba
  // hardcodeado "2026" en el encabezado y en el relato del partido, así que en la temporada 20 de
  // una carrera larga el partido seguía anunciándose como 2026.
  const seasonYear = CAREER_START_YEAR + getSeasonYear(playerProfile.currentWeek) - 1;

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

  // Modelo tipo Poisson (estilo FIFA) para los goles "ambientales" del partido: en vez de una
  // probabilidad fija por minuto (antes 3.2% parejo sin importar rivales), cada lado tiene un
  // lambda de goles esperados en 90' derivado de fuerza de ataque real vs. defensa rival --
  // luego se "reparte" ese lambda uniforme en 90 minutos (Poisson thinning: P(gol en el minuto)
  // = 1 - e^(-lambda/90)), así el resultado queda matemáticamente atado a qué tan buenos son
  // los dos planteles y no solo a la posición en la tabla.
  const BASE_GOALS_PER_TEAM = 1.3; // promedio real aprox. de goles por equipo en 90'
  const rosterClub = getClubWithRoster(currentClub.name);
  const repEstimate = 58 + currentClub.reputation * 6; // ~64 a 88 si el club no tiene roster real cargado
  const myAttackRating = rosterClub?.plantilla?.ofensivos?.length
    ? rosterClub.plantilla.ofensivos.reduce((sum: number, p: any) => sum + p.media_valoracion, 0) / rosterClub.plantilla.ofensivos.length
    : repEstimate;
  const myDefenseCandidates = [...(rosterClub?.plantilla?.defensivos || []), ...(rosterClub?.plantilla?.porteros || [])];
  const myDefenseRating = myDefenseCandidates.length
    ? myDefenseCandidates.reduce((sum: number, p: any) => sum + p.media_valoracion, 0) / myDefenseCandidates.length
    : repEstimate;
  // Al rival solo lo conocemos por nombre (no tenemos su plantel acá), así que su nivel se estima
  // desde su posición real en la tabla (1° = fuerte, último = débil); sin tabla comparable
  // (copas/Mundial) se asume un rival de nivel medio-alto, acorde al calibre de esos cruces.
  const rivalRating = (myTablePosition != null && rivalTablePosition != null && leagueTeamCount && leagueTeamCount > 1)
    ? 60 + (1 - (rivalTablePosition - 1) / (leagueTeamCount - 1)) * 30
    : 76;
  const ratingGapMultiplier = (gap: number) => Math.max(0.5, Math.min(2.0, 1 + gap / 50));
  const formMultiplier = fanSupportFactor * mentalHealthFactor; // moral/apoyo -- la fuerza de tabla ya la usa rivalRating, no se pisa acá
  const HOME_ADVANTAGE_GOALS = 0.15;
  const lambdaMine = BASE_GOALS_PER_TEAM * ratingGapMultiplier(myAttackRating - rivalRating) * formMultiplier
    + (isHome.current ? HOME_ADVANTAGE_GOALS : 0);
  const lambdaRival = BASE_GOALS_PER_TEAM * ratingGapMultiplier(rivalRating - myDefenseRating)
    + (isHome.current ? 0 : HOME_ADVANTAGE_GOALS);
  const totalLambda = lambdaMine + lambdaRival;

  // Fase 2.5 -- Fatiga de temporada real: muchos partidos seguidos sin una semana de descanso
  // (ver matchesWithoutRest, se resetea en App.tsx cada vez que no jugás) pasan factura en cancha.
  // No toca playerProfile.attributes de forma permanente -- es un descuento que solo se aplica acá,
  // a la hora de resolver decisiones, así que desaparece solo apenas descansás una semana.
  const FATIGUE_MATCH_THRESHOLD = 6;
  const FATIGUE_ATTR_PENALTY = 6;
  const isFatigued = playerProfile.matchesWithoutRest >= FATIGUE_MATCH_THRESHOLD;
  const effectiveAttributes: PlayerStats = isFatigued
    ? {
        ritmo: Math.max(10, playerProfile.attributes.ritmo - FATIGUE_ATTR_PENALTY),
        regate: Math.max(10, playerProfile.attributes.regate - FATIGUE_ATTR_PENALTY),
        tiro: Math.max(10, playerProfile.attributes.tiro - FATIGUE_ATTR_PENALTY),
        defensa: Math.max(10, playerProfile.attributes.defensa - FATIGUE_ATTR_PENALTY),
        pase: Math.max(10, playerProfile.attributes.pase - FATIGUE_ATTR_PENALTY),
        fisico: Math.max(10, playerProfile.attributes.fisico - FATIGUE_ATTR_PENALTY)
      }
    : playerProfile.attributes;

  // Probabilidad por minuto de que ocurra CUALQUIER gol ambiental (Poisson thinning de totalLambda
  // repartido en 90') y, dado que ocurre, qué proporción le toca a cada lado según sus lambdas --
  // reemplaza el 3.2% fijo + reparto 50/50 de antes, que no distinguía si el rival era bueno o malo.
  const goalProbPerMinute = 1 - Math.exp(-totalLambda / 90);
  const teamScoreChance = totalLambda > 0 ? lambdaMine / totalLambda : 0.5;

  const getTeammateSample = () => {
    const list = applySquadRetirements(currentClub.id, currentClub.starPlayers, playerProfile.retiredWorldPlayers)
      .map(displayName)
      .filter(p => p !== playerProfile.name);
    return list.length > 0 ? list[Math.floor(Math.random() * list.length)] : 'El volante de apoyo';
  };

  // Figuras del equipo CONTRARIO, para que la narración no hable siempre de un genérico
  // "el defensor rival" mientras a tus compañeros sí los nombra. Se resuelve por id cuando
  // App lo conoce (liga/copa) y, si no, por nombre contra la base de clubes.
  const opponentClub =
    (opponentClubId ? CLUBS_DATABASE.find(c => c.id === opponentClubId) : undefined) ??
    CLUBS_DATABASE.find(c => c.name === opponentName);

  // Los starPlayers vienen como "Fulano" o "Fulano (ST)": el sufijo de posición es útil para el
  // motor pero queda mal leído en una crónica, así que se recorta para narrar. El sufijo, cuando
  // está, sirve además para no mandar a un arquero a definir de cabeza.
  const rivalRoster = (opponentClub
    ? applySquadRetirements(opponentClub.id, opponentClub.starPlayers, playerProfile.retiredWorldPlayers).map(displayName)
    : [])
    .map(p => {
      const pos = p.match(/\(([^)]*)\)\s*$/)?.[1]?.trim().toUpperCase() ?? null;
      return { name: p.replace(/\s*\([^)]*\)\s*$/, '').trim(), pos };
    })
    .filter(r => r.name);

  const pick = (list: typeof rivalRoster): string | null =>
    list.length > 0 ? list[Math.floor(Math.random() * list.length)].name : null;

  /** Nombre de una figura rival, o null si no conocemos el plantel (Mundial, rivales genéricos). */
  const getRivalSample = (): string | null => pick(rivalRoster);

  /** Como getRivalSample pero evitando arqueros: para goles y remates. Si el plantel no trae
   *  posiciones (la mayoría de los clubes), cae al sorteo normal. */
  const getRivalAttacker = (): string | null =>
    pick(rivalRoster.filter(r => r.pos !== 'GK')) ?? getRivalSample();

  useEffect(() => {
    const estadioContexto = isHome.current ? `el estadio del ${teamName}` : `el fortín de ${opponentName}`;
    const competicionContexto = isWorldCup ? `🌎 COPA MUNDIAL FIFA ${seasonYear} 🌎` : isLibertadores ? `🏆 ${activeCupLabel.toUpperCase()} ${seasonYear} 🏆` : `🟢 ${getLeagueDisplay(currentClub.league).name.toUpperCase()} ${seasonYear} 🟢`;
    
    const kickoffLog: MatchEvent[] = [
      { minute: 0, text: `Silbatazo Inicial en ${estadioContexto}. ¡Rueda la pelota! ${competicionContexto}`, type: 'neutral' },
      { minute: 4, text: `Ambiente ensordecedor en las tribunas. El recibimiento llena el aire de color.`, type: 'neutral' }
    ];
    if (lineupStatus === 'substitute') {
      kickoffLog.push({ minute: 0, text: `📋 El técnico te deja en el banco de suplentes para arrancar este partido.`, type: 'neutral' });
    }
    setMatchLog(kickoffLog);
    // Silbatazo inicial: desactivado por ahora a pedido (ver WHISTLE_SFX_ENABLED arriba). El resto
    // de los efectos del partido siguen sonando normalmente.
    if (WHISTLE_SFX_ENABLED) playSfx('whistle');
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
    // Entrada del suplente: recién ahora empezás a jugar de verdad, el técnico te manda a la cancha.
    if (!onField && !wasSubbedOff && subEntryMinute != null && currentMin >= subEntryMinute && !hasEnteredAsSubRef.current) {
      hasEnteredAsSubRef.current = true;
      setOnField(true);
      setMatchLog(prev => [...prev, {
        minute: currentMin,
        text: `🔄 ¡Entrás vos! El técnico te manda a la cancha desde el banco de suplentes.`,
        type: 'highlight'
      }]);
    }

    // Sustitución por bajo rendimiento: si venís jugando mal (rating flojo) al llegar al minuto 70,
    // el técnico puede decidir sacarte para meter a otro jugador -- no aplica si entraste de
    // suplente vos mismo (no te van a sacar a los pocos minutos de haber entrado), NI si todavía
    // te queda alguna de las 4 decisiones del partido por delante (la última cae ~min 83): el piso
    // de "4 decisiones por partido, incluso yendo perdiendo" ya prometido al jugador no puede
    // perforarse por esta sustitución (bug reportado: te sacaban al 70' y te quedabas con 3).
    const hasPendingDecision = decisionMinutes.current.some(m => m >= currentMin);
    if (currentMin === 70 && onField && !wasSubbedOff && lineupStatus !== 'substitute' && !isSentOff && !hasPendingDecision) {
      const RATING_SUB_THRESHOLD = 5.2;
      if (rating < RATING_SUB_THRESHOLD) {
        const subChance = 0.45;
        if (Math.random() < subChance) {
          setWasSubbedOff(true);
          setOnField(false);
          setMatchLog(prev => [...prev, {
            minute: currentMin,
            text: `🔄 El técnico no está conforme con tu partido y decide sacarte de la cancha. Terminás el resto del encuentro en el banco.`,
            type: 'bad'
          }]);
        }
      }
    }

    if (currentMin === 90) {
      // Un poquito de drama de último minuto: antes de pitar el final hay una chance chica
      // (más alta que la de gol normal en cualquier otro minuto) de una jugada de tiempo agregado.
      let finalScoreHome = scoreHome;
      let finalScoreAway = scoreAway;
      const dadoFinal = Math.random();
      if (dadoFinal < 0.05) {
        const teamScores = Math.random() < teamScoreChance;
        const teammateName = getTeammateSample();
        if (teamScores) {
          if (isHome.current) finalScoreHome++; else finalScoreAway++;
          setMatchLog(prev => [...prev, {
            minute: 90,
            text: `¡GOL AGÓNICO de ${teamName}! En pleno tiempo agregado, ${teammateName} la clava para el delirio total.`,
            type: 'good'
          }]);
        } else {
          if (isHome.current) finalScoreAway++; else finalScoreHome++;
          setMatchLog(prev => [...prev, {
            minute: 90,
            text: `¡GOLPE DE GRACIA de ${opponentName}! Te la clavan en el último suspiro del partido.`,
            type: 'bad'
          }]);
        }
        setScoreHome(finalScoreHome);
        setScoreAway(finalScoreAway);
      }

      const finalResult: 'W' | 'D' | 'L' =
        (isHome.current && finalScoreHome > finalScoreAway) || (!isHome.current && finalScoreAway > finalScoreHome) ? 'W' :
        finalScoreHome === finalScoreAway ? 'D' : 'L';

      const golesMiEquipo = isHome.current ? finalScoreHome : finalScoreAway;
      const golesRival = isHome.current ? finalScoreAway : finalScoreHome;

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
          log: matchLog.map(item => `[${item.minute}'] ${item.text}`),
          cardReceived: playerCards,
          prestigeChange: prestigeAccum,
          fansChange: fansAccum
        });
      }, 1500);

      setMatchLog(prev => [...prev, {
        minute: 90,
        text: `¡FINAL DEL ENCUENTRO! Marcador definitivo: ${teamName} ${golesMiEquipo} - ${golesRival} ${opponentName}.`,
        type: 'neutral'
      }]);
      setIsPlaying(false);
      if (WHISTLE_SFX_ENABLED) playSfx('whistle_end');
      return;
    }

    if (decisionMinutes.current.includes(currentMin) && !isSentOff && onField) {
      triggerDecisionEvent(currentMin);
      return;
    }

    const dado = Math.random();

    if (dado < goalProbPerMinute) { // Poisson thinning: ver goalProbPerMinute/lambdaMine/lambdaRival arriba
      const teamScores = Math.random() < teamScoreChance;
      const teammateName = getTeammateSample();

      if (teamScores) {
        if (isHome.current) setScoreHome(prev => prev + 1); else setScoreAway(prev => prev + 1);
        setMatchLog(prev => [...prev, {
          minute: currentMin,
          text: `¡GOL de ${teamName}! Combinación magistral en el área que finaliza ${teammateName} con un remate cruzado.`,
          type: 'good'
        }]);
        // Bono chico: este gol es "ambiental" (del equipo, no tuyo), así que no debería empujar
        // tu rating casi tanto como una decisión propia con gol/asistencia real. Si estás en el
        // banco (no onField), el partido sigue pero tu ficha personal no se mueve.
        if (onField) setRating(prev => Math.min(prev + 0.15, 10.0));
      } else {
        if (isHome.current) setScoreAway(prev => prev + 1); else setScoreHome(prev => prev + 1);
        const goleadorRival = getRivalAttacker();
        setMatchLog(prev => [...prev, {
          minute: currentMin,
          text: goleadorRival
            ? `¡GOL de ${opponentName}! ${goleadorRival} aparece solo en el área y la manda al fondo de la red.`
            : `¡GOL de ${opponentName}! Desatención defensiva que el rival no perdona. Balón al fondo de la red.`,
          type: 'bad'
        }]);
        if (onField) setRating(prev => Math.max(prev - 0.2, 3.5));
      }
    } else if (dado < 0.18 && onField) {
      // VARIEDAD DE NARRATIVAS PARA MÁS INMERSIÓN -- textos en segunda persona, solo tienen
      // sentido si de verdad estás en la cancha (ver onField/lineupStatus arriba).
      const mate = getTeammateSample();
      const rival = getRivalSample();
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
        `¡Posición adelantada! Te habías escapado solo contra el portero pero el juez de línea levantó la bandera.`,
        // Solo si conocemos el plantel rival: si no, se filtran abajo y quedan las genéricas.
        ...(rival ? [
          `${rival} te gana la espalda y obliga a tu defensa a cerrar de urgencia.`,
          `Duelo áspero con ${rival} en la mitad de la cancha. Los dos se miran, ninguno baja la pierna.`,
          `${rival} pide la pelota entre líneas y desordena el bloque. Hay que salir a taparlo.`,
          `Le robás un balón limpio a ${rival} y la tribuna se levanta a aplaudirte.`,
          `¡Aviso! Remate cruzado de ${getRivalAttacker() ?? rival} que se va apenas desviado del segundo palo.`
        ] : [])
      ];
      setMatchLog(prev => [...prev, {
        minute: currentMin,
        text: jugadasDestacadas[Math.floor(Math.random() * jugadasDestacadas.length)],
        type: 'highlight'
      }]);
      setRating(prev => Math.min(prev + 0.1, 10.0));
    } else if (dado < 0.18 && !onField) {
      // Mientras estás en el banco (o ya te sacaron) el partido sigue igual -- el log no puede
      // quedar en silencio 20+ minutos solo porque no estás en cancha. Misma probabilidad que la
      // rama de arriba, pero en tercera persona (equipo/rival), sin bono de rating para vos.
      const mate = getTeammateSample();
      const rivalBanco = getRivalSample();
      const jugadasDestacadasEnBanco = [
        `${teamName} domina la posesión tocando de lado a lado en campo rival.`,
        `Fuerte choque en el medio campo. El árbitro deja seguir la jugada aplicando la ley de la ventaja.`,
        `¡UFFF! Remate de ${mate} que pasa rozando el poste derecho. Casi se abre el marcador.`,
        `${opponentName} presiona alto buscando recuperar cerca del área rival.`,
        `Tiro de esquina para ${teamName} tras un despeje apurado de la defensa rival.`,
        `¡Atajadón del arquero! Sacó un remate que tenía sello de gol.`,
        `El técnico observa desde el banco, dando indicaciones tácticas a los suplentes.`,
        `Jugada de mérito de ${mate}, que recupera un balón dividido en la mitad de la cancha.`,
        `¡Posición adelantada! El delantero se había escapado pero el juez de línea levantó la bandera.`,
        `Tiro libre peligroso para ${opponentName} cerca del área.`,
        ...(rivalBanco ? [
          `${rivalBanco} se lleva a dos rivales y saca un centro venenoso que nadie llega a empujar.`,
          `Amarilla para ${rivalBanco} por protestar una falta en la mitad de la cancha.`,
          `${rivalBanco} la pide y la reparte: es el que está manejando los tiempos del partido.`,
          `Buena reacción del arquero para taparle el mano a mano a ${rivalBanco}.`
        ] : [])
      ];
      setMatchLog(prev => [...prev, {
        minute: currentMin,
        text: jugadasDestacadasEnBanco[Math.floor(Math.random() * jugadasDestacadasEnBanco.length)],
        type: 'neutral'
      }]);
    } else if (dado < 0.21 && !isSentOff && playerCards !== 'red' && onField) {
      // Riesgo de tarjeta "ambiental": en la vida real la mayoría de las tarjetas salen de faltas
      // normales de juego, no de grandes decisiones puntuales -- esto se suma al cardRiskOnFail de
      // las decisiones de abajo para que de verdad te saquen tarjeta de vez en cuando.
      const faltasNarrativa = [
        'Llegas tarde a la disputa y le cortas el paso con la pierna extendida.',
        'Frenas un contragolpe peligroso con una falta táctica sin mucha vuelta.',
        'Chocas fuerte disputando una pelota dividida en el mediocampo.',
        'Te tiras al piso a cortar un centro y terminas llevándote puesto al rival.'
      ];
      const faltaTexto = faltasNarrativa[Math.floor(Math.random() * faltasNarrativa.length)];
      const foulRoll = Math.random();

      // Roja directa ambiental bajada de 3% a 1%: con hasta ~90 intentos por partido, un 3% se
      // sentía como que te expulsaban demasiado seguido (reporte real del usuario).
      if (foulRoll < 0.01) {
        const cardSuffix = playerCards === 'yellow' ? ' 🟨🟥 ¡SEGUNDA AMARILLA, EXPULSADO!' : ' 🟥 ¡ROJA DIRECTA, EXPULSADO!';
        setPlayerCards('red');
        setIsSentOff(true);
        setRating(prev => Math.max(prev - 2.0, 2.0));
        setMatchLog(prev => [...prev, { minute: currentMin, text: `${faltaTexto} El árbitro no duda.${cardSuffix}`, type: 'bad' }]);
      } else if (foulRoll < 0.3) {
        if (playerCards === 'yellow') {
          setPlayerCards('red');
          setIsSentOff(true);
          setRating(prev => Math.max(prev - 2.0, 2.0));
          setMatchLog(prev => [...prev, { minute: currentMin, text: `${faltaTexto} 🟨🟥 ¡SEGUNDA AMARILLA, EXPULSADO!`, type: 'bad' }]);
        } else {
          setPlayerCards('yellow');
          setRating(prev => Math.max(prev - 0.4, 2.5));
          setMatchLog(prev => [...prev, { minute: currentMin, text: `${faltaTexto} 🟨 El árbitro te muestra tarjeta amarilla.`, type: 'bad' }]);
        }
      } else {
        setMatchLog(prev => [...prev, { minute: currentMin, text: `${faltaTexto} El árbitro sanciona la falta pero no saca tarjeta.`, type: 'neutral' }]);
      }
    }
  };

  const triggerDecisionEvent = (min: number) => {
    const decision = getPositionDecision(playerProfile.position, min, usedPrompts.current);
    usedPrompts.current.add(decision.prompt);
    setActiveDecision(decision);
    setDecisionStage('choosing');
  };

  const handleChoice = (choiceIndex: number) => {
    if (!activeDecision) return;
    const choice = activeDecision.choices[choiceIndex];
    const playerAttrValue = effectiveAttributes[choice.requiredAttr];

    // Menos determinismo que antes: el bonus por tener el atributo por encima del mínimo requerido
    // pesa menos (0.007 en vez de 0.015) y el techo bajó de 0.85 a 0.72, así que ni con atributos
    // al tope una decisión se vuelve un éxito casi garantizado -- además se suma un ruido aleatorio
    // de hasta ±6% para que dos intentos idénticos no salgan siempre igual.
    const statDiff = playerAttrValue - choice.minVal;
    const randomNoise = (Math.random() - 0.5) * 0.12;
    const adjustedChance = Math.max(0.12, Math.min(0.72, (choice.successChance + (statDiff * 0.007)) * pressureMultiplier + randomNoise));

    const isSuccess = Math.random() < adjustedChance;

    // Efecto de prestigio/fans de la decisión (éxito o fallo) se acumula durante todo el
    // partido y se aplica una sola vez al perfil real cuando termina (ver onFinishMatch).
    const effect = isSuccess ? choice.effectOnSuccess : choice.effectOnFail;
    setPrestigeAccum(prev => prev + (effect.prestige || 0));
    setFansAccum(prev => prev + (effect.fans || 0));

    // Tarjetas: solo en decisiones agresivas/temerarias marcadas con cardRiskOnFail, y solo si
    // fallan. Segunda amarilla en el mismo partido = roja automática (regla real de expulsión).
    let cardLogSuffix = '';
    if (!isSuccess && choice.cardRiskOnFail && playerCards !== 'red') {
      if (choice.cardRiskOnFail === 'red' || playerCards === 'yellow') {
        cardLogSuffix = playerCards === 'yellow' ? ' 🟨🟥 ¡SEGUNDA AMARILLA, EXPULSADO!' : ' 🟥 ¡ROJA DIRECTA, EXPULSADO!';
        setPlayerCards('red');
        setIsSentOff(true);
        setRating(prev => Math.max(prev - 2.0, 2.0));
        // Expulsión: la silbatina del estadio además de la tarjeta, que es lo que la hace pesar.
        playSfx('card');
        playSfx('crowd_boo');
      } else {
        cardLogSuffix = ' 🟨 Te muestran tarjeta amarilla.';
        setPlayerCards('yellow');
        setRating(prev => Math.max(prev - 0.5, 2.5));
        playSfx('card');
      }
    }

    if (isSuccess) {
      setDecisionOutcomeText(choice.successBonus);
      setDecisionWasSuccess(true);
      setDecisionStage('result');

      if (choice.effectOnSuccess.goals > 0) {
        setPlayerGoals(prev => prev + choice.effectOnSuccess.goals);
        if (isHome.current) setScoreHome(prev => prev + choice.effectOnSuccess.goals);
        else setScoreAway(prev => prev + choice.effectOnSuccess.goals);
        playSfx('goal');
        playSfx('crowd_cheer');
      } else if (choice.effectOnSuccess.assists > 0) {
        setPlayerAssists(prev => prev + choice.effectOnSuccess.assists);
        if (isHome.current) setScoreHome(prev => prev + 1);
        else setScoreAway(prev => prev + 1);
        // Una asistencia también termina en gol del equipo: mismo festejo, sin el golpe del 'goal'
        // que se reserva para cuando la mete el jugador.
        playSfx('crowd_cheer');
      } else {
        // Decisión exitosa sin gol ni asistencia (defensiva/táctica): confirmación seca, sin estadio.
        playSfx('success');
      }

      // El bono de rating ahora depende de lo que realmente aportaste: antes cualquier decisión
      // exitosa sumaba +1.5 parejo, así que una jugada segura sin gol ni asistencia (hasta 82% de
      // éxito) rendía el mismo rating que anotar un gol (30% de éxito) -- eso permitía llegar a
      // 9.8 de rating con 0 goles y 0 asistencias. Ahora solo el aporte de gol/asistencia paga el
      // bono grande; una decisión exitosa sin estadística (defensiva/táctica) suma bastante menos.
      const decisionRatingBonus = choice.effectOnSuccess.goals > 0 ? 1.5
        : choice.effectOnSuccess.assists > 0 ? 1.2
        : 0.5;
      setRating(prev => Math.min(prev + decisionRatingBonus, 10.0));

      setMatchLog(prev => [...prev, {
        minute,
        text: `⚡ EVENTO DE DECISIÓN: ${choice.successBonus}`,
        type: 'good'
      }]);
    } else {
      setDecisionOutcomeText(choice.failPenalty + cardLogSuffix);
      setDecisionWasSuccess(false);
      setDecisionStage('result');
      setRating(prev => Math.max(prev - 1.2, 3.0));
      // Si además salió tarjeta ya sonó el 'card' arriba: encimarle el 'fail' queda a barullo.
      if (!cardLogSuffix) playSfx('fail');

      setMatchLog(prev => [...prev, {
        minute,
        text: `⚠️ EVENTO DE DECISIÓN: ${choice.failPenalty}${cardLogSuffix}`,
        type: 'bad'
      }]);
    }
  };

  // Penal y tiro libre directo en pleno partido (no la tanda de penales, ver InteractivePenaltyShootout
  // para eso): elegís dirección real en vez de un texto de acción, y el resultado se resuelve contra
  // tu atributo tiro y la adivinanza del arquero rival -- misma filosofía que la tanda, pero con
  // conversión base distinta (penal ~76% real, tiro libre directo ~12% real, mucho más difícil).
  const handleKickChoice = (direction: 'izquierda' | 'centro' | 'derecha') => {
    if (!activeDecision || !activeDecision.kickMode) return;
    const isPenalty = activeDecision.kickMode === 'penalty';
    const tiroAttr = effectiveAttributes.tiro;

    const goalkeeperGuessChance = isPenalty ? 0.35 : 0.3;
    const goalkeeperGuessedRight = Math.random() < goalkeeperGuessChance;
    const baseMissChanceIfWide = isPenalty ? 0.06 : 0.55; // en tiro libre, la barrera/palo se lleva la mayoría de los intentos aunque el arquero no adivine
    const missedRegardless = Math.random() < Math.max(0.03, baseMissChanceIfWide - (tiroAttr - 50) * 0.006);
    const saveChanceIfGuessed = Math.max(0.15, Math.min(0.6, 0.55 - (tiroAttr - 50) * 0.004));
    const saved = !missedRegardless && goalkeeperGuessedRight && Math.random() < saveChanceIfGuessed;
    const isSuccess = !missedRegardless && !saved;

    const directionLabel = direction === 'izquierda' ? 'al palo izquierdo' : direction === 'derecha' ? 'al palo derecho' : 'al centro';

    if (isSuccess) {
      const successText = isPenalty
        ? `¡GOL DE PENAL! Pateaste ${directionLabel} y la clavaste sin que el arquero pudiera hacer nada.`
        : `¡GOLAZO DE TIRO LIBRE! El disparo ${directionLabel} se coló imposible, la barrera ni se movió a tiempo.`;
      setDecisionOutcomeText(successText);
      setDecisionWasSuccess(true);
      setDecisionStage('result');
      setPlayerGoals(prev => prev + 1);
      if (isHome.current) setScoreHome(prev => prev + 1); else setScoreAway(prev => prev + 1);
      playSfx('goal');
      playSfx('crowd_cheer');
      const ratingBonus = isPenalty ? 1.3 : 2.0;
      setRating(prev => Math.min(prev + ratingBonus, 10.0));
      const prestigeGain = isPenalty ? 5 : 10;
      const fansGain = isPenalty ? 12 : 28;
      setPrestigeAccum(prev => prev + prestigeGain);
      setFansAccum(prev => prev + fansGain);
      setMatchLog(prev => [...prev, { minute, text: `⚡ EVENTO DE DECISIÓN: ${successText}`, type: 'good' }]);
    } else {
      const failText = missedRegardless
        ? (isPenalty ? 'El remate se fue desviado, afuera. Penal fallado.' : 'El disparo se estrelló en la barrera sin sorpresa.')
        : `¡ATAJADÓN! El arquero rival adivinó ${directionLabel} y contuvo el disparo.`;
      setDecisionOutcomeText(failText);
      setDecisionWasSuccess(false);
      setDecisionStage('result');
      // Errar un penal se abuchea; un tiro libre fallado es lo esperable y no merece silbatina.
      playSfx(isPenalty ? 'crowd_boo' : 'fail');
      const ratingPenalty = isPenalty ? 1.5 : 0.6;
      setRating(prev => Math.max(prev - ratingPenalty, 3.0));
      const prestigeLoss = isPenalty ? -8 : -2;
      setPrestigeAccum(prev => prev + prestigeLoss);
      setFansAccum(prev => prev + (isPenalty ? -6 : -1));
      setMatchLog(prev => [...prev, { minute, text: `⚠️ EVENTO DE DECISIÓN: ${failText}`, type: 'bad' }]);
    }
  };

  const resolveDecisionStage = () => {
    setActiveDecision(null);
    setDecisionStage('none');
    setDecisionOutcomeText('');
  };

  return (
    <div id="match-simulator" className="min-h-screen bg-slate-950 text-white flex flex-col justify-between py-6 px-4">
      
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 border-b border-slate-800 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3 lg:block lg:shrink-0">
          <div>
            <span className="text-2xs font-bold text-gold-400 uppercase tracking-widest block mb-0.5">
              {isWorldCup
                ? `🌎 Copa Mundial FIFA ${seasonYear}`
                : isLibertadores
                ? `🏆 ${activeCupLabel} ${seasonYear}`
                : `${getLeagueDisplay(currentClub.league).flag} ${getLeagueDisplay(currentClub.league).name}`}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xs px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-bold whitespace-nowrap">
                Minuto {minute}'
              </span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
              {isFatigued && (
                <span
                  className="text-2xs font-black text-burgundy-400 uppercase tracking-wider whitespace-nowrap"
                  title={`${playerProfile.matchesWithoutRest} partidos seguidos sin descanso: atributos con -${FATIGUE_ATTR_PENALTY} temporal`}
                >
                  😮‍💨 Fatigado
                </span>
              )}
              {playerCards === 'yellow' && (
                <span className="w-3 h-4 rounded-sm bg-burgundy-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] shrink-0" title="Tarjeta amarilla" />
              )}
              {playerCards === 'red' && (
                <span className="text-2xs font-black text-red-400 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                  <span className="w-3 h-4 rounded-sm bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] shrink-0" /> Expulsado
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 lg:hidden">
            <button
              onClick={() => setSpeedMultiplier(450)}
              className={`btn-fx-subtle px-2 py-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 450 ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
              title="Velocidad Normal"
            >
              1x
            </button>
            <button
              onClick={() => setSpeedMultiplier(225)}
              className={`btn-fx-subtle px-2 py-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 225 ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
              title="Velocidad Doble"
            >
              2x
            </button>
            <button
              onClick={() => setSpeedMultiplier(100)}
              className={`btn-fx-subtle px-2 py-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 100 ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
              title="Velocidad Rápida"
            >
              4x
            </button>
            <button
              onClick={() => setSpeedMultiplier(5)}
              className={`btn-fx-subtle px-2 py-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 5 ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
              title="Simulación Ultra Rápida"
            >
              Saltar
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 bg-slate-900 px-3 sm:px-5 py-2 rounded-2xl border border-slate-800 shadow-lg lg:flex-1 lg:max-w-md lg:mx-4">
          <div className="min-w-0 flex-1 text-right">
            <span className="font-black text-xs sm:text-sm block truncate">{teamName}</span>
            <span className="text-3xs text-gold-400 uppercase font-mono font-bold tracking-wider block truncate">
              Tu Equipo{myTablePosition != null && ` · ${myTablePosition}°`}
            </span>
          </div>

          <div className="shrink-0 text-lg sm:text-2xl font-black font-mono tracking-wider bg-slate-950 px-3 sm:px-3.5 py-1 rounded-xl border border-gold-500/20 text-gold-400 shadow-[0_0_15px_rgba(168,132,46,0.1)] whitespace-nowrap tabular-nums">
            {isHome.current ? scoreHome : scoreAway} - {isHome.current ? scoreAway : scoreHome}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <span className="font-black text-xs sm:text-sm block truncate">{opponentName}</span>
            <span className="text-3xs text-slate-500 uppercase font-mono tracking-wider block truncate">
              Rival{rivalTablePosition != null && ` · ${rivalTablePosition}°`}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSpeedMultiplier(450)}
            className={`btn-fx-subtle p-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 450 ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Velocidad Normal"
          >
            1x
          </button>
          <button
            onClick={() => setSpeedMultiplier(225)}
            className={`btn-fx-subtle p-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 225 ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Velocidad Doble"
          >
            2x
          </button>
          <button
            onClick={() => setSpeedMultiplier(100)}
            className={`btn-fx-subtle p-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 100 ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Velocidad Rápida"
          >
            4x
          </button>
          <button
            onClick={() => setSpeedMultiplier(5)}
            className={`btn-fx-subtle p-1.5 rounded-lg text-2xs font-bold ${speedMultiplier === 5 ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950' : 'hover:bg-slate-800 text-slate-400'}`}
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
            <span className="text-2xs text-gold-400 font-bold tracking-wider uppercase animate-pulse">
              ● Narración
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-none flex flex-col-reverse justify-start">
            {matchLog.slice().reverse().map((log, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-2xl border text-xs leading-relaxed transition-all ${
                  log.type === 'good'
                    ? 'bg-gold-950/20 border-gold-500/30 text-gold-300'
                    : log.type === 'bad'
                    ? 'bg-red-950/20 border-red-500/30 text-red-300'
                    : log.type === 'highlight'
                    ? 'bg-burgundy-950/15 border-burgundy-500/20 text-burgundy-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-mono text-2xs font-black">
                  <span>⚽ [{log.minute}']</span>
                  <span className={`uppercase px-1.5 rounded font-black text-3xs ${
                    log.type === 'good' ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-900' :
                    log.type === 'bad' ? 'bg-red-500 text-slate-900' :
                    log.type === 'highlight' ? 'bg-burgundy-500 text-slate-900' : 'bg-slate-800 text-slate-300'
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
                    <div className="inline-flex p-2 rounded-2xl bg-burgundy-500/10 border border-burgundy-500/20 text-burgundy-400 mb-2 animate-glow-pulse">
                      <Sparkles size={20} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-burgundy-500 font-mono">
                      Decisión crítica · Minuto {minute}'
                    </span>
                    <h3 className="text-sm font-extrabold text-white leading-snug mt-1 mb-2">
                      {activeDecision.prompt}
                    </h3>
                  </div>

                  {activeDecision.kickMode ? (
                    <div className="grid grid-cols-3 gap-2 pb-2">
                      {([
                        { key: 'izquierda' as const, label: 'Palo izquierdo', icon: <ArrowLeft size={18} /> },
                        { key: 'centro' as const, label: 'Al medio', icon: <ArrowUp size={18} /> },
                        { key: 'derecha' as const, label: 'Palo derecho', icon: <ArrowRight size={18} /> },
                      ]).map(d => (
                        <button
                          key={d.key}
                          onClick={() => handleKickChoice(d.key)}
                          className="btn-fx-subtle flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-burgundy-400/50 hover:bg-slate-850 text-xs font-bold text-white"
                        >
                          {d.icon}
                          {d.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 overflow-y-auto flex-1 pr-1 pb-2">
                      {activeDecision.choices.map((choice, i) => {
                        const requiredVal = effectiveAttributes[choice.requiredAttr];
                        const isPromoted = requiredVal >= choice.minVal;
                        const risk = getRiskLabel(choice.successChance);
                        return (
                          <button
                            key={i}
                            onClick={() => handleChoice(i)}
                            className="btn-fx-subtle w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all bg-slate-900 border-slate-800 hover:border-burgundy-400/50 hover:bg-slate-850 cursor-pointer shadow-sm group"
                          >
                            <div className="max-w-[70%] pr-2">
                              <p className="font-bold text-xs text-white leading-tight group-hover:text-burgundy-300 transition-colors">
                                {choice.text}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                                Riesgo: <span className={`font-bold ${risk.color}`}>{risk.label}</span>
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-800">
                                {choice.requiredAttr}: <strong className={isPromoted ? 'text-gold-400' : 'text-burgundy-500'}>{requiredVal}</strong>/{choice.minVal}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-w-sm mx-auto">
                  <div className={`inline-flex p-3 rounded-full border text-white ${decisionWasSuccess ? 'bg-gold-500/20 border-gold-500/40' : 'bg-red-500/20 border-red-500/40'}`}>
                    {decisionWasSuccess ? <Star size={28} className="text-gold-400" /> : <Skull size={28} className="text-red-400" />}
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
                    className="btn-fx mt-4 py-2 px-6 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-black text-xs tracking-widest uppercase cursor-pointer shadow-lg"
                  >
                    Volver al Partido
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            {/* Cabecera tipo "ficha de jugador": calificación grande a la izquierda, identidad a la derecha, degradado sutil para separarla visualmente del resto de la card. */}
            <div className="bg-gradient-to-br from-slate-850 to-slate-900 p-5 flex items-center gap-4 border-b border-slate-800">
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-slate-950 border-2 border-gold-500 flex flex-col items-center justify-center shadow-lg shadow-gold-500/20 px-1">
                <span className="text-[7px] sm:text-[8px] font-black text-slate-500 uppercase leading-none font-mono tracking-tighter text-center">Calificación</span>
                <span className="text-xl sm:text-2xl font-extrabold text-gold-400 leading-none mt-1.5 font-mono">
                  {rating.toFixed(1)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-3xs sm:text-2xs font-extrabold uppercase text-burgundy-400 bg-burgundy-500/15 px-2 py-0.5 rounded-full inline-block">
                  {playerProfile.position}
                </span>
                <h4 className="text-sm sm:text-base font-black text-white mt-1.5 truncate">{playerProfile.name}</h4>
                <p className="text-4xs sm:text-3xs text-slate-500 font-mono uppercase tracking-wide flex items-center gap-1 mt-0.5">
                  <Award size={10} className="text-slate-600 shrink-0" /> <span className="truncate">Temporada {String(seasonYear).slice(-2)}/{String(seasonYear + 1).slice(-2)}</span>
                </p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {!onField && !wasSubbedOff && (
                <div className="p-3 rounded-xl border border-burgundy-500/30 bg-burgundy-500/10 text-2xs text-burgundy-300 font-bold text-center flex items-center justify-center gap-2">
                  <Armchair size={14} className="shrink-0" />
                  <span>Arrancás en el banco de suplentes{subEntryMinute != null ? ` · Entrás cerca del minuto ${subEntryMinute}'` : ''}</span>
                </div>
              )}
              {wasSubbedOff && (
                <div className="p-3 rounded-xl border border-slate-700 bg-slate-950/60 text-2xs text-slate-400 font-bold text-center flex items-center justify-center gap-2">
                  <Armchair size={14} className="shrink-0" />
                  <span>El técnico te sacó de la cancha. Mirás el resto del partido desde el banco.</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                    <Target size={15} className="text-gold-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-4xs sm:text-3xs text-slate-500 uppercase font-mono font-bold block truncate">Goles</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-gold-400 block leading-tight">{playerGoals}</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-burgundy-500/10 border border-burgundy-500/20 flex items-center justify-center shrink-0">
                    <Send size={14} className="text-burgundy-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-4xs sm:text-3xs text-slate-500 uppercase font-mono font-bold block truncate">Asist.</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-burgundy-400 block leading-tight">{playerAssists}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-950/60 p-2 sm:p-3 rounded-xl border border-slate-800 text-center">
                  <BarChart3 size={14} className="text-slate-500 mx-auto mb-1" />
                  <span className="text-xs sm:text-sm font-bold font-mono text-white block leading-none whitespace-nowrap">{Math.round((rating / 10) * 85)}%</span>
                  <span className="text-4xs text-slate-500 uppercase font-mono font-bold block mt-1 leading-tight whitespace-nowrap">Pases</span>
                </div>
                <div className="bg-slate-950/60 p-2 sm:p-3 rounded-xl border border-slate-800 text-center">
                  <Footprints size={14} className="text-slate-500 mx-auto mb-1" />
                  <span className="text-xs sm:text-sm font-bold font-mono text-white block leading-none whitespace-nowrap">{(5.2 + (minute * 0.08)).toFixed(1)}km</span>
                  <span className="text-4xs text-slate-500 uppercase font-mono font-bold block mt-1 leading-tight whitespace-nowrap">Distancia</span>
                </div>
                <div className="bg-slate-950/60 p-2 sm:p-3 rounded-xl border border-slate-800 text-center">
                  <Square size={14} className="text-slate-600 mx-auto mb-1" />
                  <span className="text-xs sm:text-sm font-bold font-mono text-white block leading-none whitespace-nowrap">Ninguna</span>
                  <span className="text-4xs text-slate-500 uppercase font-mono font-bold block mt-1 leading-tight whitespace-nowrap">Tarjetas</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Lightbulb size={13} className="text-gold-400 shrink-0" /> Consejo Profesional de Táctica
            </h4>
            <p className="leading-relaxed text-2xs">
              Tus elecciones críticas están vinculadas a tus atributos actuales. Si no has entrenado lo suficiente tus atributos físicos o de pase, intenta ir por las opciones seguras para evitar pérdidas de prestigio.
            </p>
            {tablePositionFactor < 0.97 && (
              <p className="leading-relaxed text-2xs text-burgundy-400 mt-2 flex items-start gap-1.5">
                <AlertTriangle size={13} className="shrink-0 mt-0.5" /> <span>Rival mejor ubicado en la tabla: tus decisiones tienen menos margen de éxito hoy.</span>
              </p>
            )}
            {tablePositionFactor > 1.03 && (
              <p className="leading-relaxed text-2xs text-gold-400 mt-2 flex items-start gap-1.5">
                <Sparkles size={13} className="shrink-0 mt-0.5" /> <span>Rival peor ubicado en la tabla: tus decisiones tienen algo más de margen hoy.</span>
              </p>
            )}
            {playerProfile.fans < 20 && (
              <p className="leading-relaxed text-2xs text-burgundy-400 mt-2 flex items-start gap-1.5">
                <Megaphone size={13} className="shrink-0 mt-0.5" /> <span>La hinchada te viene pitando: tus decisiones tienen menos margen de éxito hoy.</span>
              </p>
            )}
            {playerProfile.fans > 80 && (
              <p className="leading-relaxed text-2xs text-gold-400 mt-2 flex items-start gap-1.5">
                <Megaphone size={13} className="shrink-0 mt-0.5" /> <span>La hinchada te banca a muerte: tus decisiones tienen algo más de margen hoy.</span>
              </p>
            )}
            {playerProfile.mentalHealth < 35 && (
              <p className="leading-relaxed text-2xs text-burgundy-400 mt-2 flex items-start gap-1.5">
                <Brain size={13} className="shrink-0 mt-0.5" /> <span>Traes la cabeza floja: tus decisiones tienen menos margen de éxito hoy.</span>
              </p>
            )}
            {playerProfile.mentalHealth > 85 && (
              <p className="leading-relaxed text-2xs text-gold-400 mt-2 flex items-start gap-1.5">
                <Brain size={13} className="shrink-0 mt-0.5" /> <span>Estás mentalmente a tope: tus decisiones tienen algo más de margen hoy.</span>
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
