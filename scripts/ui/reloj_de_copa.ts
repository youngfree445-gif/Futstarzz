// Cuántas fechas de copa cree el motor que pasaron, paso a paso.
//   npx vite-node scripts/ui/reloj_de_copa.ts "FC Bayern München"
import { fechasDeCopaTranscurridas, fixturesAtStep } from '../../src/dateSchedule';
const CLUB = process.argv[2] || 'FC Bayern München';
for (let p = 1; p <= 60; p++) {
  const n = fechasDeCopaTranscurridas(CLUB, p, false, 'Champions League');
  const s = fixturesAtStep(CLUB, p);
  const cont = s?.fixtures.some(f => f.competition.kind === 'continental_cup');
  if (cont || p % 10 === 0) {
    console.log(`paso ${String(p).padStart(3)} ${cont ? '(dia continental)' : '                 '} -> el motor cuenta ${n}`);
  }
}
