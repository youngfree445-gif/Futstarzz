// EL ENTORNO QUE TE ARRASTRA: los amigos del barrio, y las dos formas de que te salga caro.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// Pedido, con estas palabras: "amigos del barrio que te piden plata y fiestas. Cortar con ellos
// cuesta salud mental; no cortar, físico."
//
// La barra `entorno` ya existía y hasta tenía el comentario que decía para qué era -- "mide lo que
// el fútbol te va costando" --, pero LO ÚNICO que la movía era el desgaste automático de fin de
// temporada y el botón de ir a visitarlos. O sea: bajaba sola y se recargaba pagando. Eso no es una
// relación, es un tanque de nafta.
//
// Lo que faltaba son las DECISIONES, y sobre todo que ninguna sea gratis.
//
// ---------------------------------------------------------------------------------------------
// LAS TRES MONEDAS, Y POR QUÉ SON ÉSAS
// ---------------------------------------------------------------------------------------------
//
//   . DARLES lo que piden cuesta PLATA y ENERGÍA -- el cuerpo, que es lo que dijo el usuario --, y
//     sostiene el entorno arriba. NO toca la salud mental de forma directa: la primera versión le
//     sumaba 3 por pedido y medido daban +111 en diez temporadas, o sea una fuente gratis de cabeza
//     que dejaba al bajón anímico sin poder existir. Lo que la cabeza gana con un entorno alto ya
//     lo contesta ajustePorEntorno, y contestarlo dos veces es de donde salen siempre estos bugs.
//   . NEGARSE es gratis hoy y caro después: baja el entorno, y con el entorno bajo cada golpe
//     anímico pega un 25% más fuerte (ver ajustePorEntorno en App.tsx). No es un castigo inmediato
//     que se pueda leer como injusto: es una red que se va deshilachando.
//   . CORTAR con el grupo es la salida definitiva, y cuesta SALUD MENTAL de una vez. Después no
//     vuelven a aparecer nunca.
//
// La medición de partida decía que la energía de una carrera normal TERMINA EN 5, o sea en el piso
// (docs/MEDICION_DE_PARTIDA.md). Por eso el costo físico de estos eventos es chico y el peso real
// está en el capital y en el entorno: cobrar en una moneda que el jugador ya no tiene no se siente.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ LA FRECUENCIA DEPENDE DE EN QUÉ MOMENTO ESTÁS
// ---------------------------------------------------------------------------------------------
//
// Es lo que separa esto de un impuesto aleatorio. Al pibe que acaba de salir de la nada le golpean
// la puerta seguido; al consagrado de diez años ya no, porque los que quedaron son los que iban a
// quedar. Si la chance fuera fija, a la quinta temporada sería ruido de fondo y el jugador
// aprendería a apretar el mismo botón sin leer.

/** Los efectos que un evento puede aplicar. Es el shape de DecisionCenter más las dos barras nuevas. */
export interface EfectosDelEntorno {
  prestige: number;
  fans: number;
  energy: number;
  capital: number;
  entorno?: number;
  mentalHealth?: number;
  /** De qué mecánica salió. Marcado, no deducido de los números: ver el mismo campo en elHater.ts. */
  origen?: 'entorno';
}

export interface EventoDelEntorno {
  title: string;
  description: string;
  choices: { text: string; cost: number; outcome: string; effects: EfectosDelEntorno }[];
}

/** Lo que cuesta cortar, de una vez y para siempre. */
export const CORTAR_SALUD_MENTAL = 18;
export const CORTAR_ENTORNO = 25;
/** A partir de cuántos pedidos aparece la opción de cortar. Al primero todavía no hay historia. */
export const EVENTOS_ANTES_DE_PODER_CORTAR = 2;

/**
 * Cada cuánto te golpean la puerta.
 *
 * Los tramos van por partidos históricos y no por temporadas porque es el único contador que no
 * depende de cómo se cuente una temporada: en Colombia y Argentina el año trae dos torneos.
 */
export function chanceDeEventoDelEntorno(
  partidosHistoricos: number,
  cortoConElGrupo: boolean,
): number {
  if (cortoConElGrupo) return 0;
  if (partidosHistoricos < 40) return 0.15;
  if (partidosHistoricos < 120) return 0.10;
  if (partidosHistoricos < 250) return 0.05;
  return 0.02;
}

interface Pedido {
  title: string;
  description: string;
  darles: { text: string; capital: number; energy: number; outcome: string };
  negarse: { text: string; outcome: string };
}

/** Lo que piden. Ninguno es una emergencia: son la vida de siempre, que sigue existiendo. */
const PEDIDOS: Pedido[] = [
  {
    title: 'El negocio del barrio',
    description: 'Tu amigo de toda la vida te llama: montó un local y le falta plata para abrir. Dice que en seis meses te devuelve todo. Vos sabés que no.',
    darles: {
      text: 'Prestarle la plata',
      capital: 12000,
      energy: 0,
      outcome: 'Le pasaste la plata sin firmar nada. No la vas a ver nunca y los dos lo saben.',
    },
    negarse: {
      text: 'Decirle que no',
      outcome: 'Se lo tomó bien por teléfono. Después te enteraste por otro que anduvo diciendo que te agrandaste.',
    },
  },
  {
    title: 'El asado del domingo',
    description: 'Están todos en la casa de siempre y te guardaron el lugar de la cabecera. Es a cuatro horas de acá y jugás el martes.',
    darles: {
      text: 'Ir igual',
      capital: 2000,
      energy: 14,
      outcome: 'Volviste a las tres de la mañana y con la cabeza en otro lado, en el bueno. El martes lo vas a sentir en las piernas.',
    },
    negarse: {
      text: 'Quedarte concentrando',
      outcome: 'Mandaste un audio explicando. Te contestaron que todo bien, y no te escribieron más en dos semanas.',
    },
  },
  {
    title: 'Las entradas de siempre',
    description: 'Son ocho, y las quieren en platea. Ya se lo dijeron a las novias.',
    darles: {
      text: 'Conseguir las ocho',
      capital: 4000,
      energy: 4,
      outcome: 'Moviste medio club para conseguirlas y las pagaste vos. En la tribuna se los vio contentos.',
    },
    negarse: {
      text: 'Conseguir dos y nada más',
      outcome: 'Les explicaste que el club da dos por jugador. Fueron dos. Los otros seis lo vieron por televisión y lo comentaron.',
    },
  },
  {
    title: 'La foto que no querías',
    description: 'Uno del grupo subió una historia tuya de hace tres años, en una fiesta, y ya la levantó una cuenta de chismes.',
    darles: {
      text: 'Pedirle que la baje y bancarlo igual',
      capital: 0,
      energy: 6,
      outcome: 'La bajó a las dos horas, pero ya estaba dando vueltas. Te pasaste la noche contestando mensajes.',
    },
    negarse: {
      text: 'Sacarlo del grupo',
      outcome: 'Lo sacaste sin decir nada. En el grupo se armó, y no todos estuvieron de tu lado.',
    },
  },
];

/** Lo que sube el entorno si les das lo que piden. */
const ENTORNO_SI_LES_DAS = 8;
/** Lo que baja si te negás. Igual que lo que sube: negarse siempre igual hunde la barra, porque el
 *  desgaste de fin de temporada corre aparte y nunca para. */
const ENTORNO_SI_TE_NEGAS = 8;

/**
 * El pedido que aparece hoy, ya con la forma que espera DecisionCenter.
 *
 * `dado` entra por parámetro, como todas las reglas con azar de este proyecto: es lo único que
 * permite probar "esto pasa una de cada tantas" sin depender de la suerte del que corre el test.
 *
 * La opción de CORTAR sólo aparece a partir del tercer pedido: al primero no hay historia todavía,
 * y ofrecer "cortá con tus amigos" la primera vez que te piden algo sería absurdo.
 */
export function eventoDelEntorno(dado: number, eventosVividos: number): EventoDelEntorno {
  const acotado = Math.max(0, Math.min(0.999999, dado));
  const pedido = PEDIDOS[Math.floor(acotado * PEDIDOS.length)];
  const choices: EventoDelEntorno['choices'] = [
    {
      text: pedido.darles.text,
      cost: pedido.darles.capital,
      outcome: pedido.darles.outcome,
      effects: {
        prestige: 0,
        fans: 0,
        energy: -pedido.darles.energy,
        capital: -pedido.darles.capital,
        entorno: ENTORNO_SI_LES_DAS,
        origen: 'entorno',
      },
    },
    {
      text: pedido.negarse.text,
      cost: 0,
      outcome: pedido.negarse.outcome,
      effects: { prestige: 0, fans: 0, energy: 0, capital: 0, entorno: -ENTORNO_SI_TE_NEGAS, origen: 'entorno' },
    },
  ];
  if (eventosVividos >= EVENTOS_ANTES_DE_PODER_CORTAR) {
    choices.push({
      text: 'Cortar con todos, de una vez',
      cost: 0,
      outcome: 'Cambiaste el número y no avisaste. No te van a volver a pedir nada. Tampoco te van a volver a llamar por otra cosa.',
      effects: {
        prestige: 0,
        fans: 0,
        energy: 0,
        capital: 0,
        entorno: -CORTAR_ENTORNO,
        mentalHealth: -CORTAR_SALUD_MENTAL,
        origen: 'entorno',
      },
    });
  }
  return { title: pedido.title, description: pedido.description, choices };
}

/**
 * ¿Esta elección fue la de cortar?
 *
 * Se reconoce por el EFECTO y no por el texto del botón: el texto es contenido y se puede reescribir
 * sin pensar, y si la detección colgara de él, cambiar una palabra dejaría al jugador sin la
 * consecuencia permanente y nadie se enteraría.
 */
export function esCortarConElGrupo(
  efectos: { entorno?: number; mentalHealth?: number },
): boolean {
  return efectos.mentalHealth === -CORTAR_SALUD_MENTAL && efectos.entorno === -CORTAR_ENTORNO;
}
