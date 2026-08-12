// Validador de UN SOLO CALENDARIO. Se corre con `npm run validar:uncalendario`.
//
// Es el guardián de la decisión del 12 de agosto de 2026: en una carrera sólo existe el calendario
// con FECHAS reales, y todo club que no lo tenga deja de ser jugable. Ver clubesJugables.ts.
//
// La pregunta que contesta es una sola, y es la que hay que poder responder que NO:
//
//     ¿hay alguna forma de terminar en un club que el calendario no sabe hacer jugar?
//
// Se revisan las tres puertas por las que se cambia de club -- empezar la carrera, el mercado de
// pases, el descenso -- más la que nadie mira: que la TABLA de la liga y el CALENDARIO contengan
// exactamente los mismos clubes. Si divergen, aparecen equipos fantasma en la tabla (clavados en
// cero puntos, hundiendo el promedio de descenso de los demás) o equipos que juegan sin figurar.

import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data';
import { clubesDeLiga, clubesJugables, esClubJugable, ligaTieneCalendario } from '../src/clubesJugables';
import { fixturesForClub } from '../src/dateSchedule';
import { leagueKeyFor } from '../src/leagueEngine';
import { reglasDeLiga } from '../src/promocionDescenso';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

let fallas = 0;
const fallo = (msg: string) => { fallas++; console.log(`   FALLA: ${msg}`); };

// --- A) Cobertura: qué queda adentro y qué queda afuera ---
const jugables = clubesJugables();
const claves = [...new Set(jugables.map(leagueKeyFor))].sort();

console.log('=== A) Qué es jugable ===');
console.log(`clubes jugables: ${jugables.length} de ${CLUBS.length}`);
console.log(`ligas jugables:  ${claves.length}\n`);
for (const k of claves) {
  const enLaBase = CLUBS.filter(c => leagueKeyFor(c) === k).length;
  const juegan = clubesDeLiga(k).length;
  console.log(`   ${k.padEnd(22)} ${String(juegan).padStart(3)} juegan` +
    (juegan !== enLaBase ? `   (${enLaBase - juegan} sin calendario, fuera de la tabla)` : ''));
}

// --- B) La tabla y el calendario tienen que coincidir ---
//
// Para cada liga jugable: los clubes que el calendario hace jugar TIENEN que ser exactamente los
// que arman la tabla. Un club en la tabla sin fechas nunca suma; un club con fechas fuera de la
// tabla juega partidos que no se anotan en ningún lado.
console.log('\n=== B) La tabla y el calendario contienen los mismos clubes ===');
for (const k of claves) {
  const enTabla = new Set(clubesDeLiga(k).map(c => c.name));

  // Los que el calendario hace jugar en la competición de liga de estos clubes.
  const enCalendario = new Set<string>();
  for (const club of clubesDeLiga(k)) {
    for (const f of fixturesForClub(club.name)) {
      if (f.temporada !== 1 || f.competition.kind !== 'league') continue;
      enCalendario.add(club.name);
      enCalendario.add(f.opponentName);
    }
  }

  const sobranEnCalendario = [...enCalendario].filter(n => !enTabla.has(n));
  const faltanEnCalendario = [...enTabla].filter(n => !enCalendario.has(n));

  if (faltanEnCalendario.length) {
    fallo(`${k}: ${faltanEnCalendario.length} en la tabla que el calendario NUNCA hace jugar` +
      ` (${faltanEnCalendario.slice(0, 4).join(', ')})`);
  }
  // Los "de más" del calendario son rivales de otra división que comparten competición (los
  // cuadrangulares colombianos viven dentro de la liga) -- se informa, no se falla.
  if (sobranEnCalendario.length) {
    console.log(`   ${k.padEnd(22)} ${sobranEnCalendario.length} rivales de calendario fuera de esta tabla` +
      ` (${sobranEnCalendario.slice(0, 3).join(', ')}${sobranEnCalendario.length > 3 ? '…' : ''})`);
  }
}
if (fallas === 0) console.log('   Todas las tablas coinciden con su calendario.');

// --- C) El descenso no puede sacarte del calendario ---
console.log('\n=== C) Ascenso y descenso ===');
for (const league of [...new Set(CLUBS.map(c => c.league))]) {
  if (!reglasDeLiga(league)) continue;
  const primera = ligaTieneCalendario(`${league}-1`);
  const segunda = ligaTieneCalendario(`${league}-2`);
  if (!primera) continue;
  console.log(`   ${league.padEnd(16)} Primera sí · Segunda ${segunda ? 'sí  -> hay ascenso y descenso' : 'NO  -> congelado hasta cargar su calendario'}`);
}

// --- D) Ningún club jugable puede quedarse sin partidos ---
console.log('\n=== D) Todos los jugables tienen temporada completa ===');
let sinPartidos = 0;
let flacos = 0;
for (const c of jugables) {
  const t1 = fixturesForClub(c.name).filter(f => f.temporada === 1 && f.competition.kind === 'league');
  if (t1.length === 0) { sinPartidos++; fallo(`${c.name} es jugable pero no tiene ni un partido de liga`); }
  else if (t1.length < 10) flacos++;
}
console.log(`   sin partidos de liga: ${sinPartidos}`);
console.log(`   con menos de 10 fechas en la temporada 1: ${flacos}  (la carrera arranca el 12 de enero: en Europa es media temporada)`);

// --- E) El reloj de semanas: cuánto queda por sacar ---
//
// TRINQUETE. El objetivo final es que estas funciones no existan: mientras existan, existen dos
// formas de contar el tiempo y los bugs vuelven. Acá se cuentan y se compara contra un techo. El
// techo sólo puede BAJAR: si un cambio lo sube, este validador falla y hay que explicar por qué.
//
// Para bajarlo, se reemplaza la función por su equivalente de fecha y se actualiza el número.
console.log('\n=== E) Lo que queda del reloj de semanas ===');

const TECHOS: Record<string, number> = {
  // Usos en CÓDIGO (sin comentarios) al 12 de agosto de 2026, con el reemplazo de cada uno al lado.
  // Estos números sólo pueden bajar.
  'SEASON_LENGTH_WEEKS': 8,    // -> la temporada dura lo que dice el calendario
  'isCupWeek': 16,             // -> la competición de la fecha de hoy
  'getRealDate': 27,           // -> fixturesAtStep(club, paso).date
  'cupWeeksElapsed': 4,        // -> fechas de copa ya pasadas, según el calendario
  'isWorldCupBreakWeek': 15,   // -> una ventana de FECHAS
  'getSeasonYear': 64,         // -> temporadaDelPaso(club, paso).temporada
};

/**
 * El código sin los comentarios.
 *
 * Hace falta porque este proyecto documenta MUCHO, y los comentarios que explican por qué se sacó
 * una función de semanas nombran justamente a esa función. Sin esto, escribir "reemplazamos
 * getSeasonYear por la temporada del calendario" contaba como un uso más de getSeasonYear y el
 * trinquete saltaba al revés: castigaba explicar el arreglo.
 *
 * El `[^:]` antes de `//` es para no cortar una línea a la mitad de una URL (`https://…`).
 */
function soloCodigo(fuente: string): string {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function contarEnFuentes(termino: string): number {
  let n = 0;
  const recorrer = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const ruta = join(dir, e.name);
      if (e.isDirectory()) { recorrer(ruta); continue; }
      if (!/\.tsx?$/.test(e.name)) continue;
      n += (soloCodigo(readFileSync(ruta, 'utf8')).match(new RegExp(termino, 'g')) ?? []).length;
    }
  };
  recorrer('src');
  return n;
}

let totalAhora = 0;
let totalTecho = 0;
for (const [termino, techo] of Object.entries(TECHOS)) {
  const ahora = contarEnFuentes(termino);
  totalAhora += ahora;
  totalTecho += techo;
  const estado = ahora > techo ? `SUBIÓ (techo ${techo})` : ahora < techo ? `bajó de ${techo}` : '';
  if (ahora > techo) fallo(`${termino}: ${ahora} apariciones, el techo es ${techo}. Volvió a entrar el reloj de semanas.`);
  console.log(`   ${termino.padEnd(22)} ${String(ahora).padStart(4)}   ${estado}`);
}
console.log(`   ${'TOTAL'.padEnd(22)} ${String(totalAhora).padStart(4)}   (arrancamos en ${totalTecho}; el objetivo es 0)`);

console.log(`\n${fallas === 0 ? 'Sin fallas.' : `${fallas} FALLAS (ver arriba).`}`);
process.exit(fallas === 0 ? 0 : 1);
