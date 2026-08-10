// Sorteo REAL del Mundial 2026: los 12 grupos de 4, tal como quedaron.
//
// Fuente: src/schedule_2026.json, que ya estaba en el repo con los 72 partidos de fase de grupos
// (fecha, sede y rivales) y que hasta ahora no importaba nadie. Los grupos no vienen etiquetados en
// ese JSON, asi que se deducen de quien juega contra quien: cada grupo son 4 selecciones que se
// enfrentan entre si, 6 partidos. Las 48 del calendario coinciden una a una con
// WORLD_CUP_TEAMS_DATABASE de data.ts.
//
// Antes drawWorldCupGroups sorteaba al azar, asi que el Mundial del juego no se parecia al real:
// Argentina podia caer con Brasil en fase de grupos. Esto solo aplica a la edicion 2026 (año 1 de
// la carrera). Los Mundiales siguientes se siguen sorteando al azar a proposito: no simulamos
// eliminatorias, asi que no hay forma de saber quien clasificaria.

/** Los 12 grupos del Mundial 2026, en ids de WORLD_CUP_TEAMS_DATABASE. */
export const GRUPOS_MUNDIAL_2026: readonly (readonly string[])[] = [
  // Grupo A: Argentina, Algeria, Austria, Jordan
  ['wc_argentina', 'wc_argelia', 'wc_austria', 'wc_jordania'],
  // Grupo B: United States, Paraguay, Australia, Türkiye
  ['wc_usa', 'wc_paraguay', 'wc_australia', 'wc_turquia'],
  // Grupo C: Belgium, Egypt, IR Iran, New Zealand
  ['wc_belgica', 'wc_egipto', 'wc_iran', 'wc_nueva_zelanda'],
  // Grupo D: Canada, Bosnia-Herzegovina, Qatar, Switzerland
  ['wc_canada', 'wc_bosnia', 'wc_catar', 'wc_suiza'],
  // Grupo E: Brazil, Morocco, Haiti, Scotland
  ['wc_brasil', 'wc_marruecos', 'wc_haiti', 'wc_escocia'],
  // Grupo F: Spain, Cape Verde, Saudi Arabia, Uruguay
  ['wc_espana', 'wc_cabo_verde', 'wc_arabia_saudita', 'wc_uruguay'],
  // Grupo G: Portugal, Congo DR, Uzbekistan, Colombia
  ['wc_portugal', 'wc_rd_congo', 'wc_uzbekistan', 'wc_colombia'],
  // Grupo H: England, Croatia, Ghana, Panama
  ['wc_inglaterra', 'wc_croacia', 'wc_ghana', 'wc_panama'],
  // Grupo I: Germany, Curaçao, Côte d'Ivoire, Ecuador
  ['wc_alemania', 'wc_curazao', 'wc_costa_marfil', 'wc_ecuador'],
  // Grupo J: Mexico, South Africa, Korea Republic, Czechia
  ['wc_mexico', 'wc_sudafrica', 'wc_corea_sur', 'wc_chequia'],
  // Grupo K: France, Senegal, Iraq, Norway
  ['wc_francia', 'wc_senegal', 'wc_irak', 'wc_noruega'],
  // Grupo L: Netherlands, Japan, Sweden, Tunisia
  ['wc_holanda', 'wc_japon', 'wc_suecia', 'wc_tunez'],
];
