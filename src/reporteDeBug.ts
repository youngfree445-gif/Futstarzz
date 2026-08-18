// EL REPORTE DE BUG: una foto del estado de la partida, en texto, lista para pegar en un chat.
//
// ---------------------------------------------------------------------------------------------
// POR QUÉ ESTO Y NO UN SERVICIO DE ERRORES
// ---------------------------------------------------------------------------------------------
//
// Sentry, LogRocket y compañía capturan EXCEPCIONES: el JavaScript revienta y te llega el stack
// trace. Los bugs de este juego casi nunca son eso. El calendario apartó tres fechas en vez de seis,
// el cartel decía Libertadores y se jugaba Copa Colombia, el podio del Balón de Oro se recalculaba
// en cada carga: en los cuatro casos el juego no se cayó, hizo otra cosa. Un stack trace no habría
// dicho nada porque no hubo stack.
//
// Lo que hace falta para diagnosticar eso es el ESTADO: en qué paso está la carrera, qué dice el
// calendario de ese día, y cómo está cada cuadro. Con eso el bug se ubica en minutos; sin eso hay
// que reconstruirlo a partir de una frase.
//
// ---------------------------------------------------------------------------------------------
// TRES USOS, UNA SOLA FUNCIÓN
// ---------------------------------------------------------------------------------------------
//
//   1. El botón "Reportar bug" del Dashboard, para cuando algo se ve raro pero el juego sigue.
//   2. PantallaDeError, para cuando sí se cayó: al stack trace se le suma dónde estaba la carrera.
//   3. `npm run revisar partida.json`, para leer una partida exportada desde afuera del juego.
//
// Las tres tienen que decir LO MISMO. Por eso el reporte se arma acá una sola vez y no en cada
// pantalla: dos versiones del mismo informe terminarían contradiciéndose, que es exactamente el
// tipo de bug que este archivo existe para encontrar.
//
// ---------------------------------------------------------------------------------------------
// SE LEE, NO SE CALCULA
// ---------------------------------------------------------------------------------------------
//
// El reporte muestra lo que está GUARDADO en la partida, sin llamar a getOrCreateCupState ni a
// nada que adelante un torneo. Un informe que avanza el estado mientras lo mira deja de describir
// el bug y pasa a taparlo -- y además dejaría al jugador con una partida distinta por haber tocado
// un botón de diagnóstico. Lo único que se consulta afuera es el CALENDARIO, que es una función
// pura del nombre del club y no guarda nada.

import { Club, PlayerProfile, TwoLegTie } from './types';
import {
  anioDeCarrera, fechaDelPaso, fixturesAtStep, hasDatedLeagueSchedule,
  temporadaDeCarrera, torneoDelClubEnFecha,
} from './dateSchedule';
import { cruceActual, rondaActual, sigueEnCopa } from './copaNacional';
import { roundLabelByMatchCount } from './leagueEngine';

/** Cuántos partidos recientes entran en el reporte. Suficiente para ver una racha, no un diario. */
const ULTIMOS_PARTIDOS = 8;

function global(tie: TwoLegTie, miId: string): string {
  const soyA = tie.clubAId === miId;
  if (tie.firstLegGoalsA === null) return 'ida sin jugar';
  const mios = (soyA ? tie.firstLegGoalsA : tie.firstLegGoalsB) ?? 0;
  const suyos = (soyA ? tie.firstLegGoalsB : tie.firstLegGoalsA) ?? 0;
  return `ida ${mios}-${suyos}`;
}

function describirLlave(tie: TwoLegTie | null | undefined, miId: string, nombre: (id: string) => string): string {
  if (!tie) return 'sin cruce';
  const rival = tie.clubAId === miId ? tie.clubBId : tie.clubAId;
  const pierna = tie.partidoUnico ? 'partido único' : tie.firstLegGoalsA === null ? 'IDA' : 'VUELTA';
  return `vs ${nombre(rival)} · ${pierna} · ${global(tie, miId)}${tie.played ? ` · jugada, gana ${nombre(tie.winnerId ?? '')}` : ''}`;
}

export interface OpcionesDeReporte {
  /** Lo que el jugador esperaba que pasara. Es la mitad del reporte que el código no puede saber. */
  nota?: string;
  /** Stack trace, cuando el reporte lo pide PantallaDeError. */
  detalleTecnico?: string;
}

/**
 * El informe completo, en texto plano.
 *
 * Va en texto y no en JSON a propósito: tiene que poder pegarse en un chat y leerse de corrido. Un
 * JSON de la partida entera son cientos de kilobytes y no se puede mirar; esto entra en pantalla.
 */
export function armarReporteDeBug(
  perfil: PlayerProfile,
  clubs: Club[],
  opciones: OpcionesDeReporte = {},
): string {
  const nombre = (id: string) => clubs.find(c => c.id === id)?.name ?? (id || '¿?');
  const club = clubs.find(c => c.id === perfil.currentClubId);
  const l: string[] = [];
  const seccion = (t: string) => l.push('', `--- ${t} ---`);

  l.push('=== REPORTE DE BUG · Fut Starzz ===');
  if (opciones.nota) l.push(`Lo que esperaba: ${opciones.nota}`);
  l.push(`Generado: ${new Date().toISOString()}`);

  seccion('CARRERA');
  l.push(`Jugador: ${perfil.name} · ${perfil.position} · ${perfil.age} años · prestigio ${perfil.prestige}`);
  l.push(`Club: ${club?.name ?? '¿?'} (${club?.league ?? '¿?'}, división ${club?.division ?? '?'})`);
  l.push(`Paso de carrera: ${perfil.currentWeek}`);

  // El calendario es la fuente de verdad de qué se juega hoy, así que se le pregunta directo. Si el
  // club no tiene fechas reales hay que decirlo: media docena de reglas cambian en ese caso.
  if (club && hasDatedLeagueSchedule(club.name)) {
    const paso = fixturesAtStep(club.name, perfil.currentWeek);
    l.push(`Temporada de carrera: ${temporadaDeCarrera(club.name, perfil.currentWeek)} · año ${anioDeCarrera(club.name, perfil.currentWeek)}`);
    l.push(`Fecha del paso: ${fechaDelPaso(club.name, perfil.currentWeek) ?? '(calendario agotado)'}`);

    seccion('QUÉ DICE EL CALENDARIO DE HOY');
    if (!paso) {
      l.push('El calendario real de este club ya se agotó: manda el motor semanal.');
    } else {
      l.push(`Torneo de liga en curso: ${torneoDelClubEnFecha(club.name, paso.date) ?? '(hoy no hay fecha de liga)'}`);
      for (const f of paso.fixtures) {
        const marcas = [
          f.esReservaDeCuadro ? 'RESERVADA (el rival lo pone el cuadro)' : null,
          f.esPlayoff ? 'CUADRANGULAR' : null,
        ].filter(Boolean).join(' · ');
        l.push(`  · ${f.competition.kind.padEnd(19)} ${f.competition.name} — ${f.isHome ? 'local' : 'visitante'} vs ${f.opponentName}${marcas ? ` [${marcas}]` : ''}`);
      }
      if (paso.fixtures.length > 1) {
        l.push('  (hay más de un partido el mismo día: gana el de mayor prioridad — selección > continental > nacional > liga)');
      }
    }
  } else {
    l.push('Este club NO tiene calendario por fechas reales.');
  }

  seccion('COPAS CONTINENTALES GUARDADAS');
  const continentales = Object.entries(perfil.continentalCups ?? {});
  if (!continentales.length) l.push('(ninguna)');
  for (const [clave, cup] of continentales) {
    if (!cup) continue;
    const ronda = cup.knockout?.tiesByRound[cup.knockout.tiesByRound.length - 1];
    const mia = ronda?.find(t => t.clubAId === perfil.currentClubId || t.clubBId === perfil.currentClubId);
    l.push(`${clave}: etapa ${cup.stage} · pasos consumidos ${cup.stepsConsumed ?? 0}${cup.championId ? ` · CAMPEÓN ${nombre(cup.championId)}` : ''}`);
    if (ronda) l.push(`   ronda actual: ${roundLabelByMatchCount(ronda.length)} — ${describirLlave(mia, perfil.currentClubId, nombre)}`);
    else if (cup.stage === 'groups') {
      const grupo = cup.groups.find(g => g.clubIds.includes(perfil.currentClubId));
      l.push(`   grupo: ${grupo ? grupo.clubIds.map(nombre).join(', ') : 'no estás en ninguno'}`);
    }
  }
  for (const [clave, cup] of Object.entries(perfil.uefaCups ?? {})) {
    if (!cup) continue;
    const ronda = cup.knockout?.tiesByRound[cup.knockout.tiesByRound.length - 1];
    const mia = ronda?.find(t => t.clubAId === perfil.currentClubId || t.clubBId === perfil.currentClubId)
      ?? cup.playoff?.find(t => t.clubAId === perfil.currentClubId || t.clubBId === perfil.currentClubId);
    l.push(`${clave}: etapa ${cup.stage}${cup.championId ? ` · CAMPEÓN ${nombre(cup.championId)}` : ''}`);
    if (mia) l.push(`   ${describirLlave(mia, perfil.currentClubId, nombre)}`);
  }

  seccion('COPA NACIONAL GUARDADA');
  const nacionales = Object.entries(perfil.domesticCups ?? {});
  if (!nacionales.length) l.push('(ninguna edición guardada todavía)');
  for (const [clave, cup] of nacionales) {
    if (!cup) continue;
    const sigo = sigueEnCopa(cup, perfil.currentClubId);
    l.push(`${clave}: ${rondaActual(cup)} · ${cup.bracket.tiesByRound.length} ronda(s)${cup.championId ? ` · CAMPEÓN ${nombre(cup.championId)}` : ''}`);
    l.push(`   ¿sigo en carrera?: ${sigo ? 'sí' : 'NO'} — ${describirLlave(sigo && !cup.championId ? cruceActual(cup, perfil.currentClubId) : null, perfil.currentClubId, nombre)}`);
  }

  seccion('CUADRANGULARES GUARDADOS');
  const playoffs = Object.entries(perfil.playoffsDeLiga ?? {});
  if (!playoffs.length) l.push('(ninguno)');
  for (const [clave, b] of playoffs) {
    if (!b) continue;
    const ronda = b.tiesByRound[b.tiesByRound.length - 1];
    const mia = ronda?.find(t => t.clubAId === perfil.currentClubId || t.clubBId === perfil.currentClubId);
    l.push(`${clave}: ${roundLabelByMatchCount(ronda?.length ?? 0)} · ${ronda?.length ?? 0} llave(s)${b.championId ? ` · CAMPEÓN ${nombre(b.championId)}` : ''}`);
    l.push(`   ${describirLlave(mia, perfil.currentClubId, nombre)}`);
  }

  seccion(`ÚLTIMOS ${ULTIMOS_PARTIDOS} PARTIDOS REGISTRADOS`);
  const ultimos = (perfil.datedResults ?? []).slice(-ULTIMOS_PARTIDOS);
  if (!ultimos.length) l.push('(ninguno)');
  for (const r of ultimos) l.push(`${r.date}  ${r.competition.padEnd(26)} ${r.myGoals}-${r.rivalGoals} vs ${r.opponentName}`);

  if (perfil.ultimaEliminacion) {
    l.push('', `Última eliminación anotada: ${perfil.ultimaEliminacion.competicion} (paso ${perfil.ultimaEliminacion.semana})`);
  }

  if (opciones.detalleTecnico) {
    seccion('DETALLE TÉCNICO DEL ERROR');
    l.push(opciones.detalleTecnico);
  }

  return l.join('\n');
}

// --- EL ESTADO PARA LA PANTALLA DE ERROR ------------------------------------------------------
//
// PantallaDeError vive POR FUERA de App (envuelve el árbol entero en main.tsx), así que cuando un
// error de render la despierta ya no tiene forma de leer el perfil: el árbol que lo tenía acaba de
// desmontarse. Sin esto, el reporte de una caída trae el stack trace y nada más -- y el stack solo
// dice dónde reventó, no qué estaba jugando.
//
// La solución es una variable de módulo que App mantiene al día. Un módulo sobrevive al desmontaje
// del árbol porque no es parte de él.
let ultimoEstado: string | null = null;

/** App deja acá una foto del estado en cada cambio de partida. Barato: es armar un string. */
export function recordarEstado(reporte: string) {
  ultimoEstado = reporte;
}

/** Lo último que se supo de la carrera antes de que se cayera la pantalla. */
export function estadoAntesDeLaCaida(): string | null {
  return ultimoEstado;
}
