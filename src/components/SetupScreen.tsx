import React, { useState, useEffect } from 'react';
import { Position, Nationality, PlayerProfile, PlayerStats, Club, Superstition } from '../types';
import { ULTIMATE_CLUBS_DATABASE as CLUBS_DATABASE } from '../data';
import { esClubJugable } from '../clubesJugables';
import { User, Shield, Compass, Calendar, Award, DollarSign, ArrowRight, ArrowLeft, Flag } from 'lucide-react';
import ClubBadge from './ClubBadge';

// Países disponibles, compartidos por los dos selectores (liga de origen y nacionalidad). Antes la
// lista estaba escrita inline en el JSX; al necesitarla en dos lugares se extrae para que no se
// desincronicen.
//
// La clave es el valor de Club.league / PlayerProfile.nationality: así se cruza con los clubes y
// con NATIONALITY_TO_WORLD_CUP_TEAM_ID, que decide a qué selección te pueden convocar.
const COUNTRIES: { key: string; label: string; flag: string }[] = [
  { key: 'Colombiana', label: 'Colombia', flag: '🇨🇴' },
  { key: 'Brasileña', label: 'Brasil', flag: '🇧🇷' },
  { key: 'Argentina', label: 'Argentina', flag: '🇦🇷' },
  { key: 'Inglesa', label: 'Inglaterra', flag: '🇬🇧' },
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
  { key: 'Chilena', label: 'Chile', flag: '🇨🇱' },
  { key: 'Peruana', label: 'Perú', flag: '🇵🇪' },
  { key: 'Paraguaya', label: 'Paraguay', flag: '🇵🇾' },
  { key: 'Boliviana', label: 'Bolivia', flag: '🇧🇴' },
  { key: 'Venezolana', label: 'Venezuela', flag: '🇻🇪' },
];

interface SetupScreenProps {
  onBack: () => void;
  onFinishSetup: (profile: PlayerProfile) => void;
  onNotify: (message: string) => void;
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

/**
 * Arma el perfil de una carrera nueva.
 *
 * Estaba dentro de SetupScreen, y por eso el validador de pantallas no podia usarlo: tenia que
 * copiar los campos a mano, se le escapaban varios, y el Dashboard reventaba por culpa del andamio y
 * no del juego. Un validador que falla por si mismo entrena a ignorarlo, que es peor que no tenerlo.
 *
 * Extraida para que HAYA UNA SOLA definicion de "perfil nuevo". Cualquier campo que se agregue al
 * juego aparece solo en el validador, sin que nadie tenga que acordarse de sincronizarlo.
 */
export function crearPerfilInicial(datos: {
  name: string;
  position: Position;
  age: number;
  nationality: string;
  dorsal: number;
  heightCm: number;
  selectedClubId: string;
  currentClub?: { initialSalary: number; marketValue: number } | null;
  defaultAttributes: PlayerStats;
  superstition: Superstition;
  injuriesEnabled: boolean;
  difficultyMode: 'normal' | 'realista';
  startedAsVeteran: boolean;
  starModeEnabled: boolean;
}): PlayerProfile {
  const { name, position, age, nationality, dorsal, heightCm, selectedClubId, currentClub,
    defaultAttributes, superstition, injuriesEnabled, difficultyMode, startedAsVeteran,
    starModeEnabled } = datos;
  const finalDorsal = dorsal;
  const finalHeight = heightCm;
  return {
      name: name.trim(),
      position,
      age,
      nationality,
      dorsal: finalDorsal,
      heightCm: finalHeight,
      energy: 100,
      capital: 0, // starts with no capital, relies on weekly wage
      // Modo Superestrella: prestige/relación con el DT alta de entrada, es la pieza central del
      // modo (titular garantizado, ver decideLineupStatus en App.tsx que ya lee prestige para eso).
      prestige: starModeEnabled ? 78 : 50,
      prestigeCompaneros: starModeEnabled ? 65 : 50,
      fans: starModeEnabled ? 55 : 35,
      mentalHealth: 70, // arrancás con la cabeza fresca
      lastMatchRating: 0,
      lastMatchGoals: 0,
      lastMatchWonShootout: false,
      unlockedAchievements: {},
      sponsorsSignedCount: 0,
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
      missedClubMatchesForCountry: 0,
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
      worldCups: {}, // idem, cada 4 años, si tu selección clasificó
      injuriesEnabled,
      difficultyMode,
      startedAsVeteran,
      starModeEnabled,
      activeInjury: null,
      injuryHistory: [],
      agent: null,
      activeLoan: null,
      investments: []
  };
}

export default function SetupScreen({ onBack, onFinishSetup, onNotify }: SetupScreenProps) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('Delantero');
  const [age, setAge] = useState(17);
  // La LIGA donde empezás y tu NACIONALIDAD son cosas distintas: se puede ser colombiano y debutar
  // en España. Antes un solo control hacía las dos cosas, así que tu selección quedaba atada al
  // país del club -- y con eso la convocatoria al Mundial (que sale de nationality) también.
  const [leagueOrigin, setLeagueOrigin] = useState<string>('Colombiana');
  const [nationality, setNationality] = useState<Nationality | string>('Colombiana');
  // Mientras no se toque a mano, la nacionalidad sigue a la liga elegida: es el caso más común y
  // evita que quien no le preste atención termine con una combinación rara sin querer.
  const [nationalityTouched, setNationalityTouched] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<'all' | 1 | 2>('all');
  const [superstition, setSuperstition] = useState<Superstition>('botin_derecho');
  // Modos opcionales de carrera, elegidos una sola vez acá. Ninguno tiene efecto por sí solo en
  // este componente: solo viajan en el perfil para que App.tsx los consulte durante la carrera.
  const [injuriesEnabled, setInjuriesEnabled] = useState(false);
  const [difficultyMode, setDifficultyMode] = useState<'normal' | 'realista'>('normal');
  const [startedAsVeteran, setStartedAsVeteran] = useState(false);
  // Modo Superestrella: arrancás titular con prestige alto, no por edad (independiente del modo
  // veterano) -- ver más abajo dónde se aplica el bonus chico de atributos.
  const [starModeEnabled, setStarModeEnabled] = useState(false);
  const [dorsal, setDorsal] = useState(10);
  const [heightCm, setHeightCm] = useState(180);
  // Espejo en texto de los dos campos numéricos: permite dejarlos vacíos mientras se escribe. El
  // valor real (dorsal/heightCm) se sincroniza en onBlur, ya validado al rango.
  const [dorsalText, setDorsalText] = useState('10');
  const [heightText, setHeightText] = useState('180');

  // En modo veterano restringimos a clubes de reputación media: la narrativa es "llegás consagrado
  // pero no directo a un gigante europeo", no "arrancás en el mejor club del mundo de entrada".
  const VETERAN_MODE_MAX_REPUTATION = 3.5;

  // Los clubes se filtran por la LIGA elegida, no por la nacionalidad: son independientes. En modo
  // veterano además se acota a reputación media.
  // esClubJugable es la puerta: sólo clubes con calendario de FECHAS reales. Sin este filtro se
  // podía empezar carrera en un club que el calendario no sabe hacer jugar -- toda la Segunda
  // inglesa, italiana, española, alemana, francesa, y las 21 ligas chicas -- y ahí arrancaba el
  // motor viejo por semanas, que es de donde salían los bugs de calendario. Ver clubesJugables.ts.
  const filteredClubs = CLUBS_DATABASE.filter(c => {
    const matchLeague = c.league === leagueOrigin;
    if (!matchLeague) return false;
    if (!esClubJugable(c)) return false;
    if (selectedDivision !== 'all' && c.division !== selectedDivision) return false;
    if (startedAsVeteran && c.reputation > VETERAN_MODE_MAX_REPUTATION) return false;
    return true;
  });

  useEffect(() => {
    // Select first team of the filter combination by default
    if (filteredClubs.length > 0) {
      setSelectedClubId(filteredClubs[0].id);
    } else {
      // Fallback: search for any club in this league if specific division is empty
      const fallbackClubs = CLUBS_DATABASE.filter(c => c.league === leagueOrigin && esClubJugable(c));
      if (fallbackClubs.length > 0) {
        setSelectedClubId(fallbackClubs[0].id);
      }
    }
  }, [leagueOrigin, selectedDivision, startedAsVeteran]);

  // Espejo liga -> nacionalidad hasta que el jugador la elija explícitamente.
  useEffect(() => {
    if (!nationalityTouched) setNationality(leagueOrigin);
  }, [leagueOrigin, nationalityTouched]);

  // Modo veterano: al activarlo, forzar la edad al rango consagrado (30-35) si no estaba ya ahí. Al
  // desactivarlo no se toca la edad -- puede que el jugador la haya dejado en ese rango a propósito.
  useEffect(() => {
    if (startedAsVeteran && age < 30) setAge(32);
  }, [startedAsVeteran]);

  const currentClub = CLUBS_DATABASE.find(c => c.id === selectedClubId);

  // Modo Superestrella: bonus chico y parejo a los 6 atributos, mucho más suave que el bonus por
  // edad del modo veterano (+16/+6) -- refleja que ya tenés talento pero seguís siendo joven, no
  // que llegás consagrado. Se suma DESPUÉS del bonus por edad, así que ambos modos se pueden
  // combinar sin pisarse (aunque narrativamente no tiene mucho sentido combinarlos).
  const STAR_MODE_ATTR_BONUS = 6;

  // Fase 3 -- Modo Veterano: arrancar con 32-35 años da atributos de jugador consagrado (+16 en
  // todos los rubros salvo físico, que solo sube +6 -- ya perdió un poco de piernas frente al
  // "Juvenil", es la contrapartida de arrancar con el resto de los atributos a nivel de estrella).
  const getInitialAttributes = (pos: Position, playerAge: number, starMode: boolean): PlayerStats => {
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
    const withAge = playerAge < 30 ? base : {
      ritmo: Math.min(99, base.ritmo + 16),
      regate: Math.min(99, base.regate + 16),
      tiro: Math.min(99, base.tiro + 16),
      defensa: Math.min(99, base.defensa + 16),
      pase: Math.min(99, base.pase + 16),
      fisico: Math.min(99, base.fisico + 6)
    };
    if (!starMode) return withAge;
    return {
      ritmo: Math.min(99, withAge.ritmo + STAR_MODE_ATTR_BONUS),
      regate: Math.min(99, withAge.regate + STAR_MODE_ATTR_BONUS),
      tiro: Math.min(99, withAge.tiro + STAR_MODE_ATTR_BONUS),
      defensa: Math.min(99, withAge.defensa + STAR_MODE_ATTR_BONUS),
      pase: Math.min(99, withAge.pase + STAR_MODE_ATTR_BONUS),
      fisico: Math.min(99, withAge.fisico + STAR_MODE_ATTR_BONUS)
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onNotify('Por favor, ingresa el nombre de tu futbolista.');
      return;
    }

    if (!selectedClubId) {
      onNotify('Por favor, escoge un club inicial.');
      return;
    }

    const defaultAttributes = getInitialAttributes(position, age, starModeEnabled);

    // Se re-valida desde el texto: si el jugador toca "Empezar" con el campo todavía enfocado, el
    // onBlur del input nunca corrió y `dorsal`/`heightCm` estarían con el valor anterior.
    const finalDorsal = Math.max(1, Math.min(99, Number(dorsalText) || 10));
    const finalHeight = Math.max(160, Math.min(210, Number(heightText) || 180));

    const newProfile = crearPerfilInicial({
      name, position, age, nationality,
      dorsal: finalDorsal, heightCm: finalHeight,
      selectedClubId, currentClub,
      defaultAttributes, superstition,
      injuriesEnabled, difficultyMode, startedAsVeteran, starModeEnabled,
    });

    onFinishSetup(newProfile);
  };

  return (
    // `items-center` centraba el formulario verticalmente, y en celular eso lo recorta arriba y
    // abajo: el contenido que sobresale queda fuera del área scrolleable y no hay forma de llegar
    // a él. Con `items-start` el formulario arranca arriba y la página scrollea entera;
    // `sm:items-center` conserva el centrado en pantallas donde sí entra completo.
    <div id="setup-screen" className="min-h-screen bg-slate-950 text-white py-8 sm:py-12 px-4 relative flex items-start sm:items-center justify-center">
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

              {/* Dorsal y altura: el campo guarda TEXTO mientras escribís y recién se valida al
                  salir (onBlur). Antes se clampeaba en cada tecla, así que al borrar para poner
                  otro número el mínimo reaparecía solo y era imposible tipear "7" o "195".

                  inputMode="numeric" abre el teclado numérico en celular sin usar type="number":
                  ese tipo, además de traer flechitas inútiles en mobile, roba el scroll de la
                  página cuando el dedo pasa por encima del campo. */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs uppercase text-slate-400 font-bold mb-1.5">
                    Dorsal <span className="text-slate-600 normal-case">(1-99)</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={dorsalText}
                    onChange={(e) => setDorsalText(e.target.value.replace(/\D/g, ''))}
                    onBlur={() => {
                      const n = Math.max(1, Math.min(99, Number(dorsalText) || 10));
                      setDorsal(n);
                      setDorsalText(String(n));
                    }}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-2xs uppercase text-slate-400 font-bold mb-1.5">
                    Altura <span className="text-slate-600 normal-case">(160-210 cm)</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    value={heightText}
                    onChange={(e) => setHeightText(e.target.value.replace(/\D/g, ''))}
                    onBlur={() => {
                      const n = Math.max(160, Math.min(210, Number(heightText) || 180));
                      setHeightCm(n);
                      setHeightText(String(n));
                    }}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs uppercase text-slate-400 font-bold mb-2">
                  Liga donde empezás
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-40 overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  {COUNTRIES.map(nat => (
                    <button
                      key={nat.key}
                      type="button"
                      onClick={() => setLeagueOrigin(nat.key)}
                      className={`btn-fx-subtle py-1.5 px-1 text-[11px] font-bold rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                        leagueOrigin === nat.key
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

              {/* Los 4 modos opcionales de carrera, uno al lado del otro en vez de apilados a ancho
                  completo -- con 4 bloques de label+descripción+2 botones en columna, el formulario
                  se volvía un scroll interminable. Cada tarjeta mantiene el mismo patrón de botones
                  (normal/activo), solo compactado. */}
              <div>
                <label className="block text-2xs uppercase text-slate-400 font-bold mb-2">
                  Modos de carrera
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/40">
                    <p className="text-2xs font-bold text-white mb-1">Modo veterano</p>
                    <p className="text-3xs text-slate-500 mb-2 leading-snug">
                      30-35 años, titular desde el arranque en un club de nivel medio, con declive físico más temprano.
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => setStartedAsVeteran(false)}
                        className={`btn-fx-subtle py-1.5 px-1.5 text-3xs font-bold rounded-md border transition-all ${
                          !startedAsVeteran
                            ? 'border-gold-500 bg-gold-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => setStartedAsVeteran(true)}
                        className={`btn-fx-subtle py-1.5 px-1.5 text-3xs font-bold rounded-md border transition-all ${
                          startedAsVeteran
                            ? 'border-gold-500 bg-gold-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        Veterano
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/40">
                    <p className="text-2xs font-bold text-white mb-1">Modo Superestrella</p>
                    <p className="text-3xs text-slate-500 mb-2 leading-snug">
                      Titular indiscutido y relación con el DT alta desde ya, con un empujón chico en atributos.
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => setStarModeEnabled(false)}
                        className={`btn-fx-subtle py-1.5 px-1.5 text-3xs font-bold rounded-md border transition-all ${
                          !starModeEnabled
                            ? 'border-gold-500 bg-gold-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => setStarModeEnabled(true)}
                        className={`btn-fx-subtle py-1.5 px-1.5 text-3xs font-bold rounded-md border transition-all ${
                          starModeEnabled
                            ? 'border-gold-500 bg-gold-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        Estrella
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/40">
                    <p className="text-2xs font-bold text-white mb-1">Dificultad</p>
                    <p className="text-3xs text-slate-500 mb-2 leading-snug">
                      En modo realista la energía baja más rápido y la prensa es más exigente.
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => setDifficultyMode('normal')}
                        className={`btn-fx-subtle py-1.5 px-1.5 text-3xs font-bold rounded-md border transition-all ${
                          difficultyMode === 'normal'
                            ? 'border-gold-500 bg-gold-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => setDifficultyMode('realista')}
                        className={`btn-fx-subtle py-1.5 px-1.5 text-3xs font-bold rounded-md border transition-all ${
                          difficultyMode === 'realista'
                            ? 'border-gold-500 bg-gold-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        Realista
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/40">
                    <p className="text-2xs font-bold text-white mb-1">Lesiones</p>
                    <p className="text-3xs text-slate-500 mb-2 leading-snug">
                      Si las activas, vas a poder lesionarte de verdad y perderte partidos mientras te recuperas.
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => setInjuriesEnabled(false)}
                        className={`btn-fx-subtle py-1.5 px-1.5 text-3xs font-bold rounded-md border transition-all ${
                          !injuriesEnabled
                            ? 'border-gold-500 bg-gold-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        Sin
                      </button>
                      <button
                        type="button"
                        onClick={() => setInjuriesEnabled(true)}
                        className={`btn-fx-subtle py-1.5 px-1.5 text-3xs font-bold rounded-md border transition-all ${
                          injuriesEnabled
                            ? 'border-gold-500 bg-gold-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        Con
                      </button>
                    </div>
                  </div>
                </div>
                {injuriesEnabled && (
                  <p className="text-3xs text-gold-400 mt-2 leading-relaxed bg-gold-950/20 border border-gold-500/20 rounded-lg p-2">
                    Confirmado: esta carrera va a tener lesiones reales. Vas a perderte partidos
                    mientras estés lesionado y las decisiones de tratamiento van a afectar cuánto
                    tiempo estás afuera.
                  </p>
                )}
              </div>
            </div>

            {/* Position Attribute preview card */}
            <div className="border border-slate-800/80 bg-slate-950/20 rounded-2xl p-5">
              <h4 className="text-2xs uppercase text-slate-400 font-black tracking-widest gap-2 flex items-center mb-3">
                <Shield size={13} className="text-gold-400" /> Atributos de Partida ({position}{age >= 30 ? ' · Veterano' : ''}{starModeEnabled ? ' · Superestrella' : ''})
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(getInitialAttributes(position, age, starModeEnabled)).map(([key, val]) => (
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
                {/* Se pregunta por la LIGA elegida, no por la nacionalidad: son campos
                    independientes (un colombiano puede arrancar en la Premier). Consultando
                    `nationality`, el botón de 2ª División no aparecía cuando la liga elegida no
                    coincidía con el país del jugador -- y la Segunda quedaba inalcanzable. */}
                {CLUBS_DATABASE.some(c => c.league === leagueOrigin && c.division === 2 && esClubJugable(c)) && (
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

              {/* Nacionalidad vive acá, no en el panel izquierdo -- este panel tenía espacio de
                  sobra debajo de la tarjeta de contrato, mientras la columna izquierda se volvía
                  un scroll interminable. Es un campo independiente de la liga (columna izquierda),
                  así que no pierde sentido estar separado visualmente. */}
              <div>
                <label className="block text-2xs uppercase text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                  <Flag size={11} className="text-gold-400 shrink-0" />
                  Nacionalidad
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-40 overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  {COUNTRIES.map(nat => (
                    <button
                      key={nat.key}
                      type="button"
                      onClick={() => { setNationality(nat.key); setNationalityTouched(true); }}
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
                <p className="text-4xs text-slate-500 leading-relaxed mt-1.5">
                  Define a qué selección te pueden convocar. Puedes jugar en una liga y tener otra
                  nacionalidad{nationality !== leagueOrigin ? ' — como ahora' : ''}.
                </p>
              </div>
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
