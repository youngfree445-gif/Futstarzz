// EL REGLAMENTO DE CADA LIGA, EN UN SOLO LUGAR.
//
// ---------------------------------------------------------------------------------------------
// QUÉ RESUELVE
// ---------------------------------------------------------------------------------------------
//
// Las reglas de cada liga ya estaban modeladas, pero repartidas en listas sueltas -- una por
// dimensión, cada una con su propio conjunto de países:
//
//   LIGAS_DE_DOS_TORNEOS         en dateSchedule.ts   ('Colombiana', 'Argentina', 'Mexicana')
//   LIGAS_DE_DOS_TORNEOS         en seasonCalendar.ts ('Colombiana', 'Argentina')      <- distinta
//   LIGAS_QUE_ARRANCAN_EN_CLAUSURA en dateSchedule.ts ('Mexicana')
//   isApeturaClausuraLeague      en leagueEngine.ts   (Colombiana y Argentina, a mano)
//   FECHAS_DE_CUADRANGULAR       en dateSchedule.ts   (una constante GLOBAL, igual para todos)
//   NOMBRES                      en copaNacional.ts   (los nombres de copa)
//
// Las dos primeras llevaban escrito "es la misma lista que la otra y tiene que seguir
// coincidiendo". No coincidían. México estaba en una y en las otras dos no, así que el calendario
// le repartía DOS títulos por año mientras el resto del juego creía que jugaba uno solo: la vitrina
// no distinguía sus dos campeonatos y la pantalla del partido nunca decía "Apertura" ni "Clausura".
//
// No es un descuido puntual, es la misma enfermedad que produjo los seis bugs de agosto: dos
// fuentes contestando la misma pregunta. Mientras el país haya que escribirlo en cuatro lugares,
// tarde o temprano se escribe en tres.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ES UN MÓDULO HOJA
// ---------------------------------------------------------------------------------------------
//
// Este archivo NO IMPORTA NADA. Ni leagueEngine, ni dateSchedule, ni los datos.
//
// Y esa es la razón por la que las listas estaban duplicadas en primer lugar: dateSchedule importa
// leagueEngine, así que leagueEngine no puede importar dateSchedule sin cerrar un ciclo. Copiar la
// lista era la salida. Un módulo que no importa nada lo pueden leer los tres.
//
// ---------------------------------------------------------------------------------------------
// LO QUE ESTO NO HACE
// ---------------------------------------------------------------------------------------------
//
// No hace el juego más preciso por sí solo: hace que la precisión sea barata de agregar. Cargar una
// liga con su reglamento real pasa a ser escribir datos acá en vez de tocar cuatro archivos y
// ensanchar dos tipos. La precisión de verdad sigue saliendo de investigar cada reglamento, como ya
// se hizo con Colombia y Argentina (ver docs/REGLAMENTO_COLOMBIA_2026.md y el de Argentina).
//
// El ascenso y el descenso NO están acá: viven en promocionDescenso.ts, que ya es una tabla por
// liga bien formada, con nueve países y cada regla citando su reglamento real (Dimayor, AFA, KNVB,
// CBF, DFL). Es el mismo patrón que este archivo; unirlos es una mudanza aparte y no hacía falta
// para arreglar nada.

/** Cómo define el campeón una liga. */
export type FormaDeDefinir = 'tabla' | 'cuadrangular';

export interface ReglamentoDeLiga {
  /**
   * Cuántos campeones reparte el año. Dos = Apertura y Clausura.
   *
   * Es la pregunta que estaba escrita en cuatro lados. De acá salen el corte de semestres del
   * calendario, la detección de partidos de playoff y el rótulo del torneo en pantalla.
   */
  torneosPorAnio: 1 | 2;
  /**
   * Cuál de los dos se juega PRIMERO en el año calendario.
   *
   * En México la temporada arranca en julio con el Apertura y cierra en mayo con el Clausura del
   * año siguiente, así que dentro de un mismo año van Clausura y después Apertura -- al revés que
   * Colombia. Llamarlos como allá dejaba a un jugador del América ganando el "Apertura" en abril.
   */
  primerTorneoDelAnio: 'Apertura' | 'Clausura';
  /** Por tabla, o con un cuadro final entre los mejores. */
  definicion: FormaDeDefinir;
  /**
   * Cuántos clubes entran al cuadro final. Sólo aplica con definicion 'cuadrangular'.
   *
   * De acá salen las fechas que el calendario tiene que apartar: cada ronda es ida y vuelta, así
   * que son log2(clubes) rondas y el doble de fechas. Antes era una constante GLOBAL de 6 fechas,
   * igual para todos los países, que es justo lo que impide cargar un reglamento distinto.
   */
  clubesDelCuadro?: number;
  /**
   * Cómo se llama la copa nacional.
   *
   * TIENE que coincidir exacto con el `name` de la competición en realCalendarDates.ts: es la llave
   * con la que el calendario decide a qué copa reservarle fechas, y con otro nombre el país se
   * queda sin copa en silencio.
   */
  copaNacional?: string;
}

/**
 * Un registro por liga. La clave es `Club.league`.
 *
 * Las ligas que no figuran acá se comportan como el caso normal: un torneo por año, definido por
 * tabla y sin copa nacional modelada (ver reglamentoDe más abajo).
 */
export const REGLAMENTOS: Readonly<Record<string, ReglamentoDeLiga>> = {
  // Dimayor: dos torneos por año, cada uno con su cuadrangular de ocho -- cuartos, semifinal y
  // final, todo a ida y vuelta. Es el formato vigente desde 2024.
  Colombiana: {
    torneosPorAnio: 2, primerTorneoDelAnio: 'Apertura',
    definicion: 'cuadrangular', clubesDelCuadro: 8, copaNacional: 'Copa BetPlay',
  },
  // AFA: Apertura y Clausura, cada uno con fase final entre los ocho mejores.
  Argentina: {
    torneosPorAnio: 2, primerTorneoDelAnio: 'Apertura',
    definicion: 'cuadrangular', clubesDelCuadro: 8, copaNacional: 'Copa Argentina',
  },
  // Liga MX: Apertura (julio-diciembre) y Clausura (enero-mayo), cada uno definido por la Liguilla.
  //
  // Acá es donde se veía el destrozo de tener la lista escrita cuatro veces. México figuraba SÓLO
  // en la de dateSchedule, así que el calendario le partía el año en dos torneos y le apartaba sus
  // seis fechas de Liguilla por semestre -- eso siempre funcionó -- mientras el resto del juego lo
  // trataba como una liga de un solo campeón: la vitrina guardaba los dos títulos del año sin
  // distinguirlos y la pantalla del partido nunca nombraba el torneo. Con el registro completo, las
  // cuatro respuestas salen del mismo lugar.
  Mexicana: {
    torneosPorAnio: 2, primerTorneoDelAnio: 'Clausura',
    definicion: 'cuadrangular', clubesDelCuadro: 8, copaNacional: 'Copa MX',
  },

  // --- Un campeón por año, definido por tabla ------------------------------------------------
  //
  // Para éstas el reglamento sólo aporta el nombre de la copa, pero igual llevan registro: que una
  // liga esté acá y diga "un torneo, por tabla" es una afirmación, y el validador la puede exigir.
  // Sin registro no se distingue "es de un torneo" de "nadie la cargó todavía".
  Brasileña: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa do Brasil' },
  Inglesa: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'FA Cup' },
  Española: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa del Rey' },
  Italiana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Coppa Italia' },
  Alemana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'DFB-Pokal' },
  Francesa: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Coupe de France' },
  Holandesa: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'KNVB Beker' },
  Portuguesa: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Taça de Portugal' },
  Chilena: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Chile' },
  Ecuatoriana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Ecuador' },
  Boliviana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Bolivia' },
  Uruguaya: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Uruguay' },
  Venezolana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Venezuela' },
  Estadounidense: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'US Open Cup' },
  Paraguaya: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Paraguay' },
  Peruana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa de la Liga' },
};

/** El caso normal: un campeón por año, por tabla, sin copa nacional modelada. */
const POR_DEFECTO: ReglamentoDeLiga = {
  torneosPorAnio: 1,
  primerTorneoDelAnio: 'Apertura',
  definicion: 'tabla',
};

export function reglamentoDe(league: string): ReglamentoDeLiga {
  return REGLAMENTOS[league] ?? POR_DEFECTO;
}

/** ¿Esta liga reparte dos campeones por año (Apertura y Clausura)? */
export function repartesDosTitulos(league: string): boolean {
  return reglamentoDe(league).torneosPorAnio === 2;
}

/**
 * Cómo se llaman los dos torneos del año, en orden.
 *
 * Devuelve [el de la primera mitad, el de la segunda]. En México van al revés que en Colombia.
 */
export function torneosDelAnio(league: string): readonly [string, string] {
  const r = reglamentoDe(league);
  return r.primerTorneoDelAnio === 'Clausura' ? ['Clausura', 'Apertura'] : ['Apertura', 'Clausura'];
}

/**
 * Cuántas fechas necesita el cuadro final de esta liga.
 *
 * Cada ronda es ida y vuelta: con ocho clubes son tres rondas (cuartos, semis, final) y seis
 * fechas. Antes esto era una constante global de 6, así que ninguna liga podía tener un cuadro de
 * otro tamaño aunque su reglamento lo dijera.
 */
export function fechasDelCuadroFinal(league: string): number {
  const r = reglamentoDe(league);
  if (r.definicion !== 'cuadrangular') return 0;
  return Math.round(Math.log2(r.clubesDelCuadro ?? 8)) * 2;
}
