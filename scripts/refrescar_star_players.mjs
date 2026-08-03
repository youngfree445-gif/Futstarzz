// Pone en data.ts los starPlayers de un club a partir de su plantel real.
//
// starPlayers es lo que se ve en la ficha del club, y los clubes cargados a mano quedaban con
// ["Jugador 1","Jugador 2"] aunque su plantel real ya estuviera en playersDatabase.json. Esto toma
// los mejores por valor de mercado y los escribe con su posición, como el resto de los clubes.
//
// Uso: node scripts/refrescar_star_players.mjs <clubId> [<clubId>...] [--dry]

import { readFile, writeFile } from 'node:fs/promises';

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
  // El sinónimo se busca SOLO dentro de EQUIPO_SYNONYMS_POR_ID: `'<id>': '<nombre>'` suelto también
  // matchea la línea `id: 'patriotas',` del propio club y devolvía el id como nombre de equipo.
  // Hay DOS mapas de sinónimos y el juego consulta los dos, en este orden (ver la línea de
  // `nombreParaBuscar` en data.ts): primero por id -- que es el que desambigua homónimos como los
  // dos Leones -- y si no está, por nombre visible. Mirando solo el de id, clubes como
  // Independiente Valle del Cauca (sus jugadores están bajo "Ind. Yumbo") quedaban sin encontrar.
  //
  // Se parte por la DECLARACIÓN y no por la primera mención: el nombre aparece antes en un
  // comentario, donde el mapa todavía no existe.
  const porId = dataTs.split('const EQUIPO_SYNONYMS_POR_ID')[1]?.split('};')[0] ?? '';
  const porNombre = dataTs.split('const EQUIPO_SYNONYMS:')[1]?.split('};')[0] ?? '';
  const sinonimo = porId.match(new RegExp(`'${id}': '([^']+)'`))?.[1]
    ?? porNombre.match(new RegExp(`"${nombreVisible}": "([^"]+)"`))?.[1];
  const nombreEnBase = sinonimo ?? nombreVisible;

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
