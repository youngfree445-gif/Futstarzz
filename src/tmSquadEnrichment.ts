// Edad real (Transfermarkt) de los starPlayers de la liga colombiana.
//
// Generado por scripts/scrape_kader_tm.mjs, que baja el plantel completo desde
// /kader/verein/<id> de 29 clubes colombianos (los 20 de la Dimayor I mas 10 de
// la B/Torneo), y despues cruza por nombre contra los starPlayers de
// ULTIMATE_CLUBS_DATABASE.
//
// Clave: "clubId|nombreTalCualEnStarPlayers" -- mismo formato que
// PLAYER_ENRICHMENT (ver playerEnrichment.ts), para consultarse con la misma
// llave. Cubre 155 de 238 starPlayers colombianos (65%).
//
// PURAMENTE ADITIVO: no reescribe ULTIMATE_CLUBS_DATABASE ni toca los escudos.
// Los starPlayers de data.ts quedan exactamente como estaban.
//
// Sobre la fiabilidad del cruce (asignar la edad de otra persona es peor que
// quedarse sin edad):
//  - Se exige que coincidan nombre de pila Y apellido. Solo el apellido cruza
//    personas distintas ("Luis Diaz" vs "Yesid Diaz", "Adrian Parra" vs "Neider
//    Parra"); un token cualquiera es peor aun ("Pedro Franco" cazaba con
//    "Franco Armani").
//  - Un mismo tmId no puede quedar asignado a dos starPlayers: es una persona
//    real y no puede ser dos jugadores a la vez.
//  - Los ids de club se resuelven con el buscador de Transfermarkt y luego se
//    VERIFICAN contra el nombre que declara la propia pagina del club. El
//    buscador devuelve resultados difusos (buscar "Bogota FC" devolvia
//    Millonarios primero; "Real Cundinamarca", Valledupar) y hay homonimos de
//    otros paises (existen un Leones FC y un Tigres FC no colombianos).
//  - currentClubName aparece solo si Transfermarkt dice que el jugador hoy
//    juega en otro club (29 de 155): los planteles de data.ts son de una
//    temporada anterior. Es informativo y NADIE lo consume todavia -- no mueve
//    a nadie de equipo.

export interface TmSquadData {
  age: number;
  tmId: string;
  tmName: string;
  tmPosition?: string;
  currentClubName?: string;
}

export const TM_SQUAD_ENRICHMENT: Record<string, TmSquadData> = {
  'aguilas|Andrés Ricaurte (CM)': { age: 34, tmId: '253846', tmName: 'Andrés Ricaurte', tmPosition: 'Mediocentro' },
  'aguilas|Dylan Lozano (RB)': { age: 24, tmId: '950839', tmName: 'Dylan Lozano', tmPosition: 'Lateral derecho' },
  'aguilas|Frank Lozano (CDM)': { age: 32, tmId: '262931', tmName: 'Frank Lozano', tmPosition: 'Pivote' },
  'aguilas|Jaen Carlos Pineda (CM)': { age: 28, tmId: '460693', tmName: 'Jaen Pineda', tmPosition: 'Mediocentro', currentClubName: 'Real Cartagena' },
  'aguilas|Joaquín Varela (CB)': { age: 28, tmId: '421194', tmName: 'Joaquín Varela', tmPosition: 'Defensa central', currentClubName: 'Independiente Medellín' },
  'aguilas|John García (CB)': { age: 37, tmId: '356360', tmName: 'John García', tmPosition: 'Defensa central' },
  'aguilas|Jorge Obregón (ST)': { age: 29, tmId: '414773', tmName: 'Jorge Obregón', tmPosition: 'Delantero centro', currentClubName: 'Deportivo Pasto' },
  'alianza_fc|Andrés Rentería': { age: 33, tmId: '233007', tmName: 'Andrés Rentería', tmPosition: 'Delantero centro', currentClubName: 'Jaguares de Córdoba' },
  'alianza_fc|Mayer Gil': { age: 22, tmId: '827285', tmName: 'Mayer Gil', tmPosition: 'Extremo izquierdo', currentClubName: 'Deportivo Pasto' },
  'alianza_fc|Pedro Franco': { age: 35, tmId: '118998', tmName: 'Pedro Franco', tmPosition: 'Defensa central' },
  'america_cali|Adrián Ramos (ST)': { age: 40, tmId: '73782', tmName: 'Adrián Ramos', tmPosition: 'Delantero centro' },
  'america_cali|Brayan Córdoba (CB)': { age: 26, tmId: '585356', tmName: 'Brayan Córdoba', tmPosition: 'Defensa central' },
  'america_cali|Dany Rosero (CB)': { age: 32, tmId: '283399', tmName: 'Dany Rosero', tmPosition: 'Defensa central' },
  'america_cali|Jean (GK)': { age: 30, tmId: '371231', tmName: 'Jean', tmPosition: 'Portero' },
  'america_cali|Jhon Murillo (RW)': { age: 30, tmId: '308560', tmName: 'Jhon Murillo', tmPosition: 'Extremo derecho' },
  'america_cali|Luis Quiñones (ST)': { age: 35, tmId: '227404', tmName: 'Luis Quiñónes', tmPosition: 'Extremo derecho' },
  'america_cali|Marlon Torres (CB)': { age: 30, tmId: '485731', tmName: 'Marlon Torres', tmPosition: 'Defensa central' },
  'america_cali|Rafael Carrascal (CM)': { age: 33, tmId: '260385', tmName: 'Rafael Carrascal', tmPosition: 'Mediocentro' },
  'america_cali|Yani Quintero (CM)': { age: 24, tmId: '655335', tmName: 'Yani Quintero', tmPosition: 'Pivote' },
  'america_cali|Yeison Guzmán (CAM)': { age: 28, tmId: '498687', tmName: 'Yeison Guzmán', tmPosition: 'Mediocentro ofensivo' },
  'barranquilla_fc|Carlos Cantillo (CM)': { age: 23, tmId: '906651', tmName: 'Carlos Cantillo', tmPosition: 'Mediocentro', currentClubName: 'Jaguares de Córdoba' },
  'barranquilla_fc|Cristian Peñate (ST)': { age: 21, tmId: '1110702', tmName: 'Cristian Peñate' },
  'barranquilla_fc|Jhon Cortez (LB)': { age: 20, tmId: '1289824', tmName: 'Jhon Cortez', tmPosition: 'Lateral izquierdo' },
  'barranquilla_fc|José Caicedo (CB)': { age: 25, tmId: '908349', tmName: 'José Caicedo', tmPosition: 'Defensa central' },
  'barranquilla_fc|Juan Lemus (GK)': { age: 27, tmId: '588983', tmName: 'Juan Lemus', tmPosition: 'Portero' },
  'barranquilla_fc|Marlon Carabali (RW)': { age: 23, tmId: '942666', tmName: 'Marlon Carabalí', tmPosition: 'Extremo derecho', currentClubName: 'Cúcuta Deportivo' },
  'barranquilla_fc|Miguel Agamez (CM)': { age: 17, tmId: '1285379', tmName: 'Miguel Agámez', tmPosition: 'Mediocentro' },
  'barranquilla_fc|Miller Bacca (ST)': { age: 22, tmId: '1124476', tmName: 'Miller Bacca', tmPosition: 'Delantero centro' },
  'barranquilla_fc|Sebastián Guerra (GK)': { age: 25, tmId: '567016', tmName: 'Sebastián Guerra', tmPosition: 'Portero' },
  'barranquilla_fc|Yeferson Moreno (RB)': { age: 22, tmId: '1040937', tmName: 'Yeferson Moreno', tmPosition: 'Lateral derecho' },
  'bogota_fc|Andrés Buelvas (ST)': { age: 25, tmId: '1460233', tmName: 'Andrés Buelvas' },
  'bogota_fc|Brayan Castro (RW)': { age: 24, tmId: '1116430', tmName: 'Brayan Castro', tmPosition: 'Extremo derecho' },
  'bogota_fc|Cristián Mosquera (RB)': { age: 25, tmId: '659709', tmName: 'Cristian Mosquera', tmPosition: 'Lateral derecho' },
  'bogota_fc|Diego Castillo (ST)': { age: 26, tmId: '911913', tmName: 'Diego Castillo', tmPosition: 'Extremo izquierdo', currentClubName: 'Real Cartagena' },
  'bogota_fc|Harold Sandoval Lasso (ST)': { age: 24, tmId: '1101847', tmName: 'Harold Sandoval Lasso', tmPosition: 'Extremo derecho' },
  'bogota_fc|Juan Camilo Moreno (LB)': { age: 24, tmId: '671964', tmName: 'Juan Camilo Moreno', tmPosition: 'Lateral izquierdo' },
  'bogota_fc|Juan Martínez (LW)': { age: 24, tmId: '908381', tmName: 'Juan Martínez', tmPosition: 'Extremo izquierdo' },
  'bogota_fc|Kevin Castro (CDM)': { age: 27, tmId: '650828', tmName: 'Kevin Castro', tmPosition: 'Pivote' },
  'bogota_fc|Mauricio Medina (RB)': { age: 21, tmId: '1232888', tmName: 'Mauricio Medina', tmPosition: 'Lateral derecho' },
  'bogota_fc|Ronaldo Tavera (CDM)': { age: 31, tmId: '413554', tmName: 'Ronaldo Tavera', tmPosition: 'Pivote' },
  'bogota_fc|Santiago Ruiz (CB)': { age: 21, tmId: '1371707', tmName: 'Santiago Ruiz' },
  'boyaca_chico|Andrés Aedo (CDM)': { age: 22, tmId: '1074923', tmName: 'Andrés Aedo', tmPosition: 'Pivote' },
  'boyaca_chico|Arlen Banguero (CB)': { age: 26, tmId: '1118342', tmName: 'Arlen Banguero', tmPosition: 'Defensa central' },
  'boyaca_chico|Delio Ramírez (CM)': { age: 25, tmId: '751990', tmName: 'Delio Ramírez', tmPosition: 'Mediocentro' },
  'boyaca_chico|Juan Carlos Díaz (CDM)': { age: 25, tmId: '632290', tmName: 'Juan Díaz', tmPosition: 'Pivote' },
  'boyaca_chico|Rogerio Caicedo (GK)': { age: 32, tmId: '600616', tmName: 'Rogerio Caicedo', tmPosition: 'Portero' },
  'boyaca_chico|Sebastián Palma (CB)': { age: 27, tmId: '572041', tmName: 'Sebastián Palma', tmPosition: 'Defensa central' },
  'boyaca_chico|Sebastián Salazar (CM)': { age: 30, tmId: '355155', tmName: 'Sebastián Salazar', tmPosition: 'Mediocentro' },
  'boyaca_chico|Yaliston Martínez (LB)': { age: 26, tmId: '911027', tmName: 'Yaliston Martínez', tmPosition: 'Lateral izquierdo' },
  'boyaca_chico|Yesús Cabrera (CAM)': { age: 35, tmId: '133522', tmName: 'Yesús Cabrera', tmPosition: 'Mediocentro ofensivo' },
  'bucaramanga|Jefferson Mena': { age: 37, tmId: '189390', tmName: 'Jefferson Mena', tmPosition: 'Defensa central', currentClubName: 'Boyacá Chicó' },
  'bucaramanga|Joider Micolta': { age: 24, tmId: '975151', tmName: 'Joider Micolta', tmPosition: 'Extremo izquierdo', currentClubName: 'Deportivo Pasto' },
  'cali|Alejandro Rodríguez (GK)': { age: 25, tmId: '892082', tmName: 'Alejandro Rodríguez', tmPosition: 'Portero' },
  'cali|Andrés Colorado (CDM)': { age: 27, tmId: '648309', tmName: 'Andrés Colorado', tmPosition: 'Pivote', currentClubName: 'Once Caldas' },
  'cali|Avilés Hurtado (LW)': { age: 39, tmId: '148713', tmName: 'Avilés Hurtado', tmPosition: 'Extremo izquierdo' },
  'cali|Emanuel Reynoso (CAM)': { age: 30, tmId: '439626', tmName: 'Emanuel Reynoso', tmPosition: 'Mediocentro ofensivo' },
  'cali|Fabián Viáfara (RB)': { age: 34, tmId: '326011', tmName: 'Fabián Viáfara', tmPosition: 'Lateral derecho' },
  'cali|Johan Martinez (LW)': { age: 24, tmId: '1053759', tmName: 'Johan Martínez', tmPosition: 'Extremo izquierdo' },
  'cali|Juan Dinenno (ST)': { age: 31, tmId: '288786', tmName: 'Juan Dinenno', tmPosition: 'Delantero centro' },
  'cali|Julián Quiñónes (CB)': { age: 36, tmId: '203138', tmName: 'Julián Quiñónes', tmPosition: 'Defensa central', currentClubName: 'Deportivo Pasto' },
  'cali|Pedro Gallese (GK)': { age: 36, tmId: '95172', tmName: 'Pedro Gallese', tmPosition: 'Portero' },
  'cartagena|Aldo Montes (GK)': { age: 26, tmId: '906759', tmName: 'Aldo Montes', tmPosition: 'Portero' },
  'cartagena|Andrés Escobar (LW)': { age: 29, tmId: '653452', tmName: 'Andrés Escobar', tmPosition: 'Extremo izquierdo' },
  'cartagena|Cristian Graciano (RB)': { age: 23, tmId: '1118337', tmName: 'Cristian Graciano', tmPosition: 'Lateral derecho' },
  'cartagena|Didier Pino (CDM)': { age: 30, tmId: '460897', tmName: 'Didier Pino', tmPosition: 'Pivote' },
  'cartagena|Fredy Montero (ST)': { age: 39, tmId: '73852', tmName: 'Fredy Montero', tmPosition: 'Delantero centro' },
  'cartagena|Jarlan Barrera (CAM)': { age: 30, tmId: '338219', tmName: 'Jarlan Barrera', tmPosition: 'Mediocentro ofensivo' },
  'cartagena|Juan Sebastian Herrera (RB)': { age: 25, tmId: '911963', tmName: 'Juan Herrera', tmPosition: 'Lateral derecho' },
  'cartagena|Luis Guevara (CM)': { age: 25, tmId: '1105567', tmName: 'Luis Guevara', tmPosition: 'Mediocentro' },
  'cartagena|Luis Yanes (LW)': { age: 19, tmId: '1157630', tmName: 'Luis Yanes', tmPosition: 'Extremo izquierdo' },
  'cartagena|Mauro Manotas (ST)': { age: 31, tmId: '325614', tmName: 'Mauro Manotas', tmPosition: 'Delantero centro' },
  'cartagena|Ronaldo Lora (CB)': { age: 29, tmId: '638277', tmName: 'Ronaldo Lora', tmPosition: 'Defensa central' },
  'cucuta|Frank Castañeda (RM)': { age: 32, tmId: '562483', tmName: 'Frank Castañeda', tmPosition: 'Extremo izquierdo', currentClubName: 'Llaneros FC' },
  'cucuta|Jhon Quiñones (CB)': { age: 22, tmId: '1139706', tmName: 'Jhon Alexander Quiñones', tmPosition: 'Defensa central' },
  'cucuta|Joao Abonia (RW)': { age: 26, tmId: '907797', tmName: 'Joao Abonia', tmPosition: 'Lateral derecho' },
  'cucuta|Juan Diego Ceballos (CM)': { age: 27, tmId: '653400', tmName: 'Juan Ceballos', tmPosition: 'Mediocentro' },
  'cucuta|Mauricio Duarte (LB)': { age: 34, tmId: '213469', tmName: 'Mauricio Duarte', tmPosition: 'Lateral izquierdo' },
  'cucuta|Omar Albornoz (LM)': { age: 30, tmId: '387605', tmName: 'Omar Albornoz', tmPosition: 'Extremo izquierdo', currentClubName: 'Atlético Bucaramanga' },
  'cucuta|Sebastián Rodríguez (CB)': { age: 25, tmId: '649878', tmName: 'Sebastián Rodríguez', tmPosition: 'Defensa central', currentClubName: 'Águilas Doradas' },
  'cucuta|Víctor Mejía (CM)': { age: 33, tmId: '287534', tmName: 'Víctor Mejía', tmPosition: 'Pivote' },
  'envigado_fc|Joan Parra': { age: 26, tmId: '610566', tmName: 'Joan Parra', tmPosition: 'Portero', currentClubName: 'Once Caldas' },
  'envigado_fc|Luis Díaz (Jr)': { age: 22, tmId: '926365', tmName: 'Luis Díaz', tmPosition: 'Extremo derecho' },
  'fortaleza_fc|Adrián Parra': { age: 29, tmId: '421011', tmName: 'Adrián Parra', tmPosition: 'Delantero centro', currentClubName: 'Deportes Tolima' },
  'fortaleza_fc|Nicolás Rodríguez': { age: 22, tmId: '938123', tmName: 'Nicolás Rodríguez', tmPosition: 'Extremo derecho', currentClubName: 'Atlético Nacional' },
  'fortaleza_fc|Sebastián Navarro': { age: 26, tmId: '745937', tmName: 'Sebastián Navarro', tmPosition: 'Mediocentro' },
  'jaguares|Kahiser Lenis': { age: 25, tmId: '900540', tmName: 'Kahiser Lenis', tmPosition: 'Extremo izquierdo' },
  'junior|Cristian Barrios': { age: 28, tmId: '587296', tmName: 'Cristian Barrios', tmPosition: 'Extremo derecho' },
  'junior|Francisco Fydriszewski': { age: 33, tmId: '337921', tmName: 'Francisco Fydriszewski', tmPosition: 'Delantero centro' },
  'junior|Luis Fernando Muriel': { age: 35, tmId: '119228', tmName: 'Luis Muriel', tmPosition: 'Delantero centro' },
  'junior|Mauro Silveira': { age: 26, tmId: '465682', tmName: 'Mauro Silveira', tmPosition: 'Portero' },
  'junior|Teófilo Gutiérrez': { age: 41, tmId: '77066', tmName: 'Teófilo Gutiérrez', tmPosition: 'Delantero centro' },
  'junior|Yimmi Chará': { age: 35, tmId: '165361', tmName: 'Yimmi Chará', tmPosition: 'Extremo derecho' },
  'llaneros_fc|Jhildrey Lasso': { age: 24, tmId: '911120', tmName: 'Jhildrey Lasso', tmPosition: 'Lateral izquierdo', currentClubName: 'Alianza FC' },
  'medellin|Agustín Martegani': { age: 26, tmId: '732507', tmName: 'Agustín Martegani', tmPosition: 'Mediocentro ofensivo' },
  'medellin|Jeison Medina': { age: 31, tmId: '570520', tmName: 'Jeison Medina', tmPosition: 'Delantero centro' },
  'medellin|Juan José Córdoba': { age: 23, tmId: '960057', tmName: 'Juan Córdoba', tmPosition: 'Extremo derecho' },
  'millonarios|Andrey Estupiñán': { age: 32, tmId: '583812', tmName: 'Andrey Estupiñán', tmPosition: 'Extremo izquierdo' },
  'millonarios|Daniel Ruiz': { age: 25, tmId: '650833', tmName: 'Daniel Ruiz', tmPosition: 'Extremo izquierdo' },
  'millonarios|James Aguirre': { age: 34, tmId: '332056', tmName: 'James Aguirre', tmPosition: 'Portero' },
  'nacional|Edwin Cardona': { age: 33, tmId: '119342', tmName: 'Edwin Cardona', tmPosition: 'Mediocentro ofensivo' },
  'nacional|Franco Armani': { age: 39, tmId: '119634', tmName: 'Franco Armani', tmPosition: 'Portero' },
  'nacional|William Tesillo': { age: 36, tmId: '137840', tmName: 'William Tesillo', tmPosition: 'Defensa central' },
  'once_caldas|Andrés Felipe Roa (CAM)': { age: 33, tmId: '304892', tmName: 'Andrés Roa', tmPosition: 'Mediocentro ofensivo' },
  'once_caldas|Dayro Moreno (ST)': { age: 40, tmId: '42457', tmName: 'Dayro Moreno', tmPosition: 'Delantero centro' },
  'once_caldas|Déinner Quiñones (RM)': { age: 30, tmId: '352566', tmName: 'Déinner Quiñones', tmPosition: 'Extremo derecho', currentClubName: 'Alianza FC' },
  'once_caldas|Iván Rojas (CDM)': { age: 29, tmId: '474677', tmName: 'Iván Rojas', tmPosition: 'Pivote', currentClubName: 'Águilas Doradas' },
  'once_caldas|Jaime Alvarado (CDM)': { age: 27, tmId: '522131', tmName: 'Jaime Alvarado', tmPosition: 'Pivote' },
  'once_caldas|Jeider Riquett (CB)': { age: 36, tmId: '462201', tmName: 'Jeider Riquett', tmPosition: 'Defensa central' },
  'once_caldas|Jorge Cardona (CB)': { age: 27, tmId: '628443', tmName: 'Jorge Cardona', tmPosition: 'Defensa central' },
  'once_caldas|Juan David Cuesta (RB)': { age: 28, tmId: '650822', tmName: 'Juan David Cuesta', tmPosition: 'Lateral derecho' },
  'once_caldas|Michael Barrios (RM)': { age: 35, tmId: '313286', tmName: 'Michael Barrios', tmPosition: 'Extremo derecho' },
  'pasto|Diego Chavez (CM)': { age: 28, tmId: '841184', tmName: 'Diego Chávez', tmPosition: 'Mediocentro' },
  'pasto|Fáiner Torijano (CB)': { age: 37, tmId: '136005', tmName: 'Fáiner Torijano', tmPosition: 'Defensa central' },
  'pasto|Geovanni Banguera (GK)': { age: 30, tmId: '413558', tmName: 'Geovanni Banguera', tmPosition: 'Portero' },
  'pasto|Nicolás Gil (CB)': { age: 29, tmId: '567347', tmName: 'Nicolás Gil', tmPosition: 'Defensa central' },
  'pasto|Santiago Córdoba (ST)': { age: 29, tmId: '670061', tmName: 'Santiago Córdoba', tmPosition: 'Delantero centro' },
  'pasto|Santiago Jiménez (RB)': { age: 28, tmId: '474678', tmName: 'Santiago Jiménez', tmPosition: 'Lateral derecho' },
  'pasto|Yéiler Góez (CM)': { age: 26, tmId: '585358', tmName: 'Yéiler Góez', tmPosition: 'Mediocentro' },
  'pereira|Darwin Quintero': { age: 38, tmId: '55666', tmName: 'Darwin Quintero', tmPosition: 'Mediocentro ofensivo', currentClubName: 'Millonarios FC' },
  'pereira|Jean Pestaña': { age: 28, tmId: '572076', tmName: 'Jean Carlos Pestaña', tmPosition: 'Defensa central', currentClubName: 'Junior de Barranquilla' },
  'pereira|Salvador Ichazo': { age: 34, tmId: '131098', tmName: 'Salvador Ichazo', tmPosition: 'Portero', currentClubName: 'Independiente Medellín' },
  'real_santander|Jaime Mora (GK)': { age: 29, tmId: '480680', tmName: 'Jaime Mora', tmPosition: 'Portero', currentClubName: 'Envigado FC' },
  'santafe|Fabián Sambueza': { age: 37, tmId: '358015', tmName: 'Fabián Sambueza', tmPosition: 'Mediocentro ofensivo', currentClubName: 'Atlético Bucaramanga' },
  'santafe|Franco Fagúndez': { age: 26, tmId: '929438', tmName: 'Franco Fagúndez', tmPosition: 'Mediapunta' },
  'santafe|Helibelton Palacios': { age: 33, tmId: '211389', tmName: 'Helibelton Palacios', tmPosition: 'Lateral derecho' },
  'santafe|Hugo Rodallega': { age: 41, tmId: '37934', tmName: 'Hugo Rodallega', tmPosition: 'Delantero centro' },
  'santafe|Kevin Balanta': { age: 29, tmId: '339758', tmName: 'Kevin Balanta', tmPosition: 'Defensa central' },
  'tigres_fc|Camilo Ibarra (RW)': { age: 23, tmId: '1065723', tmName: 'Camilo Ibarra', tmPosition: 'Extremo derecho' },
  'tigres_fc|Duván Viáfara (CB)': { age: 27, tmId: '655425', tmName: 'Duván Viáfara', tmPosition: 'Defensa central' },
  'tigres_fc|Ghilbert Parra (LB)': { age: 24, tmId: '1105281', tmName: 'Ghilbert Parra', tmPosition: 'Lateral izquierdo' },
  'tigres_fc|Jesús Cano (LB)': { age: 28, tmId: '651475', tmName: 'Jesús Cano', tmPosition: 'Lateral izquierdo' },
  'tigres_fc|Luis Mario Palacios (LM)': { age: 25, tmId: '977739', tmName: 'Luis Palacios', tmPosition: 'Lateral derecho', currentClubName: 'Independiente Santa Fe' },
  'tigres_fc|Matteo Frigerio (RW)': { age: 29, tmId: '850337', tmName: 'Matteo Frigerio', tmPosition: 'Extremo derecho' },
  'tigres_fc|Michael Mahecha (CM)': { age: 23, tmId: '1033121', tmName: 'Michael Mahecha', tmPosition: 'Mediocentro' },
  'tigres_fc|Orles Aragón (ST)': { age: 29, tmId: '572217', tmName: 'Orles Aragón', tmPosition: 'Delantero centro' },
  'tigres_fc|Ricardo Rosales (RB)': { age: 25, tmId: '885225', tmName: 'Ricardo Rosales', tmPosition: 'Lateral derecho' },
  'tigres_fc|Víctor Brid (GK)': { age: 25, tmId: '748802', tmName: 'Víctor Brid', tmPosition: 'Portero' },
  'tolima|Anderson Angulo (CB)': { age: 30, tmId: '570531', tmName: 'Anderson Angulo', tmPosition: 'Defensa central' },
  'tolima|Brayan Rovira (CDM)': { age: 29, tmId: '345656', tmName: 'Brayan Rovira', tmPosition: 'Pivote' },
  'tolima|Jader Valencia (ST)': { age: 26, tmId: '570165', tmName: 'Jader Valencia', tmPosition: 'Delantero centro' },
  'tolima|Jan Ángulo (CB)': { age: 25, tmId: '1034026', tmName: 'Jan Ángulo', tmPosition: 'Defensa central' },
  'tolima|Jherson Mosquera (RB)': { age: 26, tmId: '638623', tmName: 'Jherson Mosquera', tmPosition: 'Lateral derecho' },
  'tolima|Juan Nieto (CM)': { age: 33, tmId: '260391', tmName: 'Juan Pablo Nieto', tmPosition: 'Mediocentro', currentClubName: 'Once Caldas' },
  'tolima|Junior Hernández (LB)': { age: 27, tmId: '746579', tmName: 'Junior Hernández', tmPosition: 'Lateral izquierdo' },
  'tolima|Luis Sandoval (ST)': { age: 27, tmId: '569222', tmName: 'Luis Sandoval', tmPosition: 'Delantero centro' },
  'tolima|Neto Volpi (GK)': { age: 33, tmId: '202959', tmName: 'Neto Volpi', tmPosition: 'Portero' },
  'tolima|Sebastián Guzmán (CDM)': { age: 29, tmId: '580422', tmName: 'Sebastián Guzmán', tmPosition: 'Pivote' },
  'union_magdalena|Cristian Iguarán (ST)': { age: 21, tmId: '1258105', tmName: 'Cristian Iguarán' },
  'union_magdalena|Jimmy Congo (CDM)': { age: 28, tmId: '649794', tmName: 'Jimmy Congo', tmPosition: 'Pivote' },
  'union_magdalena|José Mercado (CM)': { age: 22, tmId: '1000701', tmName: 'José Mercado', tmPosition: 'Mediocentro' },
  'union_magdalena|José Palacios (RM)': { age: 29, tmId: '474620', tmName: 'José Palacios', tmPosition: 'Extremo izquierdo' },
  'union_magdalena|Juan Diego Giraldo (CM)': { age: 29, tmId: '474615', tmName: 'Juan Diego Giraldo', tmPosition: 'Mediocentro' },
  'union_magdalena|Juan Jose Vásquez (LB)': { age: 27, tmId: '904795', tmName: 'Juan Vásquez', tmPosition: 'Lateral izquierdo' },
  'union_magdalena|Misael Martínez (ST)': { age: 28, tmId: '657009', tmName: 'Misael Martínez', tmPosition: 'Delantero centro', currentClubName: 'Alianza FC' },
  'union_magdalena|Víctor Cabezas (GK)': { age: 28, tmId: '463398', tmName: 'Víctor Cabezas', tmPosition: 'Portero' },
};
