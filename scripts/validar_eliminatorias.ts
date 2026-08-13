// Validador de ELIMINATORIAS. Se corre con `npm run validar:eliminatorias`.
//
// Pregunta lo único que importa: ¿se clasifica JUGANDO, o el Mundial siguiente sale igual al
// anterior? Antes de esto, el Mundial 2030 lo jugaban las mismas 48 selecciones de 2026 -- Colombia
// clasificaba siempre e Italia no jugaba nunca.
//
// Los cuatro chequeos:
//   A) Cada confederación jugable termina su torneo y reparte exactamente sus cupos.
//   B) El Mundial da 48 selecciones, sin repetidas.
//   C) La clasificación cambia entre ediciones (si diera siempre lo mismo, no se está ganando nada).
//   D) Hay VARIANCIA real: que existan selecciones que a veces entran y a veces no, y que ninguna
//      de las flojas se cuele seguido.

import { ALL_NATIONAL_TEAMS_DATABASE as SELECCIONES } from '../src/data';
import {
  CONFEDERACION_POR_SELECCION, CONFEDERACIONES_JUGABLES, CUPOS_POR_CONFEDERACION,
  SELECCIONES_DUPLICADAS, clasificadosDe, crearEliminatoria, eliminatoriaTerminada,
  fechasDeLaEliminatoria, proximoPartidoDeEliminatoria, resolverPasoEliminatoria,
  seleccionesDe, seleccionesDelMundial, type Confederacion, type EliminatoriaState,
} from '../src/eliminatorias';

const CONFS: Confederacion[] = ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];
const nombre = (id: string) => SELECCIONES.find(t => t.id === id)?.name.replace('Selección de ', '') ?? id;

// --- Cobertura de los datos: nadie sin confederación ---
console.log('=== Datos: confederación de cada selección ===\n');
const sinConf = SELECCIONES.filter(t => !CONFEDERACION_POR_SELECCION[t.id] && !SELECCIONES_DUPLICADAS.includes(t.id));
for (const conf of CONFS) {
  const n = seleccionesDe(conf, SELECCIONES).length;
  const cupos = CUPOS_POR_CONFEDERACION[conf];
  const jugable = CONFEDERACIONES_JUGABLES.includes(conf);
  console.log(`   ${conf.padEnd(9)} ${String(n).padStart(2)} selecciones -> ${String(cupos).padStart(2)} cupos   ${jugable ? 'se JUEGA' : 'por fuerza'}${n <= cupos ? '   <-- clasifican casi todas (faltan datos)' : ''}`);
}
console.log(`\n   sin confederación: ${sinConf.length}${sinConf.length ? '   <-- ' + sinConf.map(t => t.id).join(', ') : ' (bien)'}`);

/** Juega una eliminatoria entera, fecha por fecha, como lo haría la carrera. */
function jugar(conf: Confederacion, mundial: number): EliminatoriaState {
  let e = crearEliminatoria(conf, mundial, SELECCIONES);
  const fechas = fechasDeLaEliminatoria(e);
  for (let i = 0; i < fechas + 2 && !eliminatoriaTerminada(e); i++) {
    e = resolverPasoEliminatoria(e, SELECCIONES);
  }
  return e;
}

// --- A) Cada confederación jugable termina y reparte sus cupos ---
console.log('\n=== A) ¿Terminan y reparten los cupos? ===\n');
console.log('conf'.padEnd(10), 'fechas'.padStart(6), 'termina'.padStart(8), 'cupos'.padStart(6), 'clasificados'.padStart(13));
let fallosA = 0;
for (const conf of CONFEDERACIONES_JUGABLES) {
  const e = jugar(conf, 2030);
  const { clasificados } = clasificadosDe(e);
  const cupos = CUPOS_POR_CONFEDERACION[conf];
  const ok = eliminatoriaTerminada(e) && clasificados.length === cupos;
  if (!ok) fallosA++;
  console.log(
    conf.padEnd(10), String(fechasDeLaEliminatoria(e)).padStart(6),
    String(eliminatoriaTerminada(e)).padStart(8), String(cupos).padStart(6),
    String(clasificados.length).padStart(13), ok ? '' : '   <-- MAL');
}

// --- B) El Mundial da 48, sin repetidas ---
console.log('\n=== B) Las 48 del Mundial 2030 ===\n');
const jugadas = CONFEDERACIONES_JUGABLES.map(c => jugar(c, 2030));
const mundial = seleccionesDelMundial(2030, jugadas, SELECCIONES);
const repetidas = mundial.length - new Set(mundial).size;
const porConf = new Map<Confederacion, number>();
for (const id of mundial) {
  const c = CONFEDERACION_POR_SELECCION[id];
  porConf.set(c, (porConf.get(c) ?? 0) + 1);
}
console.log(`   selecciones: ${mundial.length}${mundial.length === 48 ? '' : '   <-- TIENEN QUE SER 48'}`);
console.log(`   repetidas:   ${repetidas}${repetidas ? '   <-- MAL' : ' (bien)'}`);
for (const [c, n] of [...porConf].sort((a, b) => b[1] - a[1])) console.log(`      ${c.padEnd(9)} ${n}`);

// --- Quién se quedó afuera: es lo que hace que valga la pena ---
const dentro = new Set(mundial);
const afuera = SELECCIONES.filter(t => CONFEDERACION_POR_SELECCION[t.id] && !dentro.has(t.id));
console.log(`\n   AFUERA del Mundial 2030 (${afuera.length}):`);
console.log('      ' + afuera.map(t => nombre(t.id)).slice(0, 18).join(', ') + (afuera.length > 18 ? '…' : ''));

// --- C) y D) ¿Cambia entre ediciones? ¿Los grandes clasifican seguido pero no siempre? ---
console.log('\n=== C/D) 30 ediciones simuladas ===\n');
const EDICIONES = 30;
const veces = new Map<string, number>();
const firmas = new Set<string>();
for (let i = 0; i < EDICIONES; i++) {
  const js = CONFEDERACIONES_JUGABLES.map(c => jugar(c, 2030 + i * 4));
  const m = seleccionesDelMundial(2030 + i * 4, js, SELECCIONES);
  firmas.add([...m].sort().join(','));
  for (const id of m) veces.set(id, (veces.get(id) ?? 0) + 1);
}
console.log(`   Mundiales distintos: ${firmas.size} de ${EDICIONES}${firmas.size < EDICIONES / 2 ? '   <-- se repite demasiado' : ''}`);

const pct = (id: string) => Math.round(((veces.get(id) ?? 0) / EDICIONES) * 100);
const MIRAR = ['wc_argentina', 'wc_brasil', 'wc_colombia', 'wc_espana', 'wc_francia', 'wc_italia',
  'wc_venezuela', 'wc_bolivia', 'wc_usa', 'wc_mexico', 'wc_san_marino'];
console.log('\n   cuántas de las 30 clasificó cada una:');
for (const id of MIRAR) {
  const p = pct(id);
  const barra = '█'.repeat(Math.round(p / 5)).padEnd(20, '·');
  console.log(`      ${nombre(id).padEnd(16)} ${barra} ${String(p).padStart(3)}%`);
}

// La medida que importa: cuántas selecciones se juegan el pasaje de verdad (a veces entran y a
// veces no). Si fueran cero, las 48 estarían decididas de antemano y la eliminatoria sería un
// trámite -- que es exactamente lo que pasaba antes de esto.
//
// Que Argentina entre el 100% NO es un problema: Conmebol reparte 6 cupos entre 10 y en la vida
// real Argentina no falla una. Medir "el favorito sufre" habría sido medir mal.
const enDisputa = [...veces].filter(([, n]) => n > 0 && n < EDICIONES).length;
const siempre = [...veces].filter(([, n]) => n === EDICIONES).length;
const nunca = SELECCIONES.filter(t => CONFEDERACION_POR_SELECCION[t.id] && !veces.has(t.id)).length;
console.log(`\n   clasifican SIEMPRE:  ${siempre}`);
console.log(`   se lo JUEGAN:        ${enDisputa}${enDisputa < 8 ? '   <-- muy pocas: las 48 saldrían casi decididas de antemano' : ''}`);
console.log(`   no entran NUNCA:     ${nunca}`);

// Y que el orden sea creíble: ninguna de las flojas de Europa puede clasificar seguido.
const FLOJAS = ['wc_san_marino', 'wc_gibraltar', 'wc_andorra', 'wc_liechtenstein', 'wc_malta'];
const colada = FLOJAS.filter(id => pct(id) > 20);
console.log(`   flojas que entran >20%: ${colada.length ? colada.map(nombre).join(', ') + '   <-- MAL' : 'ninguna (bien)'}`);

// --- Una tabla de muestra, para mirarla a ojo ---
console.log('\n=== Eliminatoria Conmebol de muestra ===\n');
const conmebol = jugar('CONMEBOL', 2030);
const tabla = clasificadosDe(conmebol);
const orden = conmebol.grupos[0].table.slice().sort((a, b) => b.puntos - a.puntos || (b.gf - b.gc) - (a.gf - a.gc));
orden.forEach((r, i) => {
  const marca = tabla.clasificados.includes(r.clubId!) ? 'CLASIFICADO' : tabla.enLaPuerta.includes(r.clubId!) ? 'repechaje' : '';
  console.log(`   ${String(i + 1).padStart(2)}. ${nombre(r.clubId!).padEnd(14)} ${String(r.puntos).padStart(2)} pts  ${String(r.pj).padStart(2)} pj  ${String(r.gf).padStart(2)}:${String(r.gc).padEnd(2)}  ${marca}`);
});

const problemas = fallosA + (mundial.length === 48 ? 0 : 1) + repetidas + (sinConf.length ? 1 : 0)
  + colada.length + (enDisputa < 8 ? 1 : 0) + (firmas.size < EDICIONES / 2 ? 1 : 0);
console.log(`\n${problemas === 0 ? 'Sin fallas.' : `${problemas} problemas (ver arriba).`}`);
