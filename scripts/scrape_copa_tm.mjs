/**
 * Scraper de COPAS de Transfermarkt (Libertadores, Sudamericana, copas nacionales).
 *
 *   node scripts/scrape_copa_tm.mjs <CODIGO> <saison_id> <nombre> [liga] > salida.json
 *   node scripts/scrape_copa_tm.mjs CLI 2025 "Copa Libertadores" > lib.json
 *
 * Las copas usan una URL distinta a las ligas: /gesamtspielplan/pokalwettbewerb/<COD>/ en vez de
 * /spieltag/wettbewerb/<COD>/. Por eso los códigos CLI y CS daban 302 con el scraper de ligas: no
 * es que no existieran, es que estaban en otro endpoint.
 *
 * A diferencia de una liga, acá viene el calendario ENTERO en una sola página, con las rondas como
 * cabeceras (Group Stage, Round of 16, Final...) en vez de jornadas numeradas.
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const [, , comp, saison, nombre, liga] = process.argv;
if (!comp || !saison) {
  console.error('uso: node scripts/scrape_copa_tm.mjs <CODIGO> <saison_id> <nombre> [liga]');
  process.exit(1);
}

// /plus/1 es lo que despliega el calendario completo: sin ese parámetro la página muestra solo la
// tabla de posiciones y el scraper saca 0 partidos.
const url = `https://www.transfermarkt.com/x/gesamtspielplan/pokalwettbewerb/${comp}/saison_id/${saison}/plus/1`;
const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
if (/wettbewerbe\/(national|amerika|europa)|navigation/.test(res.url)) {
  console.error(`el código "${comp}" no existe como copa (redirigió a ${res.url})`);
  process.exit(1);
}
const html = await res.text();

const tableStart = html.indexOf('<table class="auflistung"');
const scope = tableStart >= 0 ? html.slice(tableStart) : html;

// Las cabeceras de ronda son celdas con colspan que contienen el nombre de la fase.
const RONDA = /<td[^>]*colspan[^>]*>\s*(?:<[^>]+>\s*)*([A-Za-zÀ-ÿ0-9\.\-\s]{3,40}?)\s*(?:<|$)/i;

// A diferencia de las ligas, en la vista de copa la fecha viaja EN la misma fila del partido (o en
// una fila "show-for-small" inmediatamente anterior), y los equipos se enlazan con
// /startseite/verein/ en vez de /spielplan/verein/.
const matches = [];
let ronda = '';
let fechaFila = null;

for (const [, row] of scope.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
  const dateHit = row.match(/datum\/(\d{4}-\d{2}-\d{2})/);

  const links = [...row.matchAll(/\/(?:startseite|spielplan)\/verein\/(\d+)\/saison_id\/[^"]*"[^>]*>([^<]+)</g)];
  if (links.length < 2) {
    // Fila de fecha suelta (la cabecera "show-for-small"): rige para el partido siguiente.
    if (dateHit) { fechaFila = dateHit[1]; continue; }
    // Si no, puede ser una cabecera de ronda.
    const r = row.match(RONDA);
    if (r && !/^\s*$/.test(r[1]) && !/^\d+$/.test(r[1].trim())) ronda = r[1].trim();
    continue;
  }

  const teams = [];
  for (const l of links) {
    const id = l[1];
    const name = l[2].trim();
    if (!teams.length || teams[teams.length - 1].id !== id) teams.push({ id, name });
  }
  if (teams.length < 2) continue;

  const date = dateHit?.[1] ?? fechaFila;
  if (!date) continue;

  matches.push({ date, round: ronda || 'Group Stage', home: teams[0].name, away: teams[1].name });
}

matches.sort((a, b) => a.date.localeCompare(b.date));

const equipos = new Set(matches.flatMap(m => [m.home, m.away]));
const rondas = [...new Set(matches.map(m => m.round))];
process.stderr.write(`${matches.length} partidos | ${equipos.size} equipos | ${rondas.length} rondas\n`);
process.stderr.write(`rondas: ${rondas.join(' | ')}\n`);

console.log(
  JSON.stringify(
    {
      competition: {
        id: comp,
        name: nombre ?? comp,
        league: liga || undefined,
        type: liga ? 'domestic_cup' : 'international_cup',
        format: 'knockout',
        season: Number(saison),
      },
      aliases: {},
      matches,
    },
    null,
    2
  )
);
