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
// LO QUE MIDIO LA PRIMERA VEZ, ANTES DEL REBALANCEO:
//
//     jugador promedio (70)     +6.87 por partido    de 50 a 100 en 8 partidos
//     y la opcion ARRIESGADA pagaba mas que la conservadora SIEMPRE (+8.30 contra +6.45)
//
// O sea: el recurso central del juego se saturaba en media temporada, y la pantalla de partido no
// tenia una decision sino una respuesta correcta.
//
// DESPUES DEL REBALANCEO (ver CUANTO_VALE_UN_PUNTO y pesoDeLaSituacion en decisionDelPartido.ts):
//
//     juvenil flojo (55)        +0.77    de 50 a 100 en 65 partidos
//     jugador promedio (70)     +2.27    de 50 a 100 en 22 partidos
//     muy bueno (85)            +3.40    de 50 a 100 en 15 partidos
//
//     ganando 1-0:    conservadora +2.52   arriesgada +2.28
//     perdiendo 0-1:  conservadora +2.28   arriesgada +3.31
//
// Y LA OTRA MITAD, EL OLVIDO (src/elOlvido.ts): el prestigio ahora tambien baja al cerrar cada
// temporada, segun cuanto jugaste y como. El que juega y rinde no pierde nada -- ni a los 37. El que
// no juega pierde mucho:
//
//     30 partidos rindiendo, a cualquier edad    no pierde nada
//     30 partidos flojos a los 35                -9.6
//     todo el anio de suplente                   -7.4
//     lesionado casi todo el anio                -17.6
//     no jugo nunca, 33 anios                    -28.6
//
// Con un piso que depende de tu vitrina: lo que GANASTE queda, lo que SOS se olvida. El piso ademas
// impide la espiral -- nunca te deja por debajo del umbral de convocatoria.
//
// EL PUESTO YA NO ES UNA DESVENTAJA. Antes un defensor tardaba 44 partidos y un delantero 17. La
// causa no era la que uno supondria: el defensor acertaba igual de seguido (74% contra 71%) y
// cobraba casi lo mismo por acertar, pero el CASTIGO por fallar era casi el doble (-6.07 contra
// -3.22). Se arreglo del lado del premio y no del castigo -- bajarle el castigo hubiera hecho que
// defender deje de dar miedo, que es lo mejor que tiene la posicion.
//
//     Delantero 24    Mediocampista 21    Defensor 26    Arquero 21   (partidos de 50 a 100)
//
// Y hay un caso en validar:rachas que lo vigila, para que nadie desnivele un puesto agregando una
// jugada sin enterarse.
import { POOLS_DE_DECISION } from '../src/components/MatchSimulator';
import { chanceDeAcertar, MOMENTOS_POR_PARTIDO, prestigioDeLaJugada, CUANTO_VALE_UN_PUNTO } from '../src/decisionDelPartido';
import { factorDeMarcaPersonal } from '../src/dificultad';
import { olvidoDeLaTemporada, prestigioDespuesDelOlvido, pisoDelOlvido } from '../src/elOlvido';

const N = 20000;

function unPartido(nivel: number, prestigio: number, puesto: string, cual: 0 | 1 | 2,
  golesMios = 0, golesRival = 0) {
  const marca = factorDeMarcaPersonal(nivel, prestigio);
  let suma = 0;
  for (let m = 0; m < MOMENTOS_POR_PARTIDO; m++) {
    const p: any = (POOLS_DE_DECISION as any)[puesto];
    const bolsa = m < 2 ? p.early : p.late;
    const d: any = bolsa[Math.floor(Math.random() * bolsa.length)];
    if (d.kickMode) {
      const esPenal = d.kickMode === 'penalty';
      suma += (Math.random() < (esPenal ? 0.72 : 0.34) ? (esPenal ? 5 : 10) : (esPenal ? -8 : -2)) * CUANTO_VALE_UN_PUNTO;
      continue;
    }
    const o = d.choices[Math.min(cual, d.choices.length - 1)];
    const chance = chanceDeAcertar({
      atributo: nivel, minVal: o.minVal, successChance: o.successChance,
      presion: marca, marcaFactor: marca, ruido: Math.random() - 0.5,
    });
    const acerto = Math.random() < chance;
    suma += prestigioDeLaJugada((acerto ? o.effectOnSuccess.prestige : o.effectOnFail.prestige) ?? 0, {
      successChance: o.successChance, minuto: [16, 38, 61, 83][m] ?? 61,
      golesMios, golesRival, exito: acerto,
    });
  }
  return suma;
}

function medir(etiqueta: string, nivel: number, prestigio: number, puesto: string, cual: 0 | 1 | 2,
  golesMios = 0, golesRival = 0) {
  let total = 0;
  for (let i = 0; i < N; i++) total += unPartido(nivel, prestigio, puesto, cual, golesMios, golesRival);
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
// POR PUESTO, PROMEDIANDO LAS TRES OPCIONES.
//
// Medir siempre "la del medio" es un proxy tramposo: cada bolsa ordena sus opciones distinto, asi
// que el resultado depende de como quedo ordenada cada jugada y no de como paga el puesto. Con las
// tres promediadas, lo que sale es cuanto rinde la posicion para un jugador que no siempre elige lo
// mismo -- que es cualquier jugador.
console.log('\nPor puesto, promediando las tres opciones:');
for (const pos of ['Delantero', 'Mediocampista', 'Defensor', 'Arquero']) {
  let total = 0;
  for (const cual of [0, 1, 2] as const) {
    for (let i = 0; i < N; i++) total += unPartido(70, 50, pos, cual);
  }
  const media = total / (N * 3);
  console.log(`  ${pos.padEnd(42)} +${media.toFixed(2)} por partido   de 50 a 100 en ${Math.ceil(50 / media)} partidos`);
}

// LO QUE EL PARTIDO PIDE. Aca se ve si la eleccion de la pantalla de partido es una decision de
// verdad o tiene una respuesta fija. Antes del rebalanceo, la arriesgada pagaba mas SIEMPRE.
console.log('\nGANANDO 1-0 (el partido pide aguantarla):');
medir('  arriesgada', 70, 50, 'Mediocampista', 0, 1, 0);
medir('  conservadora', 70, 50, 'Mediocampista', 2, 1, 0);
console.log('\nPERDIENDO 0-1 (el partido pide intentarla):');
medir('  arriesgada', 70, 50, 'Mediocampista', 0, 0, 1);
medir('  conservadora', 70, 50, 'Mediocampista', 2, 0, 1);

// ==================================================================================================
// EL OLVIDO: cuanto prestigio te saca una temporada. La otra mitad del rebalanceo.
// ==================================================================================================
console.log('\nEL OLVIDO -- cuanto te saca la temporada que cierra:');
const casos: [string, number, number, number | null, number][] = [
  // etiqueta,                          titular, suplente, nota, edad
  ['30 partidos rindiendo, 27 años',         30, 0, 7.0, 27],
  ['30 partidos rindiendo, 37 años',         30, 0, 7.0, 37],
  ['30 partidos flojos, 27 años',            30, 0, 5.5, 27],
  ['30 partidos flojos, 35 años',            30, 0, 5.5, 35],
  ['media temporada (15), bien, 30 años',    15, 0, 7.0, 30],
  ['todo el año de suplente (38)',            0, 38, 6.5, 30],
  ['lesionado casi todo el año (4)',          4, 0, 6.5, 30],
  ['no jugó nunca, 33 años',                  0, 0, null, 33],
];
for (const [etiqueta, tit, sup, nota, edad] of casos) {
  const d = { titularidades: tit, suplencias: sup, promedioDeNota: nota, edad,
    prestigioActual: 90, campeonatos: 0, balonesDeOro: 0 };
  const o = olvidoDeLaTemporada(d);
  console.log(`  ${etiqueta.padEnd(38)} ${o === 0 ? 'no pierde nada' : `-${o.toFixed(1)}`}   (de 90 queda ${prestigioDespuesDelOlvido(d)})`);
}
console.log('\n  El piso, segun la vitrina:');
for (const [t, b] of [[0, 0], [3, 0], [8, 1], [15, 3]] as [number, number][]) {
  console.log(`    ${t} titulos, ${b} balones de oro -> no baja de ${pisoDelOlvido(t, b)}`);
}
