/**
 * Corre los años de una competición ya cargada, para alinearla con las demás.
 *
 *   node scripts/alinear_temporadas.mjs --dry
 *   node scripts/alinear_temporadas.mjs
 *
 * Hace falta porque las fuentes no vienen todas de la misma temporada. La Primeira Liga entró desde
 * ESPN con la 2026/27 mientras Ligue 1, Eredivisie y Serie A son la 2025/26: un club portugués
 * tendría su primer partido en agosto de 2026 y la carrera -- que arranca el 12 de enero de 2026 --
 * le empezaría ahí, siete meses después que a todos los demás. Es el mismo bug que ya apareció con
 * la Serie B italiana ("por qué inicia la carrera allí y no en enero").
 *
 * INJERTA, NO REGENERA: se lee el archivo actual y se le cambian las fechas a las competiciones
 * nombradas. Nada más se toca.
 */

import { readFile, writeFile } from 'node:fs/promises';

const DRY = process.argv.includes('--dry');
const DESTINO = 'src/realCalendarDates.ts';

/** id de competición -> años a correr (negativo = hacia atrás). */
const AJUSTES = {
  // La Primeira Liga vino como 2026/27; el resto de Europa juega la 2025/26.
  por1: -1,
};

function correrAnios(date, anios) {
  const [a, m, d] = date.split('-').map(Number);
  const anio = a + anios;
  const ultimo = new Date(Date.UTC(anio, m, 0)).getUTCDate();
  return `${anio}-${String(m).padStart(2, '0')}-${String(Math.min(d, ultimo)).padStart(2, '0')}`;
}

async function main() {
  const actual = await readFile(DESTINO, 'utf8');
  const ini = actual.indexOf('[{');
  const fin = actual.lastIndexOf(']') + 1;
  const comps = JSON.parse(actual.slice(ini, fin));

  let tocadas = 0;
  for (const c of comps) {
    const anios = AJUSTES[c.id];
    if (!anios) continue;
    const antes = `${c.firstDate} .. ${c.lastDate}`;
    for (const m of c.matches) m.date = correrAnios(m.date, anios);
    const fechas = c.matches.map(m => m.date).sort();
    c.firstDate = fechas[0] ?? null;
    c.lastDate = fechas[fechas.length - 1] ?? null;
    tocadas++;
    console.log(`${c.id.padEnd(6)} ${c.name.padEnd(22)} ${antes}  ->  ${c.firstDate} .. ${c.lastDate}  (${anios > 0 ? '+' : ''}${anios} años)`);
  }

  if (!tocadas) { console.log('nada que alinear'); return; }
  if (DRY) { console.log('\n(--dry: no se escribió nada)'); return; }
  await writeFile(DESTINO, `${actual.slice(0, ini)}${JSON.stringify(comps)}${actual.slice(fin)}`, 'utf8');
  console.log(`-> ${DESTINO}`);
}

main();
