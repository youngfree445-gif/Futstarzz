import { useEffect, useState } from 'react';
import { ChevronsUp, Flag, X } from 'lucide-react';

// Pantalla de cierre de temporada/torneo para cuando NO saliste campeón (si saliste, la que se
// muestra es ChampionOverlay). Antes el torneo terminaba en silencio: la tabla se congelaba, el
// motor arrancaba la temporada siguiente, y el jugador seguía jugando sin enterarse de que ya había
// pasado el corte -- ni su posición final, ni si quedó eliminado de una copa. Bug reportado: "el
// jugador jamás se da cuenta [de que terminó la temporada]".

export interface SeasonEndInfo {
  /** "Liga BetPlay Dimayor", "Copa Libertadores"... */
  competition: string;
  clubName: string;
  /** "Apertura 2026", "Temporada 2026"... */
  season: string;
  badgeUrl?: string | null;
  /** Posición final en la tabla, si aplica (liga con tabla). Null en copas de eliminación directa. */
  finalPosition?: number | null;
  totalTeams?: number | null;
  /** true si el cierre fue por eliminación en una copa de bracket, no por fin de fase de tabla. */
  eliminated?: boolean;
  /** Ronda en la que quedaste eliminado ("Cuartos de Final"), solo si eliminated es true. */
  eliminatedRound?: string | null;
  /**
   * true si con este partido pasaste de ronda.
   *
   * NO se usa para un titular. Se probo y se saco: el nombre de la ronda siguiente sale de contar
   * las llaves del cuadro, y eso solo acierta si el cuadro tiene la forma esperada -- la Superliga
   * es UNA final a ida y vuelta y no tiene "ronda que viene". Anunciar "a semifinal" estando en
   * octavos es peor que no anunciar nada. Queda el dato por si algun dia se muestra de una forma
   * que no dependa de adivinar el nombre.
   */
  avanzo?: boolean;
  rondaSiguiente?: string | null;
  /**
   * La copa a la que BAJÁS. El tercero de un grupo de Libertadores no queda afuera: pasa a la
   * Sudamericana y sigue jugando ahí.
   *
   * Va como aviso APARTE del de eliminación, no mezclado: primero se cierra la Libertadores -- que
   * sí terminó para vos -- y después se anuncia que el año internacional sigue. Son dos cosas
   * distintas y decirlas juntas convierte una eliminación en un premio.
   */
  bajaA?: string;
}

interface SeasonEndOverlayProps {
  info: SeasonEndInfo;
  onClose: () => void;
}

export default function SeasonEndOverlay({ info, onClose }: SeasonEndOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // PASAR DE RONDA NO ES UN CIERRE, y esta pantalla es la de los cierres. El caso `avanzo` no
  // estaba contemplado en ninguna de las tres ramas de abajo, así que caía al último respaldo y
  // anunciaba "Torneo finalizado · cierra su participación en Concacaf Champions Cup" al que
  // acababa de clasificar. Reportado: "me salió que mi participación en el torneo había finalizado
  // cuando gané por paliza en el global contra Cincinnati" -- 3-2 en la ida y 9-0 en la vuelta.
  //
  // La ronda a la que pasás sigue sin nombrarse a propósito (ver rondaSiguiente en SeasonEndInfo):
  // el nombre sale de contar llaves y no acierta en los cuadros que no tienen la forma esperada.
  // Decir "pasaste de ronda" sin nombrarla es cierto siempre.
  const headline = info.bajaA
    ? 'Seguís en carrera'
    : info.avanzo
    ? 'Pasaste de ronda'
    : info.eliminated
    ? `Eliminado en ${info.eliminatedRound ?? 'la eliminatoria'}`
    : info.finalPosition === 1
    ? 'Campeón' // no debería pasar (eso lo cubre ChampionOverlay), pero por las dudas no dice "sin título"
    : info.finalPosition
    ? `${info.finalPosition}° lugar`
    : 'Torneo finalizado';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={info.bajaA ? `Pasás a la ${info.bajaA}` : info.avanzo ? `Clasificado en ${info.competition}` : `Fin de ${info.competition}`}
    >
      <div
        className={`relative w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-2xl p-7 text-center shadow-2xl transition-all duration-500 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        {/* La bandera gris es el gesto de "se terminó". Con ella arriba, el aviso de que pasás de
            ronda se leía como una despedida antes de que el jugador llegara a leer el texto. */}
        <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg ${
          info.avanzo || info.bajaA ? 'from-emerald-500 to-emerald-600' : 'from-slate-700 to-slate-800'
        }`}>
          {info.avanzo || info.bajaA
            ? <ChevronsUp size={36} className="text-white" />
            : <Flag size={36} className="text-slate-300" />}
        </div>

        <p className="mt-5 text-2xs font-mono font-black uppercase tracking-[0.2em] text-slate-400">
          {info.season}
        </p>
        <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white leading-none text-balance">
          {headline}
        </h2>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          <span className="font-bold text-white">{info.clubName}</span>{' '}
          {info.bajaA ? 'pasa a la' : info.avanzo ? 'sigue en carrera en' : 'cierra su participación en'}{' '}
          <span className="font-bold text-slate-200">{info.bajaA ?? info.competition}</span>
          {!info.eliminated && !info.avanzo && !info.bajaA && info.finalPosition && info.totalTeams
            ? <> en el puesto <span className="font-bold text-white">{info.finalPosition}</span> de {info.totalTeams}.</>
            : '.'}
        </p>

        {info.badgeUrl && (
          <img src={info.badgeUrl} alt="" className="w-14 h-14 object-contain mx-auto mt-5 opacity-80" />
        )}

        <button
          type="button"
          onClick={onClose}
          className="btn-fx mt-7 w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-wide text-sm border border-slate-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
