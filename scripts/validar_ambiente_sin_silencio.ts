/**
 * EL ESTADIO NO SE CALLA. Prueba de COMPORTAMIENTO, no de texto.
 *
 * validar_ambiente.ts revisa el codigo fuente con expresiones regulares, y eso alcanza para que no
 * se borre una pieza por descuido -- pero no prueba lo unico que importa: que durante el partido
 * siempre haya sonido. El bug reportado ("suenan pero se callan despues") pasaba TODOS aquellos
 * chequeos: el codigo estaba, solo que se quedaba mudo en cuanto la copia entrante tardaba en
 * cargar mas de lo que duraba el cruce.
 *
 * Aca se monta un <audio> de mentira con reloj propio, se corre un partido entero y se mide el
 * silencio de verdad.
 */

let fallos = 0;
function caso(nombre: string, fn: () => void) {
  try { fn(); console.log('OK    ' + nombre); }
  catch (e) { fallos++; console.log('FALLA ' + nombre + '  --  ' + (e as Error).message); }
}

const DURACION = 27;      // segundos: lo que dura la pista mas corta de verdad
const LATIDO = 250;       // el mismo que usa el modulo

/** Un <audio> falso: modela carga, reproduccion, fin de pista y play() rechazado. */
class AudioFalso {
  static vivos: AudioFalso[] = [];
  static latenciaDeCarga = 300;   // ms que tarda en estar listo
  static rechazarPlay = 0;        // cuantos play() seguidos rechaza

  src: string; volume = 1; preload = ''; paused = true; ended = false;
  currentTime = 0; duration = NaN;
  private listoEn: number | null = null;
  private queriaSonar = false;

  constructor(src: string) { this.src = src; AudioFalso.vivos.push(this); this.listoEn = reloj + AudioFalso.latenciaDeCarga; }
  load() { /* ya se agendo en el constructor */ }
  play() {
    if (AudioFalso.rechazarPlay > 0) { AudioFalso.rechazarPlay--; return Promise.reject(new Error('bloqueado')); }
    this.queriaSonar = true;
    if (this.duration === this.duration) { this.paused = false; this.ended = false; }
    return Promise.resolve();
  }
  pause() { this.paused = true; this.queriaSonar = false; }
  avanzar(ms: number) {
    if (this.listoEn != null && reloj >= this.listoEn) { this.duration = DURACION; this.listoEn = null;
      if (this.queriaSonar) { this.paused = false; this.ended = false; } }
    if (this.paused || this.ended) return;
    this.currentTime += ms / 1000;
    if (this.currentTime >= DURACION) { this.currentTime = DURACION; this.ended = true; this.paused = true; }
  }
  /** Lo que se escucha de este elemento ahora mismo. */
  get audible() { return (!this.paused && !this.ended) ? this.volume : 0; }
}

let reloj = 0;
const timers = new Map<number, { fn: () => void; cada: number; proximo: number }>();
let siguienteTimer = 1;

(globalThis as never as { Audio: unknown }).Audio = AudioFalso;
(globalThis as never as { window: unknown }).window = {
  setInterval: (fn: () => void, cada: number) => {
    const id = siguienteTimer++;
    timers.set(id, { fn, cada, proximo: reloj + cada });
    return id;
  },
  clearInterval: (id: number) => { timers.delete(id); },
};
(globalThis as never as { clearInterval: unknown }).clearInterval = (id: number) => { timers.delete(id); };
(globalThis as never as { localStorage: unknown }).localStorage = {
  getItem: () => null, setItem: () => {}, removeItem: () => {},
};

const { arrancarAmbiente, pararAmbiente, agacharAmbiente, precargarAmbiente, desvanecerAmbiente } = await import('../src/ambienteDelPartido');

/**
 * Corre `minutos` de partido y mide el silencio.
 *
 * `peorSilencio` cuenta SOLO despues de que el estadio sono por primera vez: lo que tarda la
 * primera pista en bajar es descarga, no un bache, y se mide aparte en `esperaInicial`. Lo que el
 * jugador reporto -- "suenan pero se callan despues" -- es lo primero.
 */
function correrPartido(minutos: number): { peorSilencio: number; esperaInicial: number; pasos: number } {
  let peorSilencio = 0, silencioActual = 0, pasos = 0, esperaInicial = 0;
  let yaSono = false;
  const hasta = reloj + minutos * 60 * 1000;
  while (reloj < hasta) {
    reloj += LATIDO;
    for (const a of AudioFalso.vivos) a.avanzar(LATIDO);
    for (const t of [...timers.values()]) {
      while (reloj >= t.proximo) { t.proximo += t.cada; t.fn(); }
    }
    pasos++;
    const seEscucha = AudioFalso.vivos.reduce((s, a) => s + a.audible, 0);
    if (seEscucha <= 0.001) {
      if (!yaSono) esperaInicial += LATIDO;
      else { silencioActual += LATIDO; peorSilencio = Math.max(peorSilencio, silencioActual); }
    } else { yaSono = true; silencioActual = 0; }
  }
  return { peorSilencio, esperaInicial, pasos };
}

function reiniciar() {
  pararAmbiente();
  AudioFalso.vivos = [];
  AudioFalso.latenciaDeCarga = 300;
  AudioFalso.rechazarPlay = 0;
  timers.clear();
  reloj = 0;
}

// Un silencio de mas de medio segundo en medio de un partido ya se escucha como un bache.
const TOLERADO = 500;

caso('un partido entero de 15 minutos no tiene un solo bache', () => {
  reiniciar();
  arrancarAmbiente('junior', 'Colombiana');
  const { peorSilencio } = correrPartido(15);
  if (peorSilencio > TOLERADO) throw new Error(`el estadio se callo ${peorSilencio} ms seguidos`);
});

caso('y la pista da varias vueltas (no es que sono una sola vez)', () => {
  reiniciar();
  arrancarAmbiente('junior', 'Colombiana');
  correrPartido(5);
  const vueltas = AudioFalso.vivos.length;
  if (vueltas < 5) throw new Error(`en 5 minutos de pistas de ${DURACION}s deberia haber encadenado varias veces, y creo ${vueltas} elementos`);
});

caso('AUNQUE la copia entrante tarde MAS que el cruce en cargar', () => {
  // Este es el bug original: el cruce dura 2,5 s y el `new Audio` se creaba en ese momento. Si
  // tardaba mas que eso en bajar, la pista vieja se terminaba antes y quedaba el hueco.
  reiniciar();
  AudioFalso.latenciaDeCarga = 6000;
  arrancarAmbiente('junior', 'Colombiana');
  const { peorSilencio } = correrPartido(10);
  if (peorSilencio > TOLERADO) throw new Error(`con carga lenta el estadio se callo ${peorSilencio} ms seguidos`);
});

caso('precargar desde la tarjeta le saca la espera al silbatazo', () => {
  // Sin precarga, el principio del partido va en silencio hasta que baje la pista: con carga lenta,
  // casi seis segundos. Ver precargarAmbiente, que llama Dashboard al mostrar el proximo partido.
  reiniciar();
  AudioFalso.latenciaDeCarga = 6000;
  arrancarAmbiente('junior', 'Colombiana');
  const sinPrecarga = correrPartido(2).esperaInicial;

  reiniciar();
  AudioFalso.latenciaDeCarga = 6000;
  precargarAmbiente('junior', 'Colombiana');
  // El jugador mira la tarjeta un rato antes de tocar el boton: la pista baja mientras tanto.
  for (let i = 0; i < 40; i++) { reloj += LATIDO; for (const a of AudioFalso.vivos) a.avanzar(LATIDO); }
  arrancarAmbiente('junior', 'Colombiana');
  const conPrecarga = correrPartido(2).esperaInicial;

  if (conPrecarga >= sinPrecarga) {
    throw new Error(`precargar no ayudo: ${conPrecarga} ms de espera contra ${sinPrecarga} ms sin precargar`);
  }
  if (conPrecarga > TOLERADO) throw new Error(`aun precargando, el silbatazo espero ${conPrecarga} ms`);
  console.log(`      (espera al silbatazo: ${sinPrecarga} ms sin precargar, ${conPrecarga} ms con precarga)`);
});

caso('y si el navegador rechaza un play(), el estadio SE RECUPERA solo', () => {
  // Antes esto lo mataba para siempre: `actual` quedaba apuntando a un audio terminado y nadie lo
  // volvia a arrancar. Ahora la red de seguridad reintenta en cada latido, asi que el bache dura
  // los reintentos y no el resto del partido.
  reiniciar();
  arrancarAmbiente('junior', 'Colombiana');
  correrPartido(2);
  AudioFalso.rechazarPlay = 3;
  const { peorSilencio } = correrPartido(8);
  const TOPE_DE_RECUPERACION = 4 * LATIDO;
  if (peorSilencio > TOPE_DE_RECUPERACION) {
    throw new Error(`tras 3 play() rechazados se callo ${peorSilencio} ms, mas que los reintentos`);
  }
});

caso('el gol AGACHA el estadio pero no lo apaga ni lo corta', () => {
  reiniciar();
  arrancarAmbiente('junior', 'Colombiana');
  correrPartido(1);
  agacharAmbiente();
  let minimo = Infinity;
  for (let i = 0; i < 12; i++) {
    reloj += LATIDO;
    for (const a of AudioFalso.vivos) a.avanzar(LATIDO);
    for (const t of [...timers.values()]) while (reloj >= t.proximo) { t.proximo += t.cada; t.fn(); }
    minimo = Math.min(minimo, AudioFalso.vivos.reduce((s, a) => s + a.audible, 0));
  }
  if (minimo <= 0.001) throw new Error('el gol dejo el estadio en silencio: tiene que agacharse, no apagarse');
});

caso('el pitazo final SI lo apaga', () => {
  reiniciar();
  arrancarAmbiente('junior', 'Colombiana');
  correrPartido(1);
  pararAmbiente();
  reloj += LATIDO;
  for (const a of AudioFalso.vivos) a.avanzar(LATIDO);
  const seEscucha = AudioFalso.vivos.reduce((s, a) => s + a.audible, 0);
  if (seEscucha > 0.001) throw new Error('el estadio sigue sonando despues del pitazo final');
});

/** Un latido, devolviendo lo que se escucha. */
function latir(): number {
  reloj += LATIDO;
  for (const a of AudioFalso.vivos) a.avanzar(LATIDO);
  for (const t of [...timers.values()]) while (reloj >= t.proximo) { t.proximo += t.cada; t.fn(); }
  return AudioFalso.vivos.reduce((s, a) => s + a.audible, 0);
}

caso('al terminar el partido el estadio se va APAGANDO, no de golpe', () => {
  reiniciar();
  arrancarAmbiente('junior', 'Colombiana');
  correrPartido(1);
  const antes = AudioFalso.vivos.reduce((s, a) => s + a.audible, 0);
  desvanecerAmbiente();

  const curva: number[] = [];
  for (let i = 0; i < 20 && (curva.length === 0 || curva[curva.length - 1] > 0); i++) curva.push(latir());

  if (curva[0] >= antes) throw new Error('el primer latido no bajo nada: no hay fundido');
  if (curva[0] <= 0.001) throw new Error('se apago de golpe en el primer latido');
  // Tiene que BAJAR, paso a paso, sin volver a subir.
  for (let i = 1; i < curva.length; i++) {
    if (curva[i] > curva[i - 1] + 0.0001) throw new Error(`el fundido subio en el paso ${i}`);
  }
  if (curva[curva.length - 1] > 0.001) throw new Error('el fundido nunca llego a cero');
  const pasos = curva.length;
  if (pasos < 4) throw new Error(`el fundido duro ${pasos} latidos: se escucha como un corte`);
  console.log(`      (baja en ${pasos} pasos, ${(pasos * LATIDO) / 1000}s)`);
});

caso('y si te vas de la pantalla en medio del fundido, se corta igual', () => {
  // El desmontaje llama a pararAmbiente(): el estadio no puede quedar sonando solo por haberse
  // ido en la mitad de la salida.
  reiniciar();
  arrancarAmbiente('junior', 'Colombiana');
  correrPartido(1);
  desvanecerAmbiente();
  latir(); latir();
  pararAmbiente();
  if (latir() > 0.001) throw new Error('sigue sonando despues de salir de la pantalla');
});

caso('desvanecer sin nada sonando no revienta', () => {
  reiniciar();
  desvanecerAmbiente();
  if (latir() > 0.001) throw new Error('sono algo sin haber arrancado');
});

console.log(fallos ? `\n${fallos} FALLAS` : '\nEl estadio suena de punta a punta del partido, sin baches.');
process.exit(fallos ? 1 : 0);
