// Baja planteles desde Transfermarkt. La lista de clubes esta abajo; se cambia y se corre.
//
//   node scripts/bajar_planteles_eerste.mjs        -> escribe data/planteles_tm/*.json
//
// POR QUE ESTA LIGA. De los 76 clubes jugables sin plantel cargado, VEINTITRÉS son de la segunda
// holandesa: es de lejos el grupo más grande. Los veinte tienen calendario y jugaban con las cuatro
// figuras del club y nada más.
//
// POR QUE TRANSFERMARKT Y NO SOFASCORE. Sofascore devuelve 403 a cualquier pedido de su API, con y
// sin cabeceras -- probado. Transfermarkt responde 200 y además da la posición DETALLADA (lateral
// izquierdo, pivote, extremo derecho) en vez de las cuatro genéricas, que es lo que este juego
// necesita para armar una plantilla.
//
// LOS IDS ESTAN VERIFICADOS, NO RECORDADOS. Diecisiete salieron de la propia página de la liga; los
// otros tres -- Willem II, ADO Den Haag y Cambuur, que este año no están en la Eerste Divisie --
// del buscador de Transfermarkt, descartando a mano las fichas U19 y U21 que aparecen primero.

import { writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const TEMPORADA = 2025;

/** club del juego -> [slug, id] de Transfermarkt. */
const CLUBES = {
  // LOS VEINTIUNO QUE FALTABAN, con los ids que paso el usuario en sus enlaces de Transfermarkt.
  // Los ids son lo que hacia falta: buscarlos uno por uno es lo lento, y varios de estos clubes
  // tienen homonimos (Botafogo, Central Espaniol, Universitario) donde elegir mal el id es meter el
  // plantel de otro club.
  'Arezzo':                     ['ss-arezzo', 4255],   // el enlace pasado decia 4256; el real es 4255
  'Ascoli':                     ['ascoli-calcio-1898-fc', 408],
  'Benevento':                  ['benevento-calcio', 4171],
  'LR Vicenza':                 ['lr-vicenza', 1137],
  'América Mineiro':            ['america-mineiro', 2863],
  'Atlético Goianiense':        ['atletico-clube-goianiense', 15172],
  'Botafogo de Ribeirão Preto': ['botafogo-fc', 9030],
  'Universitario de Vinto':     ['universitario-de-vinto', 92977],
  'Oriente Petrolero':          ['club-deportivo-oriente-petrolero', 6985],
  'Club ABB':                   ['club-abb', 93043],
  'Deportivo Táchira':          ['deportivo-tachira', 13297],
  'Estudiantes de Mérida':      ['estudiantes-de-merida-futbol-club', 14555],
  'Deportivo Anzoátegui':       ['anzoategui-fc', 97642],
  'AC Ajaccio':                 ['ac-ajaccio', 1147],
  'Dijon FCO':                  ['dijon-fco', 2969],
  'Rodez AF':                   ['rodez-af', 6389],
  'Universidad de Concepción':  ['universidad-de-concepcion', 5622],
  'C. Español':                 ['central-espanol-fc', 10960],
  'Comerciantes Unidos':        ['comerciantes-unidos', 47107],
  'Estrela Amadora':            ['cf-estrela-amadora', 2431],
  'Albacete BP':                ['albacete-balompie', 1532],
};

/** El nombre del archivo, derivado del nombre del club. */
const archivoDe = (nombre) => nombre.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// curl y no fetch: el fetch de Node lo toman por bot (ver docs/PROMPT_DATOS_Y_SCRAPING.md).
async function bajar(url) {
  const { stdout } = await run('curl', ['-s', '-A', 'Mozilla/5.0', url], {
    maxBuffer: 40 * 1024 * 1024, encoding: 'utf-8',
  });
  return stdout;
}

const ENTIDADES = { '&amp;': '&', '&quot;': '"', '&#039;': "'", '&apos;': "'", '&nbsp;': ' ' };
const limpiar = (s) => s
  .replace(/&[a-z]+;|&#\d+;/gi, (e) => ENTIDADES[e] ?? e)
  .replace(/&([aeiouAEIOU])(acute|grave|circ|uml);/g, '$1')
  .replace(/\s+/g, ' ').trim();

/**
 * Saca las filas del plantel.
 *
 * NO se aisla la tabla con un `</table>` no-greedy: cada fila tiene `inline-table` anidadas y el
 * regex corta en la primera, dejando UNA fila en vez de veinticuatro. Se toma desde
 * `<table class="items"` hasta el final y se corta por `<tr class="odd|even">`, que son las filas
 * reales. (Ya documentado en scripts/scrape_kader_tm.mjs -- misma trampa, mismo remedio.)
 */
function parsearPlantel(html) {
  const i = html.indexOf('<table class="items"');
  if (i < 0) return [];
  const cuerpo = html.slice(i);
  const filas = cuerpo.split(/<tr class="(?:odd|even)">/).slice(1);
  const jugadores = [];
  for (const fila of filas) {
    const nombre = fila.match(/\/profil\/spieler\/\d+"[^>]*>([^<]+)</);
    if (!nombre) continue;
    // La posición viene en la fila de abajo del nombre, dentro de la inline-table.
    const pos = fila.match(/<td[^>]*>\s*([A-ZÁÉÍÓÚÑ][^<]{3,28}?)\s*<\/td>\s*<\/tr>\s*<\/table>/);
    // La edad: el primer zentriert con exactamente dos dígitos (los otros traen dorsal o fechas).
    const edad = fila.match(/<td class="zentriert">\s*(?:[^<]*\((\d{2})\)|(\d{2}))\s*<\/td>/);
    const valor = fila.match(/([\d.,]+)\s*(mil|mill\.)\s*€/);
    let eur = 0;
    if (valor) {
      const n = parseFloat(valor[1].replace(/\./g, '').replace(',', '.'));
      eur = valor[2] === 'mil' ? n * 1000 : n * 1_000_000;
    }
    jugadores.push({
      nombre: limpiar(nombre[1]),
      pos: pos ? limpiar(pos[1]) : 'Mediocentro',
      edad: edad ? Number(edad[1] ?? edad[2]) : 24,
      valor: Math.round(eur),
    });
  }
  return jugadores;
}

await mkdir('data/planteles_tm', { recursive: true });
let ok = 0, vacios = 0;
for (const [club, [slug, id]] of Object.entries(CLUBES)) {
  const url = `https://www.transfermarkt.co/${slug}/startseite/verein/${id}/saison_id/${TEMPORADA}`;
  const html = await bajar(url);
  const players = parsearPlantel(html);
  if (!players.length) {
    console.log(`  VACIO  ${club.padEnd(20)} (${html.length} bytes)`);
    vacios++;
  } else {
    const destino = `data/planteles_tm/${archivoDe(club)}.json`;
    await writeFile(destino, JSON.stringify({ fuente: url, teamName: club, players }, null, 2) + '\n', 'utf-8');
    console.log(`  ok     ${club.padEnd(20)} ${String(players.length).padStart(2)} jugadores -> ${destino}`);
    ok++;
  }
  // Pausa entre pedidos: veinte seguidos sin respirar es la forma de que te corten.
  await new Promise(r => setTimeout(r, 1200));
}
console.log(`\n${ok} planteles bajados, ${vacios} vacios.`);
