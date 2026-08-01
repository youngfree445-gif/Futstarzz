// Puente entre el nombre corto de data.ts y el nombre oficial largo con el que los clubes figuran
// en los calendarios reales importados de Transfermarkt (src/realCalendar.ts).
//
// Vive en su propio módulo, y no dentro de realSchedule.ts, porque lo necesitan tanto realSchedule
// (para saber qué le toca jugar al club esta semana) como leagueEngine (para armar la tabla con la
// jornada real). leagueEngine no puede importar de realSchedule: realSchedule ya importa de
// leagueEngine y el ciclo rompe el build.
//
// Sin esta tabla, 29 clubes de primera división -- Racing, Newell's, Flamengo, Palmeiras y medio
// MLS entre ellos -- no encontraban su calendario y caían al fixture generado, jugando un torneo
// paralelo al de sus rivales de la misma liga.
//
// Se mapea acá y no renombrando data.ts a propósito: el nombre corto es el que se muestra en
// pantalla y el que usan escudos, plantillas y posts de ChutSocial.
export const ALIAS_CALENDARIO: Record<string, string> = {
  // Argentina
  'Racing Club de Avellaneda': 'Racing Club Asociación Civil de Avellaneda',
  'Newells Old Boys': 'Club Atlético Newell’s Old Boys',
  'Instituto de Córdoba': 'Instituto Atlético Central Córdoba',
  'Defensa y Justicia': 'Club Social y Deportivo Defensa y Justicia',
  'Talleres de Córdoba': 'Club Atlético Talleres',
  'Independiente Rivadavia': 'Club Sportivo Independiente Rivadavia',
  'Riestra': 'Asociación de Fomento Deportivo Riestra Barrio Colón',
  'Estudiantes de Río Cuarto': 'Asociación Atlética Estudiantes',
  'Gimnasia de Mendoza': 'Club Atlético Gimnasia y Esgrima de Mendoza',
  // Brasil
  'Palmeiras': 'Sociedade Esportiva Palmeiras',
  'Botafogo': 'S. A. F. Botafogo',
  'Atlético Mineiro': 'Clube Atlético Mineiro',
  'Flamengo': 'Clube de Regatas do Flamengo',
  'RB Bragantino': 'Red Bull Bragantino',
  'Vitória': 'Esporte Clube Vitória',
  'Vasco da Gama': 'Club de Regatas Vasco da Gama',
  'Bahia': 'Esporte Clube Bahia',
  'Sport Recife': 'Sport Club do Recife',
  'Mirassol': 'Mirasol Futebol Clube',   // el calendario lo escribe con una sola 's'
  'Juventude': 'Esporte Clube Juventude',
  // Francia
  'Lens': 'RC Lens',
  'Lille OSC': 'LOSC Lille',
  'Nice': 'OGC Nice',
  'Racing Club de Strasbourg Alsace': 'RC Strasbourg Alsace',
  'Brest': 'Stade Brestois 29',
  // MLS
  'CF Montréal': 'Club de Foot Montréal',
  'DC United': 'D.C. United',
  'FC Cincinnati': 'Football Club Cincinnati',
  'Inter Miami CF': 'Club Internacional de Fútbol Miami',
  'LA Galaxy': 'Los Angeles Galaxy',
  'NY Red Bulls': 'Red Bull New York',
  'Sporting KC': 'Sporting Kansas City',
  // Bélgica
  'Royale Union Saint-Gilloise': 'Union Saint-Gilloise',
};

// La vuelta: del nombre del calendario al corto de data.ts. Es el que se muestra en pantalla y el
// que se cuela en las crónicas de PostMatch/ChutSocial, así que sin esto el rival aparecería como
// "Asociación de Fomento Deportivo Riestra Barrio Colón" en vez de "Riestra".
const NOMBRE_CORTO: Record<string, string> = Object.fromEntries(
  Object.entries(ALIAS_CALENDARIO).map(([corto, largo]) => [largo, corto])
);

/** Nombre con el que este club aparece en los calendarios reales. */
export function nombreEnCalendario(clubName: string): string {
  return ALIAS_CALENDARIO[clubName] ?? clubName;
}

/** Nombre corto y mostrable de un club tal como viene en el calendario. */
export function nombreMostrable(nombreCalendario: string): string {
  return NOMBRE_CORTO[nombreCalendario] ?? nombreCalendario;
}
