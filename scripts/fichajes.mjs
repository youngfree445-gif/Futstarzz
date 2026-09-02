/**
 * EL COMANDO ÚNICO PARA PONER LOS PLANTELES AL DÍA.
 *
 *   npm run fichajes                  baja lo nuevo de Transfermarkt, lo aplica y lo anota
 *   npm run fichajes -- --dry         igual, pero sin escribir nada
 *   npm run fichajes -- --ligas GB1,ES1   sólo esas ligas (códigos de Transfermarkt)
 *   npm run fichajes -- --refrescar   vuelve a bajar aunque lo bajado sea de hace un rato
 *   npm run fichajes -- --pendientes  lista lo que quedó sin resolver y por qué
 *   npm run fichajes -- --todo        ignora el registro y revisa la ventana entera otra vez
 *
 * POR QUÉ EXISTE. Las dos piezas ya estaban -- scrape_fichajes_tm.mjs baja la ventana de pases y
 * aplicar_fichajes.mjs la cruza contra la base --, pero usarlas cada vez que hay tres fichajes era
 * caro por dos razones, y la segunda es la grave:
 *
 *   1. El informe es de la VENTANA ENTERA: 6.401 altas, de las cuales 6.390 ya estaban aplicadas
 *      desde la vez anterior. Encontrar los tres que importan ahí adentro es el trabajo tedioso.
 *   2. Correrlo dos veces sobre los mismos datos NO daba lo mismo. Medido: la segunda corrida movía
 *      1.800 jugadores más y creaba 625 duplicados. Actualizar era una operación que daba miedo
 *      repetir, así que se hacía cada mucho, así que cada vez era más grande.
 *
 * LA IDEA. Un registro de lo ya aplicado, en data/fichajes_aplicados.json, con la clave de cada
 * movimiento por ID de Transfermarkt (jugador + club, nunca por nombre: docs/PROMPT_DATOS_Y_SCRAPING.md
 * §3). Lo que ya está anotado no se vuelve a mirar, así que la segunda corrida tiene cero para
 * hacer y la de mañana tiene exactamente los fichajes de mañana.
 *
 * QUÉ SE LE PASA AL MOTOR. El mismo archivo de siempre pero con las altas y bajas ya aplicadas
 * sacadas, y con TODOS los clubes igual -- también los que quedaron sin movimientos. Eso último no
 * es cosmético: la guardia de homónimos de aplicar_fichajes.mjs necesita ver los dos clubes que
 * podrían fundirse para poder frenarlos. Filtrando la lista de clubes, un Everton se quedaba solo y
 * la guardia no tenía contra qué compararlo.
 */

import { readFile, writeFile, mkdir, stat, appendFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const correr = promisify(execFile);
const args = process.argv.slice(2);
const tiene = (f) => args.includes(f);
const valor = (f, x) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : x; };

const DRY = tiene('--dry');
const REFRESCAR = tiene('--refrescar');
const TODO = tiene('--todo');
const SOLO_PENDIENTES = tiene('--pendientes');
const LIGAS = valor('--ligas', '').split(',').map(s => s.trim()).filter(Boolean);
// Horas que se considera fresco lo ya bajado. Bajar las 30 ligas tarda ~70 s y Transfermarkt no
// publica los pases al segundo: repetirlo diez veces en una tarde es martillar el sitio al pedo.
const FRESCO_HORAS = Number(valor('--horas', '6'));

// La temporada de Transfermarkt: la ventana 2026/27 es "saison_id=2026" y abre en junio. Antes de
// junio todavía manda la anterior.
const hoy = new Date();
const SAISON = valor('--saison', String(hoy.getMonth() + 1 >= 6 ? hoy.getFullYear() : hoy.getFullYear() - 1));

const SNAPSHOT = `data/fichajes_${SAISON}.json`;
const REGISTRO = 'data/fichajes_aplicados.json';
const BITACORA = 'data/fichajes_bitacora.md';
const CACHE = 'node_modules/.cache/fichajes';

const leerJson = async (ruta, siNoEsta) => {
  try { return JSON.parse(await readFile(ruta, 'utf8')); } catch { return siNoEsta; }
};

const edadEnHoras = async (ruta) => {
  try { return (Date.now() - (await stat(ruta)).mtimeMs) / 3600e3; } catch { return Infinity; }
};

await mkdir(CACHE, { recursive: true });

// --- 1. BAJAR --------------------------------------------------------------------------------
//
// Se baja a un archivo aparte y recién después se mezcla, y eso es a propósito: si Transfermarkt
// devuelve una liga vacía (pasa: responde 200 con la página de "elegí competición"), pisar el
// snapshot bueno con eso borraría una liga entera de un plumazo. Una liga que vuelve vacía se
// descarta y se avisa; la anterior se queda.
let snapshot = await leerJson(SNAPSHOT, null);
const edad = await edadEnHoras(SNAPSHOT);
const hayQueBajar = !SOLO_PENDIENTES && (REFRESCAR || LIGAS.length || !snapshot || edad > FRESCO_HORAS);

if (hayQueBajar) {
  const que = LIGAS.length ? LIGAS.join(' ') : 'las 30 ligas';
  console.log(`Bajando ${que} de Transfermarkt (temporada ${SAISON})...`);
  const salida = `${CACHE}/bajado.json`;
  try {
    const { stdout, stderr } = await correr(process.execPath,
      ['scripts/scrape_fichajes_tm.mjs', SAISON, ...LIGAS], { maxBuffer: 256 * 1024 * 1024 });
    if (stderr) console.log(stderr.trimEnd());
    await writeFile(salida, stdout);
    const bajado = JSON.parse(stdout);

    if (!snapshot) snapshot = bajado;
    else {
      for (const liga of bajado.ligas) {
        const movimientos = liga.clubes.reduce((a, c) => a + c.altas.length + c.bajas.length, 0);
        const i = snapshot.ligas.findIndex(l => l.codigo === liga.codigo);
        if (!movimientos && i >= 0) { console.log(`  (${liga.codigo} volvió vacía: se deja lo que ya había)`); continue; }
        if (i >= 0) snapshot.ligas[i] = liga; else snapshot.ligas.push(liga);
      }
      snapshot.bajado = bajado.bajado;
    }
    // Lo bajado se guarda SIEMPRE, también con --dry: es la copia de la fuente, no el juego. Si
    // --dry no la guardara, mirar antes de aplicar costaría bajar las 30 ligas dos veces.
    await writeFile(SNAPSHOT, JSON.stringify(snapshot, null, 1));
  } catch (e) {
    if (!snapshot) { console.error(`\nNo se pudo bajar y no hay nada guardado: ${e.message}`); process.exit(1); }
    console.log(`  (falló la bajada: ${e.message.split('\n')[0]} — se sigue con lo guardado el ${snapshot.bajado})`);
  }
} else if (snapshot) {
  console.log(`Usando lo bajado el ${snapshot.bajado} (hace ${edad.toFixed(1)} h). --refrescar para volver a bajar.`);
}
if (!snapshot) { console.error('No hay nada que aplicar.'); process.exit(1); }

// --- 2. QUÉ ES NUEVO -------------------------------------------------------------------------
const registro = await leerJson(REGISTRO, { saison: SAISON, actualizado: null, aplicados: [], conocidos: [] });
registro.conocidos ??= [];
const yaAplicado = new Set(TODO ? [] : registro.aplicados);
// Los que ya se miraron y no se pudieron aplicar: el club no está en el juego, o hay dos jugadores
// con ese nombre y no se puede saber cuál es. SÍ se le vuelven a pasar al motor -- la base cambia y
// alguno se destraba solo -- pero NO se cuentan como novedad. Sin esto el titular decía "1.362
// altas nuevas" todos los días de una ventana en la que no había pasado nada.
const yaConocido = new Set(TODO ? [] : registro.conocidos);
const claveDe = (tipo, club, mov) => `${tipo}|${mov.tmId ?? mov.nombre}|${club.tmId ?? club.nombre}`;

let nuevasAltas = 0, nuevasBajas = 0, totalAltas = 0, conocidos = 0;
const filtrado = {
  saison: snapshot.saison, bajado: snapshot.bajado,
  // Todos los clubes, siempre: la guardia de homónimos los necesita a los dos para poder frenarlos.
  ligas: snapshot.ligas.map(liga => ({
    codigo: liga.codigo, liga: liga.liga,
    clubes: liga.clubes.map(club => {
      const altas = club.altas.filter(a => !yaAplicado.has(claveDe('A', club, a)));
      const bajas = club.bajas.filter(b => !yaAplicado.has(claveDe('B', club, b)));
      totalAltas += club.altas.length;
      nuevasAltas += altas.filter(a => !yaConocido.has(claveDe('A', club, a))).length;
      nuevasBajas += bajas.filter(b => !yaConocido.has(claveDe('B', club, b))).length;
      conocidos += altas.length + bajas.length;
      return { tmId: club.tmId, nombre: club.nombre, altas, bajas };
    }),
  })),
};

if (SOLO_PENDIENTES) {
  const informe = await leerJson(`${CACHE}/informe.json`, null);
  if (!informe) { console.log('\nTodavía no hay informe: correr `npm run fichajes` una vez.'); process.exit(0); }
  console.log(`\nSIN RESOLVER (${informe.pendientes.length}) — el club está en el juego, el jugador no se pudo identificar:\n`);
  for (const p of informe.pendientes) {
    console.log(`   ${p.nombre.padEnd(26)} ${String(p.sale_de ?? '?').padEnd(24)} -> ${String(p.club).padEnd(22)} la base lo tiene en: ${p.esta_en}`);
  }
  console.log(`\nSe reintentan solos en cada corrida. Para destrabar uno: npm run fichaje -- "Nombre" "Club".`);
  process.exit(0);
}

conocidos -= nuevasAltas + nuevasBajas;
console.log(`\nNUEVO desde la última vez: ${nuevasAltas} altas y ${nuevasBajas} bajas` +
  (yaAplicado.size ? `  (${totalAltas} altas en la ventana; ${conocidos} movimientos conocidos sin resolver)` : ''));

if (!nuevasAltas && !nuevasBajas && !tiene('--reintentar')) {
  console.log('\nLos planteles ya están al día. (--reintentar vuelve a probar los que quedaron sin resolver.)');
  process.exit(0);
}

// --- 3. APLICAR ------------------------------------------------------------------------------
const ENTRADA = `${CACHE}/nuevos.json`;
const INFORME = `${CACHE}/informe.json`;
await writeFile(ENTRADA, JSON.stringify(filtrado));

const parametros = ['scripts/aplicar_fichajes.mjs', '--desde', ENTRADA, '--informe', INFORME];
if (!DRY) parametros.push('--escribir');

let salidaMotor = '';
let fallo = false;
try {
  const { stdout } = await correr(process.execPath, parametros, { maxBuffer: 64 * 1024 * 1024 });
  salidaMotor = stdout;
} catch (e) {
  salidaMotor = e.stdout ?? '';
  fallo = true;
}

const informe = await leerJson(INFORME, null);
if (!informe) {
  console.error('\nEl motor no dejó informe. Salida completa:\n');
  console.error(salidaMotor || '(vacía)');
  process.exit(1);
}

// --- 4. EL PARTE CORTO -----------------------------------------------------------------------
//
// La salida larga de aplicar_fichajes.mjs sigue estando (queda en el archivo de abajo) pero no es
// lo que hay que leer cada día. Acá va sólo lo que cambió.
const lista = (titulo, filas, linea, tope = 40) => {
  if (!filas.length) return;
  console.log(`\n  ${titulo} (${filas.length})`);
  for (const f of filas.slice(0, tope)) console.log(`     ${linea(f)}`);
  if (filas.length > tope) console.log(`     ... y ${filas.length - tope} más`);
};

const corta = (s, n) => String(s ?? '').length > n ? String(s).slice(0, n - 1) + '…' : String(s ?? '');

const cambios = informe.movimientos.length + informe.creados.length + informe.aLibres.length;

lista('FICHAJES APLICADOS', informe.movimientos,
  m => `${corta(m.nombre, 26).padEnd(26)} ${corta(m.de, 24).padEnd(24)} -> ${m.a}`);
lista('JUGADORES CREADOS — la base no los tenía', informe.creados,
  c => `${corta(c.nombre, 26).padEnd(26)} -> ${corta(c.a, 24).padEnd(24)} media ${c.media}`);
lista('A AGENTES LIBRES — se fueron a un club que el juego no tiene', informe.aLibres,
  x => `${corta(x.nombre, 26).padEnd(26)} ${corta(x.de, 24).padEnd(24)} -> ${x.a}`, 15);

// Los sin resolver se reintentan en cada corrida, así que la lista entera sólo estorba cuando no
// pasó nada más. Un día tranquilo tiene que caber en tres renglones o no se va a leer nunca.
if (cambios) {
  lista('SIN RESOLVER — se reintentan la próxima', informe.pendientes,
    p => `${corta(p.nombre, 26).padEnd(26)} ${corta(p.sale_de, 24).padEnd(24)} -> ${corta(p.club, 20).padEnd(20)} (la base lo tiene en ${p.esta_en})`, 10);
} else if (informe.pendientes.length) {
  console.log(`\n  ${informe.pendientes.length} fichajes sin resolver esperando (npm run fichajes -- --pendientes).`);
}

if (informe.clonesBorrados) console.log(`\n  Limpieza: ${informe.clonesBorrados} filas duplicadas borradas de agentes libres.`);
if (informe.podados) console.log(`  Tope de plantel: ${informe.podados} jugadores a agentes libres (ningún club pasa de 32).`);

if (informe.banderas.length) {
  console.log(`\n  !! NO SE GUARDÓ: ${informe.banderas.join(' · ')}`);
  console.log(`     Informe completo: node scripts/aplicar_fichajes.mjs --desde ${ENTRADA}`);
  process.exit(2);
}
if (fallo) {
  console.error(`\nEl motor terminó con error. Salida:\n${salidaMotor}`);
  process.exit(1);
}

// --- 5. ANOTAR -------------------------------------------------------------------------------
if (DRY) {
  console.log(`\n(--dry: no se escribió nada, y el registro quedó igual.)`);
  process.exit(0);
}

registro.saison = SAISON;
registro.actualizado = new Date().toISOString();
registro.aplicados = [...new Set([...registro.aplicados, ...informe.aplicados])].sort();
// Los conocidos se REESCRIBEN, no se acumulan: uno que hoy no se pudo aplicar y mañana sí, mañana
// sale de esta lista solo. Acumularlos lo dejaría marcado como "conocido" para siempre.
const aplicadosAhora = new Set(registro.aplicados);
registro.conocidos = [...new Set(informe.noAplicados)].filter(k => !aplicadosAhora.has(k)).sort();
await writeFile(REGISTRO, JSON.stringify(registro, null, 1));

// La bitácora es para el humano: qué se movió y cuándo. El registro de arriba son claves y no se
// puede leer.
const fecha = new Date().toISOString().slice(0, 10);
const renglones = [
  ...informe.movimientos.map(m => `${m.nombre}  ${m.de} -> ${m.a}`),
  ...informe.creados.map(c => `${c.nombre}  (nuevo en la base) -> ${c.a}`),
];
if (renglones.length) {
  await appendFile(BITACORA, `\n## ${fecha} — ${renglones.length} movimientos\n\n` +
    renglones.map(r => `- ${r}\n`).join(''));
}

if (!cambios) {
  console.log(`\nLos planteles ya estaban al día: no cambió ningún jugador.`);
  process.exit(0);
}

console.log(`\nGUARDADO. ${informe.movimientos.length} movimientos, ${informe.creados.length} jugadores nuevos.`);
console.log(`  registro: ${REGISTRO} (${registro.aplicados.length} movimientos anotados)`);
console.log(`  bitácora: ${BITACORA}`);
console.log(`  deshacer: git checkout src/playersDatabase.json src/data.ts ${REGISTRO} ${BITACORA}`);
