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

export function getLeagueDisplay(league: string | undefined): { flag: string; name: string } {
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
