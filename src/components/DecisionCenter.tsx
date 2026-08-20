import React, { useState } from 'react';
import { Shield, Sparkles, UserCheck, AlertTriangle, ArrowRight, DollarSign, Activity } from 'lucide-react';

interface DecisionEffects {
  prestige: number;
  fans: number;
  energy: number;
  capital: number;
  suspension?: number; // partidos de sanción (casos severos: dopaje, agresiones, etc.)
  // Relación con los compañeros de plantel (ver prestigeCompaneros en PlayerProfile). Opcional:
  // solo los eventos NUEVOS de vestuario la usan -- el contenido viejo (prensa, sponsors, etc.)
  // sigue tocando únicamente prestige (DT) y fans (hinchada) como siempre.
  companeros?: number;
}

interface DecisionEvent {
  title: string;
  description: string;
  choices: {
    text: string;
    cost: number;
    outcome: string;
    effects: DecisionEffects;
  }[];
}

interface DecisionCenterProps {
  event: DecisionEvent;
  onResolve: (effects: DecisionEffects) => void;
}

export default function DecisionCenter({ event, onResolve }: DecisionCenterProps) {
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedChoiceIndex(index);
  };

  const handleConfirm = () => {
    if (selectedChoiceIndex === null) return;
    const choice = event.choices[selectedChoiceIndex];
    onResolve(choice.effects);
  };

  return (
    <div id="decision-center-view" className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-12 px-4 relative">
      {/* Stadium Light atmospheric glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-burgundy-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative backdrop-blur">
        
        {/* Header Alert Notification */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest text-burgundy-400">
          <span className="flex items-center gap-1.5 animate-pulse">
            <AlertTriangle size={14} className="text-burgundy-500" /> EVENTO EXTRA DE TRIBUNAL / CLUB
          </span>
          <span className="text-3xs text-slate-500 font-bold">Relaciones Públicas</span>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-burgundy-500/10 border border-burgundy-500/20 text-burgundy-500 mb-2">
              <Shield size={28} className="animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {event.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              {event.description}
            </p>
          </div>

          {/* Interactive choices options */}
          <div className="space-y-3 pt-2">
            {event.choices.map((choice, i) => {
              const isSelected = selectedChoiceIndex === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className={`btn-fx-subtle w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                    isSelected
                      ? 'border-gold-500 bg-gold-950/20 shadow-lg shadow-gold-900/10'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60'
                  }`}
                >
                  <div className="max-w-[75%] space-y-1">
                    <span className="text-xs font-bold text-white block">
                      {choice.text}
                    </span>
                    {isSelected && (
                      <p className="text-3xs text-gold-300 font-mono italic">
                        ↳ CONSECUENCIA: {choice.outcome}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    {choice.cost > 0 ? (
                      <span className="text-xs font-mono text-red-400 font-bold">
                        -${choice.cost.toLocaleString()}
                      </span>
                    ) : choice.cost < 0 ? (
                      <span className="text-xs font-mono text-gold-400 font-bold">
                        +${Math.abs(choice.cost).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-3xs font-mono text-slate-500 font-bold uppercase py-0.5 px-2 bg-slate-900 rounded">
                        Gratis
                      </span>
                    )}

                    <div className="flex gap-1.5 text-3xs mt-2 justify-end font-mono">
                      {choice.effects.prestige !== 0 && (
                        <span className={choice.effects.prestige > 0 ? 'text-gold-400' : 'text-red-400'}>
                          {choice.effects.prestige > 0 ? '+' : ''}{choice.effects.prestige} Rep
                        </span>
                      )}
                      {choice.effects.fans !== 0 && (
                        <span className={choice.effects.fans > 0 ? 'text-burgundy-400' : 'text-red-450'}>
                          {choice.effects.fans > 0 ? '+' : ''}{choice.effects.fans} Fan
                        </span>
                      )}
                      {!!choice.effects.companeros && (
                        <span className={choice.effects.companeros > 0 ? 'text-sky-400' : 'text-red-400'}>
                          {choice.effects.companeros > 0 ? '+' : ''}{choice.effects.companeros} Plantel
                        </span>
                      )}
                      {!!choice.effects.suspension && (
                        <span className="text-red-500 font-black">
                          🚫 {choice.effects.suspension} PJ Sanción
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Accept / Confirm button */}
          <button
            onClick={handleConfirm}
            disabled={selectedChoiceIndex === null}
            className={`btn-fx w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl border transition-all ${
              selectedChoiceIndex === null
                ? 'bg-slate-800/50 border-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gold-500 hover:bg-gold-400 transition-colors border-gold-400 text-slate-950 cursor-pointer'
            }`}
          >
            Confirmar Acción <UserCheck size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
