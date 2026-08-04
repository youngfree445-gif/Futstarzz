import React from 'react';
import { PlayerProfile, Club } from '../types';
import { Star, Camera } from 'lucide-react';
import ClubBadge from './ClubBadge';

interface CareerCardProps {
  playerProfile: PlayerProfile;
  club: Club | undefined;
}

// Tarjeta de colección de la carrera, pensada para capturarse con el pantallazo nativo del
// dispositivo (no genera un archivo descargable -- los escudos vienen de hotlinks externos sin
// CORS habilitado, así que capturarlos con canvas y exportarlos como PNG falla con un
// SecurityError del navegador; esta pantalla evita el problema por completo).
export default function CareerCard({ playerProfile, club }: CareerCardProps) {
  const stats = playerProfile.careerStats;
  const titulos = playerProfile.seasonHistory.filter(s => s.titulo).length;

  return (
    <div className="space-y-3">
      <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-3xl overflow-hidden border-2 border-gold-500/40 shadow-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-burgundy-500/10 rounded-full blur-3xl" />

        <div className="relative h-full flex flex-col p-5">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-black uppercase tracking-[0.2em] text-gold-500">
              Fut Starzz
            </span>
            {club && <ClubBadge club={club} size={34} className="rounded-lg" />}
          </div>

          <div className="mt-6 text-center">
            <p className="text-3xs font-mono uppercase tracking-widest text-slate-500">{playerProfile.position}</p>
            <h2 className="text-2xl font-black uppercase text-white leading-none mt-1 text-balance">
              {playerProfile.name}
            </h2>
            {club && <p className="text-2xs text-slate-400 mt-1">{club.name}</p>}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-3xs text-slate-500 block font-mono uppercase">PJ</span>
              <span className="text-lg font-black text-white">{stats.partidosHistoricos}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-3xs text-slate-500 block font-mono uppercase">Goles</span>
              <span className="text-lg font-black text-gold-400">{stats.golesHistoricos}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-3xs text-slate-500 block font-mono uppercase">Asist.</span>
              <span className="text-lg font-black text-burgundy-400">{stats.asistenciasHistoricos}</span>
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {Object.entries(playerProfile.attributes).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-3xs text-slate-500 font-mono uppercase w-14 shrink-0">{key}</span>
                <div className="flex-1 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-gold-600 to-gold-400 h-full rounded-full" style={{ width: `${(val / 99) * 100}%` }} />
                </div>
                <span className="text-3xs font-mono font-black text-gold-400 w-6 text-right">{val}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 flex items-center justify-center gap-1.5 text-gold-400">
            <Star size={13} fill="currentColor" />
            <span className="text-xs font-black uppercase tracking-wide">
              {titulos > 0 ? `${titulos} título${titulos > 1 ? 's' : ''} ganado${titulos > 1 ? 's' : ''}` : 'En busca del primer título'}
            </span>
          </div>
        </div>
      </div>

      <p className="text-3xs text-slate-500 font-mono uppercase text-center flex items-center justify-center gap-1.5">
        <Camera size={12} /> Capturá la pantalla para guardar tu tarjeta
      </p>
    </div>
  );
}
