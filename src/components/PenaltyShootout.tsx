import React, { useEffect, useState } from 'react';
import { PenaltyShootoutResult } from '../types';
import { Target, Trophy, Skull } from 'lucide-react';

interface PenaltyShootoutProps {
  shootout: PenaltyShootoutResult;
  myClubId: string;
  myClubName: string;
  rivalClubName: string;
  onContinue: () => void;
}

export default function PenaltyShootout({ shootout, myClubId, myClubName, rivalClubName, onContinue }: PenaltyShootoutProps) {
  const [revealed, setRevealed] = useState(0);
  const isDone = revealed >= shootout.kicks.length;
  const iWon = shootout.winnerId === myClubId;

  useEffect(() => {
    if (revealed >= shootout.kicks.length) return;
    const timer = setTimeout(() => setRevealed(prev => prev + 1), 850);
    return () => clearTimeout(timer);
  }, [revealed, shootout.kicks.length]);

  const shownKicks = shootout.kicks.slice(0, revealed);
  const scoreA = shownKicks.filter(k => k.clubId === shootout.clubAId && k.scored).length;
  const scoreB = shownKicks.filter(k => k.clubId === shootout.clubBId && k.scored).length;
  const myScore = shootout.clubAId === myClubId ? scoreA : scoreB;
  const rivalScore = shootout.clubAId === myClubId ? scoreB : scoreA;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-12 px-4 relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-burgundy-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest text-burgundy-400">
          <span className="flex items-center gap-1.5">
            <Target size={14} /> Tanda de Penales
          </span>
          <span className="text-3xs text-slate-500 font-bold">Definición por Penales</span>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-center gap-6">
            <div className="text-right">
              <span className="font-black text-sm block">{myClubName}</span>
              <span className="text-3xs text-gold-400 uppercase font-mono font-bold tracking-wider">Tu Equipo</span>
            </div>
            <div className="text-3xl font-black font-mono tracking-wider bg-slate-950 px-4 py-1.5 rounded-xl border border-burgundy-500/20 text-burgundy-400 shadow-[0_0_15px_rgba(159,18,57,0.1)]">
              {myScore} - {rivalScore}
            </div>
            <div className="text-left">
              <span className="font-black text-sm block">{rivalClubName}</span>
              <span className="text-3xs text-slate-500 uppercase font-mono tracking-wider">Rival</span>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {shownKicks.map((kick, i) => {
              const isMine = kick.clubId === myClubId;
              return (
                <div
                  key={i}
                  className={`animate-fade-in p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                    kick.scored
                      ? 'bg-gold-950/20 border-gold-500/30 text-gold-300'
                      : 'bg-red-950/20 border-red-500/30 text-red-300'
                  }`}
                >
                  <span>
                    Tiro {i + 1} · {isMine ? myClubName : rivalClubName}
                  </span>
                  <span className="font-mono uppercase text-3xs">{kick.scored ? '⚽ GOL' : '🧤 ATAJADO/AFUERA'}</span>
                </div>
              );
            })}
          </div>

          {isDone && (
            <div className="text-center space-y-3 pt-2">
              <div className={`inline-flex p-3 rounded-full border ${iWon ? 'bg-gold-500/20 border-gold-500/40' : 'bg-red-500/20 border-red-500/40'}`}>
                {iWon ? <Trophy size={28} className="text-gold-400" /> : <Skull size={28} className="text-red-400" />}
              </div>
              <h3 className="text-base font-black text-white leading-snug">
                {iWon
                  ? `¡${myClubName} avanza de ronda por penales!`
                  : `${rivalClubName} los elimina en la tanda de penales.`}
              </h3>
              <button
                onClick={onContinue}
                className="btn-fx mt-2 py-2 px-6 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-slate-950 font-black text-xs tracking-widest uppercase cursor-pointer shadow-lg"
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
