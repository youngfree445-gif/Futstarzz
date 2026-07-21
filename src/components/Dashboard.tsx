import React, { useState } from 'react';
import { PlayerProfile, Club, ShopItem, TableTeam, Position, PlayerStats } from '../types';
// Corregido: Importamos ULTIMATE_CLUBS_DATABASE y getClubWithRoster en lugar de soccerDatabase (que solo tenía 3 clubes de prueba hardcodeados)
import { ULTIMATE_CLUBS_DATABASE, PRESS_QUESTIONS_POOL, COPA_LIBERTADORES_GROUPS_DATA, getClubWithRoster } from '../data';
import { leagueKeyFor, sortTable } from '../leagueEngine';
import { 
  User, Award, Dumbbell, Send, Radio, RefreshCw, ShoppingBag, 
  Table, Zap, DollarSign, Star, Heart, Flame, LogOut, ArrowRight, CheckCircle, 
  ShieldAlert, Sparkles, MessageCircle, TrendingUp, HelpCircle
} from 'lucide-react';

interface DashboardProps {
  playerProfile: PlayerProfile;
  shopItems: ShopItem[];
  onTrainAttribute: (attr: keyof PlayerStats) => void;
  onBuyItem: (itemId: string) => void;
  onLaunchPRCampaign: (cost: number, fansBonus: number, prestigeBonus: number, salaryBonus?: number) => void;
  onAnswerPress: (prestigeChange: number, fansChange: number, energyChange: number) => void;
  onAcceptTransfer: (clubId: string, signOnBonus: number) => void;
  onAdvanceWeek: () => void;
  onRecoverEnergy: (cost: number, energyAmount: number) => void;
  onLogout: () => void;
  onResetGame: () => void;
}

export default function Dashboard({
  playerProfile,
  shopItems,
  onTrainAttribute,
  onBuyItem,
  onLaunchPRCampaign,
  onAnswerPress,
  onAcceptTransfer,
  onAdvanceWeek,
  onRecoverEnergy,
  onLogout,
  onResetGame
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'carrera' | 'entrenamiento' | 'chutsocial' | 'prensa' | 'traspasos' | 'tienda' | 'tablas' | 'mi_club'>('carrera');
  const [selectedPressQ, setSelectedPressQ] = useState(0);
  const [pressResponseState, setPressResponseState] = useState<'asking' | 'answered'>('asking');
  const [pressReaction, setPressReaction] = useState('');

  // Corregido: Busca el club en la base de datos inyectada con el JSON
  const currentClub = ULTIMATE_CLUBS_DATABASE.find(c => c.id === playerProfile.currentClubId)!;
  const myLeagueKey = leagueKeyFor(currentClub);
  const myLeagueTable = sortTable(playerProfile.leagueSeasons[myLeagueKey]?.table || []);

  // Corregido: Ofertas de traspaso con plantillas inyectadas
  const generateMockTransferOffers = () => {
    return ULTIMATE_CLUBS_DATABASE.filter(c => c.id !== playerProfile.currentClubId).map(c => {
      const multiplier = 1 + (playerProfile.prestige / 100);
      const customSalary = Math.round(c.initialSalary * multiplier);
      const signOnBonus = Math.round(c.marketValue * 0.01 + (playerProfile.careerStats.golesHistoricos * 750));
      const reqPrestige = c.reputation * 15 - 10;
      
      return {
        club: c,
        salaryOffer: customSalary,
        signOnBonus,
        reqPrestige,
        possible: playerProfile.prestige >= reqPrestige
      };
    });
  };

  const transferOffers = generateMockTransferOffers();

  const generateSocialFeed = () => {
    const pName = playerProfile.name;
    return [
      {
        id: 'tweet_1',
        author: 'Fabián Torres',
        role: 'Periodista Deportivo',
        content: `¿Es ${pName} la revelación más grande del fútbol continental este año? Con solo ${playerProfile.age} años mantiene una lectura táctica increíble en el campo. #CalcioManager`,
        likes: 1240,
        commentsCount: 382,
        timestamp: 'Hace 2 horas',
        avatar: '🎙️'
      },
      {
        id: 'tweet_2',
        author: 'UltraVerde_99',
        role: 'Hincha Fiel',
        content: `¡Qué jugadorazo es ${pName}! Se nota la diferencia de jerarquía absoluta cuando pide la pelota en tres cuartos de cancha. ¡Titular inamovible siempre!`,
        likes: 852,
        commentsCount: 94,
        timestamp: 'Hace 4 horas',
        avatar: '⚽'
      },
      {
        id: 'tweet_3',
        author: 'La Redonda Oficial',
        role: 'Medio de Comunicación',
        content: `MERCADO: Varios intermediarios monitorean de cerca el rendimiento de ${pName}. Su valor sube como la espuma.`,
        likes: 3410,
        commentsCount: 812,
        timestamp: 'Hace 6 hours',
        avatar: '🔥'
      },
      {
        id: 'tweet_4',
        author: 'Compañero de Equipo',
        role: 'Primer Equipo',
        content: `Concentrados en el vestuario con el crack ${pName}. Esta semana se labura el doble pensando en los tres puntos del fin de semana. ¡Vamos equipo! 🦁`,
        likes: 620,
        commentsCount: 45,
        timestamp: 'Ayer',
        avatar: '👟'
      }
    ];
  };

  const handlePressAnswer = (opt: any) => {
    onAnswerPress(opt.prestigeChange, opt.fansChange, opt.energyChange);
    setPressReaction(opt.reaction);
    setPressResponseState('answered');
  };

  const nextPressQuestion = () => {
    setSelectedPressQ((prev) => (prev + 1) % PRESS_QUESTIONS_POOL.length);
    setPressResponseState('asking');
    setPressReaction('');
  };

  return (
    <div id="dashboard-view" className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row relative">
      
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 z-20">
        <div className="space-y-6">
          
          <div className="p-4 flex items-center gap-3 border-b border-slate-800">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center font-black text-slate-950 italic text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              FS
            </div>
            <div>
              <div className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest leading-none">
                Fútbol Star
              </div>
              <div className="text-sm font-black italic text-white tracking-tight leading-tight mt-0.5">
                CONSOLA 2026
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-amber-500 uppercase tracking-widest font-mono font-bold block mb-1">
              Ficha Profesional
            </span>
            <h2 className="font-extrabold text-sm text-white truncate">{playerProfile.name}</h2>
            <div className="flex justify-between items-center text-3xs text-slate-400 font-mono mt-1">
              <span>{playerProfile.position}</span>
              <span>{playerProfile.age} años</span>
            </div>
            
            <div className={`mt-2.5 p-2 rounded-xl text-xs font-bold truncate flex items-center gap-1.5 ${currentClub.badgeColor}`}>
              <span className="text-sm bg-black/25 w-5 h-5 rounded-md flex items-center justify-center font-normal">{currentClub.badgeLogoUrl || '⚽'}</span>
              <span className="truncate">{currentClub.name}</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('carrera')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'carrera' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <User size={15} /> Mi Carrera
            </button>
            <button
              onClick={() => setActiveTab('mi_club')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'mi_club' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Sparkles size={15} /> Plantilla de Club 
            </button>
            <button
              onClick={() => setActiveTab('entrenamiento')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'entrenamiento' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Dumbbell size={15} /> Entrenamiento
            </button>
            <button
              onClick={() => setActiveTab('chutsocial')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'chutsocial' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Send size={15} /> ChutSocial
            </button>
            <button
              onClick={() => setActiveTab('prensa')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'prensa' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Radio size={15} /> Sala de Prensa
            </button>
            <button
              onClick={() => setActiveTab('traspasos')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'traspasos' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <RefreshCw size={15} /> Traspasos
            </button>
            <button
              onClick={() => setActiveTab('tienda')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'tienda' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <ShoppingBag size={15} /> Tienda de Lujos
            </button>
            <button
              onClick={() => setActiveTab('tablas')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'tablas' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900/30 hover:text-white'}`}
            >
              <Table size={15} /> Copas y Tablas
            </button>
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 text-2xs font-mono transition-colors text-left cursor-pointer"
          >
            <LogOut size={13} /> Guardar & Salir
          </button>
          <button
            onClick={onResetGame}
            className="w-full flex items-center gap-2 px-3 py-1 text-slate-500 hover:text-orange-500 text-3xs font-mono transition-colors text-left cursor-pointer"
          >
            🗑️ Reiniciar Datos de Carrera
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        
        <header className="bg-slate-900 border-b border-slate-800 p-4 md:px-8 flex flex-col md:flex-row gap-4 justify-between items-center z-10">
          
          <div className="flex gap-1.5 items-center">
            <span className="text-emerald-400 text-sm font-black">SEMANA {playerProfile.currentWeek}</span>
            <span className="text-slate-500 text-2xs">· Torneo de Primera División 2026</span>
          </div>

          <div className="grid grid-cols-2 md:flex items-center gap-4 text-xs font-mono w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <Zap size={14} className="text-amber-500" />
              <div>
                <div className="flex justify-between items-center text-3xs text-slate-500 font-bold uppercase leading-none min-w-[70px]">
                  <span>Energía</span>
                  <span className="text-white">{playerProfile.energy}/100</span>
                </div>
                <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${playerProfile.energy}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <DollarSign size={14} className="text-emerald-400 font-bold" />
              <div>
                <span className="text-3xs text-slate-500 block leading-none font-bold uppercase">Capital</span>
                <span className="text-xs text-white font-black">${playerProfile.capital.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <Star size={14} className="text-yellow-400" />
              <div>
                <div className="flex justify-between items-center text-3xs text-slate-500 font-bold uppercase leading-none min-w-[70px]">
                  <span>Prestigio</span>
                  <span className="text-white">{playerProfile.prestige}/100</span>
                </div>
                <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-yellow-500 h-full rounded-full"
                    style={{ width: `${playerProfile.prestige}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <Heart size={14} className="text-rose-500" />
              <div>
                <div className="flex justify-between items-center text-3xs text-slate-500 font-bold uppercase leading-none min-w-[70px]">
                  <span>Hinchada</span>
                  <span className="text-white">{playerProfile.fans}/100</span>
                </div>
                <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${playerProfile.fans}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          
          {activeTab === 'carrera' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-3 gap-6">
                
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Award size={15} className="text-emerald-400" /> Atributos del Jugador
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(playerProfile.attributes).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-2xs text-slate-300 font-mono uppercase font-bold">
                          <span>{key}</span>
                          <span className="text-emerald-400 font-black">{val}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-1 border border-slate-800">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full"
                            style={{ width: `${(val / 99) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-3xs font-mono text-slate-500 uppercase leading-relaxed text-center">
                    Entrena de forma exigente en el complejo deportivo para potenciar tus capacidades.
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      🏆 Estadísticas Históricas de Carrera
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Goles Marcados</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">
                          {playerProfile.careerStats.golesHistoricos}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Asistencias</span>
                        <span className="text-2xl font-black text-yellow-500 font-mono block mt-1">
                          {playerProfile.careerStats.asistenciasHistoricos}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center col-span-2">
                        <span className="text-3xs text-slate-500 font-mono uppercase block">Partidos Totales</span>
                        <span className="text-base font-black text-white font-mono block mt-1">
                          {playerProfile.careerStats.partidosHistoricos} encuentros oficiales
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl mt-4">
                    <span className="text-[10px] text-amber-500 uppercase font-mono font-bold block mb-0.5">Valor de Mercado de la Ficha</span>
                    <span className="font-extrabold text-sm text-slate-200">
                      ${playerProfile.marketValue.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div>
                    <div className="inline-flex py-1 px-2.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider mb-4 animate-pulse">
                      ¡PRÓXIMA JORNADA DISPONIBLE!
                    </div>
                    <h3 className="text-lg font-black text-white leading-tight uppercase">
                      COMPETICIÓN OFICIAL
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Salta al campo de juego con el resto de la plantilla titular. Una buena actuación incrementará tu reputación frente a los ojeadores internacionales.
                    </p>
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-3xs text-slate-500 uppercase font-mono">Ficha Semanal</span>
                        <span className="text-white block font-bold">${currentClub.initialSalary}/sem</span>
                      </div>
                      <div className="text-right">
                        <span className="text-3xs text-slate-500 uppercase font-mono">Nivel de Reto</span>
                        <span className="text-emerald-400 block font-bold">Profesional</span>
                      </div>
                    </div>

                    <button
                      onClick={onAdvanceWeek}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black hover:bg-emerald-400 transition-all text-xs flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl active:scale-95 cursor-pointer"
                    >
                      Disputar Partido <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'entrenamiento' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Complejo de Preparación Física y Técnica
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Invierte tu estamina semanal para perfeccionar tus habilidades técnicas. Cada sesión requiere <span className="text-amber-500 font-bold">-20 Energía</span> y sumará permanentemente <span className="text-emerald-400 font-bold">+3 puntos</span> al atributo seleccionado.
                </p>
              </div>

              {playerProfile.energy < 20 ? (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldAlert size={18} /> Tu estado físico es de fatiga crítica. Entrena en la Clínica o descansa.
                </div>
              ) : null}

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: 'ritmo', label: 'Velocidad / Ritmo', icon: '⚡', desc: 'Mejora la aceleración explosiva y los desmarques por las bandas.' },
                  { key: 'regate', label: 'Dribbling / Regate', icon: '🪄', desc: 'Aumenta el control de balón en conducción y el mano a mano.' },
                  { key: 'tiro', label: 'Definición / Tiro', icon: '🎯', desc: 'Sube la contundencia y potencia de cara al arco rival.' },
                  { key: 'defensa', label: 'Robo / Defensa', icon: '🧱', desc: 'Optimiza la capacidad de anticipación e intercepción táctica.' },
                  { key: 'pase', label: 'Visión / Pase', icon: '🧬', desc: 'Clave para habilitaciones precisas entre líneas y asistencias.' },
                  { key: 'fisico', label: 'Potencia / Físico', icon: '🦾', desc: 'Incrementa la resistencia en disputas aéreas y choques hombro con hombro.' }
                ].map(item => (
                  <div key={item.key} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-3xs font-mono font-black uppercase bg-slate-950 px-2 py-0.5 rounded text-amber-500 border border-slate-800">
                          {playerProfile.attributes[item.key as keyof PlayerStats]}/99
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{item.label}</h4>
                      <p className="text-3xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => onTrainAttribute(item.key as keyof PlayerStats)}
                      disabled={playerProfile.energy < 20}
                      className={`w-full mt-4 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        playerProfile.energy >= 20
                          ? 'bg-slate-950 text-white hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-600 hover:text-slate-950 border border-slate-800 hover:border-emerald-400 cursor-pointer'
                          : 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-900'
                      }`}
                    >
                      Ejercitar (-20 E)
                    </button>
                  </div>
                ))}
              </div>

              {/* SECCIÓN CLÍNICA DE FISIOTERAPIA */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg mt-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                  <Heart size={15} className="text-rose-500" /> Clínica de Fisioterapia y Recuperación
                </h3>
                <p className="text-3xs text-slate-400 leading-relaxed mb-4">
                  ¿Fatiga acumulada? Invierte parte de tu capital bancario en sesiones de crioterapia y masajes para recuperar estamina rápidamente sin perder semanas de juego.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Masaje Deportivo</span>
                      </div>
                      <p className="text-3xs text-emerald-400 font-mono">+25 Energía al Instante</p>
                    </div>
                    <button
                      onClick={() => onRecoverEnergy(1500, 25)}
                      disabled={playerProfile.capital < 1500 || playerProfile.energy >= 100}
                      className="py-2 px-4 rounded-xl bg-slate-800 text-white font-bold text-3xs uppercase tracking-wider hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-600 hover:text-slate-950 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -$1,500
                    </button>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Cámara Hiperbárica</span>
                      </div>
                      <p className="text-3xs text-emerald-400 font-mono">+60 Energía al Instante</p>
                    </div>
                    <button
                      onClick={() => onRecoverEnergy(3500, 60)}
                      disabled={playerProfile.capital < 3500 || playerProfile.energy >= 100}
                      className="py-2 px-4 rounded-xl bg-slate-800 text-white font-bold text-3xs uppercase tracking-wider hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-600 hover:text-slate-950 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -$3,500
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chutsocial' && (
            <div className="space-y-6 animate-fade-in max-w-4xl grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Send size={15} className="text-emerald-400" /> Red de Opinión Pública - Prensa y Afición
                  </h3>

                  <div className="space-y-4">
                    {generateSocialFeed().map(post => (
                      <div key={post.id} className="p-4 bg-slate-955/40 border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                              {post.avatar}
                            </span>
                            <div>
                              <h4 className="font-bold text-xs text-white leading-none">{post.author}</h4>
                              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
                                {post.role}
                              </span>
                            </div>
                          </div>
                          <span className="text-3xs text-slate-500 font-mono">{post.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-3xs text-slate-500 font-mono pt-2 border-t border-slate-950">
                          <span>❤️ {post.likes} Me gusta</span>
                          <span>💬 {post.commentsCount} Hilos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    📢 Gestión de Imagen de Marca
                  </h3>
                  <p className="text-3xs text-slate-400 leading-relaxed mb-4">
                    Ejecuta relaciones públicas para fidelizar a los seguidores o renegociar contratos de patrocinio comercial.
                  </p>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Sorteo para Aficionados</span>
                        <span className="text-red-400 font-mono">-$1,000</span>
                      </div>
                      <p className="text-3xs text-slate-400">Regala equipamiento autografiado para aumentar radicalmente tu base de fans.</p>
                      <button
                        onClick={() => onLaunchPRCampaign(1000, 10, 0)}
                        disabled={playerProfile.capital < 1000}
                        className="w-full mt-3 py-1.5 px-3 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                      >
                        Lanzar sorteo
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Gala de Caridad</span>
                        <span className="text-red-400 font-mono">-$3,000</span>
                      </div>
                      <p className="text-3xs text-slate-400">Impacto altamente positivo en el prestigio de la prensa especializada.</p>
                      <button
                        onClick={() => onLaunchPRCampaign(3000, 15, 6)}
                        disabled={playerProfile.capital < 3000}
                        className="w-full mt-3 py-1.5 px-3 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                      >
                        Financiar Evento
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">Campaña de Patrocinio</span>
                        <span className="text-emerald-400 font-mono">+$4,000 Corp</span>
                      </div>
                      <p className="text-3xs text-slate-400">Recibes capital inmediato, pero genera ligeras críticas por saturación publicitaria.</p>
                      <button
                        onClick={() => onLaunchPRCampaign(-4000, 5, -8)}
                        className="w-full mt-3 py-1.5 px-3 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-bold text-3xs uppercase tracking-wider cursor-pointer"
                      >
                        Firmar Contrato Comercial
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'prensa' && (
            <div className="space-y-6 animate-fade-in max-w-2xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Sala de Conferencias Oficial
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Responde a los cuestionamientos directos de los reporteros deportivos. Tus declaraciones moldearán el vestuario, el prestigio institucional y tu estatus frente a la hinchada.
                </p>
              </div>

              {pressResponseState === 'asking' ? (
                <div className={`bg-slate-900 border rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4 ${PRESS_QUESTIONS_POOL[selectedPressQ].mediaColor}`}>
                  
                  <div className="flex justify-between items-center text-3xs font-mono font-black uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-black/40 p-1 rounded-lg">{PRESS_QUESTIONS_POOL[selectedPressQ].reporterAvatar}</span>
                      <span>{PRESS_QUESTIONS_POOL[selectedPressQ].mediaName} · por <strong>{PRESS_QUESTIONS_POOL[selectedPressQ].reporter}</strong></span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-black/30">{PRESS_QUESTIONS_POOL[selectedPressQ].context}</span>
                  </div>

                  <h3 className="text-base font-black text-white italic leading-relaxed pt-2">
                    "{PRESS_QUESTIONS_POOL[selectedPressQ].question}"
                  </h3>

                  <div className="space-y-2.5 pt-2">
                    {PRESS_QUESTIONS_POOL[selectedPressQ].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handlePressAnswer(opt)}
                        className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950 text-left text-xs text-slate-300 hover:border-emerald-500/40 hover:bg-slate-900 hover:text-white transition-all font-medium py-3.5 cursor-pointer"
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-emerald-500/20 rounded-3xl p-6 shadow-xl space-y-4 text-center">
                  <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
                    <CheckCircle size={28} />
                  </div>
                  <h3 className="text-base font-black text-white px-2">
                    {pressReaction}
                  </h3>
                  <p className="text-3xs text-slate-400 font-mono">
                    Los indicadores de reputación se han recalculado en función de tus declaraciones públicas.
                  </p>

                  <button
                    onClick={nextPressQuestion}
                    className="mt-6 py-2 px-6 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black text-2xs uppercase tracking-widest hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    Próxima Pregunta
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'traspasos' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Oficina de Contratos y Representaciones 
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Revisa las propuestas de los clubes interesados en tu perfil deportivo para la temporada 2026. Tu margen de negociación salarial y los bonos de fichaje se expanden a la par de tu Prestigio general.
                </p>
              </div>

              <div className="space-y-3">
                {transferOffers.map(offer => {
                  const getLeagueFlagText = (lg: string) => {
                    switch (lg) {
                      case 'Colombiana': return '🇨🇴 COL';
                      case 'Brasileña': return '🇧🇷 BRA';
                      case 'Argentina': return '🇦🇷 ARG';
                      case 'Inglesa': return '🏴_󠁧󠁢󠁥󠁮󠁧󠁿 ENG';
                      case 'Española': return '🇪🇸 ESP';
                      case 'Alemana': return '🇩🇪 GER';
                      case 'Italiana': return '🇮🇹 ITA';
                      case 'Francesa': return '🇫🇷 FRA';
                      case 'Holandesa': return '🇳🇱 NED';
                      case 'Portuguesa': return '🇵🇹 POR';
                      case 'MLS (EE.UU.)': return '🇺🇸 USA';
                      case 'Mexicana': return '🇲🇽 MEX';
                      case 'Uruguaya': return '🇺🇾 URU';
                      case 'Ecuatoriana': return '🇪🇨 ECU';
                      case 'Chilena': return '🇨🇱 CHI';
                      default: return '⚽ INT';
                    }
                  };

                  return (
                    <div 
                      key={offer.club.id} 
                      className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all bg-slate-900 border-slate-800 ${!offer.possible ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner text-xl">
                          {offer.club.badgeLogoUrl || '⚽'}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="font-extrabold text-sm text-white truncate max-w-[170px] sm:max-w-[250px]">
                              {offer.club.name}
                            </h3>
                            <span className="text-3xs bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-slate-400 font-mono">
                              {getLeagueFlagText(offer.club.league)}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase text-3xs ${
                              offer.club.division === 2 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                            }`}>
                              {offer.club.division === 2 ? '2ª Div' : '1ª Div'}
                            </span>
                          </div>
                          <p className="text-3xs text-slate-400">
                            <strong>Mánager:</strong> {offer.club.dt} · {offer.club.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-between w-full md:w-auto items-center md:items-end mt-4 md:mt-0 gap-4">
                        <div className="text-left md:text-right font-mono text-xs">
                          <span className="text-slate-500 block text-3xs font-bold uppercase">Oferta Salarial</span>
                          <span className="text-emerald-400 font-bold block">${offer.salaryOffer.toLocaleString()} / sem</span>
                          <span className="text-amber-500 text-3xs block">Prima por Firma: +${offer.signOnBonus.toLocaleString()}</span>
                        </div>

                        <div>
                          {offer.possible ? (
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro de concretar el fichaje con ${offer.club.name} por un salario semanal de $${offer.salaryOffer}? Recibirás un bono de firma inmediato de $${offer.signOnBonus}.`)) {
                                  onAcceptTransfer(offer.club.id, offer.signOnBonus);
                                }
                              }}
                              className="py-1.5 px-3.5 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black text-2xs uppercase tracking-wider hover:bg-emerald-400 transition-colors cursor-pointer"
                            >
                              Aceptar Traspaso
                            </button>
                          ) : (
                            <span className="inline-block py-1 px-2.5 rounded bg-slate-950 text-slate-500 text-3xs font-bold border border-slate-800">
                              Reputación Insuficiente (Mín: {offer.reqPrestige})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tienda' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Boutique de Estilo de Vida y Activos Pasivos
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Invierte el capital neto de tus contratos semanales en lujos exclusivos de alta gama. Cada activo desbloquea mejoras permanentes automáticas en la recuperación de estamina, rendimiento físico o ingresos extra.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {shopItems.map(item => {
                  const isAffordable = playerProfile.capital >= item.cost;
                  return (
                    <div 
                      key={item.id} 
                      className={`p-5 rounded-2xl border transition-all flex justify-between items-start ${
                        item.purchased
                          ? 'border-amber-500/40 bg-slate-900 shadow shadow-amber-950/10'
                          : 'border-slate-800 bg-slate-950/40'
                      }`}
                    >
                      <div className="space-y-2 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💎</span>
                          <h4 className="font-extrabold text-xs text-white">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-3xs text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                        <p className="text-3xs text-emerald-400 font-mono font-bold uppercase leading-relaxed">
                          ✨ Ventaja: {item.perkText}
                        </p>
                      </div>

                      <div className="text-right flex flex-col justify-between h-full min-h-[90px]">
                        <span className="text-xs font-black font-mono text-white block">
                          ${item.cost.toLocaleString()}
                        </span>

                        <div className="mt-4">
                          {item.purchased ? (
                            <span className="inline-flex gap-1 items-center px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-3xs font-bold uppercase">
                              Adquirido
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm(`¿Deseas adquirir la propiedad/servicio "${item.name}" por $${item.cost}?`)) {
                                  onBuyItem(item.id);
                                }
                              }}
                              disabled={!isAffordable}
                              className={`py-1.5 px-3 rounded-lg text-3xs font-black uppercase tracking-wider transition-all ${
                                isAffordable 
                                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 hover:bg-emerald-400 cursor-pointer' 
                                  : 'bg-slate-950 text-slate-500 border border-slate-800 cursor-not-allowed'
                              }`}
                            >
                              Adquirir
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tablas' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  Panel de Competiciones Oficiales
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Monitorea las fases de la prestigiosa Copa Libertadores de América 2026 y la situación clasificatoria actual.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Table size={13} /> TABLA DE POSICIONES · {currentClub.league.toUpperCase()} {currentClub.division && currentClub.division > 1 ? `(DIV. ${currentClub.division})` : ''}
                </h3>

                {myLeagueTable.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-3xs font-mono text-left">
                      <thead>
                        <tr className="text-slate-500 uppercase border-b border-slate-800">
                          <th className="py-1.5 pr-2">#</th>
                          <th className="py-1.5 pr-2">Equipo</th>
                          <th className="py-1.5 px-1.5 text-center">PJ</th>
                          <th className="py-1.5 px-1.5 text-center">G</th>
                          <th className="py-1.5 px-1.5 text-center">E</th>
                          <th className="py-1.5 px-1.5 text-center">P</th>
                          <th className="py-1.5 px-1.5 text-center">GF</th>
                          <th className="py-1.5 px-1.5 text-center">GC</th>
                          <th className="py-1.5 pl-1.5 text-center">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myLeagueTable.map((row, idx) => (
                          <tr
                            key={row.clubId || row.name}
                            className={`border-b border-slate-900/40 ${row.clubId === currentClub.id ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
                          >
                            <td className="py-1.5 pr-2">{idx + 1}</td>
                            <td className="py-1.5 pr-2 truncate max-w-[140px]">{row.name}</td>
                            <td className="py-1.5 px-1.5 text-center">{row.pj}</td>
                            <td className="py-1.5 px-1.5 text-center">{row.g}</td>
                            <td className="py-1.5 px-1.5 text-center">{row.e}</td>
                            <td className="py-1.5 px-1.5 text-center">{row.p}</td>
                            <td className="py-1.5 px-1.5 text-center">{row.gf}</td>
                            <td className="py-1.5 px-1.5 text-center">{row.gc}</td>
                            <td className="py-1.5 pl-1.5 text-center font-black">{row.puntos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-2xs text-slate-500">Todavía no hay datos de la tabla para esta liga.</p>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 border-b border-slate-800 pb-2 flex items-center gap-2">
                  🏆 FASE DE GRUPOS - COPA LIBERTADORES 2026
                </h3>

                <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
                  {COPA_LIBERTADORES_GROUPS_DATA.map(group => (
                    <div key={group.name} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl">
                      <h4 className="font-extrabold text-white border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between text-2xs uppercase">
                        <span>{group.name}</span>
                        <span className="text-amber-500">🏆</span>
                      </h4>
                      <ul className="space-y-1.5 text-slate-300 font-mono text-3xs">
                        {group.teams.map((team, idx) => (
                          <li key={idx} className="flex justify-between border-b border-slate-900/40 pb-0.5">
                            <span className={team.includes(currentClub.name) ? 'text-emerald-400 font-bold' : ''}>
                              {idx + 1}. {team}
                            </span>
                            <span className="text-slate-500">{9 - idx * 2} Pts</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mi_club' && (() => {
            // Corregido: ya no dependemos de soccerDatabase (solo 3 clubes de prueba).
            // Buscamos la plantilla real del club actual dentro de los 32,000 jugadores del JSON.
            const rosterClub = getClubWithRoster(currentClub.name);
            const plantilla = rosterClub?.plantilla || { porteros: [], defensivos: [], ofensivos: [] };
            const totalJugadoresReales = plantilla.porteros.length + plantilla.defensivos.length + plantilla.ofensivos.length;

            return (
              <div className="space-y-6 animate-fade-in max-w-5xl">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-3xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                      Ecosistema de Datos LTA Mod · {currentClub.league}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">{currentClub.name}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      🏆 <strong>Reputación:</strong> {'★'.repeat(currentClub.reputation)} · 💰 <strong>Valor de Plantilla:</strong> ${currentClub.marketValue.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 min-w-[240px]">
                    <span className="text-[10px] text-amber-500 uppercase font-mono font-black block mb-1">Director Técnico Oficial</span>
                    <h4 className="font-bold text-sm text-white">{currentClub.dt}</h4>
                    <div className="text-3xs text-slate-400 font-mono mt-1 space-y-0.5">
                      <p>🏟️ Liga: {currentClub.league}</p>
                      <p>💵 Salario Semanal Base: ${currentClub.initialSalary.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {totalJugadoresReales === 0 && (
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-2xs text-amber-300 leading-relaxed">
                    ⚠️ Este club todavía no tiene jugadores reales cargados en el JSON de la base de datos LTA (el nombre <strong>"{currentClub.name}"</strong> no tiene coincidencias en <code>playersDatabase.json</code>). Revisa el Excel de origen para este equipo.
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 flex justify-between items-center">
                      <span>🧤 Porteros (GK)</span>
                      <span className="text-3xs font-mono text-emerald-400 font-normal">{plantilla.porteros.length}</span>
                    </h3>
                    <div className="space-y-2">
                      {plantilla.porteros.length > 0 ? plantilla.porteros.map(player => (
                        <div key={player.player_id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-xs text-white">{player.nombre_completo}</h4>
                            <span className="text-3xs text-slate-500 font-mono uppercase">{player.posicion_especifica} · €{player.valor_mercado_eur?.toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">{player.media_valoracion}</span>
                        </div>
                      )) : (
                        <p className="text-3xs text-slate-500 italic px-1">Sin datos disponibles.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 flex justify-between items-center">
                      <span>🧱 Defensivos (DF)</span>
                      <span className="text-3xs font-mono text-emerald-400 font-normal">{plantilla.defensivos.length}</span>
                    </h3>
                    <div className="space-y-2">
                      {plantilla.defensivos.length > 0 ? plantilla.defensivos.map(player => (
                        <div key={player.player_id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-xs text-white">{player.nombre_completo}</h4>
                            <span className="text-3xs text-slate-500 font-mono uppercase">{player.posicion_especifica} · €{player.valor_mercado_eur?.toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">{player.media_valoracion}</span>
                        </div>
                      )) : (
                        <p className="text-3xs text-slate-500 italic px-1">Sin datos disponibles.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 flex justify-between items-center">
                      <span>🎯 Ofensivos (OF)</span>
                      <span className="text-3xs font-mono text-emerald-400 font-normal">{plantilla.ofensivos.length}</span>
                    </h3>
                    <div className="space-y-2">
                      {plantilla.ofensivos.length > 0 ? plantilla.ofensivos.map(player => (
                        <div key={player.player_id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-xs text-white">{player.nombre_completo}</h4>
                            <span className="text-3xs text-slate-500 font-mono uppercase">{player.posicion_especifica} · €{player.valor_mercado_eur?.toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">{player.media_valoracion}</span>
                        </div>
                      )) : (
                        <p className="text-3xs text-slate-500 italic px-1">Sin datos disponibles.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

        </div>

      </main>

    </div>
  );
}