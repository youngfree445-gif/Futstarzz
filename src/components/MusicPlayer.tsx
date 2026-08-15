import { ChevronDown, Music, Pause, Play, Plus, Shuffle, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
//               siguiente/aleatorio/volumen propios. Es el modo recomendado para jugar.
//   Spotify  -> el embed solo da PREVIEWS DE 30s salvo que el visitante tenga sesión Premium activa
//               en el navegador. Eso no se puede arreglar desde acá: canción completa requiere el
//               Web Playback SDK (OAuth + Premium por jugador). Lo que sí se usa es la IFrame API
//               (distinta del Web Playback SDK, no pide login ni Premium), que da play/pausa y el
//               evento playback_update. No tiene "siguiente" ni "aleatorio": no existen en su API,
//               así que para Spotify se muestran solo los controles que de verdad responden y el
//               reproductor queda visible.

interface MusicPlayerProps {
  /** Oculta el widget en pantallas donde estorbaría (welcome/setup). */
  hidden?: boolean;
}

// Comandos de la IFrame API de YouTube. Se mandan por postMessage en vez de cargar el SDK de
// YouTube: el SDK necesita inyectar un script externo, y para play/pausa/volumen/siguiente esto
// alcanza y no agrega una dependencia de red que pueda fallar.
// --- Spotify IFrame API ---
//
// Distinta del Web Playback SDK: esta NO pide OAuth ni Premium, y da play/pausa/seek sobre el embed
// normal. Lo que no expone es "siguiente" ni "aleatorio" (no existen en su API), así que el widget
// muestra para Spotify solo los controles que de verdad responden.
//
// El script se carga una sola vez y bajo demanda -- solo si el jugador realmente usa Spotify -- para
// no pagar una request de red en cada arranque del juego.
interface SpotifyController {
  play(): void;
  pause(): void;
  togglePlay(): void;
  destroy(): void;
  loadUri(uri: string): void;
  addListener(event: string, cb: (e: { data: { isPaused?: boolean; position?: number; duration?: number } }) => void): void;
}

// El SDK quiere una URI (spotify:playlist:xxx), no la URL de embed. Se deriva de la que ya está
// guardada en vez de cambiar el parser, así las playlists guardadas de antes siguen funcionando.
function spotifyUriFromEmbed(embedUrl: string): string | null {
  const m = embedUrl.match(/open\.spotify\.com\/embed\/(playlist|album|artist|track)\/([A-Za-z0-9]+)/);
  return m ? `spotify:${m[1]}:${m[2]}` : null;
}

const SPOTIFY_API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';
let spotifyApiPromise: Promise<any> | null = null;

function loadSpotifyApi(): Promise<any> {
  if (spotifyApiPromise) return spotifyApiPromise;
  spotifyApiPromise = new Promise((resolve, reject) => {
    const w = window as any;
    if (w.SpotifyIframeApi) { resolve(w.SpotifyIframeApi); return; }
    // El callback lo llama el script al terminar de cargar; se guarda la instancia para que una
    // segunda playlist de Spotify no tenga que esperar la red otra vez.
    w.onSpotifyIframeApiReady = (api: any) => { w.SpotifyIframeApi = api; resolve(api); };
    const tag = document.createElement('script');
    tag.src = SPOTIFY_API_SRC;
    tag.async = true;
    tag.onerror = () => reject(new Error('no se pudo cargar el reproductor de Spotify'));
    document.body.appendChild(tag);
  });
  return spotifyApiPromise;
}

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
  const [shuffle, setShuffle] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Hueco que el panel le reserva al video de YouTube. El iframe se posiciona encima de estas
  // coordenadas para que se vea integrado al panel sin dejar de ser un elemento suelto (moverlo
  // dentro del DOM del panel cortaría la reproducción al cerrarlo).
  const youtubeSlotRef = useRef<HTMLDivElement>(null);
  const [youtubeSlot, setYoutubeSlot] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  // Spotify: el div que el SDK reemplaza por su propio iframe, y el controlador que devuelve.
  const spotifyHostRef = useRef<HTMLDivElement>(null);
  const spotifyCtrlRef = useRef<SpotifyController | null>(null);
  const [spotifyReady, setSpotifyReady] = useState(false);
  const spotifySlotRef = useRef<HTMLDivElement>(null);
  const [spotifySlot, setSpotifySlot] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const isYouTube = playlist?.provider === 'youtube';
  const isSpotify = playlist?.provider === 'spotify';

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

  // El modo aleatorio se re-aplica al cambiar de playlist: el orden vive en el reproductor, así que
  // un iframe nuevo arranca siempre en orden aunque el botón siga encendido.
  useEffect(() => {
    if (isYouTube) ytCommand(iframeRef.current, 'setShuffle', [shuffle]);
  }, [shuffle, isYouTube, playlist?.embedUrl]);

  // Crea el reproductor de Spotify vía IFrame API en vez de un <iframe> suelto: así el widget puede
  // controlarlo (play/pausa propios) y saber si está sonando, igual que con YouTube. El SDK reemplaza
  // el div de spotifyHostRef por su propio iframe.
  useEffect(() => {
    if (!isSpotify || !playlist) return;
    const uri = spotifyUriFromEmbed(playlist.embedUrl);
    if (!uri) return;

    let cancelado = false;
    setSpotifyReady(false);

    loadSpotifyApi()
      .then(api => {
        // El panel pudo cerrarse (o cambiar de playlist) mientras cargaba el script.
        if (cancelado || !spotifyHostRef.current) return;
        api.createController(
          spotifyHostRef.current,
          { uri, width: '100%', height: '152' },
          (ctrl: SpotifyController) => {
            if (cancelado) { ctrl.destroy(); return; }
            spotifyCtrlRef.current = ctrl;
            setSpotifyReady(true);
            // Única fuente de verdad sobre si suena: el reproductor puede pausarse solo (fin de la
            // lista, corte por otra pestaña) y el botón tiene que reflejarlo.
            ctrl.addListener('playback_update', e => {
              if (!cancelado) setMusicPlaying(!e.data.isPaused);
            });
          }
        );
      })
      .catch(() => { if (!cancelado) setSpotifyReady(false); });

    return () => {
      cancelado = true;
      spotifyCtrlRef.current?.destroy();
      spotifyCtrlRef.current = null;
      setSpotifyReady(false);
    };
  }, [isSpotify, playlist?.embedUrl]);

  // Mantiene cada reproductor pegado al hueco que le reserva el panel. Se re-mide ante cualquier
  // cosa que lo mueva (abrir/cerrar, rotar el teléfono, aparecer el teclado, scroll) porque los
  // iframes están en position:fixed y no se reacomodan solos con el layout.
  //
  // useLayoutEffect y no useEffect: con useEffect la medición ocurre DESPUÉS de que el navegador
  // pintó, así que en ese primer frame el iframe se dibujaba con las coordenadas viejas (o sin
  // ninguna) y aparecía arriba a la izquierda, tapando el menú lateral, antes de saltar a su lugar.
  useLayoutEffect(() => {
    if (!open) { setYoutubeSlot(null); setSpotifySlot(null); return; }

    const slotRef = isYouTube ? youtubeSlotRef : isSpotify ? spotifySlotRef : null;
    const aplicar = isYouTube ? setYoutubeSlot : isSpotify ? setSpotifySlot : null;
    if (!slotRef || !aplicar) return;

    const medir = () => {
      const el = slotRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Un rect de 0x0 significa que el hueco todavía no tiene layout: aplicarlo dejaría el iframe
      // pegado a la esquina superior izquierda del viewport, encima del menú.
      if (r.width === 0 || r.height === 0) return;
      aplicar({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    medir();

    const ro = new ResizeObserver(medir);
    if (slotRef.current) ro.observe(slotRef.current);
    window.addEventListener('resize', medir);
    window.addEventListener('scroll', medir, true);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', medir);
      window.removeEventListener('scroll', medir, true);
    };
  }, [isYouTube, isSpotify, open, playlist?.embedUrl]);

  const handleSave = () => {
    const parsed = parsePlaylistUrl(draftUrl);
    if (!parsed) {
      setError('No reconocí ese link. Pega una playlist de YouTube Music, YouTube o Spotify.');
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
    if (isSpotify) {
      // El estado real lo confirma el listener de playback_update; acá no se toca musicPlaying para
      // no dejarlo mintiendo si el navegador bloquea el autoplay.
      spotifyCtrlRef.current?.togglePlay();
      return;
    }
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

  const toggleShuffle = () => {
    if (!isYouTube) return;
    const next = !shuffle;
    // El comando lo manda el useEffect al cambiar el estado; acá solo queda el salto.
    setShuffle(next);
    // setShuffle solo reordena lo que viene DESPUÉS de la canción actual, así que sin saltar no
    // pasa nada audible y el botón parece no hacer nada. Al activarlo se salta a una canción al
    // azar; al desactivarlo se deja sonando la actual y la lista sigue en orden desde ahí.
    if (next) {
      ytCommand(iframeRef.current, 'nextVideo');
      setMusicPlaying(true);
    }
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
  // cerrado y en cualquier pantalla: es lo que permite que la música siga sonando mientras juegas.
  // Colapsado se deja de 1x1px con opacidad 0 en vez de display:none ni width:0 -- un iframe
  // realmente oculto es pausado por varios navegadores como ahorro de recursos.
  const collapsedPlayer = isYouTube && !open;

  return (
    <>
      {/* El iframe de YouTube vive SIEMPRE acá, fuera del panel, y nunca se desmonta: montarlo dentro
          del panel haría que cerrarlo corte la canción.

          Cuando el panel está abierto se lo posiciona encima del hueco que le reserva el panel
          (ver youtubeSlotRef), en vez de dejarlo flotando por su cuenta: antes tenía una posición
          fija propia con z-index menor al del panel, así que el video aparecía detrás del cuadro y
          desalineado. Cerrado, se colapsa a 1px y sigue sonando de fondo. */}
      {/* Mismo criterio para Spotify: el reproductor nunca se desmonta, y cuando el panel está
          abierto se lo posiciona sobre el hueco que este le reserva. Cerrado queda colapsado a 1px,
          sonando de fondo -- antes vivía dentro del panel, así que cerrarlo cortaba la música. */}
      {isSpotify && (
        <div
          className="fixed"
          style={
            !open || !spotifySlot
              ? { bottom: 0, left: 0, width: 1, height: 1, opacity: 0.01, zIndex: -1, pointerEvents: 'none' }
              : {
                  top: spotifySlot.top,
                  left: spotifySlot.left,
                  width: spotifySlot.width,
                  height: spotifySlot.height,
                  zIndex: 91,
                }
          }
        >
          <div ref={spotifyHostRef} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-xl" />
        </div>
      )}

      {isYouTube && (
        <div
          className="fixed pointer-events-none"
          style={
            collapsedPlayer || !youtubeSlot
              ? { bottom: 0, left: 0, width: 1, height: 1, opacity: 0.01, zIndex: -1 }
              : {
                  top: youtubeSlot.top,
                  left: youtubeSlot.left,
                  width: youtubeSlot.width,
                  height: youtubeSlot.height,
                  zIndex: 91,
                }
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
                    Pega el link de tu playlist de{' '}
                    <span className="text-gold-400 font-bold">YouTube Music</span> y suena completa
                    mientras juegas.
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
                    Con YouTube suenan completas y tienes play, siguiente y aleatorio. Spotify también
                    entra, con play y pausa desde acá, pero solo deja escuchar 30 segundos por canción
                    salvo que tengas Premium, y no permite aleatorio — son límites suyos, no del juego.
                  </p>
                </div>
              )}

              {isYouTube && (
                <>
                  {/* Hueco donde se apoya el video: el iframe es un elemento suelto que se posiciona
                      encima de estas coordenadas (ver youtubeSlotRef). El fondo oscuro evita el
                      parpadeo blanco mientras el reproductor carga. */}
                  <div
                    ref={youtubeSlotRef}
                    className="w-full aspect-video rounded-xl bg-slate-950 border border-slate-800"
                  />
                  {/* Controles propios: el iframe queda colapsado a 1px mientras jugás, así que
                      play/pausa/siguiente/aleatorio/volumen tienen que estar acá. */}
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
                    <button
                      type="button"
                      onClick={toggleShuffle}
                      aria-pressed={shuffle}
                      className={`btn-fx w-9 h-9 shrink-0 rounded-xl flex items-center justify-center border ${
                        shuffle
                          ? 'bg-gold-500/20 border-gold-500 text-gold-400'
                          : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-gold-500'
                      }`}
                      aria-label={shuffle ? 'Desactivar orden aleatorio' : 'Activar orden aleatorio'}
                      title={shuffle ? 'Aleatorio activado' : 'Reproducir en aleatorio'}
                    >
                      <Shuffle size={14} />
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
                    {shuffle
                      ? 'Aleatorio activado: la lista suena en orden salteado.'
                      : musicPlaying
                        ? 'Suena mientras juegas, incluso con esto cerrado.'
                        : 'Dale play una vez y sigue sonando en todo el juego.'}
                  </p>
                </>
              )}

              {isSpotify && (
                <>
                  {/* Hueco donde se apoya el reproductor de Spotify. Igual que con YouTube, el iframe
                      real vive fuera del panel para que cerrarlo no corte la canción. */}
                  <div
                    ref={spotifySlotRef}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800"
                    style={{ height: 152 }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMusic}
                      disabled={!spotifyReady}
                      className="btn-fx w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 flex items-center justify-center disabled:opacity-40"
                      aria-label={musicPlaying ? 'Pausar música' : 'Reproducir música'}
                    >
                      {musicPlaying ? <Pause size={15} /> : <Play size={15} />}
                    </button>
                    <p className="text-4xs text-slate-500 leading-relaxed flex-1">
                      {spotifyReady
                        ? 'Puedes controlarlo desde aquí o desde el reproductor.'
                        : 'Cargando el reproductor de Spotify…'}
                    </p>
                  </div>
                  {/* Se avisa acá y no solo en la pantalla de carga: si el jugador ya tenía una
                      playlist de Spotify guardada, nunca vería el aviso. */}
                  <p className="text-4xs text-burgundy-400/90 leading-relaxed">
                    Spotify solo deja 30 segundos por canción salvo que tengas sesión Premium abierta,
                    su reproductor tiene que quedar visible y no permite aleatorio ni saltar de tema —
                    son límites suyos. Para canciones completas de fondo y aleatorio, usá una playlist
                    de YouTube Music.
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
