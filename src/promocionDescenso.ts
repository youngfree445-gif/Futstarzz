// Ascenso y descenso, según los reglamentos reales.
//   docs/REGLAMENTO_COLOMBIA_2026.md  (Dimayor V0 14/01/26)
//   docs/REGLAMENTO_ARGENTINA_2026.md (AFA / LPF, Boletín 6616)
//
// COLOMBIA Y ARGENTINA NO COMPARTEN REGLAS, y mezclarlas daría descensos inventados:
//
//   Colombia  → bajan 2, por TABLA DE PROMEDIOS (puntos ÷ partidos) acumulando varios años.
//               Un grande puede bajar pese a una buena temporada suelta si arrastra años flojos,
//               y un recién ascendido está protegido porque su ventana solo cuenta el año en curso.
//   Argentina → bajan 4 en Primera Nacional (los 2 últimos de cada zona), por TABLA GENERAL
//               ANUAL acumulada, sin promedio plurianual.
//
// Por eso cada país tiene su propia función y su propia constante de cupos. La puerta de entrada
// es `reglasDeLiga`, que devuelve null para cualquier liga sin sistema implementado: así ninguna
// otra liga hereda por accidente las reglas de estas dos.

export type SistemaAscenso = 'colombia' | 'argentina';

export interface ReglasAscenso {
  sistema: SistemaAscenso;
  cuposDescenso: number;
  cuposAscenso: number;
  /** 'promedio' = puntos ÷ partidos plurianual. 'anual' = puntos del año, sin dividir. */
  criterioDescenso: 'promedio' | 'anual';
  /** Cuántos años entran en el promedio. Solo aplica al criterio 'promedio'. */
  ventanaAnios: number;
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

/**
 * Quiénes bajan y quiénes suben al cerrar el año.
 *
 * @param tablaDescenso Tabla de PRIMERA ya ordenada (ver tablaDeDescenso).
 * @param tablaSegunda  Tabla anual de SEGUNDA, de mejor a peor.
 */
export function resolverMovimientos(
  league: string,
  tablaDescenso: readonly FilaDescenso[],
  tablaSegunda: readonly { clubId: string; clubName: string }[],
): { descienden: FilaDescenso[]; ascienden: { clubId: string; clubName: string }[] } {
  const reglas = reglasDeLiga(league);
  if (!reglas) return { descienden: [], ascienden: [] };

  // Nunca vaciar la liga: si es más chica que los cupos, no baja nadie.
  const descienden = tablaDescenso.length > reglas.cuposDescenso
    ? tablaDescenso.slice(-reglas.cuposDescenso)
    : [];
  // Suben tantos como bajaron (y como mucho los cupos): la liga conserva su tamaño.
  const ascienden = tablaSegunda.slice(0, Math.min(descienden.length, reglas.cuposAscenso));
  return { descienden, ascienden };
}
