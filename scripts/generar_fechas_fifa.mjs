/**
 * Genera src/fechasFifa.ts con las fechas FIFA REALES de las eliminatorias pasadas.
 *
 *   node scripts/generar_fechas_fifa.mjs
 *
 * Fuente: data/calendarios/eliminatorias/*.json (Transfermarkt). Se usan SÓLO LAS FECHAS, no los
 * partidos: quién juega contra quién lo decide el cuadro del motor, porque de una eliminatoria a la
 * siguiente cambian los clasificados y hasta el formato. Lo que no cambia es cuándo se juega.
 *
 * Las fechas se guardan como "cuántos años antes del Mundial" + mes y día, no como fechas absolutas.
 * Así sirven para cualquier ciclo: las eliminatorias sudamericanas de 2023, 2024 y 2025 (Mundial
 * 2026) se convierten en 2027, 2028 y 2029 para el Mundial 2030, y en 2031-2033 para el de 2034.
 *
 * Antes acá había cinco ventanas inventadas a ojo -- marzo, junio, septiembre, octubre, noviembre --
 * con dos partidos en cada una. Se acercaban, pero no eran las de verdad: la eliminatoria de UEFA
 * entra entera en un solo año y la de Conmebol se reparte en tres, y eso con ventanas iguales para
 * todos no se puede representar.
 */
import { readFile, writeFile } from 'node:fs/promises';

const FUENTES = [
  { archivo: 'WMQ4.json', conf: 'CONMEBOL', mundial: 2026 },
  { archivo: 'WMQ6.json', conf: 'UEFA', mundial: 2026 },
];

const porConf = {};
for (const f of FUENTES) {
  const cal = JSON.parse(await readFile(`data/calendarios/eliminatorias/${f.archivo}`, 'utf8'));
  const fechas = [...new Set((cal.matches ?? []).map(m => m.date).filter(Boolean))].sort();
  // (años antes del Mundial, mes-día)
  const rel = fechas.map(d => [f.mundial - Number(d.slice(0, 4)), d.slice(5)]);
  porConf[f.conf] = rel;
  const porAnio = {};
  for (const [a] of rel) porAnio[a] = (porAnio[a] ?? 0) + 1;
  console.log(`${f.conf.padEnd(9)} ${cal.competition?.name ?? f.archivo}: ${fechas.length} fechas · ${fechas[0]} .. ${fechas[fechas.length - 1]}`);
  console.log(`          por año antes del Mundial: ${Object.entries(porAnio).map(([a, n]) => `${a} año(s) antes: ${n}`).join(' · ')}`);
}

// La UNIÓN es la que va al calendario de los clubes: un club colombiano tiene que tener libre la
// fecha FIFA aunque su jugador sea europeo, y al revés.
const union = [...new Set(Object.values(porConf).flat().map(([a, md]) => `${a}|${md}`))]
  .map(s => s.split('|'))
  .map(([a, md]) => [Number(a), md])
  .sort((x, y) => y[0] - x[0] || x[1].localeCompare(y[1]));
console.log(`\nunión: ${union.length} fechas distintas en el ciclo`);

const fmt = arr => {
  const lineas = [];
  for (let i = 0; i < arr.length; i += 6) {
    lineas.push('  ' + arr.slice(i, i + 6).map(([a, md]) => `[${a}, '${md}']`).join(', ') + ',');
  }
  return lineas.join('\n');
};

const out = `// GENERADO por scripts/generar_fechas_fifa.mjs. No editar a mano.
//
// Las fechas FIFA reales, sacadas de las eliminatorias pasadas que hay en
// data/calendarios/eliminatorias (Transfermarkt). Se guardan SÓLO LAS FECHAS: el rival y la ronda
// los pone el motor, porque de un ciclo al siguiente cambian los clasificados y hasta el formato.
// Lo que no cambia es cuándo se juega.
//
// Cada entrada es [años antes del Mundial, 'MM-DD']. Guardarlas así -- y no como fechas absolutas --
// es lo que las hace servir para cualquier ciclo: las sudamericanas de 2023/24/25 rumbo al Mundial
// 2026 se vuelven 2027/28/29 rumbo al de 2030, y 2031/32/33 rumbo al de 2034.

export type FechaFifa = readonly [aniosAntesDelMundial: number, mesDia: string];

/** Las de la eliminatoria sudamericana: se reparte en los tres años previos al Mundial. */
export const FECHAS_FIFA_CONMEBOL: readonly FechaFifa[] = [
${fmt(porConf.CONMEBOL)}
];

/** Las de la europea: entran casi enteras en el año anterior al Mundial. */
export const FECHAS_FIFA_UEFA: readonly FechaFifa[] = [
${fmt(porConf.UEFA)}
];

/**
 * La unión de todas: es la que el calendario le reserva a CADA club.
 *
 * Tiene que ser la unión y no la de su confederación, porque el calendario es del CLUB y el jugador
 * puede ser de cualquier lado: un colombiano en el Barcelona necesita libre la fecha sudamericana, y
 * un español en Millonarios la europea.
 */
export const FECHAS_FIFA: readonly FechaFifa[] = [
${fmt(union)}
];
`;
await writeFile('src/fechasFifa.ts', out, 'utf8');
console.log('-> src/fechasFifa.ts');
