// Ranking mundial de jugadores: compara al jugador contra un pool de estrellas REALES del fútbol
// mundial (Balón de Oro 2025, FIFA The Best 2025, IFFHS World's Best Player 2025 -- las tres
// coinciden en el mismo núcleo de nombres), no contra starPlayers de clubes del juego.
//
// Antes esto tomaba los starPlayers de cualquier club con reputation >= 4 y les inventaba un score
// 70-97 por hash de nombre -- resultado: jugadores de nivel doméstico (ej. un suplente de un club
// colombiano) terminaban con puntajes de nivel Balón de Oro, y ninguno de los nombres reales del
// pool era realmente "el mejor del mundo". Reportado: "estos datos no son ciertos, ni en el juego
// ni en la realidad".
import { PlayerProfile } from './types';
import { anioDeCarrera } from './dateSchedule';
import { CLUBS_DATABASE } from './data';

export interface WorldRankingEntry {
  name: string;
  clubName: string;
  score: number;
  isPlayer: boolean;
}

/** Hash estable de un string -> entero positivo. Mismo criterio que worldRetirements.ts. */
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Los ~30 mejores jugadores del mundo reales, según el consenso entre Balón de Oro 2025, FIFA The
 * Best 2025 e IFFHS World's Best Player 2025 (las tres listas comparten el mismo núcleo de
 * nombres). El score base refleja ese consenso: Tier S 96-99, Tier A 91-95, Tier B 86-90,
 * Tier C 80-85, veteranos fuera de las top 5 ligas 75-79.
 */
const ELITE_WORLD_POOL: { name: string; clubName: string; baseScore: number; nacio: number }[] = [
  // Tier S
  { name: 'Ousmane Dembélé', clubName: 'PSG', baseScore: 99, nacio: 1997 },
  { name: 'Lamine Yamal', clubName: 'Barcelona', baseScore: 98, nacio: 2007 },
  { name: 'Vitinha', clubName: 'PSG', baseScore: 96, nacio: 2000 },
  { name: 'Kylian Mbappé', clubName: 'Real Madrid', baseScore: 97, nacio: 1998 },
  { name: 'Mohamed Salah', clubName: 'Liverpool', baseScore: 96, nacio: 1992 },
  // Tier A
  { name: 'Raphinha', clubName: 'Barcelona', baseScore: 94, nacio: 1996 },
  { name: 'Achraf Hakimi', clubName: 'PSG', baseScore: 93, nacio: 1998 },
  { name: 'Cole Palmer', clubName: 'Chelsea', baseScore: 92, nacio: 2002 },
  { name: 'Gianluigi Donnarumma', clubName: 'Manchester City', baseScore: 92, nacio: 1999 },
  { name: 'Harry Kane', clubName: 'Bayern Munich', baseScore: 94, nacio: 1993 },
  { name: 'Pedri', clubName: 'Barcelona', baseScore: 93, nacio: 2002 },
  { name: 'Erling Haaland', clubName: 'Manchester City', baseScore: 95, nacio: 2000 },
  { name: 'Vinícius Jr.', clubName: 'Real Madrid', baseScore: 93, nacio: 2000 },
  // Tier B
  { name: 'Nuno Mendes', clubName: 'PSG', baseScore: 89, nacio: 2002 },
  { name: 'Khvicha Kvaratskhelia', clubName: 'PSG', baseScore: 90, nacio: 2001 },
  { name: 'Désiré Doué', clubName: 'PSG', baseScore: 89, nacio: 2005 },
  { name: 'Viktor Gyökeres', clubName: 'Sporting CP', baseScore: 88, nacio: 1998 },
  { name: 'Scott McTominay', clubName: 'Napoli', baseScore: 87, nacio: 1996 },
  { name: 'João Neves', clubName: 'PSG', baseScore: 88, nacio: 2004 },
  { name: 'Lautaro Martínez', clubName: 'Inter de Milán', baseScore: 89, nacio: 1997 },
  { name: 'Jude Bellingham', clubName: 'Real Madrid', baseScore: 90, nacio: 2003 },
  { name: 'Florian Wirtz', clubName: 'Bayer Leverkusen', baseScore: 88, nacio: 2003 },
  { name: 'Bruno Guimarães', clubName: 'Newcastle', baseScore: 87, nacio: 1997 },
  { name: 'Trent Alexander-Arnold', clubName: 'Real Madrid', baseScore: 88, nacio: 1998 },
  { name: 'Virgil van Dijk', clubName: 'Liverpool', baseScore: 89, nacio: 1991 },
  { name: 'Declan Rice', clubName: 'Arsenal', baseScore: 88, nacio: 1999 },
  // Tier C
  { name: 'Serhou Guirassy', clubName: 'Borussia Dortmund', baseScore: 84, nacio: 1996 },
  { name: 'Alexis Mac Allister', clubName: 'Liverpool', baseScore: 85, nacio: 1998 },
  { name: 'Fabián Ruiz', clubName: 'PSG', baseScore: 84, nacio: 1996 },
  { name: 'Denzel Dumfries', clubName: 'Inter de Milán', baseScore: 83, nacio: 1996 },
  { name: 'Michael Olise', clubName: 'Bayern Munich', baseScore: 85, nacio: 2001 },
  { name: 'Aurélien Tchouaméni', clubName: 'Real Madrid', baseScore: 84, nacio: 2000 },
  { name: 'Jan Oblak', clubName: 'Atlético Madrid', baseScore: 83, nacio: 1993 },
  { name: 'Christian Pulisic', clubName: 'AC Milan', baseScore: 82, nacio: 1998 },
  // Veteranos icónicos, fuera de las top 5 ligas europeas
  { name: 'Lionel Messi', clubName: 'Inter Miami', baseScore: 79, nacio: 1987 },
  { name: 'Robert Lewandowski', clubName: 'Chicago Fire', baseScore: 77, nacio: 1988 },
];

// Variación semanal leve (±2) para que el ranking respire sin depender de Math.random() puro ni
// desviarse del consenso real -- mismo criterio de estabilidad que worldRetirements.ts.
function weeklyDrift(name: string, week: number): number {
  // CADA FECHA, no cada cuatro. Antes el paso era `week / 4`, asi que el ranking quedaba congelado
  // tres fechas de cada cuatro y no se veia la carrera: mirabas la lista dos partidos seguidos y era
  // identica. Pedido: "que funcione como la tabla de goleadores, que cada fecha se vean cambios".
  //
  // El movimiento es de +-4 y no de +-2, tambien a proposito: con dos puntos de recorrido los
  // empates de la parte alta -- que estan a uno o dos puntos entre si -- casi nunca se daban vuelta.
  // Con cuatro, el podio cambia de manos varias veces por temporada, que es lo que hace que valga la
  // pena mirarlo.
  //
  // Sigue saliendo de un hash y no de un azar puro: tiene que ser ESTABLE. Si fuera aleatorio, el
  // ranking se reordenaria solo con abrir la pantalla dos veces, sin jugar nada.
  const paso = (hashName(`${name}_${week}`) % 9) - 4;
  // Media temporada de inercia: se mezcla con la fecha anterior para que un jugador no salte del
  // primer puesto al octavo de un partido al otro. Sube y baja, pero con una curva.
  const anterior = (hashName(`${name}_${Math.max(0, week - 1)}`) % 9) - 4;
  return Math.round((paso * 2 + anterior) / 3);
}

/**
 * Score del jugador del usuario, en la MISMA escala 0-100 que el pool real de arriba. La franja
 * alta (90+) tiene que ser un techo casi inalcanzable en una carrera normal, igual que en la
 * realidad: un promedio de calificación sostenido cerca del máximo del juego, muchos títulos y
 * prestigio alto a la vez, no una sola de esas cosas.
 *
 * Antes esto era `prestige*0.4 + contribución*60 + títulos*5` sin techo real: un jugador con buen
 * prestigio y pocos partidos ya arañaba los 90 sin haber demostrado nada a nivel de carrera.
 */
/**
 * Cuanto pesa la vidriera donde jugas. Las cinco grandes de Europa valen el maximo; el resto de
 * Europa y Brasil quedan cerca; las demas ligas sudamericanas y la MLS, mas abajo.
 *
 * Sale de `clubHistory` y no del club actual: el Balon de Oro mira la TEMPORADA, y si te fuiste a
 * mitad de ano el escaparate del que venis todavia cuenta.
 */
function pesoDeLaLiga(liga: string): number {
  if (/Inglesa|Española|Italiana|Alemana|Francesa/i.test(liga)) return 1.00;
  if (/Holandesa|Portuguesa|Brasileña/i.test(liga)) return 0.92;
  if (/Argentina|Colombiana|Mexicana|Chilena|Uruguaya|Estadounidense/i.test(liga)) return 0.85;
  return 0.88;
}

function playerScore(profile: PlayerProfile, liga: string): number {
  const partidos = profile.careerStats.partidosHistoricos;
  if (partidos < 20) return 0; // sin muestra suficiente, no compite con el pool real todavía

  // Las tres dimensiones se recortaban en 1.0 y eso hacia el Balon de Oro IMPOSIBLE fuera de las
  // cinco grandes: con todo al tope el compuesto valia exactamente 1, asi que en Colombia el score
  // quedaba clavado en 65 + 1 * 0.85 * 34 = 94 y el pool de cracks llega a 96. Medido en una carrera
  // completa: 1464 partidos, 1231 goles, 1060 asistencias, 13 titulos y nota media 8.86 -- y termino
  // QUINTO, con 25 galas y cero ganadas. No era dificil, era imposible, y contradecia al comentario
  // del escaparate de aca abajo ("se puede llegar arriba desde Sudamerica, pero hay que rendir
  // bastante mas"): recortando en 1.0, rendir mas no servia de nada.
  //
  // Ahora cada dimension puede pasarse de 1, hasta EXCEPCIONAL. Sigue habiendo techo -- ninguna se
  // dispara sola -- pero una carrera desmedida compensa el peso de la liga, que es justo lo que
  // hicieron los que ganaron el premio jugando fuera de Europa.
  const EXCEPCIONAL = 1.25;
  const nivel = (x: number) => Math.max(0, Math.min(EXCEPCIONAL, x));

  // Promedio de calificación de partido, normalizado: 6.0 es un partido gris, 8.5+ es un nivel de
  // elite mundial sostenido.
  const promedioCalificacion = profile.careerStats.sumaCalificacionesHistoricas / partidos;
  const nivelRendimiento = nivel((promedioCalificacion - 6.0) / 2.5);

  const contribucionPorPartido = (profile.careerStats.golesHistoricos + profile.careerStats.asistenciasHistoricos) / partidos;
  const nivelContribucion = nivel(contribucionPorPartido / 1.0); // 1 gol+asist/partido = la referencia

  const nivelTitulos = nivel(profile.careerStats.campeonatos / 8); // 8 títulos = la referencia

  // Rendimiento sostenido pesa más que contribución bruta o títulos sueltos: un defensor o
  // arquero de elite real no mete goles pero sí sostiene una calificación altísima.
  const compuesto = nivelRendimiento * 0.55 + nivelContribucion * 0.25 + nivelTitulos * 0.20;

  // EL ESCAPARATE IMPORTA. Es la parte incomoda del Balon de Oro y es real: el premio lo gana casi
  // siempre quien se destaca en las cinco grandes ligas europeas, en la Champions o en el Mundial.
  // Un delantero que hace 40 goles en Colombia no compite de igual a igual con uno que hace 25 en
  // la Premier, y modelarlo al reves haria que el ranking se sienta falso.
  //
  // No es un tope: es un multiplicador. Se puede llegar arriba desde Sudamerica, pero hay que
  // rendir bastante mas -- que es exactamente lo que le paso a los que lo lograron de verdad.
  const compuestoConEscaparate = compuesto * pesoDeLaLiga(liga);

  // 65 es un jugador consolidado de primer nivel doméstico; 99 es el techo, y solo lo roza una
  // carrera de elite sostenida en las tres dimensiones a la vez.
  return Math.min(99, Math.round(65 + compuestoConEscaparate * 34));
}

/**
 * LOS CRACKS ENVEJECEN. Sin esto el ranking -- y con él el Balón de Oro -- quedaba congelado en 2025
 * para siempre.
 *
 * Medido jugando cuatro galas seguidas: Dembélé en 2026, Dembélé en 2027, Vitinha en 2028 y Dembélé
 * otra vez en 2029. En una carrera de quince años seguiría ganándolo a los 38, y el jugador nunca
 * vería llegar a su propia generación. El pool son 37 futbolistas REALES con su nivel de 2025; lo
 * único que faltaba era que pasara el tiempo.
 *
 * La curva es sencilla a propósito -- nadie está simulando la carrera de Mbappé --, pero hace las
 * dos cosas que importan: el que hoy tiene 18 mejora unos años, y el que pasa los 30 se apaga hasta
 * salir de la conversación.
 */
const PICO = 25;
const EMPIEZA_A_CAER = 30;
const SE_RETIRA = 38;

function porLaEdad(baseScore: number, nacio: number, anio: number): number | null {
  const edad = anio - nacio;
  if (edad >= SE_RETIRA) return null;                       // colgó los botines: sale del ranking
  if (edad > EMPIEZA_A_CAER) return baseScore - (edad - EMPIEZA_A_CAER) * 2.5;
  if (edad < PICO) return baseScore + Math.min(6, (PICO - edad) * 0.8);   // todavía creciendo
  return baseScore;
}

/** Cuántos nombres tiene que tener el ranking para que siga siendo "los mejores del mundo". */
const TAMANO_DEL_RANKING = 30;

/**
 * EL RELEVO GENERACIONAL.
 *
 * Los 37 del pool son futbolistas reales y se van retirando con los años (ver porLaEdad). Sin
 * reemplazo, a los quince años de carrera el ranking mundial tenía quince nombres y era una lista
 * de veteranos en decadencia: el jugador llegaba a lo más alto del fútbol y ahí no había nadie.
 *
 * LOS QUE ENTRAN SON INVENTADOS, y tiene que ser así. La tentación era tomarlos de los planteles de
 * los clubes de élite, pero `starPlayers` es una foto de 2025: en 2040 el "mejor del mundo" habría
 * sido Eric Dier, que para entonces hace años que colgó los botines. Un nombre nuevo es honesto --
 * es la generación que llegó mientras vos jugabas -- y un nombre real fuera de época es un error de
 * datos con cara de bug.
 *
 * Nacen ACOTADOS entre 84 y 96: son cracks de verdad y el mejor de una camada puede pelearle el
 * primer puesto a un veterano en decadencia, pero ninguno aparece de la nada valiendo 99.
 */
const NOMBRES_DE_LA_CAMADA = [
  'Mateo', 'Lucas', 'Enzo', 'Thiago', 'Youssef', 'Rafael', 'Nicolás', 'Ibrahim', 'Tomás', 'Kylian',
  'Diego', 'Amadou', 'Gabriel', 'Léo', 'Marco', 'Andrés', 'Emre', 'Noah', 'Julián', 'Kai',
  'Santiago', 'Malik', 'Felipe', 'Jonas', 'Iker', 'Omar', 'Bruno', 'Aleks', 'Tiago', 'Samuel',
];
const APELLIDOS_DE_LA_CAMADA = [
  'Ferreyra', 'Okafor', 'Kovačić', 'Nakamura', 'Silva', 'Bakayoko', 'Ronsson', 'Mendoza', 'Adeyemi',
  'Petrov', 'Rossi', 'Vermeulen', 'Diarra', 'Castillo', 'Lindqvist', 'Ba', 'Moretti', 'Oyelaran',
  'Sørensen', 'Quintero', 'Haugen', 'Traoré', 'Novak', 'Espinoza', 'Yıldız', 'Bergmann', 'Cissé',
  'Duarte', 'Vasilev', 'Ntumba',
];

function crackDeLaCamada(anio: number, i: number): WorldRankingEntry {
  // La semilla lleva el AÑO: la camada de 2035 no es la de 2030. Y es un hash, no azar: la lista no
  // se reordena sola al abrir la pantalla dos veces.
  // Tres hashes distintos y no uno desplazado: con `semilla >> 5` los bits que quedaban eran casi
  // los mismos para todos y TODA la camada salía apellidada igual ("Youssef Ba", "Thiago Ba",
  // "Tomás Ba"...). Cada campo pide su propia semilla.
  const semilla = hashName(`camada_${anio}_${i}`);
  const nombre = NOMBRES_DE_LA_CAMADA[hashName(`nombre_${anio}_${i}`) % NOMBRES_DE_LA_CAMADA.length];
  const apellido = APELLIDOS_DE_LA_CAMADA[hashName(`apellido_${anio}_${i}`) % APELLIDOS_DE_LA_CAMADA.length];
  const club = CLUBS_DATABASE.filter(c => (c.reputation ?? 0) >= 4);
  return {
    name: `${nombre} ${apellido}`,
    clubName: club.length ? club[hashName(`club_${anio}_${i}`) % club.length].name : '',
    score: 84 + (semilla % 13),
    isPlayer: false,
  };
}

function relevoGeneracional(cuantos: number, anio: number, yaEstan: Set<string>): WorldRankingEntry[] {
  const nuevos: WorldRankingEntry[] = [];
  for (let i = 0; nuevos.length < cuantos && i < cuantos * 4; i++) {
    const c = crackDeLaCamada(anio, i);
    if (yaEstan.has(c.name)) continue;
    yaEstan.add(c.name);
    nuevos.push(c);
  }
  return nuevos;
}

export function generateWorldRanking(profile: PlayerProfile, myClubName: string, currentWeek: number, miLiga = ''): WorldRankingEntry[] {
  const anio = anioDeCarrera(myClubName, currentWeek);
  const pool: WorldRankingEntry[] = ELITE_WORLD_POOL.flatMap(p => {
    const conEdad = porLaEdad(p.baseScore, p.nacio, anio);
    if (conEdad === null) return [];
    return [{
      name: p.name,
      clubName: p.clubName,
      score: Math.max(0, Math.min(100, conEdad + weeklyDrift(p.name, currentWeek))),
      isPlayer: false,
    }];
  });

  // A medida que los reales se retiran, entra la camada siguiente.
  pool.push(...relevoGeneracional(
    TAMANO_DEL_RANKING - pool.length, anio, new Set(pool.map(p => p.name))));

  pool.push({ name: profile.name, clubName: myClubName, score: playerScore(profile, miLiga), isPlayer: true });

  return pool.sort((a, b) => b.score - a.score);
}
