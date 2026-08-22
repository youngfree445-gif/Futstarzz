/**
 * EL VESTUARIO: cuantas pelotas te llegan, por que arrancas en el banco y cuando te sacan.
 *
 *   npm run validar:vestuario
 *
 * ---------------------------------------------------------------------------------------------
 * LAS DOS COSAS QUE ESTE VALIDADOR TIENE QUE PROTEGER
 * ---------------------------------------------------------------------------------------------
 *
 * 1. QUE EL JUGADOR DE SIEMPRE SIGA JUGANDO EL PARTIDO DE SIEMPRE. Un titular integrado tiene que
 *    recibir CUATRO pelotas en los minutos 16, 38, 61 y 83, exactamente como antes de que el
 *    vestuario existiera. Si eso se mueve, esto dejo de ser "mas relieve" y paso a ser "cambie el
 *    partido de todos", que no es lo que se pidio.
 *
 * 2. QUE LA REGLA DEL TECNICO NO SE VUELVA A MORIR. La version anterior de la sustitucion por bajo
 *    rendimiento estaba escrita y no se disparaba nunca: pedia que no quedara ninguna decision
 *    pendiente al minuto 70, y la cuarta cae entre el 80 y el 86 SIEMPRE. Cero sustituciones en
 *    200.000 partidos. Hay un caso abajo que reconstruye esa condicion y comprueba que era
 *    imposible -- para que quede escrito por que la regla es como es ahora.
 *
 * Todo lo que se prueba aca es puro y recibe el dado por parametro, asi que se puede correr cien mil
 * veces sin jugar un partido.
 */
import {
  ocasionesDelPartido, minutosDeLasOcasiones, esRecienLlegado, loQueDiceElVestuario,
  porQueVasAlBanco, teMandanACalentar, chanceDeQueTeSaquen, elDtTeSaca, minutoDeTuUltimaPelota,
  loQueElVestuarioVio, loQueDijoElVestuario, vestuarioAlCambiarDeClub,
  OCASIONES_BASE, OCASIONES_MINIMAS, OCASIONES_MAXIMAS, TOPE_POR_PARTIDO, VESTUARIO_AL_LLEGAR,
  NOTA_DE_AVISO, NOTA_DE_SALIDA, MINUTO_DEL_AVISO, MINUTO_DEL_CAMBIO, MINUTO_DE_TU_ULTIMA,
  PRESTIGIO_AL_SALIR, HINCHADA_AL_SALIR,
} from '../src/elVestuario';
import { notaDelPartido } from '../src/partidoSimulado';

let fallas = 0;
const caso = (etiqueta: string, fn: () => void) => {
  try {
    fn();
    console.log(`OK    ${etiqueta}`);
  } catch (e) {
    fallas++;
    console.log(`FALLA ${etiqueta} -- ${(e as Error).message}`);
  }
};
const igual = (a: unknown, b: unknown, que: string) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${que}: esperaba ${JSON.stringify(b)} y dio ${JSON.stringify(a)}`);
};

const titular = (companeros: number, recienLlegado = false) =>
  ocasionesDelPartido({ companeros, esTitular: true, recienLlegado });

// ==================================================================================================
// 1. CUANTAS VECES TE LLEGA LA PELOTA
// ==================================================================================================

caso('el titular integrado sigue recibiendo las cuatro de siempre', () => {
  // 50 es con lo que arranca una carrera (ver SetupScreen). Si esto cambia, cambia el juego entero.
  igual(titular(50), OCASIONES_BASE, 'companeros 50');
  igual(titular(60), OCASIONES_BASE, 'companeros 60');
  igual(titular(74), OCASIONES_BASE, 'companeros 74');
});

caso('caerle mal al plantel te saca pelotas', () => {
  igual(titular(10), OCASIONES_MINIMAS, 'companeros 10');
  igual(titular(24), OCASIONES_MINIMAS, 'companeros 24');
  igual(titular(25), OCASIONES_BASE - 1, 'companeros 25');
  igual(titular(44), OCASIONES_BASE - 1, 'companeros 44');
});

caso('caerle bien te da una mas', () => {
  igual(titular(75), OCASIONES_MAXIMAS, 'companeros 75');
  igual(titular(100), OCASIONES_MAXIMAS, 'companeros 100');
});

caso('ser el nuevo cuesta una pelota, aparte de caer bien', () => {
  igual(titular(50, true), OCASIONES_BASE - 1, 'recien llegado con relacion normal');
  igual(titular(85, true), OCASIONES_MAXIMAS - 1, 'recien llegado que ya cae bien');
  // Y no se puede acumular hasta desaparecer: el peor caso sigue siendo jugable.
  igual(titular(10, true), OCASIONES_MINIMAS, 'recien llegado al que nadie busca');
});

caso('la escala es monotona: mejor relacion nunca da menos pelotas', () => {
  for (let c = 1; c <= 100; c++) {
    if (titular(c) < titular(c - 1)) throw new Error(`companeros ${c} da menos que ${c - 1}`);
  }
});

caso('nunca menos de dos ni mas de cinco, con cualquier relacion', () => {
  for (let c = 0; c <= 100; c++) {
    for (const nuevo of [false, true]) {
      const n = titular(c, nuevo);
      if (n < OCASIONES_MINIMAS || n > OCASIONES_MAXIMAS) {
        throw new Error(`companeros ${c}${nuevo ? ' (nuevo)' : ''} da ${n}`);
      }
    }
  }
});

caso('el suplente entra y toca la pelota al menos una vez', () => {
  for (let c = 0; c <= 100; c++) {
    const n = ocasionesDelPartido({ companeros: c, esTitular: false, recienLlegado: false });
    if (n < 1) throw new Error(`el suplente con companeros ${c} no toca la pelota`);
    if (n >= titular(c)) throw new Error(`el suplente con companeros ${c} decide tanto como el titular`);
  }
});

// EL BUG QUE ENCONTRO EL BANCO DE PRUEBAS DE CARRERA LARGA.
//
// `yearsAtClub` arranca en 0 tanto para el fichaje como para el juvenil que debuta en su casa, asi
// que la primera version mandaba al pibe de las inferiores a su propio vestuario como un extrano.
// La temporada 1 se volvia un pozo: 8 temporadas terminaban con 82-166 titularidades en vez de ~250.
caso('el juvenil de la casa NO es el nuevo del vestuario', () => {
  igual(esRecienLlegado({ yearsAtClub: 0, dorsalHistory: [] }), false, 'pibe que debuta en su club');
  igual(esRecienLlegado({ yearsAtClub: 0 }), false, 'perfil viejo sin historial de dorsales');
  igual(esRecienLlegado({ yearsAtClub: 0, dorsalHistory: [{ clubId: 'otro' }] }), true, 'fichaje recien llegado');
  igual(esRecienLlegado({ yearsAtClub: 2, dorsalHistory: [{ clubId: 'otro' }] }), false, 'fichaje con dos temporadas');
});

caso('lo que pasa en el vestuario se dice en pantalla', () => {
  // Los tres estados que cambian el numero de pelotas tienen que tener frase: una regla que el
  // jugador no puede ver es un impuesto escondido.
  for (const [companeros, nuevo] of [[10, false], [35, false], [50, true], [85, false]] as [number, boolean][]) {
    const frase = loQueDiceElVestuario({ companeros, esTitular: true, recienLlegado: nuevo });
    if (!frase) throw new Error(`companeros ${companeros}${nuevo ? ' (nuevo)' : ''} da ${titular(companeros, nuevo)} pelotas y no dice nada`);
  }
  // Y el caso normal no dice nada, porque no pasa nada.
  igual(loQueDiceElVestuario({ companeros: 50, esTitular: true, recienLlegado: false }), null, 'jugador integrado');
});

// ==================================================================================================
// 2. LOS MINUTOS
// ==================================================================================================

caso('con cuatro pelotas, los minutos son los de siempre: 16, 38, 61 y 83', () => {
  // Dado fijo en el centro = sin sacudon. Es EL requisito de toda esta tanda.
  igual(minutosDeLasOcasiones(4, () => 0.5), [16, 38, 61, 83], 'los cuatro minutos de siempre');
});

caso('los minutos salen ordenados, sin repetidos y dentro del partido', () => {
  for (let cuantas = 1; cuantas <= 6; cuantas++) {
    for (let i = 0; i < 4000; i++) {
      const m = minutosDeLasOcasiones(cuantas);
      for (let k = 1; k < m.length; k++) {
        if (m[k] <= m[k - 1]) throw new Error(`${cuantas} pelotas: ${JSON.stringify(m)} no esta ordenado o repite`);
      }
      if (m[0] < 8) throw new Error(`${cuantas} pelotas: una cae en el minuto ${m[0]}`);
      // El 90 es el pitazo final: una decision agendada ahi no se dispara nunca.
      if (m[m.length - 1] > 87) throw new Error(`${cuantas} pelotas: una cae en el minuto ${m[m.length - 1]}`);
    }
  }
});

// ==================================================================================================
// 3. EL BANCO, Y POR QUE
// ==================================================================================================

caso('el banco dice cuanto te falta, y el numero tiene sentido', () => {
  const frase = porQueVasAlBanco({ prestigio: 40, vara: 55, clubName: 'Junior de Barranquilla', estorbo: 0 });
  if (!frase.includes('15')) throw new Error(`no dice que le faltan 15: "${frase}"`);
  if (!frase.includes('Junior de Barranquilla')) throw new Error('no nombra al club');
  // Nunca "te faltan 0" ni un negativo: si estas en el banco, algo te falta.
  for (const [p, v, e] of [[54, 55, 0], [55, 55, 0], [60, 55, 0], [50, 55, 10]] as [number, number, number][]) {
    const f = porQueVasAlBanco({ prestigio: p, vara: v, clubName: 'X', estorbo: e });
    const n = Number(f.match(/te faltan (\d+)/)?.[1]);
    if (!(n >= 1)) throw new Error(`prestigio ${p} contra vara ${v}+${e} dice "te faltan ${n}"`);
  }
});

// ==================================================================================================
// 4. EL TECNICO TE SACA
// ==================================================================================================

caso('jugando bien no te saca nadie', () => {
  for (const nota of [NOTA_DE_SALIDA, 6.0, 7.5, 10]) {
    igual(chanceDeQueTeSaquen(nota), 0, `nota ${nota}`);
    if (elDtTeSaca(nota, 0)) throw new Error(`con nota ${nota} te sacaron aun con el dado en 0`);
  }
});

caso('cuanto peor jugas, mas probable es que te saquen', () => {
  let previa = -1;
  for (let nota = 5.1; nota >= 3.0; nota -= 0.1) {
    const c = chanceDeQueTeSaquen(nota);
    if (c < previa) throw new Error(`nota ${nota.toFixed(1)} es menos probable que la anterior`);
    previa = c;
  }
});

caso('nunca es seguro: siempre queda un tecnico que te banca', () => {
  for (let nota = 5.1; nota >= 0; nota -= 0.1) {
    const c = chanceDeQueTeSaquen(nota);
    if (c >= 1) throw new Error(`con nota ${nota.toFixed(1)} te sacan siempre (${c})`);
  }
});

caso('el aviso llega antes que el cambio', () => {
  if (!(NOTA_DE_AVISO > NOTA_DE_SALIDA)) throw new Error('se avisa con peor nota de la que hace falta para el cambio');
  if (!(MINUTO_DEL_AVISO < MINUTO_DE_TU_ULTIMA && MINUTO_DE_TU_ULTIMA < MINUTO_DEL_CAMBIO)) {
    throw new Error(`el orden del minuto esta mal: aviso ${MINUTO_DEL_AVISO}, ultima ${MINUTO_DE_TU_ULTIMA}, cambio ${MINUTO_DEL_CAMBIO}`);
  }
  // Y hay una franja de nota en la que te avisan y todavia no te pueden sacar: es la que hace que el
  // aviso sea un aviso y no el acta de defuncion.
  const enLaCuerdaFloja = (NOTA_DE_AVISO + NOTA_DE_SALIDA) / 2;
  if (!teMandanACalentar(enLaCuerdaFloja)) throw new Error('no avisa en la franja de riesgo');
  if (chanceDeQueTeSaquen(enLaCuerdaFloja) !== 0) throw new Error('te puede sacar sin haber cruzado el corte');
});

caso('si estas en riesgo te dan una ultima pelota antes del cambio', () => {
  // Los minutos de un titular integrado: no hay ninguna entre el aviso y el cambio, asi que el
  // partido te adelanta una. Se acomoda, no se recorta.
  igual(minutoDeTuUltimaPelota([16, 38, 61, 83]), MINUTO_DE_TU_ULTIMA, 'reparto de siempre');
  // Pero si ya tenias una ahi, no se regala nada.
  igual(minutoDeTuUltimaPelota([16, 38, 65, 83]), null, 'ya tenias una en la ventana');
  igual(minutoDeTuUltimaPelota([16, 38, 61, 72]), null, 'ya tenias una justo en el cambio');
});

caso('la ultima pelota cae antes del cambio, siempre', () => {
  for (let i = 0; i < 20000; i++) {
    const m = minutosDeLasOcasiones(4);
    const ultima = minutoDeTuUltimaPelota(m);
    if (ultima != null && ultima >= MINUTO_DEL_CAMBIO) {
      throw new Error(`la ultima pelota cae en el ${ultima} y el cambio es en el ${MINUTO_DEL_CAMBIO}`);
    }
  }
});

caso('que te saquen cuesta, o el bucle no se cierra', () => {
  if (!(PRESTIGIO_AL_SALIR < 0)) throw new Error('salir del partido no le cuesta nada a tu relacion con el DT');
  if (!(HINCHADA_AL_SALIR < 0)) throw new Error('salir del partido no le cuesta nada con la hinchada');
});

// ==================================================================================================
// 5. LA NOTA TIENE QUE PODER SER MALA
// ==================================================================================================
//
// De nada sirve la regla del tecnico si la nota no puede bajar. La cuenta vieja del partido simulado
// SOLO SUMABA: con las cuatro decisiones erradas daba 5,7 -- el piso 6,0 menos el ajuste por perder
// -- y el corte para que te saquen es 5,2. Osea que simular te protegia del tecnico, de la mala
// forma y del banco, todo junto.

caso('un partido desastroso da una nota de partido desastroso', () => {
  const todoMal = notaDelPartido({ aciertos: 0, fallos: 4, goles: 0, asistencias: 0, ajustePorResultado: -0.3 });
  if (todoMal >= NOTA_DE_SALIDA) {
    throw new Error(`fallar las cuatro y perder da ${todoMal.toFixed(2)}, que no alcanza para que te saquen (corte ${NOTA_DE_SALIDA})`);
  }
});

caso('un partido bueno sigue dando una nota buena', () => {
  const bien = notaDelPartido({ aciertos: 4, fallos: 0, goles: 1, asistencias: 1, ajustePorResultado: 0.4 });
  if (bien < 8) throw new Error(`acertar las cuatro con gol y asistencia da apenas ${bien.toFixed(2)}`);
});

caso('acertar nunca baja la nota y fallar nunca la sube', () => {
  for (let a = 0; a <= 5; a++) {
    for (let f = 0; f <= 5; f++) {
      const base = notaDelPartido({ aciertos: a, fallos: f, goles: 0, asistencias: 0, ajustePorResultado: 0 });
      const masAcierto = notaDelPartido({ aciertos: a + 1, fallos: f, goles: 0, asistencias: 0, ajustePorResultado: 0 });
      const masFallo = notaDelPartido({ aciertos: a, fallos: f + 1, goles: 0, asistencias: 0, ajustePorResultado: 0 });
      if (masAcierto < base) throw new Error(`con ${a}/${f}, acertar una mas baja la nota`);
      if (masFallo > base) throw new Error(`con ${a}/${f}, fallar una mas sube la nota`);
    }
  }
});

// ==================================================================================================
// 6. LA REGLA QUE ESTABA MUERTA (queda escrito por que la de ahora es distinta)
// ==================================================================================================

caso('la condicion vieja del cambio era imposible de cumplir', () => {
  // La version anterior pedia esto para animarse a sacarte al minuto 70:
  //     const hasPendingDecision = decisionMinutes.current.some(m => m >= currentMin);
  //     if (currentMin === 70 && ... && !hasPendingDecision)
  // Con el reparto de un titular, la cuarta pelota nunca cae antes del 80.
  let veces = 0;
  const CORRIDAS = 100000;
  for (let i = 0; i < CORRIDAS; i++) {
    const m = minutosDeLasOcasiones(4);
    if (!m.some(x => x >= 70)) veces++;
  }
  if (veces > 0) throw new Error(`la condicion vieja se cumplia ${veces} veces: el caso ya no documenta nada`);
  // Y la de ahora si se dispara: con una nota mala, en la mayoria de los partidos te sacan.
  let sacado = 0;
  for (let i = 0; i < 10000; i++) if (elDtTeSaca(4.6, Math.random())) sacado++;
  if (sacado < 500) throw new Error(`con nota 4.6 solo te sacan ${sacado} de 10000 veces: la regla nueva tambien esta muerta`);
  console.log(`      (con nota 4,6 el tecnico te saca ${(sacado / 100).toFixed(0)} de cada 100 partidos)`);
});


// ==================================================================================================
// 7. LO QUE EL VESTUARIO VIO DE VOS
// ==================================================================================================

const vio = (goles: number, asistencias: number, resultado: 'W' | 'D' | 'L' = 'W') =>
  loQueElVestuarioVio({ goles, asistencias, resultado });

caso('repartir suma y acaparar resta', () => {
  // Dos asistencias y ningun gol: repartiste todo lo que tuviste.
  if (!(vio(0, 2) > 0)) throw new Error(`dos asistencias dan ${vio(0, 2)}`);
  // Hat-trick sin dar ninguna: el vestuario se enfria aunque el equipo gane.
  if (!(vio(3, 0) < 0)) throw new Error(`un hat-trick sin asistencias da ${vio(3, 0)}, y tiene que restar`);
  // Y un gol solo NO es acaparar.
  if (vio(1, 0) < vio(0, 0)) throw new Error('meter un gol solo cuenta como acaparar');
});

caso('cuantos mas metas sin dar ninguna, peor', () => {
  if (!(vio(4, 0) <= vio(3, 0))) throw new Error('cuatro goles sin asistencias no es peor que tres');
  if (!(vio(3, 0) < vio(2, 0))) throw new Error('tres goles sin asistencias no es peor que dos');
});

caso('dar una asistencia borra el reproche', () => {
  // El mismo hat-trick, pero habiendo dado una: ya no acaparaste.
  if (!(vio(3, 1) > vio(3, 0))) throw new Error('dar una asistencia en un hat-trick no cambia nada');
  if (!(vio(3, 1) > 0)) throw new Error(`hat-trick con asistencia da ${vio(3, 1)}`);
});

caso('el que sirve mas de lo que define cobra mas', () => {
  // Dos asistencias y un gol contra un gol y una asistencia: el primero reparte mas.
  if (!(vio(1, 2) > vio(2, 1))) throw new Error('servir mas de lo que definis no paga mas');
});

caso('el resultado pone el clima, y es chico', () => {
  if (!(vio(0, 1, 'W') > vio(0, 1, 'L'))) throw new Error('ganar no vale mas que perder');
  // Chico: no puede dar vuelta el juicio sobre lo que hiciste. Repartir ganando y repartir
  // perdiendo tienen que quedar los dos del lado positivo.
  if (!(vio(0, 2, 'L') > 0)) throw new Error('dos asistencias en una derrota quedan en negativo');
});

caso('un partido no puede mover el vestuario mas alla del tope', () => {
  for (let g = 0; g <= 8; g++) {
    for (let a = 0; a <= 8; a++) {
      for (const r of ['W', 'D', 'L'] as const) {
        const n = vio(g, a, r);
        if (Math.abs(n) > TOPE_POR_PARTIDO) throw new Error(`${g}g/${a}a (${r}) mueve ${n}`);
      }
    }
  }
});

caso('el vestuario habla cuando pasa algo, y se calla cuando no', () => {
  if (!loQueDijoElVestuario({ goles: 3, asistencias: 0, resultado: 'W' })) throw new Error('el hat-trick acaparador no dice nada');
  if (!loQueDijoElVestuario({ goles: 0, asistencias: 2, resultado: 'W' })) throw new Error('dos asistencias no dicen nada');
  // Un partido sin gol ni asistencia no merece cartel: si avisara siempre, el aviso no significaria nada.
  if (loQueDijoElVestuario({ goles: 0, asistencias: 0, resultado: 'W' })) throw new Error('habla de un partido en el que no paso nada');
});

caso('llegar a un club nuevo te baja del escalon mas alto', () => {
  // El idolo que se va: alla no le paso la pelota a nadie todavia.
  igual(vestuarioAlCambiarDeClub(100), VESTUARIO_AL_LLEGAR, 'idolo que cambia de club');
  igual(vestuarioAlCambiarDeClub(90), VESTUARIO_AL_LLEGAR, 'referente que cambia de club');
  // Pero el techo baja al que venia arriba, no sube al que venia abajo.
  if (vestuarioAlCambiarDeClub(30) > 30) throw new Error('cambiar de club le MEJORO el vestuario al que venia mal');
  for (let v = 0; v <= 100; v++) {
    if (vestuarioAlCambiarDeClub(v) > v) throw new Error(`con ${v} el traspaso lo sube a ${vestuarioAlCambiarDeClub(v)}`);
  }
});

// Y EL CASO QUE UNE LAS DOS MITADES: que ganarse el vestuario CAMBIE el partido.
caso('ganarse el vestuario te devuelve pelotas', () => {
  const reciénLlegado = titular(VESTUARIO_AL_LLEGAR, true);
  const ganado = titular(100, false);
  if (!(ganado > reciénLlegado)) {
    throw new Error(`llegar da ${reciénLlegado} pelotas y ganarse el vestuario da ${ganado}: no sirve de nada`);
  }
});

console.log(fallas === 0
  ? '\nEl vestuario decide cuantas pelotas te llegan, el banco se explica y el tecnico te puede sacar.'
  : `\n${fallas} FALLAS -- el vestuario no esta bien`);
process.exit(fallas === 0 ? 0 : 1);
