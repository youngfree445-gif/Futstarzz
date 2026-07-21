import React, { useState, useEffect } from 'react';
import { Position, Nationality, PlayerProfile, PlayerStats, Club } from '../types';
import { ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE } from '../data';
import { User, Shield, Compass, Calendar, Award, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';

interface SetupScreenProps {
  onBack: () => void;
  onFinishSetup: (profile: PlayerProfile) => void;
}

export default function SetupScreen({ onBack, onFinishSetup }: SetupScreenProps) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('Delantero');
  const [age, setAge] = useState(17);
  const [nationality, setNationality] = useState<Nationality | string>('Colombiana');
  const [selectedClubId, setSelectedClubId] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<'all' | 1 | 2>('all');

  // Filter clubs based on country/nationality and division
  const filteredClubs = CLUBS_DATABASE.filter(c => {
    const matchLeague = c.league === nationality;
    if (!matchLeague) return false;
    if (selectedDivision === 'all') return true;
    return c.division === selectedDivision;
  });

  useEffect(() => {
    // Select first team of the filter combination by default
    if (filteredClubs.length > 0) {
      setSelectedClubId(filteredClubs[0].id);
    } else {
      // Fallback: search for any club in this nationality if specific division is empty
      const fallbackClubs = CLUBS_DATABASE.filter(c => c.league === nationality);
      if (fallbackClubs.length > 0) {
        setSelectedClubId(fallbackClubs[0].id);
      }
    }
  }, [nationality, selectedDivision]);

  const currentClub = CLUBS_DATABASE.find(c => c.id === selectedClubId);

  const getInitialAttributes = (pos: Position): PlayerStats => {
    switch (pos) {
      case 'Delantero':
        return { ritmo: 60, regate: 58, tiro: 65, defensa: 18, pase: 48, fisico: 46 };
      case 'Mediocampista':
        return { ritmo: 52, regate: 60, tiro: 48, defensa: 45, pase: 65, fisico: 50 };
      case 'Defensor':
        return { ritmo: 54, regate: 32, tiro: 22, defensa: 66, pase: 46, fisico: 64 };
      case 'Arquero':
        return { ritmo: 38, regate: 20, tiro: 12, defensa: 68, pase: 42, fisico: 56 };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, ingresa el nombre de tu futbolista.');
      return;
    }

    if (!selectedClubId) {
      alert('Por favor, escoge un club inicial.');
      return;
    }

    const defaultAttributes = getInitialAttributes(position);
    
    const newProfile: PlayerProfile = {
      name: name.trim(),
      position,
      age,
      nationality,
      energy: 100,
      capital: 0, // starts with no capital, relies on weekly wage
      prestige: 50, // default locker room prestige
      fans: 35,     // default fan connection
      attributes: defaultAttributes,
      careerStats: {
        goles: 0,
        asistencias: 0,
        partidos: 0,
        campeonatos: 0,
        golesHistoricos: 0,
        asistenciasHistoricos: 0,
        partidosHistoricos: 0
      },
      currentClubId: selectedClubId,
      currentWeek: 1,
      marketValue: currentClub ? Math.round(currentClub.marketValue * 0.05) : 300000 // initial value based on club status
    };

    onFinishSetup(newProfile);
  };

  return (
    <div id="setup-screen" className="min-h-screen bg-slate-950 text-white py-12 px-4 relative flex items-center justify-center">
      {/* Visual background element */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-slate-900/75 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative backdrop-blur-md">
        <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-950/40 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-slate-400">
              Creación de Personaje · Temporada 2026
            </h2>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          
          {/* LEFT PANEL: Player configuration */}
          <div className="space-y-6">
            <div className="border border-slate-800/80 bg-slate-950/50 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                <User size={15} /> 1. Datos Personales
              </h3>
              
              <div>
                <label className="block text-2xs uppercase text-slate-400 font-bold mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    ⚽
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Luis Fernando Díaz"
                    maxLength={28}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs uppercase text-slate-400 font-bold mb-1.5">
                    Edad inicial
                  </label>
                  <select
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                  >
                    {[16, 17, 18, 19, 20, 21].map(a => (
                      <option key={a} value={a}>{a} años (Juvenil)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-2xs uppercase text-slate-400 font-bold mb-1.5">
                    Posición en Cancha
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as Position)}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                  >
                    <option value="Delantero">Delantero (9 / Extremo)</option>
                    <option value="Mediocampista">Mediocentro (MCO / MC)</option>
                    <option value="Defensor">Defensor (Central / Lateral)</option>
                    <option value="Arquero">Arquero (Portero)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-2xs uppercase text-slate-400 font-bold mb-2">
                  Liga de Origen / Nacionalidad
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-40 overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  {[
                    { key: 'Colombiana', label: 'Colombia', flag: '🇨🇴' },
                    { key: 'Brasileña', label: 'Brasil', flag: '🇧🇷' },
                    { key: 'Argentina', label: 'Argentina', flag: '🇦🇷' },
                    { key: 'Inglesa', label: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                    { key: 'Española', label: 'España', flag: '🇪🇸' },
                    { key: 'Alemana', label: 'Alemania', flag: '🇩🇪' },
                    { key: 'Italiana', label: 'Italia', flag: '🇮🇹' },
                    { key: 'Francesa', label: 'Francia', flag: '🇫🇷' },
                    { key: 'Holandesa', label: 'Holanda', flag: '🇳🇱' },
                    { key: 'Portuguesa', label: 'Portugal', flag: '🇵🇹' },
                    { key: 'Estadounidense', label: 'EE.UU.', flag: '🇺🇸' },
                    { key: 'Mexicana', label: 'México', flag: '🇲🇽' },
                    { key: 'Uruguaya', label: 'Uruguay', flag: '🇺🇾' },
                    { key: 'Ecuatoriana', label: 'Ecuador', flag: '🇪🇨' },
                    { key: 'Chilena', label: 'Chile', flag: '🇨🇱' }
                  ].map(nat => (
                    <button
                      key={nat.key}
                      type="button"
                      onClick={() => setNationality(nat.key)}
                      className={`py-1.5 px-1 text-[11px] font-bold rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                        nationality === nat.key
                          ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-sm block mb-0.5">{nat.flag}</span>
                      <span className="truncate max-w-[65px]">{nat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Position Attribute preview card */}
            <div className="border border-slate-800/80 bg-slate-950/20 rounded-2xl p-5">
              <h4 className="text-2xs uppercase text-slate-400 font-black tracking-widest gap-2 flex items-center mb-3">
                <Shield size={13} className="text-emerald-400" /> Atributos de Partida ({position})
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(getInitialAttributes(position)).map(([key, val]) => (
                  <div key={key} className="flex flex-col">
                    <div className="flex justify-between text-2xs text-slate-400 uppercase font-mono">
                      <span>{key}</span>
                      <span className="text-white font-bold">{val}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div 
                        className="bg-gradient-to-br from-emerald-400 to-emerald-600 h-full rounded-full" 
                        style={{ width: `${(val / 99) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Initial club selector based on selected nationality */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Compass size={15} /> 2. Selección de Club Inicial
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                Elige el equipo donde arrancarás el torneo de la temporada 2026. Los clubes con más reputación exigen mayor nivel pero otorgan salarios más gordos.
              </p>

              {/* Division Filters */}
              <div className="flex gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setSelectedDivision('all')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-2xs font-bold transition-all ${
                    selectedDivision === 'all'
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas las Divisiones
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDivision(1)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-2xs font-bold transition-all ${
                    selectedDivision === 1
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1ª División (Elite)
                </button>
                {CLUBS_DATABASE.some(c => c.league === nationality && c.division === 2) && (
                  <button
                    type="button"
                    onClick={() => setSelectedDivision(2)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-2xs font-bold transition-all ${
                      selectedDivision === 2
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2ª División (Ascenso)
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {filteredClubs.length > 0 ? (
                  filteredClubs.map(club => (
                    <button
                      key={club.id}
                      type="button"
                      onClick={() => setSelectedClubId(club.id)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                        selectedClubId === club.id
                          ? 'border-emerald-500 bg-slate-900/90 shadow-lg shadow-emerald-950/20'
                          : 'border-slate-800 bg-slate-950/40 opacity-75 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Styled Badge */}
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 text-lg shadow-inner">
                          {club.badgeLogoUrl || '⚽'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-black text-sm text-white truncate max-w-[150px] sm:max-w-[200px]">
                              {club.name}
                            </h4>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase text-3xs ${
                              club.division === 2 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                            }`}>
                              {club.division === 2 ? '2ª Div' : '1ª Div'}
                            </span>
                          </div>
                          <p className="text-2xs text-slate-450 font-mono mt-0.5 truncate">
                            DT: {club.dt}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          ${club.initialSalary.toLocaleString()}/sem
                        </span>
                        <div className="flex gap-0.5 mt-0.5 justify-end">
                          {Array.from({ length: club.reputation }).map((_, i) => (
                            <span key={i} className="text-[9px] text-amber-400">★</span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No hay clubes disponibles en esta división de origen.
                  </div>
                )}
              </div>

              {currentClub && (
                <div className={`p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 mt-4 leading-relaxed`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-2xs font-extrabold uppercase text-amber-500 tracking-wider">
                      Detalles del Contrato Ofrecido
                    </span>
                    <span className="text-3xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      2 Años (2026-2028)
                    </span>
                  </div>
                  <p className="text-2xs text-slate-300 mb-2.5">
                    {currentClub.description}
                  </p>
                  <p className="text-2xs text-slate-400">
                    <strong className="text-slate-200">Figuras reales del plantel:</strong> {currentClub.starPlayers.join(', ')}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-black hover:from-emerald-400 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs shadow-xl active:scale-98"
            >
              Comenzar Carrera <ArrowRight size={15} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
