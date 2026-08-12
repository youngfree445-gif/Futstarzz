/**
 * Escribe docs/VENTANAS_DE_COMPETICIONES.md a partir de src/realCalendarDates.ts.
 *
 *   node scripts/generar_ventanas.mjs
 *
 * El documento es la referencia de CUÁNDO se juega cada torneo. No es decorativo: el acomodador de
 * fechas y las reservas de copa no pueden sacar un partido de la ventana de su competición, así que
 * si algo se ve raro en el calendario, este archivo dice cuál era el marco.
 *
 * Se genera, no se escribe a mano: escrito a mano se desincroniza el día que se carga una liga.
 */

import { readFile, writeFile } from 'node:fs/promises';

const MESES = ['', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const bonito = f => (f ? `${f.slice(8, 10)} ${MESES[Number(f.slice(5, 7))]} ${f.slice(0, 4)}` : '—');

const TIPOS = {
  league: 'Ligas',
  domestic_cup: 'Copas nacionales',
  continental_cup: 'Copas continentales',
  national_tournament: 'Selecciones',
};

const fuente = await readFile('src/realCalendarDates.ts', 'utf8');
const comps = JSON.parse(fuente.slice(fuente.indexOf('[{'), fuente.lastIndexOf(']') + 1));

const clubesDe = c => {
  const s = new Set();
  for (const m of c.matches) { s.add(m.home); s.add(m.away); }
  return s.size;
};

let md = `# Ventanas de las competiciones

> **Generado por \`node scripts/generar_ventanas.mjs\`.** No editar a mano: se regenera desde
> \`src/realCalendarDates.ts\`, que es la única fuente de fechas del juego.

Cuándo empieza y termina cada torneo en la **temporada 1** de la carrera. De la temporada 2 en
adelante son las mismas fechas corridas un año (ver \`competicionEnTemporada\`).

Estas ventanas se **respetan**, no son informativas: cuando el calendario tiene que mover un partido
para que entre sin pisar otro, sólo puede moverlo dentro de la ventana de su propia competición
(ver \`acomodarFechas\` y \`reservarFechasDeCopa\` en \`src/dateSchedule.ts\`). Una final de copa no se
va a noviembre porque la liga siga jugando.

**La carrera no empieza el mismo día para todos.** Arranca con la primera fecha de TU liga: en
agosto si jugás en Europa, en enero si jugás en Sudamérica, en febrero en la MLS. Ver
\`inicioDeCarrera\`.

`;

for (const [kind, titulo] of Object.entries(TIPOS)) {
  const delTipo = comps
    .filter(c => c.kind === kind && c.firstDate)
    .sort((a, b) => (a.league ?? '').localeCompare(b.league ?? '') || a.firstDate.localeCompare(b.firstDate));
  if (!delTipo.length) continue;

  md += `## ${titulo}\n\n`;
  md += `| competición | país | arranca | termina | clubes | partidos |\n`;
  md += `|---|---|---|---|---:|---:|\n`;
  for (const c of delTipo) {
    md += `| ${c.name} | ${c.league ?? '—'} | ${bonito(c.firstDate)} | ${bonito(c.lastDate)} | ${clubesDe(c)} | ${c.matches.length} |\n`;
  }
  md += '\n';
}

const conReservas = comps.filter(c => c.soloReservas);
if (conReservas.length) {
  md += `## Copas cuyas fechas se acomodan\n\n`;
  md += `Su calendario viene de otra temporada, así que las fechas se corren de año y después se
**reubican** una por una al día libre más cercano, respetando el descanso y sin salirse de la
ventana de arriba. Ningún partido se pierde: se reprograma, que es lo que hacen las ligas de verdad
cuando dos torneos se superponen.\n\n`;
  md += conReservas.map(c => `- ${c.name} (${c.league})`).join('\n') + '\n\n';
}

md += `## Total\n\n${comps.length} competiciones · ${comps.reduce((n, c) => n + c.matches.length, 0)} partidos.\n`;

await writeFile('docs/VENTANAS_DE_COMPETICIONES.md', md, 'utf8');
console.log(`-> docs/VENTANAS_DE_COMPETICIONES.md  (${comps.length} competiciones)`);
