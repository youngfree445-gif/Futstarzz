// Quien encabeza el ranking mundial a lo largo de una carrera larga.
//
//   npx vite-node scripts/ui/probar_ranking.ts
//
// Existe porque el Balon de Oro salia SIEMPRE del mismo pool congelado de 2025: cuatro galas
// seguidas jugadas dieron Dembele, Dembele, Vitinha y Dembele otra vez. Esto muestra de un vistazo
// si la lista evoluciona -- si los veteranos se apagan y aparece la camada siguiente -- sin tener
// que jugar quince temporadas para verlo.
import { generateWorldRanking } from '../../src/worldRanking';
const perfil: any = { name: 'Camilo Restrepo', prestige: 50, careerStats: { partidosHistoricos: 0, golesHistoricos: 0 }, currentWeek: 1 };
let paso = 1;
for (let i = 0; i < 14; i++) {
  const r = generateWorldRanking({ ...perfil, currentWeek: paso }, 'Borussia Dortmund', paso, 'Alemana');
  console.log(`paso ${String(paso).padStart(4)}  1º ${r[0].name.padEnd(24)} 2º ${r[1].name.padEnd(24)} 3º ${r[2].name}   (${r.length} en el ranking)`);
  paso += 70;
}
