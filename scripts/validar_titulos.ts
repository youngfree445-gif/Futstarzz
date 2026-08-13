// Casos de prueba de la limpieza: lo que TIENE que sacar y lo que NO puede tocar.
import { limpiarTitulosFantasma } from '../src/limpiarTitulos';
import { fechasDeLigaDelTorneo, fixturesForClub } from '../src/dateSchedule';
import type { PlayerProfile } from '../src/types';

const base = (cupTitles: any[], datedResults: any[]) =>
  ({ cupTitles, datedResults } as unknown as PlayerProfile);

const casos: [string, PlayerProfile, number][] = [
  ['título de un torneo que SÍ jugó -> se queda',
   base([{ competition: 'Superliga de Colombia', year: 2026, clubId: 'junior' }],
        [{ date: '2026-01-16', competition: 'Superliga de Colombia', opponentName: 'X', myGoals: 1, rivalGoals: 0 }]), 0],

  ['título de un torneo que NUNCA jugó -> se va',
   base([{ competition: 'Copa BetPlay', year: 2026, clubId: 'junior' }],
        [{ date: '2026-01-16', competition: 'Superliga de Colombia', opponentName: 'X', myGoals: 1, rivalGoals: 0 }]), 1],

  ['el caso reportado: Superliga legítima + un falso al lado',
   base([{ competition: 'Superliga de Colombia', year: 2026, clubId: 'junior' },
         { competition: 'Liga BetPlay Dimayor', year: 2026, clubId: 'junior', tipo: 'liga' }],
        [{ date: '2026-01-16', competition: 'Superliga de Colombia', opponentName: 'X', myGoals: 1, rivalGoals: 0 }]), 1],

  ['nombre con ronda al final -> cuenta como el mismo torneo',
   base([{ competition: 'Copa BetPlay', year: 2026, clubId: 'junior' }],
        [{ date: '2026-05-07', competition: 'Copa BetPlay · Cuartos de Final (Ida)', opponentName: 'X', myGoals: 2, rivalGoals: 1 }]), 0],

  ['año SIN datos guardados -> no se juzga, se queda',
   base([{ competition: 'Copa BetPlay', year: 2029, clubId: 'junior' }],
        [{ date: '2026-01-16', competition: 'Superliga de Colombia', opponentName: 'X', myGoals: 1, rivalGoals: 0 }]), 0],

  ['carrera vieja SIN datedResults -> intacta',
   base([{ competition: 'Copa BetPlay', year: 2026, clubId: 'junior' }], []), 0],

  ['año guardado como temporada de carrera (1) en vez de 2026 -> se entiende igual',
   base([{ competition: 'Copa BetPlay', year: 1, clubId: 'junior' }],
        [{ date: '2026-05-07', competition: 'Copa BetPlay', opponentName: 'X', myGoals: 2, rivalGoals: 1 }]), 0],
];

let fallas = 0;
for (const [nombre, perfil, esperado] of casos) {
  const { quitados } = limpiarTitulosFantasma(perfil);
  const ok = quitados.length === esperado;
  if (!ok) fallas++;
  console.log(`${ok ? 'OK  ' : 'FALLA'} ${nombre}  (quitó ${quitados.length}, esperado ${esperado})`);
}

// ---------------------------------------------------------------------------------------------
// LA OTRA MITAD: que el título no llegue a escribirse.
//
// La limpieza de arriba es el segundo filtro; el primero es no coronar campeón a quien no jugó el
// torneo. Reportado: "aun me dio el título de liga con Junior en tan solo unas fechas", en febrero,
// con el Apertura recién empezado. Acá se fija la regla que lo impide, contra el calendario real.
// ---------------------------------------------------------------------------------------------
console.log('\n--- fechasDeLigaDelTorneo (umbral para coronar) ---');

const JUNIOR = 'Junior de Barranquilla';
const jugoElTorneo = (date: string, dias: string[]) => {
  const { jugadas, total } = fechasDeLigaDelTorneo(JUNIOR, date, new Set(dias));
  return { ok: total === 0 || jugadas * 2 >= total, jugadas, total };
};

const fechasDeLiga = fixturesForClub(JUNIOR)
  .filter(f => f.temporada === 1 && f.competition.kind === 'league')
  .map(f => f.date);
const apertura = fechasDeLiga.filter(d => Number(d.slice(5, 7)) <= 6);

const casosDeUmbral: [string, boolean, ReturnType<typeof jugoElTorneo>][] = [
  ['febrero con 3 fechas jugadas -> NO puede coronar',
   false, jugoElTorneo(apertura[3], apertura.slice(0, 3))],
  ['última fecha del Apertura habiéndolo jugado entero -> SÍ corona',
   true, jugoElTorneo(apertura[apertura.length - 1], apertura.slice(0, -1))],
  ['última fecha salteándose un tercio de las fechas -> SÍ corona igual',
   true, jugoElTorneo(apertura[apertura.length - 1],
                     apertura.slice(0, -1).filter((_, i) => i % 3 !== 0))],
];

for (const [nombre, esperado, r] of casosDeUmbral) {
  const ok = r.ok === esperado;
  if (!ok) fallas++;
  console.log(`${ok ? 'OK  ' : 'FALLA'} ${nombre}  (${r.jugadas}/${r.total} fechas -> ${r.ok ? 'corona' : 'no corona'})`);
}

const totalCasos = casos.length + casosDeUmbral.length;
console.log(fallas === 0 ? `\nLos ${totalCasos} casos pasan.` : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
