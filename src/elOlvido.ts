// EL OLVIDO: el prestigio también baja.
//
// ---------------------------------------------------------------------------------------------
// LA MITAD QUE FALTABA DEL REBALANCEO
// ---------------------------------------------------------------------------------------------
//
// El commit anterior arregló cuánto CUESTA subir el prestigio: un jugador promedio pasó de llegar al
// máximo en 8 partidos a tardar 22. Pero no tocó lo otro, y lo dejé dicho: no había ningún desgaste
// continuo. Sólo golpes puntuales -- cambio de DT, traspaso, roja -- así que en una carrera de veinte
// temporadas el prestigio igual terminaba en 100 y se quedaba ahí para siempre.
//
// Eso convierte la segunda mitad de toda carrera en un trámite. Da lo mismo lo que hagas: ya sos
// alguien y no hay forma de dejar de serlo. El final de una carrera no tiene tensión de ningún tipo.
//
// ---------------------------------------------------------------------------------------------
// LA REGLA, Y LO QUE NO ES
// ---------------------------------------------------------------------------------------------
//
// NO es un impuesto por temporada. Un desgaste plano castigaría igual al que jugó treinta partidos
// que al que no jugó ninguno, y lo único que enseñaría es que el tiempo pasa.
//
// El olvido mide una sola cosa: CUÁNTO SEGUÍS SIENDO ALGUIEN HOY. Y por eso el que juega y rinde no
// se desgasta nada -- no es que "compense" el desgaste, es que no hay nada que olvidar.
//
//   1. EL QUE JUEGA Y RINDE NO SE OLVIDA. Veinte partidos con 6.5 de promedio y el desgaste es cero.
//   2. EL QUE NO JUEGA SE OLVIDA RÁPIDO, y es la parte que más pesa. Una temporada entera sin jugar
//      te saca más que una temporada jugando mal: al que juega mal lo putean, al que no juega lo
//      dejan de nombrar.
//   3. LA EDAD ACELERA TODO. Después de los 32 la misma temporada floja cuesta más, porque el mundo
//      ya está mirando al que viene.
//
// ---------------------------------------------------------------------------------------------
// EL PISO: LO QUE GANASTE NO SE OLVIDA
// ---------------------------------------------------------------------------------------------
//
// Y hay un fondo del que no se baja, y depende de tu vitrina. Un campeón del mundo que se retira
// jugando en el ascenso sigue siendo un campeón del mundo; un jugador que nunca ganó nada y dejó de
// rendir vuelve a no ser nadie. Lo que HICISTE queda, lo que SOS se olvida.
//
// El piso además tiene una función mecánica, y sin ella esta regla sería peligrosa: sostiene al
// jugador por encima del umbral de convocatoria, así que el olvido nunca puede encerrarte en una
// espiral de la que no se sale. Bajás, pero seguís entrando, y jugando se vuelve a subir.

/** Partidos de una temporada a partir de los cuales nadie se olvida de vos. */
export const PARTIDOS_PARA_QUE_NO_TE_OLVIDEN = 20;
/**
 * Cuánto cuenta una suplencia frente a una titularidad.
 *
 * ES EL MISMO 0.35 QUE EL JUEGO YA USA para los minutos del que entra desde el banco (ver
 * `minutos` en el simulador). No es un número nuevo: si un suplente juega un tercio del partido,
 * también lo recuerdan un tercio. Sin esto, el que entra veinte minutos treinta y ocho veces
 * contaba igual que el titular de toda la temporada, y "que se acuerden de vos" dejaba de ser una
 * cuestión de ser protagonista para pasar a ser una de estar en la lista.
 */
export const PESO_DE_LA_SUPLENCIA = 0.35;
/** Y con qué promedio. Por debajo, jugar no alcanza. */
export const NOTA_PARA_QUE_NO_TE_OLVIDEN = 6.5;
/** Lo máximo que te puede sacar una sola temporada. */
export const OLVIDO_MAXIMO = 30;
/** El piso más bajo posible: el del que no ganó nunca nada. */
export const PISO_BASE = 20;
/** Y el más alto, por más vitrina que tengas. Nadie es intocable. */
export const PISO_MAXIMO = 55;

export interface DatosDelOlvido {
  /** Partidos que ARRANCASTE en la temporada que cierra. */
  titularidades: number;
  /** Partidos que jugaste entrando desde el banco. Cuentan menos: ver PESO_DE_LA_SUPLENCIA. */
  suplencias: number;
  /** Tu promedio de nota reciente, o null si no jugaste nada. */
  promedioDeNota: number | null;
  edad: number;
  prestigioActual: number;
  campeonatos: number;
  balonesDeOro: number;
}

/**
 * El fondo del que no se baja: lo que ganaste.
 *
 * Un campeón del mundo que termina en el ascenso sigue siendo un campeón del mundo.
 */
export function pisoDelOlvido(campeonatos: number, balonesDeOro: number): number {
  return Math.min(PISO_MAXIMO, PISO_BASE + campeonatos * 2 + balonesDeOro * 6);
}

/** Los partidos que cuentan de verdad: los que arrancaste, más un tercio de los que entraste. */
export function partidosQueCuentan(d: Pick<DatosDelOlvido, 'titularidades' | 'suplencias'>): number {
  return d.titularidades + d.suplencias * PESO_DE_LA_SUPLENCIA;
}

/**
 * Cuánto prestigio te saca la temporada que cierra. Nunca es negativo.
 *
 * Función pura: quien la llame resta y respeta el piso. Así se puede correr veinte temporadas en el
 * banco de pruebas y ver si una carrera se sostiene o se hunde.
 */
export function olvidoDeLaTemporada(d: DatosDelOlvido): number {
  // 1. LO QUE MÁS PESA: no jugar. Proporcional a cuánto te faltó para ser alguien que juega.
  const faltaron = Math.max(0, PARTIDOS_PARA_QUE_NO_TE_OLVIDEN - partidosQueCuentan(d));
  const porNoJugar = (faltaron / PARTIDOS_PARA_QUE_NO_TE_OLVIDEN) * 22;

  // 2. Y jugar mal, que pesa menos: al que juega mal lo putean, al que no juega lo dejan de nombrar.
  const porRendir = d.promedioDeNota == null
    ? 0
    : Math.max(0, NOTA_PARA_QUE_NO_TE_OLVIDEN - d.promedioDeNota) * 6;

  // 3. La edad acelera lo que ya está pasando -- no inventa desgaste donde no lo hay. Un jugador de
  //    35 que juega treinta partidos y rinde no pierde nada, y así tiene que ser.
  const porEdad = d.edad >= 34 ? 1.6 : d.edad >= 32 ? 1.3 : 1;

  return Math.min(OLVIDO_MAXIMO, Number(((porNoJugar + porRendir) * porEdad).toFixed(2)));
}

/** El prestigio que te queda, ya con el piso respetado. */
export function prestigioDespuesDelOlvido(d: DatosDelOlvido): number {
  const piso = pisoDelOlvido(d.campeonatos, d.balonesDeOro);
  const olvido = olvidoDeLaTemporada(d);
  // Si ya estás por debajo del piso, el olvido no te empuja más abajo -- pero tampoco te sube.
  if (d.prestigioActual <= piso) return d.prestigioActual;
  return Math.max(piso, Math.round(d.prestigioActual - olvido));
}

/**
 * Lo que se le dice al jugador. Nunca es un número suelto.
 *
 * Un desgaste de quince puntos que aparece sin explicación es exactamente el impuesto escondido que
 * este proyecto viene evitando: el número cambia solo y parece un bug.
 */
export function avisoDelOlvido(d: DatosDelOlvido, olvido: number): string | null {
  if (olvido < 1) return null;
  const jugados = partidosQueCuentan(d);
  if (jugados < 5) {
    return `Una temporada casi sin jugar. El fútbol es cruel con eso: dejaron de nombrarte, y perdiste ${Math.round(olvido)} de prestigio.`;
  }
  if (jugados < PARTIDOS_PARA_QUE_NO_TE_OLVIDEN) {
    return `${d.titularidades} de titular no alcanzan para que se acuerden de vos. Perdiste ${Math.round(olvido)} de prestigio.`;
  }
  if (d.edad >= 32) {
    return `Jugaste, pero ya no como antes, y a los ${d.edad} eso se nota más. Perdiste ${Math.round(olvido)} de prestigio.`;
  }
  return `Una temporada por debajo de lo que se espera de vos: perdiste ${Math.round(olvido)} de prestigio.`;
}
