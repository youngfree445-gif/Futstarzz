import React, { useEffect, useState } from 'react';
import { PlayerProfile } from '../types';
import { Trophy, Play, RefreshCw, Trash2, Calendar, Star, DollarSign, Award, Flame, Disc, Coins, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStartNew: (slotId: string) => void;
  onLoadGame: (savedState: PlayerProfile, slotId: string) => void;
}

interface SlotState {
  id: string;
  label: string;
  profile: PlayerProfile | null;
}

export default function WelcomeScreen({ onStartNew, onLoadGame }: WelcomeScreenProps) {
  const [slots, setSlots] = useState<SlotState[]>([
    { id: 'slot_1', label: 'Partida Guardada I', profile: null },
    { id: 'slot_2', label: 'Partida Guardada II', profile: null },
    { id: 'slot_3', label: 'Partida Guardada III', profile: null },
  ]);

  const [activeTab, setActiveTab] = useState<'saves' | 'awards'>('saves');

  // Carga las 3 ranuras de guardado en el almacenamiento local
  useEffect(() => {
    const loadedSlots = slots.map(slot => {
      const saved = localStorage.getItem(`futbol_star_save_${slot.id}`);
      if (saved) {
        try {
          return { ...slot, profile: JSON.parse(saved) as PlayerProfile };
        } catch (e) {
          console.error(`Error cargando ranura ${slot.id}`, e);
        }
      }
      return { ...slot, profile: null };
    });
    setSlots(loadedSlots);
  }, []);

  const handleDeleteSave = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que quieres borrar esta partida guardada? Todo tu historial, dinero y balones de oro se perderán en esta ranura.')) {
      localStorage.removeItem(`futbol_star_save_${slotId}`);
      localStorage.removeItem(`futbol_star_shop_${slotId}`);
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, profile: null } : s));
    }
  };

  return (
    <div id="welcome-screen" className="flex flex-col items-center justify-start min-h-screen bg-slate-950 text-white relative px-4 pb-12 pt-16 overflow-x-hidden">
      {/* Luces abstractas de fondo estilo estadio */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Logotipo y Título Principal */}
      <div className="text-center relative z-10 max-w-lg mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-slate-900/80 backdrop-blur border border-white/10 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.25)] mb-6">
          <span className="text-3xl">⚽</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
          Fut <span className="text-emerald-400">Starzz</span>
        </h1>

        <div className="inline-flex items-center gap-1 mt-3.5 px-2.5 py-0.5 rounded-full border border-slate-700/70 bg-slate-900/60 text-slate-400 text-[10px] font-medium tracking-wide">
          Beta
        </div>

        <p className="text-sm text-slate-400 mt-4 max-w-sm mx-auto leading-relaxed font-light">
          Vive la carrera de un futbolista profesional: entrena, firma contratos y compite por la gloria.
        </p>
      </div>

      {/* Pestañas de Navegación */}
      <div className="flex gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-6 w-full max-w-md relative z-10">
        <button
          onClick={() => setActiveTab('saves')}
          className={`btn-fx-subtle flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'saves'
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Play size={13} /> Mis Partidas Guardadas
        </button>
        <button
          onClick={() => setActiveTab('awards')}
          className={`btn-fx-subtle flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'awards'
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award size={13} /> Galería de Balones de Oro
        </button>
      </div>

      {/* Contenedor Principal de Datos */}
      <div className="w-full max-w-2xl relative z-10">
        {activeTab === 'saves' ? (
          <div className="grid md:grid-cols-3 gap-4">
            {slots.map(slot => {
              const hasSave = slot.profile !== null;
              const profile = slot.profile;

              return (
                <div
                  key={slot.id}
                  className={`relative flex flex-col justify-between rounded-2xl border p-4.5 transition-all text-left ${
                    hasSave
                      ? 'bg-slate-900/90 border-slate-800 shadow-md hover:border-emerald-500/50'
                      : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                      {slot.label}
                    </span>
                    {hasSave && (
                      <button
                        onClick={(e) => handleDeleteSave(slot.id, e)}
                        title="Borrar partida"
                        className="btn-fx-subtle p-1 rounded bg-slate-950 text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all border border-slate-900"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  {hasSave && profile ? (
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-black text-white hover:text-emerald-400 transition-colors line-clamp-1 leading-tight">
                          {profile.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                          {profile.position}
                        </p>
                        
                        <div className="text-3xs text-emerald-500 font-extrabold uppercase mt-1.5 flex items-center gap-1">
                          <span>📍</span> {profile.nationality}
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 my-3.5 bg-slate-950/70 p-2 rounded-xl border border-slate-900 text-[10px]">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Calendar size={10} className="text-slate-500" />
                            <span>Semana {profile.currentWeek}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-slate-400 truncate">
                            <Coins size={10} className="text-amber-500" />
                            <span className="truncate">${profile.capital.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Star size={10} className="text-amber-500" />
                            <span>Pres: {profile.prestige}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Trophy size={10} className="text-yellow-500" />
                            <span>Goles: {profile.careerStats.golesHistoricos}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onLoadGame(profile, slot.id)}
                        className="btn-fx w-full py-2 px-3 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={12} className="text-slate-950" />
                        Continuar
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center py-8 text-center">
                      <div className="w-10 h-10 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-slate-600 text-sm mb-3">
                        +
                      </div>
                      <p className="text-2xs text-slate-500 font-semibold mb-3">
                        No hay carrera activa en esta ranura
                      </p>
                      <button
                        onClick={() => onStartNew(slot.id)}
                        className="btn-fx-subtle py-1.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:border-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        Nueva Partida
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Panel del Salón de la Fama */
          <div id="trophy-room" className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center space-y-6">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-black text-white flex items-center justify-center gap-2">
                <Trophy size={18} className="text-amber-500" /> Vitrina de Leyendas e Hitos Históricos
              </h3>
              <p className="text-2xs text-slate-400 mt-1.5">
                Alcanza el estrellato máximo con tu carrera profesional. ¿Lograrás desbloquear los galardones históricos reservados para las leyendas del fútbol mundial?
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              {[
                {
                  title: 'Balón de Oro',
                  desc: 'Prestigio > 90, Valor de Mercado > $10M y Goles > 30.',
                  icon: '👑',
                  color: 'from-amber-600/20 to-amber-900/10 border-amber-500/20',
                  badgeColor: 'text-amber-400 bg-amber-950/50'
                },
                {
                  title: 'Rey de América',
                  desc: 'Defiende tu club colombiano/brasileño/argentino y gana la Copa Libertadores.',
                  icon: '🌎',
                  color: 'from-blue-600/20 to-blue-900/10 border-blue-500/20',
                  badgeColor: 'text-blue-400 bg-blue-950/50'
                },
                {
                  title: 'La Bota de Oro',
                  desc: 'Anota más de 50 goles históricos a lo largo de tu trayectoria.',
                  icon: '👟',
                  color: 'from-yellow-600/20 to-yellow-900/10 border-yellow-500/20',
                  badgeColor: 'text-yellow-400 bg-yellow-950/50'
                },
                {
                  title: 'Fichaje Récord',
                  desc: 'Firma contrato con un gigante del viejo continente de nivel mundial.',
                  icon: '✈️',
                  color: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/20',
                  badgeColor: 'text-emerald-400 bg-emerald-950/50'
                }
              ].map((award, i) => (
                <div key={i} className={`p-4.5 rounded-2xl border bg-gradient-to-br ${award.color} flex flex-col justify-between space-y-2.5`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xl">{award.icon}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${award.badgeColor}`}>
                      Logro
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-100">{award.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{award.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-mono uppercase bg-slate-950 p-2.5 rounded-xl border border-slate-900">
              <Flame size={11} className="text-amber-500" /> ¡Comienza tu carrera y escribe tu nombre en la vitrina mundial!
            </div>
          </div>
        )}
      </div>

      <a
        href="https://paypal.me/camilocas90"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 text-2xs font-bold hover:border-pink-500/50 hover:text-pink-400 transition-all relative z-10"
      >
        <Heart size={13} className="fill-current" /> Apoyar el proyecto
      </a>
    </div>
  );
}
