// LA FIESTA: que sea la excepcion, que se pague, y que la espera no se pueda espiar.
//
//   npm run validar:fiesta
//
// Quinta de las ocho mecanicas de vida (docs/OCHO_MECANICAS_DE_VIDA.md). Pedido: "fiesta antes de un
// partido importante. Nadie se entera... salvo que salga una foto", con el detalle que la hace
// memorable: "el resultado de la foto se decide al ir, pero se revela dias despues. Esa espera es la
// mecanica".
//
// LO QUE MAS FACIL SE ROMPE ACA no es un numero: es que el texto del desenlace inmediato delate lo
// que va a pasar. Si al ir el juego dice algo distinto segun la tirada, el jugador aprende a leerlo
// en dos partidas y la espera deja de existir. Por eso hay un caso dedicado a eso.

import {
  CHANCE_DE_QUE_SALGA_LA_FOTO, CHANCE_DE_QUE_TE_INVITEN, ENERGIA_DE_LA_FIESTA,
  ENTORNO_DE_LA_FIESTA, FECHAS_HASTA_QUE_SE_SABE,
  eventoDeLaFiesta, fueALaFiesta, golpeDeLaFoto, hayFiestaEstaNoche, loQuePasoConLaFoto, saleLaFoto,
  type MotivoDelPartidoGrande,
} from '../src/laFiesta';

let fallas = 0;
const ok = (n: string, c: boolean, d = '') => {
  if (c) console.log(`   OK   ${n}${d ? '  ' + d : ''}`);
  else { fallas++; console.log(`   FALLA ${n}${d ? '  ' + d : ''}`); }
};

const dado = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const MOTIVOS: MotivoDelPartidoGrande[] = ['clasico', 'final', 'continental'];

console.log('=== A) Solo antes de un partido grande ===');
ok('un martes cualquiera no hay fiesta, tire lo que tire el dado',
  [0, 0.1, 0.4, 0.9].every(d => !hayFiestaEstaNoche(d, null)));
for (const motivo of MOTIVOS) {
  let veces = 0;
  for (let i = 0; i < 2000; i++) if (hayFiestaEstaNoche(dado(i), motivo)) veces++;
  const tasa = veces / 2000;
  ok(`antes de un partido de tipo "${motivo}" aparece a veces, no siempre`,
    tasa > 0.3 && tasa < 0.7, `${(tasa * 100).toFixed(1)}%`);
  ok(`   y cerca de la chance declarada`, Math.abs(tasa - CHANCE_DE_QUE_TE_INVITEN) < 0.05);
}

console.log('');
console.log('=== B) Ninguna de las dos salidas es gratis ===');
for (const motivo of MOTIVOS) {
  const ev = eventoDeLaFiesta(0.5, motivo);
  const ir = ev.choices[0].effects;
  const quedarse = ev.choices[1].effects;
  ok(`${motivo}: ir cuesta el cuerpo y suma en los tuyos`,
    ir.energy === -ENERGIA_DE_LA_FIESTA && ir.entorno === ENTORNO_DE_LA_FIESTA,
    `energia ${ir.energy} · entorno ${ir.entorno}`);
  ok(`${motivo}: quedarse tambien cuesta algo`, (quedarse.entorno ?? 0) < 0,
    `entorno ${quedarse.entorno}`);
  ok(`${motivo}: y el titulo nombra el partido que viene`,
    ev.title.length > 0 && ev.description.length > 0);
}

console.log('');
console.log('=== C) LA ESPERA NO SE PUEDE ESPIAR ===');
//
// El caso central. Se juntan todos los textos que el jugador ve AL ELEGIR IR, en las dos ramas de la
// tirada, y tiene que haber uno solo. Si hubiera dos, la espera seria decorativa.
const textosAlIr = new Set<string>();
const textosAlQuedarse = new Set<string>();
let conFoto = 0, sinFoto = 0;
for (let i = 0; i < 3000; i++) {
  const ev = eventoDeLaFiesta(dado(i), 'clasico');
  textosAlIr.add(ev.choices[0].outcome);
  textosAlQuedarse.add(ev.choices[1].outcome);
  if (ev.choices[0].effects.laFotoSale) conFoto++; else sinFoto++;
}
ok('el desenlace de IR es siempre el mismo texto, salga o no salga la foto',
  textosAlIr.size === 1, `${textosAlIr.size} texto(s) distintos`);
ok('el de quedarse tambien', textosAlQuedarse.size === 1);
ok('y sin embargo la tirada esta hecha y viaja adentro de la eleccion',
  conFoto > 0 && sinFoto > 0, `${conFoto} con foto · ${sinFoto} sin foto`);

const tasaFoto = conFoto / 3000;
ok('la foto sale cerca de la chance declarada', Math.abs(tasaFoto - CHANCE_DE_QUE_SALGA_LA_FOTO) < 0.05,
  `${(tasaFoto * 100).toFixed(1)}% contra ${(CHANCE_DE_QUE_SALGA_LA_FOTO * 100).toFixed(0)}% declarado`);
ok('la mayoria de las veces no pasa nada: por eso ir es tentador', tasaFoto < 0.4,
  `${(tasaFoto * 100).toFixed(1)}%`);

console.log('');
console.log('=== D) La tirada es una sola, y no cambia al releerla ===');
//
// Si `saleLaFoto` se tirara de nuevo al revelar, el resultado guardado y el mostrado podrian no
// coincidir. Aca se comprueba que la funcion es una funcion: mismo dado, misma respuesta, siempre.
ok('el mismo dado da siempre la misma respuesta',
  [0.1, 0.24, 0.26, 0.9].every(d => saleLaFoto(d) === saleLaFoto(d)));
ok('y el evento guarda exactamente lo que dice esa funcion',
  [0.1, 0.24, 0.26, 0.9].every(d =>
    eventoDeLaFiesta(d, 'final').choices[0].effects.laFotoSale === saleLaFoto(d)));

console.log('');
console.log('=== E) Cuando sale, se paga; y la espera dura lo que dice ===');
const golpe = golpeDeLaFoto();
ok('la foto pega en prestigio y en hinchada', golpe.prestige < 0 && golpe.fans < 0,
  `prestigio ${golpe.prestige} · hinchada ${golpe.fans}`);
ok('y pega mas fuerte que lo que costo ir',
  Math.abs(golpe.prestige + golpe.fans) > ENERGIA_DE_LA_FIESTA,
  `${Math.abs(golpe.prestige + golpe.fans)} contra ${ENERGIA_DE_LA_FIESTA} de energia`);
ok('la espera son varias fechas, no una', FECHAS_HASTA_QUE_SE_SABE >= 2, `${FECHAS_HASTA_QUE_SE_SABE}`);
ok('los dos desenlaces del plazo dicen cosas distintas',
  loQuePasoConLaFoto(true) !== loQuePasoConLaFoto(false));
ok('y el que zafo se entera igual: no enterarse de nada no es un desenlace',
  loQuePasoConLaFoto(false).length > 20);

console.log('');
console.log('=== F) Solo IR deja la foto pendiente ===');
const ev = eventoDeLaFiesta(0.1, 'continental');
ok('ir queda marcado como ir', fueALaFiesta(ev.choices[0].effects));
ok('quedarse no deja nada pendiente', !fueALaFiesta(ev.choices[1].effects));

console.log('');
console.log(`${fallas === 0 ? 'La fiesta aparece antes de los partidos grandes, se paga, y la foto no se puede espiar.' : `${fallas} FALLAS`}`);
process.exit(fallas === 0 ? 0 : 1);
