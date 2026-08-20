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
 * de ese dia -- leer `conmebolCupId` antes de su declaracion -- y todas las combinaciones fallan con
 * "Cannot access 'conmebolCupId' before initialization"; al sacarlo, pasan.
 *
 * ---------------------------------------------------------------------------------------------
 * DOS AGUJEROS QUE TENIA ESTE MISMO VALIDADOR (y como se encontraron)
 * ---------------------------------------------------------------------------------------------
 *
 * 1. SOLO DIBUJABA UNA PESTAÑA. El Dashboard abre en 'carrera' y las otras diez -- el feed, la
 *    prensa, los traspasos, las tablas, el calendario -- no las dibujaba NADIE. Osea que la mayor
 *    parte de la pantalla principal estaba sin cubrir mientras el validador decia "todo OK".
 *
 *    Se descubrio al agregar la lista de convocados: el caso pasaba en verde y la lista no se
 *    dibujaba. Por eso ahora el Dashboard acepta `initialTab` (solo lo usa este script) y se
 *    recorren las once.
 *
 * 2. SOLO COMPROBABA QUE NO REVENTARA. Un bloque que devuelve vacio por una condicion mal escrita
 *    no revienta: simplemente no sale, y el caso pasa igual. Por eso los casos con contenido
 *    esperado ahora verifican que el TEXTO este en el HTML, no solo que haya HTML.
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
import { esDiaDeEliminatorias, fixturesAtStep, pickPrimary as pickDatedPrimary, torneoDeSeleccionesDelDia } from '../src/dateSchedule';

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const nada = () => {};
let fallas = 0;

// Clubes de calendarios distintos: uno de Apertura/Clausura con dos copas, uno de liga europea de
// temporada corrida, uno brasileno y uno mexicano. Si algo depende de la forma del calendario, sale.
const CLUBES = ['Junior de Barranquilla', 'FC Barcelona', 'Santos', 'América', 'Tigres U.A.N.L.'];

// Varios PASOS de la temporada, no solo el primero: el crash aparecia recien al tercer o cuarto
// partido, porque hasta ahi las estructuras estaban vacias y varias ramas ni se ejecutaban.
// El 5 entro despues: es el dia de Copa MX de Tigres, y ninguno de los otros pasos caia en el
// estado "el cruce todavia no esta sorteado". Por eso se escapo un cartel roto -- "vs Rival po..."
// truncado a mitad de palabra, con una localia inventada al lado -- que el jugador vio jugando y el
// validador no. Reportado con captura.
const PASOS = [1, 4, 5, 9, 20, 40];

const PESTAÑAS = ['carrera', 'mi_club', 'entrenamiento', 'chutsocial', 'prensa', 'traspasos',
  'tienda', 'patrocinios', 'tablas', 'calendario', 'logros'];

// ESTADOS DE LESION. El panel de lesion tiene ramas propias -- los dos botones de tratamiento, el
// aviso de cada eleccion y el bloque de "jugando lesionado" -- y NINGUNA se dibuja con un perfil
// sano, que es lo unico que probaba este validador antes.
const LESIONES = [
  { etiqueta: 'lesionado sin elegir', valor: { type: 'muscular', weeksRemaining: 4, startedWeek: 5 }, esperado: 'Volver antes de tiempo' },
  { etiqueta: 'tratamiento rapido', valor: { type: 'ligamentos', weeksRemaining: 3, startedWeek: 5, treatmentChoice: 'fast' }, esperado: 'Tratamiento rápido en curso' },
  { etiqueta: 'recuperacion natural', valor: { type: 'golpe', weeksRemaining: 2, startedWeek: 5, treatmentChoice: 'natural' }, esperado: 'Recuperación natural en curso' },
  { etiqueta: 'forzando la vuelta', valor: { type: 'fractura', weeksRemaining: 6, startedWeek: 5, treatmentChoice: 'forzar' }, esperado: 'Jugando lesionado' },
];

// LA LISTA DE CONVOCADOS. Dos trampas que costaron un intento fallido, anotadas para no repetirlas:
//   . `nationality` guarda el GENTILICIO, no el pais ('Colombiana', no 'Colombia').
//   . El primer año de carrera es AÑO DE MUNDIAL, y en año de Mundial no hay eliminatorias. El paso
//     no se adivina: se BUSCA el primero que caiga en fecha FIFA (ver pasoDeFechaFifa).
const CONVOCATORIAS = [
  { etiqueta: 'convocado', prestige: 85, partidos: 120, esperado: '⭐ Camilo Restrepo' },
  { etiqueta: 'fuera de la lista', prestige: 30, partidos: 8, esperado: 'Te falta' },
];

// EL MOMENTO DE FORMA. El panel tiene tres caras (racha, bajon, sin definir) y ninguna se dibuja
// con un perfil recien creado, que no tiene ni una nota. Las notas se anclan al paso del perfil
// para que el parate no corte la racha (ver PASOS_QUE_CORTAN_LA_RACHA en src/forma.ts).
const notasEn = (paso, ratings) => ratings.map((rating, i) => ({ rating, paso: paso - (ratings.length - 1 - i) }));
const FORMAS = [
  { etiqueta: 'en racha', notas: [7.5, 8.0, 8.2], esperado: 'En racha' },
  { etiqueta: 'en baja', notas: [5.0, 4.8, 5.4], esperado: 'En baja' },
  { etiqueta: 'sin racha definida', notas: [6.2, 7.4, 5.9], esperado: 'Sin racha definida' },
];

/** El perfil sale de la FABRICA REAL del juego, no de una copia a mano. */
const perfilDe = (club, extra = {}) => {
  const base = crearPerfilInicial({
    name: 'Camilo Restrepo', position: 'Mediocampista', age: 25, nationality: 'Colombiana',
    dorsal: 30, heightCm: 191, selectedClubId: club.id, currentClub: club,
    defaultAttributes: { ritmo: 55, regate: 60, tiro: 63, defensa: 45, pase: 65, fisico: 50 },
    superstition: 'botin_derecho', injuriesEnabled: true,
    difficultyMode: 'normal', startedAsVeteran: false, starModeEnabled: false,
  });
  const partidos = extra.partidos ?? 9;
  return {
    ...base,
    currentWeek: 9,
    careerStats: {
      ...base.careerStats,
      goles: 5, asistencias: 3, partidos, campeonatos: 0,
      golesHistoricos: 45, asistenciasHistoricos: 27, partidosHistoricos: partidos,
      sumaCalificacionesHistoricas: 7.2 * partidos,
      tarjetasAmarillasHistoricas: 1, tarjetasRojasHistoricas: 0,
    },
    lastMatchRating: 7.2,
    ...extra,
  };
};

/**
 * Dibuja una vez y devuelve el HTML, o tira. `esperado` es texto que TIENE que aparecer: sin eso un
 * bloque que devuelve vacio pasa el caso igual, que es como se colo la lista de convocados.
 */
const dibujar = (perfil, initialTab, esperado, prohibido) => {
  const html = renderToString(React.createElement(Dashboard, {
    playerProfile: perfil, shopItems: INITIAL_LIFESTYLE_ITEMS, initialTab,
    onTrainAttribute: nada, onSelectMentee: nada, onSelectMentor: nada, onVisitarEntorno: nada, onSalirDelBajon: nada,
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
  if (esperado && !html.includes(esperado)) throw new Error(`se dibujo pero falta "${esperado}"`);
  // `prohibido` es texto que NO puede aparecer. Hasta aca el validador solo probaba que la pantalla
  // no se CAYERA, no que dijera la verdad, y por eso se colo un cartel roto que el jugador vio
  // jugando: "vs Rival po..." -- el marcador de posicion metido en el hueco del nombre del club,
  // truncado a mitad de palabra y con una localia inventada al lado.
  if (prohibido && html.includes(prohibido)) throw new Error(`dice "${prohibido}", que no puede`);
  return html;
};

const caso = (etiqueta, fn) => {
  try {
    const html = fn();
    console.log(`OK    ${etiqueta.padEnd(42)} ${(html.length / 1024).toFixed(0)} KB`);
  } catch (e) {
    fallas++;
    console.log(`FALLA ${etiqueta.padEnd(42)} ${e.message}`);
  }
};

// --- Club x paso, en la pestaña de siempre --------------------------------------------------

for (const nombre of CLUBES) {
  const club = ULTIMATE_CLUBS_DATABASE.find(c => c.name === nombre);
  if (!club) { console.log(`FALLA  no existe el club ${nombre}`); fallas++; continue; }
  for (const paso of PASOS) {
    // "vs Rival por definir" no puede aparecer NUNCA: cuando el cruce todavia no esta sorteado la
    // tarjeta tiene que decirlo como estado, no colar el cartel en el hueco del nombre del rival.
    caso(`${nombre} · paso ${paso}`,
      () => {
        const html = dibujar(perfilDe(club, { currentWeek: paso }), undefined, null, 'vs Rival por definir');
        // Un dia sin partido no puede ofrecer jugarlo: o hay rival, o el boton dice "Pasar a
        // Siguiente Fecha". Reportado con captura: la tarjeta decia "SIN PARTIDO DE COPA" y
        // "Rival aun sin sortear", y abajo el boton de disputar.
        if (html.includes('Hoy no se juega') && html.includes('Disputar Partido')) {
          throw new Error('dice "Hoy no se juega" y ofrece "Disputar Partido" a la vez');
        }
        return html;
      });
  }
}

const junior = ULTIMATE_CLUBS_DATABASE.find(c => c.name === 'Junior de Barranquilla');

// --- Las once pestañas ----------------------------------------------------------------------
// Antes solo se dibujaba 'carrera'. Un error de zona muerta temporal en el feed o en el calendario
// deja la pantalla igual de negra que uno en la portada.

for (const pestaña of PESTAÑAS) {
  caso(`pestaña ${pestaña}`, () => dibujar(perfilDe(junior, { currentWeek: 40 }), pestaña, null));
}

// --- El panel de lesion, con sus cuatro estados ---------------------------------------------

for (const lesion of LESIONES) {
  caso(`lesion: ${lesion.etiqueta}`, () =>
    dibujar(perfilDe(junior, { activeInjury: lesion.valor }), 'carrera', lesion.esperado));
}

// --- El momento de forma, con sus tres caras ------------------------------------------------

for (const f of FORMAS) {
  caso(`forma: ${f.etiqueta}`, () =>
    dibujar(perfilDe(junior, { currentWeek: 40, formaReciente: notasEn(40, f.notas) }), 'carrera', f.esperado));
}

// --- El bajón anímico -----------------------------------------------------------------------
// El panel sólo existe cuando estás adentro, así que sin un caso con la barra baja nadie lo
// dibuja nunca en el build -- que es justo el agujero por el que ya se colaron dos pantallas
// negras. Se prueban las dos caras: hundido (aparece) y sano (no aparece).

caso('feed: el bajon tiene voz en ChutSocial', () =>
  dibujar(perfilDe(junior, { currentWeek: 40, mentalHealth: 12 }), 'chutsocial', null));

caso('animo: en bajon', () =>
  dibujar(perfilDe(junior, { currentWeek: 40, mentalHealth: 12 }), 'carrera', 'Bajón anímico'));
caso('animo: sano (el panel no esta)', () => {
  const html = dibujar(perfilDe(junior, { currentWeek: 40, mentalHealth: 80 }), 'carrera', null);
  if (html.includes('Bajón anímico')) throw new Error('el panel del bajon aparece con el animo sano');
  return html;
});

// --- El rival de carrera --------------------------------------------------------------------
// El panel se dibuja siempre que haya rival, pero la comparacion tiene tres caras y ninguna sale
// con un perfil recien creado, que arranca en cero contra un rival tambien en cero.

caso('rival: le vas ganando', () =>
  dibujar(perfilDe(junior, { currentWeek: 40, careerStats: { goles: 40, asistencias: 20, partidos: 100, campeonatos: 1, golesHistoricos: 400, asistenciasHistoricos: 200, partidosHistoricos: 300, sumaCalificacionesHistoricas: 2400, tarjetasAmarillasHistoricas: 5, tarjetasRojasHistoricas: 0 } }), 'carrera', 'Rival de carrera'));
caso('rival: te sacan ventaja', () =>
  dibujar(perfilDe(junior, { currentWeek: 40, careerStats: { goles: 1, asistencias: 0, partidos: 100, campeonatos: 0, golesHistoricos: 2, asistenciasHistoricos: 1, partidosHistoricos: 300, sumaCalificacionesHistoricas: 1800, tarjetasAmarillasHistoricas: 5, tarjetasRojasHistoricas: 0 } }), 'carrera', 'te viene sacando ventaja'));

// --- Las rachas de tu historia, en la tarjeta del proximo partido ---------------------------
// Las lineas solo salen con historial cargado, asi que con un perfil recien creado no las dibuja
// nadie. Se arma una historia perdida contra el rival que el calendario ponga ese dia.

// El paso NO se adivina: un dia de copa reservado todavia no tiene cruce y el rival sale como
// "Por definir", contra el que no hay racha posible. Se BUSCA el primer paso con rival concreto.
const pasoConRival = (() => {
  for (let p = 5; p <= 120; p++) {
    const paso = fixturesAtStep(junior.name, p);
    const fx = paso ? pickDatedPrimary(paso.fixtures) : null;
    const rival = fx?.opponentName;
    if (rival && !/definir/i.test(rival) && !fx.esReservaDeCuadro) return { paso: p, rival };
  }
  return null;
})();

if (pasoConRival) {
  const historia = [1, 2, 3, 4].map(i => ({
    date: `2026-0${i}-1${i}`, competition: 'Liga BetPlay Dimayor',
    opponentName: pasoConRival.rival, myGoals: 0, rivalGoals: i,
  }));
  caso(`rachas: no le ganas al rival de hoy (paso ${pasoConRival.paso})`, () =>
    dibujar(perfilDe(junior, { currentWeek: pasoConRival.paso, datedResults: historia }), 'carrera',
      `No le ganas a ${pasoConRival.rival}`));
} else {
  console.log('FALLA no se encontro ningun paso con rival concreto -- las rachas no se pueden probar');
  fallas++;
}

caso('rachas: carrera nueva no muestra ninguna', () => {
  const html = dibujar(perfilDe(junior, { currentWeek: 40, datedResults: [] }), 'carrera', null);
  if (html.includes('No le ganas a')) throw new Error('sale una racha sin historial');
  return html;
});

// --- La lista de convocados, en el feed -----------------------------------------------------

const pasoDeFechaFifa = (() => {
  for (let p = 1; p <= 400; p++) if (esDiaDeEliminatorias(junior.name, p)) return p;
  return null;
})();

if (pasoDeFechaFifa == null) {
  console.log('FALLA no se encontro ninguna fecha FIFA en 400 pasos -- la convocatoria no se puede probar');
  fallas++;
} else {
  for (const c of CONVOCATORIAS) {
    caso(`seleccion: ${c.etiqueta} (paso ${pasoDeFechaFifa})`, () =>
      dibujar(
        perfilDe(junior, { currentWeek: pasoDeFechaFifa, prestige: c.prestige, partidos: c.partidos }),
        'chutsocial',
        c.esperado,
      ));
  }
}

// --- La pantalla de carrera en CELULAR --------------------------------------------------------
//
// En un telefono la pestana de carrera se apilaba entera: nueve bloques, seis pantallas de scroll,
// y el boton de jugar enterrado en el medio. Ahora muestra UNA seccion por vez con una barra abajo.
//
// Se comprueban las dos mitades del arreglo, porque una sin la otra no sirve: que la barra exista, y
// que las secciones que NO estan elegidas salgan ocultas. Si todas salieran visibles, el scroll
// seguiria siendo el mismo y la barra seria decoracion.
caso('celular: la carrera tiene barra de secciones', () => {
  const html = dibujar(perfilDe(junior, {}), 'carrera', 'Historia');
  if (!html.includes('md:hidden fixed bottom-0')) throw new Error('no esta la barra de abajo');
  // Dos de las tres secciones tienen que estar ocultas en celular.
  const ocultas = (html.match(/hidden md:block/g) ?? []).length;
  if (ocultas < 2) throw new Error(`solo ${ocultas} seccion(es) oculta(s): deberian ser 2 o mas`);
  return html;
});

// --- El panel del torneo de selecciones, en Copas y tablas -----------------------------------
//
// El agujero que cierra: el panel de copas tenia TRES ramas -- Conmebol, UEFA y "no estas en
// ninguna" -- y ninguna era del Mundial. Osea que en pleno Mundial, con el jugador jugandolo, la
// pestaña de copas decia "Tu club no esta clasificado a ningun torneo continental esta temporada"
// y no se podia ver ni el grupo ni el cuadro. El torneo se jugaba a ciegas.
//
// Se comprueba en los DOS torneos que le tocan a un colombiano -- el Mundial y la Copa America --
// porque son ramas distintas: el continental depende de la nacionalidad y el Mundial no.
//
// Y se comprueba tambien que FUERA de la ventana no salga, que es la otra mitad del pedido: el
// panel es de lo que se esta jugando hoy, no un archivo historico.
const pasoDeTorneo = (cual) => {
  for (let p = 1; p <= 900; p++) if (torneoDeSeleccionesDelDia(junior.name, p) === cual) return p;
  return null;
};

// El panel se marca con data-torneo y el caso busca ESO, no el nombre: "COPA MUNDIAL FIFA" ya
// aparecia en el titulo del panel de goleadores, asi que el caso del Mundial pasaba en verde con el
// panel apagado. Se descubrio reintroduciendo el bug a proposito, que es la unica forma de saber si
// un validador sirve. La marca ademas prueba CUAL torneo se dibuja, no solo que haya uno.
for (const t of [
  { cual: 'mundial', esperado: 'data-torneo="mundial"' },
  { cual: 'continental', esperado: 'data-torneo="copaamerica"' },
]) {
  const paso = pasoDeTorneo(t.cual);
  if (paso == null) {
    console.log(`FALLA no se encontro ninguna fecha de ${t.cual} en 900 pasos`);
    fallas++;
    continue;
  }
  caso(`copas: panel de ${t.cual} (paso ${paso})`, () =>
    dibujar(perfilDe(junior, { currentWeek: paso }), 'tablas', t.esperado,
      'no está clasificado a ningún torneo continental'));
}

caso('copas: fuera de la ventana no hay panel de selecciones', () =>
  dibujar(perfilDe(junior, { currentWeek: 20 }), 'tablas', null, 'data-torneo='));

const total = CLUBES.length * PASOS.length + PESTAÑAS.length + LESIONES.length + FORMAS.length + CONVOCATORIAS.length;
console.log(fallas === 0
  ? `\nEl Dashboard se dibuja en ${total} combinaciones de club, paso, pestaña, lesion, forma, animo, rachas, rival y convocatoria.`
  : `\n${fallas} FALLAS -- la pantalla principal no se puede dibujar`);
process.exit(fallas === 0 ? 0 : 1);
