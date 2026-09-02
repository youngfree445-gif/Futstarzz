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
  | 'fail'
  // El golpe a la pelota: suena en cada jugada resuelta, que es lo que más veces pasa en un
  // partido. Por eso va bajo -- ver SFX_GAIN.
  | 'pase'
  // El relator gritando el gol. Están en inglés, así que sólo suenan donde corresponde
  // (ver src/relatoDelGol.ts).
  | 'relato_gol_1'
  | 'relato_gol_2'
  // El guiño: el gol en morse, que suena alguna que otra vez.
  | 'gol_morse'
  // Los dos que no son del partido en sí: la gala del campeón y la pantalla de después.
  | 'campeon'
  | 'post_partido';

// Los archivos van en public/sfx/ y se sirven desde la raíz del build. Ojo: acá NO se puede usar
// una ruta absoluta ('/sfx/...') porque los tres destinos tienen bases distintas -- GitHub Pages
// sirve bajo /Futstarzz/ y Capacitor desde file:// -- así que se resuelve contra BASE_URL, que Vite
// reemplaza en build time por la base de cada destino.
// Extensión configurable por efecto a propósito: los placeholders generados son .wav (se generan
// sin dependencias, ver public/sfx/README.md) pero al reemplazarlos por sonidos reales lo normal es
// bajar .mp3, que pesa mucho menos. Cambiar la extensión acá alcanza; no hay nada más que tocar.
//
// SEIS YA SON SONIDOS DE VERDAD (.mp3) y cuatro siguen siendo el placeholder generado (.wav). No es
// una inconsistencia a medio arreglar: es que de esos cuatro todavía no hay grabación. Cuando
// aparezca, se cambia la extensión acá y no hay nada más que tocar -- que es exactamente para lo
// que esta tabla existe.
const SFX_FILES: Record<SfxName, string> = {
  goal: 'sfx/goal.mp3',
  card: 'sfx/card.wav',
  whistle: 'sfx/whistle.mp3',
  // El final del partido son TRES pitidos, como en la cancha: un archivo aparte y no tres playSfx
  // seguidos, porque el mismo efecto no puede solaparse consigo mismo (se reinicia, ver playSfx).
  whistle_end: 'sfx/whistle_end.mp3',
  crowd_cheer: 'sfx/crowd_cheer.mp3',
  crowd_boo: 'sfx/crowd_boo.wav',
  click: 'sfx/click.wav',
  success: 'sfx/success.wav',
  fail: 'sfx/fail.wav',
  pase: 'sfx/pase.mp3',
  relato_gol_1: 'sfx/relato_gol_1.mp3',
  relato_gol_2: 'sfx/relato_gol_2.mp3',
  gol_morse: 'sfx/gol_morse.mp3',
  campeon: 'sfx/campeon.mp3',
  post_partido: 'sfx/post_partido.mp3'
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
  crowd_boo: 0.85,
  // Los sonidos reales vienen bastante más calientes que los placeholders generados: el festejo de
  // la gala y el de la pantalla de después son multitudes enteras y a volumen pleno tapan todo.
  // El golpe a la pelota suena varias veces por partido: al volumen del gol cansaría enseguida.
  pase: 0.45,
  // El relator va POR ENCIMA del festejo: si compite con la multitud no se entiende lo que
  // dice, y entonces no es un relato, es ruido con acento.
  relato_gol_1: 1,
  relato_gol_2: 1,
  // El morse va por debajo: es un guiño encima del festejo, no un anuncio.
  gol_morse: 0.55,
  campeon: 0.7,
  post_partido: 0.6
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

/**
 * Las COPIAS que están sonando de cada efecto, para no dejar crecer la cuenta sin límite.
 *
 * Sólo se llena cuando un efecto vuelve a dispararse mientras el anterior todavía suena (ver
 * playSfx): en el caso normal no se crea ningún elemento de más.
 */
const sonando = new Map<SfxName, HTMLAudioElement[]>();

/** Cuántas veces puede encimarse un MISMO efecto. Más que esto no es riqueza, es barro. */
const MAX_COPIAS = 3;

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

  const base = getElement(name);
  if (!base) return;

  const volumen = Math.min(1, Math.max(0, prefs.sfxVolume * (SFX_GAIN[name] ?? 1)));

  // LOS SONIDOS SE SUPERPONEN, NO SE PISAN.
  //
  // Antes había UN <audio> por efecto y volver a dispararlo lo rebobinaba. Con los placeholders de
  // cuatro kilos no se notaba, pero los archivos reales duran de verdad -- el festejo son casi
  // veinte segundos, el golpe a la pelota varios -- así que el segundo disparo CORTABA el primero
  // a mitad y dejaba un hueco. Reportado tal cual: "se cortan y de la nada hay un silencio incómodo
  // cuando alguien pone un pase o hace un tiro y no es gol".
  //
  // Ahora, si el efecto ya está sonando, se reproduce una COPIA encima. Es lo que hace una
  // transmisión: el segundo pase no apaga al primero, se encima.
  //
  // Con tope: pasadas unas pocas copias simultáneas del MISMO efecto deja de sumarse, porque a
  // partir de ahí no es riqueza sino barro (y son elementos de audio de verdad, no salen gratis).
  const yaSuena = !base.paused && !base.ended && base.currentTime > 0;
  let el = base;
  if (yaSuena) {
    const vivas = (sonando.get(name) ?? []).filter(c => !c.paused && !c.ended);
    if (vivas.length >= MAX_COPIAS) { sonando.set(name, vivas); return; }
    el = base.cloneNode(true) as HTMLAudioElement;
    vivas.push(el);
    sonando.set(name, vivas);
  }

  el.volume = volumen;
  // VA EN try/catch, y no es paranoia: asignar `currentTime` sobre un elemento que todavía no
  // cargó los metadatos TIRA (InvalidStateError), y ese throw es SÍNCRONO -- el .catch() de play()
  // no lo agarra. Con los placeholders .wav no pasaba nunca porque pesaban cuatro kilos y ya
  // estaban listos; con los mp3 reales (medio mega el festejo) en una conexión lenta o en la
  // primera vuelta sí puede pasar, y entonces la excepción sale disparada en medio del tick del
  // partido y se lleva puesto lo que venía después.
  try {
    el.currentTime = 0;
  } catch {
    // Todavía no está listo para rebobinar: se lo deja sonar desde donde esté, que es mejor que
    // no sonar.
  }

  // play() devuelve una promesa que rechaza si el autoplay está bloqueado. Sin catch queda como
  // "unhandled rejection" en consola en cada click previo al primer gesto del usuario.
  //
  // Y si la que fallo era una COPIA encimada, se reintenta con el elemento de siempre. Una copia es
  // un elemento nuevo, y en iOS nace bloqueada aunque el original este habilitado (ver
  // desbloquearAudio): sin esto, el segundo gol seguido se quedaba mudo justo en la plataforma
  // donde se reporto el problema. Rebobinar el original corta el festejo anterior, que es peor que
  // encimarlo pero muchisimo mejor que el silencio.
  void el.play().catch(() => {
    if (el === base) return;
    try { base.currentTime = 0; } catch { /* todavia sin metadatos */ }
    void base.play().catch(() => {});
  });
}

/**
 * HABILITA EL AUDIO. Hay que llamarlo DESDE UN GESTO DEL JUGADOR, y de ahí sale todo su sentido.
 *
 * Safari en iOS no bloquea "el audio de la página": bloquea CADA elemento <audio> por separado,
 * hasta que ese elemento concreto se reprodujo una vez dentro de un gesto. Después de eso queda
 * habilitado para siempre y ya se lo puede disparar por código.
 *
 * Eso explica un sintoma que parecia imposible: en el iPhone se escuchaba la hinchada de fondo y NO
 * se escuchaba ningun gol. El ambiente arranca en el mismo toque de "Disputar Partido" -- o sea
 * dentro del gesto --, mientras que el gol suena minutos despues desde un temporizador, sobre un
 * elemento que nunca se toco. Safari lo rechazaba sin decir nada: play() devuelve una promesa
 * rechazada y el .catch() de playSfx se la come, que es lo correcto para el autoplay pero deja este
 * caso invisible.
 *
 * preloadSfx() NO alcanza: load() baja el archivo pero no cuenta como reproduccion, asi que el
 * elemento sigue bloqueado. Hay que reproducir de verdad, y por eso esto suena MUTEADO y pausa en
 * el acto: el jugador no oye nada, y los quince efectos quedan listos para el resto de la partida.
 *
 * En Chrome de escritorio y en Android no hace falta -- ahi el permiso es de la pagina entera -- y
 * tampoco molesta: son quince play() muteados que terminan antes de que se suelte el dedo.
 */
let desbloqueado = false;
export function desbloquearAudio() {
  if (desbloqueado) return;
  desbloqueado = true;
  (Object.keys(SFX_FILES) as SfxName[]).forEach(name => {
    const el = getElement(name);
    if (!el) return;
    const volumen = el.volume;
    el.muted = true;
    // El pause() va DENTRO del then: pausar antes de que la promesa resuelva aborta la
    // reproduccion y el elemento no llega a quedar habilitado.
    void el.play().then(() => {
      el.pause();
      try { el.currentTime = 0; } catch { /* todavia sin metadatos */ }
      el.muted = false;
      el.volume = volumen;
    }).catch(() => {
      el.muted = false;
      el.volume = volumen;
    });
  });
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
    // Y las copias encimadas, que si no siguen sonando solas con el juego en silencio.
    sonando.forEach(copias => copias.forEach(c => { c.pause(); c.currentTime = 0; }));
    sonando.clear();
  }
}
