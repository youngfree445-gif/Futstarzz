// Goleadores de las COPAS, deducidos del cuadro en vez de anotados partido a partido.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ NO SE ANOTAN COMO LOS DE LIGA
// ---------------------------------------------------------------------------------------------
//
// En la liga, cada fecha pasa una sola vez por `handleMatchComplete` y ahí se reparten los goles de
// los otros nueve partidos (ver lideresPorCompeticion.ts). En las copas eso no alcanza, y por dos
// motivos distintos:
//
//   1. **La copa avanza sin vos.** `syncBackgroundCups` la pone al día en CUALQUIER semana --
//      una fecha de liga, una de descanso, una de sanción -- y se detiene sólo ante un partido
//      tuyo pendiente. Anotar en todos esos lugares serían ocho puntos de enganche, y basta que
//      uno se olvide para que la tabla quede corta, o que dos se pisen para que cuente doble.
//   2. **Al quedar eliminado el torneo se termina de una.** `terminarTorneoSinElJugador` resuelve
//      todas las rondas que faltan en una sola llamada.
//
// Pero las copas tienen algo que la liga no: **el estado guarda el historial completo**. Los
// grupos conservan sus seis fechas con marcador, y `tiesByRound` conserva todas las llaves de
// todas las rondas con la ida y la vuelta. O sea que no hace falta anotar nada: la tabla se
// DEDUCE del cuadro cada vez que se mira.
//
// Eso trae tres cosas gratis:
//
//   - **No cambia el formato de la partida.** Nada nuevo que guardar, así que una carrera vieja
//     abre igual y muestra los goleadores de su Libertadores en curso desde el primer vistazo.
//   - **No puede contar doble.** No hay acumulador: se recalcula.
//   - **No adelanta el torneo.** Sólo se leen partidos que el cuadro ya tiene jugados, y el cuadro
//     nunca corre más allá de un partido pendiente del jugador (ver el `playerClubId` de
//     `getOrCreateCupState`).
//
// El precio es que el reparto tiene que ser ESTABLE: si el goleador de la Libertadores cambiara de
// nombre en cada render, sería peor que no tenerlo. Por eso el azar de cada partido se siembra con
// su LUGAR EN EL CUADRO -- la fecha de grupos, o la ronda, la llave y la pierna -- en vez de usar
// Math.random. Ese lugar no se mueve nunca una vez jugado el partido, así que el goleador tampoco.

import { Club, CupState, TwoLegBracket, TwoLegTie, UefaCupState } from './types';
import { DomesticCupState } from './copaNacional';
import { arqueroDe, repartirGoles, repartirTarjetas } from './lideresPorCompeticion';

/** Lo que `anotarEnLideres` acepta: nombre y club siempre, el resto según lo que traiga el partido. */
export interface LineaAnotable {
  nombre: string;
  clubName: string;
  goles?: number;
  asistencias?: number;
  amarillas?: number;
  rojas?: number;
  partidosDeArquero?: number;
  golesRecibidos?: number;
}

/** Un partido ya jugado de una copa, con la identidad de la que sale su semilla de azar. */
export interface PartidoDeCopa {
  /** Único y estable dentro de la copa: de acá sale la semilla del reparto. */
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
}

// --------------------------------------------------------------------------------------------
// SACAR LOS PARTIDOS DEL CUADRO
// --------------------------------------------------------------------------------------------

/** Los partidos jugados de una lista de fixtures (grupos Conmebol, fase de liga UEFA). */
function deFixtures(
  fixtures: readonly { matchweek: number; homeTeamId: string; awayTeamId: string; played: boolean; homeGoals: number | null; awayGoals: number | null }[],
  prefijo: string,
): PartidoDeCopa[] {
  const salida: PartidoDeCopa[] = [];
  for (const f of fixtures) {
    if (!f.played || f.homeGoals == null || f.awayGoals == null) continue;
    salida.push({
      id: `${prefijo}|f${f.matchweek}|${f.homeTeamId}|${f.awayTeamId}`,
      homeTeamId: f.homeTeamId, awayTeamId: f.awayTeamId,
      homeGoals: f.homeGoals, awayGoals: f.awayGoals,
    });
  }
  return salida;
}

/**
 * Las dos piernas de una llave, cada una como su propio partido.
 *
 * La vuelta se da vuelta a propósito: `clubBId` es el local de la vuelta (ver TwoLegTie), así que
 * el arquero de B recibe los goles de A y no al revés. Sin esto, la portería menos vencida salía
 * calculada sobre la localía de la ida en los dos partidos.
 *
 * Una llave a partido único (las finales de Conmebol) sólo tiene ida: se resuelve entera ahí.
 */
function deLlave(tie: TwoLegTie, prefijo: string): PartidoDeCopa[] {
  const salida: PartidoDeCopa[] = [];
  if (tie.firstLegGoalsA != null && tie.firstLegGoalsB != null) {
    salida.push({
      id: `${prefijo}|ida`,
      homeTeamId: tie.clubAId, awayTeamId: tie.clubBId,
      homeGoals: tie.firstLegGoalsA, awayGoals: tie.firstLegGoalsB,
    });
  }
  if (!tie.partidoUnico && tie.secondLegGoalsA != null && tie.secondLegGoalsB != null) {
    salida.push({
      id: `${prefijo}|vuelta`,
      homeTeamId: tie.clubBId, awayTeamId: tie.clubAId,
      homeGoals: tie.secondLegGoalsB, awayGoals: tie.secondLegGoalsA,
    });
  }
  return salida;
}

/** Todas las piernas jugadas de un cuadro de ida y vuelta. */
function deBracket(bracket: TwoLegBracket | null | undefined, prefijo: string): PartidoDeCopa[] {
  if (!bracket) return [];
  return bracket.tiesByRound.flatMap((ronda, r) =>
    ronda.flatMap((tie, i) => deLlave(tie, `${prefijo}|r${r}|${i}`)));
}

/** Libertadores y Sudamericana: seis fechas de grupos y el cuadro desde octavos. */
export function partidosDeCopaConmebol(cup: CupState): PartidoDeCopa[] {
  return [
    ...cup.groups.flatMap(g => deFixtures(g.fixtures, `g${g.id}`)),
    ...deBracket(cup.knockout, 'ko'),
  ];
}

/** Champions y Europa: fase de liga, el playoff de los puestos 9-24, y el cuadro desde octavos. */
export function partidosDeCopaUefa(cup: UefaCupState): PartidoDeCopa[] {
  return [
    ...deFixtures(cup.fixtures, 'lp'),
    ...(cup.playoff ?? []).flatMap((tie, i) => deLlave(tie, `po|${i}`)),
    ...deBracket(cup.knockout, 'ko'),
  ];
}

/** Copa BetPlay y equivalentes: un solo cuadro de ida y vuelta de punta a punta. */
export function partidosDeCopaNacional(cup: DomesticCupState): PartidoDeCopa[] {
  return deBracket(cup.bracket, 'cn');
}

// --------------------------------------------------------------------------------------------
// EL REPARTO, SIEMPRE IGUAL PARA EL MISMO PARTIDO
// --------------------------------------------------------------------------------------------

/**
 * Azar sembrado con el id del partido.
 *
 * `repartirGoles` y `repartirTarjetas` aceptan la función de azar justamente para esto. Con
 * Math.random, cada render de la pantalla sorteaba de nuevo y el goleador del torneo cambiaba de
 * nombre al cambiar de pestaña -- que es el mismo defecto que ya tuvo la tabla de grupos cuando se
 * recreaba en cada render.
 */
function azarSembrado(semilla: string): () => number {
  // Hash de cadena (FNV-1a de 32 bits) -> mulberry32. Alcanza y sobra: no hay nada criptográfico
  // acá, sólo hace falta que la misma entrada dé siempre la misma secuencia.
  let h = 0x811c9dc5;
  for (let i = 0; i < semilla.length; i++) {
    h ^= semilla.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let estado = h >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Convierte los partidos de una copa en líneas de tabla, listas para `anotarEnLideres`.
 *
 * `excluirClubId` es TU club, y saltearlo no es un detalle: tus partidos de copa ya los anota
 * `handleMatchComplete` con los datos REALES (tus goles, tus asistencias, tu tarjeta y el reparto
 * de tus compañeros y del rival). Si además se dedujeran acá, cada partido tuyo contaría dos veces
 * y la tabla te pondría el doble de goles de los que metiste.
 */
export function lineasDeCopa(
  partidos: readonly PartidoDeCopa[],
  clubs: readonly Club[],
  excluirClubId?: string,
): LineaAnotable[] {
  const porId = new Map(clubs.map(c => [c.id, c]));
  const salida: LineaAnotable[] = [];
  for (const p of partidos) {
    if (excluirClubId && (p.homeTeamId === excluirClubId || p.awayTeamId === excluirClubId)) continue;
    const local = porId.get(p.homeTeamId);
    const visita = porId.get(p.awayTeamId);
    if (!local || !visita) continue;
    // Una sola secuencia por partido, compartida por goles y tarjetas de los dos equipos: así el
    // marcador y las amonestaciones de ese partido quedan atados a la misma tirada.
    const azar = azarSembrado(p.id);
    salida.push(
      ...repartirGoles(local.starPlayers ?? [], local.name, p.homeGoals, azar),
      ...repartirGoles(visita.starPlayers ?? [], visita.name, p.awayGoals, azar),
      ...repartirTarjetas(local.starPlayers ?? [], local.name, azar),
      ...repartirTarjetas(visita.starPlayers ?? [], visita.name, azar),
    );
    const arqueroLocal = arqueroDe(local.starPlayers ?? []);
    if (arqueroLocal) {
      salida.push({ nombre: arqueroLocal, clubName: local.name, partidosDeArquero: 1, golesRecibidos: p.awayGoals });
    }
    const arqueroVisita = arqueroDe(visita.starPlayers ?? []);
    if (arqueroVisita) {
      salida.push({ nombre: arqueroVisita, clubName: visita.name, partidosDeArquero: 1, golesRecibidos: p.homeGoals });
    }
  }
  return salida;
}
