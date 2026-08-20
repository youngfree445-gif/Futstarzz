// MODO HARDCORE: la vida profesional de un jugador promedio.
//
// No hay ventana de entrenamiento. No elegís qué mejorar ni cuándo. Mejorás como mejora un futbolista
// de verdad: jugando, rindiendo, y rodeado de gente mejor que vos.
//
// POR QUÉ ES UN MODO Y NO EL JUEGO ENTERO. El entrenamiento es una promesa distinta -- "construí al
// jugador que quieras" -- y es legítima. Ésta es la otra: "a ver si llegás". Las dos no pueden
// convivir en la misma partida porque se contradicen: si podés entrenar, la carrera la decidís vos;
// si no, la decide lo que pasa en la cancha.
//
// LAS CUATRO REGLAS, y las cuatro son ciertas en el fútbol:
//
//   1. EL QUE NO JUEGA NO MEJORA. Una temporada en el banco no te hace mejor jugador, y ésa es la
//      diferencia entre este modo y el normal, donde entrenás igual aunque no juegues nunca.
//   2. RENDIR MANDA. La nota promedio de la temporada es lo que más pesa.
//   3. LOS COMPAÑEROS TE SUBEN O TE FRENAN. Un plantel mejor que vos te tira para arriba; ser el
//      mejor del equipo te estanca. Por eso en este modo el club donde jugás importa de verdad, y no
//      sólo por los títulos.
//   4. LA EDAD MANDA AL FINAL. Hasta los 24 se crece fácil, de 25 a 29 con esfuerzo, y a partir de
//      los 30 se empieza a perder por más que juegues bien.

export interface DatosDeTemporada {
  edad: number;
  partidosJugados: number;
  /** Promedio de tus notas del año, o null si no jugaste. */
  promedioDeNota: number | null;
  /** El nivel medio de tus compañeros de plantel. */
  nivelDelPlantel: number;
  /** Tu nivel actual (promedio de tus seis atributos). */
  nivelPropio: number;
}

/** Partidos por debajo de los cuales una temporada no te cambia nada. */
export const PARTIDOS_MINIMOS = 8;

/**
 * Cuántos puntos de atributo te deja la temporada. Puede ser negativo.
 *
 * Devuelve el cambio del PROMEDIO: quien lo llame reparte los puntos entre los seis atributos --
 * eso lo decide el juego, no esta regla.
 */
export function crecimientoDeLaTemporada(d: DatosDeTemporada): number {
  // 1. El que no juega no mejora. Y si además es veterano, se oxida.
  if (d.partidosJugados < PARTIDOS_MINIMOS || d.promedioDeNota == null) {
    return d.edad >= 30 ? -2 : d.edad >= 26 ? -1 : 0;
  }

  // 2. Rendir manda. Una temporada de 7.0 de promedio es la que te hace crecer; una de 5.5 te hunde.
  const porRendimiento = (d.promedioDeNota - 6.4) * 2.2;

  // 3. Los compañeros. Estar rodeado de gente diez puntos mejor que vos te da casi un punto extra;
  //    ser diez puntos mejor que tu plantel te lo saca. Se acota para que un club enorme no te
  //    convierta en crack por estar sentado ahí.
  const brecha = Math.max(-12, Math.min(12, d.nivelDelPlantel - d.nivelPropio));
  const porCompaneros = brecha * 0.09;

  // 4. La edad, que al final le gana a todo.
  const porEdad = d.edad <= 21 ? 1.2 : d.edad <= 24 ? 0.6 : d.edad <= 27 ? 0 : d.edad <= 30 ? -0.8 : -2.2;

  // Y un techo por temporada: nadie sube cinco puntos de media en un año, ni siquiera jugando
  // veinte partidos perfectos en el mejor equipo del mundo.
  const total = porRendimiento + porCompaneros + porEdad;
  return Math.max(-4, Math.min(3.5, Number(total.toFixed(2))));
}

/** Lo que se le cuenta al jugador al cerrar la temporada. */
export function informeDeLaTemporada(cambio: number, d: DatosDeTemporada): string {
  if (d.partidosJugados < PARTIDOS_MINIMOS) {
    return cambio < 0
      ? `Un año casi sin jugar, y a los ${d.edad} eso se paga: perdiste nivel.`
      : 'Un año casi sin jugar. No perdiste nada, pero tampoco creciste: en la cancha se aprende.';
  }
  if (cambio >= 2) return `Temporada de las que cambian una carrera: ${d.partidosJugados} partidos y ${d.promedioDeNota} de promedio.`;
  if (cambio > 0) return `Creciste un poco: ${d.partidosJugados} partidos, ${d.promedioDeNota} de promedio.`;
  if (cambio === 0) return 'Te quedaste igual. No es poco a esta altura, pero tampoco es crecer.';
  return d.edad >= 30
    ? `Las piernas empiezan a pesar: a los ${d.edad} el año te dejó por debajo de donde arrancaste.`
    : `Un año flojo: ${d.promedioDeNota} de promedio y el nivel bajó.`;
}
