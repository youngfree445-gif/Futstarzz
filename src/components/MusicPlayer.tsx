import { Music, Plus, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getSfxVolume, isSfxMuted, playSfx, setSfxMuted, setSfxVolume } from '../audio';
import {
  loadSavedPlaylist,
  parsePlaylistUrl,
  savePlaylist,
  type ParsedPlaylist
} from '../musicPlaylist';

// Widget flotante de música. Vive en App.tsx al lado de los toasts para que no se desmonte al
// cambiar de pantalla: si se montara dentro de Dashboard o MatchSimulator, ir a un partido
// recrearía el iframe y cortaría la canción.
//
// Lo que este widget NO puede hacer, y por qué: el audio de Spotify vive dentro de un iframe de
// otro dominio, así que la política de same-origin del navegador impide leerlo o mezclarlo. No hay
// forma de bajarle el volumen en un gol ni de sincronizarlo con el partido -- eso es exclusivo de
// la capa de SFX (audio.ts), que son archivos nuestros. Es la diferencia real con FIFA, que es
// nativo y dueño de toda su música.
//
// El control de volumen de acá es de los SFX, no de la música: la música se controla desde su
// propio iframe (Spotify) y se deja claro en la UI para que no parezca que el slider está roto.

interface MusicPlayerProps {
  /** Oculta el widget en pantallas donde estorbaría (welcome/setup). */
  hidden?: boolean;
}

export default function MusicPlayer({ hidden = false }: MusicPlayerProps) {
  const [open, setOpen] = useState(false);
  const [playlist, setPlaylist] = useState<ParsedPlaylist | null>(null);
  const [draftUrl, setDraftUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(getSfxVolume);
  const [muted, setMuted] = useState(isSfxMuted);
  const inputRef = useRef<HTMLInputElement>(null);

  // Se lee del storage una sola vez al montar (no en el useState inicial) para no tocar
  // localStorage durante el render.
  useEffect(() => {
    const saved = loadSavedPlaylist();
    if (saved) {
      setPlaylist(saved);
      setDraftUrl(saved.sourceUrl);
    }
  }, []);

  const handleSave = () => {
    const parsed = parsePlaylistUrl(draftUrl);
    if (!parsed) {
      setError('No reconocí ese link. Pegá una playlist de Spotify o de YouTube.');
      return;
    }
    setError(null);
    setPlaylist(parsed);
    savePlaylist(parsed);
    playSfx('success');
  };

  const handleClear = () => {
    setPlaylist(null);
    setDraftUrl('');
    setError(null);
    savePlaylist(null);
    inputRef.current?.focus();
  };

  const handleVolume = (next: number) => {
    setVolume(next);
    setSfxVolume(next);
    if (muted && next > 0) {
      setMuted(false);
      setSfxMuted(false);
    }
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setSfxMuted(next);
    if (!next) playSfx('click');
  };

  if (hidden) return null;

  // z-90: por debajo de los toasts (z-100) para que un logro nunca quede tapado por el widget.
  return (
    <div className="fixed bottom-4 left-4 z-90 print:hidden">
      {!open && (
        <button
          type="button"
          onClick={() => { setOpen(true); playSfx('click'); }}
          className="btn-fx w-11 h-11 rounded-full bg-slate-900 border border-gold-500/50 shadow-xl shadow-gold-950/40 flex items-center justify-center text-gold-400 hover:border-gold-400"
          aria-label="Abrir reproductor de música"
        >
          <Music size={17} />
        </button>
      )}

      {open && (
        <div className="w-[min(20rem,calc(100vw-2rem))] bg-slate-900 border border-gold-500/50 rounded-2xl shadow-2xl shadow-gold-950/40 overflow-hidden">
          <div className="px-3 py-1.5 bg-gradient-to-r from-gold-500 to-gold-700 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Music size={12} className="text-slate-950 shrink-0" />
              <span className="text-3xs font-black uppercase tracking-widest text-slate-950 truncate">
                Música
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-950/70 hover:text-slate-950 leading-none px-1 shrink-0"
              aria-label="Minimizar reproductor"
            >
              <X size={13} />
            </button>
          </div>

          <div className="p-3 space-y-3">
            {playlist ? (
              <>
                {/* La altura la fija el provider: el embed compacto de Spotify necesita 152px y por
                    debajo de eso recorta los controles; el de YouTube es 16:9. */}
                <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <iframe
                    // key fuerza recrear el iframe al cambiar de playlist: sin esto algunos
                    // navegadores conservan el reproductor viejo al mutar el src.
                    key={playlist.embedUrl}
                    src={playlist.embedUrl}
                    title="Reproductor de música"
                    className="w-full block"
                    height={playlist.provider === 'spotify' ? 152 : 170}
                    frameBorder={0}
                    loading="lazy"
                    // encrypted-media es obligatorio para Spotify (DRM); sin él el embed no arranca.
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-4xs text-slate-500 hover:text-gold-400 uppercase font-mono font-bold tracking-wide"
                >
                  Cambiar playlist
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-3xs text-slate-400 leading-relaxed">
                  Pegá el link de tu playlist de <span className="text-gold-400 font-bold">Spotify</span> o{' '}
                  <span className="text-gold-400 font-bold">YouTube</span> y suena mientras jugás.
                </p>
                <div className="flex gap-1.5">
                  <input
                    ref={inputRef}
                    type="text"
                    value={draftUrl}
                    onChange={e => { setDraftUrl(e.target.value); setError(null); }}
                    onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                    placeholder="https://open.spotify.com/playlist/..."
                    className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-3xs text-slate-200 placeholder:text-slate-600 focus:border-gold-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSave}
                    className="btn-fx shrink-0 px-2 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 flex items-center justify-center"
                    aria-label="Guardar playlist"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {error && <p className="text-4xs text-burgundy-400 font-bold leading-snug">{error}</p>}
              </div>
            )}

            {/* Separado con un borde y etiquetado explícitamente: este slider es de los efectos del
                juego, no de la música del iframe. Sin la aclaración parece que no hace nada. */}
            <div className="pt-2.5 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="shrink-0 text-slate-400 hover:text-gold-400"
                  aria-label={muted ? 'Activar efectos de sonido' : 'Silenciar efectos de sonido'}
                >
                  {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={e => handleVolume(Number(e.target.value))}
                  className="flex-1 min-w-0 accent-gold-500 h-1"
                  aria-label="Volumen de los efectos de sonido"
                />
                <span className="text-4xs text-slate-500 font-mono font-bold w-7 text-right shrink-0">
                  {Math.round((muted ? 0 : volume) * 100)}
                </span>
              </div>
              <p className="text-4xs text-slate-600 uppercase font-mono font-bold tracking-wide mt-1.5">
                Efectos del juego
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
