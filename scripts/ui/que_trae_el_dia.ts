// Que partidos trae el calendario en un paso puntual. Para entender de donde sale un dia raro.
//   npx vite-node scripts/ui/que_trae_el_dia.ts "Junior de Barranquilla" 1 3 18
import { fixturesAtStep } from '../../src/dateSchedule';
const CLUB = process.argv[2];
for (const arg of process.argv.slice(3)) {
  const paso = Number(arg);
  const s = fixturesAtStep(CLUB, paso);
  console.log(`\npaso ${paso} (${s?.date ?? '?'})`);
  for (const f of s?.fixtures ?? []) {
    console.log(`   ${f.competition.kind.padEnd(18)} ${f.competition.name.padEnd(22)} reserva=${!!f.esReservaDeCuadro} vs ${f.opponentName} (${f.isHome ? 'L' : 'V'}) ronda=${(f.match as any).round ?? '-'}`);
  }
}
