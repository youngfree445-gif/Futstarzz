// Validador del calendario. Se corre con `npm run validar:calendario`.
//
// Contesta dos preguntas que no se pueden mirar a ojo, y que conviene re-chequear después de
// cualquier cambio en dateSchedule.ts o seasonCalendar.ts.
//
//   A) ¿El calendario respeta el descanso? Dos partidos con menos de dos días entre medio, o más de
//      tres en siete días, son señal de que la generación se desordenó.
//
//   C) ¿Cuánto cuesta armarlo? Es la primera pantalla del juego, así que un salto acá se siente
//      como un congelamiento al abrir.

import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data';
import { fixturesForClub } from '../src/dateSchedule';

const MIN_DESCANSO_DIAS = 2;
const MAX_PARTIDOS_EN_7_DIAS = 3;
const TEMPORADAS_A_REVISAR = [1, 2, 3];
const CLUBES_A_REVISAR = 250;

const dias = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

interface Hallazgo { club: string; temporada: number; detalle: string; }

/** Días DISTINTOS con partido. Dos competiciones el mismo día son una fecha con dos opciones
 *  (el motor elige una con pickPrimary), no una falta de descanso. */
function fechasConPartido(club: string, temporada: number): string[] {
  const fx = fixturesForClub(club).filter(f => f.temporada === temporada);
  return [...new Set(fx.map(f => f.date))].sort();
}

function validarDescanso(club: string, temporada: number): Hallazgo[] {
  const out: Hallazgo[] = [];
  const fechas = fechasConPartido(club, temporada);

  for (let i = 1; i < fechas.length; i++) {
    const d = dias(fechas[i - 1], fechas[i]);
    if (d < MIN_DESCANSO_DIAS) {
      out.push({ club, temporada, detalle: `${d} día(s) entre ${fechas[i - 1]} y ${fechas[i]}` });
    }
  }
  for (let i = 0; i < fechas.length; i++) {
    const ventana = fechas.filter(f => { const d = dias(fechas[i], f); return d >= 0 && d <= 7; });
    if (ventana.length > MAX_PARTIDOS_EN_7_DIAS) {
      out.push({ club, temporada, detalle: `${ventana.length} partidos en 7 días desde ${fechas[i]}` });
    }
  }
  return out;
}

// --- C) Costo de armar el calendario ---
//
// Va PRIMERO porque mide la llamada en frío: cualquier cosa que se haya llamado antes ya dejó el
// índice cacheado y el número saldría en cero.
//
// Se mide porque es la primera pantalla del juego. El reparto de fechas de copa recorre ventanas de
// meses día por día, y hacerlo con aritmética de Date en vez de números enteros lo llevó una vez de
// 253 ms a 2124 ms -- un congelamiento visible al abrir, y mucho peor en un teléfono.
const arranque = Date.now();
fixturesForClub('FC Barcelona');
const msDeArmado = Date.now() - arranque;

// --- A) Descanso ---
const muestra = CLUBS.filter(c => c.starPlayers?.length).slice(0, CLUBES_A_REVISAR);
const hallazgos: Hallazgo[] = [];
let revisados = 0;
for (const c of muestra) {
  if (!fixturesForClub(c.name).length) continue;
  revisados++;
  for (const t of TEMPORADAS_A_REVISAR) hallazgos.push(...validarDescanso(c.name, t));
}

const pocoDescanso = hallazgos.filter(h => h.detalle.includes('entre'));
const saturadas = hallazgos.filter(h => h.detalle.includes('en 7 días'));

console.log('=== A) Descanso en el calendario con fechas ===');
console.log(`${revisados} clubes, temporadas ${TEMPORADAS_A_REVISAR.join(', ')}\n`);
console.log(`Menos de ${MIN_DESCANSO_DIAS} días de descanso: ${pocoDescanso.length}`);
for (const h of pocoDescanso.slice(0, 8)) console.log(`   ${h.club} (T${h.temporada}): ${h.detalle}`);
console.log(`Más de ${MAX_PARTIDOS_EN_7_DIAS} partidos en 7 días: ${saturadas.length}`);
for (const h of saturadas.slice(0, 8)) console.log(`   ${h.club} (T${h.temporada}): ${h.detalle}`);

// La sección B de este validador medía "cuántas semanas de copa le quedan libres a un club", con
// isCupWeek y getRealDate. Se borró el 12 de agosto de 2026 junto con esas funciones: las copas ya
// no corren por semanas sino por las fechas de copa del calendario (ver fechasDeCopaTranscurridas),
// así que ese presupuesto no existe. Lo que hay que vigilar ahora -- que la copa se pueda jugar y
// llegue a coronar campeón -- lo mide `npm run validar:copas`.

const TOPE_DE_ARMADO_MS = 600;
console.log(`\n=== C) Armar el calendario (32 temporadas, en frío) ===`);
console.log(`  ${msDeArmado} ms   ${msDeArmado > TOPE_DE_ARMADO_MS ? `<-- PASADO EL TOPE de ${TOPE_DE_ARMADO_MS} ms: esto se congela al abrir` : `(tope ${TOPE_DE_ARMADO_MS} ms)`}`);

const problemas = pocoDescanso.length + saturadas.length;
console.log(`\n${problemas === 0 ? 'Sin problemas de descanso.' : `${problemas} hallazgos de descanso (ver arriba).`}`);
