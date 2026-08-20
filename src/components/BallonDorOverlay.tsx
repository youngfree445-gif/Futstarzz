import { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';

// Ceremonia anual del Balón de Oro (Fase 7 del plan de mejoras): antes era un logro silencioso
// (ver ACHIEVEMENTS_DATABASE), esto lo convierte en un evento narrado con ranking de candidatos y
// desenlace de ganar/quedar 2°/3°. Mismo patrón visual/estructural que SeasonEndOverlay.

export interface BallonDorInfo {
  year: number;
  playerName: string;
  /** 1 = ganaste, 2/3 = quedaste en ese puesto, null/otro = no estuviste entre los candidatos. */
  rank: number | null;
  winnerName: string;
  candidates: { name: string; clubName: string }[];
}

interface BallonDorOverlayProps {
  info: BallonDorInfo;
  onClose: () => void;
}

export default function BallonDorOverlay({ info, onClose }: BallonDorOverlayProps) {
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

  const won = info.rank === 1;
  const headline = won
    ? '¡Ganaste el Balón de Oro!'
    : info.rank === 2 || info.rank === 3
    ? `Quedaste ${info.rank}° en la votación`
    : 'Gala del Balón de Oro';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Balón de Oro ${info.year}`}
    >
      <div
        className={`relative w-full max-w-md bg-slate-900 border border-gold-500/30 rounded-2xl p-7 text-center shadow-2xl transition-all duration-500 ${
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

        <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${
          won ? 'bg-gold-500 hover:bg-gold-400 transition-colors' : 'bg-gradient-to-br from-slate-700 to-slate-800'
        }`}>
          <Trophy size={36} className={won ? 'text-slate-950' : 'text-gold-400'} />
        </div>

        <p className="mt-5 text-2xs font-mono font-black uppercase tracking-[0.2em] text-gold-500">
          Balón de Oro {info.year}
        </p>
        <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white leading-none text-balance">
          {headline}
        </h2>

        {!won && (
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            El ganador fue <span className="font-bold text-gold-400">{info.winnerName}</span>.
          </p>
        )}

        <div className="mt-5 space-y-1.5 text-left">
          <p className="text-3xs font-mono uppercase tracking-widest text-slate-500 mb-2">Top candidatos</p>
          {info.candidates.slice(0, 5).map((c, i) => (
            <div
              key={c.name}
              className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs ${
                c.name === info.playerName ? 'bg-gold-950/30 border border-gold-500/30' : 'bg-slate-950/60'
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-3xs font-mono text-slate-500 w-5 shrink-0">{i + 1}°</span>
                <span className={`truncate font-bold ${c.name === info.playerName ? 'text-gold-400' : 'text-white'}`}>{c.name}</span>
              </span>
              <span className="text-3xs text-slate-500 truncate">{c.clubName}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-fx mt-7 w-full py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-black uppercase tracking-wide text-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
