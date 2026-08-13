/**
 * Le agrega a la Liga MX su CLAUSURA, que estaba en el repo sin cargar.
 *
 *   node scripts/importar_clausura_mexicano.mjs --dry
 *   node scripts/importar_clausura_mexicano.mjs
 *
 * El calendario cargado (`mex1`) traía sólo el Apertura: 147 partidos del 17 de julio al 23 de
 * noviembre. Con medio año cargado, un club mexicano no jugaba nada entre enero y julio, y eso
 * arrastraba una consecuencia fea: la Concacaf Champions Cup, que en la vida real va del 4 de
 * febrero al 1 de junio, tuvo que declararse de agosto a noviembre para caer donde la Liga MX
 * estuviera jugando. Un parche documentado en copaConcacaf.ts que este script vuelve innecesario.
 *
 * El Clausura estaba en data/calendarios/Mexicana.json todo el tiempo -- 153 partidos del 10 de
 * enero al 27 de abril de 2026 -- y nunca se importó. No es un dato nuevo: es un dato que estaba.
 *
 * Los dos torneos caen en el MISMO año calendario (Clausura enero-abril, Apertura julio-noviembre),
 * así que juntos dan un año completo, igual que Colombia y Argentina.
 *
 * OJO con los clubes: los dos semestres comparten 17 de 18. El Apertura trae Atlante y el Clausura
 * trae Mazatlán FC. No se corrige acá -- cada torneo se juega con los equipos que de verdad lo
 * jugaron -- y los dos existen en la base, así que ningún partido queda sin rival.
 */
import { readFile, writeFile } from 'node:fs/promises';

const DRY = process.argv.includes('--dry');
const ARCHIVO = 'src/realCalendarDates.ts';

const fuente = JSON.parse(await readFile('data/calendarios/Mexicana.json', 'utf8'));
const alias = fuente.aliases ?? {};
const resolver = (n) => alias[n] ?? n;

const nuevos = fuente.matches.map(m => ({
  date: m.date,
  home: resolver(m.home),
  away: resolver(m.away),
}));

let src = await readFile(ARCHIVO, 'utf8');

// El archivo es un literal JSON gigante en una sola línea. Se ubica la competición por su id y se
// recorta su objeto contando llaves, que es lo único robusto: un regex sobre 350 KB de JSON
// anidado encuentra el cierre equivocado.
const inicio = src.indexOf('{"id":"mex1"');
if (inicio < 0) { console.error('no está mex1 en ' + ARCHIVO); process.exit(1); }
let prof = 0, fin = -1;
for (let i = inicio; i < src.length; i++) {
  if (src[i] === '{') prof++;
  else if (src[i] === '}') { prof--; if (prof === 0) { fin = i + 1; break; } }
}
const comp = JSON.parse(src.slice(inicio, fin));

const yaEstan = new Set(comp.matches.map(m => `${m.date}|${m.home}|${m.away}`));
const aAgregar = nuevos.filter(m => !yaEstan.has(`${m.date}|${m.home}|${m.away}`));

comp.matches = [...comp.matches, ...aAgregar].sort((a, b) => a.date.localeCompare(b.date));
comp.firstDate = comp.matches[0].date;
comp.lastDate = comp.matches[comp.matches.length - 1].date;

const clubes = new Set();
for (const m of comp.matches) { clubes.add(m.home); clubes.add(m.away); }

console.log(`Liga MX: ${comp.matches.length - aAgregar.length} -> ${comp.matches.length} partidos (+${aAgregar.length})`);
console.log(`ventana: ${comp.firstDate} .. ${comp.lastDate}`);
console.log(`clubes distintos: ${clubes.size}`);
const porMes = {};
for (const m of comp.matches) { const k = m.date.slice(0, 7); porMes[k] = (porMes[k] ?? 0) + 1; }
console.log('partidos por mes:', Object.entries(porMes).map(([k, v]) => `${k}:${v}`).join(' '));

if (DRY) { console.log('\n(--dry: no se escribió nada)'); process.exit(0); }
await writeFile(ARCHIVO, src.slice(0, inicio) + JSON.stringify(comp) + src.slice(fin), 'utf8');
console.log(`\n-> ${ARCHIVO}`);
