// Los clasicos: que existan de verdad y que pesen de verdad.
//
// Lo que se prueba no es "que funcione" sino las dos cosas que rompen esta feature en silencio:
//
//   1. IDS INVENTADOS. Un clasico escrito con un id que no existe no falla nunca: simplemente no se
//      activa jamas y nadie se entera. Al escribir la tabla la primera vez, 19 de 61 ids estaban
//      mal -- todos plausibles ('boca_juniors' en vez de 'boca', 'liverpool' en vez de
//      'liverpool_eng'). Sin esta prueba, dos tercios de los derbis eran letra muerta.
//   2. QUE EL ORDEN NO IMPORTE. Boca-River y River-Boca son el mismo partido.
import { esClasico, CLASICO_MULTIPLICADOR_GANAR, CLASICO_MULTIPLICADOR_PERDER } from '../src/clasicos';
import { ULTIMATE_CLUBS_DATABASE } from '../src/data';
import { readFileSync } from 'node:fs';

let fallas = 0;
const ok = (n: string, c: boolean, d = '') => { if (!c) fallas++; console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`); };

const src = readFileSync('src/clasicos.ts', 'utf8');
const pares = [...src.matchAll(/\['([a-z_0-9]+)', '([a-z_0-9]+)'\]/g)].map(m => [m[1], m[2]] as const);
const existen = new Set(ULTIMATE_CLUBS_DATABASE.map(c => c.id));
const inexistentes = [...new Set(pares.flat())].filter(i => !existen.has(i));

ok('todos los ids existen en la base', inexistentes.length === 0, inexistentes.join(', '));
ok('hay una cantidad razonable de clasicos', pares.length >= 30, `(${pares.length})`);

// Ninguno puede estar repetido: un par duplicado no rompe nada pero delata un descuido.
const claves = pares.map(([a, b]) => [a, b].sort().join('|'));
ok('sin pares duplicados', new Set(claves).size === claves.length);

// Y ninguno puede ser un club contra si mismo.
ok('ningun club es su propio clasico', !pares.some(([a, b]) => a === b));

ok('el orden no importa', esClasico('boca', 'river') && esClasico('river', 'boca'));
ok('un cruce cualquiera NO es clasico', !esClasico('boca', 'fc_barcelona'));

// Perder tiene que doler, pero ganar tiene que compensar mas.
ok('ganar el clasico pesa mas que perderlo', CLASICO_MULTIPLICADOR_GANAR > CLASICO_MULTIPLICADOR_PERDER);
ok('los dos multiplicadores suben lo que esta en juego',
   CLASICO_MULTIPLICADOR_GANAR > 1 && CLASICO_MULTIPLICADOR_PERDER > 1);

console.log(fallas === 0 ? `\nLos 8 casos pasan. ${pares.length} clasicos cargados.` : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
