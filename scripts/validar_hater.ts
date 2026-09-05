// REDES CON COSTO REAL: que callarse no sea siempre lo mejor.
//
//   npm run validar:hater
//
// Cuarta de las ocho mecanicas de vida (docs/OCHO_MECANICAS_DE_VIDA.md). Pedido: "responder a un
// hater puede volverse escandalo; el silencio tambien se paga."
//
// LA FRASE CLAVE ES LA SEGUNDA, y es lo que este validador existe para comprobar. Si ignorar fuera
// siempre lo optimo -- riesgo cero contra una apuesta -- nadie contestaria nunca y la mecanica
// serian tres botones alrededor de una respuesta correcta. Asi que se mide el VALOR ESPERADO de
// cada salida y se comprueba que el orden se de vuelta a medida que te callas.

import {
  CASTIGO_MAXIMO_DEL_SILENCIO, CHANCE_DE_HATER, CHANCE_DE_QUE_SALGA_BIEN, NOTA_QUE_ATRAE_HATERS,
  apareceUnHater, castigoDelSilencio, eventoDelHater, fueIgnorarlo,
} from '../src/elHater';

let fallas = 0;
const ok = (n: string, c: boolean, d = '') => {
  if (c) console.log(`   OK   ${n}${d ? '  ' + d : ''}`);
  else { fallas++; console.log(`   FALLA ${n}${d ? '  ' + d : ''}`); }
};

const dado = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

console.log('=== A) Aparece cuando jugaste mal, y no siempre ===');
ok('jugando bien no aparece nunca, tire lo que tire el dado',
  [0, 0.1, 0.3, 0.5, 0.9].every(d => !apareceUnHater(d, 7.5)));
ok('justo en el limite tampoco', !apareceUnHater(0, NOTA_QUE_ATRAE_HATERS + 0.1));
let apariciones = 0;
for (let i = 0; i < 2000; i++) if (apareceUnHater(dado(i), 4.5)) apariciones++;
const tasa = apariciones / 2000;
ok('jugando mal aparece cerca de la chance declarada', Math.abs(tasa - CHANCE_DE_HATER) < 0.05,
  `${(tasa * 100).toFixed(1)}% contra ${(CHANCE_DE_HATER * 100).toFixed(0)}% declarado`);
ok('pero no siempre: un partido flojo no garantiza tormenta', tasa < 0.6, `${(tasa * 100).toFixed(1)}%`);

console.log('');
console.log('=== B) Contestar es una apuesta de verdad ===');
let bien = 0;
for (let i = 0; i < 2000; i++) {
  const ev = eventoDelHater(dado(i + 5000), 0);
  if (ev.choices[0].effects.fans > 0) bien++;
}
const tasaBien = bien / 2000;
ok('contestar sale bien menos de la mitad de las veces', tasaBien < 0.5, `${(tasaBien * 100).toFixed(1)}%`);
ok('y cerca de la chance declarada', Math.abs(tasaBien - CHANCE_DE_QUE_SALGA_BIEN) < 0.06,
  `${(tasaBien * 100).toFixed(1)}% contra ${(CHANCE_DE_QUE_SALGA_BIEN * 100).toFixed(0)}% declarado`);
ok('cuando sale mal, se paga en hinchada Y en prestigio',
  (() => {
    for (let i = 0; i < 500; i++) {
      const e = eventoDelHater(dado(i + 9000), 0).choices[0].effects;
      if (e.fans < 0) return e.prestige < 0;
    }
    return false;
  })());

console.log('');
console.log('=== C) El silencio se paga, y cada vez mas ===');
console.log('');
console.log('   veces que te callaste   lo que cuesta callarte otra vez');
const castigos: number[] = [];
for (const n of [0, 1, 2, 3, 5, 10]) {
  const c = castigoDelSilencio(n);
  castigos.push(c);
  console.log(`   ${String(n).padStart(21)}   ${String(-c).padStart(30)} de hinchada`);
}
ok('la primera vez casi no duele', castigos[0] <= 1, `${castigos[0]}`);
ok('pero nunca es gratis: si lo fuera, callarse seria la respuesta correcta', castigos[0] > 0);
ok('y sube', castigos[3] > castigos[0]);
ok('con techo', castigos[castigos.length - 1] === CASTIGO_MAXIMO_DEL_SILENCIO);

console.log('');
console.log('=== D) A LA CUANTA VEZ CONVIENE CONTESTAR ===');
console.log('');
console.log('   Valor esperado de cada salida, en puntos (hinchada + prestigio juntos).');
console.log('');
console.log('   silencios previos   contestar   ignorar   que conteste el club');

// El valor esperado de contestar sale de las DOS ramas reales del evento, no de una cuenta a mano:
// asi, si alguien cambia los numeros del modulo, esta tabla los sigue.
const ramas = { bien: null as null | { prestige: number; fans: number }, mal: null as null | { prestige: number; fans: number } };
for (let i = 0; i < 500 && (!ramas.bien || !ramas.mal); i++) {
  const e = eventoDelHater(dado(i + 3000), 0).choices[0].effects;
  if (e.fans > 0) ramas.bien = e; else ramas.mal = e;
}
const valor = (e: { prestige: number; fans: number }) => e.prestige + e.fans;
const veContestar = CHANCE_DE_QUE_SALGA_BIEN * valor(ramas.bien!)
  + (1 - CHANCE_DE_QUE_SALGA_BIEN) * valor(ramas.mal!);

let seDaVueltaEn: number | null = null;
for (const n of [0, 1, 2, 3, 4, 5, 6, 7]) {
  const ev = eventoDelHater(0.1, n);
  const veIgnorar = valor(ev.choices[1].effects);
  const veClub = valor(ev.choices[2].effects);
  if (seDaVueltaEn === null && veContestar > veIgnorar) seDaVueltaEn = n;
  console.log(`   ${String(n).padStart(17)}   ${veContestar.toFixed(1).padStart(9)}   ${veIgnorar.toFixed(1).padStart(7)}   ${veClub.toFixed(1).padStart(20)}`);
}

// EL ASERTO QUE ATRAPA EL BUG DE VERDAD: que contestar sea una opcion VIVA en algun momento.
//
// Contestar nunca va a ganar por valor esperado -- es la apuesta, y las apuestas se pagan con
// varianza, no con promedio. Lo que si tiene que pasar es que en algun punto quede A TIRO de la
// mejor alternativa: con un premio de +22 al lado, una diferencia de menos de un punto es una
// decision de verdad, y una de cuatro es un boton que nadie va a apretar nunca.
//
// La primera version pagaba +12 y -20 con 40% de exito: valor esperado -7,2, o sea CUATRO PUNTOS
// peor que la mejor alternativa en todos los niveles de silencio. La mecanica seguia siendo tres
// botones alrededor de una respuesta correcta, solo que la correcta era "que conteste el club".
// Medido, no supuesto.
let distanciaMinima = Infinity;
for (const n of [0, 1, 2, 3, 4, 5, 6, 7]) {
  const e = eventoDelHater(0.1, n);
  const mejorAlternativa = Math.max(valor(e.choices[1].effects), valor(e.choices[2].effects));
  distanciaMinima = Math.min(distanciaMinima, mejorAlternativa - veContestar);
}
ok('contestar queda a tiro de la mejor alternativa en algun momento',
  distanciaMinima <= 1, `se le acerca hasta ${distanciaMinima.toFixed(1)} punto(s)`);

ok('callarse la PRIMERA vez es lo mas barato: por eso se siente gratis',
  valor(eventoDelHater(0.1, 0).choices[1].effects) > veContestar,
  `ignorar ${valor(eventoDelHater(0.1, 0).choices[1].effects)} · contestar ${veContestar.toFixed(1)}`);
ok('pero callarse SIEMPRE deja de convenir en algun momento', seDaVueltaEn !== null,
  seDaVueltaEn === null ? 'ignorar gana SIEMPRE: la mecanica no existe' : `a partir del silencio numero ${seDaVueltaEn}`);
ok('y el club es la salida segura: no gana nunca, pero no puede salir mal',
  valor(eventoDelHater(0.1, 0).choices[2].effects) > valor(ramas.mal!),
  `club ${valor(eventoDelHater(0.1, 0).choices[2].effects)} · contestar mal ${valor(ramas.mal!)}`);

console.log('');
console.log('=== E) Cada salida esta marcada, y solo una es callarse ===');
const ev = eventoDelHater(0.3, 2);
ok('las tres vienen marcadas como del hater', ev.choices.every(c => c.effects.origen === 'hater'));
ok('y solo la del medio cuenta como silencio',
  ev.choices.filter(c => fueIgnorarlo(c.effects)).length === 1);
ok('contestar y mandar al club CIERRAN el tema',
  !fueIgnorarlo(ev.choices[0].effects) && !fueIgnorarlo(ev.choices[2].effects));

console.log('');
console.log(`${fallas === 0 ? 'El hater aparece cuando jugaste mal, contestar es una apuesta y callarse se paga.' : `${fallas} FALLAS`}`);
process.exit(fallas === 0 ? 0 : 1);
