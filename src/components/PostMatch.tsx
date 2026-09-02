import React, { useEffect, useRef } from 'react';
import { desvanecerSfx, playSfx } from '../audio';
import { PlayerProfile, Club } from '../types';
import { ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE, WORLD_CUP_TEAMS_DATABASE, ALL_NATIONAL_TEAMS_DATABASE } from '../data';
import { FileText, Award, DollarSign, ArrowRight, TrendingUp, Users, Calendar } from 'lucide-react';
import { anioDeCarrera } from '../dateSchedule';
import { getLeagueDisplay } from '../leagueDisplay';
import { outcomeOf } from '../matchPhoto';
import MatchPhoto from './MatchPhoto';

interface PostMatchProps {
  playerProfile: PlayerProfile;
  matchResults: {
    goles: number;
    asistencias: number;
    resultado: 'W' | 'D' | 'L';
    golesRival: number;
    golesMiEquipo: number;
    puntosExperiencia: number;
    salaryEarned: number;
    rating: number;
    log: string[];
  };
  opponentName: string;
  representingTeamId?: string | null; // si el partido fue del Mundial, el id de tu selección en vez de tu club
  /**
   * Desenlace de copa que dejó este partido, si dejó alguno.
   *
   * El diario contaba el partido pero no lo que SIGNIFICABA: te eliminaban de la Superliga y la tapa
   * hablaba de la actuación individual como cualquier otro domingo. Reportado: "me eliminaron y en
   * ningún lado dice eso". Ahora la tapa lo grita, que es lo que haría un diario de verdad.
   */
  desenlaceDeCopa?: { tipo: 'eliminado'; competicion: string; ronda?: string | null } | null;
  onContinue: () => void;
}

export default function PostMatch({ playerProfile, matchResults, opponentName, representingTeamId, desenlaceDeCopa, onContinue }: PostMatchProps) {
  // LA TRIBUNA DE DESPUÉS DEL PARTIDO: UNA DE LAS DOS, sorteada por partido.
  //
  // El estadio se apaga con el pitazo final, así que esta pantalla quedaba en silencio absoluto
  // justo después de noventa minutos de cancha llena -- y el silencio se nota más que el sonido.
  //
  // Hay dos grabaciones y suena UNA, no las dos. Se probó encadenarlas -- la corta al abrir y la
  // larga a los 3,5 s -- y estaba mal por dos motivos: encimadas suenan raro, y arrancar el segundo
  // audio con la pantalla ya dibujada trababa un momento el juego. Sorteada, cada partido tiene su
  // tribuna y ninguna se repite tanto como para cansar. Pedido: "tiene de esas 2 para escoger, en
  // uno puede sonar esa y en el otro la otra, no que las 2 suenen ahí mismo".
  //
  // El sorteo va en un ref y no en el cuerpo del componente: un re-render volvería a tirar el dado
  // y el `desvanecerSfx` de la salida apagaría la que NO está sonando.
  const laTribunaDeHoy = useRef<'post_partido' | 'post_partido_hinchada'>(
    Math.random() < 0.5 ? 'post_partido' : 'post_partido_hinchada');
  useEffect(() => {
    playSfx(laTribunaDeHoy.current);
    // AL SALIR SE CORTA, siempre. La larga dura más de un minuto: sin esto sigue sonando sobre el
    // Dashboard, y un audio que no para cuando cambiás de pantalla es de las peores cosas que le
    // puede pasar a la app (la misma regla que el ambiente del partido). Vale para las dos salidas:
    // el botón y cualquier otra que desmonte la pantalla.
    return () => desvanecerSfx(laTribunaDeHoy.current, 0.4);
  }, []);

  /**
   * Salir al vestuario: la tribuna se va apagando y recién ahí se cambia de pantalla.
   *
   * El fundido arranca ANTES de avisarle al padre, no después: cuando el padre cambia de pantalla
   * este componente se desmonta, y si el fundido dependiera de lo que pasa después del desmontaje
   * no habría nadie para hacerlo. El return del efecto de arriba es la red de seguridad para las
   * demás salidas; esto es el camino normal, y por eso se le da un fundido más largo.
   */
  const volverAlVestuario = () => {
    desvanecerSfx(laTribunaDeHoy.current, 1.2);
    onContinue();
  };

  // LA SELECCION SE BUSCA EN LA BASE DE TODAS, no solo en la del Mundial.
  //
  // WORLD_CUP_TEAMS_DATABASE tiene las 48 que clasificaron al Mundial y nada mas. La Eurocopa y la
  // Copa America las juegan selecciones que no estan ahi, asi que el find devolvia undefined -- y el
  // `!` se lo ocultaba a TypeScript. Al leer `currentClub.dt` la pantalla tiraba, React desmontaba
  // el arbol entero y la partida quedaba en blanco: se acabo la carrera.
  //
  // Medido jugando tres temporadas en las 19 ligas: CINCO carreras murieron asi en la temporada 3,
  // que es cuando aparecen la Eurocopa y la Copa America.
  //
  // Y el respaldo final no es decorativo: esta pantalla se abre despues de CADA partido, y que un
  // club o una seleccion no aparezcan en su base nunca puede costar la partida entera. Mejor un
  // cartel sin nombre de DT que una pantalla en blanco.
  const equipoDelPartido = representingTeamId
    ? (ALL_NATIONAL_TEAMS_DATABASE.find(c => c.id === representingTeamId)
      ?? WORLD_CUP_TEAMS_DATABASE.find(c => c.id === representingTeamId))
    : CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId);
  const currentClub: Club = equipoDelPartido
    ?? CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)
    ?? ({ id: '', name: '', dt: '', badgeLogoUrl: null } as unknown as Club);
  const rating = matchResults.rating;

  // Varias variantes por resultado (antes había exactamente UN titular fijo por categoría, así que
  // el "diario" leía siempre la misma frase con el nombre insertado) -- se elige una al azar cada
  // vez para que la portada se sienta como una edición nueva y no una plantilla repetida.
  const generateNewspaperLayout = () => {
    const name = playerProfile.name;
    const dt = currentClub.dt;
    const club = currentClub.name;

    const templatesByCategory: Record<string, { headline: string; body: string }[]> = {
      goles: [
        {
          headline: `¡${name.toUpperCase()} REVIENTA LA RED!`,
          body: `Con una definición soberbia del juvenil de ${playerProfile.age} años, ${club} consiguió desatar el delirio en las tribunas frente a ${opponentName}. Se habla ya de que el valor de mercado del atacante subió considerablemente tras esta exhibición ofensiva de clase mundial.`
        },
        {
          headline: `NOCHE MÁGICA: ${name.toUpperCase()} SE VISTE DE GALA`,
          body: `El gol de ${name} quedará en la memoria de la hinchada de ${club}. Un festejo eufórico cerró una actuación que ya circula en redes de punta a punta, con más de un scout tomando nota del rendimiento frente a ${opponentName}.`
        },
        {
          headline: `${name.toUpperCase()}, EL DIFERENCIAL DE ${club.toUpperCase()}`,
          body: `Cuando el partido pedía a gritos una individualidad, apareció ${name} para resolverlo. ${dt} lo destacó en la charla post partido como la pieza que rompió el equilibrio ante ${opponentName}.`
        },
        {
          headline: `GOLAZO QUE VALE ORO PARA ${club.toUpperCase()}`,
          body: `No fue un gol cualquiera: la definición de ${name} tuvo la categoría suficiente como para acaparar todos los resúmenes del fin de semana. Los hinchas de ${club} ya lo eligen entre lo mejor de la fecha.`
        }
      ],
      asistencias: [
        {
          headline: `¡${name.toUpperCase()} EL ESTRATEGA!`,
          body: `Sinfonía táctica dirigida por ${name}. Con una asistencia perfecta habilitó la victoria de su club frente al difícil bloque defensivo plantado por ${opponentName}. Los scouts internacionales anotaron su nombre en la agenda premium de inmediato.`
        },
        {
          headline: `LA VISIÓN DE ${name.toUpperCase()} DESNIVELÓ EL PARTIDO`,
          body: `Un pase que valió el resultado. ${name} leyó el partido mejor que nadie y encontró el hueco justo para desequilibrar a ${opponentName}. ${dt} destacó su generosidad para asistir en vez de buscar el gol propio.`
        },
        {
          headline: `${club.toUpperCase()} FESTEJA GRACIAS A ${name.toUpperCase()}`,
          body: `Sin figurar en la planilla de goleadores, ${name} fue el arquitecto silencioso de la victoria. Su pase decisivo frente a ${opponentName} reabre el debate sobre si es el mejor asistidor de la categoría este semestre.`
        }
      ],
      granPartido: [
        {
          headline: `CÁTEDRA Y CARÁCTER: DESTAQUE DE ${name.toUpperCase()}`,
          body: `Sin necesidad de inflar las mallas, ${name} realizó un desgaste táctico monumental, recuperando balones, ordenando la salida y asegurando los hilos del mediocampo para la alegría del cuerpo técnico liderado por ${dt}.`
        },
        {
          headline: `${name.toUpperCase()} SE HIZO GIGANTE ANTE ${opponentName.toUpperCase()}`,
          body: `No hubo estadística que le hiciera justicia al partidazo de ${name}: presencia constante, decisiones acertadas y liderazgo dentro del campo. La prensa especializada ya lo ubica entre los mejores de la fecha en ${club}.`
        },
        {
          headline: `EL RENDIMIENTO SILENCIOSO QUE SOSTUVO A ${club.toUpperCase()}`,
          body: `A veces el fútbol se gana lejos de la pelota, y esta fue una de esas noches para ${name}: cobertura, sacrificio y una lectura de partido que ${dt} elogió puntualmente en la conferencia posterior.`
        }
      ],
      victoria: [
        {
          headline: `VICTORIA SUFRIDA DEL ${club.toUpperCase()}`,
          body: `El equipo sacó adelante un encuentro sumamente áspero y táctico contra ${opponentName}. ${name} jugó un rol regular cumpliendo las directivas de vestuario sin cometer fallas garrafales. Tres puntos que valen oro en el torneo.`
        },
        {
          headline: `${club.toUpperCase()} SUMA DE A TRES Y SIGUE FIRME`,
          body: `Sin brillar de manera individual, ${name} formó parte de un colectivo que supo sufrir y quedarse con los puntos frente a ${opponentName}. ${dt} valoró sobre todo la solidez defensiva del equipo.`
        },
        {
          headline: `TRABAJO SUCIO, PUNTOS LIMPIOS PARA ${club.toUpperCase()}`,
          body: `Ni el partido más vistoso ni la mejor versión de ${name}, pero el resultado quedó del lado de ${club}. Los hinchas celebran los tres puntos ante ${opponentName} sin pedir demasiadas explicaciones.`
        }
      ],
      empate: [
        {
          headline: `EMPATE AMARGO EN EL CLÁSICO`,
          body: `Un encuentro trabado en la medular que finaliza sin ventajas para nadie. Los aficionados exigen mayor chispa ofensiva. ${name} sigue asimilando los rigores defensivos de la máxima división que exige 200% de concentración física.`
        },
        {
          headline: `${club.toUpperCase()} Y ${opponentName.toUpperCase()} SE REPARTEN LOS PUNTOS`,
          body: `Partido parejo de punta a punta que no encontró un dueño claro. ${name} tuvo sus momentos, pero no alcanzó para desnivelar. ${dt} pidió paciencia: "las rachas se cortan trabajando, no lamentándose".`
        },
        {
          headline: `IGUALDAD QUE DEJA GUSTO A POCO EN ${club.toUpperCase()}`,
          body: `El resultado no cayó mal, pero tampoco conforma. ${name} y el resto del plantel saben que ante ${opponentName} el equipo pudo dar un poco más. La próxima fecha llega rápido para revertir la sensación.`
        }
      ],
      // LO QUE HICISTE VOS, PERO EL EQUIPO PERDIO. Antes esto no existia: el diario miraba primero
      // si habias marcado y sacaba un titular de fiesta aunque el equipo se hubiera ido goleado.
      // Reportado jugando: "el periodico me halaga mucho, hasta cuando pierdes".
      golesEnDerrota: [
        {
          headline: `EL GOL DE ${name.toUpperCase()} NO ALCANZO`,
          body: `${name} hizo lo suyo y descontó, pero ${club} se fue del campo con las manos vacías ante ${opponentName}. En el vestuario nadie festejó el gol: los goles que no suman puntos se olvidan el lunes.`
        },
        {
          headline: `UN GOL PARA EL ALBUM, UNA DERROTA PARA LA TABLA`,
          body: `Se le puede reclamar poco a ${name}, que marcó y peleó hasta el final. Se le puede reclamar todo a un ${club} que volvió a perder. ${dt} habló de "errores que ya venimos arrastrando" y evitó refugiarse en la actuación individual de su delantero.`
        },
        {
          headline: `${club.toUpperCase()} CAE Y LAS PREGUNTAS SIGUEN`,
          body: `El gol de ${name} fue lo único rescatable de una noche para el olvido frente a ${opponentName}. La hinchada se fue en silencio, y el silencio, en este club, siempre es peor que el silbido.`
        }
      ],
      asistenciasEnDerrota: [
        {
          headline: `LA ASISTENCIA DE ${name.toUpperCase()}, UN CONSUELO CORTO`,
          body: `${name} habilitó el gol de ${club}, pero el equipo terminó cayendo ante ${opponentName}. "Individualmente hubo cosas buenas; colectivamente no alcanza", resumió ${dt} sin ganas de dar demasiadas vueltas.`
        },
        {
          headline: `BIEN ${name.toUpperCase()}, MAL ${club.toUpperCase()}`,
          body: `El pase de ${name} para el gol fue de las pocas jugadas dignas de repetición. El resto lo firma un equipo que no supo sostener el partido y que se va con otra derrota encima.`
        }
      ],
      // Y EL PARTIDO FLOJO, que antes tampoco tenia lugar propio: se colaba en "victoria" o
      // "empate" y salia elogioso igual. Ganar jugando mal existe, y el diario deberia decirlo.
      malPartido: [
        {
          headline: `${name.toUpperCase()}, UNA NOCHE PARA OLVIDAR`,
          body: `Perdido entre líneas, sin peso en el juego y reemplazable: ${name} tuvo uno de esos partidos que conviene no volver a ver. ${dt} lo miró más de una vez desde la raya, y no era para felicitarlo.`
        },
        {
          headline: `POCO Y NADA DE ${name.toUpperCase()} ANTE ${opponentName.toUpperCase()}`,
          body: `Ni un desborde, ni un pase que rompiera, ni una corrida que levantara a la gente. En ${club} esperan bastante más del que lleva la ${playerProfile.dorsal} en la espalda.`
        },
        {
          headline: `LA CAMISETA PESA: FLOJO PARTIDO DE ${name.toUpperCase()}`,
          body: `Hay noches en las que el fútbol no aparece, y ${name} tuvo una de ésas frente a ${opponentName}. La hinchada, que perdona mucho, esta vez lo dejó saber.`
        }
      ],
      derrota: [
        {
          headline: `TORMENTA EN EL VESTUARIO DE ${club.toUpperCase()}`,
          body: `Derrota dolorosa y críticas despiadadas del periodismo deportivo. La defensa regaló espacios letales y se le vio poca rebeldía a ${name} para remontar la cuesta frente a un ${opponentName} físicamente superior. Toca trabajar fuerte.`
        },
        {
          headline: `${club.toUpperCase()} SE VA CABIZBAJO ANTE ${opponentName.toUpperCase()}`,
          body: `Noche para el olvido en la que ${name} no logró encontrar espacios ni socios. ${dt} asumió la responsabilidad en la rueda de prensa, pero la hinchada ya pide explicaciones puntuales sobre el funcionamiento del equipo.`
        },
        {
          headline: `AUTOCRÍTICA OBLIGADA TRAS LA CAÍDA DE ${club.toUpperCase()}`,
          body: `El resultado ante ${opponentName} enciende las alarmas. ${name} reconoció después del partido que "hay que mirarse para adentro". La próxima semana de entrenamientos se perfila exigente en lo físico y en lo mental.`
        }
      ]
    };

    // El titular "gran partido" (elogio máximo sin haber convertido gol ni asistencia) antes salía
    // con solo rating >= 7.5, algo que se lograba fácil acumulando decisiones exitosas sin aporte
    // real de gol/asistencia. Ahora exige un rating mucho más alto (excepcional de verdad) para
    // que ese titular sea la excepción y no la norma en partidos sin estadísticas.
    // EL RESULTADO MANDA, y despues lo que hiciste vos.
    //
    // Antes era al reves -- se preguntaba primero por tus goles -- y por eso el diario sacaba un
    // titular de fiesta habiendo perdido 5 a 1. Reportado jugando: "me halaga mucho, hasta cuando
    // pierdes". Que te vaya bien a vos y mal al equipo NO es una buena noticia, y el diario de un
    // club no la cuenta como si lo fuera.
    //
    // Y un partido flojo tiene su propia categoria: ganar jugando mal existe, y el diario lo dice.
    const perdio = matchResults.resultado === 'L';
    const flojo = rating < 5.5;
    const category = perdio && matchResults.goles > 0 ? 'golesEnDerrota'
      : perdio && matchResults.asistencias > 0 ? 'asistenciasEnDerrota'
      : perdio ? 'derrota'
      : flojo ? 'malPartido'
      : matchResults.goles > 0 ? 'goles'
      : matchResults.asistencias > 0 ? 'asistencias'
      : rating >= 8.7 ? 'granPartido'
      : matchResults.resultado === 'W' ? 'victoria'
      : 'empate';

    const options = templatesByCategory[category];
    return options[Math.floor(Math.random() * options.length)];
  };

  const { headline: titularNormal, body } = generateNewspaperLayout();

  // El desenlace de copa MANDA sobre el titular del partido. Que te eliminen es la noticia del día;
  // tu calificación individual, al lado de eso, es una nota interior.
  // SOLO la eliminacion. El aviso de "pasaste de ronda" se saco a proposito: la ronda siguiente
  // sale de contar las llaves del cuadro, y eso da un nombre correcto solo si el cuadro tiene la
  // forma esperada. La Superliga, por ejemplo, es UNA final a ida y vuelta -- no hay ronda que
  // viene --, y en un cuadro a medio armar puede anunciar "a semifinal" estando en octavos.
  //
  // Un titular a toda pagina que dice algo falso es peor que no decir nada. Quedar eliminado, en
  // cambio, es un hecho sin ambiguedad: o seguis en la copa o no seguis.
  const headline = desenlaceDeCopa?.tipo === 'eliminado'
    ? `ELIMINADOS DE LA ${desenlaceDeCopa.competicion.toUpperCase()}`
    : titularNormal;

  // Semilla fija por partido: sin esto, cada re-render sortearía otra foto y la tapa parpadearía.
  // Se arma con datos del propio partido, así el mismo resultado siempre muestra la misma imagen.
  const photoSeed = React.useMemo(
    () => playerProfile.currentWeek * 31 + matchResults.golesMiEquipo * 7 + matchResults.golesRival * 3,
    [playerProfile.currentWeek, matchResults.golesMiEquipo, matchResults.golesRival]
  );

  // Custom DT feedback report
  const getCoachOpinion = () => {
    if (rating < 5.0) {
      return `"${playerProfile.name}, tuviste un partido sumamente displicente en el campo. Si sigues jugando sin intensidad, te irás derecho al banco de suplentes." - DT ${currentClub.dt}`;
    }
    if (rating < 6.5) {
      return `"Cumpliste con la tarea táctica básica que acordamos en la previa, pero sé que tienes talento para darnos mucho más vértigo vertical." - DT ${currentClub.dt}`;
    }
    if (rating < 8.0) {
      return `"Excelente compromiso futbolístico hoy. Mostraste el camino y tus compañeros se apoyaron en ti. Este es el camino idóneo." - DT ${currentClub.dt}`;
    }
    return `"¡Magistral! Te cargaste todo el equipo al hombro y demostraste por qué tienes destino europeo garantizado tarde o temprano." - DT ${currentClub.dt}`;
  };

  return (
    <div id="post-match-view" className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-12 px-4 relative">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-burgundy-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur relative">
        
        {/* Newspaper Gacetilla section with authentic layout */}
        <div className="p-6 md:p-8 bg-burgundy-40/10 bg-slate-950 border-b border-slate-800/80 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-burgundy-500 font-bold tracking-widest mb-4">
            {/* Año y cobertura salían fijos ("2026", "Colombia-Brasil-Arg") aunque el jugador
                estuviera en Europa y en la temporada 20 de su carrera. */}
            <span>📰 EL DIARIO DEPORTIVO {anioDeCarrera(currentClub.name, playerProfile.currentWeek)}</span>
            <span className="truncate">Edición Semanal · {getLeagueDisplay(currentClub?.league, currentClub?.division).name}</span>
          </div>

          <div className="border border-burgundy-500/20 bg-burgundy-500/5 p-5 md:p-6 rounded-2xl relative">
            <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-burgundy-500 rounded text-slate-950 font-mono text-3xs font-black tracking-tighter uppercase">
              TAPA DEL DÍA
            </span>
            <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight mb-3 border-b border-burgundy-500/10 pb-2 italic">
              {headline}
            </h1>

            {/* Foto de tapa con el marcador, al estilo de las portadas de Score Hero. La imagen
                cambia según el resultado; ver src/matchPhoto.ts para agregar fotos. */}
            <div className="mb-3">
              <MatchPhoto
                outcome={outcomeOf(matchResults.resultado)}
                golesMiEquipo={matchResults.golesMiEquipo}
                golesRival={matchResults.golesRival}
                teamName={currentClub.name}
                opponentName={opponentName}
                badgeUrl={currentClub.badgeImageUrl ?? currentClub.badgeLogoUrl ?? null}
                seed={photoSeed}
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-serif">
              {body}
            </p>
          </div>
        </div>

        {/* Real reward stats and earnings */}
        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <h3 className="text-2xs uppercase tracking-widest text-slate-400 font-black flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Award size={14} className="text-gold-400" /> Rendimiento y Recompensa
            </h3>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850 space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Puntaje de Partido (Rating)</span>
                <span className="font-mono text-sm px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold text-white">
                  {rating.toFixed(1)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Salario Semanal Cobrado</span>
                <span className="font-mono text-sm text-gold-400 font-bold">
                  +${matchResults.salaryEarned.toLocaleString()} USD
                </span>
              </div>

              {matchResults.goles > 0 || matchResults.asistencias > 0 ? (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Bono por Goles/Asistencias</span>
                  <span className="font-mono text-xs text-burgundy-400 font-bold">
                    +${((matchResults.goles * 500) + (matchResults.asistencias * 250)).toLocaleString()} USD
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between items-center border-t border-slate-850 pt-2 text-xs">
                <span className="text-slate-300 font-bold">Experiencia ganada</span>
                <span className="font-mono font-black text-gold-400">
                  +{matchResults.puntosExperiencia} XP
                </span>
              </div>
            </div>

            {/* Coach review section */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 text-xs italic text-slate-400 leading-relaxed font-serif border-l-2 border-l-gold-500">
              {getCoachOpinion()}
            </div>
          </div>

          {/* Stats progression breakdown */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xs uppercase tracking-widest text-slate-400 font-black flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <TrendingUp size={14} className="text-burgundy-400" /> Estadísticas del Partido
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-3xs font-mono uppercase">Goles</span>
                  <span className="text-lg font-bold text-white">{matchResults.goles}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-3xs font-mono uppercase">Asistencias</span>
                  <span className="text-lg font-bold text-white">{matchResults.asistencias}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-3xs font-mono uppercase">Marcador</span>
                  <span className="text-sm font-bold text-white">
                    {matchResults.golesMiEquipo} - {matchResults.golesRival}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-3xs font-mono uppercase">Resultado</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-3xs font-black uppercase ${
                    matchResults.resultado === 'W' ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' :
                    matchResults.resultado === 'D' ? 'bg-slate-800 text-slate-400' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {matchResults.resultado === 'W' ? 'Victoria' : matchResults.resultado === 'D' ? 'Empate' : 'Derrota'}
                  </span>
                </div>
              </div>

              {/* Training suggestion */}
              <div className="p-3 bg-slate-950/35 border border-slate-850 rounded-xl text-3xs text-slate-400 leading-relaxed font-mono uppercase">
                ⚙️ CONSEJO: Gasta tus dólares ganados en la tienda de lujos para reducir pasivamente tu cansancio.
              </div>
            </div>

            <button
              onClick={volverAlVestuario}
              className="btn-fx w-full mt-6 py-4 px-5 rounded-2xl bg-gold-600 text-slate-950 hover:from-gold-400 hover:to-gold-600 transition-all font-black text-xs flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl"
            >
              Regresar al Vestuario <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
