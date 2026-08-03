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

export function getLeagueDisplay(league: string | undefined, division?: number): { flag: string; name: string } {
  if (division === 2) {
    const segunda = SECOND_DIVISION_DISPLAY_INFO[league ?? ''];
    if (segunda) return segunda;
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
