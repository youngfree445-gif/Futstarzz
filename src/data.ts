import rawPlayers from './playersDatabase.json';
import operarioBadge from './assets/badges/operario.png';
import strasbourgBadge from './assets/badges/strasbourg.png';
import alavesBadge from './assets/badges/alaves.png';

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
import { Club, PressQuestion, ShopItem, Achievement } from './types';
import { CLUB_EXTRAS } from './clubExtras';
import mauSportsAvatar from './assets/mau_sports.jpg';
import fabrizioRomanoAvatar from './assets/press/FABRIZZIO ROMANO.jpg';
import gastonEdulAvatar from './assets/press/gaston Edul.jpg';
import eduAguirreAvatar from './assets/press/EDU AGUIRRE.jpg';
import pipeSierraAvatar from './assets/press/PIPE SIERRA.jpg';
import joseHugoIlleraAvatar from './assets/press/josehugoillera.jpg';
import carlosAntonioVelezAvatar from './assets/press/Carlos Antonio Velez.jpg';
import eduardoLuisAvatar from './assets/press/eduardo luis.jpg';
import espnLogo from './assets/press/ESPN.png';
import rcnLogo from './assets/press/RCN.jpg';
import caracolLogo from './assets/press/CARACOL.jpg';
import gamingSponsorshipImg from './assets/sponsors/gaming_sponsorship.jpg';
import streamingDealImg from './assets/sponsors/streaming_deal.jpg';
import sportsDrinkImg from './assets/sponsors/sports_drink.jpg';
import fashionLineImg from './assets/sponsors/fashion_line.jpg';
import watchBrandImg from './assets/sponsors/watch_brand.jpg';
import cryptoSponsorImg from './assets/sponsors/crypto_sponsor.jpg';
import airlineDealImg from './assets/sponsors/airline_deal.jpg';
import telecomDealImg from './assets/sponsors/telecom_deal.jpg';
import fastfoodDealImg from './assets/sponsors/fastfood_deal.jpg';
import bankDealImg from './assets/sponsors/bank_deal.jpg';
import bettingDealImg from './assets/sponsors/betting_deal.jpg';
import sneakerDealImg from './assets/sponsors/sneaker_deal.jpg';
import energyDrinkDealImg from './assets/sponsors/energy_drink_deal.jpg';
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
    themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Junior de Barranquilla',
    league: 'Colombiana',
    dt: 'Alfredo Arias',
    reputation: 5,
    initialSalary: 1800,
    marketValue: 9500000,
    starPlayers: ['Francisco Fydriszewski', 'Teófilo Gutiérrez', 'Luis Fernando Muriel', 'Yimmi Chará', 'Cristian Barrios', 'Mauro Silveira', 'Jean Pestaña'],
    description: 'El Tiburón de Barranquilla, bicampeón del Apertura 2026. Club de alta presión con hinchada apasionada, reforzado para el Clausura con Francisco Fydriszewski desde Independiente Medellín.',
    badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200',
    badgeLogoUrl: '🦈🔴⚪',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Junior_Barranquilla_logo.svg',
    division: 1
  },
  {
    id: 'nacional',
    themeColor: { primary: '#059669', secondary: '#f5f0e8' }, name: 'Atlético Nacional',
    league: 'Colombiana',
    dt: 'Lucas González',
    reputation: 5,
    initialSalary: 2000,
    marketValue: 12000000,
    starPlayers: ['Franco Armani', 'William Tesillo', 'Edwin Cardona', 'Chicho Arango', 'Andrés Reyes', 'Elías Cabrera', 'Nicolás Rodríguez'],
    description: 'El Verdolaga de Medellín. Uno de los gigantes de América con una infraestructura de primer nivel, reforzado con el regreso de Franco Armani al arco.',
    badgeColor: 'border-l-4 border-emerald-600 bg-emerald-950/40 text-emerald-200',
    badgeLogoUrl: '🟢⚪🏆',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atletico-nacional/atletico-nacional-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'millonarios',
    themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Millonarios FC',
    league: 'Colombiana',
    dt: 'Fabián Bustos',
    reputation: 5,
    initialSalary: 1950,
    marketValue: 11000000,
    starPlayers: ['Radamel Falcao García', 'Álvaro Montero', 'Mackalister Silva', 'Daniel Ruiz', 'Andrey Estupiñán', 'James Aguirre', 'Darwin Quintero'],
    description: 'El Embajador de Bogotá. Histórico club de la capital que busca la gloria internacional en 2026 con Falcao García, con una revolución de fichajes de Fabián Bustos para el Clausura.',
    badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200',
    badgeLogoUrl: '🦅🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/millonarios/millonarios-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'santafe',
    themeColor: { primary: '#e83a3a', secondary: '#f5f0e8' }, name: 'Independiente Santa Fe',
    league: 'Colombiana',
    dt: 'Pablo Repetto',
    reputation: 4,
    initialSalary: 1600,
    marketValue: 8000000,
    starPlayers: ['Hugo Rodallega', 'Franco Fagúndez', 'Helibelton Palacios', 'Leandro Castellanos', 'Kevin Balanta', 'Luis Mario Palacios (LM)'],
    description: 'El León bogotano. Caracterizado por su garra, juego defensivo férreo y mística copera, reforzado con la llegada a préstamo de Kevin Balanta desde Santos Laguna.',
    badgeColor: 'border-l-4 border-red-550 bg-red-900/35 text-red-100',
    badgeLogoUrl: '🦁🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/independiente-santa-fe/independiente-santa-fe-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'america_cali',
    themeColor: { primary: '#b91c1c', secondary: '#f5f0e8' }, name: 'América de Cali',
    league: 'Colombiana',
    dt: 'David González',
    reputation: 4,
    initialSalary: 1700,
    marketValue: 9000000,
    starPlayers: ['Darwin Machís (LW)', 'Yeison Guzmán (CAM)', 'Luis Quiñones (ST)', 'Adrián Ramos (ST)', 'Jhon Murillo (RW)', 'Jean (GK)', 'Brayan Córdoba (CB)', 'Rafael Carrascal (CM)', 'Marlon Torres (CB)', 'Yani Quintero (CM)', 'Dany Rosero (CB)'],
    description: 'La Mechita de Cali. Un club histórico con una afición monumental que exige títulos cada semestre, reforzado para el Clausura con el regreso de Luis Quiñones tras 9 años en México.',
    badgeColor: 'border-l-4 border-red-700 bg-red-950/60 text-red-300',
    badgeLogoUrl: '😈🔴🔴',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/america-de-cali/america-de-cali-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'medellin',
    themeColor: { primary: '#1d4ed8', secondary: '#f5f0e8' }, name: 'Independiente Medellín',
    league: 'Colombiana',
    dt: 'Luis Amaranto Perea',
    reputation: 4,
    initialSalary: 1550,
    marketValue: 7500000,
    starPlayers: ['Andrés Mosquera Marmolejo', 'Agustín Martegani', 'Juan José Córdoba', 'Jeison Medina', 'Iván Arboleda', 'Joaquín Varela (CB)', 'Salvador Ichazo'],
    description: 'El Poderoso de la Montaña, compartiendo plaza con Nacional y un juego de presión intensa, reforzado con Agustín Martegani a préstamo desde Boca Juniors.',
    badgeColor: 'border-l-4 border-blue-700 bg-blue-955/40 text-red-100',
    badgeLogoUrl: '🔴🔵⛰️',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/independiente-medellin/independiente-medellin-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'tolima',
    themeColor: { primary: '#d97706', secondary: '#f5f0e8' }, name: 'Deportes Tolima',
    league: 'Colombiana',
    dt: 'Sebastián Oliveros',
    reputation: 4,
    initialSalary: 1500,
    marketValue: 7200000,
    starPlayers: ['Anderson Angulo (CB)', 'Brayan Rovira (CDM)', 'Neto Volpi (GK)', 'Luis Sandoval (ST)', 'Junior Hernández (LB)', 'Jherson Mosquera (RB)', 'Jan Ángulo (CB)', 'Sebastián Guzmán (CDM)', 'Jader Valencia (ST)', 'Jersson González (RW)', 'Adrián Parra'],
    description: 'El Vinotinto y Oro. Club vendedor y sumamente competitivo en Ibagué que pelea campeonatos.',
    badgeColor: 'border-l-4 border-amber-600 bg-amber-950/20 text-yellow-105',
    badgeLogoUrl: '🟤🟡🔥',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/deportes-tolima/deportes-tolima-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'once_caldas',
    themeColor: { primary: '#d4d4d4', secondary: '#f5f0e8' }, name: 'Once Caldas',
    league: 'Colombiana',
    dt: 'Hernán Darío Herrera',
    reputation: 3,
    initialSalary: 1200,
    marketValue: 5550000,
    starPlayers: ['Dayro Moreno (ST)', 'Andrés Felipe Roa (CAM)', 'Michael Barrios (RM)', 'Robert Mejía (CDM)', 'Juan David Cuesta (RB)', 'Jaime Alvarado (CDM)', 'Jorge Cardona (CB)', 'Jeider Riquett (CB)', 'Juan Nieto (CM)', 'Andrés Colorado (CDM)', 'Joan Parra'],
    description: 'El Blanco Blanco de Manizales, campeón de América histórico con una afición fiel en el Palogrande.',
    badgeColor: 'border-l-4 border-neutral-300 bg-slate-900 text-white',
    badgeLogoUrl: '⚪🟢🔴',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/once-caldas/once-caldas-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'cali',
    name: 'Deportivo Cali',
    league: 'Colombiana',
    dt: 'Rafael Dudamel',
    reputation: 3,
    initialSalary: 1250,
    marketValue: 6000000,
    starPlayers: ['Carlos Bacca (ST)', 'Emanuel Reynoso (CAM)', 'Juan Dinenno (ST)', 'Pedro Gallese (GK)', 'Avilés Hurtado (LW)', 'Alejandro Rodríguez (GK)', 'Fabián Viáfara (RB)', 'Felipe Aguilar (CB)', 'Johan Martinez (LW)'],
    description: 'El glorioso Azucarero. Un gigante de Cali que busca volver a los primeros puestos de la tabla, con la bomba de mercado de Carlos Bacca como agente libre para el Clausura.',
    badgeColor: 'border-l-4 border-emerald-700 bg-slate-900 text-emerald-100',
    badgeLogoUrl: '🟢⚪⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/deportivo-cali/deportivo-cali-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'bucaramanga',
    themeColor: { primary: '#e0b30a', secondary: '#f5f0e8' }, name: 'Atlético Bucaramanga',
    league: 'Colombiana',
    dt: 'Pablo Peirano',
    reputation: 3,
    initialSalary: 1100,
    marketValue: 5000000,
    starPlayers: ['Aldair Quintana', 'Andrés Ponce', 'Fabián Sambueza', 'Omar Albornoz (LM)'],
    description: 'Los Leopardos de Bucaramanga. Orden táctico impenetrable y gran ambiente en el Alfonso López.',
    badgeColor: 'border-l-4 border-yellow-550 bg-emerald-950/30 text-yellow-100',
    badgeLogoUrl: '🐆🟡🟢',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Escudo_Atl%C3%A9tico_Bucaramanga_2024_-_II.png',
    division: 1
  },
  {
    id: 'aguilas',
    themeColor: { primary: '#ca8a04', secondary: '#f5f0e8' }, name: 'Águilas Doradas',
    league: 'Colombiana',
    dt: 'Flavio Robatto',
    reputation: 3,
    initialSalary: 1000,
    marketValue: 4500000,
    starPlayers: ['Bryan Urueña (LW)', 'John García (CB)', 'Diego Hernández (CB)', 'Frank Lozano (CDM)', 'Andrés Ricaurte (CM)', 'Dylan Lozano (RB)', 'Jorge Rivaldo (ST)', 'Iván Arboleda (GK)', 'Iván Rojas (CDM)', 'Sebastián Rodríguez (CB)'],
    description: 'Equipo de transiciones veloces y juego táctico muy coordinado.',
    badgeColor: 'border-l-4 border-yellow-600 bg-neutral-900 text-amber-300',
    badgeLogoUrl: '🦅💛⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/aguilas-doradas/aguilas-doradas-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'internacional_bogota',
    name: 'Internacional de Bogotá',
    league: 'Colombiana',
    dt: 'Ricardo Valiño',
    reputation: 3,
    initialSalary: 1100,
    marketValue: 4800000,
    starPlayers: ['Washington Ortega', 'Amaury Torralvo', 'Élan Ricardo', 'Johan Rojas'],
    description: 'Anteriormente La Equidad. Estructura física dura, marca pegajosa y difícil de vencer.',
    badgeColor: 'border-l-4 border-emerald-505 bg-slate-900 text-emerald-300',
    badgeLogoUrl: '⚖️🟢⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/internacional-de-bogota/internacional-de-bogota-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'pereira',
    themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Deportivo Pereira',
    league: 'Colombiana',
    dt: 'Arturo Reyes',
    reputation: 3,
    initialSalary: 1150,
    marketValue: 5200000,
    starPlayers: ['Carlos Darwin'],
    description: 'El Matecaña de Pereira, juego alegre en el Hernán Ramírez Villegas.',
    badgeColor: 'border-l-4 border-yellow-500 bg-red-950/20 text-yellow-300',
    badgeLogoUrl: '🟡🔴🐺',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/deportivo-pereira/deportivo-pereira-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'fortaleza_fc',
    themeColor: { primary: '#3b82f6', secondary: '#f5f0e8' }, name: 'Fortaleza FC',
    league: 'Colombiana',
    dt: 'Diego Arias',
    reputation: 3,
    initialSalary: 900,
    marketValue: 4100000,
    starPlayers: ['Sebastián Navarro'],
    description: 'El equipo de los Amix en Bogotá. Toque rápido, picardía y juego vistoso.',
    badgeColor: 'border-l-4 border-blue-500 bg-red-950/20 text-blue-200',
    badgeLogoUrl: '🏰🔵🔴',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fortaleza/fortaleza-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'pasto',
    themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Deportivo Pasto',
    league: 'Colombiana',
    dt: 'Jonathan Risueño',
    reputation: 3,
    initialSalary: 950,
    marketValue: 4300000,
    starPlayers: ['Herrerín (GK)', 'Andrey Estupiñán (LW)', 'Fáiner Torijano (CB)', 'Johan Caicedo (CDM)', 'Diego Chavez (CM)', 'Joider Micolta (LW)', 'Yéiler Góez (CM)', 'Santiago Córdoba (ST)', 'Geovanni Banguera (GK)', 'Santiago Jiménez (RB)', 'Nicolás Gil (CB)', 'Julián Quiñónes (CB)', 'Joider Micolta', 'Jorge Obregón (ST)', 'Mayer Gil'],
    description: 'Los Volcánicos de Nariño, invencibles de local a gran altura sobre el nivel del mar.',
    badgeColor: 'border-l-4 border-red-600 bg-blue-955/20 text-red-200',
    badgeLogoUrl: '🌋🔴🔵',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/deportivo-pasto/deportivo-pasto-logo-footylogos.svg',
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
    starPlayers: ['Pedro Franco', 'Déinner Quiñones (RM)', 'Jhildrey Lasso', 'Misael Martínez (ST)'],
    description: 'El equipo de Valledupar que juega al contraataque letal.',
    badgeColor: 'border-l-4 border-black bg-yellow-950/20 text-slate-100',
    badgeLogoUrl: '🖤💛⚒️',
    badgeImageUrl: 'badges/tm/alianza_fc.png',
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
    starPlayers: ['Delio Ramírez (CM)', 'Yesús Cabrera (CAM)', 'Darío Denis (GK)', 'Juan Carlos Díaz (CDM)', 'Jairo Molina (ST)', 'Arlen Banguero (CB)', 'Yaliston Martínez (LB)', 'Sebastián Palma (CB)', 'Sebastián Salazar (CM)', 'Andrés Aedo (CDM)', 'Rogerio Caicedo (GK)', 'Jefferson Mena'],
    description: 'El tablero ajedrezado asentado en Tunja con resistencia física de altura.',
    badgeColor: 'border-l-4 border-emerald-650 bg-slate-900 text-white',
    badgeLogoUrl: '🏁🟢🏁',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/boyaca-chico/boyaca-chico-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'llaneros_fc',
    themeColor: { primary: '#f97316', secondary: '#f5f0e8' }, name: 'Llaneros FC',
    league: 'Colombiana',
    dt: 'José Luis García',
    reputation: 3,
    initialSalary: 780,
    marketValue: 3700000,
    starPlayers: ['Duvan Mosquera', 'Agustín Fiorilli', 'Frank Castañeda (RM)'],
    description: 'El Orgullo de Villavicencio. Ascendido de gran temporada llanera que debuta en Primera División 2026.',
    badgeColor: 'border-l-4 border-orange-500 bg-orange-950/30 text-orange-200',
    badgeLogoUrl: '🐴⚙️🔸',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/llaneros/llaneros-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'jaguares',
    themeColor: { primary: '#059669', secondary: '#f5f0e8' }, name: 'Jaguares de Córdoba',
    league: 'Colombiana',
    dt: 'Hubert Bodhert',
    reputation: 3,
    initialSalary: 820,
    marketValue: 3800000,
    starPlayers: ['Wilson Morelo', 'Kahiser Lenis', 'Geovanni Banguera', 'Andrés Rentería', 'Carlos Cantillo (CM)'],
    description: 'Los Felinos de Montería, ascendidos de regreso en 2026. Fuerza física adaptada al alto calor costeño.',
    badgeColor: 'border-l-4 border-emerald-600 bg-slate-900 text-emerald-250',
    badgeLogoUrl: '🐱🔵🟢',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/jaguares-de-cordoba/jaguares-de-cordoba-logo-footylogos.svg',
    division: 2
  },
  {
    id: 'cucuta',
    themeColor: { primary: '#d32f2f', secondary: '#f5f0e8' }, name: 'Cúcuta Deportivo',
    league: 'Colombiana',
    dt: 'Richard Páez',
    reputation: 3,
    initialSalary: 880,
    marketValue: 4000000,
    starPlayers: ['Luis Payares (CB)', 'Víctor Mejía (CM)', 'Mauricio Duarte (LB)', 'Juan Diego Ceballos (CM)', 'Luifer Hernández (ST)', 'Luis Hinestroza (CDM)', 'Joao Abonia (RW)', 'Jhon Quiñones (CB)', 'Marlon Carabali (RW)'],
    description: 'El Doblemente Glorioso en el General Santander, disputando la Primera B con la ilusión de volver pronto a la A.',
    badgeColor: 'border-l-4 border-red-650 bg-neutral-900 text-red-200',
    badgeLogoUrl: '🔴⚫🏹',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cucuta-deportivo/cucuta-deportivo-logo-footylogos.svg',
    division: 2
  },

  // Colombia Division 2
  {
    id: 'cartagena',
    themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Real Cartagena',
    league: 'Colombiana',
    dt: 'Álvaro Hernández',
    reputation: 2,
    initialSalary: 650,
    marketValue: 2200000,
    starPlayers: ['Jarlan Barrera (CAM)', 'Mauro Manotas (ST)', 'Cristian Graciano (RB)', 'Fredy Montero (ST)', 'Didier Pino (CDM)', 'Luis Yanes (LW)', 'Ronaldo Lora (CB)', 'Aldo Montes (GK)', 'Juan Sebastian Herrera (RB)', 'Andrés Escobar (LW)', 'Luis Guevara (CM)', 'Jaen Carlos Pineda (CM)', 'Diego Castillo (ST)'],
    description: 'El equipo heroico de Cartagena de Indias. Con un plantel de experimentados de primera y DT de jerarquía buscando el ascenso.',
    badgeColor: 'border-l-4 border-yellow-500 bg-emerald-950/25 text-yellow-101',
    badgeLogoUrl: '🔰🟡🟢',
    badgeImageUrl: 'badges/colombia/cartagena.jpg',
    division: 2
  },
  {
    id: 'barranquilla_fc',
    themeColor: { primary: '#e83a3a', secondary: '#f5f0e8' }, name: 'Barranquilla FC',
    league: 'Colombiana',
    dt: 'Dayron Pérez',
    reputation: 2,
    initialSalary: 600,
    marketValue: 2000000,
    starPlayers: ['Yeferson Moreno (RB)', 'Juan Lemus (GK)', 'Jhon Cortez (LB)', 'Miller Bacca (ST)', 'Cristian Peñate (ST)', 'Miguel Agamez (CM)', 'José Caicedo (CB)', 'Omar Cassiani (LB)', 'Sebastián Guerra (GK)'],
    description: 'El equipo filial y formador de Barranquilla que compite fuertemente en el Torneo de Ascenso de Colombia.',
    badgeColor: 'border-l-4 border-red-550 bg-red-950/30 text-yellow-300',
    badgeLogoUrl: '🔴💛👹',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/EscudoBquillaFC-1-200x233.png',
    division: 2
  },
  {
    id: 'envigado_fc',
    themeColor: { primary: '#f97316', secondary: '#f5f0e8' }, name: 'Envigado FC',
    league: 'Colombiana',
    dt: 'Alberto Suárez',
    reputation: 2,
    initialSalary: 620,
    marketValue: 2100000,
    starPlayers: ['Felipe Jaramillo', 'Luis Díaz (Jr)', 'Juan Manuel Cuesta', 'Jaime Mora (GK)'],
    description: 'La Cantera de Héroes, luchando por consolidarse en la Primera A tras años de vaivén.',
    badgeColor: 'border-l-4 border-orange-500 bg-orange-950/20 text-orange-200',
    badgeLogoUrl: '🟠🟢⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/envigado/envigado-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'union_magdalena',
    themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Unión Magdalena',
    league: 'Colombiana',
    dt: 'Carlos Silva',
    reputation: 2,
    initialSalary: 610,
    marketValue: 1950000,
    starPlayers: ['José Mercado (CM)', 'Víctor Cabezas (GK)', 'Juan Jose Vásquez (LB)', 'Jimmy Congo (CDM)', 'Cristian Iguarán (ST)', 'Joaquín Mattalía (GK)', 'Juan Diego Giraldo (CM)', 'David Murillo (RB)', 'José Palacios (RM)'],
    description: 'El Ciclón Bananero de Santa Marta, que promete batalla física costera en la Primera A.',
    badgeColor: 'border-l-4 border-blue-600 bg-red-900/10 text-blue-200',
    badgeLogoUrl: '🔵🔴🍌',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/union-magdalena/union-magdalena-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'boca_cali',
    themeColor: { primary: '#3b82f6', secondary: '#f5f0e8' }, name: 'Boca Juniors de Cali',
    league: 'Colombiana',
    dt: 'José Manuel Rodríguez',
    reputation: 2,
    initialSalary: 550,
    marketValue: 1800000,
    starPlayers: ['Yaser Asprilla (Jr)', 'Ferney Angulo'],
    description: 'Tradicional cuadro caleño que juega el ascenso enfocados en formación táctica.',
    badgeColor: 'border-l-4 border-blue-500 bg-yellow-950/20 text-blue-200',
    badgeLogoUrl: '🔵💛⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Escudo_Boca_Juniors_de_Cali.png',
    division: 2
  },
  {
    id: 'patriotas',
    themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Patriotas Boyacá',
    league: 'Colombiana',
    dt: 'Carlos Giraldo',
    reputation: 2,
    initialSalary: 550,
    marketValue: 1800000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'El equipo lancero de Tunja. Fuerte en la altura.',
    badgeColor: 'border-l-4 border-red-600 bg-red-950/20 text-white',
    badgeLogoUrl: '🛡️🔴',
    badgeImageUrl: 'badges/colombia/patriotas.jpg',
    division: 2
  },
  {
    id: 'quindio',
    themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'Deportes Quindío',
    league: 'Colombiana',
    dt: 'Harold Rivera',
    reputation: 2,
    initialSalary: 550,
    marketValue: 1800000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'El equipo Cuyabro, histórico del Eje Cafetero.',
    badgeColor: 'border-l-4 border-green-600 bg-green-950/20 text-yellow-300',
    badgeLogoUrl: '☕🟢',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/ESCUDO_DEP_QUINDIO_2023.png',
    division: 2
  },
  {
    id: 'leones_fc',
    themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Leones FC',
    league: 'Colombiana',
    dt: 'Felipe Merino',
    reputation: 2,
    initialSalary: 500,
    marketValue: 1600000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Club antioqueño enfocado en potenciar jóvenes talentos.',
    badgeColor: 'border-l-4 border-yellow-500 bg-yellow-950/20 text-yellow-200',
    badgeLogoUrl: '🦁🟡',
    badgeImageUrl: 'badges/tm/leones_fc.png',
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
    starPlayers: ['Jugador 1', 'Jugador 2', 'Jhon Lerma (RB)'],
    description: 'Franquicia surgida en 2026 (heredera de Atlético Huila), trasladada de Yumbo a Palmira.',
    badgeColor: 'border-l-4 border-slate-200 bg-slate-950 text-slate-100',
    badgeLogoUrl: '⚪⚫',
    division: 2
  },
  {
    id: 'inter_palmira',
    themeColor: { primary: '#3b82f6', secondary: '#f5f0e8' }, name: 'Internacional de Palmira',
    league: 'Colombiana',
    dt: 'Héctor Cárdenas',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Nueva franquicia compitiendo con fuerza en el Valle.',
    badgeColor: 'border-l-4 border-blue-500 bg-slate-900 text-white',
    badgeLogoUrl: '🌴🔵',
    badgeImageUrl: 'badges/colombia/internacional_palmira.png',
    division: 2
  },
  {
    id: 'cundinamarca_fc',
    themeColor: { primary: '#0ea5e9', secondary: '#f5f0e8' }, name: 'Real Cundinamarca',
    league: 'Colombiana',
    dt: 'Diego Mazo',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Juan Salcedo (ST)', 'Jhon Suaza (CB)', 'Onel Acosta (LB)', 'William Dávila (CAM)', 'Leider Montaño (ST)', 'Stiven Moreno (CB)', 'Jhon Córtes (LB)', 'Iván Camacho (CDM)', 'Juan David Hoyos (CDM)', 'Yan Vega (ST)', 'Jose Cundumi (ST)'],
    description: 'Representativo de la sabana, juega de local en Mosquera desde 2026.',
    badgeColor: 'border-l-4 border-sky-500 bg-slate-900 text-white',
    badgeLogoUrl: '🦅🩵',
    badgeImageUrl: 'badges/colombia/real_cundinamarca.png',
    division: 2
  },
  {
    id: 'orsomarso',
    themeColor: { primary: '#1e40af', secondary: '#f5f0e8' }, name: 'Orsomarso',
    league: 'Colombiana',
    dt: 'Mauricio Arquez',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'Equipo rocoso y complicado de Palmira.',
    badgeColor: 'border-l-4 border-blue-800 bg-white text-blue-900',
    badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'badges/colombia/orsomarso.png',
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
    starPlayers: ['Faiber Mendoza (CM)', 'Juan Ararat (RW)', 'Juan David Rueda (ST)', 'Juan Pablo García Habib (RB)', 'Santiago José Jiménez (CM)', 'Rafael Tapia (ST)', 'Harlem Salas (LW)', 'Kevin Chacón (GK)', 'Jordi Hernández (CB)', 'Wilmer Bustamante (CM)', 'José Torres'],
    description: 'Equipo formativo del oriente colombiano.',
    badgeColor: 'border-l-4 border-cyan-400 bg-slate-900 text-white',
    badgeLogoUrl: '🩵⚪',
    badgeImageUrl: 'badges/colombia/real_santander.png',
    division: 2
  },
  {
    id: 'bogota_fc',
    themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Bogotá FC',
    league: 'Colombiana',
    dt: 'Sebastián Botero',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Cristián Mosquera (RB)', 'Brayan Castro (RW)', 'Juan Martínez (LW)', 'Andrés Buelvas (ST)', 'Kevin Castro (CDM)', 'Harold Sandoval Lasso (ST)', 'Juan Camilo Moreno (LB)', 'Santiago Ruiz (CB)', 'Ronaldo Tavera (CDM)', 'Mauricio Medina (RB)'],
    description: 'El equipo de la capital que lucha en la B.',
    badgeColor: 'border-l-4 border-yellow-500 bg-red-600 text-yellow-300',
    badgeLogoUrl: '🟡🔴',
    badgeImageUrl: 'badges/colombia/bogota_fc.png',
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
    starPlayers: ['Orles Aragón (ST)', 'Michael Mahecha (CM)', 'Víctor Brid (GK)', 'Ricardo Rosales (RB)', 'Ghilbert Parra (LB)', 'Camilo Ibarra (RW)', 'Duván Viáfara (CB)', 'Jesús Cano (LB)', 'Brandon Mejía (CDM)', 'Matteo Frigerio (RW)'],
    description: 'Felinos bogotanos buscando dar el zarpazo al ascenso.',
    badgeColor: 'border-l-4 border-gray-400 bg-slate-900 text-white',
    badgeLogoUrl: '🐯⚪',
    badgeImageUrl: 'badges/colombia/tigres_fc.jpg',
    division: 2
  },
  {
    id: 'atletico_cali',
    themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Atlético Cali',
    league: 'Colombiana',
    dt: 'Clodoaldo',
    reputation: 1,
    initialSalary: 450,
    marketValue: 1400000,
    starPlayers: ['Jugador 1', 'Jugador 2'],
    description: 'El otro equipo de Cali con ganas de llegar a Primera.',
    badgeColor: 'border-l-4 border-blue-600 bg-yellow-500 text-blue-900',
    badgeLogoUrl: '🔵🟡',
    badgeImageUrl: 'badges/colombia/atletico_cali.png',
    division: 2
  },
// ==========================================
  // --- ARGENTINA (LIGA PROFESIONAL) ---
  // ==========================================
  { id: 'san_lorenzo', themeColor: { primary: '#991b1b', secondary: '#f5f0e8' }, name: 'San Lorenzo de Almagro', league: 'Argentina', dt: 'Néstor Gorosito', reputation: 4, initialSalary: 2100, marketValue: 13000000, starPlayers: ['Adam Bareiro', 'Nahuel Barrios', 'Luciano Vietto', 'Gonzalo Ábrego'], description: 'El Ciclón de Boedo, con Luciano Vietto llegando libre tras su paso por Racing.', badgeColor: 'border-l-4 border-red-800 bg-blue-950 text-white', badgeLogoUrl: '🌪️',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/san-lorenzo-de-almagro.a0e4e931.png', division: 1 },
  { id: 'river', themeColor: { primary: '#ef4444', secondary: '#f5f0e8' }, name: 'River Plate', league: 'Argentina', dt: 'Eduardo Coudet', reputation: 5, initialSalary: 3800, marketValue: 83300000, starPlayers: ['Aníbal Moreno (CDM)', 'Gonzalo Montiel (RB)', 'Marcos Acuña (LB)', 'Ángel Correa (CAM)', 'Nicolás Otamendi (CB)', 'Lucas Martínez Quarta (CB)', 'Sebastián Driussi (ST)', 'Mauro Arambarri (CDM)', 'Fausto Vera (CM)', 'Maximiliano Salas (ST)', 'Facundo Colidio (ST)'], description: 'El Millonario, con Ángel Correa como fichaje récord del club para heredar la camiseta 10 tras la salida de Juanfer Quintero.', badgeColor: 'border-l-4 border-red-500 bg-white text-slate-900', badgeLogoUrl: '🐓',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/river-plate/river-plate-logo-footylogos.svg', division: 1 },
  { id: 'boca', name: 'Boca Juniors', league: 'Argentina', dt: 'Rodolfo Arruabarrena', reputation: 5, initialSalary: 3600, marketValue: 34300000, starPlayers: ['Leandro Paredes (CM)', 'Santiago Ascacíbar (CDM)', 'Exequiel Zeballos (LW)', 'Miguel Ángel Merentiel (ST)', 'Ayrton Costa (CB)', 'Sebastián Villa (RW)', 'Rodrigo Battaglia (CDM)', 'Álvaro Montero (GK)', 'Lautaro Blanco (LB)', 'Carlos Palacios (CAM)', 'Leandro Lozano (RB)'], description: 'El Xeneize, reforzado en el arco con la llegada de Álvaro Montero desde Vélez tras el Mundial 2026.', badgeColor: 'border-l-4 border-amber-500 bg-blue-900 text-amber-400', badgeLogoUrl: '🏆',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/boca-juniors/boca-juniors-logo-footylogos.svg', division: 1 },
  { id: 'estudiantes_lp', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Estudiantes de La Plata', league: 'Argentina', dt: 'Alexander Medina', reputation: 4, initialSalary: 2450, marketValue: 11550000, starPlayers: ['Enzo Pérez', 'Adolfo Gaich', 'Guido Carrillo', 'Tomás Palacios'], description: 'El Pincha, con Adolfo Gaich como primer refuerzo tras su salida libre del CSKA Moscú y Tomás Palacios a préstamo desde el Inter de Milán.', badgeColor: 'border-l-4 border-red-600 bg-slate-900 text-white', badgeLogoUrl: '🦁',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/estudiantes-de-la-plata/estudiantes-de-la-plata-logo-footylogos.svg', division: 1 },
  { id: 'gimnasia_lp', themeColor: { primary: '#1e40af', secondary: '#f5f0e8' }, name: 'Gimnasia y Esgrima La Plata', league: 'Argentina', dt: 'Ariel Pereyra', reputation: 3, initialSalary: 1500, marketValue: 8000000, starPlayers: ['Benjamín Domínguez', 'Leonardo Morales', 'Nelson Insfrán', 'Pablo De Blasis'], description: 'El Lobo platense.', badgeColor: 'border-l-4 border-blue-800 bg-white text-blue-900', badgeLogoUrl: '🐺',
    badgeImageUrl: null, division: 1 },
  { id: 'racing', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'Racing Club de Avellaneda', league: 'Argentina', dt: 'Juan Pablo Vojvoda', reputation: 4, initialSalary: 2800, marketValue: 18000000, starPlayers: ['Adrián Martínez', 'Ulises Ortegoza', 'Gabriel Arias', 'Roger Martínez', 'Alfonso Espino', 'Lautaro Díaz'], description: 'La Academia, reforzada con cuatro caras nuevas: Ortegoza (ex Talleres), Espino (ex Rayo Vallecano) y Lautaro Díaz a préstamo desde Cruzeiro.', badgeColor: 'border-l-4 border-sky-400 bg-sky-950 text-white', badgeLogoUrl: '🎓',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/250px-Escudo_de_Racing_Club_%282014%29.svg.png', division: 1 },
  { id: 'velez', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Vélez Sarsfield', league: 'Argentina', dt: 'Guillermo Barros Schelotto', reputation: 4, initialSalary: 2000, marketValue: 11000000, starPlayers: ['Tomás Marchiori (GK)', 'Elías Gómez (LB)', 'Manuel Lanzini (CAM)', 'Emanuel Mammana (CB)', 'Rodrigo Aliendro (CM)', 'Claudio Baeza (CDM)', 'Braian Romero (ST)', 'Diego Valdés (CAM)', 'Joaquín García (RB)', 'Matías Pellegrini (RM)'], description: 'El Fortín de Liniers, en pleno recambio de plantel tras la salida de Álvaro Montero a Boca y de su capitán Agustín Bouzat rumbo al Houston Dynamo.', badgeColor: 'border-l-4 border-blue-600 bg-white text-blue-800', badgeLogoUrl: 'V',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/velez-sarsfield/velez-sarsfield-logo-footylogos.svg', division: 1 },
  { id: 'independiente', name: 'Independiente', league: 'Argentina', dt: 'Gustavo Quinteros', reputation: 4, initialSalary: 2300, marketValue: 15000000, starPlayers: ['Rodrigo Rey (GK)', 'Víctor Ignacio Malcorra (CM)', 'Kevin Lomónaco (CB)', 'Santiago Montiel (RM)', 'Santiago Arias (RB)', 'Gabriel Ávalos (ST)', 'Leonardo Godoy (RB)', 'Iván Marcone (CDM)', 'Sebastián Valdéz (CB)', 'Facundo Zabala (LB)', 'Matías Abaldo (LM)'], description: 'El Rey de Copas.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '😈',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/independiente/independiente-logo-footylogos.svg', division: 1 },
  { id: 'lanus', name: 'Lanús', league: 'Argentina', dt: 'Mauricio Pellegrino', reputation: 4, initialSalary: 1800, marketValue: 9500000, starPlayers: ['Marcelino Moreno (CAM)', 'Nahuel Losada (GK)', 'Ramiro Carrera (LM)', 'Sasha Marcich (LB)', 'Eduardo Salvio (RM)', 'Franco Petroli (GK)', 'Carlos Izquierdoz (CB)', 'Agustín Cardozo (CDM)', 'Walter Bou (ST)', 'Lucas Acosta (GK)', 'José Canale (CB)'], description: 'El Granate.', badgeColor: 'border-l-4 border-white bg-red-900 text-white', badgeLogoUrl: '🇱🇻',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/lanus/lanus-logo-footylogos.svg', division: 1 },
  { id: 'newells', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Newells Old Boys', league: 'Argentina', dt: 'Frank Kudelka', reputation: 3, initialSalary: 1700, marketValue: 9000000, starPlayers: ['Ever Banega', 'Ignacio Ramírez', 'Armando Méndez', 'Ian Glavinovich'], description: 'La Lepra.', badgeColor: 'border-l-4 border-red-600 bg-black text-white', badgeLogoUrl: '🔴⚫',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/newells-old-boys/newells-old-boys-logo-footylogos.svg', division: 1 },
  { id: 'banfield', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'Banfield', league: 'Argentina', dt: 'Pedro Troglio', reputation: 3, initialSalary: 1400, marketValue: 7000000, starPlayers: ['Facundo Sanguinetti (GK)', 'Sergio Vittor (CB)', 'Santiago López García (RB)', 'Danilo Arboleda (CB)', 'Mauro Méndez (ST)', 'Bruno Sepúlveda (ST)', 'Nicolas Meriano (CB)', 'Nicolás Colazo (LB)', 'Ignacio Abraham (LB)', 'Lautaro Ríos (CM)', 'Gino Santilli (GK)'], description: 'El Taladro.', badgeColor: 'border-l-4 border-green-600 bg-white text-green-800', badgeLogoUrl: ' drill ',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/banfield/banfield-logo-footylogos.svg', division: 1 },
  { id: 'rosario_central', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Rosario Central', league: 'Argentina', dt: 'Jorge Almirón', reputation: 4, initialSalary: 2500, marketValue: 16000000, starPlayers: ['Ángel Di María (RW)', 'Conan Ledesma (GK)', 'Jaminton Campaz (LM)', 'Franco Ibarra (CDM)', 'Carlos Quintana (CB)', 'Facundo Mallo (CB)', 'Agustín Sández (LB)', 'Pol Fernández (CM)', 'Emanuel Coronel (RB)', 'Alejo Veliz (ST)', 'Federico Navarro (CDM)'], description: 'El Canalla.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-900 text-yellow-400', badgeLogoUrl: '🇺🇦',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/rosario-central/rosario-central-logo-footylogos.svg', division: 1 },
  { id: 'instituto', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Instituto de Córdoba', league: 'Argentina', dt: 'Diego Flores', reputation: 3, initialSalary: 1300, marketValue: 6500000, starPlayers: ['Silvio Romero', 'Gastón Lodico', 'Manuel Roffo', 'Fernando Alarcón'], description: 'La Gloria.', badgeColor: 'border-l-4 border-yellow-500 bg-red-600 text-yellow-200', badgeLogoUrl: '🔴🟡',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/instituto-cordoba/instituto-cordoba-logo-footylogos.svg', division: 1 },
  { id: 'argentinos_jrs', name: 'Argentinos Juniors', league: 'Argentina', dt: 'Nicolás Diez', reputation: 3, initialSalary: 1600, marketValue: 8500000, starPlayers: ['Alan Lescano', 'Maximiliano Romero', 'Luciano Gondou', 'Diego Rodríguez'], description: 'El Bicho de La Paternal.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🐞',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/argentinos-juniors/argentinos-juniors-logo-footylogos.svg', division: 1 },
  { id: 'belgrano', name: 'Belgrano de Córdoba', league: 'Argentina', dt: 'Ricardo Zielinski', reputation: 3, initialSalary: 1550, marketValue: 8000000, starPlayers: ['Lucas Passerini', 'Ulises Sánchez', 'Nahuel Losada', 'Matías Marín'], description: 'El Pirata.', badgeColor: 'border-l-4 border-black bg-sky-400 text-white', badgeLogoUrl: '🏴‍☠️',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Club_Atl%C3%A9tico_Belgrano_2026.svg', division: 1 },
  { id: 'atl_tucuman', name: 'Atlético Tucumán', league: 'Argentina', dt: 'Julio César Falcioni', reputation: 3, initialSalary: 1350, marketValue: 6800000, starPlayers: ['Leandro Díaz (ST)', 'Martín Benítez (CAM)', 'Leonel Di Plácido (RB)', 'Gastón Suso (CB)', 'Ramiro Ruiz Rodríguez (RM)', 'Gianluca Ferrari (CB)', 'Renzo Tesuri (RM)', 'Kevin Ortiz (CM)', 'Maximiliano Villa (RB)', 'Luis Ingolotti (GK)', 'Javier Domínguez (CM)'], description: 'El Decano.', badgeColor: 'border-l-4 border-white bg-sky-300 text-slate-900', badgeLogoUrl: '🩵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atletico-tucuman/atletico-tucuman-logo-footylogos.svg', division: 1 },
  { id: 'defensa_y_justicia', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Defensa y Justicia', league: 'Argentina', dt: 'Julio Vaccari', reputation: 3, initialSalary: 1650, marketValue: 8800000, starPlayers: ['Nicolás Fernández', 'Gastón Togni', 'Kevin Gutiérrez', 'Cristopher Fiermarín'], description: 'El Halcón de Varela.', badgeColor: 'border-l-4 border-yellow-500 bg-green-700 text-yellow-300', badgeLogoUrl: '🦅',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/defensa-y-justicia/defensa-y-justicia-logo-footylogos.svg', division: 1 },
  { id: 'huracan', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Huracán', league: 'Argentina', dt: 'Diego Martínez', reputation: 3, initialSalary: 1450, marketValue: 7500000, starPlayers: ['Óscar Romero (CAM)', 'Hernán Galíndez (GK)', 'Martín Nervo (CB)', 'Fabio Pereyra (CB)', 'Leonardo Gil (CDM)', 'Facundo Waller (LM)', 'Nehuén Paz (CB)', 'Sebastián Meza (GK)', 'Federico Vera (RB)', 'Alejandro Martínez (LW)', 'Lucas Blondel (RB)'], description: 'El Globo.', badgeColor: 'border-l-4 border-red-600 bg-white text-slate-900', badgeLogoUrl: '🎈',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/huracan/huracan-logo-footylogos.svg', division: 1 },
  { id: 'tigre', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Tigre', league: 'Argentina', dt: 'Diego Dabove', reputation: 3, initialSalary: 1300, marketValue: 6200000, starPlayers: ['Gonzalo Martínez (CAM)', 'Jalil Elías (CDM)', 'Joaquín Laso (CB)', 'Bruno Leyes (CDM)', 'Jabes Saralegui (RM)', 'Joaquín Mosqueira (CDM)', 'Felipe Zenobio (GK)', 'David Romero (ST)', 'Nahuel Banegas (LB)', 'Elías Cabrera (LM)', 'Sebastián Medina (LM)'], description: 'El Matador de Victoria.', badgeColor: 'border-l-4 border-red-600 bg-blue-800 text-white', badgeLogoUrl: '🐯',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/tigre/tigre-logo-footylogos.svg', division: 1 },
  { id: 'union_sf', name: 'Unión de Santa Fe', league: 'Argentina', dt: 'Leonardo Madelón', reputation: 3, initialSalary: 1350, marketValue: 6500000, starPlayers: ['Lucas Gamba', 'Mauro Luna Diale', 'Claudio Corvalán', 'Nicolás Campisi'], description: 'El Tatengue.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Escudo_club_Atl%C3%A9tico_Uni%C3%B3n_de_santa_fe.svg', division: 1 },
  { id: 'talleres', name: 'Talleres de Córdoba', league: 'Argentina', dt: 'Jorge Sampaoli', reputation: 4, initialSalary: 2100, marketValue: 13000000, starPlayers: ['Ramón Sosa', 'Federico Girotti', 'Gastón Benavídez', 'Guido Herrera'], description: 'La T cordobesa.', badgeColor: 'border-l-4 border-blue-900 bg-white text-blue-900', badgeLogoUrl: 'T',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Escudo_Talleres_2015.svg', division: 1 },
  { id: 'platense', themeColor: { primary: '#d97706', secondary: '#f5f0e8' }, name: 'Platense', league: 'Argentina', dt: 'Walter Zunino', reputation: 2, initialSalary: 1100, marketValue: 4800000, starPlayers: ['Víctor Cuesta (CB)', 'Matías Borgogno (GK)', 'Ignacio Vázquez (CB)', 'Mauro Luna Diale (CM)', 'Leonardo Heredia (ST)', 'Augusto Lotti (ST)', 'Juan Saborido (RB)', 'Maximiliano Amarfil (CM)', 'Guido Mainero (RM)', 'Franco Zapiola (LM)', 'Bautista Merlini (CAM)'], description: 'El Calamar.', badgeColor: 'border-l-4 border-amber-600 bg-white text-amber-700', badgeLogoUrl: '🦑',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/platense.055fcd6f.png', division: 1 },
  { id: 'sarmiento', name: 'Sarmiento', league: 'Argentina', dt: 'Facundo Sava', reputation: 2, initialSalary: 1050, marketValue: 4500000, starPlayers: ['Mauricio Martínez (CDM)', 'Jonatan Gómez (CM)', 'Juan Manuel Insaurralde (CB)', 'Junior Marabel (ST)', 'Javier Burrai (GK)', 'Lucas Suárez (CB)', 'Yair Arismendi (LB)', 'Cristian Zabala (CDM)', 'Carlos Villalba (CM)', 'Renzo Orihuela (CB)', 'Gastón González (LM)'], description: 'El Verde de Junín.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🟢',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sarmiento/sarmiento-logo-footylogos.svg', division: 1 },
  { id: 'central_cordoba', name: 'Central Córdoba', league: 'Argentina', dt: 'Sebastián Domínguez', reputation: 2, initialSalary: 1000, marketValue: 4200000, starPlayers: ['Lucas González (CM)', 'Michael Santos (ST)', 'Alan Aguerre (GK)', 'Facundo Mansilla (CB)', 'Horacio Tijanovich (LM)', 'Alejandro Maciel (CB)', 'Matías Vera (CDM)', 'Ezequiel Naya (ST)', 'Marco Iacobellis (RM)', 'Santiago Moyano (RB)', 'Juan Pablo Pignani (CB)'], description: 'El Ferroviario.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🚂',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/central-cordoba.0147cdf5.png', division: 1 },
  { id: 'barracas', name: 'Barracas Central', league: 'Argentina', dt: 'Damián Ayude', reputation: 2, initialSalary: 1000, marketValue: 4200000, starPlayers: ['Iván Tapia (CAM)', 'Facundo Bruera (ST)', 'Yonatthan Rak (CB)', 'Rodrigo Insua (LB)', 'Gonzalo Maroni (CAM)', 'Juan Espínola (GK)', 'Dardo Miloc (CDM)', 'Gonzalo Morales (ST)', 'Gastón Campi (CB)', 'Damián Martínez (RB)', 'Rodrigo Bogarín (CAM)'], description: 'El Guapo.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/barracas-central/barracas-central-logo-footylogos.svg', division: 1 },
  { id: 'indep_rivadavia', name: 'Independiente Rivadavia', league: 'Argentina', dt: 'Alfredo Berti', reputation: 2, initialSalary: 950, marketValue: 4000000, starPlayers: ['Matías Reali', 'Francisco Petrasso', 'Gastón Gil Romero', 'Gonzalo Marinelli'], description: 'La Lepra Mendocina.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '🔵',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/independiente-rivadavia/independiente-rivadavia-logo-footylogos.svg', division: 1 },
  { id: 'riestra', name: 'Riestra', league: 'Argentina', dt: 'Guillermo Duró', reputation: 2, initialSalary: 900, marketValue: 3800000, starPlayers: ['Jonathan Herrera', 'Milton Céliz', 'Nicolás Caro Torres', 'Ignacio Arce'], description: 'Los Malevos.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚫',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Escudo_del_Club_Deportivo_Riestra.svg', division: 1 },
  { id: 'aldosivi', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'Aldosivi', league: 'Argentina', dt: 'Israel Damonte', reputation: 2, initialSalary: 1100, marketValue: 4800000, starPlayers: ['Sebastián Moyano (GK)', 'Axel Werner (GK)', 'Guillermo Enrique (RB)', 'Nicolás Zalazar (CB)', 'Joaquín Novillo (CB)', 'Esteban Rolón (CDM)', 'Néstor Breitenbruch (CB)', 'Nicolás Cordero (ST)', 'Alan Sosa (LM)', 'Lucas Rodríguez (LB)', 'Ignacio Chicco (GK)'], description: 'El Tiburón de Mar del Plata.', badgeColor: 'border-l-4 border-yellow-400 bg-green-700 text-yellow-300', badgeLogoUrl: '🦈',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/aldosivi/aldosivi-logo-footylogos.svg', division: 1 },
  { id: 'estudiantes_rc', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'Estudiantes de Río Cuarto', league: 'Argentina', dt: 'Rubén Forestello', reputation: 2, initialSalary: 1050, marketValue: 4500000, starPlayers: ['Guillermo Villalba', 'Tomás González', 'Gastón Arturia', 'Williams Barlasina'], description: 'El León del Imperio.', badgeColor: 'border-l-4 border-sky-400 bg-slate-100 text-sky-600', badgeLogoUrl: '🦁',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/estudiantes-de-rio-cuarto/estudiantes-de-rio-cuarto-logo-footylogos.svg', division: 1 },
  { id: 'gimnasia_mza', name: 'Gimnasia de Mendoza', league: 'Argentina', dt: 'Darío Franco', reputation: 2, initialSalary: 1000, marketValue: 4200000, starPlayers: ['Aaron Spetale', 'Leandro Ciccolini', 'Maximiliano Padilla', 'Luis Ojeda'], description: 'El Pituco.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🐺',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Escudo_Club_Atl%C3%A9tico_Gimnasia_y_Esgrima_Mendoza.png', division: 1 },

  // ==========================================
  // --- ARGENTINA (B NACIONAL) ---
  // ==========================================
  { id: 'san_martin_sj', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'San Martín de San Juan', league: 'Argentina', dt: 'Alejandro Schiapparelli', reputation: 2, initialSalary: 800, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2', 'Jugador 3'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-green-600 bg-black text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/san-martin-san-juan.235e999f.png', division: 2 },
  { id: 'godoy_cruz', name: 'Godoy Cruz', league: 'Argentina', dt: 'Mariano Toedtli', reputation: 3, initialSalary: 1400, marketValue: 7000000, starPlayers: ['Roberto Ramírez (GK)', 'Lucas Arce (RB)', 'Mateo Mendoza (CB)', 'Vicente Poggi (CM)', 'Nahuel Ulariaga (ST)', 'Matías Ramírez (LM)', 'Gastón Gil Romero (CDM)', 'Misael Sosa (RW)', 'Esteban Burgos (CB)', 'Martín Pino (ST)', 'Federico Milo (LB)'], description: 'El Tomba (Descendido en el mod).', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '🍷',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/godoy-cruz/godoy-cruz-logo-footylogos.svg', division: 2 },
  { id: 'agropecuario', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Agropecuario', league: 'Argentina', dt: 'Gabriel Gómez', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Carlos Auzqui (CAM)', 'Rodrigo Castro (CAM)', 'Brian Blando (ST)', 'Alejandro Gagliardi (ST)', 'Tomás Lecanda (CB)', 'Luciano Acosta (GK)', 'Alan Aguirre (CB)', 'Santiago Gallucci (CDM)', 'Jorge Valdéz Chamarro (CM)', 'Rodrigo Mosqueira (LM)', 'Milton Ramos (LB)'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-red-600 bg-green-700 text-white', badgeLogoUrl: '🚜',
    badgeImageUrl: null, division: 2 },
  { id: 'all_boys', name: 'All Boys', league: 'Argentina', dt: 'Aníbal Biggeri', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Ricardo Blanco (CAM)', 'Iván Zafarana (CB)', 'Maximiliano Coronel (CB)', 'Hernán Grana (RB)', 'Agustin Gallo (CM)', 'Matías Nouet (RW)', 'Franco Quiróz (LB)', 'Emiliano Purita (RB)', 'Alejo Tabares (LM)', 'Tomás Assenato (CM)', 'Juan Pablo Noce (GK)'], description: 'El Albo. Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/all-boys.ba9074bf.png', division: 2 },
  { id: 'almagro', name: 'Almagro', league: 'Argentina', dt: 'Carlos Mayor', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Andrés Chávez (ST)', 'Gonzalo Asís (RB)', 'Matías Cortave (CB)', 'Franco Bustamante (RM)', 'Julián Marchioni (CM)', 'Santiago Úbeda (CM)', 'Tobías Macies (CAM)', 'Gino Barbieri (CB)', 'Enzo Silcan (LB)', 'Enzo Martínez (LM)', 'Juan Pablo Zozaya (GK)'], description: 'El Tricolor. Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-sky-400 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/almagro.60edc3b7.png', division: 2 },
  { id: 'almirante_brown', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Almirante Brown', league: 'Argentina', dt: 'Rodrigo Alonso', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Facundo Quignon (CDM)', 'Gustavo Cabral (CB)', 'Leonardo Jara (RB)', 'Agustín Dattola (CB)', 'Jonatan Goya (CAM)', 'Nazareno Bazán (ST)', 'Máximo Levi (CB)', 'Tomas Villoldo (LB)', 'Hernan Perrone (CM)', 'Tobías Zárate (ST)', 'Ramiro Fernández (LB)'], description: 'La Fragata. Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-black text-yellow-400', badgeLogoUrl: '⚓',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/almirante-brown.0e146151.png', division: 2 },
  { id: 'atlanta', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Atlanta', league: 'Argentina', dt: 'Cristian Pellerano', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Christian Bernardi (CAM)', 'Nicolás Previtali (CDM)', 'Leonel Galeano (CB)', 'Braian Rivero (CDM)', 'Alejandro Quintana (ST)', 'Tomás Castro Ponce (CAM)', 'Francisco Rago (GK)', 'Rodrigo Moreira (CB)', 'Martin García (RB)', 'Gustavo Mendoza (CDM)', 'Federico Castro (ST)'], description: 'El Bohemio. Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-800 text-yellow-400', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 2 },
  { id: 'mitre', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Atlético Mitre', league: 'Argentina', dt: 'Carlos Mayor', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-black text-yellow-400', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Mitre_escudo.png', division: 2 },
  { id: 'central_norte', name: 'Central Norte', league: 'Argentina', dt: 'Adrián Bastía', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Arián Pucheta (CB)', 'Ramiro Costa (ST)', 'Agustin Aleo (LB)', 'Mauricio Rosales (RB)', 'Gonzalo Álvez (RM)', 'Maximiliano Padilla (LB)', 'Matías Villarreal (CDM)', 'Kevin Fernández (CAM)', 'Franco Vedoya (RW)', 'Joaquin Mateo (ST)', 'Leonardo Felissia (CB)'], description: 'El Cuervo salteño. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🐦',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/central-norte.657f3120.png', division: 2 },
  { id: 'chacarita', name: 'Chacarita', league: 'Argentina', dt: 'Cristian Grabinski', reputation: 2, initialSalary: 800, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Funebrero. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/chacarita.png', division: 2 },
  { id: 'chaco_for_ever', name: 'Chaco For Ever', league: 'Argentina', dt: 'Ricardo Pancaldo', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Bahiano García (CDM)', 'Matías Noble (LM)', 'Andrés Lioi (RM)', 'Gabriel Ramírez (CM)', 'Tomás Bolzicco (ST)', 'Ricardo Garay (CB)', 'Brian Nievas (CDM)', 'Gaston Canuto (GK)', 'David Valdez (CB)', 'Lucas Pruzzo (LB)', 'Agustin Alonso (RM)'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/chaco-for-ever.22550fd8.png', division: 2 },
  { id: 'colegiales', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Colegiales', league: 'Argentina', dt: 'Leonardo Fernández', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Emanuel Insua (LB)', 'Mauro Albertengo (ST)', 'Leandro Martínez Montagnoli (CB)', 'Gonzalo Baglivo (CDM)', 'Facundo Rivero (CB)', 'Lucio Castillo (CAM)', 'Nicolás Toloza (ST)', 'Alejandro Chiavetto (CM)', 'Elías Ocampo (RM)', 'Leonardo González (RW)', 'Mateo Mamaní (ST)'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-800 text-yellow-400', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/colegiales.79c039a3.png', division: 2 },
  { id: 'colon', name: 'Colón', league: 'Argentina', dt: 'Ezequiel Medrán', reputation: 3, initialSalary: 1200, marketValue: 5500000, starPlayers: ['Federico Lértora (CDM)', 'Pier Barrios (CB)', 'Federico Rasmussen (CB)', 'Mauro Peinipil (RB)', 'Facundo Castro (ST)', 'Nicolás Thaller (CB)', 'Matías Godoy (LM)', 'Lucas Cano (ST)', 'Agustín Toledo (CDM)', 'Darío Sarmiento (RM)', 'Emanuel Beltrán (RB)'], description: 'El Sabalero. Histórico en la B Nacional.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🐘',
    badgeImageUrl: null, division: 2 },
  { id: 'defensores_belgrano', name: 'Defensores de Belgrano', league: 'Argentina', dt: 'Fabián Nardozza', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/defensores-de-belgrano.47898da5.png', division: 2 },
  { id: 'dep_madryn', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Deportivo Madryn', league: 'Argentina', dt: 'Cristian Díaz', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-yellow-500 bg-black text-yellow-400', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/deportivo-madryn.0e2622e9.png', division: 2 },
  { id: 'dep_maipu', name: 'Deportivo Maipú', league: 'Argentina', dt: 'Mariano Echeverría', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Fausto Emanuel Montero (CM)', 'Nicolás Faggioli (CB)', 'Gastón Mansilla (RM)', 'Nahuel Galardi (GK)', 'Juan Pablo Gobetto (CM)', 'Matias Viguet (LM)', 'Nicolás Fernández (CB)', 'Mirko Bonfigli (CM)', 'Marcelo Eggel (CAM)', 'Felipe Rivarola (ST)', 'Luciano Arnijas (CM)'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/deportivo-maipu.936c1fc5.png', division: 2 },
  { id: 'dep_moron', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Deportivo Morón', league: 'Argentina', dt: 'Walter Otta', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Mariano Bíttolo (LB)', 'Juan Cruz Esquivel (LW)', 'Gonzalo Berterame (RM)', 'Juan Manuel Olivares (CM)', 'Matías Benítez (RW)', 'Julio Salvá (GK)', 'Braian Salvareschi (CB)', 'Joaquín Livera (LB)', 'Santiago Kubiszyn (CAM)', 'Franco Toloza (ST)', 'Francisco Flores (CB)'], description: 'El Gallo. Compite en B Nacional.', badgeColor: 'border-l-4 border-red-600 bg-white text-red-600', badgeLogoUrl: '🐓',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/deportivo-moron.b0971ec0.png', division: 2 },
  { id: 'estudiantes_ba', name: 'Estudiantes de Buenos Aires', league: 'Argentina', dt: 'Juan Manuel Sara', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/estudiantes-de-buenos-aires.87332c2d.png', division: 2 },
  { id: 'ferro', name: 'Ferro', league: 'Argentina', dt: 'Sergio Rondina', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🚂',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Escudo_club_ferro_c_oeste.svg/250px-Escudo_club_ferro_c_oeste.svg.png', division: 2 },
  { id: 'gimnasia_jujuy', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'Gimnasia de Jujuy', league: 'Argentina', dt: 'Hernán Pellerano', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-sky-400 bg-white text-sky-400', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/gimnasia-de-jujuy.b81e2eda.png', division: 2 },
  { id: 'guemes', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Güemes', league: 'Argentina', dt: 'Pablo Guiñazú', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Marcelo Benítez (LB)', 'Oscar Vanegas (CB)', 'Tomás Oneto (CB)', 'Juan Sánchez Sotelo (ST)', 'Fernando Godoy (CM)', 'David Véliz (LM)', 'Thomas Amilivia (ST)', 'Axel Bordón (RB)', 'Maico Quiroz (CDM)', 'Leandro Finochietto (GK)', 'Gianluca Pugliese (LW)'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-red-600 bg-blue-800 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/guemes.1651e4c6.png', division: 2 },
  { id: 'gimnasia_tiro', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'Gimnasia y Tiro de Salta', league: 'Argentina', dt: 'Juan Manuel Azconzábal', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-sky-400 bg-white text-sky-400', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 2 },
  { id: 'los_andes', name: 'Los Andes', league: 'Argentina', dt: 'Leonardo Lemos', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Brian Leizza (CB)', 'Sergio Fabián Ortíz (CM)', 'Daniel Franco (CB)', 'Gabriel Carrasco (RB)', 'Julián Navas (RB)', 'Mario Galeano (ST)', 'Mauricio Asenjo (ST)', 'Matías González (RM)', 'Sebastian López (GK)', 'Juan Manuel Vázquez (LM)', 'Javier Bustillos (GK)'], description: 'El Milrayitas. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/los-andes.d77697f1.png', division: 2 },
  { id: 'nueva_chicago', name: 'Nueva Chicago', league: 'Argentina', dt: 'Germán Lanaro', reputation: 2, initialSalary: 750, marketValue: 2500000, starPlayers: ['Alan Nahuel Ruiz (CAM)', 'Emiliano Méndez (CDM)', 'Gonzalo Paz (CB)', 'Guillermo Ferracuti (LB)', 'Ramiro Balbuena (RM)', 'Dylan Gissi (CB)', 'Gabriel Vega (CM)', 'Matías Vera (RB)', 'Luciano Jachfe (GK)', 'Sebastían Cocimano (ST)', 'Bruno Palazzo (CB)'], description: 'El Torito de Mataderos. Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-green-600 text-white', badgeLogoUrl: '🐂',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/nueva-chicago.0079f787.png', division: 2 },
  { id: 'patronato', name: 'Patronato', league: 'Argentina', dt: 'Marcelo Candia', reputation: 2, initialSalary: 800, marketValue: 3000000, starPlayers: ['Renzo Reynaga (ST)', 'Federico Bravo (CDM)', 'Hernán Rivero (ST)', 'Marcos Enrique (CDM)', 'Franco Meritello (CB)', 'Fernando Evangelista (LB)', 'Alan Sosa (GK)', 'Fernando Moreyra (CB)', 'Agustin Araujo (LM)', 'Franco Soldano (ST)', 'Maximiliano Rueda (CM)'], description: 'El Patrón. Compite en B Nacional.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/patronato.f88444ef.png', division: 2 },
  { id: 'quilmes', themeColor: { primary: '#1e40af', secondary: '#f5f0e8' }, name: 'Quilmes', league: 'Argentina', dt: 'Leandro Gracián', reputation: 2, initialSalary: 850, marketValue: 3200000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Cervecero. Compite en B Nacional.', badgeColor: 'border-l-4 border-blue-800 bg-white text-blue-900', badgeLogoUrl: '🍺',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/quilmes.7dbb0ee1.png', division: 2 },
  { id: 'racing_cba', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'Racing de Córdoba', league: 'Argentina', dt: 'Pablo Fornasari', reputation: 2, initialSalary: 650, marketValue: 1800000, starPlayers: ['Ricardo Centurión (LM)', 'Sebastian Marfort (CB)', 'Alejandro Rébola (CB)', 'Marcio Gómez (CB)', 'Gaspar Vega (CM)', 'Pablo Chavarría (ST)', 'Gabriel Aranda (CB)', 'Gaspar Iñiguez (CM)', 'Luciano Viano (LW)', 'Gonzalo Laborda (GK)', 'Sergio González (ST)'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-sky-400 bg-white text-sky-400', badgeLogoUrl: '⚽', badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/racing.4d26e175.png', division: 2 },
  { id: 'san_martin_tuc', name: 'San Martín de Tucumán', league: 'Argentina', dt: 'Alejandro Orfila', reputation: 3, initialSalary: 950, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Ciruja. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/san-martin-tucuman.f7ce7a1a.png', division: 2 },
  { id: 'san_miguel', name: 'San Miguel', league: 'Argentina', dt: 'Gustavo Coleoni', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Leandro Desábato (CDM)', 'Lucas Brochero (RM)', 'Bruno Nasta (ST)', 'Daniel Juárez (ST)', 'Juan Lungarzo (GK)', 'Lucas Delgado (ST)', 'Facundo Omar Cardozo (LB)', 'Alexis Cruz (LB)', 'Lucio Pérez (RB)', 'Dixon Renteria (CB)', 'Máximo Oses (LM)'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-green-700 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/san-miguel.ff5b1eb9.png', division: 2 },
  { id: 'san_telmo', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'San Telmo', league: 'Argentina', dt: 'Marcelo Perugini', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Facundo Roncaglia (CB)', 'Matías Laba (CDM)', 'Fabián Henríquez (CM)', 'Javier Iritier (LW)', 'Martín Batallini (ST)', 'Franco Tisera (ST)', 'Lucas Baldunciel (RW)', 'Emanuel Díaz (CB)', 'Juan Cruz Zurbriggen (ST)', 'Gabriel Paredes (LB)', 'Elías Brítez (CM)'], description: 'El Candombero. Compite en B Nacional.', badgeColor: 'border-l-4 border-sky-400 bg-blue-800 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/san-telmo.8dbec638.png', division: 2 },
  { id: 'temperley', name: 'Temperley', league: 'Argentina', dt: 'Nicolás Domingo', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Gabriel Hauche (CAM)', 'Gabriel Esparza (LW)', 'Adrián Arregui (CDM)', 'Franco Díaz (CDM)', 'Fernando Brandán (LM)', 'Ezequiel Mastrolía (GK)', 'Luciano Nieto (CAM)', 'Pedro Souto (LB)', 'Jerónimo Pourtau (GK)', 'Santiago Flores (CB)', 'Gian Nardelli (CB)'], description: 'El Gasolero. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/temperley.4b96f17f.png', division: 2 },
  { id: 'tristan_suarez', name: 'Tristán Suárez', league: 'Argentina', dt: 'José María Martínez', reputation: 2, initialSalary: 600, marketValue: 1500000, starPlayers: ['Nicolás Sánchez (LM)', 'Diego Becker (LM)', 'Manuel Guillén (RB)', 'Joaquín Trasante (CM)', 'Joaquín Bigo (GK)', 'Agustín Baldi (CB)', 'Nicolás Fernández (LB)', 'Nicolás Del Priore (CM)', 'Álvaro Veliez (ST)', 'Mauricio Manuel Guzmán (CB)', 'Alejandro Molina (RB)'], description: 'El Lechero. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/tristan-suarez.66a24f44.png', division: 2 },
  { id: 'midland', name: 'Midland', league: 'Argentina', dt: 'Joaquín Iturrería', reputation: 2, initialSalary: 550, marketValue: 1200000, starPlayers: ['Fernando González (CB)', 'Juan Cruz Vega (CAM)', 'Agustín Campana (LW)', 'Leonel Gigli (CB)', 'Emilio Porro (RB)', 'Lautaro Díaz Laharque (RB)', 'Genaro Cepeda (CB)', 'Maximiliano Rogoski (CM)', 'Santino Primante (ST)', 'Pablo Casarico (CB)', 'Marcos Roseti (RM)'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 2 },
  { id: 'acassuso', name: 'Acassuso', league: 'Argentina', dt: 'Darío Lema', reputation: 2, initialSalary: 550, marketValue: 1200000, starPlayers: ['Kevin Dubini (CAM)', 'David Escalante (ST)', 'Mariano Monllor (GK)', 'Ramiro Reynoso (CM)', 'Gabriel Atamañuk (GK)', 'Lucas Rey (RW)', 'Álex Ruiz (LB)', 'Nahuel Petillo (CM)', 'Juan Ponce de León (RB)', 'Lucas Pioli (CB)', 'Joel Gonzalo Ghirardello (CB)'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Club_acassuso_logo.png', division: 2 },
  { id: 'c_bolivar', name: 'C. Bolivar', league: 'Argentina', dt: 'Diego Funes', reputation: 2, initialSalary: 550, marketValue: 1200000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 2 },
  { id: 'a_rafaela', name: 'A. Rafaela', league: 'Argentina', dt: 'Fernando Quiroz', reputation: 2, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'La Crema. Compite en B Nacional.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/a_rafaela.png', division: 2 },

  // ==========================================
  // --- ARGENTINA (TERCERA DIVISIÓN) ---
  // ==========================================
  { id: 'alvarado', name: 'Alvarado', league: 'Argentina', dt: 'Pablo Martel', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Tomás Berra (CB)', 'Tomás Fernández (CB)', 'Leonardo Incorvaia (CB)', 'Fermín Iriarte (RB)', 'Nahuel González (GK)', 'Nahuel Speck (LW)', 'Lucas Chiozza (CAM)', 'Germán Cervera (ST)', 'Facundo Centurión (CB)', 'Germán Sosa (ST)', 'Cristian Gorgerino (LB)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/alvarado.c3e4f62c.png', division: 3 },
  { id: 'armenio', name: 'Armenio', league: 'Argentina', dt: 'Fernando Ruiz', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Franco Vega (CM)', 'Benjamín Ortíz (CDM)', 'Diego Nakache (ST)', 'Nicolas Sánchez (RM)', 'Facundo Tello (CM)', 'Federico Marchesini (CB)', 'Lucas Palma (ST)', 'Valentin Chocobar (CAM)', 'Juan Pablo Domínguez (GK)', 'Nahuel Troxler (RB)', 'Leandro Ramos (CAM)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/armenio.png', division: 3 },
  { id: 'arsenal_sarandi', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'Arsenal de Sarandí', league: 'Argentina', dt: 'Fabián Lisa', reputation: 1, initialSalary: 500, marketValue: 1200000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Arse. Compite en Tercera División.', badgeColor: 'border-l-4 border-sky-400 bg-red-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/arsenal-de-sarandi.85b6ee7a.png', division: 3 },
  { id: 'boca_unidos', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Boca Unidos', league: 'Argentina', dt: 'Lucas Batistuta', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Daniel Villalva (LM)', 'Esteban Orfano (RM)', 'Cristian Chávez (ST)', 'Luis Ojeda (GK)', 'Antonio Medina (ST)', 'Sebastián Navarro (CM)', 'Bryan Mendoza (RM)', 'Ataliva Schweizer (CDM)', 'Pablo Moreyra (CB)', 'Ángel Piz (CM)', 'Martín Ojeda (CM)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-yellow-500 bg-red-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 3 },
  { id: 'brown_adrogue', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Brown Adrogue', league: 'Argentina', dt: 'Jorge Vivaldo', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Adriel Ortíz (LB)', 'Nicolás Meaurio (CAM)', 'Elián Robles (CM)', 'Matías Sproat (RW)', 'Jonatan Bogado (RB)', 'Lucas Irusta (CB)', 'Juan Ignacio Silva (CDM)', 'Octavio Padovani (ST)', 'Víctor Galeano (RW)', 'Lucas Galván (CAM)', 'Lucas Cesare (RB)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-red-600 bg-black text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'cipoletti', name: 'Cipoletti', league: 'Argentina', dt: 'Fabian Enriquez', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Claudio Mosca (LM)', 'Brandon Obregón (CAM)', 'Facundo Crespo (GK)', 'Víctor Manchafico (CB)', 'Fernando Pettineroli (RM)', 'Sebastián Jeldres (ST)', 'Yago Piro (CB)', 'Gonzalo Lucero (LM)', 'Andrés Almirón (RW)', 'Marcos Pérez (CM)', 'Maximiliano López (LW)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚽', division: 3 },
  { id: 'comunicaciones', name: 'Comunicaciones', league: 'Argentina', dt: 'Sergio Leroy', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'El Cartero. Compite en Tercera.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 3 },
  { id: 'def_unidos', name: 'Defensores Unidos', league: 'Argentina', dt: 'Sebastián Farías', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Martin Gimenez (ST)', 'Fabricio Henricot (GK)', 'Luis Olivera (LB)', 'Maximiliano Ortigoza (RM)', 'Fernando Arébalo (RB)', 'Alan Sombra (ST)', 'Mauro Alarcon (RB)', 'Franco Suárez (CB)', 'Kevin Redondo (CDM)', 'Julio López (CB)', 'Matias Rapetti (LB)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/defensores-unidos.63d22ad9.png', division: 3 },
  { id: 'dock_sud', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Dock Sud', league: 'Argentina', dt: 'Miguel Elía', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Gonzalo Gómez (RM)', 'Sebastian Vivas (ST)', 'Federico Cataldi (LB)', 'Pablo Despósito (CM)', 'Nicolás Sánchez (ST)', 'Santiago Villarreal (RB)', 'Federico Otero (LM)', 'Giuliano Gualtieri (CM)', 'Agustín Arias (ST)', 'Ariel Barreiro (LB)', 'Kevin Ghigliazza (CAM)'], description: 'El Docke. Compite en Tercera.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-800 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 3 },
  { id: 'douglas_haig', name: 'Douglas Haig', league: 'Argentina', dt: 'Sebastián Cejas', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Robertino Seratto (CM)', 'Guillermo Pereira (CAM)', 'Martin Caballo (CDM)', 'Marcos Giménez (CM)', 'Elián Tus (LW)', 'Juan Muriel Orlando (ST)', 'Nicolás Canela (CB)', 'Fabricio González (ST)', 'Boris Magnago (RM)', 'Mauro Ponce De León (LM)', 'Brian Meza (CDM)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'excursionistas', name: 'Excursionistas', league: 'Argentina', dt: 'Rodrigo Bilbao', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Gonzalo Pedrosa (CB)', 'Mathias Fernández (RB)', 'Mariano Arango (LB)', 'Miguel López (CAM)', 'Alejandro Ávalos (CM)', 'Federico Haberkorn (ST)', 'Nicolás Rodríguez (GK)', 'Héctor Igarzábal (CB)', 'Alan Espeche (RW)', 'Iván Arbello (LW)', 'Antonio Paulides (CB)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Club_Atletico_Excursionistas.svg/250px-Club_Atletico_Excursionistas.svg.png', division: 3 },
  { id: 'guillermo_brown', name: 'Guillermo Brown', league: 'Argentina', dt: 'Christian Corrales', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Patricio Cucchi (ST)', 'Emanuel Moreno (LW)', 'Renzo Paparelli (CB)', 'Martín Rivero (CDM)', 'Rodrigo Díaz (CB)', 'Agustin Álvarez (CB)', 'Gabriel Lazarte (LB)', 'Francisco Illarregui (RW)', 'Agustín Grinovero (GK)', 'Luis Dezi (ST)', 'Natanael Hernández (LB)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/guillermo_brown.png', division: 3 },
  { id: 'huracan_lh', name: 'Huracan LH', league: 'Argentina', dt: 'Sergio Arias', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Rodrigo Arciero (RB)', 'Lucas Algozino (RM)', 'Aldo Araujo (RW)', 'Alejandro Toledo (ST)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'j_antoniana', name: 'J. Antoniana', league: 'Argentina', dt: 'Sergio Maza', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Pablo Palacios Alvarenga (ST)', 'Isaac Monti (CB)', 'Martín Esparza (LM)', 'Matias Vicedo (ST)', 'Leonel Canzoniero (LB)', 'Ezequiel Santángelo (RB)', 'Gaston Osores (CB)', 'Juan Pablo Serrano (GK)', 'Gabriel Taborda (CAM)', 'Juan Cruz Nadal (GK)', 'Nicolás González (RW)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-blue-800 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Escudo_Oficial_Centro_Juventud_Antoniana.svg', division: 3 },
  { id: 'laferrere', name: 'Laferrere', league: 'Argentina', dt: 'César Monasterio', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Tiago Libares (GK)', 'Alejandro Benítez (CAM)', 'Emanuel Trejo (CDM)', 'Alan Ortíz (CAM)', 'Luciano Nebot (CB)', 'Franco Romero (ST)', 'Benjamín Portillo (CM)', 'Josué Salvadores (CM)', 'Ignacio Cavoret (CB)', 'Nicolás Manzi (CB)', 'Eloy Rodríguez (ST)'], description: 'El Villero. Compite en Tercera.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'olimpo', name: 'Olimpo', league: 'Argentina', dt: 'Carlos Mungo', reputation: 1, initialSalary: 500, marketValue: 1200000, starPlayers: ['Braian Guille (LM)', 'Joaquín Susvielles (ST)', 'Martín Ferreyra (CB)', 'Néstor Moiraghi (CB)', 'Agustin Bellone (RB)', 'Marcelo Olivera (ST)', 'Enzo Coacci (LW)', 'Federico González (ST)', 'Diego Ramírez (CM)', 'Manuel Vargas (CM)', 'Luciano Lapetina (LB)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/olimpo.png', division: 3 },
  { id: 'sm_mendoza', name: 'SM Mendoza', league: 'Argentina', dt: 'Por confirmar', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', division: 3 },
  { id: 'sp_belgrano', name: 'SP Belgrano', league: 'Argentina', dt: 'Cristian Álvarez', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['German Lesman (ST)', 'Gianfranco Ferrero (LB)', 'Emanuel Mercado (ST)', 'Brian Flores (CB)', 'Mariano Gancedo (LB)', 'Agustín Pastorelli (LM)', 'Santiago Churchi (CM)', 'Leonardo Martina (GK)', 'Leonardo Ferreyra (RB)', 'Jonathan Paiz (CB)', 'Máximo Forlin (RW)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '⚽', badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/belgrano.c36ced57.png', division: 3 },
  { id: 'talleres_re', name: 'Talleres RE', league: 'Argentina', dt: 'Lucas Licht', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Maximiliano Rodríguez (RB)', 'Abel Masuero (CB)', 'Pablo Cortizo (CM)', 'Rodrigo Vélez (CDM)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '⚽', badgeImageUrl: 'https://assets.football-logos.cc/logos/argentina/1500x1500/talleres.c4234929.png', division: 3 },
  { id: 'villa_mitre', name: 'Villa Mitre', league: 'Argentina', dt: 'Diego Cochas', reputation: 1, initialSalary: 400, marketValue: 1000000, starPlayers: ['Leandro Fernández (LM)', 'Hugo Silva (RB)', 'Alex Battigelli (CDM)', 'Juan Pablo Mazza (GK)', 'Guido Segalerba (CB)', 'Leonel Monti (RM)', 'Marcos Pinto (LM)', 'Santos Bacigalupe (CB)', 'Mauro Bellone (CM)', 'Enzo González (CDM)', 'Pablo Mujica (RM)'], description: 'Compite en Tercera División.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/villa_mitre.png', division: 3 },

  // ==========================================
  // --- BRASIL (BRASILEIRAO A) ---
  // ==========================================
  { id: 'cruzeiro', name: 'Cruzeiro', league: 'Brasileña', dt: 'Artur Jorge', reputation: 4, initialSalary: 4100, marketValue: 81400000, starPlayers: ['Fabrício Bruno (CB)', 'Gerson (CM)', 'Matheus Pereira (CAM)', 'Fagner (RB)', 'Lucas Romero (CDM)', 'Cássio (GK)', 'Wanderson (LW)', 'Matheus Henrique (CM)', 'Walace (CDM)', 'Luis Sinisterra (LW)', 'Matheus Cunha (GK)'], description: 'La Bestia Negra.', badgeColor: 'border-l-4 border-white bg-blue-600 text-white', badgeLogoUrl: '🦊',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cruzeiro/cruzeiro-logo-footylogos.svg', division: 1 },
  { id: 'gremio', themeColor: { primary: '#3b82f6', secondary: '#f5f0e8' }, name: 'Grêmio', league: 'Brasileña', dt: 'Luís Castro', reputation: 4, initialSalary: 4350, marketValue: 42900000, starPlayers: ['Weverton (GK)', 'Cristian Pavón (RW)', 'Martin Braithwaite (ST)', 'Juan Ignacio Nardoni (CM)', 'Walter Kannemann (CB)', 'Arthur (CM)', 'Tetê (RW)', 'Marcos Rocha (RB)', 'Willian (LW)', 'Mathías Villasanti (CDM)', 'Wagner Leonardo (CB)'], description: 'Imortal Tricolor.', badgeColor: 'border-l-4 border-blue-500 bg-slate-900 text-white', badgeLogoUrl: '🔵',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gremio/gremio-logo-footylogos.svg', division: 1 },
  { id: 'palmeiras', name: 'Palmeiras', league: 'Brasileña', dt: 'Abel Ferreira', reputation: 5, initialSalary: 6200, marketValue: 121300000, starPlayers: ['Felipe Anderson (LW)', 'Gustavo Gómez (CB)', 'Vitor Roque (ST)', 'Jhon Arias (RW)', 'Andreas Pereira (CM)', 'José Manuel López (ST)', 'Marcelo Lomba (GK)', 'Murilo (CB)', 'Ramón Sosa (CAM)', 'Paulinho (CAM)', 'Joaquín Piquerez (LB)'], description: 'O Verdão.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🟢',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/palmeiras/palmeiras-logo-footylogos.svg', division: 1 },
  { id: 'botafogo', name: 'Botafogo', league: 'Brasileña', dt: 'Franclim Carvalho', reputation: 4, initialSalary: 4200, marketValue: 75800000, starPlayers: ['Alex Telles (LB)', 'Bastos (CB)', 'Allan (CDM)', 'Edenílson (CM)', 'Neto (GK)', 'Danilo (CM)', 'Marçal (LB)', 'Artur (RW)', 'Arthur Cabral (ST)', 'Alexander Barboza (CB)', 'Joaquín Correa (CAM)'], description: 'O Glorioso.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🌟',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/botafogo/botafogo-logo-footylogos.svg', division: 1 },
  { id: 'fluminense', themeColor: { primary: '#b91c1c', secondary: '#f5f0e8' }, name: 'Fluminense', league: 'Brasileña', dt: 'Luis Zubeldía', reputation: 4, initialSalary: 4300, marketValue: 20450000, starPlayers: ['Luciano Acosta (CAM)', 'Germán Cano (ST)', 'Fábio (GK)', 'Guilherme Arana (LB)', 'Jefferson Savarino (CAM)', 'Otávio (CDM)', 'Yeferson Soteldo (LW)', 'Ganso (CAM)', 'Samuel Xavier (RB)', 'John Kennedy (ST)', 'Matheus Martinelli (CDM)'], description: 'Tricolor das Laranjeiras.', badgeColor: 'border-l-4 border-red-700 bg-green-800 text-white', badgeLogoUrl: '🔴🟢',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fluminense/fluminense-logo-footylogos.svg', division: 1 },
  { id: 'sao_paulo', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'São Paulo', league: 'Brasileña', dt: 'Dorival Júnior', reputation: 4, initialSalary: 4200, marketValue: 47700000, starPlayers: ['Jonathan Calleri (ST)', 'Rafael Tolói (CB)', 'Lucas Moura (RW)', 'Wendell (LB)', 'Oscar (CAM)', 'Pablo Maia (CDM)', 'Rafael (GK)', 'Enzo Díaz (LB)', 'Luciano (ST)', 'Ferreirinha (LW)', 'André Silva (ST)'], description: 'El Tricolor Paulista.', badgeColor: 'border-l-4 border-red-600 bg-white text-black', badgeLogoUrl: '⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sao-paulo/sao-paulo-logo-footylogos.svg', division: 1 },
  { id: 'atletico_mineiro', name: 'Atlético Mineiro', league: 'Brasileña', dt: 'Eduardo Domínguez', reputation: 4, initialSalary: 4400, marketValue: 88400000, starPlayers: ['Hulk (ST)', 'Dudu (LW)', 'Everson (GK)', 'Renan Lodi (LB)', 'Júnior Alonso (CB)', 'Bernard (LW)', 'Vitor Hugo (CB)', 'Gustavo Scarpa (CAM)', 'Ángelo Preciado (RB)', 'Maycon (CM)', 'Mateo Cassierra (ST)'], description: 'O Galo.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🐔',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atletico-mineiro/atletico-mineiro-logo-footylogos.svg', division: 1 },
  { id: 'corinthians', name: 'Corinthians', league: 'Brasileña', dt: 'Fernando Diniz', reputation: 4, initialSalary: 4500, marketValue: 53700000, starPlayers: ['Memphis Depay (CAM)', 'Hugo Souza (GK)', 'Gabriel Paulista (CB)', 'Rodrigo Garro (CAM)', 'Allan (CDM)', 'Matheuzinho (RB)', 'André Ramalho (CB)', 'Yuri Alberto (ST)', 'Matheus Pereira (CM)', 'Jesse Lingard (CAM)', 'Pedro Raul (ST)'], description: 'El Timão.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '⚓',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/corinthians/corinthians-logo-footylogos.svg', division: 1 },
  { id: 'flamengo', name: 'Flamengo', league: 'Brasileña', dt: 'Leonardo Jardim', reputation: 5, initialSalary: 6500, marketValue: 137000000, starPlayers: ['Jorginho (CDM)', 'Lucas Paquetá (CAM)', 'Giorgian de Arrascaeta (CAM)', 'Bruno Henrique (ST)', 'Agustín Rossi (GK)', 'Gonzalo Plata (RW)', 'Samuel Lino (LW)', 'Pedro (ST)', 'Danilo (CB)', 'Everton Cebolinha (LW)', 'Nicolás de la Cruz (CM)'], description: 'El Megaclube de Río.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🔴⚫',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/flamengo/flamengo-logo-footylogos.svg', division: 1 },
  { id: 'internacional', name: 'Internacional', league: 'Brasileña', dt: 'Paulo Pezzolano', reputation: 4, initialSalary: 4400, marketValue: 49400000, starPlayers: ['Sergio Rochet (GK)', 'Alan Patrick (CAM)', 'Rafael Borré (ST)', 'Bruno Tabata (RW)', 'Thiago Maia (CDM)', 'Rodrigo Villagra (CDM)', 'Gabriel Mercado (CB)', 'Bruno Henrique (CM)', 'Félix Torres (CB)', 'Paulinho (CM)', 'Johan Carbonero (LW)'], description: 'O Colorado.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/brazil/1500x1500/internacional.319b9dc2.png', division: 1 },
  { id: 'rb_bragantino', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'RB Bragantino', league: 'Brasileña', dt: 'Pedro Caixinha', reputation: 3, initialSalary: 3000, marketValue: 15000000, starPlayers: ['Juninho Capixaba (LB)', 'Cleiton (GK)', 'Tiago Volpi (GK)', 'Gabriel (CDM)', 'Eduardo Sasha (ST)', 'Fernando (ST)', 'Agustín Sant\'Anna (RB)', 'Pedro Henrique (CB)', 'Guzmán Rodríguez (CB)', 'Eduardo (CB)', 'Bruno Praxedes (CM)'], description: 'Massa Bruta.', badgeColor: 'border-l-4 border-red-600 bg-white text-black', badgeLogoUrl: '🐂',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/rb-bragantino/rb-bragantino-logo-footylogos.svg', division: 1 },
  { id: 'vitoria', name: 'Vitória', league: 'Brasileña', dt: 'Jair Ventura', reputation: 3, initialSalary: 2000, marketValue: 25000000, starPlayers: ['Marinho (RW)', 'Gabriel (GK)', 'Emmanuel Martínez (CAM)', 'Osvaldo (RW)', 'Aitor (CAM)', 'Lucas Arcanjo (GK)', 'Fabrício (ST)', 'Camutanga (CB)', 'Gabriel Baralhas (CDM)', 'Matheuzinho (CAM)', 'Luan Cândido (LB)'], description: 'O Leão da Barra.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🦁',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vitoria/vitoria-logo-footylogos.svg', division: 1 },
  { id: 'vasco_da_gama', name: 'Vasco da Gama', league: 'Brasileña', dt: 'Pedro Emanuel', reputation: 4, initialSalary: 3500, marketValue: 65125000, starPlayers: ['Jair (CDM)', 'Thiago Mendes (CDM)', 'Tchê Tchê (CM)', 'Lucas Piton (LB)', 'Léo Jardim (GK)', 'Paulo Henrique (RB)', 'Robert Renan (CB)', 'Hugo Moura (CDM)', 'Nuno Moreira (RW)', 'Andrés Gómez (LW)', 'David (LW)'], description: 'Gigante da Colina.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚓',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vasco-da-gama/vasco-da-gama-logo-footylogos.svg', division: 1 },
  { id: 'bahia', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Bahia', league: 'Brasileña', dt: 'Rogério Ceni', reputation: 3, initialSalary: 2800, marketValue: 23200000, starPlayers: ['Gilberto (RB)', 'Éverton Ribeiro (CAM)', 'Willian José (ST)', 'Rodrigo Nestor (CM)', 'Iago (LB)', 'Santiago Ramos Mingo (CB)', 'João Paulo (GK)', 'Luciano Juba (LB)', 'Erick (CDM)', 'Kanu (CB)', 'Ademir (RW)'], description: 'Esquadrão de Aço.', badgeColor: 'border-l-4 border-red-600 bg-blue-600 text-white', badgeLogoUrl: '🔵🔴',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bahia/bahia-logo-footylogos.svg', division: 1 },
  { id: 'mirassol', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'Mirassol', league: 'Brasileña', dt: 'Rafael Guanaes', reputation: 2, initialSalary: 1500, marketValue: 6000000, starPlayers: ['Muralha', 'Fernandinho', 'Dellatorre', 'Danielzinho'], description: 'Leão da Alta.', badgeColor: 'border-l-4 border-green-600 bg-yellow-500 text-black', badgeLogoUrl: '🦁',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/brazil/1500x1500/mirassol.5153c341.png', division: 1 },
  { id: 'santos', name: 'Santos', league: 'Brasileña', dt: 'Cuca', reputation: 4, initialSalary: 3800, marketValue: 106550000, starPlayers: ['Neymar (CAM)', 'Gabriel (ST)', 'Zé Rafael (CM)', 'Willian Arão (CDM)', 'Lucas Veríssimo (CB)', 'Luan Peres (CB)', 'Rony (ST)', 'Mayke (RB)', 'Adonis Frías (CB)', 'Benjamín Rollheiser (RW)', 'Gabriel Menino (CM)'], description: 'O Peixe.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '🐟',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/brazil/1500x1500/santos.6d914e21.png', division: 1 },
  { id: 'athletico_pr', name: 'Athletico Paranaense', league: 'Brasileña', dt: 'Odair Hellmann', reputation: 4, initialSalary: 3500, marketValue: 18000000, starPlayers: ['Fernandinho', 'Thiago Heleno', 'Bento', 'Canobbio'], description: 'El Furacão.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🌪️',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/athletico-paranaense/athletico-paranaense-logo-footylogos.svg', division: 1 },
  { id: 'remo', name: 'Clube do Remo', league: 'Brasileña', dt: 'Léo Condé', reputation: 2, initialSalary: 1200, marketValue: 7300000, starPlayers: ['Patrick (CM)', 'Yago Pikachu (RW)', 'Ivan (GK)', 'Víctor Cantillo (CDM)', 'Duplexe Tchamba (CB)', 'Patrick de Paula (CDM)', 'Zé Welison (CDM)', 'Matheus Alexandre (RB)', 'Marllon (CB)', 'Leonel Picco (CDM)', 'Panagiotis Tachtsidis (CDM)'], description: 'Leão Azul.', badgeColor: 'border-l-4 border-white bg-blue-900 text-white', badgeLogoUrl: '🦁',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/brazil/1500x1500/clube-do-remo.7d7d2703.png', division: 1 },
  { id: 'coritiba', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'Coritiba', league: 'Brasileña', dt: 'Fernando Seabra', reputation: 3, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Rodrigo Moledo (CB)', 'Keno (LW)', 'Maicon (CB)', 'Josué (CAM)', 'Breno (LW)', 'Keiller (GK)', 'Sebastián Gómez (CM)', 'Pedro Rocha (LW)', 'Tinga (RB)', 'Fernando Sobral (CM)', 'Thiago Santos (CB)'], description: 'Coxa-Branca.', badgeColor: 'border-l-4 border-green-600 bg-white text-black', badgeLogoUrl: '🟢⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/coritiba/coritiba-logo-footylogos.svg', division: 1 },
  { id: 'chapecoense', name: 'Chapecoense', league: 'Brasileña', dt: 'Rafael Lacerda', reputation: 3, initialSalary: 1800, marketValue: 9000000, starPlayers: ['Jean Carlos (CAM)', 'Yannick Bolasie (ST)', 'Bruno Pacheco (LB)', 'Higor Meritão (CDM)', 'Walter Clar (LB)', 'Rafael Thyere (CB)', 'Giovanni Augusto (CAM)', 'Robert Santos (CAM)', 'Maurício Garcez (LW)', 'Ênio (LW)', 'Neto Pessoa (ST)'], description: 'El Huracán del Oeste.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🏹',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/chapecoense/chapecoense-logo-footylogos.svg', division: 1 },

  // ==========================================
  // --- BRASIL (BRASILEIRAO B) ---
  // ==========================================
  { id: 'juventude', name: 'Juventude', league: 'Brasileña', dt: 'Jair Ventura', reputation: 2, initialSalary: 900, marketValue: 5500000, starPlayers: ['Alan Kardec (ST)', 'Manuel Castro (RW)', 'Jandrei (GK)', 'Messias (CB)', 'Titi (CB)', 'Rodrigo Sam (CB)', 'Marcos Paulo (LW)', 'Nathan (RB)', 'Alan Ruschel (LB)', 'Alisson Safira (ST)', 'Lucas Mineiro (CDM)'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🟢',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/juventude/juventude-logo-footylogos.svg', division: 2 },
  { id: 'fortaleza_br', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Fortaleza', league: 'Brasileña', dt: 'Juan Pablo Vojvoda', reputation: 3, initialSalary: 1500, marketValue: 5450000, starPlayers: ['Tomás Pochettino (CAM)', 'João Ricardo (GK)', 'Tomás Cardona (CB)', 'Emanuel Brítez (CB)', 'Vitinho (RW)', 'Lucas Crispim (CAM)', 'Maílton (RB)', 'Gabriel Fuentes (LB)', 'Lucas Sasha (CDM)', 'Gazal (CB)', 'Brenno (GK)'], description: 'Descendido sorpresivamente en el mod.', badgeColor: 'border-l-4 border-red-600 bg-blue-800 text-white', badgeLogoUrl: '🦁',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fortaleza/fortaleza-logo-footylogos.svg', division: 2 },
  { id: 'ceara', name: 'Ceará', league: 'Brasileña', dt: 'Léo Condé', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Erick Pulga', 'Lourenço', 'Aylon', 'Richard'], description: 'O Vozão.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚫',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Cear%C3%A1_Sporting_Club_logo.svg/250px-Cear%C3%A1_Sporting_Club_logo.svg.png', division: 2 },
  { id: 'sport_recife', name: 'Sport Recife', league: 'Brasileña', dt: 'Pepa', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Lucas Lima', 'Zé Roberto', 'Fabricio Domínguez', 'Caíque França'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🦁',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sport-recife/sport-recife-logo-footylogos.svg', division: 2 },
  { id: 'america_mineiro', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'América Mineiro', league: 'Brasileña', dt: 'Lisca', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Juninho', 'Benítez', 'Elias', 'Ricardo Silva'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-green-600 bg-black text-white', badgeLogoUrl: '🐰',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/america-mineiro/america-mineiro-logo-footylogos.svg', division: 2 },
  { id: 'cuiaba', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Cuiabá', league: 'Brasileña', dt: 'Bernardo Franco', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['João Basso (CB)', 'Pepê (CM)', 'Raul (CDM)', 'Alan Empereur (CB)', 'Marcelo Carné (GK)', 'Marlon (LB)', 'Gabriel (CB)', 'João Carlos (GK)', 'Railan (RB)', 'Yamil Asad (LW)', 'Rodrigo Rodrigues (ST)'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-yellow-500 bg-green-600 text-white', badgeLogoUrl: '🔰',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cuiaba/cuiaba-logo-footylogos.svg', division: 2 },
  { id: 'atletico_goianiense', name: 'Atlético Goianiense', league: 'Brasileña', dt: 'Umberto Louzer', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Luiz Fernando', 'Shaylon', 'Ronaldo', 'Alix Vinicius'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🐉',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atletico-goianiense/atletico-goianiense-logo-footylogos.svg', division: 2 },
  { id: 'novorizontino', name: 'Novorizontino', league: 'Brasileña', dt: 'Eduardo Baptista', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Jean Lucas (GK)', 'Leo Naldi (CDM)', 'Rômulo (CAM)', 'Robson (RW)', 'Christian Ortíz (CAM)', 'Jordi (GK)', 'Jhilmar Lora (RB)', 'Luís Oyama (CDM)', 'Matheus Bianqui (CM)', 'Nilson Castrillón (RB)', 'Carlinhos (CB)'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '🐯',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/brazil/1500x1500/novorizontino.0d158590.png', division: 2 },
  { id: 'goias', name: 'Goiás', league: 'Brasileña', dt: 'Vágner Mancini', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Tadeu (GK)', 'Juninho (CDM)', 'Lucas Lima (CAM)', 'Wellington Rato (RW)', 'Rodrigo (RB)', 'Luiz Felipe (CB)', 'João Paulo Lourenço (CM)', 'Nicolas (LB)', 'Filipe Machado (CDM)', 'Anselmo Ramon (ST)', 'Ramon Menezes (CB)'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🟢',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/goias/goias-logo-footylogos.svg', division: 2 },
  { id: 'criciuma', name: 'Criciúma', league: 'Brasileña', dt: 'Cláudio Tencati', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Fellipe Mateus (CAM)', 'Bruno Alves (CB)', 'Rodrigo (CB)', 'Jean (CDM)', 'Romarinho (RW)', 'Romulo Otero (CAM)', 'Alisson (GK)', 'Luciano Castán (CB)', 'Waguininho (LW)', 'César Martins (CB)', 'Marcelo Hermes (LB)'], description: 'O Tigre.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '🐯',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/criciuma/criciuma-logo-footylogos.svg', division: 2 },
  { id: 'crb', name: 'CRB', league: 'Brasileña', dt: 'Hélio dos Anjos', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Bressan (CB)', 'Danielzinho (CAM)', 'Luiz Phellype (ST)', 'Lucas Lovat (LB)', 'Pedro Castro (CM)', 'Douglas Baggio (RW)', 'Diogo Hereda (RB)', 'Henri (CB)', 'Guilherme Pato (LW)', 'Fábio Alemão (CB)', 'Vitor Caetano (GK)'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/crb/crb-logo-footylogos.svg', division: 2 },
  { id: 'operario', name: 'Operário', league: 'Brasileña', dt: 'Rafael Guanaes', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Gabriel Boschilia (CAM)', 'Pablo (ST)', 'Juan Pablo Zuluaga (CM)', 'Ademilson (ST)', 'Matheus Trindade (CDM)', 'Vagner (GK)', 'Edwin Torres (RM)', 'Klaus (CB)', 'José Cuenú (CB)', 'Aylon (ST)', 'Pedro Vilhena (CM)'], description: 'O Fantasma.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '👻',
    badgeImageUrl: operarioBadge, division: 2 },
  { id: 'vila_nova', name: 'Vila Nova', league: 'Brasileña', dt: 'Thiago Carvalho', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Helton Leite (GK)', 'Anderson Jesus (CB)', 'Marquinhos Gabriel (CAM)', 'Caio Marcelo (CB)', 'Rafa Silva (ST)', 'Dellatorre (ST)', 'Tiago Pagnussat (CB)', 'Janderson (RW)', 'Hayner (RB)', 'André Luís (RW)', 'Emerson Urso (LW)'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🐯',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vila-nova/vila-nova-logo-footylogos.svg', division: 2 },
  { id: 'avai', name: 'Avaí', league: 'Brasileña', dt: 'Enderson Moreira', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Rafael Bilu (RW)', 'Daniel Penha (CAM)', 'Mateus Quaresma (LB)', 'Allyson (CB)', 'Zé Ricardo (CDM)', 'Wesley Gasolina (RB)', 'Cristiano (RM)', 'Felipe Avenatti (ST)', 'Léo Aragão (GK)', 'Wenderson (CM)', 'Nicolas Cabral (CB)'], description: 'Leão da Ilha.', badgeColor: 'border-l-4 border-white bg-blue-600 text-white', badgeLogoUrl: '🦁',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/brazil/1500x1500/avai.a993e9d9.png', division: 2 },
  { id: 'botafogo_sp', name: 'Botafogo FC', league: 'Brasileña', dt: 'Paulo Gomes', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['João Carlos', 'Fábio Sanches', 'Bochecha', 'Alexandre Jesus'], description: 'Botafogo de Ribeirão Preto.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/botafogo/botafogo-logo-footylogos.svg', division: 2 },
  { id: 'athletic_club', name: 'Athletic Club', league: 'Brasileña', dt: 'DT Genérico', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Jefferson', 'Danilo Cardoso', 'Yuri', 'Jonathas'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '⚫',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/brazil/1500x1500/athletic.24a45d88.png', division: 2 },
  { id: 'londrina', name: 'Londrina', league: 'Brasileña', dt: 'Claudinei Oliveira', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Gilberto (ST)', 'Mauricio Kozlinski (GK)', 'Wallace (CB)', 'Thalis (CAM)', 'Lucas Marques (CDM)', 'Iago Teles (LW)', 'Luan Ribeiro (GK)', 'Paulinho Moccelin (LW)', 'Kevyn (LB)', 'Bruno Santos (ST)', 'André Luiz (CDM)'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-white bg-sky-400 text-white', badgeLogoUrl: '🩵',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/londrina/londrina-logo-footylogos.svg', division: 2 },
  { id: 'ponte_preta', name: 'Ponte Preta', league: 'Brasileña', dt: 'Nelsinho Baptista', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Lucas Cunha (CB)', 'Jonathan Cafú (RW)', 'William Pottker (RW)', 'David Braz (CB)', 'Rodrigo Saravia (CDM)', 'Élvis (CAM)', 'Brandão (ST)', 'Diogo Silva (GK)', 'Kevyson (LB)', 'David da Hora (LW)', 'Luís Phelipe (LW)'], description: 'Macaca.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '🐒',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ponte-preta/ponte-preta-logo-footylogos.svg', division: 2 },
  { id: 'sao_bernardo', name: 'Sao Bernardo', league: 'Brasileña', dt: 'Ricardo Catalá', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Pablo (CB)', 'Jemerson (CB)', 'Hyoran (CAM)', 'Lucas Fernandes (CAM)', 'Rodrigo Andrade (CDM)', 'Fabrício Daniel (RW)', 'Luizão (CB)', 'Júnior Urso (CDM)', 'Pará (LB)', 'Pablo Dyego (RB)', 'Marcão (CDM)'], description: 'Compite en Brasileirao B.', badgeColor: 'border-l-4 border-black bg-yellow-500 text-black', badgeLogoUrl: '🟡',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sao-bernardo/sao-bernardo-logo-footylogos.svg', division: 2 },
  { id: 'nautico', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Nautico', league: 'Brasileña', dt: 'Marquinhos Santos', reputation: 2, initialSalary: 900, marketValue: 3000000, starPlayers: ['Muriel (GK)', 'Auremir (CDM)', 'Leonai (CDM)', 'Mateus Silva (CB)', 'Felipe Cardoso (CAM)', 'Dodô (CAM)', 'Vinícius (LW)', 'Gastón Guruceaga (GK)', 'Wanderson (CB)', 'Paulo Sérgio (ST)', 'Igor Fernandes (LB)'], description: 'O Timbu.', badgeColor: 'border-l-4 border-red-600 bg-white text-red-600', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/nautico/nautico-logo-footylogos.svg', division: 2 },
  // ==========================================
  // --- MEXICO (LIGA MX Y EXPANSIÓN) ---
  // ==========================================
  { id: 'america_mex', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'América', league: 'Mexicana', dt: 'Guillermo Almada', reputation: 5, initialSalary: 4500, marketValue: 24000000, starPlayers: ['Raphael Veiga (CAM)', 'Alejandro Zendejas (RW)', 'Brian Rodríguez (LW)', 'Israel Reyes (CB)', 'Sebastián Cáceres (CB)', 'Luis Malagón (GK)', 'Rodrigo Dourado (CDM)', 'Víctor Dávila (ST)', 'Cristián Borja (LB)', 'Jonathan dos Santos (CDM)', 'Henry Martín (ST)'], description: 'Las Águilas del Estadio Azteca.', badgeColor: 'border-l-4 border-yellow-400 bg-blue-900 text-yellow-200', badgeLogoUrl: '🦅',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Americas_on_the_globe_%28red%29.svg', division: 1 },
  { id: 'monterrey', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Monterrey', league: 'Mexicana', dt: 'Matías Almeyda', reputation: 5, initialSalary: 4200, marketValue: 22000000, starPlayers: ['Sergio Canales (RM)', 'Lucas Ocampos (LW)', 'Óliver Torres (CAM)', 'Anthony Martial (ST)', 'Luca Orellano (LM)', 'Uros Djurdjevic (ST)', 'Jesús Corona (RW)', 'Santiago Mele (GK)', 'Víctor Guzmán (CB)', 'Fidel Ambríz (CDM)', 'Stefan Medina (CB)'], description: 'Rayados.', badgeColor: 'border-l-4 border-blue-600 bg-white text-blue-900', badgeLogoUrl: '🔵',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/monterrey/monterrey-logo-footylogos.svg', division: 1 },
  { id: 'tigres', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Tigres U.A.N.L.', league: 'Mexicana', dt: 'Guido Pizarro', reputation: 5, initialSalary: 4300, marketValue: 23000000, starPlayers: ['Ángel Correa (ST)', 'Nahuel Guzmán (GK)', 'Diego Lainez (RW)', 'Juan Brunetta (CAM)', 'Fernando Gorriarán (CDM)', 'Joaquim (CB)', 'Rodrigo Aguirre (ST)', 'André-Pierre Gignac (ST)', 'Jesús Angulo (CB)', 'Rômulo (CDM)', 'Jesús Garza (RB)'], description: 'Los Felinos.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-900 text-yellow-300', badgeLogoUrl: '🐯',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/tigres-uanl/tigres-uanl-logo-footylogos.svg', division: 1 },
  { id: 'cruz_azul', name: 'Cruz Azul', league: 'Mexicana', dt: 'Joel Huiqui', reputation: 5, initialSalary: 3800, marketValue: 18000000, starPlayers: ['José Paradela (CAM)', 'Willer Ditta (CB)', 'Erik Lira (CDM)', 'Agustín Palavecino (CM)', 'Carlos Rodríguez (CM)', 'Kevin Mier (GK)', 'Carlos Rotondi (LM)', 'Gabriel Fernández (ST)', 'Nicolás Ibáñez (ST)', 'Gonzalo Piovi (CB)', 'Jeremy Márquez (CM)'], description: 'La Máquina.', badgeColor: 'border-l-4 border-white bg-blue-700 text-white', badgeLogoUrl: '🚂',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cruz-azul/cruz-azul-logo-footylogos.svg', division: 1 },
  { id: 'pumas', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Pumas U.N.A.M.', league: 'Mexicana', dt: 'Gustavo Lema', reputation: 4, initialSalary: 3500, marketValue: 16000000, starPlayers: ['Keylor Navas (GK)', 'Álvaro Angulo (LB)', 'Adalberto Carrasquilla (CM)', 'Nathan Silva (CB)', 'Pedro Vite (CM)', 'Uriel Antuna (RM)', 'Juninho Vieira (ST)', 'Rubén Duarte (CB)', 'Guillermo Martínez (ST)', 'Robert Morales (ST)', 'Leonardo Suárez (RM)'], description: 'Los Universitarios.', badgeColor: 'border-l-4 border-yellow-500 bg-blue-900 text-yellow-400', badgeLogoUrl: '🐾',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/pumas-unam/pumas-unam-logo-footylogos.svg', division: 1 },
  { id: 'chivas', name: 'Guadalajara', league: 'Mexicana', dt: 'Hernán Crespo', reputation: 5, initialSalary: 4000, marketValue: 20000000, starPlayers: ['Raúl Rangel (GK)', 'Roberto Alvarado (RM)', 'Armando González (ST)', 'Luis Romo (CDM)', 'Richard Ledezma (RB)', 'Bryan González (LB)', 'Efraín Álvarez (LM)', 'Brian Gutiérrez (CAM)', 'Diego Campillo (CB)', 'Ángel Sepúlveda (ST)', 'Daniel Aguirre (CB)'], description: 'El Rebaño Sagrado.', badgeColor: 'border-l-4 border-white bg-red-600 text-white', badgeLogoUrl: '🐐',
    badgeImageUrl: 'badges/tm/chivas.png', division: 1 },
  { id: 'toluca', name: 'Toluca', league: 'Mexicana', dt: 'Antonio Mohamed', reputation: 4, initialSalary: 3500, marketValue: 15000000, starPlayers: ['Paulinho (ST)', 'Alexis Vega (LW)', 'Federico Pereira (CB)', 'Marcel Ruiz (CM)', 'Jesús Gallardo (LB)', 'Helinho (RM)', 'Nicolás Castro (CM)', 'Jesús Angulo (CAM)', 'Santiago Simón (CM)', 'Bruno Méndez (CB)', 'Franco Romero (CDM)'], description: 'Los Diablos Rojos.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '😈',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/toluca/toluca-logo-footylogos.svg', division: 1 },
  { id: 'pachuca', name: 'Pachuca', league: 'Mexicana', dt: 'Benjamín Mora', reputation: 4, initialSalary: 3200, marketValue: 14000000, starPlayers: ['Oussama Idrissi (LW)', 'Enner Valencia (ST)', 'Salomón Rondón (ST)', 'Elías Montiel (CM)', 'William Carvalho (CDM)', 'Carlos Moreno (GK)', 'Eduardo Bauermann (CB)', 'Sergio Barreto (CB)', 'Víctor Guzmán (CAM)', 'Kenedy (LM)', 'Luis Quiñones (RM)'], description: 'Los Tuzos.', badgeColor: 'border-l-4 border-white bg-blue-900 text-white', badgeLogoUrl: '🐿️',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/pachuca/pachuca-logo-footylogos.svg', division: 1 },
  { id: 'leon', name: 'León', league: 'Mexicana', dt: 'Javier Gandolfi', reputation: 4, initialSalary: 3000, marketValue: 13000000, starPlayers: ['Diber Cambindo (ST)', 'Rodrigo Echeverría (CM)', 'Ismael Díaz (LW)', 'Sebastián Vegas (CB)', 'Salvador Reyes (LB)', 'Rogelio Funes Mori (ST)', 'Óscar García (GK)', 'Jordi Cortizo (LM)', 'Stiven Barreiro (CB)', 'Juan Domínguez (RM)', 'Fernando Beltrán (CDM)'], description: 'La Fiera.', badgeColor: 'border-l-4 border-white bg-green-600 text-white', badgeLogoUrl: '🦁',
    badgeImageUrl: 'badges/tm/leon.png', division: 1 },
  { id: 'atlas', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Atlas', league: 'Mexicana', dt: 'Beñat San José', reputation: 3, initialSalary: 2500, marketValue: 10000000, starPlayers: ['Camilo Vargas', 'Aldo Rocha', 'Hugo Nervo', 'Eduardo Aguirre'], description: 'Los Zorros.', badgeColor: 'border-l-4 border-red-600 bg-black text-white', badgeLogoUrl: '🦊',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atlas/atlas-logo-footylogos.svg', division: 1 },
  { id: 'santos_laguna', name: 'Santos Laguna', league: 'Mexicana', dt: 'Renato Paiva', reputation: 3, initialSalary: 2500, marketValue: 10000000, starPlayers: ['Carlos Acevedo (GK)', 'Ezequiel Bullaude (CAM)', 'Lucas Di Yorio (ST)', 'Kevin Balanta (CB)', 'Carlos Gruezo (CDM)', 'Javier Güemez (CDM)', 'Choco Lozano (ST)', 'Bruno Amione (CB)', 'Cristian Dájome (RM)', 'Fran Villalba (RM)', 'Ramiro Sordo (LW)'], description: 'Los Guerreros.', badgeColor: 'border-l-4 border-white bg-green-700 text-white', badgeLogoUrl: '👼',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/santos-laguna/santos-laguna-logo-footylogos.svg', division: 1 },
  { id: 'tijuana', name: 'Club Tijuana', league: 'Mexicana', dt: 'Sebastián Abreu', reputation: 3, initialSalary: 2400, marketValue: 9500000, starPlayers: ['Carlos González', 'Christian Rivera', 'Kevin Castañeda', 'Joe Corona'], description: 'Xolos.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🐕',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/club-tijuana/club-tijuana-logo-footylogos.svg', division: 1 },
  { id: 'puebla', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'Puebla', league: 'Mexicana', dt: 'Gerardo Espinoza', reputation: 3, initialSalary: 2200, marketValue: 8500000, starPlayers: ['Emiliano Gómez (ST)', 'Julio González (GK)', 'Juan Pablo Vargas (CB)', 'Nicolás Díaz (CB)', 'Edgar Guerra (RM)', 'Lucas Cavallini (ST)', 'Ángelo Araos (CAM)', 'Daniel Gutiérrez (GK)', 'Kevin Velasco (LM)', 'Alejandro Organista (CM)', 'Brayan Garnica (RM)'], description: 'La Franja.', badgeColor: 'border-l-4 border-sky-400 bg-white text-slate-900', badgeLogoUrl: '🎽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/puebla/puebla-logo-footylogos.svg', division: 1 },
  { id: 'queretaro', name: 'Querétaro', league: 'Mexicana', dt: 'Esteban González', reputation: 3, initialSalary: 2000, marketValue: 7500000, starPlayers: ['Santiago Homenchenko (CDM)', 'Jhojan Julio (LM)', 'Lucas Abascia (CB)', 'Francisco Venegas (LB)', 'Mateo Coronel (ST)', 'Diego Reyes (CB)', 'Pablo Barrera (RM)', 'Guillermo Allison (GK)', 'Lucas Rodríguez (LM)', 'Alí Ávila (ST)', 'Jaime Gómez (RB)'], description: 'Los Gallos Blancos.', badgeColor: 'border-l-4 border-black bg-blue-800 text-white', badgeLogoUrl: '🐓',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/queretaro-fc/queretaro-fc-logo-footylogos.svg', division: 1 },
  { id: 'mazatlan', name: 'Mazatlán FC', league: 'Mexicana', dt: 'Ismael Rescalvo', reputation: 3, initialSalary: 2000, marketValue: 7500000, starPlayers: ['Yoel Bárcenas (LM)', 'Lucas Merolla (CB)', 'Facundo Almada (CB)', 'Dudu (RW)', 'Ricardo Rodríguez (GK)', 'Jair Díaz (CB)', 'Jordan Sierra (CM)', 'José Esquivel (CDM)', 'Mauro Laínez (LM)', 'Josué Ovalle (RW)', 'Fábio (ST)'], description: 'Los Cañoneros.', badgeColor: 'border-l-4 border-white bg-purple-800 text-white', badgeLogoUrl: '⚓',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/mazatlan-fc/mazatlan-fc-logo-footylogos.svg', division: 1 },
  { id: 'necaxa', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Necaxa', league: 'Mexicana', dt: 'Martín Varini', reputation: 3, initialSalary: 2000, marketValue: 7500000, starPlayers: ['Ezequiel Unsain (GK)', 'Lorenzo Faravelli (CM)', 'Julián Carranza (ST)', 'Alexis Peña (CB)', 'Agustín Almendra (CM)', 'Javier Ruiz (RW)', 'Agustín Oliveros (CB)', 'Cristian Calderón (LB)', 'Kevin Rosero (RM)', 'Tomás Badaloni (ST)', 'Emilio Lara (RB)'], description: 'Los Rayos.', badgeColor: 'border-l-4 border-red-600 bg-white text-slate-900', badgeLogoUrl: '⚡',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/necaxa/necaxa-logo-footylogos.svg', division: 1 },
  { id: 'juarez', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'FC Juárez', league: 'Mexicana', dt: 'Pedro Caixinha', reputation: 3, initialSalary: 2000, marketValue: 7500000, starPlayers: ['Sebastián Jurado', 'Denzell García', 'Dieter Villalpando', 'Avilés Hurtado'], description: 'Bravos.', badgeColor: 'border-l-4 border-red-600 bg-green-600 text-white', badgeLogoUrl: '🐎',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-juarez/fc-juarez-logo-footylogos.svg', division: 1 },
  { id: 'san_luis', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Atlético de San Luis', league: 'Mexicana', dt: 'Diego Mejía', reputation: 3, initialSalary: 2200, marketValue: 8500000, starPlayers: ['Vitinho', 'Javier Güémez', 'Cata Domínguez', 'Franck Boli'], description: 'Los Potosinos.', badgeColor: 'border-l-4 border-red-600 bg-white text-slate-900', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atletico-san-luis/atletico-san-luis-logo-footylogos.svg', division: 1 },
  { id: 'atlante', name: 'Atlante', league: 'Mexicana', dt: 'Miguel Herrera', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Christian Bermúdez (CAM)', 'Luis Calzadilla (RM)', 'Illian Hernández (ST)', 'Hardy Meza (CDM)', 'Luis Olivas (CB)', 'Diego Cruz (CB)', 'Armando Escobar (LW)', 'Maximiliano García (CM)', 'Ronaldo González (CM)', 'Johan Alonzo (RW)', 'Axl Padilla (RB)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/mexico/1500x1500/atlante.6ff8e8c1.png', division: 2 },
  { id: 'venados_fc', name: 'Venados FC', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Juan José Calero (ST)', 'Santiago Ramírez (GK)', 'Adolfo Domínguez (CDM)', 'Sleyther Lora (RW)', 'Jonathan Martínez (CAM)', 'Mario Trejo (CB)', 'Duilio Tejeda (RW)', 'Néstor Vidrio (CB)', 'Javier Casillas (RB)', 'Lanchi (RB)', 'Paul Galván (CDM)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/mexico/1500x1500/venados-fc.aaf1e420.png', division: 2 },
  { id: 'jaiba_brava', name: 'Jaiba Brava', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Antonio Portales (CB)', 'Sergio Flores (CDM)', 'Diego García (RB)', 'Edson Torres (CAM)', 'Michell Rodríguez (RW)', 'José Guadalupe Hernández (LB)', 'Luis Razo (ST)', 'Deivoon Magaña (RM)', 'José Peralta (RW)', 'Alonso Escoboza (LB)', 'Miguel Pedroza (ST)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/mexico/1500x1500/jaiba-brava.9ec5ccc3.png', division: 2 },
  { id: 'morelia', name: 'Morelia', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Alejandro Andrade (CDM)', 'Brian Figueroa (CAM)', 'Brayton Vázquez (CB)', 'Arturo Palma (LW)', 'Jaziel Martínez (CM)', 'Damián Torres (CM)', 'Rubén Del Campo (ST)', 'Misael Domínguez (CAM)', 'Diego Gallegos (LB)', 'Zahid Muñoz (CAM)', 'Alonso Flores (ST)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 2 },
  { id: 'irapuato', name: 'Irapuato', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Ventura Alvarado (CB)', 'Elbis (LB)', 'Benjamín Sánchez (ST)', 'Humberto Hernández (GK)', 'Ricardo Peña (RB)', 'Gabriel Martínez (CB)', 'Raúl Sandoval (LB)', 'Juan Gamboa (RM)', 'Juan Rangel (CAM)', 'Julio Doldán (ST)', 'Jesse Zamudio (CM)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/mexico/1500x1500/irapuato.2f65bbb2.png', division: 2 },
  { id: 'la_paz', name: 'La Paz', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Daniel Álvarez (LM)', 'Gil Alcalá (GK)', 'Martín Barragán (ST)', 'Carlos Robles (CB)', 'Fernando Illescas (CAM)', 'Gilberto García (CDM)', 'Jonathan Estrada (GK)', 'Horacio Torres (CB)', 'Ivo Vázquez (LB)', 'Jordi Ferrer (ST)', 'Ulises Zurita (RB)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/la_paz.png', division: 2 },
  { id: 'leones_negros', name: 'Leones Negros', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Carlos Cisneros (LW)', 'Carlos Fierro (LW)', 'Jonathan Sánchez (CB)', 'Jesús Brígido (LW)', 'Felipe López (GK)', 'Juan de Dios Aguayo (CB)', 'Arturo Ledesma (CB)', 'Sergio Hernández (CAM)', 'Alejandro Bravo (CM)', 'Joél Pérez (LW)', 'Édson Rivera (ST)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/leones_fc.png', division: 2 },
  { id: 'tapatio', name: 'Tapatio', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Vladimir Moragrega (ST)', 'Sergio Aguayo (ST)', 'Leonardo Jiménez (RB)', 'Jorge Guzmán (LB)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/mexico/1500x1500/tapatio.fd51455a.png', division: 2 },
  { id: 'mineros', name: 'Mineros', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/mineros.png', division: 2 },
  { id: 'correcaminos', name: 'Correcaminos', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Ronaldo Prieto (LM)', 'Walter Ortega (RB)', 'Emanuel Torres (CDM)', 'Alan Di Pippa (CDM)', 'Nahúm Gómez (RW)', 'Gerardo Moreno (CDM)', 'Édson Reséndez (GK)', 'Ricardo Galindo (CB)', 'Andrés Catalán (LB)', 'Tomás Sandoval (ST)', 'Fabián Salas (RW)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/correcaminos.png', division: 2 },
  { id: 'dorados', name: 'Dorados', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Salvador Manríquez (CB)', 'Édson Gutiérrez (RB)', 'Josué Reyes (CB)', 'Luis García (LW)', 'Emilio Sánchez (CM)', 'César Leyva (LM)', 'Luis Ruiz (CB)', 'Dylan Guajardo (CDM)', 'José Castro (GK)', 'David Osuna (CB)', 'Carlos Higuera (GK)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/dorados.png', division: 2 },
  { id: 'tepatitlan', name: 'Tepatitlan', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Jesús Venegas (CDM)', 'Josué Gómez (LW)', 'Gustavo Gutiérrez (GK)', 'Idekel Domínguez (RB)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/mexico/1500x1500/tepatitlan-fc.f288c94b.png', division: 2 },
  { id: 'tlaxcala', name: 'Tlaxcala', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Ismael Govea (RB)', 'Jordan Silva (CB)', 'Pablo González (CM)', 'Tony Figueroa (RM)', 'Christian (ST)', 'Andrés Iniestra (CM)', 'Giovani Hernández (CAM)', 'Gabino Espinoza (GK)', 'Edson Santos (LB)', 'Salomón Obama Ondo (RW)', 'Juan Blanco (LW)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/mexico/1500x1500/tlaxcala-fc.f4507bcc.png', division: 2 },
  { id: 'cancun_fc', name: 'Cancun FC', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['José Rodríguez (ST)', 'Leonel López (CM)', 'Daniel Guillén (CB)', 'Christopher Trejo (ST)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/mexico/1500x1500/cancun-fc.515cc407.png', division: 2 },
  { id: 'alebrijes', name: 'Alebrijes', league: 'Mexicana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3000000, starPlayers: ['Kristian Álvarez (CB)', 'Héctor Mascorro (RM)', 'Fernando Morales (CM)', 'Aldo Arellano (CDM)', 'Julio Cruz (ST)', 'David Ayala (CM)', 'Bubakarry Fadika (LW)', 'Jair Cortés (CDM)', 'Harold Vázquez (RB)', 'Oscar González (GK)', 'Alfonso Tamay (RW)'], description: 'Liga de Expansión MX.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/alebrijes.png', division: 2 },

  // ==========================================
  // --- CHILE (PRIMERA Y PRIMERA B) ---
  // ==========================================
  { id: 'colocolo', name: 'Colo-Colo', league: 'Chilena', dt: 'Jorge Almirón', reputation: 4, initialSalary: 2300, marketValue: 16000000, starPlayers: ['Claudio Aquino (CAM)', 'Álvaro Madrid (CM)', 'Arturo Vidal (CM)', 'Javier Méndez (CB)', 'Javier Correa (ST)', 'Fernando De Paul (GK)', 'Felipe Méndez (CDM)', 'Maximiliano Romero (ST)', 'Tomás Alarcón (CDM)', 'Matías Fernández (RB)', 'Jonathan Villagra (CB)'], description: 'El Cacique.', badgeColor: 'border-l-4 border-white bg-black text-white', badgeLogoUrl: '🏁',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/colo-colo/colo-colo-logo-footylogos.svg', division: 1 },
  { id: 'u_chile', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Universidad de Chile', league: 'Chilena', dt: 'Gustavo Álvarez', reputation: 4, initialSalary: 2000, marketValue: 13000000, starPlayers: ['Leandro Fernández', 'Charles Aránguiz', 'Matías Zaldivia', 'Marcelo Díaz'], description: 'La U.', badgeColor: 'border-l-4 border-red-600 bg-blue-900 text-white', badgeLogoUrl: '🦉',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/universidad-de-chile/universidad-de-chile-logo-footylogos.svg', division: 1 },
  { id: 'u_catolica', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Universidad Católica', league: 'Chilena', dt: 'Tiago Nunes', reputation: 4, initialSalary: 2100, marketValue: 14000000, starPlayers: ['Fernando Zampedri', 'Eugenio Mena', 'César Pinares', 'Thomas Gillier'], description: 'Los Cruzados.', badgeColor: 'border-l-4 border-blue-600 bg-white text-slate-900', badgeLogoUrl: '🛡️',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/universidad-catolica/universidad-catolica-logo-footylogos.svg', division: 1 },
  { id: 'palestino', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Palestino', league: 'Chilena', dt: 'Pablo Sánchez', reputation: 3, initialSalary: 1500, marketValue: 7000000, starPlayers: ['Joe Abrigo (CAM)', 'Fernando Meza (CB)', 'Bryan Carrasco (RW)', 'Sebastián Pérez (GK)', 'Julián Fernández (CDM)', 'Jonathan Benítez (LW)', 'Dilan Zúñiga (LB)', 'César Munder (LW)', 'Enzo Roco (CB)', 'Ronnie Fernández (ST)', 'Ariel Martínez (CM)'], description: 'Los Árabes.', badgeColor: 'border-l-4 border-red-600 bg-green-700 text-white', badgeLogoUrl: '🇵🇸',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/palestino/palestino-logo-footylogos.svg', division: 1 },
  { id: 'coquimbo_unido', name: 'Coquimbo Unido', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Alejandro Camargo (CDM)', 'Rodrigo Holgado (ST)', 'Diego Sánchez (GK)', 'Lucas Pratto (ST)', 'Benjamín Gazzolo (CB)', 'Manuel Fernández (CB)', 'Dylan Glaby (CDM)', 'Cristián Zavala (RW)', 'Matías Fracchia (CB)', 'Dylan Escobar (RB)', 'Salvador Cordero (CDM)'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/coquimbo-unido/coquimbo-unido-logo-footylogos.svg', division: 1 },
  { id: 'cobresal', name: 'Cobresal', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Steffan Pino (ST)', 'Franco Frías (ST)', 'Jorge Pinos (GK)', 'César Yanis (RW)', 'Bryan Carvallo (CAM)', 'Julián Brea (RW)', 'Guillermo Pacheco (RB)', 'Juan Fuentes (CDM)', 'Esteban Valencia (CM)', 'José Tiznado (CB)', 'Franco Bechtholdt (CB)'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cobresal/cobresal-logo-footylogos.svg', division: 1 },
  { id: 'everton', name: 'Everton', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 83400, marketValue: 433750000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/everton/everton-logo-footylogos.svg', division: 1 },
  { id: 'unión_la_calera', name: 'Unión La Calera', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Kevin Méndez (RW)', 'Daniel Gutiérrez (CB)', 'Juan Requena (CDM)', 'Sebastián Sáez (ST)', 'Yerko Leiva (CM)', 'Camilo Moya (CDM)', 'Nicolás Avellaneda (GK)', 'Rodrigo Cáseres (CB)', 'Cristián Gutiérrez (LB)', 'Bayron Oyarzo (RW)', 'Francisco Pozzo (ST)'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/union-la-calera/union-la-calera-logo-footylogos.svg', division: 1 },
  { id: 'huachipato', name: 'Huachipato', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Cris Martínez (LW)', 'Rafael Caroca (CB)', 'Nicolás Vargas (CB)', 'Santiago Silva (CM)', 'Ezequiel Cañete (CM)', 'Lionel Altamirano (ST)', 'Rodrigo Odriozola (GK)', 'Maximiliano Rodríguez Vejar (ST)', 'Claudio Sepúlveda (CDM)', 'Renzo Malanca (CB)', 'Benjamín Mellado (CB)'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/huachipato/huachipato-logo-footylogos.svg', division: 1 },
  { id: 'ñublense', name: 'Ñublense', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Gabriel Graciani (RM)', 'Nicola Pérez (GK)', 'Lorenzo Reyes (CDM)', 'Ignacio Jeraldino (ST)', 'Franco Rami (ST)', 'Osvaldo Bosso (CB)', 'Manuel Rivera (CM)', 'Felipe Campos (RB)', 'Jovany Campusano (LB)', 'Fernando Ovelar (RM)', 'Matías Plaza (LM)'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/nublense/nublense-logo-footylogos.svg', division: 1 },
  { id: 'audax_italiano', name: 'Audax Italiano', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Federico Mateos (CM)', 'Rodrigo Cabral (LW)', 'Diego Coelho (ST)', 'Franco Troyansky (ST)', 'Marcelo Ortíz (CB)', 'Michael Vadulli (LW)', 'Nicolás Orellana (CM)', 'Raimundo Rebolledo (RB)', 'Marco Collao (CM)', 'Daniel Piña (CB)', 'Giovani Chiaverano (RW)'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/audax-italiano/audax-italiano-logo-footylogos.svg', division: 1 },
  { id: 'ohiggins', name: 'O\'Higgins', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'deportes_limache', name: 'Deportes Limache', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jean Meneses (LW)', 'Joaquín Montecinos (RW)', 'Nicolás Peñailillo (LB)', 'Alfonso Parot (LB)', 'César Pinares (CAM)', 'Gonzalo Sosa (ST)', 'Ramón Martínez (CDM)', 'César Fuentes (CDM)', 'Daniel Castro (LW)', 'Claudio González (GK)', 'Marcos Arturia (ST)'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/deportes-limache/deportes-limache-logo-footylogos.svg', division: 1 },
  { id: 'deportes_la_serena', name: 'Deportes La Serena', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Gonzalo Escalante (CM)', 'Federico Lanzillotta (GK)', 'Rafael Delgado (LB)', 'Francis Mac Allister (CDM)', 'Matías Marín (CM)', 'Diego Rubio (ST)', 'Nicolás Stefanelli (ST)', 'Lucas Alarcón (CB)', 'Alexander Oroz (LW)', 'Andrés Zanini (CB)', 'Ángelo Henríquez (ST)'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 1 },
  { id: 'deportes_concepción', name: 'Deportes Concepción', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/chile/1500x1500/deportes-concepcion.569d23ad.png', division: 1 },
  { id: 'universidad_de_concepción', name: 'Universidad de Concepción', league: 'Chilena', dt: 'DT Genérico', reputation: 3, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera División de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/universidad_de_concepción.png', division: 1 },
  { id: 'unión_española', name: 'Unión Española', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Patricio Rubio (ST)', 'Pablo Aránguiz (LW)', 'José Aja (CB)', 'Martín Rodríguez (GK)', 'Martín Parra (GK)', 'Ignacio Núñez (CM)', 'Sebastián Pereira (CB)', 'Andrés Vilches (ST)', 'Bastián Roco (CB)', 'Bruno Jáuregui (CDM)', 'Gabriel Norambuena (LB)'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/union-espanola/union-espanola-logo-footylogos.svg', division: 2 },
  { id: 'deportes_iquique', name: 'Deportes Iquique', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Édson Puch (LW)', 'Álvaro Ramos (ST)', 'César González (RW)', 'Matías Blázquez (CB)', 'Felipe Espinoza (LB)', 'Isaac Díaz (ST)', 'Brayan Garrido (CM)', 'Zacarías López (GK)', 'Agustin Venezia (CAM)', 'Simón Contreras (RB)', 'Daniel Castillo (GK)'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/deportes-iquique/deportes-iquique-logo-footylogos.svg', division: 2 },
  { id: 'santiago_wanderers', name: 'Santiago Wanderers', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'curicó_unido', name: 'Curicó Unido', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Leandro Benegas (ST)', 'Rodrigo Colombo (CB)', 'Ronald de la Fuente (LB)', 'Henry Sanhueza (CB)', 'Joaquín Romo (CM)', 'Gabriel Sarria (CB)', 'Damian Ezequiel Tello (GK)', 'Braulio Guisolfo (CDM)', 'Javier Retamales (CAM)', 'Juan Pablo Gómez (RB)', 'Enzo Ormeño (CM)'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/curico_unido.png', division: 2 },
  { id: 'deportes_copiapó', name: 'Deportes Copiapó', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Lautaro Palacios (ST)', 'Fabián Torres (CB)', 'Iván Ledezma (CM)', 'Agustín Ortiz (RB)', 'Gastón Pérez (CDM)', 'Carlos Ross (RW)', 'John Santander (LB)', 'Claudio Zamorano (CDM)', 'Manuel López (ST)', 'Jorge Ortiz (CAM)', 'Nicolás Temperini (GK)'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'san_luis_de_quillota', name: 'San Luis de Quillota', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/LOGO_SAN_LUIS_DE_QUILLOTA_OFICIAL.png', division: 2 },
  { id: 'san_marcos_de_arica', name: 'San Marcos de Arica', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cobreloa', name: 'Cobreloa', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Sebastián Zúñiga (CAM)', 'Cristian Insaurralde (LW)', 'Felipe Fritz (LB)', 'Tomás Aránguiz (CM)', 'Gustavo Gotti (ST)', 'Jorge Gatica (CM)', 'Diego Tapia (GK)', 'Vicente Conelli (ST)', 'Rodolfo González (CB)', 'Hugo Araya (GK)', 'Facundo Velazco (LM)'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/cobreloa.png', division: 2 },
  { id: 'deportes_antofagasta', name: 'Deportes Antofagasta', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'deportes_recoleta', name: 'Deportes Recoleta', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Gonzalo Álvarez (RW)', 'Francisco Alarcón (CB)', 'Germán Estigarribia (ST)', 'Álvaro Salazar (GK)', 'Felipe Saavedra (LB)', 'Christian Cepeda (CB)', 'Camilo Rodríguez (RB)', 'Federico Martin (CDM)', 'Pedro Sánchez (ST)', 'Mikel Arguinarena (CAM)', 'Brayams Viveros (CB)'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'deportes_temuco', name: 'Deportes Temuco', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Brian Torrealba (RB)', 'Diego Buonanotte (CAM)', 'Felipe Reynero (RW)', 'Rodrigo González (RB)', 'Maximiliano Cuadra (ST)', 'Yerko Urra (GK)', 'Camilo Núñez (CDM)', 'Brayan Valdivia (RW)', 'Luis Acevedo (ST)', 'César Huanca (ST)', 'Miguel Sanhueza (CB)'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/deportes_temuco.png', division: 2 },
  { id: 'magallanes', name: 'Magallanes', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/magallanes.png', division: 2 },
  { id: 'rangers_de_talca', name: 'Rangers de Talca', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'deportes_santa_cruz', name: 'Deportes Santa Cruz', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'unión_san_felipe', name: 'Unión San Felipe', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Agustín Fontana (ST)', 'Gonzalo Jara (LW)', 'Bruno Vides (ST)', 'Valentín Perales (CB)', 'Ignacio Jara (CAM)', 'Leandro Cañete (GK)', 'Luis García (CDM)', 'Diego Pereira (LB)', 'Nicolás Brun (LM)', 'Kevin Serrano (CB)', 'Patricio Muñoz (ST)'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'puerto_montt', name: 'Puerto Montt', league: 'Chilena', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Alexis Sabella (LW)', 'Luciano Vázquez (ST)', 'Byron Nieto (RB)', 'Jason Flores (LM)', 'Luis Ureta (GK)', 'Ariel Morales (CB)', 'Kevin Egaña (LB)', 'Cristóbal Vargas (CAM)', 'Maximiliano Riveros (CB)', 'Gabriel Castillo (CM)', 'Richard Paredes (CAM)'], description: 'Primera B de Chile.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },

  // ==========================================
  // --- URUGUAY (PRIMERA DIVISIÓN) ---
  // ==========================================
  { id: 'penarol', themeColor: { primary: '#eab308', secondary: '#f5f0e8' }, name: 'Peñarol', league: 'Uruguaya', dt: 'Diego Aguirre', reputation: 4, initialSalary: 2200, marketValue: 15400000, starPlayers: ['Leonardo Fernández (CAM)', 'Gastón Togni (LM)', 'Diego Laxalt (LB)', 'Emanuel Gularte (CB)', 'Matías Arezo (ST)', 'Javier Cabrera (RM)', 'Abel Hernández (ST)', 'Facundo Batista (ST)', 'Washington Aguerre (GK)', 'Lucas Ferreira (CB)', 'Luis Miguel Angulo (LM)'], description: 'El Carbonero.', badgeColor: 'border-l-4 border-yellow-500 bg-black text-yellow-300', badgeLogoUrl: '🏆',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/penarol/penarol-logo-footylogos.svg', division: 1 },
  { id: 'nacional_uru', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Nacional', league: 'Uruguaya', dt: 'Martín Lasarte', reputation: 4, initialSalary: 2150, marketValue: 14800000, starPlayers: ['Sebastián Coates', 'Nicolás López', 'Luis Mejía', 'Mauricio Pereyra'], description: 'El Bolso.', badgeColor: 'border-l-4 border-blue-600 bg-red-950 text-blue-200', badgeLogoUrl: '🔴⚪🔵',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/nacional/nacional-logo-footylogos.svg', division: 1 },
  { id: 'defensor_sporting', themeColor: { primary: '#9333ea', secondary: '#f5f0e8' }, name: 'Defensor Sporting', league: 'Uruguaya', dt: 'Martín Varini', reputation: 3, initialSalary: 1500, marketValue: 7000000, starPlayers: ['Octavio Rivero', 'Fernando Elizari', 'Renzo Giampaoli', 'Kevin Dawson'], description: 'El Tuerto.', badgeColor: 'border-l-4 border-purple-600 bg-purple-900 text-white', badgeLogoUrl: '🟣',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/defensor-sporting/defensor-sporting-logo-footylogos.svg', division: 1 },
  { id: 'danubio', name: 'Danubio', league: 'Uruguaya', dt: 'Alejandro Apud', reputation: 3, initialSalary: 1400, marketValue: 6500000, starPlayers: ['Sebastián Rodríguez (CM)', 'Mauro Goicoechea (GK)', 'Sebastián Fernández (ST)', 'Iván Rossi (CDM)', 'Emiliano Velázquez (CB)', 'Camilo Mayada (RB)', 'Tomás Cavanagh (LB)', 'Leandro Sosa (CDM)', 'Mateo Rinaldi (CB)', 'Mateo Peralta (CM)', 'Juan Millán (CDM)'], description: 'La Franja.', badgeColor: 'border-l-4 border-black bg-white text-black', badgeLogoUrl: '🎽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/danubio/danubio-logo-footylogos.svg', division: 1 },
  { id: 'racing_club_uru', name: 'Racing Club', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Adrián Martínez (ST)', 'Gabriel Rojas (LM)', 'Santiago Sosa (CB)', 'Facundo Cambeses (GK)', 'Marcos Rojo (CB)', 'Gastón Martirena (RM)', 'Marco Di Cesare (CB)', 'Santiago Solari (RW)', 'Tomás Conechny (LM)', 'Duván Vergara (LW)', 'Valentín Carboni (CAM)'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/racing-club/racing-club-logo-footylogos.svg', division: 1 },
  { id: 'liverpool_uru', name: 'Liverpool', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 169100, marketValue: 879500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/uruguay/1500x1500/liverpool.5f13754a.png', division: 1 },
  { id: 'cerro_largo_uru', name: 'Cerro Largo', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Sebastián Assís (CDM)', 'Nicolás Bertocchi (CDM)', 'Lucas Correa (CB)', 'Gustavo Viera (ST)', 'Juan Moreno (GK)', 'Mario García (CM)', 'Fernando Souza (RB)', 'Alexander Hernández (CAM)', 'Maximiliano Añasco (LW)', 'Ihojan Pérez (RM)', 'Federico Sellecchia (ST)'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cerro-largo/cerro-largo-logo-footylogos.svg', division: 1 },
  { id: 'montevideo_wanderers_uru', name: 'Montevideo Wanderers', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/montevideo-wanderers/montevideo-wanderers-logo-footylogos.svg', division: 1 },
  { id: 'montevideo_city_torque_uru', name: 'Montevideo City Torque', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/montevideo_city_torque_uru.png', division: 1 },
  { id: 'boston_river_uru', name: 'Boston River', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Gastón Ramírez (CM)', 'Agustín Amado (CM)', 'Rafael Haller (RB)', 'Bruno Antúnez (GK)', 'Juan Acosta (RB)', 'Andrés Romero (CM)', 'Leandro Suhr (RW)', 'Fredy Martínez (LB)', 'Martín González (CB)', 'Facundo Muñoa (CM)', 'Facundo Rodríguez (ST)'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/boston-river/boston-river-logo-footylogos.svg', division: 1 },
  { id: 'cerro_uru', name: 'Cerro', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/uruguay/1500x1500/cerro.17224d11.png', division: 1 },
  { id: 'progreso_uru', name: 'Progreso', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/progreso/progreso-logo-footylogos.svg', division: 1 },
  { id: 'juventud_de_las_piedras_uru', name: 'Juventud de Las Piedras', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Juventud_de_Las_Piedras.png', division: 1 },
  { id: 'albion_uru', name: 'Albion', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Hernán Toledo (LM)', 'Matías de los Santos (CB)', 'Francisco Ginella (CM)', 'Tobías Figueroa (ST)', 'José Álvarez (LM)', 'Leonardo Pais (RM)', 'Agustín Pereira (RB)', 'Andrés Romero (CB)', 'Briam Acosta (RM)', 'Álvaro López (ST)', 'Tomás Moschión (CDM)'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/scotland/1500x1500/albion.f4fcd350.png', division: 1 },
  { id: 'c_español_uru', name: 'C. Español', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/c_espanol_uru.png', division: 1 },
  { id: 'maldonado_uru', name: 'Maldonado', league: 'Uruguaya', dt: 'DT Genérico', reputation: 2, initialSalary: 1100, marketValue: 4000000, starPlayers: ['Hernán Menosse (CB)', 'Christian Tabó (RM)', 'Bruno Mendes (ST)', 'Juan Ramos (LB)', 'Hernán Petryk (RB)', 'Facundo Tealde (CB)', 'Santiago Cartagena (CDM)', 'Maximiliano González (CDM)', 'Adriano Freitas (GK)', 'Santiago Ramírez (ST)', 'Maximiliano Noble (CAM)'], description: 'Campeonato Uruguayo.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/dorados.png', division: 1 },

  // ==========================================
  // --- PERÚ (LIGA 1) ---
  // ==========================================
  { id: 'universitario', themeColor: { primary: '#fef08a', secondary: '#f5f0e8' }, name: 'Universitario', league: 'Peruana', dt: 'Fabián Bustos', reputation: 4, initialSalary: 1800, marketValue: 9000000, starPlayers: ['Williams Riveros (CB)', 'Andy Polo (RW)', 'Jairo Concha (CM)', 'Alex Valera (ST)', 'Edison Flores (ST)', 'Anderson Santamaría (CB)', 'Martín Pérez Guedes (CM)', 'Aldo Corzo (CB)', 'Bryan Reyna (LM)', 'José Carabalí (LB)', 'Lisandro Alzugaray (RW)'], description: 'Los Cremas.', badgeColor: 'border-l-4 border-yellow-200 bg-red-900 text-yellow-100', badgeLogoUrl: '🟨🟥',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/peru/1500x1500/universitario.868fa07a.png', division: 1 },
  { id: 'alianza_lima', themeColor: { primary: '#1e40af', secondary: '#f5f0e8' }, name: 'Alianza Lima', league: 'Peruana', dt: 'Mariano Soso', reputation: 4, initialSalary: 1700, marketValue: 8500000, starPlayers: ['Luis Advíncula (RB)', 'Pedro Aquino (CDM)', 'Guillermo Viscarra (GK)', 'Paolo Guerrero (ST)', 'Renzo Garcés (CB)', 'Fernando Gaibor (CM)', 'Eryc Castillo (RW)', 'Gaspar Gentile (RW)', 'Josué Estrada (RB)', 'Federico Girotti (ST)', 'Esteban Pavez (CDM)'], description: 'Los Íntimos.', badgeColor: 'border-l-4 border-blue-800 bg-slate-100 text-blue-900', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/peru/1500x1500/alianza-lima.d8192e17.png', division: 1 },
  { id: 'sporting_cristal', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'Sporting Cristal', league: 'Peruana', dt: 'Enderson Moreira', reputation: 4, initialSalary: 1600, marketValue: 8000000, starPlayers: ['Santiago González (RW)', 'Christofer Gonzáles (CAM)', 'Martín Távara (CM)', 'Felipe Vizeu (ST)', 'Gustavo Cazonatti (CDM)', 'Yoshimar Yotún (CM)', 'Luis Iberico (ST)', 'Luis Abram (CB)', 'Diego Enríquez (GK)', 'Írven Ávila (ST)', 'Renato Solís (GK)'], description: 'Los Celestes.', badgeColor: 'border-l-4 border-sky-400 bg-sky-800 text-white', badgeLogoUrl: '🩵',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sporting-cristal/sporting-cristal-logo-footylogos.svg', division: 1 },
  { id: 'melgar', name: 'Melgar', league: 'Peruana', dt: 'Marco Valencia', reputation: 3, initialSalary: 1400, marketValue: 7000000, starPlayers: ['Bernardo Cuesta', 'Horacio Orzán', 'Leonel Galeano', 'Carlos Cáceda'], description: 'El Dominó.', badgeColor: 'border-l-4 border-black bg-red-600 text-white', badgeLogoUrl: '🔴⚫',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/peru/1500x1500/melgar.bf68cdae.png', division: 1 },
  { id: 'deportivo_garcilaso', name: 'Deportivo Garcilaso', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Kevin Sandoval (LW)', 'Agustin Gómez (CB)', 'Horacio Benincasa (CB)', 'Claudio Torrejón (CDM)', 'Aldair Salazar (CB)', 'Patrick Zubczuk (GK)', 'Agustín González (CM)', 'Agustín Graneros (ST)', 'José Luis Sinisterra (ST)', 'Francisco Arancibia (RW)', 'Beto da Silva (LW)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/deportivo-garcilaso/deportivo-garcilaso-logo-footylogos.svg', division: 1 },
  { id: 'adt', name: 'ADT', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jonathan Bauman (ST)', 'Joao Rojas (CAM)', 'Víctor Cedrón (CAM)', 'Luis Pérez (CM)', 'Jordan Guivin (CM)', 'Aldair Rodríguez (ST)', 'John Narváez (CB)', 'Carlos Solís (GK)', 'Juan Valencia (GK)', 'Luis Benítes (LW)', 'Carlos Cabello (RB)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/adt.png', division: 1 },
  { id: 'sport_huancayo', name: 'Sport Huancayo', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Yorleys Mena (ST)', 'Jimmy Valoyes (CB)', 'Ángel Zamudio (GK)', 'Ricardo Salcedo (CDM)', 'Javier Sanguinetti (CAM)', 'Jeremy Rostaing (RB)', 'Hugo Ángeles Chávez (LB)', 'Yonatan Murillo (CB)', 'Nahuel Luján (LW)', 'Diego Campos (GK)', 'Ronal Huaccha (ST)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sport-huancayo/sport-huancayo-logo-footylogos.svg', division: 1 },
  { id: 'sport_boys', name: 'Sport Boys', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Carlos Zambrano (CB)', 'Miguel Trauco (LB)', 'Diego Melián (GK)', 'Luis Urruti (LW)', 'Carlos López (RW)', 'Jostin Alarcón (LW)', 'Gustavo Dulanto (CB)', 'Oslimg Mora (RB)', 'Luciano Nequecaur (ST)', 'Renzo Alfani (CB)', 'Mathías Llontop (LB)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sport-boys/sport-boys-logo-footylogos.svg', division: 1 },
  { id: 'utc', name: 'UTC', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Marcos Lliuya (CAM)', 'Ángelo Campos (GK)', 'Bruno Duarte (CB)', 'Luis Garro (RB)', 'Adolfo Muñoz (LW)', 'David Camacho (RW)', 'Marlon de Jesús (ST)', 'Luis Arce (CDM)', 'Arquímedes Figuera (CDM)', 'Ignacio Barrios (GK)', 'David Dioses (CDM)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/utc.png', division: 1 },
  { id: 'atlético_grau', name: 'Atlético Grau', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Raúl Ruidíaz (ST)', 'Patricio Álvarez (GK)', 'Rodrigo Tapia (CB)', 'Freddy Oncoy (CM)', 'Rafael Guarderas (CDM)', 'Elsar Rodas (LB)', 'Nicolás Delgadillo (LW)', 'Paulo de la Cruz (RW)', 'Lucas Acevedo (CB)', 'Diego Barreto (CAM)', 'Cristian Neira (CAM)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atletico-grau/atletico-grau-logo-footylogos.svg', division: 1 },
  { id: 'cusco_fc', name: 'Cusco FC', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Iván Colman (CAM)', 'Andy Vidal (GK)', 'Lucas Colitto (LW)', 'Gabriel Carabajal (CAM)', 'Nicolás Silva (RW)', 'Facundo Callejo (ST)', 'Miguel Aucca (CM)', 'Oswaldo Valenzuela (CDM)', 'Juan Manuel Tévez (ST)', 'Aldair Fuentes (CB)', 'José Bolívar (LB)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cusco/cusco-logo-footylogos.svg', division: 1 },
  { id: 'cienciano', name: 'Cienciano', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Alejandro Hohberg (LW)', 'Carlos Garcés (ST)', 'Claudio Nuñez (CB)', 'Neri Bandiera (ST)', 'Juan Romagnoli (RW)', 'Ray Sandoval (LW)', 'Gonzalo Falcón (GK)', 'Ítalo Espinoza (GK)', 'Kevin Becerra (CB)', 'Ademar Robles (CM)', 'Maximiliano Amondarain (CB)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Escudo_Cienciano.png', division: 1 },
  { id: 'los_chankas', name: 'Los Chankas', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Franco Saravia (GK)', 'Janio Pósito (ST)', 'Carlos Pimienta (CB)', 'Jarlín Quintero (ST)', 'Kelvin Sánchez (CDM)', 'Abdiel Ayarza (CM)', 'Héctor González (CB)', 'Ayrthon Quintana (LB)', 'Kenyi Barrios (RW)', 'Gonzalo Rizzo (CB)', 'Marlon Junior Torres (RW)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/peru/1500x1500/los-chankas.680a57ad.png', division: 1 },
  { id: 'comerciantes_unidos', name: 'Comerciantes Unidos', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/comerciantes-unidos/comerciantes-unidos-logo-footylogos.svg', division: 1 },
  { id: 'atlético_sullana', name: 'Atlético Sullana', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'juan_pablo_ii', name: 'Juan Pablo II', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Christian Cueva (CAM)', 'Cristian García (CDM)', 'Cristhian Tizón (LW)', 'Paolo Fuentes (CB)', 'Martín Alaníz (LW)', 'Jack Durán (RW)', 'Erinson Ramírez (CAM)', 'Gustavo Aliaga (CM)', 'Jorge Toledo (RB)', 'Maximiliano Juambeltz (ST)', 'Adán Henricks (ST)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/adc-juan-pablo-ii/adc-juan-pablo-ii-logo-footylogos.svg', division: 1 },
  { id: 'fc_cajamarca', name: 'FC Cajamarca', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Hernán Barcos (ST)', 'Pablo Míguez (CB)', 'Pablo Lavandeira (CAM)', 'Brandon Palacios (LW)', 'Enmanuel Páucar (CDM)', 'Nilson Loyola (LB)', 'Jonathan Betancourt (LW)', 'Ricardo Lagos (LB)', 'Tomás Andrade (CAM)', 'Matías Almirón (CB)', 'Jefferson Orejuela (CDM)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-cajamarca/fc-cajamarca-logo-footylogos.svg', division: 1 },
  { id: 'moquegua', name: 'Moquegua', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 1000, marketValue: 3500000, starPlayers: ['Juan Diego Lojas (CB)', 'Diego Ramírez (CM)', 'Yorman Zapata (LM)', 'Jefferson Collazos (ST)', 'Carlos Grados (GK)', 'Nicolás Chávez (CAM)', 'Cristian Enciso (CB)', 'Allonso Dávila (LW)', 'Kevin Moreno (CB)', 'Claudio Ramírez (CDM)', 'Bryan Angulo (ST)'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/moquegua.png', division: 1 },
  // Faltaba en la base y sí juega la Liga 1 (ver data/calendarios/Peruana.json): sin él se
  // descartaban 17 partidos por temporada. "Alianza Atlético" no se agrega porque ya está en la
  // base como 'Atlético Sullana' (es el mismo club, Alianza Atlético de Sullana).
  { id: 'alianza_udh', name: 'Alianza Universidad', league: 'Peruana', dt: 'DT Genérico', reputation: 2, initialSalary: 900, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga 1 Te Apuesto.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },

  // ==========================================
  // --- ECUADOR (LIGA PRO A Y B) ---
  // ==========================================
  { id: 'ldu_quito', name: 'LDU Quito', league: 'Ecuatoriana', dt: 'Vitamina Sánchez', reputation: 4, initialSalary: 2300, marketValue: 16500000, starPlayers: ['Gonzalo Valle (GK)', 'Ricardo Adé (CB)', 'Deyverson (ST)', 'Fernando Cornejo (CM)', 'Leonel Quiñonez (LB)', 'Alexander Domínguez (GK)', 'Jeison Medina (ST)', 'Janner Corozo (RW)', 'Luis Segovia (CB)', 'Rodney Redes (RW)', 'José Quintero (RB)'], description: 'El Rey de Copas.', badgeColor: 'border-l-4 border-gray-100 bg-slate-900 text-white', badgeLogoUrl: '⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ldu-quito/ldu-quito-logo-footylogos.svg', division: 1 },
  { id: 'idv_ecu', themeColor: { primary: '#be185d', secondary: '#f5f0e8' }, name: 'Independiente del Valle', league: 'Ecuatoriana', dt: 'Javier Gandolfi', reputation: 4, initialSalary: 2250, marketValue: 17000000, starPlayers: ['Kendry Páez', 'Junior Sornoza', 'Richard Schunke', 'Renato Ibarra'], description: 'El Matagigantes.', badgeColor: 'border-l-4 border-pink-700 bg-indigo-950 text-pink-200', badgeLogoUrl: '🛡️',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/independiente-del-valle/independiente-del-valle-logo-footylogos.svg', division: 1 },
  { id: 'barcelona_sc', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Barcelona SC', league: 'Ecuatoriana', dt: 'Diego López', reputation: 4, initialSalary: 130200, marketValue: 677000000, starPlayers: ['José Contreras (GK)', 'Javier Báez (CB)', 'Luis Cano (LW)', 'Darío Benedetto (ST)', 'Luca Sosa (CB)', 'Tomás Martínez (CAM)', 'Bryan Carabalí (RB)', 'Gustavo Vallecilla (CB)', 'Jefferson Intriago (CM)', 'Jhonny Quiñónez (CDM)', 'Byron Castillo (RB)'], description: 'El Ídolo del Astillero.', badgeColor: 'border-l-4 border-red-600 bg-yellow-500 text-black', badgeLogoUrl: '🟡',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/ecuador/1500x1500/barcelona-sc.f30b579b.png', division: 1 },
  { id: 'emelec', name: 'Emelec', league: 'Ecuatoriana', dt: 'Hernán Torres', reputation: 3, initialSalary: 1800, marketValue: 10000000, starPlayers: ['Pedro Ortíz', 'Luis Fernando León', 'Cristhian Noboa', 'Facundo Castelli'], description: 'El Bombillo.', badgeColor: 'border-l-4 border-gray-300 bg-blue-800 text-white', badgeLogoUrl: '💡',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/ecuador/1500x1500/emelec.93f9eda1.png', division: 1 },
  { id: 'técnico_universitario', name: 'Técnico Universitario', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/tecnico-universitario/tecnico-universitario-logo-footylogos.svg', division: 1 },
  { id: 'delfín', name: 'Delfín', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/delfin-sc/delfin-sc-logo-footylogos.svg', division: 1 },
  { id: 'deportivo_cuenca', name: 'Deportivo Cuenca', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Lucas Mancinelli (RW)', 'Carlos Arboleda (LW)', 'Edison Vega (CDM)', 'Mateo Maccari (CDM)', 'Nicolás Leguizamón (ST)', 'Romario Ibarra (LW)', 'Facundo Ferrero (GK)', 'Jorge Ordóñez (RW)', 'David González (CAM)', 'Patricio Boolsen (CB)', 'David Noboa (CDM)'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/deportivo-cuenca/deportivo-cuenca-logo-footylogos.svg', division: 1 },
  { id: 'universidad_católica_ecu', name: 'Universidad Católica', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 1 },
  { id: 'mushuc_runa', name: 'Mushuc Runa', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Facundo Castelli (ST)', 'Renato Ibarra (RW)', 'Ronie Carrillo (ST)', 'Rodrigo Formento (GK)', 'Lucas Lemos (CDM)', 'Kevin Velasco (LW)', 'José Hernández (LB)', 'Tomson Minda (RW)', 'Manuel Gamboa (CB)', 'Nicolás Dibble (ST)', 'Adonnis Pabón (GK)'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/ecuador/1500x1500/mushuc-runa.6a6f7d1f.png', division: 1 },
  { id: 'macará', name: 'Macará', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['José Luis Marrufo (CB)', 'Federico Paz (ST)', 'José Luis Cazares (CDM)', 'Rodrigo Rodríguez (GK)', 'Gastón Blanc (CM)', 'Jean Carlos Estacio (CDM)', 'Denilson Bolaños (RB)', 'Santiago Etchebarne (CB)', 'Luis Ayala (LB)', 'Franco Posse (ST)', 'Marlon Medranda (LB)'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cd-macara/cd-macara-logo-footylogos.svg', division: 1 },
  { id: 'aucas', name: 'Aucas', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Hamilton Piedra (GK)', 'Ayrton Preciado (LW)', 'Bruno Miranda (ST)', 'Stiven Tapiero (CDM)', 'John Ontaneda (CB)', 'Romario Bolaños (LM)', 'Luis Arroyo (CAM)', 'Carlos Cuero (LB)', 'Danny Luna (LW)', 'Luis Gustavino (CB)', 'Agostino Spina (CDM)'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/ecuador/1500x1500/aucas.60263837.png', division: 1 },
  { id: 'orense', name: 'Orense', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Ángel Mena (RW)', 'Valentín Burgoa (CAM)', 'Erick Plúas (CDM)', 'Gonzalo Rostagno (CM)', 'Stefano Callegari (CB)', 'Diego Armas (CAM)', 'Nixon Molina (CDM)', 'Rolando Silva (GK)', 'Renny Jaramillo (CDM)', 'Alan Lorenzo (CB)', 'Óscar Quiñónez (CB)'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/ecuador/1500x1500/orense.85c72fd4.png', division: 1 },
  { id: 'libertad_fc', name: 'Libertad FC', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['David Cabezas (GK)', 'Gabriel Cortez (CAM)', 'Vilington Branda (RW)', 'Jhon Jairo Cifuente (ST)'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/ecuador/1500x1500/libertad.cd752b54.png', division: 1 },
  { id: 'manta_fc', name: 'Manta FC', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Jean Carlos Blanco (ST)', 'Danny Cabezas (CAM)', 'Glendys Mina (LB)', 'Robert Burbano (RW)'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/manta-fc/manta-fc-logo-footylogos.svg', division: 1 },
  { id: 'leones_fc_ecu', name: 'Leones FC', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Juan Luis Anangonó (ST)', 'Segundo Portocarrero (LM)', 'Charles Vélez (CDM)', 'Kevin Mina (ST)', 'José Angulo (GK)', 'Cristhian Solano (LW)', 'Herlin Lino (ST)', 'Leonel Nazareno (GK)', 'Elian Pepinos (CM)', 'Mauro Luque (RB)', 'Darío Pazmiño (CAM)'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'guayaquil_city', name: 'Guayaquil City', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 2, initialSalary: 1200, marketValue: 5000000, starPlayers: ['Damián Díaz (CAM)', 'Esnáider Cabezas (CB)', 'Dixon Arroyo (CDM)', 'Pablo González (CAM)', 'Madison Julio (CDM)', 'Junior Ayoví (RB)', 'Edinson Mero (RW)', 'Stalin Caicedo (LW)', 'Anderson Naula (ST)', 'Rodrigo Perea (GK)', 'José Miguel Andrade (ST)'], description: 'Liga Pro Serie A.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'vinotinto_fc', name: 'Vinotinto FC', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vinotinto-fc/vinotinto-fc-logo-footylogos.svg', division: 2 },
  { id: 'el_nacional', name: 'El Nacional', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jonathan Borja (CAM)', 'Roberto Garcés (CDM)', 'Fernando Mora (LB)', 'Rommel Cabezas (CB)', 'Jordán Congo (GK)', 'Reixon Saya (RW)', 'Fricson Borja (ST)', 'Wilder Estupiñán (CB)', 'Teddye Lara (RM)', 'Mauro Mariño (CAM)', 'Alan Valencia (CM)'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/nacional/nacional-logo-footylogos.svg', division: 2 },
  { id: 'gualaceo', name: 'Gualaceo', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: null, division: 2 },
  { id: 'independiente_del_valle_juniors', name: 'Independiente del Valle Juniors', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Escudoindependientedelvalle2023.png', division: 2 },
  { id: 'san_antonio', name: 'San Antonio', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Ramiro Ballivián (RB)', 'Yonathan Cabral (CB)', 'Adalid Terrazas (CAM)', 'Luca Giossa (GK)', 'Julio Herrera (CM)', 'Pablo Vaca (CB)', 'Cristhian Machado (CDM)', 'Andrés Córdoba (LW)', 'Huberth Sánchez (CB)', 'Saulo Guerra (RM)', 'Ronald Bustos (RB)'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/san_antonio.png', division: 2 },
  { id: 'cumbayá', name: 'Cumbayá', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: '9_de_octubre', name: '9 de Octubre', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/9_de_Octubre_FC_escudo.png', division: 2 },
  { id: 'atlético_fc', name: 'Atlético FC', league: 'Ecuatoriana', dt: 'Andrés Sicachá', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Fidel Martínez (RM)', 'Fabián Villa (CB)', 'Jhonier Alomía (CB)', 'Danny Reales (CB)', 'Wílmer Godoy (CM)', 'Joseph Espinoza (CM)', 'David Agudelo (GK)', 'José Palacios (CB)', 'Gabriel Erazo (ST)', 'Miguel Suárez (GK)', 'Juan Jaramillo (GK)'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'dep_santo_domingo', name: 'Dep. Santo Domingo', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: '22_de_julio', name: '22 de Julio', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cuenca_jrs', name: 'Cuenca Jrs', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'ldup', name: 'LDUP', league: 'Ecuatoriana', dt: 'DT Genérico', reputation: 1, initialSalary: 700, marketValue: 2000000, starPlayers: ['Ángel Gracia (LB)', 'Jefferson Caicedo (LW)', 'Manuel Mendoza (GK)', 'Jordan Ponguillo (CB)', 'Pablo Cifuentes (CB)', 'Edison Caicedo (CDM)', 'Richard Sánchez (CAM)', 'Jeison Mina (CB)', 'Efrén Proaño (CB)', 'Jairon Bonett (RM)', 'César Espínola (ST)'], description: 'Liga Pro Serie B.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
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
    starPlayers: ['Marvin Bejarano (LB)', 'Robson (CB)', 'Rolando Blackburn (ST)', 'Gonzalo Rehak (GK)', 'Jorge Scolari (CB)', 'Leandro Corulo (CB)', 'Limberg Gutiérrez (CAM)', 'Santiago Cuiza (CDM)', 'Diego Wayar (CDM)', 'Alexis Ribera (RM)', 'Cristhian Árabe (CM)'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/real-tomayapo/real-tomayapo-logo-footylogos.svg',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/universitario-de-vinto/universitario-de-vinto-logo-footylogos.svg',
    division: 1
  },
  {
    id: 'bolívar',
    name: 'Bolívar',
    league: 'Boliviana',
    dt: 'Diego Funes',
    reputation: 4,
    initialSalary: 1800,
    marketValue: 8000000,
    starPlayers: ['Martín Cauteruccio (ST)', 'Carlos Lampe (GK)', 'Damian Batallini (RW)', 'Patricio Rodríguez (LW)', 'Braian Oyola (LM)', 'Carlos Melgar (CAM)', 'José Sagredo (CB)', 'Xavier Arreaga (CB)', 'Santiago Echeverría (CB)', 'Leonel Justiniano (CM)', 'Erwin Saavedra (RM)'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bolivar/bolivar-logo-footylogos.svg',
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
    starPlayers: ['José Moya (CB)', 'Jovani Welch (CDM)', 'Jaime Arrascaita (LM)', 'Carmelo Algarañaz (ST)', 'Adrián Jusino (CB)', 'Widen Saucedo (RB)', 'Martín Chiatti (CB)', 'Raúl Castro (CM)', 'Pablo Pedraza (CB)', 'Kevin Romay (LB)', 'Adrián Estacio (RW)'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/bolivia/1500x1500/the-strongest.81140066.png',
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
    starPlayers: ['John Méndez (LW)', 'Luis Alí (RW)', 'Fran Supayabe (RB)', 'Vladimir Castellón (ST)', 'Bleiner Agrón (CB)', 'Gonzalo Añasgo (LB)', 'Carlos Chore (CB)', 'Emerson Velasquez (CB)', 'Luis Vargas (CM)', 'Maximiliano Gómez (RW)', 'Juan Pablo Rioja (CB)'],
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
    starPlayers: ['Maicon Solís (RW)', 'Edisson Restrepo (CB)', 'Diego Hoyos (CM)', 'Andrés Torrico (RW)', 'Leandro Otormín (CAM)', 'Luis Pavia (RM)', 'Pedro Azogue (CDM)', 'Damián Villalba (ST)', 'Tommy Tobar (ST)', 'Juan José Orellana (LB)', 'Pedro Galindo (GK)'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/bolivia/1500x1500/nacional-potosi.bb295408.png',
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
    starPlayers: ['Alain Baroja (GK)', 'Yhormar Hurtado (RB)', 'Enrique Triverio (ST)', 'Fernando Saucedo (CM)', 'Luis Caicedo (CB)', 'Alex Rambal (CB)', 'Héctor Cuellar (CDM)', 'Joel Amoroso (CAM)', 'Juan Godoy (ST)', 'Marcelo Suárez (CB)', 'Richet Gómez (CB)'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/bolivia/1500x1500/always-ready.d109aa21.png',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/independiente-petrolero/independiente-petrolero-logo-footylogos.svg',
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
    starPlayers: ['Bayron Garcés (ST)', 'Moisés Villarroel (CM)', 'Jeyson Chura (RM)', 'Roberto Hinojoza (CAM)', 'Marc Enoumba (CB)', 'Braulio Uraezaña (GK)', 'José María Carrasco (CB)', 'Gabriel Valverde (CB)', 'Matías Abisab (CAM)', 'César Menacho (RW)', 'Auli Oliveros (CAM)'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/blooming/blooming-logo-footylogos.svg',
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
    starPlayers: ['Alan Terrazas (CAM)', 'Michael Rangel (ST)', 'José Verdún (ST)', 'Rubén Cordano (GK)', 'Erwin Junior Sánchez (CM)', 'Rodrigo Ramallo (LW)', 'Luis Barbosa (CB)', 'John Deiby Araujo (RW)', 'Oscar Vaca (LB)', 'Jefferson Ramos (ST)', 'Jaime Cornejo (RM)'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/aurora/aurora-logo-footylogos.svg',
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
    badgeImageUrl: 'badges/tm/gualberto_villarroel.png',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cd-san-antonio-bulo-bulo/cd-san-antonio-bulo-bulo-logo-footylogos.svg',
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
    starPlayers: ['Gustavo Peredo (RW)', 'Ronaldo Sánchez (LM)', 'Rafinha (CAM)', 'Gastón Gómez (GK)', 'David Robles (CB)', 'Milton Maciel (RM)', 'Jorge Enrique Flores (LB)', 'Ramiro Cristóbal (CDM)', 'Carlos Añez (RW)', 'Jorge Araúz (GK)', 'Denilso Fernandez (RW)'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/bolivia/1500x1500/guabira.9becb084.png',
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
    badgeImageUrl: 'https://assets.football-logos.cc/logos/bolivia/1500x1500/oriente-petrolero.ffa8eda8.png',
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
    starPlayers: ['Wilfredo Soleto (CB)', 'Adriel Fernández (LW)', 'Juan Montenegro (LW)', 'Iván Huayhuata (CDM)', 'Alexis Bravo (CAM)', 'Daniel Castellón (RB)', 'Joao Quiñónez (CB)', 'Daniel Porozo (RW)', 'Ángel Quiñónez (RW)', 'Alex Arancibia (GK)', 'Yhon Jairo Villegas (CB)'],
    description: 'Equipo compitiendo en Liga Boliviana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/bolivia/1500x1500/real-oruro.ca5ec1cb.png',
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
    badgeImageUrl: 'https://assets.football-logos.cc/logos/bolivia/1500x1500/abb.3cc6174f.png',
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
    starPlayers: ['Sergio Díaz (CAM)', 'Walter González (ST)', 'Óscar Ruiz (LW)', 'Alfredo Aguilar (GK)', 'Lautaro Comas (RW)', 'Paul Riveros (CB)', 'Alexis Villalba (CB)', 'Ángel Benítez (CDM)', 'Kevin Pereira (RW)', 'Fernando Benítez (CDM)', 'Sebastián Quintana (CM)'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sportivo-luqueno/sportivo-luqueno-logo-footylogos.svg',
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
    starPlayers: ['Diego Viera (CB)', 'Lorenzo Melgarejo (ST)', 'Matías Rojas (RW)', 'Matías Espinoza (LB)', 'Federico Carrizo (LW)', 'Alexis Duarte (CB)', 'Rodrigo Morínigo (GK)', 'Iván Ramírez (RB)', 'Álvaro Campuzano (CDM)', 'Iván Franco (CAM)', 'Robert Rojas (CB)'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/ecuador/1500x1500/libertad.cd752b54.png',
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
    starPlayers: ['Gastón Olveira (GK)', 'Richard Sánchez (CM)', 'Derlis González (CAM)', 'Mateo Gamarra (CB)', 'Iván Leguizamón (LW)', 'Alejandro Silva (CM)', 'Bryan Bentaberry (CB)', 'Juan Fernando Alfaro (CM)', 'Richard Ortiz (CDM)', 'Alan Rodríguez (LB)', 'Sebastián Ferreira (ST)'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/olimpia/olimpia-logo-footylogos.svg',
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
    starPlayers: ['Cecilio Domínguez (RW)', 'Pablo Vegetti (ST)', 'Gustavo Velázquez (CB)', 'Ignacio Aliseda (LW)', 'Jonatan Torres (ST)', 'Mateo Klimowicz (CAM)', 'Alexis Martín Arias (GK)', 'Juan Iturbe (CAM)', 'Santiago Mosquera (LW)', 'Gastón Giménez (CDM)', 'Roberto Fernández (GK)'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cerro-porteno/cerro-porteno-logo-footylogos.svg',
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
    starPlayers: ['Gaspar Servio (GK)', 'Fernando Fernández (ST)', 'Diego Fernández (LM)', 'Juan Daniel Pérez (RB)', 'Agustín Manzur (CM)', 'Patricio Tanda (CDM)', 'Marcos Gómez (CM)', 'Imanol Segovia (CB)', 'Derlis Rodríguez (RM)', 'Jhon Sánchez (RM)', 'Richard Torales (ST)'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/guarani/guarani-logo-footylogos.svg',
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
    badgeImageUrl: 'https://assets.football-logos.cc/logos/paraguay/1500x1500/sportivo-ameliano.9d541c16.png',
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
    badgeImageUrl: 'https://assets.football-logos.cc/logos/paraguay/1500x1500/nacional.b2946670.png',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sportivo-trinidense/sportivo-trinidense-logo-footylogos.svg',
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
    starPlayers: ['Alberto Espínola (RB)', 'Elías Alfonso (RW)', 'Pedro Delvalle (LW)', 'Carlos Servín (GK)', 'Camilo Saiz (CB)', 'Rodrigo Ruiz Díaz (ST)', 'Fernando Cáceres (ST)', 'Brahian Ayala (LW)', 'Wilson Ibarrola (LB)', 'Óscar Romero (CM)', 'René Rodríguez (RB)'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/paraguay/1500x1500/2-de-mayo.a249fd47.png',
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
    badgeImageUrl: 'badges/tm/recoleta.png',
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
    starPlayers: ['Brian Blasi (RB)', 'Rodrigo Rojas (CM)', 'Ángel Cardozo Lucena (CM)', 'Rodi Ferreira (RB)', 'William Mendieta (CAM)', 'Elías Sarquis (LM)', 'Fernando Martínez (CDM)', 'Gustavo Manzur (CDM)', 'Javier Vallejos (CB)', 'Mauricio Roldán (ST)', 'Pedro Báez (ST)'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/paraguay/1500x1500/rubio-nu.118ab0ff.png',
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
    starPlayers: ['Bruno Piñatares (CDM)', 'Mario López Quintana (CB)', 'Iván Torres (LB)', 'Matías Alfonso (CM)', 'Cristian Colmán (ST)', 'Alexis Doldán (CB)', 'Aldo Quiñónez (CM)', 'Wilson Quiñónez (GK)', 'Alex Álvarez (ST)', 'Elías Alderete (ST)', 'Mathias Martínez (RM)'],
    description: 'Equipo compitiendo en Liga Paraguaya.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/paraguay/1500x1500/sportivo-san-lorenzo.f52c0324.png',
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
    starPlayers: ['Alexander González (RB)', 'Lucas Bruera (GK)', 'Jean Franco Fuentes (CB)', 'Maurice Cova (CM)', 'Jonathan Bilbao (CB)', 'Edson Tortolero (CAM)', 'Leonardo Aponte (CB)', 'Ezequiel Neira (CB)', 'Matías Núñez (CDM)', 'Joshuan Berríos (RW)', 'Juan Camilo Pérez (CM)'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/carabobo/carabobo-logo-footylogos.svg',
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
    starPlayers: ['Samuel Orejuela (CB)', 'Jorge Luis Gómez (CDM)', 'Paolo Chacón (CB)', 'Joiser Arias (CM)', 'Daniel Rivillo (RB)', 'José Camacaro (GK)', 'Jaider Julio (LB)', 'Edwin Castro (CM)', 'José Luis Ochoa (ST)', 'Luis Enrique Paz (ST)', 'Luis Urbina (RW)'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/rayo-zuliano/rayo-zuliano-logo-footylogos.svg',
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
    starPlayers: ['Adrián Fernández (ST)', 'Luis Mago (CB)', 'Jesús Yendis (LB)', 'Michael Covea (CAM)', 'Frankarlos Benítez (GK)', 'Eduardo Fereira (RB)', 'Francisco La Mantía (CB)', 'Christian Larotonda (CDM)', 'Luis Maestre (CM)', 'Robert Hernández (RW)', 'Irving Gudiño (CM)'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/caracas/caracas-logo-footylogos.svg',
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
    badgeImageUrl: 'https://assets.football-logos.cc/logos/venezuela/1500x1500/deportivo-tachira.6cd551a4.png',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/metropolitanos/metropolitanos-logo-footylogos.svg',
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
    badgeImageUrl: 'https://assets.football-logos.cc/logos/venezuela/1500x1500/deportivo-la-guaira.7c49271f.png',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/academia-puerto-cabello/academia-puerto-cabello-logo-footylogos.svg',
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
    starPlayers: ['Elvis Perlaza (RB)', 'Joyce Ossa (CB)', 'Edder Farías (ST)', 'Felipe Jaramillo (CDM)', 'Jean Colorado (CM)', 'Édgar Carrión (LW)', 'Eduardo Lima (GK)', 'Jeferson Caraballo (CM)', 'Franklin González (ST)', 'Fernando Basante (ST)', 'Thomas Riveros (GK)'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/monagas/monagas-logo-footylogos.svg',
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
    starPlayers: ['Lautaro Morales (GK)', 'Kendrys Silva (RB)', 'Juan Camilo Zapata (ST)', 'Samuel Sosa (RW)', 'Jovanny Bolívar (ST)', 'Yanniel Hernández (LB)', 'Charlis Ortiz (ST)', 'Vicente Rodríguez (CM)', 'Francisco Solé (CDM)', 'Juan Manuel Cuesta (CAM)', 'Carlos Cermeño (CM)'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/venezuela/1500x1500/universidad-central.dce028a7.png',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/estudiantes-merida/estudiantes-merida-logo-footylogos.svg',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/portuguesa/portuguesa-logo-footylogos.svg',
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
    badgeImageUrl: 'badges/tm/deportivo_anzoategui.png',
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
    starPlayers: ['Arles Flores (CDM)', 'Richard Celis (LW)', 'Carlos Lujano (CB)', 'Jhonny González (RB)', 'Moisés Gallo (GK)', 'Anthony Matos (CB)', 'Gabriel Benítez (LB)', 'Junior Cedeño (CDM)', 'Erickson Gallardo (RW)', 'Raudy Guerrero (RW)', 'Freddy Espinal (LW)'],
    description: 'Equipo compitiendo en Liga Venezolana.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/zamora/zamora-logo-footylogos.svg',
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
    starPlayers: ['Julián Figueroa (CDM)', 'Kevin De la Hoz (CB)', 'Juan Carlos Ortíz (RW)', 'Jorge Páez (CM)', 'José Rivas (ST)', 'Francisco Bareiro (ST)', 'Luis Terán (GK)', 'Steven Pabón (CB)', 'Marlon Fernández (CAM)', 'Enderson Torrealba (RW)', 'Kevin González (CDM)'],
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
    starPlayers: ['Rodrigo Gómez (LM)', 'Emilio Izaguirre (LB)', 'Alejandro Reyes (CM)', 'Rodrigo De Olivera (ST)', 'Marlon Licona (GK)', 'John Kleber (ST)', 'Luis Crisanto (RB)', 'Jorge Serrano (LW)', 'Luis Vega (CB)', 'Pablo Cacho (CB)', 'Cristopher Meléndez (RB)'],
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
    starPlayers: ['Óscar Duarte (CB)', 'Mariano Torres (CAM)', 'Kendall Waston (CB)', 'Fidel Escobar (CB)', 'David Guzmán (CDM)', 'Joseph Mora (LB)', 'Ricardo Blanco (RB)', 'Gerson Torres (RW)', 'Newton Williams (ST)', 'Pablo Arboine (CB)', 'Gerald Taylor (RB)'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Escudo_Saprissa_2012.svg',
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
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Logo_de_la_Liga_Deportiva_Alajuelense.svg',
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
    badgeImageUrl: 'https://assets.football-logos.cc/logos/costa-rica/1500x1500/herediano.3b1f767d.png',
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
    badgeImageUrl: 'https://assets.football-logos.cc/logos/egypt/1500x1500/al-ahly.d315a46b.png',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/urawa-red-diamonds/urawa-red-diamonds-logo-footylogos.svg',
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
    starPlayers: ['Themba Zwane (CAM)', 'Peter Shalulile (ST)', 'Ronwen Williams (GK)', 'Denis Onyango (GK)', 'Nuno Santos (LM)', 'Iqraam Rayners (ST)', 'Miguel Reisinho (CM)', 'Brayan León (ST)', 'Aubrey Modiba (LB)', 'Thapelo Morena (RB)', 'Khuliso Mudau (RB)'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/mamelodi-sundowns/mamelodi-sundowns-logo-footylogos.svg',
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
    starPlayers: ['Youcef Belaïli (LW)', 'Hamza Jelassi (CB)', 'Yassine Meriah (CB)', 'Yan Sasse (RW)', 'Bechir Ben Said (GK)', 'Mohamed Amine Tougai (CB)', 'Chiheb Jebali (CAM)', 'Mohamed Amine Ben Hamida (LB)', 'Kouceila Boualia (RW)', 'Houssem Tka (CM)', 'Florian Thomas Danho (ST)'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/esperance-sportive-de-tunis/esperance-sportive-de-tunis-logo-footylogos.svg',
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
    badgeImageUrl: 'badges/tm/wydad_casablanca.png',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/jorge-wilstermann/jorge-wilstermann-logo-footylogos.svg',
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
    starPlayers: ['Hernâni (RM)', 'Ronaldo (ST)', 'Dênis Jr (GK)', 'Zé Mário (LB)', 'Lucas Rodrigues (RB)', 'Gustavo Medina (CB)', 'Netinho (CDM)', 'Albano (CAM)', 'Ronaldo Alves (CB)', 'Alencar (CM)', 'Thiago Lopes (LM)'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ferroviaria/ferroviaria-logo-footylogos.svg',
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
    starPlayers: ['Kayke (ST)', 'Caio Roque (LB)', 'Wellington Silva (RB)', 'Bruno Barra (CDM)', 'Léo Ceará (CAM)', 'Thallyson (CDM)', 'João Pedro (RW)', 'Marquinhos (LW)', 'Italo (ST)', 'Chay (CAM)', 'Jefferson Paulino (GK)'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/volta-redonda/volta-redonda-logo-footylogos.svg',
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
    starPlayers: ['Thiago Heleno (CB)', 'Maurício (CB)', 'Rossi (RM)', 'PK (LB)', 'Edinho (CAM)', 'Matheus Vargas (CM)', 'Yeferson Quintana (CB)', 'Dudu Vieira (CM)', 'Petterson (LW)', 'Gabriel Mesquita (GK)', 'Denner (CAM)'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/paysandu/paysandu-logo-footylogos.svg',
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
    starPlayers: ['Akapo (RB)', 'Kevin Ramírez (CB)', 'Leo Coelho (CB)', 'Renan (GK)', 'Henrique (ST)', 'Joaquín Torres (CAM)', 'João Lopes (GK)', 'Luan Silva (ST)', 'Riza Durmisi (LB)', 'Fabiano (LB)', 'Rafael Tavares (CAM)'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/amazonas/amazonas-logo-footylogos.svg',
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
    badgeImageUrl: 'badges/tm/atletico_tembetary.png',
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
    badgeImageUrl: 'badges/tm/general_caballero.png',
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
    starPlayers: ['Facundo Píriz (CDM)', 'Haibrany Ruíz Díaz (CB)', 'Gonzalo Bueno (LW)', 'Ángel Cayetano (CDM)', 'Pablo García (RM)', 'Guillermo Reyes (GK)', 'Matías Velázquez (CB)', 'Benjamín Acosta (RW)', 'Máximo Lorenzi (CB)', 'Joaquín Silva (GK)', 'Diego Villalba (CM)'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/plaza-colonia/plaza-colonia-logo-footylogos.svg',
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
    starPlayers: ['Federico Alonso (CB)', 'Jhonny Da Silva (GK)', 'Mauricio Gómez (RB)', 'Guzmán Pereira (CM)', 'Nicolás Latorre (CDM)', 'Sebastián Diana (CB)', 'Ayrton Castro (LB)', 'Emiliano Saliadarre (ST)', 'Ignacio Yepez (CAM)', 'Diego Núñez (CDM)', 'Andrés Olivera (CB)'],
    description: 'Equipo compitiendo en Resto del Mundo.',
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white',
    badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/miramar-misiones/miramar-misiones-logo-footylogos.svg',
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
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Club_Atletico_River_Plate.svg',
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
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/yaracuyanos/yaracuyanos-logo-footylogos.svg',
    division: 1
  },
  // ==========================================
  // --- ALEMANIA (PRIMERA) ---
  // ==========================================
  { id: '1_fc_koln', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: '1. FC Köln', league: 'Alemana', dt: 'René Wagner', reputation: 4, initialSalary: 2000, marketValue: 96000000, starPlayers: ['Marvin Schwäbe (GK)', 'Eric Martel (CDM)', 'Jakub Kamiński (LM)', 'Said El Mala (LM)', 'Marius Bülter (ST)', 'Alessio Castro-Montes (RM)', 'Ísak Bergmann Jóhannesson (CM)', 'Ragnar Ache (ST)', 'Tom Krauß (CDM)', 'Ron-Robert Zieler (GK)', 'Sebastian Sebulonsen (RB)'], description: '1. FC Köln. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-slate-900/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'badges/clubs/1_fc_koln.png', division: 1 },
  { id: '1_fsv_mainz_05', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: '1. FSV Mainz 05', league: 'Alemana', dt: 'Urs Fischer', reputation: 4, initialSalary: 2000, marketValue: 142175000, starPlayers: ['Kaishū Sano (CDM)', 'Nadiem Amiri (CM)', 'Stefan Posch (RB)', 'Anthony Caci (RB)', 'Robin Zentner (GK)', 'Dominik Kohr (CB)', 'Paul Nebel (CAM)', 'Lee Jae Sung (CAM)', 'Danny da Costa (CB)', 'Phillipp Mwene (LB)', 'Benedict Hollerbach (ST)'], description: '1. FSV Mainz 05. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'badges/tm/1_fsv_mainz_05.png', division: 1 },
  { id: 'borussia_dortmund', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'Borussia Dortmund', league: 'Alemana', dt: 'Niko Kovac', reputation: 5, initialSalary: 108800, marketValue: 565900000, starPlayers: ['Gregor Kobel (GK)', 'Nico Schlotterbeck (CB)', 'Serhou Guirassy (ST)', 'Felix Nmecha (CM)', 'Waldemar Anton (CB)', 'Julian Brandt (CAM)', 'Jobe Bellingham (CM)', 'Emre Can (CB)', 'Marcel Sabitzer (CDM)', 'Julian Ryerson (RB)', 'Maximilian Beier (ST)'], description: 'Borussia Dortmund. Compite en Bundesliga, tras la salida de Karim Adeyemi al FC Barcelona.', badgeColor: 'border-l-4 border-yellow-400 bg-zinc-950/40 text-yellow-300', badgeLogoUrl: '💛🖤',
    badgeImageUrl: 'badges/clubs/borussia_dortmund.png', division: 1 },
  { id: 'borussia_monchengladbach', themeColor: { primary: '#d4d4d8', secondary: '#f5f0e8' }, name: 'Borussia Mönchengladbach', league: 'Alemana', dt: 'Eugen Polanski', reputation: 4, initialSalary: 57700, marketValue: 155425000, starPlayers: ['Adalid Terrazas Abasto (CAM)', 'Rodrigo Emanuel Saracho (GK)', 'Máximo David Alonso Fontes (LM)', 'Erwin Junior Sánchez Paniagua (CAM)'], description: 'Borussia Mönchengladbach. Compite en Bundesliga.', badgeColor: 'border-l-4 border-zinc-300 bg-zinc-950/40 text-zinc-200', badgeLogoUrl: '⚫⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/borussia-monchengladbach/borussia-monchengladbach-logo-footylogos.svg', division: 1 },
  { id: 'eintracht_frankfurt', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Eintracht Frankfurt', league: 'Alemana', dt: 'Adi Hütter', reputation: 4, initialSalary: 44500, marketValue: 407435000, starPlayers: ['Jonathan Burkardt (ST)', 'Ritsu Doan (RM)', 'Robin Koch (CB)', 'Nathaniel Brown (LB)', 'Arthur Theate (CB)', 'Rasmus Kristensen (RB)', 'Mario Götze (CM)', 'Can Uzun (CAM)', 'Hugo Larsson (CM)', 'Arnaud Kalimuendo (ST)', 'Ellyes Skhiri (CDM)'], description: 'Eintracht Frankfurt. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '⚫🔴',
    badgeImageUrl: 'badges/clubs/eintracht_frankfurt.png', division: 1 },
  { id: 'fc_augsburg', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'FC Augsburg', league: 'Alemana', dt: 'Manuel Baum', reputation: 4, initialSalary: 18700, marketValue: 150725000, starPlayers: ['Jeffrey Gouweleeuw (CB)', 'Chrislain Matsima (CB)', 'Finn Dahmen (GK)', 'Dimitris Giannoulis (LB)', 'Alexis Claude-Maurice (CAM)', 'Keven Schlotterbeck (CB)', 'Kristijan Jakić (CDM)', 'Han-Noah Massengo (CDM)', 'Michael Gregoritsch (ST)', 'Cédric Zesiger (CB)', 'Robin Fellhauer (CDM)'], description: 'FC Augsburg. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-green-950/40 text-red-200', badgeLogoUrl: '🔴🟢',
    badgeImageUrl: 'badges/clubs/fc_augsburg.png', division: 1 },
  { id: 'fc_bayern_munchen', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'FC Bayern München', league: 'Alemana', dt: 'Vincent Kompany', reputation: 5, initialSalary: 164000, marketValue: 852900000, starPlayers: ['Harry Kane (ST)', 'Jamal Musiala (CAM)', 'Joshua Kimmich (CDM)', 'Michael Olise (RW)', 'Jonathan Tah (CB)', 'Konrad Laimer (RB)', 'Serge Gnabry (LW)', 'Leon Goretzka (CM)', 'Raphael Guerreiro (LB)', 'Nicolas Jackson (ST)', 'Manuel Neuer (GK)'], description: 'FC Bayern München. Compite en Bundesliga, reforzado con Jonathan Tah (Leverkusen), Raphael Guerreiro y Nicolas Jackson.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/bayern-munchen.1eac18e8.png', division: 1 },
  { id: 'fc_heidenheim', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'FC Heidenheim', league: 'Alemana', dt: 'Frank Schmidt', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Alejandro Chumacero (CM)', 'Alejandro Bejarano (CM)', 'Jairo Cuéllar (GK)', 'Denilson Valda (RB)'], description: 'FC Heidenheim. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔴🔵',
    badgeImageUrl: 'badges/clubs/fc_heidenheim.png', division: 1 },
  { id: 'fc_st_pauli', themeColor: { primary: '#92400e', secondary: '#f5f0e8' }, name: 'FC St. Pauli', league: 'Alemana', dt: 'Marcel Rapp', reputation: 4, initialSalary: 2000, marketValue: 37700000, starPlayers: ['Nikola Vasilj (GK)', 'Hauke Wahl (CB)', 'Eric Smith (CB)', 'Jackson Irvine (CM)', 'Mathias Rasmussen (CM)', 'Mathias Pereira Lage (ST)', 'Manolis Saliakas (RB)', 'Joel Chima Fujita (CM)', 'Martijn Kaars (ST)', 'James Sands (CDM)', 'Danel Sinani (CAM)'], description: 'FC St. Pauli. Compite en Bundesliga.', badgeColor: 'border-l-4 border-amber-800 bg-zinc-950/40 text-amber-200', badgeLogoUrl: '🟤⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-st-pauli/fc-st-pauli-logo-footylogos.svg', division: 1 },
  { id: 'rb_leipzig', themeColor: { primary: '#ef4444', secondary: '#f5f0e8' }, name: 'RB Leipzig', league: 'Alemana', dt: 'Martín Demichelis', reputation: 5, initialSalary: 97200, marketValue: 505550000, starPlayers: ['Péter Gulácsi (GK)', 'Willi Orban (CB)', 'David Raum (LB)', 'Castello Lukeba (CB)', 'Christoph Baumgartner (CAM)', 'Benjamin Henrichs (RB)', 'Ridle Baku (RB)', 'Nicolas Seiwald (CDM)', 'Yan Diomande (RW)', 'Rômulo (ST)', 'Antonio Nusa (LW)'], description: 'RB Leipzig. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-500 bg-slate-900/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'badges/clubs/rb_leipzig.png', division: 1 },
  { id: 'sc_freiburg', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'SC Freiburg', league: 'Alemana', dt: 'Julian Schuster', reputation: 4, initialSalary: 24100, marketValue: 188625000, starPlayers: ['Matthias Ginter (CB)', 'Vincenzo Grifo (LM)', 'Noah Atubolu (GK)', 'Philipp Lienhart (CB)', 'Christian Günter (LB)', 'Maximilian Eggestein (CDM)', 'Jan-Niklas Beste (RM)', 'Johan Manzambi (CM)', 'Lukas Kübler (RB)', 'Philipp Treu (RB)', 'Yuito Suzuki (CAM)'], description: 'SC Freiburg. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚫',
    badgeImageUrl: 'badges/clubs/sc_freiburg.png', division: 1 },
  { id: 'sv_werder_bremen', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'SV Werder Bremen', league: 'Alemana', dt: 'Daniel Thioune', reputation: 4, initialSalary: 2000, marketValue: 204425000, starPlayers: ['Roberto José Rosales Altuve (RB)', 'Maurice Jesús Cova Sánchez (CM)', 'Carlos José Sosa Moreno (CAM)', 'Jesús David Camargo Villafañe (GK)'], description: 'SV Werder Bremen. Compite en Bundesliga.', badgeColor: 'border-l-4 border-green-600 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/SV-Werder-Bremen-Logo.svg', division: 1 },
  { id: 'tsg_hoffenheim', themeColor: { primary: '#3b82f6', secondary: '#f5f0e8' }, name: 'TSG Hoffenheim', league: 'Alemana', dt: 'Christian Ilzer', reputation: 4, initialSalary: 39900, marketValue: 207650000, starPlayers: ['Harrison Contreras Mora (CM)', 'Gerardo José Padrón Colmenares (LM)', 'Junior José Paredes Jaspe (ST)', 'Mamadou Mbaye (CB)'], description: 'TSG Hoffenheim. Compite en Bundesliga.', badgeColor: 'border-l-4 border-blue-500 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/tsg-hoffenheim/tsg-hoffenheim-logo-footylogos.svg', division: 1 },
  { id: 'union_berlin', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: '1. FC Union Berlin', league: 'Alemana', dt: 'Mauro Lustrinelli', reputation: 4, initialSalary: 2000, marketValue: 127460000, starPlayers: ['Frederik Rønnow (GK)', 'Danilho Doekhi (CB)', 'Leopold Querfeld (CB)', 'Diogo Leite (CB)', 'Rani Khedira (CDM)', 'Christopher Trimmel (RB)', 'Derrick Köhn (LB)', 'Aljoscha Kemlein (CM)', 'András Schäfer (CM)', 'Andrej Ilić (ST)', 'Janik Haberer (CM)'], description: '1. FC Union Berlin. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-yellow-300', badgeLogoUrl: '🔴🟡',
    badgeImageUrl: 'badges/clubs/union_berlin.png', division: 1 },
  { id: 'vfl_wolfsburg', themeColor: { primary: '#22c55e', secondary: '#f5f0e8' }, name: 'VfL Wolfsburg', league: 'Alemana', dt: 'Tobias Strobl', reputation: 4, initialSalary: 55400, marketValue: 230625000, starPlayers: ['Kamil Grabara (GK)', 'Mohamed Amoura (ST)', 'Maximilian Arnold (CDM)', 'Joakim Mæhle (LB)', 'Patrick Wimmer (LM)', 'Lovro Majer (CAM)', 'Denis Vavro (CB)', 'Moritz Jenz (CB)', 'Konstantinos Koulierakis (CB)', 'Christian Eriksen (CAM)', 'Mattias Svanberg (CM)'], description: 'VfL Wolfsburg. Compite en Bundesliga.', badgeColor: 'border-l-4 border-green-500 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vfl-wolfsburg/vfl-wolfsburg-logo-footylogos.svg', division: 1 },
  { id: 'vfb_stuttgart', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'VfB Stuttgart', league: 'Alemana', dt: 'Sebastian Hoenss', reputation: 4, initialSalary: 32600, marketValue: 355725000, starPlayers: ['Maximilian Mittelstädt (LB)', 'Angelo Stiller (CDM)', 'Deniz Undav (ST)', 'Alexander Nübel (GK)', 'Julian Chabot (CB)', 'Ermedin Demirović (ST)', 'Jamie Leweling (RM)', 'Bilal El Khannouss (CAM)', 'Atakan Karazor (CDM)', 'Chris Führich (LM)', 'Tiago Tomás (LM)'], description: 'VfB Stuttgart. Compite en Bundesliga.', badgeColor: 'border-l-4 border-red-600 bg-slate-900/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vfb-stuttgart/vfb-stuttgart-logo-footylogos.svg', division: 1 },
  { id: 'bayer_leverkusen', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Bayer 04 Leverkusen', league: 'Alemana', dt: 'Carles Martínez', reputation: 5, initialSalary: 67800, marketValue: 352750000, starPlayers: ['Edmond Tapsoba (CB)', 'Patrik Schick (ST)', 'Aleix García (CM)', 'Exequiel Palacios (CM)', 'Jarell Quansah (CB)', 'Malik Tillman (CAM)', 'Robert Andrich (CB)', 'Martin Terrier (CAM)', 'Ibrahim Maza (CAM)', 'Nathan Tella (RM)', 'Loïc Badé (CB)'], description: 'Bayer 04 Leverkusen. Compite en Bundesliga, tras las salidas de Alejandro Grimaldo (Atlético de Madrid) y Jonathan Tah (Bayern Múnich).', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-300', badgeLogoUrl: '🔴⚫',
    badgeImageUrl: 'badges/clubs/bayer_leverkusen.png', division: 1 },
  { id: 'hamburg', themeColor: { primary: '#1d4ed8', secondary: '#f5f0e8' }, name: 'Hamburger SV', league: 'Alemana', dt: 'Merlin Polzin', reputation: 4, initialSalary: 2000, marketValue: 91325000, starPlayers: ['Luka Vušković (CB)', 'Daniel Heuer Fernandes (GK)', 'Albert Sambi Lokonga (CM)', 'Fábio Vieira (CM)', 'Miro Muheim (LB)', 'Jean-Luc Dompé (LW)', 'Jordan Torunarigha (CB)', 'Albert Grønbæk (CAM)', 'Nicolai Remberg (CM)', 'Philip Otele (LM)', 'Daniel Elfadli (CB)'], description: 'Hamburger SV. Compite en Bundesliga.', badgeColor: 'border-l-4 border-blue-700 bg-zinc-950/40 text-blue-200', badgeLogoUrl: '🔵⚫',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/hamburger-sv/hamburger-sv-logo-footylogos.svg', division: 1 },
  // ==========================================
  // --- ALEMANIA (SEGUNDA) ---
  // ==========================================
  { id: '1_fc_kaiserslautern', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: '1. FC Kaiserslautern', league: 'Alemana', dt: 'Torsten Lieberknecht', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Mergim Berisha (ST)', 'Naatan Skyttä (CAM)', 'Luca Sirch (CB)', 'Paul Joly (RB)', 'Semih Sahin (CDM)', 'Julian Krahl (GK)', 'Fabian Kunze (CDM)', 'Marlon Ritter (CAM)', 'Jacob Rasmussen (CB)', 'Daniel Hanslik (ST)', 'Ivan Prtajin (ST)'], description: '1. FC Kaiserslautern. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'badges/clubs/1_fc_kaiserslautern.png', division: 2 },
  { id: '1_fc_nurnberg', themeColor: { primary: '#991b1b', secondary: '#f5f0e8' }, name: '1. FC Nürnberg', league: 'Alemana', dt: 'Miroslav Klose', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Julian Justvan (CAM)', 'Finn Ole Becker (CM)', 'Luka Lochoshvili (CB)', 'Rabby Nzingoula (CDM)', 'Jan Reichert (GK)', 'Fabio Gruber (CB)', 'Berkay Yilmaz (LB)', 'Adam Markhiev (CDM)', 'Rafael Lubach (CM)', 'Mohamed Alì Zoma (ST)', 'Henri Koudossou (RB)'], description: '1. FC Nürnberg. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-red-800 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-nurnberg/fc-nurnberg-logo-footylogos.svg', division: 2 },
  { id: 'darmstadt_98', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Darmstadt 98', league: 'Alemana', dt: 'Florian Kohfeldt', reputation: 2, initialSalary: 800, marketValue: 30275000, starPlayers: ['Tim Kleindienst (ST)', 'Franck Honorat (RM)', 'Rocco Reitz (CM)', 'Robin Hack (LM)'], description: 'Darmstadt 98. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'badges/clubs/darmstadt_98.png', division: 2 },
  { id: 'eintracht_braunschweig', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'Eintracht Braunschweig', league: 'Alemana', dt: 'Lars Kornetka', reputation: 2, initialSalary: 800, marketValue: 4000000, starPlayers: ['Ron-Thorben Hoffmann (GK)', 'Lino Tempelmann (CM)', 'Elhan Kastrati (GK)', 'Mehmet Can Aydın (RM)', 'Robin Heußer (CM)', 'Erencan Yardımcı (ST)', 'Frederik Jäkel (CB)', 'Kevin Ehlers (CB)', 'Lukas Frenkert (CB)', 'Max Marie (CM)', 'Leon Bell Bell (LB)'], description: 'Eintracht Braunschweig. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-yellow-400 bg-blue-950/40 text-yellow-300', badgeLogoUrl: '🦁🟡',
    badgeImageUrl: 'badges/clubs/eintracht_braunschweig.png', division: 2 },
  { id: 'fortuna_dusseldorf', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Fortuna Düsseldorf', league: 'Alemana', dt: 'Alexander Ende', reputation: 2, initialSalary: 800, marketValue: 32300000, starPlayers: ['Florian Kastenmeier (GK)', 'Tim Oberdorf (CB)', 'Florent Muslija (CAM)', 'Jesper Daland (CB)', 'Cedric Itten (ST)', 'Marin Ljubičić (ST)', 'Anouar El Azzouzi (CDM)', 'Matthias Zimmermann (RB)', 'Tim Breithaupt (CDM)', 'Emmanuel Iyoha (LM)', 'Christopher Lenz (LB)'], description: 'Fortuna Düsseldorf. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-red-600 bg-slate-900/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'badges/clubs/fortuna_dusseldorf.png', division: 2 },
  { id: 'greuther_furth', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'Greuther Fürth', league: 'Alemana', dt: 'Heiko Vogel', reputation: 2, initialSalary: 800, marketValue: 14875000, starPlayers: ['Victor Okoh Boniface (ST)', 'Cameron Mitchel Puertas Castro (CAM)', 'Jens Dalsgaard Stage (CM)', 'Mitchell-Elijah Weiser (RB)'], description: 'Greuther Fürth. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-green-600 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪',
    badgeImageUrl: 'badges/tm/greuther_furth.png', division: 2 },
  { id: 'hannover_96', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'Hannover 96', league: 'Alemana', dt: 'Christian Titz', reputation: 2, initialSalary: 800, marketValue: 13950000, starPlayers: ['Enzo Leopold (CM)', 'Benjamin Källman (ST)', 'Boris Tomiak (CB)', 'Maurice Neubauer (LB)', 'Elias Saad (LW)', 'Noah Weißhaupt (LM)', 'Virgil Ghiță (CB)', 'Noël Aséko (CDM)', 'Daisuke Yokota (RW)', 'Maik Nawrocki (CB)', 'Mustapha Bundu (RW)'], description: 'Hannover 96. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-green-600 bg-zinc-950/40 text-green-200', badgeLogoUrl: '🟢⚫',
    badgeImageUrl: 'badges/clubs/hannover_96.png', division: 2 },
  { id: 'hertha_bsc', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Hertha BSC', league: 'Alemana', dt: 'Stefan Leitl', reputation: 2, initialSalary: 26400, marketValue: 22885000, starPlayers: ['Fabian Reese (LM)', 'Josip Brekalo (LM)', 'Michaël Cuisance (CM)', 'Tjark Ernst (GK)', 'Paul Seguin (CDM)', 'Dawid Kownacki (ST)', 'Toni Leistner (CB)', 'Márton Dárdai (CB)', 'Michał Karbownik (LB)', 'Diego Demme (CDM)', 'Linus Gechter (CB)'], description: 'Hertha BSC. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/hertha-bsc/hertha-bsc-logo-footylogos.svg', division: 2 },
  { id: 'karlsruher_sc', themeColor: { primary: '#0ea5e9', secondary: '#f5f0e8' }, name: 'Karlsruher SC', league: 'Alemana', dt: 'Maximilian Senft', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Marvin Wanitzek (CM)', 'Marcel Franke (CB)', 'Sebastian Jung (RB)', 'David Herold (LB)', 'Fabian Schleusener (ST)', 'Christoph Kobald (CB)', 'Dženis Burnić (CM)', 'Nicolai Rapp (CB)', 'Marcel Beifus (CB)', 'Hans Christian Bernat (GK)', 'Stephan Ambrosius (CB)'], description: 'Karlsruher SC. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-sky-500 bg-sky-950/40 text-sky-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/karlsruher-sc/karlsruher-sc-logo-footylogos.svg', division: 2 },
  { id: 'magdeburg', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Magdeburg', league: 'Alemana', dt: 'Petrik Sander', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: '1. FC Magdeburg. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'badges/tm/magdeburg.png', division: 2 },
  { id: 'preussen_munster', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'Preußen Münster', league: 'Alemana', dt: 'Thomas Wörle', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Johannes Schenk (GK)', 'Jorrit Hendrix (CDM)', 'Oliver Batista Meier (CAM)', 'Paul Jaeckel (CB)', 'Joshua Mees (CAM)', 'Shin Yamada (ST)', 'Jano ter Horst (RB)', 'Jannis Heuer (CB)', 'Marcel Benger (CDM)', 'Marvin Schulz (CM)', 'Rico Preißinger (CDM)'], description: 'Preußen Münster. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-green-600 bg-zinc-950/40 text-green-200', badgeLogoUrl: '⚫💚', division: 2 },
  { id: 'schalke_04', themeColor: { primary: '#1d4ed8', secondary: '#f5f0e8' }, name: 'FC Schalke 04', league: 'Alemana', dt: 'Miron Muslic', reputation: 2, initialSalary: 800, marketValue: 21400000, starPlayers: ['Edin Džeko (ST)', 'Moussa N\'Diaye (LB)', 'Dejan Ljubičić (CM)', 'Kenan Karaman (CAM)', 'Loris Karius (GK)', 'Nikola Katić (CB)', 'Moussa Sylla (ST)', 'Kevin Müller (GK)', 'Timo Becker (CB)', 'Hasan Kuruçay (CB)', 'Ron Schallenberg (CDM)'], description: 'FC Schalke 04. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-700 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'badges/clubs/schalke_04.png', division: 2 },
  { id: 'sc_paderborn_07', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'SC Paderborn 07', league: 'Alemana', dt: 'Ralf Kettemann', reputation: 2, initialSalary: 800, marketValue: 7675000, starPlayers: ['Felix Götze (CB)', 'Raphael Obermair (RM)', 'Filip Bilbija (CAM)', 'Calvin Brackelmann (CB)', 'Dennis Seimen (GK)', 'Tjark Scheller (CB)', 'Laurin Curda (RM)', 'Santiago Castañeda (CDM)', 'Mika Baur (CM)', 'Steffen Tigges (ST)', 'Sebastian Klaas (CM)'], description: 'SC Paderborn 07. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'badges/clubs/sc_paderborn_07.png', division: 2 },
  { id: 'sv_elversberg', themeColor: { primary: '#3b82f6', secondary: '#f5f0e8' }, name: 'SV Elversberg', league: 'Alemana', dt: 'Vincent Wagner', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Nicolas Kristof (GK)', 'Lukas Petkov (RM)', 'Lukas Pinckert (CB)', 'Maximilian Rohr (CB)', 'Tom Zimmerschied (LM)', 'Łukasz Poręba (CDM)', 'Immanuel Pherai (CAM)', 'Florian Le Joncour (CB)', 'Bambasé Conté (CAM)', 'Jan Gyamerah (RB)', 'Lasse Günther (LB)'], description: 'SV Elversberg. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-500 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sv-elversberg/sv-elversberg-logo-footylogos.svg', division: 2 },
  { id: 'holstein_kiel', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Holstein Kiel', league: 'Alemana', dt: 'Tim Walter', reputation: 2, initialSalary: 800, marketValue: 21575000, starPlayers: ['Alexander Bernhardsson (RM)', 'David Zec (CB)', 'Jonas Meffert (CDM)', 'Umut Tohumcu (CAM)', 'John Tolkin (LB)', 'Steven Skrzybski (ST)', 'Stefan Schwab (CM)', 'Carl Johansson (CB)', 'Marco Komenda (CB)', 'Marko Ivezić (CB)', 'Jonas Therkelsen (CAM)'], description: 'Holstein Kiel. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'badges/clubs/holstein_kiel.png', division: 2 },
  { id: 'vfl_bochum', themeColor: { primary: '#0284c7', secondary: '#f5f0e8' }, name: 'VfL Bochum', league: 'Alemana', dt: 'Uwe Rösler', reputation: 2, initialSalary: 800, marketValue: 25150000, starPlayers: ['Timo Horn (GK)', 'Kevin Vogt (CB)', 'Maximilian Wittek (LB)', 'Matúš Bero (CM)', 'Philipp Hofmann (ST)', 'Oliver Olsen (RB)', 'Gerrit Holtmann (LM)', 'Ibrahim Sissoko (ST)', 'Philipp Strompf (CB)', 'Koji Miyoshi (RM)', 'Marcel Sobottka (CDM)'], description: 'VfL Bochum. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-sky-600 bg-blue-950/40 text-sky-200', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vfl-bochum/vfl-bochum-logo-footylogos.svg', division: 2 },
  { id: 'arminia_bielefeld', themeColor: { primary: '#38bdf8', secondary: '#f5f0e8' }, name: 'Arminia Bielefeld', league: 'Alemana', dt: 'Oliver Kirch', reputation: 2, initialSalary: 800, marketValue: 11500000, starPlayers: ['Marvin Mehlem (CM)', 'Maximilian Bauer (CB)', 'Robin Knoche (CB)', 'Mael Corboz (CM)', 'Stefano Russo (CDM)', 'Jonas Kersken (GK)', 'Tim Handwerker (LB)', 'Thaddäus-Monju Momuluh (RM)', 'Marius Wörl (CM)', 'Joel Grodowski (ST)', 'Noah Joel Sarenren Bazee (RW)'], description: 'Arminia Bielefeld. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-sky-400 bg-zinc-950/40 text-sky-200', badgeLogoUrl: '⚫🔵',
    badgeImageUrl: 'badges/clubs/arminia_bielefeld.png', division: 2 },
  { id: 'dynamo_dresden', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'Dynamo Dresden', league: 'Alemana', dt: 'Thomas Stamm', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Niklas Hauptmann (CM)', 'Christoph Daferner (ST)', 'Elias Bethke (GK)', 'Tim Schreiber (GK)', 'Thomas Keller (CB)', 'Alexander Rossipal (LB)', 'Robert Wagner (CM)', 'Jakob Lemmer (RW)', 'Vinko Šapina (CDM)', 'Jonas Sterner (RB)', 'Vincent Vermeij (ST)'], description: 'Dynamo Dresden. Compite en Bundesliga 2.', badgeColor: 'border-l-4 border-yellow-400 bg-zinc-950/40 text-yellow-300', badgeLogoUrl: '💛🖤',
    badgeImageUrl: 'badges/clubs/dynamo_dresden.png', division: 2 },
  // ==========================================
  // --- INGLATERRA (PREMIER LEAGUE) ---
  // ==========================================
  { id: 'arsenal', themeColor: { primary: '#EF0107', secondary: '#9C824A' }, name: 'Arsenal', league: 'Inglesa', dt: 'Mikel Arteta', reputation: 5, initialSalary: 105500, marketValue: 1296750000, starPlayers: ['Gabriel (CB)', 'William Saliba (CB)', 'Declan Rice (CDM)', 'David Raya (GK)', 'Bukayo Saka (RW)', 'Viktor Gyökeres (ST)', 'Martin Ødegaard (CM)', 'Zubimendi (CDM)', 'Jurriën Timber (RB)', 'Eberechi Eze (CAM)', 'Piero Hincapié (CB)'], description: 'Arsenal. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/arsenal.png', division: 1 },
  { id: 'chelsea', themeColor: { primary: '#034694', secondary: '#EE242C' }, name: 'Chelsea', league: 'Inglesa', dt: 'Xabi Alonso', reputation: 5, initialSalary: 169700, marketValue: 1138225000, starPlayers: ['Moisés Caicedo (CDM)', 'Cole Palmer (CAM)', 'Levi Colwill (CB)', 'Enzo Fernández (CM)', 'Reece James (RB)', 'Pedro Neto (RM)', 'Robert Sánchez (GK)', 'João Pedro (ST)', 'Trevoh Chalobah (CB)', 'Andrey Santos (CM)', 'Jamie Bynoe-Gittens (LW)'], description: 'Chelsea. Compite en Premier League, reforzado con Bynoe-Gittens (Dortmund) tras la salida de Marc Cucurella al Real Madrid (55M€).', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/chelsea.png', division: 1 },
  { id: 'liverpool_eng', themeColor: { primary: '#C8102E', secondary: '#00B2A9' }, name: 'Liverpool', league: 'Inglesa', dt: 'Andoni Iraola', reputation: 5, initialSalary: 169100, marketValue: 1119150000, starPlayers: ['Marcos Senesi (CB)', 'Alisson (GK)', 'Virgil van Dijk (CB)', 'Florian Wirtz (CAM)', 'Alexander Isak (ST)', 'Dominik Szoboszlai (CAM)', 'Ryan Gravenberch (CDM)', 'Alexis Mac Allister (CM)', 'Adam Wharton (CM)', 'Hugo Ekitiké (ST)', 'Cody Gakpo (LM)'], description: 'Liverpool. Compite en Premier League, tras la salida como agentes libres de Mohamed Salah, Andy Robertson e Ibrahima Konaté.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/liverpool_eng.png', division: 1 },
  { id: 'manchester_city', themeColor: { primary: '#6CABDD', secondary: '#1C2C5B' }, name: 'Manchester City', league: 'Inglesa', dt: 'Enzo Maresca', reputation: 5, initialSalary: 201900, marketValue: 1440975000, starPlayers: ['Erling Haaland (ST)', 'Gianluigi Donnarumma (GK)', 'Rodri (CDM)', 'Rúben Dias (CB)', 'Phil Foden (CAM)', 'Tijjani Reijnders (CM)', 'Joško Gvardiol (CB)', 'Marc Guéhi (CB)', 'Antoine Semenyo (RW)', 'Mathys Detourbet (CM)', 'Rayan Cherki (RW)'], description: 'Manchester City. Compite en Premier League, tras la salida de Bernardo Silva al Real Madrid.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/manchester_city.png', division: 1 },
  { id: 'manchester_united', themeColor: { primary: '#DA291C', secondary: '#FBE122' }, name: 'Manchester United', league: 'Inglesa', dt: 'Michael Carrick', reputation: 5, initialSalary: 180200, marketValue: 704950000, starPlayers: ['Bruno Fernandes (CAM)', 'Bryan Mbeumo (RW)', 'Matheus Cunha (CAM)', 'Casemiro (CDM)', 'Matthijs de Ligt (CB)', 'Harry Maguire (CB)', 'Lisandro Martínez (CB)', 'Senne Lammens (GK)', 'Amad (RM)', 'Noussair Mazraoui (RB)', 'Benjamin Šeško (ST)'], description: 'Manchester United. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/manchester_united.png', division: 1 },
  { id: 'tottenham_hotspur', themeColor: { primary: '#132257', secondary: '#FFFFFF' }, name: 'Tottenham Hotspur', league: 'Inglesa', dt: 'Roberto De Zerbi', reputation: 4, initialSalary: 134000, marketValue: 866050000, starPlayers: ['Cristian Romero (CB)', 'Micky van de Ven (CB)', 'Sandro Tonali (CDM)', 'James Maddison (CM)', 'Dejan Kulusevski (CM)', 'Guglielmo Vicario (GK)', 'Pedro Porro (RB)', 'Xavi Simons (CAM)', 'Mohammed Kudus (RW)', 'Mathys Tel (ST)', 'Dominic Solanke (ST)'], description: 'Tottenham Hotspur. Compite en Premier League, con el fichaje récord del club de Sandro Tonali (£100M) desde Newcastle.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/tottenham_hotspur.png', division: 1 },
  { id: 'newcastle_united', themeColor: { primary: '#241F20', secondary: '#9BC4E2' }, name: 'Newcastle United', league: 'Inglesa', dt: 'Eddie Howe', reputation: 5, initialSalary: 46400, marketValue: 698850000, starPlayers: ['Bruno Guimarães (CM)', 'Joelinton (CM)', 'Bazoumana Touré (LW)', 'Sven Botman (CB)', 'Yoane Wissa (ST)', 'Fabian Schär (CB)', 'Malick Thiaw (CB)', 'Lewis Hall (LB)', 'Aaron Ramsdale (GK)', 'Nick Pope (GK)', 'Dan Burn (CB)'], description: 'Newcastle United. Compite en Premier League, tras las salidas de Sandro Tonali (Tottenham, £100M) y Anthony Gordon (Barcelona), reforzado con Bazoumana Touré desde el Hoffenheim.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/newcastle_united.png', division: 1 },
  { id: 'aston_villa', themeColor: { primary: '#670E36', secondary: '#95BFE5' }, name: 'Aston Villa', league: 'Inglesa', dt: 'Unai Emery', reputation: 4, initialSalary: 78500, marketValue: 503750000, starPlayers: ['Emiliano Martínez (GK)', 'Youri Tielemans (CM)', 'Ezri Konsa (CB)', 'Morgan Rogers (CAM)', 'Boubacar Kamara (CDM)', 'Ollie Watkins (ST)', 'Matty Cash (RB)', 'Amadou Onana (CDM)', 'John McGinn (RM)', 'Pau Torres (CB)', 'Lucas Digne (LB)'], description: 'Aston Villa. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/aston-villa/aston-villa-logo-footylogos.svg', division: 1 },
  { id: 'west_ham_united', themeColor: { primary: '#7A263A', secondary: '#1BB1E7' }, name: 'West Ham United', league: 'Inglesa', dt: 'Graham Potter', reputation: 4, initialSalary: 67900, marketValue: 436325000, starPlayers: ['Jarrod Bowen (RM)', 'Valentin Castellanos (ST)', 'Aaron Wan-Bissaka (RB)', 'El Hadji Malick Diouf (LB)', 'Mateus Fernandes (CM)', 'Crysencio Summerville (LM)', 'Jean-Clair Todibo (CB)', 'Konstantinos Mavropanos (CB)', 'Axel Disasi (CB)', 'Alphonse Areola (GK)', 'Callum Wilson (ST)'], description: 'West Ham United. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/west-ham-united/west-ham-united-logo-footylogos.svg', division: 2 },
  { id: 'brighton_hove_albion', name: 'Brighton & Hove Albion', league: 'Inglesa', dt: 'Fabian Hürzeler', reputation: 4, initialSalary: 47700, marketValue: 527100000, starPlayers: ['Kaoru Mitoma (LM)', 'Bart Verbruggen (GK)', 'Jan Paul van Hecke (CB)', 'Carlos Baleba (CDM)', 'Yankuba Minteh (RM)', 'Ferdi Kadıoğlu (LB)', 'Danny Welbeck (ST)', 'Yasin Ayari (CDM)', 'Maxim De Cuyper (LB)', 'Mats Wieffer (CDM)', 'Pascal Groß (CDM)'], description: 'Brighton & Hove Albion. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/brighton_hove_albion.png', division: 1 },
  { id: 'brentford', name: 'Brentford', league: 'Inglesa', dt: 'Keith Andrews', reputation: 3, initialSalary: 32000, marketValue: 421025000, starPlayers: ['Igor Thiago (ST)', 'Michael Kayode (RB)', 'Mikkel Damsgaard (CAM)', 'Caoimhin Kelleher (GK)', 'Kevin Schade (LM)', 'Mathias Jensen (CM)', 'Jordan Henderson (CDM)', 'Nathan Collins (CB)', 'Dango Ouattara (RM)', 'Sepp van den Berg (CB)', 'Yehor Yarmoliuk (CDM)'], description: 'Brentford. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/brentford.png', division: 1 },
  { id: 'crystal_palace', name: 'Crystal Palace', league: 'Inglesa', dt: 'Pierre Sage', reputation: 3, initialSalary: 46000, marketValue: 451335000, starPlayers: ['Dean Henderson (GK)', 'Daniel Muñoz (RB)', 'Jean-Philippe Mateta (ST)', 'Maxence Lacroix (CB)', 'Adam Wharton (CDM)', 'Ismaïla Sarr (RW)', 'Chris Richards (CB)', 'Tyrick Mitchell (LB)', 'Yeremy Pino (LW)', 'Brennan Johnson (RW)', 'Daichi Kamada (CM)'], description: 'Crystal Palace. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/crystal_palace.png', division: 1 },
  { id: 'everton_eng', name: 'Everton', league: 'Inglesa', dt: 'David Moyes', reputation: 3, initialSalary: 83400, marketValue: 433750000, starPlayers: ['Jordan Pickford (GK)', 'Iliman Ndiaye (RM)', 'Jack Grealish (LM)', 'James Tarkowski (CB)', 'James Garner (CDM)', 'Jarrad Branthwaite (CB)', 'Idrissa Gueye (CDM)', 'Kiernan Dewsbury-Hall (CAM)', 'Vitaliy Mykolenko (LB)', 'Dwight McNeil (LM)', 'Jake O\'Brien (RB)'], description: 'Everton. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/everton_eng.png', division: 1 },
  { id: 'fulham', name: 'Fulham', league: 'Inglesa', dt: 'Álvaro Arbeloa', reputation: 3, initialSalary: 28400, marketValue: 347600000, starPlayers: ['Antonee Robinson (LB)', 'Alex Iwobi (LM)', 'Samuel Chukwueze (RM)', 'Bernd Leno (GK)', 'Joachim Andersen (CB)', 'Sander Berge (CDM)', 'Harry Wilson (RM)', 'Kenny Tete (RB)', 'Calvin Bassey (CB)', 'Saša Lukić (CDM)', 'Raúl Jiménez (ST)'], description: 'Fulham. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fulham.png', division: 1 },
  { id: 'wolverhampton_wanderers', name: 'Wolverhampton Wanderers', league: 'Inglesa', dt: 'Vítor Pereira', reputation: 3, initialSalary: 75200, marketValue: 260925000, starPlayers: ['Ladislav Krejčí (CB)', 'André (CDM)', 'João Gomes (CDM)', 'José Sá (GK)', 'Santiago Bueno (CB)', 'Tolu Arokodare (ST)', 'Angel Gomes (CAM)', 'Sam Johnstone (GK)', 'Hugo Bueno (LB)', 'Jean-Ricner Bellegarde (CAM)', 'Toti (CB)'], description: 'Wolverhampton Wanderers. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/wolverhampton_wanderers.png', division: 2 },
  { id: 'nottingham_forest', name: 'Nottingham Forest', league: 'Inglesa', dt: 'Oliver Glasner', reputation: 3, initialSalary: 1500, marketValue: 521925000, starPlayers: ['Matz Sels (GK)', 'Murillo (CB)', 'Elliot Anderson (CDM)', 'Nikola Milenković (CB)', 'Morgan Gibbs-White (CAM)', 'Chris Wood (ST)', 'Ola Aina (RB)', 'Neco Williams (LB)', 'Stefan Ortega (GK)', 'Ibrahim Sangaré (CDM)', 'Callum Hudson-Odoi (LM)'], description: 'Nottingham Forest. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/nottingham_forest.png', division: 1 },
  { id: 'afc_bournemouth', name: 'AFC Bournemouth', league: 'Inglesa', dt: 'Marco Rose', reputation: 3, initialSalary: 21700, marketValue: 403600000, starPlayers: ['Marcos Senesi (CB)', 'Evanilson (ST)', 'Đorđe Petrović (GK)', 'Adrien Truffert (LB)', 'Alex Scott (CDM)', 'Tyler Adams (CDM)', 'Bafodé Diakité (CB)', 'Justin Kluivert (CAM)', 'Eli Junior Kroupi (ST)', 'Ryan Christie (CDM)', 'Lewis Cook (CDM)'], description: 'AFC Bournemouth. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/afc_bournemouth.png', division: 1 },
  { id: 'burnley', name: 'Burnley', league: 'Inglesa', dt: 'Scott Parker', reputation: 2, initialSalary: 27900, marketValue: 304050000, starPlayers: ['Martin Dúbravka (GK)', 'Florentino (CDM)', 'Kyle Walker (RB)', 'Josh Cullen (CDM)', 'Maxime Estève (CB)', 'Lesley Ugochukwu (CDM)', 'Jaidon Anthony (LM)', 'Quilindschy Hartman (LB)', 'Hannibal (CM)', 'Marcus Edwards (RM)', 'Zian Flemming (ST)'], description: 'Burnley. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/burnley.png', division: 2 },
  { id: 'leeds_united', name: 'Leeds United', league: 'Inglesa', dt: 'Daniel Farke', reputation: 2, initialSalary: 48600, marketValue: 312800000, starPlayers: ['Anton Stach (CM)', 'Ethan Ampadu (CDM)', 'Lucas Perri (GK)', 'Joe Rodon (CB)', 'Gabriel Gudmundsson (LB)', 'Dominic Calvert-Lewin (ST)', 'Jaka Bijol (CB)', 'Jayden Bogle (RB)', 'Pascal Struijk (CB)', 'Brenden Aaronson (RW)', 'Noah Okafor (ST)'], description: 'Leeds United. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/leeds_united.png', division: 1 },
  { id: 'sunderland', name: 'Sunderland', league: 'Inglesa', dt: 'Régis Le Bris', reputation: 2, initialSalary: 1000, marketValue: 226700000, starPlayers: ['Granit Xhaka (CDM)', 'Nordi Mukiele (CB)', 'Omar Alderete (CB)', 'Reinildo (LB)', 'Robin Roefs (GK)', 'Daniel Ballard (CB)', 'Trai Hume (RB)', 'Enzo Le Fée (CM)', 'Lutsharel Geertruida (CB)', 'Habib Diarra (CM)', 'Noah Sadiki (CM)'], description: 'Sunderland. Compite en Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/sunderland.png', division: 1 },
  { id: 'southampton', name: 'Southampton', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 9000, marketValue: 60000000, starPlayers: ['Aaron Ramsdale (GK)', 'Taylor Harwood-Bellis (CB)', 'Nathan Wood (CB)', 'Mads Roerslev (RB)', 'Welington (LB)', 'Flynn Downes (CDM)', 'Caspar Jander (CM)', 'Tom Fellows (CM)', 'Lewis Dobbin (LM)', 'Ben Brereton Díaz (ST)', 'Gavin Bazunu (GK)'], description: 'Southampton. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/southampton.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'middlesbrough', name: 'Middlesbrough', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 9000, marketValue: 60000000, starPlayers: ['Sol Brynn (GK)', 'Alfie Jones (CB)', 'George Edmundson (CB)', 'Callum Brittain (RB)', 'Alex Bangura (LB)', 'Abdoulaye Kanté (CDM)', 'Riley McGree (CM)', 'Sebastian Berhalter (CM)', 'Delano Burgzorg (LM)', 'Morgan Whittaker (RM)', 'David Strelec (ST)'], description: 'Middlesbrough. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/middlesbrough.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'sheffield_united', name: 'Sheffield United', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 9000, marketValue: 60000000, starPlayers: ['Michael Cooper (GK)', 'Japhet Tanganga (CB)', 'Mark McGuinness (CB)', 'Jamie Shackleton (RB)', 'Rhys Norrington-Davies (LB)', 'Jaïro Riedewald (CDM)', 'Gustavo Hamer (CM)', 'Joe Rothwell (CM)', 'Christian Nwachukwu (LM)', 'Ehije Ukaki (RM)', 'Tyrese Campbell (ST)'], description: 'Sheffield United. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/sheffield_united.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'norwich_city', name: 'Norwich City', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 9000, marketValue: 60000000, starPlayers: ['Vladan Kovacevic (GK)', 'Jakov Medic (CB)', 'Harry Darling (CB)', 'Jack Stacey (RB)', 'Ben Chrisene (LB)', 'Sam Field (CDM)', 'Paris Maghoma (CM)', 'Ali Ahmed (CM)', 'Papa Amadou Diallo (LM)', 'Matěj Jurásek (RM)', 'Mathias Kvistgaarden (ST)'], description: 'Norwich City. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/norwich_city.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'birmingham_city', name: 'Birmingham City', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['James Beadle (GK)', 'Christoph Klarer (CB)', 'Dael Fry (CB)', 'Bright Osayi-Samuel (RB)', 'Alex Cochrane (LB)', 'Tomoki Iwata (CDM)', 'Seung-ho Paik (CM)', 'Marc Leonard (CM)', 'Demarai Gray (LM)', 'Carlos Vicente (RM)', 'Luis Vázquez (ST)'], description: 'Birmingham City. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/birmingham_city.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'swansea_city', name: 'Swansea City', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Andy Fisher (GK)', 'Ben Cabango (CB)', 'Stephen Welsh (CB)', 'Josh Key (RB)', 'Josh Tymon (LB)', 'Gonçalo Franco (CM)', 'Marko Stamenić (CM)', 'Zeidane Inoussa (LM)', 'Ronald (RM)', 'Adam Idah (ST)', 'Lawrence Vigouroux (GK)'], description: 'Swansea City. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/swansea_city.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'millwall', name: 'Millwall', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 9000, marketValue: 60000000, starPlayers: ['Lukas Jensen (GK)', 'Tristan Crama (CB)', 'Caleb Taylor (CB)', 'Ryan Leonard (RB)', 'Zak Sturge (LB)', 'Casper De Norre (CDM)', 'Mark Sykes (CM)', 'Alfie Doughty (CM)', 'Kyrell Lisbie (LM)', 'Camiel Neghli (RM)', 'Josh Coburn (ST)'], description: 'Millwall. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/millwall.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'stoke_city', name: 'Stoke City', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Viktor Johansson (GK)', 'Ben Wilmot (CB)', 'Maksym Taloverov (CB)', 'Junior Tchamadeu (RB)', 'Eric-Junior Bocat (LB)', 'Djibril Soumaré (CDM)', 'Svante Ingelsson (CM)', 'Tatsuki Seko (CM)', 'Sorba Thomas (LM)', 'Million Manhoef (RM)', 'Róbert Boženík (ST)'], description: 'Stoke City. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/stoke_city.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'watford', name: 'Watford', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Federico Ravaglia (GK)', 'Mattie Pollock (CB)', 'Kévin Keben (CB)', 'Omar Traoré (RB)', 'Marc Bola (LB)', 'Hector Kyprianou (CDM)', 'Imrân Louza (CM)', 'Martín Payero (CM)', 'Kwadwo Baah (LM)', 'Othmane Maamma (RM)', 'Luca Kjerrumgaard (ST)'], description: 'Watford. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/watford.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'wrexham', name: 'Wrexham', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 9000, marketValue: 60000000, starPlayers: ['Callum Burton (GK)', 'Zak Vyner (CB)', 'Lewis Brunt (CB)', 'Ryan Barnett (RB)', 'Liberato Cacace (LB)', 'Ben Sheaf (CDM)', 'Lewis O\'Brien (CM)', 'George Thomason (CM)', 'Nathan Broadhead (LM)', 'Sam Smith (ST)', 'Arthur Okonkwo (GK)'], description: 'Wrexham. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/wrexham.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'qpr', name: 'Queens Park Rangers', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Calum Ward (GK)', 'Jimmy Dunne (CB)', 'Jake Clarke-Salter (CB)', 'Tariq Lamptey (RB)', 'Boy Kemper (LB)', 'Jonathan Varane (CDM)', 'Nicolas Madsen (CM)', 'Harvey Vale (CM)', 'Koki Saito (LM)', 'Paul Smyth (RM)', 'Rumarn Burrell (ST)'], description: 'Queens Park Rangers. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/qpr.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'bristol_city', name: 'Bristol City', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 9000, marketValue: 60000000, starPlayers: ['Lewis Thomas (GK)', 'Rob Atkinson (CB)', 'Luke McNally (CB)', 'George Tanner (RB)', 'Cameron Pring (LB)', 'Adam Randell (CDM)', 'Tomi Horvat (CM)', 'Jason Knight (CM)', 'Sam Bell (LM)', 'Yu Hirakawa (RM)', 'Emil Riis (ST)'], description: 'Bristol City. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/bristol_city.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'west_bromwich_albion', name: 'West Bromwich Albion', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Max O\'Leary (GK)', 'Chris Mepham (CB)', 'Krystian Bielik (CB)', 'Nolan Galves (RB)', 'Callum Styles (LB)', 'Ousmane Diakité (CDM)', 'Jayson Molumby (CM)', 'Alex Mowatt (CM)', 'Mikey Johnston (LM)', 'Josh Maja (ST)', 'Matt Ingram (GK)'], description: 'West Bromwich Albion. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/west_bromwich_albion.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'derby_county', name: 'Derby County', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Jacob Widell Zetterström (GK)', 'Dion Sanderson (CB)', 'Sondre Langås (CB)', 'Ryan Nyambe (RB)', 'Derry Murkin (LB)', 'Lewis Travis (CDM)', 'Liam Thompson (CM)', 'Kenzo Goudmijn (CM)', 'Filip Bilbija (LM)', 'Rhian Brewster (ST)', 'Josh Vickers (GK)'], description: 'Derby County. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/derby_county.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'preston_north_end', name: 'Preston North End', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Daniel Iversen (GK)', 'Jordan Storey (CB)', 'Lewis Gibson (CB)', 'Pol Valentín (RB)', 'Andrija Vukcevic (LB)', 'Ali McCann (CM)', 'Jordan Thompson (CM)', 'Callum Lang (RM)', 'Milutin Osmajic (ST)', 'Lee Nicholls (GK)', 'David Cornell (GK)'], description: 'Preston North End. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/preston_north_end.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'blackburn_rovers', name: 'Blackburn Rovers', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Aynsley Pears (GK)', 'Hayden Carter (CB)', 'Scott Wharton (CB)', 'Lewis Miller (RB)', 'Harry Pickering (LB)', 'Sidnei Tavares (CDM)', 'Moussa Baradji (CM)', 'Dion De Neve (CM)', 'Oladapo Afolayan (RM)', 'Andri Gudjohnsen (ST)', 'Balázs Tóth (GK)'], description: 'Blackburn Rovers. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/blackburn_rovers.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'portsmouth', name: 'Portsmouth', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 9000, marketValue: 60000000, starPlayers: ['Daniel Bielica (GK)', 'Regan Poole (CB)', 'Josh Knight (CB)', 'Zak Swanson (RB)', 'Connor Ogilvie (LB)', 'Luke Le Roux (CM)', 'Márk Kosznovszky (CM)', 'Josh Murphy (LM)', 'Adrian Segečić (RM)', 'Colby Bishop (ST)', 'Nicolas Schmid (GK)'], description: 'Portsmouth. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/portsmouth.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'charlton_athletic', name: 'Charlton Athletic', league: 'Inglesa', dt: 'DT Genérico', reputation: 2, initialSalary: 9000, marketValue: 60000000, starPlayers: ['Will Mannion (GK)', 'Reece Burke (CB)', 'Ivan Mesik (CB)', 'Danny McNamara (RB)', 'Josh Edwards (LB)', 'Conor Coventry (CDM)', 'Greg Docherty (CM)', 'Ibrahim Fullah (CM)', 'Millenic Alli (LM)', 'Rob Apter (RM)', 'Karlan Grant (ST)'], description: 'Charlton Athletic. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/charlton_athletic.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'cardiff_city', name: 'Cardiff City', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Nathan Trott (GK)', 'Gabriel Osho (CB)', 'Jesper Daland (CB)', 'Perry Ng (RB)', 'Joel Bagan (LB)', 'Eli King (CDM)', 'David Turnbull (CM)', 'Alex Robertson (CM)', 'Chris Willock (LM)', 'Ollie Tanner (RM)', 'Yousef Salech (ST)'], description: 'Cardiff City. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/cardiff_city.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'bolton_wanderers', name: 'Bolton Wanderers', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['David Harrington (GK)', 'Akin Famewo (CB)', 'Eoin Toal (CB)', 'Gaizka Larrazabal (RB)', 'Max Conway (LB)', 'Xavier Simons (CDM)', 'Ethan Erhahon (CM)', 'Josh Sheehan (CM)', 'Thierry Gale (LM)', 'Sam Dalby (ST)', 'Jack Bonham (GK)'], description: 'Bolton Wanderers. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/bolton_wanderers.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'lincoln_city', name: 'Lincoln City', league: 'Inglesa', dt: 'DT Genérico', reputation: 1, initialSalary: 5500, marketValue: 35000000, starPlayers: ['Joe Gauci (GK)', 'Tom Hamer (CB)', 'Ryley Towler (CB)', 'Tendayi Darikwa (RB)', 'Josh Honohan (LB)', 'Ivan Varfolomeev (CDM)', 'Tom Bayliss (CM)', 'Conor McGrandles (CM)', 'Ben House (LM)', 'Reeco Hackett (RM)', 'Rob Street (ST)'], description: 'Lincoln City. Compite en el Championship.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/lincoln_city.png', badgeLogoUrl: '⚽', division: 2 },
  { id: 'ipswich_town', name: 'Ipswich Town', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 18000, marketValue: 180000000, starPlayers: ['Kjell Scherpen (GK)', 'Dara O\'Shea (CB)', 'Jacob Greaves (CB)', 'Ben Johnson (RB)', 'Leif Davis (LB)', 'Azor Matusiwa (CDM)', 'Marcelino Núñez (CM)', 'Jack Taylor (CM)', 'Daizen Maeda (LM)', 'Chiedozie Ogbene (RM)', 'George Hirst (ST)'], description: 'Ipswich Town. Compite en la Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/ipswich_town.png', badgeLogoUrl: '⚽', division: 1 },
  { id: 'coventry_city', name: 'Coventry City', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 18000, marketValue: 180000000, starPlayers: ['Oliver Dovin (GK)', 'Luke Woolfenden (CB)', 'Liam Kitching (CB)', 'Milan van Ewijk (RB)', 'Jay Dasilva (LB)', 'Matt Grimes (CDM)', 'Victor Torp (CM)', 'Josh Eccles (CM)', 'Raphael Borges Rodrigues (LM)', 'Tatsuhiro Sakamoto (RM)', 'Brandon Thomas-Asante (ST)'], description: 'Coventry City. Compite en la Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/coventry_city.png', badgeLogoUrl: '⚽', division: 1 },
  { id: 'hull_city', name: 'Hull City', league: 'Inglesa', dt: 'DT Genérico', reputation: 3, initialSalary: 18000, marketValue: 180000000, starPlayers: ['Thimothée Lo-Tutala (GK)', 'Paddy McNair (CB)', 'Charlie Hughes (CB)', 'Cody Drameh (RB)', 'Ryan Giles (LB)', 'Regan Slater (CDM)', 'Abdülkadir Ömür (CM)', 'Eliot Matazo (CM)', 'Liam Millar (LM)', 'Mohamed Belloumi (RM)', 'Oli McBurnie (ST)'], description: 'Hull City. Compite en la Premier League.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/hull_city.png', badgeLogoUrl: '⚽', division: 1 },

  // ==========================================
  // --- ITALIA (PRIMERA) ---
  // ==========================================
  { id: 'atalanta', themeColor: { primary: '#1E71B8', secondary: '#000000' }, name: 'Atalanta', league: 'Italiana', dt: 'Maurizio Sarri', reputation: 5, initialSalary: 79900, marketValue: 415350000, starPlayers: ['Ademola Olajade Alade Aylola Lookman (ST)', 'Marco Carnesecchi (GK)', 'Éderson José dos Santos Lourenço da Silva (CM)', 'Charles De Ketelaere (CAM)'], description: 'Atalanta. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/atalanta.png', division: 1 },
  { id: 'bologna', name: 'Bologna', league: 'Italiana', dt: 'Domenico Tedesco', reputation: 4, initialSalary: 2000, marketValue: 250770000, starPlayers: ['Riccardo Orsolini (RM)', 'Remo Freuler (CDM)', 'Łukasz Skorupski (GK)', 'Lewis Ferguson (CDM)', 'João Mário (RB)', 'Jens Odgaard (CAM)', 'Santiago Castro (ST)', 'Jhon Lucumí (CB)', 'Juan Miranda (LB)', 'Nicolò Cambiaghi (LM)', 'Nikola Moro (CDM)'], description: 'Bologna. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/bologna.png', division: 1 },
  { id: 'cagliari', name: 'Cagliari', league: 'Italiana', dt: 'Fabio Pisacane', reputation: 4, initialSalary: 2000, marketValue: 97845000, starPlayers: ['Elia Caprile (GK)', 'Yerry Mina (CB)', 'Sebastiano Esposito (ST)', 'Michael Folorunsho (CM)', 'Andrea Belotti (ST)', 'Marco Palestra (RB)', 'Semih Kılıçsoy (ST)', 'Zé Pedro (CB)', 'Alberto Dossena (CB)', 'Gianluca Gaetano (CAM)', 'Michel Ndary Adopo (CM)'], description: 'Cagliari. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cagliari.png', division: 1 },
  { id: 'como', name: 'Como', league: 'Italiana', dt: 'Cesc Fàbregas', reputation: 4, initialSalary: 2000, marketValue: 301450000, starPlayers: ['Nico Paz (CAM)', 'Morata (ST)', 'Diego Carlos (CB)', 'Martin Baturina (CAM)', 'Maxence Caqueret (CM)', 'Jean Butez (GK)', 'Nicolas Kühn (RW)', 'Mërgim Vojvoda (RB)', 'Jesús Rodríguez (LM)', 'Sergi Roberto (CDM)', 'Assane Diao (LM)'], description: 'Como. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/como.png', division: 1 },
  { id: 'empoli', name: 'Empoli', league: 'Italiana', dt: 'Roberto D\'Aversa', reputation: 4, initialSalary: 2000, marketValue: 49060000, starPlayers: ['Andrea Fulignati (GK)', 'Salvatore Elia (RB)', 'Gerard Yepes (CDM)', 'Tyronne Ebuehi (RB)', 'Andrea Ghion (CM)', 'Daniel Fila (ST)', 'Rareș Ilie (LM)', 'Marco Curto (CB)', 'Samuele Perisan (GK)', 'Simone Romagnoli (CB)', 'Antonio Candela (RB)'], description: 'Empoli. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/empoli.png', division: 1 },
  { id: 'fiorentina', themeColor: { primary: '#682E8B', secondary: '#FFFFFF' }, name: 'Fiorentina', league: 'Italiana', dt: 'Fabio Grosso', reputation: 4, initialSalary: 47800, marketValue: 303560000, starPlayers: ['De Gea (GK)', 'Moise Kean (ST)', 'Robin Gosens (LB)', 'Dodô (RB)', 'Albert Guðmundsson (ST)', 'Manor Solomon (LM)', 'Nicolò Fagioli (CM)', 'Rolando Mandragora (CM)', 'Luca Ranieri (CB)', 'Roberto Piccoli (ST)', 'Fabiano Parisi (LB)'], description: 'Fiorentina. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fiorentina.png', division: 1 },
  { id: 'genoa', name: 'Genoa', league: 'Italiana', dt: 'Daniele De Rossi', reputation: 4, initialSalary: 2000, marketValue: 132070000, starPlayers: ['Morten Frendrup (CDM)', 'Justin Bijlow (GK)', 'Leo Østigård (CB)', 'Johan Vásquez (CB)', 'Ruslan Malinovskyi (CM)', 'Vitinha (ST)', 'Brooke Norton-Cuffy (RB)', 'Aarón Martín (LB)', 'Tommaso Baldanzi (CAM)', 'Maxwel Cornet (LM)', 'Nicola Leali (GK)'], description: 'Genoa. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/genoa.png', division: 1 },
  { id: 'hellas_verona', name: 'Hellas Verona', league: 'Italiana', dt: 'Paolo Zanetti', reputation: 2, initialSalary: 20900, marketValue: 108450000, starPlayers: ['Lorenzo Montipò (GK)', 'Suat Serdar (CM)', 'Ali Al Musrati (CDM)', 'Victor Nelsson (CB)', 'Gift Orban (ST)', 'Nicolás Valentini (CB)', 'Pol Lirola (RB)', 'Sandi Lovrič (CM)', 'Armel Bella-Kotchap (CB)', 'Domagoj Bradarić (LB)', 'Roberto Gagliardini (CDM)'], description: 'Hellas Verona. Descendió a la Serie BKT para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/hellas-verona/hellas-verona-logo-footylogos.svg', division: 2 },
  { id: 'inter', themeColor: { primary: '#0068A8', secondary: '#000000' }, name: 'Inter', league: 'Italiana', dt: 'Cristian Chivu', reputation: 5, initialSalary: 110200, marketValue: 573300000, starPlayers: ['Lautaro Martínez (ST)', 'Nicolò Barella (CM)', 'Yann Sommer (GK)', 'Hakan Çalhanoğlu (CM)', 'Alessandro Bastoni (CB)', 'Federico Dimarco (LB)', 'Manuel Akanji (CB)', 'Aleksandar Stanković (CDM)', 'Yann Bisseck (CB)', 'Henrikh Mkhitaryan (CM)', 'Davide Frattesi (CM)'], description: 'Inter. Compite en Serie A Enilive, reforzado con Manuel Akanji y Aleksandar Stanković, tras la salida de Denzel Dumfries.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/inter.d4ebfb95.png', division: 1 },
  { id: 'juventus', themeColor: { primary: '#000000', secondary: '#FFFFFF' }, name: 'Juventus', league: 'Italiana', dt: 'Luciano Spalletti', reputation: 5, initialSalary: 123200, marketValue: 640400000, starPlayers: ['Bremer (CB)', 'Manuel Locatelli (CDM)', 'Loïs Openda (ST)', 'Khéphren Thuram (CM)', 'Kenan Yıldız (CAM)', 'Jonathan David (ST)', 'Michele Di Gregorio (GK)', 'Dušan Vlahović (ST)', 'Pierre Kalulu (CB)', 'Andrea Cambiaso (LB)', 'Teun Koopmeiners (CAM)'], description: 'Juventus. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/juventus.png', division: 1 },
  { id: 'lazio', name: 'Lazio', league: 'Italiana', dt: 'Gennaro Gattuso', reputation: 4, initialSalary: 62800, marketValue: 271175000, starPlayers: ['Mattia Zaccagni (LM)', 'Mattéo Elias Kenzo Guendouzi Olié (CDM)', 'Alessio Romagnoli (CB)', 'Ivan Provedel (GK)'], description: 'Lazio. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/lazio.png', division: 1 },
  { id: 'lecce', name: 'Lecce', league: 'Italiana', dt: 'Eusebio Di Francesco', reputation: 4, initialSalary: 2000, marketValue: 120330000, starPlayers: ['Wladimiro Falcone (GK)', 'Antonino Gallo (LB)', 'Lassana Coulibaly (CDM)', 'Riccardo Sottil (LM)', 'Omri Gandelman (CAM)', 'Walid Cheddira (ST)', 'Kialonda Gaspar (CB)', 'Àlex Sala (CDM)', 'Jamil Siebert (CB)', 'Ylber Ramadani (CDM)', 'Santiago Pierotti (RM)'], description: 'Lecce. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/lecce.png', division: 1 },
  { id: 'milan', themeColor: { primary: '#FB090B', secondary: '#000000' }, name: 'Milan', league: 'Italiana', dt: 'Rúben Amorim', reputation: 4, initialSalary: 89800, marketValue: 626510000, starPlayers: ['Rafael Leão (LW)', 'Christian Pulisic (RW)', 'Mike Maignan (GK)', 'Adrien Rabiot (CM)', 'Youssouf Fofana (CDM)', 'Strahinja Pavlović (CB)', 'Fikayo Tomori (CB)', 'Samuel Chukwueze (RW)', 'Ardon Jashari (CM)', 'Ruben Loftus-Cheek (CM)', 'Santiago Giménez (ST)'], description: 'Milan. Compite en Serie A Enilive, reforzado con Ardon Jashari (Club Brugge) y Samuel Chukwueze.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/milan.png', division: 1 },
  { id: 'monza', name: 'Monza', league: 'Italiana', dt: 'Ivan Jurić', reputation: 4, initialSalary: 2000, marketValue: 40975000, starPlayers: ['Matteo Pessina (CM)', 'Andrea Colpani (CAM)', 'Samuele Birindelli (RB)', 'Patrick Cutrone (ST)', 'Dany Mota (ST)', 'Hernani (CDM)', 'Demba Thiam (GK)', 'Paulo Azzi (LB)', 'Patrick Ciurria (CAM)', 'Agustín Álvarez (ST)', 'Luca Ravanelli (CB)'], description: 'Monza. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/monza.png', division: 1 },
  { id: 'napoli', themeColor: { primary: '#12A0D7', secondary: '#003C7A' }, name: 'Napoli', league: 'Italiana', dt: 'Massimiliano Allegri', reputation: 5, initialSalary: 99600, marketValue: 517750000, starPlayers: ['Kevin De Bruyne (CM)', 'Scott McTominay (CM)', 'Noa Lang (LW)', 'Stanislav Lobotka (CM)', 'André-Franck Zambo Anguissa (CM)', 'Giovanni Di Lorenzo (RB)', 'Romelu Lukaku (ST)', 'Alessandro Buongiorno (CB)', 'Alex Meret (GK)', 'Matteo Politano (RW)', 'Luca Marianucci (CB)'], description: 'Napoli. Compite en Serie A Enilive, reforzado con Noa Lang (PSV) tras la salida de Kvaratskhelia al PSG.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/napoli.png', division: 1 },
  { id: 'parma', name: 'Parma', league: 'Italiana', dt: 'Carlos Cuesta', reputation: 4, initialSalary: 2000, marketValue: 104085000, starPlayers: ['Gabriel Strefezza (RM)', 'Zion Suzuki (GK)', 'Enrico Delprato (CB)', 'Emanuele Valeri (LB)', 'Hans Nicolussi Caviglia (CDM)', 'Adrián Bernabé (CM)', 'Abdoulaye Ndiaye (CB)', 'Mandela Keita (CDM)', 'Jacob Ondrejka (LW)', 'Gaetano Oristanio (CAM)', 'Matija Frigan (ST)'], description: 'Parma. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/parma.png', division: 1 },
  { id: 'roma', themeColor: { primary: '#8E1F2F', secondary: '#F0BC42' }, name: 'Roma', league: 'Italiana', dt: 'Gian Piero Gasperini', reputation: 4, initialSalary: 78900, marketValue: 410350000, starPlayers: ['Paulo Dybala (CAM)', 'Mile Svilar (GK)', 'Gianluca Mancini (CB)', 'Evan Ndicka (CB)', 'Bryan Cristante (CM)', 'Artem Dovbyk (ST)', 'Kouadio Manu Koné (CM)', 'Lorenzo Pellegrini (CAM)', 'Mario Hermoso (CB)', 'Matías Soulé (CAM)', 'Donyell Malen (ST)'], description: 'Roma. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/roma.png', division: 1 },
  { id: 'torino', name: 'Torino', league: 'Italiana', dt: 'Ignazio Abate', reputation: 4, initialSalary: 35400, marketValue: 217995000, starPlayers: ['Duván Zapata (ST)', 'Nikola Vlašić (CAM)', 'Ché Adams (ST)', 'Cristiano Biraghi (LB)', 'Valentino Lazaro (RM)', 'Saúl Coco (CB)', 'Giovanni Simeone (ST)', 'Guillermo Maripán (CB)', 'Cesare Casadei (CM)', 'Franco Israel (GK)', 'Ivan Ilić (CDM)'], description: 'Torino. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/torino.png', division: 1 },
  { id: 'udinese', name: 'Udinese', league: 'Italiana', dt: 'Kosta Runjaic', reputation: 4, initialSalary: 2000, marketValue: 153955000, starPlayers: ['Oumar Solet (CB)', 'Jesper Karlström (CDM)', 'Nicolò Zaniolo (ST)', 'Maduka Okoye (GK)', 'Arthur Atta (CM)', 'Jurgen Ekkelenkamp (CM)', 'Keinan Davis (ST)', 'Thomas Kristensen (CB)', 'Christian Kabasele (CB)', 'Alessandro Zanoli (RB)', 'Adam Buksa (ST)'], description: 'Udinese. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/udinese.png', division: 1 },
  { id: 'venezia', name: 'Venezia', league: 'Italiana', dt: 'Giovanni Stroppa', reputation: 4, initialSalary: 2000, marketValue: 36985000, starPlayers: ['Filip Stanković (GK)', 'Gianluca Busio (CM)', 'Kike Pérez (CM)', 'Andrea Adorante (ST)', 'Alfred Duncan (CM)', 'Lion Lauberbach (ST)', 'Michael Svoboda (CB)', 'John Yeboah (ST)', 'Issa Doumbia (CM)', 'Casas (ST)', 'Joël Marcel Schingtienne (CB)'], description: 'Venezia. Compite en Serie A Enilive.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/venezia.png', division: 1 },
  // ==========================================
  // --- ITALIA (SEGUNDA) ---
  // ==========================================
  { id: 'bari', name: 'Bari', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Mehdi Dorval (LB)', 'Lorenzo Dickmann (RB)', 'Giulio Maggiore (CM)', 'Cas Odenthal (CB)', 'Christian Gytkjær (ST)', 'Anthony Partipilo (ST)', 'Andrea Cistana (CB)', 'Gabriele Moncini (ST)', 'Dimitrios Nikolaou (CB)', 'Kevin Piscopo (CAM)', 'Matthias Braunöder (CM)'], description: 'Bari. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/bari.png', division: 2 },
  { id: 'brescia', name: 'Brescia', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 13950000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Brescia. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/brescia.png', division: 2 },
  { id: 'carrarese', name: 'Carrarese', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Nicolas Schiavi (CM)', 'Simone Zanon (RM)', 'Julián Illanes (CB)', 'Marco Bleve (GK)', 'Luis Hasa (CM)', 'Fabio Abiuso (ST)', 'Filippo Oliana (CB)', 'Emanuele Zuelli (CM)', 'Mattia Finotto (ST)', 'Vincenzo Fiorillo (GK)', 'Bartosz Salamon (CB)'], description: 'Carrarese. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/carrarese.png', division: 2 },
  { id: 'catanzaro', name: 'Catanzaro', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Mirko Pigliacelli (GK)', 'Pietro Iemmello (ST)', 'Federico Di Francesco (LW)', 'Jacopo Petriccione (CDM)', 'Marco D\'Alessandro (LM)', 'Rémi Oudin (CAM)', 'Marco Pompetti (CM)', 'Simone Pontisso (CM)', 'Filippo Pittarello (ST)', 'Tommaso Cassandro (RB)', 'Davide Buglio (CM)'], description: 'Catanzaro. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/catanzaro.png', division: 2 },
  { id: 'cesena', name: 'Cesena', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 1810000, starPlayers: ['Giovanni Zaro (CB)', 'Dimitri Bisoli (CM)', 'Gaetano Castrovilli (CM)', 'Michele Castagnetti (CDM)', 'Cristian Shpendi (ST)', 'Jonathan Klinsmann (GK)', 'Riccardo Ciervo (RM)', 'Simone Bastoni (CM)', 'Andrea Ciofi (CB)', 'Gianluca Frabotta (LB)', 'Tommaso Berti (CM)'], description: 'Cesena. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cesena.png', division: 2 },
  { id: 'cittadella', name: 'Cittadella', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Cittadella. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/cittadella.954a9cc7.png', division: 2 },
  { id: 'cosenza', name: 'Cosenza', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Cosenza. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cosenza.png', division: 2 },
  { id: 'cremonese', name: 'Cremonese', league: 'Italiana', dt: 'Giovanni Persico', reputation: 2, initialSalary: 800, marketValue: 93450000, starPlayers: ['Emil Audero (GK)', 'Sebastiano Luperto (CB)', 'Jamie Vardy (ST)', 'Antonio Sanabria (ST)', 'Federico Baschirotto (CB)', 'Alessio Zerbin (RM)', 'Martín Payero (CM)', 'Jari Vandeputte (CM)', 'Federico Bonazzoli (ST)', 'Morten Thorsby (CM)', 'Marco Silvestri (GK)'], description: 'Cremonese. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cremonese.png', division: 2 },
  { id: 'frosinone', name: 'Frosinone', league: 'Italiana', dt: 'Massimiliano Alvini', reputation: 4, initialSalary: 2000, marketValue: 27335000, starPlayers: ['Giacomo Calò (CDM)', 'Ilario Monterisi (CB)', 'Ilias Koutsoupias (CM)', 'Farès Ghedjemis (RW)', 'Anthony Oyono (RB)', 'Gabriele Calvani (CB)', 'Gabriele Bracaglia (CB)', 'Antonio Raimondo (ST)', 'Antonio Fiori (LM)', 'Lorenzo Palmisani (GK)', 'Riccardo Marchizza (LB)'], description: 'Frosinone. Ascendió a la Serie A Enilive para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/frosinone.png', division: 1 },
  { id: 'juve_stabia', name: 'Juve Stabia', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Giuseppe Leone (CM)', 'Marco Varnier (CB)', 'Salim Diakité (RB)', 'Marco Bellich (CB)', 'Leonardo Candellone (ST)', 'Andrea Giorgini (CB)', 'Alessandro Gabrielloni (ST)', 'Fabio Maistro (CAM)', 'Nicola Mosti (CAM)', 'Omar Correia (CDM)', 'Christian Pierobon (CM)'], description: 'Juve Stabia. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/juve_stabia.png', division: 2 },
  { id: 'mantova', name: 'Mantova', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Francesco Bardi (GK)', 'César Falletti (CAM)', 'Leonardo Mancuso (ST)', 'Davis Mensah (ST)', 'Davide Bragantini (RM)', 'Marco Festa (GK)', 'Tiago Gonçalves (LB)', 'Francesco Ruocco (LM)', 'Andrea Meroni (CB)', 'Nicolò Radaelli (RB)', 'Nicolò Buso (LW)'], description: 'Mantova. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/mantova.png', division: 2 },
  { id: 'modena', name: 'Modena', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Leandro Chichizola (GK)', 'Luca Zanimacchia (RM)', 'Davide Adorni (CB)', 'Francesco Zampano (LB)', 'Simone Santoro (CM)', 'Niklas Pyyhtiä (CM)', 'Daniel Tonoli (CB)', 'Fabio Gerli (CM)', 'Manuel De Luca (ST)', 'Pedro Mendes (ST)', 'Grégoire Defrel (ST)'], description: 'Modena. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/modena.png', division: 2 },
  { id: 'palermo', name: 'Palermo', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 14150000, starPlayers: ['Joel Pohjanpalo (ST)', 'Tommaso Augello (LB)', 'Antonio Palumbo (CAM)', 'Jesse Joronen (GK)', 'Mattia Bani (CB)', 'Niccolò Pierozzi (RB)', 'Filippo Ranocchia (CM)', 'Giangiacomo Magnani (CB)', 'Pietro Ceccaroni (CB)', 'Jacopo Segre (CM)', 'Jérémy Le Douaron (CAM)'], description: 'Palermo. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/palermo.png', division: 2 },
  { id: 'pisa', name: 'Pisa', league: 'Italiana', dt: 'Alberto Gilardino', reputation: 2, initialSalary: 800, marketValue: 61150000, starPlayers: ['Juan Cuadrado (RM)', 'Calvin Stengs (CAM)', 'Rafiu Durosinmi (ST)', 'Raúl Albiol (CB)', 'Michel Aebischer (CM)', 'Mattéo Tramoni (CAM)', 'Felipe Loyola (CM)', 'Simone Canestrelli (CB)', 'Stefano Moreo (ST)', 'Simone Scuffet (GK)', 'Samuel Iling-Junior (LM)'], description: 'Pisa. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/pisa.png', division: 2 },
  { id: 'reggiana', name: 'Reggiana', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Manolo Portanova (CM)', 'Tommaso Fumagalli (ST)', 'Mario Sampirisi (RB)', 'Matteo Rover (RM)', 'Cedric Diomandè Gondo (ST)', 'Francesco Vicari (CB)', 'Yeferson Paz (RB)', 'Alessandro Micai (GK)', 'Andrea Papetti (CB)', 'Tobias Reinhart (CM)', 'Danilo Quaranta (CB)'], description: 'Reggiana. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/reggiana.a4612e65.png', division: 2 },
  { id: 'salernitana', name: 'Salernitana', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 17660000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Salernitana. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/salernitana.png', division: 2 },
  { id: 'sampdoria', name: 'Sampdoria', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 39570000, starPlayers: ['Salvatore Esposito (CDM)', 'Massimo Coda (ST)', 'Antonín Barák (CM)', 'Mattia Viti (CB)', 'Matteo Brunori (CAM)', 'Oliver Abildgaard (CB)', 'Nicholas Pierini (ST)', 'Fabio Depaoli (RB)', 'Lorenzo Venuti (RB)', 'Jordan Ferri (CDM)', 'Manuel Cicconi (LM)'], description: 'Sampdoria. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/sampdoria.png', division: 2 },
  { id: 'sassuolo', name: 'Sassuolo', league: 'Italiana', dt: 'Alberto Aquilani', reputation: 2, initialSalary: 800, marketValue: 166120000, starPlayers: ['Domenico Berardi (RW)', 'Armand Laurienté (LW)', 'Nemanja Matić (CDM)', 'Kristian Thorstvedt (CM)', 'Ismaël Koné (CM)', 'Andrea Pinamonti (ST)', 'Arijanet Murić (GK)', 'Ulisses Garcia (LB)', 'Jay Idzes (CB)', 'Tarik Muharemović (CB)', 'Josh Doig (LB)'], description: 'Sassuolo. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/sassuolo.png', division: 2 },
  { id: 'spezia', name: 'Spezia', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 17235000, starPlayers: ['Boris Radunović (GK)', 'Alessandro Bellemo (CM)', 'Filippo Bandinelli (CM)', 'Gianluca Lapadula (ST)', 'Leonardo Sernicola (RB)', 'Marco Ruggero (CB)', 'Petko Hristov (CB)', 'Szymon Żurkowski (CM)', 'Giuseppe Aurelio (LB)', 'Mattia Valoti (CAM)', 'Ádám Nagy (CM)'], description: 'Spezia. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/spezia.png', division: 2 },
  { id: 'sudtirol', name: 'Sudtirol', league: 'Italiana', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Daniele Casiraghi (CM)', 'Salvatore Andrea Molina (RB)', 'Andrea Masiello (CB)', 'Raphael Chidi Odogwu (ST)'], description: 'Sudtirol. Compite en Serie BKT.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeImageUrl: 'badges/clubs/sudtirol.png', badgeLogoUrl: '⚽', division: 2 },
 // ==========================================
  // --- FRANCIA (PRIMERA) ---
  // ==========================================
  { id: 'aj_auxerre', name: 'AJ Auxerre', league: 'Francesa', dt: 'Will Still', reputation: 4, initialSalary: 2000, marketValue: 73450000, starPlayers: ['Donovan Léon (GK)', 'Romain Faivre (RM)', 'Kévin Danois (CM)', 'Lassine Sinayoko (ST)', 'Clément Akpa (CB)', 'Gideon Mensah (LB)', 'Sinaly Diomandé (CB)', 'Elisha Owusu (CDM)', 'Danny Namaso (LM)', 'Josué Casimir (RM)', 'Oussama El Azzouzi (CDM)'], description: 'AJ Auxerre. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/aj-auxerre/aj-auxerre-logo-footylogos.svg', division: 1 },
  { id: 'angers_sco', name: 'Angers SCO', league: 'Francesa', dt: 'Stéphane Gilli', reputation: 4, initialSalary: 2000, marketValue: 58175000, starPlayers: ['Hervé Koffi (GK)', 'Jordan Lefort (CB)', 'Haris Belkebla (CDM)', 'Ousmane Camara (CB)', 'Carlens Arcus (RB)', 'Jacques Ekomié (LB)', 'Branco van den Boomen (CM)', 'Yassin Belkhdim (CM)', 'Amine Sbaï (LM)', 'Louis Mouton (CAM)', 'Goduine Koyalipou (ST)'], description: 'Angers SCO. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/angers-sco/angers-sco-logo-footylogos.svg', division: 1 },
  { id: 'as_monaco', themeColor: { primary: '#CC092F', secondary: '#FFFFFF' }, name: 'AS Monaco', league: 'Francesa', dt: 'Filipe Luís', reputation: 5, initialSalary: 67500, marketValue: 350900000, starPlayers: ['Denis Zakaria (CDM)', 'Lukáš Hrádecký (GK)', 'Maghnes Akliouche (CAM)', 'Lamine Camara (CM)', 'Alexandr Golovin (CAM)', 'Folarin Balogun (ST)', 'Thilo Kehrer (CB)', 'Paul Pogba (CM)', 'Eric Dier (CB)', 'Takumi Minamino (LM)', 'Vanderson (RB)'], description: 'AS Monaco. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/as_monaco.png', division: 1 },
  { id: 'as_saint_etienne', name: 'AS Saint-Étienne', league: 'Francesa', dt: 'Ian Cathro', reputation: 4, initialSalary: 2000, marketValue: 57885000, starPlayers: ['Lucas Stassin (ST)', 'Gautier Larsonneur (GK)', 'Julien Le Cardinal (CB)', 'Zuriko Davitashvili (LW)', 'Irvin Cardona (RW)', 'Augustine Boakye (RW)', 'João Ferreira (RB)', 'Chico Lamba (CB)', 'Mickaël Nadé (CB)', 'Florian Tardieu (CM)', 'Maxime Bernauer (CB)'], description: 'AS Saint-Étienne. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/as_saint_etienne.png', division: 1 },
  { id: 'brest', name: 'Brest', league: 'Francesa', dt: 'Julien Lachuer', reputation: 4, initialSalary: 2000, marketValue: 114600000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Brest. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/brest.png', division: 1 },
  { id: 'le_havre_ac', name: 'Le Havre AC', league: 'Francesa', dt: 'Didier Digard', reputation: 4, initialSalary: 2000, marketValue: 73650000, starPlayers: ['Abdoulaye Touré (CDM)', 'Arouna Sangante (CB)', 'Gautier Lloris (CB)', 'Sofiane Boufal (CAM)', 'Issa Soumaré (LM)', 'Yassine Kechta (CM)', 'Mory Diaw (GK)', 'Ayumu Seko (CDM)', 'Rassoul Ndiaye (CM)', 'Loïc Négo (RB)', 'Étienne Youté Kinkoué (CB)'], description: 'Le Havre AC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/le_havre_ac.png', division: 1 },
  { id: 'lens', name: 'Lens', league: 'Francesa', dt: 'Dino Toppmöller', reputation: 4, initialSalary: 2000, marketValue: 98650000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Lens. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/leon.png', division: 1 },
  { id: 'lille_osc', name: 'Lille OSC', league: 'Francesa', dt: 'Davide Ancelotti', reputation: 4, initialSalary: 52300, marketValue: 272000000, starPlayers: ['Benjamin André (CDM)', 'Alexsandro Victor de Souza Ribeiro (CB)', 'Olivier Jonathan Giroud (ST)', 'Hákon Arnar Haraldsson (CAM)'], description: 'Lille OSC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/lille.682b7a4f.png', division: 1 },
  { id: 'montpellier_hsc', name: 'Montpellier HSC', league: 'Francesa', dt: 'Zoumana Camara', reputation: 4, initialSalary: 2000, marketValue: 48775000, starPlayers: ['Téji Savanier (CAM)', 'Julien Laporte (CB)', 'Enzo Tchato (RB)', 'Christopher Jullien (CB)', 'Alexandre Mendy (ST)', 'Nathanaël Mbuku (RM)', 'Khalil Fayad (CM)', 'Théo Sainte-Luce (LB)', 'Lucas Mincarelli (LB)', 'Simon Ngapandouetnbu (GK)', 'Mathieu Michel (GK)'], description: 'Montpellier HSC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Montpellier_H%C3%A9rault_Sport_Club_%28logo%2C_2000%29.svg', division: 1 },
  { id: 'nantes', name: 'Nantes', league: 'Francesa', dt: 'Michel Der Zakarian', reputation: 4, initialSalary: 2000, marketValue: 102950000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Nantes. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/nantes.png', division: 1 },
  { id: 'nice', name: 'Nice', league: 'Francesa', dt: 'Olivier Pantaloni', reputation: 4, initialSalary: 2000, marketValue: 183325000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Nice. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/nice.png', division: 1 },
  { id: 'olympique_lyonnais', name: 'Olympique Lyonnais', league: 'Francesa', dt: 'Paulo Fonseca', reputation: 4, initialSalary: 67000, marketValue: 180925000, starPlayers: ['Corentin Tolisso (CM)', 'Moussa Niakhaté (CB)', 'Dominik Greif (GK)', 'Nicolás Tagliafico (LB)', 'Tyler Morton (CDM)', 'Endrick (ST)', 'Pavel Šulc (CAM)', 'Malick Fofana (LM)', 'Ainsley Maitland-Niles (RB)', 'Clinton Mata (CB)', 'Tanner Tessmann (CDM)'], description: 'Olympique Lyonnais. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/olympique-lyonnais/olympique-lyonnais-logo-footylogos.svg', division: 1 },
  { id: 'olympique_de_marseille', themeColor: { primary: '#2FAEE0', secondary: '#FFFFFF' }, name: 'Olympique de Marseille', league: 'Francesa', dt: 'Bruno Genesio', reputation: 5, initialSalary: 50500, marketValue: 262750000, starPlayers: ['Mason Greenwood (RM)', 'Gerónimo Rulli (GK)', 'Benjamin Pavard (CB)', 'Pierre-Emile Højbjerg (CDM)', 'Pierre-Emerick Aubameyang (ST)', 'Nayef Aguerd (CB)', 'Leonardo Balerdi (CB)', 'Igor Paixão (LM)', 'Quinten Timber (CM)', 'Facundo Medina (CB)', 'Amine Gouiri (ST)'], description: 'Olympique de Marseille. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/olympique_de_marseille.png', division: 1 },
  { id: 'paris_saint_germain', themeColor: { primary: '#004170', secondary: '#DA291C' }, name: 'Paris Saint-Germain', league: 'Francesa', dt: 'Luis Enrique', reputation: 5, initialSalary: 191900, marketValue: 1222550000, starPlayers: ['Vitinha (CM)', 'Ousmane Dembélé (ST)', 'Achraf Hakimi (RB)', 'Nuno Mendes (LB)', 'Marquinhos (CB)', 'Willian Pacho (CB)', 'João Neves (CM)', 'Khvicha Kvaratskhelia (LW)', 'Fabián Ruiz (CM)', 'Désiré Doué (RW)', 'Bradley Barcola (LW)'], description: 'Paris Saint-Germain. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/paris_saint_germain.png', division: 1 },
  { id: 'racing_club_de_strasbourg_alsace', name: 'Racing Club de Strasbourg Alsace', league: 'Francesa', dt: 'Hugo Oliveira', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Racing Club de Strasbourg Alsace. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: strasbourgBadge, division: 1 },
  { id: 'stade_de_reims', name: 'Stade de Reims', league: 'Francesa', dt: 'Nicolas Usaï', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Keito Nakamura (LM)', 'Nicolas Pallois (CB)', 'Joseph Okumu (CB)', 'Akieme (LB)', 'Théo Leoni (CDM)', 'Mory Gbane (CDM)', 'Yassine Benhattab (RW)', 'Ewen Jaouen (GK)', 'Maxime Busi (RB)', 'Hiroki Sekine (RB)', 'Alexandre Olliero (GK)'], description: 'Stade de Reims. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/stade-de-reims/stade-de-reims-logo-footylogos.svg', division: 1 },
  { id: 'stade_rennais_fc', name: 'Stade Rennais FC', league: 'Francesa', dt: 'Franck Haise', reputation: 4, initialSalary: 35600, marketValue: 264000000, starPlayers: ['Brice Lauriche Samba (GK)', 'Valentin Rongier (CDM)', 'Mahdi Camara (CM)', 'Seko Mohamed Fofana (CM)'], description: 'Stade Rennais FC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/stade-rennais/stade-rennais-logo-footylogos.svg', division: 1 },
  { id: 'toulouse_fc', name: 'Toulouse FC', league: 'Francesa', dt: 'Jens Berthel Askou', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Guillaume Restes (GK)', 'Charlie Cresswell (CB)', 'Rasmus Nicolaisen (CB)', 'Yann Gboho (LW)', 'Djibril Sidibé (RB)', 'Aron Dønnum (RM)', 'Mark McKenzie (CB)', 'Cristian Cásseres Jr (CDM)', 'Emersonn (ST)', 'Warren Kamanzi (RB)', 'Frank Magri (ST)'], description: 'Toulouse FC. Compite en Ligue 1 McDonalds.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/toulouse_fc.png', division: 1 },
  // ==========================================
  // --- HOLANDA (PRIMERA) ---
  // ==========================================
  { id: 'ajax', themeColor: { primary: '#D2122E', secondary: '#FFFFFF' }, name: 'Ajax', league: 'Holandesa', dt: 'John Heitinga', reputation: 5, initialSalary: 66000, marketValue: 149525000, starPlayers: ['Josip Šutalo (CB)', 'Youri Baas (CB)', 'Takehiro Tomiyasu (RB)', 'Steven Berghuis (RW)', 'Wout Weghorst (ST)', 'Mika Godts (LW)', 'Oscar Gloukh (CAM)', 'Kasper Dolberg (ST)', 'Oleksandr Zinchenko (LB)', 'Davy Klaassen (CM)', 'Ko Itakura (CB)'], description: 'Ajax. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/ajax.png', division: 1 },
  { id: 'almere_city_fc', name: 'Almere City FC', league: 'Holandesa', dt: 'Hedwiges Maduro', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Almere City FC. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/almere_city_fc.png', division: 1 },
  { id: 'az', name: 'AZ', league: 'Holandesa', dt: 'Maarten Martens', reputation: 4, initialSalary: 2000, marketValue: 91550000, starPlayers: ['Jordy Clasie (CDM)', 'Troy Parrott (ST)', 'Wouter Goes (CB)', 'Sven Mijnans (CAM)', 'Kees Smit (CAM)', 'Matěj Šín (CAM)', 'Alexandre Penetra (CB)', 'Seiya Maikuma (RB)', 'Mexx Meerdink (ST)', 'Patati (RM)', 'Peer Koopmeiners (CDM)'], description: 'AZ. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/AZ_Alkmaar.svg/250px-AZ_Alkmaar.svg.png', division: 1 },
  { id: 'fc_groningen', name: 'FC Groningen', league: 'Holandesa', dt: 'Dick Lukkien', reputation: 4, initialSalary: 2000, marketValue: 45125000, starPlayers: ['Stije Resink (CDM)', 'Etienne Vaessen (GK)', 'Thijmen Blokzijl (CB)', 'Marvin Peersman (LB)', 'Marco Rente (RB)', 'Dies Janse (CB)', 'Younes Taha (CAM)', 'Thom van Bergen (ST)', 'Brynjólfur Willumsson (ST)', 'Tygo Land (CM)', 'Tika de Jonge (CM)'], description: 'FC Groningen. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fc_groningen.png', division: 1 },
  { id: 'fc_twente', name: 'FC Twente', league: 'Holandesa', dt: 'Joseph Oosting', reputation: 4, initialSalary: 2000, marketValue: 78585000, starPlayers: ['Lars Unnerstall (GK)', 'Bart van Rooij (RB)', 'Ramiz Zerrouki (CDM)', 'Robin Pröpper (CB)', 'Mats Rots (LB)', 'Daan Rots (RW)', 'Sam Lammers (ST)', 'Mees Hilgers (CB)', 'Sondre Ørjasæter (LW)', 'Mathias Kjølø (CDM)', 'Ricky van Wolfswinkel (ST)'], description: 'FC Twente. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fc_twente.png', division: 1 },
  { id: 'fc_utrecht', name: 'FC Utrecht', league: 'Holandesa', dt: 'Ron Jans', reputation: 4, initialSalary: 2000, marketValue: 92335000, starPlayers: ['Souffian El Karouani (LB)', 'Vasilios Barkas (GK)', 'Mike van der Hoorn (CB)', 'Yoann Cathline (LW)', 'Jesper Karlsson (LW)', 'Sébastien Haller (ST)', 'Nick Viergever (CB)', 'Dani de Wit (CAM)', 'Mike Eerdhuijzen (CB)', 'Miguel Rodríguez (RW)', 'Gjivai Zechiël (CM)'], description: 'FC Utrecht. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fc_utrecht.png', division: 1 },
  { id: 'feyenoord', name: 'Feyenoord', league: 'Holandesa', dt: 'Robin van Persie', reputation: 4, initialSalary: 2000, marketValue: 203125000, starPlayers: ['Ayase Ueda (ST)', 'Raheem Sterling (LW)', 'Tsuyoshi Watanabe (CB)', 'Luciano Valente (CM)', 'Sem Steijn (CAM)', 'Timon Wellenreuther (GK)', 'Hwang In Beom (CM)', 'Anis Hadj-Moussa (RW)', 'Givairo Read (RB)', 'Anel Ahmedhodžić (CB)', 'Oussama Targhalline (CM)'], description: 'Feyenoord. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/feyenoord.png', division: 1 },
  { id: 'go_ahead_eagles', name: 'Go Ahead Eagles', league: 'Holandesa', dt: 'Mike Klein', reputation: 4, initialSalary: 2000, marketValue: 40800000, starPlayers: ['Jakob Breum (CAM)', 'Jari De Busser (GK)', 'Melle Meulensteen (CDM)', 'Joris Kramer (CB)', 'Mathis Suray (LM)', 'Victor Edvardsen (ST)', 'Dean James (LB)', 'Alfons Sampsted (RB)', 'Gerrit Nauber (CB)', 'Evert Linthorst (CDM)', 'Kenzo Goudmijn (CAM)'], description: 'Go Ahead Eagles. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/go_ahead_eagles.png', division: 1 },
  { id: 'heracles_almelo', name: 'Heracles Almelo', league: 'Holandesa', dt: 'Bas Sibum', reputation: 4, initialSalary: 2000, marketValue: 38185000, starPlayers: ['Remko Pasveer (GK)', 'Jeff Reine-Adélaïde (CAM)', 'Damon Mirani (CB)', 'Naci Ünüvar (LM)', 'Ajdin Hrustić (CM)', 'Walid Ould-Chikh (LM)', 'Luka Kulenović (ST)', 'Alec Van Hoorenbeeck (CB)', 'Fabian de Keijzer (GK)', 'Ivan Mesík (LB)', 'Jan Žambůrek (CDM)'], description: 'Heracles Almelo. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/heracles_almelo.png', division: 1 },
  { id: 'nac_breda', name: 'NAC Breda', league: 'Holandesa', dt: 'Jo Jansen', reputation: 4, initialSalary: 2000, marketValue: 33750000, starPlayers: ['André Ayew (ST)', 'Daniel Bielica (GK)', 'Denis Odoi (CB)', 'Lewis Holtby (CM)', 'Leo Greiml (CB)', 'Boy Kemper (LB)', 'Kamal Sowah (LM)', 'Clint Leemans (CM)', 'Mohamed Nassoh (LM)', 'Amine Salama (ST)', 'Cherrion Valerius (RB)'], description: 'NAC Breda. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/nac-breda/nac-breda-logo-footylogos.svg', division: 1 },
  { id: 'nec_nijmegen', name: 'NEC Nijmegen', league: 'Holandesa', dt: 'Dick Schreuder', reputation: 4, initialSalary: 2000, marketValue: 57910000, starPlayers: ['Jacobus Antonius Peter Cillessen (GK)', 'Tjaronn Inteff Chefren Chery (CAM)', 'Philippe Sandler (CB)', 'Kodai Sano (CDM)'], description: 'NEC Nijmegen. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/nec-nijmegen/nec-nijmegen-logo-footylogos.svg', division: 1 },
  { id: 'pec_zwolle', name: 'PEC Zwolle', league: 'Holandesa', dt: 'Mirjam Clifford', reputation: 4, initialSalary: 2000, marketValue: 39975000, starPlayers: ['Jasper Schendelaar (GK)', 'Younes Namli (RM)', 'Jamiro Monteiro (CAM)', 'Zico Buurmeester (CM)', 'Simon Graves (CB)', 'Anselmo García MacNulty (CB)', 'Koen Kostons (ST)', 'Tom de Graaff (GK)', 'Ryan Thomas (CM)', 'Odysseus Velanas (LM)', 'Kaj de Rooij (LM)'], description: 'PEC Zwolle. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/pec_zwolle.png', division: 1 },
  { id: 'psv', themeColor: { primary: '#ED1C24', secondary: '#FFFFFF' }, name: 'PSV', league: 'Holandesa', dt: 'Peter Bosz', reputation: 5, initialSalary: 30400, marketValue: 287900000, starPlayers: ['Joey Veerman (CM)', 'Ivan Perišić (LW)', 'Mauro Júnior (LB)', 'Ismael Saibari (CAM)', 'Jerdy Schouten (CB)', 'Sergiño Dest (RB)', 'Alassane Pléa (ST)', 'Dennis Man (RW)', 'Guus Til (CAM)', 'Matěj Kovář (GK)', 'Ryan Flamingo (CB)'], description: 'PSV. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/PSV_Eindhoven_-_Philips_Stadion_-_Kleedkamer_Welkom_-_Cropped_Logo.jpg/250px-PSV_Eindhoven_-_Philips_Stadion_-_Kleedkamer_Welkom_-_Cropped_Logo.jpg', division: 1 },
  { id: 'rkc_waalwijk', name: 'RKC Waalwijk', league: 'Holandesa', dt: 'Henk Fraser', reputation: 4, initialSalary: 2000, marketValue: 21025000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'RKC Waalwijk. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/rkc_waalwijk.png', division: 1 },
  { id: 'sc_heerenveen', name: 'SC Heerenveen', league: 'Holandesa', dt: 'Robin Veldman', reputation: 4, initialSalary: 2000, marketValue: 55725000, starPlayers: ['Ringo Meerveld (CAM)', 'Joris van Overeem (CDM)', 'Jacob Trenskow (RM)', 'Oliver Braude (RB)', 'Marcus Linday (CDM)', 'Bernt Klaverboer (GK)', 'Maas Willemsen (CB)', 'Vasilios Zagaritis (LB)', 'Luuk Brouwers (CM)', 'Dylan Vente (ST)', 'Maxence Rivera (LM)'], description: 'SC Heerenveen. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/sc_heerenveen.png', division: 1 },
  { id: 'sparta_rotterdam', name: 'Sparta Rotterdam', league: 'Holandesa', dt: 'Maurice Steijn', reputation: 4, initialSalary: 2000, marketValue: 45135000, starPlayers: ['Joël Drommel (GK)', 'Tobias Lauritsen (ST)', 'Patrick van Aanholt (LB)', 'Marvin Young (CB)', 'Mitchell van Bergen (RM)', 'Joshua Kitolano (CM)', 'Bruno Martins Indi (CB)', 'Julian Baas (CM)', 'Vito van Crooij (CAM)', 'Teo Quintero (CB)', 'Shunsuke Mito (RM)'], description: 'Sparta Rotterdam. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sparta-rotterdam/sparta-rotterdam-logo-footylogos.svg', division: 1 },
  { id: 'willem_ii', name: 'Willem II', league: 'Holandesa', dt: 'Peter Maes', reputation: 4, initialSalary: 2000, marketValue: 24675000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Willem II. Compite en Eredivisie.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/willem_ii.png', division: 1 },
  // ==========================================
  // --- PORTUGAL (PRIMERA) ---
  // ==========================================
  { id: 'avs_futebol_sad', name: 'AVS Futebol SAD', league: 'Portuguesa', dt: 'José Mota', reputation: 4, initialSalary: 2000, marketValue: 18450000, starPlayers: ['Rúben Semedo (CB)', 'Kiki (LB)', 'Algobia (CM)', 'Cristian Devenish (CB)', 'Tomané (ST)', 'Simão Bertelli (GK)', 'Carlos Ponck (CB)', 'Aderllan Santos (CB)', 'Guillem Molina (RB)', 'Babatunde Akinsola (LM)', 'Óscar Perea (LM)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/avs-futebol-sad/avs-futebol-sad-logo-footylogos.svg', division: 1 },
  { id: 'boavista_fc', name: 'Boavista FC', league: 'Portuguesa', dt: 'Cristiano Bacci', reputation: 4, initialSalary: 2000, marketValue: 22870000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/boavista_fc.png', division: 1 },
  { id: 'casa_pia', name: 'Casa Pia', league: 'Portuguesa', dt: 'João Pereira', reputation: 4, initialSalary: 2000, marketValue: 28875000, starPlayers: ['Jérémy Livolant (RW)', 'Cassiano (ST)', 'Patrick Gilmar Sequeira (GK)', 'José Fonte (CB)', 'Larrazabal (RM)', 'Sebastián Pérez (CDM)', 'Ricardo Batista (GK)', 'Lawrence Ofori (CDM)', 'João Marques (LW)', 'João Goulart (CB)', 'Dailon Livramento (ST)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/casa_pia.png', division: 1 },
  { id: 'cd_nacional', name: 'CD Nacional', league: 'Portuguesa', dt: 'Tiago Margarido', reputation: 4, initialSalary: 2000, marketValue: 41285000, starPlayers: ['Lucas Oliveira de França (GK)', 'José Vítor Lima Cardoso (CB)', 'Igor Matheus Liziero Pereira (CM)', 'Joel Filipe Organista da Silva (CM)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cd_nacional.png', division: 1 },
  { id: 'cd_santa_clara', name: 'CD Santa Clara', league: 'Portuguesa', dt: 'Vasco Matos', reputation: 4, initialSalary: 2000, marketValue: 50400000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cd_santa_clara.png', division: 1 },
  { id: 'estrela_amadora', name: 'Estrela Amadora', league: 'Portuguesa', dt: 'José Faria', reputation: 4, initialSalary: 2000, marketValue: 28635000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/estrela_amadora.png', division: 1 },
  { id: 'estoril_praia', name: 'Estoril Praia', league: 'Portuguesa', dt: 'Ian Cathro', reputation: 4, initialSalary: 2000, marketValue: 53720000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/estoril-praia/estoril-praia-logo-footylogos.svg', division: 1 },
  { id: 'fc_arouca', name: 'FC Arouca', league: 'Portuguesa', dt: 'Vasco Seabra', reputation: 4, initialSalary: 2000, marketValue: 57510000, starPlayers: ['David Martins Simão (CM)', 'Tiago Alexandre de Sousa Esgaio (RB)', 'Nico Alexander Mantl (GK)', 'Alfonso Trezza Hernández (RM)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fc_arouca.png', division: 1 },
  { id: 'fc_famalicao', name: 'FC Famalicão', league: 'Portuguesa', dt: 'Hugo Oliveira', reputation: 4, initialSalary: 2000, marketValue: 48975000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fc_famalicao.png', division: 1 },
  { id: 'fc_porto', themeColor: { primary: '#00408B', secondary: '#004990' }, name: 'FC Porto', league: 'Portuguesa', dt: 'Francesco Farioli', reputation: 4, initialSalary: 51000, marketValue: 312325000, starPlayers: ['Diogo Costa (GK)', 'Thiago Silva (CB)', 'Jakub Kiwior (CB)', 'Alan Varela (CDM)', 'Jan Bednarek (CB)', 'Gabri Veiga (CAM)', 'Samu (ST)', 'Victor Froholdt (CM)', 'Pepê (CAM)', 'Borja Sainz (LW)', 'Pablo Rosario (CDM)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fc_porto.png', division: 1 },
  { id: 'gil_vicente_fc', name: 'Gil Vicente FC', league: 'Portuguesa', dt: 'César Peixoto', reputation: 4, initialSalary: 2000, marketValue: 66025000, starPlayers: ['Ghislain Konan (LB)', 'Santi García (CM)', 'Luís Esteves (CM)', 'Héctor (ST)', 'Zé Carlos (RB)', 'Murilo (RM)', 'Daniel Figueira (GK)', 'Weverson (LB)', 'Buatu (CB)', 'Facundo Agustín Cáseres (CDM)', 'Gustavo Varela (ST)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/gil_vicente_fc.png', division: 1 },
  { id: 'moreirense_fc', name: 'Moreirense FC', league: 'Portuguesa', dt: 'António da Costa', reputation: 4, initialSalary: 2000, marketValue: 50925000, starPlayers: ['Alan de Souza Guimarães (CAM)', 'Jóbson de Brito Gonzaga (CB)', 'Guilherme Schettine Guimarães (ST)', 'Francisco Miguel Ribeiro Tomé Tavares Bondoso (LM)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/moreirense_fc.png', division: 1 },
  { id: 'rio_ave_fc', name: 'Rio Ave FC', league: 'Portuguesa', dt: 'Sotiris Sylaidopoulos', reputation: 4, initialSalary: 2000, marketValue: 56150000, starPlayers: ['Clayton Fernandes Silva (ST)', 'Marios Vrousai (RB)', 'Jakub Brabec (CB)', 'Omar Tyrell Crawford Richards (LB)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/rio_ave_fc.png', division: 1 },
  { id: 'sl_benfica', themeColor: { primary: '#E30613', secondary: '#000000' }, name: 'SL Benfica', league: 'Portuguesa', dt: 'Bruno Lage', reputation: 5, initialSalary: 54900, marketValue: 285500000, starPlayers: ['Vangelis Pavlidis (ST)', 'Dodi Lukébakio Ngandoli (RM)', 'Nicolás Hernán Gonzalo Otamendi (CB)', 'Fredrik Aursnes (CM)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sl-benfica/sl-benfica-logo-footylogos.svg', division: 1 },
  { id: 'sc_braga', name: 'SC Braga', league: 'Portuguesa', dt: 'Carlos Vicens', reputation: 4, initialSalary: 22900, marketValue: 149910000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/sc_braga.png', division: 1 },
  { id: 'sc_farense', name: 'SC Farense', league: 'Portuguesa', dt: 'José Mota', reputation: 4, initialSalary: 2000, marketValue: 17400000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/sc_farense.png', division: 1 },
  { id: 'sporting_cp', themeColor: { primary: '#00713C', secondary: '#FFFFFF' }, name: 'Sporting CP', league: 'Portuguesa', dt: 'Rui Borges', reputation: 5, initialSalary: 38100, marketValue: 468650000, starPlayers: ['Morten Hjulmand (CDM)', 'Pedro Gonçalves (LM)', 'Trincão (CAM)', 'Rui Silva (GK)', 'Gonçalo Inácio (CB)', 'Ousmane Diomande (CB)', 'Luis Javier Suárez (ST)', 'Maximiliano Araújo (LM)', 'Hidemasa Morita (CM)', 'Geny Catamo (RM)', 'Zeno Debast (CB)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sporting-cp/sporting-cp-logo-footylogos.svg', division: 1 },
  { id: 'vitoria_sc', name: 'Vitória SC', league: 'Portuguesa', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Fábio Samuel Amorim da Silva (CM)', 'Nuno Miguel Valente Santos (LM)', 'João Miguel Teixeira Mendes (LB)', 'Gustavo da Silva Cunha (LM)'], description: 'Compite en Liga Portugal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vitoria-sc/vitoria-sc-logo-footylogos.svg', division: 1 },
  // ==========================================
  // --- ESTADOS UNIDOS (MLS) ---
  // ==========================================
  { id: 'atlanta_united', name: 'Atlanta United', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Aleksey Miranchuk (CAM)', 'Miguel Ángel Almirón Rejala (RW)', 'Saba Lobjanidze (RM)', 'Bartosz Slisz (CDM)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atlanta-united/atlanta-united-logo-footylogos.svg', division: 1 },
  { id: 'austin_fc', name: 'Austin FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Facundo Torres (RM)', 'Myrto Uzuni (ST)', 'Mikkel Desler (RB)', 'Brandon Vazquez (ST)', 'Oleksandr Svatok (CB)', 'Ilie Sánchez (CM)', 'Brad Stuver (GK)', 'Robert Taylor (LW)', 'Joseph Rosales (LB)', 'Jayden Nelson (LW)', 'Besard Sabovic (CM)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/austin-fc/austin-fc-logo-footylogos.svg', division: 1 },
  { id: 'cf_montreal', name: 'CF Montréal', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Iván Jaime (LM)', 'Prince Owusu (ST)', 'Brayan Vera (CB)', 'Thomas Gillier (GK)', 'Samuel Piette (CDM)', 'Tomás Avilés (CB)', 'Matty Longstaff (CM)', 'Jalen Neal (CB)', 'Dagur Dan Thorhallsson (RB)', 'Wikelman Carmona (LM)', 'Kwadwo Opoku (ST)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cf-montreal/cf-montreal-logo-footylogos.svg', division: 1 },
  { id: 'charlotte_fc', name: 'Charlotte FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Wilfried Zaha (LW)', 'Pep Biel (CAM)', 'Kristijan Kahlina (GK)', 'Ashley Westwood (CDM)', 'Liel Abada (RM)', 'Tim Ream (CB)', 'Luca de la Torre (CM)', 'Harry Toffolo (LB)', 'David Schnegg (LB)', 'Henry Kessler (CB)', 'Nathan Byrne (RB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/charlotte-fc/charlotte-fc-logo-footylogos.svg', division: 1 },
  { id: 'chicago_fire', name: 'Chicago Fire', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Robert Lewandowski (ST)', 'Jonathan Bamba (LM)', 'Hugo Jean-Marc Cuypers (ST)', 'Philip Aksel Frigast Zinckernagel (RW)'], description: 'Compite en MLS, reforzado con la llegada de Robert Lewandowski tras su salida del FC Barcelona.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/chicago-fire/chicago-fire-logo-footylogos.svg', division: 1 },
  { id: 'colorado_rapids', name: 'Colorado Rapids', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Paxten Aaronson (CM)', 'Zack Steffen (GK)', 'Rob Holding (CB)', 'Reggie Cannon (RB)', 'Alexis Manyoma (RM)', 'Keegan Rosenberry (RB)', 'Hamzat Ojediran (CDM)', 'Rafael Navarro (ST)', 'Connor Ronan (CDM)', 'Ian Murphy (CB)', 'Miguel Navarro (LB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/colorado-rapids/colorado-rapids-logo-footylogos.svg', division: 1 },
  { id: 'columbus_crew', name: 'Columbus Crew', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Diego Rossi (CAM)', 'Dániel Gazdag (CAM)', 'André Gomes (CDM)', 'Max Arfsten (LM)', 'Steven Moreira (CB)', 'Hugo Picard (LM)', 'Nariman Akhundzada (RW)', 'Patrick Schulte (GK)', 'Andrés Herrera (RB)', 'Dylan Chambost (CM)', 'Mohamed Farsi (RM)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/columbus-crew/columbus-crew-logo-footylogos.svg', division: 1 },
  { id: 'dc_united', name: 'DC United', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Christian Benteke Liolo (ST)', 'Randall Enrique Leal Arley (RM)', 'Aarón Joseph Herrera (RB)', 'Kye Francis Rowles (CB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/dc-united/dc-united-logo-footylogos.svg', division: 1 },
  { id: 'fc_cincinnati', name: 'FC Cincinnati', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Evander (CAM)', 'Kévin Denkey (ST)', 'Pavel Bucha (CM)', 'Miles Robinson (CB)', 'Bryan Ramírez (LM)', 'Obinna Nwobodo (CM)', 'Matt Miazga (CB)', 'Roman Celentano (GK)', 'Teenage Hadebe (CB)', 'Nick Hagglund (CB)', 'Ender Echenique (RM)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-cincinnati/fc-cincinnati-logo-footylogos.svg', division: 1 },
  { id: 'fc_dallas', name: 'FC Dallas', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Petar Musa (ST)', 'Herman Johansson (RM)', 'Ramiro (CDM)', 'Shaq Moore (RB)', 'Osaze Urhoghide (CB)', 'Joaquín Valiente (CAM)', 'Anderson Julio (ST)', 'Sebastien Ibeagha (CB)', 'Kaick (CM)', 'Patrickson Delgado (CM)', 'Christian Cappis (CM)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-dallas/fc-dallas-logo-footylogos.svg', division: 1 },
  { id: 'houston_dynamo', name: 'Houston Dynamo', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Agustín Bouzat (CDM)', 'Guilherme (LM)', 'Mateusz Bogusz (LW)', 'Ezequiel Ponce (ST)', 'Diadié Samassékou (CDM)', 'Jack McGlynn (CM)', 'Héctor Herrera (CM)', 'Antônio Carlos (CB)', 'Ondřej Lingr (LM)', 'Artur (CDM)', 'Lucas Halter (CB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/houston-dynamo/houston-dynamo-logo-footylogos.svg', division: 1 },
  { id: 'inter_miami_cf', name: 'Inter Miami CF', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/inter-miami/inter-miami-logo-footylogos.svg', division: 1 },
  { id: 'la_galaxy', name: 'LA Galaxy', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Ricard Puig Martí (CM)', 'Marco Reus (CAM)', 'Joseph Martin Paintsil (LM)', 'Gabriel Fortes Chaves (RM)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/la-galaxy/la-galaxy-logo-footylogos.svg', division: 1 },
  { id: 'lafc', name: 'LAFC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Los_Angeles_Football_Club.svg', division: 1 },
  { id: 'minnesota_united', name: 'Minnesota United', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/minnesota-united/minnesota-united-logo-footylogos.svg', division: 1 },
  { id: 'nashville_sc', name: 'Nashville SC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Hany Mukhtar (CAM)', 'Cristian Espinoza (RM)', 'Sam Surridge (ST)', 'Andy Nájar (RB)', 'Maxwell Woledzi (CB)', 'Bryan Acosta (CM)', 'Joe Willis (GK)', 'Daniel Lovitz (LB)', 'Alex Muyl (LM)', 'Jeison Palacios (CB)', 'Edvard Tagseth (CM)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/nashville-sc/nashville-sc-logo-footylogos.svg', division: 1 },
  { id: 'new_england', name: 'New England', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Collage_of_New_England_related_images_2.png', division: 1 },
  { id: 'new_york_city_fc', name: 'New York City FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Nicolás Fernández (RM)', 'Hannes Wolf (RM)', 'Maxi Moralez (CAM)', 'Alonso Martínez (ST)', 'Thiago (CB)', 'Keaton Parks (CDM)', 'Matt Freese (GK)', 'Aiden O\'Neill (CDM)', 'Raul Gustavo (CB)', 'Kai Trewin (CB)', 'Agustín Ojeda (LM)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/new-york-city-fc/new-york-city-fc-logo-footylogos.svg', division: 1 },
  { id: 'ny_red_bulls', name: 'NY Red Bulls', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 1 },
  { id: 'orlando_city', name: 'Orlando City', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/orlando-city/orlando-city-logo-footylogos.svg', division: 1 },
  { id: 'philadelphia', name: 'Philadelphia', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/philadelphia.png', division: 1 },
  { id: 'portland_timbers', name: 'Portland Timbers', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['David da Costa (CAM)', 'Alexander Aravena (LM)', 'Kamal Miller (CB)', 'Antony (LM)', 'Brandon Bye (RB)', 'Diego Chará (CDM)', 'Joao Ortiz (CDM)', 'Kristoffer Velde (LM)', 'Felipe Mora (ST)', 'Cole Bassett (CAM)', 'Jímer Fory (LB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/portland-timbers/portland-timbers-logo-footylogos.svg', division: 1 },
  { id: 'real_salt_lake', name: 'Real Salt Lake', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Juan Manuel Sanabria (LB)', 'Victor Olatunji (ST)', 'Morgan Guilavogui (LW)', 'Diego Luna (LM)', 'Pablo Ruiz (CDM)', 'Stijn Spierings (CM)', 'Lukas Engel (LB)', 'DeAndre Yedlin (RB)', 'Emeka Eneli (CDM)', 'Juan Arias (CB)', 'Justen Glad (CB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/real-salt-lake/real-salt-lake-logo-footylogos.svg', division: 1 },
  { id: 'san_diego_fc', name: 'San Diego FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Anders Dreyer (RW)', 'Hirving Lozano (LW)', 'Marcus Ingvartsen (ST)', 'Jeppe Tverskov (CM)', 'Lewis Morgan (ST)', 'Amahl Pellegrino (LM)', 'Aníbal Godoy (CM)', 'Onni Valakari (CM)', 'Andrés Reyes (CB)', 'Alex Mighten (LM)', 'Christopher McVey (CB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/san-diego-fc/san-diego-fc-logo-footylogos.svg', division: 1 },
  { id: 'san_jose', name: 'San Jose', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/san_antonio.png', division: 1 },
  { id: 'seattle_sounders', name: 'Seattle Sounders', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Albert Rusnák (CAM)', 'Cristian Roldan (CDM)', 'Yeimar Gómez Andrade (CB)', 'Pedro De la Vega (RM)', 'Jordan Morris (ST)', 'Jackson Ragen (CB)', 'Nouhou Tolo (LB)', 'Jesús Ferreira (ST)', 'Alex Roldan (RB)', 'Stefan Frei (GK)', 'Kim Kee Hee (CB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/seattle-sounders/seattle-sounders-logo-footylogos.svg', division: 1 },
  { id: 'sporting_kc', name: 'Sporting KC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Dejan Joveljić (ST)', 'Manu García (CAM)', 'Lasse Berg Johnsen (CM)', 'Magomed-Shapi Suleymanov (RM)', 'Jake Davis (RB)', 'John Pulskamp (GK)', 'Ethan Bartlow (CB)', 'Stefan Cleveland (GK)', 'Zorhan Bassong (LB)', 'Calvin Harris (RM)', 'Jansen Miller (CB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Sporting_Kansas_City_logo.svg', division: 1 },
  { id: 'st_louis_city_sc', name: 'St. Louis CITY SC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Roman Bürki (GK)', 'Marcel Hartel (CAM)', 'Eduard Löwen (CM)', 'Conrad Wallem (RM)', 'Timo Baumgartl (CB)', 'Mamadou Mbacke (CB)', 'Cedric Teuchert (CAM)', 'Kyle Hiebert (CB)', 'Daniel Edelman (CDM)', 'Sergio Córdova (ST)', 'Fallou Fall (CB)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/st-louis-city-sc/st-louis-city-sc-logo-footylogos.svg', division: 1 },
  { id: 'toronto_fc', name: 'Toronto FC', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Djordje Mihailovic (CAM)', 'Josh Sargent (ST)', 'Walker Zimmerman (CB)', 'Benjamín Kuscevic (CB)', 'José Cifuentes (CM)', 'Richie Laryea (RM)', 'Dániel Sallói (LW)', 'Jonathan Osorio (CM)', 'Matheus Pereira (LB)', 'Theo Corbeanu (RM)', 'Emilio Aristizábal (ST)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/toronto-fc/toronto-fc-logo-footylogos.svg', division: 1 },
  { id: 'vancouver_whitecaps', name: 'Vancouver Whitecaps', league: 'Estadounidense', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Thomas Müller (CAM)', 'Ryan Gauld (LW)', 'Brian White (ST)', 'Andrés Cubas (CDM)', 'Cheikh Sabaly (ST)', 'Yohei Takaoka (GK)', 'Kenji Cabrera (CAM)', 'Mathías Laborda (CB)', 'Tristan Blackmon (CB)', 'Sebastian Berhalter (CM)', 'Emmanuel Sabbi (RW)'], description: 'Compite en MLS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vancouver-whitecaps/vancouver-whitecaps-logo-footylogos.svg', division: 1 },
  // ==========================================
  // --- ESPAÑA (PRIMERA) ---
  // ==========================================
  { id: 'athletic_club_esp', themeColor: { primary: '#EE2523', secondary: '#FFFFFF' }, name: 'Athletic Club', league: 'Española', dt: 'Edin Terzic', reputation: 5, initialSalary: 36200, marketValue: 188300000, starPlayers: ['Fabrício Isidoro (CM)', 'Ronaldo Tavares (ST)', 'Polli (GK)', 'Philipe Sampaio (CB)', 'Zeca (RB)', 'Gustavinho (CAM)', 'Glauco (GK)', 'Léo Chú (LM)', 'Dixon Vera (LW)', 'Sidimar (CB)', 'Gian Franco Cabezas (CM)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/athletic-club.ec38af57.png', division: 1 },
  { id: 'atletico_de_madrid', themeColor: { primary: '#CB3524', secondary: '#272E61' }, name: 'Atlético de Madrid', league: 'Española', dt: 'Diego Simeone', reputation: 5, initialSalary: 145200, marketValue: 526700000, starPlayers: ['Jan Oblak (GK)', 'Julián Alvarez (ST)', 'Alejandro Grimaldo (LB)', 'Antoine Griezmann (ST)', 'Morten Hjulmand (CDM)', 'Pablo Barrios (CM)', 'Álex Baena (LM)', 'Alexander Sørloth (ST)', 'Ademola Lookman (ST)', 'José María Giménez (CB)', 'Giuliano (RM)'], description: 'Compite en LALIGA EA SPORTS, reforzado con Alejandro Grimaldo (Bayer Leverkusen) y Morten Hjulmand (Sporting CP).', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/atletico_de_madrid.png', division: 1 },
  { id: 'ca_osasuna', name: 'CA Osasuna', league: 'Española', dt: 'Luis Miguel Ramis', reputation: 4, initialSalary: 18000, marketValue: 119585000, starPlayers: ['Ante Budimir (ST)', 'Sergio Herrera (GK)', 'Flavien-Enzo Boyomo (CB)', 'Catena (CB)', 'Moncayola (CM)', 'Lucas Torró (CDM)', 'Rubén García (RM)', 'Víctor Muñoz (LW)', 'Valentin Rosier (RB)', 'Javi Galán (LB)', 'Aimar Oroz (CAM)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/ca_osasuna.png', division: 1 },
  { id: 'celta', name: 'Celta', league: 'Española', dt: 'Claudio Giráldez', reputation: 4, initialSalary: 2000, marketValue: 106150000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/celta.png', division: 1 },
  { id: 'd_alaves', name: 'D. Alavés', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: alavesBadge, division: 1 },
  { id: 'elche_cf', name: 'Elche CF', league: 'Española', dt: 'Eder Sarabia', reputation: 4, initialSalary: 2000, marketValue: 69500000, starPlayers: ['Aleix Febas (CM)', 'Iñaki Peña (GK)', 'Bigas (CB)', 'André da Silva (ST)', 'David Affengruber (CB)', 'Valera (LM)', 'Rafa Mir (ST)', 'Matías Dituro (GK)', 'Adrià Pedrosa (LB)', 'Víctor Chust (CB)', 'Marc Aguado (CDM)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/elche_cf.png', division: 1 },
  { id: 'fc_barcelona', themeColor: { primary: '#A50044', secondary: '#004D98' }, name: 'FC Barcelona', league: 'Española', dt: 'Hansi Flick', reputation: 5, initialSalary: 130200, marketValue: 916375000, starPlayers: ['Pedri (CM)', 'Lamine Yamal (RW)', 'Raphinha (LW)', 'Frenkie de Jong (CM)', 'Joan García (GK)', 'Jules Koundé (RB)', 'Anthony Gordon (RW)', 'Karim Adeyemi (LW)', 'Ferran Torres (ST)', 'Dani Olmo (CAM)', 'Eric García (CB)'], description: 'Compite en LALIGA EA SPORTS, reforzado con Anthony Gordon (Newcastle) y Karim Adeyemi (Borussia Dortmund), tras la salida de Robert Lewandowski al Chicago Fire (MLS).', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fc_barcelona.png', division: 1 },
  { id: 'getafe_cf', name: 'Getafe CF', league: 'Española', dt: 'José Bordalás', reputation: 4, initialSalary: 30700, marketValue: 98800000, starPlayers: ['Luis Milla (CM)', 'David Soria (GK)', 'Mauro Arambarri (CM)', 'Diego Rico (LB)', 'Dakonam Djené (CB)', 'Veljko Birmančević (LW)', 'Borja Mayoral (ST)', 'Martín Satriano (ST)', 'Kiko Femenía (RB)', 'Abdelkabir Abqar (CB)', 'Domingos Duarte (CB)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/getafe_cf.png', division: 1 },
  { id: 'girona_fc', name: 'Girona FC', league: 'Española', dt: 'Quique Álvarez', reputation: 2, initialSalary: 800, marketValue: 209400000, starPlayers: ['Marc-André ter Stegen (GK)', 'Paulo Gazzaniga (GK)', 'Arnau Martínez (RB)', 'Viktor Tsygankov (RM)', 'Azzedine Ounahi (CM)', 'Álex Moreno (LB)', 'Fran Beltrán (CM)', 'Bryan Gil (LW)', 'Vladyslav Vanat (ST)', 'Thomas Lemar (CM)', 'Iván Martín (CM)'], description: 'Descendió a LALIGA HYPERMOTION para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/girona_fc.png', division: 2 },
  { id: 'levante_ud', name: 'Levante UD', league: 'Española', dt: 'Julián Calero', reputation: 4, initialSalary: 21600, marketValue: 58975000, starPlayers: ['Mathew Ryan (GK)', 'Carlos Álvarez (RM)', 'Manu Sánchez (LB)', 'Pablo Martínez (LM)', 'Karl Edouard Etta Eyong (ST)', 'Jeremy Toljan (RB)', 'Dela (CB)', 'Iván Romero (ST)', 'Kervin Arriaga (CDM)', 'Morales (ST)', 'Oriol Rey (CM)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/levante_ud.png', division: 1 },
  { id: 'r_oviedo', name: 'R. Oviedo', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Descendió a LALIGA HYPERMOTION para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/oviedo.46d87170.png', division: 2 },
  { id: 'rcd_espanyol', name: 'RCD Espanyol', league: 'Española', dt: 'Manolo González', reputation: 4, initialSalary: 2000, marketValue: 109550000, starPlayers: ['Marko Dmitrović (GK)', 'Carlos Romero (LB)', 'Edu Expósito (CAM)', 'Leandro Cabrera (CB)', 'Puado (LM)', 'Omar El Hilali (RB)', 'Pol Lozano (CDM)', 'Pere Milla (LM)', 'Calero (CB)', 'Urko González (CDM)', 'Tyrhys Dolan (RW)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/rcd_espanyol.png', division: 1 },
  { id: 'rcd_mallorca', name: 'RCD Mallorca', league: 'Española', dt: 'Luis García', reputation: 2, initialSalary: 800, marketValue: 84550000, starPlayers: ['Vedat Muriqi (ST)', 'Raíllo (CB)', 'Sergi Darder (CM)', 'Maffeo (RB)', 'Samú Costa (CDM)', 'Leo Román (GK)', 'Martin Valjent (CB)', 'Johan Mojica (LB)', 'Manu Morlanes (CDM)', 'Marash Kumbulla (CB)', 'Omar Mascarell (CDM)'], description: 'Descendió a LALIGA HYPERMOTION para la temporada 2026-27.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/rcd_mallorca.png', division: 2 },
  { id: 'rayo_vallecano', name: 'Rayo Vallecano', league: 'Española', dt: 'Beñat San José', reputation: 4, initialSalary: 2000, marketValue: 105050000, starPlayers: ['Álvaro García (LM)', 'Isi (CAM)', 'De Frutos (RM)', 'Augusto Batalla (GK)', 'Andrei Rațiu (RB)', 'Florian Lejeune (CB)', 'Pep Chavarría (LB)', 'Pathé Ciss (CDM)', 'Óscar Valentín (CDM)', 'Abdul Mumin (CB)', 'Unai López (CM)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/rayo_vallecano.png', division: 1 },
  { id: 'real_betis', themeColor: { primary: '#00954C', secondary: '#FFFFFF' }, name: 'Real Betis', league: 'Española', dt: 'Manuel Pellegrini', reputation: 4, initialSalary: 2000, marketValue: 228875000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/real_betis.png', division: 1 },
  { id: 'real_madrid', themeColor: { primary: '#FEBE10', secondary: '#00529F' }, name: 'Real Madrid', league: 'Española', dt: 'José Mourinho', reputation: 5, initialSalary: 152600, marketValue: 1369525000, starPlayers: ['Kylian Mbappé (ST)', 'Thibaut Courtois (GK)', 'Jude Bellingham (CAM)', 'Vini Jr. (LW)', 'Yan Diomandé (RW)', 'Marc Cucurella (LB)', 'Bernardo Silva (CM)', 'Ibrahima Konaté (CB)', 'Denzel Dumfries (RB)', 'Éder Militão (CB)', 'Rodrygo (LM)'], description: 'Compite en LALIGA EA SPORTS, con cinco refuerzos de mercado: Cucurella, Bernardo Silva, Konaté, Dumfries y el bombazo Yan Diomandé (RB Leipzig, +100M€), tras la salida de Dani Carvajal.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/real_madrid.png', division: 1 },
  { id: 'real_sociedad', name: 'Real Sociedad', league: 'Española', dt: 'Pellegrino Matarazzo', reputation: 4, initialSalary: 72500, marketValue: 287575000, starPlayers: ['Álex Remiro (GK)', 'Oyarzabal (ST)', 'Takefusa Kubo (RM)', 'Yangel Herrera (CM)', 'Sergio Gómez (LM)', 'Brais Méndez (CM)', 'Barrenetxea (LW)', 'Jon Mikel Aramburu (RB)', 'Carlos Soler (CM)', 'Zubeldia (CB)', 'Gorrotxa (CDM)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/real_sociedad.png', division: 1 },
  { id: 'sevilla_fc', themeColor: { primary: '#D71920', secondary: '#FFFFFF' }, name: 'Sevilla FC', league: 'Española', dt: 'Matías Almeyda', reputation: 4, initialSalary: 82600, marketValue: 192675000, starPlayers: ['Odysseas Vlachodimos (GK)', 'Azpilicueta (CB)', 'Ruben Vargas (LW)', 'Carmona (RB)', 'Chidera Ejuke (LW)', 'Nemanja Gudelj (CDM)', 'Batista Mendy (CDM)', 'Kike Salas (CB)', 'Juanlu Sánchez (RB)', 'Lucien Agoumé (CDM)', 'Djibril Sow (CM)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/sevilla_fc.png', division: 1 },
  { id: 'valencia_cf', themeColor: { primary: '#F97300', secondary: '#000000' }, name: 'Valencia CF', league: 'Española', dt: 'Carlos Corberán', reputation: 4, initialSalary: 48400, marketValue: 174950000, starPlayers: ['Stole Dimitrievski (GK)', 'Gayà (LB)', 'Luis Rioja (RM)', 'Hugo Duro (ST)', 'Diego López (LM)', 'Agirrezabala (GK)', 'Guido Rodríguez (CDM)', 'Umar Sadiq (ST)', 'Pepelu (CM)', 'Javi Guerra (CM)', 'Mouctar Diakhaby (CB)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/valencia_cf.png', division: 1 },
  { id: 'villarreal_cf', themeColor: { primary: '#FFE667', secondary: '#005187' }, name: 'Villarreal CF', league: 'Española', dt: 'Marcelino', reputation: 5, initialSalary: 57500, marketValue: 298900000, starPlayers: ['Nicolas Pépé (RM)', 'Moleiro (LM)', 'Gerard Moreno (ST)', 'Ayoze (ST)', 'Pape Gueye (CM)', 'Parejo (CM)', 'Georges Mikautadze (ST)', 'Thomas Partey (CDM)', 'Sergi Cardona (LB)', 'Juan Foyth (CB)', 'Luiz Júnior (GK)'], description: 'Compite en LALIGA EA SPORTS.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/villarreal-cf/villarreal-cf-logo-footylogos.svg', division: 1 },
  // ==========================================
  // --- ESPAÑA (SEGUNDA) ---
  // ==========================================
  { id: 'ad_ceuta_fc', name: 'AD Ceuta FC', league: 'Española', dt: 'José Juan Romero', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Anuar Mohamed Tuhamiأنور محمد تهامي (RM)', 'Salvador Sánchez Ponce (RM)', 'Juan Tomás Ortuño Martínez (ST)', 'Yann Yves Laurent Bodiger (CDM)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ceuta/ceuta-logo-footylogos.svg', division: 2 },
  { id: 'albacete_bp', name: 'Albacete BP', league: 'Española', dt: 'Alberto González', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/albacete.6a43625c.png', division: 2 },
  { id: 'burgos_cf', name: 'Burgos CF', league: 'Española', dt: 'Sergio Francisco', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Atienza (CDM)', 'Iñigo Córdoba (LM)', 'Jesús Ruiz (GK)', 'Cantero (GK)', 'Florian Miguel (LB)', 'Curro Sánchez (CAM)', 'Fer Niño (ST)', 'Sergio González (CB)', 'Mario González (ST)', 'Kévin Appin (CM)', 'Oier Luengo (CB)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/burgos_cf.png', division: 2 },
  { id: 'cd_castellon', name: 'CD Castellón', league: 'Española', dt: 'Pablo Hernández', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Cala (CAM)', 'Jérémy Mellot (RB)', 'Brian Cipenga (LM)', 'Raúl Sánchez (LM)', 'Romain Matthys (GK)', 'Alberto Jiménez (CB)', 'Fabrizio Brignani (CB)', 'Ousmane Camara (ST)', 'Isra Suero (ST)', 'Amir Abedzadeh (GK)', 'Awer Mabil (RM)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cd_castellon.png', division: 2 },
  { id: 'cd_leganes', name: 'CD Leganés', league: 'Española', dt: 'Rubén Albés', reputation: 2, initialSalary: 800, marketValue: 27760000, starPlayers: ['Juan Soriano (GK)', 'Dani Rodríguez (LM)', 'Amadou Diawara (CDM)', 'Lalo Aguilar (CB)', 'Juan Cruz (RW)', 'Rubén Peña (RB)', 'Franquesa (LB)', 'Seydouba Cisse (CM)', 'Duk (LW)', 'Jorge Sáenz (CB)', 'Melero (CM)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cd_leganes.png', division: 2 },
  { id: 'cd_mirandes', name: 'CD Mirandés', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Carlos Fernández (ST)', 'Igor Nikic (GK)', 'Juan Gutiérrez (CB)', 'Javi Hernández (RM)', 'Nikola Maraš (CB)', 'Postigo (CB)', 'Pica (CB)', 'Martín Pascual (CB)', 'Mickaël Malsa (CDM)', 'Hugo Novoa (RM)', 'Thiago Helguera (CM)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cd_mirandes.png', division: 2 },
  { id: 'cultural_leonesa', name: 'Cultural Leonesa', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Edgar Badia (GK)', 'Nemanja Radoja (CDM)', 'Chacón (CAM)', 'Lucas Ribeiro (RM)', 'Rubén Sobrino (RM)', 'Iván Calero (RB)', 'Matia Barzić (CB)', 'Rodri Suárez (CB)', 'Roger Hinojo (LB)', 'Thiago Ojeda (CDM)', 'Tresaco (LM)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cultural_leonesa.png', division: 2 },
  { id: 'cadiz_cf', name: 'Cádiz CF', league: 'Española', dt: 'Imanol Idiakez', reputation: 2, initialSalary: 800, marketValue: 34450000, starPlayers: ['Suso (RM)', 'Ontiveros (LM)', 'Rominigue Kouamé (CM)', 'Iza Carcelén (RB)', 'Álex Fernández (CM)', 'Brian Ocampo (LM)', 'David Gil (GK)', 'Iuri Tabatadze (RM)', 'Sergio Ortuño (CM)', 'Antoñito Cordero (LM)', 'Víctor Aznar (GK)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cadiz_cf.png', division: 2 },
  { id: 'cordoba_cf', name: 'Córdoba CF', league: 'Española', dt: 'Iván Ania', reputation: 2, initialSalary: 800, marketValue: 4600000, starPlayers: ['Carracedo (RW)', 'Adri Fuentes (ST)', 'Isma Ruiz (CDM)', 'Jacobo González (LW)', 'Albarrán (RB)', 'Xavi Sintes (CB)', 'Iker Álvarez (GK)', 'Mikel Goti (CAM)', 'Carlos Marín (GK)', 'Franck Fomeyem (CB)', 'Vilarrasa (LB)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/cordoba_cf.png', division: 2 },
  { id: 'fc_andorra', name: 'FC Andorra', league: 'Española', dt: 'Carles Manso', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Edgar (CB)', 'Áron Yaakobishvili (GK)', 'Imanol (LB)', 'Kim Min Su (LW)', 'Nicolás Ratti (GK)', 'Lautaro (ST)', 'Manu Nieto (ST)', 'Olabarrieta (RW)', 'Jastin (LM)', 'Marc Cardona (ST)', 'Thomas Carrique (RB)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/fc_andorra.png', division: 2 },
  { id: 'granada_cf', name: 'Granada CF', league: 'Española', dt: 'Pacheta', reputation: 2, initialSalary: 800, marketValue: 39475000, starPlayers: ['Rubén Alcaraz (CM)', 'Álex Sola (RW)', 'José Arnáiz (CAM)', 'Manu Lama (CB)', 'Loïc Williams (CB)', 'Baïla Diallo (LB)', 'Alemañ (CM)', 'Sergio Ruiz (CDM)', 'Jorge Pascual (ST)', 'Gonzalo Petit (ST)', 'Izan González (CM)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/granada_cf.png', division: 2 },
  { id: 'malaga_cf', name: 'Málaga CF', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 8035000, starPlayers: ['Alfonso Herrero (GK)', 'Larrubia (RW)', 'Chupe (ST)', 'Joaquín (LW)', 'Adrián Niño (ST)', 'Izan Merino (CM)', 'Luismi (CDM)', 'Puga (RB)', 'Dani Lorenzo (CM)', 'Murillo (CB)', 'Einar Galilea (CB)'], description: 'Ascendió a LALIGA EA SPORTS para la temporada 2026-27 tras ganar la final del playoff a la UD Almería.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/malaga_cf.png', division: 1 },
  { id: 'r_racing_club', name: 'R. Racing Club', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Ascendió a LALIGA EA SPORTS para la temporada 2026-27 como campeón de Segunda, tras 14 años fuera de Primera.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Escudo_de_Racing_Club_%282014%29.svg', division: 1 },
  { id: 'r_sporting', name: 'R. Sporting', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽', division: 2 },
  { id: 'r_valladolid_cf', name: 'R. Valladolid CF', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Jugador 1', 'Jugador 2'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/r_valladolid_cf.png', division: 2 },
  { id: 'rc_deportivo', name: 'RC Deportivo', league: 'Española', dt: 'DT Genérico', reputation: 4, initialSalary: 2000, marketValue: 10000000, starPlayers: ['Yeremay (LM)', 'Mario Soriano (CAM)', 'Álvaro Ferllo (GK)', 'Alti (RB)', 'Loureiro (CB)', 'Villares (CM)', 'José Gragera (CDM)', 'Luismi Cruz (RM)', 'Ximo Navarro (RB)', 'Mella (RM)', 'Samuele Mulattieri (ST)'], description: 'Ascendió a LALIGA EA SPORTS para la temporada 2026-27, tras 8 años fuera de Primera.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/deportivo.b5f18973.png', division: 1 },
  { id: 'real_sociedad_b', name: 'Real Sociedad B', league: 'Española', dt: 'Jon Ansotegui', reputation: 2, initialSalary: 800, marketValue: 2500000, starPlayers: ['Luken Beitia (CB)', 'Fraga (GK)', 'Mikel Rodríguez (CM)', 'Mariezkurrena (ST)', 'Dadie (RB)', 'Job Nguono Ochieng (LM)', 'Gorka Carrera (ST)', 'Kazunari Kita (CB)', 'Jon Balda (LB)', 'Dani Díaz (RM)', 'Rupérez (RB)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/tm/real_sociedad_b.png', division: 2 },
  { id: 'real_zaragoza', name: 'Real Zaragoza', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 3450000, starPlayers: ['Jawad El Yamiq (CB)', 'Paul Akouokou (CDM)', 'Insua (CB)', 'Esteban Andrada (GK)', 'Francho Serrano (CM)', 'Dani Tasende (LB)', 'Keidi Bare (CDM)', 'Tachi (CB)', 'Sebas Moyano (LM)', 'Rober (RM)', 'Valery (LM)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/real_zaragoza.png', division: 2 },
  { id: 'sd_eibar', name: 'SD Eibar', league: 'Española', dt: 'Jokin Aranbarri', reputation: 2, initialSalary: 800, marketValue: 16350000, starPlayers: ['Juan Bernat (LB)', 'Nolaskoain (CDM)', 'Magunagoitia (GK)', 'Marco Moreno (CB)', 'Corpas (RM)', 'Sergio Álvarez (CDM)', 'Cubero (RB)', 'Arbilla (CB)', 'Jon Bautista (ST)', 'Javi Martón (ST)', 'Aleix Garrido (CM)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/sd_eibar.png', division: 2 },
  { id: 'sd_huesca', name: 'SD Huesca', league: 'Española', dt: 'DT Genérico', reputation: 2, initialSalary: 800, marketValue: 10900000, starPlayers: ['Dani Jiménez (GK)', 'Pulido (CB)', 'Óscar Sielva (CM)', 'Nacho Laquintana (RW)', 'Jaime Seoane (CM)', 'Joaquín (CB)', 'Jesús Alvarez (CDM)', 'Enol Rodríguez (ST)', 'Portillo (CAM)', 'Jordi Martín (LM)', 'Jordi Escobar (ST)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/sd_huesca.png', division: 2 },
  { id: 'ud_almeria', name: 'UD Almería', league: 'Española', dt: 'García Pimienta', reputation: 2, initialSalary: 800, marketValue: 46100000, starPlayers: ['Arribas (CAM)', 'Embarba (LW)', 'Rodrigo Ely (CB)', 'Andrés Fernández (GK)', 'Álex Muñoz (LB)', 'Dion Lopy (CDM)', 'Morci (LW)', 'Daijiro Chirino (RB)', 'Federico Bonini (CB)', 'Puigmal (RM)', 'Nélson Monte (CB)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/ud_almeria.png', division: 2 },
  { id: 'ud_las_palmas', name: 'UD Las Palmas', league: 'Española', dt: 'Rubén de la Barrera', reputation: 2, initialSalary: 800, marketValue: 43350000, starPlayers: ['Sandro (RM)', 'Kirian (CM)', 'Dinko Horkaš (GK)', 'Mika Mármol (CB)', 'Manu Fuster (LM)', 'Enzo Loiodice (CM)', 'Sergio Barcia (CB)', 'Taisei Miyashiro (LW)', 'Álex Suárez (CB)', 'Viti Rozada (RB)', 'Nicolás Benedetti (CAM)'], description: 'Compite en LALIGA HYPERMOTION.', badgeColor: 'border-l-4 border-slate-500 bg-slate-900 text-white', badgeLogoUrl: '⚽',
    badgeImageUrl: 'badges/clubs/ud_las_palmas.png', division: 2 },

  // ==========================================
  // --- CLUBES CLASIFICADOS A CHAMPIONS / EUROPA LEAGUE 2025-26 (Fase 1c) ---
  // Países sin liga doméstica jugable en el juego (no aparecen como
  // nacionalidad seleccionable en SetupScreen): solo participan de las
  // copas europeas. DT y figuras verificados en Transfermarkt (jul-2026).
  // marketValue/initialSalary escalados a la economía interna del juego
  // (no son los valores reales de Transfermarkt, que llegan a los
  // €300M+ y romperían el balance frente al resto de la base de datos).
  // ==========================================
  { id: 'club_brugge', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'Club Brugge KV', league: 'Belga', dt: 'Ivan Leko', reputation: 5, initialSalary: 5600, marketValue: 38000000, starPlayers: ['Christos Tzolis', 'Joel Ordóñez', 'Nicolò Tresoldi', 'Raphael Onyedika', 'Joaquin Seys'], description: 'Clasificado a la Champions League 2025-26. El grande de Brujas, referente de la Jupiler Pro League.', badgeColor: 'border-l-4 border-blue-600 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚫',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Club_brugge.png', division: 1 },
  { id: 'union_sg', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'Royale Union Saint-Gilloise', league: 'Belga', dt: 'David Hubert', reputation: 4, initialSalary: 3200, marketValue: 22000000, starPlayers: ['Anan Khalaili', 'Promise David', 'Kevin Mac Allister', 'Adem Zorgane', 'Kamiel Van De Perre'], description: 'Clasificado a la Champions League 2025-26. Campeón belga, en plena resurrección europea.', badgeColor: 'border-l-4 border-yellow-400 bg-blue-900 text-yellow-200', badgeLogoUrl: '💛💙',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/union-saint-gilloise/union-saint-gilloise-logo-footylogos.svg', division: 1 },
  { id: 'krc_genk', themeColor: { primary: '#3b82f6', secondary: '#f5f0e8' }, name: 'KRC Genk', league: 'Belga', dt: 'Jess Thorup', reputation: 4, initialSalary: 3100, marketValue: 21000000, starPlayers: ['Konstantinos Karetsas', 'Zakaria El Ouahdi', 'Matte Smets', 'Bryan Heynen', 'Ibrahima Sory Bangoura'], description: 'Clasificado a la Europa League 2025-26. Cantera prolífica del fútbol belga.', badgeColor: 'border-l-4 border-blue-500 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/krc-genk/krc-genk-logo-footylogos.svg', division: 1 },
  { id: 'olympiacos', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'Olympiacos FC', league: 'Griega', dt: 'José Luis Mendilibar', reputation: 5, initialSalary: 5000, marketValue: 34000000, starPlayers: ['Christos Mouzakitis', 'Konstantinos Tzolakis', 'Santiago Hezze', 'Lorenzo Pirola', 'Jota Silva'], description: 'Clasificado a la Champions League 2025-26. El gigante del Pireo, dominador de la Super League griega.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/olympiacos/olympiacos-logo-footylogos.svg', division: 1 },
  { id: 'paok', name: 'PAOK Thessaloniki', league: 'Griega', dt: 'Alessio Lisci', reputation: 4, initialSalary: 2300, marketValue: 14000000, starPlayers: ['Giannis Konstantelias', 'Christos Zafeiris', 'Andrija Zivkovic', 'Mady Camara', 'Kiril Despodov'], description: 'Clasificado a la Europa League 2025-26. Referente del norte de Grecia.', badgeColor: 'border-l-4 border-slate-300 bg-black text-white', badgeLogoUrl: '⚫⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/paok/paok-logo-footylogos.svg', division: 1 },
  { id: 'panathinaikos', themeColor: { primary: '#22c55e', secondary: '#f5f0e8' }, name: 'Panathinaikos FC', league: 'Griega', dt: 'Jacob Neestrup', reputation: 4, initialSalary: 2400, marketValue: 15000000, starPlayers: ['Victor Kristiansen', 'Anass Zaroury', 'Rick van Drongelen', 'Santino Andino', 'Pedro Chirivella'], description: 'Clasificado a la Europa League 2025-26. El trébol de Atenas.', badgeColor: 'border-l-4 border-green-500 bg-slate-900/40 text-green-100', badgeLogoUrl: '☘️💚',
    badgeImageUrl: 'badges/clubs/panathinaikos.png', division: 1 },
  { id: 'slavia_praha', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'SK Slavia Praha', league: 'Checa', dt: 'Jindřich Trpišovský', reputation: 4, initialSalary: 2900, marketValue: 19000000, starPlayers: ['David Moses', 'Stepan Chaloupek', 'David Zima', 'Igoh Ogbu', 'Michal Sadílek'], description: 'Clasificado a la Champions League 2025-26. Campeón checo, con paso firme en Europa.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/slavia-praha/slavia-praha-logo-footylogos.svg', division: 1 },
  { id: 'viktoria_plzen', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'FC Viktoria Plzeň', league: 'Checa', dt: 'Martin Hyský', reputation: 3, initialSalary: 1300, marketValue: 7200000, starPlayers: ['Lukáš Červ', 'Sampson Dweh', 'Amar Memić', 'Karel Špaček', 'Cheick Souaré'], description: 'Clasificado a la Europa League 2025-26. Habitual de la fase de grupos europea.', badgeColor: 'border-l-4 border-blue-600 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'badges/clubs/viktoria_plzen.png', division: 1 },
  { id: 'bodo_glimt', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'FK Bodø/Glimt', league: 'Noruega', dt: 'Kjetil Knutsen', reputation: 3, initialSalary: 1700, marketValue: 10000000, starPlayers: ['Jens Petter Hauge', 'Kasper Høgh', 'Fredrik Sjøvold', 'Patrick Berg', 'Håkon Evjen'], description: 'Clasificado a la Champions League 2025-26. La revelación noruega, fútbol vistoso desde el Ártico.', badgeColor: 'border-l-4 border-yellow-400 bg-black text-yellow-200', badgeLogoUrl: '💛⚫', badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/FK_Bodo_Glimt_logo.svg', division: 1 },
  { id: 'brann_sk', themeColor: { primary: '#ef4444', secondary: '#f5f0e8' }, name: 'SK Brann', league: 'Noruega', dt: 'Eirik Horneland', reputation: 2, initialSalary: 780, marketValue: 3400000, starPlayers: ['Felix Horn Myhre (CM)', 'Fredrik Knudsen (CB)', 'Jacob Sørensen (CDM)', 'Mathias Dyngeland (GK)', 'Jón Dagur Þorsteinsson (LW)', 'Vetle Dragsnes (LB)', 'Joachim Soltvedt (LB)', 'Bård Finne (ST)', 'Niklas Castro (LW)', 'Sævar Atli Magnússon (RW)', 'Noah Jean Holm (ST)'], description: 'Clasificado a la Europa League 2025-26. Orgullo de Bergen.', badgeColor: 'border-l-4 border-red-500 bg-slate-900/40 text-red-100', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sk-brann/sk-brann-logo-footylogos.svg', division: 1 },
  { id: 'fc_copenhagen', themeColor: { primary: '#ef4444', secondary: '#f5f0e8' }, name: 'FC København', league: 'Danesa', dt: 'Bo Svensson', reputation: 3, initialSalary: 1600, marketValue: 9200000, starPlayers: ['Mohamed Elyounoussi (RM)', 'Dominik Kotarski (GK)', 'Gabriel Pereira (CB)', 'Thomas Delaney (CDM)', 'Rodrigo Huescas (RB)', 'Jordan Larsson (RM)', 'Amir Richardson (CM)', 'Pantelis Hatzidiakos (CB)', 'Marcos López (LB)', 'Mads Emil Madsen (CM)', 'Youssoufa Moukoko (ST)'], description: 'Clasificado a la Champions League 2025-26. El más grande de Dinamarca.', badgeColor: 'border-l-4 border-red-500 bg-white text-slate-900', badgeLogoUrl: '⚪🔴', division: 1 },
  { id: 'midtjylland', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'FC Midtjylland', league: 'Danesa', dt: 'Mike Tullberg', reputation: 4, initialSalary: 2600, marketValue: 16500000, starPlayers: ['Philip Billing (CM)', 'Aral Şimşir (LW)', 'Mads Bech Sørensen (CB)', 'Darío Osorio (RM)', 'Franculino (ST)', 'Elías Rafn Ólafsson (GK)', 'Martin Erlić (CB)', 'Ousmane Diao (CB)', 'Lee Han Beom (CB)', 'Victor Bak (LB)', 'Mikael Uhre (ST)'], description: 'Clasificado a la Europa League 2025-26. Pionero del análisis de datos en el fútbol danés.', badgeColor: 'border-l-4 border-red-600 bg-black text-red-200', badgeLogoUrl: '🔴⚫',
    badgeImageUrl: 'badges/clubs/midtjylland.png', division: 1 },
  { id: 'galatasaray', themeColor: { primary: '#ef4444', secondary: '#f5f0e8' }, name: 'Galatasaray SK', league: 'Turca', dt: 'Okan Buruk', reputation: 5, initialSalary: 6600, marketValue: 46000000, starPlayers: ['Victor Osimhen', 'Barış Alper Yılmaz', 'Gabriel Sara', 'Wilfried Singo', 'Lesley Ugochukwu'], description: 'Clasificado a la Champions League 2025-26. Cim Bom Bom, campeón de Turquía.', badgeColor: 'border-l-4 border-red-500 bg-yellow-500 text-red-900', badgeLogoUrl: '🟡🔴',
    badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Galatasaray_S.K._Logo_2026_5-stars.svg', division: 1 },
  { id: 'fenerbahce', themeColor: { primary: '#1e40af', secondary: '#f5f0e8' }, name: 'Fenerbahçe SK', league: 'Turca', dt: 'İsmail Kartal', reputation: 5, initialSalary: 6800, marketValue: 48000000, starPlayers: ['Mason Greenwood', 'Mattéo Guendouzi', 'Kerem Aktürkoğlu', 'Dorgeles Nene', 'Jayden Oosterwolde'], description: 'Clasificado a la Europa League 2025-26. El gigante amarillo y azul marino de Estambul.', badgeColor: 'border-l-4 border-blue-800 bg-yellow-400 text-blue-950', badgeLogoUrl: '💛🔵',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fenerbahce/fenerbahce-logo-footylogos.svg', division: 1 },
  { id: 'qarabag', themeColor: { primary: '#1d4ed8', secondary: '#f5f0e8' }, name: 'Qarabağ FK', league: 'Azerí', dt: 'Qurban Qurbanov', reputation: 2, initialSalary: 700, marketValue: 2800000, starPlayers: ['Leandro Andrade (RW)', 'Mateusz Kochalski (GK)', 'Kady (CAM)', 'Toral Bayramov (LB)', 'Abdellah Zoubir (LW)', 'Matheus Silva (RB)', 'Pedro Bicalho (CM)', 'Marko Janković (CM)', 'Oleksiy Kashchuk (RW)', 'Elvin Cafarquliyev (LB)', 'Shahruddin Magomedaliyev (GK)'], description: 'Clasificado a la Champions League 2025-26. Dominador absoluto del fútbol azerí.', badgeColor: 'border-l-4 border-blue-700 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/qarabag-fk/qarabag-fk-logo-footylogos.svg', division: 1 },
  { id: 'pafos_fc', themeColor: { primary: '#0ea5e9', secondary: '#f5f0e8' }, name: 'Pafos FC', league: 'Chipriota', dt: 'Ricardo Sá Pinto', reputation: 2, initialSalary: 750, marketValue: 3200000, starPlayers: ['Biel', 'Radoslaw Majecki', 'Guga', 'Pêpê', 'Vlad Dragomir'], description: 'Clasificado a la Champions League 2025-26. Debut histórico del fútbol chipriota en la fase de liga.', badgeColor: 'border-l-4 border-sky-500 bg-slate-900/40 text-sky-100', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/pafos-fc/pafos-fc-logo-footylogos.svg', division: 1 },
  { id: 'kairat_almaty', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'Kairat Almaty', league: 'Kazaja', dt: 'Rafael Urazbakhtin', reputation: 2, initialSalary: 550, marketValue: 1800000, starPlayers: ['Dastan Satpaev', 'Temirlan Anarbekov', 'Oiva Jukkola', 'Jaakko Oksanen', 'Luís Mata'], description: 'Clasificado a la Champions League 2025-26. Primer club kazajo en la fase de liga de la máxima competición europea.', badgeColor: 'border-l-4 border-yellow-400 bg-black text-yellow-200', badgeLogoUrl: '💛⚫',
    badgeImageUrl: 'badges/clubs/kairat_almaty.png', division: 1 },
  { id: 'rb_salzburg', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'FC Red Bull Salzburg', league: 'Austríaca', dt: 'Danny Röhl', reputation: 4, initialSalary: 29300, marketValue: 152400000, starPlayers: ['Karim Konaté', 'Edmund Baidoo', 'Soumaïla Diabaté', 'Maurits Kjærgaard', 'Adam Daghim'], description: 'Clasificado a la Europa League 2025-26. Cantera y proyección constante en Austria.', badgeColor: 'border-l-4 border-red-600 bg-white text-red-700', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'badges/clubs/rb_salzburg.png', division: 1 },
  { id: 'sturm_graz', name: 'SK Sturm Graz', league: 'Austríaca', dt: 'Fabio Ingolitsch', reputation: 3, initialSalary: 1350, marketValue: 7600000, starPlayers: ['Nelson Weiper', 'Otar Kiteishvili', 'Luca Weinhandl', 'Jacob Peter Hödl', 'Jeyland Mitchell'], description: 'Clasificado a la Europa League 2025-26. Campeón austríaco, el otro grande de Graz.', badgeColor: 'border-l-4 border-slate-300 bg-black text-white', badgeLogoUrl: '⚫⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sk-sturm-graz/sk-sturm-graz-logo-footylogos.svg', division: 1 },
  { id: 'rangers_fc', themeColor: { primary: '#1d4ed8', secondary: '#f5f0e8' }, name: 'Rangers FC', league: 'Escocesa', dt: 'Derek McInnes', reputation: 4, initialSalary: 20200, marketValue: 105000000, starPlayers: ['Emmanuel Fernandez', 'Youssef Chermiti', 'Nicolas Raskin', 'Ivor Pandur', 'Dan Neil'], description: 'Clasificado a la Europa League 2025-26. Histórico de Glasgow, azul real.', badgeColor: 'border-l-4 border-blue-700 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'badges/clubs/rangers_fc.png', division: 1 },
  { id: 'celtic_fc', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'Celtic FC', league: 'Escocesa', dt: "Martin O'Neill", reputation: 4, initialSalary: 3000, marketValue: 20000000, starPlayers: ['Arne Engels', 'Reo Hatate', 'Cameron Carter-Vickers', 'Kieran Tierney', 'Alistair Johnston'], description: 'Clasificado a la Europa League 2025-26. Los Hoops verdiblancos de Glasgow.', badgeColor: 'border-l-4 border-green-600 bg-white text-green-800', badgeLogoUrl: '💚⚪',
    badgeImageUrl: 'badges/clubs/celtic_fc.png', division: 1 },
  { id: 'young_boys', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'BSC Young Boys', league: 'Suiza', dt: 'Gerardo Seoane', reputation: 3, initialSalary: 1450, marketValue: 8200000, starPlayers: ['Edimilson Fernandes (CDM)', 'Christian Fassnacht (RM)', 'Alvyn Sanches (CAM)', 'Marvin Keller (GK)', 'Gregory Wüthrich (CB)', 'Joël Almada Monteiro (LM)', 'Samuel Essende (ST)', 'Armin Gigović (CDM)', 'Chris Bedia (ST)', 'Rayan Raveloson (CM)', 'Darian Males (RM)'], description: 'Clasificado a la Europa League 2025-26. El más laureado de Suiza en la última década.', badgeColor: 'border-l-4 border-yellow-400 bg-black text-yellow-200', badgeLogoUrl: '💛⚫',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bsc-young-boys/bsc-young-boys-logo-footylogos.svg', division: 1 },
  { id: 'fc_basel', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'FC Basel 1893', league: 'Suiza', dt: 'Stephan Lichtsteiner', reputation: 3, initialSalary: 1250, marketValue: 6800000, starPlayers: ['Metinho', 'Flavius Daniliuc', 'Philip Otele', 'Kazeem Olaigbe', 'Andrej Bacanin'], description: 'Clasificado a la Europa League 2025-26. Histórico suizo, cuna de la Selección desde su cantera.', badgeColor: 'border-l-4 border-red-600 bg-blue-950 text-red-200', badgeLogoUrl: '🔴🔵',
    badgeImageUrl: 'badges/clubs/fc_basel.png', division: 1 },
  { id: 'ferencvaros', themeColor: { primary: '#16a34a', secondary: '#f5f0e8' }, name: 'Ferencvárosi TC', league: 'Húngara', dt: 'Balázs Borbély', reputation: 3, initialSalary: 1050, marketValue: 5200000, starPlayers: ['Dénes Dibusz (GK)', 'Mohammed Abu Fani (CM)', 'Cadu (LM)', 'Cebrail Makreckis (RB)', 'Naby Keïta (CM)', 'Kristoffer Zachariassen (CAM)', 'Stefan Gartenmann (CB)', 'Jonathan Levi (RW)', 'Ibrahim Cissé (CB)', 'Gavriel Kanichowsky (CM)', 'Bamidele Yusuf (LW)'], description: 'Clasificado a la Europa League 2025-26. El gigante de Budapest.', badgeColor: 'border-l-4 border-green-600 bg-white text-green-800', badgeLogoUrl: '💚⚪', badgeImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Ferencvarosi_TC.svg', division: 1 },
  { id: 'red_star_belgrade', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'FK Crvena Zvezda', league: 'Serbia', dt: 'Dejan Stanković', reputation: 4, initialSalary: 2800, marketValue: 18000000, starPlayers: ['Vasilije Kostov', 'Adem Avdic', 'Strahinja Erakovic', 'Nair Tiknizyan', 'Tomás Händel'], description: 'Clasificado a la Europa League 2025-26. La Estrella Roja de Belgrado.', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪',
    badgeImageUrl: 'badges/red_star_belgrade.png', division: 1 },
  { id: 'dinamo_zagreb', themeColor: { primary: '#2563eb', secondary: '#f5f0e8' }, name: 'GNK Dinamo Zagreb', league: 'Croata', dt: 'Mario Kovačević', reputation: 3, initialSalary: 21000, marketValue: 109200000, starPlayers: ['Dion Beljo', 'Sergi Domínguez', 'Luka Stojkovic', 'Scott McKenna', 'Niko Galesic'], description: 'Clasificado a la Europa League 2025-26. Dominador habitual del fútbol croata.', badgeColor: 'border-l-4 border-blue-600 bg-slate-900/40 text-blue-100', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gnk-dinamo-zagreb/gnk-dinamo-zagreb-logo-footylogos.svg', division: 1 },
  { id: 'ludogorets', themeColor: { primary: '#f97316', secondary: '#f5f0e8' }, name: 'PFC Ludogorets 1945', league: 'Búlgara', dt: 'Thomas Reis', reputation: 3, initialSalary: 1150, marketValue: 6000000, starPlayers: ['Nathan Fernandes', 'Petar Stanic', 'Erick Marcus', 'Caio Vidal', 'Rwan Cruz'], description: 'Clasificado a la Europa League 2025-26. Amo absoluto de la liga búlgara.', badgeColor: 'border-l-4 border-orange-500 bg-black text-orange-200', badgeLogoUrl: '🟠⚫',
    badgeImageUrl: 'badges/tm/ludogorets.png', division: 1 },
  { id: 'malmo_ff', themeColor: { primary: '#0ea5e9', secondary: '#f5f0e8' }, name: 'Malmö FF', league: 'Sueca', dt: 'Gaute Helstrup', reputation: 2, initialSalary: 820, marketValue: 3800000, starPlayers: ['Pontus Jansson (CB)', 'Busanello (LB)', 'Robin Olsen (GK)', 'Otto Rosengren (CM)', 'Sead Hakšabanović (LM)', 'Anders Christiansen (CAM)', 'Jens Stryger Larsen (RB)', 'Taha Ali (LM)', 'Johan Dahlin (GK)', 'Erik Botheim (ST)', 'Arnór Sigurðsson (LM)'], description: 'Clasificado a la Europa League 2025-26. El más grande de Suecia.', badgeColor: 'border-l-4 border-sky-500 bg-white text-sky-700', badgeLogoUrl: '🔵⚪',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/malmo-ff/malmo-ff-logo-footylogos.svg', division: 1 },
  { id: 'fcsb', themeColor: { primary: '#dc2626', secondary: '#f5f0e8' }, name: 'FCSB', league: 'Rumana', dt: 'Marius Baciu', reputation: 2, initialSalary: 720, marketValue: 3000000, starPlayers: ['Darius Olaru (CM)', 'Florin Tănase (CAM)', 'Daniel Bîrligea (ST)', 'Juri Cisotti (CM)', 'Ștefan Târnovanu (GK)', 'Siyabonga Ngezana (CB)', 'Risto Radunović (LB)', 'Joyskim Dawa (CB)', 'André Duarte (CB)', 'Mihai Lixandru (CDM)', 'David Miculescu (RW)'], description: 'Clasificado a la Europa League 2025-26. El histórico club de Bucarest.', badgeColor: 'border-l-4 border-red-600 bg-blue-950 text-red-200', badgeLogoUrl: '🔴🔵',
    badgeImageUrl: 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fcsb/fcsb-logo-footylogos.svg', division: 1 },
  { id: 'maccabi_tel_aviv', themeColor: { primary: '#facc15', secondary: '#f5f0e8' }, name: 'Maccabi Tel Aviv FC', league: 'Israelí', dt: 'Kenny Miller', reputation: 2, initialSalary: 850, marketValue: 4000000, starPlayers: ['Roy Revivo', 'Kristijan Belic', 'Tyrese Asante', 'Hélio Varela', 'Sayed Abu Farkhi'], description: 'Clasificado a la Europa League 2025-26. El más laureado de Israel en Europa.', badgeColor: 'border-l-4 border-yellow-400 bg-blue-900 text-yellow-200', badgeLogoUrl: '💛🔵',
    badgeImageUrl: 'badges/clubs/maccabi_tel_aviv.png', division: 1 },
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
    effect: { prestigeBonus: 8, fatigueReduction: 0 },
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
    effect: { fansBonus: 25, prestigeBonus: 6, attribute: 'ritmo', value: 1 },
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
    effect: { prestigeBonus: 12, permanentEnergyBonus: 15 },
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
    effect: { fansBonus: 30, prestigeBonus: 5 },
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
    icon: 'gamepad',
    image: gamingSponsorshipImg
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
    icon: 'video',
    image: streamingDealImg
  },
  {
    id: 'sports_drink',
    name: 'Patrocinio de Bebida Isotónica',
    cost: 40000,
    description: 'Tu cara en cada botella de la marca oficial de hidratación de la liga.',
    perkText: '+8 Prestigio, +10 Fans.',
    effect: { prestigeBonus: 4, fansBonus: 10 },
    category: 'bebidas',
    purchased: false,
    icon: 'droplet',
    image: sportsDrinkImg
  },
  {
    id: 'fashion_line',
    name: 'Línea de Ropa Urbana Propia',
    cost: 70000,
    description: 'Lanzás tu propia colección de streetwear con una marca reconocida de la industria.',
    perkText: '+35 Fans, +5 Prestigio.',
    effect: { fansBonus: 35, prestigeBonus: 2 },
    category: 'moda',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'shirt',
    image: fashionLineImg
  },
  {
    id: 'watch_brand',
    name: 'Embajador de Relojería Suiza',
    cost: 150000,
    description: 'Una casa relojera centenaria te suma a su lista reducida de embajadores globales.',
    perkText: '+30 Prestigio.',
    effect: { prestigeBonus: 15 },
    category: 'lujo',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'watch',
    image: watchBrandImg
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
    icon: 'coins',
    image: cryptoSponsorImg
  },
  {
    id: 'airline_deal',
    name: 'Milla Viajera Oficial',
    cost: 85000,
    description: 'Vuelos y estadías premium para ti y tu familia, cortesía de la aerolínea oficial del torneo.',
    perkText: '+10 Prestigio, +10 Energía por partido avanzado.',
    effect: { prestigeBonus: 5, permanentEnergyBonus: 10 },
    category: 'viajes',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'plane',
    image: airlineDealImg
  },
  {
    id: 'telecom_deal',
    name: 'Rostro de la Telefónica Nacional',
    cost: 65000,
    description: 'Tu cara en las vallas publicitarias y en la app de la compañía de telefonía más grande del país.',
    perkText: '+20 Fans, +8 Prestigio.',
    effect: { fansBonus: 20, prestigeBonus: 4 },
    category: 'telecomunicaciones',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'phone',
    image: telecomDealImg
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
    icon: 'utensils',
    image: fastfoodDealImg
  },
  {
    id: 'bank_deal',
    name: 'Imagen del Banco Patrocinador Oficial',
    cost: 110000,
    description: 'Tu tarjeta de crédito edición limitada con tu nombre grabado en el frente.',
    perkText: '+20 Prestigio, ganas de forma pasiva $2,000 cada vez que avanzas la semana.',
    effect: { prestigeBonus: 10, passiveIncome: 2000 },
    category: 'banca',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'landmark',
    image: bankDealImg
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
    icon: 'dice',
    image: bettingDealImg
  },
  {
    id: 'sneaker_deal',
    name: 'Firma con Marca de Calzado Deportivo',
    cost: 100000,
    description: 'Botines con tu inicial bordada y una línea de zapatillas urbanas con tu nombre.',
    perkText: '+15 Prestigio, +20 Fans.',
    effect: { prestigeBonus: 8, fansBonus: 20 },
    category: 'calzado',
    sensitiveToControversy: true,
    purchased: false,
    icon: 'footprints',
    image: sneakerDealImg
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
    icon: 'zap',
    image: energyDrinkDealImg
  }
];

export const PRESS_QUESTIONS_POOL: PressQuestion[] = [
  {
    id: "press_mau_debut",
    context: "Debut en Primera División",
    mediaName: "mausportstv (Live TikTok/Instagram)",
    reporter: "Mau",
    reporterAvatar: "🎙️⚽",
    reporterAvatarImg: mauSportsAvatar,
    mediaColor: "border-purple-500 text-purple-400 bg-purple-950/20",
    question: "¡Family, estamos EN VIVO para tu primerísima rueda de prensa como profesional! Todo el chat quiere saber: ¿qué se siente debutar en Primera División?",
    options: [
      {
        text: "Es un sueño cumplido, pero esto recién empieza. Con los pies bien puestos en la tierra.",
        prestigeChange: 2,
        fansChange: 6,
        energyChange: -2,
        reaction: "Mau (@mausportstv): 'Declaración madura para ser su primera rueda de prensa. El chat lo ama.'"
      },
      {
        text: "Vine a ser titular indiscutido desde el día uno, no a calentar banca de suplentes.",
        prestigeChange: 4,
        fansChange: -6,
        energyChange: 0,
        reaction: "Mau (@mausportstv): '¡Family, esto se puso picante! El debutante ya está pidiendo la titularidad.'"
      }
    ]
  },
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
        prestigeChange: 2,
        fansChange: 5,
        energyChange: -2,
        reaction: "Mau (@mausportstv): 'Declaración madura del juvenil. Mantiene los pies sobre la tierra.'"
      },
      {
        text: "Totalmente. El fútbol sudamericano ya me queda chico, aspiro a ganar la Champions League pronto.",
        prestigeChange: 4,
        fansChange: -10,
        energyChange: 0,
        reaction: "Mau (@mausportstv): '¡Boom! El jugador exige su salida inmediata a Europa.'"
      }
    ]
  },
  {
    id: "press_mau_viral",
    context: "Repercusión en Redes Sociales",
    mediaName: "mausportstv (Live TikTok/Instagram)",
    reporter: "Mau",
    reporterAvatar: "🎙️⚽",
    reporterAvatarImg: mauSportsAvatar,
    mediaColor: "border-purple-500 text-purple-400 bg-purple-950/20",
    question: "¡Family, tu última jugada se volvió tendencia! Más de 2 millones de vistas en TikTok y ya te hicieron hasta memes. ¿Ya los viste?",
    options: [
      {
        text: "Sí, me río muchísimo con los memes, se los mando a mis compañeros del plantel.",
        prestigeChange: 2,
        fansChange: 10,
        energyChange: -1,
        reaction: "Mau (@mausportstv): 'Se lo toma con humor, el chat explota de comentarios positivos.'"
      },
      {
        text: "No tengo tiempo para andar viendo redes, estoy enfocado en el próximo rival.",
        prestigeChange: 3,
        fansChange: -3,
        energyChange: 0,
        reaction: "Mau (@mausportstv): 'Respuesta seria de profesional. Algunos en el chat dicen que es medio soberbio.'"
      }
    ]
  },
  {
    id: "press_mau_rumor",
    context: "Filtración en Vivo",
    mediaName: "mausportstv (Live TikTok/Instagram)",
    reporter: "Mau",
    reporterAvatar: "🎙️⚽",
    reporterAvatarImg: mauSportsAvatar,
    mediaColor: "border-purple-500 text-purple-400 bg-purple-950/20",
    question: "Nos llegó un dato calentito al chat en vivo: dicen que ya firmaste en secreto con otro club. ¿Confirmas o desmientes ahora mismo, family?",
    options: [
      {
        text: "Total invento. Sigo 100% enfocado acá, cuando haya algo real lo van a saber de primera mano.",
        prestigeChange: 2,
        fansChange: 8,
        energyChange: -2,
        reaction: "Mau (@mausportstv): 'Desmentido en vivo. El chat respira tranquilo, por ahora.'"
      },
      {
        text: "No puedo confirmar ni desmentir nada, eso lo maneja mi representante.",
        prestigeChange: -2,
        fansChange: -4,
        energyChange: 0,
        reaction: "Mau (@mausportstv): '¡Family, no lo desmintió! El rumor se dispara en los trending topics.'"
      }
    ]
  },
  {
    id: "q2",
    context: "Exclusiva de Fichajes de Última Hora",
    mediaName: "Here We Go! - Digital Network",
    reporter: "Fabrizio Romano",
    reporterAvatar: "📱🔥",
    reporterAvatarImg: fabrizioRomanoAvatar,
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
    reporterAvatarImg: espnLogo,
    mediaColor: "border-red-600 text-red-400 bg-red-950/20",
    question: "El mánager del equipo rival declaró que tu rendimiento en los últimos minutos se cae por falta de preparación física. ¿Qué le respondes?",
    options: [
      {
        text: "Las respuestas se dan trabajando en la semana y jugando los 90 minutos el fin de semana.",
        prestigeChange: 2,
        fansChange: 6,
        energyChange: -4,
        reaction: "ESPN: '¡Jerarquía pura! El juvenil contesta con altura a la mesa de debate.'"
      },
      {
        text: "Debería preocuparse por su propio equipo, que viene peleando el descenso en la tabla.",
        prestigeChange: 1,
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
        prestigeChange: 2,
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
        prestigeChange: 5,
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
        prestigeChange: 4,
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
        prestigeChange: 2,
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
        prestigeChange: 4,
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
    reporterAvatarImg: caracolLogo,
    mediaColor: "border-yellow-500 text-yellow-300 bg-yellow-950/20",
    question: "Se filtró un audio de tu representante negociando con un club rival de tu propia liga a tus espaldas. ¿Qué tienes para decir?",
    options: [
      {
        text: "Mi representante escucha ofertas, es su trabajo. Yo sigo comprometido con este club hasta que decida lo contrario.",
        prestigeChange: 2,
        fansChange: -8,
        energyChange: -3,
        reaction: "Radio Caracol: 'Respuesta diplomática, pero la hinchada quedó con la duda sembrada.'"
      },
      {
        text: "Eso no tiene ni pies ni cabeza. Voy a hablar con mi agente para que aclare el tema hoy mismo.",
        prestigeChange: 3,
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
    reporterAvatarImg: rcnLogo,
    mediaColor: "border-rose-500 text-rose-300 bg-rose-950/20",
    question: "El arquero del equipo tuvo una actuación desastrosa hoy y varios errores no forzados. ¿Le tienes confianza de cara al resto del semestre?",
    options: [
      {
        text: "Un arquero también tiene partidos malos, como cualquiera de nosotros. Vamos a levantarlo entre todos.",
        prestigeChange: 6,
        fansChange: 4,
        energyChange: 0,
        reaction: "RCN: 'Gesto de liderazgo y compañerismo que el vestuario agradece puertas adentro.'"
      },
      {
        text: "No me corresponde evaluar a mis compañeros, esa pregunta es para el cuerpo técnico.",
        prestigeChange: 1,
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
        prestigeChange: 4,
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
  },
  {
    id: "press_9",
    context: "Exclusiva de Fichajes",
    mediaName: "ESPN F90",
    reporter: "Gastón Edul",
    reporterAvatar: "🎙️🇦🇷",
    reporterAvatarImg: gastonEdulAvatar,
    mediaColor: "border-cyan-500 text-cyan-300 bg-cyan-950/20",
    question: "Puedo confirmar en exclusiva: hay un club grande que ya preguntó por tu situación contractual. ¿Te gustaría dar el salto si la oferta llega a estar sobre la mesa?",
    options: [
      {
        text: "Cualquier jugador sueña con dar el salto, pero hoy mi cabeza está acá y en nada más.",
        prestigeChange: 2,
        fansChange: 4,
        energyChange: -1,
        reaction: "Gastón Edul: 'Información confirmada por el propio jugador, aunque con mucha cautela.'"
      },
      {
        text: "Si la oferta es la indicada, no le voy a cerrar la puerta a nada. Así es este negocio.",
        prestigeChange: 1,
        fansChange: -8,
        energyChange: 0,
        reaction: "Gastón Edul: 'ÚLTIMA HORA: el jugador deja la puerta abierta a una salida. Se arma revuelo.'"
      }
    ]
  },
  {
    id: "press_10",
    context: "Tertulia En Vivo",
    mediaName: "El Chiringuito TV",
    reporter: "Edu Aguirre",
    reporterAvatar: "📢🇪🇸",
    reporterAvatarImg: eduAguirreAvatar,
    mediaColor: "border-fuchsia-500 text-fuchsia-300 bg-fuchsia-950/20",
    question: "¡PEROOO ESTO ES UN ESCÁNDALO! Un excompañero tuyo dijo en esta misma mesa que tienes más fama que rendimiento real. ¿Qué le respondes EN DIRECTO?",
    options: [
      {
        text: "Respeto su opinión, pero prefiero responder jugando los noventa minutos, no en un plató.",
        prestigeChange: 4,
        fansChange: 5,
        energyChange: -2,
        reaction: "Edu Aguirre: '¡ESO ES CLASE! Respuesta elegante que deja mudo al panel entero.'"
      },
      {
        text: "Que hable de fama el que nunca fue titular en su vida. Que se dedique a comentar y ya.",
        prestigeChange: -8,
        fansChange: 18,
        energyChange: -3,
        reaction: "Edu Aguirre: '¡¡ESTO ES INCENDIARIO!! Se lía una tremenda en pleno directo, todos gritando a la vez.'"
      }
    ]
  },
  {
    id: "press_11",
    context: "Sección de Humor Deportivo",
    mediaName: "ESPN Colombia",
    reporter: "Pipe Sierra",
    reporterAvatar: "😂🇨🇴",
    reporterAvatarImg: pipeSierraAvatar,
    mediaColor: "border-lime-500 text-lime-300 bg-lime-950/20",
    question: "Parcero, en serio, ¿cuál es la verdadera historia detrás de esa celebración tan rara que sacaste el fin de semana? Todo el país la está imitando.",
    options: [
      {
        text: "Jajaja se la copié a mi sobrino, no tiene ningún misterio. Ya es tradición de familia.",
        prestigeChange: 1,
        fansChange: 14,
        energyChange: -1,
        reaction: "Pipe Sierra: 'Momento viral asegurado. La entrevista se vuelve tendencia por lo carismática.'"
      },
      {
        text: "Es un mensaje personal, prefiero guardármelo y que cada uno lo interprete como quiera.",
        prestigeChange: 2,
        fansChange: 2,
        energyChange: 0,
        reaction: "Pipe Sierra: 'Se guarda el misterio. El país sigue especulando sin respuesta clara.'"
      }
    ]
  },
  {
    id: "press_12",
    context: "Relato de la Fecha",
    mediaName: "Win Sports+",
    reporter: "José Hugo Illera",
    reporterAvatar: "🎤🇨🇴",
    reporterAvatarImg: joseHugoIlleraAvatar,
    mediaColor: "border-indigo-500 text-indigo-300 bg-indigo-950/20",
    question: "¡Esa jugada la vamos a estar contando por años! Cuéntenos con sus propias palabras qué pasó por su cabeza en el instante exacto de la definición.",
    options: [
      {
        text: "Se apagó todo el estadio en mi cabeza, solo vi el arco y confié en lo que entrené toda la semana.",
        prestigeChange: 5,
        fansChange: 12,
        energyChange: -2,
        reaction: "José Hugo Illera: '¡QUÉ RELATO, SEÑORAS Y SEÑORES! Pura emoción en la narración del maestro.'"
      },
      {
        text: "La verdad no lo pensé, salió solo. El cuerpo ya sabe qué hacer en esos momentos.",
        prestigeChange: 3,
        fansChange: 6,
        energyChange: 0,
        reaction: "José Hugo Illera: 'Respuesta instintiva de crack. El maestro asiente con una sonrisa cómplice.'"
      }
    ]
  },
  {
    id: "press_13",
    context: "Bomba de Mercado",
    mediaName: "Here We Go! - Digital Network",
    reporter: "Fabrizio Romano",
    reporterAvatar: "📱🔥",
    reporterAvatarImg: fabrizioRomanoAvatar,
    mediaColor: "border-sky-500 text-sky-400 bg-sky-950/20",
    question: "Excl: fuentes cercanas al club aseguran que ya existe un preacuerdo con un gigante europeo para tu fichaje el próximo mercado. ¿Confirmas o desmientes la información en vivo?",
    options: [
      {
        text: "Desmiento totalmente. No hay ningún acuerdo, estoy 100% enfocado en este club.",
        prestigeChange: 5,
        fansChange: 8,
        energyChange: -2,
        reaction: "Fabrizio Romano: 'Desmentido categórico. En las oficinas del club respiran tranquilos: el DT confirma que cuenta contigo para lo que viene.'"
      },
      {
        text: "Prefiero no hablar de mercado ahora mismo, eso lo maneja mi representante.",
        prestigeChange: -8,
        fansChange: -10,
        energyChange: -3,
        reaction: "Fabrizio Romano: '¡No lo desmintió! El silencio dispara todas las alarmas. En el vestuario ya se habla de una posible salida y la interna del club se tensa.'"
      },
      {
        text: "La verdad es que sí, me gustaría dar el salto. Es momento de pedir la salida.",
        prestigeChange: -18,
        fansChange: -25,
        energyChange: -5,
        reaction: "Fabrizio Romano: '¡BOMBAZO EN VIVO! El jugador confirma que pidió la salida. Caos total: la hinchada se siente traicionada y el vestuario queda partido en dos.'"
      }
    ]
  },
  {
    id: "press_14",
    context: "Rumor de Pasillo",
    mediaName: "Radio Caracol Deportes",
    reporter: "Corresponsal de Pases",
    reporterAvatar: "📻💰",
    reporterAvatarImg: caracolLogo,
    mediaColor: "border-yellow-500 text-yellow-300 bg-yellow-950/20",
    question: "Nos llega información de que tu entorno ya se reunió con dirigentes de otro club sin avisarle a la directiva actual. ¿Qué tiene para decirnos al respecto?",
    options: [
      {
        text: "Eso es totalmente falso, ni mi representante ni yo nos reunimos con nadie. Sigo comprometido acá.",
        prestigeChange: 4,
        fansChange: 7,
        energyChange: -2,
        reaction: "Radio Caracol: 'Desmentido firme y sin titubeos. La directiva respira tranquila y el DT lo respalda públicamente.'"
      },
      {
        text: "No tengo comentarios sobre ese tema puntual en este momento.",
        prestigeChange: -7,
        fansChange: -9,
        energyChange: -2,
        reaction: "Radio Caracol: 'La evasiva no le gustó a nadie. La hinchada empieza a sospechar y en el club se respira desconfianza.'"
      },
      {
        text: "Sí hubo un acercamiento. Con la directiva actual las cosas no van bien y ya pedí salir.",
        prestigeChange: -16,
        fansChange: -22,
        energyChange: -5,
        reaction: "Radio Caracol: '¡ESCÁNDALO CONFIRMADO! El jugador reconoce el pedido de salida en plena temporada. El vestuario entra en modo crisis total.'"
      }
    ]
  },
  {
    id: "press_15",
    context: "Cara a Cara",
    mediaName: "El Vbar - ESPN Colombia",
    reporter: "Carlos Antonio Vélez",
    reporterAvatar: "🗯️🇨🇴",
    reporterAvatarImg: carlosAntonioVelezAvatar,
    mediaColor: "border-neutral-500 text-neutral-300 bg-neutral-950/20",
    question: "Yo sigo sin entender cómo con esas decisiones que tomas en cancha te siguen poniendo de titular. ¿Tú de verdad crees que te lo mereces, o el técnico te está regalando minutos?",
    options: [
      {
        text: "Entiendo su opinión, pero los números y el técnico avalan mi lugar en el equipo. Con respeto, no la comparto.",
        prestigeChange: 4,
        fansChange: 6,
        energyChange: -2,
        reaction: "Carlos Antonio Vélez: 'Al menos respondió con carácter, aunque a mí sinceramente no me convenció ni un poco. Mi opinión no cambia.'"
      },
      {
        text: "Con todo respeto, usted opina de fútbol pero nunca jugó a este nivel. Es fácil hablar desde el estudio.",
        prestigeChange: -10,
        fansChange: 18,
        energyChange: -3,
        reaction: "Carlos Antonio Vélez: '¡SE ARMÓ! El jugador le contesta en vivo. Todo el país hablando del cruce, y en el club no les hizo ninguna gracia.'"
      }
    ]
  },
  {
    id: "press_16",
    context: "Pasión de Relator",
    mediaName: "Relatos del Estadio",
    reporter: "Eduardo Luis",
    reporterAvatar: "🎙️📢",
    reporterAvatarImg: eduardoLuisAvatar,
    mediaColor: "border-teal-500 text-teal-300 bg-teal-950/20",
    question: "¡Qué partido, qué entrega, qué corazón! Cuénteme, ¿qué significa para usted vestir esta camiseta y sentir así a la gente detrás suyo?",
    options: [
      {
        text: "Significa todo. Cada gota de sudor es por esta gente, no los voy a defraudar jamás.",
        prestigeChange: 3,
        fansChange: 16,
        energyChange: -2,
        reaction: "Eduardo Luis: '¡ESO ES AMOR POR LA CAMISETA, SEÑORAS Y SEÑORES! La hinchada se emociona con la respuesta.'"
      },
      {
        text: "Es un trabajo como cualquier otro, trato de ser profesional y listo.",
        prestigeChange: 2,
        fansChange: -8,
        energyChange: 0,
        reaction: "Eduardo Luis: 'Respuesta fría que no cayó del todo bien entre los más sentimentales de la tribuna.'"
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
        effects: { prestige: 10, fans: -5, energy: -30, capital: -3000 }
      },
      {
        text: 'Dormir temprano y enfocarte en el partido',
        cost: 0,
        outcome: 'El técnico te alaba por tu profesionalismo absoluto.',
        effects: { prestige: 2, fans: 5, energy: 20, capital: 0 }
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
        effects: { prestige: 5, fans: 30, energy: -15, capital: -1000 }
      },
      {
        text: 'Enviar un video de saludo amigable desde tu casa',
        cost: 0,
        outcome: 'Cumples de forma cordial sin cansarte físicamente.',
        effects: { prestige: 2, fans: 10, energy: 5, capital: 0 }
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
        effects: { prestige: 5, fans: -5, energy: 0, capital: 0 }
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
        effects: { prestige: 8, fans: 0, energy: -5, capital: 0 }
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
        effects: { prestige: 2, fans: -2, energy: 10, capital: 0 }
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
        effects: { prestige: 2, fans: 40, energy: -25, capital: 0 }
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
        effects: { prestige: 4, fans: 0, energy: 10, capital: 0 }
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
        effects: { prestige: 6, fans: -3, energy: -40, capital: -2500 }
      },
      {
        text: 'Pasar a saludar, tomar una copa y retirarte temprano',
        cost: 500,
        outcome: 'Cumples socialmente sin comprometer tu rendimiento de la semana.',
        effects: { prestige: 2, fans: 2, energy: -10, capital: -500 }
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
        effects: { prestige: 3, fans: 0, energy: -5, capital: -3600 }
      },
      {
        text: 'Quedarte con los audífonos puestos viendo videos tácticos',
        cost: 0,
        outcome: 'Llegas descansado y con la cabeza fría al hotel de concentración.',
        effects: { prestige: 2, fans: 0, energy: 5, capital: 0 }
      }
    ]
  },
  // FASE 3 -- VESTUARIO Y HINCHADA
  {
    title: 'Reclamo del DT por Individualismo',
    description: 'En la charla técnica post-entrenamiento, el DT te para en seco frente a todo el plantel: "Acá se juega para el equipo, no para las estadísticas personales."',
    choices: [
      {
        text: 'Responder que tú juegas para ganar, no para quedar bien con nadie',
        cost: 0,
        outcome: 'El vestuario se divide: unos te bancan, otros creen que te faltó el respeto al técnico.',
        effects: { prestige: -12, fans: 8, energy: -5, capital: 0 }
      },
      {
        text: 'Asentir y comprometerte a jugar más colectivo de acá en adelante',
        cost: 0,
        outcome: 'El DT valora el gesto. Tu relación con el cuerpo técnico mejora notablemente.',
        effects: { prestige: 5, fans: -2, energy: 0, capital: 0 }
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
        effects: { prestige: 2, fans: 18, energy: -15, capital: 0 }
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
        text: 'Tomarlo, necesitas ese plus de rendimiento',
        cost: 0,
        outcome: 'Salió positivo en el control antidopaje post-partido. La federación no tiene piedad: sanción ejemplar y multa.',
        effects: { prestige: -35, fans: -20, energy: 10, capital: -25000, suspension: 4 }
      },
      {
        text: 'Rechazarlo, no vale la pena el riesgo',
        cost: 0,
        outcome: 'Tu preparador físico oficial te felicita por la decisión responsable.',
        effects: { prestige: 3, fans: 0, energy: 0, capital: 0 }
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
        effects: { prestige: 2, fans: 0, energy: -10, capital: 0 }
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
        effects: { prestige: 4, fans: 2, energy: 0, capital: 0 }
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
        effects: { prestige: 5, fans: -2, energy: 0, capital: 0 }
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
  },
  // FASE 4 -- CASINO Y FAMILIA
  {
    title: 'Noche de Casino',
    description: 'Un compañero te invita al casino del hotel donde se hospeda el plantel en la gira internacional. "Solo unas fichas, para relajar antes del partidazo de mañana."',
    choices: [
      {
        text: 'Entrar a la mesa de póker con plata en serio ($6,000 COP/USD)',
        cost: 6000,
        outcome: 'Se te fue la mano en la mesa y perdiste mucho más de lo planeado. Un fotógrafo del lugar filtró la foto y el escándalo llegó a la prensa deportiva.',
        effects: { prestige: -22, fans: -15, energy: -20, capital: -9500 }
      },
      {
        text: 'Jugar solo un par de manos por diversión, sin apostar fuerte',
        cost: 500,
        outcome: 'Te divertiste un rato sin exponerte. Nadie hace drama al respecto.',
        effects: { prestige: 0, fans: 0, energy: -5, capital: -500 }
      },
      {
        text: 'Rechazar la invitación y volver a la habitación a descansar',
        cost: 0,
        outcome: 'El cuerpo técnico se entera de tu decisión y te destaca como ejemplo de profesionalismo ante el plantel.',
        effects: { prestige: 4, fans: 0, energy: 10, capital: 0 }
      }
    ]
  },
  {
    title: 'Problemas en Casa',
    description: 'Tu familia te llama en medio de la semana: hay una discusión fuerte entre tus padres y te piden que vuelvas a mediar, justo en plena preparación del partido.',
    choices: [
      {
        text: 'Pedir permiso al club y viajar a estar con ellos',
        cost: 0,
        outcome: 'El DT entiende la situación personal y te da el permiso, pero llegás al partido con la cabeza dividida.',
        effects: { prestige: 2, fans: 5, energy: -25, capital: 0 }
      },
      {
        text: 'Quedarte concentrado en el equipo y llamarlos por teléfono',
        cost: 0,
        outcome: 'Resolvés lo que podés a la distancia. Rendís bien en el entrenamiento, pero te queda la espina de no haber estado presente.',
        effects: { prestige: 2, fans: 0, energy: -10, capital: 0 }
      }
    ]
  },
  {
    title: 'Fecha Especial en Familia',
    description: 'Es el cumpleaños de uno de tus padres y toda la familia organizó una reunión sorpresa, coincidiendo con tu único día libre de la semana.',
    choices: [
      {
        text: 'Ir a la fiesta y disfrutar el día completo con ellos',
        cost: 800,
        outcome: 'Un día hermoso en familia te recarga las pilas de una forma que ningún entrenamiento podría.',
        effects: { prestige: 1, fans: 3, energy: 25, capital: -800 }
      },
      {
        text: 'Pasar solo un par de horas y volver temprano a descansar para el partido',
        cost: 200,
        outcome: 'Cumplís con la familia sin descuidar la preparación física de la semana.',
        effects: { prestige: 2, fans: 1, energy: 10, capital: -200 }
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

// Escudos reales encontrados para clubes generados dinámicamente desde el JSON de
// jugadores (ver GENERACIÓN DINÁMICA abajo) -- clave = el mismo id `gen_${index}` que se les
// asigna ahí, así que depende del orden de uniqueJsonTeams (estable mientras no cambie
// playersDatabase.json).
const GENERATED_CLUB_CRESTS: Record<string, string> = {
  'gen_3': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/apoel-nicosia/apoel-nicosia-logo-footylogos.svg',
  'gen_29': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Estudiantes_de_la_Plata_crest_%282025%29_cropped.svg/250px-Estudiantes_de_la_Plata_crest_%282025%29_cropped.svg.png',
  'gen_39': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Independiente_Santa_Fe_logo.svg/250px-Independiente_Santa_Fe_logo.svg.png',
  'gen_40': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/millonarios/millonarios-logo-footylogos.svg',
  'gen_46': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atlas/atlas-logo-footylogos.svg',
  'gen_49': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/san-lorenzo/san-lorenzo-logo-footylogos.svg',
  'gen_71': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Flag_of_Serbia.svg/250px-Flag_of_Serbia.svg.png',
  'gen_86': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Escudo_del_Club_Atl%C3%A9tico_Newell%27s_Old_Boys_de_Rosario.svg/250px-Escudo_del_Club_Atl%C3%A9tico_Newell%27s_Old_Boys_de_Rosario.svg.png',
  'gen_105': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/VfB_Stuttgart_1893_Logo.svg/250px-VfB_Stuttgart_1893_Logo.svg.png',
  'gen_115': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/uta-arad/uta-arad-logo-footylogos.svg',
  'gen_135': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Escudo_Wilstermann.png/250px-Escudo_Wilstermann.png',
  'gen_137': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Escudo_del_Montevideo_Wanderers_Futbol_Club.png/250px-Escudo_del_Montevideo_Wanderers_Futbol_Club.png',
  'gen_161': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/belgrano/belgrano-logo-footylogos.svg',
  'gen_171': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ceara-sc/ceara-sc-logo-footylogos.svg',
  'gen_177': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/lechia-gdansk/lechia-gdansk-logo-footylogos.svg',
  'gen_180': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Logotipo_de_la_Federaci%C3%B3n_Peruana_de_F%C3%BAtbol.svg/250px-Logotipo_de_la_Federaci%C3%B3n_Peruana_de_F%C3%BAtbol.svg.png',
  'gen_181': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/250px-Flag_of_Colombia.svg.png',
  'gen_187': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Egyptian_Premier_League_logo_2023.png/250px-Egyptian_Premier_League_logo_2023.png',
  'gen_198': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Escudo-Liverpool.png/250px-Escudo-Liverpool.png',
  'gen_205': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fbc-melgar/fbc-melgar-logo-footylogos.svg',
  'gen_220': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Emblema_del_Club_Universidad_de_Chile.png/250px-Emblema_del_Club_Universidad_de_Chile.png',
  'gen_222': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Flag_of_Ecuador.svg/250px-Flag_of_Ecuador.svg.png',
  'gen_233': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_El_Salvador.svg/250px-Flag_of_El_Salvador.svg.png',
  'gen_246': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Escudo_del_Club_Tijuana.png/250px-Escudo_del_Club_Tijuana.png',
  'gen_274': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Escudo_oficial_do_Am%C3%A9rica_Futebol_Clube.svg/250px-Escudo_oficial_do_Am%C3%A9rica_Futebol_Clube.svg.png',
  'gen_281': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/rangers/rangers-logo-footylogos.svg',
  'gen_291': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Club_Atl%C3%A9tico_River_Plate_logo.svg/250px-Club_Atl%C3%A9tico_River_Plate_logo.svg.png',
  'gen_313': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/envigado/envigado-logo-footylogos.svg',
  'gen_328': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/250px-Escudo_de_Racing_Club_%282014%29.svg.png',
  'gen_334': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/talleres/talleres-logo-footylogos.svg',
  'gen_339': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Escudo_Deportes_Magallanes.png/250px-Escudo_Deportes_Magallanes.png',
  'gen_365': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bucaramanga/bucaramanga-logo-footylogos.svg',
  'gen_366': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/los-angeles-fc/los-angeles-fc-logo-footylogos.svg',
  'gen_390': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/GAK_1902_Logo_Rund.svg/250px-GAK_1902_Logo_Rund.svg.png',
  'gen_392': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rodillo_Rojo_TU.svg/250px-Rodillo_Rojo_TU.svg.png',
  'gen_404': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/rakow-czestochowa/rakow-czestochowa-logo-footylogos.svg',
  'gen_405': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cfr-cluj/cfr-cluj-logo-footylogos.svg',
  'gen_415': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Escudo_Club_Deportivo_Universidad_Cat%C3%B3lica.svg/250px-Escudo_Club_Deportivo_Universidad_Cat%C3%B3lica.svg.png',
  'gen_430': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/9_de_Octubre_FC_escudo.png/250px-9_de_Octubre_FC_escudo.png',
  'gen_441': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Club_Sportivo_Trinidense.svg/250px-Club_Sportivo_Trinidense.svg.png',
  'gen_474': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Escudo_GV_Club_Deportivo_San_Jos%C3%A9_PNG.png/250px-Escudo_GV_Club_Deportivo_San_Jos%C3%A9_PNG.png',
  'gen_479': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Premier_League.svg/250px-Premier_League.svg.png',
  'gen_541': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Emblema_del_Club_Universidad_de_Chile.png/250px-Emblema_del_Club_Universidad_de_Chile.png',
  'gen_560': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Estudiantes_de_la_Plata_crest_%282025%29_cropped.svg/250px-Estudiantes_de_la_Plata_crest_%282025%29_cropped.svg.png',
  'gen_563': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Escudo_GEBA.png',
  'gen_602': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/botafogo-sp/botafogo-sp-logo-footylogos.svg',
  'gen_606': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Mirassol_FC_logo.png/250px-Mirassol_FC_logo.png',
  'gen_613': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Escudo_Deportes_Concepci%C3%B3n.svg/250px-Escudo_Deportes_Concepci%C3%B3n.svg.png',
  'gen_615': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Santa_Cruz_Futebol_Clube_logo.svg/250px-Santa_Cruz_Futebol_Clube_logo.svg.png',
  'gen_651': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Escudo_Alianza_Lima.svg/250px-Escudo_Alianza_Lima.svg.png',
  'gen_656': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/CACerro_logo.png/250px-CACerro_logo.png',
  'gen_658': 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Escudo_Club_Atl%C3%A9tico_Progreso.png',
  'gen_661': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Escudo_Central_Espa%C3%B1ol_FC.png/250px-Escudo_Central_Espa%C3%B1ol_FC.png',
  'gen_678': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Escudo_del_Club_Sport_Herediano.svg/250px-Escudo_del_Club_Sport_Herediano.svg.png',
  'gen_679': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Independiente_Santa_Fe_logo.svg/250px-Independiente_Santa_Fe_logo.svg.png',
  'gen_681': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Escudo_del_Real_Estel%C3%AD.png/250px-Escudo_del_Real_Estel%C3%AD.png',
  'gen_685': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Wydad_Athletic_Club_logo.svg/250px-Wydad_Athletic_Club_logo.svg.png',
  'gen_717': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/grenoble-foot-38/grenoble-foot-38-logo-footylogos.svg',
  'gen_719': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sheffield-wednesday/sheffield-wednesday-logo-footylogos.svg',
  'gen_754': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/osters-if/osters-if-logo-footylogos.svg',
  'gen_764': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/panathinaikos/panathinaikos-logo-footylogos.svg',
  'gen_805': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/WrexhamACFbadgeonshirt.jpg/250px-WrexhamACFbadgeonshirt.jpg',
  'gen_825': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/SK_Sturm_Graz.svg/250px-SK_Sturm_Graz.svg.png',
  'gen_827': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Logo_GNK_Dinamo_Zagreb_%282019%29.svg/250px-Logo_GNK_Dinamo_Zagreb_%282019%29.svg.png',
  'gen_836': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Emblema_Benfica_1930_%28Sem_fundo%29.png/250px-Emblema_Benfica_1930_%28Sem_fundo%29.png',
  'gen_877': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/grasshopper-club-zurich/grasshopper-club-zurich-logo-footylogos.svg',
  'gen_878': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/servette-fc/servette-fc-logo-footylogos.svg',
  'gen_879': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/galatasaray/galatasaray-logo-footylogos.svg',
  'gen_881': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/besiktas/besiktas-logo-footylogos.svg',
  'gen_882': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/TSV_1860_M%C3%BCnchen.svg/250px-TSV_1860_M%C3%BCnchen.svg.png',
  'gen_951': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Logo_EA_Guingamp_2019.svg/250px-Logo_EA_Guingamp_2019.svg.png',
  'gen_955': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-volendam/fc-volendam-logo-footylogos.svg',
  'gen_966': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/NYRB_wordmark_2line_color_ltbg.svg/250px-NYRB_wordmark_2line_color_ltbg.svg.png',
  'gen_969': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/chicago-fire/chicago-fire-logo-footylogos.svg',
  'gen_973': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Los_Angeles_Galaxy_logo.svg/250px-Los_Angeles_Galaxy_logo.svg.png',
  'gen_1008': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-zurich/fc-zurich-logo-footylogos.svg',
  'gen_1018': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/V%C3%A5lerenga_Oslo_logo.svg/250px-V%C3%A5lerenga_Oslo_logo.svg.png',
  'gen_2': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/oh-leuven/oh-leuven-logo-footylogos.svg',
  'gen_7': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-lugano/fc-lugano-logo-footylogos.svg',
  'gen_8': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/hjk-helsinki/hjk-helsinki-logo-footylogos.svg',
  'gen_12': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/telstar/telstar-logo-footylogos.svg',
  'gen_17': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/st-mirren/st-mirren-logo-footylogos.svg',
  'gen_21': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/kayserispor/kayserispor-logo-footylogos.svg',
  'gen_25': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/konyaspor/konyaspor-logo-footylogos.svg',
  'gen_26': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/caykur-rizespor/caykur-rizespor-logo-footylogos.svg',
  'gen_27': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/dynamo-kyiv/dynamo-kyiv-logo-footylogos.svg',
  'gen_28': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/shakhtar-donetsk/shakhtar-donetsk-logo-footylogos.svg',
  'gen_62': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/west-bromwich-albion/west-bromwich-albion-logo-footylogos.svg',
  'gen_67': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/otelul-galati/otelul-galati-logo-footylogos.svg',
  'gen_68': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/farul-constanta/farul-constanta-logo-footylogos.svg',
  'gen_69': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/petrolul-ploiesti/petrolul-ploiesti-logo-footylogos.svg',
  'gen_77': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ssv-ulm-1846/ssv-ulm-1846-logo-footylogos.svg',
  'gen_78': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gks-katowice/gks-katowice-logo-footylogos.svg',
  'gen_79': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/accrington-stanley/accrington-stanley-logo-footylogos.svg',
  'gen_80': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/pau-fc/pau-fc-logo-footylogos.svg',
  'gen_91': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/viktoria-plzen/viktoria-plzen-logo-footylogos.svg',
  'gen_93': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sc-verl/sc-verl-logo-footylogos.svg',
  'gen_102': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/viktoria-koln/viktoria-koln-logo-footylogos.svg',
  'gen_108': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/kv-mechelen/kv-mechelen-logo-footylogos.svg',
  'gen_112': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/pogon-szczecin/pogon-szczecin-logo-footylogos.svg',
  'gen_116': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/universitatea-cluj/universitatea-cluj-logo-footylogos.svg',
  'gen_117': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/botosani/botosani-logo-footylogos.svg',
  'gen_118': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-sion/fc-sion-logo-footylogos.svg',
  'gen_119': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gaziantep-fk/gaziantep-fk-logo-footylogos.svg',
  'gen_121': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/real-oviedo/real-oviedo-logo-footylogos.svg',
  'gen_124': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/crawley-town/crawley-town-logo-footylogos.svg',
  'gen_126': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/padova/padova-logo-footylogos.svg',
  'gen_130': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/shanghai-shenhua/shanghai-shenhua-logo-footylogos.svg',
  'gen_144': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cs-emelec/cs-emelec-logo-footylogos.svg',
  'gen_174': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/korona-kielce/korona-kielce-logo-footylogos.svg',
  'gen_175': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/piast-gliwice/piast-gliwice-logo-footylogos.svg',
  'gen_176': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/radomiak-radom/radomiak-radom-logo-footylogos.svg',
  'gen_178': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/motor-lublin/motor-lublin-logo-footylogos.svg',
  'gen_188': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/minnesota-united/minnesota-united-logo-footylogos.svg',
  'gen_195': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/red-star-fc/red-star-fc-logo-footylogos.svg',
  'gen_196': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/usl-dunkerque/usl-dunkerque-logo-footylogos.svg',
  'gen_207': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/adelaide-united/adelaide-united-logo-footylogos.svg',
  'gen_208': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/brisbane-roar/brisbane-roar-logo-footylogos.svg',
  'gen_209': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/central-coast-mariners/central-coast-mariners-logo-footylogos.svg',
  'gen_210': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/melbourne-victory/melbourne-victory-logo-footylogos.svg',
  'gen_211': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/newcastle-jets/newcastle-jets-logo-footylogos.svg',
  'gen_212': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/perth-glory/perth-glory-logo-footylogos.svg',
  'gen_213': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sydney-fc/sydney-fc-logo-footylogos.svg',
  'gen_237': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gais/gais-logo-footylogos.svg',
  'gen_239': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/east-bengal-fc/east-bengal-fc-logo-footylogos.svg',
  'gen_240': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/mohammedan-sc/mohammedan-sc-logo-footylogos.svg',
  'gen_245': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-shabab/al-shabab-logo-footylogos.svg',
  'gen_247': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-ain/al-ain-logo-footylogos.svg',
  'gen_248': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/if-brommapojkarna/if-brommapojkarna-logo-footylogos.svg',
  'gen_257': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/union/union-logo-footylogos.svg',
  'gen_262': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/shandong-taishan/shandong-taishan-logo-footylogos.svg',
  'gen_263': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/wellington-phoenix/wellington-phoenix-logo-footylogos.svg',
  'gen_264': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/beijing-guoan/beijing-guoan-logo-footylogos.svg',
  'gen_265': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/changchun-yatai/changchun-yatai-logo-footylogos.svg',
  'gen_266': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/tianjin-jinmen-tiger/tianjin-jinmen-tiger-logo-footylogos.svg',
  'gen_267': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/henan-fc/henan-fc-logo-footylogos.svg',
  'gen_269': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/paris-fc/paris-fc-logo-footylogos.svg',
  'gen_270': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/wolfsberger-ac/wolfsberger-ac-logo-footylogos.svg',
  'gen_271': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/san-jose-earthquakes/san-jose-earthquakes-logo-footylogos.svg',
  'gen_279': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/mjallby-aif/mjallby-aif-logo-footylogos.svg',
  'gen_280': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-ettifaq/al-ettifaq-logo-footylogos.svg',
  'gen_282': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gangwon-fc/gangwon-fc-logo-footylogos.svg',
  'gen_286': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ifk-varnamo/ifk-varnamo-logo-footylogos.svg',
  'gen_287': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/philadelphia-union/philadelphia-union-logo-footylogos.svg',
  'gen_288': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-nassr/al-nassr-logo-footylogos.svg',
  'gen_289': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/zhejiang-professional/zhejiang-professional-logo-footylogos.svg',
  'gen_292': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sarpsborg-08/sarpsborg-08-logo-footylogos.svg',
  'gen_293': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/harrogate-town/harrogate-town-logo-footylogos.svg',
  'gen_294': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/melbourne-city/melbourne-city-logo-footylogos.svg',
  'gen_295': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/newport-county/newport-county-logo-footylogos.svg',
  'gen_296': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gwangju-fc/gwangju-fc-logo-footylogos.svg',
  'gen_297': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/afc-wimbledon/afc-wimbledon-logo-footylogos.svg',
  'gen_298': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fleetwood-town/fleetwood-town-logo-footylogos.svg',
  'gen_299': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-ahli/al-ahli-logo-footylogos.svg',
  'gen_300': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-fateh/al-fateh-logo-footylogos.svg',
  'gen_301': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-qadsiah/al-qadsiah-logo-footylogos.svg',
  'gen_302': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-taawoun/al-taawoun-logo-footylogos.svg',
  'gen_303': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/western-sydney-wanderers/western-sydney-wanderers-logo-footylogos.svg',
  'gen_308': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bruk-bet-termalica-nieciecza/bruk-bet-termalica-nieciecza-logo-footylogos.svg',
  'gen_320': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/shanghai-port/shanghai-port-logo-footylogos.svg',
  'gen_321': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-anyang/fc-anyang-logo-footylogos.svg',
  'gen_322': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/suwon-fc/suwon-fc-logo-footylogos.svg',
  'gen_327': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/orlando-city/orlando-city-logo-footylogos.svg',
  'gen_345': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bromley/bromley-logo-footylogos.svg',
  'gen_349': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fortaleza-ceif/fortaleza-ceif-logo-footylogos.svg',
  'gen_352': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-khaleej/al-khaleej-logo-footylogos.svg',
  'gen_353': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/atlanta-united/atlanta-united-logo-footylogos.svg',
  'gen_354': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/inter-miami/inter-miami-logo-footylogos.svg',
  'gen_359': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/metropolitanos/metropolitanos-logo-footylogos.svg',
  'gen_368': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-riyadh/al-riyadh-logo-footylogos.svg',
  'gen_369': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/northeast-united/northeast-united-logo-footylogos.svg',
  'gen_371': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-fayha/al-fayha-logo-footylogos.svg',
  'gen_372': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-okhdood/al-okhdood-logo-footylogos.svg',
  'gen_376': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/mohun-bagan-super-giant/mohun-bagan-super-giant-logo-footylogos.svg',
  'gen_379': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/damac/damac-logo-footylogos.svg',
  'gen_380': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-hazem/al-hazem-logo-footylogos.svg',
  'gen_381': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/odisha-fc/odisha-fc-logo-footylogos.svg',
  'gen_382': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/chennaiyin-fc/chennaiyin-fc-logo-footylogos.svg',
  'gen_383': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-goa/fc-goa-logo-footylogos.svg',
  'gen_384': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/kerala-blasters/kerala-blasters-logo-footylogos.svg',
  'gen_385': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/mumbai-city/mumbai-city-logo-footylogos.svg',
  'gen_387': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bengaluru-fc/bengaluru-fc-logo-footylogos.svg',
  'gen_388': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ik-sirius/ik-sirius-logo-footylogos.svg',
  'gen_389': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/kristiansund-bk/kristiansund-bk-logo-footylogos.svg',
  'gen_394': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/degerfors-if/degerfors-if-logo-footylogos.svg',
  'gen_395': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/salford-city/salford-city-logo-footylogos.svg',
  'gen_398': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/western-united/western-united-logo-footylogos.svg',
  'gen_400': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/hermannstadt/hermannstadt-logo-footylogos.svg',
  'gen_403': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/jamshedpur-fc/jamshedpur-fc-logo-footylogos.svg',
  'gen_418': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/macarthur-fc/macarthur-fc-logo-footylogos.svg',
  'gen_422': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/meizhou-hakka/meizhou-hakka-logo-footylogos.svg',
  'gen_428': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/punjab-fc/punjab-fc-logo-footylogos.svg',
  'gen_443': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/wuhan-three-towns/wuhan-three-towns-logo-footylogos.svg',
  'gen_444': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/middlesbrough/middlesbrough-logo-footylogos.svg',
  'gen_445': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/crewe-alexandra/crewe-alexandra-logo-footylogos.svg',
  'gen_446': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/shrewsbury-town/shrewsbury-town-logo-footylogos.svg',
  'gen_449': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/qingdao-hainiu/qingdao-hainiu-logo-footylogos.svg',
  'gen_450': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/eyupspor/eyupspor-logo-footylogos.svg',
  'gen_452': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-annecy/fc-annecy-logo-footylogos.svg',
  'gen_453': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/unirea-slobozia/unirea-slobozia-logo-footylogos.svg',
  'gen_458': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/qingdao-west-coast/qingdao-west-coast-logo-footylogos.svg',
  'gen_462': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/yunnan-yukun/yunnan-yukun-logo-footylogos.svg',
  'gen_466': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-kholood/al-kholood-logo-footylogos.svg',
  'gen_467': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/auckland-fc/auckland-fc-logo-footylogos.svg',
  'gen_469': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/neom-sc/neom-sc-logo-footylogos.svg',
  'gen_473': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/dalian-yingbo/dalian-yingbo-logo-footylogos.svg',
  'gen_497': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/barnet/barnet-logo-footylogos.svg',
  'gen_523': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/doncaster-rovers/doncaster-rovers-logo-footylogos.svg',
  'gen_524': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/exeter-city/exeter-city-logo-footylogos.svg',
  'gen_525': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cd-santa-clara/cd-santa-clara-logo-footylogos.svg',
  'gen_527': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/viborg-ff/viborg-ff-logo-footylogos.svg',
  'gen_529': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fk-haugesund/fk-haugesund-logo-footylogos.svg',
  'gen_530': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ulsan-hd/ulsan-hd-logo-footylogos.svg',
  'gen_531': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/pohang-steelers/pohang-steelers-logo-footylogos.svg',
  'gen_532': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/jeonbuk-hyundai-motors/jeonbuk-hyundai-motors-logo-footylogos.svg',
  'gen_534': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/lincoln-city/lincoln-city-logo-footylogos.svg',
  'gen_535': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/queens-park-rangers/queens-park-rangers-logo-footylogos.svg',
  'gen_537': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-fredericia/fc-fredericia-logo-footylogos.svg',
  'gen_540': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/burton-albion/burton-albion-logo-footylogos.svg',
  'gen_542': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/wsg-tirol/wsg-tirol-logo-footylogos.svg',
  'gen_543': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/tranmere-rovers/tranmere-rovers-logo-footylogos.svg',
  'gen_634': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/galway-united-fc/galway-united-fc-logo-footylogos.svg',
  'gen_641': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/drogheda-united/drogheda-united-logo-footylogos.svg',
  'gen_659': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/juventud/juventud-logo-footylogos.svg',
  'gen_662': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/yaracuyanos/yaracuyanos-logo-footylogos.svg',
  'gen_667': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/energie-cottbus/energie-cottbus-logo-footylogos.svg',
  'gen_673': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/southampton/southampton-logo-footylogos.svg',
  'gen_682': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-ahly-sc/al-ahly-sc-logo-footylogos.svg',
  'gen_687': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-winterthur/fc-winterthur-logo-footylogos.svg',
  'gen_688': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-thun/fc-thun-logo-footylogos.svg',
  'gen_691': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/le-mans-fc/le-mans-fc-logo-footylogos.svg',
  'gen_696': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cercle-brugge/cercle-brugge-logo-footylogos.svg',
  'gen_698': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sandefjord-fotball/sandefjord-fotball-logo-footylogos.svg',
  'gen_699': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/randers-fc/randers-fc-logo-footylogos.svg',
  'gen_701': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/portsmouth/portsmouth-logo-footylogos.svg',
  'gen_702': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/norwich-city/norwich-city-logo-footylogos.svg',
  'gen_704': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sheffield-united/sheffield-united-logo-footylogos.svg',
  'gen_705': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/watford/watford-logo-footylogos.svg',
  'gen_707': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/rotherham-united/rotherham-united-logo-footylogos.svg',
  'gen_708': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/milton-keynes-dons/milton-keynes-dons-logo-footylogos.svg',
  'gen_711': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/dundee/dundee-logo-footylogos.svg',
  'gen_712': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/coventry-city/coventry-city-logo-footylogos.svg',
  'gen_713': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/preston-north-end/preston-north-end-logo-footylogos.svg',
  'gen_714': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gillingham/gillingham-logo-footylogos.svg',
  'gen_715': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/walsall/walsall-logo-footylogos.svg',
  'gen_716': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bradford-city/bradford-city-logo-footylogos.svg',
  'gen_718': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/stoke-city/stoke-city-logo-footylogos.svg',
  'gen_722': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/dundee-united/dundee-united-logo-footylogos.svg',
  'gen_724': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/clermont-foot/clermont-foot-logo-footylogos.svg',
  'gen_725': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/amiens-sc/amiens-sc-logo-footylogos.svg',
  'gen_729': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/msv-duisburg/msv-duisburg-logo-footylogos.svg',
  'gen_730': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/alemannia-aachen/alemannia-aachen-logo-footylogos.svg',
  'gen_735': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/tapatio-logo-footylogos.svg',
  'gen_741': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cancun-fc-logo-footylogos.svg',
  'gen_749': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/albacete-balompie/albacete-balompie-logo-footylogos.svg',
  'gen_752': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/lausanne-sport/lausanne-sport-logo-footylogos.svg',
  'gen_755': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/legia-warszawa/legia-warszawa-logo-footylogos.svg',
  'gen_773': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/moreirense/moreirense-logo-footylogos.svg',
  'gen_783': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/wigan-athletic/wigan-athletic-logo-footylogos.svg',
  'gen_784': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bristol-city/bristol-city-logo-footylogos.svg',
  'gen_785': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/oldham-athletic/oldham-athletic-logo-footylogos.svg',
  'gen_786': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/luton-town/luton-town-logo-footylogos.svg',
  'gen_787': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/chesterfield/chesterfield-logo-footylogos.svg',
  'gen_789': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/blackpool/blackpool-logo-footylogos.svg',
  'gen_790': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/port-vale-fc/port-vale-fc-logo-footylogos.svg',
  'gen_791': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/plymouth-argyle/plymouth-argyle-logo-footylogos.svg',
  'gen_792': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/northampton-town/northampton-town-logo-footylogos.svg',
  'gen_793': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/stockport-county/stockport-county-logo-footylogos.svg',
  'gen_794': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/barnsley/barnsley-logo-footylogos.svg',
  'gen_795': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/wycombe-wanderers/wycombe-wanderers-logo-footylogos.svg',
  'gen_796': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/swindon-town/swindon-town-logo-footylogos.svg',
  'gen_797': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/colchester-united/colchester-united-logo-footylogos.svg',
  'gen_798': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cheltenham-town/cheltenham-town-logo-footylogos.svg',
  'gen_799': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/notts-county/notts-county-logo-footylogos.svg',
  'gen_800': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/peterborough-united/peterborough-united-logo-footylogos.svg',
  'gen_801': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/huddersfield-town/huddersfield-town-logo-footylogos.svg',
  'gen_802': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/mansfield-town/mansfield-town-logo-footylogos.svg',
  'gen_804': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cambridge-united/cambridge-united-logo-footylogos.svg',
  'gen_806': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/oxford-united/oxford-united-logo-footylogos.svg',
  'gen_807': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/hull-city/hull-city-logo-footylogos.svg',
  'gen_808': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/leyton-orient/leyton-orient-logo-footylogos.svg',
  'gen_809': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/swansea-city/swansea-city-logo-footylogos.svg',
  'gen_810': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cardiff-city/cardiff-city-logo-footylogos.svg',
  'gen_811': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bristol-rovers/bristol-rovers-logo-footylogos.svg',
  'gen_814': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/excelsior/excelsior-logo-footylogos.svg',
  'gen_817': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/union-saint-gilloise/union-saint-gilloise-logo-footylogos.svg',
  'gen_820': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fredrikstad-fk/fredrikstad-fk-logo-footylogos.svg',
  'gen_822': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gimcheon-sangmu/gimcheon-sangmu-logo-footylogos.svg',
  'gen_823': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/daegu-fc/daegu-fc-logo-footylogos.svg',
  'gen_828': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-lorient/fc-lorient-logo-footylogos.svg',
  'gen_834': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/club-brugge/club-brugge-logo-footylogos.svg',
  'gen_835': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/standard-liege/standard-liege-logo-footylogos.svg',
  'gen_848': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/lask/lask-logo-footylogos.svg',
  'gen_850': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/austria-wien/austria-wien-logo-footylogos.svg',
  'gen_852': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/slavia-praha/slavia-praha-logo-footylogos.svg',
  'gen_853': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sparta-praha/sparta-praha-logo-footylogos.svg',
  'gen_855': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/hansa-rostock/hansa-rostock-logo-footylogos.svg',
  'gen_856': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/silkeborg-if/silkeborg-if-logo-footylogos.svg',
  'gen_861': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/olympiacos/olympiacos-logo-footylogos.svg',
  'gen_864': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/rosenborg-bk/rosenborg-bk-logo-footylogos.svg',
  'gen_865': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/blackburn-rovers/blackburn-rovers-logo-footylogos.svg',
  'gen_866': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/viking-fk/viking-fk-logo-footylogos.svg',
  'gen_869': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/shamrock-rovers/shamrock-rovers-logo-footylogos.svg',
  'gen_873': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ifk-goteborg/ifk-goteborg-logo-footylogos.svg',
  'gen_876': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/halmstads-bk/halmstads-bk-logo-footylogos.svg',
  'gen_880': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fenerbahce/fenerbahce-logo-footylogos.svg',
  'gen_886': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/stevenage/stevenage-logo-footylogos.svg',
  'gen_892': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/paok/paok-logo-footylogos.svg',
  'gen_893': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bolton-wanderers/bolton-wanderers-logo-footylogos.svg',
  'gen_894': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/molde-fk/molde-fk-logo-footylogos.svg',
  'gen_896': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/gornik-zabrze/gornik-zabrze-logo-footylogos.svg',
  'gen_897': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/cork-city/cork-city-logo-footylogos.svg',
  'gen_898': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/st-patrick-s-athletic/st-patrick-s-athletic-logo-footylogos.svg',
  'gen_899': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/aik/aik-logo-footylogos.svg',
  'gen_900': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/trabzonspor/trabzonspor-logo-footylogos.svg',
  'gen_901': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/derry-city/derry-city-logo-footylogos.svg',
  'gen_902': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/athletic-club-bilbao/athletic-club-bilbao-logo-footylogos.svg',
  'gen_903': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/real-betis-balompie/real-betis-balompie-logo-footylogos.svg',
  'gen_905': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/celta-vigo/celta-vigo-logo-footylogos.svg',
  'gen_908': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/racing-santander/racing-santander-logo-footylogos.svg',
  'gen_912': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/real-valladolid/real-valladolid-logo-footylogos.svg',
  'gen_913': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/deportivo-alaves/deportivo-alaves-logo-footylogos.svg',
  'gen_923': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/vfl-osnabruck/vfl-osnabruck-logo-footylogos.svg',
  'gen_924': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sv-wehen-wiesbaden/sv-wehen-wiesbaden-logo-footylogos.svg',
  'gen_928': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/erzgebirge-aue/erzgebirge-aue-logo-footylogos.svg',
  'gen_931': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/1-fc-saarbrucken/1-fc-saarbrucken-logo-footylogos.svg',
  'gen_936': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/jahn-regensburg/jahn-regensburg-logo-footylogos.svg',
  'gen_938': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sligo-rovers/sligo-rovers-logo-footylogos.svg',
  'gen_945': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sc-bastia/sc-bastia-logo-footylogos.svg',
  'gen_949': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-hilal/al-hilal-logo-footylogos.svg',
  'gen_950': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/al-ittihad/al-ittihad-logo-footylogos.svg',
  'gen_953': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fortuna-sittard/fortuna-sittard-logo-footylogos.svg',
  'gen_961': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-metz/fc-metz-logo-footylogos.svg',
  'gen_962': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sint-truiden/sint-truiden-logo-footylogos.svg',
  'gen_968': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/new-england-revolution/new-england-revolution-logo-footylogos.svg',
  'gen_978': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ifk-norrkoping/ifk-norrkoping-logo-footylogos.svg',
  'gen_979': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/hammarby-if/hammarby-if-logo-footylogos.svg',
  'gen_981': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/djurgardens-if/djurgardens-if-logo-footylogos.svg',
  'gen_982': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/bk-hacken/bk-hacken-logo-footylogos.svg',
  'gen_988': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/antalyaspor/antalyaspor-logo-footylogos.svg',
  'gen_989': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/rio-ave/rio-ave-logo-footylogos.svg',
  'gen_990': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/samsunspor/samsunspor-logo-footylogos.svg',
  'gen_991': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/waterford/waterford-logo-footylogos.png',
  'gen_994': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/celtic/celtic-logo-footylogos.svg',
  'gen_995': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/sv-ried/sv-ried-logo-footylogos.svg',
  'gen_996': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/falkirk/falkirk-logo-footylogos.svg',
  'gen_998': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/heart-of-midlothian/heart-of-midlothian-logo-footylogos.svg',
  'gen_999': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/hibernian/hibernian-logo-footylogos.svg',
  'gen_1003': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/motherwell/motherwell-logo-footylogos.svg',
  'gen_1005': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/lech-poznan/lech-poznan-logo-footylogos.svg',
  'gen_1006': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/birmingham-city/birmingham-city-logo-footylogos.svg',
  'gen_1007': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/charlton-athletic/charlton-athletic-logo-footylogos.svg',
  'gen_1009': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-basel/fc-basel-logo-footylogos.svg',
  'gen_1010': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-luzern/fc-luzern-logo-footylogos.svg',
  'gen_1011': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-st-gallen/fc-st-gallen-logo-footylogos.svg',
  'gen_1014': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/derby-county/derby-county-logo-footylogos.svg',
  'gen_1017': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/grimsby-town/grimsby-town-logo-footylogos.svg',
  'gen_1020': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/ipswich-town/ipswich-town-logo-footylogos.svg',
  'gen_1022': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/millwall/millwall-logo-footylogos.svg',
  'gen_1024': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/daejeon-hana-citizen/daejeon-hana-citizen-logo-footylogos.svg',
  'gen_1025': 'https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/fc-seoul/fc-seoul-logo-footylogos.svg',
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
        badgeImageUrl: GENERATED_CLUB_CRESTS[`gen_${index}`] || null,
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

// Selecciones que NO clasificaron al Mundial 2026 pero sí juegan Eurocopa o Copa América. Van en un
// array APARTE y no en el seed de arriba a propósito: WORLD_CUP_TEAMS_DATABASE alimenta el sorteo
// del Mundial, que tiene exactamente 48 equipos, y meterlas ahí lo convertiría en un torneo de 66.
//
// Sin ellas, en cambio, la Euro y la Copa América quedaban a un tercio de sus partidos: la Euro
// 2024 la jugaron Italia, Dinamarca, Serbia y Polonia, y la Copa América, Chile, Perú, Venezuela y
// Bolivia -- ninguna está en el Mundial 2026.
const EXTRA_NATIONAL_TEAMS_SEED: typeof WORLD_CUP_2026_TEAMS_SEED = [
  { id: 'wc_italia', countryName: 'Italia', league: 'Italiana', dt: 'Gennaro Gattuso', starPlayers: ['Gianluigi Donnarumma', 'Nicolò Barella', 'Federico Dimarco', 'Sandro Tonali', 'Mateo Retegui'], badgeLogoUrl: '🇮🇹' },
  { id: 'wc_dinamarca', countryName: 'Dinamarca', league: 'Danesa', dt: 'Brian Riemer', starPlayers: ['Rasmus Højlund', 'Pierre-Emile Højbjerg', 'Christian Eriksen', 'Joachim Andersen', 'Mikkel Damsgaard'], badgeLogoUrl: '🇩🇰' },
  { id: 'wc_serbia', countryName: 'Serbia', league: 'Serbia', dt: 'Veljko Paunović', starPlayers: ['Dušan Vlahović', 'Sergej Milinković-Savić', 'Aleksandar Mitrović', 'Filip Kostić', 'Strahinja Pavlović'], badgeLogoUrl: '🇷🇸' },
  { id: 'wc_polonia', countryName: 'Polonia', dt: 'Jan Urban', starPlayers: ['Robert Lewandowski', 'Piotr Zieliński', 'Nicola Zalewski', 'Jakub Kiwior', 'Wojciech Szczęsny'], badgeLogoUrl: '🇵🇱' },
  { id: 'wc_ucrania', countryName: 'Ucrania', league: 'Ucraniana', dt: 'Serhiy Rebrov', starPlayers: ['Mykhailo Mudryk', 'Oleksandr Zinchenko', 'Artem Dovbyk', 'Georgiy Sudakov', 'Illia Zabarnyi'], badgeLogoUrl: '🇺🇦' },
  { id: 'wc_hungria', countryName: 'Hungría', league: 'Húngara', dt: 'Marco Rossi', starPlayers: ['Dominik Szoboszlai', 'Milos Kerkez', 'Barnabás Varga', 'Roland Sallai', 'Willi Orbán'], badgeLogoUrl: '🇭🇺' },
  { id: 'wc_rumania', countryName: 'Rumania', league: 'Rumana', dt: 'Mircea Lucescu', starPlayers: ['Dennis Man', 'Radu Drăgușin', 'Ianis Hagi', 'Nicolae Stanciu', 'Florinel Coman'], badgeLogoUrl: '🇷🇴' },
  { id: 'wc_eslovaquia', countryName: 'Eslovaquia', dt: 'Francesco Calzona', starPlayers: ['Milan Škriniar', 'Stanislav Lobotka', 'Dávid Hancko', 'Lukáš Haraslín', 'Martin Dúbravka'], badgeLogoUrl: '🇸🇰' },
  { id: 'wc_eslovenia', countryName: 'Eslovenia', dt: 'Matjaž Kek', starPlayers: ['Jan Oblak', 'Benjamin Šeško', 'Josip Iličić', 'Jaka Bijol', 'Adam Gnezda Čerin'], badgeLogoUrl: '🇸🇮' },
  { id: 'wc_albania', countryName: 'Albania', dt: 'Sylvinho', starPlayers: ['Armando Broja', 'Kristjan Asllani', 'Nedim Bajrami', 'Berat Djimsiti', 'Thomas Strakosha'], badgeLogoUrl: '🇦🇱' },
  { id: 'wc_georgia', countryName: 'Georgia', dt: 'Willy Sagnol', starPlayers: ['Khvicha Kvaratskhelia', 'Giorgi Mamardashvili', 'Georges Mikautadze', 'Giorgi Chakvetadze', 'Guram Kashia'], badgeLogoUrl: '🇬🇪' },
  { id: 'wc_chile', countryName: 'Chile', league: 'Chilena', dt: 'Nicolás Córdova', starPlayers: ['Alexis Sánchez', 'Ben Brereton Díaz', 'Claudio Bravo', 'Erick Pulgar', 'Darío Osorio'], badgeLogoUrl: '🇨🇱' },
  { id: 'wc_peru', countryName: 'Perú', league: 'Peruana', dt: 'Manuel Barreto', starPlayers: ['Paolo Guerrero', 'Gianluca Lapadula', 'Pedro Gallese', 'Renato Tapia', 'André Carrillo'], badgeLogoUrl: '🇵🇪' },
  { id: 'wc_venezuela', countryName: 'Venezuela', league: 'Venezolana', dt: 'Fernando Batista', starPlayers: ['Salomón Rondón', 'Yeferson Soteldo', 'Darwin Machís', 'Tomás Rincón', 'Rafael Romo'], badgeLogoUrl: '🇻🇪' },
  { id: 'wc_bolivia', countryName: 'Bolivia', league: 'Boliviana', dt: 'Óscar Villegas', starPlayers: ['Marcelo Moreno Martins', 'Miguelito', 'Carmelo Algarañaz', 'Luis Haquín', 'Guillermo Viscarra'], badgeLogoUrl: '🇧🇴' },
  { id: 'wc_costa_rica', countryName: 'Costa Rica', dt: 'Miguel Herrera', starPlayers: ['Keylor Navas', 'Josimar Alcócer', 'Manfred Ugalde', 'Francisco Calvo', 'Brandon Aguilera'], badgeLogoUrl: '🇨🇷' },
  { id: 'wc_jamaica', countryName: 'Jamaica', dt: 'Steve McClaren', starPlayers: ['Michail Antonio', 'Leon Bailey', 'Demarai Gray', 'Bobby De Cordova-Reid', 'Ethan Pinnock'], badgeLogoUrl: '🇯🇲' },
  { id: 'wc_chequia_euro', countryName: 'República Checa', league: 'Checa', dt: 'Ivan Hašek', starPlayers: ['Patrik Schick', 'Tomáš Souček', 'Adam Hložek', 'Vladimír Coufal', 'Jindřich Staněk'], badgeLogoUrl: '🇨🇿' },

  // Resto de selecciones UEFA, necesarias para las eliminatorias europeas rumbo al Mundial: las
  // juegan las 54 federaciones y sin estas 27 solo el 20% de los partidos era representable.
  // Son las rivales "chicas" del grupo -- las que hacen que una eliminatoria se sienta larga.
  { id: 'wc_gales', countryName: 'Gales', dt: 'Craig Bellamy', starPlayers: ['Aaron Ramsey', 'Brennan Johnson', 'Harry Wilson', 'Ben Davies', 'Daniel James'], badgeLogoUrl: '🏴' },
  { id: 'wc_irlanda', countryName: 'Irlanda', dt: 'Heimir Hallgrímsson', starPlayers: ['Evan Ferguson', 'Caoimhín Kelleher', 'Josh Cullen', 'Nathan Collins', 'Chiedozie Ogbene'], badgeLogoUrl: '🇮🇪' },
  { id: 'wc_irlanda_norte', countryName: 'Irlanda del Norte', dt: 'Michael O\'Neill', starPlayers: ['Conor Bradley', 'Isaac Price', 'Trai Hume', 'Dan Ballard', 'Bailey Peacock-Farrell'], badgeLogoUrl: '🏴' },
  { id: 'wc_grecia', countryName: 'Grecia', league: 'Griega', dt: 'Ivan Jovanović', starPlayers: ['Konstantinos Mavropanos', 'Fotis Ioannidis', 'Anastasios Bakasetas', 'Giorgos Masouras', 'Odysseas Vlachodimos'], badgeLogoUrl: '🇬🇷' },
  { id: 'wc_islandia', countryName: 'Islandia', dt: 'Arnar Viðarsson', starPlayers: ['Albert Guðmundsson', 'Hákon Haraldsson', 'Jón Daði Böðvarsson', 'Sverrir Ingason', 'Elías Ólafsson'], badgeLogoUrl: '🇮🇸' },
  { id: 'wc_finlandia', countryName: 'Finlandia', dt: 'Jacob Friis', starPlayers: ['Teemu Pukki', 'Lukáš Hrádecký', 'Robin Lod', 'Leo Väisänen', 'Oliver Antman'], badgeLogoUrl: '🇫🇮' },
  { id: 'wc_macedonia', countryName: 'Macedonia del Norte', dt: 'Blagoja Milevski', starPlayers: ['Eljif Elmas', 'Enis Bardhi', 'Bojan Miovski', 'Stole Dimitrievski', 'Ezgjan Alioski'], badgeLogoUrl: '🇲🇰' },
  { id: 'wc_montenegro', countryName: 'Montenegro', dt: 'Robert Prosinečki', starPlayers: ['Stefan Savić', 'Stevan Jovetić', 'Nikola Krstović', 'Milutin Osmajić', 'Matija Šarkić'], badgeLogoUrl: '🇲🇪' },
  { id: 'wc_kosovo', countryName: 'Kosovo', dt: 'Franco Foda', starPlayers: ['Vedat Muriqi', 'Milot Rashica', 'Amir Rrahmani', 'Elvis Rexhbeçaj', 'Arijanet Muric'], badgeLogoUrl: '🇽🇰' },
  { id: 'wc_bulgaria', countryName: 'Bulgaria', dt: 'Ilian Iliev', starPlayers: ['Kiril Despodov', 'Ilia Gruev', 'Valentin Antov', 'Georgi Rusev', 'Svetoslav Vutsov'], badgeLogoUrl: '🇧🇬' },
  { id: 'wc_bielorrusia', countryName: 'Bielorrusia', dt: 'Karlos Alós', starPlayers: ['Max Ebong', 'Vitali Lisakovich', 'Yuri Kendysh', 'Denis Laptev', 'Fedor Lapoukhov'], badgeLogoUrl: '🇧🇾' },
  { id: 'wc_israel', countryName: 'Israel', league: 'Israelí', dt: 'Ran Ben Shimon', starPlayers: ['Manor Solomon', 'Oscar Gloukh', 'Eran Zahavi', 'Daniel Peretz', 'Idan Nachmias'], badgeLogoUrl: '🇮🇱' },
  { id: 'wc_kazajistan', countryName: 'Kazajistán', league: 'Kazaja', dt: 'Talgat Baysufinov', starPlayers: ['Bakhtiyar Zaynutdinov', 'Askhat Tagybergen', 'Abat Aymbetov', 'Nuraly Alip', 'Stas Pokatilov'], badgeLogoUrl: '🇰🇿' },
  { id: 'wc_azerbaiyan', countryName: 'Azerbaiyán', league: 'Azerí', dt: 'Aykhan Abbasov', starPlayers: ['Emin Makhmudov', 'Renat Dadashov', 'Bahlul Mustafazade', 'Rahil Mammadov', 'Shahrudin Mahammadaliyev'], badgeLogoUrl: '🇦🇿' },
  { id: 'wc_armenia', countryName: 'Armenia', dt: 'Yeghishe Melikyan', starPlayers: ['Eduard Spertsyan', 'Lucas Zelarayán', 'Grant-Leon Ranos', 'Nair Tiknizyan', 'David Yurchenko'], badgeLogoUrl: '🇦🇲' },
  { id: 'wc_moldavia', countryName: 'Moldavia', dt: 'Serghei Cleșcenco', starPlayers: ['Ion Nicolaescu', 'Vadim Rață', 'Oleg Reabciuk', 'Vladislav Baboglo', 'Cristian Avram'], badgeLogoUrl: '🇲🇩' },
  { id: 'wc_letonia', countryName: 'Letonia', dt: 'Paolo Nicolato', starPlayers: ['Vladislavs Gutkovskis', 'Roberts Uldriķis', 'Alvis Jaunzems', 'Antonijs Černomordijs', 'Krišjānis Zviedris'], badgeLogoUrl: '🇱🇻' },
  { id: 'wc_lituania', countryName: 'Lituania', dt: 'Edgaras Jankauskas', starPlayers: ['Fedor Černych', 'Gvidas Gineitis', 'Edvinas Girdvainis', 'Justas Lasickas', 'Edvinas Gertmonas'], badgeLogoUrl: '🇱🇹' },
  { id: 'wc_estonia', countryName: 'Estonia', dt: 'Jürgen Henn', starPlayers: ['Rauno Sappinen', 'Karol Mets', 'Mattias Käit', 'Märten Kuusk', 'Karl Hein'], badgeLogoUrl: '🇪🇪' },
  { id: 'wc_chipre', countryName: 'Chipre', league: 'Chipriota', dt: 'Apostolos Mantzios', starPlayers: ['Ioannis Pittas', 'Grigoris Kastanos', 'Andronikos Kakoullis', 'Konstantinos Laifis', 'Neofytos Michael'], badgeLogoUrl: '🇨🇾' },
  { id: 'wc_malta', countryName: 'Malta', dt: 'Emilio De Leo', starPlayers: ['Teddy Teuma', 'Jurgen Degabriele', 'Matthew Guillaumier', 'Enrico Pepe', 'Henry Bonello'], badgeLogoUrl: '🇲🇹' },
  { id: 'wc_luxemburgo', countryName: 'Luxemburgo', dt: 'Jeff Strasser', starPlayers: ['Gerson Rodrigues', 'Leandro Barreiro', 'Danel Sinani', 'Mathias Olesen', 'Anthony Moris'], badgeLogoUrl: '🇱🇺' },
  { id: 'wc_islas_feroe', countryName: 'Islas Feroe', dt: 'Eyðun Klakstein', starPlayers: ['Brandur Olsen', 'Klæmint Olsen', 'Jóannes Bjartalíð', 'Hallur Hansson', 'Gunnar Nielsen'], badgeLogoUrl: '🇫🇴' },
  { id: 'wc_andorra', countryName: 'Andorra', dt: 'Koldo Álvarez', starPlayers: ['Marc Vales', 'Ricard Fernández', 'Cristian Martínez', 'Marc Pujol', 'Josep Gómes'], badgeLogoUrl: '🇦🇩' },
  { id: 'wc_san_marino', countryName: 'San Marino', dt: 'Roberto Cevoli', starPlayers: ['Nicola Nanni', 'Alessandro Golinucci', 'Filippo Fabbri', 'Michael Battistini', 'Elia Benedettini'], badgeLogoUrl: '🇸🇲' },
  { id: 'wc_liechtenstein', countryName: 'Liechtenstein', dt: 'Konrad Fünfstück', starPlayers: ['Noah Frick', 'Aron Sele', 'Jens Hofer', 'Fabio Luque Notaro', 'Benjamin Büchel'], badgeLogoUrl: '🇱🇮' },
  { id: 'wc_gibraltar', countryName: 'Gibraltar', dt: 'Scott Wiseman', starPlayers: ['Tjay De Barr', 'Liam Walker', 'Reece Styche', 'Ethan Britto', 'Dayle Coleing'], badgeLogoUrl: '🇬🇮' },
];

// Puntos reales del ranking FIFA (edición 2026-06-08) por selección clasificada al Mundial 2026.
// Antes TODAS las selecciones tenían reputation:5 y marketValue:0 fijos, sin importar el rival --
// eso hacía que clubStrength() (leagueEngine.ts) tratara a Curazao exactamente igual que a
// Argentina en la simulación de partidos del Mundial. Rango real del dataset: ~1276 (Nueva
// Zelanda) a ~1876 (Argentina).
const WORLD_CUP_FIFA_POINTS: Record<string, number> = {
  wc_alemania: 1735.8, wc_arabia_saudita: 1421.5, wc_argelia: 1571.0, wc_argentina: 1876.1,
  wc_australia: 1579.3, wc_austria: 1597.4, wc_belgica: 1742.2, wc_bosnia: 1387.2,
  wc_brasil: 1765.9, wc_cabo_verde: 1371.1, wc_canada: 1559.5, wc_catar: 1450.3,
  wc_chequia: 1505.7, wc_colombia: 1698.4, wc_corea_sur: 1591.6, wc_costa_marfil: 1540.9,
  wc_croacia: 1714.9, wc_curazao: 1294.8, wc_ecuador: 1598.5, wc_egipto: 1562.4,
  wc_escocia: 1503.3, wc_espana: 1873.0, wc_francia: 1869.4, wc_ghana: 1346.9,
  wc_haiti: 1293.1, wc_holanda: 1751.1, wc_inglaterra: 1827.0, wc_irak: 1451.2,
  wc_iran: 1619.6, wc_japon: 1661.6, wc_jordania: 1387.7, wc_marruecos: 1755.1,
  wc_mexico: 1687.5, wc_noruega: 1557.4, wc_nueva_zelanda: 1275.6, wc_panama: 1539.2,
  wc_paraguay: 1505.3, wc_portugal: 1766.2, wc_rd_congo: 1479.7, wc_senegal: 1686.4,
  wc_sudafrica: 1428.4, wc_suecia: 1509.8, wc_suiza: 1650.1, wc_tunez: 1476.4,
  wc_turquia: 1605.7, wc_uruguay: 1673.1, wc_usa: 1671.2, wc_uzbekistan: 1461.2,
};
const WC_FIFA_POINTS_MIN = 1275;
const WC_FIFA_POINTS_MAX = 1877;

function buildNationalTeam(team: (typeof WORLD_CUP_2026_TEAMS_SEED)[number]): Club {
  const fifaPoints = WORLD_CUP_FIFA_POINTS[team.id] ?? (WC_FIFA_POINTS_MIN + WC_FIFA_POINTS_MAX) / 2;
  const normalized = Math.max(0, Math.min(1, (fifaPoints - WC_FIFA_POINTS_MIN) / (WC_FIFA_POINTS_MAX - WC_FIFA_POINTS_MIN)));
  const reputation = Math.max(1, Math.min(5, Math.round(1 + normalized * 4))) as 1 | 2 | 3 | 4 | 5;
  // marketValue va de ~15M (selecciones más débiles) a ~1.500M (Argentina/España/Francia), en
  // escala similar a la de clubes reales para que clubStrength() los compare de forma coherente.
  const marketValue = Math.round(15_000_000 + normalized * 1_485_000_000);
  return {
    id: team.id,
    name: `Selección de ${team.countryName}`,
    league: team.league ?? 'Selecciones Mundial 2026',
    dt: team.dt,
    reputation,
    initialSalary: 0,
    marketValue,
    starPlayers: team.starPlayers,
    description: `Selección masculina absoluta de ${team.countryName}.`,
    badgeColor: 'border-l-4 border-slate-500 bg-slate-900/40 text-slate-100',
    badgeLogoUrl: team.badgeLogoUrl
  };
}

// SOLO las 48 del Mundial 2026: es lo que consume el sorteo, y sumarle selecciones lo convertiría
// en un torneo de 66 equipos.
export const WORLD_CUP_TEAMS_DATABASE: Club[] = WORLD_CUP_2026_TEAMS_SEED.map(buildNationalTeam);

// Todas las selecciones que el juego conoce (Mundial + las que solo juegan Eurocopa/Copa América).
// Es la que hay que usar para resolver rivales de esos dos torneos.
export const ALL_NATIONAL_TEAMS_DATABASE: Club[] = [
  ...WORLD_CUP_2026_TEAMS_SEED,
  ...EXTRA_NATIONAL_TEAMS_SEED,
].map(buildNationalTeam);

// Mapa nacionalidad (tal como la guarda PlayerProfile.nationality, igual que Club.league)
// -> id de la selección correspondiente, para saber a qué equipo te pueden convocar.
// Solo cubre las nacionalidades que SetupScreen ofrece elegir Y que clasificaron al Mundial
// 2026 (Italiana y Chilena no clasificaron, por eso no están acá).
// Fase 4 -- Logros: catálogo estático tipo Xbox/PlayStation. check() es puro (solo lee el
// PlayerProfile actual), la lógica de "ya estaba desbloqueado antes" vive en
// checkAndUnlockAchievements (App.tsx), que corre este catálogo entero después de cada acción
// relevante (fin de partido, traspaso, patrocinio, novia, etc.) y compara contra
// profile.unlockedAchievements. Recompensas chicas y parejas a propósito: el premio real es la
// notificación/colección, no la plata.
export const ACHIEVEMENTS_DATABASE: Achievement[] = [
  // --- CARRERA ---
  {
    id: 'primer_gol', name: 'Estreno Goleador', description: 'Convertí tu primer gol como profesional.',
    icon: '⚽', category: 'carrera', reward: 500,
    check: p => p.careerStats.golesHistoricos >= 1
  },
  {
    id: 'primer_asistencia', name: 'Primer Pase Gol', description: 'Diste tu primera asistencia.',
    icon: '🎯', category: 'carrera', reward: 400,
    check: p => p.careerStats.asistenciasHistoricos >= 1
  },
  {
    id: 'goles_10', name: 'Rompehielos', description: 'Llegaste a 10 goles en tu carrera.',
    icon: '🥉', category: 'carrera', reward: 600,
    check: p => p.careerStats.golesHistoricos >= 10
  },
  {
    id: 'goles_50', name: 'Referente de Área', description: 'Llegaste a 50 goles en tu carrera.',
    icon: '🥈', category: 'carrera', reward: 1200,
    check: p => p.careerStats.golesHistoricos >= 50
  },
  {
    id: 'goles_100', name: 'Centenario', description: 'Llegaste a 100 goles en tu carrera.',
    icon: '🥇', category: 'carrera', reward: 2000,
    check: p => p.careerStats.golesHistoricos >= 100
  },
  {
    id: 'asistencias_50', name: 'El Que Habilita', description: 'Llegaste a 50 asistencias en tu carrera.',
    icon: '🎁', category: 'carrera', reward: 1200,
    check: p => p.careerStats.asistenciasHistoricos >= 50
  },
  {
    id: 'partidos_50', name: 'Rodaje', description: 'Jugaste 50 partidos oficiales.',
    icon: '📅', category: 'carrera', reward: 700,
    check: p => p.careerStats.partidosHistoricos >= 50
  },
  {
    id: 'partidos_200', name: 'Veterano de Mil Batallas', description: 'Jugaste 200 partidos oficiales.',
    icon: '🛡️', category: 'carrera', reward: 1800,
    check: p => p.careerStats.partidosHistoricos >= 200
  },
  {
    id: 'primer_titulo', name: 'Primer Trofeo', description: 'Ganaste tu primer título como jugador.',
    icon: '🏆', category: 'carrera', reward: 1500,
    check: p => p.careerStats.campeonatos >= 1
  },
  {
    id: 'tres_titulos', name: 'Coleccionista de Copas', description: 'Ganaste 3 títulos en tu carrera.',
    icon: '🏆', category: 'carrera', reward: 2500,
    check: p => p.careerStats.campeonatos >= 3
  },
  {
    id: 'primer_traspaso', name: 'Nueva Aventura', description: 'Fichaste por un club distinto al que arrancaste.',
    icon: '🧳', category: 'carrera', reward: 500,
    check: p => p.yearsAtClub === 0 && p.careerStats.partidosHistoricos > 0 && p.seasonHistory.length > 1
  },
  {
    id: 'valor_1m', name: 'Cotizado', description: 'Tu valor de mercado superó el millón.',
    icon: '💹', category: 'carrera', reward: 800,
    check: p => p.marketValue >= 1_000_000
  },
  {
    id: 'valor_10m', name: 'Activo de Lujo', description: 'Tu valor de mercado superó los 10 millones.',
    icon: '💎', category: 'carrera', reward: 1500,
    check: p => p.marketValue >= 10_000_000
  },
  {
    id: 'promedio_alto', name: 'Consistencia de Élite', description: 'Mantuviste un promedio de calificación de carrera arriba de 7.0 con al menos 20 partidos.',
    icon: '📈', category: 'carrera', reward: 1000,
    check: p => p.careerStats.partidosHistoricos >= 20 && (p.careerStats.sumaCalificacionesHistoricas / p.careerStats.partidosHistoricos) >= 7.0
  },

  // --- PARTIDO PUNTUAL ---
  {
    id: 'hat_trick', name: 'Hat-Trick', description: 'Metiste 3 goles o más en un mismo partido.',
    icon: '🎩', category: 'partido', reward: 900,
    check: p => p.lastMatchGoals >= 3
  },
  {
    id: 'mvp_partido', name: 'Figura del Partido', description: 'Terminaste un partido con calificación 9.0 o más.',
    icon: '⭐', category: 'partido', reward: 800,
    check: p => p.lastMatchRating >= 9.0
  },
  {
    id: 'gano_tanda_penales', name: 'Sangre Fría', description: 'Ganaste una tanda de penales.',
    icon: '🥅', category: 'partido', reward: 600,
    check: p => p.lastMatchWonShootout === true
  },

  // --- PERSONAL / VIDA FUERA DE LA CANCHA ---
  {
    id: 'primer_patrocinio', name: 'Cara de Marca', description: 'Firmaste tu primer contrato de patrocinio.',
    icon: '🤝', category: 'personal', reward: 500,
    check: p => p.sponsorsSignedCount >= 1
  },
  {
    id: 'tres_patrocinios', name: 'Cartera Diversificada', description: 'Firmaste 3 patrocinios distintos en tu carrera.',
    icon: '💼', category: 'personal', reward: 900,
    check: p => p.sponsorsSignedCount >= 3
  },
  {
    id: 'primera_novia', name: 'Corazón Ocupado', description: 'Empezaste una relación.',
    icon: '💕', category: 'personal', reward: 400,
    check: p => p.girlfriend !== null
  },
  {
    id: 'convivencia', name: 'Un Techo Compartido', description: 'Te mudaste a vivir con tu pareja.',
    icon: '🏠', category: 'personal', reward: 600,
    check: p => p.girlfriend?.livingTogether === true
  },
  {
    id: 'fans_50', name: 'Ídolo Emergente', description: 'Llegaste a 50 de conexión con la hinchada.',
    icon: '📣', category: 'personal', reward: 500,
    check: p => p.fans >= 50
  },
  {
    id: 'fans_90', name: 'Ídolo de Multitudes', description: 'Llegaste a 90 de conexión con la hinchada.',
    icon: '👑', category: 'personal', reward: 1200,
    check: p => p.fans >= 90
  },
  {
    id: 'prestige_80', name: 'Referente del Vestuario', description: 'Llegaste a 80 de prestigio con el cuerpo técnico.',
    icon: '🎖️', category: 'personal', reward: 1000,
    check: p => p.prestige >= 80
  },
  {
    id: 'mentor', name: 'Padrino de Vestuario', description: 'Elegiste un ahijado para hacerle mentoría.',
    icon: '🧑‍🏫', category: 'personal', reward: 500,
    check: p => p.mentorshipPlayerName !== null
  },
  {
    id: 'sobrevive_escandalo', name: 'Sobreviviste al Escándalo', description: 'Tocaste fondo de prestigio con el cuerpo técnico y seguiste en pie.',
    icon: '🛡️', category: 'personal', reward: 700,
    check: p => p.prestige <= 15
  },
];

// Fase 4 -- Pool de fichajes REALES (jugador, club origen, club destino, monto en EUR) para
// que "Fichajes al Día" en ChutSocial narre traspasos genuinos del fútbol mundial reciente
// (temporadas 22/23 a 25/26, fee > 2M) en vez de inventar un jugador ficticio moviéndose entre
// dos clubes del juego -- ver generateTransferAnnouncementPosts en Dashboard.tsx.
export const REAL_TRANSFER_POOL: { player: string; from: string; to: string; fee: number }[] = [
  { player: 'Jaden Philogene', from: 'Aston Villa', to: 'Ipswich', fee: 23700000 },
  { player: 'Oliver Skipp', from: 'Tottenham', to: 'Leicester', fee: 23500000 },
  { player: 'Taylor Harwood-Bellis', from: 'Man City', to: 'Southampton', fee: 23000000 },
  { player: 'Omari Kellyman', from: 'Aston Villa U21', to: 'Chelsea', fee: 22500000 },
  { player: 'Cameron Archer', from: 'Aston Villa', to: 'Sheff Utd', fee: 21550000 },
  { player: 'Jacob Greaves', from: 'Hull City', to: 'Ipswich', fee: 21500000 },
  { player: 'Claudinho', from: 'Zenit S-Pb', to: 'Al-Sadd', fee: 20000000 },
  { player: 'Philippe Coutinho', from: 'Barcelona', to: 'Aston Villa', fee: 20000000 },
  { player: 'Flynn Downes', from: 'West Ham', to: 'Southampton', fee: 17850000 },
  { player: 'Jay Stansfield', from: 'Fulham', to: 'Birmingham', fee: 17800000 },
  { player: 'Jack Clarke', from: 'Sunderland', to: 'Ipswich', fee: 17700000 },
  { player: 'Cameron Archer', from: 'Aston Villa', to: 'Southampton', fee: 17600000 },
  { player: 'Gustavo Hamer', from: 'Coventry', to: 'Sheff Utd', fee: 17300000 },
  { player: 'Abdoul Koné', from: 'Stade Reims', to: 'Leipzig', fee: 17000000 },
  { player: 'Harry Souttar', from: 'Stoke City', to: 'Leicester', fee: 17000000 },
  { player: 'Cameron Archer', from: 'Sheff Utd', to: 'Aston Villa', fee: 16650000 },
  { player: 'Jaden Philogene', from: 'Hull City', to: 'Aston Villa', fee: 16000000 },
  { player: 'Deivid Washington', from: 'Santos', to: 'Chelsea', fee: 16000000 },
  { player: 'Azor Matusiwa', from: 'Stade Reims', to: 'Stade Rennais', fee: 15500000 },
  { player: 'Tuta', from: 'Frankfurt', to: 'Al-Duhail SC', fee: 15000000 },
  { player: 'Álvaro Djaló', from: 'Braga', to: 'Athletic Club', fee: 15000000 },
  { player: 'Gaëtan Laborde', from: 'Stade Rennais', to: 'OGC Nice', fee: 15000000 },
  { player: 'Mohamed Camara', from: 'RB Salzburg', to: 'Monaco', fee: 15000000 },
  { player: 'Caleb Okoli', from: 'Atalanta BC', to: 'Leicester', fee: 14000000 },
  { player: 'Mergim Berisha', from: 'Augsburg', to: 'Hoffenheim', fee: 14000000 },
  { player: 'Jordan Veretout', from: 'Roma', to: 'Marseille', fee: 12450000 },
  { player: 'Chuba Akpom', from: 'Middlesbrough', to: 'Ajax', fee: 12300000 },
  { player: 'Mohamed Daramy', from: 'Ajax', to: 'Stade Reims', fee: 12000000 },
  { player: 'Matteo Pessina', from: 'Atalanta', to: 'Monza', fee: 12000000 },
  { player: 'Danny Ings', from: 'Aston Villa', to: 'West Ham', fee: 12000000 },
  { player: 'Tom Cannon', from: 'Leicester', to: 'Sheff Utd', fee: 11850000 },
  { player: 'Harry Winks', from: 'Tottenham', to: 'Leicester', fee: 11600000 },
  { player: 'Azor Matusiwa', from: 'Stade Rennais', to: 'Ipswich', fee: 11500000 },
  { player: 'Jens Cajuste', from: 'Stade Reims', to: 'Napoli', fee: 11500000 },
  { player: 'Raúl de Tomás', from: 'Espanyol', to: 'Rayo Vallecano', fee: 11000000 },
  { player: 'Andrea Colpani', from: 'Atalanta', to: 'Monza', fee: 11000000 },
  { player: 'Flynn Downes', from: 'Swansea', to: 'West Ham', fee: 10650000 },
  { player: 'Luis Alberto', from: 'Lazio', to: 'Al-Duhail SC', fee: 10500000 },
  { player: 'Benjamin Bourigeaud', from: 'Stade Rennais', to: 'Al-Duhail SC', fee: 10000000 },
  { player: 'Lucas Stassin', from: 'KVC Westerlo', to: 'Saint-Étienne', fee: 10000000 },
  { player: 'Rafa Mujica', from: 'Arouca', to: 'Al-Sadd SC', fee: 10000000 },
  { player: 'Joseph Okumu', from: 'KAA Gent', to: 'Stade Reims', fee: 10000000 },
  { player: 'Jeffinho', from: 'Botafogo', to: 'Olympique Lyon', fee: 10000000 },
  { player: 'Andrea Petagna', from: 'Napoli', to: 'Monza', fee: 9700000 },
  { player: 'Perr Schuurs', from: 'Ajax', to: 'Torino', fee: 9400000 },
  { player: 'Lewis O\'Brien', from: 'Huddersfield', to: 'Nott\'m Forest', fee: 9400000 },
  { player: 'Ross Stewart', from: 'Sunderland', to: 'Southampton', fee: 9300000 },
  { player: 'Tom Cannon', from: 'Everton', to: 'Leicester', fee: 8800000 },
  { player: 'Conor Coady', from: 'Wolves', to: 'Leicester', fee: 8700000 },
  { player: 'Stipe Biuk', from: 'Hajduk Split', to: 'LAFC', fee: 8500000 },
  { player: 'Alphadjo Cissè', from: 'Hellas Verona', to: 'AC Milan', fee: 8000000 },
  { player: 'Rodri Sánchez', from: 'Real Betis', to: 'Al-Arabi SC', fee: 8000000 },
  { player: 'Gianluca Caprari', from: 'Hellas Verona', to: 'Monza', fee: 8000000 },
  { player: 'Samuel Edozie', from: 'Man City U21', to: 'Southampton', fee: 8000000 },
  { player: 'Antonín Barák', from: 'Hellas Verona', to: 'Fiorentina', fee: 7860000 },
  { player: 'André Amaro', from: 'Vit. Guimarães', to: 'Al-Rayyan SC', fee: 7750000 },
  { player: 'Ibrahima Koné', from: 'FC Lorient', to: 'UD Almería', fee: 7500000 },
  { player: 'Stephy Mavididi', from: 'Montpellier', to: 'Leicester', fee: 7500000 },
  { player: 'Bartol Franjic', from: 'Dinamo Zagreb', to: 'Wolfsburg', fee: 7500000 },
  { player: 'Julien De Sart', from: 'KAA Gent', to: 'Al-Rayyan', fee: 7000000 },
  { player: 'Juan Larios', from: 'Man City U21', to: 'Southampton', fee: 7000000 },
  { player: 'Kaiky', from: 'Santos', to: 'UD Almería', fee: 7000000 },
  { player: 'Matteo Lovato', from: 'Atalanta BC', to: 'Salernitana', fee: 7000000 },
  { player: 'Jonjo Shelvey', from: 'Newcastle', to: 'Nott\'m Forest', fee: 6500000 },
  { player: 'Pedro Malheiro', from: 'Trabzonspor', to: 'Al-Wasl', fee: 6130000 },
  { player: 'Chico Lamba', from: 'Arouca', to: 'Saint-Étienne', fee: 6000000 },
  { player: 'Cristo', from: 'Arouca', to: 'Al-Sadd', fee: 6000000 },
  { player: 'Krisztián Lisztes', from: 'Ferencváros', to: 'Frankfurt', fee: 6000000 },
  { player: 'Sergio Akieme', from: 'UD Almería', to: 'Stade Reims', fee: 6000000 },
  { player: 'Sergio Arribas', from: 'RM Castilla', to: 'UD Almería', fee: 6000000 },
  { player: 'Michael Golding', from: 'Chelsea U21', to: 'Leicester', fee: 5900000 },
  { player: 'Ryan Giles', from: 'Wolves', to: 'Luton', fee: 5850000 },
  { player: 'Jaden Philogene', from: 'Aston Villa', to: 'Hull City', fee: 5800000 },
  { player: 'Oriol Romeu', from: 'Southampton', to: 'Girona', fee: 5500000 },
  { player: 'Ryan Giles', from: 'Luton', to: 'Hull City', fee: 5300000 },
  { player: 'Ronnie Edwards', from: 'Southampton', to: 'QPR', fee: 5200000 },
  { player: 'Mory Gbane', from: 'Gil Vicente', to: 'Stade Reims', fee: 5000000 },
  { player: 'Joachim Kayi Sanda', from: 'Valenciennes FC', to: 'Southampton', fee: 5000000 },
  { player: 'Maik Nawrocki', from: 'Legia Warszawa', to: 'Celtic', fee: 5000000 },
  { player: 'Andy Delort', from: 'Nice', to: 'FC Nantes', fee: 5000000 },
  { player: 'Pablo Sarabia', from: 'PSG', to: 'Wolves', fee: 5000000 },
  { player: 'Gianluca Caprari', from: 'Sampdoria', to: 'Hellas Verona', fee: 5000000 },
  { player: 'Davide Bettella', from: 'Atalanta', to: 'Monza', fee: 5000000 },
  { player: 'Vladan Kovacevic', from: 'Raków', to: 'Sporting', fee: 4810000 },
  { player: 'Milos Lukovic', from: 'IMT Belgrad', to: 'R. Strasbourg', fee: 4700000 },
  { player: 'Luke Woolfenden', from: 'Ipswich', to: 'Coventry', fee: 4600000 },
  { player: 'Javairô Dilrosun', from: 'Feyenoord', to: 'América', fee: 4600000 },
  { player: 'Pietro Pellegri', from: 'Monaco', to: 'Torino', fee: 4200000 },
  { player: 'Christoph Klarer', from: 'Darmstadt 98', to: 'Birmingham', fee: 4150000 },
  { player: 'Jesper Daland', from: 'Cercle Brugge', to: 'Cardiff', fee: 4100000 },
  { player: 'Ben Davies', from: 'Liverpool', to: 'Rangers', fee: 4100000 },
  { player: 'Thiago Helguera', from: 'Nacional', to: 'Braga', fee: 4030000 },
  { player: 'Mathias Jørgensen', from: 'Bodø/Glimt', to: 'Blackburn', fee: 4000000 },
  { player: 'Jean-Charles Castelletto', from: 'FC Nantes', to: 'Al-Duhail SC', fee: 4000000 },
  { player: 'Daniel Fila', from: 'Slavia Praha', to: 'Venezia', fee: 4000000 },
  { player: 'Jordan Veretout', from: 'Marseille', to: 'Lyon', fee: 4000000 },
  { player: 'Erencan Yardımcı', from: 'Eyüpspor', to: 'Hoffenheim', fee: 4000000 },
  { player: 'Nicolas Madsen', from: 'KVC Westerlo', to: 'QPR', fee: 4000000 },
  { player: 'Stipe Biuk', from: 'LAFC', to: 'Real Valladolid', fee: 4000000 },
  { player: 'Million Manhoef', from: 'Vitesse', to: 'Stoke City', fee: 4000000 },
  { player: 'Hendry Blank', from: 'B. Dortmund II', to: 'RB Salzburg', fee: 4000000 },
  { player: 'Kristijan Belic', from: 'Partizan', to: 'AZ Alkmaar', fee: 4000000 },
  { player: 'Kevin Volland', from: 'Monaco', to: 'Union Berlin', fee: 4000000 },
  { player: 'Mergim Berisha', from: 'Fenerbahçe', to: 'Augsburg', fee: 4000000 },
  { player: 'Benson Manuel', from: 'Royal Antwerp', to: 'Burnley', fee: 4000000 },
  { player: 'Rareș Ilie', from: 'FC Rapid 1923', to: 'Nice', fee: 4000000 },
  { player: 'Toby Alderweireld', from: 'Al-Duhail SC', to: 'Royal Antwerp', fee: 4000000 },
  { player: 'Javairô Dilrosun', from: 'Hertha BSC', to: 'Feyenoord', fee: 4000000 },
  { player: 'Francesco Caputo', from: 'Sassuolo', to: 'Sampdoria', fee: 4000000 },
  { player: 'Filippo Melegoni', from: 'Atalanta BC', to: 'Genoa', fee: 4000000 },
  { player: 'Andrea Carboni', from: 'Cagliari', to: 'Monza', fee: 4000000 },
  { player: 'Filippo Ranocchia', from: 'Juventus', to: 'Palermo', fee: 3880000 },
  { player: 'Emil Bohinen', from: 'CSKA Moscow', to: 'Salernitana', fee: 3850000 },
  { player: 'Craig Dawson', from: 'West Ham', to: 'Wolves', fee: 3750000 },
  { player: 'Alessio Cragno', from: 'Cagliari Calcio', to: 'Monza', fee: 3600000 },
  { player: 'Adryelson', from: 'Botafogo', to: 'Lyon', fee: 3580000 },
  { player: 'Mathias Jørgensen', from: 'Aalborg BK', to: 'Bodø/Glimt', fee: 3500000 },
  { player: 'Lewis O\'Brien', from: 'Nott\'m Forest', to: 'Wrexham', fee: 3500000 },
  { player: 'Nathan Wood', from: 'Swansea', to: 'Southampton', fee: 3500000 },
  { player: 'Ronnie Edwards', from: 'Peterborough', to: 'Southampton', fee: 3500000 },
  { player: 'Moussa Djenepo', from: 'Southampton', to: 'Standard Liège', fee: 3500000 },
  { player: 'Mads Andersen', from: 'Barnsley FC', to: 'Luton', fee: 3500000 },
  { player: 'Maximiliano Caufriez', from: 'Spartak Moscow', to: 'Clermont Foot', fee: 3500000 },
  { player: 'Giulio Maggiore', from: 'Spezia Calcio', to: 'Salernitana', fee: 3500000 },
  { player: 'Fredrik Midtsjø', from: 'AZ Alkmaar', to: 'Galatasaray', fee: 3500000 },
  { player: 'Oriol Romeu', from: 'Girona', to: 'Barcelona', fee: 3400000 },
  { player: 'Szymon Żurkowski', from: 'Fiorentina', to: 'Spezia Calcio', fee: 3380000 },
  { player: 'Mikael', from: 'Sport Recife', to: 'Salernitana', fee: 3280000 },
  { player: 'João Ferreira', from: 'Watford', to: 'Saint-Étienne', fee: 3000000 },
  { player: 'Igor Miladinovic', from: 'Cukaricki', to: 'Saint-Étienne', fee: 3000000 },
  { player: 'Matías Arezo', from: 'Granada CF', to: 'Grêmio', fee: 3000000 },
  { player: 'Augustine Boakye', from: 'Wolfsberger AC', to: 'Saint-Étienne', fee: 3000000 },
  { player: 'Víctor Meseguer', from: 'Granada CF', to: 'Real Valladolid', fee: 3000000 },
  { player: 'Fredrik Midtsjø', from: 'Galatasaray', to: 'Pendikspor ', fee: 3000000 },
  { player: 'Paul Akouokou', from: 'Real Betis', to: 'Olympique Lyon', fee: 3000000 },
  { player: 'Marco Richter', from: 'Hertha BSC', to: 'Mainz', fee: 3000000 },
  { player: 'Mathias Normann', from: 'Rostov', to: 'Al-Raed', fee: 3000000 },
  { player: 'Saïdou Sow', from: 'Saint-Étienne', to: 'R. Strasbourg', fee: 3000000 },
  { player: 'Jakov Medic', from: 'St. Pauli', to: 'Ajax', fee: 3000000 },
  { player: 'Makhtar Gueye', from: 'KV Oostende', to: 'RWDM', fee: 3000000 },
  { player: 'Carlos Dotor', from: 'RM Castilla', to: 'Celta de Vigo', fee: 3000000 },
  { player: 'Armando Izzo', from: 'Torino', to: 'Monza', fee: 3000000 },
  { player: 'Aliou Badji', from: 'Amiens SC', to: 'G. Bordeaux', fee: 3000000 },
  { player: 'Ibrahim Cissoko', from: 'NEC Nijmegen', to: 'Toulouse', fee: 3000000 },
  { player: 'Maxi Gómez', from: 'Valencia', to: 'Trabzonspor', fee: 3000000 },
  { player: 'Vivaldo Semedo', from: 'Sporting U17', to: 'Udinese U19', fee: 3000000 },
  { player: 'Roger Martí', from: 'Levante', to: 'Elche CF', fee: 3000000 },
  { player: 'Sérgio Oliveira', from: 'FC Porto', to: 'Galatasaray', fee: 3000000 },
  { player: 'Jean-Eudes Aholou', from: 'Monaco', to: 'R. Strasbourg', fee: 3000000 },
  { player: 'Andreaw Gravillon', from: 'Inter', to: 'Stade Reims', fee: 3000000 },
  { player: 'Mamadou Coulibaly', from: 'Udinese Calcio', to: 'Salernitana', fee: 3000000 },
  { player: 'Gui Guedes', from: 'Vit. Guimarães', to: 'UD Almería', fee: 3000000 },
  { player: 'Jacob Brown', from: 'Stoke City', to: 'Luton', fee: 2900000 },
  { player: 'Thomas Kaminski', from: 'Blackburn', to: 'Luton', fee: 2900000 },
  { player: 'Marvelous Nakamba', from: 'Aston Villa', to: 'Luton', fee: 2900000 },
  { player: 'Scott Twine', from: 'MK Dons', to: 'Burnley', fee: 2900000 },
  { player: 'Luca Pfeiffer', from: 'FC Midtjylland', to: 'VfB Stuttgart', fee: 2850000 },
  { player: 'Assan Ceesay', from: 'Lecce', to: 'Damac FC', fee: 2800000 },
  { player: 'Kristoffer Olsson', from: 'RSC Anderlecht', to: 'FC Midtjylland', fee: 2800000 },
  { player: 'José Gragera', from: 'Sporting Gijón', to: 'Espanyol', fee: 2800000 },
  { player: 'Jacob Wright', from: 'Man City U21', to: 'Norwich', fee: 2700000 },
  { player: 'Lucas Stassin', from: 'RSCA Futures', to: 'KVC Westerlo', fee: 2700000 },
  { player: 'Alessandro Florenzi', from: 'AS Roma', to: 'AC Milan', fee: 2650000 },
  { player: 'Mario Balotelli', from: 'Adana Demirspor', to: 'FC Sion', fee: 2620000 },
  { player: 'Pedro Malheiro', from: 'Boavista', to: 'Trabzonspor', fee: 2610000 },
  { player: 'Alexis Tibidi', from: 'VfB Stuttgart', to: 'Troyes', fee: 2600000 },
  { player: 'Oliver Abildgaard', from: 'Como', to: 'Sampdoria', fee: 2500000 },
  { player: 'Vladan Kovacevic', from: 'Sporting', to: 'Norwich', fee: 2500000 },
  { player: 'Stéphano Carrillo', from: 'Santos U23', to: 'Feyenoord', fee: 2500000 },
  { player: 'Ayanda Sishuba', from: 'Lens', to: 'Hellas Verona', fee: 2500000 },
  { player: 'Oscar Schwartau', from: 'Bröndby IF', to: 'Norwich', fee: 2500000 },
  { player: 'Juanmi Latasa', from: 'Real Madrid', to: 'Real Valladolid', fee: 2500000 },
  { player: 'David Ankeye', from: 'FC Sheriff', to: 'Genoa', fee: 2500000 },
  { player: 'Saviour Godwin', from: 'Casa Pia', to: 'Al-Okhdood', fee: 2500000 },
  { player: 'Rominigue Kouamé', from: 'Troyes', to: 'Cádiz CF', fee: 2500000 },
  { player: 'João Basso', from: 'Arouca', to: 'Santos', fee: 2500000 },
  { player: 'Andreaw Gravillon', from: 'Stade Reims', to: 'Adana Demirspor', fee: 2500000 },
  { player: 'Andy Delort', from: 'FC Nantes', to: 'Umm Salal SC', fee: 2500000 },
  { player: 'Mattia Aramu', from: 'Venezia', to: 'Genoa', fee: 2500000 },
  { player: 'Gonzalo Escalante', from: 'Lazio', to: 'Cádiz CF', fee: 2500000 },
  { player: 'Tim Breithaupt', from: 'Karlsruher SC', to: 'Augsburg', fee: 2500000 },
  { player: 'João Ferreira', from: 'Benfica B', to: 'Watford', fee: 2500000 },
  { player: 'Anwar El Ghazi', from: 'Aston Villa', to: 'PSV Eindhoven', fee: 2500000 },
  { player: 'Víctor Méndez', from: 'Union Española', to: 'CSKA Moscow', fee: 2500000 },
  { player: 'Léo Dubois', from: 'Lyon', to: 'Galatasaray', fee: 2500000 },
  { player: 'Mickaël Biron', from: 'KV Oostende', to: 'RWDM', fee: 2500000 },
  { player: 'Diego Valencia', from: 'U. Católica', to: 'Salernitana', fee: 2500000 },
  { player: 'Tommaso Augello', from: 'Sampdoria', to: 'Cagliari', fee: 2400000 },
  { player: 'David Turnbull', from: 'Celtic', to: 'Cardiff', fee: 2330000 },
  { player: 'Conor Coady', from: 'Leicester', to: 'Wrexham', fee: 2300000 },
  { player: 'Omar Colley', from: 'Sampdoria', to: 'Besiktas', fee: 2300000 },
  { player: 'Felipe', from: 'Atlético Madrid', to: 'Nottm Forest', fee: 2300000 },
  { player: 'Eden Karzev', from: 'Maccabi Netanya', to: 'Basaksehir', fee: 2300000 },
  { player: 'Josh Bowler', from: 'Blackpool', to: 'Nott\'m Forest', fee: 2300000 },
  { player: 'Adryelson', from: 'Lyon', to: 'Al-Wasl', fee: 2200000 },
  { player: 'Stiven Shpendi', from: 'Cesena', to: 'FC Empoli', fee: 2200000 },
  { player: 'Ben Lhassine Kone', from: 'Torino', to: 'Como', fee: 2150000 },
  { player: 'Gonçalo Franco', from: 'Moreirense ', to: 'Swansea', fee: 2100000 },
  // Traspasos reales de clubes latinoamericanos (Brasil/Argentina/Uruguay/Colombia), extraídos del
  // mismo transfers.json -- para que "Fichajes al Día" también narre movimientos del mercado sudamericano,
  // no solo europeo.
  { player: 'Deivid Washington', from: 'Santos', to: 'Chelsea', fee: 16000000 },
  { player: 'Jeffinho', from: 'Botafogo', to: 'Olympique Lyon', fee: 10000000 },
  { player: 'Kaiky', from: 'Santos', to: 'UD Almería', fee: 7000000 },
  { player: 'Thiago Helguera', from: 'Nacional', to: 'Braga', fee: 4030000 },
  { player: 'Adryelson', from: 'Botafogo', to: 'Lyon', fee: 3580000 },
  { player: 'Matías Arezo', from: 'Granada CF', to: 'Grêmio', fee: 3000000 },
  { player: 'Stéphano Carrillo', from: 'Santos U23', to: 'Feyenoord', fee: 2500000 },
  { player: 'João Basso', from: 'Arouca', to: 'Santos', fee: 2500000 },
  { player: 'Justin Cuero', from: 'Independiente', to: 'Orenburg', fee: 2000000 },
  { player: 'Zanocelo', from: 'Ferroviária', to: 'Santos', fee: 2000000 },
  { player: 'Nathan', from: 'Boavista', to: 'Santos', fee: 2000000 },
  { player: 'Vinícius', from: 'Palmeiras', to: 'Portimonense', fee: 1500000 },
  { player: 'Leo Baptistao', from: 'Santos', to: 'UD Almería', fee: 1500000 },
  { player: 'Matías Segovia', from: 'Guaraní', to: 'Botafogo', fee: 1400000 },
  { player: 'Rildo', from: 'Grêmio', to: 'Santa Clara', fee: 1250000 },
  { player: 'Facundo Batista', from: 'Polissya', to: 'Atl. Nacional', fee: 1200000 },
  { player: 'Matías Pérez', from: 'Lanús', to: 'Orenburg', fee: 1000000 },
  { player: 'Joaquín Sosa', from: 'Nacional', to: 'Bologna', fee: 950000 },
  { player: 'Carlos Alberto', from: 'América-MG', to: 'Botafogo', fee: 932000 },
  { player: 'Blas Riveros', from: 'Brøndby IF', to: 'CA Talleres', fee: 834000 },
  { player: 'Pablo Galdames', from: 'Genoa', to: 'Vasco da Gama', fee: 800000 },
];

// Fase 5 -- Estadísticas de jugadores por liga (pestaña Tablas → Estadísticas). Para las ligas
// donde hay dato real disponible (7 grandes europeas extraídas de Transfermarkt appearances.csv
// temporada 25/26, y 8 ligas latinoamericanas curadas a mano con fuentes de julio 2026), mostramos
// goleador/asistidor/arquero-menos-vencido/tarjetas REALES en vez de inventar números. El resto de
// las ~24 ligas del juego (sin cobertura real disponible) generan sus líderes de forma
// determinística a partir del gf/gc real de cada club en la tabla -- ver
// generateLeagueLeadersFromTable en leagueEngine.ts.
export interface LeagueLeaderEntry {
  name: string;
  clubName: string;
  value: number;
}
export interface LeagueLeaders {
  topScorer: LeagueLeaderEntry | null;
  topAssist: LeagueLeaderEntry | null;
  topGoalkeeper: { name: string; clubName: string } | null; // portería menos vencida -- sin cifra propia, se calcula con gc/pj del club real
  topYellow: LeagueLeaderEntry | null;
  topRed: LeagueLeaderEntry | null;
}

export const REAL_LEAGUE_LEADERS: Record<string, LeagueLeaders> = {
  // --- Europa (extraído de Transfermarkt appearances.csv, temporada 2025/26) ---
  'Española': {
    topScorer: { name: 'Kylian Mbappé', clubName: 'Real Madrid', value: 25 },
    topAssist: { name: 'Lamine Yamal', clubName: 'FC Barcelona', value: 12 },
    topGoalkeeper: null,
    topYellow: { name: 'José Ángel Carmona', clubName: 'Sevilla FC', value: 13 },
    topRed: null,
  },
  'Inglesa': {
    topScorer: { name: 'Erling Haaland', clubName: 'Manchester City', value: 27 },
    topAssist: { name: 'Bruno Fernandes', clubName: 'Manchester United', value: 21 },
    topGoalkeeper: null,
    topYellow: { name: 'André', clubName: 'Wolverhampton Wanderers', value: 12 },
    topRed: null,
  },
  'Alemana': {
    topScorer: { name: 'Harry Kane', clubName: 'Bayern Múnich', value: 36 },
    topAssist: { name: 'Michael Olise', clubName: 'Bayern Múnich', value: 21 },
    topGoalkeeper: null,
    topYellow: { name: 'Nicolai Remberg', clubName: 'Hamburger SV', value: 11 },
    topRed: null,
  },
  'Italiana': {
    topScorer: { name: 'Lautaro Martínez', clubName: 'Inter', value: 17 },
    topAssist: { name: 'Federico Dimarco', clubName: 'Inter', value: 18 },
    topGoalkeeper: null,
    topYellow: { name: 'Marin Pongracic', clubName: 'ACF Fiorentina', value: 12 },
    topRed: null,
  },
  'Francesa': {
    topScorer: { name: 'Estéban Lepaul', clubName: 'Stade Rennais FC', value: 21 },
    topAssist: { name: 'Adrien Thomasson', clubName: 'RC Lens', value: 10 },
    topGoalkeeper: null,
    topYellow: { name: 'Adrien Thomasson', clubName: 'RC Lens', value: 11 },
    topRed: null,
  },
  'Portuguesa': {
    topScorer: { name: 'Luis Suárez', clubName: 'Sporting CP', value: 28 },
    topAssist: { name: 'Francisco Trincão', clubName: 'Sporting CP', value: 13 },
    topGoalkeeper: null,
    topYellow: { name: 'David Sousa', clubName: 'Casa Pia AC', value: 13 },
    topRed: null,
  },
  'Holandesa': {
    topScorer: { name: 'Ayase Ueda', clubName: 'Feyenoord', value: 25 },
    topAssist: { name: 'Joey Veerman', clubName: 'PSV Eindhoven', value: 14 },
    topGoalkeeper: null,
    topYellow: { name: 'Philip Brittijn', clubName: 'Fortuna Sittard', value: 10 },
    topRed: null,
  },
  // --- Latinoamérica (curado con fuentes de julio 2026) ---
  'Colombiana': {
    topScorer: { name: 'Luis Muriel', clubName: 'Junior', value: 13 },
    topAssist: { name: 'Omar Fernández', clubName: '', value: 8 },
    topGoalkeeper: { name: 'Santiago Mele', clubName: 'Junior' },
    topYellow: { name: 'Fabián Sambueza', clubName: 'Atlético Bucaramanga', value: 8 },
    topRed: { name: 'Jermein Peña', clubName: 'Junior', value: 2 },
  },
  'Mexicana': {
    topScorer: { name: 'Joao Pedro', clubName: 'Atlético de San Luis', value: 14 },
    topAssist: { name: 'Juan Brunetta', clubName: 'Tigres UANL', value: 7 },
    topGoalkeeper: { name: 'Raúl Rangel', clubName: 'Chivas' },
    topYellow: { name: 'Guido Pizarro', clubName: 'Tigres', value: 7 },
    topRed: { name: 'Christian Rivera', clubName: 'Tijuana', value: 2 },
  },
  'Argentina': {
    topScorer: { name: 'Gabriel Ávalos', clubName: 'Independiente', value: 11 },
    topAssist: { name: 'David Romero', clubName: 'Tigre', value: 2 },
    topGoalkeeper: { name: 'Jorge Broun', clubName: 'Rosario Central' },
    topYellow: { name: 'Cristian Lema', clubName: 'Boca Juniors', value: 6 },
    topRed: { name: 'Cristian Lema', clubName: 'Boca Juniors', value: 1 },
  },
  'Brasileña': {
    topScorer: { name: 'Kevin Viveros', clubName: 'Athletico Paranaense', value: 11 },
    topAssist: { name: 'Pedro', clubName: 'Flamengo', value: 4 },
    topGoalkeeper: { name: 'Ronaldo', clubName: 'Bahia' },
    topYellow: null,
    topRed: null,
  },
  'Chilena': {
    topScorer: { name: 'Fernando Zampedri', clubName: 'Universidad Católica', value: 15 },
    topAssist: { name: 'Jean Meneses', clubName: 'Deportes Limache', value: 8 },
    topGoalkeeper: null,
    topYellow: null,
    topRed: null,
  },
  'Peruana': {
    topScorer: { name: 'Martín Cauteruccio', clubName: 'Sporting Cristal', value: 16 },
    topAssist: { name: 'Alejandro Hohberg', clubName: 'Cienciano', value: 5 },
    topGoalkeeper: null,
    topYellow: null,
    topRed: null,
  },
  'Ecuatoriana': {
    topScorer: { name: 'Mauro Díaz', clubName: 'Universidad Católica', value: 17 },
    topAssist: { name: 'Mauro Díaz', clubName: 'Universidad Católica', value: 9 },
    topGoalkeeper: null,
    topYellow: null,
    topRed: null,
  },
  'Uruguaya': {
    topScorer: { name: 'Álvaro López', clubName: 'Albion FC', value: 11 },
    topAssist: null,
    topGoalkeeper: null,
    topYellow: null,
    topRed: null,
  },
};

export const NATIONALITY_TO_WORLD_CUP_TEAM_ID: Record<string, string> = Object.fromEntries(
  WORLD_CUP_2026_TEAMS_SEED.filter(t => t.league).map(t => [t.league as string, t.id])
);