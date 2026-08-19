/**
 * Scraper de FICHAJES de Transfermarkt — altas y bajas de una temporada, liga por liga.
 *
 *   node scripts/scrape_fichajes_tm.mjs [saison_id] > data/fichajes_2026.json
 *   node scripts/scrape_fichajes_tm.mjs 2026 GB1 ES1        (solo esas ligas)
 *
 * Por qué esta página y no la de "últimos fichajes": la de últimos movimientos devuelve 25 filas y
 * casi todas de clubes chicos. Ésta trae la ventana ENTERA de la temporada, club por club, con el
 * club de origen de cada alta — que es justo lo que hace falta para mover un jugador sin
 * equivocarse de persona.
 *
 * Estructura real de la página (verificada contra el HTML servido, no supuesta):
 *
 * 1. Cada club abre con `id="to-<idTM>"` y su nombre en el <a> que sigue.
 * 2. Después vienen DOS tablas: la primera es "Altas" y la segunda "Bajas". Se distinguen por el
 *    <th class="spieler-transfer-cell">, que dice cuál es.
 * 3. Cada fila trae el jugador como `/<slug>/profil/spieler/<id>` con el nombre completo en
 *    `title=`, y el OTRO club como `/verein/<id>/`. El nombre corto ("B. Guimarães") aparece
 *    también en la misma celda: hay que quedarse con el primero o salen jugadores duplicados.
 * 4. La fila de "sin fichajes" no tiene enlace de jugador y se descarta sola.
 *
 * La página NO trae la fecha de cada fichaje. No hace falta: `saison_id=2026` ya acota a la ventana
 * 2026/27, que es "de mayo de 2026 en adelante".
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

// Las ligas que el juego tiene con plantel. El código es el de Transfermarkt.
const LIGAS = [
  ['GB1', 'Inglesa'], ['GB2', 'Inglesa 2'],
  ['ES1', 'Española'], ['ES2', 'Española 2'],
  ['IT1', 'Italiana'], ['IT2', 'Italiana 2'],
  ['L1', 'Alemana'], ['L2', 'Alemana 2'],
  ['FR1', 'Francesa'], ['FR2', 'Francesa 2'],
  ['NL1', 'Holandesa'], ['PO1', 'Portuguesa'], ['TR1', 'Turca'],
  ['BE1', 'Belga'], ['SC1', 'Escocesa'], ['GR1', 'Griega'], ['RU1', 'Rusa'],
  ['SA1', 'Saudí'], ['MLS1', 'Estadounidense'], ['MEX1', 'Mexicana'],
  ['AR1N', 'Argentina'], ['BRA1', 'Brasileña'], ['COL1', 'Colombiana'],
  ['CHL1', 'Chilena'], ['URU1', 'Uruguaya'], ['TDeC', 'Peruana'], ['EC1N', 'Ecuatoriana'],
  ['BOL1', 'Boliviana'], ['PAR1', 'Paraguaya'], ['VZ1L', 'Venezolana'],
];

// El dominio decide el IDIOMA de los nombres de club, y eso importa mucho mas de lo que parece:
// .co escribe "Club Brujas KV", "FC Oporto", "SC Friburgo" y la base de jugadores usa los nombres
// originales. Con los traducidos, mil fichajes no cruzaban con nadie.
const DOMINIO = process.env.TM_DOMINIO || 'com';
const saison = process.argv[2] || '2026';
const soloEstas = process.argv.slice(3);
const aBajar = soloEstas.length ? LIGAS.filter(([c]) => soloEstas.includes(c)) : LIGAS;

const limpiar = (s) => s
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'")
  .replace(/&nbsp;/g, ' ').trim();

/**
 * El bloque de cada club.
 *
 * Se corta por el ancla del club en vez de barrer con una regex sola: el bloque de un club es todo
 * lo que va hasta el ancla del siguiente, y `split` ya lo entrega cortado.
 */
function bloquesDeClub(html) {
  const bloques = [];
  for (const parte of html.split('id="to-').slice(1)) {
    const id = /^(\d+)"/.exec(parte);
    if (!id) continue;
    // El nombre visible está en el segundo <a> del encabezado. El `title` del primero viene con
    // "Array" pegado al final, que es basura del propio sitio.
    const nombre = /<a title="[^"]*" href="\/[^"]+\/transfers\/verein\/\d+\/[^"]*">([^<]+)<\/a>/.exec(parte);
    bloques.push({ id: id[1], nombre: nombre ? limpiar(nombre[1]) : '?', html: parte });
  }
  return bloques;
}

/** Las filas de una tabla de altas o de bajas. */
function filas(tablaHtml) {
  const salida = [];
  for (const tr of tablaHtml.split('<tr')) {
    const jugador = /<a title="([^"]+)" href="\/[^"]+\/profil\/spieler\/(\d+)"/.exec(tr);
    if (!jugador) continue;
    const edad = /alter-transfer-cell">(\d+)</.exec(tr);
    const posicion = /pos-transfer-cell">([^<]+)</.exec(tr);
    const valor = /mw-transfer-cell">([^<]*)</.exec(tr);
    const otro = /<a title="([^"]+)" href="\/[^"]+\/transfers\/verein\/(\d+)\//.exec(tr);
    const coste = /<td class="rechts "><a href="\/jumplist\/transfers[^"]*">([^<]*)</.exec(tr);
    salida.push({
      nombre: limpiar(jugador[1]),
      tmId: jugador[2],
      edad: edad ? Number(edad[1]) : null,
      posicion: posicion ? limpiar(posicion[1]) : null,
      valor: valor ? limpiar(valor[1]) : null,
      otroClub: otro ? limpiar(otro[1]) : null,
      otroClubTmId: otro ? otro[2] : null,
      coste: coste ? limpiar(coste[1]) : null,
    });
  }
  return salida;
}

async function bajarLiga(codigo, liga) {
  const url = `https://www.transfermarkt.${DOMINIO}/x/transfers/wettbewerb/${codigo}/plus/?saison_id=${saison}&s_w=&leihe=1&intern=0`;
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (/wettbewerbe\/(national|amerika|europa)/.test(res.url)) {
    return { codigo, liga, error: `el código "${codigo}" no existe (redirigió a ${res.url})`, clubes: [] };
  }
  const html = await res.text();
  const clubes = [];
  for (const b of bloquesDeClub(html)) {
    // Las dos tablas del club, en orden: altas y después bajas.
    const tablas = b.html.split('<div class="responsive-table">').slice(1);
    // Cual es cual lo dice el ORDEN, no el texto del encabezado: .co escribe "Altas"/"Bajas" y .com
    // escribe "In"/"Out". Buscar el texto daba 20 clubes y CERO fichajes contra el sitio en ingles,
    // sin un solo error a la vista -- la clase de falla silenciosa que un scraper no puede tener.
    // Que el orden sea siempre altas-bajas se comprobo cruzando los totales de las dos versiones.
    const esTabla = /spieler-transfer-cell">/;
    const altas = tablas[0] && esTabla.test(tablas[0]) ? filas(tablas[0]) : [];
    const bajas = tablas[1] && esTabla.test(tablas[1]) ? filas(tablas[1]) : [];
    clubes.push({ tmId: b.id, nombre: b.nombre, altas, bajas });
  }
  return { codigo, liga, clubes };
}

const salida = { saison, bajado: new Date().toISOString().slice(0, 10), ligas: [] };
for (const [codigo, liga] of aBajar) {
  try {
    const r = await bajarLiga(codigo, liga);
    salida.ligas.push(r);
    const n = r.clubes.reduce((a, c) => a + c.altas.length, 0);
    const b = r.clubes.reduce((a, c) => a + c.bajas.length, 0);
    console.error(`${codigo.padEnd(5)} ${liga.padEnd(16)} ${String(r.clubes.length).padStart(3)} clubes · ${String(n).padStart(4)} altas · ${String(b).padStart(4)} bajas${r.error ? '  ' + r.error : ''}`);
  } catch (e) {
    console.error(`${codigo.padEnd(5)} ${liga.padEnd(16)} FALLO: ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 700));   // no martillar el sitio
}
process.stdout.write(JSON.stringify(salida, null, 1));
