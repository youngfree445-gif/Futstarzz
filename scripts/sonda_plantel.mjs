/**
 * ¿EN QUÉ EQUIPO DE LA BASE ESTÁ EL PLANTEL DE ESTE CLUB?
 *
 *   npm run sonda                      todos los clubes que hoy figuran sin plantel
 *   npm run sonda -- "CD Tondela"      uno solo
 *   npm run sonda -- --json salida.json
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUÉ ESTO Y NO COMPARAR NOMBRES
 * ---------------------------------------------------------------------------------------------
 *
 * La base de jugadores escribe los clubes a su manera -- abreviados ("A. Sullana", "Mineros Z."),
 * sin licencia ("Lombardia FC" es el Inter, "Latium" la Lazio) o al revés, más largos ("Ceará SC").
 * Emparejar por parecido de nombre ya rompió el juego varias veces: metió el plantel del Racing de
 * Avellaneda en el Racing de Montevideo y el del San Antonio Bulo Bulo en el San Antonio de Ecuador.
 * Los dos clubes se veían perfectos en pantalla, con once jugadores cada uno.
 *
 * Así que esto no mira el nombre del club. Baja el plantel REAL de Transfermarkt y busca a esos
 * jugadores, por nombre completo, dentro de la base. Si veinte de ellos están todos en el mismo
 * equipo, ese equipo ES el club, se llame como se llame.
 *
 * LO QUE HAY QUE MIRAR ES LA DISTANCIA, no el porcentaje. Un club con 22 coincidencias donde el
 * segundo tiene 1 está resuelto; uno con 9 donde el segundo tiene 7 no está resuelto, está
 * empatado. El Santiago Wanderers de Chile daba 9 con el equipo "Wanderers" y parecía suyo: el
 * Montevideo Wanderers da 19 con el mismo equipo. Es del uruguayo.
 *
 * DOS TRAMPAS QUE LA SONDA NO VE SOLA, y por eso avisa en vez de decidir:
 *
 *   - La búsqueda de Transfermarkt puede devolver OTRO club. Buscando "San Antonio" devuelve el
 *     boliviano aunque le preguntes por el ecuatoriano, y buscando "Brescia" llegó a devolver la
 *     Fiorentina. Se imprime siempre con qué club de TM se comparó: si no es el que preguntaste, el
 *     resultado no vale.
 *   - Si el equipo ganador YA es de otro club, no es un hallazgo: es el plantel de ese otro.
 *
 * El resultado se escribe a mano en NOMBRES_DE_CLUB (src/clubAliases.ts), que es el único lugar
 * donde viven los nombres. Después, npm run validar:alias.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { leerClubesDelJuego, leerNombresDeClub, nombreEnLaBase } from './lib/data_ts.mjs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const dormir = (ms) => new Promise(r => setTimeout(r, ms));
const args = process.argv.slice(2);
const salidaJson = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const pedidos = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--json');

function decode(s) {
  const named = { aacute:'á', eacute:'é', iacute:'í', oacute:'ó', uacute:'ú', ntilde:'ñ',
    Aacute:'Á', Eacute:'É', Iacute:'Í', Oacute:'Ó', Uacute:'Ú', Ntilde:'Ñ', uuml:'ü',
    ouml:'ö', auml:'ä', ccedil:'ç', atilde:'ã', otilde:'õ', ecirc:'ê', acirc:'â', ocirc:'ô',
    egrave:'è', agrave:'à', amp:'&', quot:'"', apos:"'", nbsp:' ' };
  return s.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
          .replace(/&([a-zA-Z]+);/g, (m, n) => named[n] ?? m).trim();
}

const bajar = async (url) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
};

/** Los primeros clubes que devuelve la búsqueda rápida de Transfermarkt. */
async function buscarClub(nombre) {
  const html = await bajar('https://www.transfermarkt.co/schnellsuche/ergebnis/schnellsuche?query=' + encodeURIComponent(nombre));
  const fuera = [], vistos = new Set();
  for (const m of html.matchAll(/<a[^>]+href="\/([^"\/]+)\/startseite\/verein\/(\d+)"[^>]*>([^<]{2,60})</g)) {
    if (vistos.has(m[2])) continue;
    vistos.add(m[2]);
    fuera.push({ slug: m[1], id: m[2], nombre: decode(m[3]) });
    if (fuera.length >= 3) break;
  }
  return fuera;
}

// El HTML del plantel: la tabla es `<table class="items">`, pero no se puede aislar con un
// `</table>` no-greedy porque cada fila trae `inline-table` anidadas y el corte se come 23 filas.
// Se toma desde la tabla hasta el final y se parte por `<tr class="odd|even">`, que son las reales.
async function plantelDeTM(slug, id) {
  const html = await bajar(`https://www.transfermarkt.co/${slug}/kader/verein/${id}`);
  const ini = html.indexOf('<table class="items"');
  if (ini < 0) return [];
  return html.slice(ini).split(/(?=<tr class="(?:odd|even)")/).slice(1)
    .map(b => b.match(/\/profil\/spieler\/(\d+)"[^>]*>([^<]+)</))
    .filter(Boolean)
    .map(m => ({ tmId: m[1], nombre: decode(m[2]) }));
}

// --- la base de jugadores, por nombre ---
const db = JSON.parse(await readFile('src/playersDatabase.json', 'utf8'));
const jugadores = Array.isArray(db) ? db : (db.players ?? Object.values(db)[0]);
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const porNombre = new Map();
for (const p of jugadores) {
  const k = norm(p.nombre_completo);
  if (!porNombre.has(k)) porNombre.set(k, []);
  porNombre.get(k).push(p);
}
const conJugadores = new Set(jugadores.map(p => p.team_name?.toLowerCase()).filter(Boolean));

// --- qué clubes preguntar ---
const dataTs = await readFile('src/data.ts', 'utf8');
const NOMBRES = await leerNombresDeClub();
const clubes = leerClubesDelJuego(dataTs);
const dueno = new Map();   // equipo de la base -> club que ya lo reclama
for (const c of clubes) dueno.set(nombreEnLaBase(c, NOMBRES).toLowerCase(), c);

const aPreguntar = pedidos.length
  ? clubes.filter(c => pedidos.some(p => c.nombre.toLowerCase() === p.toLowerCase() || c.id === p))
  : clubes.filter(c => !conJugadores.has(nombreEnLaBase(c, NOMBRES).toLowerCase()));

if (!aPreguntar.length) { console.log('No encontré ese club en data.ts.'); process.exit(1); }
console.log(`Preguntando por ${aPreguntar.length} club(es).\n`);

const salida = [];
for (const c of aPreguntar) {
  const fila = { id: c.id, club: c.nombre, liga: c.liga, tm: null, cuenta: [], veredicto: '' };
  try {
    const hallados = await buscarClub(c.nombre);
    await dormir(1100);
    if (!hallados.length) throw new Error('no aparece en la búsqueda de Transfermarkt');
    const elegido = hallados[0];
    const plantel = await plantelDeTM(elegido.slug, elegido.id);
    await dormir(1100);
    fila.tm = { ...elegido, n: plantel.length, tambien: hallados.slice(1).map(x => x.nombre) };
    if (!plantel.length) throw new Error('Transfermarkt no le muestra plantel');

    const cuenta = new Map();
    for (const j of plantel) {
      for (const p of porNombre.get(norm(j.nombre)) ?? []) {
        cuenta.set(p.team_name, (cuenta.get(p.team_name) ?? 0) + 1);
      }
    }
    fila.cuenta = [...cuenta.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([equipo, n]) => ({ equipo, n, de: plantel.length, ocupado: dueno.get(equipo.toLowerCase())?.nombre ?? null }));

    const primero = fila.cuenta[0], segundo = fila.cuenta[1];
    fila.veredicto =
      !primero ? 'ninguno de sus jugadores está en la base'
      : primero.equipo === 'Agentes libres' ? 'sus jugadores están de agentes libres: no hay plantel que asignar'
      : primero.ocupado ? `ese plantel ya es de ${primero.ocupado}`
      : (primero.n >= 5 && primero.n >= (segundo?.n ?? 0) * 4) ? 'CLARO'
      : 'EMPATADO — mirarlo a mano';
  } catch (e) {
    fila.veredicto = e.message;
  }
  const p = fila.cuenta[0];
  console.log(`${fila.veredicto.padEnd(46)} ${fila.club}`);
  console.log(`     TM: "${fila.tm?.nombre ?? '-'}" (${fila.tm?.n ?? 0} jugadores)`
    + (fila.tm?.tambien?.length ? `   [la búsqueda también dio: ${fila.tm.tambien.join(', ')}]` : ''));
  if (fila.cuenta.length) console.log(`     ${fila.cuenta.map(x => `"${x.equipo}" ${x.n}/${x.de}${x.ocupado ? ' (de ' + x.ocupado + ')' : ''}`).join('  ·  ')}`);
  salida.push(fila);
}

const claros = salida.filter(f => f.veredicto === 'CLARO');
console.log(`\n${claros.length} de ${salida.length} quedan claros. Se escriben a mano en NOMBRES_DE_CLUB (src/clubAliases.ts):`);
for (const f of claros) console.log(`  "${f.id}": { "nombre": "${f.club}", "plantel": "${f.cuenta[0].equipo}" },`);
if (salidaJson) { await writeFile(salidaJson, JSON.stringify(salida, null, 1)); console.log('\ndetalle en', salidaJson); }
