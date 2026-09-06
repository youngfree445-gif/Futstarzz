// LAS JUGADAS SUELTAS DEL RELATO, y por qué el arquero necesita las suyas.
//
// ---------------------------------------------------------------------------------------------
// EL BUG QUE LAS SACÓ DE MatchSimulator
// ---------------------------------------------------------------------------------------------
//
// Entre decisión y decisión, el relato tira jugadas de ambiente escritas EN SEGUNDA PERSONA -- "te
// desmarcas por la banda", "presionas la salida del central". Estaban todas en una sola lista, sin
// mirar de qué juega el que las lee.
//
// Al arquero le tocaban igual. Reportado tal cual: "el arquero a veces trata de hacer gol". Se leía
// que se escapaba solo contra el portero, que centraba desde la banda, y -- lo más absurdo --
// "¡Atajadón de nuestro portero!" cuando el portero era él.
//
// ---------------------------------------------------------------------------------------------
// TRES BOLSAS, NO UNA
// ---------------------------------------------------------------------------------------------
//
//   COMUNES     lo que le pasa al partido y no a vos: un choque en el medio, un bache táctico, el
//               técnico mandando a calentar. Sirven para cualquier puesto porque no te nombran
//               haciendo nada.
//   DE_CAMPO    las que hay que estar en el campo de juego para protagonizar. Las tres posiciones
//               de campo comparten bolsa: un defensor sube a un córner y presiona una salida, así
//               que separarlas más sería inventar una diferencia que el relato no necesita.
//   ARQUERO     las suyas, que no son menos: salir a cortar un centro, achicar un mano a mano,
//               ordenar la barrera, sostener la pelota para enfriar el partido.
//
// El arquero NO recibe las de campo. No es una cuestión de gusto: son líneas que describen algo que
// no pasó, y el jugador las lee como un bug -- que es exactamente lo que pasó.

import type { Position } from './types';

/** Lo que el relato necesita saber del partido para nombrar a alguien. */
export interface ContextoDelRelato {
  /** Un compañero, para las jugadas en las que aparece otro. */
  companero: string;
  /** Un rival cualquiera. Null cuando no se conoce el plantel rival. */
  rival: string | null;
  /** El delantero rival, cuando se lo conoce. */
  atacanteRival: string | null;
}

const COMUNES = (c: ContextoDelRelato): string[] => [
  'Fuerte choque en el medio campo. El árbitro deja seguir la jugada aplicando la ley de la ventaja.',
  'El equipo rival domina la posesión tocando de lado a lado, el partido entra en un bache táctico.',
  'El técnico manda a calentar a los suplentes. Se siente la tensión en los banquillos.',
  `¡UFFF! Remate de ${c.companero} que pasa rozando el poste derecho. Casi se abre el marcador.`,
];

const DE_CAMPO = (c: ContextoDelRelato): string[] => [
  `Te desmarcas por la banda y recibes de ${c.companero}, intentas centrar pero el balón rebota. Córner.`,
  'Presionas la salida del central, forzando un error de despeje. La tribuna aplaude tu entrega.',
  'Recibes una falta táctica dura en tres cuartos de cancha para cortar tu avance. Tiro libre peligroso.',
  '¡Atajadón de nuestro portero! Voló para sacar un cabezazo rival que tenía sello de gol.',
  'Tocas rápido y de primera intención para oxigenar el juego. Buen movimiento de tu parte.',
  '¡Posición adelantada! Te habías escapado solo contra el portero pero el juez de línea levantó la bandera.',
  ...(c.rival ? [
    `${c.rival} te gana la espalda y obliga a tu defensa a cerrar de urgencia.`,
    `Duelo áspero con ${c.rival} en la mitad de la cancha. Los dos se miran, ninguno baja la pierna.`,
    `${c.rival} pide la pelota entre líneas y desordena el bloque. Hay que salir a taparlo.`,
    `Le robas un balón limpio a ${c.rival} y la tribuna se levanta a aplaudirte.`,
    `¡Aviso! Remate cruzado de ${c.atacanteRival ?? c.rival} que se va apenas desviado del segundo palo.`,
  ] : []),
];

const ARQUERO = (c: ContextoDelRelato): string[] => [
  'Sales con los puños a cortar un centro llovido y despejas lejos del área. Bien resuelto.',
  'Achicas el ángulo en la salida y el remate se te va por encima del travesaño.',
  'Ordenas la barrera a los gritos hasta dejarla donde la querías. El tiro libre termina en la tribuna.',
  'Retienes la pelota con las dos manos más de la cuenta para enfriar el partido. La tribuna te lo festeja.',
  'Sacas rápido con la mano y arrancas un contragolpe antes de que el rival vuelva a acomodarse.',
  `Le ganas de pies a un balón largo fuera del área y despejas como un líbero. ${c.companero} te aplaude.`,
  'Un balón que picaba raro te obliga a mandarla al córner con lo justo. Susto y nada más.',
  ...(c.rival ? [
    `${c.rival} te la deja picando en el área chica y la achicas justo antes de que llegue.`,
    `Aguantas el mano a mano de ${c.atacanteRival ?? c.rival} sin tirarte y se la terminas sacando.`,
    `${c.rival} patea desde afuera buscando sorprenderte y la mandas al córner sin dudar.`,
  ] : []),
];

/**
 * Las jugadas que puede narrar el relato para este puesto.
 *
 * Siempre incluye las comunes: sin ellas, un partido de arquero tendría siete líneas posibles y se
 * repetirían tres veces por tiempo.
 */
export function jugadasDelRelato(puesto: Position, contexto: ContextoDelRelato): string[] {
  return [
    ...COMUNES(contexto),
    ...(puesto === 'Arquero' ? ARQUERO(contexto) : DE_CAMPO(contexto)),
  ];
}

/**
 * Las faltas de ambiente, que tampoco son iguales para todos.
 *
 * Un arquero comete faltas -- se lleva puesto a un delantero al salir, agarra afuera del área --,
 * pero no frena un contragolpe en la mitad de la cancha, porque no está ahí.
 */
export function faltasDelRelato(puesto: Position): string[] {
  if (puesto === 'Arquero') {
    return [
      'Sales a destiempo y te llevas puesto al delantero antes de llegar al balón.',
      'Te estiras fuera del área y la tocas con la mano. El árbitro te la señala.',
      'Chocas con un rival en la disputa de un centro y los dos quedan en el piso.',
      'Pierdes tiempo con el saque de meta una vez más y el árbitro ya te viene mirando.',
    ];
  }
  return [
    'Llegas tarde a la disputa y le cortas el paso con la pierna extendida.',
    'Frenas un contragolpe peligroso con una falta táctica sin mucha vuelta.',
    'Chocas fuerte disputando una pelota dividida en el mediocampo.',
    'Te tiras al piso a cortar un centro y terminas llevándote puesto al rival.',
  ];
}
