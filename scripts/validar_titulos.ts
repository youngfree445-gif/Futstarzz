// Casos de prueba de la limpieza: lo que TIENE que sacar y lo que NO puede tocar.
import { limpiarTitulosFantasma } from '../src/limpiarTitulos';
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
console.log(fallas === 0 ? '\nLos 7 casos pasan.' : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
