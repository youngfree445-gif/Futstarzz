/**
 * Genera src/fechasConmebol.ts con las fechas REALES del knockout de Libertadores y Sudamericana.
 *
 *   node scripts/generar_fechas_conmebol.mjs
 *
 * Fuente: data/calendarios/copas/CLI.json y CS.json, que estaban en el repo sin usarse y traen las
 * dos copas COMPLETAS de 2025 -- 145 y 150 partidos, con octavos, cuartos, semis y final.
 *
 * Se usan SOLO LAS FECHAS. Los cruces no sirven: son los de 2025 y en el juego el cuadro lo arma el
 * motor con quien haya clasificado en TU carrera. Lo que no cambia de un año al otro es cuando se
 * juega cada ronda, y eso es justamente lo que faltaba: hasta ahora el knockout se repartia en dias
 * genericos, espaciados a ojo dentro de la ventana del torneo.
 *
 * La fase de grupos NO entra: para eso ya esta el calendario real de 2026 en realCalendarDates.ts,
 * con los participantes y los cruces verdaderos de la edicion que se juega.
 */
import { readFile, writeFile } from 'node:fs/promises';

const FUENTES = [
  { archivo: 'CLI.json', nombre: 'LIBERTADORES', comp: 'conmebol_libertadores' },
  { archivo: 'CS.json',  nombre: 'SUDAMERICANA', comp: 'conmebol_sudamericana' },
];

/** Rondas que NO son knockout: la fase de grupos y las previas, que el juego no modela. */
const NO_ES_KNOCKOUT = /schedule|group|first round|second round|3rd round|intermediate/i;

let out = `// GENERADO por scripts/generar_fechas_conmebol.mjs. No editar a mano.
//
// Las fechas REALES del knockout de la Copa Libertadores y la Copa Sudamericana, sacadas de los
// calendarios completos de 2025 que estan en data/calendarios/copas (Transfermarkt).
//
// Solo las fechas: los cruces son los de 2025 y en el juego el cuadro lo arma el motor con quien
// haya clasificado en TU carrera. Lo que no cambia de un año al otro es CUANDO se juega cada ronda.
//
// Se guardan como 'MM-DD' porque el año lo pone la temporada de carrera.

export interface FechasDeKnockout {
  /** Un dia por paso del cuadro, en orden: octavos ida, octavos vuelta, cuartos ida... */
  readonly dias: readonly string[];
  /** Para que se vea de donde sale cada uno. */
  readonly rondas: readonly string[];
}

`;

for (const f of FUENTES) {
  const cal = JSON.parse(await readFile(`data/calendarios/copas/${f.archivo}`, 'utf8'));
  const porRonda = new Map();
  for (const m of cal.matches ?? []) {
    if (!m.date || !m.round || NO_ES_KNOCKOUT.test(m.round)) continue;
    if (!porRonda.has(m.round)) porRonda.set(m.round, new Set());
    porRonda.get(m.round).add(m.date);
  }
  // Una fecha por ronda: la primera, que es cuando se juega el grueso.
  const rondas = [...porRonda.entries()]
    .map(([ronda, fechas]) => ({ ronda, dia: [...fechas].sort()[0] }))
    .sort((a, b) => a.dia.localeCompare(b.dia));

  console.log(`${f.nombre}: ${rondas.length} rondas de knockout`);
  for (const r of rondas) console.log(`   ${r.dia}  ${r.ronda}`);

  out += `/** ${cal.competition?.name ?? f.nombre}: ${rondas.length} pasos de cuadro, de octavos a la final. */
export const FECHAS_KNOCKOUT_${f.nombre}: FechasDeKnockout = {
  dias: [${rondas.map(r => `'${r.dia.slice(5)}'`).join(', ')}],
  rondas: [${rondas.map(r => `'${r.ronda}'`).join(', ')}],
};

`;
}

out += `/** Por id de competicion, para que dateSchedule las encuentre sin un if. */
export const FECHAS_KNOCKOUT_POR_COPA: Readonly<Record<string, FechasDeKnockout>> = {
  conmebol_libertadores: FECHAS_KNOCKOUT_LIBERTADORES,
  conmebol_sudamericana: FECHAS_KNOCKOUT_SUDAMERICANA,
};
`;

await writeFile('src/fechasConmebol.ts', out, 'utf8');
console.log('-> src/fechasConmebol.ts');
