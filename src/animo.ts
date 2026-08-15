// El bajón anímico: mentalHealth deja de ser una barra y pasa a ser un estado con salida.
//
// ---------------------------------------------------------------------------------------------
// QUÉ CAMBIA
// ---------------------------------------------------------------------------------------------
//
// `mentalHealth` ya existía y ya bajaba con las derrotas, la prensa hostil, los escándalos y las
// lesiones. Lo que no tenía era **fondo**: por debajo de 35 aplicaba un 0.94 a las decisiones del
// partido y nada más. Ni se nombraba, ni se explicaba, ni había forma de hacer algo al respecto --
// se salía sola ganando partidos, que es justo lo que cuesta cuando estás mal.
//
// Ahora hay tres cosas: se ENTRA por acumulación, se NOTA jugando, y se SALE decidiendo.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ NO GUARDA NADA NUEVO
// ---------------------------------------------------------------------------------------------
//
// La tentación era agregar `bajonAnimico: { desdePaso, motivo }` al perfil. No hace falta: el
// acumulador YA es mentalHealth. Cada derrota con nota baja, cada semana de lesión y cada escándalo
// ya lo empujan para abajo, así que "estar en bajón" es simplemente haber acumulado suficiente.
// Un mal partido suelto no alcanza -- mueve la barra 3 o 4 puntos -- y eso es exactamente lo que
// se pedía: que se sienta merecido.
//
// La ventaja de no guardar nada es la de siempre: una carrera en curso entra en esto sin migración
// ni riesgo de corromperse (mismo criterio que lideresDeCopa.ts).

import { ActiveInjury } from './types';
import { EstadoDeForma } from './forma';

/** Por debajo de esto estás EN BAJÓN: se nombra en pantalla y pesa en la cancha. */
export const UMBRAL_BAJON = 30;

/**
 * Entre UMBRAL_BAJON y esto la cabeza está floja pero no hundida.
 *
 * Los dos escalones existen para que el bajón sea un lugar del que se sale, no un interruptor: si
 * hubiera un solo umbral, cualquier +1 te dejaría "curado" y cualquier −1 te volvería a hundir.
 */
export const UMBRAL_CABEZA_FLOJA = 35;

/** Por encima de esto estás fuerte de cabeza y las decisiones salen algo mejor. */
export const UMBRAL_CABEZA_FUERTE = 85;

/**
 * Lo que cuesta el bajón en la cancha.
 *
 * El 0.94 de "cabeza floja" ya existía. El bajón hondo pega más (0.88) PERO sigue lejos del piso
 * de 0.82 del multiplicador de presión: la idea es que se note, no que el partido sea injugable.
 * Una espiral de la que no se sale ya fue un problema en este mismo cálculo (ver pressureMultiplier
 * en MatchSimulator) y no hay que reintroducirla.
 */
export const FACTOR_BAJON = 0.88;
export const FACTOR_CABEZA_FLOJA = 0.94;
export const FACTOR_CABEZA_FUERTE = 1.08;

/**
 * Energía que te comés al arrancar el partido estando en bajón.
 *
 * Menos que la de jugar lesionado (14): dormir mal pesa, pero pesa menos que una rotura. Es el
 * mismo lugar donde se aplica aquella, así que las dos se suman si te toca lo peor de los dos.
 */
export const PENALIDAD_ENERGIA_BAJON = 12;

export type NivelDeAnimo = 'bajon' | 'floja' | 'normal' | 'fuerte';

export function nivelDeAnimo(mentalHealth: number): NivelDeAnimo {
  if (mentalHealth < UMBRAL_BAJON) return 'bajon';
  if (mentalHealth < UMBRAL_CABEZA_FLOJA) return 'floja';
  if (mentalHealth > UMBRAL_CABEZA_FUERTE) return 'fuerte';
  return 'normal';
}

export function estaEnBajon(perfil: { mentalHealth: number }): boolean {
  return nivelDeAnimo(perfil.mentalHealth) === 'bajon';
}

/** El multiplicador que entra en el cálculo de presión del partido. */
export function factorDeAnimo(mentalHealth: number): number {
  switch (nivelDeAnimo(mentalHealth)) {
    case 'bajon': return FACTOR_BAJON;
    case 'floja': return FACTOR_CABEZA_FLOJA;
    case 'fuerte': return FACTOR_CABEZA_FUERTE;
    default: return 1;
  }
}

/**
 * POR QUÉ estás así, dicho con lo que de verdad pasó.
 *
 * Un "estás anímicamente mal" a secas se lee como un castigo arbitrario. El motivo sale de lo que
 * el perfil ya sabe, en orden de peso: una lesión larga tapa a todo lo demás, después la racha de
 * partidos, después el ruido de afuera. Sin un motivo claro, se dice eso mismo en vez de inventar
 * uno.
 */
export function motivoDelBajon(perfil: {
  activeInjury?: ActiveInjury | null;
  fans: number;
  prestige: number;
  forma?: EstadoDeForma;
}): string {
  if (perfil.activeInjury && perfil.activeInjury.weeksRemaining >= 2) {
    return 'La lesión te tiene lejos de la cancha y se te está haciendo largo.';
  }
  if (perfil.forma === 'en_baja') {
    return 'Vienes de una racha de partidos flojos y la cabeza se quedó ahí.';
  }
  if (perfil.fans < 30) {
    return 'La hinchada te está pegando duro y lo estás cargando.';
  }
  if (perfil.prestige < 30) {
    return 'Sientes que en el club ya no cuentan contigo como antes.';
  }
  return 'Se te fueron juntando las malas y te pasó factura.';
}

// --------------------------------------------------------------------------------------------
// LAS TRES SALIDAS
// --------------------------------------------------------------------------------------------
//
// Ninguna es la correcta, y ésa es la idea: cada una cobra en una moneda distinta -- dinero e
// imagen, rendimiento del próximo partido, o riesgo. Si una fuera obviamente mejor, no sería una
// decisión sino un botón de "curar".

export type SalidaDelBajon = 'psicologo' | 'casa' | 'apretar';

export interface CostoDeSalida {
  id: SalidaDelBajon;
  titulo: string;
  detalle: string;
  /** Lo que cuesta, para pintarlo en el botón. */
  costoTexto: string;
  capital: number;
  energia: number;
  /** Lo que el DT se entera, o lo que el vestuario te reconoce. */
  prestigio: number;
  /** Cuánto levanta el ánimo. En 'apretar' es el premio si sale bien. */
  animo: number;
  entorno: number;
}

export const SALIDAS: readonly CostoDeSalida[] = [
  {
    id: 'psicologo',
    titulo: 'Psicólogo del club',
    detalle: 'Lo más efectivo y lo más rápido, pero el cuerpo técnico se entera y queda anotado.',
    costoTexto: '$2,500 · el DT se entera',
    capital: 2500, energia: 0, prestigio: -5, animo: 22, entorno: 0,
  },
  {
    id: 'casa',
    titulo: 'Unos días en casa',
    detalle: 'Te desconectas del todo y vuelves entero de la cabeza, pero llegas corto al próximo partido.',
    costoTexto: '$900 · 30 de energía',
    capital: 900, energia: 30, prestigio: 0, animo: 28, entorno: 10,
  },
  {
    id: 'apretar',
    titulo: 'Apretar los dientes',
    detalle: 'No gastas nada y nadie se entera. Si te sale bien te levantas solo; si no, te hundes un poco más.',
    costoTexto: 'Gratis · puede salir mal',
    capital: 0, energia: 0, prestigio: 3, animo: 12, entorno: 0,
  },
] as const;

export function salidaPorId(id: SalidaDelBajon): CostoDeSalida {
  return SALIDAS.find(s => s.id === id)!;
}

/** Cuánto se hunde el que apretó los dientes y le salió mal. */
export const CASTIGO_APRETAR = 7;

/** Con qué frecuencia sale bien apretar los dientes. Menos de la mitad: es una apuesta, no un atajo. */
export const CHANCE_APRETAR = 0.45;

/** ¿Alcanza para pagarla? Devuelve el motivo cuando no, para poder decirlo en pantalla. */
export function faltaParaSalida(
  salida: CostoDeSalida,
  perfil: { capital: number; energy: number },
): string | null {
  if (perfil.capital < salida.capital) {
    return `Necesitas $${salida.capital.toLocaleString()} para esto.`;
  }
  // La energía se cobra, así que hay que TENERLA: si no, el descuento no se siente y la opción
  // saldría gratis justo cuando peor estás.
  if (salida.energia > 0 && perfil.energy < salida.energia) {
    return `Necesitas ${salida.energia} de energía: estás demasiado fundido para viajar.`;
  }
  return null;
}

/**
 * Qué le pasa al perfil al elegir una salida.
 *
 * `aleatorio` entra por parámetro por lo mismo de siempre: para que el validador pueda probar las
 * dos ramas de 'apretar' sin depender de la suerte.
 */
export function resultadoDeSalida(
  salida: CostoDeSalida,
  aleatorio: () => number = Math.random,
): { animo: number; prestigio: number; entorno: number; capital: number; energia: number; salioBien: boolean; mensaje: string } {
  if (salida.id === 'apretar') {
    const salioBien = aleatorio() < CHANCE_APRETAR;
    return salioBien
      ? {
          animo: salida.animo, prestigio: salida.prestigio, entorno: 0, capital: 0, energia: 0, salioBien: true,
          mensaje: '💪 Te lo guardaste y saliste adelante solo. En el vestuario lo notaron sin que dijeras una palabra.',
        }
      : {
          animo: -CASTIGO_APRETAR, prestigio: 0, entorno: 0, capital: 0, energia: 0, salioBien: false,
          mensaje: '🌧️ Aguantar sin hablarlo no alcanzó esta vez: la cabeza siguió para abajo.',
        };
  }
  const mensaje = salida.id === 'psicologo'
    ? '🧠 Empezaste a trabajar con el psicólogo del club. La cabeza se acomoda, aunque el cuerpo técnico ya lo sabe.'
    : '🏠 Te fuiste unos días a casa y volviste entero de la cabeza. Al próximo partido llegas corto de piernas.';
  return {
    animo: salida.animo, prestigio: salida.prestigio, entorno: salida.entorno,
    capital: salida.capital, energia: salida.energia, salioBien: true, mensaje,
  };
}
