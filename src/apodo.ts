// EL APODO: cómo te bautiza la prensa según cómo jugás de verdad.
//
// LA IDEA. El juego sabe muchísimo sobre vos -- con qué atributo resolvés las jugadas, cuántos goles
// hacés por partido, cuántas tarjetas te comés, contra quién aparecés -- y nunca te lo dice. Habla
// de vos en genérico: "el jugador", "Camilo Restrepo". Un apodo es la forma más barata de que todo
// lo que el juego ya mide se vuelva identidad.
//
// Y NO SE ELIGE. Ésa es la mitad del punto. No es un campo de la creación de personaje: se GANA con
// lo que hiciste en la cancha, así que dos carreras del mismo jugador con la misma ficha pueden
// terminar con apodos distintos. Es el juego devolviéndote una lectura de tu propia carrera.
//
// Cambia si vos cambiás: un volante que se convierte en goleador se lo gana de nuevo. Por eso se
// calcula cada vez y no se guarda -- guardarlo sería congelar una foto de lo que fuiste.

import type { PlayerStats } from './types';

/** Cuántos partidos hacen falta antes de que la prensa se anime a bautizarte. */
export const PARTIDOS_PARA_APODO = 25;

/** Qué fracción de tus jugadas resueltas tiene que salir de un atributo para que te defina. */
export const DOMINIO_MINIMO = 0.32;

export interface DatosDelApodo {
  partidos: number;
  goles: number;
  asistencias: number;
  amarillas: number;
  rojas: number;
  posicion: string;
  /** Cuántas jugadas resolviste con cada atributo. Ver jugadasPorAtributo en PlayerProfile. */
  jugadas?: Partial<Record<keyof PlayerStats, number>>;
}

export interface Apodo {
  apodo: string;
  /** Qué hiciste para ganártelo. Sin esto es un adorno; con esto es una lectura de tu carrera. */
  porque: string;
}

// Un apodo por atributo dominante, con variante para el que además hace goles. Están escritos con
// el vocabulario de la cancha y no con el de una ficha técnica: nadie le dice a nadie "el de
// atributo pase alto".
const POR_ATRIBUTO: Record<keyof PlayerStats, { normal: string; goleador: string }> = {
  ritmo:   { normal: 'La Flecha',    goleador: 'El Rayo' },
  regate:  { normal: 'El Mago',      goleador: 'La Joya' },
  tiro:    { normal: 'El Zurdazo',   goleador: 'El Killer' },
  pase:    { normal: 'El Profesor',  goleador: 'El Arquitecto' },
  defensa: { normal: 'El Muro',      goleador: 'El General' },
  fisico:  { normal: 'El Tanque',    goleador: 'La Bestia' },
};

/**
 * El apodo que te ganaste, o null si todavía no jugaste lo suficiente.
 *
 * El orden importa y es deliberado: primero lo EXCEPCIONAL, después lo característico. Un jugador
 * que promedia gol por partido es "La Máquina" aunque los meta de cabeza; recién si no hay nada
 * excepcional se mira con qué resolvés las jugadas.
 */
export function apodoDe(d: DatosDelApodo): Apodo | null {
  if (d.partidos < PARTIDOS_PARA_APODO) return null;

  const golesPorPartido = d.goles / d.partidos;
  const aporte = (d.goles + d.asistencias) / d.partidos;
  const tarjetasPorPartido = (d.amarillas + d.rojas * 3) / d.partidos;

  // 1. Lo excepcional manda.
  if (golesPorPartido >= 0.85) {
    return { apodo: 'La Máquina', porque: `${d.goles} goles en ${d.partidos} partidos. No es una racha: es lo que sos.` };
  }
  if (aporte >= 0.9 && d.asistencias > d.goles) {
    return { apodo: 'El Repartidor', porque: `${d.asistencias} asistencias. Los goles los hacen otros, pero los pensás vos.` };
  }
  if (tarjetasPorPartido >= 0.55) {
    return { apodo: 'El Carnicero', porque: `${d.amarillas} amarillas y ${d.rojas} rojas. La prensa te lo dice con miedo y la hinchada con cariño.` };
  }

  // 2. Lo característico: con qué resolvés.
  const jugadas = d.jugadas ?? {};
  const total = Object.values(jugadas).reduce((a, b) => a + (b ?? 0), 0);
  if (total >= 20) {
    const orden = (Object.entries(jugadas) as [keyof PlayerStats, number][])
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
    const [attr, veces] = orden[0];
    if (veces / total >= DOMINIO_MINIMO) {
      const esGoleador = golesPorPartido >= 0.4;
      const nombre = POR_ATRIBUTO[attr][esGoleador ? 'goleador' : 'normal'];
      const pct = Math.round((veces / total) * 100);
      return { apodo: nombre, porque: `${pct}% de tus jugadas las resolvés con ${attr}. Es tu marca.` };
    }
  }

  // 3. Y si nada te define todavía, la prensa lo dice tal cual. Un apodo tibio es peor que ninguno.
  return null;
}

/** El texto con el que la prensa te lo pone por primera vez. */
export function bautizoDe(nombre: string, apodo: Apodo, club: string): string {
  return `Ya tiene apodo: en ${club} le dicen "${apodo.apodo}". ${apodo.porque}`;
}
