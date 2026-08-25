// Nombre real de campeonato + bandera por liga (club.league), y nombre de la copa nacional por
// país. Vive acá y no dentro de un componente porque lo necesitan varias pantallas (partido,
// post-partido) y duplicar las tablas garantiza que se desincronicen.

export const LEAGUE_DISPLAY_INFO: Record<string, { flag: string; name: string }> = {
  Colombiana: { flag: '🇨🇴', name: 'Primera División Dimayor' },
  Argentina: { flag: '🇦🇷', name: 'Liga Profesional Argentina' },
  Española: { flag: '🇪🇸', name: 'LaLiga' },
  Brasileña: { flag: '🇧🇷', name: 'Brasileirão' },
  Mexicana: { flag: '🇲🇽', name: 'Liga MX' },
  Chilena: { flag: '🇨🇱', name: 'Primera División de Chile' },
  Ecuatoriana: { flag: '🇪🇨', name: 'LigaPro Ecuador' },
  Uruguaya: { flag: '🇺🇾', name: 'Primera División Uruguaya' },
  Paraguaya: { flag: '🇵🇾', name: 'Primera División de Paraguay' },
  Boliviana: { flag: '🇧🇴', name: 'Primera División de Bolivia' },
  Peruana: { flag: '🇵🇪', name: 'Liga 1 Perú' },
  Venezolana: { flag: '🇻🇪', name: 'Liga FUTVE' },
  Inglesa: { flag: '🏴', name: 'Premier League' },
  Francesa: { flag: '🇫🇷', name: 'Ligue 1' },
  Alemana: { flag: '🇩🇪', name: 'Bundesliga' },
  Italiana: { flag: '🇮🇹', name: 'Serie A' },
  Holandesa: { flag: '🇳🇱', name: 'Eredivisie' },
  Portuguesa: { flag: '🇵🇹', name: 'Primeira Liga' },
  Estadounidense: { flag: '🇺🇸', name: 'MLS' },
  Turca: { flag: '🇹🇷', name: 'Süper Lig' },
  Escocesa: { flag: '🏴', name: 'Scottish Premiership' },
  Belga: { flag: '🇧🇪', name: 'Pro League' },
  Suiza: { flag: '🇨🇭', name: 'Super League' },
  Austríaca: { flag: '🇦🇹', name: 'Bundesliga Austríaca' },
  Sueca: { flag: '🇸🇪', name: 'Allsvenskan' },
  Danesa: { flag: '🇩🇰', name: 'Superliga Danesa' },
  Griega: { flag: '🇬🇷', name: 'Super League Ellada' },
  Croata: { flag: '🇭🇷', name: 'Prva HNL' },
  Serbia: { flag: '🇷🇸', name: 'Superliga Serbia' },
  Checa: { flag: '🇨🇿', name: 'Fortuna Liga' },
  Rumana: { flag: '🇷🇴', name: 'Superliga Rumana' },
  Búlgara: { flag: '🇧🇬', name: 'Liga Búlgara' },
  Húngara: { flag: '🇭🇺', name: 'NB I' },
  Israelí: { flag: '🇮🇱', name: 'Ligat ha\'Al' },
  Chipriota: { flag: '🇨🇾', name: 'Liga Chipriota' },
  Kazaja: { flag: '🇰🇿', name: 'Liga Kazaja' },
  Azerí: { flag: '🇦🇿', name: 'Liga Azerí' },
  // Bolsa de ligas menores sin país propio en la base: no se puede nombrar un campeonato real.
  Internacional: { flag: '🌍', name: 'Liga Doméstica' },
};

// Nombre real del campeonato de SEGUNDA división, para los países donde el juego la modela. Sin
// esto, un club de Barranquilla FC (Torneo BetPlay) se anunciaba en pantalla, en la vitrina y en el
// resumen post-partido como "Primera División Dimayor" -- el nombre de la liga a la que ni siquiera
// pertenece. Bug reportado: "dice primera division" jugando con un club de Segunda.
// Solo lleva los países con `division: 2` real en CLUBS_DATABASE (ver data.ts): el resto de ligas no
// tiene Segunda modelada, así que no hay nombre real que poner.
const SECOND_DIVISION_DISPLAY_INFO: Record<string, { flag: string; name: string }> = {
  Colombiana: { flag: '🇨🇴', name: 'Torneo BetPlay' },
  Argentina: { flag: '🇦🇷', name: 'Primera Nacional' },
  Holandesa: { flag: '🇳🇱', name: 'Eerste Divisie' },
  Brasileña: { flag: '🇧🇷', name: 'Serie B' },
  Alemana: { flag: '🇩🇪', name: '2. Bundesliga' },
  Española: { flag: '🇪🇸', name: 'LaLiga Hypermotion' },
  Inglesa: { flag: '🏴', name: 'Championship' },
  Francesa: { flag: '🇫🇷', name: 'Ligue 2' },
  Chilena: { flag: '🇨🇱', name: 'Primera B de Chile' },
  Ecuatoriana: { flag: '🇪🇨', name: 'Liga Pro Serie B' },
  Mexicana: { flag: '🇲🇽', name: 'Liga de Expansión MX' },
  Italiana: { flag: '🇮🇹', name: 'Serie BKT' },
  Portuguesa: { flag: '🇵🇹', name: 'Liga Portugal 2' },
};

/**
 * LA TERCERA DIVISIÓN, que hoy sólo existe en Argentina (20 clubes; ninguna otra liga de la base
 * tiene división 3).
 *
 * Sin esta tabla esos veinte caían al mapa de PRIMERA y salían rotulados "Liga Profesional
 * Argentina" -- o sea que la primera argentina aparecía con CINCUENTA clubes en vez de treinta.
 * Reportado mirando la lista de clubes: "en la liga argentina tienes 50 equipos en primera, son 30".
 *
 * Y el nombre lleva las dos competiciones a propósito: la tercera argentina son DOS ligas paralelas,
 * y de estos veinte, ocho juegan la Primera B Metropolitana y seis el Torneo Federal A (según el
 * ranking de Opta). Un solo nombre sería más prolijo y sería falso.
 */
const THIRD_DIVISION_DISPLAY_INFO: Record<string, { flag: string; name: string }> = {
  Argentina: { flag: '🇦🇷', name: 'Primera B / Federal A' },
};

export function getLeagueDisplay(league: string | undefined, division?: number): { flag: string; name: string } {
  if (division === 2) {
    const segunda = SECOND_DIVISION_DISPLAY_INFO[league ?? ''];
    if (segunda) return segunda;
  }
  if (division != null && division >= 3) {
    const tercera = THIRD_DIVISION_DISPLAY_INFO[league ?? ''];
    if (tercera) return tercera;
  }
  return LEAGUE_DISPLAY_INFO[league ?? ''] ?? { flag: '🌍', name: 'Liga Doméstica' };
}

// Copa nacional por país, para las semanas de copa en las que el club no juega ninguna copa
// continental. Antes esos partidos salían rotulados "Copa Libertadores" aunque el club fuera
// europeo: el 87% de los clubes de la base no clasifica a ninguna copa continental.
const DOMESTIC_CUP_NAMES: Record<string, string> = {
  Española: 'Copa del Rey',
  Inglesa: 'FA Cup',
  Italiana: 'Coppa Italia',
  Alemana: 'DFB-Pokal',
  Francesa: 'Coupe de France',
  Portuguesa: 'Taça de Portugal',
  Holandesa: 'KNVB Beker',
  Colombiana: 'Copa Colombia',
  Argentina: 'Copa Argentina',
  Brasileña: 'Copa do Brasil',
  Mexicana: 'Copa MX',
  Chilena: 'Copa Chile',
  Ecuatoriana: 'Copa Ecuador',
  Uruguaya: 'Copa Uruguay',
  Paraguaya: 'Copa Paraguay',
  Peruana: 'Copa Perú',
  Boliviana: 'Copa Bolivia',
  Venezolana: 'Copa Venezuela',
  Estadounidense: 'US Open Cup',
  Turca: 'Copa de Turquía',
  Escocesa: 'Scottish Cup',
  Belga: 'Copa de Bélgica',
  Suiza: 'Copa de Suiza',
  Austríaca: 'Copa de Austria',
  Sueca: 'Svenska Cupen',
  Danesa: 'Copa de Dinamarca',
  Griega: 'Copa de Grecia',
  Croata: 'Copa de Croacia',
  Serbia: 'Copa de Serbia',
  Checa: 'Copa Checa',
  Rumana: 'Cupa României',
  Búlgara: 'Copa de Bulgaria',
  Húngara: 'Magyar Kupa',
  Israelí: 'Copa de Israel',
  Chipriota: 'Copa de Chipre',
  Kazaja: 'Copa de Kazajistán',
  Azerí: 'Copa de Azerbaiyán',
};

export function getDomesticCupName(league: string | undefined): string {
  return DOMESTIC_CUP_NAMES[league ?? ''] ?? 'Copa Nacional';
}

// --- COMO SE LLAMA UNA RONDA -------------------------------------------------------------------
//
// Las rondas del calendario vienen de Transfermarkt, en inglés y con formatos distintos según la
// copa ("Round of 16", "Quarter-Finals", "1. Round"). Se traducen las habituales y el resto pasa
// tal cual: es preferible mostrar "Group Stage" que no mostrar nada.
//
// Vive acá y no en App.tsx porque la tarjeta del próximo partido la necesita igual, y era
// justamente eso lo que faltaba: en las copas que manda el calendario -- la Libertadores del
// Junior, la Copa do Brasil del Flamengo -- la tarjeta rotulaba el partido con la FECHA ("9 abr")
// en vez de con la ronda, y el dato estaba ahí sin usarse.
const RONDAS_EN_ESPANOL: Record<string, string> = {
  'final': 'Final',
  'semi-finals': 'Semifinal', 'semi-final': 'Semifinal', 'semifinals': 'Semifinal',
  'quarter-finals': 'Cuartos de Final', 'quarter-final': 'Cuartos de Final',
  'round of 16': 'Octavos de Final', 'last 16': 'Octavos de Final',
  'round of 32': 'Dieciseisavos', 'last 32': 'Dieciseisavos',
  'round of 64': 'Treintaidosavos',
  'group stage': 'Fase de Grupos', 'first round': 'Primera Ronda', 'second round': 'Segunda Ronda',
  'third round': 'Tercera Ronda', 'preliminary round': 'Ronda Preliminar',
};

/** "Round of 16 (Ida)" -> "Octavos de Final (Ida)". Devuelve null si no hay ronda que mostrar. */
export function rondaEnEspanol(ronda?: string | null): string | null {
  if (!ronda) return null;
  const limpia = ronda.trim();
  if (!limpia) return null;
  // "Final (Vuelta)" -> se traduce "Final" y se conserva el paréntesis.
  const conParentesis = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(limpia);
  const base = (conParentesis ? conParentesis[1] : limpia).trim();
  const sufijo = conParentesis ? ` (${conParentesis[2].trim()})` : '';
  return `${RONDAS_EN_ESPANOL[base.toLowerCase()] ?? base}${sufijo}`;
}
