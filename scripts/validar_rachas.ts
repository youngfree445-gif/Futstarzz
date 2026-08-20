// Casos de las rachas de tu historia (ver src/rachas.ts).
//
// Lo que hay que probar no es que cuente bien -- eso es un bucle -- sino las dos decisiones de
// diseño: que una racha corta NO se muestre (si se muestra cualquier cosa, la tarjeta se llena de
// ruido y se deja de leer) y que la del rival le gane a las demás cuando existe.
import {
  enOrden, rachaConElRival, rachaDeGol, rachaDeResultados, rachaEnCompeticion,
  rachasDelProximoPartido, MINIMO_CON_UN_RIVAL, MINIMO_DERROTAS, MINIMO_VICTORIAS,
} from '../src/rachas';
import { DatedResult } from '../src/types';
import { evaluarForma, ajusteDeFormaEnElOnce, avisoDeFormaEnElOnce, PESO_DE_LA_FORMA_EN_EL_ONCE } from '../src/forma';

let fallas = 0;
let corridos = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  corridos++;
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

/** Un partido, con la fecha derivada del índice para no escribirlas a mano. */
let dia = 0;
const p = (rival: string, mios: number, suyos: number, competicion = 'Liga BetPlay Dimayor'): DatedResult => {
  dia++;
  return {
    date: `2026-${String(1 + Math.floor(dia / 28)).padStart(2, '0')}-${String(1 + (dia % 28)).padStart(2, '0')}`,
    competition: competicion, opponentName: rival, myGoals: mios, rivalGoals: suyos,
  };
};
const reset = () => { dia = 0; };

// =============================================================================================
// 1. UNA RACHA CORTA NO ES UNA RACHA
// =============================================================================================

reset();
ok('dos victorias no se cuentan como racha',
   rachaDeResultados([p('A', 2, 0), p('B', 1, 0)]) === null);
reset();
ok('tres sí', rachaDeResultados([p('A', 2, 0), p('B', 1, 0), p('C', 3, 1)])?.largo === 3);
reset();
ok('dos derrotas tampoco', rachaDeResultados([p('A', 0, 2), p('B', 0, 1)]) === null);
reset();
ok('tres derrotas sí, y en tono malo', (() => {
  const r = rachaDeResultados([p('A', 0, 2), p('B', 0, 1), p('C', 1, 3)]);
  return r?.largo === 3 && r.tono === 'mala';
})());
ok('sin partidos, no hay racha', rachaDeResultados([]) === null);
ok('los mínimos de derrota y victoria son los que dice el módulo',
   MINIMO_VICTORIAS === 3 && MINIMO_DERROTAS === 3);

// =============================================================================================
// 2. INVICTO Y SIN GANAR: LAS DE SEGUNDO ORDEN
// =============================================================================================
//
// Sólo tienen que salir cuando la racha pura se cortó con un empate, que es cuando dicen algo que
// "N victorias" o "N derrotas" no pueden decir.

reset();
const conEmpates = [p('A', 1, 1), p('B', 2, 0), p('C', 0, 0), p('D', 3, 1)];
ok('con empates en el medio sale "sin perder", no "victorias seguidas"',
   rachaDeResultados(conEmpates)?.texto.includes('sin perder') === true,
   `(${rachaDeResultados(conEmpates)?.texto})`);
reset();
const sinGanar = [p('A', 1, 1), p('B', 0, 2), p('C', 0, 0), p('D', 1, 2)];
ok('y del otro lado sale "sin ganar"',
   rachaDeResultados(sinGanar)?.texto.includes('sin ganar') === true,
   `(${rachaDeResultados(sinGanar)?.texto})`);
reset();
ok('una victoria corta la racha de no ganar',
   rachaDeResultados([p('A', 0, 1), p('B', 0, 1), p('C', 0, 0), p('D', 2, 0)]) === null);

// =============================================================================================
// 3. EL RIVAL PESA DESDE EL SEGUNDO PARTIDO
// =============================================================================================

reset();
const historiaConNacional = [
  p('Atlético Nacional', 0, 1), p('Millonarios', 3, 0), p('Atlético Nacional', 1, 1),
  p('Junior', 2, 2), p('Atlético Nacional', 0, 2),
];
const vsNacional = rachaConElRival(historiaConNacional, 'Atlético Nacional');
ok('cuenta sólo los partidos contra ese rival', vsNacional?.largo === 3, `(${vsNacional?.texto})`);
ok('y lo nombra, para que la línea se entienda sola',
   vsNacional?.texto.includes('Atlético Nacional') === true);
ok('el mínimo con un rival es más bajo que el general', MINIMO_CON_UN_RIVAL < MINIMO_VICTORIAS);
reset();
ok('un solo partido contra ese rival no alcanza',
   rachaConElRival([p('Atlético Nacional', 0, 1)], 'Atlético Nacional') === null);
reset();
ok('ganarle seguido también se cuenta, en tono bueno', (() => {
  const r = rachaConElRival([p('X', 2, 0), p('X', 1, 0)], 'X');
  return r?.tono === 'buena' && r.texto.includes('Le ganaste');
})());
reset();
ok('un rival que nunca enfrentaste no inventa racha',
   rachaConElRival([p('A', 1, 0), p('A', 1, 0)], 'Desconocido') === null);

// =============================================================================================
// 4. LA COMPETICIÓN SE MIRA APARTE
// =============================================================================================
//
// Podés estar irregular en la liga y ser intratable en la copa: contadas juntas, las dos cosas se
// anulan y no se cuenta ninguna.

reset();
const mixta = [
  p('A', 0, 2), p('B', 3, 0, 'Copa Libertadores'), p('C', 0, 1),
  p('D', 2, 1, 'Copa Libertadores'), p('E', 1, 2), p('F', 2, 0, 'Copa Libertadores'),
  p('G', 0, 3), p('H', 1, 1, 'Copa Libertadores'),
];
ok('la racha de la copa no la tapa la liga',
   rachaEnCompeticion(mixta, 'Copa Libertadores')?.texto.includes('sin perder') === true,
   `(${rachaEnCompeticion(mixta, 'Copa Libertadores')?.texto})`);
ok('y la ronda no parte la racha en pedazos',
   rachaEnCompeticion(mixta, 'Copa Libertadores · Octavos de Final')?.largo === 4);
ok('una competición con menos partidos que el mínimo no cuenta',
   rachaEnCompeticion(mixta, 'Liga BetPlay Dimayor') === null
   || rachaEnCompeticion(mixta, 'Liga BetPlay Dimayor')!.largo >= 4);

// =============================================================================================
// 5. LOS GOLES DEL EQUIPO
// =============================================================================================

reset();
ok('tres partidos sin marcar se cuentan',
   rachaDeGol([p('A', 0, 1), p('B', 0, 0), p('C', 0, 2)])?.texto.includes('sin marcar') === true);
reset();
ok('dos no', rachaDeGol([p('A', 0, 1), p('B', 0, 0)]) === null);
reset();
ok('marcar necesita más partidos que no marcar: es lo normal, pesa menos',
   rachaDeGol([p('A', 1, 0), p('B', 2, 1), p('C', 1, 1)]) === null);
reset();
ok('cuatro marcando sí se cuenta',
   rachaDeGol([p('A', 1, 0), p('B', 2, 1), p('C', 1, 1), p('D', 3, 0)])?.tono === 'buena');

// =============================================================================================
// 6. LO QUE SE MUESTRA EN LA TARJETA
// =============================================================================================

reset();
const historia = [
  p('Atlético Nacional', 0, 1), p('Millonarios', 0, 2), p('Atlético Nacional', 1, 2),
  p('Junior', 0, 1), p('Atlético Nacional', 0, 3),
];
const mostradas = rachasDelProximoPartido(historia, 'Atlético Nacional', 'Liga BetPlay Dimayor');
ok('la del rival va primero, que es la que habla del partido de hoy',
   mostradas[0]?.texto.includes('Atlético Nacional') === true, `(${mostradas[0]?.texto})`);
ok('no se muestran más de dos: la tarjeta tiene lugar para dos líneas', mostradas.length <= 2);
ok('sin historia no se muestra nada', rachasDelProximoPartido(undefined, 'X', 'Y').length === 0);
ok('con historia vacía tampoco', rachasDelProximoPartido([], 'X', 'Y').length === 0);
ok('se puede pedir una sola',
   rachasDelProximoPartido(historia, 'Atlético Nacional', 'Liga BetPlay Dimayor', 1).length === 1);
reset();
ok('una carrera recién empezada no muestra rachas',
   rachasDelProximoPartido([p('A', 1, 0)], 'A', 'Liga BetPlay Dimayor').length === 0);

// =============================================================================================
// 7. EL ORDEN CRONOLÓGICO NO SE DA POR SENTADO
// =============================================================================================
//
// datedResults se guarda reemplazando la entrada del día, no siempre agregando al final, así que
// una copa de mitad de semana puede quedar después de una fecha de liga posterior.

const desordenada: DatedResult[] = [
  { date: '2026-03-10', competition: 'Liga', opponentName: 'A', myGoals: 0, rivalGoals: 1 },
  { date: '2026-03-01', competition: 'Liga', opponentName: 'B', myGoals: 3, rivalGoals: 0 },
  { date: '2026-03-05', competition: 'Liga', opponentName: 'C', myGoals: 0, rivalGoals: 2 },
];
ok('enOrden ordena por fecha real',
   enOrden(desordenada).map(r => r.opponentName).join('') === 'BCA');
ok('y la racha se lee sobre el orden correcto, no el de llegada',
   rachaDeResultados(desordenada) === null,
   '(2 derrotas al final: no llega al mínimo)');

// =============================================================================================
// 8. LOS PARTIDOS QUE JUGO EL CLUB SIN VOS CUENTAN
// =============================================================================================
//
// La racha es del CLUB, no de tu planilla personal. Reportado: "hubo un partido que se simulo
// porque me suspendieron y perdimos, pero en la ventana de proximo partido aun me sale que voy
// invicto". La derrota se simulaba y se avisaba por pantalla, pero no se anotaba en datedResults,
// que es de donde sale la racha -- asi que el invicto seguia corriendo sobre un partido perdido.

// Cuatro sin perder (el minimo para que el invicto salga) y una derrota que jugo el club sin vos.
const conSancion: DatedResult[] = [
  { date: '2026-02-01', competition: 'Liga', opponentName: 'A', myGoals: 2, rivalGoals: 0 },
  { date: '2026-02-08', competition: 'Liga', opponentName: 'B', myGoals: 1, rivalGoals: 1 },
  { date: '2026-02-15', competition: 'Liga', opponentName: 'C', myGoals: 3, rivalGoals: 1 },
  { date: '2026-02-22', competition: 'Liga', opponentName: 'D', myGoals: 2, rivalGoals: 2 },
  { date: '2026-03-01', competition: 'Liga', opponentName: 'E', myGoals: 0, rivalGoals: 2, sinElJugador: true },
];
ok('una derrota que jugo el club sin vos CORTA el invicto',
   rachaDeResultados(conSancion)?.tono !== 'buena',
   rachaDeResultados(conSancion)?.texto ?? 'sin racha');
ok('y sin esa fecha el invicto seguiria corriendo (que era el bug)',
   rachaDeResultados(conSancion.slice(0, 4))?.tono === 'buena',
   rachaDeResultados(conSancion.slice(0, 4))?.texto ?? 'sin racha');

// --- EL PUESTO SE PIERDE Y SE GANA -------------------------------------------------------------
//
// La titularidad la decidia SOLO el prestigio, que nada mas sube: pasado el umbral del club eras
// titular para siempre, jugaras bien o jugaras mal. No habia forma de perder el puesto, asi que
// tampoco habia nada en juego cada fin de semana. Ahora la forma entra en la cuenta.
//
// Se comprueban las tres direcciones, porque una sola no prueba nada: que una mala racha APRIETE,
// que una buena AFLOJE, y que sin racha no mueva un punto.
{
  const notasDe = (ratings: number[], pasoBase = 40) =>
    ratings.map((rating, i) => ({ rating, paso: pasoBase - (ratings.length - 1 - i) }));

  const enBaja = evaluarForma(notasDe([4.9, 5.1, 5.0]), 40);
  const enRacha = evaluarForma(notasDe([7.8, 8.1, 7.5]), 40);
  const normal = evaluarForma(notasDe([6.2, 7.4, 5.9]), 40);

  ok('tres partidos flojos aprietan el puesto', ajusteDeFormaEnElOnce(enBaja) > 0,
    `ajuste ${ajusteDeFormaEnElOnce(enBaja)}`);
  ok('tres partidos buenos aflojan el puesto', ajusteDeFormaEnElOnce(enRacha) < 0,
    `ajuste ${ajusteDeFormaEnElOnce(enRacha)}`);
  ok('sin racha, la forma no mueve el once', ajusteDeFormaEnElOnce(normal) === 0);

  // Y que no se vaya de las manos: doce puntos es como mucho un escalon de reputacion de club. Sin
  // tope, una mala racha larga dejaba a un crack en la tribuna por dos partidos regulares.
  const bajaLarga = evaluarForma(notasDe([5.0, 4.8, 5.2, 4.9, 5.1]), 40);
  ok('el castigo tiene tope', ajusteDeFormaEnElOnce(bajaLarga) <= PESO_DE_LA_FORMA_EN_EL_ONCE,
    `ajuste ${ajusteDeFormaEnElOnce(bajaLarga)}`);

  // Y que se le AVISE al jugador: perder el puesto sin que nadie te diga por que se lee como un bug.
  ok('la mala racha se avisa', !!avisoDeFormaEnElOnce(enBaja));
  ok('sin racha no se avisa nada', avisoDeFormaEnElOnce(normal) === null);
}

console.log(fallas === 0 ? `\nLos ${corridos} casos pasan.` : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
