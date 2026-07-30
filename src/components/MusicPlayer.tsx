import { ChevronDown, Music, Pause, Play, Plus, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getSfxVolume, isSfxMuted, playSfx, setSfxMuted, setSfxVolume } from '../audio';
import {
  loadSavedPlaylist,
  parsePlaylistUrl,
  savePlaylist,
  type ParsedPlaylist
} from '../musicPlaylist';

// Widget de música de fondo. Vive en App.tsx al lado de los toasts para que no se desmonte al
// cambiar de pantalla: si se montara dentro de Dashboard o MatchSimulator, ir a un partido
// recrearía el iframe y cortaría la canción.
//
// La diferencia clave entre los dos providers, y por qué la UI los trata distinto:
//
//   YouTube  -> canciones COMPLETAS y encadenadas. Se puede controlar por postMessage (IFrame API),
//               así que el iframe se puede colapsar a 1px y seguir sonando de fondo con play/pausa/
//               siguiente/volumen propios. Es el modo recomendado para jugar.
//   Spotify  -> el embed solo da PREVIEWS DE 30s salvo que el visitante tenga sesión Premium activa
//               en el navegador, y no expone ninguna API de control. No se puede arreglar desde acá:
//               canción completa requiere el Web Playback SDK (OAuth + Premium por jugador). Por eso
//               el reproductor de Spotify se muestra siempre visible y se avisa la limitación.

interface MusicPlayerProps {
  /** Oculta el widget en pantallas donde estorbaría (welcome/setup). */
  hidden?: boolean;
}

// Comandos de la IFrame API de YouTube. Se mandan por postMessage en vez de cargar el SDK de
// YouTube: el SDK necesita inyectar un script externo, y para play/pausa/volumen/siguiente esto
// alcanza y no agrega una dependencia de red que pueda fallar.
function ytCommand(iframe: HTMLIFrameElement | null, func: string, args: unknown[] = []) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func, args }),
    // Tiene que coincidir con el dominio del embed (www.youtube.com, ver buildYouTubeEmbed).
    'https://www.youtube.com'
  );
}

export default function MusicPlayer({ hidden = false }: MusicPlayerProps) {
  const [open, setOpen] = useState(false);
  const [playlist, setPlaylist] = useState<ParsedPlaylist | null>(null);
  const [draftUrl, setDraftUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sfxVolume, setSfxVolumeState] = useState(getSfxVolume);
  const [sfxMuted, setSfxMutedState] = useState(isSfxMuted);
  // Volumen de la música, independiente de los SFX: la música de fondo suele querer estar más baja
  // que los efectos del partido. Solo aplica a YouTube (Spotify no expone control).
  const [musicVolume, setMusicVolume] = useState(35);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isYouTube = playlist?.provider === 'youtube';

  // Se lee del storage una sola vez al montar (no en el useState inicial) para no tocar
  // localStorage durante el render.
  useEffect(() => {
    const saved = loadSavedPlaylist();
    if (saved) {
      setPlaylist(saved);
      setDraftUrl(saved.sourceUrl);
    }
  }, []);

  // El volumen se aplica cada vez que cambia, y también cuando el iframe termina de cargar (ver
  // onLoad): setVolume antes de que el reproductor exista se pierde sin avisar.
  useEffect(() => {
    if (isYouTube) ytCommand(iframeRef.current, 'setVolume', [musicVolume]);
  }, [musicVolume, isYouTube]);

  const handleSave = () => {
    const parsed = parsePlaylistUrl(draftUrl);
    if (!parsed) {
      setError('No reconocí ese link. Pegá una playlist de YouTube Music, YouTube o Spotify.');
      return;
    }
    setError(null);
    setPlaylist(parsed);
    savePlaylist(parsed);
    // Al cargar una playlist nueva el reproductor arranca detenido hasta que el jugador le da play:
    // el navegador exige ese gesto igual, así que el estado tiene que reflejarlo.
    setMusicPlaying(false);
    playSfx('success');
  };

  const handleClear = () => {
    setPlaylist(null);
    setDraftUrl('');
    setError(null);
    setMusicPlaying(false);
    savePlaylist(null);
    inputRef.current?.focus();
  };

  const toggleMusic = () => {
    if (!isYouTube) return;
    if (musicPlaying) {
      ytCommand(iframeRef.current, 'pauseVideo');
      setMusicPlaying(false);
    } else {
      ytCommand(iframeRef.current, 'playVideo');
      ytCommand(iframeRef.current, 'setVolume', [musicVolume]);
      setMusicPlaying(true);
    }
  };

  const nextTrack = () => {
    if (!isYouTube) return;
    ytCommand(iframeRef.current, 'nextVideo');
    // nextVideo arranca reproduciendo aunque estuviera pausado.
    setMusicPlaying(true);
  };

  const handleSfxVolume = (next: number) => {
    setSfxVolumeState(next);
    setSfxVolume(next);
    if (sfxMuted && next > 0) {
      setSfxMutedState(false);
      setSfxMuted(false);
    }
  };

  const toggleSfxMute = () => {
    const next = !sfxMuted;
    setSfxMutedState(next);
    setSfxMuted(next);
    if (!next) playSfx('click');
  };

  if (hidden) return null;

  // El iframe de YouTube se renderiza SIEMPRE que haya playlist de YouTube, incluso con el widget
  // cerrado y en cualquier pantalla: es lo que permite que la música siga sonando mientras jugás.
  // Colapsado se deja de 1x1px con opacidad 0 en vez de display:none ni width:0 -- un iframe
  // realmente oculto es pausado por varios navegadores como ahorro de recursos.
  const collapsedPlayer = isYouTube && !open;

  return (
    <>
      {isYouTube && (
        <div
          className="fixed pointer-events-none"
          style={
            collapsedPlayer
              ? { bottom: 0, left: 0, width: 1, height: 1, opacity: 0.01, zIndex: -1 }
              : { bottom: '7.5rem', left: '1rem', width: 'min(18rem, calc(100vw - 2rem))', height: '9.5rem', zIndex: 89 }
          }
        >
          <iframe
            ref={iframeRef}
            // key con el embedUrl fuerza recrear el iframe al cambiar de playlist: mutar el src deja
            // el reproductor viejo andando en algunos navegadores.
            key={playlist!.embedUrl}
            src={playlist!.embedUrl}
            title="Reproductor de música"
            className="w-full h-full rounded-xl border border-slate-800 pointer-events-auto"
            frameBorder={0}
            // El volumen guardado se aplica recién cuando el reproductor está listo.
            onLoad={() => ytCommand(iframeRef.current, 'setVolume', [musicVolume])}
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      )}

      <div className="fixed bottom-4 left-4 z-90 print:hidden">
        {!open && (
          <button
            type="button"
            onClick={() => { setOpen(true); playSfx('click'); }}
            className="btn-fx w-11 h-11 rounded-full bg-slate-900 border border-gold-500/50 shadow-xl shadow-gold-950/40 flex items-center justify-center text-gold-400 hover:border-gold-400 relative"
            aria-label="Abrir reproductor de música"
          >
            <Music size={17} />
            {/* Punto verde: la música sigue sonando con el widget cerrado, y sin esto no hay forma
                de saberlo. */}
            {musicPlaying && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            )}
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
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="p-3 space-y-3">
              {!playlist && (
                <div className="space-y-2">
                  <p className="text-3xs text-slate-400 leading-relaxed">
                    Pegá el link de tu playlist de{' '}
                    <span className="text-gold-400 font-bold">YouTube Music</span> y suena completa
                    mientras jugás.
                  </p>
                  <div className="flex gap-1.5">
                    <input
                      ref={inputRef}
                      type="text"
                      value={draftUrl}
                      onChange={e => { setDraftUrl(e.target.value); setError(null); }}
                      onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                      placeholder="https://music.youtube.com/playlist?list=..."
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
                  <p className="text-4xs text-slate-600 leading-relaxed">
                    Spotify también entra, pero solo deja escuchar 30 segundos por canción salvo que
                    tengas sesión Premium abierta — es un límite suyo, no del juego.
                  </p>
                </div>
              )}

              {isYouTube && (
                <>
                  {/* Controles propios: el iframe queda colapsado a 1px mientras jugás, así que
                      play/pausa/siguiente/volumen tienen que estar acá. */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMusic}
                      className="btn-fx w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 flex items-center justify-center"
                      aria-label={musicPlaying ? 'Pausar música' : 'Reproducir música'}
                    >
                      {musicPlaying ? <Pause size={15} /> : <Play size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={nextTrack}
                      className="btn-fx w-9 h-9 shrink-0 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 flex items-center justify-center hover:border-gold-500"
                      aria-label="Siguiente canción"
                    >
                      <SkipForward size={14} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={musicVolume}
                        onChange={e => setMusicVolume(Number(e.target.value))}
                        className="w-full accent-gold-500 h-1"
                        aria-label="Volumen de la música"
                      />
                      <p className="text-4xs text-slate-600 uppercase font-mono font-bold tracking-wide mt-1">
                        Música {musicVolume}%
                      </p>
                    </div>
                  </div>
                  <p className="text-4xs text-slate-500 leading-relaxed">
                    {musicPlaying
                      ? 'Suena mientras jugás, incluso con esto cerrado.'
                      : 'Dale play una vez y sigue sonando en todo el juego.'}
                  </p>
                </>
              )}

              {playlist?.provider === 'spotify' && (
                <>
                  <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <iframe
                      key={playlist.embedUrl}
                      src={playlist.embedUrl}
                      title="Reproductor de Spotify"
                      className="w-full block"
                      height={152}
                      frameBorder={0}
                      loading="lazy"
                      // encrypted-media es obligatorio para Spotify (DRM); sin él el embed no arranca.
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    />
                  </div>
                  {/* Se avisa acá y no solo en la pantalla de carga: si el jugador ya tenía una
                      playlist de Spotify guardada, nunca vería el aviso. */}
                  <p className="text-4xs text-burgundy-400/90 leading-relaxed">
                    Spotify solo deja 30 segundos por canción salvo que tengas sesión Premium abierta,
                    y su reproductor tiene que quedar visible. Para canciones completas de fondo, usá
                    una playlist de YouTube Music.
                  </p>
                </>
              )}

              {playlist && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-4xs text-slate-500 hover:text-gold-400 uppercase font-mono font-bold tracking-wide"
                >
                  Cambiar playlist
                </button>
              )}

              {/* Separado con un borde y etiquetado explícitamente: este slider es de los efectos del
                  partido, no de la música. Sin la aclaración parece que no hace nada. */}
              <div className="pt-2.5 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSfxMute}
                    className="shrink-0 text-slate-400 hover:text-gold-400"
                    aria-label={sfxMuted ? 'Activar efectos de sonido' : 'Silenciar efectos de sonido'}
                  >
                    {sfxMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={sfxMuted ? 0 : sfxVolume}
                    onChange={e => handleSfxVolume(Number(e.target.value))}
                    className="flex-1 min-w-0 accent-gold-500 h-1"
                    aria-label="Volumen de los efectos del partido"
                  />
                  <span className="text-4xs text-slate-500 font-mono font-bold w-7 text-right shrink-0">
                    {Math.round((sfxMuted ? 0 : sfxVolume) * 100)}
                  </span>
                </div>
                <p className="text-4xs text-slate-600 uppercase font-mono font-bold tracking-wide mt-1.5">
                  Efectos del partido
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
