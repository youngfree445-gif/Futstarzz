/**
 * Dibuja el Dashboard DE VERDAD, con un perfil en mitad de una temporada.
 *
 *   npm run validar:pantallas
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUE HACE FALTA
 * ---------------------------------------------------------------------------------------------
 *
 * El 13 de agosto de 2026 el juego se quedaba en pantalla negra al tercer o cuarto partido. La
 * causa era una constante leida antes de declararse (zona muerta temporal) en Dashboard.tsx.
 *
 * Lo importante es QUE NO LA AGARRO NADA de lo que ya se corre:
 *
 *   . `tsc` no la ve: TypeScript no modela el orden de EJECUCION. El codigo era sintacticamente
 *     valido y los tipos cerraban.
 *   . El chequeo de SSR tampoco: renderiza <App /> y App arranca en la pantalla de bienvenida.
 *     El Dashboard -- donde vive casi todo el juego -- nunca se llegaba a ejecutar.
 *
 * Osea que la unica forma de encontrarla era jugar cuatro partidos a mano. Este script cierra ese
 * agujero: monta el Dashboard con un perfil ya empezado y falla si tira cualquier error.
 *
 * COMPROBADO QUE SIRVE, que es lo unico que hace util a un validador. Se reintrodujo el bug exacto
 * de hoy -- leer `conmebolCupId` antes de su declaracion -- y las 20 combinaciones fallan con
 * "Cannot access 'conmebolCupId' before initialization"; al sacarlo, pasan.
 *
 * Una trampa al comprobarlo, por si alguien repite la prueba: si la variable que se inyecta NO SE
 * USA, el minificador la borra entera y el validador pasa igual. La prueba tiene que tener un efecto
 * real (un console.log alcanza), o se comprueba nada y se cree lo contrario.
 *
 * NO reemplaza jugar. Comprueba una cosa sola, la mas barata y la que mas duele: que la pantalla
 * principal SE PUEDE DIBUJAR. Un error ahi desmonta el arbol entero de React y deja la pantalla en
 * negro, sin importar lo bien que funcione el motor por debajo.
 */
import { renderToString } from 'react-dom/server';
import React from 'react';
import Dashboard from '../src/components/Dashboard';
import { ULTIMATE_CLUBS_DATABASE, INITIAL_LIFESTYLE_ITEMS } from '../src/data';
import { crearPerfilInicial } from '../src/components/SetupScreen';

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const nada = () => {};
let fallas = 0;

// Clubes de calendarios distintos: uno de Apertura/Clausura con dos copas, uno de liga europea de
// temporada corrida, uno brasileno y uno mexicano. Si algo depende de la forma del calendario, sale.
const CLUBES = ['Junior de Barranquilla', 'FC Barcelona', 'Santos', 'América'];

// Varios PASOS de la temporada, no solo el primero: el crash aparecia recien al tercer o cuarto
// partido, porque hasta ahi las estructuras estaban vacias y varias ramas ni se ejecutaban.
const PASOS = [1, 4, 9, 20, 40];

// ESTADOS DE LESION. El panel de lesion tiene ramas propias -- los dos botones de tratamiento, el
// aviso de cada eleccion y el bloque de "jugando lesionado" -- y NINGUNA se dibuja con un perfil
// sano, que es lo unico que probaba este validador. O sea que todo ese JSX no lo comprobaba nadie.
//
// Van con el paso 9 (temporada empezada) para no multiplicar por cinco todas las combinaciones: lo
// que se prueba aca es la forma del panel, no el momento de la temporada.
const LESIONES = [
  { etiqueta: 'sano', valor: null },
  { etiqueta: 'lesionado sin elegir', valor: { type: 'muscular', weeksRemaining: 4, startedWeek: 5 } },
  { etiqueta: 'tratamiento rapido', valor: { type: 'ligamentos', weeksRemaining: 3, startedWeek: 5, treatmentChoice: 'fast' } },
  { etiqueta: 'recuperacion natural', valor: { type: 'golpe', weeksRemaining: 2, startedWeek: 5, treatmentChoice: 'natural' } },
  { etiqueta: 'forzando la vuelta', valor: { type: 'fractura', weeksRemaining: 6, startedWeek: 5, treatmentChoice: 'forzar' } },
];

for (const nombre of CLUBES) {
  const club = ULTIMATE_CLUBS_DATABASE.find(c => c.name === nombre);
  if (!club) { console.log(`FALLA  no existe el club ${nombre}`); fallas++; continue; }

  for (const paso of PASOS) {
    // El perfil sale de la FABRICA REAL del juego, no de una copia a mano. Copiar los campos fue
    // exactamente lo que dejo este validador sin terminar la primera vez: se escapaban varios y el
    // Dashboard reventaba por culpa del andamio, no del juego.
    const perfil = {
      ...crearPerfilInicial({
        name: 'Camilo Restrepo', position: 'Mediocampista', age: 25, nationality: 'Colombia',
        dorsal: 30, heightCm: 191, selectedClubId: club.id, currentClub: club,
        defaultAttributes: { ritmo: 55, regate: 60, tiro: 63, defensa: 45, pase: 65, fisico: 50 },
        superstition: 'botin_derecho', injuriesEnabled: true,
        difficultyMode: 'normal', startedAsVeteran: false, starModeEnabled: false,
      }),
      // Y se lo adelanta al paso que toca: el crash aparecia recien al tercer o cuarto partido,
      // porque hasta ahi varias estructuras estaban vacias y sus ramas ni se ejecutaban.
      currentWeek: paso,
      careerStats: {
        goles: 5, asistencias: 3, partidos: paso, campeonatos: 0,
        golesHistoricos: 5 * paso, asistenciasHistoricos: 3 * paso, partidosHistoricos: paso,
        sumaCalificacionesHistoricas: 7.2 * paso,
        tarjetasAmarillasHistoricas: 1, tarjetasRojasHistoricas: 0,
      },
      lastMatchRating: 7.2,
    };

    try {
      const html = renderToString(React.createElement(Dashboard, {
        playerProfile: perfil, shopItems: INITIAL_LIFESTYLE_ITEMS,
        onTrainAttribute: nada, onSelectMentee: nada, onSelectMentor: nada, onVisitarEntorno: nada,
        onFindGirlfriend: nada, onGirlfriendFlowers: nada, onGirlfriendPhoto: nada,
        onGirlfriendFaithful: nada, onGirlfriendCheat: nada, onGirlfriendDenyRumors: nada,
        onGirlfriendMoveIn: nada, onPropose: nada, onHaveChild: nada, onTreatInjury: nada,
        onSelectRole: nada, onRefreshTransferOffers: nada, onHireAgent: nada, onFireAgent: nada,
        onRequestRenewal: nada, onLoanOut: nada, onResolveLoan: nada, onBuyInvestment: nada,
        onReconvertPosition: nada, onBuyItem: nada, onAcceptSponsor: nada, onCancelSponsor: nada,
        onLaunchPRCampaign: nada, onAnswerPress: nada, onAcceptTransfer: nada, onAdvanceWeek: nada,
        onFinalizeSeason: nada, onRecoverEnergy: nada, onSocialInteraction: nada,
        onLogout: nada, onResetGame: nada,
      }));
      if (html.length < 500) throw new Error(`dibujo casi vacio (${html.length} caracteres)`);
      console.log(`OK    ${nombre.padEnd(24)} paso ${String(paso).padStart(2)}   ${(html.length / 1024).toFixed(0)} KB`);
    } catch (e) {
      fallas++;
      console.log(`FALLA ${nombre.padEnd(24)} paso ${String(paso).padStart(2)}   ${e.message}`);
    }
  }
}

// El panel de lesion, con sus cuatro estados. Se dibuja sobre un solo club y un solo paso porque lo
// que cambia de forma es el panel, no el calendario: multiplicarlo por los 4 clubes y los 5 pasos
// daria 100 combinaciones para probar lo mismo cuatro veces.
const clubLesion = ULTIMATE_CLUBS_DATABASE.find(c => c.name === 'Junior de Barranquilla');
for (const lesion of LESIONES.slice(1)) {
  const perfil = {
    ...crearPerfilInicial({
      name: 'Camilo Restrepo', position: 'Mediocampista', age: 25, nationality: 'Colombia',
      dorsal: 30, heightCm: 191, selectedClubId: clubLesion.id, currentClub: clubLesion,
      defaultAttributes: { ritmo: 55, regate: 60, tiro: 63, defensa: 45, pase: 65, fisico: 50 },
      superstition: 'botin_derecho', injuriesEnabled: true,
      difficultyMode: 'normal', startedAsVeteran: false, starModeEnabled: false,
    }),
    currentWeek: 9,
    activeInjury: lesion.valor,
    careerStats: {
      goles: 5, asistencias: 3, partidos: 9, campeonatos: 0,
      golesHistoricos: 45, asistenciasHistoricos: 27, partidosHistoricos: 9,
      sumaCalificacionesHistoricas: 64.8,
      tarjetasAmarillasHistoricas: 1, tarjetasRojasHistoricas: 0,
    },
    lastMatchRating: 7.2,
  };
  try {
    const html = renderToString(React.createElement(Dashboard, {
      playerProfile: perfil, shopItems: INITIAL_LIFESTYLE_ITEMS,
      onTrainAttribute: nada, onSelectMentee: nada, onSelectMentor: nada, onVisitarEntorno: nada,
      onFindGirlfriend: nada, onGirlfriendFlowers: nada, onGirlfriendPhoto: nada,
      onGirlfriendFaithful: nada, onGirlfriendCheat: nada, onGirlfriendDenyRumors: nada,
      onGirlfriendMoveIn: nada, onPropose: nada, onHaveChild: nada, onTreatInjury: nada,
      onSelectRole: nada, onRefreshTransferOffers: nada, onHireAgent: nada, onFireAgent: nada,
      onRequestRenewal: nada, onLoanOut: nada, onResolveLoan: nada, onBuyInvestment: nada,
      onReconvertPosition: nada, onBuyItem: nada, onAcceptSponsor: nada, onCancelSponsor: nada,
      onLaunchPRCampaign: nada, onAnswerPress: nada, onAcceptTransfer: nada, onAdvanceWeek: nada,
      onFinalizeSeason: nada, onRecoverEnergy: nada, onSocialInteraction: nada,
      onLogout: nada, onResetGame: nada,
    }));
    if (html.length < 500) throw new Error(`dibujo casi vacio (${html.length} caracteres)`);
    console.log(`OK    lesion: ${lesion.etiqueta.padEnd(24)}   ${(html.length / 1024).toFixed(0)} KB`);
  } catch (e) {
    fallas++;
    console.log(`FALLA lesion: ${lesion.etiqueta.padEnd(24)}   ${e.message}`);
  }
}

const combinaciones = CLUBES.length * PASOS.length + (LESIONES.length - 1);
console.log(fallas === 0
  ? `\nEl Dashboard se dibuja en ${combinaciones} combinaciones de club, paso y estado de lesion.`
  : `\n${fallas} FALLAS -- la pantalla principal no se puede dibujar`);
process.exit(fallas === 0 ? 0 : 1);
