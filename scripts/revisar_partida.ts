// Lee una partida EXPORTADA desde el juego y dice qué está pasando en ella.
//
//   npm run revisar -- C:\ruta\futstarzz-Camilo-T3.json
//   npm run revisar -- partida.json 40      (además, los 40 pasos alrededor del actual)
//
// El archivo sale de la pantalla de inicio del juego, en la ranura ("Exportar partida"). Lleva el
// perfil entero: el paso de carrera, los cuadros de todas las copas, las tablas y el historial de
// resultados. Y como el calendario es una función PURA del nombre del club -- las mismas fechas
// siempre, sin azar ni estado guardado --, con eso alcanza para reconstruir exactamente lo que el
// juego decide en cada día de esa carrera.
//
// Sirve para el reporte que el jugador no puede escribir: "el paso 33 tomó la rama de liga cuando
// el calendario decía cuadrangular" es algo que se ve acá y no jugando.
//
// La foto del estado la arma src/reporteDeBug.ts, el MISMO módulo que usa el botón de adentro del
// juego. Dos versiones del mismo informe terminarían contradiciéndose.

import { readFileSync } from 'node:fs';
import { CLUBS_DATABASE } from '../src/data';
import { armarReporteDeBug } from '../src/reporteDeBug';
import {
  fixturesAtStep, hasDatedLeagueSchedule, pickPrimary, temporadaDeCarrera, torneoDelClubEnFecha,
} from '../src/dateSchedule';
import type { PlayerProfile } from '../src/types';

const ruta = process.argv[2];
if (!ruta) {
  console.error('Falta el archivo.  Uso: npm run revisar -- partida.json [cuantosPasos]');
  process.exit(1);
}

// Se acepta tanto el archivo exportado (con su envoltorio) como un perfil suelto: si alguien pega
// el contenido de localStorage a mano, tiene que funcionar igual.
const crudo = JSON.parse(readFileSync(ruta, 'utf8'));
const perfil: PlayerProfile = crudo.perfil ?? crudo.profile ?? crudo;
if (!perfil?.currentClubId) {
  console.error('El archivo no parece una partida de Fut Starzz: no tiene perfil con club.');
  process.exit(1);
}

console.log(armarReporteDeBug(perfil, CLUBS_DATABASE));

// --- EL CALENDARIO ALREDEDOR DEL PASO ACTUAL --------------------------------------------------
//
// Es la parte que no se puede mirar desde adentro del juego: qué venía antes y qué viene después.
// La mayoría de los bugs de calendario se ven acá de un vistazo -- una ronda que no tiene su vuelta,
// un día de copa que le toca a dos torneos, un cuadrangular partido entre dos semestres.
const VENTANA = Number(process.argv[3] ?? 24);
const club = CLUBS_DATABASE.find(c => c.id === perfil.currentClubId);

if (club && hasDatedLeagueSchedule(club.name) && VENTANA > 0) {
  console.log(`\n--- CALENDARIO: ${VENTANA} PASOS ALREDEDOR DEL ACTUAL ---`);
  console.log('(el paso actual va marcado con >>)\n');
  const desde = Math.max(1, perfil.currentWeek - Math.floor(VENTANA / 2));
  for (let paso = desde; paso < desde + VENTANA; paso++) {
    const hoy = fixturesAtStep(club.name, paso);
    if (!hoy) { console.log(`${paso === perfil.currentWeek ? '>>' : '  '} paso ${String(paso).padStart(3)}  (sin calendario: se agotó)`); continue; }
    const fx = pickPrimary(hoy.fixtures);
    if (!fx) continue;
    const marcas = [
      fx.esReservaDeCuadro ? 'RESERVADA' : null,
      fx.esPlayoff ? 'CUADRANGULAR' : null,
      hoy.fixtures.length > 1 ? `+${hoy.fixtures.length - 1} el mismo día` : null,
    ].filter(Boolean).join(' · ');
    const torneo = torneoDelClubEnFecha(club.name, hoy.date);
    console.log(
      `${paso === perfil.currentWeek ? '>>' : '  '} paso ${String(paso).padStart(3)}` +
      `  ${hoy.date}  T${temporadaDeCarrera(club.name, paso)}` +
      `  ${fx.competition.kind.padEnd(19)} ${(torneo ?? fx.competition.name).padEnd(24)}` +
      ` vs ${fx.opponentName}${marcas ? `  [${marcas}]` : ''}`,
    );
  }
}

console.log('\nPegá todo esto en el chat, junto con qué esperabas que pasara.');
