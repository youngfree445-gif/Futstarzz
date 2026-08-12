// Validador del calendario. Se corre con `npm run validar:calendario`.
//
// Contesta dos preguntas que no se pueden mirar a ojo, y que conviene re-chequear después de
// cualquier cambio en dateSchedule.ts, seasonCalendar.ts o en el reparto de semanas de copa.
//
//   A) ¿El calendario con FECHAS respeta el descanso? Dos partidos con menos de dos días entre
//      medio, o más de tres en siete días, son señal de que la generación se desordenó.
//
//   B) ¿Alcanzan las semanas de copa? Las copas corren por PASOS de semana (isCupWeek), no por
//      fecha, y el motor sólo ofrece copa un día en el que el calendario no trajo partido. Si las
//      semanas libres son menos que los pasos que la copa necesita para coronar campeón, el torneo
//      no termina en su temporada y se desfasa de la liga -- que es un bug que este juego ya tuvo.

import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data';
import { fixturesForClub } from '../src/dateSchedule';
import { isCupWeek, getRealDate, SEASON_LENGTH_WEEKS } from '../src/leagueEngine';

const MIN_DESCANSO_DIAS = 2;
const MAX_PARTIDOS_EN_7_DIAS = 3;
const TEMPORADAS_A_REVISAR = [1, 2, 3];
const CLUBES_A_REVISAR = 250;

/** Pasos que necesita cada copa para llegar al campeón. Sirve de referencia contra las semanas libres. */
const PASOS_QUE_NECESITA: Record<string, number> = {
  'copa nacional (desde cuartos, ida y vuelta)': 6,
  'Libertadores / Sudamericana': 14,
  'Champions / Europa': 18,
};

const dias = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
const iso = (d: Date) => d.toISOString().slice(0, 10);

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

/** Semanas de copa que el club puede usar de verdad: las que no chocan con una fecha suya. */
function semanasDeCopaUtilizables(club: string, temporada: number): { total: number; libres: number } {
  const ocupadas = new Set(fechasConPartido(club, temporada));
  let total = 0, libres = 0;
  for (let w = 1; w <= SEASON_LENGTH_WEEKS; w++) {
    if (!isCupWeek(w)) continue;
    total++;
    if (!ocupadas.has(iso(getRealDate((temporada - 1) * SEASON_LENGTH_WEEKS + w)))) libres++;
  }
  return { total, libres };
}

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

// --- B) Presupuesto de semanas de copa ---
console.log('\n=== B) Semanas de copa utilizables por club ===');
console.log('(las copas corren por paso de semana; una semana con partido de liga queda bloqueada)\n');
let apretados = 0;
for (const nombre of ['Santos', 'FC Barcelona', 'Junior de Barranquilla', 'Real Madrid', 'Flamengo']) {
  if (!CLUBS.some(c => c.name === nombre)) continue;
  const filas = TEMPORADAS_A_REVISAR.map(t => {
    const { total, libres } = semanasDeCopaUtilizables(nombre, t);
    if (libres < PASOS_QUE_NECESITA['Champions / Europa']) apretados++;
    return `T${t}: ${libres}/${total}`;
  });
  console.log(`  ${nombre.padEnd(24)} ${filas.join('   ')}`);
}

console.log('\nPasos que necesita cada copa para coronar campeón:');
for (const [k, v] of Object.entries(PASOS_QUE_NECESITA)) console.log(`  ${k.padEnd(46)} ${v}`);

const problemas = pocoDescanso.length + saturadas.length;
console.log(`\n${problemas === 0 ? 'Sin problemas de descanso.' : `${problemas} hallazgos de descanso (ver arriba).`}`);
if (apretados > 0) {
  console.log(`ATENCIÓN: hay ${apretados} club-temporadas con menos semanas libres que los ${PASOS_QUE_NECESITA['Champions / Europa']} pasos que necesita una copa europea. Esa copa no llega a coronar campeón en su temporada.`);
}
