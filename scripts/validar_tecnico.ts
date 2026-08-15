// Casos de la charla del entretiempo (ver src/tecnico.ts).
//
// Lo que hay que probar es el balance de las cuatro esquinas: si cumplir y que salga mal
// castigara, obedecer seria una apuesta y nadie obedeceria nunca; y si ignorar y ganar no diera
// nada bueno, no seria una decision sino un boton de "portate bien".
import {
  CHARLAS, instruccionDelEntretiempo, mejoroEnElSegundo, resultadoDeLaCharla, situacionAlDescanso,
} from '../src/tecnico';

let fallas = 0;
let corridos = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  corridos++;
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

// =============================================================================================
// 1. LO QUE TE PIDE DEPENDE DE COMO VA EL PARTIDO
// =============================================================================================

ok('perdiendo se lee como perdiendo', situacionAlDescanso(0, 2) === 'perdiendo');
ok('empatando también', situacionAlDescanso(1, 1) === 'empatando');
ok('y ganando', situacionAlDescanso(3, 1) === 'ganando');

ok('yendo perdiendo te pide ir a buscarla, no cuidar la pelota',
   instruccionDelEntretiempo(0, 2, () => 0).situacion === 'perdiendo');
ok('yendo ganando te pide sostenerlo',
   instruccionDelEntretiempo(2, 0, () => 0).situacion === 'ganando');
ok('hay varias instrucciones por situación: no sale siempre la misma',
   Object.values(CHARLAS).every(o => o.length >= 3));
ok('todas las instrucciones piden algo concreto, no un reproche',
   Object.values(CHARLAS).flat().every(t => t.length > 40 && !/juega mejor/i.test(t)));
ok('la instrucción sale de la lista de su situación',
   CHARLAS.perdiendo.includes(instruccionDelEntretiempo(0, 1, () => 0.5).texto));

// =============================================================================================
// 2. "MEJORAR" SE MIDE POR EL SEGUNDO TIEMPO, NO POR EL RESULTADO
// =============================================================================================
//
// Ir 0-2 al descanso y perder 2-3 es un segundo tiempo ganado 2-1. Medirlo por el marcador final
// castigaria al que remonto a medias, que es justo el que hizo caso.

ok('0-2 al descanso y 2-3 final: el segundo tiempo se ganó', mejoroEnElSegundo(0, 2, 2, 3));
ok('0-0 al descanso y 1-0 final: mejoró', mejoroEnElSegundo(0, 0, 1, 0));
ok('0-0 al descanso y 0-2 final: no mejoró', !mejoroEnElSegundo(0, 0, 0, 2));
ok('2-0 al descanso y 2-2 final: no mejoró, lo dejaste escapar', !mejoroEnElSegundo(2, 0, 2, 2));
ok('1-0 al descanso y 1-0 final: aguantar sin conceder cuenta como mejorar',
   mejoroEnElSegundo(1, 0, 1, 0));
ok('0-3 al descanso y 0-5 final: no mejoró', !mejoroEnElSegundo(0, 3, 0, 5));

// =============================================================================================
// 3. LAS CUATRO ESQUINAS
// =============================================================================================

const cumplirBien = resultadoDeLaCharla(true, true, true);
const cumplirMal = resultadoDeLaCharla(true, false, false);
const ignorarGanar = resultadoDeLaCharla(false, true, true);
const ignorarPerder = resultadoDeLaCharla(false, false, false);

ok('cumplir y que mejore es lo que más lo acerca',
   cumplirBien.prestigio > cumplirMal.prestigio && cumplirBien.prestigio > 0);
ok('cumplir y que salga mal NO castiga: si castigara, obedecer sería una apuesta',
   cumplirMal.prestigio >= 0, `(${cumplirMal.prestigio})`);
ok('ignorarlo lo enfría aunque ganes', ignorarGanar.prestigio < 0);
ok('pero ganar a tu manera te da la hinchada: por eso es una decisión',
   ignorarGanar.fans > cumplirBien.fans, `(${ignorarGanar.fans} contra ${cumplirBien.fans})`);
ok('ignorarlo y encima no ganar es lo peor de los dos mundos',
   ignorarPerder.prestigio < ignorarGanar.prestigio && ignorarPerder.fans < 0);
ok('las cuatro esquinas dicen algo distinto',
   new Set([cumplirBien.mensaje, cumplirMal.mensaje, ignorarGanar.mensaje, ignorarPerder.mensaje]).size === 4);

// =============================================================================================
// 4. LOS NUMEROS SON CHICOS: ES UN PARTIDO, NO LA CARRERA
// =============================================================================================

const todos = [cumplirBien, cumplirMal, ignorarGanar, ignorarPerder];
ok('ningún cambio de prestigio pasa de 10 en un solo partido',
   todos.every(r => Math.abs(r.prestigio) <= 10),
   `(máx ${Math.max(...todos.map(r => Math.abs(r.prestigio)))})`);
ok('ni ningún cambio de hinchada',
   todos.every(r => Math.abs(r.fans) <= 10));
ok('y todas dejan un mensaje para el relato', todos.every(r => r.mensaje.length > 20));

console.log(fallas === 0 ? `\nLos ${corridos} casos pasan.` : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
