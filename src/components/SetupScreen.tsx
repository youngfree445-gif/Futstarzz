import React, { useState, useEffect } from 'react';
import { Position, Nationality, PlayerProfile, PlayerStats, Club, Superstition } from '../types';
import { ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE } from '../data';
import { User, Shield, Compass, Calendar, Award, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';
import ClubBadge from './ClubBadge';

interface SetupScreenProps {
  onBack: () => void;
  onFinishSetup: (profile: PlayerProfile) => void;
}

// Fase 2.5 -- Superstición del jugador: ritual elegido una sola vez en la creación del personaje.
// breakMessage se usa en App.tsx (handleFinishMatch) cuando el ritual "se rompe" por azar en un
// partido y golpea un poco la mentalHealth -- ver SUPERSTITION_BREAK_CHANCE.
export const SUPERSTITIONS_DATABASE: { id: Superstition; label: string; breakMessage: string }[] = [
  { id: 'botin_derecho', label: 'Calzarte primero el botín derecho', breakMessage: 'Te calzaste el botín izquierdo primero sin darte cuenta' },
  { id: 'mismo_numero', label: 'Pedir siempre el mismo dorsal', breakMessage: 'El club te asignó otro dorsal esta semana' },
  { id: 'cancion_previa', label: 'Escuchar la misma canción antes de salir', breakMessage: 'Se te olvidaron los auriculares en la concentración' },
  { id: 'pie_derecho_cancha', label: 'Pisar la cancha primero con el pie derecho', breakMessage: 'El apuro del túnel de vestuarios te hizo pisar con el pie izquierdo' },
  { id: 'no_afeitarse', label: 'No afeitarte en semana de partido', breakMessage: 'Tenías un evento de sponsor y te tocó afeitarte antes del partido' },
  { id: 'ultimo_vestuario', label: 'Ser el último en salir del vestuario', breakMessage: 'El cuerpo técnico te sacó antes de tiempo para el calentamiento' }
];

export default function SetupScreen({ onBack, onFinishSetup }: SetupScreenProps) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('Delantero');
  const [age, setAge] = useState(17);
  const [nationality, setNationality] = useState<Nationality | string>('Colombiana');
  const [selectedClubId, setSelectedClubId] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<'all' | 1 | 2>('all');
  const [superstition, setSuperstition] = useState<Superstition>('botin_derecho');
  const [dorsal, setDorsal] = useState(10);
  const [heightCm, setHeightCm] = useState(180);

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

  // Fase 3 -- Modo Veterano: arrancar con 32-35 años da atributos de jugador consagrado (+16 en
  // todos los rubros salvo físico, que solo sube +6 -- ya perdió un poco de piernas frente al
  // "Juvenil", es la contrapartida de arrancar con el resto de los atributos a nivel de estrella).
  const getInitialAttributes = (pos: Position, playerAge: number): PlayerStats => {
    const base = (() => {
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
    })();
    if (playerAge < 30) return base;
    return {
      ritmo: Math.min(99, base.ritmo + 16),
      regate: Math.min(99, base.regate + 16),
      tiro: Math.min(99, base.tiro + 16),
      defensa: Math.min(99, base.defensa + 16),
      pase: Math.min(99, base.pase + 16),
      fisico: Math.min(99, base.fisico + 6)
    };
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

    const defaultAttributes = getInitialAttributes(position, age);
    
    const newProfile: PlayerProfile = {
      name: name.trim(),
      position,
      age,
      nationality,
      dorsal,
      heightCm,
      energy: 100,
      capital: 0, // starts with no capital, relies on weekly wage
      prestige: 50, // default locker room prestige
      fans: 35,     // default fan connection
      mentalHealth: 70, // arrancás con la cabeza fresca
      lastMatchRating: 0,
      yellowCards: 0,
      suspendedMatches: 0,
      seasonHistory: [],
      lastPressAnsweredWeek: 0,
      superstition,
      matchesWithoutRest: 0,
      hadBreakoutSeason: false,
      attrSumAtSeasonStart: Object.values(defaultAttributes).reduce((sum, v) => sum + v, 0),
      yearsAtClub: 0,
      appearanceBonus: currentClub ? Math.round(currentClub.initialSalary * 0.15) : 0,
      mentorshipPlayerName: null,
      hasSteppedDownRetirement: false,
      girlfriend: null,
      attributes: defaultAttributes,
      careerStats: {
        goles: 0,
        asistencias: 0,
        partidos: 0,
        campeonatos: 0,
        golesHistoricos: 0,
        asistenciasHistoricos: 0,
        partidosHistoricos: 0,
        sumaCalificacionesHistoricas: 0,
        tarjetasAmarillasHistoricas: 0,
        tarjetasRojasHistoricas: 0
      },
      currentClubId: selectedClubId,
      currentWeek: 1,
      marketValue: currentClub ? Math.round(currentClub.marketValue * 0.05) : 300000, // initial value based on club status
      leagueSeasons: {}, // App.tsx (handleFinishSetup) genera la temporada real antes de guardar
      continentalCups: {}, // se generan de forma perezosa la primera vez que clasificás a alguna
      uefaCups: {}, // idem, Champions/Europa League
      worldCups: {} // idem, cada 4 años, si tu selección clasificó
    };

    onFinishSetup(newProfile);
  };

  return (
    <div id="setup-screen" className="min-h-screen bg-slate-950 text-white py-12 px-4 relative flex items-center justify-center">
      {/* Visual background element */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-slate-900/75 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative backdrop-blur-md">
        <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-950/40 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-burgundy-500" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-slate-400">
              Creación de Personaje · Temporada 2026
            </h2>
          </div>
          <button
            onClick={onBack}
            className="btn-fx-subtle flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          
          {/* LEFT PANEL: Player configuration */}
          {/* min-w-0 es necesario: sin esto, un ítem de CSS Grid usa el min-content de su
              contenido (ej. el <select> de posición) como piso y se desborda del viewport
              en pantallas angostas en vez de encogerse/truncar. */}
          <div className="space-y-6 min-w-0">
            <div className="border border-slate-800/80 bg-slate-950/50 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2 mb-2">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-gold-500 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Antes forzaba 2 columnas siempre: dentro del panel izquierdo (que ya es la mitad
                  del formulario desde md:768px) eso dejaba cada select en ~180px, muy angosto
                  para textos largos como "Defensor (Central / Lateral)" -- se veía cortado tanto
                  en mobile como en desktop. Ahora va siempre en una columna, más legible. */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-2xs uppercase text-slate-400 font-bold mb-1.5">
                    Edad inicial
                  </label>
                  <select
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                  >
                    {Array.from({ length: 35 - 16 + 1 }, (_, i) => 16 + i).map(a => (
                      <option key={a} value={a}>
                        {a} años{a <= 21 ? ' (Juvenil)' : a >= 30 ? ' (Veterano)' : ''}
                      </option>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs uppercase text-slate-400 font-bold mb-1.5">
                    Dorsal
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={dorsal}
                    onChange={(e) => setDorsal(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-2xs uppercase text-slate-400 font-bold mb-1.5">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    min={160}
                    max={210}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(160, Math.min(210, Number(e.target.value) || 160)))}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                  />
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
                      className={`btn-fx-subtle py-1.5 px-1 text-[11px] font-bold rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                        nationality === nat.key
                          ? 'border-gold-500 bg-gold-950/30 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-sm block mb-0.5">{nat.flag}</span>
                      <span className="truncate max-w-[65px]">{nat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-2xs uppercase text-slate-400 font-bold mb-2">
                  Superstición / Ritual Previo
                </label>
                <p className="text-3xs text-slate-500 mb-2 leading-relaxed">
                  Todo futbolista tiene su manía. Si algún día no la puedes cumplir, te va a costar un poco de cabeza.
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {SUPERSTITIONS_DATABASE.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSuperstition(s.id)}
                      className={`btn-fx-subtle py-2 px-3 text-2xs font-bold rounded-lg border text-left transition-all ${
                        superstition === s.id
                          ? 'border-gold-500 bg-gold-950/30 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Position Attribute preview card */}
            <div className="border border-slate-800/80 bg-slate-950/20 rounded-2xl p-5">
              <h4 className="text-2xs uppercase text-slate-400 font-black tracking-widest gap-2 flex items-center mb-3">
                <Shield size={13} className="text-gold-400" /> Atributos de Partida ({position}{age >= 30 ? ' · Veterano' : ''})
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(getInitialAttributes(position, age)).map(([key, val]) => (
                  <div key={key} className="flex flex-col">
                    <div className="flex justify-between text-2xs text-slate-400 uppercase font-mono">
                      <span>{key}</span>
                      <span className="text-white font-bold">{val}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div 
                        className="bg-gradient-to-br from-gold-400 to-gold-600 h-full rounded-full" 
                        style={{ width: `${(val / 99) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Initial club selector based on selected nationality */}
          <div className="flex flex-col justify-between min-w-0">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                <Compass size={15} /> 2. Selección de Club Inicial
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                Elige el equipo donde arrancarás el torneo de la temporada 2026. Los clubes con más reputación exigen mayor nivel pero otorgan salarios más gordos.
              </p>

              {/* Division Filters -- textos acortados y padding más chico en mobile: las
                  etiquetas largas ("1ª División (Elite)" / "2ª División (Ascenso)") forzaban
                  esta fila más ancha que el viewport en pantallas angostas. */}
              <div className="flex gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setSelectedDivision('all')}
                  className={`btn-fx-subtle flex-1 py-1.5 px-1.5 sm:px-3 rounded-lg text-3xs sm:text-2xs font-bold transition-all ${
                    selectedDivision === 'all'
                      ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDivision(1)}
                  className={`btn-fx-subtle flex-1 py-1.5 px-1.5 sm:px-3 rounded-lg text-3xs sm:text-2xs font-bold transition-all ${
                    selectedDivision === 1
                      ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1ª División
                </button>
                {CLUBS_DATABASE.some(c => c.league === nationality && c.division === 2) && (
                  <button
                    type="button"
                    onClick={() => setSelectedDivision(2)}
                    className={`btn-fx-subtle flex-1 py-1.5 px-1.5 sm:px-3 rounded-lg text-3xs sm:text-2xs font-bold transition-all ${
                      selectedDivision === 2
                        ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2ª División
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
                      className={`btn-fx-subtle w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                        selectedClubId === club.id
                          ? 'border-gold-500 bg-slate-900/90 shadow-lg shadow-gold-950/20'
                          : 'border-slate-800 bg-slate-950/40 opacity-75 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ClubBadge club={club} size={40} colorFallback={false} className="rounded-xl border border-slate-800 bg-slate-950 shadow-inner" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-black text-sm text-white truncate max-w-[100px] sm:max-w-[200px]">
                              {club.name}
                            </h4>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase text-3xs ${
                              club.division === 2 ? 'bg-burgundy-500/10 text-burgundy-500 border border-burgundy-500/10' : 'bg-gold-500/10 text-gold-400 border border-gold-500/10'
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
                        <span className="text-xs font-black text-gold-400 font-mono">
                          ${club.initialSalary.toLocaleString()}/sem
                        </span>
                        <div className="flex gap-0.5 mt-0.5 justify-end">
                          {Array.from({ length: club.reputation }).map((_, i) => (
                            <span key={i} className="text-[9px] text-burgundy-400">★</span>
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                    <span className="text-2xs font-extrabold uppercase text-burgundy-500 tracking-wider">
                      Detalles del Contrato Ofrecido
                    </span>
                    <span className="text-3xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono self-start sm:self-auto">
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
              className="btn-fx w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-700 text-white font-black hover:from-gold-400 hover:to-gold-600 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs shadow-xl"
            >
              Comenzar Carrera <ArrowRight size={15} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
