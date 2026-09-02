/**
 * UN fichaje suelto, el que acabás de ver en la prensa y no querés esperar a que Transfermarkt lo
 * publique.
 *
 *   npm run fichaje -- "Bruno Guimarães" "Arsenal"
 *   npm run fichaje -- "Luis Díaz" "Bayern München" --de "Liverpool"    (si hay dos con ese nombre)
 *   npm run fichaje -- "Fulano de Tal" --libre                          (queda sin club)
 *   npm run fichaje -- "Pibe Nuevo" "Boca Juniors" --posicion ST --valor 2m --edad 19
 *   npm run fichaje -- "Bruno Guimarães" "Arsenal" --dry                (mostrar y no escribir)
 *
 * NO REIMPLEMENTA NADA. Arma la misma estructura que devuelve el scraper de Transfermarkt -- una
 * liga, un club, un alta -- y se la pasa a scripts/aplicar_fichajes.mjs, que es el único que sabe
 * cruzar un nombre contra la base sin equivocarse de persona. Un segundo emparejador "sólo para los
 * manuales" sería la segunda fuente para la misma pregunta, y así se rompió este proyecto antes.
 *
 * Lo único que hace de más es buscar el CLUB en data.ts, y para eso pide el nombre exacto del juego:
 * si escribís "Barcelona" y hay dos, te muestra los dos y no elige. Elegir por vos es exactamente el
 * error del Everton de Viña del Mar jugando en Goodison Park.
 */

import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { leerClubesDelJuego } from './lib/data_ts.mjs';
import { equiposQueNoSonClub } from './lib/equipos.mjs';

const correr = promisify(execFile);
const args = process.argv.slice(2);
const tiene = (f) => args.includes(f);
const valor = (f, x) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : x; };
const sueltos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) { if (['--de', '--posicion', '--valor', '--edad'].includes(args[i])) i++; continue; }
  sueltos.push(args[i]);
}

const [NOMBRE, CLUB] = sueltos;
const LIBRE = tiene('--libre');
const DRY = tiene('--dry');
const DESDE = valor('--de', null);
const CACHE = 'node_modules/.cache/fichajes';

if (!NOMBRE || (!CLUB && !LIBRE)) {
  console.log(`
  npm run fichaje -- "Nombre del jugador" "Club destino"
  npm run fichaje -- "Nombre del jugador" --libre

  --de "Club actual"     para desempatar si hay dos jugadores con el mismo nombre
  --posicion ST          si el jugador no está en la base y hay que crearlo (GK CB LB RB CDM CM CAM LM RM LW RW ST)
  --valor 40m            valor de mercado, para estimarle la media
  --edad 24
  --dry                  mostrar qué haría y no escribir
`);
  process.exit(1);
}

const dataTs = await readFile('src/data.ts', 'utf8');
const clubes = leerClubesDelJuego(dataTs);

// --- Dónde está hoy el jugador, sólo para mostrarlo antes de tocar nada ------------------------
const jugadores = JSON.parse(await readFile('src/playersDatabase.json', 'utf8'));
const NO_SON_CLUB = equiposQueNoSonClub(dataTs, jugadores);
const filas = jugadores.filter(p => p.nombre_completo === NOMBRE && !NO_SON_CLUB.has(p.team_name));
const donde = filas.map(p => p.team_name);
console.log(`\n${NOMBRE}`);
console.log(`  hoy en la base: ${donde.length ? donde.join(' / ') : 'NO ESTÁ (se va a crear)'}`);

if (!filas.length && !LIBRE && !valor('--posicion', null)) {
  console.log(`\n  Para crearlo hace falta al menos la posición: agregá --posicion ST (o CB, GK, ...).`);
  process.exit(1);
}
if (filas.length > 1 && !DESDE) {
  console.log(`\n  Hay ${filas.length} jugadores con ese nombre. Agregá --de "${donde[0]}" para decir cuál es.`);
  process.exit(1);
}

// --- El club, con el nombre que usa el juego --------------------------------------------------
const normal = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const buscarClub = (texto) => {
  const exactos = clubes.filter(c => normal(c.nombre) === normal(texto));
  if (exactos.length === 1) return exactos[0];
  const parecidos = exactos.length ? exactos : clubes.filter(c => normal(c.nombre).includes(normal(texto)));
  if (parecidos.length === 1) return parecidos[0];
  console.log(parecidos.length
    ? `\n  "${texto}" puede ser ${parecidos.length} clubes distintos. Escribí el nombre exacto:\n` +
      parecidos.slice(0, 12).map(c => `     ${c.nombre}  (${c.liga})`).join('\n')
    : `\n  No hay ningún club que se llame "${texto}" en data.ts.`);
  process.exit(1);
};

const destino = LIBRE ? null : buscarClub(CLUB);
const origen = DESDE ? DESDE : (filas[0]?.team_name ?? null);
if (destino) console.log(`  se va a: ${destino.nombre}  (${destino.liga})`);
else console.log(`  se va a: agentes libres`);

// --- La estructura que el motor sabe leer ----------------------------------------------------
//
// Un alta con `otroClub` es el criterio más fuerte que tiene aplicar_fichajes: nombre exacto Y club
// del que sale. Cuando el jugador no está en la base, `posicion`/`valor`/`edad` son lo que necesita
// crearlo con una media que no sea inventada.
const alta = {
  nombre: NOMBRE,
  tmId: null,
  edad: valor('--edad', null) ? Number(valor('--edad', null)) : null,
  posicion: ({ GK: 'Goalkeeper', CB: 'Centre-Back', LB: 'Left-Back', RB: 'Right-Back',
    CDM: 'Defensive Midfield', CM: 'Central Midfield', CAM: 'Attacking Midfield',
    LM: 'Left Midfield', RM: 'Right Midfield', LW: 'Left Winger', RW: 'Right Winger',
    ST: 'Centre-Forward' })[valor('--posicion', '').toUpperCase()] ?? null,
  valor: valor('--valor', null) ? `€${valor('--valor', null)}` : null,
  otroClub: origen,
  otroClubTmId: null,
};

const entrada = LIBRE
  // Una baja hacia un club que el juego no tiene es justo lo que el motor manda a agentes libres.
  ? { saison: 'manual', ligas: [{ liga: '', clubes: [{ tmId: null, nombre: origen, altas: [], bajas: [{ ...alta, otroClub: 'sin club' }] }] }] }
  : { saison: 'manual', ligas: [{ liga: destino.liga, clubes: [{ tmId: null, nombre: destino.nombre, altas: [alta], bajas: [] }] }] };

await mkdir(CACHE, { recursive: true });
const ENTRADA = `${CACHE}/manual.json`;
const INFORME = `${CACHE}/informe_manual.json`;
await writeFile(ENTRADA, JSON.stringify(entrada));

const parametros = ['scripts/aplicar_fichajes.mjs', '--desde', ENTRADA, '--informe', INFORME];
if (!DRY) parametros.push('--escribir');
let salida = '';
try { salida = (await correr(process.execPath, parametros, { maxBuffer: 64 * 1024 * 1024 })).stdout; }
catch (e) { salida = e.stdout ?? e.message; }

const informe = JSON.parse(await readFile(INFORME, 'utf8'));
console.log('');
for (const m of informe.movimientos) console.log(`  APLICADO: ${m.nombre}  ${m.de} -> ${m.a}`);
for (const c of informe.creados) console.log(`  CREADO:   ${c.nombre} -> ${c.a}  (media estimada ${c.media})`);
for (const x of informe.aLibres) console.log(`  A LIBRES: ${x.nombre}  desde ${x.de}`);
for (const p of informe.pendientes) console.log(`  SIN RESOLVER: ${p.nombre} — la base lo tiene en ${p.esta_en}. Probá con --de "<club exacto>".`);
if (informe.sinClub.length) console.log(`  El club "${informe.sinClub[0]}" no tiene plantel en la base: no se puede fichar ahí.`);

if (informe.banderas.length) {
  console.log(`\n  !! NO SE GUARDÓ: ${informe.banderas.join(' · ')}`);
  process.exit(2);
}
if (DRY) { console.log(`\n  (--dry: no se escribió nada.)`); process.exit(0); }

const hubo = informe.movimientos.length + informe.creados.length + informe.aLibres.length;
if (hubo) {
  await appendFile('data/fichajes_bitacora.md',
    `\n## ${new Date().toISOString().slice(0, 10)} — a mano\n\n` +
    [...informe.movimientos.map(m => `- ${m.nombre}  ${m.de} -> ${m.a}`),
     ...informe.creados.map(c => `- ${c.nombre}  (nuevo en la base) -> ${c.a}`),
     ...informe.aLibres.map(x => `- ${x.nombre}  ${x.de} -> agentes libres`)].join('\n') + '\n');
  console.log(`\n  Guardado. Deshacer: git checkout src/playersDatabase.json src/data.ts data/fichajes_bitacora.md`);
} else {
  console.log(`\n  No cambió nada.`);
}
