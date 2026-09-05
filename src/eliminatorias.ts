// Eliminatorias del Mundial: quién va al Mundial siguiente, y por qué.
//
// ---------------------------------------------------------------------------------------------
// EL PROBLEMA QUE RESUELVE
// ---------------------------------------------------------------------------------------------
//
// Hasta ahora el Mundial 2030 lo jugaban LAS MISMAS 48 selecciones que el de 2026. Estaba escrito
// tal cual en mundialReal.ts: "los Mundiales siguientes se siguen sorteando al azar a propósito: no
// simulamos eliminatorias, así que no hay forma de saber quién clasificaría". O sea que Colombia
// clasificaba siempre e Italia no jugaba nunca, pasaran veinte años de carrera.
//
// Ahora se clasifica jugando. Es el mismo molde que ya usan los cupos de Libertadores desde la
// temporada 2 (ver posicionesFinales en copasConmebol.ts): el resultado de lo que pasó en la
// carrera decide quién entra en la edición siguiente, en vez de una lista fija.
//
// ---------------------------------------------------------------------------------------------
// QUÉ SE SIMULA PARTIDO A PARTIDO Y QUÉ NO
// ---------------------------------------------------------------------------------------------
//
// UEFA, CONMEBOL y CONCACAF se juegan fecha por fecha, con tabla, y el jugador puede ser convocado
// y disputarlas. Son las tres donde puede estar: la base tiene selecciones europeas, sudamericanas
// y del área de Concacaf con jugadores de nuestras ligas.
//
// CAF, AFC y OFC clasifican POR FUERZA de plantel, sin simular sus partidos. No es pereza: de África
// hay 10 selecciones cargadas y de Asia 9, contra las 54 y las 47 reales, así que simular esas
// eliminatorias sería inventar un torneo entre los diez más fuertes del continente y llamarlo
// clasificación. Con el plantel que hay, el orden de fuerza dice lo mismo y no miente sobre lo que
// no sabemos. El día que se carguen más selecciones africanas y asiáticas, pasan a jugarse igual
// que las otras tres: alcanza con sumarlas a CONFEDERACIONES_JUGABLES.

import type { Club, CupGroup, Fixture, TableTeam } from './types';
import { applyResultToTable, buildInitialTable, clubStrength, generateRoundRobin, simulateMatch, sortTable } from './leagueEngine';

export type Confederacion = 'CONMEBOL' | 'UEFA' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

/**
 * Cómo se llama cada torneo de selecciones.
 *
 * Estaba escrito adentro de una función de palmares.ts, así que la pantalla del partido no lo tenía
 * y decidía con un booleano: cualquier partido con la selección salía rotulado "Copa Mundial FIFA".
 * Reportado jugando una ELIMINATORIA: "me salía Mundial 2027, eso no era mundial sino
 * clasificatoria". A la Eurocopa y a la Copa América les pasaba lo mismo.
 */
export const NOMBRE_DEL_TORNEO_DE_SELECCIONES = {
  mundial: 'Copa del Mundo', eurocopa: 'Eurocopa', copaamerica: 'Copa América',
} as const;

/**
 * A qué confederación pertenece cada selección de la base.
 *
 * Se escribe a mano y no se deduce del campo `league`: ese campo apunta a la liga de CLUBES del país
 * ('Colombiana', 'Alemana') y más de la mitad de las selecciones no tienen ninguno, porque su liga
 * no está cargada. La confederación es un dato del país, no de si tenemos su liga.
 */
export const CONFEDERACION_POR_SELECCION: Record<string, Confederacion> = {
  // --- CONMEBOL (las 10, completa) ---
  wc_argentina: 'CONMEBOL', wc_bolivia: 'CONMEBOL', wc_brasil: 'CONMEBOL', wc_chile: 'CONMEBOL',
  wc_colombia: 'CONMEBOL', wc_ecuador: 'CONMEBOL', wc_paraguay: 'CONMEBOL', wc_peru: 'CONMEBOL',
  wc_uruguay: 'CONMEBOL', wc_venezuela: 'CONMEBOL',

  // --- CONCACAF ---
  wc_usa: 'CONCACAF', wc_mexico: 'CONCACAF', wc_canada: 'CONCACAF', wc_costa_rica: 'CONCACAF',
  wc_jamaica: 'CONCACAF', wc_panama: 'CONCACAF', wc_haiti: 'CONCACAF', wc_curazao: 'CONCACAF',

  // --- CAF ---
  wc_marruecos: 'CAF', wc_senegal: 'CAF', wc_egipto: 'CAF', wc_argelia: 'CAF',
  wc_costa_marfil: 'CAF', wc_tunez: 'CAF', wc_sudafrica: 'CAF', wc_rd_congo: 'CAF',
  wc_cabo_verde: 'CAF', wc_ghana: 'CAF',

  // --- AFC ---
  wc_japon: 'AFC', wc_corea_sur: 'AFC', wc_iran: 'AFC', wc_australia: 'AFC',
  wc_arabia_saudita: 'AFC', wc_catar: 'AFC', wc_uzbekistan: 'AFC', wc_irak: 'AFC',
  wc_jordania: 'AFC',

  // --- OFC ---
  wc_nueva_zelanda: 'OFC',

  // --- UEFA ---
  wc_espana: 'UEFA', wc_francia: 'UEFA', wc_inglaterra: 'UEFA', wc_alemania: 'UEFA',
  wc_portugal: 'UEFA', wc_holanda: 'UEFA', wc_belgica: 'UEFA', wc_croacia: 'UEFA',
  wc_italia: 'UEFA', wc_suiza: 'UEFA', wc_austria: 'UEFA', wc_turquia: 'UEFA',
  wc_dinamarca: 'UEFA', wc_suecia: 'UEFA', wc_noruega: 'UEFA', wc_escocia: 'UEFA',
  wc_chequia: 'UEFA', wc_serbia: 'UEFA', wc_polonia: 'UEFA', wc_ucrania: 'UEFA',
  wc_hungria: 'UEFA', wc_rumania: 'UEFA', wc_eslovaquia: 'UEFA', wc_eslovenia: 'UEFA',
  wc_albania: 'UEFA', wc_georgia: 'UEFA', wc_bosnia: 'UEFA', wc_grecia: 'UEFA',
  wc_gales: 'UEFA', wc_irlanda: 'UEFA', wc_irlanda_norte: 'UEFA', wc_islandia: 'UEFA',
  wc_finlandia: 'UEFA', wc_macedonia: 'UEFA', wc_montenegro: 'UEFA', wc_kosovo: 'UEFA',
  wc_bulgaria: 'UEFA', wc_bielorrusia: 'UEFA', wc_israel: 'UEFA', wc_kazajistan: 'UEFA',
  wc_azerbaiyan: 'UEFA', wc_armenia: 'UEFA', wc_moldavia: 'UEFA', wc_letonia: 'UEFA',
  wc_lituania: 'UEFA', wc_estonia: 'UEFA', wc_chipre: 'UEFA', wc_malta: 'UEFA',
  wc_luxemburgo: 'UEFA', wc_islas_feroe: 'UEFA', wc_andorra: 'UEFA', wc_san_marino: 'UEFA',
  wc_liechtenstein: 'UEFA', wc_gibraltar: 'UEFA',

  // wc_chequia_euro queda AFUERA a propósito: es la misma Chequia que wc_chequia, duplicada en la
  // base (una entró con el seed del Mundial y la otra con el de la Eurocopa). Si entrara, Chequia
  // jugaría su propia eliminatoria dos veces y podría clasificar contra sí misma.
};

/** La duplicada que no juega. Se nombra para que se vea que es a propósito y no un olvido. */
export const SELECCIONES_DUPLICADAS = ['wc_chequia_euro'];

/**
 * Cupos del Mundial de 48, como los reparte la FIFA.
 *
 * Suman 46; los 2 que faltan salen del repechaje intercontinental (ver REPECHAJE_INTERCONTINENTAL).
 *
 * OJO con CAF, AFC y OFC: sus cupos son los reales, pero nuestra base tiene 10, 9 y 1 selección de
 * cada una. Con 9 cupos para 10 africanas, casi todas entran. Es una limitación de DATOS, no del
 * reparto -- el día que se carguen las 54 de África el número deja de ser generoso y pasa a ser el
 * correcto. Se prefirió eso antes que inventar un cupo más chico que el de la vida real.
 */
export const CUPOS_POR_CONFEDERACION: Record<Confederacion, number> = {
  UEFA: 16, CAF: 9, AFC: 8, CONCACAF: 6, CONMEBOL: 6, OFC: 1,
};

/** Los dos lugares que se definen entre confederaciones, con los mejores que quedaron afuera. */
export const REPECHAJE_INTERCONTINENTAL = 2;

/** Las que se juegan partido a partido. El resto clasifica por fuerza (ver la nota de arriba). */
export const CONFEDERACIONES_JUGABLES: readonly Confederacion[] = ['UEFA', 'CONMEBOL', 'CONCACAF'];

export function esJugable(conf: Confederacion): boolean {
  return CONFEDERACIONES_JUGABLES.includes(conf);
}

/** Grupos de la eliminatoria europea. 12 ganadores directos + 4 mejores segundos = los 16 cupos. */
const GRUPOS_UEFA = 12;
const CLASIFICAN_POR_GRUPO_UEFA = 1;

export interface EliminatoriaState {
  confederacion: Confederacion;
  /** El Mundial al que se clasifica (2030, 2034...). Es la clave con la que se guarda. */
  mundial: number;
  /**
   * Las zonas del torneo. CONMEBOL y CONCACAF juegan TODOS CONTRA TODOS en una sola tabla -- así es
   * de verdad, y por eso acá hay un solo "grupo" con las 10 (o las 8) adentro. UEFA juega en 12.
   */
  grupos: CupGroup[];
  /** Pasos ya consumidos. Cada fecha FIFA del calendario es uno, igual que las copas. */
  stepsConsumed: number;
}

/** Todas las selecciones de una confederación, sin las duplicadas. */
export function seleccionesDe(conf: Confederacion, todas: Club[]): Club[] {
  return todas.filter(t => CONFEDERACION_POR_SELECCION[t.id] === conf);
}

/**
 * Reparte las selecciones en `cantidad` grupos por SERPIENTE de fuerza.
 *
 * De más fuerte a más débil y en zigzag (1→12, después 12→1), que es lo que hacen los bombos: sin
 * esto, un sorteo plano puede juntar a España, Francia y Portugal en el mismo grupo y dejar afuera
 * a dos de las tres, mientras un grupo entero de repechaje clasifica a alguien de reputación 1.
 */
function repartirEnGrupos(equipos: Club[], cantidad: number): string[][] {
  const ordenados = [...equipos].sort((a, b) => clubStrength(b) - clubStrength(a));
  const grupos: string[][] = Array.from({ length: cantidad }, () => []);
  ordenados.forEach((t, i) => {
    const vuelta = Math.floor(i / cantidad);
    const pos = i % cantidad;
    grupos[vuelta % 2 === 0 ? pos : cantidad - 1 - pos].push(t.id);
  });
  return grupos;
}

function armarZona(id: string, ids: string[], todas: Club[]): CupGroup {
  const clubs = ids.map(x => todas.find(t => t.id === x)).filter((c): c is Club => !!c);
  return {
    id,
    clubIds: ids,
    table: buildInitialTable(clubs),
    // Ida y vuelta, como toda eliminatoria: 18 fechas para las 10 de Conmebol, 14 para las 8 de
    // Concacaf, 6 para un grupo europeo de 4.
    fixtures: generateRoundRobin(ids),
  };
}

export function crearEliminatoria(conf: Confederacion, mundial: number, todas: Club[]): EliminatoriaState {
  const equipos = seleccionesDe(conf, todas);
  const grupos = conf === 'UEFA'
    ? repartirEnGrupos(equipos, GRUPOS_UEFA).map((ids, i) => armarZona(String.fromCharCode(65 + i), ids, todas))
    : [armarZona('Única', equipos.map(t => t.id), todas)];
  return { confederacion: conf, mundial, grupos, stepsConsumed: 0 };
}

/** Cuántas fechas dura esta eliminatoria. Es la fecha más alta de todas sus zonas. */
export function fechasDeLaEliminatoria(e: EliminatoriaState): number {
  return Math.max(0, ...e.grupos.flatMap(g => g.fixtures.map(f => f.matchweek)));
}

export function eliminatoriaTerminada(e: EliminatoriaState): boolean {
  return e.grupos.every(g => g.fixtures.every(f => f.played));
}

/**
 * CÓMO VA MI SELECCIÓN EN LA ELIMINATORIA, y si ya se quedó afuera.
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUÉ ESTO NO ES COMO UNA COPA
 * ---------------------------------------------------------------------------------------------
 *
 * En un cuadro te eliminan en un partido: perdés la llave y ese día se te avisa. La eliminatoria es
 * una TABLA DE DOS AÑOS y no hay un momento así: en algún punto la aritmética deja de dar, y ese
 * punto suele caer una fecha que ni jugaste.
 *
 * `eliminado` SOLO SE AFIRMA CUANDO ES SEGURO: ni ganando todos los partidos que le quedan alcanza
 * los puntos que YA TIENE el equipo que ocupa el último lugar que clasifica. Ese equipo puede sumar
 * más, nunca menos, así que la cuenta no puede dar un falso positivo. Es conservadora -- puede
 * avisar una fecha después de lo estrictamente posible -- y esa es la dirección correcta del error:
 * decirle a alguien que quedó afuera cuando todavía puede entrar es mucho peor que decírselo tarde.
 *
 * EN EUROPA NUNCA SE AFIRMA MIENTRAS SE JUEGA, y no es una limitación técnica. Son 12 grupos y
 * clasifica el primero, pero los 4 MEJORES SEGUNDOS también entran: quedar fuera del primer puesto
 * no es quedar afuera, depende de lo que hagan los otros once grupos. Un aviso ahí le mentiría al
 * que después entra como mejor segundo.
 *
 * EL CORTE NO ES `cupos`, SON `cupos + 2`. Al séptimo y al octavo de Conmebol les queda el repechaje
 * intercontinental (ver clasificadosDe, que devuelve `enLaPuerta`), así que estar séptimo no es
 * estar eliminado.
 */
export interface SituacionEnLaEliminatoria {
  puesto: number;
  equipos: number;
  /** Los que entran derecho. */
  cupos: number;
  /** Hasta dónde se puede llegar al Mundial: los cupos más los dos del repechaje. */
  corte: number;
  fechasQueFaltan: number;
  terminada: boolean;
  /** Terminó y quedó dentro del corte. */
  clasificado: boolean;
  /** Ya no llega ni ganando todo. En Europa, sólo cuando la eliminatoria terminó. */
  eliminado: boolean;
}

export function situacionEnLaEliminatoria(
  e: EliminatoriaState, teamId: string,
): SituacionEnLaEliminatoria | null {
  const grupo = e.grupos.find(g => g.clubIds.includes(teamId));
  if (!grupo) return null;

  const tabla = sortTable(grupo.table);
  const puesto = tabla.findIndex(r => r.clubId === teamId) + 1;
  if (!puesto) return null;

  const cupos = CUPOS_POR_CONFEDERACION[e.confederacion];
  const corte = Math.min(tabla.length, cupos + REPECHAJE_INTERCONTINENTAL);
  const terminada = eliminatoriaTerminada(e);
  const total = fechasDeLaEliminatoria(e);
  const jugadas = Math.max(0, ...grupo.fixtures.filter(f => f.played).map(f => f.matchweek));
  const fechasQueFaltan = Math.max(0, total - jugadas);

  if (terminada) {
    const { clasificados, enLaPuerta } = clasificadosDe(e);
    const dentro = clasificados.includes(teamId) || enLaPuerta.includes(teamId);
    return { puesto, equipos: tabla.length, cupos, corte, fechasQueFaltan: 0, terminada: true,
             clasificado: dentro, eliminado: !dentro };
  }

  // Mientras se juega, en Europa no se afirma nada: el segundo de un grupo puede entrar por ser uno
  // de los cuatro mejores segundos, y eso depende de los otros once grupos.
  if (e.confederacion === 'UEFA') {
    return { puesto, equipos: tabla.length, cupos, corte, fechasQueFaltan, terminada: false,
             clasificado: false, eliminado: false };
  }

  const mios = tabla[puesto - 1];
  const partidosQueMeQuedan = grupo.fixtures.filter(
    f => !f.played && (f.homeTeamId === teamId || f.awayTeamId === teamId)).length;
  const miTecho = mios.puntos + partidosQueMeQuedan * 3;
  const elDelCorte = tabla[corte - 1];
  const eliminado = !!elDelCorte && elDelCorte.clubId !== teamId && miTecho < elDelCorte.puntos;

  return { puesto, equipos: tabla.length, cupos, corte, fechasQueFaltan, terminada: false,
           clasificado: false, eliminado };
}

/** El partido que le toca a esta selección en la fecha que viene, si le toca alguno. */
export function proximoPartidoDeEliminatoria(
  e: EliminatoriaState, teamId: string,
): { opponentId: string; isHome: boolean; fecha: number } | null {
  const proxima = Math.min(...e.grupos.map(g => g.fixtures.find(f => !f.played)?.matchweek ?? Infinity));
  if (!Number.isFinite(proxima)) return null;
  for (const g of e.grupos) {
    const f = g.fixtures.find(x => x.matchweek === proxima && !x.played && (x.homeTeamId === teamId || x.awayTeamId === teamId));
    if (f) {
      return f.homeTeamId === teamId
        ? { opponentId: f.awayTeamId, isHome: true, fecha: proxima }
        : { opponentId: f.homeTeamId, isHome: false, fecha: proxima };
    }
  }
  // Sin partido esta fecha no significa eliminado: en un grupo impar hay uno que descansa.
  return null;
}

/** La tabla de la zona donde juega esta selección (la única, o su grupo europeo). */
export function tablaDeEliminatoria(e: EliminatoriaState, teamId: string): TableTeam[] | null {
  const g = e.grupos.find(x => x.clubIds.includes(teamId));
  return g ? sortTable(g.table) : null;
}

/** El nombre de la zona, para mostrarlo: "Grupo F" en Europa, nada en las de tabla única. */
export function zonaDe(e: EliminatoriaState, teamId: string): string | null {
  const g = e.grupos.find(x => x.clubIds.includes(teamId));
  if (!g || g.id === 'Única') return null;
  return `Grupo ${g.id}`;
}

/**
 * Resuelve UNA fecha de la eliminatoria: todos los partidos de esa jornada, en todas las zonas.
 *
 * Si el jugador tenía partido, su resultado entra por `forced` y el resto se simula -- exactamente
 * como las fases de grupos de las copas (ver resolveCupGroupsStep).
 */
export function resolverPasoEliminatoria(
  e: EliminatoriaState,
  todas: Club[],
  forced?: { teamId: string; goals: number; opponentGoals: number },
): EliminatoriaState {
  const proxima = Math.min(...e.grupos.map(g => g.fixtures.find(f => !f.played)?.matchweek ?? Infinity));
  if (!Number.isFinite(proxima)) return e;

  const grupos = e.grupos.map(g => {
    let table = g.table;
    const fixtures: Fixture[] = g.fixtures.map(f => {
      if (f.matchweek !== proxima || f.played) return f;
      const local = todas.find(t => t.id === f.homeTeamId);
      const visita = todas.find(t => t.id === f.awayTeamId);
      if (!local || !visita) return f;

      let homeGoals: number, awayGoals: number;
      const esElMio = forced && (f.homeTeamId === forced.teamId || f.awayTeamId === forced.teamId);
      if (esElMio && forced) {
        // La localía la manda el fixture, no un flag de la UI: si discrepan, el resultado entra
        // dado vuelta. Mismo cuidado que en las copas.
        const yoSoyLocal = f.homeTeamId === forced.teamId;
        homeGoals = yoSoyLocal ? forced.goals : forced.opponentGoals;
        awayGoals = yoSoyLocal ? forced.opponentGoals : forced.goals;
      } else {
        ({ homeGoals, awayGoals } = simulateMatch(local, visita));
      }
      table = applyResultToTable(table, f.homeTeamId, f.awayTeamId, homeGoals, awayGoals);
      return { ...f, played: true, homeGoals, awayGoals };
    });
    return { ...g, table, fixtures };
  });

  return { ...e, grupos, stepsConsumed: e.stepsConsumed + 1 };
}

/**
 * Pone la eliminatoria al día con el calendario, SIN pasarle por encima al jugador.
 *
 * Es el mismo guardia que getOrCreateCupState: si la fecha que viene tiene partido de la selección
 * del jugador, se frena ahí y no la consume, así cuando la pantalla se lo ofrezca el partido siga
 * estando. Sin esto, la eliminatoria se jugaría sola de fondo y el jugador se enteraría del
 * resultado sin haber jugado -- que es el bug que ya apareció con la Libertadores del Junior.
 *
 * `pasos` sale del calendario (pasosDeEliminatoriasTranscurridos): cada fecha FIFA es un paso.
 */
export function ponerAlDiaLaEliminatoria(
  e: EliminatoriaState, todas: Club[], pasos: number, teamIdDelJugador?: string,
): EliminatoriaState {
  let out = e;
  while (out.stepsConsumed < pasos && !eliminatoriaTerminada(out)) {
    if (teamIdDelJugador && proximoPartidoDeEliminatoria(out, teamIdDelJugador)) break;
    out = resolverPasoEliminatoria(out, todas);
  }
  return out;
}

/**
 * Termina de jugar lo que falte, de una sola vez.
 *
 * Hace falta al llegar el Mundial: el calendario no siempre alcanza a darle al club las 18 fechas
 * de Conmebol -- medido en el Junior, junta 16, porque su año está tan cargado que dos ventanas FIFA
 * quedan sin día libre -- y una carrera que empieza a mitad de ciclo llega todavía más tarde. El
 * torneo tiene que estar cerrado antes de sortear el Mundial, o los cupos saldrían de una tabla a
 * medio jugar.
 */
export function terminarEliminatoria(e: EliminatoriaState, todas: Club[]): EliminatoriaState {
  let out = e;
  for (let i = 0; i < fechasDeLaEliminatoria(e) + 2 && !eliminatoriaTerminada(out); i++) {
    out = resolverPasoEliminatoria(out, todas);
  }
  return out;
}

/**
 * Los que clasificaron por esta eliminatoria, en orden, y los que quedaron en la puerta.
 *
 * `enLaPuerta` son los mejores que NO entraron: de ahí salen los dos del repechaje intercontinental.
 */
export function clasificadosDe(e: EliminatoriaState): { clasificados: string[]; enLaPuerta: string[] } {
  const cupos = CUPOS_POR_CONFEDERACION[e.confederacion];

  if (e.confederacion !== 'UEFA') {
    // Tabla única: entran los primeros, y el siguiente es el que se queda a las puertas.
    const orden = sortTable(e.grupos[0].table).map(r => r.clubId!);
    return { clasificados: orden.slice(0, cupos), enLaPuerta: orden.slice(cupos, cupos + 2) };
  }

  // Europa: primero los ganadores de grupo, y los cupos que sobran se reparten entre los MEJORES
  // SEGUNDOS de todos los grupos -- que es como se define de verdad, y por eso el segundo de un
  // grupo duro puede entrar antes que el segundo de uno flojo.
  const ordenPorGrupo = e.grupos.map(g => sortTable(g.table));
  const ganadores = ordenPorGrupo.map(t => t[0]).filter(Boolean);
  const segundos = ordenPorGrupo.map(t => t[1]).filter(Boolean);
  const porMerito = (a: TableTeam, b: TableTeam) =>
    b.puntos - a.puntos || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf;

  const directos = ganadores.sort(porMerito).slice(0, GRUPOS_UEFA * CLASIFICAN_POR_GRUPO_UEFA).map(r => r.clubId!);
  const resto = segundos.sort(porMerito);
  const porRepechaje = resto.slice(0, Math.max(0, cupos - directos.length)).map(r => r.clubId!);
  return {
    clasificados: [...directos, ...porRepechaje],
    enLaPuerta: resto.slice(Math.max(0, cupos - directos.length), Math.max(0, cupos - directos.length) + 2).map(r => r.clubId!),
  };
}

/**
 * Clasificación POR FUERZA, para las confederaciones que no se simulan partido a partido.
 *
 * No es un sorteo: se ordena por fuerza de plantel, que es el mismo número con el que el motor
 * simula cualquier partido (clubStrength). Un poco de ruido para que no sea idéntico todas las
 * ediciones -- en la vida real también se cae alguno de los grandes.
 */
export function clasificadosPorFuerza(conf: Confederacion, todas: Club[], semilla: number): string[] {
  const cupos = CUPOS_POR_CONFEDERACION[conf];
  const equipos = seleccionesDe(conf, todas);
  const ruido = (id: string) => {
    // Determinístico por selección y edición: el mismo save ve siempre lo mismo.
    const h = Math.sin(([...id].reduce((a, c) => a + c.charCodeAt(0), 0) + semilla) * 12.9898) * 43758.5453;
    return (h - Math.floor(h)) - 0.5;   // -0.5 .. 0.5
  };
  return [...equipos]
    .sort((a, b) => (clubStrength(b) + ruido(b.id) * 25) - (clubStrength(a) + ruido(a.id) * 25))
    .slice(0, cupos)
    .map(t => t.id);
}

/**
 * Las 48 del Mundial: lo que dejaron las eliminatorias jugadas, más las que clasifican por fuerza,
 * más el repechaje.
 *
 * Si faltara alguna -- una eliminatoria a medio jugar, una confederación sin selecciones cargadas --
 * se completa con las más fuertes que hayan quedado afuera. El Mundial SIEMPRE tiene 48: quedarse
 * corto rompería el sorteo de 12 grupos de 4.
 */
export function seleccionesDelMundial(
  mundial: number,
  jugadas: EliminatoriaState[],
  todas: Club[],
  plazas = 48,
): string[] {
  const dentro: string[] = [];
  const puerta: string[] = [];

  for (const conf of ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'] as Confederacion[]) {
    const e = jugadas.find(x => x.confederacion === conf && x.mundial === mundial);
    if (e && eliminatoriaTerminada(e)) {
      const r = clasificadosDe(e);
      dentro.push(...r.clasificados);
      puerta.push(...r.enLaPuerta);
    } else {
      dentro.push(...clasificadosPorFuerza(conf, todas, mundial));
    }
  }

  // Repechaje: los mejores que quedaron a las puertas, por fuerza.
  const fuerza = (id: string) => clubStrength(todas.find(t => t.id === id)!) || 0;
  const yaEsta = new Set(dentro);
  const repechaje = puerta.filter(id => !yaEsta.has(id)).sort((a, b) => fuerza(b) - fuerza(a));
  for (const id of repechaje.slice(0, REPECHAJE_INTERCONTINENTAL)) { dentro.push(id); yaEsta.add(id); }

  // Relleno, si algo faltó. Nunca debería hacer falta, pero un Mundial de 47 no se puede sortear.
  if (dentro.length < plazas) {
    const sobrantes = todas
      .filter(t => !yaEsta.has(t.id) && CONFEDERACION_POR_SELECCION[t.id])
      .sort((a, b) => clubStrength(b) - clubStrength(a));
    for (const t of sobrantes) {
      if (dentro.length >= plazas) break;
      dentro.push(t.id); yaEsta.add(t.id);
    }
  }
  return dentro.slice(0, plazas);
}


// --- LA EUROCOPA Y LA COPA AMÉRICA -------------------------------------------------------------
//
// Los dos torneos continentales de selecciones. Van en junio/julio de los años PARES que no son de
// Mundial, que es lo que fija el Calendario Internacional de la FIFA (ver
// docs/CALENDARIO_INTERNACIONAL_FIFA.md): Mundial 2026, Eurocopa y Copa América 2028, Mundial 2030.
//
// El IMC no da los días exactos de la edición 2028 -- dice "junio/julio" y nada más --, así que el
// juego reserva la ventana y el motor sortea los grupos. Los cruces no calcan un sorteo real
// porque no existe todavía: se arman con la misma serpiente de fuerza que ya usa el Mundial.

/**
 * Las selecciones que juegan la EUROCOPA: las 24 mejores de la UEFA.
 *
 * En la realidad salen de una clasificación propia; acá se toman por fuerza, que es el mismo
 * criterio con el que el juego arma todo lo que no tiene datos reales. La base tiene 54 selecciones
 * de la UEFA, así que sobra de dónde elegir.
 */
export function seleccionesDeLaEurocopa(todas: Club[]): Club[] {
  return porFuerza(seleccionesDe('UEFA', todas)).slice(0, 24);
}

/**
 * Las selecciones que juegan la COPA AMÉRICA: las 10 de Conmebol más 6 invitadas de Concacaf.
 *
 * Las diez sudamericanas juegan siempre -- son todas las que hay -- y las seis invitadas se eligen
 * por fuerza entre las de Concacaf, que es lo que hace la Conmebol al invitar.
 */
export function seleccionesDeLaCopaAmerica(todas: Club[]): Club[] {
  const sudamericanas = seleccionesDe('CONMEBOL', todas);
  const invitadas = porFuerza(seleccionesDe('CONCACAF', todas)).slice(0, 6);
  return [...porFuerza(sudamericanas), ...invitadas];
}

/** De más fuerte a más débil. El sorteo por serpiente las reparte después. */
function porFuerza(equipos: Club[]): Club[] {
  return [...equipos].sort((a, b) => (b.reputation ?? 0) - (a.reputation ?? 0)
    || a.name.localeCompare(b.name));
}

/** El torneo continental que le toca a esta confederación, o null si no tiene. */
export function torneoContinentalDe(conf: Confederacion | undefined): 'eurocopa' | 'copaamerica' | null {
  if (conf === 'UEFA') return 'eurocopa';
  // Los de Concacaf entran como invitados a la Copa América. La Copa Oro queda para otro día: el
  // IMC la tiene en 2027 y 2029, o sea en los años impares, y son otras fechas.
  if (conf === 'CONMEBOL' || conf === 'CONCACAF') return 'copaamerica';
  return null;
}
