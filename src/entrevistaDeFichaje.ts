// LA ENTREVISTA DE PRESENTACIÓN: las tres preguntas del día que te fichan.
//
// ---------------------------------------------------------------------------------------------
// QUÉ ES Y POR QUÉ ES OBLIGATORIA
// ---------------------------------------------------------------------------------------------
//
// Un fichaje pasaba de "confirmar" a estar en el club nuevo sin una sola palabra tuya. En el fútbol
// no existe eso: firmás y te sientan frente a los micrófonos ese mismo día.
//
// Es obligatoria a propósito, y no por castigar: la presentación es el único momento en que hablás
// ANTES de haber jugado un partido en ese club. Lo que decís ahí es lo único que la hinchada tiene
// de vos hasta que ruede la pelota.
//
// ---------------------------------------------------------------------------------------------
// LO QUE DIGAS SE GUARDA (y ahí está lo bueno)
// ---------------------------------------------------------------------------------------------
//
// Las respuestas fuertes van a la hemeroteca (ver src/hemeroteca.ts), igual que las de la rueda de
// prensa. O sea que prometer el título en tu presentación puede volver dos temporadas después,
// cuando el club te ponga en la lista de transferibles y un periodista saque la cita.
//
// Eso convierte a las tres preguntas en algo más que un trámite: es la primera vez que podés
// hipotecar tu palabra en el club nuevo.
//
// ---------------------------------------------------------------------------------------------
// LAS TRES PREGUNTAS, Y POR QUÉ ESAS
// ---------------------------------------------------------------------------------------------
//
// Cada una tiene un dilema distinto, o serían tres veces la misma:
//
//   1. POR QUÉ TE FUISTE. Habla del club que dejás. Es la única donde podés quedar mal con gente
//      que hasta ayer te quería.
//   2. QUÉ PROMETÉS. Es la que hipoteca: cuanto más grande la promesa, más hinchada hoy y más peso
//      encima después.
//   3. QUÉ ESPERÁS DE VOS. Habla del vestuario nuevo, donde todavía no sos nadie.

import type { Club } from './types';

export interface OpcionDeEntrevista {
  texto: string;
  fans: number;
  prestigio: number;
  /** Lo que responde el periodista. */
  reaccion: string;
}

export interface PreguntaDeEntrevista {
  clave: string;
  medio: string;
  avatar: string;
  pregunta: string;
  opciones: OpcionDeEntrevista[];
}

/**
 * Las tres preguntas, ya con los nombres de los clubes puestos.
 *
 * `anterior` puede ser null: hay carreras que empiezan con un fichaje sin club previo.
 */
export function preguntasDeLaPresentacion(club: Club, anterior: Club | null): PreguntaDeEntrevista[] {
  return [
    // LA PRIMERA PREGUNTA CAMBIA ENTERA SI NO HAY CLUB ANTERIOR, respuestas incluidas.
    //
    // Al principio sólo cambiaba la pregunta y las respuestas usaban un texto de respaldo ("tu club
    // anterior"). O sea que en la primera firma de una carrera te ponía en la boca la frase "le voy
    // a estar agradecido a tu club anterior toda la vida", que es el marcador de posición leído en
    // voz alta. Lo agarró el validador en su primera corrida.
    anterior ? {
      clave: 'por_que_te_fuiste',
      medio: 'Radio Continental',
      avatar: '🎙️',
      pregunta: `Venís de ${anterior.name}, donde te querían. ¿Por qué te fuiste?`,
      opciones: [
        {
          texto: `${club.name} es un salto que no se rechaza. Cualquiera en mi lugar hacía lo mismo.`,
          fans: 6, prestigio: 3,
          reaccion: 'Sincero. En el vestuario les gusta el que no se hace el humilde de mentira.',
        },
        {
          texto: `Le voy a estar agradecido a ${anterior.name} toda la vida. Esto no es contra nadie.`,
          fans: 2, prestigio: 5,
          reaccion: 'Elegante. No se gana un titular con eso, pero no se pierde a nadie.',
        },
        {
          texto: 'Allá ya no me valoraban. Acá sí.',
          fans: 9, prestigio: -4,
          reaccion: 'Fuerte. La hinchada nueva lo festeja; la vieja no se lo va a olvidar.',
        },
      ],
    } : {
      clave: 'por_que_te_fuiste',
      medio: 'Radio Continental',
      avatar: '🎙️',
      pregunta: '¿Qué te decidió a firmar acá y no en otro lado?',
      opciones: [
        {
          texto: `${club.name} es un salto que no se rechaza. Cualquiera en mi lugar hacía lo mismo.`,
          fans: 6, prestigio: 3,
          reaccion: 'Sincero. En el vestuario les gusta el que no se hace el humilde de mentira.',
        },
        {
          texto: 'La cancha llena. Quiero saber qué se siente jugar con esa gente atrás.',
          fans: 2, prestigio: 5,
          reaccion: 'Elegante. No se gana un titular con eso, pero no se pierde a nadie.',
        },
        {
          texto: 'Que acá me van a hacer jugar. En otros lados me hacían esperar.',
          fans: 9, prestigio: -4,
          reaccion: 'Fuerte. La hinchada lo festeja; los que estaban antes que vos, no tanto.',
        },
      ],
    },
    {
      clave: 'que_prometes',
      medio: 'TyC Sports',
      avatar: '📺',
      pregunta: '¿Qué le prometés a la gente que hoy te está viendo?',
      opciones: [
        {
          texto: 'Que salimos campeones. Vine para eso y no vine a otra cosa.',
          fans: 14, prestigio: 2,
          reaccion: '¡Se paró la sala! Ojo con eso, que las promesas quedan escritas.',
        },
        {
          texto: 'Que voy a dejar todo en cada partido. Lo demás se verá.',
          fans: 5, prestigio: 4,
          reaccion: 'La respuesta de siempre, y por algo es la de siempre: nadie te la puede reprochar.',
        },
        {
          texto: 'No prometo nada. Prefiero que hablen de mí cuando haya jugado.',
          fans: -3, prestigio: 7,
          reaccion: 'Frío para la tribuna, pero el cuerpo técnico toma nota de eso.',
        },
      ],
    },
    {
      clave: 'que_esperas',
      medio: 'Olé',
      avatar: '📰',
      pregunta: 'Llegás a un vestuario armado. ¿Esperás ser titular desde el primer día?',
      opciones: [
        {
          texto: 'Sí. Si me trajeron es para jugar.',
          fans: 8, prestigio: -2,
          reaccion: 'Se anota. Y los que hoy son titulares también se lo anotan.',
        },
        {
          texto: 'Eso lo decide el técnico. Yo entreno y espero mi momento.',
          fans: 1, prestigio: 6,
          reaccion: 'El vestuario respira. Es lo que un plantel quiere escuchar del que llega.',
        },
        {
          texto: 'Vengo a competir con todos. El que esté mejor, que juegue.',
          fans: 5, prestigio: 3,
          reaccion: 'Bien resuelta: no se agacha y no pisa a nadie.',
        },
      ],
    },
  ];
}

/** El saldo de la entrevista: lo mismo que mide la rueda de prensa. */
export function saldoDe(o: OpcionDeEntrevista): number {
  return o.fans + o.prestigio;
}
