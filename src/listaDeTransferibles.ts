// Cuando el club se cansa de vos.
//
// EL PROBLEMA QUE RESUELVE. En el juego un traspaso siempre fue un premio: te llegan ofertas, elegís
// la mejor y te vas a un club más grande. Nunca podía ser lo contrario. Y como la carrera tampoco te
// podía echar de ningún lado, una mala racha no costaba nada más que unos partidos en el banco.
//
// Esto es la otra puerta. Si rendís mal el tiempo suficiente y el que te pelea el puesto te pasó por
// arriba, el club te pone en la lista de transferibles. Y si no lo revertís, te vende.
//
// DOS REGLAS DE DISEÑO, y las dos importan más que los números:
//
//   1. SE AVISA ANTES. El club no te vende de un día para el otro: primero te pone en la lista y te
//      lo dice. Una salida forzada sin aviso se lee como un castigo arbitrario; con aviso, es una
//      cuenta regresiva que se puede pelear, que es de lo que se trata.
//   2. SE PUEDE REVERTIR. Jugando bien salís de la lista. Un juego que te condena sin salida deja
//      de ser un juego -- y ademas seria falso: en el fútbol al que se recupera lo sacan de la lista.

export interface ListaDeTransferibles {
  /** Paso en que el club te puso en la lista. */
  desdeSemana: number;
  /** Cuántas temporadas seguidas llevás en la lista. A la segunda, te venden. */
  temporadas: number;
}

/** Cuántas fechas tenés para revertirlo antes de que el club escuche ofertas en serio. */
export const FECHAS_PARA_REVERTIR = 12;

/**
 * ¿El club tiene motivos para ponerte en la lista?
 *
 * Hacen falta las TRES cosas a la vez, y por eso no cae nunca de casualidad:
 *
 *   . venís jugando mal (promedio bajo en la ventana de forma)
 *   . el que te pelea el puesto te está ganando
 *   . y tu prestigio no alcanza para el club en el que estás
 *
 * Con dos de tres no pasa nada. Un crack en una mala racha no se vende; un suplente que rinde
 * cuando entra, tampoco.
 */
export function elClubSeCansoDeVos(opciones: {
  promedioDeForma: number | null;
  estorboDelRival: number;
  prestigio: number;
  reputacionDelClub: number;
}): boolean {
  const { promedioDeForma, estorboDelRival, prestigio, reputacionDelClub } = opciones;
  if (promedioDeForma == null) return false;               // todavía no jugaste nada
  if (promedioDeForma >= 6.0) return false;                // no venís mal
  if (estorboDelRival < 8) return false;                   // nadie te está ganando el puesto
  const vara = 25 + reputacionDelClub * 11;                // la misma vara de la titularidad
  return prestigio < vara;
}

/** ¿Ya te ganaste salir de la lista? */
export function teGanasteQuedarte(promedioDeForma: number | null, estorboDelRival: number): boolean {
  if (promedioDeForma == null) return false;
  return promedioDeForma >= 6.8 && estorboDelRival < 4;
}

export function avisoDeLista(lista: ListaDeTransferibles, club: string): string {
  if (lista.temporadas >= 1) {
    return `${club} te mantiene en la lista de transferibles. Si esto sigue así, la próxima ventana te venden.`;
  }
  return `${club} te puso en la lista de transferibles. Tenés lo que queda de temporada para cambiarlo.`;
}

export const AVISO_TE_QUEDAS = 'Te sacaron de la lista de transferibles: el DT volvió a confiar en vos.';
