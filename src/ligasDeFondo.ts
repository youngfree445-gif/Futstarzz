// LAS OTRAS LIGAS DEL MUNDO, corriendo sin vos.
//
// ---------------------------------------------------------------------------------------------
// EL PROBLEMA
// ---------------------------------------------------------------------------------------------
//
// En Copas y Tablas se puede elegir cualquier liga del juego, y todas las que no fueran la tuya
// salían con los veinte equipos en cero. Reportado tal cual: "puedo ver las tablas de otras ligas
// pero todas me salen en 0, ¿por qué?".
//
// La causa: una tabla sólo existe si hay una temporada guardada para esa liga en tu partida, y
// `leagueSeasons` sólo se llena con la liga del club al que llegás. Al mirar cualquier otra,
// `getOrCreateSeasonForLeague` devolvía una temporada nueva -- tabla en cero -- que además no se
// guardaba: la próxima vez se volvía a crear igual de vacía. Y el que hace avanzar una tabla
// (`resolvePlayerWeekForLeague`) se llama en tres lugares, los tres dentro del flujo de TU partido.
// O sea que sólo tu liga se jugaba.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ESTO ES DETERMINISTA Y NO SE GUARDA NADA
// ---------------------------------------------------------------------------------------------
//
// La idea original era guardar la tabla de cada liga en la partida. No hace falta, y guardarla
// habría sido peor por dos motivos:
//
//   1. `simulateMatch` tira `Math.random()`. Recalcular una tabla desde cero daba un resultado
//      distinto cada vez, así que había que guardarla para que no bailara sola... y guardarla en un
//      save que ya roza el tope de localStorage (hay un aviso para eso), 27 ligas de 20 equipos.
//   2. Con la SEMILLA el problema desaparece de raíz: el marcador de un partido de fondo sale de
//      `fecha|local|visitante`, así que es SIEMPRE el mismo. La tabla de la Premier de tu carrera es
//      idéntica la mires en la fecha 10 o en la 40, y no ocupa un byte en el archivo.
//
// Es la misma decisión que ya había tomado `generateLeagueLeadersFromTable` -- sembrar en vez de
// sortear -- y por el mismo motivo: "nunca cambia si la tabla no cambió".
//
// ---------------------------------------------------------------------------------------------
// LO QUE ESTO NO TOCA
// ---------------------------------------------------------------------------------------------
//
// El camino de TU liga. Ahí siguen mandando tus resultados de verdad, con sus fixtures guardados y
// su resolución incremental (ver resolveLigaPorFecha). Esto es solamente para las ligas en las que
// no jugaste nunca: si una liga tiene temporada guardada, la guardada gana siempre.

import type { Club, TableTeam } from './types';
import { buildInitialTable, clubStrength, sortTable } from './leagueEngine';
import { ligaDeClubes, competicionEnTemporada } from './seasonCalendar';

/** Jugar de local, en la misma escala que clubStrength. El mismo número que usa simulateMatch. */
const VENTAJA_DE_LOCAL = 4;

/**
 * Un dado con memoria: la misma cadena da siempre la misma secuencia.
 *
 * Es un generador congruencial chico. No hace falta que sea bueno -- hace falta que sea REPETIBLE,
 * que es lo único que esta pantalla necesita.
 */
function dadoSembrado(semilla: string): () => number {
  let h = 0;
  for (let i = 0; i < semilla.length; i++) h = (h * 31 + semilla.charCodeAt(i)) | 0;
  let estado = Math.abs(h) || 1;
  return () => {
    estado = (estado * 1103515245 + 12345) & 0x7fffffff;
    return estado / 0x7fffffff;
  };
}

/** Poisson, con el dado que le pasen. Misma forma que la de leagueEngine. */
function poisson(lambda: number, dado: () => number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= dado();
  } while (p > L);
  return k - 1;
}

/**
 * El marcador de un partido de fondo. Siempre el mismo para la misma fecha y los mismos dos clubes.
 *
 * Las cuentas son las de `simulateMatch` -- diferencia de fuerza, tope de 0,9, los mismos goles
 * esperados -- porque si el mundo de fondo usara otra fórmula, la tabla de la Premier no diría lo
 * mismo que diría si vos jugaras en la Premier.
 */
export function marcadorDeFondo(local: Club, visita: Club, fecha: string): { local: number; visita: number } {
  const dado = dadoSembrado(`${fecha}|${local.id}|${visita.id}`);
  const brecha = clubStrength(local) + VENTAJA_DE_LOCAL - clubStrength(visita);
  const vuelco = Math.max(-0.9, Math.min(0.9, brecha / 30));
  return {
    local: poisson(Math.max(0.25, 1.45 + vuelco), dado),
    visita: poisson(Math.max(0.25, 1.25 - vuelco), dado),
  };
}

/** Suma un resultado a la tabla. */
function anotar(tabla: TableTeam[], local: string, visita: string, gl: number, gv: number): void {
  const casa = tabla.find(t => t.name === local);
  const fuera = tabla.find(t => t.name === visita);
  if (!casa || !fuera) return;
  casa.pj++; fuera.pj++;
  casa.gf += gl; casa.gc += gv;
  fuera.gf += gv; fuera.gc += gl;
  if (gl > gv) { casa.g++; casa.puntos += 3; fuera.p++; }
  else if (gl < gv) { fuera.g++; fuera.puntos += 3; casa.p++; }
  else { casa.e++; fuera.e++; casa.puntos++; fuera.puntos++; }
}

/**
 * LA TABLA DE UNA LIGA EN LA QUE NO JUGÁS, al día de hoy.
 *
 * Devuelve null si ese grupo de clubes no es una liga del calendario -- que es lo mismo que
 * contesta el motor de verdad, y significa "de esta liga no hay fechas que resolver".
 */
export function tablaDeFondo(clubes: Club[], fecha: string, temporada: number): TableTeam[] | null {
  if (!clubes.length) return null;
  const base = ligaDeClubes(new Set(clubes.map(c => c.name)));
  if (!base) return null;
  const comp = competicionEnTemporada(base, temporada);

  const porNombre = new Map<string, Club>();
  for (const c of clubes) porNombre.set(c.name, c);

  const tabla = buildInitialTable(clubes);
  for (const m of comp.matches) {
    if (m.date > fecha) continue;
    const local = porNombre.get(m.home);
    const visita = porNombre.get(m.away);
    // Club del calendario que no está en data.ts: se saltea, igual que hace el motor.
    if (!local || !visita) continue;
    const r = marcadorDeFondo(local, visita, m.date);
    anotar(tabla, m.home, m.away, r.local, r.visita);
  }
  return sortTable(tabla);
}
