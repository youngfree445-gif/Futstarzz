// El técnico te habla en el entretiempo.
//
// ---------------------------------------------------------------------------------------------
// QUÉ RESUELVE
// ---------------------------------------------------------------------------------------------
//
// El DT del club existía como un nombre en la ficha y como una barra ("Relación DT") que subía y
// bajaba por cosas que pasaban FUERA de la cancha: la prensa, los patrocinios, llegar tarde a una
// charla. Dentro del partido no aparecía nunca, ni siquiera cuando el equipo iba perdiendo. Osea
// que la única relación que el juego mide en términos futbolísticos no se jugaba en el fútbol.
//
// Al minuto 45 el técnico ahora te pide UNA cosa concreta según cómo va el partido, y vos decidís
// si se la cumplís. No hay opción correcta:
//
//   - **Cumplir** y que el equipo mejore en el segundo tiempo es lo que más lo acerca.
//   - **Cumplir** y que igual salga mal no te castiga: lo intentaste, y él lo vio.
//   - **Ignorarlo** y ganar igual te da la hinchada -- saliste con la tuya y funcionó -- pero lo
//     enfría: le pasaste por encima delante de todos.
//   - **Ignorarlo** y encima no ganar es lo peor de los dos mundos, que es exactamente lo que
//     debería ser.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ NO HAY CAMPO NUEVO
// ---------------------------------------------------------------------------------------------
//
// La tentación era crear `relacionDT`. Pero el juego YA la tiene: `prestige` se muestra como
// "Relación DT" en las tres pantallas donde aparece (la barra de la ficha, el botón de renovación
// y el comparador de temporadas). Agregar un campo paralelo dejaría dos números peleando por el
// mismo rótulo, y el jugador vería subir uno mientras el otro no se mueve.
//
// Así que esto no inventa una relación: le da por fin una manera de ganarse o perderse DENTRO del
// partido, que es donde debería jugarse. Sin campo nuevo no hay migración ni riesgo para una
// carrera en curso -- mismo criterio que animo.ts y lideresDeCopa.ts.

/** Cómo va el partido cuando el técnico habla. De acá sale qué te pide. */
export type SituacionAlDescanso = 'perdiendo' | 'empatando' | 'ganando';

export function situacionAlDescanso(golesMios: number, golesRival: number): SituacionAlDescanso {
  if (golesMios < golesRival) return 'perdiendo';
  if (golesMios > golesRival) return 'ganando';
  return 'empatando';
}

/**
 * Lo que te pide, en criollo y concreto.
 *
 * Concreto es el punto: "jugá mejor" no es una instrucción, es un reproche. Lo que se pide tiene
 * que ser algo que se pueda ver cumplido o no en la segunda parte.
 */
export const CHARLAS: Readonly<Record<SituacionAlDescanso, readonly string[]>> = {
  perdiendo: [
    'Bájate a buscarla al medio. Sin ti tocando la pelota no salimos jugando y así no empatamos nunca.',
    'Quiero que encares. Cada vez que enfrentas al lateral pasa algo, y llevas cuarenta y cinco minutos jugando de espaldas.',
    'Arriésgate al pase filtrado. Si la perdemos, la perdemos, pero de acá no se sale tocando para el costado.',
  ],
  empatando: [
    'Este partido se gana por el medio. Quiero que aparezcas entre líneas y que la pidas siempre.',
    'Tranquilo con la pelota. El que se apura acá pierde el partido: maneja tú los tiempos.',
    'Cuando recuperemos, sal rápido. El primer pase tuyo tiene que ir para adelante.',
  ],
  ganando: [
    'No te relajes. Quiero la misma intensidad sin pelota que en el primer tiempo.',
    'Ayuda a la marca. Si nos empatan es por el medio, y ahí tienes que estar tú.',
    'Cuidemos la pelota. Cada vez que la tengamos, un pase de más antes de arriesgar.',
  ],
};

/**
 * ¿HOY TE HABLA?
 *
 * No en todos los partidos. Un técnico que te frena el entretiempo con una instrucción personal
 * las 38 fechas no es un técnico, es un trámite: la charla deja de leerse, se contesta de memoria y
 * pierde justo lo que la hacía valer -- que sea una decisión. Pedido: "lo del DT a mitad de tiempo,
 * que no sea siempre, sólo uno que otro partido".
 *
 * La probabilidad sale de la SITUACIÓN, no de un dado plano, porque un técnico habla cuando tiene
 * motivo. Yendo perdiendo es el momento natural de decir algo; ganando cómodo, lo raro sería que
 * frenara a un jugador para darle una instrucción personal. En una temporada normal te habla unas
 * ocho o diez veces, que es cuando se nota.
 *
 * `aleatorio` entra por parámetro para poder probarlo.
 */
const CHANCE_DE_CHARLA: Readonly<Record<SituacionAlDescanso, number>> = {
  perdiendo: 0.45,
  empatando: 0.25,
  ganando: 0.12,
};

export function hablaEnElEntretiempo(
  golesMios: number,
  golesRival: number,
  aleatorio: () => number = Math.random,
): boolean {
  return aleatorio() < CHANCE_DE_CHARLA[situacionAlDescanso(golesMios, golesRival)];
}

/** Una instrucción para esa situación. `aleatorio` entra por parámetro para poder probarlo. */
export function instruccionDelEntretiempo(
  golesMios: number,
  golesRival: number,
  aleatorio: () => number = Math.random,
): { situacion: SituacionAlDescanso; texto: string } {
  const situacion = situacionAlDescanso(golesMios, golesRival);
  const opciones = CHARLAS[situacion];
  return { situacion, texto: opciones[Math.floor(aleatorio() * opciones.length)] };
}

/**
 * ¿El equipo mejoró en el segundo tiempo?
 *
 * Se mide por DIFERENCIA de gol de cada mitad, no por si ganaste: ir 0-2 al descanso y perder 2-3
 * es un segundo tiempo ganado 2-1, y el técnico lo ve así aunque el resultado final sea derrota.
 * Medirlo por el marcador final castigaría al que remontó a medias, que es justo el que hizo caso.
 */
export function mejoroEnElSegundo(
  golesMiosAlDescanso: number, golesRivalAlDescanso: number,
  golesMiosFinal: number, golesRivalFinal: number,
): boolean {
  const primera = golesMiosAlDescanso - golesRivalAlDescanso;
  const segunda = (golesMiosFinal - golesMiosAlDescanso) - (golesRivalFinal - golesRivalAlDescanso);
  // Yendo GANANDO lo que te pide es sostenerlo, así que no perder el segundo tiempo ya es cumplir:
  // aguantar un 1-0 sin conceder es exactamente lo que se pidió, aunque no cambie el marcador.
  if (primera > 0) return segunda >= 0;
  // Yendo perdiendo o empatando hace falta GANAR el segundo tiempo. Que no pase nada no es mejorar:
  // te pidió ir a buscarlo y el partido terminó igual que como estaba.
  return segunda > 0;
}

export interface ResultadoDeLaCharla {
  prestigio: number;
  fans: number;
  mensaje: string;
}

/**
 * Lo que deja la charla, ya con el partido terminado.
 *
 * Los números son chicos a propósito: es UNA decisión de UN partido, y la relación con el DT se
 * construye a lo largo de una temporada. Un salto grande acá convertiría el entretiempo en la
 * palanca principal de la carrera, que no es lo que se buscaba.
 */
export function resultadoDeLaCharla(
  cumplida: boolean,
  mejoro: boolean,
  gano: boolean,
): ResultadoDeLaCharla {
  if (cumplida) {
    return mejoro
      ? { prestigio: 6, fans: 2, mensaje: '👔 Hiciste lo que te pidió y el equipo levantó. El técnico te lo reconoció en el vestuario.' }
      // Cumplir y que salga mal NO castiga: si castigara, obedecer sería una apuesta y la próxima
      // vez nadie obedecería. Lo que se premia es haber ido, no el resultado.
      : { prestigio: 2, fans: 0, mensaje: '👔 Saliste a hacer lo que te pidió. No alcanzó, pero él vio que lo intentaste.' };
  }
  return gano
    ? { prestigio: -4, fans: 6, mensaje: '😤 Ignoraste la instrucción y saliste con la tuya. La gente te la festejó; el técnico, no tanto.' }
    : { prestigio: -7, fans: -2, mensaje: '😤 Ignoraste lo que te pidió y encima no salió. Esa te la van a recordar.' };
}
