// Borra un plantel duplicado bajo OTRO team_name y deja solo el bueno.
//
// Pasa cuando un club figura en playersDatabase con dos nombres distintos: el juego lee uno solo
// (el que resuelve EQUIPO_SYNONYMS_POR_ID / el name de data.ts) y el otro queda de sombra ocupando
// espacio y confundiendo cualquier verificación. Fue el caso de Patriotas: 30 jugadores bajo
// "Patriotas" con valores inflados x1000 (16 millones para un central de Segunda) y otros 30 bajo
// "Patriotas Boyacá" con los valores reales de Transfermarkt.
//
// Uso: node scripts/fusionar_plantel_duplicado.mjs "<nombre a borrar>" "<nombre que queda>" [--dry]

import { readFile, writeFile } from 'node:fs/promises';

const DRY = process.argv.includes('--dry');
const [borrar, queda] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!borrar || !queda) {
  console.error('uso: node scripts/fusionar_plantel_duplicado.mjs "<a borrar>" "<que queda>" [--dry]');
  process.exit(1);
}

const RUTA = 'src/playersDatabase.json';
const crudo = JSON.parse(await readFile(RUTA, 'utf8'));
const esArray = Array.isArray(crudo);
const clave = esArray ? null : Object.keys(crudo).find(k => Array.isArray(crudo[k]));
const jugadores = esArray ? crudo : crudo[clave];

const aBorrar = jugadores.filter(p => p.team_name === borrar);
const seQuedan = jugadores.filter(p => p.team_name === queda);

console.log(`"${borrar}": ${aBorrar.length} jugadores  ->  se borran`);
console.log(`"${queda}": ${seQuedan.length} jugadores  ->  se quedan`);

if (!seQuedan.length) {
  console.error(`\nABORTA: "${queda}" no tiene jugadores. Borrar el otro dejaría al club sin plantel.`);
  process.exit(1);
}
if (!aBorrar.length) { console.log('\nno hay nada que borrar.'); process.exit(0); }

const filtrados = jugadores.filter(p => p.team_name !== borrar);
console.log(`\n${jugadores.length} -> ${filtrados.length} jugadores en la base`);

if (DRY) { console.log('\n(--dry: no se escribió nada)'); process.exit(0); }
const salida = esArray ? filtrados : { ...crudo, [clave]: filtrados };
await writeFile(RUTA, JSON.stringify(salida), 'utf8');
console.log(`-> ${RUTA}`);
