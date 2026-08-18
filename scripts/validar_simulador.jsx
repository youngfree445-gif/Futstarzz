/**
 * Dibuja el SIMULADOR DE PARTIDO de verdad, en sus estados.
 *
 *   npm run validar:simulador
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUE HACE FALTA
 * ---------------------------------------------------------------------------------------------
 *
 * `validar:pantallas` cubre el Dashboard, que es donde vivieron las dos pantallas negras. Pero el
 * simulador -- la otra mitad del juego, la que se abre en CADA fecha -- no lo dibujaba nadie en el
 * build. Un error de render ahi desmonta el arbol igual que en el Dashboard, con el agravante de
 * que se descubre en el peor momento posible: con el partido ya empezado.
 *
 * El agujero se hizo evidente al agregar la charla del entretiempo: un modal entero, con dos
 * botones, que no tenia ni una linea de cobertura. La logica si (validar:tecnico, 23 casos), pero
 * la logica que no se puede dibujar no sirve de nada.
 *
 * ---------------------------------------------------------------------------------------------
 * LA TRAMPA DEL SSR CON UN COMPONENTE QUE CORRE UN RELOJ
 * ---------------------------------------------------------------------------------------------
 *
 * renderToString ejecuta el render UNA vez y no corre efectos, asi que el partido queda congelado
 * en el minuto 0. Todo lo que aparece mas tarde -- la charla del entretiempo al 45, la entrada
 * desde el banco, el final -- es inalcanzable desde aca.
 *
 * Por eso MatchSimulator acepta `charlaInicial`, igual que el Dashboard acepta `initialTab`: una
 * prop que SOLO usa este script para poder dibujar un estado que el reloj alcanzaria despues. El
 * juego no la pasa nunca.
 */
import { renderToString } from 'react-dom/server';
import React from 'react';
import MatchSimulator from '../src/components/MatchSimulator';
import { ULTIMATE_CLUBS_DATABASE } from '../src/data';
import { crearPerfilInicial } from '../src/components/SetupScreen';

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const nada = () => {};
let fallas = 0;

const junior = ULTIMATE_CLUBS_DATABASE.find(c => c.name === 'Junior de Barranquilla');
const nacional = ULTIMATE_CLUBS_DATABASE.find(c => c.name === 'Atlético Nacional');

/** El perfil sale de la FABRICA REAL del juego, igual que en validar_pantallas. */
const perfilDe = (extra = {}) => ({
  ...crearPerfilInicial({
    name: 'Camilo Restrepo', position: 'Delantero', age: 25, nationality: 'Colombiana',
    dorsal: 9, heightCm: 178, selectedClubId: junior.id, currentClub: junior,
    defaultAttributes: { ritmo: 70, regate: 68, tiro: 74, defensa: 40, pase: 62, fisico: 60 },
    superstition: 'botin_derecho', injuriesEnabled: true,
    difficultyMode: 'normal', startedAsVeteran: false, starModeEnabled: false,
  }),
  currentWeek: 12,
  ...extra,
});

const dibujar = (props, esperado) => {
  const html = renderToString(React.createElement(MatchSimulator, {
    playerProfile: perfilDe(), opponentName: nacional.name, opponentClubId: nacional.id,
    isLibertadores: false, isHome: true, onFinishMatch: nada,
    ...props,
  }));
  if (html.length < 500) throw new Error(`dibujo casi vacio (${html.length} caracteres)`);
  if (esperado && !html.includes(esperado)) throw new Error(`se dibujo pero falta "${esperado}"`);
  return html;
};

const caso = (nombre, fn) => {
  try {
    const html = fn();
    console.log(`OK    ${nombre.padEnd(42)} ${Math.round(html.length / 1024)} KB`);
  } catch (e) {
    fallas++;
    console.log(`FALLA ${nombre.padEnd(42)} ${e.message}`);
  }
};

// --- El partido, en las formas en que puede empezar -----------------------------------------

caso('titular de local', () => dibujar({ isHome: true }, 'Atlético Nacional'));
caso('visitante', () => dibujar({ isHome: false }));
caso('suplente que entra al 60', () =>
  dibujar({ lineupStatus: 'substitute', subEntryMinute: 60 }, 'Arrancas en el banco'));
caso('con posiciones de tabla', () =>
  dibujar({ myTablePosition: 3, rivalTablePosition: 1, leagueTeamCount: 20 }));

// --- Las competiciones, que cambian el encabezado --------------------------------------------

caso('Libertadores', () => dibujar({ isLibertadores: true, cupId: 'libertadores' }));
caso('Champions', () => dibujar({ uefaCupId: 'champions' }));
caso('copa nacional', () => dibujar({ isDomesticCup: true }));
// globalScoreLabel viaja como marcador pelado ('2-1'), no como frase: el bloque lo parte por el
// guion y descarta cualquier cosa que no sean dos numeros. Pasarle prosa lo deja mudo sin fallar,
// que es como este caso arranco en rojo la primera vez.
caso('vuelta con global', () => dibujar({ globalScoreLabel: '2-1' }, 'Global'));
caso('global mal formado no rompe, solo no sale', () => {
  const html = dibujar({ globalScoreLabel: 'Vuelta · Global' }, null);
  if (html.includes('Global 2')) throw new Error('dibujo un global que no se puede leer');
  return html;
});
caso('Mundial', () => dibujar({ isWorldCup: true, representingTeamId: 'wc_colombia' }));

// --- LA CHARLA DEL ENTRETIEMPO, que es lo que no cubria nadie --------------------------------

caso('entretiempo: el tecnico te habla', () =>
  dibujar({ charlaInicial: 'Bájate a buscarla al medio.' }, 'Entretiempo'));
caso('entretiempo: estan las dos opciones', () => {
  const html = dibujar({ charlaInicial: 'Bájate a buscarla al medio.' }, 'Salir a hacer lo que pide');
  if (!html.includes('Jugar a tu manera')) throw new Error('falta la opcion de ignorarlo');
  return html;
});
caso('entretiempo: aparece el nombre del DT', () =>
  dibujar({ charlaInicial: 'Cuidemos la pelota.' }, junior.dt));
caso('sin charla, el modal NO esta', () => {
  const html = dibujar({}, null);
  if (html.includes('Entretiempo')) throw new Error('el modal del entretiempo sale sin corresponder');
  return html;
});

// --- Estados del jugador que cambian el aviso previo -----------------------------------------

caso('en bajon animico', () => {
  const html = renderToString(React.createElement(MatchSimulator, {
    playerProfile: perfilDe({ mentalHealth: 10 }), opponentName: nacional.name,
    opponentClubId: nacional.id, isLibertadores: false, isHome: true, onFinishMatch: nada,
  }));
  if (!html.includes('bajón anímico')) throw new Error('falta el aviso del bajon');
  return html;
});
caso('jugando lesionado', () => {
  const html = renderToString(React.createElement(MatchSimulator, {
    playerProfile: perfilDe({ activeInjury: { type: 'muscular', weeksRemaining: 3, startedWeek: 5, treatmentChoice: 'forzar' } }),
    opponentName: nacional.name, opponentClubId: nacional.id,
    isLibertadores: false, isHome: true, onFinishMatch: nada,
  }));
  if (html.length < 500) throw new Error('dibujo casi vacio');
  return html;
});

// El boton de reportar bug tiene que estar EN el partido: el reporte es una foto del paso actual,
// asi que apenas termina el estado avanza y lo que habia que fotografiar ya no esta. Pedido del
// jugador: "a veces te reporto un bug despues de que haya sucedido".
//
// Se busca el title y no el emoji: el icono puede cambiar, lo que no puede faltar es el boton.
caso('el boton de reportar bug esta en el partido',
  () => dibujar({}, 'title="Reportar un bug"'));

console.log(fallas === 0
  ? `\nEl simulador se dibuja en 17 estados, con la charla del entretiempo incluida.`
  : `\n${fallas} FALLAS -- el simulador no se puede dibujar`);
process.exit(fallas === 0 ? 0 : 1);
