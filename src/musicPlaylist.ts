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
    // enablejsapi=1 es lo que permite controlar el reproductor por postMessage desde el juego
    // (bajar el volumen en un gol). origin evita warnings de seguridad de la IFrame API.
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${ytList[1]}&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`,
      sourceUrl: raw
    };
  }

  const ytVideo = raw.match(YOUTUBE_VIDEO_RE);
  if (ytVideo) {
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytVideo[1]}?enablejsapi=1&origin=${encodeURIComponent(location.origin)}`,
      sourceUrl: raw
    };
  }

  return null;
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
