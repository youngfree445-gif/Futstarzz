// Juega UNA temporada en varias ligas a la vez, y junta lo que no cierra en cada una.
//
//   node scripts/ui/barrer_ligas.mjs
//
// El banco de scripts/ui/correr.mjs juega un club. Este juega ocho, en paralelo, uno por liga: es
// la única forma de saber si un bug es del juego o de un país. Los primeros seis bugs de la
// Champions salieron jugando SOLO en Alemania, y esa es exactamente la clase de sesgo que esto
// corrige -- una liga sudamericana tiene cuadrangular, otra tiene Apertura y Clausura, y ninguna de
// esas ramas se toca jugando en la Bundesliga.
//
// Cada club escribe su propio progreso en scripts/ui/barrido/<club>.log, así que se puede mirar
// cómo va sin esperar a que termine.
import { spawn } from 'child_process';
import { mkdirSync, existsSync } from 'fs';

const CARPETA = 'scripts/ui/barrido';
const TEMPORADAS = process.argv[2] || '1';

/** Un club por liga, y a propósito de los grandes: son los que juegan copa continental. */
const LIGAS = [
  ['Junior de Barranquilla', 'Colombiana'],
  ['Flamengo', 'Brasileña'],
  ['Boca Juniors', 'Argentina'],
  ['Arsenal', 'Inglesa'],
  ['Real Madrid', 'Española'],
  ['Inter', 'Italiana'],
  ['Paris Saint-Germain', 'Francesa'],
  ['FC Porto', 'Portuguesa'],
];

if (!existsSync(CARPETA)) mkdirSync(CARPETA, { recursive: true });

const enMarcha = LIGAS.map(([club, liga]) => new Promise(resolve => {
  const slug = club.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const hijo = spawn(process.execPath, ['scripts/ui/correr.mjs', club, liga, TEMPORADAS], {
    // Cada uno escribe en su propio archivo de progreso, o se pisarían entre ellos.
    env: { ...process.env, PROGRESO: `${CARPETA}/${slug}.log` },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let salida = '';
  hijo.stdout.on('data', d => { salida += d; });
  hijo.stderr.on('data', d => { salida += d; });
  hijo.on('close', code => {
    console.log(`\n${'='.repeat(78)}\n=== ${club} (${liga}) -- salida ${code}\n${'='.repeat(78)}`);
    // Del informe interesa el resumen, no la bitácora entera.
    const desde = salida.indexOf('--- QUE SE JUGO ---');
    console.log(desde >= 0 ? salida.slice(desde) : salida.slice(-3000));
    resolve();
  });
}));

await Promise.all(enMarcha);
console.log('\nBarrido terminado.');
