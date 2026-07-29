// Generado por enrich_players_fc26.mjs cruzando starPlayers (data.ts) contra
// FC26_20250921.json (fuente principal) y latamfc26.json (fallback para ligas menores/sudamericanas).
// Clave: "clubId|nombreTalCualEnStarPlayers" (incluye el sufijo "(POS)" si lo tenía).
// Puramente aditivo: no reemplaza ni borra nada de ULTIMATE_CLUBS_DATABASE, solo corrobora datos
// reales (overall, nacionalidad, dorsal, edad, fecha de nacimiento) para consultarlos aparte.

export interface PlayerEnrichmentData {
  overall?: number;
  nationality?: string;
  dorsal?: number;
  age?: number;
  fechaNacimiento?: string;
  source: 'fc26' | 'latamfc26';
}

export const PLAYER_ENRICHMENT: Record<string, PlayerEnrichmentData> = {
  "junior|Carlos Bacca": {
    "overall": 70,
    "nationality": "Colombia",
    "dorsal": 70,
    "age": 39,
    "fechaNacimiento": "1986-09-08",
    "source": "latamfc26"
  },
  "junior|Teófilo Gutiérrez": {
    "overall": 69,
    "nationality": "Colombia",
    "dorsal": 29,
    "age": 41,
    "fechaNacimiento": "1985-05-04",
    "source": "latamfc26"
  },
  "junior|Luis Fernando Muriel": {
    "overall": 76,
    "nationality": "Colombia",
    "age": 35,
    "fechaNacimiento": "1991-04-16",
    "source": "latamfc26"
  },
  "junior|Yimmi Chará": {
    "overall": 72,
    "nationality": "Colombia",
    "dorsal": 8,
    "age": 33,
    "fechaNacimiento": "1993-05-16",
    "source": "latamfc26"
  },
  "junior|Cristian Barrios": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-05-07",
    "source": "fc26"
  },
  "junior|Mauro Silveira": {
    "overall": 69,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "nacional|David Ospina": {
    "overall": 76,
    "nationality": "Colombia",
    "dorsal": 1,
    "age": 36,
    "fechaNacimiento": "1988-08-31",
    "source": "fc26"
  },
  "nacional|William Tesillo": {
    "overall": 74,
    "nationality": "Colombia",
    "dorsal": 16,
    "age": 35,
    "fechaNacimiento": "1990-02-02",
    "source": "fc26"
  },
  "nacional|Edwin Cardona": {
    "overall": 74,
    "nationality": "Colombia",
    "dorsal": 10,
    "age": 32,
    "fechaNacimiento": "1992-12-08",
    "source": "fc26"
  },
  "nacional|Alfredo Morelos": {
    "overall": 75,
    "nationality": "Colombia",
    "dorsal": 9,
    "age": 29,
    "fechaNacimiento": "1996-06-21",
    "source": "fc26"
  },
  "nacional|Milton Casco": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 20,
    "age": 37,
    "fechaNacimiento": "1988-04-11",
    "source": "fc26"
  },
  "millonarios|Álvaro Montero": {
    "overall": 75,
    "nationality": "Colombia",
    "dorsal": 31,
    "age": 30,
    "fechaNacimiento": "1995-03-29",
    "source": "fc26"
  },
  "millonarios|Leonardo Castro": {
    "overall": 71,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "millonarios|Carlos Darwin Quintero": {
    "overall": 71,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "santafe|Hugo Rodallega": {
    "overall": 72,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "santafe|Fabián Sambueza": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 36,
    "fechaNacimiento": "1988-08-01",
    "source": "fc26"
  },
  "santafe|Franco Fagúndez": {
    "overall": 60,
    "nationality": "Uruguay",
    "dorsal": 26,
    "age": 26,
    "fechaNacimiento": "1998-12-14",
    "source": "fc26"
  },
  "santafe|Helibelton Palacios": {
    "overall": 66,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "santafe|Yeison Gordillo": {
    "overall": 67,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "america_cali|Darwin Machís (LW)": {
    "overall": 75,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "america_cali|Yeison Guzmán (CAM)": {
    "overall": 72,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "america_cali|Daniel Valencia (ST)": {
    "overall": 72,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "america_cali|Adrián Ramos (ST)": {
    "overall": 72,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "america_cali|Jhon Murillo (RW)": {
    "overall": 72,
    "nationality": "Venezuela",
    "dorsal": 11,
    "age": 29,
    "fechaNacimiento": "1995-11-21",
    "source": "fc26"
  },
  "america_cali|Jean (GK)": {
    "overall": 71,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "america_cali|Daniel Bocanegra (CB)": {
    "overall": 71,
    "nationality": "Colombia",
    "dorsal": 2,
    "age": 38,
    "fechaNacimiento": "1987-04-23",
    "source": "fc26"
  },
  "america_cali|Rafael Carrascal (CM)": {
    "overall": 70,
    "nationality": "Colombia",
    "dorsal": 10,
    "age": 32,
    "fechaNacimiento": "1992-11-26",
    "source": "fc26"
  },
  "america_cali|Marlon Torres (CB)": {
    "overall": 70,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "america_cali|Jorge Soto (GK)": {
    "overall": 70,
    "nationality": "Colombia",
    "dorsal": 12,
    "age": 31,
    "fechaNacimiento": "1993-08-02",
    "source": "fc26"
  },
  "america_cali|Dany Rosero (CB)": {
    "overall": 69,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "medellin|Didier Moreno": {
    "overall": 71,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "medellin|Andrés Ricaurte": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "medellin|Iván Arboleda": {
    "overall": 66,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "tolima|Anderson Angulo (CB)": {
    "overall": 71,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "tolima|Brayan Rovira (CDM)": {
    "overall": 71,
    "dorsal": 80,
    "source": "latamfc26"
  },
  "tolima|Neto Volpi (GK)": {
    "overall": 70,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "tolima|Luis Sandoval (ST)": {
    "overall": 70,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "tolima|Juan Nieto (CM)": {
    "overall": 70,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "tolima|Junior Hernández (LB)": {
    "overall": 69,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "tolima|Jherson Mosquera (RB)": {
    "overall": 69,
    "nationality": "Colombia",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "1999-09-18",
    "source": "fc26"
  },
  "tolima|Jan Ángulo (CB)": {
    "overall": 68,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "tolima|Sebastián Guzmán (CDM)": {
    "overall": 68,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "tolima|Jader Valencia (ST)": {
    "overall": 68,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "tolima|Jersson González (RW)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "once_caldas|Dayro Moreno (ST)": {
    "overall": 75,
    "nationality": "Colombia",
    "dorsal": 17,
    "age": 39,
    "fechaNacimiento": "1985-09-16",
    "source": "fc26"
  },
  "once_caldas|James Aguirre (GK)": {
    "overall": 71,
    "nationality": "Colombia",
    "dorsal": 12,
    "age": 33,
    "fechaNacimiento": "1992-05-21",
    "source": "fc26"
  },
  "once_caldas|Andrés Felipe Roa (CAM)": {
    "overall": 71,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "once_caldas|Michael Barrios (RM)": {
    "overall": 71,
    "nationality": "Colombia",
    "dorsal": 7,
    "age": 34,
    "fechaNacimiento": "1991-04-21",
    "source": "fc26"
  },
  "once_caldas|Robert Mejía (CDM)": {
    "overall": 70,
    "dorsal": 88,
    "source": "latamfc26"
  },
  "once_caldas|Iván Rojas (CDM)": {
    "overall": 70,
    "nationality": "Colombia",
    "dorsal": 5,
    "age": 27,
    "fechaNacimiento": "1997-07-24",
    "source": "fc26"
  },
  "once_caldas|Juan David Cuesta (RB)": {
    "overall": 69,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "once_caldas|Jaime Alvarado (CDM)": {
    "overall": 69,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "once_caldas|Jorge Cardona (CB)": {
    "overall": 68,
    "nationality": "Colombia",
    "dorsal": 34,
    "age": 26,
    "fechaNacimiento": "1999-02-23",
    "source": "fc26"
  },
  "once_caldas|Jeider Riquett (CB)": {
    "overall": 68,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "once_caldas|Déinner Quiñones (RM)": {
    "overall": 68,
    "nationality": "Colombia",
    "dorsal": 70,
    "age": 29,
    "fechaNacimiento": "1995-08-16",
    "source": "fc26"
  },
  "cali|Carlos Bacca (ST)": {
    "overall": 70,
    "nationality": "Colombia",
    "age": 39,
    "fechaNacimiento": "1986-09-08",
    "source": "latamfc26"
  },
  "cali|Emanuel Reynoso (CAM)": {
    "overall": 77,
    "nationality": "Argentina",
    "dorsal": 33,
    "age": 29,
    "fechaNacimiento": "1995-11-16",
    "source": "fc26"
  },
  "cali|Juan Dinenno (ST)": {
    "overall": 74,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "cali|Pedro Gallese (GK)": {
    "overall": 72,
    "nationality": "Peru",
    "dorsal": 1,
    "age": 35,
    "fechaNacimiento": "1990-02-23",
    "source": "fc26"
  },
  "cali|Avilés Hurtado (LW)": {
    "overall": 71,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "cali|Andrés Colorado (CDM)": {
    "overall": 70,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "cali|Alejandro Rodríguez (GK)": {
    "overall": 70,
    "dorsal": 38,
    "source": "latamfc26"
  },
  "cali|Fabián Viáfara (RB)": {
    "overall": 69,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "cali|Felipe Aguilar (CB)": {
    "overall": 69,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "cali|Johan Martinez (LW)": {
    "overall": 69,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "cali|Julián Quiñónes (CB)": {
    "overall": 80,
    "nationality": "Mexico",
    "dorsal": 33,
    "age": 28,
    "fechaNacimiento": "1997-03-24",
    "source": "fc26"
  },
  "bucaramanga|Aldair Quintana": {
    "overall": 72,
    "nationality": "Colombia",
    "dorsal": 1,
    "age": 30,
    "fechaNacimiento": "1994-07-11",
    "source": "fc26"
  },
  "bucaramanga|Jefferson Mena": {
    "overall": 67,
    "nationality": "Colombia",
    "dorsal": 2,
    "age": 36,
    "fechaNacimiento": "1989-06-15",
    "source": "fc26"
  },
  "bucaramanga|Joider Micolta": {
    "overall": 68,
    "dorsal": 38,
    "source": "latamfc26"
  },
  "bucaramanga|Andrés Ponce": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "aguilas|Bryan Urueña (LW)": {
    "overall": 69,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "aguilas|Joaquín Varela (CB)": {
    "overall": 69,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "aguilas|John García (CB)": {
    "overall": 69,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "aguilas|Diego Hernández (CB)": {
    "overall": 68,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "aguilas|Frank Lozano (CDM)": {
    "overall": 68,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "aguilas|Jaen Carlos Pineda (CM)": {
    "overall": 68,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "aguilas|Andrés Ricaurte (CM)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "aguilas|Dylan Lozano (RB)": {
    "overall": 67,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "aguilas|Jorge Rivaldo (ST)": {
    "overall": 67,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "aguilas|Jorge Obregón (ST)": {
    "overall": 67,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "aguilas|Iván Arboleda (GK)": {
    "overall": 66,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "internacional_bogota|Washington Ortega": {
    "overall": 71,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "internacional_bogota|Amaury Torralvo": {
    "overall": 65,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "internacional_bogota|Élan Ricardo": {
    "overall": 61,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "internacional_bogota|Johan Rojas": {
    "overall": 72,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "pereira|Salvador Ichazo": {
    "overall": 70,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "pereira|Jean Pestaña": {
    "overall": 71,
    "nationality": "Colombia",
    "dorsal": 24,
    "age": 27,
    "fechaNacimiento": "1997-08-25",
    "source": "fc26"
  },
  "fortaleza_fc|Sebastián Navarro": {
    "overall": 69,
    "nationality": "Colombia",
    "dorsal": 21,
    "age": 24,
    "fechaNacimiento": "2000-07-15",
    "source": "fc26"
  },
  "fortaleza_fc|Adrián Parra": {
    "overall": 66,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "fortaleza_fc|Nicolás Rodríguez": {
    "overall": 68,
    "nationality": "Uruguay",
    "dorsal": 77,
    "age": 33,
    "fechaNacimiento": "1991-07-22",
    "source": "fc26"
  },
  "pasto|Herrerín (GK)": {
    "overall": 72,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "pasto|Andrey Estupiñán (LW)": {
    "overall": 69,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "pasto|Fáiner Torijano (CB)": {
    "overall": 68,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "pasto|Johan Caicedo (CDM)": {
    "overall": 68,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "pasto|Diego Chavez (CM)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 15,
    "age": 27,
    "fechaNacimiento": "1997-09-24",
    "source": "fc26"
  },
  "pasto|Joider Micolta (LW)": {
    "overall": 68,
    "dorsal": 38,
    "source": "latamfc26"
  },
  "pasto|Yéiler Góez (CM)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "pasto|Santiago Córdoba (ST)": {
    "overall": 67,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "pasto|Geovanni Banguera (GK)": {
    "overall": 66,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "pasto|Santiago Jiménez (RB)": {
    "overall": 66,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "pasto|Nicolás Gil (CB)": {
    "overall": 66,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "alianza_fc|Pedro Franco": {
    "overall": 70,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "alianza_fc|Mayer Gil": {
    "overall": 65,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "alianza_fc|Andrés Rentería": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "boyaca_chico|Delio Ramírez (CM)": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "boyaca_chico|Yesús Cabrera (CAM)": {
    "overall": 67,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "boyaca_chico|Darío Denis (GK)": {
    "overall": 66,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "boyaca_chico|Juan Carlos Díaz (CDM)": {
    "overall": 66,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "boyaca_chico|Jairo Molina (ST)": {
    "overall": 66,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "boyaca_chico|Arlen Banguero (CB)": {
    "overall": 65,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "boyaca_chico|Yaliston Martínez (LB)": {
    "overall": 64,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "boyaca_chico|Sebastián Palma (CB)": {
    "overall": 64,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "boyaca_chico|Sebastián Salazar (CM)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "boyaca_chico|Andrés Aedo (CDM)": {
    "overall": 64,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "boyaca_chico|Rogerio Caicedo (GK)": {
    "overall": 64,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "llaneros_fc|Duvan Mosquera": {
    "overall": 64,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "llaneros_fc|Jhildrey Lasso": {
    "overall": 64,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "jaguares|Wilson Morelo": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "jaguares|Kahiser Lenis": {
    "overall": 64,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "jaguares|Geovanni Banguera": {
    "overall": 66,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "cucuta|Frank Castañeda (RM)": {
    "overall": 70,
    "nationality": "Colombia",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1994-07-17",
    "source": "fc26"
  },
  "cucuta|Sebastián Rodríguez (CB)": {
    "overall": 75,
    "nationality": "Uruguay",
    "dorsal": 14,
    "age": 32,
    "fechaNacimiento": "1992-08-16",
    "source": "fc26"
  },
  "cucuta|Luis Payares (CB)": {
    "overall": 68,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "cucuta|Omar Albornoz (LM)": {
    "overall": 68,
    "dorsal": 80,
    "source": "latamfc26"
  },
  "cucuta|Víctor Mejía (CM)": {
    "overall": 67,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "cucuta|Mauricio Duarte (LB)": {
    "overall": 67,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "cucuta|Juan Diego Ceballos (CM)": {
    "overall": 67,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "cucuta|Luifer Hernández (ST)": {
    "overall": 66,
    "dorsal": 90,
    "source": "latamfc26"
  },
  "cucuta|Luis Hinestroza (CDM)": {
    "overall": 66,
    "dorsal": 49,
    "source": "latamfc26"
  },
  "cucuta|Joao Abonia (RW)": {
    "overall": 65,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "cucuta|Jhon Quiñones (CB)": {
    "overall": 65,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "cartagena|Jarlan Barrera (CAM)": {
    "overall": 70,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "cartagena|Mauro Manotas (ST)": {
    "overall": 68,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "cartagena|Cristian Graciano (RB)": {
    "overall": 67,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "cartagena|Fredy Montero (ST)": {
    "overall": 67,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "cartagena|Didier Pino (CDM)": {
    "overall": 66,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "cartagena|Luis Yanes (LW)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "cartagena|Ronaldo Lora (CB)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "cartagena|Aldo Montes (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "cartagena|Juan Sebastian Herrera (RB)": {
    "overall": 65,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "cartagena|Andrés Escobar (LW)": {
    "overall": 64,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "cartagena|Luis Guevara (CM)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "barranquilla_fc|Yeferson Moreno (RB)": {
    "overall": 64,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "barranquilla_fc|Juan Lemus (GK)": {
    "overall": 63,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "barranquilla_fc|Jhon Cortez (LB)": {
    "overall": 63,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "barranquilla_fc|Miller Bacca (ST)": {
    "overall": 63,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "barranquilla_fc|Marlon Carabali (RW)": {
    "overall": 62,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "barranquilla_fc|Cristian Peñate (ST)": {
    "overall": 62,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "barranquilla_fc|Carlos Cantillo (CM)": {
    "overall": 62,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "barranquilla_fc|Miguel Agamez (CM)": {
    "overall": 62,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "barranquilla_fc|José Caicedo (CB)": {
    "overall": 62,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "barranquilla_fc|Omar Cassiani (LB)": {
    "overall": 61,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "barranquilla_fc|Sebastián Guerra (GK)": {
    "overall": 61,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "envigado_fc|Joan Parra": {
    "overall": 66,
    "nationality": "Colombia",
    "dorsal": 35,
    "age": 25,
    "fechaNacimiento": "2000-06-10",
    "source": "fc26"
  },
  "envigado_fc|Felipe Jaramillo": {
    "overall": 66,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "envigado_fc|Luis Díaz (Jr)": {
    "overall": 85,
    "nationality": "Colombia",
    "dorsal": 14,
    "age": 28,
    "fechaNacimiento": "1997-01-13",
    "source": "fc26"
  },
  "envigado_fc|Juan Manuel Cuesta": {
    "overall": 66,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "union_magdalena|José Mercado (CM)": {
    "overall": 56,
    "nationality": "United States",
    "dorsal": 99,
    "age": 25,
    "fechaNacimiento": "1999-09-27",
    "source": "fc26"
  },
  "union_magdalena|Misael Martínez (ST)": {
    "overall": 67,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "union_magdalena|Víctor Cabezas (GK)": {
    "overall": 67,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "union_magdalena|Juan Jose Vásquez (LB)": {
    "overall": 65,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "union_magdalena|Jhon Lerma (RB)": {
    "overall": 65,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "union_magdalena|Jimmy Congo (CDM)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "union_magdalena|Cristian Iguarán (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "union_magdalena|Joaquín Mattalía (GK)": {
    "overall": 65,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "union_magdalena|Juan Diego Giraldo (CM)": {
    "overall": 64,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "union_magdalena|David Murillo (RB)": {
    "overall": 64,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "union_magdalena|José Palacios (RM)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "boca_cali|José Torres": {
    "overall": 63,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "boca_cali|Yaser Asprilla (Jr)": {
    "overall": 75,
    "nationality": "Colombia",
    "dorsal": 10,
    "age": 21,
    "fechaNacimiento": "2003-11-19",
    "source": "fc26"
  },
  "cundinamarca_fc|Juan Salcedo (ST)": {
    "overall": 66,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "cundinamarca_fc|Jhon Suaza (CB)": {
    "overall": 65,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "cundinamarca_fc|Onel Acosta (LB)": {
    "overall": 64,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "cundinamarca_fc|William Dávila (CAM)": {
    "overall": 64,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "cundinamarca_fc|Leider Montaño (ST)": {
    "overall": 64,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "cundinamarca_fc|Stiven Moreno (CB)": {
    "overall": 63,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "cundinamarca_fc|Jhon Córtes (LB)": {
    "overall": 63,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "cundinamarca_fc|Iván Camacho (CDM)": {
    "overall": 63,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "cundinamarca_fc|Juan David Hoyos (CDM)": {
    "overall": 62,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "cundinamarca_fc|Yan Vega (ST)": {
    "overall": 62,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "cundinamarca_fc|Jose Cundumi (ST)": {
    "overall": 62,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "real_santander|Faiber Mendoza (CM)": {
    "overall": 66,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "real_santander|Jaime Mora (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "real_santander|Juan Ararat (RW)": {
    "overall": 65,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "real_santander|Juan David Rueda (ST)": {
    "overall": 64,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "real_santander|Juan Pablo García Habib (RB)": {
    "overall": 64,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "real_santander|Santiago José Jiménez (CM)": {
    "overall": 64,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "real_santander|Rafael Tapia (ST)": {
    "overall": 63,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "real_santander|Harlem Salas (LW)": {
    "overall": 63,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "real_santander|Kevin Chacón (GK)": {
    "overall": 63,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "real_santander|Jordi Hernández (CB)": {
    "overall": 63,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "real_santander|Wilmer Bustamante (CM)": {
    "overall": 63,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "bogota_fc|Cristián Mosquera (RB)": {
    "overall": 66,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "bogota_fc|Brayan Castro (RW)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "bogota_fc|Diego Castillo (ST)": {
    "overall": 65,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "bogota_fc|Juan Martínez (LW)": {
    "overall": 65,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "bogota_fc|Andrés Buelvas (ST)": {
    "overall": 65,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "bogota_fc|Kevin Castro (CDM)": {
    "overall": 64,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "bogota_fc|Harold Sandoval Lasso (ST)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "bogota_fc|Juan Camilo Moreno (LB)": {
    "overall": 63,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "bogota_fc|Santiago Ruiz (CB)": {
    "overall": 63,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "bogota_fc|Ronaldo Tavera (CDM)": {
    "overall": 63,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "bogota_fc|Mauricio Medina (RB)": {
    "overall": 63,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "tigres_fc|Orles Aragón (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "tigres_fc|Michael Mahecha (CM)": {
    "overall": 65,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "tigres_fc|Víctor Brid (GK)": {
    "overall": 64,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "tigres_fc|Ricardo Rosales (RB)": {
    "overall": 64,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "tigres_fc|Ghilbert Parra (LB)": {
    "overall": 64,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "tigres_fc|Camilo Ibarra (RW)": {
    "overall": 64,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "tigres_fc|Duván Viáfara (CB)": {
    "overall": 63,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "tigres_fc|Jesús Cano (LB)": {
    "overall": 63,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "tigres_fc|Brandon Mejía (CDM)": {
    "overall": 63,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "tigres_fc|Luis Mario Palacios (LM)": {
    "overall": 63,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "tigres_fc|Matteo Frigerio (RW)": {
    "overall": 63,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "san_lorenzo|Adam Bareiro": {
    "overall": 74,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "san_lorenzo|Nahuel Barrios": {
    "overall": 72,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "san_lorenzo|Gastón Hernández": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 27,
    "fechaNacimiento": "1998-01-19",
    "source": "fc26"
  },
  "san_lorenzo|Facundo Altamirano": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1996-03-21",
    "source": "fc26"
  },
  "river|Aníbal Moreno (CDM)": {
    "overall": 77,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "river|Gonzalo Montiel (RB)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1997-01-01",
    "source": "fc26"
  },
  "river|Marcos Acuña (LB)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 21,
    "age": 33,
    "fechaNacimiento": "1991-10-28",
    "source": "fc26"
  },
  "river|Juan Fernando Quintero (CAM)": {
    "overall": 76,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "river|Franco Armani (GK)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 38,
    "fechaNacimiento": "1986-10-16",
    "source": "fc26"
  },
  "river|Lucas Martínez Quarta (CB)": {
    "overall": 77,
    "nationality": "Argentina",
    "dorsal": 28,
    "age": 29,
    "fechaNacimiento": "1996-05-10",
    "source": "fc26"
  },
  "river|Sebastián Driussi (ST)": {
    "overall": 77,
    "nationality": "Argentina",
    "dorsal": 15,
    "age": 29,
    "fechaNacimiento": "1996-02-09",
    "source": "fc26"
  },
  "river|Lautaro Rivero (CB)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 13,
    "age": 21,
    "fechaNacimiento": "2003-11-01",
    "source": "fc26"
  },
  "river|Fausto Vera (CM)": {
    "overall": 74,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "river|Maximiliano Salas (ST)": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1997-12-01",
    "source": "fc26"
  },
  "river|Facundo Colidio (ST)": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 25,
    "fechaNacimiento": "2000-01-04",
    "source": "fc26"
  },
  "boca|Leandro Paredes (CM)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 31,
    "fechaNacimiento": "1994-06-29",
    "source": "fc26"
  },
  "boca|Santiago Ascacíbar (CDM)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-02-25",
    "source": "fc26"
  },
  "boca|Exequiel Zeballos (LW)": {
    "overall": 77,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "boca|Miguel Ángel Merentiel (ST)": {
    "overall": 77,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "boca|Ayrton Costa (CB)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 32,
    "age": 25,
    "fechaNacimiento": "1999-07-12",
    "source": "fc26"
  },
  "boca|Ander Herrera (CM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 35,
    "fechaNacimiento": "1989-08-14",
    "source": "fc26"
  },
  "boca|Rodrigo Battaglia (CDM)": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 29,
    "age": 33,
    "fechaNacimiento": "1991-07-12",
    "source": "fc26"
  },
  "boca|Agustín Marchesín (GK)": {
    "overall": 77,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 37,
    "fechaNacimiento": "1988-03-16",
    "source": "fc26"
  },
  "boca|Lautaro Blanco (LB)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1999-02-19",
    "source": "fc26"
  },
  "boca|Carlos Palacios (CAM)": {
    "overall": 76,
    "nationality": "Chile",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2000-07-20",
    "source": "fc26"
  },
  "boca|Lautaro Di Lollo (CB)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 40,
    "age": 21,
    "fechaNacimiento": "2004-03-10",
    "source": "fc26"
  },
  "estudiantes_lp|Santiago Ascacíbar": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-02-25",
    "source": "fc26"
  },
  "estudiantes_lp|Enzo Pérez": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 24,
    "age": 39,
    "fechaNacimiento": "1986-02-22",
    "source": "fc26"
  },
  "estudiantes_lp|Guido Carrillo": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 34,
    "fechaNacimiento": "1991-05-25",
    "source": "fc26"
  },
  "estudiantes_lp|José Sosa": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 40,
    "fechaNacimiento": "1985-06-19",
    "source": "fc26"
  },
  "gimnasia_lp|Benjamín Domínguez": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 30,
    "age": 21,
    "fechaNacimiento": "2003-09-19",
    "source": "fc26"
  },
  "gimnasia_lp|Leonardo Morales": {
    "overall": 74,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "gimnasia_lp|Nelson Insfrán": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 30,
    "fechaNacimiento": "1995-05-24",
    "source": "fc26"
  },
  "racing|Adrián Martínez": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 32,
    "fechaNacimiento": "1992-07-07",
    "source": "fc26"
  },
  "racing|Juan Fernando Quintero": {
    "overall": 76,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "racing|Gabriel Arias": {
    "overall": 77,
    "nationality": "Chile",
    "dorsal": 21,
    "age": 37,
    "fechaNacimiento": "1987-09-13",
    "source": "fc26"
  },
  "racing|Roger Martínez": {
    "overall": 72,
    "nationality": "Colombia",
    "dorsal": 10,
    "age": 31,
    "fechaNacimiento": "1994-06-23",
    "source": "fc26"
  },
  "velez|Álvaro Montero (GK)": {
    "overall": 75,
    "nationality": "Colombia",
    "dorsal": 31,
    "age": 30,
    "fechaNacimiento": "1995-03-29",
    "source": "fc26"
  },
  "velez|Elías Gómez (LB)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 3,
    "age": 31,
    "fechaNacimiento": "1994-06-09",
    "source": "fc26"
  },
  "velez|Manuel Lanzini (CAM)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 32,
    "fechaNacimiento": "1993-02-15",
    "source": "fc26"
  },
  "velez|Emanuel Mammana (CB)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 2,
    "age": 29,
    "fechaNacimiento": "1996-02-10",
    "source": "fc26"
  },
  "velez|Rodrigo Aliendro (CM)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 34,
    "fechaNacimiento": "1991-02-16",
    "source": "fc26"
  },
  "velez|Claudio Baeza (CDM)": {
    "overall": 73,
    "nationality": "Chile",
    "dorsal": 5,
    "age": 31,
    "fechaNacimiento": "1993-12-23",
    "source": "fc26"
  },
  "velez|Braian Romero (ST)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 34,
    "fechaNacimiento": "1991-06-15",
    "source": "fc26"
  },
  "velez|Diego Valdés (CAM)": {
    "overall": 75,
    "nationality": "Chile",
    "dorsal": 10,
    "age": 31,
    "fechaNacimiento": "1994-01-30",
    "source": "fc26"
  },
  "velez|Joaquín García (RB)": {
    "overall": 74,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "velez|Tomás Marchiori (GK)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 30,
    "fechaNacimiento": "1995-06-20",
    "source": "fc26"
  },
  "velez|Matías Pellegrini (RM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 25,
    "fechaNacimiento": "2000-03-11",
    "source": "fc26"
  },
  "independiente|Rodrigo Rey (GK)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 33,
    "age": 34,
    "fechaNacimiento": "1991-03-08",
    "source": "fc26"
  },
  "independiente|Víctor Ignacio Malcorra (CM)": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 37,
    "fechaNacimiento": "1987-07-24",
    "source": "fc26"
  },
  "independiente|Kevin Lomónaco (CB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 26,
    "age": 23,
    "fechaNacimiento": "2002-01-08",
    "source": "fc26"
  },
  "independiente|Santiago Montiel (RM)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 24,
    "fechaNacimiento": "2000-11-22",
    "source": "fc26"
  },
  "independiente|Santiago Arias (RB)": {
    "overall": 65,
    "nationality": "Uruguay",
    "dorsal": 5,
    "age": 30,
    "fechaNacimiento": "1995-06-19",
    "source": "fc26"
  },
  "independiente|Gabriel Ávalos (ST)": {
    "overall": 75,
    "nationality": "Paraguay",
    "dorsal": 9,
    "age": 34,
    "fechaNacimiento": "1990-10-12",
    "source": "fc26"
  },
  "independiente|Leonardo Godoy (RB)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 2,
    "age": 30,
    "fechaNacimiento": "1995-04-28",
    "source": "fc26"
  },
  "independiente|Iván Marcone (CDM)": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 35,
    "fechaNacimiento": "1990-06-03",
    "source": "fc26"
  },
  "independiente|Sebastián Valdéz (CB)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 36,
    "age": 29,
    "fechaNacimiento": "1995-11-06",
    "source": "fc26"
  },
  "independiente|Facundo Zabala (LB)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 26,
    "fechaNacimiento": "1999-01-02",
    "source": "fc26"
  },
  "independiente|Matías Abaldo (LM)": {
    "overall": 70,
    "nationality": "Uruguay",
    "dorsal": 74,
    "age": 21,
    "fechaNacimiento": "2004-04-02",
    "source": "fc26"
  },
  "lanus|Marcelino Moreno (CAM)": {
    "overall": 78,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "lanus|Nahuel Losada (GK)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 26,
    "age": 32,
    "fechaNacimiento": "1993-04-17",
    "source": "fc26"
  },
  "lanus|Ramiro Carrera (LM)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 31,
    "fechaNacimiento": "1993-10-24",
    "source": "fc26"
  },
  "lanus|Sasha Marcich (LB)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1998-05-29",
    "source": "fc26"
  },
  "lanus|Eduardo Salvio (RM)": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 34,
    "fechaNacimiento": "1990-07-13",
    "source": "fc26"
  },
  "lanus|Franco Petroli (GK)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 27,
    "fechaNacimiento": "1998-06-11",
    "source": "fc26"
  },
  "lanus|Carlos Izquierdoz (CB)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 24,
    "age": 36,
    "fechaNacimiento": "1988-11-03",
    "source": "fc26"
  },
  "lanus|Agustín Cardozo (CDM)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 30,
    "age": 28,
    "fechaNacimiento": "1997-05-30",
    "source": "fc26"
  },
  "lanus|Walter Bou (ST)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 31,
    "fechaNacimiento": "1993-08-25",
    "source": "fc26"
  },
  "lanus|Lucas Acosta (GK)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 42,
    "age": 30,
    "fechaNacimiento": "1995-03-12",
    "source": "fc26"
  },
  "lanus|José Canale (CB)": {
    "overall": 69,
    "nationality": "Paraguay",
    "dorsal": 13,
    "age": 28,
    "fechaNacimiento": "1996-07-20",
    "source": "fc26"
  },
  "newells|Ever Banega": {
    "overall": 77,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 37,
    "fechaNacimiento": "1988-06-29",
    "source": "fc26"
  },
  "newells|Ignacio Ramírez": {
    "overall": 68,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "newells|Armando Méndez": {
    "overall": 71,
    "nationality": "Uruguay",
    "dorsal": 21,
    "age": 29,
    "fechaNacimiento": "1996-03-31",
    "source": "fc26"
  },
  "newells|Ian Glavinovich": {
    "overall": 64,
    "nationality": "Argentina",
    "dorsal": 2,
    "age": 23,
    "fechaNacimiento": "2001-10-27",
    "source": "fc26"
  },
  "banfield|Facundo Sanguinetti (GK)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2001-03-01",
    "source": "fc26"
  },
  "banfield|Sergio Vittor (CB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 14,
    "age": 36,
    "fechaNacimiento": "1989-06-09",
    "source": "fc26"
  },
  "banfield|Santiago López García (RB)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 24,
    "age": 27,
    "fechaNacimiento": "1997-12-04",
    "source": "fc26"
  },
  "banfield|Danilo Arboleda (CB)": {
    "overall": 70,
    "nationality": "Colombia",
    "dorsal": 3,
    "age": 30,
    "fechaNacimiento": "1995-05-16",
    "source": "fc26"
  },
  "banfield|Mauro Méndez (ST)": {
    "overall": 69,
    "nationality": "Uruguay",
    "dorsal": 16,
    "age": 26,
    "fechaNacimiento": "1999-01-17",
    "source": "fc26"
  },
  "banfield|Bruno Sepúlveda (ST)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 32,
    "fechaNacimiento": "1992-09-17",
    "source": "fc26"
  },
  "banfield|Nicolas Meriano (CB)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 26,
    "age": 24,
    "fechaNacimiento": "2000-11-09",
    "source": "fc26"
  },
  "banfield|Nicolás Colazo (LB)": {
    "overall": 69,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "banfield|Ignacio Abraham (LB)": {
    "overall": 68,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "banfield|Lautaro Ríos (CM)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2000-10-09",
    "source": "fc26"
  },
  "banfield|Gino Santilli (GK)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2001-10-26",
    "source": "fc26"
  },
  "rosario_central|Ángel Di María (RW)": {
    "overall": 82,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 37,
    "fechaNacimiento": "1988-02-14",
    "source": "fc26"
  },
  "rosario_central|Conan Ledesma (GK)": {
    "overall": 76,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "rosario_central|Jaminton Campaz (LM)": {
    "overall": 76,
    "nationality": "Colombia",
    "dorsal": 8,
    "age": 25,
    "fechaNacimiento": "2000-05-24",
    "source": "fc26"
  },
  "rosario_central|Franco Ibarra (CDM)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 24,
    "fechaNacimiento": "2001-04-28",
    "source": "fc26"
  },
  "rosario_central|Carlos Quintana (CB)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 2,
    "age": 37,
    "fechaNacimiento": "1988-02-11",
    "source": "fc26"
  },
  "rosario_central|Facundo Mallo (CB)": {
    "overall": 73,
    "nationality": "Uruguay",
    "dorsal": 15,
    "age": 30,
    "fechaNacimiento": "1995-01-16",
    "source": "fc26"
  },
  "rosario_central|Agustín Sández (LB)": {
    "overall": 73,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "rosario_central|Pol Fernández (CM)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 33,
    "fechaNacimiento": "1991-10-11",
    "source": "fc26"
  },
  "rosario_central|Emanuel Coronel (RB)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 32,
    "age": 28,
    "fechaNacimiento": "1997-02-01",
    "source": "fc26"
  },
  "rosario_central|Alejo Veliz (ST)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 21,
    "fechaNacimiento": "2003-09-19",
    "source": "fc26"
  },
  "rosario_central|Federico Navarro (CDM)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 31,
    "age": 25,
    "fechaNacimiento": "2000-03-09",
    "source": "fc26"
  },
  "instituto|Gastón Lodico": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 19,
    "age": 27,
    "fechaNacimiento": "1998-05-28",
    "source": "fc26"
  },
  "instituto|Manuel Roffo": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 28,
    "age": 25,
    "fechaNacimiento": "2000-04-04",
    "source": "fc26"
  },
  "instituto|Fernando Alarcón": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 31,
    "fechaNacimiento": "1994-06-16",
    "source": "fc26"
  },
  "argentinos_jrs|Alan Lescano": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2001-11-11",
    "source": "fc26"
  },
  "argentinos_jrs|Maximiliano Romero": {
    "overall": 71,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "argentinos_jrs|Diego Rodríguez": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 50,
    "age": 36,
    "fechaNacimiento": "1989-06-25",
    "source": "fc26"
  },
  "belgrano|Lucas Passerini": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 30,
    "fechaNacimiento": "1994-07-16",
    "source": "fc26"
  },
  "belgrano|Ulises Sánchez": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 12,
    "age": 27,
    "fechaNacimiento": "1998-06-26",
    "source": "fc26"
  },
  "belgrano|Nahuel Losada": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 26,
    "age": 32,
    "fechaNacimiento": "1993-04-17",
    "source": "fc26"
  },
  "belgrano|Matías Marín": {
    "overall": 69,
    "nationality": "Chile",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "1999-12-19",
    "source": "fc26"
  },
  "atl_tucuman|Leandro Díaz (ST)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 27,
    "age": 33,
    "fechaNacimiento": "1992-06-06",
    "source": "fc26"
  },
  "atl_tucuman|Martín Benítez (CAM)": {
    "overall": 74,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "atl_tucuman|Leonel Di Plácido (RB)": {
    "overall": 72,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "atl_tucuman|Gastón Suso (CB)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 34,
    "fechaNacimiento": "1991-03-12",
    "source": "fc26"
  },
  "atl_tucuman|Ramiro Ruiz Rodríguez (RM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 25,
    "fechaNacimiento": "2000-03-21",
    "source": "fc26"
  },
  "atl_tucuman|Gianluca Ferrari (CB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1997-06-30",
    "source": "fc26"
  },
  "atl_tucuman|Renzo Tesuri (RM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 29,
    "fechaNacimiento": "1996-06-07",
    "source": "fc26"
  },
  "atl_tucuman|Kevin Ortiz (CM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 45,
    "age": 24,
    "fechaNacimiento": "2000-09-18",
    "source": "fc26"
  },
  "atl_tucuman|Maximiliano Villa (RB)": {
    "overall": 69,
    "nationality": "Uruguay",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1997-03-03",
    "source": "fc26"
  },
  "atl_tucuman|Luis Ingolotti (GK)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 25,
    "fechaNacimiento": "2000-01-14",
    "source": "fc26"
  },
  "atl_tucuman|Javier Domínguez (CM)": {
    "overall": 68,
    "nationality": "Paraguay",
    "dorsal": 18,
    "age": 25,
    "fechaNacimiento": "2000-05-26",
    "source": "fc26"
  },
  "defensa_y_justicia|Nicolás Fernández": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "2000-01-11",
    "source": "fc26"
  },
  "defensa_y_justicia|Gastón Togni": {
    "overall": 75,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "defensa_y_justicia|Kevin Gutiérrez": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-06-03",
    "source": "fc26"
  },
  "defensa_y_justicia|Cristopher Fiermarín": {
    "overall": 72,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "huracan|Óscar Romero (CAM)": {
    "overall": 75,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "huracan|Hernán Galíndez (GK)": {
    "overall": 74,
    "nationality": "Ecuador",
    "dorsal": 1,
    "age": 38,
    "fechaNacimiento": "1987-03-30",
    "source": "fc26"
  },
  "huracan|Martín Nervo (CB)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 15,
    "age": 34,
    "fechaNacimiento": "1991-01-06",
    "source": "fc26"
  },
  "huracan|Fabio Pereyra (CB)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 35,
    "fechaNacimiento": "1990-01-31",
    "source": "fc26"
  },
  "huracan|Leonardo Gil (CDM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 8,
    "age": 34,
    "fechaNacimiento": "1991-05-31",
    "source": "fc26"
  },
  "huracan|Facundo Waller (LM)": {
    "overall": 72,
    "nationality": "Uruguay",
    "dorsal": 31,
    "age": 28,
    "fechaNacimiento": "1997-04-09",
    "source": "fc26"
  },
  "huracan|Nehuén Paz (CB)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 30,
    "age": 32,
    "fechaNacimiento": "1993-04-28",
    "source": "fc26"
  },
  "huracan|Sebastián Meza (GK)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 32,
    "age": 25,
    "fechaNacimiento": "2000-03-14",
    "source": "fc26"
  },
  "huracan|Federico Vera (RB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 4,
    "age": 27,
    "fechaNacimiento": "1998-03-24",
    "source": "fc26"
  },
  "huracan|Alejandro Martínez (LW)": {
    "overall": 70,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "huracan|Lucas Blondel (RB)": {
    "overall": 72,
    "nationality": "Switzerland",
    "dorsal": 42,
    "age": 28,
    "fechaNacimiento": "1996-09-14",
    "source": "fc26"
  },
  "tigre|Gonzalo Martínez (CAM)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 32,
    "fechaNacimiento": "1993-06-13",
    "source": "fc26"
  },
  "tigre|Jalil Elías (CDM)": {
    "overall": 71,
    "nationality": "Syria",
    "dorsal": 30,
    "age": 29,
    "fechaNacimiento": "1996-04-25",
    "source": "fc26"
  },
  "tigre|Joaquín Laso (CB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 2,
    "age": 34,
    "fechaNacimiento": "1990-07-04",
    "source": "fc26"
  },
  "tigre|Bruno Leyes (CDM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 42,
    "age": 23,
    "fechaNacimiento": "2001-10-30",
    "source": "fc26"
  },
  "tigre|Jabes Saralegui (RM)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 47,
    "age": 22,
    "fechaNacimiento": "2003-04-12",
    "source": "fc26"
  },
  "tigre|Joaquín Mosqueira (CDM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 17,
    "age": 21,
    "fechaNacimiento": "2004-01-11",
    "source": "fc26"
  },
  "tigre|Felipe Zenobio (GK)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 12,
    "age": 25,
    "fechaNacimiento": "2000-05-22",
    "source": "fc26"
  },
  "tigre|David Romero (ST)": {
    "overall": 69,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "tigre|Nahuel Banegas (LB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1996-10-06",
    "source": "fc26"
  },
  "tigre|Elías Cabrera (LM)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 33,
    "age": 22,
    "fechaNacimiento": "2003-02-25",
    "source": "fc26"
  },
  "tigre|Sebastián Medina (LM)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-03-15",
    "source": "fc26"
  },
  "union_sf|Lucas Gamba": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 38,
    "fechaNacimiento": "1987-06-24",
    "source": "fc26"
  },
  "union_sf|Mauro Luna Diale": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 75,
    "age": 26,
    "fechaNacimiento": "1999-04-26",
    "source": "fc26"
  },
  "union_sf|Claudio Corvalán": {
    "overall": 71,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "union_sf|Nicolás Campisi": {
    "overall": 69,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "talleres|Ramón Sosa": {
    "overall": 75,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "talleres|Federico Girotti": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 26,
    "fechaNacimiento": "1999-06-02",
    "source": "fc26"
  },
  "talleres|Gastón Benavídez": {
    "overall": 73,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "talleres|Guido Herrera": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 33,
    "fechaNacimiento": "1992-02-29",
    "source": "fc26"
  },
  "platense|Víctor Cuesta (CB)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 15,
    "age": 36,
    "fechaNacimiento": "1988-11-19",
    "source": "fc26"
  },
  "platense|Matías Borgogno (GK)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 26,
    "fechaNacimiento": "1998-08-21",
    "source": "fc26"
  },
  "platense|Ignacio Vázquez (CB)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 13,
    "age": 28,
    "fechaNacimiento": "1997-06-15",
    "source": "fc26"
  },
  "platense|Mauro Luna Diale (CM)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 75,
    "age": 26,
    "fechaNacimiento": "1999-04-26",
    "source": "fc26"
  },
  "platense|Leonardo Heredia (ST)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 12,
    "age": 29,
    "fechaNacimiento": "1996-01-11",
    "source": "fc26"
  },
  "platense|Augusto Lotti (ST)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 21,
    "age": 29,
    "fechaNacimiento": "1996-06-10",
    "source": "fc26"
  },
  "platense|Juan Saborido (RB)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 27,
    "fechaNacimiento": "1998-04-25",
    "source": "fc26"
  },
  "platense|Maximiliano Amarfil (CM)": {
    "overall": 70,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "platense|Guido Mainero (RM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1995-03-23",
    "source": "fc26"
  },
  "platense|Franco Zapiola (LM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2001-02-19",
    "source": "fc26"
  },
  "platense|Bautista Merlini (CAM)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1995-07-04",
    "source": "fc26"
  },
  "sarmiento|Mauricio Martínez (CDM)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 16,
    "age": 32,
    "fechaNacimiento": "1993-02-20",
    "source": "fc26"
  },
  "sarmiento|Jonatan Gómez (CM)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 16,
    "age": 35,
    "fechaNacimiento": "1989-12-21",
    "source": "fc26"
  },
  "sarmiento|Juan Manuel Insaurralde (CB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 2,
    "age": 40,
    "fechaNacimiento": "1984-10-03",
    "source": "fc26"
  },
  "sarmiento|Junior Marabel (ST)": {
    "overall": 69,
    "nationality": "Paraguay",
    "dorsal": 27,
    "age": 27,
    "fechaNacimiento": "1998-03-26",
    "source": "fc26"
  },
  "sarmiento|Javier Burrai (GK)": {
    "overall": 72,
    "nationality": "Ecuador",
    "dorsal": 1,
    "age": 34,
    "fechaNacimiento": "1990-10-09",
    "source": "fc26"
  },
  "sarmiento|Lucas Suárez (CB)": {
    "overall": 69,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "sarmiento|Yair Arismendi (LB)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 26,
    "age": 27,
    "fechaNacimiento": "1998-04-05",
    "source": "fc26"
  },
  "sarmiento|Cristian Zabala (CDM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1998-03-04",
    "source": "fc26"
  },
  "sarmiento|Carlos Villalba (CM)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 26,
    "fechaNacimiento": "1998-07-19",
    "source": "fc26"
  },
  "sarmiento|Renzo Orihuela (CB)": {
    "overall": 68,
    "nationality": "Uruguay",
    "dorsal": 44,
    "age": 24,
    "fechaNacimiento": "2001-04-04",
    "source": "fc26"
  },
  "sarmiento|Gastón González (LM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 27,
    "age": 24,
    "fechaNacimiento": "2001-06-27",
    "source": "fc26"
  },
  "central_cordoba|Lucas González (CM)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "2000-06-03",
    "source": "fc26"
  },
  "central_cordoba|Michael Santos (ST)": {
    "overall": 70,
    "nationality": "Uruguay",
    "dorsal": 7,
    "age": 32,
    "fechaNacimiento": "1993-03-13",
    "source": "fc26"
  },
  "central_cordoba|Alan Aguerre (GK)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 34,
    "fechaNacimiento": "1990-08-23",
    "source": "fc26"
  },
  "central_cordoba|Facundo Mansilla (CB)": {
    "overall": 68,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "central_cordoba|Horacio Tijanovich (LM)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1996-02-28",
    "source": "fc26"
  },
  "central_cordoba|Alejandro Maciel (CB)": {
    "overall": 67,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "central_cordoba|Matías Vera (CDM)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 34,
    "age": 29,
    "fechaNacimiento": "1995-10-26",
    "source": "fc26"
  },
  "central_cordoba|Ezequiel Naya (ST)": {
    "overall": 67,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "central_cordoba|Marco Iacobellis (RM)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 28,
    "age": 25,
    "fechaNacimiento": "1999-12-27",
    "source": "fc26"
  },
  "central_cordoba|Santiago Moyano (RB)": {
    "overall": 66,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "central_cordoba|Juan Pablo Pignani (CB)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 42,
    "age": 23,
    "fechaNacimiento": "2001-07-02",
    "source": "fc26"
  },
  "barracas|Iván Tapia (CAM)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1998-11-23",
    "source": "fc26"
  },
  "barracas|Facundo Bruera (ST)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1998-09-18",
    "source": "fc26"
  },
  "barracas|Yonatthan Rak (CB)": {
    "overall": 71,
    "nationality": "Uruguay",
    "dorsal": 15,
    "age": 31,
    "fechaNacimiento": "1993-08-18",
    "source": "fc26"
  },
  "barracas|Rodrigo Insua (LB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1997-12-16",
    "source": "fc26"
  },
  "barracas|Gonzalo Maroni (CAM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 20,
    "age": 26,
    "fechaNacimiento": "1999-03-18",
    "source": "fc26"
  },
  "barracas|Juan Espínola (GK)": {
    "overall": 71,
    "nationality": "Paraguay",
    "dorsal": 12,
    "age": 30,
    "fechaNacimiento": "1994-11-02",
    "source": "fc26"
  },
  "barracas|Dardo Miloc (CDM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 34,
    "fechaNacimiento": "1990-10-16",
    "source": "fc26"
  },
  "barracas|Gonzalo Morales (ST)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 22,
    "fechaNacimiento": "2003-03-04",
    "source": "fc26"
  },
  "barracas|Gastón Campi (CB)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 37,
    "age": 34,
    "fechaNacimiento": "1991-04-06",
    "source": "fc26"
  },
  "barracas|Damián Martínez (RB)": {
    "overall": 85,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 32,
    "fechaNacimiento": "1992-09-02",
    "source": "fc26"
  },
  "barracas|Rodrigo Bogarín (CAM)": {
    "overall": 69,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "indep_rivadavia|Matías Reali": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 28,
    "fechaNacimiento": "1997-01-14",
    "source": "fc26"
  },
  "indep_rivadavia|Francisco Petrasso": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 23,
    "fechaNacimiento": "2002-01-28",
    "source": "fc26"
  },
  "indep_rivadavia|Gastón Gil Romero": {
    "overall": 68,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "indep_rivadavia|Gonzalo Marinelli": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 36,
    "fechaNacimiento": "1989-02-07",
    "source": "fc26"
  },
  "riestra|Jonathan Herrera": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 33,
    "fechaNacimiento": "1991-09-16",
    "source": "fc26"
  },
  "riestra|Milton Céliz": {
    "overall": 63,
    "nationality": "Argentina",
    "dorsal": 8,
    "age": 32,
    "fechaNacimiento": "1992-07-25",
    "source": "fc26"
  },
  "riestra|Nicolás Caro Torres": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 3,
    "age": 30,
    "fechaNacimiento": "1995-05-04",
    "source": "fc26"
  },
  "riestra|Ignacio Arce": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 33,
    "fechaNacimiento": "1992-04-08",
    "source": "fc26"
  },
  "aldosivi|Sebastián Moyano (GK)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 17,
    "age": 34,
    "fechaNacimiento": "1990-08-26",
    "source": "fc26"
  },
  "aldosivi|Axel Werner (GK)": {
    "overall": 70,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "aldosivi|Guillermo Enrique (RB)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 25,
    "fechaNacimiento": "2000-02-24",
    "source": "fc26"
  },
  "aldosivi|Nicolás Zalazar (CB)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-01-29",
    "source": "fc26"
  },
  "aldosivi|Joaquín Novillo (CB)": {
    "overall": 69,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "aldosivi|Esteban Rolón (CDM)": {
    "overall": 69,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "aldosivi|Néstor Breitenbruch (CB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 29,
    "fechaNacimiento": "1995-09-13",
    "source": "fc26"
  },
  "aldosivi|Nicolás Cordero (ST)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1999-04-11",
    "source": "fc26"
  },
  "aldosivi|Alan Sosa (LM)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2003-05-05",
    "source": "fc26"
  },
  "aldosivi|Lucas Rodríguez (LB)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 31,
    "fechaNacimiento": "1993-09-27",
    "source": "fc26"
  },
  "aldosivi|Ignacio Chicco (GK)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 29,
    "fechaNacimiento": "1996-06-30",
    "source": "fc26"
  },
  "estudiantes_rc|Guillermo Villalba": {
    "overall": 62,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "estudiantes_rc|Tomás González": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "estudiantes_rc|Gastón Arturia": {
    "overall": 64,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "estudiantes_rc|Williams Barlasina": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 30,
    "age": 27,
    "fechaNacimiento": "1998-06-29",
    "source": "fc26"
  },
  "gimnasia_mza|Aaron Spetale": {
    "overall": 64,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "gimnasia_mza|Leandro Ciccolini": {
    "overall": 61,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "gimnasia_mza|Maximiliano Padilla": {
    "overall": 63,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "gimnasia_mza|Luis Ojeda": {
    "overall": 63,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "godoy_cruz|Roberto Ramírez (GK)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 12,
    "age": 28,
    "fechaNacimiento": "1996-07-07",
    "source": "fc26"
  },
  "godoy_cruz|Lucas Arce (RB)": {
    "overall": 70,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "godoy_cruz|Mateo Mendoza (CB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 26,
    "age": 20,
    "fechaNacimiento": "2004-11-21",
    "source": "fc26"
  },
  "godoy_cruz|Vicente Poggi (CM)": {
    "overall": 70,
    "nationality": "Uruguay",
    "dorsal": 25,
    "age": 22,
    "fechaNacimiento": "2002-07-11",
    "source": "fc26"
  },
  "godoy_cruz|Nahuel Ulariaga (ST)": {
    "overall": 69,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "godoy_cruz|Matías Ramírez (LM)": {
    "overall": 69,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "godoy_cruz|Gastón Gil Romero (CDM)": {
    "overall": 68,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "godoy_cruz|Misael Sosa (RW)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 20,
    "age": 23,
    "fechaNacimiento": "2002-01-28",
    "source": "fc26"
  },
  "godoy_cruz|Esteban Burgos (CB)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 20,
    "age": 33,
    "fechaNacimiento": "1992-01-09",
    "source": "fc26"
  },
  "godoy_cruz|Martín Pino (ST)": {
    "overall": 67,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "godoy_cruz|Federico Milo (LB)": {
    "overall": 67,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "agropecuario|Carlos Auzqui (CAM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 28,
    "age": 34,
    "fechaNacimiento": "1991-03-16",
    "source": "fc26"
  },
  "agropecuario|Rodrigo Castro (CAM)": {
    "overall": 67,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "agropecuario|Brian Blando (ST)": {
    "overall": 66,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "agropecuario|Alejandro Gagliardi (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "agropecuario|Tomás Lecanda (CB)": {
    "overall": 64,
    "nationality": "Argentina",
    "dorsal": 29,
    "age": 23,
    "fechaNacimiento": "2002-01-29",
    "source": "fc26"
  },
  "agropecuario|Luciano Acosta (GK)": {
    "overall": 64,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "agropecuario|Alan Aguirre (CB)": {
    "overall": 64,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "agropecuario|Santiago Gallucci (CDM)": {
    "overall": 64,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "agropecuario|Jorge Valdéz Chamarro (CM)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "agropecuario|Rodrigo Mosqueira (LM)": {
    "overall": 63,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "agropecuario|Milton Ramos (LB)": {
    "overall": 63,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "all_boys|Ricardo Blanco (CAM)": {
    "overall": 69,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "all_boys|Iván Zafarana (CB)": {
    "overall": 68,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "all_boys|Maximiliano Coronel (CB)": {
    "overall": 68,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "all_boys|Hernán Grana (RB)": {
    "overall": 67,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "all_boys|Agustin Gallo (CM)": {
    "overall": 67,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "all_boys|Matías Nouet (RW)": {
    "overall": 65,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "all_boys|Franco Quiróz (LB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "all_boys|Emiliano Purita (RB)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "all_boys|Alejo Tabares (LM)": {
    "overall": 63,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 24,
    "fechaNacimiento": "2001-06-20",
    "source": "fc26"
  },
  "all_boys|Tomás Assenato (CM)": {
    "overall": 63,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "all_boys|Juan Pablo Noce (GK)": {
    "overall": 63,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "almagro|Andrés Chávez (ST)": {
    "overall": 69,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "almagro|Gonzalo Asís (RB)": {
    "overall": 67,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "almagro|Matías Cortave (CB)": {
    "overall": 65,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "almagro|Franco Bustamante (RM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "almagro|Julián Marchioni (CM)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "almagro|Santiago Úbeda (CM)": {
    "overall": 64,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "almagro|Tobías Macies (CAM)": {
    "overall": 64,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "almagro|Gino Barbieri (CB)": {
    "overall": 64,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "almagro|Enzo Silcan (LB)": {
    "overall": 63,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "almagro|Enzo Martínez (LM)": {
    "overall": 71,
    "nationality": "Uruguay",
    "dorsal": 21,
    "age": 27,
    "fechaNacimiento": "1998-04-29",
    "source": "fc26"
  },
  "almagro|Juan Pablo Zozaya (GK)": {
    "overall": 63,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 23,
    "fechaNacimiento": "2001-08-13",
    "source": "fc26"
  },
  "almirante_brown|Facundo Quignon (CDM)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 19,
    "age": 32,
    "fechaNacimiento": "1993-05-02",
    "source": "fc26"
  },
  "almirante_brown|Gustavo Cabral (CB)": {
    "overall": 71,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "almirante_brown|Leonardo Jara (RB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 29,
    "age": 34,
    "fechaNacimiento": "1991-05-20",
    "source": "fc26"
  },
  "almirante_brown|Agustín Dattola (CB)": {
    "overall": 68,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "almirante_brown|Jonatan Goya (CAM)": {
    "overall": 66,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "almirante_brown|Nazareno Bazán (ST)": {
    "overall": 65,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "almirante_brown|Máximo Levi (CB)": {
    "overall": 64,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "almirante_brown|Tomas Villoldo (LB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "almirante_brown|Hernan Perrone (CM)": {
    "overall": 64,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "almirante_brown|Tobías Zárate (ST)": {
    "overall": 64,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "almirante_brown|Ramiro Fernández (LB)": {
    "overall": 63,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "atlanta|Christian Bernardi (CAM)": {
    "overall": 74,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "atlanta|Nicolás Previtali (CDM)": {
    "overall": 67,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "atlanta|Leonel Galeano (CB)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 33,
    "fechaNacimiento": "1991-08-02",
    "source": "fc26"
  },
  "atlanta|Braian Rivero (CDM)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "atlanta|Alejandro Quintana (ST)": {
    "overall": 66,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "atlanta|Tomás Castro Ponce (CAM)": {
    "overall": 66,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "atlanta|Francisco Rago (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "atlanta|Rodrigo Moreira (CB)": {
    "overall": 65,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "atlanta|Martin García (RB)": {
    "overall": 64,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "atlanta|Gustavo Mendoza (CDM)": {
    "overall": 59,
    "nationality": "Bolivia",
    "dorsal": 34,
    "age": 21,
    "fechaNacimiento": "2004-05-11",
    "source": "fc26"
  },
  "atlanta|Federico Castro (ST)": {
    "overall": 64,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "central_norte|Arián Pucheta (CB)": {
    "overall": 66,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "central_norte|Ramiro Costa (ST)": {
    "overall": 66,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "central_norte|Agustin Aleo (LB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "central_norte|Mauricio Rosales (RB)": {
    "overall": 64,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "central_norte|Gonzalo Álvez (RM)": {
    "overall": 64,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "central_norte|Maximiliano Padilla (LB)": {
    "overall": 63,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "central_norte|Matías Villarreal (CDM)": {
    "overall": 63,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "central_norte|Kevin Fernández (CAM)": {
    "overall": 63,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "central_norte|Franco Vedoya (RW)": {
    "overall": 62,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "central_norte|Joaquin Mateo (ST)": {
    "overall": 62,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "central_norte|Leonardo Felissia (CB)": {
    "overall": 62,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "chaco_for_ever|Bahiano García (CDM)": {
    "overall": 67,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "chaco_for_ever|Matías Noble (LM)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "chaco_for_ever|Andrés Lioi (RM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "chaco_for_ever|Gabriel Ramírez (CM)": {
    "overall": 66,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "chaco_for_ever|Tomás Bolzicco (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "chaco_for_ever|Ricardo Garay (CB)": {
    "overall": 65,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "chaco_for_ever|Brian Nievas (CDM)": {
    "overall": 64,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "chaco_for_ever|Gaston Canuto (GK)": {
    "overall": 63,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "chaco_for_ever|David Valdez (CB)": {
    "overall": 63,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "chaco_for_ever|Lucas Pruzzo (LB)": {
    "overall": 63,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "chaco_for_ever|Agustin Alonso (RM)": {
    "overall": 63,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "colegiales|Emanuel Insua (LB)": {
    "overall": 68,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "colegiales|Mauro Albertengo (ST)": {
    "overall": 66,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "colegiales|Leandro Martínez Montagnoli (CB)": {
    "overall": 66,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "colegiales|Gonzalo Baglivo (CDM)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "colegiales|Facundo Rivero (CB)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "colegiales|Lucio Castillo (CAM)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "colegiales|Nicolás Toloza (ST)": {
    "overall": 64,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "colegiales|Alejandro Chiavetto (CM)": {
    "overall": 63,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "colegiales|Elías Ocampo (RM)": {
    "overall": 62,
    "nationality": "Argentina",
    "dorsal": 37,
    "age": 21,
    "fechaNacimiento": "2004-02-26",
    "source": "fc26"
  },
  "colegiales|Leonardo González (RW)": {
    "overall": 62,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "colegiales|Mateo Mamaní (ST)": {
    "overall": 62,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "colon|Federico Lértora (CDM)": {
    "overall": 75,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "colon|Pier Barrios (CB)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 2,
    "age": 35,
    "fechaNacimiento": "1990-07-01",
    "source": "fc26"
  },
  "colon|Federico Rasmussen (CB)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 33,
    "fechaNacimiento": "1992-03-04",
    "source": "fc26"
  },
  "colon|Mauro Peinipil (RB)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1999-04-03",
    "source": "fc26"
  },
  "colon|Facundo Castro (ST)": {
    "overall": 67,
    "nationality": "Uruguay",
    "dorsal": 9,
    "age": 30,
    "fechaNacimiento": "1995-01-22",
    "source": "fc26"
  },
  "colon|Nicolás Thaller (CB)": {
    "overall": 68,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "colon|Matías Godoy (LM)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 19,
    "age": 23,
    "fechaNacimiento": "2002-01-10",
    "source": "fc26"
  },
  "colon|Lucas Cano (ST)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 30,
    "fechaNacimiento": "1995-05-09",
    "source": "fc26"
  },
  "colon|Agustín Toledo (CDM)": {
    "overall": 66,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "colon|Darío Sarmiento (RM)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 22,
    "fechaNacimiento": "2003-03-29",
    "source": "fc26"
  },
  "colon|Emanuel Beltrán (RB)": {
    "overall": 64,
    "nationality": "Uruguay",
    "dorsal": 17,
    "age": 27,
    "fechaNacimiento": "1998-01-23",
    "source": "fc26"
  },
  "dep_maipu|Fausto Emanuel Montero (CM)": {
    "overall": 65,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "dep_maipu|Nicolás Faggioli (CB)": {
    "overall": 64,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "dep_maipu|Gastón Mansilla (RM)": {
    "overall": 64,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "dep_maipu|Nahuel Galardi (GK)": {
    "overall": 63,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "dep_maipu|Juan Pablo Gobetto (CM)": {
    "overall": 63,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "dep_maipu|Matias Viguet (LM)": {
    "overall": 63,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "dep_maipu|Nicolás Fernández (CB)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "2000-01-11",
    "source": "fc26"
  },
  "dep_maipu|Mirko Bonfigli (CM)": {
    "overall": 62,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "dep_maipu|Marcelo Eggel (CAM)": {
    "overall": 62,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "dep_maipu|Felipe Rivarola (ST)": {
    "overall": 62,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "dep_maipu|Luciano Arnijas (CM)": {
    "overall": 61,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "dep_moron|Mariano Bíttolo (LB)": {
    "overall": 71,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "dep_moron|Juan Cruz Esquivel (LW)": {
    "overall": 68,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "dep_moron|Gonzalo Berterame (RM)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "dep_moron|Juan Manuel Olivares (CM)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "dep_moron|Matías Benítez (RW)": {
    "overall": 65,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "dep_moron|Julio Salvá (GK)": {
    "overall": 64,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "dep_moron|Braian Salvareschi (CB)": {
    "overall": 64,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "dep_moron|Joaquín Livera (LB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "dep_moron|Santiago Kubiszyn (CAM)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "dep_moron|Franco Toloza (ST)": {
    "overall": 64,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 31,
    "fechaNacimiento": "1994-05-05",
    "source": "fc26"
  },
  "dep_moron|Francisco Flores (CB)": {
    "overall": 64,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "guemes|Marcelo Benítez (LB)": {
    "overall": 72,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "guemes|Oscar Vanegas (CB)": {
    "overall": 68,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "guemes|Tomás Oneto (CB)": {
    "overall": 66,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "guemes|Juan Sánchez Sotelo (ST)": {
    "overall": 66,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "guemes|Fernando Godoy (CM)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "guemes|David Véliz (LM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "guemes|Thomas Amilivia (ST)": {
    "overall": 64,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "guemes|Axel Bordón (RB)": {
    "overall": 64,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "guemes|Maico Quiroz (CDM)": {
    "overall": 64,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "guemes|Leandro Finochietto (GK)": {
    "overall": 63,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "guemes|Gianluca Pugliese (LW)": {
    "overall": 63,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "los_andes|Brian Leizza (CB)": {
    "overall": 67,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "los_andes|Sergio Fabián Ortíz (CM)": {
    "overall": 67,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "los_andes|Daniel Franco (CB)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 13,
    "age": 33,
    "fechaNacimiento": "1991-07-15",
    "source": "fc26"
  },
  "los_andes|Gabriel Carrasco (RB)": {
    "overall": 66,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "los_andes|Julián Navas (RB)": {
    "overall": 66,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "los_andes|Mario Galeano (ST)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "los_andes|Mauricio Asenjo (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "los_andes|Matías González (RM)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 21,
    "age": 23,
    "fechaNacimiento": "2002-02-28",
    "source": "fc26"
  },
  "los_andes|Sebastian López (GK)": {
    "overall": 64,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "los_andes|Juan Manuel Vázquez (LM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "los_andes|Javier Bustillos (GK)": {
    "overall": 64,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "nueva_chicago|Alan Nahuel Ruiz (CAM)": {
    "overall": 69,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "nueva_chicago|Emiliano Méndez (CDM)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 13,
    "age": 36,
    "fechaNacimiento": "1989-02-15",
    "source": "fc26"
  },
  "nueva_chicago|Gonzalo Paz (CB)": {
    "overall": 68,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "nueva_chicago|Guillermo Ferracuti (LB)": {
    "overall": 67,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "nueva_chicago|Ramiro Balbuena (RM)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "nueva_chicago|Dylan Gissi (CB)": {
    "overall": 66,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "nueva_chicago|Gabriel Vega (CM)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 27,
    "age": 23,
    "fechaNacimiento": "2002-04-18",
    "source": "fc26"
  },
  "nueva_chicago|Matías Vera (RB)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 34,
    "age": 29,
    "fechaNacimiento": "1995-10-26",
    "source": "fc26"
  },
  "nueva_chicago|Luciano Jachfe (GK)": {
    "overall": 64,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "nueva_chicago|Sebastían Cocimano (ST)": {
    "overall": 64,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "nueva_chicago|Bruno Palazzo (CB)": {
    "overall": 63,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "patronato|Renzo Reynaga (ST)": {
    "overall": 68,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "patronato|Federico Bravo (CDM)": {
    "overall": 67,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "patronato|Hernán Rivero (ST)": {
    "overall": 67,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "patronato|Marcos Enrique (CDM)": {
    "overall": 66,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "patronato|Franco Meritello (CB)": {
    "overall": 65,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "patronato|Fernando Evangelista (LB)": {
    "overall": 65,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "patronato|Alan Sosa (GK)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2003-05-05",
    "source": "fc26"
  },
  "patronato|Fernando Moreyra (CB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "patronato|Agustin Araujo (LM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "patronato|Franco Soldano (ST)": {
    "overall": 64,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "patronato|Maximiliano Rueda (CM)": {
    "overall": 64,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "racing_cba|Ricardo Centurión (LM)": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "racing_cba|Sebastian Marfort (CB)": {
    "overall": 69,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "racing_cba|Alejandro Rébola (CB)": {
    "overall": 67,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "racing_cba|Marcio Gómez (CB)": {
    "overall": 67,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "racing_cba|Gaspar Vega (CM)": {
    "overall": 66,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "racing_cba|Pablo Chavarría (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "racing_cba|Gabriel Aranda (CB)": {
    "overall": 65,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "racing_cba|Gaspar Iñiguez (CM)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 28,
    "age": 31,
    "fechaNacimiento": "1994-03-26",
    "source": "fc26"
  },
  "racing_cba|Luciano Viano (LW)": {
    "overall": 64,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "racing_cba|Gonzalo Laborda (GK)": {
    "overall": 64,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "racing_cba|Sergio González (ST)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1997-05-14",
    "source": "fc26"
  },
  "san_miguel|Leandro Desábato (CDM)": {
    "overall": 71,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "san_miguel|Lucas Brochero (RM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "san_miguel|Bruno Nasta (ST)": {
    "overall": 66,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "san_miguel|Daniel Juárez (ST)": {
    "overall": 66,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "san_miguel|Juan Lungarzo (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "san_miguel|Lucas Delgado (ST)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "san_miguel|Facundo Omar Cardozo (LB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "san_miguel|Alexis Cruz (LB)": {
    "overall": 64,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "san_miguel|Lucio Pérez (RB)": {
    "overall": 63,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "san_miguel|Dixon Renteria (CB)": {
    "overall": 63,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "san_miguel|Máximo Oses (LM)": {
    "overall": 63,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "san_telmo|Facundo Roncaglia (CB)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 14,
    "age": 38,
    "fechaNacimiento": "1987-02-10",
    "source": "fc26"
  },
  "san_telmo|Matías Laba (CDM)": {
    "overall": 67,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "san_telmo|Fabián Henríquez (CM)": {
    "overall": 65,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "san_telmo|Javier Iritier (LW)": {
    "overall": 65,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "san_telmo|Martín Batallini (ST)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "san_telmo|Franco Tisera (ST)": {
    "overall": 63,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "san_telmo|Lucas Baldunciel (RW)": {
    "overall": 63,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "san_telmo|Emanuel Díaz (CB)": {
    "overall": 63,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "san_telmo|Juan Cruz Zurbriggen (ST)": {
    "overall": 63,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "san_telmo|Gabriel Paredes (LB)": {
    "overall": 63,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 21,
    "fechaNacimiento": "2003-12-12",
    "source": "fc26"
  },
  "san_telmo|Elías Brítez (CM)": {
    "overall": 62,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "temperley|Gabriel Hauche (CAM)": {
    "overall": 70,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "temperley|Gabriel Esparza (LW)": {
    "overall": 70,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "temperley|Adrián Arregui (CDM)": {
    "overall": 69,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "temperley|Franco Díaz (CDM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 30,
    "age": 24,
    "fechaNacimiento": "2000-08-28",
    "source": "fc26"
  },
  "temperley|Fernando Brandán (LM)": {
    "overall": 67,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "temperley|Ezequiel Mastrolía (GK)": {
    "overall": 66,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "temperley|Luciano Nieto (CAM)": {
    "overall": 66,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "temperley|Pedro Souto (LB)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 27,
    "age": 25,
    "fechaNacimiento": "2000-05-05",
    "source": "fc26"
  },
  "temperley|Jerónimo Pourtau (GK)": {
    "overall": 66,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "temperley|Santiago Flores (CB)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2001-03-25",
    "source": "fc26"
  },
  "temperley|Gian Nardelli (CB)": {
    "overall": 65,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "tristan_suarez|Nicolás Sánchez (LM)": {
    "overall": 69,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "tristan_suarez|Diego Becker (LM)": {
    "overall": 69,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "tristan_suarez|Manuel Guillén (RB)": {
    "overall": 69,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "tristan_suarez|Joaquín Trasante (CM)": {
    "overall": 67,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "tristan_suarez|Joaquín Bigo (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "tristan_suarez|Agustín Baldi (CB)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 45,
    "age": 23,
    "fechaNacimiento": "2002-05-11",
    "source": "fc26"
  },
  "tristan_suarez|Nicolás Fernández (LB)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "2000-01-11",
    "source": "fc26"
  },
  "tristan_suarez|Nicolás Del Priore (CM)": {
    "overall": 65,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "tristan_suarez|Álvaro Veliez (ST)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "tristan_suarez|Mauricio Manuel Guzmán (CB)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "tristan_suarez|Alejandro Molina (RB)": {
    "overall": 64,
    "nationality": "Argentina",
    "dorsal": 4,
    "age": 27,
    "fechaNacimiento": "1997-08-10",
    "source": "fc26"
  },
  "midland|Fernando González (CB)": {
    "overall": 66,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "midland|Juan Cruz Vega (CAM)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "midland|Agustín Campana (LW)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "midland|Leonel Gigli (CB)": {
    "overall": 64,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "midland|Emilio Porro (RB)": {
    "overall": 64,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "midland|Lautaro Díaz Laharque (RB)": {
    "overall": 63,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "midland|Genaro Cepeda (CB)": {
    "overall": 63,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "midland|Maximiliano Rogoski (CM)": {
    "overall": 63,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "midland|Santino Primante (ST)": {
    "overall": 63,
    "nationality": "Argentina",
    "dorsal": 74,
    "age": 20,
    "fechaNacimiento": "2004-12-20",
    "source": "fc26"
  },
  "midland|Pablo Casarico (CB)": {
    "overall": 62,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "midland|Marcos Roseti (RM)": {
    "overall": 62,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "acassuso|Kevin Dubini (CAM)": {
    "overall": 65,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "acassuso|David Escalante (ST)": {
    "overall": 64,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "acassuso|Mariano Monllor (GK)": {
    "overall": 63,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "acassuso|Ramiro Reynoso (CM)": {
    "overall": 63,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "acassuso|Gabriel Atamañuk (GK)": {
    "overall": 63,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "acassuso|Lucas Rey (RW)": {
    "overall": 63,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "acassuso|Álex Ruiz (LB)": {
    "overall": 62,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "acassuso|Nahuel Petillo (CM)": {
    "overall": 62,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "acassuso|Juan Ponce de León (RB)": {
    "overall": 61,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "acassuso|Lucas Pioli (CB)": {
    "overall": 61,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "acassuso|Joel Gonzalo Ghirardello (CB)": {
    "overall": 61,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "alvarado|Tomás Berra (CB)": {
    "overall": 66,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "alvarado|Tomás Fernández (CB)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 27,
    "age": 26,
    "fechaNacimiento": "1998-08-08",
    "source": "fc26"
  },
  "alvarado|Leonardo Incorvaia (CB)": {
    "overall": 64,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "alvarado|Fermín Iriarte (RB)": {
    "overall": 63,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "alvarado|Nahuel González (GK)": {
    "overall": 63,
    "nationality": "Argentina",
    "dorsal": 41,
    "age": 20,
    "fechaNacimiento": "2004-07-06",
    "source": "fc26"
  },
  "alvarado|Nahuel Speck (LW)": {
    "overall": 63,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "alvarado|Lucas Chiozza (CAM)": {
    "overall": 62,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "alvarado|Germán Cervera (ST)": {
    "overall": 62,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "alvarado|Facundo Centurión (CB)": {
    "overall": 62,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "alvarado|Germán Sosa (ST)": {
    "overall": 62,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "alvarado|Cristian Gorgerino (LB)": {
    "overall": 61,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "armenio|Franco Vega (CM)": {
    "overall": 63,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "armenio|Benjamín Ortíz (CDM)": {
    "overall": 63,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "armenio|Diego Nakache (ST)": {
    "overall": 62,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "armenio|Nicolas Sánchez (RM)": {
    "overall": 61,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "armenio|Facundo Tello (CM)": {
    "overall": 60,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "armenio|Federico Marchesini (CB)": {
    "overall": 59,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "armenio|Lucas Palma (ST)": {
    "overall": 59,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "armenio|Valentin Chocobar (CAM)": {
    "overall": 59,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "armenio|Juan Pablo Domínguez (GK)": {
    "overall": 56,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "armenio|Nahuel Troxler (RB)": {
    "overall": 55,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "armenio|Leandro Ramos (CAM)": {
    "overall": 55,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "boca_unidos|Daniel Villalva (LM)": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "boca_unidos|Esteban Orfano (RM)": {
    "overall": 64,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "boca_unidos|Cristian Chávez (ST)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "boca_unidos|Luis Ojeda (GK)": {
    "overall": 63,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "boca_unidos|Antonio Medina (ST)": {
    "overall": 62,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "boca_unidos|Sebastián Navarro (CM)": {
    "overall": 69,
    "nationality": "Colombia",
    "dorsal": 21,
    "age": 24,
    "fechaNacimiento": "2000-07-15",
    "source": "fc26"
  },
  "boca_unidos|Bryan Mendoza (RM)": {
    "overall": 57,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "boca_unidos|Ataliva Schweizer (CDM)": {
    "overall": 56,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "boca_unidos|Pablo Moreyra (CB)": {
    "overall": 55,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "boca_unidos|Ángel Piz (CM)": {
    "overall": 55,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "boca_unidos|Martín Ojeda (CM)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1998-11-27",
    "source": "fc26"
  },
  "brown_adrogue|Adriel Ortíz (LB)": {
    "overall": 58,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "brown_adrogue|Nicolás Meaurio (CAM)": {
    "overall": 58,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "brown_adrogue|Elián Robles (CM)": {
    "overall": 57,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "brown_adrogue|Matías Sproat (RW)": {
    "overall": 57,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "brown_adrogue|Jonatan Bogado (RB)": {
    "overall": 56,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "brown_adrogue|Lucas Irusta (CB)": {
    "overall": 56,
    "nationality": "Argentina",
    "dorsal": 31,
    "age": 22,
    "fechaNacimiento": "2003-01-08",
    "source": "fc26"
  },
  "brown_adrogue|Juan Ignacio Silva (CDM)": {
    "overall": 56,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "brown_adrogue|Octavio Padovani (ST)": {
    "overall": 56,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "brown_adrogue|Víctor Galeano (RW)": {
    "overall": 56,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "brown_adrogue|Lucas Galván (CAM)": {
    "overall": 55,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "brown_adrogue|Lucas Cesare (RB)": {
    "overall": 55,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "cipoletti|Claudio Mosca (LM)": {
    "overall": 67,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "cipoletti|Brandon Obregón (CAM)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "cipoletti|Facundo Crespo (GK)": {
    "overall": 56,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "cipoletti|Víctor Manchafico (CB)": {
    "overall": 56,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "cipoletti|Fernando Pettineroli (RM)": {
    "overall": 56,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "cipoletti|Sebastián Jeldres (ST)": {
    "overall": 56,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "cipoletti|Yago Piro (CB)": {
    "overall": 55,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "cipoletti|Gonzalo Lucero (LM)": {
    "overall": 58,
    "nationality": "Argentina",
    "dorsal": 31,
    "age": 21,
    "fechaNacimiento": "2003-11-29",
    "source": "fc26"
  },
  "cipoletti|Andrés Almirón (RW)": {
    "overall": 55,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "cipoletti|Marcos Pérez (CM)": {
    "overall": 54,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "cipoletti|Maximiliano López (LW)": {
    "overall": 54,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "def_unidos|Martin Gimenez (ST)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "def_unidos|Fabricio Henricot (GK)": {
    "overall": 64,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "def_unidos|Luis Olivera (LB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "def_unidos|Maximiliano Ortigoza (RM)": {
    "overall": 64,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "def_unidos|Fernando Arébalo (RB)": {
    "overall": 63,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "def_unidos|Alan Sombra (ST)": {
    "overall": 63,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "def_unidos|Mauro Alarcon (RB)": {
    "overall": 62,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "def_unidos|Franco Suárez (CB)": {
    "overall": 62,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "def_unidos|Kevin Redondo (CDM)": {
    "overall": 62,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "def_unidos|Julio López (CB)": {
    "overall": 61,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "def_unidos|Matias Rapetti (LB)": {
    "overall": 61,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "dock_sud|Gonzalo Gómez (RM)": {
    "overall": 61,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "dock_sud|Sebastian Vivas (ST)": {
    "overall": 61,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "dock_sud|Federico Cataldi (LB)": {
    "overall": 57,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "dock_sud|Pablo Despósito (CM)": {
    "overall": 56,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "dock_sud|Nicolás Sánchez (ST)": {
    "overall": 56,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "dock_sud|Santiago Villarreal (RB)": {
    "overall": 61,
    "nationality": "Argentina",
    "dorsal": 42,
    "age": 19,
    "fechaNacimiento": "2005-11-20",
    "source": "fc26"
  },
  "dock_sud|Federico Otero (LM)": {
    "overall": 55,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "dock_sud|Giuliano Gualtieri (CM)": {
    "overall": 54,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "dock_sud|Agustín Arias (ST)": {
    "overall": 54,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "dock_sud|Ariel Barreiro (LB)": {
    "overall": 53,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "dock_sud|Kevin Ghigliazza (CAM)": {
    "overall": 53,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "douglas_haig|Robertino Seratto (CM)": {
    "overall": 65,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "douglas_haig|Guillermo Pereira (CAM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "douglas_haig|Martin Caballo (CDM)": {
    "overall": 59,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "douglas_haig|Marcos Giménez (CM)": {
    "overall": 59,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "douglas_haig|Elián Tus (LW)": {
    "overall": 59,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "douglas_haig|Juan Muriel Orlando (ST)": {
    "overall": 59,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "douglas_haig|Nicolás Canela (CB)": {
    "overall": 57,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "douglas_haig|Fabricio González (ST)": {
    "overall": 57,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "douglas_haig|Boris Magnago (RM)": {
    "overall": 55,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "douglas_haig|Mauro Ponce De León (LM)": {
    "overall": 55,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "douglas_haig|Brian Meza (CDM)": {
    "overall": 54,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "excursionistas|Gonzalo Pedrosa (CB)": {
    "overall": 64,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "excursionistas|Mathias Fernández (RB)": {
    "overall": 61,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "excursionistas|Mariano Arango (LB)": {
    "overall": 59,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "excursionistas|Miguel López (CAM)": {
    "overall": 58,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "excursionistas|Alejandro Ávalos (CM)": {
    "overall": 57,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "excursionistas|Federico Haberkorn (ST)": {
    "overall": 57,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "excursionistas|Nicolás Rodríguez (GK)": {
    "overall": 68,
    "nationality": "Uruguay",
    "dorsal": 77,
    "age": 33,
    "fechaNacimiento": "1991-07-22",
    "source": "fc26"
  },
  "excursionistas|Héctor Igarzábal (CB)": {
    "overall": 56,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "excursionistas|Alan Espeche (RW)": {
    "overall": 56,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "excursionistas|Iván Arbello (LW)": {
    "overall": 56,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "excursionistas|Antonio Paulides (CB)": {
    "overall": 55,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "guillermo_brown|Patricio Cucchi (ST)": {
    "overall": 69,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "guillermo_brown|Emanuel Moreno (LW)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "guillermo_brown|Renzo Paparelli (CB)": {
    "overall": 63,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "guillermo_brown|Martín Rivero (CDM)": {
    "overall": 61,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "guillermo_brown|Rodrigo Díaz (CB)": {
    "overall": 61,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "guillermo_brown|Agustin Álvarez (CB)": {
    "overall": 72,
    "nationality": "Uruguay",
    "dorsal": 25,
    "age": 24,
    "fechaNacimiento": "2001-05-19",
    "source": "fc26"
  },
  "guillermo_brown|Gabriel Lazarte (LB)": {
    "overall": 60,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "guillermo_brown|Francisco Illarregui (RW)": {
    "overall": 60,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "guillermo_brown|Agustín Grinovero (GK)": {
    "overall": 56,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "guillermo_brown|Luis Dezi (ST)": {
    "overall": 56,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "guillermo_brown|Natanael Hernández (LB)": {
    "overall": 56,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "j_antoniana|Pablo Palacios Alvarenga (ST)": {
    "overall": 63,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "j_antoniana|Isaac Monti (CB)": {
    "overall": 62,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "j_antoniana|Martín Esparza (LM)": {
    "overall": 59,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "j_antoniana|Matias Vicedo (ST)": {
    "overall": 58,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "j_antoniana|Leonel Canzoniero (LB)": {
    "overall": 57,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "j_antoniana|Ezequiel Santángelo (RB)": {
    "overall": 57,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "j_antoniana|Gaston Osores (CB)": {
    "overall": 57,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "j_antoniana|Juan Pablo Serrano (GK)": {
    "overall": 56,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "j_antoniana|Gabriel Taborda (CAM)": {
    "overall": 56,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "j_antoniana|Juan Cruz Nadal (GK)": {
    "overall": 56,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "j_antoniana|Nicolás González (RW)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 27,
    "fechaNacimiento": "1998-04-06",
    "source": "fc26"
  },
  "laferrere|Tiago Libares (GK)": {
    "overall": 62,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "laferrere|Alejandro Benítez (CAM)": {
    "overall": 61,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "laferrere|Emanuel Trejo (CDM)": {
    "overall": 60,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "laferrere|Alan Ortíz (CAM)": {
    "overall": 60,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "laferrere|Luciano Nebot (CB)": {
    "overall": 59,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "laferrere|Franco Romero (ST)": {
    "overall": 57,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "laferrere|Benjamín Portillo (CM)": {
    "overall": 56,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "laferrere|Josué Salvadores (CM)": {
    "overall": 56,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "laferrere|Ignacio Cavoret (CB)": {
    "overall": 56,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "laferrere|Nicolás Manzi (CB)": {
    "overall": 55,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "laferrere|Eloy Rodríguez (ST)": {
    "overall": 55,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "olimpo|Braian Guille (LM)": {
    "overall": 64,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1997-07-31",
    "source": "fc26"
  },
  "olimpo|Joaquín Susvielles (ST)": {
    "overall": 64,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "olimpo|Martín Ferreyra (CB)": {
    "overall": 62,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "olimpo|Néstor Moiraghi (CB)": {
    "overall": 62,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "olimpo|Agustin Bellone (RB)": {
    "overall": 62,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "olimpo|Marcelo Olivera (ST)": {
    "overall": 62,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "olimpo|Enzo Coacci (LW)": {
    "overall": 61,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "olimpo|Federico González (ST)": {
    "overall": 61,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "olimpo|Diego Ramírez (CM)": {
    "overall": 60,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "olimpo|Manuel Vargas (CM)": {
    "overall": 60,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "olimpo|Luciano Lapetina (LB)": {
    "overall": 59,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "sp_belgrano|German Lesman (ST)": {
    "overall": 63,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "sp_belgrano|Gianfranco Ferrero (LB)": {
    "overall": 61,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "sp_belgrano|Emanuel Mercado (ST)": {
    "overall": 61,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "sp_belgrano|Brian Flores (CB)": {
    "overall": 60,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "sp_belgrano|Mariano Gancedo (LB)": {
    "overall": 60,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "sp_belgrano|Agustín Pastorelli (LM)": {
    "overall": 60,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "sp_belgrano|Santiago Churchi (CM)": {
    "overall": 59,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "sp_belgrano|Leonardo Martina (GK)": {
    "overall": 57,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "sp_belgrano|Leonardo Ferreyra (RB)": {
    "overall": 57,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "sp_belgrano|Jonathan Paiz (CB)": {
    "overall": 57,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "sp_belgrano|Máximo Forlin (RW)": {
    "overall": 57,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "villa_mitre|Leandro Fernández (LM)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 34,
    "fechaNacimiento": "1991-03-12",
    "source": "fc26"
  },
  "villa_mitre|Hugo Silva (RB)": {
    "overall": 63,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "villa_mitre|Alex Battigelli (CDM)": {
    "overall": 61,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "villa_mitre|Juan Pablo Mazza (GK)": {
    "overall": 60,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "villa_mitre|Guido Segalerba (CB)": {
    "overall": 60,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "villa_mitre|Leonel Monti (RM)": {
    "overall": 60,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "villa_mitre|Marcos Pinto (LM)": {
    "overall": 60,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "villa_mitre|Santos Bacigalupe (CB)": {
    "overall": 56,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "villa_mitre|Mauro Bellone (CM)": {
    "overall": 56,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "villa_mitre|Enzo González (CDM)": {
    "overall": 55,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "villa_mitre|Pablo Mujica (RM)": {
    "overall": 55,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "cruzeiro|Fabrício Bruno (CB)": {
    "overall": 78,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "cruzeiro|Gerson (CM)": {
    "overall": 78,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "cruzeiro|Matheus Pereira (CAM)": {
    "overall": 70,
    "nationality": "Brazil",
    "dorsal": 3,
    "age": 24,
    "fechaNacimiento": "2000-12-21",
    "source": "fc26"
  },
  "cruzeiro|Fagner (RB)": {
    "overall": 76,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "cruzeiro|Lucas Romero (CDM)": {
    "overall": 76,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "cruzeiro|Cássio (GK)": {
    "overall": 76,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "cruzeiro|Wanderson (LW)": {
    "overall": 73,
    "nationality": "Brazil",
    "dorsal": 77,
    "age": 36,
    "fechaNacimiento": "1989-03-31",
    "source": "fc26"
  },
  "cruzeiro|Matheus Henrique (CM)": {
    "overall": 75,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "cruzeiro|Walace (CDM)": {
    "overall": 75,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "cruzeiro|Luis Sinisterra (LW)": {
    "overall": 75,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "cruzeiro|Matheus Cunha (GK)": {
    "overall": 83,
    "nationality": "Brazil",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1999-05-27",
    "source": "fc26"
  },
  "gremio|Weverton (GK)": {
    "overall": 79,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "gremio|Cristian Pavón (RW)": {
    "overall": 78,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "gremio|Martin Braithwaite (ST)": {
    "overall": 77,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "gremio|Juan Ignacio Nardoni (CM)": {
    "overall": 76,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "gremio|Walter Kannemann (CB)": {
    "overall": 76,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "gremio|Arthur (CM)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 13,
    "age": 22,
    "fechaNacimiento": "2003-03-01",
    "source": "fc26"
  },
  "gremio|Tetê (RW)": {
    "overall": 77,
    "nationality": "Brazil",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-02-15",
    "source": "fc26"
  },
  "gremio|Marcos Rocha (RB)": {
    "overall": 75,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "gremio|Willian (LW)": {
    "overall": 74,
    "dorsal": 88,
    "source": "latamfc26"
  },
  "gremio|Mathías Villasanti (CDM)": {
    "overall": 74,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "gremio|Wagner Leonardo (CB)": {
    "overall": 73,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "palmeiras|Felipe Anderson (LW)": {
    "overall": 81,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "palmeiras|Gustavo Gómez (CB)": {
    "overall": 79,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "palmeiras|Vitor Roque (ST)": {
    "overall": 79,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "palmeiras|Jhon Arias (RW)": {
    "overall": 78,
    "nationality": "Colombia",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1997-09-21",
    "source": "fc26"
  },
  "palmeiras|Andreas Pereira (CM)": {
    "overall": 77,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "palmeiras|José Manuel López (ST)": {
    "overall": 76,
    "dorsal": 42,
    "source": "latamfc26"
  },
  "palmeiras|Marcelo Lomba (GK)": {
    "overall": 76,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "palmeiras|Murilo (CB)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 77,
    "age": 30,
    "fechaNacimiento": "1994-10-31",
    "source": "fc26"
  },
  "palmeiras|Ramón Sosa (CAM)": {
    "overall": 75,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "palmeiras|Paulinho (CAM)": {
    "overall": 69,
    "nationality": "Brazil",
    "dorsal": 29,
    "age": 30,
    "fechaNacimiento": "1995-01-03",
    "source": "fc26"
  },
  "palmeiras|Joaquín Piquerez (LB)": {
    "overall": 74,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "botafogo|Alex Telles (LB)": {
    "overall": 79,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "botafogo|Bastos (CB)": {
    "overall": 78,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "botafogo|Allan (CDM)": {
    "overall": 78,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "botafogo|Edenílson (CM)": {
    "overall": 78,
    "dorsal": 88,
    "source": "latamfc26"
  },
  "botafogo|Neto (GK)": {
    "overall": 77,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "botafogo|Danilo (CM)": {
    "overall": 73,
    "nationality": "Brazil",
    "dorsal": 99,
    "age": 26,
    "fechaNacimiento": "1999-04-07",
    "source": "fc26"
  },
  "botafogo|Marçal (LB)": {
    "overall": 76,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "botafogo|Artur (RW)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 6,
    "age": 29,
    "fechaNacimiento": "1996-03-11",
    "source": "fc26"
  },
  "botafogo|Arthur Cabral (ST)": {
    "overall": 76,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "botafogo|Alexander Barboza (CB)": {
    "overall": 75,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "botafogo|Joaquín Correa (CAM)": {
    "overall": 74,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "fluminense|Luciano Acosta (CAM)": {
    "overall": 80,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "fluminense|Germán Cano (ST)": {
    "overall": 80,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "fluminense|Fábio (GK)": {
    "overall": 78,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "fluminense|Guilherme Arana (LB)": {
    "overall": 78,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "fluminense|Jefferson Savarino (CAM)": {
    "overall": 77,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "fluminense|Otávio (CDM)": {
    "overall": 82,
    "nationality": "Portugal",
    "dorsal": 25,
    "age": 30,
    "fechaNacimiento": "1995-02-09",
    "source": "fc26"
  },
  "fluminense|Yeferson Soteldo (LW)": {
    "overall": 76,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "fluminense|Ganso (CAM)": {
    "overall": 76,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "fluminense|Samuel Xavier (RB)": {
    "overall": 75,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "fluminense|John Kennedy (ST)": {
    "overall": 75,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "fluminense|Matheus Martinelli (CDM)": {
    "overall": 74,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "sao_paulo|Jonathan Calleri (ST)": {
    "overall": 78,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "sao_paulo|Rafael Tolói (CB)": {
    "overall": 78,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "sao_paulo|Lucas Moura (RW)": {
    "overall": 77,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "sao_paulo|Wendell (LB)": {
    "overall": 77,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "sao_paulo|Oscar (CAM)": {
    "overall": 76,
    "dorsal": 88,
    "source": "latamfc26"
  },
  "sao_paulo|Pablo Maia (CDM)": {
    "overall": 75,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "sao_paulo|Rafael (GK)": {
    "overall": 68,
    "nationality": "Brazil",
    "dorsal": 1,
    "age": 35,
    "fechaNacimiento": "1990-05-20",
    "source": "fc26"
  },
  "sao_paulo|Enzo Díaz (LB)": {
    "overall": 74,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "sao_paulo|Luciano (ST)": {
    "overall": 74,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "sao_paulo|Ferreirinha (LW)": {
    "overall": 74,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "sao_paulo|André Silva (ST)": {
    "overall": 76,
    "nationality": "Portugal",
    "dorsal": 9,
    "age": 29,
    "fechaNacimiento": "1995-11-06",
    "source": "fc26"
  },
  "atletico_mineiro|Hulk (ST)": {
    "overall": 82,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "atletico_mineiro|Dudu (LW)": {
    "overall": 65,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 26,
    "fechaNacimiento": "1999-02-10",
    "source": "fc26"
  },
  "atletico_mineiro|Everson (GK)": {
    "overall": 77,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "atletico_mineiro|Renan Lodi (LB)": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1998-04-08",
    "source": "fc26"
  },
  "atletico_mineiro|Júnior Alonso (CB)": {
    "overall": 76,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "atletico_mineiro|Bernard (LW)": {
    "overall": 76,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "atletico_mineiro|Vitor Hugo (CB)": {
    "overall": 75,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "atletico_mineiro|Gustavo Scarpa (CAM)": {
    "overall": 75,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "atletico_mineiro|Ángelo Preciado (RB)": {
    "overall": 75,
    "nationality": "Ecuador",
    "dorsal": 17,
    "age": 27,
    "fechaNacimiento": "1998-02-18",
    "source": "fc26"
  },
  "atletico_mineiro|Maycon (CM)": {
    "overall": 75,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "atletico_mineiro|Mateo Cassierra (ST)": {
    "overall": 74,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "corinthians|Memphis Depay (CAM)": {
    "overall": 81,
    "nationality": "Netherlands",
    "age": 31,
    "fechaNacimiento": "1994-02-13",
    "source": "fc26"
  },
  "corinthians|Hugo Souza (GK)": {
    "overall": 77,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "corinthians|Gabriel Paulista (CB)": {
    "overall": 77,
    "nationality": "Brazil",
    "dorsal": 3,
    "age": 34,
    "fechaNacimiento": "1990-11-26",
    "source": "fc26"
  },
  "corinthians|Rodrigo Garro (CAM)": {
    "overall": 77,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "corinthians|Allan (CDM)": {
    "overall": 77,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "corinthians|Matheuzinho (RB)": {
    "overall": 75,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "corinthians|André Ramalho (CB)": {
    "overall": 75,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "corinthians|Yuri Alberto (ST)": {
    "overall": 75,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "corinthians|Matheus Pereira (CM)": {
    "overall": 70,
    "nationality": "Brazil",
    "dorsal": 3,
    "age": 24,
    "fechaNacimiento": "2000-12-21",
    "source": "fc26"
  },
  "corinthians|Jesse Lingard (CAM)": {
    "overall": 74,
    "nationality": "England",
    "dorsal": 10,
    "age": 32,
    "fechaNacimiento": "1992-12-15",
    "source": "fc26"
  },
  "corinthians|Pedro Raul (ST)": {
    "overall": 74,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "flamengo|Jorginho (CDM)": {
    "overall": 81,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "flamengo|Lucas Paquetá (CAM)": {
    "overall": 80,
    "nationality": "Brazil",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1997-08-27",
    "source": "fc26"
  },
  "flamengo|Giorgian de Arrascaeta (CAM)": {
    "overall": 80,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "flamengo|Bruno Henrique (ST)": {
    "overall": 80,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "flamengo|Agustín Rossi (GK)": {
    "overall": 79,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "flamengo|Gonzalo Plata (RW)": {
    "overall": 79,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "flamengo|Samuel Lino (LW)": {
    "overall": 79,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "flamengo|Pedro (ST)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 9,
    "age": 37,
    "fechaNacimiento": "1987-07-28",
    "source": "fc26"
  },
  "flamengo|Danilo (CB)": {
    "overall": 73,
    "nationality": "Brazil",
    "dorsal": 99,
    "age": 26,
    "fechaNacimiento": "1999-04-07",
    "source": "fc26"
  },
  "flamengo|Everton Cebolinha (LW)": {
    "overall": 78,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "flamengo|Nicolás de la Cruz (CM)": {
    "overall": 78,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "internacional|Sergio Rochet (GK)": {
    "overall": 76,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "internacional|Alan Patrick (CAM)": {
    "overall": 76,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "internacional|Rafael Borré (ST)": {
    "overall": 76,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "internacional|Bruno Tabata (RW)": {
    "overall": 75,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "internacional|Thiago Maia (CDM)": {
    "overall": 75,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "internacional|Rodrigo Villagra (CDM)": {
    "overall": 75,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "internacional|Gabriel Mercado (CB)": {
    "overall": 74,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "internacional|Bruno Henrique (CM)": {
    "overall": 73,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "internacional|Félix Torres (CB)": {
    "overall": 73,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "internacional|Paulinho (CM)": {
    "overall": 69,
    "nationality": "Brazil",
    "dorsal": 29,
    "age": 30,
    "fechaNacimiento": "1995-01-03",
    "source": "fc26"
  },
  "internacional|Johan Carbonero (LW)": {
    "overall": 72,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "rb_bragantino|Juninho Capixaba (LB)": {
    "overall": 77,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "rb_bragantino|Cleiton (GK)": {
    "overall": 76,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "rb_bragantino|Tiago Volpi (GK)": {
    "overall": 76,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "rb_bragantino|Gabriel (CDM)": {
    "overall": 88,
    "nationality": "Brazil",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1997-12-19",
    "source": "fc26"
  },
  "rb_bragantino|Eduardo Sasha (ST)": {
    "overall": 73,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "rb_bragantino|Fernando (ST)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 35,
    "fechaNacimiento": "1990-06-10",
    "source": "fc26"
  },
  "rb_bragantino|Agustín Sant'Anna (RB)": {
    "overall": 73,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "rb_bragantino|Pedro Henrique (CB)": {
    "overall": 72,
    "nationality": "Brazil",
    "dorsal": 13,
    "age": 22,
    "fechaNacimiento": "2002-07-11",
    "source": "fc26"
  },
  "rb_bragantino|Guzmán Rodríguez (CB)": {
    "overall": 72,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "rb_bragantino|Eduardo (CB)": {
    "overall": 65,
    "nationality": "Brazil",
    "dorsal": 21,
    "age": 28,
    "fechaNacimiento": "1997-01-09",
    "source": "fc26"
  },
  "rb_bragantino|Bruno Praxedes (CM)": {
    "overall": 71,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "vitoria|Marinho (RW)": {
    "overall": 75,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "vitoria|Gabriel (GK)": {
    "overall": 88,
    "nationality": "Brazil",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1997-12-19",
    "source": "fc26"
  },
  "vitoria|Emmanuel Martínez (CAM)": {
    "overall": 73,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "vitoria|Osvaldo (RW)": {
    "overall": 73,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "vitoria|Aitor (CAM)": {
    "overall": 73,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "vitoria|Lucas Arcanjo (GK)": {
    "overall": 72,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "vitoria|Fabrício (ST)": {
    "overall": 72,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "vitoria|Camutanga (CB)": {
    "overall": 71,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "vitoria|Gabriel Baralhas (CDM)": {
    "overall": 71,
    "dorsal": 44,
    "source": "latamfc26"
  },
  "vitoria|Matheuzinho (CAM)": {
    "overall": 71,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "vitoria|Luan Cândido (LB)": {
    "overall": 71,
    "dorsal": 36,
    "source": "latamfc26"
  },
  "vasco_da_gama|Jair (CDM)": {
    "overall": 64,
    "nationality": "Brazil",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1994-08-03",
    "source": "fc26"
  },
  "vasco_da_gama|Thiago Mendes (CDM)": {
    "overall": 75,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "vasco_da_gama|Tchê Tchê (CM)": {
    "overall": 74,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "vasco_da_gama|Lucas Piton (LB)": {
    "overall": 74,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "vasco_da_gama|Léo Jardim (GK)": {
    "overall": 73,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "vasco_da_gama|Paulo Henrique (RB)": {
    "overall": 72,
    "dorsal": 96,
    "source": "latamfc26"
  },
  "vasco_da_gama|Robert Renan (CB)": {
    "overall": 72,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "vasco_da_gama|Hugo Moura (CDM)": {
    "overall": 72,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "vasco_da_gama|Nuno Moreira (RW)": {
    "overall": 72,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "vasco_da_gama|Andrés Gómez (LW)": {
    "overall": 72,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "vasco_da_gama|David (LW)": {
    "overall": 72,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "bahia|Gilberto (RB)": {
    "overall": 65,
    "nationality": "Guinea-Bissau",
    "dorsal": 66,
    "age": 21,
    "fechaNacimiento": "2003-12-29",
    "source": "fc26"
  },
  "bahia|Éverton Ribeiro (CAM)": {
    "overall": 77,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "bahia|Willian José (ST)": {
    "overall": 76,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "bahia|Rodrigo Nestor (CM)": {
    "overall": 75,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "bahia|Iago (LB)": {
    "overall": 75,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "bahia|Santiago Ramos Mingo (CB)": {
    "overall": 74,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "bahia|João Paulo (GK)": {
    "overall": 70,
    "nationality": "Brazil",
    "dorsal": 6,
    "age": 34,
    "fechaNacimiento": "1991-03-08",
    "source": "fc26"
  },
  "bahia|Luciano Juba (LB)": {
    "overall": 73,
    "dorsal": 46,
    "source": "latamfc26"
  },
  "bahia|Erick (CDM)": {
    "overall": 61,
    "nationality": "Brazil",
    "dorsal": 8,
    "age": 21,
    "fechaNacimiento": "2004-02-29",
    "source": "fc26"
  },
  "bahia|Kanu (CB)": {
    "overall": 73,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "bahia|Ademir (RW)": {
    "overall": 73,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "mirassol|Fernandinho": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "mirassol|Dellatorre": {
    "overall": 69,
    "dorsal": 49,
    "source": "latamfc26"
  },
  "mirassol|Danielzinho": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "santos|Neymar (CAM)": {
    "overall": 85,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "santos|Gabriel (ST)": {
    "overall": 88,
    "nationality": "Brazil",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1997-12-19",
    "source": "fc26"
  },
  "santos|Zé Rafael (CM)": {
    "overall": 77,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "santos|Willian Arão (CDM)": {
    "overall": 76,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "santos|Lucas Veríssimo (CB)": {
    "overall": 76,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "santos|Luan Peres (CB)": {
    "overall": 75,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "santos|Rony (ST)": {
    "overall": 75,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "santos|Mayke (RB)": {
    "overall": 75,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "santos|Adonis Frías (CB)": {
    "overall": 74,
    "dorsal": 98,
    "source": "latamfc26"
  },
  "santos|Benjamín Rollheiser (RW)": {
    "overall": 74,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "santos|Gabriel Menino (CM)": {
    "overall": 74,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "athletico_pr|Fernandinho": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "athletico_pr|Thiago Heleno": {
    "overall": 74,
    "dorsal": 44,
    "source": "latamfc26"
  },
  "athletico_pr|Bento": {
    "overall": 80,
    "nationality": "Brazil",
    "dorsal": 24,
    "age": 26,
    "fechaNacimiento": "1999-06-10",
    "source": "fc26"
  },
  "remo|Patrick (CM)": {
    "overall": 63,
    "nationality": "Cabo Verde",
    "dorsal": 9,
    "age": 31,
    "fechaNacimiento": "1993-12-13",
    "source": "fc26"
  },
  "remo|Yago Pikachu (RW)": {
    "overall": 73,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "remo|Ivan (GK)": {
    "overall": 72,
    "dorsal": 97,
    "source": "latamfc26"
  },
  "remo|Víctor Cantillo (CDM)": {
    "overall": 72,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "remo|Duplexe Tchamba (CB)": {
    "overall": 71,
    "nationality": "Cameroon",
    "dorsal": 2,
    "age": 26,
    "fechaNacimiento": "1998-07-10",
    "source": "fc26"
  },
  "remo|Patrick de Paula (CDM)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 45,
    "age": 25,
    "fechaNacimiento": "1999-09-08",
    "source": "fc26"
  },
  "remo|Zé Welison (CDM)": {
    "overall": 71,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "remo|Matheus Alexandre (RB)": {
    "overall": 71,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "remo|Marllon (CB)": {
    "overall": 70,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "remo|Leonel Picco (CDM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 14,
    "age": 26,
    "fechaNacimiento": "1998-10-22",
    "source": "fc26"
  },
  "remo|Panagiotis Tachtsidis (CDM)": {
    "overall": 70,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "coritiba|Rodrigo Moledo (CB)": {
    "overall": 75,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "coritiba|Keno (LW)": {
    "overall": 75,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "coritiba|Maicon (CB)": {
    "overall": 74,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "coritiba|Josué (CAM)": {
    "overall": 74,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "coritiba|Breno (LW)": {
    "overall": 73,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "coritiba|Keiller (GK)": {
    "overall": 73,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "coritiba|Sebastián Gómez (CM)": {
    "overall": 72,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "coritiba|Pedro Rocha (LW)": {
    "overall": 72,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "coritiba|Tinga (RB)": {
    "overall": 72,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "coritiba|Fernando Sobral (CM)": {
    "overall": 72,
    "dorsal": 88,
    "source": "latamfc26"
  },
  "coritiba|Thiago Santos (CB)": {
    "overall": 70,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "chapecoense|Jean Carlos (CAM)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1996-05-10",
    "source": "fc26"
  },
  "chapecoense|Yannick Bolasie (ST)": {
    "overall": 70,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "chapecoense|Bruno Pacheco (LB)": {
    "overall": 70,
    "dorsal": 91,
    "source": "latamfc26"
  },
  "chapecoense|Higor Meritão (CDM)": {
    "overall": 69,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "chapecoense|Walter Clar (LB)": {
    "overall": 68,
    "dorsal": 37,
    "source": "latamfc26"
  },
  "chapecoense|Rafael Thyere (CB)": {
    "overall": 68,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "chapecoense|Giovanni Augusto (CAM)": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "chapecoense|Robert Santos (CAM)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "chapecoense|Maurício Garcez (LW)": {
    "overall": 68,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "chapecoense|Ênio (LW)": {
    "overall": 68,
    "dorsal": 97,
    "source": "latamfc26"
  },
  "chapecoense|Neto Pessoa (ST)": {
    "overall": 67,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "juventude|Alan Kardec (ST)": {
    "overall": 75,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "juventude|Manuel Castro (RW)": {
    "overall": 73,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "juventude|Jandrei (GK)": {
    "overall": 72,
    "dorsal": 93,
    "source": "latamfc26"
  },
  "juventude|Messias (CB)": {
    "overall": 72,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "juventude|Titi (CB)": {
    "overall": 72,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "juventude|Rodrigo Sam (CB)": {
    "overall": 71,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "juventude|Marcos Paulo (LW)": {
    "overall": 59,
    "dorsal": 47,
    "source": "latamfc26"
  },
  "juventude|Nathan (RB)": {
    "overall": 70,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "juventude|Alan Ruschel (LB)": {
    "overall": 70,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "juventude|Alisson Safira (ST)": {
    "overall": 69,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "juventude|Lucas Mineiro (CDM)": {
    "overall": 69,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "fortaleza_br|Tomás Pochettino (CAM)": {
    "overall": 73,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "fortaleza_br|João Ricardo (GK)": {
    "overall": 73,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "fortaleza_br|Tomás Cardona (CB)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 13,
    "age": 29,
    "fechaNacimiento": "1995-10-10",
    "source": "fc26"
  },
  "fortaleza_br|Emanuel Brítez (CB)": {
    "overall": 72,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "fortaleza_br|Vitinho (RW)": {
    "overall": 72,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "fortaleza_br|Lucas Crispim (CAM)": {
    "overall": 72,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "fortaleza_br|Maílton (RB)": {
    "overall": 71,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "fortaleza_br|Gabriel Fuentes (LB)": {
    "overall": 71,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "fortaleza_br|Lucas Sasha (CDM)": {
    "overall": 71,
    "dorsal": 88,
    "source": "latamfc26"
  },
  "fortaleza_br|Gazal (CB)": {
    "overall": 70,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "fortaleza_br|Brenno (GK)": {
    "overall": 69,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "ceara|Erick Pulga": {
    "overall": 71,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "ceara|Aylon": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "ceara|Richard": {
    "overall": 71,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "sport_recife|Lucas Lima": {
    "overall": 74,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "sport_recife|Zé Roberto": {
    "overall": 71,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "sport_recife|Fabricio Domínguez": {
    "overall": 69,
    "nationality": "Uruguay",
    "dorsal": 2,
    "age": 27,
    "fechaNacimiento": "1998-06-24",
    "source": "fc26"
  },
  "sport_recife|Caíque França": {
    "overall": 69,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "america_mineiro|Juninho": {
    "overall": 75,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "america_mineiro|Elias": {
    "overall": 65,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "america_mineiro|Ricardo Silva": {
    "overall": 67,
    "dorsal": 45,
    "source": "latamfc26"
  },
  "cuiaba|João Basso (CB)": {
    "overall": 74,
    "dorsal": 45,
    "source": "latamfc26"
  },
  "cuiaba|Pepê (CM)": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 28,
    "fechaNacimiento": "1997-02-24",
    "source": "fc26"
  },
  "cuiaba|Raul (CDM)": {
    "overall": 72,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "cuiaba|Alan Empereur (CB)": {
    "overall": 70,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "cuiaba|Marcelo Carné (GK)": {
    "overall": 69,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "cuiaba|Marlon (LB)": {
    "overall": 72,
    "nationality": "Brazil",
    "dorsal": 4,
    "age": 29,
    "fechaNacimiento": "1995-09-07",
    "source": "fc26"
  },
  "cuiaba|Gabriel (CB)": {
    "overall": 88,
    "nationality": "Brazil",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1997-12-19",
    "source": "fc26"
  },
  "cuiaba|João Carlos (GK)": {
    "overall": 68,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "cuiaba|Railan (RB)": {
    "overall": 67,
    "dorsal": 37,
    "source": "latamfc26"
  },
  "cuiaba|Yamil Asad (LW)": {
    "overall": 66,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "cuiaba|Rodrigo Rodrigues (ST)": {
    "overall": 58,
    "nationality": "Portugal",
    "dorsal": 80,
    "age": 17,
    "fechaNacimiento": "2007-12-06",
    "source": "fc26"
  },
  "atletico_goianiense|Luiz Fernando": {
    "overall": 68,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "atletico_goianiense|Shaylon": {
    "overall": 72,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "atletico_goianiense|Ronaldo": {
    "overall": 94,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "atletico_goianiense|Alix Vinicius": {
    "overall": 69,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "novorizontino|Jean Lucas (GK)": {
    "overall": 73,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "novorizontino|Leo Naldi (CDM)": {
    "overall": 72,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "novorizontino|Rômulo (CAM)": {
    "overall": 76,
    "nationality": "Brazil",
    "dorsal": 40,
    "age": 23,
    "fechaNacimiento": "2002-02-08",
    "source": "fc26"
  },
  "novorizontino|Robson (RW)": {
    "overall": 71,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "novorizontino|Christian Ortíz (CAM)": {
    "overall": 71,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "novorizontino|Jordi (GK)": {
    "overall": 71,
    "dorsal": 93,
    "source": "latamfc26"
  },
  "novorizontino|Jhilmar Lora (RB)": {
    "overall": 69,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "novorizontino|Luís Oyama (CDM)": {
    "overall": 68,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "novorizontino|Matheus Bianqui (CM)": {
    "overall": 68,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "novorizontino|Nilson Castrillón (RB)": {
    "overall": 68,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "novorizontino|Carlinhos (CB)": {
    "overall": 68,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "goias|Tadeu (GK)": {
    "overall": 76,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "goias|Juninho (CDM)": {
    "overall": 75,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "goias|Lucas Lima (CAM)": {
    "overall": 74,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "goias|Wellington Rato (RW)": {
    "overall": 74,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "goias|Rodrigo (RB)": {
    "overall": 73,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "goias|Luiz Felipe (CB)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-03-22",
    "source": "fc26"
  },
  "goias|João Paulo Lourenço (CM)": {
    "overall": 71,
    "dorsal": 97,
    "source": "latamfc26"
  },
  "goias|Nicolas (LB)": {
    "overall": 67,
    "nationality": "Brazil",
    "dorsal": 12,
    "age": 37,
    "fechaNacimiento": "1988-04-12",
    "source": "fc26"
  },
  "goias|Filipe Machado (CDM)": {
    "overall": 70,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "goias|Anselmo Ramon (ST)": {
    "overall": 70,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "goias|Ramon Menezes (CB)": {
    "overall": 69,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "criciuma|Fellipe Mateus (CAM)": {
    "overall": 73,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "criciuma|Bruno Alves (CB)": {
    "overall": 72,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "criciuma|Rodrigo (CB)": {
    "overall": 71,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "criciuma|Jean (CDM)": {
    "overall": 71,
    "dorsal": 41,
    "source": "latamfc26"
  },
  "criciuma|Romarinho (RW)": {
    "overall": 71,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "criciuma|Romulo Otero (CAM)": {
    "overall": 72,
    "nationality": "Venezuela",
    "dorsal": 80,
    "age": 32,
    "fechaNacimiento": "1992-11-09",
    "source": "fc26"
  },
  "criciuma|Alisson (GK)": {
    "overall": 89,
    "nationality": "Brazil",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1992-10-02",
    "source": "fc26"
  },
  "criciuma|Luciano Castán (CB)": {
    "overall": 69,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "criciuma|Waguininho (LW)": {
    "overall": 69,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "criciuma|César Martins (CB)": {
    "overall": 68,
    "dorsal": 37,
    "source": "latamfc26"
  },
  "criciuma|Marcelo Hermes (LB)": {
    "overall": 68,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "crb|Bressan (CB)": {
    "overall": 70,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "crb|Danielzinho (CAM)": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "crb|Luiz Phellype (ST)": {
    "overall": 69,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "crb|Lucas Lovat (LB)": {
    "overall": 67,
    "dorsal": 36,
    "source": "latamfc26"
  },
  "crb|Pedro Castro (CM)": {
    "overall": 67,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "crb|Douglas Baggio (RW)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "crb|Diogo Hereda (RB)": {
    "overall": 66,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "crb|Henri (CB)": {
    "overall": 66,
    "dorsal": 44,
    "source": "latamfc26"
  },
  "crb|Guilherme Pato (LW)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "crb|Fábio Alemão (CB)": {
    "overall": 65,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "crb|Vitor Caetano (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "operario|Gabriel Boschilia (CAM)": {
    "overall": 72,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "operario|Pablo (ST)": {
    "overall": 72,
    "dorsal": 92,
    "source": "latamfc26"
  },
  "operario|Juan Pablo Zuluaga (CM)": {
    "overall": 70,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "operario|Ademilson (ST)": {
    "overall": 70,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "operario|Matheus Trindade (CDM)": {
    "overall": 69,
    "dorsal": 39,
    "source": "latamfc26"
  },
  "operario|Vagner (GK)": {
    "overall": 68,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "operario|Edwin Torres (RM)": {
    "overall": 67,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "operario|Klaus (CB)": {
    "overall": 67,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "operario|José Cuenú (CB)": {
    "overall": 66,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "operario|Aylon (ST)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "operario|Pedro Vilhena (CM)": {
    "overall": 66,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "vila_nova|Helton Leite (GK)": {
    "overall": 74,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "vila_nova|Anderson Jesus (CB)": {
    "overall": 71,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "vila_nova|Marquinhos Gabriel (CAM)": {
    "overall": 71,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "vila_nova|Caio Marcelo (CB)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 4,
    "age": 27,
    "fechaNacimiento": "1998-03-14",
    "source": "fc26"
  },
  "vila_nova|Rafa Silva (ST)": {
    "overall": 71,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "vila_nova|Dellatorre (ST)": {
    "overall": 69,
    "dorsal": 49,
    "source": "latamfc26"
  },
  "vila_nova|Tiago Pagnussat (CB)": {
    "overall": 69,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "vila_nova|Janderson (RW)": {
    "overall": 67,
    "nationality": "Brazil",
    "dorsal": 39,
    "age": 26,
    "fechaNacimiento": "1999-05-06",
    "source": "fc26"
  },
  "vila_nova|Hayner (RB)": {
    "overall": 66,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "vila_nova|André Luís (RW)": {
    "overall": 73,
    "nationality": "Brazil",
    "dorsal": 9,
    "age": 31,
    "fechaNacimiento": "1994-03-09",
    "source": "fc26"
  },
  "vila_nova|Emerson Urso (LW)": {
    "overall": 65,
    "dorsal": 70,
    "source": "latamfc26"
  },
  "avai|Rafael Bilu (RW)": {
    "overall": 71,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "avai|Daniel Penha (CAM)": {
    "overall": 70,
    "nationality": "Brazil",
    "dorsal": 25,
    "age": 26,
    "fechaNacimiento": "1998-10-17",
    "source": "fc26"
  },
  "avai|Mateus Quaresma (LB)": {
    "overall": 70,
    "dorsal": 66,
    "source": "latamfc26"
  },
  "avai|Allyson (CB)": {
    "overall": 68,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "avai|Zé Ricardo (CDM)": {
    "overall": 68,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "avai|Wesley Gasolina (RB)": {
    "overall": 68,
    "dorsal": 52,
    "source": "latamfc26"
  },
  "avai|Cristiano (RM)": {
    "overall": 68,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "avai|Felipe Avenatti (ST)": {
    "overall": 67,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "avai|Léo Aragão (GK)": {
    "overall": 66,
    "dorsal": 41,
    "source": "latamfc26"
  },
  "avai|Wenderson (CM)": {
    "overall": 65,
    "nationality": "Brazil",
    "dorsal": 5,
    "age": 26,
    "fechaNacimiento": "1999-04-27",
    "source": "fc26"
  },
  "avai|Nicolas Cabral (CB)": {
    "overall": 64,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "botafogo_sp|João Carlos": {
    "overall": 68,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "athletic_club|Jefferson": {
    "overall": 62,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "athletic_club|Yuri": {
    "overall": 67,
    "nationality": "Brazil",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1998-06-12",
    "source": "fc26"
  },
  "londrina|Gilberto (ST)": {
    "overall": 65,
    "nationality": "Guinea-Bissau",
    "dorsal": 66,
    "age": 21,
    "fechaNacimiento": "2003-12-29",
    "source": "fc26"
  },
  "londrina|Mauricio Kozlinski (GK)": {
    "overall": 72,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "londrina|Wallace (CB)": {
    "overall": 68,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "londrina|Thalis (CAM)": {
    "overall": 68,
    "dorsal": 96,
    "source": "latamfc26"
  },
  "londrina|Lucas Marques (CDM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "londrina|Iago Teles (LW)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "londrina|Luan Ribeiro (GK)": {
    "overall": 66,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "londrina|Paulinho Moccelin (LW)": {
    "overall": 66,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "londrina|Kevyn (LB)": {
    "overall": 65,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "londrina|Bruno Santos (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "londrina|André Luiz (CDM)": {
    "overall": 69,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 23,
    "fechaNacimiento": "2002-02-23",
    "source": "fc26"
  },
  "ponte_preta|Lucas Cunha (CB)": {
    "overall": 72,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "ponte_preta|Jonathan Cafú (RW)": {
    "overall": 71,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "ponte_preta|William Pottker (RW)": {
    "overall": 71,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "ponte_preta|David Braz (CB)": {
    "overall": 68,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "ponte_preta|Rodrigo Saravia (CDM)": {
    "overall": 68,
    "nationality": "Uruguay",
    "dorsal": 30,
    "age": 24,
    "fechaNacimiento": "2000-08-17",
    "source": "fc26"
  },
  "ponte_preta|Élvis (CAM)": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "ponte_preta|Brandão (ST)": {
    "overall": 67,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "ponte_preta|Diogo Silva (GK)": {
    "overall": 66,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "ponte_preta|Kevyson (LB)": {
    "overall": 66,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "ponte_preta|David da Hora (LW)": {
    "overall": 65,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "ponte_preta|Luís Phelipe (LW)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "sao_bernardo|Pablo (CB)": {
    "overall": 76,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "sao_bernardo|Jemerson (CB)": {
    "overall": 73,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "sao_bernardo|Hyoran (CAM)": {
    "overall": 73,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "sao_bernardo|Lucas Fernandes (CAM)": {
    "overall": 69,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "sao_bernardo|Rodrigo Andrade (CDM)": {
    "overall": 68,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "sao_bernardo|Fabrício Daniel (RW)": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "sao_bernardo|Luizão (CB)": {
    "overall": 68,
    "dorsal": 90,
    "source": "latamfc26"
  },
  "sao_bernardo|Júnior Urso (CDM)": {
    "overall": 67,
    "nationality": "Brazil",
    "dorsal": 30,
    "age": 36,
    "fechaNacimiento": "1989-03-10",
    "source": "fc26"
  },
  "sao_bernardo|Pará (LB)": {
    "overall": 66,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "sao_bernardo|Pablo Dyego (RB)": {
    "overall": 66,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "sao_bernardo|Marcão (CDM)": {
    "overall": 75,
    "nationality": "Brazil",
    "dorsal": 23,
    "age": 29,
    "fechaNacimiento": "1996-06-05",
    "source": "fc26"
  },
  "nautico|Muriel (GK)": {
    "overall": 68,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "nautico|Auremir (CDM)": {
    "overall": 68,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "nautico|Leonai (CDM)": {
    "overall": 68,
    "nationality": "Brazil",
    "dorsal": 22,
    "age": 30,
    "fechaNacimiento": "1995-04-28",
    "source": "fc26"
  },
  "nautico|Mateus Silva (CB)": {
    "overall": 67,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "nautico|Felipe Cardoso (CAM)": {
    "overall": 67,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "nautico|Dodô (CAM)": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 2,
    "age": 26,
    "fechaNacimiento": "1998-11-17",
    "source": "fc26"
  },
  "nautico|Vinícius (LW)": {
    "overall": 66,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "nautico|Gastón Guruceaga (GK)": {
    "overall": 66,
    "dorsal": 55,
    "source": "latamfc26"
  },
  "nautico|Wanderson (CB)": {
    "overall": 73,
    "nationality": "Brazil",
    "dorsal": 77,
    "age": 36,
    "fechaNacimiento": "1989-03-31",
    "source": "fc26"
  },
  "nautico|Paulo Sérgio (ST)": {
    "overall": 66,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "nautico|Igor Fernandes (LB)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "america_mex|Raphael Veiga (CAM)": {
    "overall": 79,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "america_mex|Alejandro Zendejas (RW)": {
    "overall": 76,
    "nationality": "United States",
    "age": 27,
    "fechaNacimiento": "1998-02-07",
    "source": "fc26"
  },
  "america_mex|Brian Rodríguez (LW)": {
    "overall": 77,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "america_mex|Israel Reyes (CB)": {
    "overall": 76,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "america_mex|Sebastián Cáceres (CB)": {
    "overall": 76,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "america_mex|Luis Malagón (GK)": {
    "overall": 79,
    "nationality": "Mexico",
    "age": 28,
    "fechaNacimiento": "1997-03-02",
    "source": "fc26"
  },
  "america_mex|Rodrigo Dourado (CDM)": {
    "overall": 74,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "america_mex|Víctor Dávila (ST)": {
    "overall": 74,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "america_mex|Cristián Borja (LB)": {
    "overall": 73,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "america_mex|Jonathan dos Santos (CDM)": {
    "overall": 67,
    "nationality": "Uruguay",
    "dorsal": 49,
    "age": 33,
    "fechaNacimiento": "1992-04-18",
    "source": "fc26"
  },
  "america_mex|Henry Martín (ST)": {
    "overall": 73,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "monterrey|Sergio Canales (RM)": {
    "overall": 80,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "monterrey|Lucas Ocampos (LW)": {
    "overall": 77,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "monterrey|Óliver Torres (CAM)": {
    "overall": 76,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "monterrey|Anthony Martial (ST)": {
    "overall": 77,
    "nationality": "France",
    "dorsal": 26,
    "age": 29,
    "fechaNacimiento": "1995-12-05",
    "source": "fc26"
  },
  "monterrey|Luca Orellano (LM)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "2000-03-22",
    "source": "fc26"
  },
  "monterrey|Uros Djurdjevic (ST)": {
    "overall": 75,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "monterrey|Jesús Corona (RW)": {
    "overall": 75,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "monterrey|Santiago Mele (GK)": {
    "overall": 74,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "monterrey|Víctor Guzmán (CB)": {
    "overall": 74,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "monterrey|Fidel Ambríz (CDM)": {
    "overall": 74,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "monterrey|Stefan Medina (CB)": {
    "overall": 74,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "tigres|Ángel Correa (ST)": {
    "overall": 80,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "tigres|Nahuel Guzmán (GK)": {
    "overall": 77,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "tigres|Diego Lainez (RW)": {
    "overall": 76,
    "nationality": "Mexico",
    "age": 25,
    "fechaNacimiento": "2000-06-09",
    "source": "fc26"
  },
  "tigres|Juan Brunetta (CAM)": {
    "overall": 77,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "tigres|Fernando Gorriarán (CDM)": {
    "overall": 76,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "tigres|Joaquim (CB)": {
    "overall": 75,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "tigres|Rodrigo Aguirre (ST)": {
    "overall": 75,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "tigres|André-Pierre Gignac (ST)": {
    "overall": 75,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "tigres|Jesús Angulo (CB)": {
    "overall": 74,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "tigres|Rômulo (CDM)": {
    "overall": 76,
    "nationality": "Brazil",
    "dorsal": 40,
    "age": 23,
    "fechaNacimiento": "2002-02-08",
    "source": "fc26"
  },
  "tigres|Jesús Garza (RB)": {
    "overall": 73,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "cruz_azul|José Paradela (CAM)": {
    "overall": 78,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "cruz_azul|Willer Ditta (CB)": {
    "overall": 77,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "cruz_azul|Erik Lira (CDM)": {
    "overall": 73,
    "nationality": "Mexico",
    "age": 25,
    "fechaNacimiento": "2000-05-08",
    "source": "fc26"
  },
  "cruz_azul|Agustín Palavecino (CM)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 22,
    "fechaNacimiento": "2003-03-09",
    "source": "fc26"
  },
  "cruz_azul|Carlos Rodríguez (CM)": {
    "overall": 76,
    "nationality": "Mexico",
    "age": 28,
    "fechaNacimiento": "1997-01-03",
    "source": "fc26"
  },
  "cruz_azul|Kevin Mier (GK)": {
    "overall": 76,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "cruz_azul|Carlos Rotondi (LM)": {
    "overall": 75,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "cruz_azul|Gabriel Fernández (ST)": {
    "overall": 75,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "cruz_azul|Nicolás Ibáñez (ST)": {
    "overall": 75,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "cruz_azul|Gonzalo Piovi (CB)": {
    "overall": 74,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "cruz_azul|Jeremy Márquez (CM)": {
    "overall": 74,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "pumas|Keylor Navas (GK)": {
    "overall": 79,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "pumas|Álvaro Angulo (LB)": {
    "overall": 75,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "pumas|Adalberto Carrasquilla (CM)": {
    "overall": 75,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "pumas|Nathan Silva (CB)": {
    "overall": 74,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "pumas|Pedro Vite (CM)": {
    "overall": 74,
    "dorsal": 45,
    "source": "latamfc26"
  },
  "pumas|Uriel Antuna (RM)": {
    "overall": 74,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "pumas|Juninho Vieira (ST)": {
    "overall": 74,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "pumas|Rubén Duarte (CB)": {
    "overall": 73,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "pumas|Guillermo Martínez (ST)": {
    "overall": 73,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "pumas|Robert Morales (ST)": {
    "overall": 73,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "pumas|Leonardo Suárez (RM)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 74,
    "age": 29,
    "fechaNacimiento": "1996-03-30",
    "source": "fc26"
  },
  "chivas|Raúl Rangel (GK)": {
    "overall": 76,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "chivas|Roberto Alvarado (RM)": {
    "overall": 78,
    "nationality": "Mexico",
    "age": 26,
    "fechaNacimiento": "1998-09-07",
    "source": "fc26"
  },
  "chivas|Armando González (ST)": {
    "overall": 76,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "chivas|Luis Romo (CDM)": {
    "overall": 76,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "chivas|Richard Ledezma (RB)": {
    "overall": 75,
    "dorsal": 37,
    "source": "latamfc26"
  },
  "chivas|Bryan González (LB)": {
    "overall": 75,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "chivas|Efraín Álvarez (LM)": {
    "overall": 75,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "chivas|Brian Gutiérrez (CAM)": {
    "overall": 68,
    "nationality": "United States",
    "dorsal": 17,
    "age": 22,
    "fechaNacimiento": "2003-06-17",
    "source": "fc26"
  },
  "chivas|Diego Campillo (CB)": {
    "overall": 74,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "chivas|Ángel Sepúlveda (ST)": {
    "overall": 74,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "chivas|Daniel Aguirre (CB)": {
    "overall": 73,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "toluca|Paulinho (ST)": {
    "overall": 69,
    "nationality": "Brazil",
    "dorsal": 29,
    "age": 30,
    "fechaNacimiento": "1995-01-03",
    "source": "fc26"
  },
  "toluca|Alexis Vega (LW)": {
    "overall": 79,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "toluca|Federico Pereira (CB)": {
    "overall": 77,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "toluca|Marcel Ruiz (CM)": {
    "overall": 75,
    "nationality": "Mexico",
    "age": 24,
    "fechaNacimiento": "2000-10-26",
    "source": "fc26"
  },
  "toluca|Jesús Gallardo (LB)": {
    "overall": 75,
    "nationality": "Mexico",
    "age": 30,
    "fechaNacimiento": "1994-08-15",
    "source": "fc26"
  },
  "toluca|Helinho (RM)": {
    "overall": 76,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "toluca|Nicolás Castro (CM)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 35,
    "fechaNacimiento": "1990-05-11",
    "source": "fc26"
  },
  "toluca|Jesús Angulo (CAM)": {
    "overall": 75,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "toluca|Santiago Simón (CM)": {
    "overall": 74,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "toluca|Bruno Méndez (CB)": {
    "overall": 53,
    "nationality": "Bolivia",
    "dorsal": 28,
    "age": 18,
    "fechaNacimiento": "2006-12-20",
    "source": "fc26"
  },
  "toluca|Franco Romero (CDM)": {
    "overall": 74,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "pachuca|Oussama Idrissi (LW)": {
    "overall": 77,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "pachuca|Enner Valencia (ST)": {
    "overall": 77,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "pachuca|Salomón Rondón (ST)": {
    "overall": 76,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "pachuca|Elías Montiel (CM)": {
    "overall": 74,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "pachuca|William Carvalho (CDM)": {
    "overall": 74,
    "dorsal": 41,
    "source": "latamfc26"
  },
  "pachuca|Carlos Moreno (GK)": {
    "overall": 72,
    "nationality": "Mexico",
    "age": 27,
    "fechaNacimiento": "1998-01-29",
    "source": "fc26"
  },
  "pachuca|Eduardo Bauermann (CB)": {
    "overall": 73,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "pachuca|Sergio Barreto (CB)": {
    "overall": 73,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "pachuca|Víctor Guzmán (CAM)": {
    "overall": 73,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "pachuca|Kenedy (LM)": {
    "overall": 73,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "pachuca|Luis Quiñones (RM)": {
    "overall": 73,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "leon|Diber Cambindo (ST)": {
    "overall": 76,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "leon|Rodrigo Echeverría (CM)": {
    "overall": 74,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "leon|Ismael Díaz (LW)": {
    "overall": 74,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "leon|Sebastián Vegas (CB)": {
    "overall": 73,
    "nationality": "Chile",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1996-12-04",
    "source": "fc26"
  },
  "leon|Salvador Reyes (LB)": {
    "overall": 73,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "leon|Rogelio Funes Mori (ST)": {
    "overall": 73,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "leon|Óscar García (GK)": {
    "overall": 73,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "leon|Jordi Cortizo (LM)": {
    "overall": 73,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "leon|Stiven Barreiro (CB)": {
    "overall": 72,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "leon|Juan Domínguez (RM)": {
    "overall": 72,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "leon|Fernando Beltrán (CDM)": {
    "overall": 72,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "atlas|Camilo Vargas": {
    "overall": 76,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "atlas|Aldo Rocha": {
    "overall": 73,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "atlas|Eduardo Aguirre": {
    "overall": 70,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "santos_laguna|Carlos Acevedo (GK)": {
    "overall": 75,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "santos_laguna|Ezequiel Bullaude (CAM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 29,
    "age": 24,
    "fechaNacimiento": "2000-10-26",
    "source": "fc26"
  },
  "santos_laguna|Lucas Di Yorio (ST)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 28,
    "fechaNacimiento": "1996-11-22",
    "source": "fc26"
  },
  "santos_laguna|Kevin Balanta (CB)": {
    "overall": 73,
    "dorsal": 35,
    "source": "latamfc26"
  },
  "santos_laguna|Carlos Gruezo (CDM)": {
    "overall": 72,
    "nationality": "Ecuador",
    "dorsal": 8,
    "age": 30,
    "fechaNacimiento": "1995-04-19",
    "source": "fc26"
  },
  "santos_laguna|Javier Güemez (CDM)": {
    "overall": 72,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "santos_laguna|Choco Lozano (ST)": {
    "overall": 72,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "santos_laguna|Bruno Amione (CB)": {
    "overall": 71,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "santos_laguna|Cristian Dájome (RM)": {
    "overall": 71,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "santos_laguna|Fran Villalba (RM)": {
    "overall": 71,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "santos_laguna|Ramiro Sordo (LW)": {
    "overall": 71,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "tijuana|Carlos González": {
    "overall": 73,
    "nationality": "Paraguay",
    "dorsal": 32,
    "age": 32,
    "fechaNacimiento": "1993-02-04",
    "source": "fc26"
  },
  "tijuana|Christian Rivera": {
    "overall": 72,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "tijuana|Kevin Castañeda": {
    "overall": 74,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "puebla|Emiliano Gómez (ST)": {
    "overall": 73,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "puebla|Julio González (GK)": {
    "overall": 71,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "puebla|Juan Pablo Vargas (CB)": {
    "overall": 71,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "puebla|Nicolás Díaz (CB)": {
    "overall": 71,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "puebla|Edgar Guerra (RM)": {
    "overall": 71,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "puebla|Lucas Cavallini (ST)": {
    "overall": 71,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "puebla|Ángelo Araos (CAM)": {
    "overall": 71,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "puebla|Daniel Gutiérrez (GK)": {
    "overall": 67,
    "nationality": "Chile",
    "dorsal": 3,
    "age": 22,
    "fechaNacimiento": "2003-02-16",
    "source": "fc26"
  },
  "puebla|Kevin Velasco (LM)": {
    "overall": 70,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "puebla|Alejandro Organista (CM)": {
    "overall": 70,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "puebla|Brayan Garnica (RM)": {
    "overall": 70,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "queretaro|Santiago Homenchenko (CDM)": {
    "overall": 74,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "queretaro|Jhojan Julio (LM)": {
    "overall": 73,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "queretaro|Lucas Abascia (CB)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 2,
    "age": 29,
    "fechaNacimiento": "1995-12-10",
    "source": "fc26"
  },
  "queretaro|Francisco Venegas (LB)": {
    "overall": 72,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "queretaro|Mateo Coronel (ST)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 37,
    "age": 26,
    "fechaNacimiento": "1998-10-24",
    "source": "fc26"
  },
  "queretaro|Diego Reyes (CB)": {
    "overall": 72,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "queretaro|Pablo Barrera (RM)": {
    "overall": 72,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "queretaro|Guillermo Allison (GK)": {
    "overall": 71,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "queretaro|Lucas Rodríguez (LM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 31,
    "fechaNacimiento": "1993-09-27",
    "source": "fc26"
  },
  "queretaro|Alí Ávila (ST)": {
    "overall": 71,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "queretaro|Jaime Gómez (RB)": {
    "overall": 69,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "mazatlan|Yoel Bárcenas (LM)": {
    "overall": 73,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "mazatlan|Lucas Merolla (CB)": {
    "overall": 72,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "mazatlan|Facundo Almada (CB)": {
    "overall": 72,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "mazatlan|Dudu (RW)": {
    "overall": 65,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 26,
    "fechaNacimiento": "1999-02-10",
    "source": "fc26"
  },
  "mazatlan|Ricardo Rodríguez (GK)": {
    "overall": 74,
    "nationality": "Switzerland",
    "dorsal": 12,
    "age": 32,
    "fechaNacimiento": "1992-08-25",
    "source": "fc26"
  },
  "mazatlan|Jair Díaz (CB)": {
    "overall": 70,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "mazatlan|Jordan Sierra (CM)": {
    "overall": 70,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "mazatlan|José Esquivel (CDM)": {
    "overall": 70,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "mazatlan|Mauro Laínez (LM)": {
    "overall": 70,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "mazatlan|Josué Ovalle (RW)": {
    "overall": 70,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "mazatlan|Fábio (ST)": {
    "overall": 70,
    "dorsal": 90,
    "source": "latamfc26"
  },
  "necaxa|Ezequiel Unsain (GK)": {
    "overall": 74,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "necaxa|Lorenzo Faravelli (CM)": {
    "overall": 74,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "necaxa|Julián Carranza (ST)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 25,
    "fechaNacimiento": "2000-05-22",
    "source": "fc26"
  },
  "necaxa|Alexis Peña (CB)": {
    "overall": 73,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "necaxa|Agustín Almendra (CM)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 32,
    "age": 25,
    "fechaNacimiento": "2000-02-11",
    "source": "fc26"
  },
  "necaxa|Javier Ruiz (RW)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 20,
    "fechaNacimiento": "2004-09-24",
    "source": "fc26"
  },
  "necaxa|Agustín Oliveros (CB)": {
    "overall": 72,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "necaxa|Cristian Calderón (LB)": {
    "overall": 72,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "necaxa|Kevin Rosero (RM)": {
    "overall": 72,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "necaxa|Tomás Badaloni (ST)": {
    "overall": 72,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "necaxa|Emilio Lara (RB)": {
    "overall": 71,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "juarez|Sebastián Jurado": {
    "overall": 73,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "juarez|Denzell García": {
    "overall": 74,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "juarez|Dieter Villalpando": {
    "overall": 74,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "juarez|Avilés Hurtado": {
    "overall": 71,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "san_luis|Vitinho": {
    "overall": 72,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "san_luis|Javier Güémez": {
    "overall": 72,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "atlante|Christian Bermúdez (CAM)": {
    "overall": 69,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "atlante|Luis Calzadilla (RM)": {
    "overall": 68,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "atlante|Illian Hernández (ST)": {
    "overall": 68,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "atlante|Hardy Meza (CDM)": {
    "overall": 67,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "atlante|Luis Olivas (CB)": {
    "overall": 67,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "atlante|Diego Cruz (CB)": {
    "overall": 66,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "atlante|Armando Escobar (LW)": {
    "overall": 66,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "atlante|Maximiliano García (CM)": {
    "overall": 66,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "atlante|Ronaldo González (CM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "atlante|Johan Alonzo (RW)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "atlante|Axl Padilla (RB)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "venados_fc|Juan José Calero (ST)": {
    "overall": 71,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "venados_fc|Santiago Ramírez (GK)": {
    "overall": 64,
    "nationality": "Uruguay",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1998-03-12",
    "source": "fc26"
  },
  "venados_fc|Adolfo Domínguez (CDM)": {
    "overall": 67,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "venados_fc|Sleyther Lora (RW)": {
    "overall": 66,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "venados_fc|Jonathan Martínez (CAM)": {
    "overall": 66,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "venados_fc|Mario Trejo (CB)": {
    "overall": 66,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "venados_fc|Duilio Tejeda (RW)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "venados_fc|Néstor Vidrio (CB)": {
    "overall": 66,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "venados_fc|Javier Casillas (RB)": {
    "overall": 65,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "venados_fc|Lanchi (RB)": {
    "overall": 65,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "venados_fc|Paul Galván (CDM)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "jaiba_brava|Antonio Portales (CB)": {
    "overall": 70,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "jaiba_brava|Sergio Flores (CDM)": {
    "overall": 69,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "jaiba_brava|Diego García (RB)": {
    "overall": 70,
    "nationality": "Uruguay",
    "dorsal": 50,
    "age": 28,
    "fechaNacimiento": "1996-12-29",
    "source": "fc26"
  },
  "jaiba_brava|Edson Torres (CAM)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "jaiba_brava|Michell Rodríguez (RW)": {
    "overall": 68,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "jaiba_brava|José Guadalupe Hernández (LB)": {
    "overall": 67,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "jaiba_brava|Luis Razo (ST)": {
    "overall": 67,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "jaiba_brava|Deivoon Magaña (RM)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "jaiba_brava|José Peralta (RW)": {
    "overall": 66,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "jaiba_brava|Alonso Escoboza (LB)": {
    "overall": 66,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "jaiba_brava|Miguel Pedroza (ST)": {
    "overall": 66,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "morelia|Alejandro Andrade (CDM)": {
    "overall": 68,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "morelia|Brian Figueroa (CAM)": {
    "overall": 68,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "morelia|Brayton Vázquez (CB)": {
    "overall": 67,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "morelia|Arturo Palma (LW)": {
    "overall": 67,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "morelia|Jaziel Martínez (CM)": {
    "overall": 66,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "morelia|Damián Torres (CM)": {
    "overall": 66,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "morelia|Rubén Del Campo (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "morelia|Misael Domínguez (CAM)": {
    "overall": 65,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "morelia|Diego Gallegos (LB)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "morelia|Zahid Muñoz (CAM)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "morelia|Alonso Flores (ST)": {
    "overall": 65,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "irapuato|Ventura Alvarado (CB)": {
    "overall": 67,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "irapuato|Elbis (LB)": {
    "overall": 67,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "irapuato|Benjamín Sánchez (ST)": {
    "overall": 67,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "irapuato|Humberto Hernández (GK)": {
    "overall": 66,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "irapuato|Ricardo Peña (RB)": {
    "overall": 66,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "irapuato|Gabriel Martínez (CB)": {
    "overall": 66,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "irapuato|Raúl Sandoval (LB)": {
    "overall": 65,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "irapuato|Juan Gamboa (RM)": {
    "overall": 65,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "irapuato|Juan Rangel (CAM)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "irapuato|Julio Doldán (ST)": {
    "overall": 65,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "irapuato|Jesse Zamudio (CM)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "la_paz|Daniel Álvarez (LM)": {
    "overall": 70,
    "dorsal": 92,
    "source": "latamfc26"
  },
  "la_paz|Gil Alcalá (GK)": {
    "overall": 69,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "la_paz|Martín Barragán (ST)": {
    "overall": 69,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "la_paz|Carlos Robles (CB)": {
    "overall": 67,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "la_paz|Fernando Illescas (CAM)": {
    "overall": 67,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "la_paz|Gilberto García (CDM)": {
    "overall": 66,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "la_paz|Jonathan Estrada (GK)": {
    "overall": 66,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "la_paz|Horacio Torres (CB)": {
    "overall": 65,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "la_paz|Ivo Vázquez (LB)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "la_paz|Jordi Ferrer (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "la_paz|Ulises Zurita (RB)": {
    "overall": 64,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "leones_negros|Carlos Cisneros (LW)": {
    "overall": 70,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "leones_negros|Carlos Fierro (LW)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "leones_negros|Jonathan Sánchez (CB)": {
    "overall": 67,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "leones_negros|Jesús Brígido (LW)": {
    "overall": 67,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "leones_negros|Felipe López (GK)": {
    "overall": 66,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "leones_negros|Juan de Dios Aguayo (CB)": {
    "overall": 66,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "leones_negros|Arturo Ledesma (CB)": {
    "overall": 66,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "leones_negros|Sergio Hernández (CAM)": {
    "overall": 66,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "leones_negros|Alejandro Bravo (CM)": {
    "overall": 65,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "leones_negros|Joél Pérez (LW)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "leones_negros|Édson Rivera (ST)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "correcaminos|Ronaldo Prieto (LM)": {
    "overall": 69,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "correcaminos|Walter Ortega (RB)": {
    "overall": 67,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "correcaminos|Emanuel Torres (CDM)": {
    "overall": 67,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "correcaminos|Alan Di Pippa (CDM)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 25,
    "fechaNacimiento": "2000-06-16",
    "source": "fc26"
  },
  "correcaminos|Nahúm Gómez (RW)": {
    "overall": 66,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "correcaminos|Gerardo Moreno (CDM)": {
    "overall": 66,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "correcaminos|Édson Reséndez (GK)": {
    "overall": 65,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "correcaminos|Ricardo Galindo (CB)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "correcaminos|Andrés Catalán (LB)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "correcaminos|Tomás Sandoval (ST)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 26,
    "fechaNacimiento": "1999-03-30",
    "source": "fc26"
  },
  "correcaminos|Fabián Salas (RW)": {
    "overall": 65,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "dorados|Salvador Manríquez (CB)": {
    "overall": 68,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "dorados|Édson Gutiérrez (RB)": {
    "overall": 68,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "dorados|Josué Reyes (CB)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "dorados|Luis García (LW)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "dorados|Emilio Sánchez (CM)": {
    "overall": 65,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "dorados|César Leyva (LM)": {
    "overall": 65,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "dorados|Luis Ruiz (CB)": {
    "overall": 64,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "dorados|Dylan Guajardo (CDM)": {
    "overall": 64,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "dorados|José Castro (GK)": {
    "overall": 63,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "dorados|David Osuna (CB)": {
    "overall": 63,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "dorados|Carlos Higuera (GK)": {
    "overall": 63,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "tlaxcala|Ismael Govea (RB)": {
    "overall": 69,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "tlaxcala|Jordan Silva (CB)": {
    "overall": 68,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "tlaxcala|Pablo González (CM)": {
    "overall": 67,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "tlaxcala|Tony Figueroa (RM)": {
    "overall": 66,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "tlaxcala|Christian (ST)": {
    "overall": 66,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "tlaxcala|Andrés Iniestra (CM)": {
    "overall": 66,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "tlaxcala|Giovani Hernández (CAM)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "tlaxcala|Gabino Espinoza (GK)": {
    "overall": 64,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "tlaxcala|Edson Santos (LB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "tlaxcala|Salomón Obama Ondo (RW)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "tlaxcala|Juan Blanco (LW)": {
    "overall": 63,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "alebrijes|Kristian Álvarez (CB)": {
    "overall": 67,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "alebrijes|Héctor Mascorro (RM)": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "alebrijes|Fernando Morales (CM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "alebrijes|Aldo Arellano (CDM)": {
    "overall": 66,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "alebrijes|Julio Cruz (ST)": {
    "overall": 66,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "alebrijes|David Ayala (CM)": {
    "overall": 65,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "alebrijes|Bubakarry Fadika (LW)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "alebrijes|Jair Cortés (CDM)": {
    "overall": 64,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "alebrijes|Harold Vázquez (RB)": {
    "overall": 64,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "alebrijes|Oscar González (GK)": {
    "overall": 64,
    "dorsal": 35,
    "source": "latamfc26"
  },
  "alebrijes|Alfonso Tamay (RW)": {
    "overall": 64,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "colocolo|Claudio Aquino (CAM)": {
    "overall": 77,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 33,
    "fechaNacimiento": "1991-07-24",
    "source": "fc26"
  },
  "colocolo|Álvaro Madrid (CM)": {
    "overall": 73,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "colocolo|Arturo Vidal (CM)": {
    "overall": 73,
    "nationality": "Chile",
    "dorsal": 23,
    "age": 38,
    "fechaNacimiento": "1987-05-22",
    "source": "fc26"
  },
  "colocolo|Javier Méndez (CB)": {
    "overall": 72,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "colocolo|Javier Correa (ST)": {
    "overall": 72,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "colocolo|Fernando De Paul (GK)": {
    "overall": 71,
    "nationality": "Chile",
    "dorsal": 30,
    "age": 34,
    "fechaNacimiento": "1991-04-25",
    "source": "fc26"
  },
  "colocolo|Felipe Méndez (CDM)": {
    "overall": 71,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "colocolo|Maximiliano Romero (ST)": {
    "overall": 71,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "colocolo|Tomás Alarcón (CDM)": {
    "overall": 69,
    "nationality": "Chile",
    "dorsal": 25,
    "age": 26,
    "fechaNacimiento": "1999-01-19",
    "source": "fc26"
  },
  "colocolo|Matías Fernández (RB)": {
    "overall": 68,
    "nationality": "Chile",
    "dorsal": 13,
    "age": 29,
    "fechaNacimiento": "1995-08-14",
    "source": "fc26"
  },
  "colocolo|Jonathan Villagra (CB)": {
    "overall": 68,
    "nationality": "Chile",
    "dorsal": 2,
    "age": 24,
    "fechaNacimiento": "2001-03-28",
    "source": "fc26"
  },
  "u_chile|Leandro Fernández": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 34,
    "fechaNacimiento": "1991-03-12",
    "source": "fc26"
  },
  "u_chile|Charles Aránguiz": {
    "overall": 74,
    "nationality": "Chile",
    "dorsal": 20,
    "age": 36,
    "fechaNacimiento": "1989-04-17",
    "source": "fc26"
  },
  "u_chile|Matías Zaldivia": {
    "overall": 71,
    "nationality": "Chile",
    "dorsal": 22,
    "age": 34,
    "fechaNacimiento": "1991-01-22",
    "source": "fc26"
  },
  "u_chile|Marcelo Díaz": {
    "overall": 71,
    "nationality": "Chile",
    "dorsal": 21,
    "age": 38,
    "fechaNacimiento": "1986-12-30",
    "source": "fc26"
  },
  "u_catolica|Fernando Zampedri": {
    "overall": 74,
    "nationality": "Chile",
    "dorsal": 9,
    "age": 37,
    "fechaNacimiento": "1988-02-14",
    "source": "fc26"
  },
  "u_catolica|Eugenio Mena": {
    "overall": 71,
    "nationality": "Chile",
    "dorsal": 3,
    "age": 36,
    "fechaNacimiento": "1988-07-18",
    "source": "fc26"
  },
  "u_catolica|César Pinares": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "u_catolica|Thomas Gillier": {
    "overall": 65,
    "nationality": "Chile",
    "dorsal": 31,
    "age": 21,
    "fechaNacimiento": "2004-05-28",
    "source": "fc26"
  },
  "palestino|Joe Abrigo (CAM)": {
    "overall": 72,
    "nationality": "Chile",
    "dorsal": 14,
    "age": 30,
    "fechaNacimiento": "1995-03-22",
    "source": "fc26"
  },
  "palestino|Fernando Meza (CB)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 42,
    "age": 35,
    "fechaNacimiento": "1990-03-21",
    "source": "fc26"
  },
  "palestino|Bryan Carrasco (RW)": {
    "overall": 71,
    "nationality": "Chile",
    "dorsal": 7,
    "age": 34,
    "fechaNacimiento": "1991-01-31",
    "source": "fc26"
  },
  "palestino|Sebastián Pérez (GK)": {
    "overall": 69,
    "nationality": "Chile",
    "dorsal": 25,
    "age": 34,
    "fechaNacimiento": "1990-12-02",
    "source": "fc26"
  },
  "palestino|Julián Fernández (CDM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 30,
    "fechaNacimiento": "1995-03-22",
    "source": "fc26"
  },
  "palestino|Jonathan Benítez (LW)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 33,
    "fechaNacimiento": "1991-09-04",
    "source": "fc26"
  },
  "palestino|Dilan Zúñiga (LB)": {
    "overall": 68,
    "nationality": "Chile",
    "dorsal": 28,
    "age": 28,
    "fechaNacimiento": "1996-07-26",
    "source": "fc26"
  },
  "palestino|César Munder (LW)": {
    "overall": 68,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "palestino|Enzo Roco (CB)": {
    "overall": 68,
    "nationality": "Chile",
    "dorsal": 4,
    "age": 32,
    "fechaNacimiento": "1992-08-16",
    "source": "fc26"
  },
  "palestino|Ronnie Fernández (ST)": {
    "overall": 69,
    "nationality": "Chile",
    "dorsal": 12,
    "age": 34,
    "fechaNacimiento": "1991-01-30",
    "source": "fc26"
  },
  "palestino|Ariel Martínez (CM)": {
    "overall": 66,
    "nationality": "Chile",
    "dorsal": 10,
    "age": 31,
    "fechaNacimiento": "1994-01-10",
    "source": "fc26"
  },
  "coquimbo_unido|Alejandro Camargo (CDM)": {
    "overall": 70,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "coquimbo_unido|Rodrigo Holgado (ST)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 30,
    "fechaNacimiento": "1995-06-28",
    "source": "fc26"
  },
  "coquimbo_unido|Diego Sánchez (GK)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 21,
    "fechaNacimiento": "2003-07-18",
    "source": "fc26"
  },
  "coquimbo_unido|Lucas Pratto (ST)": {
    "overall": 69,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "coquimbo_unido|Benjamín Gazzolo (CB)": {
    "overall": 68,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "coquimbo_unido|Manuel Fernández (CB)": {
    "overall": 64,
    "nationality": "Argentina",
    "dorsal": 74,
    "age": 20,
    "fechaNacimiento": "2004-10-08",
    "source": "fc26"
  },
  "coquimbo_unido|Dylan Glaby (CDM)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 4,
    "age": 29,
    "fechaNacimiento": "1996-04-07",
    "source": "fc26"
  },
  "coquimbo_unido|Cristián Zavala (RW)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "coquimbo_unido|Matías Fracchia (CB)": {
    "overall": 66,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "coquimbo_unido|Dylan Escobar (RB)": {
    "overall": 66,
    "nationality": "Chile",
    "dorsal": 21,
    "age": 24,
    "fechaNacimiento": "2000-12-02",
    "source": "fc26"
  },
  "coquimbo_unido|Salvador Cordero (CDM)": {
    "overall": 66,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "cobresal|Steffan Pino (ST)": {
    "overall": 67,
    "nationality": "Chile",
    "dorsal": 8,
    "age": 31,
    "fechaNacimiento": "1994-02-26",
    "source": "fc26"
  },
  "cobresal|Franco Frías (ST)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 20,
    "age": 23,
    "fechaNacimiento": "2002-03-17",
    "source": "fc26"
  },
  "cobresal|Jorge Pinos (GK)": {
    "overall": 66,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "cobresal|César Yanis (RW)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "cobresal|Bryan Carvallo (CAM)": {
    "overall": 66,
    "nationality": "Chile",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1996-09-15",
    "source": "fc26"
  },
  "cobresal|Julián Brea (RW)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "cobresal|Guillermo Pacheco (RB)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "cobresal|Juan Fuentes (CDM)": {
    "overall": 65,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "cobresal|Esteban Valencia (CM)": {
    "overall": 65,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "cobresal|José Tiznado (CB)": {
    "overall": 64,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "cobresal|Franco Bechtholdt (CB)": {
    "overall": 64,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "unión_la_calera|Kevin Méndez (RW)": {
    "overall": 72,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "unión_la_calera|Daniel Gutiérrez (CB)": {
    "overall": 67,
    "nationality": "Chile",
    "dorsal": 3,
    "age": 22,
    "fechaNacimiento": "2003-02-16",
    "source": "fc26"
  },
  "unión_la_calera|Juan Requena (CDM)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 24,
    "age": 26,
    "fechaNacimiento": "1999-01-24",
    "source": "fc26"
  },
  "unión_la_calera|Sebastián Sáez (ST)": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "unión_la_calera|Yerko Leiva (CM)": {
    "overall": 67,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "unión_la_calera|Camilo Moya (CDM)": {
    "overall": 65,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "unión_la_calera|Nicolás Avellaneda (GK)": {
    "overall": 64,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "unión_la_calera|Rodrigo Cáseres (CB)": {
    "overall": 64,
    "nationality": "Argentina",
    "dorsal": 2,
    "age": 27,
    "fechaNacimiento": "1997-08-29",
    "source": "fc26"
  },
  "unión_la_calera|Cristián Gutiérrez (LB)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 24,
    "fechaNacimiento": "2000-11-30",
    "source": "fc26"
  },
  "unión_la_calera|Bayron Oyarzo (RW)": {
    "overall": 64,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "unión_la_calera|Francisco Pozzo (ST)": {
    "overall": 64,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "huachipato|Cris Martínez (LW)": {
    "overall": 69,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "huachipato|Rafael Caroca (CB)": {
    "overall": 68,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "huachipato|Nicolás Vargas (CB)": {
    "overall": 68,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "huachipato|Santiago Silva (CM)": {
    "overall": 68,
    "nationality": "Uruguay",
    "dorsal": 27,
    "age": 26,
    "fechaNacimiento": "1999-05-01",
    "source": "fc26"
  },
  "huachipato|Ezequiel Cañete (CM)": {
    "overall": 67,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "huachipato|Lionel Altamirano (ST)": {
    "overall": 67,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "huachipato|Rodrigo Odriozola (GK)": {
    "overall": 66,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "huachipato|Maximiliano Rodríguez Vejar (ST)": {
    "overall": 66,
    "nationality": "Chile",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-05-31",
    "source": "fc26"
  },
  "huachipato|Claudio Sepúlveda (CDM)": {
    "overall": 66,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "huachipato|Renzo Malanca (CB)": {
    "overall": 66,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "huachipato|Benjamín Mellado (CB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "ñublense|Gabriel Graciani (RM)": {
    "overall": 71,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "ñublense|Nicola Pérez (GK)": {
    "overall": 70,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "ñublense|Lorenzo Reyes (CDM)": {
    "overall": 69,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "ñublense|Ignacio Jeraldino (ST)": {
    "overall": 67,
    "nationality": "Chile",
    "dorsal": 23,
    "age": 29,
    "fechaNacimiento": "1995-12-06",
    "source": "fc26"
  },
  "ñublense|Franco Rami (ST)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 19,
    "age": 22,
    "fechaNacimiento": "2003-03-31",
    "source": "fc26"
  },
  "ñublense|Osvaldo Bosso (CB)": {
    "overall": 66,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "ñublense|Manuel Rivera (CM)": {
    "overall": 66,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "ñublense|Felipe Campos (RB)": {
    "overall": 66,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "ñublense|Jovany Campusano (LB)": {
    "overall": 65,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "ñublense|Fernando Ovelar (RM)": {
    "overall": 66,
    "nationality": "Paraguay",
    "dorsal": 7,
    "age": 21,
    "fechaNacimiento": "2004-01-06",
    "source": "fc26"
  },
  "ñublense|Matías Plaza (LM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "audax_italiano|Federico Mateos (CM)": {
    "overall": 72,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "audax_italiano|Rodrigo Cabral (LW)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 16,
    "age": 24,
    "fechaNacimiento": "2000-08-08",
    "source": "fc26"
  },
  "audax_italiano|Diego Coelho (ST)": {
    "overall": 68,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "audax_italiano|Franco Troyansky (ST)": {
    "overall": 68,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "audax_italiano|Marcelo Ortíz (CB)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 13,
    "age": 31,
    "fechaNacimiento": "1994-01-13",
    "source": "fc26"
  },
  "audax_italiano|Michael Vadulli (LW)": {
    "overall": 67,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "audax_italiano|Nicolás Orellana (CM)": {
    "overall": 67,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "audax_italiano|Raimundo Rebolledo (RB)": {
    "overall": 67,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "audax_italiano|Marco Collao (CM)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "audax_italiano|Daniel Piña (CB)": {
    "overall": 63,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "audax_italiano|Giovani Chiaverano (RW)": {
    "overall": 58,
    "nationality": "Argentina",
    "dorsal": 42,
    "age": 20,
    "fechaNacimiento": "2005-05-21",
    "source": "fc26"
  },
  "deportes_limache|Jean Meneses (LW)": {
    "overall": 73,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "deportes_limache|Joaquín Montecinos (RW)": {
    "overall": 70,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "deportes_limache|Nicolás Peñailillo (LB)": {
    "overall": 69,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "deportes_limache|Alfonso Parot (LB)": {
    "overall": 68,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "deportes_limache|César Pinares (CAM)": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "deportes_limache|Gonzalo Sosa (ST)": {
    "overall": 68,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "deportes_limache|Ramón Martínez (CDM)": {
    "overall": 63,
    "nationality": "Spain",
    "dorsal": 35,
    "age": 22,
    "fechaNacimiento": "2002-10-22",
    "source": "fc26"
  },
  "deportes_limache|César Fuentes (CDM)": {
    "overall": 67,
    "nationality": "Chile",
    "dorsal": 5,
    "age": 32,
    "fechaNacimiento": "1993-04-12",
    "source": "fc26"
  },
  "deportes_limache|Daniel Castro (LW)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "deportes_limache|Claudio González (GK)": {
    "overall": 65,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "deportes_limache|Marcos Arturia (ST)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 28,
    "age": 27,
    "fechaNacimiento": "1998-02-08",
    "source": "fc26"
  },
  "deportes_la_serena|Gonzalo Escalante (CM)": {
    "overall": 71,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "deportes_la_serena|Federico Lanzillotta (GK)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 33,
    "age": 32,
    "fechaNacimiento": "1992-12-01",
    "source": "fc26"
  },
  "deportes_la_serena|Rafael Delgado (LB)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 34,
    "age": 35,
    "fechaNacimiento": "1990-01-13",
    "source": "fc26"
  },
  "deportes_la_serena|Francis Mac Allister (CDM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 14,
    "age": 29,
    "fechaNacimiento": "1995-10-30",
    "source": "fc26"
  },
  "deportes_la_serena|Matías Marín (CM)": {
    "overall": 69,
    "nationality": "Chile",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "1999-12-19",
    "source": "fc26"
  },
  "deportes_la_serena|Diego Rubio (ST)": {
    "overall": 69,
    "nationality": "Chile",
    "dorsal": 21,
    "age": 32,
    "fechaNacimiento": "1993-05-15",
    "source": "fc26"
  },
  "deportes_la_serena|Nicolás Stefanelli (ST)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 15,
    "age": 30,
    "fechaNacimiento": "1994-11-22",
    "source": "fc26"
  },
  "deportes_la_serena|Lucas Alarcón (CB)": {
    "overall": 67,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "deportes_la_serena|Alexander Oroz (LW)": {
    "overall": 66,
    "nationality": "Chile",
    "dorsal": 20,
    "age": 22,
    "fechaNacimiento": "2002-12-15",
    "source": "fc26"
  },
  "deportes_la_serena|Andrés Zanini (CB)": {
    "overall": 65,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "deportes_la_serena|Ángelo Henríquez (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "unión_española|Patricio Rubio (ST)": {
    "overall": 71,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "unión_española|Pablo Aránguiz (LW)": {
    "overall": 71,
    "nationality": "Chile",
    "dorsal": 22,
    "age": 28,
    "fechaNacimiento": "1997-03-17",
    "source": "fc26"
  },
  "unión_española|José Aja (CB)": {
    "overall": 70,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "unión_española|Martín Rodríguez (GK)": {
    "overall": 65,
    "nationality": "Uruguay",
    "dorsal": 12,
    "age": 35,
    "fechaNacimiento": "1989-09-20",
    "source": "fc26"
  },
  "unión_española|Martín Parra (GK)": {
    "overall": 65,
    "nationality": "Chile",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2000-09-01",
    "source": "fc26"
  },
  "unión_española|Ignacio Núñez (CM)": {
    "overall": 65,
    "nationality": "Chile",
    "dorsal": 14,
    "age": 26,
    "fechaNacimiento": "1999-01-15",
    "source": "fc26"
  },
  "unión_española|Sebastián Pereira (CB)": {
    "overall": 64,
    "nationality": "Chile",
    "dorsal": 13,
    "age": 26,
    "fechaNacimiento": "1999-01-14",
    "source": "fc26"
  },
  "unión_española|Andrés Vilches (ST)": {
    "overall": 64,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "unión_española|Bastián Roco (CB)": {
    "overall": 65,
    "nationality": "Chile",
    "dorsal": 26,
    "age": 21,
    "fechaNacimiento": "2003-10-24",
    "source": "fc26"
  },
  "unión_española|Bruno Jáuregui (CDM)": {
    "overall": 63,
    "nationality": "Chile",
    "dorsal": 6,
    "age": 21,
    "fechaNacimiento": "2004-01-17",
    "source": "fc26"
  },
  "unión_española|Gabriel Norambuena (LB)": {
    "overall": 62,
    "nationality": "Chile",
    "dorsal": 24,
    "age": 22,
    "fechaNacimiento": "2003-05-07",
    "source": "fc26"
  },
  "deportes_iquique|Édson Puch (LW)": {
    "overall": 71,
    "nationality": "Chile",
    "dorsal": 10,
    "age": 39,
    "fechaNacimiento": "1986-04-09",
    "source": "fc26"
  },
  "deportes_iquique|Álvaro Ramos (ST)": {
    "overall": 68,
    "nationality": "Chile",
    "dorsal": 11,
    "age": 33,
    "fechaNacimiento": "1992-04-14",
    "source": "fc26"
  },
  "deportes_iquique|César González (RW)": {
    "overall": 65,
    "nationality": "Chile",
    "dorsal": 17,
    "age": 28,
    "fechaNacimiento": "1997-01-11",
    "source": "fc26"
  },
  "deportes_iquique|Matías Blázquez (CB)": {
    "overall": 65,
    "nationality": "Chile",
    "dorsal": 30,
    "age": 34,
    "fechaNacimiento": "1991-05-08",
    "source": "fc26"
  },
  "deportes_iquique|Felipe Espinoza (LB)": {
    "overall": 66,
    "nationality": "Chile",
    "dorsal": 18,
    "age": 25,
    "fechaNacimiento": "1999-09-20",
    "source": "fc26"
  },
  "deportes_iquique|Isaac Díaz (ST)": {
    "overall": 64,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "deportes_iquique|Brayan Garrido (CM)": {
    "overall": 64,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "deportes_iquique|Zacarías López (GK)": {
    "overall": 64,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "deportes_iquique|Agustin Venezia (CAM)": {
    "overall": 63,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "deportes_iquique|Simón Contreras (RB)": {
    "overall": 63,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "deportes_iquique|Daniel Castillo (GK)": {
    "overall": 62,
    "nationality": "Chile",
    "dorsal": 12,
    "age": 34,
    "fechaNacimiento": "1990-10-23",
    "source": "fc26"
  },
  "curicó_unido|Leandro Benegas (ST)": {
    "overall": 68,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "curicó_unido|Rodrigo Colombo (CB)": {
    "overall": 66,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "curicó_unido|Ronald de la Fuente (LB)": {
    "overall": 64,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "curicó_unido|Henry Sanhueza (CB)": {
    "overall": 63,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "curicó_unido|Joaquín Romo (CM)": {
    "overall": 63,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "curicó_unido|Gabriel Sarria (CB)": {
    "overall": 63,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "curicó_unido|Damian Ezequiel Tello (GK)": {
    "overall": 62,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "curicó_unido|Braulio Guisolfo (CDM)": {
    "overall": 62,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "curicó_unido|Javier Retamales (CAM)": {
    "overall": 62,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "curicó_unido|Juan Pablo Gómez (RB)": {
    "overall": 62,
    "dorsal": 39,
    "source": "latamfc26"
  },
  "curicó_unido|Enzo Ormeño (CM)": {
    "overall": 61,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "deportes_copiapó|Lautaro Palacios (ST)": {
    "overall": 70,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "deportes_copiapó|Fabián Torres (CB)": {
    "overall": 66,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "deportes_copiapó|Iván Ledezma (CM)": {
    "overall": 66,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "deportes_copiapó|Agustín Ortiz (RB)": {
    "overall": 65,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "deportes_copiapó|Gastón Pérez (CDM)": {
    "overall": 65,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "deportes_copiapó|Carlos Ross (RW)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "deportes_copiapó|John Santander (LB)": {
    "overall": 64,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "deportes_copiapó|Claudio Zamorano (CDM)": {
    "overall": 63,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "deportes_copiapó|Manuel López (ST)": {
    "overall": 63,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "deportes_copiapó|Jorge Ortiz (CAM)": {
    "overall": 64,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 33,
    "fechaNacimiento": "1992-04-25",
    "source": "fc26"
  },
  "deportes_copiapó|Nicolás Temperini (GK)": {
    "overall": 61,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "cobreloa|Sebastián Zúñiga (CAM)": {
    "overall": 68,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "cobreloa|Cristian Insaurralde (LW)": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "cobreloa|Felipe Fritz (LB)": {
    "overall": 67,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "cobreloa|Tomás Aránguiz (CM)": {
    "overall": 66,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "cobreloa|Gustavo Gotti (ST)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "cobreloa|Jorge Gatica (CM)": {
    "overall": 64,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "cobreloa|Diego Tapia (GK)": {
    "overall": 63,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "cobreloa|Vicente Conelli (ST)": {
    "overall": 63,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "cobreloa|Rodolfo González (CB)": {
    "overall": 62,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "cobreloa|Hugo Araya (GK)": {
    "overall": 62,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "cobreloa|Facundo Velazco (LM)": {
    "overall": 62,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "deportes_recoleta|Gonzalo Álvarez (RW)": {
    "overall": 64,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "deportes_recoleta|Francisco Alarcón (CB)": {
    "overall": 63,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "deportes_recoleta|Germán Estigarribia (ST)": {
    "overall": 63,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "deportes_recoleta|Álvaro Salazar (GK)": {
    "overall": 62,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "deportes_recoleta|Felipe Saavedra (LB)": {
    "overall": 62,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "deportes_recoleta|Christian Cepeda (CB)": {
    "overall": 62,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "deportes_recoleta|Camilo Rodríguez (RB)": {
    "overall": 62,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "deportes_recoleta|Federico Martin (CDM)": {
    "overall": 62,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "deportes_recoleta|Pedro Sánchez (ST)": {
    "overall": 61,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "deportes_recoleta|Mikel Arguinarena (CAM)": {
    "overall": 61,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "deportes_recoleta|Brayams Viveros (CB)": {
    "overall": 60,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "deportes_temuco|Brian Torrealba (RB)": {
    "overall": 67,
    "dorsal": 35,
    "source": "latamfc26"
  },
  "deportes_temuco|Diego Buonanotte (CAM)": {
    "overall": 66,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "deportes_temuco|Felipe Reynero (RW)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "deportes_temuco|Rodrigo González (RB)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "2000-04-14",
    "source": "fc26"
  },
  "deportes_temuco|Maximiliano Cuadra (ST)": {
    "overall": 64,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "deportes_temuco|Yerko Urra (GK)": {
    "overall": 63,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "deportes_temuco|Camilo Núñez (CDM)": {
    "overall": 63,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "deportes_temuco|Brayan Valdivia (RW)": {
    "overall": 63,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "deportes_temuco|Luis Acevedo (ST)": {
    "overall": 63,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "deportes_temuco|César Huanca (ST)": {
    "overall": 63,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "deportes_temuco|Miguel Sanhueza (CB)": {
    "overall": 63,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "unión_san_felipe|Agustín Fontana (ST)": {
    "overall": 67,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "unión_san_felipe|Gonzalo Jara (LW)": {
    "overall": 66,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "unión_san_felipe|Bruno Vides (ST)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 32,
    "age": 32,
    "fechaNacimiento": "1993-02-20",
    "source": "fc26"
  },
  "unión_san_felipe|Valentín Perales (CB)": {
    "overall": 64,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "unión_san_felipe|Ignacio Jara (CAM)": {
    "overall": 64,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "unión_san_felipe|Leandro Cañete (GK)": {
    "overall": 63,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "unión_san_felipe|Luis García (CDM)": {
    "overall": 63,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "unión_san_felipe|Diego Pereira (LB)": {
    "overall": 63,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "unión_san_felipe|Nicolás Brun (LM)": {
    "overall": 63,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "unión_san_felipe|Kevin Serrano (CB)": {
    "overall": 62,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "unión_san_felipe|Patricio Muñoz (ST)": {
    "overall": 62,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "puerto_montt|Alexis Sabella (LW)": {
    "overall": 66,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "puerto_montt|Luciano Vázquez (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "puerto_montt|Byron Nieto (RB)": {
    "overall": 64,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "puerto_montt|Jason Flores (LM)": {
    "overall": 64,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "puerto_montt|Luis Ureta (GK)": {
    "overall": 63,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "puerto_montt|Ariel Morales (CB)": {
    "overall": 63,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "puerto_montt|Kevin Egaña (LB)": {
    "overall": 63,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "puerto_montt|Cristóbal Vargas (CAM)": {
    "overall": 63,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "puerto_montt|Maximiliano Riveros (CB)": {
    "overall": 62,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "puerto_montt|Gabriel Castillo (CM)": {
    "overall": 62,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "puerto_montt|Richard Paredes (CAM)": {
    "overall": 62,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "penarol|Leonardo Fernández (CAM)": {
    "overall": 78,
    "nationality": "Uruguay",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1998-11-08",
    "source": "fc26"
  },
  "penarol|Gastón Togni (LM)": {
    "overall": 75,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "penarol|Diego Laxalt (LB)": {
    "overall": 73,
    "dorsal": 93,
    "source": "latamfc26"
  },
  "penarol|Emanuel Gularte (CB)": {
    "overall": 72,
    "nationality": "Uruguay",
    "dorsal": 17,
    "age": 27,
    "fechaNacimiento": "1997-09-30",
    "source": "fc26"
  },
  "penarol|Matías Arezo (ST)": {
    "overall": 72,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "penarol|Javier Cabrera (RM)": {
    "overall": 72,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "penarol|Abel Hernández (ST)": {
    "overall": 72,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "penarol|Facundo Batista (ST)": {
    "overall": 72,
    "nationality": "Uruguay",
    "dorsal": 19,
    "age": 26,
    "fechaNacimiento": "1999-01-16",
    "source": "fc26"
  },
  "penarol|Washington Aguerre (GK)": {
    "overall": 71,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "penarol|Lucas Ferreira (CB)": {
    "overall": 71,
    "nationality": "Uruguay",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "2000-06-16",
    "source": "fc26"
  },
  "penarol|Luis Miguel Angulo (LM)": {
    "overall": 71,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "nacional_uru|Sebastián Coates": {
    "overall": 79,
    "nationality": "Uruguay",
    "dorsal": 4,
    "age": 34,
    "fechaNacimiento": "1990-10-07",
    "source": "fc26"
  },
  "nacional_uru|Nicolás López": {
    "overall": 76,
    "nationality": "Uruguay",
    "dorsal": 7,
    "age": 31,
    "fechaNacimiento": "1993-10-01",
    "source": "fc26"
  },
  "nacional_uru|Luis Mejía": {
    "overall": 72,
    "nationality": "Panama",
    "dorsal": 12,
    "age": 34,
    "fechaNacimiento": "1991-03-16",
    "source": "fc26"
  },
  "nacional_uru|Mauricio Pereyra": {
    "overall": 70,
    "nationality": "Uruguay",
    "dorsal": 10,
    "age": 35,
    "fechaNacimiento": "1990-03-15",
    "source": "fc26"
  },
  "defensor_sporting|Octavio Rivero": {
    "overall": 73,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "defensor_sporting|Fernando Elizari": {
    "overall": 68,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "defensor_sporting|Renzo Giampaoli": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "2000-01-07",
    "source": "fc26"
  },
  "defensor_sporting|Kevin Dawson": {
    "overall": 74,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "danubio|Sebastián Rodríguez (CM)": {
    "overall": 75,
    "nationality": "Uruguay",
    "dorsal": 14,
    "age": 32,
    "fechaNacimiento": "1992-08-16",
    "source": "fc26"
  },
  "danubio|Mauro Goicoechea (GK)": {
    "overall": 71,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "danubio|Sebastián Fernández (ST)": {
    "overall": 71,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "danubio|Iván Rossi (CDM)": {
    "overall": 71,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "danubio|Emiliano Velázquez (CB)": {
    "overall": 69,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "danubio|Camilo Mayada (RB)": {
    "overall": 68,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "danubio|Tomás Cavanagh (LB)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 37,
    "age": 24,
    "fechaNacimiento": "2001-01-05",
    "source": "fc26"
  },
  "danubio|Leandro Sosa (CDM)": {
    "overall": 68,
    "nationality": "Uruguay",
    "dorsal": 8,
    "age": 31,
    "fechaNacimiento": "1994-06-24",
    "source": "fc26"
  },
  "danubio|Mateo Rinaldi (CB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "danubio|Mateo Peralta (CM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "danubio|Juan Millán (CDM)": {
    "overall": 64,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "racing_club_uru|Adrián Martínez (ST)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 32,
    "fechaNacimiento": "1992-07-07",
    "source": "fc26"
  },
  "racing_club_uru|Gabriel Rojas (LM)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 27,
    "age": 28,
    "fechaNacimiento": "1997-06-22",
    "source": "fc26"
  },
  "racing_club_uru|Santiago Sosa (CB)": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 13,
    "age": 26,
    "fechaNacimiento": "1999-05-03",
    "source": "fc26"
  },
  "racing_club_uru|Facundo Cambeses (GK)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 28,
    "fechaNacimiento": "1997-04-09",
    "source": "fc26"
  },
  "racing_club_uru|Marcos Rojo (CB)": {
    "overall": 75,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "racing_club_uru|Gastón Martirena (RM)": {
    "overall": 75,
    "nationality": "Uruguay",
    "dorsal": 15,
    "age": 25,
    "fechaNacimiento": "2000-02-05",
    "source": "fc26"
  },
  "racing_club_uru|Marco Di Cesare (CB)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 3,
    "age": 23,
    "fechaNacimiento": "2002-01-30",
    "source": "fc26"
  },
  "racing_club_uru|Santiago Solari (RW)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 28,
    "age": 27,
    "fechaNacimiento": "1998-01-19",
    "source": "fc26"
  },
  "racing_club_uru|Tomás Conechny (LM)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 17,
    "age": 27,
    "fechaNacimiento": "1998-03-30",
    "source": "fc26"
  },
  "racing_club_uru|Duván Vergara (LW)": {
    "overall": 74,
    "nationality": "Colombia",
    "dorsal": 7,
    "age": 28,
    "fechaNacimiento": "1996-09-09",
    "source": "fc26"
  },
  "racing_club_uru|Valentín Carboni (CAM)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 20,
    "fechaNacimiento": "2005-03-05",
    "source": "fc26"
  },
  "cerro_largo_uru|Sebastián Assís (CDM)": {
    "overall": 69,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "cerro_largo_uru|Nicolás Bertocchi (CDM)": {
    "overall": 67,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "cerro_largo_uru|Lucas Correa (CB)": {
    "overall": 66,
    "nationality": "Uruguay",
    "dorsal": 14,
    "age": 29,
    "fechaNacimiento": "1996-05-07",
    "source": "fc26"
  },
  "cerro_largo_uru|Gustavo Viera (ST)": {
    "overall": 65,
    "nationality": "Uruguay",
    "dorsal": 18,
    "age": 24,
    "fechaNacimiento": "2000-10-21",
    "source": "fc26"
  },
  "cerro_largo_uru|Juan Moreno (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "cerro_largo_uru|Mario García (CM)": {
    "overall": 65,
    "nationality": "Uruguay",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "1999-09-08",
    "source": "fc26"
  },
  "cerro_largo_uru|Fernando Souza (RB)": {
    "overall": 65,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "cerro_largo_uru|Alexander Hernández (CAM)": {
    "overall": 64,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "cerro_largo_uru|Maximiliano Añasco (LW)": {
    "overall": 64,
    "nationality": "Uruguay",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2001-05-04",
    "source": "fc26"
  },
  "cerro_largo_uru|Ihojan Pérez (RM)": {
    "overall": 64,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "cerro_largo_uru|Federico Sellecchia (ST)": {
    "overall": 64,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "boston_river_uru|Gastón Ramírez (CM)": {
    "overall": 72,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "boston_river_uru|Agustín Amado (CM)": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "boston_river_uru|Rafael Haller (RB)": {
    "overall": 69,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "boston_river_uru|Bruno Antúnez (GK)": {
    "overall": 67,
    "nationality": "Uruguay",
    "dorsal": 1,
    "age": 22,
    "fechaNacimiento": "2003-01-31",
    "source": "fc26"
  },
  "boston_river_uru|Juan Acosta (RB)": {
    "overall": 68,
    "nationality": "Uruguay",
    "dorsal": 31,
    "age": 31,
    "fechaNacimiento": "1993-11-11",
    "source": "fc26"
  },
  "boston_river_uru|Andrés Romero (CM)": {
    "overall": 68,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "boston_river_uru|Leandro Suhr (RW)": {
    "overall": 67,
    "nationality": "Uruguay",
    "dorsal": 15,
    "age": 27,
    "fechaNacimiento": "1997-09-24",
    "source": "fc26"
  },
  "boston_river_uru|Fredy Martínez (LB)": {
    "overall": 67,
    "nationality": "Uruguay",
    "dorsal": 22,
    "age": 24,
    "fechaNacimiento": "2001-05-01",
    "source": "fc26"
  },
  "boston_river_uru|Martín González (CB)": {
    "overall": 65,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "boston_river_uru|Facundo Muñoa (CM)": {
    "overall": 65,
    "nationality": "Uruguay",
    "dorsal": 26,
    "age": 21,
    "fechaNacimiento": "2004-06-11",
    "source": "fc26"
  },
  "boston_river_uru|Facundo Rodríguez (ST)": {
    "overall": 65,
    "nationality": "Uruguay",
    "dorsal": 7,
    "age": 29,
    "fechaNacimiento": "1995-08-20",
    "source": "fc26"
  },
  "albion_uru|Hernán Toledo (LM)": {
    "overall": 71,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "albion_uru|Matías de los Santos (CB)": {
    "overall": 69,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "albion_uru|Francisco Ginella (CM)": {
    "overall": 68,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "albion_uru|Tobías Figueroa (ST)": {
    "overall": 68,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "albion_uru|José Álvarez (LM)": {
    "overall": 67,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "albion_uru|Leonardo Pais (RM)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "albion_uru|Agustín Pereira (RB)": {
    "overall": 66,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "albion_uru|Andrés Romero (CB)": {
    "overall": 66,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "albion_uru|Briam Acosta (RM)": {
    "overall": 66,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "albion_uru|Álvaro López (ST)": {
    "overall": 66,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "albion_uru|Tomás Moschión (CDM)": {
    "overall": 65,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "maldonado_uru|Hernán Menosse (CB)": {
    "overall": 69,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "maldonado_uru|Christian Tabó (RM)": {
    "overall": 69,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "maldonado_uru|Bruno Mendes (ST)": {
    "overall": 69,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "maldonado_uru|Juan Ramos (LB)": {
    "overall": 68,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "maldonado_uru|Hernán Petryk (RB)": {
    "overall": 66,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "maldonado_uru|Facundo Tealde (CB)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "maldonado_uru|Santiago Cartagena (CDM)": {
    "overall": 65,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "maldonado_uru|Maximiliano González (CDM)": {
    "overall": 65,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "maldonado_uru|Adriano Freitas (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "maldonado_uru|Santiago Ramírez (ST)": {
    "overall": 64,
    "nationality": "Uruguay",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1998-03-12",
    "source": "fc26"
  },
  "maldonado_uru|Maximiliano Noble (CAM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "universitario|Williams Riveros (CB)": {
    "overall": 72,
    "nationality": "Paraguay",
    "dorsal": 3,
    "age": 32,
    "fechaNacimiento": "1992-11-20",
    "source": "fc26"
  },
  "universitario|Andy Polo (RW)": {
    "overall": 72,
    "nationality": "Peru",
    "dorsal": 24,
    "age": 30,
    "fechaNacimiento": "1994-09-29",
    "source": "fc26"
  },
  "universitario|Jairo Concha (CM)": {
    "overall": 72,
    "nationality": "Peru",
    "dorsal": 17,
    "age": 26,
    "fechaNacimiento": "1999-05-27",
    "source": "fc26"
  },
  "universitario|Alex Valera (ST)": {
    "overall": 72,
    "nationality": "Peru",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1996-05-16",
    "source": "fc26"
  },
  "universitario|Edison Flores (ST)": {
    "overall": 72,
    "nationality": "Peru",
    "dorsal": 19,
    "age": 31,
    "fechaNacimiento": "1994-05-14",
    "source": "fc26"
  },
  "universitario|Anderson Santamaría (CB)": {
    "overall": 71,
    "nationality": "Peru",
    "dorsal": 40,
    "age": 33,
    "fechaNacimiento": "1992-01-10",
    "source": "fc26"
  },
  "universitario|Martín Pérez Guedes (CM)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 16,
    "age": 33,
    "fechaNacimiento": "1991-08-18",
    "source": "fc26"
  },
  "universitario|Aldo Corzo (CB)": {
    "overall": 71,
    "nationality": "Peru",
    "dorsal": 29,
    "age": 36,
    "fechaNacimiento": "1989-05-20",
    "source": "fc26"
  },
  "universitario|Bryan Reyna (LM)": {
    "overall": 71,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "universitario|José Carabalí (LB)": {
    "overall": 70,
    "nationality": "Ecuador",
    "dorsal": 27,
    "age": 28,
    "fechaNacimiento": "1997-05-19",
    "source": "fc26"
  },
  "universitario|Lisandro Alzugaray (RW)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 35,
    "fechaNacimiento": "1990-04-17",
    "source": "fc26"
  },
  "alianza_lima|Luis Advíncula (RB)": {
    "overall": 75,
    "nationality": "Peru",
    "dorsal": 17,
    "age": 35,
    "fechaNacimiento": "1990-03-02",
    "source": "fc26"
  },
  "alianza_lima|Pedro Aquino (CDM)": {
    "overall": 73,
    "dorsal": 55,
    "source": "latamfc26"
  },
  "alianza_lima|Guillermo Viscarra (GK)": {
    "overall": 72,
    "nationality": "Bolivia",
    "dorsal": 23,
    "age": 32,
    "fechaNacimiento": "1993-02-07",
    "source": "fc26"
  },
  "alianza_lima|Paolo Guerrero (ST)": {
    "overall": 72,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "alianza_lima|Renzo Garcés (CB)": {
    "overall": 71,
    "nationality": "Peru",
    "dorsal": 6,
    "age": 29,
    "fechaNacimiento": "1996-06-12",
    "source": "fc26"
  },
  "alianza_lima|Fernando Gaibor (CM)": {
    "overall": 71,
    "nationality": "Ecuador",
    "dorsal": 7,
    "age": 33,
    "fechaNacimiento": "1991-10-08",
    "source": "fc26"
  },
  "alianza_lima|Eryc Castillo (RW)": {
    "overall": 70,
    "nationality": "Ecuador",
    "dorsal": 8,
    "age": 30,
    "fechaNacimiento": "1995-02-05",
    "source": "fc26"
  },
  "alianza_lima|Gaspar Gentile (RW)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 30,
    "fechaNacimiento": "1995-02-16",
    "source": "fc26"
  },
  "alianza_lima|Josué Estrada (RB)": {
    "overall": 70,
    "nationality": "Peru",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1996-09-07",
    "source": "fc26"
  },
  "alianza_lima|Federico Girotti (ST)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 26,
    "fechaNacimiento": "1999-06-02",
    "source": "fc26"
  },
  "alianza_lima|Esteban Pavez (CDM)": {
    "overall": 69,
    "nationality": "Chile",
    "dorsal": 8,
    "age": 35,
    "fechaNacimiento": "1990-05-01",
    "source": "fc26"
  },
  "sporting_cristal|Santiago González (RW)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "1999-07-25",
    "source": "fc26"
  },
  "sporting_cristal|Christofer Gonzáles (CAM)": {
    "overall": 71,
    "nationality": "Peru",
    "dorsal": 10,
    "age": 32,
    "fechaNacimiento": "1992-10-12",
    "source": "fc26"
  },
  "sporting_cristal|Martín Távara (CM)": {
    "overall": 71,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "sporting_cristal|Felipe Vizeu (ST)": {
    "overall": 71,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "sporting_cristal|Gustavo Cazonatti (CDM)": {
    "overall": 70,
    "dorsal": 55,
    "source": "latamfc26"
  },
  "sporting_cristal|Yoshimar Yotún (CM)": {
    "overall": 70,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "sporting_cristal|Luis Iberico (ST)": {
    "overall": 70,
    "nationality": "Peru",
    "dorsal": 16,
    "age": 27,
    "fechaNacimiento": "1998-02-06",
    "source": "fc26"
  },
  "sporting_cristal|Luis Abram (CB)": {
    "overall": 70,
    "dorsal": 96,
    "source": "latamfc26"
  },
  "sporting_cristal|Diego Enríquez (GK)": {
    "overall": 69,
    "nationality": "Peru",
    "dorsal": 1,
    "age": 23,
    "fechaNacimiento": "2002-01-24",
    "source": "fc26"
  },
  "sporting_cristal|Írven Ávila (ST)": {
    "overall": 69,
    "nationality": "Peru",
    "dorsal": 11,
    "age": 34,
    "fechaNacimiento": "1990-07-02",
    "source": "fc26"
  },
  "sporting_cristal|Renato Solís (GK)": {
    "overall": 69,
    "nationality": "Peru",
    "dorsal": 12,
    "age": 27,
    "fechaNacimiento": "1998-01-28",
    "source": "fc26"
  },
  "melgar|Bernardo Cuesta": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 36,
    "fechaNacimiento": "1988-12-20",
    "source": "fc26"
  },
  "melgar|Horacio Orzán": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 15,
    "age": 37,
    "fechaNacimiento": "1988-04-14",
    "source": "fc26"
  },
  "melgar|Leonel Galeano": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 33,
    "fechaNacimiento": "1991-08-02",
    "source": "fc26"
  },
  "melgar|Carlos Cáceda": {
    "overall": 72,
    "nationality": "Peru",
    "dorsal": 12,
    "age": 33,
    "fechaNacimiento": "1991-09-27",
    "source": "fc26"
  },
  "deportivo_garcilaso|Kevin Sandoval (LW)": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "deportivo_garcilaso|Agustin Gómez (CB)": {
    "overall": 68,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "deportivo_garcilaso|Horacio Benincasa (CB)": {
    "overall": 68,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "deportivo_garcilaso|Claudio Torrejón (CDM)": {
    "overall": 68,
    "nationality": "United States",
    "dorsal": 14,
    "age": 32,
    "fechaNacimiento": "1993-05-14",
    "source": "fc26"
  },
  "deportivo_garcilaso|Aldair Salazar (CB)": {
    "overall": 67,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "deportivo_garcilaso|Patrick Zubczuk (GK)": {
    "overall": 66,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "deportivo_garcilaso|Agustín González (CM)": {
    "overall": 66,
    "nationality": "Uruguay",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-01-25",
    "source": "fc26"
  },
  "deportivo_garcilaso|Agustín Graneros (ST)": {
    "overall": 66,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "deportivo_garcilaso|José Luis Sinisterra (ST)": {
    "overall": 66,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "deportivo_garcilaso|Francisco Arancibia (RW)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "deportivo_garcilaso|Beto da Silva (LW)": {
    "overall": 65,
    "nationality": "Peru",
    "dorsal": 30,
    "age": 28,
    "fechaNacimiento": "1996-12-28",
    "source": "fc26"
  },
  "adt|Jonathan Bauman (ST)": {
    "overall": 69,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "adt|Joao Rojas (CAM)": {
    "overall": 64,
    "nationality": "Ecuador",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1997-08-16",
    "source": "fc26"
  },
  "adt|Víctor Cedrón (CAM)": {
    "overall": 69,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "adt|Luis Pérez (CM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 2,
    "age": 30,
    "fechaNacimiento": "1995-02-04",
    "source": "fc26"
  },
  "adt|Jordan Guivin (CM)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "adt|Aldair Rodríguez (ST)": {
    "overall": 68,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "adt|John Narváez (CB)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "adt|Carlos Solís (GK)": {
    "overall": 67,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "adt|Juan Valencia (GK)": {
    "overall": 66,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "adt|Luis Benítes (LW)": {
    "overall": 68,
    "nationality": "Peru",
    "dorsal": 20,
    "age": 28,
    "fechaNacimiento": "1996-07-09",
    "source": "fc26"
  },
  "adt|Carlos Cabello (RB)": {
    "overall": 66,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "sport_huancayo|Yorleys Mena (ST)": {
    "overall": 70,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "sport_huancayo|Jimmy Valoyes (CB)": {
    "overall": 67,
    "nationality": "Colombia",
    "dorsal": 70,
    "age": 38,
    "fechaNacimiento": "1986-11-30",
    "source": "fc26"
  },
  "sport_huancayo|Ángel Zamudio (GK)": {
    "overall": 67,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "sport_huancayo|Ricardo Salcedo (CDM)": {
    "overall": 67,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "sport_huancayo|Javier Sanguinetti (CAM)": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "sport_huancayo|Jeremy Rostaing (RB)": {
    "overall": 66,
    "nationality": "Peru",
    "dorsal": 15,
    "age": 30,
    "fechaNacimiento": "1995-05-25",
    "source": "fc26"
  },
  "sport_huancayo|Hugo Ángeles Chávez (LB)": {
    "overall": 66,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "sport_huancayo|Yonatan Murillo (CB)": {
    "overall": 66,
    "dorsal": 92,
    "source": "latamfc26"
  },
  "sport_huancayo|Nahuel Luján (LW)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "sport_huancayo|Diego Campos (GK)": {
    "overall": 65,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "sport_huancayo|Ronal Huaccha (ST)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "sport_boys|Carlos Zambrano (CB)": {
    "overall": 73,
    "nationality": "Peru",
    "dorsal": 5,
    "age": 35,
    "fechaNacimiento": "1989-07-10",
    "source": "fc26"
  },
  "sport_boys|Miguel Trauco (LB)": {
    "overall": 71,
    "nationality": "Peru",
    "dorsal": 21,
    "age": 32,
    "fechaNacimiento": "1992-08-25",
    "source": "fc26"
  },
  "sport_boys|Diego Melián (GK)": {
    "overall": 69,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "sport_boys|Luis Urruti (LW)": {
    "overall": 69,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "sport_boys|Carlos López (RW)": {
    "overall": 61,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 20,
    "fechaNacimiento": "2004-11-13",
    "source": "fc26"
  },
  "sport_boys|Jostin Alarcón (LW)": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "sport_boys|Gustavo Dulanto (CB)": {
    "overall": 67,
    "dorsal": 55,
    "source": "latamfc26"
  },
  "sport_boys|Oslimg Mora (RB)": {
    "overall": 67,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "sport_boys|Luciano Nequecaur (ST)": {
    "overall": 67,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "sport_boys|Renzo Alfani (CB)": {
    "overall": 66,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "sport_boys|Mathías Llontop (LB)": {
    "overall": 66,
    "nationality": "Peru",
    "dorsal": 13,
    "age": 23,
    "fechaNacimiento": "2002-05-22",
    "source": "fc26"
  },
  "utc|Marcos Lliuya (CAM)": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "utc|Ángelo Campos (GK)": {
    "overall": 69,
    "nationality": "Peru",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1993-04-27",
    "source": "fc26"
  },
  "utc|Bruno Duarte (CB)": {
    "overall": 68,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "utc|Luis Garro (RB)": {
    "overall": 67,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "utc|Adolfo Muñoz (LW)": {
    "overall": 67,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "utc|David Camacho (RW)": {
    "overall": 66,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "utc|Marlon de Jesús (ST)": {
    "overall": 66,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "utc|Luis Arce (CDM)": {
    "overall": 66,
    "nationality": "Ecuador",
    "dorsal": 88,
    "age": 31,
    "fechaNacimiento": "1993-12-03",
    "source": "fc26"
  },
  "utc|Arquímedes Figuera (CDM)": {
    "overall": 66,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "utc|Ignacio Barrios (GK)": {
    "overall": 66,
    "nationality": "Uruguay",
    "dorsal": 29,
    "age": 32,
    "fechaNacimiento": "1992-10-26",
    "source": "fc26"
  },
  "utc|David Dioses (CDM)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "atlético_grau|Raúl Ruidíaz (ST)": {
    "overall": 71,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "atlético_grau|Patricio Álvarez (GK)": {
    "overall": 69,
    "nationality": "Peru",
    "dorsal": 1,
    "age": 31,
    "fechaNacimiento": "1994-01-24",
    "source": "fc26"
  },
  "atlético_grau|Rodrigo Tapia (CB)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 27,
    "age": 30,
    "fechaNacimiento": "1994-09-28",
    "source": "fc26"
  },
  "atlético_grau|Freddy Oncoy (CM)": {
    "overall": 67,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "atlético_grau|Rafael Guarderas (CDM)": {
    "overall": 67,
    "nationality": "Peru",
    "dorsal": 5,
    "age": 31,
    "fechaNacimiento": "1993-09-12",
    "source": "fc26"
  },
  "atlético_grau|Elsar Rodas (LB)": {
    "overall": 66,
    "nationality": "Peru",
    "dorsal": 6,
    "age": 31,
    "fechaNacimiento": "1994-02-28",
    "source": "fc26"
  },
  "atlético_grau|Nicolás Delgadillo (LW)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "atlético_grau|Paulo de la Cruz (RW)": {
    "overall": 66,
    "nationality": "Peru",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "1999-10-22",
    "source": "fc26"
  },
  "atlético_grau|Lucas Acevedo (CB)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 3,
    "age": 33,
    "fechaNacimiento": "1991-11-08",
    "source": "fc26"
  },
  "atlético_grau|Diego Barreto (CAM)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "atlético_grau|Cristian Neira (CAM)": {
    "overall": 65,
    "nationality": "Peru",
    "dorsal": 22,
    "age": 24,
    "fechaNacimiento": "2000-11-24",
    "source": "fc26"
  },
  "cusco_fc|Iván Colman (CAM)": {
    "overall": 71,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "cusco_fc|Andy Vidal (GK)": {
    "overall": 70,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "cusco_fc|Lucas Colitto (LW)": {
    "overall": 70,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "cusco_fc|Gabriel Carabajal (CAM)": {
    "overall": 70,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "cusco_fc|Nicolás Silva (RW)": {
    "overall": 69,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "cusco_fc|Facundo Callejo (ST)": {
    "overall": 69,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "cusco_fc|Miguel Aucca (CM)": {
    "overall": 69,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "cusco_fc|Oswaldo Valenzuela (CDM)": {
    "overall": 68,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "cusco_fc|Juan Manuel Tévez (ST)": {
    "overall": 68,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "cusco_fc|Aldair Fuentes (CB)": {
    "overall": 67,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "cusco_fc|José Bolívar (LB)": {
    "overall": 66,
    "nationality": "Peru",
    "dorsal": 14,
    "age": 25,
    "fechaNacimiento": "2000-01-17",
    "source": "fc26"
  },
  "cienciano|Alejandro Hohberg (LW)": {
    "overall": 71,
    "nationality": "Peru",
    "dorsal": 10,
    "age": 33,
    "fechaNacimiento": "1991-08-20",
    "source": "fc26"
  },
  "cienciano|Carlos Garcés (ST)": {
    "overall": 70,
    "nationality": "Ecuador",
    "dorsal": 21,
    "age": 35,
    "fechaNacimiento": "1990-03-01",
    "source": "fc26"
  },
  "cienciano|Claudio Nuñez (CB)": {
    "overall": 69,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "cienciano|Neri Bandiera (ST)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 35,
    "fechaNacimiento": "1989-07-03",
    "source": "fc26"
  },
  "cienciano|Juan Romagnoli (RW)": {
    "overall": 69,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "cienciano|Ray Sandoval (LW)": {
    "overall": 68,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "cienciano|Gonzalo Falcón (GK)": {
    "overall": 68,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "cienciano|Ítalo Espinoza (GK)": {
    "overall": 67,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "cienciano|Kevin Becerra (CB)": {
    "overall": 66,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "cienciano|Ademar Robles (CM)": {
    "overall": 66,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "cienciano|Maximiliano Amondarain (CB)": {
    "overall": 66,
    "nationality": "Uruguay",
    "dorsal": 4,
    "age": 32,
    "fechaNacimiento": "1993-01-22",
    "source": "fc26"
  },
  "los_chankas|Franco Saravia (GK)": {
    "overall": 68,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "los_chankas|Janio Pósito (ST)": {
    "overall": 68,
    "dorsal": 89,
    "source": "latamfc26"
  },
  "los_chankas|Carlos Pimienta (CB)": {
    "overall": 66,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "los_chankas|Jarlín Quintero (ST)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "los_chankas|Kelvin Sánchez (CDM)": {
    "overall": 65,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "los_chankas|Abdiel Ayarza (CM)": {
    "overall": 65,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "los_chankas|Héctor González (CB)": {
    "overall": 65,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "los_chankas|Ayrthon Quintana (LB)": {
    "overall": 64,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "los_chankas|Kenyi Barrios (RW)": {
    "overall": 63,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "los_chankas|Gonzalo Rizzo (CB)": {
    "overall": 63,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "los_chankas|Marlon Junior Torres (RW)": {
    "overall": 63,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Christian Cueva (CAM)": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Cristian García (CDM)": {
    "overall": 68,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Cristhian Tizón (LW)": {
    "overall": 68,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Paolo Fuentes (CB)": {
    "overall": 67,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Martín Alaníz (LW)": {
    "overall": 67,
    "dorsal": 50,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Jack Durán (RW)": {
    "overall": 67,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Erinson Ramírez (CAM)": {
    "overall": 65,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Gustavo Aliaga (CM)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Jorge Toledo (RB)": {
    "overall": 64,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Maximiliano Juambeltz (ST)": {
    "overall": 63,
    "dorsal": 39,
    "source": "latamfc26"
  },
  "juan_pablo_ii|Adán Henricks (ST)": {
    "overall": 63,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "fc_cajamarca|Hernán Barcos (ST)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 41,
    "fechaNacimiento": "1984-04-11",
    "source": "fc26"
  },
  "fc_cajamarca|Pablo Míguez (CB)": {
    "overall": 68,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "fc_cajamarca|Pablo Lavandeira (CAM)": {
    "overall": 68,
    "nationality": "Uruguay",
    "dorsal": 20,
    "age": 35,
    "fechaNacimiento": "1990-05-11",
    "source": "fc26"
  },
  "fc_cajamarca|Brandon Palacios (LW)": {
    "overall": 67,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "fc_cajamarca|Enmanuel Páucar (CDM)": {
    "overall": 67,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "fc_cajamarca|Nilson Loyola (LB)": {
    "overall": 67,
    "dorsal": 45,
    "source": "latamfc26"
  },
  "fc_cajamarca|Jonathan Betancourt (LW)": {
    "overall": 67,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "fc_cajamarca|Ricardo Lagos (LB)": {
    "overall": 66,
    "nationality": "Peru",
    "dorsal": 13,
    "age": 29,
    "fechaNacimiento": "1996-04-20",
    "source": "fc26"
  },
  "fc_cajamarca|Tomás Andrade (CAM)": {
    "overall": 66,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "fc_cajamarca|Matías Almirón (CB)": {
    "overall": 65,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "fc_cajamarca|Jefferson Orejuela (CDM)": {
    "overall": 65,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "moquegua|Juan Diego Lojas (CB)": {
    "overall": 67,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "moquegua|Diego Ramírez (CM)": {
    "overall": 67,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "moquegua|Yorman Zapata (LM)": {
    "overall": 67,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "moquegua|Jefferson Collazos (ST)": {
    "overall": 67,
    "dorsal": 90,
    "source": "latamfc26"
  },
  "moquegua|Carlos Grados (GK)": {
    "overall": 66,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "moquegua|Nicolás Chávez (CAM)": {
    "overall": 66,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "moquegua|Cristian Enciso (CB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "moquegua|Allonso Dávila (LW)": {
    "overall": 64,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "moquegua|Kevin Moreno (CB)": {
    "overall": 64,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "moquegua|Claudio Ramírez (CDM)": {
    "overall": 64,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "moquegua|Bryan Angulo (ST)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "ldu_quito|Gonzalo Valle (GK)": {
    "overall": 70,
    "nationality": "Ecuador",
    "dorsal": 1,
    "age": 29,
    "fechaNacimiento": "1996-02-28",
    "source": "fc26"
  },
  "ldu_quito|Ricardo Adé (CB)": {
    "overall": 72,
    "nationality": "Haiti",
    "dorsal": 4,
    "age": 35,
    "fechaNacimiento": "1990-05-21",
    "source": "fc26"
  },
  "ldu_quito|Deyverson (ST)": {
    "overall": 72,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "ldu_quito|Fernando Cornejo (CM)": {
    "overall": 70,
    "nationality": "Chile",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1995-12-26",
    "source": "fc26"
  },
  "ldu_quito|Leonel Quiñonez (LB)": {
    "overall": 71,
    "nationality": "Ecuador",
    "dorsal": 33,
    "age": 31,
    "fechaNacimiento": "1993-07-03",
    "source": "fc26"
  },
  "ldu_quito|Alexander Domínguez (GK)": {
    "overall": 73,
    "nationality": "Ecuador",
    "dorsal": 22,
    "age": 38,
    "fechaNacimiento": "1987-06-05",
    "source": "fc26"
  },
  "ldu_quito|Jeison Medina (ST)": {
    "overall": 70,
    "nationality": "Colombia",
    "dorsal": 16,
    "age": 30,
    "fechaNacimiento": "1995-02-27",
    "source": "fc26"
  },
  "ldu_quito|Janner Corozo (RW)": {
    "overall": 71,
    "nationality": "Ecuador",
    "dorsal": 13,
    "age": 29,
    "fechaNacimiento": "1995-09-08",
    "source": "fc26"
  },
  "ldu_quito|Luis Segovia (CB)": {
    "overall": 57,
    "nationality": "Argentina",
    "dorsal": 17,
    "age": 18,
    "fechaNacimiento": "2007-03-26",
    "source": "fc26"
  },
  "ldu_quito|Rodney Redes (RW)": {
    "overall": 70,
    "nationality": "Paraguay",
    "dorsal": 11,
    "age": 25,
    "fechaNacimiento": "2000-02-22",
    "source": "fc26"
  },
  "ldu_quito|José Quintero (RB)": {
    "overall": 70,
    "nationality": "Ecuador",
    "dorsal": 14,
    "age": 35,
    "fechaNacimiento": "1990-06-20",
    "source": "fc26"
  },
  "idv_ecu|Kendry Páez": {
    "overall": 73,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "idv_ecu|Junior Sornoza": {
    "overall": 72,
    "nationality": "Ecuador",
    "dorsal": 10,
    "age": 31,
    "fechaNacimiento": "1994-01-28",
    "source": "fc26"
  },
  "idv_ecu|Richard Schunke": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 33,
    "fechaNacimiento": "1991-11-26",
    "source": "fc26"
  },
  "idv_ecu|Renato Ibarra": {
    "overall": 69,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "barcelona_sc|José Contreras (GK)": {
    "overall": 72,
    "nationality": "Venezuela",
    "dorsal": 1,
    "age": 30,
    "fechaNacimiento": "1994-10-20",
    "source": "fc26"
  },
  "barcelona_sc|Javier Báez (CB)": {
    "overall": 72,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "barcelona_sc|Luis Cano (LW)": {
    "overall": 71,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "barcelona_sc|Darío Benedetto (ST)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 35,
    "fechaNacimiento": "1990-05-17",
    "source": "fc26"
  },
  "barcelona_sc|Luca Sosa (CB)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 3,
    "age": 31,
    "fechaNacimiento": "1994-06-11",
    "source": "fc26"
  },
  "barcelona_sc|Tomás Martínez (CAM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1995-03-07",
    "source": "fc26"
  },
  "barcelona_sc|Bryan Carabalí (RB)": {
    "overall": 68,
    "nationality": "Ecuador",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1997-12-18",
    "source": "fc26"
  },
  "barcelona_sc|Gustavo Vallecilla (CB)": {
    "overall": 69,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "barcelona_sc|Jefferson Intriago (CM)": {
    "overall": 69,
    "dorsal": 35,
    "source": "latamfc26"
  },
  "barcelona_sc|Jhonny Quiñónez (CDM)": {
    "overall": 66,
    "nationality": "Ecuador",
    "dorsal": 28,
    "age": 27,
    "fechaNacimiento": "1998-06-11",
    "source": "fc26"
  },
  "barcelona_sc|Byron Castillo (RB)": {
    "overall": 69,
    "nationality": "Ecuador",
    "dorsal": 26,
    "age": 29,
    "fechaNacimiento": "1995-07-25",
    "source": "fc26"
  },
  "emelec|Pedro Ortíz": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 24,
    "age": 24,
    "fechaNacimiento": "2000-08-19",
    "source": "fc26"
  },
  "emelec|Facundo Castelli": {
    "overall": 72,
    "dorsal": 81,
    "source": "latamfc26"
  },
  "deportivo_cuenca|Lucas Mancinelli (RW)": {
    "overall": 71,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "deportivo_cuenca|Carlos Arboleda (LW)": {
    "overall": 68,
    "dorsal": 37,
    "source": "latamfc26"
  },
  "deportivo_cuenca|Edison Vega (CDM)": {
    "overall": 67,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "deportivo_cuenca|Mateo Maccari (CDM)": {
    "overall": 67,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "deportivo_cuenca|Nicolás Leguizamón (ST)": {
    "overall": 67,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "deportivo_cuenca|Romario Ibarra (LW)": {
    "overall": 67,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "deportivo_cuenca|Facundo Ferrero (GK)": {
    "overall": 66,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "deportivo_cuenca|Jorge Ordóñez (RW)": {
    "overall": 66,
    "dorsal": 43,
    "source": "latamfc26"
  },
  "deportivo_cuenca|David González (CAM)": {
    "overall": 65,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 23,
    "fechaNacimiento": "2002-06-22",
    "source": "fc26"
  },
  "deportivo_cuenca|Patricio Boolsen (CB)": {
    "overall": 65,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "deportivo_cuenca|David Noboa (CDM)": {
    "overall": 65,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "mushuc_runa|Facundo Castelli (ST)": {
    "overall": 72,
    "dorsal": 81,
    "source": "latamfc26"
  },
  "mushuc_runa|Renato Ibarra (RW)": {
    "overall": 69,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "mushuc_runa|Ronie Carrillo (ST)": {
    "overall": 69,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "mushuc_runa|Rodrigo Formento (GK)": {
    "overall": 67,
    "nationality": "Uruguay",
    "dorsal": 25,
    "age": 25,
    "fechaNacimiento": "1999-09-25",
    "source": "fc26"
  },
  "mushuc_runa|Lucas Lemos (CDM)": {
    "overall": 66,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "mushuc_runa|Kevin Velasco (LW)": {
    "overall": 66,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "mushuc_runa|José Hernández (LB)": {
    "overall": 65,
    "nationality": "Venezuela",
    "dorsal": 31,
    "age": 28,
    "fechaNacimiento": "1996-08-02",
    "source": "fc26"
  },
  "mushuc_runa|Tomson Minda (RW)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "mushuc_runa|Manuel Gamboa (CB)": {
    "overall": 65,
    "dorsal": 44,
    "source": "latamfc26"
  },
  "mushuc_runa|Nicolás Dibble (ST)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "mushuc_runa|Adonnis Pabón (GK)": {
    "overall": 64,
    "dorsal": 42,
    "source": "latamfc26"
  },
  "macará|José Luis Marrufo (CB)": {
    "overall": 68,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "macará|Federico Paz (ST)": {
    "overall": 68,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "macará|José Luis Cazares (CDM)": {
    "overall": 67,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "macará|Rodrigo Rodríguez (GK)": {
    "overall": 66,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "macará|Gastón Blanc (CM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "macará|Jean Carlos Estacio (CDM)": {
    "overall": 66,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "macará|Denilson Bolaños (RB)": {
    "overall": 65,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "macará|Santiago Etchebarne (CB)": {
    "overall": 65,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "macará|Luis Ayala (LB)": {
    "overall": 65,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "macará|Franco Posse (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "macará|Marlon Medranda (LB)": {
    "overall": 65,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "aucas|Hamilton Piedra (GK)": {
    "overall": 72,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "aucas|Ayrton Preciado (LW)": {
    "overall": 69,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "aucas|Bruno Miranda (ST)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "aucas|Stiven Tapiero (CDM)": {
    "overall": 67,
    "nationality": "Colombia",
    "dorsal": 14,
    "age": 33,
    "fechaNacimiento": "1991-07-28",
    "source": "fc26"
  },
  "aucas|John Ontaneda (CB)": {
    "overall": 66,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "aucas|Romario Bolaños (LM)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "aucas|Luis Arroyo (CAM)": {
    "overall": 66,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "aucas|Carlos Cuero (LB)": {
    "overall": 66,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "aucas|Danny Luna (LW)": {
    "overall": 66,
    "dorsal": 91,
    "source": "latamfc26"
  },
  "aucas|Luis Gustavino (CB)": {
    "overall": 65,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "aucas|Agostino Spina (CDM)": {
    "overall": 65,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "orense|Ángel Mena (RW)": {
    "overall": 69,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "orense|Valentín Burgoa (CAM)": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "orense|Erick Plúas (CDM)": {
    "overall": 68,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "orense|Gonzalo Rostagno (CM)": {
    "overall": 68,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "orense|Stefano Callegari (CB)": {
    "overall": 67,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "orense|Diego Armas (CAM)": {
    "overall": 67,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "orense|Nixon Molina (CDM)": {
    "overall": 67,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "orense|Rolando Silva (GK)": {
    "overall": 66,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "orense|Renny Jaramillo (CDM)": {
    "overall": 66,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "orense|Alan Lorenzo (CB)": {
    "overall": 66,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "orense|Óscar Quiñónez (CB)": {
    "overall": 66,
    "nationality": "Ecuador",
    "dorsal": 4,
    "age": 24,
    "fechaNacimiento": "2001-02-19",
    "source": "fc26"
  },
  "leones_fc_ecu|Juan Luis Anangonó (ST)": {
    "overall": 68,
    "dorsal": 40,
    "source": "latamfc26"
  },
  "leones_fc_ecu|Segundo Portocarrero (LM)": {
    "overall": 67,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "leones_fc_ecu|Charles Vélez (CDM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "leones_fc_ecu|Kevin Mina (ST)": {
    "overall": 66,
    "dorsal": 44,
    "source": "latamfc26"
  },
  "leones_fc_ecu|José Angulo (GK)": {
    "overall": 65,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "leones_fc_ecu|Cristhian Solano (LW)": {
    "overall": 66,
    "nationality": "Ecuador",
    "dorsal": 25,
    "age": 26,
    "fechaNacimiento": "1999-02-08",
    "source": "fc26"
  },
  "leones_fc_ecu|Herlin Lino (ST)": {
    "overall": 65,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "leones_fc_ecu|Leonel Nazareno (GK)": {
    "overall": 65,
    "dorsal": 45,
    "source": "latamfc26"
  },
  "leones_fc_ecu|Elian Pepinos (CM)": {
    "overall": 64,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "leones_fc_ecu|Mauro Luque (RB)": {
    "overall": 64,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "leones_fc_ecu|Darío Pazmiño (CAM)": {
    "overall": 64,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "guayaquil_city|Damián Díaz (CAM)": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "guayaquil_city|Esnáider Cabezas (CB)": {
    "overall": 67,
    "dorsal": 51,
    "source": "latamfc26"
  },
  "guayaquil_city|Dixon Arroyo (CDM)": {
    "overall": 67,
    "nationality": "Ecuador",
    "dorsal": 23,
    "age": 33,
    "fechaNacimiento": "1992-06-01",
    "source": "fc26"
  },
  "guayaquil_city|Pablo González (CAM)": {
    "overall": 66,
    "dorsal": 80,
    "source": "latamfc26"
  },
  "guayaquil_city|Madison Julio (CDM)": {
    "overall": 66,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "guayaquil_city|Junior Ayoví (RB)": {
    "overall": 65,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "guayaquil_city|Edinson Mero (RW)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "guayaquil_city|Stalin Caicedo (LW)": {
    "overall": 64,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "guayaquil_city|Anderson Naula (ST)": {
    "overall": 64,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "guayaquil_city|Rodrigo Perea (GK)": {
    "overall": 64,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "guayaquil_city|José Miguel Andrade (ST)": {
    "overall": 64,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "el_nacional|Jonathan Borja (CAM)": {
    "overall": 72,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "el_nacional|Roberto Garcés (CDM)": {
    "overall": 65,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "el_nacional|Fernando Mora (LB)": {
    "overall": 64,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "el_nacional|Rommel Cabezas (CB)": {
    "overall": 62,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "el_nacional|Jordán Congo (GK)": {
    "overall": 62,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "el_nacional|Reixon Saya (RW)": {
    "overall": 60,
    "dorsal": 59,
    "source": "latamfc26"
  },
  "el_nacional|Fricson Borja (ST)": {
    "overall": 60,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "el_nacional|Wilder Estupiñán (CB)": {
    "overall": 59,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "el_nacional|Teddye Lara (RM)": {
    "overall": 59,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "el_nacional|Mauro Mariño (CAM)": {
    "overall": 59,
    "dorsal": 38,
    "source": "latamfc26"
  },
  "el_nacional|Alan Valencia (CM)": {
    "overall": 58,
    "dorsal": 56,
    "source": "latamfc26"
  },
  "san_antonio|Ramiro Ballivián (RB)": {
    "overall": 67,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "san_antonio|Yonathan Cabral (CB)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 20,
    "age": 33,
    "fechaNacimiento": "1992-05-10",
    "source": "fc26"
  },
  "san_antonio|Adalid Terrazas (CAM)": {
    "overall": 67,
    "nationality": "Bolivia",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2000-08-25",
    "source": "fc26"
  },
  "san_antonio|Luca Giossa (GK)": {
    "overall": 65,
    "nationality": "Uruguay",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-05-24",
    "source": "fc26"
  },
  "san_antonio|Julio Herrera (CM)": {
    "overall": 65,
    "nationality": "Bolivia",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1999-02-11",
    "source": "fc26"
  },
  "san_antonio|Pablo Vaca (CB)": {
    "overall": 65,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "san_antonio|Cristhian Machado (CDM)": {
    "overall": 64,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "san_antonio|Andrés Córdoba (LW)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "san_antonio|Huberth Sánchez (CB)": {
    "overall": 64,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "san_antonio|Saulo Guerra (RM)": {
    "overall": 64,
    "nationality": "Bolivia",
    "dorsal": 17,
    "age": 32,
    "fechaNacimiento": "1992-09-14",
    "source": "fc26"
  },
  "san_antonio|Ronald Bustos (RB)": {
    "overall": 64,
    "nationality": "Bolivia",
    "dorsal": 31,
    "age": 21,
    "fechaNacimiento": "2004-03-17",
    "source": "fc26"
  },
  "atlético_fc|Fidel Martínez (RM)": {
    "overall": 69,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "atlético_fc|Fabián Villa (CB)": {
    "overall": 65,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "atlético_fc|Jhonier Alomía (CB)": {
    "overall": 65,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "atlético_fc|Danny Reales (CB)": {
    "overall": 64,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "atlético_fc|Wílmer Godoy (CM)": {
    "overall": 64,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "atlético_fc|Joseph Espinoza (CM)": {
    "overall": 64,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "atlético_fc|David Agudelo (GK)": {
    "overall": 63,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "atlético_fc|José Palacios (CB)": {
    "overall": 63,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "atlético_fc|Gabriel Erazo (ST)": {
    "overall": 63,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "atlético_fc|Miguel Suárez (GK)": {
    "overall": 63,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "atlético_fc|Juan Jaramillo (GK)": {
    "overall": 63,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "ldup|Ángel Gracia (LB)": {
    "overall": 67,
    "nationality": "Ecuador",
    "dorsal": 19,
    "age": 36,
    "fechaNacimiento": "1989-05-30",
    "source": "fc26"
  },
  "ldup|Jefferson Caicedo (LW)": {
    "overall": 65,
    "dorsal": 61,
    "source": "latamfc26"
  },
  "ldup|Manuel Mendoza (GK)": {
    "overall": 63,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "ldup|Jordan Ponguillo (CB)": {
    "overall": 63,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "ldup|Pablo Cifuentes (CB)": {
    "overall": 63,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "ldup|Edison Caicedo (CDM)": {
    "overall": 63,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "ldup|Richard Sánchez (CAM)": {
    "overall": 75,
    "nationality": "Paraguay",
    "dorsal": 26,
    "age": 29,
    "fechaNacimiento": "1996-03-29",
    "source": "fc26"
  },
  "ldup|Jeison Mina (CB)": {
    "overall": 62,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "ldup|Efrén Proaño (CB)": {
    "overall": 60,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "ldup|Jairon Bonett (RM)": {
    "overall": 60,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "ldup|César Espínola (ST)": {
    "overall": 60,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "real_tomayapo|Marvin Bejarano (LB)": {
    "overall": 66,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "real_tomayapo|Robson (CB)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "real_tomayapo|Rolando Blackburn (ST)": {
    "overall": 65,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "real_tomayapo|Gonzalo Rehak (GK)": {
    "overall": 64,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "real_tomayapo|Jorge Scolari (CB)": {
    "overall": 64,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "real_tomayapo|Leandro Corulo (CB)": {
    "overall": 64,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "real_tomayapo|Limberg Gutiérrez (CAM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "real_tomayapo|Santiago Cuiza (CDM)": {
    "overall": 64,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "real_tomayapo|Diego Wayar (CDM)": {
    "overall": 63,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "real_tomayapo|Alexis Ribera (RM)": {
    "overall": 63,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "real_tomayapo|Cristhian Árabe (CM)": {
    "overall": 63,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "bolívar|Martín Cauteruccio (ST)": {
    "overall": 75,
    "nationality": "Uruguay",
    "dorsal": 9,
    "age": 38,
    "fechaNacimiento": "1987-04-14",
    "source": "fc26"
  },
  "bolívar|Carlos Lampe (GK)": {
    "overall": 72,
    "nationality": "Bolivia",
    "dorsal": 1,
    "age": 38,
    "fechaNacimiento": "1987-03-17",
    "source": "fc26"
  },
  "bolívar|Damian Batallini (RW)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 99,
    "age": 29,
    "fechaNacimiento": "1996-06-24",
    "source": "fc26"
  },
  "bolívar|Patricio Rodríguez (LW)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 17,
    "age": 35,
    "fechaNacimiento": "1990-05-04",
    "source": "fc26"
  },
  "bolívar|Braian Oyola (LM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 30,
    "age": 29,
    "fechaNacimiento": "1996-06-15",
    "source": "fc26"
  },
  "bolívar|Carlos Melgar (CAM)": {
    "overall": 69,
    "nationality": "Bolivia",
    "dorsal": 80,
    "age": 30,
    "fechaNacimiento": "1994-11-04",
    "source": "fc26"
  },
  "bolívar|José Sagredo (CB)": {
    "overall": 68,
    "nationality": "Bolivia",
    "dorsal": 4,
    "age": 31,
    "fechaNacimiento": "1994-03-10",
    "source": "fc26"
  },
  "bolívar|Xavier Arreaga (CB)": {
    "overall": 69,
    "nationality": "Ecuador",
    "dorsal": 3,
    "age": 30,
    "fechaNacimiento": "1994-09-28",
    "source": "fc26"
  },
  "bolívar|Santiago Echeverría (CB)": {
    "overall": 67,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 35,
    "fechaNacimiento": "1990-03-28",
    "source": "fc26"
  },
  "bolívar|Leonel Justiniano (CM)": {
    "overall": 67,
    "nationality": "Bolivia",
    "dorsal": 23,
    "age": 32,
    "fechaNacimiento": "1992-07-02",
    "source": "fc26"
  },
  "bolívar|Erwin Saavedra (RM)": {
    "overall": 67,
    "nationality": "Bolivia",
    "dorsal": 26,
    "age": 29,
    "fechaNacimiento": "1996-02-22",
    "source": "fc26"
  },
  "the_strongest|José Moya (CB)": {
    "overall": 68,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "the_strongest|Jovani Welch (CDM)": {
    "overall": 66,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "the_strongest|Jaime Arrascaita (LM)": {
    "overall": 66,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "the_strongest|Carmelo Algarañaz (ST)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "the_strongest|Adrián Jusino (CB)": {
    "overall": 66,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "the_strongest|Widen Saucedo (RB)": {
    "overall": 65,
    "nationality": "Bolivia",
    "dorsal": 22,
    "age": 28,
    "fechaNacimiento": "1997-03-01",
    "source": "fc26"
  },
  "the_strongest|Martín Chiatti (CB)": {
    "overall": 65,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "the_strongest|Raúl Castro (CM)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "the_strongest|Pablo Pedraza (CB)": {
    "overall": 65,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "the_strongest|Kevin Romay (LB)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "the_strongest|Adrián Estacio (RW)": {
    "overall": 65,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "real_potosí|John Méndez (LW)": {
    "overall": 67,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "real_potosí|Luis Alí (RW)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "real_potosí|Fran Supayabe (RB)": {
    "overall": 66,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "real_potosí|Vladimir Castellón (ST)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "real_potosí|Bleiner Agrón (CB)": {
    "overall": 64,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "real_potosí|Gonzalo Añasgo (LB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "real_potosí|Carlos Chore (CB)": {
    "overall": 64,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "real_potosí|Emerson Velasquez (CB)": {
    "overall": 64,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "real_potosí|Luis Vargas (CM)": {
    "overall": 64,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "real_potosí|Maximiliano Gómez (RW)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "real_potosí|Juan Pablo Rioja (CB)": {
    "overall": 63,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "nacional_potosí|Maicon Solís (RW)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "nacional_potosí|Edisson Restrepo (CB)": {
    "overall": 66,
    "nationality": "Colombia",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1996-12-19",
    "source": "fc26"
  },
  "nacional_potosí|Diego Hoyos (CM)": {
    "overall": 66,
    "nationality": "Bolivia",
    "dorsal": 22,
    "age": 32,
    "fechaNacimiento": "1992-09-29",
    "source": "fc26"
  },
  "nacional_potosí|Andrés Torrico (RW)": {
    "overall": 66,
    "nationality": "Bolivia",
    "dorsal": 16,
    "age": 20,
    "fechaNacimiento": "2004-08-10",
    "source": "fc26"
  },
  "nacional_potosí|Leandro Otormín (CAM)": {
    "overall": 66,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "nacional_potosí|Luis Pavia (RM)": {
    "overall": 66,
    "nationality": "Bolivia",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1999-06-13",
    "source": "fc26"
  },
  "nacional_potosí|Pedro Azogue (CDM)": {
    "overall": 65,
    "nationality": "Bolivia",
    "dorsal": 18,
    "age": 31,
    "fechaNacimiento": "1993-12-06",
    "source": "fc26"
  },
  "nacional_potosí|Damián Villalba (ST)": {
    "overall": 65,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "nacional_potosí|Tommy Tobar (ST)": {
    "overall": 65,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "nacional_potosí|Juan José Orellana (LB)": {
    "overall": 65,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "nacional_potosí|Pedro Galindo (GK)": {
    "overall": 64,
    "nationality": "Bolivia",
    "dorsal": 23,
    "age": 30,
    "fechaNacimiento": "1995-04-13",
    "source": "fc26"
  },
  "always_ready|Alain Baroja (GK)": {
    "overall": 72,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "always_ready|Yhormar Hurtado (RB)": {
    "overall": 70,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "always_ready|Enrique Triverio (ST)": {
    "overall": 68,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "always_ready|Fernando Saucedo (CM)": {
    "overall": 68,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "always_ready|Luis Caicedo (CB)": {
    "overall": 67,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "always_ready|Alex Rambal (CB)": {
    "overall": 67,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "always_ready|Héctor Cuellar (CDM)": {
    "overall": 67,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "always_ready|Joel Amoroso (CAM)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "always_ready|Juan Godoy (ST)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "always_ready|Marcelo Suárez (CB)": {
    "overall": 65,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "always_ready|Richet Gómez (CB)": {
    "overall": 65,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "blooming|Bayron Garcés (ST)": {
    "overall": 68,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "blooming|Moisés Villarroel (CM)": {
    "overall": 67,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "blooming|Jeyson Chura (RM)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "blooming|Roberto Hinojoza (CAM)": {
    "overall": 66,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "blooming|Marc Enoumba (CB)": {
    "overall": 66,
    "dorsal": 44,
    "source": "latamfc26"
  },
  "blooming|Braulio Uraezaña (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "blooming|José María Carrasco (CB)": {
    "overall": 65,
    "dorsal": 55,
    "source": "latamfc26"
  },
  "blooming|Gabriel Valverde (CB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "blooming|Matías Abisab (CAM)": {
    "overall": 64,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "blooming|César Menacho (RW)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "blooming|Auli Oliveros (CAM)": {
    "overall": 64,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "aurora|Alan Terrazas (CAM)": {
    "overall": 67,
    "dorsal": 69,
    "source": "latamfc26"
  },
  "aurora|Michael Rangel (ST)": {
    "overall": 67,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "aurora|José Verdún (ST)": {
    "overall": 67,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "aurora|Rubén Cordano (GK)": {
    "overall": 66,
    "nationality": "Bolivia",
    "dorsal": 12,
    "age": 26,
    "fechaNacimiento": "1998-10-16",
    "source": "fc26"
  },
  "aurora|Erwin Junior Sánchez (CM)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "aurora|Rodrigo Ramallo (LW)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "aurora|Luis Barbosa (CB)": {
    "overall": 64,
    "nationality": "Bolivia",
    "dorsal": 3,
    "age": 32,
    "fechaNacimiento": "1993-04-02",
    "source": "fc26"
  },
  "aurora|John Deiby Araujo (RW)": {
    "overall": 64,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "aurora|Oscar Vaca (LB)": {
    "overall": 64,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "aurora|Jefferson Ramos (ST)": {
    "overall": 63,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "aurora|Jaime Cornejo (RM)": {
    "overall": 63,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "guabirá|Gustavo Peredo (RW)": {
    "overall": 68,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "guabirá|Ronaldo Sánchez (LM)": {
    "overall": 68,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "guabirá|Rafinha (CAM)": {
    "overall": 63,
    "nationality": "Spain",
    "dorsal": 28,
    "age": 27,
    "fechaNacimiento": "1997-12-29",
    "source": "fc26"
  },
  "guabirá|Gastón Gómez (GK)": {
    "overall": 67,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "guabirá|David Robles (CB)": {
    "overall": 67,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "guabirá|Milton Maciel (RM)": {
    "overall": 66,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "guabirá|Jorge Enrique Flores (LB)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "guabirá|Ramiro Cristóbal (CDM)": {
    "overall": 65,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "guabirá|Carlos Añez (RW)": {
    "overall": 65,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "guabirá|Jorge Araúz (GK)": {
    "overall": 65,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "guabirá|Denilso Fernandez (RW)": {
    "overall": 64,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "real_oruro|Wilfredo Soleto (CB)": {
    "overall": 66,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "real_oruro|Adriel Fernández (LW)": {
    "overall": 65,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "real_oruro|Juan Montenegro (LW)": {
    "overall": 65,
    "nationality": "Bolivia",
    "dorsal": 30,
    "age": 28,
    "fechaNacimiento": "1997-02-04",
    "source": "fc26"
  },
  "real_oruro|Iván Huayhuata (CDM)": {
    "overall": 64,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "real_oruro|Alexis Bravo (CAM)": {
    "overall": 64,
    "dorsal": 65,
    "source": "latamfc26"
  },
  "real_oruro|Daniel Castellón (RB)": {
    "overall": 63,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "real_oruro|Joao Quiñónez (CB)": {
    "overall": 63,
    "dorsal": 88,
    "source": "latamfc26"
  },
  "real_oruro|Daniel Porozo (RW)": {
    "overall": 63,
    "dorsal": 97,
    "source": "latamfc26"
  },
  "real_oruro|Ángel Quiñónez (RW)": {
    "overall": 63,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "real_oruro|Alex Arancibia (GK)": {
    "overall": 62,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "real_oruro|Yhon Jairo Villegas (CB)": {
    "overall": 62,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "sportivo_luqueño|Sergio Díaz (CAM)": {
    "overall": 69,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "sportivo_luqueño|Walter González (ST)": {
    "overall": 68,
    "nationality": "Paraguay",
    "dorsal": 9,
    "age": 30,
    "fechaNacimiento": "1995-06-21",
    "source": "fc26"
  },
  "sportivo_luqueño|Óscar Ruiz (LW)": {
    "overall": 68,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "sportivo_luqueño|Alfredo Aguilar (GK)": {
    "overall": 67,
    "nationality": "Paraguay",
    "dorsal": 12,
    "age": 36,
    "fechaNacimiento": "1988-07-18",
    "source": "fc26"
  },
  "sportivo_luqueño|Lautaro Comas (RW)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 37,
    "age": 30,
    "fechaNacimiento": "1995-01-14",
    "source": "fc26"
  },
  "sportivo_luqueño|Paul Riveros (CB)": {
    "overall": 66,
    "nationality": "Paraguay",
    "dorsal": 14,
    "age": 27,
    "fechaNacimiento": "1997-07-08",
    "source": "fc26"
  },
  "sportivo_luqueño|Alexis Villalba (CB)": {
    "overall": 65,
    "nationality": "Paraguay",
    "dorsal": 5,
    "age": 26,
    "fechaNacimiento": "1998-08-28",
    "source": "fc26"
  },
  "sportivo_luqueño|Ángel Benítez (CDM)": {
    "overall": 65,
    "nationality": "Paraguay",
    "dorsal": 16,
    "age": 29,
    "fechaNacimiento": "1996-01-27",
    "source": "fc26"
  },
  "sportivo_luqueño|Kevin Pereira (RW)": {
    "overall": 65,
    "nationality": "Paraguay",
    "dorsal": 7,
    "age": 21,
    "fechaNacimiento": "2004-01-15",
    "source": "fc26"
  },
  "sportivo_luqueño|Fernando Benítez (CDM)": {
    "overall": 64,
    "nationality": "Paraguay",
    "dorsal": 14,
    "age": 26,
    "fechaNacimiento": "1999-06-04",
    "source": "fc26"
  },
  "sportivo_luqueño|Sebastián Quintana (CM)": {
    "overall": 64,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "libertad|Diego Viera (CB)": {
    "overall": 76,
    "nationality": "Paraguay",
    "dorsal": 5,
    "age": 34,
    "fechaNacimiento": "1991-04-30",
    "source": "fc26"
  },
  "libertad|Lorenzo Melgarejo (ST)": {
    "overall": 74,
    "nationality": "Paraguay",
    "dorsal": 10,
    "age": 34,
    "fechaNacimiento": "1990-08-10",
    "source": "fc26"
  },
  "libertad|Matías Rojas (RW)": {
    "overall": 74,
    "nationality": "Paraguay",
    "dorsal": 35,
    "age": 29,
    "fechaNacimiento": "1995-11-03",
    "source": "fc26"
  },
  "libertad|Matías Espinoza (LB)": {
    "overall": 72,
    "nationality": "Paraguay",
    "dorsal": 17,
    "age": 27,
    "fechaNacimiento": "1997-08-19",
    "source": "fc26"
  },
  "libertad|Federico Carrizo (LW)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 8,
    "age": 34,
    "fechaNacimiento": "1991-05-17",
    "source": "fc26"
  },
  "libertad|Alexis Duarte (CB)": {
    "overall": 72,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "libertad|Rodrigo Morínigo (GK)": {
    "overall": 71,
    "nationality": "Paraguay",
    "dorsal": 12,
    "age": 26,
    "fechaNacimiento": "1998-10-07",
    "source": "fc26"
  },
  "libertad|Iván Ramírez (RB)": {
    "overall": 71,
    "nationality": "Paraguay",
    "dorsal": 2,
    "age": 30,
    "fechaNacimiento": "1994-12-08",
    "source": "fc26"
  },
  "libertad|Álvaro Campuzano (CDM)": {
    "overall": 71,
    "nationality": "Paraguay",
    "dorsal": 6,
    "age": 30,
    "fechaNacimiento": "1995-06-12",
    "source": "fc26"
  },
  "libertad|Iván Franco (CAM)": {
    "overall": 71,
    "nationality": "Paraguay",
    "dorsal": 18,
    "age": 25,
    "fechaNacimiento": "2000-04-16",
    "source": "fc26"
  },
  "libertad|Robert Rojas (CB)": {
    "overall": 71,
    "nationality": "Paraguay",
    "dorsal": 3,
    "age": 29,
    "fechaNacimiento": "1996-04-30",
    "source": "fc26"
  },
  "olimpia|Gastón Olveira (GK)": {
    "overall": 74,
    "nationality": "Uruguay",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1993-04-21",
    "source": "fc26"
  },
  "olimpia|Richard Sánchez (CM)": {
    "overall": 75,
    "nationality": "Paraguay",
    "dorsal": 26,
    "age": 29,
    "fechaNacimiento": "1996-03-29",
    "source": "fc26"
  },
  "olimpia|Derlis González (CAM)": {
    "overall": 73,
    "nationality": "Paraguay",
    "dorsal": 10,
    "age": 31,
    "fechaNacimiento": "1994-03-20",
    "source": "fc26"
  },
  "olimpia|Mateo Gamarra (CB)": {
    "overall": 72,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "olimpia|Iván Leguizamón (LW)": {
    "overall": 72,
    "nationality": "Paraguay",
    "dorsal": 29,
    "age": 22,
    "fechaNacimiento": "2002-07-03",
    "source": "fc26"
  },
  "olimpia|Alejandro Silva (CM)": {
    "overall": 71,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "olimpia|Bryan Bentaberry (CB)": {
    "overall": 66,
    "nationality": "Uruguay",
    "dorsal": 2,
    "age": 28,
    "fechaNacimiento": "1997-01-21",
    "source": "fc26"
  },
  "olimpia|Juan Fernando Alfaro (CM)": {
    "overall": 70,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "olimpia|Richard Ortiz (CDM)": {
    "overall": 70,
    "nationality": "Paraguay",
    "dorsal": 6,
    "age": 35,
    "fechaNacimiento": "1990-05-22",
    "source": "fc26"
  },
  "olimpia|Alan Rodríguez (LB)": {
    "overall": 70,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "olimpia|Sebastián Ferreira (ST)": {
    "overall": 69,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "cerro_porteño|Cecilio Domínguez (RW)": {
    "overall": 73,
    "nationality": "Paraguay",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1994-08-11",
    "source": "fc26"
  },
  "cerro_porteño|Pablo Vegetti (ST)": {
    "overall": 73,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "cerro_porteño|Gustavo Velázquez (CB)": {
    "overall": 73,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "cerro_porteño|Ignacio Aliseda (LW)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 31,
    "age": 25,
    "fechaNacimiento": "2000-03-14",
    "source": "fc26"
  },
  "cerro_porteño|Jonatan Torres (ST)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 27,
    "age": 28,
    "fechaNacimiento": "1996-12-29",
    "source": "fc26"
  },
  "cerro_porteño|Mateo Klimowicz (CAM)": {
    "overall": 72,
    "dorsal": 40,
    "source": "latamfc26"
  },
  "cerro_porteño|Alexis Martín Arias (GK)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1992-07-04",
    "source": "fc26"
  },
  "cerro_porteño|Juan Iturbe (CAM)": {
    "overall": 71,
    "nationality": "Paraguay",
    "dorsal": 11,
    "age": 32,
    "fechaNacimiento": "1993-06-04",
    "source": "fc26"
  },
  "cerro_porteño|Santiago Mosquera (LW)": {
    "overall": 71,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "cerro_porteño|Gastón Giménez (CDM)": {
    "overall": 70,
    "nationality": "Paraguay",
    "dorsal": 30,
    "age": 33,
    "fechaNacimiento": "1991-07-27",
    "source": "fc26"
  },
  "cerro_porteño|Roberto Fernández (GK)": {
    "overall": 70,
    "nationality": "Paraguay",
    "dorsal": 25,
    "age": 37,
    "fechaNacimiento": "1988-03-29",
    "source": "fc26"
  },
  "guaraní|Gaspar Servio (GK)": {
    "overall": 73,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "guaraní|Fernando Fernández (ST)": {
    "overall": 70,
    "nationality": "Paraguay",
    "dorsal": 40,
    "age": 33,
    "fechaNacimiento": "1992-01-08",
    "source": "fc26"
  },
  "guaraní|Diego Fernández (LM)": {
    "overall": 69,
    "nationality": "Paraguay",
    "dorsal": 26,
    "age": 22,
    "fechaNacimiento": "2002-09-02",
    "source": "fc26"
  },
  "guaraní|Juan Daniel Pérez (RB)": {
    "overall": 68,
    "dorsal": 37,
    "source": "latamfc26"
  },
  "guaraní|Agustín Manzur (CM)": {
    "overall": 68,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "guaraní|Patricio Tanda (CDM)": {
    "overall": 67,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "guaraní|Marcos Gómez (CM)": {
    "overall": 63,
    "nationality": "Uruguay",
    "dorsal": 4,
    "age": 20,
    "fechaNacimiento": "2004-11-23",
    "source": "fc26"
  },
  "guaraní|Imanol Segovia (CB)": {
    "overall": 66,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "guaraní|Derlis Rodríguez (RM)": {
    "overall": 66,
    "nationality": "Paraguay",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1997-09-18",
    "source": "fc26"
  },
  "guaraní|Jhon Sánchez (RM)": {
    "overall": 66,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "guaraní|Richard Torales (ST)": {
    "overall": 65,
    "nationality": "Paraguay",
    "dorsal": 17,
    "age": 24,
    "fechaNacimiento": "2001-02-26",
    "source": "fc26"
  },
  "2_de_mayo|Alberto Espínola (RB)": {
    "overall": 71,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "2_de_mayo|Elías Alfonso (RW)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "2_de_mayo|Pedro Delvalle (LW)": {
    "overall": 67,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "2_de_mayo|Carlos Servín (GK)": {
    "overall": 67,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "2_de_mayo|Camilo Saiz (CB)": {
    "overall": 66,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "2_de_mayo|Rodrigo Ruiz Díaz (ST)": {
    "overall": 66,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "2_de_mayo|Fernando Cáceres (ST)": {
    "overall": 65,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "2_de_mayo|Brahian Ayala (LW)": {
    "overall": 65,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "2_de_mayo|Wilson Ibarrola (LB)": {
    "overall": 65,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "2_de_mayo|Óscar Romero (CM)": {
    "overall": 64,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "2_de_mayo|René Rodríguez (RB)": {
    "overall": 64,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "rubio_ñu|Brian Blasi (RB)": {
    "overall": 70,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "rubio_ñu|Rodrigo Rojas (CM)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "rubio_ñu|Ángel Cardozo Lucena (CM)": {
    "overall": 68,
    "nationality": "Paraguay",
    "dorsal": 15,
    "age": 30,
    "fechaNacimiento": "1994-10-19",
    "source": "fc26"
  },
  "rubio_ñu|Rodi Ferreira (RB)": {
    "overall": 67,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "rubio_ñu|William Mendieta (CAM)": {
    "overall": 67,
    "nationality": "Paraguay",
    "dorsal": 10,
    "age": 36,
    "fechaNacimiento": "1989-01-09",
    "source": "fc26"
  },
  "rubio_ñu|Elías Sarquis (LM)": {
    "overall": 67,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "rubio_ñu|Fernando Martínez (CDM)": {
    "overall": 62,
    "nationality": "Argentina",
    "dorsal": 20,
    "age": 24,
    "fechaNacimiento": "2000-07-27",
    "source": "fc26"
  },
  "rubio_ñu|Gustavo Manzur (CDM)": {
    "overall": 65,
    "dorsal": 38,
    "source": "latamfc26"
  },
  "rubio_ñu|Javier Vallejos (CB)": {
    "overall": 59,
    "nationality": "Argentina",
    "dorsal": 40,
    "age": 22,
    "fechaNacimiento": "2003-01-03",
    "source": "fc26"
  },
  "rubio_ñu|Mauricio Roldán (ST)": {
    "overall": 64,
    "dorsal": 37,
    "source": "latamfc26"
  },
  "rubio_ñu|Pedro Báez (ST)": {
    "overall": 64,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Bruno Piñatares (CDM)": {
    "overall": 68,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Mario López Quintana (CB)": {
    "overall": 67,
    "nationality": "Paraguay",
    "dorsal": 5,
    "age": 29,
    "fechaNacimiento": "1995-07-06",
    "source": "fc26"
  },
  "sportivo_san_lorenzo|Iván Torres (LB)": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Matías Alfonso (CM)": {
    "overall": 67,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Cristian Colmán (ST)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Alexis Doldán (CB)": {
    "overall": 67,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Aldo Quiñónez (CM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Wilson Quiñónez (GK)": {
    "overall": 66,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Alex Álvarez (ST)": {
    "overall": 66,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Elías Alderete (ST)": {
    "overall": 65,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "sportivo_san_lorenzo|Mathias Martínez (RM)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "carabobo_fc|Alexander González (RB)": {
    "overall": 64,
    "nationality": "Uruguay",
    "dorsal": 28,
    "age": 22,
    "fechaNacimiento": "2002-08-08",
    "source": "fc26"
  },
  "carabobo_fc|Lucas Bruera (GK)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 27,
    "fechaNacimiento": "1997-10-19",
    "source": "fc26"
  },
  "carabobo_fc|Jean Franco Fuentes (CB)": {
    "overall": 69,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "carabobo_fc|Maurice Cova (CM)": {
    "overall": 69,
    "nationality": "Venezuela",
    "dorsal": 15,
    "age": 32,
    "fechaNacimiento": "1992-08-11",
    "source": "fc26"
  },
  "carabobo_fc|Jonathan Bilbao (CB)": {
    "overall": 68,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "carabobo_fc|Edson Tortolero (CAM)": {
    "overall": 68,
    "nationality": "Venezuela",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1998-02-05",
    "source": "fc26"
  },
  "carabobo_fc|Leonardo Aponte (CB)": {
    "overall": 68,
    "nationality": "Venezuela",
    "dorsal": 4,
    "age": 31,
    "fechaNacimiento": "1994-04-30",
    "source": "fc26"
  },
  "carabobo_fc|Ezequiel Neira (CB)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 32,
    "age": 24,
    "fechaNacimiento": "2001-02-03",
    "source": "fc26"
  },
  "carabobo_fc|Matías Núñez (CDM)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 26,
    "age": 24,
    "fechaNacimiento": "2000-10-09",
    "source": "fc26"
  },
  "carabobo_fc|Joshuan Berríos (RW)": {
    "overall": 67,
    "nationality": "Colombia",
    "dorsal": 14,
    "age": 28,
    "fechaNacimiento": "1997-01-24",
    "source": "fc26"
  },
  "carabobo_fc|Juan Camilo Pérez (CM)": {
    "overall": 67,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "rayo_zuliano|Samuel Orejuela (CB)": {
    "overall": 66,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "rayo_zuliano|Jorge Luis Gómez (CDM)": {
    "overall": 65,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "rayo_zuliano|Paolo Chacón (CB)": {
    "overall": 65,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "rayo_zuliano|Joiser Arias (CM)": {
    "overall": 64,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "rayo_zuliano|Daniel Rivillo (RB)": {
    "overall": 64,
    "nationality": "Venezuela",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1996-12-21",
    "source": "fc26"
  },
  "rayo_zuliano|José Camacaro (GK)": {
    "overall": 62,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "rayo_zuliano|Jaider Julio (LB)": {
    "overall": 62,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "rayo_zuliano|Edwin Castro (CM)": {
    "overall": 70,
    "nationality": "Colombia",
    "dorsal": 22,
    "age": 33,
    "fechaNacimiento": "1992-02-21",
    "source": "fc26"
  },
  "rayo_zuliano|José Luis Ochoa (ST)": {
    "overall": 62,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "rayo_zuliano|Luis Enrique Paz (ST)": {
    "overall": 62,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "rayo_zuliano|Luis Urbina (RW)": {
    "overall": 62,
    "dorsal": 97,
    "source": "latamfc26"
  },
  "caracas_fc|Adrián Fernández (ST)": {
    "overall": 66,
    "nationality": "Argentina",
    "dorsal": 24,
    "age": 24,
    "fechaNacimiento": "2001-05-20",
    "source": "fc26"
  },
  "caracas_fc|Luis Mago (CB)": {
    "overall": 67,
    "nationality": "Venezuela",
    "dorsal": 19,
    "age": 30,
    "fechaNacimiento": "1994-09-15",
    "source": "fc26"
  },
  "caracas_fc|Jesús Yendis (LB)": {
    "overall": 67,
    "nationality": "Venezuela",
    "dorsal": 13,
    "age": 27,
    "fechaNacimiento": "1998-02-18",
    "source": "fc26"
  },
  "caracas_fc|Michael Covea (CAM)": {
    "overall": 67,
    "nationality": "Venezuela",
    "dorsal": 10,
    "age": 31,
    "fechaNacimiento": "1993-08-21",
    "source": "fc26"
  },
  "caracas_fc|Frankarlos Benítez (GK)": {
    "overall": 66,
    "nationality": "Venezuela",
    "dorsal": 12,
    "age": 21,
    "fechaNacimiento": "2004-05-03",
    "source": "fc26"
  },
  "caracas_fc|Eduardo Fereira (RB)": {
    "overall": 66,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "caracas_fc|Francisco La Mantía (CB)": {
    "overall": 66,
    "nationality": "Venezuela",
    "dorsal": 2,
    "age": 29,
    "fechaNacimiento": "1996-02-24",
    "source": "fc26"
  },
  "caracas_fc|Christian Larotonda (CDM)": {
    "overall": 66,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "caracas_fc|Luis Maestre (CM)": {
    "overall": 66,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "caracas_fc|Robert Hernández (RW)": {
    "overall": 65,
    "nationality": "Venezuela",
    "dorsal": 10,
    "age": 31,
    "fechaNacimiento": "1993-09-14",
    "source": "fc26"
  },
  "caracas_fc|Irving Gudiño (CM)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "monagas_sc|Elvis Perlaza (RB)": {
    "overall": 68,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "monagas_sc|Joyce Ossa (CB)": {
    "overall": 68,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "monagas_sc|Edder Farías (ST)": {
    "overall": 68,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "monagas_sc|Felipe Jaramillo (CDM)": {
    "overall": 66,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "monagas_sc|Jean Colorado (CM)": {
    "overall": 65,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "monagas_sc|Édgar Carrión (LW)": {
    "overall": 65,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "monagas_sc|Eduardo Lima (GK)": {
    "overall": 64,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "monagas_sc|Jeferson Caraballo (CM)": {
    "overall": 64,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "monagas_sc|Franklin González (ST)": {
    "overall": 64,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "monagas_sc|Fernando Basante (ST)": {
    "overall": 64,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "monagas_sc|Thomas Riveros (GK)": {
    "overall": 63,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "universidad_central|Lautaro Morales (GK)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 17,
    "age": 25,
    "fechaNacimiento": "1999-12-16",
    "source": "fc26"
  },
  "universidad_central|Kendrys Silva (RB)": {
    "overall": 69,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "universidad_central|Juan Camilo Zapata (ST)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "universidad_central|Samuel Sosa (RW)": {
    "overall": 67,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "universidad_central|Jovanny Bolívar (ST)": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "universidad_central|Yanniel Hernández (LB)": {
    "overall": 67,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "universidad_central|Charlis Ortiz (ST)": {
    "overall": 67,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "universidad_central|Vicente Rodríguez (CM)": {
    "overall": 66,
    "nationality": "Venezuela",
    "dorsal": 21,
    "age": 30,
    "fechaNacimiento": "1994-11-13",
    "source": "fc26"
  },
  "universidad_central|Francisco Solé (CDM)": {
    "overall": 66,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "universidad_central|Juan Manuel Cuesta (CAM)": {
    "overall": 66,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "universidad_central|Carlos Cermeño (CM)": {
    "overall": 66,
    "dorsal": 57,
    "source": "latamfc26"
  },
  "zamora_fc|Arles Flores (CDM)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "zamora_fc|Richard Celis (LW)": {
    "overall": 67,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "zamora_fc|Carlos Lujano (CB)": {
    "overall": 67,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "zamora_fc|Jhonny González (RB)": {
    "overall": 66,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "zamora_fc|Moisés Gallo (GK)": {
    "overall": 66,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "zamora_fc|Anthony Matos (CB)": {
    "overall": 66,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "zamora_fc|Gabriel Benítez (LB)": {
    "overall": 66,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "zamora_fc|Junior Cedeño (CDM)": {
    "overall": 66,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "zamora_fc|Erickson Gallardo (RW)": {
    "overall": 65,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "zamora_fc|Raudy Guerrero (RW)": {
    "overall": 65,
    "nationality": "Venezuela",
    "dorsal": 20,
    "age": 31,
    "fechaNacimiento": "1993-12-19",
    "source": "fc26"
  },
  "zamora_fc|Freddy Espinal (LW)": {
    "overall": 65,
    "dorsal": 70,
    "source": "latamfc26"
  },
  "trujillanos|Julián Figueroa (CDM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "trujillanos|Kevin De la Hoz (CB)": {
    "overall": 66,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "trujillanos|Juan Carlos Ortíz (RW)": {
    "overall": 66,
    "nationality": "Venezuela",
    "dorsal": 21,
    "age": 31,
    "fechaNacimiento": "1993-10-01",
    "source": "fc26"
  },
  "trujillanos|Jorge Páez (CM)": {
    "overall": 66,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "trujillanos|José Rivas (ST)": {
    "overall": 66,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "trujillanos|Francisco Bareiro (ST)": {
    "overall": 66,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "trujillanos|Luis Terán (GK)": {
    "overall": 65,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "trujillanos|Steven Pabón (CB)": {
    "overall": 64,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "trujillanos|Marlon Fernández (CAM)": {
    "overall": 64,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "trujillanos|Enderson Torrealba (RW)": {
    "overall": 64,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "trujillanos|Kevin González (CDM)": {
    "overall": 62,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "motagua|Rodrigo Gómez (LM)": {
    "overall": 60,
    "nationality": "Paraguay",
    "dorsal": 33,
    "age": 19,
    "fechaNacimiento": "2006-05-08",
    "source": "fc26"
  },
  "motagua|Emilio Izaguirre (LB)": {
    "overall": 68,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "motagua|Alejandro Reyes (CM)": {
    "overall": 66,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "motagua|Rodrigo De Olivera (ST)": {
    "overall": 65,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "motagua|Marlon Licona (GK)": {
    "overall": 65,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "motagua|John Kleber (ST)": {
    "overall": 64,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "motagua|Luis Crisanto (RB)": {
    "overall": 63,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "motagua|Jorge Serrano (LW)": {
    "overall": 62,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "motagua|Luis Vega (CB)": {
    "overall": 62,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "motagua|Pablo Cacho (CB)": {
    "overall": 62,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "motagua|Cristopher Meléndez (RB)": {
    "overall": 62,
    "dorsal": 35,
    "source": "latamfc26"
  },
  "saprissa|Óscar Duarte (CB)": {
    "overall": 74,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "saprissa|Mariano Torres (CAM)": {
    "overall": 72,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "saprissa|Kendall Waston (CB)": {
    "overall": 71,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "saprissa|Fidel Escobar (CB)": {
    "overall": 69,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "saprissa|David Guzmán (CDM)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "saprissa|Joseph Mora (LB)": {
    "overall": 68,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "saprissa|Ricardo Blanco (RB)": {
    "overall": 66,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "saprissa|Gerson Torres (RW)": {
    "overall": 66,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "saprissa|Newton Williams (ST)": {
    "overall": 66,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "saprissa|Pablo Arboine (CB)": {
    "overall": 65,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "saprissa|Gerald Taylor (RB)": {
    "overall": 65,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Themba Zwane (CAM)": {
    "overall": 75,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Peter Shalulile (ST)": {
    "overall": 74,
    "dorsal": 38,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Ronwen Williams (GK)": {
    "overall": 73,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Denis Onyango (GK)": {
    "overall": 73,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Nuno Santos (LM)": {
    "overall": 79,
    "nationality": "Portugal",
    "dorsal": 11,
    "age": 30,
    "fechaNacimiento": "1995-02-13",
    "source": "fc26"
  },
  "mamelodi_sundowns|Iqraam Rayners (ST)": {
    "overall": 72,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Miguel Reisinho (CM)": {
    "overall": 71,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Brayan León (ST)": {
    "overall": 71,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Aubrey Modiba (LB)": {
    "overall": 71,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Thapelo Morena (RB)": {
    "overall": 70,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "mamelodi_sundowns|Khuliso Mudau (RB)": {
    "overall": 70,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "espérance|Youcef Belaïli (LW)": {
    "overall": 76,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "espérance|Hamza Jelassi (CB)": {
    "overall": 71,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "espérance|Yassine Meriah (CB)": {
    "overall": 71,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "espérance|Yan Sasse (RW)": {
    "overall": 71,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "espérance|Bechir Ben Said (GK)": {
    "overall": 70,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "espérance|Mohamed Amine Tougai (CB)": {
    "overall": 69,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "espérance|Chiheb Jebali (CAM)": {
    "overall": 69,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "espérance|Mohamed Amine Ben Hamida (LB)": {
    "overall": 68,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "espérance|Kouceila Boualia (RW)": {
    "overall": 67,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "espérance|Houssem Tka (CM)": {
    "overall": 67,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "espérance|Florian Thomas Danho (ST)": {
    "overall": 67,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "ferroviária|Hernâni (RM)": {
    "overall": 75,
    "nationality": "Brazil",
    "dorsal": 23,
    "age": 31,
    "fechaNacimiento": "1994-03-27",
    "source": "fc26"
  },
  "ferroviária|Ronaldo (ST)": {
    "overall": 67,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "ferroviária|Dênis Jr (GK)": {
    "overall": 66,
    "dorsal": 41,
    "source": "latamfc26"
  },
  "ferroviária|Zé Mário (LB)": {
    "overall": 65,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "ferroviária|Lucas Rodrigues (RB)": {
    "overall": 66,
    "nationality": "Brazil",
    "dorsal": 77,
    "age": 25,
    "fechaNacimiento": "1999-08-27",
    "source": "fc26"
  },
  "ferroviária|Gustavo Medina (CB)": {
    "overall": 63,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "ferroviária|Netinho (CDM)": {
    "overall": 63,
    "dorsal": 35,
    "source": "latamfc26"
  },
  "ferroviária|Albano (CAM)": {
    "overall": 63,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "ferroviária|Ronaldo Alves (CB)": {
    "overall": 62,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "ferroviária|Alencar (CM)": {
    "overall": 62,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "ferroviária|Thiago Lopes (LM)": {
    "overall": 62,
    "dorsal": 37,
    "source": "latamfc26"
  },
  "volta_redonda|Kayke (ST)": {
    "overall": 72,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "volta_redonda|Caio Roque (LB)": {
    "overall": 68,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "volta_redonda|Wellington Silva (RB)": {
    "overall": 70,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 32,
    "fechaNacimiento": "1993-01-06",
    "source": "fc26"
  },
  "volta_redonda|Bruno Barra (CDM)": {
    "overall": 66,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "volta_redonda|Léo Ceará (CAM)": {
    "overall": 65,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "volta_redonda|Thallyson (CDM)": {
    "overall": 65,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "volta_redonda|João Pedro (RW)": {
    "overall": 79,
    "nationality": "Brazil",
    "dorsal": 20,
    "age": 23,
    "fechaNacimiento": "2001-09-26",
    "source": "fc26"
  },
  "volta_redonda|Marquinhos (LW)": {
    "overall": 87,
    "nationality": "Brazil",
    "dorsal": 5,
    "age": 31,
    "fechaNacimiento": "1994-05-14",
    "source": "fc26"
  },
  "volta_redonda|Italo (ST)": {
    "overall": 70,
    "nationality": "Brazil",
    "dorsal": 5,
    "age": 27,
    "fechaNacimiento": "1997-08-03",
    "source": "fc26"
  },
  "volta_redonda|Chay (CAM)": {
    "overall": 65,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "volta_redonda|Jefferson Paulino (GK)": {
    "overall": 64,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "paysandu|Thiago Heleno (CB)": {
    "overall": 74,
    "dorsal": 44,
    "source": "latamfc26"
  },
  "paysandu|Maurício (CB)": {
    "overall": 71,
    "dorsal": 35,
    "source": "latamfc26"
  },
  "paysandu|Rossi (RM)": {
    "overall": 70,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "paysandu|PK (LB)": {
    "overall": 68,
    "dorsal": 94,
    "source": "latamfc26"
  },
  "paysandu|Edinho (CAM)": {
    "overall": 67,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "paysandu|Matheus Vargas (CM)": {
    "overall": 67,
    "dorsal": 96,
    "source": "latamfc26"
  },
  "paysandu|Yeferson Quintana (CB)": {
    "overall": 66,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "paysandu|Dudu Vieira (CM)": {
    "overall": 65,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "paysandu|Petterson (LW)": {
    "overall": 64,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "paysandu|Gabriel Mesquita (GK)": {
    "overall": 63,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "paysandu|Denner (CAM)": {
    "overall": 63,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "amazonas_fc|Akapo (RB)": {
    "overall": 72,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "amazonas_fc|Kevin Ramírez (CB)": {
    "overall": 71,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "amazonas_fc|Leo Coelho (CB)": {
    "overall": 70,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "amazonas_fc|Renan (GK)": {
    "overall": 69,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "amazonas_fc|Henrique (ST)": {
    "overall": 68,
    "dorsal": 91,
    "source": "latamfc26"
  },
  "amazonas_fc|Joaquín Torres (CAM)": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "amazonas_fc|João Lopes (GK)": {
    "overall": 67,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "amazonas_fc|Luan Silva (ST)": {
    "overall": 66,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "amazonas_fc|Riza Durmisi (LB)": {
    "overall": 66,
    "dorsal": 35,
    "source": "latamfc26"
  },
  "amazonas_fc|Fabiano (LB)": {
    "overall": 65,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "amazonas_fc|Rafael Tavares (CAM)": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "plaza_colonia|Facundo Píriz (CDM)": {
    "overall": 69,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "plaza_colonia|Haibrany Ruíz Díaz (CB)": {
    "overall": 67,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "plaza_colonia|Gonzalo Bueno (LW)": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "plaza_colonia|Ángel Cayetano (CDM)": {
    "overall": 67,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "plaza_colonia|Pablo García (RM)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 25,
    "fechaNacimiento": "2000-06-05",
    "source": "fc26"
  },
  "plaza_colonia|Guillermo Reyes (GK)": {
    "overall": 65,
    "dorsal": 44,
    "source": "latamfc26"
  },
  "plaza_colonia|Matías Velázquez (CB)": {
    "overall": 65,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "plaza_colonia|Benjamín Acosta (RW)": {
    "overall": 64,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "plaza_colonia|Máximo Lorenzi (CB)": {
    "overall": 64,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "plaza_colonia|Joaquín Silva (GK)": {
    "overall": 64,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "plaza_colonia|Diego Villalba (CM)": {
    "overall": 63,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "miramar_misiones|Federico Alonso (CB)": {
    "overall": 68,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "miramar_misiones|Jhonny Da Silva (GK)": {
    "overall": 67,
    "dorsal": 41,
    "source": "latamfc26"
  },
  "miramar_misiones|Mauricio Gómez (RB)": {
    "overall": 66,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "miramar_misiones|Guzmán Pereira (CM)": {
    "overall": 66,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "miramar_misiones|Nicolás Latorre (CDM)": {
    "overall": 65,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "miramar_misiones|Sebastián Diana (CB)": {
    "overall": 64,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "miramar_misiones|Ayrton Castro (LB)": {
    "overall": 62,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "miramar_misiones|Emiliano Saliadarre (ST)": {
    "overall": 62,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "miramar_misiones|Ignacio Yepez (CAM)": {
    "overall": 62,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "miramar_misiones|Diego Núñez (CDM)": {
    "overall": 62,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "miramar_misiones|Andrés Olivera (CB)": {
    "overall": 61,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "1_fc_koln|Marvin Schwäbe (GK)": {
    "overall": 77,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 30,
    "fechaNacimiento": "1995-04-25",
    "source": "fc26"
  },
  "1_fc_koln|Eric Martel (CDM)": {
    "overall": 76,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2002-04-29",
    "source": "fc26"
  },
  "1_fc_koln|Jakub Kamiński (LM)": {
    "overall": 74,
    "nationality": "Poland",
    "dorsal": 16,
    "age": 23,
    "fechaNacimiento": "2002-06-05",
    "source": "fc26"
  },
  "1_fc_koln|Said El Mala (LM)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 13,
    "age": 18,
    "fechaNacimiento": "2006-08-26",
    "source": "fc26"
  },
  "1_fc_koln|Marius Bülter (ST)": {
    "overall": 76,
    "nationality": "Germany",
    "dorsal": 30,
    "age": 32,
    "fechaNacimiento": "1993-03-29",
    "source": "fc26"
  },
  "1_fc_koln|Alessio Castro-Montes (RM)": {
    "overall": 77,
    "nationality": "Belgium",
    "dorsal": 17,
    "age": 28,
    "fechaNacimiento": "1997-05-17",
    "source": "fc26"
  },
  "1_fc_koln|Ísak Bergmann Jóhannesson (CM)": {
    "overall": 73,
    "nationality": "Iceland",
    "dorsal": 18,
    "age": 22,
    "fechaNacimiento": "2003-03-23",
    "source": "fc26"
  },
  "1_fc_koln|Ragnar Ache (ST)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 9,
    "age": 26,
    "fechaNacimiento": "1998-07-28",
    "source": "fc26"
  },
  "1_fc_koln|Tom Krauß (CDM)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 5,
    "age": 24,
    "fechaNacimiento": "2001-06-22",
    "source": "fc26"
  },
  "1_fc_koln|Ron-Robert Zieler (GK)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 20,
    "age": 36,
    "fechaNacimiento": "1989-02-12",
    "source": "fc26"
  },
  "1_fc_koln|Sebastian Sebulonsen (RB)": {
    "overall": 70,
    "nationality": "Norway",
    "dorsal": 28,
    "age": 25,
    "fechaNacimiento": "2000-01-27",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Kaishū Sano (CDM)": {
    "overall": 79,
    "nationality": "Japan",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2000-12-30",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Nadiem Amiri (CM)": {
    "overall": 81,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1996-10-27",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Stefan Posch (RB)": {
    "overall": 79,
    "nationality": "Austria",
    "dorsal": 27,
    "age": 28,
    "fechaNacimiento": "1997-05-14",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Anthony Caci (RB)": {
    "overall": 78,
    "nationality": "France",
    "dorsal": 19,
    "age": 28,
    "fechaNacimiento": "1997-07-01",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Robin Zentner (GK)": {
    "overall": 78,
    "nationality": "Germany",
    "dorsal": 27,
    "age": 30,
    "fechaNacimiento": "1994-10-28",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Dominik Kohr (CB)": {
    "overall": 77,
    "nationality": "Germany",
    "dorsal": 31,
    "age": 31,
    "fechaNacimiento": "1994-01-31",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Paul Nebel (CAM)": {
    "overall": 78,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 22,
    "fechaNacimiento": "2002-10-10",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Lee Jae Sung (CAM)": {
    "overall": 77,
    "nationality": "Korea Republic",
    "dorsal": 7,
    "age": 32,
    "fechaNacimiento": "1992-08-10",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Danny da Costa (CB)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 21,
    "age": 31,
    "fechaNacimiento": "1993-07-13",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Phillipp Mwene (LB)": {
    "overall": 76,
    "nationality": "Austria",
    "dorsal": 2,
    "age": 31,
    "fechaNacimiento": "1994-01-29",
    "source": "fc26"
  },
  "1_fsv_mainz_05|Benedict Hollerbach (ST)": {
    "overall": 77,
    "nationality": "Germany",
    "dorsal": 17,
    "age": 24,
    "fechaNacimiento": "2001-05-17",
    "source": "fc26"
  },
  "borussia_dortmund|Gregor Kobel (GK)": {
    "overall": 86,
    "nationality": "Switzerland",
    "dorsal": 1,
    "age": 27,
    "fechaNacimiento": "1997-12-06",
    "source": "fc26"
  },
  "borussia_dortmund|Nico Schlotterbeck (CB)": {
    "overall": 85,
    "nationality": "Germany",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "1999-12-01",
    "source": "fc26"
  },
  "borussia_dortmund|Serhou Guirassy (ST)": {
    "overall": 87,
    "nationality": "Guinea",
    "dorsal": 9,
    "age": 29,
    "fechaNacimiento": "1996-03-12",
    "source": "fc26"
  },
  "borussia_dortmund|Felix Nmecha (CM)": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2000-10-10",
    "source": "fc26"
  },
  "borussia_dortmund|Waldemar Anton (CB)": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1996-07-20",
    "source": "fc26"
  },
  "borussia_dortmund|Julian Brandt (CAM)": {
    "overall": 83,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 29,
    "fechaNacimiento": "1996-05-02",
    "source": "fc26"
  },
  "borussia_dortmund|Karim Adeyemi (RM)": {
    "overall": 82,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "borussia_dortmund|Emre Can (CB)": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 23,
    "age": 31,
    "fechaNacimiento": "1994-01-12",
    "source": "fc26"
  },
  "borussia_dortmund|Marcel Sabitzer (CDM)": {
    "overall": 80,
    "nationality": "Austria",
    "dorsal": 20,
    "age": 31,
    "fechaNacimiento": "1994-03-17",
    "source": "fc26"
  },
  "borussia_dortmund|Julian Ryerson (RB)": {
    "overall": 79,
    "nationality": "Norway",
    "dorsal": 26,
    "age": 27,
    "fechaNacimiento": "1997-11-17",
    "source": "fc26"
  },
  "borussia_dortmund|Maximilian Beier (ST)": {
    "overall": 79,
    "nationality": "Germany",
    "dorsal": 14,
    "age": 22,
    "fechaNacimiento": "2002-10-17",
    "source": "fc26"
  },
  "eintracht_frankfurt|Jonathan Burkardt (ST)": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-07-11",
    "source": "fc26"
  },
  "eintracht_frankfurt|Ritsu Doan (RM)": {
    "overall": 82,
    "nationality": "Japan",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-06-16",
    "source": "fc26"
  },
  "eintracht_frankfurt|Robin Koch (CB)": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1996-07-17",
    "source": "fc26"
  },
  "eintracht_frankfurt|Nathaniel Brown (LB)": {
    "overall": 77,
    "nationality": "Germany",
    "dorsal": 21,
    "age": 22,
    "fechaNacimiento": "2003-06-16",
    "source": "fc26"
  },
  "eintracht_frankfurt|Arthur Theate (CB)": {
    "overall": 80,
    "nationality": "Belgium",
    "dorsal": 3,
    "age": 25,
    "fechaNacimiento": "2000-05-25",
    "source": "fc26"
  },
  "eintracht_frankfurt|Rasmus Kristensen (RB)": {
    "overall": 79,
    "nationality": "Denmark",
    "dorsal": 13,
    "age": 27,
    "fechaNacimiento": "1997-07-11",
    "source": "fc26"
  },
  "eintracht_frankfurt|Mario Götze (CM)": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 27,
    "age": 33,
    "fechaNacimiento": "1992-06-03",
    "source": "fc26"
  },
  "eintracht_frankfurt|Can Uzun (CAM)": {
    "overall": 74,
    "nationality": "Türkiye",
    "dorsal": 42,
    "age": 19,
    "fechaNacimiento": "2005-11-11",
    "source": "fc26"
  },
  "eintracht_frankfurt|Hugo Larsson (CM)": {
    "overall": 78,
    "nationality": "Sweden",
    "dorsal": 16,
    "age": 21,
    "fechaNacimiento": "2004-06-27",
    "source": "fc26"
  },
  "eintracht_frankfurt|Arnaud Kalimuendo (ST)": {
    "overall": 78,
    "nationality": "France",
    "dorsal": 15,
    "age": 23,
    "fechaNacimiento": "2002-01-20",
    "source": "fc26"
  },
  "eintracht_frankfurt|Ellyes Skhiri (CDM)": {
    "overall": 80,
    "nationality": "Tunisia",
    "dorsal": 15,
    "age": 30,
    "fechaNacimiento": "1995-05-10",
    "source": "fc26"
  },
  "fc_augsburg|Jeffrey Gouweleeuw (CB)": {
    "overall": 77,
    "nationality": "Netherlands",
    "dorsal": 6,
    "age": 33,
    "fechaNacimiento": "1991-07-10",
    "source": "fc26"
  },
  "fc_augsburg|Chrislain Matsima (CB)": {
    "overall": 77,
    "nationality": "France",
    "dorsal": 5,
    "age": 23,
    "fechaNacimiento": "2002-05-15",
    "source": "fc26"
  },
  "fc_augsburg|Finn Dahmen (GK)": {
    "overall": 77,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 27,
    "fechaNacimiento": "1998-03-27",
    "source": "fc26"
  },
  "fc_augsburg|Dimitris Giannoulis (LB)": {
    "overall": 76,
    "nationality": "Greece",
    "dorsal": 13,
    "age": 29,
    "fechaNacimiento": "1995-10-17",
    "source": "fc26"
  },
  "fc_augsburg|Alexis Claude-Maurice (CAM)": {
    "overall": 77,
    "nationality": "France",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-06-06",
    "source": "fc26"
  },
  "fc_augsburg|Keven Schlotterbeck (CB)": {
    "overall": 76,
    "nationality": "Germany",
    "dorsal": 31,
    "age": 28,
    "fechaNacimiento": "1997-04-28",
    "source": "fc26"
  },
  "fc_augsburg|Kristijan Jakić (CDM)": {
    "overall": 76,
    "nationality": "Croatia",
    "dorsal": 17,
    "age": 28,
    "fechaNacimiento": "1997-05-14",
    "source": "fc26"
  },
  "fc_augsburg|Han-Noah Massengo (CDM)": {
    "overall": 72,
    "nationality": "France",
    "dorsal": 4,
    "age": 23,
    "fechaNacimiento": "2001-07-07",
    "source": "fc26"
  },
  "fc_augsburg|Michael Gregoritsch (ST)": {
    "overall": 75,
    "nationality": "Austria",
    "dorsal": 9,
    "age": 31,
    "fechaNacimiento": "1994-04-18",
    "source": "fc26"
  },
  "fc_augsburg|Cédric Zesiger (CB)": {
    "overall": 76,
    "nationality": "Switzerland",
    "dorsal": 16,
    "age": 27,
    "fechaNacimiento": "1998-06-24",
    "source": "fc26"
  },
  "fc_augsburg|Robin Fellhauer (CDM)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 19,
    "age": 27,
    "fechaNacimiento": "1998-01-21",
    "source": "fc26"
  },
  "fc_st_pauli|Nikola Vasilj (GK)": {
    "overall": 77,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 22,
    "age": 29,
    "fechaNacimiento": "1995-12-02",
    "source": "fc26"
  },
  "fc_st_pauli|Hauke Wahl (CB)": {
    "overall": 74,
    "nationality": "Germany",
    "dorsal": 5,
    "age": 31,
    "fechaNacimiento": "1994-04-15",
    "source": "fc26"
  },
  "fc_st_pauli|Eric Smith (CB)": {
    "overall": 75,
    "nationality": "Sweden",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-01-08",
    "source": "fc26"
  },
  "fc_st_pauli|Jackson Irvine (CM)": {
    "overall": 75,
    "nationality": "Australia",
    "dorsal": 7,
    "age": 32,
    "fechaNacimiento": "1993-03-07",
    "source": "fc26"
  },
  "fc_st_pauli|Mathias Rasmussen (CM)": {
    "overall": 71,
    "nationality": "Norway",
    "dorsal": 4,
    "age": 27,
    "fechaNacimiento": "1997-11-25",
    "source": "fc26"
  },
  "fc_st_pauli|Mathias Pereira Lage (ST)": {
    "overall": 75,
    "nationality": "Portugal",
    "dorsal": 28,
    "age": 28,
    "fechaNacimiento": "1996-11-30",
    "source": "fc26"
  },
  "fc_st_pauli|Manolis Saliakas (RB)": {
    "overall": 73,
    "nationality": "Greece",
    "dorsal": 2,
    "age": 28,
    "fechaNacimiento": "1996-09-12",
    "source": "fc26"
  },
  "fc_st_pauli|Joel Chima Fujita (CM)": {
    "overall": 72,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "fc_st_pauli|Martijn Kaars (ST)": {
    "overall": 71,
    "nationality": "Netherlands",
    "dorsal": 19,
    "age": 26,
    "fechaNacimiento": "1999-03-05",
    "source": "fc26"
  },
  "fc_st_pauli|James Sands (CDM)": {
    "overall": 71,
    "nationality": "United States",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2000-07-06",
    "source": "fc26"
  },
  "fc_st_pauli|Danel Sinani (CAM)": {
    "overall": 69,
    "nationality": "Luxembourg",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1997-04-05",
    "source": "fc26"
  },
  "rb_leipzig|Péter Gulácsi (GK)": {
    "overall": 85,
    "nationality": "Hungary",
    "dorsal": 1,
    "age": 35,
    "fechaNacimiento": "1990-05-06",
    "source": "fc26"
  },
  "rb_leipzig|Willi Orban (CB)": {
    "overall": 84,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "rb_leipzig|David Raum (LB)": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 22,
    "age": 27,
    "fechaNacimiento": "1998-04-22",
    "source": "fc26"
  },
  "rb_leipzig|Castello Lukeba (CB)": {
    "overall": 80,
    "nationality": "France",
    "dorsal": 23,
    "age": 22,
    "fechaNacimiento": "2002-12-17",
    "source": "fc26"
  },
  "rb_leipzig|Christoph Baumgartner (CAM)": {
    "overall": 77,
    "nationality": "Austria",
    "dorsal": 14,
    "age": 25,
    "fechaNacimiento": "1999-08-01",
    "source": "fc26"
  },
  "rb_leipzig|Benjamin Henrichs (RB)": {
    "overall": 80,
    "nationality": "Germany",
    "dorsal": 39,
    "age": 28,
    "fechaNacimiento": "1997-02-23",
    "source": "fc26"
  },
  "rb_leipzig|Ridle Baku (RB)": {
    "overall": 79,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "rb_leipzig|Nicolas Seiwald (CDM)": {
    "overall": 77,
    "nationality": "Austria",
    "dorsal": 13,
    "age": 24,
    "fechaNacimiento": "2001-05-04",
    "source": "fc26"
  },
  "rb_leipzig|Yan Diomande (RW)": {
    "overall": 66,
    "nationality": "Côte d'Ivoire",
    "dorsal": 49,
    "age": 18,
    "fechaNacimiento": "2006-11-14",
    "source": "fc26"
  },
  "rb_leipzig|Rômulo (ST)": {
    "overall": 76,
    "nationality": "Brazil",
    "dorsal": 40,
    "age": 23,
    "fechaNacimiento": "2002-02-08",
    "source": "fc26"
  },
  "rb_leipzig|Antonio Nusa (LW)": {
    "overall": 76,
    "nationality": "Norway",
    "dorsal": 7,
    "age": 20,
    "fechaNacimiento": "2005-04-17",
    "source": "fc26"
  },
  "sc_freiburg|Matthias Ginter (CB)": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 28,
    "age": 31,
    "fechaNacimiento": "1994-01-19",
    "source": "fc26"
  },
  "sc_freiburg|Vincenzo Grifo (LM)": {
    "overall": 80,
    "nationality": "Italy",
    "dorsal": 32,
    "age": 32,
    "fechaNacimiento": "1993-04-07",
    "source": "fc26"
  },
  "sc_freiburg|Noah Atubolu (GK)": {
    "overall": 77,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 23,
    "fechaNacimiento": "2002-05-25",
    "source": "fc26"
  },
  "sc_freiburg|Philipp Lienhart (CB)": {
    "overall": 79,
    "nationality": "Austria",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1996-07-11",
    "source": "fc26"
  },
  "sc_freiburg|Christian Günter (LB)": {
    "overall": 77,
    "nationality": "Germany",
    "dorsal": 30,
    "age": 32,
    "fechaNacimiento": "1993-02-28",
    "source": "fc26"
  },
  "sc_freiburg|Maximilian Eggestein (CDM)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1996-12-08",
    "source": "fc26"
  },
  "sc_freiburg|Jan-Niklas Beste (RM)": {
    "overall": 76,
    "nationality": "Germany",
    "dorsal": 19,
    "age": 26,
    "fechaNacimiento": "1999-01-04",
    "source": "fc26"
  },
  "sc_freiburg|Johan Manzambi (CM)": {
    "overall": 67,
    "nationality": "Switzerland",
    "dorsal": 44,
    "age": 19,
    "fechaNacimiento": "2005-10-14",
    "source": "fc26"
  },
  "sc_freiburg|Lukas Kübler (RB)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 17,
    "age": 32,
    "fechaNacimiento": "1992-08-30",
    "source": "fc26"
  },
  "sc_freiburg|Philipp Treu (RB)": {
    "overall": 74,
    "nationality": "Germany",
    "dorsal": 29,
    "age": 24,
    "fechaNacimiento": "2000-12-03",
    "source": "fc26"
  },
  "sc_freiburg|Yuito Suzuki (CAM)": {
    "overall": 71,
    "nationality": "Japan",
    "dorsal": 14,
    "age": 23,
    "fechaNacimiento": "2001-10-25",
    "source": "fc26"
  },
  "union_berlin|Frederik Rønnow (GK)": {
    "overall": 80,
    "nationality": "Denmark",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1992-08-04",
    "source": "fc26"
  },
  "union_berlin|Danilho Doekhi (CB)": {
    "overall": 78,
    "nationality": "Netherlands",
    "dorsal": 5,
    "age": 27,
    "fechaNacimiento": "1998-06-30",
    "source": "fc26"
  },
  "union_berlin|Leopold Querfeld (CB)": {
    "overall": 75,
    "nationality": "Austria",
    "dorsal": 14,
    "age": 21,
    "fechaNacimiento": "2003-12-20",
    "source": "fc26"
  },
  "union_berlin|Diogo Leite (CB)": {
    "overall": 78,
    "nationality": "Portugal",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1999-01-23",
    "source": "fc26"
  },
  "union_berlin|Rani Khedira (CDM)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 31,
    "fechaNacimiento": "1994-01-27",
    "source": "fc26"
  },
  "union_berlin|Christopher Trimmel (RB)": {
    "overall": 75,
    "nationality": "Austria",
    "dorsal": 28,
    "age": 38,
    "fechaNacimiento": "1987-02-24",
    "source": "fc26"
  },
  "union_berlin|Derrick Köhn (LB)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 39,
    "age": 26,
    "fechaNacimiento": "1999-02-04",
    "source": "fc26"
  },
  "union_berlin|Aljoscha Kemlein (CM)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 20,
    "fechaNacimiento": "2004-08-02",
    "source": "fc26"
  },
  "union_berlin|András Schäfer (CM)": {
    "overall": 74,
    "nationality": "Hungary",
    "dorsal": 13,
    "age": 26,
    "fechaNacimiento": "1999-04-13",
    "source": "fc26"
  },
  "union_berlin|Andrej Ilić (ST)": {
    "overall": 72,
    "nationality": "Serbia",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "2000-04-03",
    "source": "fc26"
  },
  "union_berlin|Janik Haberer (CM)": {
    "overall": 74,
    "nationality": "Germany",
    "dorsal": 19,
    "age": 31,
    "fechaNacimiento": "1994-04-02",
    "source": "fc26"
  },
  "vfl_wolfsburg|Kamil Grabara (GK)": {
    "overall": 79,
    "nationality": "Poland",
    "dorsal": 1,
    "age": 26,
    "fechaNacimiento": "1999-01-08",
    "source": "fc26"
  },
  "vfl_wolfsburg|Mohamed Amoura (ST)": {
    "overall": 80,
    "nationality": "Algeria",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-05-09",
    "source": "fc26"
  },
  "vfl_wolfsburg|Maximilian Arnold (CDM)": {
    "overall": 79,
    "nationality": "Germany",
    "dorsal": 27,
    "age": 31,
    "fechaNacimiento": "1994-05-27",
    "source": "fc26"
  },
  "vfl_wolfsburg|Joakim Mæhle (LB)": {
    "overall": 78,
    "nationality": "Denmark",
    "dorsal": 21,
    "age": 28,
    "fechaNacimiento": "1997-05-20",
    "source": "fc26"
  },
  "vfl_wolfsburg|Patrick Wimmer (LM)": {
    "overall": 77,
    "nationality": "Austria",
    "dorsal": 39,
    "age": 24,
    "fechaNacimiento": "2001-05-30",
    "source": "fc26"
  },
  "vfl_wolfsburg|Lovro Majer (CAM)": {
    "overall": 78,
    "nationality": "Croatia",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-01-17",
    "source": "fc26"
  },
  "vfl_wolfsburg|Denis Vavro (CB)": {
    "overall": 78,
    "nationality": "Slovakia",
    "dorsal": 3,
    "age": 29,
    "fechaNacimiento": "1996-04-10",
    "source": "fc26"
  },
  "vfl_wolfsburg|Moritz Jenz (CB)": {
    "overall": 76,
    "nationality": "Germany",
    "dorsal": 15,
    "age": 26,
    "fechaNacimiento": "1999-04-30",
    "source": "fc26"
  },
  "vfl_wolfsburg|Konstantinos Koulierakis (CB)": {
    "overall": 77,
    "nationality": "Greece",
    "dorsal": 4,
    "age": 21,
    "fechaNacimiento": "2003-11-28",
    "source": "fc26"
  },
  "vfl_wolfsburg|Christian Eriksen (CAM)": {
    "overall": 76,
    "nationality": "Denmark",
    "dorsal": 24,
    "age": 33,
    "fechaNacimiento": "1992-02-14",
    "source": "fc26"
  },
  "vfl_wolfsburg|Mattias Svanberg (CM)": {
    "overall": 76,
    "nationality": "Sweden",
    "dorsal": 32,
    "age": 26,
    "fechaNacimiento": "1999-01-05",
    "source": "fc26"
  },
  "vfb_stuttgart|Maximilian Mittelstädt (LB)": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 7,
    "age": 28,
    "fechaNacimiento": "1997-03-18",
    "source": "fc26"
  },
  "vfb_stuttgart|Angelo Stiller (CDM)": {
    "overall": 83,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2001-04-04",
    "source": "fc26"
  },
  "vfb_stuttgart|Deniz Undav (ST)": {
    "overall": 80,
    "nationality": "Germany",
    "dorsal": 26,
    "age": 28,
    "fechaNacimiento": "1996-07-19",
    "source": "fc26"
  },
  "vfb_stuttgart|Alexander Nübel (GK)": {
    "overall": 81,
    "nationality": "Germany",
    "dorsal": 33,
    "age": 28,
    "fechaNacimiento": "1996-09-30",
    "source": "fc26"
  },
  "vfb_stuttgart|Julian Chabot (CB)": {
    "overall": 80,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "vfb_stuttgart|Ermedin Demirović (ST)": {
    "overall": 80,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1998-03-25",
    "source": "fc26"
  },
  "vfb_stuttgart|Jamie Leweling (RM)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 18,
    "age": 24,
    "fechaNacimiento": "2001-02-26",
    "source": "fc26"
  },
  "vfb_stuttgart|Bilal El Khannouss (CAM)": {
    "overall": 76,
    "nationality": "Morocco",
    "dorsal": 11,
    "age": 21,
    "fechaNacimiento": "2004-05-10",
    "source": "fc26"
  },
  "vfb_stuttgart|Atakan Karazor (CDM)": {
    "overall": 76,
    "nationality": "Türkiye",
    "dorsal": 16,
    "age": 28,
    "fechaNacimiento": "1996-10-13",
    "source": "fc26"
  },
  "vfb_stuttgart|Chris Führich (LM)": {
    "overall": 77,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-01-09",
    "source": "fc26"
  },
  "vfb_stuttgart|Tiago Tomás (LM)": {
    "overall": 76,
    "nationality": "Portugal",
    "dorsal": 8,
    "age": 23,
    "fechaNacimiento": "2002-06-16",
    "source": "fc26"
  },
  "bayer_leverkusen|Grimaldo (LM)": {
    "overall": 84,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1995-09-20",
    "source": "fc26"
  },
  "bayer_leverkusen|Patrik Schick (ST)": {
    "overall": 85,
    "nationality": "Czechia",
    "dorsal": 14,
    "age": 29,
    "fechaNacimiento": "1996-01-24",
    "source": "fc26"
  },
  "bayer_leverkusen|Aleix García (CM)": {
    "overall": 83,
    "nationality": "Spain",
    "dorsal": 24,
    "age": 28,
    "fechaNacimiento": "1997-06-28",
    "source": "fc26"
  },
  "bayer_leverkusen|Exequiel Palacios (CM)": {
    "overall": 84,
    "nationality": "Argentina",
    "dorsal": 25,
    "age": 26,
    "fechaNacimiento": "1998-10-05",
    "source": "fc26"
  },
  "bayer_leverkusen|Edmond Tapsoba (CB)": {
    "overall": 81,
    "nationality": "Burkina Faso",
    "dorsal": 12,
    "age": 26,
    "fechaNacimiento": "1999-02-02",
    "source": "fc26"
  },
  "bayer_leverkusen|Malik Tillman (CAM)": {
    "overall": 82,
    "nationality": "United States",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2002-05-28",
    "source": "fc26"
  },
  "bayer_leverkusen|Robert Andrich (CB)": {
    "overall": 81,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 30,
    "fechaNacimiento": "1994-09-22",
    "source": "fc26"
  },
  "bayer_leverkusen|Martin Terrier (CAM)": {
    "overall": 79,
    "nationality": "France",
    "dorsal": 11,
    "age": 28,
    "fechaNacimiento": "1997-03-04",
    "source": "fc26"
  },
  "bayer_leverkusen|Ibrahim Maza (CAM)": {
    "overall": 71,
    "nationality": "Algeria",
    "dorsal": 30,
    "age": 19,
    "fechaNacimiento": "2005-11-24",
    "source": "fc26"
  },
  "bayer_leverkusen|Nathan Tella (RM)": {
    "overall": 78,
    "nationality": "Nigeria",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "1999-07-05",
    "source": "fc26"
  },
  "bayer_leverkusen|Loïc Badé (CB)": {
    "overall": 78,
    "nationality": "France",
    "dorsal": 5,
    "age": 25,
    "fechaNacimiento": "2000-04-11",
    "source": "fc26"
  },
  "hamburg|Luka Vušković (CB)": {
    "overall": 72,
    "nationality": "Croatia",
    "dorsal": 44,
    "age": 18,
    "fechaNacimiento": "2007-02-24",
    "source": "fc26"
  },
  "hamburg|Daniel Heuer Fernandes (GK)": {
    "overall": 74,
    "nationality": "Portugal",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1992-11-13",
    "source": "fc26"
  },
  "hamburg|Albert Sambi Lokonga (CM)": {
    "overall": 75,
    "nationality": "Belgium",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "1999-10-22",
    "source": "fc26"
  },
  "hamburg|Fábio Vieira (CM)": {
    "overall": 78,
    "nationality": "Portugal",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "2000-05-30",
    "source": "fc26"
  },
  "hamburg|Miro Muheim (LB)": {
    "overall": 75,
    "nationality": "Switzerland",
    "dorsal": 28,
    "age": 27,
    "fechaNacimiento": "1998-03-24",
    "source": "fc26"
  },
  "hamburg|Jean-Luc Dompé (LW)": {
    "overall": 75,
    "nationality": "France",
    "dorsal": 7,
    "age": 29,
    "fechaNacimiento": "1995-08-12",
    "source": "fc26"
  },
  "hamburg|Jordan Torunarigha (CB)": {
    "overall": 75,
    "nationality": "Nigeria",
    "dorsal": 25,
    "age": 27,
    "fechaNacimiento": "1997-08-07",
    "source": "fc26"
  },
  "hamburg|Albert Grønbæk (CAM)": {
    "overall": 74,
    "nationality": "Denmark",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2001-05-23",
    "source": "fc26"
  },
  "hamburg|Nicolai Remberg (CM)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-06-19",
    "source": "fc26"
  },
  "hamburg|Philip Otele (LM)": {
    "overall": 73,
    "nationality": "Nigeria",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1999-04-15",
    "source": "fc26"
  },
  "hamburg|Daniel Elfadli (CB)": {
    "overall": 72,
    "nationality": "Libya",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-04-06",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Mergim Berisha (ST)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 32,
    "age": 27,
    "fechaNacimiento": "1998-05-11",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Naatan Skyttä (CAM)": {
    "overall": 71,
    "nationality": "Finland",
    "dorsal": 15,
    "age": 23,
    "fechaNacimiento": "2002-05-07",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Luca Sirch (CB)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 31,
    "age": 26,
    "fechaNacimiento": "1999-06-14",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Paul Joly (RB)": {
    "overall": 72,
    "nationality": "France",
    "dorsal": 26,
    "age": 25,
    "fechaNacimiento": "2000-06-07",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Semih Sahin (CDM)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 25,
    "fechaNacimiento": "1999-12-22",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Julian Krahl (GK)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 25,
    "fechaNacimiento": "2000-01-22",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Fabian Kunze (CDM)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1998-06-14",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Marlon Ritter (CAM)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1994-10-15",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Jacob Rasmussen (CB)": {
    "overall": 71,
    "nationality": "Denmark",
    "dorsal": 2,
    "age": 28,
    "fechaNacimiento": "1997-05-28",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Daniel Hanslik (ST)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 19,
    "age": 28,
    "fechaNacimiento": "1996-10-06",
    "source": "fc26"
  },
  "1_fc_kaiserslautern|Ivan Prtajin (ST)": {
    "overall": 69,
    "nationality": "Croatia",
    "dorsal": 9,
    "age": 29,
    "fechaNacimiento": "1996-05-14",
    "source": "fc26"
  },
  "1_fc_nurnberg|Julian Justvan (CAM)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-04-02",
    "source": "fc26"
  },
  "1_fc_nurnberg|Finn Ole Becker (CM)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 25,
    "age": 25,
    "fechaNacimiento": "2000-06-08",
    "source": "fc26"
  },
  "1_fc_nurnberg|Luka Lochoshvili (CB)": {
    "overall": 69,
    "nationality": "Georgia",
    "dorsal": 24,
    "age": 27,
    "fechaNacimiento": "1998-05-29",
    "source": "fc26"
  },
  "1_fc_nurnberg|Rabby Nzingoula (CDM)": {
    "overall": 69,
    "nationality": "France",
    "dorsal": 41,
    "age": 19,
    "fechaNacimiento": "2005-11-25",
    "source": "fc26"
  },
  "1_fc_nurnberg|Jan Reichert (GK)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2001-06-28",
    "source": "fc26"
  },
  "1_fc_nurnberg|Fabio Gruber (CB)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 4,
    "age": 22,
    "fechaNacimiento": "2002-09-03",
    "source": "fc26"
  },
  "1_fc_nurnberg|Berkay Yilmaz (LB)": {
    "overall": 68,
    "nationality": "Türkiye",
    "dorsal": 21,
    "age": 20,
    "fechaNacimiento": "2005-02-25",
    "source": "fc26"
  },
  "1_fc_nurnberg|Adam Markhiev (CDM)": {
    "overall": 67,
    "nationality": "Finland",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2002-03-17",
    "source": "fc26"
  },
  "1_fc_nurnberg|Rafael Lubach (CM)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 18,
    "age": 20,
    "fechaNacimiento": "2005-01-11",
    "source": "fc26"
  },
  "1_fc_nurnberg|Mohamed Alì Zoma (ST)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 23,
    "age": 21,
    "fechaNacimiento": "2003-12-15",
    "source": "fc26"
  },
  "1_fc_nurnberg|Henri Koudossou (RB)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 25,
    "fechaNacimiento": "1999-09-03",
    "source": "fc26"
  },
  "eintracht_braunschweig|Ron-Thorben Hoffmann (GK)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 26,
    "fechaNacimiento": "1999-04-04",
    "source": "fc26"
  },
  "eintracht_braunschweig|Lino Tempelmann (CM)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 20,
    "age": 26,
    "fechaNacimiento": "1999-02-02",
    "source": "fc26"
  },
  "eintracht_braunschweig|Elhan Kastrati (GK)": {
    "overall": 69,
    "nationality": "Albania",
    "dorsal": 13,
    "age": 28,
    "fechaNacimiento": "1997-02-02",
    "source": "fc26"
  },
  "eintracht_braunschweig|Mehmet Can Aydın (RM)": {
    "overall": 66,
    "nationality": "Türkiye",
    "dorsal": 8,
    "age": 23,
    "fechaNacimiento": "2002-02-09",
    "source": "fc26"
  },
  "eintracht_braunschweig|Robin Heußer (CM)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 30,
    "age": 27,
    "fechaNacimiento": "1998-05-23",
    "source": "fc26"
  },
  "eintracht_braunschweig|Erencan Yardımcı (ST)": {
    "overall": 68,
    "nationality": "Türkiye",
    "dorsal": 9,
    "age": 23,
    "fechaNacimiento": "2002-02-04",
    "source": "fc26"
  },
  "eintracht_braunschweig|Frederik Jäkel (CB)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 5,
    "age": 24,
    "fechaNacimiento": "2001-03-07",
    "source": "fc26"
  },
  "eintracht_braunschweig|Kevin Ehlers (CB)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 21,
    "age": 24,
    "fechaNacimiento": "2001-01-23",
    "source": "fc26"
  },
  "eintracht_braunschweig|Lukas Frenkert (CB)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 29,
    "age": 24,
    "fechaNacimiento": "2000-07-19",
    "source": "fc26"
  },
  "eintracht_braunschweig|Max Marie (CM)": {
    "overall": 63,
    "nationality": "Germany",
    "dorsal": 15,
    "age": 20,
    "fechaNacimiento": "2004-10-02",
    "source": "fc26"
  },
  "eintracht_braunschweig|Leon Bell Bell (LB)": {
    "overall": 67,
    "nationality": "Cameroon",
    "dorsal": 19,
    "age": 28,
    "fechaNacimiento": "1996-09-06",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Florian Kastenmeier (GK)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 33,
    "age": 28,
    "fechaNacimiento": "1997-06-28",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Tim Oberdorf (CB)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 15,
    "age": 28,
    "fechaNacimiento": "1996-08-16",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Florent Muslija (CAM)": {
    "overall": 71,
    "nationality": "Kosovo",
    "dorsal": 24,
    "age": 26,
    "fechaNacimiento": "1998-07-06",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Jesper Daland (CB)": {
    "overall": 72,
    "nationality": "Norway",
    "dorsal": 2,
    "age": 25,
    "fechaNacimiento": "2000-01-06",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Cedric Itten (ST)": {
    "overall": 70,
    "nationality": "Switzerland",
    "dorsal": 13,
    "age": 28,
    "fechaNacimiento": "1996-12-27",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Marin Ljubičić (ST)": {
    "overall": 71,
    "nationality": "Croatia",
    "dorsal": 27,
    "age": 23,
    "fechaNacimiento": "2002-02-28",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Anouar El Azzouzi (CDM)": {
    "overall": 67,
    "nationality": "Morocco",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2001-05-29",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Matthias Zimmermann (RB)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 25,
    "age": 33,
    "fechaNacimiento": "1992-06-16",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Tim Breithaupt (CDM)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2002-02-07",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Emmanuel Iyoha (LM)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 19,
    "age": 27,
    "fechaNacimiento": "1997-10-11",
    "source": "fc26"
  },
  "fortuna_dusseldorf|Christopher Lenz (LB)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 3,
    "age": 30,
    "fechaNacimiento": "1994-09-22",
    "source": "fc26"
  },
  "hannover_96|Enzo Leopold (CM)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2000-07-23",
    "source": "fc26"
  },
  "hannover_96|Benjamin Källman (ST)": {
    "overall": 72,
    "nationality": "Finland",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1998-06-17",
    "source": "fc26"
  },
  "hannover_96|Boris Tomiak (CB)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 3,
    "age": 26,
    "fechaNacimiento": "1998-09-11",
    "source": "fc26"
  },
  "hannover_96|Maurice Neubauer (LB)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 33,
    "age": 29,
    "fechaNacimiento": "1996-04-29",
    "source": "fc26"
  },
  "hannover_96|Elias Saad (LW)": {
    "overall": 72,
    "nationality": "Tunisia",
    "dorsal": 26,
    "age": 25,
    "fechaNacimiento": "1999-12-27",
    "source": "fc26"
  },
  "hannover_96|Noah Weißhaupt (LM)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 99,
    "age": 23,
    "fechaNacimiento": "2001-09-20",
    "source": "fc26"
  },
  "hannover_96|Virgil Ghiță (CB)": {
    "overall": 70,
    "nationality": "Romania",
    "dorsal": 5,
    "age": 27,
    "fechaNacimiento": "1998-06-04",
    "source": "fc26"
  },
  "hannover_96|Noël Aséko (CDM)": {
    "overall": 62,
    "nationality": "Germany",
    "dorsal": 15,
    "age": 19,
    "fechaNacimiento": "2005-11-22",
    "source": "fc26"
  },
  "hannover_96|Daisuke Yokota (RW)": {
    "overall": 70,
    "nationality": "Japan",
    "dorsal": 18,
    "age": 25,
    "fechaNacimiento": "2000-06-15",
    "source": "fc26"
  },
  "hannover_96|Maik Nawrocki (CB)": {
    "overall": 69,
    "nationality": "Poland",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2001-02-07",
    "source": "fc26"
  },
  "hannover_96|Mustapha Bundu (RW)": {
    "overall": 69,
    "nationality": "Sierra Leone",
    "dorsal": 7,
    "age": 28,
    "fechaNacimiento": "1997-02-28",
    "source": "fc26"
  },
  "hertha_bsc|Fabian Reese (LM)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1997-11-29",
    "source": "fc26"
  },
  "hertha_bsc|Josip Brekalo (LM)": {
    "overall": 75,
    "nationality": "Croatia",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1998-06-23",
    "source": "fc26"
  },
  "hertha_bsc|Michaël Cuisance (CM)": {
    "overall": 72,
    "nationality": "France",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "1999-08-16",
    "source": "fc26"
  },
  "hertha_bsc|Tjark Ernst (GK)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 22,
    "fechaNacimiento": "2003-03-15",
    "source": "fc26"
  },
  "hertha_bsc|Paul Seguin (CDM)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 30,
    "age": 30,
    "fechaNacimiento": "1995-03-29",
    "source": "fc26"
  },
  "hertha_bsc|Dawid Kownacki (ST)": {
    "overall": 72,
    "nationality": "Poland",
    "dorsal": 9,
    "age": 28,
    "fechaNacimiento": "1997-03-14",
    "source": "fc26"
  },
  "hertha_bsc|Toni Leistner (CB)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 37,
    "age": 34,
    "fechaNacimiento": "1990-08-19",
    "source": "fc26"
  },
  "hertha_bsc|Márton Dárdai (CB)": {
    "overall": 70,
    "nationality": "Hungary",
    "dorsal": 31,
    "age": 23,
    "fechaNacimiento": "2002-02-12",
    "source": "fc26"
  },
  "hertha_bsc|Michał Karbownik (LB)": {
    "overall": 70,
    "nationality": "Poland",
    "dorsal": 33,
    "age": 24,
    "fechaNacimiento": "2001-03-13",
    "source": "fc26"
  },
  "hertha_bsc|Diego Demme (CDM)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 33,
    "fechaNacimiento": "1991-11-21",
    "source": "fc26"
  },
  "hertha_bsc|Linus Gechter (CB)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 44,
    "age": 21,
    "fechaNacimiento": "2004-02-27",
    "source": "fc26"
  },
  "karlsruher_sc|Marvin Wanitzek (CM)": {
    "overall": 76,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 32,
    "fechaNacimiento": "1993-05-07",
    "source": "fc26"
  },
  "karlsruher_sc|Marcel Franke (CB)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 28,
    "age": 32,
    "fechaNacimiento": "1993-04-05",
    "source": "fc26"
  },
  "karlsruher_sc|Sebastian Jung (RB)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 2,
    "age": 35,
    "fechaNacimiento": "1990-06-22",
    "source": "fc26"
  },
  "karlsruher_sc|David Herold (LB)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 20,
    "age": 22,
    "fechaNacimiento": "2003-02-20",
    "source": "fc26"
  },
  "karlsruher_sc|Fabian Schleusener (ST)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 24,
    "age": 33,
    "fechaNacimiento": "1991-10-24",
    "source": "fc26"
  },
  "karlsruher_sc|Christoph Kobald (CB)": {
    "overall": 68,
    "nationality": "Austria",
    "dorsal": 22,
    "age": 27,
    "fechaNacimiento": "1997-08-18",
    "source": "fc26"
  },
  "karlsruher_sc|Dženis Burnić (CM)": {
    "overall": 68,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1998-05-22",
    "source": "fc26"
  },
  "karlsruher_sc|Nicolai Rapp (CB)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1996-12-13",
    "source": "fc26"
  },
  "karlsruher_sc|Marcel Beifus (CB)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 4,
    "age": 22,
    "fechaNacimiento": "2002-10-27",
    "source": "fc26"
  },
  "karlsruher_sc|Hans Christian Bernat (GK)": {
    "overall": 65,
    "nationality": "Denmark",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2000-11-13",
    "source": "fc26"
  },
  "karlsruher_sc|Stephan Ambrosius (CB)": {
    "overall": 68,
    "nationality": "Ghana",
    "dorsal": 5,
    "age": 26,
    "fechaNacimiento": "1998-12-18",
    "source": "fc26"
  },
  "preussen_munster|Johannes Schenk (GK)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 22,
    "fechaNacimiento": "2003-01-13",
    "source": "fc26"
  },
  "preussen_munster|Jorrit Hendrix (CDM)": {
    "overall": 72,
    "nationality": "Netherlands",
    "dorsal": 20,
    "age": 30,
    "fechaNacimiento": "1995-02-06",
    "source": "fc26"
  },
  "preussen_munster|Oliver Batista Meier (CAM)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 17,
    "age": 24,
    "fechaNacimiento": "2001-02-16",
    "source": "fc26"
  },
  "preussen_munster|Paul Jaeckel (CB)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 3,
    "age": 26,
    "fechaNacimiento": "1998-07-22",
    "source": "fc26"
  },
  "preussen_munster|Joshua Mees (CAM)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1996-04-15",
    "source": "fc26"
  },
  "preussen_munster|Shin Yamada (ST)": {
    "overall": 69,
    "nationality": "Japan",
    "dorsal": 18,
    "age": 25,
    "fechaNacimiento": "2000-05-30",
    "source": "fc26"
  },
  "preussen_munster|Jano ter Horst (RB)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 27,
    "age": 23,
    "fechaNacimiento": "2002-06-19",
    "source": "fc26"
  },
  "preussen_munster|Jannis Heuer (CB)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 22,
    "age": 25,
    "fechaNacimiento": "1999-07-29",
    "source": "fc26"
  },
  "preussen_munster|Marcel Benger (CDM)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 26,
    "fechaNacimiento": "1998-07-02",
    "source": "fc26"
  },
  "preussen_munster|Marvin Schulz (CM)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1995-01-15",
    "source": "fc26"
  },
  "preussen_munster|Rico Preißinger (CDM)": {
    "overall": 66,
    "nationality": "Germany",
    "dorsal": 21,
    "age": 28,
    "fechaNacimiento": "1996-07-21",
    "source": "fc26"
  },
  "schalke_04|Edin Džeko (ST)": {
    "overall": 81,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 9,
    "age": 39,
    "fechaNacimiento": "1986-03-17",
    "source": "fc26"
  },
  "schalke_04|Moussa N'Diaye (LB)": {
    "overall": 72,
    "nationality": "Senegal",
    "dorsal": 5,
    "age": 23,
    "fechaNacimiento": "2002-06-18",
    "source": "fc26"
  },
  "schalke_04|Dejan Ljubičić (CM)": {
    "overall": 73,
    "nationality": "Austria",
    "dorsal": 77,
    "age": 27,
    "fechaNacimiento": "1997-10-08",
    "source": "fc26"
  },
  "schalke_04|Kenan Karaman (CAM)": {
    "overall": 73,
    "nationality": "Türkiye",
    "dorsal": 19,
    "age": 31,
    "fechaNacimiento": "1994-03-05",
    "source": "fc26"
  },
  "schalke_04|Loris Karius (GK)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1993-06-22",
    "source": "fc26"
  },
  "schalke_04|Nikola Katić (CB)": {
    "overall": 69,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 25,
    "age": 28,
    "fechaNacimiento": "1996-10-10",
    "source": "fc26"
  },
  "schalke_04|Moussa Sylla (ST)": {
    "overall": 73,
    "nationality": "Mali",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "1999-11-25",
    "source": "fc26"
  },
  "schalke_04|Kevin Müller (GK)": {
    "overall": 74,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 34,
    "fechaNacimiento": "1991-03-15",
    "source": "fc26"
  },
  "schalke_04|Timo Becker (CB)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-03-25",
    "source": "fc26"
  },
  "schalke_04|Hasan Kuruçay (CB)": {
    "overall": 70,
    "nationality": "Türkiye",
    "dorsal": 4,
    "age": 27,
    "fechaNacimiento": "1997-08-31",
    "source": "fc26"
  },
  "schalke_04|Ron Schallenberg (CDM)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 26,
    "fechaNacimiento": "1998-10-06",
    "source": "fc26"
  },
  "sc_paderborn_07|Felix Götze (CB)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-02-11",
    "source": "fc26"
  },
  "sc_paderborn_07|Raphael Obermair (RM)": {
    "overall": 72,
    "nationality": "Philippines",
    "dorsal": 23,
    "age": 29,
    "fechaNacimiento": "1996-04-01",
    "source": "fc26"
  },
  "sc_paderborn_07|Filip Bilbija (CAM)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "2000-04-24",
    "source": "fc26"
  },
  "sc_paderborn_07|Calvin Brackelmann (CB)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "1999-08-22",
    "source": "fc26"
  },
  "sc_paderborn_07|Dennis Seimen (GK)": {
    "overall": 66,
    "nationality": "Germany",
    "dorsal": 41,
    "age": 19,
    "fechaNacimiento": "2005-12-01",
    "source": "fc26"
  },
  "sc_paderborn_07|Tjark Scheller (CB)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 25,
    "age": 23,
    "fechaNacimiento": "2002-01-12",
    "source": "fc26"
  },
  "sc_paderborn_07|Laurin Curda (RM)": {
    "overall": 66,
    "nationality": "Germany",
    "dorsal": 17,
    "age": 23,
    "fechaNacimiento": "2001-10-30",
    "source": "fc26"
  },
  "sc_paderborn_07|Santiago Castañeda (CDM)": {
    "overall": 68,
    "nationality": "United States",
    "dorsal": 5,
    "age": 20,
    "fechaNacimiento": "2004-11-01",
    "source": "fc26"
  },
  "sc_paderborn_07|Mika Baur (CM)": {
    "overall": 64,
    "nationality": "Germany",
    "dorsal": 14,
    "age": 20,
    "fechaNacimiento": "2004-07-09",
    "source": "fc26"
  },
  "sc_paderborn_07|Steffen Tigges (ST)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 27,
    "age": 26,
    "fechaNacimiento": "1998-07-31",
    "source": "fc26"
  },
  "sc_paderborn_07|Sebastian Klaas (CM)": {
    "overall": 66,
    "nationality": "Germany",
    "dorsal": 26,
    "age": 27,
    "fechaNacimiento": "1998-06-30",
    "source": "fc26"
  },
  "sv_elversberg|Nicolas Kristof (GK)": {
    "overall": 71,
    "nationality": "Austria",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "1999-12-20",
    "source": "fc26"
  },
  "sv_elversberg|Lukas Petkov (RM)": {
    "overall": 70,
    "nationality": "Bulgaria",
    "dorsal": 25,
    "age": 24,
    "fechaNacimiento": "2000-11-01",
    "source": "fc26"
  },
  "sv_elversberg|Lukas Pinckert (CB)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "2000-01-22",
    "source": "fc26"
  },
  "sv_elversberg|Maximilian Rohr (CB)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 31,
    "age": 30,
    "fechaNacimiento": "1995-06-27",
    "source": "fc26"
  },
  "sv_elversberg|Tom Zimmerschied (LM)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 29,
    "age": 26,
    "fechaNacimiento": "1998-09-22",
    "source": "fc26"
  },
  "sv_elversberg|Łukasz Poręba (CDM)": {
    "overall": 68,
    "nationality": "Poland",
    "dorsal": 8,
    "age": 25,
    "fechaNacimiento": "2000-03-13",
    "source": "fc26"
  },
  "sv_elversberg|Immanuel Pherai (CAM)": {
    "overall": 69,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "sv_elversberg|Florian Le Joncour (CB)": {
    "overall": 69,
    "nationality": "France",
    "dorsal": 3,
    "age": 30,
    "fechaNacimiento": "1995-02-03",
    "source": "fc26"
  },
  "sv_elversberg|Bambasé Conté (CAM)": {
    "overall": 66,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 21,
    "fechaNacimiento": "2003-07-07",
    "source": "fc26"
  },
  "sv_elversberg|Jan Gyamerah (RB)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 30,
    "age": 30,
    "fechaNacimiento": "1995-06-18",
    "source": "fc26"
  },
  "sv_elversberg|Lasse Günther (LB)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 21,
    "age": 22,
    "fechaNacimiento": "2003-03-21",
    "source": "fc26"
  },
  "holstein_kiel|Alexander Bernhardsson (RM)": {
    "overall": 72,
    "nationality": "Sweden",
    "dorsal": 11,
    "age": 26,
    "fechaNacimiento": "1998-09-08",
    "source": "fc26"
  },
  "holstein_kiel|David Zec (CB)": {
    "overall": 71,
    "nationality": "Slovenia",
    "dorsal": 26,
    "age": 25,
    "fechaNacimiento": "2000-01-05",
    "source": "fc26"
  },
  "holstein_kiel|Jonas Meffert (CDM)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 23,
    "age": 30,
    "fechaNacimiento": "1994-09-04",
    "source": "fc26"
  },
  "holstein_kiel|Umut Tohumcu (CAM)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 17,
    "age": 20,
    "fechaNacimiento": "2004-08-11",
    "source": "fc26"
  },
  "holstein_kiel|John Tolkin (LB)": {
    "overall": 71,
    "nationality": "United States",
    "dorsal": 47,
    "age": 22,
    "fechaNacimiento": "2002-07-31",
    "source": "fc26"
  },
  "holstein_kiel|Steven Skrzybski (ST)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 7,
    "age": 32,
    "fechaNacimiento": "1992-11-18",
    "source": "fc26"
  },
  "holstein_kiel|Stefan Schwab (CM)": {
    "overall": 73,
    "nationality": "Austria",
    "dorsal": 22,
    "age": 34,
    "fechaNacimiento": "1990-09-27",
    "source": "fc26"
  },
  "holstein_kiel|Carl Johansson (CB)": {
    "overall": 68,
    "nationality": "Sweden",
    "dorsal": 5,
    "age": 31,
    "fechaNacimiento": "1994-05-23",
    "source": "fc26"
  },
  "holstein_kiel|Marco Komenda (CB)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1996-11-26",
    "source": "fc26"
  },
  "holstein_kiel|Marko Ivezić (CB)": {
    "overall": 68,
    "nationality": "Serbia",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2001-12-02",
    "source": "fc26"
  },
  "holstein_kiel|Jonas Therkelsen (CAM)": {
    "overall": 66,
    "nationality": "Norway",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2003-05-05",
    "source": "fc26"
  },
  "vfl_bochum|Timo Horn (GK)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1993-05-12",
    "source": "fc26"
  },
  "vfl_bochum|Kevin Vogt (CB)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 7,
    "age": 33,
    "fechaNacimiento": "1991-09-23",
    "source": "fc26"
  },
  "vfl_bochum|Maximilian Wittek (LB)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 32,
    "age": 29,
    "fechaNacimiento": "1995-08-21",
    "source": "fc26"
  },
  "vfl_bochum|Matúš Bero (CM)": {
    "overall": 74,
    "nationality": "Slovakia",
    "dorsal": 19,
    "age": 29,
    "fechaNacimiento": "1995-09-06",
    "source": "fc26"
  },
  "vfl_bochum|Philipp Hofmann (ST)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 33,
    "age": 32,
    "fechaNacimiento": "1993-03-30",
    "source": "fc26"
  },
  "vfl_bochum|Oliver Olsen (RB)": {
    "overall": 69,
    "nationality": "Denmark",
    "dorsal": 27,
    "age": 24,
    "fechaNacimiento": "2000-08-13",
    "source": "fc26"
  },
  "vfl_bochum|Gerrit Holtmann (LM)": {
    "overall": 70,
    "nationality": "Philippines",
    "dorsal": 17,
    "age": 30,
    "fechaNacimiento": "1995-03-25",
    "source": "fc26"
  },
  "vfl_bochum|Ibrahim Sissoko (ST)": {
    "overall": 72,
    "nationality": "Mali",
    "dorsal": 9,
    "age": 29,
    "fechaNacimiento": "1995-11-27",
    "source": "fc26"
  },
  "vfl_bochum|Philipp Strompf (CB)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 3,
    "age": 27,
    "fechaNacimiento": "1998-04-23",
    "source": "fc26"
  },
  "vfl_bochum|Koji Miyoshi (RM)": {
    "overall": 68,
    "nationality": "Japan",
    "dorsal": 23,
    "age": 28,
    "fechaNacimiento": "1997-03-26",
    "source": "fc26"
  },
  "vfl_bochum|Marcel Sobottka (CDM)": {
    "overall": 69,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "arminia_bielefeld|Marvin Mehlem (CM)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1997-09-11",
    "source": "fc26"
  },
  "arminia_bielefeld|Maximilian Bauer (CB)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "2000-02-09",
    "source": "fc26"
  },
  "arminia_bielefeld|Robin Knoche (CB)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 31,
    "age": 33,
    "fechaNacimiento": "1992-05-22",
    "source": "fc26"
  },
  "arminia_bielefeld|Mael Corboz (CM)": {
    "overall": 68,
    "nationality": "United States",
    "dorsal": 6,
    "age": 30,
    "fechaNacimiento": "1994-09-06",
    "source": "fc26"
  },
  "arminia_bielefeld|Stefano Russo (CDM)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-06-29",
    "source": "fc26"
  },
  "arminia_bielefeld|Jonas Kersken (GK)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2000-09-01",
    "source": "fc26"
  },
  "arminia_bielefeld|Tim Handwerker (LB)": {
    "overall": 68,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "arminia_bielefeld|Thaddäus-Monju Momuluh (RM)": {
    "overall": 66,
    "nationality": "Germany",
    "dorsal": 14,
    "age": 23,
    "fechaNacimiento": "2002-02-18",
    "source": "fc26"
  },
  "arminia_bielefeld|Marius Wörl (CM)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 38,
    "age": 21,
    "fechaNacimiento": "2004-04-05",
    "source": "fc26"
  },
  "arminia_bielefeld|Joel Grodowski (ST)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1997-11-30",
    "source": "fc26"
  },
  "arminia_bielefeld|Noah Joel Sarenren Bazee (RW)": {
    "overall": 68,
    "nationality": "Nigeria",
    "dorsal": 37,
    "age": 28,
    "fechaNacimiento": "1996-08-21",
    "source": "fc26"
  },
  "dynamo_dresden|Niklas Hauptmann (CM)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 27,
    "age": 29,
    "fechaNacimiento": "1996-06-27",
    "source": "fc26"
  },
  "dynamo_dresden|Christoph Daferner (ST)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 33,
    "age": 27,
    "fechaNacimiento": "1998-01-12",
    "source": "fc26"
  },
  "dynamo_dresden|Elias Bethke (GK)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 12,
    "age": 22,
    "fechaNacimiento": "2003-03-21",
    "source": "fc26"
  },
  "dynamo_dresden|Tim Schreiber (GK)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 23,
    "fechaNacimiento": "2002-04-24",
    "source": "fc26"
  },
  "dynamo_dresden|Thomas Keller (CB)": {
    "overall": 67,
    "nationality": "Germany",
    "dorsal": 27,
    "age": 25,
    "fechaNacimiento": "1999-08-05",
    "source": "fc26"
  },
  "dynamo_dresden|Alexander Rossipal (LB)": {
    "overall": 66,
    "nationality": "Germany",
    "dorsal": 19,
    "age": 29,
    "fechaNacimiento": "1996-06-06",
    "source": "fc26"
  },
  "dynamo_dresden|Robert Wagner (CM)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 39,
    "age": 21,
    "fechaNacimiento": "2003-07-14",
    "source": "fc26"
  },
  "dynamo_dresden|Jakob Lemmer (RW)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-04-26",
    "source": "fc26"
  },
  "dynamo_dresden|Vinko Šapina (CDM)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 5,
    "age": 30,
    "fechaNacimiento": "1995-06-29",
    "source": "fc26"
  },
  "dynamo_dresden|Jonas Sterner (RB)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 32,
    "age": 23,
    "fechaNacimiento": "2002-05-13",
    "source": "fc26"
  },
  "dynamo_dresden|Vincent Vermeij (ST)": {
    "overall": 67,
    "nationality": "Netherlands",
    "dorsal": 9,
    "age": 30,
    "fechaNacimiento": "1994-08-09",
    "source": "fc26"
  },
  "arsenal|Gabriel (CB)": {
    "overall": 88,
    "nationality": "Brazil",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1997-12-19",
    "source": "fc26"
  },
  "arsenal|William Saliba (CB)": {
    "overall": 87,
    "nationality": "France",
    "dorsal": 2,
    "age": 24,
    "fechaNacimiento": "2001-03-24",
    "source": "fc26"
  },
  "arsenal|Declan Rice (CDM)": {
    "overall": 87,
    "nationality": "England",
    "dorsal": 41,
    "age": 26,
    "fechaNacimiento": "1999-01-14",
    "source": "fc26"
  },
  "arsenal|David Raya (GK)": {
    "overall": 87,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 29,
    "fechaNacimiento": "1995-09-15",
    "source": "fc26"
  },
  "arsenal|Bukayo Saka (RW)": {
    "overall": 88,
    "nationality": "England",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2001-09-05",
    "source": "fc26"
  },
  "arsenal|Viktor Gyökeres (ST)": {
    "overall": 87,
    "nationality": "Sweden",
    "dorsal": 14,
    "age": 27,
    "fechaNacimiento": "1998-06-04",
    "source": "fc26"
  },
  "arsenal|Martin Ødegaard (CM)": {
    "overall": 87,
    "nationality": "Norway",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1998-12-17",
    "source": "fc26"
  },
  "arsenal|Zubimendi (CDM)": {
    "overall": 83,
    "nationality": "Spain",
    "dorsal": 36,
    "age": 26,
    "fechaNacimiento": "1999-02-02",
    "source": "fc26"
  },
  "arsenal|Jurriën Timber (RB)": {
    "overall": 82,
    "nationality": "Netherlands",
    "dorsal": 12,
    "age": 24,
    "fechaNacimiento": "2001-06-17",
    "source": "fc26"
  },
  "arsenal|Eberechi Eze (CAM)": {
    "overall": 83,
    "nationality": "England",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-06-29",
    "source": "fc26"
  },
  "arsenal|Piero Hincapié (CB)": {
    "overall": 83,
    "nationality": "Ecuador",
    "dorsal": 5,
    "age": 23,
    "fechaNacimiento": "2002-01-09",
    "source": "fc26"
  },
  "chelsea|Moisés Caicedo (CDM)": {
    "overall": 87,
    "nationality": "Ecuador",
    "dorsal": 25,
    "age": 23,
    "fechaNacimiento": "2001-11-02",
    "source": "fc26"
  },
  "chelsea|Cole Palmer (CAM)": {
    "overall": 87,
    "nationality": "England",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2002-05-06",
    "source": "fc26"
  },
  "chelsea|Marc Cucurella (LB)": {
    "overall": 84,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 26,
    "fechaNacimiento": "1998-07-22",
    "source": "fc26"
  },
  "chelsea|Enzo Fernández (CM)": {
    "overall": 84,
    "nationality": "Argentina",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2001-01-17",
    "source": "fc26"
  },
  "chelsea|Reece James (RB)": {
    "overall": 81,
    "nationality": "England",
    "dorsal": 24,
    "age": 25,
    "fechaNacimiento": "1999-12-08",
    "source": "fc26"
  },
  "chelsea|Pedro Neto (RM)": {
    "overall": 80,
    "nationality": "Portugal",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "2000-03-09",
    "source": "fc26"
  },
  "chelsea|Robert Sánchez (GK)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 27,
    "fechaNacimiento": "1997-11-18",
    "source": "fc26"
  },
  "chelsea|João Pedro (ST)": {
    "overall": 79,
    "nationality": "Brazil",
    "dorsal": 20,
    "age": 23,
    "fechaNacimiento": "2001-09-26",
    "source": "fc26"
  },
  "chelsea|Trevoh Chalobah (CB)": {
    "overall": 79,
    "nationality": "England",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "1999-07-05",
    "source": "fc26"
  },
  "chelsea|Andrey Santos (CM)": {
    "overall": 80,
    "nationality": "Brazil",
    "dorsal": 17,
    "age": 21,
    "fechaNacimiento": "2004-05-03",
    "source": "fc26"
  },
  "chelsea|Levi Colwill (CB)": {
    "overall": 80,
    "nationality": "England",
    "dorsal": 6,
    "age": 22,
    "fechaNacimiento": "2003-02-26",
    "source": "fc26"
  },
  "liverpool_eng|Mohamed Salah (RM)": {
    "overall": 91,
    "nationality": "Egypt",
    "dorsal": 11,
    "age": 33,
    "fechaNacimiento": "1992-06-15",
    "source": "fc26"
  },
  "liverpool_eng|Alisson (GK)": {
    "overall": 89,
    "nationality": "Brazil",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1992-10-02",
    "source": "fc26"
  },
  "liverpool_eng|Virgil van Dijk (CB)": {
    "overall": 90,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 33,
    "fechaNacimiento": "1991-07-08",
    "source": "fc26"
  },
  "liverpool_eng|Florian Wirtz (CAM)": {
    "overall": 89,
    "nationality": "Germany",
    "dorsal": 7,
    "age": 22,
    "fechaNacimiento": "2003-05-03",
    "source": "fc26"
  },
  "liverpool_eng|Alexander Isak (ST)": {
    "overall": 88,
    "nationality": "Sweden",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "1999-09-21",
    "source": "fc26"
  },
  "liverpool_eng|Dominik Szoboszlai (CAM)": {
    "overall": 83,
    "nationality": "Hungary",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2000-10-25",
    "source": "fc26"
  },
  "liverpool_eng|Ryan Gravenberch (CDM)": {
    "overall": 85,
    "nationality": "Netherlands",
    "dorsal": 38,
    "age": 23,
    "fechaNacimiento": "2002-05-16",
    "source": "fc26"
  },
  "liverpool_eng|Alexis Mac Allister (CM)": {
    "overall": 87,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1998-12-24",
    "source": "fc26"
  },
  "liverpool_eng|Ibrahima Konaté (CB)": {
    "overall": 86,
    "nationality": "France",
    "dorsal": 5,
    "age": 26,
    "fechaNacimiento": "1999-05-25",
    "source": "fc26"
  },
  "liverpool_eng|Hugo Ekitiké (ST)": {
    "overall": 83,
    "nationality": "France",
    "dorsal": 22,
    "age": 23,
    "fechaNacimiento": "2002-06-20",
    "source": "fc26"
  },
  "liverpool_eng|Cody Gakpo (LM)": {
    "overall": 84,
    "nationality": "Netherlands",
    "dorsal": 18,
    "age": 26,
    "fechaNacimiento": "1999-05-07",
    "source": "fc26"
  },
  "manchester_city|Erling Haaland (ST)": {
    "overall": 90,
    "nationality": "Norway",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-07-21",
    "source": "fc26"
  },
  "manchester_city|Gianluigi Donnarumma (GK)": {
    "overall": 89,
    "nationality": "Italy",
    "dorsal": 25,
    "age": 26,
    "fechaNacimiento": "1999-02-25",
    "source": "fc26"
  },
  "manchester_city|Rodri (CDM)": {
    "overall": 90,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 29,
    "fechaNacimiento": "1996-06-22",
    "source": "fc26"
  },
  "manchester_city|Rúben Dias (CB)": {
    "overall": 86,
    "nationality": "Portugal",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1997-05-14",
    "source": "fc26"
  },
  "manchester_city|Phil Foden (CAM)": {
    "overall": 85,
    "dorsal": 47,
    "source": "latamfc26"
  },
  "manchester_city|Tijjani Reijnders (CM)": {
    "overall": 86,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1998-07-29",
    "source": "fc26"
  },
  "manchester_city|Joško Gvardiol (CB)": {
    "overall": 84,
    "nationality": "Croatia",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2002-01-23",
    "source": "fc26"
  },
  "manchester_city|Marc Guéhi (CB)": {
    "overall": 84,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "manchester_city|Antoine Semenyo (RW)": {
    "overall": 80,
    "nationality": "Ghana",
    "dorsal": 24,
    "age": 25,
    "fechaNacimiento": "2000-01-07",
    "source": "fc26"
  },
  "manchester_city|Bernardo Silva (CM)": {
    "overall": 84,
    "nationality": "Portugal",
    "dorsal": 20,
    "age": 30,
    "fechaNacimiento": "1994-08-10",
    "source": "fc26"
  },
  "manchester_city|Rayan Cherki (RW)": {
    "overall": 83,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "manchester_united|Bruno Fernandes (CAM)": {
    "overall": 87,
    "nationality": "Portugal",
    "dorsal": 8,
    "age": 30,
    "fechaNacimiento": "1994-09-08",
    "source": "fc26"
  },
  "manchester_united|Bryan Mbeumo (RW)": {
    "overall": 85,
    "nationality": "Cameroon",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "1999-08-07",
    "source": "fc26"
  },
  "manchester_united|Matheus Cunha (CAM)": {
    "overall": 83,
    "nationality": "Brazil",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1999-05-27",
    "source": "fc26"
  },
  "manchester_united|Casemiro (CDM)": {
    "overall": 80,
    "nationality": "Brazil",
    "dorsal": 18,
    "age": 33,
    "fechaNacimiento": "1992-02-23",
    "source": "fc26"
  },
  "manchester_united|Matthijs de Ligt (CB)": {
    "overall": 82,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "1999-08-12",
    "source": "fc26"
  },
  "manchester_united|Harry Maguire (CB)": {
    "overall": 81,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "manchester_united|Lisandro Martínez (CB)": {
    "overall": 81,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1998-01-18",
    "source": "fc26"
  },
  "manchester_united|Senne Lammens (GK)": {
    "overall": 78,
    "nationality": "Belgium",
    "dorsal": 31,
    "age": 22,
    "fechaNacimiento": "2002-07-07",
    "source": "fc26"
  },
  "manchester_united|Amad (RM)": {
    "overall": 79,
    "nationality": "Côte d'Ivoire",
    "dorsal": 16,
    "age": 22,
    "fechaNacimiento": "2002-07-11",
    "source": "fc26"
  },
  "manchester_united|Noussair Mazraoui (RB)": {
    "overall": 80,
    "nationality": "Morocco",
    "dorsal": 3,
    "age": 27,
    "fechaNacimiento": "1997-11-14",
    "source": "fc26"
  },
  "manchester_united|Benjamin Šeško (ST)": {
    "overall": 80,
    "nationality": "Slovenia",
    "dorsal": 30,
    "age": 22,
    "fechaNacimiento": "2003-05-31",
    "source": "fc26"
  },
  "tottenham_hotspur|Cristian Romero (CB)": {
    "overall": 82,
    "nationality": "Argentina",
    "dorsal": 17,
    "age": 27,
    "fechaNacimiento": "1998-04-27",
    "source": "fc26"
  },
  "tottenham_hotspur|Micky van de Ven (CB)": {
    "overall": 82,
    "nationality": "Netherlands",
    "dorsal": 37,
    "age": 24,
    "fechaNacimiento": "2001-04-19",
    "source": "fc26"
  },
  "tottenham_hotspur|Palhinha (CDM)": {
    "overall": 83,
    "nationality": "Portugal",
    "dorsal": 6,
    "age": 29,
    "fechaNacimiento": "1995-07-09",
    "source": "fc26"
  },
  "tottenham_hotspur|James Maddison (CM)": {
    "overall": 84,
    "nationality": "England",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1996-11-23",
    "source": "fc26"
  },
  "tottenham_hotspur|Dejan Kulusevski (CM)": {
    "overall": 83,
    "nationality": "Sweden",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-04-25",
    "source": "fc26"
  },
  "tottenham_hotspur|Guglielmo Vicario (GK)": {
    "overall": 82,
    "nationality": "Italy",
    "dorsal": 1,
    "age": 28,
    "fechaNacimiento": "1996-10-07",
    "source": "fc26"
  },
  "tottenham_hotspur|Pedro Porro (RB)": {
    "overall": 82,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "1999-09-13",
    "source": "fc26"
  },
  "tottenham_hotspur|Xavi Simons (CAM)": {
    "overall": 82,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "tottenham_hotspur|Mohammed Kudus (RW)": {
    "overall": 80,
    "nationality": "Ghana",
    "dorsal": 20,
    "age": 24,
    "fechaNacimiento": "2000-08-02",
    "source": "fc26"
  },
  "tottenham_hotspur|Conor Gallagher (CM)": {
    "overall": 81,
    "nationality": "England",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "2000-02-06",
    "source": "fc26"
  },
  "tottenham_hotspur|Dominic Solanke (ST)": {
    "overall": 80,
    "nationality": "England",
    "dorsal": 19,
    "age": 27,
    "fechaNacimiento": "1997-09-14",
    "source": "fc26"
  },
  "newcastle_united|Bruno Guimarães (CM)": {
    "overall": 86,
    "nationality": "Brazil",
    "dorsal": 39,
    "age": 27,
    "fechaNacimiento": "1997-11-16",
    "source": "fc26"
  },
  "newcastle_united|Sandro Tonali (CDM)": {
    "overall": 86,
    "nationality": "Italy",
    "dorsal": 8,
    "age": 25,
    "fechaNacimiento": "2000-05-08",
    "source": "fc26"
  },
  "newcastle_united|Anthony Gordon (LW)": {
    "overall": 83,
    "nationality": "England",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2001-02-24",
    "source": "fc26"
  },
  "newcastle_united|Sven Botman (CB)": {
    "overall": 82,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "2000-01-12",
    "source": "fc26"
  },
  "newcastle_united|Yoane Wissa (ST)": {
    "overall": 82,
    "nationality": "Congo DR",
    "dorsal": 9,
    "age": 28,
    "fechaNacimiento": "1996-09-03",
    "source": "fc26"
  },
  "newcastle_united|Fabian Schär (CB)": {
    "overall": 82,
    "nationality": "Switzerland",
    "dorsal": 5,
    "age": 33,
    "fechaNacimiento": "1991-12-20",
    "source": "fc26"
  },
  "newcastle_united|Malick Thiaw (CB)": {
    "overall": 78,
    "nationality": "Germany",
    "dorsal": 12,
    "age": 23,
    "fechaNacimiento": "2001-08-08",
    "source": "fc26"
  },
  "newcastle_united|Lewis Hall (LB)": {
    "overall": 80,
    "nationality": "England",
    "dorsal": 3,
    "age": 20,
    "fechaNacimiento": "2004-09-08",
    "source": "fc26"
  },
  "newcastle_united|Joelinton (CM)": {
    "overall": 82,
    "nationality": "Brazil",
    "dorsal": 7,
    "age": 28,
    "fechaNacimiento": "1996-08-14",
    "source": "fc26"
  },
  "newcastle_united|Nick Pope (GK)": {
    "overall": 80,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "newcastle_united|Dan Burn (CB)": {
    "overall": 80,
    "dorsal": 33,
    "source": "latamfc26"
  },
  "aston_villa|Emiliano Martínez (GK)": {
    "overall": 85,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "aston_villa|Youri Tielemans (CM)": {
    "overall": 85,
    "nationality": "Belgium",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-05-07",
    "source": "fc26"
  },
  "aston_villa|Ezri Konsa (CB)": {
    "overall": 82,
    "nationality": "England",
    "dorsal": 4,
    "age": 27,
    "fechaNacimiento": "1997-10-23",
    "source": "fc26"
  },
  "aston_villa|Morgan Rogers (CAM)": {
    "overall": 82,
    "nationality": "England",
    "dorsal": 27,
    "age": 22,
    "fechaNacimiento": "2002-07-26",
    "source": "fc26"
  },
  "aston_villa|Boubacar Kamara (CDM)": {
    "overall": 83,
    "nationality": "France",
    "dorsal": 44,
    "age": 25,
    "fechaNacimiento": "1999-11-23",
    "source": "fc26"
  },
  "aston_villa|Ollie Watkins (ST)": {
    "overall": 82,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "aston_villa|Matty Cash (RB)": {
    "overall": 81,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "aston_villa|Amadou Onana (CDM)": {
    "overall": 79,
    "nationality": "Belgium",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2001-08-16",
    "source": "fc26"
  },
  "aston_villa|John McGinn (RM)": {
    "overall": 81,
    "nationality": "Scotland",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1994-10-18",
    "source": "fc26"
  },
  "aston_villa|Pau Torres (CB)": {
    "overall": 80,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 28,
    "fechaNacimiento": "1997-01-16",
    "source": "fc26"
  },
  "aston_villa|Lucas Digne (LB)": {
    "overall": 80,
    "nationality": "France",
    "dorsal": 12,
    "age": 31,
    "fechaNacimiento": "1993-07-20",
    "source": "fc26"
  },
  "west_ham_united|Jarrod Bowen (RM)": {
    "overall": 83,
    "nationality": "England",
    "dorsal": 20,
    "age": 28,
    "fechaNacimiento": "1996-12-20",
    "source": "fc26"
  },
  "west_ham_united|Valentin Castellanos (ST)": {
    "overall": 80,
    "nationality": "Argentina",
    "dorsal": 11,
    "age": 26,
    "fechaNacimiento": "1998-10-03",
    "source": "fc26"
  },
  "west_ham_united|Aaron Wan-Bissaka (RB)": {
    "overall": 80,
    "nationality": "Congo DR",
    "dorsal": 29,
    "age": 27,
    "fechaNacimiento": "1997-11-26",
    "source": "fc26"
  },
  "west_ham_united|El Hadji Malick Diouf (LB)": {
    "overall": 75,
    "nationality": "Senegal",
    "dorsal": 12,
    "age": 20,
    "fechaNacimiento": "2004-12-29",
    "source": "fc26"
  },
  "west_ham_united|Mateus Fernandes (CM)": {
    "overall": 76,
    "nationality": "Portugal",
    "dorsal": 18,
    "age": 20,
    "fechaNacimiento": "2004-07-10",
    "source": "fc26"
  },
  "west_ham_united|Crysencio Summerville (LM)": {
    "overall": 76,
    "nationality": "Netherlands",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2001-10-30",
    "source": "fc26"
  },
  "west_ham_united|Jean-Clair Todibo (CB)": {
    "overall": 78,
    "nationality": "France",
    "dorsal": 25,
    "age": 25,
    "fechaNacimiento": "1999-12-30",
    "source": "fc26"
  },
  "west_ham_united|Konstantinos Mavropanos (CB)": {
    "overall": 76,
    "nationality": "Greece",
    "dorsal": 15,
    "age": 27,
    "fechaNacimiento": "1997-12-11",
    "source": "fc26"
  },
  "west_ham_united|Axel Disasi (CB)": {
    "overall": 77,
    "nationality": "France",
    "dorsal": 2,
    "age": 27,
    "fechaNacimiento": "1998-03-11",
    "source": "fc26"
  },
  "west_ham_united|Alphonse Areola (GK)": {
    "overall": 77,
    "nationality": "France",
    "dorsal": 23,
    "age": 32,
    "fechaNacimiento": "1993-02-27",
    "source": "fc26"
  },
  "west_ham_united|Callum Wilson (ST)": {
    "overall": 78,
    "nationality": "England",
    "dorsal": 9,
    "age": 33,
    "fechaNacimiento": "1992-02-27",
    "source": "fc26"
  },
  "brighton_hove_albion|Kaoru Mitoma (LM)": {
    "overall": 82,
    "nationality": "Japan",
    "dorsal": 22,
    "age": 28,
    "fechaNacimiento": "1997-05-20",
    "source": "fc26"
  },
  "brighton_hove_albion|Bart Verbruggen (GK)": {
    "overall": 78,
    "nationality": "Netherlands",
    "dorsal": 1,
    "age": 22,
    "fechaNacimiento": "2002-08-18",
    "source": "fc26"
  },
  "brighton_hove_albion|Jan Paul van Hecke (CB)": {
    "overall": 80,
    "nationality": "Netherlands",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "2000-06-08",
    "source": "fc26"
  },
  "brighton_hove_albion|Carlos Baleba (CDM)": {
    "overall": 81,
    "nationality": "Cameroon",
    "dorsal": 17,
    "age": 21,
    "fechaNacimiento": "2004-01-03",
    "source": "fc26"
  },
  "brighton_hove_albion|Yankuba Minteh (RM)": {
    "overall": 77,
    "nationality": "Gambia",
    "dorsal": 11,
    "age": 20,
    "fechaNacimiento": "2004-07-22",
    "source": "fc26"
  },
  "brighton_hove_albion|Ferdi Kadıoğlu (LB)": {
    "overall": 79,
    "nationality": "Türkiye",
    "dorsal": 24,
    "age": 25,
    "fechaNacimiento": "1999-10-07",
    "source": "fc26"
  },
  "brighton_hove_albion|Danny Welbeck (ST)": {
    "overall": 79,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "brighton_hove_albion|Yasin Ayari (CDM)": {
    "overall": 75,
    "nationality": "Sweden",
    "dorsal": 26,
    "age": 21,
    "fechaNacimiento": "2003-10-06",
    "source": "fc26"
  },
  "brighton_hove_albion|Maxim De Cuyper (LB)": {
    "overall": 80,
    "nationality": "Belgium",
    "dorsal": 29,
    "age": 24,
    "fechaNacimiento": "2000-12-22",
    "source": "fc26"
  },
  "brighton_hove_albion|Mats Wieffer (CDM)": {
    "overall": 78,
    "nationality": "Netherlands",
    "dorsal": 27,
    "age": 25,
    "fechaNacimiento": "1999-11-16",
    "source": "fc26"
  },
  "brighton_hove_albion|Pascal Groß (CDM)": {
    "overall": 80,
    "nationality": "Germany",
    "dorsal": 13,
    "age": 34,
    "fechaNacimiento": "1991-06-15",
    "source": "fc26"
  },
  "brentford|Igor Thiago (ST)": {
    "overall": 75,
    "nationality": "Brazil",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2001-06-26",
    "source": "fc26"
  },
  "brentford|Michael Kayode (RB)": {
    "overall": 73,
    "nationality": "Italy",
    "dorsal": 33,
    "age": 20,
    "fechaNacimiento": "2004-07-10",
    "source": "fc26"
  },
  "brentford|Mikkel Damsgaard (CAM)": {
    "overall": 80,
    "nationality": "Denmark",
    "dorsal": 24,
    "age": 24,
    "fechaNacimiento": "2000-07-03",
    "source": "fc26"
  },
  "brentford|Caoimhin Kelleher (GK)": {
    "overall": 79,
    "nationality": "Republic of Ireland",
    "dorsal": 1,
    "age": 26,
    "fechaNacimiento": "1998-11-23",
    "source": "fc26"
  },
  "brentford|Kevin Schade (LM)": {
    "overall": 78,
    "nationality": "Germany",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2001-11-27",
    "source": "fc26"
  },
  "brentford|Mathias Jensen (CM)": {
    "overall": 77,
    "nationality": "Denmark",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1996-01-01",
    "source": "fc26"
  },
  "brentford|Jordan Henderson (CDM)": {
    "overall": 79,
    "nationality": "England",
    "dorsal": 6,
    "age": 35,
    "fechaNacimiento": "1990-06-17",
    "source": "fc26"
  },
  "brentford|Nathan Collins (CB)": {
    "overall": 79,
    "nationality": "Republic of Ireland",
    "dorsal": 22,
    "age": 24,
    "fechaNacimiento": "2001-04-30",
    "source": "fc26"
  },
  "brentford|Dango Ouattara (RM)": {
    "overall": 77,
    "nationality": "Burkina Faso",
    "dorsal": 19,
    "age": 23,
    "fechaNacimiento": "2002-02-11",
    "source": "fc26"
  },
  "brentford|Sepp van den Berg (CB)": {
    "overall": 77,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 23,
    "fechaNacimiento": "2001-12-20",
    "source": "fc26"
  },
  "brentford|Yehor Yarmoliuk (CDM)": {
    "overall": 71,
    "nationality": "Ukraine",
    "dorsal": 18,
    "age": 21,
    "fechaNacimiento": "2004-03-01",
    "source": "fc26"
  },
  "crystal_palace|Dean Henderson (GK)": {
    "overall": 81,
    "nationality": "England",
    "dorsal": 1,
    "age": 28,
    "fechaNacimiento": "1997-03-12",
    "source": "fc26"
  },
  "crystal_palace|Daniel Muñoz (RB)": {
    "overall": 81,
    "nationality": "Colombia",
    "dorsal": 2,
    "age": 29,
    "fechaNacimiento": "1996-05-26",
    "source": "fc26"
  },
  "crystal_palace|Jean-Philippe Mateta (ST)": {
    "overall": 82,
    "nationality": "France",
    "dorsal": 14,
    "age": 28,
    "fechaNacimiento": "1997-06-28",
    "source": "fc26"
  },
  "crystal_palace|Maxence Lacroix (CB)": {
    "overall": 81,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "crystal_palace|Adam Wharton (CDM)": {
    "overall": 79,
    "nationality": "England",
    "dorsal": 20,
    "age": 21,
    "fechaNacimiento": "2004-02-06",
    "source": "fc26"
  },
  "crystal_palace|Ismaïla Sarr (RW)": {
    "overall": 79,
    "nationality": "Senegal",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1998-02-25",
    "source": "fc26"
  },
  "crystal_palace|Chris Richards (CB)": {
    "overall": 79,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "crystal_palace|Tyrick Mitchell (LB)": {
    "overall": 78,
    "nationality": "England",
    "dorsal": 3,
    "age": 25,
    "fechaNacimiento": "1999-09-01",
    "source": "fc26"
  },
  "crystal_palace|Yeremy Pino (LW)": {
    "overall": 80,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2002-10-20",
    "source": "fc26"
  },
  "crystal_palace|Brennan Johnson (RW)": {
    "overall": 79,
    "nationality": "Wales",
    "dorsal": 22,
    "age": 24,
    "fechaNacimiento": "2001-05-23",
    "source": "fc26"
  },
  "crystal_palace|Daichi Kamada (CM)": {
    "overall": 77,
    "nationality": "Japan",
    "dorsal": 18,
    "age": 28,
    "fechaNacimiento": "1996-08-05",
    "source": "fc26"
  },
  "everton_eng|Jordan Pickford (GK)": {
    "overall": 84,
    "nationality": "England",
    "dorsal": 1,
    "age": 31,
    "fechaNacimiento": "1994-03-07",
    "source": "fc26"
  },
  "everton_eng|Iliman Ndiaye (RM)": {
    "overall": 79,
    "nationality": "Senegal",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-03-06",
    "source": "fc26"
  },
  "everton_eng|Jack Grealish (LM)": {
    "overall": 80,
    "nationality": "England",
    "dorsal": 18,
    "age": 29,
    "fechaNacimiento": "1995-09-10",
    "source": "fc26"
  },
  "everton_eng|James Tarkowski (CB)": {
    "overall": 80,
    "nationality": "England",
    "dorsal": 6,
    "age": 32,
    "fechaNacimiento": "1992-11-19",
    "source": "fc26"
  },
  "everton_eng|James Garner (CDM)": {
    "overall": 76,
    "nationality": "England",
    "dorsal": 37,
    "age": 24,
    "fechaNacimiento": "2001-03-13",
    "source": "fc26"
  },
  "everton_eng|Jarrad Branthwaite (CB)": {
    "overall": 79,
    "nationality": "England",
    "dorsal": 32,
    "age": 23,
    "fechaNacimiento": "2002-06-27",
    "source": "fc26"
  },
  "everton_eng|Idrissa Gueye (CDM)": {
    "overall": 79,
    "nationality": "Senegal",
    "dorsal": 27,
    "age": 35,
    "fechaNacimiento": "1989-09-26",
    "source": "fc26"
  },
  "everton_eng|Kiernan Dewsbury-Hall (CAM)": {
    "overall": 77,
    "nationality": "England",
    "dorsal": 22,
    "age": 26,
    "fechaNacimiento": "1998-09-06",
    "source": "fc26"
  },
  "everton_eng|Vitaliy Mykolenko (LB)": {
    "overall": 77,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "everton_eng|Dwight McNeil (LM)": {
    "overall": 78,
    "nationality": "England",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "1999-11-22",
    "source": "fc26"
  },
  "everton_eng|Jake O'Brien (RB)": {
    "overall": 76,
    "nationality": "Republic of Ireland",
    "dorsal": 15,
    "age": 24,
    "fechaNacimiento": "2001-05-15",
    "source": "fc26"
  },
  "fulham|Antonee Robinson (LB)": {
    "overall": 82,
    "nationality": "United States",
    "dorsal": 33,
    "age": 27,
    "fechaNacimiento": "1997-08-08",
    "source": "fc26"
  },
  "fulham|Alex Iwobi (LM)": {
    "overall": 80,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "fulham|Samuel Chukwueze (RM)": {
    "overall": 80,
    "nationality": "Nigeria",
    "dorsal": 19,
    "age": 26,
    "fechaNacimiento": "1999-05-22",
    "source": "fc26"
  },
  "fulham|Bernd Leno (GK)": {
    "overall": 80,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 33,
    "fechaNacimiento": "1992-03-04",
    "source": "fc26"
  },
  "fulham|Joachim Andersen (CB)": {
    "overall": 78,
    "nationality": "Denmark",
    "dorsal": 5,
    "age": 29,
    "fechaNacimiento": "1996-05-31",
    "source": "fc26"
  },
  "fulham|Sander Berge (CDM)": {
    "overall": 79,
    "nationality": "Norway",
    "dorsal": 16,
    "age": 27,
    "fechaNacimiento": "1998-02-18",
    "source": "fc26"
  },
  "fulham|Harry Wilson (RM)": {
    "overall": 76,
    "nationality": "Wales",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-03-22",
    "source": "fc26"
  },
  "fulham|Kenny Tete (RB)": {
    "overall": 77,
    "nationality": "Netherlands",
    "dorsal": 2,
    "age": 29,
    "fechaNacimiento": "1995-10-09",
    "source": "fc26"
  },
  "fulham|Calvin Bassey (CB)": {
    "overall": 78,
    "nationality": "Nigeria",
    "dorsal": 3,
    "age": 25,
    "fechaNacimiento": "1999-12-31",
    "source": "fc26"
  },
  "fulham|Saša Lukić (CDM)": {
    "overall": 78,
    "nationality": "Serbia",
    "dorsal": 20,
    "age": 28,
    "fechaNacimiento": "1996-08-13",
    "source": "fc26"
  },
  "fulham|Raúl Jiménez (ST)": {
    "overall": 77,
    "nationality": "Mexico",
    "dorsal": 7,
    "age": 34,
    "fechaNacimiento": "1991-05-05",
    "source": "fc26"
  },
  "wolverhampton_wanderers|Ladislav Krejčí (CB)": {
    "overall": 78,
    "nationality": "Czechia",
    "dorsal": 37,
    "age": 26,
    "fechaNacimiento": "1999-04-20",
    "source": "fc26"
  },
  "wolverhampton_wanderers|André (CDM)": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2001-07-16",
    "source": "fc26"
  },
  "wolverhampton_wanderers|João Gomes (CDM)": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2001-02-12",
    "source": "fc26"
  },
  "wolverhampton_wanderers|José Sá (GK)": {
    "overall": 77,
    "nationality": "Portugal",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1993-01-17",
    "source": "fc26"
  },
  "wolverhampton_wanderers|Santiago Bueno (CB)": {
    "overall": 76,
    "nationality": "Uruguay",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1998-11-09",
    "source": "fc26"
  },
  "wolverhampton_wanderers|Tolu Arokodare (ST)": {
    "overall": 76,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "wolverhampton_wanderers|Angel Gomes (CAM)": {
    "overall": 76,
    "dorsal": 47,
    "source": "latamfc26"
  },
  "wolverhampton_wanderers|Sam Johnstone (GK)": {
    "overall": 76,
    "dorsal": 31,
    "source": "latamfc26"
  },
  "wolverhampton_wanderers|Hugo Bueno (LB)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 22,
    "fechaNacimiento": "2002-09-18",
    "source": "fc26"
  },
  "wolverhampton_wanderers|Jean-Ricner Bellegarde (CAM)": {
    "overall": 75,
    "nationality": "Haiti",
    "dorsal": 27,
    "age": 27,
    "fechaNacimiento": "1998-06-27",
    "source": "fc26"
  },
  "wolverhampton_wanderers|Toti (CB)": {
    "overall": 75,
    "nationality": "Portugal",
    "dorsal": 24,
    "age": 26,
    "fechaNacimiento": "1999-01-16",
    "source": "fc26"
  },
  "nottingham_forest|Matz Sels (GK)": {
    "overall": 83,
    "nationality": "Belgium",
    "dorsal": 26,
    "age": 33,
    "fechaNacimiento": "1992-02-26",
    "source": "fc26"
  },
  "nottingham_forest|Murillo (CB)": {
    "overall": 83,
    "nationality": "Brazil",
    "dorsal": 5,
    "age": 22,
    "fechaNacimiento": "2002-07-04",
    "source": "fc26"
  },
  "nottingham_forest|Elliot Anderson (CDM)": {
    "overall": 80,
    "nationality": "England",
    "dorsal": 8,
    "age": 22,
    "fechaNacimiento": "2002-11-06",
    "source": "fc26"
  },
  "nottingham_forest|Nikola Milenković (CB)": {
    "overall": 83,
    "nationality": "Serbia",
    "dorsal": 31,
    "age": 27,
    "fechaNacimiento": "1997-10-12",
    "source": "fc26"
  },
  "nottingham_forest|Morgan Gibbs-White (CAM)": {
    "overall": 82,
    "nationality": "England",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-01-27",
    "source": "fc26"
  },
  "nottingham_forest|Chris Wood (ST)": {
    "overall": 81,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "nottingham_forest|Ola Aina (RB)": {
    "overall": 80,
    "dorsal": 34,
    "source": "latamfc26"
  },
  "nottingham_forest|Neco Williams (LB)": {
    "overall": 78,
    "nationality": "Wales",
    "dorsal": 3,
    "age": 24,
    "fechaNacimiento": "2001-04-13",
    "source": "fc26"
  },
  "nottingham_forest|Stefan Ortega (GK)": {
    "overall": 79,
    "nationality": "Germany",
    "dorsal": 18,
    "age": 32,
    "fechaNacimiento": "1992-11-06",
    "source": "fc26"
  },
  "nottingham_forest|Ibrahim Sangaré (CDM)": {
    "overall": 77,
    "nationality": "Côte d'Ivoire",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1997-12-02",
    "source": "fc26"
  },
  "nottingham_forest|Callum Hudson-Odoi (LM)": {
    "overall": 78,
    "nationality": "England",
    "dorsal": 7,
    "age": 24,
    "fechaNacimiento": "2000-11-07",
    "source": "fc26"
  },
  "afc_bournemouth|Marcos Senesi (CB)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-05-10",
    "source": "fc26"
  },
  "afc_bournemouth|Evanilson (ST)": {
    "overall": 80,
    "nationality": "Brazil",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "1999-10-06",
    "source": "fc26"
  },
  "afc_bournemouth|Đorđe Petrović (GK)": {
    "overall": 80,
    "nationality": "Serbia",
    "dorsal": 1,
    "age": 25,
    "fechaNacimiento": "1999-10-08",
    "source": "fc26"
  },
  "afc_bournemouth|Adrien Truffert (LB)": {
    "overall": 77,
    "nationality": "France",
    "dorsal": 3,
    "age": 23,
    "fechaNacimiento": "2001-11-20",
    "source": "fc26"
  },
  "afc_bournemouth|Alex Scott (CDM)": {
    "overall": 74,
    "nationality": "England",
    "dorsal": 8,
    "age": 21,
    "fechaNacimiento": "2003-08-21",
    "source": "fc26"
  },
  "afc_bournemouth|Tyler Adams (CDM)": {
    "overall": 79,
    "nationality": "United States",
    "dorsal": 12,
    "age": 26,
    "fechaNacimiento": "1999-02-14",
    "source": "fc26"
  },
  "afc_bournemouth|Bafodé Diakité (CB)": {
    "overall": 79,
    "nationality": "France",
    "dorsal": 18,
    "age": 24,
    "fechaNacimiento": "2001-01-06",
    "source": "fc26"
  },
  "afc_bournemouth|Justin Kluivert (CAM)": {
    "overall": 79,
    "nationality": "Netherlands",
    "dorsal": 19,
    "age": 26,
    "fechaNacimiento": "1999-05-05",
    "source": "fc26"
  },
  "afc_bournemouth|Eli Junior Kroupi (ST)": {
    "overall": 78,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "afc_bournemouth|Ryan Christie (CDM)": {
    "overall": 79,
    "nationality": "Scotland",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1995-02-12",
    "source": "fc26"
  },
  "afc_bournemouth|Lewis Cook (CDM)": {
    "overall": 79,
    "nationality": "England",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1997-02-03",
    "source": "fc26"
  },
  "burnley|Martin Dúbravka (GK)": {
    "overall": 77,
    "nationality": "Slovakia",
    "dorsal": 1,
    "age": 36,
    "fechaNacimiento": "1989-01-15",
    "source": "fc26"
  },
  "burnley|Florentino (CDM)": {
    "overall": 80,
    "nationality": "Portugal",
    "dorsal": 16,
    "age": 25,
    "fechaNacimiento": "1999-08-19",
    "source": "fc26"
  },
  "burnley|Kyle Walker (RB)": {
    "overall": 79,
    "nationality": "England",
    "dorsal": 2,
    "age": 35,
    "fechaNacimiento": "1990-05-28",
    "source": "fc26"
  },
  "burnley|Josh Cullen (CDM)": {
    "overall": 77,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "burnley|Maxime Estève (CB)": {
    "overall": 76,
    "nationality": "France",
    "dorsal": 5,
    "age": 23,
    "fechaNacimiento": "2002-05-26",
    "source": "fc26"
  },
  "burnley|Lesley Ugochukwu (CDM)": {
    "overall": 73,
    "nationality": "France",
    "dorsal": 8,
    "age": 21,
    "fechaNacimiento": "2004-03-26",
    "source": "fc26"
  },
  "burnley|Jaidon Anthony (LM)": {
    "overall": 74,
    "nationality": "England",
    "dorsal": 11,
    "age": 25,
    "fechaNacimiento": "1999-12-01",
    "source": "fc26"
  },
  "burnley|Quilindschy Hartman (LB)": {
    "overall": 77,
    "nationality": "Netherlands",
    "dorsal": 3,
    "age": 23,
    "fechaNacimiento": "2001-11-14",
    "source": "fc26"
  },
  "burnley|Hannibal (CM)": {
    "overall": 74,
    "nationality": "Tunisia",
    "dorsal": 28,
    "age": 22,
    "fechaNacimiento": "2003-01-21",
    "source": "fc26"
  },
  "burnley|Marcus Edwards (RM)": {
    "overall": 76,
    "nationality": "England",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1998-12-03",
    "source": "fc26"
  },
  "burnley|Zian Flemming (ST)": {
    "overall": 73,
    "nationality": "Netherlands",
    "dorsal": 19,
    "age": 26,
    "fechaNacimiento": "1998-08-01",
    "source": "fc26"
  },
  "leeds_united|Anton Stach (CM)": {
    "overall": 79,
    "nationality": "Germany",
    "dorsal": 18,
    "age": 26,
    "fechaNacimiento": "1998-11-15",
    "source": "fc26"
  },
  "leeds_united|Ethan Ampadu (CDM)": {
    "overall": 76,
    "nationality": "Wales",
    "dorsal": 4,
    "age": 24,
    "fechaNacimiento": "2000-09-14",
    "source": "fc26"
  },
  "leeds_united|Lucas Perri (GK)": {
    "overall": 81,
    "nationality": "Brazil",
    "dorsal": 1,
    "age": 27,
    "fechaNacimiento": "1997-12-10",
    "source": "fc26"
  },
  "leeds_united|Joe Rodon (CB)": {
    "overall": 77,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "leeds_united|Gabriel Gudmundsson (LB)": {
    "overall": 77,
    "nationality": "Sweden",
    "dorsal": 3,
    "age": 26,
    "fechaNacimiento": "1999-04-29",
    "source": "fc26"
  },
  "leeds_united|Dominic Calvert-Lewin (ST)": {
    "overall": 74,
    "nationality": "England",
    "dorsal": 9,
    "age": 28,
    "fechaNacimiento": "1997-03-16",
    "source": "fc26"
  },
  "leeds_united|Jaka Bijol (CB)": {
    "overall": 77,
    "nationality": "Slovenia",
    "dorsal": 15,
    "age": 26,
    "fechaNacimiento": "1999-02-05",
    "source": "fc26"
  },
  "leeds_united|Jayden Bogle (RB)": {
    "overall": 75,
    "nationality": "England",
    "dorsal": 2,
    "age": 24,
    "fechaNacimiento": "2000-07-27",
    "source": "fc26"
  },
  "leeds_united|Pascal Struijk (CB)": {
    "overall": 76,
    "nationality": "Netherlands",
    "dorsal": 5,
    "age": 25,
    "fechaNacimiento": "1999-08-11",
    "source": "fc26"
  },
  "leeds_united|Brenden Aaronson (RW)": {
    "overall": 74,
    "nationality": "United States",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2000-10-22",
    "source": "fc26"
  },
  "leeds_united|Noah Okafor (ST)": {
    "overall": 76,
    "nationality": "Switzerland",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "2000-05-24",
    "source": "fc26"
  },
  "sunderland|Granit Xhaka (CDM)": {
    "overall": 85,
    "nationality": "Switzerland",
    "dorsal": 34,
    "age": 32,
    "fechaNacimiento": "1992-09-27",
    "source": "fc26"
  },
  "sunderland|Nordi Mukiele (CB)": {
    "overall": 79,
    "nationality": "France",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1997-11-01",
    "source": "fc26"
  },
  "sunderland|Omar Alderete (CB)": {
    "overall": 78,
    "nationality": "Paraguay",
    "dorsal": 15,
    "age": 28,
    "fechaNacimiento": "1996-12-26",
    "source": "fc26"
  },
  "sunderland|Reinildo (LB)": {
    "overall": 79,
    "nationality": "Mozambique",
    "dorsal": 17,
    "age": 31,
    "fechaNacimiento": "1994-01-21",
    "source": "fc26"
  },
  "sunderland|Robin Roefs (GK)": {
    "overall": 74,
    "nationality": "Netherlands",
    "dorsal": 22,
    "age": 22,
    "fechaNacimiento": "2003-01-17",
    "source": "fc26"
  },
  "sunderland|Daniel Ballard (CB)": {
    "overall": 73,
    "nationality": "Northern Ireland",
    "dorsal": 5,
    "age": 25,
    "fechaNacimiento": "1999-09-22",
    "source": "fc26"
  },
  "sunderland|Trai Hume (RB)": {
    "overall": 74,
    "nationality": "Northern Ireland",
    "dorsal": 32,
    "age": 23,
    "fechaNacimiento": "2002-03-18",
    "source": "fc26"
  },
  "sunderland|Enzo Le Fée (CM)": {
    "overall": 76,
    "nationality": "France",
    "dorsal": 28,
    "age": 25,
    "fechaNacimiento": "2000-02-03",
    "source": "fc26"
  },
  "sunderland|Lutsharel Geertruida (CB)": {
    "overall": 78,
    "nationality": "Netherlands",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2000-07-18",
    "source": "fc26"
  },
  "sunderland|Habib Diarra (CM)": {
    "overall": 77,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "sunderland|Noah Sadiki (CM)": {
    "overall": 74,
    "nationality": "Congo DR",
    "dorsal": 27,
    "age": 20,
    "fechaNacimiento": "2004-12-17",
    "source": "fc26"
  },
  "bologna|Riccardo Orsolini (RM)": {
    "overall": 82,
    "nationality": "Italy",
    "dorsal": 7,
    "age": 28,
    "fechaNacimiento": "1997-01-24",
    "source": "fc26"
  },
  "bologna|Remo Freuler (CDM)": {
    "overall": 81,
    "nationality": "Switzerland",
    "dorsal": 8,
    "age": 33,
    "fechaNacimiento": "1992-04-15",
    "source": "fc26"
  },
  "bologna|Łukasz Skorupski (GK)": {
    "overall": 79,
    "nationality": "Poland",
    "dorsal": 1,
    "age": 34,
    "fechaNacimiento": "1991-05-05",
    "source": "fc26"
  },
  "bologna|Lewis Ferguson (CDM)": {
    "overall": 78,
    "nationality": "Scotland",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "1999-08-24",
    "source": "fc26"
  },
  "bologna|João Mário (RB)": {
    "overall": 78,
    "nationality": "Portugal",
    "dorsal": 10,
    "age": 32,
    "fechaNacimiento": "1993-01-19",
    "source": "fc26"
  },
  "bologna|Jens Odgaard (CAM)": {
    "overall": 76,
    "nationality": "Denmark",
    "dorsal": 21,
    "age": 26,
    "fechaNacimiento": "1999-03-31",
    "source": "fc26"
  },
  "bologna|Santiago Castro (ST)": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 9,
    "age": 20,
    "fechaNacimiento": "2004-09-18",
    "source": "fc26"
  },
  "bologna|Jhon Lucumí (CB)": {
    "overall": 76,
    "nationality": "Colombia",
    "dorsal": 26,
    "age": 27,
    "fechaNacimiento": "1998-06-26",
    "source": "fc26"
  },
  "bologna|Juan Miranda (LB)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 33,
    "age": 25,
    "fechaNacimiento": "2000-01-19",
    "source": "fc26"
  },
  "bologna|Nicolò Cambiaghi (LM)": {
    "overall": 73,
    "nationality": "Italy",
    "dorsal": 28,
    "age": 24,
    "fechaNacimiento": "2000-12-28",
    "source": "fc26"
  },
  "bologna|Nikola Moro (CDM)": {
    "overall": 75,
    "nationality": "Croatia",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1998-03-12",
    "source": "fc26"
  },
  "cagliari|Elia Caprile (GK)": {
    "overall": 76,
    "nationality": "Italy",
    "dorsal": 1,
    "age": 23,
    "fechaNacimiento": "2001-08-25",
    "source": "fc26"
  },
  "cagliari|Yerry Mina (CB)": {
    "overall": 77,
    "nationality": "Colombia",
    "dorsal": 26,
    "age": 30,
    "fechaNacimiento": "1994-09-23",
    "source": "fc26"
  },
  "cagliari|Sebastiano Esposito (ST)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 94,
    "age": 22,
    "fechaNacimiento": "2002-07-02",
    "source": "fc26"
  },
  "cagliari|Michael Folorunsho (CM)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 90,
    "age": 27,
    "fechaNacimiento": "1998-02-07",
    "source": "fc26"
  },
  "cagliari|Andrea Belotti (ST)": {
    "overall": 77,
    "nationality": "Italy",
    "dorsal": 19,
    "age": 31,
    "fechaNacimiento": "1993-12-20",
    "source": "fc26"
  },
  "cagliari|Marco Palestra (RB)": {
    "overall": 65,
    "nationality": "Italy",
    "dorsal": 2,
    "age": 20,
    "fechaNacimiento": "2005-03-03",
    "source": "fc26"
  },
  "cagliari|Semih Kılıçsoy (ST)": {
    "overall": 70,
    "nationality": "Türkiye",
    "dorsal": 9,
    "age": 19,
    "fechaNacimiento": "2005-08-15",
    "source": "fc26"
  },
  "cagliari|Zé Pedro (CB)": {
    "overall": 75,
    "nationality": "Portugal",
    "dorsal": 32,
    "age": 28,
    "fechaNacimiento": "1997-06-06",
    "source": "fc26"
  },
  "cagliari|Alberto Dossena (CB)": {
    "overall": 73,
    "nationality": "Italy",
    "dorsal": 13,
    "age": 26,
    "fechaNacimiento": "1998-10-13",
    "source": "fc26"
  },
  "cagliari|Gianluca Gaetano (CAM)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-05-05",
    "source": "fc26"
  },
  "cagliari|Michel Ndary Adopo (CM)": {
    "overall": 72,
    "nationality": "France",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2000-07-19",
    "source": "fc26"
  },
  "como|Nico Paz (CAM)": {
    "overall": 79,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 20,
    "fechaNacimiento": "2004-09-08",
    "source": "fc26"
  },
  "como|Morata (ST)": {
    "overall": 81,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 32,
    "fechaNacimiento": "1992-10-23",
    "source": "fc26"
  },
  "como|Diego Carlos (CB)": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 34,
    "age": 32,
    "fechaNacimiento": "1993-03-15",
    "source": "fc26"
  },
  "como|Martin Baturina (CAM)": {
    "overall": 78,
    "nationality": "Croatia",
    "dorsal": 20,
    "age": 22,
    "fechaNacimiento": "2003-02-16",
    "source": "fc26"
  },
  "como|Maxence Caqueret (CM)": {
    "overall": 77,
    "nationality": "France",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "2000-02-15",
    "source": "fc26"
  },
  "como|Jean Butez (GK)": {
    "overall": 76,
    "nationality": "France",
    "dorsal": 1,
    "age": 30,
    "fechaNacimiento": "1995-06-08",
    "source": "fc26"
  },
  "como|Nicolas Kühn (RW)": {
    "overall": 77,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "como|Mërgim Vojvoda (RB)": {
    "overall": 75,
    "nationality": "Kosovo",
    "dorsal": 31,
    "age": 30,
    "fechaNacimiento": "1995-02-01",
    "source": "fc26"
  },
  "como|Jesús Rodríguez (LM)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 17,
    "age": 19,
    "fechaNacimiento": "2005-11-21",
    "source": "fc26"
  },
  "como|Sergi Roberto (CDM)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 33,
    "fechaNacimiento": "1992-02-07",
    "source": "fc26"
  },
  "como|Assane Diao (LM)": {
    "overall": 76,
    "nationality": "Senegal",
    "dorsal": 38,
    "age": 19,
    "fechaNacimiento": "2005-09-07",
    "source": "fc26"
  },
  "empoli|Andrea Fulignati (GK)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 21,
    "age": 30,
    "fechaNacimiento": "1994-10-31",
    "source": "fc26"
  },
  "empoli|Salvatore Elia (RB)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1999-06-30",
    "source": "fc26"
  },
  "empoli|Gerard Yepes (CDM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 22,
    "fechaNacimiento": "2002-08-25",
    "source": "fc26"
  },
  "empoli|Tyronne Ebuehi (RB)": {
    "overall": 71,
    "nationality": "Nigeria",
    "dorsal": 24,
    "age": 29,
    "fechaNacimiento": "1995-12-16",
    "source": "fc26"
  },
  "empoli|Andrea Ghion (CM)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 18,
    "age": 25,
    "fechaNacimiento": "2000-02-23",
    "source": "fc26"
  },
  "empoli|Daniel Fila (ST)": {
    "overall": 71,
    "nationality": "Czechia",
    "dorsal": 7,
    "age": 22,
    "fechaNacimiento": "2002-08-21",
    "source": "fc26"
  },
  "empoli|Rareș Ilie (LM)": {
    "overall": 69,
    "nationality": "Romania",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2003-04-19",
    "source": "fc26"
  },
  "empoli|Marco Curto (CB)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 2,
    "age": 26,
    "fechaNacimiento": "1999-01-05",
    "source": "fc26"
  },
  "empoli|Samuele Perisan (GK)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 1,
    "age": 27,
    "fechaNacimiento": "1997-08-21",
    "source": "fc26"
  },
  "empoli|Simone Romagnoli (CB)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 6,
    "age": 35,
    "fechaNacimiento": "1990-02-09",
    "source": "fc26"
  },
  "empoli|Antonio Candela (RB)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "2000-04-27",
    "source": "fc26"
  },
  "fiorentina|De Gea (GK)": {
    "overall": 85,
    "nationality": "Spain",
    "dorsal": 43,
    "age": 34,
    "fechaNacimiento": "1990-11-07",
    "source": "fc26"
  },
  "fiorentina|Moise Kean (ST)": {
    "overall": 83,
    "nationality": "Italy",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "2000-02-28",
    "source": "fc26"
  },
  "fiorentina|Robin Gosens (LB)": {
    "overall": 80,
    "nationality": "Germany",
    "dorsal": 21,
    "age": 30,
    "fechaNacimiento": "1994-07-05",
    "source": "fc26"
  },
  "fiorentina|Dodô (RB)": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 2,
    "age": 26,
    "fechaNacimiento": "1998-11-17",
    "source": "fc26"
  },
  "fiorentina|Albert Guðmundsson (ST)": {
    "overall": 79,
    "nationality": "Iceland",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1997-06-15",
    "source": "fc26"
  },
  "fiorentina|Manor Solomon (LM)": {
    "overall": 77,
    "nationality": "Israel",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "1999-07-24",
    "source": "fc26"
  },
  "fiorentina|Nicolò Fagioli (CM)": {
    "overall": 77,
    "nationality": "Italy",
    "dorsal": 44,
    "age": 24,
    "fechaNacimiento": "2001-02-12",
    "source": "fc26"
  },
  "fiorentina|Rolando Mandragora (CM)": {
    "overall": 77,
    "nationality": "Italy",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-06-29",
    "source": "fc26"
  },
  "fiorentina|Luca Ranieri (CB)": {
    "overall": 76,
    "nationality": "Italy",
    "dorsal": 6,
    "age": 26,
    "fechaNacimiento": "1999-04-23",
    "source": "fc26"
  },
  "fiorentina|Roberto Piccoli (ST)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 91,
    "age": 24,
    "fechaNacimiento": "2001-01-27",
    "source": "fc26"
  },
  "fiorentina|Fabiano Parisi (LB)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 65,
    "age": 24,
    "fechaNacimiento": "2000-11-09",
    "source": "fc26"
  },
  "genoa|Morten Frendrup (CDM)": {
    "overall": 76,
    "nationality": "Denmark",
    "dorsal": 32,
    "age": 24,
    "fechaNacimiento": "2001-04-07",
    "source": "fc26"
  },
  "genoa|Justin Bijlow (GK)": {
    "overall": 75,
    "nationality": "Netherlands",
    "dorsal": 1,
    "age": 27,
    "fechaNacimiento": "1998-01-22",
    "source": "fc26"
  },
  "genoa|Leo Østigård (CB)": {
    "overall": 73,
    "nationality": "Norway",
    "dorsal": 5,
    "age": 25,
    "fechaNacimiento": "1999-11-28",
    "source": "fc26"
  },
  "genoa|Johan Vásquez (CB)": {
    "overall": 75,
    "nationality": "Mexico",
    "dorsal": 22,
    "age": 26,
    "fechaNacimiento": "1998-10-22",
    "source": "fc26"
  },
  "genoa|Ruslan Malinovskyi (CM)": {
    "overall": 76,
    "nationality": "Ukraine",
    "dorsal": 17,
    "age": 32,
    "fechaNacimiento": "1993-05-04",
    "source": "fc26"
  },
  "genoa|Vitinha (ST)": {
    "overall": 75,
    "nationality": "Portugal",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-03-15",
    "source": "fc26"
  },
  "genoa|Brooke Norton-Cuffy (RB)": {
    "overall": 68,
    "nationality": "England",
    "dorsal": 15,
    "age": 21,
    "fechaNacimiento": "2004-01-12",
    "source": "fc26"
  },
  "genoa|Aarón Martín (LB)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1997-04-22",
    "source": "fc26"
  },
  "genoa|Tommaso Baldanzi (CAM)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 35,
    "age": 22,
    "fechaNacimiento": "2003-03-23",
    "source": "fc26"
  },
  "genoa|Maxwel Cornet (LM)": {
    "overall": 73,
    "dorsal": 70,
    "source": "latamfc26"
  },
  "genoa|Nicola Leali (GK)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1993-02-17",
    "source": "fc26"
  },
  "hellas_verona|Lorenzo Montipò (GK)": {
    "overall": 76,
    "nationality": "Italy",
    "dorsal": 1,
    "age": 29,
    "fechaNacimiento": "1996-02-20",
    "source": "fc26"
  },
  "hellas_verona|Suat Serdar (CM)": {
    "overall": 76,
    "nationality": "Germany",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-04-11",
    "source": "fc26"
  },
  "hellas_verona|Ali Al Musrati (CDM)": {
    "overall": 76,
    "dorsal": 73,
    "source": "latamfc26"
  },
  "hellas_verona|Victor Nelsson (CB)": {
    "overall": 75,
    "nationality": "Denmark",
    "dorsal": 15,
    "age": 26,
    "fechaNacimiento": "1998-10-14",
    "source": "fc26"
  },
  "hellas_verona|Gift Orban (ST)": {
    "overall": 74,
    "nationality": "Nigeria",
    "dorsal": 16,
    "age": 22,
    "fechaNacimiento": "2002-07-17",
    "source": "fc26"
  },
  "hellas_verona|Nicolás Valentini (CB)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 74,
    "age": 24,
    "fechaNacimiento": "2001-04-06",
    "source": "fc26"
  },
  "hellas_verona|Pol Lirola (RB)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 29,
    "age": 27,
    "fechaNacimiento": "1997-08-13",
    "source": "fc26"
  },
  "hellas_verona|Sandi Lovrič (CM)": {
    "overall": 75,
    "nationality": "Slovenia",
    "dorsal": 4,
    "age": 27,
    "fechaNacimiento": "1998-03-28",
    "source": "fc26"
  },
  "hellas_verona|Armel Bella-Kotchap (CB)": {
    "overall": 72,
    "nationality": "Germany",
    "dorsal": 37,
    "age": 23,
    "fechaNacimiento": "2001-12-11",
    "source": "fc26"
  },
  "hellas_verona|Domagoj Bradarić (LB)": {
    "overall": 71,
    "nationality": "Croatia",
    "dorsal": 12,
    "age": 25,
    "fechaNacimiento": "1999-12-10",
    "source": "fc26"
  },
  "hellas_verona|Roberto Gagliardini (CDM)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 63,
    "age": 31,
    "fechaNacimiento": "1994-04-07",
    "source": "fc26"
  },
  "juventus|Bremer (CB)": {
    "overall": 85,
    "nationality": "Brazil",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1997-03-18",
    "source": "fc26"
  },
  "juventus|Manuel Locatelli (CDM)": {
    "overall": 84,
    "nationality": "Italy",
    "dorsal": 5,
    "age": 27,
    "fechaNacimiento": "1998-01-08",
    "source": "fc26"
  },
  "juventus|Loïs Openda (ST)": {
    "overall": 82,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "juventus|Khéphren Thuram (CM)": {
    "overall": 81,
    "nationality": "France",
    "dorsal": 19,
    "age": 24,
    "fechaNacimiento": "2001-03-26",
    "source": "fc26"
  },
  "juventus|Kenan Yıldız (CAM)": {
    "overall": 79,
    "nationality": "Türkiye",
    "dorsal": 10,
    "age": 20,
    "fechaNacimiento": "2005-05-04",
    "source": "fc26"
  },
  "juventus|Jonathan David (ST)": {
    "overall": 82,
    "nationality": "Canada",
    "dorsal": 30,
    "age": 25,
    "fechaNacimiento": "2000-01-14",
    "source": "fc26"
  },
  "juventus|Michele Di Gregorio (GK)": {
    "overall": 81,
    "nationality": "Italy",
    "dorsal": 16,
    "age": 27,
    "fechaNacimiento": "1997-07-27",
    "source": "fc26"
  },
  "juventus|Dušan Vlahović (ST)": {
    "overall": 82,
    "nationality": "Serbia",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-01-28",
    "source": "fc26"
  },
  "juventus|Pierre Kalulu (CB)": {
    "overall": 80,
    "nationality": "France",
    "dorsal": 15,
    "age": 25,
    "fechaNacimiento": "2000-06-05",
    "source": "fc26"
  },
  "juventus|Andrea Cambiaso (LB)": {
    "overall": 79,
    "nationality": "Italy",
    "dorsal": 27,
    "age": 25,
    "fechaNacimiento": "2000-02-20",
    "source": "fc26"
  },
  "juventus|Teun Koopmeiners (CAM)": {
    "overall": 81,
    "nationality": "Netherlands",
    "dorsal": 8,
    "age": 27,
    "fechaNacimiento": "1998-02-28",
    "source": "fc26"
  },
  "lecce|Wladimiro Falcone (GK)": {
    "overall": 81,
    "nationality": "Italy",
    "dorsal": 30,
    "age": 30,
    "fechaNacimiento": "1995-04-12",
    "source": "fc26"
  },
  "lecce|Antonino Gallo (LB)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 25,
    "age": 25,
    "fechaNacimiento": "2000-01-05",
    "source": "fc26"
  },
  "lecce|Lassana Coulibaly (CDM)": {
    "overall": 74,
    "nationality": "Mali",
    "dorsal": 29,
    "age": 29,
    "fechaNacimiento": "1996-04-10",
    "source": "fc26"
  },
  "lecce|Riccardo Sottil (LM)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1999-06-03",
    "source": "fc26"
  },
  "lecce|Omri Gandelman (CAM)": {
    "overall": 71,
    "nationality": "Israel",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "2000-05-16",
    "source": "fc26"
  },
  "lecce|Walid Cheddira (ST)": {
    "overall": 72,
    "nationality": "Morocco",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1998-01-22",
    "source": "fc26"
  },
  "lecce|Kialonda Gaspar (CB)": {
    "overall": 74,
    "nationality": "Angola",
    "dorsal": 4,
    "age": 27,
    "fechaNacimiento": "1997-09-27",
    "source": "fc26"
  },
  "lecce|Àlex Sala (CDM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2001-04-09",
    "source": "fc26"
  },
  "lecce|Jamil Siebert (CB)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 5,
    "age": 23,
    "fechaNacimiento": "2002-04-02",
    "source": "fc26"
  },
  "lecce|Ylber Ramadani (CDM)": {
    "overall": 70,
    "nationality": "Albania",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1996-04-12",
    "source": "fc26"
  },
  "lecce|Santiago Pierotti (RM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 50,
    "age": 24,
    "fechaNacimiento": "2001-04-03",
    "source": "fc26"
  },
  "monza|Matteo Pessina (CM)": {
    "overall": 76,
    "nationality": "Italy",
    "dorsal": 32,
    "age": 28,
    "fechaNacimiento": "1997-04-21",
    "source": "fc26"
  },
  "monza|Andrea Colpani (CAM)": {
    "overall": 78,
    "nationality": "Italy",
    "dorsal": 28,
    "age": 26,
    "fechaNacimiento": "1999-05-11",
    "source": "fc26"
  },
  "monza|Samuele Birindelli (RB)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "1999-07-19",
    "source": "fc26"
  },
  "monza|Patrick Cutrone (ST)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 32,
    "age": 27,
    "fechaNacimiento": "1998-01-03",
    "source": "fc26"
  },
  "monza|Dany Mota (ST)": {
    "overall": 75,
    "nationality": "Portugal",
    "dorsal": 47,
    "age": 27,
    "fechaNacimiento": "1998-05-02",
    "source": "fc26"
  },
  "monza|Hernani (CDM)": {
    "overall": 75,
    "nationality": "Brazil",
    "dorsal": 23,
    "age": 31,
    "fechaNacimiento": "1994-03-27",
    "source": "fc26"
  },
  "monza|Demba Thiam (GK)": {
    "overall": 70,
    "nationality": "Senegal",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-03-05",
    "source": "fc26"
  },
  "monza|Paulo Azzi (LB)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1994-07-15",
    "source": "fc26"
  },
  "monza|Patrick Ciurria (CAM)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 26,
    "age": 30,
    "fechaNacimiento": "1995-02-09",
    "source": "fc26"
  },
  "monza|Agustín Álvarez (ST)": {
    "overall": 72,
    "nationality": "Uruguay",
    "dorsal": 25,
    "age": 24,
    "fechaNacimiento": "2001-05-19",
    "source": "fc26"
  },
  "monza|Luca Ravanelli (CB)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 13,
    "age": 28,
    "fechaNacimiento": "1997-01-06",
    "source": "fc26"
  },
  "napoli|Kevin De Bruyne (CM)": {
    "overall": 87,
    "nationality": "Belgium",
    "dorsal": 11,
    "age": 34,
    "fechaNacimiento": "1991-06-28",
    "source": "fc26"
  },
  "napoli|Scott McTominay (CM)": {
    "overall": 85,
    "nationality": "Scotland",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1996-12-08",
    "source": "fc26"
  },
  "napoli|Amir Rrahmani (CB)": {
    "overall": 83,
    "nationality": "Kosovo",
    "dorsal": 13,
    "age": 31,
    "fechaNacimiento": "1994-02-24",
    "source": "fc26"
  },
  "napoli|Stanislav Lobotka (CM)": {
    "overall": 83,
    "nationality": "Slovakia",
    "dorsal": 68,
    "age": 30,
    "fechaNacimiento": "1994-11-25",
    "source": "fc26"
  },
  "napoli|André-Franck Zambo Anguissa (CM)": {
    "overall": 83,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "napoli|Giovanni Di Lorenzo (RB)": {
    "overall": 83,
    "nationality": "Italy",
    "dorsal": 22,
    "age": 31,
    "fechaNacimiento": "1993-08-04",
    "source": "fc26"
  },
  "napoli|Romelu Lukaku (ST)": {
    "overall": 84,
    "nationality": "Belgium",
    "dorsal": 9,
    "age": 32,
    "fechaNacimiento": "1993-05-13",
    "source": "fc26"
  },
  "napoli|Alessandro Buongiorno (CB)": {
    "overall": 82,
    "nationality": "Italy",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1999-06-06",
    "source": "fc26"
  },
  "napoli|Alex Meret (GK)": {
    "overall": 82,
    "nationality": "Italy",
    "dorsal": 1,
    "age": 28,
    "fechaNacimiento": "1997-03-22",
    "source": "fc26"
  },
  "napoli|Matteo Politano (RW)": {
    "overall": 81,
    "nationality": "Italy",
    "dorsal": 21,
    "age": 31,
    "fechaNacimiento": "1993-08-03",
    "source": "fc26"
  },
  "napoli|David Neres (LW)": {
    "overall": 81,
    "nationality": "Brazil",
    "dorsal": 7,
    "age": 28,
    "fechaNacimiento": "1997-03-03",
    "source": "fc26"
  },
  "parma|Gabriel Strefezza (RM)": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 27,
    "age": 28,
    "fechaNacimiento": "1997-04-18",
    "source": "fc26"
  },
  "parma|Zion Suzuki (GK)": {
    "overall": 74,
    "nationality": "Japan",
    "dorsal": 31,
    "age": 22,
    "fechaNacimiento": "2002-08-21",
    "source": "fc26"
  },
  "parma|Enrico Delprato (CB)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 15,
    "age": 25,
    "fechaNacimiento": "1999-11-10",
    "source": "fc26"
  },
  "parma|Emanuele Valeri (LB)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 14,
    "age": 26,
    "fechaNacimiento": "1998-12-07",
    "source": "fc26"
  },
  "parma|Hans Nicolussi Caviglia (CDM)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 14,
    "age": 25,
    "fechaNacimiento": "2000-06-18",
    "source": "fc26"
  },
  "parma|Adrián Bernabé (CM)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2001-05-26",
    "source": "fc26"
  },
  "parma|Abdoulaye Ndiaye (CB)": {
    "overall": 75,
    "nationality": "Senegal",
    "dorsal": 3,
    "age": 23,
    "fechaNacimiento": "2002-04-10",
    "source": "fc26"
  },
  "parma|Mandela Keita (CDM)": {
    "overall": 73,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "parma|Jacob Ondrejka (LW)": {
    "overall": 73,
    "nationality": "Sweden",
    "dorsal": 17,
    "age": 22,
    "fechaNacimiento": "2002-09-02",
    "source": "fc26"
  },
  "parma|Gaetano Oristanio (CAM)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 21,
    "age": 22,
    "fechaNacimiento": "2002-09-28",
    "source": "fc26"
  },
  "parma|Matija Frigan (ST)": {
    "overall": 73,
    "nationality": "Croatia",
    "dorsal": 20,
    "age": 22,
    "fechaNacimiento": "2003-02-11",
    "source": "fc26"
  },
  "roma|Paulo Dybala (CAM)": {
    "overall": 86,
    "nationality": "Argentina",
    "dorsal": 21,
    "age": 31,
    "fechaNacimiento": "1993-11-15",
    "source": "fc26"
  },
  "roma|Mile Svilar (GK)": {
    "overall": 82,
    "nationality": "Serbia",
    "dorsal": 99,
    "age": 25,
    "fechaNacimiento": "1999-08-27",
    "source": "fc26"
  },
  "roma|Gianluca Mancini (CB)": {
    "overall": 83,
    "nationality": "Italy",
    "dorsal": 23,
    "age": 29,
    "fechaNacimiento": "1996-04-17",
    "source": "fc26"
  },
  "roma|Evan Ndicka (CB)": {
    "overall": 81,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "roma|Bryan Cristante (CM)": {
    "overall": 80,
    "nationality": "Italy",
    "dorsal": 4,
    "age": 30,
    "fechaNacimiento": "1995-03-03",
    "source": "fc26"
  },
  "roma|Artem Dovbyk (ST)": {
    "overall": 83,
    "nationality": "Ukraine",
    "dorsal": 9,
    "age": 28,
    "fechaNacimiento": "1997-06-21",
    "source": "fc26"
  },
  "roma|Kouadio Manu Koné (CM)": {
    "overall": 80,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "roma|Lorenzo Pellegrini (CAM)": {
    "overall": 80,
    "nationality": "Italy",
    "dorsal": 7,
    "age": 29,
    "fechaNacimiento": "1996-06-19",
    "source": "fc26"
  },
  "roma|Mario Hermoso (CB)": {
    "overall": 80,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 30,
    "fechaNacimiento": "1995-06-18",
    "source": "fc26"
  },
  "roma|Matías Soulé (CAM)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 22,
    "fechaNacimiento": "2003-04-15",
    "source": "fc26"
  },
  "roma|Donyell Malen (ST)": {
    "overall": 79,
    "nationality": "Netherlands",
    "dorsal": 17,
    "age": 26,
    "fechaNacimiento": "1999-01-19",
    "source": "fc26"
  },
  "torino|Duván Zapata (ST)": {
    "overall": 82,
    "nationality": "Colombia",
    "dorsal": 91,
    "age": 34,
    "fechaNacimiento": "1991-04-01",
    "source": "fc26"
  },
  "torino|Nikola Vlašić (CAM)": {
    "overall": 79,
    "nationality": "Croatia",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1997-10-04",
    "source": "fc26"
  },
  "torino|Ché Adams (ST)": {
    "overall": 77,
    "nationality": "Scotland",
    "dorsal": 19,
    "age": 28,
    "fechaNacimiento": "1996-07-13",
    "source": "fc26"
  },
  "torino|Cristiano Biraghi (LB)": {
    "overall": 78,
    "nationality": "Italy",
    "dorsal": 34,
    "age": 32,
    "fechaNacimiento": "1992-09-01",
    "source": "fc26"
  },
  "torino|Valentino Lazaro (RM)": {
    "overall": 76,
    "nationality": "Austria",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1996-03-24",
    "source": "fc26"
  },
  "torino|Saúl Coco (CB)": {
    "overall": 76,
    "nationality": "Equatorial Guinea",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1999-02-09",
    "source": "fc26"
  },
  "torino|Giovanni Simeone (ST)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 29,
    "fechaNacimiento": "1995-07-05",
    "source": "fc26"
  },
  "torino|Guillermo Maripán (CB)": {
    "overall": 76,
    "nationality": "Chile",
    "dorsal": 13,
    "age": 31,
    "fechaNacimiento": "1994-05-06",
    "source": "fc26"
  },
  "torino|Cesare Casadei (CM)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 22,
    "age": 22,
    "fechaNacimiento": "2003-01-10",
    "source": "fc26"
  },
  "torino|Franco Israel (GK)": {
    "overall": 75,
    "nationality": "Uruguay",
    "dorsal": 81,
    "age": 25,
    "fechaNacimiento": "2000-04-22",
    "source": "fc26"
  },
  "torino|Ivan Ilić (CDM)": {
    "overall": 76,
    "nationality": "Serbia",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2001-03-17",
    "source": "fc26"
  },
  "udinese|Oumar Solet (CB)": {
    "overall": 78,
    "nationality": "France",
    "dorsal": 28,
    "age": 25,
    "fechaNacimiento": "2000-02-07",
    "source": "fc26"
  },
  "udinese|Jesper Karlström (CDM)": {
    "overall": 75,
    "nationality": "Sweden",
    "dorsal": 8,
    "age": 30,
    "fechaNacimiento": "1995-06-21",
    "source": "fc26"
  },
  "udinese|Nicolò Zaniolo (ST)": {
    "overall": 76,
    "nationality": "Italy",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "1999-07-02",
    "source": "fc26"
  },
  "udinese|Maduka Okoye (GK)": {
    "overall": 74,
    "nationality": "Nigeria",
    "dorsal": 40,
    "age": 25,
    "fechaNacimiento": "1999-08-28",
    "source": "fc26"
  },
  "udinese|Arthur Atta (CM)": {
    "overall": 69,
    "nationality": "France",
    "dorsal": 14,
    "age": 22,
    "fechaNacimiento": "2003-01-14",
    "source": "fc26"
  },
  "udinese|Jurgen Ekkelenkamp (CM)": {
    "overall": 74,
    "nationality": "Netherlands",
    "dorsal": 32,
    "age": 25,
    "fechaNacimiento": "2000-04-05",
    "source": "fc26"
  },
  "udinese|Keinan Davis (ST)": {
    "overall": 72,
    "nationality": "England",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1998-02-13",
    "source": "fc26"
  },
  "udinese|Thomas Kristensen (CB)": {
    "overall": 72,
    "nationality": "Denmark",
    "dorsal": 31,
    "age": 23,
    "fechaNacimiento": "2002-01-17",
    "source": "fc26"
  },
  "udinese|Christian Kabasele (CB)": {
    "overall": 72,
    "nationality": "Belgium",
    "dorsal": 27,
    "age": 34,
    "fechaNacimiento": "1991-02-24",
    "source": "fc26"
  },
  "udinese|Alessandro Zanoli (RB)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 59,
    "age": 24,
    "fechaNacimiento": "2000-10-03",
    "source": "fc26"
  },
  "udinese|Adam Buksa (ST)": {
    "overall": 73,
    "nationality": "Poland",
    "dorsal": 18,
    "age": 28,
    "fechaNacimiento": "1996-07-12",
    "source": "fc26"
  },
  "venezia|Filip Stanković (GK)": {
    "overall": 74,
    "nationality": "Serbia",
    "dorsal": 1,
    "age": 23,
    "fechaNacimiento": "2002-02-25",
    "source": "fc26"
  },
  "venezia|Gianluca Busio (CM)": {
    "overall": 74,
    "nationality": "United States",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2002-05-28",
    "source": "fc26"
  },
  "venezia|Kike Pérez (CM)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 71,
    "age": 28,
    "fechaNacimiento": "1997-02-14",
    "source": "fc26"
  },
  "venezia|Andrea Adorante (ST)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-02-05",
    "source": "fc26"
  },
  "venezia|Alfred Duncan (CM)": {
    "overall": 72,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "venezia|Lion Lauberbach (ST)": {
    "overall": 71,
    "nationality": "Germany",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-02-15",
    "source": "fc26"
  },
  "venezia|Michael Svoboda (CB)": {
    "overall": 68,
    "nationality": "Austria",
    "dorsal": 30,
    "age": 26,
    "fechaNacimiento": "1998-10-15",
    "source": "fc26"
  },
  "venezia|John Yeboah (ST)": {
    "overall": 70,
    "nationality": "Ecuador",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-06-23",
    "source": "fc26"
  },
  "venezia|Issa Doumbia (CM)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 8,
    "age": 21,
    "fechaNacimiento": "2003-10-16",
    "source": "fc26"
  },
  "venezia|Casas (ST)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 80,
    "age": 25,
    "fechaNacimiento": "2000-03-30",
    "source": "fc26"
  },
  "venezia|Joël Marcel Schingtienne (CB)": {
    "overall": 67,
    "nationality": "Belgium",
    "dorsal": 3,
    "age": 22,
    "fechaNacimiento": "2002-08-14",
    "source": "fc26"
  },
  "bari|Mehdi Dorval (LB)": {
    "overall": 71,
    "nationality": "Algeria",
    "dorsal": 93,
    "age": 24,
    "fechaNacimiento": "2001-02-09",
    "source": "fc26"
  },
  "bari|Lorenzo Dickmann (RB)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 24,
    "age": 28,
    "fechaNacimiento": "1996-09-24",
    "source": "fc26"
  },
  "bari|Giulio Maggiore (CM)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1998-03-12",
    "source": "fc26"
  },
  "bari|Cas Odenthal (CB)": {
    "overall": 69,
    "nationality": "Netherlands",
    "dorsal": 26,
    "age": 24,
    "fechaNacimiento": "2000-09-26",
    "source": "fc26"
  },
  "bari|Christian Gytkjær (ST)": {
    "overall": 70,
    "nationality": "Denmark",
    "dorsal": 9,
    "age": 35,
    "fechaNacimiento": "1990-05-06",
    "source": "fc26"
  },
  "bari|Anthony Partipilo (ST)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 21,
    "age": 30,
    "fechaNacimiento": "1994-10-27",
    "source": "fc26"
  },
  "bari|Andrea Cistana (CB)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 15,
    "age": 28,
    "fechaNacimiento": "1997-04-01",
    "source": "fc26"
  },
  "bari|Gabriele Moncini (ST)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 11,
    "age": 29,
    "fechaNacimiento": "1996-04-26",
    "source": "fc26"
  },
  "bari|Dimitrios Nikolaou (CB)": {
    "overall": 69,
    "nationality": "Greece",
    "dorsal": 43,
    "age": 26,
    "fechaNacimiento": "1998-08-13",
    "source": "fc26"
  },
  "bari|Kevin Piscopo (CAM)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1998-02-06",
    "source": "fc26"
  },
  "bari|Matthias Braunöder (CM)": {
    "overall": 69,
    "nationality": "Austria",
    "dorsal": 27,
    "age": 23,
    "fechaNacimiento": "2002-03-27",
    "source": "fc26"
  },
  "carrarese|Nicolas Schiavi (CM)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 18,
    "age": 30,
    "fechaNacimiento": "1995-02-01",
    "source": "fc26"
  },
  "carrarese|Simone Zanon (RM)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 72,
    "age": 23,
    "fechaNacimiento": "2001-08-30",
    "source": "fc26"
  },
  "carrarese|Julián Illanes (CB)": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1997-03-10",
    "source": "fc26"
  },
  "carrarese|Marco Bleve (GK)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 1,
    "age": 29,
    "fechaNacimiento": "1995-10-18",
    "source": "fc26"
  },
  "carrarese|Luis Hasa (CM)": {
    "overall": 65,
    "nationality": "Italy",
    "dorsal": 70,
    "age": 21,
    "fechaNacimiento": "2004-01-06",
    "source": "fc26"
  },
  "carrarese|Fabio Abiuso (ST)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 9,
    "age": 22,
    "fechaNacimiento": "2003-02-02",
    "source": "fc26"
  },
  "carrarese|Filippo Oliana (CB)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 6,
    "age": 26,
    "fechaNacimiento": "1999-06-30",
    "source": "fc26"
  },
  "carrarese|Emanuele Zuelli (CM)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 17,
    "age": 23,
    "fechaNacimiento": "2001-11-22",
    "source": "fc26"
  },
  "carrarese|Mattia Finotto (ST)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 32,
    "age": 32,
    "fechaNacimiento": "1992-12-28",
    "source": "fc26"
  },
  "carrarese|Vincenzo Fiorillo (GK)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 99,
    "age": 35,
    "fechaNacimiento": "1990-01-13",
    "source": "fc26"
  },
  "carrarese|Bartosz Salamon (CB)": {
    "overall": 68,
    "nationality": "Poland",
    "dorsal": 5,
    "age": 34,
    "fechaNacimiento": "1991-05-01",
    "source": "fc26"
  },
  "catanzaro|Mirko Pigliacelli (GK)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 22,
    "age": 32,
    "fechaNacimiento": "1993-06-30",
    "source": "fc26"
  },
  "catanzaro|Pietro Iemmello (ST)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 9,
    "age": 33,
    "fechaNacimiento": "1992-03-06",
    "source": "fc26"
  },
  "catanzaro|Federico Di Francesco (LW)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 94,
    "age": 31,
    "fechaNacimiento": "1994-06-14",
    "source": "fc26"
  },
  "catanzaro|Jacopo Petriccione (CDM)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1995-02-22",
    "source": "fc26"
  },
  "catanzaro|Marco D'Alessandro (LM)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 77,
    "age": 34,
    "fechaNacimiento": "1991-02-17",
    "source": "fc26"
  },
  "catanzaro|Rémi Oudin (CAM)": {
    "overall": 69,
    "nationality": "France",
    "dorsal": 28,
    "age": 28,
    "fechaNacimiento": "1996-11-18",
    "source": "fc26"
  },
  "catanzaro|Marco Pompetti (CM)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-05-22",
    "source": "fc26"
  },
  "catanzaro|Simone Pontisso (CM)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 20,
    "age": 28,
    "fechaNacimiento": "1997-03-20",
    "source": "fc26"
  },
  "catanzaro|Filippo Pittarello (ST)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1996-10-09",
    "source": "fc26"
  },
  "catanzaro|Tommaso Cassandro (RB)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 84,
    "age": 25,
    "fechaNacimiento": "2000-01-09",
    "source": "fc26"
  },
  "catanzaro|Davide Buglio (CM)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 98,
    "age": 27,
    "fechaNacimiento": "1998-02-26",
    "source": "fc26"
  },
  "cesena|Giovanni Zaro (CB)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 19,
    "age": 31,
    "fechaNacimiento": "1994-05-12",
    "source": "fc26"
  },
  "cesena|Dimitri Bisoli (CM)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 25,
    "age": 31,
    "fechaNacimiento": "1994-03-25",
    "source": "fc26"
  },
  "cesena|Gaetano Castrovilli (CM)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1997-02-17",
    "source": "fc26"
  },
  "cesena|Michele Castagnetti (CDM)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 4,
    "age": 35,
    "fechaNacimiento": "1989-12-27",
    "source": "fc26"
  },
  "cesena|Cristian Shpendi (ST)": {
    "overall": 70,
    "nationality": "Albania",
    "dorsal": 9,
    "age": 22,
    "fechaNacimiento": "2003-05-19",
    "source": "fc26"
  },
  "cesena|Jonathan Klinsmann (GK)": {
    "overall": 67,
    "nationality": "United States",
    "dorsal": 33,
    "age": 28,
    "fechaNacimiento": "1997-04-08",
    "source": "fc26"
  },
  "cesena|Riccardo Ciervo (RM)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 11,
    "age": 23,
    "fechaNacimiento": "2002-04-01",
    "source": "fc26"
  },
  "cesena|Simone Bastoni (CM)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1996-11-05",
    "source": "fc26"
  },
  "cesena|Andrea Ciofi (CB)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 15,
    "age": 26,
    "fechaNacimiento": "1999-06-28",
    "source": "fc26"
  },
  "cesena|Gianluca Frabotta (LB)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 99,
    "age": 26,
    "fechaNacimiento": "1999-06-24",
    "source": "fc26"
  },
  "cesena|Tommaso Berti (CM)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 14,
    "age": 21,
    "fechaNacimiento": "2004-02-07",
    "source": "fc26"
  },
  "cremonese|Emil Audero (GK)": {
    "overall": 78,
    "nationality": "Indonesia",
    "dorsal": 1,
    "age": 28,
    "fechaNacimiento": "1997-01-18",
    "source": "fc26"
  },
  "cremonese|Sebastiano Luperto (CB)": {
    "overall": 76,
    "nationality": "Italy",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1996-09-06",
    "source": "fc26"
  },
  "cremonese|Jamie Vardy (ST)": {
    "overall": 76,
    "nationality": "England",
    "dorsal": 10,
    "age": 38,
    "fechaNacimiento": "1987-01-11",
    "source": "fc26"
  },
  "cremonese|Antonio Sanabria (ST)": {
    "overall": 75,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "cremonese|Federico Baschirotto (CB)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1996-09-20",
    "source": "fc26"
  },
  "cremonese|Alessio Zerbin (RM)": {
    "overall": 73,
    "nationality": "Italy",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1999-03-03",
    "source": "fc26"
  },
  "cremonese|Martín Payero (CM)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 32,
    "age": 26,
    "fechaNacimiento": "1998-09-11",
    "source": "fc26"
  },
  "cremonese|Jari Vandeputte (CM)": {
    "overall": 72,
    "nationality": "Belgium",
    "dorsal": 27,
    "age": 29,
    "fechaNacimiento": "1996-02-14",
    "source": "fc26"
  },
  "cremonese|Federico Bonazzoli (ST)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 90,
    "age": 28,
    "fechaNacimiento": "1997-05-21",
    "source": "fc26"
  },
  "cremonese|Morten Thorsby (CM)": {
    "overall": 72,
    "nationality": "Norway",
    "dorsal": 2,
    "age": 29,
    "fechaNacimiento": "1996-05-05",
    "source": "fc26"
  },
  "cremonese|Marco Silvestri (GK)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 16,
    "age": 34,
    "fechaNacimiento": "1991-03-02",
    "source": "fc26"
  },
  "frosinone|Giacomo Calò (CDM)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 14,
    "age": 28,
    "fechaNacimiento": "1997-02-05",
    "source": "fc26"
  },
  "frosinone|Ilario Monterisi (CB)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 30,
    "age": 23,
    "fechaNacimiento": "2001-12-19",
    "source": "fc26"
  },
  "frosinone|Ilias Koutsoupias (CM)": {
    "overall": 66,
    "nationality": "Greece",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2001-05-10",
    "source": "fc26"
  },
  "frosinone|Farès Ghedjemis (RW)": {
    "overall": 63,
    "nationality": "France",
    "dorsal": 7,
    "age": 22,
    "fechaNacimiento": "2002-09-06",
    "source": "fc26"
  },
  "frosinone|Anthony Oyono (RB)": {
    "overall": 66,
    "nationality": "Gabon",
    "dorsal": 20,
    "age": 24,
    "fechaNacimiento": "2001-04-12",
    "source": "fc26"
  },
  "frosinone|Gabriele Calvani (CB)": {
    "overall": 61,
    "nationality": "Italy",
    "dorsal": 3,
    "age": 21,
    "fechaNacimiento": "2004-01-12",
    "source": "fc26"
  },
  "frosinone|Gabriele Bracaglia (CB)": {
    "overall": 61,
    "nationality": "Italy",
    "dorsal": 79,
    "age": 21,
    "fechaNacimiento": "2003-07-19",
    "source": "fc26"
  },
  "frosinone|Antonio Raimondo (ST)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 9,
    "age": 21,
    "fechaNacimiento": "2004-03-18",
    "source": "fc26"
  },
  "frosinone|Antonio Fiori (LM)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 11,
    "age": 22,
    "fechaNacimiento": "2003-02-21",
    "source": "fc26"
  },
  "frosinone|Lorenzo Palmisani (GK)": {
    "overall": 57,
    "nationality": "Italy",
    "dorsal": 22,
    "age": 21,
    "fechaNacimiento": "2004-06-12",
    "source": "fc26"
  },
  "frosinone|Riccardo Marchizza (LB)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 5,
    "age": 27,
    "fechaNacimiento": "1998-03-26",
    "source": "fc26"
  },
  "juve_stabia|Giuseppe Leone (CM)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 55,
    "age": 24,
    "fechaNacimiento": "2001-05-05",
    "source": "fc26"
  },
  "juve_stabia|Marco Varnier (CB)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 13,
    "age": 27,
    "fechaNacimiento": "1998-06-08",
    "source": "fc26"
  },
  "juve_stabia|Salim Diakité (RB)": {
    "overall": 70,
    "nationality": "Mali",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "2000-06-03",
    "source": "fc26"
  },
  "juve_stabia|Marco Bellich (CB)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 6,
    "age": 26,
    "fechaNacimiento": "1999-05-05",
    "source": "fc26"
  },
  "juve_stabia|Leonardo Candellone (ST)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 27,
    "age": 27,
    "fechaNacimiento": "1997-09-15",
    "source": "fc26"
  },
  "juve_stabia|Andrea Giorgini (CB)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 33,
    "age": 23,
    "fechaNacimiento": "2002-04-22",
    "source": "fc26"
  },
  "juve_stabia|Alessandro Gabrielloni (ST)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 9,
    "age": 30,
    "fechaNacimiento": "1994-07-10",
    "source": "fc26"
  },
  "juve_stabia|Fabio Maistro (CAM)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 37,
    "age": 27,
    "fechaNacimiento": "1998-04-05",
    "source": "fc26"
  },
  "juve_stabia|Nicola Mosti (CAM)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 98,
    "age": 27,
    "fechaNacimiento": "1998-02-07",
    "source": "fc26"
  },
  "juve_stabia|Omar Correia (CDM)": {
    "overall": 64,
    "nationality": "France",
    "dorsal": 29,
    "age": 25,
    "fechaNacimiento": "2000-04-10",
    "source": "fc26"
  },
  "juve_stabia|Christian Pierobon (CM)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2002-03-26",
    "source": "fc26"
  },
  "mantova|Francesco Bardi (GK)": {
    "overall": 73,
    "nationality": "Italy",
    "dorsal": 22,
    "age": 33,
    "fechaNacimiento": "1992-01-18",
    "source": "fc26"
  },
  "mantova|César Falletti (CAM)": {
    "overall": 71,
    "nationality": "Uruguay",
    "dorsal": 18,
    "age": 32,
    "fechaNacimiento": "1992-12-02",
    "source": "fc26"
  },
  "mantova|Leonardo Mancuso (ST)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 9,
    "age": 33,
    "fechaNacimiento": "1992-05-26",
    "source": "fc26"
  },
  "mantova|Davis Mensah (ST)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 7,
    "age": 33,
    "fechaNacimiento": "1991-08-02",
    "source": "fc26"
  },
  "mantova|Davide Bragantini (RM)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 30,
    "age": 21,
    "fechaNacimiento": "2003-08-17",
    "source": "fc26"
  },
  "mantova|Marco Festa (GK)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 1,
    "age": 33,
    "fechaNacimiento": "1992-06-06",
    "source": "fc26"
  },
  "mantova|Tiago Gonçalves (LB)": {
    "overall": 68,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "mantova|Francesco Ruocco (LM)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 19,
    "age": 24,
    "fechaNacimiento": "2001-03-23",
    "source": "fc26"
  },
  "mantova|Andrea Meroni (CB)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 13,
    "age": 28,
    "fechaNacimiento": "1997-01-09",
    "source": "fc26"
  },
  "mantova|Nicolò Radaelli (RB)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 17,
    "age": 22,
    "fechaNacimiento": "2003-01-24",
    "source": "fc26"
  },
  "mantova|Nicolò Buso (LW)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 45,
    "age": 25,
    "fechaNacimiento": "2000-02-01",
    "source": "fc26"
  },
  "modena|Leandro Chichizola (GK)": {
    "overall": 71,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 35,
    "fechaNacimiento": "1990-03-27",
    "source": "fc26"
  },
  "modena|Luca Zanimacchia (RM)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 98,
    "age": 26,
    "fechaNacimiento": "1998-07-19",
    "source": "fc26"
  },
  "modena|Davide Adorni (CB)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 28,
    "age": 32,
    "fechaNacimiento": "1992-08-09",
    "source": "fc26"
  },
  "modena|Francesco Zampano (LB)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 7,
    "age": 31,
    "fechaNacimiento": "1993-09-30",
    "source": "fc26"
  },
  "modena|Simone Santoro (CM)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 8,
    "age": 25,
    "fechaNacimiento": "1999-09-20",
    "source": "fc26"
  },
  "modena|Niklas Pyyhtiä (CM)": {
    "overall": 69,
    "nationality": "Finland",
    "dorsal": 18,
    "age": 21,
    "fechaNacimiento": "2003-09-25",
    "source": "fc26"
  },
  "modena|Daniel Tonoli (CB)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 77,
    "age": 22,
    "fechaNacimiento": "2002-08-22",
    "source": "fc26"
  },
  "modena|Fabio Gerli (CM)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 16,
    "age": 28,
    "fechaNacimiento": "1996-12-23",
    "source": "fc26"
  },
  "modena|Manuel De Luca (ST)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 9,
    "age": 26,
    "fechaNacimiento": "1998-07-17",
    "source": "fc26"
  },
  "modena|Pedro Mendes (ST)": {
    "overall": 70,
    "nationality": "Portugal",
    "dorsal": 11,
    "age": 25,
    "fechaNacimiento": "1999-08-01",
    "source": "fc26"
  },
  "modena|Grégoire Defrel (ST)": {
    "overall": 70,
    "nationality": "France",
    "dorsal": 92,
    "age": 34,
    "fechaNacimiento": "1991-06-17",
    "source": "fc26"
  },
  "palermo|Joel Pohjanpalo (ST)": {
    "overall": 74,
    "nationality": "Finland",
    "dorsal": 20,
    "age": 30,
    "fechaNacimiento": "1994-09-13",
    "source": "fc26"
  },
  "palermo|Tommaso Augello (LB)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 3,
    "age": 30,
    "fechaNacimiento": "1994-08-30",
    "source": "fc26"
  },
  "palermo|Antonio Palumbo (CAM)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1996-08-06",
    "source": "fc26"
  },
  "palermo|Jesse Joronen (GK)": {
    "overall": 69,
    "nationality": "Finland",
    "dorsal": 66,
    "age": 32,
    "fechaNacimiento": "1993-03-21",
    "source": "fc26"
  },
  "palermo|Mattia Bani (CB)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 13,
    "age": 31,
    "fechaNacimiento": "1993-12-10",
    "source": "fc26"
  },
  "palermo|Niccolò Pierozzi (RB)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 27,
    "age": 23,
    "fechaNacimiento": "2001-09-12",
    "source": "fc26"
  },
  "palermo|Filippo Ranocchia (CM)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2001-05-14",
    "source": "fc26"
  },
  "palermo|Giangiacomo Magnani (CB)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 96,
    "age": 29,
    "fechaNacimiento": "1995-10-04",
    "source": "fc26"
  },
  "palermo|Pietro Ceccaroni (CB)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 32,
    "age": 29,
    "fechaNacimiento": "1995-12-21",
    "source": "fc26"
  },
  "palermo|Jacopo Segre (CM)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-02-17",
    "source": "fc26"
  },
  "palermo|Jérémy Le Douaron (CAM)": {
    "overall": 74,
    "nationality": "France",
    "dorsal": 21,
    "age": 27,
    "fechaNacimiento": "1998-04-21",
    "source": "fc26"
  },
  "pisa|Juan Cuadrado (RM)": {
    "overall": 76,
    "nationality": "Colombia",
    "dorsal": 11,
    "age": 37,
    "fechaNacimiento": "1988-05-26",
    "source": "fc26"
  },
  "pisa|Calvin Stengs (CAM)": {
    "overall": 76,
    "nationality": "Netherlands",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1998-12-18",
    "source": "fc26"
  },
  "pisa|Rafiu Durosinmi (ST)": {
    "overall": 75,
    "nationality": "Nigeria",
    "dorsal": 17,
    "age": 22,
    "fechaNacimiento": "2003-01-01",
    "source": "fc26"
  },
  "pisa|Raúl Albiol (CB)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 39,
    "age": 39,
    "fechaNacimiento": "1985-09-04",
    "source": "fc26"
  },
  "pisa|Michel Aebischer (CM)": {
    "overall": 74,
    "nationality": "Switzerland",
    "dorsal": 20,
    "age": 28,
    "fechaNacimiento": "1997-01-06",
    "source": "fc26"
  },
  "pisa|Mattéo Tramoni (CAM)": {
    "overall": 74,
    "nationality": "France",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-01-20",
    "source": "fc26"
  },
  "pisa|Felipe Loyola (CM)": {
    "overall": 69,
    "nationality": "Chile",
    "dorsal": 5,
    "age": 24,
    "fechaNacimiento": "2000-11-09",
    "source": "fc26"
  },
  "pisa|Simone Canestrelli (CB)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 5,
    "age": 24,
    "fechaNacimiento": "2000-09-11",
    "source": "fc26"
  },
  "pisa|Stefano Moreo (ST)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 32,
    "age": 32,
    "fechaNacimiento": "1993-06-30",
    "source": "fc26"
  },
  "pisa|Simone Scuffet (GK)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 22,
    "age": 29,
    "fechaNacimiento": "1996-05-31",
    "source": "fc26"
  },
  "pisa|Samuel Iling-Junior (LM)": {
    "overall": 74,
    "nationality": "England",
    "dorsal": 22,
    "age": 21,
    "fechaNacimiento": "2003-10-04",
    "source": "fc26"
  },
  "reggiana|Manolo Portanova (CM)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 90,
    "age": 25,
    "fechaNacimiento": "2000-06-02",
    "source": "fc26"
  },
  "reggiana|Tommaso Fumagalli (ST)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "2000-02-20",
    "source": "fc26"
  },
  "reggiana|Mario Sampirisi (RB)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 31,
    "age": 32,
    "fechaNacimiento": "1992-10-31",
    "source": "fc26"
  },
  "reggiana|Matteo Rover (RM)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1999-02-20",
    "source": "fc26"
  },
  "reggiana|Cedric Diomandè Gondo (ST)": {
    "overall": 68,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "reggiana|Francesco Vicari (CB)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 23,
    "age": 30,
    "fechaNacimiento": "1994-08-03",
    "source": "fc26"
  },
  "reggiana|Yeferson Paz (RB)": {
    "overall": 68,
    "nationality": "Colombia",
    "dorsal": 17,
    "age": 23,
    "fechaNacimiento": "2002-06-13",
    "source": "fc26"
  },
  "reggiana|Alessandro Micai (GK)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 99,
    "age": 31,
    "fechaNacimiento": "1993-07-24",
    "source": "fc26"
  },
  "reggiana|Andrea Papetti (CB)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 2,
    "age": 22,
    "fechaNacimiento": "2002-07-03",
    "source": "fc26"
  },
  "reggiana|Tobias Reinhart (CM)": {
    "overall": 65,
    "nationality": "Argentina",
    "dorsal": 16,
    "age": 25,
    "fechaNacimiento": "2000-05-21",
    "source": "fc26"
  },
  "reggiana|Danilo Quaranta (CB)": {
    "overall": 66,
    "nationality": "Italy",
    "dorsal": 14,
    "age": 28,
    "fechaNacimiento": "1997-03-23",
    "source": "fc26"
  },
  "sampdoria|Salvatore Esposito (CDM)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 5,
    "age": 24,
    "fechaNacimiento": "2000-10-07",
    "source": "fc26"
  },
  "sampdoria|Massimo Coda (ST)": {
    "overall": 74,
    "nationality": "Italy",
    "dorsal": 9,
    "age": 36,
    "fechaNacimiento": "1988-11-10",
    "source": "fc26"
  },
  "sampdoria|Antonín Barák (CM)": {
    "overall": 75,
    "nationality": "Czechia",
    "dorsal": 72,
    "age": 30,
    "fechaNacimiento": "1994-12-03",
    "source": "fc26"
  },
  "sampdoria|Mattia Viti (CB)": {
    "overall": 72,
    "nationality": "Italy",
    "dorsal": 26,
    "age": 23,
    "fechaNacimiento": "2002-01-24",
    "source": "fc26"
  },
  "sampdoria|Matteo Brunori (CAM)": {
    "overall": 73,
    "nationality": "Italy",
    "dorsal": 9,
    "age": 30,
    "fechaNacimiento": "1994-11-01",
    "source": "fc26"
  },
  "sampdoria|Oliver Abildgaard (CB)": {
    "overall": 70,
    "nationality": "Denmark",
    "dorsal": 28,
    "age": 29,
    "fechaNacimiento": "1996-06-10",
    "source": "fc26"
  },
  "sampdoria|Nicholas Pierini (ST)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 77,
    "age": 26,
    "fechaNacimiento": "1998-08-06",
    "source": "fc26"
  },
  "sampdoria|Fabio Depaoli (RB)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 23,
    "age": 28,
    "fechaNacimiento": "1997-04-24",
    "source": "fc26"
  },
  "sampdoria|Lorenzo Venuti (RB)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 18,
    "age": 30,
    "fechaNacimiento": "1995-04-12",
    "source": "fc26"
  },
  "sampdoria|Jordan Ferri (CDM)": {
    "overall": 73,
    "nationality": "France",
    "dorsal": 4,
    "age": 33,
    "fechaNacimiento": "1992-03-12",
    "source": "fc26"
  },
  "sampdoria|Manuel Cicconi (LM)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 11,
    "age": 28,
    "fechaNacimiento": "1997-06-27",
    "source": "fc26"
  },
  "sassuolo|Domenico Berardi (RW)": {
    "overall": 82,
    "nationality": "Italy",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1994-08-01",
    "source": "fc26"
  },
  "sassuolo|Armand Laurienté (LW)": {
    "overall": 80,
    "nationality": "France",
    "dorsal": 45,
    "age": 26,
    "fechaNacimiento": "1998-12-04",
    "source": "fc26"
  },
  "sassuolo|Nemanja Matić (CDM)": {
    "overall": 77,
    "nationality": "Serbia",
    "dorsal": 18,
    "age": 36,
    "fechaNacimiento": "1988-08-01",
    "source": "fc26"
  },
  "sassuolo|Kristian Thorstvedt (CM)": {
    "overall": 75,
    "nationality": "Norway",
    "dorsal": 42,
    "age": 26,
    "fechaNacimiento": "1999-03-13",
    "source": "fc26"
  },
  "sassuolo|Ismaël Koné (CM)": {
    "overall": 72,
    "nationality": "Canada",
    "dorsal": 90,
    "age": 23,
    "fechaNacimiento": "2002-06-16",
    "source": "fc26"
  },
  "sassuolo|Andrea Pinamonti (ST)": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 99,
    "age": 26,
    "fechaNacimiento": "1999-05-19",
    "source": "fc26"
  },
  "sassuolo|Arijanet Murić (GK)": {
    "overall": 72,
    "nationality": "Kosovo",
    "dorsal": 49,
    "age": 26,
    "fechaNacimiento": "1998-11-07",
    "source": "fc26"
  },
  "sassuolo|Ulisses Garcia (LB)": {
    "overall": 75,
    "nationality": "Switzerland",
    "dorsal": 6,
    "age": 29,
    "fechaNacimiento": "1996-01-11",
    "source": "fc26"
  },
  "sassuolo|Jay Idzes (CB)": {
    "overall": 72,
    "nationality": "Indonesia",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-06-02",
    "source": "fc26"
  },
  "sassuolo|Tarik Muharemović (CB)": {
    "overall": 70,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 80,
    "age": 22,
    "fechaNacimiento": "2003-02-28",
    "source": "fc26"
  },
  "sassuolo|Josh Doig (LB)": {
    "overall": 73,
    "nationality": "Scotland",
    "dorsal": 3,
    "age": 23,
    "fechaNacimiento": "2002-05-18",
    "source": "fc26"
  },
  "spezia|Boris Radunović (GK)": {
    "overall": 70,
    "nationality": "Serbia",
    "dorsal": 31,
    "age": 29,
    "fechaNacimiento": "1996-05-26",
    "source": "fc26"
  },
  "spezia|Alessandro Bellemo (CM)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 14,
    "age": 29,
    "fechaNacimiento": "1995-08-07",
    "source": "fc26"
  },
  "spezia|Filippo Bandinelli (CM)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 25,
    "age": 30,
    "fechaNacimiento": "1995-03-29",
    "source": "fc26"
  },
  "spezia|Gianluca Lapadula (ST)": {
    "overall": 71,
    "nationality": "Peru",
    "dorsal": 10,
    "age": 35,
    "fechaNacimiento": "1990-02-07",
    "source": "fc26"
  },
  "spezia|Leonardo Sernicola (RB)": {
    "overall": 73,
    "nationality": "Italy",
    "dorsal": 17,
    "age": 28,
    "fechaNacimiento": "1997-03-30",
    "source": "fc26"
  },
  "spezia|Marco Ruggero (CB)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "2000-06-01",
    "source": "fc26"
  },
  "spezia|Petko Hristov (CB)": {
    "overall": 70,
    "nationality": "Bulgaria",
    "dorsal": 55,
    "age": 26,
    "fechaNacimiento": "1999-03-01",
    "source": "fc26"
  },
  "spezia|Szymon Żurkowski (CM)": {
    "overall": 69,
    "nationality": "Poland",
    "dorsal": 14,
    "age": 27,
    "fechaNacimiento": "1997-09-25",
    "source": "fc26"
  },
  "spezia|Giuseppe Aurelio (LB)": {
    "overall": 68,
    "nationality": "Italy",
    "dorsal": 31,
    "age": 25,
    "fechaNacimiento": "2000-03-22",
    "source": "fc26"
  },
  "spezia|Mattia Valoti (CAM)": {
    "overall": 70,
    "nationality": "Italy",
    "dorsal": 8,
    "age": 31,
    "fechaNacimiento": "1993-09-06",
    "source": "fc26"
  },
  "spezia|Ádám Nagy (CM)": {
    "overall": 70,
    "nationality": "Hungary",
    "dorsal": 8,
    "age": 30,
    "fechaNacimiento": "1995-06-17",
    "source": "fc26"
  },
  "aj_auxerre|Donovan Léon (GK)": {
    "overall": 76,
    "nationality": "France",
    "dorsal": 16,
    "age": 32,
    "fechaNacimiento": "1992-11-03",
    "source": "fc26"
  },
  "aj_auxerre|Romain Faivre (RM)": {
    "overall": 76,
    "nationality": "France",
    "dorsal": 21,
    "age": 26,
    "fechaNacimiento": "1998-07-14",
    "source": "fc26"
  },
  "aj_auxerre|Kévin Danois (CM)": {
    "overall": 74,
    "nationality": "France",
    "dorsal": 5,
    "age": 21,
    "fechaNacimiento": "2004-06-28",
    "source": "fc26"
  },
  "aj_auxerre|Lassine Sinayoko (ST)": {
    "overall": 74,
    "nationality": "Mali",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "1999-12-08",
    "source": "fc26"
  },
  "aj_auxerre|Clément Akpa (CB)": {
    "overall": 74,
    "nationality": "Côte d'Ivoire",
    "dorsal": 92,
    "age": 23,
    "fechaNacimiento": "2001-11-24",
    "source": "fc26"
  },
  "aj_auxerre|Gideon Mensah (LB)": {
    "overall": 74,
    "nationality": "Ghana",
    "dorsal": 14,
    "age": 26,
    "fechaNacimiento": "1998-07-18",
    "source": "fc26"
  },
  "aj_auxerre|Sinaly Diomandé (CB)": {
    "overall": 73,
    "nationality": "Côte d'Ivoire",
    "dorsal": 20,
    "age": 24,
    "fechaNacimiento": "2001-04-09",
    "source": "fc26"
  },
  "aj_auxerre|Elisha Owusu (CDM)": {
    "overall": 73,
    "nationality": "Ghana",
    "dorsal": 42,
    "age": 27,
    "fechaNacimiento": "1997-11-07",
    "source": "fc26"
  },
  "aj_auxerre|Danny Namaso (LM)": {
    "overall": 73,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "aj_auxerre|Josué Casimir (RM)": {
    "overall": 71,
    "nationality": "France",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2001-09-24",
    "source": "fc26"
  },
  "aj_auxerre|Oussama El Azzouzi (CDM)": {
    "overall": 68,
    "nationality": "Morocco",
    "dorsal": 17,
    "age": 24,
    "fechaNacimiento": "2001-05-29",
    "source": "fc26"
  },
  "angers_sco|Hervé Koffi (GK)": {
    "overall": 78,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "angers_sco|Jordan Lefort (CB)": {
    "overall": 73,
    "nationality": "France",
    "dorsal": 21,
    "age": 31,
    "fechaNacimiento": "1993-08-09",
    "source": "fc26"
  },
  "angers_sco|Haris Belkebla (CDM)": {
    "overall": 74,
    "nationality": "Algeria",
    "dorsal": 93,
    "age": 31,
    "fechaNacimiento": "1994-01-28",
    "source": "fc26"
  },
  "angers_sco|Ousmane Camara (CB)": {
    "overall": 69,
    "nationality": "France",
    "dorsal": 4,
    "age": 22,
    "fechaNacimiento": "2003-03-06",
    "source": "fc26"
  },
  "angers_sco|Carlens Arcus (RB)": {
    "overall": 71,
    "nationality": "Haiti",
    "dorsal": 2,
    "age": 29,
    "fechaNacimiento": "1996-06-28",
    "source": "fc26"
  },
  "angers_sco|Jacques Ekomié (LB)": {
    "overall": 68,
    "nationality": "Gabon",
    "dorsal": 3,
    "age": 21,
    "fechaNacimiento": "2003-08-19",
    "source": "fc26"
  },
  "angers_sco|Branco van den Boomen (CM)": {
    "overall": 73,
    "nationality": "Netherlands",
    "dorsal": 21,
    "age": 29,
    "fechaNacimiento": "1995-07-21",
    "source": "fc26"
  },
  "angers_sco|Yassin Belkhdim (CM)": {
    "overall": 70,
    "nationality": "France",
    "dorsal": 14,
    "age": 23,
    "fechaNacimiento": "2002-02-14",
    "source": "fc26"
  },
  "angers_sco|Amine Sbaï (LM)": {
    "overall": 72,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "angers_sco|Louis Mouton (CAM)": {
    "overall": 70,
    "nationality": "France",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2002-06-03",
    "source": "fc26"
  },
  "angers_sco|Goduine Koyalipou (ST)": {
    "overall": 73,
    "nationality": "Central African Republic",
    "dorsal": 15,
    "age": 25,
    "fechaNacimiento": "2000-02-15",
    "source": "fc26"
  },
  "as_monaco|Denis Zakaria (CDM)": {
    "overall": 82,
    "nationality": "Switzerland",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1996-11-20",
    "source": "fc26"
  },
  "as_monaco|Lukáš Hrádecký (GK)": {
    "overall": 81,
    "nationality": "Finland",
    "dorsal": 1,
    "age": 35,
    "fechaNacimiento": "1989-11-24",
    "source": "fc26"
  },
  "as_monaco|Maghnes Akliouche (CAM)": {
    "overall": 80,
    "nationality": "France",
    "dorsal": 11,
    "age": 23,
    "fechaNacimiento": "2002-02-25",
    "source": "fc26"
  },
  "as_monaco|Lamine Camara (CM)": {
    "overall": 77,
    "nationality": "Senegal",
    "dorsal": 15,
    "age": 21,
    "fechaNacimiento": "2004-01-01",
    "source": "fc26"
  },
  "as_monaco|Alexandr Golovin (CAM)": {
    "overall": 79,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "as_monaco|Folarin Balogun (ST)": {
    "overall": 77,
    "nationality": "United States",
    "dorsal": 9,
    "age": 23,
    "fechaNacimiento": "2001-07-03",
    "source": "fc26"
  },
  "as_monaco|Thilo Kehrer (CB)": {
    "overall": 78,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "as_monaco|Paul Pogba (CM)": {
    "overall": 79,
    "nationality": "France",
    "dorsal": 8,
    "age": 32,
    "fechaNacimiento": "1993-03-15",
    "source": "fc26"
  },
  "as_monaco|Eric Dier (CB)": {
    "overall": 79,
    "nationality": "England",
    "dorsal": 3,
    "age": 31,
    "fechaNacimiento": "1994-01-15",
    "source": "fc26"
  },
  "as_monaco|Takumi Minamino (LM)": {
    "overall": 78,
    "nationality": "Japan",
    "dorsal": 18,
    "age": 30,
    "fechaNacimiento": "1995-01-16",
    "source": "fc26"
  },
  "as_monaco|Vanderson (RB)": {
    "overall": 77,
    "nationality": "Brazil",
    "dorsal": 2,
    "age": 24,
    "fechaNacimiento": "2001-06-21",
    "source": "fc26"
  },
  "as_saint_etienne|Lucas Stassin (ST)": {
    "overall": 75,
    "nationality": "Belgium",
    "dorsal": 32,
    "age": 20,
    "fechaNacimiento": "2004-11-29",
    "source": "fc26"
  },
  "as_saint_etienne|Gautier Larsonneur (GK)": {
    "overall": 74,
    "nationality": "France",
    "dorsal": 30,
    "age": 28,
    "fechaNacimiento": "1997-02-23",
    "source": "fc26"
  },
  "as_saint_etienne|Julien Le Cardinal (CB)": {
    "overall": 74,
    "nationality": "France",
    "dorsal": 26,
    "age": 27,
    "fechaNacimiento": "1997-08-03",
    "source": "fc26"
  },
  "as_saint_etienne|Zuriko Davitashvili (LW)": {
    "overall": 74,
    "nationality": "Georgia",
    "dorsal": 22,
    "age": 24,
    "fechaNacimiento": "2001-02-15",
    "source": "fc26"
  },
  "as_saint_etienne|Irvin Cardona (RW)": {
    "overall": 73,
    "nationality": "France",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1997-08-08",
    "source": "fc26"
  },
  "as_saint_etienne|Augustine Boakye (RW)": {
    "overall": 69,
    "nationality": "Ghana",
    "dorsal": 20,
    "age": 24,
    "fechaNacimiento": "2000-11-03",
    "source": "fc26"
  },
  "as_saint_etienne|João Ferreira (RB)": {
    "overall": 71,
    "nationality": "Portugal",
    "dorsal": 13,
    "age": 24,
    "fechaNacimiento": "2001-03-22",
    "source": "fc26"
  },
  "as_saint_etienne|Chico Lamba (CB)": {
    "overall": 70,
    "nationality": "Portugal",
    "dorsal": 15,
    "age": 22,
    "fechaNacimiento": "2003-03-10",
    "source": "fc26"
  },
  "as_saint_etienne|Mickaël Nadé (CB)": {
    "overall": 71,
    "nationality": "France",
    "dorsal": 3,
    "age": 26,
    "fechaNacimiento": "1999-03-04",
    "source": "fc26"
  },
  "as_saint_etienne|Florian Tardieu (CM)": {
    "overall": 71,
    "nationality": "France",
    "dorsal": 10,
    "age": 33,
    "fechaNacimiento": "1992-04-22",
    "source": "fc26"
  },
  "as_saint_etienne|Maxime Bernauer (CB)": {
    "overall": 69,
    "nationality": "France",
    "dorsal": 23,
    "age": 27,
    "fechaNacimiento": "1998-07-01",
    "source": "fc26"
  },
  "le_havre_ac|Abdoulaye Touré (CDM)": {
    "overall": 75,
    "nationality": "Guinea",
    "dorsal": 94,
    "age": 31,
    "fechaNacimiento": "1994-03-03",
    "source": "fc26"
  },
  "le_havre_ac|Arouna Sangante (CB)": {
    "overall": 73,
    "nationality": "Senegal",
    "dorsal": 93,
    "age": 23,
    "fechaNacimiento": "2002-04-12",
    "source": "fc26"
  },
  "le_havre_ac|Gautier Lloris (CB)": {
    "overall": 74,
    "nationality": "France",
    "dorsal": 4,
    "age": 29,
    "fechaNacimiento": "1995-07-18",
    "source": "fc26"
  },
  "le_havre_ac|Sofiane Boufal (CAM)": {
    "overall": 74,
    "nationality": "Morocco",
    "dorsal": 23,
    "age": 31,
    "fechaNacimiento": "1993-09-17",
    "source": "fc26"
  },
  "le_havre_ac|Issa Soumaré (LM)": {
    "overall": 72,
    "nationality": "Senegal",
    "dorsal": 45,
    "age": 24,
    "fechaNacimiento": "2000-10-10",
    "source": "fc26"
  },
  "le_havre_ac|Yassine Kechta (CM)": {
    "overall": 73,
    "nationality": "Morocco",
    "dorsal": 8,
    "age": 23,
    "fechaNacimiento": "2002-02-25",
    "source": "fc26"
  },
  "le_havre_ac|Mory Diaw (GK)": {
    "overall": 70,
    "nationality": "Senegal",
    "dorsal": 99,
    "age": 32,
    "fechaNacimiento": "1993-06-22",
    "source": "fc26"
  },
  "le_havre_ac|Ayumu Seko (CDM)": {
    "overall": 69,
    "nationality": "Japan",
    "dorsal": 15,
    "age": 25,
    "fechaNacimiento": "2000-06-07",
    "source": "fc26"
  },
  "le_havre_ac|Rassoul Ndiaye (CM)": {
    "overall": 70,
    "nationality": "Senegal",
    "dorsal": 14,
    "age": 23,
    "fechaNacimiento": "2001-12-11",
    "source": "fc26"
  },
  "le_havre_ac|Loïc Négo (RB)": {
    "overall": 72,
    "nationality": "Hungary",
    "dorsal": 7,
    "age": 34,
    "fechaNacimiento": "1991-01-15",
    "source": "fc26"
  },
  "le_havre_ac|Étienne Youté Kinkoué (CB)": {
    "overall": 72,
    "nationality": "France",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2002-01-14",
    "source": "fc26"
  },
  "montpellier_hsc|Téji Savanier (CAM)": {
    "overall": 75,
    "nationality": "France",
    "dorsal": 11,
    "age": 33,
    "fechaNacimiento": "1991-12-22",
    "source": "fc26"
  },
  "montpellier_hsc|Julien Laporte (CB)": {
    "overall": 73,
    "nationality": "France",
    "dorsal": 15,
    "age": 31,
    "fechaNacimiento": "1993-11-04",
    "source": "fc26"
  },
  "montpellier_hsc|Enzo Tchato (RB)": {
    "overall": 71,
    "nationality": "Cameroon",
    "dorsal": 29,
    "age": 22,
    "fechaNacimiento": "2002-11-23",
    "source": "fc26"
  },
  "montpellier_hsc|Christopher Jullien (CB)": {
    "overall": 71,
    "nationality": "France",
    "dorsal": 6,
    "age": 32,
    "fechaNacimiento": "1993-03-22",
    "source": "fc26"
  },
  "montpellier_hsc|Alexandre Mendy (ST)": {
    "overall": 71,
    "nationality": "Guinea-Bissau",
    "dorsal": 19,
    "age": 31,
    "fechaNacimiento": "1994-03-20",
    "source": "fc26"
  },
  "montpellier_hsc|Nathanaël Mbuku (RM)": {
    "overall": 70,
    "nationality": "Congo DR",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2002-03-16",
    "source": "fc26"
  },
  "montpellier_hsc|Khalil Fayad (CM)": {
    "overall": 70,
    "nationality": "Morocco",
    "dorsal": 10,
    "age": 21,
    "fechaNacimiento": "2004-06-09",
    "source": "fc26"
  },
  "montpellier_hsc|Théo Sainte-Luce (LB)": {
    "overall": 69,
    "nationality": "France",
    "dorsal": 17,
    "age": 26,
    "fechaNacimiento": "1998-10-20",
    "source": "fc26"
  },
  "montpellier_hsc|Lucas Mincarelli (LB)": {
    "overall": 71,
    "nationality": "France",
    "dorsal": 21,
    "age": 21,
    "fechaNacimiento": "2004-01-05",
    "source": "fc26"
  },
  "montpellier_hsc|Simon Ngapandouetnbu (GK)": {
    "overall": 66,
    "nationality": "Cameroon",
    "dorsal": 31,
    "age": 22,
    "fechaNacimiento": "2003-04-12",
    "source": "fc26"
  },
  "montpellier_hsc|Mathieu Michel (GK)": {
    "overall": 66,
    "nationality": "France",
    "dorsal": 1,
    "age": 33,
    "fechaNacimiento": "1991-09-04",
    "source": "fc26"
  },
  "olympique_lyonnais|Corentin Tolisso (CM)": {
    "overall": 81,
    "nationality": "France",
    "dorsal": 8,
    "age": 30,
    "fechaNacimiento": "1994-08-03",
    "source": "fc26"
  },
  "olympique_lyonnais|Moussa Niakhaté (CB)": {
    "overall": 77,
    "nationality": "Senegal",
    "dorsal": 19,
    "age": 29,
    "fechaNacimiento": "1996-03-08",
    "source": "fc26"
  },
  "olympique_lyonnais|Dominik Greif (GK)": {
    "overall": 78,
    "nationality": "Slovakia",
    "dorsal": 1,
    "age": 28,
    "fechaNacimiento": "1997-04-06",
    "source": "fc26"
  },
  "olympique_lyonnais|Nicolás Tagliafico (LB)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 3,
    "age": 32,
    "fechaNacimiento": "1992-08-31",
    "source": "fc26"
  },
  "olympique_lyonnais|Tyler Morton (CDM)": {
    "overall": 74,
    "nationality": "England",
    "dorsal": 23,
    "age": 22,
    "fechaNacimiento": "2002-10-31",
    "source": "fc26"
  },
  "olympique_lyonnais|Endrick (ST)": {
    "overall": 77,
    "nationality": "Brazil",
    "dorsal": 9,
    "age": 18,
    "fechaNacimiento": "2006-07-21",
    "source": "fc26"
  },
  "olympique_lyonnais|Pavel Šulc (CAM)": {
    "overall": 77,
    "nationality": "Czechia",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2000-12-29",
    "source": "fc26"
  },
  "olympique_lyonnais|Malick Fofana (LM)": {
    "overall": 78,
    "nationality": "Belgium",
    "dorsal": 11,
    "age": 20,
    "fechaNacimiento": "2005-03-31",
    "source": "fc26"
  },
  "olympique_lyonnais|Ainsley Maitland-Niles (RB)": {
    "overall": 77,
    "nationality": "England",
    "dorsal": 98,
    "age": 27,
    "fechaNacimiento": "1997-08-29",
    "source": "fc26"
  },
  "olympique_lyonnais|Clinton Mata (CB)": {
    "overall": 77,
    "nationality": "Angola",
    "dorsal": 22,
    "age": 32,
    "fechaNacimiento": "1992-11-07",
    "source": "fc26"
  },
  "olympique_lyonnais|Tanner Tessmann (CDM)": {
    "overall": 76,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "olympique_de_marseille|Mason Greenwood (RM)": {
    "overall": 82,
    "nationality": "England",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2001-10-01",
    "source": "fc26"
  },
  "olympique_de_marseille|Gerónimo Rulli (GK)": {
    "overall": 82,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 33,
    "fechaNacimiento": "1992-05-20",
    "source": "fc26"
  },
  "olympique_de_marseille|Benjamin Pavard (CB)": {
    "overall": 84,
    "nationality": "France",
    "dorsal": 28,
    "age": 29,
    "fechaNacimiento": "1996-03-28",
    "source": "fc26"
  },
  "olympique_de_marseille|Pierre-Emile Højbjerg (CDM)": {
    "overall": 82,
    "nationality": "Denmark",
    "dorsal": 23,
    "age": 29,
    "fechaNacimiento": "1995-08-05",
    "source": "fc26"
  },
  "olympique_de_marseille|Pierre-Emerick Aubameyang (ST)": {
    "overall": 81,
    "nationality": "Gabon",
    "dorsal": 97,
    "age": 36,
    "fechaNacimiento": "1989-06-18",
    "source": "fc26"
  },
  "olympique_de_marseille|Nayef Aguerd (CB)": {
    "overall": 81,
    "nationality": "Morocco",
    "dorsal": 21,
    "age": 29,
    "fechaNacimiento": "1996-03-30",
    "source": "fc26"
  },
  "olympique_de_marseille|Leonardo Balerdi (CB)": {
    "overall": 81,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 26,
    "fechaNacimiento": "1999-01-26",
    "source": "fc26"
  },
  "olympique_de_marseille|Igor Paixão (LM)": {
    "overall": 80,
    "nationality": "Brazil",
    "dorsal": 14,
    "age": 25,
    "fechaNacimiento": "2000-06-28",
    "source": "fc26"
  },
  "olympique_de_marseille|Quinten Timber (CM)": {
    "overall": 80,
    "nationality": "Netherlands",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2001-06-17",
    "source": "fc26"
  },
  "olympique_de_marseille|Facundo Medina (CB)": {
    "overall": 79,
    "nationality": "Argentina",
    "dorsal": 32,
    "age": 26,
    "fechaNacimiento": "1999-05-28",
    "source": "fc26"
  },
  "olympique_de_marseille|Amine Gouiri (ST)": {
    "overall": 79,
    "nationality": "Algeria",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-02-16",
    "source": "fc26"
  },
  "paris_saint_germain|Vitinha (CM)": {
    "overall": 89,
    "nationality": "Portugal",
    "dorsal": 17,
    "age": 25,
    "fechaNacimiento": "2000-02-13",
    "source": "fc26"
  },
  "paris_saint_germain|Ousmane Dembélé (ST)": {
    "overall": 90,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "paris_saint_germain|Achraf Hakimi (RB)": {
    "overall": 89,
    "nationality": "Morocco",
    "dorsal": 2,
    "age": 26,
    "fechaNacimiento": "1998-11-04",
    "source": "fc26"
  },
  "paris_saint_germain|Nuno Mendes (LB)": {
    "overall": 86,
    "nationality": "Portugal",
    "dorsal": 25,
    "age": 23,
    "fechaNacimiento": "2002-06-19",
    "source": "fc26"
  },
  "paris_saint_germain|Marquinhos (CB)": {
    "overall": 87,
    "nationality": "Brazil",
    "dorsal": 5,
    "age": 31,
    "fechaNacimiento": "1994-05-14",
    "source": "fc26"
  },
  "paris_saint_germain|Willian Pacho (CB)": {
    "overall": 86,
    "nationality": "Ecuador",
    "dorsal": 51,
    "age": 23,
    "fechaNacimiento": "2001-10-16",
    "source": "fc26"
  },
  "paris_saint_germain|João Neves (CM)": {
    "overall": 85,
    "nationality": "Portugal",
    "dorsal": 87,
    "age": 20,
    "fechaNacimiento": "2004-09-27",
    "source": "fc26"
  },
  "paris_saint_germain|Khvicha Kvaratskhelia (LW)": {
    "overall": 87,
    "nationality": "Georgia",
    "dorsal": 7,
    "age": 24,
    "fechaNacimiento": "2001-02-12",
    "source": "fc26"
  },
  "paris_saint_germain|Fabián Ruiz (CM)": {
    "overall": 85,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1996-04-03",
    "source": "fc26"
  },
  "paris_saint_germain|Désiré Doué (RW)": {
    "overall": 85,
    "nationality": "France",
    "dorsal": 14,
    "age": 20,
    "fechaNacimiento": "2005-06-03",
    "source": "fc26"
  },
  "paris_saint_germain|Bradley Barcola (LW)": {
    "overall": 84,
    "nationality": "France",
    "dorsal": 29,
    "age": 22,
    "fechaNacimiento": "2002-09-02",
    "source": "fc26"
  },
  "stade_de_reims|Keito Nakamura (LM)": {
    "overall": 76,
    "nationality": "Japan",
    "dorsal": 17,
    "age": 24,
    "fechaNacimiento": "2000-07-28",
    "source": "fc26"
  },
  "stade_de_reims|Nicolas Pallois (CB)": {
    "overall": 73,
    "nationality": "France",
    "dorsal": 5,
    "age": 37,
    "fechaNacimiento": "1987-09-19",
    "source": "fc26"
  },
  "stade_de_reims|Joseph Okumu (CB)": {
    "overall": 73,
    "nationality": "Kenya",
    "dorsal": 2,
    "age": 28,
    "fechaNacimiento": "1997-05-26",
    "source": "fc26"
  },
  "stade_de_reims|Akieme (LB)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1997-12-16",
    "source": "fc26"
  },
  "stade_de_reims|Théo Leoni (CDM)": {
    "overall": 72,
    "nationality": "Belgium",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "2000-04-21",
    "source": "fc26"
  },
  "stade_de_reims|Mory Gbane (CDM)": {
    "overall": 70,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "stade_de_reims|Yassine Benhattab (RW)": {
    "overall": 67,
    "nationality": "France",
    "dorsal": 90,
    "age": 22,
    "fechaNacimiento": "2002-11-18",
    "source": "fc26"
  },
  "stade_de_reims|Ewen Jaouen (GK)": {
    "overall": 68,
    "nationality": "France",
    "dorsal": 29,
    "age": 19,
    "fechaNacimiento": "2005-12-29",
    "source": "fc26"
  },
  "stade_de_reims|Maxime Busi (RB)": {
    "overall": 68,
    "nationality": "Belgium",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "1999-10-14",
    "source": "fc26"
  },
  "stade_de_reims|Hiroki Sekine (RB)": {
    "overall": 71,
    "nationality": "Japan",
    "dorsal": 3,
    "age": 22,
    "fechaNacimiento": "2002-08-11",
    "source": "fc26"
  },
  "stade_de_reims|Alexandre Olliero (GK)": {
    "overall": 68,
    "nationality": "France",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1996-02-15",
    "source": "fc26"
  },
  "toulouse_fc|Guillaume Restes (GK)": {
    "overall": 78,
    "nationality": "France",
    "dorsal": 1,
    "age": 20,
    "fechaNacimiento": "2005-03-11",
    "source": "fc26"
  },
  "toulouse_fc|Charlie Cresswell (CB)": {
    "overall": 74,
    "nationality": "England",
    "dorsal": 4,
    "age": 22,
    "fechaNacimiento": "2002-08-17",
    "source": "fc26"
  },
  "toulouse_fc|Rasmus Nicolaisen (CB)": {
    "overall": 76,
    "nationality": "Denmark",
    "dorsal": 2,
    "age": 28,
    "fechaNacimiento": "1997-03-16",
    "source": "fc26"
  },
  "toulouse_fc|Yann Gboho (LW)": {
    "overall": 76,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "toulouse_fc|Djibril Sidibé (RB)": {
    "overall": 74,
    "nationality": "France",
    "dorsal": 19,
    "age": 32,
    "fechaNacimiento": "1992-07-29",
    "source": "fc26"
  },
  "toulouse_fc|Aron Dønnum (RM)": {
    "overall": 75,
    "nationality": "Norway",
    "dorsal": 15,
    "age": 27,
    "fechaNacimiento": "1998-04-20",
    "source": "fc26"
  },
  "toulouse_fc|Mark McKenzie (CB)": {
    "overall": 74,
    "nationality": "United States",
    "dorsal": 3,
    "age": 26,
    "fechaNacimiento": "1999-02-25",
    "source": "fc26"
  },
  "toulouse_fc|Cristian Cásseres Jr (CDM)": {
    "overall": 74,
    "nationality": "Venezuela",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "2000-01-20",
    "source": "fc26"
  },
  "toulouse_fc|Emersonn (ST)": {
    "overall": 65,
    "nationality": "Brazil",
    "dorsal": 20,
    "age": 20,
    "fechaNacimiento": "2004-07-16",
    "source": "fc26"
  },
  "toulouse_fc|Warren Kamanzi (RB)": {
    "overall": 72,
    "nationality": "Norway",
    "dorsal": 12,
    "age": 24,
    "fechaNacimiento": "2000-11-11",
    "source": "fc26"
  },
  "toulouse_fc|Frank Magri (ST)": {
    "overall": 72,
    "nationality": "Cameroon",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "1999-09-04",
    "source": "fc26"
  },
  "ajax|Josip Šutalo (CB)": {
    "overall": 78,
    "nationality": "Croatia",
    "dorsal": 37,
    "age": 25,
    "fechaNacimiento": "2000-02-28",
    "source": "fc26"
  },
  "ajax|Youri Baas (CB)": {
    "overall": 75,
    "nationality": "Netherlands",
    "dorsal": 15,
    "age": 22,
    "fechaNacimiento": "2003-03-17",
    "source": "fc26"
  },
  "ajax|Takehiro Tomiyasu (RB)": {
    "overall": 77,
    "dorsal": 32,
    "source": "latamfc26"
  },
  "ajax|Steven Berghuis (RW)": {
    "overall": 78,
    "nationality": "Netherlands",
    "dorsal": 23,
    "age": 33,
    "fechaNacimiento": "1991-12-19",
    "source": "fc26"
  },
  "ajax|Wout Weghorst (ST)": {
    "overall": 78,
    "nationality": "Netherlands",
    "dorsal": 25,
    "age": 32,
    "fechaNacimiento": "1992-08-07",
    "source": "fc26"
  },
  "ajax|Mika Godts (LW)": {
    "overall": 74,
    "nationality": "Belgium",
    "dorsal": 11,
    "age": 20,
    "fechaNacimiento": "2005-06-07",
    "source": "fc26"
  },
  "ajax|Oscar Gloukh (CAM)": {
    "overall": 76,
    "nationality": "Israel",
    "dorsal": 10,
    "age": 21,
    "fechaNacimiento": "2004-04-01",
    "source": "fc26"
  },
  "ajax|Kasper Dolberg (ST)": {
    "overall": 77,
    "nationality": "Denmark",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1997-10-06",
    "source": "fc26"
  },
  "ajax|Oleksandr Zinchenko (LB)": {
    "overall": 77,
    "nationality": "Ukraine",
    "dorsal": 35,
    "age": 28,
    "fechaNacimiento": "1996-12-15",
    "source": "fc26"
  },
  "ajax|Davy Klaassen (CM)": {
    "overall": 77,
    "nationality": "Netherlands",
    "dorsal": 18,
    "age": 32,
    "fechaNacimiento": "1993-02-21",
    "source": "fc26"
  },
  "ajax|Ko Itakura (CB)": {
    "overall": 77,
    "nationality": "Japan",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1997-01-27",
    "source": "fc26"
  },
  "az|Jordy Clasie (CDM)": {
    "overall": 79,
    "nationality": "Netherlands",
    "dorsal": 8,
    "age": 34,
    "fechaNacimiento": "1991-06-27",
    "source": "fc26"
  },
  "az|Troy Parrott (ST)": {
    "overall": 74,
    "nationality": "Republic of Ireland",
    "dorsal": 9,
    "age": 23,
    "fechaNacimiento": "2002-02-04",
    "source": "fc26"
  },
  "az|Wouter Goes (CB)": {
    "overall": 77,
    "nationality": "Netherlands",
    "dorsal": 3,
    "age": 21,
    "fechaNacimiento": "2004-06-10",
    "source": "fc26"
  },
  "az|Sven Mijnans (CAM)": {
    "overall": 75,
    "nationality": "Netherlands",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-03-09",
    "source": "fc26"
  },
  "az|Kees Smit (CAM)": {
    "overall": 72,
    "nationality": "Netherlands",
    "dorsal": 26,
    "age": 19,
    "fechaNacimiento": "2006-01-20",
    "source": "fc26"
  },
  "az|Matěj Šín (CAM)": {
    "overall": 74,
    "nationality": "Czechia",
    "dorsal": 7,
    "age": 21,
    "fechaNacimiento": "2004-06-02",
    "source": "fc26"
  },
  "az|Alexandre Penetra (CB)": {
    "overall": 74,
    "nationality": "Portugal",
    "dorsal": 5,
    "age": 23,
    "fechaNacimiento": "2001-09-09",
    "source": "fc26"
  },
  "az|Seiya Maikuma (RB)": {
    "overall": 74,
    "nationality": "Japan",
    "dorsal": 2,
    "age": 27,
    "fechaNacimiento": "1997-10-16",
    "source": "fc26"
  },
  "az|Mexx Meerdink (ST)": {
    "overall": 73,
    "nationality": "Netherlands",
    "dorsal": 35,
    "age": 21,
    "fechaNacimiento": "2003-07-24",
    "source": "fc26"
  },
  "az|Patati (RM)": {
    "overall": 72,
    "nationality": "Brazil",
    "dorsal": 33,
    "age": 21,
    "fechaNacimiento": "2003-10-01",
    "source": "fc26"
  },
  "az|Peer Koopmeiners (CDM)": {
    "overall": 74,
    "nationality": "Netherlands",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "2000-05-04",
    "source": "fc26"
  },
  "fc_groningen|Stije Resink (CDM)": {
    "overall": 69,
    "nationality": "Netherlands",
    "dorsal": 6,
    "age": 22,
    "fechaNacimiento": "2003-05-28",
    "source": "fc26"
  },
  "fc_groningen|Etienne Vaessen (GK)": {
    "overall": 70,
    "nationality": "Suriname",
    "dorsal": 1,
    "age": 29,
    "fechaNacimiento": "1995-07-26",
    "source": "fc26"
  },
  "fc_groningen|Thijmen Blokzijl (CB)": {
    "overall": 67,
    "nationality": "Netherlands",
    "dorsal": 3,
    "age": 20,
    "fechaNacimiento": "2005-02-25",
    "source": "fc26"
  },
  "fc_groningen|Marvin Peersman (LB)": {
    "overall": 68,
    "nationality": "Belgium",
    "dorsal": 43,
    "age": 34,
    "fechaNacimiento": "1991-02-10",
    "source": "fc26"
  },
  "fc_groningen|Marco Rente (RB)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-02-25",
    "source": "fc26"
  },
  "fc_groningen|Dies Janse (CB)": {
    "overall": 66,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 19,
    "fechaNacimiento": "2006-01-17",
    "source": "fc26"
  },
  "fc_groningen|Younes Taha (CAM)": {
    "overall": 67,
    "nationality": "Morocco",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2002-11-27",
    "source": "fc26"
  },
  "fc_groningen|Thom van Bergen (ST)": {
    "overall": 67,
    "nationality": "Netherlands",
    "dorsal": 26,
    "age": 21,
    "fechaNacimiento": "2004-01-06",
    "source": "fc26"
  },
  "fc_groningen|Brynjólfur Willumsson (ST)": {
    "overall": 66,
    "nationality": "Iceland",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-08-12",
    "source": "fc26"
  },
  "fc_groningen|Tygo Land (CM)": {
    "overall": 68,
    "nationality": "Netherlands",
    "dorsal": 18,
    "age": 19,
    "fechaNacimiento": "2006-01-11",
    "source": "fc26"
  },
  "fc_groningen|Tika de Jonge (CM)": {
    "overall": 66,
    "nationality": "Netherlands",
    "dorsal": 8,
    "age": 22,
    "fechaNacimiento": "2003-03-11",
    "source": "fc26"
  },
  "fc_twente|Lars Unnerstall (GK)": {
    "overall": 78,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 34,
    "fechaNacimiento": "1990-07-20",
    "source": "fc26"
  },
  "fc_twente|Bart van Rooij (RB)": {
    "overall": 74,
    "nationality": "Netherlands",
    "dorsal": 28,
    "age": 24,
    "fechaNacimiento": "2001-05-26",
    "source": "fc26"
  },
  "fc_twente|Ramiz Zerrouki (CDM)": {
    "overall": 73,
    "nationality": "Algeria",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1998-05-26",
    "source": "fc26"
  },
  "fc_twente|Robin Pröpper (CB)": {
    "overall": 73,
    "nationality": "Netherlands",
    "dorsal": 3,
    "age": 31,
    "fechaNacimiento": "1993-09-23",
    "source": "fc26"
  },
  "fc_twente|Mats Rots (LB)": {
    "overall": 68,
    "nationality": "Netherlands",
    "dorsal": 39,
    "age": 19,
    "fechaNacimiento": "2006-03-11",
    "source": "fc26"
  },
  "fc_twente|Daan Rots (RW)": {
    "overall": 74,
    "nationality": "Netherlands",
    "dorsal": 11,
    "age": 23,
    "fechaNacimiento": "2001-07-25",
    "source": "fc26"
  },
  "fc_twente|Sam Lammers (ST)": {
    "overall": 73,
    "nationality": "Netherlands",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1997-04-30",
    "source": "fc26"
  },
  "fc_twente|Mees Hilgers (CB)": {
    "overall": 72,
    "nationality": "Indonesia",
    "dorsal": 2,
    "age": 24,
    "fechaNacimiento": "2001-05-13",
    "source": "fc26"
  },
  "fc_twente|Sondre Ørjasæter (LW)": {
    "overall": 67,
    "nationality": "Norway",
    "dorsal": 27,
    "age": 21,
    "fechaNacimiento": "2003-11-28",
    "source": "fc26"
  },
  "fc_twente|Mathias Kjølø (CDM)": {
    "overall": 71,
    "nationality": "Norway",
    "dorsal": 4,
    "age": 24,
    "fechaNacimiento": "2001-06-27",
    "source": "fc26"
  },
  "fc_twente|Ricky van Wolfswinkel (ST)": {
    "overall": 73,
    "nationality": "Netherlands",
    "dorsal": 9,
    "age": 36,
    "fechaNacimiento": "1989-01-27",
    "source": "fc26"
  },
  "fc_utrecht|Souffian El Karouani (LB)": {
    "overall": 75,
    "nationality": "Morocco",
    "dorsal": 16,
    "age": 24,
    "fechaNacimiento": "2000-10-19",
    "source": "fc26"
  },
  "fc_utrecht|Vasilios Barkas (GK)": {
    "overall": 74,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "fc_utrecht|Mike van der Hoorn (CB)": {
    "overall": 75,
    "nationality": "Netherlands",
    "dorsal": 3,
    "age": 32,
    "fechaNacimiento": "1992-10-15",
    "source": "fc26"
  },
  "fc_utrecht|Yoann Cathline (LW)": {
    "overall": 75,
    "nationality": "France",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2002-07-22",
    "source": "fc26"
  },
  "fc_utrecht|Jesper Karlsson (LW)": {
    "overall": 74,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "fc_utrecht|Sébastien Haller (ST)": {
    "overall": 77,
    "nationality": "Côte d'Ivoire",
    "dorsal": 91,
    "age": 31,
    "fechaNacimiento": "1994-06-22",
    "source": "fc26"
  },
  "fc_utrecht|Nick Viergever (CB)": {
    "overall": 73,
    "nationality": "Netherlands",
    "dorsal": 24,
    "age": 35,
    "fechaNacimiento": "1989-08-03",
    "source": "fc26"
  },
  "fc_utrecht|Dani de Wit (CAM)": {
    "overall": 72,
    "nationality": "Netherlands",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-01-28",
    "source": "fc26"
  },
  "fc_utrecht|Mike Eerdhuijzen (CB)": {
    "overall": 73,
    "nationality": "Netherlands",
    "dorsal": 44,
    "age": 24,
    "fechaNacimiento": "2000-07-13",
    "source": "fc26"
  },
  "fc_utrecht|Miguel Rodríguez (RW)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 22,
    "fechaNacimiento": "2003-04-29",
    "source": "fc26"
  },
  "fc_utrecht|Gjivai Zechiël (CM)": {
    "overall": 69,
    "nationality": "Netherlands",
    "dorsal": 21,
    "age": 21,
    "fechaNacimiento": "2004-06-01",
    "source": "fc26"
  },
  "feyenoord|Ayase Ueda (ST)": {
    "overall": 74,
    "nationality": "Japan",
    "dorsal": 9,
    "age": 26,
    "fechaNacimiento": "1998-08-28",
    "source": "fc26"
  },
  "feyenoord|Raheem Sterling (LW)": {
    "overall": 78,
    "nationality": "England",
    "dorsal": 15,
    "age": 30,
    "fechaNacimiento": "1994-12-08",
    "source": "fc26"
  },
  "feyenoord|Tsuyoshi Watanabe (CB)": {
    "overall": 75,
    "nationality": "Japan",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1997-02-05",
    "source": "fc26"
  },
  "feyenoord|Luciano Valente (CM)": {
    "overall": 72,
    "nationality": "Netherlands",
    "dorsal": 40,
    "age": 21,
    "fechaNacimiento": "2003-10-04",
    "source": "fc26"
  },
  "feyenoord|Sem Steijn (CAM)": {
    "overall": 78,
    "nationality": "Netherlands",
    "dorsal": 14,
    "age": 23,
    "fechaNacimiento": "2001-11-12",
    "source": "fc26"
  },
  "feyenoord|Timon Wellenreuther (GK)": {
    "overall": 76,
    "nationality": "Germany",
    "dorsal": 22,
    "age": 29,
    "fechaNacimiento": "1995-12-03",
    "source": "fc26"
  },
  "feyenoord|Hwang In Beom (CM)": {
    "overall": 77,
    "nationality": "Korea Republic",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1996-09-20",
    "source": "fc26"
  },
  "feyenoord|Anis Hadj-Moussa (RW)": {
    "overall": 76,
    "nationality": "Algeria",
    "dorsal": 23,
    "age": 23,
    "fechaNacimiento": "2002-02-11",
    "source": "fc26"
  },
  "feyenoord|Givairo Read (RB)": {
    "overall": 75,
    "nationality": "Netherlands",
    "dorsal": 26,
    "age": 19,
    "fechaNacimiento": "2006-06-02",
    "source": "fc26"
  },
  "feyenoord|Anel Ahmedhodžić (CB)": {
    "overall": 74,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 21,
    "age": 26,
    "fechaNacimiento": "1999-03-26",
    "source": "fc26"
  },
  "feyenoord|Oussama Targhalline (CM)": {
    "overall": 73,
    "nationality": "Morocco",
    "dorsal": 28,
    "age": 23,
    "fechaNacimiento": "2002-05-20",
    "source": "fc26"
  },
  "go_ahead_eagles|Jakob Breum (CAM)": {
    "overall": 74,
    "nationality": "Denmark",
    "dorsal": 7,
    "age": 21,
    "fechaNacimiento": "2003-11-17",
    "source": "fc26"
  },
  "go_ahead_eagles|Jari De Busser (GK)": {
    "overall": 72,
    "nationality": "Belgium",
    "dorsal": 22,
    "age": 25,
    "fechaNacimiento": "1999-10-21",
    "source": "fc26"
  },
  "go_ahead_eagles|Melle Meulensteen (CDM)": {
    "overall": 72,
    "nationality": "Netherlands",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "1999-07-04",
    "source": "fc26"
  },
  "go_ahead_eagles|Joris Kramer (CB)": {
    "overall": 72,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1996-08-02",
    "source": "fc26"
  },
  "go_ahead_eagles|Mathis Suray (LM)": {
    "overall": 68,
    "nationality": "Belgium",
    "dorsal": 17,
    "age": 23,
    "fechaNacimiento": "2001-07-26",
    "source": "fc26"
  },
  "go_ahead_eagles|Victor Edvardsen (ST)": {
    "overall": 72,
    "nationality": "Sweden",
    "dorsal": 16,
    "age": 29,
    "fechaNacimiento": "1996-01-14",
    "source": "fc26"
  },
  "go_ahead_eagles|Dean James (LB)": {
    "overall": 70,
    "nationality": "Indonesia",
    "dorsal": 5,
    "age": 25,
    "fechaNacimiento": "2000-04-30",
    "source": "fc26"
  },
  "go_ahead_eagles|Alfons Sampsted (RB)": {
    "overall": 70,
    "nationality": "Iceland",
    "dorsal": 23,
    "age": 27,
    "fechaNacimiento": "1998-04-06",
    "source": "fc26"
  },
  "go_ahead_eagles|Gerrit Nauber (CB)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 3,
    "age": 33,
    "fechaNacimiento": "1992-04-13",
    "source": "fc26"
  },
  "go_ahead_eagles|Evert Linthorst (CDM)": {
    "overall": 68,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "go_ahead_eagles|Kenzo Goudmijn (CAM)": {
    "overall": 68,
    "nationality": "Netherlands",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2001-12-18",
    "source": "fc26"
  },
  "heracles_almelo|Remko Pasveer (GK)": {
    "overall": 75,
    "nationality": "Netherlands",
    "dorsal": 22,
    "age": 41,
    "fechaNacimiento": "1983-11-08",
    "source": "fc26"
  },
  "heracles_almelo|Jeff Reine-Adélaïde (CAM)": {
    "overall": 70,
    "nationality": "France",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1998-01-17",
    "source": "fc26"
  },
  "heracles_almelo|Damon Mirani (CB)": {
    "overall": 67,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 29,
    "fechaNacimiento": "1996-05-13",
    "source": "fc26"
  },
  "heracles_almelo|Naci Ünüvar (LM)": {
    "overall": 69,
    "nationality": "Türkiye",
    "dorsal": 37,
    "age": 22,
    "fechaNacimiento": "2003-06-13",
    "source": "fc26"
  },
  "heracles_almelo|Ajdin Hrustić (CM)": {
    "overall": 67,
    "nationality": "Australia",
    "dorsal": 70,
    "age": 28,
    "fechaNacimiento": "1996-07-05",
    "source": "fc26"
  },
  "heracles_almelo|Walid Ould-Chikh (LM)": {
    "overall": 66,
    "nationality": "Netherlands",
    "dorsal": 73,
    "age": 25,
    "fechaNacimiento": "1999-11-06",
    "source": "fc26"
  },
  "heracles_almelo|Luka Kulenović (ST)": {
    "overall": 69,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "1999-09-29",
    "source": "fc26"
  },
  "heracles_almelo|Alec Van Hoorenbeeck (CB)": {
    "overall": 68,
    "nationality": "Belgium",
    "dorsal": 18,
    "age": 26,
    "fechaNacimiento": "1998-12-30",
    "source": "fc26"
  },
  "heracles_almelo|Fabian de Keijzer (GK)": {
    "overall": 68,
    "nationality": "Netherlands",
    "dorsal": 1,
    "age": 25,
    "fechaNacimiento": "2000-05-10",
    "source": "fc26"
  },
  "heracles_almelo|Ivan Mesík (LB)": {
    "overall": 66,
    "nationality": "Slovakia",
    "dorsal": 24,
    "age": 24,
    "fechaNacimiento": "2001-06-01",
    "source": "fc26"
  },
  "heracles_almelo|Jan Žambůrek (CDM)": {
    "overall": 66,
    "nationality": "Czechia",
    "dorsal": 13,
    "age": 24,
    "fechaNacimiento": "2001-02-13",
    "source": "fc26"
  },
  "nac_breda|André Ayew (ST)": {
    "overall": 72,
    "nationality": "Ghana",
    "age": 35,
    "fechaNacimiento": "1989-12-17",
    "source": "fc26"
  },
  "nac_breda|Daniel Bielica (GK)": {
    "overall": 68,
    "nationality": "Poland",
    "dorsal": 99,
    "age": 26,
    "fechaNacimiento": "1999-04-30",
    "source": "fc26"
  },
  "nac_breda|Denis Odoi (CB)": {
    "overall": 70,
    "nationality": "Ghana",
    "age": 37,
    "fechaNacimiento": "1988-05-27",
    "source": "fc26"
  },
  "nac_breda|Lewis Holtby (CM)": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 90,
    "age": 34,
    "fechaNacimiento": "1990-09-18",
    "source": "fc26"
  },
  "nac_breda|Leo Greiml (CB)": {
    "overall": 69,
    "nationality": "Austria",
    "dorsal": 12,
    "age": 23,
    "fechaNacimiento": "2001-07-03",
    "source": "fc26"
  },
  "nac_breda|Boy Kemper (LB)": {
    "overall": 66,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1999-06-21",
    "source": "fc26"
  },
  "nac_breda|Kamal Sowah (LM)": {
    "overall": 67,
    "nationality": "Ghana",
    "dorsal": 14,
    "age": 25,
    "fechaNacimiento": "2000-01-09",
    "source": "fc26"
  },
  "nac_breda|Clint Leemans (CM)": {
    "overall": 68,
    "nationality": "Netherlands",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1995-09-15",
    "source": "fc26"
  },
  "nac_breda|Mohamed Nassoh (LM)": {
    "overall": 67,
    "nationality": "Morocco",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2003-01-26",
    "source": "fc26"
  },
  "nac_breda|Amine Salama (ST)": {
    "overall": 67,
    "nationality": "France",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2000-07-18",
    "source": "fc26"
  },
  "nac_breda|Cherrion Valerius (RB)": {
    "overall": 66,
    "nationality": "Netherlands",
    "dorsal": 25,
    "age": 19,
    "fechaNacimiento": "2005-09-22",
    "source": "fc26"
  },
  "pec_zwolle|Jasper Schendelaar (GK)": {
    "overall": 72,
    "nationality": "Netherlands",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2000-09-02",
    "source": "fc26"
  },
  "pec_zwolle|Younes Namli (RM)": {
    "overall": 71,
    "nationality": "Denmark",
    "dorsal": 21,
    "age": 31,
    "fechaNacimiento": "1994-06-20",
    "source": "fc26"
  },
  "pec_zwolle|Jamiro Monteiro (CAM)": {
    "overall": 69,
    "nationality": "Cabo Verde",
    "dorsal": 35,
    "age": 31,
    "fechaNacimiento": "1993-11-23",
    "source": "fc26"
  },
  "pec_zwolle|Zico Buurmeester (CM)": {
    "overall": 69,
    "nationality": "Netherlands",
    "dorsal": 8,
    "age": 23,
    "fechaNacimiento": "2002-06-07",
    "source": "fc26"
  },
  "pec_zwolle|Simon Graves (CB)": {
    "overall": 68,
    "nationality": "Denmark",
    "dorsal": 28,
    "age": 26,
    "fechaNacimiento": "1999-05-22",
    "source": "fc26"
  },
  "pec_zwolle|Anselmo García MacNulty (CB)": {
    "overall": 68,
    "nationality": "Republic of Ireland",
    "dorsal": 4,
    "age": 22,
    "fechaNacimiento": "2003-02-19",
    "source": "fc26"
  },
  "pec_zwolle|Koen Kostons (ST)": {
    "overall": 67,
    "nationality": "Netherlands",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "1999-09-18",
    "source": "fc26"
  },
  "pec_zwolle|Tom de Graaff (GK)": {
    "overall": 61,
    "nationality": "Netherlands",
    "dorsal": 16,
    "age": 20,
    "fechaNacimiento": "2004-12-10",
    "source": "fc26"
  },
  "pec_zwolle|Ryan Thomas (CM)": {
    "overall": 66,
    "nationality": "New Zealand",
    "dorsal": 30,
    "age": 30,
    "fechaNacimiento": "1994-12-20",
    "source": "fc26"
  },
  "pec_zwolle|Odysseus Velanas (LM)": {
    "overall": 66,
    "nationality": "Netherlands",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1998-06-05",
    "source": "fc26"
  },
  "pec_zwolle|Kaj de Rooij (LM)": {
    "overall": 63,
    "nationality": "Netherlands",
    "dorsal": 22,
    "age": 24,
    "fechaNacimiento": "2000-11-25",
    "source": "fc26"
  },
  "psv|Joey Veerman (CM)": {
    "overall": 79,
    "nationality": "Netherlands",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1998-11-19",
    "source": "fc26"
  },
  "psv|Ivan Perišić (LW)": {
    "overall": 81,
    "nationality": "Croatia",
    "dorsal": 5,
    "age": 36,
    "fechaNacimiento": "1989-02-02",
    "source": "fc26"
  },
  "psv|Mauro Júnior (LB)": {
    "overall": 79,
    "nationality": "Brazil",
    "dorsal": 17,
    "age": 26,
    "fechaNacimiento": "1999-05-06",
    "source": "fc26"
  },
  "psv|Ismael Saibari (CAM)": {
    "overall": 79,
    "nationality": "Morocco",
    "dorsal": 34,
    "age": 23,
    "fechaNacimiento": "2001-07-18",
    "source": "fc26"
  },
  "psv|Jerdy Schouten (CB)": {
    "overall": 80,
    "nationality": "Netherlands",
    "dorsal": 22,
    "age": 28,
    "fechaNacimiento": "1997-01-12",
    "source": "fc26"
  },
  "psv|Sergiño Dest (RB)": {
    "overall": 79,
    "nationality": "United States",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2000-11-03",
    "source": "fc26"
  },
  "psv|Alassane Pléa (ST)": {
    "overall": 78,
    "nationality": "France",
    "dorsal": 14,
    "age": 32,
    "fechaNacimiento": "1993-03-10",
    "source": "fc26"
  },
  "psv|Dennis Man (RW)": {
    "overall": 76,
    "nationality": "Romania",
    "dorsal": 27,
    "age": 26,
    "fechaNacimiento": "1998-08-26",
    "source": "fc26"
  },
  "psv|Guus Til (CAM)": {
    "overall": 77,
    "nationality": "Netherlands",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1997-12-22",
    "source": "fc26"
  },
  "psv|Matěj Kovář (GK)": {
    "overall": 75,
    "nationality": "Czechia",
    "dorsal": 32,
    "age": 25,
    "fechaNacimiento": "2000-05-17",
    "source": "fc26"
  },
  "psv|Ryan Flamingo (CB)": {
    "overall": 77,
    "nationality": "Netherlands",
    "dorsal": 6,
    "age": 22,
    "fechaNacimiento": "2002-12-31",
    "source": "fc26"
  },
  "sc_heerenveen|Ringo Meerveld (CAM)": {
    "overall": 71,
    "nationality": "Netherlands",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2002-12-21",
    "source": "fc26"
  },
  "sc_heerenveen|Joris van Overeem (CDM)": {
    "overall": 70,
    "nationality": "Netherlands",
    "dorsal": 6,
    "age": 31,
    "fechaNacimiento": "1994-06-01",
    "source": "fc26"
  },
  "sc_heerenveen|Jacob Trenskow (RM)": {
    "overall": 69,
    "nationality": "Denmark",
    "dorsal": 20,
    "age": 24,
    "fechaNacimiento": "2000-11-26",
    "source": "fc26"
  },
  "sc_heerenveen|Oliver Braude (RB)": {
    "overall": 68,
    "nationality": "Norway",
    "dorsal": 45,
    "age": 21,
    "fechaNacimiento": "2004-02-21",
    "source": "fc26"
  },
  "sc_heerenveen|Marcus Linday (CDM)": {
    "overall": 68,
    "nationality": "Sweden",
    "dorsal": 16,
    "age": 22,
    "fechaNacimiento": "2003-06-02",
    "source": "fc26"
  },
  "sc_heerenveen|Bernt Klaverboer (GK)": {
    "overall": 64,
    "nationality": "Netherlands",
    "dorsal": 22,
    "age": 19,
    "fechaNacimiento": "2005-09-26",
    "source": "fc26"
  },
  "sc_heerenveen|Maas Willemsen (CB)": {
    "overall": 62,
    "nationality": "Netherlands",
    "dorsal": 3,
    "age": 22,
    "fechaNacimiento": "2003-04-29",
    "source": "fc26"
  },
  "sc_heerenveen|Vasilios Zagaritis (LB)": {
    "overall": 66,
    "nationality": "Greece",
    "dorsal": 19,
    "age": 24,
    "fechaNacimiento": "2001-05-04",
    "source": "fc26"
  },
  "sc_heerenveen|Luuk Brouwers (CM)": {
    "overall": 67,
    "nationality": "Netherlands",
    "dorsal": 8,
    "age": 27,
    "fechaNacimiento": "1998-05-03",
    "source": "fc26"
  },
  "sc_heerenveen|Dylan Vente (ST)": {
    "overall": 69,
    "nationality": "Suriname",
    "dorsal": 9,
    "age": 26,
    "fechaNacimiento": "1999-05-09",
    "source": "fc26"
  },
  "sc_heerenveen|Maxence Rivera (LM)": {
    "overall": 67,
    "nationality": "France",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2002-05-30",
    "source": "fc26"
  },
  "sparta_rotterdam|Joël Drommel (GK)": {
    "overall": 72,
    "nationality": "Netherlands",
    "dorsal": 1,
    "age": 28,
    "fechaNacimiento": "1996-11-16",
    "source": "fc26"
  },
  "sparta_rotterdam|Tobias Lauritsen (ST)": {
    "overall": 72,
    "nationality": "Norway",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1997-08-30",
    "source": "fc26"
  },
  "sparta_rotterdam|Patrick van Aanholt (LB)": {
    "overall": 72,
    "nationality": "Netherlands",
    "dorsal": 5,
    "age": 34,
    "fechaNacimiento": "1990-08-29",
    "source": "fc26"
  },
  "sparta_rotterdam|Marvin Young (CB)": {
    "overall": 69,
    "nationality": "Netherlands",
    "dorsal": 3,
    "age": 19,
    "fechaNacimiento": "2005-10-02",
    "source": "fc26"
  },
  "sparta_rotterdam|Mitchell van Bergen (RM)": {
    "overall": 69,
    "nationality": "Netherlands",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "1999-08-27",
    "source": "fc26"
  },
  "sparta_rotterdam|Joshua Kitolano (CM)": {
    "overall": 69,
    "nationality": "Norway",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2001-08-03",
    "source": "fc26"
  },
  "sparta_rotterdam|Bruno Martins Indi (CB)": {
    "overall": 68,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "sparta_rotterdam|Julian Baas (CM)": {
    "overall": 67,
    "nationality": "Netherlands",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2002-04-16",
    "source": "fc26"
  },
  "sparta_rotterdam|Vito van Crooij (CAM)": {
    "overall": 69,
    "nationality": "Netherlands",
    "dorsal": 32,
    "age": 29,
    "fechaNacimiento": "1996-01-29",
    "source": "fc26"
  },
  "sparta_rotterdam|Teo Quintero (CB)": {
    "overall": 65,
    "nationality": "Venezuela",
    "dorsal": 13,
    "age": 26,
    "fechaNacimiento": "1999-03-02",
    "source": "fc26"
  },
  "sparta_rotterdam|Shunsuke Mito (RM)": {
    "overall": 68,
    "nationality": "Japan",
    "dorsal": 22,
    "age": 22,
    "fechaNacimiento": "2002-09-28",
    "source": "fc26"
  },
  "avs_futebol_sad|Rúben Semedo (CB)": {
    "overall": 71,
    "dorsal": 35,
    "source": "latamfc26"
  },
  "avs_futebol_sad|Kiki (LB)": {
    "overall": 70,
    "nationality": "Portugal",
    "dorsal": 24,
    "age": 30,
    "fechaNacimiento": "1994-12-10",
    "source": "fc26"
  },
  "avs_futebol_sad|Algobia (CM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 27,
    "age": 26,
    "fechaNacimiento": "1999-06-23",
    "source": "fc26"
  },
  "avs_futebol_sad|Cristian Devenish (CB)": {
    "overall": 69,
    "nationality": "Colombia",
    "dorsal": 42,
    "age": 24,
    "fechaNacimiento": "2001-01-25",
    "source": "fc26"
  },
  "avs_futebol_sad|Tomané (ST)": {
    "overall": 69,
    "nationality": "Portugal",
    "dorsal": 7,
    "age": 32,
    "fechaNacimiento": "1992-10-23",
    "source": "fc26"
  },
  "avs_futebol_sad|Simão Bertelli (GK)": {
    "overall": 68,
    "nationality": "Brazil",
    "dorsal": 93,
    "age": 31,
    "fechaNacimiento": "1993-07-02",
    "source": "fc26"
  },
  "avs_futebol_sad|Carlos Ponck (CB)": {
    "overall": 68,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "avs_futebol_sad|Aderllan Santos (CB)": {
    "overall": 72,
    "nationality": "Brazil",
    "dorsal": 33,
    "age": 36,
    "fechaNacimiento": "1989-04-09",
    "source": "fc26"
  },
  "avs_futebol_sad|Guillem Molina (RB)": {
    "overall": 67,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 25,
    "fechaNacimiento": "2000-05-03",
    "source": "fc26"
  },
  "avs_futebol_sad|Babatunde Akinsola (LM)": {
    "overall": 68,
    "nationality": "Nigeria",
    "dorsal": 11,
    "age": 22,
    "fechaNacimiento": "2003-03-10",
    "source": "fc26"
  },
  "avs_futebol_sad|Óscar Perea (LM)": {
    "overall": 67,
    "nationality": "Colombia",
    "dorsal": 14,
    "age": 19,
    "fechaNacimiento": "2005-09-27",
    "source": "fc26"
  },
  "casa_pia|Jérémy Livolant (RW)": {
    "overall": 70,
    "nationality": "France",
    "dorsal": 29,
    "age": 27,
    "fechaNacimiento": "1998-01-09",
    "source": "fc26"
  },
  "casa_pia|Cassiano (ST)": {
    "overall": 72,
    "nationality": "Brazil",
    "dorsal": 90,
    "age": 36,
    "fechaNacimiento": "1989-06-16",
    "source": "fc26"
  },
  "casa_pia|Patrick Gilmar Sequeira (GK)": {
    "overall": 71,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "casa_pia|José Fonte (CB)": {
    "overall": 72,
    "nationality": "Portugal",
    "dorsal": 6,
    "age": 41,
    "fechaNacimiento": "1983-12-22",
    "source": "fc26"
  },
  "casa_pia|Larrazabal (RM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 72,
    "age": 27,
    "fechaNacimiento": "1997-12-17",
    "source": "fc26"
  },
  "casa_pia|Sebastián Pérez (CDM)": {
    "overall": 71,
    "nationality": "Colombia",
    "dorsal": 42,
    "age": 32,
    "fechaNacimiento": "1993-03-29",
    "source": "fc26"
  },
  "casa_pia|Ricardo Batista (GK)": {
    "overall": 71,
    "nationality": "Angola",
    "dorsal": 33,
    "age": 38,
    "fechaNacimiento": "1986-11-19",
    "source": "fc26"
  },
  "casa_pia|Lawrence Ofori (CDM)": {
    "overall": 71,
    "nationality": "Ghana",
    "dorsal": 80,
    "age": 27,
    "fechaNacimiento": "1998-06-28",
    "source": "fc26"
  },
  "casa_pia|João Marques (LW)": {
    "overall": 71,
    "nationality": "Portugal",
    "dorsal": 33,
    "age": 23,
    "fechaNacimiento": "2002-02-13",
    "source": "fc26"
  },
  "casa_pia|João Goulart (CB)": {
    "overall": 70,
    "nationality": "Portugal",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "2000-01-27",
    "source": "fc26"
  },
  "casa_pia|Dailon Livramento (ST)": {
    "overall": 70,
    "nationality": "Cabo Verde",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2001-05-04",
    "source": "fc26"
  },
  "fc_porto|Diogo Costa (GK)": {
    "overall": 84,
    "nationality": "Portugal",
    "dorsal": 99,
    "age": 25,
    "fechaNacimiento": "1999-09-19",
    "source": "fc26"
  },
  "fc_porto|Thiago Silva (CB)": {
    "overall": 82,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "fc_porto|Jakub Kiwior (CB)": {
    "overall": 77,
    "nationality": "Poland",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "2000-02-15",
    "source": "fc26"
  },
  "fc_porto|Alan Varela (CDM)": {
    "overall": 79,
    "nationality": "Argentina",
    "dorsal": 22,
    "age": 23,
    "fechaNacimiento": "2001-07-04",
    "source": "fc26"
  },
  "fc_porto|Jan Bednarek (CB)": {
    "overall": 74,
    "nationality": "Poland",
    "dorsal": 5,
    "age": 29,
    "fechaNacimiento": "1996-04-12",
    "source": "fc26"
  },
  "fc_porto|Gabri Veiga (CAM)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2002-05-27",
    "source": "fc26"
  },
  "fc_porto|Samu (ST)": {
    "overall": 79,
    "nationality": "Spain",
    "dorsal": 9,
    "age": 21,
    "fechaNacimiento": "2004-05-05",
    "source": "fc26"
  },
  "fc_porto|Victor Froholdt (CM)": {
    "overall": 71,
    "nationality": "Denmark",
    "dorsal": 8,
    "age": 19,
    "fechaNacimiento": "2006-02-25",
    "source": "fc26"
  },
  "fc_porto|Pepê (CAM)": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 28,
    "fechaNacimiento": "1997-02-24",
    "source": "fc26"
  },
  "fc_porto|Borja Sainz (LW)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 17,
    "age": 24,
    "fechaNacimiento": "2001-02-01",
    "source": "fc26"
  },
  "fc_porto|Pablo Rosario (CDM)": {
    "overall": 75,
    "nationality": "Dominican Republic",
    "dorsal": 13,
    "age": 28,
    "fechaNacimiento": "1997-01-07",
    "source": "fc26"
  },
  "gil_vicente_fc|Ghislain Konan (LB)": {
    "overall": 72,
    "nationality": "Côte d'Ivoire",
    "dorsal": 3,
    "age": 29,
    "fechaNacimiento": "1995-12-27",
    "source": "fc26"
  },
  "gil_vicente_fc|Santi García (CM)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 95,
    "age": 23,
    "fechaNacimiento": "2001-08-29",
    "source": "fc26"
  },
  "gil_vicente_fc|Luís Esteves (CM)": {
    "overall": 70,
    "nationality": "Portugal",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-04-09",
    "source": "fc26"
  },
  "gil_vicente_fc|Héctor (ST)": {
    "overall": 72,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "gil_vicente_fc|Zé Carlos (RB)": {
    "overall": 70,
    "nationality": "Portugal",
    "dorsal": 2,
    "age": 26,
    "fechaNacimiento": "1998-07-31",
    "source": "fc26"
  },
  "gil_vicente_fc|Murilo (RM)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 77,
    "age": 30,
    "fechaNacimiento": "1994-10-31",
    "source": "fc26"
  },
  "gil_vicente_fc|Daniel Figueira (GK)": {
    "overall": 70,
    "nationality": "Portugal",
    "dorsal": 99,
    "age": 26,
    "fechaNacimiento": "1998-07-20",
    "source": "fc26"
  },
  "gil_vicente_fc|Weverson (LB)": {
    "overall": 70,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "gil_vicente_fc|Buatu (CB)": {
    "overall": 69,
    "nationality": "Angola",
    "dorsal": 39,
    "age": 31,
    "fechaNacimiento": "1993-09-27",
    "source": "fc26"
  },
  "gil_vicente_fc|Facundo Agustín Cáseres (CDM)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 24,
    "fechaNacimiento": "2001-05-28",
    "source": "fc26"
  },
  "gil_vicente_fc|Gustavo Varela (ST)": {
    "overall": 68,
    "nationality": "Portugal",
    "dorsal": 89,
    "age": 20,
    "fechaNacimiento": "2005-01-30",
    "source": "fc26"
  },
  "sporting_cp|Morten Hjulmand (CDM)": {
    "overall": 83,
    "nationality": "Denmark",
    "dorsal": 42,
    "age": 26,
    "fechaNacimiento": "1999-06-25",
    "source": "fc26"
  },
  "sporting_cp|Pedro Gonçalves (LM)": {
    "overall": 83,
    "nationality": "Portugal",
    "dorsal": 8,
    "age": 27,
    "fechaNacimiento": "1998-06-28",
    "source": "fc26"
  },
  "sporting_cp|Trincão (CAM)": {
    "overall": 82,
    "nationality": "Portugal",
    "dorsal": 17,
    "age": 25,
    "fechaNacimiento": "1999-12-29",
    "source": "fc26"
  },
  "sporting_cp|Rui Silva (GK)": {
    "overall": 81,
    "nationality": "Portugal",
    "dorsal": 1,
    "age": 31,
    "fechaNacimiento": "1994-02-07",
    "source": "fc26"
  },
  "sporting_cp|Gonçalo Inácio (CB)": {
    "overall": 81,
    "nationality": "Portugal",
    "dorsal": 25,
    "age": 23,
    "fechaNacimiento": "2001-08-25",
    "source": "fc26"
  },
  "sporting_cp|Ousmane Diomande (CB)": {
    "overall": 80,
    "nationality": "Côte d'Ivoire",
    "dorsal": 26,
    "age": 21,
    "fechaNacimiento": "2003-12-04",
    "source": "fc26"
  },
  "sporting_cp|Luis Javier Suárez (ST)": {
    "overall": 80,
    "dorsal": 97,
    "source": "latamfc26"
  },
  "sporting_cp|Maximiliano Araújo (LM)": {
    "overall": 77,
    "nationality": "Uruguay",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "2000-02-15",
    "source": "fc26"
  },
  "sporting_cp|Hidemasa Morita (CM)": {
    "overall": 79,
    "nationality": "Japan",
    "dorsal": 5,
    "age": 30,
    "fechaNacimiento": "1995-05-10",
    "source": "fc26"
  },
  "sporting_cp|Geny Catamo (RM)": {
    "overall": 78,
    "nationality": "Mozambique",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2001-01-26",
    "source": "fc26"
  },
  "sporting_cp|Zeno Debast (CB)": {
    "overall": 78,
    "nationality": "Belgium",
    "dorsal": 6,
    "age": 21,
    "fechaNacimiento": "2003-10-24",
    "source": "fc26"
  },
  "austin_fc|Facundo Torres (RM)": {
    "overall": 74,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "austin_fc|Myrto Uzuni (ST)": {
    "overall": 75,
    "nationality": "Albania",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1995-05-31",
    "source": "fc26"
  },
  "austin_fc|Mikkel Desler (RB)": {
    "overall": 73,
    "nationality": "Denmark",
    "dorsal": 3,
    "age": 30,
    "fechaNacimiento": "1995-02-19",
    "source": "fc26"
  },
  "austin_fc|Brandon Vazquez (ST)": {
    "overall": 73,
    "nationality": "United States",
    "dorsal": 9,
    "age": 26,
    "fechaNacimiento": "1998-10-14",
    "source": "fc26"
  },
  "austin_fc|Oleksandr Svatok (CB)": {
    "overall": 70,
    "nationality": "Ukraine",
    "dorsal": 5,
    "age": 30,
    "fechaNacimiento": "1994-09-27",
    "source": "fc26"
  },
  "austin_fc|Ilie Sánchez (CM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 6,
    "age": 34,
    "fechaNacimiento": "1990-11-21",
    "source": "fc26"
  },
  "austin_fc|Brad Stuver (GK)": {
    "overall": 69,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "austin_fc|Robert Taylor (LW)": {
    "overall": 70,
    "nationality": "Finland",
    "dorsal": 16,
    "age": 30,
    "fechaNacimiento": "1994-10-21",
    "source": "fc26"
  },
  "austin_fc|Joseph Rosales (LB)": {
    "overall": 67,
    "nationality": "Honduras",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2000-11-06",
    "source": "fc26"
  },
  "austin_fc|Jayden Nelson (LW)": {
    "overall": 68,
    "nationality": "Canada",
    "dorsal": 7,
    "age": 22,
    "fechaNacimiento": "2002-09-26",
    "source": "fc26"
  },
  "austin_fc|Besard Sabovic (CM)": {
    "overall": 68,
    "nationality": "Sweden",
    "dorsal": 14,
    "age": 27,
    "fechaNacimiento": "1998-01-05",
    "source": "fc26"
  },
  "cf_montreal|Iván Jaime (LM)": {
    "overall": 74,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "cf_montreal|Prince Owusu (ST)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 9,
    "age": 28,
    "fechaNacimiento": "1997-01-07",
    "source": "fc26"
  },
  "cf_montreal|Brayan Vera (CB)": {
    "overall": 69,
    "nationality": "Colombia",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1999-01-15",
    "source": "fc26"
  },
  "cf_montreal|Thomas Gillier (GK)": {
    "overall": 65,
    "nationality": "Chile",
    "dorsal": 31,
    "age": 21,
    "fechaNacimiento": "2004-05-28",
    "source": "fc26"
  },
  "cf_montreal|Samuel Piette (CDM)": {
    "overall": 69,
    "nationality": "Canada",
    "dorsal": 6,
    "age": 30,
    "fechaNacimiento": "1994-11-12",
    "source": "fc26"
  },
  "cf_montreal|Tomás Avilés (CB)": {
    "overall": 69,
    "nationality": "Argentina",
    "dorsal": 6,
    "age": 21,
    "fechaNacimiento": "2004-02-03",
    "source": "fc26"
  },
  "cf_montreal|Matty Longstaff (CM)": {
    "overall": 66,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "cf_montreal|Jalen Neal (CB)": {
    "overall": 66,
    "nationality": "United States",
    "dorsal": 2,
    "age": 21,
    "fechaNacimiento": "2003-08-24",
    "source": "fc26"
  },
  "cf_montreal|Dagur Dan Thorhallsson (RB)": {
    "overall": 65,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "cf_montreal|Wikelman Carmona (LM)": {
    "overall": 64,
    "nationality": "Venezuela",
    "dorsal": 19,
    "age": 22,
    "fechaNacimiento": "2003-02-24",
    "source": "fc26"
  },
  "cf_montreal|Kwadwo Opoku (ST)": {
    "overall": 66,
    "nationality": "Ghana",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2001-07-13",
    "source": "fc26"
  },
  "charlotte_fc|Wilfried Zaha (LW)": {
    "overall": 78,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "charlotte_fc|Pep Biel (CAM)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 28,
    "fechaNacimiento": "1996-09-05",
    "source": "fc26"
  },
  "charlotte_fc|Kristijan Kahlina (GK)": {
    "overall": 75,
    "nationality": "Croatia",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1992-07-24",
    "source": "fc26"
  },
  "charlotte_fc|Ashley Westwood (CDM)": {
    "overall": 73,
    "nationality": "England",
    "dorsal": 8,
    "age": 35,
    "fechaNacimiento": "1990-04-01",
    "source": "fc26"
  },
  "charlotte_fc|Liel Abada (RM)": {
    "overall": 74,
    "nationality": "Israel",
    "dorsal": 11,
    "age": 23,
    "fechaNacimiento": "2001-10-03",
    "source": "fc26"
  },
  "charlotte_fc|Tim Ream (CB)": {
    "overall": 72,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "charlotte_fc|Luca de la Torre (CM)": {
    "overall": 72,
    "nationality": "United States",
    "dorsal": 14,
    "age": 27,
    "fechaNacimiento": "1998-05-23",
    "source": "fc26"
  },
  "charlotte_fc|Harry Toffolo (LB)": {
    "overall": 71,
    "nationality": "England",
    "dorsal": 15,
    "age": 29,
    "fechaNacimiento": "1995-08-19",
    "source": "fc26"
  },
  "charlotte_fc|David Schnegg (LB)": {
    "overall": 71,
    "nationality": "Austria",
    "dorsal": 28,
    "age": 26,
    "fechaNacimiento": "1998-09-29",
    "source": "fc26"
  },
  "charlotte_fc|Henry Kessler (CB)": {
    "overall": 70,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "charlotte_fc|Nathan Byrne (RB)": {
    "overall": 69,
    "nationality": "England",
    "dorsal": 14,
    "age": 33,
    "fechaNacimiento": "1992-06-05",
    "source": "fc26"
  },
  "colorado_rapids|Paxten Aaronson (CM)": {
    "overall": 75,
    "nationality": "United States",
    "dorsal": 10,
    "age": 21,
    "fechaNacimiento": "2003-08-26",
    "source": "fc26"
  },
  "colorado_rapids|Zack Steffen (GK)": {
    "overall": 72,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "colorado_rapids|Rob Holding (CB)": {
    "overall": 72,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "colorado_rapids|Reggie Cannon (RB)": {
    "overall": 71,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "colorado_rapids|Alexis Manyoma (RM)": {
    "overall": 72,
    "nationality": "Colombia",
    "dorsal": 39,
    "age": 22,
    "fechaNacimiento": "2003-01-30",
    "source": "fc26"
  },
  "colorado_rapids|Keegan Rosenberry (RB)": {
    "overall": 70,
    "nationality": "United States",
    "dorsal": 2,
    "age": 31,
    "fechaNacimiento": "1993-12-11",
    "source": "fc26"
  },
  "colorado_rapids|Hamzat Ojediran (CDM)": {
    "overall": 70,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "colorado_rapids|Rafael Navarro (ST)": {
    "overall": 68,
    "nationality": "Brazil",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-04-14",
    "source": "fc26"
  },
  "colorado_rapids|Connor Ronan (CDM)": {
    "overall": 69,
    "nationality": "Republic of Ireland",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-03-06",
    "source": "fc26"
  },
  "colorado_rapids|Ian Murphy (CB)": {
    "overall": 67,
    "nationality": "United States",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "2000-01-16",
    "source": "fc26"
  },
  "colorado_rapids|Miguel Navarro (LB)": {
    "overall": 65,
    "nationality": "Venezuela",
    "dorsal": 16,
    "age": 26,
    "fechaNacimiento": "1999-02-26",
    "source": "fc26"
  },
  "columbus_crew|Diego Rossi (CAM)": {
    "overall": 75,
    "nationality": "Uruguay",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-03-05",
    "source": "fc26"
  },
  "columbus_crew|Dániel Gazdag (CAM)": {
    "overall": 74,
    "nationality": "Hungary",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1996-03-02",
    "source": "fc26"
  },
  "columbus_crew|André Gomes (CDM)": {
    "overall": 75,
    "nationality": "Portugal",
    "dorsal": 26,
    "age": 31,
    "fechaNacimiento": "1993-07-30",
    "source": "fc26"
  },
  "columbus_crew|Max Arfsten (LM)": {
    "overall": 72,
    "dorsal": 27,
    "source": "latamfc26"
  },
  "columbus_crew|Steven Moreira (CB)": {
    "overall": 72,
    "nationality": "Cabo Verde",
    "dorsal": 31,
    "age": 30,
    "fechaNacimiento": "1994-08-13",
    "source": "fc26"
  },
  "columbus_crew|Hugo Picard (LM)": {
    "overall": 71,
    "nationality": "France",
    "dorsal": 30,
    "age": 22,
    "fechaNacimiento": "2003-05-09",
    "source": "fc26"
  },
  "columbus_crew|Nariman Akhundzada (RW)": {
    "overall": 69,
    "nationality": "Azerbaijan",
    "dorsal": 90,
    "age": 21,
    "fechaNacimiento": "2004-04-23",
    "source": "fc26"
  },
  "columbus_crew|Patrick Schulte (GK)": {
    "overall": 71,
    "nationality": "United States",
    "dorsal": 28,
    "age": 24,
    "fechaNacimiento": "2001-03-13",
    "source": "fc26"
  },
  "columbus_crew|Andrés Herrera (RB)": {
    "overall": 70,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "columbus_crew|Dylan Chambost (CM)": {
    "overall": 70,
    "nationality": "France",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1997-08-19",
    "source": "fc26"
  },
  "columbus_crew|Mohamed Farsi (RM)": {
    "overall": 70,
    "nationality": "Algeria",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "1999-12-16",
    "source": "fc26"
  },
  "fc_cincinnati|Evander (CAM)": {
    "overall": 79,
    "nationality": "Brazil",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-06-09",
    "source": "fc26"
  },
  "fc_cincinnati|Kévin Denkey (ST)": {
    "overall": 76,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "fc_cincinnati|Pavel Bucha (CM)": {
    "overall": 75,
    "nationality": "Czechia",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-03-11",
    "source": "fc26"
  },
  "fc_cincinnati|Miles Robinson (CB)": {
    "overall": 73,
    "nationality": "United States",
    "dorsal": 12,
    "age": 28,
    "fechaNacimiento": "1997-03-14",
    "source": "fc26"
  },
  "fc_cincinnati|Bryan Ramírez (LM)": {
    "overall": 71,
    "nationality": "Ecuador",
    "dorsal": 29,
    "age": 24,
    "fechaNacimiento": "2000-08-11",
    "source": "fc26"
  },
  "fc_cincinnati|Obinna Nwobodo (CM)": {
    "overall": 73,
    "nationality": "Nigeria",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1996-11-29",
    "source": "fc26"
  },
  "fc_cincinnati|Matt Miazga (CB)": {
    "overall": 73,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "fc_cincinnati|Roman Celentano (GK)": {
    "overall": 72,
    "nationality": "United States",
    "dorsal": 18,
    "age": 24,
    "fechaNacimiento": "2000-09-14",
    "source": "fc26"
  },
  "fc_cincinnati|Teenage Hadebe (CB)": {
    "overall": 69,
    "nationality": "Zimbabwe",
    "dorsal": 16,
    "age": 29,
    "fechaNacimiento": "1995-09-17",
    "source": "fc26"
  },
  "fc_cincinnati|Nick Hagglund (CB)": {
    "overall": 68,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "fc_cincinnati|Ender Echenique (RM)": {
    "overall": 68,
    "nationality": "Venezuela",
    "dorsal": 66,
    "age": 21,
    "fechaNacimiento": "2004-04-02",
    "source": "fc26"
  },
  "fc_dallas|Petar Musa (ST)": {
    "overall": 76,
    "nationality": "Croatia",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1998-03-04",
    "source": "fc26"
  },
  "fc_dallas|Herman Johansson (RM)": {
    "overall": 70,
    "nationality": "Sweden",
    "dorsal": 14,
    "age": 27,
    "fechaNacimiento": "1997-10-16",
    "source": "fc26"
  },
  "fc_dallas|Ramiro (CDM)": {
    "overall": 70,
    "nationality": "Brazil",
    "dorsal": 17,
    "age": 32,
    "fechaNacimiento": "1993-05-22",
    "source": "fc26"
  },
  "fc_dallas|Shaq Moore (RB)": {
    "overall": 69,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "fc_dallas|Osaze Urhoghide (CB)": {
    "overall": 69,
    "nationality": "England",
    "dorsal": 3,
    "age": 24,
    "fechaNacimiento": "2000-07-04",
    "source": "fc26"
  },
  "fc_dallas|Joaquín Valiente (CAM)": {
    "overall": 68,
    "nationality": "Uruguay",
    "dorsal": 21,
    "age": 24,
    "fechaNacimiento": "2001-04-13",
    "source": "fc26"
  },
  "fc_dallas|Anderson Julio (ST)": {
    "overall": 67,
    "nationality": "Ecuador",
    "dorsal": 11,
    "age": 29,
    "fechaNacimiento": "1996-05-31",
    "source": "fc26"
  },
  "fc_dallas|Sebastien Ibeagha (CB)": {
    "overall": 66,
    "nationality": "United States",
    "dorsal": 25,
    "age": 33,
    "fechaNacimiento": "1992-01-21",
    "source": "fc26"
  },
  "fc_dallas|Kaick (CM)": {
    "overall": 66,
    "nationality": "Brazil",
    "dorsal": 55,
    "age": 19,
    "fechaNacimiento": "2005-11-29",
    "source": "fc26"
  },
  "fc_dallas|Patrickson Delgado (CM)": {
    "overall": 65,
    "nationality": "Ecuador",
    "dorsal": 6,
    "age": 21,
    "fechaNacimiento": "2003-10-17",
    "source": "fc26"
  },
  "fc_dallas|Christian Cappis (CM)": {
    "overall": 66,
    "nationality": "United States",
    "dorsal": 12,
    "age": 25,
    "fechaNacimiento": "1999-08-13",
    "source": "fc26"
  },
  "houston_dynamo|Agustín Bouzat (CDM)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 26,
    "age": 31,
    "fechaNacimiento": "1994-03-28",
    "source": "fc26"
  },
  "houston_dynamo|Guilherme (LM)": {
    "overall": 77,
    "nationality": "Qatar",
    "age": 34,
    "fechaNacimiento": "1991-04-05",
    "source": "fc26"
  },
  "houston_dynamo|Mateusz Bogusz (LW)": {
    "overall": 73,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "houston_dynamo|Ezequiel Ponce (ST)": {
    "overall": 73,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1997-03-29",
    "source": "fc26"
  },
  "houston_dynamo|Diadié Samassékou (CDM)": {
    "overall": 73,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "houston_dynamo|Jack McGlynn (CM)": {
    "overall": 71,
    "nationality": "United States",
    "dorsal": 21,
    "age": 21,
    "fechaNacimiento": "2003-07-07",
    "source": "fc26"
  },
  "houston_dynamo|Héctor Herrera (CM)": {
    "overall": 72,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "houston_dynamo|Antônio Carlos (CB)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 3,
    "age": 32,
    "fechaNacimiento": "1993-03-07",
    "source": "fc26"
  },
  "houston_dynamo|Ondřej Lingr (LM)": {
    "overall": 72,
    "nationality": "Czechia",
    "dorsal": 9,
    "age": 26,
    "fechaNacimiento": "1998-10-07",
    "source": "fc26"
  },
  "houston_dynamo|Artur (CDM)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 6,
    "age": 29,
    "fechaNacimiento": "1996-03-11",
    "source": "fc26"
  },
  "houston_dynamo|Lucas Halter (CB)": {
    "overall": 70,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "nashville_sc|Hany Mukhtar (CAM)": {
    "overall": 79,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1995-03-21",
    "source": "fc26"
  },
  "nashville_sc|Cristian Espinoza (RM)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1995-04-03",
    "source": "fc26"
  },
  "nashville_sc|Sam Surridge (ST)": {
    "overall": 74,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "nashville_sc|Andy Nájar (RB)": {
    "overall": 72,
    "nationality": "Honduras",
    "dorsal": 31,
    "age": 32,
    "fechaNacimiento": "1993-03-16",
    "source": "fc26"
  },
  "nashville_sc|Maxwell Woledzi (CB)": {
    "overall": 69,
    "nationality": "Ghana",
    "dorsal": 22,
    "age": 23,
    "fechaNacimiento": "2001-07-02",
    "source": "fc26"
  },
  "nashville_sc|Bryan Acosta (CM)": {
    "overall": 70,
    "nationality": "Honduras",
    "dorsal": 6,
    "age": 31,
    "fechaNacimiento": "1993-11-24",
    "source": "fc26"
  },
  "nashville_sc|Joe Willis (GK)": {
    "overall": 69,
    "nationality": "United States",
    "dorsal": 1,
    "age": 36,
    "fechaNacimiento": "1988-08-10",
    "source": "fc26"
  },
  "nashville_sc|Daniel Lovitz (LB)": {
    "overall": 68,
    "nationality": "United States",
    "dorsal": 2,
    "age": 33,
    "fechaNacimiento": "1991-08-27",
    "source": "fc26"
  },
  "nashville_sc|Alex Muyl (LM)": {
    "overall": 68,
    "nationality": "United States",
    "dorsal": 19,
    "age": 29,
    "fechaNacimiento": "1995-09-30",
    "source": "fc26"
  },
  "nashville_sc|Jeison Palacios (CB)": {
    "overall": 67,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "nashville_sc|Edvard Tagseth (CM)": {
    "overall": 67,
    "nationality": "Norway",
    "dorsal": 20,
    "age": 24,
    "fechaNacimiento": "2001-01-23",
    "source": "fc26"
  },
  "new_york_city_fc|Nicolás Fernández (RM)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "2000-01-11",
    "source": "fc26"
  },
  "new_york_city_fc|Hannes Wolf (RM)": {
    "overall": 71,
    "nationality": "Austria",
    "dorsal": 17,
    "age": 26,
    "fechaNacimiento": "1999-04-16",
    "source": "fc26"
  },
  "new_york_city_fc|Maxi Moralez (CAM)": {
    "overall": 72,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "new_york_city_fc|Alonso Martínez (ST)": {
    "overall": 72,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "new_york_city_fc|Thiago (CB)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 13,
    "age": 30,
    "fechaNacimiento": "1995-03-17",
    "source": "fc26"
  },
  "new_york_city_fc|Keaton Parks (CDM)": {
    "overall": 72,
    "nationality": "United States",
    "dorsal": 55,
    "age": 27,
    "fechaNacimiento": "1997-08-06",
    "source": "fc26"
  },
  "new_york_city_fc|Matt Freese (GK)": {
    "overall": 70,
    "dorsal": 49,
    "source": "latamfc26"
  },
  "new_york_city_fc|Aiden O'Neill (CDM)": {
    "overall": 70,
    "nationality": "Australia",
    "dorsal": 21,
    "age": 26,
    "fechaNacimiento": "1998-07-04",
    "source": "fc26"
  },
  "new_york_city_fc|Raul Gustavo (CB)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 34,
    "age": 26,
    "fechaNacimiento": "1999-04-24",
    "source": "fc26"
  },
  "new_york_city_fc|Kai Trewin (CB)": {
    "overall": 69,
    "nationality": "Australia",
    "dorsal": 27,
    "age": 24,
    "fechaNacimiento": "2001-05-18",
    "source": "fc26"
  },
  "new_york_city_fc|Agustín Ojeda (LM)": {
    "overall": 69,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "portland_timbers|David da Costa (CAM)": {
    "overall": 75,
    "nationality": "Portugal",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2001-01-05",
    "source": "fc26"
  },
  "portland_timbers|Alexander Aravena (LM)": {
    "overall": 73,
    "dorsal": 28,
    "source": "latamfc26"
  },
  "portland_timbers|Kamal Miller (CB)": {
    "overall": 71,
    "nationality": "Canada",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1997-05-16",
    "source": "fc26"
  },
  "portland_timbers|Antony (LM)": {
    "overall": 71,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 23,
    "fechaNacimiento": "2001-09-08",
    "source": "fc26"
  },
  "portland_timbers|Brandon Bye (RB)": {
    "overall": 70,
    "nationality": "United States",
    "dorsal": 15,
    "age": 29,
    "fechaNacimiento": "1995-11-29",
    "source": "fc26"
  },
  "portland_timbers|Diego Chará (CDM)": {
    "overall": 70,
    "nationality": "Colombia",
    "dorsal": 21,
    "age": 39,
    "fechaNacimiento": "1986-04-05",
    "source": "fc26"
  },
  "portland_timbers|Joao Ortiz (CDM)": {
    "overall": 64,
    "nationality": "Chile",
    "dorsal": 27,
    "age": 34,
    "fechaNacimiento": "1991-02-10",
    "source": "fc26"
  },
  "portland_timbers|Kristoffer Velde (LM)": {
    "overall": 70,
    "nationality": "Norway",
    "dorsal": 99,
    "age": 25,
    "fechaNacimiento": "1999-09-09",
    "source": "fc26"
  },
  "portland_timbers|Felipe Mora (ST)": {
    "overall": 71,
    "nationality": "Chile",
    "dorsal": 9,
    "age": 31,
    "fechaNacimiento": "1993-08-02",
    "source": "fc26"
  },
  "portland_timbers|Cole Bassett (CAM)": {
    "overall": 70,
    "nationality": "United States",
    "dorsal": 23,
    "age": 23,
    "fechaNacimiento": "2001-07-28",
    "source": "fc26"
  },
  "portland_timbers|Jímer Fory (LB)": {
    "overall": 69,
    "nationality": "Colombia",
    "dorsal": 27,
    "age": 23,
    "fechaNacimiento": "2002-05-24",
    "source": "fc26"
  },
  "real_salt_lake|Juan Manuel Sanabria (LB)": {
    "overall": 74,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "real_salt_lake|Victor Olatunji (ST)": {
    "overall": 73,
    "nationality": "Nigeria",
    "dorsal": 17,
    "age": 25,
    "fechaNacimiento": "1999-09-05",
    "source": "fc26"
  },
  "real_salt_lake|Morgan Guilavogui (LW)": {
    "overall": 73,
    "nationality": "Guinea",
    "dorsal": 29,
    "age": 27,
    "fechaNacimiento": "1998-03-10",
    "source": "fc26"
  },
  "real_salt_lake|Diego Luna (LM)": {
    "overall": 72,
    "nationality": "United States",
    "dorsal": 8,
    "age": 21,
    "fechaNacimiento": "2003-09-07",
    "source": "fc26"
  },
  "real_salt_lake|Pablo Ruiz (CDM)": {
    "overall": 70,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1998-12-20",
    "source": "fc26"
  },
  "real_salt_lake|Stijn Spierings (CM)": {
    "overall": 71,
    "nationality": "Netherlands",
    "dorsal": 6,
    "age": 29,
    "fechaNacimiento": "1996-03-12",
    "source": "fc26"
  },
  "real_salt_lake|Lukas Engel (LB)": {
    "overall": 71,
    "nationality": "Denmark",
    "dorsal": 29,
    "age": 26,
    "fechaNacimiento": "1998-12-14",
    "source": "fc26"
  },
  "real_salt_lake|DeAndre Yedlin (RB)": {
    "overall": 71,
    "nationality": "United States",
    "dorsal": 2,
    "age": 31,
    "fechaNacimiento": "1993-07-09",
    "source": "fc26"
  },
  "real_salt_lake|Emeka Eneli (CDM)": {
    "overall": 70,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "real_salt_lake|Juan Arias (CB)": {
    "overall": 68,
    "nationality": "Colombia",
    "dorsal": 23,
    "age": 21,
    "fechaNacimiento": "2004-01-08",
    "source": "fc26"
  },
  "real_salt_lake|Justen Glad (CB)": {
    "overall": 69,
    "nationality": "United States",
    "dorsal": 15,
    "age": 28,
    "fechaNacimiento": "1997-02-28",
    "source": "fc26"
  },
  "san_diego_fc|Anders Dreyer (RW)": {
    "overall": 77,
    "nationality": "Denmark",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-05-02",
    "source": "fc26"
  },
  "san_diego_fc|Hirving Lozano (LW)": {
    "overall": 78,
    "nationality": "Mexico",
    "dorsal": 11,
    "age": 29,
    "fechaNacimiento": "1995-07-30",
    "source": "fc26"
  },
  "san_diego_fc|Marcus Ingvartsen (ST)": {
    "overall": 74,
    "nationality": "Denmark",
    "dorsal": 7,
    "age": 29,
    "fechaNacimiento": "1996-01-04",
    "source": "fc26"
  },
  "san_diego_fc|Jeppe Tverskov (CM)": {
    "overall": 73,
    "nationality": "Denmark",
    "dorsal": 6,
    "age": 32,
    "fechaNacimiento": "1993-03-12",
    "source": "fc26"
  },
  "san_diego_fc|Lewis Morgan (ST)": {
    "overall": 73,
    "nationality": "Scotland",
    "dorsal": 9,
    "age": 28,
    "fechaNacimiento": "1996-09-30",
    "source": "fc26"
  },
  "san_diego_fc|Amahl Pellegrino (LM)": {
    "overall": 71,
    "nationality": "Norway",
    "dorsal": 90,
    "age": 35,
    "fechaNacimiento": "1990-06-18",
    "source": "fc26"
  },
  "san_diego_fc|Aníbal Godoy (CM)": {
    "overall": 70,
    "nationality": "Panama",
    "dorsal": 20,
    "age": 35,
    "fechaNacimiento": "1990-02-10",
    "source": "fc26"
  },
  "san_diego_fc|Onni Valakari (CM)": {
    "overall": 66,
    "nationality": "Finland",
    "dorsal": 8,
    "age": 25,
    "fechaNacimiento": "1999-08-18",
    "source": "fc26"
  },
  "san_diego_fc|Andrés Reyes (CB)": {
    "overall": 68,
    "nationality": "Colombia",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "1999-09-08",
    "source": "fc26"
  },
  "san_diego_fc|Alex Mighten (LM)": {
    "overall": 66,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "san_diego_fc|Christopher McVey (CB)": {
    "overall": 64,
    "nationality": "Sweden",
    "dorsal": 97,
    "age": 28,
    "fechaNacimiento": "1997-04-12",
    "source": "fc26"
  },
  "seattle_sounders|Albert Rusnák (CAM)": {
    "overall": 75,
    "nationality": "Slovakia",
    "dorsal": 11,
    "age": 30,
    "fechaNacimiento": "1994-07-07",
    "source": "fc26"
  },
  "seattle_sounders|Cristian Roldan (CDM)": {
    "overall": 74,
    "nationality": "United States",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1995-06-03",
    "source": "fc26"
  },
  "seattle_sounders|Yeimar Gómez Andrade (CB)": {
    "overall": 75,
    "nationality": "Colombia",
    "dorsal": 28,
    "age": 33,
    "fechaNacimiento": "1992-06-30",
    "source": "fc26"
  },
  "seattle_sounders|Pedro De la Vega (RM)": {
    "overall": 74,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2001-02-07",
    "source": "fc26"
  },
  "seattle_sounders|Jordan Morris (ST)": {
    "overall": 72,
    "nationality": "United States",
    "dorsal": 13,
    "age": 30,
    "fechaNacimiento": "1994-10-26",
    "source": "fc26"
  },
  "seattle_sounders|Jackson Ragen (CB)": {
    "overall": 71,
    "nationality": "United States",
    "dorsal": 25,
    "age": 26,
    "fechaNacimiento": "1998-09-24",
    "source": "fc26"
  },
  "seattle_sounders|Nouhou Tolo (LB)": {
    "overall": 71,
    "nationality": "Cameroon",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-06-23",
    "source": "fc26"
  },
  "seattle_sounders|Jesús Ferreira (ST)": {
    "overall": 72,
    "nationality": "United States",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-12-24",
    "source": "fc26"
  },
  "seattle_sounders|Alex Roldan (RB)": {
    "overall": 70,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "seattle_sounders|Stefan Frei (GK)": {
    "overall": 72,
    "nationality": "United States",
    "dorsal": 24,
    "age": 39,
    "fechaNacimiento": "1986-04-20",
    "source": "fc26"
  },
  "seattle_sounders|Kim Kee Hee (CB)": {
    "overall": 68,
    "nationality": "Korea Republic",
    "dorsal": 20,
    "age": 35,
    "fechaNacimiento": "1989-07-13",
    "source": "fc26"
  },
  "sporting_kc|Dejan Joveljić (ST)": {
    "overall": 75,
    "nationality": "Serbia",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "1999-08-07",
    "source": "fc26"
  },
  "sporting_kc|Manu García (CAM)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 27,
    "fechaNacimiento": "1998-01-02",
    "source": "fc26"
  },
  "sporting_kc|Lasse Berg Johnsen (CM)": {
    "overall": 73,
    "nationality": "Norway",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "1999-08-18",
    "source": "fc26"
  },
  "sporting_kc|Magomed-Shapi Suleymanov (RM)": {
    "overall": 69,
    "nationality": "Russia",
    "dorsal": 93,
    "age": 25,
    "fechaNacimiento": "1999-12-16",
    "source": "fc26"
  },
  "sporting_kc|Jake Davis (RB)": {
    "overall": 67,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "sporting_kc|John Pulskamp (GK)": {
    "overall": 64,
    "nationality": "United States",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2001-04-19",
    "source": "fc26"
  },
  "sporting_kc|Ethan Bartlow (CB)": {
    "overall": 64,
    "nationality": "United States",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "2000-02-02",
    "source": "fc26"
  },
  "sporting_kc|Stefan Cleveland (GK)": {
    "overall": 64,
    "nationality": "United States",
    "dorsal": 30,
    "age": 31,
    "fechaNacimiento": "1994-05-25",
    "source": "fc26"
  },
  "sporting_kc|Zorhan Bassong (LB)": {
    "overall": 63,
    "nationality": "Canada",
    "dorsal": 22,
    "age": 26,
    "fechaNacimiento": "1999-05-07",
    "source": "fc26"
  },
  "sporting_kc|Calvin Harris (RM)": {
    "overall": 57,
    "nationality": "England",
    "dorsal": 14,
    "age": 25,
    "fechaNacimiento": "2000-03-20",
    "source": "fc26"
  },
  "sporting_kc|Jansen Miller (CB)": {
    "overall": 59,
    "nationality": "United States",
    "dorsal": 15,
    "age": 23,
    "fechaNacimiento": "2002-02-10",
    "source": "fc26"
  },
  "st_louis_city_sc|Roman Bürki (GK)": {
    "overall": 77,
    "nationality": "Switzerland",
    "dorsal": 1,
    "age": 34,
    "fechaNacimiento": "1990-11-14",
    "source": "fc26"
  },
  "st_louis_city_sc|Marcel Hartel (CAM)": {
    "overall": 75,
    "nationality": "Germany",
    "dorsal": 17,
    "age": 29,
    "fechaNacimiento": "1996-01-19",
    "source": "fc26"
  },
  "st_louis_city_sc|Eduard Löwen (CM)": {
    "overall": 74,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1997-01-28",
    "source": "fc26"
  },
  "st_louis_city_sc|Conrad Wallem (RM)": {
    "overall": 70,
    "nationality": "Norway",
    "dorsal": 6,
    "age": 25,
    "fechaNacimiento": "2000-06-09",
    "source": "fc26"
  },
  "st_louis_city_sc|Timo Baumgartl (CB)": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 32,
    "age": 29,
    "fechaNacimiento": "1996-03-04",
    "source": "fc26"
  },
  "st_louis_city_sc|Mamadou Mbacke (CB)": {
    "overall": 69,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "st_louis_city_sc|Cedric Teuchert (CAM)": {
    "overall": 68,
    "nationality": "Germany",
    "dorsal": 36,
    "age": 28,
    "fechaNacimiento": "1997-01-14",
    "source": "fc26"
  },
  "st_louis_city_sc|Kyle Hiebert (CB)": {
    "overall": 67,
    "nationality": "Canada",
    "dorsal": 22,
    "age": 27,
    "fechaNacimiento": "1997-07-30",
    "source": "fc26"
  },
  "st_louis_city_sc|Daniel Edelman (CDM)": {
    "overall": 67,
    "nationality": "United States",
    "dorsal": 75,
    "age": 22,
    "fechaNacimiento": "2003-04-28",
    "source": "fc26"
  },
  "st_louis_city_sc|Sergio Córdova (ST)": {
    "overall": 67,
    "nationality": "Venezuela",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1997-08-09",
    "source": "fc26"
  },
  "st_louis_city_sc|Fallou Fall (CB)": {
    "overall": 66,
    "nationality": "Senegal",
    "dorsal": 88,
    "age": 21,
    "fechaNacimiento": "2004-04-15",
    "source": "fc26"
  },
  "toronto_fc|Djordje Mihailovic (CAM)": {
    "overall": 75,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "toronto_fc|Josh Sargent (ST)": {
    "overall": 74,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "toronto_fc|Walker Zimmerman (CB)": {
    "overall": 75,
    "nationality": "United States",
    "dorsal": 25,
    "age": 32,
    "fechaNacimiento": "1993-05-19",
    "source": "fc26"
  },
  "toronto_fc|Benjamín Kuscevic (CB)": {
    "overall": 73,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "toronto_fc|José Cifuentes (CM)": {
    "overall": 72,
    "nationality": "Ecuador",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1999-03-12",
    "source": "fc26"
  },
  "toronto_fc|Richie Laryea (RM)": {
    "overall": 72,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "toronto_fc|Dániel Sallói (LW)": {
    "overall": 71,
    "nationality": "Hungary",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1996-07-19",
    "source": "fc26"
  },
  "toronto_fc|Jonathan Osorio (CM)": {
    "overall": 71,
    "nationality": "Canada",
    "dorsal": 21,
    "age": 33,
    "fechaNacimiento": "1992-06-12",
    "source": "fc26"
  },
  "toronto_fc|Matheus Pereira (LB)": {
    "overall": 70,
    "nationality": "Brazil",
    "dorsal": 3,
    "age": 24,
    "fechaNacimiento": "2000-12-21",
    "source": "fc26"
  },
  "toronto_fc|Theo Corbeanu (RM)": {
    "overall": 69,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "toronto_fc|Emilio Aristizábal (ST)": {
    "overall": 67,
    "dorsal": 17,
    "source": "latamfc26"
  },
  "vancouver_whitecaps|Thomas Müller (CAM)": {
    "overall": 80,
    "nationality": "Germany",
    "dorsal": 13,
    "age": 35,
    "fechaNacimiento": "1989-09-13",
    "source": "fc26"
  },
  "vancouver_whitecaps|Ryan Gauld (LW)": {
    "overall": 78,
    "nationality": "Scotland",
    "dorsal": 25,
    "age": 29,
    "fechaNacimiento": "1995-12-16",
    "source": "fc26"
  },
  "vancouver_whitecaps|Brian White (ST)": {
    "overall": 75,
    "nationality": "United States",
    "dorsal": 24,
    "age": 29,
    "fechaNacimiento": "1996-02-03",
    "source": "fc26"
  },
  "vancouver_whitecaps|Andrés Cubas (CDM)": {
    "overall": 74,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "vancouver_whitecaps|Cheikh Sabaly (ST)": {
    "overall": 72,
    "nationality": "Senegal",
    "dorsal": 14,
    "age": 26,
    "fechaNacimiento": "1999-03-04",
    "source": "fc26"
  },
  "vancouver_whitecaps|Yohei Takaoka (GK)": {
    "overall": 72,
    "nationality": "Japan",
    "dorsal": 1,
    "age": 29,
    "fechaNacimiento": "1996-03-16",
    "source": "fc26"
  },
  "vancouver_whitecaps|Kenji Cabrera (CAM)": {
    "overall": 71,
    "nationality": "Peru",
    "dorsal": 17,
    "age": 22,
    "fechaNacimiento": "2003-01-27",
    "source": "fc26"
  },
  "vancouver_whitecaps|Mathías Laborda (CB)": {
    "overall": 70,
    "nationality": "Uruguay",
    "dorsal": 2,
    "age": 25,
    "fechaNacimiento": "1999-09-15",
    "source": "fc26"
  },
  "vancouver_whitecaps|Tristan Blackmon (CB)": {
    "overall": 70,
    "nationality": "United States",
    "dorsal": 33,
    "age": 28,
    "fechaNacimiento": "1996-08-12",
    "source": "fc26"
  },
  "vancouver_whitecaps|Sebastian Berhalter (CM)": {
    "overall": 67,
    "nationality": "United States",
    "dorsal": 16,
    "age": 24,
    "fechaNacimiento": "2001-05-10",
    "source": "fc26"
  },
  "vancouver_whitecaps|Emmanuel Sabbi (RW)": {
    "overall": 70,
    "nationality": "United States",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1997-12-24",
    "source": "fc26"
  },
  "athletic_club_esp|Fabrício Isidoro (CM)": {
    "overall": 69,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "athletic_club_esp|Ronaldo Tavares (ST)": {
    "overall": 68,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "athletic_club_esp|Polli (GK)": {
    "overall": 68,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "athletic_club_esp|Philipe Sampaio (CB)": {
    "overall": 68,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "athletic_club_esp|Zeca (RB)": {
    "overall": 73,
    "nationality": "Brazil",
    "dorsal": 19,
    "age": 28,
    "fechaNacimiento": "1997-03-06",
    "source": "fc26"
  },
  "athletic_club_esp|Gustavinho (CAM)": {
    "overall": 66,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "athletic_club_esp|Glauco (GK)": {
    "overall": 65,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "athletic_club_esp|Léo Chú (LM)": {
    "overall": 66,
    "nationality": "Brazil",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "2000-04-06",
    "source": "fc26"
  },
  "athletic_club_esp|Dixon Vera (LW)": {
    "overall": 65,
    "dorsal": 77,
    "source": "latamfc26"
  },
  "athletic_club_esp|Sidimar (CB)": {
    "overall": 65,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "athletic_club_esp|Gian Franco Cabezas (CM)": {
    "overall": 64,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "atletico_de_madrid|Jan Oblak (GK)": {
    "overall": 88,
    "nationality": "Slovenia",
    "dorsal": 13,
    "age": 32,
    "fechaNacimiento": "1993-01-07",
    "source": "fc26"
  },
  "atletico_de_madrid|Julián Alvarez (ST)": {
    "overall": 87,
    "nationality": "Argentina",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "2000-01-31",
    "source": "fc26"
  },
  "atletico_de_madrid|Marcos Llorente (RB)": {
    "overall": 84,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 30,
    "fechaNacimiento": "1995-01-30",
    "source": "fc26"
  },
  "atletico_de_madrid|Antoine Griezmann (ST)": {
    "overall": 85,
    "nationality": "France",
    "dorsal": 7,
    "age": 34,
    "fechaNacimiento": "1991-03-21",
    "source": "fc26"
  },
  "atletico_de_madrid|Dávid Hancko (LB)": {
    "overall": 83,
    "nationality": "Slovakia",
    "dorsal": 17,
    "age": 27,
    "fechaNacimiento": "1997-12-13",
    "source": "fc26"
  },
  "atletico_de_madrid|Pablo Barrios (CM)": {
    "overall": 82,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 22,
    "fechaNacimiento": "2003-06-15",
    "source": "fc26"
  },
  "atletico_de_madrid|Álex Baena (LM)": {
    "overall": 84,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2001-07-20",
    "source": "fc26"
  },
  "atletico_de_madrid|Alexander Sørloth (ST)": {
    "overall": 84,
    "nationality": "Norway",
    "dorsal": 9,
    "age": 29,
    "fechaNacimiento": "1995-12-05",
    "source": "fc26"
  },
  "atletico_de_madrid|Ademola Lookman (ST)": {
    "overall": 84,
    "nationality": "Nigeria",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1997-10-20",
    "source": "fc26"
  },
  "atletico_de_madrid|José María Giménez (CB)": {
    "overall": 83,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "atletico_de_madrid|Giuliano (RM)": {
    "overall": 81,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "ca_osasuna|Ante Budimir (ST)": {
    "overall": 82,
    "nationality": "Croatia",
    "dorsal": 17,
    "age": 33,
    "fechaNacimiento": "1991-07-22",
    "source": "fc26"
  },
  "ca_osasuna|Sergio Herrera (GK)": {
    "overall": 79,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1993-06-06",
    "source": "fc26"
  },
  "ca_osasuna|Flavien-Enzo Boyomo (CB)": {
    "overall": 79,
    "dorsal": 22,
    "source": "latamfc26"
  },
  "ca_osasuna|Catena (CB)": {
    "overall": 79,
    "nationality": "Spain",
    "dorsal": 24,
    "age": 30,
    "fechaNacimiento": "1994-10-28",
    "source": "fc26"
  },
  "ca_osasuna|Moncayola (CM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1998-05-13",
    "source": "fc26"
  },
  "ca_osasuna|Lucas Torró (CDM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 6,
    "age": 30,
    "fechaNacimiento": "1994-07-19",
    "source": "fc26"
  },
  "ca_osasuna|Rubén García (RM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 31,
    "fechaNacimiento": "1993-07-14",
    "source": "fc26"
  },
  "ca_osasuna|Víctor Muñoz (LW)": {
    "overall": 65,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 21,
    "fechaNacimiento": "2003-07-13",
    "source": "fc26"
  },
  "ca_osasuna|Valentin Rosier (RB)": {
    "overall": 77,
    "nationality": "France",
    "dorsal": 19,
    "age": 28,
    "fechaNacimiento": "1996-08-19",
    "source": "fc26"
  },
  "ca_osasuna|Javi Galán (LB)": {
    "overall": 80,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 30,
    "fechaNacimiento": "1994-11-19",
    "source": "fc26"
  },
  "ca_osasuna|Aimar Oroz (CAM)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2001-11-27",
    "source": "fc26"
  },
  "elche_cf|Aleix Febas (CM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 29,
    "fechaNacimiento": "1996-02-02",
    "source": "fc26"
  },
  "elche_cf|Iñaki Peña (GK)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 26,
    "fechaNacimiento": "1999-03-02",
    "source": "fc26"
  },
  "elche_cf|Bigas (CB)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 6,
    "age": 34,
    "fechaNacimiento": "1990-09-15",
    "source": "fc26"
  },
  "elche_cf|André da Silva (ST)": {
    "overall": 76,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "elche_cf|David Affengruber (CB)": {
    "overall": 75,
    "nationality": "Austria",
    "dorsal": 22,
    "age": 24,
    "fechaNacimiento": "2001-03-19",
    "source": "fc26"
  },
  "elche_cf|Valera (LM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 23,
    "fechaNacimiento": "2002-03-16",
    "source": "fc26"
  },
  "elche_cf|Rafa Mir (ST)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1997-06-18",
    "source": "fc26"
  },
  "elche_cf|Matías Dituro (GK)": {
    "overall": 75,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 38,
    "fechaNacimiento": "1987-05-08",
    "source": "fc26"
  },
  "elche_cf|Adrià Pedrosa (LB)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 27,
    "fechaNacimiento": "1998-05-13",
    "source": "fc26"
  },
  "elche_cf|Víctor Chust (CB)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "2000-03-05",
    "source": "fc26"
  },
  "elche_cf|Marc Aguado (CDM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 25,
    "fechaNacimiento": "2000-02-22",
    "source": "fc26"
  },
  "fc_barcelona|Pedri (CM)": {
    "overall": 89,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 22,
    "fechaNacimiento": "2002-11-25",
    "source": "fc26"
  },
  "fc_barcelona|Lamine Yamal (RW)": {
    "overall": 89,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 17,
    "fechaNacimiento": "2007-07-13",
    "source": "fc26"
  },
  "fc_barcelona|Raphinha (LW)": {
    "overall": 89,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 28,
    "fechaNacimiento": "1996-12-14",
    "source": "fc26"
  },
  "fc_barcelona|Frenkie de Jong (CM)": {
    "overall": 87,
    "nationality": "Netherlands",
    "dorsal": 21,
    "age": 28,
    "fechaNacimiento": "1997-05-12",
    "source": "fc26"
  },
  "fc_barcelona|Joan García (GK)": {
    "overall": 83,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 24,
    "fechaNacimiento": "2001-05-04",
    "source": "fc26"
  },
  "fc_barcelona|Jules Koundé (RB)": {
    "overall": 87,
    "nationality": "France",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1998-11-12",
    "source": "fc26"
  },
  "fc_barcelona|Robert Lewandowski (ST)": {
    "overall": 88,
    "nationality": "Poland",
    "dorsal": 9,
    "age": 36,
    "fechaNacimiento": "1988-08-21",
    "source": "fc26"
  },
  "fc_barcelona|João Cancelo (RB)": {
    "overall": 84,
    "nationality": "Portugal",
    "dorsal": 20,
    "age": 31,
    "fechaNacimiento": "1994-05-27",
    "source": "fc26"
  },
  "fc_barcelona|Ferran Torres (ST)": {
    "overall": 83,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "2000-02-29",
    "source": "fc26"
  },
  "fc_barcelona|Dani Olmo (CAM)": {
    "overall": 85,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-05-07",
    "source": "fc26"
  },
  "fc_barcelona|Eric García (CB)": {
    "overall": 79,
    "nationality": "Spain",
    "dorsal": 24,
    "age": 24,
    "fechaNacimiento": "2001-01-09",
    "source": "fc26"
  },
  "getafe_cf|Luis Milla (CM)": {
    "overall": 79,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 30,
    "fechaNacimiento": "1994-10-07",
    "source": "fc26"
  },
  "getafe_cf|David Soria (GK)": {
    "overall": 81,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 32,
    "fechaNacimiento": "1993-04-04",
    "source": "fc26"
  },
  "getafe_cf|Mauro Arambarri (CM)": {
    "overall": 80,
    "nationality": "Uruguay",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1995-09-30",
    "source": "fc26"
  },
  "getafe_cf|Diego Rico (LB)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 32,
    "fechaNacimiento": "1993-02-23",
    "source": "fc26"
  },
  "getafe_cf|Dakonam Djené (CB)": {
    "overall": 77,
    "nationality": "Togo",
    "dorsal": 2,
    "age": 33,
    "fechaNacimiento": "1991-12-31",
    "source": "fc26"
  },
  "getafe_cf|Veljko Birmančević (LW)": {
    "overall": 76,
    "nationality": "Serbia",
    "dorsal": 14,
    "age": 27,
    "fechaNacimiento": "1998-03-05",
    "source": "fc26"
  },
  "getafe_cf|Borja Mayoral (ST)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 9,
    "age": 28,
    "fechaNacimiento": "1997-04-05",
    "source": "fc26"
  },
  "getafe_cf|Martín Satriano (ST)": {
    "overall": 74,
    "nationality": "Uruguay",
    "dorsal": 20,
    "age": 24,
    "fechaNacimiento": "2001-02-20",
    "source": "fc26"
  },
  "getafe_cf|Kiko Femenía (RB)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 17,
    "age": 34,
    "fechaNacimiento": "1991-02-02",
    "source": "fc26"
  },
  "getafe_cf|Abdelkabir Abqar (CB)": {
    "overall": 74,
    "nationality": "Morocco",
    "dorsal": 3,
    "age": 26,
    "fechaNacimiento": "1999-03-10",
    "source": "fc26"
  },
  "getafe_cf|Domingos Duarte (CB)": {
    "overall": 74,
    "nationality": "Portugal",
    "dorsal": 22,
    "age": 30,
    "fechaNacimiento": "1995-03-10",
    "source": "fc26"
  },
  "girona_fc|Marc-André ter Stegen (GK)": {
    "overall": 86,
    "nationality": "Germany",
    "dorsal": 1,
    "age": 33,
    "fechaNacimiento": "1992-04-30",
    "source": "fc26"
  },
  "girona_fc|Paulo Gazzaniga (GK)": {
    "overall": 79,
    "nationality": "Argentina",
    "dorsal": 13,
    "age": 33,
    "fechaNacimiento": "1992-01-02",
    "source": "fc26"
  },
  "girona_fc|Arnau Martínez (RB)": {
    "overall": 79,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 22,
    "fechaNacimiento": "2003-04-25",
    "source": "fc26"
  },
  "girona_fc|Viktor Tsygankov (RM)": {
    "overall": 79,
    "nationality": "Ukraine",
    "dorsal": 15,
    "age": 27,
    "fechaNacimiento": "1997-11-15",
    "source": "fc26"
  },
  "girona_fc|Azzedine Ounahi (CM)": {
    "overall": 76,
    "nationality": "Morocco",
    "dorsal": 18,
    "age": 25,
    "fechaNacimiento": "2000-04-19",
    "source": "fc26"
  },
  "girona_fc|Álex Moreno (LB)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 24,
    "age": 32,
    "fechaNacimiento": "1993-06-08",
    "source": "fc26"
  },
  "girona_fc|Fran Beltrán (CM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1999-02-03",
    "source": "fc26"
  },
  "girona_fc|Bryan Gil (LW)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 24,
    "fechaNacimiento": "2001-02-11",
    "source": "fc26"
  },
  "girona_fc|Vladyslav Vanat (ST)": {
    "overall": 76,
    "nationality": "Ukraine",
    "dorsal": 19,
    "age": 23,
    "fechaNacimiento": "2002-01-04",
    "source": "fc26"
  },
  "girona_fc|Thomas Lemar (CM)": {
    "overall": 77,
    "nationality": "France",
    "dorsal": 11,
    "age": 29,
    "fechaNacimiento": "1995-11-12",
    "source": "fc26"
  },
  "girona_fc|Iván Martín (CM)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1999-02-14",
    "source": "fc26"
  },
  "levante_ud|Mathew Ryan (GK)": {
    "overall": 78,
    "nationality": "Australia",
    "dorsal": 13,
    "age": 33,
    "fechaNacimiento": "1992-04-08",
    "source": "fc26"
  },
  "levante_ud|Carlos Álvarez (RM)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 24,
    "age": 21,
    "fechaNacimiento": "2003-08-06",
    "source": "fc26"
  },
  "levante_ud|Manu Sánchez (LB)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 24,
    "fechaNacimiento": "2000-08-24",
    "source": "fc26"
  },
  "levante_ud|Pablo Martínez (LM)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-02-22",
    "source": "fc26"
  },
  "levante_ud|Karl Edouard Etta Eyong (ST)": {
    "overall": 75,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "levante_ud|Jeremy Toljan (RB)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 22,
    "age": 30,
    "fechaNacimiento": "1994-08-08",
    "source": "fc26"
  },
  "levante_ud|Dela (CB)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1999-02-26",
    "source": "fc26"
  },
  "levante_ud|Iván Romero (ST)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2001-04-10",
    "source": "fc26"
  },
  "levante_ud|Kervin Arriaga (CDM)": {
    "overall": 73,
    "nationality": "Honduras",
    "dorsal": 16,
    "age": 27,
    "fechaNacimiento": "1998-01-05",
    "source": "fc26"
  },
  "levante_ud|Morales (ST)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 37,
    "fechaNacimiento": "1987-07-23",
    "source": "fc26"
  },
  "levante_ud|Oriol Rey (CM)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-02-25",
    "source": "fc26"
  },
  "rcd_espanyol|Marko Dmitrović (GK)": {
    "overall": 79,
    "nationality": "Serbia",
    "dorsal": 13,
    "age": 33,
    "fechaNacimiento": "1992-01-24",
    "source": "fc26"
  },
  "rcd_espanyol|Carlos Romero (LB)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 23,
    "fechaNacimiento": "2001-10-29",
    "source": "fc26"
  },
  "rcd_espanyol|Edu Expósito (CAM)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1996-08-01",
    "source": "fc26"
  },
  "rcd_espanyol|Leandro Cabrera (CB)": {
    "overall": 75,
    "nationality": "Uruguay",
    "dorsal": 6,
    "age": 34,
    "fechaNacimiento": "1991-06-17",
    "source": "fc26"
  },
  "rcd_espanyol|Puado (LM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1998-05-25",
    "source": "fc26"
  },
  "rcd_espanyol|Omar El Hilali (RB)": {
    "overall": 77,
    "nationality": "Morocco",
    "dorsal": 23,
    "age": 21,
    "fechaNacimiento": "2003-09-12",
    "source": "fc26"
  },
  "rcd_espanyol|Pol Lozano (CDM)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "1999-10-06",
    "source": "fc26"
  },
  "rcd_espanyol|Pere Milla (LM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 32,
    "fechaNacimiento": "1992-09-23",
    "source": "fc26"
  },
  "rcd_espanyol|Calero (CB)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 29,
    "fechaNacimiento": "1995-09-14",
    "source": "fc26"
  },
  "rcd_espanyol|Urko González (CDM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 24,
    "fechaNacimiento": "2001-03-20",
    "source": "fc26"
  },
  "rcd_espanyol|Tyrhys Dolan (RW)": {
    "overall": 69,
    "nationality": "England",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2001-12-28",
    "source": "fc26"
  },
  "rcd_mallorca|Vedat Muriqi (ST)": {
    "overall": 79,
    "nationality": "Kosovo",
    "dorsal": 7,
    "age": 31,
    "fechaNacimiento": "1994-04-24",
    "source": "fc26"
  },
  "rcd_mallorca|Raíllo (CB)": {
    "overall": 81,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 33,
    "fechaNacimiento": "1991-10-08",
    "source": "fc26"
  },
  "rcd_mallorca|Sergi Darder (CM)": {
    "overall": 81,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 31,
    "fechaNacimiento": "1993-12-22",
    "source": "fc26"
  },
  "rcd_mallorca|Maffeo (RB)": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 23,
    "age": 27,
    "fechaNacimiento": "1997-07-12",
    "source": "fc26"
  },
  "rcd_mallorca|Samú Costa (CDM)": {
    "overall": 78,
    "nationality": "Portugal",
    "dorsal": 12,
    "age": 24,
    "fechaNacimiento": "2000-11-27",
    "source": "fc26"
  },
  "rcd_mallorca|Leo Román (GK)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2000-07-06",
    "source": "fc26"
  },
  "rcd_mallorca|Martin Valjent (CB)": {
    "overall": 77,
    "nationality": "Slovakia",
    "dorsal": 24,
    "age": 29,
    "fechaNacimiento": "1995-12-11",
    "source": "fc26"
  },
  "rcd_mallorca|Johan Mojica (LB)": {
    "overall": 78,
    "nationality": "Colombia",
    "dorsal": 22,
    "age": 32,
    "fechaNacimiento": "1992-08-21",
    "source": "fc26"
  },
  "rcd_mallorca|Manu Morlanes (CDM)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1999-01-12",
    "source": "fc26"
  },
  "rcd_mallorca|Marash Kumbulla (CB)": {
    "overall": 77,
    "nationality": "Albania",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "2000-02-08",
    "source": "fc26"
  },
  "rcd_mallorca|Omar Mascarell (CDM)": {
    "overall": 75,
    "nationality": "Equatorial Guinea",
    "dorsal": 5,
    "age": 32,
    "fechaNacimiento": "1993-02-02",
    "source": "fc26"
  },
  "rayo_vallecano|Álvaro García (LM)": {
    "overall": 80,
    "nationality": "Spain",
    "dorsal": 18,
    "age": 32,
    "fechaNacimiento": "1992-10-27",
    "source": "fc26"
  },
  "rayo_vallecano|Isi (CAM)": {
    "overall": 81,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1994-12-27",
    "source": "fc26"
  },
  "rayo_vallecano|De Frutos (RM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 19,
    "age": 28,
    "fechaNacimiento": "1997-02-20",
    "source": "fc26"
  },
  "rayo_vallecano|Augusto Batalla (GK)": {
    "overall": 79,
    "nationality": "Argentina",
    "dorsal": 13,
    "age": 29,
    "fechaNacimiento": "1996-04-30",
    "source": "fc26"
  },
  "rayo_vallecano|Andrei Rațiu (RB)": {
    "overall": 79,
    "nationality": "Romania",
    "dorsal": 2,
    "age": 27,
    "fechaNacimiento": "1998-06-20",
    "source": "fc26"
  },
  "rayo_vallecano|Florian Lejeune (CB)": {
    "overall": 78,
    "nationality": "France",
    "dorsal": 24,
    "age": 34,
    "fechaNacimiento": "1991-05-20",
    "source": "fc26"
  },
  "rayo_vallecano|Pep Chavarría (LB)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 27,
    "fechaNacimiento": "1998-04-10",
    "source": "fc26"
  },
  "rayo_vallecano|Pathé Ciss (CDM)": {
    "overall": 77,
    "nationality": "Senegal",
    "dorsal": 6,
    "age": 31,
    "fechaNacimiento": "1994-03-16",
    "source": "fc26"
  },
  "rayo_vallecano|Óscar Valentín (CDM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 30,
    "fechaNacimiento": "1994-08-20",
    "source": "fc26"
  },
  "rayo_vallecano|Abdul Mumin (CB)": {
    "overall": 77,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "rayo_vallecano|Unai López (CM)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 17,
    "age": 29,
    "fechaNacimiento": "1995-10-30",
    "source": "fc26"
  },
  "real_madrid|Kylian Mbappé (ST)": {
    "overall": 91,
    "nationality": "France",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1998-12-20",
    "source": "fc26"
  },
  "real_madrid|Thibaut Courtois (GK)": {
    "overall": 89,
    "nationality": "Belgium",
    "dorsal": 1,
    "age": 33,
    "fechaNacimiento": "1992-05-11",
    "source": "fc26"
  },
  "real_madrid|Jude Bellingham (CAM)": {
    "overall": 90,
    "nationality": "England",
    "dorsal": 5,
    "age": 22,
    "fechaNacimiento": "2003-06-29",
    "source": "fc26"
  },
  "real_madrid|Vini Jr. (LW)": {
    "overall": 89,
    "nationality": "Brazil",
    "dorsal": 7,
    "age": 24,
    "fechaNacimiento": "2000-07-12",
    "source": "fc26"
  },
  "real_madrid|Federico Valverde (CM)": {
    "overall": 89,
    "nationality": "Uruguay",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1998-07-22",
    "source": "fc26"
  },
  "real_madrid|Trent Alexander-Arnold (RB)": {
    "overall": 86,
    "nationality": "England",
    "dorsal": 12,
    "age": 26,
    "fechaNacimiento": "1998-10-07",
    "source": "fc26"
  },
  "real_madrid|Antonio Rüdiger (CB)": {
    "overall": 86,
    "nationality": "Germany",
    "dorsal": 22,
    "age": 32,
    "fechaNacimiento": "1993-03-03",
    "source": "fc26"
  },
  "real_madrid|Aurélien Tchouaméni (CDM)": {
    "overall": 84,
    "nationality": "France",
    "dorsal": 14,
    "age": 25,
    "fechaNacimiento": "2000-01-27",
    "source": "fc26"
  },
  "real_madrid|Carvajal (RB)": {
    "overall": 85,
    "nationality": "Spain",
    "dorsal": 2,
    "age": 33,
    "fechaNacimiento": "1992-01-11",
    "source": "fc26"
  },
  "real_madrid|Éder Militão (CB)": {
    "overall": 84,
    "nationality": "Brazil",
    "dorsal": 3,
    "age": 27,
    "fechaNacimiento": "1998-01-18",
    "source": "fc26"
  },
  "real_madrid|Rodrygo (LM)": {
    "overall": 85,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2001-01-09",
    "source": "fc26"
  },
  "real_sociedad|Álex Remiro (GK)": {
    "overall": 83,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 30,
    "fechaNacimiento": "1995-03-24",
    "source": "fc26"
  },
  "real_sociedad|Oyarzabal (ST)": {
    "overall": 82,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1997-04-21",
    "source": "fc26"
  },
  "real_sociedad|Takefusa Kubo (RM)": {
    "overall": 82,
    "nationality": "Japan",
    "dorsal": 14,
    "age": 24,
    "fechaNacimiento": "2001-06-04",
    "source": "fc26"
  },
  "real_sociedad|Yangel Herrera (CM)": {
    "overall": 81,
    "nationality": "Venezuela",
    "dorsal": 12,
    "age": 27,
    "fechaNacimiento": "1998-01-07",
    "source": "fc26"
  },
  "real_sociedad|Sergio Gómez (LM)": {
    "overall": 79,
    "nationality": "Spain",
    "dorsal": 17,
    "age": 24,
    "fechaNacimiento": "2000-09-04",
    "source": "fc26"
  },
  "real_sociedad|Brais Méndez (CM)": {
    "overall": 81,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 28,
    "fechaNacimiento": "1997-01-07",
    "source": "fc26"
  },
  "real_sociedad|Barrenetxea (LW)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2001-12-27",
    "source": "fc26"
  },
  "real_sociedad|Jon Mikel Aramburu (RB)": {
    "overall": 77,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "real_sociedad|Carlos Soler (CM)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 18,
    "age": 28,
    "fechaNacimiento": "1997-01-02",
    "source": "fc26"
  },
  "real_sociedad|Zubeldia (CB)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 28,
    "fechaNacimiento": "1997-03-30",
    "source": "fc26"
  },
  "real_sociedad|Gorrotxa (CDM)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 23,
    "fechaNacimiento": "2002-02-02",
    "source": "fc26"
  },
  "sevilla_fc|Odysseas Vlachodimos (GK)": {
    "overall": 72,
    "nationality": "Greece",
    "dorsal": 1,
    "age": 31,
    "fechaNacimiento": "1994-04-26",
    "source": "fc26"
  },
  "sevilla_fc|Azpilicueta (CB)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 35,
    "fechaNacimiento": "1989-08-28",
    "source": "fc26"
  },
  "sevilla_fc|Ruben Vargas (LW)": {
    "overall": 75,
    "nationality": "Switzerland",
    "dorsal": 11,
    "age": 26,
    "fechaNacimiento": "1998-08-05",
    "source": "fc26"
  },
  "sevilla_fc|Carmona (RB)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 2,
    "age": 23,
    "fechaNacimiento": "2002-01-29",
    "source": "fc26"
  },
  "sevilla_fc|Chidera Ejuke (LW)": {
    "overall": 78,
    "nationality": "Nigeria",
    "dorsal": 21,
    "age": 27,
    "fechaNacimiento": "1998-01-02",
    "source": "fc26"
  },
  "sevilla_fc|Nemanja Gudelj (CDM)": {
    "overall": 77,
    "nationality": "Serbia",
    "dorsal": 6,
    "age": 33,
    "fechaNacimiento": "1991-11-16",
    "source": "fc26"
  },
  "sevilla_fc|Batista Mendy (CDM)": {
    "overall": 76,
    "nationality": "France",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "2000-01-12",
    "source": "fc26"
  },
  "sevilla_fc|Kike Salas (CB)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 23,
    "fechaNacimiento": "2002-04-23",
    "source": "fc26"
  },
  "sevilla_fc|Juanlu Sánchez (RB)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 21,
    "fechaNacimiento": "2003-08-15",
    "source": "fc26"
  },
  "sevilla_fc|Lucien Agoumé (CDM)": {
    "overall": 75,
    "nationality": "France",
    "dorsal": 18,
    "age": 23,
    "fechaNacimiento": "2002-02-09",
    "source": "fc26"
  },
  "sevilla_fc|Djibril Sow (CM)": {
    "overall": 75,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "valencia_cf|Stole Dimitrievski (GK)": {
    "overall": 79,
    "nationality": "North Macedonia",
    "dorsal": 1,
    "age": 31,
    "fechaNacimiento": "1993-12-25",
    "source": "fc26"
  },
  "valencia_cf|Gayà (LB)": {
    "overall": 81,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 30,
    "fechaNacimiento": "1995-05-25",
    "source": "fc26"
  },
  "valencia_cf|Luis Rioja (RM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 31,
    "fechaNacimiento": "1993-10-16",
    "source": "fc26"
  },
  "valencia_cf|Hugo Duro (ST)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "1999-11-10",
    "source": "fc26"
  },
  "valencia_cf|Diego López (LM)": {
    "overall": 78,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 23,
    "fechaNacimiento": "2002-05-13",
    "source": "fc26"
  },
  "valencia_cf|Agirrezabala (GK)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 25,
    "age": 24,
    "fechaNacimiento": "2000-12-26",
    "source": "fc26"
  },
  "valencia_cf|Guido Rodríguez (CDM)": {
    "overall": 77,
    "nationality": "Argentina",
    "dorsal": 24,
    "age": 31,
    "fechaNacimiento": "1994-04-12",
    "source": "fc26"
  },
  "valencia_cf|Umar Sadiq (ST)": {
    "overall": 77,
    "nationality": "Nigeria",
    "dorsal": 15,
    "age": 28,
    "fechaNacimiento": "1997-02-02",
    "source": "fc26"
  },
  "valencia_cf|Pepelu (CM)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 18,
    "age": 26,
    "fechaNacimiento": "1998-08-11",
    "source": "fc26"
  },
  "valencia_cf|Javi Guerra (CM)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 22,
    "fechaNacimiento": "2003-05-13",
    "source": "fc26"
  },
  "valencia_cf|Mouctar Diakhaby (CB)": {
    "overall": 76,
    "nationality": "Guinea",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1996-12-19",
    "source": "fc26"
  },
  "villarreal_cf|Nicolas Pépé (RM)": {
    "overall": 80,
    "nationality": "Côte d'Ivoire",
    "dorsal": 19,
    "age": 30,
    "fechaNacimiento": "1995-05-29",
    "source": "fc26"
  },
  "villarreal_cf|Moleiro (LM)": {
    "overall": 79,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 21,
    "fechaNacimiento": "2003-09-30",
    "source": "fc26"
  },
  "villarreal_cf|Gerard Moreno (ST)": {
    "overall": 81,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 33,
    "fechaNacimiento": "1992-04-07",
    "source": "fc26"
  },
  "villarreal_cf|Ayoze (ST)": {
    "overall": 83,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 31,
    "fechaNacimiento": "1993-07-29",
    "source": "fc26"
  },
  "villarreal_cf|Pape Gueye (CM)": {
    "overall": 78,
    "nationality": "Senegal",
    "dorsal": 18,
    "age": 26,
    "fechaNacimiento": "1999-01-24",
    "source": "fc26"
  },
  "villarreal_cf|Parejo (CM)": {
    "overall": 82,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 36,
    "fechaNacimiento": "1989-04-16",
    "source": "fc26"
  },
  "villarreal_cf|Georges Mikautadze (ST)": {
    "overall": 77,
    "nationality": "Georgia",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-10-31",
    "source": "fc26"
  },
  "villarreal_cf|Thomas Partey (CDM)": {
    "overall": 83,
    "nationality": "Ghana",
    "dorsal": 16,
    "age": 32,
    "fechaNacimiento": "1993-06-13",
    "source": "fc26"
  },
  "villarreal_cf|Sergi Cardona (LB)": {
    "overall": 79,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "1999-07-08",
    "source": "fc26"
  },
  "villarreal_cf|Juan Foyth (CB)": {
    "overall": 79,
    "nationality": "Argentina",
    "dorsal": 8,
    "age": 27,
    "fechaNacimiento": "1998-01-12",
    "source": "fc26"
  },
  "villarreal_cf|Luiz Júnior (GK)": {
    "overall": 77,
    "nationality": "Brazil",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2001-01-14",
    "source": "fc26"
  },
  "burgos_cf|Atienza (CDM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 26,
    "fechaNacimiento": "1999-05-27",
    "source": "fc26"
  },
  "burgos_cf|Iñigo Córdoba (LM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 28,
    "fechaNacimiento": "1997-03-13",
    "source": "fc26"
  },
  "burgos_cf|Jesús Ruiz (GK)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 28,
    "fechaNacimiento": "1997-06-20",
    "source": "fc26"
  },
  "burgos_cf|Cantero (GK)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 30,
    "fechaNacimiento": "1995-01-09",
    "source": "fc26"
  },
  "burgos_cf|Florian Miguel (LB)": {
    "overall": 70,
    "nationality": "France",
    "dorsal": 12,
    "age": 28,
    "fechaNacimiento": "1996-09-01",
    "source": "fc26"
  },
  "burgos_cf|Curro Sánchez (CAM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 29,
    "fechaNacimiento": "1996-01-03",
    "source": "fc26"
  },
  "burgos_cf|Fer Niño (ST)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-10-24",
    "source": "fc26"
  },
  "burgos_cf|Sergio González (CB)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1997-05-14",
    "source": "fc26"
  },
  "burgos_cf|Mario González (ST)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1996-02-25",
    "source": "fc26"
  },
  "burgos_cf|Kévin Appin (CM)": {
    "overall": 68,
    "nationality": "France",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-01-20",
    "source": "fc26"
  },
  "burgos_cf|Oier Luengo (CB)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 15,
    "age": 27,
    "fechaNacimiento": "1997-11-11",
    "source": "fc26"
  },
  "cd_castellon|Cala (CAM)": {
    "overall": 73,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "cd_castellon|Jérémy Mellot (RB)": {
    "overall": 69,
    "nationality": "France",
    "dorsal": 22,
    "age": 31,
    "fechaNacimiento": "1994-03-28",
    "source": "fc26"
  },
  "cd_castellon|Brian Cipenga (LM)": {
    "overall": 66,
    "nationality": "Congo DR",
    "dorsal": 16,
    "age": 27,
    "fechaNacimiento": "1998-03-11",
    "source": "fc26"
  },
  "cd_castellon|Raúl Sánchez (LM)": {
    "overall": 70,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "cd_castellon|Romain Matthys (GK)": {
    "overall": 63,
    "nationality": "Belgium",
    "dorsal": 13,
    "age": 26,
    "fechaNacimiento": "1998-07-10",
    "source": "fc26"
  },
  "cd_castellon|Alberto Jiménez (CB)": {
    "overall": 67,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 32,
    "fechaNacimiento": "1992-11-15",
    "source": "fc26"
  },
  "cd_castellon|Fabrizio Brignani (CB)": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 3,
    "age": 27,
    "fechaNacimiento": "1998-01-13",
    "source": "fc26"
  },
  "cd_castellon|Ousmane Camara (ST)": {
    "overall": 65,
    "nationality": "Guinea",
    "dorsal": 9,
    "age": 23,
    "fechaNacimiento": "2001-11-03",
    "source": "fc26"
  },
  "cd_castellon|Isra Suero (ST)": {
    "overall": 69,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "cd_castellon|Amir Abedzadeh (GK)": {
    "overall": 68,
    "nationality": "Iran",
    "dorsal": 1,
    "age": 32,
    "fechaNacimiento": "1993-04-26",
    "source": "fc26"
  },
  "cd_castellon|Awer Mabil (RM)": {
    "overall": 67,
    "nationality": "Australia",
    "dorsal": 7,
    "age": 29,
    "fechaNacimiento": "1995-09-15",
    "source": "fc26"
  },
  "cd_leganes|Juan Soriano (GK)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 27,
    "fechaNacimiento": "1997-08-23",
    "source": "fc26"
  },
  "cd_leganes|Dani Rodríguez (LM)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 37,
    "fechaNacimiento": "1988-06-06",
    "source": "fc26"
  },
  "cd_leganes|Amadou Diawara (CDM)": {
    "overall": 68,
    "nationality": "Guinea",
    "dorsal": 24,
    "age": 27,
    "fechaNacimiento": "1997-07-17",
    "source": "fc26"
  },
  "cd_leganes|Lalo Aguilar (CB)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2002-06-11",
    "source": "fc26"
  },
  "cd_leganes|Juan Cruz (RW)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-04-25",
    "source": "fc26"
  },
  "cd_leganes|Rubén Peña (RB)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 33,
    "fechaNacimiento": "1991-07-18",
    "source": "fc26"
  },
  "cd_leganes|Franquesa (LB)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 15,
    "age": 28,
    "fechaNacimiento": "1997-02-26",
    "source": "fc26"
  },
  "cd_leganes|Seydouba Cisse (CM)": {
    "overall": 73,
    "nationality": "Guinea",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2001-02-10",
    "source": "fc26"
  },
  "cd_leganes|Duk (LW)": {
    "overall": 68,
    "nationality": "Cabo Verde",
    "dorsal": 11,
    "age": 25,
    "fechaNacimiento": "2000-02-16",
    "source": "fc26"
  },
  "cd_leganes|Jorge Sáenz (CB)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1996-11-17",
    "source": "fc26"
  },
  "cd_leganes|Melero (CM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 31,
    "fechaNacimiento": "1994-01-02",
    "source": "fc26"
  },
  "cd_mirandes|Carlos Fernández (ST)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 29,
    "fechaNacimiento": "1996-05-22",
    "source": "fc26"
  },
  "cd_mirandes|Igor Nikic (GK)": {
    "overall": 68,
    "nationality": "Montenegro",
    "dorsal": 1,
    "age": 24,
    "fechaNacimiento": "2000-08-25",
    "source": "fc26"
  },
  "cd_mirandes|Juan Gutiérrez (CB)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 25,
    "fechaNacimiento": "2000-01-28",
    "source": "fc26"
  },
  "cd_mirandes|Javi Hernández (RM)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 29,
    "age": 21,
    "fechaNacimiento": "2004-01-30",
    "source": "fc26"
  },
  "cd_mirandes|Nikola Maraš (CB)": {
    "overall": 69,
    "nationality": "Serbia",
    "dorsal": 12,
    "age": 29,
    "fechaNacimiento": "1995-12-19",
    "source": "fc26"
  },
  "cd_mirandes|Postigo (CB)": {
    "overall": 66,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 36,
    "fechaNacimiento": "1988-11-04",
    "source": "fc26"
  },
  "cd_mirandes|Pica (CB)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 23,
    "fechaNacimiento": "2002-04-25",
    "source": "fc26"
  },
  "cd_mirandes|Martín Pascual (CB)": {
    "overall": 67,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 25,
    "fechaNacimiento": "1999-08-04",
    "source": "fc26"
  },
  "cd_mirandes|Mickaël Malsa (CDM)": {
    "overall": 67,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "cd_mirandes|Hugo Novoa (RM)": {
    "overall": 67,
    "nationality": "Spain",
    "dorsal": 2,
    "age": 22,
    "fechaNacimiento": "2003-01-24",
    "source": "fc26"
  },
  "cd_mirandes|Thiago Helguera (CM)": {
    "overall": 65,
    "nationality": "Uruguay",
    "dorsal": 6,
    "age": 19,
    "fechaNacimiento": "2006-03-26",
    "source": "fc26"
  },
  "cultural_leonesa|Edgar Badia (GK)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 33,
    "fechaNacimiento": "1992-02-12",
    "source": "fc26"
  },
  "cultural_leonesa|Nemanja Radoja (CDM)": {
    "overall": 73,
    "nationality": "Serbia",
    "dorsal": 6,
    "age": 32,
    "fechaNacimiento": "1993-02-06",
    "source": "fc26"
  },
  "cultural_leonesa|Chacón (CAM)": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "cultural_leonesa|Lucas Ribeiro (RM)": {
    "overall": 68,
    "nationality": "Brazil",
    "dorsal": 27,
    "age": 26,
    "fechaNacimiento": "1998-10-09",
    "source": "fc26"
  },
  "cultural_leonesa|Rubén Sobrino (RM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 19,
    "age": 33,
    "fechaNacimiento": "1992-06-01",
    "source": "fc26"
  },
  "cultural_leonesa|Iván Calero (RB)": {
    "overall": 66,
    "nationality": "Spain",
    "dorsal": 17,
    "age": 30,
    "fechaNacimiento": "1995-04-21",
    "source": "fc26"
  },
  "cultural_leonesa|Matia Barzić (CB)": {
    "overall": 64,
    "nationality": "Croatia",
    "dorsal": 36,
    "age": 21,
    "fechaNacimiento": "2004-05-31",
    "source": "fc26"
  },
  "cultural_leonesa|Rodri Suárez (CB)": {
    "overall": 63,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 22,
    "fechaNacimiento": "2002-11-14",
    "source": "fc26"
  },
  "cultural_leonesa|Roger Hinojo (LB)": {
    "overall": 63,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 20,
    "fechaNacimiento": "2005-02-21",
    "source": "fc26"
  },
  "cultural_leonesa|Thiago Ojeda (CDM)": {
    "overall": 64,
    "nationality": "Argentina",
    "dorsal": 28,
    "age": 22,
    "fechaNacimiento": "2003-01-12",
    "source": "fc26"
  },
  "cultural_leonesa|Tresaco (LM)": {
    "overall": 67,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "cadiz_cf|Suso (RM)": {
    "overall": 77,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 31,
    "fechaNacimiento": "1993-11-19",
    "source": "fc26"
  },
  "cadiz_cf|Ontiveros (LM)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 27,
    "fechaNacimiento": "1997-09-09",
    "source": "fc26"
  },
  "cadiz_cf|Rominigue Kouamé (CM)": {
    "overall": 73,
    "nationality": "Mali",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1996-12-17",
    "source": "fc26"
  },
  "cadiz_cf|Iza Carcelén (RB)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 32,
    "fechaNacimiento": "1993-04-23",
    "source": "fc26"
  },
  "cadiz_cf|Álex Fernández (CM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 32,
    "fechaNacimiento": "1992-10-15",
    "source": "fc26"
  },
  "cadiz_cf|Brian Ocampo (LM)": {
    "overall": 70,
    "nationality": "Uruguay",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1999-06-25",
    "source": "fc26"
  },
  "cadiz_cf|David Gil (GK)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 31,
    "fechaNacimiento": "1994-01-11",
    "source": "fc26"
  },
  "cadiz_cf|Iuri Tabatadze (RM)": {
    "overall": 66,
    "nationality": "Georgia",
    "dorsal": 31,
    "age": 25,
    "fechaNacimiento": "1999-11-29",
    "source": "fc26"
  },
  "cadiz_cf|Sergio Ortuño (CM)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 15,
    "age": 26,
    "fechaNacimiento": "1999-03-02",
    "source": "fc26"
  },
  "cadiz_cf|Antoñito Cordero (LM)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 18,
    "fechaNacimiento": "2006-11-14",
    "source": "fc26"
  },
  "cadiz_cf|Víctor Aznar (GK)": {
    "overall": 64,
    "nationality": "Brazil",
    "dorsal": 13,
    "age": 22,
    "fechaNacimiento": "2002-10-17",
    "source": "fc26"
  },
  "cordoba_cf|Carracedo (RW)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 29,
    "fechaNacimiento": "1995-11-30",
    "source": "fc26"
  },
  "cordoba_cf|Adri Fuentes (ST)": {
    "overall": 66,
    "nationality": "Spain",
    "dorsal": 18,
    "age": 28,
    "fechaNacimiento": "1996-07-17",
    "source": "fc26"
  },
  "cordoba_cf|Isma Ruiz (CDM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2001-02-14",
    "source": "fc26"
  },
  "cordoba_cf|Jacobo González (LW)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 28,
    "fechaNacimiento": "1997-03-25",
    "source": "fc26"
  },
  "cordoba_cf|Albarrán (RB)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 31,
    "fechaNacimiento": "1994-01-15",
    "source": "fc26"
  },
  "cordoba_cf|Xavi Sintes (CB)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 15,
    "age": 23,
    "fechaNacimiento": "2001-08-05",
    "source": "fc26"
  },
  "cordoba_cf|Iker Álvarez (GK)": {
    "overall": 67,
    "nationality": "Andorra",
    "dorsal": 1,
    "age": 23,
    "fechaNacimiento": "2001-07-25",
    "source": "fc26"
  },
  "cordoba_cf|Mikel Goti (CAM)": {
    "overall": 67,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 23,
    "fechaNacimiento": "2002-05-23",
    "source": "fc26"
  },
  "cordoba_cf|Carlos Marín (GK)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 28,
    "fechaNacimiento": "1997-02-20",
    "source": "fc26"
  },
  "cordoba_cf|Franck Fomeyem (CB)": {
    "overall": 66,
    "nationality": "Cameroon",
    "dorsal": 12,
    "age": 25,
    "fechaNacimiento": "1999-10-17",
    "source": "fc26"
  },
  "cordoba_cf|Vilarrasa (LB)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 2,
    "age": 25,
    "fechaNacimiento": "1999-08-23",
    "source": "fc26"
  },
  "fc_andorra|Edgar (CB)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1997-04-01",
    "source": "fc26"
  },
  "fc_andorra|Áron Yaakobishvili (GK)": {
    "overall": 65,
    "nationality": "Hungary",
    "dorsal": 26,
    "age": 19,
    "fechaNacimiento": "2006-03-06",
    "source": "fc26"
  },
  "fc_andorra|Imanol (LB)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "2000-06-08",
    "source": "fc26"
  },
  "fc_andorra|Kim Min Su (LW)": {
    "overall": 51,
    "nationality": "Korea Republic",
    "dorsal": 31,
    "age": 20,
    "fechaNacimiento": "2005-06-08",
    "source": "fc26"
  },
  "fc_andorra|Nicolás Ratti (GK)": {
    "overall": 68,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "fc_andorra|Lautaro (ST)": {
    "overall": 65,
    "nationality": "Uruguay",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2001-02-09",
    "source": "fc26"
  },
  "fc_andorra|Manu Nieto (ST)": {
    "overall": 67,
    "nationality": "Spain",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1998-03-29",
    "source": "fc26"
  },
  "fc_andorra|Olabarrieta (RW)": {
    "overall": 65,
    "nationality": "Spain",
    "dorsal": 15,
    "age": 19,
    "fechaNacimiento": "2005-11-14",
    "source": "fc26"
  },
  "fc_andorra|Jastin (LM)": {
    "overall": 63,
    "nationality": "Portugal",
    "dorsal": 16,
    "age": 21,
    "fechaNacimiento": "2004-01-15",
    "source": "fc26"
  },
  "fc_andorra|Marc Cardona (ST)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 29,
    "fechaNacimiento": "1995-07-08",
    "source": "fc26"
  },
  "fc_andorra|Thomas Carrique (RB)": {
    "overall": 65,
    "nationality": "France",
    "dorsal": 17,
    "age": 26,
    "fechaNacimiento": "1999-02-26",
    "source": "fc26"
  },
  "granada_cf|Rubén Alcaraz (CM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 34,
    "fechaNacimiento": "1991-05-01",
    "source": "fc26"
  },
  "granada_cf|Álex Sola (RW)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1999-06-09",
    "source": "fc26"
  },
  "granada_cf|José Arnáiz (CAM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 30,
    "fechaNacimiento": "1995-04-15",
    "source": "fc26"
  },
  "granada_cf|Manu Lama (CB)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 24,
    "fechaNacimiento": "2001-02-12",
    "source": "fc26"
  },
  "granada_cf|Loïc Williams (CB)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2002-01-07",
    "source": "fc26"
  },
  "granada_cf|Baïla Diallo (LB)": {
    "overall": 64,
    "nationality": "Senegal",
    "dorsal": 22,
    "age": 24,
    "fechaNacimiento": "2001-06-24",
    "source": "fc26"
  },
  "granada_cf|Alemañ (CM)": {
    "overall": 69,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "granada_cf|Sergio Ruiz (CDM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 30,
    "fechaNacimiento": "1994-12-16",
    "source": "fc26"
  },
  "granada_cf|Jorge Pascual (ST)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 19,
    "age": 22,
    "fechaNacimiento": "2003-04-09",
    "source": "fc26"
  },
  "granada_cf|Gonzalo Petit (ST)": {
    "overall": 69,
    "nationality": "Uruguay",
    "dorsal": 9,
    "age": 18,
    "fechaNacimiento": "2006-09-21",
    "source": "fc26"
  },
  "granada_cf|Izan González (CM)": {
    "overall": 69,
    "dorsal": 41,
    "source": "latamfc26"
  },
  "malaga_cf|Alfonso Herrero (GK)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 31,
    "fechaNacimiento": "1994-04-21",
    "source": "fc26"
  },
  "malaga_cf|Larrubia (RW)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2002-04-20",
    "source": "fc26"
  },
  "malaga_cf|Chupe (ST)": {
    "overall": 72,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "malaga_cf|Joaquín (LW)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 26,
    "fechaNacimiento": "1999-03-10",
    "source": "fc26"
  },
  "malaga_cf|Adrián Niño (ST)": {
    "overall": 65,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 21,
    "fechaNacimiento": "2004-06-19",
    "source": "fc26"
  },
  "malaga_cf|Izan Merino (CM)": {
    "overall": 66,
    "nationality": "Spain",
    "dorsal": 29,
    "age": 19,
    "fechaNacimiento": "2006-04-15",
    "source": "fc26"
  },
  "malaga_cf|Luismi (CDM)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 19,
    "age": 33,
    "fechaNacimiento": "1992-05-05",
    "source": "fc26"
  },
  "malaga_cf|Puga (RB)": {
    "overall": 68,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "malaga_cf|Dani Lorenzo (CM)": {
    "overall": 64,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 22,
    "fechaNacimiento": "2003-04-05",
    "source": "fc26"
  },
  "malaga_cf|Murillo (CB)": {
    "overall": 83,
    "nationality": "Brazil",
    "dorsal": 5,
    "age": 22,
    "fechaNacimiento": "2002-07-04",
    "source": "fc26"
  },
  "malaga_cf|Einar Galilea (CB)": {
    "overall": 66,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 31,
    "fechaNacimiento": "1994-05-22",
    "source": "fc26"
  },
  "rc_deportivo|Yeremay (LM)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2002-12-10",
    "source": "fc26"
  },
  "rc_deportivo|Mario Soriano (CAM)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 23,
    "fechaNacimiento": "2002-04-22",
    "source": "fc26"
  },
  "rc_deportivo|Álvaro Ferllo (GK)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 25,
    "age": 27,
    "fechaNacimiento": "1998-04-13",
    "source": "fc26"
  },
  "rc_deportivo|Alti (RB)": {
    "overall": 72,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "rc_deportivo|Loureiro (CB)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 15,
    "age": 28,
    "fechaNacimiento": "1996-11-21",
    "source": "fc26"
  },
  "rc_deportivo|Villares (CM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1996-06-17",
    "source": "fc26"
  },
  "rc_deportivo|José Gragera (CDM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 25,
    "fechaNacimiento": "2000-05-14",
    "source": "fc26"
  },
  "rc_deportivo|Luismi Cruz (RM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 19,
    "age": 24,
    "fechaNacimiento": "2001-05-23",
    "source": "fc26"
  },
  "rc_deportivo|Ximo Navarro (RB)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 35,
    "fechaNacimiento": "1990-01-23",
    "source": "fc26"
  },
  "rc_deportivo|Mella (RM)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 20,
    "fechaNacimiento": "2005-05-23",
    "source": "fc26"
  },
  "rc_deportivo|Samuele Mulattieri (ST)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 7,
    "age": 24,
    "fechaNacimiento": "2000-10-07",
    "source": "fc26"
  },
  "real_sociedad_b|Luken Beitia (CB)": {
    "overall": 64,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 21,
    "fechaNacimiento": "2004-06-30",
    "source": "fc26"
  },
  "real_sociedad_b|Fraga (GK)": {
    "overall": 64,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 22,
    "fechaNacimiento": "2003-03-12",
    "source": "fc26"
  },
  "real_sociedad_b|Mikel Rodríguez (CM)": {
    "overall": 65,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 23,
    "fechaNacimiento": "2002-04-03",
    "source": "fc26"
  },
  "real_sociedad_b|Mariezkurrena (ST)": {
    "overall": 65,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 20,
    "fechaNacimiento": "2005-04-05",
    "source": "fc26"
  },
  "real_sociedad_b|Dadie (RB)": {
    "overall": 62,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 22,
    "fechaNacimiento": "2002-07-20",
    "source": "fc26"
  },
  "real_sociedad_b|Job Nguono Ochieng (LM)": {
    "overall": 63,
    "nationality": "Kenya",
    "dorsal": 11,
    "age": 22,
    "fechaNacimiento": "2003-01-17",
    "source": "fc26"
  },
  "real_sociedad_b|Gorka Carrera (ST)": {
    "overall": 60,
    "nationality": "Spain",
    "dorsal": 18,
    "age": 20,
    "fechaNacimiento": "2005-05-18",
    "source": "fc26"
  },
  "real_sociedad_b|Kazunari Kita (CB)": {
    "overall": 62,
    "nationality": "Japan",
    "dorsal": 15,
    "age": 19,
    "fechaNacimiento": "2005-09-16",
    "source": "fc26"
  },
  "real_sociedad_b|Jon Balda (LB)": {
    "overall": 63,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 23,
    "fechaNacimiento": "2002-04-20",
    "source": "fc26"
  },
  "real_sociedad_b|Dani Díaz (RM)": {
    "overall": 63,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 19,
    "fechaNacimiento": "2006-06-22",
    "source": "fc26"
  },
  "real_sociedad_b|Rupérez (RB)": {
    "overall": 64,
    "nationality": "Spain",
    "dorsal": 2,
    "age": 22,
    "fechaNacimiento": "2003-01-07",
    "source": "fc26"
  },
  "real_zaragoza|Jawad El Yamiq (CB)": {
    "overall": 73,
    "nationality": "Morocco",
    "dorsal": 5,
    "age": 33,
    "fechaNacimiento": "1992-02-29",
    "source": "fc26"
  },
  "real_zaragoza|Paul Akouokou (CDM)": {
    "overall": 71,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "real_zaragoza|Insua (CB)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 31,
    "fechaNacimiento": "1993-09-09",
    "source": "fc26"
  },
  "real_zaragoza|Esteban Andrada (GK)": {
    "overall": 72,
    "nationality": "Argentina",
    "dorsal": 1,
    "age": 34,
    "fechaNacimiento": "1991-01-26",
    "source": "fc26"
  },
  "real_zaragoza|Francho Serrano (CM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 23,
    "fechaNacimiento": "2001-10-17",
    "source": "fc26"
  },
  "real_zaragoza|Dani Tasende (LB)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 24,
    "fechaNacimiento": "2000-07-06",
    "source": "fc26"
  },
  "real_zaragoza|Keidi Bare (CDM)": {
    "overall": 73,
    "nationality": "Albania",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1997-08-28",
    "source": "fc26"
  },
  "real_zaragoza|Tachi (CB)": {
    "overall": 69,
    "nationality": "Spain",
    "dorsal": 5,
    "age": 27,
    "fechaNacimiento": "1997-09-10",
    "source": "fc26"
  },
  "real_zaragoza|Sebas Moyano (LM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 17,
    "age": 28,
    "fechaNacimiento": "1997-03-23",
    "source": "fc26"
  },
  "real_zaragoza|Rober (RM)": {
    "overall": 67,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 24,
    "fechaNacimiento": "2001-01-06",
    "source": "fc26"
  },
  "real_zaragoza|Valery (LM)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "1999-11-23",
    "source": "fc26"
  },
  "sd_eibar|Juan Bernat (LB)": {
    "overall": 72,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "sd_eibar|Nolaskoain (CDM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1998-10-25",
    "source": "fc26"
  },
  "sd_eibar|Magunagoitia (GK)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 24,
    "fechaNacimiento": "2000-08-06",
    "source": "fc26"
  },
  "sd_eibar|Marco Moreno (CB)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 21,
    "age": 24,
    "fechaNacimiento": "2001-02-20",
    "source": "fc26"
  },
  "sd_eibar|Corpas (RM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 17,
    "age": 33,
    "fechaNacimiento": "1991-07-07",
    "source": "fc26"
  },
  "sd_eibar|Sergio Álvarez (CDM)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 6,
    "age": 33,
    "fechaNacimiento": "1992-01-23",
    "source": "fc26"
  },
  "sd_eibar|Cubero (RB)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 2,
    "age": 25,
    "fechaNacimiento": "1999-09-05",
    "source": "fc26"
  },
  "sd_eibar|Arbilla (CB)": {
    "overall": 70,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 38,
    "fechaNacimiento": "1987-05-15",
    "source": "fc26"
  },
  "sd_eibar|Jon Bautista (ST)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 9,
    "age": 29,
    "fechaNacimiento": "1995-07-03",
    "source": "fc26"
  },
  "sd_eibar|Javi Martón (ST)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 26,
    "fechaNacimiento": "1999-05-06",
    "source": "fc26"
  },
  "sd_eibar|Aleix Garrido (CM)": {
    "overall": 66,
    "nationality": "Spain",
    "dorsal": 30,
    "age": 21,
    "fechaNacimiento": "2004-02-22",
    "source": "fc26"
  },
  "sd_huesca|Dani Jiménez (GK)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 13,
    "age": 35,
    "fechaNacimiento": "1990-03-05",
    "source": "fc26"
  },
  "sd_huesca|Pulido (CB)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 34,
    "fechaNacimiento": "1991-04-08",
    "source": "fc26"
  },
  "sd_huesca|Óscar Sielva (CM)": {
    "overall": 72,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 33,
    "fechaNacimiento": "1991-08-06",
    "source": "fc26"
  },
  "sd_huesca|Nacho Laquintana (RW)": {
    "overall": 70,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "sd_huesca|Jaime Seoane (CM)": {
    "overall": 70,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "sd_huesca|Joaquín (CB)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 24,
    "age": 29,
    "fechaNacimiento": "1996-05-31",
    "source": "fc26"
  },
  "sd_huesca|Jesús Alvarez (CDM)": {
    "overall": 64,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 25,
    "fechaNacimiento": "1999-11-17",
    "source": "fc26"
  },
  "sd_huesca|Enol Rodríguez (ST)": {
    "overall": 65,
    "nationality": "Spain",
    "dorsal": 18,
    "age": 23,
    "fechaNacimiento": "2001-07-28",
    "source": "fc26"
  },
  "sd_huesca|Portillo (CAM)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 35,
    "fechaNacimiento": "1990-06-13",
    "source": "fc26"
  },
  "sd_huesca|Jordi Martín (LM)": {
    "overall": 66,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 24,
    "fechaNacimiento": "2001-01-05",
    "source": "fc26"
  },
  "sd_huesca|Jordi Escobar (ST)": {
    "overall": 66,
    "nationality": "Spain",
    "dorsal": 9,
    "age": 23,
    "fechaNacimiento": "2002-02-10",
    "source": "fc26"
  },
  "ud_almeria|Arribas (CAM)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 11,
    "age": 23,
    "fechaNacimiento": "2001-09-30",
    "source": "fc26"
  },
  "ud_almeria|Embarba (LW)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 23,
    "age": 33,
    "fechaNacimiento": "1992-05-07",
    "source": "fc26"
  },
  "ud_almeria|Rodrigo Ely (CB)": {
    "overall": 74,
    "dorsal": 5,
    "source": "latamfc26"
  },
  "ud_almeria|Andrés Fernández (GK)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 1,
    "age": 38,
    "fechaNacimiento": "1986-12-16",
    "source": "fc26"
  },
  "ud_almeria|Álex Muñoz (LB)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 30,
    "fechaNacimiento": "1994-07-30",
    "source": "fc26"
  },
  "ud_almeria|Dion Lopy (CDM)": {
    "overall": 73,
    "nationality": "Senegal",
    "dorsal": 17,
    "age": 23,
    "fechaNacimiento": "2002-02-02",
    "source": "fc26"
  },
  "ud_almeria|Morci (LW)": {
    "overall": 71,
    "nationality": "Spain",
    "dorsal": 22,
    "age": 26,
    "fechaNacimiento": "1998-09-15",
    "source": "fc26"
  },
  "ud_almeria|Daijiro Chirino (RB)": {
    "overall": 69,
    "nationality": "Curacao",
    "dorsal": 22,
    "age": 23,
    "fechaNacimiento": "2002-01-24",
    "source": "fc26"
  },
  "ud_almeria|Federico Bonini (CB)": {
    "overall": 67,
    "nationality": "Italy",
    "dorsal": 18,
    "age": 23,
    "fechaNacimiento": "2001-08-06",
    "source": "fc26"
  },
  "ud_almeria|Puigmal (RM)": {
    "overall": 72,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "ud_almeria|Nélson Monte (CB)": {
    "overall": 70,
    "nationality": "Portugal",
    "dorsal": 4,
    "age": 29,
    "fechaNacimiento": "1995-07-30",
    "source": "fc26"
  },
  "ud_las_palmas|Sandro (RM)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 19,
    "age": 29,
    "fechaNacimiento": "1995-07-09",
    "source": "fc26"
  },
  "ud_las_palmas|Kirian (CM)": {
    "overall": 76,
    "nationality": "Spain",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1996-03-05",
    "source": "fc26"
  },
  "ud_las_palmas|Dinko Horkaš (GK)": {
    "overall": 73,
    "nationality": "Croatia",
    "dorsal": 1,
    "age": 26,
    "fechaNacimiento": "1999-03-10",
    "source": "fc26"
  },
  "ud_las_palmas|Mika Mármol (CB)": {
    "overall": 75,
    "nationality": "Spain",
    "dorsal": 3,
    "age": 24,
    "fechaNacimiento": "2001-07-01",
    "source": "fc26"
  },
  "ud_las_palmas|Manu Fuster (LM)": {
    "overall": 74,
    "nationality": "Spain",
    "dorsal": 14,
    "age": 27,
    "fechaNacimiento": "1997-10-22",
    "source": "fc26"
  },
  "ud_las_palmas|Enzo Loiodice (CM)": {
    "overall": 72,
    "nationality": "France",
    "dorsal": 12,
    "age": 24,
    "fechaNacimiento": "2000-11-27",
    "source": "fc26"
  },
  "ud_las_palmas|Sergio Barcia (CB)": {
    "overall": 68,
    "nationality": "Spain",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2000-12-31",
    "source": "fc26"
  },
  "ud_las_palmas|Taisei Miyashiro (LW)": {
    "overall": 72,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "ud_las_palmas|Álex Suárez (CB)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 32,
    "fechaNacimiento": "1993-03-10",
    "source": "fc26"
  },
  "ud_las_palmas|Viti Rozada (RB)": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 17,
    "age": 27,
    "fechaNacimiento": "1997-09-16",
    "source": "fc26"
  },
  "ud_las_palmas|Nicolás Benedetti (CAM)": {
    "overall": 72,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "club_brugge|Christos Tzolis": {
    "overall": 80,
    "nationality": "Greece",
    "dorsal": 8,
    "age": 23,
    "fechaNacimiento": "2002-01-30",
    "source": "fc26"
  },
  "club_brugge|Joel Ordóñez": {
    "overall": 75,
    "nationality": "Ecuador",
    "dorsal": 4,
    "age": 21,
    "fechaNacimiento": "2004-04-21",
    "source": "fc26"
  },
  "club_brugge|Nicolò Tresoldi": {
    "overall": 69,
    "nationality": "Germany",
    "dorsal": 7,
    "age": 20,
    "fechaNacimiento": "2004-08-20",
    "source": "fc26"
  },
  "club_brugge|Raphael Onyedika": {
    "overall": 77,
    "nationality": "Nigeria",
    "dorsal": 15,
    "age": 24,
    "fechaNacimiento": "2001-04-19",
    "source": "fc26"
  },
  "club_brugge|Joaquin Seys": {
    "overall": 73,
    "nationality": "Belgium",
    "dorsal": 65,
    "age": 20,
    "fechaNacimiento": "2005-03-28",
    "source": "fc26"
  },
  "union_sg|Anan Khalaili": {
    "overall": 73,
    "nationality": "Israel",
    "dorsal": 25,
    "age": 20,
    "fechaNacimiento": "2004-09-03",
    "source": "fc26"
  },
  "union_sg|Promise David": {
    "overall": 75,
    "nationality": "Canada",
    "dorsal": 12,
    "age": 23,
    "fechaNacimiento": "2001-07-03",
    "source": "fc26"
  },
  "union_sg|Kevin Mac Allister": {
    "overall": 76,
    "nationality": "Argentina",
    "dorsal": 5,
    "age": 27,
    "fechaNacimiento": "1997-11-07",
    "source": "fc26"
  },
  "union_sg|Adem Zorgane": {
    "overall": 78,
    "nationality": "Algeria",
    "dorsal": 8,
    "age": 25,
    "fechaNacimiento": "2000-01-06",
    "source": "fc26"
  },
  "union_sg|Kamiel Van De Perre": {
    "overall": 66,
    "nationality": "Belgium",
    "dorsal": 6,
    "age": 21,
    "fechaNacimiento": "2004-02-12",
    "source": "fc26"
  },
  "krc_genk|Konstantinos Karetsas": {
    "overall": 70,
    "nationality": "Greece",
    "dorsal": 20,
    "age": 17,
    "fechaNacimiento": "2007-11-19",
    "source": "fc26"
  },
  "krc_genk|Zakaria El Ouahdi": {
    "overall": 76,
    "nationality": "Morocco",
    "dorsal": 77,
    "age": 23,
    "fechaNacimiento": "2001-12-31",
    "source": "fc26"
  },
  "krc_genk|Matte Smets": {
    "overall": 76,
    "nationality": "Belgium",
    "dorsal": 6,
    "age": 21,
    "fechaNacimiento": "2004-01-04",
    "source": "fc26"
  },
  "krc_genk|Bryan Heynen": {
    "overall": 78,
    "nationality": "Belgium",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-02-06",
    "source": "fc26"
  },
  "krc_genk|Ibrahima Sory Bangoura": {
    "overall": 70,
    "nationality": "Guinea",
    "dorsal": 21,
    "age": 21,
    "fechaNacimiento": "2004-01-05",
    "source": "fc26"
  },
  "olympiacos|Christos Mouzakitis": {
    "overall": 71,
    "nationality": "Greece",
    "dorsal": 96,
    "age": 18,
    "fechaNacimiento": "2006-12-25",
    "source": "fc26"
  },
  "olympiacos|Konstantinos Tzolakis": {
    "overall": 79,
    "nationality": "Greece",
    "dorsal": 88,
    "age": 22,
    "fechaNacimiento": "2002-11-08",
    "source": "fc26"
  },
  "olympiacos|Santiago Hezze": {
    "overall": 78,
    "nationality": "Argentina",
    "dorsal": 32,
    "age": 23,
    "fechaNacimiento": "2001-10-22",
    "source": "fc26"
  },
  "olympiacos|Lorenzo Pirola": {
    "overall": 75,
    "nationality": "Italy",
    "dorsal": 5,
    "age": 23,
    "fechaNacimiento": "2002-02-20",
    "source": "fc26"
  },
  "olympiacos|Jota Silva": {
    "overall": 75,
    "nationality": "Portugal",
    "dorsal": 26,
    "age": 25,
    "fechaNacimiento": "1999-08-01",
    "source": "fc26"
  },
  "paok|Giannis Konstantelias": {
    "overall": 77,
    "nationality": "Greece",
    "dorsal": 65,
    "age": 22,
    "fechaNacimiento": "2003-03-05",
    "source": "fc26"
  },
  "paok|Christos Zafeiris": {
    "overall": 75,
    "nationality": "Greece",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2003-02-23",
    "source": "fc26"
  },
  "paok|Andrija Zivkovic": {
    "overall": 78,
    "nationality": "Serbia",
    "dorsal": 14,
    "age": 28,
    "fechaNacimiento": "1996-07-11",
    "source": "fc26"
  },
  "paok|Mady Camara": {
    "overall": 73,
    "dorsal": 2,
    "source": "latamfc26"
  },
  "paok|Kiril Despodov": {
    "overall": 77,
    "nationality": "Bulgaria",
    "dorsal": 77,
    "age": 28,
    "fechaNacimiento": "1996-11-11",
    "source": "fc26"
  },
  "panathinaikos|Victor Kristiansen": {
    "overall": 75,
    "nationality": "Denmark",
    "dorsal": 16,
    "age": 22,
    "fechaNacimiento": "2002-12-16",
    "source": "fc26"
  },
  "panathinaikos|Anass Zaroury": {
    "overall": 74,
    "nationality": "Morocco",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-11-07",
    "source": "fc26"
  },
  "panathinaikos|Rick van Drongelen": {
    "overall": 75,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1998-12-20",
    "source": "fc26"
  },
  "panathinaikos|Santino Andino": {
    "overall": 68,
    "nationality": "Argentina",
    "dorsal": 27,
    "age": 19,
    "fechaNacimiento": "2005-10-25",
    "source": "fc26"
  },
  "panathinaikos|Pedro Chirivella": {
    "overall": 73,
    "nationality": "Spain",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1997-05-23",
    "source": "fc26"
  },
  "slavia_praha|David Moses": {
    "overall": 68,
    "nationality": "Nigeria",
    "dorsal": 16,
    "age": 21,
    "fechaNacimiento": "2004-01-20",
    "source": "fc26"
  },
  "slavia_praha|Stepan Chaloupek": {
    "overall": 70,
    "nationality": "Czechia",
    "dorsal": 2,
    "age": 22,
    "fechaNacimiento": "2003-03-01",
    "source": "fc26"
  },
  "slavia_praha|David Zima": {
    "overall": 74,
    "nationality": "Czechia",
    "dorsal": 4,
    "age": 24,
    "fechaNacimiento": "2000-11-08",
    "source": "fc26"
  },
  "slavia_praha|Igoh Ogbu": {
    "overall": 75,
    "nationality": "Nigeria",
    "dorsal": 5,
    "age": 25,
    "fechaNacimiento": "2000-02-08",
    "source": "fc26"
  },
  "slavia_praha|Michal Sadílek": {
    "overall": 76,
    "nationality": "Czechia",
    "dorsal": 23,
    "age": 26,
    "fechaNacimiento": "1999-05-31",
    "source": "fc26"
  },
  "viktoria_plzen|Lukáš Červ": {
    "overall": 74,
    "nationality": "Czechia",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2001-04-10",
    "source": "fc26"
  },
  "viktoria_plzen|Sampson Dweh": {
    "overall": 75,
    "nationality": "Liberia",
    "dorsal": 40,
    "age": 23,
    "fechaNacimiento": "2001-10-10",
    "source": "fc26"
  },
  "viktoria_plzen|Amar Memić": {
    "overall": 72,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 99,
    "age": 24,
    "fechaNacimiento": "2001-01-20",
    "source": "fc26"
  },
  "viktoria_plzen|Cheick Souaré": {
    "overall": 71,
    "nationality": "France",
    "dorsal": 19,
    "age": 22,
    "fechaNacimiento": "2002-09-03",
    "source": "fc26"
  },
  "bodo_glimt|Jens Petter Hauge": {
    "overall": 74,
    "nationality": "Norway",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "1999-10-12",
    "source": "fc26"
  },
  "bodo_glimt|Kasper Høgh": {
    "overall": 69,
    "nationality": "Denmark",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-12-06",
    "source": "fc26"
  },
  "bodo_glimt|Fredrik Sjøvold": {
    "overall": 69,
    "nationality": "Norway",
    "dorsal": 20,
    "age": 21,
    "fechaNacimiento": "2003-08-17",
    "source": "fc26"
  },
  "bodo_glimt|Patrick Berg": {
    "overall": 77,
    "nationality": "Norway",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1997-11-24",
    "source": "fc26"
  },
  "bodo_glimt|Håkon Evjen": {
    "overall": 73,
    "nationality": "Norway",
    "dorsal": 26,
    "age": 25,
    "fechaNacimiento": "2000-02-14",
    "source": "fc26"
  },
  "brann_sk|Felix Horn Myhre (CM)": {
    "overall": 74,
    "nationality": "Norway",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1999-03-04",
    "source": "fc26"
  },
  "brann_sk|Fredrik Knudsen (CB)": {
    "overall": 70,
    "nationality": "Norway",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1996-08-30",
    "source": "fc26"
  },
  "brann_sk|Jacob Sørensen (CDM)": {
    "overall": 69,
    "nationality": "Denmark",
    "dorsal": 18,
    "age": 27,
    "fechaNacimiento": "1998-03-03",
    "source": "fc26"
  },
  "brann_sk|Mathias Dyngeland (GK)": {
    "overall": 70,
    "nationality": "Norway",
    "dorsal": 1,
    "age": 29,
    "fechaNacimiento": "1995-10-07",
    "source": "fc26"
  },
  "brann_sk|Jón Dagur Þorsteinsson (LW)": {
    "overall": 69,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "brann_sk|Vetle Dragsnes (LB)": {
    "overall": 70,
    "nationality": "Norway",
    "dorsal": 20,
    "age": 31,
    "fechaNacimiento": "1994-02-06",
    "source": "fc26"
  },
  "brann_sk|Joachim Soltvedt (LB)": {
    "overall": 67,
    "nationality": "Norway",
    "dorsal": 17,
    "age": 29,
    "fechaNacimiento": "1995-09-09",
    "source": "fc26"
  },
  "brann_sk|Bård Finne (ST)": {
    "overall": 69,
    "nationality": "Norway",
    "dorsal": 11,
    "age": 30,
    "fechaNacimiento": "1995-02-13",
    "source": "fc26"
  },
  "brann_sk|Niklas Castro (LW)": {
    "overall": 69,
    "nationality": "Chile",
    "dorsal": 9,
    "age": 29,
    "fechaNacimiento": "1996-01-08",
    "source": "fc26"
  },
  "brann_sk|Sævar Atli Magnússon (RW)": {
    "overall": 66,
    "nationality": "Iceland",
    "dorsal": 22,
    "age": 25,
    "fechaNacimiento": "2000-06-16",
    "source": "fc26"
  },
  "brann_sk|Noah Jean Holm (ST)": {
    "overall": 67,
    "dorsal": 29,
    "source": "latamfc26"
  },
  "fc_copenhagen|Mohamed Elyounoussi (RM)": {
    "overall": 76,
    "nationality": "Norway",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1994-08-04",
    "source": "fc26"
  },
  "fc_copenhagen|Dominik Kotarski (GK)": {
    "overall": 77,
    "nationality": "Croatia",
    "dorsal": 42,
    "age": 25,
    "fechaNacimiento": "2000-02-10",
    "source": "fc26"
  },
  "fc_copenhagen|Gabriel Pereira (CB)": {
    "overall": 74,
    "nationality": "Brazil",
    "dorsal": 5,
    "age": 25,
    "fechaNacimiento": "2000-05-07",
    "source": "fc26"
  },
  "fc_copenhagen|Thomas Delaney (CDM)": {
    "overall": 75,
    "nationality": "Denmark",
    "dorsal": 27,
    "age": 33,
    "fechaNacimiento": "1991-09-03",
    "source": "fc26"
  },
  "fc_copenhagen|Rodrigo Huescas (RB)": {
    "overall": 72,
    "nationality": "Mexico",
    "dorsal": 13,
    "age": 21,
    "fechaNacimiento": "2003-09-18",
    "source": "fc26"
  },
  "fc_copenhagen|Jordan Larsson (RM)": {
    "overall": 72,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "fc_copenhagen|Amir Richardson (CM)": {
    "overall": 72,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "fc_copenhagen|Pantelis Hatzidiakos (CB)": {
    "overall": 73,
    "nationality": "Greece",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1997-01-18",
    "source": "fc26"
  },
  "fc_copenhagen|Marcos López (LB)": {
    "overall": 71,
    "nationality": "Peru",
    "dorsal": 15,
    "age": 25,
    "fechaNacimiento": "1999-11-20",
    "source": "fc26"
  },
  "fc_copenhagen|Mads Emil Madsen (CM)": {
    "overall": 71,
    "dorsal": 21,
    "source": "latamfc26"
  },
  "fc_copenhagen|Youssoufa Moukoko (ST)": {
    "overall": 73,
    "nationality": "Germany",
    "dorsal": 9,
    "age": 20,
    "fechaNacimiento": "2004-11-20",
    "source": "fc26"
  },
  "midtjylland|Philip Billing (CM)": {
    "overall": 75,
    "nationality": "Denmark",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1996-06-11",
    "source": "fc26"
  },
  "midtjylland|Aral Şimşir (LW)": {
    "overall": 76,
    "dorsal": 58,
    "source": "latamfc26"
  },
  "midtjylland|Mads Bech Sørensen (CB)": {
    "overall": 73,
    "nationality": "Denmark",
    "dorsal": 22,
    "age": 26,
    "fechaNacimiento": "1999-01-07",
    "source": "fc26"
  },
  "midtjylland|Darío Osorio (RM)": {
    "overall": 72,
    "nationality": "Chile",
    "dorsal": 11,
    "age": 21,
    "fechaNacimiento": "2004-01-24",
    "source": "fc26"
  },
  "midtjylland|Franculino (ST)": {
    "overall": 72,
    "nationality": "Guinea-Bissau",
    "dorsal": 7,
    "age": 21,
    "fechaNacimiento": "2004-06-28",
    "source": "fc26"
  },
  "midtjylland|Elías Rafn Ólafsson (GK)": {
    "overall": 70,
    "nationality": "Iceland",
    "dorsal": 16,
    "age": 25,
    "fechaNacimiento": "2000-03-11",
    "source": "fc26"
  },
  "midtjylland|Martin Erlić (CB)": {
    "overall": 72,
    "nationality": "Croatia",
    "dorsal": 6,
    "age": 27,
    "fechaNacimiento": "1998-01-24",
    "source": "fc26"
  },
  "midtjylland|Ousmane Diao (CB)": {
    "overall": 72,
    "nationality": "Senegal",
    "dorsal": 4,
    "age": 21,
    "fechaNacimiento": "2004-06-08",
    "source": "fc26"
  },
  "midtjylland|Lee Han Beom (CB)": {
    "overall": 69,
    "nationality": "Korea Republic",
    "dorsal": 3,
    "age": 23,
    "fechaNacimiento": "2002-06-17",
    "source": "fc26"
  },
  "midtjylland|Victor Bak (LB)": {
    "overall": 68,
    "nationality": "Denmark",
    "dorsal": 55,
    "age": 21,
    "fechaNacimiento": "2003-10-03",
    "source": "fc26"
  },
  "midtjylland|Mikael Uhre (ST)": {
    "overall": 72,
    "nationality": "Denmark",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1994-09-30",
    "source": "fc26"
  },
  "galatasaray|Victor Osimhen": {
    "overall": 87,
    "nationality": "Nigeria",
    "dorsal": 45,
    "age": 26,
    "fechaNacimiento": "1998-12-29",
    "source": "fc26"
  },
  "galatasaray|Barış Alper Yılmaz": {
    "overall": 80,
    "nationality": "Türkiye",
    "dorsal": 53,
    "age": 25,
    "fechaNacimiento": "2000-05-23",
    "source": "fc26"
  },
  "galatasaray|Gabriel Sara": {
    "overall": 80,
    "nationality": "Brazil",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1999-06-26",
    "source": "fc26"
  },
  "galatasaray|Wilfried Singo": {
    "overall": 80,
    "nationality": "Côte d'Ivoire",
    "dorsal": 90,
    "age": 24,
    "fechaNacimiento": "2000-12-25",
    "source": "fc26"
  },
  "galatasaray|Lesley Ugochukwu": {
    "overall": 73,
    "nationality": "France",
    "dorsal": 8,
    "age": 21,
    "fechaNacimiento": "2004-03-26",
    "source": "fc26"
  },
  "fenerbahce|Mason Greenwood": {
    "overall": 82,
    "nationality": "England",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2001-10-01",
    "source": "fc26"
  },
  "fenerbahce|Mattéo Guendouzi": {
    "overall": 82,
    "nationality": "France",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1999-04-14",
    "source": "fc26"
  },
  "fenerbahce|Kerem Aktürkoğlu": {
    "overall": 80,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "fenerbahce|Dorgeles Nene": {
    "overall": 71,
    "nationality": "Mali",
    "dorsal": 45,
    "age": 22,
    "fechaNacimiento": "2002-12-23",
    "source": "fc26"
  },
  "fenerbahce|Jayden Oosterwolde": {
    "overall": 76,
    "nationality": "Netherlands",
    "dorsal": 24,
    "age": 24,
    "fechaNacimiento": "2001-04-26",
    "source": "fc26"
  },
  "qarabag|Leandro Andrade (RW)": {
    "overall": 72,
    "nationality": "Cabo Verde",
    "dorsal": 15,
    "age": 25,
    "fechaNacimiento": "1999-09-24",
    "source": "fc26"
  },
  "qarabag|Mateusz Kochalski (GK)": {
    "overall": 69,
    "nationality": "Poland",
    "dorsal": 99,
    "age": 24,
    "fechaNacimiento": "2000-07-25",
    "source": "fc26"
  },
  "qarabag|Kady (CAM)": {
    "overall": 70,
    "nationality": "Brazil",
    "dorsal": 20,
    "age": 29,
    "fechaNacimiento": "1996-05-02",
    "source": "fc26"
  },
  "qarabag|Toral Bayramov (LB)": {
    "overall": 69,
    "nationality": "Azerbaijan",
    "dorsal": 27,
    "age": 24,
    "fechaNacimiento": "2001-02-23",
    "source": "fc26"
  },
  "qarabag|Abdellah Zoubir (LW)": {
    "overall": 71,
    "nationality": "France",
    "dorsal": 10,
    "age": 33,
    "fechaNacimiento": "1991-12-05",
    "source": "fc26"
  },
  "qarabag|Matheus Silva (RB)": {
    "overall": 69,
    "nationality": "Brazil",
    "dorsal": 2,
    "age": 27,
    "fechaNacimiento": "1997-10-03",
    "source": "fc26"
  },
  "qarabag|Pedro Bicalho (CM)": {
    "overall": 66,
    "nationality": "Brazil",
    "dorsal": 35,
    "age": 24,
    "fechaNacimiento": "2001-04-23",
    "source": "fc26"
  },
  "qarabag|Marko Janković (CM)": {
    "overall": 68,
    "nationality": "Montenegro",
    "dorsal": 8,
    "age": 29,
    "fechaNacimiento": "1995-07-09",
    "source": "fc26"
  },
  "qarabag|Oleksiy Kashchuk (RW)": {
    "overall": 67,
    "nationality": "Ukraine",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-06-29",
    "source": "fc26"
  },
  "qarabag|Elvin Cafarquliyev (LB)": {
    "overall": 68,
    "nationality": "Azerbaijan",
    "dorsal": 44,
    "age": 24,
    "fechaNacimiento": "2000-10-26",
    "source": "fc26"
  },
  "qarabag|Shahruddin Magomedaliyev (GK)": {
    "overall": 69,
    "dorsal": 1,
    "source": "latamfc26"
  },
  "pafos_fc|Biel": {
    "overall": 71,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "pafos_fc|Guga": {
    "overall": 55,
    "nationality": "Brazil",
    "dorsal": 99,
    "age": 18,
    "fechaNacimiento": "2006-09-28",
    "source": "fc26"
  },
  "pafos_fc|Pêpê": {
    "overall": 78,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 28,
    "fechaNacimiento": "1997-02-24",
    "source": "fc26"
  },
  "kairat_almaty|Oiva Jukkola": {
    "overall": 62,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "rb_salzburg|Karim Konaté": {
    "overall": 72,
    "nationality": "Côte d'Ivoire",
    "dorsal": 19,
    "age": 21,
    "fechaNacimiento": "2004-03-21",
    "source": "fc26"
  },
  "rb_salzburg|Edmund Baidoo": {
    "overall": 62,
    "nationality": "Ghana",
    "dorsal": 20,
    "age": 19,
    "fechaNacimiento": "2006-01-30",
    "source": "fc26"
  },
  "rb_salzburg|Soumaïla Diabaté": {
    "overall": 68,
    "nationality": "Mali",
    "dorsal": 5,
    "age": 20,
    "fechaNacimiento": "2004-11-22",
    "source": "fc26"
  },
  "rb_salzburg|Maurits Kjærgaard": {
    "overall": 73,
    "nationality": "Denmark",
    "dorsal": 14,
    "age": 22,
    "fechaNacimiento": "2003-06-26",
    "source": "fc26"
  },
  "rb_salzburg|Adam Daghim": {
    "overall": 66,
    "nationality": "Denmark",
    "dorsal": 11,
    "age": 19,
    "fechaNacimiento": "2005-09-28",
    "source": "fc26"
  },
  "sturm_graz|Nelson Weiper": {
    "overall": 70,
    "nationality": "Germany",
    "dorsal": 44,
    "age": 20,
    "fechaNacimiento": "2005-03-17",
    "source": "fc26"
  },
  "sturm_graz|Otar Kiteishvili": {
    "overall": 75,
    "nationality": "Georgia",
    "dorsal": 10,
    "age": 29,
    "fechaNacimiento": "1996-03-26",
    "source": "fc26"
  },
  "sturm_graz|Luca Weinhandl": {
    "overall": 59,
    "dorsal": 39,
    "source": "latamfc26"
  },
  "sturm_graz|Jacob Peter Hödl": {
    "overall": 58,
    "nationality": "Austria",
    "dorsal": 43,
    "age": 18,
    "fechaNacimiento": "2007-01-31",
    "source": "fc26"
  },
  "sturm_graz|Jeyland Mitchell": {
    "overall": 66,
    "nationality": "Costa Rica",
    "dorsal": 2,
    "age": 20,
    "fechaNacimiento": "2004-09-29",
    "source": "fc26"
  },
  "rangers_fc|Emmanuel Fernandez": {
    "overall": 64,
    "nationality": "England",
    "dorsal": 37,
    "age": 23,
    "fechaNacimiento": "2001-11-20",
    "source": "fc26"
  },
  "rangers_fc|Youssef Chermiti": {
    "overall": 71,
    "nationality": "Portugal",
    "dorsal": 9,
    "age": 21,
    "fechaNacimiento": "2004-05-24",
    "source": "fc26"
  },
  "rangers_fc|Nicolas Raskin": {
    "overall": 77,
    "nationality": "Belgium",
    "dorsal": 43,
    "age": 24,
    "fechaNacimiento": "2001-02-23",
    "source": "fc26"
  },
  "rangers_fc|Ivor Pandur": {
    "overall": 72,
    "nationality": "Croatia",
    "dorsal": 1,
    "age": 25,
    "fechaNacimiento": "2000-03-25",
    "source": "fc26"
  },
  "rangers_fc|Dan Neil": {
    "overall": 73,
    "dorsal": 6,
    "source": "latamfc26"
  },
  "celtic_fc|Arne Engels": {
    "overall": 75,
    "nationality": "Belgium",
    "dorsal": 27,
    "age": 21,
    "fechaNacimiento": "2003-09-08",
    "source": "fc26"
  },
  "celtic_fc|Reo Hatate": {
    "overall": 76,
    "nationality": "Japan",
    "dorsal": 41,
    "age": 27,
    "fechaNacimiento": "1997-11-21",
    "source": "fc26"
  },
  "celtic_fc|Cameron Carter-Vickers": {
    "overall": 79,
    "nationality": "United States",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1997-12-31",
    "source": "fc26"
  },
  "celtic_fc|Kieran Tierney": {
    "overall": 77,
    "nationality": "Scotland",
    "dorsal": 63,
    "age": 28,
    "fechaNacimiento": "1997-06-05",
    "source": "fc26"
  },
  "celtic_fc|Alistair Johnston": {
    "overall": 78,
    "nationality": "Canada",
    "dorsal": 2,
    "age": 26,
    "fechaNacimiento": "1998-10-08",
    "source": "fc26"
  },
  "young_boys|Edimilson Fernandes (CDM)": {
    "overall": 74,
    "nationality": "Switzerland",
    "dorsal": 6,
    "age": 29,
    "fechaNacimiento": "1996-04-15",
    "source": "fc26"
  },
  "young_boys|Christian Fassnacht (RM)": {
    "overall": 72,
    "nationality": "Switzerland",
    "dorsal": 16,
    "age": 31,
    "fechaNacimiento": "1993-11-11",
    "source": "fc26"
  },
  "young_boys|Alvyn Sanches (CAM)": {
    "overall": 73,
    "nationality": "Switzerland",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2003-02-12",
    "source": "fc26"
  },
  "young_boys|Marvin Keller (GK)": {
    "overall": 72,
    "nationality": "Switzerland",
    "dorsal": 33,
    "age": 22,
    "fechaNacimiento": "2002-07-03",
    "source": "fc26"
  },
  "young_boys|Gregory Wüthrich (CB)": {
    "overall": 73,
    "nationality": "Switzerland",
    "dorsal": 5,
    "age": 30,
    "fechaNacimiento": "1994-12-04",
    "source": "fc26"
  },
  "young_boys|Joël Almada Monteiro (LM)": {
    "overall": 73,
    "nationality": "Switzerland",
    "dorsal": 77,
    "age": 25,
    "fechaNacimiento": "1999-08-05",
    "source": "fc26"
  },
  "young_boys|Samuel Essende (ST)": {
    "overall": 74,
    "nationality": "Congo DR",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1998-01-23",
    "source": "fc26"
  },
  "young_boys|Armin Gigović (CDM)": {
    "overall": 72,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 37,
    "age": 23,
    "fechaNacimiento": "2002-04-06",
    "source": "fc26"
  },
  "young_boys|Chris Bedia (ST)": {
    "overall": 70,
    "nationality": "Côte d'Ivoire",
    "dorsal": 29,
    "age": 29,
    "fechaNacimiento": "1996-03-05",
    "source": "fc26"
  },
  "young_boys|Rayan Raveloson (CM)": {
    "overall": 71,
    "nationality": "Madagascar",
    "dorsal": 45,
    "age": 28,
    "fechaNacimiento": "1997-01-16",
    "source": "fc26"
  },
  "young_boys|Darian Males (RM)": {
    "overall": 71,
    "nationality": "Switzerland",
    "dorsal": 39,
    "age": 24,
    "fechaNacimiento": "2001-05-03",
    "source": "fc26"
  },
  "fc_basel|Metinho": {
    "overall": 69,
    "nationality": "Brazil",
    "dorsal": 5,
    "age": 22,
    "fechaNacimiento": "2003-04-23",
    "source": "fc26"
  },
  "fc_basel|Flavius Daniliuc": {
    "overall": 72,
    "nationality": "Austria",
    "dorsal": 24,
    "age": 24,
    "fechaNacimiento": "2001-04-27",
    "source": "fc26"
  },
  "fc_basel|Philip Otele": {
    "overall": 73,
    "nationality": "Nigeria",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1999-04-15",
    "source": "fc26"
  },
  "fc_basel|Kazeem Olaigbe": {
    "overall": 67,
    "nationality": "Belgium",
    "dorsal": 70,
    "age": 22,
    "fechaNacimiento": "2003-01-02",
    "source": "fc26"
  },
  "fc_basel|Andrej Bacanin": {
    "overall": 54,
    "nationality": "Serbia",
    "dorsal": 14,
    "age": 18,
    "fechaNacimiento": "2007-03-07",
    "source": "fc26"
  },
  "ferencvaros|Dénes Dibusz (GK)": {
    "overall": 78,
    "nationality": "Hungary",
    "dorsal": 90,
    "age": 34,
    "fechaNacimiento": "1990-11-16",
    "source": "fc26"
  },
  "ferencvaros|Mohammed Abu Fani (CM)": {
    "overall": 75,
    "dorsal": 15,
    "source": "latamfc26"
  },
  "ferencvaros|Cadu (LM)": {
    "overall": 74,
    "nationality": "Brazil",
    "dorsal": 33,
    "age": 27,
    "fechaNacimiento": "1997-08-08",
    "source": "fc26"
  },
  "ferencvaros|Cebrail Makreckis (RB)": {
    "overall": 72,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "ferencvaros|Naby Keïta (CM)": {
    "overall": 73,
    "nationality": "Guinea",
    "dorsal": 5,
    "age": 30,
    "fechaNacimiento": "1995-02-10",
    "source": "fc26"
  },
  "ferencvaros|Kristoffer Zachariassen (CAM)": {
    "overall": 71,
    "nationality": "Norway",
    "dorsal": 16,
    "age": 31,
    "fechaNacimiento": "1994-01-27",
    "source": "fc26"
  },
  "ferencvaros|Stefan Gartenmann (CB)": {
    "overall": 71,
    "nationality": "Switzerland",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1997-02-02",
    "source": "fc26"
  },
  "ferencvaros|Jonathan Levi (RW)": {
    "overall": 72,
    "nationality": "Sweden",
    "dorsal": 10,
    "age": 29,
    "fechaNacimiento": "1996-01-23",
    "source": "fc26"
  },
  "ferencvaros|Ibrahim Cissé (CB)": {
    "overall": 70,
    "nationality": "France",
    "dorsal": 27,
    "age": 29,
    "fechaNacimiento": "1996-05-02",
    "source": "fc26"
  },
  "ferencvaros|Gavriel Kanichowsky (CM)": {
    "overall": 71,
    "nationality": "Israel",
    "dorsal": 36,
    "age": 27,
    "fechaNacimiento": "1997-08-24",
    "source": "fc26"
  },
  "ferencvaros|Bamidele Yusuf (LW)": {
    "overall": 69,
    "nationality": "Nigeria",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2001-02-22",
    "source": "fc26"
  },
  "dinamo_zagreb|Dion Beljo": {
    "overall": 73,
    "nationality": "Croatia",
    "dorsal": 9,
    "age": 23,
    "fechaNacimiento": "2002-03-01",
    "source": "fc26"
  },
  "dinamo_zagreb|Sergi Domínguez": {
    "overall": 63,
    "nationality": "Spain",
    "dorsal": 36,
    "age": 20,
    "fechaNacimiento": "2005-04-01",
    "source": "fc26"
  },
  "dinamo_zagreb|Luka Stojkovic": {
    "overall": 70,
    "nationality": "Croatia",
    "dorsal": 7,
    "age": 21,
    "fechaNacimiento": "2003-10-28",
    "source": "fc26"
  },
  "dinamo_zagreb|Scott McKenna": {
    "overall": 75,
    "nationality": "Scotland",
    "dorsal": 26,
    "age": 28,
    "fechaNacimiento": "1996-11-12",
    "source": "fc26"
  },
  "dinamo_zagreb|Niko Galesic": {
    "overall": 70,
    "nationality": "Croatia",
    "dorsal": 15,
    "age": 24,
    "fechaNacimiento": "2001-03-26",
    "source": "fc26"
  },
  "ludogorets|Nathan Fernandes": {
    "overall": 72,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "ludogorets|Rwan Cruz": {
    "overall": 63,
    "nationality": "Brazil",
    "dorsal": 12,
    "age": 24,
    "fechaNacimiento": "2001-05-20",
    "source": "fc26"
  },
  "malmo_ff|Pontus Jansson (CB)": {
    "overall": 73,
    "nationality": "Sweden",
    "dorsal": 18,
    "age": 34,
    "fechaNacimiento": "1991-02-13",
    "source": "fc26"
  },
  "malmo_ff|Busanello (LB)": {
    "overall": 73,
    "nationality": "Brazil",
    "dorsal": 25,
    "age": 26,
    "fechaNacimiento": "1998-10-29",
    "source": "fc26"
  },
  "malmo_ff|Robin Olsen (GK)": {
    "overall": 73,
    "nationality": "Sweden",
    "dorsal": 30,
    "age": 35,
    "fechaNacimiento": "1990-01-08",
    "source": "fc26"
  },
  "malmo_ff|Otto Rosengren (CM)": {
    "overall": 71,
    "nationality": "Sweden",
    "dorsal": 7,
    "age": 22,
    "fechaNacimiento": "2003-05-16",
    "source": "fc26"
  },
  "malmo_ff|Sead Hakšabanović (LM)": {
    "overall": 70,
    "nationality": "Montenegro",
    "dorsal": 29,
    "age": 26,
    "fechaNacimiento": "1999-05-04",
    "source": "fc26"
  },
  "malmo_ff|Anders Christiansen (CAM)": {
    "overall": 72,
    "nationality": "Denmark",
    "dorsal": 10,
    "age": 35,
    "fechaNacimiento": "1990-06-08",
    "source": "fc26"
  },
  "malmo_ff|Jens Stryger Larsen (RB)": {
    "overall": 72,
    "nationality": "Denmark",
    "dorsal": 17,
    "age": 34,
    "fechaNacimiento": "1991-02-21",
    "source": "fc26"
  },
  "malmo_ff|Taha Ali (LM)": {
    "overall": 68,
    "nationality": "Sweden",
    "dorsal": 22,
    "age": 27,
    "fechaNacimiento": "1998-07-01",
    "source": "fc26"
  },
  "malmo_ff|Johan Dahlin (GK)": {
    "overall": 71,
    "nationality": "Sweden",
    "dorsal": 27,
    "age": 38,
    "fechaNacimiento": "1986-09-08",
    "source": "fc26"
  },
  "malmo_ff|Erik Botheim (ST)": {
    "overall": 71,
    "nationality": "Norway",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "2000-01-10",
    "source": "fc26"
  },
  "malmo_ff|Arnór Sigurðsson (LM)": {
    "overall": 69,
    "nationality": "Iceland",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1999-05-15",
    "source": "fc26"
  },
  "fcsb|Darius Olaru (CM)": {
    "overall": 73,
    "nationality": "Romania",
    "dorsal": 27,
    "age": 27,
    "fechaNacimiento": "1998-03-03",
    "source": "fc26"
  },
  "fcsb|Florin Tănase (CAM)": {
    "overall": 70,
    "nationality": "Romania",
    "dorsal": 10,
    "age": 30,
    "fechaNacimiento": "1994-12-30",
    "source": "fc26"
  },
  "fcsb|Daniel Bîrligea (ST)": {
    "overall": 72,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "fcsb|Juri Cisotti (CM)": {
    "overall": 71,
    "nationality": "Italy",
    "dorsal": 31,
    "age": 32,
    "fechaNacimiento": "1993-05-05",
    "source": "fc26"
  },
  "fcsb|Ștefan Târnovanu (GK)": {
    "overall": 72,
    "nationality": "Romania",
    "dorsal": 32,
    "age": 25,
    "fechaNacimiento": "2000-05-09",
    "source": "fc26"
  },
  "fcsb|Siyabonga Ngezana (CB)": {
    "overall": 73,
    "nationality": "South Africa",
    "dorsal": 30,
    "age": 27,
    "fechaNacimiento": "1997-07-15",
    "source": "fc26"
  },
  "fcsb|Risto Radunović (LB)": {
    "overall": 70,
    "nationality": "Montenegro",
    "dorsal": 33,
    "age": 33,
    "fechaNacimiento": "1992-05-04",
    "source": "fc26"
  },
  "fcsb|Joyskim Dawa (CB)": {
    "overall": 70,
    "nationality": "Cameroon",
    "dorsal": 5,
    "age": 29,
    "fechaNacimiento": "1996-04-09",
    "source": "fc26"
  },
  "fcsb|André Duarte (CB)": {
    "overall": 68,
    "dorsal": 3,
    "source": "latamfc26"
  },
  "fcsb|Mihai Lixandru (CDM)": {
    "overall": 68,
    "nationality": "Romania",
    "dorsal": 16,
    "age": 24,
    "fechaNacimiento": "2001-06-05",
    "source": "fc26"
  },
  "fcsb|David Miculescu (RW)": {
    "overall": 67,
    "nationality": "Romania",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2001-05-02",
    "source": "fc26"
  },
  "maccabi_tel_aviv|Kristijan Belic": {
    "overall": 71,
    "dorsal": 24,
    "source": "latamfc26"
  },
  "maccabi_tel_aviv|Hélio Varela": {
    "overall": 67,
    "dorsal": 26,
    "source": "latamfc26"
  },
  "wc_colombia|Luis Díaz": {
    "overall": 85,
    "nationality": "Colombia",
    "dorsal": 14,
    "age": 28,
    "fechaNacimiento": "1997-01-13",
    "source": "fc26"
  },
  "wc_colombia|James Rodríguez": {
    "overall": 80,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "wc_colombia|Jhon Arias": {
    "overall": 78,
    "nationality": "Colombia",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1997-09-21",
    "source": "fc26"
  },
  "wc_colombia|Richard Ríos": {
    "overall": 79,
    "nationality": "Colombia",
    "dorsal": 20,
    "age": 25,
    "fechaNacimiento": "2000-06-02",
    "source": "fc26"
  },
  "wc_colombia|Davinson Sánchez": {
    "overall": 82,
    "nationality": "Colombia",
    "dorsal": 6,
    "age": 29,
    "fechaNacimiento": "1996-06-12",
    "source": "fc26"
  },
  "wc_alemania|Jamal Musiala": {
    "overall": 88,
    "nationality": "Germany",
    "dorsal": 10,
    "age": 22,
    "fechaNacimiento": "2003-02-26",
    "source": "fc26"
  },
  "wc_alemania|Florian Wirtz": {
    "overall": 89,
    "nationality": "Germany",
    "dorsal": 7,
    "age": 22,
    "fechaNacimiento": "2003-05-03",
    "source": "fc26"
  },
  "wc_alemania|Joshua Kimmich": {
    "overall": 89,
    "nationality": "Germany",
    "dorsal": 6,
    "age": 30,
    "fechaNacimiento": "1995-02-08",
    "source": "fc26"
  },
  "wc_alemania|Kai Havertz": {
    "overall": 82,
    "nationality": "Germany",
    "dorsal": 29,
    "age": 26,
    "fechaNacimiento": "1999-06-11",
    "source": "fc26"
  },
  "wc_alemania|Antonio Rüdiger": {
    "overall": 86,
    "nationality": "Germany",
    "dorsal": 22,
    "age": 32,
    "fechaNacimiento": "1993-03-03",
    "source": "fc26"
  },
  "wc_argentina|Lionel Messi": {
    "overall": 86,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 38,
    "fechaNacimiento": "1987-06-24",
    "source": "fc26"
  },
  "wc_argentina|Julián Álvarez": {
    "overall": 87,
    "nationality": "Argentina",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "2000-01-31",
    "source": "fc26"
  },
  "wc_argentina|Lautaro Martínez": {
    "overall": 88,
    "nationality": "Argentina",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1997-08-22",
    "source": "fc26"
  },
  "wc_argentina|Rodrigo De Paul": {
    "overall": 84,
    "nationality": "Argentina",
    "dorsal": 7,
    "age": 31,
    "fechaNacimiento": "1994-05-24",
    "source": "fc26"
  },
  "wc_argentina|Emiliano Martínez": {
    "overall": 85,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "wc_canada|Alphonso Davies": {
    "overall": 84,
    "nationality": "Canada",
    "dorsal": 19,
    "age": 24,
    "fechaNacimiento": "2000-11-02",
    "source": "fc26"
  },
  "wc_canada|Jonathan David": {
    "overall": 82,
    "nationality": "Canada",
    "dorsal": 30,
    "age": 25,
    "fechaNacimiento": "2000-01-14",
    "source": "fc26"
  },
  "wc_canada|Ismaël Koné": {
    "overall": 72,
    "nationality": "Canada",
    "dorsal": 90,
    "age": 23,
    "fechaNacimiento": "2002-06-16",
    "source": "fc26"
  },
  "wc_canada|Tajon Buchanan": {
    "overall": 74,
    "nationality": "Canada",
    "dorsal": 17,
    "age": 26,
    "fechaNacimiento": "1999-02-08",
    "source": "fc26"
  },
  "wc_canada|Alistair Johnston": {
    "overall": 78,
    "nationality": "Canada",
    "dorsal": 2,
    "age": 26,
    "fechaNacimiento": "1998-10-08",
    "source": "fc26"
  },
  "wc_mexico|Santiago Giménez": {
    "overall": 79,
    "nationality": "Mexico",
    "dorsal": 7,
    "age": 24,
    "fechaNacimiento": "2001-04-18",
    "source": "fc26"
  },
  "wc_mexico|Edson Álvarez": {
    "overall": 78,
    "nationality": "Mexico",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1997-10-24",
    "source": "fc26"
  },
  "wc_mexico|Gilberto Mora": {
    "overall": 75,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "wc_mexico|Julián Quiñones": {
    "overall": 80,
    "nationality": "Mexico",
    "dorsal": 33,
    "age": 28,
    "fechaNacimiento": "1997-03-24",
    "source": "fc26"
  },
  "wc_mexico|Guillermo Ochoa": {
    "overall": 74,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "wc_usa|Christian Pulisic": {
    "overall": 84,
    "nationality": "United States",
    "dorsal": 11,
    "age": 26,
    "fechaNacimiento": "1998-09-18",
    "source": "fc26"
  },
  "wc_usa|Weston McKennie": {
    "overall": 78,
    "nationality": "United States",
    "dorsal": 22,
    "age": 26,
    "fechaNacimiento": "1998-08-28",
    "source": "fc26"
  },
  "wc_usa|Folarin Balogun": {
    "overall": 77,
    "nationality": "United States",
    "dorsal": 9,
    "age": 23,
    "fechaNacimiento": "2001-07-03",
    "source": "fc26"
  },
  "wc_usa|Tyler Adams": {
    "overall": 79,
    "nationality": "United States",
    "dorsal": 12,
    "age": 26,
    "fechaNacimiento": "1999-02-14",
    "source": "fc26"
  },
  "wc_usa|Malik Tillman": {
    "overall": 82,
    "nationality": "United States",
    "dorsal": 10,
    "age": 23,
    "fechaNacimiento": "2002-05-28",
    "source": "fc26"
  },
  "wc_curazao|Tahith Chong": {
    "overall": 71,
    "nationality": "Curacao",
    "dorsal": 24,
    "age": 25,
    "fechaNacimiento": "1999-12-04",
    "source": "fc26"
  },
  "wc_curazao|Armando Obispo": {
    "overall": 73,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1999-03-05",
    "source": "fc26"
  },
  "wc_curazao|Sontje Hansen": {
    "overall": 69,
    "dorsal": 12,
    "source": "latamfc26"
  },
  "wc_curazao|Juninho Bacuna": {
    "overall": 69,
    "nationality": "Curacao",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1997-08-07",
    "source": "fc26"
  },
  "wc_curazao|Riechedly Bazoer": {
    "overall": 74,
    "nationality": "Netherlands",
    "dorsal": 20,
    "age": 28,
    "fechaNacimiento": "1996-10-12",
    "source": "fc26"
  },
  "wc_haiti|Jean-Ricner Bellegarde": {
    "overall": 75,
    "nationality": "Haiti",
    "dorsal": 27,
    "age": 27,
    "fechaNacimiento": "1998-06-27",
    "source": "fc26"
  },
  "wc_haiti|Danley Jean Jacques": {
    "overall": 70,
    "nationality": "Haiti",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-05-20",
    "source": "fc26"
  },
  "wc_haiti|Frantzdy Pierrot": {
    "overall": 72,
    "nationality": "Haiti",
    "dorsal": 14,
    "age": 30,
    "fechaNacimiento": "1995-03-29",
    "source": "fc26"
  },
  "wc_haiti|Carlens Arcus": {
    "overall": 71,
    "nationality": "Haiti",
    "dorsal": 2,
    "age": 29,
    "fechaNacimiento": "1996-06-28",
    "source": "fc26"
  },
  "wc_haiti|Duckens Nazon": {
    "overall": 68,
    "dorsal": 99,
    "source": "latamfc26"
  },
  "wc_panama|Adalberto Carrasquilla": {
    "overall": 75,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "wc_panama|Amir Murillo": {
    "overall": 76,
    "dorsal": 23,
    "source": "latamfc26"
  },
  "wc_panama|José Córdoba": {
    "overall": 68,
    "nationality": "Panama",
    "dorsal": 33,
    "age": 24,
    "fechaNacimiento": "2001-06-03",
    "source": "fc26"
  },
  "wc_panama|José Luis Rodríguez": {
    "overall": 72,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "wc_panama|Ismael Díaz": {
    "overall": 74,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "wc_brasil|Raphinha": {
    "overall": 89,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 28,
    "fechaNacimiento": "1996-12-14",
    "source": "fc26"
  },
  "wc_brasil|Bruno Guimarães": {
    "overall": 86,
    "nationality": "Brazil",
    "dorsal": 39,
    "age": 27,
    "fechaNacimiento": "1997-11-16",
    "source": "fc26"
  },
  "wc_brasil|Gabriel Martinelli": {
    "overall": 81,
    "nationality": "Brazil",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2001-06-18",
    "source": "fc26"
  },
  "wc_brasil|Matheus Cunha": {
    "overall": 83,
    "nationality": "Brazil",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1999-05-27",
    "source": "fc26"
  },
  "wc_ecuador|Moisés Caicedo": {
    "overall": 87,
    "nationality": "Ecuador",
    "dorsal": 25,
    "age": 23,
    "fechaNacimiento": "2001-11-02",
    "source": "fc26"
  },
  "wc_ecuador|Piero Hincapié": {
    "overall": 83,
    "nationality": "Ecuador",
    "dorsal": 5,
    "age": 23,
    "fechaNacimiento": "2002-01-09",
    "source": "fc26"
  },
  "wc_ecuador|Willian Pacho": {
    "overall": 86,
    "nationality": "Ecuador",
    "dorsal": 51,
    "age": 23,
    "fechaNacimiento": "2001-10-16",
    "source": "fc26"
  },
  "wc_ecuador|Pervis Estupiñán": {
    "overall": 79,
    "nationality": "Ecuador",
    "dorsal": 2,
    "age": 27,
    "fechaNacimiento": "1998-01-21",
    "source": "fc26"
  },
  "wc_ecuador|Gonzalo Plata": {
    "overall": 79,
    "dorsal": 19,
    "source": "latamfc26"
  },
  "wc_paraguay|Miguel Almirón": {
    "overall": 76,
    "nationality": "Paraguay",
    "dorsal": 10,
    "age": 31,
    "fechaNacimiento": "1994-02-10",
    "source": "fc26"
  },
  "wc_paraguay|Julio Enciso": {
    "overall": 73,
    "nationality": "Paraguay",
    "dorsal": 19,
    "age": 21,
    "fechaNacimiento": "2004-01-23",
    "source": "fc26"
  },
  "wc_paraguay|Diego Gómez": {
    "overall": 73,
    "nationality": "Paraguay",
    "dorsal": 25,
    "age": 22,
    "fechaNacimiento": "2003-03-27",
    "source": "fc26"
  },
  "wc_paraguay|Omar Alderete": {
    "overall": 78,
    "nationality": "Paraguay",
    "dorsal": 15,
    "age": 28,
    "fechaNacimiento": "1996-12-26",
    "source": "fc26"
  },
  "wc_paraguay|Ramón Sosa": {
    "overall": 75,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "wc_uruguay|Federico Valverde": {
    "overall": 89,
    "nationality": "Uruguay",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1998-07-22",
    "source": "fc26"
  },
  "wc_uruguay|Darwin Núñez": {
    "overall": 79,
    "nationality": "Uruguay",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1999-06-24",
    "source": "fc26"
  },
  "wc_uruguay|Ronald Araújo": {
    "overall": 83,
    "nationality": "Uruguay",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1999-03-07",
    "source": "fc26"
  },
  "wc_uruguay|Rodrigo Bentancur": {
    "overall": 80,
    "nationality": "Uruguay",
    "dorsal": 30,
    "age": 28,
    "fechaNacimiento": "1997-06-25",
    "source": "fc26"
  },
  "wc_uruguay|Giorgian De Arrascaeta": {
    "overall": 80,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "wc_nueva_zelanda|Chris Wood": {
    "overall": 81,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "wc_nueva_zelanda|Joe Bell": {
    "overall": 74,
    "nationality": "New Zealand",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1999-04-27",
    "source": "fc26"
  },
  "wc_nueva_zelanda|Elijah Just": {
    "overall": 66,
    "nationality": "New Zealand",
    "dorsal": 21,
    "age": 25,
    "fechaNacimiento": "2000-05-01",
    "source": "fc26"
  },
  "wc_nueva_zelanda|Liberato Cacace": {
    "overall": 72,
    "nationality": "New Zealand",
    "dorsal": 13,
    "age": 24,
    "fechaNacimiento": "2000-09-27",
    "source": "fc26"
  },
  "wc_nueva_zelanda|Marko Stamenić": {
    "overall": 71,
    "nationality": "New Zealand",
    "dorsal": 6,
    "age": 23,
    "fechaNacimiento": "2002-02-19",
    "source": "fc26"
  },
  "wc_australia|Alessandro Circati": {
    "overall": 71,
    "nationality": "Australia",
    "dorsal": 39,
    "age": 21,
    "fechaNacimiento": "2003-10-10",
    "source": "fc26"
  },
  "wc_australia|Cristian Volpato": {
    "overall": 69,
    "nationality": "Italy",
    "dorsal": 7,
    "age": 21,
    "fechaNacimiento": "2003-11-15",
    "source": "fc26"
  },
  "wc_australia|Nestory Irankunda": {
    "overall": 67,
    "nationality": "Australia",
    "dorsal": 66,
    "age": 19,
    "fechaNacimiento": "2006-02-09",
    "source": "fc26"
  },
  "wc_australia|Jordan Bos": {
    "overall": 69,
    "nationality": "Australia",
    "dorsal": 15,
    "age": 22,
    "fechaNacimiento": "2002-10-29",
    "source": "fc26"
  },
  "wc_australia|Mathew Leckie": {
    "overall": 70,
    "nationality": "Australia",
    "dorsal": 7,
    "age": 34,
    "fechaNacimiento": "1991-02-04",
    "source": "fc26"
  },
  "wc_irak|Ali Al-Hamadi": {
    "overall": 66,
    "nationality": "Iraq",
    "dorsal": 12,
    "age": 23,
    "fechaNacimiento": "2002-03-01",
    "source": "fc26"
  },
  "wc_irak|Ahmed Qasem": {
    "overall": 66,
    "nationality": "Sweden",
    "dorsal": 37,
    "age": 21,
    "fechaNacimiento": "2003-07-12",
    "source": "fc26"
  },
  "wc_irak|Aymen Hussein": {
    "overall": 70,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "wc_irak|Zidane Iqbal": {
    "overall": 68,
    "nationality": "Iraq",
    "dorsal": 14,
    "age": 22,
    "fechaNacimiento": "2003-04-27",
    "source": "fc26"
  },
  "wc_irak|Merchas Doski": {
    "overall": 68,
    "nationality": "Iraq",
    "dorsal": 14,
    "age": 25,
    "fechaNacimiento": "1999-12-07",
    "source": "fc26"
  },
  "wc_iran|Mehdi Taremi": {
    "overall": 78,
    "nationality": "Iran",
    "dorsal": 30,
    "age": 32,
    "fechaNacimiento": "1992-07-18",
    "source": "fc26"
  },
  "wc_iran|Alireza Jahanbakhsh": {
    "overall": 71,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "wc_iran|Saman Ghoddos": {
    "overall": 72,
    "dorsal": 14,
    "source": "latamfc26"
  },
  "wc_iran|Mehdi Ghayedi": {
    "overall": 71,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "wc_japon|Takefusa Kubo": {
    "overall": 82,
    "nationality": "Japan",
    "dorsal": 14,
    "age": 24,
    "fechaNacimiento": "2001-06-04",
    "source": "fc26"
  },
  "wc_japon|Ritsu Doan": {
    "overall": 82,
    "nationality": "Japan",
    "dorsal": 20,
    "age": 27,
    "fechaNacimiento": "1998-06-16",
    "source": "fc26"
  },
  "wc_japon|Kaishu Sano": {
    "overall": 79,
    "nationality": "Japan",
    "dorsal": 6,
    "age": 24,
    "fechaNacimiento": "2000-12-30",
    "source": "fc26"
  },
  "wc_japon|Ko Itakura": {
    "overall": 77,
    "nationality": "Japan",
    "dorsal": 4,
    "age": 28,
    "fechaNacimiento": "1997-01-27",
    "source": "fc26"
  },
  "wc_japon|Daichi Kamada": {
    "overall": 77,
    "nationality": "Japan",
    "dorsal": 18,
    "age": 28,
    "fechaNacimiento": "1996-08-05",
    "source": "fc26"
  },
  "wc_jordania|Yazan Al-Arab": {
    "overall": 75,
    "nationality": "Jordan",
    "dorsal": 5,
    "age": 29,
    "fechaNacimiento": "1996-01-31",
    "source": "fc26"
  },
  "wc_jordania|Ali Olwan": {
    "overall": 68,
    "dorsal": 9,
    "source": "latamfc26"
  },
  "wc_jordania|Noor Al-Rawabdeh": {
    "overall": 69,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "wc_corea_sur|Son Heung-min": {
    "overall": 84,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "wc_corea_sur|Lee Kang-in": {
    "overall": 79,
    "nationality": "Korea Republic",
    "dorsal": 19,
    "age": 24,
    "fechaNacimiento": "2001-02-19",
    "source": "fc26"
  },
  "wc_corea_sur|Kim Min-jae": {
    "overall": 82,
    "nationality": "Korea Republic",
    "dorsal": 3,
    "age": 28,
    "fechaNacimiento": "1996-11-15",
    "source": "fc26"
  },
  "wc_corea_sur|Hwang Hee-chan": {
    "overall": 75,
    "nationality": "Korea Republic",
    "dorsal": 11,
    "age": 29,
    "fechaNacimiento": "1996-01-26",
    "source": "fc26"
  },
  "wc_corea_sur|Cho Gue-sung": {
    "overall": 70,
    "nationality": "Korea Republic",
    "dorsal": 10,
    "age": 27,
    "fechaNacimiento": "1998-01-25",
    "source": "fc26"
  },
  "wc_catar|Akram Afif": {
    "overall": 78,
    "nationality": "Qatar",
    "age": 28,
    "fechaNacimiento": "1996-11-18",
    "source": "fc26"
  },
  "wc_catar|Almoez Ali": {
    "overall": 74,
    "nationality": "Qatar",
    "age": 28,
    "fechaNacimiento": "1996-08-19",
    "source": "fc26"
  },
  "wc_catar|Hassan Al-Haydos": {
    "overall": 71,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "wc_catar|Edmílson Junior": {
    "overall": 76,
    "nationality": "Qatar",
    "age": 30,
    "fechaNacimiento": "1994-08-19",
    "source": "fc26"
  },
  "wc_catar|Boualem Khoukhi": {
    "overall": 71,
    "nationality": "Qatar",
    "age": 34,
    "fechaNacimiento": "1990-09-07",
    "source": "fc26"
  },
  "wc_arabia_saudita|Salem Al-Dawsari": {
    "overall": 82,
    "nationality": "Saudi Arabia",
    "dorsal": 29,
    "age": 33,
    "fechaNacimiento": "1991-08-19",
    "source": "fc26"
  },
  "wc_arabia_saudita|Saud Abdulhamid": {
    "overall": 75,
    "nationality": "Saudi Arabia",
    "dorsal": 23,
    "age": 25,
    "fechaNacimiento": "1999-07-18",
    "source": "fc26"
  },
  "wc_arabia_saudita|Mohamed Kanno": {
    "overall": 72,
    "nationality": "Saudi Arabia",
    "dorsal": 28,
    "age": 30,
    "fechaNacimiento": "1994-09-22",
    "source": "fc26"
  },
  "wc_arabia_saudita|Saleh Al-Shehri": {
    "overall": 69,
    "nationality": "Saudi Arabia",
    "dorsal": 11,
    "age": 31,
    "fechaNacimiento": "1993-11-01",
    "source": "fc26"
  },
  "wc_uzbekistan|Abdukodir Khusanov": {
    "overall": 77,
    "nationality": "Uzbekistan",
    "dorsal": 45,
    "age": 21,
    "fechaNacimiento": "2004-02-29",
    "source": "fc26"
  },
  "wc_uzbekistan|Eldor Shomurodov": {
    "overall": 74,
    "nationality": "Uzbekistan",
    "dorsal": 14,
    "age": 30,
    "fechaNacimiento": "1995-06-29",
    "source": "fc26"
  },
  "wc_uzbekistan|Abbosbek Fayzullaev": {
    "overall": 65,
    "nationality": "Uzbekistan",
    "dorsal": 11,
    "age": 21,
    "fechaNacimiento": "2003-10-03",
    "source": "fc26"
  },
  "wc_uzbekistan|Jaloliddin Masharipov": {
    "overall": 72,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "wc_uzbekistan|Sherzod Nasrullaev": {
    "overall": 66,
    "dorsal": 13,
    "source": "latamfc26"
  },
  "wc_argelia|Riyad Mahrez": {
    "overall": 84,
    "nationality": "Algeria",
    "dorsal": 7,
    "age": 34,
    "fechaNacimiento": "1991-02-21",
    "source": "fc26"
  },
  "wc_argelia|Rayan Aït-Nouri": {
    "overall": 81,
    "nationality": "Algeria",
    "dorsal": 21,
    "age": 24,
    "fechaNacimiento": "2001-06-06",
    "source": "fc26"
  },
  "wc_argelia|Ibrahim Maza": {
    "overall": 71,
    "nationality": "Algeria",
    "dorsal": 30,
    "age": 19,
    "fechaNacimiento": "2005-11-24",
    "source": "fc26"
  },
  "wc_argelia|Amine Gouiri": {
    "overall": 79,
    "nationality": "Algeria",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-02-16",
    "source": "fc26"
  },
  "wc_argelia|Mohamed Amoura": {
    "overall": 80,
    "nationality": "Algeria",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-05-09",
    "source": "fc26"
  },
  "wc_cabo_verde|Logan Costa": {
    "overall": 77,
    "nationality": "Cabo Verde",
    "dorsal": 2,
    "age": 24,
    "fechaNacimiento": "2001-04-01",
    "source": "fc26"
  },
  "wc_cabo_verde|Ryan Mendes": {
    "overall": 71,
    "dorsal": 20,
    "source": "latamfc26"
  },
  "wc_cabo_verde|Jovane Cabral": {
    "overall": 70,
    "nationality": "Cabo Verde",
    "dorsal": 11,
    "age": 27,
    "fechaNacimiento": "1998-06-14",
    "source": "fc26"
  },
  "wc_cabo_verde|Roberto Lopes": {
    "overall": 66,
    "nationality": "Cabo Verde",
    "dorsal": 4,
    "age": 33,
    "fechaNacimiento": "1992-06-17",
    "source": "fc26"
  },
  "wc_cabo_verde|Garry Rodrigues": {
    "overall": 70,
    "dorsal": 11,
    "source": "latamfc26"
  },
  "wc_rd_congo|Chancel Mbemba": {
    "overall": 75,
    "nationality": "Congo DR",
    "dorsal": 18,
    "age": 30,
    "fechaNacimiento": "1994-08-08",
    "source": "fc26"
  },
  "wc_rd_congo|Yoane Wissa": {
    "overall": 82,
    "nationality": "Congo DR",
    "dorsal": 9,
    "age": 28,
    "fechaNacimiento": "1996-09-03",
    "source": "fc26"
  },
  "wc_rd_congo|Aaron Wan-Bissaka": {
    "overall": 80,
    "nationality": "Congo DR",
    "dorsal": 29,
    "age": 27,
    "fechaNacimiento": "1997-11-26",
    "source": "fc26"
  },
  "wc_rd_congo|Noah Sadiki": {
    "overall": 74,
    "nationality": "Congo DR",
    "dorsal": 27,
    "age": 20,
    "fechaNacimiento": "2004-12-17",
    "source": "fc26"
  },
  "wc_rd_congo|Cédric Bakambu": {
    "overall": 77,
    "nationality": "Congo DR",
    "dorsal": 11,
    "age": 34,
    "fechaNacimiento": "1991-04-11",
    "source": "fc26"
  },
  "wc_costa_marfil|Amad Diallo": {
    "overall": 80,
    "dorsal": 16,
    "source": "latamfc26"
  },
  "wc_costa_marfil|Franck Kessié": {
    "overall": 80,
    "nationality": "Côte d'Ivoire",
    "dorsal": 79,
    "age": 28,
    "fechaNacimiento": "1996-12-19",
    "source": "fc26"
  },
  "wc_costa_marfil|Simon Adingra": {
    "overall": 76,
    "nationality": "Côte d'Ivoire",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2002-01-01",
    "source": "fc26"
  },
  "wc_costa_marfil|Odilon Kossounou": {
    "overall": 80,
    "nationality": "Côte d'Ivoire",
    "dorsal": 3,
    "age": 24,
    "fechaNacimiento": "2001-01-04",
    "source": "fc26"
  },
  "wc_costa_marfil|Nicolas Pépé": {
    "overall": 80,
    "nationality": "Côte d'Ivoire",
    "dorsal": 19,
    "age": 30,
    "fechaNacimiento": "1995-05-29",
    "source": "fc26"
  },
  "wc_egipto|Mohamed Salah": {
    "overall": 91,
    "nationality": "Egypt",
    "dorsal": 11,
    "age": 33,
    "fechaNacimiento": "1992-06-15",
    "source": "fc26"
  },
  "wc_egipto|Omar Marmoush": {
    "overall": 84,
    "nationality": "Egypt",
    "dorsal": 7,
    "age": 26,
    "fechaNacimiento": "1999-02-07",
    "source": "fc26"
  },
  "wc_egipto|Trezeguet": {
    "overall": 75,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "wc_egipto|Zizo": {
    "overall": 70,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "wc_egipto|Emam Ashour": {
    "overall": 69,
    "dorsal": 8,
    "source": "latamfc26"
  },
  "wc_ghana|Antoine Semenyo": {
    "overall": 80,
    "nationality": "Ghana",
    "dorsal": 24,
    "age": 25,
    "fechaNacimiento": "2000-01-07",
    "source": "fc26"
  },
  "wc_ghana|Mohammed Kudus": {
    "overall": 80,
    "nationality": "Ghana",
    "dorsal": 20,
    "age": 24,
    "fechaNacimiento": "2000-08-02",
    "source": "fc26"
  },
  "wc_ghana|Thomas Partey": {
    "overall": 83,
    "nationality": "Ghana",
    "dorsal": 16,
    "age": 32,
    "fechaNacimiento": "1993-06-13",
    "source": "fc26"
  },
  "wc_ghana|Iñaki Williams": {
    "overall": 83,
    "nationality": "Ghana",
    "dorsal": 9,
    "age": 31,
    "fechaNacimiento": "1994-06-15",
    "source": "fc26"
  },
  "wc_ghana|Jordan Ayew": {
    "overall": 73,
    "nationality": "Ghana",
    "dorsal": 9,
    "age": 33,
    "fechaNacimiento": "1991-09-11",
    "source": "fc26"
  },
  "wc_marruecos|Achraf Hakimi": {
    "overall": 89,
    "nationality": "Morocco",
    "dorsal": 2,
    "age": 26,
    "fechaNacimiento": "1998-11-04",
    "source": "fc26"
  },
  "wc_marruecos|Brahim Díaz": {
    "overall": 81,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "wc_marruecos|Ayyoub Bouaddi": {
    "overall": 75,
    "nationality": "France",
    "dorsal": 32,
    "age": 17,
    "fechaNacimiento": "2007-10-02",
    "source": "fc26"
  },
  "wc_marruecos|Noussair Mazraoui": {
    "overall": 80,
    "nationality": "Morocco",
    "dorsal": 3,
    "age": 27,
    "fechaNacimiento": "1997-11-14",
    "source": "fc26"
  },
  "wc_marruecos|Sofyan Amrabat": {
    "overall": 78,
    "nationality": "Morocco",
    "dorsal": 14,
    "age": 28,
    "fechaNacimiento": "1996-08-21",
    "source": "fc26"
  },
  "wc_senegal|Sadio Mané": {
    "overall": 83,
    "nationality": "Senegal",
    "dorsal": 10,
    "age": 33,
    "fechaNacimiento": "1992-04-10",
    "source": "fc26"
  },
  "wc_senegal|Kalidou Koulibaly": {
    "overall": 82,
    "nationality": "Senegal",
    "dorsal": 3,
    "age": 34,
    "fechaNacimiento": "1991-06-20",
    "source": "fc26"
  },
  "wc_senegal|Nicolas Jackson": {
    "overall": 80,
    "nationality": "Senegal",
    "dorsal": 11,
    "age": 24,
    "fechaNacimiento": "2001-06-20",
    "source": "fc26"
  },
  "wc_senegal|Ismaïla Sarr": {
    "overall": 79,
    "nationality": "Senegal",
    "dorsal": 7,
    "age": 27,
    "fechaNacimiento": "1998-02-25",
    "source": "fc26"
  },
  "wc_senegal|Iliman Ndiaye": {
    "overall": 79,
    "nationality": "Senegal",
    "dorsal": 10,
    "age": 25,
    "fechaNacimiento": "2000-03-06",
    "source": "fc26"
  },
  "wc_sudafrica|Lyle Foster": {
    "overall": 72,
    "nationality": "South Africa",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-09-03",
    "source": "fc26"
  },
  "wc_sudafrica|Themba Zwane": {
    "overall": 75,
    "dorsal": 18,
    "source": "latamfc26"
  },
  "wc_sudafrica|Ronwen Williams": {
    "overall": 73,
    "dorsal": 30,
    "source": "latamfc26"
  },
  "wc_sudafrica|Teboho Mokoena": {
    "overall": 70,
    "dorsal": 4,
    "source": "latamfc26"
  },
  "wc_sudafrica|Relebohile Mofokeng": {
    "overall": 65,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "wc_tunez|Hannibal Mejbri": {
    "overall": 75,
    "dorsal": 10,
    "source": "latamfc26"
  },
  "wc_tunez|Ellyes Skhiri": {
    "overall": 80,
    "nationality": "Tunisia",
    "dorsal": 15,
    "age": 30,
    "fechaNacimiento": "1995-05-10",
    "source": "fc26"
  },
  "wc_tunez|Montassar Talbi": {
    "overall": 73,
    "nationality": "Tunisia",
    "dorsal": 3,
    "age": 27,
    "fechaNacimiento": "1998-05-26",
    "source": "fc26"
  },
  "wc_tunez|Ali Abdi": {
    "overall": 76,
    "nationality": "Tunisia",
    "dorsal": 2,
    "age": 31,
    "fechaNacimiento": "1993-12-20",
    "source": "fc26"
  },
  "wc_tunez|Anis Ben Slimane": {
    "overall": 68,
    "dorsal": 25,
    "source": "latamfc26"
  },
  "wc_austria|David Alaba": {
    "overall": 82,
    "nationality": "Austria",
    "dorsal": 4,
    "age": 33,
    "fechaNacimiento": "1992-06-24",
    "source": "fc26"
  },
  "wc_austria|Konrad Laimer": {
    "overall": 82,
    "nationality": "Austria",
    "dorsal": 27,
    "age": 28,
    "fechaNacimiento": "1997-05-27",
    "source": "fc26"
  },
  "wc_austria|Kevin Danso": {
    "overall": 79,
    "nationality": "Austria",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1998-09-19",
    "source": "fc26"
  },
  "wc_austria|Nicolas Seiwald": {
    "overall": 77,
    "nationality": "Austria",
    "dorsal": 13,
    "age": 24,
    "fechaNacimiento": "2001-05-04",
    "source": "fc26"
  },
  "wc_austria|Patrick Wimmer": {
    "overall": 77,
    "nationality": "Austria",
    "dorsal": 39,
    "age": 24,
    "fechaNacimiento": "2001-05-30",
    "source": "fc26"
  },
  "wc_belgica|Jérémy Doku": {
    "overall": 80,
    "nationality": "Belgium",
    "dorsal": 11,
    "age": 23,
    "fechaNacimiento": "2002-05-27",
    "source": "fc26"
  },
  "wc_belgica|Kevin De Bruyne": {
    "overall": 87,
    "nationality": "Belgium",
    "dorsal": 11,
    "age": 34,
    "fechaNacimiento": "1991-06-28",
    "source": "fc26"
  },
  "wc_belgica|Romelu Lukaku": {
    "overall": 84,
    "nationality": "Belgium",
    "dorsal": 9,
    "age": 32,
    "fechaNacimiento": "1993-05-13",
    "source": "fc26"
  },
  "wc_belgica|Amadou Onana": {
    "overall": 79,
    "nationality": "Belgium",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2001-08-16",
    "source": "fc26"
  },
  "wc_belgica|Youri Tielemans": {
    "overall": 85,
    "nationality": "Belgium",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1997-05-07",
    "source": "fc26"
  },
  "wc_bosnia|Edin Džeko": {
    "overall": 81,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 9,
    "age": 39,
    "fechaNacimiento": "1986-03-17",
    "source": "fc26"
  },
  "wc_bosnia|Ermedin Demirović": {
    "overall": 80,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 9,
    "age": 27,
    "fechaNacimiento": "1998-03-25",
    "source": "fc26"
  },
  "wc_bosnia|Sead Kolašinac": {
    "overall": 79,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 23,
    "age": 32,
    "fechaNacimiento": "1993-06-20",
    "source": "fc26"
  },
  "wc_bosnia|Amar Dedić": {
    "overall": 74,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 17,
    "age": 22,
    "fechaNacimiento": "2002-08-18",
    "source": "fc26"
  },
  "wc_bosnia|Esmir Bajraktarević": {
    "overall": 67,
    "nationality": "Bosnia and Herzegovina",
    "dorsal": 19,
    "age": 20,
    "fechaNacimiento": "2005-03-10",
    "source": "fc26"
  },
  "wc_croacia|Luka Modrić": {
    "overall": 83,
    "nationality": "Croatia",
    "dorsal": 14,
    "age": 39,
    "fechaNacimiento": "1985-09-09",
    "source": "fc26"
  },
  "wc_croacia|Josko Gvardiol": {
    "overall": 84,
    "nationality": "Croatia",
    "dorsal": 24,
    "age": 23,
    "fechaNacimiento": "2002-01-23",
    "source": "fc26"
  },
  "wc_croacia|Martin Baturina": {
    "overall": 78,
    "nationality": "Croatia",
    "dorsal": 20,
    "age": 22,
    "fechaNacimiento": "2003-02-16",
    "source": "fc26"
  },
  "wc_croacia|Petar Sučić": {
    "overall": 74,
    "nationality": "Croatia",
    "dorsal": 8,
    "age": 21,
    "fechaNacimiento": "2003-10-25",
    "source": "fc26"
  },
  "wc_croacia|Ivan Perišić": {
    "overall": 81,
    "nationality": "Croatia",
    "dorsal": 5,
    "age": 36,
    "fechaNacimiento": "1989-02-02",
    "source": "fc26"
  },
  "wc_chequia|Tomáš Souček": {
    "overall": 78,
    "nationality": "Czechia",
    "dorsal": 28,
    "age": 30,
    "fechaNacimiento": "1995-02-27",
    "source": "fc26"
  },
  "wc_chequia|Patrik Schick": {
    "overall": 85,
    "nationality": "Czechia",
    "dorsal": 14,
    "age": 29,
    "fechaNacimiento": "1996-01-24",
    "source": "fc26"
  },
  "wc_chequia|Ladislav Krejčí": {
    "overall": 78,
    "nationality": "Czechia",
    "dorsal": 37,
    "age": 26,
    "fechaNacimiento": "1999-04-20",
    "source": "fc26"
  },
  "wc_chequia|Pavel Šulc": {
    "overall": 77,
    "nationality": "Czechia",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2000-12-29",
    "source": "fc26"
  },
  "wc_chequia|Adam Hložek": {
    "overall": 77,
    "nationality": "Czechia",
    "dorsal": 23,
    "age": 22,
    "fechaNacimiento": "2002-07-25",
    "source": "fc26"
  },
  "wc_inglaterra|Jude Bellingham": {
    "overall": 90,
    "nationality": "England",
    "dorsal": 5,
    "age": 22,
    "fechaNacimiento": "2003-06-29",
    "source": "fc26"
  },
  "wc_inglaterra|Bukayo Saka": {
    "overall": 88,
    "nationality": "England",
    "dorsal": 7,
    "age": 23,
    "fechaNacimiento": "2001-09-05",
    "source": "fc26"
  },
  "wc_inglaterra|Harry Kane": {
    "overall": 89,
    "nationality": "England",
    "dorsal": 9,
    "age": 31,
    "fechaNacimiento": "1993-07-28",
    "source": "fc26"
  },
  "wc_inglaterra|Declan Rice": {
    "overall": 87,
    "nationality": "England",
    "dorsal": 41,
    "age": 26,
    "fechaNacimiento": "1999-01-14",
    "source": "fc26"
  },
  "wc_inglaterra|Reece James": {
    "overall": 81,
    "nationality": "England",
    "dorsal": 24,
    "age": 25,
    "fechaNacimiento": "1999-12-08",
    "source": "fc26"
  },
  "wc_francia|Kylian Mbappé": {
    "overall": 91,
    "nationality": "France",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1998-12-20",
    "source": "fc26"
  },
  "wc_francia|Ousmane Dembélé": {
    "overall": 90,
    "dorsal": 7,
    "source": "latamfc26"
  },
  "wc_francia|Michael Olise": {
    "overall": 86,
    "nationality": "France",
    "dorsal": 17,
    "age": 23,
    "fechaNacimiento": "2001-12-12",
    "source": "fc26"
  },
  "wc_francia|William Saliba": {
    "overall": 87,
    "nationality": "France",
    "dorsal": 2,
    "age": 24,
    "fechaNacimiento": "2001-03-24",
    "source": "fc26"
  },
  "wc_francia|Aurélien Tchouaméni": {
    "overall": 84,
    "nationality": "France",
    "dorsal": 14,
    "age": 25,
    "fechaNacimiento": "2000-01-27",
    "source": "fc26"
  },
  "wc_holanda|Virgil van Dijk": {
    "overall": 90,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 33,
    "fechaNacimiento": "1991-07-08",
    "source": "fc26"
  },
  "wc_holanda|Ryan Gravenberch": {
    "overall": 85,
    "nationality": "Netherlands",
    "dorsal": 38,
    "age": 23,
    "fechaNacimiento": "2002-05-16",
    "source": "fc26"
  },
  "wc_holanda|Cody Gakpo": {
    "overall": 84,
    "nationality": "Netherlands",
    "dorsal": 18,
    "age": 26,
    "fechaNacimiento": "1999-05-07",
    "source": "fc26"
  },
  "wc_holanda|Frenkie de Jong": {
    "overall": 87,
    "nationality": "Netherlands",
    "dorsal": 21,
    "age": 28,
    "fechaNacimiento": "1997-05-12",
    "source": "fc26"
  },
  "wc_holanda|Tijjani Reijnders": {
    "overall": 86,
    "nationality": "Netherlands",
    "dorsal": 4,
    "age": 26,
    "fechaNacimiento": "1998-07-29",
    "source": "fc26"
  },
  "wc_noruega|Erling Haaland": {
    "overall": 90,
    "nationality": "Norway",
    "dorsal": 9,
    "age": 24,
    "fechaNacimiento": "2000-07-21",
    "source": "fc26"
  },
  "wc_noruega|Martin Ødegaard": {
    "overall": 87,
    "nationality": "Norway",
    "dorsal": 8,
    "age": 26,
    "fechaNacimiento": "1998-12-17",
    "source": "fc26"
  },
  "wc_noruega|Antonio Nusa": {
    "overall": 76,
    "nationality": "Norway",
    "dorsal": 7,
    "age": 20,
    "fechaNacimiento": "2005-04-17",
    "source": "fc26"
  },
  "wc_noruega|Andreas Schjelderup": {
    "overall": 75,
    "nationality": "Norway",
    "dorsal": 21,
    "age": 21,
    "fechaNacimiento": "2004-06-01",
    "source": "fc26"
  },
  "wc_noruega|Jørgen Strand Larsen": {
    "overall": 78,
    "nationality": "Norway",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "2000-02-06",
    "source": "fc26"
  },
  "wc_portugal|Cristiano Ronaldo": {
    "overall": 85,
    "nationality": "Portugal",
    "dorsal": 7,
    "age": 40,
    "fechaNacimiento": "1985-02-05",
    "source": "fc26"
  },
  "wc_portugal|Bruno Fernandes": {
    "overall": 87,
    "nationality": "Portugal",
    "dorsal": 8,
    "age": 30,
    "fechaNacimiento": "1994-09-08",
    "source": "fc26"
  },
  "wc_portugal|Vitinha": {
    "overall": 89,
    "nationality": "Portugal",
    "dorsal": 17,
    "age": 25,
    "fechaNacimiento": "2000-02-13",
    "source": "fc26"
  },
  "wc_portugal|João Neves": {
    "overall": 85,
    "nationality": "Portugal",
    "dorsal": 87,
    "age": 20,
    "fechaNacimiento": "2004-09-27",
    "source": "fc26"
  },
  "wc_portugal|Rafael Leão": {
    "overall": 84,
    "nationality": "Portugal",
    "dorsal": 10,
    "age": 26,
    "fechaNacimiento": "1999-06-10",
    "source": "fc26"
  },
  "wc_escocia|Scott McTominay": {
    "overall": 85,
    "nationality": "Scotland",
    "dorsal": 8,
    "age": 28,
    "fechaNacimiento": "1996-12-08",
    "source": "fc26"
  },
  "wc_escocia|John McGinn": {
    "overall": 81,
    "nationality": "Scotland",
    "dorsal": 7,
    "age": 30,
    "fechaNacimiento": "1994-10-18",
    "source": "fc26"
  },
  "wc_escocia|Kieran Tierney": {
    "overall": 77,
    "nationality": "Scotland",
    "dorsal": 63,
    "age": 28,
    "fechaNacimiento": "1997-06-05",
    "source": "fc26"
  },
  "wc_escocia|Lewis Ferguson": {
    "overall": 78,
    "nationality": "Scotland",
    "dorsal": 19,
    "age": 25,
    "fechaNacimiento": "1999-08-24",
    "source": "fc26"
  },
  "wc_espana|Lamine Yamal": {
    "overall": 89,
    "nationality": "Spain",
    "dorsal": 10,
    "age": 17,
    "fechaNacimiento": "2007-07-13",
    "source": "fc26"
  },
  "wc_espana|Pedri": {
    "overall": 89,
    "nationality": "Spain",
    "dorsal": 8,
    "age": 22,
    "fechaNacimiento": "2002-11-25",
    "source": "fc26"
  },
  "wc_espana|Rodri": {
    "overall": 90,
    "nationality": "Spain",
    "dorsal": 16,
    "age": 29,
    "fechaNacimiento": "1996-06-22",
    "source": "fc26"
  },
  "wc_espana|Ferran Torres": {
    "overall": 83,
    "nationality": "Spain",
    "dorsal": 7,
    "age": 25,
    "fechaNacimiento": "2000-02-29",
    "source": "fc26"
  },
  "wc_suecia|Alexander Isak": {
    "overall": 88,
    "nationality": "Sweden",
    "dorsal": 9,
    "age": 25,
    "fechaNacimiento": "1999-09-21",
    "source": "fc26"
  },
  "wc_suecia|Viktor Gyökeres": {
    "overall": 87,
    "nationality": "Sweden",
    "dorsal": 14,
    "age": 27,
    "fechaNacimiento": "1998-06-04",
    "source": "fc26"
  },
  "wc_suecia|Anthony Elanga": {
    "overall": 81,
    "nationality": "Sweden",
    "dorsal": 20,
    "age": 23,
    "fechaNacimiento": "2002-04-27",
    "source": "fc26"
  },
  "wc_suecia|Lucas Bergvall": {
    "overall": 77,
    "nationality": "Sweden",
    "dorsal": 15,
    "age": 19,
    "fechaNacimiento": "2006-02-02",
    "source": "fc26"
  },
  "wc_suecia|Yasin Ayari": {
    "overall": 75,
    "nationality": "Sweden",
    "dorsal": 26,
    "age": 21,
    "fechaNacimiento": "2003-10-06",
    "source": "fc26"
  },
  "wc_suiza|Granit Xhaka": {
    "overall": 85,
    "nationality": "Switzerland",
    "dorsal": 34,
    "age": 32,
    "fechaNacimiento": "1992-09-27",
    "source": "fc26"
  },
  "wc_suiza|Gregor Kobel": {
    "overall": 86,
    "nationality": "Switzerland",
    "dorsal": 1,
    "age": 27,
    "fechaNacimiento": "1997-12-06",
    "source": "fc26"
  },
  "wc_suiza|Dan Ndoye": {
    "overall": 79,
    "nationality": "Switzerland",
    "dorsal": 14,
    "age": 24,
    "fechaNacimiento": "2000-10-25",
    "source": "fc26"
  },
  "wc_suiza|Denis Zakaria": {
    "overall": 82,
    "nationality": "Switzerland",
    "dorsal": 6,
    "age": 28,
    "fechaNacimiento": "1996-11-20",
    "source": "fc26"
  },
  "wc_suiza|Ardon Jashari": {
    "overall": 77,
    "nationality": "Switzerland",
    "dorsal": 30,
    "age": 22,
    "fechaNacimiento": "2002-07-30",
    "source": "fc26"
  },
  "wc_turquia|Arda Güler": {
    "overall": 81,
    "nationality": "Türkiye",
    "dorsal": 15,
    "age": 20,
    "fechaNacimiento": "2005-02-25",
    "source": "fc26"
  },
  "wc_turquia|Kenan Yıldız": {
    "overall": 79,
    "nationality": "Türkiye",
    "dorsal": 10,
    "age": 20,
    "fechaNacimiento": "2005-05-04",
    "source": "fc26"
  },
  "wc_turquia|Hakan Çalhanoğlu": {
    "overall": 86,
    "nationality": "Türkiye",
    "dorsal": 20,
    "age": 31,
    "fechaNacimiento": "1994-02-08",
    "source": "fc26"
  },
  "wc_turquia|Barış Alper Yılmaz": {
    "overall": 80,
    "nationality": "Türkiye",
    "dorsal": 53,
    "age": 25,
    "fechaNacimiento": "2000-05-23",
    "source": "fc26"
  },
  "wc_turquia|Orkun Kökçü": {
    "overall": 82,
    "nationality": "Türkiye",
    "dorsal": 10,
    "age": 24,
    "fechaNacimiento": "2000-12-29",
    "source": "fc26"
  }
};
