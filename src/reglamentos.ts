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
  /**
   * CUANTOS PARTIDOS DURA CADA RONDA DE LA COPA NACIONAL.
   *
   * Estaba sin modelar y el cuadro las jugaba TODAS a ida y vuelta, en todos los países. O sea que
   * la FA Cup, la Coppa Italia, la DFB-Pokal, la Coupe de France y la Copa Argentina -- que se
   * juegan a partido único de punta a punta -- duraban el doble de partidos que en la realidad, y
   * a la Copa do Brasil y a la Copa BetPlay, que sí definen su final a ida y vuelta, se les jugaba
   * una final sola.
   *
   * `rondas` es el caso normal; `semifinal` y `final` son las excepciones que cada reglamento hace.
   * Sin este dato el país se comporta como partido único, que es lo más común en el mundo.
   */
  copaPiernas?: {
    /** Rondas normales: 1 = partido único, 2 = ida y vuelta. */
    rondas: 1 | 2;
    /** Sólo si la SEMIFINAL difiere (España y Portugal la juegan a doble partido). */
    semifinal?: 1 | 2;
    /** La final. Casi siempre 1; Brasil, Colombia y Ecuador la definen a ida y vuelta. */
    final?: 1 | 2;
  };
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
    // Dimayor: ida y vuelta en todas las rondas, final incluida.
    copaPiernas: { rondas: 2, final: 2 },
  },
  // AFA: Apertura y Clausura, cada uno con fase final entre los ocho mejores.
  Argentina: {
    torneosPorAnio: 2, primerTorneoDelAnio: 'Apertura',
    definicion: 'cuadrangular', clubesDelCuadro: 8, copaNacional: 'Copa Argentina',
    // AFA: partido unico de punta a punta, en cancha neutral.
    copaPiernas: { rondas: 1, final: 1 },
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
    // Fase final a partido unico.
    copaPiernas: { rondas: 1, final: 1 },
  },

  // --- Un campeón por año, definido por tabla ------------------------------------------------
  //
  // Para éstas el reglamento sólo aporta el nombre de la copa, pero igual llevan registro: que una
  // liga esté acá y diga "un torneo, por tabla" es una afirmación, y el validador la puede exigir.
  // Sin registro no se distingue "es de un torneo" de "nadie la cargó todavía".
  Brasileña: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa do Brasil',
    // CBF: ida y vuelta desde la tercera fase, y la final tambien.
    copaPiernas: { rondas: 2, final: 2 } },
  Inglesa: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'FA Cup',
    // Partido unico; ya no hay replays. Final en Wembley.
    copaPiernas: { rondas: 1, final: 1 } },
  Española: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa del Rey',
    // RFEF: partido unico salvo la SEMIFINAL, que va a doble partido.
    copaPiernas: { rondas: 1, semifinal: 2, final: 1 } },
  Italiana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Coppa Italia',
    // Partido unico en todas las rondas desde 2021/22.
    copaPiernas: { rondas: 1, final: 1 } },
  Alemana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'DFB-Pokal',
    // Partido unico; la final siempre en el Olympiastadion.
    copaPiernas: { rondas: 1, final: 1 } },
  Francesa: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Coupe de France',
    // Partido unico de punta a punta.
    copaPiernas: { rondas: 1, final: 1 } },
  Holandesa: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'KNVB Beker',
    // Partido unico; final en De Kuip.
    copaPiernas: { rondas: 1, final: 1 } },
  Portuguesa: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Taça de Portugal',
    // Partido unico salvo la SEMIFINAL, a doble partido. Final en Jamor.
    copaPiernas: { rondas: 1, semifinal: 2, final: 1 } },
  Chilena: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Chile',
    // Ida y vuelta en las rondas, final a partido unico.
    copaPiernas: { rondas: 2, final: 1 } },
  Ecuatoriana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Ecuador',
    // Ida y vuelta, final incluida.
    copaPiernas: { rondas: 2, final: 2 } },
  Boliviana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Bolivia' },
  Uruguaya: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Uruguay',
    // Partido unico.
    copaPiernas: { rondas: 1, final: 1 } },
  Venezolana: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Venezuela',
    // Ida y vuelta, final incluida.
    copaPiernas: { rondas: 2, final: 2 } },
  Estadounidense: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'US Open Cup',
    // Partido unico, en cancha del que sale sorteado.
    copaPiernas: { rondas: 1, final: 1 } },
  Paraguaya: { torneosPorAnio: 1, primerTorneoDelAnio: 'Apertura', definicion: 'tabla', copaNacional: 'Copa Paraguay',
    // Partido unico.
    copaPiernas: { rondas: 1, final: 1 } },
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


// --- ASCENSO Y DESCENSO ------------------------------------------------------------------------
//
// Vivía en promocionDescenso.ts, con su propia tabla por liga. Eran DOS tablas indexadas por el
// mismo nombre de liga contestando sobre el mismo reglamento: una decía cuántos torneos reparte el
// año y cómo se define el título, la otra cuántos bajan y con qué criterio. Para saber cómo
// funciona una liga había que abrir dos archivos y esperar que no se contradijeran.
//
// Acá está la tabla; los ALGORITMOS que la usan siguen en promocionDescenso.ts, que es otra cosa:
// esto es el reglamento, aquello es cómo se aplica.
//
// CADA PAÍS TIENE SU PROPIO REGLAMENTO, y mezclarlos daría descensos inventados:
//
//   Colombia  → bajan 2, por TABLA DE PROMEDIOS (puntos ÷ partidos) acumulando varios años.
//               Un grande puede bajar pese a una buena temporada suelta si arrastra años flojos,
//               y un recién ascendido está protegido porque su ventana solo cuenta el año en curso.
//   Argentina → bajan 4 en Primera Nacional (los 2 últimos de cada zona), por TABLA GENERAL
//               ANUAL acumulada, sin promedio plurianual.
//   Holanda   → bajan 2 directo por tabla anual, y el 16° se juega la categoría en un PLAY-OFF
//               contra seis de la Eerste Divisie. No hay promedio ni torneos semestrales.
//   Brasil    → intercambio DIRECTO y SIMÉTRICO: bajan los 4 últimos de la Serie A y suben los 4
//               primeros de la Serie B. Sin play-off, sin liguilla y sin promedio.
//   Alemania  → bajan 2 directo y el 16° juega la "Relegation" contra UN solo rival, el 3° de la
//               2. Bundesliga, a ida y vuelta. No es el cuadro de seis de Holanda.
//   España    → bajan 3 directo y suben 2; la tercera plaza sale de un play-off del 3° al 6° de
//               Hypermotion. Acá NINGÚN club de Primera juega el play-off: solo decide quién sube.
//   Inglaterra→ igual que España: bajan 3, suben 2, y el play-off del 3° al 6° del Championship
//               reparte la tercera plaza sin que la Premier ponga a nadie en juego.
//   Francia   → híbrido: bajan 2 directo, el 3°/4°/5° de Ligue 2 se cruzan entre sí y recién el
//               ganador enfrenta al 16° de Ligue 1 a ida y vuelta.
//

export type SistemaAscenso =
  | 'colombia' | 'argentina' | 'holanda' | 'brasil' | 'alemania' | 'espana' | 'inglaterra' | 'francia';

export interface ReglasAscenso {
  sistema: SistemaAscenso;
  cuposDescenso: number;
  cuposAscenso: number;
  /** 'promedio' = puntos ÷ partidos plurianual. 'anual' = puntos del año, sin dividir. */
  criterioDescenso: 'promedio' | 'anual';
  /** Cuántos años entran en el promedio. Solo aplica al criterio 'promedio'. */
  ventanaAnios: number;
  /**
   * Puesto de Primera que NO baja directo pero se juega la categoría en un play-off (16° tanto en
   * Holanda como en Alemania). Se aplica contando desde el fondo -- el club justo encima de los que
   * bajan directo -- porque las ligas del juego no siempre tienen el tamaño del reglamento real.
   * undefined = ningún equipo de Primera se juega la categoría en un play-off.
   */
  puestoPlayoff?: number;
  /**
   * Cuántos clubes de Segunda entran a ese play-off. Holanda mete SEIS a un cuadro de tres rondas;
   * Alemania uno solo (el 3°) a ida y vuelta. Por defecto 6, que es el caso holandés.
   */
  rivalesPlayoff?: number;
  /**
   * Play-off que reparte una plaza de ascenso EXTRA entre clubes de Segunda, sin que ningún equipo
   * de Primera participe (España: del 3° al 6°). Es otra cosa que `puestoPlayoff`: allá el de
   * Primera se juega la categoría; acá Primera ya cerró sus descensos y esto solo decide quién sube.
   */
  ascensoPorPlayoff?: { desde: number; hasta: number };
}

const REGLAS: Record<string, ReglasAscenso> = {
  // Dimayor: «Los clubes que ocupen las dos últimas posiciones en la tabla de Descenso descenderán
  // a la Categoría B», y esa tabla se calcula «dividiendo el total de puntos obtenidos entre el
  // total de partidos disputados», acumulando años.
  Colombiana: {
    sistema: 'colombia',
    cuposDescenso: 2,
    cuposAscenso: 2,
    criterioDescenso: 'promedio',
    ventanaAnios: 3,
  },
  // AFA: los descensos de Primera salen de la Tabla General, que suma las fases regulares del año.
  // Sin promedio.
  //
  // BAJAN DOS, NO CUATRO. Los cuatro del comentario viejo son los que bajan de la PRIMERA NACIONAL
  // -- los 2 ultimos de cada zona --, o sea los descensos de la Segunda, que se habian anotado como
  // cupo de la Primera. Con 4 abajo y 2 arriba la liga perdia dos clubes por año para siempre:
  // medido en una carrera de 19 temporadas, la Primera argentina paso de 30 clubes a SEIS, y sin
  // liga no hay calendario ni rivales.
  Argentina: {
    sistema: 'argentina',
    cuposDescenso: 2,
    cuposAscenso: 2,
    criterioDescenso: 'anual',
    ventanaAnios: 1,
  },
  // KNVB: Eredivisie de 18. Bajan directo los 2 últimos (17° y 18°) y suben directo el campeón y
  // el subcampeón de la Eerste Divisie. El 16° NO baja: juega los play-offs de promoción/permanencia
  // contra seis clubes de Segunda, con ventaja de recorrido (él juega hasta 2 rondas, ellos hasta 3).
  Holandesa: {
    sistema: 'holanda',
    cuposDescenso: 2,
    cuposAscenso: 2,
    criterioDescenso: 'anual',
    ventanaAnios: 1,
    puestoPlayoff: 16,
  },
  // CBF: el más simple de todos. Intercambio directo y simétrico entre Serie A y Serie B -- bajan
  // los puestos 17 a 20 y suben los cuatro primeros de la B. Sin promoción, sin liguilla y sin
  // promedio: 38 fechas de todos contra todos y la tabla general manda. Por eso NO lleva
  // puestoPlayoff, y sin ese campo `resolverMovimientos` ni se asoma al cruce.
  Brasileña: {
    sistema: 'brasil',
    cuposDescenso: 4,
    cuposAscenso: 4,
    criterioDescenso: 'anual',
    ventanaAnios: 1,
  },
  // DFL: bajan directo los 2 últimos de la Bundesliga y suben directo los 2 primeros de la 2.
  // Bundesliga. La tercera plaza la define la "Relegation": el 16° de Primera contra el 3° de
  // Segunda, ida y vuelta. Ojo, no es como Holanda: acá el rival es UNO SOLO y ya está definido por
  // tabla, no hay cuadro de seis. Por eso `rivalesPlayoff: 1`.
  Alemana: {
    sistema: 'alemania',
    cuposDescenso: 2,
    cuposAscenso: 2,
    criterioDescenso: 'anual',
    ventanaAnios: 1,
    puestoPlayoff: 16,
    rivalesPlayoff: 1,
  },
  // LaLiga: bajan directo los 3 últimos de Primera y suben directo los 2 primeros de Hypermotion.
  // La tercera plaza de ascenso sale del play-off entre el 3° y el 6° de Segunda -- semifinales y
  // final, todo a ida y vuelta. Diferencia clave con Holanda y Alemania: acá el play-off es SOLO
  // entre clubes de Segunda, ningún equipo de Primera se juega la categoría en él. Por eso no lleva
  // `puestoPlayoff` sino `ascensoPorPlayoff`.
  Española: {
    sistema: 'espana',
    cuposDescenso: 3,
    cuposAscenso: 2,
    criterioDescenso: 'anual',
    ventanaAnios: 1,
    ascensoPorPlayoff: { desde: 3, hasta: 6 },
  },
  // Premier League: bajan directo los 3 últimos y suben directo el campeón y el subcampeón del
  // Championship. La tercera plaza sale del play-off del 3° al 6°, con semifinales a ida y vuelta y
  // una final a partido único en Wembley. Ningún club de Premier participa: es el mismo esquema que
  // España, no el de Alemania.
  Inglesa: {
    sistema: 'inglaterra',
    cuposDescenso: 3,
    cuposAscenso: 2,
    criterioDescenso: 'anual',
    ventanaAnios: 1,
    ascensoPorPlayoff: { desde: 3, hasta: 6 },
  },
  // FIGC: Serie A de 20. Bajan directo los 3 últimos (18°, 19° y 20°) y suben directo los 2
  // primeros de la Serie B. La tercera plaza sale de los play-off entre el 3° y el 8° -- Italia
  // mete ocho, no seis, pero el cuadro es el mismo: sólo clubes de Segunda, ningún equipo de Serie
  // A se juega la categoría ahí. O sea, el esquema de España e Inglaterra, no el de Alemania.
  //
  // Se agrega ahora porque recién ahora la Serie B tiene calendario propio (ver `ita2` en
  // realCalendarDates.ts): sin él, descender dejaba al jugador en una división que el calendario no
  // sabe hacer jugar, y por eso App.tsx salta las ligas cuya Segunda no tiene fechas.
  Italiana: {
    sistema: 'espana',
    cuposDescenso: 3,
    cuposAscenso: 2,
    criterioDescenso: 'anual',
    ventanaAnios: 1,
    ascensoPorPlayoff: { desde: 3, hasta: 8 },
  },
  // LFP: Ligue 1 de 18. Bajan directo los 2 últimos (17° y 18°) y suben directo los 2 primeros de
  // Ligue 2. La tercera plaza es un HÍBRIDO de los dos formatos anteriores: primero el 3°, 4° y 5°
  // de Ligue 2 se cruzan entre sí (barrages), y recién el ganador enfrenta al 16° de Ligue 1 a ida
  // y vuelta. Verificado con la temporada 2025/26: bajaron Nantes (17°) y Metz (18°), y el Niza
  // (16°) retuvo la categoría ganándole 4-1 al Saint-Étienne.
  //
  // Se modela como el caso alemán pero con TRES retadores en vez de uno: playoffPermanencia ya
  // resuelve el cuadro previo entre los de Segunda antes de la llave contra el de Primera.
  Francesa: {
    sistema: 'francia',
    cuposDescenso: 2,
    cuposAscenso: 2,
    criterioDescenso: 'anual',
    ventanaAnios: 1,
    puestoPlayoff: 16,
    rivalesPlayoff: 3,
  },
};

/** Reglas de esa liga, o null si no tiene sistema implementado. */
export function reglasDeLiga(league: string): ReglasAscenso | null {
  return REGLAS[league] ?? null;
}

/**
 * ¿ESTA LLAVE SE DEFINE CON ALARGUE ANTES DE LOS PENALES?
 *
 * No es "cada torneo tiene su regla": dentro de un mismo torneo cambia según la ronda, y por eso no
 * alcanza con el nombre del torneo. Verificado contra los reglamentos vigentes de 2026:
 *
 *   . CHAMPIONS y EUROPA LEAGUE -- llave empatada en el global: 30 minutos de alargue y después
 *     penales. La UEFA eliminó el gol de visitante en 2021/22, así que se resuelve así en todas las
 *     rondas, la final incluida.
 *   . LIBERTADORES y SUDAMERICANA -- octavos, cuartos y semifinales: penales DIRECTO, sin alargue.
 *     La final, que es a partido único: alargue y después penales. Es la asimetría que más
 *     sorprende y está en el reglamento de la CONMEBOL 2026.
 *   . MUNDIAL, EUROCOPA y COPA AMÉRICA -- toda la eliminación directa: alargue y después penales.
 *     En la FASE DE GRUPOS no, y eso no es un detalle: ahí el empate es un resultado válido que
 *     reparte un punto a cada uno. Un alargue en un partido de grupos rompería la tabla.
 *   . LIGA BETPLAY (cuadrangulares y final): penales directo. Confirmado en el reglamento 2026 de
 *     la Dimayor.
 *
 * Lo que NO está verificado devuelve false, que es lo que hace el juego hoy: la Concacaf y las copas
 * nacionales van directo a penales hasta que se confirme su regla. No se asume que "todos los
 * torneos tienen alargue" porque es falso -- la Conmebol es el contraejemplo, y justamente el que
 * este jugador juega.
 */
export function seDefineConAlargue(
  torneo: 'champions' | 'europa' | 'libertadores' | 'sudamericana' | 'concacaf'
    | 'mundial' | 'eurocopa' | 'copaamerica' | string | null | undefined,
  ronda: {
    /** La final de una copa continental de Conmebol, que es a partido único. */
    esLaFinal?: boolean;
    /** El torneo de selecciones ya salió de la fase de grupos. */
    enEliminacionDirecta?: boolean;
  } = {},
): boolean {
  if (torneo === 'mundial' || torneo === 'eurocopa' || torneo === 'copaamerica') {
    return !!ronda.enEliminacionDirecta;
  }
  if (torneo === 'champions' || torneo === 'europa') return true;
  if (torneo === 'libertadores' || torneo === 'sudamericana') return !!ronda.esLaFinal;
  return false;
}

/**
 * ¿ESTE PARTIDO SE VA AL ALARGUE al terminar los 90?
 *
 * Junta las dos condiciones: que el torneo lo use (seDefineConAlargue) y que la llave esté
 * realmente empatada. Vive acá y no adentro de la pantalla del partido para poder probarla: metida
 * en el componente sólo se podía verificar jugando hasta que un global quedara igualado, que en una
 * carrera entera puede no pasar nunca.
 *
 * El empate se mide sobre el GLOBAL cuando hubo ida -- que es lo que decide la llave -- y sobre el
 * marcador cuando el partido es único. `globalPrevio` viene como "mis goles-los del rival", que es
 * el formato del cartel del global de la pantalla.
 */
export function seVaAlAlargue(
  hayAlargue: boolean,
  globalPrevio: string | null | undefined,
  misGoles: number,
  susGoles: number,
): boolean {
  if (!hayAlargue) return false;
  const [previosMios, previosRival] = (globalPrevio ?? '').split('-').map(Number);
  if (Number.isFinite(previosMios) && Number.isFinite(previosRival)) {
    return previosMios + misGoles === previosRival + susGoles;
  }
  return misGoles === susGoles;
}

/**
 * COMO SE JUEGA CADA RONDA DE LA COPA NACIONAL DE ESTE PAIS.
 *
 * Vive acá y no en copaNacional.ts por la razón de siempre en este archivo: éste es un módulo HOJA
 * que no importa nada, así que lo pueden leer tanto copaNacional como leagueEngine. Puesta en
 * copaNacional, leagueEngine tenía que importarla y ahí se cerraba un ciclo de verdad -- hasta
 * ahora sólo tomaba de allá un `import type`, que se borra al compilar.
 *
 * Sin dato cargado se asume PARTIDO UNICO, que es lo más común en el mundo y sobre todo es lo que
 * no inventa partidos: agregar una vuelta que no existe alarga el torneo, quitarla no.
 */
export function esPartidoUnicoDeCopa(league: string): (llavesEnLaRonda: number) => boolean {
  const piernas = reglamentoDe(league).copaPiernas;
  return llaves => {
    if (!piernas) return true;
    if (llaves === 1) return (piernas.final ?? 1) === 1;
    if (llaves === 2) return (piernas.semifinal ?? piernas.rondas) === 1;
    return piernas.rondas === 1;
  };
}
