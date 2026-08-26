// EL NAVEGADOR DE MENTIRA, PARA JUGAR EL JUEGO DE VERDAD.
//
// Monta un DOM completo (jsdom) y le pone encima lo poco que jsdom no trae y el juego sí usa:
// audio, matchMedia, observers. Nada de esto toca la lógica del juego -- son las paredes del
// navegador, no el juego.
//
// Va en un archivo aparte y se importa ANTES que el bundle de la app a propósito: React y varios
// módulos del juego leen `document`/`window` en su nivel superior, así que si el DOM no existe ya
// cuando el bundle se evalúa, revienta antes de la primera línea de juego.
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:3000/',
  pretendToBeVisual: true,
});

const { window } = dom;

// navigator es de sólo lectura en Node >= 21, así que se pisa con defineProperty.
const poner = (nombre, valor) => {
  Object.defineProperty(globalThis, nombre, { value: valor, writable: true, configurable: true });
};

poner('window', window);
poner('document', window.document);
poner('navigator', window.navigator);
poner('location', window.location);
poner('history', window.history);
poner('localStorage', window.localStorage);
poner('sessionStorage', window.sessionStorage);
poner('getComputedStyle', window.getComputedStyle.bind(window));
poner('requestAnimationFrame', window.requestAnimationFrame.bind(window));
poner('cancelAnimationFrame', window.cancelAnimationFrame.bind(window));

for (const k of [
  'HTMLElement', 'HTMLInputElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'HTMLIFrameElement',
  'Element', 'Node', 'NodeList', 'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent', 'PointerEvent',
  'Image', 'Audio', 'HTMLAudioElement', 'HTMLMediaElement', 'HTMLButtonElement', 'DOMParser', 'SVGElement', 'CSSStyleDeclaration', 'FormData', 'Blob', 'File', 'URL',
]) {
  if (window[k]) poner(k, window[k]);
}

// --- lo que jsdom no implementa y el juego toca ---------------------------------------------
window.HTMLMediaElement.prototype.play = function () { return Promise.resolve(); };
window.HTMLMediaElement.prototype.pause = function () {};
window.HTMLMediaElement.prototype.load = function () {};
window.HTMLElement.prototype.scrollIntoView = function () {};
window.scrollTo = () => {};

class AudioContextFalso {
  constructor() { this.state = 'running'; this.destination = {}; this.currentTime = 0; }
  createGain() { return { gain: { value: 1, setValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
  createOscillator() { return { frequency: { value: 440, setValueAtTime() {} }, type: 'sine', connect() {}, start() {}, stop() {}, disconnect() {} }; }
  createBufferSource() { return { buffer: null, connect() {}, start() {}, stop() {}, disconnect() {} }; }
  createBuffer() { return { getChannelData: () => new Float32Array(1) }; }
  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
}
poner('AudioContext', AudioContextFalso);
window.AudioContext = AudioContextFalso;
window.webkitAudioContext = AudioContextFalso;

window.matchMedia = () => ({
  matches: false, media: '', onchange: null,
  addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
});
poner('matchMedia', window.matchMedia);

// EL CANVAS. jsdom no lo implementa: getContext('2d') devuelve null.
//
// Eso frenaba el juego de verdad, y costó entender por qué. La animación de la jugada
// (PlayHighlightCanvas) arranca con `if (!ctx) return;`, así que sin contexto NUNCA llamaba a
// onComplete: la decisión se quedaba en la etapa 'animating', que no dibuja ningún botón, y el
// reloj del partido se para mientras haya una decisión activa. Resultado: el partido congelado en
// el minuto 15 sin nada que apretar. En un navegador de verdad no pasa -- es una carencia de este
// entorno, no del juego.
const contextoFalso = () => new Proxy({}, {
  get(_, prop) {
    if (prop === 'canvas') return { width: 300, height: 150 };
    if (prop === 'measureText') return () => ({ width: 10 });
    if (prop === 'createLinearGradient' || prop === 'createRadialGradient' || prop === 'createPattern') {
      return () => ({ addColorStop() {} });
    }
    if (prop === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
    // Cualquier propiedad de estado (fillStyle, lineWidth...) se lee como valor y se escribe sola.
    if (typeof prop === 'string' && /^[a-z]/.test(prop)) return () => {};
    return () => {};
  },
  set() { return true; },
});
window.HTMLCanvasElement.prototype.getContext = function () { return contextoFalso(); };
window.HTMLCanvasElement.prototype.toDataURL = function () { return 'data:image/png;base64,'; };

class ObservadorNulo { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
for (const k of ['IntersectionObserver', 'ResizeObserver', 'MutationObserver']) {
  if (!window[k]) { window[k] = ObservadorNulo; }
  poner(k, window[k]);
}

// La energía baja abre un confirm(): en el juego el jugador dice que sí y sale a la cancha.
window.confirm = () => true;
window.alert = () => {};
window.prompt = () => null;
poner('confirm', window.confirm);
poner('alert', window.alert);

// Nada de red: el banco tiene que jugar igual con el wifi apagado.
poner('fetch', async () => ({ ok: false, status: 0, json: async () => ({}), text: async () => '' }));

// Ruido de jsdom que no dice nada del juego (CSS que no parsea, media que no carga).
const errorReal = console.error;
console.error = (...args) => {
  const s = String(args[0] ?? '');
  if (/Could not parse CSS|Not implemented: HTMLMediaElement|jsdom/i.test(s)) return;
  errorReal(...args);
};

// LOS ERRORES QUE MATAN LA APP SE GUARDAN, no se pierden.
//
// Cuando React tira en un render y nadie lo atrapa, desmonta el arbol entero: el banco se queda
// mirando un DOM vacio y lo reporta como "ATASCO. Pantalla: DESCONOCIDA. Botones: []" -- que no
// dice nada de la causa. Medido en el barrido de tres temporadas: cinco de diecinueve carreras
// murieron asi, sin dejar rastro de por que.
//
// Se guardan en global para que correr.mjs los imprima con el informe.
globalThis.__errores = [];
const anotar = (donde, e) => {
  const linea = `${donde}: ${e?.stack ?? e?.message ?? String(e)}`.slice(0, 600);
  if (!globalThis.__errores.includes(linea)) globalThis.__errores.push(linea);
};
console.error = (...args) => {
  const s = String(args[0] ?? '');
  if (/Could not parse CSS|Not implemented: HTMLMediaElement|jsdom/i.test(s)) return;
  anotar('console.error', args.map(a => a?.stack ?? String(a)).join(' | '));
  errorReal(...args);
};
window.addEventListener('error', ev => anotar('window.error', ev.error ?? ev.message));
window.addEventListener('unhandledrejection', ev => anotar('promesa', ev.reason));
process.on('uncaughtException', e => anotar('uncaught', e));
process.on('unhandledRejection', e => anotar('rechazo', e));

export { dom, window };
