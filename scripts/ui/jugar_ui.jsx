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
import { appendFileSync } from 'fs';
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
function copaEuropeaGuardada(guardada) {
  const copas = guardada?.uefaCups ?? {};
  const id = copas.champions ? 'champions' : copas.europa ? 'europa' : null;
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

export async function jugar({ club = 'Borussia Dortmund', liga = 'Alemana', temporadas = 2, maxPasos = 6000, verboso = true } = {}) {
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

  const pantalla = () => hayCeremonia() ? 'ceremonia' : hayDialogo() ? 'dialogo'
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
    if (Date.now() > limite) {
      avisos.push('ATASCO por tiempo en la fecha ' + ultimoPaso + '. Pantalla: ' + pantalla());
      break;
    }
    if (pasos - vueltaDelUltimoAvance > 300) {
      // Los BOTONES, no sólo el texto: cuando el banco se traba es porque no encontró qué apretar,
      // y la lista de lo que había en pantalla es lo único que lo explica.
      const rotulos = botones().map(b => texto(b)).filter(Boolean).slice(0, 40);
      avisos.push('ATASCO en la fecha ' + ultimoPaso + '. Pantalla: ' + pantalla()
        + '. Botones: [' + rotulos.join(' | ') + ']. Dice: ' + texto(document.body).slice(0, 500));
      break;
    }

    // Ceremonia de fichaje (portada + entrevista): se sale por el final, no tiene cerrar.
    if (hayCeremonia()) {
      const b = botonQueDice(/Continuar|Siguiente|Terminar|Listo|Empezar|Firmar/i) ?? botones().at(-1);
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
    if (!hub) { await dormir(100); continue; }

    const guardada = partidaGuardada();
    const paso = guardada?.currentWeek ?? -1;
    // La temporada la calcula el JUEGO a partir del paso: el perfil no la guarda como número, y
    // leyendo un campo inexistente toda la carrera salía como 'temporada 1'.
    const temp = paso > 0 ? temporadaDeCarrera(club, paso) : 1;
    if (paso !== ultimoPaso) vueltaDelUltimoAvance = pasos;
    ultimoPaso = paso;
    if (temp > temporadas) break;

    const prox = proximoPartido();
    // Una fecha se anota UNA vez: volver al dashboard sin que la fecha avance no es un partido nuevo.
    const yaAnotada = bitacora.length && bitacora[bitacora.length - 1].paso === paso;
    const anotar = () => {
      if (yaAnotada || !prox?.rival) return;
      const esEuropea = /Champions|Europa/i.test(prox.competicion);
      bitacora.push({ paso, temporada: temp, ...prox, marcador: '', copaEuropea: esEuropea ? copaEuropeaGuardada(guardada) : null });
      const n = bitacora.length;
      const c = esEuropea ? copaEuropeaGuardada(guardada) : null;
      const cu = copaEuropeaGuardada(guardada);
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
  return { bitacora, avisos, pasos, gasto, guardada: partidaGuardada() };
}
