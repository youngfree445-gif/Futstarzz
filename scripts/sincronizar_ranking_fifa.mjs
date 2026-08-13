/**
 * Reescribe WORLD_CUP_FIFA_POINTS en src/data.ts con el ranking FIFA REAL del repo.
 *
 *   node scripts/sincronizar_ranking_fifa.mjs --dry
 *   node scripts/sincronizar_ranking_fifa.mjs
 *
 * Fuente: src/fifa_ranking_2026-06-08.json (211 selecciones, con puntos y confederación).
 *
 * Existe porque los puntos de las 45 selecciones que NO fueron al Mundial 2026 se habían cargado a
 * ojo, y el archivo real estaba en el repo sin usarse. Medido: 27 de ellas estaban a más de 25
 * puntos del valor verdadero, y Israel a 95. Con las eliminatorias jugándose, esos puntos deciden
 * quién clasifica, así que la diferencia se nota.
 *
 * El ranking nombra a las selecciones en inglés; el puente son los alias de los calendarios de
 * eliminatorias, más el mapa de abajo para las que esos calendarios no cubren.
 */
import { readFile, writeFile } from 'node:fs/promises';

const DRY = process.argv.includes('--dry');

/** Nombres del ranking que no aparecen en ningún alias (Concacaf, África, Asia y algunos sueltos). */
const A_MANO = {
  'USA': 'wc_usa', 'Mexico': 'wc_mexico', 'Canada': 'wc_canada', 'Costa Rica': 'wc_costa_rica',
  'Jamaica': 'wc_jamaica', 'Panama': 'wc_panama', 'Haiti': 'wc_haiti', 'Curaçao': 'wc_curazao',
  'Morocco': 'wc_marruecos', 'Senegal': 'wc_senegal', 'Egypt': 'wc_egipto', 'Algeria': 'wc_argelia',
  "Côte d'Ivoire": 'wc_costa_marfil', 'Tunisia': 'wc_tunez', 'South Africa': 'wc_sudafrica',
  'Congo DR': 'wc_rd_congo', 'Cabo Verde': 'wc_cabo_verde', 'Ghana': 'wc_ghana',
  'Japan': 'wc_japon', 'Korea Republic': 'wc_corea_sur', 'IR Iran': 'wc_iran',
  'Australia': 'wc_australia', 'Saudi Arabia': 'wc_arabia_saudita', 'Qatar': 'wc_catar',
  'Uzbekistan': 'wc_uzbekistan', 'Iraq': 'wc_irak', 'Jordan': 'wc_jordania',
  'New Zealand': 'wc_nueva_zelanda', 'Türkiye': 'wc_turquia', 'Czechia': 'wc_chequia',
  'Bosnia and Herzegovina': 'wc_bosnia', 'Republic of Ireland': 'wc_irlanda',
  'Northern Ireland': 'wc_irlanda_norte', 'North Macedonia': 'wc_macedonia',
  'Faroe Islands': 'wc_islas_feroe', 'Belarus': 'wc_bielorrusia',
};

const rank = JSON.parse(await readFile('src/fifa_ranking_2026-06-08.json', 'utf8'));
const dataTs = await readFile('src/data.ts', 'utf8');

// Puente inglés -> id, vía los alias de los calendarios de eliminatorias.
const esAId = new Map();
for (const [, id, pais] of dataTs.matchAll(/id: '(wc_[a-z_]+)', countryName: '([^']+)'/g)) {
  esAId.set(`Selección de ${pais}`, id);
}
const ingAId = new Map(Object.entries(A_MANO));
for (const f of ['WMQ4', 'WMQ6']) {
  const cal = JSON.parse(await readFile(`data/calendarios/eliminatorias/${f}.json`, 'utf8'));
  for (const [ing, es] of Object.entries(cal.aliases ?? {})) {
    const id = esAId.get(es);
    if (id && !ingAId.has(ing)) ingAId.set(ing, id);
  }
}

// Los ids que el juego conoce, y sus puntos reales.
const idsDelJuego = new Set(esAId.values());
const reales = new Map();
for (const t of rank) {
  const id = ingAId.get(t.team);
  if (id && idsDelJuego.has(id)) reales.set(id, Math.round(t.points * 10) / 10);
}

const viejos = new Map([...dataTs.matchAll(/(wc_[a-z_]+): (\d+\.?\d*)/g)].map(m => [m[1], Number(m[2])]));
let cambiados = 0;
for (const [id, real] of reales) {
  const antes = viejos.get(id);
  if (antes !== undefined && Math.abs(antes - real) > 0.05) {
    console.log(`   ${id.padEnd(20)} ${String(antes).padStart(7)} -> ${String(real).padStart(7)}`);
    cambiados++;
  }
}
const sinDato = [...idsDelJuego].filter(id => !reales.has(id));
console.log(`\n${reales.size} de ${idsDelJuego.size} selecciones con punto FIFA real · ${cambiados} corregidas`);
if (sinDato.length) console.log(`sin dato en el ranking: ${sinDato.join(', ')}`);

// Se reescribe el bloque entero, ordenado, para que sea legible y verificable.
const ordenados = [...reales].sort(([a], [b]) => a.localeCompare(b));
const lineas = [];
for (let i = 0; i < ordenados.length; i += 4) {
  lineas.push('  ' + ordenados.slice(i, i + 4).map(([id, p]) => `${id}: ${p}`).join(', ') + ',');
}
const bloque = `const WORLD_CUP_FIFA_POINTS: Record<string, number> = {
  // GENERADO por scripts/sincronizar_ranking_fifa.mjs desde src/fifa_ranking_2026-06-08.json.
  // No editar a mano: son los puntos FIFA reales, y de ellos salen la reputación, el valor de
  // plantel y -- desde que las eliminatorias se juegan -- quién clasifica al Mundial siguiente.
${lineas.join('\n')}
};`;

const re = /const WORLD_CUP_FIFA_POINTS: Record<string, number> = \{[\s\S]*?\n\};/;
if (!re.test(dataTs)) { console.error('No encontré el bloque WORLD_CUP_FIFA_POINTS'); process.exit(1); }
if (DRY) { console.log('\n(--dry: no se escribió nada)'); process.exit(0); }
await writeFile('src/data.ts', dataTs.replace(re, bloque), 'utf8');
console.log('-> src/data.ts');
