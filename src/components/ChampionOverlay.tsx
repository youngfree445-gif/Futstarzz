import { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';

// Pantalla de festejo al salir campeón. Aparece encima de todo, y se queda hasta que el jugador la
// cierra: ganar un título es el momento más importante de una temporada y no puede pasar como un
// toast de tres segundos.

export interface ChampionInfo {
  /** "Liga BetPlay Dimayor", "Copa Libertadores"... */
  competition: string;
  clubName: string;
  season: string;
  badgeUrl?: string | null;
}

interface ChampionOverlayProps {
  info: ChampionInfo;
  playerName: string;
  onClose: () => void;
}

// Confeti dorado. Se generan una sola vez con posiciones fijas para que no salten en cada render.
const CONFETTI = Array.from({ length: 44 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i % 11) * 0.22,
  duration: 2.6 + ((i * 7) % 18) / 10,
  size: 5 + (i % 4) * 3,
  rota: (i * 53) % 360,
  tono: ['#fbbf24', '#f59e0b', '#fcd34d', '#fef3c7'][i % 4],
}));

export default function ChampionOverlay({ info, playerName, onClose }: ChampionOverlayProps) {
  const [visible, setVisible] = useState(false);

  // Un frame de retraso para que la transición de entrada se vea (si se monta ya visible, el
  // navegador no anima).
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Escape cierra, como cualquier modal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Campeón de ${info.competition}`}
    >
      {/* Confeti. Se apaga solo si el jugador pidió menos movimiento en el sistema. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none motion-reduce:hidden" aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute top-[-12%] rounded-[1px] animate-[champion-fall_linear_infinite]"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 1.7,
              background: c.tono,
              transform: `rotate(${c.rota}deg)`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative w-full max-w-md bg-slate-900 border border-gold-500/40 rounded-3xl p-7 text-center shadow-2xl shadow-gold-950/40 transition-all duration-500 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        {/* El trofeo NO rebota. Un rebote es el gesto de una app infantil; lo que corresponde acá
            es el de una vitrina: la pieza quieta, un resplandor detrás y una luz que la cruza una
            vez. Tampoco lleva hover -- no es un botón, y ofrecer una reacción al mouse en algo que
            no se puede tocar es una promesa falsa. */}
        <div className="anim-vitrina relative w-20 h-20 mx-auto rounded-2xl bg-gold-500 flex items-center justify-center shadow-[0_0_40px_-4px_var(--color-gold-500,#a8842e)]">
          <Trophy size={40} className="text-slate-950" />
        </div>

        <p className="mt-5 text-2xs font-mono font-black uppercase tracking-[0.2em] text-gold-400">
          {info.season}
        </p>
        <h2 className="mt-1.5 text-3xl font-black uppercase tracking-tight text-white leading-none text-balance">
          ¡Campeones!
        </h2>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          <span className="font-bold text-white">{info.clubName}</span> se consagra campeón de{' '}
          <span className="font-bold text-gold-400">{info.competition}</span>.
        </p>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          {playerName}, tu nombre queda en la historia del club.
        </p>

        {info.badgeUrl && (
          <img src={info.badgeUrl} alt="" className="w-14 h-14 object-contain mx-auto mt-5 drop-shadow" />
        )}

        <button
          type="button"
          onClick={onClose}
          className="btn-fx mt-7 w-full py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-black uppercase tracking-wide text-sm"
        >
          Levantar la copa
        </button>
      </div>
    </div>
  );
}
