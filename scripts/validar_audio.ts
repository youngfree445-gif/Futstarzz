/**
 * EL AUDIO SE ESCUCHA EN IPHONE.
 *
 *   npm run validar:audio
 *
 * ---------------------------------------------------------------------------------------------
 * QUE PROTEGE, Y POR QUE NO SE PUEDE VER DE OTRA FORMA
 * ---------------------------------------------------------------------------------------------
 *
 * Safari en iOS no bloquea "el audio de la pagina": bloquea CADA elemento <audio> hasta que ese
 * elemento se reprodujo una vez DENTRO de un gesto del jugador. Bajarlo con load() no cuenta.
 *
 * Eso produjo un sintoma que en escritorio no aparece nunca y que desde el codigo no se ve: en el
 * iPhone se escuchaba la hinchada de fondo -- que arranca en el mismo toque de "Disputar Partido" --
 * y no se escuchaba NINGUN gol, porque el gol suena minutos despues desde un temporizador. Y como
 * playSfx se traga el rechazo de play() a proposito (si no, la consola se llena de errores de
 * autoplay en cada click previo al primer gesto), el fallo era completamente mudo: ni sonido ni
 * error.
 *
 * Aca se reproduce la regla de iOS con un <audio> de mentira que rechaza play() salvo que haya un
 * gesto en curso o que ese elemento ya se haya habilitado. Con eso, el bug se puede ver desde node.
 */

let fallas = 0;
const caso = (etiqueta: string, fn: () => void | Promise<void>) => {
  const terminar = (e?: unknown) => {
    if (e) { fallas++; console.log(`FALLA ${etiqueta} -- ${(e as Error).message}`); }
    else console.log(`OK    ${etiqueta}`);
  };
  try { const r = fn(); return r instanceof Promise ? r.then(() => terminar(), terminar) : terminar(); }
  catch (e) { terminar(e); }
};

// --- El iPhone de mentira ----------------------------------------------------------------------
//
// Un elemento nace BLOQUEADO. play() solo lo deja sonar si hay un gesto en curso; ahi ademas queda
// habilitado para siempre, que es exactamente lo que hace Safari.
let gestoEnCurso = false;
const sonaron: string[] = [];

class AudioDeMentira {
  src: string;
  volume = 1;
  muted = false;
  paused = true;
  ended = false;
  currentTime = 0;
  preload = '';
  private habilitado = false;

  constructor(src: string) { this.src = src; }

  play(): Promise<void> {
    if (gestoEnCurso) this.habilitado = true;
    if (!this.habilitado) return Promise.reject(new Error('NotAllowedError'));
    this.paused = false;
    // Lo muteado no se oye: es justo lo que hace desbloquearAudio para habilitar sin molestar.
    if (!this.muted) sonaron.push(this.src.split('/').pop() ?? this.src);
    return Promise.resolve();
  }
  pause() { this.paused = true; }
  load() { /* baja el archivo y NO habilita nada: ese es medio bug */ }
  addEventListener() { /* el error de archivo roto no se prueba aca */ }
  cloneNode() { return new AudioDeMentira(this.src); }
}

const almacen = new Map<string, string>();
(globalThis as Record<string, unknown>).localStorage = {
  getItem: (k: string) => almacen.get(k) ?? null,
  setItem: (k: string, v: string) => { almacen.set(k, v); },
  removeItem: (k: string) => { almacen.delete(k); },
};
(globalThis as Record<string, unknown>).Audio = AudioDeMentira;

const { playSfx, preloadSfx, desbloquearAudio } = await import('../src/audio');

const conGesto = (fn: () => void) => { gestoEnCurso = true; try { fn(); } finally { gestoEnCurso = false; } };
const esperar = () => new Promise(r => setTimeout(r, 0));

// =================================================================================================
console.log('\n=== EL BUG, TAL COMO SE REPORTO ===\n');

await caso('sin ningun gesto previo, el gol NO suena (asi estaba)', async () => {
  preloadSfx();               // lo unico que hacia el juego antes: bajarlos
  sonaron.length = 0;
  playSfx('goal');
  await esperar();
  if (sonaron.length) throw new Error(`sono igual (${sonaron.join(', ')}): el iPhone de mentira no esta bloqueando`);
});

// =================================================================================================
console.log('\n=== CON EL ARREGLO ===\n');

await caso('el primer toque habilita los efectos, y no se oye nada al hacerlo', async () => {
  sonaron.length = 0;
  conGesto(() => desbloquearAudio());
  await esperar();
  if (sonaron.length) throw new Error(`el desbloqueo se escucho: ${sonaron.join(', ')}`);
});

await caso('despues de eso el gol suena, disparado desde un temporizador', async () => {
  sonaron.length = 0;
  await new Promise(r => setTimeout(r, 5));   // fuera de todo gesto, como el minuto 23 del partido
  playSfx('goal');
  playSfx('crowd_cheer');
  await esperar();
  if (!sonaron.includes('goal.mp3')) throw new Error(`no sono el gol (sonaron: ${sonaron.join(', ') || 'nada'})`);
  if (!sonaron.includes('crowd_cheer.mp3')) throw new Error('no sono la hinchada del festejo');
});

await caso('y el resto de los efectos tambien: silbato, tarjeta, relator', async () => {
  sonaron.length = 0;
  playSfx('whistle');
  playSfx('card');
  playSfx('relato_gol_1');
  await esperar();
  for (const esperado of ['whistle.mp3', 'card.wav', 'relato_gol_1.mp3']) {
    if (!sonaron.includes(esperado)) throw new Error(`no sono ${esperado}`);
  }
});

await caso('dos goles seguidos: el segundo suena aunque la copia encimada este bloqueada', async () => {
  // La primera reproduccion deja el elemento sonando; la segunda pide una COPIA, que en iOS nace
  // bloqueada. Sin el respaldo, el segundo gol se quedaba mudo.
  sonaron.length = 0;
  playSfx('crowd_cheer');
  await esperar();
  sonaron.length = 0;
  playSfx('crowd_cheer');     // todavia suena la anterior: va por el camino de la copia
  await esperar();
  if (!sonaron.includes('crowd_cheer.mp3')) throw new Error('el segundo festejo se quedo mudo');
});

console.log(fallas ? `\n${fallas} FALLAS\n` : '\nEl audio se habilita con el primer toque y los goles suenan.\n');
process.exit(fallas ? 1 : 0);
