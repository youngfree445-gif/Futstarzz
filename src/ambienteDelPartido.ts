// EL ESTADIO SONANDO DEBAJO DE TODO, los noventa minutos.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ES UNA CAPA APARTE Y NO UN SFX MÁS
// ---------------------------------------------------------------------------------------------
//
// Los efectos de src/audio.ts son disparos: un gol, una tarjeta, un silbato. Empiezan, terminan y se
// olvidan, y por eso ahí alcanza con un `<audio>` por efecto que se rebobina.
//
// Esto es lo contrario: un sonido que tiene que estar SIEMPRE y que nadie dispara. Necesita cosas
// que un disparo no necesita -- encadenar una pista con la siguiente sin que se oiga el corte,
// bajar solo cuando pasa algo importante, y sobre todo APAGARSE cuando corresponde. Meterlo en el
// motor de efectos habría obligado a que ese motor entienda de bucles y de fundidos para un solo
// caso.
//
// ---------------------------------------------------------------------------------------------
// UNA HINCHADA POR PARTIDO, Y SIEMPRE LA MISMA PARA EL MISMO CLUB
// ---------------------------------------------------------------------------------------------
//
// La primera versión iba intercalando pistas distintas durante el partido, para que el bucle no se
// delatara. Suena razonable y está mal: una hinchada tiene CARÁCTER, y cambiar de pista en el
// minuto 40 es cambiarle la identidad a la cancha en la mitad del partido. Es lo único que una
// transmisión de verdad nunca hace.
//
// Ahora la pista se elige UNA vez por partido, y se elige con una semilla del club local. Dos
// consecuencias, las dos buenas:
//
//   . Junior suena siempre a Junior y el mismo rival suena siempre igual. Eso es una diferencia
//     entre canchas que el jugador puede reconocer, no un azar que lo confunde.
//   . El repertorio se nota igual, porque lo que cambia es DE CANCHA EN CANCHA en vez de dentro del
//     mismo partido, que es como pasa en la realidad.
//
// ¿Y la costura del bucle, que era el problema original? La resuelve el mismo cruce que ya estaba:
// en vez de encadenar dos pistas distintas, encadena la pista CONSIGO MISMA. Misma máquina, sin la
// costura y sin perder la identidad.
//
// ---------------------------------------------------------------------------------------------
// LAS TRES REGLAS QUE NO SE PUEDEN ROMPER
// ---------------------------------------------------------------------------------------------
//
//   1. SE CARGA CUANDO EMPIEZA EL PARTIDO, no al abrir el juego. Son varios megas: descargarlos en
//      el arranque le cobraría la espera a todo el mundo, incluido el que nunca juega un partido en
//      esa sesión.
//   2. SE APAGA SIEMPRE. Al terminar el partido, al salir de la pantalla, y también al esconder la
//      pestaña -- si no, seguís escuchando un estadio en otra solapa, que es la clase de cosa por la
//      que se cierra un juego y no se vuelve.
//   3. OBEDECE AL MISMO BOTÓN QUE LOS EFECTOS. El jugador apretó "silencio", no "silencio menos el
//      estadio". Por eso lee el volumen y el mute de src/audio.ts en vez de tener los suyos.

import { getSfxVolume, isSfxMuted } from './audio';

// ---------------------------------------------------------------------------------------------
// LAS HINCHADAS, POR REGIÓN
// ---------------------------------------------------------------------------------------------
//
// Una cancha sudamericana y una europea no suenan igual, y no es un matiz: en Sudamérica hay bombo
// y trompeta todo el partido, y en Europa el ruido base es la masa cantando. Sonaba raro escuchar
// una murga en Old Trafford.
//
// Cada club sortea entre las de SU región más las generales, que son multitudes sin acento y
// funcionan en cualquier lado. Así una liga chica --que no tiene grabación propia-- no se queda sin
// sonido, y las regiones que sí la tienen suenan como corresponde.
const LATAM = ['sfx/ambiente/latam_1.mp3', 'sfx/ambiente/latam_2.mp3'];
const EUROPA = ['sfx/ambiente/europa_1.mp3', 'sfx/ambiente/europa_2.mp3'];
const GENERALES = [
  'sfx/ambiente/general_1.mp3',
  'sfx/ambiente/general_2.mp3',
  'sfx/ambiente/general_3.mp3',
  'sfx/ambiente/general_4.mp3',
  'sfx/ambiente/general_5.mp3',
];

/** Todas, para quien necesite recorrerlas (el validador comprueba que los archivos existan). */
export const PISTAS = [...LATAM, ...EUROPA, ...GENERALES];

/**
 * De qué región es una liga.
 *
 * Se mira el nombre de la liga (`Club.league`, que guarda el país) y no la confederación, porque es
 * el dato que TODOS los clubes tienen. Lo que no está en ninguna de las dos listas -- "Resto del
 * Mundo", Estados Unidos, una liga suelta -- cae en las generales, que es la respuesta honesta:
 * no tenemos una grabación de esa hinchada.
 */
const LIGAS_LATAM = new Set([
  'Argentina', 'Brasileña', 'Colombiana', 'Mexicana', 'Chilena', 'Ecuatoriana',
  'Peruana', 'Uruguaya', 'Boliviana', 'Venezolana', 'Paraguaya',
]);
const LIGAS_EUROPA = new Set([
  'Italiana', 'Inglesa', 'Española', 'Holandesa', 'Francesa', 'Alemana', 'Portuguesa',
  'Belga', 'Griega', 'Checa', 'Noruega', 'Danesa', 'Turca', 'Austríaca', 'Escocesa',
  'Suiza', 'Azerí', 'Chipriota', 'Kazaja', 'Húngara', 'Serbia', 'Croata', 'Búlgara',
  'Sueca', 'Rumana', 'Israelí',
]);

/** Las pistas que le pueden tocar a una cancha: las de su región más las generales. */
export function hinchadasDe(liga: string | null | undefined): string[] {
  if (liga && LIGAS_LATAM.has(liga)) return [...LATAM, ...GENERALES];
  if (liga && LIGAS_EUROPA.has(liga)) return [...EUROPA, ...GENERALES];
  return GENERALES;
}

/**
 * Cuánto suena el ambiente respecto del volumen general.
 *
 * Bajo a propósito: es el fondo. Si compite con el gol o con el silbato deja de ser ambiente y pasa
 * a ser ruido encima de lo que el jugador está tratando de escuchar.
 */
const VOLUMEN_DEL_AMBIENTE = 0.35;

/** Segundos que dura el cruce entre una pista y la siguiente. */
const CRUCE = 2.5;

/** Cada cuánto se revisa si hay que cruzar, en milisegundos. */
const LATIDO = 250;

/** Cuánto baja el ambiente cuando pasa algo importante, y cuánto tarda en volver. */
const AGACHADA = 0.35;
const SEGUNDOS_PARA_VOLVER = 1.8;

interface Sonando {
  el: HTMLAudioElement;
  pista: string;
}

let actual: Sonando | null = null;
let entrando: Sonando | null = null;
let latido: number | null = null;
/** La pista de ESTE partido. Se elige una vez al arrancar y no cambia hasta el pitazo final. */
let laDeHoy = GENERALES[0];
/** Multiplicador temporal para agacharse cuando suena un gol. Vuelve a 1 solo. */
let agachado = 1;
let volviendo: number | null = null;

/** El volumen que le toca al ambiente ahora mismo, mirando las preferencias del jugador. */
function volumenObjetivo(): number {
  if (isSfxMuted()) return 0;
  return Math.max(0, Math.min(1, getSfxVolume() * VOLUMEN_DEL_AMBIENTE * agachado));
}

/**
 * QUÉ HINCHADA SUENA EN ESTA CANCHA.
 *
 * Sale de una semilla -- el id del club local -- y no de un sorteo, para que la misma cancha suene
 * siempre igual. Si fuera al azar, tu propio estadio cambiaría de hinchada cada fecha y la idea se
 * caería sola: lo que hace que esto valga es que se pueda RECONOCER.
 *
 * Sin semilla (un amistoso, una selección, lo que sea que no tenga club) cae en la primera, que es
 * una cancha genérica y correcta.
 */
export function pistaDeLaCancha(semilla: string | null | undefined, liga?: string | null): string {
  const posibles = hinchadasDe(liga);
  if (!semilla) return posibles[0];
  let h = 0;
  for (let i = 0; i < semilla.length; i++) h = (h * 31 + semilla.charCodeAt(i)) | 0;
  return posibles[Math.abs(h) % posibles.length];
}

function crear(pista: string, volumen: number): Sonando {
  const el = new Audio(`${import.meta.env.BASE_URL}${pista}`);
  el.volume = volumen;
  el.preload = 'auto';
  // Nada de `loop`: el encadenado lo maneja el latido, y una pista en bucle nunca dispararía el
  // cruce con la siguiente.
  void el.play().catch(() => {});
  return { el, pista };
}

function apagar(s: Sonando | null) {
  if (!s) return;
  s.el.pause();
  s.el.src = '';
}

/** El latido: cruza pistas, mantiene el volumen al día y limpia lo que terminó. */
function tick() {
  const objetivo = volumenObjetivo();

  if (entrando) {
    // Cruce en curso: uno sube, el otro baja.
    const avance = Math.min(1, (entrando.el.currentTime || 0) / CRUCE);
    entrando.el.volume = objetivo * avance;
    if (actual) actual.el.volume = objetivo * (1 - avance);
    if (avance >= 1) {
      apagar(actual);
      actual = entrando;
      entrando = null;
    }
    return;
  }

  if (!actual) return;
  actual.el.volume = objetivo;

  // ¿Le quedan menos segundos que el cruce? Entonces arranca la siguiente.
  const dura = Number.isFinite(actual.el.duration) ? actual.el.duration : 0;
  const queda = dura - (actual.el.currentTime || 0);
  // `dura === 0` mientras el navegador todavía no leyó los metadatos: ahí no se decide nada.
  if (dura > 0 && queda <= CRUCE) {
    // La MISMA pista otra vez: el cruce ya no cambia de hinchada, sólo tapa la costura del bucle.
    entrando = crear(actual.pista, 0);
  }
}

/** ¿Está sonando el estadio? */
export function ambienteSonando(): boolean {
  return actual !== null;
}

/**
 * Arranca el ambiente. Llamar dos veces no lo duplica.
 *
 * Tiene que salir de un gesto del jugador (tocar "Disputar Partido" lo es): antes del primer gesto
 * el navegador bloquea cualquier reproducción y no hay forma de esquivarlo.
 */
export function arrancarAmbiente(semillaDeLaCancha?: string | null, ligaDeLaCancha?: string | null) {
  if (actual || typeof window === 'undefined') return;
  // La semilla sólo se lee al ARRANCAR. Si la pestaña se esconde y vuelve, se retoma la misma
  // hinchada: cambiar de cancha por haber mirado otra solapa sería lo peor de los dos mundos.
  if (semillaDeLaCancha !== undefined) laDeHoy = pistaDeLaCancha(semillaDeLaCancha, ligaDeLaCancha);
  agachado = 1;
  actual = crear(laDeHoy, volumenObjetivo());
  latido = window.setInterval(tick, LATIDO);
}

/** Corta el ambiente y suelta los archivos. Seguro de llamar aunque no esté sonando. */
export function pararAmbiente() {
  if (latido != null) { clearInterval(latido); latido = null; }
  if (volviendo != null) { clearInterval(volviendo); volviendo = null; }
  apagar(actual); apagar(entrando);
  actual = null; entrando = null;
  agachado = 1;
}

/**
 * EL ESTADIO SE AGACHA cuando pasa algo importante.
 *
 * Sin esto el gol compite con el mismo público que lo está festejando y el resultado es barro. Baja
 * de golpe y vuelve solo en un par de segundos, que es lo que hace una transmisión de verdad cuando
 * el relator levanta la voz.
 */
export function agacharAmbiente() {
  if (!actual) return;
  agachado = AGACHADA;
  if (volviendo != null) clearInterval(volviendo);
  const pasos = Math.max(1, Math.round((SEGUNDOS_PARA_VOLVER * 1000) / LATIDO));
  let n = 0;
  volviendo = window.setInterval(() => {
    n++;
    agachado = AGACHADA + (1 - AGACHADA) * (n / pasos);
    if (n >= pasos) {
      agachado = 1;
      if (volviendo != null) { clearInterval(volviendo); volviendo = null; }
    }
  }, LATIDO);
}
