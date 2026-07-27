import React from 'react';
import { PlayerProfile } from '../types';
import { Trophy, ArrowRight, Star } from 'lucide-react';

interface CareerSummaryProps {
  playerProfile: PlayerProfile;
  onContinue: () => void;
}

export default function CareerSummary({ playerProfile, onContinue }: CareerSummaryProps) {
  const stats = playerProfile.careerStats;
  const titulos = playerProfile.seasonHistory.filter(s => s.titulo).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-12 px-4 relative">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-burgundy-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur relative">
        <div className="p-6 md:p-8 bg-slate-950 border-b border-slate-800/80 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-burgundy-500/10 border border-burgundy-500/20 text-burgundy-400">
            <Trophy size={28} />
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
            Fin de una Carrera
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            {playerProfile.name} cuelga los botines a los {playerProfile.age} años. Gracias por el viaje — el césped te va a extrañar.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-3xs text-slate-500 block font-mono uppercase">Partidos</span>
              <span className="text-xl font-black text-white">{stats.partidosHistoricos}</span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-3xs text-slate-500 block font-mono uppercase">Goles</span>
              <span className="text-xl font-black text-gold-400">{stats.golesHistoricos}</span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-3xs text-slate-500 block font-mono uppercase">Asistencias</span>
              <span className="text-xl font-black text-burgundy-400">{stats.asistenciasHistoricos}</span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-3xs text-slate-500 block font-mono uppercase">Títulos</span>
              <span className="text-xl font-black text-white">{stats.campeonatos}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xs uppercase tracking-widest text-slate-400 font-black flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Star size={14} className="text-burgundy-400" /> Trayectoria
            </h3>

            {playerProfile.seasonHistory.length === 0 ? (
              <p className="text-3xs text-slate-500 font-mono uppercase py-4 text-center">Sin partidos registrados.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-800">
                <table className="w-full text-xs">
                  <thead className="bg-slate-950/80 text-3xs text-slate-500 uppercase font-mono sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2">Año</th>
                      <th className="text-left px-3 py-2">Club</th>
                      <th className="text-center px-3 py-2">PJ</th>
                      <th className="text-center px-3 py-2">Goles</th>
                      <th className="text-center px-3 py-2">Asist.</th>
                      <th className="text-left px-3 py-2">Título</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerProfile.seasonHistory.map((s, i) => (
                      <tr key={i} className={`border-t border-slate-800 ${s.titulo ? 'bg-burgundy-500/5' : ''}`}>
                        <td className="px-3 py-2 font-mono text-slate-400">{s.seasonNum}</td>
                        <td className="px-3 py-2 font-bold text-white">{s.clubName}</td>
                        <td className="px-3 py-2 text-center font-mono">{s.partidos}</td>
                        <td className="px-3 py-2 text-center font-mono text-gold-400">{s.goles}</td>
                        <td className="px-3 py-2 text-center font-mono text-burgundy-400">{s.asistencias}</td>
                        <td className="px-3 py-2 text-3xs">{s.titulo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {titulos > 0 && (
              <p className="text-3xs text-burgundy-400 font-mono uppercase text-center pt-1">
                🏆 {titulos} temporada{titulos > 1 ? 's' : ''} con título en el club
              </p>
            )}
          </div>

          <button
            onClick={onContinue}
            className="btn-fx w-full mt-2 py-4 px-5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-700 text-slate-950 font-black text-xs flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl"
          >
            Volver al Inicio <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
