// Juega una carrera ENTERA, temporada tras temporada.
//
//   npx vite-node scripts/jugar_carrera_larga.ts "Junior de Barranquilla" 8
//
// QUÉ CUBRE ESTO QUE NO CUBRA jugar_carrera.ts
//
// Aquél juega UNA temporada con el calendario real, fecha por fecha: quién es el rival de hoy, si la
// copa corona campeón, si el cuadrangular termina. Es el detalle de un año.
//
// Éste juega la carrera. Y hay un montón de reglas que SÓLO existen entre temporadas y que por eso
// nunca se habían jugado de punta a punta:
//
//   . la marca personal, que aprieta a medida que crecés
//   . la forma decidiendo el once, que te sienta cuando bajás el nivel
//   . el rival del puesto, que juega las fechas que vos no jugás y acumula números
//   . la lista de transferibles, que tarda DOS temporadas en llegar a la venta
//
// Ninguna de esas cuatro se puede ver en una sola temporada. La lista, literalmente: el club te
// avisa un año y te vende al siguiente.
//
// LO QUE NO HACE, y queda dicho: no camina el calendario fecha por fecha ni resuelve copas. Los
// partidos de cada temporada se resuelven con el mismo simulateMatch que usa el resto del mundo. La
// pregunta que contesta no es "¿la copa corona?" -- eso ya lo contesta el otro -- sino "¿la carrera
// se sostiene diez años sin romperse ni volverse aburrida?".

import { CLUBS_DATABASE } from '../src/data';
import { simulateMatch, leagueKeyFor } from '../src/leagueEngine';
import { clubesDeLiga } from '../src/clubesJugables';
import { anotarNota, evaluarForma, ajusteDeFormaEnElOnce } from '../src/forma';
import { factorDeMarcaPersonal } from '../src/dificultad';
import {
  estorboDelRival, jugarFechaDelRival, anotarFechaDelRival, promedioDelRival,
  type RivalDePuesto,
} from '../src/rivalDePuesto';
import { evolucionDeLaLista, exigenciaPorLoQueValés } from '../src/listaDeTransferibles';
import { secuelaDeLaLesion } from '../src/secuela';
import { sortearTipoDeLesion, riesgoDeLesion } from '../src/lesion';
import { chanceDeAcertar, MOMENTOS_POR_PARTIDO, prestigioDeLaJugada, CUANTO_VALE_UN_PUNTO } from '../src/decisionDelPartido';
import { olvidoDeLaTemporada, prestigioDespuesDelOlvido } from '../src/elOlvido';
import { POOLS_DE_DECISION } from '../src/components/MatchSimulator';
import type { Club, PlayerStats, InjuryType } from '../src/types';
import type { NotaDePartido } from '../src/forma';

const NOMBRE = process.argv[2] || 'Junior de Barranquilla';
const TEMPORADAS = Math.max(1, Number(process.argv[3]) || 8);
const PARTIDOS_POR_TEMPORADA = 38;

const club0 = (CLUBS_DATABASE as Club[]).find(c => c.name === NOMBRE);
if (!club0) {
  console.log(`No hay ningún club llamado "${NOMBRE}".`);
  process.exit(1);
}

const rarezas: string[] = [];
const raro = (q: string) => { if (!rarezas.includes(q)) rarezas.push(q); };

// --- El jugador, tal como lo ven las reglas que se están probando ------------------------------
const carrera = {
  clubId: club0.id,
  edad: 17,
  prestige: 50,     // el mismo con el que arranca una carrera de verdad (ver SetupScreen)
  // LOS SEIS ATRIBUTOS, no un promedio. Hasta acá esta carrera llevaba un solo número, y con eso la
  // secuela de la lesión era invisible: redistribuir entre atributos que no existen no se ve. El
  // promedio sigue estando (`media()`), pero ahora es una lectura y no la fuente.
  atributos: { ritmo: 62, regate: 62, tiro: 62, pase: 62, defensa: 62, fisico: 62 } as PlayerStats,
  // El cuerpo.
  lesiones: [] as { type: InjuryType; weeksOut: number; temporada: number; week: number }[],
  secuelas: [] as string[],
  fechasAfuera: 0,
  totalFechasAfuera: 0,
  sinDescanso: 0,
  lesionEnCurso: null as { type: InjuryType; weeksOut: number } | null,
  // El 5% del plantel de tu club, igual que crearPerfilInicial en SetupScreen. Ponerle un numero
  // fijo -- 800.000 era el que tenia antes -- hacia que en Envigado (plantel de 2M) el juvenil
  // pesara el 38% del equipo y arrancara con la exigencia al maximo, cuando en el juego arranca
  // siempre en el mismo punto de la escala sin importar donde juegue.
  marketValue: Math.round(club0.marketValue * 0.05),
  formaReciente: [] as NotaDePartido[],
  fichajeRival: undefined as RivalDePuesto | undefined,
  listaDeTransferibles: undefined as any,
  // acumulados de toda la carrera
  partidos: 0, goles: 0, asistencias: 0, titulares: 0, banco: 0,
};

const NOMBRES_DE_REFUERZO = [
  'Matías Ferreyra', 'Diego Sanabria', 'Lucas Ospina', 'Bruno Cardozo', 'Iván Mendoza',
  'Tomás Villalba', 'Kevin Restrepo', 'Andrés Quintero', 'Rodrigo Cabral', 'Nicolás Duarte',
];

/** "-3 ritmo +2 pase", para la bitacora. */
const resumen = (c: Partial<Record<keyof PlayerStats, number>>) =>
  (Object.entries(c) as [keyof PlayerStats, number][])
    .map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${k}`).join(' ');

/** El promedio de los seis, que es lo que las reglas viejas llaman "atributos". */
const media = () => Object.values(carrera.atributos).reduce((x, y) => x + y, 0) / 6;

/**
 * EL SORTEO DE LA LESION, con el catalogo y las probabilidades DEL JUEGO -- no con unas inventadas
 * aca. Es la unica forma de que lo que mide este banco de pruebas sea el juego y no una maqueta.
 *
 * El tipo se elige uniforme, igual que en handleFinishMatch, y de ahi sale el dato que obligo a
 * reescribir la regla de la secuela: una de cada cuatro lesiones es fractura.
 */
const sorteoDeLesion = (partidosSinDescanso: number) => {
  if (Math.random() >= riesgoDeLesion(partidosSinDescanso)) return null;
  const tipo = sortearTipoDeLesion(Math.random());
  const fechas = tipo.minWeeks + Math.floor(Math.random() * (tipo.maxWeeks - tipo.minWeeks + 1));
  return { type: tipo.id, fechas };
};

/**
 * CUANTOS PARTIDOS SEGUIDOS AGUANTAS ANTES DE PARAR.
 *
 * En el juego el descanso lo pide la energia: jugas hasta que no da y perdes una fecha. Aca no hay
 * barra de energia, asi que se aproxima con un numero fijo, y se deja dicho que es una aproximacion.
 * Con el tope de fatiga ya puesto (RIESGO_MAXIMO_POR_FATIGA) el numero exacto casi no mueve la
 * aguja, que es justamente uno de los motivos para topearla.
 */
const PARTIDOS_ANTES_DE_DESCANSAR = 5;

/** El puesto del jugador de prueba. Manda que bolsa de decisiones se juega. */
const PUESTO = 'Mediocampista' as const;

const bitacora: string[] = [];
/** Temporadas seguidas sin arrancar un solo partido. Ver el bloque de cierre de temporada. */
let temporadasSinArrancar = 0;
let paso = 0;

for (let t = 1; t <= TEMPORADAS; t++) {
  const club = (CLUBS_DATABASE as Club[]).find(c => c.id === carrera.clubId)!;
  const rivalesDeLiga = clubesDeLiga(leagueKeyFor(club)).filter(c => c.id !== club.id);
  if (!rivalesDeLiga.length) { raro(`${club.name} no tiene rivales en su liga: la temporada ${t} no se puede jugar`); break; }

  // La vara de titularidad, con todo lo que la mueve. Es la misma cuenta que decideLineupStatus.
  const umbral = () => 25 + club.reputation * 11
    + estorboDelRival(carrera.fichajeRival, paso)
    + ajusteDeFormaEnElOnce(evaluarForma(carrera.formaReciente, paso))
    + exigenciaPorLoQueValés(carrera.marketValue, club.marketValue);

  // TRES contadores, no dos. `bancoEsteAnio` mezclaba "no me convocaron" con "entre desde el
  // banco", y para el olvido esas dos cosas no se parecen en nada: una es no jugar y la otra es
  // jugar media hora.
  let titularEsteAnio = 0, bancoEsteAnio = 0, suplenteEsteAnio = 0, golesEsteAnio = 0;

  for (let j = 0; j < PARTIDOS_POR_TEMPORADA; j++) {
    paso++;

    // LOS TRES ESTADOS DEL JUEGO, no dos. Éste es el primer hallazgo de encadenar temporadas: la
    // versión anterior de este script trataba "no titular" como "no juega", y con eso un pibe de 17
    // en un club de reputación 5 -- que pide 80 de prestigio para ser titular -- se pasaba doce
    // temporadas en el banco sin sumar un minuto ni un punto de prestigio. Una espiral sin fondo.
    //
    // En el juego no es así: el suplente ENTRA, alrededor del minuto 46 al 75 (ver
    // activeSubEntryMinute en App.tsx). Juega menos, marca menos y crece más lento, pero crece. Sin
    // esa puerta no habría forma de empezar una carrera en un club grande.
    const vara = umbral();
    const soyTitular = carrera.prestige >= vara;
    const meLlaman = carrera.prestige > Math.max(0, club.reputation * 7 - 15);
    if (!soyTitular && !meLlaman) {
      bancoEsteAnio++;
      carrera.banco++;
      carrera.sinDescanso = 0;   // no te convocan = descansaste, igual que en el juego
      if (carrera.fichajeRival) {
        carrera.fichajeRival = anotarFechaDelRival(carrera.fichajeRival, jugarFechaDelRival(carrera.fichajeRival.nivel ?? 72));
      }
      continue;
    }

    if (soyTitular) { titularEsteAnio++; carrera.titulares++; }
    else {
      bancoEsteAnio++; suplenteEsteAnio++; carrera.banco++;
      // Entrando desde el banco jugás media hora: el rival del puesto arrancó ese partido.
      if (carrera.fichajeRival) {
        carrera.fichajeRival = anotarFechaDelRival(carrera.fichajeRival, jugarFechaDelRival(carrera.fichajeRival.nivel ?? 72));
      }
    }

    // Seguis roto de antes? Entonces esta fecha la miras desde afuera.
    if (carrera.fechasAfuera > 0) {
      carrera.fechasAfuera--;
      carrera.sinDescanso = 0;
      if (carrera.fechasAfuera === 0 && carrera.lesionEnCurso) {
        // AL CURARSE, Y SOLO ACA, se tira el dado de la secuela.
        const l = carrera.lesionEnCurso;
        const sec = secuelaDeLaLesion({
          tipo: l.type, semanasAfuera: l.weeksOut, edad: carrera.edad, posicion: 'MC',
          atributos: carrera.atributos, semanaActual: paso, historial: carrera.lesiones,
        }, Math.random());
        carrera.lesiones.push({ type: l.type, weeksOut: l.weeksOut, temporada: t, week: paso });
        if (sec) {
          for (const [k, v] of Object.entries(sec.cambios) as [keyof PlayerStats, number][]) {
            carrera.atributos[k] = Math.max(30, Math.min(99, carrera.atributos[k] + v));
          }
          carrera.secuelas.push(`T${t} - ${carrera.edad}a - ${l.type} ${l.weeksOut}f - ${resumen(sec.cambios)}`);
        }
        carrera.lesionEnCurso = null;
      }
      continue;
    }

    const rival = rivalesDeLiga[Math.floor(Math.random() * rivalesDeLiga.length)];
    const sim = simulateMatch(club, rival);

    // --- EL PARTIDO, JUGADO CON LAS DECISIONES DE VERDAD ------------------------------------
    //
    // Hasta aca este bloque tenia su PROPIA cuenta de prestigio: una formula sobre la nota del
    // partido -- (nota - 6.2) * 0.55 -- que no existe en ningun lado del juego. Y como el prestigio
    // decide si sos titular, esa formula inventada decidia la carrera entera. Peor: era la que yo
    // miraba para decir si el juego estaba balanceado.
    //
    // Ahora se juegan los CUATRO MOMENTOS del partido con el pool real de decisiones de tu puesto,
    // con la misma chanceDeAcertar que usa MatchSimulator, y el prestigio es la suma de los efectos
    // de esas jugadas -- que es literalmente como se mueve en el juego.
    //
    // La eleccion de opcion es la del jugador promedio: la del medio de las tres. No es la mejor ni
    // la peor, y sobre todo no es una que "sabe" cual conviene, que seria medir a un jugador que no
    // existe.
    const marca = factorDeMarcaPersonal(media(), carrera.prestige);
    const minutos = soyTitular ? 1 : 0.35;

    // La presion: tabla, hinchada y cabeza no se modelan aca, asi que queda la marca sola, que es
    // la parte que SI depende de lo que sos. Se deja dicho que es una aproximacion.
    const presion = marca;
    const momentos = Math.max(1, Math.round(MOMENTOS_POR_PARTIDO * minutos));

    let prestigioDelPartido = 0;
    let golesDeJugada = 0, asisDeJugada = 0, aciertos = 0;
    for (let m = 0; m < momentos; m++) {
      const bolsa = m < momentos / 2 ? POOLS_DE_DECISION[PUESTO].early : POOLS_DE_DECISION[PUESTO].late;
      const decision = bolsa[Math.floor(Math.random() * bolsa.length)];

      // EL PENAL Y EL TIRO LIBRE no tienen las tres opciones: van por el minijuego de puntería y
      // reparten prestigio con su propia tabla (ver el bloque de kickMode en MatchSimulator). Un
      // `choices: []` en el catalogo no es un catalogo roto -- es esto.
      if (decision.kickMode) {
        const esPenal = decision.kickMode === 'penalty';
        const entra = Math.random() < (esPenal ? 0.72 : 0.34);
        prestigioDelPartido += (entra ? (esPenal ? 5 : 10) : (esPenal ? -8 : -2)) * CUANTO_VALE_UN_PUNTO;
        if (entra) { golesDeJugada++; aciertos++; }
        continue;
      }

      const opcion = decision.choices[Math.min(1, decision.choices.length - 1)];
      const chance = chanceDeAcertar({
        atributo: carrera.atributos[opcion.requiredAttr as keyof PlayerStats],
        minVal: opcion.minVal,
        successChance: opcion.successChance,
        presion,
        marcaFactor: marca,
        ruido: Math.random() - 0.5,
      });
      const acerto = Math.random() < chance;
      if (acerto) aciertos++;
      // Los efectos de exito y de fallo NO tienen la misma forma: solo el exito puede traer gol o
      // asistencia. El tipo lo dice y conviene respetarlo en vez de castearlo.
      // La MISMA cuenta que el partido de verdad, escala y situacion incluidas. El minuto sale del
      // momento que se esta jugando, repartido como los reparte getDecisionMinutes.
      prestigioDelPartido += prestigioDeLaJugada(
        (acerto ? opcion.effectOnSuccess.prestige : opcion.effectOnFail.prestige) ?? 0,
        {
          successChance: opcion.successChance,
          minuto: [16, 38, 61, 83][m] ?? 61,
          golesMios: sim.homeGoals, golesRival: sim.awayGoals,
          exito: acerto,
        });
      if (acerto) {
        golesDeJugada += opcion.effectOnSuccess.goals ?? 0;
        asisDeJugada += opcion.effectOnSuccess.assists ?? 0;
      }
    }

    // Los goles ambientales que no salen de una decision tuya, con la marca apretando igual.
    const chanceDeGol = Math.min(0.85, (media() / 140)) * marca * minutos * 0.5;
    const goles = golesDeJugada + (Math.random() < chanceDeGol ? 1 : 0);
    const asis = asisDeJugada + (Math.random() < chanceDeGol * 0.7 ? 1 : 0);

    // La nota ya no decide el prestigio: solo alimenta la forma, que es para lo que existe.
    const gano = sim.homeGoals > sim.awayGoals;
    const nota = Math.max(3.5, Math.min(10,
      5.8 + aciertos * 0.45 + goles * 0.9 + asis * 0.5 + (gano ? 0.4 : -0.3) + (Math.random() - 0.5) * 1.0));

    carrera.formaReciente = anotarNota(carrera.formaReciente, nota, paso);
    carrera.partidos++; carrera.goles += goles; carrera.asistencias += asis;
    golesEsteAnio += goles;

    // EL PRESTIGIO ES LA SUMA DE LAS JUGADAS, igual que en handleFinishMatch.
    carrera.prestige = Math.max(0, Math.min(100, carrera.prestige + Math.round(prestigioDelPartido)));

    // Y recien ahora el cuerpo pasa la cuenta del partido jugado.
    carrera.sinDescanso++;
    if (carrera.sinDescanso >= PARTIDOS_ANTES_DE_DESCANSAR) carrera.sinDescanso = 0;
    const nueva = sorteoDeLesion(carrera.sinDescanso);
    if (nueva) {
      carrera.lesionEnCurso = { type: nueva.type, weeksOut: nueva.fechas };
      carrera.fechasAfuera = nueva.fechas;
      carrera.totalFechasAfuera += nueva.fechas;
    }
  }

  // --- CIERRE DE TEMPORADA: acá es donde viven las reglas que se están probando ----------------
  carrera.edad++;
  // Crece con lo que jugaste: el que no juega no mejora, que es la mitad del sentido del banco.
  const crecimiento = titularEsteAnio >= 20 ? 3 : titularEsteAnio >= 10 ? 1 : 0;
  for (const k of Object.keys(carrera.atributos) as (keyof PlayerStats)[]) {
    carrera.atributos[k] = Math.min(99, carrera.atributos[k] + crecimiento);
  }

  // EL DECLIVE FISICO, con la misma regla que applyAgingIfNewSeason: de los 32 en adelante se caen
  // ritmo y fisico, dos puntos por temporada. Faltaba, y no era un detalle -- sin declive, el
  // jugador de este banco de pruebas llegaba a los 37 con los atributos en 99 y jugando 38 partidos
  // por temporada. Con eso NINGUNA regla de final de carrera se podia probar: ni el olvido, ni el
  // retiro escalonado, ni el club que te formo. El banco simplemente no tenia veteranos.
  if (carrera.edad >= 32) {
    carrera.atributos.ritmo = Math.max(15, carrera.atributos.ritmo - 2);
    carrera.atributos.fisico = Math.max(15, carrera.atributos.fisico - 2);
  }
  carrera.prestige = Math.round(carrera.prestige);
  carrera.marketValue = Math.round(carrera.marketValue * (1 + crecimiento * 0.25 - (bancoEsteAnio > 20 ? 0.15 : 0)));

  // Un refuerzo para tu puesto, con la misma regla que applyRefuerzoIfNewSeason.
  if (!carrera.fichajeRival && Math.random() < 0.35 * (club.reputation / 5) * Math.max(0.3, 1 - carrera.prestige / 130)) {
    carrera.fichajeRival = {
      nombre: NOMBRES_DE_REFUERZO[Math.floor(Math.random() * NOMBRES_DE_REFUERZO.length)],
      posicion: 'MC', desdeSemana: paso,
      nivel: Math.round(62 + club.reputation * 4 + Math.random() * 8),
      partidos: 0, goles: 0, asistencias: 0, sumaDeNotas: 0,
    };
  }

  // EL OLVIDO. Va antes de la lista de transferibles a proposito: el club decide si te pone en la
  // lista mirando el prestigio que tenes DESPUES de que la temporada te desgastara, no antes.
  const datosDelOlvido = {
    titularidades: titularEsteAnio,
    suplencias: suplenteEsteAnio,
    promedioDeNota: evaluarForma(carrera.formaReciente, paso).promedio,
    edad: carrera.edad,
    prestigioActual: carrera.prestige,
    campeonatos: 0,
    balonesDeOro: 0,
  };
  const olvidoDeEsteAnio = olvidoDeLaTemporada(datosDelOlvido);
  carrera.prestige = prestigioDespuesDelOlvido(datosDelOlvido);

  const forma = evaluarForma(carrera.formaReciente, paso);
  const estorbo = estorboDelRival(carrera.fichajeRival, paso);
  // El mismo filtro que App: el destino tiene que tener liga jugable, o la carrera se queda sin
  // rivales. Es el bug que esta corrida encontro.
  const candidatos = (CLUBS_DATABASE as Club[]).filter(c =>
    c.league === club.league && c.id !== club.id && c.reputation <= Math.max(1, club.reputation - 1)
    && clubesDeLiga(leagueKeyFor(c)).some(x => x.id === c.id));
  const destino = candidatos[Math.floor(Math.random() * candidatos.length)];

  const r = evolucionDeLaLista(
    { prestige: carrera.prestige, listaDeTransferibles: carrera.listaDeTransferibles, fichajeRival: carrera.fichajeRival, currentClubId: carrera.clubId },
    {
      promedioDeForma: forma.promedio,
      estorboDelRival: estorbo,
      reputacionDelClub: club.reputation,
      destinoSiTeVenden: destino ? { id: destino.id, nombre: destino.name } : null,
      semana: paso,
    });
  carrera.prestige = r.perfil.prestige;
  carrera.listaDeTransferibles = r.perfil.listaDeTransferibles;
  carrera.fichajeRival = r.perfil.fichajeRival as RivalDePuesto | undefined;
  carrera.clubId = r.perfil.currentClubId;

  // EL JUGADOR TAMBIEN DECIDE, y hasta ahora este banco de pruebas no lo dejaba.
  //
  // La lista de transferibles modela que el CLUB se canse de vos. Faltaba lo otro: que vos te
  // canses. Sin eso, un suplente eterno se quedaba veinte temporadas en el mismo club sin jugar
  // nunca de titular -- medido: tres de cada cinco carreras de veinte temporadas terminaban con
  // CERO titularidades. No es un bug del juego: la vara de titularidad es la misma que usa
  // decideLineupStatus y esta bien. Es que un futbolista de verdad, despues de dos anios sin
  // arrancar un partido, se va a un club mas chico donde si va a jugar. El juego lo permite (el
  // mercado esta ahi); el banco de pruebas no lo hacia.
  if (titularEsteAnio === 0) temporadasSinArrancar++; else temporadasSinArrancar = 0;
  if (temporadasSinArrancar >= 2 && destino && !r.vendidoA) {
    carrera.clubId = destino.id;
    carrera.prestige = Math.max(5, carrera.prestige - 3);   // bajar de categoria cuesta algo
    carrera.fichajeRival = undefined;
    temporadasSinArrancar = 0;
    bitacora.push(`      -> se cansa del banco y se va a ${destino.name}`);
  }

  const marca = factorDeMarcaPersonal(media(), carrera.prestige);
  const estado = r.vendidoA ? `VENDIDO a ${r.vendidoA.nombre}`
    : r.teQuedaste ? 'salió de la lista'
    : carrera.listaDeTransferibles ? `EN LA LISTA (${carrera.listaDeTransferibles.temporadas + 1}ª temporada)`
    : '';
  bitacora.push(
    `  T${String(t).padStart(2)} · ${String(carrera.edad).padStart(2)}a · ${club.name.slice(0, 20).padEnd(20)} ` +
    `${String(titularEsteAnio).padStart(2)}T/${String(bancoEsteAnio).padStart(2)}B · ${String(golesEsteAnio).padStart(2)}g · ` +
    `pres ${String(carrera.prestige).padStart(2)}${olvidoDeEsteAnio >= 1 ? `(-${Math.round(olvidoDeEsteAnio)})` : ''} · atr ${String(Math.round(media())).padStart(2)} · marca x${marca.toFixed(2)}` +
    (carrera.fichajeRival ? ` · vs ${carrera.fichajeRival.nombre.split(' ')[0]} (${promedioDelRival(carrera.fichajeRival) ?? '-'})` : '') +
    (estado ? `  ${estado}` : ''));
}

console.log(`===== CARRERA LARGA: ${NOMBRE} · ${TEMPORADAS} temporadas =====\n`);
for (const l of bitacora) console.log(l);

console.log(`\n--- LA CARRERA ---`);
console.log(`   ${carrera.partidos} partidos · ${carrera.goles} goles · ${carrera.asistencias} asistencias`);
console.log(`   ${carrera.titulares} de titular · ${carrera.banco} en el banco`);
console.log(`   terminó en ${(CLUBS_DATABASE as Club[]).find(c => c.id === carrera.clubId)?.name} con prestigio ${carrera.prestige}`);

// --- INVARIANTES: lo que una carrera no puede hacer ---------------------------------------------
//
// No se comprueba "salió bien" sino que no haya pasado nada IMPOSIBLE. Una carrera puede terminar
// mal -- ése es el punto de que el mundo reaccione -- pero no puede quedarse trabada.
if (carrera.partidos === 0) raro('la carrera entera sin un solo partido de titular');

// LA RED TENIA UN AGUJERO, y lo encontro enseñarle a lesionarse.
//
// El invariante era `banco > titulares * 4 && titulares > 0`, y ese `&& titulares > 0` dejaba pasar
// justo el peor caso: la carrera con CERO titularidades. Medido con las lesiones apagadas, dos de
// tres corridas de veinte temporadas terminaban con 0 de titular y 760 de banco, y ninguna avisaba
// nada -- el guard estaba puesto para no dividir por cero y terminó tapando la unica carrera que de
// verdad esta trabada, que es la que este invariante existia para encontrar.
//
// Y la version vieja ademas se disparaba con una carrera legitima: 76 titularidades en veinte
// temporadas, con 132 fechas perdidas por lesion, es un suplente de toda la vida. Triste, pero no
// imposible -- y este archivo comprueba lo IMPOSIBLE, no lo que salio mal.
if (carrera.titulares === 0 && carrera.partidos > 50) {
  raro(`${carrera.partidos} partidos y ni UNA titularidad en toda la carrera: la vara no baja nunca`);
}
if (carrera.titulares > 0 && carrera.goles === 0) raro('jugó de titular toda la carrera y no marcó nunca');

console.log(`
--- EL CUERPO ---`);
console.log(`   ${carrera.lesiones.length} lesiones - ${carrera.totalFechasAfuera} fechas afuera`);
const porTipo = carrera.lesiones.reduce((m, l) => ({ ...m, [l.type]: (m[l.type] ?? 0) + 1 }), {} as Record<string, number>);
console.log(`   ${Object.entries(porTipo).map(([x, v]) => `${v} ${x}`).join(' - ') || 'ninguna'}`);
console.log(`   secuelas: ${carrera.secuelas.length}`);
for (const x of carrera.secuelas) console.log(`     . ${x}`);
console.log(`   atributos finales: ${(Object.entries(carrera.atributos) as [string, number][]).map(([x, v]) => `${x} ${v}`).join(' - ')}`);

// UNA SECUELA POR CARRERA ES UNA HISTORIA; CUATRO SON UNA CINTA TRANSPORTADORA. Este invariante es
// el que atrapo a la primera version de la regla, que dejaba una secuela cada dos temporadas.
if (carrera.secuelas.length > Math.max(2, TEMPORADAS / 6)) {
  raro(`${carrera.secuelas.length} secuelas en ${TEMPORADAS} temporadas: la lesion que cambia el estilo dejo de ser excepcional`);
}

console.log(`\n--- RAREZAS ENCONTRADAS ---`);
if (!rarezas.length) console.log('   ninguna');
for (const r of rarezas) console.log(`   · ${r}`);
process.exit(rarezas.length ? 1 : 0);
