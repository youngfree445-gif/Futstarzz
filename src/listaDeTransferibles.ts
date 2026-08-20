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

/**
 * LO QUE EL CLUB ESPERA DE VOS SEGÚN LO QUE VALÉS PARA ÉL.
 *
 * Devuelve puntos que se suman al umbral de titularidad, igual que la forma y el rival.
 *
 * La vara de titularidad era sólo la reputación del club: un club grande pide más, uno chico pide
 * menos, y listo. Pero dentro del mismo club no es lo mismo el pibe que subió de las inferiores que
 * el fichaje caro: al caro se le exige desde el primer día, y si no rinde el ruido llega antes.
 *
 * Se mide con tu valor de mercado contra el del plantel. Si valés mucho más que el promedio del
 * club, sos la apuesta -- y a la apuesta se le pide que funcione.
 *
 * El efecto es chico y va para los dos lados: hasta 8 puntos de exigencia extra si sos la figura
 * cara, y hasta 5 de crédito si sos el pibe barato al que todavía nadie le reclama nada.
 */
export const EXIGENCIA_MAXIMA = 8;
export const CREDITO_MAXIMO = 5;

export function exigenciaPorLoQueValés(valorDelJugador: number, valorDelPlantel: number): number {
  if (!valorDelPlantel || valorDelPlantel <= 0) return 0;
  // Cuánto pesás vos dentro del plantel. Un plantel tiene ~25 jugadores, así que la parte "normal"
  // de cada uno es 1/25 = 4%. El doble de eso ya es ser la apuesta del club.
  const peso = valorDelJugador / valorDelPlantel;
  if (peso >= 0.08) return EXIGENCIA_MAXIMA;
  if (peso <= 0.01) return -CREDITO_MAXIMO;
  if (peso >= 0.04) {
    // De 4% a 8%: de cero a la exigencia máxima.
    return Math.round(EXIGENCIA_MAXIMA * ((peso - 0.04) / 0.04));
  }
  // De 1% a 4%: del crédito máximo a cero.
  return -Math.round(CREDITO_MAXIMO * (1 - (peso - 0.01) / 0.03));
}

/** Lo que se le dice al jugador cuando la exigencia lo está apretando. */
export function avisoDeExigencia(puntos: number): string | null {
  if (puntos >= 6) return 'Sos la apuesta cara del club: acá no alcanza con cumplir.';
  if (puntos <= -4) return 'Nadie te reclama nada todavía: sos el pibe de la casa y tenés margen.';
  return null;
}
