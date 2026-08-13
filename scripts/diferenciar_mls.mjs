/**
 * Le pone a los clubes de la MLS su valor de plantel y su reputación reales.
 *
 *   node scripts/diferenciar_mls.mjs --dry
 *   node scripts/diferenciar_mls.mjs
 *
 * Los 30 estaban cargados con reputation 4 y marketValue 10.000.000 -- los treinta, idénticos. No
 * era un empate: era un placeholder. Y se notaba, porque clubStrength() sale de esos dos números:
 * cualquier "los mejores de la MLS" daba ORDEN ALFABÉTICO. Al armar la Concacaf Champions Cup
 * entraban Atlanta, Austin, Charlotte y Chicago, y quedaban afuera LAFC e Inter Miami.
 *
 * Los valores son los de plantel de Transfermarkt (temporada 2025), en dólares. La reputación se
 * deriva del valor con la misma escala de 1 a 5 que usa el resto de la base, así no hay dos fuentes
 * de verdad que se puedan contradecir.
 */
import { readFile, writeFile } from 'node:fs/promises';

const DRY = process.argv.includes('--dry');

/** Valor de plantel en millones de dólares (Transfermarkt 2025). */
const VALOR = {
  inter_miami_cf: 48, lafc: 40, atlanta_united: 38, la_galaxy: 35, columbus_crew: 34,
  fc_cincinnati: 33, orlando_city: 31, seattle_sounders: 30, philadelphia: 30,
  new_york_city_fc: 30, portland_timbers: 28, toronto_fc: 28, charlotte_fc: 27,
  ny_red_bulls: 27, austin_fc: 26, chicago_fire: 26, nashville_sc: 25,
  minnesota_united: 24, houston_dynamo: 24, st_louis_city_sc: 24, fc_dallas: 24,
  real_salt_lake: 23, vancouver_whitecaps: 22, sporting_kc: 22, new_england: 22,
  colorado_rapids: 21, san_jose: 20, dc_united: 20, san_diego_fc: 20, cf_montreal: 18,
};

/** Misma escala 1-5 del resto de la base: la MLS entera es de nivel medio, así que va de 2 a 4. */
function reputacionDe(millones) {
  if (millones >= 38) return 4;
  if (millones >= 26) return 3;
  return 2;
}

let src = await readFile('src/data.ts', 'utf8');
let tocados = 0;
const filas = [];

for (const [id, millones] of Object.entries(VALOR)) {
  // Por índice y no por regex de una sola línea: varias entradas de club ocupan dos o tres
  // renglones (el badgeImageUrl se va a la siguiente), así que un regex que no cruce saltos de
  // línea nunca llega hasta el marketValue. Con esa versión no encontraba ni uno de los 30.
  const i = src.indexOf(`{ id: '${id}',`);
  if (i < 0) { console.log(`   ${id.padEnd(22)} NO ENCONTRADO`); continue; }
  const j = src.indexOf("{ id: '", i + 10);
  const bloque = src.slice(i, j < 0 ? i + 3000 : j);
  const rep = reputacionDe(millones);
  const valor = millones * 1_000_000;
  const repAntes = Number((bloque.match(/reputation: (\d)/) ?? [])[1] ?? 0);
  const valAntes = Number((bloque.match(/marketValue: (\d+)/) ?? [])[1] ?? 0);
  const nuevo = bloque
    .replace(/reputation: \d/, `reputation: ${rep}`)
    .replace(/marketValue: \d+/, `marketValue: ${valor}`);
  src = src.slice(0, i) + nuevo + src.slice(i + bloque.length);
  filas.push([id, repAntes, rep, valAntes, valor]);
  tocados++;
}

filas.sort((a, b) => b[4] - a[4]);
console.log('club                     rep        valor de plantel');
for (const [id, repAntes, rep, valAntes, val] of filas) {
  console.log(`   ${id.padEnd(22)} ${repAntes}->${rep}   $${(valAntes/1e6).toFixed(0)}M -> $${(val/1e6).toFixed(0)}M`);
}
console.log(`
${tocados} clubes de la MLS diferenciados`);
if (DRY) { console.log('(--dry: no se escribió nada)'); process.exit(0); }
await writeFile('src/data.ts', src, 'utf8');
console.log('-> src/data.ts');
