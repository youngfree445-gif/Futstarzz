// Ascenso y descenso, según los reglamentos reales.
//   docs/REGLAMENTO_COLOMBIA_2026.md  (Dimayor V0 14/01/26)
//   docs/REGLAMENTO_ARGENTINA_2026.md (AFA / LPF, Boletín 6616)
//
//   https://en.wikipedia.org/wiki/Dutch_football_league_system (KNVB)
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
//
// Por eso cada país tiene su propia función y su propia constante de cupos. La puerta de entrada
// es `reglasDeLiga`, que devuelve null para cualquier liga sin sistema implementado: así ninguna
// otra liga hereda por accidente las reglas de las demás.

export type SistemaAscenso = 'colombia' | 'argentina' | 'holanda';

export interface ReglasAscenso {
  sistema: SistemaAscenso;
  cuposDescenso: number;
  cuposAscenso: number;
  /** 'promedio' = puntos ÷ partidos plurianual. 'anual' = puntos del año, sin dividir. */
  criterioDescenso: 'promedio' | 'anual';
  /** Cuántos años entran en el promedio. Solo aplica al criterio 'promedio'. */
  ventanaAnios: number;
  /**
   * Puesto de Primera que NO baja directo pero se juega la categoría en un playoff (16° en Holanda).
   * Sin esto, ese club se salva siempre. undefined = la liga no tiene promoción/permanencia.
   */
  puestoPlayoff?: number;
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
  // AFA: bajan los 2 últimos de cada zona de la Primera Nacional (4 en total) y los descensos de
  // Primera salen de la Tabla General, que suma las fases regulares del año. Sin promedio.
  Argentina: {
    sistema: 'argentina',
    cuposDescenso: 4,
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
};

/** Reglas de esa liga, o null si no tiene sistema implementado. */
export function reglasDeLiga(league: string): ReglasAscenso | null {
  return REGLAS[league] ?? null;
}

/** Lo que un club sumó en un año de liga. Es la base de las dos tablas. */
export interface RegistroAnual {
  clubId: string;
  league: string;   // para no cruzar países al calcular
  year: number;     // año de carrera (1, 2, 3...)
  puntos: number;
  partidos: number;
}

export interface FilaDescenso {
  clubId: string;
  clubName: string;
  puntos: number;
  partidos: number;
  /** puntos ÷ partidos en Colombia; los puntos del año en Argentina. */
  valor: number;
  anios: number;
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
  const porClub = new Map<string, { puntos: number; partidos: number; anios: Set<number> }>();

  for (const r of registros) {
    // Solo esta liga y solo la ventana que corresponde: sin el filtro por liga, un club argentino
    // entraría en la tabla colombiana.
    if (r.league !== league) continue;
    if (r.year < desde || r.year > anioActual) continue;
    const acc = porClub.get(r.clubId) ?? { puntos: 0, partidos: 0, anios: new Set<number>() };
    acc.puntos += r.puntos;
    acc.partidos += r.partidos;
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
    }))
    .sort((x, y) => y.valor - x.valor || y.puntos - x.puntos);
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
 * El play-off neerlandés de promoción/permanencia, por el tercer lugar en juego.
 *
 * No es un cruce simétrico: el 16° de la Eredivisie entra recién en la segunda ronda y le alcanza
 * con ganar DOS llaves, mientras que los seis de la Eerste Divisie tienen que ganar TRES. Modelarlo
 * como un cruce parejo le sacaría al club de Primera la ventaja que el reglamento le da.
 *
 * @param equipoPrimera  El 16° de la Eredivisie. null si la tabla no llega a 16 equipos.
 * @param seisDeSegunda  Los seis de Segunda que entran al play-off, de mejor a peor.
 * @param ganaLlave      Resuelve una llave a ida y vuelta: devuelve el id del que avanza.
 * @returns Quién ocupa la plaza: `mantienePrimera` es true si la retuvo el club de Eredivisie.
 */
export function playoffHolanda(
  equipoPrimera: string | null,
  seisDeSegunda: readonly { clubId: string; clubName: string }[],
  ganaLlave: (a: string, b: string) => string,
): { ganador: string | null; mantienePrimera: boolean } {
  if (!equipoPrimera) return { ganador: null, mantienePrimera: false };
  if (seisDeSegunda.length < 2) return { ganador: equipoPrimera, mantienePrimera: true };

  // Primera ronda: solo los de Segunda, mejor contra peor. El de Eredivisie mira desde afuera.
  let vivos = seisDeSegunda.map(s => s.clubId);
  const ronda1: string[] = [];
  if (vivos.length % 2 === 1) ronda1.push(vivos[0]);
  const enJuego = vivos.length % 2 === 1 ? vivos.slice(1) : vivos;
  for (let i = 0; i < enJuego.length / 2; i++) {
    ronda1.push(ganaLlave(enJuego[i], enJuego[enJuego.length - 1 - i]));
  }
  vivos = ronda1;

  // Segunda ronda en adelante: ya entra el de Eredivisie y se cruza como uno más.
  vivos = [equipoPrimera, ...vivos];
  while (vivos.length > 1) {
    const siguiente: string[] = [];
    if (vivos.length % 2 === 1) siguiente.push(vivos[0]);
    const cruces = vivos.length % 2 === 1 ? vivos.slice(1) : vivos;
    for (let i = 0; i < cruces.length / 2; i++) {
      siguiente.push(ganaLlave(cruces[i], cruces[cruces.length - 1 - i]));
    }
    vivos = siguiente;
  }

  const ganador = vivos[0] ?? null;
  return { ganador, mantienePrimera: ganador === equipoPrimera };
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

  // Play-off de promoción/permanencia: la plaza extra que Holanda no reparte por tabla.
  if (reglas.puestoPlayoff && ganaLlave && tablaDescenso.length >= reglas.puestoPlayoff) {
    // El puesto se cuenta desde el fondo: con 18 equipos, el 16° es el antepenúltimo.
    const idx = tablaDescenso.length - (tablaDescenso.length - reglas.puestoPlayoff) - 1;
    const enRiesgo = tablaDescenso[idx];
    const yaBaja = new Set(descienden.map(d => d.clubId));
    const yaSube = new Set(ascienden.map(a => a.clubId));

    if (enRiesgo && !yaBaja.has(enRiesgo.clubId)) {
      const seis = tablaSegunda.filter(s => !yaSube.has(s.clubId)).slice(0, 6);
      const { ganador, mantienePrimera } = playoffHolanda(enRiesgo.clubId, seis, ganaLlave);
      if (ganador && !mantienePrimera) {
        // Perdió la categoría: baja él y sube el que ganó el play-off.
        descienden.push(enRiesgo);
        const subio = seis.find(s => s.clubId === ganador);
        if (subio) ascienden.push(subio);
      }
    }
  }

  return { descienden, ascienden };
}
