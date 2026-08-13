import { fixturesForClub, torneoDeFecha, esUltimaFechaDelTorneo } from '../src/dateSchedule';
const fx = fixturesForClub('Junior de Barranquilla').filter(f => f.temporada === 1 && f.competition.kind === 'league');
const grupos = new Map<string, string[]>();
for (const f of fx) {
  const t = torneoDeFecha(f.competition, f.date) ?? '(sin torneo)';
  if (!grupos.has(t)) grupos.set(t, []);
  grupos.get(t)!.push(f.date);
}
console.log('fechas de liga de Junior agrupadas por "torneo":');
for (const [t, ds] of grupos) console.log(`   ${t.padEnd(14)} ${ds.length} fechas · ${ds[0]} .. ${ds[ds.length-1]}`);
console.log('\ndias en que esUltimaFechaDelTorneo dice TRUE:');
for (const f of fx) if (esUltimaFechaDelTorneo('Junior de Barranquilla', f.date)) console.log(`   ${f.date}  (torneo ${torneoDeFecha(f.competition, f.date)})`);
