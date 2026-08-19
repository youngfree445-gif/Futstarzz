// Ascenso y descenso: los ALGORITMOS. La tabla por liga vive en reglamentos.ts, junto al resto
// del reglamento de cada una -- cuántos torneos reparte el año, cómo se define el título, cuál es
// su copa nacional. Eran dos tablas indexadas por el mismo nombre de liga.
//
// Ascenso y descenso, según los reglamentos reales.
//   docs/REGLAMENTO_COLOMBIA_2026.md  (Dimayor V0 14/01/26)
//   docs/REGLAMENTO_ARGENTINA_2026.md (AFA / LPF, Boletín 6616)
//
//   https://en.wikipedia.org/wiki/Dutch_football_league_system (KNVB)
//
// Por eso cada país tiene su propia función y su propia constante de cupos. La puerta de entrada
// es `reglasDeLiga`, que devuelve null para cualquier liga sin sistema implementado: así ninguna
// otra liga hereda por accidente las reglas de las demás.

/** Lo que un club sumó en un año de liga. Es la base de las dos tablas. */

import { type ReglasAscenso, type SistemaAscenso, reglasDeLiga } from './reglamentos';
export { type ReglasAscenso, type SistemaAscenso, reglasDeLiga };

export interface RegistroAnual {
  clubId: string;
  league: string;   // para no cruzar países al calcular
  year: number;     // año de carrera (1, 2, 3...)
  puntos: number;
  partidos: number;
  // Desempates. Opcionales porque las partidas viejas se guardaron sin ellos: si faltan, el
  // desempate cae en 0 y el orden lo decide el puntaje, que es como venía funcionando.
  victorias?: number;
  golesFavor?: number;
  golesContra?: number;
}

export interface FilaDescenso {
  clubId: string;
  clubName: string;
  puntos: number;
  partidos: number;
  /** puntos ÷ partidos en Colombia; los puntos del año en Argentina, Holanda y Brasil. */
  valor: number;
  anios: number;
  victorias: number;
  golesFavor: number;
  golesContra: number;
}

/**
 * La tabla que decide el descenso, con el criterio del país.
 *
 * Ordena de mejor a peor: los últimos `cuposDescenso` son los que bajan.
 */
export function tablaDeDescenso(
  registros: readonly RegistroAnual[],
  league: string,
  anioActual: number,
  nombreDe: (clubId: string) => string,
): FilaDescenso[] {
  const reglas = reglasDeLiga(league);
  if (!reglas) return [];

  const desde = anioActual - reglas.ventanaAnios + 1;
  type Acum = {
    puntos: number; partidos: number; anios: Set<number>;
    victorias: number; golesFavor: number; golesContra: number;
  };
  const porClub = new Map<string, Acum>();

  for (const r of registros) {
    // Solo esta liga y solo la ventana que corresponde: sin el filtro por liga, un club argentino
    // entraría en la tabla colombiana.
    if (r.league !== league) continue;
    if (r.year < desde || r.year > anioActual) continue;
    const acc = porClub.get(r.clubId)
      ?? { puntos: 0, partidos: 0, anios: new Set<number>(), victorias: 0, golesFavor: 0, golesContra: 0 };
    acc.puntos += r.puntos;
    acc.partidos += r.partidos;
    acc.victorias += r.victorias ?? 0;
    acc.golesFavor += r.golesFavor ?? 0;
    acc.golesContra += r.golesContra ?? 0;
    acc.anios.add(r.year);
    porClub.set(r.clubId, acc);
  }

  return [...porClub.entries()]
    .map(([clubId, a]) => ({
      clubId,
      clubName: nombreDe(clubId),
      puntos: a.puntos,
      partidos: a.partidos,
      // Sin partidos jugados el promedio no existe: queda en 0 y el club cae al fondo, que es lo
      // correcto para uno sin datos.
      valor: reglas.criterioDescenso === 'promedio'
        ? (a.partidos > 0 ? a.puntos / a.partidos : 0)
        : a.puntos,
      anios: a.anios.size,
      victorias: a.victorias,
      golesFavor: a.golesFavor,
      golesContra: a.golesContra,
    }))
    // Desempate del Brasileirão: más victorias, luego diferencia de gol, luego goles a favor. Da
    // igual en las otras ligas -- solo entra a jugar cuando dos clubes empatan en puntos, y ahí
    // ordenar por goles siempre es mejor que dejarlo al azar del orden de inserción.
    .sort((x, y) =>
      y.valor - x.valor
      || y.puntos - x.puntos
      || y.victorias - x.victorias
      || (y.golesFavor - y.golesContra) - (x.golesFavor - x.golesContra)
      || y.golesFavor - x.golesFavor);
}

/** Cómo se resolvió cada ascenso, para poder contarlo en pantalla. */
export type ViaAscenso =
  | 'campeon_doble'      // ganó los dos semestres
  | 'lider_anual'        // campeón de un semestre que además lidera la Reclasificación
  | 'gran_final'         // ganó la Gran Final entre los dos campeones
  | 'repechaje'          // ganó el Repechaje
  | 'mejor_del_anio';    // liga sin torneos semestrales: sube el mejor del año

export interface Ascendido {
  clubId: string;
  clubName: string;
  via: ViaAscenso;
}

/**
 * Los dos ascensos de Colombia, con los cuatro caminos del reglamento.
 *
 * El detalle que hace falta respetar: **un campeón de semestre que además lidera la Reclasificación
 * Anual asciende directo, sin jugar la Gran Final**. Fue el caso de Jaguares en 2026 -- «por más que
 * los de Montería pierdan la Gran Final, ya son de Primera por su puesto en la tabla anual».
 *
 * @param campeonApertura  Campeón del primer semestre.
 * @param campeonClausura  Campeón del segundo semestre.
 * @param reclasificacion  Tabla anual acumulada, de mejor a peor.
 * @param ganaLlave        Resuelve una llave a ida y vuelta: devuelve el id del que avanza. Se
 *                         inyecta para que el resultado lo simule el motor y esto quede testeable.
 */
export function ascensosColombia(
  campeonApertura: string | null,
  campeonClausura: string | null,
  reclasificacion: readonly { clubId: string; clubName: string }[],
  ganaLlave: (a: string, b: string) => string,
): Ascendido[] {
  const nombreDe = (id: string) => reclasificacion.find(r => r.clubId === id)?.clubName ?? '';
  const out: Ascendido[] = [];

  // Sin campeones definidos (liga sin formato semestral): suben los dos mejores del año.
  if (!campeonApertura || !campeonClausura) {
    return reclasificacion.slice(0, CUPOS_ASCENSO_COL)
      .map(r => ({ clubId: r.clubId, clubName: r.clubName, via: 'mejor_del_anio' as const }));
  }

  const lider = reclasificacion[0]?.clubId ?? null;

  // Caso 1: el mismo club ganó los dos torneos -> asciende automático, sin Gran Final.
  if (campeonApertura === campeonClausura) {
    out.push({ clubId: campeonApertura, clubName: nombreDe(campeonApertura), via: 'campeon_doble' });
  } else if (campeonApertura === lider || campeonClausura === lider) {
    // Caso 2: uno de los campeones lidera la Reclasificación -> sube directo. El otro campeón
    // conserva su chance en el Repechaje.
    const directo = campeonApertura === lider ? campeonApertura : campeonClausura;
    out.push({ clubId: directo, clubName: nombreDe(directo), via: 'lider_anual' });
  } else {
    // Caso 3: ninguno lidera -> Gran Final entre los dos campeones. El perdedor NO queda afuera:
    // sigue con derecho al Repechaje.
    const ganador = ganaLlave(campeonApertura, campeonClausura);
    out.push({ clubId: ganador, clubName: nombreDe(ganador), via: 'gran_final' });
  }

  // Segundo cupo: Repechaje a ida y vuelta.
  const yaSubio = new Set(out.map(o => o.clubId));
  const perdedorFinal = [campeonApertura, campeonClausura].find(c => !yaSubio.has(c)) ?? null;
  const mejorLibre = reclasificacion.find(r => !yaSubio.has(r.clubId) && r.clubId !== perdedorFinal);

  if (perdedorFinal && mejorLibre) {
    const ganador = ganaLlave(perdedorFinal, mejorLibre.clubId);
    out.push({ clubId: ganador, clubName: nombreDe(ganador), via: 'repechaje' });
  } else {
    // Con ascenso automático y sin perdedor de final, van los dos mejores de la Reclasificación.
    const libres = reclasificacion.filter(r => !yaSubio.has(r.clubId)).slice(0, 2);
    if (libres.length === 2) {
      const ganador = ganaLlave(libres[0].clubId, libres[1].clubId);
      out.push({ clubId: ganador, clubName: nombreDe(ganador), via: 'repechaje' });
    } else if (libres.length === 1) {
      out.push({ clubId: libres[0].clubId, clubName: libres[0].clubName, via: 'mejor_del_anio' });
    }
  }

  return out;
}

const CUPOS_ASCENSO_COL = 2;

/**
 * Los dos ascensos de Argentina (Primera Nacional).
 *
 * Nada que ver con Colombia: acá no hay torneos semestrales ni promedio. Son dos zonas de 18 que
 * juegan todos contra todos a dos ruedas MÁS cruces interzonales -- 36 fechas en total, un cambio
 * de 2026 respecto del año anterior.
 *
 *   1er ascenso: los ganadores de cada zona juegan una Final a PARTIDO ÚNICO en cancha neutral.
 *   2do ascenso: Reducido entre los ubicados 2° a 8° de cada zona, más el perdedor de la Final,
 *                que entra en Segunda Fase y cuenta como 1° a efectos de cruces.
 *
 * @param ganaLlave Resuelve un cruce: devuelve el id del que avanza.
 */
export function ascensosArgentina(
  ganadorZonaA: string | null,
  ganadorZonaB: string | null,
  reducido: readonly { clubId: string; clubName: string }[],
  ganaLlave: (a: string, b: string) => string,
): Ascendido[] {
  const out: Ascendido[] = [];
  const nombreDe = (id: string) =>
    reducido.find(r => r.clubId === id)?.clubName ?? '';

  let perdedorFinal: string | null = null;
  if (ganadorZonaA && ganadorZonaB) {
    const campeon = ganaLlave(ganadorZonaA, ganadorZonaB);
    perdedorFinal = campeon === ganadorZonaA ? ganadorZonaB : ganadorZonaA;
    out.push({ clubId: campeon, clubName: nombreDe(campeon), via: 'gran_final' });
  }

  // Reducido: el perdedor de la Final entra primero, como cabeza de serie.
  const participantes = [
    ...(perdedorFinal ? [{ clubId: perdedorFinal, clubName: nombreDe(perdedorFinal) }] : []),
    ...reducido.filter(r => r.clubId !== ganadorZonaA && r.clubId !== ganadorZonaB),
  ];

  if (participantes.length >= 2) {
    // Se van cruzando el mejor contra el peor hasta que queda uno.
    let vivos = participantes.map(p => p.clubId);
    while (vivos.length > 1) {
      const siguiente: string[] = [];
      // Bye para el mejor ubicado si el cuadro es impar, como en el reglamento.
      if (vivos.length % 2 === 1) siguiente.push(vivos[0]);
      const enJuego = vivos.length % 2 === 1 ? vivos.slice(1) : vivos;
      for (let i = 0; i < enJuego.length / 2; i++) {
        siguiente.push(ganaLlave(enJuego[i], enJuego[enJuego.length - 1 - i]));
      }
      vivos = siguiente;
    }
    if (vivos[0]) out.push({ clubId: vivos[0], clubName: nombreDe(vivos[0]), via: 'repechaje' });
  }

  return out;
}

/**
 * El play-off de promoción/permanencia: un equipo de Primera defiende su plaza contra los de Segunda.
 *
 * Cubre los dos formatos que existen hoy, que NO son el mismo cruce:
 *
 *   Holanda  → seis clubes de Segunda. No es simétrico: el 16° de la Eredivisie entra recién en la
 *              segunda ronda y le alcanza con ganar DOS llaves, mientras los de Segunda tienen que
 *              ganar TRES. Modelarlo parejo le sacaría la ventaja que el reglamento le da.
 *   Alemania → un solo rival, el 3° de la 2. Bundesliga, a ida y vuelta. Sin cuadro previo.
 *
 * @param equipoPrimera  El club de Primera que se juega la categoría. null = no hay play-off.
 * @param deSegunda      Los de Segunda que entran, de mejor a peor (seis en Holanda, uno en Alemania).
 * @param ganaLlave      Resuelve una llave a ida y vuelta: devuelve el id del que avanza.
 * @returns Quién ocupa la plaza: `mantienePrimera` es true si la retuvo el club de Primera.
 */
export function playoffPermanencia(
  equipoPrimera: string | null,
  deSegunda: readonly { clubId: string; clubName: string }[],
  ganaLlave: (a: string, b: string) => string,
): { ganador: string | null; mantienePrimera: boolean } {
  if (!equipoPrimera) return { ganador: null, mantienePrimera: false };
  // Sin rivales no hay nada que jugar y la plaza queda donde está.
  if (deSegunda.length === 0) return { ganador: equipoPrimera, mantienePrimera: true };

  let vivos = deSegunda.map(s => s.clubId);

  // Cuadro previo SOLO entre los de Segunda, para llegar a un único retador. Con un solo rival
  // (Alemania) este bloque no corre y se va derecho a la llave contra el de Primera.
  while (vivos.length > 1) {
    const siguiente: string[] = [];
    // Bye para el mejor ubicado si el cuadro es impar.
    if (vivos.length % 2 === 1) siguiente.push(vivos[0]);
    const enJuego = vivos.length % 2 === 1 ? vivos.slice(1) : vivos;
    for (let i = 0; i < enJuego.length / 2; i++) {
      siguiente.push(ganaLlave(enJuego[i], enJuego[enJuego.length - 1 - i]));
    }
    vivos = siguiente;
  }

  const retador = vivos[0];
  const ganador = ganaLlave(equipoPrimera, retador);
  return { ganador, mantienePrimera: ganador === equipoPrimera };
}

/**
 * El play-off de ascenso español: la tercera plaza a Primera, entre el 3° y el 6° de Hypermotion.
 *
 * Se diferencia del anterior en que **ningún club de Primera participa**: LaLiga ya cerró sus tres
 * descensos por tabla, y esto solo decide cuál de los cuatro de Segunda acompaña a los dos que
 * subieron directo. Formato: semifinales y final, todo a ida y vuelta, cruzándose 3°-6° y 4°-5°.
 *
 * @param candidatos Del 3° al 6° de Segunda, en orden de tabla.
 * @returns El id del que asciende, o null si no hay cuadro suficiente.
 */
export function playoffAscensoEspana(
  candidatos: readonly { clubId: string; clubName: string }[],
  ganaLlave: (a: string, b: string) => string,
): string | null {
  if (candidatos.length === 0) return null;
  // Con un solo candidato sube directo: no hay contra quién jugar.
  if (candidatos.length === 1) return candidatos[0].clubId;

  let vivos = candidatos.map(c => c.clubId);
  while (vivos.length > 1) {
    const siguiente: string[] = [];
    if (vivos.length % 2 === 1) siguiente.push(vivos[0]);
    const enJuego = vivos.length % 2 === 1 ? vivos.slice(1) : vivos;
    // Mejor contra peor, como el 3°-6° y 4°-5° del reglamento.
    for (let i = 0; i < enJuego.length / 2; i++) {
      siguiente.push(ganaLlave(enJuego[i], enJuego[enJuego.length - 1 - i]));
    }
    vivos = siguiente;
  }
  return vivos[0] ?? null;
}

/**
 * Quiénes bajan y quiénes suben al cerrar el año.
 *
 * @param tablaDescenso Tabla de PRIMERA ya ordenada (ver tablaDeDescenso).
 * @param tablaSegunda  Tabla anual de SEGUNDA, de mejor a peor.
 * @param ganaLlave     Solo lo usan las ligas con play-off (Holanda). Sin esto, el 16° se salva.
 */
export function resolverMovimientos(
  league: string,
  tablaDescenso: readonly FilaDescenso[],
  tablaSegunda: readonly { clubId: string; clubName: string }[],
  ganaLlave?: (a: string, b: string) => string,
): { descienden: FilaDescenso[]; ascienden: { clubId: string; clubName: string }[] } {
  const reglas = reglasDeLiga(league);
  if (!reglas) return { descienden: [], ascienden: [] };

  // Nunca vaciar la liga: si es más chica que los cupos, no baja nadie.
  const descienden = tablaDescenso.length > reglas.cuposDescenso
    ? [...tablaDescenso.slice(-reglas.cuposDescenso)]
    : [];
  // Suben tantos como bajaron (y como mucho los cupos): la liga conserva su tamaño.
  const ascienden = [...tablaSegunda.slice(0, Math.min(descienden.length, reglas.cuposAscenso))];

  // Play-off de permanencia (Holanda, Alemania): un club de Primera defiende su plaza.
  if (reglas.puestoPlayoff && ganaLlave && tablaDescenso.length > reglas.cuposDescenso + 1) {
    // El club en riesgo es el que queda JUSTO ENCIMA de los que bajan directo. Se cuenta desde el
    // fondo, no por posición fija: el reglamento dice "16° de 18", pero si la liga del juego tiene
    // 17 clubes ese índice caería sobre el penúltimo, que ya descendió, y el play-off no correría.
    const enRiesgo = tablaDescenso[tablaDescenso.length - reglas.cuposDescenso - 1];
    const yaBaja = new Set(descienden.map(d => d.clubId));
    const yaSube = new Set(ascienden.map(a => a.clubId));

    if (enRiesgo && !yaBaja.has(enRiesgo.clubId)) {
      // Holanda mete seis; Alemania uno solo (el 3°, que queda justo detrás de los dos que suben).
      const retadores = tablaSegunda
        .filter(s => !yaSube.has(s.clubId))
        .slice(0, reglas.rivalesPlayoff ?? 6);
      const { ganador, mantienePrimera } = playoffPermanencia(enRiesgo.clubId, retadores, ganaLlave);
      if (ganador && !mantienePrimera) {
        // Perdió la categoría: baja él y sube el que ganó el play-off.
        descienden.push(enRiesgo);
        const subio = retadores.find(s => s.clubId === ganador);
        if (subio) ascienden.push(subio);
      }
    }
  }

  // Play-off de ascenso (España): la plaza extra se define solo entre clubes de Segunda, sin que
  // ningún equipo de Primera se juegue nada. Por eso no toca `descienden`.
  if (reglas.ascensoPorPlayoff && ganaLlave) {
    const { desde, hasta } = reglas.ascensoPorPlayoff;
    // Los puestos son 1-indexados en el reglamento: del 3° al 6° son los índices 2..5.
    const candidatos = tablaSegunda.slice(desde - 1, hasta);
    const subio = playoffAscensoEspana(candidatos, ganaLlave);
    const yaSube = new Set(ascienden.map(a => a.clubId));
    const fila = candidatos.find(c => c.clubId === subio);
    // Solo entra si la liga tiene sitio: si nadie bajó, tampoco sube el del play-off.
    if (fila && !yaSube.has(fila.clubId) && ascienden.length < descienden.length) {
      ascienden.push(fila);
    }
  }

  return { descienden, ascienden };
}
