import rawPlayers from './playersDatabase.json';

// Mapeamos el JSON para que TypeScript reconozca la estructura de tus interfaces sin quejarse
const ALL_PLAYERS = rawPlayers as unknown as {
  player_id: string;
  nombre_completo: string;
  categoria_tactica: 'portero' | 'defensivo' | 'ofensivo';
  posicion_especifica: string;
  valor_mercado_eur: number;
  media_valoracion: number;
  team_name: string;
  team_id: number;
}[];
import { Club, PressQuestion, ShopItem } from './types';
import { CLUB_EXTRAS } from './clubExtras';
import mauSportsAvatar from './assets/mau_sports.jpg';
import physicalCoachImg from './assets/shop/physical_coach.jpg';
import sportsAgentImg from './assets/shop/sports_agent.jpg';
import sportsCarImg from './assets/shop/sports_car.jpg';
import nutritionistImg from './assets/shop/nutritionist.jpg';
import luxuryMansionImg from './assets/shop/luxury_mansion.jpg';
import marketingPrImg from './assets/shop/marketing_pr.jpg';

export const CLUBS_DATABASE: Club[] = [
  // ==========================================
  // --- COLOMBIA (LIGA BETPLAY 2026 & TORNEO) ---
  // ==========================================
  {
    id: 'junior',
    name: 'Junior de Barranquilla',
    league: 'Colombiana',
    dt: 'Alfredo Arias',
    reputation: 5,
    initialSalary: 1800,
    marketValue: 9500000,
    starPlayers: ['Carlos Bacca', 'Teófilo Gutiérrez', 'Luis Fernando Muriel', 'Yimmi Chará', 'Cristian Barrios', 'Mauro Silveira'],
    description: 'El Tiburón de Barranquilla, bicampeón del Apertura 2026. Club de alta presión con hinchada apasionada.',
    badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200',
    badgeLogoUrl: '🦈🔴⚪',
    division: 1
  },
  {
    id: 'nacional',
    name: 'Atlético Nacional',
    league: 'Colombiana',
    dt: 'Diego Arias',
    reputation: 5,
    initialSalary: 2000,
    marketValue: 12000000,
    starPlayers: ['David Ospina', 'William Tesillo', 'Edwin Cardona', 'Chicho Arango', 'Alfredo Morelos', 'Milton Casco'],
    description: 'El Verdolaga de Medellín. Uno de los gigantes de América con una infraestructura de primer nivel.',
    badgeColor: 'border-l-4 border-emerald-600 bg-emerald-950/40 text-emerald-200',
    badgeLogoUrl: '🟢⚪🏆',
    division: 1
  },
  {
    id: 'millonarios',
    name: 'Millonarios FC',
    league: 'Colombiana',
    dt: 'Fabián Bustos',
    reputation: 5,
    initialSalary: 1950,
    marketValue: 11000000,
    starPlayers: ['Radamel Falcao García', 'Álvaro Montero', 'Mackalister Silva', 'Daniel Ruiz', 'Leonardo Castro', 'Carlos Darwin Quintero'],
    description: 'El Embajador de Bogotá. Histórico club de la capital que busca la gloria internacional en 2026 con Falcao García.',
    badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200',
    badgeLogoUrl: '🦅🔵⚪',
    division: 1
  },
  {
    id: 'santafe',
    name: 'Independiente Santa Fe',
    league: 'Colombiana',
    dt: 'Pablo Repetto',
    reputation: 4,
    initialSalary: 1600,
    marketValue: 8000000,
    starPlayers: ['Hugo Rodallega', 'Fabián Sambueza', 'Franco Fagúndez', 'Helibelton Palacios', 'Leandro Castellanos', 'Yeison Gordillo'],
    description: 'El León bogotano. Caracterizado por su garra, juego defensivo férreo y mística copera.',
    badgeColor: 'border-l-4 border-red-550 bg-red-900/35 text-red-100',
    badgeLogoUrl: '🦁🔴⚪',
    division: 1
  },
  {
    id: 'america_cali',
    name: 'América de Cali',
    league: 'Colombiana',
    dt: 'Polilla Da Silva',
    reputation: 4,
    initialSalary: 1700,
    marketValue: 9000000,
    starPlayers: ['Yeison Guzmán', 'Marlon Torres', 'Darwin Machís', 'Carlos Sierra', 'Jean Fernandes', 'Dany Rosero'],
    description: 'La Mechita de Cali. Un club histórico con una afición monumental que exige títulos cada semestre y reforzado en 2026.',
    badgeColor: 'border-l-4 border-red-700 bg-red-950/60 text-red-300',
    badgeLogoUrl: '😈🔴🔴',
    division: 1
  },
  {
    id: 'medellin',
    name: 'Independiente Medellín',
    league: 'Colombiana',
    dt: 'Hernán Torres',
    reputation: 4,
    initialSalary: 1550,
    marketValue: 7500000,
    starPlayers: ['Andrés Mosquera Marmolejo', 'Didier Moreno', 'Andrés Ricaurte', 'Juan Fernando Caicedo', 'Iván Arboleda'],
    description: 'El Poderoso de la Montaña, compartiendo plaza con Nacional y un juego de presión intensa.',
    badgeColor: 'border-l-4 border-blue-700 bg-blue-955/40 text-red-100',
    badgeLogoUrl: '🔴🔵⛰️',
    division: 1
  },
  {
    id: 'tolima',
    name: 'Deportes Tolima',
    league: 'Colombiana',
    dt: 'Hernán Torres',
    reputation: 4,
    initialSalary: 1500,
    marketValue: 7200000,
    starPlayers: ['Álvaro Montero', 'Danovis Banguero', 'Michael Rangel', 'Marco Pérez', 'Jaminton Campaz', 'Anderson Plata'],
    description: 'El Vinotinto y Oro. Club vendedor y sumamente competitivo en Ibagué que pelea campeonatos.',
    badgeColor: 'border-l-4 border-amber-600 bg-amber-950/20 text-yellow-105',
    badgeLogoUrl: '🟤🟡🔥',
    division: 1
  },
  {
    id: 'once_caldas',
    name: 'Once Caldas',
    league: 'Colombiana',
    dt: 'Hernán Darío Herrera',
    reputation: 3,
    initialSalary: 1200,
    marketValue: 5550000,
    starPlayers: ['Dayro Moreno', 'James Aguirre', 'Mateo García', 'Juan David Cuesta'],
    description: 'El Blanco Blanco de Manizales, campeón de América histórico con una afición fiel en el Palogrande.',
    badgeColor: 'border-l-4 border-neutral-300 bg-slate-900 text-white',
    badgeLogoUrl: '⚪🟢🔴',
    division: 1
  },
  {
    id: 'cali',
    name: 'Deportivo Cali',
    league: 'Colombiana',
    dt: 'Sergio Herrera',
    reputation: 3,
    initialSalary: 1250,
    marketValue: 6000000,
    starPlayers: ['Fredy Montero', 'Jarlan Barrera', 'Alejandro Rodríguez', 'Gian Cabezas'],
    description: 'El glorioso Azucarero. Un gigante de Cali que busca volver a los primeros puestos de la tabla.',
    badgeColor: 'border-l-4 border-emerald-700 bg-slate-900 text-emerald-100',
    badgeLogoUrl: '🟢⚪⚽',
    division: 1
  },
  {
    id: 'bucaramanga',
    name: 'Atlético Bucaramanga',
    league: 'Colombiana',
    dt: 'Rafael Dudamel',
    reputation: 3,
    initialSalary: 1100,
    marketValue: 5000000,
    starPlayers: ['Aldair Quintana', 'Jefferson Mena', 'Joider Micolta', 'Andrés Ponce'],
    description: 'Los Leopardos de Bucaramanga. Orden táctico impenetrable y gran ambiente en el Alfonso López.',
    badgeColor: 'border-l-4 border-yellow-550 bg-emerald-950/30 text-yellow-100',
    badgeLogoUrl: '🐆🟡🟢',
    division: 1
  },
  {
    id: 'aguilas',
    name: 'Águilas Doradas',
    league: 'Colombiana',
    dt: 'José Luis García',
    reputation: 3,
    initialSalary: 1000,
    marketValue: 4500000,
    starPlayers: ['Jeison Quiñónes', 'Jesús Rivas', 'Jean Pineda', 'Fredy Salazar'],
    description: 'Equipo de transiciones veloces y juego táctico muy coordinado.',
    badgeColor: 'border-l-4 border-yellow-600 bg-neutral-900 text-amber-300',
    badgeLogoUrl: '🦅💛⚽',
    division: 1
  },
  {
    id: 'internacional_bogota',
    name: 'Internacional de Bogotá',
    league: 'Colombiana',
    dt: 'Alexis García',
    reputation: 3,
    initialSalary: 1100,
    marketValue: 4800000,
    starPlayers: ['Washington Ortega', 'Amaury Torralvo', 'Élan Ricardo', 'Johan Rojas'],
    description: 'Anteriormente La Equidad. Estructura física dura, marca pegajosa y difícil de vencer.',
    badgeColor: 'border-l-4 border-emerald-505 bg-slate-900 text-emerald-300',
    badgeLogoUrl: '⚖️🟢⚪',
    division: 1
  },
  {
    id: 'pereira',
    name: 'Deportivo Pereira',
    league: 'Colombiana',
    dt: 'Luis Fernando Suárez',
    reputation: 3,
    initialSalary: 1150,
    marketValue: 5200000,
    starPlayers: ['Darwin Quintero', 'Carlos Darwin', 'Salvador Ichazo', 'Jean Pestaña'],
    description: 'El Matecaña de Pereira, juego alegre en el Hernán Ramírez Villegas.',
    badgeColor: 'border-l-4 border-yellow-500 bg-red-950/20 text-yellow-300',
    badgeLogoUrl: '🟡🔴🐺',
    division: 1
  },
  {
    id: 'fortaleza_fc',
    name: 'Fortaleza FC',
    league: 'Colombiana',
    dt: 'Sebastián Oliveros',
    reputation: 3,
    initialSalary: 900,
    marketValue: 4100000,
    starPlayers: ['Sebastián Navarro', 'Adrián Parra', 'Nicolás Rodríguez'],
    description: 'El equipo de los Amix en Bogotá. Toque rápido, picardía y juego vistoso.',
    badgeColor: 'border-l-4 border-blue-500 bg-red-950/20 text-blue-200',
    badgeLogoUrl: '🏰🔵🔴',
    division: 1
  },
  {
    id: 'pasto',
    name: 'Deportivo Pasto',
    league: 'Colombiana',
    dt: 'Gustavo Florentín',
    reputation: 3,
    initialSalary: 950,
    marketValue: 4300000,
    starPlayers: ['Marco Espíndola', 'Kevin Londoño', 'Daniel Moreno'],
    description: 'Los Volcánicos de Nariño, invencibles de local a gran altura sobre el nivel del mar.',
    badgeColor: 'border-l-4 border-red-600 bg-blue-955/20 text-red-200',
    badgeLogoUrl: '🌋🔴🔵',
    division: 1
  },
  {
    id: 'alianza_fc',
    name: 'Alianza FC',
    league: 'Colombiana',
    dt: 'Hubert Bodhert',
    reputation: 3,
    initialSalary: 920,
    marketValue: 4200000,
    starPlayers: ['Pedro Franco', 'Mayer Gil', 'Andrés Rentería'],
    description: 'El equipo de Valledupar que juega al contraataque letal.',
    badgeColor: 'border-l-4 border-black bg-yellow-950/20 text-slate-100',
    badgeLogoUrl: '🖤💛⚒️',
    division: 1
  },
  {
    id: 'boyaca_chico',
    name: 'Boyacá Chicó',
    league: 'Colombiana',
    dt: 'Jhon Jaime Gómez',
    reputation: 2,
    initialSalary: 750,
    marketValue: 3500000,
    starPlayers: ['Frank Lozano', 'Geimer Balanta', 'Henry Plazas'],
    description: 'El tablero ajedrezado asentado en Tunja con resistencia física de altura.',
    badgeColor: 'border-l-4 border-emerald-650 bg-slate-900 text-white',
    badgeLogoUrl: '🏁🟢🏁',
    division: 1
  },
  {
    id: 'llaneros_fc',
    name: 'Llaneros FC',
    league: 'Colombiana',
    dt: 'Martín Cardetti',
    reputation: 3,
    initialSalary: 780,
    marketValue: 3700000,
    starPlayers: ['Duvan Mosquera', 'Jhildrey Lasso', 'Agustín Fiorilli'],
    description: 'El Orgullo de Villavicencio. Ascendido de gran temporada llanera que debuta en Primera División 2026.',
    badgeColor: 'border-l-4 border-orange-500 bg-orange-950/30 text-orange-200',
    badgeLogoUrl: '🐴⚙️🔸',
    division: 1
  },
  {
    id: 'jaguares',
    name: 'Jaguares de Córdoba',
    league: 'Colombiana',
    dt: 'Nestor Rodríguez',
    reputation: 3,
    initialSalary: 820,
    marketValue: 3800000,
    starPlayers: ['Wilson Morelo', 'Kahiser Lenis', 'Geovanni Banguera'],
    description: 'Los Felinos de Montería, ascendidos de regreso en 2026. Fuerza física adaptada al alto calor costeño.',
    badgeColor: 'border-l-4 border-emerald-600 bg-slate-900 text-emerald-250',
    badgeLogoUrl: '🐱🔵🟢',
    division: 1
  },
  {
    id: 'cucuta',
    name: 'Cúcuta Deportivo',
    league: 'Colombiana',
    dt: 'Bernardo Redín',
    reputation: 3,
    initialSalary: 880,
    marketValue: 4000000,
    starPlayers: ['Jonathan Agudelo', 'Mauricio Duarte', 'Eduar Esteban'],
    description: 'El Doblemente Glorioso en el General Santander, de regreso triunfante en la primera división con caldera de hinchada.',
    badgeColor: 'border-l-4 border-red-650 bg-neutral-900 text-red-200',
    badgeLogoUrl: '🔴⚫🏹',
    division: 1
  },

  // Colombia Division 2
  {
    id: 'cartagena',
    name: 'Real Cartagena',
    league: 'Colombiana',
    dt: 'Sebastian Viera',
    reputation: 2,
    initialSalary: 650,
    marketValue: 2200000,
    starPlayers: ['Christian Marrugo', 'Juanito Moreno', 'Wilfrido de la Rosa', 'Jhonny Jordan', 'Mateo Castillo'],
    description: 'El equipo heroico de Cartagena de Indias. Con un plantel de experimentados de primera y DT de jerarquía buscando el ascenso.',
    badgeColor: 'border-l-4 border-yellow-500 bg-emerald-950/25 text-yellow-101',
    badgeLogoUrl: '🔰🟡🟢',
    division: 2
  },
  {
    id: 'barranquilla_fc',
    name: 'Barranquilla FC',
    league: 'Colombiana',
    dt: 'Nelson Florez',
    reputation: 2,
    initialSalary: 600,
    marketValue: 2000000,
    starPlayers: ['Miller Bacca', 'Jordan Barrera', 'Carlos Cantillo', 'Jhon Vélez', 'Humberto García'],
    description: 'El equipo filial y formador de Barranquilla que compite fuertemente en el Torneo de Ascenso de Colombia.',
    badgeColor: 'border-l-4 border-red-550 bg-red-950/30 text-yellow-300',
    badgeLogoUrl: '🔴💛👹',
    division: 2
  },
  {
    id: 'envigado_fc',
    name: 'Envigado FC',
    league: 'Colombiana',
    dt: 'Andrés Orozco',
    reputation: 2,
    initialSalary: 620,
    marketValue: 2100000,
    starPlayers: ['Joan Parra', 'Felipe Jaramillo', 'Luis Díaz (Jr)', 'Juan Manuel Cuesta'],
    description: 'La Cantera de Héroes, descendida en 2025. Buscan forjar juveniles estrellas en la B para volver al trono.',
    badgeColor: 'border-l-4 border-orange-500 bg-orange-950/20 text-orange-200',
    badgeLogoUrl: '🟠🟢⚽',
    division: 2
  },
  {
    id: 'union_magdalena',
    name: 'Unión Magdalena',
    league: 'Colombiana',
    dt: 'Álvaro Hernández',
    reputation: 2,
    initialSalary: 610,
    marketValue: 1950000,
    starPlayers: ['Cristian Sención', 'Daiver Vega', 'Jannenson Sarmiento'],
    description: 'El Ciclón Bananero de Santa Marta, descendido en 2025 que promete batalla física costera.',
    badgeColor: 'border-l-4 border-blue-600 bg-red-900/10 text-blue-200',
    badgeLogoUrl: '🔵🔴🍌',
    division: 2
  },
  {
    id: 'boca_cali',
    name: 'Boca Juniors de Cali',
    league: 'Colombiana',
    dt: 'Willy Rodríguez',
    reputation: 2,
    initialSalary: 550,
    marketValue: 1800000,
    starPlayers: ['José Torres', 'Yaser Asprilla (Jr)', 'Ferney Angulo'],
    description: 'Tradicional cuadro caleño que juega el ascenso enfocados en formación táctica.',
    badgeColor: 'border-l-4 border-blue-500 bg-yellow-950/20 text-blue-200',
    badgeLogoUrl: '🔵💛⚽',
    division: 2
  },
  {
    id: 'patriotas',
    name: 'Patriotas Boyacá',
    league: 'Colombiana',
    dt: 'Carlos Giraldo',
    reputation: 2,
    initialSalary: 550,
    marketValue: 1800000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'El equipo lancero de Tunja. Fuerte en la altura.',
    badgeColor: 'border-l-4 border-red-600 bg-red-950/20 text-white',
    badgeLogoUrl: '🛡️🔴',
    division: 2
  },
  {
    id: 'quindio',
    name: 'Deportes Quindío',
    league: 'Colombiana',
    dt: 'Carlos Velasco',
    reputation: 2,
    initialSalary: 550,
    marketValue: 1800000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'El equipo Cuyabro, histórico del Eje Cafetero.',
    badgeColor: 'border-l-4 border-green-600 bg-green-950/20 text-yellow-300',
    badgeLogoUrl: '☕🟢',
    division: 2
  },
  {
    id: 'leones_fc',
    name: 'Leones FC',
    league: 'Colombiana',
    dt: 'Felipe Merino',
    reputation: 2,
    initialSalary: 500,
    marketValue: 1600000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Club antioqueño enfocado en potenciar jóvenes talentos.',
    badgeColor: 'border-l-4 border-yellow-500 bg-yellow-950/20 text-yellow-200',
    badgeLogoUrl: '🦁🟡',
    division: 2
  },
  {
    id: 'indep_yumbo',
    name: 'Independiente Valle del Cauca',
    league: 'Colombiana',
    dt: 'Juan Martínez',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Franquicia surgida en 2026 (heredera de Atlético Huila), trasladada de Yumbo a Palmira.',
    badgeColor: 'border-l-4 border-slate-200 bg-slate-950 text-slate-100',
    badgeLogoUrl: '⚪⚫',
    division: 2
  },
  {
    id: 'inter_palmira',
    name: 'Internacional de Palmira',
    league: 'Colombiana',
    dt: 'Héctor Cárdenas',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Nueva franquicia compitiendo con fuerza en el Valle.',
    badgeColor: 'border-l-4 border-blue-500 bg-slate-900 text-white',
    badgeLogoUrl: '🌴🔵',
    division: 2
  },
  {
    id: 'cundinamarca_fc',
    name: 'Real Cundinamarca',
    league: 'Colombiana',
    dt: 'David Suárez',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Representativo de la sabana, juega de local en Mosquera desde 2026.',
    badgeColor: 'border-l-4 border-sky-500 bg-slate-900 text-white',
    badgeLogoUrl: '🦅🩵',
    division: 2
  },
  {
    id: 'orsomarso',
    name: 'Orsomarso',
    league: 'Colombiana',
    dt: 'Steven Sánchez',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Equipo rocoso y complicado de Palmira.',
    badgeColor: 'border-l-4 border-blue-800 bg-white text-blue-900',
    badgeLogoUrl: '🔵⚪',
    division: 2
  },
  {
    id: 'real_santander',
    name: 'Real Santander',
    league: 'Colombiana',
    dt: 'Óscar Álvarez',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Equipo formativo del oriente colombiano.',
    badgeColor: 'border-l-4 border-cyan-400 bg-slate-900 text-white',
    badgeLogoUrl: '🩵⚪',
    division: 2
  },
  {
    id: 'bogota_fc',
    name: 'Bogotá FC',
    league: 'Colombiana',
    dt: 'Sebastián Botero',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'El equipo de la capital que lucha en la B.',
    badgeColor: 'border-l-4 border-yellow-500 bg-red-600 text-yellow-300',
    badgeLogoUrl: '🟡🔴',
    division: 2
  },
  {
    id: 'tigres_fc',
    name: 'Tigres FC',
    league: 'Colombiana',
    dt: 'Rafael Rodríguez',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Felinos bogotanos buscando dar el zarpazo al ascenso.',
    badgeColor: 'border-l-4 border-gray-400 bg-slate-900 text-white',
    badgeLogoUrl: '🐯⚪',
    division: 2
  },
  {
    id: 'atletico_cali',
    name: 'Atlético Cali',
    league: 'Colombiana',
    dt: 'Clodoaldo',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'El otro equipo de Cali con ganas de llegar a Primera.',
    badgeColor: 'border-l-4 border-blue-600 bg-yellow-500 text-blue-900',
    badgeLogoUrl: '🔵🟡',
    division: 2
  },
// ==========================================
  // --- ARGENTINA (LIGA PROFESIONAL) ---
  // ==========================================
  { id: 'san_lorenzo', name: 'San Lorenzo de Almagro', league: 'Argentina', dt: 'Miguel Ángel Russo', reputation: 4, initialSalary: 2100, marketValue: 13000000, starPlayers: ['Adam Bareiro', 'Nahuel Barrios', 'Gastón Hernández', 'Facundo Altamirano'], description: 'El Ciclón de Boedo.', badgeColor: 'border-l-4 border-red-800 bg-blue-950 text-white', badgeLogoUrl: '🌪️', division: 1 },
  { id: 'river', name: 'River Plate', league: 'Argentina', dt: 'Marcelo Gallardo', reputation: 5, initialSalary: 3800, marketValue: 29000000, starPlayers: ['Marcos Acuña', 'Franco Armani', 'Miguel Borja', 'Claudio Echeverri'], description: 'El Millonario.', badgeColor: 'border-l-4 border-red-500 bg-white text-slate-900', badgeLogoUrl: '🐓', division: 1 },
  { id: 'boca', name: 'Boca Juniors', league: 'Argentina', dt: 'Fernando Gago', reputation: 5, initialSalary: 3600, marketValue: 27000000, starPlayers: ['Edinson Cavani', 'Miguel Merentiel', 'Cristian Medina', 'Sergio Romero'], description: 'El Xeneize.', badgeColor: 'border-l-4 border-amber-500 bg-blue-900 text-amber-400', badgeLogoUrl: '🏆', division: 1 },
  { id: 'estudiantes_lp', name: 'Estudiantes de La Plata', league: 'Argentina', dt: 'Eduardo Domínguez', reputation: 4, initialSalary: 2450, marketValue: 15500000, starPlayers: ['Santiago Ascacíbar', 'Enzo Pérez', 'Guido Carrillo', 'José Sosa'], description: 'El Pincha.', badgeColor: 'border-l-4 border-red-600 bg-slate-900 text-white', badgeLogoUrl: '🦁', division: 1 },
  { id: 'gimnasia_lp', name: 'Gimnasia y Esgrima La Plata', league: 'Argentina', dt: 'Marcelo Méndez', reputation: 3, initialSalary: 1500, marketValue: 8000000, starPlayers: ['Benjamín Domínguez', 'Leonardo Morales', 'Nelson Insfrán', 'Pablo De Blasis'], description: 'El Lobo platense.', badgeColor: 'border-l-4 border-blue-800 bg-white text-blue-900', badgeLogoUrl: '🐺', division: 1 },
  { id: 'racing', name: 'Racing Club de Avellaneda', league: 'Argentina', dt: 'Gustavo Costas', reputation: 4, initialSalary: 2800, marketValue: 18000000, starPlayers: ['Adrián Martínez', 'Juan Fernando Quintero', 'Gabriel Arias', 'Roger Martínez'], description: 'La Academia.', badgeColor: 'border-l-4 border-sky-400 bg-sky-950 text-white', badgeLogoUrl: '🎓', division: 1 },
  { id: 'velez', name: 'Vélez Sarsfield', league: 'Argentina', dt: 'Gustavo Quinteros', reputation: 4, initialSalary: 2000, marketValue: 11000000, starPlayers: ['Braian Romero', 'Claudio Aquino', 'Tomás Marchiori', 'Elías Gómez'], description: 'El Fortín de Liniers.', badgeColor: 'border-l-4 border-blue-600 bg-white text-blue-800', badgeLogoUrl: 'V', division: 1 },
  { id: 'independiente', name: 'Independiente', league: 'Argentina', dt: 'Julio Vaccari', reputation: 4, initialSalary: 2300, marketValue: 15000000, starPlayers: ['Gabriel Ávalos', 'Rodrigo Rey', 'Iván Marcone', 'Federico Mancuello'], description: 'El Rey de Copas.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '😈', division: 1 },
  { id: 'lanus', name: 'Lanús', league: 'Argentina', dt: 'Ricardo Zielinski', reputation: 4, initialSalary: 1800, marketValue: 9500000, starPlayers: ['Walter Bou', 'Marcelino Moreno', 'Julio Soler', 'Lucas Acosta'], description: 'El Granate.', badgeColor: 'border-l-4 border-white bg-red-900 text-white', badgeLogoUrl: '🇱🇻', division: 1 },
  { id: 'newells', name: 'Newells Old Boys', league: 'Argentina', dt: 'Mauricio Larriera', reputation: 3, initialSalary: 1700, marketValue: 9000000, starPlayers: ['Ever Banega', 'Ignacio Ramírez', 'Armando Méndez', 'Ian Glavinovich'], description: 'La Lepra.', badgeColor: 'border-l-4 border-red-600 bg-black text-white', badgeLogoUrl: '🔴⚫', division: 1 },
  { id: 'banfield', name: 'Banfield', league: 'Argentina', dt: 'Julio Falcioni', reputation: 3, initialSalary: 1400, marketValue: 7000000, starPlayers: ['Milton Giménez', 'Marcelo Barovero', 'Emanuel Insúa', 'Alejandro Maciel'], description: 'El Taladro.', badgeColor: 'border-l-4 border-green-600 bg-white text-green-800', badgeLogoUrl: ' drill ', division: 1 },
  { id: 'rosario_central', name: 'Rosario Central', league: 'Argentina', dt: 'Ariel Holan', reputation: 4, initialSalary: 2500, marketValue: 16000000, starPlayers: ['Jaminton Campaz', 'Ignacio Malcorra', 'Carlos Quintana', 'Jorge Broun'], description: 'El Canalla.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-900 text-yellow-400', badgeLogoUrl: '🇺🇦', division: 1 },
  { id: 'instituto', name: 'Instituto de Córdoba', league: 'Argentina', dt: 'Diego Dabove', reputation: 3, initialSalary: 1300, marketValue: 6500000, starPlayers: ['Silvio Romero', 'Gastón Lodico', 'Manuel Roffo', 'Fernando Alarcón'], description: 'La Gloria.', badgeColor: 'border-l-4 border-yellow-500 bg-red-600 text-yellow-200', badgeLogoUrl: '🔴🟡', division: 1 },
  { id: 'argentinos_jrs', name: 'Argentinos Juniors', league: 'Argentina', dt: 'Pablo Guede', reputation: 3, initialSalary: 1600, marketValue: 8500000, starPlayers: ['Alan Lescano', 'Maximiliano Romero', 'Luciano Gondou', 'Diego Rodríguez'], description: 'El Bicho de La Paternal.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🐞', division: 1 },
  { id: 'belgrano', name: 'Belgrano de Córdoba', league: 'Argentina', dt: 'Juan Cruz Real', reputation: 3, initialSalary: 1550, marketValue: 8000000, starPlayers: ['Lucas Passerini', 'Ulises Sánchez', 'Nahuel Losada', 'Matías Marín'], description: 'El Pirata.', badgeColor: 'border-l-4 border-black bg-sky-400 text-white', badgeLogoUrl: '🏴‍☠️', division: 1 },
  { id: 'atl_tucuman', name: 'Atlético Tucumán', league: 'Argentina', dt: 'Facundo Sava', reputation: 3, initialSalary: 1350, marketValue: 6800000, starPlayers: ['Mateo Coronel', 'Joaquín Pereyra', 'Guillermo Acosta', 'José Devecchi'], description: 'El Decano.', badgeColor: 'border-l-4 border-white bg-sky-300 text-slate-900', badgeLogoUrl: '🩵⚪', division: 1 },
  { id: 'defensa_y_justicia', name: 'Defensa y Justicia', league: 'Argentina', dt: 'Julio Vaccari', reputation: 3, initialSalary: 1650, marketValue: 8800000, starPlayers: ['Nicolás Fernández', 'Gastón Togni', 'Kevin Gutiérrez', 'Cristopher Fiermarín'], description: 'El Halcón de Varela.', badgeColor: 'border-l-4 border-yellow-500 bg-green-700 text-yellow-300', badgeLogoUrl: '🦅', division: 1 },
  { id: 'huracan', name: 'Huracán', league: 'Argentina', dt: 'Frank Kudelka', reputation: 3, initialSalary: 1450, marketValue: 7500000, starPlayers: ['Ignacio Pussetto', 'Williams Alarcón', 'Lucas Souto', 'Hernán Galíndez'], description: 'El Globo.', badgeColor: 'border-l-4 border-red-600 bg-white text-slate-900', badgeLogoUrl: '🎈', division: 1 },
  { id: 'tigre', name: 'Tigre', league: 'Argentina', dt: 'Sebastián Domínguez', reputation: 3, initialSalary: 1300, marketValue: 6200000, starPlayers: ['Blas Armoa', 'Brahian Alemán', 'Gonzalo Maroni', 'Matías Tagliamonte'], description: 'El Matador de Victoria.', badgeColor: 'border-l-4 border-red-600 bg-blue-800 text-white', badgeLogoUrl: '🐯', division: 1 },
  { id: 'union_sf', name: 'Unión de Santa Fe', league: 'Argentina', dt: 'Kily González', reputation: 3, initialSalary: 1350, marketValue: 6500000, starPlayers: ['Lucas Gamba', 'Mauro Luna Diale', 'Claudio Corvalán', 'Nicolás Campisi'], description: 'El Tatengue.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'talleres', name: 'Talleres de Córdoba', league: 'Argentina', dt: 'Walter Ribonetto', reputation: 4, initialSalary: 2100, marketValue: 13000000, starPlayers: ['Ramón Sosa', 'Federico Girotti', 'Gastón Benavídez', 'Guido Herrera'], description: 'La T cordobesa.', badgeColor: 'border-l-4 border-blue-900 bg-white text-blue-900', badgeLogoUrl: 'T', division: 1 },
  { id: 'platense', name: 'Platense', league: 'Argentina', dt: 'Favio Orsi', reputation: 2, initialSalary: 1100, marketValue: 4800000, starPlayers: ['Ronaldo Martínez', 'Iván Gómez', 'Gastón Suso', 'Juan Pablo Cozzani'], description: 'El Calamar.', badgeColor: 'border-l-4 border-amber-600 bg-white text-amber-700', badgeLogoUrl: '🦑', division: 1 },
  { id: 'sarmiento', name: 'Sarmiento', league: 'Argentina', dt: 'Israel Damonte', reputation: 2, initialSalary: 1050, marketValue: 4500000, starPlayers: ['Lisandro López', 'Juan Insaurralde', 'Fernando Monetti', 'Gabriel Díaz'], description: 'El Verde de Junín.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🟢', division: 1 },
  { id: 'central_cordoba', name: 'Central Córdoba', league: 'Argentina', dt: 'Abel Balbo', reputation: 2, initialSalary: 1000, marketValue: 4200000, starPlayers: ['Tomás Molina', 'Kevin Vázquez', 'Dardo Miloc', 'Luis Ingolotti'], description: 'El Ferroviario.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🚂', division: 1 },
  { id: 'barracas', name: 'Barracas Central', league: 'Argentina', dt: 'Alejandro Orfila', reputation: 2, initialSalary: 1000, marketValue: 4200000, starPlayers: ['Maximiliano Zalazar', 'Rodrigo Insúa', 'Facundo Mater', 'Sebastián Moyano'], description: 'El Guapo.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'indep_rivadavia', name: 'Independiente Rivadavia', league: 'Argentina', dt: 'Martín Cicotello', reputation: 2, initialSalary: 950, marketValue: 4000000, starPlayers: ['Matías Reali', 'Francisco Petrasso', 'Gastón Gil Romero', 'Gonzalo Marinelli'], description: 'La Lepra Mendocina.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '🔵', division: 1 },
  { id: 'riestra', name: 'Riestra', league: 'Argentina', dt: 'Cristian Fabbiani', reputation: 2, initialSalary: 900, marketValue: 3800000, starPlayers: ['Jonathan Herrera', 'Milton Céliz', 'Nicolás Caro Torres', 'Ignacio Arce'], description: 'Los Malevos.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚫', division: 1 },
  { id: 'aldosivi', name: 'Aldosivi', league: 'Argentina', dt: 'Andrés Yllana', reputation: 2, initialSalary: 1100, marketValue: 4800000, starPlayers: ['Jorge Carranza', 'Emanuel Iñiguez', 'Gonzalo Piñeiro', 'Elías Torres'], description: 'El Tiburón de Mar del Plata.', badgeColor: 'border-l-4 border-yellow-400 bg-green-700 text-yellow-300', badgeLogoUrl: '🦈', division: 1 },
  { id: 'estudiantes_rc', name: 'Estudiantes de Río Cuarto', league: 'Argentina', dt: 'Alexis Matteo', reputation: 2, initialSalary: 1050, marketValue: 4500000, starPlayers: ['Guillermo Villalba', 'Tomás González', 'Gastón Arturia', 'Williams Barlasina'], description: 'El León del Imperio.', badgeColor: 'border-l-4 border-sky-400 bg-slate-100 text-sky-600', badgeLogoUrl: '🦁', division: 1 },
  { id: 'gimnasia_mza', name: 'Gimnasia de Mendoza', league: 'Argentina', dt: 'Darío Alaniz', reputation: 2, initialSalary: 1000, marketValue: 4200000, starPlayers: ['Aaron Spetale', 'Leandro Ciccolini', 'Maximiliano Padilla', 'Luis Ojeda'], description: 'El Pituco.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🐺', division: 1 },

  // ==========================================
  // --- ARGENTINA (B NACIONAL) ---
  // ==========================================
  { id: 'san_martin_sj', name: 'San Martín de San Juan', league: 'Argentina', dt: 'Alejandro Schiapparelli', reputation: 2, initialSalary: 800, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-green-600 bg-black text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'godoy_cruz', name: 'Godoy Cruz', league: 'Argentina', dt: 'Daniel Oldrá', reputation: 3, initialSalary: 1400, marketValue: 7000000, starPlayers: ['Tomás Conechny', 'Hernán López', 'Pier Barrios', 'Franco Petroli'], description: 'El Tomba (Descendido en el mod).', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '🍷', division: 2 },
  { id: 'agropecuario', name: 'Agropecuario', league: 'Argentina', dt: 'Gabriel Gómez', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-red-600 bg-green-700 text-white', badgeLogoUrl: '🚜', division: 2 },
  { id: 'all_boys', name: 'All Boys', league: 'Argentina', dt: 'Mauricio Giganti', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Albo. Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚽', division: 2 },
  { id: 'almagro', name: 'Almagro', league: 'Argentina', dt: 'Carlos Mayor', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Tricolor. Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-sky-400 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'almirante_brown', name: 'Almirante Brown', league: 'Argentina', dt: 'Andrés Montenegro', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'La Fragata. Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-black text-yellow-400', badgeLogoUrl: '⚓', division: 2 },
  { id: 'atlanta', name: 'Atlanta', league: 'Argentina', dt: 'Cristian Pellerano', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Bohemio. Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-800 text-yellow-400', badgeLogoUrl: '⚽', division: 2 },
  { id: 'mitre', name: 'Atlético Mitre', league: 'Argentina', dt: 'Claudio Biaggio', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-black text-yellow-400', badgeLogoUrl: '⚽', division: 2 },
  { id: 'central_norte', name: 'Central Norte', league: 'Argentina', dt: 'Mario Sciacqua', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Cuervo salteño. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🐦', division: 2 },
  { id: 'chacarita', name: 'Chacarita', league: 'Argentina', dt: 'Cristian Grabinski', reputation: 2, initialSalary: 800, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Funebrero. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'chaco_for_ever', name: 'Chaco For Ever', league: 'Argentina', dt: 'Pedro Llorens', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'colegiales', name: 'Colegiales', league: 'Argentina', dt: 'Leonardo Fernández', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-800 text-yellow-400', badgeLogoUrl: '⚽', division: 2 },
  { id: 'colon', name: 'Colón', league: 'Argentina', dt: 'Iván Delfino', reputation: 3, initialSalary: 1200, marketValue: 5500000, starPlayers: ['Javier Toledo', 'Sebastián Prediger', 'Paolo Goltz'], description: 'El Sabalero. Histórico en la B Nacional.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🐘', division: 2 },
  { id: 'defensores_belgrano', name: 'Defensores de Belgrano', league: 'Argentina', dt: 'César Vigevani', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'dep_madryn', name: 'Deportivo Madryn', league: 'Argentina', dt: 'Luis García', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-black text-yellow-400', badgeLogoUrl: '⚽', division: 2 },
  { id: 'dep_maipu', name: 'Deportivo Maipú', league: 'Argentina', dt: 'Mariano Echeverría', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'dep_moron', name: 'Deportivo Morón', league: 'Argentina', dt: 'Walter Otta', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Gallo. Compite en B Nacional.', badgeColor: 'border-l-4 border-red-600 bg-white text-red-600', badgeLogoUrl: '🐓', division: 2 },
  { id: 'estudiantes_ba', name: 'Estudiantes de Buenos Aires', league: 'Argentina', dt: 'Alfredo Grelak', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚽', division: 2 },
  { id: 'ferro', name: 'Ferro', league: 'Argentina', dt: 'Juan Sara', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🚂', division: 2 },
  { id: 'gimnasia_jujuy', name: 'Gimnasia de Jujuy', league: 'Argentina', dt: 'Hernán Pellerano', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-sky-400 bg-white text-sky-400', badgeLogoUrl: '⚽', division: 2 },
  { id: 'guemes', name: 'Güemes', league: 'Argentina', dt: 'Pablo Guiñazú', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-red-600 bg-blue-800 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'gimnasia_tiro', name: 'Gimnasia y Tiro de Salta', league: 'Argentina', dt: 'Juan Manuel Azconzábal', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-sky-400 bg-white text-sky-400', badgeLogoUrl: '⚽', division: 2 },
  { id: 'los_andes', name: 'Los Andes', league: 'Argentina', dt: 'Leonardo Lemos', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Milrayitas. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'nueva_chicago', name: 'Nueva Chicago', league: 'Argentina', dt: 'Germán Lanaro', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Torito de Mataderos. Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-green-600 text-white', badgeLogoUrl: '🐂', division: 2 },
  { id: 'patronato', name: 'Patronato', league: 'Argentina', dt: 'Marcelo Candia', reputation: 2, initialSalary: 800, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Patrón. Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'quilmes', name: 'Quilmes', league: 'Argentina', dt: 'Leandro Gracián', reputation: 2, initialSalary: 850, marketValue: 3200000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Cervecero. Compite en B Nacional.', badgeColor: 'border-l-4 border-blue-800 bg-white text-blue-900', badgeLogoUrl: '🍺', division: 2 },
  { id: 'racing_cba', name: 'Racing de Córdoba', league: 'Argentina', dt: 'Gustavo Coleoni', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-sky-400 bg-white text-sky-400', badgeLogoUrl: '⚽', division: 2 },
  { id: 'san_martin_tuc', name: 'San Martín de Tucumán', league: 'Argentina', dt: 'Alejandro Orfila', reputation: 3, initialSalary: 950, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Ciruja. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'san_miguel', name: 'San Miguel', league: 'Argentina', dt: 'Por confirmar', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-green-700 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'san_telmo', name: 'San Telmo', league: 'Argentina', dt: 'Marcelo Vázquez', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Candombero. Compite en B Nacional.', badgeColor: 'border-l-4 border-sky-400 bg-blue-800 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'temperley', name: 'Temperley', league: 'Argentina', dt: 'Nicolás Domingo', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Gasolero. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'tristan_suarez', name: 'Tristán Suárez', league: 'Argentina', dt: 'José María Martínez', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Lechero. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'midland', name: 'Midland', league: 'Argentina', dt: 'Joaquín Iturrería', reputation: 2, initialSalary: 550, marketValue: 1200000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'acassuso', name: 'Acassuso', league: 'Argentina', dt: 'Tobías Kohan', reputation: 2, initialSalary: 550, marketValue: 1200000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'c_bolivar', name: 'C. Bolivar', league: 'Argentina', dt: 'Diego Funes', reputation: 2, initialSalary: 550, marketValue: 1200000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'a_rafaela', name: 'A. Rafaela', league: 'Argentina', dt: 'Fernando Quiroz', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'La Crema. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '⚽', division: 2 },

  // ==========================================
  // --- ARGENTINA (TERCERA DIVISIÓN) ---
  // ==========================================
  { id: 'alvarado', name: 'Alvarado', league: 'Argentina', dt: 'Pablo Martel', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'armenio', name: 'Armenio', league: 'Argentina', dt: 'Fernando Ruiz', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'arsenal_sarandi', name: 'Arsenal de Sarandí', league: 'Argentina', dt: 'Fabián Lisa', reputation: 1, initialSalary: 500, marketValue: 1200000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Arse. Compite en Tercera División.', badgeColor: 'border-l-4 border-sky-400 bg-red-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'boca_unidos', name: 'Boca Unidos', league: 'Argentina', dt: 'Lucas Batistuta', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-yellow-500 bg-red-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'brown_adrogue', name: 'Brown Adrogue', league: 'Argentina', dt: 'Jorge Vivaldo', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-red-600 bg-black text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'cipoletti', name: 'Cipoletti', league: 'Argentina', dt: 'Fabian Enriquez', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚽', division: 3 },
  { id: 'comunicaciones', name: 'Comunicaciones', league: 'Argentina', dt: 'Sergio Leroy', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Cartero. Compite en Tercera.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '⚽', division: 3 },
  { id: 'def_unidos', name: 'Defensores Unidos', league: 'Argentina', dt: 'Sebastián Farías', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'dock_sud', name: 'Dock Sud', league: 'Argentina', dt: 'Miguel Elía', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Docke. Compite en Tercera.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-800 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'douglas_haig', name: 'Douglas Haig', league: 'Argentina', dt: 'Sebastián Cejas', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'excursionistas', name: 'Excursionistas', league: 'Argentina', dt: 'Rodrigo Bilbao', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'guillermo_brown', name: 'Guillermo Brown', league: 'Argentina', dt: 'Christian Corrales', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'huracan_lh', name: 'Huracan LH', league: 'Argentina', dt: 'Sergio Arias', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'j_antoniana', name: 'J. Antoniana', league: 'Argentina', dt: 'Sergio Maza', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'laferrere', name: 'Laferrere', league: 'Argentina', dt: 'César Monasterio', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Villero. Compite en Tercera.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'olimpo', name: 'Olimpo', league: 'Argentina', dt: 'Carlos Mungo', reputation: 1, initialSalary: 500, marketValue: 1200000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '⚽', division: 3 },
  { id: 'sm_mendoza', name: 'SM Mendoza', league: 'Argentina', dt: 'Por confirmar', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'sp_belgrano', name: 'SP Belgrano', league: 'Argentina', dt: 'Cristian Álvarez', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'talleres_re', name: 'Talleres RE', league: 'Argentina', dt: 'Lucas Licht', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'villa_mitre', name: 'Villa Mitre', league: 'Argentina', dt: 'Diego Cochas', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚽', division: 3 },

  // ==========================================
  // --- BRASIL (BRASILEIRAO A) ---
  // ==========================================
  { id: 'cruzeiro', name: 'Cruzeiro', league: 'Brasileña', dt: 'Fernando Diniz', reputation: 4, initialSalary: 4100, marketValue: 24500000, starPlayers: ['Matheus Pereira', 'Kaio Jorge', 'William', 'Lucas Silva'], description: 'La Bestia Negra.', badgeColor: 'border-l-4 border-white bg-blue-600 text-white', badgeLogoUrl: '🦊', division: 1 },
  { id: 'gremio', name: 'Grêmio', league: 'Brasileña', dt: 'Renato Portaluppi', reputation: 4, initialSalary: 4350, marketValue: 24000000, starPlayers: ['Weverton', 'Kannemann', 'Cristaldo', 'Edenilson'], description: 'Imortal Tricolor.', badgeColor: 'border-l-4 border-blue-500 bg-slate-900 text-white', badgeLogoUrl: '🔵', division: 1 },
  { id: 'palmeiras', name: 'Palmeiras', league: 'Brasileña', dt: 'Abel Ferreira', reputation: 5, initialSalary: 6200, marketValue: 42000000, starPlayers: ['Gustavo Gómez', 'Raphael Veiga', 'Richard Ríos', 'Weverton'], description: 'O Verdão.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🟢', division: 1 },
  { id: 'botafogo', name: 'Botafogo', league: 'Brasileña', dt: 'Arthur Jorge', reputation: 4, initialSalary: 4200, marketValue: 27050000, starPlayers: ['Thiago Almada', 'Luiz Henrique', 'Tiquinho Soares', 'John'], description: 'O Glorioso.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🌟', division: 1 },
  { id: 'fluminense', name: 'Fluminense', league: 'Brasileña', dt: 'Mano Menezes', reputation: 4, initialSalary: 4300, marketValue: 25000000, starPlayers: ['Germán Cano', 'Marcelo', 'Jhon Arias', 'Ganso'], description: 'Tricolor das Laranjeiras.', badgeColor: 'border-l-4 border-red-700 bg-green-800 text-white', badgeLogoUrl: '🔴🟢', division: 1 },
  { id: 'sao_paulo', name: 'São Paulo', league: 'Brasileña', dt: 'Luis Zubeldía', reputation: 4, initialSalary: 4200, marketValue: 24000000, starPlayers: ['Lucas Moura', 'Calleri', 'Rafael', 'Arboleda'], description: 'El Tricolor Paulista.', badgeColor: 'border-l-4 border-red-600 bg-white text-black', badgeLogoUrl: '⚪', division: 1 },
  { id: 'atletico_mineiro', name: 'Atlético Mineiro', league: 'Brasileña', dt: 'Gabriel Milito', reputation: 4, initialSalary: 4400, marketValue: 26000000, starPlayers: ['Hulk', 'Paulinho', 'Guilherme Arana', 'Gustavo Scarpa'], description: 'O Galo.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🐔', division: 1 },
  { id: 'corinthians', name: 'Corinthians', league: 'Brasileña', dt: 'Ramón Díaz', reputation: 4, initialSalary: 4500, marketValue: 28000000, starPlayers: ['Yuri Alberto', 'Rodrigo Garro', 'Memphis Depay', 'Hugo Souza'], description: 'El Timão.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚓', division: 1 },
  { id: 'flamengo', name: 'Flamengo', league: 'Brasileña', dt: 'Filipe Luís', reputation: 5, initialSalary: 6500, marketValue: 45000000, starPlayers: ['De Arrascaeta', 'Pedro', 'Gerson', 'Agustín Rossi'], description: 'El Megaclube de Río.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🔴⚫', division: 1 },
  { id: 'internacional', name: 'Internacional', league: 'Brasileña', dt: 'Roger Machado', reputation: 4, initialSalary: 4400, marketValue: 26000000, starPlayers: ['Alan Patrick', 'Borré', 'Enner Valencia', 'Rochet'], description: 'O Colorado.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴', division: 1 },
  { id: 'rb_bragantino', name: 'RB Bragantino', league: 'Brasileña', dt: 'Pedro Caixinha', reputation: 3, initialSalary: 3000, marketValue: 15000000, starPlayers: ['Cleiton', 'Sasha', 'Helinho', 'Juninho Capixaba'], description: 'Massa Bruta.', badgeColor: 'border-l-4 border-red-600 bg-white text-black', badgeLogoUrl: '🐂', division: 1 },
  { id: 'vitoria', name: 'Vitória', league: 'Brasileña', dt: 'Thiago Carpini', reputation: 3, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Osvaldo', 'Lucas Arcanjo', 'Matheuzinho', 'Wagner Leonardo'], description: 'O Leão da Barra.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🦁', division: 1 },
  { id: 'vasco_da_gama', name: 'Vasco da Gama', league: 'Brasileña', dt: 'Rafael Paiva', reputation: 4, initialSalary: 3500, marketValue: 18000000, starPlayers: ['Dimitri Payet', 'Pablo Vegetti', 'Léo Jardim', 'João Victor'], description: 'Gigante da Colina.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚓', division: 1 },
  { id: 'bahia', name: 'Bahia', league: 'Brasileña', dt: 'Rogério Ceni', reputation: 3, initialSalary: 2800, marketValue: 14000000, starPlayers: ['Everton Ribeiro', 'Cauly', 'Thaciano', 'Marcos Felipe'], description: 'Esquadrão de Aço.', badgeColor: 'border-l-4 border-red-600 bg-blue-600 text-white', badgeLogoUrl: '🔵🔴', division: 1 },
  { id: 'mirassol', name: 'Mirassol', league: 'Brasileña', dt: 'Mozart', reputation: 2, initialSalary: 1500, marketValue: 6000000, starPlayers: ['Muralha', 'Fernandinho', 'Dellatorre', 'Danielzinho'], description: 'Leão da Alta.', badgeColor: 'border-l-4 border-green-600 bg-yellow-500 text-black', badgeLogoUrl: '🦁', division: 1 },
  { id: 'santos', name: 'Santos', league: 'Brasileña', dt: 'Fábio Carille', reputation: 4, initialSalary: 3800, marketValue: 20000000, starPlayers: ['Giuliano', 'João Schmidt', 'Gil', 'Guilherme'], description: 'O Peixe.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '🐟', division: 1 },
  { id: 'athletico_pr', name: 'Athletico Paranaense', league: 'Brasileña', dt: 'Lucho González', reputation: 4, initialSalary: 3500, marketValue: 18000000, starPlayers: ['Fernandinho', 'Thiago Heleno', 'Bento', 'Canobbio'], description: 'El Furacão.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🌪️', division: 1 },
  { id: 'remo', name: 'Clube do Remo', league: 'Brasileña', dt: 'Rodrigo Santana', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Marcelo Rangel', 'Ytalo', 'Jaderson', 'Pavani'], description: 'Leão Azul.', badgeColor: 'border-l-4 border-white bg-blue-900 text-white', badgeLogoUrl: '🦁', division: 1 },
  { id: 'coritiba', name: 'Coritiba', league: 'Brasileña', dt: 'Jorginho', reputation: 3, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Robson', 'Sebastián Gómez', 'Natanael', 'Pedro Morisco'], description: 'Coxa-Branca.', badgeColor: 'border-l-4 border-green-600 bg-white text-black', badgeLogoUrl: '🟢⚪', division: 1 },
  { id: 'chapecoense', name: 'Chapecoense', league: 'Brasileña', dt: 'Gilmar Dal Pozzo', reputation: 3, initialSalary: 1800, marketValue: 9000000, starPlayers: ['Mário Sérgio', 'Bruno Leonardo', 'Thomás', 'Marcelo Cabo'], description: 'El Huracán del Oeste.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🏹', division: 1 },

  // ==========================================
  // --- BRASIL (BRASILEIRAO B) ---
  // ==========================================
  { id: 'juventude', name: 'Juventude', league: 'Brasileña', dt: 'Jair Ventura', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Nenê', 'Gabriel', 'Jádson', 'Alan Ruschel'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🟢', division: 2 },
  { id: 'fortaleza_br', name: 'Fortaleza', league: 'Brasileña', dt: 'Juan Pablo Vojvoda', reputation: 3, initialSalary: 1500, marketValue: 8000000, starPlayers: ['Yago Pikachu', 'Tinga', 'João Ricardo', 'Lucero'], description: 'Descendido sorpresivamente en el mod.', badgeColor: 'border-l-4 border-red-600 bg-blue-800 text-white', badgeLogoUrl: '🦁', division: 2 },
  { id: 'ceara', name: 'Ceará', league: 'Brasileña', dt: 'Léo Condé', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Erick Pulga', 'Lourenço', 'Aylon', 'Richard'], description: 'O Vozão.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚫', division: 2 },
  { id: 'sport_recife', name: 'Sport Recife', league: 'Brasileña', dt: 'Pepa', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Lucas Lima', 'Zé Roberto', 'Fabricio Domínguez', 'Caíque França'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🦁', division: 2 },
  { id: 'america_mineiro', name: 'América Mineiro', league: 'Brasileña', dt: 'Lisca', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Juninho', 'Benítez', 'Elias', 'Ricardo Silva'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-green-600 bg-black text-white', badgeLogoUrl: '🐰', division: 2 },
  { id: 'cuiaba', name: 'Cuiabá', league: 'Brasileña', dt: 'Bernardo Franco', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Isidro Pitta', 'Walter', 'Clayson', 'Empereur'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-yellow-500 bg-green-600 text-white', badgeLogoUrl: '🔰', division: 2 },
  { id: 'atletico_goianiense', name: 'Atlético Goianiense', league: 'Brasileña', dt: 'Umberto Louzer', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Luiz Fernando', 'Shaylon', 'Ronaldo', 'Alix Vinicius'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🐉', division: 2 },
  { id: 'novorizontino', name: 'Novorizontino', league: 'Brasileña', dt: 'Eduardo Baptista', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Jordi', 'Luizão', 'Geovane', 'Neto Pessoa'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '🐯', division: 2 },
  { id: 'goias', name: 'Goiás', league: 'Brasileña', dt: 'Vágner Mancini', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Tadeu', 'Marcão', 'Thiago Galhardo', 'Breno Herculano'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🟢', division: 2 },
  { id: 'criciuma', name: 'Criciúma', league: 'Brasileña', dt: 'Cláudio Tencati', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Gustavo', 'Rodrigo', 'Fellipe Mateus', 'Bolasie'], description: 'O Tigre.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '🐯', division: 2 },
  { id: 'crb', name: 'CRB', league: 'Brasileña', dt: 'Hélio dos Anjos', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Léo Pereira', 'Gegê', 'Fábio Alemão', 'Matheus Albino'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴⚪', division: 2 },
  { id: 'operario', name: 'Operário', league: 'Brasileña', dt: 'Rafael Guanaes', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Rafael Santos', 'Willian Machado', 'Jacy Maranhão', 'Ronaldo'], description: 'O Fantasma.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '👻', division: 2 },
  { id: 'vila_nova', name: 'Vila Nova', league: 'Brasileña', dt: 'Thiago Carvalho', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Dênis Júnior', 'Ralf', 'Alesson', 'Jemmes'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🐯', division: 2 },
  { id: 'avai', name: 'Avaí', league: 'Brasileña', dt: 'Enderson Moreira', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['César', 'Vagner Love', 'Giovanni', 'Tiago Pagnussat'], description: 'Leão da Ilha.', badgeColor: 'border-l-4 border-white bg-blue-600 text-white', badgeLogoUrl: '🦁', division: 2 },
  { id: 'botafogo_sp', name: 'Botafogo FC', league: 'Brasileña', dt: 'Paulo Gomes', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['João Carlos', 'Fábio Sanches', 'Bochecha', 'Alexandre Jesus'], description: 'Botafogo de Ribeirão Preto.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴⚪', division: 2 },
  { id: 'athletic_club', name: 'Athletic Club', league: 'Brasileña', dt: 'Roger Silva', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Jefferson', 'Danilo Cardoso', 'Yuri', 'Jonathas'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚫', division: 2 },
  { id: 'londrina', name: 'Londrina', league: 'Brasileña', dt: 'Claudinei Oliveira', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Neneca', 'Rafael Vaz', 'João Paulo', 'Iago Teles'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '🩵', division: 2 },
  { id: 'ponte_preta', name: 'Ponte Preta', league: 'Brasileña', dt: 'Nelsinho Baptista', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Pedro Rocha', 'Mateus Silva', 'Elvis', 'Dodô'], description: 'Macaca.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '🐒', division: 2 },
  { id: 'sao_bernardo', name: 'Sao Bernardo', league: 'Brasileña', dt: 'Ricardo Catalá', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Alex Alves', 'Hélder Maciel', 'Rodrigo Souza', 'Kayke'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '🟡', division: 2 },
  { id: 'nautico', name: 'Nautico', league: 'Brasileña', dt: 'Marquinhos Santos', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Deivity', 'Iran', 'Marco Antônio', 'Paulo Sérgio'], description: 'O Timbu.', badgeColor: 'border-l-4 border-red-600 bg-white text-red-600', badgeLogoUrl: '🔴⚪', division: 2 },
  // ==========================================
  // --- MEXICO (LIGA MX Y EXPANSIÓN) ---
  // ==========================================
  { id: 'america_mex', name: 'América', league: 'Mexicana', dt: 'André Jardine', reputation: 5, initialSalary: 4500, marketValue: 24000000, starPlayers: ['Henry Martín', 'Diego Valdés', 'Álvaro Fidalgo', 'Luis Malagón'], description: 'Las Águilas del Estadio Azteca.', badgeColor: 'border-l-4 border-yellow-400 bg-blue-900 text-yellow-200', badgeLogoUrl: '🦅', division: 1 },
  { id: 'monterrey', name: 'Monterrey', league: 'Mexicana', dt: 'Martín Demichelis', reputation: 5, initialSalary: 4200, marketValue: 22000000, starPlayers: ['Sergio Canales', 'Germán Berterame', 'Esteban Andrada', 'Héctor Moreno'], description: 'Rayados.', badgeColor: 'border-l-4 border-blue-600 bg-white text-blue-900', badgeLogoUrl: '🔵', division: 1 },
  { id: 'tigres', name: 'Tigres U.A.N.L.', league: 'Mexicana', dt: 'Veljko Paunovic', reputation: 5, initialSalary: 4300, marketValue: 23000000, starPlayers: ['André-Pierre Gignac', 'Nahuel Guzmán', 'Sebastián Córdova', 'Guido Pizarro'], description: 'Los Felinos.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-900 text-yellow-300', badgeLogoUrl: '🐯', division: 1 },
  { id: 'cruz_azul', name: 'Cruz Azul', league: 'Mexicana', dt: 'Martín Anselmi', reputation: 5, initialSalary: 3800, marketValue: 18000000, starPlayers: ['Uriel Antuna', 'Willer Ditta', 'Kevin Mier', 'Carlos Rotondi'], description: 'La Máquina.', badgeColor: 'border-l-4 border-white bg-blue-700 text-white', badgeLogoUrl: '🚂', division: 1 },
  { id: 'pumas', name: 'Pumas U.N.A.M.', league: 'Mexicana', dt: 'Gustavo Lema', reputation: 4, initialSalary: 3500, marketValue: 16000000, starPlayers: ['César Huerta', 'Julio González', 'Lisandro Magallán', 'Rogelio Funes Mori'], description: 'Los Universitarios.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-900 text-yellow-400', badgeLogoUrl: '🐾', division: 1 },
  { id: 'chivas', name: 'Guadalajara', league: 'Mexicana', dt: 'Fernando Gago', reputation: 5, initialSalary: 4000, marketValue: 20000000, starPlayers: ['Roberto Alvarado', 'Chicharito Hernández', 'Fernando Beltrán', 'Gilberto Sepúlveda'], description: 'El Rebaño Sagrado.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🐐', division: 1 },
  { id: 'toluca', name: 'Toluca', league: 'Mexicana', dt: 'Renato Paiva', reputation: 4, initialSalary: 3500, marketValue: 15000000, starPlayers: ['Alexis Vega', 'Tiago Volpi', 'Marcel Ruiz', 'Claudio Baeza'], description: 'Los Diablos Rojos.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '😈', division: 1 },
  { id: 'pachuca', name: 'Pachuca', league: 'Mexicana', dt: 'Guillermo Almada', reputation: 4, initialSalary: 3200, marketValue: 14000000, starPlayers: ['Salomón Rondón', 'Oussama Idrissi', 'Nelson Deossa', 'Erick Sánchez'], description: 'Los Tuzos.', badgeColor: 'border-l-4 border-white bg-blue-900 text-white', badgeLogoUrl: '🐿️', division: 1 },
  { id: 'leon', name: 'León', league: 'Mexicana', dt: 'Jorge Bava', reputation: 4, initialSalary: 3000, marketValue: 13000000, starPlayers: ['Andrés Guardado', 'Federico Viñas', 'Rodolfo Cota', 'Adonis Frías'], description: 'La Fiera.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🦁', division: 1 },
  { id: 'atlas', name: 'Atlas', league: 'Mexicana', dt: 'Beñat San José', reputation: 3, initialSalary: 2500, marketValue: 10000000, starPlayers: ['Camilo Vargas', 'Aldo Rocha', 'Hugo Nervo', 'Eduardo Aguirre'], description: 'Los Zorros.', badgeColor: 'border-l-4 border-red-600 bg-black text-white', badgeLogoUrl: '🦊', division: 1 },
  { id: 'santos_laguna', name: 'Santos Laguna', league: 'Mexicana', dt: 'Ignacio Ambriz', reputation: 3, initialSalary: 2500, marketValue: 10000000, starPlayers: ['Carlos Acevedo', 'Harold Preciado', 'Matheus Dória', 'Pedro Aquino'], description: 'Los Guerreros.', badgeColor: 'border-l-4 border-white bg-green-700 text-white', badgeLogoUrl: '👼', division: 1 },
  { id: 'tijuana', name: 'Club Tijuana', league: 'Mexicana', dt: 'Miguel Herrera', reputation: 3, initialSalary: 2400, marketValue: 9500000, starPlayers: ['Carlos González', 'Christian Rivera', 'Kevin Castañeda', 'Joe Corona'], description: 'Xolos.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🐕', division: 1 },
  { id: 'puebla', name: 'Puebla', league: 'Mexicana', dt: 'José Manuel de la Torre', reputation: 3, initialSalary: 2200, marketValue: 8500000, starPlayers: ['Gastón Silva', 'Diego de Buen', 'Jesús Rodríguez', 'Martín Barragán'], description: 'La Franja.', badgeColor: 'border-l-4 border-sky-400 bg-white text-slate-900', badgeLogoUrl: '🎽', division: 1 },
  { id: 'queretaro', name: 'Querétaro', league: 'Mexicana', dt: 'Mauro Gerk', reputation: 3, initialSalary: 2000, marketValue: 7500000, starPlayers: ['Pablo Barrera', 'Kevin Escamilla', 'Miguel Barbieri', 'Fernando Tapia'], description: 'Los Gallos Blancos.', badgeColor: 'border-l-4 border-black bg-blue-800 text-white', badgeLogoUrl: '🐓', division: 1 },
  { id: 'mazatlan', name: 'Mazatlán FC', league: 'Mexicana', dt: 'Ismael Rescalvo', reputation: 3, initialSalary: 2000, marketValue: 7500000, starPlayers: ['Hugo González', 'Andrés Montaño', 'Luis Amarilla', 'Josué Colmán'], description: 'Los Cañoneros.', badgeColor: 'border-l-4 border-white bg-purple-800 text-white', badgeLogoUrl: '⚓', division: 1 },
  { id: 'necaxa', name: 'Necaxa', league: 'Mexicana', dt: 'Eduardo Fentanes', reputation: 3, initialSalary: 2000, marketValue: 7500000, starPlayers: ['Diber Cambindo', 'Ezequiel Unsain', 'Agustín Oliveros', 'Fernando Arce'], description: 'Los Rayos.', badgeColor: 'border-l-4 border-red-600 bg-white text-slate-900', badgeLogoUrl: '⚡', division: 1 },
  { id: 'juarez', name: 'FC Juárez', league: 'Mexicana', dt: 'Mauricio Barbieri', reputation: 3, initialSalary: 2000, marketValue: 7500000, starPlayers: ['Sebastián Jurado', 'Denzell García', 'Dieter Villalpando', 'Avilés Hurtado'], description: 'Bravos.', badgeColor: 'border-l-4 border-red-600 bg-green-600 text-white', badgeLogoUrl: '🐎', division: 1 },
  { id: 'san_luis', name: 'Atlético de San Luis', league: 'Mexicana', dt: 'Domènec Torrent', reputation: 3, initialSalary: 2200, marketValue: 8500000, starPlayers: ['Vitinho', 'Javier Güémez', 'Cata Domínguez', 'Franck Boli'], description: 'Los Potosinos.', badgeColor: 'border-l-4 border-red-600 bg-white text-slate-900', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'atlante', name: 'Atlante', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'venados_fc', name: 'Venados FC', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'jaiba_brava', name: 'Jaiba Brava', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'morelia', name: 'Morelia', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'irapuato', name: 'Irapuato', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'la_paz', name: 'La Paz', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'leones_negros', name: 'Leones Negros', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'tapatio', name: 'Tapatio', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'mineros', name: 'Mineros', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'correcaminos', name: 'Correcaminos', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'dorados', name: 'Dorados', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'tepatitlan', name: 'Tepatitlan', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'tlaxcala', name: 'Tlaxcala', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cancun_fc', name: 'Cancun FC', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'alebrijes', name: 'Alebrijes', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },

  // ==========================================
  // --- CHILE (PRIMERA Y PRIMERA B) ---
  // ==========================================
  { id: 'colocolo', name: 'Colo-Colo', league: 'Chilena', dt: 'Jorge Almirón', reputation: 4, initialSalary: 2300, marketValue: 16000000, starPlayers: ['Arturo Vidal', 'Carlos Palacios', 'Brayan Cortés', 'Esteban Pavez'], description: 'El Cacique.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🏁', division: 1 },
  { id: 'u_chile', name: 'Universidad de Chile', league: 'Chilena', dt: 'Gustavo Álvarez', reputation: 4, initialSalary: 2000, marketValue: 13000000, starPlayers: ['Leandro Fernández', 'Charles Aránguiz', 'Matías Zaldivia', 'Marcelo Díaz'], description: 'La U.', badgeColor: 'border-l-4 border-red-600 bg-blue-900 text-white', badgeLogoUrl: '🦉', division: 1 },
  { id: 'u_catolica', name: 'Universidad Católica', league: 'Chilena', dt: 'Tiago Nunes', reputation: 4, initialSalary: 2100, marketValue: 14000000, starPlayers: ['Fernando Zampedri', 'Eugenio Mena', 'César Pinares', 'Thomas Gillier'], description: 'Los Cruzados.', badgeColor: 'border-l-4 border-blue-600 bg-white text-slate-900', badgeLogoUrl: '🛡️', division: 1 },
  { id: 'palestino', name: 'Palestino', league: 'Chilena', dt: 'Pablo Sánchez', reputation: 3, initialSalary: 1500, marketValue: 7000000, starPlayers: ['Bryan Carrasco', 'Joe Abrigo', 'César Rigamonti', 'Cristián Suárez'], description: 'Los Árabes.', badgeColor: 'border-l-4 border-red-600 bg-green-700 text-white', badgeLogoUrl: '🇵🇸', division: 1 },
  { id: 'coquimbo_unido', name: 'Coquimbo Unido', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'cobresal', name: 'Cobresal', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'everton', name: 'Everton', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'unión_la_calera', name: 'Unión La Calera', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'huachipato', name: 'Huachipato', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'ñublense', name: 'Ñublense', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'audax_italiano', name: 'Audax Italiano', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'ohiggins', name: 'O\'Higgins', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'deportes_limache', name: 'Deportes Limache', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'deportes_la_serena', name: 'Deportes La Serena', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'deportes_concepción', name: 'Deportes Concepción', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'universidad_de_concepción', name: 'Universidad de Concepción', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'unión_española', name: 'Unión Española', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'deportes_iquique', name: 'Deportes Iquique', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'santiago_wanderers', name: 'Santiago Wanderers', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'curicó_unido', name: 'Curicó Unido', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'deportes_copiapó', name: 'Deportes Copiapó', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'san_luis_de_quillota', name: 'San Luis de Quillota', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'san_marcos_de_arica', name: 'San Marcos de Arica', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cobreloa', name: 'Cobreloa', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'deportes_antofagasta', name: 'Deportes Antofagasta', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'deportes_recoleta', name: 'Deportes Recoleta', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'deportes_temuco', name: 'Deportes Temuco', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'magallanes', name: 'Magallanes', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'rangers_de_talca', name: 'Rangers de Talca', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'deportes_santa_cruz', name: 'Deportes Santa Cruz', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'unión_san_felipe', name: 'Unión San Felipe', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'puerto_montt', name: 'Puerto Montt', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },

  // ==========================================
  // --- URUGUAY (PRIMERA DIVISIÓN) ---
  // ==========================================
  { id: 'penarol', name: 'Peñarol', league: 'Uruguaya', dt: 'Diego Aguirre', reputation: 4, initialSalary: 2200, marketValue: 15400000, starPlayers: ['Leonardo Fernández', 'Washington Aguerre', 'Maxi Silvera', 'Javier Méndez'], description: 'El Carbonero.', badgeColor: 'border-l-4 border-yellow-500 bg-black text-yellow-300', badgeLogoUrl: '🏆', division: 1 },
  { id: 'nacional_uru', name: 'Nacional', league: 'Uruguaya', dt: 'Martín Lasarte', reputation: 4, initialSalary: 2150, marketValue: 14800000, starPlayers: ['Sebastián Coates', 'Nicolás López', 'Luis Mejía', 'Mauricio Pereyra'], description: 'El Bolso.', badgeColor: 'border-l-4 border-blue-600 bg-red-950 text-blue-200', badgeLogoUrl: '🔴⚪🔵', division: 1 },
  { id: 'defensor_sporting', name: 'Defensor Sporting', league: 'Uruguaya', dt: 'Martín Varini', reputation: 3, initialSalary: 1500, marketValue: 7000000, starPlayers: ['Octavio Rivero', 'Fernando Elizari', 'Renzo Giampaoli', 'Kevin Dawson'], description: 'El Tuerto.', badgeColor: 'border-l-4 border-purple-600 bg-purple-900 text-white', badgeLogoUrl: '🟣', division: 1 },
  { id: 'danubio', name: 'Danubio', league: 'Uruguaya', dt: 'Alejandro Apud', reputation: 3, initialSalary: 1400, marketValue: 6500000, starPlayers: ['Mauro Goicoechea', 'Sebastián Fernández', 'Ignacio Pintos', 'Santiago Romero'], description: 'La Franja.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '🎽', division: 1 },
  { id: 'racing_club_uru', name: 'Racing Club', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'liverpool_uru', name: 'Liverpool', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'cerro_largo_uru', name: 'Cerro Largo', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'montevideo_wanderers_uru', name: 'Montevideo Wanderers', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'montevideo_city_torque_uru', name: 'Montevideo City Torque', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'boston_river_uru', name: 'Boston River', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'cerro_uru', name: 'Cerro', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'progreso_uru', name: 'Progreso', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'juventud_de_las_piedras_uru', name: 'Juventud de Las Piedras', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'albion_uru', name: 'Albion', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'c_español_uru', name: 'C. Español', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'maldonado_uru', name: 'Maldonado', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },

  // ==========================================
  // --- PERÚ (LIGA 1) ---
  // ==========================================
  { id: 'universitario', name: 'Universitario', league: 'Peruana', dt: 'Fabián Bustos', reputation: 4, initialSalary: 1800, marketValue: 9000000, starPlayers: ['Edison Flores', 'Alex Valera', 'Andy Polo', 'Williams Riveros'], description: 'Los Cremas.', badgeColor: 'border-l-4 border-yellow-200 bg-red-900 text-yellow-100', badgeLogoUrl: '🟨🟥', division: 1 },
  { id: 'alianza_lima', name: 'Alianza Lima', league: 'Peruana', dt: 'Mariano Soso', reputation: 4, initialSalary: 1700, marketValue: 8500000, starPlayers: ['Hernán Barcos', 'Sebastián Rodríguez', 'Kevin Serna', 'Carlos Zambrano'], description: 'Los Íntimos.', badgeColor: 'border-l-4 border-blue-800 bg-slate-100 text-blue-900', badgeLogoUrl: '🔵⚪', division: 1 },
  { id: 'sporting_cristal', name: 'Sporting Cristal', league: 'Peruana', dt: 'Enderson Moreira', reputation: 4, initialSalary: 1600, marketValue: 8000000, starPlayers: ['Yoshimar Yotún', 'Martín Cauteruccio', 'Ignácio', 'Renato Solís'], description: 'Los Celestes.', badgeColor: 'border-l-4 border-sky-400 bg-sky-800 text-white', badgeLogoUrl: '🩵', division: 1 },
  { id: 'melgar', name: 'Melgar', league: 'Peruana', dt: 'Marco Valencia', reputation: 3, initialSalary: 1400, marketValue: 7000000, starPlayers: ['Bernardo Cuesta', 'Horacio Orzán', 'Leonel Galeano', 'Carlos Cáceda'], description: 'El Dominó.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🔴⚫', division: 1 },
  { id: 'deportivo_garcilaso', name: 'Deportivo Garcilaso', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'adt', name: 'ADT', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sport_huancayo', name: 'Sport Huancayo', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sport_boys', name: 'Sport Boys', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'utc', name: 'UTC', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'atlético_grau', name: 'Atlético Grau', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'cusco_fc', name: 'Cusco FC', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'cienciano', name: 'Cienciano', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'los_chankas', name: 'Los Chankas', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'comerciantes_unidos', name: 'Comerciantes Unidos', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'atlético_sullana', name: 'Atlético Sullana', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'juan_pablo_ii', name: 'Juan Pablo II', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_cajamarca', name: 'FC Cajamarca', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'moquegua', name: 'Moquegua', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },

  // ==========================================
  // --- ECUADOR (LIGA PRO A Y B) ---
  // ==========================================
  { id: 'ldu_quito', name: 'LDU Quito', league: 'Ecuatoriana', dt: 'Vitamina Sánchez', reputation: 4, initialSalary: 2300, marketValue: 16500000, starPlayers: ['Alexander Domínguez', 'Alex Arce', 'Ezequiel Piovi', 'Jhojan Julio'], description: 'El Rey de Copas.', badgeColor: 'border-l-4 border-gray-100 bg-slate-900 text-white', badgeLogoUrl: '⚪', division: 1 },
  { id: 'idv_ecu', name: 'Independiente del Valle', league: 'Ecuatoriana', dt: 'Javier Gandolfi', reputation: 4, initialSalary: 2250, marketValue: 17000000, starPlayers: ['Kendry Páez', 'Junior Sornoza', 'Richard Schunke', 'Renato Ibarra'], description: 'El Matagigantes.', badgeColor: 'border-l-4 border-pink-700 bg-indigo-950 text-pink-200', badgeLogoUrl: '🛡️', division: 1 },
  { id: 'barcelona_sc', name: 'Barcelona SC', league: 'Ecuatoriana', dt: 'Diego López', reputation: 4, initialSalary: 2100, marketValue: 14000000, starPlayers: ['Damián Díaz', 'Javier Burrai', 'Francisco Fydriszewski', 'Leonai Souza'], description: 'El Ídolo del Astillero.', badgeColor: 'border-l-4 border-red-600 bg-yellow-500 text-black', badgeLogoUrl: '🟡', division: 1 },
  { id: 'emelec', name: 'Emelec', league: 'Ecuatoriana', dt: 'Hernán Torres', reputation: 3, initialSalary: 1800, marketValue: 10000000, starPlayers: ['Pedro Ortíz', 'Luis Fernando León', 'Cristhian Noboa', 'Facundo Castelli'], description: 'El Bombillo.', badgeColor: 'border-l-4 border-gray-300 bg-blue-800 text-white', badgeLogoUrl: '💡', division: 1 },
  { id: 'técnico_universitario', name: 'Técnico Universitario', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'delfín', name: 'Delfín', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'deportivo_cuenca', name: 'Deportivo Cuenca', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'universidad_católica_ecu', name: 'Universidad Católica', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'mushuc_runa', name: 'Mushuc Runa', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'macará', name: 'Macará', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'aucas', name: 'Aucas', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'orense', name: 'Orense', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'libertad_fc', name: 'Libertad FC', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'manta_fc', name: 'Manta FC', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'leones_fc_ecu', name: 'Leones FC', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'guayaquil_city', name: 'Guayaquil City', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'vinotinto_fc', name: 'Vinotinto FC', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'el_nacional', name: 'El Nacional', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'gualaceo', name: 'Gualaceo', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'independiente_del_valle_juniors', name: 'Independiente del Valle Juniors', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'san_antonio', name: 'San Antonio', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cumbayá', name: 'Cumbayá', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: '9_de_octubre', name: '9 de Octubre', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'atlético_fc', name: 'Atlético FC', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'dep_santo_domingo', name: 'Dep. Santo Domingo', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: '22_de_julio', name: '22 de Julio', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cuenca_jrs', name: 'Cuenca Jrs', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'ldup', name: 'LDUP', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  // ==========================================
  // --- LIGA BOLIVIANA ---
  // ==========================================
  {
    id: 'real_tomayapo',
    name: 'Real Tomayapo',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'universitario_de_vinto',
    name: 'Universitario de Vinto',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'bolívar',
    name: 'Bolívar',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 4,
    initialSalary: 1800,
    marketValue: 8000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'the_strongest',
    name: 'The Strongest',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 4,
    initialSalary: 1800,
    marketValue: 8000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'real_potosí',
    name: 'Real Potosí',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'nacional_potosí',
    name: 'Nacional Potosí',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'always_ready',
    name: 'Always Ready',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'independiente_petrolero',
    name: 'Independiente Petrolero',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'blooming',
    name: 'Blooming',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'aurora',
    name: 'Aurora',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'gualberto_villarroel',
    name: 'Gualberto Villarroel',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'san_antonio_bulo_bulo',
    name: 'San Antonio Bulo Bulo',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'guabirá',
    name: 'Guabirá',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'oriente_petrolero',
    name: 'Oriente Petrolero',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'real_oruro',
    name: 'Real Oruro',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'club_abb',
    name: 'Club ABB',
    league: 'Boliviana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },

  // ==========================================
  // --- LIGA PARAGUAYA ---
  // ==========================================
  {
    id: 'sportivo_luqueño',
    name: 'Sportivo Luqueño',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'libertad',
    name: 'Libertad',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 4,
    initialSalary: 1800,
    marketValue: 8000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'olimpia',
    name: 'Olimpia',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 4,
    initialSalary: 1800,
    marketValue: 8000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'cerro_porteño',
    name: 'Cerro Porteño',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 4,
    initialSalary: 1800,
    marketValue: 8000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'guaraní',
    name: 'Guaraní',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'sportivo_ameliano',
    name: 'Sportivo Ameliano',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'nacional_paraguay',
    name: 'Nacional',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'sportivo_trinidense',
    name: 'Sportivo Trinidense',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: '2_de_mayo',
    name: '2 de Mayo',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'recoleta',
    name: 'Recoleta',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'rubio_ñu',
    name: 'Rubio Ñu',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'sportivo_san_lorenzo',
    name: 'Sportivo San Lorenzo',
    league: 'Paraguaya',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },

  // ==========================================
  // --- LIGA VENEZOLANA ---
  // ==========================================
  {
    id: 'carabobo_fc',
    name: 'Carabobo FC',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'rayo_zuliano',
    name: 'Rayo Zuliano',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'caracas_fc',
    name: 'Caracas FC',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 4,
    initialSalary: 1800,
    marketValue: 8000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'deportivo_táchira',
    name: 'Deportivo Táchira',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 4,
    initialSalary: 1800,
    marketValue: 8000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'metropolitanos_fc',
    name: 'Metropolitanos FC',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'deportivo_la_guaira',
    name: 'Deportivo La Guaira',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'academia_puerto_cabello',
    name: 'Academia Puerto Cabello',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'monagas_sc',
    name: 'Monagas SC',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'universidad_central',
    name: 'Universidad Central',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'estudiantes_de_mérida',
    name: 'Estudiantes de Mérida',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'portuguesa_fc',
    name: 'Portuguesa FC',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'deportivo_anzoátegui',
    name: 'Deportivo Anzoátegui',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'zamora_fc',
    name: 'Zamora FC',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'trujillanos',
    name: 'Trujillanos',
    league: 'Venezolana',
    dt: 'Director Técnico',
    reputation: 2,
    initialSalary: 1100,
    marketValue: 3500000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },

  // ==========================================
  // --- RESTO DEL MUNDO ---
  // ==========================================
  {
    id: 'olimpia_h',
    name: 'Olimpia (H)',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'motagua',
    name: 'Motagua',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'saprissa',
    name: 'Saprissa',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'alajuelense',
    name: 'Alajuelense',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'herediano',
    name: 'Herediano',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'independiente_de_panamá',
    name: 'Independiente de Panamá',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'comunicaciones_gt',
    name: 'Comunicaciones',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'real_estelí',
    name: 'Real Estelí',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'al_ahly',
    name: 'Al Ahly',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'urawa_red_diamonds',
    name: 'Urawa Red Diamonds',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'mamelodi_sundowns',
    name: 'Mamelodi Sundowns',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'auckland_city',
    name: 'Auckland City',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'espérance',
    name: 'Espérance',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'wydad_casablanca',
    name: 'Wydad Casablanca',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'jorge_wilstermann',
    name: 'Jorge Wilstermann',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'ferroviária',
    name: 'Ferroviária',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'volta_redonda',
    name: 'Volta Redonda',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'paysandu',
    name: 'Paysandu',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'amazonas_fc',
    name: 'Amazonas FC',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'santiago_morning',
    name: 'Santiago Morning',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'imbabura',
    name: 'Imbabura',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'chacaritas',
    name: 'Chacaritas',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'atlético_tembetary',
    name: 'Atlético Tembetary',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'general_caballero',
    name: 'General Caballero',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'alianza_universidad',
    name: 'Alianza Universidad',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'ayacucho_fc',
    name: 'Ayacucho FC',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'plaza_colonia',
    name: 'Plaza Colonia',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'miramar_misiones',
    name: 'Miramar Misiones',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'river_plate_uruguay',
    name: 'River Plate Uruguay',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  {
    id: 'yaracuyanos_fc',
    name: 'Yaracuyanos FC',
    league: 'Resto del Mundo',
    dt: 'Director Técnico',
    reputation: 3,
    initialSalary: 1500,
    marketValue: 5000000,
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    division: 1
  },
  // ==========================================
  // --- ALEMANIA (PRIMERA) ---
  // ==========================================
  { id: '1_fc_koln', name: '1. FC Köln', league: 'Alemana', dt: 'René Wagner', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: '1. FC Köln. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-slate-900/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: '1_fsv_mainz_05', name: '1. FSV Mainz 05', league: 'Alemana', dt: 'Urs Fischer', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: '1. FSV Mainz 05. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'borussia_dortmund', name: 'Borussia Dortmund', league: 'Alemana', dt: 'Niko Kovac', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Borussia Dortmund. Compite en Bundesliga.', badgeColor: 'border-l-4 border-yellow-400 bg-zinc-950/40 text-yellow-300', badgeLogoUrl: '💛🖤', division: 1 },
  { id: 'borussia_monchengladbach', name: 'Borussia Mönchengladbach', league: 'Alemana', dt: 'Eugen Polanski', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Borussia Mönchengladbach. Compite en Bundesliga.', badgeColor: 'border-l-4 border-zinc-300 bg-zinc-950/40 text-zinc-200', badgeLogoUrl: '⚫⚪', division: 1 },
  { id: 'eintracht_frankfurt', name: 'Eintracht Frankfurt', league: 'Alemana', dt: 'Adi Hütter', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Eintracht Frankfurt. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '⚫🔴', division: 1 },
  { id: 'fc_augsburg', name: 'FC Augsburg', league: 'Alemana', dt: 'Manuel Baum', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'FC Augsburg. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-green-950/40 text-red-200', badgeLogoUrl: '🔴🟢', division: 1 },
  { id: 'fc_bayern_munchen', name: 'FC Bayern München', league: 'Alemana', dt: 'Vincent Kompany', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'FC Bayern München. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'fc_heidenheim', name: 'FC Heidenheim', league: 'Alemana', dt: 'Frank Schmidt', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'FC Heidenheim. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔴🔵', division: 1 },
  { id: 'fc_st_pauli', name: 'FC St. Pauli', league: 'Alemana', dt: 'Marcel Rapp', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'FC St. Pauli. Compite en Bundesliga.', badgeColor: 'border-l-4 border-amber-800 bg-zinc-950/40 text-amber-200', badgeLogoUrl: '🟤⚪', division: 1 },
  { id: 'rb_leipzig', name: 'RB Leipzig', league: 'Alemana', dt: 'Martín Demichelis', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'RB Leipzig. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-500 bg-slate-900/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'sc_freiburg', name: 'SC Freiburg', league: 'Alemana', dt: 'Julian Schuster', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'SC Freiburg. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚫', division: 1 },
  { id: 'sv_werder_bremen', name: 'SV Werder Bremen', league: 'Alemana', dt: 'Daniel Thioune', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'SV Werder Bremen. Compite en Bundesliga.', badgeColor: 'border-l-4 border-green-600 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪', division: 1 },
  { id: 'tsg_hoffenheim', name: 'TSG Hoffenheim', league: 'Alemana', dt: 'Christian Ilzer', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'TSG Hoffenheim. Compite en Bundesliga.', badgeColor: 'border-l-4 border-blue-500 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪', division: 1 },
  { id: 'union_berlin', name: '1. FC Union Berlin', league: 'Alemana', dt: 'Mauro Lustrinelli', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: '1. FC Union Berlin. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-yellow-300', badgeLogoUrl: '🔴🟡', division: 1 },
  { id: 'vfl_wolfsburg', name: 'VfL Wolfsburg', league: 'Alemana', dt: 'Tobias Strobl', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'VfL Wolfsburg. Compite en Bundesliga.', badgeColor: 'border-l-4 border-green-500 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪', division: 1 },
  { id: 'vfb_stuttgart', name: 'VfB Stuttgart', league: 'Alemana', dt: 'Sebastian Hoeneß', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'VfB Stuttgart. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-slate-900/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'bayer_leverkusen', name: 'Bayer 04 Leverkusen', league: 'Alemana', dt: 'Carles Martínez', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Bayer 04 Leverkusen. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-300', badgeLogoUrl: '🔴⚫', division: 1 },
  { id: 'hamburg', name: 'Hamburger SV', league: 'Alemana', dt: 'Merlin Polzin', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Hamburger SV. Compite en Bundesliga.', badgeColor: 'border-l-4 border-blue-700 bg-zinc-950/40 text-blue-200', badgeLogoUrl: '🔵⚫', division: 1 },
  // ==========================================
  // --- ALEMANIA (SEGUNDA) ---
  // ==========================================
  { id: '1_fc_kaiserslautern', name: '1. FC Kaiserslautern', league: 'Alemana', dt: 'Torsten Lieberknecht', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: '1. FC Kaiserslautern. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 2 },
  { id: '1_fc_nurnberg', name: '1. FC Nürnberg', league: 'Alemana', dt: 'Miroslav Klose', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: '1. FC Nürnberg. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-red-800 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 2 },
  { id: 'darmstadt_98', name: 'Darmstadt 98', league: 'Alemana', dt: 'Florian Kohfeldt', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Darmstadt 98. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪', division: 2 },
  { id: 'eintracht_braunschweig', name: 'Eintracht Braunschweig', league: 'Alemana', dt: 'Lars Kornetka', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Eintracht Braunschweig. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-yellow-400 bg-blue-950/40 text-yellow-300', badgeLogoUrl: '🦁🟡', division: 2 },
  { id: 'fortuna_dusseldorf', name: 'Fortuna Düsseldorf', league: 'Alemana', dt: 'Alexander Ende', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Fortuna Düsseldorf. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-red-600 bg-slate-900/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 2 },
  { id: 'greuther_furth', name: 'Greuther Fürth', league: 'Alemana', dt: 'Heiko Vogel', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Greuther Fürth. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-green-600 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪', division: 2 },
  { id: 'hannover_96', name: 'Hannover 96', league: 'Alemana', dt: 'Christian Titz', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Hannover 96. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-green-600 bg-zinc-950/40 text-green-200', badgeLogoUrl: '🟢⚫', division: 2 },
  { id: 'hertha_bsc', name: 'Hertha BSC', league: 'Alemana', dt: 'Stefan Leitl', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Hertha BSC. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪', division: 2 },
  { id: 'karlsruher_sc', name: 'Karlsruher SC', league: 'Alemana', dt: 'Maximilian Senft', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Karlsruher SC. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-sky-500 bg-sky-950/40 text-sky-200', badgeLogoUrl: '🔵⚪', division: 2 },
  { id: 'magdeburg', name: 'Magdeburg', league: 'Alemana', dt: 'Petrik Sander', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: '1. FC Magdeburg. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪', division: 2 },
  { id: 'preussen_munster', name: 'Preußen Münster', league: 'Alemana', dt: 'Thomas Wörle', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Preußen Münster. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-green-600 bg-zinc-950/40 text-green-200', badgeLogoUrl: '⚫💚', division: 2 },
  { id: 'schalke_04', name: 'FC Schalke 04', league: 'Alemana', dt: 'Miron Muslic', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'FC Schalke 04. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-700 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪', division: 2 },
  { id: 'sc_paderborn_07', name: 'SC Paderborn 07', league: 'Alemana', dt: 'Ralf Kettemann', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'SC Paderborn 07. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪', division: 2 },
  { id: 'sv_elversberg', name: 'SV Elversberg', league: 'Alemana', dt: 'Vincent Wagner', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'SV Elversberg. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-500 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪', division: 2 },
  { id: 'holstein_kiel', name: 'Holstein Kiel', league: 'Alemana', dt: 'Tim Walter', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Holstein Kiel. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪', division: 2 },
  { id: 'vfl_bochum', name: 'VfL Bochum', league: 'Alemana', dt: 'Uwe Rösler', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'VfL Bochum. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-sky-600 bg-blue-950/40 text-sky-200', badgeLogoUrl: '🔵⚪', division: 2 },
  { id: 'arminia_bielefeld', name: 'Arminia Bielefeld', league: 'Alemana', dt: 'Oliver Kirch', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Arminia Bielefeld. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-sky-400 bg-zinc-950/40 text-sky-200', badgeLogoUrl: '⚫🔵', division: 2 },
  { id: 'dynamo_dresden', name: 'Dynamo Dresden', league: 'Alemana', dt: 'Thomas Stamm', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Dynamo Dresden. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-yellow-400 bg-zinc-950/40 text-yellow-300', badgeLogoUrl: '💛🖤', division: 2 },
  // ==========================================
  // --- INGLATERRA (PREMIER LEAGUE) ---
  // ==========================================
  { id: 'arsenal', name: 'Arsenal', league: 'Inglesa', dt: 'DT Genérico', reputation: 5, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Arsenal. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'chelsea', name: 'Chelsea', league: 'Inglesa', dt: 'DT Genérico', reputation: 5, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Chelsea. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'liverpool_eng', name: 'Liverpool', league: 'Inglesa', dt: 'DT Genérico', reputation: 5, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liverpool. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'manchester_city', name: 'Manchester City', league: 'Inglesa', dt: 'DT Genérico', reputation: 5, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Manchester City. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'manchester_united', name: 'Manchester United', league: 'Inglesa', dt: 'DT Genérico', reputation: 5, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Manchester United. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'tottenham_hotspur', name: 'Tottenham Hotspur', league: 'Inglesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Tottenham Hotspur. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'newcastle_united', name: 'Newcastle United', league: 'Inglesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Newcastle United. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'aston_villa', name: 'Aston Villa', league: 'Inglesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Aston Villa. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'west_ham_united', name: 'West Ham United', league: 'Inglesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'West Ham United. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'brighton_hove_albion', name: 'Brighton & Hove Albion', league: 'Inglesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Brighton & Hove Albion. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'brentford', name: 'Brentford', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 1500, marketValue: 6000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Brentford. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'crystal_palace', name: 'Crystal Palace', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 1500, marketValue: 6000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Crystal Palace. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'everton_eng', name: 'Everton', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 1500, marketValue: 6000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Everton. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fulham', name: 'Fulham', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 1500, marketValue: 6000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Fulham. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'wolverhampton_wanderers', name: 'Wolverhampton Wanderers', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 1500, marketValue: 6000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Wolverhampton Wanderers. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'nottingham_forest', name: 'Nottingham Forest', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 1500, marketValue: 6000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Nottingham Forest. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'afc_bournemouth', name: 'AFC Bournemouth', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 1500, marketValue: 6000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'AFC Bournemouth. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'burnley', name: 'Burnley', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Burnley. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'leeds_united', name: 'Leeds United', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Leeds United. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sunderland', name: 'Sunderland', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Sunderland. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },

  // ==========================================
  // --- ITALIA (PRIMERA) ---
  // ==========================================
  { id: 'atalanta', name: 'Atalanta', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Atalanta. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'bologna', name: 'Bologna', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Bologna. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'cagliari', name: 'Cagliari', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Cagliari. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'como', name: 'Como', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Como. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'empoli', name: 'Empoli', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Empoli. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fiorentina', name: 'Fiorentina', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Fiorentina. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'genoa', name: 'Genoa', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Genoa. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'hellas_verona', name: 'Hellas Verona', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Hellas Verona. Descendió a la Serie BKT para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'inter', name: 'Inter', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Inter. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'juventus', name: 'Juventus', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Juventus. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'lazio', name: 'Lazio', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Lazio. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'lecce', name: 'Lecce', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Lecce. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'milan', name: 'Milan', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Milan. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'monza', name: 'Monza', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Monza. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'napoli', name: 'Napoli', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Napoli. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'parma', name: 'Parma', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Parma. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'roma', name: 'Roma', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Roma. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'torino', name: 'Torino', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Torino. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'udinese', name: 'Udinese', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Udinese. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'venezia', name: 'Venezia', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Venezia. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  // ==========================================
  // --- ITALIA (SEGUNDA) ---
  // ==========================================
  { id: 'bari', name: 'Bari', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Bari. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'brescia', name: 'Brescia', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Brescia. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'carrarese', name: 'Carrarese', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Carrarese. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'catanzaro', name: 'Catanzaro', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Catanzaro. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cesena', name: 'Cesena', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Cesena. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cittadella', name: 'Cittadella', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Cittadella. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cosenza', name: 'Cosenza', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Cosenza. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cremonese', name: 'Cremonese', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Cremonese. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'frosinone', name: 'Frosinone', league: 'Italiana', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Frosinone. Ascendió a la Serie A Enilive para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'juve_stabia', name: 'Juve Stabia', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Juve Stabia. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'mantova', name: 'Mantova', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Mantova. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'modena', name: 'Modena', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Modena. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'palermo', name: 'Palermo', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Palermo. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'pisa', name: 'Pisa', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Pisa. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'reggiana', name: 'Reggiana', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Reggiana. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'salernitana', name: 'Salernitana', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Salernitana. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'sampdoria', name: 'Sampdoria', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Sampdoria. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'sassuolo', name: 'Sassuolo', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Sassuolo. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'spezia', name: 'Spezia', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Spezia. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'sudtirol', name: 'Sudtirol', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Sudtirol. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
 // ==========================================
  // --- FRANCIA (PRIMERA) ---
  // ==========================================
  { id: 'aj_auxerre', name: 'AJ Auxerre', league: 'Francesa', dt: 'Will Still', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'AJ Auxerre. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'angers_sco', name: 'Angers SCO', league: 'Francesa', dt: 'Stéphane Gilli', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Angers SCO. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'as_monaco', name: 'AS Monaco', league: 'Francesa', dt: 'Filipe Luís', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'AS Monaco. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'as_saint_etienne', name: 'AS Saint-Étienne', league: 'Francesa', dt: 'Ian Cathro', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'AS Saint-Étienne. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'brest', name: 'Brest', league: 'Francesa', dt: 'Julien Lachuer', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Brest. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'le_havre_ac', name: 'Le Havre AC', league: 'Francesa', dt: 'Didier Digard', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Le Havre AC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'lens', name: 'Lens', league: 'Francesa', dt: 'Dino Toppmöller', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Lens. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'lille_osc', name: 'Lille OSC', league: 'Francesa', dt: 'Davide Ancelotti', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Lille OSC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'montpellier_hsc', name: 'Montpellier HSC', league: 'Francesa', dt: 'Zoumana Camara', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Montpellier HSC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'nantes', name: 'Nantes', league: 'Francesa', dt: 'Michel Der Zakarian', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Nantes. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'nice', name: 'Nice', league: 'Francesa', dt: 'Olivier Pantaloni', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Nice. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'olympique_lyonnais', name: 'Olympique Lyonnais', league: 'Francesa', dt: 'Paulo Fonseca', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Olympique Lyonnais. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'olympique_de_marseille', name: 'Olympique de Marseille', league: 'Francesa', dt: 'Bruno Génésio', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Olympique de Marseille. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'paris_saint_germain', name: 'Paris Saint-Germain', league: 'Francesa', dt: 'Luis Enrique', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Paris Saint-Germain. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'racing_club_de_strasbourg_alsace', name: 'Racing Club de Strasbourg Alsace', league: 'Francesa', dt: 'Hugo Oliveira', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Racing Club de Strasbourg Alsace. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'stade_de_reims', name: 'Stade de Reims', league: 'Francesa', dt: 'Nicolas Usaï', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Stade de Reims. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'stade_rennais_fc', name: 'Stade Rennais FC', league: 'Francesa', dt: 'Franck Haise', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Stade Rennais FC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'toulouse_fc', name: 'Toulouse FC', league: 'Francesa', dt: 'Jens Berthel Askou', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Toulouse FC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  // ==========================================
  // --- HOLANDA (PRIMERA) ---
  // ==========================================
  { id: 'ajax', name: 'Ajax', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Ajax. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'almere_city_fc', name: 'Almere City FC', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Almere City FC. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'az', name: 'AZ', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'AZ. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_groningen', name: 'FC Groningen', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'FC Groningen. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_twente', name: 'FC Twente', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'FC Twente. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_utrecht', name: 'FC Utrecht', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'FC Utrecht. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'feyenoord', name: 'Feyenoord', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Feyenoord. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'go_ahead_eagles', name: 'Go Ahead Eagles', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Go Ahead Eagles. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'heracles_almelo', name: 'Heracles Almelo', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Heracles Almelo. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'nac_breda', name: 'NAC Breda', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'NAC Breda. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'nec_nijmegen', name: 'NEC Nijmegen', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'NEC Nijmegen. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'pec_zwolle', name: 'PEC Zwolle', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'PEC Zwolle. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'psv', name: 'PSV', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'PSV. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'rkc_waalwijk', name: 'RKC Waalwijk', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'RKC Waalwijk. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sc_heerenveen', name: 'SC Heerenveen', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'SC Heerenveen. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sparta_rotterdam', name: 'Sparta Rotterdam', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Sparta Rotterdam. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'willem_ii', name: 'Willem II', league: 'Holandesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Willem II. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  // ==========================================
  // --- PORTUGAL (PRIMERA) ---
  // ==========================================
  { id: 'avs_futebol_sad', name: 'AVS Futebol SAD', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'boavista_fc', name: 'Boavista FC', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'casa_pia', name: 'Casa Pia', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'cd_nacional', name: 'CD Nacional', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'cd_santa_clara', name: 'CD Santa Clara', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'estrela_amadora', name: 'Estrela Amadora', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'estoril_praia', name: 'Estoril Praia', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_arouca', name: 'FC Arouca', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_famalicao', name: 'FC Famalicão', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_porto', name: 'FC Porto', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'gil_vicente_fc', name: 'Gil Vicente FC', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'moreirense_fc', name: 'Moreirense FC', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'rio_ave_fc', name: 'Rio Ave FC', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sl_benfica', name: 'SL Benfica', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sc_braga', name: 'SC Braga', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sc_farense', name: 'SC Farense', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sporting_cp', name: 'Sporting CP', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'vitoria_sc', name: 'Vitória SC', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  // ==========================================
  // --- ESTADOS UNIDOS (MLS) ---
  // ==========================================
  { id: 'atlanta_united', name: 'Atlanta United', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'austin_fc', name: 'Austin FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'cf_montreal', name: 'CF Montréal', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'charlotte_fc', name: 'Charlotte FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'chicago_fire', name: 'Chicago Fire', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'colorado_rapids', name: 'Colorado Rapids', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'columbus_crew', name: 'Columbus Crew', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'dc_united', name: 'DC United', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_cincinnati', name: 'FC Cincinnati', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_dallas', name: 'FC Dallas', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'houston_dynamo', name: 'Houston Dynamo', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'inter_miami_cf', name: 'Inter Miami CF', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'la_galaxy', name: 'LA Galaxy', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'lafc', name: 'LAFC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'minnesota_united', name: 'Minnesota United', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'nashville_sc', name: 'Nashville SC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'new_england', name: 'New England', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'new_york_city_fc', name: 'New York City FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'ny_red_bulls', name: 'NY Red Bulls', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'orlando_city', name: 'Orlando City', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'philadelphia', name: 'Philadelphia', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'portland_timbers', name: 'Portland Timbers', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'real_salt_lake', name: 'Real Salt Lake', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'san_diego_fc', name: 'San Diego FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'san_jose', name: 'San Jose', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'seattle_sounders', name: 'Seattle Sounders', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sporting_kc', name: 'Sporting KC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'st_louis_city_sc', name: 'St. Louis CITY SC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'toronto_fc', name: 'Toronto FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'vancouver_whitecaps', name: 'Vancouver Whitecaps', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  // ==========================================
  // --- ESPAÑA (PRIMERA) ---
  // ==========================================
  { id: 'athletic_club_esp', name: 'Athletic Club', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'atletico_de_madrid', name: 'Atlético de Madrid', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'ca_osasuna', name: 'CA Osasuna', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'celta', name: 'Celta', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'd_alaves', name: 'D. Alavés', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'elche_cf', name: 'Elche CF', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'fc_barcelona', name: 'FC Barcelona', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'getafe_cf', name: 'Getafe CF', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'girona_fc', name: 'Girona FC', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Descendió a LALIGA HYPERMOTION para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'levante_ud', name: 'Levante UD', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'r_oviedo', name: 'R. Oviedo', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Descendió a LALIGA HYPERMOTION para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'rcd_espanyol', name: 'RCD Espanyol', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'rcd_mallorca', name: 'RCD Mallorca', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Descendió a LALIGA HYPERMOTION para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'rayo_vallecano', name: 'Rayo Vallecano', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'real_betis', name: 'Real Betis', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'real_madrid', name: 'Real Madrid', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'real_sociedad', name: 'Real Sociedad', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'sevilla_fc', name: 'Sevilla FC', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'valencia_cf', name: 'Valencia CF', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'villarreal_cf', name: 'Villarreal CF', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  // ==========================================
  // --- ESPAÑA (SEGUNDA) ---
  // ==========================================
  { id: 'ad_ceuta_fc', name: 'AD Ceuta FC', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'albacete_bp', name: 'Albacete BP', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'burgos_cf', name: 'Burgos CF', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cd_castellon', name: 'CD Castellón', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cd_leganes', name: 'CD Leganés', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cd_mirandes', name: 'CD Mirandés', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cultural_leonesa', name: 'Cultural Leonesa', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cadiz_cf', name: 'Cádiz CF', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cordoba_cf', name: 'Córdoba CF', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'fc_andorra', name: 'FC Andorra', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'granada_cf', name: 'Granada CF', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'malaga_cf', name: 'Málaga CF', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Ascendió a LALIGA EA SPORTS para la temporada 2026-27 tras ganar la final del playoff a la UD Almería.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'r_racing_club', name: 'R. Racing Club', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Ascendió a LALIGA EA SPORTS para la temporada 2026-27 como campeón de Segunda, tras 14 años fuera de Primera.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'r_sporting', name: 'R. Sporting', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'r_valladolid_cf', name: 'R. Valladolid CF', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'rc_deportivo', name: 'RC Deportivo', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Ascendió a LALIGA EA SPORTS para la temporada 2026-27, tras 8 años fuera de Primera.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'real_sociedad_b', name: 'Real Sociedad B', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'real_zaragoza', name: 'Real Zaragoza', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'sd_eibar', name: 'SD Eibar', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'sd_huesca', name: 'SD Huesca', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'ud_almeria', name: 'UD Almería', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'ud_las_palmas', name: 'UD Las Palmas', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },

  // ==========================================
  // --- CLUBES CLASIFICADOS A CHAMPIONS / EUROPA LEAGUE 2025-26 (Fase 1c) ---
  // Países sin liga doméstica jugable en el juego (no aparecen como
  // nacionalidad seleccionable en SetupScreen): solo participan de las
  // copas europeas. DT y figuras verificados en Transfermarkt (jul-2026).
  // marketValue/initialSalary escalados a la economía interna del juego
  // (no son los valores reales de Transfermarkt, que llegan a los
  // €300M+ y romperían el balance frente al resto de la base de datos).
  // ==========================================
  { id: 'club_brugge', name: 'Club Brugge KV', league: 'Belga', dt: 'Ivan Leko', reputation: 5, initialSalary: 5600, marketValue: 38000000, starPlayers: ['Christos Tzolis', 'Joel Ordóñez', 'Nicolò Tresoldi', 'Raphael Onyedika', 'Joaquin Seys'], description: 'Clasificado a la Champions League 2025-26. El grande de Brujas, referente de la Jupiler Pro League.', badgeColor: 'border-l-4 border-blue-600 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚫', division: 1 },
  { id: 'union_sg', name: 'Royale Union Saint-Gilloise', league: 'Belga', dt: 'David Hubert', reputation: 4, initialSalary: 3200, marketValue: 22000000, starPlayers: ['Anan Khalaili', 'Promise David', 'Kevin Mac Allister', 'Adem Zorgane', 'Kamiel Van De Perre'], description: 'Clasificado a la Champions League 2025-26. Campeón belga, en plena resurrección europea.', badgeColor: 'border-l-4 border-yellow-400 bg-blue-900 text-yellow-200', badgeLogoUrl: '💛💙', division: 1 },
  { id: 'krc_genk', name: 'KRC Genk', league: 'Belga', dt: 'Jess Thorup', reputation: 4, initialSalary: 3100, marketValue: 21000000, starPlayers: ['Konstantinos Karetsas', 'Zakaria El Ouahdi', 'Matte Smets', 'Bryan Heynen', 'Ibrahima Sory Bangoura'], description: 'Clasificado a la Europa League 2025-26. Cantera prolífica del fútbol belga.', badgeColor: 'border-l-4 border-blue-500 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪', division: 1 },
  { id: 'olympiacos', name: 'Olympiacos FC', league: 'Griega', dt: 'José Luis Mendilibar', reputation: 5, initialSalary: 5000, marketValue: 34000000, starPlayers: ['Christos Mouzakitis', 'Konstantinos Tzolakis', 'Santiago Hezze', 'Lorenzo Pirola', 'Jota Silva'], description: 'Clasificado a la Champions League 2025-26. El gigante del Pireo, dominador de la Super League griega.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'paok', name: 'PAOK Thessaloniki', league: 'Griega', dt: 'Alessio Lisci', reputation: 4, initialSalary: 2300, marketValue: 14000000, starPlayers: ['Giannis Konstantelias', 'Christos Zafeiris', 'Andrija Zivkovic', 'Mady Camara', 'Kiril Despodov'], description: 'Clasificado a la Europa League 2025-26. Referente del norte de Grecia.', badgeColor: 'border-l-4 border-slate-300 bg-black text-white', badgeLogoUrl: '⚫⚪', division: 1 },
  { id: 'panathinaikos', name: 'Panathinaikos FC', league: 'Griega', dt: 'Jacob Neestrup', reputation: 4, initialSalary: 2400, marketValue: 15000000, starPlayers: ['Victor Kristiansen', 'Anass Zaroury', 'Rick van Drongelen', 'Santino Andino', 'Pedro Chirivella'], description: 'Clasificado a la Europa League 2025-26. El trébol de Atenas.', badgeColor: 'border-l-4 border-green-500 bg-slate-900/40 text-green-100', badgeLogoUrl: '☘️💚', division: 1 },
  { id: 'slavia_praha', name: 'SK Slavia Praha', league: 'Checa', dt: 'Jindřich Trpišovský', reputation: 4, initialSalary: 2900, marketValue: 19000000, starPlayers: ['David Moses', 'Stepan Chaloupek', 'David Zima', 'Igoh Ogbu', 'Michal Sadílek'], description: 'Clasificado a la Champions League 2025-26. Campeón checo, con paso firme en Europa.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'viktoria_plzen', name: 'FC Viktoria Plzeň', league: 'Checa', dt: 'Martin Hyský', reputation: 3, initialSalary: 1300, marketValue: 7200000, starPlayers: ['Lukáš Červ', 'Sampson Dweh', 'Amar Memić', 'Karel Špaček', 'Cheick Souaré'], description: 'Clasificado a la Europa League 2025-26. Habitual de la fase de grupos europea.', badgeColor: 'border-l-4 border-blue-600 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪', division: 1 },
  { id: 'bodo_glimt', name: 'FK Bodø/Glimt', league: 'Noruega', dt: 'Kjetil Knutsen', reputation: 3, initialSalary: 1700, marketValue: 10000000, starPlayers: ['Jens Petter Hauge', 'Kasper Høgh', 'Fredrik Sjøvold', 'Patrick Berg', 'Håkon Evjen'], description: 'Clasificado a la Champions League 2025-26. La revelación noruega, fútbol vistoso desde el Ártico.', badgeColor: 'border-l-4 border-yellow-400 bg-black text-yellow-200', badgeLogoUrl: '💛⚫', division: 1 },
  { id: 'brann_sk', name: 'SK Brann', league: 'Noruega', dt: 'Eirik Horneland', reputation: 2, initialSalary: 780, marketValue: 3400000, starPlayers: ['Felix Horn Myhre', 'Denzel De Roeve', 'Sævar Atli Magnússon', 'Nana Kwame Boakye', 'Jacob Lungi Sørensen'], description: 'Clasificado a la Europa League 2025-26. Orgullo de Bergen.', badgeColor: 'border-l-4 border-red-500 bg-slate-900/40 text-red-100', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'fc_copenhagen', name: 'FC København', league: 'Danesa', dt: 'Bo Svensson', reputation: 3, initialSalary: 1600, marketValue: 9200000, starPlayers: ['Gabriel Pereira', 'Rodrigo Huescas', 'Dominik Kotarski', 'Youssoufa Moukoko', 'Marcos López'], description: 'Clasificado a la Champions League 2025-26. El más grande de Dinamarca.', badgeColor: 'border-l-4 border-red-500 bg-white text-slate-900', badgeLogoUrl: '⚪🔴', division: 1 },
  { id: 'midtjylland', name: 'FC Midtjylland', league: 'Danesa', dt: 'Mike Tullberg', reputation: 4, initialSalary: 2600, marketValue: 16500000, starPlayers: ['Franculino', 'Darío Osorio', 'Rasmus Nissen Kristensen', 'Ousmane Diao', 'Denil Castillo'], description: 'Clasificado a la Europa League 2025-26. Pionero del análisis de datos en el fútbol danés.', badgeColor: 'border-l-4 border-red-600 bg-black text-red-200', badgeLogoUrl: '🔴⚫', division: 1 },
  { id: 'galatasaray', name: 'Galatasaray SK', league: 'Turca', dt: 'Okan Buruk', reputation: 5, initialSalary: 6600, marketValue: 46000000, starPlayers: ['Victor Osimhen', 'Barış Alper Yılmaz', 'Gabriel Sara', 'Wilfried Singo', 'Lesley Ugochukwu'], description: 'Clasificado a la Champions League 2025-26. Cim Bom Bom, campeón de Turquía.', badgeColor: 'border-l-4 border-red-500 bg-yellow-500 text-red-900', badgeLogoUrl: '🟡🔴', division: 1 },
  { id: 'fenerbahce', name: 'Fenerbahçe SK', league: 'Turca', dt: 'İsmail Kartal', reputation: 5, initialSalary: 6800, marketValue: 48000000, starPlayers: ['Mason Greenwood', 'Mattéo Guendouzi', 'Kerem Aktürkoğlu', 'Dorgeles Nene', 'Jayden Oosterwolde'], description: 'Clasificado a la Europa League 2025-26. El gigante amarillo y azul marino de Estambul.', badgeColor: 'border-l-4 border-blue-800 bg-yellow-400 text-blue-950', badgeLogoUrl: '💛🔵', division: 1 },
  { id: 'qarabag', name: 'Qarabağ FK', league: 'Azerí', dt: 'Qurban Qurbanov', reputation: 2, initialSalary: 700, marketValue: 2800000, starPlayers: ['Mateusz Kochalski', 'Elvin Cafarquliyev', 'Martin Zlomislic', 'Pedro Bicalho', 'Kady Borges'], description: 'Clasificado a la Champions League 2025-26. Dominador absoluto del fútbol azerí.', badgeColor: 'border-l-4 border-blue-700 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪', division: 1 },
  { id: 'pafos_fc', name: 'Pafos FC', league: 'Chipriota', dt: 'Ricardo Sá Pinto', reputation: 2, initialSalary: 750, marketValue: 3200000, starPlayers: ['Biel', 'Radoslaw Majecki', 'Guga', 'Pêpê', 'Vlad Dragomir'], description: 'Clasificado a la Champions League 2025-26. Debut histórico del fútbol chipriota en la fase de liga.', badgeColor: 'border-l-4 border-sky-500 bg-slate-900/40 text-sky-100', badgeLogoUrl: '🔵⚪', division: 1 },
  { id: 'kairat_almaty', name: 'Kairat Almaty', league: 'Kazaja', dt: 'Rafael Urazbakhtin', reputation: 2, initialSalary: 550, marketValue: 1800000, starPlayers: ['Dastan Satpaev', 'Temirlan Anarbekov', 'Oiva Jukkola', 'Jaakko Oksanen', 'Luís Mata'], description: 'Clasificado a la Champions League 2025-26. Primer club kazajo en la fase de liga de la máxima competición europea.', badgeColor: 'border-l-4 border-yellow-400 bg-black text-yellow-200', badgeLogoUrl: '💛⚫', division: 1 },
  { id: 'rb_salzburg', name: 'FC Red Bull Salzburg', league: 'Austríaca', dt: 'Danny Röhl', reputation: 4, initialSalary: 2850, marketValue: 18500000, starPlayers: ['Karim Konaté', 'Edmund Baidoo', 'Soumaïla Diabaté', 'Maurits Kjærgaard', 'Adam Daghim'], description: 'Clasificado a la Europa League 2025-26. Cantera y proyección constante en Austria.', badgeColor: 'border-l-4 border-red-600 bg-white text-red-700', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'sturm_graz', name: 'SK Sturm Graz', league: 'Austríaca', dt: 'Fabio Ingolitsch', reputation: 3, initialSalary: 1350, marketValue: 7600000, starPlayers: ['Nelson Weiper', 'Otar Kiteishvili', 'Luca Weinhandl', 'Jacob Peter Hödl', 'Jeyland Mitchell'], description: 'Clasificado a la Europa League 2025-26. Campeón austríaco, el otro grande de Graz.', badgeColor: 'border-l-4 border-slate-300 bg-black text-white', badgeLogoUrl: '⚫⚪', division: 1 },
  { id: 'rangers_fc', name: 'Rangers FC', league: 'Escocesa', dt: 'Derek McInnes', reputation: 4, initialSalary: 2950, marketValue: 19500000, starPlayers: ['Emmanuel Fernandez', 'Youssef Chermiti', 'Nicolas Raskin', 'Ivor Pandur', 'Dan Neil'], description: 'Clasificado a la Europa League 2025-26. Histórico de Glasgow, azul real.', badgeColor: 'border-l-4 border-blue-700 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪', division: 1 },
  { id: 'celtic_fc', name: 'Celtic FC', league: 'Escocesa', dt: "Martin O'Neill", reputation: 4, initialSalary: 3000, marketValue: 20000000, starPlayers: ['Arne Engels', 'Reo Hatate', 'Cameron Carter-Vickers', 'Kieran Tierney', 'Alistair Johnston'], description: 'Clasificado a la Europa League 2025-26. Los Hoops verdiblancos de Glasgow.', badgeColor: 'border-l-4 border-green-600 bg-white text-green-800', badgeLogoUrl: '💚⚪', division: 1 },
  { id: 'young_boys', name: 'BSC Young Boys', league: 'Suiza', dt: 'Gerardo Seoane', reputation: 3, initialSalary: 1450, marketValue: 8200000, starPlayers: ['Alvyn Sanches', 'Jaouen Hadjam', 'Marvin Keller', 'Cédric Zesiger', 'Joël Monteiro'], description: 'Clasificado a la Europa League 2025-26. El más laureado de Suiza en la última década.', badgeColor: 'border-l-4 border-yellow-400 bg-black text-yellow-200', badgeLogoUrl: '💛⚫', division: 1 },
  { id: 'fc_basel', name: 'FC Basel 1893', league: 'Suiza', dt: 'Stephan Lichtsteiner', reputation: 3, initialSalary: 1250, marketValue: 6800000, starPlayers: ['Metinho', 'Flavius Daniliuc', 'Philip Otele', 'Kazeem Olaigbe', 'Andrej Bacanin'], description: 'Clasificado a la Europa League 2025-26. Histórico suizo, cuna de la Selección desde su cantera.', badgeColor: 'border-l-4 border-red-600 bg-blue-950 text-red-200', badgeLogoUrl: '🔴🔵', division: 1 },
  { id: 'ferencvaros', name: 'Ferencvárosi TC', league: 'Húngara', dt: 'Balázs Borbély', reputation: 3, initialSalary: 1050, marketValue: 5200000, starPlayers: ['Gabi Kanichowsky', 'Kristoffer Zachariassen', 'Toon Raemaekers', 'Bamidele Yusuf', 'Aleksandar Cirkovic'], description: 'Clasificado a la Europa League 2025-26. El gigante de Budapest.', badgeColor: 'border-l-4 border-green-600 bg-white text-green-800', badgeLogoUrl: '💚⚪', division: 1 },
  { id: 'red_star_belgrade', name: 'FK Crvena Zvezda', league: 'Serbia', dt: 'Dejan Stanković', reputation: 4, initialSalary: 2800, marketValue: 18000000, starPlayers: ['Vasilije Kostov', 'Adem Avdic', 'Strahinja Erakovic', 'Nair Tiknizyan', 'Tomás Händel'], description: 'Clasificado a la Europa League 2025-26. La Estrella Roja de Belgrado.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪', division: 1 },
  { id: 'dinamo_zagreb', name: 'GNK Dinamo Zagreb', league: 'Croata', dt: 'Mario Kovačević', reputation: 3, initialSalary: 1500, marketValue: 8600000, starPlayers: ['Dion Beljo', 'Sergi Domínguez', 'Luka Stojkovic', 'Scott McKenna', 'Niko Galesic'], description: 'Clasificado a la Europa League 2025-26. Dominador habitual del fútbol croata.', badgeColor: 'border-l-4 border-blue-600 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪', division: 1 },
  { id: 'ludogorets', name: 'PFC Ludogorets 1945', league: 'Búlgara', dt: 'Thomas Reis', reputation: 3, initialSalary: 1150, marketValue: 6000000, starPlayers: ['Nathan Fernandes', 'Petar Stanic', 'Erick Marcus', 'Caio Vidal', 'Rwan Cruz'], description: 'Clasificado a la Europa League 2025-26. Amo absoluto de la liga búlgara.', badgeColor: 'border-l-4 border-orange-500 bg-black text-orange-200', badgeLogoUrl: '🟠⚫', division: 1 },
  { id: 'malmo_ff', name: 'Malmö FF', league: 'Sueca', dt: 'Gaute Helstrup', reputation: 2, initialSalary: 820, marketValue: 3800000, starPlayers: ['Erik Botheim', 'Busanello', 'Bleon Kurtulus', 'Otto Rosengren', 'Sead Haksabanovic'], description: 'Clasificado a la Europa League 2025-26. El más grande de Suecia.', badgeColor: 'border-l-4 border-sky-500 bg-white text-sky-700', badgeLogoUrl: '🔵⚪', division: 1 },
  { id: 'fcsb', name: 'FCSB', league: 'Rumana', dt: 'Marius Baciu', reputation: 2, initialSalary: 720, marketValue: 3000000, starPlayers: ['Daniel Bîrligea', 'David Miculescu', 'Siyabonga Ngezana', 'Florin Tănase', 'Joyskim Dawa'], description: 'Clasificado a la Europa League 2025-26. El histórico club de Bucarest.', badgeColor: 'border-l-4 border-red-600 bg-blue-950 text-red-200', badgeLogoUrl: '🔴🔵', division: 1 },
  { id: 'maccabi_tel_aviv', name: 'Maccabi Tel Aviv FC', league: 'Israelí', dt: 'Kenny Miller', reputation: 2, initialSalary: 850, marketValue: 4000000, starPlayers: ['Roy Revivo', 'Kristijan Belic', 'Tyrese Asante', 'Hélio Varela', 'Sayed Abu Farkhi'], description: 'Clasificado a la Europa League 2025-26. El más laureado de Israel en Europa.', badgeColor: 'border-l-4 border-yellow-400 bg-blue-900 text-yellow-200', badgeLogoUrl: '💛🔵', division: 1 },
];
// FASE 3 -- economía más dura: costos ~18-20% más altos que la versión original, y patrocinios
// "casi infinitos" con categoría (patrocinios de la misma categoría entran en conflicto -- ver
// handleBuyItem en App.tsx, que bloquea comprar dos del mismo rubro a la vez).
// Además del conflicto por categoría, hay un tope GLOBAL de patrocinios activos a la vez (ver
// MAX_ACTIVE_SPONSORSHIPS) para que no se puedan acumular todas las categorías simultáneamente
// aunque haya muchas marcas distintas para elegir.
export const MAX_ACTIVE_SPONSORSHIPS = 6;

export const INITIAL_LIFESTYLE_ITEMS: ShopItem[] = [
  {
    id: 'physical_coach',
    name: 'Entrenador Físico Personal',
    cost: 18000,
    description: 'Rutinas exclusivas a domicilio para prevenir la fatiga crónica y potenciar tus músculos.',
    perkText: '+1 Físico permanente y recuperas +8 Energía extra por partido avanzado.',
    effect: { attribute: 'fisico', value: 2, permanentEnergyBonus: 5, fatigueReduction: 5 },
    purchased: false,
    icon: 'dumbbells',
    image: physicalCoachImg
  },
  {
    id: 'sports_agent',
    name: 'Agente de Elite FIFA',
    cost: 54000,
    description: 'Un manager que redacta contratos brutales y te consigue un 20% más de salario en ofertas futuras.',
    perkText: '+15 Prestigio garantizado, habilita ofertas de gigantes continentales.',
    effect: { prestigeBonus: 15, fatigueReduction: 0 },
    purchased: false,
    icon: 'briefcase',
    image: sportsAgentImg
  },
  {
    id: 'sports_car',
    name: 'Superdeportivo Ital-Giallo',
    cost: 95000,
    description: 'Con motor V8 que ruge en los entrenamientos. El foco de las cámaras estará en tu coche.',
    perkText: '+25 Afición/Fans instantáneos, +12 Prestigio.',
    effect: { fansBonus: 25, prestigeBonus: 12, attribute: 'ritmo', value: 1 },
    purchased: false,
    icon: 'car',
    image: sportsCarImg
  },
  {
    id: 'nutritionist',
    name: 'Nutricionista de Estrellas',
    cost: 24000,
    description: 'Dieta hipercalórica regulada que limpia tu resistencia y afina tu potencia.',
    perkText: '+3 Ritmo y +2 Físico permanentes para volar sobre la banda.',
    effect: { attribute: 'ritmo', value: 3 },
    purchased: false,
    icon: 'apple',
    image: nutritionistImg
  },
  {
    id: 'luxury_mansion',
    name: 'Mansión en los Cerros',
    cost: 215000,
    description: 'Casa gigante con piscina olímpica, cine privado e hidratación premium para un descanso estelar.',
    perkText: '+25 Prestigio, +20 Energía por partido avanzado.',
    effect: { prestigeBonus: 25, permanentEnergyBonus: 15 },
    purchased: false,
    icon: 'home',
    image: luxuryMansionImg
  },
  {
    id: 'marketing_pr',
    name: 'Socio de Agencia de Marketing',
    cost: 30000,
    description: 'Una campaña de relaciones públicas masiva para limpiar tu nombre en redes.',
    perkText: '+30 de Afición/Fans y +10 de Prestigio en el club.',
    effect: { fansBonus: 30, prestigeBonus: 10 },
    purchased: false,
    icon: 'megaphone',
    image: marketingPrImg
  },
  {
    id: 'gaming_sponsorship',
    name: 'Patrocinio Oficial de Videojuegos',
    cost: 130000,
    description: 'Tu propio personaje jugable y firma comercial internacional. Recibes un dividendo semanal de regalías.',
    perkText: '+45 Fans, ganas de forma pasiva $2,500 cada vez que avanzas la semana.',
    effect: { fansBonus: 45, passiveIncome: 2500 },
    category: 'tecnologia',
    purchased: false,
    icon: 'gamepad'
  },
  {
    id: 'streaming_deal',
    name: 'Contrato de Streaming Exclusivo',
    cost: 95000,
    description: 'Transmitís tus entrenamientos y momentos de vestuario en vivo para una plataforma internacional.',
    perkText: '+20 Fans, ganas de forma pasiva $1,800 cada vez que avanzas la semana.',
    effect: { fansBonus: 20, passiveIncome: 1800 },
    category: 'tecnologia',
    purchased: false,
    icon: 'video'
  },
  {
    id: 'sports_drink',
    name: 'Patrocinio de Bebida Isotónica',
    cost: 40000,
    description: 'Tu cara en cada botella de la marca oficial de hidratación de la liga.',
    perkText: '+8 Prestigio, +10 Fans.',
    effect: { prestigeBonus: 8, fansBonus: 10 },
    category: 'bebidas',
    purchased: false,
    icon: 'droplet'
  },
  {
    id: 'fashion_line',
    name: 'Línea de Ropa Urbana Propia',
    cost: 70000,
    description: 'Lanzás tu propia colección de streetwear con una marca reconocida de la industria.',
    perkText: '+35 Fans, +5 Prestigio.',
    effect: { fansBonus: 35, prestigeBonus: 5 },
    category: 'moda',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'shirt'
  },
  {
    id: 'watch_brand',
    name: 'Embajador de Relojería Suiza',
    cost: 150000,
    description: 'Una casa relojera centenaria te suma a su lista reducida de embajadores globales.',
    perkText: '+30 Prestigio.',
    effect: { prestigeBonus: 30 },
    category: 'lujo',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'watch'
  },
  {
    id: 'crypto_sponsor',
    name: 'Patrocinio Cripto Arriesgado',
    cost: 60000,
    description: 'Una plataforma de criptomonedas te ofrece un contrato jugoso a cambio de promocionarla en tus redes.',
    perkText: '+15 Fans, ganas de forma pasiva $3,000 cada vez que avanzas la semana, pero -5 Prestigio (la prensa especializada desconfía).',
    effect: { fansBonus: 15, prestigeBonus: -5, passiveIncome: 3000 },
    category: 'tecnologia',
    purchased: false,
    icon: 'coins'
  },
  {
    id: 'airline_deal',
    name: 'Milla Viajera Oficial',
    cost: 85000,
    description: 'Vuelos y estadías premium para vos y tu familia, cortesía de la aerolínea oficial del torneo.',
    perkText: '+10 Prestigio, +10 Energía por partido avanzado.',
    effect: { prestigeBonus: 10, permanentEnergyBonus: 10 },
    category: 'viajes',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'plane'
  },
  {
    id: 'telecom_deal',
    name: 'Rostro de la Telefónica Nacional',
    cost: 65000,
    description: 'Tu cara en las vallas publicitarias y en la app de la compañía de telefonía más grande del país.',
    perkText: '+20 Fans, +8 Prestigio.',
    effect: { fansBonus: 20, prestigeBonus: 8 },
    category: 'telecomunicaciones',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'phone'
  },
  {
    id: 'fastfood_deal',
    name: 'Embajador de Cadena de Comida Rápida',
    cost: 45000,
    description: 'Tu combo personalizado llega a todos los locales del país por tiempo limitado.',
    perkText: '+25 Fans, ganas de forma pasiva $1,200 cada vez que avanzas la semana.',
    effect: { fansBonus: 25, passiveIncome: 1200 },
    category: 'comida_rapida',
    purchased: false,
    icon: 'utensils'
  },
  {
    id: 'bank_deal',
    name: 'Imagen del Banco Patrocinador Oficial',
    cost: 110000,
    description: 'Tu tarjeta de crédito edición limitada con tu nombre grabado en el frente.',
    perkText: '+20 Prestigio, ganas de forma pasiva $2,000 cada vez que avanzas la semana.',
    effect: { prestigeBonus: 20, passiveIncome: 2000 },
    category: 'banca',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'landmark'
  },
  {
    id: 'betting_deal',
    name: 'Cara de la Casa de Apuestas Deportivas',
    cost: 90000,
    description: 'Contrato jugoso para promocionar la casa de apuestas oficial del torneo, aunque no a todos les cae bien.',
    perkText: '+30 Fans, ganas de forma pasiva $2,800 cada vez que avanzas la semana, pero -8 Prestigio (la prensa cuestiona el vínculo).',
    effect: { fansBonus: 30, prestigeBonus: -8, passiveIncome: 2800 },
    category: 'apuestas',
    purchased: false,
    icon: 'dice'
  },
  {
    id: 'sneaker_deal',
    name: 'Firma con Marca de Calzado Deportivo',
    cost: 100000,
    description: 'Botines con tu inicial bordada y una línea de zapatillas urbanas con tu nombre.',
    perkText: '+15 Prestigio, +20 Fans.',
    effect: { prestigeBonus: 15, fansBonus: 20 },
    category: 'calzado',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'footprints'
  },
  {
    id: 'energy_drink_deal',
    name: 'Patrocinio de Bebida Energética Extrema',
    cost: 55000,
    description: 'Tu lata personalizada en cada kiosco del país, con una campaña agresiva en redes.',
    perkText: '+18 Fans, ganas de forma pasiva $1,600 cada vez que avanzas la semana.',
    effect: { fansBonus: 18, passiveIncome: 1600 },
    category: 'energizante',
    purchased: false,
    icon: 'zap'
  }
];

export const PRESS_QUESTIONS_POOL: PressQuestion[] = [
  {
    id: "q1",
    context: "Post-Partido de Primera División",
    mediaName: "mausportstv (Live TikTok/Instagram)",
    reporter: "Mau",
    reporterAvatar: "🎙️⚽",
    reporterAvatarImg: mauSportsAvatar,
    mediaColor: "border-purple-500 text-purple-400 bg-purple-950/20",
    question: "¡Estamos en vivo con la sensación del torneo! Has tenido un despliegue táctico brutal hoy en la cancha. ¿Sientes que estás listo para dar el salto definitivo a Europa en el próximo mercado de fichajes de verano?",
    options: [
      {
        text: "Mi cabeza está 100% enfocada en este club, el resto lo maneja mi representante.",
        prestigeChange: 4,
        fansChange: 5,
        energyChange: -2,
        reaction: "Mau (@mausportstv): 'Declaración madura del juvenil. Mantiene los pies sobre la tierra.'"
      },
      {
        text: "Totalmente. El fútbol sudamericano ya me queda chico, aspiro a ganar la Champions League pronto.",
        prestigeChange: 8,
        fansChange: -10,
        energyChange: 0,
        reaction: "Mau (@mausportstv): '¡Boom! El jugador exige su salida inmediata a Europa.'"
      }
    ]
  },
  {
    id: "q2",
    context: "Exclusiva de Fichajes de Última Hora",
    mediaName: "Here We Go! - Digital Network",
    reporter: "Fabrizio Romano",
    reporterAvatar: "📱🔥",
    mediaColor: "border-sky-500 text-sky-400 bg-sky-950/20",
    question: "Understand: Hay reportes de que te saltaste el último entrenamiento exigente por fatiga, pero se te vio en una fiesta por redes sociales. ¿Qué hay de cierto en esto?",
    options: [
      {
        text: "Fue un malentendido, estaba con mi familia y mi compromiso con el equipo es total.",
        prestigeChange: -2,
        fansChange: 2,
        energyChange: -5,
        reaction: "Fabrizio Romano: 'El entorno del crack aclara la situación. Directiva acepta disculpas.'"
      },
      {
        text: "Soy un profesional y lo que haga en mi tiempo libre no afecta mi rendimiento.",
        prestigeChange: -6,
        fansChange: -5,
        energyChange: 5,
        reaction: "Fabrizio Romano: 'Tensión absoluta. La relación con el cuerpo técnico está rota. Here we go?'"
      }
    ]
  },
  {
    id: "q3",
    context: "Conferencia de Prensa",
    mediaName: "ESPN Continental",
    reporter: "Manejo de Panel",
    reporterAvatar: "📺🔴",
    mediaColor: "border-red-600 text-red-400 bg-red-950/20",
    question: "El mánager del equipo rival declaró que tu rendimiento en los últimos minutos se cae por falta de preparación física. ¿Qué le respondes?",
    options: [
      {
        text: "Las respuestas se dan trabajando en la semana y jugando los 90 minutos el fin de semana.",
        prestigeChange: 5,
        fansChange: 6,
        energyChange: -4,
        reaction: "ESPN: '¡Jerarquía pura! El juvenil contesta con altura a la mesa de debate.'"
      },
      {
        text: "Debería preocuparse por su propio equipo, que viene peleando el descenso en la tabla.",
        prestigeChange: 2,
        fansChange: 10,
        energyChange: -2,
        reaction: "ESPN: '¡Se calentó el clásico con picantes declaraciones!'"
      }
    ]
  },
  {
    id: "press_2",
    context: "Crítica de Prensa Local",
    mediaName: "El Chiringuito Local",
    reporter: "Reportero de Guardia",
    reporterAvatar: "🎤⚠️",
    mediaColor: "border-amber-600 text-amber-400 bg-amber-950/20",
    question: "Se te vio un poco falto de ritmo y cansado en el último tramo del partido. ¿Estás descuidando tu rendimiento o es un tema de vida nocturna?",
    options: [
      {
        text: "He tenido una carga física pesada, pero sigo trabajando al 100% con los preparadores.",
        prestigeChange: 3,
        fansChange: 2,
        energyChange: -2,
        reaction: "Prensa Local: 'El jugador reconoce el cansancio y promete ponerse a punto en la semana.'"
      },
      {
        text: "Es una falta de respeto que inventen rumores sobre mi vida privada para vender periódicos.",
        prestigeChange: -3,
        fansChange: 8,
        energyChange: 0,
        reaction: "Prensa Local: 'Estalla el vestuario. El juvenil arremete con furia contra las críticas de los medios.'"
      }
    ]
  },
  {
    id: "press_3",
    context: "Pregunta previa al clásico",
    mediaName: "El Clásico Digital",
    reporter: "Panelista Senior",
    reporterAvatar: "🎙️🔥",
    mediaColor: "border-orange-500 text-orange-400 bg-orange-950/20",
    question: "¿Qué opina del planteamiento defensivo del rival de este fin de semana? ¿Son cobardes?",
    options: [
      {
        text: "Respetamos su estilo, pero nuestro plantel tiene la jerarquía necesaria para descifrar su arco.",
        prestigeChange: 10,
        fansChange: 5,
        energyChange: 0,
        reaction: "Declaración equilibrada que proyecta liderazgo maduro."
      },
      {
        text: "Si ponen el autobús atrás, los vamos a pasar por encima igual. Es una final y salimos a ganar.",
        prestigeChange: -5,
        fansChange: 25,
        energyChange: -5,
        reaction: "Locura total en redes. La hinchada ama la picardía, pero el DT te pide bajar el tono."
      },
      {
        text: "Nosotros nos enfocamos en lo nuestro. No gastamos saliva hablando del planteamiento ajeno.",
        prestigeChange: 8,
        fansChange: 0,
        energyChange: 0,
        reaction: "Respuesta gris de casete. Los periodistas se aburren rápido."
      }
    ]
  },
  // NUEVAS PREGUNTAS DE PRENSA
  {
    id: "press_4",
    context: "Rumores de Vestuario",
    mediaName: "Diario Olé / Marca",
    reporter: "Corresponsal Infiltrado",
    reporterAvatar: "📸🤫",
    mediaColor: "border-red-500 text-red-300 bg-red-950/20",
    question: "Fuentes internas nos dicen que tuviste un fuerte cruce de palabras con el capitán del equipo tras el último entrenamiento. ¿Hay división en el grupo?",
    options: [
      {
        text: "Son calenturas normales del fútbol. Lo que pasa en la cancha, se queda en la cancha.",
        prestigeChange: 5,
        fansChange: 0,
        energyChange: -2,
        reaction: "Diario: 'El jugador le baja el perfil a la pelea y demuestra madurez grupal.'"
      },
      {
        text: "Algunos no están corriendo lo suficiente y yo vengo aquí a ganar títulos, no a hacer amigos.",
        prestigeChange: -10,
        fansChange: 15,
        energyChange: -5,
        reaction: "Diario: '¡INCENDIO EN EL VESTUARIO! El crack fulmina al capitán públicamente.'"
      }
    ]
  },
  {
    id: "press_5",
    context: "Llamado Internacional",
    mediaName: "Win Sports / TyC",
    reporter: "Periodista Táctico",
    reporterAvatar: "📺🌐",
    mediaColor: "border-blue-500 text-blue-300 bg-blue-950/20",
    question: "Tu nivel está siendo superlativo. ¿Crees que el entrenador de la Selección Nacional está siendo injusto al no convocarte todavía?",
    options: [
      {
        text: "Yo trabajo para mi club, si llega el llamado será un orgullo, pero no presiono a nadie.",
        prestigeChange: 8,
        fansChange: 5,
        energyChange: 0,
        reaction: "TV: 'Mensaje humilde. El jugador respeta los tiempos del seleccionador nacional.'"
      },
      {
        text: "Los números hablan por sí solos. No sé qué más tengo que hacer para que me volteen a ver.",
        prestigeChange: -2,
        fansChange: 20,
        energyChange: -2,
        reaction: "TV: 'El jugador levanta la voz y exige su lugar en la selección. ¡Polémica nacional!'"
      }
    ]
  },
  // FASE 3 -- PRENSA MÁS PROFUNDA: más ramas de polémica, traspasos y bajo rendimiento ajeno
  {
    id: "press_6",
    context: "Filtración de Mercado",
    mediaName: "Radio Caracol Deportes",
    reporter: "Corresponsal de Pases",
    reporterAvatar: "📻💰",
    mediaColor: "border-yellow-500 text-yellow-300 bg-yellow-950/20",
    question: "Se filtró un audio de tu representante negociando con un club rival de tu propia liga a tus espaldas. ¿Qué tienes para decir?",
    options: [
      {
        text: "Mi representante escucha ofertas, es su trabajo. Yo sigo comprometido con este club hasta que decida lo contrario.",
        prestigeChange: 3,
        fansChange: -8,
        energyChange: -3,
        reaction: "Radio Caracol: 'Respuesta diplomática, pero la hinchada quedó con la duda sembrada.'"
      },
      {
        text: "Eso no tiene ni pies ni cabeza. Voy a hablar con mi agente para que aclare el tema hoy mismo.",
        prestigeChange: 6,
        fansChange: 10,
        energyChange: -2,
        reaction: "Radio Caracol: 'El jugador desmiente con firmeza. La hinchada respira, por ahora.'"
      }
    ]
  },
  {
    id: "press_7",
    context: "Pregunta Trampa Post-Derrota",
    mediaName: "Deportes RCN",
    reporter: "Cronista de Vestuario",
    reporterAvatar: "🎥😬",
    mediaColor: "border-rose-500 text-rose-300 bg-rose-950/20",
    question: "El arquero del equipo tuvo una actuación desastrosa hoy y varios errores no forzados. ¿Le tienes confianza de cara al resto del semestre?",
    options: [
      {
        text: "Un arquero también tiene partidos malos, como cualquiera de nosotros. Vamos a levantarlo entre todos.",
        prestigeChange: 12,
        fansChange: 4,
        energyChange: 0,
        reaction: "RCN: 'Gesto de liderazgo y compañerismo que el vestuario agradece puertas adentro.'"
      },
      {
        text: "No me corresponde evaluar a mis compañeros, esa pregunta es para el cuerpo técnico.",
        prestigeChange: 2,
        fansChange: -2,
        energyChange: 0,
        reaction: "RCN: 'Respuesta esquiva. Los hinchas la leyeron como una falta de respaldo al arquero.'"
      },
      {
        text: "La verdad, viene fallando hace varias fechas y el equipo lo está sufriendo en los resultados.",
        prestigeChange: -12,
        fansChange: -6,
        energyChange: -3,
        reaction: "RCN: '¡BOMBAZO! El jugador expone públicamente a un compañero. Crisis interna en el plantel.'"
      }
    ]
  },
  {
    id: "press_8",
    context: "Editorial de Fin de Año",
    mediaName: "El Espectador Deportivo",
    reporter: "Editorialista Senior",
    reporterAvatar: "🗞️🏆",
    mediaColor: "border-emerald-500 text-emerald-300 bg-emerald-950/20",
    question: "En el balance anual del medio te consideran 'sobrevalorado' comparado con otras figuras jóvenes de la liga. ¿Cómo te cae esa etiqueta?",
    options: [
      {
        text: "Respeto todas las opiniones, pero el campo es el único lugar donde de verdad se demuestra algo.",
        prestigeChange: 9,
        fansChange: 6,
        energyChange: -2,
        reaction: "El Espectador: 'Madurez absoluta para responder a una crítica dura sin perder la calma.'"
      },
      {
        text: "Ese medio nunca me ha dado crédito por nada, ya perdí la cuenta de sus columnas injustas.",
        prestigeChange: -4,
        fansChange: 12,
        energyChange: -4,
        reaction: "El Espectador: 'El jugador se enfrenta abiertamente a la prensa especializada. Polémica servida.'"
      }
    ]
  }
];

export const LOBBY_RANDOM_EVENTS = [
  {
    title: 'Noche de Fiesta Festiva',
    description: 'Tus compañeros de vestuario te invitan a un club exclusivo a celebrar un cumpleaños el jueves en la noche. ¿Qué decides?',
    choices: [
      {
        text: 'Ir de fiesta y pagar la ronda ($3,000 COP/USD)',
        cost: 3000,
        outcome: 'Ganas reputación con el grupo, pero el mister se entona al verte un poco fatigado.',
        effects: { prestige: 20, fans: -5, energy: -30, capital: -3000 }
      },
      {
        text: 'Dormir temprano y enfocarte en el partido',
        cost: 0,
        outcome: 'El técnico te alaba por tu profesionalismo absoluto.',
        effects: { prestige: 5, fans: 5, energy: 20, capital: 0 }
      }
    ]
  },
  {
    title: 'El Fan del Hospital',
    description: 'Una fundación te contacta para visitar a un infante hospitalizado fanático de tu club. Coincide con tu día de descanso semanal.',
    choices: [
      {
        text: 'Visitar al niño y regalarle tu camiseta firmada ($1,000 COP/USD)',
        cost: 1000,
        outcome: 'La historia se viraliza. Tu popularidad estalla en la comunidad.',
        effects: { prestige: 10, fans: 30, energy: -15, capital: -1000 }
      },
      {
        text: 'Enviar un video de saludo amigable desde tu casa',
        cost: 0,
        outcome: 'Cumples de forma cordial sin cansarte físicamente.',
        effects: { prestige: 5, fans: 10, energy: 5, capital: 0 }
      }
    ]
  },
  {
    title: 'Contrato de Botines',
    description: 'Una marca de calzado deportivo te ofrece patrocinio express pero te exige subir fotos semanales exageradas en redes.',
    choices: [
      {
        text: 'Aceptar el contrato (+ $8,000 Capital)',
        cost: -8000,
        outcome: 'Incrementa tu capital pero tus compañeros se burlan de tus poses exageradas en redes.',
        effects: { prestige: -10, fans: 15, energy: -5, capital: 8000 }
      },
      {
        text: 'Rechazar la oferta y esperar algo de mayor categoría',
        cost: 0,
        outcome: 'El vestuario valora que pienses puramente en fútbol.',
        effects: { prestige: 10, fans: -5, energy: 0, capital: 0 }
      }
    ]
  },
  // NUEVOS EVENTOS ALEATORIOS PARA MÁS VARIEDAD
  {
    title: 'Tensión en el Entrenamiento',
    description: 'El central veterano del equipo te dio una patada muy fuerte por detrás durante la práctica a puerta cerrada. Todos te miran.',
    choices: [
      {
        text: 'Levantarte y encararlo frente a todos',
        cost: 0,
        outcome: 'Se armó una bronca tremenda. La afición valora tu sangre, pero el DT te castiga restándote prestigio.',
        effects: { prestige: -15, fans: 20, energy: -10, capital: 0 }
      },
      {
        text: 'Darle la mano y responderle jugando mejor',
        cost: 0,
        outcome: 'Mantienes la calma. El cuerpo técnico valora tu increíble frialdad y liderazgo.',
        effects: { prestige: 15, fans: 0, energy: -5, capital: 0 }
      }
    ]
  },
  {
    title: 'Patrocinio Dudoso',
    description: 'Una nueva marca de bebidas energéticas quiere que seas su imagen. Pagan bien, pero la bebida tiene mucha azúcar y te hace sentir pesado.',
    choices: [
      {
        text: 'Firmar y tomarla en cámara (+ $12,000 Capital)',
        cost: -12000,
        outcome: 'El dinero entra a tu cuenta, pero tu nutricionista está furioso. Pierdes mucha estamina esta semana.',
        effects: { prestige: -5, fans: 5, energy: -35, capital: 12000 }
      },
      {
        text: 'Rechazar por el bien de tu dieta deportiva',
        cost: 0,
        outcome: 'No ganas dinero, pero mantienes tu cuerpo como un templo para el fin de semana.',
        effects: { prestige: 5, fans: -2, energy: 10, capital: 0 }
      }
    ]
  },
  {
    title: 'Locura en el Restaurante',
    description: 'Estás cenando tranquilamente con tu familia y de repente una multitud de hinchas te rodea pidiendo fotos y videos.',
    choices: [
      {
        text: 'Quedarte 1 hora atendiendo a todos los fans',
        cost: 0,
        outcome: 'Te conviertes en el ídolo del pueblo, pero llegas a casa agotado física y mentalmente.',
        effects: { prestige: 5, fans: 40, energy: -25, capital: 0 }
      },
      {
        text: 'Pedir disculpas e irte por la puerta trasera',
        cost: 0,
        outcome: 'Pudiste descansar y dormir tus 8 horas, pero algunos fans te tildan de agrandado en Twitter.',
        effects: { prestige: -5, fans: -15, energy: 15, capital: 0 }
      }
    ]
  },
  // FASE 3 -- VICIOS CON CONSECUENCIAS
  {
    title: 'La Previa Prohibida',
    description: 'Un compañero saca un par de cigarrillos en el balcón del hotel de concentración, a dos días del partido más importante del semestre. "Uno no hace nada", te dice.',
    choices: [
      {
        text: 'Aceptar uno para relajar los nervios',
        cost: 0,
        outcome: 'Te ve el utillero y el rumor llega al cuerpo técnico. Te bajan puntos de confianza física.',
        effects: { prestige: -8, fans: 0, energy: -20, capital: 0 }
      },
      {
        text: 'Rechazar y salir a caminar para despejarte',
        cost: 0,
        outcome: 'El preparador físico te felicita por tu disciplina delante del plantel.',
        effects: { prestige: 8, fans: 0, energy: 10, capital: 0 }
      }
    ]
  },
  {
    title: 'Barra Libre en el Cumpleaños del Capitán',
    description: 'El capitán del equipo cumple años y organiza una fiesta con barra libre a mitad de semana. Todo el plantel titular está invitado.',
    choices: [
      {
        text: 'Ir y tomar hasta tarde para no quedar mal con el grupo ($2,500 COP/USD)',
        cost: 2500,
        outcome: 'Te ganas la simpatía del vestuario, pero llegas al entrenamiento del día siguiente hecho pedazos.',
        effects: { prestige: 12, fans: -3, energy: -40, capital: -2500 }
      },
      {
        text: 'Pasar a saludar, tomar una copa y retirarte temprano',
        cost: 500,
        outcome: 'Cumples socialmente sin comprometer tu rendimiento de la semana.',
        effects: { prestige: 4, fans: 2, energy: -10, capital: -500 }
      }
    ]
  },
  {
    title: 'Apuestas en la Concentración',
    description: 'En el micro rumbo al hotel, un grupo de compañeros arma una timba de cartas con plata de por medio para matar el aburrimiento del viaje.',
    choices: [
      {
        text: 'Sumarte a la partida ($4,000 COP/USD en juego)',
        cost: 4000,
        outcome: 'Perdiste casi todo lo que pusiste sobre la mesa. El grupo se ríe, pero tu billetera llora.',
        effects: { prestige: 6, fans: 0, energy: -5, capital: -3600 }
      },
      {
        text: 'Quedarte con los audífonos puestos viendo videos tácticos',
        cost: 0,
        outcome: 'Llegas descansado y con la cabeza fría al hotel de concentración.',
        effects: { prestige: 3, fans: 0, energy: 5, capital: 0 }
      }
    ]
  },
  // FASE 3 -- VESTUARIO Y HINCHADA
  {
    title: 'Reclamo del DT por Individualismo',
    description: 'En la charla técnica post-entrenamiento, el DT te para en seco frente a todo el plantel: "Acá se juega para el equipo, no para las estadísticas personales."',
    choices: [
      {
        text: 'Responder que vos jugás para ganar, no para quedar bien con nadie',
        cost: 0,
        outcome: 'El vestuario se divide: unos te bancan, otros creen que te faltó el respeto al técnico.',
        effects: { prestige: -12, fans: 8, energy: -5, capital: 0 }
      },
      {
        text: 'Asentir y comprometerte a jugar más colectivo de acá en adelante',
        cost: 0,
        outcome: 'El DT valora el gesto. Tu relación con el cuerpo técnico mejora notablemente.',
        effects: { prestige: 10, fans: -2, energy: 0, capital: 0 }
      }
    ]
  },
  {
    title: 'La Hinchada Pide Explicaciones',
    description: 'Tras una racha floja de resultados, un grupo de la barra brava se planta en la puerta del predio de entrenamiento pidiendo hablar con los jugadores.',
    choices: [
      {
        text: 'Salir a dar la cara y escuchar sus reclamos',
        cost: 0,
        outcome: 'La hinchada valora que no te escondas. Baja la tensión en las tribunas para el próximo partido.',
        effects: { prestige: 5, fans: 18, energy: -15, capital: 0 }
      },
      {
        text: 'Salir por la puerta trasera junto a la delegación',
        cost: 0,
        outcome: 'Evitas el conflicto directo, pero las redes se llenan de críticas por "cobarde".',
        effects: { prestige: 0, fans: -20, energy: 5, capital: 0 }
      }
    ]
  },
  // FASE 3 -- MÁS INDISCIPLINA: sanciones, multas y un caso severo tipo FIFA (dopaje)
  {
    title: 'Sustancia Prohibida',
    description: 'Un preparador físico paralelo, ajeno al club, te ofrece un suplemento "milagroso" para rendir más este fin de semana. No figura en la lista de sustancias permitidas por la federación.',
    choices: [
      {
        text: 'Tomarlo, necesitás ese plus de rendimiento',
        cost: 0,
        outcome: 'Salió positivo en el control antidopaje post-partido. La federación no tiene piedad: sanción ejemplar y multa.',
        effects: { prestige: -35, fans: -20, energy: 10, capital: -25000, suspension: 4 }
      },
      {
        text: 'Rechazarlo, no vale la pena el riesgo',
        cost: 0,
        outcome: 'Tu preparador físico oficial te felicita por la decisión responsable.',
        effects: { prestige: 6, fans: 0, energy: 0, capital: 0 }
      }
    ]
  },
  {
    title: 'Salida Nocturna Fuera de Horario',
    description: 'Se te hace tarde en una fiesta privada y el toque de queda de la concentración ya pasó hace dos horas.',
    choices: [
      {
        text: 'Quedarte igual, ya estás ahí ($1,500 COP/USD)',
        cost: 1500,
        outcome: 'Un fotógrafo te reconoce saliendo de madrugada. Las redes explotan y el cuerpo técnico se entera.',
        effects: { prestige: -15, fans: 8, energy: -30, capital: -1500 }
      },
      {
        text: 'Salir corriendo antes de que noten tu ausencia',
        cost: 0,
        outcome: 'Llegás justo antes del pase de lista. Nadie se entera.',
        effects: { prestige: 3, fans: 0, energy: -10, capital: 0 }
      }
    ]
  },
  {
    title: 'Provocación en Redes Sociales',
    description: 'La figura del equipo rival te tira una indirecta pesada en redes después de la última goleada en contra.',
    choices: [
      {
        text: 'Responderle con la misma agresividad',
        cost: 0,
        outcome: 'Se armó un ida y vuelta viral. La prensa lo cataloga de "guerra sucia" entre estrellas.',
        effects: { prestige: -10, fans: 15, energy: -5, capital: 0 }
      },
      {
        text: 'Ignorarlo y dejar que hablen los resultados',
        cost: 0,
        outcome: 'Tu silencio es elogiado como muestra de clase por la prensa especializada.',
        effects: { prestige: 8, fans: 2, energy: 0, capital: 0 }
      }
    ]
  },
  {
    title: 'Encontronazo con un Hincha Rival',
    description: 'Saliendo del estadio, un hincha del equipo rival te grita cosas fuertes a centímetros de la cara y te empuja el pecho.',
    choices: [
      {
        text: 'Responderle el empujón',
        cost: 0,
        outcome: 'El video se viraliza. La federación te abre un expediente disciplinario por conducta antideportiva.',
        effects: { prestige: -20, fans: 10, energy: -10, capital: -5000, suspension: 1 }
      },
      {
        text: 'Alejarte y dejar que seguridad se encargue',
        cost: 0,
        outcome: 'Seguridad controla la situación. Tu madurez para no responder es destacada en la prensa.',
        effects: { prestige: 10, fans: -2, energy: 0, capital: 0 }
      }
    ]
  },
  {
    title: 'Multa por Impuntualidad',
    description: 'Llegás 40 minutos tarde a la charla técnica prepartido por quedarte dormido tras una sesión larga de videojuegos.',
    choices: [
      {
        text: 'Inventar una excusa poco creíble',
        cost: 0,
        outcome: 'El cuerpo técnico no te cree y te aplica una multa interna por impuntualidad.',
        effects: { prestige: -8, fans: 0, energy: 5, capital: -2000 }
      },
      {
        text: 'Asumir el error frente a todos y disculparte',
        cost: 0,
        outcome: 'El grupo valora la honestidad, aunque el DT te deja como titular en duda para el próximo partido.',
        effects: { prestige: -2, fans: 3, energy: 0, capital: 0 }
      }
    ]
  }
];
export const OPPONENT_CLUBS_POOL: string[] = [
  'Boca Juniors', 'River Plate', 'Racing Club de Avellaneda', 'Independiente', 'San Lorenzo de Almagro',
  'Flamengo', 'Palmeiras', 'Corinthians', 'Atlético Mineiro', 'São Paulo',
  'Colo-Colo', 'Universidad de Chile', 'Peñarol', 'Nacional de Montevideo',
  'Universitario', 'Alianza Lima', 'Liga de Quito', 'Independiente del Valle',
  'América', 'Tigres U.A.N.L.', 'Monterrey', 'Inter Miami CF',
  'Bolívar', 'The Strongest', 'Libertad', 'Olimpia', 'Caracas FC', 'Deportivo Táchira'
];
// Función para obtener equipos de una liga y división específica
export const getTeamsByLeague = (leagueName: string, division: number) => {
  return CLUBS_DATABASE.filter(club => 
    club.league === leagueName && club.division === division
  );
};
/**
 * Inyecta dinámicamente los jugadores del mod LTA / Europa en un club de tu base de datos
 * @param clubName El nombre del equipo EXACTO como viene en el Excel (Ej: 'Junior de Barranquilla', 'Boca Juniors')
 */
export function getClubWithRoster(clubName: string): any {
  // 1. Buscamos el club base dentro de tu CLUBS_DATABASE actual
  const baseClub = (CLUBS_DATABASE as any[]).find(
    club => club.name && club.name.toLowerCase() === clubName.toLowerCase()
  );

  if (!baseClub) {
    return null;
  }

  // Clonamos el objeto para no mutar el original
  const clubClonado = { ...baseClub };

  // 2. El nombre del club en CLUBS_DATABASE puede no coincidir literalmente con el team_name
  // del JSON (ver EQUIPO_SYNONYMS más abajo, ej. "Junior de Barranquilla" -> "Junior"); sin esto,
  // cualquier club con sinónimo aparecía sin plantilla aunque sus jugadores sí existieran.
  const nombreParaBuscar = EQUIPO_SYNONYMS[baseClub.name] || clubName;

  // 3. Filtramos el universo de 32,000 jugadores buscando los que pertenezcan a este equipo
  const clubPlayers = ALL_PLAYERS.filter(
    player => player.team_name && player.team_name.toLowerCase() === nombreParaBuscar.toLowerCase()
  );

  // 4. Si encontramos jugadores en el JSON para este equipo, reconstruimos su plantilla
  if (clubPlayers.length > 0) {
    clubClonado.plantilla = {
      porteros: clubPlayers.filter(p => p.categoria_tactica === 'portero'),
      defensivos: clubPlayers.filter(p => p.categoria_tactica === 'defensivo'),
      ofensivos: clubPlayers.filter(p => p.categoria_tactica === 'ofensivo')
    };
  }

  return clubClonado;
}

/**
 * DICCIONARIO DE COINCIDENCIAS (Diccionario de Sinónimos)
 * Mapea el "name" de tu CLUBS_DATABASE con el "team_name" exacto del archivo JSON.
 */
const EQUIPO_SYNONYMS: Record<string, string> = {
  "Junior de Barranquilla": "Junior",
  "Club Atlético Boca Juniors": "Boca Juniors",
  "Real Madrid Club de Fútbol": "Real Madrid",
  "Club América": "América",
  "Patriotas Boyacá": "Patriotas",
  "Deportes Quindío": "Dep. Quindío",
  "Independiente Valle del Cauca": "Ind. Yumbo",
  "Internacional de Palmira": "Inter Palmira",
  "Orsomarso": "Orsomarso SC",
  "Atlético Cali": "Atlético FC",
  "FC Bayern München": "Bayern München",
  "FC Heidenheim": "1. FC Heidenheim",
  "SV Werder Bremen": "Werder Bremen",
  "TSG Hoffenheim": "TSG 1899 Hoffenheim",
  "Borussia Mönchengladbach": "Borussia M'gladbach",
  "Darmstadt 98": "SV Darmstadt 98",
  "Greuther Fürth": "SpVgg Greuther Fürth",
  "Magdeburg": "1. FC Magdeburg",
  "Atlético Mitre": "Atl. Mitre",
  "Deportivo Madryn": "Dep. Madryn",
  "Estudiantes de Buenos Aires": "Estudiantes B.A.",
  "Ferro": "Ferro Carril Oeste",
  "Gimnasia de Jujuy": "Gimnasia de J.",
  "Gimnasia y Tiro de Salta": "Gimnasia y Tiro",
  "Quilmes": "Quilmes A.C.",
  "C. Bolivar": "Ciudad Bolivar",
  "A. Rafaela": "Atletico Rafaela",
  "Comunicaciones": "Comunicaciones FC",
  "Talleres RE": "Talleres R.E.",
  "Chacarita": "Chacarita Jrs.",
  "San Martín de San Juan": "San Martín",
  "San Martín de Tucumán": "San Martín T.",
  "SM Mendoza": "San Martín (M)",
  "Defensores de Belgrano": "Defensores B.",
  "Huracan LH": "Huracán LH",
  "Arsenal de Sarandí": "Arsenal Sarandí",
  "Brest": "Stade Brestois 29",
  "Lens": "RC Lens",
  "Lille OSC": "LOSC Lille",
  "Nantes": "FC Nantes",
  "Nice": "OGC Nice",
  "Racing Club de Strasbourg Alsace": "RC Strasbourg",
  "Stade Rennais FC": "Stade Rennais",
};

// Diccionario para asignar colores estéticos de Tailwind a equipos genéricos según su liga
const LIGA_COLORS_MAP: Record<string, string> = {
  'Colombiana': 'border-l-4 border-yellow-500 bg-slate-900/40 text-yellow-100',
  'Brasileña': 'border-l-4 border-green-500 bg-slate-900/40 text-green-100',
  'Argentina': 'border-l-4 border-sky-400 bg-slate-900/40 text-sky-100',
  'Italiana': 'border-l-4 border-blue-600 bg-slate-900/40 text-blue-100',
  'Española': 'border-l-4 border-red-500 bg-slate-900/40 text-red-100',
  'Inglesa': 'border-l-4 border-indigo-500 bg-slate-900/40 text-indigo-100',
};

// GENERACIÓN DINÁMICA DE LA BASE DE DATOS DEFINITIVA
export const ULTIMATE_CLUBS_DATABASE: Club[] = (() => {
  // 1. Obtenemos una lista de todos los equipos únicos reales que existen en el JSON de jugadores
  const uniqueJsonTeams = Array.from(new Set(ALL_PLAYERS.map(p => p.team_name))).filter(Boolean);

  // Mapeamos los clubes base manuales primero
  const detailedClubs = (CLUBS_DATABASE as Club[]).map(club => {
    const nombreParaBuscar = EQUIPO_SYNONYMS[club.name] || club.name;
    const jugadoresDelClub = ALL_PLAYERS.filter(
      player => player.team_name.toLowerCase() === nombreParaBuscar.toLowerCase()
    );

    // Corregido: aplicamos el DT real / colores desde clubExtras.ts si existen para este club
    const extra = CLUB_EXTRAS[club.id];
    const clubConExtra = extra
      ? {
          ...club,
          dt: extra.dt,
          badgeColor: extra.badgeColor || club.badgeColor,
          badgeLogoUrl: extra.badgeLogoUrl || club.badgeLogoUrl
        }
      : club;

    if (jugadoresDelClub.length > 0) {
      const nombresReales = jugadoresDelClub
        .sort((a, b) => b.media_valoracion - a.media_valoracion)
        .map(p => p.nombre_completo);

      return {
        ...clubConExtra,
        starPlayers: nombresReales.slice(0, 5) // Mostramos las 5 estrellas principales reales
      };
    }
    return clubConExtra;
  });

  // 2. Para cada equipo en el JSON que NO esté en la lista detallada de CLUBS_DATABASE, lo generamos dinámicamente
  const generatedClubs: Club[] = [];

  uniqueJsonTeams.forEach((teamName, index) => {
    const cleanTeamName = teamName.trim();
    
    // Verificamos si ya lo tenemos detallado de forma manual (evitar duplicados)
    const alreadyExists = detailedClubs.some(
      c => c.name.toLowerCase() === cleanTeamName.toLowerCase() || 
           (EQUIPO_SYNONYMS[c.name] && EQUIPO_SYNONYMS[c.name].toLowerCase() === cleanTeamName.toLowerCase())
    );

    if (!alreadyExists) {
      const jugadoresDelClub = ALL_PLAYERS.filter(p => p.team_name === teamName);
      if (jugadoresDelClub.length === 0) return;

      // Ordenamos jugadores por valoración
      const sortedPlayers = jugadoresDelClub.sort((a, b) => b.media_valoracion - a.media_valoracion);
      const starPlayersNames = sortedPlayers.slice(0, 5).map(p => p.nombre_completo);

      // Calculamos un valor de mercado sumando el de sus jugadores, o un valor genérico base
      const computedMarketValue = jugadoresDelClub.reduce((acc, p) => acc + (p.valor_mercado_eur || 500000), 0);
      
      // Tomamos la liga del primer jugador que encontremos de ese club
      const ligaDetectada = jugadoresDelClub[0].categoria_tactica ? 'Internacional' : 'Liga Local';

      generatedClubs.push({
        id: `gen_${index}`,
        name: cleanTeamName,
        league: ligaDetectada,
        dt: 'Mánager Técnico', // Un valor limpio en lugar de "DT Genérico"
        reputation: sortedPlayers[0].media_valoracion >= 82 ? 5 : sortedPlayers[0].media_valoracion >= 75 ? 4 : 3,
        initialSalary: Math.round(computedMarketValue * 0.0002) || 1200,
        marketValue: computedMarketValue || 5000000,
        starPlayers: starPlayersNames,
        description: `Club profesional que compite activamente en la liga con plantel competitivo.`,
        badgeColor: LIGA_COLORS_MAP[ligaDetectada] || 'border-l-4 border-slate-700 bg-slate-900/40 text-slate-100',
        badgeLogoUrl: '🛡️',
        division: 1
      });
    }
  });

  // Unimos ambos mundos: Los detallados a mano + Los generados automáticamente
  return [...detailedClubs, ...generatedClubs];
})();

// ==========================================
// --- SELECCIONES NACIONALES · MUNDIAL 2026 ---
// ==========================================
// Los 48 clasificados reales al Mundial 2026, investigados en Transfermarkt +
// fuentes fiables (FIFA.com, federaciones oficiales, ESPN/BBC/AP). DT: se usó
// siempre el que dirigió al equipo EN el torneo (varias selecciones cambiaron
// de DT apenas terminó el Mundial; usar ese DT post-torneo habría dejado
// nombres "vacantes" o desactualizados para el modo de juego).
// NO se mezcla con CLUBS_DATABASE / ULTIMATE_CLUBS_DATABASE (así no aparece
// como club inicial ni como oferta de traspaso) -- ver findClubOrNationalTeam
// en App.tsx/Dashboard.tsx/MatchSimulator.tsx/PostMatch.tsx para la búsqueda
// combinada cuando currentClubId apunta a una selección durante el Mundial.
// `league` solo se completa para las selecciones cuya nacionalidad ya es
// elegible en SetupScreen (para poder convocar al jugador) -- las demás
// existen igual, para que el Mundial tenga los 48 equipos reales de fondo.
const WORLD_CUP_2026_TEAMS_SEED: { id: string; countryName: string; league?: string; dt: string; starPlayers: string[]; badgeLogoUrl: string }[] = [
  { id: 'wc_colombia', countryName: 'Colombia', league: 'Colombiana', dt: 'Néstor Lorenzo', starPlayers: ['Luis Díaz', 'James Rodríguez', 'Jhon Arias', 'Richard Ríos', 'Davinson Sánchez'], badgeLogoUrl: '🇨🇴' },
  { id: 'wc_alemania', countryName: 'Alemania', league: 'Alemana', dt: 'Julian Nagelsmann', starPlayers: ['Jamal Musiala', 'Florian Wirtz', 'Joshua Kimmich', 'Kai Havertz', 'Antonio Rüdiger'], badgeLogoUrl: '🇩🇪' },
  { id: 'wc_argentina', countryName: 'Argentina', league: 'Argentina', dt: 'Lionel Scaloni', starPlayers: ['Lionel Messi', 'Julián Álvarez', 'Lautaro Martínez', 'Rodrigo De Paul', 'Emiliano Martínez'], badgeLogoUrl: '🇦🇷' },
  { id: 'wc_canada', countryName: 'Canadá', dt: 'Jesse Marsch', starPlayers: ['Alphonso Davies', 'Jonathan David', 'Ismaël Koné', 'Tajon Buchanan', 'Alistair Johnston'], badgeLogoUrl: '🇨🇦' },
  { id: 'wc_mexico', countryName: 'México', league: 'Mexicana', dt: 'Javier Aguirre', starPlayers: ['Santiago Giménez', 'Edson Álvarez', 'Gilberto Mora', 'Julián Quiñones', 'Guillermo Ochoa'], badgeLogoUrl: '🇲🇽' },
  { id: 'wc_usa', countryName: 'Estados Unidos', league: 'Estadounidense', dt: 'Mauricio Pochettino', starPlayers: ['Christian Pulisic', 'Weston McKennie', 'Folarin Balogun', 'Tyler Adams', 'Malik Tillman'], badgeLogoUrl: '🇺🇸' },
  { id: 'wc_curazao', countryName: 'Curazao', dt: 'Dick Advocaat', starPlayers: ['Tahith Chong', 'Armando Obispo', 'Sontje Hansen', 'Juninho Bacuna', 'Riechedly Bazoer'], badgeLogoUrl: '🇨🇼' },
  { id: 'wc_haiti', countryName: 'Haití', dt: 'Sébastien Migné', starPlayers: ['Jean-Ricner Bellegarde', 'Danley Jean Jacques', 'Frantzdy Pierrot', 'Carlens Arcus', 'Duckens Nazon'], badgeLogoUrl: '🇭🇹' },
  { id: 'wc_panama', countryName: 'Panamá', dt: 'Thomas Christiansen', starPlayers: ['Adalberto Carrasquilla', 'Amir Murillo', 'José Córdoba', 'José Luis Rodríguez', 'Ismael Díaz'], badgeLogoUrl: '🇵🇦' },
  { id: 'wc_brasil', countryName: 'Brasil', league: 'Brasileña', dt: 'Carlo Ancelotti', starPlayers: ['Vinícius Júnior', 'Raphinha', 'Bruno Guimarães', 'Gabriel Martinelli', 'Matheus Cunha'], badgeLogoUrl: '🇧🇷' },
  { id: 'wc_ecuador', countryName: 'Ecuador', league: 'Ecuatoriana', dt: 'Sebastián Beccacece', starPlayers: ['Moisés Caicedo', 'Piero Hincapié', 'Willian Pacho', 'Pervis Estupiñán', 'Gonzalo Plata'], badgeLogoUrl: '🇪🇨' },
  { id: 'wc_paraguay', countryName: 'Paraguay', dt: 'Gustavo Alfaro', starPlayers: ['Miguel Almirón', 'Julio Enciso', 'Diego Gómez', 'Omar Alderete', 'Ramón Sosa'], badgeLogoUrl: '🇵🇾' },
  { id: 'wc_uruguay', countryName: 'Uruguay', league: 'Uruguaya', dt: 'Marcelo Bielsa', starPlayers: ['Federico Valverde', 'Darwin Núñez', 'Ronald Araújo', 'Rodrigo Bentancur', 'Giorgian De Arrascaeta'], badgeLogoUrl: '🇺🇾' },
  { id: 'wc_nueva_zelanda', countryName: 'Nueva Zelanda', dt: 'Darren Bazeley', starPlayers: ['Chris Wood', 'Joe Bell', 'Elijah Just', 'Liberato Cacace', 'Marko Stamenić'], badgeLogoUrl: '🇳🇿' },
  { id: 'wc_australia', countryName: 'Australia', dt: 'Tony Popovic', starPlayers: ['Alessandro Circati', 'Cristian Volpato', 'Nestory Irankunda', 'Jordan Bos', 'Mathew Leckie'], badgeLogoUrl: '🇦🇺' },
  { id: 'wc_irak', countryName: 'Irak', dt: 'Graham Arnold', starPlayers: ['Ali Al-Hamadi', 'Ahmed Qasem', 'Aymen Hussein', 'Zidane Iqbal', 'Merchas Doski'], badgeLogoUrl: '🇮🇶' },
  { id: 'wc_iran', countryName: 'Irán', dt: 'Amir Ghalenoei', starPlayers: ['Mehdi Taremi', 'Alireza Jahanbakhsh', 'Saman Ghoddos', 'Mehdi Ghayedi', 'Ehsan Hajsafi'], badgeLogoUrl: '🇮🇷' },
  { id: 'wc_japon', countryName: 'Japón', dt: 'Hajime Moriyasu', starPlayers: ['Takefusa Kubo', 'Ritsu Doan', 'Kaishu Sano', 'Ko Itakura', 'Daichi Kamada'], badgeLogoUrl: '🇯🇵' },
  { id: 'wc_jordania', countryName: 'Jordania', dt: 'Badou Zaki', starPlayers: ['Musa Al-Tamari', 'Yazan Al-Arab', 'Ali Olwan', 'Mohammad Abu Zrayq', 'Noor Al-Rawabdeh'], badgeLogoUrl: '🇯🇴' },
  { id: 'wc_corea_sur', countryName: 'Corea del Sur', dt: 'Hong Myung-bo', starPlayers: ['Son Heung-min', 'Lee Kang-in', 'Kim Min-jae', 'Hwang Hee-chan', 'Cho Gue-sung'], badgeLogoUrl: '🇰🇷' },
  { id: 'wc_catar', countryName: 'Catar', dt: 'Julen Lopetegui', starPlayers: ['Akram Afif', 'Almoez Ali', 'Hassan Al-Haydos', 'Edmílson Junior', 'Boualem Khoukhi'], badgeLogoUrl: '🇶🇦' },
  { id: 'wc_arabia_saudita', countryName: 'Arabia Saudita', dt: 'Georgios Donis', starPlayers: ['Salem Al-Dawsari', 'Saud Abdulhamid', 'Firas Al-Buraikan', 'Mohamed Kanno', 'Saleh Al-Shehri'], badgeLogoUrl: '🇸🇦' },
  { id: 'wc_uzbekistan', countryName: 'Uzbekistán', dt: 'Fabio Cannavaro', starPlayers: ['Abdukodir Khusanov', 'Eldor Shomurodov', 'Abbosbek Fayzullaev', 'Jaloliddin Masharipov', 'Sherzod Nasrullaev'], badgeLogoUrl: '🇺🇿' },
  { id: 'wc_argelia', countryName: 'Argelia', dt: 'Vladimir Petković', starPlayers: ['Riyad Mahrez', 'Rayan Aït-Nouri', 'Ibrahim Maza', 'Amine Gouiri', 'Mohamed Amoura'], badgeLogoUrl: '🇩🇿' },
  { id: 'wc_cabo_verde', countryName: 'Cabo Verde', dt: 'Pedro "Bubista" Leitão Brito', starPlayers: ['Logan Costa', 'Ryan Mendes', 'Jovane Cabral', 'Roberto Lopes', 'Garry Rodrigues'], badgeLogoUrl: '🇨🇻' },
  { id: 'wc_rd_congo', countryName: 'RD Congo', dt: 'Sébastien Desabre', starPlayers: ['Chancel Mbemba', 'Yoane Wissa', 'Aaron Wan-Bissaka', 'Noah Sadiki', 'Cédric Bakambu'], badgeLogoUrl: '🇨🇩' },
  { id: 'wc_costa_marfil', countryName: 'Costa de Marfil', dt: 'Emerse Faé', starPlayers: ['Amad Diallo', 'Franck Kessié', 'Simon Adingra', 'Odilon Kossounou', 'Nicolas Pépé'], badgeLogoUrl: '🇨🇮' },
  { id: 'wc_egipto', countryName: 'Egipto', dt: 'Hossam Hassan', starPlayers: ['Mohamed Salah', 'Omar Marmoush', 'Trezeguet', 'Zizo', 'Emam Ashour'], badgeLogoUrl: '🇪🇬' },
  { id: 'wc_ghana', countryName: 'Ghana', dt: 'Carlos Queiroz', starPlayers: ['Antoine Semenyo', 'Mohammed Kudus', 'Thomas Partey', 'Iñaki Williams', 'Jordan Ayew'], badgeLogoUrl: '🇬🇭' },
  { id: 'wc_marruecos', countryName: 'Marruecos', dt: 'Mohamed Ouahbi', starPlayers: ['Achraf Hakimi', 'Brahim Díaz', 'Ayyoub Bouaddi', 'Noussair Mazraoui', 'Sofyan Amrabat'], badgeLogoUrl: '🇲🇦' },
  { id: 'wc_senegal', countryName: 'Senegal', dt: 'Pape Thiaw', starPlayers: ['Sadio Mané', 'Kalidou Koulibaly', 'Nicolas Jackson', 'Ismaïla Sarr', 'Iliman Ndiaye'], badgeLogoUrl: '🇸🇳' },
  { id: 'wc_sudafrica', countryName: 'Sudáfrica', dt: 'Hugo Broos', starPlayers: ['Lyle Foster', 'Themba Zwane', 'Ronwen Williams', 'Teboho Mokoena', 'Relebohile Mofokeng'], badgeLogoUrl: '🇿🇦' },
  { id: 'wc_tunez', countryName: 'Túnez', dt: 'Hervé Renard', starPlayers: ['Hannibal Mejbri', 'Ellyes Skhiri', 'Montassar Talbi', 'Ali Abdi', 'Anis Ben Slimane'], badgeLogoUrl: '🇹🇳' },
  { id: 'wc_austria', countryName: 'Austria', dt: 'Ralf Rangnick', starPlayers: ['David Alaba', 'Konrad Laimer', 'Kevin Danso', 'Nicolas Seiwald', 'Patrick Wimmer'], badgeLogoUrl: '🇦🇹' },
  { id: 'wc_belgica', countryName: 'Bélgica', dt: 'Rudi Garcia', starPlayers: ['Jérémy Doku', 'Kevin De Bruyne', 'Romelu Lukaku', 'Amadou Onana', 'Youri Tielemans'], badgeLogoUrl: '🇧🇪' },
  { id: 'wc_bosnia', countryName: 'Bosnia y Herzegovina', dt: 'Sergej Barbarez', starPlayers: ['Edin Džeko', 'Ermedin Demirović', 'Sead Kolašinac', 'Amar Dedić', 'Esmir Bajraktarević'], badgeLogoUrl: '🇧🇦' },
  { id: 'wc_croacia', countryName: 'Croacia', dt: 'Zlatko Dalić', starPlayers: ['Luka Modrić', 'Josko Gvardiol', 'Martin Baturina', 'Petar Sučić', 'Ivan Perišić'], badgeLogoUrl: '🇭🇷' },
  { id: 'wc_chequia', countryName: 'Chequia', dt: 'Miroslav Koubek', starPlayers: ['Tomáš Souček', 'Patrik Schick', 'Ladislav Krejčí', 'Pavel Šulc', 'Adam Hložek'], badgeLogoUrl: '🇨🇿' },
  { id: 'wc_inglaterra', countryName: 'Inglaterra', league: 'Inglesa', dt: 'Thomas Tuchel', starPlayers: ['Jude Bellingham', 'Bukayo Saka', 'Harry Kane', 'Declan Rice', 'Reece James'], badgeLogoUrl: '🏴' },
  { id: 'wc_francia', countryName: 'Francia', league: 'Francesa', dt: 'Didier Deschamps', starPlayers: ['Kylian Mbappé', 'Ousmane Dembélé', 'Michael Olise', 'William Saliba', 'Aurélien Tchouaméni'], badgeLogoUrl: '🇫🇷' },
  { id: 'wc_holanda', countryName: 'Holanda', league: 'Holandesa', dt: 'Ronald Koeman', starPlayers: ['Virgil van Dijk', 'Ryan Gravenberch', 'Cody Gakpo', 'Frenkie de Jong', 'Tijjani Reijnders'], badgeLogoUrl: '🇳🇱' },
  { id: 'wc_noruega', countryName: 'Noruega', dt: 'Ståle Solbakken', starPlayers: ['Erling Haaland', 'Martin Ødegaard', 'Antonio Nusa', 'Andreas Schjelderup', 'Jørgen Strand Larsen'], badgeLogoUrl: '🇳🇴' },
  { id: 'wc_portugal', countryName: 'Portugal', league: 'Portuguesa', dt: 'Roberto Martínez', starPlayers: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Vitinha', 'João Neves', 'Rafael Leão'], badgeLogoUrl: '🇵🇹' },
  { id: 'wc_escocia', countryName: 'Escocia', dt: 'Steve Clarke', starPlayers: ['Scott McTominay', 'Andy Robertson', 'John McGinn', 'Kieran Tierney', 'Lewis Ferguson'], badgeLogoUrl: '🏴' },
  { id: 'wc_espana', countryName: 'España', league: 'Española', dt: 'Luis de la Fuente', starPlayers: ['Lamine Yamal', 'Pedri', 'Rodri', 'Ferran Torres', 'Martín Zubimendi'], badgeLogoUrl: '🇪🇸' },
  { id: 'wc_suecia', countryName: 'Suecia', dt: 'Graham Potter', starPlayers: ['Alexander Isak', 'Viktor Gyökeres', 'Anthony Elanga', 'Lucas Bergvall', 'Yasin Ayari'], badgeLogoUrl: '🇸🇪' },
  { id: 'wc_suiza', countryName: 'Suiza', dt: 'Murat Yakin', starPlayers: ['Granit Xhaka', 'Gregor Kobel', 'Dan Ndoye', 'Denis Zakaria', 'Ardon Jashari'], badgeLogoUrl: '🇨🇭' },
  { id: 'wc_turquia', countryName: 'Türkiye', dt: 'Vincenzo Montella', starPlayers: ['Arda Güler', 'Kenan Yıldız', 'Hakan Çalhanoğlu', 'Barış Alper Yılmaz', 'Orkun Kökçü'], badgeLogoUrl: '🇹🇷' },
];

export const WORLD_CUP_TEAMS_DATABASE: Club[] = WORLD_CUP_2026_TEAMS_SEED.map(team => ({
  id: team.id,
  name: `Selección de ${team.countryName}`,
  league: team.league ?? 'Selecciones Mundial 2026',
  dt: team.dt,
  reputation: 5,
  initialSalary: 0,
  marketValue: 0,
  starPlayers: team.starPlayers,
  description: `Selección masculina absoluta de ${team.countryName}, Mundial 2026.`,
  badgeColor: 'border-l-4 border-slate-500 bg-slate-900/40 text-slate-100',
  badgeLogoUrl: team.badgeLogoUrl
}));

// Mapa nacionalidad (tal como la guarda PlayerProfile.nationality, igual que Club.league)
// -> id de la selección correspondiente, para saber a qué equipo te pueden convocar.
// Solo cubre las nacionalidades que SetupScreen ofrece elegir Y que clasificaron al Mundial
// 2026 (Italiana y Chilena no clasificaron, por eso no están acá).
export const NATIONALITY_TO_WORLD_CUP_TEAM_ID: Record<string, string> = Object.fromEntries(
  WORLD_CUP_2026_TEAMS_SEED.filter(t => t.league).map(t => [t.league as string, t.id])
);