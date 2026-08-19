/**
 * Dibuja los AVISOS que interrumpen la partida y comprueba que digan lo que corresponde.
 *
 *   npm run validar:avisos
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUE HACE FALTA
 * ---------------------------------------------------------------------------------------------
 *
 * Estas pantallas no estaban cubiertas por NADA. validar:pantallas dibuja el Dashboard y
 * validar:simulador la pantalla del partido, pero los overlays salen encima de las dos y ninguno de
 * los dos los monta.
 *
 * Y son la clase de pantalla en la que un bug no se cae: se dibuja igual, con el texto equivocado.
 * El caso que motivo este archivo lo encontro el jugador, no el codigo:
 *
 *   "me salio que mi participacion en el torneo habia finalizado cuando gane por paliza en el
 *    global contra Cincinnati"  (3-2 la ida, 9-0 la vuelta, y paso a cuartos)
 *
 * SeasonEndInfo tenia desde hacia rato un campo `avanzo` para el caso "pasaste de ronda", App.tsx
 * lo mandaba, y el overlay NO LO MIRABA: caia al ultimo respaldo del encabezado y anunciaba
 * "Torneo finalizado -- cierra su participacion en Concacaf Champions Cup" al que acababa de
 * clasificar. Un campo que nadie lee no da error de tipos ni revienta en pantalla.
 *
 * COMPROBADO QUE SIRVE: con el overlay anterior, el caso "paso de ronda" falla con las dos frases
 * prohibidas; con el arreglado, pasa.
 */
import { renderToString } from 'react-dom/server';
import React from 'react';
import SeasonEndOverlay from '../src/components/SeasonEndOverlay';
import ChampionOverlay from '../src/components/ChampionOverlay';

const nada = () => {};
let fallas = 0;

/**
 * @param esperado  texto que TIENE que salir
 * @param prohibido texto que NO puede salir. Es la mitad importante: un aviso que dice de mas
 *                  ("finalizado" encima de una clasificacion) se dibuja perfecto y miente igual.
 */
const caso = (etiqueta, elemento, esperado, prohibido = []) => {
  try {
    const html = renderToString(elemento);
    if (html.length < 200) throw new Error(`dibujo casi vacio (${html.length} caracteres)`);
    for (const t of [].concat(esperado)) {
      if (!html.includes(t)) throw new Error(`falta "${t}"`);
    }
    for (const t of prohibido) {
      if (html.includes(t)) throw new Error(`dice "${t}", que no puede`);
    }
    console.log(`OK    ${etiqueta}`);
  } catch (e) {
    fallas++;
    console.log(`FALLA ${etiqueta.padEnd(46)} ${e.message}`);
  }
};

const base = {
  competition: 'Concacaf Champions Cup',
  clubName: 'Tigres U.A.N.L.',
  season: '2026',
  badgeUrl: null,
};

// Las dos frases del cierre. Ninguna puede aparecer cuando el club sigue vivo en el torneo.
const CIERRE = ['finalizado', 'cierra su participación'];

caso('fin de torneo: pasaste de ronda',
  <SeasonEndOverlay info={{ ...base, avanzo: true, rondaSiguiente: 'Cuartos de Final' }} onClose={nada} />,
  ['Pasaste de ronda', 'sigue en carrera en', 'Concacaf Champions Cup'],
  CIERRE);

caso('fin de torneo: eliminado en una copa',
  <SeasonEndOverlay info={{ ...base, eliminated: true, eliminatedRound: 'Cuartos de Final' }} onClose={nada} />,
  ['Eliminado en Cuartos de Final', 'cierra su participación'],
  ['Pasaste de ronda']);

caso('fin de torneo: eliminado sin nombre de ronda',
  <SeasonEndOverlay info={{ ...base, eliminated: true, eliminatedRound: null }} onClose={nada} />,
  ['Eliminado en la eliminatoria'],
  ['Pasaste de ronda', 'undefined', 'null']);

caso('fin de torneo: puesto en la tabla',
  <SeasonEndOverlay info={{ ...base, competition: 'Liga MX', finalPosition: 7, totalTeams: 18 }} onClose={nada} />,
  ['7° lugar', 'en el puesto', 'cierra su participación'],
  ['Pasaste de ronda']);

caso('fin de torneo: sin puesto ni eliminacion',
  <SeasonEndOverlay info={{ ...base, competition: 'Liga MX' }} onClose={nada} />,
  ['Torneo finalizado'],
  ['Pasaste de ronda', 'en el puesto']);

caso('campeon',
  <ChampionOverlay info={base} playerName="Cani" onClose={nada} />,
  ['Tigres U.A.N.L.'],
  CIERRE);

console.log(fallas
  ? `\n${fallas} aviso(s) mal.`
  : '\nLos avisos que interrumpen la partida dicen lo que corresponde en cada estado.');
process.exit(fallas ? 1 : 0);
