/**
 * Scraper de planteles (edad + posicion + valor) de Transfermarkt.
 *   node scrape_kader.mjs > planteles.json
 *
 * Mismo estilo que scripts/scrape_transfermarkt.mjs: sin dependencias, regex
 * acotadas, pausa entre pedidos. Detalles del HTML REAL verificados contra la
 * pagina servida (no supuestos), porque este markup difiere del de calendarios:
 *
 * 1. La tabla de plantel SI es `<table class="items">` (a diferencia de la de
 *    partidos). Pero NO se puede aislar con un `</table>` no-greedy: cada fila
 *    contiene `inline-table` anidadas y el regex corta en la primera, dejando
 *    1 fila en vez de 24. Hay que tomar desde `<table class="items"` hasta el
 *    final y cortar por `<tr class="odd|even">`, que son las filas reales.
 * 2. La edad es el primer `<td class="zentriert">` con exactamente 2 digitos.
 *    Otros `zentriert` traen dorsal o fechas, por eso se filtra por formato.
 * 3. El nombre se toma del enlace /profil/spieler/<id>; ese id se guarda como
 *    clave estable (los nombres cambian de acentuacion entre paginas).
 * 4. Las paginas usan entidades HTML (&oacute;, &amp;) que hay que decodificar
 *    o los nombres quedan rotos al escribirlos al JSON.
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

// IDs extraidos de la pagina de la competicion COLP (Dimayor I), no escritos a
// mano: salen de los enlaces /startseite/verein/<id> de esa misma pagina.
const CLUBES = [
  ['junior-de-barranquilla', 11854], ['atletico-nacional', 8172],
  ['deportivo-pereira', 9811], ['llaneros-fc', 38628],
  ['independiente-santa-fe', 11648], ['alianza-petrolera', 22902],
  ['fortaleza-ceif', 32041], ['independiente-medellin', 10093],
  ['deportivo-pasto', 10090], ['cd-america-de-cali', 2352],
  ['cd-la-equidad-seguros-sa', 17425], ['boyaca-chico-fc', 14649],
  ['deportes-tolima', 10503], ['cucuta-deportivo', 13379],
  ['deportivo-cali', 9961], ['jaguares-de-cordoba', 39252],
  ['once-caldas', 6984], ['millonarios-fc', 2350],
  ['atletico-bucaramanga', 6495], ['rionegro-aguilas', 20590],
];

function decode(s) {
  const named = { aacute:'á', eacute:'é', iacute:'í', oacute:'ó', uacute:'ú',
    ntilde:'ñ', Aacute:'Á', Eacute:'É', Iacute:'Í', Oacute:'Ó', Uacute:'Ú',
    Ntilde:'Ñ', uuml:'ü', amp:'&', quot:'"', apos:"'", nbsp:' ' };
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&([a-zA-Z]+);/g, (m, n) => named[n] ?? m)
    .trim();
}

async function getPlantel(slug, id) {
  const url = `https://www.transfermarkt.co/${slug}/kader/verein/${id}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const ini = html.indexOf('<table class="items"');
  if (ini < 0) throw new Error('sin tabla de plantel');
  const filas = html.slice(ini).split(/(?=<tr class="(?:odd|even)")/).slice(1);

  const jugadores = [];
  for (const b of filas) {
    const n = b.match(/\/profil\/spieler\/(\d+)"[^>]*>([^<]+)</);
    if (!n) continue;
    const edad = b.match(/<td class="zentriert">(\d{2})<\/td>/);
    const pos = b.match(/<td[^>]*>\s*(Portero|Defensa central|Lateral (?:derecho|izquierdo)|Pivote|Mediocentro(?: ofensivo)?|Interior (?:derecho|izquierdo)|Extremo (?:derecho|izquierdo)|Delantero centro|Mediapunta|Segundo delantero)\s*<\/td>/);
    jugadores.push({
      tmId: n[1],
      name: decode(n[2]),
      age: edad ? Number(edad[1]) : null,
      position: pos ? pos[1] : null,
    });
  }
  return jugadores;
}

const salida = {};
let totalJug = 0, sinEdad = 0;

for (const [slug, id] of CLUBES) {
  try {
    const p = await getPlantel(slug, id);
    salida[slug] = p;
    totalJug += p.length;
    sinEdad += p.filter(j => j.age === null).length;
    process.stderr.write(`${slug.padEnd(26)} ${String(p.length).padStart(2)} jugadores\n`);
  } catch (e) {
    process.stderr.write(`${slug.padEnd(26)} ERROR: ${e.message}\n`);
  }
  await new Promise(r => setTimeout(r, 1200)); // no martillar un sitio ajeno
}

process.stderr.write(`\ntotal: ${totalJug} jugadores en ${Object.keys(salida).length} clubes | sin edad: ${sinEdad}\n`);
console.log(JSON.stringify(salida, null, 2));
