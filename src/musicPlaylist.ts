// Parseo de URLs de playlist a URL de embed. Vive aparte del componente para poder razonarlo (y
// testearlo) sin React de por medio.
//
// Se acepta lo que el usuario copia del botón "Compartir", que según de dónde salga puede venir con
// query params (?si=..., &list=...), como link corto, o ya como URI de Spotify. Todas esas formas
// tienen que funcionar: pedirle al jugador una forma canónica es fricción innecesaria.

export type MusicProvider = 'spotify' | 'youtube';

export interface ParsedPlaylist {
  provider: MusicProvider;
  embedUrl: string;
  /** URL original, para poder re-mostrarla en el input y persistirla tal como la pegó el usuario. */
  sourceUrl: string;
}

// Spotify: se soportan playlist, album y artist porque los tres embeben igual y no hay razón para
// rechazar un álbum. open.spotify.com puede traer prefijo de idioma (/intl-es/) en links copiados
// desde la app en español.
const SPOTIFY_RE =
  /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|artist|track)\/([A-Za-z0-9]+)/i;
// Formato URI interno (spotify:playlist:xxx), que es lo que copia "Compartir > Copiar URI de Spotify".
const SPOTIFY_URI_RE = /^spotify:(playlist|album|artist|track):([A-Za-z0-9]+)$/i;

// YouTube: el ?list= puede venir de music.youtube.com, youtube.com o del link corto youtu.be. Los
// IDs de playlist arrancan con PL/OLAK/RD y admiten - y _.
const YOUTUBE_LIST_RE = /[?&]list=([A-Za-z0-9_-]+)/;
// Un video suelto también sirve: si alguien pega un video en vez de una playlist, mejor reproducirlo
// que rechazarlo.
const YOUTUBE_VIDEO_RE =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

/**
 * Convierte una URL pegada por el usuario en una URL de embed lista para un iframe.
 * Devuelve null si no se reconoce, para que la UI pueda mostrar un error claro.
 */
export function parsePlaylistUrl(input: string): ParsedPlaylist | null {
  const raw = input.trim();
  if (!raw) return null;

  const spotifyUri = raw.match(SPOTIFY_URI_RE);
  if (spotifyUri) {
    const [, kind, id] = spotifyUri;
    return {
      provider: 'spotify',
      embedUrl: `https://open.spotify.com/embed/${kind.toLowerCase()}/${id}`,
      sourceUrl: raw
    };
  }

  const spotify = raw.match(SPOTIFY_RE);
  if (spotify) {
    const [, kind, id] = spotify;
    return {
      provider: 'spotify',
      embedUrl: `https://open.spotify.com/embed/${kind.toLowerCase()}/${id}`,
      sourceUrl: raw
    };
  }

  // El orden importa: un link de YouTube puede tener v= y list= a la vez (un video DENTRO de una
  // playlist). Si el usuario compartió eso, quiere la playlist entera, no el video suelto.
  const ytList = raw.match(YOUTUBE_LIST_RE);
  if (ytList && /(?:youtube\.com|youtu\.be|music\.youtube\.com)/i.test(raw)) {
    return {
      provider: 'youtube',
      embedUrl: buildYouTubeEmbed({ listId: ytList[1] }),
      sourceUrl: raw
    };
  }

  const ytVideo = raw.match(YOUTUBE_VIDEO_RE);
  if (ytVideo) {
    return {
      provider: 'youtube',
      embedUrl: buildYouTubeEmbed({ videoId: ytVideo[1] }),
      sourceUrl: raw
    };
  }

  return null;
}

/**
 * Arma la URL de embed de YouTube para reproducción continua de fondo.
 *
 * Detalles que importan y que no son obvios:
 *
 * - Se usa `www.youtube.com` y NO `youtube-nocookie.com`: el dominio sin cookies rechaza bastantes
 *   playlists (sobre todo los mixes/radios de YouTube Music, los IDs que empiezan con RD), y el
 *   iframe queda en negro con "Video no disponible". Preferimos que suene.
 * - `loop=1` necesita que la playlist se declare igual: con `list` alcanza, pero para un video
 *   suelto YouTube exige además `playlist=<mismo id>` o el loop se ignora en silencio.
 * - `playsinline=1` evita que iOS abra el reproductor a pantalla completa y tape el juego.
 * - `enablejsapi=1` habilita el control por postMessage (play/pausa/volumen desde el widget).
 * - `autoplay=1` casi nunca alcanza por sí solo (los navegadores exigen un gesto del usuario), pero
 *   sí sirve para reanudar cuando el jugador ya interactuó con el reproductor en esta carga.
 */
function buildYouTubeEmbed({ listId, videoId }: { listId?: string; videoId?: string }): string {
  const params = new URLSearchParams({
    enablejsapi: '1',
    autoplay: '1',
    loop: '1',
    playsinline: '1',
    // Sin esto YouTube encadena "videos recomendados" ajenos al terminar la playlist: en un juego
    // eso significa que de golpe suena cualquier cosa.
    rel: '0',
    modestbranding: '1'
  });

  // origin es requerido por la IFrame API para aceptar los postMessage. En Capacitor el origin es
  // capacitor://localhost o file://, que YouTube rechaza, así que ahí se omite: el reproductor
  // funciona igual, solo sin control programático.
  const origin = typeof location !== 'undefined' ? location.origin : '';
  if (origin && /^https?:/.test(origin)) params.set('origin', origin);

  if (listId) {
    params.set('list', listId);
    return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
  }

  // Video suelto: hay que repetir el id en `playlist` para que loop=1 tenga efecto.
  params.set('playlist', videoId!);
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

const STORAGE_KEY = 'futstarzz_music_playlist';

export function loadSavedPlaylist(): ParsedPlaylist | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Se re-parsea la URL original en vez de confiar en el embedUrl guardado: si cambia la forma de
    // construir el embed (params nuevos), la playlist guardada se beneficia sin migración.
    const parsed = JSON.parse(raw) as { sourceUrl?: string };
    return parsed.sourceUrl ? parsePlaylistUrl(parsed.sourceUrl) : null;
  } catch {
    return null;
  }
}

export function savePlaylist(playlist: ParsedPlaylist | null) {
  try {
    if (playlist) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sourceUrl: playlist.sourceUrl }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Igual que en audio.ts: sin storage el widget funciona, solo no recuerda la playlist.
  }
}
