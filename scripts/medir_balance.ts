// CUANTO PRESTIGIO DEJA UN PARTIDO, con el catalogo REAL de decisiones.
//
//   npx vite-node scripts/medir_balance.ts
//
// POR QUE EXISTE. El prestigio decide casi todo: si sos titular (decideLineupStatus), que clubes te
// fichan, si el club te pone en la lista de transferibles, si te convocan a la seleccion. Y hasta
// que existio este script no habia forma de contestar "cuanto cuesta subirlo", porque la unica
// medicion que habia era la del banco de pruebas de carrera larga, que tenia su PROPIA formula
// inventada sobre la nota del partido -- una cuenta que no existe en ningun lado del juego.
//
// Aca se juegan partidos con las decisiones de verdad y con la misma chanceDeAcertar que usa
// MatchSimulator (ver src/decisionDelPartido.ts). Lo que sale es el juego.
//
// LO QUE MIDIO LA PRIMERA VEZ, y por eso conviene volver a correrlo despues de tocar decisiones:
//
//     juvenil flojo (atributos 55)     +2.33 por partido    de 50 a 100 en 22 partidos
//     jugador promedio (70)            +6.87 por partido    de 50 a 100 en  8 partidos
//     muy bueno (85)                  +10.15 por partido    de 50 a 100 en  5 partidos
//
//     Delantero      +9.13        Mediocampista  +6.74
//     Arquero        +4.94        Defensor       +3.48
//
// Tres cosas que se leen ahi:
//   . el prestigio se satura en media temporada, y despues deja de significar nada
//   . la opcion ARRIESGADA paga mas que la conservadora (+8.30 contra +6.45), asi que no hay
//     eleccion de verdad: siempre conviene la primera
//   . un delantero sube dos veces y media mas rapido que un defensor
import { POOLS_DE_DECISION } from '../src/components/MatchSimulator';
import { chanceDeAcertar, MOMENTOS_POR_PARTIDO } from '../src/decisionDelPartido';
import { factorDeMarcaPersonal } from '../src/dificultad';

const N = 20000;

function unPartido(nivel: number, prestigio: number, puesto: string, cual: 0 | 1 | 2) {
  const marca = factorDeMarcaPersonal(nivel, prestigio);
  let suma = 0;
  for (let m = 0; m < MOMENTOS_POR_PARTIDO; m++) {
    const p: any = (POOLS_DE_DECISION as any)[puesto];
    const bolsa = m < 2 ? p.early : p.late;
    const d: any = bolsa[Math.floor(Math.random() * bolsa.length)];
    if (d.kickMode) {
      const esPenal = d.kickMode === 'penalty';
      suma += Math.random() < (esPenal ? 0.72 : 0.34) ? (esPenal ? 5 : 10) : (esPenal ? -8 : -2);
      continue;
    }
    const o = d.choices[Math.min(cual, d.choices.length - 1)];
    const chance = chanceDeAcertar({
      atributo: nivel, minVal: o.minVal, successChance: o.successChance,
      presion: marca, marcaFactor: marca, ruido: Math.random() - 0.5,
    });
    suma += (Math.random() < chance ? o.effectOnSuccess.prestige : o.effectOnFail.prestige) ?? 0;
  }
  return suma;
}

function medir(etiqueta: string, nivel: number, prestigio: number, puesto: string, cual: 0 | 1 | 2) {
  let total = 0;
  for (let i = 0; i < N; i++) total += unPartido(nivel, prestigio, puesto, cual);
  const media = total / N;
  const partidosPara50 = media > 0 ? Math.ceil(50 / media) : Infinity;
  console.log(`${etiqueta.padEnd(44)} ${media >= 0 ? '+' : ''}${media.toFixed(2)} por partido   ` +
    `de 50 a 100 en ${partidosPara50 === Infinity ? 'nunca' : partidosPara50 + ' partidos'}`);
}

console.log('PRESTIGIO POR PARTIDO, con el catalogo real (20.000 partidos por fila)\n');
console.log('Eligiendo SIEMPRE la opcion del medio:');
medir('  juvenil flojo (atributos 55)', 55, 50, 'Mediocampista', 1);
medir('  jugador promedio (atributos 70)', 70, 50, 'Mediocampista', 1);
medir('  muy bueno (atributos 85)', 85, 70, 'Mediocampista', 1);
medir('  crack (atributos 95, prestigio 95)', 95, 95, 'Mediocampista', 1);
console.log('\nEligiendo SIEMPRE la primera opcion (la mas arriesgada):');
medir('  jugador promedio (atributos 70)', 70, 50, 'Mediocampista', 0);
console.log('\nEligiendo SIEMPRE la tercera (la mas conservadora):');
medir('  jugador promedio (atributos 70)', 70, 50, 'Mediocampista', 2);
console.log('\nPor puesto, jugador promedio, opcion del medio:');
for (const p of ['Delantero', 'Mediocampista', 'Defensor', 'Arquero']) medir(`  ${p}`, 70, 50, p, 1);
