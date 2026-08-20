import React, { useState } from 'react';
import { PlayerProfile, PenaltyShootoutResult } from '../types';
import { Target, Trophy, Skull, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

// Tanda de penales jugada en vivo, punto por punto, cuando el club del usuario participa. A
// diferencia de PenaltyShootout.tsx (que solo narra un resultado ya simulado de antemano por el
// motor de brackets), acá el usuario patea DE VERDAD sus propios tiros eligiendo dirección, y
// también ataja si le toca ser el arquero. Los tiros del resto de los jugadores (compañeros y
// rivales) se resuelven automáticamente con una probabilidad realista, uno por uno, para que la
// tensión de "quién patea ahora" se sienta igual que en un partido real.

export type PenaltyDirection = 'izquierda' | 'centro' | 'derecha';

interface KickRecord {
  side: 'mine' | 'rival';
  scored: boolean;
  isPlayerKick: boolean;
  isPlayerSave?: boolean;
}

interface InteractivePenaltyShootoutProps {
  playerProfile: PlayerProfile;
  myClubName: string;
  rivalClubName: string;
  onContinue: (result: PenaltyShootoutResult, myClubWon: boolean) => void;
}

const DIRECTIONS: { key: PenaltyDirection; label: string; icon: React.ReactNode }[] = [
  { key: 'izquierda', label: 'Palo izquierdo', icon: <ArrowLeft size={16} /> },
  { key: 'centro', label: 'Al medio', icon: <ArrowUp size={16} /> },
  { key: 'derecha', label: 'Palo derecho', icon: <ArrowRight size={16} /> },
];

// El jugador patea/ataja en las rondas donde le toca en la rotación real: arqueros SIEMPRE atajan
// (nunca patean salvo que sean el único jugador de campo disponible, algo que este juego no
// modela), el resto de posiciones patea. Para simplificar, el jugador de campo patea en su propia
// tanda 1 de cada ~5 tiros (como un pateador más de la nómina) y el arquero ataja siempre que
// el rival patea.
function isPlayerTurnToKick(position: PlayerProfile['position'], roundIndex: number): boolean {
  if (position === 'Arquero') return false;
  // Rota entre los primeros 5 tiros: el jugador patea en su turno "personal" (uno fijo, ronda 0)
  // y luego, en muerte súbita, siempre que le toque de nuevo sería raro que un mismo pateador
  // repita antes que el resto -- para no complicar la nómina, el jugador patea en la ronda 0 y,
  // si la tanda llega a muerte súbita, también patea en cada ronda impar de muerte súbita.
  return roundIndex === 0 || roundIndex >= 5;
}

export default function InteractivePenaltyShootout({ playerProfile, myClubName, rivalClubName, onContinue }: InteractivePenaltyShootoutProps) {
  const [kicks, setKicks] = useState<KickRecord[]>([]);
  const [pendingSide, setPendingSide] = useState<'mine' | 'rival'>('mine');
  const [roundIndex, setRoundIndex] = useState(0);
  const [resultText, setResultText] = useState<string | null>(null);
  const [awaitingPlayerChoice, setAwaitingPlayerChoice] = useState(false);
  const [awaitingGoalkeeperChoice, setAwaitingGoalkeeperChoice] = useState(false);

  const isGoalkeeper = playerProfile.position === 'Arquero';
  const tiroAttr = playerProfile.attributes.tiro;
  const defensaAttr = playerProfile.attributes.defensa;

  const myScore = kicks.filter(k => k.side === 'mine' && k.scored).length;
  const rivalScore = kicks.filter(k => k.side === 'rival' && k.scored).length;
  const myTaken = kicks.filter(k => k.side === 'mine').length;
  const rivalTaken = kicks.filter(k => k.side === 'rival').length;

  const isSuddenDeath = roundIndex >= 5;
  const isDone = resultText !== null;

  // Chequea si la tanda ya está matemáticamente decidida (uno de los dos no puede alcanzar al
  // otro con los tiros que le quedan) -- regla real de "muerte súbita anticipada".
  function checkDecided(nextKicks: KickRecord[], nextRound: number): boolean {
    const mScore = nextKicks.filter(k => k.side === 'mine' && k.scored).length;
    const rScore = nextKicks.filter(k => k.side === 'rival' && k.scored).length;
    const mTaken = nextKicks.filter(k => k.side === 'mine').length;
    const rTaken = nextKicks.filter(k => k.side === 'rival').length;
    if (nextRound < 5) {
      const mRemaining = 5 - mTaken;
      const rRemaining = 5 - rTaken;
      if (mScore > rScore + rRemaining) return true;
      if (rScore > mScore + mRemaining) return true;
      return false;
    }
    // Muerte súbita: decidido apenas ambos patearon en la ronda y quedaron desnivelados.
    return mTaken === rTaken && mTaken > 5 && mScore !== rScore;
  }

  function finishShootout(finalKicks: KickRecord[]) {
    const mScore = finalKicks.filter(k => k.side === 'mine' && k.scored).length;
    const rScore = finalKicks.filter(k => k.side === 'rival' && k.scored).length;
    const iWon = mScore > rScore;
    const packagedResult: PenaltyShootoutResult = {
      clubAId: 'mine',
      clubBId: 'rival',
      kicks: finalKicks.map(k => ({ clubId: k.side === 'mine' ? 'mine' : 'rival', scored: k.scored })),
      scoreA: mScore,
      scoreB: rScore,
      winnerId: iWon ? 'mine' : 'rival',
    };
    setResultText(iWon
      ? `¡${myClubName} avanza de ronda por penales!`
      : `${rivalClubName} los elimina en la tanda de penales.`);
    setTimeout(() => onContinue(packagedResult, iWon), 50);
  }

  function pushKickAndAdvance(record: KickRecord) {
    setKicks(prev => {
      const next = [...prev, record];
      const nextTakenMine = next.filter(k => k.side === 'mine').length;
      const decided = checkDecided(next, roundIndex);
      if (decided) {
        finishShootout(next);
      } else if (pendingSide === 'mine') {
        setPendingSide('rival');
      } else {
        setPendingSide('mine');
        setRoundIndex(nextTakenMine); // ronda que arranca ahora = cuántos tiros propios ya se dieron
      }
      return next;
    });
  }

  function resolveAutoKick(side: 'mine' | 'rival') {
    // Conversión automática realista (~78%, igual que simulatePenaltyShootout en leagueEngine.ts)
    // para los tiros que no le tocan directamente al jugador.
    const scored = Math.random() < 0.78;
    pushKickAndAdvance({ side, scored, isPlayerKick: false });
  }

  function handlePlayerKick(direction: PenaltyDirection) {
    // El arquero rival "adivina" el lado con cierta chance base, mitigada por lo bueno que sea tu
    // tiro: un tiro potente y colocado (atributo tiro alto) es más difícil de atajar incluso si el
    // arquero elige bien el lado.
    const goalkeeperGuessChance = 0.35;
    const goalkeeperGuessedRight = Math.random() < goalkeeperGuessChance;
    const baseSaveChanceIfGuessed = Math.max(0.15, Math.min(0.55, 0.55 - (tiroAttr - 50) * 0.004));
    const scored = !(goalkeeperGuessedRight && Math.random() < baseSaveChanceIfGuessed);
    setAwaitingPlayerChoice(false);
    pushKickAndAdvance({ side: 'mine', scored, isPlayerKick: true });
  }

  function handleGoalkeeperChoice(direction: PenaltyDirection) {
    // El rematador rival elige un lado al azar; si coincidís, tu atributo defensa decide si atajás.
    const shooterDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)].key;
    const guessedRight = direction === shooterDirection;
    const saveChance = Math.max(0.2, Math.min(0.65, 0.35 + (defensaAttr - 50) * 0.006));
    const saved = guessedRight && Math.random() < saveChance;
    setAwaitingGoalkeeperChoice(false);
    pushKickAndAdvance({ side: 'rival', scored: !saved, isPlayerKick: false, isPlayerSave: saved });
  }

  // Efecto de disparo: decide automáticamente el siguiente tiro, salvo que le toque al jugador.
  React.useEffect(() => {
    if (isDone) return;
    if (pendingSide === 'mine') {
      if (!isGoalkeeper && isPlayerTurnToKick(playerProfile.position, roundIndex)) {
        setAwaitingPlayerChoice(true);
        return;
      }
      const t = setTimeout(() => resolveAutoKick('mine'), 900);
      return () => clearTimeout(t);
    } else {
      if (isGoalkeeper) {
        setAwaitingGoalkeeperChoice(true);
        return;
      }
      const t = setTimeout(() => resolveAutoKick('rival'), 900);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSide, roundIndex, isDone]);

  const currentKickNumber = kicks.length + 1;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-12 px-4 relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-burgundy-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest text-burgundy-400">
          <span className="flex items-center gap-1.5">
            <Target size={14} /> Tanda de Penales {isSuddenDeath ? '· Muerte Súbita' : ''}
          </span>
          <span className="text-3xs text-slate-500 font-bold">Tiro {currentKickNumber}</span>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-center gap-6">
            <div className="text-right">
              <span className="font-black text-sm block">{myClubName}</span>
              <span className="text-3xs text-gold-400 uppercase font-mono font-bold tracking-wider">Tu Equipo ({myTaken}/5)</span>
            </div>
            <div className="text-3xl font-black font-mono tracking-wider bg-slate-950 px-4 py-1.5 rounded-xl border border-burgundy-500/20 text-burgundy-400 shadow-[0_0_15px_rgba(159,18,57,0.1)]">
              {myScore} - {rivalScore}
            </div>
            <div className="text-left">
              <span className="font-black text-sm block">{rivalClubName}</span>
              <span className="text-3xs text-slate-500 uppercase font-mono tracking-wider">Rival ({rivalTaken}/5)</span>
            </div>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {kicks.map((kick, i) => (
              <div
                key={i}
                className={`animate-fade-in p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  kick.scored
                    ? 'bg-gold-950/20 border-gold-500/30 text-gold-300'
                    : 'bg-red-950/20 border-red-500/30 text-red-300'
                }`}
              >
                <span>
                  Tiro {i + 1} · {kick.side === 'mine' ? myClubName : rivalClubName}
                  {kick.isPlayerKick && ' (¡pateaste tú!)'}
                  {kick.isPlayerSave && ' (¡atajaste tú!)'}
                </span>
                <span className="font-mono uppercase text-3xs">{kick.scored ? '⚽ GOL' : '🧤 ATAJADO/AFUERA'}</span>
              </div>
            ))}
          </div>

          {awaitingPlayerChoice && (
            <div className="space-y-3 text-center border-t border-slate-800 pt-4">
              <h3 className="text-sm font-black text-white">¡Te toca patear! Elegí a dónde tirar</h3>
              <div className="grid grid-cols-3 gap-2">
                {DIRECTIONS.map(d => (
                  <button
                    key={d.key}
                    onClick={() => handlePlayerKick(d.key)}
                    className="btn-fx-subtle flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-gold-400/50 hover:bg-slate-850 text-xs font-bold"
                  >
                    {d.icon}
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {awaitingGoalkeeperChoice && (
            <div className="space-y-3 text-center border-t border-slate-800 pt-4">
              <h3 className="text-sm font-black text-white">¡El rival va a patear! Elegí a dónde volar</h3>
              <div className="grid grid-cols-3 gap-2">
                {DIRECTIONS.map(d => (
                  <button
                    key={d.key}
                    onClick={() => handleGoalkeeperChoice(d.key)}
                    className="btn-fx-subtle flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-gold-400/50 hover:bg-slate-850 text-xs font-bold"
                  >
                    {d.icon}
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isDone && (
            <div className="text-center space-y-3 pt-2">
              <div className={`inline-flex p-3 rounded-full border ${myScore > rivalScore ? 'bg-gold-500/20 border-gold-500/40' : 'bg-red-500/20 border-red-500/40'}`}>
                {myScore > rivalScore ? <Trophy size={28} className="text-gold-400" /> : <Skull size={28} className="text-red-400" />}
              </div>
              <h3 className="text-base font-black text-white leading-snug">{resultText}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
