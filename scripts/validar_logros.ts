// Auditoria del catalogo de logros.
//
// Lo que se prueba no es que "funcionen" -- eso lo dice jugarlos -- sino las tres cosas que en un
// catalogo de logros duelen y no se ven hasta que es tarde:
//
//   1. Ids duplicados: dos logros con el mismo id, y uno tapa al otro para siempre.
//   2. Logros REGALADOS: que se desbloqueen con un perfil recien creado. Arruinan la progresion y
//      encima pagan su recompensa el primer dia.
//   3. Checks que REVIENTAN con campos vacios. Es el peor de los tres: los checks corren despues de
//      CADA partido, asi que uno que tira excepcion rompe el juego entero -- y las carreras viejas
//      no tienen los campos nuevos.
import { ACHIEVEMENTS_DATABASE } from '../src/data';

let fallas = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

const ids = new Set<string>();
const duplicados: string[] = [];
for (const a of ACHIEVEMENTS_DATABASE) { if (ids.has(a.id)) duplicados.push(a.id); ids.add(a.id); }
ok('sin ids duplicados', duplicados.length === 0, duplicados.join(', '));

// Perfil recien creado, con lo minimo. Deliberadamente SIN los campos nuevos (lideresPorCompeticion,
// cupTitles, ballonDorHistory): es como se ve una carrera empezada antes de que existieran.
const nuevo = {
  careerStats: { goles: 0, asistencias: 0, partidos: 0, campeonatos: 0, golesHistoricos: 0,
    asistenciasHistoricos: 0, partidosHistoricos: 0, sumaCalificacionesHistoricas: 0,
    tarjetasAmarillasHistoricas: 0, tarjetasRojasHistoricas: 0 },
  marketValue: 300000, lastMatchGoals: 0, age: 17, yearsAtClub: 0, prestige: 50, fans: 35,
  sponsorships: [], girlfriend: null, mentorshipPlayerName: null,
} as any;

const regalados: string[] = [];
const rotos: string[] = [];
for (const a of ACHIEVEMENTS_DATABASE) {
  try { if (a.check(nuevo)) regalados.push(a.id); }
  catch (e) { rotos.push(`${a.id} (${(e as Error).message})`); }
}
ok('ninguno se desbloquea con un perfil recien creado', regalados.length === 0, regalados.join(', '));
ok('ningun check revienta con un perfil sin los campos nuevos', rotos.length === 0, rotos.join(', '));

// Y con el perfil de una carrera larga, para que los checks recorran datos de verdad.
const veterano = {
  ...nuevo, age: 34, yearsAtClub: 11, marketValue: 250000000, lastMatchGoals: 5, prestige: 95, fans: 99,
  careerStats: { ...nuevo.careerStats, goles: 95, golesHistoricos: 800, asistenciasHistoricos: 210,
    partidosHistoricos: 1050, campeonatos: 20 },
  cupTitles: Array.from({ length: 45 }, (_, i) => ({
    competition: i % 3 === 0 ? 'Copa Libertadores' : i % 3 === 1 ? 'Liga BetPlay Dimayor' : 'Copa BetPlay',
    year: 2026 + (i % 12), clubId: 'x', tipo: i % 3 === 1 ? 'liga' : 'copa',
  })),
  ballonDorHistory: Array.from({ length: 9 }, (_, i) => ({ year: 2026 + i, rank: 1, winnerName: 'Yo' })),
  lideresPorCompeticion: {
    'Copa Libertadores|1': { Yo: { nombre: 'Yo', clubName: 'X', goles: 60, asistencias: 10, amarillas: 0, rojas: 0, esVos: true } },
    'Copa Mundial FIFA|1': { Yo: { nombre: 'Yo', clubName: 'X', goles: 14, asistencias: 3, amarillas: 0, rojas: 0, esVos: true } },
    'Copa Mundial FIFA|5': { Yo: { nombre: 'Yo', clubName: 'X', goles: 6, asistencias: 1, amarillas: 0, rojas: 0, esVos: true } },
  },
} as any;

const rotosVet: string[] = [];
let desbloqueados = 0;
for (const a of ACHIEVEMENTS_DATABASE) {
  try { if (a.check(veterano)) desbloqueados++; }
  catch (e) { rotosVet.push(`${a.id} (${(e as Error).message})`); }
}
ok('ningun check revienta con una carrera larga', rotosVet.length === 0, rotosVet.join(', '));
ok('una carrera de leyenda desbloquea una buena parte del catalogo', desbloqueados >= 25,
   `(${desbloqueados} de ${ACHIEVEMENTS_DATABASE.length})`);

const porCat: Record<string, number> = {};
for (const a of ACHIEVEMENTS_DATABASE) porCat[a.category] = (porCat[a.category] ?? 0) + 1;
console.log(`\n${ACHIEVEMENTS_DATABASE.length} logros:`,
  Object.entries(porCat).map(([c, n]) => `${c} ${n}`).join(' · '));
console.log(fallas === 0 ? 'Los 6 casos pasan.' : `${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
