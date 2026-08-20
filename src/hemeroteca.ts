// LA HEMEROTECA: la prensa se acuerda de lo que dijiste.
//
// ---------------------------------------------------------------------------------------------
// EL PROBLEMA
// ---------------------------------------------------------------------------------------------
//
// La rueda de prensa era un trámite con consecuencias contables. Elegías una de tres respuestas, se
// movían prestigio y fans, ChutSocial reaccionaba esa misma fecha, y ahí terminaba todo. Lo que
// dijiste no existía a la semana siguiente.
//
// En el fútbol pasa lo contrario: lo que dijiste es lo primero que te sacan cuando las cosas se dan
// vuelta. "Hace seis meses decía esto." Es la forma más barata que tiene un deporte de construir
// personajes, y el juego la tenía apagada.
//
// ---------------------------------------------------------------------------------------------
// CÓMO SE RESUELVE SIN ENTENDER LO QUE DIJISTE
// ---------------------------------------------------------------------------------------------
//
// El problema difícil es semántico: las respuestas son texto libre de data.ts y el juego no puede
// saber si prometiste un título, si te comprometiste a quedarte, o si te hiciste el humilde.
//
// La salida NO es entender la frase. Es doble:
//
//   1. SÓLO SE GUARDAN LAS DECLARACIONES FUERTES -- las de saldo alto, o sea las que gustaron. Una
//      frase tibia no envejece mal porque no prometía nada; las que envejecen mal son justamente
//      las que arrancaron aplausos. El filtro por saldo separa unas de otras sin leer una palabra.
//
//   2. EL CONTRASTE LO PONE LA SITUACIÓN, NO LA FRASE. La prensa nunca dice qué quisiste decir:
//      dice cuándo lo dijiste, dónde estabas, y qué es cierto hoy. Eso es exactamente lo que hace
//      un diario de verdad, y es cierto sin importar cuál de las 35 preguntas te tocó.
//
// Así que la cita se transcribe literal y el juego sólo aporta el marco. Nunca puede mentir sobre
// lo que dijiste, porque nunca lo interpreta.

/** Saldo (prestigio + fans) desde el cual una declaración vale la pena guardarse. */
export const SALDO_PARA_QUEDAR_GUARDADA = 6;

/** Cuántas declaraciones se guardan. Más que esto es un archivo, no una memoria. */
export const CUANTAS_SE_GUARDAN = 10;

/** Cuántos pasos tienen que pasar antes de que una frase sea "vieja" y valga sacarla. */
export const PASOS_PARA_QUE_ENVEJEZCA = 25;

export interface Declaracion {
  texto: string;
  /** prestigio + fans que te dio decirla. Alto = gustó, y por eso se guarda. */
  saldo: number;
  semana: number;
  clubId: string;
  clubName: string;
}

/** En qué situación está el jugador cuando la prensa abre el archivo. */
export interface SituacionDeHoy {
  semana: number;
  clubId: string;
  clubName: string;
  enLaLista: boolean;
  /** Si la ÚLTIMA temporada cerrada terminó con un título. No "hoy": la temporada. */
  ganasteTitulo: boolean;
}

export interface CitaDeArchivo {
  declaracion: Declaracion;
  /** El marco: cuándo lo dijo y qué es cierto hoy. Nunca dice qué quiso decir. */
  marco: string;
  /** Si le salió bien. Cambia el tono de las voces del feed. */
  aFavor: boolean;
}

/**
 * Guarda una declaración, si vale la pena.
 *
 * Devuelve la lista nueva, recortada. Función pura: la lista vive en el perfil.
 */
export function guardarDeclaracion(
  previas: Declaracion[],
  nueva: Declaracion,
): Declaracion[] {
  if (nueva.saldo < SALDO_PARA_QUEDAR_GUARDADA) return previas;
  // Se corta por el final: la memoria de la prensa es corta y prefiere lo reciente.
  return [...previas, nueva].slice(-CUANTAS_SE_GUARDAN);
}

/**
 * ¿Hay algo en el archivo que valga sacar hoy?
 *
 * Las tres situaciones que hacen que una frase vieja valga oro, en orden de fuerza:
 *
 *   1. TE PUSIERON EN LA LISTA. Es el contraste más duro que puede haber: hablabas fuerte y el
 *      club decidió que sobrás.
 *   2. TE FUISTE DEL CLUB donde lo dijiste. No es un reproche, es un dato -- y alcanza.
 *   3. SALIÓ CAMPEÓN. La versión buena, que tiene que existir: si el archivo sólo saliera para
 *      hacerte quedar mal, sería un castigo por hablar, y la respuesta correcta pasaría a ser
 *      quedarse callado siempre.
 */
export function laHemerotecaTeRecuerda(
  declaraciones: Declaracion[],
  hoy: SituacionDeHoy,
): CitaDeArchivo | null {
  const viejas = declaraciones.filter(d => hoy.semana - d.semana >= PASOS_PARA_QUE_ENVEJEZCA);
  if (!viejas.length) return null;

  // La más fuerte que dijiste, no la más vieja: es la que la prensa se acuerda.
  const laMasFuerte = [...viejas].sort((a, b) => b.saldo - a.saldo)[0];
  const fechas = hoy.semana - laMasFuerte.semana;

  if (hoy.enLaLista) {
    return {
      declaracion: laMasFuerte,
      marco: `Lo dijo hace ${fechas} fechas, en ${laMasFuerte.clubName}. Hoy está en la lista de transferibles.`,
      aFavor: false,
    };
  }

  if (hoy.ganasteTitulo) {
    return {
      declaracion: laMasFuerte,
      marco: `Lo dijo hace ${fechas} fechas y la temporada la cerró con un título. A veces el que habla de más tiene con qué.`,
      aFavor: true,
    };
  }

  if (laMasFuerte.clubId !== hoy.clubId) {
    return {
      declaracion: laMasFuerte,
      marco: `Lo dijo cuando jugaba en ${laMasFuerte.clubName}. Hoy está en ${hoy.clubName}.`,
      aFavor: false,
    };
  }

  return null;
}
