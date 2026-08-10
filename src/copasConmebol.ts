// Participantes REALES de la fase de grupos de la Copa Libertadores y la Copa Sudamericana 2026.
//
// Fuente: Transfermarkt, calendario completo de cada copa
// (/gesamtspielplan/pokalwettbewerb/CLI y /CS, saison_id 2026), bajado con
// scripts/scrape_copa_tm.mjs. Son los 32 clubes que disputan la fase de grupos de cada torneo:
// 96 partidos = 8 grupos de 4 a ida y vuelta, que es justo el formato que ya modela leagueEngine.
//
// Antes esto se elegía por REPUTACIÓN (pickTopClubsByCountry), y por eso clubes que no juegan la
// copa aparecían igual en "Copas y Tablas" con grupo y puntos -- el Santos figuraba en
// Libertadores sin jugarla. Ahora la temporada 1 es la real y, de la 2 en adelante, los cupos se
// ganan en la simulación (ver cuposPorPais más abajo).
//
// Cada club se resolvió por su ID de Transfermarkt, NUNCA por nombre: emparejar por texto mandó
// "Racing Club" (Avellaneda) al Racing uruguayo y "Atlético-MG" (Mineiro) al Atlético FC
// ecuatoriano. Los clubes que las fases previas dejaron afuera no van: son 32 exactos por copa.

/** Los 32 de la fase de grupos de la Libertadores 2026. */
export const LIBERTADORES_2026: readonly string[] = [
  // Argentina (7)
  'boca',                           // Boca Juniors
  'estudiantes_lp',                 // Estudiantes LP
  'independiente',                  // Independiente
  'indep_rivadavia',                // Ind. Rivadavia
  'lanus',                          // Lanús
  'platense',                       // Platense
  'rosario_central',                // Rosario Central
  // Boliviana (2)
  'always_ready',                   // Always Ready
  'bolívar',                        // Bolívar
  // Brasileña (6)
  'corinthians',                    // Corinthians
  'cruzeiro',                       // Cruzeiro
  'flamengo',                       // Flamengo
  'fluminense',                     // Fluminense
  'mirassol',                       // Mirassol-SP
  'palmeiras',                      // Palmeiras
  // Chilena (2)
  'coquimbo_unido',                 // Coquimbo Unido
  'u_catolica',                     // U. Católica
  // Colombiana (4)
  'tolima',                         // Deportes Tolima
  'medellin',                       // Indep. Medellín
  'santafe',                        // Indep. Santa Fe
  'junior',                         // Junior FC
  // Ecuatoriana (2)
  'barcelona_sc',                   // Barcelona SC
  'ldu_quito',                      // LDU Quito
  // Paraguaya (2)
  'cerro_porteño',                  // Cerro Porteño
  'libertad',                       // Libertad
  // Peruana (3)
  'cusco_fc',                       // Cusco FC
  'sporting_cristal',               // Sport. Cristal
  'universitario',                  // Universitario
  // Uruguaya (2)
  'nacional_uru',                   // Nacional
  'penarol',                        // Peñarol
  // Venezolana (2)
  'deportivo_la_guaira',            // Dep. La Guaira
  'universidad_central',            // UCV FC
];

/** Los 32 de la fase de grupos de la Sudamericana 2026. */
export const SUDAMERICANA_2026: readonly string[] = [
  // Argentina (6)
  'barracas',                       // Barracas C.
  'racing',                         // Racing Club
  'riestra',                        // Dep. Riestra
  'river',                          // River Plate
  'san_lorenzo',                    // San Lorenzo
  'tigre',                          // Tigre
  // Boliviana (2)
  'blooming',                       // Club Blooming
  'independiente_petrolero',        // Ind. Petrolero
  // Brasileña (7)
  'atletico_mineiro',               // Atlético-MG
  'botafogo',                       // Botafogo
  'gremio',                         // Grêmio
  'rb_bragantino',                  // RB Bragantino
  'santos',                         // Santos
  'sao_paulo',                      // São Paulo
  'vasco_da_gama',                  // Vasco da Gama
  // Chilena (3)
  'audax_italiano',                 // Audax Italiano
  'ohiggins',                       // O'Higgins
  'palestino',                      // Palestino
  // Colombiana (2)
  'america_cali',                   // CD América
  'millonarios',                    // Millonarios
  // Ecuatoriana (2)
  'deportivo_cuenca',               // Dep. Cuenca
  'macará',                         // CD Macará
  // Paraguaya (2)
  'olimpia',                        // Olimpia
  'recoleta',                       // Recoleta FC
  // Peruana (2)
  'atlético_sullana',               // Alianza Atl.
  'cienciano',                      // Cienciano
  // Uruguaya (3)
  'boston_river_uru',               // Boston River
  'juventud_de_las_piedras_uru',    // Juventud
  'montevideo_city_torque_uru',     // Mvd City Torque
  // Venezolana (3)
  'academia_puerto_cabello',        // Puerto Cabello
  'carabobo_fc',                    // Carabobo FC
  'caracas_fc',                     // Caracas FC
];

// Cupos por país, contados de la edición real 2026. Se usan de la temporada 2 en adelante para
// repartir las plazas según la tabla que dejó la simulación, en vez de una lista fija.
export const CUPOS_LIBERTADORES: Readonly<Record<string, number>> = {
  'Argentina': 7,
  'Brasileña': 6,
  'Colombiana': 4,
  'Peruana': 3,
  'Boliviana': 2,
  'Chilena': 2,
  'Ecuatoriana': 2,
  'Paraguaya': 2,
  'Uruguaya': 2,
  'Venezolana': 2,
};

export const CUPOS_SUDAMERICANA: Readonly<Record<string, number>> = {
  'Brasileña': 7,
  'Argentina': 6,
  'Chilena': 3,
  'Uruguaya': 3,
  'Venezolana': 3,
  'Boliviana': 2,
  'Colombiana': 2,
  'Ecuatoriana': 2,
  'Paraguaya': 2,
  'Peruana': 2,
};

/**
 * Cómo terminó cada liga en cada año de carrera: `${league}-${year}` -> ids de mejor a peor.
 * Lo llena App.tsx al cerrar temporada, con la tabla que dejó la simulación.
 */
export type PosicionesFinales = Record<string, readonly string[]>;

/** Campeones del año que cierra, para darles su cupo como manda Conmebol. */
export interface CampeonesConmebol {
  libertadores?: string | null;
  sudamericana?: string | null;
}

/** Lo mínimo que hace falta saber de un club para repartir cupos. */
export interface ClubMinimo {
  id: string;
  league: string;
  reputation: number;
  division?: 1 | 2 | 3;
}

/**
 * Quiénes juegan la copa en una temporada dada.
 *
 * Temporada 1: la edición real 2026, tal cual (listas de arriba).
 *
 * Temporada 2 en adelante: se gana en la cancha. Se reparten los mismos cupos por país de la
 * edición real, pero llenándolos con la tabla final del año anterior. Los dos campeones vigentes
 * entran a Libertadores sin gastar cupo de su país, que es la regla de Conmebol: el campeón de la
 * Libertadores y el de la Sudamericana clasifican a la Libertadores siguiente.
 *
 * Si una liga no llegó a simularse ese año (el catch-up es perezoso: solo corre las ligas que
 * alguien miró), esa plaza se llena con los clubes reales de 2026 de ese país. Es un respaldo, no
 * un atajo: sin él la copa quedaría con menos de 32 y el sorteo de 8 grupos de 4 no cerraría.
 */
export function participantesConmebol(
  cupId: 'libertadores' | 'sudamericana',
  year: number,
  posiciones?: PosicionesFinales,
  campeones?: CampeonesConmebol,
  todosLosClubes: readonly ClubMinimo[] = [],
): string[] {
  const real = cupId === 'libertadores' ? LIBERTADORES_2026 : SUDAMERICANA_2026;
  if (year <= 1 || !posiciones) return [...real];

  const cupos = cupId === 'libertadores' ? CUPOS_LIBERTADORES : CUPOS_SUDAMERICANA;
  const anioPrevio = year - 1;

  // La Libertadores se arma primero y la Sudamericana recibe a los que quedaron afuera, así que
  // ningún club puede terminar en las dos (el bug era justamente ver dos copas a la vez).
  const tomado = cupId === 'sudamericana'
    ? new Set(participantesConmebol('libertadores', year, posiciones, campeones, todosLosClubes))
    : new Set<string>();

  const elegidos: string[] = [];

  // Se reparte país por país y cada uno recibe EXACTAMENTE su cuota. El campeón vigente entra
  // dentro de la cuota de su país, no encima: sumarlo aparte empujaba el total por arriba de 32 y
  // el recorte final dejaba a Venezuela sin ningún representante.
  for (const [league, n] of Object.entries(cupos)) {
    const campeonesDelPais = cupId === 'libertadores'
      ? [campeones?.libertadores, campeones?.sudamericana]
          .filter((id): id is string => !!id && paisDe(id, todosLosClubes) === league)
      : [];

    // Orden de preferencia: campeón vigente, después la tabla del año que cerró y, si esa liga no
    // se simuló o quedó corta, el resto de los clubes del país por reputación.
    const porTabla = posiciones[`${league}-${anioPrevio}`] ?? [];
    const resto = todosLosClubes
      .filter(c => c.league === league && (c.division ?? 1) === 1)
      .sort((a, b) => b.reputation - a.reputation)
      .map(c => c.id);
    const candidatos = [...campeonesDelPais, ...porTabla, ...resto, ...real.filter(id => paisDe(id, todosLosClubes) === league)];

    let puestos = 0;
    for (const id of candidatos) {
      if (puestos >= n) break;
      if (tomado.has(id)) continue;
      tomado.add(id);
      elegidos.push(id);
      puestos++;
    }
  }
  return elegidos;
}

// País de cada club participante. Explícito y no deducido del orden de las listas: están
// agrupadas por país alfabéticamente y los cupos por cantidad, así que cualquier cálculo por índice
// se desalinea en cuanto cambie una de las dos.
const PAIS_POR_CLUB: Readonly<Record<string, string>> = {
  // Argentina
  'barracas':                       'Argentina',
  'boca':                           'Argentina',
  'estudiantes_lp':                 'Argentina',
  'indep_rivadavia':                'Argentina',
  'independiente':                  'Argentina',
  'lanus':                          'Argentina',
  'platense':                       'Argentina',
  'racing':                         'Argentina',
  'riestra':                        'Argentina',
  'river':                          'Argentina',
  'rosario_central':                'Argentina',
  'san_lorenzo':                    'Argentina',
  'tigre':                          'Argentina',
  // Boliviana
  'always_ready':                   'Boliviana',
  'blooming':                       'Boliviana',
  'bolívar':                        'Boliviana',
  'independiente_petrolero':        'Boliviana',
  // Brasileña
  'atletico_mineiro':               'Brasileña',
  'botafogo':                       'Brasileña',
  'corinthians':                    'Brasileña',
  'cruzeiro':                       'Brasileña',
  'flamengo':                       'Brasileña',
  'fluminense':                     'Brasileña',
  'gremio':                         'Brasileña',
  'mirassol':                       'Brasileña',
  'palmeiras':                      'Brasileña',
  'rb_bragantino':                  'Brasileña',
  'santos':                         'Brasileña',
  'sao_paulo':                      'Brasileña',
  'vasco_da_gama':                  'Brasileña',
  // Chilena
  'audax_italiano':                 'Chilena',
  'coquimbo_unido':                 'Chilena',
  'ohiggins':                       'Chilena',
  'palestino':                      'Chilena',
  'u_catolica':                     'Chilena',
  // Colombiana
  'america_cali':                   'Colombiana',
  'junior':                         'Colombiana',
  'medellin':                       'Colombiana',
  'millonarios':                    'Colombiana',
  'santafe':                        'Colombiana',
  'tolima':                         'Colombiana',
  // Ecuatoriana
  'barcelona_sc':                   'Ecuatoriana',
  'deportivo_cuenca':               'Ecuatoriana',
  'ldu_quito':                      'Ecuatoriana',
  'macará':                         'Ecuatoriana',
  // Paraguaya
  'cerro_porteño':                  'Paraguaya',
  'libertad':                       'Paraguaya',
  'olimpia':                        'Paraguaya',
  'recoleta':                       'Paraguaya',
  // Peruana
  'atlético_sullana':               'Peruana',
  'cienciano':                      'Peruana',
  'cusco_fc':                       'Peruana',
  'sporting_cristal':               'Peruana',
  'universitario':                  'Peruana',
  // Uruguaya
  'boston_river_uru':               'Uruguaya',
  'juventud_de_las_piedras_uru':    'Uruguaya',
  'montevideo_city_torque_uru':     'Uruguaya',
  'nacional_uru':                   'Uruguaya',
  'penarol':                        'Uruguaya',
  // Venezolana
  'academia_puerto_cabello':        'Venezolana',
  'carabobo_fc':                    'Venezolana',
  'caracas_fc':                     'Venezolana',
  'deportivo_la_guaira':            'Venezolana',
  'universidad_central':            'Venezolana',
};

function paisDe(clubId: string, todosLosClubes: readonly ClubMinimo[] = []): string | null {
  // El mapa cubre a los 64 de la edición real; cualquier otro club (uno que clasificó por mérito)
  // se busca en la base que llega por parámetro.
  return PAIS_POR_CLUB[clubId] ?? todosLosClubes.find(c => c.id === clubId)?.league ?? null;
}
