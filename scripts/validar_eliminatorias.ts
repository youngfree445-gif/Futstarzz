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
  seleccionesDe, seleccionesDelMundial, situacionEnLaEliminatoria, type Confederacion, type EliminatoriaState,
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

// --- A2) EL AVISO: cuándo se puede decir "te quedaste afuera" ---
//
// La eliminatoria no tiene un momento de eliminación como una copa: es una tabla de dos años. El
// aviso se apoya en situacionEnLaEliminatoria, y lo que hay que cuidar es que NO MIENTA -- decirle
// a alguien que quedó afuera cuando todavía puede entrar es mucho peor que decírselo tarde.
console.log('\n=== A2) El aviso de eliminación ===\n');
let fallosAviso = 0;
const chequeo = (n: string, c: boolean, d = '') => {
  if (!c) fallosAviso++;
  console.log(`${c ? 'OK  ' : 'FALLA'} ${n}${d ? '  ' + d : ''}`);
};

for (const conf of CONFEDERACIONES_JUGABLES) {
  const e = jugar(conf, 2030);
  const { clasificados, enLaPuerta } = clasificadosDe(e);
  const dentro = new Set([...clasificados, ...enLaPuerta]);
  const equipos = seleccionesDe(conf, SELECCIONES);

  // 1. Terminada la eliminatoria, el aviso tiene que coincidir con quién clasificó DE VERDAD.
  const mal = equipos.filter(t => {
    const s = situacionEnLaEliminatoria(e, t.id);
    return !s || s.clasificado !== dentro.has(t.id) || s.eliminado === dentro.has(t.id);
  });
  chequeo(`${conf}: al terminar, el aviso dice lo mismo que la clasificación`, mal.length === 0,
          mal.slice(0, 3).map(t => nombre(t.id)).join(', '));
  chequeo(`${conf}: y todos quedan marcados como terminados`,
          equipos.every(t => situacionEnLaEliminatoria(e, t.id)?.terminada === true));
}

// 2. LO QUE NO PUEDE PASAR: dar por eliminado a alguien que después clasifica.
//
// Se juega la eliminatoria fecha por fecha y en CADA una se anota a quién se dio por eliminado.
// Al final, ninguno de esos puede estar entre los que entraron. Es la única prueba que sirve acá:
// la regla es una desigualdad y un error de signo se ve exactamente así.
// SE JUEGAN VARIAS EDICIONES, no una. La eliminación matemática con fechas de sobra es RARA -- con
// 10 selecciones y el corte en 8, casi todas llegan vivas al final -- así que una sola edición da 0
// o 1 según cómo caigan los dados, y un test que depende de eso miente la mitad de las veces.
const EDICIONES_DEL_AVISO = 20;
for (const conf of ['CONMEBOL', 'CONCACAF', 'UEFA'] as Confederacion[]) {
  const mentiras = new Set<string>();
  let anticipadosEnTotal = 0;
  for (let ed = 0; ed < EDICIONES_DEL_AVISO; ed++) {
    let e = crearEliminatoria(conf, 2030, SELECCIONES);
    const dadosPorEliminados = new Set<string>();
    for (let f = 0; f < fechasDeLaEliminatoria(e); f++) {
      e = resolverPasoEliminatoria(e, SELECCIONES);
      for (const t of seleccionesDe(conf, SELECCIONES)) {
        const s = situacionEnLaEliminatoria(e, t.id);
        if (s && !s.terminada && s.eliminado) {
          dadosPorEliminados.add(t.id);
          if (s.fechasQueFaltan >= 2) anticipadosEnTotal++;
        }
      }
    }
    const { clasificados, enLaPuerta } = clasificadosDe(e);
    const dentroDeEsta = new Set([...clasificados, ...enLaPuerta]);
    for (const id of dadosPorEliminados) if (dentroDeEsta.has(id)) mentiras.add(id);
  }
  const mentira = [...mentiras];
  chequeo(`${conf}: en ${EDICIONES_DEL_AVISO} ediciones, nadie dado por eliminado terminó clasificando`,
          mentira.length === 0, mentira.map(nombre).join(', '));
  if (conf === 'UEFA') {
    // En Europa no se puede afirmar mientras se juega: el segundo de un grupo puede entrar como uno
    // de los cuatro mejores segundos, y eso depende de los otros once grupos.
    chequeo('UEFA no anticipa NUNCA, porque los mejores segundos también entran',
            anticipadosEnTotal === 0, `${anticipadosEnTotal} avisos`);
  } else {
    // Del otro lado: que el aviso EXISTA donde PUEDE existir. Una regla que nunca dispara pasa
    // todas las pruebas de "no miente" sin servir para nada.
    //
    // Y donde no puede, se dice por qué: en Concacaf hay 8 selecciones cargadas para 6 cupos más
    // los 2 del repechaje, así que el corte se las lleva a todas y nadie queda nunca afuera antes
    // de tiempo. Es la misma limitación de DATOS que ya está anotada en CUPOS_POR_CONFEDERACION --
    // faltan las 41 restantes de la confederación --, no un error de la regla. El día que se
    // carguen, este chequeo empieza a pedir avisos también acá.
    const equipos = seleccionesDe(conf, SELECCIONES).length;
    const corte = CUPOS_POR_CONFEDERACION[conf] + 2;
    if (corte >= equipos) {
      chequeo(`${conf}: no puede haber aviso anticipado (${equipos} selecciones y el corte es ${corte})`,
              anticipadosEnTotal === 0, `faltan selecciones cargadas, no es la regla`);
    } else {
      chequeo(`${conf}: el aviso anticipado llega alguna vez en ${EDICIONES_DEL_AVISO} ediciones`,
              anticipadosEnTotal > 0,
              `${anticipadosEnTotal} avisos en ${EDICIONES_DEL_AVISO} ediciones -- es raro y está bien que lo sea`);
    }
  }
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

const problemas = fallosA + fallosAviso + (mundial.length === 48 ? 0 : 1) + repetidas + (sinConf.length ? 1 : 0)
  + colada.length + (enDisputa < 8 ? 1 : 0) + (firmas.size < EDICIONES / 2 ? 1 : 0);
console.log(`\n${problemas === 0 ? 'Sin fallas.' : `${problemas} problemas (ver arriba).`}`);
