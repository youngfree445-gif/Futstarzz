// Cuántos días de copa le da el calendario a un club, y de qué clase.
//
//   npx vite-node scripts/ui/contar_dias_de_copa.ts "Borussia Dortmund"
//
// Existe porque la opción elegida para las copas europeas es "el calendario pone los días y el
// motor pone el torneo": si los días no alcanzan, el motor no llega a la final por más correcto
// que sea su cuadro. Una Champions completa son 17 (8 de fase de liga, 2 de playoff, tres rondas
// de ida y vuelta, y la final).
import { fixturesAtStep, temporadaDelPaso } from '../../src/dateSchedule';

const CLUB = process.argv[2] || 'Borussia Dortmund';
const TEMPORADAS = Math.max(1, Number(process.argv[3]) || 3);

for (let temporada = 1; temporada <= TEMPORADAS; temporada++) {
  // El primer paso de la temporada, para recorrerla entera.
  let paso = 1;
  while (paso < 5000 && (temporadaDelPaso(CLUB, paso)?.temporada ?? 0) < temporada) paso++;
  const primero = paso;

  const porNombre = new Map<string, number>();
  let reservasContinentales = 0;
  let realesContinentales = 0;
  let nacionales = 0;
  const pasosContinentales: number[] = [];

  while (paso < 5000 && temporadaDelPaso(CLUB, paso)?.temporada === temporada) {
    const s = fixturesAtStep(CLUB, paso);
    if (!s) break;
    for (const f of s.fixtures) {
      if (f.competition.kind === 'continental_cup') {
        const clave = (f.esReservaDeCuadro ? 'RESERVA · ' : 'REAL · ') + f.competition.name;
        porNombre.set(clave, (porNombre.get(clave) ?? 0) + 1);
        if (f.esReservaDeCuadro) reservasContinentales++; else realesContinentales++;
        pasosContinentales.push(paso);
      } else if (f.competition.kind === 'domestic_cup') {
        nacionales++;
      }
    }
    paso++;
  }

  console.log(`\n--- ${CLUB}, temporada ${temporada} (pasos ${primero}..${paso - 1}) ---`);
  for (const [k, n] of [...porNombre].sort()) console.log(`  ${String(n).padStart(3)}  ${k}`);
  console.log(`  días continentales: ${realesContinentales} reales + ${reservasContinentales} reservados = ${realesContinentales + reservasContinentales}`);
  console.log(`  días de copa nacional: ${nacionales}`);
  console.log(`  pasos continentales: ${pasosContinentales.join(', ')}`);
  console.log(`  una Champions completa necesita 17.`);
}
