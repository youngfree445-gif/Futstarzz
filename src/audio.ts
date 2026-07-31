// Motor de sonido del juego. Dos capas independientes a propósito:
//
//   1. SFX (esta capa): archivos cortos que el JUEGO dispara y controla -- gol, tarjeta, silbato.
//      Son nuestros, así que podemos reaccionar al partido con precisión.
//   2. Música (MusicPlayer.tsx): playlist de Spotify/YouTube que elige el JUGADOR. Va embebida en
//      un iframe de terceros, así que no podemos leer ni mezclar ese audio -- por eso está aparte.
//
// La capa 1 es la que da la sensación "FIFA": el iframe de la capa 2 es una caja negra.
//
// Los navegadores bloquean el audio hasta que el usuario interactúa con la página (autoplay
// policy). No es un bug que se pueda esquivar: hasta el primer gesto real, cualquier play() falla.
// Por eso todo acá falla en silencio en vez de tirar error, y el volumen/mute se persisten para
// que la preferencia sobreviva al reload.

export type SfxName =
  | 'goal'
  | 'card'
  | 'whistle'
  | 'whistle_end'
  | 'crowd_cheer'
  | 'crowd_boo'
  | 'click'
  | 'success'
  | 'fail';

// Los archivos van en public/sfx/ y se sirven desde la raíz del build. Ojo: acá NO se puede usar
// una ruta absoluta ('/sfx/...') porque los tres destinos tienen bases distintas -- GitHub Pages
// sirve bajo /Futstarzz/ y Capacitor desde file:// -- así que se resuelve contra BASE_URL, que Vite
// reemplaza en build time por la base de cada destino.
// Extensión configurable por efecto a propósito: los placeholders generados son .wav (se generan
// sin dependencias, ver public/sfx/README.md) pero al reemplazarlos por sonidos reales lo normal es
// bajar .mp3, que pesa mucho menos. Cambiar la extensión acá alcanza; no hay nada más que tocar.
const SFX_FILES: Record<SfxName, string> = {
  goal: 'sfx/goal.wav',
  card: 'sfx/card.wav',
  whistle: 'sfx/whistle.wav',
  // El final del partido son TRES pitidos, como en la cancha: un archivo aparte y no tres playSfx
  // seguidos, porque el mismo efecto no puede solaparse consigo mismo (se reinicia, ver playSfx).
  whistle_end: 'sfx/whistle_end.wav',
  crowd_cheer: 'sfx/crowd_cheer.wav',
  crowd_boo: 'sfx/crowd_boo.wav',
  click: 'sfx/click.wav',
  success: 'sfx/success.wav',
  fail: 'sfx/fail.wav'
};

// Volumen relativo por efecto: los archivos vienen masterizados a distinto nivel y el silbato o el
// click quedan estridentes al mismo volumen que un coro de estadio. Se ajusta acá y no editando los
// mp3 para poder cambiarlo sin volver a exportar nada.
const SFX_GAIN: Partial<Record<SfxName, number>> = {
  whistle: 0.5,
  whistle_end: 0.5,
  click: 0.35,
  card: 0.7,
  crowd_cheer: 0.85,
  crowd_boo: 0.85
};

const STORAGE_KEY = 'futstarzz_audio_prefs';

interface AudioPrefs {
  sfxVolume: number;
  sfxMuted: boolean;
}

const DEFAULT_PREFS: AudioPrefs = { sfxVolume: 0.7, sfxMuted: false };

function loadPrefs(): AudioPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw) as Partial<AudioPrefs>;
    return {
      // Number.isFinite descarta null/undefined/NaN de un localStorage corrupto o de una versión
      // vieja del formato, sin romper el arranque del juego por un dato basura.
      sfxVolume: Number.isFinite(parsed.sfxVolume)
        ? Math.min(1, Math.max(0, parsed.sfxVolume as number))
        : DEFAULT_PREFS.sfxVolume,
      sfxMuted: typeof parsed.sfxMuted === 'boolean' ? parsed.sfxMuted : DEFAULT_PREFS.sfxMuted
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

let prefs = loadPrefs();

function savePrefs() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Modo incógnito o storage lleno: la sesión sigue andando, solo no se recuerda la preferencia.
  }
}

// Un <audio> por efecto, creado una sola vez y reutilizado. Crear un Audio nuevo en cada disparo
// deja decenas de elementos colgando y en móvil se nota; el precio es que un mismo efecto no puede
// solaparse consigo mismo (se reinicia), que para estos sonidos es lo esperable igual.
const pool = new Map<SfxName, HTMLAudioElement>();

// Un archivo que falta (404) o un codec no soportado dispara el error en cada intento. Se marca el
// efecto como roto tras el primer fallo para no reintentar ni spamear la consola: el juego tiene
// que sonar incompleto, no trabarse.
const broken = new Set<SfxName>();

function getElement(name: SfxName): HTMLAudioElement | null {
  if (broken.has(name)) return null;

  let el = pool.get(name);
  if (!el) {
    // import.meta.env.BASE_URL ya viene con la barra final en las tres bases ('/', '/Futstarzz/',
    // './'), así que se concatena directo.
    el = new Audio(`${import.meta.env.BASE_URL}${SFX_FILES[name]}`);
    el.preload = 'auto';
    el.addEventListener('error', () => broken.add(name));
    pool.set(name, el);
  }
  return el;
}

/**
 * Dispara un efecto. Seguro de llamar en cualquier momento: si el navegador todavía no habilitó el
 * audio, si el archivo no existe o si está muteado, no hace nada y no lanza.
 */
export function playSfx(name: SfxName) {
  if (prefs.sfxMuted || prefs.sfxVolume <= 0) return;

  const el = getElement(name);
  if (!el) return;

  el.volume = Math.min(1, Math.max(0, prefs.sfxVolume * (SFX_GAIN[name] ?? 1)));
  // Rebobinar permite re-disparar el mismo efecto antes de que termine (goles seguidos, varios
  // clicks): sin esto el segundo play() sobre un audio ya sonando se ignora.
  el.currentTime = 0;

  // play() devuelve una promesa que rechaza si el autoplay está bloqueado. Sin catch queda como
  // "unhandled rejection" en consola en cada click previo al primer gesto del usuario.
  void el.play().catch(() => {});
}

/** Precarga los archivos para que el primer gol no llegue tarde por estar recién descargando. */
export function preloadSfx() {
  (Object.keys(SFX_FILES) as SfxName[]).forEach(name => {
    const el = getElement(name);
    el?.load();
  });
}

export function getSfxVolume() {
  return prefs.sfxVolume;
}

export function isSfxMuted() {
  return prefs.sfxMuted;
}

export function setSfxVolume(volume: number) {
  prefs = { ...prefs, sfxVolume: Math.min(1, Math.max(0, volume)) };
  savePrefs();
}

export function setSfxMuted(muted: boolean) {
  prefs = { ...prefs, sfxMuted: muted };
  savePrefs();
  if (muted) {
    // Cortar lo que esté sonando ahora: mutear y seguir escuchando la cola del gol anterior se
    // siente como que el botón no funcionó.
    pool.forEach(el => {
      el.pause();
      el.currentTime = 0;
    });
  }
}
