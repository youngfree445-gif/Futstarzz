// Cuánto cuesta un partido: la fase del torneo y el reparto de goles entre vos y tu equipo.
//
// Vive fuera de MatchSimulator.tsx a propósito. Son dos reglas de BALANCE -- no de interfaz -- y
// escondidas dentro de un componente de 2.800 líneas no se pueden probar ni ajustar sin abrir el
// partido a mano y jugar veinte veces.

/**
 * QUÉ TAN DIFÍCIL ES ESTA FASE, comparada con la fase de grupos.
 *
 * Devuelve un multiplicador de tus posibilidades: 1 es la dificultad normal y más bajo es más
 * difícil. Se aplica a dos cosas a la vez -- el éxito de tus decisiones y el gol esperado de cada
 * equipo -- porque una final tiene que sentirse distinta en las dos, no sólo en una.
 *
 * La escala es deliberadamente suave. Una final es 15% más dura que un partido de grupos, no el
 * doble: el salto de dificultad tiene que notarse sin volver imposible el torneo que venís
 * ganando. Los octavos ya pesan, pero poco.
 *
 * El rótulo viene de App.tsx con la forma "Copa do Brasil · Semifinal (Ida)". Se mira sólo la cola,
 * igual que hace rondaDelPartido en MatchSimulator.tsx.
 */
export function factorDeFase(rotulo: string | null | undefined): number {
  if (!rotulo) return 1;
  const t = rotulo.toLowerCase();

  // El orden importa: "semifinal" contiene "final", así que lo específico va primero.
  if (/\bfinal\b/.test(t) && !/semifinal|cuartos|octavos/.test(t)) return 0.85;
  if (/semifinal|semis\b/.test(t)) return 0.88;
  if (/cuartos/.test(t)) return 0.91;
  if (/octavos/.test(t)) return 0.94;
  if (/dieciseis|16avos|treintaidos|32avos|repechaje|playoff|reclasificaci/.test(t)) return 0.97;

  // Grupos, liga y todo lo demás: dificultad normal.
  return 1;
}

/** Nombre corto de la fase, para poder decirle al jugador por qué le está costando más. */
export function nombreDeFase(rotulo: string | null | undefined): string | null {
  const f = factorDeFase(rotulo);
  if (f >= 1) return null;
  const t = (rotulo ?? '').toLowerCase();
  if (/\bfinal\b/.test(t) && !/semifinal|cuartos|octavos/.test(t)) return 'la final';
  if (/semifinal|semis\b/.test(t)) return 'una semifinal';
  if (/cuartos/.test(t)) return 'unos cuartos';
  if (/octavos/.test(t)) return 'unos octavos';
  return 'una eliminatoria';
}

/**
 * EL GOL ESPERADO QUE LE QUEDA A TU EQUIPO, descontando los que ya metiste vos.
 *
 * Acá estaba la causa de las goleadas absurdas. `lambdaMine` es el gol esperado del EQUIPO ENTERO
 * en el partido, y el generador de goles ambientales lo gastaba como si vos no existieras: tu
 * equipo metía sus tres o cuatro por su cuenta y encima se sumaban los tuyos. De ahí salían los
 * 8-0 de la nada, con vos haciendo cuatro y dando dos asistencias.
 *
 * Reportado así: "mi equipo hace 4 goles, yo otros 4 y 2 asistencias y de la nada voy ganando por
 * paliza".
 *
 * Tus goles no se SUMAN a los de tu equipo: son PARTE de los de tu equipo. Cada gol tuyo consume
 * expectativa ambiental, así que un partidazo tuyo se ve como 4-1 con tres tuyos, no como 8-1.
 *
 * Queda un piso chico y no cero: aunque metas cinco, tus compañeros pueden marcar. Lo que no puede
 * pasar es que sigan marcando al mismo ritmo que si no hubieras hecho nada.
 */
export const PISO_DE_GOL_AMBIENTAL = 0.25;

export function golEsperadoRestante(lambdaDelEquipo: number, golesTuyos: number, asistenciasTuyas: number): number {
  // Una asistencia ya produjo un gol del equipo que el marcador contó, así que también descuenta
  // -- si no, asistir era gratis para el reparto y volvía a inflar el resultado.
  const yaPuestos = golesTuyos + asistenciasTuyas;
  return Math.max(PISO_DE_GOL_AMBIENTAL, lambdaDelEquipo - yaPuestos);
}
