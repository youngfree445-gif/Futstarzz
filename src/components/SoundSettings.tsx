import { Volume2, VolumeX, X } from 'lucide-react';
import { useState } from 'react';
import { getSfxVolume, isSfxMuted, playSfx, setSfxMuted, setSfxVolume } from '../audio';

// Botón de sonido siempre visible, para poder jugar en silencio sin tener que abrir el widget de
// música. El control de volumen de efectos también vive ahí dentro, pero ese widget está pensado
// para la playlist: si alguien solo quiere silenciar el juego, no tiene por qué pasar por él.
//
// El estado real (volumen y mute) vive en audio.ts y se persiste en localStorage, así que los dos
// controles leen y escriben lo mismo -- no hay dos fuentes de verdad que se desincronicen.

interface SoundSettingsProps {
  /** Oculta el botón en pantallas donde estorbaría. */
  hidden?: boolean;
}

export default function SoundSettings({ hidden = false }: SoundSettingsProps) {
  const [open, setOpen] = useState(false);
  const [volume, setVolumeState] = useState(getSfxVolume);
  const [muted, setMutedState] = useState(isSfxMuted);

  const handleVolume = (next: number) => {
    setVolumeState(next);
    setSfxVolume(next);
    if (muted && next > 0) {
      setMutedState(false);
      setSfxMuted(false);
    }
    // Feedback audible al soltar: sin esto no se sabe a qué volumen quedó.
    if (next > 0) playSfx('click');
  };

  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setSfxMuted(next);
    if (!next) playSfx('click');
  };

  if (hidden) return null;

  const silenciado = muted || volume === 0;

  // Abajo a la derecha: el widget de música ocupa la izquierda.
  return (
    <div className="fixed bottom-4 right-4 z-90 print:hidden">
      {!open && (
        <button
          type="button"
          onClick={() => { setOpen(true); if (!silenciado) playSfx('click'); }}
          className="btn-fx w-11 h-11 rounded-full bg-slate-900 border border-gold-500/50 shadow-xl shadow-gold-950/40 flex items-center justify-center text-gold-400 hover:border-gold-400"
          aria-label="Ajustes de sonido"
        >
          {silenciado ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      )}

      {open && (
        <div className="w-[min(17rem,calc(100vw-2rem))] bg-slate-900 border border-gold-500/50 rounded-2xl shadow-2xl shadow-gold-950/40 overflow-hidden">
          <div className="px-3 py-1.5 bg-gradient-to-r from-gold-500 to-gold-700 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Volume2 size={12} className="text-slate-950 shrink-0" />
              <span className="text-3xs font-black uppercase tracking-widest text-slate-950 truncate">
                Sonido
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-950/70 hover:text-slate-950 leading-none px-1 shrink-0"
              aria-label="Cerrar ajustes de sonido"
            >
              <X size={13} />
            </button>
          </div>

          <div className="p-3 space-y-3">
            <button
              type="button"
              onClick={toggleMute}
              className={`btn-fx w-full py-2 rounded-xl font-black text-3xs uppercase tracking-widest flex items-center justify-center gap-2 ${
                silenciado
                  ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950'
                  : 'bg-slate-950 border border-slate-700 text-slate-300 hover:border-gold-500'
              }`}
            >
              {silenciado ? <><VolumeX size={14} /> Silencio activado</> : <><Volume2 size={14} /> Jugar en silencio</>}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={e => handleVolume(Number(e.target.value))}
                  className="flex-1 min-w-0 accent-gold-500 h-1"
                  aria-label="Volumen de los efectos del partido"
                />
                <span className="text-4xs text-slate-500 font-mono font-bold w-7 text-right shrink-0">
                  {Math.round((muted ? 0 : volume) * 100)}
                </span>
              </div>
              <p className="text-4xs text-slate-600 uppercase font-mono font-bold tracking-wide mt-1.5">
                Efectos del partido
              </p>
            </div>

            {/* Se aclara qué NO controla este slider: la música va por su propio reproductor y con
                su propio volumen, y sin la nota parece que el control está roto. */}
            <p className="text-4xs text-slate-600 leading-relaxed pt-2 border-t border-slate-800">
              Gol, tarjetas y silbatazos del árbitro. La música de tu playlist se controla desde el
              reproductor ♪ de la esquina izquierda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
