import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Gacetilla de arranque de temporada, mismo estilo "tapa de diario" que PostMatch. Se muestra al
// tocar "Finalizar Temporada": es el aviso explícito de que el año terminó y arranca uno nuevo --
// pedido del usuario, para no dejar que la carrera pase al año siguiente sin que el jugador se
// entere ("puedes hacer que salga un periodico... diciendo que inicia la temporada").

export interface NewSeasonInfo {
  clubName: string;
  year: number;
  badgeUrl?: string | null;
}

interface NewSeasonOverlayProps {
  info: NewSeasonInfo;
  onClose: () => void;
}

export default function NewSeasonOverlay({ info, onClose }: NewSeasonOverlayProps) {
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

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Arranca la temporada ${info.year}`}
    >
      <div
        className={`relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center z-10"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <div className="p-6 md:p-8 bg-slate-950 border-b border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-mono text-gold-500 font-bold tracking-widest mb-4">
            <span>📰 EL DIARIO DEPORTIVO {info.year}</span>
            <span className="truncate">Edición Especial</span>
          </div>

          <div className="border border-gold-500/20 bg-gold-500/5 p-5 md:p-6 rounded-2xl relative">
            <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-gold-500 rounded text-slate-950 font-mono text-3xs font-black tracking-tighter uppercase">
              TAPA DEL DÍA
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-3 border-b border-gold-500/10 pb-2 italic">
              ¡Arranca la temporada {info.year}!
            </h1>

            {info.badgeUrl && (
              <img src={info.badgeUrl} alt="" className="w-16 h-16 object-contain mx-auto my-4" />
            )}

            <p className="text-xs text-slate-300 leading-relaxed font-serif">
              Pasada la última fecha del año, el fútbol vuelve a foja cero. {info.clubName} ya piensa
              en lo que viene: pretemporada, refuerzos y un calendario nuevo por delante. La afición
              vuelve a soñar.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 text-center">
          <button
            type="button"
            onClick={onClose}
            className="btn-fx w-full py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-black uppercase tracking-wide text-sm"
          >
            Empezar la temporada {info.year}
          </button>
        </div>
      </div>
    </div>
  );
}
