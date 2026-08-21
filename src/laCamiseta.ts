// LA CAMISETA: lo único del juego que hay que quitarle a alguien.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ÉSTA Y NO OTRA
// ---------------------------------------------------------------------------------------------
//
// Esta mecánica nació de una medición: el prestigio -- el recurso central del juego, del que dependen
// la titularidad, el mercado, la lista de transferibles y la selección -- se saturaba en media
// temporada. Un jugador promedio iba de 50 a 100 en OCHO partidos.
//
// Eso ya se rebalanceó (son 22, ver CUANTO_VALE_UN_PUNTO en decisionDelPartido.ts), pero el
// razonamiento sigue en pie y por eso queda escrito: aun con la escala arreglada, el prestigio
// tiene techo y en una carrera larga termina arriba igual. Es un recurso que se acumula.
//
// Lo que le falta al juego no es otra barra: es algo ESCASO. Algo que no se pueda inflar porque hay
// exactamente uno por plantel, y para tenerlo tiene que dejar de tenerlo otro.
//
// La camiseta ya estaba a medias: `dorsal` existe desde siempre, se elige libre al fichar, se
// muestra al lado de tu nombre y no significa absolutamente nada. Nadie la usa antes que vos.
//
// ---------------------------------------------------------------------------------------------
// LA PARTE QUE LA HACE BUENA: LA 10 TE HACE EL JUEGO MÁS DIFÍCIL
// ---------------------------------------------------------------------------------------------
//
// Sería fácil que la camiseta diera un bonus. Sería un premio, y los premios se acumulan.
//
// Acá pasa lo contrario, que es lo que pasa en el fútbol: al que lleva la 10 lo miran más. Te marcan
// más (sube la marca personal, ver src/dificultad.ts) y el club te exige más (sube la vara de la
// lista de transferibles). Lo único que da a cambio es hinchada.
//
// Que todos la quieran igual, sabiendo eso, es exactamente el punto.
//
// ---------------------------------------------------------------------------------------------
// QUIÉN LA TIENE
// ---------------------------------------------------------------------------------------------
//
// No hay números de camiseta en la base de planteles (32.704 jugadores, ninguno con dorsal). Así que
// el dueño se DEDUCE del plantel y de forma determinista: la 10 es del mejor jugador de creación del
// club, la 9 del mejor delantero, la 1 del mejor arquero. Determinista a propósito -- quién lleva la
// 10 de tu club es un hecho sobre el club, no un sorteo que cambia cada vez que abrís el juego.

/** Las tres camisetas que significan algo. El resto son números. */
export const CAMISETAS_CON_DUENO = [1, 9, 10] as const;
export type CamisetaConDueno = typeof CAMISETAS_CON_DUENO[number];

/** Cuánto sube la marca personal por llevar cada una. La 10 es la que más pesa. */
export const PESO_DE_LA_CAMISETA: Record<number, number> = { 10: 6, 9: 4, 1: 0 };

/** Cuánta hinchada te da llevarla, al ganártela. */
export const HINCHADA_POR_LA_CAMISETA: Record<number, number> = { 10: 8, 9: 5, 1: 3 };

/** Por cuánto tenés que superar al dueño para que la camiseta cambie de dueño. */
export const VENTAJA_PARA_QUITARSELA = 4;

export interface JugadorDelPlantel {
  nombre_completo: string;
  media_valoracion: number;
  categoria_tactica?: string;
  posicion_especifica?: string;
  player_id?: string;
}

/** Qué jugadores compiten por cada camiseta. */
const CANDIDATOS: Record<number, (j: JugadorDelPlantel) => boolean> = {
  1: j => (j.categoria_tactica ?? '').includes('portero') || j.posicion_especifica === 'GK',
  9: j => ['CF', 'ST', 'LW', 'RW', 'SS'].includes(j.posicion_especifica ?? ''),
  10: j => ['AM', 'CAM', 'LW', 'RW', 'CM', 'MC'].includes(j.posicion_especifica ?? ''),
};

/**
 * Quién lleva cada una de las tres camisetas en ese plantel.
 *
 * SE REPARTEN JUNTAS Y NO DE A UNA, y no es un detalle: resolviendo cada camiseta por separado, en
 * Junior de Barranquilla Luis Muriel se llevaba la 9 Y la 10 -- es delantero y es, de lejos, el
 * mejor del plantel, así que ganaba las dos listas. Un jugador no puede llevar dos camisetas.
 *
 * El orden del reparto es 1, 9, 10: el arquero no compite con nadie, el 9 es el puesto más
 * definido, y la 10 se la queda el mejor de los que quedan -- que es como se reparten de verdad.
 *
 * DETERMINISTA: el mismo plantel da siempre los mismos dueños. El desempate va por nombre y no por
 * el orden del array, porque ese orden cambia al re-importar un plantel y entonces la 10 de tu club
 * cambiaría de dueño sin que hubiera pasado nada en el juego.
 */
export function duenosDeLasCamisetas(
  plantel: JugadorDelPlantel[],
): Record<number, JugadorDelPlantel | null> {
  const tomados = new Set<string>();
  const clave = (j: JugadorDelPlantel) => j.player_id ?? j.nombre_completo;
  const resultado: Record<number, JugadorDelPlantel | null> = {};

  for (const numero of CAMISETAS_CON_DUENO) {
    const filtro = CANDIDATOS[numero];
    const candidatos = plantel.filter(j =>
      filtro(j) && !!j.media_valoracion && !tomados.has(clave(j)));
    const elegido = candidatos.length
      ? [...candidatos].sort((a, b) =>
        b.media_valoracion - a.media_valoracion
        || a.nombre_completo.localeCompare(b.nombre_completo))[0]
      : null;
    resultado[numero] = elegido;
    if (elegido) tomados.add(clave(elegido));
  }
  return resultado;
}

/** Quién lleva UNA camiseta. Pasa por el reparto completo para no chocar con las otras dos. */
export function duenoDeLaCamiseta(
  plantel: JugadorDelPlantel[],
  numero: number,
): JugadorDelPlantel | null {
  return duenosDeLasCamisetas(plantel)[numero] ?? null;
}

export interface DatosDeLaDisputa {
  /** Tu nivel medio (promedio de los seis atributos). */
  tuNivel: number;
  /** Tu prestigio, que acá funciona como "cuánto te respeta el vestuario". */
  tuPrestigio: number;
  /** El dueño actual, o null si la camiseta está libre. */
  dueno: JugadorDelPlantel | null;
  /** Temporadas que llevás en el club. Llegar y pedir la 10 no se hace. */
  temporadasEnElClub: number;
}

export interface Disputa {
  podes: boolean;
  /** Qué te falta, dicho como se lo diría un compañero. */
  motivo: string;
}

/**
 * ¿Podés pedir la camiseta?
 *
 * DOS CONDICIONES, y la segunda es la que la hace una historia y no un umbral: además de ser mejor
 * que el dueño, tenés que llevar una temporada en el club. Un recién llegado que pide la 10 el
 * primer día no se gana un vestuario, lo pierde.
 */
export function podesPedirLaCamiseta(d: DatosDeLaDisputa): Disputa {
  if (d.temporadasEnElClub < 1) {
    return { podes: false, motivo: 'Acabás de llegar. La camiseta se pide cuando el vestuario ya te conoce.' };
  }
  if (!d.dueno) {
    return { podes: true, motivo: 'Está libre: nadie la lleva.' };
  }
  // Tu "nivel a ojos del vestuario" mezcla lo que hacés en cancha con lo que pesás adentro.
  const tuPeso = d.tuNivel * 0.7 + d.tuPrestigio * 0.3;
  if (tuPeso >= d.dueno.media_valoracion + VENTAJA_PARA_QUITARSELA) {
    return { podes: true, motivo: `Ya sos más que ${d.dueno.nombre_completo}, y en el vestuario lo saben.` };
  }
  const falta = Math.ceil(d.dueno.media_valoracion + VENTAJA_PARA_QUITARSELA - tuPeso);
  return {
    podes: false,
    motivo: `Es de ${d.dueno.nombre_completo} (${d.dueno.media_valoracion}). Te faltan ${falta} puntos para que nadie discuta.`,
  };
}

/**
 * Cuánto te aprietan de más por llevarla.
 *
 * Se suma a la marca personal: al de la 10 lo marcan más. Es un CASTIGO y está bien que lo sea --
 * si diera ventaja sería un premio más, y de premios el juego ya va sobrado.
 */
export function pesoDeLlevarla(dorsal: number): number {
  return PESO_DE_LA_CAMISETA[dorsal] ?? 0;
}

/** Lo que se dice el día que te la ponés. */
export function elDiaQueTeLaPonen(dorsal: number, club: string, deQuien: string | null): string {
  const numero = dorsal === 10 ? 'la 10' : dorsal === 9 ? 'la 9' : dorsal === 1 ? 'la 1' : `la ${dorsal}`;
  return deQuien
    ? `${numero} de ${club} es tuya. Se la sacaste a ${deQuien}, y a partir de hoy te van a mirar distinto: al que la lleva lo marcan más y le exigen más.`
    : `${numero} de ${club} es tuya. Nadie te la regaló y nadie te la va a perdonar: al que la lleva lo marcan más y le exigen más.`;
}
