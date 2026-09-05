// EL MOMENTO DE FORMA: la racha que el juego reconoce.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EXISTE
// ---------------------------------------------------------------------------------------------
//
// Hasta acá cada partido era independiente del anterior. El juego guardaba `lastMatchRating` (la
// nota del último) y `sumaCalificacionesHistoricas` (el total de toda la carrera), y entre esos dos
// extremos no había nada: ni forma de saber que venís de tres partidos rompiéndola, ni de que hace
// un mes que no la ves.
//
// En el fútbol eso es justamente lo que más se habla. Un jugador "en racha" no es el que tiene mejor
// promedio histórico: es el que viene bien AHORA. Y el que está en el pozo no dejó de saber jugar,
// dejó de que le salgan las cosas.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ LA RACHA SE CORTA POR INACTIVIDAD
// ---------------------------------------------------------------------------------------------
//
// Esta es la regla que separa "forma" de "promedio de los últimos cinco".
//
// Si sólo se miraran las últimas cinco notas, un jugador podría lesionarse dos meses y volver
// todavía "en racha", con el bonus intacto, por partidos que jugó antes de romperse. Eso no es
// forma: es memoria.
//
// Por eso cada nota se guarda CON el paso en que se jugó, y si entre dos partidos pasaron más de
// PASOS_QUE_CORTAN_LA_RACHA fechas, la racha se corta ahí. La forma se pierde parando, que es
// exactamente lo que pasa de verdad.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ EL EFECTO ES CHICO Y SIMÉTRICO
// ---------------------------------------------------------------------------------------------
//
// El ajuste son 5 puntos de atributo, contra 6 de la fatiga de temporada y 9 de jugar lesionado
// (ver MatchSimulator y src/lesion.ts). Es el más chico de los tres a propósito: la forma es un
// empujón, no una condena. Si pesara más que jugar roto, una mala racha se volvería una espiral de
// la que no se sale -- jugás peor porque venís mal, y venís peor porque jugaste mal.
//
// Y es simétrico (+5 / -5) porque la racha buena tiene que premiar tanto como castiga la mala. Si
// sólo penalizara sería un impuesto; si sólo premiara, no habría nada en juego.

/** Una nota de partido con el paso en que se jugó. El paso hace falta para detectar la inactividad. */
export interface NotaDePartido {
  rating: number;
  paso: number;
}

export type EstadoDeForma = 'en_racha' | 'normal' | 'en_baja';

/** Cuántos partidos hacia atrás se miran. Más que esto ya es promedio, no forma. */
export const VENTANA_DE_FORMA = 5;
/** A partir de esta nota, el partido cuenta como bueno. */
export const NOTA_BUENA = 7.0;
/** Hasta esta nota, el partido cuenta como malo. */
export const NOTA_MALA = 5.5;
/** Cuántos partidos seguidos hacen falta para que el juego lo reconozca como racha. */
export const PARTIDOS_PARA_RACHA = 3;
/** Fechas sin jugar que cortan cualquier racha. Una lesión larga te deja sin ritmo. */
export const PASOS_QUE_CORTAN_LA_RACHA = 6;
/** Cuánto suma cada atributo estando en racha, y cuánto resta estando en baja. */
export const AJUSTE_DE_FORMA = 5;

/**
 * Agrega la nota de un partido y descarta lo que ya no entra en la ventana.
 *
 * La lista se guarda del más viejo al más nuevo, y nunca crece: es un campo del estado guardado y
 * una lista sin tope terminaría con miles de notas en una carrera larga.
 */
export function anotarNota(previas: NotaDePartido[] | undefined, rating: number, paso: number): NotaDePartido[] {
  return [...(previas ?? []), { rating, paso }].slice(-VENTANA_DE_FORMA);
}

/** Qué dice tu forma ahora mismo. */
export interface Forma {
  estado: EstadoDeForma;
  /** Cuántos partidos seguidos buenos (si estás en racha) o malos (si estás en baja). 0 si normal. */
  seguidos: number;
  /** Promedio de la ventana, para mostrar. null si todavía no jugaste nada. */
  promedio: number | null;
}

/**
 * Lee la forma a partir de las notas guardadas.
 *
 * `pasoActual` es el paso en el que se está preguntando: se usa para cortar la racha si hace mucho
 * que no jugás, aunque tus últimas notas hayan sido buenas.
 */
export function evaluarForma(notas: NotaDePartido[] | undefined, pasoActual: number): Forma {
  const lista = (notas ?? []).slice(-VENTANA_DE_FORMA);
  if (lista.length === 0) return { estado: 'normal', seguidos: 0, promedio: null };

  const promedio = lista.reduce((s, n) => s + n.rating, 0) / lista.length;

  // Si hace mucho que no jugás, no hay racha que valga -- por buenas que hayan sido las notas.
  const ultima = lista[lista.length - 1];
  if (pasoActual - ultima.paso > PASOS_QUE_CORTAN_LA_RACHA) {
    return { estado: 'normal', seguidos: 0, promedio };
  }

  // Se cuenta hacia atrás desde el último partido. Un hueco largo entre dos partidos corta igual:
  // la racha tiene que ser continua en el tiempo, no sólo en la lista.
  const contarDesdeElFinal = (cumple: (r: number) => boolean) => {
    let n = 0;
    for (let i = lista.length - 1; i >= 0; i--) {
      if (!cumple(lista[i].rating)) break;
      if (i < lista.length - 1 && lista[i + 1].paso - lista[i].paso > PASOS_QUE_CORTAN_LA_RACHA) break;
      n++;
    }
    return n;
  };

  const buenos = contarDesdeElFinal(r => r >= NOTA_BUENA);
  if (buenos >= PARTIDOS_PARA_RACHA) return { estado: 'en_racha', seguidos: buenos, promedio };

  const malos = contarDesdeElFinal(r => r <= NOTA_MALA);
  if (malos >= PARTIDOS_PARA_RACHA) return { estado: 'en_baja', seguidos: malos, promedio };

  return { estado: 'normal', seguidos: 0, promedio };
}

/** Cuánto se le suma (o resta) a cada atributo por el momento de forma. */
export function ajusteDeForma(estado: EstadoDeForma): number {
  if (estado === 'en_racha') return AJUSTE_DE_FORMA;
  if (estado === 'en_baja') return -AJUSTE_DE_FORMA;
  return 0;
}

/** Cómo se llama tu momento, para mostrarlo. */
export function rotuloDeForma(forma: Forma): string {
  if (forma.estado === 'en_racha') return `En racha · ${forma.seguidos} partidos seguidos`;
  if (forma.estado === 'en_baja') return `En baja · ${forma.seguidos} partidos seguidos`;
  return 'Sin racha definida';
}

/**
 * CUÁNTO TE PESA LA FORMA A LA HORA DEL ONCE.
 *
 * Devuelve puntos que se SUMAN al umbral de titularidad (ver decideLineupStatus en App.tsx):
 * positivo es más difícil ser titular, negativo es más fácil.
 *
 * Existe porque la titularidad se decidía SOLO con el prestigio, y el prestigio nada más sube. Una
 * vez que pasabas el umbral del club eras titular para siempre, jugaras bien o jugaras mal. No había
 * forma de perder el puesto, así que tampoco había nada en juego cada fin de semana.
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUÉ EL APRIETE ES MUCHO MÁS GRANDE QUE EL ALIVIO
 * ---------------------------------------------------------------------------------------------
 *
 * Los dos lados valían 12, y medido resultó que ese número NO ALCANZABA PARA NADA. La vara del club
 * va de 58 a 80 y el prestigio se satura en 100 alrededor de la cuarta temporada: sumarle 12 dejaba
 * el umbral en 78 (Junior) o 92 (Barcelona), siempre por debajo de 100. O sea que el crack no podía
 * perder el puesto jamás, jugara como jugara.
 *
 * No es una hipótesis: el banco de carrera larga midió 38 titularidades de 38 durante ocho
 * temporadas seguidas, y el técnico lo sacó por jugar mal 3 veces en 390 partidos. Ver
 * docs/MEDICION_DE_PARTIDA.md.
 *
 * Ahora el apriete crece 9 por partido flojo hasta 45, que sí le gana al prestigio saturado. Con
 * eso el crack se sienta -- a los 3 partidos flojos en un club grande, a los 5 en uno chico, porque
 * donde sos el mejor de todos la correa es más larga. Eso es fútbol y no una excepción del código.
 *
 * El alivio se queda en 12 porque MÁS NO HACE NADA: al que ya está arriba de la vara, bajarla no le
 * cambia el domingo. El bonus sólo le sirve al que está por debajo peleando por entrar, y ahí 12
 * ya es un escalón de reputación de club entero.
 */
/** Lo que aflojan tres buenos partidos. Sólo le sirve al que está por debajo de la vara. */
export const PESO_DE_LA_FORMA_EN_EL_ONCE = 12;
/**
 * Lo que puede llegar a apretar una mala racha.
 *
 * Tiene que poder GANARLE AL PRESTIGIO SATURADO, que es el punto entero: 80 (la vara del club más
 * grande) + 45 = 125, por encima del 100 que es el máximo de prestigio. Con cualquier número menor
 * que 20 la mecánica no existe para el jugador hecho.
 */
export const PESO_MAXIMO_DE_LA_MALA_FORMA = 45;
/** Cuánto aprieta cada partido flojo seguido. */
const APRIETE_POR_PARTIDO_FLOJO = 9;

export function ajusteDeFormaEnElOnce(forma: Forma): number {
  if (forma.estado === 'en_baja') {
    // Cuanto más larga la mala racha, más se aprieta -- hasta el tope.
    return Math.min(PESO_MAXIMO_DE_LA_MALA_FORMA, forma.seguidos * APRIETE_POR_PARTIDO_FLOJO);
  }
  if (forma.estado === 'en_racha') {
    return -Math.min(PESO_DE_LA_FORMA_EN_EL_ONCE, forma.seguidos * 4);
  }
  return 0;
}

/** Lo que hay que decirle al jugador cuando la forma le movió el puesto. */
export function avisoDeFormaEnElOnce(forma: Forma): string | null {
  if (forma.estado === 'en_baja' && forma.seguidos >= PARTIDOS_PARA_RACHA) {
    return `El DT no está conforme: ${forma.seguidos} partidos flojos seguidos y tu puesto está en discusión.`;
  }
  if (forma.estado === 'en_racha' && forma.seguidos >= PARTIDOS_PARA_RACHA) {
    return `Estás intocable: ${forma.seguidos} partidos seguidos a buen nivel y el DT no te saca.`;
  }
  return null;
}
