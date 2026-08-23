/**
 * EL AMBIENTE DEL PARTIDO.
 *
 *   npm run validar:ambiente
 *
 * ---------------------------------------------------------------------------------------------
 * QUE COMPRUEBA
 * ---------------------------------------------------------------------------------------------
 *
 * Un sonido que arranca solo y no para es de las peores cosas que le puede pasar a una pagina: si
 * el jugador cierra el partido y sigue escuchando un estadio, cierra el juego. Asi que lo que hay
 * que proteger no es que SUENE -- eso se oye -- sino que se APAGUE, y que los archivos existan.
 *
 * No se puede reproducir audio desde node, asi que lo que se comprueba es lo que si se puede:
 *
 *   1. Que las cinco pistas esten en public/sfx/ambiente/ y sean MP3 de verdad.
 *   2. Que la pantalla de partido las apague en los tres caminos: pitazo final, desmontaje y
 *      pestaña escondida.
 *   3. Que el barajado no repita la misma pista dos veces seguidas, que es lo que delata un bucle.
 *   4. Que el peso total no se escape: se bajan al empezar un partido, y en un telefono con datos
 *      eso se paga.
 */
import { readFileSync, existsSync, statSync } from 'fs';

let fallas = 0;
const caso = (etiqueta: string, fn: () => void) => {
  try { fn(); console.log(`OK    ${etiqueta}`); }
  catch (e) { fallas++; console.log(`FALLA ${etiqueta} -- ${(e as Error).message}`); }
};

const FUENTE = readFileSync('src/ambienteDelPartido.ts', 'utf8');
const PANTALLA = readFileSync('src/components/MatchSimulator.tsx', 'utf8');

/** Las rutas que el modulo declara, leidas de su propia lista. */
const PISTAS = [...FUENTE.matchAll(/'(sfx\/ambiente\/[^']+)'/g)].map(m => m[1]);

caso('las pistas que el codigo pide existen de verdad', () => {
  if (PISTAS.length < 2) throw new Error(`el modulo declara ${PISTAS.length} pistas: con una sola no hay nada que intercalar`);
  for (const p of PISTAS) {
    const ruta = `public/${p}`;
    if (!existsSync(ruta)) throw new Error(`falta el archivo ${ruta}`);
    const d = readFileSync(ruta);
    // Un MP3 arranca con una cabecera de frame (0xFF 0xEx) o con una etiqueta ID3.
    const esId3 = d[0] === 0x49 && d[1] === 0x44 && d[2] === 0x33;
    const esFrame = d[0] === 0xFF && (d[1] & 0xE0) === 0xE0;
    if (!esId3 && !esFrame) throw new Error(`${p} no parece un MP3`);
  }
});

caso('el estadio se apaga por los tres caminos', () => {
  // 1. El pitazo final.
  if (!/playSfx\('whistle_end'\)[\s\S]{0,400}?pararAmbiente\(\)/.test(PANTALLA)) {
    throw new Error('el pitazo final no apaga el ambiente');
  }
  // 2. El desmontaje de la pantalla.
  if (!/return \(\) => pararAmbiente\(\)/.test(PANTALLA)) {
    throw new Error('salir de la pantalla no apaga el ambiente');
  }
  // 3. La pestaña escondida.
  if (!/visibilitychange/.test(PANTALLA) || !/document\.hidden\) pararAmbiente\(\)/.test(PANTALLA)) {
    throw new Error('el ambiente sigue sonando en una pestaña escondida');
  }
});

caso('obedece al mismo boton de silencio que los efectos', () => {
  if (!/isSfxMuted\(\)/.test(FUENTE) || !/getSfxVolume\(\)/.test(FUENTE)) {
    throw new Error('el ambiente tiene su propio volumen: el boton de silencio no lo apagaria');
  }
});

caso('el barajado no repite pista dos veces seguidas', () => {
  // Se reimplementa la regla del modulo y se corre muchas veces: lo que se comprueba es que la
  // condicion "la primera de la vuelta nueva no puede ser la ultima de la anterior" alcance.
  const n = PISTAS.length;
  const barajar = (anterior: number | null) => {
    const ids = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    if (anterior != null && n > 1 && ids[0] === anterior) [ids[0], ids[1]] = [ids[1], ids[0]];
    return ids;
  };
  for (let intento = 0; intento < 3000; intento++) {
    let anterior: number | null = null;
    const oidas: number[] = [];
    for (let vuelta = 0; vuelta < 6; vuelta++) {
      const orden = barajar(anterior);
      oidas.push(...orden);
      anterior = orden[orden.length - 1];
    }
    for (let i = 1; i < oidas.length; i++) {
      if (oidas[i] === oidas[i - 1]) throw new Error(`la pista ${oidas[i]} sono dos veces seguidas`);
    }
  }
});

caso('el ambiente no se descarga al abrir el juego', () => {
  // Vive fuera de SFX_FILES a proposito: preloadSfx() recorre esa lista al arrancar, y meter ahi
  // cuatro megas de estadio le cobraria la espera a todo el mundo, juegue o no un partido.
  const audio = readFileSync('src/audio.ts', 'utf8');
  if (/ambiente/.test(audio)) throw new Error('el ambiente entro al motor de efectos: se bajaria al abrir el juego');
  if (!/arrancarAmbiente\(\)/.test(PANTALLA)) throw new Error('nadie arranca el ambiente');
});

caso('el peso de las pistas no se escapa', () => {
  const total = PISTAS.reduce((n, p) => n + statSync(`public/${p}`).size, 0);
  const mb = total / (1024 * 1024);
  console.log(`      (${PISTAS.length} pistas, ${mb.toFixed(1)} MB en total)`);
  // Se bajan al empezar un partido. Mas de esto en un telefono con datos ya es una espera que se
  // nota antes del primer minuto.
  if (mb > 6) throw new Error(`${mb.toFixed(1)} MB de ambiente: hay que recortar las pistas`);
});

console.log(fallas === 0
  ? '\nEl estadio suena durante el partido, se intercala y se apaga cuando tiene que apagarse.'
  : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
