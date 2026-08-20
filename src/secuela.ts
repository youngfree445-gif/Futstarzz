// LA LESIÓN QUE TE CAMBIA EL ESTILO.
//
// ---------------------------------------------------------------------------------------------
// EL PROBLEMA
// ---------------------------------------------------------------------------------------------
//
// Una lesión grave, hoy, es un paréntesis: estuviste doce fechas afuera, volviste igual que antes, y
// a las dos semanas nadie se acuerda. El único rastro que deja es una línea en `injuryHistory` que
// se lee recién en el documental de retiro.
//
// En el fútbol de verdad no es así. Una rodilla rota a los 29 no te devuelve al mismo jugador: te
// devuelve a OTRO jugador, que tiene que resolver con la cabeza lo que antes resolvía con las
// piernas. Es una de las historias más repetidas del deporte y el juego no la contaba.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ES UNA REDISTRIBUCIÓN Y NO UN CASTIGO
// ---------------------------------------------------------------------------------------------
//
// Restarte puntos y ya está sería lo obvio, y sería lo peor: convertiría la lesión en un impuesto.
// El jugador aprendería a evitarla y nada más.
//
// Acá SE PIERDE Y SE GANA. Perdés lo que te daba el cuerpo y ganás lo que tuviste que aprender para
// seguir jugando sin él. El saldo es negativo -- romperse nunca conviene -- pero no es una multa:
// es un desvío. El delantero que era una flecha vuelve siendo un definidor; el volante que corría
// noventa minutos vuelve siendo el que pone el pase.
//
// Y de ahí sale el reparto, que tiene dos mitades con dueños distintos:
//
//   LO QUE PERDÉS lo decide la LESIÓN -- es el cuerpo. Los ligamentos se llevan el arranque y el
//   cambio de dirección; una fractura se lleva el físico.
//
//   LO QUE GANÁS lo decide tu PUESTO -- es lo que tuviste que aprender. Un delantero afina la
//   definición; un volante, el pase y la marca; un defensor, la anticipación.
//
// ---------------------------------------------------------------------------------------------
// QUÉ LESIÓN DEJA MARCA
// ---------------------------------------------------------------------------------------------
//
// No todas, o dejaría de significar algo. Sólo:
//
//   . LIGAMENTOS o FRACTURA de ocho fechas para arriba. Son las dos que en el fútbol real cambian
//     carreras.
//   . LA MUSCULAR CRÓNICA: tres en poco tiempo, y sólo pasados los 27. No es la lesión, es la
//     RACHA -- el jugador que ya no puede exigirle al cuerpo porque se le rompe una y otra vez.
//
//     Y OJO CON ESTO, que es la segunda cosa que el banco de pruebas atrapó: la primera versión
//     contaba las musculares de TODA la carrera. Una carrera larga junta trece, así que a partir de
//     los 28 la crónica se disparaba casi todas las temporadas, y encima el riesgo subía con cada
//     una hasta el tope. Contarlas en una ventana de dos temporadas lo arregla y además lo cuenta
//     mejor: "tu cuerpo ya no aguanta" es algo que se dice de un año malo, no de un currículum.
//
// El golpe nunca deja marca, por más fechas que te tenga afuera. Es un golpe.
//
// ---------------------------------------------------------------------------------------------
// Y AUN ASÍ, CASI NUNCA PASA. LA PARTE MÁS IMPORTANTE DEL ARCHIVO
// ---------------------------------------------------------------------------------------------
//
// Cumplir las condiciones de arriba NO deja secuela: deja el RIESGO de una. Ésta fue una corrección
// sobre la marcha y vale anotarla entera, porque la primera versión estaba mal y el error es fácil
// de repetir.
//
// El catálogo del juego sortea el tipo de lesión UNIFORME (ver TIPOS_DE_LESION en lesion.ts), así
// que una de cada cuatro lesiones es fractura, y toda fractura dura de 8 a 16 fechas -- o sea que
// TODA fractura cumplía la condición. Con ~20 lesiones en una carrera larga, la versión anterior
// dejaba unas cinco secuelas por carrera. Eso no es una historia: es una cinta transportadora.
//
// Una lesión que te cambia el estilo tiene que ser algo que le pasa a ALGUNOS jugadores, no un rito
// de paso. Por eso el riesgo es bajo, sube con las fechas afuera y con la edad, y se topea:
//
//     8 fechas a los 22    ->   6%
//    12 fechas a los 29    ->  20%
//    16 fechas a los 31    ->  36%
//    24 fechas a los 33    ->  45%  (tope)
//
// El dado NO se tira acá. `riesgoDeSecuela` devuelve el número y `secuelaDeLaLesion` recibe el
// resultado del dado: así la regla sigue siendo una función pura que se puede correr mil veces en el
// banco de pruebas y contar cuántas secuelas deja de verdad una carrera.

import type { PlayerStats, InjuryType } from './types';

/** Fechas afuera de las que para abajo ni la lesión más fea deja rastro. */
export const FECHAS_PARA_DEJAR_MARCA = 8;
/** Cuántas musculares seguidas, dentro de la ventana, hacen que el cuerpo pase factura. */
export const MUSCULARES_PARA_SER_CRONICA = 3;
/**
 * En cuántos pasos se cuentan esas musculares. Dos temporadas: una fecha es un paso y una temporada
 * son unas 45, así que 90 es "lo que te viene pasando", no "lo que te pasó alguna vez".
 */
export const VENTANA_DE_LA_CRONICA = 90;
/** Piso de cualquier atributo. El mismo que usa el crecimiento del modo hardcore. */
export const PISO_DE_ATRIBUTO = 30;
/** Ni la peor lesión a la peor edad deja marca más de la mitad de las veces. */
export const RIESGO_MAXIMO = 0.45;

export interface DatosDeSecuela {
  tipo: InjuryType;
  semanasAfuera: number;
  edad: number;
  posicion: string;
  atributos: PlayerStats;
  /** En qué paso de la carrera estás. Sirve para mirar sólo las lesiones recientes. */
  semanaActual: number;
  /**
   * Las lesiones ANTERIORES de la carrera -- sin la de hoy, que va en `tipo`. La regla suma la
   * actual por su cuenta: dejarlo librado a quien llame es pedir que dos llamadas cuenten
   * distinto, y ahí la muscular crónica se dispararía una lesión antes o una después según el
   * lugar del código.
   */
  historial: { type: InjuryType; week: number }[];
}

export interface Secuela {
  /** Cuánto se mueve cada atributo. Negativos y positivos en el mismo objeto. */
  cambios: Partial<Record<keyof PlayerStats, number>>;
  /** El titular, corto, para el aviso. */
  titular: string;
  /** El porqué, para que el jugador entienda que no es un bug sino su carrera. */
  relato: string;
}

/** Lo que se lleva cada lesión, y con qué peso. Es el cuerpo, no el puesto. */
const LO_QUE_SE_LLEVA: Record<string, [keyof PlayerStats, number][]> = {
  ligamentos: [['ritmo', 1], ['regate', 0.6]],
  fractura:   [['fisico', 1], ['ritmo', 0.6]],
  cronica:    [['ritmo', 0.7], ['fisico', 0.7]],
};

/** Lo que aprendés para seguir jugando sin lo que perdiste. Es el puesto, no la lesión. */
const LO_QUE_SE_APRENDE: Record<string, [keyof PlayerStats, keyof PlayerStats]> = {
  delantero:  ['tiro', 'pase'],
  mediocampo: ['pase', 'defensa'],
  defensa:    ['defensa', 'pase'],
  arquero:    ['defensa', 'pase'],
};

/** El puesto, agrupado como lo agrupa esta regla. Acepta los códigos y los nombres largos. */
function familiaDePuesto(posicion: string): keyof typeof LO_QUE_SE_APRENDE {
  const p = posicion.toLowerCase();
  if (p.startsWith('por') || p.startsWith('arq') || p === 'gk') return 'arquero';
  if (p.startsWith('def') || p.startsWith('lat') || ['cb', 'li', 'ld', 'lb', 'rb'].includes(p)) return 'defensa';
  if (p.startsWith('del') || p.startsWith('ext') || ['dc', 'st', 'ei', 'ed', 'cf'].includes(p)) return 'delantero';
  return 'mediocampo';
}

/**
 * Qué tan probable es que ESTA lesión te deje marca. 0 si no puede dejar ninguna.
 *
 * Es la mitad que evita que la secuela se vuelva un trámite: la mayoría de las lesiones graves se
 * curan y no cambian nada, como en el fútbol de verdad.
 */
export function riesgoDeSecuela(d: DatosDeSecuela): number {
  // Sólo las de la ventana: la crónica es una racha, no un currículum.
  const musculares = d.historial.filter(
    l => l.type === 'muscular' && d.semanaActual - l.week <= VENTANA_DE_LA_CRONICA,
  ).length + (d.tipo === 'muscular' ? 1 : 0);
  const esCronica = d.tipo === 'muscular' && musculares >= MUSCULARES_PARA_SER_CRONICA && d.edad >= 28;
  const esGrave = (d.tipo === 'ligamentos' || d.tipo === 'fractura') && d.semanasAfuera >= FECHAS_PARA_DEJAR_MARCA;
  if (!esGrave && !esCronica) return 0;

  // La crónica no depende de las fechas de ESTA lesión sino de todas las anteriores: ya venís roto.
  if (esCronica) return Math.min(0.22, 0.12 + (musculares - MUSCULARES_PARA_SER_CRONICA) * 0.04);

  const porTiempo = Math.max(0, d.semanasAfuera - FECHAS_PARA_DEJAR_MARCA) * 0.02;
  const porEdad = d.edad >= 31 ? 0.14 : d.edad >= 28 ? 0.07 : 0;
  return Math.min(RIESGO_MAXIMO, 0.06 + porTiempo + porEdad);
}

/**
 * La secuela, si el dado dice que sí.
 *
 * `dado` es un número de 0 a 1 que tira quien llama -- normalmente Math.random(). Se recibe en vez
 * de tirarse acá para que la función siga siendo pura: el banco de pruebas la corre mil veces con
 * dados controlados y cuenta cuántas secuelas deja una carrera de verdad.
 */
export function secuelaDeLaLesion(d: DatosDeSecuela, dado: number): Secuela | null {
  const riesgo = riesgoDeSecuela(d);
  if (riesgo <= 0 || dado >= riesgo) return null;

  // Sólo las de la ventana: la crónica es una racha, no un currículum.
  const musculares = d.historial.filter(
    l => l.type === 'muscular' && d.semanaActual - l.week <= VENTANA_DE_LA_CRONICA,
  ).length + (d.tipo === 'muscular' ? 1 : 0);
  const esCronica = d.tipo === 'muscular';

  // La severidad: cuánto tiempo estuviste roto, y a qué edad te agarró. Los mismos ligamentos a los
  // 21 y a los 33 no son la misma lesión, y ésa es la mitad de la historia.
  const porTiempo = d.semanasAfuera >= 16 ? 3 : d.semanasAfuera >= 12 ? 2 : 1;
  const porEdad = d.edad >= 31 ? 2 : d.edad >= 28 ? 1 : 0;
  const severidad = Math.min(4, porTiempo + porEdad);

  const cambios: Partial<Record<keyof PlayerStats, number>> = {};
  const perdidas = LO_QUE_SE_LLEVA[esCronica ? 'cronica' : d.tipo] ?? [];
  let perdidoDeVerdad = 0;
  for (const [attr, peso] of perdidas) {
    // El piso se respeta ACÁ y no después: si el atributo ya está en el piso, esa pérdida no
    // ocurrió, y entonces tampoco corresponde compensarla con lo aprendido.
    const quita = Math.max(1, Math.round(severidad * peso));
    const real = Math.min(quita, Math.max(0, d.atributos[attr] - PISO_DE_ATRIBUTO));
    if (real > 0) { cambios[attr] = -real; perdidoDeVerdad += real; }
  }
  if (perdidoDeVerdad === 0) return null;

  // Se aprende MENOS de lo que se pierde: romperse no conviene nunca. Poco más de la mitad,
  // repartido entre las dos cosas que tu puesto te obliga a mejorar.
  const [primero, segundo] = LO_QUE_SE_APRENDE[familiaDePuesto(d.posicion)];
  const aprendido = Math.max(1, Math.round(perdidoDeVerdad * 0.55));
  const alPrimero = Math.ceil(aprendido / 2);
  cambios[primero] = (cambios[primero] ?? 0) + alPrimero;
  if (aprendido - alPrimero > 0) cambios[segundo] = (cambios[segundo] ?? 0) + (aprendido - alPrimero);

  const nombre: Record<string, string> = {
    ligamentos: 'La rodilla', fractura: 'La fractura', muscular: 'El cuerpo', golpe: 'El golpe',
  };
  const titular = esCronica
    ? 'Ya no es una lesión: es tu cuerpo'
    : `${nombre[d.tipo]} te devolvió a otro jugador`;

  const relato = esCronica
    ? `${musculares} musculares en dos temporadas y ${d.edad} años. No podés exigirle al cuerpo lo que le exigías: `
      + `perdiste ${listar(cambios, -1)}, y aprendiste a jugar sin eso (${listar(cambios, 1)}).`
    : `${d.semanasAfuera} fechas afuera a los ${d.edad}. Volvés, pero no volvés igual: perdiste `
      + `${listar(cambios, -1)}. A cambio, jugar sin eso te enseñó algo: ${listar(cambios, 1)}.`;

  return { cambios, titular, relato };
}

/** "3 de ritmo y 2 de regate", leyendo del mismo objeto de cambios. */
function listar(cambios: Partial<Record<keyof PlayerStats, number>>, signo: 1 | -1): string {
  const partes = (Object.entries(cambios) as [keyof PlayerStats, number][])
    .filter(([, v]) => Math.sign(v) === signo)
    .map(([k, v]) => `${Math.abs(v)} de ${k}`);
  if (partes.length === 0) return 'nada';
  if (partes.length === 1) return partes[0];
  return `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`;
}
