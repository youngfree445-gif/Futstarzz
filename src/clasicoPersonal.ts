// TU CLÁSICO PERSONAL: el rival que es tuyo, no de tu club.
//
// ---------------------------------------------------------------------------------------------
// LO QUE YA HABÍA Y LO QUE FALTABA
// ---------------------------------------------------------------------------------------------
//
// `headToHeadRecords` lleva la cuenta contra cada rival desde hace mucho, y se usaba en dos lados:
// un post en el feed DESPUÉS del partido, y una línea del documental de retiro.
//
// Le faltaban las dos cosas que lo vuelven una historia:
//
//   1. GUARDABA EL RESULTADO DEL CLUB, NO LO TUYO. Ganaste, empataste, perdiste. Pero "le hice
//      nueve goles en doce partidos" es un dato sobre VOS, y no estaba en ningún lado.
//   2. SALÍA DESPUÉS. Un historial que aparece cuando el partido ya terminó es una estadística. El
//      mismo historial ANTES del partido es una expectativa, y una expectativa es lo único que
//      convierte una fecha cualquiera de mitad de temporada en un partido que querés jugar.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ NO ES UN CLÁSICO DE CATÁLOGO
// ---------------------------------------------------------------------------------------------
//
// Los clásicos de verdad ya existen en src/clasicos.ts: Boca-River, el que sea. Ésos son del club y
// vienen dados.
//
// Éste te lo ganás vos, jugando, y por eso puede ser cualquiera: el equipo mediano al que le hiciste
// gol seis veces seguidas, o el que te tiene de hijo hace cuatro años. Dos carreras del mismo
// jugador en el mismo club terminan con clásicos personales distintos.
//
// ---------------------------------------------------------------------------------------------
// LA REGLA NO EXAGERA
// ---------------------------------------------------------------------------------------------
//
// Todo lo que dice la prensa acá sale de contar, nunca de interpretar: cuántas veces jugaste, cuánto
// hiciste, cuántas ganaste. Si los números no dicen nada llamativo, no hay clásico -- y no pasa
// nada, porque la mayoría de los rivales son eso: rivales.

/** Contra cuántos cruces empieza a tener sentido hablar de historia. */
export const PARTIDOS_PARA_QUE_SEA_CLASICO = 4;

/** Goles tuyos por partido contra ese rival a partir de los cuales sos su problema. */
export const GOLES_POR_PARTIDO_DE_PESADILLA = 0.7;

export interface CruceConUnRival {
  rivalName: string;
  wins: number;
  draws: number;
  losses: number;
  lastMeetingWeek: number;
  /** Goles TUYOS contra ellos. Opcional: las partidas viejas no lo tienen. */
  goles?: number;
  /** Asistencias tuyas contra ellos. Opcional por lo mismo. */
  asistencias?: number;
}

export type TipoDeClasico = 'pesadilla' | 'muro' | 'historia';

export interface ClasicoPersonal {
  rivalName: string;
  tipo: TipoDeClasico;
  partidos: number;
  goles: number;
  /** El titular de la previa. Todo lo que dice sale de contar. */
  titular: string;
  /** El detalle, con los números a la vista. */
  detalle: string;
}

/**
 * ¿Tenés historia con este rival?
 *
 * Devuelve null si los números no dicen nada -- que es lo normal y está bien. Un clásico personal
 * contra cada equipo de la liga no sería un clásico personal.
 */
export function clasicoPersonalContra(cruce: CruceConUnRival | undefined | null): ClasicoPersonal | null {
  if (!cruce) return null;
  const partidos = cruce.wins + cruce.draws + cruce.losses;
  if (partidos < PARTIDOS_PARA_QUE_SEA_CLASICO) return null;

  const goles = cruce.goles ?? 0;
  const asistencias = cruce.asistencias ?? 0;
  const porPartido = goles / partidos;

  // 1. SOS SU PESADILLA. El dato más fuerte que puede haber, y es tuyo, no del club.
  if (porPartido >= GOLES_POR_PARTIDO_DE_PESADILLA) {
    return {
      rivalName: cruce.rivalName, tipo: 'pesadilla', partidos, goles,
      titular: `${cruce.rivalName} lo sufre`,
      detalle: `${goles} goles en ${partidos} partidos contra ellos${asistencias > 0 ? ` y ${asistencias} asistencias` : ''}. No es casualidad: es su cliente.`,
    };
  }

  // 2. ES TU MURO. Dos formas de serlo, y las dos hay que decirlas con los números y no con
  //    adjetivos: o nunca les hiciste un gol, o te vienen ganando de sobra.
  if (goles === 0) {
    return {
      rivalName: cruce.rivalName, tipo: 'muro', partidos, goles,
      titular: `Contra ${cruce.rivalName} no le sale`,
      detalle: `${partidos} partidos y ni un gol. Hay equipos que se le dan y hay equipos que no.`,
    };
  }
  if (cruce.losses >= cruce.wins + 3) {
    return {
      rivalName: cruce.rivalName, tipo: 'muro', partidos, goles,
      titular: `${cruce.rivalName} lo tiene de hijo`,
      detalle: `${cruce.losses} derrotas contra ${cruce.wins} victorias en ${partidos} cruces. Una cuenta pendiente de verdad.`,
    };
  }

  // 3. Y SI NO, LA PURA HISTORIA: jugarse tantas veces ya es algo, aunque esté parejo.
  if (partidos >= 8) {
    return {
      rivalName: cruce.rivalName, tipo: 'historia', partidos, goles,
      titular: `Otra vez ${cruce.rivalName}`,
      detalle: `${partidos} veces se cruzaron: ${cruce.wins}-${cruce.draws}-${cruce.losses} y ${goles} goles suyos. Ya se conocen de memoria.`,
    };
  }

  return null;
}

/**
 * El clásico personal MÁS FUERTE de toda la carrera, para el documental.
 *
 * La pesadilla le gana al muro y el muro a la historia: se cuenta lo más llamativo, no lo más
 * repetido.
 */
export function elClasicoDeTuCarrera(cruces: CruceConUnRival[]): ClasicoPersonal | null {
  const peso: Record<TipoDeClasico, number> = { pesadilla: 3, muro: 2, historia: 1 };
  const todos = cruces.map(clasicoPersonalContra).filter((c): c is ClasicoPersonal => !!c);
  if (!todos.length) return null;
  return todos.sort((a, b) =>
    peso[b.tipo] - peso[a.tipo] || b.goles - a.goles || b.partidos - a.partidos)[0];
}
