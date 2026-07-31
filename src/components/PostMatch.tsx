import React from 'react';
import { PlayerProfile, Club } from '../types';
import { ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE, WORLD_CUP_TEAMS_DATABASE } from '../data';
import { FileText, Award, DollarSign, ArrowRight, TrendingUp, Users, Calendar } from 'lucide-react';
import { CAREER_START_YEAR, getSeasonYear } from '../leagueEngine';
import { getLeagueDisplay } from '../leagueDisplay';

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
  onContinue: () => void;
}

export default function PostMatch({ playerProfile, matchResults, opponentName, representingTeamId, onContinue }: PostMatchProps) {
  const currentClub = representingTeamId
    ? WORLD_CUP_TEAMS_DATABASE.find(c => c.id === representingTeamId)!
    : CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
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
    const category = matchResults.goles > 0 ? 'goles'
      : matchResults.asistencias > 0 ? 'asistencias'
      : rating >= 8.7 ? 'granPartido'
      : matchResults.resultado === 'W' ? 'victoria'
      : matchResults.resultado === 'D' ? 'empate'
      : 'derrota';

    const options = templatesByCategory[category];
    return options[Math.floor(Math.random() * options.length)];
  };

  const { headline, body } = generateNewspaperLayout();

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

      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur relative">
        
        {/* Newspaper Gacetilla section with authentic layout */}
        <div className="p-6 md:p-8 bg-burgundy-40/10 bg-slate-950 border-b border-slate-800/80 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-burgundy-500 font-bold tracking-widest mb-4">
            {/* Año y cobertura salían fijos ("2026", "Colombia-Brasil-Arg") aunque el jugador
                estuviera en Europa y en la temporada 20 de su carrera. */}
            <span>📰 EL DIARIO DEPORTIVO {CAREER_START_YEAR + getSeasonYear(playerProfile.currentWeek) - 1}</span>
            <span className="truncate">Edición Semanal · {getLeagueDisplay(currentClub?.league).name}</span>
          </div>

          <div className="border border-burgundy-500/20 bg-burgundy-500/5 p-5 md:p-6 rounded-2xl relative">
            <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-burgundy-500 rounded text-slate-950 font-mono text-3xs font-black tracking-tighter uppercase">
              TAPA DEL DÍA
            </span>
            <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight mb-3 border-b border-burgundy-500/10 pb-2 italic">
              {headline}
            </h1>
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
              onClick={onContinue}
              className="btn-fx w-full mt-6 py-4 px-5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-700 text-slate-950 hover:from-gold-400 hover:to-gold-600 transition-all font-black text-xs flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl"
            >
              Regresar al Vestuario <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
