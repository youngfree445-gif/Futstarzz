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
 * ESTADO: SIN TERMINAR. El perfil sintetico de abajo esta incompleto -- le faltan campos que el
 * Dashboard da por sentados -- y por eso las 20 combinaciones fallan con "Cannot read properties of
 * undefined". El fallo es del ANDAMIO, no del juego: es el mismo Dashboard que anda en pantalla.
 *
 * Para terminarlo: el perfil de verdad se arma en SetupScreen.tsx (~linea 189) y tiene bastantes mas
 * campos que estos. Lo que corresponde no es copiarlos a mano -- se desincronizan al primer campo
 * nuevo -- sino EXTRAER esa construccion a una funcion exportada (crearPerfilInicial) y llamarla
 * desde aca y desde SetupScreen. Asi el validador usa siempre el perfil real.
 *
 * Por eso todavia no esta en package.json: un validador que falla por su propio andamio entrena a
 * ignorarlo, que es peor que no tenerlo.
 *
 * NO reemplaza jugar. Comprueba una cosa sola, la mas barata y la que mas duele: que la pantalla
 * principal SE PUEDE DIBUJAR. Un error ahi desmonta el arbol entero de React y deja la pantalla en
 * negro, sin importar lo bien que funcione el motor por debajo.
 */
import { renderToString } from 'react-dom/server';
import React from 'react';
import Dashboard from '../src/components/Dashboard';
import { ULTIMATE_CLUBS_DATABASE, INITIAL_LIFESTYLE_ITEMS } from '../src/data';

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

for (const nombre of CLUBES) {
  const club = ULTIMATE_CLUBS_DATABASE.find(c => c.name === nombre);
  if (!club) { console.log(`FALLA  no existe el club ${nombre}`); fallas++; continue; }

  for (const paso of PASOS) {
    const perfil = {
      name: 'Camilo Restrepo', age: 25, position: 'Mediocampista', height: 191, dorsal: 30,
      nationality: 'Colombia', currentClubId: club.id, currentWeek: paso,
      attributes: { ritmo: 55, regate: 60, tiro: 63, defensa: 45, pase: 65, fisico: 50 },
      energy: 70, capital: 200000, prestige: 60, fans: 50, coachRelation: 70, teammates: 55,
      morale: 70, yearsAtClub: 1,
      careerStats: { goles: 5, asistencias: 3, partidosHistoricos: paso, campeonatos: 0,
                     tarjetasAmarillasHistoricas: 1, tarjetasRojasHistoricas: 0 },
      seasonStats: { goles: 5, asistencias: 3, partidos: paso, rating: 7.2 },
      clubHistory: [{ clubId: club.id, seasonStart: 1 }],
      seasonHistory: [{ seasonNum: 1 }],
      leagueSeasons: {}, continentalCups: {}, uefaCups: {}, domesticCups: {},
      playoffsDeLiga: {}, eliminatorias: {}, lideresPorCompeticion: {},
      cupTitles: [], datedResults: [], retiredWorldPlayers: {},
      sponsorships: [], investments: [], achievements: [], socialPosts: [],
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

console.log(fallas === 0
  ? `\nEl Dashboard se dibuja en ${CLUBES.length * PASOS.length} combinaciones de club y paso.`
  : `\n${fallas} FALLAS -- la pantalla principal no se puede dibujar`);
process.exit(fallas === 0 ? 0 : 1);
