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
import {
  estorboDelRival, jugarFechaDelRival, anotarFechaDelRival, promedioDelRival, cronicaDelRival,
  PESO_MAXIMO_DEL_RIVAL, type RivalDePuesto,
} from '../src/rivalDePuesto';
import { elClubSeCansoDeVos, teGanasteQuedarte, avisoDeLista, exigenciaPorLoQueValés, EXIGENCIA_MAXIMA, CREDITO_MAXIMO } from '../src/listaDeTransferibles';
import { crecimientoDeLaTemporada, informeDeLaTemporada, PARTIDOS_MINIMOS } from '../src/modoHardcore';
import { apodoDe, PARTIDOS_PARA_APODO } from '../src/apodo';
import { secuelaDeLaLesion, riesgoDeSecuela, RIESGO_MAXIMO, PISO_DE_ATRIBUTO } from '../src/secuela';
import { sortearTipoDeLesion, riesgoDeLesion, RIESGO_MAXIMO_POR_FATIGA, TIPOS_DE_LESION } from '../src/lesion';
import { clubQueTeFormo, teLlamaLaCasa, temporadasEnLaCasa, EDAD_DEL_LLAMADO } from '../src/clubQueTeFormo';
import { guardarDeclaracion, laHemerotecaTeRecuerda, SALDO_PARA_QUEDAR_GUARDADA, PASOS_PARA_QUE_ENVEJEZCA, CUANTAS_SE_GUARDAN } from '../src/hemeroteca';

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

// --- EL QUE TE PELEA EL PUESTO -----------------------------------------------------------------
//
// Antes el refuerzo pesaba 14 * (1 - fechas/10): se apagaba SOLO a las diez fechas, metiera goles o
// no. O sea que no se le podia ganar el puesto jugando bien -- habia que esperar. Y el nunca jugaba
// ni marcaba: era un numero invisible con un nombre encima.
//
// Se comprueba que ahora pese por lo que HIZO, en las dos direcciones.
{
  const nuevo = (): RivalDePuesto => ({ nombre: 'Diego Sanabria', posicion: 'MC', desdeSemana: 30, nivel: 75, partidos: 0, goles: 0, asistencias: 0, sumaDeNotas: 0 });

  // Recien llegado: pesa por el credito de fichaje y se va con las fechas.
  ok('el recien llegado pesa al principio', estorboDelRival(nuevo(), 30) > 0,
    `estorbo ${estorboDelRival(nuevo(), 30)}`);
  ok('y su credito se agota si no juega', estorboDelRival(nuevo(), 45) === 0);

  // Jugando bien, te saca el puesto.
  let crack = nuevo();
  for (let i = 0; i < 4; i++) crack = anotarFechaDelRival(crack, { nota: 8.0, goles: 1, asistencias: 0 });
  ok('si le va bien, te complica el puesto', estorboDelRival(crack, 60) > 6,
    `estorbo ${estorboDelRival(crack, 60)} con promedio ${promedioDelRival(crack)}`);

  // Jugando mal, se lo gana el jugador.
  let flojo = nuevo();
  for (let i = 0; i < 4; i++) flojo = anotarFechaDelRival(flojo, { nota: 5.2, goles: 0, asistencias: 0 });
  ok('si le va mal, deja de ser problema', estorboDelRival(flojo, 60) < 0,
    `estorbo ${estorboDelRival(flojo, 60)} con promedio ${promedioDelRival(flojo)}`);

  // Y con tope, para que un goleador en racha no te borre del club.
  let imparable = nuevo();
  for (let i = 0; i < 12; i++) imparable = anotarFechaDelRival(imparable, { nota: 9.5, goles: 2, asistencias: 1 });
  ok('el peso del rival tiene tope', estorboDelRival(imparable, 90) <= PESO_MAXIMO_DEL_RIVAL,
    `estorbo ${estorboDelRival(imparable, 90)}`);

  // Que de verdad juegue: mil fechas de un jugador de 85 tienen que dar goles y notas razonables.
  let acumulado: RivalDePuesto = { ...nuevo(), nivel: 85 };
  for (let i = 0; i < 1000; i++) acumulado = anotarFechaDelRival(acumulado, jugarFechaDelRival(85));
  const prom = promedioDelRival(acumulado) ?? 0;
  ok('un rival de 85 promedia como un buen jugador', prom > 6.2 && prom < 8.2, `promedio ${prom}`);
  ok('y marca alguna vez', (acumulado.goles ?? 0) > 50, `${acumulado.goles} goles en 1000 fechas`);

  // Y que se pueda contar lo que hizo, que es la mitad del punto.
  ok('la cronica nombra al rival', cronicaDelRival(nuevo(), { nota: 8.1, goles: 2, asistencias: 0 }).includes('Sanabria'));
}

// --- CUANDO EL CLUB SE CANSA DE VOS ------------------------------------------------------------
//
// Un traspaso siempre fue un premio, asi que una mala racha no costaba nada mas que unos partidos en
// el banco. Esta es la otra puerta: si rendis mal y el que te pelea el puesto te paso por arriba, el
// club te pone en la lista y despues te vende.
//
// Lo que se comprueba es que haga falta LAS TRES COSAS a la vez. Con dos de tres no puede pasar, o
// terminaria echando a un crack por una mala racha de tres partidos.
{
  const caso = (o: Partial<Parameters<typeof elClubSeCansoDeVos>[0]>) => elClubSeCansoDeVos({
    promedioDeForma: 5.4, estorboDelRival: 12, prestigio: 40, reputacionDelClub: 4, ...o,
  });

  ok('con las tres razones, el club se cansa', caso({}));
  ok('jugando bien no te ponen en la lista', !caso({ promedioDeForma: 7.2 }));
  ok('sin nadie peleandote el puesto tampoco', !caso({ estorboDelRival: 0 }));
  ok('y a un consagrado no lo tocan', !caso({ prestigio: 90 }));
  ok('sin haber jugado nunca, tampoco', !caso({ promedioDeForma: null }));

  // Y que se pueda revertir: un juego que condena sin salida deja de ser un juego.
  ok('jugando bien te ganas quedarte', teGanasteQuedarte(7.4, 0));
  ok('pero no alcanza con una buena si el rival sigue arriba', !teGanasteQuedarte(7.4, 12));

  // El aviso cambia segun la temporada: la segunda vez es la ultima.
  ok('la primera vez avisa que hay tiempo', avisoDeLista({ desdeSemana: 1, temporadas: 0 }, 'Junior').includes('Tenés'));
  ok('la segunda avisa que te venden', avisoDeLista({ desdeSemana: 1, temporadas: 1 }, 'Junior').includes('venden'));
}

// --- LO QUE EL CLUB ESPERA SEGUN LO QUE VALES --------------------------------------------------
//
// La vara de titularidad era solo la reputacion del club, asi que dentro del mismo plantel el pibe
// de inferiores y el fichaje caro tenian exactamente la misma exigencia. Ahora no.
{
  const PLANTEL = 500_000_000;   // un plantel grande

  ok('el fichaje caro tiene mas exigencia', exigenciaPorLoQueValés(50_000_000, PLANTEL) === EXIGENCIA_MAXIMA,
    `${exigenciaPorLoQueValés(50_000_000, PLANTEL)} con el 10% del plantel`);
  ok('el pibe barato tiene credito', exigenciaPorLoQueValés(2_000_000, PLANTEL) === -CREDITO_MAXIMO,
    `${exigenciaPorLoQueValés(2_000_000, PLANTEL)} con el 0.4% del plantel`);
  ok('uno del monton no suma ni resta', exigenciaPorLoQueValés(20_000_000, PLANTEL) === 0,
    `${exigenciaPorLoQueValés(20_000_000, PLANTEL)} con el 4% del plantel`);
  // Y que no reviente con datos que faltan: un club sin valor cargado no puede exigir nada.
  ok('sin valor de plantel no exige nada', exigenciaPorLoQueValés(20_000_000, 0) === 0);
}

// --- MODO HARDCORE: se crece jugando, no entrenando --------------------------------------------
//
// La regla reemplaza a la ventana de entrenamiento, asi que si se equivoca no hay otra forma de
// mejorar: es la unica puerta. Se comprueban las cuatro reglas por separado.
{
  const base = { edad: 22, partidosJugados: 30, promedioDeNota: 7.0, nivelDelPlantel: 70, nivelPropio: 68 };
  const con = (o: Partial<typeof base>) => crecimientoDeLaTemporada({ ...base, ...o });

  // 1. El que no juega no mejora.
  ok('sin partidos no se crece', con({ partidosJugados: PARTIDOS_MINIMOS - 1 }) <= 0,
    `${con({ partidosJugados: PARTIDOS_MINIMOS - 1 })}`);
  ok('y de veterano sin jugar, se pierde', con({ partidosJugados: 2, edad: 32 }) < 0);

  // 2. Rendir manda.
  ok('una buena temporada hace crecer', con({ promedioDeNota: 7.4 }) > 0, `${con({ promedioDeNota: 7.4 })}`);
  ok('una mala temporada hace bajar', con({ promedioDeNota: 5.4 }) < 0, `${con({ promedioDeNota: 5.4 })}`);

  // 3. Los companeros. Es lo que hace que el club importe y no solo por los titulos.
  const enGrande = con({ nivelDelPlantel: 84 });
  const enChico = con({ nivelDelPlantel: 58 });
  ok('un plantel mejor te tira para arriba', enGrande > enChico, `${enGrande} contra ${enChico}`);

  // 4. La edad le gana a todo al final.
  ok('a los 33 se baja aunque rindas', con({ edad: 33, promedioDeNota: 7.0 }) < con({ edad: 20, promedioDeNota: 7.0 }));
  ok('un pibe crece mas que un consagrado', con({ edad: 19 }) > con({ edad: 27 }));

  // Y el tope, para que ninguna temporada convierta a un jugador en otro.
  ok('ninguna temporada sube mas de 3.5', con({ promedioDeNota: 10, nivelDelPlantel: 99, edad: 18 }) <= 3.5);
  ok('ni baja mas de 4', con({ promedioDeNota: 3.5, nivelDelPlantel: 40, edad: 35 }) >= -4);

  // Y que se le cuente al jugador que paso, porque sin entrenamiento es lo unico que explica su curva.
  ok('la temporada se explica', informeDeLaTemporada(con({}), { ...base }).length > 20);
}

// --- EL APODO: te lo gana la cancha, no lo elegis ----------------------------------------------
//
// El juego ya sabia con que atributo resolves las jugadas y nunca lo decia. Lo que se comprueba es
// que el apodo salga de lo que HICISTE y que no salga cuando todavia no hay con que.
{
  const base = { partidos: 60, goles: 10, asistencias: 8, amarillas: 5, rojas: 0, posicion: 'MC' as string,
    jugadas: { pase: 40, regate: 10, tiro: 10, ritmo: 10, defensa: 5, fisico: 5 } };
  const con = (o: Partial<typeof base>) => apodoDe({ ...base, ...o });

  ok('sin partidos no hay apodo', con({ partidos: PARTIDOS_PARA_APODO - 1 }) === null);
  ok('el que resuelve con pase es El Profesor', con({})?.apodo === 'El Profesor', con({})?.apodo ?? 'ninguno');

  // El goleador tiene su propia version del mismo apodo: la marca es la misma, el peso no.
  const arquitecto = con({ goles: 30 });
  ok('y si ademas hace goles, El Arquitecto', arquitecto?.apodo === 'El Arquitecto', arquitecto?.apodo ?? 'ninguno');

  // Lo excepcional manda sobre lo caracteristico.
  const maquina = con({ goles: 55 });
  ok('gol por partido gana a todo lo demas', maquina?.apodo === 'La Máquina', maquina?.apodo ?? 'ninguno');
  const carnicero = con({ amarillas: 40, rojas: 4 });
  ok('el que rompe todo tiene el suyo', carnicero?.apodo === 'El Carnicero', carnicero?.apodo ?? 'ninguno');

  // Y si nada te define, no se inventa: un apodo tibio es peor que ninguno.
  const parejo = con({ jugadas: { pase: 12, regate: 12, tiro: 12, ritmo: 12, defensa: 12, fisico: 12 }, goles: 5, asistencias: 3, amarillas: 2 });
  ok('sin nada que te defina, no hay apodo', parejo === null, parejo?.apodo ?? 'ninguno');

  // Y siempre viene con el porque: sin eso es un adorno.
  ok('el apodo explica que hiciste', (con({})?.porque ?? '').length > 15);
}

// --- LA LESION QUE TE CAMBIA EL ESTILO ---------------------------------------------------------
//
// Lo que se cuida aca no es que la secuela funcione: es que sea RARA. La primera version dejaba una
// cada dos temporadas porque el juego sorteaba el tipo de lesion uniforme, y eso convertia un
// momento de carrera en un tramite.
{
  const atributos = { ritmo: 70, regate: 68, tiro: 66, pase: 64, defensa: 55, fisico: 72 };
  const base = { tipo: 'fractura' as const, semanasAfuera: 12, edad: 29, posicion: 'MC',
    atributos, semanaActual: 200, historial: [] as { type: any; week: number }[] };
  const con = (o: any) => ({ ...base, ...o });

  // 1. QUE LESION PUEDE DEJAR MARCA, Y CUAL NO.
  ok('un golpe nunca deja marca', riesgoDeSecuela(con({ tipo: 'golpe', semanasAfuera: 20 })) === 0);
  ok('un esguince corto tampoco', riesgoDeSecuela(con({ tipo: 'ligamentos', semanasAfuera: 5 })) === 0);
  ok('una muscular suelta tampoco', riesgoDeSecuela(con({ tipo: 'muscular', semanasAfuera: 4 })) === 0);
  ok('una fractura larga si arriesga', riesgoDeSecuela(con({})) > 0);

  // 2. Y AUN ASI ES POCO PROBABLE. Este es el caso que corrige el error de la primera version.
  const rMax = Math.max(
    riesgoDeSecuela(con({ semanasAfuera: 30, edad: 35 })),
    riesgoDeSecuela(con({ tipo: 'ligamentos', semanasAfuera: 30, edad: 35 })));
  ok('ni la peor lesion deja marca mas de la mitad de las veces', rMax <= RIESGO_MAXIMO, rMax.toFixed(2));
  ok('la fractura joven es un riesgo chico', riesgoDeSecuela(con({ edad: 21, semanasAfuera: 8 })) <= 0.1);
  ok('la misma lesion de viejo pesa mas',
    riesgoDeSecuela(con({ edad: 33 })) > riesgoDeSecuela(con({ edad: 21 })));

  // 3. EL DADO MANDA: mismo dato, dos resultados.
  ok('con el dado en contra no pasa nada', secuelaDeLaLesion(con({}), 0.99) === null);
  const sec = secuelaDeLaLesion(con({}), 0.001);
  ok('con el dado a favor si', sec !== null);

  // 4. SE PIERDE Y SE GANA, y se pierde mas de lo que se gana.
  if (sec) {
    const vals = Object.values(sec.cambios) as number[];
    const perdido = vals.filter(v => v < 0).reduce((a, b) => a + b, 0);
    const ganado = vals.filter(v => v > 0).reduce((a, b) => a + b, 0);
    ok('la lesion se lleva algo', perdido < 0, String(perdido));
    ok('y algo te deja', ganado > 0, String(ganado));
    ok('romperse nunca conviene', ganado < -perdido, `${ganado} contra ${-perdido}`);
    ok('la fractura se lleva el fisico', (sec.cambios.fisico ?? 0) < 0);
    ok('y el relato explica que paso', sec.relato.length > 40);
  }

  // 5. LO QUE PERDES lo decide la lesion; LO QUE GANAS, el puesto.
  const delantero = secuelaDeLaLesion(con({ posicion: 'DC' }), 0.001);
  const defensor = secuelaDeLaLesion(con({ posicion: 'DEF' }), 0.001);
  ok('el delantero afina la definicion', (delantero?.cambios.tiro ?? 0) > 0);
  ok('el defensor afina la marca', (defensor?.cambios.defensa ?? 0) > 0);
  ok('los dos pierden lo mismo, porque es la misma lesion',
    delantero?.cambios.fisico === defensor?.cambios.fisico);

  // 6. EL PISO SE RESPETA, y si no habia nada que perder no hay nada que ganar.
  const enElPiso = secuelaDeLaLesion(con({
    atributos: { ...atributos, fisico: PISO_DE_ATRIBUTO, ritmo: PISO_DE_ATRIBUTO } }), 0.001);
  ok('sin nada que perder no hay secuela', enElPiso === null);

  // 7. LA MUSCULAR CRONICA: no es la lesion, es la acumulacion.
  const dosPrevias = [{ type: 'muscular', week: 180 }, { type: 'muscular', week: 195 }];
  ok('la tercera muscular de un veterano si cuenta',
    riesgoDeSecuela(con({ tipo: 'muscular', semanasAfuera: 3, edad: 30, historial: dosPrevias })) > 0);
  ok('pero la tercera de un pibe no',
    riesgoDeSecuela(con({ tipo: 'muscular', semanasAfuera: 3, edad: 23, historial: dosPrevias })) === 0);
  ok('y la segunda tampoco',
    riesgoDeSecuela(con({ tipo: 'muscular', semanasAfuera: 3, edad: 30, historial: [{ type: 'muscular', week: 195 }] })) === 0);

  // Y LA VENTANA: dos musculares viejas no te hacen cronico. Es lo que atrapo el banco de pruebas
  // -- contando toda la carrera, un veterano se llevaba una secuela por temporada.
  const viejas = [{ type: 'muscular', week: 10 }, { type: 'muscular', week: 30 }];
  ok('las musculares de hace cinco anios no cuentan',
    riesgoDeSecuela(con({ tipo: 'muscular', semanasAfuera: 3, edad: 30, historial: viejas })) === 0);
  ok('las de esta temporada si',
    riesgoDeSecuela(con({ tipo: 'muscular', semanasAfuera: 3, edad: 30, historial: dosPrevias })) > 0);
}

// --- EL CATALOGO DE LESIONES: que las graves sean raras -----------------------------------------
{
  const pesos = TIPOS_DE_LESION.reduce((a, t) => a + t.peso, 0);
  ok('los pesos del sorteo suman 1', Math.abs(pesos - 1) < 0.001, pesos.toFixed(3));

  // Diez mil sorteos con dados parejos: la fractura tiene que ser rarisima y el golpe lo mas comun.
  const cuenta: Record<string, number> = {};
  for (let i = 0; i < 10000; i++) {
    const t = sortearTipoDeLesion(i / 10000);
    cuenta[t.id] = (cuenta[t.id] ?? 0) + 1;
  }
  ok('la fractura es menos del 6% de las lesiones', cuenta.fractura / 10000 < 0.06,
    `${((cuenta.fractura / 10000) * 100).toFixed(1)}%`);
  ok('el golpe es la mas comun', cuenta.golpe > cuenta.muscular);

  // EL TOPE DE FATIGA. Para tu propio club todos los pasos son dia de partido, asi que el contador
  // crecia toda la temporada: al partido 20 el riesgo por partido era 32%.
  ok('jugar cansado pesa', riesgoDeLesion(4) > riesgoDeLesion(0));
  ok('pero tiene techo', riesgoDeLesion(40) === riesgoDeLesion(4));
  ok('y el techo deja el riesgo lejos de lo seguro', riesgoDeLesion(40) <= 0.09,
    `${(riesgoDeLesion(40) * 100).toFixed(1)}%`);
}

// --- EL CLUB QUE TE FORMO -----------------------------------------------------------------------
//
// La unica oferta del mercado que no mira lo que valés. Lo que se cuida es que no se abra antes de
// tiempo: a los 24 nadie te llama para volver a casa, te quieren en Europa.
{
  const h = (clubId: string, n: number) => ({ seasonNum: n, clubId, clubName: clubId, goles: 0,
    asistencias: 0, partidos: 30, titulo: '' });
  const perfil = (edad: number, actual: string, hist: string[]) => ({
    age: edad, currentClubId: actual,
    seasonHistory: hist.map((c, i) => h(c, i + 1)),
  });

  const carrera = perfil(34, 'real_madrid', ['junior', 'junior', 'porto', 'real_madrid']);
  ok('el club que te formo es el primero de todos', clubQueTeFormo(carrera) === 'junior');
  ok('y se sabe cuantas temporadas jugaste ahi', temporadasEnLaCasa(carrera) === 2);
  ok('a los 34 te llaman de vuelta', teLlamaLaCasa(carrera, 'junior'));
  ok('pero solo ellos', !teLlamaLaCasa(carrera, 'porto'));

  const pibe = perfil(EDAD_DEL_LLAMADO - 1, 'real_madrid', ['junior', 'porto', 'real_madrid']);
  ok('un ano antes todavia no', !teLlamaLaCasa(pibe, 'junior'));

  // Si ya estas en casa no hay nada que llamar: es el caso que dejaria una oferta de tu propio club.
  const enCasa = perfil(36, 'junior', ['junior', 'porto', 'junior']);
  ok('si ya volviste, no te vuelven a llamar', !teLlamaLaCasa(enCasa, 'junior'));

  // Y una carrera que todavia no cerro ninguna temporada no tiene club que la formara.
  ok('sin temporadas cerradas no hay casa', clubQueTeFormo({ seasonHistory: [] }) === null);
}

// --- LA HEMEROTECA: la prensa se acuerda ---------------------------------------------------------
//
// El riesgo de esta mecanica es que hable de mas: que le invente al jugador una promesa que no
// hizo. Por eso lo que se comprueba es cuando se CALLA, no cuando habla.
{
  const dicho = (texto: string, saldo: number, semana: number, clubId = 'junior') =>
    ({ texto, saldo, semana, clubId, clubName: clubId });
  const hoy = (o: any) => ({ semana: 100, clubId: 'junior', clubName: 'junior',
    enLaLista: false, ganasteTitulo: false, ...o });

  // 1. QUE SE GUARDA. Solo lo fuerte: una frase tibia no envejece mal porque no prometia nada.
  const tibia = guardarDeclaracion([], dicho('Vamos partido a partido', SALDO_PARA_QUEDAR_GUARDADA - 1, 10));
  ok('una frase tibia no queda en el archivo', tibia.length === 0);
  const fuerte = guardarDeclaracion([], dicho('Salimos campeones seguro', 12, 10));
  ok('una declaracion fuerte si', fuerte.length === 1);

  // Y la memoria de la prensa es corta.
  let muchas: any[] = [];
  for (let i = 0; i < CUANTAS_SE_GUARDAN + 5; i++) muchas = guardarDeclaracion(muchas, dicho(`frase ${i}`, 10, i));
  ok('el archivo no crece para siempre', muchas.length === CUANTAS_SE_GUARDAN, String(muchas.length));
  ok('y se queda con lo reciente', muchas[muchas.length - 1].texto === `frase ${CUANTAS_SE_GUARDAN + 4}`);

  // 2. CUANDO SE CALLA. Esto es lo importante: sin contraste, el archivo no se abre.
  ok('sin nada guardado no hay cita', laHemerotecaTeRecuerda([], hoy({})) === null);
  const reciente = [dicho('Salimos campeones seguro', 12, 100 - (PASOS_PARA_QUE_ENVEJEZCA - 1))];
  ok('una frase de ayer no es material de archivo', laHemerotecaTeRecuerda(reciente, hoy({})) === null);
  const vieja = [dicho('Salimos campeones seguro', 12, 20)];
  ok('y una vieja sin contraste tampoco', laHemerotecaTeRecuerda(vieja, hoy({})) === null);

  // 3. CUANDO SI. Las tres situaciones, y su tono.
  const enLista = laHemerotecaTeRecuerda(vieja, hoy({ enLaLista: true }));
  ok('en la lista, el archivo se abre', enLista !== null);
  ok('y no es a favor', enLista?.aFavor === false);
  ok('la cita va literal', enLista?.declaracion.texto === 'Salimos campeones seguro');

  const campeon = laHemerotecaTeRecuerda(vieja, hoy({ ganasteTitulo: true }));
  ok('campeon: el archivo tambien juega a favor', campeon?.aFavor === true);

  const otroClub = laHemerotecaTeRecuerda([dicho('Me quedo toda mi carrera', 12, 20, 'porto')],
    hoy({ clubId: 'junior' }));
  ok('cambiar de club abre el archivo', otroClub !== null);
  ok('y nombra los dos clubes', (otroClub?.marco ?? '').includes('porto') && (otroClub?.marco ?? '').includes('junior'));

  // 4. LA PRENSA SACA LA MAS FUERTE, no la mas vieja.
  const dos = [dicho('Una frase floja', 7, 10), dicho('LA frase', 20, 30)];
  ok('sale la que mas ruido hizo', laHemerotecaTeRecuerda(dos, hoy({ enLaLista: true }))?.declaracion.texto === 'LA frase');
}

console.log(fallas === 0 ? `\nLos ${corridos} casos pasan.` : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
