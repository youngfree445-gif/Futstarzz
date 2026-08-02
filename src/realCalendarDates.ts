// GENERADO por scripts/generar_calendario_fechas.mjs -- no editar a mano.
// Fuente: data/calendarios_espn/**.json (fechas reales de ESPN).
//
// A diferencia de realCalendar.ts, que ubicaba cada partido en una SEMANA, acá cada uno tiene su
// FECHA EXACTA. Es lo que permite que un club juegue liga el domingo y copa el jueves de la misma
// semana -- con el modelo por semanas esos partidos no tenían dónde entrar y los torneos no
// cerraban.

export type CompetitionKind =
  | 'league'
  | 'domestic_cup'
  | 'continental_cup'
  | 'national_tournament';

export interface DatedMatch {
  /** Fecha real del partido, YYYY-MM-DD. */
  date: string;
  home: string;
  away: string;
}

export interface DatedCompetition {
  id: string;
  name: string;
  kind: CompetitionKind;
  /** Solo en ligas y copas nacionales: el valor de Club.league al que pertenece. */
  league?: string;
  firstDate: string | null;
  lastDate: string | null;
  matches: DatedMatch[];
}

export const DATED_CALENDARS: DatedCompetition[] = [
 {
  "id": "colombian_primera_a",
  "name": "Liga BetPlay Dimayor",
  "kind": "league",
  "league": "Colombiana",
  "matches": [
   {
    "date": "2026-01-16",
    "home": "Deportivo Pereira",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-01-17",
    "home": "América de Cali",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-01-17",
    "home": "Atlético Nacional",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-01-17",
    "home": "Fortaleza FC",
    "away": "Alianza FC"
   },
   {
    "date": "2026-01-18",
    "home": "Atlético Bucaramanga",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-01-18",
    "home": "Deportivo Pasto",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-01-18",
    "home": "Jaguares de Córdoba",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-01-18",
    "home": "Junior de Barranquilla",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-01-19",
    "home": "Cúcuta Deportivo",
    "away": "Once Caldas"
   },
   {
    "date": "2026-01-19",
    "home": "Independiente Santa Fe",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-01-23",
    "home": "Internacional de Bogotá",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-01-24",
    "home": "Deportes Tolima",
    "away": "Alianza FC"
   },
   {
    "date": "2026-01-24",
    "home": "Deportivo Cali",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-01-24",
    "home": "Deportivo Pereira",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-01-24",
    "home": "Llaneros FC",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-01-25",
    "home": "Águilas Doradas",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-01-25",
    "home": "Boyacá Chicó",
    "away": "América de Cali"
   },
   {
    "date": "2026-01-25",
    "home": "Millonarios FC",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-01-26",
    "home": "Once Caldas",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-01-27",
    "home": "Cúcuta Deportivo",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-01-27",
    "home": "Fortaleza FC",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-01-28",
    "home": "Alianza FC",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-01-28",
    "home": "Independiente Medellín",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-01-28",
    "home": "Independiente Santa Fe",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-01-29",
    "home": "Águilas Doradas",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-01-29",
    "home": "Deportivo Pasto",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-01-29",
    "home": "Jaguares de Córdoba",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-01-30",
    "home": "América de Cali",
    "away": "Once Caldas"
   },
   {
    "date": "2026-01-31",
    "home": "Boyacá Chicó",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-01-31",
    "home": "Cúcuta Deportivo",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-02-01",
    "home": "Atlético Bucaramanga",
    "away": "Alianza FC"
   },
   {
    "date": "2026-02-01",
    "home": "Deportivo Cali",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-02-01",
    "home": "Once Caldas",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-02-02",
    "home": "Internacional de Bogotá",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-02-02",
    "home": "Llaneros FC",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-02-02",
    "home": "Millonarios FC",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-02-03",
    "home": "Deportivo Pereira",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-02-05",
    "home": "Atlético Nacional",
    "away": "América de Cali"
   },
   {
    "date": "2026-02-06",
    "home": "Deportivo Pasto",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-02-07",
    "home": "Águilas Doradas",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-02-07",
    "home": "Deportes Tolima",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-02-07",
    "home": "Fortaleza FC",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-02-07",
    "home": "Independiente Medellín",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-02-08",
    "home": "Alianza FC",
    "away": "Once Caldas"
   },
   {
    "date": "2026-02-08",
    "home": "Deportivo Cali",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-02-08",
    "home": "Junior de Barranquilla",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-02-09",
    "home": "Jaguares de Córdoba",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-02-10",
    "home": "Cúcuta Deportivo",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-02-10",
    "home": "Llaneros FC",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-02-11",
    "home": "Atlético Bucaramanga",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-02-11",
    "home": "Millonarios FC",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-02-12",
    "home": "Boyacá Chicó",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-02-12",
    "home": "Internacional de Bogotá",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-02-12",
    "home": "Once Caldas",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-02-13",
    "home": "Atlético Nacional",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-02-14",
    "home": "América de Cali",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-02-14",
    "home": "Independiente Medellín",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-02-14",
    "home": "Millonarios FC",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-02-15",
    "home": "Deportes Tolima",
    "away": "Once Caldas"
   },
   {
    "date": "2026-02-15",
    "home": "Deportivo Cali",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-02-15",
    "home": "Deportivo Pasto",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-02-16",
    "home": "Fortaleza FC",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-02-17",
    "home": "Alianza FC",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-02-17",
    "home": "Jaguares de Córdoba",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-02-19",
    "home": "Junior de Barranquilla",
    "away": "América de Cali"
   },
   {
    "date": "2026-02-20",
    "home": "Llaneros FC",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-02-21",
    "home": "Atlético Bucaramanga",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-02-21",
    "home": "Atlético Nacional",
    "away": "Alianza FC"
   },
   {
    "date": "2026-02-21",
    "home": "Deportivo Pereira",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-02-21",
    "home": "Once Caldas",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-02-22",
    "home": "Boyacá Chicó",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-02-22",
    "home": "Independiente Santa Fe",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-02-22",
    "home": "Internacional de Bogotá",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-02-23",
    "home": "América de Cali",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-02-23",
    "home": "Cúcuta Deportivo",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-02-26",
    "home": "Independiente Santa Fe",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-02-27",
    "home": "Millonarios FC",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-02-28",
    "home": "Alianza FC",
    "away": "América de Cali"
   },
   {
    "date": "2026-02-28",
    "home": "Jaguares de Córdoba",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-02-28",
    "home": "Once Caldas",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-03-01",
    "home": "Águilas Doradas",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-03-01",
    "home": "Deportivo Cali",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-03-01",
    "home": "Deportivo Pasto",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-03-01",
    "home": "Independiente Medellín",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-03-02",
    "home": "Deportes Tolima",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-03-05",
    "home": "Fortaleza FC",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-03-05",
    "home": "Llaneros FC",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-03-06",
    "home": "Junior de Barranquilla",
    "away": "Alianza FC"
   },
   {
    "date": "2026-03-07",
    "home": "Águilas Doradas",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-03-07",
    "home": "Deportivo Cali",
    "away": "Once Caldas"
   },
   {
    "date": "2026-03-09",
    "home": "Llaneros FC",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-03-09",
    "home": "Millonarios FC",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-03-10",
    "home": "Atlético Bucaramanga",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-03-10",
    "home": "Deportivo Pasto",
    "away": "América de Cali"
   },
   {
    "date": "2026-03-11",
    "home": "Junior de Barranquilla",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-03-13",
    "home": "Once Caldas",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-03-14",
    "home": "Atlético Nacional",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-03-14",
    "home": "Boyacá Chicó",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-03-14",
    "home": "Cúcuta Deportivo",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-03-14",
    "home": "Internacional de Bogotá",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-03-15",
    "home": "América de Cali",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-03-15",
    "home": "Deportivo Pereira",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-03-15",
    "home": "Independiente Santa Fe",
    "away": "Alianza FC"
   },
   {
    "date": "2026-03-15",
    "home": "Jaguares de Córdoba",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-03-16",
    "home": "Junior de Barranquilla",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-03-17",
    "home": "Llaneros FC",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-03-18",
    "home": "Deportivo Pasto",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-03-18",
    "home": "Internacional de Bogotá",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-03-18",
    "home": "Millonarios FC",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-03-19",
    "home": "Alianza FC",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-03-19",
    "home": "Atlético Bucaramanga",
    "away": "Once Caldas"
   },
   {
    "date": "2026-03-19",
    "home": "Deportes Tolima",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-03-19",
    "home": "Deportivo Cali",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-03-20",
    "home": "Águilas Doradas",
    "away": "América de Cali"
   },
   {
    "date": "2026-03-20",
    "home": "Independiente Medellín",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-03-21",
    "home": "Once Caldas",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-03-22",
    "home": "Alianza FC",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-03-22",
    "home": "Atlético Nacional",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-03-23",
    "home": "Boyacá Chicó",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-03-23",
    "home": "Independiente Santa Fe",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-03-23",
    "home": "Jaguares de Córdoba",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-03-24",
    "home": "Deportivo Pereira",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-03-24",
    "home": "Junior de Barranquilla",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-03-25",
    "home": "Fortaleza FC",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-03-26",
    "home": "América de Cali",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-03-27",
    "home": "Águilas Doradas",
    "away": "Alianza FC"
   },
   {
    "date": "2026-03-28",
    "home": "Atlético Bucaramanga",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-03-28",
    "home": "Cúcuta Deportivo",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-03-28",
    "home": "Deportes Tolima",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-03-29",
    "home": "Deportivo Cali",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-03-29",
    "home": "Deportivo Pasto",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-03-29",
    "home": "Internacional de Bogotá",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-03-30",
    "home": "Independiente Medellín",
    "away": "América de Cali"
   },
   {
    "date": "2026-03-30",
    "home": "Llaneros FC",
    "away": "Once Caldas"
   },
   {
    "date": "2026-03-31",
    "home": "Millonarios FC",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-04-01",
    "home": "Alianza FC",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-04-01",
    "home": "Deportes Tolima",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-04-01",
    "home": "Independiente Santa Fe",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-04-02",
    "home": "América de Cali",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-04-02",
    "home": "Atlético Nacional",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-04-02",
    "home": "Boyacá Chicó",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-04-02",
    "home": "Jaguares de Córdoba",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-04-03",
    "home": "Fortaleza FC",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-04-03",
    "home": "Once Caldas",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-04-04",
    "home": "Junior de Barranquilla",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-04-05",
    "home": "Cúcuta Deportivo",
    "away": "América de Cali"
   },
   {
    "date": "2026-04-05",
    "home": "Deportes Tolima",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-04-06",
    "home": "Deportivo Pereira",
    "away": "Alianza FC"
   },
   {
    "date": "2026-04-07",
    "home": "Águilas Doradas",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-04-07",
    "home": "Atlético Nacional",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-04-10",
    "home": "Deportivo Pereira",
    "away": "Once Caldas"
   },
   {
    "date": "2026-04-11",
    "home": "Águilas Doradas",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-04-11",
    "home": "Deportivo Pasto",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-04-12",
    "home": "Atlético Bucaramanga",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-04-12",
    "home": "Deportivo Cali",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-04-12",
    "home": "Independiente Medellín",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-04-12",
    "home": "Millonarios FC",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-04-13",
    "home": "Internacional de Bogotá",
    "away": "Alianza FC"
   },
   {
    "date": "2026-04-17",
    "home": "Boyacá Chicó",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-04-17",
    "home": "Jaguares de Córdoba",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-04-18",
    "home": "Deportes Tolima",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-04-19",
    "home": "Alianza FC",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-04-19",
    "home": "Fortaleza FC",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-04-19",
    "home": "Independiente Santa Fe",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-04-19",
    "home": "Junior de Barranquilla",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-04-20",
    "home": "América de Cali",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-04-20",
    "home": "Once Caldas",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-04-21",
    "home": "Atlético Nacional",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-04-22",
    "home": "Independiente Medellín",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-04-23",
    "home": "Deportivo Pasto",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-04-23",
    "home": "Fortaleza FC",
    "away": "América de Cali"
   },
   {
    "date": "2026-04-24",
    "home": "Cúcuta Deportivo",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-04-24",
    "home": "Millonarios FC",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-04-25",
    "home": "Atlético Bucaramanga",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-04-25",
    "home": "Deportivo Cali",
    "away": "América de Cali"
   },
   {
    "date": "2026-04-25",
    "home": "Deportivo Pereira",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-04-26",
    "home": "Águilas Doradas",
    "away": "Once Caldas"
   },
   {
    "date": "2026-04-26",
    "home": "Independiente Medellín",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-04-26",
    "home": "Llaneros FC",
    "away": "Alianza FC"
   },
   {
    "date": "2026-04-27",
    "home": "Internacional de Bogotá",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-05-01",
    "home": "Once Caldas",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-05-02",
    "home": "Boyacá Chicó",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-05-02",
    "home": "Jaguares de Córdoba",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-05-03",
    "home": "Alianza FC",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-05-03",
    "home": "América de Cali",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-05-03",
    "home": "Deportes Tolima",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-05-03",
    "home": "Fortaleza FC",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-05-03",
    "home": "Independiente Medellín",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-05-03",
    "home": "Independiente Santa Fe",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-05-03",
    "home": "Junior de Barranquilla",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-05-09",
    "home": "Deportes Tolima",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-05-09",
    "home": "Internacional de Bogotá",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-05-10",
    "home": "América de Cali",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-05-10",
    "home": "Once Caldas",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-05-12",
    "home": "Atlético Nacional",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-05-13",
    "home": "Deportivo Pasto",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-05-13",
    "home": "Independiente Santa Fe",
    "away": "América de Cali"
   },
   {
    "date": "2026-05-14",
    "home": "Junior de Barranquilla",
    "away": "Once Caldas"
   },
   {
    "date": "2026-05-16",
    "home": "Deportes Tolima",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-05-17",
    "home": "Independiente Santa Fe",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-05-23",
    "home": "Atlético Nacional",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-05-24",
    "home": "Junior de Barranquilla",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-06-03",
    "home": "Junior de Barranquilla",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-06-08",
    "home": "Atlético Nacional",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-07-24",
    "home": "Llaneros FC",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-07-25",
    "home": "Deportivo Cali",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-07-25",
    "home": "Independiente Medellín",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-07-25",
    "home": "Millonarios FC",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-07-26",
    "home": "Águilas Doradas",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-07-26",
    "home": "Alianza FC",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-07-26",
    "home": "Deportes Tolima",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-07-26",
    "home": "Internacional de Bogotá",
    "away": "América de Cali"
   },
   {
    "date": "2026-07-27",
    "home": "Once Caldas",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-07-31",
    "home": "Atlético Bucaramanga",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-08-01",
    "home": "Alianza FC",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-08-01",
    "home": "Deportivo Pasto",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-08-01",
    "home": "Fortaleza FC",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-08-01",
    "home": "Independiente Medellín",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-08-02",
    "home": "América de Cali",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-08-02",
    "home": "Jaguares de Córdoba",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-08-02",
    "home": "Junior de Barranquilla",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-08-03",
    "home": "Independiente Santa Fe",
    "away": "Once Caldas"
   },
   {
    "date": "2026-08-04",
    "home": "Atlético Bucaramanga",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-08-04",
    "home": "Deportes Tolima",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-08-04",
    "home": "Llaneros FC",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-08-05",
    "home": "Deportivo Pereira",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-08-05",
    "home": "Internacional de Bogotá",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-08-05",
    "home": "Millonarios FC",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-08-06",
    "home": "Once Caldas",
    "away": "América de Cali"
   },
   {
    "date": "2026-08-08",
    "home": "Deportes Tolima",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-08-08",
    "home": "Fortaleza FC",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-08-09",
    "home": "Alianza FC",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-08-09",
    "home": "Deportivo Pasto",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-08-09",
    "home": "Independiente Santa Fe",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-08-09",
    "home": "Jaguares de Córdoba",
    "away": "Once Caldas"
   },
   {
    "date": "2026-08-10",
    "home": "Águilas Doradas",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-08-10",
    "home": "América de Cali",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-08-11",
    "home": "Junior de Barranquilla",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-08-12",
    "home": "Independiente Medellín",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-08-14",
    "home": "Llaneros FC",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-08-15",
    "home": "Cúcuta Deportivo",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-08-16",
    "home": "América de Cali",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-08-16",
    "home": "Atlético Nacional",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-08-16",
    "home": "Deportivo Pereira",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-08-17",
    "home": "Atlético Bucaramanga",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-08-17",
    "home": "Internacional de Bogotá",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-08-17",
    "home": "Millonarios FC",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-08-17",
    "home": "Once Caldas",
    "away": "Alianza FC"
   },
   {
    "date": "2026-08-18",
    "home": "Boyacá Chicó",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-08-21",
    "home": "Jaguares de Córdoba",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-08-22",
    "home": "Águilas Doradas",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-08-22",
    "home": "Deportes Tolima",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-08-22",
    "home": "Independiente Santa Fe",
    "away": "América de Cali"
   },
   {
    "date": "2026-08-23",
    "home": "Deportivo Cali",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-08-23",
    "home": "Deportivo Pasto",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-08-23",
    "home": "Fortaleza FC",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-08-23",
    "home": "Junior de Barranquilla",
    "away": "Once Caldas"
   },
   {
    "date": "2026-08-24",
    "home": "Alianza FC",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-08-24",
    "home": "Independiente Medellín",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-08-25",
    "home": "Atlético Bucaramanga",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-08-26",
    "home": "América de Cali",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-08-26",
    "home": "Boyacá Chicó",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-08-26",
    "home": "Independiente Santa Fe",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-08-26",
    "home": "Internacional de Bogotá",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-08-27",
    "home": "Atlético Nacional",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-08-27",
    "home": "Llaneros FC",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-08-28",
    "home": "Once Caldas",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-08-29",
    "home": "Jaguares de Córdoba",
    "away": "América de Cali"
   },
   {
    "date": "2026-08-29",
    "home": "Junior de Barranquilla",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-08-30",
    "home": "Águilas Doradas",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-08-30",
    "home": "Alianza FC",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-08-30",
    "home": "Independiente Medellín",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-08-30",
    "home": "Millonarios FC",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-08-31",
    "home": "Deportes Tolima",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-08-31",
    "home": "Deportivo Pasto",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-09-01",
    "home": "Deportivo Cali",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-09-02",
    "home": "Cúcuta Deportivo",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-09-02",
    "home": "Fortaleza FC",
    "away": "Once Caldas"
   },
   {
    "date": "2026-09-03",
    "home": "América de Cali",
    "away": "Alianza FC"
   },
   {
    "date": "2026-09-03",
    "home": "Independiente Santa Fe",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-09-04",
    "home": "Deportivo Pereira",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-09-05",
    "home": "Atlético Bucaramanga",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-09-05",
    "home": "Boyacá Chicó",
    "away": "Once Caldas"
   },
   {
    "date": "2026-09-06",
    "home": "Cúcuta Deportivo",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-09-06",
    "home": "Deportivo Pereira",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-09-06",
    "home": "Internacional de Bogotá",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-09-06",
    "home": "Junior de Barranquilla",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-09-07",
    "home": "Independiente Santa Fe",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-09-08",
    "home": "Llaneros FC",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-09-10",
    "home": "Boyacá Chicó",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-09-11",
    "home": "Jaguares de Córdoba",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-09-12",
    "home": "Alianza FC",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-09-12",
    "home": "Boyacá Chicó",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-09-12",
    "home": "Deportivo Pereira",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-09-12",
    "home": "Internacional de Bogotá",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-09-13",
    "home": "América de Cali",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-09-13",
    "home": "Atlético Nacional",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-09-13",
    "home": "Independiente Santa Fe",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-09-13",
    "home": "Once Caldas",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-09-14",
    "home": "Cúcuta Deportivo",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-09-15",
    "home": "Boyacá Chicó",
    "away": "Alianza FC"
   },
   {
    "date": "2026-09-18",
    "home": "Águilas Doradas",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-09-19",
    "home": "Alianza FC",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-09-19",
    "home": "Deportivo Cali",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-09-19",
    "home": "Deportivo Pasto",
    "away": "Once Caldas"
   },
   {
    "date": "2026-09-19",
    "home": "Independiente Medellín",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-09-20",
    "home": "Atlético Bucaramanga",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-09-20",
    "home": "Deportes Tolima",
    "away": "América de Cali"
   },
   {
    "date": "2026-09-20",
    "home": "Fortaleza FC",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-09-20",
    "home": "Millonarios FC",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-09-21",
    "home": "Llaneros FC",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-09-23",
    "home": "América de Cali",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-09-23",
    "home": "Independiente Santa Fe",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-09-24",
    "home": "Atlético Nacional",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-09-25",
    "home": "Boyacá Chicó",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-09-26",
    "home": "Cúcuta Deportivo",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-09-26",
    "home": "Deportivo Pereira",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-09-26",
    "home": "Once Caldas",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-09-27",
    "home": "Fortaleza FC",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-09-27",
    "home": "Jaguares de Córdoba",
    "away": "Alianza FC"
   },
   {
    "date": "2026-09-27",
    "home": "Junior de Barranquilla",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-09-28",
    "home": "Deportivo Cali",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-10-01",
    "home": "Atlético Nacional",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-10-03",
    "home": "Águilas Doradas",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-10-03",
    "home": "Deportes Tolima",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-10-03",
    "home": "Deportivo Cali",
    "away": "Alianza FC"
   },
   {
    "date": "2026-10-04",
    "home": "Atlético Bucaramanga",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-10-04",
    "home": "Cúcuta Deportivo",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-10-04",
    "home": "Deportivo Pasto",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-10-04",
    "home": "Independiente Medellín",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-10-05",
    "home": "Llaneros FC",
    "away": "América de Cali"
   },
   {
    "date": "2026-10-08",
    "home": "Atlético Nacional",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-10-08",
    "home": "Cúcuta Deportivo",
    "away": "Alianza FC"
   },
   {
    "date": "2026-10-09",
    "home": "Fortaleza FC",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-10-10",
    "home": "Junior de Barranquilla",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-10-10",
    "home": "Once Caldas",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-10-11",
    "home": "Atlético Nacional",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-10-11",
    "home": "Deportivo Pereira",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-10-11",
    "home": "Jaguares de Córdoba",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-10-12",
    "home": "Alianza FC",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-10-12",
    "home": "América de Cali",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-10-13",
    "home": "Boyacá Chicó",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-10-14",
    "home": "Millonarios FC",
    "away": "Once Caldas"
   },
   {
    "date": "2026-10-15",
    "home": "Independiente Santa Fe",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-10-17",
    "home": "Águilas Doradas",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-10-17",
    "home": "Atlético Bucaramanga",
    "away": "América de Cali"
   },
   {
    "date": "2026-10-17",
    "home": "Internacional de Bogotá",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-10-17",
    "home": "Millonarios FC",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-10-18",
    "home": "Independiente Medellín",
    "away": "Once Caldas"
   },
   {
    "date": "2026-10-18",
    "home": "Llaneros FC",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-10-19",
    "home": "Deportivo Cali",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-10-19",
    "home": "Deportivo Pereira",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-10-20",
    "home": "Deportivo Pasto",
    "away": "Alianza FC"
   },
   {
    "date": "2026-10-20",
    "home": "Internacional de Bogotá",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-10-21",
    "home": "Cúcuta Deportivo",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-10-24",
    "home": "Alianza FC",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-10-24",
    "home": "América de Cali",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-10-24",
    "home": "Boyacá Chicó",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-10-24",
    "home": "Junior de Barranquilla",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-10-25",
    "home": "Atlético Nacional",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-10-25",
    "home": "Fortaleza FC",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-10-25",
    "home": "Jaguares de Córdoba",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-10-25",
    "home": "Once Caldas",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-10-26",
    "home": "Deportes Tolima",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-10-27",
    "home": "Millonarios FC",
    "away": "América de Cali"
   },
   {
    "date": "2026-10-29",
    "home": "Águilas Doradas",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-10-29",
    "home": "Deportivo Pereira",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-10-30",
    "home": "Independiente Medellín",
    "away": "Alianza FC"
   },
   {
    "date": "2026-10-30",
    "home": "Internacional de Bogotá",
    "away": "Once Caldas"
   },
   {
    "date": "2026-10-31",
    "home": "Cúcuta Deportivo",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-10-31",
    "home": "Deportivo Cali",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-10-31",
    "home": "Llaneros FC",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-11-01",
    "home": "Atlético Bucaramanga",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-11-01",
    "home": "Deportivo Pasto",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-11-02",
    "home": "Fortaleza FC",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-11-02",
    "home": "Once Caldas",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-11-03",
    "home": "Alianza FC",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-11-03",
    "home": "Deportes Tolima",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-11-03",
    "home": "Independiente Santa Fe",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-11-04",
    "home": "América de Cali",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-11-04",
    "home": "Boyacá Chicó",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-11-04",
    "home": "Jaguares de Córdoba",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-11-04",
    "home": "Junior de Barranquilla",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-11-05",
    "home": "Atlético Nacional",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-11-08",
    "home": "Águilas Doradas",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-11-08",
    "home": "Atlético Bucaramanga",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-11-08",
    "home": "Atlético Nacional",
    "away": "Once Caldas"
   },
   {
    "date": "2026-11-08",
    "home": "Cúcuta Deportivo",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-11-08",
    "home": "Deportivo Cali",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-11-08",
    "home": "Deportivo Pasto",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-11-08",
    "home": "Deportivo Pereira",
    "away": "América de Cali"
   },
   {
    "date": "2026-11-08",
    "home": "Internacional de Bogotá",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-11-08",
    "home": "Llaneros FC",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-11-08",
    "home": "Millonarios FC",
    "away": "Alianza FC"
   }
  ],
  "firstDate": "2026-01-16",
  "lastDate": "2026-11-08"
 },
 {
  "id": "copa_colombia",
  "name": "Copa BetPlay",
  "kind": "domestic_cup",
  "league": "Colombiana",
  "matches": [
   {
    "date": "2026-05-07",
    "home": "Independiente Yumbo",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-05-07",
    "home": "Jaguares de Córdoba",
    "away": "Real Cundinamarca"
   },
   {
    "date": "2026-05-07",
    "home": "Llaneros FC",
    "away": "Atlético FC"
   },
   {
    "date": "2026-05-07",
    "home": "Patriotas",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-05-08",
    "home": "Atlético Bucaramanga",
    "away": "Real Santander"
   },
   {
    "date": "2026-05-08",
    "home": "Boca Juniors de Cali",
    "away": "Alianza FC"
   },
   {
    "date": "2026-05-08",
    "home": "Fortaleza FC",
    "away": "Itagüí Leones"
   },
   {
    "date": "2026-05-09",
    "home": "Orsomarso SC",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-05-10",
    "home": "Águilas Doradas",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-05-11",
    "home": "Deportivo Cali",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-05-11",
    "home": "Independiente Medellín",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-05-12",
    "home": "Millonarios FC",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-05-15",
    "home": "Boca Juniors de Cali",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-05-15",
    "home": "Patriotas",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-05-16",
    "home": "Alianza FC",
    "away": "Real Santander"
   },
   {
    "date": "2026-05-16",
    "home": "Boyacá Chicó",
    "away": "Atlético FC"
   },
   {
    "date": "2026-05-16",
    "home": "Cúcuta Deportivo",
    "away": "Itagüí Leones"
   },
   {
    "date": "2026-05-16",
    "home": "Orsomarso SC",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-05-17",
    "home": "Deportivo Pereira",
    "away": "Real Cundinamarca"
   },
   {
    "date": "2026-05-18",
    "home": "Independiente Yumbo",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-05-20",
    "home": "Fortaleza FC",
    "away": "Orsomarso SC"
   },
   {
    "date": "2026-05-20",
    "home": "Llaneros FC",
    "away": "Patriotas"
   },
   {
    "date": "2026-05-21",
    "home": "Águilas Doradas",
    "away": "Deportivo Pereira"
   },
   {
    "date": "2026-05-21",
    "home": "Atlético Bucaramanga",
    "away": "Boca Juniors de Cali"
   },
   {
    "date": "2026-05-21",
    "home": "Deportivo Cali",
    "away": "Alianza FC"
   },
   {
    "date": "2026-05-21",
    "home": "Jaguares de Córdoba",
    "away": "Independiente Yumbo"
   },
   {
    "date": "2026-05-23",
    "home": "Millonarios FC",
    "away": "Boyacá Chicó"
   },
   {
    "date": "2026-05-24",
    "home": "Alianza FC",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-05-24",
    "home": "Real Santander",
    "away": "Deportivo Cali"
   },
   {
    "date": "2026-05-26",
    "home": "Deportivo Pereira",
    "away": "Jaguares de Córdoba"
   },
   {
    "date": "2026-05-26",
    "home": "Real Cundinamarca",
    "away": "Águilas Doradas"
   },
   {
    "date": "2026-05-27",
    "home": "Boyacá Chicó",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-05-29",
    "home": "Cúcuta Deportivo",
    "away": "Fortaleza FC"
   },
   {
    "date": "2026-05-29",
    "home": "Itagüí Leones",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-05-30",
    "home": "Atlético FC",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-06-02",
    "home": "Independiente Medellín",
    "away": "Cúcuta Deportivo"
   },
   {
    "date": "2026-07-21",
    "home": "Atlético Nacional",
    "away": "Tigres FC"
   },
   {
    "date": "2026-07-21",
    "home": "Deportes Tolima",
    "away": "Deportes Quindío"
   },
   {
    "date": "2026-07-21",
    "home": "Internacional de Bogotá",
    "away": "Inter Palmira"
   },
   {
    "date": "2026-07-22",
    "home": "América de Cali",
    "away": "Real Cartagena"
   },
   {
    "date": "2026-07-22",
    "home": "Deportivo Pasto",
    "away": "Bogotá FC"
   },
   {
    "date": "2026-07-22",
    "home": "Once Caldas",
    "away": "Envigado FC"
   },
   {
    "date": "2026-07-23",
    "home": "Junior de Barranquilla",
    "away": "Barranquilla FC"
   },
   {
    "date": "2026-07-28",
    "home": "Deportes Quindío",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-07-29",
    "home": "Barranquilla FC",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-07-29",
    "home": "Bogotá FC",
    "away": "Deportivo Pasto"
   },
   {
    "date": "2026-07-29",
    "home": "Inter Palmira",
    "away": "Internacional de Bogotá"
   },
   {
    "date": "2026-07-29",
    "home": "Tigres FC",
    "away": "Atlético Nacional"
   },
   {
    "date": "2026-07-30",
    "home": "Envigado FC",
    "away": "Once Caldas"
   },
   {
    "date": "2026-07-30",
    "home": "Real Cartagena",
    "away": "América de Cali"
   },
   {
    "date": "2026-08-06",
    "home": "Independiente Santa Fe",
    "away": "Unión Magdalena"
   },
   {
    "date": "2026-08-11",
    "home": "Deportes Quindío",
    "away": "Llaneros FC"
   },
   {
    "date": "2026-08-18",
    "home": "Deportivo Pereira",
    "away": "América de Cali"
   },
   {
    "date": "2026-08-18",
    "home": "Real Cundinamarca",
    "away": "Internacional de Bogotá"
   }
  ],
  "firstDate": "2026-05-07",
  "lastDate": "2026-08-18"
 },
 {
  "id": "conmebol_libertadores",
  "name": "Copa Libertadores",
  "kind": "continental_cup",
  "matches": [
   {
    "date": "2026-02-18",
    "home": "Liverpool",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-02-20",
    "home": "Deportivo Táchira",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-02-25",
    "home": "Independiente Medellín",
    "away": "Liverpool"
   },
   {
    "date": "2026-02-27",
    "home": "Deportes Tolima",
    "away": "Deportivo Táchira"
   },
   {
    "date": "2026-03-05",
    "home": "O'Higgins",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-03-06",
    "home": "Juventud",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-03-12",
    "home": "Deportes Tolima",
    "away": "O'Higgins"
   },
   {
    "date": "2026-03-13",
    "home": "Independiente Medellín",
    "away": "Juventud"
   },
   {
    "date": "2026-04-08",
    "home": "Deportes Tolima",
    "away": "Universitario"
   },
   {
    "date": "2026-04-09",
    "home": "Independiente Medellín",
    "away": "Estudiantes de La Plata"
   },
   {
    "date": "2026-04-09",
    "home": "Junior de Barranquilla",
    "away": "Palmeiras"
   },
   {
    "date": "2026-04-10",
    "home": "Independiente Santa Fe",
    "away": "Peñarol"
   },
   {
    "date": "2026-04-14",
    "home": "Cerro Porteño",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-04-14",
    "home": "Nacional",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-04-16",
    "home": "Corinthians",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-04-17",
    "home": "Flamengo",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-04-29",
    "home": "Deportes Tolima",
    "away": "Coquimbo Unido"
   },
   {
    "date": "2026-04-29",
    "home": "Platense",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-04-29",
    "home": "Sporting Cristal",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-05-01",
    "home": "Independiente Medellín",
    "away": "Cusco FC"
   },
   {
    "date": "2026-05-07",
    "home": "Deportes Tolima",
    "away": "Nacional"
   },
   {
    "date": "2026-05-07",
    "home": "Independiente Santa Fe",
    "away": "Corinthians"
   },
   {
    "date": "2026-05-08",
    "home": "Independiente Medellín",
    "away": "Flamengo"
   },
   {
    "date": "2026-05-08",
    "home": "Junior de Barranquilla",
    "away": "Cerro Porteño"
   },
   {
    "date": "2026-05-19",
    "home": "Coquimbo Unido",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-05-20",
    "home": "Independiente Santa Fe",
    "away": "Platense"
   },
   {
    "date": "2026-05-21",
    "home": "Cusco FC",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-05-21",
    "home": "Junior de Barranquilla",
    "away": "Sporting Cristal"
   },
   {
    "date": "2026-05-27",
    "home": "Estudiantes de La Plata",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-05-27",
    "home": "Universitario",
    "away": "Deportes Tolima"
   },
   {
    "date": "2026-05-28",
    "home": "Palmeiras",
    "away": "Junior de Barranquilla"
   },
   {
    "date": "2026-05-28",
    "home": "Peñarol",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-08-12",
    "home": "Deportes Tolima",
    "away": "Independiente del Valle"
   },
   {
    "date": "2026-08-19",
    "home": "Independiente del Valle",
    "away": "Deportes Tolima"
   }
  ],
  "firstDate": "2026-02-18",
  "lastDate": "2026-08-19"
 },
 {
  "id": "conmebol_sudamericana",
  "name": "Copa Sudamericana",
  "kind": "continental_cup",
  "matches": [
   {
    "date": "2026-03-05",
    "home": "Atlético Nacional",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-03-06",
    "home": "América de Cali",
    "away": "Atlético Bucaramanga"
   },
   {
    "date": "2026-04-08",
    "home": "O'Higgins",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-04-10",
    "home": "Macará",
    "away": "América de Cali"
   },
   {
    "date": "2026-04-16",
    "home": "América de Cali",
    "away": "Alianza Atlético"
   },
   {
    "date": "2026-04-16",
    "home": "Millonarios FC",
    "away": "Boston River"
   },
   {
    "date": "2026-04-29",
    "home": "Millonarios FC",
    "away": "São Paulo"
   },
   {
    "date": "2026-05-01",
    "home": "Tigre",
    "away": "América de Cali"
   },
   {
    "date": "2026-05-07",
    "home": "Alianza Atlético",
    "away": "América de Cali"
   },
   {
    "date": "2026-05-07",
    "home": "Boston River",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-05-20",
    "home": "América de Cali",
    "away": "Tigre"
   },
   {
    "date": "2026-05-20",
    "home": "São Paulo",
    "away": "Millonarios FC"
   },
   {
    "date": "2026-05-26",
    "home": "Millonarios FC",
    "away": "O'Higgins"
   },
   {
    "date": "2026-05-29",
    "home": "América de Cali",
    "away": "Macará"
   },
   {
    "date": "2026-07-22",
    "home": "Independiente Medellín",
    "away": "Vasco da Gama"
   },
   {
    "date": "2026-07-24",
    "home": "Independiente Santa Fe",
    "away": "Caracas FC"
   },
   {
    "date": "2026-07-29",
    "home": "Vasco da Gama",
    "away": "Independiente Medellín"
   },
   {
    "date": "2026-07-31",
    "home": "Caracas FC",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-08-13",
    "home": "Independiente Santa Fe",
    "away": "River Plate"
   },
   {
    "date": "2026-08-20",
    "home": "River Plate",
    "away": "Independiente Santa Fe"
   }
  ],
  "firstDate": "2026-03-05",
  "lastDate": "2026-08-20"
 },
 {
  "id": "superliga_de_colombia",
  "name": "Superliga de Colombia",
  "kind": "domestic_cup",
  "league": "Colombiana",
  "matches": [
   {
    "date": "2026-01-16",
    "home": "Junior de Barranquilla",
    "away": "Independiente Santa Fe"
   },
   {
    "date": "2026-01-22",
    "home": "Independiente Santa Fe",
    "away": "Junior de Barranquilla"
   }
  ],
  "firstDate": "2026-01-16",
  "lastDate": "2026-01-22"
 }
];
