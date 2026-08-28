// UNA CARRERA COMPLETA POR LIGA, de los 25 años al retiro.
//
//   node scripts/ui/carreras_completas.mjs
//
// Diecinueve carreras, una por liga, con TRES diferencias respecto del barrido normal:
//
//   . Arrancan a los 25 y no a los 17, asi que llegan al retiro (43) en dieciocho temporadas en vez
//     de veintiseis. Una carrera entera pasa a costar seis minutos.
//   . Cada una lleva una NACIONALIDAD DISTINTA, y ninguna es la de su propia liga: la lista se rota
//     una posicion. De la nacionalidad salen las eliminatorias, el Mundial y -- segun el pasaporte --
//     la Eurocopa o la Copa America, asi que asi se prueban los tres torneos de selecciones a la vez.
//   . Cada una pide DOS TRASPASOS: primero a un club europeo de mitad de tabla, despues a un
//     grande. Con listas amplias, porque el mercado sortea tres ofertas por periodo entre cientos de
//     clubes y pedir uno solo es esperar la loteria.
//
// Al terminar imprime un informe de las diecinueve juntas: por donde paso cada uno, que gano, y que
// no cierra.
import { spawn } from 'child_process';
import { mkdirSync, existsSync, readFileSync, readdirSync } from 'fs';

const CARPETA = 'scripts/ui/carreras';
const TEMPORADAS = process.argv[2] || '20';
const EN_PARALELO = Math.max(1, Number(process.argv[3]) || 6);
const MINUTOS = Math.max(5, Number(process.argv[4]) || 45);

const LIGAS = [
  ['Junior de Barranquilla', 'Colombiana'], ['Flamengo', 'Brasileña'], ['Boca Juniors', 'Argentina'],
  ['Arsenal', 'Inglesa'], ['Real Madrid', 'Española'], ['Inter', 'Italiana'],
  ['Paris Saint-Germain', 'Francesa'], ['FC Porto', 'Portuguesa'], ['Borussia Dortmund', 'Alemana'],
  ['Ajax', 'Holandesa'], ['América', 'Mexicana'], ['Colo-Colo', 'Chilena'],
  ['LDU Quito', 'Ecuatoriana'], ['Peñarol', 'Uruguaya'], ['Universitario', 'Peruana'],
  ['Libertad', 'Paraguaya'], ['Bolívar', 'Boliviana'], ['Caracas FC', 'Venezolana'],
  ['Inter Miami CF', 'Estadounidense'],
];

// Las mismas diecinueve del formulario, rotadas una posicion respecto de las ligas de arriba.
const NACIONALIDADES = [
  'Brasil', 'Argentina', 'Inglaterra', 'España', 'Alemania', 'Francia', 'Holanda', 'EE.UU.',
  'México', 'Uruguay', 'Ecuador', 'Perú', 'Paraguay', 'Bolivia', 'Venezuela', 'Colombia',
  'Italia', 'Portugal', 'Chile',
];

const PASO_EUROPA = ['Ajax', 'PSV', 'SL Benfica', 'FC Porto', 'Sporting CP', 'Olympique de Marseille',
  'Villarreal CF', 'Real Betis', 'Atalanta', 'Napoli', 'Torino', 'Lecce', 'Sassuolo', 'Sevilla FC',
  'AS Roma', 'Lazio', 'Fiorentina', 'Bologna', 'RB Leipzig', 'Bayer 04 Leverkusen', 'VfB Stuttgart',
  'Eintracht Frankfurt', 'Aston Villa', 'Newcastle United', 'West Ham United', 'Everton', 'Fulham'].join('/');
const PASO_GRANDE = ['Real Madrid', 'FC Barcelona', 'FC Bayern München', 'Manchester City', 'Liverpool',
  'Paris Saint-Germain', 'Inter', 'Arsenal', 'Manchester United', 'Chelsea', 'Juventus', 'Milan',
  'Atlético de Madrid', 'Tottenham Hotspur'].join('/');

if (!existsSync(CARPETA)) mkdirSync(CARPETA, { recursive: true });

function jugar([club, liga], i) {
  return new Promise(listo => {
    const slug = club.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const hijo = spawn(process.execPath, ['scripts/ui/correr.mjs', club, liga, TEMPORADAS], {
      env: {
        ...process.env,
        PROGRESO: `${CARPETA}/${slug}.log`,
        BITACORA: `${CARPETA}/${slug}.json`,
        MINUTOS_DE_BANCO: String(MINUTOS - 3),
        EDAD: '25',
        NACIONALIDAD: NACIONALIDADES[i],
        FICHAR: `${PASO_EUROPA}, ${PASO_GRANDE}`,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let salida = '';
    hijo.stdout.on('data', d => { salida += d; });
    hijo.stderr.on('data', d => { salida += d; });
    const corte = setTimeout(() => hijo.kill('SIGKILL'), MINUTOS * 60_000);
    hijo.on('close', () => {
      clearTimeout(corte);
      const desde = salida.indexOf('--- LA CARRERA ---');
      console.log(`\n${'='.repeat(74)}\n=== ${club} (${liga}) · ${NACIONALIDADES[i]}\n${'='.repeat(74)}`);
      console.log(desde >= 0 ? salida.slice(desde) : salida.slice(-1800));
      listo();
    });
  });
}

const pendientes = LIGAS.map((l, i) => [l, i]);
let enCurso = 0;
console.log(`### ${LIGAS.length} carreras completas, desde los 25 años, ${TEMPORADAS} temporadas, de a ${EN_PARALELO}`);
await new Promise(fin => {
  const arrancar = () => {
    while (enCurso < EN_PARALELO && pendientes.length) {
      const [liga, i] = pendientes.shift();
      enCurso++;
      console.log(`  -> ${liga[1]} (${liga[0]}) · pasaporte de ${NACIONALIDADES[i]} | quedan ${pendientes.length}`);
      jugar(liga, i).then(() => { enCurso--; if (!pendientes.length && enCurso === 0) fin(); else arrancar(); });
    }
  };
  arrancar();
});
