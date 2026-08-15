// Casos del rival de carrera (ver src/rivalDeCarrera.ts).
//
// Lo que hay que probar: que sea SIEMPRE el mismo (una vara que cambia no es una vara), que un
// traspaso no te lo cambie, que sea de tu puesto, y que NO sea un espejo de tus numeros -- si
// dependiera de vos irias empatado siempre y no diria nada.
import {
  numerosDelRival, quienVaGanando, rivalDeCarrera, rotuloDeLaComparacion,
} from '../src/rivalDeCarrera';
import { CLUBS_DATABASE } from '../src/data';
import { Position } from '../src/types';

let fallas = 0;
let corridos = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  corridos++;
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

const POSICIONES: Position[] = ['Delantero', 'Mediocampista', 'Defensor', 'Arquero'];
const ETIQUETAS: Record<Position, string[]> = {
  Delantero: ['ST', 'CF', 'LW', 'RW'],
  Mediocampista: ['CAM', 'CM', 'CDM', 'LM', 'RM'],
  Defensor: ['CB', 'LB', 'RB'],
  Arquero: ['GK'],
};

// =============================================================================================
// 1. SIEMPRE EL MISMO
// =============================================================================================

const uno = rivalDeCarrera('Camilo Restrepo', 'junior', 'Delantero', CLUBS_DATABASE);
const otro = rivalDeCarrera('Camilo Restrepo', 'junior', 'Delantero', CLUBS_DATABASE);
ok('la misma carrera saca siempre el mismo rival',
   uno?.nombre === otro?.nombre && uno?.clubName === otro?.clubName, `(${uno?.nombre})`);
ok('y existe: hay candidatos de sobra en la base', uno !== null);

const deOtro = rivalDeCarrera('Otro Jugador', 'junior', 'Delantero', CLUBS_DATABASE);
ok('otra carrera saca otro rival', deOtro?.nombre !== uno?.nombre, `(${deOtro?.nombre})`);

const deOtroClub = rivalDeCarrera('Camilo Restrepo', 'millonarios', 'Delantero', CLUBS_DATABASE);
ok('arrancar en otro club también cambia el rival', deOtroClub?.nombre !== uno?.nombre);

// =============================================================================================
// 2. ES DE TU PUESTO, Y NO ES UN COMPAÑERO
// =============================================================================================

for (const pos of POSICIONES) {
  const r = rivalDeCarrera('Camilo Restrepo', 'junior', pos, CLUBS_DATABASE);
  const club = CLUBS_DATABASE.find(c => c.name === r?.clubName);
  const figura = (club?.starPlayers ?? []).find(f => f.startsWith(r!.nombre));
  const etiqueta = figura?.match(/\(([A-Z]{2,3})\)\s*$/)?.[1] ?? '';
  ok(`un ${pos} compite contra un ${pos}`, ETIQUETAS[pos].includes(etiqueta),
     `(${r?.nombre}, ${etiqueta})`);
}

const junior = CLUBS_DATABASE.find(c => c.id === 'junior');
ok('el rival nunca es de tu propio club de origen',
   POSICIONES.every(p => rivalDeCarrera('Camilo Restrepo', 'junior', p, CLUBS_DATABASE)?.clubName !== junior?.name));

// =============================================================================================
// 3. SUS NUMEROS SON SUYOS, NO UN REFLEJO DE LOS TUYOS
// =============================================================================================

const base = uno!;
const a100 = numerosDelRival(base, 100, 'Delantero');
const a200 = numerosDelRival(base, 200, 'Delantero');
ok('sube con la carrera', a200.goles > a100.goles && a200.partidos > a100.partidos);
ok('y con el mismo paso da siempre lo mismo',
   JSON.stringify(numerosDelRival(base, 100, 'Delantero')) === JSON.stringify(a100));
ok('no juega el 100% de los partidos: se pierde alguna, como vos',
   a100.partidos < 100 && a100.partidos > 80, `(${a100.partidos})`);
ok('un delantero mete más goles que un defensor con los mismos partidos',
   numerosDelRival(base, 200, 'Delantero').goles > numerosDelRival(base, 200, 'Defensor').goles);
ok('un arquero no compite en goles',
   numerosDelRival(base, 200, 'Arquero').goles === 0);
ok('su promedio es de un jugador serio, ni un desastre ni una burla',
   a100.promedio >= 6.4 && a100.promedio <= 7.9, `(${a100.promedio})`);
ok('en la fecha cero todavía no tiene números',
   numerosDelRival(base, 0, 'Delantero').goles === 0);

// Distintos rivales tienen techos distintos: si todos rindieran igual, daría lo mismo quién te tocó.
const techos = new Set(
  ['A', 'B', 'C', 'D', 'E', 'F'].map(n => {
    const r = rivalDeCarrera(`Jugador ${n}`, 'junior', 'Delantero', CLUBS_DATABASE)!;
    return numerosDelRival(r, 200, 'Delantero').goles;
  }));
ok('distintos rivales tienen techos distintos', techos.size >= 3, `(${[...techos].join(', ')})`);

// =============================================================================================
// 4. QUIEN VA GANANDO
// =============================================================================================

const rivalFijo = { nombre: 'X', clubName: 'Y', goles: 50, asistencias: 20, partidos: 100, promedio: 7.0 };
const stats = (g: number, a: number, p = 100, suma = 700) => ({
  golesHistoricos: g, asistenciasHistoricos: a, partidosHistoricos: p, sumaCalificacionesHistoricas: suma,
});

ok('con muchos más goles, vas ganando',
   quienVaGanando(stats(90, 30), rivalFijo, 'Delantero') === 'vos');
ok('con muchos menos, te saca ventaja',
   quienVaGanando(stats(10, 5), rivalFijo, 'Delantero') === 'el');
ok('con la misma cantidad, están parejos',
   quienVaGanando(stats(50, 20), rivalFijo, 'Delantero') === 'parejos');
ok('un gol de diferencia no cambia el cartel: sería ruido',
   quienVaGanando(stats(51, 20), rivalFijo, 'Delantero') === 'parejos');
ok('el margen de "parejos" crece con la carrera',
   quienVaGanando(stats(500, 200), { ...rivalFijo, goles: 495, asistencias: 200 }, 'Delantero') === 'parejos');
ok('a un arquero se lo mide por promedio, no por goles',
   quienVaGanando(stats(0, 0, 100, 800), rivalFijo, 'Arquero') === 'vos');
ok('y a un defensor también',
   quienVaGanando(stats(0, 0, 100, 600), rivalFijo, 'Defensor') === 'el');
ok('sin partidos jugados, el promedio no explota',
   quienVaGanando(stats(0, 0, 0, 0), rivalFijo, 'Arquero') === 'el');

ok('cada veredicto tiene su frase, y las tres nombran al rival',
   new Set((['vos', 'el', 'parejos'] as const).map(q => rotuloDeLaComparacion(q, rivalFijo))).size === 3
   && (['vos', 'el', 'parejos'] as const).every(q => rotuloDeLaComparacion(q, rivalFijo).includes('X')));

console.log(fallas === 0 ? `\nLos ${corridos} casos pasan.` : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
