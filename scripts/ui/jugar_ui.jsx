// JUGAR EL JUEGO. No simularlo por fuera: montar <App /> y apretar los botones.
//
//   npm run jugar:ui -- "Borussia Dortmund" 3
//
// POR QUE EXISTE
//
// Los otros bancos de pruebas (scripts/jugar_carrera.ts, scripts/jugar_carrera_larga.ts) llaman al
// motor directamente. Eso alcanza para ver si el motor cierra sus torneos, pero NO ve lo que ve el
// jugador: App.tsx tiene su propio camino para decidir el rival de hoy, qué cartel poner y a qué
// cuadro aplicarle el resultado. Un bug que viva ahí -- en las 6.285 líneas entre el botón y el
// motor -- es invisible para ellos y evidente para cualquiera que juegue diez minutos.
//
// Reportado así: "estaba en una carrera en la que me metía a muchos partidos de Champions y ninguno
// era lógico, estaba totalmente rota la Champions con el Dortmund".
//
// QUE HACE
//
// Monta la app en un DOM de verdad, hace la creación de carrera clickeando la pantalla de setup, y
// después juega fecha tras fecha apretando "Simular partido" -- el mismo botón, el mismo motor, el
// mismo estado de React. De cada fecha anota lo que la pantalla DICE: el cartel de la competición,
// el rival, la localía y la jornada.
import { appendFileSync, writeFileSync } from 'fs';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../../src/App';
import { CHAMPIONS_2025, EUROPA_2025 } from '../../src/copasUefa';
import { CLUBS_DATABASE } from '../../src/data';
import { temporadaDeCarrera, anioDeCarrera } from '../../src/dateSchedule';

/** Los participantes reales de cada copa europea, por nombre, para revisar la bitácora afuera. */
export const datos = {
  champions: CHAMPIONS_2025.map(id => CLUBS_DATABASE.find(c => c.id === id)?.name ?? id),
  europa: EUROPA_2025.map(id => CLUBS_DATABASE.find(c => c.id === id)?.name ?? id),
};

const dormir = ms => new Promise(r => setTimeout(r, ms));
/** Espera a que una pantalla aparezca: React monta las pantallas con lazy(), no en el mismo tick. */
async function esperarA(cond, ms = 4000) {
  const hasta = Date.now() + ms;
  while (Date.now() < hasta) { if (cond()) return true; await dormir(40); }
  return false;
}
const texto = el => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
const botones = () => Array.from(document.querySelectorAll('button'));
const botonQueDice = re => botones().find(b => re.test(texto(b)));

/** Un click de verdad: el mismo evento que dispara el navegador. */
async function click(el) {
  if (!el) return false;
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  await dormir(0);
  return true;
}

/** Escribir en un input controlado por React (hay que pasar por el setter nativo). */
function escribir(input, valor) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, valor);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
}

// ---------------------------------------------------------------- qué hay en pantalla
const hayDialogo = () => document.querySelector('div[role="dialog"][aria-modal="true"]');
const hayCeremonia = () => document.querySelector('div.fixed.inset-0.z-\\[60\\]');
const hubDelPartido = () => document.querySelector('[data-hub-del-partido]');
const pantallaDeSetup = () => document.querySelector('#setup-screen');
const pantallaDeDecision = () => document.querySelector('#decision-center-view');
/**
 * LA PANTALLA DE RETIRO, que es el final feliz y no un cuelgue.
 *
 * El banco no la conocia: la clasificaba 'DESCONOCIDA', no encontraba nada que apretar y giraba 300
 * vueltas hasta que el detector de atascos cortaba la corrida. Las 19 carreras completas terminaron
 * asi -- todas exactamente a los 42 años, que es la edad a la que el juego te retira -- y el informe
 * decia "0 de 19 llegaron al retiro" cuando en realidad llegaron las 19.
 *
 * Se reconoce por sus dos botones, que no existen en ninguna otra pantalla.
 */
const pantallaDeRetiro = () => !!botonQueDice(/Ver tarjeta de carrera/i) && !!botonQueDice(/Volver al Inicio/i);
const simulando = () => /Simulando el partido/i.test(texto(document.body));

/**
 * La tarjeta del próximo partido, campo por campo, tal como la lee el jugador.
 *
 * Leerla como un bloque de texto no sirve: el hub del partido también contiene el ranking mundial,
 * y "Ranking mundial" se llevaba puesto el cartel de la competición en cada fecha de liga. Cada
 * dato sale ahora del span que lo dibuja.
 */
function proximoPartido() {
  const hub = hubDelPartido();
  if (!hub) return null;
  const tarjeta = hub.firstElementChild;           // la tarjeta dorada: partido + botones
  if (!tarjeta) return null;
  const spans = Array.from(tarjeta.querySelectorAll('span'));
  const t = texto(tarjeta);

  const compe = texto(tarjeta.querySelector('span.text-burgundy-500'));
  const jornada = texto(tarjeta.querySelector('span.absolute'));
  const localiaSpan = spans.find(s => /^(Local|Visitante|Sede por definir)$/i.test(texto(s)));
  const localia = /^Visitante$/i.test(texto(localiaSpan)) ? 'V'
    : /^Local$/i.test(texto(localiaSpan)) ? 'L' : '?';

  if (/Rival aún sin sortear/i.test(t)) {
    return { competicion: compe, jornada, rival: 'RIVAL SIN SORTEAR', localia, crudo: t };
  }
  const spanRival = spans.find(s => /^vs\s+/.test(texto(s)));
  return {
    competicion: compe,
    jornada,
    rival: texto(spanRival).replace(/^vs\s+/, '').trim(),
    localia,
    crudo: t,
  };
}

/**
 * LO QUE EL JUEGO ANOTÓ DE LA COPA EUROPEA, sacado de la partida guardada.
 *
 * Es la comprobación que decide todo: si el jugador disputó seis partidos de Champions y la tabla
 * que el juego guarda dice que su club jugó otra cantidad -- o con otros resultados -- entonces lo
 * que se juega y lo que se anota son dos torneos distintos.
 */
function copaEuropeaGuardada(guardada, competicion) {
  const copas = guardada?.uefaCups ?? {};
  // LA COPA QUE SE JUEGA HOY, que la dice la tarjeta.
  //
  // Antes se prefería siempre 'champions' y sólo se miraba 'europa' si la otra no existía. Pero las
  // dos claves conviven en el guardado: el que juega la Champions un año y la Europa al siguiente
  // deja la primera ahí para siempre. Resultado: toda una temporada de Europa League se anotaba con
  // el estado de una Champions terminada -- quince partidos con "ed=17 pasos=17 done", congelado --
  // y el chequeo de partidos por edición los sumaba todos juntos: "11 partidos de fase de liga".
  const porElCartel = /Europa/i.test(competicion ?? '') ? 'europa'
    : /Champions/i.test(competicion ?? '') ? 'champions' : null;
  const id = (porElCartel && copas[porElCartel]) ? porElCartel
    : copas.champions ? 'champions' : copas.europa ? 'europa' : null;
  if (!id) return null;
  const c = copas[id];
  const fila = (c.table ?? []).find(r => r.clubId === guardada.currentClubId);
  return {
    copa: id,
    etapa: c.stage,
    campeon: c.championId ?? null,
    pasos: c.stepsConsumed,
    arranco: c.startedAtStep,
    pj: fila?.pj ?? null,
    pts: fila?.puntos ?? null,
    gf: fila?.gf ?? null,
    gc: fila?.gc ?? null,
  };
}

/** Lo que el juego anotó de la copa de Conmebol: si la llave no avanza, la vuelta sale de nuevo. */
function copaConmebolGuardada(guardada) {
  const copas = guardada?.continentalCups ?? {};
  const k = Object.keys(copas)[0];
  if (!k) return null;
  const c = copas[k];
  const ronda = c.knockout?.tiesByRound?.[c.knockout.tiesByRound.length - 1] ?? null;
  const mia = ronda?.find(t => t.clubAId === guardada.currentClubId || t.clubBId === guardada.currentClubId);
  return {
    clave: k,
    etapa: c.stage,
    pasos: c.stepsConsumed,
    rondas: c.knockout?.tiesByRound?.length ?? 0,
    idaJugada: mia ? (mia.firstLegGoalsA !== null) : null,
    todasLaIda: ronda ? ronda.every(t => t.firstLegGoalsA !== null) : null,
  };
}

/** Lo que el juego anotó de la copa nacional: si la llave no avanza, se repite el mismo cruce. */
function copaNacionalGuardada(guardada) {
  const copas = guardada?.domesticCups ?? {};
  const k = Object.keys(copas)[0];
  if (!k) return null;
  const c = copas[k];
  const ronda = c.bracket?.tiesByRound?.[c.bracket.tiesByRound.length - 1] ?? null;
  const mia = ronda?.find(t => t.clubAId === guardada.currentClubId || t.clubBId === guardada.currentClubId);
  return {
    clave: k,
    rondas: c.bracket?.tiesByRound?.length ?? 0,
    llaves: ronda?.length ?? 0,
    miIda: mia ? (mia.firstLegGoalsA !== null) : null,
    miaJugada: mia ? mia.played : null,
    unico: mia ? !!mia.partidoUnico : null,
  };
}

/** El cuadrangular de liga, para entender por que la tarjeta no encuentra el cruce. */
function cuadrangularGuardado(guardada) {
  const cuadros = guardada?.playoffsDeLiga ?? {};
  const claves = Object.keys(cuadros);
  const mio = guardada?.currentClubId;
  const detalle = claves.map(k => {
    const b = cuadros[k];
    const rondas = b?.tiesByRound ?? [];
    const dentro = rondas.some(r => r.some(t => t.clubAId === mio || t.clubBId === mio));
    return `${k}[rondas=${rondas.length} dentro=${dentro} campeon=${b?.championId ?? '-'}]`;
  });
  const liga = Object.values(guardada?.leagueSeasons ?? {})[0];
  return `claves=${claves.length} ${detalle.join(' ')} tabla=${(liga?.table ?? []).length}`;
}

/** Lo que el juego anotó de la eliminatoria: si no avanza, el partido se repite todas las fechas. */
function eliminatoriaGuardada(guardada) {
  const e = guardada?.eliminatorias ?? {};
  const k = Object.keys(e)[0];
  if (!k) return null;
  const jugados = (e[k].grupos ?? []).reduce((n, g) => n + (g.fixtures ?? []).filter(f => f.played).length, 0);
  return { clave: k, pasos: e[k].stepsConsumed, jugados };
}

/** La partida tal como el juego la dejó guardada. Es el estado del juego, no una cuenta mía. */
function partidaGuardada() {
  const claves = Object.keys(localStorage).filter(k => /save|partida|futbol_star/i.test(k) && !/shop/i.test(k));
  for (const k of claves) {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      if (v && typeof v === 'object' && 'currentWeek' in v) return v;
    } catch { /* ignorar */ }
  }
  return null;
}

export async function jugar({ club = 'Borussia Dortmund', liga = 'Alemana', temporadas = 2,
  /**
   * Tope de vueltas del bucle, para que una corrida rota no gire para siempre.
   *
   * Sale del NUMERO DE TEMPORADAS y ya no es un numero fijo: 6000 alcanzaba de sobra para las tres
   * temporadas de los barridos, y cortaba una carrera larga a la mitad. Medido: una carrera de 24
   * temporadas se corto en la 11, a los 27 años -- justo antes de la edad en la que el club que te
   * formo te llama de vuelta (32), que era lo que se queria ver.
   *
   * Unas 700 vueltas por temporada da margen: una temporada colombiana son ~55 partidos y cada uno
   * gasta varias vueltas entre la tarjeta, el partido y el post.
   */
  maxPasos = Math.max(6000, 700 * (Number(temporadas) || 2)), verboso = true,
  /**
   * LA RUTA DE LA CARRERA: por que clubes fichar, EN ORDEN, en cuanto aparezca la oferta.
   *
   * Los pasos se separan con COMA y las alternativas de un mismo paso con BARRA:
   *
   *   'Ajax/PSV/SL Benfica, Real Madrid/FC Barcelona, Banfield'
   *   -> primero cualquiera de los tres holandeses o el Benfica, despues cualquiera de los dos
   *      grandes, y al final la vuelta a casa.
   *
   * Las alternativas no son comodidad: son lo que hace que la prueba se pueda correr. El mercado
   * sortea TRES ofertas por periodo entre cientos de clubes elegibles, asi que pedir uno puntual es
   * esperar a que salga la loteria -- se probo pidiendo 'FC Barcelona' y en catorce temporadas no
   * aparecio una sola vez, con el jugador en prestigio 100 y con ofertas de Liverpool, Newcastle y
   * Everton sobre la mesa. El que no aparecia era el club pedido, no la oferta.
   *
   * Hasta ahora el banco jugaba toda la carrera en el club donde empezaba, asi que el traspaso --
   * que es la mitad del juego -- no lo habia recorrido nadie.
   *
   * Y va en ORDEN y no de a uno porque el arco que importa tiene dos escalas: te vas al grande y a
   * los 32 el club que te formo te llama de vuelta (ver teLlamaLaCasa en clubQueTeFormo.ts, que
   * ademas se saltea todos los requisitos). Con un solo fichaje esa segunda mitad no se puede
   * probar.
   */
  ficharPor = null,
  /** Edad con la que arranca la carrera. El formulario ofrece un <select>; 17 es lo que trae. */
  edad = null,
  /** La nacionalidad del jugador, por su etiqueta ("Uruguay", "Nigeria"). De ella salen las
   *  eliminatorias y la convocatoria al Mundial, asi que cambia bastante mas que la bandera. */
  nacionalidad = null } = {}) {
  const raiz = createRoot(document.getElementById('root'));
  raiz.render(React.createElement(App));
  await dormir(80);

  // ---------------------------------------------------------------- 1. crear la carrera
  await click(botonQueDice(/Nueva Partida/i));
  if (!await esperarA(pantallaDeSetup)) throw new Error('No se abrió la pantalla de creación de carrera.');

  escribir(document.querySelector('#setup-screen input[type="text"]'), 'Camilo Restrepo');
  await dormir(30);

  // El botón de la liga muestra el PAÍS ("Alemania"), no la clave de la liga ("Alemana").
  const PAIS = {
    Alemana: 'Alemania', Inglesa: 'Inglaterra', Española: 'España', Italiana: 'Italia',
    Francesa: 'Francia', Holandesa: 'Holanda', Portuguesa: 'Portugal', Colombiana: 'Colombia',
    Brasileña: 'Brasil', Argentina: 'Argentina', Mexicana: 'México', Uruguaya: 'Uruguay',
    Ecuatoriana: 'Ecuador', Chilena: 'Chile', Peruana: 'Perú', Paraguaya: 'Paraguay',
    Boliviana: 'Bolivia', Venezolana: 'Venezuela', Estadounidense: 'EE.UU.',
  };
  const etiqueta = PAIS[liga] ?? liga;
  const botonLiga = botones().find(b => texto(b).endsWith(etiqueta));
  if (!botonLiga) throw new Error('No encontré el botón de la liga ' + liga);
  await click(botonLiga);
  await dormir(80);

  const botonClub = botones().find(b => texto(b).includes(club));
  if (!botonClub) throw new Error('No encontré a ' + club + ' en la lista de clubes de la liga ' + liga);
  await click(botonClub);
  await dormir(60);

  // LA EDAD, si se pidio una. Es un <select>, asi que se le pone el valor y se avisa a React.
  if (edad) {
    const selects = Array.from(document.querySelectorAll('#setup-screen select'));
    const elDeLaEdad = selects.find(sel => Array.from(sel.options).some(o => o.value === String(edad)));
    if (elDeLaEdad) {
      elDeLaEdad.value = String(edad);
      elDeLaEdad.dispatchEvent(new window.Event('change', { bubbles: true }));
      await dormir(60);
    }
  }

  // LA NACIONALIDAD. El formulario la pone sola igual al pais de la liga; para pedir otra hay que
  // apretar su boton, que es lo que marca `nationalityTouched` y evita que se la vuelva a pisar.
  if (nacionalidad) {
    // SOLO DENTRO DEL SELECTOR DE NACIONALIDAD.
    //
    // El formulario tiene DOS selectores de pais con las mismas etiquetas -- la liga de origen y la
    // nacionalidad -- porque comparten la misma lista. Buscando "Alemania" en toda la pantalla se
    // apretaba el de la LIGA: eso cambiaba el pais, reseteaba la lista de clubes al primer aleman y
    // de paso ponia la nacionalidad. Se pidio Real Madrid con pasaporte aleman y salio 1. FC Koln.
    const grilla = document.querySelector('#selector-de-nacionalidad');
    if (!grilla) throw new Error('No encontre el selector de nacionalidad en el formulario.');
    const botonNac = Array.from(grilla.querySelectorAll('button')).find(b => texto(b).endsWith(nacionalidad));
    if (botonNac) { await click(botonNac); await dormir(60); }
    else throw new Error('No encontre la nacionalidad ' + nacionalidad + ' en el formulario.');
  }

  await click(botonQueDice(/Comenzar Carrera/i));
  if (!await esperarA(hubDelPartido, 15000)) {
    throw new Error('La carrera no arrancó. En pantalla dice: ' + texto(document.body).slice(0, 1200));
  }

  // ---------------------------------------------------------------- 2. jugarla
  const bitacora = [];
  const avisos = [];
  let pasos = 0;
  let ultimoPaso = -1;
  // EL DETECTOR DE ATASCO, contado en vueltas del bucle y no en visitas al dashboard: la primera
  // versión sólo contaba cuando había dashboard, así que un ciclo entre dos pantallas que no son
  // el dashboard giraba las 6.000 vueltas sin que saltara nada. Se reinicia únicamente cuando la
  // FECHA avanza, que es el único progreso que cuenta.
  let vueltaDelUltimoAvance = 0;
  let vueltasEnLaCancha = 0;
  /** Ya se acepto el traspaso pedido: no se vuelve a intentar. */
  /** Los clubes que faltan fichar, en orden. Se saca el primero cuando se concreta. */
  const rutaPendiente = (ficharPor ?? '').split(',')
    .map(paso => paso.split('/').map(x => x.trim().toLowerCase()).filter(Boolean))
    .filter(alternativas => alternativas.length);
  /** La fecha en la que ya se probo fichar, para no volver a mirar en la misma. */
  let ultimoIntentoDeFichaje = -1;
  /** La ultima mesa de ofertas vista, para anotar solo los cambios. */
  let ultimaMesa = null;
  /**
   * POR QUE TERMINO LA CORRIDA. Se anota en cada salida del bucle.
   *
   * El banco terminaba sin decir nunca por que, y eso deja preguntas sin respuesta: tres carreras
   * seguidas cerraron a los 42 -- justo un año antes de la pantalla de retiro -- sin atasco, sin
   * llegar al tope de pantallas y sin aviso. Con el motivo anotado se sabe de una lectura si fue el
   * juego, el tope o el reloj.
   */
  let motivoDelFinal = 'el bucle llego al tope de vueltas';
  /** Si la carrera llego hasta el retiro. No se puede leer del perfil guardado: la partida termina
   *  en pantalla y el guardado que queda en el disco es el de la ultima fecha jugada. */
  let retirado = false;

  const pantalla = () => pantallaDeRetiro() ? 'retiro'
    : hayCeremonia() ? 'ceremonia' : hayDialogo() ? 'dialogo'
    : pantallaDeDecision() ? 'decision' : simulando() ? 'simulando'
    : botonQueDice(/Regresar al Vestuario/i) ? 'post-partido'
    : hubDelPartido() ? 'dashboard' : 'DESCONOCIDA';

  // EL PRESUPUESTO DE TIEMPO, para que una corrida trabada entregue veredicto igual.
  //
  // El detector de atasco de abajo mide vueltas sin que avance la FECHA, y hay cuelgues que no se
  // ven asi: la fecha sigue corriendo, no se juega ningun partido, y el bucle gira hasta maxPasos.
  // Ahi el barrido lo mataba por tiempo con SIGKILL y el informe no llegaba a imprimirse nunca --
  // cinco ligas europeas seguidas quedaron sin veredicto por esto, que es peor que un veredicto
  // parcial. Con el corte propio la corrida termina por las suyas y correr.mjs alcanza a contar
  // que se jugo hasta ahi (y lo marca como cortada, ver seCorto).
  const limite = Date.now() + Math.max(1, Number(process.env.MINUTOS_DE_BANCO) || 20) * 60_000;

  // DONDE SE VA EL TIEMPO. Una carrera tarda veinte minutos y hasta ahora no habia forma de saber
  // en que: se acumula el reloj de pared por tipo de pantalla, que es lo unico que permite decidir
  // que optimizar en vez de adivinar.
  const gastoPorPantalla = new Map();
  let relojDeLaVuelta = Date.now();

  while (pasos < maxPasos) {
    {
      const ahora = Date.now();
      const donde = pantalla();
      gastoPorPantalla.set(donde, (gastoPorPantalla.get(donde) ?? 0) + (ahora - relojDeLaVuelta));
      // Y EL RECORRIDO DE PANTALLAS de la fecha en curso: cuando una tarjeta se anuncia y el partido
      // no ocurre, esto es lo unico que dice por donde se fue el dia.
      const enCurso = bitacora[bitacora.length - 1];
      if (enCurso) {
        enCurso.pantallas = enCurso.pantallas ?? [];
        if (enCurso.pantallas[enCurso.pantallas.length - 1] !== donde) enCurso.pantallas.push(donde);
        // QUE EL PARTIDO SE JUGO SE MARCA ACA, no dentro de la rama de post-partido.
        //
        // Llegar a la pantalla de post-partido es la prueba de que hubo partido -- el marcador no
        // sirve, porque sale de buscar "N-N" en el resumen y en los partidos de seleccion ese texto
        // no aparece. Pero marcarlo DENTRO de esa rama tampoco alcanzaba: cuando el partido se juega
        // a mano, el simulador sigue montado y la rama que lo atiende esta antes, asi que la de
        // post-partido no se ejecutaba y la fecha quedaba como "prometida y no jugada". Medido: 4 de
        // cada 16 carreras del Inter, siempre en vueltas de Champions que SI se jugaron -- la copa
        // avanzaba su paso y cambiaba de ronda.
        //
        // Esta foto se toma arriba del bucle, antes de elegir rama, asi que no la puede tapar nadie.
        if (donde === 'post-partido') enCurso.seJugo = true;
      }
      relojDeLaVuelta = ahora;
    }
    pasos++;

    // COLGO LOS BOTINES: se termino la carrera, y es la unica salida que no es un problema.
    if (pantallaDeRetiro()) {
      retirado = true;
      const dice = texto(document.body);
      const edad = dice.match(/colg[oó] los botines a los (\d+) a[nñ]os/i)?.[1];
      motivoDelFinal = `se retiro${edad ? ` a los ${edad} años` : ''}`;
      break;
    }

    if (Date.now() > limite) {
      avisos.push('ATASCO por tiempo en la fecha ' + ultimoPaso + '. Pantalla: ' + pantalla());
      motivoDelFinal = 'se acabo el presupuesto de tiempo';
      break;
    }
    if (pasos - vueltaDelUltimoAvance > 300) {
      // Los BOTONES, no sólo el texto: cuando el banco se traba es porque no encontró qué apretar,
      // y la lista de lo que había en pantalla es lo único que lo explica.
      const rotulos = botones().map(b => texto(b)).filter(Boolean).slice(0, 40);
      avisos.push('ATASCO en la fecha ' + ultimoPaso + '. Pantalla: ' + pantalla()
        + '. Botones: [' + rotulos.join(' | ') + ']. Dice: ' + texto(document.body).slice(0, 500));
      motivoDelFinal = 'atasco: 300 vueltas sin que avanzara la fecha';
      break;
    }

    // Ceremonia de fichaje (portada + entrevista): se sale por el final, no tiene cerrar.
    // LA DECISION MANDA SOBRE LA CEREMONIA. Las dos son capas fijas y pueden estar encimadas: si se
    // atiende la ceremonia primero y la que de verdad esta arriba es la decision, los clicks no
    // llegan a ningun lado. Medido: carrera colgada en la entrevista de fichaje con un evento de
    // decision abierto detras.
    if (hayCeremonia() && !pantallaDeDecision()) {
      // "Ir a la presentacion" es el boton de la PORTADA DE FICHAJE, y faltaba: esa pantalla no se
      // habia visto nunca porque el banco nunca habia fichado por nadie. Sin el, el manejador caia
      // al respaldo -- apretar el ultimo boton de la pantalla -- y la carrera se colgaba ahi mismo,
      // recien traspasada. Medido: dos carreras muertas en la ceremonia, una a los 17 y otra a los 20.
      // LA RUEDA DE PRENSA SE CONTESTA, no se saltea.
      //
      // En la entrevista de fichaje los botones son las RESPUESTAS -- frases entre comillas, sin
      // ningun "siguiente" a la vista -- y el manejador no las reconocia: caia al respaldo, apretaba
      // el ultimo boton de la pantalla (el menu) y la carrera se colgaba recien traspasada.
      //
      // Se contesta la primera, que es la respuesta diplomatica. Elegir cual importa poco para el
      // banco; lo que importa es no quedarse mudo frente al microfono.
      // Y PRIMERO SE MIRA SI HAY POR DONDE AVANZAR. Las respuestas quedan en pantalla despues de
      // elegir una -- marcando cual elegiste -- asi que buscando la respuesta primero se volvia a
      // apretar la misma para siempre, con "Siguiente pregunta" ahi al lado sin tocar.
      // Y SOLO LOS BOTONES DE LA CEREMONIA, no los de toda la pantalla: detras sigue montado el
      // dashboard entero con sus veinte botones, y el respaldo "apreta el ultimo" terminaba tocando
      // el menu.
      const dentro = Array.from(hayCeremonia().querySelectorAll('button'));
      const diceEnLaCeremonia = re => dentro.find(x => re.test(texto(x)));
      const avanzar = diceEnLaCeremonia(/Ir a la presentaci|Continuar|Siguiente|Terminar|Listo|Empezar|Firmar/i);
      const b = avanzar
        ?? dentro.find(x => /^[“"«]/.test(texto(x)))
        ?? dentro.at(-1);
      await click(b); await dormir(60); continue;
    }
    // Overlays de campeón / fin de temporada / nueva temporada / balón de oro.
    const dlg = hayDialogo();
    if (dlg) {
      avisos.push(texto(dlg).slice(0, 260));
      await click(Array.from(dlg.querySelectorAll('button')).at(-1)); await dormir(60); continue;
    }
    // Evento de vestuario/lobby. Son DOS clicks, no uno: elegir la opción no resuelve nada hasta
    // que se aprieta "Confirmar Acción" -- y clickear sólo la opción dejaba el bucle girando para
    // siempre sobre la misma pantalla. Se elige la última, que es la prudente (rechazar, gratis).
    if (pantallaDeDecision()) {
      const enDecision = () => Array.from(document.querySelectorAll('#decision-center-view button'));
      const esConfirmar = b => /Confirmar/i.test(texto(b));
      const opciones = enDecision().filter(b => !esConfirmar(b));
      if (opciones.length) { await click(opciones[opciones.length - 1]); await dormir(40); }
      await click(enDecision().find(esConfirmar) ?? opciones[0]);
      await dormir(120); continue;
    }
    // El partido se está resolviendo. Acá la pantalla dice contra QUIEN se juega de verdad, que es
    // el dato que hay que comparar con lo que anunció la tarjeta: si no coinciden, el resultado le
    // entra a otro torneo (o a otra llave) y el cuadro no avanza.
    if (simulando()) {
      const enCancha = (texto(document.body).match(/vs\s+(.+?)\s+Jugás igual/) ?? [])[1];
      const ult = bitacora[bitacora.length - 1];
      if (enCancha && ult && ult.rival && enCancha.trim() !== ult.rival) {
        ult.rivalDelPartido = enCancha.trim();
        appendFileSync(process.env.PROGRESO || 'scripts/ui/progreso.log',
          '      !! f' + ult.paso + ': la tarjeta decía ' + ult.rival + ' y se juega contra ' + enCancha.trim() + String.fromCharCode(10));
      }
      await dormir(150);
      continue;
    }

    // EL PARTIDO JUGADO, no simulado. Se llega acá cuando la tarjeta no ofrece "Simular partido"
    // (por ejemplo arrancando en el banco), y el banco tiene que saber jugarlo o se cuelga los
    // noventa minutos: se pone la velocidad en "Saltar" y se contesta cada decisión.
    const simulador = document.querySelector('#match-simulator');
    if (simulador) {
      if (!simulador.dataset.bancoVisto) { simulador.dataset.bancoVisto = '1'; vueltasEnLaCancha = 0; }
      const enCancha = () => Array.from(simulador.querySelectorAll('button'));
      // Las opciones de una decisión son las únicas que muestran "Riesgo:". Buscarlas por descarte
      // (todo lo que no sea 1x/2x/4x/Saltar) agarraba el botón de reportar un bug y el partido se
      // quedaba clavado en el minuto 16.
      const opciones = enCancha().filter(b => /Riesgo:/i.test(texto(b)));
      if (opciones.length) { await click(opciones[0]); await dormir(60); continue; }
      // Los palos del arco, cuando la decisión es un penal o un tiro libre.
      const palos = enCancha().filter(b => /Izquierda|Derecha|Centro|Palo|Ángulo/i.test(texto(b)));
      if (palos.length) { await click(palos[0]); await dormir(60); continue; }
      // LA CHARLA DEL ENTRETIEMPO. El reloj del partido se para mientras el DT habla
      // (charlaDelDT en MatchSimulator), y sin contestarle el banco se queda ahí para siempre:
      // era la causa de casi todos los cuelgues del barrido -- la mitad de las ligas no llegaba al
      // final de la temporada por esto. Se le hace caso al técnico, que es lo que haría cualquiera.
      const charla = botonQueDice(/Salir a hacer lo que pide|Jugar a tu manera/i);
      if (charla) { await click(charla); await dormir(60); continue; }
      // El partido queda PAUSADO cuando se abre un panel (narración, táctica). Sin apretar esto
      // el reloj no vuelve a correr y el banco se queda mirando el minuto 12 para siempre.
      const volverAlPartido = botonQueDice(/Volver al Partido/i);
      if (volverAlPartido) { await click(volverAlPartido); await dormir(60); continue; }
      // Sin decisión pendiente: al máximo de velocidad y a esperar.
      //
      // UNA SOLA VEZ. Apretarlo en cada vuelta del bucle volvía a montar el efecto que lleva el
      // reloj del partido (ver la nota de speedMultiplier en MatchSimulator.tsx) y el minuto se
      // quedaba congelado para siempre: el banco se colgaba en el minuto 11 sin que el partido
      // avanzara nunca. El botón activo se reconoce por su color.
      const saltar = enCancha().find(b => texto(b) === 'Saltar');
      if (saltar && !/bg-gold-500/.test(saltar.className)) await click(saltar);
      vueltasEnLaCancha++;
      // Si el partido no avanza en veinte vueltas, se vuelve a pedir velocidad: el efecto del
      // reloj puede haberse quedado sin timer al montarse una decision que ya se resolvio.
      if (vueltasEnLaCancha % 20 === 0 && saltar) await click(saltar);
      await dormir(120);
      continue;
    }

    // La tanda de penales: sus botones son los palos del arco, cualquiera sirve.
    if (/Tanda de penales|Definición por penales/i.test(texto(document.body))) {
      const tiro = botones().find(b => texto(b).length > 0 && !/Saltar|Continuar/i.test(texto(b)));
      if (tiro) { await click(tiro); await dormir(80); continue; }
    }
    // Resumen post partido.
    const volver = botonQueDice(/Regresar al Vestuario/i);
    if (volver) {
      const cuerpo = texto(document.body);
      const marcador = (cuerpo.match(/(\d+)\s*[-–]\s*(\d+)/) ?? []).slice(1, 3).join('-');
      // CONTRA QUIEN SE JUGO DE VERDAD. La tarjeta anuncia un rival y el partido puede ser contra
      // otro: es la clase de desfase que ya se cobró varios bugs, y sin mirarlo no se ve.
      const ultimo = bitacora[bitacora.length - 1];
      // SE COMPARA POR LA PALABRA QUE IDENTIFICA AL CLUB, no por el nombre entero.
      //
      // El resumen del partido no siempre escribe el nombre completo: la tarjeta dice "1. FC Union
      // Berlin" o "Stade Rennais FC" y el resumen dice "Union Berlin" o "Rennes". Comparando cadena
      // contra cadena, cada uno de esos salia marcado como "el partido fue contra otro" -- ruido
      // que tapa los desfases de verdad, que es lo unico que este chequeo existe para encontrar.
      //
      // Se sacan las particulas que no identifican a nadie (FC, CF, SC, AS, AJ, RB, CD, UD, Stade,
      // Club, de...) y alcanza con que UNA palabra propia del rival aparezca en el resumen.
      const RUIDO = /^(1|fc|cf|sc|ac|as|aj|rb|sd|ud|cd|afc|ss|us|sv|vfb|vfl|bsc|club|stade|de|del|la|el|los|city|fk|bk|ka|kv|nk)$/i;
      const palabrasDe = n => (n || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
        .split(/[^A-Za-z0-9]+/).filter(w => w.length >= 4 && !RUIDO.test(w));
      const cuerpoPlano = cuerpo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      const propias = palabrasDe(ultimo?.rival);
      const loNombra = cuerpo.includes(ultimo?.rival ?? ' ')
        || (propias.length > 0 && propias.some(w => cuerpoPlano.includes(w.toLowerCase())));
      if (ultimo && ultimo.rival && !loNombra) {
        ultimo.rivalDelPartido = 'OTRO (la tarjeta decía ' + ultimo.rival + ')';
        // El resumen, recortado: sin verlo no se puede decidir si es un desfase o el nombre corto.
        ultimo.diceElResumen = cuerpo.slice(0, 220).replace(/\s+/g, ' ');
        appendFileSync(process.env.PROGRESO || 'scripts/ui/progreso.log',
          '      !! el partido NO fue contra ' + ultimo.rival + ' (fecha ' + ultimo.paso + '). El resumen dice: '
          + ultimo.diceElResumen + String.fromCharCode(10));
      }
      if (bitacora.length) bitacora[bitacora.length - 1].marcador = marcador;
      await click(volver); await dormir(80); continue;
    }

    // Dashboard: acá se juega.
    const hub = hubDelPartido();
    if (!hub) {
      // SIN HUB: quizas quedamos en otra pestaña. Se vuelve a Carrera en vez de esperar sentado.
      //
      // El boton de jugar vive SOLO en la pestaña Carrera. Despues de un fichaje el banco queda en
      // Traspasos -- y la ceremonia se lleva por delante el click de vuelta --, asi que se quedaba
      // mirando una pantalla sin hub hasta el atasco. La carrera moria recien traspasada, con el
      // fichaje hecho y el calendario del club nuevo funcionando: "Napoli, FECHA 22/38, viernes 28
      // de enero de 2028" y ningun boton que apretar.
      const volver = botonQueDice(/^Carrera$/i);
      if (volver) { await click(volver); await dormir(120); continue; }
      await dormir(100); continue;
    }

    const guardada = partidaGuardada();
    const paso = guardada?.currentWeek ?? -1;
    // La temporada la calcula el JUEGO a partir del paso: el perfil no la guarda como número, y
    // leyendo un campo inexistente toda la carrera salía como 'temporada 1'.
    // LA TEMPORADA SE CUENTA CON EL CLUB ACTUAL, no con el de partida.
    //
    // Al fichar, el paso se remapea al calendario del club NUEVO (ver pasoEnElClubNuevo). Contando
    // con el nombre del club inicial, ese paso caia en otra temporada: una carrera que ficho en la
    // fecha 127 se dio por terminada en la "temporada 2", a los 18 años.
    const clubDeAhora = CLUBS_DATABASE.find(c => c.id === guardada?.currentClubId)?.name ?? club;
    const temp = paso > 0 ? temporadaDeCarrera(clubDeAhora, paso) : 1;
    // LA PARTIDA SE GUARDA CADA TANTO, no solo al terminar.
    //
    // Una carrera larga son cuarenta y pico de minutos, y si la sesion se corta en el medio se
    // pierde entera: paso una noche con dos carreras de veinte temporadas. Un volcado cada cincuenta
    // fechas cuesta nada y deja siempre algo en disco.
    if (paso !== ultimoPaso && paso > 0 && paso % 50 === 0 && process.env.BITACORA) {
      try {
        writeFileSync(process.env.BITACORA.replace(/\.json$/, '.parcial.json'),
          JSON.stringify({ hasta: paso, temporada: temp, bitacora, avisos, guardada }, null, 1));
      } catch { /* si no se puede escribir, la corrida sigue igual */ }
    }
    if (paso !== ultimoPaso) vueltaDelUltimoAvance = pasos;
    ultimoPaso = paso;
    if (temp > temporadas) {
      motivoDelFinal = `se pidieron ${temporadas} temporadas y el calendario de ${clubDeAhora} ya va por la ${temp}`;
      break;
    }

    // ¿HAY QUE FICHAR POR ALGUIEN? Se mira una vez por fecha, antes de jugar.
    //
    // El flujo de la pantalla son tres pasos y hay que darlos en orden: abrir la pestaña Traspasos
    // (que ademas es la que PIDE las ofertas, ver onRefreshTransferOffers), apretar "Aceptar
    // Traspaso" en la oferta del club buscado, y confirmar. El confirm() del navegador lo contesta
    // el entorno con `true`.
    // UNA VEZ POR FECHA, y no en cada vuelta: el primer intento entraba en bucle -- abria
    // Traspasos, no encontraba oferta, volvia, y repetia sin jugar nunca. Atasco en la fecha -1.
    if (rutaPendiente.length && paso !== ultimoIntentoDeFichaje) {
      ultimoIntentoDeFichaje = paso;
      const pestana = botonQueDice(/^Traspasos$/i);
      if (pestana) {
        await click(pestana); await dormir(120);
        // La oferta del club buscado: su tarjeta es la que menciona el nombre y trae el boton.
        // LA TARJETA DE LA OFERTA, no el cajon de los botones.
        //
        // Subir UN solo nivel desde el boton caia en el contenedor que tiene nada mas "Aceptar
        // Traspaso" y "Salir a prestamo": el nombre del club esta varios niveles mas arriba. Con eso
        // la busqueda no podia coincidir nunca, y el banco reporto CERO traspasos en 24 temporadas
        // -- con las tres ofertas ahi, a la vista. Era el instrumento, no el juego.
        //
        // Se sube hasta que el texto tenga cuerpo suficiente para incluir el nombre, con tope para
        // no terminar leyendo la pantalla entera.
        // Se sube mientras el ancestro siga teniendo UN SOLO boton de aceptar: ese es el limite de la
        // tarjeta. Subir por TAMAÑO DE TEXTO se pasaba de largo y agarraba la grilla entera, asi que
        // cualquier boton coincidia con cualquier club de la lista -- se pidio fichar por ocho clubes
        // concretos y se termino en el Borussia Dortmund, que no era ninguno.
        const cuantasOfertas = el => Array.from(el.querySelectorAll('button'))
          .filter(x => /Aceptar Traspaso/i.test(texto(x))).length;
        const tarjetaDe = b => {
          let el = b;
          while (el.parentElement && cuantasOfertas(el.parentElement) === 1) el = el.parentElement;
          return el;
        };
        // LA MESA, anotada SOLO CUANDO CAMBIA.
        //
        // Se renueva cada seis fechas (FECHAS_ENTRE_OFERTAS), asi que anotarla en cada vuelta
        // llenaba el registro con la misma linea repetida. Lo que interesa es que clubes te
        // llamaron a lo largo de la carrera, y eso se ve con los cambios.
        const enLaMesa = botones().filter(b => /Aceptar Traspaso/i.test(texto(b)))
          .map(b => texto(tarjetaDe(b)).replace(/(\d)[^A-Za-zÁÉÍÓÚÑáéíóúñ]*$/, '$1').slice(0, 46));
        const firma = enLaMesa.join(' ;; ');
        if (firma !== ultimaMesa) {
          ultimaMesa = firma;
          appendFileSync(process.env.PROGRESO || 'scripts/ui/progreso.log',
            '      [MESA f' + paso + '] ' + (firma || '(sin ofertas)') + String.fromCharCode(10));
        }
        // Cualquiera de las alternativas de este paso sirve.
        const alternativas = rutaPendiente[0];
        const suOferta = botones().find(b => /Aceptar Traspaso/i.test(texto(b))
          // EMPIEZA CON el nombre, no lo CONTIENE: la tarjeta arranca con el nombre del club
          // ("Napoli🇮🇹 ITA1ª Div$199.200/sem..."), y buscando por contenido "PSV" tambien matchea
          // "Jong PSV" -- el filial. Se pidio fichar por el PSV y se termino en su equipo B.
          && alternativas.some(n => {
            const t = texto(tarjetaDe(b)).toLowerCase();
            // La tarjeta arranca con el nombre del club ("Napoli🇮🇹 ITA1ª Div$199.200/sem..."), y por
            // eso se compara con startsWith: buscando por contenido, "PSV" tambien matchea "Jong
            // PSV" -- el filial -- y se termina fichando por el equipo B.
            //
            // LA VUELTA A CASA ES LA EXCEPCION: esa tarjeta arranca con el motivo ("🏠 El club donde
            // empezaste todo. A los 42, Junior te quiere de vuelta...") y el nombre queda adentro.
            // Sin este caso el banco no la reconocia: el Junior llamo cuatro veces a un jugador de
            // 42 y la carrera termino igual en el Manchester City.
            // EL NOMBRE ENTERO DE LA TARJETA, no un prefijo.
            //
            // La tarjeta pega el nombre del club al pais, sin espacio ("Napoli🇮🇹 ITA1a Div$199.200/sem"),
            // asi que el nombre es todo lo que va antes de la bandera. Comparar con startsWith
            // confunde a los clubes que empiezan igual: "Inter" matcheaba "Inter Miami CF", y dos
            // carreras que pedian un grande europeo terminaron en la MLS. Es el mismo choque que ya
            // tenia "PSV" con "Jong PSV" -- el filial -- pero resuelto de raiz: nombre completo.
            if (t.includes('empezaste todo')) return t.includes(n);
            // El corte es el primer EMOJI (la bandera del pais, o el ⚽ de la MLS). Se busca por
            // codigo y no con una lista de letras: los nombres traen acentos y dieresis
            // ("Atletico de Madrid", "Bayern Munchen") y una clase de caracteres escrita a mano los
            // dejaba afuera, cortando el nombre en la primera letra acentuada.
            let corte = 0;
            while (corte < t.length && t.codePointAt(corte) < 0x2000) corte++;
            const nombreDeLaTarjeta = t.slice(0, corte).trim();
            return nombreDeLaTarjeta === n;
          }));
        if (suOferta) {
          await click(suOferta); await dormir(120);
          let confirmar = botonQueDice(/Confirmar fichaje/i);
          // EL DORSAL PUEDE ESTAR OCUPADO, y ahi confirmar viene DESHABILITADO.
          //
          // El juego propone tu numero actual, y en el club nuevo puede llevarlo otro -- pasa
          // siempre en la VUELTA A CASA: te fuiste, alguien agarro tu 10, y al volver ya no esta
          // libre. El banco apretaba "Aceptar Traspaso" y se quedaba mirando un boton apagado.
          // Medido: Banfield llamo 47 veces a un jugador de 41 y la carrera termino en Inglaterra.
          //
          // Los numeros libres son los botones del selector que NO estan deshabilitados (los
          // ocupados van tachados y con `disabled`). Se elige el primero que haya.
          if (confirmar && confirmar.disabled) {
            const libre = botones().find(x => /^\d{1,2}$/.test(texto(x)) && !x.disabled);
            if (libre) { await click(libre); await dormir(80); confirmar = botonQueDice(/Confirmar fichaje/i); }
          }
          if (confirmar && !confirmar.disabled) {
            await click(confirmar); await dormir(200);
            const recienFichado = rutaPendiente.shift().join(' o ');
            avisos.push('FICHAJE: se acepto el traspaso a ' + recienFichado + ' en la fecha ' + paso);
            appendFileSync(process.env.PROGRESO || 'scripts/ui/progreso.log',
              '      >> FICHADO por ' + recienFichado + ' (fecha ' + paso + ')' + String.fromCharCode(10));
          }
        }
        // Y de vuelta al partido, haya fichado o no.
        const volverAlHub = botonQueDice(/^Carrera$/i);
        if (volverAlHub) { await click(volverAlHub); await dormir(120); }
        continue;
      }
    }


    const prox = proximoPartido();
    // Una fecha se anota UNA vez: volver al dashboard sin que la fecha avance no es un partido nuevo.
    const yaAnotada = bitacora.length && bitacora[bitacora.length - 1].paso === paso;

    // LA COPA EUROPEA, TAMBIEN COMO QUEDO DESPUES.
    //
    // La foto que se toma al anunciar la fecha es la del guardado ANTERIOR al partido, y en el borde
    // entre dos ediciones eso miente: el ultimo partido de una edicion y el primero de la siguiente
    // salen los dos con la edicion vieja. Contando asi, la fase de liga parecia tener nueve partidos
    // cuando el noveno era el primero de la edicion nueva -- tres carreras acusadas por esto.
    // Aca, ya con la fecha avanzada, el guardado dice a que edicion le entro de verdad el resultado.
    if (bitacora.length && !yaAnotada) {
      const previa = bitacora[bitacora.length - 1];
      if (previa.copaEuropea) previa.copaEuropeaDespues = copaEuropeaGuardada(guardada, previa.competicion);
    }
    const anotar = () => {
      if (yaAnotada || !prox?.rival) return;
      const esEuropea = /Champions|Europa/i.test(prox.competicion);
      // SI ESTAS SANCIONADO, HOY NO JUGAS -- y eso no es un partido perdido.
      //
      // La tarjeta anuncia el proximo partido igual, pero el motor te lo saltea porque estas
      // cumpliendo la fecha. Sin anotarlo, el chequeo de "prometido y no jugado" acusaba al juego de
      // perder partidos que en realidad no te tocaba jugar.
      //
      // Aparecio al ponderar la eleccion del partido simulado: hasta entonces el jugador virtual
      // elegia SIEMPRE la opcion mas segura, no fallaba nunca de la forma que provoca una falta, y
      // en 19 carreras de tres temporadas -- unos 2500 partidos -- no habia visto NI UNA tarjeta.
      // Las sanciones existian en el codigo y no se ejecutaban jamas.
      bitacora.push({ paso, temporada: temp, ...prox, marcador: '',
        sancionado: (guardada?.suspendedMatches ?? 0) > 0,
        // EL CLUB DE ESE DIA, que con traspasos ya no es el de partida. Sin esto los chequeos
        // comparaban contra el club donde arrancaste: al que se fue del Ajax al Betis y le toco el
        // Ajax en Europa se lo acusaba de "enfrentarse a si mismo".
        miClub: clubDeAhora,
        copaEuropea: esEuropea ? copaEuropeaGuardada(guardada, prox.competicion) : null });
      const n = bitacora.length;
      const c = esEuropea ? copaEuropeaGuardada(guardada, prox.competicion) : null;
      const cu = copaEuropeaGuardada(guardada, prox.competicion);
      const el = /Eliminatorias/i.test(prox.competicion) ? eliminatoriaGuardada(guardada) : null;
      const cb = /Libertadores|Sudamericana|Concacaf/i.test(prox.competicion) ? copaConmebolGuardada(guardada) : null;
      const cn = /Copa |Cup|Pokal|Coppa|Coupe|Taça|Beker/i.test(prox.competicion) && !/Libertadores|Sudamericana|Concacaf|Champions|Europa|Mundial/i.test(prox.competicion)
        ? copaNacionalGuardada(guardada) : null;
      const relojCn = cn ? ' {nacional rondas=' + cn.rondas + ' llaves=' + cn.llaves + ' miIda=' + cn.miIda + ' jugada=' + cn.miaJugada + ' unico=' + cn.unico + '}' : '';
      const relojCua = prox.rival === 'RIVAL SIN SORTEAR' ? ' {cuadrangular ' + cuadrangularGuardado(guardada) + '}' : '';
      const relojCb = cb ? ' {conmebol ' + cb.etapa + ' pasos=' + cb.pasos + ' rondas=' + cb.rondas + ' miIda=' + cb.idaJugada + ' todasIda=' + cb.todasLaIda + '}' : '';
      const relojElim = el
        ? ' {elim ' + el.clave + ' pasos=' + el.pasos + ' jugados=' + el.jugados + '}'
        : (/Eliminatorias/i.test(prox.competicion) ? ' {elim SIN GUARDAR}' : '');
      const reloj = cu ? ` {copa ${cu.etapa} pasos=${cu.pasos} desde=${cu.arranco} campeon=${cu.campeon ?? '-'}}` : '';
      const marca = relojCua + relojCb + relojCn + (c ? ` ★ [el juego anota: ${c.pj} PJ, ${c.pts} pts]` : esEuropea ? ' ★' : '') + reloj;
      const linea = relojElim + '  ' + String(n).padStart(3) + '. T' + temp + ' f' + paso + ' | ' + (prox.competicion || '(sin cartel)') + ' | ' + (prox.jornada || '—') + ' | ' + prox.localia + ' vs ' + prox.rival + marca;
      if (verboso) console.log(linea);
      // A DISCO EN EL ACTO. Node bufferea stdout cuando se redirige a un archivo, asi que en una
      // corrida larga no hay forma de ver como va: el log aparece entero al final, o no aparece.
      try { appendFileSync(process.env.PROGRESO || 'scripts/ui/progreso.log', linea + "\n"); } catch (e) { /* no importa */ }
    };

    // "Simular partido" SIEMPRE que esté, aunque no se haya podido leer el rival de la tarjeta.
    // Antes se exigía haber leído el rival, y cuando el lector fallaba el banco se metía a jugar el
    // partido a mano -- que es donde se cuelga.
    const simular = botonQueDice(/Simular partido/i);
    if (simular) {
      anotar();
      await click(simular); await dormir(60); continue;
    }

    // Sin partido que simular: avanzar la fecha con el botón principal.
    const principal = botonQueDice(/Disputar Partido|Pasar a Siguiente Fecha|Finalizar Temporada|Jugar lesionado|Recuperándose/i);
    if (principal) {
      anotar();
      await click(principal); await dormir(80); continue;
    }
    await dormir(100);
  }

  const gasto = [...gastoPorPantalla].sort((x, y) => y[1] - x[1])
    .map(([k, ms]) => `${k}=${(ms / 1000).toFixed(0)}s`).join(' ');
  return { bitacora, avisos, pasos, gasto, motivoDelFinal, retirado, guardada: partidaGuardada() };
}
