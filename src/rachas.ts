// Las rachas de TU historia: "no le ganas a Nacional desde hace seis partidos".
//
// ---------------------------------------------------------------------------------------------
// DE DÓNDE SALEN, Y POR QUÉ ESO ES LO QUE LAS HACE VIABLES
// ---------------------------------------------------------------------------------------------
//
// La idea original era traer rachas reales de los clubes. No se puede: no existe esa base, habría
// que scrapear décadas y quedaría vieja al día siguiente.
//
// Pero el juego ya guarda tu historia entera. `datedResults` anota TODAS las fechas jugadas con su
// marcador, su rival y su competición -- incluidas las que el club resolvió sin vos, cuando no
// jugaste por fatiga o sanción. Y lo hace para los 549 clubes jugables, medido: ninguno se quedó
// sin calendario con fechas.
//
// Osea que las rachas salen de tu carrera. Cero datos externos, cero mantenimiento, y pesan más:
// es una racha que viviste, no una que leíste en una ficha.
//
// ---------------------------------------------------------------------------------------------
// LA REGLA DE QUÉ ES INTERESANTE
// ---------------------------------------------------------------------------------------------
//
// Una racha de dos partidos no es una racha, es el azar. Si se muestra cualquier cosa, la tarjeta
// del próximo partido se llena de ruido y se deja de leer -- que es peor que no tener rachas.
//
// Por eso cada tipo tiene un mínimo propio, y son distintos a propósito: tres derrotas seguidas
// pesan más que tres victorias (el jugador ya espera ganar), y no ganarle a UN rival pesa desde el
// segundo intento porque ese rival tiene nombre y cara.

import { DatedResult } from './types';

export type TonoDeRacha = 'buena' | 'mala' | 'neutra';

export interface Racha {
  /** Listo para pintar, en una línea. */
  texto: string;
  tono: TonoDeRacha;
  /** Cuántos partidos abarca. Con dos rachas compitiendo por el mismo lugar, gana la más larga. */
  largo: number;
}

/** Mínimos para que una racha valga la pena contarla. */
export const MINIMO_VICTORIAS = 3;
export const MINIMO_DERROTAS = 3;
export const MINIMO_INVICTO = 4;
export const MINIMO_SIN_GANAR = 4;
export const MINIMO_CON_UN_RIVAL = 2;
export const MINIMO_MARCANDO = 4;
export const MINIMO_SIN_MARCAR = 3;
export const MINIMO_EN_COMPETICION = 4;

type Signo = 'G' | 'E' | 'P';

function signo(r: DatedResult): Signo {
  return r.myGoals > r.rivalGoals ? 'G' : r.myGoals === r.rivalGoals ? 'E' : 'P';
}

/**
 * Del más viejo al más nuevo.
 *
 * Las fechas son YYYY-MM-DD, así que el orden alfabético ES el cronológico. Ordenar hace falta
 * igual: `datedResults` se guarda reemplazando la entrada del día, no siempre agregando al final
 * (ver cómo se arma en App.tsx), y una copa jugada a mitad de semana puede entrar después de una
 * fecha de liga posterior.
 */
export function enOrden(resultados: readonly DatedResult[]): DatedResult[] {
  return [...resultados].sort((a, b) => a.date.localeCompare(b.date));
}

/** Cuántos partidos seguidos, contando desde el último hacia atrás, cumplen la condición. */
function seguidosDesdeElFinal(historia: readonly DatedResult[], cumple: (r: DatedResult) => boolean): number {
  let n = 0;
  for (let i = historia.length - 1; i >= 0 && cumple(historia[i]); i--) n++;
  return n;
}

const partido = (n: number) => (n === 1 ? 'partido' : 'partidos');

/**
 * La racha de resultados que está corriendo ahora.
 *
 * Se miran las cuatro en orden de cuánto dicen, y se devuelve UNA: ganando, perdiendo, invicto o
 * sin ganar. "Invicto" y "sin ganar" son las de segundo orden -- sólo salen cuando la racha pura
 * de victorias o derrotas se cortó con un empate, que es justo cuando aportan algo que las otras
 * dos no pueden decir.
 */
export function rachaDeResultados(resultados: readonly DatedResult[]): Racha | null {
  const historia = enOrden(resultados);
  if (!historia.length) return null;

  const victorias = seguidosDesdeElFinal(historia, r => signo(r) === 'G');
  if (victorias >= MINIMO_VICTORIAS) {
    return { texto: `${victorias} victorias seguidas`, tono: 'buena', largo: victorias };
  }
  const derrotas = seguidosDesdeElFinal(historia, r => signo(r) === 'P');
  if (derrotas >= MINIMO_DERROTAS) {
    return { texto: `${derrotas} derrotas seguidas`, tono: 'mala', largo: derrotas };
  }
  const invicto = seguidosDesdeElFinal(historia, r => signo(r) !== 'P');
  if (invicto >= MINIMO_INVICTO) {
    return { texto: `${invicto} ${partido(invicto)} sin perder`, tono: 'buena', largo: invicto };
  }
  const sinGanar = seguidosDesdeElFinal(historia, r => signo(r) !== 'G');
  if (sinGanar >= MINIMO_SIN_GANAR) {
    return { texto: `${sinGanar} ${partido(sinGanar)} sin ganar`, tono: 'mala', largo: sinGanar };
  }
  return null;
}

/**
 * Lo que pasa con ESTE rival, que es la racha que más pesa antes de un partido.
 *
 * El mínimo es más bajo que el de las otras (2 en vez de 3 o 4) porque un rival concreto tiene
 * nombre: "no le ganas a Nacional desde hace dos" ya se siente, mientras "dos partidos sin ganar"
 * no dice nada.
 */
export function rachaConElRival(
  resultados: readonly DatedResult[],
  rival: string,
): Racha | null {
  if (!rival) return null;
  const contraEl = enOrden(resultados).filter(r => r.opponentName === rival);
  if (!contraEl.length) return null;

  const sinGanarle = seguidosDesdeElFinal(contraEl, r => signo(r) !== 'G');
  if (sinGanarle >= MINIMO_CON_UN_RIVAL) {
    // Se nombra al rival aunque la tarjeta ya lo diga: leída sola, la línea tiene que entenderse.
    return {
      texto: `No le ganas a ${rival} desde hace ${sinGanarle} ${partido(sinGanarle)}`,
      tono: 'mala', largo: sinGanarle,
    };
  }
  const ganandole = seguidosDesdeElFinal(contraEl, r => signo(r) === 'G');
  if (ganandole >= MINIMO_CON_UN_RIVAL) {
    return {
      texto: `Le ganaste los últimos ${ganandole} a ${rival}`,
      tono: 'buena', largo: ganandole,
    };
  }
  return null;
}

/** Si el equipo viene marcando siempre, o si no puede meterla. */
export function rachaDeGol(resultados: readonly DatedResult[]): Racha | null {
  const historia = enOrden(resultados);
  if (!historia.length) return null;

  const sinMarcar = seguidosDesdeElFinal(historia, r => r.myGoals === 0);
  if (sinMarcar >= MINIMO_SIN_MARCAR) {
    return { texto: `${sinMarcar} ${partido(sinMarcar)} sin marcar`, tono: 'mala', largo: sinMarcar };
  }
  const marcando = seguidosDesdeElFinal(historia, r => r.myGoals > 0);
  if (marcando >= MINIMO_MARCANDO) {
    return { texto: `${marcando} ${partido(marcando)} seguidos marcando`, tono: 'buena', largo: marcando };
  }
  return null;
}

/**
 * La racha dentro de una competición puntual.
 *
 * Es la que le da peso a las copas: podés estar irregular en la liga y ser intratable en la
 * Libertadores, y hasta ahora las dos cosas se contaban juntas y se anulaban entre sí.
 */
export function rachaEnCompeticion(
  resultados: readonly DatedResult[],
  competicion: string,
): Racha | null {
  if (!competicion) return null;
  // El mismo torneo llega con rótulos distintos según de dónde salga ("Copa Libertadores" y
  // "Copa Libertadores · Octavos"), igual que en la tabla de goleadores. Se compara por el nombre
  // limpio o la racha se parte en una por ronda y nunca llega al mínimo.
  const limpio = (n: string) => n.split('·')[0].trim();
  const objetivo = limpio(competicion);
  const enElla = enOrden(resultados).filter(r => limpio(r.competition) === objetivo);
  if (enElla.length < MINIMO_EN_COMPETICION) return null;

  const invicto = seguidosDesdeElFinal(enElla, r => signo(r) !== 'P');
  if (invicto >= MINIMO_EN_COMPETICION) {
    return { texto: `${invicto} ${partido(invicto)} sin perder en ${objetivo}`, tono: 'buena', largo: invicto };
  }
  const sinGanar = seguidosDesdeElFinal(enElla, r => signo(r) !== 'G');
  if (sinGanar >= MINIMO_EN_COMPETICION) {
    return { texto: `${sinGanar} ${partido(sinGanar)} sin ganar en ${objetivo}`, tono: 'mala', largo: sinGanar };
  }
  return null;
}

/**
 * Lo que se muestra antes de un partido, ya elegido y ordenado.
 *
 * La del rival va SIEMPRE primero cuando existe: es la que habla del partido que estás por jugar,
 * y las otras hablan del momento en general. Después manda el largo, que es lo que hace a una
 * racha más notable que otra.
 *
 * `cuantas` corta la lista porque la tarjeta del próximo partido tiene lugar para una o dos líneas.
 * Con cuatro, deja de ser un dato y pasa a ser una pared de texto que nadie lee.
 */
export function rachasDelProximoPartido(
  resultados: readonly DatedResult[] | undefined,
  rival: string,
  competicion: string,
  cuantas = 2,
): Racha[] {
  if (!resultados?.length) return [];
  const delRival = rachaConElRival(resultados, rival);
  const otras = [
    rachaEnCompeticion(resultados, competicion),
    rachaDeResultados(resultados),
    rachaDeGol(resultados),
  ].filter((r): r is Racha => r !== null)
    .sort((a, b) => b.largo - a.largo);

  return [...(delRival ? [delRival] : []), ...otras].slice(0, cuantas);
}
