// Juega UNA temporada en TODAS las ligas del juego, y junta lo que no cierra en cada una.
//
//   npm run barrer:ligas            -- las 19, una temporada cada una
//   npm run barrer:ligas -- 2       -- dos temporadas
//   npm run barrer:ligas -- 1 3     -- una temporada, de a 3 en paralelo
//
// El banco de scripts/ui/correr.mjs juega un club. Éste juega uno por LIGA: es la única forma de
// saber si un bug es del juego o de un país. Los primeros seis bugs de la Champions salieron
// jugando SOLO en Alemania, y esa es exactamente la clase de sesgo que esto corrige -- una liga
// sudamericana tiene cuadrangular, México tiene Apertura y Clausura con Liguilla, y ninguna de esas
// ramas se toca jugando en la Bundesliga.
//
// SE CORRE POR TANDAS. Diecinueve navegadores de mentira a la vez no es paralelismo, es una cola:
// cada uno monta React entero y se pisan por CPU, así que terminan más tarde que en tandas de a
// pocos y encima se cuelgan más.
//
// Cada club escribe su propio progreso en scripts/ui/barrido/<club>.log, así que se puede mirar
// cómo va sin esperar a que termine.
import { spawn } from 'child_process';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { cpus } from 'os';

const CARPETA = 'scripts/ui/barrido';
const TEMPORADAS = process.argv[2] || '1';
/**
 * Cuantas carreras a la vez. Por defecto, la mitad de los nucleos y nunca mas de 8.
 *
 * Cada carrera monta React entero sobre jsdom y come ~400 MB, asi que el techo real es la memoria,
 * no la CPU. La mitad de los nucleos deja aire para el compilador y para que la maquina siga siendo
 * usable mientras corre. Antes eran 4 fijos, en una maquina de 16 nucleos.
 */
const EN_PARALELO = Math.max(1, Number(process.argv[3]) || Math.min(8, Math.max(2, Math.floor(cpus().length / 2))));
/**
 * Cuánto se le da a cada club antes de darlo por colgado.
 *
 * Generoso a propósito: una temporada sudamericana tarda ~8 minutos, pero una europea juega más
 * partidos (liga de 38 + copa continental + copa nacional + el Mundial) y se va a 20 y pico. Con el
 * tope en 12 se cortaban las cinco europeas cuando iban por la fecha 61 -- y quedaban marcadas como
 * colgadas sin estarlo.
 */
const MINUTOS_POR_CLUB = Math.max(2, Number(process.argv[4]) || 30);

/**
 * Un club por liga, y a propósito de los grandes: son los que juegan copa continental, así cada
 * corrida toca liga + copa nacional + copa internacional a la vez (y cuadrangular donde lo hay).
 */
const LIGAS = [
  ['Junior de Barranquilla', 'Colombiana'],
  ['Flamengo', 'Brasileña'],
  ['Boca Juniors', 'Argentina'],
  ['Arsenal', 'Inglesa'],
  ['Real Madrid', 'Española'],
  ['Inter', 'Italiana'],
  ['Paris Saint-Germain', 'Francesa'],
  ['FC Porto', 'Portuguesa'],
  ['Borussia Dortmund', 'Alemana'],
  ['Ajax', 'Holandesa'],
  ['América', 'Mexicana'],
  ['Colo-Colo', 'Chilena'],
  ['LDU Quito', 'Ecuatoriana'],
  ['Peñarol', 'Uruguaya'],
  ['Universitario', 'Peruana'],
  ['Libertad', 'Paraguaya'],
  ['Bolívar', 'Boliviana'],
  ['Caracas FC', 'Venezolana'],
  ['Inter Miami CF', 'Estadounidense'],
];

/**
 * SOLO=Espanola,Francesa corre nada mas esas ligas.
 *
 * Un barrido entero son horas, y cuando se corta a la mitad -- se cierra la sesion, se cuelga una
 * tanda -- no tiene sentido volver a jugar las ligas que ya dieron su veredicto. Sin acento y sin
 * distinguir mayusculas, para poder escribirlo de memoria.
 */
const sinTilde = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const SOLO = (process.env.SOLO ?? '').split(',').map(x => sinTilde(x.trim())).filter(Boolean);
const AJUGAR = SOLO.length ? LIGAS.filter(([, liga]) => SOLO.includes(sinTilde(liga))) : LIGAS;
if (SOLO.length && AJUGAR.length !== SOLO.length) {
  console.log(`! de las ${SOLO.length} ligas pedidas se reconocieron ${AJUGAR.length}: ${AJUGAR.map(l => l[1]).join(', ')}`);
}

if (!existsSync(CARPETA)) mkdirSync(CARPETA, { recursive: true });

const resumenes = [];

function jugar([club, liga]) {
  return new Promise(resolve => {
    const slug = club.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const hijo = spawn(process.execPath, ['scripts/ui/correr.mjs', club, liga, TEMPORADAS], {
      // Cada uno escribe en su propio archivo de progreso, o se pisarían entre ellos.
      // El banco corta solo un poco antes que el tope de afuera, asi la corrida trabada alcanza a
      // imprimir su informe en vez de morir de un SIGKILL sin decir nada.
      env: { ...process.env, PROGRESO: `${CARPETA}/${slug}.log`, BITACORA: `${CARPETA}/${slug}.json`, MINUTOS_DE_BANCO: String(Math.max(1, MINUTOS_POR_CLUB - 3)) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let salida = '';
    hijo.stdout.on('data', d => { salida += d; });
    hijo.stderr.on('data', d => { salida += d; });
    // TOPE POR CLUB. El banco se cuelga de vez en cuando en un partido jugado a mano -- jsdom no
    // implementa <canvas>, así que la animación de la jugada nunca llama a su onComplete y el reloj
    // del partido queda parado. Sin este corte, una corrida colgada deja esperando a la tanda
    // entera y el barrido no termina nunca.
    const corte = setTimeout(() => {
      salida += ' [el banco se colgó y se cortó por tiempo] ';
      hijo.kill('SIGKILL');
    }, MINUTOS_POR_CLUB * 60_000);
    hijo.on('close', code => {
      clearTimeout(corte);
      // LA SALIDA ENTERA SE GUARDA, no solo el informe.
      //
      // Abajo se recorta desde "QUE SE JUGO" para que el resumen del barrido se pueda leer, y eso
      // esta bien para mirar de reojo. Pero cuando una carrera falla, lo que hace falta es todo lo
      // que imprimio ANTES -- las trazas del motor -- y ahi ya no estaba: habia que adivinar en que
      // club reproducirlo y correrlo aparte, y estos bugs no se reproducen dirigidos. Con el archivo
      // completo, la carrera que falla ya viene con su rastro puesto.
      writeFileSync(`${CARPETA}/${slug}.salida.log`, salida);
      const desde = salida.indexOf('--- QUE SE JUGO ---');
      const informe = desde >= 0 ? salida.slice(desde) : salida.slice(-2500);
      console.log(`\n${'='.repeat(78)}\n=== ${club} (${liga}) -- salida ${code}\n${'='.repeat(78)}`);
      console.log(informe);
      // "Termino" es haber llegado al final de la TEMPORADA, no a que el proceso muriera: una
      // corrida cortada por atasco imprime el informe igual y sus torneos figuran sin coronar.
      const completa = informe.includes('CAMPEONATOS AL CERRAR')
        && !informe.includes('la corrida NO llegó al final');
      resumenes.push({ club, liga, informe, termino: completa });
      resolve();
    });
  });
}

// UNA COLA, NO TANDAS.
//
// Antes se corria de a tandas con Promise.all, y una tanda no arrancaba hasta que terminaba la mas
// lenta de la anterior. Las carreras no duran lo mismo ni de lejos: una sudamericana cierra en ocho
// minutos y una europea con Mundial se va a veintidos. Con tandas de cinco, cuatro nucleos quedaban
// parados catorce minutos esperando a una sola corrida -- medido en el barrido de las 19.
//
// Con la cola, apenas una carrera termina entra la siguiente. Mismo paralelismo, sin huecos.
const pendientes = [...AJUGAR];
let enCurso = 0;
console.log(`
### ${AJUGAR.length} ligas, de a ${EN_PARALELO} a la vez, ${MINUTOS_POR_CLUB} min de tope por carrera`);
await new Promise(listo => {
  const arrancarLoQueQuepa = () => {
    while (enCurso < EN_PARALELO && pendientes.length) {
      const liga = pendientes.shift();
      enCurso++;
      console.log(`  -> arranca ${liga[1]} (${liga[0]}) | quedan ${pendientes.length} en la cola`);
      jugar(liga).then(() => {
        enCurso--;
        if (!pendientes.length && enCurso === 0) listo();
        else arrancarLoQueQuepa();
      });
    }
  };
  arrancarLoQueQuepa();
});

// --- EL VEREDICTO, en una pantalla ---------------------------------------------------------------
console.log(`\n${'#'.repeat(78)}\n### VEREDICTO DEL BARRIDO\n${'#'.repeat(78)}`);
for (const r of resumenes.sort((a, b) => a.liga.localeCompare(b.liga))) {
  const problemas = [...r.informe.matchAll(/^ {2}✗ (.+)$/gm)].map(m => m[1]);
  const campeones = [...r.informe.matchAll(/^ {2}✓ (.+)$/gm)].length;
  if (!r.termino) {
    console.log(`  ??  ${r.liga.padEnd(16)} ${r.club.padEnd(24)} la corrida no llegó al final`);
  } else if (problemas.length) {
    console.log(`  ✗   ${r.liga.padEnd(16)} ${r.club.padEnd(24)} ${problemas.length} problema(s)`);
    for (const p of problemas) console.log(`        · ${p}`);
  } else {
    console.log(`  OK  ${r.liga.padEnd(16)} ${r.club.padEnd(24)} ${campeones} torneo(s) coronado(s), nada que reportar`);
  }
}
