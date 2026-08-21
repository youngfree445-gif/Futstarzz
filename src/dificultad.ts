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

/**
 * LA MARCA PERSONAL: cuanto mejor sos, más te cuesta.
 *
 * El juego no tenía ninguna curva de dificultad que creciera con el jugador. La chance de acertar
 * una decisión es `(base + bonus de atributo) * presión`, y el bonus de atributo sólo sube: con los
 * seis atributos cerca de 99 se llega al techo de 0.88 en casi cualquier jugada, y a partir de ahí
 * la carrera es cuesta abajo. Los rivales se defienden igual contra un juvenil de 16 que contra el
 * mejor jugador del mundo.
 *
 * En el fútbol pasa exactamente lo contrario: al que desequilibra le ponen a alguien encima. Ésta es
 * esa marca. Devuelve un multiplicador de tus posibilidades -- 1 cuando nadie te conoce, hasta 0.80
 * cuando sos el jugador al que hay que parar.
 *
 * Se mide con TU NIVEL y TU PRESTIGIO juntos, y no con uno solo: un juvenil con atributos altos
 * todavía no tiene fama que justifique una marca especial, y un veterano famoso venido a menos
 * tampoco la merece. Hace falta ser bueno Y que se sepa.
 *
 * El piso de 0.80 está elegido para que siga siendo una carrera y no un castigo: al mejor jugador
 * del mundo una jugada del 88% le queda en 70%. Sigue siendo el mejor -- sólo que ya no es gratis.
 */
export const MARCA_MAXIMA = 0.80;

export function factorDeMarcaPersonal(nivelPromedio: number, prestigio: number, pesoDeLaCamiseta = 0): number {
  // Ninguno de los dos solo alcanza: se toma el menor, así que la marca aparece recién cuando el
  // nivel Y la fama van juntos.
  //
  // LA CAMISETA APRIETA, Y SE SUMA DESPUES DEL MINIMO. Sumarla al prestigio no servía de nada: el
  // mínimo casi siempre lo pone el nivel, porque el prestigio termina arriba en cualquier carrera
  // larga -- así que la 10 no cambiaba ni un decimal. Lo encontró el caso
  // "con la 10 te marcan más", que daba 0.876 contra 0.876.
  //
  // Sumándola acá, la camiseta te aprieta siempre, que es lo que hace en el fútbol. Y es toda la
  // recompensa que da: ninguna. Ver src/laCamiseta.ts.
  const cuantoTeConocen = Math.min(nivelPromedio, prestigio) + pesoDeLaCamiseta;
  // Por debajo de 70 no te marca nadie: sos uno más.
  if (cuantoTeConocen <= 70) return 1;
  // De 70 a 99 la marca se aprieta de forma pareja hasta el piso.
  const t = Math.min(1, (cuantoTeConocen - 70) / 29);
  return 1 - (1 - MARCA_MAXIMA) * t;
}

/** El nombre de lo que te está pasando, para poder decírselo al jugador en vez de que lo sufra a ciegas. */
export function avisoDeMarca(factor: number): string | null {
  if (factor >= 0.99) return null;
  if (factor <= 0.86) return 'Te sacaron un hombre encima: hoy cada jugada tuya va a costar el doble.';
  if (factor <= 0.93) return 'El rival te marca de cerca: te dejan menos espacio que de costumbre.';
  return 'Te empiezan a prestar atención: ya no te dejan solo.';
}
