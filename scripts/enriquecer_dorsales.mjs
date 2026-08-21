// Le pone a cada jugador de la base su DORSAL REAL.
//
//   node scripts/enriquecer_dorsales.mjs --dry
//   node scripts/enriquecer_dorsales.mjs
//
// DE DONDE SALEN. `src/playersDatabase.json` -- la base que usa el juego -- no tiene números de
// camiseta. `src/latamfc26.json` sí: 32.771 jugadores, TODOS con `number`. Son la misma familia de
// datos y comparten `player_id`, así que se enlazan por ahí.
//
// POR ID, NUNCA POR NOMBRE. Medido: por `player_id` enlazan 28.130 de 30.605 (92%); por nombre y
// equipo, 25.296 (79%). Y el nombre además trae el problema de siempre -- dos jugadores con el
// mismo nombre en el mismo club existen, y ponerle a uno el dorsal del otro es el tipo de error que
// después no se encuentra nunca.
//
// LOS QUE NO ENLAZAN QUEDAN SIN DORSAL, y está bien: `dorsal` es opcional y el juego tiene que
// saber mostrar un plantel donde algunos no tienen número. Inventarles uno sería peor -- se vería
// igual de bien y sería mentira.

import fs from 'fs';
import path from 'path';

const RAIZ = path.resolve(process.argv[1], '../..');
const BASE = path.join(RAIZ, 'src/playersDatabase.json');
const FUENTE = path.join(RAIZ, 'src/latamfc26.json');
const dry = process.argv.includes('--dry');

const base = JSON.parse(fs.readFileSync(BASE, 'utf-8'));
const fuente = JSON.parse(fs.readFileSync(FUENTE, 'utf-8'));

// El dorsal Y el club en el que lo lleva. El club hace falta: ver el guard de abajo.
const porId = new Map();
for (const j of fuente) {
  const n = parseInt(String(j.number ?? ''), 10);
  if (!Number.isFinite(n) || n < 1 || n > 99) continue;
  porId.set(String(j.playerid), { n, club: j.teamname ?? '' });
}

/**
 * Compara nombres de club de las dos fuentes sin pelear por acentos ni por sufijos.
 *
 * Los sufijos se sacan como PALABRAS COMPLETAS. Sin los limites de palabra, "el" se comia la mitad
 * de "Elche" y "de" la de "Dender": dos clubes distintos podian reducirse al mismo nucleo y el
 * guard de club dejaria pasar un dorsal ajeno, que es justo lo que este guard existe para impedir.
 */
const SUFIJOS = new Set(['fc', 'cf', 'afc', 'sc', 'ac', 'cd', 'ca', 'club', 'de', 'del', 'la', 'el', 'los', 'las']);
const normClub = (s) => String(s).toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9\s]/g, ' ')
  .split(/\s+/).filter(w => w && !SUFIJOS.has(w))
  .join('');

let puestos = 0, seFue = 0, sinDorsal = 0;
const chocan = new Map();   // club -> dorsal -> cuántos
for (const j of base) {
  const hit = porId.get(String(j.player_id));
  if (hit == null) { sinDorsal++; continue; }

  // EL DORSAL VIEJO NO VALE EN EL CLUB NUEVO, y esto no es un detalle: nuestra base ya tiene los
  // fichajes aplicados y la fuente de dorsales es anterior. Sin este guard, Hincapié llegaba al
  // Arsenal con el 3 que llevaba en Leverkusen y Mosquera con el 3 del Valencia -- tres jugadores
  // del Arsenal con el mismo número. Medido: 385 de 473 clubes jugables con algún repetido, doce en
  // el Arsenal.
  //
  // Si el jugador cambió de club, NO SABEMOS qué número lleva ahora, y no saberlo se dice dejándolo
  // vacío. Inventarle uno se vería igual de bien y sería mentira.
  if (normClub(hit.club) !== normClub(j.team_name)) { seFue++; continue; }

  const n = hit.n;
  puestos++;
  j.dorsal = n;
  const k = j.team_name ?? '?';
  if (!chocan.has(k)) chocan.set(k, new Map());
  const m = chocan.get(k);
  m.set(n, (m.get(n) ?? 0) + 1);
}

// CUANTOS DORSALES REPETIDOS QUEDAN DENTRO DE UN MISMO CLUB. No se arreglan acá: el dato es el que
// es, y taparlo escondería que la fuente trae un plantel viejo mezclado con uno nuevo. Se informa
// para saber con qué se está trabajando, y el juego lo resuelve al mostrarlo.
let clubesConChoque = 0, choquesTotales = 0;
for (const [, m] of chocan) {
  const rep = [...m.values()].filter(v => v > 1).length;
  if (rep) { clubesConChoque++; choquesTotales += rep; }
}

console.log(`jugadores en la base:      ${base.length}`);
console.log(`  con dorsal nuevo:        ${puestos}`);
console.log(`  cambió de club, sin dorsal: ${seFue}`);
console.log(`  sin dorsal (no enlazan): ${sinDorsal}`);
console.log(`clubes con algún dorsal repetido: ${clubesConChoque} (${choquesTotales} números)`);

if (dry) { console.log('\n--dry: no se escribió nada.'); process.exit(0); }
fs.writeFileSync(BASE, JSON.stringify(base), 'utf-8');
console.log(`\nEscrito ${BASE}`);
