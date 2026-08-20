// El compañero que te pelea el puesto.
//
// QUÉ HABÍA ANTES. Existía `fichajeRival`: al empezar una temporada podía aparecer un refuerzo para
// tu posición, con nombre, y durante diez fechas te costaba un poco más ser titular. Después se
// diluía solo. Nunca jugaba, nunca marcaba, nunca pasaba nada con él -- era un número invisible con
// un nombre encima. Y sólo aparecía si tu prestigio era menor a 85, o sea que se apagaba justo
// cuando la carrera se queda sin nada en juego.
//
// QUÉ ES AHORA. Un rival que hace su carrera en paralelo a la tuya, en el mismo puesto:
//
//   . Cuando VOS no jugás, juega ÉL. Y le va bien o le va mal, y se te cuenta.
//   . Sus números se acumulan y se pueden mirar al lado de los tuyos.
//   . Si te saca ventaja, al DT le cuesta más ponerte; si vos la sacás, se va al banco.
//   . No se diluye con el tiempo: se resuelve jugando.
//
// La diferencia que importa no es de balance sino de lectura: perder el puesto por un ajuste
// invisible se siente un bug, y perderlo porque Sanabria metió tres en las dos fechas que estuviste
// afuera se siente fútbol.

export interface RivalDePuesto {
  nombre: string;
  posicion: string;
  /** Paso en que llegó. Se conserva para los posts de ChutSocial que ya existían. */
  desdeSemana: number;
  /** Su nivel, 60 a 90. Marca qué tan seguido le sale un partidazo cuando le toca jugar. */
  nivel?: number;
  partidos?: number;
  goles?: number;
  asistencias?: number;
  /** Suma de sus notas, para poder sacar el promedio sin guardar la lista entera. */
  sumaDeNotas?: number;
}

/** Lo que hizo el rival en un partido que vos no jugaste. */
export interface FechaDelRival {
  nota: number;
  goles: number;
  asistencias: number;
}

/**
 * El rival juega la fecha que vos no jugaste.
 *
 * Su rendimiento sale de su nivel y nada más: no mira el resultado del partido ni el rival de turno.
 * Podría hacerlo, pero sería atarlo a un montón de estado por una ganancia que el jugador no puede
 * distinguir -- lo que se ve es "metió dos", no de dónde salió el dos.
 */
export function jugarFechaDelRival(nivel: number, azar: () => number = Math.random): FechaDelRival {
  // La nota se mueve alrededor de su nivel: un 60 promedia 6.0 y un 90 promedia 7.5.
  const base = 4.8 + (nivel - 60) * 0.055;
  const nota = Math.max(3.5, Math.min(10, base + (azar() - 0.35) * 3));

  // Un partidazo suyo pega más fuerte que uno bueno: es lo que te saca del equipo.
  const chanceDeGol = 0.10 + (nivel - 60) * 0.006;
  const goles = azar() < chanceDeGol ? (azar() < 0.18 ? 2 : 1) : 0;
  const asistencias = azar() < chanceDeGol * 0.8 ? 1 : 0;
  return { nota: Number(nota.toFixed(1)), goles, asistencias };
}

/** Anota la fecha en el rival y devuelve el rival actualizado. */
export function anotarFechaDelRival(rival: RivalDePuesto, fecha: FechaDelRival): RivalDePuesto {
  return {
    ...rival,
    partidos: (rival.partidos ?? 0) + 1,
    goles: (rival.goles ?? 0) + fecha.goles,
    asistencias: (rival.asistencias ?? 0) + fecha.asistencias,
    sumaDeNotas: (rival.sumaDeNotas ?? 0) + fecha.nota,
  };
}

/** Su promedio de nota, o null si todavía no jugó. */
export function promedioDelRival(rival: RivalDePuesto): number | null {
  const n = rival.partidos ?? 0;
  if (!n) return null;
  return Number(((rival.sumaDeNotas ?? 0) / n).toFixed(1));
}

/**
 * CUÁNTO TE CUESTA EL PUESTO POR CULPA DE ÉL.
 *
 * Devuelve puntos que se suman al umbral de titularidad, igual que el ajuste de forma. Positivo es
 * más difícil ser titular.
 *
 * Antes esto era `14 * (1 - fechas/10)`: dependía sólo del tiempo transcurrido, así que el rival se
 * apagaba solo aunque estuviera metiendo goles, y no había forma de que vos le ganaras el puesto
 * jugando bien -- había que esperar.
 *
 * Ahora depende de lo que HIZO. Si no jugó todavía, pesa por ser nuevo (que es real: un fichaje
 * llega con crédito). Apenas juega, manda su rendimiento.
 */
export const PESO_MAXIMO_DEL_RIVAL = 16;

export function estorboDelRival(rival: RivalDePuesto | undefined, pasoActual: number): number {
  if (!rival) return 0;
  const jugados = rival.partidos ?? 0;

  // Todavía no jugó: pesa el crédito de recién llegado, que se va en diez fechas.
  if (jugados === 0) {
    const fechas = pasoActual - rival.desdeSemana;
    if (fechas < 0 || fechas > 10) return 0;
    return Math.round(14 * (1 - fechas / 10));
  }

  // Ya jugó: manda su promedio. Un 7.5 lo vuelve intocable; un 5.5 lo manda al banco solo.
  const promedio = promedioDelRival(rival) ?? 6;
  const porNota = (promedio - 6.3) * 10;          // -28 a +37 aprox
  const porGoles = ((rival.goles ?? 0) + (rival.asistencias ?? 0) * 0.6) * 2.5;
  return Math.round(Math.max(-PESO_MAXIMO_DEL_RIVAL, Math.min(PESO_MAXIMO_DEL_RIVAL, porNota + porGoles)));
}

/** Lo que hay que contarle al jugador después de una fecha que se perdió. */
export function cronicaDelRival(rival: RivalDePuesto, fecha: FechaDelRival): string {
  const partes: string[] = [];
  if (fecha.goles === 1) partes.push('marcó');
  else if (fecha.goles > 1) partes.push(`marcó ${fecha.goles}`);
  if (fecha.asistencias) partes.push('dio una asistencia');
  const hizo = partes.length ? partes.join(' y ') : (fecha.nota >= 6.5 ? 'cumplió' : 'pasó desapercibido');
  return `${rival.nombre} jugó en tu puesto y ${hizo} (${fecha.nota}).`;
}
