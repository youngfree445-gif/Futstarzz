// El rival de carrera: alguien que arrancó cuando vos y al que te comparan toda la vida.
//
// ---------------------------------------------------------------------------------------------
// QUÉ ES Y POR QUÉ NO GUARDA NADA
// ---------------------------------------------------------------------------------------------
//
// Un jugador de otro club, de tu puesto, que sube al mismo tiempo que vos. No es un enemigo: es la
// vara. Cada vez que mirás tus números están al lado de los suyos, y superarlo pesa más que
// superar a cualquiera porque empezaron juntos.
//
// Se DEDUCE, no se guarda -- mismo criterio que lideresDeCopa.ts, animo.ts y rachas.ts:
//
//   - **Quién es** sale de un sorteo sembrado con tu nombre y tu club de origen. La misma carrera
//     saca siempre el mismo rival, y dos carreras distintas sacan rivales distintos.
//   - **Cómo le va** sale de ese mismo sorteo más el paso de la carrera. No depende de tus números:
//     si dependiera, sería un espejo y siempre estarías empatado. Él tiene su propia curva, así que
//     a veces le vas ganando y a veces te sacó cinco goles de ventaja.
//
// Sin campo nuevo no hay migración: una carrera vieja abre y ya tiene su rival, con la historia
// que le corresponde por el paso en el que va.
//
// ---------------------------------------------------------------------------------------------
// LA REGLA DE QUE SEA CREÍBLE
// ---------------------------------------------------------------------------------------------
//
// El rival tiene que ser alguien que el jugador reconozca. Por eso sale de los planteles reales
// (CLUBS_DATABASE, que es la lista con las posiciones puestas -- ver la nota de lideresDeCopa.ts
// sobre ULTIMATE) y de TU PUESTO: un arquero no compite en goles con un nueve, y compararlos sería
// una tabla sin sentido.

import { CareerStats, Club, Position } from './types';

/** Etiquetas de posición de `starPlayers` que corresponden a cada puesto del jugador. */
const PUESTOS: Readonly<Record<Position, readonly string[]>> = {
  Delantero: ['ST', 'CF', 'LW', 'RW'],
  Mediocampista: ['CAM', 'CM', 'CDM', 'LM', 'RM'],
  Defensor: ['CB', 'LB', 'RB'],
  Arquero: ['GK'],
};

export interface RivalDeCarrera {
  nombre: string;
  clubName: string;
  goles: number;
  asistencias: number;
  partidos: number;
  /** Promedio de calificación, para la comparación de los que no viven del gol. */
  promedio: number;
}

/** Misma semilla, misma secuencia. Ver la nota de azarSembrado en lideresDeCopa.ts. */
function azarSembrado(semilla: string): () => number {
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

const limpiarNombre = (figura: string) => figura.replace(/\s*\([^)]*\)\s*$/, '').trim();

/**
 * Quién es tu rival de carrera.
 *
 * Se elige UNA vez por carrera y no cambia nunca, aunque cambies de club: el sentido de la vara es
 * que sea la misma toda la vida. Por eso la semilla lleva el club de ORIGEN y no el actual.
 *
 * Se descarta tu propio club -- competir con un compañero es otra cosa -- y los clubes sin
 * posiciones en el plantel, que darían un rival de puesto desconocido.
 */
export function rivalDeCarrera(
  nombre: string,
  clubDeOrigenId: string,
  posicion: Position,
  clubs: readonly Club[],
): RivalDeCarrera | null {
  const etiquetas = PUESTOS[posicion];
  const candidatos: { nombre: string; clubName: string }[] = [];
  for (const club of clubs) {
    if (club.id === clubDeOrigenId) continue;
    for (const figura of club.starPlayers ?? []) {
      const m = figura.match(/\(([A-Z]{2,3})\)\s*$/);
      if (m && etiquetas.includes(m[1])) {
        candidatos.push({ nombre: limpiarNombre(figura), clubName: club.name });
      }
    }
  }
  if (!candidatos.length) return null;
  const azar = azarSembrado(`${nombre}|${clubDeOrigenId}|${posicion}`);
  const elegido = candidatos[Math.floor(azar() * candidatos.length)];
  return { ...elegido, goles: 0, asistencias: 0, partidos: 0, promedio: 0 };
}

/**
 * Cómo le viene yendo a esta altura de la carrera.
 *
 * Su ritmo es propio y constante: se sortea una vez (con la misma semilla que su nombre, así que
 * dos carreras distintas tienen rivales con techos distintos) y se multiplica por los partidos que
 * lleva. No mira tus números a propósito -- un rival calcado a vos siempre iría empatado y no diría
 * nada. Que a veces te saque cinco goles de ventaja es el punto.
 *
 * `partidosJugados` sale de TU carrera porque los dos arrancaron juntos: es la misma cantidad de
 * fechas transcurridas, no una simulación aparte del calendario de su club.
 */
export function numerosDelRival(
  rival: RivalDeCarrera,
  partidosJugados: number,
  posicion: Position,
): RivalDeCarrera {
  const azar = azarSembrado(`${rival.nombre}|${rival.clubName}|ritmo`);
  // Un delantero de élite ronda 0.55 goles por partido; un defensor, 0.06. Los rangos salen de eso
  // y se sortean una vez, así que el rival tiene un techo propio para toda la carrera.
  const rangos: Record<Position, { gol: [number, number]; asis: [number, number] }> = {
    Delantero: { gol: [0.30, 0.62], asis: [0.10, 0.25] },
    Mediocampista: { gol: [0.12, 0.34], asis: [0.18, 0.40] },
    Defensor: { gol: [0.03, 0.11], asis: [0.04, 0.13] },
    // El arquero no suma ni goles ni asistencias, y no es por realismo estricto -- alguno mete un
    // penal en toda su vida. Es que a un arquero se lo compara por promedio (ver quienVaGanando), y
    // un "1" suelto en la columna de goles al lado de tu 0 se lee como un dato, cuando es ruido.
    Arquero: { gol: [0, 0], asis: [0, 0] },
  };
  const { gol, asis } = rangos[posicion];
  const ritmoGol = gol[0] + azar() * (gol[1] - gol[0]);
  const ritmoAsis = asis[0] + azar() * (asis[1] - asis[0]);
  // Entre 6.4 y 7.9: un rival que promedia 5 no sería una vara, y uno que promedia 9 sería una burla.
  const promedio = 6.4 + azar() * 1.5;
  // Se pierde alguna fecha por lesión o descanso, igual que vos: no juega el 100% de los partidos.
  const suyos = Math.max(0, Math.round(partidosJugados * (0.86 + azar() * 0.12)));
  return {
    ...rival,
    partidos: suyos,
    goles: Math.round(suyos * ritmoGol),
    asistencias: Math.round(suyos * ritmoAsis),
    promedio: Number(promedio.toFixed(1)),
  };
}

export type QuienVaGanando = 'vos' | 'el' | 'parejos';

/**
 * Quién va arriba, con la vara que corresponde al puesto.
 *
 * Un arquero no se mide en goles. Para los que no viven del gol manda el promedio, y para los de
 * arriba manda la suma de goles y asistencias, que es como se los compara de verdad.
 */
export function quienVaGanando(
  mios: Pick<CareerStats, 'golesHistoricos' | 'asistenciasHistoricos' | 'partidosHistoricos' | 'sumaCalificacionesHistoricas'>,
  rival: RivalDeCarrera,
  posicion: Position,
): QuienVaGanando {
  if (posicion === 'Arquero' || posicion === 'Defensor') {
    const miPromedio = mios.partidosHistoricos > 0
      ? mios.sumaCalificacionesHistoricas / mios.partidosHistoricos : 0;
    const dif = miPromedio - rival.promedio;
    return Math.abs(dif) < 0.25 ? 'parejos' : dif > 0 ? 'vos' : 'el';
  }
  const yo = mios.golesHistoricos + mios.asistenciasHistoricos;
  const suyo = rival.goles + rival.asistencias;
  // El margen de "parejos" crece con la carrera: dos goles de diferencia son mucho en la fecha 10
  // y nada en la 300. Sin esto, a mitad de carrera el cartel se pasaría de un lado al otro cada
  // partido y dejaría de significar algo.
  const margen = Math.max(2, Math.round((yo + suyo) * 0.05));
  const dif = yo - suyo;
  return Math.abs(dif) <= margen ? 'parejos' : dif > 0 ? 'vos' : 'el';
}

/** La frase de la comparación, que es lo que se lee en la pantalla. */
export function rotuloDeLaComparacion(quien: QuienVaGanando, rival: RivalDeCarrera): string {
  switch (quien) {
    case 'vos': return `Le vas ganando la pulseada a ${rival.nombre}.`;
    case 'el': return `${rival.nombre} te viene sacando ventaja.`;
    default: return `Van parejos con ${rival.nombre}. Cualquier temporada lo define.`;
  }
}
