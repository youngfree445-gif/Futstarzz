/**
 * LOS TÉCNICOS AL DÍA, CON UN COMANDO.
 *
 *   npm run tecnicos              muestra qué cambió y lo escribe
 *   npm run tecnicos -- --dry     sólo lo muestra
 *   npm run tecnicos -- Colombiana Argentina    una o varias ligas
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUÉ HACE FALTA
 * ---------------------------------------------------------------------------------------------
 *
 * `npm run fichajes` mueve JUGADORES y nada más. El técnico de cada club no lo actualiza nadie, así
 * que quedó congelado en la fecha en que se cargó a mano. Lo encontró el jugador, no el código:
 * Junior figuraba con Alfredo Arias tres días después de que lo reemplazara Sebastián Viera.
 *
 * Y los técnicos cambian mucho más seguido que los planteles: varias veces por temporada, sin
 * ventana de pases que los ordene. Es justo el dato que no sirve mantener a mano.
 *
 * ---------------------------------------------------------------------------------------------
 * DE DÓNDE SALE EL ID DE CADA CLUB, que es lo que hace esto confiable
 * ---------------------------------------------------------------------------------------------
 *
 * NO se busca el club por nombre en Transfermarkt. Buscar por nombre es como se rompe: preguntando
 * por "San Antonio" devuelve el boliviano y por "Brescia" llegó a devolver la Fiorentina.
 *
 * Los ids salen del scrape de la ventana de pases (data/fichajes_2026.json), que los trae de las
 * páginas de liga de Transfermarkt: son ids verificados, uno por club, sin buscador de por medio.
 * Cubren las primeras divisiones de 30 ligas -- 366 de los 697 clubes --, que son las que el
 * jugador ve. Para las segundas no hay id y se avisa, no se adivina.
 *
 * El nombre del club se cruza con NOMBRES_DE_CLUB (src/clubAliases.ts), la única tabla de nombres,
 * y además tiene que coincidir el PAÍS: es lo que evita que el Racing de Avellaneda tome el técnico
 * del de Montevideo.
 *
 * Lo que se escribe es src/clubExtras.ts, que existe exactamente para esto ("datos volátiles por
 * club... los técnicos cambian todo el tiempo").
 */
import { readFile, writeFile } from 'node:fs/promises';
import { leerClubesDelJuego, leerNombresDeClub, nombresDeBusqueda } from './lib/data_ts.mjs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const dormir = (ms) => new Promise(r => setTimeout(r, ms));
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const ligasPedidas = args.filter(a => !a.startsWith('--'));

const decode = (s) => s
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
  .replace(/&([a-zA-Z]+);/g, (m, n) => ({ aacute:'á', eacute:'é', iacute:'í', oacute:'ó', uacute:'ú',
    ntilde:'ñ', Aacute:'Á', Eacute:'É', Iacute:'Í', Oacute:'Ó', Uacute:'Ú', Ntilde:'Ñ', uuml:'ü',
    ouml:'ö', auml:'ä', ccedil:'ç', atilde:'ã', otilde:'õ', ecirc:'ê', acirc:'â', ocirc:'ô',
    egrave:'è', agrave:'à', amp:'&', quot:'"', apos:"'", nbsp:' ' })[n] ?? m)
  .replace(/\s+/g, ' ').trim();

const RELLENO = new Set(['fc', 'cf', 'ca', 'ac', 'sc', 'cd', 'club', 'de', 'del', 'la', 'el', 'los', 'las', 'sad']);
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const clave = (s) => norm(s).split(' ').filter(w => w && !RELLENO.has(w)).join(' ');

/**
 * ¿Son la misma persona escrita distinta, o cambió el técnico?
 *
 * Transfermarkt escribe el nombre completo y el juego el de siempre: "Lucas González Vélez" contra
 * "Lucas González", "Hernán Herrera" contra "Hernán Darío Herrera". Sin esta pregunta el comando
 * anunciaba cinco cambios en Colombia cuando de verdad eran tres, y reescribía nombres que estaban
 * bien -- cambiando el que la gente usa por el del documento.
 *
 * La regla: si TODAS las palabras del nombre corto están en el largo, es el mismo. Dos técnicos
 * distintos no comparten nombre y apellido.
 */
function esElMismo(a, b) {
  const A = norm(a).split(' ').filter(Boolean), B = norm(b).split(' ').filter(Boolean);
  if (!A.length || !B.length) return false;
  const [corto, largo] = A.length <= B.length ? [A, B] : [B, A];
  return corto.every(w => largo.includes(w));
}

/**
 * El técnico de un club, de su página de cuerpo técnico.
 *
 * Va a /mitarbeiter/ y no a la portada: la portada del club NO trae al entrenador (comprobado con
 * Junior, 175 KB sin una sola mención).
 *
 * SE PIDE EL CARGO, y no alcanza con tomar al primero de la lista. Eso hacía la primera versión y
 * escribió mal a Deportivo Pasto: el club no tiene entrenador cargado en Transfermarkt y el primero
 * de su cuerpo técnico es un "Entrenador Asistente", así que el ayudante entró al juego como si
 * fuera el DT. En Junior el primero sí es el entrenador, y por eso el error no se veía probando con
 * el club que uno tiene a mano.
 *
 * El cargo tiene que decir "Entrenador" y nada más: "Entrenador Asistente", "Entrenador de porteros"
 * y "Empleado técnico" son otras personas. Si el club no tiene a nadie con ese cargo, se devuelve
 * null y se informa -- mejor un club sin técnico que un club con el ayudante en el lugar del DT.
 */
async function tecnicoDe(id) {
  const res = await fetch(`https://www.transfermarkt.co/x/mitarbeiter/verein/${id}`, {
    headers: { 'User-Agent': UA }, redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  for (const bloque of html.split('/profil/trainer/').slice(1)) {
    const nombre = /^\d+"[^>]*>\s*([^<]{2,50})/.exec(bloque);
    const cargo = /<td>([^<]{4,40})<\/td>/.exec(bloque);
    if (!nombre || !cargo) continue;
    if (decode(cargo[1]).toLowerCase() === 'entrenador') return decode(nombre[1]);
  }
  return null;
}

// --- los clubes, con su id ---------------------------------------------------------------------
const dataTs = await readFile('src/data.ts', 'utf8');
const NOMBRES = await leerNombresDeClub();
const clubes = leerClubesDelJuego(dataTs);
const scrape = JSON.parse(await readFile('data/fichajes_2026.json', 'utf8'));

const porClave = new Map();
for (const liga of scrape.ligas) {
  for (const c of liga.clubes) {
    if (!c.tmId) continue;
    const k = clave(c.nombre);
    if (!porClave.has(k)) porClave.set(k, []);
    porClave.get(k).push({ tmId: c.tmId, liga: liga.liga.replace(/ \d$/, '') });
  }
}

const conId = [];
for (const c of clubes) {
  if (ligasPedidas.length && !ligasPedidas.includes(c.liga)) continue;
  const nombres = nombresDeBusqueda(c, NOMBRES);

  // 1) Por clave exacta de palabras.
  const ids = new Set();
  for (const n of nombres) {
    for (const x of porClave.get(clave(n)) ?? []) if (x.liga === c.liga) ids.add(x.tmId);
  }

  // NO HAY SEGUNDA PASADA POR PARECIDO, y se probó que no la puede haber.
  //
  // Se intentó emparejar por SUBCONJUNTO dentro del mismo país, que arreglaba "AS Roma" contra
  // "Roma" y "FC Twente Enschede" contra "FC Twente". También le puso a FC Eindhoven el técnico del
  // PSV: "PSV Eindhoven" contiene a "Eindhoven", el PSV era el único candidato holandés con esa
  // palabra, y la regla lo dio por bueno. Peter Bosz aparecía dirigiendo la segunda división.
  //
  // Es la misma trampa que ya tiene escrita scripts/aplicar_fichajes.mjs: las palabras que sobran
  // nunca son decorativas. "PSV", "Montevideo", "del Valle" son justamente lo que distingue a un
  // club de su vecino. Así que o el nombre coincide, o hay un alias escrito en NOMBRES_DE_CLUB, o
  // no se toca. Los que faltaban están cargados ahí como `otros`.

  // UNO SOLO, o no se toca. Dos ids para el mismo club es no saber cuál es, y escribir el técnico
  // equivocado se ve perfecto en pantalla.
  if (ids.size === 1) conId.push({ ...c, tmId: [...ids][0] });
}

// El técnico que el juego muestra hoy: el de clubExtras si lo tiene, si no el de data.ts.
const extrasTs = await readFile('src/clubExtras.ts', 'utf8');
const dtActual = new Map();
for (const m of dataTs.matchAll(/id: '([^']+)'[\s\S]{0,300}?\bdt: '((?:[^'\\]|\\.)*)'/g)) dtActual.set(m[1], m[2]);
// La clave puede venir entre comillas: los ids que empiezan con dígito ("22_de_julio") no son
// identificadores válidos de JavaScript y se escriben así.
for (const m of extrasTs.matchAll(/^\s{2}"?([a-zA-Z0-9_áéíóúñ]+)"?:\s*\{\s*dt: '((?:[^'\\]|\\.)*)'/gm)) dtActual.set(m[1], m[2]);

console.log(`${conId.length} clubes con id de Transfermarkt${ligasPedidas.length ? ` (${ligasPedidas.join(', ')})` : ''}.\n`);

const cambios = [], errores = [];
for (const c of conId) {
  try {
    const nuevo = await tecnicoDe(c.tmId);
    await dormir(1100);
    if (!nuevo) { errores.push([c.nombre, 'Transfermarkt no le muestra técnico']); continue; }
    const viejo = dtActual.get(c.id);
    if (viejo && esElMismo(viejo, nuevo)) continue;
    cambios.push({ ...c, viejo: viejo ?? '(sin cargar)', nuevo });
    console.log(`  ${c.nombre.padEnd(30)} ${String(c.viejo ?? viejo ?? '—').padEnd(24)} -> ${nuevo}`);
  } catch (e) {
    errores.push([c.nombre, e.message]);
  }
}

console.log(`\n${cambios.length} técnicos cambiaron, ${conId.length - cambios.length - errores.length} ya estaban al día.`);
if (errores.length) {
  console.log(`\nNo se pudieron leer (${errores.length}):`);
  for (const [club, por] of errores.slice(0, 15)) console.log(`  ${club.padEnd(30)} ${por}`);
}

if (!cambios.length) process.exit(0);
if (DRY) { console.log('\n(--dry: no se escribió nada)'); process.exit(0); }

// --- se escriben en clubExtras.ts ---------------------------------------------------------------
//
// Al que ya tiene entrada se le cambia el dt y se le respetan los colores; al que no la tiene se le
// agrega una al final, antes del cierre. No se toca data.ts: el dt de allá es el valor por defecto y
// clubExtras es el que manda (ver la cabecera de ese archivo).
let salida = extrasTs;
const nuevos = [];
for (const c of cambios) {
  const re = new RegExp(`(^\\s{2}${c.id}:\\s*\\{\\s*dt: ')((?:[^'\\\\]|\\\\.)*)(')`, 'm');
  if (re.test(salida)) salida = salida.replace(re, `$1${c.nuevo.replace(/'/g, "\\'")}$3`);
  // La clave va entre comillas si el id no es un identificador válido de JavaScript. Hay ids que
  // empiezan con dígito -- "22_de_julio", "9_de_octubre" -- y escritos sin comillas no compilan.
  else nuevos.push(`  ${/^[A-Za-z_$][\w$]*$/.test(c.id) ? c.id : JSON.stringify(c.id)}: `
    + `{ dt: '${c.nuevo.replace(/'/g, "\\'")}' },   // ${c.nombre}`);
}
if (nuevos.length) {
  const cierre = salida.lastIndexOf('};');
  const hoy = new Date().toISOString().slice(0, 10);
  salida = salida.slice(0, cierre)
    + `\n  // ===== Al día con Transfermarkt (npm run tecnicos, ${hoy}) =====\n`
    + nuevos.join('\n') + '\n' + salida.slice(cierre);
}
await writeFile('src/clubExtras.ts', salida, 'utf8');
console.log(`\nGUARDADO en src/clubExtras.ts: ${cambios.length - nuevos.length} corregidos, ${nuevos.length} agregados.`);
console.log('  deshacer: git checkout src/clubExtras.ts');
