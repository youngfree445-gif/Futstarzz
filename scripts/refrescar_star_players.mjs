// Pone en data.ts los starPlayers de un club a partir de su plantel real.
//
// starPlayers es lo que se ve en la ficha del club, y los clubes cargados a mano quedaban con
// ["Jugador 1","Jugador 2"] aunque su plantel real ya estuviera en playersDatabase.json. Esto toma
// los mejores por valor de mercado y los escribe con su posición, como el resto de los clubes.
//
// Uso: node scripts/refrescar_star_players.mjs <clubId> [<clubId>...] [--dry]

import { readFile, writeFile } from 'node:fs/promises';
import { leerNombresDeClub, nombreEnLaBase } from './lib/data_ts.mjs';

const DRY = process.argv.includes('--dry');
const IDS = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!IDS.length) { console.error('uso: node scripts/refrescar_star_players.mjs <clubId>... [--dry]'); process.exit(1); }

const CUANTOS = 11;

// Mismo mapeo que usa el resto del juego, para que la ficha muestre las siglas de siempre.
const POS_CORTA = {
  GK: 'GK', CB: 'CB', LB: 'LB', RB: 'RB', CDM: 'CDM', CM: 'CM', CAM: 'CAM',
  LM: 'LM', RM: 'RM', LW: 'LW', RW: 'RW', ST: 'ST',
};

const db = JSON.parse(await readFile('src/playersDatabase.json', 'utf8'));
const jugadores = Array.isArray(db) ? db : (db.players ?? Object.values(db)[0]);
let dataTs = await readFile('src/data.ts', 'utf8');
const NOMBRES = await leerNombresDeClub();

for (const id of IDS) {
  // Se ubica el club por id y se lee el nombre con el que sus jugadores figuran en la base: puede
  // no ser el nombre visible (el Leones colombiano guarda los suyos como "Itagüí Leones").
  //
  // data.ts tiene los clubes en DOS formatos: unos en una sola línea y otros repartidos en varias
  // (`id:` solo en su renglón). Se toma el bloque entero hasta el `},` que lo cierra para que
  // funcione con los dos.
  // Se corta en `starPlayers: [...]`, que es lo único que hay que reemplazar. Cortar en el primer
  // `}` no servía: el bloque tiene llaves anidadas (themeColor) y se cerraba antes de llegar.
  const reClub = new RegExp(`id: '${id}',[\\s\\S]*?starPlayers: \\[[^\\]]*\\]`, 'm');
  const linea = dataTs.match(reClub)?.[0];
  if (!linea) { console.log(`${id}: no está en data.ts`); continue; }

  const nombreVisible = linea.match(/name: '([^']+)'/)?.[1] ?? id;
  // Cómo llama la base de jugadores a este plantel: lo contesta la tabla de nombres, la misma que
  // usa el juego (src/clubAliases.ts). Este script tenía su propio lector y era uno de los cuatro
  // que había: cada arreglo entraba en uno y los demás se quedaban con el bug.
  const nombreEnBase = nombreEnLaBase({ id, nombre: nombreVisible }, NOMBRES);

  const suyos = jugadores
    .filter(p => p.team_name === nombreEnBase)
    .sort((a, b) => (b.valor_mercado_eur ?? 0) - (a.valor_mercado_eur ?? 0))
    .slice(0, CUANTOS);

  if (!suyos.length) { console.log(`${nombreVisible}: sin jugadores en la base (buscando "${nombreEnBase}")`); continue; }

  const lista = suyos
    .map(p => `'${p.nombre_completo.replace(/'/g, "\\'")} (${POS_CORTA[p.posicion_especifica] ?? p.posicion_especifica})'`)
    .join(', ');

  const nuevaLinea = linea.replace(/starPlayers: \[[^\]]*\]/, `starPlayers: [${lista}]`);
  if (nuevaLinea === linea) { console.log(`${nombreVisible}: no se encontró starPlayers en la línea`); continue; }

  dataTs = dataTs.replace(linea, nuevaLinea);
  console.log(`${nombreVisible.padEnd(30)} ${suyos.length} figuras <- "${nombreEnBase}"`);
}

if (DRY) { console.log('\n(--dry: no se escribió nada)'); process.exit(0); }
await writeFile('src/data.ts', dataTs, 'utf8');
console.log('\n-> src/data.ts');
