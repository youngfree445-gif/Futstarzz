/**
 * Scraper de calendarios de Transfermarkt -> JSON del formato de docs/FORMATO_CALENDARIO.md
 *
 *   node scripts/scrape_transfermarkt.mjs <CODIGO> <saison_id> <jornadas> [liga] > salida.json
 *   node scripts/scrape_transfermarkt.mjs TDeC 2025 19 Peruana > peru_2025.json
 *
 * Sin dependencias: Node 18+ ya trae fetch, y el HTML se parsea con regex acotadas en vez de
 * jsdom (una dependencia de ~7 MB para leer una tabla no se justifica).
 *
 * Detalles de la página real que hay que respetar (verificados contra el HTML servido, no
 * supuestos):
 *
 * 1. NO existen `.responsive-table` ni `.items`: Transfermarkt cambió el markup y esos selectores
 *    devuelven cero filas. La tabla de partidos es `<table class="auflistung">`.
 * 2. La fecha NO está en la fila del partido: viene en una fila aparte con `colspan=5` que
 *    encabeza a todos los partidos que la siguen. Hay que arrastrarla hacia abajo.
 * 3. La fecha canónica está en el href `/datum/YYYY-MM-DD`, ya en ISO. El texto visible es
 *    dd/mm/yyyy y depende del locale del sitio: usar el href evita convertir (y evita el clásico
 *    error de invertir día y mes).
 * 4. Cada equipo aparece DOS veces por fila (nombre largo + abreviatura). Hay que quedarse con el
 *    primero de cada par o salen equipos duplicados y partidos falsos.
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const [, , comp, saison, jornadasArg, liga] = process.argv;

if (!comp || !saison) {
  console.error(`uso: node scripts/scrape_transfermarkt.mjs <CODIGO> <saison_id> [jornadas] [liga]

  CODIGO     código de competición de Transfermarkt (ver tabla abajo)
  saison_id  año de inicio de la temporada (2025 = temporada 2025/26)
  jornadas   cuántas jornadas bajar (por defecto 38)
  liga       valor de "league" para el JSON, debe coincidir con data.ts

códigos verificados (responden 200):
  TDeC  Perú (Liga 1)        URU1  Uruguay
  CHL1  Chile               AR1N  Argentina
  BRA1  Brasil              ES1   España
  GB1   Inglaterra          IT1   Italia
  L1    Alemania            FR1   Francia

Los códigos que NO existen redirigen a /wettbewerbe/national y el scraper lo detecta y aborta.
`);
  process.exit(1);
}

const jornadas = Number(jornadasArg) || 38;

async function getMatchday(md) {
  const url = `https://www.transfermarkt.com/x/spieltag/wettbewerb/${comp}/saison_id/${saison}/spieltag/${md}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });

  // Un código inexistente no da 404: redirige al índice de competiciones. Sin este chequeo el
  // scraper parsea la página equivocada y devuelve 0 partidos sin avisar por qué.
  if (/wettbewerbe\/(national|amerika|europa)/.test(res.url) || /navigation/.test(res.url)) {
    throw new Error(
      `el código "${comp}" no existe en Transfermarkt (redirigió a ${res.url}). Revisá la tabla de códigos con --help.`
    );
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} en jornada ${md}`);

  const html = await res.text();

  // Aislar la tabla de partidos para no capturar enlaces del resto de la página.
  const tableStart = html.indexOf('<table class="auflistung"');
  const scope = tableStart >= 0 ? html.slice(tableStart) : html;

  // Se procesa FILA por fila, no token por token: cada <tr> de partido trae exactamente 4 enlaces
  // de equipo (local largo, local corto, visitante largo, visitante corto), así que local es el
  // primer id y visitante el primer id DISTINTO. Recorrer los tokens sueltos mezcla el equipo
  // abreviado de una fila con el de la siguiente y genera partidos inexistentes.
  //
  // Ojo con el orden: la fila de fecha va DESPUÉS de los partidos que le corresponden, no antes.
  // Por eso los partidos se acumulan sin fecha y se les asigna al encontrar la fila de fecha que
  // los cierra. (Asumir lo contrario descarta el primer partido de cada jornada.)
  const matches = [];
  let pending = [];

  for (const [, row] of scope.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    const dateHit = row.match(/datum\/(\d{4}-\d{2}-\d{2})/);
    if (dateHit) {
      for (const p of pending) matches.push({ ...p, date: dateHit[1] });
      pending = [];
      continue;
    }

    const links = [...row.matchAll(/spielplan\/verein\/(\d+)\/saison_id\/[^"]*"[^>]*>([^<]+)</g)];
    if (links.length < 2) continue;

    // Quedarse con el primer nombre de cada club distinto, en orden: [local, visitante].
    const teams = [];
    for (const l of links) {
      const id = l[1];
      const name = l[2].trim();
      if (!teams.length || teams[teams.length - 1].id !== id) teams.push({ id, name });
    }
    if (teams.length < 2) continue;

    pending.push({ round: `${md}. Matchday`, home: teams[0].name, away: teams[1].name });
  }

  if (pending.length) {
    process.stderr.write(`  aviso: ${pending.length} partidos de la jornada ${md} quedaron sin fecha (se descartan)\n`);
  }

  // Salen agrupados por fecha; ordenar para que el JSON quede cronológico.
  return matches.sort((a, b) => a.date.localeCompare(b.date));
}

const all = [];
for (let md = 1; md <= jornadas; md++) {
  try {
    const m = await getMatchday(md);
    all.push(...m);
    process.stderr.write(`jornada ${String(md).padStart(2)}: ${String(m.length).padStart(2)} partidos\n`);
    if (!m.length) process.stderr.write(`  (sin partidos: puede que la jornada ${md} no exista todavía)\n`);
  } catch (e) {
    process.stderr.write(`jornada ${md}: ${e.message}\n`);
    if (/no existe en Transfermarkt/.test(e.message)) process.exit(1);
  }
  // Pausa entre pedidos: es un sitio ajeno, no conviene martillarlo.
  await new Promise(r => setTimeout(r, 1200));
}

process.stderr.write(`\ntotal: ${all.length} partidos, ${new Set(all.flatMap(m => [m.home, m.away])).size} equipos\n`);

console.log(
  JSON.stringify(
    {
      competition: {
        id: comp,
        name: comp,
        league: liga ?? '(completar: debe coincidir con data.ts)',
        type: 'domestic_league',
        format: 'round_robin',
        season: Number(saison),
      },
      aliases: {},
      matches: all,
    },
    null,
    2
  )
);
