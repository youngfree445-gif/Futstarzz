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
import { readFileSync } from 'fs';
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
  const html = dibujar(perfilDe(junior, {}), 'carrera', 'data-barra-de-secciones');
  // Dos de las tres secciones tienen que estar ocultas en celular.
  const ocultas = (html.match(/hidden md:block/g) ?? []).length;
  if (ocultas < 2) throw new Error(`solo ${ocultas} seccion(es) oculta(s): deberian ser 2 o mas`);
  return html;
});

// --- LAS OTRAS DOS PESTANIAS LARGAS, con atajos en vez de pestanias ----------------------------
//
// Copas y Tablas y Traspasos tambien se vuelven un scroll de varias pantallas en el telefono, pero
// no se arreglan escondiendo columnas: ahi queres poder comparar la tabla con el cuadro de la copa.
// Llevan atajos que te bajan al bloque, y por eso lo que se comprueba es que CADA atajo tenga a
// donde ir -- un boton que apunta a un id que no existe no hace nada y nadie se entera.
const anclasDe = (html) => new Set(
  [...html.matchAll(/id="([a-z-]+)"/g)].map(m => m[1]));

for (const [pestania, esperados] of [
  ['tablas', ['tabla-posiciones', 'tabla-goleadores']],
  ['traspasos', ['traspasos-ofertas', 'traspasos-radar', 'traspasos-agente']],
]) {
  caso(`celular: los atajos de ${pestania} tienen a donde ir`, () => {
    const html = dibujar(perfilDe(junior, {}), pestania, 'data-barra-de-atajos');
    const anclas = anclasDe(html);
    for (const id of esperados) {
      if (!anclas.has(id)) throw new Error(`el atajo apunta a #${id} y ese bloque no existe`);
    }
    return html;
  });
}

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

// --- EL APODO: que se dibuje, y que no se dibuje cuando no te lo ganaste ------------------------
//
// Se prueban las dos caras. La de arriba habria pasado igual con el apodo sin conectar: es la de
// abajo -- que la ficha NO diga el apodo cuando no hay con que -- la que cuida que no se invente uno.
const CON_APODO = {
  partidos: 60,
  jugadasPorAtributo: { pase: 44, regate: 10, tiro: 8, ritmo: 6, defensa: 4, fisico: 4 },
};

caso('apodo: la ficha lo dice', () =>
  dibujar(perfilDe(junior, CON_APODO), 'carrera', 'data-apodo="El Arquitecto"'));

caso('apodo: el feed te bautiza', () =>
  dibujar(perfilDe(junior, { ...CON_APODO, apodoAnunciado: { apodo: 'El Arquitecto', semana: 9 } }),
    'social', 'El Arquitecto'));

caso('apodo: sin nada que te defina, no hay apodo', () =>
  dibujar(perfilDe(junior, {
    partidos: 60,
    jugadasPorAtributo: { pase: 12, regate: 12, tiro: 12, ritmo: 12, defensa: 12, fisico: 12 },
    careerStats: { ...perfilDe(junior).careerStats, golesHistoricos: 5, asistenciasHistoricos: 3, partidosHistoricos: 60 },
  }), 'carrera', null, 'data-apodo'));

// --- LA VUELTA A CASA: que la oferta del club que te formo se vea, y que no se vea antes de tiempo
//
// La oferta se marca con data-vuelta-a-casa y no con su texto: el motivo lleva acentos y comillas
// que React escapa, y buscar por texto es como se colo un caso que pasaba con la feature apagada.
{
  const cartagena = ULTIMATE_CLUBS_DATABASE.find(c => c.name === 'Real Cartagena');
  const historia = [{ seasonNum: 1, clubId: cartagena.id, clubName: cartagena.name,
    goles: 8, asistencias: 4, partidos: 30, titulo: '' }];
  const oferta = [{ clubId: cartagena.id, salaryOffer: 4000, signOnBonus: 12000,
    reqPrestige: 99, reqMatches: 999, possible: true, generatedWeek: 9,
    esVueltaACasa: true, motivo: 'El club donde empezaste todo.' }];

  caso('casa: la oferta del club que te formo se ve', () =>
    dibujar(perfilDe(junior, { age: 34, seasonHistory: historia, pendingTransferOffers: oferta }),
      'traspasos', `data-vuelta-a-casa="${cartagena.name}"`));

  // Y la contracara: la MISMA oferta sin la marca no puede pintarse como vuelta a casa.
  caso('casa: una oferta cualquiera no se disfraza de vuelta a casa', () =>
    dibujar(perfilDe(junior, { age: 34, seasonHistory: historia,
      pendingTransferOffers: [{ ...oferta[0], esVueltaACasa: undefined, motivo: undefined }] }),
      'traspasos', null, 'data-vuelta-a-casa'));
}

// --- CUANTOS POSTS TIENE EL FEED EN EL PEOR CASO -----------------------------------------------
//
// En dos dias entraron CUATRO fuentes nuevas (el bautizo, la hemeroteca, la previa del clasico
// personal y el destino del pibe) a un feed que ya tenia 24. El feed no tiene tope: se dibuja
// entero. Este caso mide el peor caso real -- una fecha donde todo lo que puede pasar, pasa.
{
  const cartagena = ULTIMATE_CLUBS_DATABASE.find(c => c.name === 'Real Cartagena');
  const marcador = 'rounded-2xl space-y-2';

  const todoJunto = perfilDe(junior, {
    age: 34,
    currentWeek: 9,
    partidos: 60,   // el apodo pide 25 partidos: con los 9 de fabrica no se lo gano nunca

    lastMatchRating: 9.1,
    seasonHistory: [{ seasonNum: 1, clubId: cartagena.id, clubName: cartagena.name,
      goles: 8, asistencias: 4, partidos: 30, titulo: '🏆 Campeón' }],
    // el apodo
    jugadasPorAtributo: { pase: 44, regate: 10, tiro: 8, ritmo: 6, defensa: 4, fisico: 4 },
    apodoAnunciado: { apodo: 'El Arquitecto', semana: 9 },
    // la hemeroteca
    declaraciones: [{ texto: 'Salimos campeones seguro', saldo: 14, semana: 1,
      clubId: cartagena.id, clubName: cartagena.name }],
    // el pibe
    elPibe: { nombre: 'Brayan Osorio', clubName: 'Junior de Barranquilla', desdeSemana: 1,
      nivel: 88, temporadasConVos: 4, temporadas: 5,
      destino: { que: 'europa', semana: 9, relato: 'Brayan Osorio se fue a Europa.' } },
    // la lista, el refuerzo, la lesion, el bajon
    listaDeTransferibles: { desdeSemana: 8, temporadas: 0 },
    fichajeRival: { nombre: 'Kevin Restrepo', posicion: 'MC', desdeSemana: 8,
      nivel: 80, partidos: 10, goles: 5, asistencias: 3, sumaDeNotas: 75 },
    activeInjury: { type: 'muscular', weeksRemaining: 3, startedWeek: 7 },
    ultimaPrensa: { saldo: 8, semana: 9 },
    miPublicacion: { texto: 'Vamos por todo', saldo: 8, semana: 9 },
  });

  caso('feed: el peor caso sigue siendo legible', () => {
    const html = dibujar(todoJunto, 'chutsocial', null);
    const posts = html.split(marcador).length - 1;
    // Sin tope esto daba 50. El numero exacto no importa: importa que no vuelva a crecer sin freno
    // cada vez que se agrega una fuente nueva, que es lo que paso dos veces esta semana.
    if (posts > 25) throw new Error(`${posts} posts de una sola vez: el feed se volvio ilegible`);
    // Y la contracara: que el tope no se haya comido lo importante. Lo que te paso a VOS esta fecha
    // va arriba de todo y tiene que sobrevivir al corte.
    if (!html.includes('Brayan Osorio')) throw new Error('el tope se comio la noticia del pibe');
    if (!html.includes('El Arquitecto')) throw new Error('el tope se comio el bautizo');
    return html;
  });
}

// --- LA CAMISETA: que la 10 se vea distinta, y que un 27 no ---------------------------------------
caso('camiseta: la 10 se ve distinta', () =>
  dibujar(perfilDe(junior, { dorsal: 10 }), 'carrera', 'data-camiseta="10"'));
caso('camiseta: un numero cualquiera no se disfraza de 10', () =>
  dibujar(perfilDe(junior, { dorsal: 27 }), 'carrera', null, 'data-camiseta'));

// --- LA TIRA DE ESTADO DEL ENCABEZADO -----------------------------------------------------------
//
// Eran siete copias del mismo bloque de veinte lineas, y al unificarlas en un componente lo que hay
// que cuidar es que no se caiga ninguna por el camino. Se buscan por su marca y no por el rotulo:
// "Capital" y "Mente" aparecen en otros lados de la pantalla.
caso('encabezado: estan las siete metricas', () => {
  const html = dibujar(perfilDe(junior, {}), 'carrera', 'data-barra-de-estado');
  const faltan = ['energia', 'capital', 'dt', 'plantel', 'hinchada', 'entorno', 'mente']
    .filter(k => !html.includes(`data-medidor="${k}"`));
  if (faltan.length) throw new Error(`faltan medidores: ${faltan.join(', ')}`);
  return html;
});

// Y QUE EN ESCRITORIO NO ENVUELVA. Envolver a dos filas contra el borde derecho es exactamente lo
// que se veia amontonado en la primera captura que lo reporto.
caso('encabezado: en escritorio la tira no envuelve', () => {
  const html = dibujar(perfilDe(junior, {}), 'carrera', 'md:flex-nowrap');
  if (/data-barra-de-estado[^>]*md:flex-wrap/.test(html)) {
    throw new Error('la tira volvio a envolver en escritorio');
  }
  return html;
});

// LA REGLA QUE FALTABA, Y QUE HABRIA ATRAPADO LA SEGUNDA CAPTURA.
//
// Un validador que dibuja HTML no puede medir anchos, asi que no puede comprobar "entra en la
// pantalla". Pero SI puede comprobar la combinacion estructural que garantiza que no entre: una
// tira que no envuelve, compartiendo fila con la fecha. Con eso solo hay dos finales -- envolver
// desparejo o quedar CORTADA -- y los dos se reportaron con captura.
//
// La tira tiene que tener su propia fila, o sea que el header no puede ser una fila en escritorio.
caso('encabezado: la tira no comparte fila con la fecha', () => {
  const html = dibujar(perfilDe(junior, {}), 'carrera', null);
  const header = html.match(/<header class="([^"]*)"/);
  if (!header) throw new Error('no encuentro el encabezado');
  if (header[1].includes('md:flex-row')) {
    throw new Error('la tira comparte fila con la fecha: no entran, y la ultima queda cortada');
  }
  return html;
});


// --- LAS BARRAS DE NAVEGACION DEL CELULAR ---------------------------------------------------
//
// La regla: abajo y fija va UNA sola barra, la de la app. La de secciones de cada pestaña pasa a ir
// dentro del contenido. Antes las dos eran `fixed bottom-0` y se tapaban entre si -- cual ganaba
// dependia del orden del DOM, que es la clase de cosa que se ve rota en un telefono y no en el
// codigo.

caso('celular: la barra de la app tiene sus cinco destinos', () => {
  const html = dibujar(perfilDe(junior, {}), 'carrera', 'data-barra-de-app');
  const faltan = ['carrera', 'mi_club', 'entrenamiento', 'tablas', 'menu']
    .filter(k => !html.includes(`data-destino-de-app="${k}"`));
  if (faltan.length) throw new Error(`faltan destinos: ${faltan.join(', ')}`);
  return html;
});

caso('celular: hay UNA sola barra pegada abajo', () => {
  const html = dibujar(perfilDe(junior, {}), 'carrera', null);
  // La de la app SI es fija.
  const app = html.match(/<nav[^>]*data-barra-de-app[^>]*>/);
  if (!app) throw new Error('no encuentro la barra de la app');
  if (!/fixed/.test(app[0])) throw new Error('la barra de la app dejo de estar pegada abajo');
  // La de secciones NO puede serlo.
  const secciones = html.match(/<nav[^>]*data-barra-de-secciones[^>]*>/);
  if (secciones && /fixed/.test(secciones[0])) {
    throw new Error('la barra de secciones volvio a ser fija: se tapa con la de la app');
  }
  return html;
});

caso('celular: la barra de atajos tampoco es fija', () => {
  for (const pestaña of ['traspasos', 'tablas']) {
    const html = dibujar(perfilDe(junior, { currentWeek: 40 }), pestaña, null);
    const atajos = html.match(/<nav[^>]*data-barra-de-atajos[^>]*>/);
    if (atajos && /fixed/.test(atajos[0])) {
      throw new Error(`en ${pestaña} la barra de atajos es fija y se tapa con la de la app`);
    }
  }
  return dibujar(perfilDe(junior, { currentWeek: 40 }), 'traspasos', null);
});

caso('celular: en hardcore no aparece Entreno en la barra', () => {
  const html = dibujar(perfilDe(junior, { hardcoreEnabled: true }), 'carrera', 'data-barra-de-app');
  if (html.includes('data-destino-de-app="entrenamiento"')) {
    throw new Error('la barra ofrece Entrenamiento en un modo donde no existe');
  }
  return html;
});


caso('celular: el partido NO se esconde detras de un segmento', () => {
  const html = dibujar(perfilDe(junior, {}), 'carrera', 'data-hub-del-partido');
  // El bloque del partido no puede llevar la clase con la que se esconden las columnas: es lo que
  // venis a hacer, y tener que elegir una pestaña para llegar a el es la definicion de un scroll
  // de mas.
  const hub = html.match(/<div[^>]*data-hub-del-partido[^>]*>/);
  if (!hub) throw new Error('no encuentro el bloque del partido');
  if (/hidden/.test(hub[0])) throw new Error('el partido volvio a esconderse detras de un segmento');
  // Y la barra de segmentos no puede seguir ofreciendolo: seria un boton para ir a donde ya estas.
  const barra = html.match(/data-barra-de-secciones[\s\S]{0,1200}?<\/nav>/);
  if (barra && />Partido</.test(barra[0])) throw new Error('la barra sigue ofreciendo "Partido"');
  return html;
});


// --- EL HEXAGONO DE ATRIBUTOS ---------------------------------------------------------------
//
// La escala es FIJA de 0 a 99, no normalizada contra el maximo del propio jugador. Es la decision
// que hace util al grafico: normalizando, un juvenil de 55 y un crack de 95 dibujan el mismo
// hexagono y lo unico que existe para mostrar -- cuanto creciste -- desaparece.

caso('el hexagono se dibuja y lleva los seis atributos', () => {
  const html = dibujar(perfilDe(junior, {}), 'carrera', 'data-hexagono-de-atributos');
  // El perfil del validador tiene ritmo 55, regate 60, tiro 63, defensa 45, pase 65, fisico 50.
  // El marcador los lista en el orden de los ejes: ritmo, tiro, pase, regate, defensa, fisico.
  if (!html.includes('data-hexagono-de-atributos="55-63-65-60-45-50"')) {
    throw new Error('el hexagono no esta dibujando los atributos del jugador');
  }
  return html;
});

caso('el hexagono de un crack es mas grande que el de un juvenil', () => {
  const chico = { ritmo: 40, regate: 40, tiro: 40, defensa: 40, pase: 40, fisico: 40 };
  const grande = { ritmo: 95, regate: 95, tiro: 95, defensa: 95, pase: 95, fisico: 95 };
  const area = attrs => {
    const html = dibujar(perfilDe(junior, { attributes: attrs }), 'carrera', null);
    // El poligono del jugador es el que lleva la clase del relleno dorado.
    const m = html.match(/<polygon points="([^"]+)"[^>]*fill-gold/);
    if (!m) throw new Error('no encuentro el poligono del jugador');
    const ps = m[1].split(' ').map(p => p.split(',').map(Number));
    // Formula del area de un poligono por coordenadas.
    let a = 0;
    for (let i = 0; i < ps.length; i++) {
      const [x1, y1] = ps[i], [x2, y2] = ps[(i + 1) % ps.length];
      a += x1 * y2 - x2 * y1;
    }
    return Math.abs(a / 2);
  };
  const aChico = area(chico), aGrande = area(grande);
  if (!(aGrande > aChico * 4)) {
    throw new Error(`un 95 dibuja ${aGrande.toFixed(0)} y un 40 dibuja ${aChico.toFixed(0)}: la escala se esta normalizando`);
  }
  return dibujar(perfilDe(junior, {}), 'carrera', null);
});

caso('un defensor y un delantero dibujan siluetas distintas', () => {
  const forma = attrs => {
    const html = dibujar(perfilDe(junior, { attributes: attrs }), 'carrera', null);
    return html.match(/<polygon points="([^"]+)"[^>]*fill-gold/)[1];
  };
  const central = forma({ ritmo: 60, regate: 45, tiro: 40, defensa: 88, pase: 65, fisico: 85 });
  const nueve = forma({ ritmo: 85, regate: 84, tiro: 90, defensa: 35, pase: 60, fisico: 63 });
  if (central === nueve) throw new Error('los dos puestos dibujan el mismo hexagono');
  return dibujar(perfilDe(junior, {}), 'carrera', null);
});


// --- LO ACCIONABLE NO SE ESCONDE ------------------------------------------------------------
//
// Mi Carrera tiene cuatro segmentos en celular, y la regla de que panel va detras de cual es esta:
// lo que se CONSULTA (atributos, rival, ranking, historia) se elige; lo que se HACE esta siempre.
// El partido, la lesion y el bajon animico tienen botones, y una decision detras de una pestaña es
// una decision que el jugador no toma porque no se entera de que existe.

caso('celular: la lesion y el bajon nunca quedan detras de un segmento', () => {
  const enfermo = perfilDe(junior, {
    activeInjury: { type: 'muscular', weeksRemaining: 4, startedWeek: 5 },
    mentalHealth: 12,
  });
  const html = dibujar(enfermo, 'carrera', 'data-panel-accionable');
  for (const m of html.matchAll(/<div[^>]*data-panel-accionable="([^"]+)"[^>]*>/g)) {
    if (/hidden/.test(m[0])) throw new Error(`el panel "${m[1]}" se escondio detras de un segmento`);
  }
  return html;
});


// --- EL REPARTO DE LA GRILLA EN ESCRITORIO --------------------------------------------------
//
// Mi Carrera en PC son dos filas sobre seis columnas:
//
//     fila 1:  atributos (3)  +  partido y ranking (3)
//     fila 2:  rival (3)      +  estadisticas (3)
//
// Lo que hay que proteger no es el diseño sino la ARITMETICA: cada fila tiene que sumar seis. Si
// alguien le cambia el ancho a una tarjeta, las filas dejan de cerrar y la grilla se desarma sola
// -- una tarjeta baja media fila y queda un hueco al lado. Eso no lo ve tsc ni se nota en celular,
// donde todo va apilado.

const ANCHO_ESPERADO = { 1: 3, 2: 3, 3: 3, 4: 3 };

caso('escritorio: cada tarjeta conserva su ancho en la grilla', () => {
  const html = dibujar(perfilDe(junior, { currentWeek: 40 }), 'carrera', 'md:grid-cols-6');
  const vistos = {};
  for (const m of html.matchAll(/class="([^"]*md:order-(\d+)[^"]*)"/g)) {
    const orden = Number(m[2]);
    const ancho = Number((m[1].match(/md:col-span-(\d+)/) || [])[1]);
    if (!ancho) throw new Error(`la tarjeta de orden ${orden} no declara ancho`);
    if (ANCHO_ESPERADO[orden] !== ancho) {
      throw new Error(`la tarjeta de orden ${orden} mide ${ancho} y tiene que medir ${ANCHO_ESPERADO[orden]}`);
    }
    vistos[orden] = ancho;
  }
  // La fila 1 tiene que estar entera SIEMPRE: atributos y partido no son opcionales.
  for (const orden of [1, 2]) {
    if (!vistos[orden]) throw new Error(`falta la tarjeta de orden ${orden} en la fila de arriba`);
  }
  if (vistos[1] + vistos[2] !== 6) throw new Error('la primera fila no llena las seis columnas');
  return html;
});

caso('escritorio: el partido y el ranking comparten celda', () => {
  // Y esto es lo que tapa EL HUECO. La tarjeta del partido es corta y la de atributos es larga, asi
  // que si el partido ocupara solo su celda quedaba media pantalla vacia debajo -- reportado con
  // captura y un circulo rojo encima. El ranking se apila ahi adentro y llena el alto.
  const html = dibujar(perfilDe(junior, {}), 'carrera', null);
  const hub = html.match(/<div[^>]*data-hub-del-partido[^>]*>/);
  if (!hub) throw new Error('no encuentro el bloque del partido');
  if (/md:contents/.test(hub[0])) {
    throw new Error('el partido dejo de ser una celda: el ranking se le va a otra fila y vuelve el hueco');
  }
  if (!/md:col-span-3/.test(hub[0])) throw new Error('el bloque del partido no declara su ancho');
  return html;
});


// --- ENTRENO EN CELULAR ---------------------------------------------------------------------
//
// El orden en el telefono es: aviso de estado fisico, clinica, ejercicios, especializacion. En
// escritorio no cambia nada -- son las mismas dos columnas de siempre, y el aviso sigue abajo.
// Todo se hace con `order`, asi que lo unico que puede romperse en silencio es que alguien saque
// una clase.

caso('entreno: en celular la clinica va antes que los ejercicios', () => {
  // Se busca cada bloque por lo que ES, no por donde aparece: el orden del DOM ya no es el orden
  // visual -- de eso se trata `order` -- asi que leer el HTML de arriba a abajo no prueba nada.
  const html = dibujar(perfilDe(junior, { energy: 12 }), 'entrenamiento', 'Clínica de Fisioterapia');
  const ordenDe = (etiqueta, patron) => {
    const m = html.match(patron);
    if (!m) throw new Error(`no encuentro el bloque de ${etiqueta}`);
    const o = m[0].match(/order-(first|\d+)/);
    if (!o) throw new Error(`el bloque de ${etiqueta} no declara orden para celular`);
    return o[1] === 'first' ? -1 : Number(o[1]);
  };
  const aviso = ordenDe('el aviso de fatiga', /class="[^"]*p-4 rounded-xl border border-red-500\/30[^"]*"/);
  const clinica = ordenDe('la clinica', /data-panel-de-entreno="clinica"[^>]*/);
  const ejercicios = ordenDe('los ejercicios', /data-panel-de-entreno="ejercicios"[^>]*/);
  const especializacion = ordenDe('la especializacion', /data-panel-de-entreno="especializacion"[^>]*/);
  if (!(aviso < clinica && clinica < ejercicios && ejercicios < especializacion)) {
    throw new Error(`en celular el orden queda aviso ${aviso}, clinica ${clinica}, ejercicios ${ejercicios}, especializacion ${especializacion}`);
  }
  return html;
});

caso('entreno: las fotos de los ejercicios no se ven en celular', () => {
  const html = dibujar(perfilDe(junior, {}), 'entrenamiento', null);
  const fotos = [...html.matchAll(/<img[^>]*class="([^"]*)"[^>]*>/g)]
    .filter(m => /w-12 h-12 rounded-xl object-cover/.test(m[1]));
  if (!fotos.length) throw new Error('no encuentro las fotos de los ejercicios');
  for (const f of fotos) {
    if (!/hidden sm:block/.test(f[1])) throw new Error('una foto de ejercicio se ve en celular');
  }
  return html;
});


caso('plantel: en celular se ve un puesto por vez', () => {
  const html = dibujar(perfilDe(junior, {}), 'mi_club', 'data-barra-de-secciones="Puestos del plantel"');
  // Arranca en porteros: esa tarjeta se ve y las otras dos estan escondidas hasta que las elijas.
  const tarjeta = rot => {
    const m = html.match(new RegExp(`<div class="[^"]*"[^>]*>\s*<h3[^>]*>\s*<span>[^<]*${rot}`));
    return m ? m[0] : null;
  };
  const escondidas = ['Defensas', 'Ofensivos'].filter(r => {
    const t = tarjeta(r);
    return t && !/hidden/.test(t);
  });
  if (escondidas.length) throw new Error(`en celular se ven a la vez: ${escondidas.join(', ')}`);
  return html;
});


// --- COPAS Y TABLAS: LA TIRA DE "COMO VOY" ---------------------------------------------------
//
// Cada numero de la tira sale del MISMO panel que esta mas abajo. Lo que hay que proteger es
// justamente eso: que no se desincronicen. Si la tira dice 3o y la tabla te pone 5o, el jugador
// tiene razon en no creerle a ninguno de los dos.

caso('copas: la tira de competiciones se dibuja', () => {
  const html = dibujar(perfilDe(junior, { currentWeek: 40 }), 'tablas', 'data-resumen-de-competiciones');
  return html;
});

caso('copas: la posicion de la tira es la misma que la de la tabla', () => {
  const html = dibujar(perfilDe(junior, { currentWeek: 40 }), 'tablas', null);
  const linea = html.match(/data-linea-de-competicion="[^"]*"[^>]*>[\s\S]{0,220}?<\/div>/);
  if (!linea) {
    // Sin partidos jugados la tabla esta en cero y la tira puede no tener nada que decir: eso no
    // es una falla, es que todavia no paso nada.
    return html;
  }
  const puesto = linea[0].match(/>(\d+)º/);
  if (!puesto) throw new Error(`la linea no dice un puesto: ${linea[0].slice(0, 120)}`);
  const n = Number(puesto[1]);
  if (!(n >= 1 && n <= 40)) throw new Error(`la tira dice que vas ${n}º, que no es un puesto de una liga`);
  return html;
});


// --- LA COLUMNA DE LA FICHA VA AL FINAL EN CELULAR ------------------------------------------
//
// En el telefono la raiz es una columna, asi que la barra lateral -- ficha profesional, menu de
// escritorio, reportar un bug, guardar y salir -- caia ARRIBA DE TODO en las once pestañas.
// Entrabas a Entrenamiento y lo primero que veias era tu propia ficha. Reportado: "me toca bajar
// para de nuevo entrenar, no es nada comodo".

caso('celular: la ficha y las salidas van al final, no arriba', () => {
  const html = dibujar(perfilDe(junior, {}), 'carrera', null);
  const aside = html.match(/<aside[^>]*>/);
  if (!aside) throw new Error('no encuentro la columna de la ficha');
  if (!/order-last/.test(aside[0])) {
    throw new Error('la ficha volvio a quedar arriba de todo en celular');
  }
  if (!/md:order-none/.test(aside[0])) {
    throw new Error('la ficha dejo de ser la columna izquierda en escritorio');
  }
  return html;
});


caso('entreno: la especializacion va a lo ancho, no en una columna', () => {
  // Estaba arriba de la columna derecha: el quinto rol quedaba cortado por abajo y al lado de la
  // grilla de ejercicios --que es mas alta-- sobraba media pantalla. Reportado con un circulo rojo.
  const html = dibujar(perfilDe(junior, {}), 'entrenamiento', 'data-panel-de-entreno="especializacion"');
  const grilla = html.match(/<div class="[^"]*grid lg:grid-cols-3[^"]*"/);
  if (!grilla) throw new Error('no encuentro la grilla de entreno');
  const desde = html.indexOf(grilla[0]);
  const espe = html.indexOf('data-panel-de-entreno="especializacion"');
  const clinica = html.indexOf('data-panel-de-entreno="clinica"');
  if (!(clinica > desde)) throw new Error('la clinica dejo de estar dentro de la grilla, al lado de los ejercicios');
  if (!(espe > clinica)) throw new Error('la especializacion volvio a estar arriba de la clinica');
  return html;
});

caso('plantel: elegir un puesto no te manda al principio de la pantalla', () => {
  // SE LEE EL CODIGO, NO EL HTML, y esto vale anotarlo: la primera version de este caso miraba el
  // HTML buscando "scrollTo" y pasaba en verde con el bug puesto a proposito, porque renderToString
  // NO emite los manejadores de eventos -- un onClick no existe en el HTML. Un caso que no puede
  // fallar es peor que no tenerlo.
  //
  // La barra viaja CON el contenido, asi que al tocarla no te moviste de lugar: un scroll al tope te
  // lleva lejos de lo que acabas de pedir. Reportado: "siempre la pagina me lleva para arriba".
  const fuente = readFileSync('src/components/BarraDeSecciones.tsx', 'utf8');
  if (/window\.scrollTo/.test(fuente)) {
    throw new Error('la barra de secciones volvio a hacer scroll al tope al elegir');
  }
  return dibujar(perfilDe(junior, {}), 'mi_club', 'data-barra-de-secciones');
});

const total = CLUBES.length * PASOS.length + PESTAÑAS.length + LESIONES.length + FORMAS.length + CONVOCATORIAS.length;
console.log(fallas === 0
  ? `\nEl Dashboard se dibuja en ${total} combinaciones de club, paso, pestaña, lesion, forma, animo, rachas, rival y convocatoria.`
  : `\n${fallas} FALLAS -- la pantalla principal no se puede dibujar`);
process.exit(fallas === 0 ? 0 : 1);
